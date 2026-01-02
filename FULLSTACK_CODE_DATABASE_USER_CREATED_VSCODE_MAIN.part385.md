---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 385
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 385 of 552)

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

---[FILE: src/vs/workbench/contrib/debug/test/browser/debugSession.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/test/browser/debugSession.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ThreadStatusScheduler } from '../../browser/debugSession.js';


suite('DebugSession - ThreadStatusScheduler', () => {
	const ds = ensureNoDisposablesAreLeakedInTestSuite();

	test('cancel base case', async () => {
		const scheduler = ds.add(new ThreadStatusScheduler());

		await scheduler.run(Promise.resolve([1]), async (threadId, token) => {
			assert.strictEqual(threadId, 1);
			assert.strictEqual(token.isCancellationRequested, false);
			scheduler.cancel([1]);
			assert.strictEqual(token.isCancellationRequested, true);
		});
	});

	test('cancel global', async () => {
		const scheduler = ds.add(new ThreadStatusScheduler());

		await scheduler.run(Promise.resolve([1]), async (threadId, token) => {
			assert.strictEqual(threadId, 1);
			assert.strictEqual(token.isCancellationRequested, false);
			scheduler.cancel(undefined);
			assert.strictEqual(token.isCancellationRequested, true);
		});
	});

	test('cancels when new work comes in', async () => {
		const scheduler = ds.add(new ThreadStatusScheduler());
		let innerCalled = false;

		await scheduler.run(Promise.resolve([1]), async (threadId, token1) => {
			assert.strictEqual(threadId, 1);
			assert.strictEqual(token1.isCancellationRequested, false);
			await scheduler.run(Promise.resolve([1]), async (_threadId, token2) => {
				innerCalled = true;
				assert.strictEqual(token1.isCancellationRequested, true);
				assert.strictEqual(token2.isCancellationRequested, false);
			});
		});

		assert.strictEqual(innerCalled, true);
	});

	test('cancels slower lookups when new lookup is made', async () => {
		const scheduler = ds.add(new ThreadStatusScheduler());
		const innerCalled1: number[] = [];
		const innerCalled2: number[] = [];

		await Promise.all([
			scheduler.run(Promise.resolve().then(() => { }).then(() => [1, 3]), async threadId => {
				innerCalled1.push(threadId);
			}),
			scheduler.run(Promise.resolve([1, 2]), async threadId => {
				innerCalled2.push(threadId);
			})
		]);

		assert.deepEqual(innerCalled1, [3]);
		assert.deepEqual(innerCalled2, [1, 2]);
	});

	test('allows work with other IDs', async () => {
		const scheduler = ds.add(new ThreadStatusScheduler());
		let innerCalled = false;

		await scheduler.run(Promise.resolve([1]), async (threadId, token1) => {
			assert.strictEqual(threadId, 1);
			assert.strictEqual(token1.isCancellationRequested, false);
			await scheduler.run(Promise.resolve([2]), async (_threadId, token2) => {
				innerCalled = true;
				assert.strictEqual(token1.isCancellationRequested, false);
				assert.strictEqual(token2.isCancellationRequested, false);
			});
		});

		assert.strictEqual(innerCalled, true);
	});

	test('cancels when called during reslution', async () => {
		const scheduler = ds.add(new ThreadStatusScheduler());
		let innerCalled = false;

		await scheduler.run(Promise.resolve().then(() => scheduler.cancel([1])).then(() => [1]), async () => {
			innerCalled = true;
		});

		assert.strictEqual(innerCalled, false);
	});

	test('global cancels when called during reslution', async () => {
		const scheduler = ds.add(new ThreadStatusScheduler());
		let innerCalled = false;

		await scheduler.run(Promise.resolve().then(() => scheduler.cancel(undefined)).then(() => [1]), async () => {
			innerCalled = true;
		});

		assert.strictEqual(innerCalled, false);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/test/browser/debugSource.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/test/browser/debugSource.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { isWindows } from '../../../../../base/common/platform.js';
import { URI as uri } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { Source } from '../../common/debugSource.js';
import { mockUriIdentityService } from './mockDebugModel.js';

suite('Debug - Source', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('from raw source', () => {
		const source = new Source({
			name: 'zz',
			path: '/xx/yy/zz',
			sourceReference: 0,
			presentationHint: 'emphasize'
		}, 'aDebugSessionId', mockUriIdentityService, new NullLogService());

		assert.strictEqual(source.presentationHint, 'emphasize');
		assert.strictEqual(source.name, 'zz');
		assert.strictEqual(source.inMemory, false);
		assert.strictEqual(source.reference, 0);
		assert.strictEqual(source.uri.toString(), uri.file('/xx/yy/zz').toString());
	});

	test('from raw internal source', () => {
		const source = new Source({
			name: 'internalModule.js',
			sourceReference: 11,
			presentationHint: 'deemphasize'
		}, 'aDebugSessionId', mockUriIdentityService, new NullLogService());

		assert.strictEqual(source.presentationHint, 'deemphasize');
		assert.strictEqual(source.name, 'internalModule.js');
		assert.strictEqual(source.inMemory, true);
		assert.strictEqual(source.reference, 11);
		assert.strictEqual(source.uri.toString(), 'debug:internalModule.js?session%3DaDebugSessionId%26ref%3D11');
	});

	test('get encoded debug data', () => {
		const checkData = (uri: uri, expectedName: string, expectedPath: string, expectedSourceReference: number | undefined, expectedSessionId?: string) => {
			const { name, path, sourceReference, sessionId } = Source.getEncodedDebugData(uri);
			assert.strictEqual(name, expectedName);
			assert.strictEqual(path, expectedPath);
			assert.strictEqual(sourceReference, expectedSourceReference);
			assert.strictEqual(sessionId, expectedSessionId);
		};

		checkData(uri.file('a/b/c/d'), 'd', isWindows ? '\\a\\b\\c\\d' : '/a/b/c/d', undefined, undefined);
		checkData(uri.from({ scheme: 'file', path: '/my/path/test.js', query: 'ref=1&session=2' }), 'test.js', isWindows ? '\\my\\path\\test.js' : '/my/path/test.js', undefined, undefined);

		checkData(uri.from({ scheme: 'http', authority: 'www.example.com', path: '/my/path' }), 'path', 'http://www.example.com/my/path', undefined, undefined);
		checkData(uri.from({ scheme: 'debug', authority: 'www.example.com', path: '/my/path', query: 'ref=100' }), 'path', '/my/path', 100, undefined);
		checkData(uri.from({ scheme: 'debug', path: 'a/b/c/d.js', query: 'session=100' }), 'd.js', 'a/b/c/d.js', undefined, '100');
		checkData(uri.from({ scheme: 'debug', path: 'a/b/c/d/foo.txt', query: 'session=100&ref=10' }), 'foo.txt', 'a/b/c/d/foo.txt', 10, '100');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/test/browser/debugUtils.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/test/browser/debugUtils.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IConfig } from '../../common/debug.js';
import { formatPII, getExactExpressionStartAndEnd, getVisibleAndSorted } from '../../common/debugUtils.js';

suite('Debug - Utils', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('formatPII', () => {
		assert.strictEqual(formatPII('Foo Bar', false, {}), 'Foo Bar');
		assert.strictEqual(formatPII('Foo {key} Bar', false, {}), 'Foo {key} Bar');
		assert.strictEqual(formatPII('Foo {key} Bar', false, { 'key': 'yes' }), 'Foo yes Bar');
		assert.strictEqual(formatPII('Foo {_0} Bar {_0}', true, { '_0': 'yes' }), 'Foo yes Bar yes');
		assert.strictEqual(formatPII('Foo {0} Bar {1}{2}', false, { '0': 'yes' }), 'Foo yes Bar {1}{2}');
		assert.strictEqual(formatPII('Foo {0} Bar {1}{2}', false, { '0': 'yes', '1': 'undefined' }), 'Foo yes Bar undefined{2}');
		assert.strictEqual(formatPII('Foo {_key0} Bar {key1}{key2}', true, { '_key0': 'yes', 'key1': '5', 'key2': 'false' }), 'Foo yes Bar {key1}{key2}');
		assert.strictEqual(formatPII('Foo {_key0} Bar {key1}{key2}', false, { '_key0': 'yes', 'key1': '5', 'key2': 'false' }), 'Foo yes Bar 5false');
		assert.strictEqual(formatPII('Unable to display threads:"{e}"', false, { 'e': 'detached from process' }), 'Unable to display threads:"detached from process"');
	});

	test('getExactExpressionStartAndEnd', () => {
		assert.deepStrictEqual(getExactExpressionStartAndEnd('foo', 1, 2), { start: 1, end: 3 });
		assert.deepStrictEqual(getExactExpressionStartAndEnd('!foo', 2, 3), { start: 2, end: 4 });
		assert.deepStrictEqual(getExactExpressionStartAndEnd('foo', 1, 3), { start: 1, end: 3 });
		assert.deepStrictEqual(getExactExpressionStartAndEnd('foo', 1, 4), { start: 1, end: 3 });
		assert.deepStrictEqual(getExactExpressionStartAndEnd('this.name = "John"', 1, 10), { start: 1, end: 9 });
		assert.deepStrictEqual(getExactExpressionStartAndEnd('this.name = "John"', 6, 10), { start: 1, end: 9 });
		// Hovers over "address" should pick up this->address
		assert.deepStrictEqual(getExactExpressionStartAndEnd('this->address = "Main street"', 6, 10), { start: 1, end: 13 });
		// Hovers over "name" should pick up a.b.c.d.name
		assert.deepStrictEqual(getExactExpressionStartAndEnd('var t = a.b.c.d.name', 16, 20), { start: 9, end: 20 });
		assert.deepStrictEqual(getExactExpressionStartAndEnd('MyClass::StaticProp', 10, 20), { start: 1, end: 19 });
		assert.deepStrictEqual(getExactExpressionStartAndEnd('largeNumber = myVar?.prop', 21, 25), { start: 15, end: 25 });

		// For example in expression 'a.b.c.d', hover was under 'b', 'a.b' should be the exact range
		assert.deepStrictEqual(getExactExpressionStartAndEnd('var t = a.b.c.d.name', 11, 12), { start: 9, end: 11 });

		assert.deepStrictEqual(getExactExpressionStartAndEnd('var t = a.b;c.d.name', 16, 20), { start: 13, end: 20 });
		assert.deepStrictEqual(getExactExpressionStartAndEnd('var t = a.b.c-d.name', 16, 20), { start: 15, end: 20 });

		assert.deepStrictEqual(getExactExpressionStartAndEnd('var aøñéå文 = a.b.c-d.name', 5, 5), { start: 5, end: 10 });
		assert.deepStrictEqual(getExactExpressionStartAndEnd('aøñéå文.aøñéå文.aøñéå文', 9, 9), { start: 1, end: 13 });

		// Spread syntax should extract just the identifier
		assert.deepStrictEqual(getExactExpressionStartAndEnd('[...bar]', 5, 7), { start: 5, end: 7 });
		assert.deepStrictEqual(getExactExpressionStartAndEnd('...variable', 5, 5), { start: 4, end: 11 });
	});

	test('config presentation', () => {
		const configs: IConfig[] = [];
		configs.push({
			type: 'node',
			request: 'launch',
			name: 'p'
		});
		configs.push({
			type: 'node',
			request: 'launch',
			name: 'a'
		});
		configs.push({
			type: 'node',
			request: 'launch',
			name: 'b',
			presentation: {
				hidden: false
			}
		});
		configs.push({
			type: 'node',
			request: 'launch',
			name: 'c',
			presentation: {
				hidden: true
			}
		});
		configs.push({
			type: 'node',
			request: 'launch',
			name: 'd',
			presentation: {
				group: '2_group',
				order: 5
			}
		});
		configs.push({
			type: 'node',
			request: 'launch',
			name: 'e',
			presentation: {
				group: '2_group',
				order: 52
			}
		});
		configs.push({
			type: 'node',
			request: 'launch',
			name: 'f',
			presentation: {
				group: '1_group',
				order: 500
			}
		});
		configs.push({
			type: 'node',
			request: 'launch',
			name: 'g',
			presentation: {
				group: '5_group',
				order: 500
			}
		});
		configs.push({
			type: 'node',
			request: 'launch',
			name: 'h',
			presentation: {
				order: 700
			}
		});
		configs.push({
			type: 'node',
			request: 'launch',
			name: 'i',
			presentation: {
				order: 1000
			}
		});

		const sorted = getVisibleAndSorted(configs);
		assert.strictEqual(sorted.length, 9);
		assert.strictEqual(sorted[0].name, 'f');
		assert.strictEqual(sorted[1].name, 'd');
		assert.strictEqual(sorted[2].name, 'e');
		assert.strictEqual(sorted[3].name, 'g');
		assert.strictEqual(sorted[4].name, 'h');
		assert.strictEqual(sorted[5].name, 'i');
		assert.strictEqual(sorted[6].name, 'b');
		assert.strictEqual(sorted[7].name, 'p');
		assert.strictEqual(sorted[8].name, 'a');

	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/test/browser/debugViewModel.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/test/browser/debugViewModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { Expression, StackFrame, Thread } from '../../common/debugModel.js';
import { Source } from '../../common/debugSource.js';
import { ViewModel } from '../../common/debugViewModel.js';
import { mockUriIdentityService } from './mockDebugModel.js';
import { MockSession } from '../common/mockDebug.js';

suite('Debug - View Model', () => {
	let model: ViewModel;

	setup(() => {
		model = new ViewModel(new MockContextKeyService());
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('focused stack frame', () => {
		assert.strictEqual(model.focusedStackFrame, undefined);
		assert.strictEqual(model.focusedThread, undefined);
		const session = new MockSession();
		const thread = new Thread(session, 'myThread', 1);
		const source = new Source({
			name: 'internalModule.js',
			sourceReference: 11,
			presentationHint: 'deemphasize'
		}, 'aDebugSessionId', mockUriIdentityService, new NullLogService());
		const frame = new StackFrame(thread, 1, source, 'app.js', 'normal', { startColumn: 1, startLineNumber: 1, endColumn: 1, endLineNumber: 1 }, 0, true);
		model.setFocus(frame, thread, session, false);

		assert.strictEqual(model.focusedStackFrame!.getId(), frame.getId());
		assert.strictEqual(model.focusedThread!.threadId, 1);
		assert.strictEqual(model.focusedSession!.getId(), session.getId());
	});

	test('selected expression', () => {
		assert.strictEqual(model.getSelectedExpression(), undefined);
		const expression = new Expression('my expression');
		model.setSelectedExpression(expression, false);

		assert.strictEqual(model.getSelectedExpression()?.expression, expression);
	});

	test('multi session view and changed workbench state', () => {
		assert.strictEqual(model.isMultiSessionView(), false);
		model.setMultiSessionView(true);
		assert.strictEqual(model.isMultiSessionView(), true);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/test/browser/linkDetector.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/test/browser/linkDetector.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { isHTMLAnchorElement } from '../../../../../base/browser/dom.js';
import { isWindows } from '../../../../../base/common/platform.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ITunnelService } from '../../../../../platform/tunnel/common/tunnel.js';
import { WorkspaceFolder } from '../../../../../platform/workspace/common/workspace.js';
import { LinkDetector } from '../../browser/linkDetector.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { IHighlight } from '../../../../../base/browser/ui/highlightedlabel/highlightedLabel.js';

suite('Debug - Link Detector', () => {

	const disposables = ensureNoDisposablesAreLeakedInTestSuite();
	let linkDetector: LinkDetector;

	/**
	 * Instantiate a {@link LinkDetector} for use by the functions being tested.
	 */
	setup(() => {
		const instantiationService: TestInstantiationService = <TestInstantiationService>workbenchInstantiationService(undefined, disposables);
		instantiationService.stub(ITunnelService, { canTunnel: () => false });
		linkDetector = instantiationService.createInstance(LinkDetector);
	});

	/**
	 * Assert that a given Element is an anchor element.
	 *
	 * @param element The Element to verify.
	 */
	function assertElementIsLink(element: Element) {
		assert(isHTMLAnchorElement(element));
	}

	test('noLinks', () => {
		const input = 'I am a string';
		const expectedOutput = '<span>I am a string</span>';
		const output = linkDetector.linkify(input);

		assert.strictEqual(0, output.children.length);
		assert.strictEqual('SPAN', output.tagName);
		assert.strictEqual(expectedOutput, output.outerHTML);
	});

	test('trailingNewline', () => {
		const input = 'I am a string\n';
		const expectedOutput = '<span>I am a string\n</span>';
		const output = linkDetector.linkify(input);

		assert.strictEqual(0, output.children.length);
		assert.strictEqual('SPAN', output.tagName);
		assert.strictEqual(expectedOutput, output.outerHTML);
	});

	test('trailingNewlineSplit', () => {
		const input = 'I am a string\n';
		const expectedOutput = '<span>I am a string\n</span>';
		const output = linkDetector.linkify(input, true);

		assert.strictEqual(0, output.children.length);
		assert.strictEqual('SPAN', output.tagName);
		assert.strictEqual(expectedOutput, output.outerHTML);
	});

	test('singleLineLink', () => {
		const input = isWindows ? 'C:\\foo\\bar.js:12:34' : '/Users/foo/bar.js:12:34';
		const expectedOutput = isWindows ? '<span><a tabindex="0">C:\\foo\\bar.js:12:34<\/a><\/span>' : '<span><a tabindex="0">/Users/foo/bar.js:12:34<\/a><\/span>';
		const output = linkDetector.linkify(input);

		assert.strictEqual(1, output.children.length);
		assert.strictEqual('SPAN', output.tagName);
		assert.strictEqual('A', output.firstElementChild!.tagName);
		assert.strictEqual(expectedOutput, output.outerHTML);
		assertElementIsLink(output.firstElementChild!);
		assert.strictEqual(isWindows ? 'C:\\foo\\bar.js:12:34' : '/Users/foo/bar.js:12:34', output.firstElementChild!.textContent);
	});

	test('allows links with @ (#282635)', () => {
		if (!isWindows) {
			const input = '(/home/alexey_korepov/projects/dt2/playwright/node_modules/.pnpm/playwright-core@1.57.0/node_modules/playwright-core/lib/client/errors.js:56:16)';
			const expectedOutput = '<span>(<a tabindex="0">/home/alexey_korepov/projects/dt2/playwright/node_modules/.pnpm/playwright-core@1.57.0/node_modules/playwright-core/lib/client/errors.js:56:16</a>)</span>';
			const output = linkDetector.linkify(input);

			assert.strictEqual(expectedOutput, output.outerHTML);
			assert.strictEqual(1, output.children.length);
		}
	});

	test('relativeLink', () => {
		const input = '\./foo/bar.js';
		const expectedOutput = '<span>\./foo/bar.js</span>';
		const output = linkDetector.linkify(input);

		assert.strictEqual(0, output.children.length);
		assert.strictEqual('SPAN', output.tagName);
		assert.strictEqual(expectedOutput, output.outerHTML);
	});

	test('relativeLinkWithWorkspace', async () => {
		const input = '\./foo/bar.js';
		const output = linkDetector.linkify(input, false, new WorkspaceFolder({ uri: URI.file('/path/to/workspace'), name: 'ws', index: 0 }));
		assert.strictEqual('SPAN', output.tagName);
		assert.ok(output.outerHTML.indexOf('link') >= 0);
	});

	test('singleLineLinkAndText', function () {
		const input = isWindows ? 'The link: C:/foo/bar.js:12:34' : 'The link: /Users/foo/bar.js:12:34';
		const expectedOutput = /^<span>The link: <a tabindex="0">.*\/foo\/bar.js:12:34<\/a><\/span>$/;
		const output = linkDetector.linkify(input);

		assert.strictEqual(1, output.children.length);
		assert.strictEqual('SPAN', output.tagName);
		assert.strictEqual('A', output.children[0].tagName);
		assert(expectedOutput.test(output.outerHTML));
		assertElementIsLink(output.children[0]);
		assert.strictEqual(isWindows ? 'C:/foo/bar.js:12:34' : '/Users/foo/bar.js:12:34', output.children[0].textContent);
	});

	test('singleLineMultipleLinks', () => {
		const input = isWindows ? 'Here is a link C:/foo/bar.js:12:34 and here is another D:/boo/far.js:56:78' :
			'Here is a link /Users/foo/bar.js:12:34 and here is another /Users/boo/far.js:56:78';
		const expectedOutput = /^<span>Here is a link <a tabindex="0">.*\/foo\/bar.js:12:34<\/a> and here is another <a tabindex="0">.*\/boo\/far.js:56:78<\/a><\/span>$/;
		const output = linkDetector.linkify(input);

		assert.strictEqual(2, output.children.length);
		assert.strictEqual('SPAN', output.tagName);
		assert.strictEqual('A', output.children[0].tagName);
		assert.strictEqual('A', output.children[1].tagName);
		assert(expectedOutput.test(output.outerHTML));
		assertElementIsLink(output.children[0]);
		assertElementIsLink(output.children[1]);
		assert.strictEqual(isWindows ? 'C:/foo/bar.js:12:34' : '/Users/foo/bar.js:12:34', output.children[0].textContent);
		assert.strictEqual(isWindows ? 'D:/boo/far.js:56:78' : '/Users/boo/far.js:56:78', output.children[1].textContent);
	});

	test('multilineNoLinks', () => {
		const input = 'Line one\nLine two\nLine three';
		const expectedOutput = /^<span><span>Line one\n<\/span><span>Line two\n<\/span><span>Line three<\/span><\/span>$/;
		const output = linkDetector.linkify(input, true);

		assert.strictEqual(3, output.children.length);
		assert.strictEqual('SPAN', output.tagName);
		assert.strictEqual('SPAN', output.children[0].tagName);
		assert.strictEqual('SPAN', output.children[1].tagName);
		assert.strictEqual('SPAN', output.children[2].tagName);
		assert(expectedOutput.test(output.outerHTML));
	});

	test('multilineTrailingNewline', () => {
		const input = 'I am a string\nAnd I am another\n';
		const expectedOutput = '<span><span>I am a string\n<\/span><span>And I am another\n<\/span><\/span>';
		const output = linkDetector.linkify(input, true);

		assert.strictEqual(2, output.children.length);
		assert.strictEqual('SPAN', output.tagName);
		assert.strictEqual('SPAN', output.children[0].tagName);
		assert.strictEqual('SPAN', output.children[1].tagName);
		assert.strictEqual(expectedOutput, output.outerHTML);
	});

	test('multilineWithLinks', () => {
		const input = isWindows ? 'I have a link for you\nHere it is: C:/foo/bar.js:12:34\nCool, huh?' :
			'I have a link for you\nHere it is: /Users/foo/bar.js:12:34\nCool, huh?';
		const expectedOutput = /^<span><span>I have a link for you\n<\/span><span>Here it is: <a tabindex="0">.*\/foo\/bar.js:12:34<\/a>\n<\/span><span>Cool, huh\?<\/span><\/span>$/;
		const output = linkDetector.linkify(input, true);

		assert.strictEqual(3, output.children.length);
		assert.strictEqual('SPAN', output.tagName);
		assert.strictEqual('SPAN', output.children[0].tagName);
		assert.strictEqual('SPAN', output.children[1].tagName);
		assert.strictEqual('SPAN', output.children[2].tagName);
		assert.strictEqual('A', output.children[1].children[0].tagName);
		assert(expectedOutput.test(output.outerHTML));
		assertElementIsLink(output.children[1].children[0]);
		assert.strictEqual(isWindows ? 'C:/foo/bar.js:12:34' : '/Users/foo/bar.js:12:34', output.children[1].children[0].textContent);
	});

	test('highlightNoLinks', () => {
		const input = 'I am a string';
		const highlights: IHighlight[] = [{ start: 2, end: 5 }];
		const expectedOutput = '<span>I <span class="highlight">am </span>a string</span>';
		const output = linkDetector.linkify(input, false, undefined, false, undefined, highlights);

		assert.strictEqual(1, output.children.length);
		assert.strictEqual('SPAN', output.tagName);
		assert.strictEqual(expectedOutput, output.outerHTML);
	});

	test('highlightWithLink', () => {
		const input = isWindows ? 'C:\\foo\\bar.js:12:34' : '/Users/foo/bar.js:12:34';
		const highlights: IHighlight[] = [{ start: 0, end: 5 }];
		const expectedOutput = isWindows ? '<span><a tabindex="0"><span class="highlight">C:\\fo</span>o\\bar.js:12:34</a></span>' : '<span><a tabindex="0"><span class="highlight">/User</span>s/foo/bar.js:12:34</a></span>';
		const output = linkDetector.linkify(input, false, undefined, false, undefined, highlights);

		assert.strictEqual(1, output.children.length);
		assert.strictEqual('SPAN', output.tagName);
		assert.strictEqual('A', output.firstElementChild!.tagName);
		assert.strictEqual(expectedOutput, output.outerHTML);
		assertElementIsLink(output.firstElementChild!);
	});

	test('highlightOverlappingLinkStart', () => {
		const input = isWindows ? 'C:\\foo\\bar.js:12:34' : '/Users/foo/bar.js:12:34';
		const highlights: IHighlight[] = [{ start: 0, end: 10 }];
		const expectedOutput = isWindows ? '<span><a tabindex="0"><span class="highlight">C:\\foo\\bar</span>.js:12:34</a></span>' : '<span><a tabindex="0"><span class="highlight">/Users/foo</span>/bar.js:12:34</a></span>';
		const output = linkDetector.linkify(input, false, undefined, false, undefined, highlights);

		assert.strictEqual(1, output.children.length);
		assert.strictEqual('SPAN', output.tagName);
		assert.strictEqual('A', output.firstElementChild!.tagName);
		assert.strictEqual(expectedOutput, output.outerHTML);
		assertElementIsLink(output.firstElementChild!);
	});

	test('highlightOverlappingLinkEnd', () => {
		const input = isWindows ? 'C:\\foo\\bar.js:12:34' : '/Users/foo/bar.js:12:34';
		const highlights: IHighlight[] = [{ start: 10, end: 20 }];
		const expectedOutput = isWindows ? '<span><a tabindex="0">C:\\foo\\bar<span class="highlight">.js:12:34</span></a></span>' : '<span><a tabindex="0">/Users/foo<span class="highlight">/bar.js:12</span>:34</a></span>';
		const output = linkDetector.linkify(input, false, undefined, false, undefined, highlights);

		assert.strictEqual(1, output.children.length);
		assert.strictEqual('SPAN', output.tagName);
		assert.strictEqual('A', output.firstElementChild!.tagName);
		assert.strictEqual(expectedOutput, output.outerHTML);
		assertElementIsLink(output.firstElementChild!);
	});

	test('highlightOverlappingLinkStartAndEnd', () => {
		const input = isWindows ? 'C:\\foo\\bar.js:12:34' : '/Users/foo/bar.js:12:34';
		const highlights: IHighlight[] = [{ start: 5, end: 15 }];
		const expectedOutput = isWindows ? '<span><a tabindex="0">C:\\fo<span class="highlight">o\\bar.js:1</span>2:34</a></span>' : '<span><a tabindex="0">/User<span class="highlight">s/foo/bar.</span>js:12:34</a></span>';
		const output = linkDetector.linkify(input, false, undefined, false, undefined, highlights);

		assert.strictEqual(1, output.children.length);
		assert.strictEqual('SPAN', output.tagName);
		assert.strictEqual('A', output.firstElementChild!.tagName);
		assert.strictEqual(expectedOutput, output.outerHTML);
		assertElementIsLink(output.firstElementChild!);
	});

	test('csharpStackTraceFormatWithLine', () => {
		const input = isWindows ? 'C:\\foo\\bar.cs:line 6' : '/Users/foo/bar.cs:line 6';
		const expectedOutput = isWindows ? '<span><a tabindex="0">C:\\foo\\bar.cs:line 6<\/a><\/span>' : '<span><a tabindex="0">/Users/foo/bar.cs:line 6<\/a><\/span>';
		const output = linkDetector.linkify(input);

		assert.strictEqual(1, output.children.length);
		assert.strictEqual('SPAN', output.tagName);
		assert.strictEqual('A', output.firstElementChild!.tagName);
		assert.strictEqual(expectedOutput, output.outerHTML);
		assertElementIsLink(output.firstElementChild!);
		assert.strictEqual(isWindows ? 'C:\\foo\\bar.cs:line 6' : '/Users/foo/bar.cs:line 6', output.firstElementChild!.textContent);
	});

	test('csharpStackTraceFormatWithLineAndColumn', () => {
		const input = isWindows ? 'C:\\foo\\bar.cs:line 6:10' : '/Users/foo/bar.cs:line 6:10';
		const expectedOutput = isWindows ? '<span><a tabindex="0">C:\\foo\\bar.cs:line 6:10<\/a><\/span>' : '<span><a tabindex="0">/Users/foo/bar.cs:line 6:10<\/a><\/span>';
		const output = linkDetector.linkify(input);

		assert.strictEqual(1, output.children.length);
		assert.strictEqual('SPAN', output.tagName);
		assert.strictEqual('A', output.firstElementChild!.tagName);
		assert.strictEqual(expectedOutput, output.outerHTML);
		assertElementIsLink(output.firstElementChild!);
		assert.strictEqual(isWindows ? 'C:\\foo\\bar.cs:line 6:10' : '/Users/foo/bar.cs:line 6:10', output.firstElementChild!.textContent);
	});

	test('mixedStackTraceFormats', () => {
		const input = isWindows ? 'C:\\foo\\bar.js:12:34 and C:\\baz\\qux.cs:line 6' :
			'/Users/foo/bar.js:12:34 and /Users/baz/qux.cs:line 6';
		// Use flexible path separator matching for cross-platform compatibility
		const expectedOutput = isWindows ?
			/^<span><a tabindex="0">.*\\foo\\bar\.js:12:34<\/a> and <a tabindex="0">.*\\baz\\qux\.cs:line 6<\/a><\/span>$/ :
			/^<span><a tabindex="0">.*\/foo\/bar\.js:12:34<\/a> and <a tabindex="0">.*\/baz\/qux\.cs:line 6<\/a><\/span>$/;
		const output = linkDetector.linkify(input);

		assert.strictEqual(2, output.children.length);
		assert.strictEqual('SPAN', output.tagName);
		assert.strictEqual('A', output.children[0].tagName);
		assert.strictEqual('A', output.children[1].tagName);
		assert(expectedOutput.test(output.outerHTML));
		assertElementIsLink(output.children[0]);
		assertElementIsLink(output.children[1]);
		assert.strictEqual(isWindows ? 'C:\\foo\\bar.js:12:34' : '/Users/foo/bar.js:12:34', output.children[0].textContent);
		assert.strictEqual(isWindows ? 'C:\\baz\\qux.cs:line 6' : '/Users/baz/qux.cs:line 6', output.children[1].textContent);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/test/browser/mockDebugModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/test/browser/mockDebugModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { upcastPartial } from '../../../../../base/test/common/mock.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { UriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentityService.js';
import { ITextFileService } from '../../../../services/textfile/common/textfiles.js';
import { TestFileService, TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { DebugModel } from '../../common/debugModel.js';
import { MockDebugStorage } from '../common/mockDebug.js';

const fileService = new TestFileService();
export const mockUriIdentityService = new UriIdentityService(fileService);

export function createMockDebugModel(disposable: Pick<DisposableStore, 'add'>): DebugModel {
	const storage = disposable.add(new TestStorageService());
	const debugStorage = disposable.add(new MockDebugStorage(storage));
	return disposable.add(new DebugModel(debugStorage, upcastPartial<ITextFileService>({ isDirty: (e: unknown) => false }), mockUriIdentityService, new NullLogService()));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/test/browser/rawDebugSession.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/test/browser/rawDebugSession.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { mock, mockObject } from '../../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IExtensionHostDebugService } from '../../../../../platform/debug/common/extensionHostDebug.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { RawDebugSession } from '../../browser/rawDebugSession.js';
import { IDebugger } from '../../common/debug.js';
import { MockDebugAdapter } from '../common/mockDebug.js';

suite('RawDebugSession', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	function createTestObjects() {
		const debugAdapter = new MockDebugAdapter();
		const dbgr = mockObject<IDebugger>()({
			type: 'mock-debug'
		});

		const session = new RawDebugSession(
			debugAdapter,
			// eslint-disable-next-line local/code-no-any-casts
			dbgr as any as IDebugger,
			'sessionId',
			'name',
			new (mock<IExtensionHostDebugService>()),
			new (mock<IOpenerService>()),
			new (mock<INotificationService>()),
			new (mock<IDialogService>()));
		disposables.add(session);
		disposables.add(debugAdapter);

		return { debugAdapter, dbgr };
	}

	test('handles startDebugging request success', async () => {
		const { debugAdapter, dbgr } = createTestObjects();
		dbgr.startDebugging.returns(Promise.resolve(true));

		debugAdapter.sendRequestBody('startDebugging', {
			request: 'launch',
			configuration: {
				type: 'some-other-type'
			}
		} as DebugProtocol.StartDebuggingRequestArguments);
		const response = await debugAdapter.waitForResponseFromClient('startDebugging');
		assert.strictEqual(response.command, 'startDebugging');
		assert.strictEqual(response.success, true);
	});

	test('handles startDebugging request failure', async () => {
		const { debugAdapter, dbgr } = createTestObjects();
		dbgr.startDebugging.returns(Promise.resolve(false));

		debugAdapter.sendRequestBody('startDebugging', {
			request: 'launch',
			configuration: {
				type: 'some-other-type'
			}
		} as DebugProtocol.StartDebuggingRequestArguments);
		const response = await debugAdapter.waitForResponseFromClient('startDebugging');
		assert.strictEqual(response.command, 'startDebugging');
		assert.strictEqual(response.success, false);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/test/browser/repl.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/test/browser/repl.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import assert from 'assert';
import { TreeVisibility } from '../../../../../base/browser/ui/tree/tree.js';
import { timeout } from '../../../../../base/common/async.js';
import severity from '../../../../../base/common/severity.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { RawDebugSession } from '../../browser/rawDebugSession.js';
import { ReplFilter } from '../../browser/replFilter.js';
import { DebugModel, StackFrame, Thread } from '../../common/debugModel.js';
import { RawObjectReplElement, ReplEvaluationInput, ReplEvaluationResult, ReplGroup, ReplModel, ReplOutputElement, ReplVariableElement } from '../../common/replModel.js';
import { createTestSession } from './callStack.test.js';
import { createMockDebugModel } from './mockDebugModel.js';
import { MockDebugAdapter, MockRawSession } from '../common/mockDebug.js';

suite('Debug - REPL', () => {
	let model: DebugModel;
	let rawSession: MockRawSession;
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();
	const configurationService = new TestConfigurationService({ debug: { console: { collapseIdenticalLines: true } } });

	setup(() => {
		model = createMockDebugModel(disposables);
		rawSession = new MockRawSession();
	});

	test('repl output', () => {
		const session = disposables.add(createTestSession(model));
		const repl = new ReplModel(configurationService);
		repl.appendToRepl(session, { output: 'first line\n', sev: severity.Error });
		repl.appendToRepl(session, { output: 'second line ', sev: severity.Error });
		repl.appendToRepl(session, { output: 'third line ', sev: severity.Error });
		repl.appendToRepl(session, { output: 'fourth line', sev: severity.Error });

		let elements = <ReplOutputElement[]>repl.getReplElements();
		assert.strictEqual(elements.length, 2);
		assert.strictEqual(elements[0].value, 'first line\n');
		assert.strictEqual(elements[0].severity, severity.Error);
		assert.strictEqual(elements[1].value, 'second line third line fourth line');
		assert.strictEqual(elements[1].severity, severity.Error);

		repl.appendToRepl(session, { output: '1', sev: severity.Warning });
		elements = <ReplOutputElement[]>repl.getReplElements();
		assert.strictEqual(elements.length, 3);
		assert.strictEqual(elements[2].value, '1');
		assert.strictEqual(elements[2].severity, severity.Warning);

		const keyValueObject = { 'key1': 2, 'key2': 'value' };
		repl.appendToRepl(session, { output: '', expression: new RawObjectReplElement('fakeid', 'fake', keyValueObject), sev: severity.Info });
		const element = <ReplVariableElement>repl.getReplElements()[3];
		assert.strictEqual(element.expression.value, 'Object');
		assert.deepStrictEqual((element.expression as RawObjectReplElement).valueObj, keyValueObject);

		repl.removeReplExpressions();
		assert.strictEqual(repl.getReplElements().length, 0);

		repl.appendToRepl(session, { output: '1\n', sev: severity.Info });
		repl.appendToRepl(session, { output: '2', sev: severity.Info });
		repl.appendToRepl(session, { output: '3\n4', sev: severity.Info });
		repl.appendToRepl(session, { output: '5\n', sev: severity.Info });
		repl.appendToRepl(session, { output: '6', sev: severity.Info });
		elements = <ReplOutputElement[]>repl.getReplElements();
		assert.deepStrictEqual(elements.map(e => e.toString()), ['1\n', '23\n', '45\n', '6']);

		repl.removeReplExpressions();
	});

	test('repl output count', () => {
		const session = disposables.add(createTestSession(model));
		const repl = new ReplModel(configurationService);
		repl.appendToRepl(session, { output: 'first line\n', sev: severity.Info });
		repl.appendToRepl(session, { output: 'first line\n', sev: severity.Info });
		repl.appendToRepl(session, { output: 'first line\n', sev: severity.Info });
		repl.appendToRepl(session, { output: 'second line\n', sev: severity.Info });
		repl.appendToRepl(session, { output: 'second line\n', sev: severity.Info });
		repl.appendToRepl(session, { output: 'third line\n', sev: severity.Info });
		const elements = <ReplOutputElement[]>repl.getReplElements();
		assert.deepStrictEqual(elements.map(e => ({ value: e.value, count: e.count })), [
			{ value: 'first line\n', count: 3 },
			{ value: 'second line\n', count: 2 },
			{ value: 'third line\n', count: 1 }
		]);
	});

	test('repl merging', () => {
		// 'mergeWithParent' should be ignored when there is no parent.
		const parent = disposables.add(createTestSession(model, 'parent', { repl: 'mergeWithParent' }));
		const child1 = disposables.add(createTestSession(model, 'child1', { parentSession: parent, repl: 'separate' }));
		const child2 = disposables.add(createTestSession(model, 'child2', { parentSession: parent, repl: 'mergeWithParent' }));
		const grandChild = disposables.add(createTestSession(model, 'grandChild', { parentSession: child2, repl: 'mergeWithParent' }));
		const child3 = disposables.add(createTestSession(model, 'child3', { parentSession: parent }));

		let parentChanges = 0;
		disposables.add(parent.onDidChangeReplElements(() => ++parentChanges));

		parent.appendToRepl({ output: '1\n', sev: severity.Info });
		assert.strictEqual(parentChanges, 1);
		assert.strictEqual(parent.getReplElements().length, 1);
		assert.strictEqual(child1.getReplElements().length, 0);
		assert.strictEqual(child2.getReplElements().length, 1);
		assert.strictEqual(grandChild.getReplElements().length, 1);
		assert.strictEqual(child3.getReplElements().length, 0);

		grandChild.appendToRepl({ output: '2\n', sev: severity.Info });
		assert.strictEqual(parentChanges, 2);
		assert.strictEqual(parent.getReplElements().length, 2);
		assert.strictEqual(child1.getReplElements().length, 0);
		assert.strictEqual(child2.getReplElements().length, 2);
		assert.strictEqual(grandChild.getReplElements().length, 2);
		assert.strictEqual(child3.getReplElements().length, 0);

		child3.appendToRepl({ output: '3\n', sev: severity.Info });
		assert.strictEqual(parentChanges, 2);
		assert.strictEqual(parent.getReplElements().length, 2);
		assert.strictEqual(child1.getReplElements().length, 0);
		assert.strictEqual(child2.getReplElements().length, 2);
		assert.strictEqual(grandChild.getReplElements().length, 2);
		assert.strictEqual(child3.getReplElements().length, 1);

		child1.appendToRepl({ output: '4\n', sev: severity.Info });
		assert.strictEqual(parentChanges, 2);
		assert.strictEqual(parent.getReplElements().length, 2);
		assert.strictEqual(child1.getReplElements().length, 1);
		assert.strictEqual(child2.getReplElements().length, 2);
		assert.strictEqual(grandChild.getReplElements().length, 2);
		assert.strictEqual(child3.getReplElements().length, 1);
	});

	test('repl expressions', () => {
		const session = disposables.add(createTestSession(model));
		assert.strictEqual(session.getReplElements().length, 0);
		model.addSession(session);

		// eslint-disable-next-line local/code-no-any-casts
		session['raw'] = <any>rawSession;
		const thread = new Thread(session, 'mockthread', 1);
		// eslint-disable-next-line local/code-no-any-casts
		const stackFrame = new StackFrame(thread, 1, <any>undefined, 'app.js', 'normal', { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 10 }, 1, true);
		const replModel = new ReplModel(configurationService);
		replModel.addReplExpression(session, stackFrame, 'myVariable').then();
		replModel.addReplExpression(session, stackFrame, 'myVariable').then();
		replModel.addReplExpression(session, stackFrame, 'myVariable').then();

		assert.strictEqual(replModel.getReplElements().length, 3);
		replModel.getReplElements().forEach(re => {
			assert.strictEqual((<ReplEvaluationInput>re).value, 'myVariable');
		});

		replModel.removeReplExpressions();
		assert.strictEqual(replModel.getReplElements().length, 0);
	});

	test('repl ordering', async () => {
		const session = disposables.add(createTestSession(model));
		model.addSession(session);

		const adapter = new MockDebugAdapter();
		const raw = disposables.add(new RawDebugSession(adapter, undefined!, '', '', undefined!, undefined!, undefined!, undefined!,));
		session.initializeForTest(raw);

		await session.addReplExpression(undefined, 'before.1');
		assert.strictEqual(session.getReplElements().length, 3);
		assert.strictEqual((<ReplEvaluationInput>session.getReplElements()[0]).value, 'before.1');
		assert.strictEqual((<ReplOutputElement>session.getReplElements()[1]).value, 'before.1');
		assert.strictEqual((<ReplEvaluationResult>session.getReplElements()[2]).value, '=before.1');

		await session.addReplExpression(undefined, 'after.2');
		await timeout(0);
		assert.strictEqual(session.getReplElements().length, 6);
		assert.strictEqual((<ReplEvaluationInput>session.getReplElements()[3]).value, 'after.2');
		assert.strictEqual((<ReplEvaluationResult>session.getReplElements()[4]).value, '=after.2');
		assert.strictEqual((<ReplOutputElement>session.getReplElements()[5]).value, 'after.2');
	});

	test('repl groups', async () => {
		const session = disposables.add(createTestSession(model));
		const repl = new ReplModel(configurationService);

		repl.appendToRepl(session, { output: 'first global line', sev: severity.Info });
		repl.startGroup(session, 'group_1', true);
		repl.appendToRepl(session, { output: 'first line in group', sev: severity.Info });
		repl.appendToRepl(session, { output: 'second line in group', sev: severity.Info });
		const elements = repl.getReplElements();
		assert.strictEqual(elements.length, 2);
		const group = elements[1] as ReplGroup;
		assert.strictEqual(group.name, 'group_1');
		assert.strictEqual(group.autoExpand, true);
		assert.strictEqual(group.hasChildren, true);
		assert.strictEqual(group.hasEnded, false);

		repl.startGroup(session, 'group_2', false);
		repl.appendToRepl(session, { output: 'first line in subgroup', sev: severity.Info });
		repl.appendToRepl(session, { output: 'second line in subgroup', sev: severity.Info });
		const children = group.getChildren();
		assert.strictEqual(children.length, 3);
		assert.strictEqual((<ReplOutputElement>children[0]).value, 'first line in group');
		assert.strictEqual((<ReplOutputElement>children[1]).value, 'second line in group');
		assert.strictEqual((<ReplGroup>children[2]).name, 'group_2');
		assert.strictEqual((<ReplGroup>children[2]).hasEnded, false);
		assert.strictEqual((<ReplGroup>children[2]).getChildren().length, 2);
		repl.endGroup();
		assert.strictEqual((<ReplGroup>children[2]).hasEnded, true);
		repl.appendToRepl(session, { output: 'third line in group', sev: severity.Info });
		assert.strictEqual(group.getChildren().length, 4);
		assert.strictEqual(group.hasEnded, false);
		repl.endGroup();
		assert.strictEqual(group.hasEnded, true);
		repl.appendToRepl(session, { output: 'second global line', sev: severity.Info });
		assert.strictEqual(repl.getReplElements().length, 3);
		assert.strictEqual((<ReplOutputElement>repl.getReplElements()[2]).value, 'second global line');
	});

	test('repl identical line collapsing - character by character', () => {
		const session = disposables.add(createTestSession(model));
		const repl = new ReplModel(configurationService);

		// Test case 1: Character-by-character output should NOT be collapsed
		// These should print "111\n", not "(3)1"
		repl.appendToRepl(session, { output: '1', sev: severity.Info });
		repl.appendToRepl(session, { output: '1', sev: severity.Info });
		repl.appendToRepl(session, { output: '1', sev: severity.Info });
		repl.appendToRepl(session, { output: '\n', sev: severity.Info });

		let elements = <ReplOutputElement[]>repl.getReplElements();
		// Should be one element with "111\n" value, not collapsed
		assert.strictEqual(elements.length, 1);
		assert.strictEqual(elements[0].value, '111\n');
		assert.strictEqual(elements[0].count, 1);

		repl.removeReplExpressions();

		// Test case 2: Character-by-character with mixed output
		repl.appendToRepl(session, { output: '5', sev: severity.Info });
		repl.appendToRepl(session, { output: '5', sev: severity.Info });
		repl.appendToRepl(session, { output: '\n', sev: severity.Info });

		elements = <ReplOutputElement[]>repl.getReplElements();
		// Should be one element with "55\n" value, not "(2)5"
		assert.strictEqual(elements.length, 1);
		assert.strictEqual(elements[0].value, '55\n');
		assert.strictEqual(elements[0].count, 1);
	});

	test('repl identical line collapsing - single event multiple lines', () => {
		const session = disposables.add(createTestSession(model));
		const repl = new ReplModel(configurationService);

		// Test case: Single event with multiple identical lines should be collapsed
		// This should be collapsed into "(2)hello"
		repl.appendToRepl(session, { output: 'hello\nhello\n', sev: severity.Info });

		const elements = <ReplOutputElement[]>repl.getReplElements();
		// Should be one collapsed element with count 2
		assert.strictEqual(elements.length, 1);
		assert.strictEqual(elements[0].value, 'hello\n');
		assert.strictEqual(elements[0].count, 2);
	});

	test('repl identical line collapsing - mixed scenarios', () => {
		const session = disposables.add(createTestSession(model));
		const repl = new ReplModel(configurationService);

		// Test case: Mix of single events and multi-line events
		repl.appendToRepl(session, { output: 'test\n', sev: severity.Info });
		repl.appendToRepl(session, { output: 'test\ntest\n', sev: severity.Info });

		const elements = <ReplOutputElement[]>repl.getReplElements();
		// Should be one collapsed element with count 3
		assert.strictEqual(elements.length, 1);
		assert.strictEqual(elements[0].value, 'test\n');
		assert.strictEqual(elements[0].count, 3);
	});

	test('repl filter', async () => {
		const session = disposables.add(createTestSession(model));
		const repl = new ReplModel(configurationService);
		const replFilter = new ReplFilter();

		const getFilteredElements = (): ReplOutputElement[] => {
			const elements = repl.getReplElements();
			return elements.filter((e): e is ReplOutputElement => {
				const filterResult = replFilter.filter(e, TreeVisibility.Visible);
				return filterResult === true || filterResult === TreeVisibility.Visible;
			});
		};

		repl.appendToRepl(session, { output: 'first line\n', sev: severity.Info });
		repl.appendToRepl(session, { output: 'second line\n', sev: severity.Info });
		repl.appendToRepl(session, { output: 'third line\n', sev: severity.Info });
		repl.appendToRepl(session, { output: 'fourth line\n', sev: severity.Info });

		replFilter.filterQuery = 'first';
		const r1 = getFilteredElements();
		assert.strictEqual(r1.length, 1);
		assert.strictEqual(r1[0].value, 'first line\n');

		replFilter.filterQuery = '!first';
		const r2 = getFilteredElements();
		assert.strictEqual(r1.length, 1);
		assert.strictEqual(r2[0].value, 'second line\n');
		assert.strictEqual(r2[1].value, 'third line\n');
		assert.strictEqual(r2[2].value, 'fourth line\n');

		replFilter.filterQuery = 'first, line';
		const r3 = getFilteredElements();
		assert.strictEqual(r3.length, 4);
		assert.strictEqual(r3[0].value, 'first line\n');
		assert.strictEqual(r3[1].value, 'second line\n');
		assert.strictEqual(r3[2].value, 'third line\n');
		assert.strictEqual(r3[3].value, 'fourth line\n');

		replFilter.filterQuery = 'line, !second';
		const r4 = getFilteredElements();
		assert.strictEqual(r4.length, 3);
		assert.strictEqual(r4[0].value, 'first line\n');
		assert.strictEqual(r4[1].value, 'third line\n');
		assert.strictEqual(r4[2].value, 'fourth line\n');

		replFilter.filterQuery = '!second, line';
		const r4_same = getFilteredElements();
		assert.strictEqual(r4.length, r4_same.length);

		replFilter.filterQuery = '!line';
		const r5 = getFilteredElements();
		assert.strictEqual(r5.length, 0);

		replFilter.filterQuery = 'smth';
		const r6 = getFilteredElements();
		assert.strictEqual(r6.length, 0);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/test/browser/variablesView.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/test/browser/variablesView.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import * as dom from '../../../../../base/browser/dom.js';
import { HighlightedLabel } from '../../../../../base/browser/ui/highlightedlabel/highlightedLabel.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { NullHoverService } from '../../../../../platform/hover/test/browser/nullHoverService.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { DebugExpressionRenderer } from '../../browser/debugExpressionRenderer.js';
import { VariablesRenderer } from '../../browser/variablesView.js';
import { IDebugService, IViewModel } from '../../common/debug.js';
import { Scope, StackFrame, Thread, Variable } from '../../common/debugModel.js';
import { MockDebugService, MockSession } from '../common/mockDebug.js';

const $ = dom.$;

function assertVariable(disposables: Pick<DisposableStore, 'add'>, variablesRenderer: VariablesRenderer, displayType: boolean) {
	const session = new MockSession();
	const thread = new Thread(session, 'mockthread', 1);
	const range = {
		startLineNumber: 1,
		startColumn: 1,
		endLineNumber: undefined!,
		endColumn: undefined!
	};
	const stackFrame = new StackFrame(thread, 1, null!, 'app.js', 'normal', range, 0, true);
	const scope = new Scope(stackFrame, 1, 'local', 1, false, 10, 10);
	const node = {
		element: new Variable(session, 1, scope, 2, 'foo', 'bar.foo', undefined, 0, 0, undefined, {}, 'string'),
		depth: 0,
		visibleChildrenCount: 1,
		visibleChildIndex: -1,
		collapsible: false,
		collapsed: false,
		visible: true,
		filterData: undefined,
		children: []
	};
	const expression = $('.');
	const name = $('.');
	const type = $('.');
	const value = $('.');
	const label = disposables.add(new HighlightedLabel(name));
	const lazyButton = $('.');
	const inputBoxContainer = $('.');
	const elementDisposable = disposables.add(new DisposableStore());
	const templateDisposable = disposables.add(new DisposableStore());
	const currentElement = undefined;
	const data = {
		expression,
		name,
		type,
		value,
		label,
		lazyButton,
		inputBoxContainer,
		elementDisposable,
		templateDisposable,
		currentElement
	};
	variablesRenderer.renderElement(node, 0, data);
	assert.strictEqual(value.textContent, '');
	assert.strictEqual(label.element.textContent, 'foo');

	node.element.value = 'xpto';
	variablesRenderer.renderElement(node, 0, data);
	assert.strictEqual(value.textContent, 'xpto');
	assert.strictEqual(type.textContent, displayType ? 'string =' : '');
	assert.strictEqual(label.element.textContent, displayType ? 'foo: ' : 'foo =');

	variablesRenderer.disposeTemplate(data);
}

suite('Debug - Variable Debug View', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();
	let variablesRenderer: VariablesRenderer;
	let instantiationService: TestInstantiationService;
	let expressionRenderer: DebugExpressionRenderer;
	let configurationService: TestConfigurationService;

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables);
		configurationService = instantiationService.createInstance(TestConfigurationService);
		instantiationService.stub(IConfigurationService, configurationService);
		expressionRenderer = instantiationService.createInstance(DebugExpressionRenderer);
		const debugService = new MockDebugService();
		instantiationService.stub(IHoverService, NullHoverService);
		debugService.getViewModel = () => <IViewModel>{ focusedStackFrame: undefined, getSelectedExpression: () => undefined };
		debugService.getViewModel().getSelectedExpression = () => undefined;
		instantiationService.stub(IDebugService, debugService);
	});

	test('variable expressions with display type', () => {
		configurationService.setUserConfiguration('debug.showVariableTypes', true);
		instantiationService.stub(IConfigurationService, configurationService);
		variablesRenderer = instantiationService.createInstance(VariablesRenderer, expressionRenderer);
		assertVariable(disposables, variablesRenderer, true);
	});

	test('variable expressions', () => {
		configurationService.setUserConfiguration('debug.showVariableTypes', false);
		instantiationService.stub(IConfigurationService, configurationService);
		variablesRenderer = instantiationService.createInstance(VariablesRenderer, expressionRenderer);
		assertVariable(disposables, variablesRenderer, false);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/test/browser/watch.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/test/browser/watch.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { DebugModel, Expression } from '../../common/debugModel.js';
import { createMockDebugModel } from './mockDebugModel.js';

// Expressions

function assertWatchExpressions(watchExpressions: Expression[], expectedName: string) {
	assert.strictEqual(watchExpressions.length, 2);
	watchExpressions.forEach(we => {
		assert.strictEqual(we.available, false);
		assert.strictEqual(we.reference, 0);
		assert.strictEqual(we.name, expectedName);
	});
}

suite('Debug - Watch', () => {
	let model: DebugModel;
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		model = createMockDebugModel(disposables);
	});

	test('watch expressions', () => {
		assert.strictEqual(model.getWatchExpressions().length, 0);
		model.addWatchExpression('console');
		model.addWatchExpression('console');
		let watchExpressions = model.getWatchExpressions();
		assertWatchExpressions(watchExpressions, 'console');

		model.renameWatchExpression(watchExpressions[0].getId(), 'new_name');
		model.renameWatchExpression(watchExpressions[1].getId(), 'new_name');
		assertWatchExpressions(model.getWatchExpressions(), 'new_name');

		assertWatchExpressions(model.getWatchExpressions(), 'new_name');

		model.addWatchExpression('mockExpression');
		model.moveWatchExpression(model.getWatchExpressions()[2].getId(), 1);
		watchExpressions = model.getWatchExpressions();
		assert.strictEqual(watchExpressions[0].name, 'new_name');
		assert.strictEqual(watchExpressions[1].name, 'mockExpression');
		assert.strictEqual(watchExpressions[2].name, 'new_name');

		model.removeWatchExpressions();
		assert.strictEqual(model.getWatchExpressions().length, 0);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/test/browser/watchExpressionView.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/test/browser/watchExpressionView.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import * as dom from '../../../../../base/browser/dom.js';
import { HighlightedLabel } from '../../../../../base/browser/ui/highlightedlabel/highlightedLabel.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { WatchExpressionsRenderer } from '../../browser/watchExpressionsView.js';
import { Scope, StackFrame, Thread, Variable } from '../../common/debugModel.js';
import { MockDebugService, MockSession } from '../common/mockDebug.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { NullHoverService } from '../../../../../platform/hover/test/browser/nullHoverService.js';
import { IDebugService, IViewModel } from '../../common/debug.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { DebugExpressionRenderer } from '../../browser/debugExpressionRenderer.js';
const $ = dom.$;

function assertWatchVariable(disposables: Pick<DisposableStore, 'add'>, watchExpressionsRenderer: WatchExpressionsRenderer, displayType: boolean) {
	const session = new MockSession();
	const thread = new Thread(session, 'mockthread', 1);
	const range = {
		startLineNumber: 1,
		startColumn: 1,
		endLineNumber: undefined!,
		endColumn: undefined!
	};
	const stackFrame = new StackFrame(thread, 1, null!, 'app.js', 'normal', range, 0, true);
	const scope = new Scope(stackFrame, 1, 'local', 1, false, 10, 10);
	const node = {
		element: new Variable(session, 1, scope, 2, 'foo', 'bar.foo', undefined, 0, 0, undefined, {}, 'string'),
		depth: 0,
		visibleChildrenCount: 1,
		visibleChildIndex: -1,
		collapsible: false,
		collapsed: false,
		visible: true,
		filterData: undefined,
		children: []
	};
	const expression = $('.');
	const name = $('.');
	const type = $('.');
	const value = $('.');
	const label = disposables.add(new HighlightedLabel(name));
	const lazyButton = $('.');
	const inputBoxContainer = $('.');
	const elementDisposable = disposables.add(new DisposableStore());
	const templateDisposable = disposables.add(new DisposableStore());
	const currentElement = undefined;
	const data = {
		expression,
		name,
		type,
		value,
		label,
		lazyButton,
		inputBoxContainer,
		elementDisposable,
		templateDisposable,
		currentElement
	};
	watchExpressionsRenderer.renderElement(node, 0, data);
	assert.strictEqual(value.textContent, '');
	assert.strictEqual(label.element.textContent, displayType ? 'foo: ' : 'foo =');

	node.element.value = 'xpto';
	watchExpressionsRenderer.renderElement(node, 0, data);
	assert.strictEqual(value.textContent, 'xpto');
	assert.strictEqual(type.textContent, displayType ? 'string =' : '');
	assert.strictEqual(label.element.textContent, displayType ? 'foo: ' : 'foo =');
}

suite('Debug - Watch Debug View', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();
	let watchExpressionsRenderer: WatchExpressionsRenderer;
	let instantiationService: TestInstantiationService;
	let configurationService: TestConfigurationService;
	let expressionRenderer: DebugExpressionRenderer;

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables);
		configurationService = instantiationService.createInstance(TestConfigurationService);
		instantiationService.stub(IConfigurationService, configurationService);
		expressionRenderer = instantiationService.createInstance(DebugExpressionRenderer);
		const debugService = new MockDebugService();
		instantiationService.stub(IHoverService, NullHoverService);
		debugService.getViewModel = () => <IViewModel>{ focusedStackFrame: undefined, getSelectedExpression: () => undefined };
		debugService.getViewModel().getSelectedExpression = () => undefined;
		instantiationService.stub(IDebugService, debugService);
	});

	test('watch expressions with display type', () => {
		configurationService.setUserConfiguration('debug', { showVariableTypes: true });
		instantiationService.stub(IConfigurationService, configurationService);
		watchExpressionsRenderer = instantiationService.createInstance(WatchExpressionsRenderer, expressionRenderer);
		assertWatchVariable(disposables, watchExpressionsRenderer, true);
	});

	test('watch expressions', () => {
		configurationService.setUserConfiguration('debug', { showVariableTypes: false });
		instantiationService.stub(IConfigurationService, configurationService);
		watchExpressionsRenderer = instantiationService.createInstance(WatchExpressionsRenderer, expressionRenderer);
		assertWatchVariable(disposables, watchExpressionsRenderer, false);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/test/common/abstractDebugAdapter.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/test/common/abstractDebugAdapter.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { timeout } from '../../../../../base/common/async.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { MockDebugAdapter } from './mockDebug.js';

suite('Debug - AbstractDebugAdapter', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('event ordering', () => {
		let adapter: MockDebugAdapter;
		let output: string[];
		setup(() => {
			adapter = new MockDebugAdapter();
			output = [];
			adapter.onEvent(ev => {
				output.push((ev as DebugProtocol.OutputEvent).body.output);
				Promise.resolve().then(() => output.push('--end microtask--'));
			});
		});

		const evaluate = async (expression: string) => {
			await new Promise(resolve => adapter.sendRequest('evaluate', { expression }, resolve));
			output.push(`=${expression}`);
			Promise.resolve().then(() => output.push('--end microtask--'));
		};

		test('inserts task boundary before response', async () => {
			await evaluate('before.foo');
			await timeout(0);

			assert.deepStrictEqual(output, ['before.foo', '--end microtask--', '=before.foo', '--end microtask--']);
		});

		test('inserts task boundary after response', async () => {
			await evaluate('after.foo');
			await timeout(0);

			assert.deepStrictEqual(output, ['=after.foo', '--end microtask--', 'after.foo', '--end microtask--']);
		});

		test('does not insert boundaries between events', async () => {
			adapter.sendEventBody('output', { output: 'a' });
			adapter.sendEventBody('output', { output: 'b' });
			adapter.sendEventBody('output', { output: 'c' });
			await timeout(0);

			assert.deepStrictEqual(output, ['a', 'b', 'c', '--end microtask--', '--end microtask--', '--end microtask--']);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/test/common/debugModel.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/test/common/debugModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DeferredPromise } from '../../../../../base/common/async.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { mockObject, upcastDeepPartial, upcastPartial } from '../../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { ITextFileService } from '../../../../services/textfile/common/textfiles.js';
import { TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { IDebugSession } from '../../common/debug.js';
import { DebugModel, ExceptionBreakpoint, FunctionBreakpoint, Thread } from '../../common/debugModel.js';
import { MockDebugStorage } from './mockDebug.js';
import { runWithFakedTimers } from '../../../../../base/test/common/timeTravelScheduler.js';

suite('DebugModel', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('FunctionBreakpoint', () => {
		test('Id is saved', () => {
			const fbp = new FunctionBreakpoint({ name: 'function', enabled: true, hitCondition: 'hit condition', condition: 'condition', logMessage: 'log message' });
			const strigified = JSON.stringify(fbp);
			const parsed = JSON.parse(strigified);
			assert.equal(parsed.id, fbp.getId());
		});
	});

	suite('ExceptionBreakpoint', () => {
		test('Restored matches new', () => {
			const ebp = new ExceptionBreakpoint({
				conditionDescription: 'condition description',
				description: 'description',
				filter: 'condition',
				label: 'label',
				supportsCondition: true,
				enabled: true,
			}, 'id');
			const strigified = JSON.stringify(ebp);
			const parsed = JSON.parse(strigified);
			const newEbp = new ExceptionBreakpoint(parsed);
			assert.ok(ebp.matches(newEbp));
		});
	});

	suite('DebugModel', () => {
		test('refreshTopOfCallstack resolves all returned promises when called multiple times', async () => {
			return runWithFakedTimers({}, async () => {
				const topFrameDeferred = new DeferredPromise<void>();
				const wholeStackDeferred = new DeferredPromise<void>();
				const fakeThread = mockObject<Thread>()({
					session: upcastDeepPartial<IDebugSession>({ capabilities: { supportsDelayedStackTraceLoading: true } }),
					getCallStack: () => [],
					getStaleCallStack: () => [],
				});
				fakeThread.fetchCallStack.callsFake((levels: number) => {
					return levels === 1 ? topFrameDeferred.p : wholeStackDeferred.p;
				});
				fakeThread.getId.returns(1);

				const disposable = new DisposableStore();
				const storage = disposable.add(new TestStorageService());
				const model = new DebugModel(disposable.add(new MockDebugStorage(storage)), upcastPartial<ITextFileService>({ isDirty: (e: unknown) => false }), undefined!, new NullLogService());
				disposable.add(model);

				let top1Resolved = false;
				let whole1Resolved = false;
				let top2Resolved = false;
				let whole2Resolved = false;
				// eslint-disable-next-line local/code-no-any-casts
				const result1 = model.refreshTopOfCallstack(fakeThread as any);
				result1.topCallStack.then(() => top1Resolved = true);
				result1.wholeCallStack.then(() => whole1Resolved = true);

				// eslint-disable-next-line local/code-no-any-casts
				const result2 = model.refreshTopOfCallstack(fakeThread as any);
				result2.topCallStack.then(() => top2Resolved = true);
				result2.wholeCallStack.then(() => whole2Resolved = true);

				assert.ok(!top1Resolved);
				assert.ok(!whole1Resolved);
				assert.ok(!top2Resolved);
				assert.ok(!whole2Resolved);

				await topFrameDeferred.complete();
				await result1.topCallStack;
				await result2.topCallStack;
				assert.ok(!whole1Resolved);
				assert.ok(!whole2Resolved);

				await wholeStackDeferred.complete();
				await result1.wholeCallStack;
				await result2.wholeCallStack;

				disposable.dispose();
			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/test/common/mockDebug.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/test/common/mockDebug.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DeferredPromise } from '../../../../../base/common/async.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Event } from '../../../../../base/common/event.js';
import { URI as uri } from '../../../../../base/common/uri.js';
import { IPosition, Position } from '../../../../../editor/common/core/position.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { IWorkspaceFolder } from '../../../../../platform/workspace/common/workspace.js';
import { AbstractDebugAdapter } from '../../common/abstractDebugAdapter.js';
import { AdapterEndEvent, IAdapterManager, IBreakpoint, IBreakpointData, IBreakpointUpdateData, IConfig, IConfigurationManager, IDataBreakpoint, IDataBreakpointInfoResponse, IDebugLocationReferenced, IDebugModel, IDebugService, IDebugSession, IDebugSessionOptions, IDebugger, IExceptionBreakpoint, IExceptionInfo, IFunctionBreakpoint, IInstructionBreakpoint, ILaunch, IMemoryRegion, INewReplElementData, IRawModelUpdate, IRawStoppedDetails, IReplElement, IStackFrame, IThread, IViewModel, LoadedSourceEvent, State } from '../../common/debug.js';
import { DebugCompoundRoot } from '../../common/debugCompoundRoot.js';
import { IInstructionBreakpointOptions } from '../../common/debugModel.js';
import { Source } from '../../common/debugSource.js';
import { DebugStorage } from '../../common/debugStorage.js';

export class MockDebugService implements IDebugService {
	_serviceBrand: undefined;

	get state(): State {
		throw new Error('not implemented');
	}

	get onWillNewSession(): Event<IDebugSession> {
		throw new Error('not implemented');
	}

	get onDidNewSession(): Event<IDebugSession> {
		throw new Error('not implemented');
	}

	get onDidEndSession(): Event<{ session: IDebugSession; restart: boolean }> {
		throw new Error('not implemented');
	}

	get onDidChangeState(): Event<State> {
		throw new Error('not implemented');
	}

	getConfigurationManager(): IConfigurationManager {
		throw new Error('not implemented');
	}

	getAdapterManager(): IAdapterManager {
		throw new Error('Method not implemented.');
	}

	canSetBreakpointsIn(model: ITextModel): boolean {
		throw new Error('Method not implemented.');
	}

	focusStackFrame(focusedStackFrame: IStackFrame): Promise<void> {
		throw new Error('not implemented');
	}

	sendAllBreakpoints(session?: IDebugSession): Promise<any> {
		throw new Error('not implemented');
	}

	sendBreakpoints(modelUri: uri, sourceModified?: boolean | undefined, session?: IDebugSession | undefined): Promise<any> {
		throw new Error('not implemented');
	}

	addBreakpoints(uri: uri, rawBreakpoints: IBreakpointData[]): Promise<IBreakpoint[]> {
		throw new Error('not implemented');
	}

	updateBreakpoints(uri: uri, data: Map<string, IBreakpointUpdateData>, sendOnResourceSaved: boolean): Promise<void> {
		throw new Error('not implemented');
	}

	enableOrDisableBreakpoints(enabled: boolean): Promise<void> {
		throw new Error('not implemented');
	}

	setBreakpointsActivated(): Promise<void> {
		throw new Error('not implemented');
	}

	removeBreakpoints(): Promise<any> {
		throw new Error('not implemented');
	}

	addInstructionBreakpoint(opts: IInstructionBreakpointOptions): Promise<void> {
		throw new Error('Method not implemented.');
	}

	removeInstructionBreakpoints(address?: string): Promise<void> {
		throw new Error('Method not implemented.');
	}

	setExceptionBreakpointCondition(breakpoint: IExceptionBreakpoint, condition: string): Promise<void> {
		throw new Error('Method not implemented.');
	}

	setExceptionBreakpointsForSession(session: IDebugSession, data: DebugProtocol.ExceptionBreakpointsFilter[]): void {
		throw new Error('Method not implemented.');
	}

	addFunctionBreakpoint(): void { }

	moveWatchExpression(id: string, position: number): void { }

	updateFunctionBreakpoint(id: string, update: { name?: string; hitCondition?: string; condition?: string }): Promise<void> {
		throw new Error('not implemented');
	}

	removeFunctionBreakpoints(id?: string): Promise<void> {
		throw new Error('not implemented');
	}

	addDataBreakpoint(): Promise<void> {
		throw new Error('Method not implemented.');
	}

	updateDataBreakpoint(id: string, update: { hitCondition?: string; condition?: string }): Promise<void> {
		throw new Error('not implemented');
	}

	removeDataBreakpoints(id?: string | undefined): Promise<void> {
		throw new Error('Method not implemented.');
	}

	addReplExpression(name: string): Promise<void> {
		throw new Error('not implemented');
	}

	removeReplExpressions(): void { }

	addWatchExpression(name?: string): Promise<void> {
		throw new Error('not implemented');
	}

	renameWatchExpression(id: string, newName: string): Promise<void> {
		throw new Error('not implemented');
	}

	removeWatchExpressions(id?: string): void { }

	startDebugging(launch: ILaunch, configOrName?: IConfig | string, options?: IDebugSessionOptions): Promise<boolean> {
		return Promise.resolve(true);
	}

	restartSession(): Promise<any> {
		throw new Error('not implemented');
	}

	stopSession(): Promise<any> {
		throw new Error('not implemented');
	}

	getModel(): IDebugModel {
		throw new Error('not implemented');
	}

	getViewModel(): IViewModel {
		throw new Error('not implemented');
	}

	sourceIsNotAvailable(uri: uri): void { }

	tryToAutoFocusStackFrame(thread: IThread): Promise<any> {
		throw new Error('not implemented');
	}

	runTo(uri: uri, lineNumber: number, column?: number): Promise<void> {
		throw new Error('Method not implemented.');
	}
}

export class MockSession implements IDebugSession {
	readonly suppressDebugToolbar = false;
	readonly suppressDebugStatusbar = false;
	readonly suppressDebugView = false;
	readonly autoExpandLazyVariables = false;

	dispose(): void {

	}

	getMemory(memoryReference: string): IMemoryRegion {
		throw new Error('Method not implemented.');
	}

	get onDidInvalidateMemory(): Event<DebugProtocol.MemoryEvent> {
		throw new Error('Not implemented');
	}

	readMemory(memoryReference: string, offset: number, count: number): Promise<DebugProtocol.ReadMemoryResponse | undefined> {
		throw new Error('Method not implemented.');
	}

	writeMemory(memoryReference: string, offset: number, data: string, allowPartial?: boolean): Promise<DebugProtocol.WriteMemoryResponse | undefined> {
		throw new Error('Method not implemented.');
	}

	cancelCorrelatedTestRun(): void {

	}

	get compoundRoot(): DebugCompoundRoot | undefined {
		return undefined;
	}

	get saveBeforeRestart(): boolean {
		return true;
	}

	get isSimpleUI(): boolean {
		return false;
	}

	get lifecycleManagedByParent(): boolean {
		return false;
	}

	stepInTargets(frameId: number): Promise<{ id: number; label: string }[]> {
		throw new Error('Method not implemented.');
	}

	cancel(_progressId: string): Promise<DebugProtocol.CancelResponse> {
		throw new Error('Method not implemented.');
	}

	breakpointsLocations(uri: uri, lineNumber: number): Promise<IPosition[]> {
		throw new Error('Method not implemented.');
	}

	dataBytesBreakpointInfo(address: string, bytes: number): Promise<IDataBreakpointInfoResponse | undefined> {
		throw new Error('Method not implemented.');
	}

	dataBreakpointInfo(name: string, variablesReference?: number | undefined, frameId?: number | undefined): Promise<{ dataId: string | null; description: string; canPersist?: boolean | undefined } | undefined> {
		throw new Error('Method not implemented.');
	}

	sendDataBreakpoints(dbps: IDataBreakpoint[]): Promise<void> {
		throw new Error('Method not implemented.');
	}

	subId: string | undefined;

	get compact(): boolean {
		return false;
	}

	setSubId(subId: string | undefined): void {
		throw new Error('Method not implemented.');
	}

	get parentSession(): IDebugSession | undefined {
		return undefined;
	}

	getReplElements(): IReplElement[] {
		return [];
	}

	hasSeparateRepl(): boolean {
		return true;
	}

	removeReplExpressions(): void { }
	get onDidChangeReplElements(): Event<IReplElement | undefined> {
		throw new Error('not implemented');
	}

	addReplExpression(stackFrame: IStackFrame, name: string): Promise<void> {
		return Promise.resolve(undefined);
	}

	appendToRepl(data: INewReplElementData): void { }

	configuration: IConfig = { type: 'mock', name: 'mock', request: 'launch' };
	unresolvedConfiguration: IConfig = { type: 'mock', name: 'mock', request: 'launch' };
	state = State.Stopped;
	root!: IWorkspaceFolder;
	capabilities: DebugProtocol.Capabilities = {};

	getId(): string {
		return 'mock';
	}

	getLabel(): string {
		return 'mockname';
	}

	get name(): string {
		return 'mockname';
	}

	setName(name: string): void {
		throw new Error('not implemented');
	}

	getSourceForUri(modelUri: uri): Source {
		throw new Error('not implemented');
	}

	getThread(threadId: number): IThread {
		throw new Error('not implemented');
	}

	getStoppedDetails(): IRawStoppedDetails {
		throw new Error('not implemented');
	}

	get onDidCustomEvent(): Event<DebugProtocol.Event> {
		throw new Error('not implemented');
	}

	get onDidLoadedSource(): Event<LoadedSourceEvent> {
		throw new Error('not implemented');
	}

	get onDidChangeState(): Event<void> {
		throw new Error('not implemented');
	}

	get onDidEndAdapter(): Event<AdapterEndEvent | undefined> {
		throw new Error('not implemented');
	}

	get onDidChangeName(): Event<string> {
		throw new Error('not implemented');
	}

	get onDidProgressStart(): Event<DebugProtocol.ProgressStartEvent> {
		throw new Error('not implemented');
	}

	get onDidProgressUpdate(): Event<DebugProtocol.ProgressUpdateEvent> {
		throw new Error('not implemented');
	}

	get onDidProgressEnd(): Event<DebugProtocol.ProgressEndEvent> {
		throw new Error('not implemented');
	}

	setConfiguration(configuration: { resolved: IConfig; unresolved: IConfig }) { }

	getAllThreads(): IThread[] {
		return [];
	}

	getSource(raw: DebugProtocol.Source): Source {
		throw new Error('not implemented');
	}

	getLoadedSources(): Promise<Source[]> {
		return Promise.resolve([]);
	}

	completions(frameId: number, threadId: number, text: string, position: Position): Promise<DebugProtocol.CompletionsResponse> {
		throw new Error('not implemented');
	}

	clearThreads(removeThreads: boolean, reference?: number): void { }

	rawUpdate(data: IRawModelUpdate): void { }

	initialize(dbgr: IDebugger): Promise<void> {
		throw new Error('Method not implemented.');
	}
	launchOrAttach(config: IConfig): Promise<void> {
		throw new Error('Method not implemented.');
	}
	restart(): Promise<void> {
		throw new Error('Method not implemented.');
	}
	sendBreakpoints(modelUri: uri, bpts: IBreakpoint[], sourceModified: boolean): Promise<void> {
		throw new Error('Method not implemented.');
	}
	sendFunctionBreakpoints(fbps: IFunctionBreakpoint[]): Promise<void> {
		throw new Error('Method not implemented.');
	}
	sendExceptionBreakpoints(exbpts: IExceptionBreakpoint[]): Promise<void> {
		throw new Error('Method not implemented.');
	}
	sendInstructionBreakpoints(dbps: IInstructionBreakpoint[]): Promise<void> {
		throw new Error('Method not implemented.');
	}
	getDebugProtocolBreakpoint(breakpointId: string): DebugProtocol.Breakpoint | undefined {
		throw new Error('Method not implemented.');
	}
	customRequest(request: string, args: any): Promise<DebugProtocol.Response> {
		throw new Error('Method not implemented.');
	}
	stackTrace(threadId: number, startFrame: number, levels: number, token: CancellationToken): Promise<DebugProtocol.StackTraceResponse> {
		throw new Error('Method not implemented.');
	}
	exceptionInfo(threadId: number): Promise<IExceptionInfo> {
		throw new Error('Method not implemented.');
	}
	scopes(frameId: number): Promise<DebugProtocol.ScopesResponse> {
		throw new Error('Method not implemented.');
	}
	variables(variablesReference: number, threadId: number | undefined, filter: 'indexed' | 'named', start: number, count: number): Promise<DebugProtocol.VariablesResponse> {
		throw new Error('Method not implemented.');
	}
	evaluate(expression: string, frameId: number, context?: string): Promise<DebugProtocol.EvaluateResponse> {
		throw new Error('Method not implemented.');
	}
	restartFrame(frameId: number, threadId: number): Promise<void> {
		throw new Error('Method not implemented.');
	}
	next(threadId: number, granularity?: DebugProtocol.SteppingGranularity): Promise<void> {
		throw new Error('Method not implemented.');
	}
	stepIn(threadId: number, targetId?: number, granularity?: DebugProtocol.SteppingGranularity): Promise<void> {
		throw new Error('Method not implemented.');
	}
	stepOut(threadId: number, granularity?: DebugProtocol.SteppingGranularity): Promise<void> {
		throw new Error('Method not implemented.');
	}
	stepBack(threadId: number, granularity?: DebugProtocol.SteppingGranularity): Promise<void> {
		throw new Error('Method not implemented.');
	}
	continue(threadId: number): Promise<void> {
		throw new Error('Method not implemented.');
	}
	reverseContinue(threadId: number): Promise<void> {
		throw new Error('Method not implemented.');
	}
	pause(threadId: number): Promise<void> {
		throw new Error('Method not implemented.');
	}
	terminateThreads(threadIds: number[]): Promise<void> {
		throw new Error('Method not implemented.');
	}
	setVariable(variablesReference: number, name: string, value: string): Promise<DebugProtocol.SetVariableResponse> {
		throw new Error('Method not implemented.');
	}
	setExpression(frameId: number, expression: string, value: string): Promise<DebugProtocol.SetExpressionResponse | undefined> {
		throw new Error('Method not implemented.');
	}
	loadSource(resource: uri): Promise<DebugProtocol.SourceResponse> {
		throw new Error('Method not implemented.');
	}
	disassemble(memoryReference: string, offset: number, instructionOffset: number, instructionCount: number): Promise<DebugProtocol.DisassembledInstruction[] | undefined> {
		throw new Error('Method not implemented.');
	}

	terminate(restart = false): Promise<void> {
		throw new Error('Method not implemented.');
	}
	disconnect(restart = false): Promise<void> {
		throw new Error('Method not implemented.');
	}

	gotoTargets(source: DebugProtocol.Source, line: number, column?: number | undefined): Promise<DebugProtocol.GotoTargetsResponse> {
		throw new Error('Method not implemented.');
	}
	goto(threadId: number, targetId: number): Promise<DebugProtocol.GotoResponse> {
		throw new Error('Method not implemented.');
	}
	resolveLocationReference(locationReference: number): Promise<IDebugLocationReferenced> {
		throw new Error('Method not implemented.');
	}
}

export class MockRawSession {

	capabilities: DebugProtocol.Capabilities = {};
	disconnected = false;
	sessionLengthInSeconds: number = 0;

	readyForBreakpoints = true;
	emittedStopped = true;

	getLengthInSeconds(): number {
		return 100;
	}

	stackTrace(args: DebugProtocol.StackTraceArguments): Promise<DebugProtocol.StackTraceResponse> {
		return Promise.resolve({
			seq: 1,
			type: 'response',
			request_seq: 1,
			success: true,
			command: 'stackTrace',
			body: {
				stackFrames: [{
					id: 1,
					name: 'mock',
					line: 5,
					column: 6
				}]
			}
		});
	}

	exceptionInfo(args: DebugProtocol.ExceptionInfoArguments): Promise<DebugProtocol.ExceptionInfoResponse> {
		throw new Error('not implemented');
	}

	launchOrAttach(args: IConfig): Promise<DebugProtocol.Response> {
		throw new Error('not implemented');
	}

	scopes(args: DebugProtocol.ScopesArguments): Promise<DebugProtocol.ScopesResponse> {
		throw new Error('not implemented');
	}

	variables(args: DebugProtocol.VariablesArguments): Promise<DebugProtocol.VariablesResponse> {
		throw new Error('not implemented');
	}

	evaluate(args: DebugProtocol.EvaluateArguments): Promise<DebugProtocol.EvaluateResponse> {
		return Promise.resolve(null!);
	}

	custom(request: string, args: any): Promise<DebugProtocol.Response> {
		throw new Error('not implemented');
	}

	terminate(restart = false): Promise<DebugProtocol.TerminateResponse> {
		throw new Error('not implemented');
	}

	disconnect(): Promise<any> {
		throw new Error('not implemented');
	}

	threads(): Promise<DebugProtocol.ThreadsResponse> {
		throw new Error('not implemented');
	}

	stepIn(args: DebugProtocol.StepInArguments): Promise<DebugProtocol.StepInResponse> {
		throw new Error('not implemented');
	}

	stepOut(args: DebugProtocol.StepOutArguments): Promise<DebugProtocol.StepOutResponse> {
		throw new Error('not implemented');
	}

	stepBack(args: DebugProtocol.StepBackArguments): Promise<DebugProtocol.StepBackResponse> {
		throw new Error('not implemented');
	}

	continue(args: DebugProtocol.ContinueArguments): Promise<DebugProtocol.ContinueResponse> {
		throw new Error('not implemented');
	}

	reverseContinue(args: DebugProtocol.ReverseContinueArguments): Promise<DebugProtocol.ReverseContinueResponse> {
		throw new Error('not implemented');
	}

	pause(args: DebugProtocol.PauseArguments): Promise<DebugProtocol.PauseResponse> {
		throw new Error('not implemented');
	}

	terminateThreads(args: DebugProtocol.TerminateThreadsArguments): Promise<DebugProtocol.TerminateThreadsResponse> {
		throw new Error('not implemented');
	}

	setVariable(args: DebugProtocol.SetVariableArguments): Promise<DebugProtocol.SetVariableResponse> {
		throw new Error('not implemented');
	}

	restartFrame(args: DebugProtocol.RestartFrameArguments): Promise<DebugProtocol.RestartFrameResponse> {
		throw new Error('not implemented');
	}

	completions(args: DebugProtocol.CompletionsArguments): Promise<DebugProtocol.CompletionsResponse> {
		throw new Error('not implemented');
	}

	next(args: DebugProtocol.NextArguments): Promise<DebugProtocol.NextResponse> {
		throw new Error('not implemented');
	}

	source(args: DebugProtocol.SourceArguments): Promise<DebugProtocol.SourceResponse> {
		throw new Error('not implemented');
	}

	loadedSources(args: DebugProtocol.LoadedSourcesArguments): Promise<DebugProtocol.LoadedSourcesResponse> {
		throw new Error('not implemented');
	}

	setBreakpoints(args: DebugProtocol.SetBreakpointsArguments): Promise<DebugProtocol.SetBreakpointsResponse> {
		throw new Error('not implemented');
	}

	setFunctionBreakpoints(args: DebugProtocol.SetFunctionBreakpointsArguments): Promise<DebugProtocol.SetFunctionBreakpointsResponse> {
		throw new Error('not implemented');
	}

	setExceptionBreakpoints(args: DebugProtocol.SetExceptionBreakpointsArguments): Promise<DebugProtocol.SetExceptionBreakpointsResponse> {
		throw new Error('not implemented');
	}

	readonly onDidStop: Event<DebugProtocol.StoppedEvent> = null!;
}

export class MockDebugAdapter extends AbstractDebugAdapter {
	private seq = 0;

	private pendingResponses = new Map<string, DeferredPromise<DebugProtocol.Response>>();

	startSession(): Promise<void> {
		return Promise.resolve();
	}

	stopSession(): Promise<void> {
		return Promise.resolve();
	}

	sendMessage(message: DebugProtocol.ProtocolMessage): void {
		if (message.type === 'request') {
			setTimeout(() => {
				const request = message as DebugProtocol.Request;
				switch (request.command) {
					case 'evaluate':
						this.evaluate(request, request.arguments);
						return;
				}
				this.sendResponseBody(request, {});
				return;
			}, 0);
		} else if (message.type === 'response') {
			const response = message as DebugProtocol.Response;
			if (this.pendingResponses.has(response.command)) {
				this.pendingResponses.get(response.command)!.complete(response);
			}
		}
	}

	sendResponseBody(request: DebugProtocol.Request, body: any) {
		const response: DebugProtocol.Response = {
			seq: ++this.seq,
			type: 'response',
			request_seq: request.seq,
			command: request.command,
			success: true,
			body
		};
		this.acceptMessage(response);
	}

	sendEventBody(event: string, body: any) {
		const response: DebugProtocol.Event = {
			seq: ++this.seq,
			type: 'event',
			event,
			body
		};
		this.acceptMessage(response);
	}

	waitForResponseFromClient(command: string): Promise<DebugProtocol.Response> {
		const deferred = new DeferredPromise<DebugProtocol.Response>();
		if (this.pendingResponses.has(command)) {
			return this.pendingResponses.get(command)!.p;
		}

		this.pendingResponses.set(command, deferred);
		return deferred.p;
	}

	sendRequestBody(command: string, args: any) {
		const response: DebugProtocol.Request = {
			seq: ++this.seq,
			type: 'request',
			command,
			arguments: args
		};
		this.acceptMessage(response);
	}

	evaluate(request: DebugProtocol.Request, args: DebugProtocol.EvaluateArguments) {
		if (args.expression.indexOf('before.') === 0) {
			this.sendEventBody('output', { output: args.expression });
		}

		this.sendResponseBody(request, {
			result: '=' + args.expression,
			variablesReference: 0
		});

		if (args.expression.indexOf('after.') === 0) {
			this.sendEventBody('output', { output: args.expression });
		}
	}
}

export class MockDebugStorage extends DebugStorage {

	constructor(storageService: IStorageService) {
		super(storageService, undefined!, undefined!, new NullLogService());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/test/node/debugger.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/test/node/debugger.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { join, normalize } from '../../../../../base/common/path.js';
import * as platform from '../../../../../base/common/platform.js';
import { IDebugAdapterExecutable, IConfig, IDebugSession, IAdapterManager, IDebuggerContribution } from '../../common/debug.js';
import { Debugger } from '../../common/debugger.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { URI } from '../../../../../base/common/uri.js';
import { ExecutableDebugAdapter } from '../../node/debugAdapter.js';
import { TestTextResourcePropertiesService } from '../../../../../editor/test/common/services/testTextResourcePropertiesService.js';
import { ExtensionIdentifier, IExtensionDescription, TargetPlatform } from '../../../../../platform/extensions/common/extensions.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';


suite('Debug - Debugger', () => {
	let _debugger: Debugger;

	const extensionFolderPath = '/a/b/c/';
	const debuggerContribution: IDebuggerContribution = {
		type: 'mock',
		label: 'Mock Debug',
		program: './out/mock/mockDebug.js',
		args: ['arg1', 'arg2'],
		configurationAttributes: {
			launch: {
				required: ['program'],
				properties: {
					program: {
						'type': 'string',
						'description': 'Workspace relative path to a text file.',
						'default': 'readme.md'
					}
				}
			}
		},
		variables: null!,
		initialConfigurations: [
			{
				name: 'Mock-Debug',
				type: 'mock',
				request: 'launch',
				program: 'readme.md'
			}
		]
	};

	const extensionDescriptor0 = <IExtensionDescription>{
		id: 'adapter',
		identifier: new ExtensionIdentifier('adapter'),
		name: 'myAdapter',
		version: '1.0.0',
		publisher: 'vscode',
		extensionLocation: URI.file(extensionFolderPath),
		isBuiltin: false,
		isUserBuiltin: false,
		isUnderDevelopment: false,
		engines: null!,
		targetPlatform: TargetPlatform.UNDEFINED,
		contributes: {
			'debuggers': [
				debuggerContribution
			]
		},
		enabledApiProposals: undefined,
		preRelease: false,
	};

	const extensionDescriptor1 = {
		id: 'extension1',
		identifier: new ExtensionIdentifier('extension1'),
		name: 'extension1',
		version: '1.0.0',
		publisher: 'vscode',
		extensionLocation: URI.file('/e1/b/c/'),
		isBuiltin: false,
		isUserBuiltin: false,
		isUnderDevelopment: false,
		engines: null!,
		targetPlatform: TargetPlatform.UNDEFINED,
		contributes: {
			'debuggers': [
				{
					type: 'mock',
					runtime: 'runtime',
					runtimeArgs: ['rarg'],
					program: 'mockprogram',
					args: ['parg']
				}
			]
		},
		enabledApiProposals: undefined,
		preRelease: false,
	};

	const extensionDescriptor2 = {
		id: 'extension2',
		identifier: new ExtensionIdentifier('extension2'),
		name: 'extension2',
		version: '1.0.0',
		publisher: 'vscode',
		extensionLocation: URI.file('/e2/b/c/'),
		isBuiltin: false,
		isUserBuiltin: false,
		isUnderDevelopment: false,
		engines: null!,
		targetPlatform: TargetPlatform.UNDEFINED,
		contributes: {
			'debuggers': [
				{
					type: 'mock',
					win: {
						runtime: 'winRuntime',
						program: 'winProgram'
					},
					linux: {
						runtime: 'linuxRuntime',
						program: 'linuxProgram'
					},
					osx: {
						runtime: 'osxRuntime',
						program: 'osxProgram'
					}
				}
			]
		},
		enabledApiProposals: undefined,
		preRelease: false,
	};


	const adapterManager = <IAdapterManager>{
		getDebugAdapterDescriptor(session: IDebugSession, config: IConfig): Promise<IDebugAdapterExecutable | undefined> {
			return Promise.resolve(undefined);
		}
	};

	ensureNoDisposablesAreLeakedInTestSuite();

	const configurationService = new TestConfigurationService();
	const testResourcePropertiesService = new TestTextResourcePropertiesService(configurationService);

	setup(() => {
		_debugger = new Debugger(adapterManager, debuggerContribution, extensionDescriptor0, configurationService, testResourcePropertiesService, undefined!, undefined!, undefined!, undefined!);
	});

	teardown(() => {
		_debugger = null!;
	});

	test('attributes', () => {
		assert.strictEqual(_debugger.type, debuggerContribution.type);
		assert.strictEqual(_debugger.label, debuggerContribution.label);

		const ae = ExecutableDebugAdapter.platformAdapterExecutable([extensionDescriptor0], 'mock');

		assert.strictEqual(ae!.command, join(extensionFolderPath, debuggerContribution.program!));
		assert.deepStrictEqual(ae!.args, debuggerContribution.args);
	});

	test('merge platform specific attributes', function () {
		if (!process.versions.electron) {
			this.skip(); //TODO@debug this test fails when run in node.js environments
		}
		const ae = ExecutableDebugAdapter.platformAdapterExecutable([extensionDescriptor1, extensionDescriptor2], 'mock')!;
		assert.strictEqual(ae.command, platform.isLinux ? 'linuxRuntime' : (platform.isMacintosh ? 'osxRuntime' : 'winRuntime'));
		const xprogram = platform.isLinux ? 'linuxProgram' : (platform.isMacintosh ? 'osxProgram' : 'winProgram');
		assert.deepStrictEqual(ae.args, ['rarg', normalize('/e2/b/c/') + xprogram, 'parg']);
	});

	test('initial config file content', () => {

		const expected = ['{',
			'	// Use IntelliSense to learn about possible attributes.',
			'	// Hover to view descriptions of existing attributes.',
			'	// For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387',
			'	"version": "0.2.0",',
			'	"configurations": [',
			'		{',
			'			"name": "Mock-Debug",',
			'			"type": "mock",',
			'			"request": "launch",',
			'			"program": "readme.md"',
			'		}',
			'	]',
			'}'].join(testResourcePropertiesService.getEOL(URI.file('somefile')));

		return _debugger.getInitialConfigurationContent().then(content => {
			assert.strictEqual(content, expected);
		}, err => assert.fail(err));
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/test/node/streamDebugAdapter.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/test/node/streamDebugAdapter.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as crypto from 'crypto';
import * as net from 'net';
import * as platform from '../../../../../base/common/platform.js';
import { tmpdir } from 'os';
import { join } from '../../../../../base/common/path.js';
import * as ports from '../../../../../base/node/ports.js';
import { SocketDebugAdapter, NamedPipeDebugAdapter, StreamDebugAdapter } from '../../node/debugAdapter.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';


function sendInitializeRequest(debugAdapter: StreamDebugAdapter): Promise<DebugProtocol.Response> {
	return new Promise((resolve, reject) => {
		debugAdapter.sendRequest('initialize', { adapterID: 'test' }, (result) => {
			resolve(result);
		}, 3000);
	});
}

function serverConnection(socket: net.Socket) {
	socket.on('data', (data: Buffer) => {
		const str = data.toString().split('\r\n')[2];
		const request = JSON.parse(str);
		const response: any = {
			seq: request.seq,
			request_seq: request.seq,
			type: 'response',
			command: request.command
		};
		if (request.arguments.adapterID === 'test') {
			response.success = true;
		} else {
			response.success = false;
			response.message = 'failed';
		}

		const responsePayload = JSON.stringify(response);
		socket.write(`Content-Length: ${responsePayload.length}\r\n\r\n${responsePayload}`);
	});
}

suite('Debug - StreamDebugAdapter', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test(`StreamDebugAdapter (NamedPipeDebugAdapter) can initialize a connection`, async () => {

		const pipeName = crypto.randomBytes(10).toString('hex');
		const pipePath = platform.isWindows ? join('\\\\.\\pipe\\', pipeName) : join(tmpdir(), pipeName);
		const server = await new Promise<net.Server>((resolve, reject) => {
			const server = net.createServer(serverConnection);
			server.once('listening', () => resolve(server));
			server.once('error', reject);
			server.listen(pipePath);
		});

		const debugAdapter = new NamedPipeDebugAdapter({
			type: 'pipeServer',
			path: pipePath
		});
		try {
			await debugAdapter.startSession();
			const response: DebugProtocol.Response = await sendInitializeRequest(debugAdapter);
			assert.strictEqual(response.command, 'initialize');
			assert.strictEqual(response.request_seq, 1);
			assert.strictEqual(response.success, true, response.message);
		} finally {
			await debugAdapter.stopSession();
			server.close();
			debugAdapter.dispose();
		}
	});

	test(`StreamDebugAdapter (SocketDebugAdapter) can initialize a connection`, async () => {

		const rndPort = Math.floor(Math.random() * 1000 + 8000);
		const port = await ports.findFreePort(rndPort, 10 /* try 10 ports */, 3000 /* try up to 3 seconds */, 87 /* skip 87 ports between attempts */);
		const server = net.createServer(serverConnection).listen(port);
		const debugAdapter = new SocketDebugAdapter({
			type: 'server',
			port
		});
		try {
			await debugAdapter.startSession();
			const response: DebugProtocol.Response = await sendInitializeRequest(debugAdapter);
			assert.strictEqual(response.command, 'initialize');
			assert.strictEqual(response.request_seq, 1);
			assert.strictEqual(response.success, true, response.message);
		} finally {
			await debugAdapter.stopSession();
			server.close();
			debugAdapter.dispose();
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/debug/test/node/terminals.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/debug/test/node/terminals.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { prepareCommand } from '../../node/terminals.js';


suite('Debug - prepareCommand', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('bash', () => {
		assert.strictEqual(
			prepareCommand('bash', ['{$} ('], false).trim(),
			'\\{\\$\\}\\ \\(');
		assert.strictEqual(
			prepareCommand('bash', ['hello', 'world', '--flag=true'], false).trim(),
			'hello world --flag=true');
		assert.strictEqual(
			prepareCommand('bash', [' space arg '], false).trim(),
			'\\ space\\ arg\\');

		assert.strictEqual(
			prepareCommand('bash', ['{$} ('], true).trim(),
			'{$} (');
		assert.strictEqual(
			prepareCommand('bash', ['hello', 'world', '--flag=true'], true).trim(),
			'hello world --flag=true');
		assert.strictEqual(
			prepareCommand('bash', [' space arg '], true).trim(),
			'space arg');
	});

	test('bash - do not escape > and <', () => {
		assert.strictEqual(
			prepareCommand('bash', ['arg1', '>', '> hello.txt', '<', '<input.in'], false).trim(),
			'arg1 > \\>\\ hello.txt < \\<input.in');
	});

	test('cmd', () => {
		assert.strictEqual(
			prepareCommand('cmd.exe', ['^!< '], false).trim(),
			'"^^^!^< "');
		assert.strictEqual(
			prepareCommand('cmd.exe', ['hello', 'world', '--flag=true'], false).trim(),
			'hello world --flag=true');
		assert.strictEqual(
			prepareCommand('cmd.exe', [' space arg '], false).trim(),
			'" space arg "');
		assert.strictEqual(
			prepareCommand('cmd.exe', ['"A>0"'], false).trim(),
			'"""A^>0"""');
		assert.strictEqual(
			prepareCommand('cmd.exe', [''], false).trim(),
			'""');

		assert.strictEqual(
			prepareCommand('cmd.exe', ['^!< '], true).trim(),
			'^!<');
		assert.strictEqual(
			prepareCommand('cmd.exe', ['hello', 'world', '--flag=true'], true).trim(),
			'hello world --flag=true');
		assert.strictEqual(
			prepareCommand('cmd.exe', [' space arg '], true).trim(),
			'space arg');
		assert.strictEqual(
			prepareCommand('cmd.exe', ['"A>0"'], true).trim(),
			'"A>0"');
		assert.strictEqual(
			prepareCommand('cmd.exe', [''], true).trim(),
			'');
	});

	test('cmd - do not escape > and <', () => {
		assert.strictEqual(
			prepareCommand('cmd.exe', ['arg1', '>', '> hello.txt', '<', '<input.in'], false).trim(),
			'arg1 > "^> hello.txt" < ^<input.in');
	});

	test('powershell', () => {
		assert.strictEqual(
			prepareCommand('powershell', ['!< '], false).trim(),
			`& '!< '`);
		assert.strictEqual(
			prepareCommand('powershell', ['hello', 'world', '--flag=true'], false).trim(),
			`& 'hello' 'world' '--flag=true'`);
		assert.strictEqual(
			prepareCommand('powershell', [' space arg '], false).trim(),
			`& ' space arg '`);
		assert.strictEqual(
			prepareCommand('powershell', ['"A>0"'], false).trim(),
			`& '"A>0"'`);
		assert.strictEqual(
			prepareCommand('powershell', [''], false).trim(),
			`& ''`);

		assert.strictEqual(
			prepareCommand('powershell', ['!< '], true).trim(),
			'!<');
		assert.strictEqual(
			prepareCommand('powershell', ['hello', 'world', '--flag=true'], true).trim(),
			'hello world --flag=true');
		assert.strictEqual(
			prepareCommand('powershell', [' space arg '], true).trim(),
			'space arg');
		assert.strictEqual(
			prepareCommand('powershell', ['"A>0"'], true).trim(),
			'"A>0"');
		assert.strictEqual(
			prepareCommand('powershell', [''], true).trim(),
			``);
	});

	test('powershell - do not escape > and <', () => {
		assert.strictEqual(
			prepareCommand('powershell', ['arg1', '>', '> hello.txt', '<', '<input.in'], false).trim(),
			`& 'arg1' > '> hello.txt' < '<input.in'`);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/dropOrPasteInto/browser/commands.ts]---
Location: vscode-main/src/vs/workbench/contrib/dropOrPasteInto/browser/commands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { toAction } from '../../../../base/common/actions.js';
import { CopyPasteController, pasteAsPreferenceConfig } from '../../../../editor/contrib/dropOrPasteInto/browser/copyPasteController.js';
import { DropIntoEditorController, dropAsPreferenceConfig } from '../../../../editor/contrib/dropOrPasteInto/browser/dropIntoEditorController.js';
import { localize } from '../../../../nls.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IPreferencesService } from '../../../services/preferences/common/preferences.js';

export class DropOrPasteIntoCommands implements IWorkbenchContribution {
	public static ID = 'workbench.contrib.dropOrPasteInto';

	constructor(
		@IPreferencesService private readonly _preferencesService: IPreferencesService
	) {
		CopyPasteController.setConfigureDefaultAction(toAction({
			id: 'workbench.action.configurePreferredPasteAction',
			label: localize('configureDefaultPaste.label', 'Configure preferred paste action...'),
			run: () => this.configurePreferredPasteAction()
		}));

		DropIntoEditorController.setConfigureDefaultAction(toAction({
			id: 'workbench.action.configurePreferredDropAction',
			label: localize('configureDefaultDrop.label', 'Configure preferred drop action...'),
			run: () => this.configurePreferredDropAction()
		}));
	}

	private configurePreferredPasteAction() {
		return this._preferencesService.openUserSettings({
			jsonEditor: true,
			revealSetting: { key: pasteAsPreferenceConfig, edit: true }
		});
	}

	private configurePreferredDropAction() {
		return this._preferencesService.openUserSettings({
			jsonEditor: true,
			revealSetting: { key: dropAsPreferenceConfig, edit: true }
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/dropOrPasteInto/browser/configurationSchema.ts]---
Location: vscode-main/src/vs/workbench/contrib/dropOrPasteInto/browser/configurationSchema.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { HierarchicalKind } from '../../../../base/common/hierarchicalKind.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { editorConfigurationBaseNode } from '../../../../editor/common/config/editorConfigurationSchema.js';
import { ILanguageFeaturesService } from '../../../../editor/common/services/languageFeatures.js';
import { pasteAsCommandId } from '../../../../editor/contrib/dropOrPasteInto/browser/copyPasteContribution.js';
import { pasteAsPreferenceConfig } from '../../../../editor/contrib/dropOrPasteInto/browser/copyPasteController.js';
import { dropAsPreferenceConfig } from '../../../../editor/contrib/dropOrPasteInto/browser/dropIntoEditorController.js';
import * as nls from '../../../../nls.js';
import { ConfigurationScope, Extensions, IConfigurationNode, IConfigurationPropertySchema, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';

const dropEnumValues: string[] = [];

const dropAsPreferenceSchema: IConfigurationPropertySchema = {
	type: 'array',
	scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
	description: nls.localize('dropPreferredDescription', "Configures the preferred type of edit to use when dropping content.\n\nThis is an ordered list of edit kinds. The first available edit of a preferred kind will be used."),
	default: [],
	items: {
		description: nls.localize('dropKind', "The kind identifier of the drop edit."),
		anyOf: [
			{ type: 'string' },
			{ enum: dropEnumValues }
		],
	}
};

const pasteEnumValues: string[] = [];

const pasteAsPreferenceSchema: IConfigurationPropertySchema = {
	type: 'array',
	scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
	description: nls.localize('pastePreferredDescription', "Configures the preferred type of edit to use when pasting content.\n\nThis is an ordered list of edit kinds. The first available edit of a preferred kind will be used."),
	default: [],
	items: {
		description: nls.localize('pasteKind', "The kind identifier of the paste edit."),
		anyOf: [
			{ type: 'string' },
			{ enum: pasteEnumValues }
		]
	}
};

export const editorConfiguration = Object.freeze<IConfigurationNode>({
	...editorConfigurationBaseNode,
	properties: {
		[pasteAsPreferenceConfig]: pasteAsPreferenceSchema,
		[dropAsPreferenceConfig]: dropAsPreferenceSchema,
	}
});

export class DropOrPasteSchemaContribution extends Disposable implements IWorkbenchContribution {

	public static ID = 'workbench.contrib.dropOrPasteIntoSchema';

	private readonly _onDidChangeSchemaContributions = this._register(new Emitter<void>());

	private _allProvidedDropKinds: HierarchicalKind[] = [];
	private _allProvidedPasteKinds: HierarchicalKind[] = [];

	constructor(
		@IKeybindingService keybindingService: IKeybindingService,
		@ILanguageFeaturesService private readonly languageFeatures: ILanguageFeaturesService
	) {
		super();

		this._register(
			Event.runAndSubscribe(
				Event.debounce(
					Event.any(languageFeatures.documentPasteEditProvider.onDidChange, languageFeatures.documentPasteEditProvider.onDidChange),
					() => { },
					1000,
				), () => {
					this.updateProvidedKinds();
					this.updateConfigurationSchema();

					this._onDidChangeSchemaContributions.fire();
				}));

		this._register(keybindingService.registerSchemaContribution({
			getSchemaAdditions: () => this.getKeybindingSchemaAdditions(),
			onDidChange: this._onDidChangeSchemaContributions.event,
		}));
	}

	private updateProvidedKinds(): void {
		// Drop
		const dropKinds = new Map<string, HierarchicalKind>();
		for (const provider of this.languageFeatures.documentDropEditProvider.allNoModel()) {
			for (const kind of provider.providedDropEditKinds ?? []) {
				dropKinds.set(kind.value, kind);
			}
		}
		this._allProvidedDropKinds = Array.from(dropKinds.values());

		// Paste
		const pasteKinds = new Map<string, HierarchicalKind>();
		for (const provider of this.languageFeatures.documentPasteEditProvider.allNoModel()) {
			for (const kind of provider.providedPasteEditKinds ?? []) {
				pasteKinds.set(kind.value, kind);
			}
		}
		this._allProvidedPasteKinds = Array.from(pasteKinds.values());
	}

	private updateConfigurationSchema(): void {
		pasteEnumValues.length = 0;
		for (const codeActionKind of this._allProvidedPasteKinds) {
			pasteEnumValues.push(codeActionKind.value);
		}

		dropEnumValues.length = 0;
		for (const codeActionKind of this._allProvidedDropKinds) {
			dropEnumValues.push(codeActionKind.value);
		}

		Registry.as<IConfigurationRegistry>(Extensions.Configuration)
			.notifyConfigurationSchemaUpdated(editorConfiguration);
	}

	private getKeybindingSchemaAdditions(): IJSONSchema[] {
		return [
			{
				if: {
					required: ['command'],
					properties: {
						'command': { const: pasteAsCommandId }
					}
				},
				then: {
					properties: {
						'args': {
							oneOf: [
								{
									required: ['kind'],
									properties: {
										'kind': {
											anyOf: [
												{ enum: Array.from(this._allProvidedPasteKinds.map(x => x.value)) },
												{ type: 'string' },
											]
										}
									}
								},
								{
									required: ['preferences'],
									properties: {
										'preferences': {
											type: 'array',
											items: {
												anyOf: [
													{ enum: Array.from(this._allProvidedPasteKinds.map(x => x.value)) },
													{ type: 'string' },
												]
											}
										}
									}
								}
							]
						}
					}
				}
			},
		];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/dropOrPasteInto/browser/dropOrPasteInto.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/dropOrPasteInto/browser/dropOrPasteInto.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Extensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';
import { DropOrPasteIntoCommands } from './commands.js';
import { DropOrPasteSchemaContribution, editorConfiguration } from './configurationSchema.js';

registerWorkbenchContribution2(DropOrPasteIntoCommands.ID, DropOrPasteIntoCommands, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(DropOrPasteSchemaContribution.ID, DropOrPasteSchemaContribution, WorkbenchPhase.Eventually);

Registry.as<IConfigurationRegistry>(Extensions.Configuration)
	.registerConfiguration(editorConfiguration);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editSessions/browser/editSessions.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/editSessions/browser/editSessions.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableStore, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions, IWorkbenchContribution } from '../../../common/contributions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ILifecycleService, LifecyclePhase, ShutdownReason } from '../../../services/lifecycle/common/lifecycle.js';
import { Action2, IAction2Options, MenuId, MenuRegistry, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { localize, localize2 } from '../../../../nls.js';
import { IEditSessionsStorageService, Change, ChangeType, Folder, EditSession, FileType, EDIT_SESSION_SYNC_CATEGORY, EDIT_SESSIONS_CONTAINER_ID, EditSessionSchemaVersion, IEditSessionsLogService, EDIT_SESSIONS_VIEW_ICON, EDIT_SESSIONS_TITLE, EDIT_SESSIONS_SHOW_VIEW, EDIT_SESSIONS_DATA_VIEW_ID, decodeEditSessionFileContent, hashedEditSessionId, editSessionsLogId, EDIT_SESSIONS_PENDING } from '../common/editSessions.js';
import { ISCMRepository, ISCMService } from '../../scm/common/scm.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IWorkspaceContextService, IWorkspaceFolder, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { URI } from '../../../../base/common/uri.js';
import { basename, joinPath, relativePath } from '../../../../base/common/resources.js';
import { encodeBase64 } from '../../../../base/common/buffer.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IProgress, IProgressService, IProgressStep, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { EditSessionsWorkbenchService } from './editSessionsStorageService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { UserDataSyncErrorCode, UserDataSyncStoreError } from '../../../../platform/userDataSync/common/userDataSync.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { getFileNamesMessage, IDialogService, IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { workbenchConfigurationNodeBase } from '../../../common/configuration.js';
import { Extensions as ConfigurationExtensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IQuickInputButton, IQuickInputService, IQuickPickItem, IQuickPickSeparator } from '../../../../platform/quickinput/common/quickInput.js';
import { ExtensionsRegistry } from '../../../services/extensions/common/extensionsRegistry.js';
import { ContextKeyExpr, ContextKeyExpression, IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { getVirtualWorkspaceLocation } from '../../../../platform/workspace/common/virtualWorkspace.js';
import { Schemas } from '../../../../base/common/network.js';
import { IsWebContext } from '../../../../platform/contextkey/common/contextkeys.js';
import { IExtensionService, isProposedApiEnabled } from '../../../services/extensions/common/extensions.js';
import { EditSessionsLogService } from '../common/editSessionsLogService.js';
import { IViewContainersRegistry, Extensions as ViewExtensions, ViewContainerLocation } from '../../../common/views.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { EditSessionsDataViews } from './editSessionsViews.js';
import { EditSessionsFileSystemProvider } from './editSessionsFileSystemProvider.js';
import { isNative, isWeb } from '../../../../base/common/platform.js';
import { VirtualWorkspaceContext, WorkspaceFolderCountContext } from '../../../common/contextkeys.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { equals } from '../../../../base/common/objects.js';
import { EditSessionIdentityMatch, IEditSessionIdentityService } from '../../../../platform/workspace/common/editSessions.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IOutputService } from '../../../services/output/common/output.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IActivityService, NumberBadge } from '../../../services/activity/common/activity.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ILocalizedString } from '../../../../platform/action/common/action.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { CancellationError } from '../../../../base/common/errors.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';
import { IExtensionsWorkbenchService } from '../../extensions/common/extensions.js';
import { WorkspaceStateSynchroniser } from '../common/workspaceStateSync.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IRequestService } from '../../../../platform/request/common/request.js';
import { EditSessionsStoreClient } from '../common/editSessionsStorageClient.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IWorkspaceIdentityService } from '../../../services/workspaces/common/workspaceIdentityService.js';
import { hashAsync } from '../../../../base/common/hash.js';
import { ResourceSet } from '../../../../base/common/map.js';

registerSingleton(IEditSessionsLogService, EditSessionsLogService, InstantiationType.Delayed);
registerSingleton(IEditSessionsStorageService, EditSessionsWorkbenchService, InstantiationType.Delayed);


const continueWorkingOnCommand: IAction2Options = {
	id: '_workbench.editSessions.actions.continueEditSession',
	title: localize2('continue working on', 'Continue Working On...'),
	precondition: WorkspaceFolderCountContext.notEqualsTo('0'),
	f1: true
};
const openLocalFolderCommand: IAction2Options = {
	id: '_workbench.editSessions.actions.continueEditSession.openLocalFolder',
	title: localize2('continue edit session in local folder', 'Open In Local Folder'),
	category: EDIT_SESSION_SYNC_CATEGORY,
	precondition: ContextKeyExpr.and(IsWebContext.toNegated(), VirtualWorkspaceContext)
};
const showOutputChannelCommand: IAction2Options = {
	id: 'workbench.editSessions.actions.showOutputChannel',
	title: localize2('show log', "Show Log"),
	category: EDIT_SESSION_SYNC_CATEGORY
};
const installAdditionalContinueOnOptionsCommand = {
	id: 'workbench.action.continueOn.extensions',
	title: localize('continueOn.installAdditional', 'Install additional development environment options'),
};
registerAction2(class extends Action2 {
	constructor() {
		super({ ...installAdditionalContinueOnOptionsCommand, f1: false });
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		return accessor.get(IExtensionsWorkbenchService).openSearch('@tag:continueOn');
	}
});

const resumeProgressOptionsTitle = `[${localize('resuming working changes window', 'Resuming working changes...')}](command:${showOutputChannelCommand.id})`;
const resumeProgressOptions = {
	location: ProgressLocation.Window,
	type: 'syncing',
};
const queryParamName = 'editSessionId';

const useEditSessionsWithContinueOn = 'workbench.editSessions.continueOn';
export class EditSessionsContribution extends Disposable implements IWorkbenchContribution {

	private continueEditSessionOptions: ContinueEditSessionItem[] = [];

	private readonly shouldShowViewsContext: IContextKey<boolean>;
	private readonly pendingEditSessionsContext: IContextKey<boolean>;

	private static APPLICATION_LAUNCHED_VIA_CONTINUE_ON_STORAGE_KEY = 'applicationLaunchedViaContinueOn';
	private readonly accountsMenuBadgeDisposable = this._register(new MutableDisposable());

	private registeredCommands = new Set<string>();

	private workspaceStateSynchronizer: WorkspaceStateSynchroniser | undefined;
	private editSessionsStorageClient: EditSessionsStoreClient | undefined;

	constructor(
		@IEditSessionsStorageService private readonly editSessionsStorageService: IEditSessionsStorageService,
		@IFileService private readonly fileService: IFileService,
		@IProgressService private readonly progressService: IProgressService,
		@IOpenerService private readonly openerService: IOpenerService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@ISCMService private readonly scmService: ISCMService,
		@INotificationService private readonly notificationService: INotificationService,
		@IDialogService private readonly dialogService: IDialogService,
		@IEditSessionsLogService private readonly logService: IEditSessionsLogService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IProductService private readonly productService: IProductService,
		@IConfigurationService private configurationService: IConfigurationService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IEditSessionIdentityService private readonly editSessionIdentityService: IEditSessionIdentityService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@ICommandService private commandService: ICommandService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IFileDialogService private readonly fileDialogService: IFileDialogService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@IStorageService private readonly storageService: IStorageService,
		@IActivityService private readonly activityService: IActivityService,
		@IEditorService private readonly editorService: IEditorService,
		@IRemoteAgentService private readonly remoteAgentService: IRemoteAgentService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IRequestService private readonly requestService: IRequestService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IWorkspaceIdentityService private readonly workspaceIdentityService: IWorkspaceIdentityService,
	) {
		super();

		this.shouldShowViewsContext = EDIT_SESSIONS_SHOW_VIEW.bindTo(this.contextKeyService);
		this.pendingEditSessionsContext = EDIT_SESSIONS_PENDING.bindTo(this.contextKeyService);
		this.pendingEditSessionsContext.set(false);

		if (!this.productService['editSessions.store']?.url) {
			return;
		}

		this.editSessionsStorageClient = new EditSessionsStoreClient(URI.parse(this.productService['editSessions.store'].url), this.productService, this.requestService, this.logService, this.environmentService, this.fileService, this.storageService);
		this.editSessionsStorageService.storeClient = this.editSessionsStorageClient;
		this.workspaceStateSynchronizer = new WorkspaceStateSynchroniser(this.userDataProfilesService.defaultProfile, undefined, this.editSessionsStorageClient, this.logService, this.fileService, this.environmentService, this.telemetryService, this.configurationService, this.storageService, this.uriIdentityService, this.workspaceIdentityService, this.editSessionsStorageService);

		this.autoResumeEditSession();

		this.registerActions();
		this.registerViews();
		this.registerContributedEditSessionOptions();

		this._register(this.fileService.registerProvider(EditSessionsFileSystemProvider.SCHEMA, new EditSessionsFileSystemProvider(this.editSessionsStorageService)));
		this.lifecycleService.onWillShutdown((e) => {
			if (e.reason !== ShutdownReason.RELOAD && this.editSessionsStorageService.isSignedIn && this.configurationService.getValue('workbench.experimental.cloudChanges.autoStore') === 'onShutdown' && !isWeb) {
				e.join(this.autoStoreEditSession(), { id: 'autoStoreWorkingChanges', label: localize('autoStoreWorkingChanges', 'Storing current working changes...') });
			}
		});
		this._register(this.editSessionsStorageService.onDidSignIn(() => this.updateAccountsMenuBadge()));
		this._register(this.editSessionsStorageService.onDidSignOut(() => this.updateAccountsMenuBadge()));
	}

	private async autoResumeEditSession() {
		const shouldAutoResumeOnReload = this.configurationService.getValue('workbench.cloudChanges.autoResume') === 'onReload';

		if (this.environmentService.editSessionId !== undefined) {
			this.logService.info(`Resuming cloud changes, reason: found editSessionId ${this.environmentService.editSessionId} in environment service...`);
			await this.progressService.withProgress(resumeProgressOptions, async (progress) => await this.resumeEditSession(this.environmentService.editSessionId, undefined, undefined, undefined, progress).finally(() => this.environmentService.editSessionId = undefined));
		} else if (shouldAutoResumeOnReload && this.editSessionsStorageService.isSignedIn) {
			this.logService.info('Resuming cloud changes, reason: cloud changes enabled...');
			// Attempt to resume edit session based on edit workspace identifier
			// Note: at this point if the user is not signed into edit sessions,
			// we don't want them to be prompted to sign in and should just return early
			await this.progressService.withProgress(resumeProgressOptions, async (progress) => await this.resumeEditSession(undefined, true, undefined, undefined, progress));
		} else if (shouldAutoResumeOnReload) {
			// The application has previously launched via a protocol URL Continue On flow
			const hasApplicationLaunchedFromContinueOnFlow = this.storageService.getBoolean(EditSessionsContribution.APPLICATION_LAUNCHED_VIA_CONTINUE_ON_STORAGE_KEY, StorageScope.APPLICATION, false);
			this.logService.info(`Prompting to enable cloud changes, has application previously launched from Continue On flow: ${hasApplicationLaunchedFromContinueOnFlow}`);

			const handlePendingEditSessions = () => {
				// display a badge in the accounts menu but do not prompt the user to sign in again
				this.logService.info('Showing badge to enable cloud changes in accounts menu...');
				this.updateAccountsMenuBadge();
				this.pendingEditSessionsContext.set(true);
				// attempt a resume if we are in a pending state and the user just signed in
				const disposable = this.editSessionsStorageService.onDidSignIn(async () => {
					disposable.dispose();
					this.logService.info('Showing badge to enable cloud changes in accounts menu succeeded, resuming cloud changes...');
					await this.progressService.withProgress(resumeProgressOptions, async (progress) => await this.resumeEditSession(undefined, true, undefined, undefined, progress));
					this.storageService.remove(EditSessionsContribution.APPLICATION_LAUNCHED_VIA_CONTINUE_ON_STORAGE_KEY, StorageScope.APPLICATION);
					this.environmentService.continueOn = undefined;
				});
			};

			if ((this.environmentService.continueOn !== undefined) &&
				!this.editSessionsStorageService.isSignedIn &&
				// and user has not yet been prompted to sign in on this machine
				hasApplicationLaunchedFromContinueOnFlow === false
			) {
				// store the fact that we prompted the user
				this.storageService.store(EditSessionsContribution.APPLICATION_LAUNCHED_VIA_CONTINUE_ON_STORAGE_KEY, true, StorageScope.APPLICATION, StorageTarget.MACHINE);
				this.logService.info('Prompting to enable cloud changes...');
				await this.editSessionsStorageService.initialize('read');
				if (this.editSessionsStorageService.isSignedIn) {
					this.logService.info('Prompting to enable cloud changes succeeded, resuming cloud changes...');
					await this.progressService.withProgress(resumeProgressOptions, async (progress) => await this.resumeEditSession(undefined, true, undefined, undefined, progress));
				} else {
					handlePendingEditSessions();
				}
			} else if (!this.editSessionsStorageService.isSignedIn &&
				// and user has been prompted to sign in on this machine
				hasApplicationLaunchedFromContinueOnFlow === true
			) {
				handlePendingEditSessions();
			}
		} else {
			this.logService.debug('Auto resuming cloud changes disabled.');
		}
	}

	private updateAccountsMenuBadge() {
		if (this.editSessionsStorageService.isSignedIn) {
			return this.accountsMenuBadgeDisposable.clear();
		}

		const badge = new NumberBadge(1, () => localize('check for pending cloud changes', 'Check for pending cloud changes'));
		this.accountsMenuBadgeDisposable.value = this.activityService.showAccountsActivity({ badge });
	}

	private async autoStoreEditSession() {
		const cancellationTokenSource = new CancellationTokenSource();
		await this.progressService.withProgress({
			location: ProgressLocation.Window,
			type: 'syncing',
			title: localize('store working changes', 'Storing working changes...')
		}, async () => this.storeEditSession(false, cancellationTokenSource.token), () => {
			cancellationTokenSource.cancel();
			cancellationTokenSource.dispose();
		});
	}

	private registerViews() {
		const container = Registry.as<IViewContainersRegistry>(ViewExtensions.ViewContainersRegistry).registerViewContainer(
			{
				id: EDIT_SESSIONS_CONTAINER_ID,
				title: EDIT_SESSIONS_TITLE,
				ctorDescriptor: new SyncDescriptor(
					ViewPaneContainer,
					[EDIT_SESSIONS_CONTAINER_ID, { mergeViewWithContainerWhenSingleView: true }]
				),
				icon: EDIT_SESSIONS_VIEW_ICON,
				hideIfEmpty: true
			}, ViewContainerLocation.Sidebar, { doNotRegisterOpenCommand: true }
		);
		this._register(this.instantiationService.createInstance(EditSessionsDataViews, container));
	}

	private registerActions() {
		this.registerContinueEditSessionAction();

		this.registerResumeLatestEditSessionAction();
		this.registerStoreLatestEditSessionAction();

		this.registerContinueInLocalFolderAction();

		this.registerShowEditSessionViewAction();
		this.registerShowEditSessionOutputChannelAction();
	}

	private registerShowEditSessionOutputChannelAction() {
		this._register(registerAction2(class ShowEditSessionOutput extends Action2 {
			constructor() {
				super(showOutputChannelCommand);
			}

			run(accessor: ServicesAccessor, ...args: unknown[]) {
				const outputChannel = accessor.get(IOutputService);
				void outputChannel.showChannel(editSessionsLogId);
			}
		}));
	}

	private registerShowEditSessionViewAction() {
		const that = this;
		this._register(registerAction2(class ShowEditSessionView extends Action2 {
			constructor() {
				super({
					id: 'workbench.editSessions.actions.showEditSessions',
					title: localize2('show cloud changes', 'Show Cloud Changes'),
					category: EDIT_SESSION_SYNC_CATEGORY,
					f1: true
				});
			}

			async run(accessor: ServicesAccessor) {
				that.shouldShowViewsContext.set(true);
				const viewsService = accessor.get(IViewsService);
				await viewsService.openView(EDIT_SESSIONS_DATA_VIEW_ID);
			}
		}));
	}

	private registerContinueEditSessionAction() {
		const that = this;
		this._register(registerAction2(class ContinueEditSessionAction extends Action2 {
			constructor() {
				super(continueWorkingOnCommand);
			}

			async run(accessor: ServicesAccessor, workspaceUri: URI | undefined, destination: string | undefined): Promise<void> {
				type ContinueOnEventOutcome = { outcome: string; hashedId?: string };
				type ContinueOnClassificationOutcome = {
					owner: 'joyceerhl'; comment: 'Reporting the outcome of invoking the Continue On action.';
					outcome: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The outcome of invoking continue edit session.' };
					hashedId?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The hash of the stored edit session id, for correlating success of stores and resumes.' };
				};

				// First ask the user to pick a destination, if necessary
				let uri: URI | 'noDestinationUri' | undefined = workspaceUri;
				if (!destination && !uri) {
					destination = await that.pickContinueEditSessionDestination();
					if (!destination) {
						that.telemetryService.publicLog2<ContinueOnEventOutcome, ContinueOnClassificationOutcome>('continueOn.editSessions.pick.outcome', { outcome: 'noSelection' });
						return;
					}
				}

				// Determine if we need to store an edit session, asking for edit session auth if necessary
				const shouldStoreEditSession = await that.shouldContinueOnWithEditSession();

				// Run the store action to get back a ref
				let ref: string | undefined;
				if (shouldStoreEditSession) {
					type ContinueWithEditSessionEvent = {};
					type ContinueWithEditSessionClassification = {
						owner: 'joyceerhl'; comment: 'Reporting when storing an edit session as part of the Continue On flow.';
					};
					that.telemetryService.publicLog2<ContinueWithEditSessionEvent, ContinueWithEditSessionClassification>('continueOn.editSessions.store');

					const cancellationTokenSource = new CancellationTokenSource();
					try {
						ref = await that.progressService.withProgress({
							location: ProgressLocation.Notification,
							cancellable: true,
							type: 'syncing',
							title: localize('store your working changes', 'Storing your working changes...')
						}, async () => {
							const ref = await that.storeEditSession(false, cancellationTokenSource.token);
							if (ref !== undefined) {
								that.telemetryService.publicLog2<ContinueOnEventOutcome, ContinueOnClassificationOutcome>('continueOn.editSessions.store.outcome', { outcome: 'storeSucceeded', hashedId: hashedEditSessionId(ref) });
							} else {
								that.telemetryService.publicLog2<ContinueOnEventOutcome, ContinueOnClassificationOutcome>('continueOn.editSessions.store.outcome', { outcome: 'storeSkipped' });
							}
							return ref;
						}, () => {
							cancellationTokenSource.cancel();
							cancellationTokenSource.dispose();
							that.telemetryService.publicLog2<ContinueOnEventOutcome, ContinueOnClassificationOutcome>('continueOn.editSessions.store.outcome', { outcome: 'storeCancelledByUser' });
						});
					} catch (ex) {
						that.telemetryService.publicLog2<ContinueOnEventOutcome, ContinueOnClassificationOutcome>('continueOn.editSessions.store.outcome', { outcome: 'storeFailed' });
						throw ex;
					}
				}

				// Append the ref to the URI
				uri = destination ? await that.resolveDestination(destination) : uri;
				if (uri === undefined) {
					return;
				}

				if (ref !== undefined && uri !== 'noDestinationUri') {
					const encodedRef = encodeURIComponent(ref);
					uri = uri.with({
						query: uri.query.length > 0 ? (uri.query + `&${queryParamName}=${encodedRef}&continueOn=1`) : `${queryParamName}=${encodedRef}&continueOn=1`
					});

					// Open the URI
					that.logService.info(`Opening ${uri.toString()}`);
					await that.openerService.open(uri, { openExternal: true });
				} else if ((!shouldStoreEditSession || ref === undefined) && uri !== 'noDestinationUri') {
					// Open the URI without an edit session ref
					that.logService.info(`Opening ${uri.toString()}`);
					await that.openerService.open(uri, { openExternal: true });
				} else if (ref === undefined && shouldStoreEditSession) {
					that.logService.warn(`Failed to store working changes when invoking ${continueWorkingOnCommand.id}.`);
				}
			}
		}));
	}

	private registerResumeLatestEditSessionAction(): void {
		const that = this;
		this._register(registerAction2(class ResumeLatestEditSessionAction extends Action2 {
			constructor() {
				super({
					id: 'workbench.editSessions.actions.resumeLatest',
					title: localize2('resume latest cloud changes', 'Resume Latest Changes from Cloud'),
					category: EDIT_SESSION_SYNC_CATEGORY,
					f1: true,
				});
			}

			async run(accessor: ServicesAccessor, editSessionId?: string, forceApplyUnrelatedChange?: boolean): Promise<void> {
				await that.progressService.withProgress({ ...resumeProgressOptions, title: resumeProgressOptionsTitle }, async () => await that.resumeEditSession(editSessionId, undefined, forceApplyUnrelatedChange));
			}
		}));
		this._register(registerAction2(class ResumeLatestEditSessionAction extends Action2 {
			constructor() {
				super({
					id: 'workbench.editSessions.actions.resumeFromSerializedPayload',
					title: localize2('resume cloud changes', 'Resume Changes from Serialized Data'),
					category: 'Developer',
					f1: true,
				});
			}

			async run(accessor: ServicesAccessor, editSessionId?: string): Promise<void> {
				const data = await that.quickInputService.input({ prompt: 'Enter serialized data' });
				if (data) {
					that.editSessionsStorageService.lastReadResources.set('editSessions', { content: data, ref: '' });
				}
				await that.progressService.withProgress({ ...resumeProgressOptions, title: resumeProgressOptionsTitle }, async () => await that.resumeEditSession(editSessionId, undefined, undefined, undefined, undefined, data));
			}
		}));
	}

	private registerStoreLatestEditSessionAction(): void {
		const that = this;
		this._register(registerAction2(class StoreLatestEditSessionAction extends Action2 {
			constructor() {
				super({
					id: 'workbench.editSessions.actions.storeCurrent',
					title: localize2('store working changes in cloud', 'Store Working Changes in Cloud'),
					category: EDIT_SESSION_SYNC_CATEGORY,
					f1: true,
				});
			}

			async run(accessor: ServicesAccessor): Promise<void> {
				const cancellationTokenSource = new CancellationTokenSource();
				await that.progressService.withProgress({
					location: ProgressLocation.Notification,
					title: localize('storing working changes', 'Storing working changes...')
				}, async () => {
					type StoreEvent = {};
					type StoreClassification = {
						owner: 'joyceerhl'; comment: 'Reporting when the store edit session action is invoked.';
					};
					that.telemetryService.publicLog2<StoreEvent, StoreClassification>('editSessions.store');

					await that.storeEditSession(true, cancellationTokenSource.token);
				}, () => {
					cancellationTokenSource.cancel();
					cancellationTokenSource.dispose();
				});
			}
		}));
	}

	async resumeEditSession(ref?: string, silent?: boolean, forceApplyUnrelatedChange?: boolean, applyPartialMatch?: boolean, progress?: IProgress<IProgressStep>, serializedData?: string): Promise<void> {
		// Wait for the remote environment to become available, if any
		await this.remoteAgentService.getEnvironment();

		// Edit sessions are not currently supported in empty workspaces
		// https://github.com/microsoft/vscode/issues/159220
		if (this.contextService.getWorkbenchState() === WorkbenchState.EMPTY) {
			return;
		}

		this.logService.info(ref !== undefined ? `Resuming changes from cloud with ref ${ref}...` : 'Checking for pending cloud changes...');

		if (silent && !(await this.editSessionsStorageService.initialize('read', true))) {
			return;
		}

		type ResumeEvent = { outcome: string; hashedId?: string };
		type ResumeClassification = {
			owner: 'joyceerhl'; comment: 'Reporting when an edit session is resumed from an edit session identifier.';
			outcome: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The outcome of resuming the edit session.' };
			hashedId?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The hash of the stored edit session id, for correlating success of stores and resumes.' };
		};
		this.telemetryService.publicLog2<ResumeEvent, ResumeClassification>('editSessions.resume');

		performance.mark('code/willResumeEditSessionFromIdentifier');

		progress?.report({ message: localize('checkingForWorkingChanges', 'Checking for pending cloud changes...') });
		const data = serializedData ? { content: serializedData, ref: '' } : await this.editSessionsStorageService.read('editSessions', ref);
		if (!data) {
			if (ref === undefined && !silent) {
				this.notificationService.info(localize('no cloud changes', 'There are no changes to resume from the cloud.'));
			} else if (ref !== undefined) {
				this.notificationService.warn(localize('no cloud changes for ref', 'Could not resume changes from the cloud for ID {0}.', ref));
			}
			this.logService.info(ref !== undefined ? `Aborting resuming changes from cloud as no edit session content is available to be applied from ref ${ref}.` : `Aborting resuming edit session as no edit session content is available to be applied`);
			return;
		}

		progress?.report({ message: resumeProgressOptionsTitle });
		const editSession = JSON.parse(data.content);
		ref = data.ref;

		if (editSession.version > EditSessionSchemaVersion) {
			this.notificationService.error(localize('client too old', "Please upgrade to a newer version of {0} to resume your working changes from the cloud.", this.productService.nameLong));
			this.telemetryService.publicLog2<ResumeEvent, ResumeClassification>('editSessions.resume.outcome', { hashedId: hashedEditSessionId(ref), outcome: 'clientUpdateNeeded' });
			return;
		}

		try {
			const { changes, conflictingChanges } = await this.generateChanges(editSession, ref, forceApplyUnrelatedChange, applyPartialMatch);
			if (changes.length === 0) {
				return;
			}

			// TODO@joyceerhl Provide the option to diff files which would be overwritten by edit session contents
			if (conflictingChanges.length > 0) {
				// Allow to show edit sessions

				const { confirmed } = await this.dialogService.confirm({
					type: Severity.Warning,
					message: conflictingChanges.length > 1 ?
						localize('resume edit session warning many', 'Resuming your working changes from the cloud will overwrite the following {0} files. Do you want to proceed?', conflictingChanges.length) :
						localize('resume edit session warning 1', 'Resuming your working changes from the cloud will overwrite {0}. Do you want to proceed?', basename(conflictingChanges[0].uri)),
					detail: conflictingChanges.length > 1 ? getFileNamesMessage(conflictingChanges.map((c) => c.uri)) : undefined
				});

				if (!confirmed) {
					return;
				}
			}

			for (const { uri, type, contents } of changes) {
				if (type === ChangeType.Addition) {
					await this.fileService.writeFile(uri, decodeEditSessionFileContent(editSession.version, contents!));
				} else if (type === ChangeType.Deletion && await this.fileService.exists(uri)) {
					await this.fileService.del(uri);
				}
			}

			await this.workspaceStateSynchronizer?.apply();

			this.logService.info(`Deleting edit session with ref ${ref} after successfully applying it to current workspace...`);
			await this.editSessionsStorageService.delete('editSessions', ref);
			this.logService.info(`Deleted edit session with ref ${ref}.`);

			this.telemetryService.publicLog2<ResumeEvent, ResumeClassification>('editSessions.resume.outcome', { hashedId: hashedEditSessionId(ref), outcome: 'resumeSucceeded' });
		} catch (ex) {
			this.logService.error('Failed to resume edit session, reason: ', (ex as Error).toString());
			this.notificationService.error(localize('resume failed', "Failed to resume your working changes from the cloud."));
		}

		performance.mark('code/didResumeEditSessionFromIdentifier');
	}

	private async generateChanges(editSession: EditSession, ref: string, forceApplyUnrelatedChange = false, applyPartialMatch = false) {
		const changes: ({ uri: URI; type: ChangeType; contents: string | undefined })[] = [];
		const conflictingChanges = [];
		const workspaceFolders = this.contextService.getWorkspace().folders;
		const cancellationTokenSource = new CancellationTokenSource();

		for (const folder of editSession.folders) {
			let folderRoot: IWorkspaceFolder | undefined;

			if (folder.canonicalIdentity) {
				// Look for an edit session identifier that we can use
				for (const f of workspaceFolders) {
					const identity = await this.editSessionIdentityService.getEditSessionIdentifier(f, cancellationTokenSource.token);
					this.logService.info(`Matching identity ${identity} against edit session folder identity ${folder.canonicalIdentity}...`);

					if (equals(identity, folder.canonicalIdentity) || forceApplyUnrelatedChange) {
						folderRoot = f;
						break;
					}

					if (identity !== undefined) {
						const match = await this.editSessionIdentityService.provideEditSessionIdentityMatch(f, identity, folder.canonicalIdentity, cancellationTokenSource.token);
						if (match === EditSessionIdentityMatch.Complete) {
							folderRoot = f;
							break;
						} else if (match === EditSessionIdentityMatch.Partial &&
							this.configurationService.getValue('workbench.experimental.cloudChanges.partialMatches.enabled') === true
						) {
							if (!applyPartialMatch) {
								// Surface partially matching edit session
								this.notificationService.prompt(
									Severity.Info,
									localize('editSessionPartialMatch', 'You have pending working changes in the cloud for this workspace. Would you like to resume them?'),
									[{ label: localize('resume', 'Resume'), run: () => this.resumeEditSession(ref, false, undefined, true) }]
								);
							} else {
								folderRoot = f;
								break;
							}
						}
					}
				}
			} else {
				folderRoot = workspaceFolders.find((f) => f.name === folder.name);
			}

			if (!folderRoot) {
				this.logService.info(`Skipping applying ${folder.workingChanges.length} changes from edit session with ref ${ref} as no matching workspace folder was found.`);
				return { changes: [], conflictingChanges: [], contributedStateHandlers: [] };
			}

			const localChanges = new Set<string>();
			for (const repository of this.scmService.repositories) {
				if (repository.provider.rootUri !== undefined &&
					this.contextService.getWorkspaceFolder(repository.provider.rootUri)?.name === folder.name
				) {
					const repositoryChanges = this.getChangedResources(repository);
					repositoryChanges.forEach((change) => localChanges.add(change.toString()));
				}
			}

			for (const change of folder.workingChanges) {
				const uri = joinPath(folderRoot.uri, change.relativeFilePath);

				changes.push({ uri, type: change.type, contents: change.contents });
				if (await this.willChangeLocalContents(localChanges, uri, change)) {
					conflictingChanges.push({ uri, type: change.type, contents: change.contents });
				}
			}
		}

		return { changes, conflictingChanges };
	}

	private async willChangeLocalContents(localChanges: Set<string>, uriWithIncomingChanges: URI, incomingChange: Change) {
		if (!localChanges.has(uriWithIncomingChanges.toString())) {
			return false;
		}

		const { contents, type } = incomingChange;

		switch (type) {
			case (ChangeType.Addition): {
				const [originalContents, incomingContents] = await Promise.all([
					hashAsync(contents),
					hashAsync(encodeBase64((await this.fileService.readFile(uriWithIncomingChanges)).value))
				]);
				return originalContents !== incomingContents;
			}
			case (ChangeType.Deletion): {
				return await this.fileService.exists(uriWithIncomingChanges);
			}
			default:
				throw new Error('Unhandled change type.');
		}
	}

	async storeEditSession(fromStoreCommand: boolean, cancellationToken: CancellationToken): Promise<string | undefined> {
		const folders: Folder[] = [];
		let editSessionSize = 0;
		let hasEdits = false;

		// Save all saveable editors before building edit session contents
		await this.editorService.saveAll();

		// Do a first pass over all repositories to ensure that the edit session identity is created for each.
		// This may change the working changes that need to be stored later
		const createdEditSessionIdentities = new ResourceSet();
		for (const repository of this.scmService.repositories) {
			const changedResources = this.getChangedResources(repository);
			if (!changedResources.size) {
				continue;
			}
			for (const uri of changedResources) {
				const workspaceFolder = this.contextService.getWorkspaceFolder(uri);
				if (!workspaceFolder || createdEditSessionIdentities.has(uri)) {
					continue;
				}
				createdEditSessionIdentities.add(uri);
				await this.editSessionIdentityService.onWillCreateEditSessionIdentity(workspaceFolder, cancellationToken);
			}
		}

		for (const repository of this.scmService.repositories) {
			// Look through all resource groups and compute which files were added/modified/deleted
			const trackedUris = this.getChangedResources(repository); // A URI might appear in more than one resource group

			const workingChanges: Change[] = [];

			const { rootUri } = repository.provider;
			const workspaceFolder = rootUri ? this.contextService.getWorkspaceFolder(rootUri) : undefined;
			let name = workspaceFolder?.name;

			for (const uri of trackedUris) {
				const workspaceFolder = this.contextService.getWorkspaceFolder(uri);
				if (!workspaceFolder) {
					this.logService.info(`Skipping working change ${uri.toString()} as no associated workspace folder was found.`);

					continue;
				}

				name = name ?? workspaceFolder.name;
				const relativeFilePath = relativePath(workspaceFolder.uri, uri) ?? uri.path;

				// Only deal with file contents for now
				try {
					if (!(await this.fileService.stat(uri)).isFile) {
						continue;
					}
				} catch { }

				hasEdits = true;


				if (await this.fileService.exists(uri)) {
					const contents = encodeBase64((await this.fileService.readFile(uri)).value);
					editSessionSize += contents.length;
					if (editSessionSize > this.editSessionsStorageService.SIZE_LIMIT) {
						this.notificationService.error(localize('payload too large', 'Your working changes exceed the size limit and cannot be stored.'));
						return undefined;
					}

					workingChanges.push({ type: ChangeType.Addition, fileType: FileType.File, contents: contents, relativeFilePath: relativeFilePath });
				} else {
					// Assume it's a deletion
					workingChanges.push({ type: ChangeType.Deletion, fileType: FileType.File, contents: undefined, relativeFilePath: relativeFilePath });
				}
			}

			let canonicalIdentity = undefined;
			if (workspaceFolder !== null && workspaceFolder !== undefined) {
				canonicalIdentity = await this.editSessionIdentityService.getEditSessionIdentifier(workspaceFolder, cancellationToken);
			}

			// TODO@joyceerhl debt: don't store working changes as a child of the folder
			folders.push({ workingChanges, name: name ?? '', canonicalIdentity: canonicalIdentity ?? undefined, absoluteUri: workspaceFolder?.uri.toString() });
		}

		// Store contributed workspace state
		await this.workspaceStateSynchronizer?.sync();

		if (!hasEdits) {
			this.logService.info('Skipped storing working changes in the cloud as there are no edits to store.');
			if (fromStoreCommand) {
				this.notificationService.info(localize('no working changes to store', 'Skipped storing working changes in the cloud as there are no edits to store.'));
			}
			return undefined;
		}

		const data: EditSession = { folders, version: 2, workspaceStateId: this.editSessionsStorageService.lastWrittenResources.get('workspaceState')?.ref };

		try {
			this.logService.info(`Storing edit session...`);
			const ref = await this.editSessionsStorageService.write('editSessions', data);
			this.logService.info(`Stored edit session with ref ${ref}.`);
			return ref;
		} catch (ex) {
			this.logService.error(`Failed to store edit session, reason: `, (ex as Error).toString());

			type UploadFailedEvent = { reason: string };
			type UploadFailedClassification = {
				owner: 'joyceerhl'; comment: 'Reporting when Continue On server request fails.';
				reason?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The reason that the server request failed.' };
			};

			if (ex instanceof UserDataSyncStoreError) {
				switch (ex.code) {
					case UserDataSyncErrorCode.TooLarge:
						// Uploading a payload can fail due to server size limits
						this.telemetryService.publicLog2<UploadFailedEvent, UploadFailedClassification>('editSessions.upload.failed', { reason: 'TooLarge' });
						this.notificationService.error(localize('payload too large', 'Your working changes exceed the size limit and cannot be stored.'));
						break;
					default:
						this.telemetryService.publicLog2<UploadFailedEvent, UploadFailedClassification>('editSessions.upload.failed', { reason: 'unknown' });
						this.notificationService.error(localize('payload failed', 'Your working changes cannot be stored.'));
						break;
				}
			}
		}

		return undefined;
	}

	private getChangedResources(repository: ISCMRepository) {
		return repository.provider.groups.reduce((resources, resourceGroups) => {
			resourceGroups.resources.forEach((resource) => resources.add(resource.sourceUri));
			return resources;
		}, new Set<URI>()); // A URI might appear in more than one resource group
	}

	private hasEditSession() {
		for (const repository of this.scmService.repositories) {
			if (this.getChangedResources(repository).size > 0) {
				return true;
			}
		}
		return false;
	}

	private async shouldContinueOnWithEditSession(): Promise<boolean> {
		type EditSessionsAuthCheckEvent = { outcome: string };
		type EditSessionsAuthCheckClassification = {
			owner: 'joyceerhl'; comment: 'Reporting whether we can and should store edit session as part of Continue On.';
			outcome: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The outcome of checking whether we can store an edit session as part of the Continue On flow.' };
		};

		// If the user is already signed in, we should store edit session
		if (this.editSessionsStorageService.isSignedIn) {
			return this.hasEditSession();
		}

		// If the user has been asked before and said no, don't use edit sessions
		if (this.configurationService.getValue(useEditSessionsWithContinueOn) === 'off') {
			this.telemetryService.publicLog2<EditSessionsAuthCheckEvent, EditSessionsAuthCheckClassification>('continueOn.editSessions.canStore.outcome', { outcome: 'disabledEditSessionsViaSetting' });
			return false;
		}

		// Prompt the user to use edit sessions if they currently could benefit from using it
		if (this.hasEditSession()) {
			const disposables = new DisposableStore();
			const quickpick = disposables.add(this.quickInputService.createQuickPick<IQuickPickItem>());
			quickpick.placeholder = localize('continue with cloud changes', "Select whether to bring your working changes with you");
			quickpick.ok = false;
			quickpick.ignoreFocusOut = true;
			const withCloudChanges = { label: localize('with cloud changes', "Yes, continue with my working changes") };
			const withoutCloudChanges = { label: localize('without cloud changes', "No, continue without my working changes") };
			quickpick.items = [withCloudChanges, withoutCloudChanges];

			const continueWithCloudChanges = await new Promise<boolean>((resolve, reject) => {
				disposables.add(quickpick.onDidAccept(() => {
					resolve(quickpick.selectedItems[0] === withCloudChanges);
					disposables.dispose();
				}));
				disposables.add(quickpick.onDidHide(() => {
					reject(new CancellationError());
					disposables.dispose();
				}));
				quickpick.show();
			});

			if (!continueWithCloudChanges) {
				this.telemetryService.publicLog2<EditSessionsAuthCheckEvent, EditSessionsAuthCheckClassification>('continueOn.editSessions.canStore.outcome', { outcome: 'didNotEnableEditSessionsWhenPrompted' });
				return continueWithCloudChanges;
			}

			const initialized = await this.editSessionsStorageService.initialize('write');
			if (!initialized) {
				this.telemetryService.publicLog2<EditSessionsAuthCheckEvent, EditSessionsAuthCheckClassification>('continueOn.editSessions.canStore.outcome', { outcome: 'didNotEnableEditSessionsWhenPrompted' });
			}
			return initialized;
		}

		return false;
	}

	//#region Continue Edit Session extension contribution point

	private registerContributedEditSessionOptions() {
		continueEditSessionExtPoint.setHandler(extensions => {
			const continueEditSessionOptions: ContinueEditSessionItem[] = [];
			for (const extension of extensions) {
				if (!isProposedApiEnabled(extension.description, 'contribEditSessions')) {
					continue;
				}
				if (!Array.isArray(extension.value)) {
					continue;
				}
				for (const contribution of extension.value) {
					const command = MenuRegistry.getCommand(contribution.command);
					if (!command) {
						return;
					}

					const icon = command.icon;
					const title = typeof command.title === 'string' ? command.title : command.title.value;
					const when = ContextKeyExpr.deserialize(contribution.when);

					continueEditSessionOptions.push(new ContinueEditSessionItem(
						ThemeIcon.isThemeIcon(icon) ? `$(${icon.id}) ${title}` : title,
						command.id,
						command.source?.title,
						when,
						contribution.documentation
					));

					if (contribution.qualifiedName) {
						this.generateStandaloneOptionCommand(command.id, contribution.qualifiedName, contribution.category ?? command.category, when, contribution.remoteGroup);
					}
				}
			}
			this.continueEditSessionOptions = continueEditSessionOptions;
		});
	}

	private generateStandaloneOptionCommand(commandId: string, qualifiedName: string, category: string | ILocalizedString | undefined, when: ContextKeyExpression | undefined, remoteGroup: string | undefined) {
		const command: IAction2Options = {
			id: `${continueWorkingOnCommand.id}.${commandId}`,
			title: { original: qualifiedName, value: qualifiedName },
			category: typeof category === 'string' ? { original: category, value: category } : category,
			precondition: when,
			f1: true
		};

		if (!this.registeredCommands.has(command.id)) {
			this.registeredCommands.add(command.id);

			this._register(registerAction2(class StandaloneContinueOnOption extends Action2 {
				constructor() {
					super(command);
				}

				async run(accessor: ServicesAccessor): Promise<void> {
					return accessor.get(ICommandService).executeCommand(continueWorkingOnCommand.id, undefined, commandId);
				}
			}));

			if (remoteGroup !== undefined) {
				MenuRegistry.appendMenuItem(MenuId.StatusBarRemoteIndicatorMenu, {
					group: remoteGroup,
					command: command,
					when: command.precondition
				});
			}
		}
	}

	private registerContinueInLocalFolderAction(): void {
		const that = this;
		this._register(registerAction2(class ContinueInLocalFolderAction extends Action2 {
			constructor() {
				super(openLocalFolderCommand);
			}

			async run(accessor: ServicesAccessor): Promise<URI | undefined> {
				const selection = await that.fileDialogService.showOpenDialog({
					title: localize('continueEditSession.openLocalFolder.title.v2', 'Select a local folder to continue working in'),
					canSelectFolders: true,
					canSelectMany: false,
					canSelectFiles: false,
					availableFileSystems: [Schemas.file]
				});

				return selection?.length !== 1 ? undefined : URI.from({
					scheme: that.productService.urlProtocol,
					authority: Schemas.file,
					path: selection[0].path
				});
			}
		}));

		if (getVirtualWorkspaceLocation(this.contextService.getWorkspace()) !== undefined && isNative) {
			this.generateStandaloneOptionCommand(openLocalFolderCommand.id, localize('continueWorkingOn.existingLocalFolder', 'Continue Working in Existing Local Folder'), undefined, openLocalFolderCommand.precondition, undefined);
		}
	}

	private async pickContinueEditSessionDestination(): Promise<string | undefined> {
		const disposables = new DisposableStore();
		const quickPick = disposables.add(this.quickInputService.createQuickPick<ContinueEditSessionItem>({ useSeparators: true }));

		const workspaceContext = this.contextService.getWorkbenchState() === WorkbenchState.FOLDER
			? this.contextService.getWorkspace().folders[0].name
			: this.contextService.getWorkspace().folders.map((folder) => folder.name).join(', ');
		quickPick.placeholder = localize('continueEditSessionPick.title.v2', "Select a development environment to continue working on {0} in", `'${workspaceContext}'`);
		quickPick.items = this.createPickItems();
		this.extensionService.onDidChangeExtensions(() => {
			quickPick.items = this.createPickItems();
		});

		const command = await new Promise<string | undefined>((resolve, reject) => {
			disposables.add(quickPick.onDidHide(() => {
				disposables.dispose();
				resolve(undefined);
			}));

			disposables.add(quickPick.onDidAccept((e) => {
				const selection = quickPick.activeItems[0].command;

				if (selection === installAdditionalContinueOnOptionsCommand.id) {
					void this.commandService.executeCommand(installAdditionalContinueOnOptionsCommand.id);
				} else {
					resolve(selection);
					quickPick.hide();
				}
			}));

			quickPick.show();

			disposables.add(quickPick.onDidTriggerItemButton(async (e) => {
				if (e.item.documentation !== undefined) {
					const uri = URI.isUri(e.item.documentation) ? URI.parse(e.item.documentation) : await this.commandService.executeCommand<URI>(e.item.documentation);
					if (uri) {
						void this.openerService.open(uri, { openExternal: true });
					}
				}
			}));
		});

		quickPick.dispose();

		return command;
	}

	private async resolveDestination(command: string): Promise<URI | 'noDestinationUri' | undefined> {
		type EvaluateContinueOnDestinationEvent = { outcome: string; selection: string };
		type EvaluateContinueOnDestinationClassification = {
			owner: 'joyceerhl'; comment: 'Reporting the outcome of evaluating a selected Continue On destination option.';
			selection: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The selected Continue On destination option.' };
			outcome: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The outcome of evaluating the selected Continue On destination option.' };
		};

		try {
			const uri = await this.commandService.executeCommand(command);

			// Some continue on commands do not return a URI
			// to support extensions which want to be in control
			// of how the destination is opened
			if (uri === undefined) {
				this.telemetryService.publicLog2<EvaluateContinueOnDestinationEvent, EvaluateContinueOnDestinationClassification>('continueOn.openDestination.outcome', { selection: command, outcome: 'noDestinationUri' });
				return 'noDestinationUri';
			}

			if (URI.isUri(uri)) {
				this.telemetryService.publicLog2<EvaluateContinueOnDestinationEvent, EvaluateContinueOnDestinationClassification>('continueOn.openDestination.outcome', { selection: command, outcome: 'resolvedUri' });
				return uri;
			}

			this.telemetryService.publicLog2<EvaluateContinueOnDestinationEvent, EvaluateContinueOnDestinationClassification>('continueOn.openDestination.outcome', { selection: command, outcome: 'invalidDestination' });
			return undefined;
		} catch (ex) {
			if (ex instanceof CancellationError) {
				this.telemetryService.publicLog2<EvaluateContinueOnDestinationEvent, EvaluateContinueOnDestinationClassification>('continueOn.openDestination.outcome', { selection: command, outcome: 'cancelled' });
			} else {
				this.telemetryService.publicLog2<EvaluateContinueOnDestinationEvent, EvaluateContinueOnDestinationClassification>('continueOn.openDestination.outcome', { selection: command, outcome: 'unknownError' });
			}
			return undefined;
		}
	}

	private createPickItems(): (ContinueEditSessionItem | IQuickPickSeparator)[] {
		const items = [...this.continueEditSessionOptions].filter((option) => option.when === undefined || this.contextKeyService.contextMatchesRules(option.when));

		if (getVirtualWorkspaceLocation(this.contextService.getWorkspace()) !== undefined && isNative) {
			items.push(new ContinueEditSessionItem(
				'$(folder) ' + localize('continueEditSessionItem.openInLocalFolder.v2', 'Open in Local Folder'),
				openLocalFolderCommand.id,
				localize('continueEditSessionItem.builtin', 'Built-in')
			));
		}

		const sortedItems: (ContinueEditSessionItem | IQuickPickSeparator)[] = items.sort((item1, item2) => item1.label.localeCompare(item2.label));
		return sortedItems.concat({ type: 'separator' }, new ContinueEditSessionItem(installAdditionalContinueOnOptionsCommand.title, installAdditionalContinueOnOptionsCommand.id));
	}
}

const infoButtonClass = ThemeIcon.asClassName(Codicon.info);
class ContinueEditSessionItem implements IQuickPickItem {
	public readonly buttons: IQuickInputButton[] | undefined;

	constructor(
		public readonly label: string,
		public readonly command: string,
		public readonly description?: string,
		public readonly when?: ContextKeyExpression,
		public readonly documentation?: string,
	) {
		if (documentation !== undefined) {
			this.buttons = [{
				iconClass: infoButtonClass,
				tooltip: localize('learnMoreTooltip', 'Learn More'),
			}];
		}
	}
}

interface ICommand {
	command: string;
	group: string;
	when: string;
	documentation?: string;
	qualifiedName?: string;
	category?: string;
	remoteGroup?: string;
}

const continueEditSessionExtPoint = ExtensionsRegistry.registerExtensionPoint<ICommand[]>({
	extensionPoint: 'continueEditSession',
	jsonSchema: {
		description: localize('continueEditSessionExtPoint', 'Contributes options for continuing the current edit session in a different environment'),
		type: 'array',
		items: {
			type: 'object',
			properties: {
				command: {
					description: localize('continueEditSessionExtPoint.command', 'Identifier of the command to execute. The command must be declared in the \'commands\'-section and return a URI representing a different environment where the current edit session can be continued.'),
					type: 'string'
				},
				group: {
					description: localize('continueEditSessionExtPoint.group', 'Group into which this item belongs.'),
					type: 'string'
				},
				qualifiedName: {
					description: localize('continueEditSessionExtPoint.qualifiedName', 'A fully qualified name for this item which is used for display in menus.'),
					type: 'string'
				},
				description: {
					description: localize('continueEditSessionExtPoint.description', "The url, or a command that returns the url, to the option's documentation page."),
					type: 'string'
				},
				remoteGroup: {
					description: localize('continueEditSessionExtPoint.remoteGroup', 'Group into which this item belongs in the remote indicator.'),
					type: 'string'
				},
				when: {
					description: localize('continueEditSessionExtPoint.when', 'Condition which must be true to show this item.'),
					type: 'string'
				}
			},
			required: ['command']
		}
	}
});

//#endregion

const workbenchRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);
workbenchRegistry.registerWorkbenchContribution(EditSessionsContribution, LifecyclePhase.Restored);

Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).registerConfiguration({
	...workbenchConfigurationNodeBase,
	'properties': {
		'workbench.experimental.cloudChanges.autoStore': {
			enum: ['onShutdown', 'off'],
			enumDescriptions: [
				localize('autoStoreWorkingChanges.onShutdown', "Automatically store current working changes in the cloud on window close."),
				localize('autoStoreWorkingChanges.off', "Never attempt to automatically store working changes in the cloud.")
			],
			'type': 'string',
			'tags': ['experimental', 'usesOnlineServices'],
			'default': 'off',
			'markdownDescription': localize('autoStoreWorkingChangesDescription', "Controls whether to automatically store available working changes in the cloud for the current workspace. This setting has no effect in the web."),
		},
		'workbench.cloudChanges.autoResume': {
			enum: ['onReload', 'off'],
			enumDescriptions: [
				localize('autoResumeWorkingChanges.onReload', "Automatically resume available working changes from the cloud on window reload."),
				localize('autoResumeWorkingChanges.off', "Never attempt to resume working changes from the cloud.")
			],
			'type': 'string',
			'tags': ['usesOnlineServices'],
			'default': 'onReload',
			'markdownDescription': localize('autoResumeWorkingChanges', "Controls whether to automatically resume available working changes stored in the cloud for the current workspace."),
		},
		'workbench.cloudChanges.continueOn': {
			enum: ['prompt', 'off'],
			enumDescriptions: [
				localize('continueOnCloudChanges.promptForAuth', 'Prompt the user to sign in to store working changes in the cloud with Continue Working On.'),
				localize('continueOnCloudChanges.off', 'Do not store working changes in the cloud with Continue Working On unless the user has already turned on Cloud Changes.')
			],
			type: 'string',
			tags: ['usesOnlineServices'],
			default: 'prompt',
			markdownDescription: localize('continueOnCloudChanges', 'Controls whether to prompt the user to store working changes in the cloud when using Continue Working On.')
		},
		'workbench.experimental.cloudChanges.partialMatches.enabled': {
			'type': 'boolean',
			'tags': ['experimental', 'usesOnlineServices'],
			'default': false,
			'markdownDescription': localize('cloudChangesPartialMatchesEnabled', "Controls whether to surface cloud changes which partially match the current session.")
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editSessions/browser/editSessionsFileSystemProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/editSessions/browser/editSessionsFileSystemProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { Event } from '../../../../base/common/event.js';
import { URI } from '../../../../base/common/uri.js';
import { FilePermission, FileSystemProviderCapabilities, FileSystemProviderErrorCode, FileType, IFileDeleteOptions, IFileOverwriteOptions, IFileSystemProviderWithFileReadWriteCapability, IStat, IWatchOptions } from '../../../../platform/files/common/files.js';
import { ChangeType, decodeEditSessionFileContent, EDIT_SESSIONS_SCHEME, EditSession, IEditSessionsStorageService } from '../common/editSessions.js';
import { NotSupportedError } from '../../../../base/common/errors.js';

export class EditSessionsFileSystemProvider implements IFileSystemProviderWithFileReadWriteCapability {

	static readonly SCHEMA = EDIT_SESSIONS_SCHEME;

	constructor(
		@IEditSessionsStorageService private editSessionsStorageService: IEditSessionsStorageService,
	) { }

	readonly capabilities: FileSystemProviderCapabilities = FileSystemProviderCapabilities.Readonly + FileSystemProviderCapabilities.FileReadWrite;

	async readFile(resource: URI): Promise<Uint8Array> {
		const match = /(?<ref>[^/]+)\/(?<folderName>[^/]+)\/(?<filePath>.*)/.exec(resource.path.substring(1));
		if (!match?.groups) {
			throw FileSystemProviderErrorCode.FileNotFound;
		}
		const { ref, folderName, filePath } = match.groups;
		const data = await this.editSessionsStorageService.read('editSessions', ref);
		if (!data) {
			throw FileSystemProviderErrorCode.FileNotFound;
		}
		const content: EditSession = JSON.parse(data.content);
		const change = content.folders.find((f) => f.name === folderName)?.workingChanges.find((change) => change.relativeFilePath === filePath);
		if (!change || change.type === ChangeType.Deletion) {
			throw FileSystemProviderErrorCode.FileNotFound;
		}
		return decodeEditSessionFileContent(content.version, change.contents).buffer;
	}

	async stat(resource: URI): Promise<IStat> {
		const content = await this.readFile(resource);
		const currentTime = Date.now();
		return {
			type: FileType.File,
			permissions: FilePermission.Readonly,
			mtime: currentTime,
			ctime: currentTime,
			size: content.byteLength
		};
	}

	//#region Unsupported file operations
	readonly onDidChangeCapabilities = Event.None;
	readonly onDidChangeFile = Event.None;

	watch(resource: URI, opts: IWatchOptions): IDisposable { return Disposable.None; }

	async mkdir(resource: URI): Promise<void> { }
	async readdir(resource: URI): Promise<[string, FileType][]> { return []; }

	async rename(from: URI, to: URI, opts: IFileOverwriteOptions): Promise<void> { }
	async delete(resource: URI, opts: IFileDeleteOptions): Promise<void> { }

	async writeFile() {
		throw new NotSupportedError();
	}
	//#endregion
}
```

--------------------------------------------------------------------------------

````

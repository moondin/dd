---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 237
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 237 of 552)

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

---[FILE: src/vs/editor/contrib/snippet/test/browser/snippetController2.test.ts]---
Location: vscode-main/src/vs/editor/contrib/snippet/test/browser/snippetController2.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { mock } from '../../../../../base/test/common/mock.js';
import { CoreEditingCommands } from '../../../../browser/coreCommands.js';
import { ICodeEditor } from '../../../../browser/editorBrowser.js';
import { Selection } from '../../../../common/core/selection.js';
import { Range } from '../../../../common/core/range.js';
import { Handler } from '../../../../common/editorCommon.js';
import { TextModel } from '../../../../common/model/textModel.js';
import { SnippetController2 } from '../../browser/snippetController2.js';
import { createTestCodeEditor, ITestCodeEditor } from '../../../../test/browser/testCodeEditor.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { InstantiationService } from '../../../../../platform/instantiation/common/instantiationService.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { ILogService, NullLogService } from '../../../../../platform/log/common/log.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { EndOfLineSequence } from '../../../../common/model.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('SnippetController2', function () {

	/** @deprecated */
	function assertSelections(editor: ICodeEditor, ...s: Selection[]) {
		for (const selection of editor.getSelections()!) {
			const actual = s.shift()!;
			assert.ok(selection.equalsSelection(actual), `actual=${selection.toString()} <> expected=${actual.toString()}`);
		}
		assert.strictEqual(s.length, 0);
	}

	function assertContextKeys(service: MockContextKeyService, inSnippet: boolean, hasPrev: boolean, hasNext: boolean): void {
		const state = getContextState(service);
		assert.strictEqual(state.inSnippet, inSnippet, `inSnippetMode`);
		assert.strictEqual(state.hasPrev, hasPrev, `HasPrevTabstop`);
		assert.strictEqual(state.hasNext, hasNext, `HasNextTabstop`);
	}

	function getContextState(service: MockContextKeyService = contextKeys) {
		return {
			inSnippet: SnippetController2.InSnippetMode.getValue(service),
			hasPrev: SnippetController2.HasPrevTabstop.getValue(service),
			hasNext: SnippetController2.HasNextTabstop.getValue(service),
		};
	}

	let ctrl: SnippetController2;
	let editor: ITestCodeEditor;
	let model: TextModel;
	let contextKeys: MockContextKeyService;
	let instaService: IInstantiationService;

	setup(function () {
		contextKeys = new MockContextKeyService();
		model = createTextModel('if\n    $state\nfi');
		const serviceCollection = new ServiceCollection(
			[ILabelService, new class extends mock<ILabelService>() { }],
			[IWorkspaceContextService, new class extends mock<IWorkspaceContextService>() {
				override getWorkspace() {
					return { id: 'foo', folders: [] };
				}
			}],
			[ILogService, new NullLogService()],
			[IContextKeyService, contextKeys],
		);
		instaService = new InstantiationService(serviceCollection);
		editor = createTestCodeEditor(model, { serviceCollection });
		editor.setSelections([new Selection(1, 1, 1, 1), new Selection(2, 5, 2, 5)]);
		assert.strictEqual(model.getEOL(), '\n');
	});

	teardown(function () {
		model.dispose();
		ctrl.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('creation', () => {
		ctrl = instaService.createInstance(SnippetController2, editor);
		assertContextKeys(contextKeys, false, false, false);
	});

	test('insert, insert -> abort', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);

		ctrl.insert('foo${1:bar}foo$0');
		assertContextKeys(contextKeys, true, false, true);
		assertSelections(editor, new Selection(1, 4, 1, 7), new Selection(2, 8, 2, 11));

		ctrl.cancel();
		assertContextKeys(contextKeys, false, false, false);
		assertSelections(editor, new Selection(1, 4, 1, 7), new Selection(2, 8, 2, 11));
	});

	test('insert, insert -> tab, tab, done', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);

		ctrl.insert('${1:one}${2:two}$0');
		assertContextKeys(contextKeys, true, false, true);

		ctrl.next();
		assertContextKeys(contextKeys, true, true, true);

		ctrl.next();
		assertContextKeys(contextKeys, false, false, false);

		editor.trigger('test', 'type', { text: '\t' });
		assert.strictEqual(SnippetController2.InSnippetMode.getValue(contextKeys), false);
		assert.strictEqual(SnippetController2.HasNextTabstop.getValue(contextKeys), false);
		assert.strictEqual(SnippetController2.HasPrevTabstop.getValue(contextKeys), false);
	});

	test('insert, insert -> cursor moves out (left/right)', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);

		ctrl.insert('foo${1:bar}foo$0');
		assertContextKeys(contextKeys, true, false, true);
		assertSelections(editor, new Selection(1, 4, 1, 7), new Selection(2, 8, 2, 11));

		// bad selection change
		editor.setSelections([new Selection(1, 12, 1, 12), new Selection(2, 16, 2, 16)]);
		assertContextKeys(contextKeys, false, false, false);
	});

	test('insert, insert -> cursor moves out (up/down)', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);

		ctrl.insert('foo${1:bar}foo$0');
		assertContextKeys(contextKeys, true, false, true);
		assertSelections(editor, new Selection(1, 4, 1, 7), new Selection(2, 8, 2, 11));

		// bad selection change
		editor.setSelections([new Selection(2, 4, 2, 7), new Selection(3, 8, 3, 11)]);
		assertContextKeys(contextKeys, false, false, false);
	});

	test('insert, insert -> cursors collapse', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);

		ctrl.insert('foo${1:bar}foo$0');
		assert.strictEqual(SnippetController2.InSnippetMode.getValue(contextKeys), true);
		assertSelections(editor, new Selection(1, 4, 1, 7), new Selection(2, 8, 2, 11));

		// bad selection change
		editor.setSelections([new Selection(1, 4, 1, 7)]);
		assertContextKeys(contextKeys, false, false, false);
	});

	test('insert, insert plain text -> no snippet mode', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);

		ctrl.insert('foobar');
		assertContextKeys(contextKeys, false, false, false);
		assertSelections(editor, new Selection(1, 7, 1, 7), new Selection(2, 11, 2, 11));
	});

	test('insert, delete snippet text', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);

		ctrl.insert('${1:foobar}$0');
		assertContextKeys(contextKeys, true, false, true);
		assertSelections(editor, new Selection(1, 1, 1, 7), new Selection(2, 5, 2, 11));

		editor.trigger('test', 'cut', {});
		assertContextKeys(contextKeys, true, false, true);
		assertSelections(editor, new Selection(1, 1, 1, 1), new Selection(2, 5, 2, 5));

		editor.trigger('test', 'type', { text: 'abc' });
		assertContextKeys(contextKeys, true, false, true);

		ctrl.next();
		assertContextKeys(contextKeys, false, false, false);

		editor.trigger('test', 'tab', {});
		assertContextKeys(contextKeys, false, false, false);

		// editor.trigger('test', 'type', { text: 'abc' });
		// assertContextKeys(contextKeys, false, false, false);
	});

	test('insert, nested trivial snippet', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);
		ctrl.insert('${1:foo}bar$0');
		assertContextKeys(contextKeys, true, false, true);
		assertSelections(editor, new Selection(1, 1, 1, 4), new Selection(2, 5, 2, 8));

		ctrl.insert('FOO$0');
		assertSelections(editor, new Selection(1, 4, 1, 4), new Selection(2, 8, 2, 8));
		assertContextKeys(contextKeys, true, false, true);

		ctrl.next();
		assertSelections(editor, new Selection(1, 7, 1, 7), new Selection(2, 11, 2, 11));
		assertContextKeys(contextKeys, false, false, false);
	});

	test('insert, nested snippet', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);
		ctrl.insert('${1:foobar}$0');
		assertContextKeys(contextKeys, true, false, true);
		assertSelections(editor, new Selection(1, 1, 1, 7), new Selection(2, 5, 2, 11));

		ctrl.insert('far$1boo$0');
		assertSelections(editor, new Selection(1, 4, 1, 4), new Selection(2, 8, 2, 8));
		assertContextKeys(contextKeys, true, false, true);

		ctrl.next();
		assertSelections(editor, new Selection(1, 7, 1, 7), new Selection(2, 11, 2, 11));
		assertContextKeys(contextKeys, true, true, true);

		ctrl.next();
		assertSelections(editor, new Selection(1, 7, 1, 7), new Selection(2, 11, 2, 11));
		assertContextKeys(contextKeys, false, false, false);
	});

	test('insert, nested plain text', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);
		ctrl.insert('${1:foobar}$0');
		assertContextKeys(contextKeys, true, false, true);
		assertSelections(editor, new Selection(1, 1, 1, 7), new Selection(2, 5, 2, 11));

		ctrl.insert('farboo');
		assertSelections(editor, new Selection(1, 7, 1, 7), new Selection(2, 11, 2, 11));
		assertContextKeys(contextKeys, true, false, true);

		ctrl.next();
		assertSelections(editor, new Selection(1, 7, 1, 7), new Selection(2, 11, 2, 11));
		assertContextKeys(contextKeys, false, false, false);
	});

	test('Nested snippets without final placeholder jumps to next outer placeholder, #27898', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);

		ctrl.insert('for(const ${1:element} of ${2:array}) {$0}');
		assertContextKeys(contextKeys, true, false, true);
		assertSelections(editor, new Selection(1, 11, 1, 18), new Selection(2, 15, 2, 22));

		ctrl.next();
		assertContextKeys(contextKeys, true, true, true);
		assertSelections(editor, new Selection(1, 22, 1, 27), new Selection(2, 26, 2, 31));

		ctrl.insert('document');
		assertContextKeys(contextKeys, true, true, true);
		assertSelections(editor, new Selection(1, 30, 1, 30), new Selection(2, 34, 2, 34));

		ctrl.next();
		assertContextKeys(contextKeys, false, false, false);
	});

	test('Inconsistent tab stop behaviour with recursive snippets and tab / shift tab, #27543', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);
		ctrl.insert('1_calize(${1:nl}, \'${2:value}\')$0');

		assertContextKeys(contextKeys, true, false, true);
		assertSelections(editor, new Selection(1, 10, 1, 12), new Selection(2, 14, 2, 16));

		ctrl.insert('2_calize(${1:nl}, \'${2:value}\')$0');

		assertSelections(editor, new Selection(1, 19, 1, 21), new Selection(2, 23, 2, 25));

		ctrl.next(); // inner `value`
		assertSelections(editor, new Selection(1, 24, 1, 29), new Selection(2, 28, 2, 33));

		ctrl.next(); // inner `$0`
		assertSelections(editor, new Selection(1, 31, 1, 31), new Selection(2, 35, 2, 35));

		ctrl.next(); // outer `value`
		assertSelections(editor, new Selection(1, 34, 1, 39), new Selection(2, 38, 2, 43));

		ctrl.prev(); // inner `$0`
		assertSelections(editor, new Selection(1, 31, 1, 31), new Selection(2, 35, 2, 35));
	});

	test('Snippet tabstop selecting content of previously entered variable only works when separated by space, #23728', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);

		model.setValue('');
		editor.setSelection(new Selection(1, 1, 1, 1));

		ctrl.insert('import ${2:${1:module}} from \'${1:module}\'$0');

		assertContextKeys(contextKeys, true, false, true);
		assertSelections(editor, new Selection(1, 8, 1, 14), new Selection(1, 21, 1, 27));

		ctrl.insert('foo');
		assertSelections(editor, new Selection(1, 11, 1, 11), new Selection(1, 21, 1, 21));

		ctrl.next(); // ${2:...}
		assertSelections(editor, new Selection(1, 8, 1, 11));
	});

	test('HTML Snippets Combine, #32211', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);

		model.setValue('');
		model.updateOptions({ insertSpaces: false, tabSize: 4, trimAutoWhitespace: false });
		editor.setSelection(new Selection(1, 1, 1, 1));

		ctrl.insert(`
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=\${2:device-width}, initial-scale=\${3:1.0}">
				<meta http-equiv="X-UA-Compatible" content="\${5:ie=edge}">
				<title>\${7:Document}</title>
			</head>
			<body>
				\${8}
			</body>
			</html>
		`);
		ctrl.next();
		ctrl.next();
		ctrl.next();
		ctrl.next();
		assertSelections(editor, new Selection(11, 5, 11, 5));

		ctrl.insert('<input type="${2:text}">');
		assertSelections(editor, new Selection(11, 18, 11, 22));
	});

	test('Problems with nested snippet insertion #39594', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);

		model.setValue('');
		editor.setSelection(new Selection(1, 1, 1, 1));

		ctrl.insert('$1 = ConvertTo-Json $1');
		assertSelections(editor, new Selection(1, 1, 1, 1), new Selection(1, 19, 1, 19));

		editor.setSelection(new Selection(1, 19, 1, 19));

		// snippet mode should stop because $1 has two occurrences
		// and we only have one selection left
		assertContextKeys(contextKeys, false, false, false);
	});

	test('Problems with nested snippet insertion #39594 (part2)', function () {
		// ensure selection-change-to-cancel logic isn't too aggressive
		ctrl = instaService.createInstance(SnippetController2, editor);

		model.setValue('a-\naaa-');
		editor.setSelections([new Selection(2, 5, 2, 5), new Selection(1, 3, 1, 3)]);

		ctrl.insert('log($1);$0');
		assertSelections(editor, new Selection(2, 9, 2, 9), new Selection(1, 7, 1, 7));
		assertContextKeys(contextKeys, true, false, true);
	});

	test('“Nested” snippets terminating abruptly in VSCode 1.19.2. #42012', function () {

		ctrl = instaService.createInstance(SnippetController2, editor);
		model.setValue('');
		editor.setSelection(new Selection(1, 1, 1, 1));
		ctrl.insert('var ${2:${1:name}} = ${1:name} + 1;${0}');

		assertSelections(editor, new Selection(1, 5, 1, 9), new Selection(1, 12, 1, 16));
		assertContextKeys(contextKeys, true, false, true);

		ctrl.next();
		assertContextKeys(contextKeys, true, true, true);
	});

	test('Placeholders order #58267', function () {

		ctrl = instaService.createInstance(SnippetController2, editor);
		model.setValue('');
		editor.setSelection(new Selection(1, 1, 1, 1));
		ctrl.insert('\\pth{$1}$0');

		assertSelections(editor, new Selection(1, 6, 1, 6));
		assertContextKeys(contextKeys, true, false, true);

		ctrl.insert('\\itv{${1:left}}{${2:right}}{${3:left_value}}{${4:right_value}}$0');
		assertSelections(editor, new Selection(1, 11, 1, 15));

		ctrl.next();
		assertSelections(editor, new Selection(1, 17, 1, 22));

		ctrl.next();
		assertSelections(editor, new Selection(1, 24, 1, 34));

		ctrl.next();
		assertSelections(editor, new Selection(1, 36, 1, 47));

		ctrl.next();
		assertSelections(editor, new Selection(1, 48, 1, 48));

		ctrl.next();
		assertSelections(editor, new Selection(1, 49, 1, 49));
		assertContextKeys(contextKeys, false, false, false);
	});

	test('Must tab through deleted tab stops in snippets #31619', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);
		model.setValue('');
		editor.setSelection(new Selection(1, 1, 1, 1));
		ctrl.insert('foo${1:a${2:bar}baz}end$0');
		assertSelections(editor, new Selection(1, 4, 1, 11));

		editor.trigger('test', Handler.Cut, null);
		assertSelections(editor, new Selection(1, 4, 1, 4));

		ctrl.next();
		assertSelections(editor, new Selection(1, 7, 1, 7));
		assertContextKeys(contextKeys, false, false, false);
	});

	test('Cancelling snippet mode should discard added cursors #68512 (soft cancel)', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);
		model.setValue('');
		editor.setSelection(new Selection(1, 1, 1, 1));

		ctrl.insert('.REGION ${2:FUNCTION_NAME}\nCREATE.FUNCTION ${1:VOID} ${2:FUNCTION_NAME}(${3:})\n\t${4:}\nEND\n.ENDREGION$0');
		assertSelections(editor, new Selection(2, 17, 2, 21));

		ctrl.next();
		assertSelections(editor, new Selection(1, 9, 1, 22), new Selection(2, 22, 2, 35));
		assertContextKeys(contextKeys, true, true, true);

		editor.setSelections([new Selection(1, 22, 1, 22), new Selection(2, 35, 2, 35)]);
		assertContextKeys(contextKeys, true, true, true);

		editor.setSelections([new Selection(2, 1, 2, 1), new Selection(2, 36, 2, 36)]);
		assertContextKeys(contextKeys, false, false, false);
		assertSelections(editor, new Selection(2, 1, 2, 1), new Selection(2, 36, 2, 36));
	});

	test('Cancelling snippet mode should discard added cursors #68512 (hard cancel)', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);
		model.setValue('');
		editor.setSelection(new Selection(1, 1, 1, 1));

		ctrl.insert('.REGION ${2:FUNCTION_NAME}\nCREATE.FUNCTION ${1:VOID} ${2:FUNCTION_NAME}(${3:})\n\t${4:}\nEND\n.ENDREGION$0');
		assertSelections(editor, new Selection(2, 17, 2, 21));

		ctrl.next();
		assertSelections(editor, new Selection(1, 9, 1, 22), new Selection(2, 22, 2, 35));
		assertContextKeys(contextKeys, true, true, true);

		editor.setSelections([new Selection(1, 22, 1, 22), new Selection(2, 35, 2, 35)]);
		assertContextKeys(contextKeys, true, true, true);

		ctrl.cancel(true);
		assertContextKeys(contextKeys, false, false, false);
		assertSelections(editor, new Selection(1, 22, 1, 22));
	});

	test('User defined snippet tab stops ignored #72862', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);
		model.setValue('');
		editor.setSelection(new Selection(1, 1, 1, 1));

		ctrl.insert('export default $1');
		assertContextKeys(contextKeys, true, false, true);
	});

	test('Optional tabstop in snippets #72358', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);
		model.setValue('');
		editor.setSelection(new Selection(1, 1, 1, 1));

		ctrl.insert('${1:prop: {$2\\},}\nmore$0');
		assertContextKeys(contextKeys, true, false, true);

		assertSelections(editor, new Selection(1, 1, 1, 10));
		editor.trigger('test', Handler.Cut, {});

		assertSelections(editor, new Selection(1, 1, 1, 1));

		ctrl.next();
		assertSelections(editor, new Selection(2, 5, 2, 5));
		assertContextKeys(contextKeys, false, false, false);
	});

	test('issue #90135: confusing trim whitespace edits', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);
		model.setValue('');
		editor.runCommand(CoreEditingCommands.Tab, null);

		ctrl.insert('\nfoo');
		assertSelections(editor, new Selection(2, 8, 2, 8));
	});

	test('issue #145727: insertSnippet can put snippet selections in wrong positions (1 of 2)', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);
		model.setValue('');
		editor.runCommand(CoreEditingCommands.Tab, null);

		ctrl.insert('\naProperty: aClass<${2:boolean}> = new aClass<${2:boolean}>();\n', { adjustWhitespace: false });
		assertSelections(editor, new Selection(2, 19, 2, 26), new Selection(2, 41, 2, 48));
	});

	test('issue #145727: insertSnippet can put snippet selections in wrong positions (2 of 2)', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);
		model.setValue('');
		editor.runCommand(CoreEditingCommands.Tab, null);

		ctrl.insert('\naProperty: aClass<${2:boolean}> = new aClass<${2:boolean}>();\n');
		// This will insert \n    aProperty....
		assertSelections(editor, new Selection(2, 23, 2, 30), new Selection(2, 45, 2, 52));
	});

	test('leading TAB by snippets won\'t replace by spaces #101870', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);
		model.setValue('');
		model.updateOptions({ insertSpaces: true, tabSize: 4 });
		ctrl.insert('\tHello World\n\tNew Line');
		assert.strictEqual(model.getValue(), '    Hello World\n    New Line');
	});

	test('leading TAB by snippets won\'t replace by spaces #101870 (part 2)', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);
		model.setValue('');
		model.updateOptions({ insertSpaces: true, tabSize: 4 });
		ctrl.insert('\tHello World\n\tNew Line\n${1:\tmore}');
		assert.strictEqual(model.getValue(), '    Hello World\n    New Line\n    more');
	});

	test.skip('Snippet transformation does not work after inserting variable using intellisense, #112362', function () {

		{
			// HAPPY - no nested snippet
			ctrl = instaService.createInstance(SnippetController2, editor);
			model.setValue('');
			model.updateOptions({ insertSpaces: true, tabSize: 4 });
			ctrl.insert('$1\n\n${1/([A-Za-z0-9]+): ([A-Za-z]+).*/$1: \'$2\',/gm}');

			assertSelections(editor, new Selection(1, 1, 1, 1), new Selection(3, 1, 3, 1));
			editor.trigger('test', 'type', { text: 'foo: number;' });
			ctrl.next();
			assert.strictEqual(model.getValue(), `foo: number;\n\nfoo: 'number',`);
		}

		ctrl = instaService.createInstance(SnippetController2, editor);
		model.setValue('');
		model.updateOptions({ insertSpaces: true, tabSize: 4 });
		ctrl.insert('$1\n\n${1/([A-Za-z0-9]+): ([A-Za-z]+).*/$1: \'$2\',/gm}');

		assertSelections(editor, new Selection(1, 1, 1, 1), new Selection(3, 1, 3, 1));
		editor.trigger('test', 'type', { text: 'foo: ' });
		ctrl.insert('number;');
		ctrl.next();
		assert.strictEqual(model.getValue(), `foo: number;\n\nfoo: 'number',`);
		// editor.trigger('test', 'type', { text: ';' });
	});

	suite('createEditsAndSnippetsFromEdits', function () {

		test('apply, tab, done', function () {

			ctrl = instaService.createInstance(SnippetController2, editor);

			model.setValue('foo("bar")');

			ctrl.apply([
				{ range: new Range(1, 5, 1, 10), template: '$1' },
				{ range: new Range(1, 1, 1, 1), template: 'const ${1:new_const} = "bar";\n' }
			]);

			assert.strictEqual(model.getValue(), 'const new_const = "bar";\nfoo(new_const)');
			assertContextKeys(contextKeys, true, false, true);
			assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 7, 1, 16), new Selection(2, 5, 2, 14)]);

			ctrl.next();
			assertContextKeys(contextKeys, false, false, false);
			assert.deepStrictEqual(editor.getSelections(), [new Selection(2, 14, 2, 14)]);
		});

		test('apply, tab, done with special final tabstop', function () {

			model.setValue('foo("bar")');

			ctrl = instaService.createInstance(SnippetController2, editor);
			ctrl.apply([
				{ range: new Range(1, 5, 1, 10), template: '$1' },
				{ range: new Range(1, 1, 1, 1), template: 'const ${1:new_const}$0 = "bar";\n' }
			]);

			assert.strictEqual(model.getValue(), 'const new_const = "bar";\nfoo(new_const)');
			assertContextKeys(contextKeys, true, false, true);
			assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 7, 1, 16), new Selection(2, 5, 2, 14)]);

			ctrl.next();
			assertContextKeys(contextKeys, false, false, false);
			assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 16, 1, 16)]);
		});

		test('apply, tab, tab, done', function () {

			model.setValue('foo\nbar');

			ctrl = instaService.createInstance(SnippetController2, editor);
			ctrl.apply([
				{ range: new Range(1, 4, 1, 4), template: '${3}' },
				{ range: new Range(2, 4, 2, 4), template: '$3' },
				{ range: new Range(1, 1, 1, 1), template: '### ${2:Header}\n' }
			]);

			assert.strictEqual(model.getValue(), '### Header\nfoo\nbar');
			assert.deepStrictEqual(getContextState(), { inSnippet: true, hasPrev: false, hasNext: true });
			assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 5, 1, 11)]);

			ctrl.next();
			assert.deepStrictEqual(getContextState(), { inSnippet: true, hasPrev: true, hasNext: true });
			assert.deepStrictEqual(editor.getSelections(), [new Selection(2, 4, 2, 4), new Selection(3, 4, 3, 4)]);

			ctrl.next();
			assert.deepStrictEqual(getContextState(), { inSnippet: false, hasPrev: false, hasNext: false });
			assert.deepStrictEqual(editor.getSelections(), [new Selection(3, 4, 3, 4)]);
		});

		test('nested into apply works', function () {

			ctrl = instaService.createInstance(SnippetController2, editor);
			model.setValue('onetwo');

			editor.setSelections([new Selection(1, 1, 1, 1), new Selection(2, 1, 2, 1)]);

			ctrl.apply([{
				range: new Range(1, 7, 1, 7),
				template: '$0${1:three}'
			}]);

			assert.strictEqual(model.getValue(), 'onetwothree');
			assert.deepStrictEqual(getContextState(), { inSnippet: true, hasPrev: false, hasNext: true });
			assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 7, 1, 12)]);

			ctrl.insert('foo$1bar$1');
			assert.strictEqual(model.getValue(), 'onetwofoobar');
			assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 10, 1, 10), new Selection(1, 13, 1, 13)]);
			assert.deepStrictEqual(getContextState(), ({ inSnippet: true, hasPrev: false, hasNext: true }));

			ctrl.next();
			assert.deepStrictEqual(getContextState(), ({ inSnippet: true, hasPrev: true, hasNext: true }));
			assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 13, 1, 13)]);

			ctrl.next();
			assert.deepStrictEqual(getContextState(), { inSnippet: false, hasPrev: false, hasNext: false });
			assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 7, 1, 7)]);

		});

		test('nested into insert abort "outer" snippet', function () {

			ctrl = instaService.createInstance(SnippetController2, editor);
			model.setValue('one\ntwo');

			editor.setSelections([new Selection(1, 1, 1, 1), new Selection(2, 1, 2, 1)]);

			ctrl.insert('foo${1:bar}bazz${1:bang}');
			assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 4, 1, 7), new Selection(1, 11, 1, 14), new Selection(2, 4, 2, 7), new Selection(2, 11, 2, 14)]);
			assert.deepStrictEqual(getContextState(), { inSnippet: true, hasPrev: false, hasNext: true });

			ctrl.apply([{
				range: new Range(1, 4, 1, 7),
				template: '$0A'
			}]);

			assert.strictEqual(model.getValue(), 'fooAbazzbarone\nfoobarbazzbartwo');
			assert.deepStrictEqual(getContextState(), { inSnippet: false, hasPrev: false, hasNext: false });
			assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 4, 1, 4)]);
		});

		test('nested into "insert" abort "outer" snippet (2)', function () {

			ctrl = instaService.createInstance(SnippetController2, editor);
			model.setValue('one\ntwo');

			editor.setSelections([new Selection(1, 1, 1, 1), new Selection(2, 1, 2, 1)]);

			ctrl.insert('foo${1:bar}bazz${1:bang}');
			assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 4, 1, 7), new Selection(1, 11, 1, 14), new Selection(2, 4, 2, 7), new Selection(2, 11, 2, 14)]);
			assert.deepStrictEqual(getContextState(), { inSnippet: true, hasPrev: false, hasNext: true });

			const edits = [{
				range: new Range(1, 4, 1, 7),
				template: 'A'
			}, {
				range: new Range(1, 11, 1, 14),
				template: 'B'
			}, {
				range: new Range(2, 4, 2, 7),
				template: 'C'
			}, {
				range: new Range(2, 11, 2, 14),
				template: 'D'
			}];
			ctrl.apply(edits);

			assert.strictEqual(model.getValue(), 'fooAbazzBone\nfooCbazzDtwo');
			assert.deepStrictEqual(getContextState(), { inSnippet: false, hasPrev: false, hasNext: false });
			assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 5, 1, 5), new Selection(1, 10, 1, 10), new Selection(2, 5, 2, 5), new Selection(2, 10, 2, 10)]);
		});
	});

	test('Bug: cursor position $0 with user snippets #163808', function () {

		ctrl = instaService.createInstance(SnippetController2, editor);
		model.setValue('');

		ctrl.insert('<Element1 Attr1="foo" $1>\n  <Element2 Attr1="$2"/>\n$0"\n</Element1>');
		assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 23, 1, 23)]);

		ctrl.insert('Qualifier="$0"');
		assert.strictEqual(model.getValue(), '<Element1 Attr1="foo" Qualifier="">\n  <Element2 Attr1=""/>\n"\n</Element1>');
		assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 34, 1, 34)]);

	});

	test('EOL-Sequence (CRLF) shifts tab stop in isFileTemplate snippets #167386', function () {
		ctrl = instaService.createInstance(SnippetController2, editor);
		model.setValue('');
		model.setEOL(EndOfLineSequence.CRLF);

		ctrl.apply([{
			range: model.getFullModelRange(),
			template: 'line 54321${1:FOO}\nline 54321${1:FOO}\n(no tab stop)\nline 54321${1:FOO}\nline 54321'
		}]);

		assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 11, 1, 14), new Selection(2, 11, 2, 14), new Selection(4, 11, 4, 14)]);

	});

	test('"Surround With" code action snippets use incorrect indentation levels and styles #169319', function () {
		model.setValue('function foo(f, x, condition) {\n    f();\n    return x;\n}');
		const sel = new Range(2, 5, 3, 14);
		editor.setSelection(sel);
		ctrl = instaService.createInstance(SnippetController2, editor);
		ctrl.apply([{
			range: sel,
			template: 'if (${1:condition}) {\n\t$TM_SELECTED_TEXT$0\n}'
		}]);

		assert.strictEqual(model.getValue(), `function foo(f, x, condition) {\n    if (condition) {\n        f();\n        return x;\n    }\n}`);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/snippet/test/browser/snippetParser.test.ts]---
Location: vscode-main/src/vs/editor/contrib/snippet/test/browser/snippetParser.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Choice, FormatString, Marker, Placeholder, Scanner, SnippetParser, Text, TextmateSnippet, TokenType, Transform, Variable } from '../../browser/snippetParser.js';

suite('SnippetParser', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('Scanner', () => {

		const scanner = new Scanner();
		assert.strictEqual(scanner.next().type, TokenType.EOF);

		scanner.text('abc');
		assert.strictEqual(scanner.next().type, TokenType.VariableName);
		assert.strictEqual(scanner.next().type, TokenType.EOF);

		scanner.text('{{abc}}');
		assert.strictEqual(scanner.next().type, TokenType.CurlyOpen);
		assert.strictEqual(scanner.next().type, TokenType.CurlyOpen);
		assert.strictEqual(scanner.next().type, TokenType.VariableName);
		assert.strictEqual(scanner.next().type, TokenType.CurlyClose);
		assert.strictEqual(scanner.next().type, TokenType.CurlyClose);
		assert.strictEqual(scanner.next().type, TokenType.EOF);

		scanner.text('abc() ');
		assert.strictEqual(scanner.next().type, TokenType.VariableName);
		assert.strictEqual(scanner.next().type, TokenType.Format);
		assert.strictEqual(scanner.next().type, TokenType.EOF);

		scanner.text('abc 123');
		assert.strictEqual(scanner.next().type, TokenType.VariableName);
		assert.strictEqual(scanner.next().type, TokenType.Format);
		assert.strictEqual(scanner.next().type, TokenType.Int);
		assert.strictEqual(scanner.next().type, TokenType.EOF);

		scanner.text('$foo');
		assert.strictEqual(scanner.next().type, TokenType.Dollar);
		assert.strictEqual(scanner.next().type, TokenType.VariableName);
		assert.strictEqual(scanner.next().type, TokenType.EOF);

		scanner.text('$foo_bar');
		assert.strictEqual(scanner.next().type, TokenType.Dollar);
		assert.strictEqual(scanner.next().type, TokenType.VariableName);
		assert.strictEqual(scanner.next().type, TokenType.EOF);

		scanner.text('$foo-bar');
		assert.strictEqual(scanner.next().type, TokenType.Dollar);
		assert.strictEqual(scanner.next().type, TokenType.VariableName);
		assert.strictEqual(scanner.next().type, TokenType.Dash);
		assert.strictEqual(scanner.next().type, TokenType.VariableName);
		assert.strictEqual(scanner.next().type, TokenType.EOF);

		scanner.text('${foo}');
		assert.strictEqual(scanner.next().type, TokenType.Dollar);
		assert.strictEqual(scanner.next().type, TokenType.CurlyOpen);
		assert.strictEqual(scanner.next().type, TokenType.VariableName);
		assert.strictEqual(scanner.next().type, TokenType.CurlyClose);
		assert.strictEqual(scanner.next().type, TokenType.EOF);

		scanner.text('${1223:foo}');
		assert.strictEqual(scanner.next().type, TokenType.Dollar);
		assert.strictEqual(scanner.next().type, TokenType.CurlyOpen);
		assert.strictEqual(scanner.next().type, TokenType.Int);
		assert.strictEqual(scanner.next().type, TokenType.Colon);
		assert.strictEqual(scanner.next().type, TokenType.VariableName);
		assert.strictEqual(scanner.next().type, TokenType.CurlyClose);
		assert.strictEqual(scanner.next().type, TokenType.EOF);

		scanner.text('\\${}');
		assert.strictEqual(scanner.next().type, TokenType.Backslash);
		assert.strictEqual(scanner.next().type, TokenType.Dollar);
		assert.strictEqual(scanner.next().type, TokenType.CurlyOpen);
		assert.strictEqual(scanner.next().type, TokenType.CurlyClose);

		scanner.text('${foo/regex/format/option}');
		assert.strictEqual(scanner.next().type, TokenType.Dollar);
		assert.strictEqual(scanner.next().type, TokenType.CurlyOpen);
		assert.strictEqual(scanner.next().type, TokenType.VariableName);
		assert.strictEqual(scanner.next().type, TokenType.Forwardslash);
		assert.strictEqual(scanner.next().type, TokenType.VariableName);
		assert.strictEqual(scanner.next().type, TokenType.Forwardslash);
		assert.strictEqual(scanner.next().type, TokenType.VariableName);
		assert.strictEqual(scanner.next().type, TokenType.Forwardslash);
		assert.strictEqual(scanner.next().type, TokenType.VariableName);
		assert.strictEqual(scanner.next().type, TokenType.CurlyClose);
		assert.strictEqual(scanner.next().type, TokenType.EOF);
	});

	function assertText(value: string, expected: string) {
		const actual = SnippetParser.asInsertText(value);
		assert.strictEqual(actual, expected);
	}

	function assertMarker(input: TextmateSnippet | Marker[] | string, ...ctors: Function[]) {
		let marker: Marker[];
		if (input instanceof TextmateSnippet) {
			marker = [...input.children];
		} else if (typeof input === 'string') {
			const p = new SnippetParser();
			marker = p.parse(input).children;
		} else {
			marker = [...input];
		}
		while (marker.length > 0) {
			const m = marker.pop();
			const ctor = ctors.pop()!;
			assert.ok(m instanceof ctor);
		}
		assert.strictEqual(marker.length, ctors.length);
		assert.strictEqual(marker.length, 0);
	}

	function assertTextAndMarker(value: string, escaped: string, ...ctors: Function[]) {
		assertText(value, escaped);
		assertMarker(value, ...ctors);
	}

	function assertEscaped(value: string, expected: string) {
		const actual = SnippetParser.escape(value);
		assert.strictEqual(actual, expected);
	}

	test('Parser, escaped', function () {
		assertEscaped('foo$0', 'foo\\$0');
		assertEscaped('foo\\$0', 'foo\\\\\\$0');
		assertEscaped('f$1oo$0', 'f\\$1oo\\$0');
		assertEscaped('${1:foo}$0', '\\${1:foo\\}\\$0');
		assertEscaped('$', '\\$');
	});

	test('Parser, text', () => {
		assertText('$', '$');
		assertText('\\\\$', '\\$');
		assertText('{', '{');
		assertText('\\}', '}');
		assertText('\\abc', '\\abc');
		assertText('foo${f:\\}}bar', 'foo}bar');
		assertText('\\{', '\\{');
		assertText('I need \\\\\\$', 'I need \\$');
		assertText('\\', '\\');
		assertText('\\{{', '\\{{');
		assertText('{{', '{{');
		assertText('{{dd', '{{dd');
		assertText('}}', '}}');
		assertText('ff}}', 'ff}}');

		assertText('farboo', 'farboo');
		assertText('far{{}}boo', 'far{{}}boo');
		assertText('far{{123}}boo', 'far{{123}}boo');
		assertText('far\\{{123}}boo', 'far\\{{123}}boo');
		assertText('far{{id:bern}}boo', 'far{{id:bern}}boo');
		assertText('far{{id:bern {{basel}}}}boo', 'far{{id:bern {{basel}}}}boo');
		assertText('far{{id:bern {{id:basel}}}}boo', 'far{{id:bern {{id:basel}}}}boo');
		assertText('far{{id:bern {{id2:basel}}}}boo', 'far{{id:bern {{id2:basel}}}}boo');
	});


	test('Parser, TM text', () => {
		assertTextAndMarker('foo${1:bar}}', 'foobar}', Text, Placeholder, Text);
		assertTextAndMarker('foo${1:bar}${2:foo}}', 'foobarfoo}', Text, Placeholder, Placeholder, Text);

		assertTextAndMarker('foo${1:bar\\}${2:foo}}', 'foobar}foo', Text, Placeholder);

		const [, placeholder] = new SnippetParser().parse('foo${1:bar\\}${2:foo}}').children;
		const { children } = (<Placeholder>placeholder);

		assert.strictEqual((<Placeholder>placeholder).index, 1);
		assert.ok(children[0] instanceof Text);
		assert.strictEqual(children[0].toString(), 'bar}');
		assert.ok(children[1] instanceof Placeholder);
		assert.strictEqual(children[1].toString(), 'foo');
	});

	test('Parser, placeholder', () => {
		assertTextAndMarker('farboo', 'farboo', Text);
		assertTextAndMarker('far{{}}boo', 'far{{}}boo', Text);
		assertTextAndMarker('far{{123}}boo', 'far{{123}}boo', Text);
		assertTextAndMarker('far\\{{123}}boo', 'far\\{{123}}boo', Text);
	});

	test('Parser, literal code', () => {
		assertTextAndMarker('far`123`boo', 'far`123`boo', Text);
		assertTextAndMarker('far\\`123\\`boo', 'far\\`123\\`boo', Text);
	});

	test('Parser, variables/tabstop', () => {
		assertTextAndMarker('$far-boo', '-boo', Variable, Text);
		assertTextAndMarker('\\$far-boo', '$far-boo', Text);
		assertTextAndMarker('far$farboo', 'far', Text, Variable);
		assertTextAndMarker('far${farboo}', 'far', Text, Variable);
		assertTextAndMarker('$123', '', Placeholder);
		assertTextAndMarker('$farboo', '', Variable);
		assertTextAndMarker('$far12boo', '', Variable);
		assertTextAndMarker('000_${far}_000', '000__000', Text, Variable, Text);
		assertTextAndMarker('FFF_${TM_SELECTED_TEXT}_FFF$0', 'FFF__FFF', Text, Variable, Text, Placeholder);
	});

	test('Parser, variables/placeholder with defaults', () => {
		assertTextAndMarker('${name:value}', 'value', Variable);
		assertTextAndMarker('${1:value}', 'value', Placeholder);
		assertTextAndMarker('${1:bar${2:foo}bar}', 'barfoobar', Placeholder);

		assertTextAndMarker('${name:value', '${name:value', Text);
		assertTextAndMarker('${1:bar${2:foobar}', '${1:barfoobar', Text, Placeholder);
	});

	test('Parser, variable transforms', function () {
		assertTextAndMarker('${foo///}', '', Variable);
		assertTextAndMarker('${foo/regex/format/gmi}', '', Variable);
		assertTextAndMarker('${foo/([A-Z][a-z])/format/}', '', Variable);

		// invalid regex
		assertTextAndMarker('${foo/([A-Z][a-z])/format/GMI}', '${foo/([A-Z][a-z])/format/GMI}', Text);
		assertTextAndMarker('${foo/([A-Z][a-z])/format/funky}', '${foo/([A-Z][a-z])/format/funky}', Text);
		assertTextAndMarker('${foo/([A-Z][a-z]/format/}', '${foo/([A-Z][a-z]/format/}', Text);

		// tricky regex
		assertTextAndMarker('${foo/m\\/atch/$1/i}', '', Variable);
		assertMarker('${foo/regex\/format/options}', Text);

		// incomplete
		assertTextAndMarker('${foo///', '${foo///', Text);
		assertTextAndMarker('${foo/regex/format/options', '${foo/regex/format/options', Text);

		// format string
		assertMarker('${foo/.*/${0:fooo}/i}', Variable);
		assertMarker('${foo/.*/${1}/i}', Variable);
		assertMarker('${foo/.*/$1/i}', Variable);
		assertMarker('${foo/.*/This-$1-encloses/i}', Variable);
		assertMarker('${foo/.*/complex${1:else}/i}', Variable);
		assertMarker('${foo/.*/complex${1:-else}/i}', Variable);
		assertMarker('${foo/.*/complex${1:+if}/i}', Variable);
		assertMarker('${foo/.*/complex${1:?if:else}/i}', Variable);
		assertMarker('${foo/.*/complex${1:/upcase}/i}', Variable);

	});

	test('Parser, placeholder transforms', function () {
		assertTextAndMarker('${1///}', '', Placeholder);
		assertTextAndMarker('${1/regex/format/gmi}', '', Placeholder);
		assertTextAndMarker('${1/([A-Z][a-z])/format/}', '', Placeholder);

		// tricky regex
		assertTextAndMarker('${1/m\\/atch/$1/i}', '', Placeholder);
		assertMarker('${1/regex\/format/options}', Text);

		// incomplete
		assertTextAndMarker('${1///', '${1///', Text);
		assertTextAndMarker('${1/regex/format/options', '${1/regex/format/options', Text);
	});

	test('No way to escape forward slash in snippet regex #36715', function () {
		assertMarker('${TM_DIRECTORY/src\\//$1/}', Variable);
	});

	test('No way to escape forward slash in snippet format section #37562', function () {
		assertMarker('${TM_SELECTED_TEXT/a/\\/$1/g}', Variable);
		assertMarker('${TM_SELECTED_TEXT/a/in\\/$1ner/g}', Variable);
		assertMarker('${TM_SELECTED_TEXT/a/end\\//g}', Variable);
	});

	test('Parser, placeholder with choice', () => {

		assertTextAndMarker('${1|one,two,three|}', 'one', Placeholder);
		assertTextAndMarker('${1|one|}', 'one', Placeholder);
		assertTextAndMarker('${1|one1,two2|}', 'one1', Placeholder);
		assertTextAndMarker('${1|one1\\,two2|}', 'one1,two2', Placeholder);
		assertTextAndMarker('${1|one1\\|two2|}', 'one1|two2', Placeholder);
		assertTextAndMarker('${1|one1\\atwo2|}', 'one1\\atwo2', Placeholder);
		assertTextAndMarker('${1|one,two,three,|}', '${1|one,two,three,|}', Text);
		assertTextAndMarker('${1|one,', '${1|one,', Text);

		const snippet = new SnippetParser().parse('${1|one,two,three|}');
		const expected: ((m: Marker) => boolean)[] = [
			m => m instanceof Placeholder,
			m => m instanceof Choice && m.options.length === 3 && m.options.every(x => x instanceof Text),
		];
		snippet.walk(marker => {
			assert.ok(expected.shift()!(marker));
			return true;
		});
	});

	test('Snippet choices: unable to escape comma and pipe, #31521', function () {
		assertTextAndMarker('console.log(${1|not\\, not, five, 5, 1   23|});', 'console.log(not, not);', Text, Placeholder, Text);
	});

	test('Marker, toTextmateString()', function () {

		function assertTextsnippetString(input: string, expected: string): void {
			const snippet = new SnippetParser().parse(input);
			const actual = snippet.toTextmateString();
			assert.strictEqual(actual, expected);
		}

		assertTextsnippetString('$1', '$1');
		assertTextsnippetString('\\$1', '\\$1');
		assertTextsnippetString('console.log(${1|not\\, not, five, 5, 1   23|});', 'console.log(${1|not\\, not, five, 5, 1   23|});');
		assertTextsnippetString('console.log(${1|not\\, not, \\| five, 5, 1   23|});', 'console.log(${1|not\\, not, \\| five, 5, 1   23|});');
		assertTextsnippetString('${1|cho\\,ices,wi\\|th,esc\\\\aping,chall\\\\\\,enges|}', '${1|cho\\,ices,wi\\|th,esc\\\\aping,chall\\\\\\,enges|}');
		assertTextsnippetString('this is text', 'this is text');
		assertTextsnippetString('this ${1:is ${2:nested with $var}}', 'this ${1:is ${2:nested with ${var}}}');
		assertTextsnippetString('this ${1:is ${2:nested with $var}}}', 'this ${1:is ${2:nested with ${var}}}\\}');
	});

	test('Marker, toTextmateString() <-> identity', function () {

		function assertIdent(input: string): void {
			// full loop: (1) parse input, (2) generate textmate string, (3) parse, (4) ensure both trees are equal
			const snippet = new SnippetParser().parse(input);
			const input2 = snippet.toTextmateString();
			const snippet2 = new SnippetParser().parse(input2);

			function checkCheckChildren(marker1: Marker, marker2: Marker) {
				assert.ok(marker1 instanceof Object.getPrototypeOf(marker2).constructor);
				assert.ok(marker2 instanceof Object.getPrototypeOf(marker1).constructor);

				assert.strictEqual(marker1.children.length, marker2.children.length);
				assert.strictEqual(marker1.toString(), marker2.toString());

				for (let i = 0; i < marker1.children.length; i++) {
					checkCheckChildren(marker1.children[i], marker2.children[i]);
				}
			}

			checkCheckChildren(snippet, snippet2);
		}

		assertIdent('$1');
		assertIdent('\\$1');
		assertIdent('console.log(${1|not\\, not, five, 5, 1   23|});');
		assertIdent('console.log(${1|not\\, not, \\| five, 5, 1   23|});');
		assertIdent('this is text');
		assertIdent('this ${1:is ${2:nested with $var}}');
		assertIdent('this ${1:is ${2:nested with $var}}}');
		assertIdent('this ${1:is ${2:nested with $var}} and repeating $1');
	});

	test('Parser, choise marker', () => {
		const { placeholders } = new SnippetParser().parse('${1|one,two,three|}');

		assert.strictEqual(placeholders.length, 1);
		assert.ok(placeholders[0].choice instanceof Choice);
		assert.ok(placeholders[0].children[0] instanceof Choice);
		assert.strictEqual((<Choice>placeholders[0].children[0]).options.length, 3);

		assertText('${1|one,two,three|}', 'one');
		assertText('\\${1|one,two,three|}', '${1|one,two,three|}');
		assertText('${1\\|one,two,three|}', '${1\\|one,two,three|}');
		assertText('${1||}', '${1||}');
	});

	test('Backslash character escape in choice tabstop doesn\'t work #58494', function () {

		const { placeholders } = new SnippetParser().parse('${1|\\,,},$,\\|,\\\\|}');
		assert.strictEqual(placeholders.length, 1);
		assert.ok(placeholders[0].choice instanceof Choice);
	});

	test('Parser, only textmate', () => {
		const p = new SnippetParser();
		assertMarker(p.parse('far{{}}boo'), Text);
		assertMarker(p.parse('far{{123}}boo'), Text);
		assertMarker(p.parse('far\\{{123}}boo'), Text);

		assertMarker(p.parse('far$0boo'), Text, Placeholder, Text);
		assertMarker(p.parse('far${123}boo'), Text, Placeholder, Text);
		assertMarker(p.parse('far\\${123}boo'), Text);
	});

	test('Parser, real world', () => {
		let marker = new SnippetParser().parse('console.warn(${1: $TM_SELECTED_TEXT })').children;

		assert.strictEqual(marker[0].toString(), 'console.warn(');
		assert.ok(marker[1] instanceof Placeholder);
		assert.strictEqual(marker[2].toString(), ')');

		const placeholder = <Placeholder>marker[1];
		assert.strictEqual(placeholder.index, 1);
		assert.strictEqual(placeholder.children.length, 3);
		assert.ok(placeholder.children[0] instanceof Text);
		assert.ok(placeholder.children[1] instanceof Variable);
		assert.ok(placeholder.children[2] instanceof Text);
		assert.strictEqual(placeholder.children[0].toString(), ' ');
		assert.strictEqual(placeholder.children[1].toString(), '');
		assert.strictEqual(placeholder.children[2].toString(), ' ');

		const nestedVariable = <Variable>placeholder.children[1];
		assert.strictEqual(nestedVariable.name, 'TM_SELECTED_TEXT');
		assert.strictEqual(nestedVariable.children.length, 0);

		marker = new SnippetParser().parse('$TM_SELECTED_TEXT').children;
		assert.strictEqual(marker.length, 1);
		assert.ok(marker[0] instanceof Variable);
	});

	test('Parser, transform example', () => {
		const { children } = new SnippetParser().parse('${1:name} : ${2:type}${3/\\s:=(.*)/${1:+ :=}${1}/};\n$0');

		//${1:name}
		assert.ok(children[0] instanceof Placeholder);
		assert.strictEqual(children[0].children.length, 1);
		assert.strictEqual(children[0].children[0].toString(), 'name');
		assert.strictEqual((<Placeholder>children[0]).transform, undefined);

		// :
		assert.ok(children[1] instanceof Text);
		assert.strictEqual(children[1].toString(), ' : ');

		//${2:type}
		assert.ok(children[2] instanceof Placeholder);
		assert.strictEqual(children[2].children.length, 1);
		assert.strictEqual(children[2].children[0].toString(), 'type');

		//${3/\\s:=(.*)/${1:+ :=}${1}/}
		assert.ok(children[3] instanceof Placeholder);
		assert.strictEqual(children[3].children.length, 0);
		assert.notStrictEqual((<Placeholder>children[3]).transform, undefined);
		const transform = (<Placeholder>children[3]).transform!;
		assert.deepStrictEqual(transform.regexp, /\s:=(.*)/);
		assert.strictEqual(transform.children.length, 2);
		assert.ok(transform.children[0] instanceof FormatString);
		assert.strictEqual((<FormatString>transform.children[0]).index, 1);
		assert.strictEqual((<FormatString>transform.children[0]).ifValue, ' :=');
		assert.ok(transform.children[1] instanceof FormatString);
		assert.strictEqual((<FormatString>transform.children[1]).index, 1);
		assert.ok(children[4] instanceof Text);
		assert.strictEqual(children[4].toString(), ';\n');

	});

	// TODO @jrieken making this strictEqul causes circular json conversion errors
	test('Parser, default placeholder values', () => {

		assertMarker('errorContext: `${1:err}`, error: $1', Text, Placeholder, Text, Placeholder);

		const [, p1, , p2] = new SnippetParser().parse('errorContext: `${1:err}`, error:$1').children;

		assert.strictEqual((<Placeholder>p1).index, 1);
		assert.strictEqual((<Placeholder>p1).children.length, 1);
		assert.strictEqual((<Text>(<Placeholder>p1).children[0]).toString(), 'err');

		assert.strictEqual((<Placeholder>p2).index, 1);
		assert.strictEqual((<Placeholder>p2).children.length, 1);
		assert.strictEqual((<Text>(<Placeholder>p2).children[0]).toString(), 'err');
	});

	// TODO @jrieken making this strictEqul causes circular json conversion errors
	test('Parser, default placeholder values and one transform', () => {

		assertMarker('errorContext: `${1:err}`, error: ${1/err/ok/}', Text, Placeholder, Text, Placeholder);

		const [, p3, , p4] = new SnippetParser().parse('errorContext: `${1:err}`, error:${1/err/ok/}').children;

		assert.strictEqual((<Placeholder>p3).index, 1);
		assert.strictEqual((<Placeholder>p3).children.length, 1);
		assert.strictEqual((<Text>(<Placeholder>p3).children[0]).toString(), 'err');
		assert.strictEqual((<Placeholder>p3).transform, undefined);

		assert.strictEqual((<Placeholder>p4).index, 1);
		assert.strictEqual((<Placeholder>p4).children.length, 1);
		assert.strictEqual((<Text>(<Placeholder>p4).children[0]).toString(), 'err');
		assert.notStrictEqual((<Placeholder>p4).transform, undefined);
	});

	test('Repeated snippet placeholder should always inherit, #31040', function () {
		assertText('${1:foo}-abc-$1', 'foo-abc-foo');
		assertText('${1:foo}-abc-${1}', 'foo-abc-foo');
		assertText('${1:foo}-abc-${1:bar}', 'foo-abc-foo');
		assertText('${1}-abc-${1:foo}', 'foo-abc-foo');
	});

	test('backspace esapce in TM only, #16212', () => {
		const actual = SnippetParser.asInsertText('Foo \\\\${abc}bar');
		assert.strictEqual(actual, 'Foo \\bar');
	});

	test('colon as variable/placeholder value, #16717', () => {
		let actual = SnippetParser.asInsertText('${TM_SELECTED_TEXT:foo:bar}');
		assert.strictEqual(actual, 'foo:bar');

		actual = SnippetParser.asInsertText('${1:foo:bar}');
		assert.strictEqual(actual, 'foo:bar');
	});

	test('incomplete placeholder', () => {
		assertTextAndMarker('${1:}', '', Placeholder);
	});

	test('marker#len', () => {

		function assertLen(template: string, ...lengths: number[]): void {
			const snippet = new SnippetParser().parse(template, true);
			snippet.walk(m => {
				const expected = lengths.shift();
				assert.strictEqual(m.len(), expected);
				return true;
			});
			assert.strictEqual(lengths.length, 0);
		}

		assertLen('text$0', 4, 0);
		assertLen('$1text$0', 0, 4, 0);
		assertLen('te$1xt$0', 2, 0, 2, 0);
		assertLen('errorContext: `${1:err}`, error: $0', 15, 0, 3, 10, 0);
		assertLen('errorContext: `${1:err}`, error: $1$0', 15, 0, 3, 10, 0, 3, 0);
		assertLen('$TM_SELECTED_TEXT$0', 0, 0);
		assertLen('${TM_SELECTED_TEXT:def}$0', 0, 3, 0);
	});

	test('parser, parent node', function () {
		let snippet = new SnippetParser().parse('This ${1:is ${2:nested}}$0', true);

		assert.strictEqual(snippet.placeholders.length, 3);
		let [first, second] = snippet.placeholders;
		assert.strictEqual(first.index, 1);
		assert.strictEqual(second.index, 2);
		assert.ok(second.parent === first);
		assert.ok(first.parent === snippet);

		snippet = new SnippetParser().parse('${VAR:default${1:value}}$0', true);
		assert.strictEqual(snippet.placeholders.length, 2);
		[first] = snippet.placeholders;
		assert.strictEqual(first.index, 1);

		assert.ok(snippet.children[0] instanceof Variable);
		assert.ok(first.parent === snippet.children[0]);
	});

	test('TextmateSnippet#enclosingPlaceholders', () => {
		const snippet = new SnippetParser().parse('This ${1:is ${2:nested}}$0', true);
		const [first, second] = snippet.placeholders;

		assert.deepStrictEqual(snippet.enclosingPlaceholders(first), []);
		assert.deepStrictEqual(snippet.enclosingPlaceholders(second), [first]);
	});

	test('TextmateSnippet#offset', () => {
		let snippet = new SnippetParser().parse('te$1xt', true);
		assert.strictEqual(snippet.offset(snippet.children[0]), 0);
		assert.strictEqual(snippet.offset(snippet.children[1]), 2);
		assert.strictEqual(snippet.offset(snippet.children[2]), 2);

		snippet = new SnippetParser().parse('${TM_SELECTED_TEXT:def}', true);
		assert.strictEqual(snippet.offset(snippet.children[0]), 0);
		assert.strictEqual(snippet.offset((<Variable>snippet.children[0]).children[0]), 0);

		// forgein marker
		assert.strictEqual(snippet.offset(new Text('foo')), -1);
	});

	test('TextmateSnippet#placeholder', () => {
		let snippet = new SnippetParser().parse('te$1xt$0', true);
		let placeholders = snippet.placeholders;
		assert.strictEqual(placeholders.length, 2);

		snippet = new SnippetParser().parse('te$1xt$1$0', true);
		placeholders = snippet.placeholders;
		assert.strictEqual(placeholders.length, 3);


		snippet = new SnippetParser().parse('te$1xt$2$0', true);
		placeholders = snippet.placeholders;
		assert.strictEqual(placeholders.length, 3);

		snippet = new SnippetParser().parse('${1:bar${2:foo}bar}$0', true);
		placeholders = snippet.placeholders;
		assert.strictEqual(placeholders.length, 3);
	});

	test('TextmateSnippet#replace 1/2', function () {
		const snippet = new SnippetParser().parse('aaa${1:bbb${2:ccc}}$0', true);

		assert.strictEqual(snippet.placeholders.length, 3);
		const [, second] = snippet.placeholders;
		assert.strictEqual(second.index, 2);

		const enclosing = snippet.enclosingPlaceholders(second);
		assert.strictEqual(enclosing.length, 1);
		assert.strictEqual(enclosing[0].index, 1);

		const nested = new SnippetParser().parse('ddd$1eee$0', true);
		snippet.replace(second, nested.children);

		assert.strictEqual(snippet.toString(), 'aaabbbdddeee');
		assert.strictEqual(snippet.placeholders.length, 4);
		assert.strictEqual(snippet.placeholders[0].index, 1);
		assert.strictEqual(snippet.placeholders[1].index, 1);
		assert.strictEqual(snippet.placeholders[2].index, 0);
		assert.strictEqual(snippet.placeholders[3].index, 0);

		const newEnclosing = snippet.enclosingPlaceholders(snippet.placeholders[1]);
		assert.ok(newEnclosing[0] === snippet.placeholders[0]);
		assert.strictEqual(newEnclosing.length, 1);
		assert.strictEqual(newEnclosing[0].index, 1);
	});

	test('TextmateSnippet#replace 2/2', function () {
		const snippet = new SnippetParser().parse('aaa${1:bbb${2:ccc}}$0', true);

		assert.strictEqual(snippet.placeholders.length, 3);
		const [, second] = snippet.placeholders;
		assert.strictEqual(second.index, 2);

		const nested = new SnippetParser().parse('dddeee$0', true);
		snippet.replace(second, nested.children);

		assert.strictEqual(snippet.toString(), 'aaabbbdddeee');
		assert.strictEqual(snippet.placeholders.length, 3);
	});

	test('Snippet order for placeholders, #28185', function () {

		const _10 = new Placeholder(10);
		const _2 = new Placeholder(2);

		assert.strictEqual(Placeholder.compareByIndex(_10, _2), 1);
	});

	test('Maximum call stack size exceeded, #28983', function () {
		new SnippetParser().parse('${1:${foo:${1}}}');
	});

	test('Snippet can freeze the editor, #30407', function () {

		const seen = new Set<Marker>();

		seen.clear();
		new SnippetParser().parse('class ${1:${TM_FILENAME/(?:\\A|_)([A-Za-z0-9]+)(?:\\.rb)?/(?2::\\u$1)/g}} < ${2:Application}Controller\n  $3\nend').walk(marker => {
			assert.ok(!seen.has(marker));
			seen.add(marker);
			return true;
		});

		seen.clear();
		new SnippetParser().parse('${1:${FOO:abc$1def}}').walk(marker => {
			assert.ok(!seen.has(marker));
			seen.add(marker);
			return true;
		});
	});

	test('Snippets: make parser ignore `${0|choice|}`, #31599', function () {
		assertTextAndMarker('${0|foo,bar|}', '${0|foo,bar|}', Text);
		assertTextAndMarker('${1|foo,bar|}', 'foo', Placeholder);
	});


	test('Transform -> FormatString#resolve', function () {

		// shorthand functions
		assert.strictEqual(new FormatString(1, 'upcase').resolve('foo'), 'FOO');
		assert.strictEqual(new FormatString(1, 'downcase').resolve('FOO'), 'foo');
		assert.strictEqual(new FormatString(1, 'capitalize').resolve('bar'), 'Bar');
		assert.strictEqual(new FormatString(1, 'capitalize').resolve('bar no repeat'), 'Bar no repeat');
		assert.strictEqual(new FormatString(1, 'pascalcase').resolve('bar-foo'), 'BarFoo');
		assert.strictEqual(new FormatString(1, 'pascalcase').resolve('bar-42-foo'), 'Bar42Foo');
		assert.strictEqual(new FormatString(1, 'pascalcase').resolve('snake_AndPascalCase'), 'SnakeAndPascalCase');
		assert.strictEqual(new FormatString(1, 'pascalcase').resolve('kebab-AndPascalCase'), 'KebabAndPascalCase');
		assert.strictEqual(new FormatString(1, 'pascalcase').resolve('_justPascalCase'), 'JustPascalCase');
		assert.strictEqual(new FormatString(1, 'camelcase').resolve('bar-foo'), 'barFoo');
		assert.strictEqual(new FormatString(1, 'camelcase').resolve('bar-42-foo'), 'bar42Foo');
		assert.strictEqual(new FormatString(1, 'camelcase').resolve('snake_AndCamelCase'), 'snakeAndCamelCase');
		assert.strictEqual(new FormatString(1, 'camelcase').resolve('kebab-AndCamelCase'), 'kebabAndCamelCase');
		assert.strictEqual(new FormatString(1, 'camelcase').resolve('_JustCamelCase'), 'justCamelCase');
		assert.strictEqual(new FormatString(1, 'kebabcase').resolve('barFoo'), 'bar-foo');
		assert.strictEqual(new FormatString(1, 'kebabcase').resolve('BarFoo'), 'bar-foo');
		assert.strictEqual(new FormatString(1, 'kebabcase').resolve('ABarFoo'), 'a-bar-foo');
		assert.strictEqual(new FormatString(1, 'kebabcase').resolve('bar42Foo'), 'bar42-foo');
		assert.strictEqual(new FormatString(1, 'kebabcase').resolve('snake_AndPascalCase'), 'snake-and-pascal-case');
		assert.strictEqual(new FormatString(1, 'kebabcase').resolve('kebab-AndCamelCase'), 'kebab-and-camel-case');
		assert.strictEqual(new FormatString(1, 'kebabcase').resolve('_justPascalCase'), 'just-pascal-case');
		assert.strictEqual(new FormatString(1, 'kebabcase').resolve('__UPCASE__'), 'upcase');
		assert.strictEqual(new FormatString(1, 'kebabcase').resolve('__BAR_FOO__'), 'bar-foo');
		assert.strictEqual(new FormatString(1, 'snakecase').resolve('bar-foo'), 'bar_foo');
		assert.strictEqual(new FormatString(1, 'snakecase').resolve('bar-42-foo'), 'bar_42_foo');
		assert.strictEqual(new FormatString(1, 'snakecase').resolve('snake_AndPascalCase'), 'snake_and_pascal_case');
		assert.strictEqual(new FormatString(1, 'snakecase').resolve('kebab-AndPascalCase'), 'kebab_and_pascal_case');
		assert.strictEqual(new FormatString(1, 'snakecase').resolve('_justPascalCase'), '_just_pascal_case');
		assert.strictEqual(new FormatString(1, 'notKnown').resolve('input'), 'input');

		// if
		assert.strictEqual(new FormatString(1, undefined, 'foo', undefined).resolve(undefined), '');
		assert.strictEqual(new FormatString(1, undefined, 'foo', undefined).resolve(''), '');
		assert.strictEqual(new FormatString(1, undefined, 'foo', undefined).resolve('bar'), 'foo');

		// else
		assert.strictEqual(new FormatString(1, undefined, undefined, 'foo').resolve(undefined), 'foo');
		assert.strictEqual(new FormatString(1, undefined, undefined, 'foo').resolve(''), 'foo');
		assert.strictEqual(new FormatString(1, undefined, undefined, 'foo').resolve('bar'), 'bar');

		// if-else
		assert.strictEqual(new FormatString(1, undefined, 'bar', 'foo').resolve(undefined), 'foo');
		assert.strictEqual(new FormatString(1, undefined, 'bar', 'foo').resolve(''), 'foo');
		assert.strictEqual(new FormatString(1, undefined, 'bar', 'foo').resolve('baz'), 'bar');
	});

	test('Snippet variable transformation doesn\'t work if regex is complicated and snippet body contains \'$$\' #55627', function () {
		const snippet = new SnippetParser().parse('const fileName = "${TM_FILENAME/(.*)\\..+$/$1/}"');
		assert.strictEqual(snippet.toTextmateString(), 'const fileName = "${TM_FILENAME/(.*)\\..+$/${1}/}"');
	});

	test('[BUG] HTML attribute suggestions: Snippet session does not have end-position set, #33147', function () {

		const { placeholders } = new SnippetParser().parse('src="$1"', true);
		const [first, second] = placeholders;

		assert.strictEqual(placeholders.length, 2);
		assert.strictEqual(first.index, 1);
		assert.strictEqual(second.index, 0);

	});

	test('Snippet optional transforms are not applied correctly when reusing the same variable, #37702', function () {

		const transform = new Transform();
		transform.appendChild(new FormatString(1, 'upcase'));
		transform.appendChild(new FormatString(2, 'upcase'));
		transform.regexp = /^(.)|-(.)/g;

		assert.strictEqual(transform.resolve('my-file-name'), 'MyFileName');

		const clone = transform.clone();
		assert.strictEqual(clone.resolve('my-file-name'), 'MyFileName');
	});

	test('problem with snippets regex #40570', function () {

		const snippet = new SnippetParser().parse('${TM_DIRECTORY/.*src[\\/](.*)/$1/}');
		assertMarker(snippet, Variable);
	});

	test('Variable transformation doesn\'t work if undefined variables are used in the same snippet #51769', function () {
		const transform = new Transform();
		transform.appendChild(new Text('bar'));
		transform.regexp = new RegExp('foo', 'gi');
		assert.strictEqual(transform.toTextmateString(), '/foo/bar/ig');
	});

	test('Snippet parser freeze #53144', function () {
		const snippet = new SnippetParser().parse('${1/(void$)|(.+)/${1:?-\treturn nil;}/}');
		assertMarker(snippet, Placeholder);
	});

	test('snippets variable not resolved in JSON proposal #52931', function () {
		assertTextAndMarker('FOO${1:/bin/bash}', 'FOO/bin/bash', Text, Placeholder);
	});

	test('Mirroring sequence of nested placeholders not selected properly on backjumping #58736', function () {
		const snippet = new SnippetParser().parse('${3:nest1 ${1:nest2 ${2:nest3}}} $3');
		assert.strictEqual(snippet.children.length, 3);
		assert.ok(snippet.children[0] instanceof Placeholder);
		assert.ok(snippet.children[1] instanceof Text);
		assert.ok(snippet.children[2] instanceof Placeholder);

		function assertParent(marker: Marker) {
			marker.children.forEach(assertParent);
			if (!(marker instanceof Placeholder)) {
				return;
			}
			let found = false;
			let m: Marker = marker;
			while (m && !found) {
				if (m.parent === snippet) {
					found = true;
				}
				m = m.parent;
			}
			assert.ok(found);
		}
		const [, , clone] = snippet.children;
		assertParent(clone);
	});

	test('Backspace can\'t be escaped in snippet variable transforms #65412', function () {

		const snippet = new SnippetParser().parse('namespace ${TM_DIRECTORY/[\\/]/\\\\/g};');
		assertMarker(snippet, Text, Variable, Text);
	});

	test('Snippet cannot escape closing bracket inside conditional insertion variable replacement #78883', function () {

		const snippet = new SnippetParser().parse('${TM_DIRECTORY/(.+)/${1:+import { hello \\} from world}/}');
		const variable = <Variable>snippet.children[0];
		assert.strictEqual(snippet.children.length, 1);
		assert.ok(variable instanceof Variable);
		assert.ok(variable.transform);
		assert.strictEqual(variable.transform.children.length, 1);
		assert.ok(variable.transform.children[0] instanceof FormatString);
		assert.strictEqual((<FormatString>variable.transform.children[0]).ifValue, 'import { hello } from world');
		assert.strictEqual((<FormatString>variable.transform.children[0]).elseValue, undefined);
	});

	test('Snippet escape backslashes inside conditional insertion variable replacement #80394', function () {

		const snippet = new SnippetParser().parse('${CURRENT_YEAR/(.+)/${1:+\\\\}/}');
		const variable = <Variable>snippet.children[0];
		assert.strictEqual(snippet.children.length, 1);
		assert.ok(variable instanceof Variable);
		assert.ok(variable.transform);
		assert.strictEqual(variable.transform.children.length, 1);
		assert.ok(variable.transform.children[0] instanceof FormatString);
		assert.strictEqual((<FormatString>variable.transform.children[0]).ifValue, '\\');
		assert.strictEqual((<FormatString>variable.transform.children[0]).elseValue, undefined);
	});

	test('Snippet placeholder empty right after expansion #152553', function () {

		const snippet = new SnippetParser().parse('${1:prog}: ${2:$1.cc} - $2');
		const actual = snippet.toString();
		assert.strictEqual(actual, 'prog: prog.cc - prog.cc');

		const snippet2 = new SnippetParser().parse('${1:prog}: ${3:${2:$1.cc}.33} - $2 $3');
		const actual2 = snippet2.toString();
		assert.strictEqual(actual2, 'prog: prog.cc.33 - prog.cc prog.cc.33');

		// cyclic references of placeholders
		const snippet3 = new SnippetParser().parse('${1:$2.one} <> ${2:$1.two}');
		const actual3 = snippet3.toString();
		assert.strictEqual(actual3, '.two.one.two.one <> .one.two.one.two');
	});

	test('Snippet choices are incorrectly escaped/applied #180132', function () {
		assertTextAndMarker('${1|aaa$aaa|}bbb\\$bbb', 'aaa$aaabbb$bbb', Placeholder, Text);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/snippet/test/browser/snippetSession.test.ts]---
Location: vscode-main/src/vs/editor/contrib/snippet/test/browser/snippetSession.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { mock } from '../../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IActiveCodeEditor } from '../../../../browser/editorBrowser.js';
import { IPosition, Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { Selection } from '../../../../common/core/selection.js';
import { ILanguageConfigurationService } from '../../../../common/languages/languageConfigurationRegistry.js';
import { TextModel } from '../../../../common/model/textModel.js';
import { SnippetParser } from '../../browser/snippetParser.js';
import { SnippetSession } from '../../browser/snippetSession.js';
import { createTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';
import { TestLanguageConfigurationService } from '../../../../test/common/modes/testLanguageConfigurationService.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';

suite('SnippetSession', function () {

	let languageConfigurationService: ILanguageConfigurationService;
	let editor: IActiveCodeEditor;
	let model: TextModel;

	function assertSelections(editor: IActiveCodeEditor, ...s: Selection[]) {
		for (const selection of editor.getSelections()) {
			const actual = s.shift()!;
			assert.ok(selection.equalsSelection(actual), `actual=${selection.toString()} <> expected=${actual.toString()}`);
		}
		assert.strictEqual(s.length, 0);
	}

	setup(function () {
		model = createTextModel('function foo() {\n    console.log(a);\n}');
		languageConfigurationService = new TestLanguageConfigurationService();
		const serviceCollection = new ServiceCollection(
			[ILabelService, new class extends mock<ILabelService>() { }],
			[ILanguageConfigurationService, languageConfigurationService],
			[IWorkspaceContextService, new class extends mock<IWorkspaceContextService>() {
				override getWorkspace() {
					return {
						id: 'workspace-id',
						folders: [],
					};
				}
			}],
		);
		editor = createTestCodeEditor(model, { serviceCollection }) as IActiveCodeEditor;
		editor.setSelections([new Selection(1, 1, 1, 1), new Selection(2, 5, 2, 5)]);
		assert.strictEqual(model.getEOL(), '\n');
	});

	teardown(function () {
		model.dispose();
		editor.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('normalize whitespace', function () {

		function assertNormalized(position: IPosition, input: string, expected: string): void {
			const snippet = new SnippetParser().parse(input);
			SnippetSession.adjustWhitespace(model, position, true, snippet);
			assert.strictEqual(snippet.toTextmateString(), expected);
		}

		assertNormalized(new Position(1, 1), 'foo', 'foo');
		assertNormalized(new Position(1, 1), 'foo\rbar', 'foo\nbar');
		assertNormalized(new Position(1, 1), 'foo\rbar', 'foo\nbar');
		assertNormalized(new Position(2, 5), 'foo\r\tbar', 'foo\n        bar');
		assertNormalized(new Position(2, 3), 'foo\r\tbar', 'foo\n    bar');
		assertNormalized(new Position(2, 5), 'foo\r\tbar\nfoo', 'foo\n        bar\n    foo');

		//Indentation issue with choice elements that span multiple lines #46266
		assertNormalized(new Position(2, 5), 'a\nb${1|foo,\nbar|}', 'a\n    b${1|foo,\nbar|}');
	});

	test('adjust selection (overwrite[Before|After])', function () {

		let range = SnippetSession.adjustSelection(model, new Selection(1, 2, 1, 2), 1, 0);
		assert.ok(range.equalsRange(new Range(1, 1, 1, 2)));
		range = SnippetSession.adjustSelection(model, new Selection(1, 2, 1, 2), 1111, 0);
		assert.ok(range.equalsRange(new Range(1, 1, 1, 2)));
		range = SnippetSession.adjustSelection(model, new Selection(1, 2, 1, 2), 0, 10);
		assert.ok(range.equalsRange(new Range(1, 2, 1, 12)));
		range = SnippetSession.adjustSelection(model, new Selection(1, 2, 1, 2), 0, 10111);
		assert.ok(range.equalsRange(new Range(1, 2, 1, 17)));

	});

	test('text edits & selection', function () {
		const session = new SnippetSession(editor, 'foo${1:bar}foo$0', undefined, languageConfigurationService);
		session.insert();
		assert.strictEqual(editor.getModel()!.getValue(), 'foobarfoofunction foo() {\n    foobarfooconsole.log(a);\n}');

		assertSelections(editor, new Selection(1, 4, 1, 7), new Selection(2, 8, 2, 11));
		session.next();
		assertSelections(editor, new Selection(1, 10, 1, 10), new Selection(2, 14, 2, 14));
	});

	test('text edit with reversed selection', function () {

		const session = new SnippetSession(editor, '${1:bar}$0', undefined, languageConfigurationService);
		editor.setSelections([new Selection(2, 5, 2, 5), new Selection(1, 1, 1, 1)]);

		session.insert();
		assert.strictEqual(model.getValue(), 'barfunction foo() {\n    barconsole.log(a);\n}');
		assertSelections(editor, new Selection(2, 5, 2, 8), new Selection(1, 1, 1, 4));
	});

	test('snippets, repeated tabstops', function () {
		const session = new SnippetSession(editor, '${1:abc}foo${1:abc}$0', undefined, languageConfigurationService);
		session.insert();
		assertSelections(editor,
			new Selection(1, 1, 1, 4), new Selection(1, 7, 1, 10),
			new Selection(2, 5, 2, 8), new Selection(2, 11, 2, 14),
		);
		session.next();
		assertSelections(editor,
			new Selection(1, 10, 1, 10),
			new Selection(2, 14, 2, 14),
		);
	});

	test('snippets, just text', function () {
		const session = new SnippetSession(editor, 'foobar', undefined, languageConfigurationService);
		session.insert();
		assert.strictEqual(model.getValue(), 'foobarfunction foo() {\n    foobarconsole.log(a);\n}');
		assertSelections(editor, new Selection(1, 7, 1, 7), new Selection(2, 11, 2, 11));
	});

	test('snippets, selections and new text with newlines', () => {

		const session = new SnippetSession(editor, 'foo\n\t${1:bar}\n$0', undefined, languageConfigurationService);
		session.insert();

		assert.strictEqual(editor.getModel()!.getValue(), 'foo\n    bar\nfunction foo() {\n    foo\n        bar\n    console.log(a);\n}');

		assertSelections(editor, new Selection(2, 5, 2, 8), new Selection(5, 9, 5, 12));

		session.next();
		assertSelections(editor, new Selection(3, 1, 3, 1), new Selection(6, 5, 6, 5));
	});

	test('snippets, newline NO whitespace adjust', () => {

		editor.setSelection(new Selection(2, 5, 2, 5));
		const session = new SnippetSession(editor, 'abc\n    foo\n        bar\n$0', { overwriteBefore: 0, overwriteAfter: 0, adjustWhitespace: false, clipboardText: undefined, overtypingCapturer: undefined }, languageConfigurationService);
		session.insert();
		assert.strictEqual(editor.getModel()!.getValue(), 'function foo() {\n    abc\n    foo\n        bar\nconsole.log(a);\n}');
	});

	test('snippets, selections -> next/prev', () => {

		const session = new SnippetSession(editor, 'f$1oo${2:bar}foo$0', undefined, languageConfigurationService);
		session.insert();

		// @ $2
		assertSelections(editor, new Selection(1, 2, 1, 2), new Selection(2, 6, 2, 6));
		// @ $1
		session.next();
		assertSelections(editor, new Selection(1, 4, 1, 7), new Selection(2, 8, 2, 11));
		// @ $2
		session.prev();
		assertSelections(editor, new Selection(1, 2, 1, 2), new Selection(2, 6, 2, 6));
		// @ $1
		session.next();
		assertSelections(editor, new Selection(1, 4, 1, 7), new Selection(2, 8, 2, 11));
		// @ $0
		session.next();
		assertSelections(editor, new Selection(1, 10, 1, 10), new Selection(2, 14, 2, 14));
	});

	test('snippets, selections & typing', function () {
		const session = new SnippetSession(editor, 'f${1:oo}_$2_$0', undefined, languageConfigurationService);
		session.insert();

		editor.trigger('test', 'type', { text: 'X' });
		session.next();
		editor.trigger('test', 'type', { text: 'bar' });

		// go back to ${2:oo} which is now just 'X'
		session.prev();
		assertSelections(editor, new Selection(1, 2, 1, 3), new Selection(2, 6, 2, 7));

		// go forward to $1 which is now 'bar'
		session.next();
		assertSelections(editor, new Selection(1, 4, 1, 7), new Selection(2, 8, 2, 11));

		// go to final tabstop
		session.next();
		assert.strictEqual(model.getValue(), 'fX_bar_function foo() {\n    fX_bar_console.log(a);\n}');
		assertSelections(editor, new Selection(1, 8, 1, 8), new Selection(2, 12, 2, 12));
	});

	test('snippets, insert shorter snippet into non-empty selection', function () {
		model.setValue('foo_bar_foo');
		editor.setSelections([new Selection(1, 1, 1, 4), new Selection(1, 9, 1, 12)]);

		new SnippetSession(editor, 'x$0', undefined, languageConfigurationService).insert();
		assert.strictEqual(model.getValue(), 'x_bar_x');
		assertSelections(editor, new Selection(1, 2, 1, 2), new Selection(1, 8, 1, 8));
	});

	test('snippets, insert longer snippet into non-empty selection', function () {
		model.setValue('foo_bar_foo');
		editor.setSelections([new Selection(1, 1, 1, 4), new Selection(1, 9, 1, 12)]);

		new SnippetSession(editor, 'LONGER$0', undefined, languageConfigurationService).insert();
		assert.strictEqual(model.getValue(), 'LONGER_bar_LONGER');
		assertSelections(editor, new Selection(1, 7, 1, 7), new Selection(1, 18, 1, 18));
	});

	test('snippets, don\'t grow final tabstop', function () {
		model.setValue('foo_zzz_foo');
		editor.setSelection(new Selection(1, 5, 1, 8));
		const session = new SnippetSession(editor, '$1bar$0', undefined, languageConfigurationService);
		session.insert();

		assertSelections(editor, new Selection(1, 5, 1, 5));
		editor.trigger('test', 'type', { text: 'foo-' });

		session.next();
		assert.strictEqual(model.getValue(), 'foo_foo-bar_foo');
		assertSelections(editor, new Selection(1, 12, 1, 12));

		editor.trigger('test', 'type', { text: 'XXX' });
		assert.strictEqual(model.getValue(), 'foo_foo-barXXX_foo');
		session.prev();
		assertSelections(editor, new Selection(1, 5, 1, 9));
		session.next();
		assertSelections(editor, new Selection(1, 15, 1, 15));
	});

	test('snippets, don\'t merge touching tabstops 1/2', function () {

		const session = new SnippetSession(editor, '$1$2$3$0', undefined, languageConfigurationService);
		session.insert();
		assertSelections(editor, new Selection(1, 1, 1, 1), new Selection(2, 5, 2, 5));

		session.next();
		assertSelections(editor, new Selection(1, 1, 1, 1), new Selection(2, 5, 2, 5));

		session.next();
		assertSelections(editor, new Selection(1, 1, 1, 1), new Selection(2, 5, 2, 5));

		session.next();
		assertSelections(editor, new Selection(1, 1, 1, 1), new Selection(2, 5, 2, 5));

		session.prev();
		session.prev();
		session.prev();
		assertSelections(editor, new Selection(1, 1, 1, 1), new Selection(2, 5, 2, 5));
		editor.trigger('test', 'type', { text: '111' });

		session.next();
		editor.trigger('test', 'type', { text: '222' });

		session.next();
		editor.trigger('test', 'type', { text: '333' });

		session.next();
		assert.strictEqual(model.getValue(), '111222333function foo() {\n    111222333console.log(a);\n}');
		assertSelections(editor, new Selection(1, 10, 1, 10), new Selection(2, 14, 2, 14));

		session.prev();
		assertSelections(editor, new Selection(1, 7, 1, 10), new Selection(2, 11, 2, 14));
		session.prev();
		assertSelections(editor, new Selection(1, 4, 1, 7), new Selection(2, 8, 2, 11));
		session.prev();
		assertSelections(editor, new Selection(1, 1, 1, 4), new Selection(2, 5, 2, 8));
	});
	test('snippets, don\'t merge touching tabstops 2/2', function () {

		const session = new SnippetSession(editor, '$1$2$3$0', undefined, languageConfigurationService);
		session.insert();
		assertSelections(editor, new Selection(1, 1, 1, 1), new Selection(2, 5, 2, 5));

		editor.trigger('test', 'type', { text: '111' });

		session.next();
		assertSelections(editor, new Selection(1, 4, 1, 4), new Selection(2, 8, 2, 8));
		editor.trigger('test', 'type', { text: '222' });

		session.next();
		assertSelections(editor, new Selection(1, 7, 1, 7), new Selection(2, 11, 2, 11));
		editor.trigger('test', 'type', { text: '333' });

		session.next();
		assert.strictEqual(session.isAtLastPlaceholder, true);
	});

	test('snippets, gracefully move over final tabstop', function () {
		const session = new SnippetSession(editor, '${1}bar$0', undefined, languageConfigurationService);
		session.insert();

		assert.strictEqual(session.isAtLastPlaceholder, false);
		assertSelections(editor, new Selection(1, 1, 1, 1), new Selection(2, 5, 2, 5));

		session.next();
		assert.strictEqual(session.isAtLastPlaceholder, true);
		assertSelections(editor, new Selection(1, 4, 1, 4), new Selection(2, 8, 2, 8));

		session.next();
		assert.strictEqual(session.isAtLastPlaceholder, true);
		assertSelections(editor, new Selection(1, 4, 1, 4), new Selection(2, 8, 2, 8));
	});

	test('snippets, overwriting nested placeholder', function () {
		const session = new SnippetSession(editor, 'log(${1:"$2"});$0', undefined, languageConfigurationService);
		session.insert();
		assertSelections(editor, new Selection(1, 5, 1, 7), new Selection(2, 9, 2, 11));

		editor.trigger('test', 'type', { text: 'XXX' });
		assert.strictEqual(model.getValue(), 'log(XXX);function foo() {\n    log(XXX);console.log(a);\n}');

		session.next();
		assert.strictEqual(session.isAtLastPlaceholder, false);
		// assertSelections(editor, new Selection(1, 7, 1, 7), new Selection(2, 11, 2, 11));

		session.next();
		assert.strictEqual(session.isAtLastPlaceholder, true);
		assertSelections(editor, new Selection(1, 10, 1, 10), new Selection(2, 14, 2, 14));
	});

	test('snippets, selections and snippet ranges', function () {
		const session = new SnippetSession(editor, '${1:foo}farboo${2:bar}$0', undefined, languageConfigurationService);
		session.insert();
		assert.strictEqual(model.getValue(), 'foofarboobarfunction foo() {\n    foofarboobarconsole.log(a);\n}');
		assertSelections(editor, new Selection(1, 1, 1, 4), new Selection(2, 5, 2, 8));

		assert.strictEqual(session.isSelectionWithinPlaceholders(), true);

		editor.setSelections([new Selection(1, 1, 1, 1)]);
		assert.strictEqual(session.isSelectionWithinPlaceholders(), false);

		editor.setSelections([new Selection(1, 6, 1, 6), new Selection(2, 10, 2, 10)]);
		assert.strictEqual(session.isSelectionWithinPlaceholders(), false); // in snippet, outside placeholder

		editor.setSelections([new Selection(1, 6, 1, 6), new Selection(2, 10, 2, 10), new Selection(1, 1, 1, 1)]);
		assert.strictEqual(session.isSelectionWithinPlaceholders(), false); // in snippet, outside placeholder

		editor.setSelections([new Selection(1, 6, 1, 6), new Selection(2, 10, 2, 10), new Selection(2, 20, 2, 21)]);
		assert.strictEqual(session.isSelectionWithinPlaceholders(), false);

		// reset selection to placeholder
		session.next();
		assert.strictEqual(session.isSelectionWithinPlaceholders(), true);
		assertSelections(editor, new Selection(1, 10, 1, 13), new Selection(2, 14, 2, 17));

		// reset selection to placeholder
		session.next();
		assert.strictEqual(session.isSelectionWithinPlaceholders(), true);
		assert.strictEqual(session.isAtLastPlaceholder, true);
		assertSelections(editor, new Selection(1, 13, 1, 13), new Selection(2, 17, 2, 17));
	});

	test('snippets, nested sessions', function () {

		model.setValue('');
		editor.setSelection(new Selection(1, 1, 1, 1));

		const first = new SnippetSession(editor, 'foo${2:bar}foo$0', undefined, languageConfigurationService);
		first.insert();
		assert.strictEqual(model.getValue(), 'foobarfoo');
		assertSelections(editor, new Selection(1, 4, 1, 7));

		const second = new SnippetSession(editor, 'ba${1:zzzz}$0', undefined, languageConfigurationService);
		second.insert();
		assert.strictEqual(model.getValue(), 'foobazzzzfoo');
		assertSelections(editor, new Selection(1, 6, 1, 10));

		second.next();
		assert.strictEqual(second.isAtLastPlaceholder, true);
		assertSelections(editor, new Selection(1, 10, 1, 10));

		first.next();
		assert.strictEqual(first.isAtLastPlaceholder, true);
		assertSelections(editor, new Selection(1, 13, 1, 13));
	});

	test('snippets, typing at final tabstop', function () {

		const session = new SnippetSession(editor, 'farboo$0', undefined, languageConfigurationService);
		session.insert();
		assert.strictEqual(session.isAtLastPlaceholder, true);
		assert.strictEqual(session.isSelectionWithinPlaceholders(), false);

		editor.trigger('test', 'type', { text: 'XXX' });
		assert.strictEqual(session.isSelectionWithinPlaceholders(), false);
	});

	test('snippets, typing at beginning', function () {

		editor.setSelection(new Selection(1, 2, 1, 2));
		const session = new SnippetSession(editor, 'farboo$0', undefined, languageConfigurationService);
		session.insert();

		editor.setSelection(new Selection(1, 2, 1, 2));
		assert.strictEqual(session.isSelectionWithinPlaceholders(), false);
		assert.strictEqual(session.isAtLastPlaceholder, true);

		editor.trigger('test', 'type', { text: 'XXX' });
		assert.strictEqual(model.getLineContent(1), 'fXXXfarboounction foo() {');
		assert.strictEqual(session.isSelectionWithinPlaceholders(), false);

		session.next();
		assertSelections(editor, new Selection(1, 11, 1, 11));
	});

	test('snippets, typing with nested placeholder', function () {

		editor.setSelection(new Selection(1, 1, 1, 1));
		const session = new SnippetSession(editor, 'This ${1:is ${2:nested}}.$0', undefined, languageConfigurationService);
		session.insert();
		assertSelections(editor, new Selection(1, 6, 1, 15));

		session.next();
		assertSelections(editor, new Selection(1, 9, 1, 15));

		editor.trigger('test', 'cut', {});
		assertSelections(editor, new Selection(1, 9, 1, 9));

		editor.trigger('test', 'type', { text: 'XXX' });
		session.prev();
		assertSelections(editor, new Selection(1, 6, 1, 12));
	});

	test('snippets, snippet with variables', function () {
		const session = new SnippetSession(editor, '@line=$TM_LINE_NUMBER$0', undefined, languageConfigurationService);
		session.insert();

		assert.strictEqual(model.getValue(), '@line=1function foo() {\n    @line=2console.log(a);\n}');
		assertSelections(editor, new Selection(1, 8, 1, 8), new Selection(2, 12, 2, 12));
	});

	test('snippets, merge', function () {
		editor.setSelection(new Selection(1, 1, 1, 1));
		const session = new SnippetSession(editor, 'This ${1:is ${2:nested}}.$0', undefined, languageConfigurationService);
		session.insert();
		session.next();
		assertSelections(editor, new Selection(1, 9, 1, 15));

		session.merge('really ${1:nested}$0');
		assertSelections(editor, new Selection(1, 16, 1, 22));

		session.next();
		assertSelections(editor, new Selection(1, 22, 1, 22));
		assert.strictEqual(session.isAtLastPlaceholder, false);

		session.next();
		assert.strictEqual(session.isAtLastPlaceholder, true);
		assertSelections(editor, new Selection(1, 23, 1, 23));

		session.prev();
		editor.trigger('test', 'type', { text: 'AAA' });

		// back to `really ${1:nested}`
		session.prev();
		assertSelections(editor, new Selection(1, 16, 1, 22));

		// back to `${1:is ...}` which now grew
		session.prev();
		assertSelections(editor, new Selection(1, 6, 1, 25));
	});

	test('snippets, transform', function () {
		editor.getModel()!.setValue('');
		editor.setSelection(new Selection(1, 1, 1, 1));
		const session = new SnippetSession(editor, '${1/foo/bar/}$0', undefined, languageConfigurationService);
		session.insert();
		assertSelections(editor, new Selection(1, 1, 1, 1));

		editor.trigger('test', 'type', { text: 'foo' });
		session.next();

		assert.strictEqual(model.getValue(), 'bar');
		assert.strictEqual(session.isAtLastPlaceholder, true);
		assertSelections(editor, new Selection(1, 4, 1, 4));
	});

	test('snippets, multi placeholder same index one transform', function () {
		editor.getModel()!.setValue('');
		editor.setSelection(new Selection(1, 1, 1, 1));
		const session = new SnippetSession(editor, '$1 baz ${1/foo/bar/}$0', undefined, languageConfigurationService);
		session.insert();
		assertSelections(editor, new Selection(1, 1, 1, 1), new Selection(1, 6, 1, 6));

		editor.trigger('test', 'type', { text: 'foo' });
		session.next();

		assert.strictEqual(model.getValue(), 'foo baz bar');
		assert.strictEqual(session.isAtLastPlaceholder, true);
		assertSelections(editor, new Selection(1, 12, 1, 12));
	});

	test('snippets, transform example', function () {
		editor.getModel()!.setValue('');
		editor.setSelection(new Selection(1, 1, 1, 1));
		const session = new SnippetSession(editor, '${1:name} : ${2:type}${3/\\s:=(.*)/${1:+ :=}${1}/};\n$0', undefined, languageConfigurationService);
		session.insert();

		assertSelections(editor, new Selection(1, 1, 1, 5));
		editor.trigger('test', 'type', { text: 'clk' });
		session.next();

		assertSelections(editor, new Selection(1, 7, 1, 11));
		editor.trigger('test', 'type', { text: 'std_logic' });
		session.next();

		assertSelections(editor, new Selection(1, 16, 1, 16));
		session.next();

		assert.strictEqual(model.getValue(), 'clk : std_logic;\n');
		assert.strictEqual(session.isAtLastPlaceholder, true);
		assertSelections(editor, new Selection(2, 1, 2, 1));
	});

	test('snippets, transform with indent', function () {
		const snippet = [
			'private readonly ${1} = new Emitter<$2>();',
			'readonly ${1/^_(.*)/$1/}: Event<$2> = this.$1.event;',
			'$0'
		].join('\n');
		const expected = [
			'{',
			'\tprivate readonly _prop = new Emitter<string>();',
			'\treadonly prop: Event<string> = this._prop.event;',
			'\t',
			'}'
		].join('\n');
		const base = [
			'{',
			'\t',
			'}'
		].join('\n');

		editor.getModel()!.setValue(base);
		editor.getModel()!.updateOptions({ insertSpaces: false });
		editor.setSelection(new Selection(2, 2, 2, 2));

		const session = new SnippetSession(editor, snippet, undefined, languageConfigurationService);
		session.insert();

		assertSelections(editor, new Selection(2, 19, 2, 19), new Selection(3, 11, 3, 11), new Selection(3, 28, 3, 28));
		editor.trigger('test', 'type', { text: '_prop' });
		session.next();

		assertSelections(editor, new Selection(2, 39, 2, 39), new Selection(3, 23, 3, 23));
		editor.trigger('test', 'type', { text: 'string' });
		session.next();

		assert.strictEqual(model.getValue(), expected);
		assert.strictEqual(session.isAtLastPlaceholder, true);
		assertSelections(editor, new Selection(4, 2, 4, 2));

	});

	test('snippets, transform example hit if', function () {
		editor.getModel()!.setValue('');
		editor.setSelection(new Selection(1, 1, 1, 1));
		const session = new SnippetSession(editor, '${1:name} : ${2:type}${3/\\s:=(.*)/${1:+ :=}${1}/};\n$0', undefined, languageConfigurationService);
		session.insert();

		assertSelections(editor, new Selection(1, 1, 1, 5));
		editor.trigger('test', 'type', { text: 'clk' });
		session.next();

		assertSelections(editor, new Selection(1, 7, 1, 11));
		editor.trigger('test', 'type', { text: 'std_logic' });
		session.next();

		assertSelections(editor, new Selection(1, 16, 1, 16));
		editor.trigger('test', 'type', { text: ' := \'1\'' });
		session.next();

		assert.strictEqual(model.getValue(), 'clk : std_logic := \'1\';\n');
		assert.strictEqual(session.isAtLastPlaceholder, true);
		assertSelections(editor, new Selection(2, 1, 2, 1));
	});

	test('Snippet tab stop selection issue #96545, snippets, transform adjacent to previous placeholder', function () {
		editor.getModel()!.setValue('');
		editor.setSelection(new Selection(1, 1, 1, 1));
		const session = new SnippetSession(editor, '${1:{}${2:fff}${1/{/}/}', undefined, languageConfigurationService);
		session.insert();

		assertSelections(editor, new Selection(1, 1, 1, 2), new Selection(1, 5, 1, 6));
		session.next();

		assert.strictEqual(model.getValue(), '{fff}');
		assertSelections(editor, new Selection(1, 2, 1, 5));
		editor.trigger('test', 'type', { text: 'ggg' });
		session.next();

		assert.strictEqual(model.getValue(), '{ggg}');
		assert.strictEqual(session.isAtLastPlaceholder, true);
		assertSelections(editor, new Selection(1, 6, 1, 6));
	});

	test('Snippet tab stop selection issue #96545', function () {
		editor.getModel().setValue('');
		const session = new SnippetSession(editor, '${1:{}${2:fff}${1/[\\{]/}/}$0', undefined, languageConfigurationService);
		session.insert();
		assert.strictEqual(editor.getModel().getValue(), '{fff{');

		assertSelections(editor, new Selection(1, 1, 1, 2), new Selection(1, 5, 1, 6));
		session.next();
		assertSelections(editor, new Selection(1, 2, 1, 5));
	});

	test('Snippet placeholder index incorrect after using 2+ snippets in a row that each end with a placeholder, #30769', function () {
		editor.getModel()!.setValue('');
		editor.setSelection(new Selection(1, 1, 1, 1));
		const session = new SnippetSession(editor, 'test ${1:replaceme}', undefined, languageConfigurationService);
		session.insert();

		editor.trigger('test', 'type', { text: '1' });
		editor.trigger('test', 'type', { text: '\n' });
		assert.strictEqual(editor.getModel()!.getValue(), 'test 1\n');

		session.merge('test ${1:replaceme}');
		editor.trigger('test', 'type', { text: '2' });
		editor.trigger('test', 'type', { text: '\n' });

		assert.strictEqual(editor.getModel()!.getValue(), 'test 1\ntest 2\n');

		session.merge('test ${1:replaceme}');
		editor.trigger('test', 'type', { text: '3' });
		editor.trigger('test', 'type', { text: '\n' });

		assert.strictEqual(editor.getModel()!.getValue(), 'test 1\ntest 2\ntest 3\n');

		session.merge('test ${1:replaceme}');
		editor.trigger('test', 'type', { text: '4' });
		editor.trigger('test', 'type', { text: '\n' });

		assert.strictEqual(editor.getModel()!.getValue(), 'test 1\ntest 2\ntest 3\ntest 4\n');
	});

	test('Snippet variable text isn\'t whitespace normalised, #31124', function () {
		editor.getModel()!.setValue([
			'start',
			'\t\t-one',
			'\t\t-two',
			'end'
		].join('\n'));

		editor.getModel()!.updateOptions({ insertSpaces: false });
		editor.setSelection(new Selection(2, 2, 3, 7));

		new SnippetSession(editor, '<div>\n\t$TM_SELECTED_TEXT\n</div>$0', undefined, languageConfigurationService).insert();

		let expected = [
			'start',
			'\t<div>',
			'\t\t\t-one',
			'\t\t\t-two',
			'\t</div>',
			'end'
		].join('\n');

		assert.strictEqual(editor.getModel()!.getValue(), expected);

		editor.getModel()!.setValue([
			'start',
			'\t\t-one',
			'\t-two',
			'end'
		].join('\n'));

		editor.getModel()!.updateOptions({ insertSpaces: false });
		editor.setSelection(new Selection(2, 2, 3, 7));

		new SnippetSession(editor, '<div>\n\t$TM_SELECTED_TEXT\n</div>$0', undefined, languageConfigurationService).insert();

		expected = [
			'start',
			'\t<div>',
			'\t\t\t-one',
			'\t\t-two',
			'\t</div>',
			'end'
		].join('\n');

		assert.strictEqual(editor.getModel()!.getValue(), expected);
	});

	test('Selecting text from left to right, and choosing item messes up code, #31199', function () {
		const model = editor.getModel()!;
		model.setValue('console.log');

		let actual = SnippetSession.adjustSelection(model, new Selection(1, 12, 1, 9), 3, 0);
		assert.ok(actual.equalsSelection(new Selection(1, 9, 1, 6)));

		actual = SnippetSession.adjustSelection(model, new Selection(1, 9, 1, 12), 3, 0);
		assert.ok(actual.equalsSelection(new Selection(1, 9, 1, 12)));

		editor.setSelections([new Selection(1, 9, 1, 12)]);
		new SnippetSession(editor, 'far', { overwriteBefore: 3, overwriteAfter: 0, adjustWhitespace: true, clipboardText: undefined, overtypingCapturer: undefined }, languageConfigurationService).insert();
		assert.strictEqual(model.getValue(), 'console.far');
	});

	test('Tabs don\'t get replaced with spaces in snippet transformations #103818', function () {
		const model = editor.getModel()!;
		model.setValue('\n{\n  \n}');
		model.updateOptions({ insertSpaces: true, indentSize: 2 });
		editor.setSelections([new Selection(1, 1, 1, 1), new Selection(3, 6, 3, 6)]);
		const session = new SnippetSession(editor, [
			'function animate () {',
			'\tvar ${1:a} = 12;',
			'\tconsole.log(${1/(.*)/\n\t\t$1\n\t/})',
			'}'
		].join('\n'), undefined, languageConfigurationService);

		session.insert();

		assert.strictEqual(model.getValue(), [
			'function animate () {',
			'  var a = 12;',
			'  console.log(a)',
			'}',
			'{',
			'  function animate () {',
			'    var a = 12;',
			'    console.log(a)',
			'  }',
			'}',
		].join('\n'));

		editor.trigger('test', 'type', { text: 'bbb' });
		session.next();

		assert.strictEqual(model.getValue(), [
			'function animate () {',
			'  var bbb = 12;',
			'  console.log(',
			'    bbb',
			'  )',
			'}',
			'{',
			'  function animate () {',
			'    var bbb = 12;',
			'    console.log(',
			'      bbb',
			'    )',
			'  }',
			'}',
		].join('\n'));
	});


	suite('createEditsAndSnippetsFromEdits', function () {

		test('empty', function () {

			const result = SnippetSession.createEditsAndSnippetsFromEdits(editor, [], true, true, undefined, undefined, languageConfigurationService);

			assert.deepStrictEqual(result.edits, []);
			assert.deepStrictEqual(result.snippets, []);
		});

		test('basic', function () {

			editor.getModel().setValue('foo("bar")');

			const result = SnippetSession.createEditsAndSnippetsFromEdits(
				editor,
				[{ range: new Range(1, 5, 1, 9), template: '$1' }, { range: new Range(1, 1, 1, 1), template: 'const ${1:new_const} = "bar"' }],
				true, true, undefined, undefined, languageConfigurationService
			);

			assert.strictEqual(result.edits.length, 2);
			assert.deepStrictEqual(result.edits[0].range, new Range(1, 1, 1, 1));
			assert.deepStrictEqual(result.edits[0].text, 'const new_const = "bar"');
			assert.deepStrictEqual(result.edits[1].range, new Range(1, 5, 1, 9));
			assert.deepStrictEqual(result.edits[1].text, 'new_const');

			assert.strictEqual(result.snippets.length, 1);
			assert.strictEqual(result.snippets[0].isTrivialSnippet, false);
		});

		test('with $SELECTION variable', function () {
			editor.getModel().setValue('Some text and a selection');
			editor.setSelections([new Selection(1, 17, 1, 26)]);

			const result = SnippetSession.createEditsAndSnippetsFromEdits(
				editor,
				[{ range: new Range(1, 17, 1, 26), template: 'wrapped <$SELECTION>' }],
				true, true, undefined, undefined, languageConfigurationService
			);

			assert.strictEqual(result.edits.length, 1);
			assert.deepStrictEqual(result.edits[0].range, new Range(1, 17, 1, 26));
			assert.deepStrictEqual(result.edits[0].text, 'wrapped <selection>');

			assert.strictEqual(result.snippets.length, 1);
			assert.strictEqual(result.snippets[0].isTrivialSnippet, true);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/snippet/test/browser/snippetVariables.test.ts]---
Location: vscode-main/src/vs/editor/contrib/snippet/test/browser/snippetVariables.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import * as sinon from 'sinon';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { sep } from '../../../../../base/common/path.js';
import { isWindows } from '../../../../../base/common/platform.js';
import { extUriBiasedIgnorePathCase } from '../../../../../base/common/resources.js';
import { URI } from '../../../../../base/common/uri.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Selection } from '../../../../common/core/selection.js';
import { TextModel } from '../../../../common/model/textModel.js';
import { SnippetParser, Variable, VariableResolver } from '../../browser/snippetParser.js';
import { ClipboardBasedVariableResolver, CompositeSnippetVariableResolver, ModelBasedVariableResolver, SelectionBasedVariableResolver, TimeBasedVariableResolver, WorkspaceBasedVariableResolver } from '../../browser/snippetVariables.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { IWorkspace, IWorkspaceContextService, toWorkspaceFolder } from '../../../../../platform/workspace/common/workspace.js';
import { Workspace } from '../../../../../platform/workspace/test/common/testWorkspace.js';
import { toWorkspaceFolders } from '../../../../../platform/workspaces/common/workspaces.js';

suite('Snippet Variables Resolver', function () {


	const labelService = new class extends mock<ILabelService>() {
		override getUriLabel(uri: URI) {
			return uri.fsPath;
		}
	};

	let model: TextModel;
	let resolver: VariableResolver;

	setup(function () {
		model = createTextModel([
			'this is line one',
			'this is line two',
			'    this is line three'
		].join('\n'), undefined, undefined, URI.parse('file:///foo/files/text.txt'));

		resolver = new CompositeSnippetVariableResolver([
			new ModelBasedVariableResolver(labelService, model),
			new SelectionBasedVariableResolver(model, new Selection(1, 1, 1, 1), 0, undefined),
		]);
	});

	teardown(function () {
		model.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();


	function assertVariableResolve(resolver: VariableResolver, varName: string, expected?: string) {
		const snippet = new SnippetParser().parse(`$${varName}`);
		const variable = <Variable>snippet.children[0];
		variable.resolve(resolver);
		if (variable.children.length === 0) {
			assert.strictEqual(undefined, expected);
		} else {
			assert.strictEqual(variable.toString(), expected);
		}
	}

	test('editor variables, basics', function () {
		assertVariableResolve(resolver, 'TM_FILENAME', 'text.txt');
		assertVariableResolve(resolver, 'something', undefined);
	});

	test('editor variables, file/dir', function () {

		const disposables = new DisposableStore();

		assertVariableResolve(resolver, 'TM_FILENAME', 'text.txt');
		if (!isWindows) {
			assertVariableResolve(resolver, 'TM_DIRECTORY', '/foo/files');
			assertVariableResolve(resolver, 'TM_DIRECTORY_BASE', 'files');
			assertVariableResolve(resolver, 'TM_FILEPATH', '/foo/files/text.txt');
		}

		resolver = new ModelBasedVariableResolver(
			labelService,
			disposables.add(createTextModel('', undefined, undefined, URI.parse('http://www.pb.o/abc/def/ghi')))
		);
		assertVariableResolve(resolver, 'TM_FILENAME', 'ghi');
		if (!isWindows) {
			assertVariableResolve(resolver, 'TM_DIRECTORY', '/abc/def');
			assertVariableResolve(resolver, 'TM_DIRECTORY_BASE', 'def');
			assertVariableResolve(resolver, 'TM_FILEPATH', '/abc/def/ghi');
		}

		resolver = new ModelBasedVariableResolver(
			labelService,
			disposables.add(createTextModel('', undefined, undefined, URI.parse('mem:fff.ts')))
		);
		assertVariableResolve(resolver, 'TM_DIRECTORY', '');
		assertVariableResolve(resolver, 'TM_DIRECTORY_BASE', '');
		assertVariableResolve(resolver, 'TM_FILEPATH', 'fff.ts');

		disposables.dispose();
	});

	test('Path delimiters in code snippet variables aren\'t specific to remote OS #76840', function () {

		const labelService = new class extends mock<ILabelService>() {
			override getUriLabel(uri: URI) {
				return uri.fsPath.replace(/\/|\\/g, '|');
			}
		};

		const model = createTextModel([].join('\n'), undefined, undefined, URI.parse('foo:///foo/files/text.txt'));

		const resolver = new CompositeSnippetVariableResolver([new ModelBasedVariableResolver(labelService, model)]);

		assertVariableResolve(resolver, 'TM_FILEPATH', '|foo|files|text.txt');

		model.dispose();
	});

	test('editor variables, selection', function () {

		resolver = new SelectionBasedVariableResolver(model, new Selection(1, 2, 2, 3), 0, undefined);
		assertVariableResolve(resolver, 'TM_SELECTED_TEXT', 'his is line one\nth');
		assertVariableResolve(resolver, 'TM_CURRENT_LINE', 'this is line two');
		assertVariableResolve(resolver, 'TM_LINE_INDEX', '1');
		assertVariableResolve(resolver, 'TM_LINE_NUMBER', '2');
		assertVariableResolve(resolver, 'CURSOR_INDEX', '0');
		assertVariableResolve(resolver, 'CURSOR_NUMBER', '1');

		resolver = new SelectionBasedVariableResolver(model, new Selection(1, 2, 2, 3), 4, undefined);
		assertVariableResolve(resolver, 'CURSOR_INDEX', '4');
		assertVariableResolve(resolver, 'CURSOR_NUMBER', '5');

		resolver = new SelectionBasedVariableResolver(model, new Selection(2, 3, 1, 2), 0, undefined);
		assertVariableResolve(resolver, 'TM_SELECTED_TEXT', 'his is line one\nth');
		assertVariableResolve(resolver, 'TM_CURRENT_LINE', 'this is line one');
		assertVariableResolve(resolver, 'TM_LINE_INDEX', '0');
		assertVariableResolve(resolver, 'TM_LINE_NUMBER', '1');

		resolver = new SelectionBasedVariableResolver(model, new Selection(1, 2, 1, 2), 0, undefined);
		assertVariableResolve(resolver, 'TM_SELECTED_TEXT', undefined);

		assertVariableResolve(resolver, 'TM_CURRENT_WORD', 'this');

		resolver = new SelectionBasedVariableResolver(model, new Selection(3, 1, 3, 1), 0, undefined);
		assertVariableResolve(resolver, 'TM_CURRENT_WORD', undefined);

	});

	test('TextmateSnippet, resolve variable', function () {
		const snippet = new SnippetParser().parse('"$TM_CURRENT_WORD"', true);
		assert.strictEqual(snippet.toString(), '""');
		snippet.resolveVariables(resolver);
		assert.strictEqual(snippet.toString(), '"this"');

	});

	test('TextmateSnippet, resolve variable with default', function () {
		const snippet = new SnippetParser().parse('"${TM_CURRENT_WORD:foo}"', true);
		assert.strictEqual(snippet.toString(), '"foo"');
		snippet.resolveVariables(resolver);
		assert.strictEqual(snippet.toString(), '"this"');
	});

	test('More useful environment variables for snippets, #32737', function () {

		const disposables = new DisposableStore();

		assertVariableResolve(resolver, 'TM_FILENAME_BASE', 'text');

		resolver = new ModelBasedVariableResolver(
			labelService,
			disposables.add(createTextModel('', undefined, undefined, URI.parse('http://www.pb.o/abc/def/ghi')))
		);
		assertVariableResolve(resolver, 'TM_FILENAME_BASE', 'ghi');

		resolver = new ModelBasedVariableResolver(
			labelService,
			disposables.add(createTextModel('', undefined, undefined, URI.parse('mem:.git')))
		);
		assertVariableResolve(resolver, 'TM_FILENAME_BASE', '.git');

		resolver = new ModelBasedVariableResolver(
			labelService,
			disposables.add(createTextModel('', undefined, undefined, URI.parse('mem:foo.')))
		);
		assertVariableResolve(resolver, 'TM_FILENAME_BASE', 'foo');

		disposables.dispose();
	});


	function assertVariableResolve2(input: string, expected: string, varValue?: string) {
		const snippet = new SnippetParser().parse(input)
			.resolveVariables({ resolve(variable) { return varValue || variable.name; } });

		const actual = snippet.toString();
		assert.strictEqual(actual, expected);
	}

	test('Variable Snippet Transform', function () {

		const snippet = new SnippetParser().parse('name=${TM_FILENAME/(.*)\\..+$/$1/}', true);
		snippet.resolveVariables(resolver);
		assert.strictEqual(snippet.toString(), 'name=text');

		assertVariableResolve2('${ThisIsAVar/([A-Z]).*(Var)/$2/}', 'Var');
		assertVariableResolve2('${ThisIsAVar/([A-Z]).*(Var)/$2-${1:/downcase}/}', 'Var-t');
		assertVariableResolve2('${Foo/(.*)/${1:+Bar}/img}', 'Bar');

		//https://github.com/microsoft/vscode/issues/33162
		assertVariableResolve2('export default class ${TM_FILENAME/(\\w+)\\.js/$1/g}', 'export default class FooFile', 'FooFile.js');

		assertVariableResolve2('${foobarfoobar/(foo)/${1:+FAR}/g}', 'FARbarFARbar'); // global
		assertVariableResolve2('${foobarfoobar/(foo)/${1:+FAR}/}', 'FARbarfoobar'); // first match
		assertVariableResolve2('${foobarfoobar/(bazz)/${1:+FAR}/g}', 'foobarfoobar'); // no match, no else
		// assertVariableResolve2('${foobarfoobar/(bazz)/${1:+FAR}/g}', ''); // no match

		assertVariableResolve2('${foobarfoobar/(foo)/${2:+FAR}/g}', 'barbar'); // bad group reference
	});

	test('Snippet transforms do not handle regex with alternatives or optional matches, #36089', function () {

		assertVariableResolve2(
			'${TM_FILENAME/^(.)|(?:-(.))|(\\.js)/${1:/upcase}${2:/upcase}/g}',
			'MyClass',
			'my-class.js'
		);

		// no hyphens
		assertVariableResolve2(
			'${TM_FILENAME/^(.)|(?:-(.))|(\\.js)/${1:/upcase}${2:/upcase}/g}',
			'Myclass',
			'myclass.js'
		);

		// none matching suffix
		assertVariableResolve2(
			'${TM_FILENAME/^(.)|(?:-(.))|(\\.js)/${1:/upcase}${2:/upcase}/g}',
			'Myclass.foo',
			'myclass.foo'
		);

		// more than one hyphen
		assertVariableResolve2(
			'${TM_FILENAME/^(.)|(?:-(.))|(\\.js)/${1:/upcase}${2:/upcase}/g}',
			'ThisIsAFile',
			'this-is-a-file.js'
		);

		// KEBAB CASE
		assertVariableResolve2(
			'${TM_FILENAME_BASE/([A-Z][a-z]+)([A-Z][a-z]+$)?/${1:/downcase}-${2:/downcase}/g}',
			'capital-case',
			'CapitalCase'
		);

		assertVariableResolve2(
			'${TM_FILENAME_BASE/([A-Z][a-z]+)([A-Z][a-z]+$)?/${1:/downcase}-${2:/downcase}/g}',
			'capital-case-more',
			'CapitalCaseMore'
		);
	});

	test('Add variable to insert value from clipboard to a snippet #40153', function () {

		assertVariableResolve(new ClipboardBasedVariableResolver(() => undefined, 1, 0, true), 'CLIPBOARD', undefined);

		assertVariableResolve(new ClipboardBasedVariableResolver(() => null!, 1, 0, true), 'CLIPBOARD', undefined);

		assertVariableResolve(new ClipboardBasedVariableResolver(() => '', 1, 0, true), 'CLIPBOARD', undefined);

		assertVariableResolve(new ClipboardBasedVariableResolver(() => 'foo', 1, 0, true), 'CLIPBOARD', 'foo');

		assertVariableResolve(new ClipboardBasedVariableResolver(() => 'foo', 1, 0, true), 'foo', undefined);
		assertVariableResolve(new ClipboardBasedVariableResolver(() => 'foo', 1, 0, true), 'cLIPBOARD', undefined);
	});

	test('Add variable to insert value from clipboard to a snippet #40153, 2', function () {

		assertVariableResolve(new ClipboardBasedVariableResolver(() => 'line1', 1, 2, true), 'CLIPBOARD', 'line1');
		assertVariableResolve(new ClipboardBasedVariableResolver(() => 'line1\nline2\nline3', 1, 2, true), 'CLIPBOARD', 'line1\nline2\nline3');

		assertVariableResolve(new ClipboardBasedVariableResolver(() => 'line1\nline2', 1, 2, true), 'CLIPBOARD', 'line2');
		resolver = new ClipboardBasedVariableResolver(() => 'line1\nline2', 0, 2, true);
		assertVariableResolve(new ClipboardBasedVariableResolver(() => 'line1\nline2', 0, 2, true), 'CLIPBOARD', 'line1');

		assertVariableResolve(new ClipboardBasedVariableResolver(() => 'line1\nline2', 0, 2, false), 'CLIPBOARD', 'line1\nline2');
	});


	function assertVariableResolve3(resolver: VariableResolver, varName: string) {
		const snippet = new SnippetParser().parse(`$${varName}`);
		const variable = <Variable>snippet.children[0];

		assert.strictEqual(variable.resolve(resolver), true, `${varName} failed to resolve`);
	}

	test('Add time variables for snippets #41631, #43140', function () {

		const resolver = new TimeBasedVariableResolver;

		assertVariableResolve3(resolver, 'CURRENT_YEAR');
		assertVariableResolve3(resolver, 'CURRENT_YEAR_SHORT');
		assertVariableResolve3(resolver, 'CURRENT_MONTH');
		assertVariableResolve3(resolver, 'CURRENT_DATE');
		assertVariableResolve3(resolver, 'CURRENT_HOUR');
		assertVariableResolve3(resolver, 'CURRENT_MINUTE');
		assertVariableResolve3(resolver, 'CURRENT_SECOND');
		assertVariableResolve3(resolver, 'CURRENT_DAY_NAME');
		assertVariableResolve3(resolver, 'CURRENT_DAY_NAME_SHORT');
		assertVariableResolve3(resolver, 'CURRENT_MONTH_NAME');
		assertVariableResolve3(resolver, 'CURRENT_MONTH_NAME_SHORT');
		assertVariableResolve3(resolver, 'CURRENT_SECONDS_UNIX');
		assertVariableResolve3(resolver, 'CURRENT_TIMEZONE_OFFSET');
	});

	test('Time-based snippet variables resolve to the same values even as time progresses', async function () {
		const snippetText = `
			$CURRENT_YEAR
			$CURRENT_YEAR_SHORT
			$CURRENT_MONTH
			$CURRENT_DATE
			$CURRENT_HOUR
			$CURRENT_MINUTE
			$CURRENT_SECOND
			$CURRENT_DAY_NAME
			$CURRENT_DAY_NAME_SHORT
			$CURRENT_MONTH_NAME
			$CURRENT_MONTH_NAME_SHORT
			$CURRENT_SECONDS_UNIX
			$CURRENT_TIMEZONE_OFFSET
		`;

		const clock = sinon.useFakeTimers();
		try {
			const resolver = new TimeBasedVariableResolver;

			const firstResolve = new SnippetParser().parse(snippetText).resolveVariables(resolver);
			clock.tick((365 * 24 * 3600 * 1000) + (24 * 3600 * 1000) + (3661 * 1000));  // 1 year + 1 day + 1 hour + 1 minute + 1 second
			const secondResolve = new SnippetParser().parse(snippetText).resolveVariables(resolver);

			assert.strictEqual(firstResolve.toString(), secondResolve.toString(), `Time-based snippet variables resolved differently`);
		} finally {
			clock.restore();
		}
	});

	test('creating snippet - format-condition doesn\'t work #53617', function () {

		const snippet = new SnippetParser().parse('${TM_LINE_NUMBER/(10)/${1:?It is:It is not}/} line 10', true);
		snippet.resolveVariables({ resolve() { return '10'; } });
		assert.strictEqual(snippet.toString(), 'It is line 10');

		snippet.resolveVariables({ resolve() { return '11'; } });
		assert.strictEqual(snippet.toString(), 'It is not line 10');
	});

	test('Add workspace name and folder variables for snippets #68261', function () {

		let workspace: IWorkspace;
		const workspaceService = new class implements IWorkspaceContextService {
			declare readonly _serviceBrand: undefined;
			_throw = () => { throw new Error(); };
			onDidChangeWorkbenchState = this._throw;
			onDidChangeWorkspaceName = this._throw;
			onWillChangeWorkspaceFolders = this._throw;
			onDidChangeWorkspaceFolders = this._throw;
			getCompleteWorkspace = this._throw;
			getWorkspace(): IWorkspace { return workspace; }
			getWorkbenchState = this._throw;
			getWorkspaceFolder = this._throw;
			isCurrentWorkspace = this._throw;
			isInsideWorkspace = this._throw;
		};

		const resolver = new WorkspaceBasedVariableResolver(workspaceService);

		// empty workspace
		workspace = new Workspace('');
		assertVariableResolve(resolver, 'WORKSPACE_NAME', undefined);
		assertVariableResolve(resolver, 'WORKSPACE_FOLDER', undefined);

		// single folder workspace without config
		workspace = new Workspace('', [toWorkspaceFolder(URI.file('/folderName'))]);
		assertVariableResolve(resolver, 'WORKSPACE_NAME', 'folderName');
		if (!isWindows) {
			assertVariableResolve(resolver, 'WORKSPACE_FOLDER', '/folderName');
		}

		// workspace with config
		const workspaceConfigPath = URI.file('testWorkspace.code-workspace');
		workspace = new Workspace('', toWorkspaceFolders([{ path: 'folderName' }], workspaceConfigPath, extUriBiasedIgnorePathCase), workspaceConfigPath);
		assertVariableResolve(resolver, 'WORKSPACE_NAME', 'testWorkspace');
		if (!isWindows) {
			assertVariableResolve(resolver, 'WORKSPACE_FOLDER', '/');
		}
	});

	test('Add RELATIVE_FILEPATH snippet variable #114208', function () {

		let resolver: VariableResolver;

		// Mock a label service (only coded for file uris)
		const workspaceLabelService = ((rootPath: string): ILabelService => {
			const labelService = new class extends mock<ILabelService>() {
				override getUriLabel(uri: URI, options: { relative?: boolean } = {}) {
					const rootFsPath = URI.file(rootPath).fsPath + sep;
					const fsPath = uri.fsPath;
					if (options.relative && rootPath && fsPath.startsWith(rootFsPath)) {
						return fsPath.substring(rootFsPath.length);
					}
					return fsPath;
				}
			};
			return labelService;
		});

		const model = createTextModel('', undefined, undefined, URI.parse('file:///foo/files/text.txt'));

		// empty workspace
		resolver = new ModelBasedVariableResolver(
			workspaceLabelService(''),
			model
		);

		if (!isWindows) {
			assertVariableResolve(resolver, 'RELATIVE_FILEPATH', '/foo/files/text.txt');
		} else {
			assertVariableResolve(resolver, 'RELATIVE_FILEPATH', '\\foo\\files\\text.txt');
		}

		// single folder workspace
		resolver = new ModelBasedVariableResolver(
			workspaceLabelService('/foo'),
			model
		);
		if (!isWindows) {
			assertVariableResolve(resolver, 'RELATIVE_FILEPATH', 'files/text.txt');
		} else {
			assertVariableResolve(resolver, 'RELATIVE_FILEPATH', 'files\\text.txt');
		}

		model.dispose();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/stickyScroll/browser/stickyScroll.css]---
Location: vscode-main/src/vs/editor/contrib/stickyScroll/browser/stickyScroll.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .sticky-widget {
	overflow: hidden;
	border-bottom: 1px solid var(--vscode-editorStickyScroll-border);
	width: 100%;
	box-shadow: var(--vscode-editorStickyScroll-shadow) 0 4px 2px -2px;
	z-index: 4;
	right: initial !important;
	margin-left: '0px';
}

.monaco-editor .sticky-widget .sticky-widget-line-numbers {
	float: left;
	background-color: var(--vscode-editorStickyScrollGutter-background);
}

.monaco-editor .sticky-widget.peek .sticky-widget-line-numbers {
	background-color: var(--vscode-peekViewEditorStickyScrollGutter-background);
}

.monaco-editor .sticky-widget .sticky-widget-lines-scrollable {
	display: inline-block;
	position: absolute;
	overflow: hidden;
	width: var(--vscode-editorStickyScroll-scrollableWidth);
	background-color: var(--vscode-editorStickyScroll-background);
}

.monaco-editor .sticky-widget.peek .sticky-widget-lines-scrollable {
	background-color: var(--vscode-peekViewEditorStickyScroll-background);
}

.monaco-editor .sticky-widget .sticky-widget-lines {
	position: absolute;
	background-color: inherit;
}

.monaco-editor .sticky-widget .sticky-line-number,
.monaco-editor .sticky-widget .sticky-line-content {
	color: var(--vscode-editorLineNumber-foreground);
	white-space: nowrap;
	display: inline-block;
	position: absolute;
	background-color: inherit;
}

.monaco-editor .sticky-widget .sticky-line-number .codicon-folding-expanded,
.monaco-editor .sticky-widget .sticky-line-number .codicon-folding-collapsed {
	float: right;
	transition: var(--vscode-editorStickyScroll-foldingOpacityTransition);
	position: absolute;
	margin-left: 2px;
}

.monaco-editor .sticky-widget .sticky-line-content {
	width: var(--vscode-editorStickyScroll-scrollableWidth);
	background-color: inherit;
	white-space: nowrap;
}

.monaco-editor .sticky-widget .sticky-line-number-inner {
	display: inline-block;
	text-align: right;
}

.monaco-editor .sticky-widget .sticky-line-content:hover {
	background-color: var(--vscode-editorStickyScrollHover-background);
	cursor: pointer;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/stickyScroll/browser/stickyScrollActions.ts]---
Location: vscode-main/src/vs/editor/contrib/stickyScroll/browser/stickyScrollActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode } from '../../../../base/common/keyCodes.js';
import { EditorAction2, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { localize, localize2 } from '../../../../nls.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { StickyScrollController } from './stickyScrollController.js';

export class ToggleStickyScroll extends EditorAction2 {

	constructor() {
		super({
			id: 'editor.action.toggleStickyScroll',
			title: {
				...localize2('toggleEditorStickyScroll', "Toggle Editor Sticky Scroll"),
				mnemonicTitle: localize({ key: 'mitoggleStickyScroll', comment: ['&& denotes a mnemonic'] }, "&&Toggle Editor Sticky Scroll"),
			},
			metadata: {
				description: localize2('toggleEditorStickyScroll.description', "Toggle/enable the editor sticky scroll which shows the nested scopes at the top of the viewport"),
			},
			category: Categories.View,
			toggled: {
				condition: ContextKeyExpr.equals('config.editor.stickyScroll.enabled', true),
				title: localize('stickyScroll', "Sticky Scroll"),
				mnemonicTitle: localize({ key: 'miStickyScroll', comment: ['&& denotes a mnemonic'] }, "&&Sticky Scroll"),
			},
			menu: [
				{ id: MenuId.CommandPalette },
				{ id: MenuId.MenubarAppearanceMenu, group: '4_editor', order: 3 },
				{ id: MenuId.StickyScrollContext }
			]
		});
	}

	async runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);
		const newValue = !configurationService.getValue('editor.stickyScroll.enabled');
		const isFocused = StickyScrollController.get(editor)?.isFocused();
		configurationService.updateValue('editor.stickyScroll.enabled', newValue);
		if (isFocused) {
			editor.focus();
		}
	}
}

const weight = KeybindingWeight.EditorContrib;

export class FocusStickyScroll extends EditorAction2 {

	constructor() {
		super({
			id: 'editor.action.focusStickyScroll',
			title: {
				...localize2('focusStickyScroll', "Focus Editor Sticky Scroll"),
				mnemonicTitle: localize({ key: 'mifocusEditorStickyScroll', comment: ['&& denotes a mnemonic'] }, "&&Focus Editor Sticky Scroll"),
			},
			precondition: ContextKeyExpr.and(ContextKeyExpr.has('config.editor.stickyScroll.enabled'), EditorContextKeys.stickyScrollVisible),
			menu: [
				{ id: MenuId.CommandPalette },
			]
		});
	}

	runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor) {
		StickyScrollController.get(editor)?.focus();
	}
}

export class SelectNextStickyScrollLine extends EditorAction2 {
	constructor() {
		super({
			id: 'editor.action.selectNextStickyScrollLine',
			title: localize2('selectNextStickyScrollLine.title', "Select the next editor sticky scroll line"),
			precondition: EditorContextKeys.stickyScrollFocused.isEqualTo(true),
			keybinding: {
				weight,
				primary: KeyCode.DownArrow
			}
		});
	}

	runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor) {
		StickyScrollController.get(editor)?.focusNext();
	}
}

export class SelectPreviousStickyScrollLine extends EditorAction2 {
	constructor() {
		super({
			id: 'editor.action.selectPreviousStickyScrollLine',
			title: localize2('selectPreviousStickyScrollLine.title', "Select the previous sticky scroll line"),
			precondition: EditorContextKeys.stickyScrollFocused.isEqualTo(true),
			keybinding: {
				weight,
				primary: KeyCode.UpArrow
			}
		});
	}

	runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor) {
		StickyScrollController.get(editor)?.focusPrevious();
	}
}

export class GoToStickyScrollLine extends EditorAction2 {
	constructor() {
		super({
			id: 'editor.action.goToFocusedStickyScrollLine',
			title: localize2('goToFocusedStickyScrollLine.title', "Go to the focused sticky scroll line"),
			precondition: EditorContextKeys.stickyScrollFocused.isEqualTo(true),
			keybinding: {
				weight,
				primary: KeyCode.Enter
			}
		});
	}

	runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor) {
		StickyScrollController.get(editor)?.goToFocused();
	}
}

export class SelectEditor extends EditorAction2 {

	constructor() {
		super({
			id: 'editor.action.selectEditor',
			title: localize2('selectEditor.title', "Select Editor"),
			precondition: EditorContextKeys.stickyScrollFocused.isEqualTo(true),
			keybinding: {
				weight,
				primary: KeyCode.Escape
			}
		});
	}

	runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor) {
		StickyScrollController.get(editor)?.selectEditor();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/stickyScroll/browser/stickyScrollContribution.ts]---
Location: vscode-main/src/vs/editor/contrib/stickyScroll/browser/stickyScrollContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EditorContributionInstantiation, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { ToggleStickyScroll, FocusStickyScroll, SelectEditor, SelectPreviousStickyScrollLine, SelectNextStickyScrollLine, GoToStickyScrollLine } from './stickyScrollActions.js';
import { StickyScrollController } from './stickyScrollController.js';
import { registerAction2 } from '../../../../platform/actions/common/actions.js';

registerEditorContribution(StickyScrollController.ID, StickyScrollController, EditorContributionInstantiation.AfterFirstRender);
registerAction2(ToggleStickyScroll);
registerAction2(FocusStickyScroll);
registerAction2(SelectPreviousStickyScrollLine);
registerAction2(SelectNextStickyScrollLine);
registerAction2(GoToStickyScrollLine);
registerAction2(SelectEditor);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/stickyScroll/browser/stickyScrollController.ts]---
Location: vscode-main/src/vs/editor/contrib/stickyScroll/browser/stickyScrollController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable, Disposable, DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditor, MouseTargetType } from '../../../browser/editorBrowser.js';
import { IEditorContribution, ScrollType } from '../../../common/editorCommon.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { EditorOption, RenderLineNumbersType, ConfigurationChangedEvent } from '../../../common/config/editorOptions.js';
import { StickyScrollWidget, StickyScrollWidgetState } from './stickyScrollWidget.js';
import { IStickyLineCandidateProvider, StickyLineCandidateProvider } from './stickyScrollProvider.js';
import { IModelTokensChangedEvent } from '../../../common/textModelEvents.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { ClickLinkGesture, ClickLinkMouseEvent } from '../../gotoSymbol/browser/link/clickLinkGesture.js';
import { IRange, Range } from '../../../common/core/range.js';
import { getDefinitionsAtPosition } from '../../gotoSymbol/browser/goToSymbol.js';
import { goToDefinitionWithLocation } from '../../inlayHints/browser/inlayHintsLocations.js';
import { IPosition, Position } from '../../../common/core/position.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { ILanguageFeatureDebounceService } from '../../../common/services/languageFeatureDebounce.js';
import * as dom from '../../../../base/browser/dom.js';
import { StickyRange } from './stickyScrollElement.js';
import { IMouseEvent, StandardMouseEvent } from '../../../../base/browser/mouseEvent.js';
import { FoldingController } from '../../folding/browser/folding.js';
import { FoldingModel, toggleCollapseState } from '../../folding/browser/foldingModel.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { mainWindow } from '../../../../base/browser/window.js';

export interface IStickyScrollController {
	get stickyScrollCandidateProvider(): IStickyLineCandidateProvider;
	get stickyScrollWidgetState(): StickyScrollWidgetState;
	readonly stickyScrollWidgetHeight: number;
	isFocused(): boolean;
	focus(): void;
	focusNext(): void;
	focusPrevious(): void;
	goToFocused(): void;
	findScrollWidgetState(): StickyScrollWidgetState;
	dispose(): void;
	selectEditor(): void;
	readonly onDidChangeStickyScrollHeight: Event<{ height: number }>;
}

export class StickyScrollController extends Disposable implements IEditorContribution, IStickyScrollController {

	static readonly ID = 'store.contrib.stickyScrollController';

	private readonly _stickyScrollWidget: StickyScrollWidget;
	private readonly _stickyLineCandidateProvider: IStickyLineCandidateProvider;
	private readonly _sessionStore: DisposableStore = new DisposableStore();

	private _widgetState: StickyScrollWidgetState;
	private _foldingModel: FoldingModel | undefined;
	private _maxStickyLines: number = Number.MAX_SAFE_INTEGER;

	private _stickyRangeProjectedOnEditor: IRange | undefined;
	private _candidateDefinitionsLength: number = -1;

	private _stickyScrollFocusedContextKey: IContextKey<boolean>;
	private _stickyScrollVisibleContextKey: IContextKey<boolean>;

	private _focusDisposableStore: DisposableStore | undefined;
	private _focusedStickyElementIndex: number = -1;
	private _enabled = false;
	private _focused = false;
	private _positionRevealed = false;
	private _onMouseDown = false;
	private _endLineNumbers: number[] = [];
	private _showEndForLine: number | undefined;
	private _minRebuildFromLine: number | undefined;
	private _mouseTarget: EventTarget | null = null;
	private _cursorPositionListener: IDisposable | undefined;

	private readonly _onDidChangeStickyScrollHeight = this._register(new Emitter<{ height: number }>());
	public readonly onDidChangeStickyScrollHeight = this._onDidChangeStickyScrollHeight.event;

	constructor(
		private readonly _editor: ICodeEditor,
		@IContextMenuService private readonly _contextMenuService: IContextMenuService,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
		@IInstantiationService private readonly _instaService: IInstantiationService,
		@ILanguageConfigurationService _languageConfigurationService: ILanguageConfigurationService,
		@ILanguageFeatureDebounceService _languageFeatureDebounceService: ILanguageFeatureDebounceService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService
	) {
		super();
		this._stickyScrollWidget = new StickyScrollWidget(this._editor);
		this._stickyLineCandidateProvider = new StickyLineCandidateProvider(this._editor, _languageFeaturesService, _languageConfigurationService);
		this._register(this._stickyScrollWidget);
		this._register(this._stickyLineCandidateProvider);

		this._widgetState = StickyScrollWidgetState.Empty;
		const stickyScrollDomNode = this._stickyScrollWidget.getDomNode();
		this._register(this._editor.onDidChangeLineHeight((e) => {
			e.changes.forEach((change) => {
				const lineNumber = change.lineNumber;
				if (this._widgetState.startLineNumbers.includes(lineNumber)) {
					this._renderStickyScroll(lineNumber);
				}
			});
		}));
		this._register(this._editor.onDidChangeFont((e) => {
			e.changes.forEach((change) => {
				const lineNumber = change.lineNumber;
				if (this._widgetState.startLineNumbers.includes(lineNumber)) {
					this._renderStickyScroll(lineNumber);
				}
			});
		}));
		this._register(this._editor.onDidChangeConfiguration(e => {
			this._readConfigurationChange(e);
		}));
		this._register(dom.addDisposableListener(stickyScrollDomNode, dom.EventType.CONTEXT_MENU, async (event: MouseEvent) => {
			this._onContextMenu(dom.getWindow(stickyScrollDomNode), event);
		}));
		this._stickyScrollFocusedContextKey = EditorContextKeys.stickyScrollFocused.bindTo(this._contextKeyService);
		this._stickyScrollVisibleContextKey = EditorContextKeys.stickyScrollVisible.bindTo(this._contextKeyService);
		const focusTracker = this._register(dom.trackFocus(stickyScrollDomNode));
		this._register(focusTracker.onDidBlur(_ => {
			// Suppose that the blurring is caused by scrolling, then keep the focus on the sticky scroll
			// This is determined by the fact that the height of the widget has become zero and there has been no position revealing
			if (this._positionRevealed === false && stickyScrollDomNode.clientHeight === 0) {
				this._focusedStickyElementIndex = -1;
				this.focus();

			}
			// In all other casees, dispose the focus on the sticky scroll
			else {
				this._disposeFocusStickyScrollStore();
			}
		}));
		this._register(focusTracker.onDidFocus(_ => {
			this.focus();
		}));
		this._registerMouseListeners();
		// Suppose that mouse down on the sticky scroll, then do not focus on the sticky scroll because this will be followed by the revealing of a position
		this._register(dom.addDisposableListener(stickyScrollDomNode, dom.EventType.MOUSE_DOWN, (e) => {
			this._onMouseDown = true;
		}));
		this._register(this._stickyScrollWidget.onDidChangeStickyScrollHeight((e) => {
			this._onDidChangeStickyScrollHeight.fire(e);
		}));
		this._onDidResize();
		this._readConfiguration();
	}

	get stickyScrollCandidateProvider(): IStickyLineCandidateProvider {
		return this._stickyLineCandidateProvider;
	}

	get stickyScrollWidgetState(): StickyScrollWidgetState {
		return this._widgetState;
	}

	get stickyScrollWidgetHeight(): number {
		return this._stickyScrollWidget.height;
	}

	public static get(editor: ICodeEditor): IStickyScrollController | null {
		return editor.getContribution<StickyScrollController>(StickyScrollController.ID);
	}

	private _disposeFocusStickyScrollStore() {
		this._stickyScrollFocusedContextKey.set(false);
		this._focusDisposableStore?.dispose();
		this._focused = false;
		this._positionRevealed = false;
		this._onMouseDown = false;
	}

	public isFocused(): boolean {
		return this._focused;
	}

	public focus(): void {
		// If the mouse is down, do not focus on the sticky scroll
		if (this._onMouseDown) {
			this._onMouseDown = false;
			this._editor.focus();
			return;
		}
		const focusState = this._stickyScrollFocusedContextKey.get();
		if (focusState === true) {
			return;
		}
		this._focused = true;
		this._focusDisposableStore = new DisposableStore();
		this._stickyScrollFocusedContextKey.set(true);
		this._focusedStickyElementIndex = this._stickyScrollWidget.lineNumbers.length - 1;
		this._stickyScrollWidget.focusLineWithIndex(this._focusedStickyElementIndex);
	}

	public focusNext(): void {
		if (this._focusedStickyElementIndex < this._stickyScrollWidget.lineNumberCount - 1) {
			this._focusNav(true);
		}
	}

	public focusPrevious(): void {
		if (this._focusedStickyElementIndex > 0) {
			this._focusNav(false);
		}
	}

	public selectEditor(): void {
		this._editor.focus();
	}

	// True is next, false is previous
	private _focusNav(direction: boolean): void {
		this._focusedStickyElementIndex = direction ? this._focusedStickyElementIndex + 1 : this._focusedStickyElementIndex - 1;
		this._stickyScrollWidget.focusLineWithIndex(this._focusedStickyElementIndex);
	}

	public goToFocused(): void {
		const lineNumbers = this._stickyScrollWidget.lineNumbers;
		this._disposeFocusStickyScrollStore();
		this._revealPosition({ lineNumber: lineNumbers[this._focusedStickyElementIndex], column: 1 });
	}

	private _revealPosition(position: IPosition): void {
		this._reveaInEditor(position, () => this._editor.revealPosition(position));
	}

	private _revealLineInCenterIfOutsideViewport(position: IPosition): void {
		this._reveaInEditor(position, () => this._editor.revealLineInCenterIfOutsideViewport(position.lineNumber, ScrollType.Smooth));
	}

	private _reveaInEditor(position: IPosition, revealFunction: () => void): void {
		if (this._focused) {
			this._disposeFocusStickyScrollStore();
		}
		this._positionRevealed = true;
		revealFunction();
		this._editor.setSelection(Range.fromPositions(position));
		this._editor.focus();
	}

	private _registerMouseListeners(): void {

		const sessionStore = this._register(new DisposableStore());
		const gesture = this._register(new ClickLinkGesture(this._editor, {
			extractLineNumberFromMouseEvent: (e) => {
				const position = this._stickyScrollWidget.getEditorPositionFromNode(e.target.element);
				return position ? position.lineNumber : 0;
			}
		}));

		const getMouseEventTarget = (mouseEvent: ClickLinkMouseEvent): { range: Range; textElement: HTMLElement } | null => {
			if (!this._editor.hasModel()) {
				return null;
			}
			if (mouseEvent.target.type !== MouseTargetType.OVERLAY_WIDGET || mouseEvent.target.detail !== this._stickyScrollWidget.getId()) {
				// not hovering over our widget
				return null;
			}
			const mouseTargetElement = mouseEvent.target.element;
			if (!mouseTargetElement || mouseTargetElement.innerText !== mouseTargetElement.innerHTML) {
				// not on a span element rendering text
				return null;
			}
			const position = this._stickyScrollWidget.getEditorPositionFromNode(mouseTargetElement);
			if (!position) {
				// not hovering a sticky scroll line
				return null;
			}
			return {
				range: new Range(position.lineNumber, position.column, position.lineNumber, position.column + mouseTargetElement.innerText.length),
				textElement: mouseTargetElement
			};
		};

		const stickyScrollWidgetDomNode = this._stickyScrollWidget.getDomNode();
		this._register(dom.addStandardDisposableListener(stickyScrollWidgetDomNode, dom.EventType.CLICK, (mouseEvent: IMouseEvent) => {
			if (mouseEvent.ctrlKey || mouseEvent.altKey || mouseEvent.metaKey) {
				// modifier pressed
				return;
			}
			if (!mouseEvent.leftButton) {
				// not left click
				return;
			}
			if (mouseEvent.shiftKey) {
				// shift click
				const lineIndex = this._stickyScrollWidget.getLineIndexFromChildDomNode(mouseEvent.target);
				if (lineIndex === null) {
					return;
				}
				const position = new Position(this._endLineNumbers[lineIndex], 1);
				this._revealLineInCenterIfOutsideViewport(position);
				return;
			}
			const isInFoldingIconDomNode = this._stickyScrollWidget.isInFoldingIconDomNode(mouseEvent.target);
			if (isInFoldingIconDomNode) {
				// clicked on folding icon
				const lineNumber = this._stickyScrollWidget.getLineNumberFromChildDomNode(mouseEvent.target);
				this._toggleFoldingRegionForLine(lineNumber);
				return;
			}
			const isInStickyLine = this._stickyScrollWidget.isInStickyLine(mouseEvent.target);
			if (!isInStickyLine) {
				return;
			}
			// normal click
			let position = this._stickyScrollWidget.getEditorPositionFromNode(mouseEvent.target);
			if (!position) {
				const lineNumber = this._stickyScrollWidget.getLineNumberFromChildDomNode(mouseEvent.target);
				if (lineNumber === null) {
					// not hovering a sticky scroll line
					return;
				}
				position = new Position(lineNumber, 1);
			}
			this._revealPosition(position);
		}));
		this._register(dom.addDisposableListener(mainWindow, dom.EventType.MOUSE_MOVE, mouseEvent => {
			this._mouseTarget = mouseEvent.target;
			this._onMouseMoveOrKeyDown(mouseEvent);
		}));
		this._register(dom.addDisposableListener(mainWindow, dom.EventType.KEY_DOWN, mouseEvent => {
			this._onMouseMoveOrKeyDown(mouseEvent);
		}));
		this._register(dom.addDisposableListener(mainWindow, dom.EventType.KEY_UP, () => {
			if (this._showEndForLine !== undefined) {
				this._showEndForLine = undefined;
				this._renderStickyScroll();
			}
		}));

		this._register(gesture.onMouseMoveOrRelevantKeyDown(([mouseEvent, _keyboardEvent]) => {
			const mouseTarget = getMouseEventTarget(mouseEvent);
			if (!mouseTarget || !mouseEvent.hasTriggerModifier || !this._editor.hasModel()) {
				sessionStore.clear();
				return;
			}
			const { range, textElement } = mouseTarget;

			if (!range.equalsRange(this._stickyRangeProjectedOnEditor)) {
				this._stickyRangeProjectedOnEditor = range;
				sessionStore.clear();
			} else if (textElement.style.textDecoration === 'underline') {
				return;
			}

			const cancellationToken = new CancellationTokenSource();
			sessionStore.add(toDisposable(() => cancellationToken.dispose(true)));

			let currentHTMLChild: HTMLElement;

			getDefinitionsAtPosition(this._languageFeaturesService.definitionProvider, this._editor.getModel(), new Position(range.startLineNumber, range.startColumn + 1), false, cancellationToken.token).then((candidateDefinitions => {
				if (cancellationToken.token.isCancellationRequested) {
					return;
				}
				if (candidateDefinitions.length !== 0) {
					this._candidateDefinitionsLength = candidateDefinitions.length;
					const childHTML: HTMLElement = textElement;
					if (currentHTMLChild !== childHTML) {
						sessionStore.clear();
						currentHTMLChild = childHTML;
						currentHTMLChild.style.textDecoration = 'underline';
						sessionStore.add(toDisposable(() => {
							currentHTMLChild.style.textDecoration = 'none';
						}));
					} else if (!currentHTMLChild) {
						currentHTMLChild = childHTML;
						currentHTMLChild.style.textDecoration = 'underline';
						sessionStore.add(toDisposable(() => {
							currentHTMLChild.style.textDecoration = 'none';
						}));
					}
				} else {
					sessionStore.clear();
				}
			}));
		}));
		this._register(gesture.onCancel(() => {
			sessionStore.clear();
		}));
		this._register(gesture.onExecute(async e => {
			if (e.target.type !== MouseTargetType.OVERLAY_WIDGET || e.target.detail !== this._stickyScrollWidget.getId()) {
				// not hovering over our widget
				return;
			}
			const position = this._stickyScrollWidget.getEditorPositionFromNode(e.target.element);
			if (!position) {
				// not hovering a sticky scroll line
				return;
			}
			if (!this._editor.hasModel() || !this._stickyRangeProjectedOnEditor) {
				return;
			}
			if (this._candidateDefinitionsLength > 1) {
				if (this._focused) {
					this._disposeFocusStickyScrollStore();
				}
				this._revealPosition({ lineNumber: position.lineNumber, column: 1 });
			}
			this._instaService.invokeFunction(goToDefinitionWithLocation, e, this._editor, { uri: this._editor.getModel().uri, range: this._stickyRangeProjectedOnEditor });
		}));
	}

	private _onContextMenu(targetWindow: Window, e: MouseEvent) {
		const event = new StandardMouseEvent(targetWindow, e);

		this._contextMenuService.showContextMenu({
			menuId: MenuId.StickyScrollContext,
			getAnchor: () => event,
		});
	}

	private _onMouseMoveOrKeyDown(mouseEvent: KeyboardEvent | MouseEvent): void {
		if (!mouseEvent.shiftKey) {
			return;
		}
		if (!this._mouseTarget || !dom.isHTMLElement(this._mouseTarget)) {
			return;
		}
		const currentEndForLineIndex = this._stickyScrollWidget.getLineIndexFromChildDomNode(this._mouseTarget);
		if (currentEndForLineIndex === null || this._showEndForLine === currentEndForLineIndex) {
			return;
		}
		this._showEndForLine = currentEndForLineIndex;
		this._renderStickyScroll();
	}

	private _toggleFoldingRegionForLine(line: number | null) {
		if (!this._foldingModel || line === null) {
			return;
		}
		const stickyLine = this._stickyScrollWidget.getRenderedStickyLine(line);
		const foldingIcon = stickyLine?.foldingIcon;
		if (!foldingIcon) {
			return;
		}
		toggleCollapseState(this._foldingModel, 1, [line]);
		foldingIcon.isCollapsed = !foldingIcon.isCollapsed;
		const scrollTop = (foldingIcon.isCollapsed ?
			this._editor.getTopForLineNumber(foldingIcon.foldingEndLine)
			: this._editor.getTopForLineNumber(foldingIcon.foldingStartLine))
			- this._editor.getOption(EditorOption.lineHeight) * stickyLine.index + 1;
		this._editor.setScrollTop(scrollTop);
		this._renderStickyScroll(line);
	}

	private _readConfiguration() {
		const options = this._editor.getOption(EditorOption.stickyScroll);
		if (options.enabled === false) {
			this._editor.removeOverlayWidget(this._stickyScrollWidget);
			this._resetState();
			this._sessionStore.clear();
			this._enabled = false;
			return;
		} else if (options.enabled && !this._enabled) {
			// When sticky scroll was just enabled, add the listeners on the sticky scroll
			this._editor.addOverlayWidget(this._stickyScrollWidget);
			this._sessionStore.add(this._editor.onDidScrollChange((e) => {
				if (e.scrollTopChanged) {
					this._showEndForLine = undefined;
					this._renderStickyScroll();
				}
			}));
			this._sessionStore.add(this._editor.onDidLayoutChange(() => this._onDidResize()));
			this._sessionStore.add(this._editor.onDidChangeModelTokens((e) => this._onTokensChange(e)));
			this._sessionStore.add(this._stickyLineCandidateProvider.onDidChangeStickyScroll(() => {
				this._showEndForLine = undefined;
				this._renderStickyScroll();
			}));
			this._enabled = true;
		}

		const lineNumberOption = this._editor.getOption(EditorOption.lineNumbers);
		if (lineNumberOption.renderType === RenderLineNumbersType.Relative) {
			if (!this._cursorPositionListener) {
				this._cursorPositionListener = this._editor.onDidChangeCursorPosition(() => {
					this._showEndForLine = undefined;
					this._renderStickyScroll(0);
				});
				this._sessionStore.add(this._cursorPositionListener);
			}
		} else if (this._cursorPositionListener) {
			this._sessionStore.delete(this._cursorPositionListener);
			this._cursorPositionListener.dispose();
			this._cursorPositionListener = undefined;
		}
	}

	private _readConfigurationChange(event: ConfigurationChangedEvent) {
		if (
			event.hasChanged(EditorOption.stickyScroll)
			|| event.hasChanged(EditorOption.minimap)
			|| event.hasChanged(EditorOption.lineHeight)
			|| event.hasChanged(EditorOption.showFoldingControls)
			|| event.hasChanged(EditorOption.lineNumbers)
		) {
			this._readConfiguration();
		}

		if (event.hasChanged(EditorOption.lineNumbers) || event.hasChanged(EditorOption.folding) || event.hasChanged(EditorOption.showFoldingControls)) {
			this._renderStickyScroll(0);
		}
	}

	private _needsUpdate(event: IModelTokensChangedEvent) {
		const stickyLineNumbers = this._stickyScrollWidget.getCurrentLines();
		for (const stickyLineNumber of stickyLineNumbers) {
			for (const range of event.ranges) {
				if (stickyLineNumber >= range.fromLineNumber && stickyLineNumber <= range.toLineNumber) {
					return true;
				}
			}
		}
		return false;
	}

	private _onTokensChange(event: IModelTokensChangedEvent) {
		if (this._needsUpdate(event)) {
			// Rebuilding the whole widget from line 0
			this._renderStickyScroll(0);
		}
	}

	private _onDidResize() {
		const layoutInfo = this._editor.getLayoutInfo();
		// Make sure sticky scroll doesn't take up more than 25% of the editor
		const theoreticalLines = layoutInfo.height / this._editor.getOption(EditorOption.lineHeight);
		this._maxStickyLines = Math.round(theoreticalLines * .25);
		this._renderStickyScroll(0);
	}

	private async _renderStickyScroll(rebuildFromLine?: number): Promise<void> {
		const model = this._editor.getModel();
		if (!model || model.isTooLargeForTokenization()) {
			this._resetState();
			return;
		}
		const nextRebuildFromLine = this._updateAndGetMinRebuildFromLine(rebuildFromLine);
		const stickyWidgetVersion = this._stickyLineCandidateProvider.getVersionId();
		const shouldUpdateState = stickyWidgetVersion === undefined || stickyWidgetVersion === model.getVersionId();
		if (shouldUpdateState) {
			if (!this._focused) {
				await this._updateState(nextRebuildFromLine);
			} else {
				// Suppose that previously the sticky scroll widget had height 0, then if there are visible lines, set the last line as focused
				if (this._focusedStickyElementIndex === -1) {
					await this._updateState(nextRebuildFromLine);
					this._focusedStickyElementIndex = this._stickyScrollWidget.lineNumberCount - 1;
					if (this._focusedStickyElementIndex !== -1) {
						this._stickyScrollWidget.focusLineWithIndex(this._focusedStickyElementIndex);
					}
				} else {
					const focusedStickyElementLineNumber = this._stickyScrollWidget.lineNumbers[this._focusedStickyElementIndex];
					await this._updateState(nextRebuildFromLine);
					// Suppose that after setting the state, there are no sticky lines, set the focused index to -1
					if (this._stickyScrollWidget.lineNumberCount === 0) {
						this._focusedStickyElementIndex = -1;
					} else {
						const previousFocusedLineNumberExists = this._stickyScrollWidget.lineNumbers.includes(focusedStickyElementLineNumber);

						// If the line number is still there, do not change anything
						// If the line number is not there, set the new focused line to be the last line
						if (!previousFocusedLineNumberExists) {
							this._focusedStickyElementIndex = this._stickyScrollWidget.lineNumberCount - 1;
						}
						this._stickyScrollWidget.focusLineWithIndex(this._focusedStickyElementIndex);
					}
				}
			}
		}
	}

	private _updateAndGetMinRebuildFromLine(rebuildFromLine: number | undefined): number | undefined {
		if (rebuildFromLine !== undefined) {
			const minRebuildFromLineOrInfinity = this._minRebuildFromLine !== undefined ? this._minRebuildFromLine : Infinity;
			this._minRebuildFromLine = Math.min(rebuildFromLine, minRebuildFromLineOrInfinity);
		}
		return this._minRebuildFromLine;
	}

	private async _updateState(rebuildFromLine?: number): Promise<void> {
		this._minRebuildFromLine = undefined;
		this._foldingModel = await FoldingController.get(this._editor)?.getFoldingModel() ?? undefined;
		this._widgetState = this.findScrollWidgetState();
		const stickyWidgetHasLines = this._widgetState.startLineNumbers.length > 0;
		this._stickyScrollVisibleContextKey.set(stickyWidgetHasLines);
		this._stickyScrollWidget.setState(this._widgetState, this._foldingModel, rebuildFromLine);
	}

	private async _resetState(): Promise<void> {
		this._minRebuildFromLine = undefined;
		this._foldingModel = undefined;
		this._widgetState = StickyScrollWidgetState.Empty;
		this._stickyScrollVisibleContextKey.set(false);
		this._stickyScrollWidget.setState(undefined, undefined);
	}

	findScrollWidgetState(): StickyScrollWidgetState {
		const maxNumberStickyLines = Math.min(this._maxStickyLines, this._editor.getOption(EditorOption.stickyScroll).maxLineCount);
		const scrollTop: number = this._editor.getScrollTop();
		let lastLineRelativePosition: number = 0;
		const startLineNumbers: number[] = [];
		const endLineNumbers: number[] = [];
		const arrayVisibleRanges = this._editor.getVisibleRanges();
		if (arrayVisibleRanges.length !== 0) {
			const fullVisibleRange = new StickyRange(arrayVisibleRanges[0].startLineNumber, arrayVisibleRanges[arrayVisibleRanges.length - 1].endLineNumber);
			const candidateRanges = this._stickyLineCandidateProvider.getCandidateStickyLinesIntersecting(fullVisibleRange);
			for (const range of candidateRanges) {
				const start = range.startLineNumber;
				const end = range.endLineNumber;
				const topOfElement = range.top;
				const bottomOfElement = topOfElement + range.height;
				const topOfBeginningLine = this._editor.getTopForLineNumber(start) - scrollTop;
				const bottomOfEndLine = this._editor.getBottomForLineNumber(end) - scrollTop;
				if (topOfElement > topOfBeginningLine && topOfElement <= bottomOfEndLine) {
					startLineNumbers.push(start);
					endLineNumbers.push(end + 1);
					if (bottomOfElement > bottomOfEndLine) {
						lastLineRelativePosition = bottomOfEndLine - bottomOfElement;
					}
				}
				if (startLineNumbers.length === maxNumberStickyLines) {
					break;
				}
			}
		}
		this._endLineNumbers = endLineNumbers;
		return new StickyScrollWidgetState(startLineNumbers, endLineNumbers, lastLineRelativePosition, this._showEndForLine);
	}

	override dispose(): void {
		super.dispose();
		this._sessionStore.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/stickyScroll/browser/stickyScrollElement.ts]---
Location: vscode-main/src/vs/editor/contrib/stickyScroll/browser/stickyScrollElement.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';

export class StickyRange {
	constructor(
		public readonly startLineNumber: number,
		public readonly endLineNumber: number
	) { }
}

export class StickyElement {

	constructor(
		/**
		 * Range of line numbers spanned by the current scope
		 */
		public readonly range: StickyRange | undefined,
		/**
		 * Must be sorted by start line number
		*/
		public readonly children: StickyElement[],
		/**
		 * Parent sticky outline element
		 */
		public readonly parent: StickyElement | undefined
	) {
	}
}

export class StickyModel {
	constructor(
		readonly uri: URI,
		readonly version: number,
		readonly element: StickyElement | undefined,
		readonly outlineProviderId: string | undefined
	) { }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/stickyScroll/browser/stickyScrollModelProvider.ts]---
Location: vscode-main/src/vs/editor/contrib/stickyScroll/browser/stickyScrollModelProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableStore, IDisposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { IActiveCodeEditor } from '../../../browser/editorBrowser.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { OutlineElement, OutlineGroup, OutlineModel } from '../../documentSymbols/browser/outlineModel.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { CancelablePromise, createCancelablePromise, Delayer } from '../../../../base/common/async.js';
import { FoldingController, RangesLimitReporter } from '../../folding/browser/folding.js';
import { SyntaxRangeProvider } from '../../folding/browser/syntaxRangeProvider.js';
import { IndentRangeProvider } from '../../folding/browser/indentRangeProvider.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { FoldingRegions } from '../../folding/browser/foldingRanges.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { StickyElement, StickyModel, StickyRange } from './stickyScrollElement.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { EditorOption } from '../../../common/config/editorOptions.js';

enum ModelProvider {
	OUTLINE_MODEL = 'outlineModel',
	FOLDING_PROVIDER_MODEL = 'foldingProviderModel',
	INDENTATION_MODEL = 'indentationModel'
}

enum Status {
	VALID,
	INVALID,
	CANCELED
}

export interface IStickyModelProvider extends IDisposable {

	/**
	 * Method which updates the sticky model
	 * @param token cancellation token
	 * @returns the sticky model
	 */
	update(token: CancellationToken): Promise<StickyModel | null>;
}

export class StickyModelProvider extends Disposable implements IStickyModelProvider {

	private _modelProviders: IStickyModelCandidateProvider<any>[] = [];
	private _modelPromise: CancelablePromise<any | null> | null = null;
	private _updateScheduler: Delayer<StickyModel | null> = this._register(new Delayer<StickyModel | null>(300));
	private readonly _updateOperation: DisposableStore = this._register(new DisposableStore());

	constructor(
		private readonly _editor: IActiveCodeEditor,
		onProviderUpdate: () => void,
		@IInstantiationService _languageConfigurationService: ILanguageConfigurationService,
		@ILanguageFeaturesService _languageFeaturesService: ILanguageFeaturesService,
	) {
		super();

		switch (this._editor.getOption(EditorOption.stickyScroll).defaultModel) {
			case ModelProvider.OUTLINE_MODEL:
				this._modelProviders.push(new StickyModelFromCandidateOutlineProvider(this._editor, _languageFeaturesService));
			// fall through
			case ModelProvider.FOLDING_PROVIDER_MODEL:
				this._modelProviders.push(new StickyModelFromCandidateSyntaxFoldingProvider(this._editor, onProviderUpdate, _languageFeaturesService));
			// fall through
			case ModelProvider.INDENTATION_MODEL:
				this._modelProviders.push(new StickyModelFromCandidateIndentationFoldingProvider(this._editor, _languageConfigurationService));
				break;
		}
	}

	public override dispose(): void {
		this._modelProviders.forEach(provider => provider.dispose());
		this._updateOperation.clear();
		this._cancelModelPromise();
		super.dispose();
	}

	private _cancelModelPromise(): void {
		if (this._modelPromise) {
			this._modelPromise.cancel();
			this._modelPromise = null;
		}
	}

	public async update(token: CancellationToken): Promise<StickyModel | null> {

		this._updateOperation.clear();
		this._updateOperation.add({
			dispose: () => {
				this._cancelModelPromise();
				this._updateScheduler.cancel();
			}
		});
		this._cancelModelPromise();

		return await this._updateScheduler.trigger(async () => {

			for (const modelProvider of this._modelProviders) {
				const { statusPromise, modelPromise } = modelProvider.computeStickyModel(token);
				this._modelPromise = modelPromise;
				const status = await statusPromise;
				if (this._modelPromise !== modelPromise) {
					return null;
				}
				switch (status) {
					case Status.CANCELED:
						this._updateOperation.clear();
						return null;
					case Status.VALID:
						return modelProvider.stickyModel;
				}
			}
			return null;
		}).catch((error) => {
			onUnexpectedError(error);
			return null;
		});
	}
}

interface IStickyModelCandidateProvider<T> extends IDisposable {
	get stickyModel(): StickyModel | null;

	/**
	 * Method which computes the sticky model and returns a status to signal whether the sticky model has been successfully found
	 * @param token cancellation token
	 * @returns a promise of a status indicating whether the sticky model has been successfully found as well as the model promise
	 */
	computeStickyModel(token: CancellationToken): { statusPromise: Promise<Status> | Status; modelPromise: CancelablePromise<T | null> | null };
}

abstract class StickyModelCandidateProvider<T> extends Disposable implements IStickyModelCandidateProvider<T> {

	protected _stickyModel: StickyModel | null = null;

	constructor(protected readonly _editor: IActiveCodeEditor) {
		super();
	}

	get stickyModel(): StickyModel | null {
		return this._stickyModel;
	}

	private _invalid(): Status {
		this._stickyModel = null;
		return Status.INVALID;
	}

	public computeStickyModel(token: CancellationToken): { statusPromise: Promise<Status> | Status; modelPromise: CancelablePromise<T | null> | null } {
		if (token.isCancellationRequested || !this.isProviderValid()) {
			return { statusPromise: this._invalid(), modelPromise: null };
		}
		const providerModelPromise = createCancelablePromise(token => this.createModelFromProvider(token));

		return {
			statusPromise: providerModelPromise.then(providerModel => {
				if (!this.isModelValid(providerModel)) {
					return this._invalid();

				}
				if (token.isCancellationRequested) {
					return Status.CANCELED;
				}
				this._stickyModel = this.createStickyModel(token, providerModel);
				return Status.VALID;
			}).then(undefined, (err) => {
				onUnexpectedError(err);
				return Status.CANCELED;
			}),
			modelPromise: providerModelPromise
		};
	}

	/**
	 * Method which checks whether the model returned by the provider is valid and can be used to compute a sticky model.
	 * This method by default returns true.
	 * @param model model returned by the provider
	 * @returns boolean indicating whether the model is valid
	 */
	protected isModelValid(model: T): boolean {
		return true;
	}

	/**
	 * Method which checks whether the provider is valid before applying it to find the provider model.
	 * This method by default returns true.
	 * @returns boolean indicating whether the provider is valid
	 */
	protected isProviderValid(): boolean {
		return true;
	}

	/**
	 * Abstract method which creates the model from the provider and returns the provider model
	 * @param token cancellation token
	 * @returns the model returned by the provider
	 */
	protected abstract createModelFromProvider(token: CancellationToken): Promise<T>;

	/**
	 * Abstract method which computes the sticky model from the model returned by the provider and returns the sticky model
	 * @param token cancellation token
	 * @param model model returned by the provider
	 * @returns the sticky model
	 */
	protected abstract createStickyModel(token: CancellationToken, model: T): StickyModel;
}

class StickyModelFromCandidateOutlineProvider extends StickyModelCandidateProvider<OutlineModel> {

	constructor(_editor: IActiveCodeEditor, @ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService) {
		super(_editor);
	}

	protected createModelFromProvider(token: CancellationToken): Promise<OutlineModel> {
		return OutlineModel.create(this._languageFeaturesService.documentSymbolProvider, this._editor.getModel(), token);
	}

	protected createStickyModel(token: CancellationToken, model: OutlineModel): StickyModel {
		const { stickyOutlineElement, providerID } = this._stickyModelFromOutlineModel(model, this._stickyModel?.outlineProviderId);
		const textModel = this._editor.getModel();
		return new StickyModel(textModel.uri, textModel.getVersionId(), stickyOutlineElement, providerID);
	}

	protected override isModelValid(model: OutlineModel): boolean {
		return model && model.children.size > 0;
	}

	private _stickyModelFromOutlineModel(outlineModel: OutlineModel, preferredProvider: string | undefined): { stickyOutlineElement: StickyElement; providerID: string | undefined } {

		let outlineElements: Map<string, OutlineElement>;
		// When several possible outline providers
		if (Iterable.first(outlineModel.children.values()) instanceof OutlineGroup) {
			const provider = Iterable.find(outlineModel.children.values(), outlineGroupOfModel => outlineGroupOfModel.id === preferredProvider);
			if (provider) {
				outlineElements = provider.children;
			} else {
				let tempID = '';
				let maxTotalSumOfRanges = -1;
				let optimalOutlineGroup: OutlineGroup | OutlineElement | undefined = undefined;
				for (const [_key, outlineGroup] of outlineModel.children.entries()) {
					const totalSumRanges = this._findSumOfRangesOfGroup(outlineGroup);
					if (totalSumRanges > maxTotalSumOfRanges) {
						optimalOutlineGroup = outlineGroup;
						maxTotalSumOfRanges = totalSumRanges;
						tempID = outlineGroup.id;
					}
				}
				preferredProvider = tempID;
				outlineElements = optimalOutlineGroup!.children;
			}
		} else {
			outlineElements = outlineModel.children as Map<string, OutlineElement>;
		}
		const stickyChildren: StickyElement[] = [];
		const outlineElementsArray = Array.from(outlineElements.values()).sort((element1, element2) => {
			const range1: StickyRange = new StickyRange(element1.symbol.range.startLineNumber, element1.symbol.range.endLineNumber);
			const range2: StickyRange = new StickyRange(element2.symbol.range.startLineNumber, element2.symbol.range.endLineNumber);
			return this._comparator(range1, range2);
		});
		for (const outlineElement of outlineElementsArray) {
			stickyChildren.push(this._stickyModelFromOutlineElement(outlineElement, outlineElement.symbol.selectionRange.startLineNumber));
		}
		const stickyOutlineElement = new StickyElement(undefined, stickyChildren, undefined);

		return {
			stickyOutlineElement: stickyOutlineElement,
			providerID: preferredProvider
		};
	}

	private _stickyModelFromOutlineElement(outlineElement: OutlineElement, previousStartLine: number): StickyElement {
		const children: StickyElement[] = [];
		for (const child of outlineElement.children.values()) {
			if (child.symbol.selectionRange.startLineNumber !== child.symbol.range.endLineNumber) {
				if (child.symbol.selectionRange.startLineNumber !== previousStartLine) {
					children.push(this._stickyModelFromOutlineElement(child, child.symbol.selectionRange.startLineNumber));
				} else {
					for (const subchild of child.children.values()) {
						children.push(this._stickyModelFromOutlineElement(subchild, child.symbol.selectionRange.startLineNumber));
					}
				}
			}
		}
		children.sort((child1, child2) => this._comparator(child1.range!, child2.range!));
		const range = new StickyRange(outlineElement.symbol.selectionRange.startLineNumber, outlineElement.symbol.range.endLineNumber);
		return new StickyElement(range, children, undefined);
	}

	private _comparator(range1: StickyRange, range2: StickyRange): number {
		if (range1.startLineNumber !== range2.startLineNumber) {
			return range1.startLineNumber - range2.startLineNumber;
		} else {
			return range2.endLineNumber - range1.endLineNumber;
		}
	}

	private _findSumOfRangesOfGroup(outline: OutlineGroup | OutlineElement): number {
		let res = 0;
		for (const child of outline.children.values()) {
			res += this._findSumOfRangesOfGroup(child);
		}
		if (outline instanceof OutlineElement) {
			return res + outline.symbol.range.endLineNumber - outline.symbol.selectionRange.startLineNumber;
		} else {
			return res;
		}
	}
}

abstract class StickyModelFromCandidateFoldingProvider extends StickyModelCandidateProvider<FoldingRegions | null> {

	protected _foldingLimitReporter: RangesLimitReporter;

	constructor(editor: IActiveCodeEditor) {
		super(editor);
		this._foldingLimitReporter = this._register(new RangesLimitReporter(editor));
	}

	protected createStickyModel(token: CancellationToken, model: FoldingRegions): StickyModel {
		const foldingElement = this._fromFoldingRegions(model);
		const textModel = this._editor.getModel();
		return new StickyModel(textModel.uri, textModel.getVersionId(), foldingElement, undefined);
	}

	protected override isModelValid(model: FoldingRegions): boolean {
		return model !== null;
	}


	private _fromFoldingRegions(foldingRegions: FoldingRegions): StickyElement {
		const length = foldingRegions.length;
		const orderedStickyElements: StickyElement[] = [];

		// The root sticky outline element
		const stickyOutlineElement = new StickyElement(
			undefined,
			[],
			undefined
		);

		for (let i = 0; i < length; i++) {
			// Finding the parent index of the current range
			const parentIndex = foldingRegions.getParentIndex(i);

			let parentNode;
			if (parentIndex !== -1) {
				// Access the reference of the parent node
				parentNode = orderedStickyElements[parentIndex];
			} else {
				// In that case the parent node is the root node
				parentNode = stickyOutlineElement;
			}

			const child = new StickyElement(
				new StickyRange(foldingRegions.getStartLineNumber(i), foldingRegions.getEndLineNumber(i) + 1),
				[],
				parentNode
			);
			parentNode.children.push(child);
			orderedStickyElements.push(child);
		}
		return stickyOutlineElement;
	}
}

class StickyModelFromCandidateIndentationFoldingProvider extends StickyModelFromCandidateFoldingProvider {

	private readonly provider: IndentRangeProvider;

	constructor(
		editor: IActiveCodeEditor,
		@ILanguageConfigurationService private readonly _languageConfigurationService: ILanguageConfigurationService) {
		super(editor);

		this.provider = this._register(new IndentRangeProvider(editor.getModel(), this._languageConfigurationService, this._foldingLimitReporter));
	}

	protected override async createModelFromProvider(token: CancellationToken): Promise<FoldingRegions> {
		return this.provider.compute(token);
	}
}

class StickyModelFromCandidateSyntaxFoldingProvider extends StickyModelFromCandidateFoldingProvider {

	private readonly provider: MutableDisposable<SyntaxRangeProvider> = this._register(new MutableDisposable<SyntaxRangeProvider>());

	constructor(
		editor: IActiveCodeEditor,
		onProviderUpdate: () => void,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService
	) {
		super(editor);
		this._register(this._languageFeaturesService.foldingRangeProvider.onDidChange(() => {
			this._updateProvider(editor, onProviderUpdate);
		}));
		this._updateProvider(editor, onProviderUpdate);
	}

	private _updateProvider(editor: IActiveCodeEditor, onProviderUpdate: () => void): void {
		const selectedProviders = FoldingController.getFoldingRangeProviders(this._languageFeaturesService, editor.getModel());
		if (selectedProviders.length === 0) {
			return;
		}
		this.provider.value = new SyntaxRangeProvider(editor.getModel(), selectedProviders, onProviderUpdate, this._foldingLimitReporter, undefined);
	}

	protected override isProviderValid(): boolean {
		return this.provider !== undefined;
	}

	protected override async createModelFromProvider(token: CancellationToken): Promise<FoldingRegions | null> {
		return this.provider.value?.compute(token) ?? null;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/stickyScroll/browser/stickyScrollProvider.ts]---
Location: vscode-main/src/vs/editor/contrib/stickyScroll/browser/stickyScrollProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { CancellationToken, CancellationTokenSource, } from '../../../../base/common/cancellation.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { binarySearch } from '../../../../base/common/arrays.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { StickyModelProvider, IStickyModelProvider } from './stickyScrollModelProvider.js';
import { StickyElement, StickyModel, StickyRange } from './stickyScrollElement.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';

export class StickyLineCandidate {
	constructor(
		public readonly startLineNumber: number,
		public readonly endLineNumber: number,
		public readonly top: number,
		public readonly height: number,
	) { }
}

export interface IStickyLineCandidateProvider {
	/**
	 * Dispose resources used by the provider.
	 */
	dispose(): void;

	/**
	 * Get the version ID of the sticky model.
	 */
	getVersionId(): number | undefined;

	/**
	 * Update the sticky line candidates.
	 */
	update(): Promise<void>;

	/**
	 * Get sticky line candidates intersecting a given range.
	 */
	getCandidateStickyLinesIntersecting(range: StickyRange): StickyLineCandidate[];

	/**
	 * Event triggered when sticky scroll changes.
	 */
	readonly onDidChangeStickyScroll: Event<void>;
}

export class StickyLineCandidateProvider extends Disposable implements IStickyLineCandidateProvider {
	static readonly ID = 'store.contrib.stickyScrollController';

	private readonly _onDidChangeStickyScroll = this._register(new Emitter<void>());
	public readonly onDidChangeStickyScroll = this._onDidChangeStickyScroll.event;

	private readonly _editor: ICodeEditor;
	private readonly _updateSoon: RunOnceScheduler;
	private readonly _sessionStore: DisposableStore;

	private _model: StickyModel | null = null;
	private _cts: CancellationTokenSource | null = null;
	private _stickyModelProvider: IStickyModelProvider | null = null;

	constructor(
		editor: ICodeEditor,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
		@ILanguageConfigurationService private readonly _languageConfigurationService: ILanguageConfigurationService,
	) {
		super();
		this._editor = editor;
		this._sessionStore = this._register(new DisposableStore());
		this._updateSoon = this._register(new RunOnceScheduler(() => this.update(), 50));

		this._register(this._editor.onDidChangeConfiguration(e => {
			if (e.hasChanged(EditorOption.stickyScroll)) {
				this.readConfiguration();
			}
		}));
		this.readConfiguration();
	}

	/**
	 * Read and apply the sticky scroll configuration.
	 */
	private readConfiguration() {
		this._sessionStore.clear();
		const options = this._editor.getOption(EditorOption.stickyScroll);
		if (!options.enabled) {
			return;
		}
		this._sessionStore.add(this._editor.onDidChangeModel(() => {
			this._model = null;
			this.updateStickyModelProvider();
			this._onDidChangeStickyScroll.fire();
			this.update();
		}));
		this._sessionStore.add(this._editor.onDidChangeHiddenAreas(() => this.update()));
		this._sessionStore.add(this._editor.onDidChangeModelContent(() => this._updateSoon.schedule()));
		this._sessionStore.add(this._languageFeaturesService.documentSymbolProvider.onDidChange(() => this.update()));
		this._sessionStore.add(toDisposable(() => {
			this._stickyModelProvider?.dispose();
			this._stickyModelProvider = null;
		}));
		this.updateStickyModelProvider();
		this.update();
	}

	/**
	 * Get the version ID of the sticky model.
	 */
	public getVersionId(): number | undefined {
		return this._model?.version;
	}

	/**
	 * Update the sticky model provider.
	 */
	private updateStickyModelProvider() {
		this._stickyModelProvider?.dispose();
		this._stickyModelProvider = null;
		if (this._editor.hasModel()) {
			this._stickyModelProvider = new StickyModelProvider(
				this._editor,
				() => this._updateSoon.schedule(),
				this._languageConfigurationService,
				this._languageFeaturesService
			);
		}
	}

	/**
	 * Update the sticky line candidates.
	 */
	public async update(): Promise<void> {
		this._cts?.dispose(true);
		this._cts = new CancellationTokenSource();
		await this.updateStickyModel(this._cts.token);
		this._onDidChangeStickyScroll.fire();
	}

	/**
	 * Update the sticky model based on the current editor state.
	 */
	private async updateStickyModel(token: CancellationToken): Promise<void> {
		if (!this._editor.hasModel() || !this._stickyModelProvider || this._editor.getModel().isTooLargeForTokenization()) {
			this._model = null;
			return;
		}
		const model = await this._stickyModelProvider.update(token);
		if (!token.isCancellationRequested) {
			this._model = model;
		}
	}

	/**
	 * Get sticky line candidates intersecting a given range.
	 */
	public getCandidateStickyLinesIntersecting(range: StickyRange): StickyLineCandidate[] {
		if (!this._model?.element) {
			return [];
		}
		const stickyLineCandidates: StickyLineCandidate[] = [];
		this.getCandidateStickyLinesIntersectingFromStickyModel(range, this._model.element, stickyLineCandidates, 0, 0, -1);
		return this.filterHiddenRanges(stickyLineCandidates);
	}

	/**
	 * Get sticky line candidates intersecting a given range from the sticky model.
	 */
	private getCandidateStickyLinesIntersectingFromStickyModel(
		range: StickyRange,
		outlineModel: StickyElement,
		result: StickyLineCandidate[],
		depth: number,
		top: number,
		lastStartLineNumber: number
	): void {
		const textModel = this._editor.getModel();
		if (!textModel) {
			return;
		}
		if (outlineModel.children.length === 0) {
			return;
		}
		let lastLine = lastStartLineNumber;
		const childrenStartLines: number[] = [];

		for (let i = 0; i < outlineModel.children.length; i++) {
			const child = outlineModel.children[i];
			if (child.range) {
				childrenStartLines.push(child.range.startLineNumber);
			}
		}
		const lowerBound = this.updateIndex(binarySearch(childrenStartLines, range.startLineNumber, (a: number, b: number) => { return a - b; }));
		const upperBound = this.updateIndex(binarySearch(childrenStartLines, range.endLineNumber, (a: number, b: number) => { return a - b; }));

		for (let i = lowerBound; i <= upperBound; i++) {
			const child = outlineModel.children[i];
			if (!child || !child.range) {
				continue;
			}
			const { startLineNumber, endLineNumber } = child.range;
			if (
				endLineNumber > startLineNumber + 1
				&& range.startLineNumber <= endLineNumber + 1
				&& startLineNumber - 1 <= range.endLineNumber
				&& startLineNumber !== lastLine
				&& textModel.isValidRange(new Range(startLineNumber, 1, endLineNumber, 1))
			) {
				lastLine = startLineNumber;
				const lineHeight = this._editor.getLineHeightForPosition(new Position(startLineNumber, 1));
				result.push(new StickyLineCandidate(startLineNumber, endLineNumber - 1, top, lineHeight));
				this.getCandidateStickyLinesIntersectingFromStickyModel(range, child, result, depth + 1, top + lineHeight, startLineNumber);
			}
		}
	}

	/**
	 * Filter out sticky line candidates that are within hidden ranges.
	 */
	private filterHiddenRanges(stickyLineCandidates: StickyLineCandidate[]): StickyLineCandidate[] {
		const hiddenRanges = this._editor._getViewModel()?.getHiddenAreas();
		if (!hiddenRanges) {
			return stickyLineCandidates;
		}
		return stickyLineCandidates.filter(candidate => {
			return !hiddenRanges.some(hiddenRange =>
				candidate.startLineNumber >= hiddenRange.startLineNumber &&
				candidate.endLineNumber <= hiddenRange.endLineNumber + 1
			);
		});
	}

	/**
	 * Update the binary search index.
	 */
	private updateIndex(index: number): number {
		if (index === -1) {
			return 0;
		} else if (index < 0) {
			return -index - 2;
		}
		return index;
	}
}
```

--------------------------------------------------------------------------------

````

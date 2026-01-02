---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 98
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 98 of 552)

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

---[FILE: extensions/typescript-language-features/src/test/smoke/completions.test.ts]---
Location: vscode-main/extensions/typescript-language-features/src/test/smoke/completions.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import * as vscode from 'vscode';
import { acceptFirstSuggestion, typeCommitCharacter } from '../../test/suggestTestHelpers';
import { Config, VsCodeConfiguration, assertEditorContents, createTestEditor, enumerateConfig, joinLines, updateConfig } from '../../test/testUtils';
import { disposeAll } from '../../utils/dispose';

const testDocumentUri = vscode.Uri.parse('untitled:test.ts');

const insertModes = Object.freeze(['insert', 'replace']);

suite.skip('TypeScript Completions', () => {
	const configDefaults = Object.freeze<VsCodeConfiguration>({
		[Config.autoClosingBrackets]: 'always',
		[Config.typescriptCompleteFunctionCalls]: false,
		[Config.insertMode]: 'insert',
		[Config.snippetSuggestions]: 'none',
		[Config.suggestSelection]: 'first',
		[Config.javascriptQuoteStyle]: 'double',
		[Config.typescriptQuoteStyle]: 'double',
	});

	const _disposables: vscode.Disposable[] = [];
	let oldConfig: { [key: string]: any } = {};

	setup(async () => {
		// the tests assume that typescript features are registered
		await vscode.extensions.getExtension('vscode.typescript-language-features')!.activate();

		// Save off config and apply defaults
		oldConfig = await updateConfig(testDocumentUri, configDefaults);
	});

	teardown(async () => {
		disposeAll(_disposables);

		// Restore config
		await updateConfig(testDocumentUri, oldConfig);

		return vscode.commands.executeCommand('workbench.action.closeAllEditors');
	});

	test('Basic var completion', async () => {
		await enumerateConfig(testDocumentUri, Config.insertMode, insertModes, async config => {
			const editor = await createTestEditor(testDocumentUri,
				`const abcdef = 123;`,
				`ab$0;`
			);

			await acceptFirstSuggestion(testDocumentUri, _disposables);

			assertEditorContents(editor,
				joinLines(
					`const abcdef = 123;`,
					`abcdef;`
				),
				`config: ${config}`
			);
		});
	});

	test('Should treat period as commit character for var completions', async () => {
		await enumerateConfig(testDocumentUri, Config.insertMode, insertModes, async config => {
			const editor = await createTestEditor(testDocumentUri,
				`const abcdef = 123;`,
				`ab$0;`
			);

			await typeCommitCharacter(testDocumentUri, '.', _disposables);

			assertEditorContents(editor,
				joinLines(
					`const abcdef = 123;`,
					`abcdef.;`
				),
				`config: ${config}`);
		});
	});

	test('Should treat paren as commit character for function completions', async () => {
		await enumerateConfig(testDocumentUri, Config.insertMode, insertModes, async config => {
			const editor = await createTestEditor(testDocumentUri,
				`function abcdef() {};`,
				`ab$0;`
			);

			await typeCommitCharacter(testDocumentUri, '(', _disposables);

			assertEditorContents(editor,
				joinLines(
					`function abcdef() {};`,
					`abcdef();`
				), `config: ${config}`);
		});
	});

	test('Should insert brackets when completing dot properties with spaces in name', async () => {
		await enumerateConfig(testDocumentUri, Config.insertMode, insertModes, async config => {
			const editor = await createTestEditor(testDocumentUri,
				'const x = { "hello world": 1 };',
				'x.$0'
			);

			await acceptFirstSuggestion(testDocumentUri, _disposables);

			assertEditorContents(editor,
				joinLines(
					'const x = { "hello world": 1 };',
					'x["hello world"]'
				), `config: ${config}`);
		});
	});

	test('Should allow commit characters for backet completions', async () => {
		for (const { char, insert } of [
			{ char: '.', insert: '.' },
			{ char: '(', insert: '()' },
		]) {
			const editor = await createTestEditor(testDocumentUri,
				'const x = { "hello world2": 1 };',
				'x.$0'
			);

			await typeCommitCharacter(testDocumentUri, char, _disposables);

			assertEditorContents(editor,
				joinLines(
					'const x = { "hello world2": 1 };',
					`x["hello world2"]${insert}`
				));

			disposeAll(_disposables);
			await vscode.commands.executeCommand('workbench.action.closeAllEditors');
		}
	});

	test('Should not prioritize bracket accessor completions. #63100', async () => {
		await enumerateConfig(testDocumentUri, Config.insertMode, insertModes, async config => {
			// 'a' should be first entry in completion list
			const editor = await createTestEditor(testDocumentUri,
				'const x = { "z-z": 1, a: 1 };',
				'x.$0'
			);

			await acceptFirstSuggestion(testDocumentUri, _disposables);

			assertEditorContents(editor,
				joinLines(
					'const x = { "z-z": 1, a: 1 };',
					'x.a'
				),
				`config: ${config}`);
		});
	});

	test('Accepting a string completion should replace the entire string. #53962', async () => {
		const editor = await createTestEditor(testDocumentUri,
			'interface TFunction {',
			`  (_: 'abc.abc2', __ ?: {}): string;`,
			`  (_: 'abc.abc', __?: {}): string;`,
			`}`,
			'const f: TFunction = (() => { }) as any;',
			`f('abc.abc$0')`
		);

		await acceptFirstSuggestion(testDocumentUri, _disposables);

		assertEditorContents(editor,
			joinLines(
				'interface TFunction {',
				`  (_: 'abc.abc2', __ ?: {}): string;`,
				`  (_: 'abc.abc', __?: {}): string;`,
				`}`,
				'const f: TFunction = (() => { }) as any;',
				`f('abc.abc')`
			));
	});

	test('completeFunctionCalls should complete function parameters when at end of word', async () => {
		await updateConfig(testDocumentUri, { [Config.typescriptCompleteFunctionCalls]: true });

		// Complete with-in word
		const editor = await createTestEditor(testDocumentUri,
			`function abcdef(x, y, z) { }`,
			`abcdef$0`
		);

		await acceptFirstSuggestion(testDocumentUri, _disposables);

		assertEditorContents(editor,
			joinLines(
				`function abcdef(x, y, z) { }`,
				`abcdef(x, y, z)`
			));
	});

	test.skip('completeFunctionCalls should complete function parameters when within word', async () => {
		await updateConfig(testDocumentUri, { [Config.typescriptCompleteFunctionCalls]: true });

		const editor = await createTestEditor(testDocumentUri,
			`function abcdef(x, y, z) { }`,
			`abcd$0ef`
		);

		await acceptFirstSuggestion(testDocumentUri, _disposables);

		assertEditorContents(editor,
			joinLines(
				`function abcdef(x, y, z) { }`,
				`abcdef(x, y, z)`
			));
	});

	test('completeFunctionCalls should not complete function parameters at end of word if we are already in something that looks like a function call, #18131', async () => {
		await updateConfig(testDocumentUri, { [Config.typescriptCompleteFunctionCalls]: true });

		const editor = await createTestEditor(testDocumentUri,
			`function abcdef(x, y, z) { }`,
			`abcdef$0(1, 2, 3)`
		);

		await acceptFirstSuggestion(testDocumentUri, _disposables);

		assertEditorContents(editor,
			joinLines(
				`function abcdef(x, y, z) { }`,
				`abcdef(1, 2, 3)`
			));
	});

	test.skip('completeFunctionCalls should not complete function parameters within word if we are already in something that looks like a function call, #18131', async () => {
		await updateConfig(testDocumentUri, { [Config.typescriptCompleteFunctionCalls]: true });

		const editor = await createTestEditor(testDocumentUri,
			`function abcdef(x, y, z) { }`,
			`abcd$0ef(1, 2, 3)`
		);

		await acceptFirstSuggestion(testDocumentUri, _disposables);

		assertEditorContents(editor,
			joinLines(
				`function abcdef(x, y, z) { }`,
				`abcdef(1, 2, 3)`
			));
	});

	test('should not de-prioritize `this.member` suggestion, #74164', async () => {
		await enumerateConfig(testDocumentUri, Config.insertMode, insertModes, async config => {
			const editor = await createTestEditor(testDocumentUri,
				`class A {`,
				`  private detail = '';`,
				`  foo() {`,
				`    det$0`,
				`  }`,
				`}`,
			);

			await acceptFirstSuggestion(testDocumentUri, _disposables);

			assertEditorContents(editor,
				joinLines(
					`class A {`,
					`  private detail = '';`,
					`  foo() {`,
					`    this.detail`,
					`  }`,
					`}`,
				),
				`Config: ${config}`);
		});
	});

	test('Member completions for string property name should insert `this.` and use brackets', async () => {
		await enumerateConfig(testDocumentUri, Config.insertMode, insertModes, async config => {
			const editor = await createTestEditor(testDocumentUri,
				`class A {`,
				`  ['xyz 123'] = 1`,
				`  foo() {`,
				`    xyz$0`,
				`  }`,
				`}`,
			);

			await acceptFirstSuggestion(testDocumentUri, _disposables);

			assertEditorContents(editor,
				joinLines(
					`class A {`,
					`  ['xyz 123'] = 1`,
					`  foo() {`,
					`    this["xyz 123"]`,
					`  }`,
					`}`,
				),
				`Config: ${config}`);
		});
	});

	test('Member completions for string property name already using `this.` should add brackets', async () => {
		await enumerateConfig(testDocumentUri, Config.insertMode, insertModes, async config => {
			const editor = await createTestEditor(testDocumentUri,
				`class A {`,
				`  ['xyz 123'] = 1`,
				`  foo() {`,
				`    this.xyz$0`,
				`  }`,
				`}`,
			);

			await acceptFirstSuggestion(testDocumentUri, _disposables);

			assertEditorContents(editor,
				joinLines(
					`class A {`,
					`  ['xyz 123'] = 1`,
					`  foo() {`,
					`    this["xyz 123"]`,
					`  }`,
					`}`,
				),
				`Config: ${config}`);
		});
	});

	test('Accepting a completion in word using `insert` mode should insert', async () => {
		await updateConfig(testDocumentUri, { [Config.insertMode]: 'insert' });

		const editor = await createTestEditor(testDocumentUri,
			`const abc = 123;`,
			`ab$0c`
		);

		await acceptFirstSuggestion(testDocumentUri, _disposables);

		assertEditorContents(editor,
			joinLines(
				`const abc = 123;`,
				`abcc`
			));
	});

	test('Accepting a completion in word using `replace` mode should replace', async () => {
		await updateConfig(testDocumentUri, { [Config.insertMode]: 'replace' });

		const editor = await createTestEditor(testDocumentUri,
			`const abc = 123;`,
			`ab$0c`
		);

		await acceptFirstSuggestion(testDocumentUri, _disposables);

		assertEditorContents(editor,
			joinLines(
				`const abc = 123;`,
				`abc`
			));
	});

	test('Accepting a member completion in word using `insert` mode add `this.` and insert', async () => {
		await updateConfig(testDocumentUri, { [Config.insertMode]: 'insert' });

		const editor = await createTestEditor(testDocumentUri,
			`class Foo {`,
			`  abc = 1;`,
			`  foo() {`,
			`    ab$0c`,
			`  }`,
			`}`,
		);

		await acceptFirstSuggestion(testDocumentUri, _disposables);

		assertEditorContents(editor,
			joinLines(
				`class Foo {`,
				`  abc = 1;`,
				`  foo() {`,
				`    this.abcc`,
				`  }`,
				`}`,
			));
	});

	test('Accepting a member completion in word using `replace` mode should add `this.` and replace', async () => {
		await updateConfig(testDocumentUri, { [Config.insertMode]: 'replace' });

		const editor = await createTestEditor(testDocumentUri,
			`class Foo {`,
			`  abc = 1;`,
			`  foo() {`,
			`    ab$0c`,
			`  }`,
			`}`,
		);

		await acceptFirstSuggestion(testDocumentUri, _disposables);

		assertEditorContents(editor,
			joinLines(
				`class Foo {`,
				`  abc = 1;`,
				`  foo() {`,
				`    this.abc`,
				`  }`,
				`}`,
			));
	});

	test('Accepting string completion inside string using `insert` mode should insert', async () => {
		await updateConfig(testDocumentUri, { [Config.insertMode]: 'insert' });

		const editor = await createTestEditor(testDocumentUri,
			`const abc = { 'xy z': 123 }`,
			`abc["x$0y w"]`
		);

		await acceptFirstSuggestion(testDocumentUri, _disposables);

		assertEditorContents(editor,
			joinLines(
				`const abc = { 'xy z': 123 }`,
				`abc["xy zy w"]`
			));
	});

	// Waiting on https://github.com/microsoft/TypeScript/issues/35602
	test.skip('Accepting string completion inside string using insert mode should insert', async () => {
		await updateConfig(testDocumentUri, { [Config.insertMode]: 'replace' });

		const editor = await createTestEditor(testDocumentUri,
			`const abc = { 'xy z': 123 }`,
			`abc["x$0y w"]`
		);

		await acceptFirstSuggestion(testDocumentUri, _disposables);

		assertEditorContents(editor,
			joinLines(
				`const abc = { 'xy z': 123 }`,
				`abc["xy w"]`
			));
	});

	test('Private field completions on `this.#` should work', async () => {
		await enumerateConfig(testDocumentUri, Config.insertMode, insertModes, async config => {
			const editor = await createTestEditor(testDocumentUri,
				`class A {`,
				`  #xyz = 1;`,
				`  foo() {`,
				`    this.#$0`,
				`  }`,
				`}`,
			);

			await acceptFirstSuggestion(testDocumentUri, _disposables);

			assertEditorContents(editor,
				joinLines(
					`class A {`,
					`  #xyz = 1;`,
					`  foo() {`,
					`    this.#xyz`,
					`  }`,
					`}`,
				),
				`Config: ${config}`);
		});
	});

	test('Private field completions on `#` should insert `this.`', async () => {
		await enumerateConfig(testDocumentUri, Config.insertMode, insertModes, async config => {
			const editor = await createTestEditor(testDocumentUri,
				`class A {`,
				`  #xyz = 1;`,
				`  foo() {`,
				`    #$0`,
				`  }`,
				`}`,
			);

			await acceptFirstSuggestion(testDocumentUri, _disposables);

			assertEditorContents(editor,
				joinLines(
					`class A {`,
					`  #xyz = 1;`,
					`  foo() {`,
					`    this.#xyz`,
					`  }`,
					`}`,
				),
				`Config: ${config}`);
		});
	});

	test('Private field completions should not require strict prefix match (#89556)', async () => {
		await enumerateConfig(testDocumentUri, Config.insertMode, insertModes, async config => {
			const editor = await createTestEditor(testDocumentUri,
				`class A {`,
				`  #xyz = 1;`,
				`  foo() {`,
				`    this.xyz$0`,
				`  }`,
				`}`,
			);

			await acceptFirstSuggestion(testDocumentUri, _disposables);

			assertEditorContents(editor,
				joinLines(
					`class A {`,
					`  #xyz = 1;`,
					`  foo() {`,
					`    this.#xyz`,
					`  }`,
					`}`,
				),
				`Config: ${config}`);
		});
	});

	test('Private field completions without `this.` should not require strict prefix match (#89556)', async () => {
		await enumerateConfig(testDocumentUri, Config.insertMode, insertModes, async config => {
			const editor = await createTestEditor(testDocumentUri,
				`class A {`,
				`  #xyz = 1;`,
				`  foo() {`,
				`    xyz$0`,
				`  }`,
				`}`,
			);

			await acceptFirstSuggestion(testDocumentUri, _disposables);

			assertEditorContents(editor,
				joinLines(
					`class A {`,
					`  #xyz = 1;`,
					`  foo() {`,
					`    this.#xyz`,
					`  }`,
					`}`,
				),
				`Config: ${config}`);
		});
	});

	test('Accepting a completion for async property in `insert` mode should insert and add await', async () => {
		await updateConfig(testDocumentUri, { [Config.insertMode]: 'insert' });

		const editor = await createTestEditor(testDocumentUri,
			`class A {`,
			`  xyz = Promise.resolve({ 'abc': 1 });`,
			`  async foo() {`,
			`    this.xyz.ab$0c`,
			`  }`,
			`}`,
		);

		await acceptFirstSuggestion(testDocumentUri, _disposables);

		assertEditorContents(editor,
			joinLines(
				`class A {`,
				`  xyz = Promise.resolve({ 'abc': 1 });`,
				`  async foo() {`,
				`    (await this.xyz).abcc`,
				`  }`,
				`}`,
			));
	});

	test('Accepting a completion for async property in `replace` mode should replace and add await', async () => {
		await updateConfig(testDocumentUri, { [Config.insertMode]: 'replace' });

		const editor = await createTestEditor(testDocumentUri,
			`class A {`,
			`  xyz = Promise.resolve({ 'abc': 1 });`,
			`  async foo() {`,
			`    this.xyz.ab$0c`,
			`  }`,
			`}`,
		);

		await acceptFirstSuggestion(testDocumentUri, _disposables);

		assertEditorContents(editor,
			joinLines(
				`class A {`,
				`  xyz = Promise.resolve({ 'abc': 1 });`,
				`  async foo() {`,
				`    (await this.xyz).abc`,
				`  }`,
				`}`,
			));
	});

	test.skip('Accepting a completion for async string property should add await plus brackets', async () => {
		await enumerateConfig(testDocumentUri, Config.insertMode, insertModes, async config => {
			const editor = await createTestEditor(testDocumentUri,
				`class A {`,
				`  xyz = Promise.resolve({ 'ab c': 1 });`,
				`  async foo() {`,
				`    this.xyz.ab$0`,
				`  }`,
				`}`,
			);

			await acceptFirstSuggestion(testDocumentUri, _disposables);

			assertEditorContents(editor,
				joinLines(
					`class A {`,
					`  xyz = Promise.resolve({ 'abc': 1 });`,
					`  async foo() {`,
					`    (await this.xyz)["ab c"]`,
					`  }`,
					`}`,
				),
				`Config: ${config}`);
		});
	});

	test('Replace should work after this. (#91105)', async () => {
		await updateConfig(testDocumentUri, { [Config.insertMode]: 'replace' });

		const editor = await createTestEditor(testDocumentUri,
			`class A {`,
			`  abc = 1`,
			`  foo() {`,
			`    this.$0abc`,
			`  }`,
			`}`,
		);

		await acceptFirstSuggestion(testDocumentUri, _disposables);

		assertEditorContents(editor,
			joinLines(
				`class A {`,
				`  abc = 1`,
				`  foo() {`,
				`    this.abc`,
				`  }`,
				`}`,
			));
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/test/smoke/fixAll.test.ts]---
Location: vscode-main/extensions/typescript-language-features/src/test/smoke/fixAll.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import * as vscode from 'vscode';
import { createTestEditor, joinLines, wait } from '../../test/testUtils';
import { disposeAll } from '../../utils/dispose';

const testDocumentUri = vscode.Uri.parse('untitled:test.ts');

const emptyRange = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0));

suite.skip('TypeScript Fix All', () => {

	const _disposables: vscode.Disposable[] = [];

	setup(async () => {
		// the tests assume that typescript features are registered
		await vscode.extensions.getExtension('vscode.typescript-language-features')!.activate();
	});

	teardown(async () => {
		disposeAll(_disposables);

		await vscode.commands.executeCommand('workbench.action.closeAllEditors');
	});

	test('Fix all should remove unreachable code', async () => {
		const editor = await createTestEditor(testDocumentUri,
			`function foo() {`,
			`    return 1;`,
			`    return 2;`,
			`};`,
			`function boo() {`,
			`    return 3;`,
			`    return 4;`,
			`};`,
		);

		await wait(2000);

		const fixes = await vscode.commands.executeCommand<vscode.CodeAction[]>('vscode.executeCodeActionProvider',
			testDocumentUri,
			emptyRange,
			vscode.CodeActionKind.SourceFixAll
		);

		await vscode.workspace.applyEdit(fixes![0].edit!);

		assert.strictEqual(editor.document.getText(), joinLines(
			`function foo() {`,
			`    return 1;`,
			`};`,
			`function boo() {`,
			`    return 3;`,
			`};`,
		));

	});

	test('Fix all should implement interfaces', async () => {
		const editor = await createTestEditor(testDocumentUri,
			`interface I {`,
			`    x: number;`,
			`}`,
			`class A implements I {}`,
			`class B implements I {}`,
		);

		await wait(2000);

		const fixes = await vscode.commands.executeCommand<vscode.CodeAction[]>('vscode.executeCodeActionProvider',
			testDocumentUri,
			emptyRange,
			vscode.CodeActionKind.SourceFixAll
		);

		await vscode.workspace.applyEdit(fixes![0].edit!);
		assert.strictEqual(editor.document.getText(), joinLines(
			`interface I {`,
			`    x: number;`,
			`}`,
			`class A implements I {`,
			`    x: number;`,
			`}`,
			`class B implements I {`,
			`    x: number;`,
			`}`,
		));
	});

	test('Remove unused should handle nested ununused', async () => {
		const editor = await createTestEditor(testDocumentUri,
			`export const _ = 1;`,
			`function unused() {`,
			`    const a = 1;`,
			`}`,
			`function used() {`,
			`    const a = 1;`,
			`}`,
			`used();`
		);

		await wait(2000);

		const fixes = await vscode.commands.executeCommand<vscode.CodeAction[]>('vscode.executeCodeActionProvider',
			testDocumentUri,
			emptyRange,
			vscode.CodeActionKind.Source.append('removeUnused')
		);

		await vscode.workspace.applyEdit(fixes![0].edit!);
		assert.strictEqual(editor.document.getText(), joinLines(
			`export const _ = 1;`,
			`function used() {`,
			`}`,
			`used();`
		));
	});

	test('Remove unused should remove unused interfaces', async () => {
		const editor = await createTestEditor(testDocumentUri,
			`export const _ = 1;`,
			`interface Foo {}`
		);

		await wait(2000);

		const fixes = await vscode.commands.executeCommand<vscode.CodeAction[]>('vscode.executeCodeActionProvider',
			testDocumentUri,
			emptyRange,
			vscode.CodeActionKind.Source.append('removeUnused')
		);

		await vscode.workspace.applyEdit(fixes![0].edit!);
		assert.strictEqual(editor.document.getText(), joinLines(
			`export const _ = 1;`,
			``
		));
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/test/smoke/implementationsCodeLens.test.ts]---
Location: vscode-main/extensions/typescript-language-features/src/test/smoke/implementationsCodeLens.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import * as vscode from 'vscode';
import { disposeAll } from '../../utils/dispose';
import { joinLines, withRandomFileEditor } from '../testUtils';
import { updateConfig, VsCodeConfiguration } from './referencesCodeLens.test';

const Config = {
	referencesCodeLens: 'typescript.referencesCodeLens.enabled',
	implementationsCodeLens: 'typescript.implementationsCodeLens.enabled',
	showOnAllClassMethods: 'typescript.implementationsCodeLens.showOnAllClassMethods',
};

function getCodeLenses(doc: vscode.TextDocument) {
	return vscode.commands.executeCommand<vscode.CodeLens[]>('vscode.executeCodeLensProvider', doc.uri);
}

suite('TypeScript Implementations CodeLens', () => {
	const configDefaults = Object.freeze<VsCodeConfiguration>({
		[Config.referencesCodeLens]: false,
		[Config.implementationsCodeLens]: true,
		[Config.showOnAllClassMethods]: false,
	});

	const _disposables: vscode.Disposable[] = [];
	let oldConfig: { [key: string]: any } = {};

	setup(async () => {
		// the tests assume that typescript features are registered
		await vscode.extensions.getExtension('vscode.typescript-language-features')!.activate();

		// Save off config and apply defaults
		oldConfig = await updateConfig(configDefaults);
	});

	teardown(async () => {
		disposeAll(_disposables);

		// Restore config
		await updateConfig(oldConfig);

		return vscode.commands.executeCommand('workbench.action.closeAllEditors');
	});

	test('Should show on interfaces and abstract classes', async () => {
		await withRandomFileEditor(
			joinLines(
				'interface IFoo {}',
				'class Foo implements IFoo {}',
				'abstract class AbstractBase {}',
				'class Concrete extends AbstractBase {}'
			),
			'ts',
			async (_editor: vscode.TextEditor, doc: vscode.TextDocument) => {
				const lenses = await getCodeLenses(doc);
				assert.strictEqual(lenses?.length, 2);

				assert.strictEqual(lenses?.[0].range.start.line, 0, 'Expected interface IFoo to have a CodeLens');
				assert.strictEqual(lenses?.[1].range.start.line, 2, 'Expected abstract class AbstractBase to have a CodeLens');
			},
		);
	});

	test('Should show on abstract methods, properties, and getters', async () => {
		await withRandomFileEditor(
			joinLines(
				'abstract class Base {',
				'    abstract method(): void;',
				'    abstract property: string;',
				'    abstract get getter(): number;',
				'}',
				'class Derived extends Base {',
				'    method() {}',
				'    property = "test";',
				'    get getter() { return 42; }',
				'}',
			),
			'ts',
			async (_editor: vscode.TextEditor, doc: vscode.TextDocument) => {
				const lenses = await getCodeLenses(doc);
				assert.strictEqual(lenses?.length, 4);

				assert.strictEqual(lenses?.[0].range.start.line, 0, 'Expected abstract class to have a CodeLens');
				assert.strictEqual(lenses?.[1].range.start.line, 1, 'Expected abstract method to have a CodeLens');
				assert.strictEqual(lenses?.[2].range.start.line, 2, 'Expected abstract property to have a CodeLens');
				assert.strictEqual(lenses?.[3].range.start.line, 3, 'Expected abstract getter to have a CodeLens');
			},
		);
	});

	test('Should not show implementations on methods by default', async () => {
		await withRandomFileEditor(
			joinLines(
				'abstract class A {',
				'    foo() {}',
				'}',
				'class B extends A {',
				'    foo() {}',
				'}',
			),
			'ts',
			async (_editor: vscode.TextEditor, doc: vscode.TextDocument) => {
				const lenses = await getCodeLenses(doc);
				assert.strictEqual(lenses?.length, 1);
			},
		);
	});

	test('should show on all methods when showOnAllClassMethods is enabled', async () => {
		await updateConfig({
			[Config.showOnAllClassMethods]: true
		});

		await withRandomFileEditor(
			joinLines(
				'abstract class A {',
				'    foo() {}',
				'}',
				'class B extends A {',
				'    foo() {}',
				'}',
			),
			'ts',
			async (_editor: vscode.TextEditor, doc: vscode.TextDocument) => {
				const lenses = await getCodeLenses(doc);
				assert.strictEqual(lenses?.length, 3);

				assert.strictEqual(lenses?.[0].range.start.line, 0, 'Expected class A to have a CodeLens');
				assert.strictEqual(lenses?.[1].range.start.line, 1, 'Expected method A.foo to have a CodeLens');
				assert.strictEqual(lenses?.[2].range.start.line, 4, 'Expected method B.foo to have a CodeLens');
			},
		);
	});

	test('should not show on private methods when showOnAllClassMethods is enabled', async () => {
		await updateConfig({
			[Config.showOnAllClassMethods]: true
		});

		await withRandomFileEditor(
			joinLines(
				'abstract class A {',
				'    public foo() {}',
				'    private bar() {}',
				'    protected baz() {}',
				'}',
				'class B extends A {',
				'    public foo() {}',
				'    protected baz() {}',
				'}',
			),
			'ts',
			async (_editor: vscode.TextEditor, doc: vscode.TextDocument) => {
				const lenses = await getCodeLenses(doc);
				assert.strictEqual(lenses?.length, 5);

				assert.strictEqual(lenses?.[0].range.start.line, 0, 'Expected class A to have a CodeLens');
				assert.strictEqual(lenses?.[1].range.start.line, 1, 'Expected method A.foo to have a CodeLens');
				assert.strictEqual(lenses?.[2].range.start.line, 3, 'Expected method A.baz to have a CodeLens');
				assert.strictEqual(lenses?.[3].range.start.line, 6, 'Expected method B.foo to have a CodeLens');
				assert.strictEqual(lenses?.[4].range.start.line, 7, 'Expected method B.baz to have a CodeLens');
			},
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/test/smoke/index.ts]---
Location: vscode-main/extensions/typescript-language-features/src/test/smoke/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//
// PLEASE DO NOT MODIFY / DELETE UNLESS YOU KNOW WHAT YOU ARE DOING
//
// This file is providing the test runner to use when running extension tests.
// By default the test runner in use is Mocha based.
//
// You can provide your own test runner if you want to override it by exporting
// a function run(testRoot: string, clb: (error:Error) => void) that the extension
// host can call to run the tests. The test runner is expected to use console.log
// to report the results back to the caller. When the tests are finished, return
// a possible error to the callback or null if none.

const testRunner = require('../../../../../test/integration/electron/testrunner');

// You can directly control Mocha options by uncommenting the following lines
// See https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically#set-options for more info
testRunner.configure({
	ui: 'tdd', 		// the TDD UI is being used in extension.test.ts (suite, test, etc.)
	color: true,
	timeout: 60000,
});

export = testRunner;
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/test/smoke/jsDocCompletions.test.ts]---
Location: vscode-main/extensions/typescript-language-features/src/test/smoke/jsDocCompletions.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import * as vscode from 'vscode';
import { disposeAll } from '../../utils/dispose';
import { acceptFirstSuggestion } from '../suggestTestHelpers';
import { assertEditorContents, Config, createTestEditor, CURSOR, enumerateConfig, insertModesValues, joinLines, updateConfig, VsCodeConfiguration } from '../testUtils';

const testDocumentUri = vscode.Uri.parse('untitled:test.ts');

suite('JSDoc Completions', () => {
	const _disposables: vscode.Disposable[] = [];

	const configDefaults = Object.freeze<VsCodeConfiguration>({
		[Config.snippetSuggestions]: 'inline',
	});

	let oldConfig: { [key: string]: any } = {};

	setup(async () => {
		// the tests assume that typescript features are registered
		await vscode.extensions.getExtension('vscode.typescript-language-features')!.activate();

		// Save off config and apply defaults
		oldConfig = await updateConfig(testDocumentUri, configDefaults);
	});

	teardown(async () => {
		disposeAll(_disposables);

		// Restore config
		await updateConfig(testDocumentUri, oldConfig);

		return vscode.commands.executeCommand('workbench.action.closeAllEditors');
	});

	test('Should complete jsdoc inside single line comment', async () => {
		await enumerateConfig(testDocumentUri, Config.insertMode, insertModesValues, async config => {

			const editor = await createTestEditor(testDocumentUri,
				`/**$0 */`,
				`function abcdef(x, y) { }`,
			);

			await acceptFirstSuggestion(testDocumentUri, _disposables);

			assertEditorContents(editor,
				joinLines(
					`/**`,
					` * `,
					` * @param x ${CURSOR}`,
					` * @param y `,
					` */`,
					`function abcdef(x, y) { }`,
				),
				`Config: ${config}`);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/test/smoke/quickFix.test.ts]---
Location: vscode-main/extensions/typescript-language-features/src/test/smoke/quickFix.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import * as vscode from 'vscode';
import { createTestEditor, joinLines, retryUntilDocumentChanges, wait } from '../../test/testUtils';
import { disposeAll } from '../../utils/dispose';

suite.skip('TypeScript Quick Fix', () => {

	const _disposables: vscode.Disposable[] = [];

	setup(async () => {
		// the tests assume that typescript features are registered
		await vscode.extensions.getExtension('vscode.typescript-language-features')!.activate();
	});

	teardown(async () => {
		disposeAll(_disposables);

		await vscode.commands.executeCommand('workbench.action.closeAllEditors');
	});

	test('Fix all should not be marked as preferred #97866', async () => {
		const testDocumentUri = vscode.Uri.parse('untitled:test.ts');

		const editor = await createTestEditor(testDocumentUri,
			`export const _ = 1;`,
			`const a$0 = 1;`,
			`const b = 2;`,
		);

		await retryUntilDocumentChanges(testDocumentUri, { retries: 10, timeout: 500 }, _disposables, () => {
			return vscode.commands.executeCommand('editor.action.autoFix');
		});

		assert.strictEqual(editor.document.getText(), joinLines(
			`export const _ = 1;`,
			`const b = 2;`,
		));
	});

	test('Add import should be a preferred fix if there is only one possible import', async () => {
		const testDocumentUri = workspaceFile('foo.ts');

		await createTestEditor(testDocumentUri,
			`export const foo = 1;`);

		const editor = await createTestEditor(workspaceFile('index.ts'),
			`export const _ = 1;`,
			`foo$0;`
		);

		await retryUntilDocumentChanges(testDocumentUri, { retries: 10, timeout: 500 }, _disposables, () => {
			return vscode.commands.executeCommand('editor.action.autoFix');
		});

		// Document should not have been changed here

		assert.strictEqual(editor.document.getText(), joinLines(
			`import { foo } from "./foo";`,
			``,
			`export const _ = 1;`,
			`foo;`
		));
	});

	test('Add import should not be a preferred fix if are multiple possible imports', async () => {
		await createTestEditor(workspaceFile('foo.ts'),
			`export const foo = 1;`);

		await createTestEditor(workspaceFile('bar.ts'),
			`export const foo = 1;`);

		const editor = await createTestEditor(workspaceFile('index.ts'),
			`export const _ = 1;`,
			`foo$0;`
		);

		await wait(3000);

		await vscode.commands.executeCommand('editor.action.autoFix');

		await wait(500);

		assert.strictEqual(editor.document.getText(), joinLines(
			`export const _ = 1;`,
			`foo;`
		));
	});

	test('Only a single ts-ignore should be returned if there are multiple errors on one line #98274', async () => {
		const testDocumentUri = workspaceFile('foojs.js');
		const editor = await createTestEditor(testDocumentUri,
			`//@ts-check`,
			`const a = require('./bla');`);

		await wait(3000);

		const fixes = await vscode.commands.executeCommand<vscode.CodeAction[]>('vscode.executeCodeActionProvider',
			testDocumentUri,
			editor.document.lineAt(1).range
		);

		const ignoreFixes = fixes?.filter(x => x.title === 'Ignore this error message');
		assert.strictEqual(ignoreFixes?.length, 1);
	});

	test('Should prioritize implement interface over remove unused #94212', async () => {
		const testDocumentUri = workspaceFile('foo.ts');
		const editor = await createTestEditor(testDocumentUri,
			`export interface IFoo { value: string; }`,
			`class Foo implements IFoo { }`);

		await wait(3000);

		const fixes = await vscode.commands.executeCommand<vscode.CodeAction[]>('vscode.executeCodeActionProvider',
			testDocumentUri,
			editor.document.lineAt(1).range
		);

		assert.strictEqual(fixes?.length, 2);
		assert.strictEqual(fixes![0].title, `Implement interface 'IFoo'`);
		assert.strictEqual(fixes![1].title, `Remove unused declaration for: 'Foo'`);
	});

	test('Should prioritize implement abstract class over remove unused #101486', async () => {
		const testDocumentUri = workspaceFile('foo.ts');
		const editor = await createTestEditor(testDocumentUri,
			`export abstract class Foo { abstract foo(): number; }`,
			`class ConcreteFoo extends Foo { }`,
		);

		await wait(3000);

		const fixes = await vscode.commands.executeCommand<vscode.CodeAction[]>('vscode.executeCodeActionProvider',
			testDocumentUri,
			editor.document.lineAt(1).range
		);

		assert.strictEqual(fixes?.length, 2);
		assert.strictEqual(fixes![0].title, `Implement inherited abstract class`);
		assert.strictEqual(fixes![1].title, `Remove unused declaration for: 'ConcreteFoo'`);
	});

	test('Add all missing imports should come after other add import fixes #98613', async () => {
		await createTestEditor(workspaceFile('foo.ts'),
			`export const foo = 1;`);

		await createTestEditor(workspaceFile('bar.ts'),
			`export const foo = 1;`);

		const editor = await createTestEditor(workspaceFile('index.ts'),
			`export const _ = 1;`,
			`foo$0;`,
			`foo$0;`
		);

		await wait(3000);

		const fixes = await vscode.commands.executeCommand<vscode.CodeAction[]>('vscode.executeCodeActionProvider',
			workspaceFile('index.ts'),
			editor.document.lineAt(1).range
		);

		assert.strictEqual(fixes?.length, 3);
		assert.strictEqual(fixes![0].title, `Import 'foo' from module "./bar"`);
		assert.strictEqual(fixes![1].title, `Import 'foo' from module "./foo"`);
		assert.strictEqual(fixes![2].title, `Add all missing imports`);
	});
});

function workspaceFile(fileName: string) {
	return vscode.Uri.joinPath(vscode.workspace.workspaceFolders![0].uri, fileName);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/test/smoke/referencesCodeLens.test.ts]---
Location: vscode-main/extensions/typescript-language-features/src/test/smoke/referencesCodeLens.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import * as vscode from 'vscode';
import { createTestEditor, wait } from '../../test/testUtils';
import { disposeAll } from '../../utils/dispose';


export type VsCodeConfiguration = { [key: string]: any };

export async function updateConfig(newConfig: VsCodeConfiguration): Promise<VsCodeConfiguration> {
	const oldConfig: VsCodeConfiguration = {};
	const config = vscode.workspace.getConfiguration(undefined);
	for (const configKey of Object.keys(newConfig)) {
		oldConfig[configKey] = config.get(configKey);
		await new Promise<void>((resolve, reject) =>
			config.update(configKey, newConfig[configKey], vscode.ConfigurationTarget.Global)
				.then(() => resolve(), reject));
	}
	return oldConfig;
}

namespace Config {
	export const referencesCodeLens = 'typescript.referencesCodeLens.enabled';
}

suite('TypeScript References', () => {
	const configDefaults = Object.freeze<VsCodeConfiguration>({
		[Config.referencesCodeLens]: true,
	});

	const _disposables: vscode.Disposable[] = [];
	let oldConfig: { [key: string]: any } = {};

	setup(async () => {
		// the tests assume that typescript features are registered
		await vscode.extensions.getExtension('vscode.typescript-language-features')!.activate();

		// Save off config and apply defaults
		oldConfig = await updateConfig(configDefaults);
	});

	teardown(async () => {
		disposeAll(_disposables);

		// Restore config
		await updateConfig(oldConfig);

		return vscode.commands.executeCommand('workbench.action.closeAllEditors');
	});

	test('Should show on basic class', async () => {
		const testDocumentUri = vscode.Uri.parse('untitled:test1.ts');
		await createTestEditor(testDocumentUri,
			`class Foo {}`
		);

		const codeLenses = await getCodeLenses(testDocumentUri);
		assert.strictEqual(codeLenses?.length, 1);
		assert.strictEqual(codeLenses?.[0].range.start.line, 0);
	});

	test('Should show on basic class properties', async () => {
		const testDocumentUri = vscode.Uri.parse('untitled:test2.ts');
		await createTestEditor(testDocumentUri,
			`class Foo {`,
			`	prop: number;`,
			`	meth(): void {}`,
			`}`
		);

		const codeLenses = await getCodeLenses(testDocumentUri);
		assert.strictEqual(codeLenses?.length, 3);
		assert.strictEqual(codeLenses?.[0].range.start.line, 0);
		assert.strictEqual(codeLenses?.[1].range.start.line, 1);
		assert.strictEqual(codeLenses?.[2].range.start.line, 2);
	});

	test('Should not show on const property', async () => {
		const testDocumentUri = vscode.Uri.parse('untitled:test3.ts');
		await createTestEditor(testDocumentUri,
			`const foo = {`,
			`	prop: 1;`,
			`	meth(): void {}`,
			`}`
		);

		const codeLenses = await getCodeLenses(testDocumentUri);
		assert.strictEqual(codeLenses?.length, 0);
	});

	test.skip('Should not show duplicate references on ES5 class (https://github.com/microsoft/vscode/issues/90396)', async () => {
		const testDocumentUri = vscode.Uri.parse('untitled:test3.js');
		await createTestEditor(testDocumentUri,
			`function A() {`,
			`    console.log("hi");`,
			`}`,
			`A.x = {};`,
		);

		await wait(500);
		const codeLenses = await getCodeLenses(testDocumentUri);
		assert.strictEqual(codeLenses?.length, 1);
	});
});

function getCodeLenses(document: vscode.Uri): Thenable<readonly vscode.CodeLens[] | undefined> {
	return vscode.commands.executeCommand<readonly vscode.CodeLens[]>('vscode.executeCodeLensProvider', document, 100);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/test/unit/cachedResponse.test.ts]---
Location: vscode-main/extensions/typescript-language-features/src/test/unit/cachedResponse.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import * as vscode from 'vscode';
import { CachedResponse } from '../../tsServer/cachedResponse';
import type * as Proto from '../../tsServer/protocol/protocol';
import { ServerResponse } from '../../typescriptService';

suite('CachedResponse', () => {
	test('should cache simple response for same document', async () => {
		const doc = await createTextDocument();
		const response = new CachedResponse();

		assertResult(await response.execute(doc, respondWith('test-0')), 'test-0');
		assertResult(await response.execute(doc, respondWith('test-1')), 'test-0');
	});

	test('should invalidate cache for new document', async () => {
		const doc1 = await createTextDocument();
		const doc2 = await createTextDocument();
		const response = new CachedResponse();

		assertResult(await response.execute(doc1, respondWith('test-0')), 'test-0');
		assertResult(await response.execute(doc1, respondWith('test-1')), 'test-0');
		assertResult(await response.execute(doc2, respondWith('test-2')), 'test-2');
		assertResult(await response.execute(doc2, respondWith('test-3')), 'test-2');
		assertResult(await response.execute(doc1, respondWith('test-4')), 'test-4');
		assertResult(await response.execute(doc1, respondWith('test-5')), 'test-4');
	});

	test('should not cache cancelled responses', async () => {
		const doc = await createTextDocument();
		const response = new CachedResponse();

		const cancelledResponder = createEventualResponder<ServerResponse.Cancelled>();
		const result1 = response.execute(doc, () => cancelledResponder.promise);
		const result2 = response.execute(doc, respondWith('test-0'));
		const result3 = response.execute(doc, respondWith('test-1'));

		cancelledResponder.resolve(new ServerResponse.Cancelled('cancelled'));

		assert.strictEqual((await result1).type, 'cancelled');
		assertResult(await result2, 'test-0');
		assertResult(await result3, 'test-0');
	});

	test('should not care if subsequent requests are cancelled if first request is resolved ok', async () => {
		const doc = await createTextDocument();
		const response = new CachedResponse();

		const cancelledResponder = createEventualResponder<ServerResponse.Cancelled>();
		const result1 = response.execute(doc, respondWith('test-0'));
		const result2 = response.execute(doc, () => cancelledResponder.promise);
		const result3 = response.execute(doc, respondWith('test-1'));

		cancelledResponder.resolve(new ServerResponse.Cancelled('cancelled'));

		assertResult(await result1, 'test-0');
		assertResult(await result2, 'test-0');
		assertResult(await result3, 'test-0');
	});

	test('should not cache cancelled responses with document changes', async () => {
		const doc1 = await createTextDocument();
		const doc2 = await createTextDocument();
		const response = new CachedResponse();

		const cancelledResponder = createEventualResponder<ServerResponse.Cancelled>();
		const cancelledResponder2 = createEventualResponder<ServerResponse.Cancelled>();

		const result1 = response.execute(doc1, () => cancelledResponder.promise);
		const result2 = response.execute(doc1, respondWith('test-0'));
		const result3 = response.execute(doc1, respondWith('test-1'));
		const result4 = response.execute(doc2, () => cancelledResponder2.promise);
		const result5 = response.execute(doc2, respondWith('test-2'));
		const result6 = response.execute(doc1, respondWith('test-3'));

		cancelledResponder.resolve(new ServerResponse.Cancelled('cancelled'));
		cancelledResponder2.resolve(new ServerResponse.Cancelled('cancelled'));

		assert.strictEqual((await result1).type, 'cancelled');
		assertResult(await result2, 'test-0');
		assertResult(await result3, 'test-0');
		assert.strictEqual((await result4).type, 'cancelled');
		assertResult(await result5, 'test-2');
		assertResult(await result6, 'test-3');
	});
});

function respondWith(command: string) {
	return async () => createResponse(command);
}

function createTextDocument() {
	return vscode.workspace.openTextDocument({ language: 'javascript', content: '' });
}

function assertResult(result: ServerResponse.Response<Proto.Response>, command: string) {
	if (result.type === 'response') {
		assert.strictEqual(result.command, command);
	} else {
		assert.fail('Response failed');
	}
}

function createResponse(command: string): Proto.Response {
	return {
		type: 'response',
		body: {},
		command: command,
		request_seq: 1,
		success: true,
		seq: 1
	};
}

function createEventualResponder<T>(): { promise: Promise<T>; resolve: (x: T) => void } {
	let resolve: (value: T) => void;
	const promise = new Promise<T>(r => { resolve = r; });
	return { promise, resolve: resolve! };
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/test/unit/functionCallSnippet.test.ts]---
Location: vscode-main/extensions/typescript-language-features/src/test/unit/functionCallSnippet.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import * as vscode from 'vscode';
import { snippetForFunctionCall } from '../../languageFeatures/util/snippetForFunctionCall';

suite('typescript function call snippets', () => {
	test('Should use label as function name', async () => {
		assert.strictEqual(
			snippetForFunctionCall(
				{ label: 'abc', },
				[]
			).snippet.value,
			'abc()$0');
	});

	test('Should use insertText string to override function name', async () => {
		assert.strictEqual(
			snippetForFunctionCall(
				{ label: 'abc', insertText: 'def' },
				[]
			).snippet.value,
			'def()$0');
	});

	test('Should return insertText as-is if it is already a snippet', async () => {
		assert.strictEqual(
			snippetForFunctionCall(
				{ label: 'abc', insertText: new vscode.SnippetString('bla()$0') },
				[]
			).snippet.value,
			'bla()$0');
	});

	test('Should return insertText as-is if it is already a snippet', async () => {
		assert.strictEqual(
			snippetForFunctionCall(
				{ label: 'abc', insertText: new vscode.SnippetString('bla()$0') },
				[]
			).snippet.value,
			'bla()$0');
	});

	test('Should extract parameter from display parts', async () => {
		assert.strictEqual(
			snippetForFunctionCall(
				{ label: 'activate' },
				[{ 'text': 'function', 'kind': 'keyword' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'activate', 'kind': 'text' }, { 'text': '(', 'kind': 'punctuation' }, { 'text': 'context', 'kind': 'parameterName' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'vscode', 'kind': 'aliasName' }, { 'text': '.', 'kind': 'punctuation' }, { 'text': 'ExtensionContext', 'kind': 'interfaceName' }, { 'text': ')', 'kind': 'punctuation' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'void', 'kind': 'keyword' }]
			).snippet.value,
			'activate(${1:context})$0');
	});

	test('Should extract all parameters from display parts', async () => {
		assert.strictEqual(
			snippetForFunctionCall(
				{ label: 'foo' },
				[{ 'text': 'function', 'kind': 'keyword' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'foo', 'kind': 'functionName' }, { 'text': '(', 'kind': 'punctuation' }, { 'text': 'a', 'kind': 'parameterName' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'string', 'kind': 'keyword' }, { 'text': ',', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'b', 'kind': 'parameterName' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'number', 'kind': 'keyword' }, { 'text': ',', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'c', 'kind': 'parameterName' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'boolean', 'kind': 'keyword' }, { 'text': ')', 'kind': 'punctuation' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'void', 'kind': 'keyword' }]
			).snippet.value,
			'foo(${1:a}, ${2:b}, ${3:c})$0');
	});

	test('Should create empty placeholder at rest parameter', async () => {
		assert.strictEqual(
			snippetForFunctionCall(
				{ label: 'foo' },
				[{ 'text': 'function', 'kind': 'keyword' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'foo', 'kind': 'functionName' }, { 'text': '(', 'kind': 'punctuation' }, { 'text': 'a', 'kind': 'parameterName' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'string', 'kind': 'keyword' }, { 'text': ',', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': '...', 'kind': 'punctuation' }, { 'text': 'rest', 'kind': 'parameterName' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'any', 'kind': 'keyword' }, { 'text': '[', 'kind': 'punctuation' }, { 'text': ']', 'kind': 'punctuation' }, { 'text': ')', 'kind': 'punctuation' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'void', 'kind': 'keyword' }]
			).snippet.value,
			'foo(${1:a}$2)$0');
	});

	test('Should skip over inline function and object types when extracting parameters', async () => {
		assert.strictEqual(
			snippetForFunctionCall(
				{ label: 'foo' },
				[{ 'text': 'function', 'kind': 'keyword' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'foo', 'kind': 'functionName' }, { 'text': '(', 'kind': 'punctuation' }, { 'text': 'a', 'kind': 'parameterName' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': '(', 'kind': 'punctuation' }, { 'text': 'x', 'kind': 'parameterName' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'number', 'kind': 'keyword' }, { 'text': ')', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': '=>', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': '{', 'kind': 'punctuation' }, { 'text': '\n', 'kind': 'lineBreak' }, { 'text': '    ', 'kind': 'space' }, { 'text': 'f', 'kind': 'propertyName' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': '(', 'kind': 'punctuation' }, { 'text': ')', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': '=>', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'void', 'kind': 'keyword' }, { 'text': ';', 'kind': 'punctuation' }, { 'text': '\n', 'kind': 'lineBreak' }, { 'text': '}', 'kind': 'punctuation' }, { 'text': ',', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'b', 'kind': 'parameterName' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': '{', 'kind': 'punctuation' }, { 'text': '\n', 'kind': 'lineBreak' }, { 'text': '    ', 'kind': 'space' }, { 'text': 'f', 'kind': 'propertyName' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': '(', 'kind': 'punctuation' }, { 'text': ')', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': '=>', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'void', 'kind': 'keyword' }, { 'text': ';', 'kind': 'punctuation' }, { 'text': '\n', 'kind': 'lineBreak' }, { 'text': '}', 'kind': 'punctuation' }, { 'text': ')', 'kind': 'punctuation' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'void', 'kind': 'keyword' }]
			).snippet.value,
			'foo(${1:a}, ${2:b})$0');
	});

	test('Should skip over return type while extracting parameters', async () => {
		assert.strictEqual(
			snippetForFunctionCall(
				{ label: 'foo' },
				[{ 'text': 'function', 'kind': 'keyword' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'foo', 'kind': 'functionName' }, { 'text': '(', 'kind': 'punctuation' }, { 'text': 'a', 'kind': 'parameterName' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'number', 'kind': 'keyword' }, { 'text': ')', 'kind': 'punctuation' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': '{', 'kind': 'punctuation' }, { 'text': '\n', 'kind': 'lineBreak' }, { 'text': '    ', 'kind': 'space' }, { 'text': 'f', 'kind': 'propertyName' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': '(', 'kind': 'punctuation' }, { 'text': 'b', 'kind': 'parameterName' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'number', 'kind': 'keyword' }, { 'text': ')', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': '=>', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'number', 'kind': 'keyword' }, { 'text': ';', 'kind': 'punctuation' }, { 'text': '\n', 'kind': 'lineBreak' }, { 'text': '}', 'kind': 'punctuation' }]
			).snippet.value,
			'foo(${1:a})$0');
	});

	test('Should skip over prefix type while extracting parameters', async () => {
		assert.strictEqual(
			snippetForFunctionCall(
				{ label: 'foo' },
				[{ 'text': '(', 'kind': 'punctuation' }, { 'text': 'method', 'kind': 'text' }, { 'text': ')', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'Array', 'kind': 'localName' }, { 'text': '<', 'kind': 'punctuation' }, { 'text': '{', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'dispose', 'kind': 'methodName' }, { 'text': '(', 'kind': 'punctuation' }, { 'text': ')', 'kind': 'punctuation' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'any', 'kind': 'keyword' }, { 'text': ';', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': '}', 'kind': 'punctuation' }, { 'text': '>', 'kind': 'punctuation' }, { 'text': '.', 'kind': 'punctuation' }, { 'text': 'foo', 'kind': 'methodName' }, { 'text': '(', 'kind': 'punctuation' }, { 'text': 'searchElement', 'kind': 'parameterName' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': '{', 'kind': 'punctuation' }, { 'text': '\n', 'kind': 'lineBreak' }, { 'text': '    ', 'kind': 'space' }, { 'text': 'dispose', 'kind': 'methodName' }, { 'text': '(', 'kind': 'punctuation' }, { 'text': ')', 'kind': 'punctuation' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'any', 'kind': 'keyword' }, { 'text': ';', 'kind': 'punctuation' }, { 'text': '\n', 'kind': 'lineBreak' }, { 'text': '}', 'kind': 'punctuation' }, { 'text': ',', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'fromIndex', 'kind': 'parameterName' }, { 'text': '?', 'kind': 'punctuation' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'number', 'kind': 'keyword' }, { 'text': ')', 'kind': 'punctuation' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'number', 'kind': 'keyword' }]
			).snippet.value,
			'foo(${1:searchElement}$2)$0');
	});

	test('Should complete property names', async () => {
		assert.strictEqual(
			snippetForFunctionCall(
				{ label: 'methoda' },
				[{ 'text': '(', 'kind': 'punctuation' }, { 'text': 'method', 'kind': 'text' }, { 'text': ')', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'methoda', 'kind': 'propertyName' }, { 'text': '(', 'kind': 'punctuation' }, { 'text': 'x', 'kind': 'parameterName' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'number', 'kind': 'keyword' }, { 'text': ')', 'kind': 'punctuation' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'void', 'kind': 'keyword' }]
			).snippet.value,
			'methoda(${1:x})$0');
	});

	test('Should escape snippet syntax in method name', async () => {
		assert.strictEqual(
			snippetForFunctionCall(
				{ label: '$abc', },
				[]
			).snippet.value,
			'\\$abc()$0');
	});

	test('Should not include object key signature in completion, #66297', async () => {
		assert.strictEqual(
			snippetForFunctionCall(
				{ label: 'foobar', },
				[{ 'text': 'function', 'kind': 'keyword' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'foobar', 'kind': 'functionName' }, { 'text': '(', 'kind': 'punctuation' }, { 'text': 'param', 'kind': 'parameterName' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': '{', 'kind': 'punctuation' }, { 'text': '\n', 'kind': 'lineBreak' }, { 'text': '    ', 'kind': 'space' }, { 'text': '[', 'kind': 'punctuation' }, { 'text': 'key', 'kind': 'parameterName' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'string', 'kind': 'keyword' }, { 'text': ']', 'kind': 'punctuation' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'string', 'kind': 'keyword' }, { 'text': ';', 'kind': 'punctuation' }, { 'text': '\n', 'kind': 'lineBreak' }, { 'text': '}', 'kind': 'punctuation' }, { 'text': ')', 'kind': 'punctuation' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'void', 'kind': 'keyword' }]
			).snippet.value,
			'foobar(${1:param})$0');
	});

	test('Should skip over this parameter', async () => {
		assert.strictEqual(
			snippetForFunctionCall(
				{ label: 'foobar', },
				[{ 'text': 'function', 'kind': 'keyword' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'foobar', 'kind': 'functionName' }, { 'text': '(', 'kind': 'punctuation' }, { 'text': 'this', 'kind': 'parameterName' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'string', 'kind': 'keyword' }, { 'text': ',', 'kind': 'punctuation' }, { 'text': 'param', 'kind': 'parameterName' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'string', 'kind': 'keyword' }, { 'text': ')', 'kind': 'punctuation' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'void', 'kind': 'keyword' }]
			).snippet.value,
			'foobar(${1:param})$0');
	});

	test('Should not skip mid-list optional parameter', async () => {
		assert.strictEqual(
			snippetForFunctionCall(
				{ label: 'foobar', },
				[{ 'text': 'function', 'kind': 'keyword' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'foobar', 'kind': 'functionName' }, { 'text': '(', 'kind': 'punctuation' }, { 'text': 'alpha', 'kind': 'parameterName' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'string', 'kind': 'keyword' }, { 'text': ',', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'beta', 'kind': 'parameterName' }, { 'text': '?', 'kind': 'punctuation' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'number', 'kind': 'keyword' }, { 'text': ' ', 'kind': 'space' }, { 'text': '|', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'undefined', 'kind': 'keyword' }, { 'text': ',', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'gamma', 'kind': 'parameterName' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'string', 'kind': 'keyword' }, { 'text': ')', 'kind': 'punctuation' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'void', 'kind': 'keyword' }]
			).snippet.value,
			'foobar(${1:alpha}, ${2:beta}, ${3:gamma}$4)$0');
	});

	test('Should skip end-of-list optional parameters', async () => {
		assert.strictEqual(
			snippetForFunctionCall(
				{ label: 'foobar', },
				[{ 'text': 'function', 'kind': 'keyword' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'foobar', 'kind': 'functionName' }, { 'text': '(', 'kind': 'punctuation' }, { 'text': 'alpha', 'kind': 'parameterName' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'string', 'kind': 'keyword' }, { 'text': ',', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'beta', 'kind': 'parameterName' }, { 'text': '?', 'kind': 'punctuation' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'number', 'kind': 'keyword' }, { 'text': ' ', 'kind': 'space' }, { 'text': '|', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'undefined', 'kind': 'keyword' }, { 'text': ',', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'gamma', 'kind': 'parameterName' }, { 'text': '?', 'kind': 'punctuation' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'number', 'kind': 'keyword' }, { 'text': ' ', 'kind': 'space' }, { 'text': '|', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'undefined', 'kind': 'keyword' }, { 'text': ')', 'kind': 'punctuation' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'void', 'kind': 'keyword' }]
			).snippet.value,
			'foobar(${1:alpha}$2)$0');
	});

	// A more complex case
	test('Should skip end-of-list optional params but should not skip start-of-list and mid-list ones', async () => {
		assert.strictEqual(
			snippetForFunctionCall(
				{ label: 'foobar', },
				[{ 'text': 'function', 'kind': 'keyword' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'foobar', 'kind': 'functionName' }, { 'text': '(', 'kind': 'punctuation' }, { 'text': 'a', 'kind': 'parameterName' }, { 'text': '?', 'kind': 'punctuation' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'number', 'kind': 'keyword' }, { 'text': ' ', 'kind': 'space' }, { 'text': '|', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'undefined', 'kind': 'keyword' }, { 'text': ',', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'b', 'kind': 'parameterName' }, { 'text': '?', 'kind': 'punctuation' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'number', 'kind': 'keyword' }, { 'text': ' ', 'kind': 'space' }, { 'text': '|', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'undefined', 'kind': 'keyword' }, { 'text': ',', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'c', 'kind': 'parameterName' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'string', 'kind': 'keyword' }, { 'text': ',', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' },
				{ 'text': 'd', 'kind': 'parameterName' }, { 'text': '?', 'kind': 'punctuation' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'number', 'kind': 'keyword' }, { 'text': ' ', 'kind': 'space' }, { 'text': '|', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'undefined', 'kind': 'keyword' }, { 'text': ',', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'e', 'kind': 'parameterName' }, { 'text': '?', 'kind': 'punctuation' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'number', 'kind': 'keyword' }, { 'text': ' ', 'kind': 'space' }, { 'text': '|', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'undefined', 'kind': 'keyword' }, { 'text': ',', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'f', 'kind': 'parameterName' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'string', 'kind': 'keyword' }, { 'text': ',', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' },
				{ 'text': 'g', 'kind': 'parameterName' }, { 'text': '?', 'kind': 'punctuation' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'number', 'kind': 'keyword' }, { 'text': ' ', 'kind': 'space' }, { 'text': '|', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'undefined', 'kind': 'keyword' }, { 'text': ',', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'h', 'kind': 'parameterName' }, { 'text': '?', 'kind': 'punctuation' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'number', 'kind': 'keyword' }, { 'text': ' ', 'kind': 'space' }, { 'text': '|', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'undefined', 'kind': 'keyword' }, { 'text': ')', 'kind': 'punctuation' }, { 'text': ':', 'kind': 'punctuation' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'void', 'kind': 'keyword' }]
			).snippet.value,
			'foobar(${1:a}, ${2:b}, ${3:c}, ${4:d}, ${5:e}, ${6:f}$7)$0');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/test/unit/index.ts]---
Location: vscode-main/extensions/typescript-language-features/src/test/unit/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//
// PLEASE DO NOT MODIFY / DELETE UNLESS YOU KNOW WHAT YOU ARE DOING
//
// This file is providing the test runner to use when running extension tests.
// By default the test runner in use is Mocha based.
//
// You can provide your own test runner if you want to override it by exporting
// a function run(testRoot: string, clb: (error:Error) => void) that the extension
// host can call to run the tests. The test runner is expected to use console.log
// to report the results back to the caller. When the tests are finished, return
// a possible error to the callback or null if none.

const path = require('path');
const testRunner = require('../../../../../test/integration/electron/testrunner');

const suite = 'Integration TypeScript Tests';

const options: import('mocha').MochaOptions = {
	ui: 'tdd',
	color: true,
	timeout: 60000
};

if (process.env.BUILD_ARTIFACTSTAGINGDIRECTORY) {
	options.reporter = 'mocha-multi-reporters';
	options.reporterOptions = {
		reporterEnabled: 'spec, mocha-junit-reporter',
		mochaJunitReporterReporterOptions: {
			testsuitesTitle: `${suite} ${process.platform}`,
			mochaFile: path.join(process.env.BUILD_ARTIFACTSTAGINGDIRECTORY, `test-results/${process.platform}-${process.arch}-${suite.toLowerCase().replace(/[^\w]/g, '-')}-results.xml`)
		}
	};
}

testRunner.configure(options);

export = testRunner;
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/test/unit/jsdocSnippet.test.ts]---
Location: vscode-main/extensions/typescript-language-features/src/test/unit/jsdocSnippet.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import * as vscode from 'vscode';
import { templateToSnippet } from '../../languageFeatures/jsDocCompletions';
import { joinLines } from '../testUtils';

suite('typescript.jsDocSnippet', () => {

	setup(async () => {
		// the tests assume that typescript features are registered
		await vscode.extensions.getExtension('vscode.typescript-language-features')!.activate();
	});

	test('Should do nothing for single line input', async () => {
		const input = `/** */`;
		assert.strictEqual(templateToSnippet(input).value, input);
	});

	test('Should put cursor inside multiline line input', async () => {
		assert.strictEqual(
			templateToSnippet(joinLines(
				'/**',
				' * ',
				' */'
			)).value,
			joinLines(
				'/**',
				' * $0',
				' */'
			));
	});

	test('Should add placeholders after each parameter', async () => {
		assert.strictEqual(
			templateToSnippet(joinLines(
				'/**',
				' * @param a',
				' * @param b',
				' */'
			)).value,
			joinLines(
				'/**',
				' * @param a ${1}',
				' * @param b ${2}',
				' */'
			));
	});

	test('Should add placeholders for types', async () => {
		assert.strictEqual(
			templateToSnippet(joinLines(
				'/**',
				' * @param {*} a',
				' * @param {*} b',
				' */'
			)).value,
			joinLines(
				'/**',
				' * @param {${1:*}} a ${2}',
				' * @param {${3:*}} b ${4}',
				' */'
			));
	});

	test('Should properly escape dollars in parameter names', async () => {
		assert.strictEqual(
			templateToSnippet(joinLines(
				'/**',
				' * ',
				' * @param $arg',
				' */'
			)).value,
			joinLines(
				'/**',
				' * $0',
				' * @param \\$arg ${1}',
				' */'
			));
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/test/unit/onEnter.test.ts]---
Location: vscode-main/extensions/typescript-language-features/src/test/unit/onEnter.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import * as vscode from 'vscode';
import { CURSOR, joinLines, wait, withRandomFileEditor } from '../testUtils';

const onDocumentChange = (doc: vscode.TextDocument): Promise<vscode.TextDocument> => {
	return new Promise<vscode.TextDocument>(resolve => {
		const sub = vscode.workspace.onDidChangeTextDocument(e => {
			if (e.document !== doc) {
				return;
			}
			sub.dispose();
			resolve(e.document);
		});
	});
};

const type = async (document: vscode.TextDocument, text: string): Promise<vscode.TextDocument> => {
	const onChange = onDocumentChange(document);
	await vscode.commands.executeCommand('type', { text });
	await onChange;
	return document;
};

suite.skip('OnEnter', () => {
	setup(async () => {
		// the tests make the assumption that language rules are registered
		await vscode.extensions.getExtension('vscode.typescript-language-features')!.activate();
	});

	test('should indent after if block with braces', () => {
		return withRandomFileEditor(`if (true) {${CURSOR}`, 'js', async (_editor, document) => {
			await type(document, '\nx');
			assert.strictEqual(
				document.getText(),
				joinLines(
					`if (true) {`,
					`    x`));
		});
	});

	test('should indent within empty object literal', () => {
		return withRandomFileEditor(`({${CURSOR}})`, 'js', async (_editor, document) => {
			await type(document, '\nx');
			await wait(500);

			assert.strictEqual(
				document.getText(),
				joinLines(`({`,
					`    x`,
					`})`));
		});
	});

	test('should indent after simple jsx tag with attributes', () => {
		return withRandomFileEditor(`const a = <div onclick={bla}>${CURSOR}`, 'jsx', async (_editor, document) => {
			await type(document, '\nx');
			assert.strictEqual(
				document.getText(),
				joinLines(
					`const a = <div onclick={bla}>`,
					`    x`));
		});
	});

	test('should not indent after a multi-line comment block 1', () => {
		return withRandomFileEditor(`/*-----\n * line 1\n * line 2\n *-----*/\n${CURSOR}`, 'js', async (_editor, document) => {
			await type(document, '\nx');
			assert.strictEqual(
				document.getText(),
				joinLines(
					`/*-----`,
					` * line 1`,
					` * line 2`,
					` *-----*/`,
					``,
					`x`));
		});
	});

	test('should not indent after a multi-line comment block 2', () => {
		return withRandomFileEditor(`/*-----\n * line 1\n * line 2\n */\n${CURSOR}`, 'js', async (_editor, document) => {
			await type(document, '\nx');
			assert.strictEqual(
				document.getText(),
				joinLines(
					`/*-----`,
					` * line 1`,
					` * line 2`,
					` */`,
					``,
					`x`));
		});
	});

	test('should indent within a multi-line comment block', () => {
		return withRandomFileEditor(`/*-----\n * line 1\n * line 2${CURSOR}`, 'js', async (_editor, document) => {
			await type(document, '\nx');
			assert.strictEqual(
				document.getText(),
				joinLines(
					`/*-----`,
					` * line 1`,
					` * line 2`,
					` * x`));
		});
	});

	test('should indent after if block followed by comment with quote', () => {
		return withRandomFileEditor(`if (true) { // '${CURSOR}`, 'js', async (_editor, document) => {
			await type(document, '\nx');
			assert.strictEqual(
				document.getText(),
				joinLines(
					`if (true) { // '`,
					`    x`));
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/test/unit/requestQueue.test.ts]---
Location: vscode-main/extensions/typescript-language-features/src/test/unit/requestQueue.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import { RequestQueue, RequestQueueingType } from '../../tsServer/requestQueue';

suite('RequestQueue', () => {
	test('should be empty on creation', async () => {
		const queue = new RequestQueue();
		assert.strictEqual(queue.length, 0);
		assert.strictEqual(queue.dequeue(), undefined);
	});

	suite('RequestQueue.createRequest', () => {
		test('should create items with increasing sequence numbers', async () => {
			const queue = new RequestQueue();

			for (let i = 0; i < 100; ++i) {
				const command = `command-${i}`;
				const request = queue.createRequest(command, i);
				assert.strictEqual(request.seq, i);
				assert.strictEqual(request.command, command);
				assert.strictEqual(request.arguments, i);
			}
		});
	});

	test('should queue normal requests in first in first out order', async () => {
		const queue = new RequestQueue();
		assert.strictEqual(queue.length, 0);

		const request1 = queue.createRequest('a', 1);
		queue.enqueue({ request: request1, expectsResponse: true, isAsync: false, queueingType: RequestQueueingType.Normal });
		assert.strictEqual(queue.length, 1);

		const request2 = queue.createRequest('b', 2);
		queue.enqueue({ request: request2, expectsResponse: true, isAsync: false, queueingType: RequestQueueingType.Normal });
		assert.strictEqual(queue.length, 2);

		{
			const item = queue.dequeue();
			assert.strictEqual(queue.length, 1);
			assert.strictEqual(item!.request.command, 'a');
		}
		{
			const item = queue.dequeue();
			assert.strictEqual(queue.length, 0);
			assert.strictEqual(item!.request.command, 'b');
		}
		{
			const item = queue.dequeue();
			assert.strictEqual(item, undefined);
			assert.strictEqual(queue.length, 0);
		}
	});

	test('should put normal requests in front of low priority requests', async () => {
		const queue = new RequestQueue();
		assert.strictEqual(queue.length, 0);

		queue.enqueue({ request: queue.createRequest('low-1', 1), expectsResponse: true, isAsync: false, queueingType: RequestQueueingType.LowPriority });
		queue.enqueue({ request: queue.createRequest('low-2', 1), expectsResponse: true, isAsync: false, queueingType: RequestQueueingType.LowPriority });
		queue.enqueue({ request: queue.createRequest('normal-1', 2), expectsResponse: true, isAsync: false, queueingType: RequestQueueingType.Normal });
		queue.enqueue({ request: queue.createRequest('normal-2', 2), expectsResponse: true, isAsync: false, queueingType: RequestQueueingType.Normal });

		{
			const item = queue.dequeue();
			assert.strictEqual(queue.length, 3);
			assert.strictEqual(item!.request.command, 'normal-1');
		}
		{
			const item = queue.dequeue();
			assert.strictEqual(queue.length, 2);
			assert.strictEqual(item!.request.command, 'normal-2');
		}
		{
			const item = queue.dequeue();
			assert.strictEqual(queue.length, 1);
			assert.strictEqual(item!.request.command, 'low-1');
		}
		{
			const item = queue.dequeue();
			assert.strictEqual(queue.length, 0);
			assert.strictEqual(item!.request.command, 'low-2');
		}
	});

	test('should not push fence requests front of low priority requests', async () => {
		const queue = new RequestQueue();
		assert.strictEqual(queue.length, 0);

		queue.enqueue({ request: queue.createRequest('low-1', 0), expectsResponse: true, isAsync: false, queueingType: RequestQueueingType.LowPriority });
		queue.enqueue({ request: queue.createRequest('fence', 0), expectsResponse: true, isAsync: false, queueingType: RequestQueueingType.Fence });
		queue.enqueue({ request: queue.createRequest('low-2', 0), expectsResponse: true, isAsync: false, queueingType: RequestQueueingType.LowPriority });
		queue.enqueue({ request: queue.createRequest('normal', 0), expectsResponse: true, isAsync: false, queueingType: RequestQueueingType.Normal });

		{
			const item = queue.dequeue();
			assert.strictEqual(queue.length, 3);
			assert.strictEqual(item!.request.command, 'low-1');
		}
		{
			const item = queue.dequeue();
			assert.strictEqual(queue.length, 2);
			assert.strictEqual(item!.request.command, 'fence');
		}
		{
			const item = queue.dequeue();
			assert.strictEqual(queue.length, 1);
			assert.strictEqual(item!.request.command, 'normal');
		}
		{
			const item = queue.dequeue();
			assert.strictEqual(queue.length, 0);
			assert.strictEqual(item!.request.command, 'low-2');
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/test/unit/server.test.ts]---
Location: vscode-main/extensions/typescript-language-features/src/test/unit/server.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import * as stream from 'stream';
import { Logger } from '../../logging/logger';
import { TelemetryReporter } from '../../logging/telemetry';
import Tracer from '../../logging/tracer';
import { NodeRequestCanceller } from '../../tsServer/cancellation.electron';
import type * as Proto from '../../tsServer/protocol/protocol';
import { SingleTsServer, TsServerProcess } from '../../tsServer/server';
import { ServerType } from '../../typescriptService';
import { nulToken } from '../../utils/cancellation';


const NoopTelemetryReporter = new class implements TelemetryReporter {
	logTelemetry(): void { /* noop */ }
	logTraceEvent(): void { /* noop */ }
	dispose(): void { /* noop */ }
};

class FakeServerProcess implements TsServerProcess {
	private readonly _out: stream.PassThrough;

	private readonly writeListeners = new Set<(data: Buffer) => void>();
	public stdout: stream.PassThrough;

	constructor() {
		this._out = new stream.PassThrough();
		this.stdout = this._out;
	}

	public write(data: Proto.Request) {
		const listeners = Array.from(this.writeListeners);
		this.writeListeners.clear();

		setImmediate(() => {
			for (const listener of listeners) {
				listener(Buffer.from(JSON.stringify(data), 'utf8'));
			}
			const body = Buffer.from(JSON.stringify({ 'seq': data.seq, 'type': 'response', 'command': data.command, 'request_seq': data.seq, 'success': true }), 'utf8');
			this._out.write(Buffer.from(`Content-Length: ${body.length}\r\n\r\n${body}`, 'utf8'));
		});
	}

	onData(_handler: any) { /* noop */ }
	onError(_handler: any) { /* noop */ }
	onExit(_handler: any) { /* noop */ }

	kill(): void { /* noop */ }

	public onWrite(): Promise<any> {
		return new Promise<string>((resolve) => {
			this.writeListeners.add((data) => {
				resolve(JSON.parse(data.toString()));
			});
		});
	}
}

suite.skip('Server', () => {
	const tracer = new Tracer(new Logger());

	test('should send requests with increasing sequence numbers', async () => {
		const process = new FakeServerProcess();
		const server = new SingleTsServer('semantic', ServerType.Semantic, process, undefined, new NodeRequestCanceller('semantic', tracer), undefined!, NoopTelemetryReporter, tracer);

		const onWrite1 = process.onWrite();
		server.executeImpl('geterr', {}, { isAsync: false, token: nulToken, expectsResult: true });
		assert.strictEqual((await onWrite1).seq, 0);

		const onWrite2 = process.onWrite();
		server.executeImpl('geterr', {}, { isAsync: false, token: nulToken, expectsResult: true });
		assert.strictEqual((await onWrite2).seq, 1);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/test/unit/textRendering.test.ts]---
Location: vscode-main/extensions/typescript-language-features/src/test/unit/textRendering.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import { Uri } from 'vscode';
import { IFilePathToResourceConverter, documentationToMarkdown, asPlainTextWithLinks, tagsToMarkdown } from '../../languageFeatures/util/textRendering';
import { SymbolDisplayPart } from '../../tsServer/protocol/protocol';

const noopToResource: IFilePathToResourceConverter = {
	toResource: (path) => Uri.file(path)
};

suite('typescript.previewer', () => {
	test('Should ignore hyphens after a param tag', () => {
		assert.strictEqual(
			tagsToMarkdown([
				{
					name: 'param',
					text: 'a - b'
				}
			], noopToResource),
			'*@param* `a` — b');
	});

	test('Should parse url jsdoc @link', () => {
		assert.strictEqual(
			documentationToMarkdown(
				// 'x {@link http://www.example.com/foo} y {@link https://api.jquery.com/bind/#bind-eventType-eventData-handler} z',
				[{ 'text': 'x ', 'kind': 'text' }, { 'text': '{@link ', 'kind': 'link' }, { 'text': 'http://www.example.com/foo', 'kind': 'linkText' }, { 'text': '}', 'kind': 'link' }, { 'text': ' y ', 'kind': 'text' }, { 'text': '{@link ', 'kind': 'link' }, { 'text': 'https://api.jquery.com/bind/#bind-eventType-eventData-handler', 'kind': 'linkText' }, { 'text': '}', 'kind': 'link' }, { 'text': ' z', 'kind': 'text' }],
				[],
				noopToResource, undefined
			).value,
			'x <http://www.example.com/foo> y <https://api.jquery.com/bind/#bind-eventType-eventData-handler> z');
	});

	test('Should parse url jsdoc @link with text', () => {
		assert.strictEqual(
			documentationToMarkdown(
				// 'x {@link http://www.example.com/foo abc xyz} y {@link http://www.example.com/bar|b a z} z',
				[{ 'text': 'x ', 'kind': 'text' }, { 'text': '{@link ', 'kind': 'link' }, { 'text': 'http://www.example.com/foo abc xyz', 'kind': 'linkText' }, { 'text': '}', 'kind': 'link' }, { 'text': ' y ', 'kind': 'text' }, { 'text': '{@link ', 'kind': 'link' }, { 'text': 'http://www.example.com/bar b a z', 'kind': 'linkText' }, { 'text': '}', 'kind': 'link' }, { 'text': ' z', 'kind': 'text' }],
				[],
				noopToResource, undefined
			).value,
			'x [abc xyz](http://www.example.com/foo) y [b a z](http://www.example.com/bar) z');
	});

	test('Should treat @linkcode jsdocs links as monospace', () => {
		assert.strictEqual(
			documentationToMarkdown(
				// 'x {@linkcode http://www.example.com/foo} y {@linkplain http://www.example.com/bar} z',
				[{ 'text': 'x ', 'kind': 'text' }, { 'text': '{@linkcode ', 'kind': 'link' }, { 'text': 'http://www.example.com/foo', 'kind': 'linkText' }, { 'text': '}', 'kind': 'link' }, { 'text': ' y ', 'kind': 'text' }, { 'text': '{@linkplain ', 'kind': 'link' }, { 'text': 'http://www.example.com/bar', 'kind': 'linkText' }, { 'text': '}', 'kind': 'link' }, { 'text': ' z', 'kind': 'text' }],
				[],
				noopToResource, undefined
			).value,
			'x [`http://www.example.com/foo`](http://www.example.com/foo) y <http://www.example.com/bar> z');
	});

	test('Should parse url jsdoc @link in param tag', () => {
		assert.strictEqual(
			tagsToMarkdown([
				{
					name: 'param',
					// a x {@link http://www.example.com/foo abc xyz} y {@link http://www.example.com/bar|b a z} z
					text: [{ 'text': 'a', 'kind': 'parameterName' }, { 'text': ' ', 'kind': 'space' }, { 'text': 'x ', 'kind': 'text' }, { 'text': '{@link ', 'kind': 'link' }, { 'text': 'http://www.example.com/foo abc xyz', 'kind': 'linkText' }, { 'text': '}', 'kind': 'link' }, { 'text': ' y ', 'kind': 'text' }, { 'text': '{@link ', 'kind': 'link' }, { 'text': 'http://www.example.com/bar b a z', 'kind': 'linkText' }, { 'text': '}', 'kind': 'link' }, { 'text': ' z', 'kind': 'text' }],
				}
			], noopToResource),
			'*@param* `a` — x [abc xyz](http://www.example.com/foo) y [b a z](http://www.example.com/bar) z');
	});

	test('Should support non-ascii characters in parameter name (#90108)', () => {
		assert.strictEqual(
			tagsToMarkdown([
				{
					name: 'param',
					text: 'parámetroConDiacríticos this will not'
				}
			], noopToResource),
			'*@param* `parámetroConDiacríticos` — this will not');
	});

	test('Should render @example blocks as code', () => {
		assert.strictEqual(
			tagsToMarkdown([
				{
					name: 'example',
					text: 'code();'
				}
			], noopToResource),
			'*@example*  \n```tsx\ncode();\n```'
		);
	});

	test('Should not render @example blocks as code as if they contain a codeblock', () => {
		assert.strictEqual(
			tagsToMarkdown([
				{
					name: 'example',
					text: 'Not code\n```\ncode();\n```'
				}
			], noopToResource),
			'*@example*  \nNot code\n```\ncode();\n```'
		);
	});

	test('Should render @example blocks as code if they contain a <caption>', () => {
		assert.strictEqual(
			tagsToMarkdown([
				{
					name: 'example',
					text: '<caption>Not code</caption>\ncode();'
				}
			], noopToResource),
			'*@example*  \nNot code\n```tsx\ncode();\n```'
		);
	});

	test('Should not render @example blocks as code if they contain a <caption> and a codeblock', () => {
		assert.strictEqual(
			tagsToMarkdown([
				{
					name: 'example',
					text: '<caption>Not code</caption>\n```\ncode();\n```'
				}
			], noopToResource),
			'*@example*  \nNot code\n```\ncode();\n```'
		);
	});

	test('Should not render @link inside of @example #187768', () => {
		assert.strictEqual(
			tagsToMarkdown([
				{
					'name': 'example',
					'text': [
						{
							'text': '1 + 1 ',
							'kind': 'text'
						},
						{
							'text': '{@link ',
							'kind': 'link'
						},
						{
							'text': 'foo',
							'kind': 'linkName'
						},
						{
							'text': '}',
							'kind': 'link'
						}
					]
				}
			], noopToResource),
			'*@example*  \n```tsx\n1 + 1 {@link foo}\n```');
	});

	test('Should render @linkcode symbol name as code', () => {
		assert.strictEqual(
			asPlainTextWithLinks([
				{ 'text': 'a ', 'kind': 'text' },
				{ 'text': '{@linkcode ', 'kind': 'link' },
				{
					'text': 'dog',
					'kind': 'linkName',
					'target': {
						'file': '/path/file.ts',
						'start': { 'line': 7, 'offset': 5 },
						'end': { 'line': 7, 'offset': 13 }
					}
				} as SymbolDisplayPart,
				{ 'text': '}', 'kind': 'link' },
				{ 'text': ' b', 'kind': 'text' }
			], noopToResource),
			'a [`dog`](command:_typescript.openJsDocLink?%5B%7B%22file%22%3A%7B%22path%22%3A%22%2Fpath%2Ffile.ts%22%2C%22scheme%22%3A%22file%22%7D%2C%22position%22%3A%7B%22line%22%3A6%2C%22character%22%3A4%7D%7D%5D "Open symbol link") b');
	});

	test('Should render @linkcode text as code', () => {
		assert.strictEqual(
			asPlainTextWithLinks([
				{ 'text': 'a ', 'kind': 'text' },
				{ 'text': '{@linkcode ', 'kind': 'link' },
				{
					'text': 'dog',
					'kind': 'linkName',
					'target': {
						'file': '/path/file.ts',
						'start': { 'line': 7, 'offset': 5 },
						'end': { 'line': 7, 'offset': 13 }
					}
				} as SymbolDisplayPart,
				{ 'text': 'husky', 'kind': 'linkText' },
				{ 'text': '}', 'kind': 'link' },
				{ 'text': ' b', 'kind': 'text' }
			], noopToResource),
			'a [`husky`](command:_typescript.openJsDocLink?%5B%7B%22file%22%3A%7B%22path%22%3A%22%2Fpath%2Ffile.ts%22%2C%22scheme%22%3A%22file%22%7D%2C%22position%22%3A%7B%22line%22%3A6%2C%22character%22%3A4%7D%7D%5D "Open symbol link") b');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/tsServer/api.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/api.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as semver from 'semver';
import * as vscode from 'vscode';


export class API {
	public static fromSimpleString(value: string): API {
		return new API(value, value, value);
	}

	public static readonly defaultVersion = API.fromSimpleString('1.0.0');
	public static readonly v380 = API.fromSimpleString('3.8.0');
	public static readonly v390 = API.fromSimpleString('3.9.0');
	public static readonly v400 = API.fromSimpleString('4.0.0');
	public static readonly v401 = API.fromSimpleString('4.0.1');
	public static readonly v420 = API.fromSimpleString('4.2.0');
	public static readonly v430 = API.fromSimpleString('4.3.0');
	public static readonly v440 = API.fromSimpleString('4.4.0');
	public static readonly v460 = API.fromSimpleString('4.6.0');
	public static readonly v470 = API.fromSimpleString('4.7.0');
	public static readonly v490 = API.fromSimpleString('4.9.0');
	public static readonly v500 = API.fromSimpleString('5.0.0');
	public static readonly v510 = API.fromSimpleString('5.1.0');
	public static readonly v520 = API.fromSimpleString('5.2.0');
	public static readonly v544 = API.fromSimpleString('5.4.4');
	public static readonly v540 = API.fromSimpleString('5.4.0');
	public static readonly v560 = API.fromSimpleString('5.6.0');
	public static readonly v570 = API.fromSimpleString('5.7.0');
	public static readonly v590 = API.fromSimpleString('5.9.0');

	public static fromVersionString(versionString: string): API {
		let version = semver.valid(versionString);
		if (!version) {
			return new API(vscode.l10n.t("invalid version"), '1.0.0', '1.0.0');
		}

		// Cut off any prerelease tag since we sometimes consume those on purpose.
		const index = versionString.indexOf('-');
		if (index >= 0) {
			version = version.substr(0, index);
		}
		return new API(versionString, version, versionString);
	}

	private constructor(
		/**
		 * Human readable string for the current version. Displayed in the UI
		 */
		public readonly displayName: string,

		/**
		 * Semver version, e.g. '3.9.0'
		 */
		public readonly version: string,

		/**
		 * Full version string including pre-release tags, e.g. '3.9.0-beta'
		 */
		public readonly fullVersionString: string,
	) { }

	public eq(other: API): boolean {
		return semver.eq(this.version, other.version);
	}

	public gte(other: API): boolean {
		return semver.gte(this.version, other.version);
	}

	public lt(other: API): boolean {
		return !this.gte(other);
	}

	public isYarnPnp(): boolean {
		return this.fullVersionString.includes('-sdk');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/tsServer/bufferSyncSupport.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/bufferSyncSupport.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as fileSchemes from '../configuration/fileSchemes';
import * as languageModeIds from '../configuration/languageIds';
import * as typeConverters from '../typeConverters';
import { ClientCapability, ITypeScriptServiceClient } from '../typescriptService';
import { inMemoryResourcePrefix } from '../typescriptServiceClient';
import { coalesce } from '../utils/arrays';
import { Delayer, setImmediate } from '../utils/async';
import { nulToken } from '../utils/cancellation';
import { Disposable } from '../utils/dispose';
import { ResourceMap } from '../utils/resourceMap';
import { API } from './api';
import type * as Proto from './protocol/protocol';

type ScriptKind = 'TS' | 'TSX' | 'JS' | 'JSX';

function mode2ScriptKind(mode: string): ScriptKind | undefined {
	switch (mode) {
		case languageModeIds.typescript: return 'TS';
		case languageModeIds.typescriptreact: return 'TSX';
		case languageModeIds.javascript: return 'JS';
		case languageModeIds.javascriptreact: return 'JSX';
	}
	return undefined;
}

const enum BufferState { Initial, Open, Closed }

const enum BufferOperationType { Close, Open, Change }

class CloseOperation {
	readonly type = BufferOperationType.Close;
	constructor(
		public readonly args: string,
		public readonly scriptKind: ScriptKind | undefined,
	) { }
}

class OpenOperation {
	readonly type = BufferOperationType.Open;
	constructor(
		public readonly args: Proto.OpenRequestArgs,
		public readonly scriptKind: ScriptKind | undefined,
	) { }
}

class ChangeOperation {
	readonly type = BufferOperationType.Change;
	constructor(
		public readonly args: Proto.FileCodeEdits
	) { }
}

type BufferOperation = CloseOperation | OpenOperation | ChangeOperation;

/**
 * Manages synchronization of buffers with the TS server.
 *
 * If supported, batches together file changes. This allows the TS server to more efficiently process changes.
 */
class BufferSynchronizer {

	private readonly _pending: ResourceMap<BufferOperation>;

	constructor(
		private readonly client: ITypeScriptServiceClient,
		pathNormalizer: (path: vscode.Uri) => string | undefined,
		onCaseInsensitiveFileSystem: boolean
	) {
		this._pending = new ResourceMap<BufferOperation>(pathNormalizer, {
			onCaseInsensitiveFileSystem
		});
	}

	public open(resource: vscode.Uri, args: Proto.OpenRequestArgs) {
		this.updatePending(resource, new OpenOperation(args, args.scriptKindName));
	}

	/**
	 * @return Was the buffer open?
	 */
	public close(resource: vscode.Uri, filepath: string, scriptKind: ScriptKind | undefined): boolean {
		return this.updatePending(resource, new CloseOperation(filepath, scriptKind));
	}

	public change(resource: vscode.Uri, filepath: string, events: readonly vscode.TextDocumentContentChangeEvent[]) {
		if (!events.length) {
			return;
		}

		this.updatePending(resource, new ChangeOperation({
			fileName: filepath,
			textChanges: events.map((change): Proto.CodeEdit => ({
				newText: change.text,
				start: typeConverters.Position.toLocation(change.range.start),
				end: typeConverters.Position.toLocation(change.range.end),
			})).reverse(), // Send the edits end-of-document to start-of-document order
		}));
	}

	public reset(): void {
		this._pending.clear();
	}

	public beforeCommand(command: string): void {
		if (command === 'updateOpen') {
			return;
		}

		this.flush();
	}

	private flush() {
		if (this._pending.size > 0) {
			const closedFiles: string[] = [];
			const openFiles: Proto.OpenRequestArgs[] = [];
			const changedFiles: Proto.FileCodeEdits[] = [];
			for (const change of this._pending.values()) {
				switch (change.type) {
					case BufferOperationType.Change: changedFiles.push(change.args); break;
					case BufferOperationType.Open: openFiles.push(change.args); break;
					case BufferOperationType.Close: closedFiles.push(change.args); break;
				}
			}
			this.client.execute('updateOpen', { changedFiles, closedFiles, openFiles }, nulToken, { nonRecoverable: true });
			this._pending.clear();
		}
	}

	private updatePending(resource: vscode.Uri, op: BufferOperation): boolean {
		switch (op.type) {
			case BufferOperationType.Close: {
				const existing = this._pending.get(resource);
				switch (existing?.type) {
					case BufferOperationType.Open:
						if (existing.scriptKind === op.scriptKind) {
							this._pending.delete(resource);
							return false; // Open then close. No need to do anything
						}
				}
				break;
			}
		}

		if (this._pending.has(resource)) {
			// we saw this file before, make sure we flush before working with it again
			this.flush();
		}
		this._pending.set(resource, op);
		return true;
	}
}

class SyncedBuffer {

	private state = BufferState.Initial;

	constructor(
		private readonly document: vscode.TextDocument,
		public readonly filepath: string,
		private readonly client: ITypeScriptServiceClient,
		private readonly synchronizer: BufferSynchronizer,
	) { }

	public open(): void {
		const args: Proto.OpenRequestArgs & { plugins?: string[] } = {
			file: this.filepath,
			fileContent: this.document.getText(),
			projectRootPath: this.getProjectRootPath(this.document.uri),
		};

		const scriptKind = mode2ScriptKind(this.document.languageId);
		if (scriptKind) {
			args.scriptKindName = scriptKind;
		}

		const tsPluginsForDocument = this.client.pluginManager.plugins
			.filter(x => x.languages.indexOf(this.document.languageId) >= 0);

		if (tsPluginsForDocument.length) {
			args.plugins = tsPluginsForDocument.map(plugin => plugin.name);
		}

		this.synchronizer.open(this.resource, args);
		this.state = BufferState.Open;
	}

	private getProjectRootPath(resource: vscode.Uri): string | undefined {
		let workspaceRoot = this.client.getWorkspaceRootForResource(resource);

		// If we didn't find a real workspace, we still want to try sending along a workspace folder
		// to prevent TS from loading projects from outside of any workspace.
		// Just pick the highest level one on the same FS even though the file is outside of it
		if (!workspaceRoot && vscode.workspace.workspaceFolders) {
			for (const root of Array.from(vscode.workspace.workspaceFolders).sort((a, b) => a.uri.path.length - b.uri.path.length)) {
				if (root.uri.scheme === resource.scheme && root.uri.authority === resource.authority) {
					workspaceRoot = root.uri;
					break;
				}
			}
		}

		if (workspaceRoot) {
			const tsRoot = this.client.toTsFilePath(workspaceRoot);
			return tsRoot?.startsWith(inMemoryResourcePrefix) ? undefined : tsRoot;
		}

		return fileSchemes.isOfScheme(resource, fileSchemes.officeScript, fileSchemes.chatCodeBlock) ? '/' : undefined;
	}

	public get resource(): vscode.Uri {
		return this.document.uri;
	}

	public get lineCount(): number {
		return this.document.lineCount;
	}

	public get languageId(): string {
		return this.document.languageId;
	}

	/**
	 * @return Was the buffer open?
	 */
	public close(): boolean {
		if (this.state !== BufferState.Open) {
			this.state = BufferState.Closed;
			return false;
		}
		this.state = BufferState.Closed;
		return this.synchronizer.close(this.resource, this.filepath, mode2ScriptKind(this.document.languageId));
	}

	public onContentChanged(events: readonly vscode.TextDocumentContentChangeEvent[]): void {
		if (this.state !== BufferState.Open) {
			console.error(`Unexpected buffer state: ${this.state}`);
		}

		this.synchronizer.change(this.resource, this.filepath, events);
	}
}

class SyncedBufferMap extends ResourceMap<SyncedBuffer> {

	public getForPath(filePath: string): SyncedBuffer | undefined {
		return this.get(vscode.Uri.file(filePath));
	}

	public get allBuffers(): Iterable<SyncedBuffer> {
		return this.values();
	}
}

class PendingDiagnostics extends ResourceMap<number> {
	public getOrderedFileSet(): ResourceMap<void | vscode.Range[]> {
		const orderedResources = Array.from(this.entries())
			.sort((a, b) => a.value - b.value)
			.map(entry => entry.resource);

		const map = new ResourceMap<void | vscode.Range[]>(this._normalizePath, this.config);
		for (const resource of orderedResources) {
			map.set(resource, undefined);
		}
		return map;
	}
}

class GetErrRequest {

	public static executeGetErrRequest(
		client: ITypeScriptServiceClient,
		files: ResourceMap<void | vscode.Range[]>,
		onDone: () => void
	) {
		return new GetErrRequest(client, files, onDone);
	}

	private _done: boolean = false;
	private readonly _token: vscode.CancellationTokenSource = new vscode.CancellationTokenSource();

	private constructor(
		private readonly client: ITypeScriptServiceClient,
		public readonly files: ResourceMap<void | vscode.Range[]>,
		onDone: () => void
	) {
		if (!this.isErrorReportingEnabled()) {
			this._done = true;
			setImmediate(onDone);
			return;
		}

		const supportsSyntaxGetErr = this.client.apiVersion.gte(API.v440);
		const fileEntries = Array.from(files.entries()).filter(entry => supportsSyntaxGetErr || client.hasCapabilityForResource(entry.resource, ClientCapability.Semantic));
		const allFiles = coalesce(fileEntries
			.map(entry => client.toTsFilePath(entry.resource)));

		if (!allFiles.length) {
			this._done = true;
			setImmediate(onDone);
		} else {
			let request;
			if (this.areProjectDiagnosticsEnabled()) {
				// Note that geterrForProject is almost certainly not the api we want here as it ends up computing far
				// too many diagnostics
				request = client.executeAsync('geterrForProject', { delay: 0, file: allFiles[0] }, this._token.token);
			}
			else {
				let requestFiles;
				if (this.areRegionDiagnosticsEnabled()) {
					requestFiles = coalesce(fileEntries
						.map(entry => {
							const file = client.toTsFilePath(entry.resource);
							const ranges = entry.value;
							if (file && ranges) {
								return typeConverters.Range.toFileRangesRequestArgs(file, ranges);
							}

							return file;
						}));
				}
				else {
					requestFiles = allFiles;
				}
				request = client.executeAsync('geterr', { delay: 0, files: requestFiles }, this._token.token);
			}

			request.finally(() => {
				if (this._done) {
					return;
				}
				this._done = true;
				onDone();
			});
		}
	}

	private isErrorReportingEnabled() {
		if (this.client.apiVersion.gte(API.v440)) {
			return true;
		} else {
			// Older TS versions only support `getErr` on semantic server
			return this.client.capabilities.has(ClientCapability.Semantic);
		}
	}

	private areProjectDiagnosticsEnabled(): boolean {
		return this.client.configuration.enableProjectDiagnostics && this.client.capabilities.has(ClientCapability.Semantic);
	}

	private areRegionDiagnosticsEnabled(): boolean {
		return this.client.configuration.enableRegionDiagnostics && this.client.apiVersion.gte(API.v560);
	}

	public cancel(): void {
		if (!this._done) {
			this._token.cancel();
		}

		this._token.dispose();
	}
}

class TabResourceTracker extends Disposable {

	private readonly _onDidChange = this._register(new vscode.EventEmitter<{
		readonly closed: Iterable<vscode.Uri>;
		readonly opened: Iterable<vscode.Uri>;
	}>());
	public readonly onDidChange = this._onDidChange.event;

	private readonly _tabResources: ResourceMap<{ readonly tabs: Set<vscode.Tab> }>;

	constructor(
		normalizePath: (resource: vscode.Uri) => string | undefined,
		config: {
			readonly onCaseInsensitiveFileSystem: boolean;
		},
	) {
		super();

		this._tabResources = new ResourceMap<{ readonly tabs: Set<vscode.Tab> }>(normalizePath, config);

		for (const tabGroup of vscode.window.tabGroups.all) {
			for (const tab of tabGroup.tabs) {
				this.add(tab);
			}
		}

		this._register(vscode.window.tabGroups.onDidChangeTabs(e => {
			const closed = e.closed.flatMap(tab => this.delete(tab));
			const opened = e.opened.flatMap(tab => this.add(tab));
			if (closed.length || opened.length) {
				this._onDidChange.fire({ closed, opened });
			}
		}));
	}

	public has(resource: vscode.Uri): boolean {
		if (resource.scheme === fileSchemes.vscodeNotebookCell) {
			const notebook = vscode.workspace.notebookDocuments.find(doc =>
				doc.getCells().some(cell => cell.document.uri.toString() === resource.toString()));

			return !!notebook && this.has(notebook.uri);
		}

		const entry = this._tabResources.get(resource);
		return !!entry && entry.tabs.size > 0;
	}

	private add(tab: vscode.Tab): vscode.Uri[] {
		const addedResources: vscode.Uri[] = [];
		for (const uri of this.getResourcesForTab(tab)) {
			const entry = this._tabResources.get(uri);
			if (entry) {
				entry.tabs.add(tab);
			} else {
				this._tabResources.set(uri, { tabs: new Set([tab]) });
				addedResources.push(uri);
			}
		}
		return addedResources;
	}

	private delete(tab: vscode.Tab): vscode.Uri[] {
		const closedResources: vscode.Uri[] = [];
		for (const uri of this.getResourcesForTab(tab)) {
			const entry = this._tabResources.get(uri);
			if (!entry) {
				continue;
			}

			entry.tabs.delete(tab);
			if (entry.tabs.size === 0) {
				this._tabResources.delete(uri);
				closedResources.push(uri);
			}
		}
		return closedResources;
	}

	private getResourcesForTab(tab: vscode.Tab): vscode.Uri[] {
		if (tab.input instanceof vscode.TabInputText) {
			return [tab.input.uri];
		} else if (tab.input instanceof vscode.TabInputTextDiff) {
			return [tab.input.original, tab.input.modified];
		} else if (tab.input instanceof vscode.TabInputNotebook) {
			return [tab.input.uri];
		} else {
			return [];
		}
	}
}


export default class BufferSyncSupport extends Disposable {

	private readonly client: ITypeScriptServiceClient;

	private _validateJavaScript = true;
	private _validateTypeScript = true;

	private readonly modeIds: Set<string>;
	private readonly syncedBuffers: SyncedBufferMap;
	private readonly pendingDiagnostics: PendingDiagnostics;
	private readonly diagnosticDelayer: Delayer<any>;
	private pendingGetErr: GetErrRequest | undefined;
	private listening: boolean = false;
	private readonly synchronizer: BufferSynchronizer;

	private readonly _tabResources: TabResourceTracker;

	constructor(
		client: ITypeScriptServiceClient,
		modeIds: readonly string[],
		onCaseInsensitiveFileSystem: boolean
	) {
		super();
		this.client = client;
		this.modeIds = new Set<string>(modeIds);

		this.diagnosticDelayer = new Delayer<any>(300);

		const pathNormalizer = (path: vscode.Uri) => this.client.toTsFilePath(path);
		this.syncedBuffers = new SyncedBufferMap(pathNormalizer, { onCaseInsensitiveFileSystem });
		this.pendingDiagnostics = new PendingDiagnostics(pathNormalizer, { onCaseInsensitiveFileSystem });
		this.synchronizer = new BufferSynchronizer(client, pathNormalizer, onCaseInsensitiveFileSystem);

		this._tabResources = this._register(new TabResourceTracker(pathNormalizer, { onCaseInsensitiveFileSystem }));
		this._register(this._tabResources.onDidChange(e => {
			if (this.client.configuration.enableProjectDiagnostics) {
				return;
			}

			for (const closed of e.closed) {
				const syncedBuffer = this.syncedBuffers.get(closed);
				if (syncedBuffer) {
					this.pendingDiagnostics.delete(closed);
					this.pendingGetErr?.files.delete(closed);
				}
			}

			for (const opened of e.opened) {
				const syncedBuffer = this.syncedBuffers.get(opened);
				if (syncedBuffer) {
					this.requestDiagnostic(syncedBuffer);
				}
			}
		}));

		this.updateConfiguration();
		vscode.workspace.onDidChangeConfiguration(this.updateConfiguration, this, this._disposables);
	}

	private readonly _onDelete = this._register(new vscode.EventEmitter<vscode.Uri>());
	public readonly onDelete = this._onDelete.event;

	private readonly _onWillChange = this._register(new vscode.EventEmitter<vscode.Uri>());
	public readonly onWillChange = this._onWillChange.event;

	public listen(): void {
		if (this.listening) {
			return;
		}
		this.listening = true;
		vscode.workspace.onDidOpenTextDocument(this.openTextDocument, this, this._disposables);
		vscode.workspace.onDidCloseTextDocument(this.onDidCloseTextDocument, this, this._disposables);
		vscode.workspace.onDidChangeTextDocument(this.onDidChangeTextDocument, this, this._disposables);
		vscode.window.onDidChangeVisibleTextEditors(e => {
			for (const { document } of e) {
				const syncedBuffer = this.syncedBuffers.get(document.uri);
				if (syncedBuffer) {
					this.requestDiagnostic(syncedBuffer);
				}
			}
		}, this, this._disposables);
		vscode.workspace.textDocuments.forEach(this.openTextDocument, this);
	}

	public handles(resource: vscode.Uri): boolean {
		return this.syncedBuffers.has(resource);
	}

	public ensureHasBuffer(resource: vscode.Uri): boolean {
		if (this.syncedBuffers.has(resource)) {
			return true;
		}

		const existingDocument = vscode.workspace.textDocuments.find(doc => doc.uri.toString() === resource.toString());
		if (existingDocument) {
			return this.openTextDocument(existingDocument);
		}

		return false;
	}

	public toVsCodeResource(resource: vscode.Uri): vscode.Uri {
		const filepath = this.client.toTsFilePath(resource);
		for (const buffer of this.syncedBuffers.allBuffers) {
			if (buffer.filepath === filepath) {
				return buffer.resource;
			}
		}
		return resource;
	}

	public toResource(filePath: string): vscode.Uri {
		const buffer = this.syncedBuffers.getForPath(filePath);
		if (buffer) {
			return buffer.resource;
		}
		return vscode.Uri.file(filePath);
	}

	public reset(): void {
		this.pendingGetErr?.cancel();
		this.pendingDiagnostics.clear();
		this.synchronizer.reset();
	}

	public reinitialize(): void {
		this.reset();
		for (const buffer of this.syncedBuffers.allBuffers) {
			buffer.open();
		}
	}

	public openTextDocument(document: vscode.TextDocument): boolean {
		if (!this.modeIds.has(document.languageId)) {
			return false;
		}
		const resource = document.uri;
		const filepath = this.client.toTsFilePath(resource);
		if (!filepath) {
			return false;
		}

		if (this.syncedBuffers.has(resource)) {
			return true;
		}

		const syncedBuffer = new SyncedBuffer(document, filepath, this.client, this.synchronizer);
		this.syncedBuffers.set(resource, syncedBuffer);
		syncedBuffer.open();
		this.requestDiagnostic(syncedBuffer);
		return true;
	}

	public closeResource(resource: vscode.Uri): void {
		const syncedBuffer = this.syncedBuffers.get(resource);
		if (!syncedBuffer) {
			return;
		}

		this.pendingDiagnostics.delete(resource);
		this.pendingGetErr?.files.delete(resource);
		this.syncedBuffers.delete(resource);
		const wasBufferOpen = syncedBuffer.close();
		this._onDelete.fire(resource);
		if (wasBufferOpen) {
			this.requestAllDiagnostics();
		}
	}

	public interruptGetErr<R>(f: () => R): R {
		if (!this.pendingGetErr
			|| this.client.configuration.enableProjectDiagnostics // `geterr` happens on separate server so no need to cancel it.
		) {
			return f();
		}

		this.pendingGetErr.cancel();
		this.pendingGetErr = undefined;
		const result = f();
		this.triggerDiagnostics();
		return result;
	}

	public beforeCommand(command: string): void {
		this.synchronizer.beforeCommand(command);
	}

	public lineCount(resource: vscode.Uri): number | undefined {
		return this.syncedBuffers.get(resource)?.lineCount;
	}

	private onDidCloseTextDocument(document: vscode.TextDocument): void {
		this.closeResource(document.uri);
	}

	private onDidChangeTextDocument(e: vscode.TextDocumentChangeEvent): void {
		const syncedBuffer = this.syncedBuffers.get(e.document.uri);
		if (!syncedBuffer) {
			return;
		}

		this._onWillChange.fire(syncedBuffer.resource);

		syncedBuffer.onContentChanged(e.contentChanges);
		const didTrigger = this.requestDiagnostic(syncedBuffer);

		if (!didTrigger && this.pendingGetErr) {
			// In this case we always want to re-trigger all diagnostics
			this.pendingGetErr.cancel();
			this.pendingGetErr = undefined;
			this.triggerDiagnostics();
		}
	}

	public requestAllDiagnostics() {
		for (const buffer of this.syncedBuffers.allBuffers) {
			if (this.shouldValidate(buffer)) {
				this.pendingDiagnostics.set(buffer.resource, Date.now());
			}
		}
		this.triggerDiagnostics();
	}

	public getErr(resources: readonly vscode.Uri[]): any {
		const handledResources = resources.filter(resource => this.handles(resource));
		if (!handledResources.length) {
			return;
		}

		for (const resource of handledResources) {
			this.pendingDiagnostics.set(resource, Date.now());
		}

		this.triggerDiagnostics();
	}

	private triggerDiagnostics(delay: number = 200) {
		this.diagnosticDelayer.trigger(() => {
			this.sendPendingDiagnostics();
		}, delay);
	}

	private requestDiagnostic(buffer: SyncedBuffer): boolean {
		if (!this.shouldValidate(buffer)) {
			return false;
		}

		this.pendingDiagnostics.set(buffer.resource, Date.now());

		const delay = Math.min(Math.max(Math.ceil(buffer.lineCount / 20), 300), 800);
		this.triggerDiagnostics(delay);
		return true;
	}

	public hasPendingDiagnostics(resource: vscode.Uri): boolean {
		return this.pendingDiagnostics.has(resource);
	}

	private sendPendingDiagnostics(): void {
		const orderedFileSet = this.pendingDiagnostics.getOrderedFileSet();

		if (this.pendingGetErr) {
			this.pendingGetErr.cancel();

			for (const { resource } of this.pendingGetErr.files.entries()) {
				if (this.syncedBuffers.get(resource)) {
					orderedFileSet.set(resource, undefined);
				}
			}

			this.pendingGetErr = undefined;
		}

		// Add all open TS buffers to the geterr request. They might be visible
		for (const buffer of this.syncedBuffers.values()) {
			const editors = vscode.window.visibleTextEditors.filter(editor => editor.document.uri.toString() === buffer.resource.toString());
			const visibleRanges = editors.flatMap(editor => editor.visibleRanges);
			orderedFileSet.set(buffer.resource, visibleRanges.length ? visibleRanges : undefined);
		}

		for (const { resource } of orderedFileSet.entries()) {
			const buffer = this.syncedBuffers.get(resource);
			if (buffer && !this.shouldValidate(buffer)) {
				orderedFileSet.delete(resource);
			}
		}

		if (orderedFileSet.size) {
			const getErr = this.pendingGetErr = GetErrRequest.executeGetErrRequest(this.client, orderedFileSet, () => {
				if (this.pendingGetErr === getErr) {
					this.pendingGetErr = undefined;
				}
			});
		}

		this.pendingDiagnostics.clear();
	}

	private updateConfiguration() {
		const jsConfig = vscode.workspace.getConfiguration('javascript', null);
		const tsConfig = vscode.workspace.getConfiguration('typescript', null);

		this._validateJavaScript = jsConfig.get<boolean>('validate.enable', true);
		this._validateTypeScript = tsConfig.get<boolean>('validate.enable', true);
	}

	private shouldValidate(buffer: SyncedBuffer): boolean {
		if (fileSchemes.isOfScheme(buffer.resource, fileSchemes.chatCodeBlock)) {
			return false;
		}

		if (!this.client.configuration.enableProjectDiagnostics && !this._tabResources.has(buffer.resource)) { // Only validate resources that are showing to the user
			return false;
		}

		switch (buffer.languageId) {
			case languageModeIds.javascript:
			case languageModeIds.javascriptreact:
				return this._validateJavaScript;

			case languageModeIds.typescript:
			case languageModeIds.typescriptreact:
			default:
				return this._validateTypeScript;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/tsServer/cachedResponse.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/cachedResponse.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { ServerResponse } from '../typescriptService';
import type * as Proto from './protocol/protocol';

type Resolve<T extends Proto.Response> = () => Promise<ServerResponse.Response<T>>;

/**
 * Caches a class of TS Server request based on document.
 */
export class CachedResponse<T extends Proto.Response> {
	private response?: Promise<ServerResponse.Response<T>>;
	private version: number = -1;
	private document: string = '';

	/**
	 * Execute a request. May return cached value or resolve the new value
	 *
	 * Caller must ensure that all input `resolve` functions return equivilent results (keyed only off of document).
	 */
	public execute(
		document: vscode.TextDocument,
		resolve: Resolve<T>
	): Promise<ServerResponse.Response<T>> {
		if (this.response && this.matches(document)) {
			// Chain so that on cancellation we fall back to the next resolve
			return this.response = this.response.then(result => result.type === 'cancelled' ? resolve() : result);
		}
		return this.reset(document, resolve);
	}

	private matches(document: vscode.TextDocument): boolean {
		return this.version === document.version && this.document === document.uri.toString();
	}

	private async reset(
		document: vscode.TextDocument,
		resolve: Resolve<T>
	): Promise<ServerResponse.Response<T>> {
		this.version = document.version;
		this.document = document.uri.toString();
		return this.response = resolve();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/tsServer/callbackMap.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/callbackMap.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ServerResponse } from '../typescriptService';
import type * as Proto from './protocol/protocol';

export interface CallbackItem<R> {
	readonly onSuccess: (value: R) => void;
	readonly onError: (err: Error) => void;
	readonly queuingStartTime: number;
	readonly isAsync: boolean;
	readonly traceId?: string | undefined;
	readonly command?: string;
}

export class CallbackMap<R extends Proto.Response> {
	private readonly _callbacks = new Map<number, CallbackItem<ServerResponse.Response<R> | undefined>>();
	private readonly _asyncCallbacks = new Map<number, CallbackItem<ServerResponse.Response<R> | undefined>>();

	public destroy(cause: string): void {
		const cancellation = new ServerResponse.Cancelled(cause);
		for (const callback of this._callbacks.values()) {
			callback.onSuccess(cancellation);
		}
		this._callbacks.clear();
		for (const callback of this._asyncCallbacks.values()) {
			callback.onSuccess(cancellation);
		}
		this._asyncCallbacks.clear();
	}

	public add(seq: number, callback: CallbackItem<ServerResponse.Response<R> | undefined>, isAsync: boolean) {
		if (isAsync) {
			this._asyncCallbacks.set(seq, callback);
		} else {
			this._callbacks.set(seq, callback);
		}
	}

	public fetch(seq: number): CallbackItem<ServerResponse.Response<R> | undefined> | undefined {
		const callback = this._callbacks.get(seq) || this._asyncCallbacks.get(seq);
		this.delete(seq);
		return callback;
	}

	public peek(seq: number): CallbackItem<ServerResponse.Response<R> | undefined> | undefined {
		return this._callbacks.get(seq) ?? this._asyncCallbacks.get(seq);
	}

	private delete(seq: number) {
		if (!this._callbacks.delete(seq)) {
			this._asyncCallbacks.delete(seq);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/tsServer/cancellation.electron.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/cancellation.electron.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import Tracer from '../logging/tracer';
import { getTempFile } from '../utils/temp.electron';
import { OngoingRequestCanceller, OngoingRequestCancellerFactory } from './cancellation';

export class NodeRequestCanceller implements OngoingRequestCanceller {
	public readonly cancellationPipeName: string;

	public constructor(
		private readonly _serverId: string,
		private readonly _tracer: Tracer,
	) {
		this.cancellationPipeName = getTempFile('tscancellation');
	}

	public tryCancelOngoingRequest(seq: number): boolean {
		if (!this.cancellationPipeName) {
			return false;
		}
		this._tracer.trace(this._serverId, `TypeScript Server: trying to cancel ongoing request with sequence number ${seq}`);
		try {
			fs.writeFileSync(this.cancellationPipeName + seq, '');
		} catch {
			// noop
		}
		return true;
	}
}


export const nodeRequestCancellerFactory = new class implements OngoingRequestCancellerFactory {
	create(serverId: string, tracer: Tracer): OngoingRequestCanceller {
		return new NodeRequestCanceller(serverId, tracer);
	}
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/tsServer/cancellation.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/cancellation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Tracer from '../logging/tracer';

export interface OngoingRequestCanceller {
	readonly cancellationPipeName: string | undefined;
	tryCancelOngoingRequest(seq: number): boolean;
}

export interface OngoingRequestCancellerFactory {
	create(serverId: string, tracer: Tracer): OngoingRequestCanceller;
}

const noopRequestCanceller = new class implements OngoingRequestCanceller {
	public readonly cancellationPipeName = undefined;

	public tryCancelOngoingRequest(_seq: number): boolean {
		return false;
	}
};

export const noopRequestCancellerFactory = new class implements OngoingRequestCancellerFactory {
	create(_serverId: string, _tracer: Tracer): OngoingRequestCanceller {
		return noopRequestCanceller;
	}
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/tsServer/fileWatchingManager.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/fileWatchingManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Utils } from 'vscode-uri';
import { Schemes } from '../configuration/schemes';
import { Logger } from '../logging/logger';
import { disposeAll, IDisposable } from '../utils/dispose';
import { ResourceMap } from '../utils/resourceMap';

interface DirWatcherEntry {
	readonly uri: vscode.Uri;
	readonly disposables: readonly IDisposable[];
}


export class FileWatcherManager implements IDisposable {

	private readonly _fileWatchers = new Map<number, {
		readonly uri: vscode.Uri;
		readonly watcher: vscode.FileSystemWatcher;
		readonly dirWatchers: DirWatcherEntry[];
	}>();

	private readonly _dirWatchers = new ResourceMap<{
		readonly uri: vscode.Uri;
		readonly watcher: vscode.FileSystemWatcher;
		refCount: number;
	}>(uri => uri.toString(), { onCaseInsensitiveFileSystem: false });

	constructor(
		private readonly logger: Logger,
	) { }

	dispose(): void {
		for (const entry of this._fileWatchers.values()) {
			entry.watcher.dispose();
		}
		this._fileWatchers.clear();

		for (const entry of this._dirWatchers.values()) {
			entry.watcher.dispose();
		}
		this._dirWatchers.clear();
	}

	create(id: number, uri: vscode.Uri, watchParentDirs: boolean, isRecursive: boolean, listeners: { create?: (uri: vscode.Uri) => void; change?: (uri: vscode.Uri) => void; delete?: (uri: vscode.Uri) => void }): void {
		this.logger.trace(`Creating file watcher for ${uri.toString()}`);

		// Non-writable file systems do not support file watching
		if (!vscode.workspace.fs.isWritableFileSystem(uri.scheme)) {
			return;
		}

		const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(uri, isRecursive ? '**' : '*'), !listeners.create, !listeners.change, !listeners.delete);
		const parentDirWatchers: DirWatcherEntry[] = [];
		this._fileWatchers.set(id, { uri, watcher, dirWatchers: parentDirWatchers });

		if (listeners.create) { watcher.onDidCreate(listeners.create); }
		if (listeners.change) { watcher.onDidChange(listeners.change); }
		if (listeners.delete) { watcher.onDidDelete(listeners.delete); }

		if (watchParentDirs && uri.scheme !== Schemes.untitled) {
			// We need to watch the parent directories too for when these are deleted / created
			for (let dirUri = Utils.dirname(uri); dirUri.path.length > 1; dirUri = Utils.dirname(dirUri)) {
				const disposables: IDisposable[] = [];

				let parentDirWatcher = this._dirWatchers.get(dirUri);
				if (!parentDirWatcher) {
					this.logger.trace(`Creating parent dir watcher for ${dirUri.toString()}`);
					const glob = new vscode.RelativePattern(Utils.dirname(dirUri), Utils.basename(dirUri));
					const parentWatcher = vscode.workspace.createFileSystemWatcher(glob, !listeners.create, true, !listeners.delete);
					parentDirWatcher = { uri: dirUri, refCount: 0, watcher: parentWatcher };
					this._dirWatchers.set(dirUri, parentDirWatcher);
				}
				parentDirWatcher.refCount++;

				if (listeners.create) {
					disposables.push(parentDirWatcher.watcher.onDidCreate(async () => {
						// Just because the parent dir was created doesn't mean our file was created
						try {
							const stat = await vscode.workspace.fs.stat(uri);
							if (stat.type === vscode.FileType.File) {
								listeners.create!(uri);
							}
						} catch {
							// Noop
						}
					}));
				}

				if (listeners.delete) {
					// When the parent dir is deleted, consider our file deleted too
					// TODO: this fires if the file previously did not exist and then the parent is deleted
					disposables.push(parentDirWatcher.watcher.onDidDelete(listeners.delete));
				}

				parentDirWatchers.push({ uri: dirUri, disposables });
			}
		}
	}


	delete(id: number): void {
		const entry = this._fileWatchers.get(id);
		if (entry) {
			this.logger.trace(`Deleting file watcher for ${entry.uri}`);

			for (const dirWatcher of entry.dirWatchers) {
				disposeAll(dirWatcher.disposables);

				const dirWatcherEntry = this._dirWatchers.get(dirWatcher.uri);
				if (dirWatcherEntry) {
					if (--dirWatcherEntry.refCount <= 0) {
						this.logger.trace(`Deleting parent dir ${dirWatcherEntry.uri}`);
						dirWatcherEntry.watcher.dispose();
						this._dirWatchers.delete(dirWatcher.uri);
					}
				}
			}

			entry.watcher.dispose();
		}

		this._fileWatchers.delete(id);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/tsServer/logDirectoryProvider.electron.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/logDirectoryProvider.electron.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { ILogDirectoryProvider } from './logDirectoryProvider';
import { Lazy } from '../utils/lazy';

export class NodeLogDirectoryProvider implements ILogDirectoryProvider {
	public constructor(
		private readonly context: vscode.ExtensionContext
	) { }

	public getNewLogDirectory(): vscode.Uri | undefined {
		const root = this.logDirectory.value;
		if (root) {
			try {
				return vscode.Uri.file(fs.mkdtempSync(path.join(root, `tsserver-log-`)));
			} catch (e) {
				return undefined;
			}
		}
		return undefined;
	}

	private readonly logDirectory = new Lazy<string | undefined>(() => {
		try {
			const path = this.context.logPath;
			if (!fs.existsSync(path)) {
				fs.mkdirSync(path);
			}
			return this.context.logPath;
		} catch {
			return undefined;
		}
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/tsServer/logDirectoryProvider.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/logDirectoryProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export interface ILogDirectoryProvider {
	getNewLogDirectory(): vscode.Uri | undefined;
}

export const noopLogDirectoryProvider = new class implements ILogDirectoryProvider {
	public getNewLogDirectory(): undefined {
		return undefined;
	}
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/tsServer/nodeManager.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/nodeManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { TypeScriptServiceConfiguration } from '../configuration/configuration';
import { setImmediate } from '../utils/async';
import { Disposable } from '../utils/dispose';


const useWorkspaceNodeStorageKey = 'typescript.useWorkspaceNode';
const lastKnownWorkspaceNodeStorageKey = 'typescript.lastKnownWorkspaceNode';
type UseWorkspaceNodeState = undefined | boolean;
type LastKnownWorkspaceNodeState = undefined | string;

export class NodeVersionManager extends Disposable {
	private _currentVersion: string | undefined;

	public constructor(
		private configuration: TypeScriptServiceConfiguration,
		private readonly workspaceState: vscode.Memento
	) {
		super();

		this._currentVersion = this.configuration.globalNodePath || undefined;
		if (vscode.workspace.isTrusted) {
			const workspaceVersion = this.configuration.localNodePath;
			if (workspaceVersion) {
				const useWorkspaceNode = this.canUseWorkspaceNode(workspaceVersion);
				if (useWorkspaceNode === undefined) {
					setImmediate(() => {
						this.promptAndSetWorkspaceNode();
					});
				}
				else if (useWorkspaceNode) {
					this._currentVersion = workspaceVersion;
				}
			}
		}
		else {
			this._disposables.push(vscode.workspace.onDidGrantWorkspaceTrust(() => {
				const workspaceVersion = this.configuration.localNodePath;
				if (workspaceVersion) {
					const useWorkspaceNode = this.canUseWorkspaceNode(workspaceVersion);
					if (useWorkspaceNode === undefined) {
						setImmediate(() => {
							this.promptAndSetWorkspaceNode();
						});
					}
					else if (useWorkspaceNode) {
						this.updateActiveVersion(workspaceVersion);
					}
				}
			}));
		}
	}

	private readonly _onDidPickNewVersion = this._register(new vscode.EventEmitter<void>());
	public readonly onDidPickNewVersion = this._onDidPickNewVersion.event;

	public get currentVersion(): string | undefined {
		return this._currentVersion;
	}

	public async updateConfiguration(nextConfiguration: TypeScriptServiceConfiguration) {
		const oldConfiguration = this.configuration;
		this.configuration = nextConfiguration;
		if (oldConfiguration.globalNodePath !== nextConfiguration.globalNodePath
			|| oldConfiguration.localNodePath !== nextConfiguration.localNodePath) {
			await this.computeNewVersion();
		}
	}

	private async computeNewVersion() {
		let version = this.configuration.globalNodePath || undefined;
		const workspaceVersion = this.configuration.localNodePath;
		if (vscode.workspace.isTrusted && workspaceVersion) {
			const useWorkspaceNode = this.canUseWorkspaceNode(workspaceVersion);
			if (useWorkspaceNode === undefined) {
				version = await this.promptUseWorkspaceNode() || version;
			}
			else if (useWorkspaceNode) {
				version = workspaceVersion;
			}
		}
		this.updateActiveVersion(version);
	}

	private async promptUseWorkspaceNode(): Promise<string | undefined> {
		const workspaceVersion = this.configuration.localNodePath;
		if (workspaceVersion === null) {
			throw new Error('Could not prompt to use workspace Node installation because no workspace Node installation is specified');
		}

		const allow = vscode.l10n.t("Yes");
		const disallow = vscode.l10n.t("No");
		const dismiss = vscode.l10n.t("Not now");

		const result = await vscode.window.showInformationMessage(vscode.l10n.t("This workspace wants to use the Node installation at '{0}' to run TS Server. Would you like to use it?", workspaceVersion),
			allow,
			disallow,
			dismiss,
		);

		let version = undefined;
		switch (result) {
			case allow:
				await this.setUseWorkspaceNodeState(true, workspaceVersion);
				version = workspaceVersion;
				break;
			case disallow:
				await this.setUseWorkspaceNodeState(false, workspaceVersion);
				break;
			case dismiss:
				await this.setUseWorkspaceNodeState(undefined, workspaceVersion);
				break;
		}
		return version;
	}

	private async promptAndSetWorkspaceNode(): Promise<void> {
		const version = await this.promptUseWorkspaceNode();
		if (version !== undefined) {
			this.updateActiveVersion(version);
		}
	}

	private updateActiveVersion(pickedVersion: string | undefined): void {
		const oldVersion = this.currentVersion;
		this._currentVersion = pickedVersion;
		if (oldVersion !== pickedVersion) {
			this._onDidPickNewVersion.fire();
		}
	}

	private canUseWorkspaceNode(nodeVersion: string): boolean | undefined {
		const lastKnownWorkspaceNode = this.workspaceState.get<LastKnownWorkspaceNodeState>(lastKnownWorkspaceNodeStorageKey);
		if (lastKnownWorkspaceNode === nodeVersion) {
			return this.workspaceState.get<UseWorkspaceNodeState>(useWorkspaceNodeStorageKey);
		}
		return undefined;
	}

	private async setUseWorkspaceNodeState(allow: boolean | undefined, nodeVersion: string) {
		await this.workspaceState.update(lastKnownWorkspaceNodeStorageKey, nodeVersion);
		await this.workspaceState.update(useWorkspaceNodeStorageKey, allow);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/tsServer/pluginPathsProvider.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/pluginPathsProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as path from 'path';
import * as vscode from 'vscode';
import { RelativeWorkspacePathResolver } from '../utils/relativePathResolver';
import { TypeScriptServiceConfiguration } from '../configuration/configuration';


export class TypeScriptPluginPathsProvider {

	public constructor(
		private configuration: TypeScriptServiceConfiguration
	) { }

	public updateConfiguration(configuration: TypeScriptServiceConfiguration): void {
		this.configuration = configuration;
	}

	public getPluginPaths(): string[] {
		const pluginPaths = [];
		for (const pluginPath of this.configuration.tsServerPluginPaths) {
			pluginPaths.push(...this.resolvePluginPath(pluginPath));
		}
		return pluginPaths;
	}

	private resolvePluginPath(pluginPath: string): string[] {
		if (path.isAbsolute(pluginPath)) {
			return [pluginPath];
		}

		const workspacePath = RelativeWorkspacePathResolver.asAbsoluteWorkspacePath(pluginPath);
		if (workspacePath !== undefined) {
			return [workspacePath];
		}

		return (vscode.workspace.workspaceFolders || [])
			.map(workspaceFolder => path.join(workspaceFolder.uri.fsPath, pluginPath));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/tsServer/plugins.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/plugins.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as arrays from '../utils/arrays';
import { Disposable } from '../utils/dispose';

export interface TypeScriptServerPlugin {
	readonly extension: vscode.Extension<unknown>;
	readonly uri: vscode.Uri;
	readonly name: string;
	readonly enableForWorkspaceTypeScriptVersions: boolean;
	readonly languages: ReadonlyArray<string>;
	readonly configNamespace?: string;
}

namespace TypeScriptServerPlugin {
	export function equals(a: TypeScriptServerPlugin, b: TypeScriptServerPlugin): boolean {
		return a.uri.toString() === b.uri.toString()
			&& a.name === b.name
			&& a.enableForWorkspaceTypeScriptVersions === b.enableForWorkspaceTypeScriptVersions
			&& arrays.equals(a.languages, b.languages);
	}
}

export class PluginManager extends Disposable {
	private readonly _pluginConfigurations = new Map<string, unknown>();

	private _plugins?: Map<string, ReadonlyArray<TypeScriptServerPlugin>>;

	constructor() {
		super();

		vscode.extensions.onDidChange(() => {
			if (!this._plugins) {
				return;
			}

			const newPlugins = this.readPlugins();
			if (!arrays.equals(Array.from(this._plugins.values()).flat(), Array.from(newPlugins.values()).flat(), TypeScriptServerPlugin.equals)) {
				this._plugins = newPlugins;
				this._onDidUpdatePlugins.fire(this);
			}
		}, undefined, this._disposables);
	}

	public get plugins(): ReadonlyArray<TypeScriptServerPlugin> {
		this._plugins ??= this.readPlugins();
		return Array.from(this._plugins.values()).flat();
	}

	private readonly _onDidUpdatePlugins = this._register(new vscode.EventEmitter<this>());
	public readonly onDidChangePlugins = this._onDidUpdatePlugins.event;

	private readonly _onDidUpdateConfig = this._register(new vscode.EventEmitter<{ pluginId: string; config: unknown }>());
	public readonly onDidUpdateConfig = this._onDidUpdateConfig.event;

	public setConfiguration(pluginId: string, config: unknown) {
		this._pluginConfigurations.set(pluginId, config);
		this._onDidUpdateConfig.fire({ pluginId, config });
	}

	public configurations(): IterableIterator<[string, unknown]> {
		return this._pluginConfigurations.entries();
	}

	private readPlugins() {
		const pluginMap = new Map<string, ReadonlyArray<TypeScriptServerPlugin>>();
		for (const extension of vscode.extensions.all) {
			const pack = extension.packageJSON;
			if (pack.contributes && Array.isArray(pack.contributes.typescriptServerPlugins)) {
				const plugins: TypeScriptServerPlugin[] = [];
				for (const plugin of pack.contributes.typescriptServerPlugins) {
					plugins.push({
						extension,
						name: plugin.name,
						enableForWorkspaceTypeScriptVersions: !!plugin.enableForWorkspaceTypeScriptVersions,
						uri: extension.extensionUri,
						languages: Array.isArray(plugin.languages) ? plugin.languages : [],
						configNamespace: plugin.configNamespace,
					});
				}
				if (plugins.length) {
					pluginMap.set(extension.id, plugins);
				}
			}
		}
		return pluginMap;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/tsServer/requestQueue.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/requestQueue.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as Proto from './protocol/protocol';

export enum RequestQueueingType {
	/**
	 * Normal request that is executed in order.
	 */
	Normal = 1,

	/**
	 * Request that normal requests jump in front of in the queue.
	 */
	LowPriority = 2,

	/**
	 * A fence that blocks request reordering.
	 *
	 * Fences are not reordered. Unlike a normal request, a fence will never jump in front of a low priority request
	 * in the request queue.
	 */
	Fence = 3,
}

export interface RequestItem {
	readonly request: Proto.Request;
	readonly expectsResponse: boolean;
	readonly isAsync: boolean;
	readonly queueingType: RequestQueueingType;
}

export class RequestQueue {
	private readonly queue: RequestItem[] = [];
	private sequenceNumber: number = 0;

	public get length(): number {
		return this.queue.length;
	}

	public enqueue(item: RequestItem): void {
		if (item.queueingType === RequestQueueingType.Normal) {
			let index = this.queue.length - 1;
			while (index >= 0) {
				if (this.queue[index].queueingType !== RequestQueueingType.LowPriority) {
					break;
				}
				--index;
			}
			this.queue.splice(index + 1, 0, item);
		} else {
			// Only normal priority requests can be reordered. All other requests just go to the end.
			this.queue.push(item);
		}
	}

	public dequeue(): RequestItem | undefined {
		return this.queue.shift();
	}

	public getQueuedCommands(skipLast: boolean = false): string[] {
		const result: string[] = [];
		const end = skipLast ? this.queue.length - 1 : this.queue.length;
		if (end <= 0) {
			return result;
		}
		for (let i = 0; i < end; i++) {
			const item = this.queue[i];
			result.push(item.request.command);
			if (result.length >= 5) {
				break;
			}
		}
		return result;
	}

	public tryDeletePendingRequest(seq: number): boolean {
		for (let i = 0; i < this.queue.length; i++) {
			if (this.queue[i].request.seq === seq) {
				this.queue.splice(i, 1);
				return true;
			}
		}
		return false;
	}

	public createRequest(command: string, args: unknown): Proto.Request {
		return {
			seq: this.sequenceNumber++,
			type: 'request',
			command: command,
			arguments: args
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/tsServer/server.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/server.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Cancellation } from '@vscode/sync-api-common/lib/common/messageCancellation';
import * as vscode from 'vscode';
import { RequestArgs } from '../commands/tsserverRequests';
import { TypeScriptServiceConfiguration } from '../configuration/configuration';
import { TelemetryReporter } from '../logging/telemetry';
import Tracer from '../logging/tracer';
import { CallbackMap, type CallbackItem } from '../tsServer/callbackMap';
import { RequestItem, RequestQueue, RequestQueueingType } from '../tsServer/requestQueue';
import { TypeScriptServerError } from '../tsServer/serverError';
import { ServerResponse, ServerType, TypeScriptRequests } from '../typescriptService';
import { Disposable } from '../utils/dispose';
import { isWebAndHasSharedArrayBuffers } from '../utils/platform';
import { OngoingRequestCanceller } from './cancellation';
import { NodeVersionManager } from './nodeManager';
import type * as Proto from './protocol/protocol';
import { EventName } from './protocol/protocol.const';
import { TypeScriptVersionManager } from './versionManager';
import { TypeScriptVersion } from './versionProvider';

export enum ExecutionTarget {
	Semantic,
	Syntax
}

export interface TypeScriptServerExitEvent {
	readonly code: number | null;
	readonly signal: string | null;
}

export type TsServerLog =
	{ readonly type: 'file'; readonly uri: vscode.Uri } |
	{ readonly type: 'output'; readonly output: vscode.OutputChannel };

export interface ITypeScriptServer {
	readonly onEvent: vscode.Event<Proto.Event>;
	readonly onExit: vscode.Event<TypeScriptServerExitEvent>;
	readonly onError: vscode.Event<unknown>;

	readonly tsServerLog: TsServerLog | undefined;

	kill(): void;

	/**
	 * @return A list of all execute requests. If there are multiple entries, the first item is the primary
	 * request while the rest are secondary ones.
	 */
	executeImpl(command: keyof TypeScriptRequests, args: unknown, executeInfo: { isAsync: boolean; token?: vscode.CancellationToken; expectsResult: boolean; lowPriority?: boolean; executionTarget?: ExecutionTarget }): Array<Promise<ServerResponse.Response<Proto.Response>> | undefined>;

	dispose(): void;
}

export interface TsServerDelegate {
	onFatalError(command: string, error: Error): void;
}

export const enum TsServerProcessKind {
	Main = 'main',
	Syntax = 'syntax',
	Semantic = 'semantic',
	Diagnostics = 'diagnostics'
}

export interface TsServerProcessFactory {
	fork(
		version: TypeScriptVersion,
		args: readonly string[],
		kind: TsServerProcessKind,
		configuration: TypeScriptServiceConfiguration,
		versionManager: TypeScriptVersionManager,
		nodeVersionManager: NodeVersionManager,
		tsServerLog: TsServerLog | undefined,
	): TsServerProcess;
}

export interface TsServerProcess {
	write(serverRequest: Proto.Request): void;

	onData(handler: (data: Proto.Response) => void): void;
	onExit(handler: (code: number | null, signal: string | null) => void): void;
	onError(handler: (error: Error) => void): void;

	kill(): void;
}

export class SingleTsServer extends Disposable implements ITypeScriptServer {
	private readonly _requestQueue = new RequestQueue();
	private readonly _callbacks = new CallbackMap<Proto.Response>();
	private readonly _pendingResponses = new Set<number>();

	constructor(
		private readonly _serverId: string,
		private readonly _serverSource: ServerType,
		private readonly _process: TsServerProcess,
		private readonly _tsServerLog: TsServerLog | undefined,
		private readonly _requestCanceller: OngoingRequestCanceller,
		private readonly _version: TypeScriptVersion,
		private readonly _telemetryReporter: TelemetryReporter,
		private readonly _tracer: Tracer,
	) {
		super();

		this._process.onData(msg => {
			this.dispatchMessage(msg);
		});

		this._process.onExit((code, signal) => {
			this._onExit.fire({ code, signal });
			this._callbacks.destroy('server exited');
		});

		this._process.onError(error => {
			this._onError.fire(error);
			this._callbacks.destroy('server errored');
		});
	}

	private readonly _onEvent = this._register(new vscode.EventEmitter<Proto.Event>());
	public readonly onEvent = this._onEvent.event;

	private readonly _onExit = this._register(new vscode.EventEmitter<TypeScriptServerExitEvent>());
	public readonly onExit = this._onExit.event;

	private readonly _onError = this._register(new vscode.EventEmitter<unknown>());
	public readonly onError = this._onError.event;

	public get tsServerLog() { return this._tsServerLog; }

	private write(serverRequest: Proto.Request) {
		this._process.write(serverRequest);
	}

	public override dispose() {
		super.dispose();
		this._callbacks.destroy('server disposed');
		this._pendingResponses.clear();
	}

	public kill() {
		this._process.kill();
	}

	private dispatchMessage(message: Proto.Message) {
		try {
			switch (message.type) {
				case 'response':
					if (this._serverSource) {
						this.dispatchResponse({
							...(message as Proto.Response),
							_serverType: this._serverSource
						});
					} else {
						this.dispatchResponse(message as Proto.Response);
					}
					break;

				case 'event': {
					const event = message as Proto.Event;
					if (event.event === 'requestCompleted') {
						const seq = (event as Proto.RequestCompletedEvent).body.request_seq;
						const callback = this._callbacks.fetch(seq);
						if (callback) {
							this._tracer.traceRequestCompleted(this._serverId, 'requestCompleted', seq, callback);
							callback.onSuccess(undefined);
						}
						if ((event as Proto.RequestCompletedEvent).body.performanceData) {
							this._onEvent.fire(event);
						}
					} else {
						this._tracer.traceEvent(this._serverId, event);
						this._onEvent.fire(event);
					}
					break;
				}
				default:
					throw new Error(`Unknown message type ${message.type} received`);
			}
		} finally {
			this.sendNextRequests();
		}
	}

	private tryCancelRequest(request: Proto.Request, command: string): boolean {
		const seq = request.seq;
		const callback = this._callbacks.peek(seq);
		if (callback?.traceId !== undefined) {
			this._telemetryReporter.logTraceEvent('TSServer.tryCancelRequest', callback.traceId, JSON.stringify({ command, cancelled: true }));
		}
		try {
			if (this._requestQueue.tryDeletePendingRequest(seq)) {
				this.logTrace(`Canceled request with sequence number ${seq}`);
				return true;
			}
			if (this._requestCanceller.tryCancelOngoingRequest(seq)) {
				return true;
			}
			this.logTrace(`Tried to cancel request with sequence number ${seq}. But request got already delivered.`);
			return false;
		} finally {
			const callback = this.fetchCallback(seq);
			callback?.onSuccess(new ServerResponse.Cancelled(`Cancelled request ${seq} - ${command}`));
		}
	}

	private dispatchResponse(response: Proto.Response) {
		const callback = this.fetchCallback(response.request_seq);
		if (!callback) {
			return;
		}
		if (callback.traceId !== undefined) {
			this._telemetryReporter.logTraceEvent('TSServerRequest.dispatchResponse', callback.traceId, JSON.stringify({ command: response.command, success: response.success, performanceData: response.performanceData }));
		}
		this._tracer.traceResponse(this._serverId, response, callback);
		if (response.success) {
			callback.onSuccess(response);
		} else if (response.message === 'No content available.') {
			// Special case where response itself is successful but there is not any data to return.
			callback.onSuccess(ServerResponse.NoContent);
		} else {
			callback.onError(TypeScriptServerError.create(this._serverId, this._version, response));
		}
	}

	public executeImpl(command: keyof TypeScriptRequests, args: unknown, executeInfo: { isAsync: boolean; token?: vscode.CancellationToken; expectsResult: boolean; lowPriority?: boolean; executionTarget?: ExecutionTarget }): Array<Promise<ServerResponse.Response<Proto.Response>> | undefined> {
		const request = this._requestQueue.createRequest(command, args);
		const requestInfo: RequestItem = {
			request,
			expectsResponse: executeInfo.expectsResult,
			isAsync: executeInfo.isAsync,
			queueingType: SingleTsServer.getQueueingType(command, executeInfo.lowPriority)
		};
		let result: Promise<ServerResponse.Response<Proto.Response>> | undefined;
		if (executeInfo.expectsResult) {
			result = new Promise<ServerResponse.Response<Proto.Response>>((resolve, reject) => {
				const item: CallbackItem<ServerResponse.Response<Proto.Response> | undefined> = typeof request.arguments?.$traceId === 'string'
					? {
						onSuccess: resolve as () => ServerResponse.Response<Proto.Response> | undefined,
						onError: reject,
						queuingStartTime: Date.now(),
						isAsync: executeInfo.isAsync,
						command: request.command,
						traceId: request.arguments.$traceId
					} : {
						onSuccess: resolve as () => ServerResponse.Response<Proto.Response> | undefined,
						onError: reject,
						queuingStartTime: Date.now(),
						isAsync: executeInfo.isAsync,
						command: request.command,
					};
				this._callbacks.add(request.seq, item, executeInfo.isAsync);
				if (executeInfo.token) {

					const cancelViaSAB = isWebAndHasSharedArrayBuffers()
						? Cancellation.addData(request)
						: undefined;

					executeInfo.token.onCancellationRequested(() => {
						cancelViaSAB?.();
						this.tryCancelRequest(request, command);
					});
				}
			}).catch((err: Error) => {
				if (err instanceof TypeScriptServerError) {
					if (!executeInfo.token?.isCancellationRequested) {
						/* __GDPR__
							"languageServiceErrorResponse" : {
								"owner": "mjbvz",
								"${include}": [
									"${TypeScriptCommonProperties}",
									"${TypeScriptRequestErrorProperties}"
								]
							}
						*/
						this._telemetryReporter.logTelemetry('languageServiceErrorResponse', err.telemetry);
					}
				}

				throw err;
			});
		}

		this._requestQueue.enqueue(requestInfo);
		const traceId = (args as RequestArgs | undefined)?.$traceId;
		if (args && typeof traceId === 'string') {
			const queueLength = this._requestQueue.length - 1;
			const pendingResponses = this._pendingResponses.size;
			const data: { command: string; queueLength: number; pendingResponses: number; queuedCommands?: string[]; pendingCommands?: string[] } = {
				command: request.command,
				queueLength,
				pendingResponses
			};
			if (queueLength > 0) {
				data.queuedCommands = this._requestQueue.getQueuedCommands(true);
			}
			if (pendingResponses > 0) {
				data.pendingCommands = this.getPendingCommands();
			}

			this._telemetryReporter.logTraceEvent('TSServer.enqueueRequest', traceId, JSON.stringify(data));
		}
		this.sendNextRequests();

		return [result];
	}

	private getPendingCommands(): string[] {
		const result: string[] = [];
		for (const seq of this._pendingResponses) {
			const callback = this._callbacks.peek(seq);
			if (typeof callback?.command !== 'string') {
				continue;
			}
			result.push(callback.command);
			if (result.length >= 5) {
				break;
			}
		}
		return result;
	}

	private sendNextRequests(): void {
		while (this._pendingResponses.size === 0 && this._requestQueue.length > 0) {
			const item = this._requestQueue.dequeue();
			if (item) {
				this.sendRequest(item);
			}
		}
	}

	private sendRequest(requestItem: RequestItem): void {
		const serverRequest = requestItem.request;
		this._tracer.traceRequest(this._serverId, serverRequest, requestItem.expectsResponse, this._requestQueue.length);

		if (requestItem.expectsResponse && !requestItem.isAsync) {
			this._pendingResponses.add(requestItem.request.seq);
		}

		try {
			this.write(serverRequest);
			if (typeof serverRequest.arguments?.$traceId === 'string') {
				this._telemetryReporter.logTraceEvent('TSServer.sendRequest', serverRequest.arguments.$traceId, JSON.stringify({ command: serverRequest.command }));
			}
		} catch (err) {
			const callback = this.fetchCallback(serverRequest.seq);
			callback?.onError(err);
		}
	}

	private fetchCallback(seq: number) {
		const callback = this._callbacks.fetch(seq);
		if (!callback) {
			return undefined;
		}

		this._pendingResponses.delete(seq);
		return callback;
	}

	private logTrace(message: string) {
		this._tracer.trace(this._serverId, message);
	}

	private static readonly fenceCommands = new Set(['change', 'close', 'open', 'updateOpen']);

	private static getQueueingType(
		command: string,
		lowPriority?: boolean
	): RequestQueueingType {
		if (SingleTsServer.fenceCommands.has(command)) {
			return RequestQueueingType.Fence;
		}
		return lowPriority ? RequestQueueingType.LowPriority : RequestQueueingType.Normal;
	}
}


interface ExecuteInfo {
	readonly isAsync: boolean;
	readonly token?: vscode.CancellationToken;
	readonly expectsResult: boolean;
	readonly lowPriority?: boolean;
	readonly executionTarget?: ExecutionTarget;
}

class RequestRouter {

	private static readonly sharedCommands = new Set<keyof TypeScriptRequests>([
		'change',
		'close',
		'open',
		'updateOpen',
		'configure',
	]);

	constructor(
		private readonly servers: ReadonlyArray<{
			readonly server: ITypeScriptServer;
			canRun?(command: keyof TypeScriptRequests, executeInfo: ExecuteInfo): boolean;
		}>,
		private readonly delegate: TsServerDelegate,
	) { }

	public execute(
		command: keyof TypeScriptRequests,
		args: unknown,
		executeInfo: ExecuteInfo,
	): Array<Promise<ServerResponse.Response<Proto.Response>> | undefined> {
		if (RequestRouter.sharedCommands.has(command) && typeof executeInfo.executionTarget === 'undefined') {
			// Dispatch shared commands to all servers but use first one as the primary response

			const requestStates: RequestState.State[] = this.servers.map(() => RequestState.Unresolved);

			// Also make sure we never cancel requests to just one server
			let token: vscode.CancellationToken | undefined = undefined;
			if (executeInfo.token) {
				const source = new vscode.CancellationTokenSource();
				executeInfo.token.onCancellationRequested(() => {
					if (requestStates.some(state => state === RequestState.Resolved)) {
						// Don't cancel.
						// One of the servers completed this request so we don't want to leave the other
						// in a different state.
						return;
					}
					source.cancel();
				});
				token = source.token;
			}

			const allRequests: Array<Promise<ServerResponse.Response<Proto.Response>> | undefined> = [];

			for (let serverIndex = 0; serverIndex < this.servers.length; ++serverIndex) {
				const server = this.servers[serverIndex].server;

				const request = server.executeImpl(command, args, { ...executeInfo, token })[0];
				allRequests.push(request);
				if (request) {
					request
						.then(result => {
							requestStates[serverIndex] = RequestState.Resolved;
							const erroredRequest = requestStates.find(state => state.type === RequestState.Type.Errored) as RequestState.Errored | undefined;
							if (erroredRequest) {
								// We've gone out of sync
								this.delegate.onFatalError(command, erroredRequest.err);
							}
							return result;
						}, err => {
							requestStates[serverIndex] = new RequestState.Errored(err);
							if (requestStates.some(state => state === RequestState.Resolved)) {
								// We've gone out of sync
								this.delegate.onFatalError(command, err);
							}
							throw err;
						});
				}
			}

			return allRequests;
		}

		for (const { canRun, server } of this.servers) {
			if (!canRun || canRun(command, executeInfo)) {
				return server.executeImpl(command, args, executeInfo);
			}
		}

		throw new Error(`Could not find server for command: '${command}'`);
	}
}

export class GetErrRoutingTsServer extends Disposable implements ITypeScriptServer {

	private static readonly diagnosticEvents = new Set<string>([
		EventName.configFileDiag,
		EventName.syntaxDiag,
		EventName.semanticDiag,
		EventName.suggestionDiag
	]);

	private readonly getErrServer: ITypeScriptServer;
	private readonly mainServer: ITypeScriptServer;
	private readonly router: RequestRouter;

	public constructor(
		servers: { getErr: ITypeScriptServer; primary: ITypeScriptServer },
		delegate: TsServerDelegate,
	) {
		super();

		this.getErrServer = servers.getErr;
		this.mainServer = servers.primary;

		this.router = new RequestRouter(
			[
				{ server: this.getErrServer, canRun: (command) => ['geterr', 'geterrForProject'].includes(command) },
				{ server: this.mainServer, canRun: undefined /* gets all other commands */ }
			],
			delegate);

		this._register(this.getErrServer.onEvent(e => {
			if (GetErrRoutingTsServer.diagnosticEvents.has(e.event)) {
				this._onEvent.fire(e);
			}
			// Ignore all other events
		}));
		this._register(this.mainServer.onEvent(e => {
			if (!GetErrRoutingTsServer.diagnosticEvents.has(e.event)) {
				this._onEvent.fire(e);
			}
			// Ignore all other events
		}));

		this._register(this.getErrServer.onError(e => this._onError.fire(e)));
		this._register(this.mainServer.onError(e => this._onError.fire(e)));

		this._register(this.mainServer.onExit(e => {
			this._onExit.fire(e);
			this.getErrServer.kill();
		}));
	}

	private readonly _onEvent = this._register(new vscode.EventEmitter<Proto.Event>());
	public readonly onEvent = this._onEvent.event;

	private readonly _onExit = this._register(new vscode.EventEmitter<TypeScriptServerExitEvent>());
	public readonly onExit = this._onExit.event;

	private readonly _onError = this._register(new vscode.EventEmitter<unknown>());
	public readonly onError = this._onError.event;

	public get tsServerLog() { return this.mainServer.tsServerLog; }

	public kill(): void {
		this.getErrServer.kill();
		this.mainServer.kill();
	}

	public executeImpl(command: keyof TypeScriptRequests, args: unknown, executeInfo: { isAsync: boolean; token?: vscode.CancellationToken; expectsResult: boolean; lowPriority?: boolean; executionTarget?: ExecutionTarget }): Array<Promise<ServerResponse.Response<Proto.Response>> | undefined> {
		return this.router.execute(command, args, executeInfo);
	}
}


export class SyntaxRoutingTsServer extends Disposable implements ITypeScriptServer {

	/**
	 * Commands that should always be run on the syntax server.
	 */
	private static readonly syntaxAlwaysCommands = new Set<keyof TypeScriptRequests>([
		'navtree',
		'getOutliningSpans',
		'jsxClosingTag',
		'selectionRange',
		'format',
		'formatonkey',
		'docCommentTemplate',
		'linkedEditingRange'
	]);

	/**
	 * Commands that should always be run on the semantic server.
	 */
	private static readonly semanticCommands = new Set<keyof TypeScriptRequests>([
		'geterr',
		'geterrForProject',
		'projectInfo',
		'configurePlugin',
	]);

	/**
	 * Commands that can be run on the syntax server but would benefit from being upgraded to the semantic server.
	 */
	private static readonly syntaxAllowedCommands = new Set<keyof TypeScriptRequests>([
		'completions',
		'completionEntryDetails',
		'completionInfo',
		'definition',
		'definitionAndBoundSpan',
		'documentHighlights',
		'implementation',
		'navto',
		'quickinfo',
		'references',
		'rename',
		'signatureHelp',
	]);

	private readonly syntaxServer: ITypeScriptServer;
	private readonly semanticServer: ITypeScriptServer;
	private readonly router: RequestRouter;

	private _projectLoading = true;

	public constructor(
		servers: { syntax: ITypeScriptServer; semantic: ITypeScriptServer },
		delegate: TsServerDelegate,
		enableDynamicRouting: boolean,
	) {
		super();

		this.syntaxServer = servers.syntax;
		this.semanticServer = servers.semantic;

		this.router = new RequestRouter(
			[
				{
					server: this.syntaxServer,
					canRun: (command, execInfo) => {
						switch (execInfo.executionTarget) {
							case ExecutionTarget.Semantic: return false;
							case ExecutionTarget.Syntax: return true;
						}

						if (SyntaxRoutingTsServer.syntaxAlwaysCommands.has(command)) {
							return true;
						}
						if (SyntaxRoutingTsServer.semanticCommands.has(command)) {
							return false;
						}
						if (enableDynamicRouting && this.projectLoading && SyntaxRoutingTsServer.syntaxAllowedCommands.has(command)) {
							return true;
						}
						return false;
					}
				}, {
					server: this.semanticServer,
					canRun: undefined /* gets all other commands */
				}
			],
			delegate);

		this._register(this.syntaxServer.onEvent(e => {
			return this._onEvent.fire(e);
		}));

		this._register(this.semanticServer.onEvent(e => {
			switch (e.event) {
				case EventName.projectLoadingStart:
					this._projectLoading = true;
					break;

				case EventName.projectLoadingFinish:
				case EventName.semanticDiag:
				case EventName.syntaxDiag:
				case EventName.suggestionDiag:
				case EventName.configFileDiag:
					this._projectLoading = false;
					break;
			}
			return this._onEvent.fire(e);
		}));

		this._register(this.semanticServer.onExit(e => {
			this._onExit.fire(e);
			this.syntaxServer.kill();
		}));

		this._register(this.semanticServer.onError(e => this._onError.fire(e)));
	}

	private get projectLoading() { return this._projectLoading; }

	private readonly _onEvent = this._register(new vscode.EventEmitter<Proto.Event>());
	public readonly onEvent = this._onEvent.event;

	private readonly _onExit = this._register(new vscode.EventEmitter<TypeScriptServerExitEvent>());
	public readonly onExit = this._onExit.event;

	private readonly _onError = this._register(new vscode.EventEmitter<unknown>());
	public readonly onError = this._onError.event;

	public get tsServerLog() { return this.semanticServer.tsServerLog; }

	public kill(): void {
		this.syntaxServer.kill();
		this.semanticServer.kill();
	}

	public executeImpl(command: keyof TypeScriptRequests, args: unknown, executeInfo: { isAsync: boolean; token?: vscode.CancellationToken; expectsResult: boolean; lowPriority?: boolean; executionTarget?: ExecutionTarget }): Array<Promise<ServerResponse.Response<Proto.Response>> | undefined> {
		return this.router.execute(command, args, executeInfo);
	}
}

namespace RequestState {
	export const enum Type { Unresolved, Resolved, Errored }

	export const Unresolved = { type: Type.Unresolved } as const;

	export const Resolved = { type: Type.Resolved } as const;

	export class Errored {
		readonly type = Type.Errored;

		constructor(
			public readonly err: Error
		) { }
	}

	export type State = typeof Unresolved | typeof Resolved | Errored;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/tsServer/serverError.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/serverError.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as Proto from './protocol/protocol';
import { TypeScriptVersion } from './versionProvider';


export class TypeScriptServerError extends Error {
	public static create(
		serverId: string,
		version: TypeScriptVersion,
		response: Proto.Response
	): TypeScriptServerError {
		const parsedResult = TypeScriptServerError.parseErrorText(response);
		return new TypeScriptServerError(serverId, version, response, parsedResult?.message, parsedResult?.stack, parsedResult?.sanitizedStack);
	}

	private constructor(
		public readonly serverId: string,
		public readonly version: TypeScriptVersion,
		private readonly response: Proto.Response,
		public readonly serverMessage: string | undefined,
		public readonly serverStack: string | undefined,
		private readonly sanitizedStack: string | undefined
	) {
		super([
			`<${serverId}> TypeScript Server Error (${version.displayName})`,
			serverMessage,
			serverStack
		].filter(Boolean).join('\n'));
	}

	public get serverErrorText() { return this.response.message; }

	public get serverCommand() { return this.response.command; }

	public get telemetry() {
		// The "sanitizedstack" has been purged of error messages, paths, and file names (other than tsserver)
		// and, thus, can be classified as SystemMetaData, rather than CallstackOrException.
		/* __GDPR__FRAGMENT__
			"TypeScriptRequestErrorProperties" : {
				"command" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
				"serverid" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
				"sanitizedstack" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
				"badclient" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" }
			}
		*/
		return {
			command: this.serverCommand,
			serverid: this.serverId,
			sanitizedstack: this.sanitizedStack || '',
			badclient: /\bBADCLIENT\b/.test(this.stack || ''),
		} as const;
	}

	/**
	 * Given a `errorText` from a tsserver request indicating failure in handling a request,
	 * prepares a payload for telemetry-logging.
	 */
	private static parseErrorText(response: Proto.Response) {
		const errorText = response.message;
		if (errorText) {
			const errorPrefix = 'Error processing request. ';
			if (errorText.startsWith(errorPrefix)) {
				const prefixFreeErrorText = errorText.substr(errorPrefix.length);
				const newlineIndex = prefixFreeErrorText.indexOf('\n');
				if (newlineIndex >= 0) {
					// Newline expected between message and stack.
					const stack = prefixFreeErrorText.substring(newlineIndex + 1);
					return {
						message: prefixFreeErrorText.substring(0, newlineIndex),
						stack,
						sanitizedStack: TypeScriptServerError.sanitizeStack(stack)
					};
				}
			}
		}
		return undefined;
	}

	/**
	 * Drop everything but ".js" and line/column numbers (though retain "tsserver" if that's the filename).
	 */
	private static sanitizeStack(message: string | undefined) {
		if (!message) {
			return '';
		}
		const regex = /(\btsserver)?(\.(?:ts|tsx|js|jsx)(?::\d+(?::\d+)?)?)\)?$/igm;
		let serverStack = '';
		while (true) {
			const match = regex.exec(message);
			if (!match) {
				break;
			}
			// [1] is 'tsserver' or undefined
			// [2] is '.js:{line_number}:{column_number}'
			serverStack += `${match[1] || 'suppressed'}${match[2]}\n`;
		}
		return serverStack;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/tsServer/serverProcess.browser.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/serverProcess.browser.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/// <reference lib='webworker' />
import { ServiceConnection } from '@vscode/sync-api-common/browser';
import { ApiService, Requests } from '@vscode/sync-api-service';
import * as vscode from 'vscode';
import { TypeScriptServiceConfiguration } from '../configuration/configuration';
import { Logger } from '../logging/logger';
import { supportsReadableByteStreams } from '../utils/platform';
import { FileWatcherManager } from './fileWatchingManager';
import { NodeVersionManager } from './nodeManager';
import type * as Proto from './protocol/protocol';
import { TsServerLog, TsServerProcess, TsServerProcessFactory, TsServerProcessKind } from './server';
import { TypeScriptVersionManager } from './versionManager';
import { TypeScriptVersion } from './versionProvider';

type BrowserWatchEvent = {
	type: 'watchDirectory' | 'watchFile';
	recursive?: boolean;
	uri: {
		scheme: string;
		authority: string;
		path: string;
	};
	id: number;
} | {
	type: 'dispose';
	id: number;
};

export class WorkerServerProcessFactory implements TsServerProcessFactory {
	constructor(
		private readonly _extensionUri: vscode.Uri,
		private readonly _logger: Logger,
	) { }

	public fork(
		version: TypeScriptVersion,
		args: readonly string[],
		kind: TsServerProcessKind,
		configuration: TypeScriptServiceConfiguration,
		_versionManager: TypeScriptVersionManager,
		_nodeVersionManager: NodeVersionManager,
		tsServerLog: TsServerLog | undefined,
	) {
		const tsServerPath = version.tsServerPath;
		const launchArgs = [
			...args,
			// Explicitly give TS Server its path so it can load local resources
			'--executingFilePath', tsServerPath,
			// Enable/disable web type acquisition
			(configuration.webTypeAcquisitionEnabled && supportsReadableByteStreams() ? '--experimentalTypeAcquisition' : '--disableAutomaticTypingAcquisition'),
		];

		return new WorkerServerProcess(kind, tsServerPath, this._extensionUri, launchArgs, tsServerLog, this._logger);
	}
}

class WorkerServerProcess implements TsServerProcess {

	private static idPool = 0;

	private readonly id = WorkerServerProcess.idPool++;

	private readonly _onDataHandlers = new Set<(data: Proto.Response) => void>();
	private readonly _onErrorHandlers = new Set<(err: Error) => void>();
	private readonly _onExitHandlers = new Set<(code: number | null, signal: string | null) => void>();

	private readonly _worker: Worker;
	private readonly _watches: FileWatcherManager;

	/** For communicating with TS server synchronously */
	private readonly _tsserver: MessagePort;
	/** For communicating watches asynchronously */
	private readonly _watcher: MessagePort;
	/** For communicating with filesystem synchronously */
	private readonly _syncFs: MessagePort;

	public constructor(
		private readonly kind: TsServerProcessKind,
		tsServerPath: string,
		extensionUri: vscode.Uri,
		args: readonly string[],
		private readonly tsServerLog: TsServerLog | undefined,
		logger: Logger,
	) {
		this._worker = new Worker(tsServerPath, { name: `TS ${kind} server #${this.id}` });

		this._watches = new FileWatcherManager(logger);

		const tsserverChannel = new MessageChannel();
		const watcherChannel = new MessageChannel();
		const syncChannel = new MessageChannel();
		this._tsserver = tsserverChannel.port2;
		this._watcher = watcherChannel.port2;
		this._syncFs = syncChannel.port2;

		this._tsserver.onmessage = (event) => {
			if (event.data.type === 'log') {
				console.error(`unexpected log message on tsserver channel: ${JSON.stringify(event)}`);
				return;
			}
			for (const handler of this._onDataHandlers) {
				handler(event.data);
			}
		};

		this._watcher.onmessage = (event: MessageEvent<BrowserWatchEvent>) => {
			switch (event.data.type) {
				case 'dispose': {
					this._watches.delete(event.data.id);
					break;
				}
				case 'watchDirectory':
				case 'watchFile': {
					this._watches.create(event.data.id, vscode.Uri.from(event.data.uri), /*watchParentDirs*/ true, !!event.data.recursive, {
						change: uri => this._watcher.postMessage({ type: 'watch', event: 'change', uri }),
						create: uri => this._watcher.postMessage({ type: 'watch', event: 'create', uri }),
						delete: uri => this._watcher.postMessage({ type: 'watch', event: 'delete', uri }),
					});
					break;
				}
				default:
					console.error(`unexpected message on watcher channel: ${JSON.stringify(event)}`);
			}
		};

		this._worker.onmessage = (msg: any) => {
			// for logging only
			if (msg.data.type === 'log') {
				this.appendLog(msg.data.body);
				return;
			}
			console.error(`unexpected message on main channel: ${JSON.stringify(msg)}`);
		};

		this._worker.onerror = (err: ErrorEvent) => {
			console.error('error! ' + JSON.stringify(err));
			for (const handler of this._onErrorHandlers) {
				// TODO: The ErrorEvent type might be wrong; previously this was typed as Error and didn't have the property access.
				handler(err.error);
			}
		};

		this._worker.postMessage(
			{ args, extensionUri },
			[syncChannel.port1, tsserverChannel.port1, watcherChannel.port1]
		);

		const connection = new ServiceConnection<Requests>(syncChannel.port2);
		new ApiService('vscode-wasm-typescript', connection);
		connection.signalReady();
	}

	write(serverRequest: Proto.Request): void {
		this._tsserver.postMessage(serverRequest);
	}

	onData(handler: (response: Proto.Response) => void): void {
		this._onDataHandlers.add(handler);
	}

	onError(handler: (err: Error) => void): void {
		this._onErrorHandlers.add(handler);
	}

	onExit(handler: (code: number | null, signal: string | null) => void): void {
		this._onExitHandlers.add(handler);
		// Todo: not implemented
	}

	kill(): void {
		this._worker.terminate();
		this._tsserver.close();
		this._watcher.close();
		this._syncFs.close();
		this._watches.dispose();
	}

	private appendLog(msg: string) {
		if (this.tsServerLog?.type === 'output') {
			this.tsServerLog.output.appendLine(`(${this.id} - ${this.kind}) ${msg}`);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/tsServer/serverProcess.electron.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/serverProcess.electron.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import type { Readable } from 'stream';
import * as vscode from 'vscode';
import { TypeScriptServiceConfiguration } from '../configuration/configuration';
import { Disposable } from '../utils/dispose';
import { API } from './api';
import type * as Proto from './protocol/protocol';
import { TsServerLog, TsServerProcess, TsServerProcessFactory, TsServerProcessKind } from './server';
import { TypeScriptVersionManager } from './versionManager';
import { TypeScriptVersion } from './versionProvider';
import { NodeVersionManager } from './nodeManager';


const defaultSize: number = 8192;
const contentLength: string = 'Content-Length: ';
const contentLengthSize: number = Buffer.byteLength(contentLength, 'utf8');
const blank: number = Buffer.from(' ', 'utf8')[0];
const backslashR: number = Buffer.from('\r', 'utf8')[0];
const backslashN: number = Buffer.from('\n', 'utf8')[0];

class ProtocolBuffer {

	private index: number = 0;
	private buffer: Buffer = Buffer.allocUnsafe(defaultSize);

	public append(data: string | Buffer): void {
		let toAppend: Buffer | null = null;
		if (Buffer.isBuffer(data)) {
			toAppend = data;
		} else {
			toAppend = Buffer.from(data, 'utf8');
		}
		if (this.buffer.length - this.index >= toAppend.length) {
			toAppend.copy(this.buffer, this.index, 0, toAppend.length);
		} else {
			const newSize = (Math.ceil((this.index + toAppend.length) / defaultSize) + 1) * defaultSize;
			if (this.index === 0) {
				this.buffer = Buffer.allocUnsafe(newSize);
				toAppend.copy(this.buffer, 0, 0, toAppend.length);
			} else {
				this.buffer = Buffer.concat([this.buffer.slice(0, this.index), toAppend], newSize);
			}
		}
		this.index += toAppend.length;
	}

	public tryReadContentLength(): number {
		let result = -1;
		let current = 0;
		// we are utf8 encoding...
		while (current < this.index && (this.buffer[current] === blank || this.buffer[current] === backslashR || this.buffer[current] === backslashN)) {
			current++;
		}
		if (this.index < current + contentLengthSize) {
			return result;
		}
		current += contentLengthSize;
		const start = current;
		while (current < this.index && this.buffer[current] !== backslashR) {
			current++;
		}
		if (current + 3 >= this.index || this.buffer[current + 1] !== backslashN || this.buffer[current + 2] !== backslashR || this.buffer[current + 3] !== backslashN) {
			return result;
		}
		const data = this.buffer.toString('utf8', start, current);
		result = parseInt(data);
		this.buffer = this.buffer.slice(current + 4);
		this.index = this.index - (current + 4);
		return result;
	}

	public tryReadContent(length: number): string | null {
		if (this.index < length) {
			return null;
		}
		const result = this.buffer.toString('utf8', 0, length);
		let sourceStart = length;
		while (sourceStart < this.index && (this.buffer[sourceStart] === backslashR || this.buffer[sourceStart] === backslashN)) {
			sourceStart++;
		}
		this.buffer.copy(this.buffer, 0, sourceStart);
		this.index = this.index - sourceStart;
		return result;
	}
}

class Reader<T> extends Disposable {

	private readonly buffer: ProtocolBuffer = new ProtocolBuffer();
	private nextMessageLength: number = -1;

	public constructor(readable: Readable) {
		super();
		readable.on('data', data => this.onLengthData(data));
	}

	private readonly _onError = this._register(new vscode.EventEmitter<Error>());
	public readonly onError = this._onError.event;

	private readonly _onData = this._register(new vscode.EventEmitter<T>());
	public readonly onData = this._onData.event;

	private onLengthData(data: Buffer | string): void {
		if (this.isDisposed) {
			return;
		}

		try {
			this.buffer.append(data);
			while (true) {
				if (this.nextMessageLength === -1) {
					this.nextMessageLength = this.buffer.tryReadContentLength();
					if (this.nextMessageLength === -1) {
						return;
					}
				}
				const msg = this.buffer.tryReadContent(this.nextMessageLength);
				if (msg === null) {
					return;
				}
				this.nextMessageLength = -1;
				const json = JSON.parse(msg);
				this._onData.fire(json);
			}
		} catch (e) {
			this._onError.fire(e);
		}
	}
}

function generatePatchedEnv(env: any, modulePath: string, hasExecPath: boolean): any {
	const newEnv = Object.assign({}, env);

	if (!hasExecPath) {
		newEnv['ELECTRON_RUN_AS_NODE'] = '1';
	}
	newEnv['NODE_PATH'] = path.join(modulePath, '..', '..', '..');

	// Ensure we always have a PATH set
	newEnv['PATH'] = newEnv['PATH'] || process.env.PATH;

	return newEnv;
}

function getExecArgv(kind: TsServerProcessKind, configuration: TypeScriptServiceConfiguration): string[] {
	const args: string[] = [];

	const debugPort = getDebugPort(kind);
	if (debugPort) {
		const inspectFlag = getTssDebugBrk() ? '--inspect-brk' : '--inspect';
		args.push(`${inspectFlag}=${debugPort}`);
	}

	if (configuration.maxTsServerMemory) {
		args.push(`--max-old-space-size=${configuration.maxTsServerMemory}`);
	}

	return args;
}

function getDebugPort(kind: TsServerProcessKind): number | undefined {
	if (kind === TsServerProcessKind.Syntax) {
		// We typically only want to debug the main semantic server
		return undefined;
	}
	const value = getTssDebugBrk() || getTssDebug();
	if (value) {
		const port = parseInt(value);
		if (!isNaN(port)) {
			return port;
		}
	}
	return undefined;
}

function getTssDebug(): string | undefined {
	return process.env[vscode.env.remoteName ? 'TSS_REMOTE_DEBUG' : 'TSS_DEBUG'];
}

function getTssDebugBrk(): string | undefined {
	return process.env[vscode.env.remoteName ? 'TSS_REMOTE_DEBUG_BRK' : 'TSS_DEBUG_BRK'];
}

class IpcChildServerProcess extends Disposable implements TsServerProcess {
	constructor(
		private readonly _process: child_process.ChildProcess,
	) {
		super();
	}

	write(serverRequest: Proto.Request): void {
		this._process.send(serverRequest);
	}

	onData(handler: (data: Proto.Response) => void): void {
		this._process.on('message', handler);
	}

	onExit(handler: (code: number | null, signal: string | null) => void): void {
		this._process.on('exit', handler);
	}

	onError(handler: (err: Error) => void): void {
		this._process.on('error', handler);
	}

	kill(): void {
		this._process.kill();
	}
}

class StdioChildServerProcess extends Disposable implements TsServerProcess {
	private readonly _reader: Reader<Proto.Response>;

	constructor(
		private readonly _process: child_process.ChildProcess,
	) {
		super();
		this._reader = this._register(new Reader<Proto.Response>(this._process.stdout!));
	}

	write(serverRequest: Proto.Request): void {
		this._process.stdin!.write(JSON.stringify(serverRequest) + '\r\n', 'utf8');
	}

	onData(handler: (data: Proto.Response) => void): void {
		this._reader.onData(handler);
	}

	onExit(handler: (code: number | null, signal: string | null) => void): void {
		this._process.on('exit', handler);
	}

	onError(handler: (err: Error) => void): void {
		this._process.on('error', handler);
		this._reader.onError(handler);
	}

	kill(): void {
		this._process.kill();
		this._reader.dispose();
	}
}

export class ElectronServiceProcessFactory implements TsServerProcessFactory {
	fork(
		version: TypeScriptVersion,
		args: readonly string[],
		kind: TsServerProcessKind,
		configuration: TypeScriptServiceConfiguration,
		versionManager: TypeScriptVersionManager,
		nodeVersionManager: NodeVersionManager,
		_tsserverLog: TsServerLog | undefined,
	): TsServerProcess {
		let tsServerPath = version.tsServerPath;

		if (!fs.existsSync(tsServerPath)) {
			vscode.window.showWarningMessage(vscode.l10n.t("The path {0} doesn\'t point to a valid tsserver install. Falling back to bundled TypeScript version.", tsServerPath));
			versionManager.reset();
			tsServerPath = versionManager.currentVersion.tsServerPath;
		}

		const execPath = nodeVersionManager.currentVersion;

		const env = generatePatchedEnv(process.env, tsServerPath, !!execPath);
		const runtimeArgs = [...args];
		const execArgv = getExecArgv(kind, configuration);
		const useIpc = !execPath && version.apiVersion?.gte(API.v460);
		if (useIpc) {
			runtimeArgs.push('--useNodeIpc');
		}

		const childProcess = execPath ?
			child_process.spawn(execPath, [...execArgv, tsServerPath, ...runtimeArgs], {
				windowsHide: true,
				cwd: undefined,
				env,
			}) :
			child_process.fork(tsServerPath, runtimeArgs, {
				silent: true,
				cwd: undefined,
				env,
				execArgv,
				stdio: useIpc ? ['pipe', 'pipe', 'pipe', 'ipc'] : undefined,
			});

		return useIpc ? new IpcChildServerProcess(childProcess) : new StdioChildServerProcess(childProcess);
	}
}
```

--------------------------------------------------------------------------------

````

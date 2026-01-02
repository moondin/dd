---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:25Z
part: 34
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 34 of 552)

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

---[FILE: extensions/emmet/src/test/partialParsingStylesheet.test.ts]---
Location: vscode-main/extensions/emmet/src/test/partialParsingStylesheet.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import * as assert from 'assert';
import { closeAllEditors, withRandomFileEditor } from './testUtils';
import * as vscode from 'vscode';
import { parsePartialStylesheet, getFlatNode } from '../util';
import { isValidLocationForEmmetAbbreviation } from '../abbreviationActions';

suite('Tests for partial parse of Stylesheets', () => {
	teardown(closeAllEditors);

	function isValid(doc: vscode.TextDocument, range: vscode.Range, syntax: string): boolean {
		const rootNode = parsePartialStylesheet(doc, range.end);
		const endOffset = doc.offsetAt(range.end);
		const currentNode = getFlatNode(rootNode, endOffset, true);
		return isValidLocationForEmmetAbbreviation(doc, rootNode, currentNode, syntax, endOffset, range);
	}

	test('Ignore block comment inside rule', function (): any {
		const cssContents = `
p {
	margin: p ;
	/*dn: none; p */ p
	p
	p.
} p
`;
		return withRandomFileEditor(cssContents, '.css', (_, doc) => {
			const rangesForEmmet = [
				new vscode.Range(3, 18, 3, 19),		// Same line after block comment
				new vscode.Range(4, 1, 4, 2),		// p after block comment
				new vscode.Range(5, 1, 5, 3)		// p. after block comment
			];
			const rangesNotEmmet = [
				new vscode.Range(1, 0, 1, 1),		// Selector
				new vscode.Range(2, 9, 2, 10),		// Property value
				new vscode.Range(3, 3, 3, 5),		// dn inside block comment
				new vscode.Range(3, 13, 3, 14),		// p just before ending of block comment
				new vscode.Range(6, 2, 6, 3)		// p after ending of block

			];
			rangesForEmmet.forEach(range => {
				assert.strictEqual(isValid(doc, range, 'css'), true);
			});
			rangesNotEmmet.forEach(range => {
				assert.strictEqual(isValid(doc, range, 'css'), false);
			});

			return Promise.resolve();
		});
	});

	test('Ignore commented braces', function (): any {
		const sassContents = `
.foo
// .foo { brs
/* .foo { op.3
dn	{
*/
	bgc
} bg
`;
		return withRandomFileEditor(sassContents, '.scss', (_, doc) => {
			const rangesNotEmmet = [
				new vscode.Range(1, 0, 1, 4),		// Selector
				new vscode.Range(2, 3, 2, 7),		// Line commented selector
				new vscode.Range(3, 3, 3, 7),		// Block commented selector
				new vscode.Range(4, 0, 4, 2),		// dn inside block comment
				new vscode.Range(6, 1, 6, 2),		// bgc inside a rule whose opening brace is commented
				new vscode.Range(7, 2, 7, 4)		// bg after ending of badly constructed block
			];
			rangesNotEmmet.forEach(range => {
				assert.strictEqual(isValid(doc, range, 'scss'), false);
			});
			return Promise.resolve();
		});
	});

	test('Block comment between selector and open brace', function (): any {
		const cssContents = `
p
/* First line
of a multiline
comment */
{
	margin: p ;
	/*dn: none; p */ p
	p
	p.
} p
`;
		return withRandomFileEditor(cssContents, '.css', (_, doc) => {
			const rangesForEmmet = [
				new vscode.Range(7, 18, 7, 19),		// Same line after block comment
				new vscode.Range(8, 1, 8, 2),		// p after block comment
				new vscode.Range(9, 1, 9, 3)		// p. after block comment
			];
			const rangesNotEmmet = [
				new vscode.Range(1, 2, 1, 3),		// Selector
				new vscode.Range(3, 3, 3, 4),		// Inside multiline comment
				new vscode.Range(5, 0, 5, 1),		// Opening Brace
				new vscode.Range(6, 9, 6, 10),		// Property value
				new vscode.Range(7, 3, 7, 5),		// dn inside block comment
				new vscode.Range(7, 13, 7, 14),		// p just before ending of block comment
				new vscode.Range(10, 2, 10, 3)		// p after ending of block
			];
			rangesForEmmet.forEach(range => {
				assert.strictEqual(isValid(doc, range, 'css'), true);
			});
			rangesNotEmmet.forEach(range => {
				assert.strictEqual(isValid(doc, range, 'css'), false);
			});
			return Promise.resolve();
		});
	});

	test('Nested and consecutive rulesets with errors', function (): any {
		const sassContents = `
.foo{
	a
	a
}}{ p
}
.bar{
	@
	.rudi {
		@
	}
}}}
`;
		return withRandomFileEditor(sassContents, '.scss', (_, doc) => {
			const rangesForEmmet = [
				new vscode.Range(2, 1, 2, 2),		// Inside a ruleset before errors
				new vscode.Range(3, 1, 3, 2),		// Inside a ruleset after no serious error
				new vscode.Range(7, 1, 7, 2),		// @ inside a so far well structured ruleset
				new vscode.Range(9, 2, 9, 3),		// @ inside a so far well structured nested ruleset
			];
			const rangesNotEmmet = [
				new vscode.Range(4, 4, 4, 5),		// p inside ruleset without proper selector
				new vscode.Range(6, 3, 6, 4)		// In selector
			];
			rangesForEmmet.forEach(range => {
				assert.strictEqual(isValid(doc, range, 'scss'), true);
			});
			rangesNotEmmet.forEach(range => {
				assert.strictEqual(isValid(doc, range, 'scss'), false);
			});
			return Promise.resolve();
		});
	});

	test('One liner sass', function (): any {
		const sassContents = `
.foo{dn}.bar{.boo{dn}dn}.comd{/*{dn*/p{div{dn}} }.foo{.other{dn}} dn
`;
		return withRandomFileEditor(sassContents, '.scss', (_, doc) => {
			const rangesForEmmet = [
				new vscode.Range(1, 5, 1, 7),		// Inside a ruleset
				new vscode.Range(1, 18, 1, 20),		// Inside a nested ruleset
				new vscode.Range(1, 21, 1, 23),		// Inside ruleset after nested one.
				new vscode.Range(1, 43, 1, 45),		// Inside nested ruleset after comment
				new vscode.Range(1, 61, 1, 63)		// Inside nested ruleset
			];
			const rangesNotEmmet = [
				new vscode.Range(1, 3, 1, 4),		// In foo selector
				new vscode.Range(1, 10, 1, 11),		// In bar selector
				new vscode.Range(1, 15, 1, 16),		// In boo selector
				new vscode.Range(1, 28, 1, 29),		// In comd selector
				new vscode.Range(1, 33, 1, 34),		// In commented dn
				new vscode.Range(1, 37, 1, 38),		// In p selector
				new vscode.Range(1, 39, 1, 42),		// In div selector
				new vscode.Range(1, 66, 1, 68)		// Outside any ruleset
			];
			rangesForEmmet.forEach(range => {
				assert.strictEqual(isValid(doc, range, 'scss'), true);
			});
			rangesNotEmmet.forEach(range => {
				assert.strictEqual(isValid(doc, range, 'scss'), false);
			});
			return Promise.resolve();
		});
	});

	test('Variables and interpolation', function (): any {
		const sassContents = `
p.#{dn} {
	p.3
	#{$attr}-color: blue;
	dn
} op
.foo{nes{ted}} {
	dn
}
`;
		return withRandomFileEditor(sassContents, '.scss', (_, doc) => {
			const rangesForEmmet = [
				new vscode.Range(2, 1, 2, 4),		// p.3 inside a ruleset whose selector uses interpolation
				new vscode.Range(4, 1, 4, 3)		// dn inside ruleset after property with variable
			];
			const rangesNotEmmet = [
				new vscode.Range(1, 0, 1, 1),		// In p in selector
				new vscode.Range(1, 2, 1, 3),		// In # in selector
				new vscode.Range(1, 4, 1, 6),		// In dn inside variable in selector
				new vscode.Range(3, 7, 3, 8),		// r of attr inside variable
				new vscode.Range(5, 2, 5, 4),		// op after ruleset
				new vscode.Range(7, 1, 7, 3),		// dn inside ruleset whose selector uses nested interpolation
				new vscode.Range(3, 1, 3, 2),		// # inside ruleset
			];
			rangesForEmmet.forEach(range => {
				assert.strictEqual(isValid(doc, range, 'scss'), true);
			});
			rangesNotEmmet.forEach(range => {
				assert.strictEqual(isValid(doc, range, 'scss'), false);
			});
			return Promise.resolve();
		});
	});

	test('Comments in sass', function (): any {
		const sassContents = `
.foo{
	/* p // p */ brs6-2p
	dn
}
p
/* c
om
ment */{
	m10
}
.boo{
	op.3
}
`;
		return withRandomFileEditor(sassContents, '.scss', (_, doc) => {
			const rangesForEmmet = [
				new vscode.Range(2, 14, 2, 21),		// brs6-2p with a block commented line comment ('/* */' overrides '//')
				new vscode.Range(3, 1, 3, 3),		// dn after a line with combined comments inside a ruleset
				new vscode.Range(9, 1, 9, 4),		// m10 inside ruleset whose selector is before a comment
				new vscode.Range(12, 1, 12, 5)		// op3 inside a ruleset with commented extra braces
			];
			const rangesNotEmmet = [
				new vscode.Range(2, 4, 2, 5),		// In p inside block comment
				new vscode.Range(2, 9, 2, 10),		// In p inside block comment and after line comment
				new vscode.Range(6, 3, 6, 4)		// In c inside block comment
			];
			rangesForEmmet.forEach(range => {
				assert.strictEqual(isValid(doc, range, 'scss'), true);
			});
			rangesNotEmmet.forEach(range => {
				assert.strictEqual(isValid(doc, range, 'scss'), false);
			});
			return Promise.resolve();
		});
	});


});
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/test/reflectCssValue.test.ts]---
Location: vscode-main/extensions/emmet/src/test/reflectCssValue.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import * as assert from 'assert';
import { Selection } from 'vscode';
import { withRandomFileEditor, closeAllEditors } from './testUtils';
import { reflectCssValue as reflectCssValueImpl } from '../reflectCssValue';

function reflectCssValue(): Thenable<boolean> {
	const result = reflectCssValueImpl();
	assert.ok(result);
	return result!;
}

suite('Tests for Emmet: Reflect CSS Value command', () => {
	teardown(closeAllEditors);

	const cssContents = `
	.header {
		margin: 10px;
		padding: 10px;
		transform: rotate(50deg);
		-moz-transform: rotate(20deg);
		-o-transform: rotate(50deg);
		-webkit-transform: rotate(50deg);
		-ms-transform: rotate(50deg);
	}
	`;

	const htmlContents = `
	<html>
		<style>
			.header {
				margin: 10px;
				padding: 10px;
				transform: rotate(50deg);
				-moz-transform: rotate(20deg);
				-o-transform: rotate(50deg);
				-webkit-transform: rotate(50deg);
				-ms-transform: rotate(50deg);
			}
		</style>
	</html>
	`;

	test('Reflect Css Value in css file', function (): any {
		return withRandomFileEditor(cssContents, '.css', (editor, doc) => {
			editor.selections = [new Selection(5, 10, 5, 10)];
			return reflectCssValue().then(() => {
				assert.strictEqual(doc.getText(), cssContents.replace(/\(50deg\)/g, '(20deg)'));
				return Promise.resolve();
			});
		});
	});

	test('Reflect Css Value in css file, selecting entire property', function (): any {
		return withRandomFileEditor(cssContents, '.css', (editor, doc) => {
			editor.selections = [new Selection(5, 2, 5, 32)];
			return reflectCssValue().then(() => {
				assert.strictEqual(doc.getText(), cssContents.replace(/\(50deg\)/g, '(20deg)'));
				return Promise.resolve();
			});
		});
	});

	test('Reflect Css Value in html file', function (): any {
		return withRandomFileEditor(htmlContents, '.html', (editor, doc) => {
			editor.selections = [new Selection(7, 20, 7, 20)];
			return reflectCssValue().then(() => {
				assert.strictEqual(doc.getText(), htmlContents.replace(/\(50deg\)/g, '(20deg)'));
				return Promise.resolve();
			});
		});
	});

	test('Reflect Css Value in html file, selecting entire property', function (): any {
		return withRandomFileEditor(htmlContents, '.html', (editor, doc) => {
			editor.selections = [new Selection(7, 4, 7, 34)];
			return reflectCssValue().then(() => {
				assert.strictEqual(doc.getText(), htmlContents.replace(/\(50deg\)/g, '(20deg)'));
				return Promise.resolve();
			});
		});
	});

});
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/test/tagActions.test.ts]---
Location: vscode-main/extensions/emmet/src/test/tagActions.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import * as assert from 'assert';
import { Selection, workspace, ConfigurationTarget } from 'vscode';
import { withRandomFileEditor, closeAllEditors } from './testUtils';
import { removeTag } from '../removeTag';
import { updateTag } from '../updateTag';
import { matchTag } from '../matchTag';
import { splitJoinTag } from '../splitJoinTag';
import { mergeLines } from '../mergeLines';

suite('Tests for Emmet actions on html tags', () => {
	teardown(closeAllEditors);

	const contents = `
	<div class="hello">
		<ul>
			<li><span>Hello</span></li>
			<li><span>There</span></li>
			<div><li><span>Bye</span></li></div>
		</ul>
		<span/>
	</div>
	`;

	const spacedContents = `
	<div class="hello">
		<ul>

			<li><span>Hello</span></li>

			<li><span>There</span></li>

			<div><li><span>Bye</span></li></div>


		</ul>
		<span/>
	</div>
	`;

	const contentsWithTemplate = `
	<script type="text/template">
		<ul>
			<li><span>Hello</span></li>
			<li><span>There</span></li>
			<div><li><span>Bye</span></li></div>
		</ul>
		<span/>
	</script>
	`;

	test('update tag with multiple cursors', () => {
		const expectedContents = `
	<div class="hello">
		<ul>
			<li><section>Hello</section></li>
			<section><span>There</span></section>
			<section><li><span>Bye</span></li></section>
		</ul>
		<span/>
	</div>
	`;
		return withRandomFileEditor(contents, 'html', (editor, doc) => {
			editor.selections = [
				new Selection(3, 17, 3, 17), // cursor inside tags
				new Selection(4, 5, 4, 5), // cursor inside opening tag
				new Selection(5, 35, 5, 35), // cursor inside closing tag
			];

			return updateTag('section')!.then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return Promise.resolve();
			});
		});
	});

	// #region update tag
	test('update tag with entire node selected', () => {
		const expectedContents = `
	<div class="hello">
		<ul>
			<li><section>Hello</section></li>
			<li><span>There</span></li>
			<section><li><span>Bye</span></li></section>
		</ul>
		<span/>
	</div>
	`;
		return withRandomFileEditor(contents, 'html', (editor, doc) => {
			editor.selections = [
				new Selection(3, 7, 3, 25),
				new Selection(5, 3, 5, 39),
			];

			return updateTag('section')!.then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return Promise.resolve();
			});
		});
	});

	test('update tag with template', () => {
		const expectedContents = `
	<script type="text/template">
		<section>
			<li><span>Hello</span></li>
			<li><span>There</span></li>
			<div><li><span>Bye</span></li></div>
		</section>
		<span/>
	</script>
	`;

		return withRandomFileEditor(contentsWithTemplate, 'html', (editor, doc) => {
			editor.selections = [
				new Selection(2, 4, 2, 4), // cursor inside ul tag
			];

			return updateTag('section')!.then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return Promise.resolve();
			});
		});
	});
	// #endregion

	// #region remove tag
	test('remove tag with multiple cursors', () => {
		const expectedContents = `
	<div class="hello">
		<ul>
			<li>Hello</li>
			<span>There</span>
			<li><span>Bye</span></li>
		</ul>
		<span/>
	</div>
	`;
		return withRandomFileEditor(contents, 'html', (editor, doc) => {
			editor.selections = [
				new Selection(3, 17, 3, 17), // cursor inside tags
				new Selection(4, 5, 4, 5), // cursor inside opening tag
				new Selection(5, 35, 5, 35), // cursor inside closing tag
			];

			return removeTag()!.then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return Promise.resolve();
			});
		});
	});

	test('remove tag with boundary conditions', () => {
		const expectedContents = `
	<div class="hello">
		<ul>
			<li>Hello</li>
			<li><span>There</span></li>
			<li><span>Bye</span></li>
		</ul>
		<span/>
	</div>
	`;

		return withRandomFileEditor(contents, 'html', (editor, doc) => {
			editor.selections = [
				new Selection(3, 7, 3, 25),
				new Selection(5, 3, 5, 39),
			];

			return removeTag()!.then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return Promise.resolve();
			});
		});
	});


	test('remove tag with template', () => {
		const expectedContents = `
	<script type="text/template">
		<li><span>Hello</span></li>
		<li><span>There</span></li>
		<div><li><span>Bye</span></li></div>
		<span/>
	</script>
	`;
		return withRandomFileEditor(contentsWithTemplate, 'html', (editor, doc) => {
			editor.selections = [
				new Selection(2, 4, 2, 4), // cursor inside ul tag
			];

			return removeTag()!.then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return Promise.resolve();
			});
		});
	});

	test('remove tag with extra trim', () => {
		const expectedContents = `
	<div class="hello">
		<li><span>Hello</span></li>

		<li><span>There</span></li>

		<div><li><span>Bye</span></li></div>
		<span/>
	</div>
	`;
		return withRandomFileEditor(spacedContents, 'html', (editor, doc) => {
			editor.selections = [
				new Selection(2, 4, 2, 4), // cursor inside ul tag
			];

			return removeTag()!.then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return Promise.resolve();
			});
		});
	});
	// #endregion

	// #region split/join tag
	test('split/join tag with multiple cursors', () => {
		const expectedContents = `
	<div class="hello">
		<ul>
			<li><span/></li>
			<li><span>There</span></li>
			<div><li><span>Bye</span></li></div>
		</ul>
		<span></span>
	</div>
	`;
		return withRandomFileEditor(contents, 'html', (editor, doc) => {
			editor.selections = [
				new Selection(3, 17, 3, 17), // join tag
				new Selection(7, 5, 7, 5), // split tag
			];

			return splitJoinTag()!.then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return Promise.resolve();
			});
		});
	});

	test('split/join tag with boundary selection', () => {
		const expectedContents = `
	<div class="hello">
		<ul>
			<li><span/></li>
			<li><span>There</span></li>
			<div><li><span>Bye</span></li></div>
		</ul>
		<span></span>
	</div>
	`;
		return withRandomFileEditor(contents, 'html', (editor, doc) => {
			editor.selections = [
				new Selection(3, 7, 3, 25), // join tag
				new Selection(7, 2, 7, 9), // split tag
			];

			return splitJoinTag()!.then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return Promise.resolve();
			});
		});
	});

	test('split/join tag with templates', () => {
		const expectedContents = `
	<script type="text/template">
		<ul>
			<li><span/></li>
			<li><span>There</span></li>
			<div><li><span>Bye</span></li></div>
		</ul>
		<span></span>
	</script>
	`;
		return withRandomFileEditor(contentsWithTemplate, 'html', (editor, doc) => {
			editor.selections = [
				new Selection(3, 17, 3, 17), // join tag
				new Selection(7, 5, 7, 5), // split tag
			];

			return splitJoinTag()!.then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return Promise.resolve();
			});
		});
	});

	test('split/join tag in jsx with xhtml self closing tag', () => {
		const expectedContents = `
	<div class="hello">
		<ul>
			<li><span /></li>
			<li><span>There</span></li>
			<div><li><span>Bye</span></li></div>
		</ul>
		<span></span>
	</div>
	`;
		const oldValueForSyntaxProfiles = workspace.getConfiguration('emmet').inspect('syntaxProfiles');
		return workspace.getConfiguration('emmet').update('syntaxProfiles', { jsx: { selfClosingStyle: 'xhtml' } }, ConfigurationTarget.Global).then(() => {
			return withRandomFileEditor(contents, 'jsx', (editor, doc) => {
				editor.selections = [
					new Selection(3, 17, 3, 17), // join tag
					new Selection(7, 5, 7, 5), // split tag
				];

				return splitJoinTag()!.then(() => {
					assert.strictEqual(doc.getText(), expectedContents);
					return workspace.getConfiguration('emmet').update('syntaxProfiles', oldValueForSyntaxProfiles ? oldValueForSyntaxProfiles.globalValue : undefined, ConfigurationTarget.Global);
				});
			});
		});
	});
	// #endregion

	// #region match tag
	test('match tag with multiple cursors', () => {
		return withRandomFileEditor(contents, 'html', (editor, _) => {
			editor.selections = [
				new Selection(1, 0, 1, 0), // just before tag starts, i.e before <
				new Selection(1, 1, 1, 1), // just before tag name starts
				new Selection(1, 2, 1, 2), // inside tag name
				new Selection(1, 6, 1, 6), // after tag name but before opening tag ends
				new Selection(1, 18, 1, 18), // just before opening tag ends
				new Selection(1, 19, 1, 19), // just after opening tag ends
			];

			matchTag();

			editor.selections.forEach(selection => {
				assert.strictEqual(selection.active.line, 8);
				assert.strictEqual(selection.active.character, 3);
				assert.strictEqual(selection.anchor.line, 8);
				assert.strictEqual(selection.anchor.character, 3);
			});

			return Promise.resolve();
		});
	});

	test('match tag with template scripts', () => {
		const templateScript = `
	<script type="text/template">
		<div>
			Hello
		</div>
	</script>`;

		return withRandomFileEditor(templateScript, 'html', (editor, _) => {
			editor.selections = [
				new Selection(2, 2, 2, 2), // just before div tag starts, i.e before <
			];

			matchTag();

			editor.selections.forEach(selection => {
				assert.strictEqual(selection.active.line, 4);
				assert.strictEqual(selection.active.character, 4);
				assert.strictEqual(selection.anchor.line, 4);
				assert.strictEqual(selection.anchor.character, 4);
			});

			return Promise.resolve();
		});
	});

	// #endregion

	// #region merge lines
	test('merge lines of tag with children when empty selection', () => {
		const expectedContents = `
	<div class="hello">
		<ul><li><span>Hello</span></li><li><span>There</span></li><div><li><span>Bye</span></li></div></ul>
		<span/>
	</div>
	`;
		return withRandomFileEditor(contents, 'html', (editor, doc) => {
			editor.selections = [
				new Selection(2, 3, 2, 3)
			];

			return mergeLines()!.then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return Promise.resolve();
			});
		});
	});

	test('merge lines of tag with children when full node selection', () => {
		const expectedContents = `
	<div class="hello">
		<ul><li><span>Hello</span></li><li><span>There</span></li><div><li><span>Bye</span></li></div></ul>
		<span/>
	</div>
	`;
		return withRandomFileEditor(contents, 'html', (editor, doc) => {
			editor.selections = [
				new Selection(2, 3, 6, 7)
			];

			return mergeLines()!.then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return Promise.resolve();
			});
		});
	});

	test('merge lines is no-op when start and end nodes are on the same line', () => {
		return withRandomFileEditor(contents, 'html', (editor, doc) => {
			editor.selections = [
				new Selection(3, 9, 3, 9), // cursor is inside the <span> in <li><span>Hello</span></li>
				new Selection(4, 5, 4, 5), // cursor is inside the <li> in <li><span>Hello</span></li>
				new Selection(5, 5, 5, 20) // selection spans multiple nodes in the same line
			];

			return mergeLines()!.then(() => {
				assert.strictEqual(doc.getText(), contents);
				return Promise.resolve();
			});
		});
	});
	// #endregion
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/test/testUtils.ts]---
Location: vscode-main/extensions/emmet/src/test/testUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';
import { join } from 'path';

export function rndName() {
	let name = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 10; i++) {
		name += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return name;
}

export function createRandomFile(contents = '', fileExtension = 'txt'): Thenable<vscode.Uri> {
	return new Promise((resolve, reject) => {
		const tmpFile = join(os.tmpdir(), rndName() + '.' + fileExtension);
		fs.writeFile(tmpFile, contents, (error) => {
			if (error) {
				return reject(error);
			}

			resolve(vscode.Uri.file(tmpFile));
		});
	});
}

export function pathEquals(path1: string, path2: string): boolean {
	if (process.platform !== 'linux') {
		path1 = path1.toLowerCase();
		path2 = path2.toLowerCase();
	}

	return path1 === path2;
}

export function deleteFile(file: vscode.Uri): Thenable<boolean> {
	return new Promise((resolve, reject) => {
		fs.unlink(file.fsPath, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(true);
			}
		});
	});
}

export function closeAllEditors(): Thenable<any> {
	return vscode.commands.executeCommand('workbench.action.closeAllEditors');
}

export function withRandomFileEditor(initialContents: string, fileExtension: string = 'txt', run: (editor: vscode.TextEditor, doc: vscode.TextDocument) => Thenable<void>): Thenable<boolean> {
	return createRandomFile(initialContents, fileExtension).then(file => {
		return vscode.workspace.openTextDocument(file).then(doc => {
			return vscode.window.showTextDocument(doc).then((editor) => {
				return run(editor, doc).then(_ => {
					if (doc.isDirty) {
						return doc.save().then(() => {
							return deleteFile(file);
						});
					} else {
						return deleteFile(file);
					}
				});
			});
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/test/toggleComment.test.ts]---
Location: vscode-main/extensions/emmet/src/test/toggleComment.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import * as assert from 'assert';
import { Selection } from 'vscode';
import { withRandomFileEditor, closeAllEditors } from './testUtils';
import { toggleComment as toggleCommentImpl } from '../toggleComment';

function toggleComment(): Thenable<boolean> {
	const result = toggleCommentImpl();
	assert.ok(result);
	return result!;
}

suite('Tests for Toggle Comment action from Emmet (HTML)', () => {
	teardown(closeAllEditors);

	const contents = `
	<div class="hello">
		<ul>
			<li><span>Hello</span></li>
			<li><span>There</span></li>
			<div><li><span>Bye</span></li></div>
		</ul>
		<ul>
			<!-- <li>Previously Commented Node</li> -->
			<li>Another Node</li>
		</ul>
		<span/>
		<style>
			.boo {
				margin: 10px;
				padding: 20px;
			}
			.hoo {
				margin: 10px;
				padding: 20px;
			}
		</style>
	</div>
	`;

	test('toggle comment with multiple cursors, but no selection (HTML)', () => {
		const expectedContents = `
	<div class="hello">
		<ul>
			<li><!-- <span>Hello</span> --></li>
			<!-- <li><span>There</span></li> -->
			<!-- <div><li><span>Bye</span></li></div> -->
		</ul>
		<!-- <ul>
			<li>Previously Commented Node</li>
			<li>Another Node</li>
		</ul> -->
		<span/>
		<style>
			.boo {
				/* margin: 10px; */
				padding: 20px;
			}
			/* .hoo {
				margin: 10px;
				padding: 20px;
			} */
		</style>
	</div>
	`;
		return withRandomFileEditor(contents, 'html', (editor, doc) => {
			editor.selections = [
				new Selection(3, 17, 3, 17), // cursor inside the inner span element
				new Selection(4, 5, 4, 5), // cursor inside opening tag
				new Selection(5, 35, 5, 35), // cursor inside closing tag
				new Selection(7, 3, 7, 3), // cursor inside open tag of <ul> one of whose children is already commented
				new Selection(14, 8, 14, 8), // cursor inside the css property inside the style tag
				new Selection(18, 3, 18, 3) // cursor inside the css rule inside the style tag
			];

			return toggleComment().then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return Promise.resolve();
			});
		});
	});

	test('toggle comment with multiple cursors and whole node selected (HTML)', () => {
		const expectedContents = `
	<div class="hello">
		<ul>
			<li><!-- <span>Hello</span> --></li>
			<!-- <li><span>There</span></li> -->
			<div><li><span>Bye</span></li></div>
		</ul>
		<!-- <ul>
			<li>Previously Commented Node</li>
			<li>Another Node</li>
		</ul> -->
		<span/>
		<style>
			.boo {
				/* margin: 10px; */
				padding: 20px;
			}
			/* .hoo {
				margin: 10px;
				padding: 20px;
			} */
		</style>
	</div>
	`;
		return withRandomFileEditor(contents, 'html', (editor, doc) => {
			editor.selections = [
				new Selection(3, 7, 3, 25), // <span>Hello</span><
				new Selection(4, 3, 4, 30), // <li><span>There</span></li>
				new Selection(7, 2, 10, 7), // The <ul> one of whose children is already commented
				new Selection(14, 4, 14, 17), // css property inside the style tag
				new Selection(17, 3, 20, 4) // the css rule inside the style tag
			];

			return toggleComment().then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return Promise.resolve();
			});
		});
	});

	test('toggle comment when multiple nodes are completely under single selection (HTML)', () => {
		const expectedContents = `
	<div class="hello">
		<ul>
			<!-- <li><span>Hello</span></li>
			<li><span>There</span></li> -->
			<div><li><span>Bye</span></li></div>
		</ul>
		<ul>
			<!-- <li>Previously Commented Node</li> -->
			<li>Another Node</li>
		</ul>
		<span/>
		<style>
			.boo {
				/* margin: 10px;
				padding: 20px; */
			}
			.hoo {
				margin: 10px;
				padding: 20px;
			}
		</style>
	</div>
	`;
		return withRandomFileEditor(contents, 'html', (editor, doc) => {
			editor.selections = [
				new Selection(3, 4, 4, 30),
				new Selection(14, 4, 15, 18) // 2 css properties inside the style tag
			];

			return toggleComment().then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return Promise.resolve();
			});
		});
	});

	test('toggle comment when multiple nodes are partially under single selection (HTML)', () => {
		const expectedContents = `
	<div class="hello">
		<ul>
			<!-- <li><span>Hello</span></li>
			<li><span>There</span></li> -->
			<div><li><span>Bye</span></li></div>
		</ul>
		<!-- <ul>
			<li>Previously Commented Node</li>
			<li>Another Node</li>
		</ul> -->
		<span/>
		<style>
			.boo {
				margin: 10px;
				padding: 20px;
			}
			.hoo {
				margin: 10px;
				padding: 20px;
			}
		</style>
	</div>
	`;
		return withRandomFileEditor(contents, 'html', (editor, doc) => {
			editor.selections = [
				new Selection(3, 24, 4, 20),
				new Selection(7, 2, 9, 10) // The <ul> one of whose children is already commented
			];

			return toggleComment().then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return Promise.resolve();
			});
		});
	});

	test('toggle comment with multiple cursors selecting parent and child nodes', () => {
		const expectedContents = `
	<div class="hello">
		<ul>
			<li><!-- <span>Hello</span> --></li>
			<!-- <li><span>There</span></li> -->
			<div><li><span>Bye</span></li></div>
		</ul>
		<!-- <ul>
			<li>Previously Commented Node</li>
			<li>Another Node</li>
		</ul> -->
		<span/>
		<!-- <style>
			.boo {
				margin: 10px;
				padding: 20px;
			}
			.hoo {
				margin: 10px;
				padding: 20px;
			}
		</style> -->
	</div>
	`;
		return withRandomFileEditor(contents, 'html', (editor, doc) => {
			editor.selections = [
				new Selection(3, 17, 3, 17), // cursor inside the inner span element
				new Selection(4, 5, 4, 5), // two cursors: one inside opening tag
				new Selection(4, 17, 4, 17), // 		and the second inside the inner span element
				new Selection(7, 3, 7, 3), // two cursors: one inside open tag of <ul> one of whose children is already commented
				new Selection(9, 10, 9, 10), // 	and the second inside inner li element, whose parent is selected
				new Selection(12, 3, 12, 3), // four nested cursors: one inside the style open tag
				new Selection(14, 8, 14, 8), // 	the second inside the css property inside the style tag
				new Selection(18, 3, 18, 3), // 	the third inside the css rule inside the style tag
				new Selection(19, 8, 19, 8) // 		and the fourth inside the css property inside the style tag
			];

			return toggleComment().then(() => {
				assert.strictEqual(doc.getText(), expectedContents);

				return Promise.resolve();
			});
		});
	});

	test('toggle comment within script template', () => {
		const templateContents = `
	<script type="text/template">
		<li><span>Hello</span></li>
		<li><!-- <span>There</span> --></li>
		<div><li><span>Bye</span></li></div>
		<span/>
	</script>
	`;
		const expectedContents = `
	<script type="text/template">
		<!-- <li><span>Hello</span></li> -->
		<li><span>There</span></li>
		<div><li><!-- <span>Bye</span> --></li></div>
		<span/>
	</script>
	`;
		return withRandomFileEditor(templateContents, 'html', (editor, doc) => {
			editor.selections = [
				new Selection(2, 2, 2, 28), // select entire li element
				new Selection(3, 17, 3, 17), // cursor inside the commented span
				new Selection(4, 18, 4, 18), // cursor inside the noncommented span
			];
			return toggleComment().then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return Promise.resolve();
			});
		});
	});
});

suite('Tests for Toggle Comment action from Emmet (CSS)', () => {
	teardown(closeAllEditors);

	const contents = `
	.one {
		margin: 10px;
		padding: 10px;
	}
	.two {
		height: 42px;
		display: none;
	}
	.three {
		width: 42px;
	}`;

	test('toggle comment with multiple cursors, but no selection (CSS)', () => {
		const expectedContents = `
	.one {
		/* margin: 10px; */
		padding: 10px;
	}
	/* .two {
		height: 42px;
		display: none;
	} */
	.three {
		width: 42px;
	}`;
		return withRandomFileEditor(contents, 'css', (editor, doc) => {
			editor.selections = [
				new Selection(2, 5, 2, 5), // cursor inside a property
				new Selection(5, 4, 5, 4), // cursor inside selector
			];

			return toggleComment().then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return toggleComment().then(() => {
					assert.strictEqual(doc.getText(), contents);
					return Promise.resolve();
				});
			});
		});
	});

	test('toggle comment with multiple cursors and whole node selected (CSS)', () => {
		const expectedContents = `
	.one {
		/* margin: 10px; */
		/* padding: 10px; */
	}
	/* .two {
		height: 42px;
		display: none;
	} */
	.three {
		width: 42px;
	}`;
		return withRandomFileEditor(contents, 'css', (editor, doc) => {
			editor.selections = [
				new Selection(2, 2, 2, 15), // A property completely selected
				new Selection(3, 0, 3, 16), // A property completely selected along with whitespace
				new Selection(5, 1, 8, 2), // A rule completely selected
			];

			return toggleComment().then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				//return toggleComment().then(() => {
				//assert.strictEqual(doc.getText(), contents);
				return Promise.resolve();
				//});
			});
		});
	});



	test('toggle comment when multiple nodes of same parent are completely under single selection (CSS)', () => {
		const expectedContents = `
	.one {
/* 		margin: 10px;
		padding: 10px; */
	}
	/* .two {
		height: 42px;
		display: none;
	}
	.three {
		width: 42px;
	} */`;
		return withRandomFileEditor(contents, 'css', (editor, doc) => {
			editor.selections = [
				new Selection(2, 0, 3, 16), // 2 properties completely under a single selection along with whitespace
				new Selection(5, 1, 11, 2), // 2 rules completely under a single selection
			];

			return toggleComment().then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return toggleComment().then(() => {
					assert.strictEqual(doc.getText(), contents);
					return Promise.resolve();
				});
			});
		});
	});

	test('toggle comment when start and end of selection is inside properties of separate rules (CSS)', () => {
		const expectedContents = `
	.one {
		margin: 10px;
		/* padding: 10px;
	}
	.two {
		height: 42px; */
		display: none;
	}
	.three {
		width: 42px;
	}`;
		return withRandomFileEditor(contents, 'css', (editor, doc) => {
			editor.selections = [
				new Selection(3, 7, 6, 6)
			];

			return toggleComment().then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return toggleComment().then(() => {
					assert.strictEqual(doc.getText(), contents);
					return Promise.resolve();
				});
			});
		});
	});

	test('toggle comment when selection spans properties of separate rules, with start in whitespace and end inside the property (CSS)', () => {
		const expectedContents = `
	.one {
		margin: 10px;
		/* padding: 10px;
	}
	.two {
		height: 42px; */
		display: none;
	}
	.three {
		width: 42px;
	}`;
		return withRandomFileEditor(contents, 'css', (editor, doc) => {
			editor.selections = [
				new Selection(3, 0, 6, 6)
			];

			return toggleComment().then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return toggleComment().then(() => {
					assert.strictEqual(doc.getText(), contents);
					return Promise.resolve();
				});
			});
		});
	});

	test('toggle comment when selection spans properties of separate rules, with end in whitespace and start inside the property (CSS)', () => {
		const expectedContents = `
	.one {
		margin: 10px;
		/* padding: 10px;
	}
	.two {
		height: 42px; */
		display: none;
	}
	.three {
		width: 42px;
	}`;
		return withRandomFileEditor(contents, 'css', (editor, doc) => {
			editor.selections = [
				new Selection(3, 7, 7, 0)
			];

			return toggleComment().then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return toggleComment().then(() => {
					assert.strictEqual(doc.getText(), contents);
					return Promise.resolve();
				});
			});
		});
	});

	test('toggle comment when selection spans properties of separate rules, with both start and end in whitespace (CSS)', () => {
		const expectedContents = `
	.one {
		margin: 10px;
		/* padding: 10px;
	}
	.two {
		height: 42px; */
		display: none;
	}
	.three {
		width: 42px;
	}`;
		return withRandomFileEditor(contents, 'css', (editor, doc) => {
			editor.selections = [
				new Selection(3, 0, 7, 0)
			];

			return toggleComment().then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return toggleComment().then(() => {
					assert.strictEqual(doc.getText(), contents);
					return Promise.resolve();
				});
			});
		});
	});

	test('toggle comment when multiple nodes of same parent are partially under single selection (CSS)', () => {
		const expectedContents = `
	.one {
		/* margin: 10px;
		padding: 10px; */
	}
	/* .two {
		height: 42px;
		display: none;
	}
	.three {
		width: 42px;
 */	}`;
		return withRandomFileEditor(contents, 'css', (editor, doc) => {
			editor.selections = [
				new Selection(2, 7, 3, 10), // 2 properties partially under a single selection
				new Selection(5, 2, 11, 0), // 2 rules partially under a single selection
			];

			return toggleComment().then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return toggleComment().then(() => {
					assert.strictEqual(doc.getText(), contents);
					return Promise.resolve();
				});
			});
		});
	});


});


suite('Tests for Toggle Comment action from Emmet in nested css (SCSS)', () => {
	teardown(closeAllEditors);

	const contents = `
	.one {
		height: 42px;

		.two {
			width: 42px;
		}

		.three {
			padding: 10px;
		}
	}`;

	test('toggle comment with multiple cursors selecting nested nodes (SCSS)', () => {
		const expectedContents = `
	.one {
		/* height: 42px; */

		/* .two {
			width: 42px;
		} */

		.three {
			/* padding: 10px; */
		}
	}`;
		return withRandomFileEditor(contents, 'css', (editor, doc) => {
			editor.selections = [
				new Selection(2, 5, 2, 5), // cursor inside a property
				new Selection(4, 4, 4, 4), // two cursors: one inside a nested rule
				new Selection(5, 5, 5, 5), // 		and the second one inside a nested property
				new Selection(9, 5, 9, 5) // cursor inside a property inside a nested rule
			];

			return toggleComment().then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return toggleComment().then(() => {
					assert.strictEqual(doc.getText(), contents);
					return Promise.resolve();
				});
			});
		});
	});
	test('toggle comment with multiple cursors selecting several nested nodes (SCSS)', () => {
		const expectedContents = `
	/* .one {
		height: 42px;

		.two {
			width: 42px;
		}

		.three {
			padding: 10px;
		}
	} */`;
		return withRandomFileEditor(contents, 'css', (editor, doc) => {
			editor.selections = [
				new Selection(1, 3, 1, 3), // cursor in the outside rule. And several cursors inside:
				new Selection(2, 5, 2, 5), // cursor inside a property
				new Selection(4, 4, 4, 4), // two cursors: one inside a nested rule
				new Selection(5, 5, 5, 5), // 		and the second one inside a nested property
				new Selection(9, 5, 9, 5) // cursor inside a property inside a nested rule
			];

			return toggleComment().then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return toggleComment().then(() => {
					assert.strictEqual(doc.getText(), contents);
					return Promise.resolve();
				});
			});
		});
	});

	test('toggle comment with multiple cursors, but no selection (SCSS)', () => {
		const expectedContents = `
	.one {
		/* height: 42px; */

		/* .two {
			width: 42px;
		} */

		.three {
			/* padding: 10px; */
		}
	}`;
		return withRandomFileEditor(contents, 'css', (editor, doc) => {
			editor.selections = [
				new Selection(2, 5, 2, 5), // cursor inside a property
				new Selection(4, 4, 4, 4), // cursor inside a nested rule
				new Selection(9, 5, 9, 5) // cursor inside a property inside a nested rule
			];

			return toggleComment().then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				//return toggleComment().then(() => {
				//	assert.strictEqual(doc.getText(), contents);
				return Promise.resolve();
				//});
			});
		});
	});

	test('toggle comment with multiple cursors and whole node selected (CSS)', () => {
		const expectedContents = `
	.one {
		/* height: 42px; */

		/* .two {
			width: 42px;
		} */

		.three {
			/* padding: 10px; */
		}
	}`;
		return withRandomFileEditor(contents, 'css', (editor, doc) => {
			editor.selections = [
				new Selection(2, 2, 2, 15), // A property completely selected
				new Selection(4, 2, 6, 3), // A rule completely selected
				new Selection(9, 3, 9, 17) // A property inside a nested rule completely selected
			];

			return toggleComment().then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return toggleComment().then(() => {
					assert.strictEqual(doc.getText(), contents);
					return Promise.resolve();
				});
			});
		});
	});



	test('toggle comment when multiple nodes are completely under single selection (CSS)', () => {
		const expectedContents = `
	.one {
		/* height: 42px;

		.two {
			width: 42px;
		} */

		.three {
			padding: 10px;
		}
	}`;
		return withRandomFileEditor(contents, 'css', (editor, doc) => {
			editor.selections = [
				new Selection(2, 2, 6, 3), // A properties and a nested rule completely under a single selection
			];

			return toggleComment().then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return toggleComment().then(() => {
					assert.strictEqual(doc.getText(), contents);
					return Promise.resolve();
				});
			});
		});
	});

	test('toggle comment when multiple nodes are partially under single selection (CSS)', () => {
		const expectedContents = `
	.one {
		/* height: 42px;

		.two {
			width: 42px;
	 */	}

		.three {
			padding: 10px;
		}
	}`;
		return withRandomFileEditor(contents, 'css', (editor, doc) => {
			editor.selections = [
				new Selection(2, 6, 6, 1), // A properties and a nested rule partially under a single selection
			];

			return toggleComment().then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return toggleComment().then(() => {
					assert.strictEqual(doc.getText(), contents);
					return Promise.resolve();
				});
			});
		});
	});

	test('toggle comment doesn\'t fail when start and end nodes differ HTML', () => {
		const contents = `
	<div>
		<p>Hello</p>
	</div>
	`;
		const expectedContents = `
	<!-- <div>
		<p>Hello</p>
	</div> -->
	`;
		return withRandomFileEditor(contents, 'html', (editor, doc) => {
			editor.selections = [
				new Selection(1, 2, 2, 9), // <div> to <p> inclusive
			];

			return toggleComment().then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return toggleComment().then(() => {
					assert.strictEqual(doc.getText(), contents);
					return Promise.resolve();
				});
			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/test/updateImageSize.test.ts]---
Location: vscode-main/extensions/emmet/src/test/updateImageSize.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import * as assert from 'assert';
import { Selection } from 'vscode';
import { withRandomFileEditor, closeAllEditors } from './testUtils';
import { updateImageSize } from '../updateImageSize';

suite('Tests for Emmet actions on html tags', () => {
	teardown(closeAllEditors);

	const imageUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAHYcAAB2HAY/l8WUAAAATSURBVBhXY/jPwADGDP////8PAB/uBfuDMzhuAAAAAElFTkSuQmCC';
	const imageWidth = 2;
	const imageHeight = 2;

	test('update image css with multiple cursors in css file', () => {
		const cssContents = `
		.one {
			margin: 10px;
			padding: 10px;
			background-image: url('${imageUrl}');
		}
		.two {
			background-image: url('${imageUrl}');
			height: 42px;
		}
		.three {
			background-image: url('${imageUrl}');
			width: 42px;
		}
	`;
		const expectedContents = `
		.one {
			margin: 10px;
			padding: 10px;
			background-image: url('${imageUrl}');
			width: ${imageWidth}px;
			height: ${imageHeight}px;
		}
		.two {
			background-image: url('${imageUrl}');
			width: ${imageWidth}px;
			height: ${imageHeight}px;
		}
		.three {
			background-image: url('${imageUrl}');
			height: ${imageHeight}px;
			width: ${imageWidth}px;
		}
	`;
		return withRandomFileEditor(cssContents, 'css', (editor, doc) => {
			editor.selections = [
				new Selection(4, 50, 4, 50),
				new Selection(7, 50, 7, 50),
				new Selection(11, 50, 11, 50)
			];

			return updateImageSize()!.then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return Promise.resolve();
			});
		});
	});

	test('update image size in css in html file with multiple cursors', () => {
		const htmlWithCssContents = `
		<html>
			<style>
				.one {
					margin: 10px;
					padding: 10px;
					background-image: url('${imageUrl}');
				}
				.two {
					background-image: url('${imageUrl}');
					height: 42px;
				}
				.three {
					background-image: url('${imageUrl}');
					width: 42px;
				}
			</style>
		</html>
	`;
		const expectedContents = `
		<html>
			<style>
				.one {
					margin: 10px;
					padding: 10px;
					background-image: url('${imageUrl}');
					width: ${imageWidth}px;
					height: ${imageHeight}px;
				}
				.two {
					background-image: url('${imageUrl}');
					width: ${imageWidth}px;
					height: ${imageHeight}px;
				}
				.three {
					background-image: url('${imageUrl}');
					height: ${imageHeight}px;
					width: ${imageWidth}px;
				}
			</style>
		</html>
	`;
		return withRandomFileEditor(htmlWithCssContents, 'html', (editor, doc) => {
			editor.selections = [
				new Selection(6, 50, 6, 50),
				new Selection(9, 50, 9, 50),
				new Selection(13, 50, 13, 50)
			];

			return updateImageSize()!.then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return Promise.resolve();
			});
		});
	});

	test('update image size in img tag in html file with multiple cursors', () => {
		const htmlwithimgtag = `
		<html>
			<img id="one" src="${imageUrl}" />
			<img id="two" src="${imageUrl}" width="56" />
			<img id="three" src="${imageUrl}" height="56" />
		</html>
	`;
		const expectedContents = `
		<html>
			<img id="one" src="${imageUrl}" width="${imageWidth}" height="${imageHeight}" />
			<img id="two" src="${imageUrl}" width="${imageWidth}" height="${imageHeight}" />
			<img id="three" src="${imageUrl}" height="${imageHeight}" width="${imageWidth}" />
		</html>
	`;
		return withRandomFileEditor(htmlwithimgtag, 'html', (editor, doc) => {
			editor.selections = [
				new Selection(2, 50, 2, 50),
				new Selection(3, 50, 3, 50),
				new Selection(4, 50, 4, 50)
			];

			return updateImageSize()!.then(() => {
				assert.strictEqual(doc.getText(), expectedContents);
				return Promise.resolve();
			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/test/wrapWithAbbreviation.test.ts]---
Location: vscode-main/extensions/emmet/src/test/wrapWithAbbreviation.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import * as assert from 'assert';
import { Selection, workspace, ConfigurationTarget } from 'vscode';
import { withRandomFileEditor, closeAllEditors } from './testUtils';
import { wrapWithAbbreviation } from '../abbreviationActions';

const htmlContentsForBlockWrapTests = `
	<ul class="nav main">
		<li class="item1">img</li>
		<li class="item2">$hithere</li>
		<li class="item3">\${hithere}</li>
	</ul>
`;

const htmlContentsForInlineWrapTests = `
	<ul class="nav main">
		<em class="item1">img</em>
		<em class="item2">$hithere</em>
		<em class="item3">\${hithere}</em>
	</ul>
`;

const wrapBlockElementExpected = `
	<ul class="nav main">
		<div>
			<li class="item1">img</li>
		</div>
		<div>
			<li class="item2">$hithere</li>
		</div>
		<div>
			<li class="item3">\${hithere}</li>
		</div>
	</ul>
`;

const wrapInlineElementExpected = `
	<ul class="nav main">
		<span><em class="item1">img</em></span>
		<span><em class="item2">$hithere</em></span>
		<span><em class="item3">\${hithere}</em></span>
	</ul>
`;

const wrapSnippetExpected = `
	<ul class="nav main">
		<a href="">
			<li class="item1">img</li>
		</a>
		<a href="">
			<li class="item2">$hithere</li>
		</a>
		<a href="">
			<li class="item3">\${hithere}</li>
		</a>
	</ul>
`;

const wrapMultiLineAbbrExpected = `
	<ul class="nav main">
		<ul>
			<li>
				<li class="item1">img</li>
			</li>
		</ul>
		<ul>
			<li>
				<li class="item2">$hithere</li>
			</li>
		</ul>
		<ul>
			<li>
				<li class="item3">\${hithere}</li>
			</li>
		</ul>
	</ul>
`;

// technically a bug, but also a feature (requested behaviour)
// https://github.com/microsoft/vscode/issues/78015
const wrapInlineElementExpectedFormatFalse = `
	<ul class="nav main">
		<h1>
			<li class="item1">img</li>
		</h1>
		<h1>
			<li class="item2">$hithere</li>
		</h1>
		<h1>
			<li class="item3">\${hithere}</li>
		</h1>
	</ul>
`;

suite('Tests for Wrap with Abbreviations', () => {
	teardown(closeAllEditors);

	const multiCursors = [new Selection(2, 6, 2, 6), new Selection(3, 6, 3, 6), new Selection(4, 6, 4, 6)];
	const multiCursorsWithSelection = [new Selection(2, 2, 2, 28), new Selection(3, 2, 3, 33), new Selection(4, 6, 4, 36)];
	const multiCursorsWithFullLineSelection = [new Selection(2, 0, 2, 28), new Selection(3, 0, 3, 33), new Selection(4, 0, 4, 36)];

	const oldValueForSyntaxProfiles = workspace.getConfiguration('emmet').inspect('syntaxProfiles');

	test('Wrap with block element using multi cursor', () => {
		return testWrapWithAbbreviation(multiCursors, 'div', wrapBlockElementExpected, htmlContentsForBlockWrapTests);
	});

	test('Wrap with inline element using multi cursor', () => {
		return testWrapWithAbbreviation(multiCursors, 'span', wrapInlineElementExpected, htmlContentsForInlineWrapTests);
	});

	test('Wrap with snippet using multi cursor', () => {
		return testWrapWithAbbreviation(multiCursors, 'a', wrapSnippetExpected, htmlContentsForBlockWrapTests);
	});

	test('Wrap with multi line abbreviation using multi cursor', () => {
		return testWrapWithAbbreviation(multiCursors, 'ul>li', wrapMultiLineAbbrExpected, htmlContentsForBlockWrapTests);
	});

	test('Wrap with block element using multi cursor selection', () => {
		return testWrapWithAbbreviation(multiCursorsWithSelection, 'div', wrapBlockElementExpected, htmlContentsForBlockWrapTests);
	});

	test('Wrap with inline element using multi cursor selection', () => {
		return testWrapWithAbbreviation(multiCursorsWithSelection, 'span', wrapInlineElementExpected, htmlContentsForInlineWrapTests);
	});

	test('Wrap with snippet using multi cursor selection', () => {
		return testWrapWithAbbreviation(multiCursorsWithSelection, 'a', wrapSnippetExpected, htmlContentsForBlockWrapTests);
	});

	test('Wrap with multi line abbreviation using multi cursor selection', () => {
		return testWrapWithAbbreviation(multiCursorsWithSelection, 'ul>li', wrapMultiLineAbbrExpected, htmlContentsForBlockWrapTests);
	});

	test('Wrap with block element using multi cursor full line selection', () => {
		return testWrapWithAbbreviation(multiCursorsWithFullLineSelection, 'div', wrapBlockElementExpected, htmlContentsForBlockWrapTests);
	});

	test('Wrap with inline element using multi cursor full line selection', () => {
		return testWrapWithAbbreviation(multiCursorsWithFullLineSelection, 'span', wrapInlineElementExpected, htmlContentsForInlineWrapTests);
	});

	test('Wrap with snippet using multi cursor full line selection', () => {
		return testWrapWithAbbreviation(multiCursorsWithFullLineSelection, 'a', wrapSnippetExpected, htmlContentsForBlockWrapTests);
	});

	test('Wrap with multi line abbreviation using multi cursor full line selection', () => {
		return testWrapWithAbbreviation(multiCursorsWithFullLineSelection, 'ul>li', wrapMultiLineAbbrExpected, htmlContentsForBlockWrapTests);
	});

	test('Wrap with abbreviation and comment filter', () => {
		const contents = `
	<ul class="nav main">
		line
	</ul>
	`;
		const expectedContents = `
	<ul class="nav main">
		<li class="hello">line</li>
		<!-- /.hello -->
	</ul>
	`;
		return testWrapWithAbbreviation([new Selection(2, 0, 2, 0)], 'li.hello|c', expectedContents, contents);
	});

	test('Wrap with abbreviation link', () => {
		const contents = `
	<ul class="nav main">
		line
	</ul>
	`;
		const expectedContents = `
	<a href="https://example.com">
		<div>
			<ul class="nav main">
				line
			</ul>
		</div>
	</a>
	`;
		return testWrapWithAbbreviation([new Selection(1, 2, 1, 2)], 'a[href="https://example.com"]>div', expectedContents, contents);
	});

	test('Wrap with abbreviation entire node when cursor is on opening tag', () => {
		const contents = `
	<div class="nav main">
		hello
	</div>
	`;
		const expectedContents = `
	<div>
		<div class="nav main">
			hello
		</div>
	</div>
	`;
		return testWrapWithAbbreviation([new Selection(1, 2, 1, 2)], 'div', expectedContents, contents);
	});

	test('Wrap with abbreviation entire node when cursor is on closing tag', () => {
		const contents = `
	<div class="nav main">
		hello
	</div>
	`;
		const expectedContents = `
	<div>
		<div class="nav main">
			hello
		</div>
	</div>
	`;
		return testWrapWithAbbreviation([new Selection(3, 2, 3, 2)], 'div', expectedContents, contents);
	});

	test('Wrap with abbreviation inner node in cdata', () => {
		const contents = `
	<div class="nav main">
		<![CDATA[
			<div>
				<p>Test 1</p>
			</div>
			<p>Test 2</p>
		]]>
		hello
	</div>
	`;
		const expectedContents = `
	<div class="nav main">
		<![CDATA[
			<div>
				<p>Test 1</p>
			</div>
			<div>
				<p>Test 2</p>
			</div>
		]]>
		hello
	</div>
	`;
		return testWrapWithAbbreviation([new Selection(6, 5, 6, 5)], 'div', expectedContents, contents);
	});

	test('Wrap with abbreviation inner node in script in cdata', () => {
		const contents = `
	<div class="nav main">
		<![CDATA[
			<script type="text/plain">
				<p>Test 1</p>
			</script>
			<p>Test 2</p>
		]]>
		hello
	</div>
	`;
		const expectedContents = `
	<div class="nav main">
		<![CDATA[
			<script type="text/plain">
				<div>
					<p>Test 1</p>
				</div>
			</script>
			<p>Test 2</p>
		]]>
		hello
	</div>
	`;
		return testWrapWithAbbreviation([new Selection(4, 10, 4, 10)], 'div', expectedContents, contents);
	});

	test('Wrap with abbreviation inner node in cdata one-liner', () => {
		const contents = `
	<div class="nav main">
		<![CDATA[<p>Test here</p>]]>
		hello
	</div>
	`;
		// this result occurs because no selection on the open/close p tag was given
		const expectedContents = `
	<div class="nav main">
		<div><![CDATA[<p>Test here</p>]]></div>
		hello
	</div>
	`;
		return testWrapWithAbbreviation([new Selection(2, 15, 2, 15)], 'div', expectedContents, contents);
	});

	test('Wrap with multiline abbreviation doesnt add extra spaces', () => {
		// Issue #29898
		const contents = `
	hello
	`;
		const expectedContents = `
	<ul>
		<li><a href="">hello</a></li>
	</ul>
	`;
		return testWrapWithAbbreviation([new Selection(1, 2, 1, 2)], 'ul>li>a', expectedContents, contents);
	});

	test('Wrap individual lines with abbreviation', () => {
		const contents = `
	<ul class="nav main">
		<li class="item1">This $10 is not a tabstop</li>
		<li class="item2">hi.there</li>
	</ul>
`;
		const wrapIndividualLinesExpected = `
	<ul class="nav main">
		<ul>
			<li class="hello1">
				<li class="item1">This $10 is not a tabstop</li>
			</li>
			<li class="hello2">
				<li class="item2">hi.there</li>
			</li>
		</ul>
	</ul>
`;
		return testWrapIndividualLinesWithAbbreviation([new Selection(2, 2, 3, 33)], 'ul>li.hello$*', wrapIndividualLinesExpected, contents);
	});

	test('Wrap individual lines with abbreviation with extra space selected', () => {
		const contents = `
	<ul class="nav main">
		<li class="item1">img</li>
		<li class="item2">hi.there</li>
	</ul>
`;
		const wrapIndividualLinesExpected = `
	<ul class="nav main">
		<ul>
			<li class="hello1">
				<li class="item1">img</li>
			</li>
			<li class="hello2">
				<li class="item2">hi.there</li>
			</li>
		</ul>
	</ul>
`;
		return testWrapIndividualLinesWithAbbreviation([new Selection(2, 1, 4, 0)], 'ul>li.hello$*', wrapIndividualLinesExpected, contents);
	});

	test('Wrap individual lines with abbreviation with comment filter', () => {
		const contents = `
	<ul class="nav main">
		<li class="item1">img</li>
		<li class="item2">hi.there</li>
	</ul>
`;
		const wrapIndividualLinesExpected = `
	<ul class="nav main">
		<ul>
			<li class="hello">
				<li class="item1">img</li>
			</li>
			<!-- /.hello -->
			<li class="hello">
				<li class="item2">hi.there</li>
			</li>
			<!-- /.hello -->
		</ul>
	</ul>
`;
		return testWrapIndividualLinesWithAbbreviation([new Selection(2, 2, 3, 33)], 'ul>li.hello*|c', wrapIndividualLinesExpected, contents);
	});

	test('Wrap individual lines with abbreviation and trim', () => {
		const contents = `
		<ul class="nav main">
			• lorem ipsum
			• lorem ipsum
		</ul>
	`;
		const wrapIndividualLinesExpected = `
		<ul class="nav main">
			<ul>
				<li class="hello1">lorem ipsum</li>
				<li class="hello2">lorem ipsum</li>
			</ul>
		</ul>
	`;
		return testWrapIndividualLinesWithAbbreviation([new Selection(2, 3, 3, 16)], 'ul>li.hello$*|t', wrapIndividualLinesExpected, contents);
	});

	test('Wrap with abbreviation and format set to false', () => {
		return workspace.getConfiguration('emmet').update('syntaxProfiles', { 'html': { 'format': false } }, ConfigurationTarget.Global).then(() => {
			return testWrapWithAbbreviation(multiCursors, 'h1', wrapInlineElementExpectedFormatFalse, htmlContentsForBlockWrapTests).then(() => {
				return workspace.getConfiguration('emmet').update('syntaxProfiles', oldValueForSyntaxProfiles ? oldValueForSyntaxProfiles.globalValue : undefined, ConfigurationTarget.Global);
			});
		});
	});

	test('Wrap multi line selections with abbreviation', () => {
		const htmlContentsForWrapMultiLineTests = `
			<ul class="nav main">
				line1
				line2

				line3
				line4
			</ul>
		`;

		const wrapMultiLineExpected = `
			<ul class="nav main">
				<div>
					line1
					line2
				</div>

				<div>
					line3
					line4
				</div>
			</ul>
		`;

		return testWrapWithAbbreviation([new Selection(2, 4, 3, 9), new Selection(5, 4, 6, 9)], 'div', wrapMultiLineExpected, htmlContentsForWrapMultiLineTests);
	});

	test('Wrap multiline with abbreviation uses className for jsx files', () => {
		const wrapMultiLineJsxExpected = `
	<ul class="nav main">
		<div className="hello">
			<li class="item1">img</li>
			<li class="item2">$hithere</li>
			<li class="item3">\${hithere}</li>
		</div>
	</ul>
`;

		return testWrapWithAbbreviation([new Selection(2, 2, 4, 36)], '.hello', wrapMultiLineJsxExpected, htmlContentsForBlockWrapTests, 'jsx');
	});

	test('Wrap individual line with abbreviation uses className for jsx files', () => {
		const wrapIndividualLinesJsxExpected = `
	<ul class="nav main">
		<div className="hello1">
			<li class="item1">img</li>
		</div>
		<div className="hello2">
			<li class="item2">$hithere</li>
		</div>
		<div className="hello3">
			<li class="item3">\${hithere}</li>
		</div>
	</ul>
`;

		return testWrapIndividualLinesWithAbbreviation([new Selection(2, 2, 4, 36)], '.hello$*', wrapIndividualLinesJsxExpected, htmlContentsForBlockWrapTests, 'jsx');
	});

	test('Wrap with abbreviation merge overlapping computed ranges', () => {
		const contents = `
	<div class="nav main">
		hello
	</div>
	`;
		const expectedContents = `
	<div>
		<div class="nav main">
			hello
		</div>
	</div>
	`;
		return testWrapWithAbbreviation([new Selection(1, 2, 1, 2), new Selection(1, 10, 1, 10)], 'div', expectedContents, contents);
	});

	test('Wrap with abbreviation ignore invalid abbreviation', () => {
		const contents = `
	<div class="nav main">
		hello
	</div>
	`;
		return testWrapWithAbbreviation([new Selection(1, 2, 1, 2)], 'div]', contents, contents);
	});

});


function testWrapWithAbbreviation(selections: Selection[], abbreviation: string, expectedContents: string, input: string, fileExtension: string = 'html'): Thenable<any> {
	return withRandomFileEditor(input, fileExtension, (editor, _) => {
		editor.selections = selections;
		const promise = wrapWithAbbreviation({ abbreviation });
		if (!promise) {
			assert.strictEqual(1, 2, 'Wrap with Abbreviation returned undefined.');
			return Promise.resolve();
		}

		return promise.then(() => {
			assert.strictEqual(editor.document.getText(), expectedContents);
			return Promise.resolve();
		});
	});
}

function testWrapIndividualLinesWithAbbreviation(selections: Selection[], abbreviation: string, expectedContents: string, input: string, fileExtension: string = 'html'): Thenable<any> {
	return withRandomFileEditor(input, fileExtension, (editor, _) => {
		editor.selections = selections;
		const promise = wrapWithAbbreviation({ abbreviation });
		if (!promise) {
			assert.strictEqual(1, 2, 'Wrap individual lines with Abbreviation returned undefined.');
			return Promise.resolve();
		}

		return promise.then(() => {
			assert.strictEqual(editor.document.getText(), expectedContents);
			return Promise.resolve();
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/typings/EmmetFlatNode.d.ts]---
Location: vscode-main/extensions/emmet/src/typings/EmmetFlatNode.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

declare module 'EmmetFlatNode' {
    export interface Node {
        start: number
        end: number
        type: string
        parent: Node | undefined
        firstChild: Node | undefined
        nextSibling: Node | undefined
        previousSibling: Node | undefined
        children: Node[]
    }

    export interface Token {
        start: number
        end: number
        stream: BufferStream
        toString(): string
    }

    export interface CssToken extends Token {
        size: number
        item(number: number): any
        type: string
    }

    export interface HtmlToken extends Token {
        value: string
    }

    export interface Attribute extends Token {
        name: Token
        value: Token
    }

    export interface HtmlNode extends Node {
        name: string
        open: Token | undefined
        close: Token | undefined
        parent: HtmlNode | undefined
        firstChild: HtmlNode | undefined
        nextSibling: HtmlNode | undefined
        previousSibling: HtmlNode | undefined
        children: HtmlNode[]
        attributes: Attribute[]
    }

    export interface CssNode extends Node {
        name: string
        parent: CssNode | undefined
        firstChild: CssNode | undefined
        nextSibling: CssNode | undefined
        previousSibling: CssNode | undefined
        children: CssNode[]
    }

    export interface Rule extends CssNode {
        selectorToken: Token
        contentStartToken: Token
        contentEndToken: Token
    }

    export interface Property extends CssNode {
        valueToken: Token
        separator: string
        parent: Rule
        terminatorToken: Token
        separatorToken: Token
        value: string
    }

    export interface Stylesheet extends Node {
        comments: Token[]
    }

    export interface BufferStream {
        peek(): number
        next(): number
        backUp(n: number): number
        current(): string
        substring(from: number, to: number): string
        eat(match: any): boolean
        eatWhile(match: any): boolean
    }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/typings/emmetio__css-parser.d.ts]---
Location: vscode-main/extensions/emmet/src/typings/emmetio__css-parser.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

declare module '@emmetio/css-parser' {
	import { BufferStream, Stylesheet } from 'EmmetNode';
	import { Stylesheet as FlatStylesheet } from 'EmmetFlatNode';

	function parseStylesheet(stream: BufferStream): Stylesheet;
	function parseStylesheet(stream: string): FlatStylesheet;

	export default parseStylesheet;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/typings/emmetio__html-matcher.d.ts]---
Location: vscode-main/extensions/emmet/src/typings/emmetio__html-matcher.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

declare module '@emmetio/html-matcher' {
	import { BufferStream, HtmlNode } from 'EmmetNode';
	import { HtmlNode as HtmlFlatNode } from 'EmmetFlatNode';

	function parse(stream: BufferStream): HtmlNode;
	function parse(stream: string): HtmlFlatNode;

	export default parse;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/typings/EmmetNode.d.ts]---
Location: vscode-main/extensions/emmet/src/typings/EmmetNode.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

declare module 'EmmetNode' {
    import { Position } from 'vscode';

    export interface Node {
        start: Position
        end: Position
        type: string
        parent: Node
        firstChild: Node
        nextSibling: Node
        previousSibling: Node
        children: Node[]
    }

    export interface Token {
        start: Position
        end: Position
        stream: BufferStream
        toString(): string
    }

    export interface CssToken extends Token {
        size: number
        item(number: number): any
        type: string
    }

    export interface HtmlToken extends Token {
        value: string
    }

    export interface Attribute extends Token {
        name: Token
        value: Token
    }

    export interface HtmlNode extends Node {
        name: string
        open: Token
        close: Token
        parent: HtmlNode
        firstChild: HtmlNode
        nextSibling: HtmlNode
        previousSibling: HtmlNode
        children: HtmlNode[]
        attributes: Attribute[]
    }

    export interface CssNode extends Node {
        name: string
        parent: CssNode
        firstChild: CssNode
        nextSibling: CssNode
        previousSibling: CssNode
        children: CssNode[]
    }

    export interface Rule extends CssNode {
        selectorToken: Token
        contentStartToken: Token
        contentEndToken: Token
    }

    export interface Property extends CssNode {
        valueToken: Token
        separator: string
        parent: Rule
        terminatorToken: Token
        separatorToken: Token
        value: string
    }

    export interface Stylesheet extends Node {
        comments: Token[]
    }

    export interface BufferStream {
        peek(): number
        next(): number
        backUp(n: number): number
        current(): string
        substring(from: Position, to: Position): string
        eat(match: any): boolean
        eatWhile(match: any): boolean
    }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/typings/refs.d.ts]---
Location: vscode-main/extensions/emmet/src/typings/refs.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/// <reference types='@types/node'/>
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/test-workspace/.vscode/settings.json]---
Location: vscode-main/extensions/emmet/test-workspace/.vscode/settings.json

```json
{
	"editor.minimap.enabled": false, // see https://github.com/microsoft/vscode/issues/115747
	"workbench.editor.languageDetection": false,
	"typescript.disableAutomaticTypeAcquisition": true,
	"json.schemaDownload.enable": false,
	"npm.fetchOnlinePackageInfo": false,
	"npm.autoDetect": "off",
	"workbench.localHistory.enabled": false
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/extension-editing/.npmrc]---
Location: vscode-main/extensions/extension-editing/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/extension-editing/.vscodeignore]---
Location: vscode-main/extensions/extension-editing/.vscodeignore

```text
test/**
src/**
tsconfig.json
out/**
extension.webpack.config.js
extension-browser.webpack.config.js
package-lock.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/extension-editing/extension-browser.webpack.config.js]---
Location: vscode-main/extensions/extension-editing/extension-browser.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import { browser as withBrowserDefaults } from '../shared.webpack.config.mjs';

export default withBrowserDefaults({
	context: import.meta.dirname,
	entry: {
		extension: './src/extensionEditingBrowserMain.ts'
	},
	output: {
		filename: 'extensionEditingBrowserMain.js'
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/extension-editing/extension.webpack.config.js]---
Location: vscode-main/extensions/extension-editing/extension.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import withDefaults from '../shared.webpack.config.mjs';

export default withDefaults({
	context: import.meta.dirname,
	entry: {
		extension: './src/extensionEditingMain.ts',
	},
	output: {
		filename: 'extensionEditingMain.js'
	},
	externals: {
		'../../../product.json': 'commonjs ../../../product.json',
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/extension-editing/package-lock.json]---
Location: vscode-main/extensions/extension-editing/package-lock.json

```json
{
  "name": "extension-editing",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "extension-editing",
      "version": "1.0.0",
      "license": "MIT",
      "dependencies": {
        "jsonc-parser": "^3.2.0",
        "markdown-it": "^12.3.2",
        "parse5": "^3.0.2"
      },
      "devDependencies": {
        "@types/markdown-it": "0.0.2",
        "@types/node": "22.x"
      },
      "engines": {
        "vscode": "^1.4.0"
      }
    },
    "node_modules/@types/markdown-it": {
      "version": "0.0.2",
      "resolved": "https://registry.npmjs.org/@types/markdown-it/-/markdown-it-0.0.2.tgz",
      "integrity": "sha1-XZrRnm5lCM3S8llt+G/Qqt5ZhmA= sha512-A2seE+zJYSjGHy7L/v0EN/xRfgv2A60TuXOwI8tt5aZxF4UeoYIkM2jERnNH8w4VFr7oFEm0lElGOao7fZgygQ==",
      "dev": true
    },
    "node_modules/@types/node": {
      "version": "22.13.10",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-22.13.10.tgz",
      "integrity": "sha512-I6LPUvlRH+O6VRUqYOcMudhaIdUVWfsjnZavnsraHvpBwaEyMN29ry+0UVJhImYL16xsscu0aske3yA+uPOWfw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.20.0"
      }
    },
    "node_modules/argparse": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/argparse/-/argparse-2.0.1.tgz",
      "integrity": "sha512-8+9WqebbFzpX9OR+Wa6O29asIogeRMzcGtAINdpMHHyAg10f05aSFVBbcEqGf/PXw1EjAZ+q2/bEBg3DvurK3Q=="
    },
    "node_modules/entities": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/entities/-/entities-2.1.0.tgz",
      "integrity": "sha512-hCx1oky9PFrJ611mf0ifBLBRW8lUUVRlFolb5gWRfIELabBlbp9xZvrqZLZAs+NxFnbfQoeGd8wDkygjg7U85w==",
      "funding": {
        "url": "https://github.com/fb55/entities?sponsor=1"
      }
    },
    "node_modules/jsonc-parser": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/jsonc-parser/-/jsonc-parser-3.2.0.tgz",
      "integrity": "sha512-gfFQZrcTc8CnKXp6Y4/CBT3fTc0OVuDofpre4aEeEpSBPV5X5v4+Vmx+8snU7RLPrNHPKSgLxGo9YuQzz20o+w=="
    },
    "node_modules/linkify-it": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/linkify-it/-/linkify-it-3.0.3.tgz",
      "integrity": "sha512-ynTsyrFSdE5oZ/O9GEf00kPngmOfVwazR5GKDq6EYfhlpFug3J2zybX56a2PRRpc9P+FuSoGNAwjlbDs9jJBPQ==",
      "dependencies": {
        "uc.micro": "^1.0.1"
      }
    },
    "node_modules/markdown-it": {
      "version": "12.3.2",
      "resolved": "https://registry.npmjs.org/markdown-it/-/markdown-it-12.3.2.tgz",
      "integrity": "sha512-TchMembfxfNVpHkbtriWltGWc+m3xszaRD0CZup7GFFhzIgQqxIfn3eGj1yZpfuflzPvfkt611B2Q/Bsk1YnGg==",
      "dependencies": {
        "argparse": "^2.0.1",
        "entities": "~2.1.0",
        "linkify-it": "^3.0.1",
        "mdurl": "^1.0.1",
        "uc.micro": "^1.0.5"
      },
      "bin": {
        "markdown-it": "bin/markdown-it.js"
      }
    },
    "node_modules/mdurl": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/mdurl/-/mdurl-1.0.1.tgz",
      "integrity": "sha1-/oWy7HWlkDfyrf7BAP1sYBdhFS4= sha512-/sKlQJCBYVY9Ers9hqzKou4H6V5UWc/M59TH2dvkt+84itfnq7uFOMLpOiOS4ujvHP4etln18fmIxA5R5fll0g=="
    },
    "node_modules/parse5": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/parse5/-/parse5-3.0.2.tgz",
      "integrity": "sha1-Be/1fw70V3+xRKefi5qWemzERRA= sha512-yQW05f47bKFJa0WdnyzP7vh7+B+w8jhVsFBBiaEbIfNDSSt8GADBhcQgsdYxatQ7rVs1nU9cmsYXURGWBH3Siw==",
      "dependencies": {
        "@types/node": "^6.0.46"
      }
    },
    "node_modules/parse5/node_modules/@types/node": {
      "version": "6.0.78",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-6.0.78.tgz",
      "integrity": "sha512-+vD6E8ixntRzzZukoF3uP1iV+ZjVN3koTcaeK+BEoc/kSfGbLDIGC7RmCaUgVpUfN6cWvfczFRERCyKM9mkvXg=="
    },
    "node_modules/uc.micro": {
      "version": "1.0.6",
      "resolved": "https://registry.npmjs.org/uc.micro/-/uc.micro-1.0.6.tgz",
      "integrity": "sha512-8Y75pvTYkLJW2hWQHXxoqRgV7qb9B+9vFEtidML+7koHUFapnVJAZ6cKs+Qjz5Aw3aZWHMC6u0wJE3At+nSGwA=="
    },
    "node_modules/undici-types": {
      "version": "6.20.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.20.0.tgz",
      "integrity": "sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==",
      "dev": true,
      "license": "MIT"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/extension-editing/package.json]---
Location: vscode-main/extensions/extension-editing/package.json

```json
{
  "name": "extension-editing",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "^1.4.0"
  },
  "icon": "images/icon.png",
  "activationEvents": [
    "onLanguage:json",
    "onLanguage:markdown"
  ],
  "main": "./out/extensionEditingMain",
  "browser": "./dist/browser/extensionEditingBrowserMain",
  "capabilities": {
    "virtualWorkspaces": true,
    "untrustedWorkspaces": {
      "supported": true
    }
  },
  "scripts": {
    "compile": "gulp compile-extension:extension-editing",
    "watch": "gulp watch-extension:extension-editing"
  },
  "dependencies": {
    "jsonc-parser": "^3.2.0",
    "markdown-it": "^12.3.2",
    "parse5": "^3.0.2"
  },
  "contributes": {
    "jsonValidation": [
      {
        "fileMatch": "package.json",
        "url": "vscode://schemas/vscode-extensions"
      },
      {
        "fileMatch": "*language-configuration.json",
        "url": "vscode://schemas/language-configuration"
      },
      {
        "fileMatch": [
          "*icon-theme.json",
          "!*product-icon-theme.json"
        ],
        "url": "vscode://schemas/icon-theme"
      },
      {
        "fileMatch": "*product-icon-theme.json",
        "url": "vscode://schemas/product-icon-theme"
      },
      {
        "fileMatch": "*color-theme.json",
        "url": "vscode://schemas/color-theme"
      }
    ],
    "languages": [
      {
        "id": "ignore",
        "filenames": [
          ".vscodeignore"
        ]
      }
    ]
  },
  "devDependencies": {
    "@types/markdown-it": "0.0.2",
    "@types/node": "22.x"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/extension-editing/package.nls.json]---
Location: vscode-main/extensions/extension-editing/package.nls.json

```json
{
	"displayName": "Extension Authoring",
	"description": "Provides linting capabilities for authoring extensions."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/extension-editing/tsconfig.json]---
Location: vscode-main/extensions/extension-editing/tsconfig.json

```json
{
	"extends": "../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"typeRoots": [
			"./node_modules/@types"
		]
	},
	"include": [
		"src/**/*",
		"../../src/vscode-dts/vscode.d.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/extension-editing/src/constants.ts]---
Location: vscode-main/extensions/extension-editing/src/constants.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { l10n } from 'vscode';

export const implicitActivationEvent = l10n.t("This activation event cannot be explicitly listed by your extension.");
export const redundantImplicitActivationEvent = l10n.t("This activation event can be removed as VS Code generates these automatically from your package.json contribution declarations.");
```

--------------------------------------------------------------------------------

---[FILE: extensions/extension-editing/src/extensionEditingBrowserMain.ts]---
Location: vscode-main/extensions/extension-editing/src/extensionEditingBrowserMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { PackageDocument } from './packageDocumentHelper';

export function activate(context: vscode.ExtensionContext) {
	//package.json suggestions
	context.subscriptions.push(registerPackageDocumentCompletions());

}

function registerPackageDocumentCompletions(): vscode.Disposable {
	return vscode.languages.registerCompletionItemProvider({ language: 'json', pattern: '**/package.json' }, {
		provideCompletionItems(document, position, token) {
			return new PackageDocument(document).provideCompletionItems(position, token);
		}
	});

}
```

--------------------------------------------------------------------------------

---[FILE: extensions/extension-editing/src/extensionEditingMain.ts]---
Location: vscode-main/extensions/extension-editing/src/extensionEditingMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { PackageDocument } from './packageDocumentHelper';
import { ExtensionLinter } from './extensionLinter';

export function activate(context: vscode.ExtensionContext) {

	//package.json suggestions
	context.subscriptions.push(registerPackageDocumentCompletions());

	//package.json code actions for lint warnings
	context.subscriptions.push(registerCodeActionsProvider());

	context.subscriptions.push(new ExtensionLinter());
}

function registerPackageDocumentCompletions(): vscode.Disposable {
	return vscode.languages.registerCompletionItemProvider({ language: 'json', pattern: '**/package.json' }, {
		provideCompletionItems(document, position, token) {
			return new PackageDocument(document).provideCompletionItems(position, token);
		}
	});
}

function registerCodeActionsProvider(): vscode.Disposable {
	return vscode.languages.registerCodeActionsProvider({ language: 'json', pattern: '**/package.json' }, {
		provideCodeActions(document, range, context, token) {
			return new PackageDocument(document).provideCodeActions(range, context, token);
		}
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/extension-editing/src/extensionEngineValidation.ts]---
Location: vscode-main/extensions/extension-editing/src/extensionEngineValidation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// https://github.com/microsoft/vscode/blob/6cb34eb22385bc93ab25aa2e5113f59c7a2299ac/src/vs/platform/extensions/common/extensionValidator.ts

export interface IParsedVersion {
	hasCaret: boolean;
	hasGreaterEquals: boolean;
	majorBase: number;
	majorMustEqual: boolean;
	minorBase: number;
	minorMustEqual: boolean;
	patchBase: number;
	patchMustEqual: boolean;
	preRelease: string | null;
}

export interface INormalizedVersion {
	majorBase: number;
	majorMustEqual: boolean;
	minorBase: number;
	minorMustEqual: boolean;
	patchBase: number;
	patchMustEqual: boolean;
	notBefore: number; /* milliseconds timestamp, or 0 */
	isMinimum: boolean;
}

const VERSION_REGEXP = /^(\^|>=)?((\d+)|x)\.((\d+)|x)\.((\d+)|x)(\-.*)?$/;
const NOT_BEFORE_REGEXP = /^-(\d{4})(\d{2})(\d{2})$/;

export function isValidVersionStr(version: string): boolean {
	version = version.trim();
	return (version === '*' || VERSION_REGEXP.test(version));
}

export function parseVersion(version: string): IParsedVersion | null {
	if (!isValidVersionStr(version)) {
		return null;
	}

	version = version.trim();

	if (version === '*') {
		return {
			hasCaret: false,
			hasGreaterEquals: false,
			majorBase: 0,
			majorMustEqual: false,
			minorBase: 0,
			minorMustEqual: false,
			patchBase: 0,
			patchMustEqual: false,
			preRelease: null
		};
	}

	const m = version.match(VERSION_REGEXP);
	if (!m) {
		return null;
	}
	return {
		hasCaret: m[1] === '^',
		hasGreaterEquals: m[1] === '>=',
		majorBase: m[2] === 'x' ? 0 : parseInt(m[2], 10),
		majorMustEqual: (m[2] === 'x' ? false : true),
		minorBase: m[4] === 'x' ? 0 : parseInt(m[4], 10),
		minorMustEqual: (m[4] === 'x' ? false : true),
		patchBase: m[6] === 'x' ? 0 : parseInt(m[6], 10),
		patchMustEqual: (m[6] === 'x' ? false : true),
		preRelease: m[8] || null
	};
}

export function normalizeVersion(version: IParsedVersion | null): INormalizedVersion | null {
	if (!version) {
		return null;
	}

	const majorBase = version.majorBase;
	const majorMustEqual = version.majorMustEqual;
	const minorBase = version.minorBase;
	let minorMustEqual = version.minorMustEqual;
	const patchBase = version.patchBase;
	let patchMustEqual = version.patchMustEqual;

	if (version.hasCaret) {
		if (majorBase === 0) {
			patchMustEqual = false;
		} else {
			minorMustEqual = false;
			patchMustEqual = false;
		}
	}

	let notBefore = 0;
	if (version.preRelease) {
		const match = NOT_BEFORE_REGEXP.exec(version.preRelease);
		if (match) {
			const [, year, month, day] = match;
			notBefore = Date.UTC(Number(year), Number(month) - 1, Number(day));
		}
	}

	return {
		majorBase: majorBase,
		majorMustEqual: majorMustEqual,
		minorBase: minorBase,
		minorMustEqual: minorMustEqual,
		patchBase: patchBase,
		patchMustEqual: patchMustEqual,
		isMinimum: version.hasGreaterEquals,
		notBefore,
	};
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/extension-editing/src/extensionLinter.ts]---
Location: vscode-main/extensions/extension-editing/src/extensionLinter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import * as fs from 'fs';
import { URL } from 'url';

import { parseTree, findNodeAtLocation, Node as JsonNode, getNodeValue } from 'jsonc-parser';
import * as MarkdownItType from 'markdown-it';

import { commands, languages, workspace, Disposable, TextDocument, Uri, Diagnostic, Range, DiagnosticSeverity, Position, env, l10n } from 'vscode';
import { INormalizedVersion, normalizeVersion, parseVersion } from './extensionEngineValidation';
import { JsonStringScanner } from './jsonReconstruct';
import { implicitActivationEvent, redundantImplicitActivationEvent } from './constants';

const product = JSON.parse(fs.readFileSync(path.join(env.appRoot, 'product.json'), { encoding: 'utf-8' }));
const allowedBadgeProviders: string[] = (product.extensionAllowedBadgeProviders || []).map((s: string) => s.toLowerCase());
const allowedBadgeProvidersRegex: RegExp[] = (product.extensionAllowedBadgeProvidersRegex || []).map((r: string) => new RegExp(r));
const extensionEnabledApiProposals: Record<string, string[]> = product.extensionEnabledApiProposals ?? {};
const reservedImplicitActivationEventPrefixes = ['onNotebookSerializer:'];
const redundantImplicitActivationEventPrefixes = ['onLanguage:', 'onView:', 'onAuthenticationRequest:', 'onCommand:', 'onCustomEditor:', 'onTerminalProfile:', 'onRenderer:', 'onTerminalQuickFixRequest:', 'onWalkthrough:'];

function isTrustedSVGSource(uri: Uri): boolean {
	return allowedBadgeProviders.includes(uri.authority.toLowerCase()) || allowedBadgeProvidersRegex.some(r => r.test(uri.toString()));
}

const httpsRequired = l10n.t("Images must use the HTTPS protocol.");
const svgsNotValid = l10n.t("SVGs are not a valid image source.");
const embeddedSvgsNotValid = l10n.t("Embedded SVGs are not a valid image source.");
const dataUrlsNotValid = l10n.t("Data URLs are not a valid image source.");
const relativeUrlRequiresHttpsRepository = l10n.t("Relative image URLs require a repository with HTTPS protocol to be specified in the package.json.");
const relativeBadgeUrlRequiresHttpsRepository = l10n.t("Relative badge URLs require a repository with HTTPS protocol to be specified in this package.json.");
const apiProposalNotListed = l10n.t("This proposal cannot be used because for this extension the product defines a fixed set of API proposals. You can test your extension but before publishing you MUST reach out to the VS Code team.");
const bumpEngineForImplicitActivationEvents = l10n.t("This activation event can be removed for extensions targeting engine version ^1.75.0 as VS Code will generate these automatically from your package.json contribution declarations.");
const starActivation = l10n.t("Using '*' activation is usually a bad idea as it impacts performance.");
const parsingErrorHeader = l10n.t("Error parsing the when-clause:");

enum Context {
	ICON,
	BADGE,
	MARKDOWN
}

interface TokenAndPosition {
	token: MarkdownItType.Token;
	begin: number;
	end: number;
}

interface PackageJsonInfo {
	isExtension: boolean;
	hasHttpsRepository: boolean;
	repository: Uri;
	implicitActivationEvents: Set<string> | undefined;
	engineVersion: INormalizedVersion | null;
}

export class ExtensionLinter {

	private diagnosticsCollection = languages.createDiagnosticCollection('extension-editing');
	private fileWatcher = workspace.createFileSystemWatcher('**/package.json');
	private disposables: Disposable[] = [this.diagnosticsCollection, this.fileWatcher];

	private folderToPackageJsonInfo: Record<string, PackageJsonInfo> = {};
	private packageJsonQ = new Set<TextDocument>();
	private readmeQ = new Set<TextDocument>();
	private timer: NodeJS.Timeout | undefined;
	private markdownIt: MarkdownItType.MarkdownIt | undefined;
	private parse5: typeof import('parse5') | undefined;

	constructor() {
		this.disposables.push(
			workspace.onDidOpenTextDocument(document => this.queue(document)),
			workspace.onDidChangeTextDocument(event => this.queue(event.document)),
			workspace.onDidCloseTextDocument(document => this.clear(document)),
			this.fileWatcher.onDidChange(uri => this.packageJsonChanged(this.getUriFolder(uri))),
			this.fileWatcher.onDidCreate(uri => this.packageJsonChanged(this.getUriFolder(uri))),
			this.fileWatcher.onDidDelete(uri => this.packageJsonChanged(this.getUriFolder(uri))),
		);
		workspace.textDocuments.forEach(document => this.queue(document));
	}

	private queue(document: TextDocument) {
		const p = document.uri.path;
		if (document.languageId === 'json' && p.endsWith('/package.json')) {
			this.packageJsonQ.add(document);
			this.startTimer();
		}
		this.queueReadme(document);
	}

	private queueReadme(document: TextDocument) {
		const p = document.uri.path;
		if (document.languageId === 'markdown' && (p.toLowerCase().endsWith('/readme.md') || p.toLowerCase().endsWith('/changelog.md'))) {
			this.readmeQ.add(document);
			this.startTimer();
		}
	}

	private startTimer() {
		if (this.timer) {
			clearTimeout(this.timer);
		}
		this.timer = setTimeout(() => {
			this.lint()
				.catch(console.error);
		}, 300);
	}

	private async lint() {
		await Promise.all([
			this.lintPackageJson(),
			this.lintReadme()
		]);
	}

	private async lintPackageJson() {
		for (const document of Array.from(this.packageJsonQ)) {
			this.packageJsonQ.delete(document);
			if (document.isClosed) {
				continue;
			}

			const diagnostics: Diagnostic[] = [];

			const tree = parseTree(document.getText());
			const info = this.readPackageJsonInfo(this.getUriFolder(document.uri), tree);
			if (tree && info.isExtension) {

				const icon = findNodeAtLocation(tree, ['icon']);
				if (icon && icon.type === 'string') {
					this.addDiagnostics(diagnostics, document, icon.offset + 1, icon.offset + icon.length - 1, icon.value, Context.ICON, info);
				}

				const badges = findNodeAtLocation(tree, ['badges']);
				if (badges && badges.type === 'array' && badges.children) {
					badges.children.map(child => findNodeAtLocation(child, ['url']))
						.filter(url => url && url.type === 'string')
						.map(url => this.addDiagnostics(diagnostics, document, url!.offset + 1, url!.offset + url!.length - 1, url!.value, Context.BADGE, info));
				}

				const publisher = findNodeAtLocation(tree, ['publisher']);
				const name = findNodeAtLocation(tree, ['name']);
				const enabledApiProposals = findNodeAtLocation(tree, ['enabledApiProposals']);
				if (publisher?.type === 'string' && name?.type === 'string' && enabledApiProposals?.type === 'array') {
					const extensionId = `${getNodeValue(publisher)}.${getNodeValue(name)}`;
					const effectiveProposalNames = extensionEnabledApiProposals[extensionId];
					if (Array.isArray(effectiveProposalNames) && enabledApiProposals.children) {
						for (const child of enabledApiProposals.children) {
							const proposalName = child.type === 'string' ? getNodeValue(child) : undefined;
							if (typeof proposalName === 'string' && !effectiveProposalNames.includes(proposalName.split('@')[0])) {
								const start = document.positionAt(child.offset);
								const end = document.positionAt(child.offset + child.length);
								diagnostics.push(new Diagnostic(new Range(start, end), apiProposalNotListed, DiagnosticSeverity.Error));
							}
						}
					}
				}
				const activationEventsNode = findNodeAtLocation(tree, ['activationEvents']);
				if (activationEventsNode?.type === 'array' && activationEventsNode.children) {
					for (const activationEventNode of activationEventsNode.children) {
						const activationEvent = getNodeValue(activationEventNode);
						const isImplicitActivationSupported = info.engineVersion && info.engineVersion?.majorBase >= 1 && info.engineVersion?.minorBase >= 75;
						// Redundant Implicit Activation
						if (info.implicitActivationEvents?.has(activationEvent) && redundantImplicitActivationEventPrefixes.some((prefix) => activationEvent.startsWith(prefix))) {
							const start = document.positionAt(activationEventNode.offset);
							const end = document.positionAt(activationEventNode.offset + activationEventNode.length);
							const message = isImplicitActivationSupported ? redundantImplicitActivationEvent : bumpEngineForImplicitActivationEvents;
							diagnostics.push(new Diagnostic(new Range(start, end), message, isImplicitActivationSupported ? DiagnosticSeverity.Warning : DiagnosticSeverity.Information));
						}

						// Reserved Implicit Activation
						for (const implicitActivationEventPrefix of reservedImplicitActivationEventPrefixes) {
							if (isImplicitActivationSupported && activationEvent.startsWith(implicitActivationEventPrefix)) {
								const start = document.positionAt(activationEventNode.offset);
								const end = document.positionAt(activationEventNode.offset + activationEventNode.length);
								diagnostics.push(new Diagnostic(new Range(start, end), implicitActivationEvent, DiagnosticSeverity.Error));
							}
						}

						// Star activation
						if (activationEvent === '*') {
							const start = document.positionAt(activationEventNode.offset);
							const end = document.positionAt(activationEventNode.offset + activationEventNode.length);
							const diagnostic = new Diagnostic(new Range(start, end), starActivation, DiagnosticSeverity.Information);
							diagnostic.code = {
								value: 'star-activation',
								target: Uri.parse('https://code.visualstudio.com/api/references/activation-events#Start-up'),
							};
							diagnostics.push(diagnostic);
						}
					}
				}

				const whenClauseLinting = await this.lintWhenClauses(findNodeAtLocation(tree, ['contributes']), document);
				diagnostics.push(...whenClauseLinting);
			}
			this.diagnosticsCollection.set(document.uri, diagnostics);
		}
	}

	/** lints `when` and `enablement` clauses */
	private async lintWhenClauses(contributesNode: JsonNode | undefined, document: TextDocument): Promise<Diagnostic[]> {
		if (!contributesNode) {
			return [];
		}

		const whenClauses: JsonNode[] = [];

		function findWhens(node: JsonNode | undefined, clauseName: string) {
			if (node) {
				switch (node.type) {
					case 'property':
						if (node.children && node.children.length === 2) {
							const key = node.children[0];
							const value = node.children[1];
							switch (value.type) {
								case 'string':
									if (key.value === clauseName && typeof value.value === 'string' /* careful: `.value` MUST be a string 1) because a when/enablement clause is string; so also, type cast to string below is safe */) {
										whenClauses.push(value);
									}
								case 'object':
								case 'array':
									findWhens(value, clauseName);
							}
						}
						break;
					case 'object':
					case 'array':
						if (node.children) {
							node.children.forEach(n => findWhens(n, clauseName));
						}
				}
			}
		}

		[
			findNodeAtLocation(contributesNode, ['menus']),
			findNodeAtLocation(contributesNode, ['views']),
			findNodeAtLocation(contributesNode, ['viewsWelcome']),
			findNodeAtLocation(contributesNode, ['keybindings']),
		].forEach(n => findWhens(n, 'when'));

		findWhens(findNodeAtLocation(contributesNode, ['commands']), 'enablement');

		const parseResults = await commands.executeCommand<{ errorMessage: string; offset: number; length: number }[][]>('_validateWhenClauses', whenClauses.map(w => w.value as string /* we make sure to capture only if `w.value` is string above */));

		const diagnostics: Diagnostic[] = [];
		for (let i = 0; i < parseResults.length; ++i) {
			const whenClauseJSONNode = whenClauses[i];

			const jsonStringScanner = new JsonStringScanner(document.getText(), whenClauseJSONNode.offset + 1);

			for (const error of parseResults[i]) {
				const realOffset = jsonStringScanner.getOffsetInEncoded(error.offset);
				const realOffsetEnd = jsonStringScanner.getOffsetInEncoded(error.offset + error.length);
				const start = document.positionAt(realOffset /* +1 to account for the quote (I think) */);
				const end = document.positionAt(realOffsetEnd);
				const errMsg = `${parsingErrorHeader}\n\n${error.errorMessage}`;
				const diagnostic = new Diagnostic(new Range(start, end), errMsg, DiagnosticSeverity.Error);
				diagnostic.code = {
					value: 'See docs',
					target: Uri.parse('https://code.visualstudio.com/api/references/when-clause-contexts'),
				};
				diagnostics.push(diagnostic);
			}
		}
		return diagnostics;
	}

	private async lintReadme() {
		for (const document of this.readmeQ) {
			this.readmeQ.delete(document);
			if (document.isClosed) {
				continue;
			}

			const folder = this.getUriFolder(document.uri);
			let info = this.folderToPackageJsonInfo[folder.toString()];
			if (!info) {
				const tree = await this.loadPackageJson(folder);
				info = this.readPackageJsonInfo(folder, tree);
			}
			if (!info.isExtension) {
				this.diagnosticsCollection.set(document.uri, []);
				return;
			}

			const text = document.getText();
			if (!this.markdownIt) {
				this.markdownIt = new ((await import('markdown-it')).default);
			}
			const tokens = this.markdownIt.parse(text, {});
			const tokensAndPositions: TokenAndPosition[] = (function toTokensAndPositions(this: ExtensionLinter, tokens: MarkdownItType.Token[], begin = 0, end = text.length): TokenAndPosition[] {
				const tokensAndPositions = tokens.map<TokenAndPosition>(token => {
					if (token.map) {
						const tokenBegin = document.offsetAt(new Position(token.map[0], 0));
						const tokenEnd = begin = document.offsetAt(new Position(token.map[1], 0));
						return {
							token,
							begin: tokenBegin,
							end: tokenEnd
						};
					}
					const image = token.type === 'image' && this.locateToken(text, begin, end, token, token.attrGet('src'));
					const other = image || this.locateToken(text, begin, end, token, token.content);
					return other || {
						token,
						begin,
						end: begin
					};
				});
				return tokensAndPositions.concat(
					...tokensAndPositions.filter(tnp => tnp.token.children && tnp.token.children.length)
						.map(tnp => toTokensAndPositions.call(this, tnp.token.children, tnp.begin, tnp.end))
				);
			}).call(this, tokens);

			const diagnostics: Diagnostic[] = [];

			tokensAndPositions.filter(tnp => tnp.token.type === 'image' && tnp.token.attrGet('src'))
				.map(inp => {
					const src = inp.token.attrGet('src')!;
					const begin = text.indexOf(src, inp.begin);
					if (begin !== -1 && begin < inp.end) {
						this.addDiagnostics(diagnostics, document, begin, begin + src.length, src, Context.MARKDOWN, info);
					} else {
						const content = inp.token.content;
						const begin = text.indexOf(content, inp.begin);
						if (begin !== -1 && begin < inp.end) {
							this.addDiagnostics(diagnostics, document, begin, begin + content.length, src, Context.MARKDOWN, info);
						}
					}
				});

			let svgStart: Diagnostic;
			for (const tnp of tokensAndPositions) {
				if (tnp.token.type === 'text' && tnp.token.content) {
					if (!this.parse5) {
						this.parse5 = await import('parse5');
					}
					const parser = new this.parse5.SAXParser({ locationInfo: true });
					parser.on('startTag', (name, attrs, _selfClosing, location) => {
						if (name === 'img') {
							const src = attrs.find(a => a.name === 'src');
							if (src && src.value && location) {
								const begin = text.indexOf(src.value, tnp.begin + location.startOffset);
								if (begin !== -1 && begin < tnp.end) {
									this.addDiagnostics(diagnostics, document, begin, begin + src.value.length, src.value, Context.MARKDOWN, info);
								}
							}
						} else if (name === 'svg' && location) {
							const begin = tnp.begin + location.startOffset;
							const end = tnp.begin + location.endOffset;
							const range = new Range(document.positionAt(begin), document.positionAt(end));
							svgStart = new Diagnostic(range, embeddedSvgsNotValid, DiagnosticSeverity.Warning);
							diagnostics.push(svgStart);
						}
					});
					parser.on('endTag', (name, location) => {
						if (name === 'svg' && svgStart && location) {
							const end = tnp.begin + location.endOffset;
							svgStart.range = new Range(svgStart.range.start, document.positionAt(end));
						}
					});
					parser.write(tnp.token.content);
					parser.end();
				}
			}

			this.diagnosticsCollection.set(document.uri, diagnostics);
		}
	}

	private locateToken(text: string, begin: number, end: number, token: MarkdownItType.Token, content: string | null) {
		if (content) {
			const tokenBegin = text.indexOf(content, begin);
			if (tokenBegin !== -1) {
				const tokenEnd = tokenBegin + content.length;
				if (tokenEnd <= end) {
					begin = tokenEnd;
					return {
						token,
						begin: tokenBegin,
						end: tokenEnd
					};
				}
			}
		}
		return undefined;
	}

	private readPackageJsonInfo(folder: Uri, tree: JsonNode | undefined) {
		const engine = tree && findNodeAtLocation(tree, ['engines', 'vscode']);
		const parsedEngineVersion = engine?.type === 'string' ? normalizeVersion(parseVersion(engine.value)) : null;
		const repo = tree && findNodeAtLocation(tree, ['repository', 'url']);
		const uri = repo && parseUri(repo.value);
		const activationEvents = tree && parseImplicitActivationEvents(tree);

		const info: PackageJsonInfo = {
			isExtension: !!(engine && engine.type === 'string'),
			hasHttpsRepository: !!(repo && repo.type === 'string' && repo.value && uri && uri.scheme.toLowerCase() === 'https'),
			repository: uri!,
			implicitActivationEvents: activationEvents,
			engineVersion: parsedEngineVersion
		};
		const str = folder.toString();
		const oldInfo = this.folderToPackageJsonInfo[str];
		if (oldInfo && (oldInfo.isExtension !== info.isExtension || oldInfo.hasHttpsRepository !== info.hasHttpsRepository)) {
			this.packageJsonChanged(folder); // clears this.folderToPackageJsonInfo[str]
		}
		this.folderToPackageJsonInfo[str] = info;
		return info;
	}

	private async loadPackageJson(folder: Uri) {
		if (folder.scheme === 'git') { // #36236
			return undefined;
		}
		const file = folder.with({ path: path.posix.join(folder.path, 'package.json') });
		try {
			const fileContents = await workspace.fs.readFile(file); // #174888
			return parseTree(Buffer.from(fileContents).toString('utf-8'));
		} catch (err) {
			return undefined;
		}
	}

	private packageJsonChanged(folder: Uri) {
		delete this.folderToPackageJsonInfo[folder.toString()];
		const str = folder.toString().toLowerCase();
		workspace.textDocuments.filter(document => this.getUriFolder(document.uri).toString().toLowerCase() === str)
			.forEach(document => this.queueReadme(document));
	}

	private getUriFolder(uri: Uri) {
		return uri.with({ path: path.posix.dirname(uri.path) });
	}

	private addDiagnostics(diagnostics: Diagnostic[], document: TextDocument, begin: number, end: number, src: string, context: Context, info: PackageJsonInfo) {
		const hasScheme = /^\w[\w\d+.-]*:/.test(src);
		const uri = parseUri(src, info.repository ? info.repository.toString() : document.uri.toString());
		if (!uri) {
			return;
		}
		const scheme = uri.scheme.toLowerCase();

		if (hasScheme && scheme !== 'https' && scheme !== 'data') {
			const range = new Range(document.positionAt(begin), document.positionAt(end));
			diagnostics.push(new Diagnostic(range, httpsRequired, DiagnosticSeverity.Warning));
		}

		if (hasScheme && scheme === 'data') {
			const range = new Range(document.positionAt(begin), document.positionAt(end));
			diagnostics.push(new Diagnostic(range, dataUrlsNotValid, DiagnosticSeverity.Warning));
		}

		if (!hasScheme && !info.hasHttpsRepository && context !== Context.ICON) {
			const range = new Range(document.positionAt(begin), document.positionAt(end));
			const message = (() => {
				switch (context) {
					case Context.BADGE: return relativeBadgeUrlRequiresHttpsRepository;
					default: return relativeUrlRequiresHttpsRepository;
				}
			})();
			diagnostics.push(new Diagnostic(range, message, DiagnosticSeverity.Warning));
		}

		if (uri.path.toLowerCase().endsWith('.svg') && !isTrustedSVGSource(uri)) {
			const range = new Range(document.positionAt(begin), document.positionAt(end));
			diagnostics.push(new Diagnostic(range, svgsNotValid, DiagnosticSeverity.Warning));
		}
	}

	private clear(document: TextDocument) {
		this.diagnosticsCollection.delete(document.uri);
		this.packageJsonQ.delete(document);
	}

	public dispose() {
		this.disposables.forEach(d => d.dispose());
		this.disposables = [];
	}
}

function parseUri(src: string, base?: string, retry: boolean = true): Uri | null {
	try {
		const url = new URL(src, base);
		return Uri.parse(url.toString());
	} catch (err) {
		if (retry) {
			return parseUri(encodeURI(src), base, false);
		} else {
			return null;
		}
	}
}

function parseImplicitActivationEvents(tree: JsonNode): Set<string> {
	const activationEvents = new Set<string>();

	// commands
	const commands = findNodeAtLocation(tree, ['contributes', 'commands']);
	commands?.children?.forEach(child => {
		const command = findNodeAtLocation(child, ['command']);
		if (command && command.type === 'string') {
			activationEvents.add(`onCommand:${command.value}`);
		}
	});

	// authenticationProviders
	const authenticationProviders = findNodeAtLocation(tree, ['contributes', 'authentication']);
	authenticationProviders?.children?.forEach(child => {
		const id = findNodeAtLocation(child, ['id']);
		if (id && id.type === 'string') {
			activationEvents.add(`onAuthenticationRequest:${id.value}`);
		}
	});

	// languages
	const languageContributions = findNodeAtLocation(tree, ['contributes', 'languages']);
	languageContributions?.children?.forEach(child => {
		const id = findNodeAtLocation(child, ['id']);
		const configuration = findNodeAtLocation(child, ['configuration']);
		if (id && id.type === 'string' && configuration && configuration.type === 'string') {
			activationEvents.add(`onLanguage:${id.value}`);
		}
	});

	// customEditors
	const customEditors = findNodeAtLocation(tree, ['contributes', 'customEditors']);
	customEditors?.children?.forEach(child => {
		const viewType = findNodeAtLocation(child, ['viewType']);
		if (viewType && viewType.type === 'string') {
			activationEvents.add(`onCustomEditor:${viewType.value}`);
		}
	});

	// views
	const viewContributions = findNodeAtLocation(tree, ['contributes', 'views']);
	viewContributions?.children?.forEach(viewContribution => {
		const views = viewContribution.children?.find((node) => node.type === 'array');
		views?.children?.forEach(view => {
			const id = findNodeAtLocation(view, ['id']);
			if (id && id.type === 'string') {
				activationEvents.add(`onView:${id.value}`);
			}
		});
	});

	// walkthroughs
	const walkthroughs = findNodeAtLocation(tree, ['contributes', 'walkthroughs']);
	walkthroughs?.children?.forEach(child => {
		const id = findNodeAtLocation(child, ['id']);
		if (id && id.type === 'string') {
			activationEvents.add(`onWalkthrough:${id.value}`);
		}
	});

	// notebookRenderers
	const notebookRenderers = findNodeAtLocation(tree, ['contributes', 'notebookRenderer']);
	notebookRenderers?.children?.forEach(child => {
		const id = findNodeAtLocation(child, ['id']);
		if (id && id.type === 'string') {
			activationEvents.add(`onRenderer:${id.value}`);
		}
	});

	// terminalProfiles
	const terminalProfiles = findNodeAtLocation(tree, ['contributes', 'terminal', 'profiles']);
	terminalProfiles?.children?.forEach(child => {
		const id = findNodeAtLocation(child, ['id']);
		if (id && id.type === 'string') {
			activationEvents.add(`onTerminalProfile:${id.value}`);
		}
	});

	// terminalQuickFixes
	const terminalQuickFixes = findNodeAtLocation(tree, ['contributes', 'terminal', 'quickFixes']);
	terminalQuickFixes?.children?.forEach(child => {
		const id = findNodeAtLocation(child, ['id']);
		if (id && id.type === 'string') {
			activationEvents.add(`onTerminalQuickFixRequest:${id.value}`);
		}
	});

	// tasks
	const tasks = findNodeAtLocation(tree, ['contributes', 'taskDefinitions']);
	tasks?.children?.forEach(child => {
		const id = findNodeAtLocation(child, ['type']);
		if (id && id.type === 'string') {
			activationEvents.add(`onTaskType:${id.value}`);
		}
	});

	return activationEvents;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/extension-editing/src/jsonReconstruct.ts]---
Location: vscode-main/extensions/extension-editing/src/jsonReconstruct.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * This class has a very specific purpose:
 *
 *	It can return convert offset within a decoded JSON string to offset within the encoded JSON string.
 */
export class JsonStringScanner {
	private resultChars = 0;
	private pos = 0;

	/**
	 *
	 * @param text the encoded JSON string
	 * @param pos must not include ", ie must be `stringJSONNode.offset + 1`
	 */
	constructor(private readonly text: string, initialPos: number /* offset within `text` */) {
		this.pos = initialPos;
	}

	// note that we don't do bound checks here, because we know that the offset is within the string
	getOffsetInEncoded(offsetDecoded: number) {

		let start = this.pos;

		while (true) {
			if (this.resultChars > offsetDecoded) {
				return start;
			}

			const ch = this.text.charCodeAt(this.pos);

			if (ch === CharacterCodes.backslash) {
				start = this.pos;
				this.pos++;

				const ch2 = this.text.charCodeAt(this.pos++);
				switch (ch2) {
					case CharacterCodes.doubleQuote:
					case CharacterCodes.backslash:
					case CharacterCodes.slash:
					case CharacterCodes.b:
					case CharacterCodes.f:
					case CharacterCodes.n:
					case CharacterCodes.r:
					case CharacterCodes.t:
						this.resultChars += 1;
						break;
					case CharacterCodes.u: {
						const ch3 = this.scanHexDigits(4, true);
						if (ch3 >= 0) {
							this.resultChars += String.fromCharCode(ch3).length;
						}
						break;
					}
				}
				continue;
			}
			start = this.pos;
			this.pos++;
			this.resultChars++;
		}
	}

	scanHexDigits(count: number, exact?: boolean): number {
		let digits = 0;
		let value = 0;
		while (digits < count || !exact) {
			const ch = this.text.charCodeAt(this.pos);
			if (ch >= CharacterCodes._0 && ch <= CharacterCodes._9) {
				value = value * 16 + ch - CharacterCodes._0;
			}
			else if (ch >= CharacterCodes.A && ch <= CharacterCodes.F) {
				value = value * 16 + ch - CharacterCodes.A + 10;
			}
			else if (ch >= CharacterCodes.a && ch <= CharacterCodes.f) {
				value = value * 16 + ch - CharacterCodes.a + 10;
			}
			else {
				break;
			}
			this.pos++;
			digits++;
		}
		if (digits < count) {
			value = -1;
		}
		return value;
	}
}


const enum CharacterCodes {
	lineFeed = 0x0A,              // \n
	carriageReturn = 0x0D,        // \r

	space = 0x0020,   // " "

	_0 = 0x30,
	_1 = 0x31,
	_2 = 0x32,
	_3 = 0x33,
	_4 = 0x34,
	_5 = 0x35,
	_6 = 0x36,
	_7 = 0x37,
	_8 = 0x38,
	_9 = 0x39,

	a = 0x61,
	b = 0x62,
	c = 0x63,
	d = 0x64,
	e = 0x65,
	f = 0x66,
	g = 0x67,
	h = 0x68,
	i = 0x69,
	j = 0x6A,
	k = 0x6B,
	l = 0x6C,
	m = 0x6D,
	n = 0x6E,
	o = 0x6F,
	p = 0x70,
	q = 0x71,
	r = 0x72,
	s = 0x73,
	t = 0x74,
	u = 0x75,
	v = 0x76,
	w = 0x77,
	x = 0x78,
	y = 0x79,
	z = 0x7A,

	A = 0x41,
	B = 0x42,
	C = 0x43,
	D = 0x44,
	E = 0x45,
	F = 0x46,
	G = 0x47,
	H = 0x48,
	I = 0x49,
	J = 0x4A,
	K = 0x4B,
	L = 0x4C,
	M = 0x4D,
	N = 0x4E,
	O = 0x4F,
	P = 0x50,
	Q = 0x51,
	R = 0x52,
	S = 0x53,
	T = 0x54,
	U = 0x55,
	V = 0x56,
	W = 0x57,
	X = 0x58,
	Y = 0x59,
	Z = 0x5a,

	asterisk = 0x2A,              // *
	backslash = 0x5C,             // \
	closeBrace = 0x7D,            // }
	closeBracket = 0x5D,          // ]
	colon = 0x3A,                 // :
	comma = 0x2C,                 // ,
	dot = 0x2E,                   // .
	doubleQuote = 0x22,           // "
	minus = 0x2D,                 // -
	openBrace = 0x7B,             // {
	openBracket = 0x5B,           // [
	plus = 0x2B,                  // +
	slash = 0x2F,                 // /

	formFeed = 0x0C,              // \f
	tab = 0x09,                   // \t
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/extension-editing/src/packageDocumentHelper.ts]---
Location: vscode-main/extensions/extension-editing/src/packageDocumentHelper.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { getLocation, Location } from 'jsonc-parser';
import { implicitActivationEvent, redundantImplicitActivationEvent } from './constants';


export class PackageDocument {

	constructor(private document: vscode.TextDocument) { }

	public provideCompletionItems(position: vscode.Position, _token: vscode.CancellationToken): vscode.ProviderResult<vscode.CompletionItem[]> {
		const location = getLocation(this.document.getText(), this.document.offsetAt(position));

		if (location.path.length >= 2 && location.path[1] === 'configurationDefaults') {
			return this.provideLanguageOverridesCompletionItems(location, position);
		}

		return undefined;
	}

	public provideCodeActions(_range: vscode.Range, context: vscode.CodeActionContext, _token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeAction[]> {
		const codeActions: vscode.CodeAction[] = [];
		for (const diagnostic of context.diagnostics) {
			if (diagnostic.message === implicitActivationEvent || diagnostic.message === redundantImplicitActivationEvent) {
				const codeAction = new vscode.CodeAction(vscode.l10n.t("Remove activation event"), vscode.CodeActionKind.QuickFix);
				codeAction.edit = new vscode.WorkspaceEdit();
				const rangeForCharAfter = diagnostic.range.with(diagnostic.range.end, diagnostic.range.end.translate(0, 1));
				if (this.document.getText(rangeForCharAfter) === ',') {
					codeAction.edit.delete(this.document.uri, diagnostic.range.with(undefined, diagnostic.range.end.translate(0, 1)));
				} else {
					codeAction.edit.delete(this.document.uri, diagnostic.range);
				}
				codeActions.push(codeAction);
			}
		}
		return codeActions;
	}

	private provideLanguageOverridesCompletionItems(location: Location, position: vscode.Position): vscode.ProviderResult<vscode.CompletionItem[]> {
		let range = this.getReplaceRange(location, position);
		const text = this.document.getText(range);

		if (location.path.length === 2) {

			let snippet = '"[${1:language}]": {\n\t"$0"\n}';

			// Suggestion model word matching includes quotes,
			// hence exclude the starting quote from the snippet and the range
			// ending quote gets replaced
			if (text && text.startsWith('"')) {
				range = new vscode.Range(new vscode.Position(range.start.line, range.start.character + 1), range.end);
				snippet = snippet.substring(1);
			}

			return Promise.resolve([this.newSnippetCompletionItem({
				label: vscode.l10n.t("Language specific editor settings"),
				documentation: vscode.l10n.t("Override editor settings for language"),
				snippet,
				range
			})]);
		}

		if (location.path.length === 3 && location.previousNode && typeof location.previousNode.value === 'string' && location.previousNode.value.startsWith('[')) {

			// Suggestion model word matching includes starting quote and open sqaure bracket
			// Hence exclude them from the proposal range
			range = new vscode.Range(new vscode.Position(range.start.line, range.start.character + 2), range.end);

			return vscode.languages.getLanguages().then(languages => {
				return languages.map(l => {

					// Suggestion model word matching includes closed sqaure bracket and ending quote
					// Hence include them in the proposal to replace
					return this.newSimpleCompletionItem(l, range, '', l + ']"');
				});
			});
		}
		return Promise.resolve([]);
	}

	private getReplaceRange(location: Location, position: vscode.Position) {
		const node = location.previousNode;
		if (node) {
			const nodeStart = this.document.positionAt(node.offset), nodeEnd = this.document.positionAt(node.offset + node.length);
			if (nodeStart.isBeforeOrEqual(position) && nodeEnd.isAfterOrEqual(position)) {
				return new vscode.Range(nodeStart, nodeEnd);
			}
		}
		return new vscode.Range(position, position);
	}

	private newSimpleCompletionItem(text: string, range: vscode.Range, description?: string, insertText?: string): vscode.CompletionItem {
		const item = new vscode.CompletionItem(text);
		item.kind = vscode.CompletionItemKind.Value;
		item.detail = description;
		item.insertText = insertText ? insertText : text;
		item.range = range;
		return item;
	}

	private newSnippetCompletionItem(o: { label: string; documentation?: string; snippet: string; range: vscode.Range }): vscode.CompletionItem {
		const item = new vscode.CompletionItem(o.label);
		item.kind = vscode.CompletionItemKind.Value;
		item.documentation = o.documentation;
		item.insertText = new vscode.SnippetString(o.snippet);
		item.range = o.range;
		return item;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/fsharp/.vscodeignore]---
Location: vscode-main/extensions/fsharp/.vscodeignore

```text
test/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/fsharp/cgmanifest.json]---
Location: vscode-main/extensions/fsharp/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "ionide/ionide-fsgrammar",
					"repositoryUrl": "https://github.com/ionide/ionide-fsgrammar",
					"commitHash": "0cb968a4b8fdb2e0656b95342cdffbeff04a1248"
				}
			},
			"license": "MIT",
			"description": "The file syntaxes/fsharp.json was included from https://github.com/ionide/ionide-fsgrammar/blob/master/grammar/fsharp.json.",
			"version": "0.0.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/fsharp/language-configuration.json]---
Location: vscode-main/extensions/fsharp/language-configuration.json

```json
{
	"comments": {
		"lineComment": "//",
		"blockComment": [ "(*", "*)" ]
	},
	"brackets": [
		["{", "}"],
		["[", "]"],
		["(", ")"]
	],
	"autoClosingPairs": [
		{ "open": "{", "close": "}" },
		{ "open": "[", "close": "]" },
		{ "open": "(", "close": ")" },
		{ "open": "\"", "close": "\"", "notIn": ["string"] }
	],
	"surroundingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["\"", "\""],
		["'", "'"]
	],
	"folding": {
		"offSide": true,
		"markers": {
			"start": "^\\s*//\\s*#region\\b|^\\s*\\(\\*\\s*#region(.*)\\*\\)",
			"end": "^\\s*//\\s*#endregion\\b|^\\s*\\(\\*\\s*#endregion\\s*\\*\\)"
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/fsharp/package.json]---
Location: vscode-main/extensions/fsharp/package.json

```json
{
  "name": "fsharp",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "scripts": {
    "update-grammar": "node ../node_modules/vscode-grammar-updater/bin ionide/ionide-fsgrammar grammars/fsharp.json ./syntaxes/fsharp.tmLanguage.json"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "fsharp",
        "extensions": [
          ".fs",
          ".fsi",
          ".fsx",
          ".fsscript"
        ],
        "aliases": [
          "F#",
          "FSharp",
          "fsharp"
        ],
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "fsharp",
        "scopeName": "source.fsharp",
        "path": "./syntaxes/fsharp.tmLanguage.json"
      }
    ],
    "snippets": [
      {
        "language": "fsharp",
        "path": "./snippets/fsharp.code-snippets"
      }
    ],
    "configurationDefaults": {
      "[fsharp]": {
        "diffEditor.ignoreTrimWhitespace": false
      }
    }
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/fsharp/package.nls.json]---
Location: vscode-main/extensions/fsharp/package.nls.json

```json
{
	"displayName": "F# Language Basics",
	"description": "Provides snippets, syntax highlighting, bracket matching and folding in F# files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/fsharp/snippets/fsharp.code-snippets]---
Location: vscode-main/extensions/fsharp/snippets/fsharp.code-snippets

```text
{
	"Region Start": {
		"prefix": "#region",
		"body": [
			"//#region $0"
		],
		"description": "Folding Region Start"
	},
	"Region End": {
		"prefix": "#endregion",
		"body": [
			"//#endregion"
		],
		"description": "Folding Region End"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/fsharp/syntaxes/fsharp.tmLanguage.json]---
Location: vscode-main/extensions/fsharp/syntaxes/fsharp.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/ionide/ionide-fsgrammar/blob/master/grammars/fsharp.json",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/ionide/ionide-fsgrammar/commit/0cb968a4b8fdb2e0656b95342cdffbeff04a1248",
	"name": "fsharp",
	"scopeName": "source.fsharp",
	"patterns": [
		{
			"include": "#compiler_directives"
		},
		{
			"include": "#comments"
		},
		{
			"include": "#constants"
		},
		{
			"include": "#strings"
		},
		{
			"include": "#chars"
		},
		{
			"include": "#double_tick"
		},
		{
			"include": "#definition"
		},
		{
			"include": "#abstract_definition"
		},
		{
			"include": "#attributes"
		},
		{
			"include": "#modules"
		},
		{
			"include": "#anonymous_functions"
		},
		{
			"include": "#du_declaration"
		},
		{
			"include": "#record_declaration"
		},
		{
			"include": "#records"
		},
		{
			"include": "#strp_inlined"
		},
		{
			"include": "#keywords"
		},
		{
			"include": "#cexprs"
		},
		{
			"include": "#text"
		}
	],
	"repository": {
		"strp_inlined_body": {
			"patterns": [
				{
					"include": "#comments"
				},
				{
					"include": "#anonymous_functions"
				},
				{
					"match": "(\\^[[:alpha:]0-9'._]+)",
					"captures": {
						"1": {
							"name": "entity.name.type.fsharp"
						}
					}
				},
				{
					"name": "keyword.fsharp",
					"match": "\\b(and|when|or)\\b"
				},
				{
					"begin": "(\\()",
					"beginCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"end": "(\\))",
					"endCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"patterns": [
						{
							"include": "#strp_inlined_body"
						}
					]
				},
				{
					"match": "(static member|member)\\s*([[:alpha:]0-9'`<>^._]+|``[[:alpha:]0-9' <>^._]+``)\\s*(:)",
					"captures": {
						"1": {
							"name": "keyword.fsharp"
						},
						"2": {
							"name": "variable.fsharp"
						},
						"3": {
							"name": "keyword.symbol.fsharp"
						}
					}
				},
				{
					"include": "#compiler_directives"
				},
				{
					"include": "#constants"
				},
				{
					"include": "#strings"
				},
				{
					"include": "#chars"
				},
				{
					"include": "#double_tick"
				},
				{
					"include": "#keywords"
				},
				{
					"include": "#text"
				},
				{
					"include": "#definition"
				},
				{
					"include": "#attributes"
				},
				{
					"include": "#keywords"
				},
				{
					"include": "#cexprs"
				},
				{
					"include": "#text"
				}
			]
		},
		"strp_inlined": {
			"patterns": [
				{
					"begin": "(\\()",
					"beginCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"end": "(\\))",
					"endCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"patterns": [
						{
							"include": "#strp_inlined_body"
						}
					]
				}
			]
		},
		"generic_declaration": {
			"patterns": [
				{
					"comments": "SRTP syntax support",
					"begin": "(:)\\s*(\\()\\s*(static member|member)",
					"beginCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						},
						"2": {
							"name": "keyword.symbol.fsharp"
						},
						"3": {
							"name": "keyword.fsharp"
						}
					},
					"end": "(\\))",
					"endCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"patterns": [
						{
							"begin": "(\\()",
							"beginCaptures": {
								"1": {
									"name": "keyword.symbol.fsharp"
								}
							},
							"end": "(\\))",
							"endCaptures": {
								"1": {
									"name": "keyword.symbol.fsharp"
								}
							},
							"patterns": [
								{
									"include": "#member_declaration"
								}
							]
						},
						{
							"match": "(('|\\^)[[:alpha:]0-9'._]+)",
							"captures": {
								"1": {
									"name": "entity.name.type.fsharp"
								}
							}
						},
						{
							"include": "#variables"
						},
						{
							"include": "#keywords"
						}
					]
				},
				{
					"name": "keyword.fsharp",
					"match": "\\b(private|to|public|internal|function|yield!|yield|class|exception|match|delegate|of|new|in|as|if|then|else|elif|for|begin|end|inherit|do|let\\!|return\\!|return|interface|with|abstract|enum|member|try|finally|and|when|or|use|use\\!|struct|while|mutable|assert|base|done|downcast|downto|extern|fixed|global|lazy|upcast|not)(?!')\\b"
				},
				{
					"name": "keyword.symbol.fsharp",
					"match": ":"
				},
				{
					"include": "#constants"
				},
				{
					"match": "(('|\\^)[[:alpha:]0-9'._]+)",
					"captures": {
						"1": {
							"name": "entity.name.type.fsharp"
						}
					}
				},
				{
					"begin": "(<)",
					"end": "(>)",
					"beginCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"endCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"patterns": [
						{
							"match": "(('|\\^)[[:alpha:]0-9'._]+)",
							"captures": {
								"1": {
									"name": "entity.name.type.fsharp"
								}
							}
						},
						{
							"include": "#tuple_signature"
						},
						{
							"include": "#generic_declaration"
						}
					]
				},
				{
					"begin": "(\\()",
					"end": "(\\))",
					"beginCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"endCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"patterns": [
						{
							"match": "(([?[:alpha:]0-9'`^._ ]+))+",
							"captures": {
								"1": {
									"name": "entity.name.type.fsharp"
								}
							}
						},
						{
							"include": "#tuple_signature"
						}
					]
				},
				{
					"match": "(?!when|and|or\\b)\\b([\\w0-9'`^._]+)",
					"comments": "Here we need the \\w modifier in order to check that the words are allowed",
					"captures": {
						"1": {
							"name": "entity.name.type.fsharp"
						}
					}
				},
				{
					"match": "(\\|)",
					"comments": "Prevent captures of `|>` as a keyword when defining custom operator like `<|>`",
					"captures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					}
				},
				{
					"include": "#keywords"
				}
			]
		},
		"anonymous_record_declaration": {
			"begin": "(\\{\\|)",
			"end": "(\\|\\})",
			"beginCaptures": {
				"1": {
					"name": "keyword.symbol.fsharp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.symbol.fsharp"
				}
			},
			"patterns": [
				{
					"match": "[[:alpha:]0-9'`^_ ]+(:)",
					"captures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					}
				},
				{
					"match": "([[:alpha:]0-9'`^_ ]+)",
					"captures": {
						"1": {
							"name": "entity.name.type.fsharp"
						}
					}
				},
				{
					"include": "#anonymous_record_declaration"
				},
				{
					"include": "#keywords"
				}
			]
		},
		"record_signature": {
			"patterns": [
				{
					"match": "[[:alpha:]0-9'`^_ ]+(=)([[:alpha:]0-9'`^_ ]+)",
					"captures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						},
						"2": {
							"name": "variable.parameter.fsharp"
						}
					}
				},
				{
					"begin": "({)",
					"end": "(})",
					"beginCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"endCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"patterns": [
						{
							"match": "[[:alpha:]0-9'`^_ ]+(=)([[:alpha:]0-9'`^_ ]+)",
							"captures": {
								"1": {
									"name": "keyword.symbol.fsharp"
								},
								"2": {
									"name": "variable.parameter.fsharp"
								}
							}
						},
						{
							"include": "#record_signature"
						}
					]
				},
				{
					"include": "#keywords"
				}
			]
		},
		"tuple_signature": {
			"patterns": [
				{
					"match": "(([?[:alpha:]0-9'`^._ ]+))+",
					"captures": {
						"1": {
							"name": "entity.name.type.fsharp"
						}
					}
				},
				{
					"begin": "(\\()",
					"end": "(\\))",
					"beginCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"endCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"patterns": [
						{
							"match": "(([?[:alpha:]0-9'`^._ ]+))+",
							"captures": {
								"1": {
									"name": "entity.name.type.fsharp"
								}
							}
						},
						{
							"include": "#tuple_signature"
						}
					]
				},
				{
					"include": "#keywords"
				}
			]
		},
		"anonymous_functions": {
			"patterns": [
				{
					"name": "function.anonymous",
					"begin": "\\b(fun)\\b",
					"end": "(->)",
					"beginCaptures": {
						"1": {
							"name": "keyword.fsharp"
						}
					},
					"endCaptures": {
						"1": {
							"name": "keyword.symbol.arrow.fsharp"
						}
					},
					"patterns": [
						{
							"include": "#comments"
						},
						{
							"begin": "(\\()",
							"end": "\\s*(?=(->))",
							"beginCaptures": {
								"1": {
									"name": "keyword.symbol.fsharp"
								}
							},
							"endCaptures": {
								"1": {
									"name": "keyword.symbol.arrow.fsharp"
								}
							},
							"patterns": [
								{
									"include": "#member_declaration"
								}
							]
						},
						{
							"include": "#variables"
						}
					]
				}
			]
		},
		"attributes": {
			"patterns": [
				{
					"name": "support.function.attribute.fsharp",
					"begin": "\\[\\<",
					"end": "\\>\\]|\\]",
					"patterns": [
						{
							"include": "$self"
						}
					]
				}
			]
		},
		"comments": {
			"patterns": [
				{
					"name": "comment.block.markdown.fsharp",
					"begin": "^\\s*(\\(\\*\\*(?!\\)))((?!\\*\\)).)*$",
					"while": "^(?!\\s*(\\*)+\\)\\s*$)",
					"beginCaptures": {
						"1": {
							"name": "comment.block.fsharp"
						}
					},
					"whileCaptures": {
						"1": {
							"name": "comment.block.fsharp"
						}
					},
					"patterns": [
						{
							"include": "text.html.markdown"
						}
					]
				},
				{
					"name": "comment.block.fsharp",
					"begin": "(\\(\\*(?!\\)))",
					"end": "(\\*+\\))",
					"beginCaptures": {
						"1": {
							"name": "comment.block.fsharp"
						}
					},
					"endCaptures": {
						"1": {
							"name": "comment.block.fsharp"
						}
					},
					"patterns": [
						{
							"comments": "Capture // when inside of (* *) like that the rule which capture comments starting by // is not trigger. See https://github.com/ionide/ionide-fsgrammar/issues/155",
							"name": "fast-capture.comment.line.double-slash.fsharp",
							"match": "//"
						},
						{
							"comments": "Capture (*) when inside of (* *) so that it doesn't prematurely end the comment block.",
							"name": "fast-capture.comment.line.mul-operator.fsharp",
							"match": "\\(\\*\\)"
						},
						{
							"include": "#comments"
						}
					]
				},
				{
					"name": "comment.block.markdown.fsharp.end",
					"match": "((?<!\\()(\\*)+\\))",
					"captures": {
						"1": {
							"name": "comment.block.fsharp"
						}
					}
				},
				{
					"name": "comment.line.markdown.fsharp",
					"begin": "(?<![!%&+-.<=>?@^|/])///(?!/)",
					"while": "(?<![!%&+-.<=>?@^|/])///(?!/)",
					"patterns": [
						{
							"include": "text.html.markdown"
						}
					]
				},
				{
					"name": "comment.line.double-slash.fsharp",
					"match": "(?<![!%&+-.<=>?@^|/])//(.*$)"
				}
			]
		},
		"constants": {
			"patterns": [
				{
					"name": "keyword.symbol.fsharp",
					"match": "\\(\\)"
				},
				{
					"name": "constant.numeric.float.fsharp",
					"match": "\\b-?[0-9][0-9_]*((\\.(?!\\.)([0-9][0-9_]*([eE][+-]??[0-9][0-9_]*)?)?)|([eE][+-]??[0-9][0-9_]*))"
				},
				{
					"name": "constant.numeric.integer.nativeint.fsharp",
					"match": "\\b(-?((0(x|X)[0-9a-fA-F][0-9a-fA-F_]*)|(0(o|O)[0-7][0-7_]*)|(0(b|B)[01][01_]*)|([0-9][0-9_]*)))"
				},
				{
					"name": "constant.language.boolean.fsharp",
					"match": "\\b(true|false)\\b"
				},
				{
					"name": "constant.other.fsharp",
					"match": "\\b(null|void)\\b"
				}
			]
		},
		"abstract_definition": {
			"name": "abstract.definition.fsharp",
			"begin": "\\b(static\\s+)?(abstract)\\s+(member)?(\\s+\\[\\<.*\\>\\])?\\s*([_[:alpha:]0-9,\\._`\\s]+)(<)?",
			"end": "\\s*(with)\\b|=|$",
			"beginCaptures": {
				"1": {
					"name": "keyword.fsharp"
				},
				"2": {
					"name": "keyword.fsharp"
				},
				"3": {
					"name": "keyword.fsharp"
				},
				"4": {
					"name": "support.function.attribute.fsharp"
				},
				"5": {
					"name": "keyword.symbol.fsharp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.fsharp"
				}
			},
			"patterns": [
				{
					"include": "#comments"
				},
				{
					"include": "#common_declaration"
				},
				{
					"match": "(\\?{0,1})([[:alpha:]0-9'`^._ ]+)\\s*(:)((?!with\\b)\\b([\\w0-9'`^._ ]+)){0,1}",
					"captures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						},
						"2": {
							"name": "variable.parameter.fsharp"
						},
						"3": {
							"name": "keyword.symbol.fsharp"
						},
						"4": {
							"name": "entity.name.type.fsharp"
						}
					}
				},
				{
					"match": "(?!with|get|set\\b)\\s*([\\w0-9'`^._]+)",
					"comments": "Here we need the \\w modifier in order to check that the words isn't blacklisted",
					"captures": {
						"1": {
							"name": "entity.name.type.fsharp"
						}
					}
				},
				{
					"include": "#keywords"
				}
			]
		},
		"common_binding_definition": {
			"patterns": [
				{
					"include": "#comments"
				},
				{
					"include": "#attributes"
				},
				{
					"comments": "SRTP syntax support",
					"begin": "(:)\\s*(\\()\\s*(static member|member)",
					"beginCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						},
						"2": {
							"name": "keyword.symbol.fsharp"
						},
						"3": {
							"name": "keyword.fsharp"
						}
					},
					"end": "(\\))\\s*((?=,)|(?=\\=))",
					"endCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"patterns": [
						{
							"match": "(\\^[[:alpha:]0-9'._]+)",
							"captures": {
								"1": {
									"name": "entity.name.type.fsharp"
								}
							}
						},
						{
							"include": "#variables"
						},
						{
							"include": "#keywords"
						}
					]
				},
				{
					"begin": "(:)\\s*(\\()",
					"beginCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						},
						"2": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"end": "(\\)\\s*(([?[:alpha:]0-9'`^._ ]*)))",
					"endCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						},
						"2": {
							"name": "entity.name.type.fsharp"
						}
					},
					"patterns": [
						{
							"include": "#tuple_signature"
						}
					]
				},
				{
					"begin": "(:)\\s*(\\^[[:alpha:]0-9'._]+)\\s*(when)",
					"beginCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						},
						"2": {
							"name": "entity.name.type.fsharp"
						},
						"3": {
							"name": "keyword.fsharp"
						}
					},
					"end": "(?=:)",
					"endCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"patterns": [
						{
							"name": "keyword.fsharp",
							"match": "\\b(and|when|or)\\b"
						},
						{
							"comment": "Because we first capture the keywords, we can capture what looks like a word and assume it's an entity definition",
							"match": "([[:alpha:]0-9'^._]+)",
							"captures": {
								"1": {
									"name": "entity.name.type.fsharp"
								}
							}
						},
						{
							"name": "keyword.symbol.fsharp",
							"match": "(\\(|\\))"
						}
					]
				},
				{
					"match": "(:)\\s*([?[:alpha:]0-9'`^._ ]+)(\\|\\s*(null))?",
					"captures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						},
						"2": {
							"name": "entity.name.type.fsharp"
						},
						"4": {
							"name": "entity.name.type.fsharp"
						}
					}
				},
				{
					"match": "(->)\\s*(\\()?\\s*([?[:alpha:]0-9'`^._ ]+)*",
					"captures": {
						"1": {
							"name": "keyword.symbol.arrow.fsharp"
						},
						"2": {
							"name": "keyword.symbol.fsharp"
						},
						"3": {
							"name": "entity.name.type.fsharp"
						}
					}
				},
				{
					"begin": "(\\*)\\s*(\\()",
					"beginCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						},
						"2": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"end": "(\\)\\s*(([?[:alpha:]0-9'`^._ ]+))*)",
					"endCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						},
						"2": {
							"name": "entity.name.type.fsharp"
						}
					},
					"patterns": [
						{
							"include": "#tuple_signature"
						}
					]
				},
				{
					"begin": "(\\*)(\\s*([?[:alpha:]0-9'`^._ ]+))*",
					"beginCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						},
						"2": {
							"name": "entity.name.type.fsharp"
						}
					},
					"end": "(?==)|(?=\\))",
					"endCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"patterns": [
						{
							"include": "#tuple_signature"
						}
					]
				},
				{
					"begin": "(<+(?![[:space:]]*\\)))",
					"beginComment": "The group (?![[:space:]]*\\) is for protection against overload operator. static member (<)",
					"end": "((?<!:)>|\\))",
					"endComment": "The group (?<!:) prevent us from stopping on :> when using SRTP synthax",
					"beginCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"endCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"patterns": [
						{
							"include": "#generic_declaration"
						}
					]
				},
				{
					"include": "#anonymous_record_declaration"
				},
				{
					"begin": "({)",
					"end": "(})",
					"beginCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"endCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"patterns": [
						{
							"include": "#record_signature"
						}
					]
				},
				{
					"include": "#definition"
				},
				{
					"include": "#variables"
				},
				{
					"include": "#keywords"
				}
			]
		},
		"definition": {
			"patterns": [
				{
					"name": "binding.fsharp",
					"begin": "\\b(let mutable|static let mutable|static let|let inline|let|and inline|and|member val|member inline|static member inline|static member val|static member|default|member|override|let!)(\\s+rec|mutable)?(\\s+\\[\\<.*\\>\\])?\\s*(private|internal|public)?\\s+(\\[[^-=]*\\]|[_[:alpha:]]([_[:alpha:]0-9\\._]+)*|``[_[:alpha:]]([_[:alpha:]0-9\\._`\\s]+|(?<=,)\\s)*)?",
					"end": "\\s*((with inline|with)\\b|(=|\\n+=|(?<=\\=)))",
					"beginCaptures": {
						"1": {
							"name": "keyword.fsharp"
						},
						"2": {
							"name": "keyword.fsharp"
						},
						"3": {
							"name": "support.function.attribute.fsharp"
						},
						"4": {
							"name": "storage.modifier.fsharp"
						},
						"5": {
							"name": "variable.fsharp"
						}
					},
					"endCaptures": {
						"2": {
							"name": "keyword.fsharp"
						},
						"3": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"patterns": [
						{
							"include": "#common_binding_definition"
						}
					]
				},
				{
					"name": "binding.fsharp",
					"begin": "\\b(use|use!|and|and!)\\s+(\\[[^-=]*\\]|[_[:alpha:]]([_[:alpha:]0-9\\._]+)*|``[_[:alpha:]]([_[:alpha:]0-9\\._`\\s]+|(?<=,)\\s)*)?",
					"end": "\\s*(=)",
					"beginCaptures": {
						"1": {
							"name": "keyword.fsharp"
						}
					},
					"endCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"patterns": [
						{
							"include": "#common_binding_definition"
						}
					]
				},
				{
					"name": "binding.fsharp",
					"begin": "(?<=with|and)\\s*\\b((get|set)\\s*(?=\\())(\\[[^-=]*\\]|[_[:alpha:]]([_[:alpha:]0-9\\._]+)*|``[_[:alpha:]]([_[:alpha:]0-9\\._`\\s]+|(?<=,)\\s)*)?",
					"end": "\\s*(=|\\n+=|(?<=\\=))",
					"beginCaptures": {
						"4": {
							"name": "variable.fsharp"
						}
					},
					"endCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"patterns": [
						{
							"include": "#common_binding_definition"
						}
					]
				},
				{
					"name": "binding.fsharp",
					"begin": "\\b(static val mutable|val mutable|val inline|val)(\\s+rec|mutable)?(\\s+\\[\\<.*\\>\\])?\\s*(private|internal|public)?\\s+(\\[[^-=]*\\]|[_[:alpha:]]([_[:alpha:]0-9,\\._]+)*|``[_[:alpha:]]([_[:alpha:]0-9,\\._`\\s]+|(?<=,)\\s)*)?",
					"end": "\\n$",
					"beginCaptures": {
						"1": {
							"name": "keyword.fsharp"
						},
						"2": {
							"name": "keyword.fsharp"
						},
						"3": {
							"name": "support.function.attribute.fsharp"
						},
						"4": {
							"name": "storage.modifier.fsharp"
						},
						"5": {
							"name": "variable.fsharp"
						}
					},
					"patterns": [
						{
							"include": "#common_binding_definition"
						}
					]
				},
				{
					"name": "binding.fsharp",
					"begin": "\\b(new)\\b\\s+(\\()",
					"end": "(\\))",
					"beginCaptures": {
						"1": {
							"name": "keyword.fsharp"
						},
						"2": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"endCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"patterns": [
						{
							"include": "#common_binding_definition"
						}
					]
				}
			]
		},
		"du_declaration": {
			"patterns": [
				{
					"name": "du_declaration.fsharp",
					"begin": "\\b(of)\\b",
					"end": "$|(\\|)",
					"beginCaptures": {
						"1": {
							"name": "keyword.fsharp"
						}
					},
					"endCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"patterns": [
						{
							"include": "#comments"
						},
						{
							"match": "([[:alpha:]0-9'`<>^._]+|``[[:alpha:]0-9' <>^._]+``)\\s*(:)\\s*([[:alpha:]0-9'`<>^._]+|``[[:alpha:]0-9' <>^._]+``)",
							"captures": {
								"1": {
									"name": "variable.parameter.fsharp"
								},
								"2": {
									"name": "keyword.symbol.fsharp"
								},
								"3": {
									"name": "entity.name.type.fsharp"
								}
							}
						},
						{
							"match": "(``([[:alpha:]0-9'^._ ]+)``|[[:alpha:]0-9'`^._]+)",
							"captures": {
								"1": {
									"name": "entity.name.type.fsharp"
								}
							}
						},
						{
							"include": "#anonymous_record_declaration"
						},
						{
							"include": "#keywords"
						}
					]
				}
			]
		},
		"keywords": {
			"patterns": [
				{
					"name": "storage.modifier",
					"match": "\\b(private|public|internal)\\b"
				},
				{
					"name": "keyword.fsharp",
					"match": "\\b(private|to|public|internal|function|class|exception|delegate|of|new|as|begin|end|inherit|let!|interface|abstract|enum|member|and|when|or|use|use\\!|struct|mutable|assert|base|done|downcast|downto|extern|fixed|global|lazy|upcast|not)(?!')\\b"
				},
				{
					"name": "keyword.control",
					"match": "\\b(match|yield|yield!|with|if|then|else|elif|for|in|return!|return|try|finally|while|do)(?!')\\b"
				},
				{
					"name": "keyword.symbol.arrow.fsharp",
					"match": "(\\->|\\<\\-)"
				},
				{
					"name": "keyword.symbol.fsharp",
					"match": "[.?]*(&&&|\\|\\|\\||\\^\\^\\^|~~~|~\\+|~\\-|<<<|>>>|\\|>|:>|:\\?>|:|\\[|\\]|\\;|<>|=|@|\\|\\||&&|&|%|{|}|\\||_|\\.\\.|\\,|\\+|\\-|\\*|\\/|\\^|\\!|\\>|\\>\\=|\\>\\>|\\<|\\<\\=|\\(|\\)|\\<\\<)[.?]*"
				}
			]
		},
		"modules": {
			"patterns": [
				{
					"name": "entity.name.section.fsharp",
					"begin": "\\b(namespace global)|\\b(namespace|module)\\s*(public|internal|private|rec)?\\s+([[:alpha:]|``][[:alpha:]0-9'_. ]*)",
					"end": "(\\s?=|\\s|$)",
					"beginCaptures": {
						"1": {
							"name": "keyword.fsharp"
						},
						"2": {
							"name": "keyword.fsharp"
						},
						"3": {
							"name": "storage.modifier.fsharp"
						},
						"4": {
							"name": "entity.name.section.fsharp"
						}
					},
					"endCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"patterns": [
						{
							"name": "entity.name.section.fsharp",
							"match": "(\\.)([A-Z][[:alpha:]0-9'_]*)",
							"captures": {
								"1": {
									"name": "punctuation.separator.namespace-reference.fsharp"
								},
								"2": {
									"name": "entity.name.section.fsharp"
								}
							}
						}
					]
				},
				{
					"name": "namespace.open.fsharp",
					"begin": "\\b(open type|open)\\s+([[:alpha:]|``][[:alpha:]0-9'_]*)(?=(\\.[A-Z][[:alpha:]0-9_]*)*)",
					"end": "(\\s|$)",
					"beginCaptures": {
						"1": {
							"name": "keyword.fsharp"
						},
						"2": {
							"name": "entity.name.section.fsharp"
						}
					},
					"patterns": [
						{
							"name": "entity.name.section.fsharp",
							"match": "(\\.)([[:alpha:]][[:alpha:]0-9'_]*)",
							"captures": {
								"1": {
									"name": "punctuation.separator.namespace-reference.fsharp"
								},
								"2": {
									"name": "entity.name.section.fsharp"
								}
							}
						},
						{
							"include": "#comments"
						}
					]
				},
				{
					"name": "namespace.alias.fsharp",
					"begin": "^\\s*(module)\\s+([A-Z][[:alpha:]0-9'_]*)\\s*(=)\\s*([A-Z][[:alpha:]0-9'_]*)",
					"end": "(\\s|$)",
					"beginCaptures": {
						"1": {
							"name": "keyword.fsharp"
						},
						"2": {
							"name": "entity.name.type.namespace.fsharp"
						},
						"3": {
							"name": "keyword.symbol.fsharp"
						},
						"4": {
							"name": "entity.name.section.fsharp"
						}
					},
					"patterns": [
						{
							"name": "entity.name.section.fsharp",
							"match": "(\\.)([A-Z][[:alpha:]0-9'_]*)",
							"captures": {
								"1": {
									"name": "punctuation.separator.namespace-reference.fsharp"
								},
								"2": {
									"name": "entity.name.section.fsharp"
								}
							}
						}
					]
				}
			]
		},
		"strings": {
			"patterns": [
				{
					"name": "string.quoted.literal.fsharp",
					"begin": "(?=[^\\\\])(@\")",
					"end": "(\")(?!\")",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.string.begin.fsharp"
						}
					},
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.string.end.fsharp"
						}
					},
					"patterns": [
						{
							"name": "constant.character.string.escape.fsharp",
							"match": "\"(\")"
						}
					]
				},
				{
					"name": "string.quoted.triple.fsharp",
					"begin": "(?=[^\\\\])(\"\"\")",
					"end": "(\"\"\")",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.string.begin.fsharp"
						}
					},
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.string.end.fsharp"
						}
					},
					"patterns": [
						{
							"include": "#string_formatter"
						}
					]
				},
				{
					"name": "string.quoted.double.fsharp",
					"begin": "(?=[^\\\\])(\")",
					"end": "(\")",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.string.begin.fsharp"
						}
					},
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.string.end.fsharp"
						}
					},
					"patterns": [
						{
							"name": "punctuation.separator.string.ignore-eol.fsharp",
							"match": "\\\\$[ \\t]*"
						},
						{
							"name": "constant.character.string.escape.fsharp",
							"match": "\\\\(['\"\\\\abfnrtv]|([01][0-9][0-9]|2[0-4][0-9]|25[0-5])|(x[0-9a-fA-F]{2})|(u[0-9a-fA-F]{4})|(U00(0[0-9a-fA-F]|10)[0-9a-fA-F]{4}))"
						},
						{
							"name": "invalid.illegal.character.string.fsharp",
							"match": "\\\\(([0-9]{1,3})|(x[^\\s]{0,2})|(u[^\\s]{0,4})|(U[^\\s]{0,8})|[^\\s])"
						},
						{
							"include": "#string_formatter"
						}
					]
				}
			]
		},
		"string_formatter": {
			"patterns": [
				{
					"name": "entity.name.type.format.specifier.fsharp",
					"match": "(%0?-?(\\d+)?((a|t)|(\\.\\d+)?(f|F|e|E|g|G|M)|(b|c|s|d|i|x|X|o|u)|(s|b|O)|(\\+?A)))",
					"captures": {
						"1": {
							"name": "keyword.format.specifier.fsharp"
						}
					}
				}
			]
		},
		"variables": {
			"patterns": [
				{
					"name": "keyword.symbol.fsharp",
					"match": "\\(\\)"
				},
				{
					"match": "(\\?{0,1})(``[[:alpha:]0-9'`^:,._ ]+``|(?!private|struct\\b)\\b[\\w[:alpha:]0-9'`<>^._ ]+)",
					"captures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						},
						"2": {
							"name": "variable.parameter.fsharp"
						}
					}
				}
			]
		},
		"common_declaration": {
			"patterns": [
				{
					"begin": "\\s*(->)\\s*([[:alpha:]0-9'`^._ ]+)(<)",
					"end": "(>)",
					"beginCaptures": {
						"1": {
							"name": "keyword.symbol.arrow.fsharp"
						},
						"2": {
							"name": "entity.name.type.fsharp"
						},
						"3": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"endCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"patterns": [
						{
							"match": "([[:alpha:]0-9'`^._ ]+)",
							"captures": {
								"1": {
									"name": "entity.name.type.fsharp"
								}
							}
						},
						{
							"include": "#keywords"
						}
					]
				},
				{
					"match": "\\s*(->)\\s*(?!with|get|set\\b)\\b([\\w0-9'`^._]+)",
					"captures": {
						"1": {
							"name": "keyword.symbol.arrow.fsharp"
						},
						"2": {
							"name": "entity.name.type.fsharp"
						}
					}
				},
				{
					"include": "#anonymous_record_declaration"
				},
				{
					"begin": "(\\?{0,1})([[:alpha:]0-9'`^._ ]+)\\s*(:)(\\s*([?[:alpha:]0-9'`^._ ]+)(<))",
					"end": "(>)",
					"beginCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						},
						"2": {
							"name": "variable.parameter.fsharp"
						},
						"3": {
							"name": "keyword.symbol.fsharp"
						},
						"4": {
							"name": "keyword.symbol.fsharp"
						},
						"5": {
							"name": "entity.name.type.fsharp"
						}
					},
					"endCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"patterns": [
						{
							"match": "([[:alpha:]0-9'`^._ ]+)",
							"captures": {
								"1": {
									"name": "entity.name.type.fsharp"
								}
							}
						},
						{
							"include": "#keywords"
						}
					]
				}
			]
		},
		"member_declaration": {
			"patterns": [
				{
					"include": "#comments"
				},
				{
					"include": "#common_declaration"
				},
				{
					"comments": "SRTP syntax support",
					"begin": "(:)\\s*(\\()\\s*(static member|member)",
					"beginCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						},
						"2": {
							"name": "keyword.symbol.fsharp"
						},
						"3": {
							"name": "keyword.fsharp"
						}
					},
					"end": "(\\))\\s*((?=,)|(?=\\=))",
					"endCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"patterns": [
						{
							"begin": "(\\()",
							"beginCaptures": {
								"1": {
									"name": "keyword.symbol.fsharp"
								}
							},
							"end": "(\\))",
							"endCaptures": {
								"1": {
									"name": "keyword.symbol.fsharp"
								}
							},
							"patterns": [
								{
									"include": "#member_declaration"
								}
							]
						},
						{
							"match": "(\\^[[:alpha:]0-9'._]+)",
							"captures": {
								"1": {
									"name": "entity.name.type.fsharp"
								}
							}
						},
						{
							"include": "#variables"
						},
						{
							"include": "#keywords"
						}
					]
				},
				{
					"match": "(\\^[[:alpha:]0-9'._]+)",
					"captures": {
						"1": {
							"name": "entity.name.type.fsharp"
						}
					}
				},
				{
					"name": "keyword.fsharp",
					"match": "\\b(and|when|or)\\b"
				},
				{
					"name": "keyword.symbol.fsharp",
					"match": "(\\(|\\))"
				},
				{
					"match": "(\\?{0,1})([[:alpha:]0-9'`^._]+|``[[:alpha:]0-9'`^:,._ ]+``)\\s*(:{0,1})(\\s*([?[:alpha:]0-9'`<>._ ]+)){0,1}(\\|\\s*(null))?",
					"captures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						},
						"2": {
							"name": "variable.parameter.fsharp"
						},
						"3": {
							"name": "keyword.symbol.fsharp"
						},
						"4": {
							"name": "entity.name.type.fsharp"
						},
						"7": {
							"name": "entity.name.type.fsharp"
						}
					}
				},
				{
					"include": "#keywords"
				}
			]
		},
		"double_tick": {
			"patterns": [
				{
					"name": "variable.other.binding.fsharp",
					"match": "(``)([^`]*)(``)",
					"captures": {
						"1": {
							"name": "string.quoted.single.fsharp"
						},
						"2": {
							"name": "variable.other.binding.fsharp"
						},
						"3": {
							"name": "string.quoted.single.fsharp"
						}
					}
				}
			]
		},
		"records": {
			"patterns": [
				{
					"name": "record.fsharp",
					"begin": "\\b(type)[\\s]+(private|internal|public)?\\s*",
					"end": "\\s*((with)|((as)\\s+([[:alpha:]0-9']+))|(=)|[\\n=]|(\\(\\)))",
					"beginCaptures": {
						"1": {
							"name": "keyword.fsharp"
						},
						"2": {
							"name": "storage.modifier.fsharp"
						}
					},
					"endCaptures": {
						"2": {
							"name": "keyword.fsharp"
						},
						"3": {
							"name": "keyword.fsharp"
						},
						"4": {
							"name": "keyword.fsharp"
						},
						"5": {
							"name": "variable.parameter.fsharp"
						},
						"6": {
							"name": "keyword.symbol.fsharp"
						},
						"7": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"patterns": [
						{
							"include": "#comments"
						},
						{
							"include": "#attributes"
						},
						{
							"match": "([[:alpha:]0-9'^._]+|``[[:alpha:]0-9'`^:,._ ]+``)",
							"captures": {
								"1": {
									"name": "entity.name.type.fsharp"
								}
							}
						},
						{
							"begin": "(<)",
							"end": "((?<!:)>)",
							"beginCaptures": {
								"1": {
									"name": "keyword.symbol.fsharp"
								}
							},
							"endCaptures": {
								"1": {
									"name": "keyword.symbol.fsharp"
								}
							},
							"patterns": [
								{
									"match": "(('|\\^)``[[:alpha:]0-9`^:,._ ]+``|('|\\^)[[:alpha:]0-9`^:._]+)",
									"captures": {
										"1": {
											"name": "entity.name.type.fsharp"
										}
									}
								},
								{
									"name": "keyword.fsharp",
									"match": "\\b(interface|with|abstract|and|when|or|not|struct|equality|comparison|unmanaged|delegate|enum)\\b"
								},
								{
									"begin": "(\\()",
									"end": "(\\))",
									"beginCaptures": {
										"1": {
											"name": "keyword.symbol.fsharp"
										}
									},
									"endCaptures": {
										"1": {
											"name": "keyword.symbol.fsharp"
										}
									},
									"patterns": [
										{
											"match": "(static member|member|new)",
											"captures": {
												"1": {
													"name": "keyword.fsharp"
												}
											}
										},
										{
											"include": "#common_binding_definition"
										}
									]
								},
								{
									"match": "([\\w0-9'`^._]+)",
									"comments": "Here we need the \\w modifier in order to check that the words isn't blacklisted",
									"captures": {
										"1": {
											"name": "entity.name.type.fsharp"
										}
									}
								},
								{
									"include": "#keywords"
								}
							]
						},
						{
							"match": "\\s*(private|internal|public)",
							"captures": {
								"1": {
									"name": "storage.modifier.fsharp"
								}
							}
						},
						{
							"begin": "(\\()",
							"end": "\\s*(?=(=)|[\\n=]|(\\(\\))|(as))",
							"beginCaptures": {
								"1": {
									"name": "keyword.symbol.fsharp"
								}
							},
							"endCaptures": {
								"1": {
									"name": "keyword.symbol.fsharp"
								}
							},
							"patterns": [
								{
									"include": "#member_declaration"
								}
							]
						},
						{
							"include": "#keywords"
						}
					]
				}
			]
		},
		"record_declaration": {
			"patterns": [
				{
					"begin": "(\\{)",
					"beginCaptures": {
						"1": {
							"name": "keyword.symbol.fsharp"
						}
					},
					"end": "(?<=\\})",
					"patterns": [
						{
							"include": "#comments"
						},
						{
							"begin": "(((mutable)\\s[[:alpha:]]+)|[[:alpha:]0-9'`<>^._]*)\\s*((?<!:):(?!:))\\s*",
							"beginCaptures": {
								"3": {
									"name": "keyword.fsharp"
								},
								"4": {
									"name": "keyword.symbol.fsharp"
								}
							},
							"end": "$|(;|\\})",
							"endCaptures": {
								"1": {
									"name": "keyword.symbol.fsharp"
								}
							},
							"patterns": [
								{
									"include": "#comments"
								},
								{
									"match": "([[:alpha:]0-9'`^_ ]+)",
									"captures": {
										"1": {
											"name": "entity.name.type.fsharp"
										}
									}
								},
								{
									"include": "#keywords"
								}
							]
						},
						{
							"include": "#compiler_directives"
						},
						{
							"include": "#constants"
						},
						{
							"include": "#strings"
						},
						{
							"include": "#chars"
						},
						{
							"include": "#double_tick"
						},
						{
							"include": "#definition"
						},
						{
							"include": "#attributes"
						},
						{
							"include": "#anonymous_functions"
						},
						{
							"include": "#keywords"
						},
						{
							"include": "#cexprs"
						},
						{
							"include": "#text"
						}
					]
				}
			]
		},
		"cexprs": {
			"patterns": [
				{
					"name": "cexpr.fsharp",
					"match": "\\b(async|seq|promise|task|maybe|asyncMaybe|controller|scope|application|pipeline)(?=\\s*\\{)",
					"captures": {
						"0": {
							"name": "keyword.fsharp"
						}
					}
				}
			]
		},
		"chars": {
			"patterns": [
				{
					"name": "char.fsharp",
					"match": "('\\\\?.')",
					"captures": {
						"1": {
							"name": "string.quoted.single.fsharp"
						}
					}
				}
			]
		},
		"text": {
			"patterns": [
				{
					"name": "text.fsharp",
					"match": "\\\\"
				}
			]
		},
		"compiler_directives": {
			"patterns": [
				{
					"name": "keyword.control.directive.fsharp",
					"match": "\\s?(#if|#elif|#elseif|#else|#endif|#light|#nowarn|#warnon)",
					"captures": {}
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/.npmrc]---
Location: vscode-main/extensions/git/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/.vscodeignore]---
Location: vscode-main/extensions/git/.vscodeignore

```text
src/**
test/**
out/**
tsconfig.json
build/**
extension.webpack.config.js
package-lock.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/extension.webpack.config.js]---
Location: vscode-main/extensions/git/extension.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import withDefaults from '../shared.webpack.config.mjs';

export default withDefaults({
	context: import.meta.dirname,
	entry: {
		main: './src/main.ts',
		['askpass-main']: './src/askpass-main.ts',
		['git-editor-main']: './src/git-editor-main.ts'
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/package-lock.json]---
Location: vscode-main/extensions/git/package-lock.json

```json
{
  "name": "git",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "git",
      "version": "1.0.0",
      "license": "MIT",
      "dependencies": {
        "@joaomoreno/unique-names-generator": "^5.2.0",
        "@vscode/extension-telemetry": "^0.9.8",
        "byline": "^5.0.0",
        "file-type": "16.5.4",
        "picomatch": "2.3.1",
        "vscode-uri": "^2.0.0",
        "which": "4.0.0"
      },
      "devDependencies": {
        "@types/byline": "4.2.31",
        "@types/mocha": "^10.0.10",
        "@types/node": "22.x",
        "@types/picomatch": "2.3.0",
        "@types/which": "3.0.0"
      },
      "engines": {
        "vscode": "^1.5.0"
      }
    },
    "node_modules/@joaomoreno/unique-names-generator": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/@joaomoreno/unique-names-generator/-/unique-names-generator-5.2.0.tgz",
      "integrity": "sha512-JEh3qZ85Z6syFvQlhRGRyTPI1M5VticiiP8Xl8EV0XfyfI4Mwzd6Zw28BBrEgUJCYv/cpKCQClVj3J8Tn0KFiA==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/@microsoft/1ds-core-js": {
      "version": "4.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/1ds-core-js/-/1ds-core-js-4.3.4.tgz",
      "integrity": "sha512-3gbDUQgAO8EoyQTNcAEkxpuPnioC0May13P1l1l0NKZ128L9Ts/sj8QsfwCRTjHz0HThlA+4FptcAJXNYUy3rg==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/applicationinsights-core-js": "3.3.4",
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-async": ">= 0.5.2 < 2.x",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      }
    },
    "node_modules/@microsoft/1ds-post-js": {
      "version": "4.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/1ds-post-js/-/1ds-post-js-4.3.4.tgz",
      "integrity": "sha512-nlKjWricDj0Tn68Dt0P8lX9a+X7LYrqJ6/iSfQwMfDhRIGLqW+wxx8gxS+iGWC/oc8zMQAeiZaemUpCwQcwpRQ==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/1ds-core-js": "4.3.4",
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-async": ">= 0.5.2 < 2.x",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      }
    },
    "node_modules/@microsoft/applicationinsights-channel-js": {
      "version": "3.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-channel-js/-/applicationinsights-channel-js-3.3.4.tgz",
      "integrity": "sha512-Z4nrxYwGKP9iyrYtm7iPQXVOFy4FsEsX0nDKkAi96Qpgw+vEh6NH4ORxMMuES0EollBQ3faJyvYCwckuCVIj0g==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/applicationinsights-common": "3.3.4",
        "@microsoft/applicationinsights-core-js": "3.3.4",
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-async": ">= 0.5.2 < 2.x",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      },
      "peerDependencies": {
        "tslib": ">= 1.0.0"
      }
    },
    "node_modules/@microsoft/applicationinsights-common": {
      "version": "3.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-common/-/applicationinsights-common-3.3.4.tgz",
      "integrity": "sha512-4ms16MlIvcP4WiUPqopifNxcWCcrXQJ2ADAK/75uok2mNQe6ZNRsqb/P+pvhUxc8A5HRlvoXPP1ptDSN5Girgw==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/applicationinsights-core-js": "3.3.4",
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      },
      "peerDependencies": {
        "tslib": ">= 1.0.0"
      }
    },
    "node_modules/@microsoft/applicationinsights-core-js": {
      "version": "3.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-core-js/-/applicationinsights-core-js-3.3.4.tgz",
      "integrity": "sha512-MummANF0mgKIkdvVvfmHQTBliK114IZLRhTL0X0Ep+zjDwWMHqYZgew0nlFKAl6ggu42abPZFK5afpE7qjtYJA==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-async": ">= 0.5.2 < 2.x",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      },
      "peerDependencies": {
        "tslib": ">= 1.0.0"
      }
    },
    "node_modules/@microsoft/applicationinsights-shims": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-shims/-/applicationinsights-shims-3.0.1.tgz",
      "integrity": "sha512-DKwboF47H1nb33rSUfjqI6ryX29v+2QWcTrRvcQDA32AZr5Ilkr7whOOSsD1aBzwqX0RJEIP1Z81jfE3NBm/Lg==",
      "license": "MIT",
      "dependencies": {
        "@nevware21/ts-utils": ">= 0.9.4 < 2.x"
      }
    },
    "node_modules/@microsoft/applicationinsights-web-basic": {
      "version": "3.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-web-basic/-/applicationinsights-web-basic-3.3.4.tgz",
      "integrity": "sha512-OpEPXr8vU/t/M8T9jvWJzJx/pCyygIiR1nGM/2PTde0wn7anl71Gxl5fWol7K/WwFEORNjkL3CEyWOyDc+28AA==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/applicationinsights-channel-js": "3.3.4",
        "@microsoft/applicationinsights-common": "3.3.4",
        "@microsoft/applicationinsights-core-js": "3.3.4",
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-async": ">= 0.5.2 < 2.x",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      },
      "peerDependencies": {
        "tslib": ">= 1.0.0"
      }
    },
    "node_modules/@microsoft/dynamicproto-js": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/@microsoft/dynamicproto-js/-/dynamicproto-js-2.0.3.tgz",
      "integrity": "sha512-JTWTU80rMy3mdxOjjpaiDQsTLZ6YSGGqsjURsY6AUQtIj0udlF/jYmhdLZu8693ZIC0T1IwYnFa0+QeiMnziBA==",
      "license": "MIT",
      "dependencies": {
        "@nevware21/ts-utils": ">= 0.10.4 < 2.x"
      }
    },
    "node_modules/@nevware21/ts-async": {
      "version": "0.5.4",
      "resolved": "https://registry.npmjs.org/@nevware21/ts-async/-/ts-async-0.5.4.tgz",
      "integrity": "sha512-IBTyj29GwGlxfzXw2NPnzty+w0Adx61Eze1/lknH/XIVdxtF9UnOpk76tnrHXWa6j84a1RR9hsOcHQPFv9qJjA==",
      "license": "MIT",
      "dependencies": {
        "@nevware21/ts-utils": ">= 0.11.6 < 2.x"
      }
    },
    "node_modules/@nevware21/ts-utils": {
      "version": "0.11.6",
      "resolved": "https://registry.npmjs.org/@nevware21/ts-utils/-/ts-utils-0.11.6.tgz",
      "integrity": "sha512-OUUJTh3fnaUSzg9DEHgv3d7jC+DnPL65mIO7RaR+jWve7+MmcgIvF79gY97DPQ4frH+IpNR78YAYd/dW4gK3kg==",
      "license": "MIT"
    },
    "node_modules/@tokenizer/token": {
      "version": "0.3.0",
      "resolved": "https://registry.npmjs.org/@tokenizer/token/-/token-0.3.0.tgz",
      "integrity": "sha512-OvjF+z51L3ov0OyAU0duzsYuvO01PH7x4t6DJx+guahgTnBHkhJdG7soQeTSFLWN3efnHyibZ4Z8l2EuWwJN3A=="
    },
    "node_modules/@types/byline": {
      "version": "4.2.31",
      "resolved": "https://registry.npmjs.org/@types/byline/-/byline-4.2.31.tgz",
      "integrity": "sha1-DmH8ucA+BH0hxEllVMcRYperYM0= sha512-TC6Ljn7tALesQMQyTNoMWoM44SNvWtCLkJDrA/TxcwE5ILkWt4zi5wbEokqiDk42S75eykAY1onPImWDybOkmQ==",
      "dev": true,
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/mocha": {
      "version": "10.0.10",
      "resolved": "https://registry.npmjs.org/@types/mocha/-/mocha-10.0.10.tgz",
      "integrity": "sha512-xPyYSz1cMPnJQhl0CLMH68j3gprKZaTjG3s5Vi+fDgx+uhG9NOXwbVt52eFS8ECyXhyKcjDLCBEqBExKuiZb7Q==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/node": {
      "version": "22.13.10",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-22.13.10.tgz",
      "integrity": "sha512-I6LPUvlRH+O6VRUqYOcMudhaIdUVWfsjnZavnsraHvpBwaEyMN29ry+0UVJhImYL16xsscu0aske3yA+uPOWfw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.20.0"
      }
    },
    "node_modules/@types/picomatch": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/@types/picomatch/-/picomatch-2.3.0.tgz",
      "integrity": "sha512-O397rnSS9iQI4OirieAtsDqvCj4+3eY1J+EPdNTKuHuRWIfUoGyzX294o8C4KJYaLqgSrd2o60c5EqCU8Zv02g==",
      "dev": true
    },
    "node_modules/@types/which": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/@types/which/-/which-3.0.0.tgz",
      "integrity": "sha512-ASCxdbsrwNfSMXALlC3Decif9rwDMu+80KGp5zI2RLRotfMsTv7fHL8W8VDp24wymzDyIFudhUeSCugrgRFfHQ==",
      "dev": true
    },
    "node_modules/@vscode/extension-telemetry": {
      "version": "0.9.8",
      "resolved": "https://registry.npmjs.org/@vscode/extension-telemetry/-/extension-telemetry-0.9.8.tgz",
      "integrity": "sha512-7YcKoUvmHlIB8QYCE4FNzt3ErHi9gQPhdCM3ZWtpw1bxPT0I+lMdx52KHlzTNoJzQ2NvMX7HyzyDwBEiMgTrWQ==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/1ds-core-js": "^4.3.4",
        "@microsoft/1ds-post-js": "^4.3.4",
        "@microsoft/applicationinsights-web-basic": "^3.3.4"
      },
      "engines": {
        "vscode": "^1.75.0"
      }
    },
    "node_modules/byline": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/byline/-/byline-5.0.0.tgz",
      "integrity": "sha1-dBxSFkaOrcRXsDQQEYrXfejB3bE= sha512-s6webAy+R4SR8XVuJWt2V2rGvhnrhxN+9S15GNuTK3wKPOXFF6RNc+8ug2XhH+2s4f+uudG4kUVYmYOQWL2g0Q==",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/file-type": {
      "version": "16.5.4",
      "resolved": "https://registry.npmjs.org/file-type/-/file-type-16.5.4.tgz",
      "integrity": "sha512-/yFHK0aGjFEgDJjEKP0pWCplsPFPhwyfwevf/pVxiN0tmE4L9LmwWxWukdJSHdoCli4VgQLehjJtwQBnqmsKcw==",
      "dependencies": {
        "readable-web-to-node-stream": "^3.0.0",
        "strtok3": "^6.2.4",
        "token-types": "^4.1.1"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sindresorhus/file-type?sponsor=1"
      }
    },
    "node_modules/ieee754": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/ieee754/-/ieee754-1.2.1.tgz",
      "integrity": "sha512-dcyqhDvX1C46lXZcVqCpK+FtMRQVdIMN6/Df5js2zouUsqG7I6sFxitIC+7KYK29KdXOLHdu9zL4sFnoVQnqaA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ]
    },
    "node_modules/inherits": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz",
      "integrity": "sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ=="
    },
    "node_modules/isexe": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/isexe/-/isexe-3.1.1.tgz",
      "integrity": "sha512-LpB/54B+/2J5hqQ7imZHfdU31OlgQqx7ZicVlkm9kzg9/w8GKLEcFfJl/t7DCEDueOyBAD6zCCwTO6Fzs0NoEQ==",
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/peek-readable": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/peek-readable/-/peek-readable-4.1.0.tgz",
      "integrity": "sha512-ZI3LnwUv5nOGbQzD9c2iDG6toheuXSZP5esSHBjopsXH4dg19soufvpUGA3uohi5anFtGb2lhAVdHzH6R/Evvg==",
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Borewit"
      }
    },
    "node_modules/picomatch": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-2.3.1.tgz",
      "integrity": "sha512-JU3teHTNjmE2VCGFzuY8EXzCDVwEqB2a8fsIvwaStHhAWJEeVd1o1QD80CU6+ZdEXXSLbSsuLwJjkCBWqRQUVA==",
      "engines": {
        "node": ">=8.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/readable-stream": {
      "version": "3.6.0",
      "resolved": "https://registry.npmjs.org/readable-stream/-/readable-stream-3.6.0.tgz",
      "integrity": "sha512-BViHy7LKeTz4oNnkcLJ+lVSL6vpiFeX6/d3oSH8zCW7UxP2onchk+vTGB143xuFjHS3deTgkKoXXymXqymiIdA==",
      "dependencies": {
        "inherits": "^2.0.3",
        "string_decoder": "^1.1.1",
        "util-deprecate": "^1.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/readable-web-to-node-stream": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/readable-web-to-node-stream/-/readable-web-to-node-stream-3.0.2.tgz",
      "integrity": "sha512-ePeK6cc1EcKLEhJFt/AebMCLL+GgSKhuygrZ/GLaKZYEecIgIECf4UaUuaByiGtzckwR4ain9VzUh95T1exYGw==",
      "dependencies": {
        "readable-stream": "^3.6.0"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Borewit"
      }
    },
    "node_modules/safe-buffer": {
      "version": "5.2.1",
      "resolved": "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.2.1.tgz",
      "integrity": "sha512-rp3So07KcdmmKbGvgaNxQSJr7bGVSVk5S9Eq1F+ppbRo70+YeaDxkw5Dd8NPN+GD6bjnYm2VuPuCXmpuYvmCXQ==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ]
    },
    "node_modules/string_decoder": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/string_decoder/-/string_decoder-1.3.0.tgz",
      "integrity": "sha512-hkRX8U1WjJFd8LsDJ2yQ/wWWxaopEsABU1XfkM8A+j0+85JAGppt16cr1Whg6KIbb4okU6Mql6BOj+uup/wKeA==",
      "dependencies": {
        "safe-buffer": "~5.2.0"
      }
    },
    "node_modules/strtok3": {
      "version": "6.3.0",
      "resolved": "https://registry.npmjs.org/strtok3/-/strtok3-6.3.0.tgz",
      "integrity": "sha512-fZtbhtvI9I48xDSywd/somNqgUHl2L2cstmXCCif0itOf96jeW18MBSyrLuNicYQVkvpOxkZtkzujiTJ9LW5Jw==",
      "dependencies": {
        "@tokenizer/token": "^0.3.0",
        "peek-readable": "^4.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Borewit"
      }
    },
    "node_modules/token-types": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/token-types/-/token-types-4.2.0.tgz",
      "integrity": "sha512-P0rrp4wUpefLncNamWIef62J0v0kQR/GfDVji9WKY7GDCWy5YbVSrKUTam07iWPZQGy0zWNOfstYTykMmPNR7w==",
      "dependencies": {
        "@tokenizer/token": "^0.3.0",
        "ieee754": "^1.2.1"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Borewit"
      }
    },
    "node_modules/undici-types": {
      "version": "6.20.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.20.0.tgz",
      "integrity": "sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/util-deprecate": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/util-deprecate/-/util-deprecate-1.0.2.tgz",
      "integrity": "sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw=="
    },
    "node_modules/vscode-uri": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/vscode-uri/-/vscode-uri-2.0.0.tgz",
      "integrity": "sha512-lWXWofDSYD8r/TIyu64MdwB4FaSirQ608PP/TzUyslyOeHGwQ0eTHUZeJrK1ILOmwUHaJtV693m2JoUYroUDpw=="
    },
    "node_modules/which": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/which/-/which-4.0.0.tgz",
      "integrity": "sha512-GlaYyEb07DPxYCKhKzplCWBJtvxZcZMrL+4UkrTSJHHPyZU4mYYTv3qaOe77H7EODLSSopAUFAc6W8U4yqvscg==",
      "dependencies": {
        "isexe": "^3.1.1"
      },
      "bin": {
        "node-which": "bin/which.js"
      },
      "engines": {
        "node": "^16.13.0 || >=18.0.0"
      }
    }
  }
}
```

--------------------------------------------------------------------------------

````

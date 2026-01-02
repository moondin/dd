---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 184
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 184 of 552)

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

---[FILE: src/vs/base/test/browser/markdownRenderer.test.ts]---
Location: vscode-main/src/vs/base/test/browser/markdownRenderer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable no-restricted-syntax */

import assert from 'assert';
import { fillInIncompleteTokens, renderMarkdown, renderAsPlaintext } from '../../browser/markdownRenderer.js';
import { IMarkdownString, MarkdownString } from '../../common/htmlContent.js';
import * as marked from '../../common/marked/marked.js';
import { parse } from '../../common/marshalling.js';
import { isWeb } from '../../common/platform.js';
import { URI } from '../../common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../common/utils.js';

function strToNode(str: string): HTMLElement {
	return new DOMParser().parseFromString(str, 'text/html').body.firstChild as HTMLElement;
}

function assertNodeEquals(actualNode: HTMLElement, expectedHtml: string) {
	const expectedNode = strToNode(expectedHtml);
	assert.ok(
		actualNode.isEqualNode(expectedNode),
		`Expected: ${expectedNode.outerHTML}\nActual: ${actualNode.outerHTML}`);
}

suite('MarkdownRenderer', () => {

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	suite('Sanitization', () => {
		test('Should not render images with unknown schemes', () => {
			const markdown = { value: `![image](no-such://example.com/cat.gif)` };
			const result: HTMLElement = store.add(renderMarkdown(markdown)).element;
			assert.strictEqual(result.innerHTML, '<p><img alt="image"></p>');
		});
	});

	suite('Images', () => {
		test('image rendering conforms to default', () => {
			const markdown = { value: `![image](http://example.com/cat.gif 'caption')` };
			const result: HTMLElement = store.add(renderMarkdown(markdown)).element;
			assertNodeEquals(result, '<div><p><img title="caption" alt="image" src="http://example.com/cat.gif"></p></div>');
		});

		test('image rendering conforms to default without title', () => {
			const markdown = { value: `![image](http://example.com/cat.gif)` };
			const result: HTMLElement = store.add(renderMarkdown(markdown)).element;
			assertNodeEquals(result, '<div><p><img alt="image" src="http://example.com/cat.gif"></p></div>');
		});

		test('image width from title params', () => {
			const result: HTMLElement = store.add(renderMarkdown({ value: `![image](http://example.com/cat.gif|width=100px 'caption')` })).element;
			assertNodeEquals(result, `<div><p><img width="100" title="caption" alt="image" src="http://example.com/cat.gif"></p></div>`);
		});

		test('image height from title params', () => {
			const result: HTMLElement = store.add(renderMarkdown({ value: `![image](http://example.com/cat.gif|height=100 'caption')` })).element;
			assertNodeEquals(result, `<div><p><img height="100" title="caption" alt="image" src="http://example.com/cat.gif"></p></div>`);
		});

		test('image width and height from title params', () => {
			const result: HTMLElement = store.add(renderMarkdown({ value: `![image](http://example.com/cat.gif|height=200,width=100 'caption')` })).element;
			assertNodeEquals(result, `<div><p><img height="200" width="100" title="caption" alt="image" src="http://example.com/cat.gif"></p></div>`);
		});

		test('image with file uri should render as same origin uri', () => {
			if (isWeb) {
				return;
			}
			const result: HTMLElement = store.add(renderMarkdown({ value: `![image](file:///images/cat.gif)` })).element;
			assertNodeEquals(result, '<div><p><img src="vscode-file://vscode-app/images/cat.gif" alt="image"></p></div>');
		});
	});

	suite('Code block renderer', () => {
		const simpleCodeBlockRenderer = (lang: string, code: string): Promise<HTMLElement> => {
			const element = document.createElement('code');
			element.textContent = code;
			return Promise.resolve(element);
		};

		test('asyncRenderCallback should be invoked for code blocks', () => {
			const markdown = { value: '```js\n1 + 1;\n```' };
			return new Promise<void>(resolve => {
				store.add(renderMarkdown(markdown, {
					asyncRenderCallback: resolve,
					codeBlockRenderer: simpleCodeBlockRenderer
				}));
			});
		});

		test('asyncRenderCallback should not be invoked if result is immediately disposed', () => {
			const markdown = { value: '```js\n1 + 1;\n```' };
			return new Promise<void>((resolve, reject) => {
				const result = renderMarkdown(markdown, {
					asyncRenderCallback: reject,
					codeBlockRenderer: simpleCodeBlockRenderer
				});
				result.dispose();
				setTimeout(resolve, 10);
			});
		});

		test('asyncRenderCallback should not be invoked if dispose is called before code block is rendered', () => {
			const markdown = { value: '```js\n1 + 1;\n```' };
			return new Promise<void>((resolve, reject) => {
				let resolveCodeBlockRendering: (x: HTMLElement) => void;
				const result = renderMarkdown(markdown, {
					asyncRenderCallback: reject,
					codeBlockRenderer: () => {
						return new Promise(resolve => {
							resolveCodeBlockRendering = resolve;
						});
					}
				});
				setTimeout(() => {
					result.dispose();
					resolveCodeBlockRendering(document.createElement('code'));
					setTimeout(resolve, 10);
				}, 10);
			});
		});

		test('Code blocks should use leading language id (#157793)', async () => {
			const markdown = { value: '```js some other stuff\n1 + 1;\n```' };
			const lang = await new Promise<string>(resolve => {
				store.add(renderMarkdown(markdown, {
					codeBlockRenderer: async (lang, value) => {
						resolve(lang);
						return simpleCodeBlockRenderer(lang, value);
					}
				}));
			});
			assert.strictEqual(lang, 'js');
		});
	});

	suite('ThemeIcons Support On', () => {

		test('render appendText', () => {
			const mds = new MarkdownString(undefined, { supportThemeIcons: true });
			mds.appendText('$(zap) $(not a theme icon) $(add)');

			const result: HTMLElement = store.add(renderMarkdown(mds)).element;
			assert.strictEqual(result.innerHTML, `<p>$(zap)&nbsp;$(not&nbsp;a&nbsp;theme&nbsp;icon)&nbsp;$(add)</p>`);
		});

		test('render appendMarkdown', () => {
			const mds = new MarkdownString(undefined, { supportThemeIcons: true });
			mds.appendMarkdown('$(zap) $(not a theme icon) $(add)');

			const result: HTMLElement = store.add(renderMarkdown(mds)).element;
			assert.strictEqual(result.innerHTML, `<p><span class="codicon codicon-zap"></span> $(not a theme icon) <span class="codicon codicon-add"></span></p>`);
		});

		test('render appendMarkdown with escaped icon', () => {
			const mds = new MarkdownString(undefined, { supportThemeIcons: true });
			mds.appendMarkdown('\\$(zap) $(not a theme icon) $(add)');

			const result: HTMLElement = store.add(renderMarkdown(mds)).element;
			assert.strictEqual(result.innerHTML, `<p>$(zap) $(not a theme icon) <span class="codicon codicon-add"></span></p>`);
		});

		test('render icon in link', () => {
			const mds = new MarkdownString(undefined, { supportThemeIcons: true });
			mds.appendMarkdown(`[$(zap)-link](#link)`);

			const result: HTMLElement = store.add(renderMarkdown(mds)).element;
			assert.strictEqual(result.innerHTML, `<p><a href="" title="#link" draggable="false" data-href="#link"><span class="codicon codicon-zap"></span>-link</a></p>`);
		});

		test('render icon in table', () => {
			const mds = new MarkdownString(undefined, { supportThemeIcons: true });
			mds.appendMarkdown(`
| text   | text                 |
|--------|----------------------|
| $(zap) | [$(zap)-link](#link) |`);

			const result: HTMLElement = store.add(renderMarkdown(mds)).element;
			assert.strictEqual(result.innerHTML, `<table>
<thead>
<tr>
<th>text</th>
<th>text</th>
</tr>
</thead>
<tbody><tr>
<td><span class="codicon codicon-zap"></span></td>
<td><a href="" title="#link" draggable="false" data-href="#link"><span class="codicon codicon-zap"></span>-link</a></td>
</tr>
</tbody></table>
`);
		});

		test('render icon in <a> without href (#152170)', () => {
			const mds = new MarkdownString(undefined, { supportThemeIcons: true, supportHtml: true });
			mds.appendMarkdown(`<a>$(sync)</a>`);

			const result: HTMLElement = store.add(renderMarkdown(mds)).element;
			assert.strictEqual(result.innerHTML, `<p><span class="codicon codicon-sync"></span></p>`);
		});
	});

	suite('ThemeIcons Support Off', () => {

		test('render appendText', () => {
			const mds = new MarkdownString(undefined, { supportThemeIcons: false });
			mds.appendText('$(zap) $(not a theme icon) $(add)');

			const result: HTMLElement = store.add(renderMarkdown(mds)).element;
			assert.strictEqual(result.innerHTML, `<p>$(zap)&nbsp;$(not&nbsp;a&nbsp;theme&nbsp;icon)&nbsp;$(add)</p>`);
		});

		test('render appendMarkdown with escaped icon', () => {
			const mds = new MarkdownString(undefined, { supportThemeIcons: false });
			mds.appendMarkdown('\\$(zap) $(not a theme icon) $(add)');

			const result: HTMLElement = store.add(renderMarkdown(mds)).element;
			assert.strictEqual(result.innerHTML, `<p>$(zap) $(not a theme icon) $(add)</p>`);
		});
	});

	suite('Alerts', () => {
		test('Should render alert with data-severity attribute and icon', () => {
			const markdown = new MarkdownString('> [!NOTE]\n> This is a note alert', { supportAlertSyntax: true });
			const result = store.add(renderMarkdown(markdown)).element;

			const blockquote = result.querySelector('blockquote[data-severity="note"]');
			assert.ok(blockquote, 'Should have blockquote with data-severity="note"');
			assert.ok(result.innerHTML.includes('This is a note alert'), 'Should contain alert text');
			assert.ok(result.innerHTML.includes('codicon-info'), 'Should contain info icon');
		});

		test('Should render regular blockquote when supportAlertSyntax is disabled', () => {
			const markdown = new MarkdownString('> [!NOTE]\n> This should be a regular blockquote');
			const result = store.add(renderMarkdown(markdown)).element;

			const blockquote = result.querySelector('blockquote');
			assert.ok(blockquote, 'Should have blockquote');
			assert.strictEqual(blockquote?.getAttribute('data-severity'), null, 'Should not have data-severity attribute');
			assert.ok(result.innerHTML.includes('[!NOTE]'), 'Should contain literal [!NOTE] text');
		});

		test('Should not transform blockquotes without alert syntax', () => {
			const markdown = new MarkdownString('> This is a regular blockquote', { supportAlertSyntax: true });
			const result = store.add(renderMarkdown(markdown)).element;

			const blockquote = result.querySelector('blockquote');
			assert.strictEqual(blockquote?.getAttribute('data-severity'), null, 'Should not have data-severity attribute');
		});
	});

	test('npm Hover Run Script not working #90855', function () {

		const md: IMarkdownString = JSON.parse('{"value":"[Run Script](command:npm.runScriptFromHover?%7B%22documentUri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22c%3A%5C%5CUsers%5C%5Cjrieken%5C%5CCode%5C%5C_sample%5C%5Cfoo%5C%5Cpackage.json%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fc%253A%2FUsers%2Fjrieken%2FCode%2F_sample%2Ffoo%2Fpackage.json%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2Fjrieken%2FCode%2F_sample%2Ffoo%2Fpackage.json%22%2C%22scheme%22%3A%22file%22%7D%2C%22script%22%3A%22echo%22%7D \\"Run the script as a task\\")","supportThemeIcons":false,"isTrusted":true,"uris":{"__uri_e49443":{"$mid":1,"fsPath":"c:\\\\Users\\\\jrieken\\\\Code\\\\_sample\\\\foo\\\\package.json","_sep":1,"external":"file:///c%3A/Users/jrieken/Code/_sample/foo/package.json","path":"/c:/Users/jrieken/Code/_sample/foo/package.json","scheme":"file"},"command:npm.runScriptFromHover?%7B%22documentUri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22c%3A%5C%5CUsers%5C%5Cjrieken%5C%5CCode%5C%5C_sample%5C%5Cfoo%5C%5Cpackage.json%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fc%253A%2FUsers%2Fjrieken%2FCode%2F_sample%2Ffoo%2Fpackage.json%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2Fjrieken%2FCode%2F_sample%2Ffoo%2Fpackage.json%22%2C%22scheme%22%3A%22file%22%7D%2C%22script%22%3A%22echo%22%7D":{"$mid":1,"path":"npm.runScriptFromHover","scheme":"command","query":"{\\"documentUri\\":\\"__uri_e49443\\",\\"script\\":\\"echo\\"}"}}}');
		const element = store.add(renderMarkdown(md)).element;

		const anchor = element.querySelector('a')!;
		assert.ok(anchor);
		assert.ok(anchor.dataset['href']);

		const uri = URI.parse(anchor.dataset['href']!);

		const data = <{ script: string; documentUri: URI }>parse(decodeURIComponent(uri.query));
		assert.ok(data);
		assert.strictEqual(data.script, 'echo');
		assert.ok(data.documentUri.toString().startsWith('file:///c%3A/'));
	});

	test('Should not render command links by default', () => {
		const md = new MarkdownString(`[command1](command:doFoo) <a href="command:doFoo">command2</a>`, {
			supportHtml: true
		});

		const result: HTMLElement = store.add(renderMarkdown(md)).element;
		assert.strictEqual(result.innerHTML, `<p>command1 command2</p>`);
	});

	test('Should render command links in trusted strings', () => {
		const md = new MarkdownString(`[command1](command:doFoo) <a href="command:doFoo">command2</a>`, {
			isTrusted: true,
			supportHtml: true,
		});

		const result: HTMLElement = store.add(renderMarkdown(md)).element;
		assert.strictEqual(result.innerHTML, `<p><a href="" title="command:doFoo" draggable="false" data-href="command:doFoo">command1</a> <a href="" data-href="command:doFoo">command2</a></p>`);
	});

	test('Should remove relative links if there is no base url', () => {
		const md = new MarkdownString(`[text](./foo) <a href="./bar">bar</a>`, {
			isTrusted: true,
			supportHtml: true,
		});

		const result = store.add(renderMarkdown(md)).element;
		assert.strictEqual(result.innerHTML, `<p>text bar</p>`);
	});

	test('Should support relative links if baseurl is set', () => {
		const md = new MarkdownString(`[text](./foo) <a href="./bar">bar</a> <img src="cat.gif">`, {
			isTrusted: true,
			supportHtml: true,
		});
		md.baseUri = URI.parse('https://example.com/path/');

		const result = store.add(renderMarkdown(md)).element;
		assert.strictEqual(result.innerHTML, `<p><a href="" title="./foo" draggable="false" data-href="https://example.com/path/foo">text</a> <a href="" data-href="https://example.com/path/bar">bar</a> <img src="https://example.com/path/cat.gif"></p>`);
	});

	suite('PlaintextMarkdownRender', () => {

		test('test code, blockquote, heading, list, listitem, paragraph, table, tablerow, tablecell, strong, em, br, del, text are rendered plaintext', () => {
			const markdown = { value: '`code`\n>quote\n# heading\n- list\n\ntable | table2\n--- | --- \none | two\n\n\nbo**ld**\n_italic_\n~~del~~\nsome text' };
			const expected = 'code\nquote\nheading\nlist\n\ntable table2\none two\nbold\nitalic\ndel\nsome text';
			const result: string = renderAsPlaintext(markdown);
			assert.strictEqual(result, expected);
		});

		test('test html, hr, image, link are rendered plaintext', () => {
			const markdown = { value: '<div>html</div>\n\n---\n![image](imageLink)\n[text](textLink)' };
			const expected = 'text';
			const result: string = renderAsPlaintext(markdown);
			assert.strictEqual(result, expected);
		});

		test(`Should not remove html inside of code blocks`, () => {
			const markdown = {
				value: [
					'```html',
					'<form>html</form>',
					'```',
				].join('\n')
			};
			const expected = [
				'```',
				'<form>html</form>',
				'```',
			].join('\n');
			const result: string = renderAsPlaintext(markdown, { includeCodeBlocksFences: true });
			assert.strictEqual(result, expected);
		});
	});

	suite('supportHtml', () => {
		test('supportHtml is disabled by default', () => {
			const mds = new MarkdownString(undefined, {});
			mds.appendMarkdown('a<b>b</b>c');

			const result = store.add(renderMarkdown(mds)).element;
			assert.strictEqual(result.innerHTML, `<p>abc</p>`);
		});

		test('Renders html when supportHtml=true', () => {
			const mds = new MarkdownString(undefined, { supportHtml: true });
			mds.appendMarkdown('a<b>b</b>c');

			const result = store.add(renderMarkdown(mds)).element;
			assert.strictEqual(result.innerHTML, `<p>a<b>b</b>c</p>`);
		});

		test('Should not include scripts even when supportHtml=true', () => {
			const mds = new MarkdownString(undefined, { supportHtml: true });
			mds.appendMarkdown('a<b onclick="alert(1)">b</b><script>alert(2)</script>c');

			const result = store.add(renderMarkdown(mds)).element;
			assert.strictEqual(result.innerHTML, `<p>a<b>b</b>c</p>`);
		});

		test('Should not render html appended as text', () => {
			const mds = new MarkdownString(undefined, { supportHtml: true });
			mds.appendText('a<b>b</b>c');

			const result = store.add(renderMarkdown(mds)).element;
			assert.strictEqual(result.innerHTML, `<p>a&lt;b&gt;b&lt;/b&gt;c</p>`);
		});

		test('Should render html images', () => {
			if (isWeb) {
				return;
			}

			const mds = new MarkdownString(undefined, { supportHtml: true });
			mds.appendMarkdown(`<img src="http://example.com/cat.gif">`);

			const result = store.add(renderMarkdown(mds)).element;
			assert.strictEqual(result.innerHTML, `<img src="http://example.com/cat.gif">`);
		});

		test('Should render html images with file uri as same origin uri', () => {
			if (isWeb) {
				return;
			}

			const mds = new MarkdownString(undefined, { supportHtml: true });
			mds.appendMarkdown(`<img src="file:///images/cat.gif">`);

			const result = store.add(renderMarkdown(mds)).element;
			assert.strictEqual(result.innerHTML, `<img src="vscode-file://vscode-app/images/cat.gif">`);
		});

		test('Should only allow checkbox inputs', () => {
			const mds = new MarkdownString(
				'text: <input type="text">\ncheckbox:<input type="checkbox">',
				{ supportHtml: true });

			const result = store.add(renderMarkdown(mds)).element;

			// Inputs should always be disabled too
			assert.strictEqual(result.innerHTML, `<p>text: \ncheckbox:<input type="checkbox" disabled=""></p>`);
		});
	});

	suite('fillInIncompleteTokens', () => {
		function ignoreRaw(...tokenLists: marked.Token[][]): void {
			tokenLists.forEach(tokens => {
				tokens.forEach(t => t.raw = '');
			});
		}

		const completeTable = '| a | b |\n| --- | --- |';

		suite('table', () => {
			test('complete table', () => {
				const tokens = marked.marked.lexer(completeTable);
				const newTokens = fillInIncompleteTokens(tokens);
				assert.equal(newTokens, tokens);
			});

			test('full header only', () => {
				const incompleteTable = '| a | b |';
				const tokens = marked.marked.lexer(incompleteTable);
				const completeTableTokens = marked.marked.lexer(completeTable);

				const newTokens = fillInIncompleteTokens(tokens);
				assert.deepStrictEqual(newTokens, completeTableTokens);
			});

			test('full header only with trailing space', () => {
				const incompleteTable = '| a | b | ';
				const tokens = marked.marked.lexer(incompleteTable);
				const completeTableTokens = marked.marked.lexer(completeTable);

				const newTokens = fillInIncompleteTokens(tokens);
				if (newTokens) {
					ignoreRaw(newTokens, completeTableTokens);
				}
				assert.deepStrictEqual(newTokens, completeTableTokens);
			});

			test('incomplete header', () => {
				const incompleteTable = '| a | b';
				const tokens = marked.marked.lexer(incompleteTable);
				const completeTableTokens = marked.marked.lexer(completeTable);

				const newTokens = fillInIncompleteTokens(tokens);

				if (newTokens) {
					ignoreRaw(newTokens, completeTableTokens);
				}
				assert.deepStrictEqual(newTokens, completeTableTokens);
			});

			test('incomplete header one column', () => {
				const incompleteTable = '| a ';
				const tokens = marked.marked.lexer(incompleteTable);
				const completeTableTokens = marked.marked.lexer(incompleteTable + '|\n| --- |');

				const newTokens = fillInIncompleteTokens(tokens);

				if (newTokens) {
					ignoreRaw(newTokens, completeTableTokens);
				}
				assert.deepStrictEqual(newTokens, completeTableTokens);
			});

			test('full header with extras', () => {
				const incompleteTable = '| a **bold** | b _italics_ |';
				const tokens = marked.marked.lexer(incompleteTable);
				const completeTableTokens = marked.marked.lexer(incompleteTable + '\n| --- | --- |');

				const newTokens = fillInIncompleteTokens(tokens);
				assert.deepStrictEqual(newTokens, completeTableTokens);
			});

			test('full header with leading text', () => {
				// Parsing this gives one token and one 'text' subtoken
				const incompleteTable = 'here is a table\n| a | b |';
				const tokens = marked.marked.lexer(incompleteTable);
				const completeTableTokens = marked.marked.lexer(incompleteTable + '\n| --- | --- |');

				const newTokens = fillInIncompleteTokens(tokens);
				assert.deepStrictEqual(newTokens, completeTableTokens);
			});

			test('full header with leading other stuff', () => {
				// Parsing this gives one token and one 'text' subtoken
				const incompleteTable = '```js\nconst xyz = 123;\n```\n| a | b |';
				const tokens = marked.marked.lexer(incompleteTable);
				const completeTableTokens = marked.marked.lexer(incompleteTable + '\n| --- | --- |');

				const newTokens = fillInIncompleteTokens(tokens);
				assert.deepStrictEqual(newTokens, completeTableTokens);
			});

			test('full header with incomplete separator', () => {
				const incompleteTable = '| a | b |\n| ---';
				const tokens = marked.marked.lexer(incompleteTable);
				const completeTableTokens = marked.marked.lexer(completeTable);

				const newTokens = fillInIncompleteTokens(tokens);
				assert.deepStrictEqual(newTokens, completeTableTokens);
			});

			test('full header with incomplete separator 2', () => {
				const incompleteTable = '| a | b |\n| --- |';
				const tokens = marked.marked.lexer(incompleteTable);
				const completeTableTokens = marked.marked.lexer(completeTable);

				const newTokens = fillInIncompleteTokens(tokens);
				assert.deepStrictEqual(newTokens, completeTableTokens);
			});

			test('full header with incomplete separator 3', () => {
				const incompleteTable = '| a | b |\n|';
				const tokens = marked.marked.lexer(incompleteTable);
				const completeTableTokens = marked.marked.lexer(completeTable);

				const newTokens = fillInIncompleteTokens(tokens);
				assert.deepStrictEqual(newTokens, completeTableTokens);
			});

			test('not a table', () => {
				const incompleteTable = '| a | b |\nsome text';
				const tokens = marked.marked.lexer(incompleteTable);

				const newTokens = fillInIncompleteTokens(tokens);
				assert.deepStrictEqual(newTokens, tokens);
			});

			test('not a table 2', () => {
				const incompleteTable = '| a | b |\n| --- |\nsome text';
				const tokens = marked.marked.lexer(incompleteTable);

				const newTokens = fillInIncompleteTokens(tokens);
				assert.deepStrictEqual(newTokens, tokens);
			});
		});

		function simpleMarkdownTestSuite(name: string, delimiter: string): void {
			test(`incomplete ${name}`, () => {
				const incomplete = `${delimiter}code`;
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete + delimiter);
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test(`complete ${name}`, () => {
				const text = `leading text ${delimiter}code${delimiter} trailing text`;
				const tokens = marked.marked.lexer(text);
				const newTokens = fillInIncompleteTokens(tokens);

				assert.deepStrictEqual(newTokens, tokens);
			});

			test(`${name} with leading text`, () => {
				const incomplete = `some text and ${delimiter}some code`;
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete + delimiter);
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test(`${name} with trailing space`, () => {
				const incomplete = `some text and ${delimiter}some code `;
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete.trimEnd() + delimiter);
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test(`single loose "${delimiter}"`, () => {
				const text = `some text and ${delimiter}by itself\nmore text here`;
				const tokens = marked.marked.lexer(text);
				const newTokens = fillInIncompleteTokens(tokens);

				assert.deepStrictEqual(newTokens, tokens);
			});

			test(`incomplete ${name} after newline`, () => {
				const text = `some text\nmore text here and ${delimiter}text`;
				const tokens = marked.marked.lexer(text);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(text + delimiter);
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test(`incomplete after complete ${name}`, () => {
				const text = `leading text ${delimiter}code${delimiter} trailing text and ${delimiter}another`;
				const tokens = marked.marked.lexer(text);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(text + delimiter);
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test(`incomplete ${name} in list`, () => {
				const text = `- list item one\n- list item two and ${delimiter}text`;
				const tokens = marked.marked.lexer(text);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(text + delimiter);
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test(`incomplete ${name} in asterisk list`, () => {
				const text = `* list item one\n* list item two and ${delimiter}text`;
				const tokens = marked.marked.lexer(text);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(text + delimiter);
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test(`incomplete ${name} in numbered list`, () => {
				const text = `1. list item one\n2. list item two and ${delimiter}text`;
				const tokens = marked.marked.lexer(text);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(text + delimiter);
				assert.deepStrictEqual(newTokens, completeTokens);
			});
		}

		suite('list', () => {
			test('list with complete codeblock', () => {
				const list = `-
	\`\`\`js
	let x = 1;
	\`\`\`
- list item two
`;
				const tokens = marked.marked.lexer(list);
				const newTokens = fillInIncompleteTokens(tokens);

				assert.deepStrictEqual(newTokens, tokens);
			});

			test.skip('list with incomplete codeblock', () => {
				const incomplete = `- list item one

	\`\`\`js
	let x = 1;`;
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete + '\n	```');
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test('list with subitems', () => {
				const list = `- hello
	- sub item
- text
	newline for some reason
`;
				const tokens = marked.marked.lexer(list);
				const newTokens = fillInIncompleteTokens(tokens);

				assert.deepStrictEqual(newTokens, tokens);
			});

			test('ordered list with subitems', () => {
				const list = `1. hello
	- sub item
2. text
	newline for some reason
`;
				const tokens = marked.marked.lexer(list);
				const newTokens = fillInIncompleteTokens(tokens);

				assert.deepStrictEqual(newTokens, tokens);
			});

			test('list with stuff', () => {
				const list = `- list item one \`codespan\` **bold** [link](http://microsoft.com) more text`;
				const tokens = marked.marked.lexer(list);
				const newTokens = fillInIncompleteTokens(tokens);

				assert.deepStrictEqual(newTokens, tokens);
			});

			test('list with incomplete link text', () => {
				const incomplete = `- list item one
- item two [link`;
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete + '](https://microsoft.com)');
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test('list with incomplete link target', () => {
				const incomplete = `- list item one
- item two [link](`;
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete + ')');
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test('ordered list with incomplete link target', () => {
				const incomplete = `1. list item one
2. item two [link](`;
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete + ')');
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test('ordered list with extra whitespace', () => {
				const incomplete = `1. list item one
2. item two [link](`;
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete + ')');
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test('list with extra whitespace', () => {
				const incomplete = `- list item one
- item two [link](`;
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete + ')');
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test('list with incomplete link with other stuff', () => {
				const incomplete = `- list item one
- item two [\`link`;
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete + '\`](https://microsoft.com)');
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test('ordered list with incomplete link with other stuff', () => {
				const incomplete = `1. list item one
1. item two [\`link`;
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete + '\`](https://microsoft.com)');
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test('list with incomplete subitem', () => {
				const incomplete = `1. list item one
	- `;
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete + '&nbsp;');
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test('list with incomplete nested subitem', () => {
				const incomplete = `1. list item one
	- item 2
		- `;
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete + '&nbsp;');
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test('text with start of list is not a heading', () => {
				const incomplete = `hello\n- `;
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete + ' &nbsp;');
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test('even more text with start of list is not a heading', () => {
				const incomplete = `# hello\n\ntext\n-`;
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete + ' &nbsp;');
				assert.deepStrictEqual(newTokens, completeTokens);
			});
		});

		suite('codespan', () => {
			simpleMarkdownTestSuite('codespan', '`');

			test(`backtick between letters`, () => {
				const text = 'a`b';
				const tokens = marked.marked.lexer(text);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeCodespanTokens = marked.marked.lexer(text + '`');
				assert.deepStrictEqual(newTokens, completeCodespanTokens);
			});

			test(`nested pattern`, () => {
				const text = 'sldkfjsd `abc __def__ ghi';
				const tokens = marked.marked.lexer(text);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(text + '`');
				assert.deepStrictEqual(newTokens, completeTokens);
			});
		});

		suite('star', () => {
			simpleMarkdownTestSuite('star', '*');

			test(`star between letters`, () => {
				const text = 'sldkfjsd a*b';
				const tokens = marked.marked.lexer(text);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(text + '*');
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test(`nested pattern`, () => {
				const text = 'sldkfjsd *abc __def__ ghi';
				const tokens = marked.marked.lexer(text);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(text + '*');
				assert.deepStrictEqual(newTokens, completeTokens);
			});
		});

		suite('double star', () => {
			simpleMarkdownTestSuite('double star', '**');

			test(`double star between letters`, () => {
				const text = 'a**b';
				const tokens = marked.marked.lexer(text);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(text + '**');
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			// TODO trim these patterns from end
			test.skip(`ending in doublestar`, () => {
				const incomplete = `some text and **`;
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete.trimEnd() + '**');
				assert.deepStrictEqual(newTokens, completeTokens);
			});
		});

		suite('underscore', () => {
			simpleMarkdownTestSuite('underscore', '_');

			test(`underscore between letters`, () => {
				const text = `this_not_italics`;
				const tokens = marked.marked.lexer(text);
				const newTokens = fillInIncompleteTokens(tokens);

				assert.deepStrictEqual(newTokens, tokens);
			});
		});

		suite('double underscore', () => {
			simpleMarkdownTestSuite('double underscore', '__');

			test(`double underscore between letters`, () => {
				const text = `this__not__bold`;
				const tokens = marked.marked.lexer(text);
				const newTokens = fillInIncompleteTokens(tokens);

				assert.deepStrictEqual(newTokens, tokens);
			});
		});

		suite('link', () => {
			test('incomplete link text', () => {
				const incomplete = 'abc [text';
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete + '](https://microsoft.com)');
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test('incomplete link target', () => {
				const incomplete = 'foo [text](http://microsoft';
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete + ')');
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test('incomplete link target 2', () => {
				const incomplete = 'foo [text](http://microsoft.com';
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete + ')');
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test('incomplete link target with extra stuff', () => {
				const incomplete = '[before `text` after](http://microsoft.com';
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete + ')');
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test('incomplete link target with extra stuff and incomplete arg', () => {
				const incomplete = '[before `text` after](http://microsoft.com "more text ';
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete + '")');
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test('incomplete link target with incomplete arg', () => {
				const incomplete = 'foo [text](http://microsoft.com "more text here ';
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete + '")');
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test('incomplete link target with incomplete arg 2', () => {
				const incomplete = '[text](command:vscode.openRelativePath "arg';
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete + '")');
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test('incomplete link target with complete arg', () => {
				const incomplete = 'foo [text](http://microsoft.com "more text here"';
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete + ')');
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test('link text with incomplete codespan', () => {
				const incomplete = `text [\`codespan`;
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete + '`](https://microsoft.com)');
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test('link text with incomplete stuff', () => {
				const incomplete = `text [more text \`codespan\` text **bold`;
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete + '**](https://microsoft.com)');
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test('Looks like incomplete link target but isn\'t', () => {
				const complete = '**bold** `codespan` text](';
				const tokens = marked.marked.lexer(complete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(complete);
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test.skip('incomplete link in list', () => {
				const incomplete = '- [text';
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				const completeTokens = marked.marked.lexer(incomplete + '](https://microsoft.com)');
				assert.deepStrictEqual(newTokens, completeTokens);
			});

			test('square brace between letters', () => {
				const incomplete = 'a[b';
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				assert.deepStrictEqual(newTokens, tokens);
			});

			test('square brace on previous line', () => {
				const incomplete = 'text[\nmore text';
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				assert.deepStrictEqual(newTokens, tokens);
			});

			test('square braces in text', () => {
				const incomplete = 'hello [what] is going on';
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				assert.deepStrictEqual(newTokens, tokens);
			});

			test('complete link', () => {
				const incomplete = 'text [link](http://microsoft.com)';
				const tokens = marked.marked.lexer(incomplete);
				const newTokens = fillInIncompleteTokens(tokens);

				assert.deepStrictEqual(newTokens, tokens);
			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/progressBar.test.ts]---
Location: vscode-main/src/vs/base/test/browser/progressBar.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ProgressBar } from '../../browser/ui/progressbar/progressbar.js';
import { mainWindow } from '../../browser/window.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../common/utils.js';

suite('ProgressBar', () => {
	let fixture: HTMLElement;

	setup(() => {
		fixture = document.createElement('div');
		mainWindow.document.body.appendChild(fixture);
	});

	teardown(() => {
		fixture.remove();
	});

	test('Progress Bar', function () {
		const bar = new ProgressBar(fixture);
		assert(bar.infinite());
		assert(bar.total(100));
		assert(bar.worked(50));
		assert(bar.setWorked(70));
		assert(bar.worked(30));
		assert(bar.done());

		bar.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/ui/contextview/contextview.test.ts]---
Location: vscode-main/src/vs/base/test/browser/ui/contextview/contextview.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { layout, LayoutAnchorPosition } from '../../../../browser/ui/contextview/contextview.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../common/utils.js';

suite('Contextview', function () {

	test('layout', () => {
		assert.strictEqual(layout(200, 20, { offset: 0, size: 0, position: LayoutAnchorPosition.Before }), 0);
		assert.strictEqual(layout(200, 20, { offset: 50, size: 0, position: LayoutAnchorPosition.Before }), 50);
		assert.strictEqual(layout(200, 20, { offset: 200, size: 0, position: LayoutAnchorPosition.Before }), 180);

		assert.strictEqual(layout(200, 20, { offset: 0, size: 0, position: LayoutAnchorPosition.After }), 0);
		assert.strictEqual(layout(200, 20, { offset: 50, size: 0, position: LayoutAnchorPosition.After }), 30);
		assert.strictEqual(layout(200, 20, { offset: 200, size: 0, position: LayoutAnchorPosition.After }), 180);

		assert.strictEqual(layout(200, 20, { offset: 0, size: 50, position: LayoutAnchorPosition.Before }), 50);
		assert.strictEqual(layout(200, 20, { offset: 50, size: 50, position: LayoutAnchorPosition.Before }), 100);
		assert.strictEqual(layout(200, 20, { offset: 150, size: 50, position: LayoutAnchorPosition.Before }), 130);

		assert.strictEqual(layout(200, 20, { offset: 0, size: 50, position: LayoutAnchorPosition.After }), 50);
		assert.strictEqual(layout(200, 20, { offset: 50, size: 50, position: LayoutAnchorPosition.After }), 30);
		assert.strictEqual(layout(200, 20, { offset: 150, size: 50, position: LayoutAnchorPosition.After }), 130);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/ui/grid/grid.test.ts]---
Location: vscode-main/src/vs/base/test/browser/ui/grid/grid.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { createSerializedGrid, Direction, getRelativeLocation, Grid, GridNode, GridNodeDescriptor, ISerializableView, isGridBranchNode, IViewDeserializer, Orientation, sanitizeGridNodeDescriptor, SerializableGrid, Sizing } from '../../../../browser/ui/grid/grid.js';
import { Event } from '../../../../common/event.js';
import { deepClone } from '../../../../common/objects.js';
import { nodesToArrays, TestView } from './util.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../common/utils.js';
import { DisposableStore } from '../../../../common/lifecycle.js';

// Simple example:
//
//  +-----+---------------+
//  |  4  |      2        |
//  +-----+---------+-----+
//  |        1      |     |
//  +---------------+  3  |
//  |        5      |     |
//  +---------------+-----+
//
//  V
//  +-H
//  | +-4
//  | +-2
//  +-H
//    +-V
//    | +-1
//    | +-5
//    +-3

suite('Grid', function () {

	const store = ensureNoDisposablesAreLeakedInTestSuite();
	let container: HTMLElement;

	setup(function () {
		container = document.createElement('div');
		container.style.position = 'absolute';
		container.style.width = `${800}px`;
		container.style.height = `${600}px`;
	});

	test('getRelativeLocation', () => {
		assert.deepStrictEqual(getRelativeLocation(Orientation.VERTICAL, [0], Direction.Up), [0]);
		assert.deepStrictEqual(getRelativeLocation(Orientation.VERTICAL, [0], Direction.Down), [1]);
		assert.deepStrictEqual(getRelativeLocation(Orientation.VERTICAL, [0], Direction.Left), [0, 0]);
		assert.deepStrictEqual(getRelativeLocation(Orientation.VERTICAL, [0], Direction.Right), [0, 1]);

		assert.deepStrictEqual(getRelativeLocation(Orientation.HORIZONTAL, [0], Direction.Up), [0, 0]);
		assert.deepStrictEqual(getRelativeLocation(Orientation.HORIZONTAL, [0], Direction.Down), [0, 1]);
		assert.deepStrictEqual(getRelativeLocation(Orientation.HORIZONTAL, [0], Direction.Left), [0]);
		assert.deepStrictEqual(getRelativeLocation(Orientation.HORIZONTAL, [0], Direction.Right), [1]);

		assert.deepStrictEqual(getRelativeLocation(Orientation.VERTICAL, [4], Direction.Up), [4]);
		assert.deepStrictEqual(getRelativeLocation(Orientation.VERTICAL, [4], Direction.Down), [5]);
		assert.deepStrictEqual(getRelativeLocation(Orientation.VERTICAL, [4], Direction.Left), [4, 0]);
		assert.deepStrictEqual(getRelativeLocation(Orientation.VERTICAL, [4], Direction.Right), [4, 1]);

		assert.deepStrictEqual(getRelativeLocation(Orientation.VERTICAL, [0, 0], Direction.Up), [0, 0, 0]);
		assert.deepStrictEqual(getRelativeLocation(Orientation.VERTICAL, [0, 0], Direction.Down), [0, 0, 1]);
		assert.deepStrictEqual(getRelativeLocation(Orientation.VERTICAL, [0, 0], Direction.Left), [0, 0]);
		assert.deepStrictEqual(getRelativeLocation(Orientation.VERTICAL, [0, 0], Direction.Right), [0, 1]);

		assert.deepStrictEqual(getRelativeLocation(Orientation.VERTICAL, [1, 2], Direction.Up), [1, 2, 0]);
		assert.deepStrictEqual(getRelativeLocation(Orientation.VERTICAL, [1, 2], Direction.Down), [1, 2, 1]);
		assert.deepStrictEqual(getRelativeLocation(Orientation.VERTICAL, [1, 2], Direction.Left), [1, 2]);
		assert.deepStrictEqual(getRelativeLocation(Orientation.VERTICAL, [1, 2], Direction.Right), [1, 3]);

		assert.deepStrictEqual(getRelativeLocation(Orientation.VERTICAL, [1, 2, 3], Direction.Up), [1, 2, 3]);
		assert.deepStrictEqual(getRelativeLocation(Orientation.VERTICAL, [1, 2, 3], Direction.Down), [1, 2, 4]);
		assert.deepStrictEqual(getRelativeLocation(Orientation.VERTICAL, [1, 2, 3], Direction.Left), [1, 2, 3, 0]);
		assert.deepStrictEqual(getRelativeLocation(Orientation.VERTICAL, [1, 2, 3], Direction.Right), [1, 2, 3, 1]);
	});

	test('empty', () => {
		const view1 = store.add(new TestView(100, Number.MAX_VALUE, 100, Number.MAX_VALUE));
		const gridview = store.add(new Grid(view1));
		container.appendChild(gridview.element);
		gridview.layout(800, 600);

		assert.deepStrictEqual(view1.size, [800, 600]);
	});

	test('two views vertically', function () {
		const view1 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new Grid(view1));
		container.appendChild(grid.element);
		grid.layout(800, 600);
		assert.deepStrictEqual(view1.size, [800, 600]);

		const view2 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view2, 200, view1, Direction.Up);
		assert.deepStrictEqual(view1.size, [800, 400]);
		assert.deepStrictEqual(view2.size, [800, 200]);
	});

	test('two views horizontally', function () {
		const view1 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new Grid(view1));
		container.appendChild(grid.element);

		grid.layout(800, 600);
		assert.deepStrictEqual(view1.size, [800, 600]);

		const view2 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view2, 300, view1, Direction.Right);
		assert.deepStrictEqual(view1.size, [500, 600]);
		assert.deepStrictEqual(view2.size, [300, 600]);
	});

	test('simple layout', function () {
		const view1 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new Grid(view1));
		container.appendChild(grid.element);

		grid.layout(800, 600);
		assert.deepStrictEqual(view1.size, [800, 600]);

		const view2 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view2, 200, view1, Direction.Up);
		assert.deepStrictEqual(view1.size, [800, 400]);
		assert.deepStrictEqual(view2.size, [800, 200]);

		const view3 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view3, 200, view1, Direction.Right);
		assert.deepStrictEqual(view1.size, [600, 400]);
		assert.deepStrictEqual(view2.size, [800, 200]);
		assert.deepStrictEqual(view3.size, [200, 400]);

		const view4 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view4, 200, view2, Direction.Left);
		assert.deepStrictEqual(view1.size, [600, 400]);
		assert.deepStrictEqual(view2.size, [600, 200]);
		assert.deepStrictEqual(view3.size, [200, 400]);
		assert.deepStrictEqual(view4.size, [200, 200]);

		const view5 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view5, 100, view1, Direction.Down);
		assert.deepStrictEqual(view1.size, [600, 300]);
		assert.deepStrictEqual(view2.size, [600, 200]);
		assert.deepStrictEqual(view3.size, [200, 400]);
		assert.deepStrictEqual(view4.size, [200, 200]);
		assert.deepStrictEqual(view5.size, [600, 100]);
	});

	test('another simple layout with automatic size distribution', function () {
		const view1 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new Grid(view1));
		container.appendChild(grid.element);

		grid.layout(800, 600);
		assert.deepStrictEqual(view1.size, [800, 600]);

		const view2 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view2, Sizing.Distribute, view1, Direction.Left);
		assert.deepStrictEqual(view1.size, [400, 600]);
		assert.deepStrictEqual(view2.size, [400, 600]);

		const view3 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view3, Sizing.Distribute, view1, Direction.Right);
		assert.deepStrictEqual(view1.size, [266, 600]);
		assert.deepStrictEqual(view2.size, [266, 600]);
		assert.deepStrictEqual(view3.size, [268, 600]);

		const view4 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view4, Sizing.Distribute, view2, Direction.Down);
		assert.deepStrictEqual(view1.size, [266, 600]);
		assert.deepStrictEqual(view2.size, [266, 300]);
		assert.deepStrictEqual(view3.size, [268, 600]);
		assert.deepStrictEqual(view4.size, [266, 300]);

		const view5 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view5, Sizing.Distribute, view3, Direction.Up);
		assert.deepStrictEqual(view1.size, [266, 600]);
		assert.deepStrictEqual(view2.size, [266, 300]);
		assert.deepStrictEqual(view3.size, [268, 300]);
		assert.deepStrictEqual(view4.size, [266, 300]);
		assert.deepStrictEqual(view5.size, [268, 300]);

		const view6 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view6, Sizing.Distribute, view3, Direction.Down);
		assert.deepStrictEqual(view1.size, [266, 600]);
		assert.deepStrictEqual(view2.size, [266, 300]);
		assert.deepStrictEqual(view3.size, [268, 200]);
		assert.deepStrictEqual(view4.size, [266, 300]);
		assert.deepStrictEqual(view5.size, [268, 200]);
		assert.deepStrictEqual(view6.size, [268, 200]);
	});

	test('another simple layout with split size distribution', function () {
		const view1 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new Grid(view1));
		container.appendChild(grid.element);

		grid.layout(800, 600);
		assert.deepStrictEqual(view1.size, [800, 600]);

		const view2 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view2, Sizing.Split, view1, Direction.Left);
		assert.deepStrictEqual(view1.size, [400, 600]);
		assert.deepStrictEqual(view2.size, [400, 600]);

		const view3 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view3, Sizing.Split, view1, Direction.Right);
		assert.deepStrictEqual(view1.size, [200, 600]);
		assert.deepStrictEqual(view2.size, [400, 600]);
		assert.deepStrictEqual(view3.size, [200, 600]);

		const view4 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view4, Sizing.Split, view2, Direction.Down);
		assert.deepStrictEqual(view1.size, [200, 600]);
		assert.deepStrictEqual(view2.size, [400, 300]);
		assert.deepStrictEqual(view3.size, [200, 600]);
		assert.deepStrictEqual(view4.size, [400, 300]);

		const view5 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view5, Sizing.Split, view3, Direction.Up);
		assert.deepStrictEqual(view1.size, [200, 600]);
		assert.deepStrictEqual(view2.size, [400, 300]);
		assert.deepStrictEqual(view3.size, [200, 300]);
		assert.deepStrictEqual(view4.size, [400, 300]);
		assert.deepStrictEqual(view5.size, [200, 300]);

		const view6 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view6, Sizing.Split, view3, Direction.Down);
		assert.deepStrictEqual(view1.size, [200, 600]);
		assert.deepStrictEqual(view2.size, [400, 300]);
		assert.deepStrictEqual(view3.size, [200, 150]);
		assert.deepStrictEqual(view4.size, [400, 300]);
		assert.deepStrictEqual(view5.size, [200, 300]);
		assert.deepStrictEqual(view6.size, [200, 150]);
	});

	test('3/2 layout with split', function () {
		const view1 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new Grid(view1));
		container.appendChild(grid.element);

		grid.layout(800, 600);
		assert.deepStrictEqual(view1.size, [800, 600]);

		const view2 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view2, Sizing.Split, view1, Direction.Down);
		assert.deepStrictEqual(view1.size, [800, 300]);
		assert.deepStrictEqual(view2.size, [800, 300]);

		const view3 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view3, Sizing.Split, view2, Direction.Right);
		assert.deepStrictEqual(view1.size, [800, 300]);
		assert.deepStrictEqual(view2.size, [400, 300]);
		assert.deepStrictEqual(view3.size, [400, 300]);

		const view4 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view4, Sizing.Split, view1, Direction.Right);
		assert.deepStrictEqual(view1.size, [400, 300]);
		assert.deepStrictEqual(view2.size, [400, 300]);
		assert.deepStrictEqual(view3.size, [400, 300]);
		assert.deepStrictEqual(view4.size, [400, 300]);

		const view5 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view5, Sizing.Split, view1, Direction.Right);
		assert.deepStrictEqual(view1.size, [200, 300]);
		assert.deepStrictEqual(view2.size, [400, 300]);
		assert.deepStrictEqual(view3.size, [400, 300]);
		assert.deepStrictEqual(view4.size, [400, 300]);
		assert.deepStrictEqual(view5.size, [200, 300]);
	});

	test('sizing should be correct after branch demotion #50564', function () {
		const view1 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new Grid(view1));
		container.appendChild(grid.element);

		grid.layout(800, 600);

		const view2 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view2, Sizing.Split, view1, Direction.Right);

		const view3 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view3, Sizing.Split, view2, Direction.Down);

		const view4 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view4, Sizing.Split, view2, Direction.Right);
		assert.deepStrictEqual(view1.size, [400, 600]);
		assert.deepStrictEqual(view2.size, [200, 300]);
		assert.deepStrictEqual(view3.size, [400, 300]);
		assert.deepStrictEqual(view4.size, [200, 300]);

		grid.removeView(view3);
		assert.deepStrictEqual(view1.size, [400, 600]);
		assert.deepStrictEqual(view2.size, [200, 600]);
		assert.deepStrictEqual(view4.size, [200, 600]);
	});

	test('sizing should be correct after branch demotion #50675', function () {
		const view1 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new Grid(view1));
		container.appendChild(grid.element);

		grid.layout(800, 600);

		const view2 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view2, Sizing.Distribute, view1, Direction.Down);

		const view3 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view3, Sizing.Distribute, view2, Direction.Down);

		const view4 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view4, Sizing.Distribute, view3, Direction.Right);
		assert.deepStrictEqual(view1.size, [800, 200]);
		assert.deepStrictEqual(view2.size, [800, 200]);
		assert.deepStrictEqual(view3.size, [400, 200]);
		assert.deepStrictEqual(view4.size, [400, 200]);

		grid.removeView(view3, Sizing.Distribute);
		assert.deepStrictEqual(view1.size, [800, 200]);
		assert.deepStrictEqual(view2.size, [800, 200]);
		assert.deepStrictEqual(view4.size, [800, 200]);
	});

	test('getNeighborViews should work on single view layout', function () {
		const view1 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new Grid(view1));
		container.appendChild(grid.element);

		grid.layout(800, 600);

		assert.deepStrictEqual(grid.getNeighborViews(view1, Direction.Up), []);
		assert.deepStrictEqual(grid.getNeighborViews(view1, Direction.Right), []);
		assert.deepStrictEqual(grid.getNeighborViews(view1, Direction.Down), []);
		assert.deepStrictEqual(grid.getNeighborViews(view1, Direction.Left), []);

		assert.deepStrictEqual(grid.getNeighborViews(view1, Direction.Up, true), [view1]);
		assert.deepStrictEqual(grid.getNeighborViews(view1, Direction.Right, true), [view1]);
		assert.deepStrictEqual(grid.getNeighborViews(view1, Direction.Down, true), [view1]);
		assert.deepStrictEqual(grid.getNeighborViews(view1, Direction.Left, true), [view1]);
	});

	test('getNeighborViews should work on simple layout', function () {
		const view1 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new Grid(view1));
		container.appendChild(grid.element);

		grid.layout(800, 600);

		const view2 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view2, Sizing.Distribute, view1, Direction.Down);

		const view3 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view3, Sizing.Distribute, view2, Direction.Down);

		assert.deepStrictEqual(grid.getNeighborViews(view1, Direction.Up), []);
		assert.deepStrictEqual(grid.getNeighborViews(view1, Direction.Right), []);
		assert.deepStrictEqual(grid.getNeighborViews(view1, Direction.Down), [view2]);
		assert.deepStrictEqual(grid.getNeighborViews(view1, Direction.Left), []);

		assert.deepStrictEqual(grid.getNeighborViews(view1, Direction.Up, true), [view3]);
		assert.deepStrictEqual(grid.getNeighborViews(view1, Direction.Right, true), [view1]);
		assert.deepStrictEqual(grid.getNeighborViews(view1, Direction.Down, true), [view2]);
		assert.deepStrictEqual(grid.getNeighborViews(view1, Direction.Left, true), [view1]);

		assert.deepStrictEqual(grid.getNeighborViews(view2, Direction.Up), [view1]);
		assert.deepStrictEqual(grid.getNeighborViews(view2, Direction.Right), []);
		assert.deepStrictEqual(grid.getNeighborViews(view2, Direction.Down), [view3]);
		assert.deepStrictEqual(grid.getNeighborViews(view2, Direction.Left), []);

		assert.deepStrictEqual(grid.getNeighborViews(view2, Direction.Up, true), [view1]);
		assert.deepStrictEqual(grid.getNeighborViews(view2, Direction.Right, true), [view2]);
		assert.deepStrictEqual(grid.getNeighborViews(view2, Direction.Down, true), [view3]);
		assert.deepStrictEqual(grid.getNeighborViews(view2, Direction.Left, true), [view2]);

		assert.deepStrictEqual(grid.getNeighborViews(view3, Direction.Up), [view2]);
		assert.deepStrictEqual(grid.getNeighborViews(view3, Direction.Right), []);
		assert.deepStrictEqual(grid.getNeighborViews(view3, Direction.Down), []);
		assert.deepStrictEqual(grid.getNeighborViews(view3, Direction.Left), []);

		assert.deepStrictEqual(grid.getNeighborViews(view3, Direction.Up, true), [view2]);
		assert.deepStrictEqual(grid.getNeighborViews(view3, Direction.Right, true), [view3]);
		assert.deepStrictEqual(grid.getNeighborViews(view3, Direction.Down, true), [view1]);
		assert.deepStrictEqual(grid.getNeighborViews(view3, Direction.Left, true), [view3]);
	});

	test('getNeighborViews should work on a complex layout', function () {
		const view1 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new Grid(view1));
		container.appendChild(grid.element);

		grid.layout(800, 600);

		const view2 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view2, Sizing.Distribute, view1, Direction.Down);

		const view3 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view3, Sizing.Distribute, view2, Direction.Down);

		const view4 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view4, Sizing.Distribute, view2, Direction.Right);

		const view5 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view5, Sizing.Distribute, view4, Direction.Down);

		assert.deepStrictEqual(grid.getNeighborViews(view1, Direction.Up), []);
		assert.deepStrictEqual(grid.getNeighborViews(view1, Direction.Right), []);
		assert.deepStrictEqual(grid.getNeighborViews(view1, Direction.Down), [view2, view4]);
		assert.deepStrictEqual(grid.getNeighborViews(view1, Direction.Left), []);
		assert.deepStrictEqual(grid.getNeighborViews(view2, Direction.Up), [view1]);
		assert.deepStrictEqual(grid.getNeighborViews(view2, Direction.Right), [view4, view5]);
		assert.deepStrictEqual(grid.getNeighborViews(view2, Direction.Down), [view3]);
		assert.deepStrictEqual(grid.getNeighborViews(view2, Direction.Left), []);
		assert.deepStrictEqual(grid.getNeighborViews(view4, Direction.Up), [view1]);
		assert.deepStrictEqual(grid.getNeighborViews(view4, Direction.Right), []);
		assert.deepStrictEqual(grid.getNeighborViews(view4, Direction.Down), [view5]);
		assert.deepStrictEqual(grid.getNeighborViews(view4, Direction.Left), [view2]);
		assert.deepStrictEqual(grid.getNeighborViews(view5, Direction.Up), [view4]);
		assert.deepStrictEqual(grid.getNeighborViews(view5, Direction.Right), []);
		assert.deepStrictEqual(grid.getNeighborViews(view5, Direction.Down), [view3]);
		assert.deepStrictEqual(grid.getNeighborViews(view5, Direction.Left), [view2]);
		assert.deepStrictEqual(grid.getNeighborViews(view3, Direction.Up), [view2, view5]);
		assert.deepStrictEqual(grid.getNeighborViews(view3, Direction.Right), []);
		assert.deepStrictEqual(grid.getNeighborViews(view3, Direction.Down), []);
		assert.deepStrictEqual(grid.getNeighborViews(view3, Direction.Left), []);
	});

	test('getNeighborViews should work on another simple layout', function () {
		const view1 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new Grid(view1));
		container.appendChild(grid.element);

		grid.layout(800, 600);

		const view2 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view2, Sizing.Distribute, view1, Direction.Right);

		const view3 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view3, Sizing.Distribute, view2, Direction.Down);

		const view4 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view4, Sizing.Distribute, view2, Direction.Right);

		assert.deepStrictEqual(grid.getNeighborViews(view4, Direction.Up), []);
		assert.deepStrictEqual(grid.getNeighborViews(view4, Direction.Right), []);
		assert.deepStrictEqual(grid.getNeighborViews(view4, Direction.Down), [view3]);
		assert.deepStrictEqual(grid.getNeighborViews(view4, Direction.Left), [view2]);
	});

	test('getNeighborViews should only return immediate neighbors', function () {
		const view1 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new Grid(view1));
		container.appendChild(grid.element);

		grid.layout(800, 600);

		const view2 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view2, Sizing.Distribute, view1, Direction.Right);

		const view3 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view3, Sizing.Distribute, view2, Direction.Down);

		const view4 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view4, Sizing.Distribute, view2, Direction.Right);

		assert.deepStrictEqual(grid.getNeighborViews(view1, Direction.Right), [view2, view3]);
	});

	test('hiding splitviews and restoring sizes', function () {
		const view1 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new Grid(view1));
		container.appendChild(grid.element);

		grid.layout(800, 600);

		const view2 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view2, Sizing.Distribute, view1, Direction.Right);

		const view3 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view3, Sizing.Distribute, view2, Direction.Down);

		const view4 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view4, Sizing.Distribute, view2, Direction.Right);

		const size1 = view1.size;
		const size2 = view2.size;
		const size3 = view3.size;
		const size4 = view4.size;

		grid.maximizeView(view1);

		// Views 2, 3, 4 are hidden
		// Splitview (2,4) and ((2,4),3) are hidden
		assert.deepStrictEqual(view1.size, [800, 600]);
		assert.deepStrictEqual(view2.size, [0, 0]);
		assert.deepStrictEqual(view3.size, [0, 0]);
		assert.deepStrictEqual(view4.size, [0, 0]);

		grid.exitMaximizedView();

		assert.deepStrictEqual(view1.size, size1);
		assert.deepStrictEqual(view2.size, size2);
		assert.deepStrictEqual(view3.size, size3);
		assert.deepStrictEqual(view4.size, size4);

		// Views 1, 3, 4 are hidden
		// All splitviews are still visible => only orthogonalsize is 0
		grid.maximizeView(view2);

		assert.deepStrictEqual(view1.size, [0, 600]);
		assert.deepStrictEqual(view2.size, [800, 600]);
		assert.deepStrictEqual(view3.size, [800, 0]);
		assert.deepStrictEqual(view4.size, [0, 600]);

		grid.exitMaximizedView();

		assert.deepStrictEqual(view1.size, size1);
		assert.deepStrictEqual(view2.size, size2);
		assert.deepStrictEqual(view3.size, size3);
		assert.deepStrictEqual(view4.size, size4);
	});

	test('hasMaximizedView', function () {
		const view1 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new Grid(view1));
		container.appendChild(grid.element);

		grid.layout(800, 600);

		const view2 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view2, Sizing.Distribute, view1, Direction.Right);

		const view3 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view3, Sizing.Distribute, view2, Direction.Down);

		const view4 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view4, Sizing.Distribute, view2, Direction.Right);

		function checkIsMaximized(view: TestView) {
			grid.maximizeView(view);

			assert.deepStrictEqual(grid.hasMaximizedView(), true);

			// When a view is maximized, no view can be expanded even if it is maximized
			assert.deepStrictEqual(grid.isViewExpanded(view1), false);
			assert.deepStrictEqual(grid.isViewExpanded(view2), false);
			assert.deepStrictEqual(grid.isViewExpanded(view3), false);
			assert.deepStrictEqual(grid.isViewExpanded(view4), false);

			grid.exitMaximizedView();

			assert.deepStrictEqual(grid.hasMaximizedView(), false);
		}

		checkIsMaximized(view1);
		checkIsMaximized(view2);
		checkIsMaximized(view3);
		checkIsMaximized(view4);
	});

	test('Changes to the grid unmaximize the view', function () {
		const view1 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new Grid(view1));
		container.appendChild(grid.element);

		grid.layout(800, 600);

		const view2 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view2, Sizing.Distribute, view1, Direction.Right);

		const view3 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view3, Sizing.Distribute, view2, Direction.Down);

		const view4 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));

		// Adding a view unmaximizes the view
		grid.maximizeView(view1);
		assert.deepStrictEqual(grid.hasMaximizedView(), true);
		grid.addView(view4, Sizing.Distribute, view2, Direction.Right);

		assert.deepStrictEqual(grid.hasMaximizedView(), false);
		assert.deepStrictEqual(grid.isViewVisible(view1), true);
		assert.deepStrictEqual(grid.isViewVisible(view2), true);
		assert.deepStrictEqual(grid.isViewVisible(view3), true);
		assert.deepStrictEqual(grid.isViewVisible(view4), true);

		// Removing a view unmaximizes the view
		grid.maximizeView(view1);
		assert.deepStrictEqual(grid.hasMaximizedView(), true);
		grid.removeView(view4);

		assert.deepStrictEqual(grid.hasMaximizedView(), false);
		assert.deepStrictEqual(grid.isViewVisible(view1), true);
		assert.deepStrictEqual(grid.isViewVisible(view2), true);
		assert.deepStrictEqual(grid.isViewVisible(view3), true);

		// Changing the visibility of any view while a view is maximized, unmaximizes the view
		grid.maximizeView(view1);
		assert.deepStrictEqual(grid.hasMaximizedView(), true);
		grid.setViewVisible(view3, true);

		assert.deepStrictEqual(grid.hasMaximizedView(), false);
		assert.deepStrictEqual(grid.isViewVisible(view1), true);
		assert.deepStrictEqual(grid.isViewVisible(view2), true);
		assert.deepStrictEqual(grid.isViewVisible(view3), true);
	});

	test('Changes to the grid sizing unmaximize the view', function () {
		const view1 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new Grid(view1));
		container.appendChild(grid.element);

		grid.layout(800, 600);

		const view2 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view2, Sizing.Distribute, view1, Direction.Right);

		const view3 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view3, Sizing.Distribute, view2, Direction.Down);

		const view4 = store.add(new TestView(50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view4, Sizing.Distribute, view2, Direction.Right);

		// Maximizing a different view unmaximizes the current one and maximizes the new one
		grid.maximizeView(view1);
		assert.deepStrictEqual(grid.hasMaximizedView(), true);
		grid.maximizeView(view2);

		assert.deepStrictEqual(grid.hasMaximizedView(), true);
		assert.deepStrictEqual(grid.isViewVisible(view1), false);
		assert.deepStrictEqual(grid.isViewVisible(view2), true);
		assert.deepStrictEqual(grid.isViewVisible(view3), false);
		assert.deepStrictEqual(grid.isViewVisible(view4), false);

		// Distributing the size unmaximizes the view
		grid.maximizeView(view1);
		assert.deepStrictEqual(grid.hasMaximizedView(), true);
		grid.distributeViewSizes();

		assert.deepStrictEqual(grid.hasMaximizedView(), false);
		assert.deepStrictEqual(grid.isViewVisible(view1), true);
		assert.deepStrictEqual(grid.isViewVisible(view2), true);
		assert.deepStrictEqual(grid.isViewVisible(view3), true);
		assert.deepStrictEqual(grid.isViewVisible(view4), true);

		// Expanding a different view unmaximizes the view
		grid.maximizeView(view1);
		assert.deepStrictEqual(grid.hasMaximizedView(), true);
		grid.expandView(view2);

		assert.deepStrictEqual(grid.hasMaximizedView(), false);
		assert.deepStrictEqual(grid.isViewVisible(view1), true);
		assert.deepStrictEqual(grid.isViewVisible(view2), true);
		assert.deepStrictEqual(grid.isViewVisible(view3), true);
		assert.deepStrictEqual(grid.isViewVisible(view4), true);

		// Expanding the maximized view unmaximizes the view
		grid.maximizeView(view1);
		assert.deepStrictEqual(grid.hasMaximizedView(), true);
		grid.expandView(view1);

		assert.deepStrictEqual(grid.hasMaximizedView(), false);
		assert.deepStrictEqual(grid.isViewVisible(view1), true);
		assert.deepStrictEqual(grid.isViewVisible(view2), true);
		assert.deepStrictEqual(grid.isViewVisible(view3), true);
		assert.deepStrictEqual(grid.isViewVisible(view4), true);
	});
});

class TestSerializableView extends TestView implements ISerializableView {

	constructor(
		readonly name: string,
		minimumWidth: number,
		maximumWidth: number,
		minimumHeight: number,
		maximumHeight: number
	) {
		super(minimumWidth, maximumWidth, minimumHeight, maximumHeight);
	}

	toJSON() {
		return { name: this.name };
	}
}

class TestViewDeserializer implements IViewDeserializer<TestSerializableView> {

	private views = new Map<string, TestSerializableView>();

	constructor(private readonly store: Pick<DisposableStore, 'add'>) { }

	fromJSON(json: any): TestSerializableView {
		const view = this.store.add(new TestSerializableView(json.name, 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		this.views.set(json.name, view);
		return view;
	}

	getView(id: string): TestSerializableView {
		const view = this.views.get(id);
		if (!view) {
			throw new Error('Unknown view');
		}
		return view;
	}
}

function nodesToNames(node: GridNode<TestSerializableView>): any {
	if (isGridBranchNode(node)) {
		return node.children.map(nodesToNames);
	} else {
		return node.view.name;
	}
}

suite('SerializableGrid', function () {

	const store = ensureNoDisposablesAreLeakedInTestSuite();
	let container: HTMLElement;

	setup(function () {
		container = document.createElement('div');
		container.style.position = 'absolute';
		container.style.width = `${800}px`;
		container.style.height = `${600}px`;
	});

	test('serialize empty', function () {
		const view1 = store.add(new TestSerializableView('view1', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new SerializableGrid(view1));
		container.appendChild(grid.element);
		grid.layout(800, 600);

		const actual = grid.serialize();
		assert.deepStrictEqual(actual, {
			orientation: 0,
			width: 800,
			height: 600,
			root: {
				type: 'branch',
				data: [
					{
						type: 'leaf',
						data: {
							name: 'view1',
						},
						size: 600
					}
				],
				size: 800
			}
		});
	});

	test('serialize simple layout', function () {
		const view1 = store.add(new TestSerializableView('view1', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new SerializableGrid(view1));
		container.appendChild(grid.element);
		grid.layout(800, 600);

		const view2 = store.add(new TestSerializableView('view2', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view2, 200, view1, Direction.Up);

		const view3 = store.add(new TestSerializableView('view3', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view3, 200, view1, Direction.Right);

		const view4 = store.add(new TestSerializableView('view4', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view4, 200, view2, Direction.Left);

		const view5 = store.add(new TestSerializableView('view5', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view5, 100, view1, Direction.Down);

		assert.deepStrictEqual(grid.serialize(), {
			orientation: 0,
			width: 800,
			height: 600,
			root: {
				type: 'branch',
				data: [
					{
						type: 'branch',
						data: [
							{ type: 'leaf', data: { name: 'view4' }, size: 200 },
							{ type: 'leaf', data: { name: 'view2' }, size: 600 }
						],
						size: 200
					},
					{
						type: 'branch',
						data: [
							{
								type: 'branch',
								data: [
									{ type: 'leaf', data: { name: 'view1' }, size: 300 },
									{ type: 'leaf', data: { name: 'view5' }, size: 100 }
								],
								size: 600
							},
							{ type: 'leaf', data: { name: 'view3' }, size: 200 }
						],
						size: 400
					}
				],
				size: 800
			}
		});
	});

	test('deserialize empty', function () {
		const view1 = store.add(new TestSerializableView('view1', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new SerializableGrid(view1));
		container.appendChild(grid.element);
		grid.layout(800, 600);

		const json = grid.serialize();
		grid.dispose();

		const deserializer = new TestViewDeserializer(store);
		const grid2 = store.add(SerializableGrid.deserialize(json, deserializer));
		grid2.layout(800, 600);

		assert.deepStrictEqual(nodesToNames(grid2.getViews()), ['view1']);
	});

	test('deserialize simple layout', function () {
		const view1 = store.add(new TestSerializableView('view1', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new SerializableGrid(view1));
		container.appendChild(grid.element);

		grid.layout(800, 600);

		const view2 = store.add(new TestSerializableView('view2', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view2, 200, view1, Direction.Up);

		const view3 = store.add(new TestSerializableView('view3', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view3, 200, view1, Direction.Right);

		const view4 = store.add(new TestSerializableView('view4', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view4, 200, view2, Direction.Left);

		const view5 = store.add(new TestSerializableView('view5', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view5, 100, view1, Direction.Down);

		const json = grid.serialize();
		grid.dispose();

		const deserializer = new TestViewDeserializer(store);
		const grid2 = store.add(SerializableGrid.deserialize(json, deserializer));

		const view1Copy = deserializer.getView('view1');
		const view2Copy = deserializer.getView('view2');
		const view3Copy = deserializer.getView('view3');
		const view4Copy = deserializer.getView('view4');
		const view5Copy = deserializer.getView('view5');

		assert.deepStrictEqual(nodesToArrays(grid2.getViews()), [[view4Copy, view2Copy], [[view1Copy, view5Copy], view3Copy]]);

		grid2.layout(800, 600);

		assert.deepStrictEqual(view1Copy.size, [600, 300]);
		assert.deepStrictEqual(view2Copy.size, [600, 200]);
		assert.deepStrictEqual(view3Copy.size, [200, 400]);
		assert.deepStrictEqual(view4Copy.size, [200, 200]);
		assert.deepStrictEqual(view5Copy.size, [600, 100]);
	});

	test('deserialize simple layout with scaling', function () {
		const view1 = store.add(new TestSerializableView('view1', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new SerializableGrid(view1));
		container.appendChild(grid.element);

		grid.layout(800, 600);

		const view2 = store.add(new TestSerializableView('view2', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view2, 200, view1, Direction.Up);

		const view3 = store.add(new TestSerializableView('view3', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view3, 200, view1, Direction.Right);

		const view4 = store.add(new TestSerializableView('view4', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view4, 200, view2, Direction.Left);

		const view5 = store.add(new TestSerializableView('view5', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view5, 100, view1, Direction.Down);

		const json = grid.serialize();
		grid.dispose();

		const deserializer = new TestViewDeserializer(store);
		const grid2 = store.add(SerializableGrid.deserialize(json, deserializer));

		const view1Copy = deserializer.getView('view1');
		const view2Copy = deserializer.getView('view2');
		const view3Copy = deserializer.getView('view3');
		const view4Copy = deserializer.getView('view4');
		const view5Copy = deserializer.getView('view5');

		grid2.layout(400, 800); // [/2, *4/3]
		assert.deepStrictEqual(view1Copy.size, [300, 400]);
		assert.deepStrictEqual(view2Copy.size, [300, 267]);
		assert.deepStrictEqual(view3Copy.size, [100, 533]);
		assert.deepStrictEqual(view4Copy.size, [100, 267]);
		assert.deepStrictEqual(view5Copy.size, [300, 133]);
	});

	test('deserialize 4 view layout (ben issue #2)', function () {
		const view1 = store.add(new TestSerializableView('view1', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new SerializableGrid(view1));
		container.appendChild(grid.element);
		grid.layout(800, 600);

		const view2 = store.add(new TestSerializableView('view2', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view2, Sizing.Split, view1, Direction.Down);

		const view3 = store.add(new TestSerializableView('view3', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view3, Sizing.Split, view2, Direction.Down);

		const view4 = store.add(new TestSerializableView('view4', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view4, Sizing.Split, view3, Direction.Right);

		const json = grid.serialize();
		grid.dispose();

		const deserializer = new TestViewDeserializer(store);
		const grid2 = store.add(SerializableGrid.deserialize(json, deserializer));

		const view1Copy = deserializer.getView('view1');
		const view2Copy = deserializer.getView('view2');
		const view3Copy = deserializer.getView('view3');
		const view4Copy = deserializer.getView('view4');

		grid2.layout(800, 600);

		assert.deepStrictEqual(view1Copy.size, [800, 300]);
		assert.deepStrictEqual(view2Copy.size, [800, 150]);
		assert.deepStrictEqual(view3Copy.size, [400, 150]);
		assert.deepStrictEqual(view4Copy.size, [400, 150]);
	});

	test('deserialize 2 view layout (ben issue #3)', function () {
		const view1 = store.add(new TestSerializableView('view1', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new SerializableGrid(view1));
		container.appendChild(grid.element);

		grid.layout(800, 600);

		const view2 = store.add(new TestSerializableView('view2', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view2, Sizing.Split, view1, Direction.Right);

		const json = grid.serialize();
		grid.dispose();

		const deserializer = new TestViewDeserializer(store);
		const grid2 = store.add(SerializableGrid.deserialize(json, deserializer));

		const view1Copy = deserializer.getView('view1');
		const view2Copy = deserializer.getView('view2');

		grid2.layout(800, 600);

		assert.deepStrictEqual(view1Copy.size, [400, 600]);
		assert.deepStrictEqual(view2Copy.size, [400, 600]);
	});

	test('deserialize simple view layout #50609', function () {
		const view1 = store.add(new TestSerializableView('view1', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new SerializableGrid(view1));
		container.appendChild(grid.element);

		grid.layout(800, 600);

		const view2 = store.add(new TestSerializableView('view2', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view2, Sizing.Split, view1, Direction.Right);

		const view3 = store.add(new TestSerializableView('view3', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view3, Sizing.Split, view2, Direction.Down);

		grid.removeView(view1, Sizing.Split);

		const json = grid.serialize();
		grid.dispose();

		const deserializer = new TestViewDeserializer(store);
		const grid2 = store.add(SerializableGrid.deserialize(json, deserializer));

		const view2Copy = deserializer.getView('view2');
		const view3Copy = deserializer.getView('view3');

		grid2.layout(800, 600);

		assert.deepStrictEqual(view2Copy.size, [800, 300]);
		assert.deepStrictEqual(view3Copy.size, [800, 300]);
	});

	test('sanitizeGridNodeDescriptor', () => {
		const nodeDescriptor: GridNodeDescriptor<any> = { groups: [{ size: 0.2 }, { size: 0.2 }, { size: 0.6, groups: [{}, {}] }] };
		const nodeDescriptorCopy = deepClone(nodeDescriptor);
		sanitizeGridNodeDescriptor(nodeDescriptorCopy, true);
		assert.deepStrictEqual(nodeDescriptorCopy, { groups: [{ size: 0.2 }, { size: 0.2 }, { size: 0.6, groups: [{ size: 0.5 }, { size: 0.5 }] }] });
	});

	test('createSerializedGrid', () => {
		const gridDescriptor = { orientation: Orientation.VERTICAL, groups: [{ size: 0.2, data: 'a' }, { size: 0.2, data: 'b' }, { size: 0.6, groups: [{ data: 'c' }, { data: 'd' }] }] };
		const serializedGrid = createSerializedGrid(gridDescriptor);
		assert.deepStrictEqual(serializedGrid, {
			root: {
				type: 'branch',
				size: undefined,
				data: [
					{ type: 'leaf', size: 0.2, data: 'a' },
					{ type: 'leaf', size: 0.2, data: 'b' },
					{
						type: 'branch', size: 0.6, data: [
							{ type: 'leaf', size: 0.5, data: 'c' },
							{ type: 'leaf', size: 0.5, data: 'd' }
						]
					}
				]
			},
			orientation: Orientation.VERTICAL,
			width: 1,
			height: 1
		});
	});

	test('createSerializedGrid - issue #85601, should not allow single children groups', () => {
		const serializedGrid = createSerializedGrid({ orientation: Orientation.HORIZONTAL, groups: [{ groups: [{}, {}], size: 0.5 }, { groups: [{}], size: 0.5 }] });
		const views: ISerializableView[] = [];
		const deserializer = new class implements IViewDeserializer<ISerializableView> {
			fromJSON(): ISerializableView {
				const view: ISerializableView = {
					element: document.createElement('div'),
					layout: () => null,
					minimumWidth: 0,
					maximumWidth: Number.POSITIVE_INFINITY,
					minimumHeight: 0,
					maximumHeight: Number.POSITIVE_INFINITY,
					onDidChange: Event.None,
					toJSON: () => ({})
				};
				views.push(view);
				return view;
			}
		};

		const grid = store.add(SerializableGrid.deserialize(serializedGrid, deserializer));
		assert.strictEqual(views.length, 3);

		// should not throw
		grid.removeView(views[2]);
	});

	test('from', () => {
		const createView = (): ISerializableView => ({
			element: document.createElement('div'),
			layout: () => null,
			minimumWidth: 0,
			maximumWidth: Number.POSITIVE_INFINITY,
			minimumHeight: 0,
			maximumHeight: Number.POSITIVE_INFINITY,
			onDidChange: Event.None,
			toJSON: () => ({})
		});

		const a = createView();
		const b = createView();
		const c = createView();
		const d = createView();

		const gridDescriptor = { orientation: Orientation.VERTICAL, groups: [{ size: 0.2, data: a }, { size: 0.2, data: b }, { size: 0.6, groups: [{ data: c }, { data: d }] }] };
		const grid = SerializableGrid.from(gridDescriptor);

		assert.deepStrictEqual(nodesToArrays(grid.getViews()), [a, b, [c, d]]);
		grid.dispose();
	});

	test('serialize should store visibility and previous size', function () {
		const view1 = store.add(new TestSerializableView('view1', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new SerializableGrid(view1));
		container.appendChild(grid.element);
		grid.layout(800, 600);

		const view2 = store.add(new TestSerializableView('view2', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view2, 200, view1, Direction.Up);

		const view3 = store.add(new TestSerializableView('view3', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view3, 200, view1, Direction.Right);

		const view4 = store.add(new TestSerializableView('view4', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view4, 200, view2, Direction.Left);

		const view5 = store.add(new TestSerializableView('view5', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view5, 100, view1, Direction.Down);

		assert.deepStrictEqual(view1.size, [600, 300]);
		assert.deepStrictEqual(view2.size, [600, 200]);
		assert.deepStrictEqual(view3.size, [200, 400]);
		assert.deepStrictEqual(view4.size, [200, 200]);
		assert.deepStrictEqual(view5.size, [600, 100]);

		grid.setViewVisible(view5, false);

		assert.deepStrictEqual(view1.size, [600, 400]);
		assert.deepStrictEqual(view2.size, [600, 200]);
		assert.deepStrictEqual(view3.size, [200, 400]);
		assert.deepStrictEqual(view4.size, [200, 200]);
		assert.deepStrictEqual(view5.size, [600, 0]);

		grid.setViewVisible(view5, true);

		assert.deepStrictEqual(view1.size, [600, 300]);
		assert.deepStrictEqual(view2.size, [600, 200]);
		assert.deepStrictEqual(view3.size, [200, 400]);
		assert.deepStrictEqual(view4.size, [200, 200]);
		assert.deepStrictEqual(view5.size, [600, 100]);

		grid.setViewVisible(view5, false);

		assert.deepStrictEqual(view1.size, [600, 400]);
		assert.deepStrictEqual(view2.size, [600, 200]);
		assert.deepStrictEqual(view3.size, [200, 400]);
		assert.deepStrictEqual(view4.size, [200, 200]);
		assert.deepStrictEqual(view5.size, [600, 0]);

		grid.setViewVisible(view5, false);

		const json = grid.serialize();
		assert.deepStrictEqual(json, {
			orientation: 0,
			width: 800,
			height: 600,
			root: {
				type: 'branch',
				data: [
					{
						type: 'branch',
						data: [
							{ type: 'leaf', data: { name: 'view4' }, size: 200 },
							{ type: 'leaf', data: { name: 'view2' }, size: 600 }
						],
						size: 200
					},
					{
						type: 'branch',
						data: [
							{
								type: 'branch',
								data: [
									{ type: 'leaf', data: { name: 'view1' }, size: 400 },
									{ type: 'leaf', data: { name: 'view5' }, size: 100, visible: false }
								],
								size: 600
							},
							{ type: 'leaf', data: { name: 'view3' }, size: 200 }
						],
						size: 400
					}
				],
				size: 800
			}
		});

		grid.dispose();

		const deserializer = new TestViewDeserializer(store);
		const grid2 = store.add(SerializableGrid.deserialize(json, deserializer));

		const view1Copy = deserializer.getView('view1');
		const view2Copy = deserializer.getView('view2');
		const view3Copy = deserializer.getView('view3');
		const view4Copy = deserializer.getView('view4');
		const view5Copy = deserializer.getView('view5');

		assert.deepStrictEqual(nodesToArrays(grid2.getViews()), [[view4Copy, view2Copy], [[view1Copy, view5Copy], view3Copy]]);

		grid2.layout(800, 600);
		assert.deepStrictEqual(view1Copy.size, [600, 400]);
		assert.deepStrictEqual(view2Copy.size, [600, 200]);
		assert.deepStrictEqual(view3Copy.size, [200, 400]);
		assert.deepStrictEqual(view4Copy.size, [200, 200]);
		assert.deepStrictEqual(view5Copy.size, [600, 0]);

		assert.deepStrictEqual(grid2.isViewVisible(view1Copy), true);
		assert.deepStrictEqual(grid2.isViewVisible(view2Copy), true);
		assert.deepStrictEqual(grid2.isViewVisible(view3Copy), true);
		assert.deepStrictEqual(grid2.isViewVisible(view4Copy), true);
		assert.deepStrictEqual(grid2.isViewVisible(view5Copy), false);

		grid2.setViewVisible(view5Copy, true);

		assert.deepStrictEqual(view1Copy.size, [600, 300]);
		assert.deepStrictEqual(view2Copy.size, [600, 200]);
		assert.deepStrictEqual(view3Copy.size, [200, 400]);
		assert.deepStrictEqual(view4Copy.size, [200, 200]);
		assert.deepStrictEqual(view5Copy.size, [600, 100]);

		assert.deepStrictEqual(grid2.isViewVisible(view1Copy), true);
		assert.deepStrictEqual(grid2.isViewVisible(view2Copy), true);
		assert.deepStrictEqual(grid2.isViewVisible(view3Copy), true);
		assert.deepStrictEqual(grid2.isViewVisible(view4Copy), true);
		assert.deepStrictEqual(grid2.isViewVisible(view5Copy), true);
	});

	test('serialize should store visibility and previous size even for first leaf', function () {
		const view1 = store.add(new TestSerializableView('view1', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		const grid = store.add(new SerializableGrid(view1));
		container.appendChild(grid.element);
		grid.layout(800, 600);

		const view2 = store.add(new TestSerializableView('view2', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view2, 200, view1, Direction.Up);

		const view3 = store.add(new TestSerializableView('view3', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view3, 200, view1, Direction.Right);

		const view4 = store.add(new TestSerializableView('view4', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view4, 200, view2, Direction.Left);

		const view5 = store.add(new TestSerializableView('view5', 50, Number.MAX_VALUE, 50, Number.MAX_VALUE));
		grid.addView(view5, 100, view1, Direction.Down);

		assert.deepStrictEqual(view1.size, [600, 300]);
		assert.deepStrictEqual(view2.size, [600, 200]);
		assert.deepStrictEqual(view3.size, [200, 400]);
		assert.deepStrictEqual(view4.size, [200, 200]);
		assert.deepStrictEqual(view5.size, [600, 100]);

		grid.setViewVisible(view4, false);

		assert.deepStrictEqual(view1.size, [600, 300]);
		assert.deepStrictEqual(view2.size, [800, 200]);
		assert.deepStrictEqual(view3.size, [200, 400]);
		assert.deepStrictEqual(view4.size, [0, 200]);
		assert.deepStrictEqual(view5.size, [600, 100]);

		const json = grid.serialize();
		assert.deepStrictEqual(json, {
			orientation: 0,
			width: 800,
			height: 600,
			root: {
				type: 'branch',
				data: [
					{
						type: 'branch',
						data: [
							{ type: 'leaf', data: { name: 'view4' }, size: 200, visible: false },
							{ type: 'leaf', data: { name: 'view2' }, size: 800 }
						],
						size: 200
					},
					{
						type: 'branch',
						data: [
							{
								type: 'branch',
								data: [
									{ type: 'leaf', data: { name: 'view1' }, size: 300 },
									{ type: 'leaf', data: { name: 'view5' }, size: 100 }
								],
								size: 600
							},
							{ type: 'leaf', data: { name: 'view3' }, size: 200 }
						],
						size: 400
					}
				],
				size: 800
			}
		});

		grid.dispose();

		const deserializer = new TestViewDeserializer(store);
		const grid2 = store.add(SerializableGrid.deserialize(json, deserializer));

		const view1Copy = deserializer.getView('view1');
		const view2Copy = deserializer.getView('view2');
		const view3Copy = deserializer.getView('view3');
		const view4Copy = deserializer.getView('view4');
		const view5Copy = deserializer.getView('view5');

		assert.deepStrictEqual(nodesToArrays(grid2.getViews()), [[view4Copy, view2Copy], [[view1Copy, view5Copy], view3Copy]]);

		grid2.layout(800, 600);
		assert.deepStrictEqual(view1Copy.size, [600, 300]);
		assert.deepStrictEqual(view2Copy.size, [800, 200]);
		assert.deepStrictEqual(view3Copy.size, [200, 400]);
		assert.deepStrictEqual(view4Copy.size, [0, 200]);
		assert.deepStrictEqual(view5Copy.size, [600, 100]);

		assert.deepStrictEqual(grid2.isViewVisible(view1Copy), true);
		assert.deepStrictEqual(grid2.isViewVisible(view2Copy), true);
		assert.deepStrictEqual(grid2.isViewVisible(view3Copy), true);
		assert.deepStrictEqual(grid2.isViewVisible(view4Copy), false);
		assert.deepStrictEqual(grid2.isViewVisible(view5Copy), true);

		grid2.setViewVisible(view4Copy, true);

		assert.deepStrictEqual(view1Copy.size, [600, 300]);
		assert.deepStrictEqual(view2Copy.size, [600, 200]);
		assert.deepStrictEqual(view3Copy.size, [200, 400]);
		assert.deepStrictEqual(view4Copy.size, [200, 200]);
		assert.deepStrictEqual(view5Copy.size, [600, 100]);

		assert.deepStrictEqual(grid2.isViewVisible(view1Copy), true);
		assert.deepStrictEqual(grid2.isViewVisible(view2Copy), true);
		assert.deepStrictEqual(grid2.isViewVisible(view3Copy), true);
		assert.deepStrictEqual(grid2.isViewVisible(view4Copy), true);
		assert.deepStrictEqual(grid2.isViewVisible(view5Copy), true);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/ui/grid/gridview.test.ts]---
Location: vscode-main/src/vs/base/test/browser/ui/grid/gridview.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { $ } from '../../../../browser/dom.js';
import { GridView, IView, Orientation, Sizing } from '../../../../browser/ui/grid/gridview.js';
import { nodesToArrays, TestView } from './util.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../common/utils.js';

suite('Gridview', function () {

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	function createGridView(): GridView {
		const gridview = store.add(new GridView());
		const container = $('.container');

		container.style.position = 'absolute';
		container.style.width = `${200}px`;
		container.style.height = `${200}px`;
		container.appendChild(gridview.element);

		return gridview;
	}

	test('empty gridview is empty', function () {
		const gridview = createGridView();
		assert.deepStrictEqual(nodesToArrays(gridview.getView()), []);
	});

	test('gridview addView', function () {
		const gridview = createGridView();

		const view = store.add(new TestView(20, 20, 20, 20));
		assert.throws(() => gridview.addView(view, 200, []), 'empty location');
		assert.throws(() => gridview.addView(view, 200, [1]), 'index overflow');
		assert.throws(() => gridview.addView(view, 200, [0, 0]), 'hierarchy overflow');

		const views = [
			store.add(new TestView(20, 20, 20, 20)),
			store.add(new TestView(20, 20, 20, 20)),
			store.add(new TestView(20, 20, 20, 20))
		];

		gridview.addView(views[0], 200, [0]);
		gridview.addView(views[1], 200, [1]);
		gridview.addView(views[2], 200, [2]);

		assert.deepStrictEqual(nodesToArrays(gridview.getView()), views);
	});

	test('gridview addView nested', function () {
		const gridview = createGridView();

		const views = [
			store.add(new TestView(20, 20, 20, 20)),
			[
				store.add(new TestView(20, 20, 20, 20)),
				store.add(new TestView(20, 20, 20, 20))
			]
		];

		gridview.addView(views[0] as IView, 200, [0]);
		gridview.addView((views[1] as TestView[])[0] as IView, 200, [1]);
		gridview.addView((views[1] as TestView[])[1] as IView, 200, [1, 1]);

		assert.deepStrictEqual(nodesToArrays(gridview.getView()), views);
	});

	test('gridview addView deep nested', function () {
		const gridview = createGridView();

		const view1 = store.add(new TestView(20, 20, 20, 20));
		gridview.addView(view1 as IView, 200, [0]);
		assert.deepStrictEqual(nodesToArrays(gridview.getView()), [view1]);

		const view2 = store.add(new TestView(20, 20, 20, 20));
		gridview.addView(view2 as IView, 200, [1]);
		assert.deepStrictEqual(nodesToArrays(gridview.getView()), [view1, view2]);

		const view3 = store.add(new TestView(20, 20, 20, 20));
		gridview.addView(view3 as IView, 200, [1, 0]);
		assert.deepStrictEqual(nodesToArrays(gridview.getView()), [view1, [view3, view2]]);

		const view4 = store.add(new TestView(20, 20, 20, 20));
		gridview.addView(view4 as IView, 200, [1, 0, 0]);
		assert.deepStrictEqual(nodesToArrays(gridview.getView()), [view1, [[view4, view3], view2]]);

		const view5 = store.add(new TestView(20, 20, 20, 20));
		gridview.addView(view5 as IView, 200, [1, 0]);
		assert.deepStrictEqual(nodesToArrays(gridview.getView()), [view1, [view5, [view4, view3], view2]]);

		const view6 = store.add(new TestView(20, 20, 20, 20));
		gridview.addView(view6 as IView, 200, [2]);
		assert.deepStrictEqual(nodesToArrays(gridview.getView()), [view1, [view5, [view4, view3], view2], view6]);

		const view7 = store.add(new TestView(20, 20, 20, 20));
		gridview.addView(view7 as IView, 200, [1, 1]);
		assert.deepStrictEqual(nodesToArrays(gridview.getView()), [view1, [view5, view7, [view4, view3], view2], view6]);

		const view8 = store.add(new TestView(20, 20, 20, 20));
		gridview.addView(view8 as IView, 200, [1, 1, 0]);
		assert.deepStrictEqual(nodesToArrays(gridview.getView()), [view1, [view5, [view8, view7], [view4, view3], view2], view6]);
	});

	test('simple layout', function () {
		const gridview = createGridView();
		gridview.layout(800, 600);

		const view1 = store.add(new TestView(50, Number.POSITIVE_INFINITY, 50, Number.POSITIVE_INFINITY));
		gridview.addView(view1, 200, [0]);
		assert.deepStrictEqual(view1.size, [800, 600]);
		assert.deepStrictEqual(gridview.getViewSize([0]), { width: 800, height: 600 });

		const view2 = store.add(new TestView(50, Number.POSITIVE_INFINITY, 50, Number.POSITIVE_INFINITY));
		gridview.addView(view2, 200, [0]);
		assert.deepStrictEqual(view1.size, [800, 400]);
		assert.deepStrictEqual(gridview.getViewSize([1]), { width: 800, height: 400 });
		assert.deepStrictEqual(view2.size, [800, 200]);
		assert.deepStrictEqual(gridview.getViewSize([0]), { width: 800, height: 200 });

		const view3 = store.add(new TestView(50, Number.POSITIVE_INFINITY, 50, Number.POSITIVE_INFINITY));
		gridview.addView(view3, 200, [1, 1]);
		assert.deepStrictEqual(view1.size, [600, 400]);
		assert.deepStrictEqual(gridview.getViewSize([1, 0]), { width: 600, height: 400 });
		assert.deepStrictEqual(view2.size, [800, 200]);
		assert.deepStrictEqual(gridview.getViewSize([0]), { width: 800, height: 200 });
		assert.deepStrictEqual(view3.size, [200, 400]);
		assert.deepStrictEqual(gridview.getViewSize([1, 1]), { width: 200, height: 400 });

		const view4 = store.add(new TestView(50, Number.POSITIVE_INFINITY, 50, Number.POSITIVE_INFINITY));
		gridview.addView(view4, 200, [0, 0]);
		assert.deepStrictEqual(view1.size, [600, 400]);
		assert.deepStrictEqual(gridview.getViewSize([1, 0]), { width: 600, height: 400 });
		assert.deepStrictEqual(view2.size, [600, 200]);
		assert.deepStrictEqual(gridview.getViewSize([0, 1]), { width: 600, height: 200 });
		assert.deepStrictEqual(view3.size, [200, 400]);
		assert.deepStrictEqual(gridview.getViewSize([1, 1]), { width: 200, height: 400 });
		assert.deepStrictEqual(view4.size, [200, 200]);
		assert.deepStrictEqual(gridview.getViewSize([0, 0]), { width: 200, height: 200 });

		const view5 = store.add(new TestView(50, Number.POSITIVE_INFINITY, 50, Number.POSITIVE_INFINITY));
		gridview.addView(view5, 100, [1, 0, 1]);
		assert.deepStrictEqual(view1.size, [600, 300]);
		assert.deepStrictEqual(gridview.getViewSize([1, 0, 0]), { width: 600, height: 300 });
		assert.deepStrictEqual(view2.size, [600, 200]);
		assert.deepStrictEqual(gridview.getViewSize([0, 1]), { width: 600, height: 200 });
		assert.deepStrictEqual(view3.size, [200, 400]);
		assert.deepStrictEqual(gridview.getViewSize([1, 1]), { width: 200, height: 400 });
		assert.deepStrictEqual(view4.size, [200, 200]);
		assert.deepStrictEqual(gridview.getViewSize([0, 0]), { width: 200, height: 200 });
		assert.deepStrictEqual(view5.size, [600, 100]);
		assert.deepStrictEqual(gridview.getViewSize([1, 0, 1]), { width: 600, height: 100 });
	});

	test('simple layout with automatic size distribution', function () {
		const gridview = createGridView();
		gridview.layout(800, 600);

		const view1 = store.add(new TestView(50, Number.POSITIVE_INFINITY, 50, Number.POSITIVE_INFINITY));
		gridview.addView(view1, Sizing.Distribute, [0]);
		assert.deepStrictEqual(view1.size, [800, 600]);
		assert.deepStrictEqual(gridview.getViewSize([0]), { width: 800, height: 600 });

		const view2 = store.add(new TestView(50, Number.POSITIVE_INFINITY, 50, Number.POSITIVE_INFINITY));
		gridview.addView(view2, Sizing.Distribute, [0]);
		assert.deepStrictEqual(view1.size, [800, 300]);
		assert.deepStrictEqual(view2.size, [800, 300]);

		const view3 = store.add(new TestView(50, Number.POSITIVE_INFINITY, 50, Number.POSITIVE_INFINITY));
		gridview.addView(view3, Sizing.Distribute, [1, 1]);
		assert.deepStrictEqual(view1.size, [400, 300]);
		assert.deepStrictEqual(view2.size, [800, 300]);
		assert.deepStrictEqual(view3.size, [400, 300]);

		const view4 = store.add(new TestView(50, Number.POSITIVE_INFINITY, 50, Number.POSITIVE_INFINITY));
		gridview.addView(view4, Sizing.Distribute, [0, 0]);
		assert.deepStrictEqual(view1.size, [400, 300]);
		assert.deepStrictEqual(view2.size, [400, 300]);
		assert.deepStrictEqual(view3.size, [400, 300]);
		assert.deepStrictEqual(view4.size, [400, 300]);

		const view5 = store.add(new TestView(50, Number.POSITIVE_INFINITY, 50, Number.POSITIVE_INFINITY));
		gridview.addView(view5, Sizing.Distribute, [1, 0, 1]);
		assert.deepStrictEqual(view1.size, [400, 150]);
		assert.deepStrictEqual(view2.size, [400, 300]);
		assert.deepStrictEqual(view3.size, [400, 300]);
		assert.deepStrictEqual(view4.size, [400, 300]);
		assert.deepStrictEqual(view5.size, [400, 150]);
	});

	test('addviews before layout call 1', function () {
		const gridview = createGridView();

		const view1 = store.add(new TestView(50, Number.POSITIVE_INFINITY, 50, Number.POSITIVE_INFINITY));
		gridview.addView(view1, 200, [0]);

		const view2 = store.add(new TestView(50, Number.POSITIVE_INFINITY, 50, Number.POSITIVE_INFINITY));
		gridview.addView(view2, 200, [0]);

		const view3 = store.add(new TestView(50, Number.POSITIVE_INFINITY, 50, Number.POSITIVE_INFINITY));
		gridview.addView(view3, 200, [1, 1]);

		gridview.layout(800, 600);

		assert.deepStrictEqual(view1.size, [400, 300]);
		assert.deepStrictEqual(view2.size, [800, 300]);
		assert.deepStrictEqual(view3.size, [400, 300]);
	});

	test('addviews before layout call 2', function () {
		const gridview = createGridView();
		const view1 = store.add(new TestView(50, Number.POSITIVE_INFINITY, 50, Number.POSITIVE_INFINITY));
		gridview.addView(view1, 200, [0]);

		const view2 = store.add(new TestView(50, Number.POSITIVE_INFINITY, 50, Number.POSITIVE_INFINITY));
		gridview.addView(view2, 200, [0]);

		const view3 = store.add(new TestView(50, Number.POSITIVE_INFINITY, 50, Number.POSITIVE_INFINITY));
		gridview.addView(view3, 200, [0, 0]);

		gridview.layout(800, 600);

		assert.deepStrictEqual(view1.size, [800, 300]);
		assert.deepStrictEqual(view2.size, [400, 300]);
		assert.deepStrictEqual(view3.size, [400, 300]);
	});

	test('flipping orientation should preserve absolute offsets', function () {
		const gridview = createGridView();
		const view1 = store.add(new TestView(50, Number.POSITIVE_INFINITY, 50, Number.POSITIVE_INFINITY));
		gridview.addView(view1, 200, [0]);

		const view2 = store.add(new TestView(50, Number.POSITIVE_INFINITY, 50, Number.POSITIVE_INFINITY));
		gridview.addView(view2, 200, [1]);

		gridview.layout(800, 600, 100, 200);

		assert.deepStrictEqual([view1.top, view1.left], [100, 200]);
		assert.deepStrictEqual([view2.top, view2.left], [100 + 300, 200]);

		gridview.orientation = Orientation.HORIZONTAL;

		assert.deepStrictEqual([view1.top, view1.left], [100, 200]);
		assert.deepStrictEqual([view2.top, view2.left], [100, 200 + 400]);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/ui/grid/util.ts]---
Location: vscode-main/src/vs/base/test/browser/ui/grid/util.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IView } from '../../../../browser/ui/grid/grid.js';
import { GridNode, isGridBranchNode } from '../../../../browser/ui/grid/gridview.js';
import { Emitter, Event } from '../../../../common/event.js';

export class TestView implements IView {

	private readonly _onDidChange = new Emitter<{ width: number; height: number } | undefined>();
	readonly onDidChange = this._onDidChange.event;

	get minimumWidth(): number { return this._minimumWidth; }
	set minimumWidth(size: number) { this._minimumWidth = size; this._onDidChange.fire(undefined); }

	get maximumWidth(): number { return this._maximumWidth; }
	set maximumWidth(size: number) { this._maximumWidth = size; this._onDidChange.fire(undefined); }

	get minimumHeight(): number { return this._minimumHeight; }
	set minimumHeight(size: number) { this._minimumHeight = size; this._onDidChange.fire(undefined); }

	get maximumHeight(): number { return this._maximumHeight; }
	set maximumHeight(size: number) { this._maximumHeight = size; this._onDidChange.fire(undefined); }

	private _element: HTMLElement = document.createElement('div');
	get element(): HTMLElement { this._onDidGetElement.fire(); return this._element; }

	private readonly _onDidGetElement = new Emitter<void>();
	readonly onDidGetElement = this._onDidGetElement.event;

	private _width = 0;
	get width(): number { return this._width; }

	private _height = 0;
	get height(): number { return this._height; }

	private _top = 0;
	get top(): number { return this._top; }

	private _left = 0;
	get left(): number { return this._left; }

	get size(): [number, number] { return [this.width, this.height]; }

	private readonly _onDidLayout = new Emitter<{ width: number; height: number; top: number; left: number }>();
	readonly onDidLayout: Event<{ width: number; height: number; top: number; left: number }> = this._onDidLayout.event;

	private readonly _onDidFocus = new Emitter<void>();
	readonly onDidFocus: Event<void> = this._onDidFocus.event;

	constructor(
		private _minimumWidth: number,
		private _maximumWidth: number,
		private _minimumHeight: number,
		private _maximumHeight: number
	) {
		assert(_minimumWidth <= _maximumWidth, 'gridview view minimum width must be <= maximum width');
		assert(_minimumHeight <= _maximumHeight, 'gridview view minimum height must be <= maximum height');
	}

	layout(width: number, height: number, top: number, left: number): void {
		this._width = width;
		this._height = height;
		this._top = top;
		this._left = left;
		this._onDidLayout.fire({ width, height, top, left });
	}

	focus(): void {
		this._onDidFocus.fire();
	}

	dispose(): void {
		this._onDidChange.dispose();
		this._onDidGetElement.dispose();
		this._onDidLayout.dispose();
		this._onDidFocus.dispose();
	}
}

export function nodesToArrays(node: GridNode): any {
	if (isGridBranchNode(node)) {
		return node.children.map(nodesToArrays);
	} else {
		return node.view;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/ui/list/listView.test.ts]---
Location: vscode-main/src/vs/base/test/browser/ui/list/listView.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IListRenderer, IListVirtualDelegate } from '../../../../browser/ui/list/list.js';
import { ListView } from '../../../../browser/ui/list/listView.js';
import { range } from '../../../../common/arrays.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../common/utils.js';

suite('ListView', function () {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('all rows get disposed', function () {
		const element = document.createElement('div');
		element.style.height = '200px';
		element.style.width = '200px';

		const delegate: IListVirtualDelegate<number> = {
			getHeight() { return 20; },
			getTemplateId() { return 'template'; }
		};

		let templatesCount = 0;

		const renderer: IListRenderer<number, void> = {
			templateId: 'template',
			renderTemplate() { templatesCount++; },
			renderElement() { },
			disposeTemplate() { templatesCount--; }
		};

		const listView = new ListView<number>(element, delegate, [renderer]);
		listView.layout(200);

		assert.strictEqual(templatesCount, 0, 'no templates have been allocated');
		listView.splice(0, 0, range(100));
		assert.strictEqual(templatesCount, 10, 'some templates have been allocated');
		listView.dispose();
		assert.strictEqual(templatesCount, 0, 'all templates have been disposed');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/ui/list/listWidget.test.ts]---
Location: vscode-main/src/vs/base/test/browser/ui/list/listWidget.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IListRenderer, IListVirtualDelegate } from '../../../../browser/ui/list/list.js';
import { List } from '../../../../browser/ui/list/listWidget.js';
import { range } from '../../../../common/arrays.js';
import { timeout } from '../../../../common/async.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../common/utils.js';

suite('ListWidget', function () {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	test('Page up and down', async function () {
		const element = document.createElement('div');
		element.style.height = '200px';
		element.style.width = '200px';

		const delegate: IListVirtualDelegate<number> = {
			getHeight() { return 20; },
			getTemplateId() { return 'template'; }
		};

		let templatesCount = 0;

		const renderer: IListRenderer<number, void> = {
			templateId: 'template',
			renderTemplate() { templatesCount++; },
			renderElement() { },
			disposeTemplate() { templatesCount--; }
		};

		const listWidget = store.add(new List<number>('test', element, delegate, [renderer]));

		listWidget.layout(200);
		assert.strictEqual(templatesCount, 0, 'no templates have been allocated');
		listWidget.splice(0, 0, range(100));
		listWidget.focusFirst();

		listWidget.focusNextPage();
		assert.strictEqual(listWidget.getFocus()[0], 9, 'first page down moves focus to element at bottom');

		// scroll to next page is async
		listWidget.focusNextPage();
		await timeout(0);
		assert.strictEqual(listWidget.getFocus()[0], 19, 'page down to next page');

		listWidget.focusPreviousPage();
		assert.strictEqual(listWidget.getFocus()[0], 10, 'first page up moves focus to element at top');

		// scroll to previous page is async
		listWidget.focusPreviousPage();
		await timeout(0);
		assert.strictEqual(listWidget.getFocus()[0], 0, 'page down to previous page');
	});

	test('Page up and down with item taller than viewport #149502', async function () {
		const element = document.createElement('div');
		element.style.height = '200px';
		element.style.width = '200px';

		const delegate: IListVirtualDelegate<number> = {
			getHeight() { return 200; },
			getTemplateId() { return 'template'; }
		};

		let templatesCount = 0;

		const renderer: IListRenderer<number, void> = {
			templateId: 'template',
			renderTemplate() { templatesCount++; },
			renderElement() { },
			disposeTemplate() { templatesCount--; }
		};

		const listWidget = store.add(new List<number>('test', element, delegate, [renderer]));

		listWidget.layout(200);
		assert.strictEqual(templatesCount, 0, 'no templates have been allocated');
		listWidget.splice(0, 0, range(100));
		listWidget.focusFirst();
		assert.strictEqual(listWidget.getFocus()[0], 0, 'initial focus is first element');

		// scroll to next page is async
		listWidget.focusNextPage();
		await timeout(0);
		assert.strictEqual(listWidget.getFocus()[0], 1, 'page down to next page');

		// scroll to previous page is async
		listWidget.focusPreviousPage();
		await timeout(0);
		assert.strictEqual(listWidget.getFocus()[0], 0, 'page up to next page');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/ui/list/rangeMap.test.ts]---
Location: vscode-main/src/vs/base/test/browser/ui/list/rangeMap.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { consolidate, groupIntersect, RangeMap } from '../../../../browser/ui/list/rangeMap.js';
import { Range } from '../../../../common/range.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../common/utils.js';

suite('RangeMap', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('intersection', () => {
		assert.deepStrictEqual(Range.intersect({ start: 0, end: 0 }, { start: 0, end: 0 }), { start: 0, end: 0 });
		assert.deepStrictEqual(Range.intersect({ start: 0, end: 0 }, { start: 5, end: 5 }), { start: 0, end: 0 });
		assert.deepStrictEqual(Range.intersect({ start: 0, end: 1 }, { start: 5, end: 6 }), { start: 0, end: 0 });
		assert.deepStrictEqual(Range.intersect({ start: 5, end: 6 }, { start: 0, end: 1 }), { start: 0, end: 0 });
		assert.deepStrictEqual(Range.intersect({ start: 0, end: 5 }, { start: 2, end: 2 }), { start: 0, end: 0 });
		assert.deepStrictEqual(Range.intersect({ start: 0, end: 1 }, { start: 0, end: 1 }), { start: 0, end: 1 });
		assert.deepStrictEqual(Range.intersect({ start: 0, end: 10 }, { start: 0, end: 5 }), { start: 0, end: 5 });
		assert.deepStrictEqual(Range.intersect({ start: 0, end: 5 }, { start: 0, end: 10 }), { start: 0, end: 5 });
		assert.deepStrictEqual(Range.intersect({ start: 0, end: 10 }, { start: 5, end: 10 }), { start: 5, end: 10 });
		assert.deepStrictEqual(Range.intersect({ start: 5, end: 10 }, { start: 0, end: 10 }), { start: 5, end: 10 });
		assert.deepStrictEqual(Range.intersect({ start: 0, end: 10 }, { start: 2, end: 8 }), { start: 2, end: 8 });
		assert.deepStrictEqual(Range.intersect({ start: 2, end: 8 }, { start: 0, end: 10 }), { start: 2, end: 8 });
		assert.deepStrictEqual(Range.intersect({ start: 0, end: 10 }, { start: 5, end: 15 }), { start: 5, end: 10 });
		assert.deepStrictEqual(Range.intersect({ start: 5, end: 15 }, { start: 0, end: 10 }), { start: 5, end: 10 });
	});

	test('multiIntersect', () => {
		assert.deepStrictEqual(
			groupIntersect(
				{ start: 0, end: 0 },
				[{ range: { start: 0, end: 10 }, size: 1 }]
			),
			[]
		);

		assert.deepStrictEqual(
			groupIntersect(
				{ start: 10, end: 20 },
				[{ range: { start: 0, end: 10 }, size: 1 }]
			),
			[]
		);

		assert.deepStrictEqual(
			groupIntersect(
				{ start: 2, end: 8 },
				[{ range: { start: 0, end: 10 }, size: 1 }]
			),
			[{ range: { start: 2, end: 8 }, size: 1 }]
		);

		assert.deepStrictEqual(
			groupIntersect(
				{ start: 2, end: 8 },
				[{ range: { start: 0, end: 10 }, size: 1 }, { range: { start: 10, end: 20 }, size: 5 }]
			),
			[{ range: { start: 2, end: 8 }, size: 1 }]
		);

		assert.deepStrictEqual(
			groupIntersect(
				{ start: 12, end: 18 },
				[{ range: { start: 0, end: 10 }, size: 1 }, { range: { start: 10, end: 20 }, size: 5 }]
			),
			[{ range: { start: 12, end: 18 }, size: 5 }]
		);

		assert.deepStrictEqual(
			groupIntersect(
				{ start: 2, end: 18 },
				[{ range: { start: 0, end: 10 }, size: 1 }, { range: { start: 10, end: 20 }, size: 5 }]
			),
			[{ range: { start: 2, end: 10 }, size: 1 }, { range: { start: 10, end: 18 }, size: 5 }]
		);

		assert.deepStrictEqual(
			groupIntersect(
				{ start: 2, end: 28 },
				[{ range: { start: 0, end: 10 }, size: 1 }, { range: { start: 10, end: 20 }, size: 5 }, { range: { start: 20, end: 30 }, size: 10 }]
			),
			[{ range: { start: 2, end: 10 }, size: 1 }, { range: { start: 10, end: 20 }, size: 5 }, { range: { start: 20, end: 28 }, size: 10 }]
		);
	});

	test('consolidate', () => {
		assert.deepStrictEqual(consolidate([]), []);

		assert.deepStrictEqual(
			consolidate([{ range: { start: 0, end: 10 }, size: 1 }]),
			[{ range: { start: 0, end: 10 }, size: 1 }]
		);

		assert.deepStrictEqual(
			consolidate([
				{ range: { start: 0, end: 10 }, size: 1 },
				{ range: { start: 10, end: 20 }, size: 1 }
			]),
			[{ range: { start: 0, end: 20 }, size: 1 }]
		);

		assert.deepStrictEqual(
			consolidate([
				{ range: { start: 0, end: 10 }, size: 1 },
				{ range: { start: 10, end: 20 }, size: 1 },
				{ range: { start: 20, end: 100 }, size: 1 }
			]),
			[{ range: { start: 0, end: 100 }, size: 1 }]
		);

		assert.deepStrictEqual(
			consolidate([
				{ range: { start: 0, end: 10 }, size: 1 },
				{ range: { start: 10, end: 20 }, size: 5 },
				{ range: { start: 20, end: 30 }, size: 10 }
			]),
			[
				{ range: { start: 0, end: 10 }, size: 1 },
				{ range: { start: 10, end: 20 }, size: 5 },
				{ range: { start: 20, end: 30 }, size: 10 }
			]
		);

		assert.deepStrictEqual(
			consolidate([
				{ range: { start: 0, end: 10 }, size: 1 },
				{ range: { start: 10, end: 20 }, size: 2 },
				{ range: { start: 20, end: 100 }, size: 2 }
			]),
			[
				{ range: { start: 0, end: 10 }, size: 1 },
				{ range: { start: 10, end: 100 }, size: 2 }
			]
		);
	});

	test('empty', () => {
		const rangeMap = new RangeMap();
		assert.strictEqual(rangeMap.size, 0);
		assert.strictEqual(rangeMap.count, 0);
	});

	const one = { size: 1 };
	const two = { size: 2 };
	const three = { size: 3 };
	const five = { size: 5 };
	const ten = { size: 10 };

	test('length & count', () => {
		const rangeMap = new RangeMap();
		rangeMap.splice(0, 0, [one]);
		assert.strictEqual(rangeMap.size, 1);
		assert.strictEqual(rangeMap.count, 1);
	});

	test('length & count #2', () => {
		const rangeMap = new RangeMap();
		rangeMap.splice(0, 0, [one, one, one, one, one]);
		assert.strictEqual(rangeMap.size, 5);
		assert.strictEqual(rangeMap.count, 5);
	});

	test('length & count #3', () => {
		const rangeMap = new RangeMap();
		rangeMap.splice(0, 0, [five]);
		assert.strictEqual(rangeMap.size, 5);
		assert.strictEqual(rangeMap.count, 1);
	});

	test('length & count #4', () => {
		const rangeMap = new RangeMap();
		rangeMap.splice(0, 0, [five, five, five, five, five]);
		assert.strictEqual(rangeMap.size, 25);
		assert.strictEqual(rangeMap.count, 5);
	});

	test('insert', () => {
		const rangeMap = new RangeMap();
		rangeMap.splice(0, 0, [five, five, five, five, five]);
		assert.strictEqual(rangeMap.size, 25);
		assert.strictEqual(rangeMap.count, 5);

		rangeMap.splice(0, 0, [five, five, five, five, five]);
		assert.strictEqual(rangeMap.size, 50);
		assert.strictEqual(rangeMap.count, 10);

		rangeMap.splice(5, 0, [ten, ten]);
		assert.strictEqual(rangeMap.size, 70);
		assert.strictEqual(rangeMap.count, 12);

		rangeMap.splice(12, 0, [{ size: 200 }]);
		assert.strictEqual(rangeMap.size, 270);
		assert.strictEqual(rangeMap.count, 13);
	});

	test('delete', () => {
		const rangeMap = new RangeMap();
		rangeMap.splice(0, 0, [five, five, five, five, five,
			five, five, five, five, five,
			five, five, five, five, five,
			five, five, five, five, five]);
		assert.strictEqual(rangeMap.size, 100);
		assert.strictEqual(rangeMap.count, 20);

		rangeMap.splice(10, 5);
		assert.strictEqual(rangeMap.size, 75);
		assert.strictEqual(rangeMap.count, 15);

		rangeMap.splice(0, 1);
		assert.strictEqual(rangeMap.size, 70);
		assert.strictEqual(rangeMap.count, 14);

		rangeMap.splice(1, 13);
		assert.strictEqual(rangeMap.size, 5);
		assert.strictEqual(rangeMap.count, 1);

		rangeMap.splice(1, 1);
		assert.strictEqual(rangeMap.size, 5);
		assert.strictEqual(rangeMap.count, 1);
	});

	test('insert & delete', () => {
		const rangeMap = new RangeMap();
		assert.strictEqual(rangeMap.size, 0);
		assert.strictEqual(rangeMap.count, 0);

		rangeMap.splice(0, 0, [one]);
		assert.strictEqual(rangeMap.size, 1);
		assert.strictEqual(rangeMap.count, 1);

		rangeMap.splice(0, 1);
		assert.strictEqual(rangeMap.size, 0);
		assert.strictEqual(rangeMap.count, 0);
	});

	test('insert & delete #2', () => {
		const rangeMap = new RangeMap();
		rangeMap.splice(0, 0, [one, one, one, one, one,
			one, one, one, one, one]);
		rangeMap.splice(2, 6);
		assert.strictEqual(rangeMap.count, 4);
		assert.strictEqual(rangeMap.size, 4);
	});

	test('insert & delete #3', () => {
		const rangeMap = new RangeMap();
		rangeMap.splice(0, 0, [one, one, one, one, one,
			one, one, one, one, one,
			two, two, two, two, two,
			two, two, two, two, two]);
		rangeMap.splice(8, 4);
		assert.strictEqual(rangeMap.count, 16);
		assert.strictEqual(rangeMap.size, 24);
	});

	test('insert & delete #4', () => {
		const rangeMap = new RangeMap();
		rangeMap.splice(0, 0, [one, one, one, one, one,
			one, one, one, one, one,
			two, two, two, two, two,
			two, two, two, two, two]);
		rangeMap.splice(5, 0, [three, three, three, three, three]);
		assert.strictEqual(rangeMap.count, 25);
		assert.strictEqual(rangeMap.size, 45);

		rangeMap.splice(4, 7);
		assert.strictEqual(rangeMap.count, 18);
		assert.strictEqual(rangeMap.size, 28);
	});

	suite('indexAt, positionAt', () => {
		test('empty', () => {
			const rangeMap = new RangeMap();
			assert.strictEqual(rangeMap.indexAt(0), 0);
			assert.strictEqual(rangeMap.indexAt(10), 0);
			assert.strictEqual(rangeMap.indexAt(-1), -1);
			assert.strictEqual(rangeMap.positionAt(0), -1);
			assert.strictEqual(rangeMap.positionAt(10), -1);
			assert.strictEqual(rangeMap.positionAt(-1), -1);
		});

		test('simple', () => {
			const rangeMap = new RangeMap();
			rangeMap.splice(0, 0, [one]);
			assert.strictEqual(rangeMap.indexAt(0), 0);
			assert.strictEqual(rangeMap.indexAt(1), 1);
			assert.strictEqual(rangeMap.positionAt(0), 0);
			assert.strictEqual(rangeMap.positionAt(1), -1);
		});

		test('simple #2', () => {
			const rangeMap = new RangeMap();
			rangeMap.splice(0, 0, [ten]);
			assert.strictEqual(rangeMap.indexAt(0), 0);
			assert.strictEqual(rangeMap.indexAt(5), 0);
			assert.strictEqual(rangeMap.indexAt(9), 0);
			assert.strictEqual(rangeMap.indexAt(10), 1);
			assert.strictEqual(rangeMap.positionAt(0), 0);
			assert.strictEqual(rangeMap.positionAt(1), -1);
		});

		test('insert', () => {
			const rangeMap = new RangeMap();
			rangeMap.splice(0, 0, [one, one, one, one, one, one, one, one, one, one]);
			assert.strictEqual(rangeMap.indexAt(0), 0);
			assert.strictEqual(rangeMap.indexAt(1), 1);
			assert.strictEqual(rangeMap.indexAt(5), 5);
			assert.strictEqual(rangeMap.indexAt(9), 9);
			assert.strictEqual(rangeMap.indexAt(10), 10);
			assert.strictEqual(rangeMap.indexAt(11), 10);

			rangeMap.splice(10, 0, [one, one, one, one, one, one, one, one, one, one]);
			assert.strictEqual(rangeMap.indexAt(10), 10);
			assert.strictEqual(rangeMap.indexAt(19), 19);
			assert.strictEqual(rangeMap.indexAt(20), 20);
			assert.strictEqual(rangeMap.indexAt(21), 20);
			assert.strictEqual(rangeMap.positionAt(0), 0);
			assert.strictEqual(rangeMap.positionAt(1), 1);
			assert.strictEqual(rangeMap.positionAt(19), 19);
			assert.strictEqual(rangeMap.positionAt(20), -1);
		});

		test('delete', () => {
			const rangeMap = new RangeMap();
			rangeMap.splice(0, 0, [one, one, one, one, one, one, one, one, one, one]);
			rangeMap.splice(2, 6);

			assert.strictEqual(rangeMap.indexAt(0), 0);
			assert.strictEqual(rangeMap.indexAt(1), 1);
			assert.strictEqual(rangeMap.indexAt(3), 3);
			assert.strictEqual(rangeMap.indexAt(4), 4);
			assert.strictEqual(rangeMap.indexAt(5), 4);
			assert.strictEqual(rangeMap.positionAt(0), 0);
			assert.strictEqual(rangeMap.positionAt(1), 1);
			assert.strictEqual(rangeMap.positionAt(3), 3);
			assert.strictEqual(rangeMap.positionAt(4), -1);
		});

		test('delete #2', () => {
			const rangeMap = new RangeMap();
			rangeMap.splice(0, 0, [ten, ten, ten, ten, ten, ten, ten, ten, ten, ten]);
			rangeMap.splice(2, 6);

			assert.strictEqual(rangeMap.indexAt(0), 0);
			assert.strictEqual(rangeMap.indexAt(1), 0);
			assert.strictEqual(rangeMap.indexAt(30), 3);
			assert.strictEqual(rangeMap.indexAt(40), 4);
			assert.strictEqual(rangeMap.indexAt(50), 4);
			assert.strictEqual(rangeMap.positionAt(0), 0);
			assert.strictEqual(rangeMap.positionAt(1), 10);
			assert.strictEqual(rangeMap.positionAt(2), 20);
			assert.strictEqual(rangeMap.positionAt(3), 30);
			assert.strictEqual(rangeMap.positionAt(4), -1);
		});
	});
});

suite('RangeMap with top padding', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('empty', () => {
		const rangeMap = new RangeMap(10);
		assert.strictEqual(rangeMap.size, 10);
		assert.strictEqual(rangeMap.count, 0);
	});

	const one = { size: 1 };
	const five = { size: 5 };
	const ten = { size: 10 };

	test('length & count', () => {
		const rangeMap = new RangeMap(10);
		rangeMap.splice(0, 0, [one]);
		assert.strictEqual(rangeMap.size, 11);
		assert.strictEqual(rangeMap.count, 1);
	});

	test('length & count #2', () => {
		const rangeMap = new RangeMap(10);
		rangeMap.splice(0, 0, [one, one, one, one, one]);
		assert.strictEqual(rangeMap.size, 15);
		assert.strictEqual(rangeMap.count, 5);
	});

	test('length & count #3', () => {
		const rangeMap = new RangeMap(10);
		rangeMap.splice(0, 0, [five]);
		assert.strictEqual(rangeMap.size, 15);
		assert.strictEqual(rangeMap.count, 1);
	});

	test('length & count #4', () => {
		const rangeMap = new RangeMap(10);
		rangeMap.splice(0, 0, [five, five, five, five, five]);
		assert.strictEqual(rangeMap.size, 35);
		assert.strictEqual(rangeMap.count, 5);
	});

	test('insert', () => {
		const rangeMap = new RangeMap(10);
		rangeMap.splice(0, 0, [five, five, five, five, five]);
		assert.strictEqual(rangeMap.size, 35);
		assert.strictEqual(rangeMap.count, 5);

		rangeMap.splice(0, 0, [five, five, five, five, five]);
		assert.strictEqual(rangeMap.size, 60);
		assert.strictEqual(rangeMap.count, 10);

		rangeMap.splice(5, 0, [ten, ten]);
		assert.strictEqual(rangeMap.size, 80);
		assert.strictEqual(rangeMap.count, 12);

		rangeMap.splice(12, 0, [{ size: 200 }]);
		assert.strictEqual(rangeMap.size, 280);
		assert.strictEqual(rangeMap.count, 13);
	});

	suite('indexAt, positionAt', () => {
		test('empty', () => {
			const rangeMap = new RangeMap(10);
			assert.strictEqual(rangeMap.indexAt(0), 0);
			assert.strictEqual(rangeMap.indexAt(10), 0);
			assert.strictEqual(rangeMap.indexAt(-1), -1);
			assert.strictEqual(rangeMap.positionAt(0), -1);
			assert.strictEqual(rangeMap.positionAt(10), -1);
			assert.strictEqual(rangeMap.positionAt(-1), -1);
		});

		test('simple', () => {
			const rangeMap = new RangeMap(10);
			rangeMap.splice(0, 0, [one]);
			assert.strictEqual(rangeMap.indexAt(0), 0);
			assert.strictEqual(rangeMap.indexAt(1), 0);
			assert.strictEqual(rangeMap.indexAt(10), 0);
			assert.strictEqual(rangeMap.indexAt(11), 1);
			assert.strictEqual(rangeMap.positionAt(0), 10);
			assert.strictEqual(rangeMap.positionAt(1), -1);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/ui/menu/menubar.test.ts]---
Location: vscode-main/src/vs/base/test/browser/ui/menu/menubar.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { $, ModifierKeyEmitter } from '../../../../browser/dom.js';
import { unthemedMenuStyles } from '../../../../browser/ui/menu/menu.js';
import { MenuBar } from '../../../../browser/ui/menu/menubar.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../common/utils.js';

function getButtonElementByAriaLabel(menubarElement: HTMLElement, ariaLabel: string): HTMLElement | null {
	let i;
	for (i = 0; i < menubarElement.childElementCount; i++) {

		if (menubarElement.children[i].getAttribute('aria-label') === ariaLabel) {
			return menubarElement.children[i] as HTMLElement;
		}
	}

	return null;
}

function getTitleDivFromButtonDiv(menuButtonElement: HTMLElement): HTMLElement | null {
	let i;
	for (i = 0; i < menuButtonElement.childElementCount; i++) {
		if (menuButtonElement.children[i].classList.contains('menubar-menu-title')) {
			return menuButtonElement.children[i] as HTMLElement;
		}
	}

	return null;
}

function getMnemonicFromTitleDiv(menuTitleDiv: HTMLElement): string | null {
	let i;
	for (i = 0; i < menuTitleDiv.childElementCount; i++) {
		if (menuTitleDiv.children[i].tagName.toLocaleLowerCase() === 'mnemonic') {
			return menuTitleDiv.children[i].textContent;
		}
	}

	return null;
}

function validateMenuBarItem(menubar: MenuBar, menubarContainer: HTMLElement, label: string, readableLabel: string, mnemonic: string) {
	menubar.push([
		{
			actions: [],
			label: label
		}
	]);

	const buttonElement = getButtonElementByAriaLabel(menubarContainer, readableLabel);
	assert(buttonElement !== null, `Button element not found for ${readableLabel} button.`);

	const titleDiv = getTitleDivFromButtonDiv(buttonElement);
	assert(titleDiv !== null, `Title div not found for ${readableLabel} button.`);

	const mnem = getMnemonicFromTitleDiv(titleDiv);
	assert.strictEqual(mnem, mnemonic, 'Mnemonic not correct');
}

suite('Menubar', () => {
	ensureNoDisposablesAreLeakedInTestSuite();
	const container = $('.container');

	const withMenuMenubar = (callback: (menubar: MenuBar) => void) => {
		const menubar = new MenuBar(container, {
			enableMnemonics: true,
			visibility: 'visible'
		}, unthemedMenuStyles);

		callback(menubar);

		menubar.dispose();
		ModifierKeyEmitter.disposeInstance();
	};

	test('English File menu renders mnemonics', function () {
		withMenuMenubar(menubar => {
			validateMenuBarItem(menubar, container, '&File', 'File', 'F');
		});
	});

	test('Russian File menu renders mnemonics', function () {
		withMenuMenubar(menubar => {
			validateMenuBarItem(menubar, container, '&Файл', 'Файл', 'Ф');
		});
	});

	test('Chinese File menu renders mnemonics', function () {
		withMenuMenubar(menubar => {
			validateMenuBarItem(menubar, container, '文件(&F)', '文件', 'F');
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/ui/scrollbar/scrollableElement.test.ts]---
Location: vscode-main/src/vs/base/test/browser/ui/scrollbar/scrollableElement.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { MouseWheelClassifier } from '../../../../browser/ui/scrollbar/scrollableElement.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../common/utils.js';

export type IMouseWheelEvent = [number, number, number];

suite('MouseWheelClassifier', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('OSX - Apple Magic Mouse', () => {
		const testData: IMouseWheelEvent[] = [
			[1503409622410, -0.025, 0],
			[1503409622435, -0.175, 0],
			[1503409622446, -0.225, 0],
			[1503409622489, -0.65, 0],
			[1503409622514, -1.225, 0],
			[1503409622537, -1.025, 0],
			[1503409622543, -0.55, 0],
			[1503409622587, -0.75, 0],
			[1503409622623, -1.45, 0],
			[1503409622641, -1.325, 0],
			[1503409622663, -0.6, 0],
			[1503409622681, -1.125, 0],
			[1503409622703, -0.5166666666666667, 0],
			[1503409622721, -0.475, 0],
			[1503409622822, -0.425, 0],
			[1503409622871, -1.9916666666666667, 0],
			[1503409622933, -0.7, 0],
			[1503409622991, -0.725, 0],
			[1503409623032, -0.45, 0],
			[1503409623083, -0.25, 0],
			[1503409623122, -0.4, 0],
			[1503409623176, -0.2, 0],
			[1503409623197, -0.225, 0],
			[1503409623219, -0.05, 0],
			[1503409623249, -0.1, 0],
			[1503409623278, -0.1, 0],
			[1503409623292, -0.025, 0],
			[1503409623315, -0.025, 0],
			[1503409623324, -0.05, 0],
			[1503409623356, -0.025, 0],
			[1503409623415, -0.025, 0],
			[1503409623443, -0.05, 0],
			[1503409623452, -0.025, 0],
		];

		const classifier = new MouseWheelClassifier();
		for (let i = 0, len = testData.length; i < len; i++) {
			const [timestamp, deltaY, deltaX] = testData[i];
			classifier.accept(timestamp, deltaX, deltaY);

			const actual = classifier.isPhysicalMouseWheel();
			assert.strictEqual(actual, false, `i = ${i}`);
		}
	});

	test('OSX - Apple Touch Pad', () => {
		const testData: IMouseWheelEvent[] = [
			[1503409780792, 0.025, 0],
			[1503409780808, 0.175, -0.025],
			[1503409780811, 0.35, -0.05],
			[1503409780816, 0.55, -0.075],
			[1503409780836, 0.825, -0.1],
			[1503409780840, 0.725, -0.075],
			[1503409780842, 1.5, -0.125],
			[1503409780848, 1.1, -0.1],
			[1503409780877, 2.05, -0.1],
			[1503409780882, 3.9, 0],
			[1503409780908, 3.825, 0],
			[1503409780915, 3.65, 0],
			[1503409780940, 3.45, 0],
			[1503409780949, 3.25, 0],
			[1503409780979, 3.075, 0],
			[1503409780982, 2.9, 0],
			[1503409781016, 2.75, 0],
			[1503409781018, 2.625, 0],
			[1503409781051, 2.5, 0],
			[1503409781071, 2.4, 0],
			[1503409781089, 2.3, 0],
			[1503409781111, 2.175, 0],
			[1503409781140, 3.975, 0],
			[1503409781165, 1.8, 0],
			[1503409781183, 3.3, 0],
			[1503409781202, 1.475, 0],
			[1503409781223, 1.375, 0],
			[1503409781244, 1.275, 0],
			[1503409781269, 2.25, 0],
			[1503409781285, 1.025, 0],
			[1503409781300, 0.925, 0],
			[1503409781303, 0.875, 0],
			[1503409781321, 0.8, 0],
			[1503409781333, 0.725, 0],
			[1503409781355, 0.65, 0],
			[1503409781370, 0.6, 0],
			[1503409781384, 0.55, 0],
			[1503409781410, 0.5, 0],
			[1503409781422, 0.475, 0],
			[1503409781435, 0.425, 0],
			[1503409781454, 0.4, 0],
			[1503409781470, 0.35, 0],
			[1503409781486, 0.325, 0],
			[1503409781501, 0.3, 0],
			[1503409781519, 0.275, 0],
			[1503409781534, 0.25, 0],
			[1503409781553, 0.225, 0],
			[1503409781569, 0.2, 0],
			[1503409781589, 0.2, 0],
			[1503409781601, 0.175, 0],
			[1503409781621, 0.15, 0],
			[1503409781631, 0.15, 0],
			[1503409781652, 0.125, 0],
			[1503409781667, 0.125, 0],
			[1503409781685, 0.125, 0],
			[1503409781703, 0.1, 0],
			[1503409781715, 0.1, 0],
			[1503409781734, 0.1, 0],
			[1503409781753, 0.075, 0],
			[1503409781768, 0.075, 0],
			[1503409781783, 0.075, 0],
			[1503409781801, 0.075, 0],
			[1503409781815, 0.05, 0],
			[1503409781836, 0.05, 0],
			[1503409781850, 0.05, 0],
			[1503409781865, 0.05, 0],
			[1503409781880, 0.05, 0],
			[1503409781899, 0.025, 0],
			[1503409781916, 0.025, 0],
			[1503409781933, 0.025, 0],
			[1503409781952, 0.025, 0],
			[1503409781965, 0.025, 0],
			[1503409781996, 0.025, 0],
			[1503409782015, 0.025, 0],
			[1503409782045, 0.025, 0],
		];

		const classifier = new MouseWheelClassifier();
		for (let i = 0, len = testData.length; i < len; i++) {
			const [timestamp, deltaY, deltaX] = testData[i];
			classifier.accept(timestamp, deltaX, deltaY);

			const actual = classifier.isPhysicalMouseWheel();
			assert.strictEqual(actual, false, `i = ${i}`);
		}
	});

	test('OSX - Razer Physical Mouse Wheel', () => {
		const testData: IMouseWheelEvent[] = [
			[1503409880776, -1, 0],
			[1503409880791, -1, 0],
			[1503409880810, -4, 0],
			[1503409880820, -5, 0],
			[1503409880848, -6, 0],
			[1503409880876, -7, 0],
			[1503409881319, -1, 0],
			[1503409881387, -1, 0],
			[1503409881407, -2, 0],
			[1503409881443, -4, 0],
			[1503409881444, -5, 0],
			[1503409881470, -6, 0],
			[1503409881496, -7, 0],
			[1503409881812, -1, 0],
			[1503409881829, -1, 0],
			[1503409881850, -4, 0],
			[1503409881871, -5, 0],
			[1503409881896, -13, 0],
			[1503409881914, -16, 0],
			[1503409882551, -1, 0],
			[1503409882589, -1, 0],
			[1503409882625, -2, 0],
			[1503409883035, -1, 0],
			[1503409883098, -1, 0],
			[1503409883143, -2, 0],
			[1503409883217, -2, 0],
			[1503409883270, -3, 0],
			[1503409883388, -3, 0],
			[1503409883531, -3, 0],
			[1503409884095, -1, 0],
			[1503409884122, -1, 0],
			[1503409884160, -3, 0],
			[1503409884208, -4, 0],
			[1503409884292, -4, 0],
			[1503409884447, -1, 0],
			[1503409884788, -1, 0],
			[1503409884835, -1, 0],
			[1503409884898, -2, 0],
			[1503409884965, -3, 0],
			[1503409885085, -2, 0],
			[1503409885552, -1, 0],
			[1503409885619, -1, 0],
			[1503409885670, -1, 0],
			[1503409885733, -2, 0],
			[1503409885784, -4, 0],
			[1503409885916, -3, 0],
		];

		const classifier = new MouseWheelClassifier();
		for (let i = 0, len = testData.length; i < len; i++) {
			const [timestamp, deltaY, deltaX] = testData[i];
			classifier.accept(timestamp, deltaX, deltaY);

			const actual = classifier.isPhysicalMouseWheel();
			assert.strictEqual(actual, true, `i = ${i}`);

		}
	});

	test('Windows - Microsoft Arc Touch', () => {
		const testData: IMouseWheelEvent[] = [
			[1503418316909, -2, 0],
			[1503418316985, -2, 0],
			[1503418316988, -4, 0],
			[1503418317034, -2, 0],
			[1503418317071, -2, 0],
			[1503418317094, -2, 0],
			[1503418317133, -2, 0],
			[1503418317170, -2, 0],
			[1503418317192, -2, 0],
			[1503418317265, -2, 0],
			[1503418317289, -2, 0],
			[1503418317365, -2, 0],
			[1503418317414, -2, 0],
			[1503418317458, -2, 0],
			[1503418317513, -2, 0],
			[1503418317583, -2, 0],
			[1503418317637, -2, 0],
			[1503418317720, -2, 0],
			[1503418317786, -2, 0],
			[1503418317832, -2, 0],
			[1503418317933, -2, 0],
			[1503418318037, -2, 0],
			[1503418318134, -2, 0],
			[1503418318267, -2, 0],
			[1503418318411, -2, 0],
		];

		const classifier = new MouseWheelClassifier();
		for (let i = 0, len = testData.length; i < len; i++) {
			const [timestamp, deltaY, deltaX] = testData[i];
			classifier.accept(timestamp, deltaX, deltaY);

			const actual = classifier.isPhysicalMouseWheel();
			assert.strictEqual(actual, true, `i = ${i}`);

		}
	});

	test('Windows - SurfaceBook TouchPad', () => {
		const testData: IMouseWheelEvent[] = [
			[1503418499174, -3.35, 0],
			[1503418499177, -0.9333333333333333, 0],
			[1503418499222, -2.091666666666667, 0],
			[1503418499238, -1.5666666666666667, 0],
			[1503418499242, -1.8, 0],
			[1503418499271, -2.5166666666666666, 0],
			[1503418499283, -0.7666666666666667, 0],
			[1503418499308, -2.033333333333333, 0],
			[1503418499320, -2.85, 0],
			[1503418499372, -1.5333333333333334, 0],
			[1503418499373, -2.8, 0],
			[1503418499411, -1.6166666666666667, 0],
			[1503418499413, -1.9166666666666667, 0],
			[1503418499443, -0.9333333333333333, 0],
			[1503418499446, -0.9833333333333333, 0],
			[1503418499458, -0.7666666666666667, 0],
			[1503418499482, -0.9666666666666667, 0],
			[1503418499485, -0.36666666666666664, 0],
			[1503418499508, -0.5833333333333334, 0],
			[1503418499532, -0.48333333333333334, 0],
			[1503418499541, -0.6333333333333333, 0],
			[1503418499571, -0.18333333333333332, 0],
			[1503418499573, -0.4, 0],
			[1503418499595, -0.15, 0],
			[1503418499608, -0.23333333333333334, 0],
			[1503418499625, -0.18333333333333332, 0],
			[1503418499657, -0.13333333333333333, 0],
			[1503418499674, -0.15, 0],
			[1503418499676, -0.03333333333333333, 0],
			[1503418499691, -0.016666666666666666, 0],
		];

		const classifier = new MouseWheelClassifier();
		for (let i = 0, len = testData.length; i < len; i++) {
			const [timestamp, deltaY, deltaX] = testData[i];
			classifier.accept(timestamp, deltaX, deltaY);

			const actual = classifier.isPhysicalMouseWheel();
			assert.strictEqual(actual, false, `i = ${i}`);
		}
	});

	test('Windows - Razer physical wheel', () => {
		const testData: IMouseWheelEvent[] = [
			[1503418638271, -2, 0],
			[1503418638317, -2, 0],
			[1503418638336, -2, 0],
			[1503418638350, -2, 0],
			[1503418638360, -2, 0],
			[1503418638366, -2, 0],
			[1503418638407, -2, 0],
			[1503418638694, -2, 0],
			[1503418638742, -2, 0],
			[1503418638744, -2, 0],
			[1503418638746, -2, 0],
			[1503418638780, -2, 0],
			[1503418638782, -2, 0],
			[1503418638810, -2, 0],
			[1503418639127, -2, 0],
			[1503418639168, -2, 0],
			[1503418639194, -2, 0],
			[1503418639197, -4, 0],
			[1503418639244, -2, 0],
			[1503418639248, -2, 0],
			[1503418639586, -2, 0],
			[1503418639653, -2, 0],
			[1503418639667, -4, 0],
			[1503418639677, -2, 0],
			[1503418639681, -2, 0],
			[1503418639728, -2, 0],
			[1503418639997, -2, 0],
			[1503418640034, -2, 0],
			[1503418640039, -2, 0],
			[1503418640065, -2, 0],
			[1503418640080, -2, 0],
			[1503418640097, -2, 0],
			[1503418640141, -2, 0],
			[1503418640413, -2, 0],
			[1503418640456, -2, 0],
			[1503418640490, -2, 0],
			[1503418640492, -4, 0],
			[1503418640494, -2, 0],
			[1503418640546, -2, 0],
			[1503418640781, -2, 0],
			[1503418640823, -2, 0],
			[1503418640824, -2, 0],
			[1503418640829, -2, 0],
			[1503418640864, -2, 0],
			[1503418640874, -2, 0],
			[1503418640876, -2, 0],
			[1503418641168, -2, 0],
			[1503418641203, -2, 0],
			[1503418641224, -2, 0],
			[1503418641240, -2, 0],
			[1503418641254, -4, 0],
			[1503418641270, -2, 0],
			[1503418641546, -2, 0],
			[1503418641612, -2, 0],
			[1503418641625, -6, 0],
			[1503418641634, -2, 0],
			[1503418641680, -2, 0],
			[1503418641961, -2, 0],
			[1503418642004, -2, 0],
			[1503418642016, -4, 0],
			[1503418642044, -2, 0],
			[1503418642065, -2, 0],
			[1503418642083, -2, 0],
			[1503418642349, -2, 0],
			[1503418642378, -2, 0],
			[1503418642390, -2, 0],
			[1503418642408, -2, 0],
			[1503418642413, -2, 0],
			[1503418642448, -2, 0],
			[1503418642468, -2, 0],
			[1503418642746, -2, 0],
			[1503418642800, -2, 0],
			[1503418642814, -4, 0],
			[1503418642816, -2, 0],
			[1503418642857, -2, 0],
		];

		const classifier = new MouseWheelClassifier();
		for (let i = 0, len = testData.length; i < len; i++) {
			const [timestamp, deltaY, deltaX] = testData[i];
			classifier.accept(timestamp, deltaX, deltaY);

			const actual = classifier.isPhysicalMouseWheel();
			assert.strictEqual(actual, true, `i = ${i}`);

		}
	});

	test('Windows - Logitech physical wheel', () => {
		const testData: IMouseWheelEvent[] = [
			[1503418872930, -2, 0],
			[1503418872952, -2, 0],
			[1503418872969, -2, 0],
			[1503418873022, -2, 0],
			[1503418873042, -2, 0],
			[1503418873076, -2, 0],
			[1503418873368, -2, 0],
			[1503418873393, -2, 0],
			[1503418873404, -2, 0],
			[1503418873425, -2, 0],
			[1503418873479, -2, 0],
			[1503418873520, -2, 0],
			[1503418873758, -2, 0],
			[1503418873759, -2, 0],
			[1503418873762, -2, 0],
			[1503418873807, -2, 0],
			[1503418873830, -4, 0],
			[1503418873850, -2, 0],
			[1503418874076, -2, 0],
			[1503418874116, -2, 0],
			[1503418874136, -4, 0],
			[1503418874148, -2, 0],
			[1503418874150, -2, 0],
			[1503418874409, -2, 0],
			[1503418874452, -2, 0],
			[1503418874472, -2, 0],
			[1503418874474, -4, 0],
			[1503418874543, -2, 0],
			[1503418874566, -2, 0],
			[1503418874778, -2, 0],
			[1503418874780, -2, 0],
			[1503418874801, -2, 0],
			[1503418874822, -2, 0],
			[1503418874832, -2, 0],
			[1503418874845, -2, 0],
			[1503418875122, -2, 0],
			[1503418875158, -2, 0],
			[1503418875180, -2, 0],
			[1503418875195, -4, 0],
			[1503418875239, -2, 0],
			[1503418875260, -2, 0],
			[1503418875490, -2, 0],
			[1503418875525, -2, 0],
			[1503418875547, -4, 0],
			[1503418875556, -4, 0],
			[1503418875630, -2, 0],
			[1503418875852, -2, 0],
			[1503418875895, -2, 0],
			[1503418875935, -2, 0],
			[1503418875941, -4, 0],
			[1503418876198, -2, 0],
			[1503418876242, -2, 0],
			[1503418876270, -4, 0],
			[1503418876279, -2, 0],
			[1503418876333, -2, 0],
			[1503418876342, -2, 0],
			[1503418876585, -2, 0],
			[1503418876609, -2, 0],
			[1503418876623, -2, 0],
			[1503418876644, -2, 0],
			[1503418876646, -2, 0],
			[1503418876678, -2, 0],
			[1503418877330, -2, 0],
			[1503418877354, -2, 0],
			[1503418877368, -2, 0],
			[1503418877397, -2, 0],
			[1503418877411, -2, 0],
			[1503418877748, -2, 0],
			[1503418877756, -2, 0],
			[1503418877778, -2, 0],
			[1503418877793, -2, 0],
			[1503418877807, -2, 0],
			[1503418878091, -2, 0],
			[1503418878133, -2, 0],
			[1503418878137, -4, 0],
			[1503418878181, -2, 0],
		];

		const classifier = new MouseWheelClassifier();
		for (let i = 0, len = testData.length; i < len; i++) {
			const [timestamp, deltaY, deltaX] = testData[i];
			classifier.accept(timestamp, deltaX, deltaY);

			const actual = classifier.isPhysicalMouseWheel();
			assert.strictEqual(actual, true, `i = ${i}`);

		}
	});

	test('Windows - Microsoft basic v2 physical wheel', () => {
		const testData: IMouseWheelEvent[] = [
			[1503418994564, -2, 0],
			[1503418994643, -2, 0],
			[1503418994676, -2, 0],
			[1503418994691, -2, 0],
			[1503418994727, -2, 0],
			[1503418994799, -2, 0],
			[1503418994850, -2, 0],
			[1503418995259, -2, 0],
			[1503418995321, -2, 0],
			[1503418995328, -2, 0],
			[1503418995343, -2, 0],
			[1503418995402, -2, 0],
			[1503418995454, -2, 0],
			[1503418996052, -2, 0],
			[1503418996095, -2, 0],
			[1503418996107, -2, 0],
			[1503418996120, -2, 0],
			[1503418996146, -2, 0],
			[1503418996471, -2, 0],
			[1503418996530, -2, 0],
			[1503418996549, -2, 0],
			[1503418996561, -2, 0],
			[1503418996571, -2, 0],
			[1503418996636, -2, 0],
			[1503418996936, -2, 0],
			[1503418997002, -2, 0],
			[1503418997006, -2, 0],
			[1503418997043, -2, 0],
			[1503418997045, -2, 0],
			[1503418997092, -2, 0],
			[1503418997357, -2, 0],
			[1503418997394, -2, 0],
			[1503418997410, -2, 0],
			[1503418997426, -2, 0],
			[1503418997442, -2, 0],
			[1503418997486, -2, 0],
			[1503418997757, -2, 0],
			[1503418997807, -2, 0],
			[1503418997813, -2, 0],
			[1503418997850, -2, 0],
		];

		const classifier = new MouseWheelClassifier();
		for (let i = 0, len = testData.length; i < len; i++) {
			const [timestamp, deltaY, deltaX] = testData[i];
			classifier.accept(timestamp, deltaX, deltaY);

			const actual = classifier.isPhysicalMouseWheel();
			assert.strictEqual(actual, true, `i = ${i}`);
		}
	});

	test('Linux Wayland - Logitech G Pro Wireless', () => {
		const testData: IMouseWheelEvent[] = [
			[1707837460397, -1.5, 0],
			[1707837460449, -1.5, 0],
			[1707837460498, -1.5, 0],
			[1707837460553, -1.5, 0],
			[1707837460574, -1.5, 0],
			[1707837460602, -1.5, 0],
			[1707837460623, -1.5, 0],
			[1707837460643, -1.5, 0],
			[1707837460664, -1.5, 0],
			[1707837460685, -1.5, 0],
			[1707837460713, -1.5, 0],
			[1707837460762, -1.5, 0],
			[1707837460978, 1.5, 0],
			[1707837460998, 1.5, 0],
			[1707837461012, 1.5, 0],
			[1707837461025, 1.5, 0],
			[1707837461032, 1.5, 0],
			[1707837461046, 1.5, 0],
			[1707837461067, 1.5, 0],
			[1707837461081, 1.5, 0],
			[1707837461095, 1.5, 0],
			[1707837461123, 1.5, 0],
			[1707837461157, 1.5, 0],
			[1707837461219, 1.5, 0],
			[1707837461288, -1.5, 0],
			[1707837461324, -1.5, 0],
			[1707837461338, -1.5, 0],
			[1707837461352, -1.5, 0],
			[1707837461366, -1.5, 0],
			[1707837461373, -1.5, 0],
			[1707837461387, -1.5, 0],
			[1707837461394, -1.5, 0],
			[1707837461400, -1.5, 0],
			[1707837461407, -1.5, 0],
			[1707837461414, -1.5, 0],
			[1707837461442, -1.5, 0],
			[1707837461525, 1.5, 0],
			[1707837461532, 1.5, 0],
			[1707837461539, 1.5, 0],
			[1707837461546, 1.5, 0],
			[1707837461553, 1.5, 0],
			[1707837461560, 1.5, 0],
			[1707837461567, 1.5, 0],
			[1707837461574, 1.5, 0],
			[1707837461581, 1.5, 0],
			[1707837461664, -1.5, 0],
			[1707837461678, -1.5, 0],
			[1707837461685, -1.5, 0],
			[1707837461692, -1.5, 0],
			[1707837461699, -1.5, 0],
			[1707837461706, -1.5, 0],
			[1707837461713, -1.5, 0],
			[1707837461720, -1.5, 0],
			[1707837461727, -1.5, 0],
			[1707837461803, 1.5, 0],
			[1707837461810, 1.5, 0],
			[1707837461817, 1.5, 0],
			[1707837461824, 1.5, 0],
			[1707837461831, 1.5, 0],
			[1707837461838, 1.5, 0],
			[1707837461845, 1.5, 0],
			[1707837461852, 3, 0],
			[1707837461873, 1.5, 0],
			[1707837461942, -1.5, 0],
			[1707837461949, -1.5, 0],
			[1707837461956, -1.5, 0],
			[1707837461963, -1.5, 0],
			[1707837461970, -1.5, 0],
			[1707837461977, -3, 0],
			[1707837461984, -1.5, 0],
			[1707837461991, -1.5, 0],
			[1707837462081, 1.5, 0],
			[1707837462088, 1.5, 0],
			[1707837462241, -1.5, 0],
			[1707837462253, -1.5, 0],
			[1707837462256, -1.5, 0],
			[1707837462262, -1.5, 0],
			[1707837462268, -1.5, 0],
			[1707837462276, -1.5, 0],
			[1707837462282, -4.5, 0],
			[1707837462292, -3, 0],
			[1707837462300, -1.5, 0],
			[1707837462485, -1.5, 0],
			[1707837462492, -1.5, 0],
			[1707837462498, -1.5, 0],
			[1707837462505, -1.5, 0],
			[1707837462511, -1.5, 0],
			[1707837462518, -3, 0],
			[1707837462525, -3, 0],
			[1707837462532, -1.5, 0],
			[1707837462741, -1.5, 0],
			[1707837462755, -1.5, 0],
			[1707837462761, -1.5, 0],
			[1707837462768, -1.5, 0],
			[1707837462775, -1.5, 0],
			[1707837462909, 1.5, 0],
			[1707837462921, 1.5, 0],
			[1707837462928, 1.5, 0],
			[1707837462935, 3, 0],
			[1707837462942, 3, 0],
			[1707837462949, 1.5, 0],
			[1707837462956, 1.5, 0],
			[1707837462963, 1.5, 0],
			[1707837462970, 1.5, 0],
			[1707837463180, 1.5, 0],
			[1707837463188, 1.5, 0],
			[1707837463194, 1.5, 0],
			[1707837463199, 1.5, 0],
			[1707837463206, 1.5, 0],
			[1707837463213, 1.5, 0],
			[1707837463220, 1.5, 0],
			[1707837463227, 1.5, 0],
			[1707837463234, 1.5, 0],
			[1707837463241, 1.5, 0],
			[1707837463426, 1.5, 0],
			[1707837463434, 1.5, 0],
			[1707837463440, 1.5, 0],
			[1707837463446, 1.5, 0],
			[1707837463451, 1.5, 0],
			[1707837463456, 1.5, 0],
			[1707837463463, 1.5, 0],
			[1707837463470, 1.5, 0],
			[1707837463477, 1.5, 0],
			[1707837463766, 1.5, 0],
			[1707837463774, 1.5, 0],
			[1707837463781, 1.5, 0],
			[1707837463786, 1.5, 0],
			[1707837463792, 1.5, 0],
			[1707837463797, 1.5, 0],
			[1707837463804, 1.5, 0],
			[1707837463817, 1.5, 0],
			[1707837463940, -1.5, 0],
			[1707837463956, -1.5, 0],
			[1707837463963, -1.5, 0],
			[1707837463977, -1.5, 0],
			[1707837463984, -1.5, 0],
			[1707837463991, -3, 0],
			[1707837463998, -1.5, 0],
			[1707837464005, -1.5, 0],
			[1707837464185, -1.5, 0],
			[1707837464192, -1.5, 0],
			[1707837464199, -1.5, 0],
			[1707837464206, -1.5, 0],
			[1707837464213, -1.5, 0],
			[1707837464220, -3, 0],
			[1707837464227, -1.5, 0],
			[1707837464392, -1.5, 0],
			[1707837464399, -1.5, 0],
			[1707837464405, -1.5, 0],
			[1707837464409, -1.5, 0],
			[1707837464414, -1.5, 0],
			[1707837464421, -1.5, 0],
			[1707837464430, -1.5, 0],
			[1707837464577, 1.5, 0],
			[1707837464588, 1.5, 0],
			[1707837464595, 1.5, 0],
			[1707837464602, 1.5, 0],
			[1707837464609, 1.5, 0],
			[1707837464616, 1.5, 0],
			[1707837464623, 3, 0],
			[1707837464630, 1.5, 0],
			[1707837464637, 1.5, 0],
			[1707837464838, 1.5, 0],
			[1707837464845, 1.5, 0],
			[1707837464852, 1.5, 0],
			[1707837464859, 1.5, 0],
			[1707837464866, 3, 0],
			[1707837464872, 1.5, 0],
			[1707837464879, 1.5, 0],
			[1707837464886, 1.5, 0],
			[1707837464893, 1.5, 0],
			[1707837465084, 1.5, 0],
			[1707837465091, 1.5, 0],
			[1707837465097, 1.5, 0],
			[1707837465102, 1.5, 0],
			[1707837465109, 1.5, 0],
			[1707837465116, 1.5, 0],
			[1707837465122, 1.5, 0],
			[1707837465129, 1.5, 0],
			[1707837465136, 1.5, 0],
			[1707837465157, 1.5, 0],
		];

		const classifier = new MouseWheelClassifier();
		for (let i = 0, len = testData.length; i < len; i++) {
			const [timestamp, deltaY, deltaX] = testData[i];
			classifier.accept(timestamp, deltaX, deltaY);

			const actual = classifier.isPhysicalMouseWheel();

			// Linux Wayland implementation depends on looking at the
			// previous event.
			if (i > 0) {
				assert.strictEqual(actual, true, `i = ${i}`);
			}
		}
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/ui/scrollbar/scrollbarState.test.ts]---
Location: vscode-main/src/vs/base/test/browser/ui/scrollbar/scrollbarState.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ScrollbarState } from '../../../../browser/ui/scrollbar/scrollbarState.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../common/utils.js';

suite('ScrollbarState', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('inflates slider size', () => {
		const actual = new ScrollbarState(0, 14, 0, 339, 42423, 32787);

		assert.strictEqual(actual.getArrowSize(), 0);
		assert.strictEqual(actual.getScrollPosition(), 32787);
		assert.strictEqual(actual.getRectangleLargeSize(), 339);
		assert.strictEqual(actual.getRectangleSmallSize(), 14);
		assert.strictEqual(actual.isNeeded(), true);
		assert.strictEqual(actual.getSliderSize(), 20);
		assert.strictEqual(actual.getSliderPosition(), 249);

		assert.strictEqual(actual.getDesiredScrollPositionFromOffset(259), 32849);

		// 259 is greater than 230 so page down, 32787 + 339 =  33126
		assert.strictEqual(actual.getDesiredScrollPositionFromOffsetPaged(259), 33126);

		actual.setScrollPosition(32849);
		assert.strictEqual(actual.getArrowSize(), 0);
		assert.strictEqual(actual.getScrollPosition(), 32849);
		assert.strictEqual(actual.getRectangleLargeSize(), 339);
		assert.strictEqual(actual.getRectangleSmallSize(), 14);
		assert.strictEqual(actual.isNeeded(), true);
		assert.strictEqual(actual.getSliderSize(), 20);
		assert.strictEqual(actual.getSliderPosition(), 249);
	});

	test('inflates slider size with arrows', () => {
		const actual = new ScrollbarState(12, 14, 0, 339, 42423, 32787);

		assert.strictEqual(actual.getArrowSize(), 12);
		assert.strictEqual(actual.getScrollPosition(), 32787);
		assert.strictEqual(actual.getRectangleLargeSize(), 339);
		assert.strictEqual(actual.getRectangleSmallSize(), 14);
		assert.strictEqual(actual.isNeeded(), true);
		assert.strictEqual(actual.getSliderSize(), 20);
		assert.strictEqual(actual.getSliderPosition(), 230);

		assert.strictEqual(actual.getDesiredScrollPositionFromOffset(240 + 12), 32811);

		// 240 + 12 = 252; greater than 230 so page down, 32787 + 339 =  33126
		assert.strictEqual(actual.getDesiredScrollPositionFromOffsetPaged(240 + 12), 33126);

		actual.setScrollPosition(32811);
		assert.strictEqual(actual.getArrowSize(), 12);
		assert.strictEqual(actual.getScrollPosition(), 32811);
		assert.strictEqual(actual.getRectangleLargeSize(), 339);
		assert.strictEqual(actual.getRectangleSmallSize(), 14);
		assert.strictEqual(actual.isNeeded(), true);
		assert.strictEqual(actual.getSliderSize(), 20);
		assert.strictEqual(actual.getSliderPosition(), 230);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/ui/splitview/splitview.test.ts]---
Location: vscode-main/src/vs/base/test/browser/ui/splitview/splitview.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable no-restricted-syntax */

import assert from 'assert';
import { Sash, SashState } from '../../../../browser/ui/sash/sash.js';
import { IView, LayoutPriority, Sizing, SplitView } from '../../../../browser/ui/splitview/splitview.js';
import { Emitter } from '../../../../common/event.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../common/utils.js';

class TestView implements IView<number> {

	private readonly _onDidChange = new Emitter<number | undefined>();
	readonly onDidChange = this._onDidChange.event;

	get minimumSize(): number { return this._minimumSize; }
	set minimumSize(size: number) { this._minimumSize = size; this._onDidChange.fire(undefined); }

	get maximumSize(): number { return this._maximumSize; }
	set maximumSize(size: number) { this._maximumSize = size; this._onDidChange.fire(undefined); }

	private _element: HTMLElement = document.createElement('div');
	get element(): HTMLElement { this._onDidGetElement.fire(); return this._element; }

	private readonly _onDidGetElement = new Emitter<void>();
	readonly onDidGetElement = this._onDidGetElement.event;

	private _size = 0;
	get size(): number { return this._size; }
	private _orthogonalSize: number | undefined = 0;
	get orthogonalSize(): number | undefined { return this._orthogonalSize; }
	private readonly _onDidLayout = new Emitter<{ size: number; orthogonalSize: number | undefined }>();
	readonly onDidLayout = this._onDidLayout.event;

	private readonly _onDidFocus = new Emitter<void>();
	readonly onDidFocus = this._onDidFocus.event;

	constructor(
		private _minimumSize: number,
		private _maximumSize: number,
		readonly priority: LayoutPriority = LayoutPriority.Normal
	) {
		assert(_minimumSize <= _maximumSize, 'splitview view minimum size must be <= maximum size');
	}

	layout(size: number, _offset: number, orthogonalSize: number | undefined): void {
		this._size = size;
		this._orthogonalSize = orthogonalSize;
		this._onDidLayout.fire({ size, orthogonalSize });
	}

	focus(): void {
		this._onDidFocus.fire();
	}

	dispose(): void {
		this._onDidChange.dispose();
		this._onDidGetElement.dispose();
		this._onDidLayout.dispose();
		this._onDidFocus.dispose();
	}
}

function getSashes(splitview: SplitView): Sash[] {
	return splitview.sashItems.map((i: any) => i.sash) as Sash[];
}

suite('Splitview', () => {

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let container: HTMLElement;

	setup(() => {
		container = document.createElement('div');
		container.style.position = 'absolute';
		container.style.width = `${200}px`;
		container.style.height = `${200}px`;
	});

	test('empty splitview has empty DOM', () => {
		store.add(new SplitView(container));
		assert.strictEqual(container.firstElementChild!.firstElementChild!.childElementCount, 0, 'split view should be empty');
	});

	test('has views and sashes as children', () => {
		const view1 = store.add(new TestView(20, 20));
		const view2 = store.add(new TestView(20, 20));
		const view3 = store.add(new TestView(20, 20));
		const splitview = store.add(new SplitView(container));

		splitview.addView(view1, 20);
		splitview.addView(view2, 20);
		splitview.addView(view3, 20);

		let viewQuery = container.querySelectorAll('.monaco-split-view2 > .monaco-scrollable-element > .split-view-container > .split-view-view');
		assert.strictEqual(viewQuery.length, 3, 'split view should have 3 views');

		let sashQuery = container.querySelectorAll('.monaco-split-view2 > .sash-container > .monaco-sash');
		assert.strictEqual(sashQuery.length, 2, 'split view should have 2 sashes');

		splitview.removeView(2);

		viewQuery = container.querySelectorAll('.monaco-split-view2 > .monaco-scrollable-element > .split-view-container > .split-view-view');
		assert.strictEqual(viewQuery.length, 2, 'split view should have 2 views');

		sashQuery = container.querySelectorAll('.monaco-split-view2 > .sash-container > .monaco-sash');
		assert.strictEqual(sashQuery.length, 1, 'split view should have 1 sash');

		splitview.removeView(0);

		viewQuery = container.querySelectorAll('.monaco-split-view2 > .monaco-scrollable-element > .split-view-container > .split-view-view');
		assert.strictEqual(viewQuery.length, 1, 'split view should have 1 view');

		sashQuery = container.querySelectorAll('.monaco-split-view2 > .sash-container > .monaco-sash');
		assert.strictEqual(sashQuery.length, 0, 'split view should have no sashes');

		splitview.removeView(0);

		viewQuery = container.querySelectorAll('.monaco-split-view2 > .monaco-scrollable-element > .split-view-container > .split-view-view');
		assert.strictEqual(viewQuery.length, 0, 'split view should have no views');

		sashQuery = container.querySelectorAll('.monaco-split-view2 > .sash-container > .monaco-sash');
		assert.strictEqual(sashQuery.length, 0, 'split view should have no sashes');
	});

	test('calls view methods on addView and removeView', () => {
		const view = store.add(new TestView(20, 20));
		const splitview = store.add(new SplitView(container));

		let didLayout = false;
		store.add(view.onDidLayout(() => didLayout = true));
		store.add(view.onDidGetElement(() => undefined));

		splitview.addView(view, 20);

		assert.strictEqual(view.size, 20, 'view has right size');
		assert(didLayout, 'layout is called');
		assert(didLayout, 'render is called');
	});

	test('stretches view to viewport', () => {
		const view = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const splitview = store.add(new SplitView(container));
		splitview.layout(200);

		splitview.addView(view, 20);
		assert.strictEqual(view.size, 200, 'view is stretched');

		splitview.layout(200);
		assert.strictEqual(view.size, 200, 'view stayed the same');

		splitview.layout(100);
		assert.strictEqual(view.size, 100, 'view is collapsed');

		splitview.layout(20);
		assert.strictEqual(view.size, 20, 'view is collapsed');

		splitview.layout(10);
		assert.strictEqual(view.size, 20, 'view is clamped');

		splitview.layout(200);
		assert.strictEqual(view.size, 200, 'view is stretched');
	});

	test('can resize views', () => {
		const view1 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const view2 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const view3 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const splitview = store.add(new SplitView(container));
		splitview.layout(200);

		splitview.addView(view1, 20);
		splitview.addView(view2, 20);
		splitview.addView(view3, 20);

		assert.strictEqual(view1.size, 160, 'view1 is stretched');
		assert.strictEqual(view2.size, 20, 'view2 size is 20');
		assert.strictEqual(view3.size, 20, 'view3 size is 20');

		splitview.resizeView(1, 40);

		assert.strictEqual(view1.size, 140, 'view1 is collapsed');
		assert.strictEqual(view2.size, 40, 'view2 is stretched');
		assert.strictEqual(view3.size, 20, 'view3 stays the same');

		splitview.resizeView(0, 70);

		assert.strictEqual(view1.size, 70, 'view1 is collapsed');
		assert.strictEqual(view2.size, 40, 'view2 stays the same');
		assert.strictEqual(view3.size, 90, 'view3 is stretched');

		splitview.resizeView(2, 40);

		assert.strictEqual(view1.size, 70, 'view1 stays the same');
		assert.strictEqual(view2.size, 90, 'view2 is collapsed');
		assert.strictEqual(view3.size, 40, 'view3 is stretched');
	});

	test('reacts to view changes', () => {
		const view1 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const view2 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const view3 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const splitview = store.add(new SplitView(container));
		splitview.layout(200);

		splitview.addView(view1, 20);
		splitview.addView(view2, 20);
		splitview.addView(view3, 20);

		assert.strictEqual(view1.size, 160, 'view1 is stretched');
		assert.strictEqual(view2.size, 20, 'view2 size is 20');
		assert.strictEqual(view3.size, 20, 'view3 size is 20');

		view1.maximumSize = 20;

		assert.strictEqual(view1.size, 20, 'view1 is collapsed');
		assert.strictEqual(view2.size, 20, 'view2 stays the same');
		assert.strictEqual(view3.size, 160, 'view3 is stretched');

		view3.maximumSize = 40;

		assert.strictEqual(view1.size, 20, 'view1 stays the same');
		assert.strictEqual(view2.size, 140, 'view2 is stretched');
		assert.strictEqual(view3.size, 40, 'view3 is collapsed');

		view2.maximumSize = 200;

		assert.strictEqual(view1.size, 20, 'view1 stays the same');
		assert.strictEqual(view2.size, 140, 'view2 stays the same');
		assert.strictEqual(view3.size, 40, 'view3 stays the same');

		view3.maximumSize = Number.POSITIVE_INFINITY;
		view3.minimumSize = 100;

		assert.strictEqual(view1.size, 20, 'view1 is collapsed');
		assert.strictEqual(view2.size, 80, 'view2 is collapsed');
		assert.strictEqual(view3.size, 100, 'view3 is stretched');
	});

	test('sashes are properly enabled/disabled', () => {
		const view1 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const view2 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const view3 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const splitview = store.add(new SplitView(container));
		splitview.layout(200);

		splitview.addView(view1, Sizing.Distribute);
		splitview.addView(view2, Sizing.Distribute);
		splitview.addView(view3, Sizing.Distribute);

		const sashes = getSashes(splitview);
		assert.strictEqual(sashes.length, 2, 'there are two sashes');
		assert.strictEqual(sashes[0].state, SashState.Enabled, 'first sash is enabled');
		assert.strictEqual(sashes[1].state, SashState.Enabled, 'second sash is enabled');

		splitview.layout(60);
		assert.strictEqual(sashes[0].state, SashState.Disabled, 'first sash is disabled');
		assert.strictEqual(sashes[1].state, SashState.Disabled, 'second sash is disabled');

		splitview.layout(20);
		assert.strictEqual(sashes[0].state, SashState.Disabled, 'first sash is disabled');
		assert.strictEqual(sashes[1].state, SashState.Disabled, 'second sash is disabled');

		splitview.layout(200);
		assert.strictEqual(sashes[0].state, SashState.Enabled, 'first sash is enabled');
		assert.strictEqual(sashes[1].state, SashState.Enabled, 'second sash is enabled');

		view1.maximumSize = 20;
		assert.strictEqual(sashes[0].state, SashState.Disabled, 'first sash is disabled');
		assert.strictEqual(sashes[1].state, SashState.Enabled, 'second sash is enabled');

		view2.maximumSize = 20;
		assert.strictEqual(sashes[0].state, SashState.Disabled, 'first sash is disabled');
		assert.strictEqual(sashes[1].state, SashState.Disabled, 'second sash is disabled');

		view1.maximumSize = 300;
		assert.strictEqual(sashes[0].state, SashState.AtMinimum, 'first sash is enabled');
		assert.strictEqual(sashes[1].state, SashState.AtMinimum, 'second sash is enabled');

		view2.maximumSize = 200;
		assert.strictEqual(sashes[0].state, SashState.AtMinimum, 'first sash is enabled');
		assert.strictEqual(sashes[1].state, SashState.AtMinimum, 'second sash is enabled');

		splitview.resizeView(0, 40);
		assert.strictEqual(sashes[0].state, SashState.Enabled, 'first sash is enabled');
		assert.strictEqual(sashes[1].state, SashState.Enabled, 'second sash is enabled');
	});

	test('issue #35497', () => {
		const view1 = store.add(new TestView(160, Number.POSITIVE_INFINITY));
		const view2 = store.add(new TestView(66, 66));

		const splitview = store.add(new SplitView(container));
		splitview.layout(986);

		splitview.addView(view1, 142, 0);
		assert.strictEqual(view1.size, 986, 'first view is stretched');

		store.add(view2.onDidGetElement(() => {
			assert.throws(() => splitview.resizeView(1, 922));
			assert.throws(() => splitview.resizeView(1, 922));
		}));

		splitview.addView(view2, 66, 0);
		assert.strictEqual(view2.size, 66, 'second view is fixed');
		assert.strictEqual(view1.size, 986 - 66, 'first view is collapsed');

		const viewContainers = container.querySelectorAll('.split-view-view');
		assert.strictEqual(viewContainers.length, 2, 'there are two view containers');
		assert.strictEqual((viewContainers.item(0) as HTMLElement).style.height, '66px', 'second view container is 66px');
		assert.strictEqual<string>((viewContainers.item(1) as HTMLElement).style.height, `${986 - 66}px`, 'first view container is 66px');
	});

	test('automatic size distribution', () => {
		const view1 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const view2 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const view3 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const splitview = store.add(new SplitView(container));
		splitview.layout(200);

		splitview.addView(view1, Sizing.Distribute);
		assert.strictEqual(view1.size, 200);

		splitview.addView(view2, 50);
		assert.deepStrictEqual([view1.size, view2.size], [150, 50]);

		splitview.addView(view3, Sizing.Distribute);
		assert.deepStrictEqual([view1.size, view2.size, view3.size], [66, 66, 68]);

		splitview.removeView(1, Sizing.Distribute);
		assert.deepStrictEqual([view1.size, view3.size], [100, 100]);
	});

	test('add views before layout', () => {
		const view1 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const view2 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const view3 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const splitview = store.add(new SplitView(container));

		splitview.addView(view1, 100);
		splitview.addView(view2, 75);
		splitview.addView(view3, 25);

		splitview.layout(200);
		assert.deepStrictEqual([view1.size, view2.size, view3.size], [67, 67, 66]);
	});

	test('split sizing', () => {
		const view1 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const view2 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const view3 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const splitview = store.add(new SplitView(container));
		splitview.layout(200);

		splitview.addView(view1, Sizing.Distribute);
		assert.strictEqual(view1.size, 200);

		splitview.addView(view2, Sizing.Split(0));
		assert.deepStrictEqual([view1.size, view2.size], [100, 100]);

		splitview.addView(view3, Sizing.Split(1));
		assert.deepStrictEqual([view1.size, view2.size, view3.size], [100, 50, 50]);
	});

	test('split sizing 2', () => {
		const view1 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const view2 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const view3 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const splitview = store.add(new SplitView(container));
		splitview.layout(200);

		splitview.addView(view1, Sizing.Distribute);
		assert.strictEqual(view1.size, 200);

		splitview.addView(view2, Sizing.Split(0));
		assert.deepStrictEqual([view1.size, view2.size], [100, 100]);

		splitview.addView(view3, Sizing.Split(0));
		assert.deepStrictEqual([view1.size, view2.size, view3.size], [50, 100, 50]);
	});

	test('proportional layout', () => {
		const view1 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const view2 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const splitview = store.add(new SplitView(container));
		splitview.layout(200);

		splitview.addView(view1, Sizing.Distribute);
		splitview.addView(view2, Sizing.Distribute);
		assert.deepStrictEqual([view1.size, view2.size], [100, 100]);

		splitview.layout(100);
		assert.deepStrictEqual([view1.size, view2.size], [50, 50]);
	});

	test('disable proportional layout', () => {
		const view1 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const view2 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const splitview = store.add(new SplitView(container, { proportionalLayout: false }));
		splitview.layout(200);

		splitview.addView(view1, Sizing.Distribute);
		splitview.addView(view2, Sizing.Distribute);
		assert.deepStrictEqual([view1.size, view2.size], [100, 100]);

		splitview.layout(100);
		assert.deepStrictEqual([view1.size, view2.size], [80, 20]);
	});

	test('high layout priority', () => {
		const view1 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const view2 = store.add(new TestView(20, Number.POSITIVE_INFINITY, LayoutPriority.High));
		const view3 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const splitview = store.add(new SplitView(container, { proportionalLayout: false }));
		splitview.layout(200);

		splitview.addView(view1, Sizing.Distribute);
		splitview.addView(view2, Sizing.Distribute);
		splitview.addView(view3, Sizing.Distribute);
		assert.deepStrictEqual([view1.size, view2.size, view3.size], [66, 68, 66]);

		splitview.layout(180);
		assert.deepStrictEqual([view1.size, view2.size, view3.size], [66, 48, 66]);

		splitview.layout(124);
		assert.deepStrictEqual([view1.size, view2.size, view3.size], [66, 20, 38]);

		splitview.layout(60);
		assert.deepStrictEqual([view1.size, view2.size, view3.size], [20, 20, 20]);

		splitview.layout(200);
		assert.deepStrictEqual([view1.size, view2.size, view3.size], [20, 160, 20]);
	});

	test('low layout priority', () => {
		const view1 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const view2 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const view3 = store.add(new TestView(20, Number.POSITIVE_INFINITY, LayoutPriority.Low));
		const splitview = store.add(new SplitView(container, { proportionalLayout: false }));
		splitview.layout(200);

		splitview.addView(view1, Sizing.Distribute);
		splitview.addView(view2, Sizing.Distribute);
		splitview.addView(view3, Sizing.Distribute);
		assert.deepStrictEqual([view1.size, view2.size, view3.size], [66, 68, 66]);

		splitview.layout(180);
		assert.deepStrictEqual([view1.size, view2.size, view3.size], [66, 48, 66]);

		splitview.layout(132);
		assert.deepStrictEqual([view1.size, view2.size, view3.size], [46, 20, 66]);

		splitview.layout(60);
		assert.deepStrictEqual([view1.size, view2.size, view3.size], [20, 20, 20]);

		splitview.layout(200);
		assert.deepStrictEqual([view1.size, view2.size, view3.size], [20, 160, 20]);
	});

	test('context propagates to views', () => {
		const view1 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const view2 = store.add(new TestView(20, Number.POSITIVE_INFINITY));
		const view3 = store.add(new TestView(20, Number.POSITIVE_INFINITY, LayoutPriority.Low));
		const splitview = store.add(new SplitView<number>(container, { proportionalLayout: false }));
		splitview.layout(200);

		splitview.addView(view1, Sizing.Distribute);
		splitview.addView(view2, Sizing.Distribute);
		splitview.addView(view3, Sizing.Distribute);

		splitview.layout(200, 100);
		assert.deepStrictEqual([view1.orthogonalSize, view2.orthogonalSize, view3.orthogonalSize], [100, 100, 100]);
	});
});
```

--------------------------------------------------------------------------------

````

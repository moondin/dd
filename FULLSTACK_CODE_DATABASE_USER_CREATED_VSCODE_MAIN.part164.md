---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 164
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 164 of 552)

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

---[FILE: src/vs/base/browser/markdownRenderer.ts]---
Location: vscode-main/src/vs/base/browser/markdownRenderer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { onUnexpectedError } from '../common/errors.js';
import { escapeDoubleQuotes, IMarkdownString, MarkdownStringTrustedOptions, parseHrefAndDimensions, removeMarkdownEscapes } from '../common/htmlContent.js';
import { markdownEscapeEscapedIcons } from '../common/iconLabels.js';
import { defaultGenerator } from '../common/idGenerator.js';
import { KeyCode } from '../common/keyCodes.js';
import { DisposableStore, IDisposable } from '../common/lifecycle.js';
import * as marked from '../common/marked/marked.js';
import { parse } from '../common/marshalling.js';
import { FileAccess, Schemas } from '../common/network.js';
import { cloneAndChange } from '../common/objects.js';
import { basename as pathBasename } from '../common/path.js';
import { basename, dirname, resolvePath } from '../common/resources.js';
import { escape } from '../common/strings.js';
import { URI, UriComponents } from '../common/uri.js';
import * as DOM from './dom.js';
import * as domSanitize from './domSanitize.js';
import { convertTagToPlaintext } from './domSanitize.js';
import { StandardKeyboardEvent } from './keyboardEvent.js';
import { StandardMouseEvent } from './mouseEvent.js';
import { renderIcon, renderLabelWithIcons } from './ui/iconLabel/iconLabels.js';

export type MarkdownActionHandler = (linkContent: string, mdStr: IMarkdownString) => void;

/**
 * Options for the rendering of markdown with {@link renderMarkdown}.
 */
export interface MarkdownRenderOptions {
	readonly codeBlockRenderer?: (languageId: string, value: string) => Promise<HTMLElement>;
	readonly codeBlockRendererSync?: (languageId: string, value: string, raw?: string) => HTMLElement;
	readonly asyncRenderCallback?: () => void;

	readonly actionHandler?: MarkdownActionHandler;

	readonly fillInIncompleteTokens?: boolean;

	readonly sanitizerConfig?: MarkdownSanitizerConfig;

	readonly markedOptions?: MarkdownRendererMarkedOptions;
	readonly markedExtensions?: marked.MarkedExtension[];
}

/**
 * Subset of options passed to `Marked` for rendering markdown.
 */
export interface MarkdownRendererMarkedOptions {
	readonly gfm?: boolean;
	readonly breaks?: boolean;
}

export interface MarkdownSanitizerConfig {
	readonly replaceWithPlaintext?: boolean;
	readonly allowedTags?: {
		readonly override: readonly string[];
	};
	readonly allowedAttributes?: {
		readonly override: ReadonlyArray<string | domSanitize.SanitizeAttributeRule>;
	};
	readonly allowedLinkSchemes?: {
		readonly augment: readonly string[];
	};
	readonly remoteImageIsAllowed?: (uri: URI) => boolean;
}

const defaultMarkedRenderers = Object.freeze({
	image: ({ href, title, text }: marked.Tokens.Image): string => {
		let dimensions: string[] = [];
		let attributes: string[] = [];
		if (href) {
			({ href, dimensions } = parseHrefAndDimensions(href));
			attributes.push(`src="${escapeDoubleQuotes(href)}"`);
		}
		if (text) {
			attributes.push(`alt="${escapeDoubleQuotes(text)}"`);
		}
		if (title) {
			attributes.push(`title="${escapeDoubleQuotes(title)}"`);
		}
		if (dimensions.length) {
			attributes = attributes.concat(dimensions);
		}
		return '<img ' + attributes.join(' ') + '>';
	},

	paragraph(this: marked.Renderer, { tokens }: marked.Tokens.Paragraph): string {
		return `<p>${this.parser.parseInline(tokens)}</p>`;
	},

	link(this: marked.Renderer, { href, title, tokens }: marked.Tokens.Link): string {
		let text = this.parser.parseInline(tokens);
		if (typeof href !== 'string') {
			return '';
		}

		// Remove markdown escapes. Workaround for https://github.com/chjj/marked/issues/829
		if (href === text) { // raw link case
			text = removeMarkdownEscapes(text);
		}

		title = typeof title === 'string' ? escapeDoubleQuotes(removeMarkdownEscapes(title)) : '';
		href = removeMarkdownEscapes(href);

		// HTML Encode href
		href = href.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');

		return `<a href="${href}" title="${title || href}" draggable="false">${text}</a>`;
	},
});

/**
 * Blockquote renderer that processes GitHub-style alert syntax.
 * Transforms blockquotes like "> [!NOTE]" into structured alert markup with icons.
 *
 * Based on GitHub's alert syntax: https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts
 */
function createAlertBlockquoteRenderer(fallbackRenderer: (this: marked.Renderer, token: marked.Tokens.Blockquote) => string) {
	return function (this: marked.Renderer, token: marked.Tokens.Blockquote): string {
		const { tokens } = token;
		// Check if this blockquote starts with alert syntax [!TYPE]
		const firstToken = tokens[0];
		if (firstToken?.type !== 'paragraph') {
			return fallbackRenderer.call(this, token);
		}

		const paragraphTokens = firstToken.tokens;
		if (!paragraphTokens || paragraphTokens.length === 0) {
			return fallbackRenderer.call(this, token);
		}

		const firstTextToken = paragraphTokens[0];
		if (firstTextToken?.type !== 'text') {
			return fallbackRenderer.call(this, token);
		}

		const pattern = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*?\n*/i;
		const match = firstTextToken.raw.match(pattern);
		if (!match) {
			return fallbackRenderer.call(this, token);
		}

		// Remove the alert marker from the token
		firstTextToken.raw = firstTextToken.raw.replace(pattern, '');
		firstTextToken.text = firstTextToken.text.replace(pattern, '');

		const alertIcons: Record<string, string> = {
			'note': 'info',
			'tip': 'light-bulb',
			'important': 'comment',
			'warning': 'alert',
			'caution': 'stop'
		};

		const type = match[1];
		const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
		const severity = type.toLowerCase();
		const iconHtml = renderIcon({ id: alertIcons[severity] }).outerHTML;

		// Render the remaining content
		const content = this.parser.parse(tokens);

		// Return alert markup with icon and severity (skipping the first 3 characters: `<p>`)
		return `<blockquote data-severity="${severity}"><p><span>${iconHtml}${typeCapitalized}</span>${content.substring(3)}</blockquote>\n`;
	};
}

export interface IRenderedMarkdown extends IDisposable {
	readonly element: HTMLElement;
}

/**
 * Low-level way create a html element from a markdown string.
 *
 * **Note** that for most cases you should be using {@link import('../../editor/browser/widget/markdownRenderer/browser/markdownRenderer.js').MarkdownRenderer MarkdownRenderer}
 * which comes with support for pretty code block rendering and which uses the default way of handling links.
 */
export function renderMarkdown(markdown: IMarkdownString, options: MarkdownRenderOptions = {}, target?: HTMLElement): IRenderedMarkdown {
	const disposables = new DisposableStore();
	let isDisposed = false;

	const markedInstance = new marked.Marked(...(options.markedExtensions ?? []));
	const { renderer, codeBlocks, syncCodeBlocks } = createMarkdownRenderer(markedInstance, options, markdown);
	const value = preprocessMarkdownString(markdown);

	let renderedMarkdown: string;
	if (options.fillInIncompleteTokens) {
		// The defaults are applied by parse but not lexer()/parser(), and they need to be present
		const opts: marked.MarkedOptions = {
			...markedInstance.defaults,
			...options.markedOptions,
			renderer
		};
		const tokens = markedInstance.lexer(value, opts);
		const newTokens = fillInIncompleteTokens(tokens);
		renderedMarkdown = markedInstance.parser(newTokens, opts);
	} else {
		renderedMarkdown = markedInstance.parse(value, { ...options?.markedOptions, renderer, async: false });
	}

	// Rewrite theme icons
	if (markdown.supportThemeIcons) {
		const elements = renderLabelWithIcons(renderedMarkdown);
		renderedMarkdown = elements.map(e => typeof e === 'string' ? e : e.outerHTML).join('');
	}

	const renderedContent = document.createElement('div');
	const sanitizerConfig = getDomSanitizerConfig(markdown, options.sanitizerConfig ?? {});
	domSanitize.safeSetInnerHtml(renderedContent, renderedMarkdown, sanitizerConfig);

	// Rewrite links and images before potentially inserting them into the real dom
	rewriteRenderedLinks(markdown, options, renderedContent);

	let outElement: HTMLElement;
	if (target) {
		outElement = target;
		DOM.reset(target, ...renderedContent.childNodes);
	} else {
		outElement = renderedContent;
	}

	if (codeBlocks.length > 0) {
		Promise.all(codeBlocks).then((tuples) => {
			if (isDisposed) {
				return;
			}
			const renderedElements = new Map(tuples);
			// eslint-disable-next-line no-restricted-syntax
			const placeholderElements = outElement.querySelectorAll<HTMLDivElement>(`div[data-code]`);
			for (const placeholderElement of placeholderElements) {
				const renderedElement = renderedElements.get(placeholderElement.dataset['code'] ?? '');
				if (renderedElement) {
					DOM.reset(placeholderElement, renderedElement);
				}
			}
			options.asyncRenderCallback?.();
		});
	} else if (syncCodeBlocks.length > 0) {
		const renderedElements = new Map(syncCodeBlocks);
		// eslint-disable-next-line no-restricted-syntax
		const placeholderElements = outElement.querySelectorAll<HTMLDivElement>(`div[data-code]`);
		for (const placeholderElement of placeholderElements) {
			const renderedElement = renderedElements.get(placeholderElement.dataset['code'] ?? '');
			if (renderedElement) {
				DOM.reset(placeholderElement, renderedElement);
			}
		}
	}

	// Signal size changes for image tags
	if (options.asyncRenderCallback) {
		// eslint-disable-next-line no-restricted-syntax
		for (const img of outElement.getElementsByTagName('img')) {
			const listener = disposables.add(DOM.addDisposableListener(img, 'load', () => {
				listener.dispose();
				options.asyncRenderCallback!();
			}));
		}
	}

	// Add event listeners for links
	if (options.actionHandler) {
		const clickCb = (e: PointerEvent) => {
			const mouseEvent = new StandardMouseEvent(DOM.getWindow(outElement), e);
			if (!mouseEvent.leftButton && !mouseEvent.middleButton) {
				return;
			}
			activateLink(markdown, options, mouseEvent);
		};
		disposables.add(DOM.addDisposableListener(outElement, 'click', clickCb));
		disposables.add(DOM.addDisposableListener(outElement, 'auxclick', clickCb));

		disposables.add(DOM.addDisposableListener(outElement, 'keydown', (e) => {
			const keyboardEvent = new StandardKeyboardEvent(e);
			if (!keyboardEvent.equals(KeyCode.Space) && !keyboardEvent.equals(KeyCode.Enter)) {
				return;
			}
			activateLink(markdown, options, keyboardEvent);
		}));
	}

	// Remove/disable inputs
	// eslint-disable-next-line no-restricted-syntax
	for (const input of [...outElement.getElementsByTagName('input')]) {
		if (input.attributes.getNamedItem('type')?.value === 'checkbox') {
			input.setAttribute('disabled', '');
		} else {
			if (options.sanitizerConfig?.replaceWithPlaintext) {
				const replacement = convertTagToPlaintext(input);
				if (replacement) {
					input.parentElement?.replaceChild(replacement, input);
				} else {
					input.remove();
				}
			} else {
				input.remove();
			}
		}
	}

	return {
		element: outElement,
		dispose: () => {
			isDisposed = true;
			disposables.dispose();
		}
	};
}

function rewriteRenderedLinks(markdown: IMarkdownString, options: MarkdownRenderOptions, root: HTMLElement) {
	// eslint-disable-next-line no-restricted-syntax
	for (const el of root.querySelectorAll('img, audio, video, source')) {
		const src = el.getAttribute('src'); // Get the raw 'src' attribute value as text, not the resolved 'src'
		if (src) {
			let href = src;
			try {
				if (markdown.baseUri) { // absolute or relative local path, or file: uri
					href = resolveWithBaseUri(URI.from(markdown.baseUri), href);
				}
			} catch (err) { }

			el.setAttribute('src', massageHref(markdown, href, true));

			if (options.sanitizerConfig?.remoteImageIsAllowed) {
				const uri = URI.parse(href);
				if (uri.scheme !== Schemas.file && uri.scheme !== Schemas.data && !options.sanitizerConfig.remoteImageIsAllowed(uri)) {
					el.replaceWith(DOM.$('', undefined, el.outerHTML));
				}
			}
		}
	}

	// eslint-disable-next-line no-restricted-syntax
	for (const el of root.querySelectorAll('a')) {
		const href = el.getAttribute('href'); // Get the raw 'href' attribute value as text, not the resolved 'href'
		el.setAttribute('href', ''); // Clear out href. We use the `data-href` for handling clicks instead
		if (!href
			|| /^data:|javascript:/i.test(href)
			|| (/^command:/i.test(href) && !markdown.isTrusted)
			|| /^command:(\/\/\/)?_workbench\.downloadResource/i.test(href)) {
			// drop the link
			el.replaceWith(...el.childNodes);
		} else {
			let resolvedHref = massageHref(markdown, href, false);
			if (markdown.baseUri) {
				resolvedHref = resolveWithBaseUri(URI.from(markdown.baseUri), href);
			}
			el.dataset.href = resolvedHref;
		}
	}
}

function createMarkdownRenderer(marked: marked.Marked, options: MarkdownRenderOptions, markdown: IMarkdownString): { renderer: marked.Renderer; codeBlocks: Promise<[string, HTMLElement]>[]; syncCodeBlocks: [string, HTMLElement][] } {
	const renderer = new marked.Renderer(options.markedOptions);
	renderer.image = defaultMarkedRenderers.image;
	renderer.link = defaultMarkedRenderers.link;
	renderer.paragraph = defaultMarkedRenderers.paragraph;

	if (markdown.supportAlertSyntax) {
		renderer.blockquote = createAlertBlockquoteRenderer(renderer.blockquote);
	}

	// Will collect [id, renderedElement] tuples
	const codeBlocks: Promise<[string, HTMLElement]>[] = [];
	const syncCodeBlocks: [string, HTMLElement][] = [];

	if (options.codeBlockRendererSync) {
		renderer.code = ({ text, lang, raw }: marked.Tokens.Code) => {
			const id = defaultGenerator.nextId();
			const value = options.codeBlockRendererSync!(postProcessCodeBlockLanguageId(lang), text, raw);
			syncCodeBlocks.push([id, value]);
			return `<div class="code" data-code="${id}">${escape(text)}</div>`;
		};
	} else if (options.codeBlockRenderer) {
		renderer.code = ({ text, lang }: marked.Tokens.Code) => {
			const id = defaultGenerator.nextId();
			const value = options.codeBlockRenderer!(postProcessCodeBlockLanguageId(lang), text);
			codeBlocks.push(value.then(element => [id, element]));
			return `<div class="code" data-code="${id}">${escape(text)}</div>`;
		};
	}

	if (!markdown.supportHtml) {
		// Note: we always pass the output through dompurify after this so that we don't rely on
		// marked for real sanitization.
		renderer.html = ({ text }) => {
			if (options.sanitizerConfig?.replaceWithPlaintext) {
				return escape(text);
			}

			const match = markdown.isTrusted ? text.match(/^(<span[^>]+>)|(<\/\s*span>)$/) : undefined;
			return match ? text : '';
		};
	}
	return { renderer, codeBlocks, syncCodeBlocks };
}

function preprocessMarkdownString(markdown: IMarkdownString) {
	let value = markdown.value;

	// values that are too long will freeze the UI
	if (value.length > 100_000) {
		value = `${value.substr(0, 100_000)}…`;
	}

	// escape theme icons
	if (markdown.supportThemeIcons) {
		value = markdownEscapeEscapedIcons(value);
	}

	return value;
}

function activateLink(mdStr: IMarkdownString, options: MarkdownRenderOptions, event: StandardMouseEvent | StandardKeyboardEvent): void {
	const target = event.target.closest('a[data-href]');
	if (!DOM.isHTMLElement(target)) {
		return;
	}

	try {
		let href = target.dataset['href'];
		if (href) {
			if (mdStr.baseUri) {
				href = resolveWithBaseUri(URI.from(mdStr.baseUri), href);
			}
			options.actionHandler?.(href, mdStr);
		}
	} catch (err) {
		onUnexpectedError(err);
	} finally {
		event.preventDefault();
		event.stopPropagation();
	}
}

function uriMassage(markdown: IMarkdownString, part: string): string {
	let data: unknown;
	try {
		data = parse(decodeURIComponent(part));
	} catch (e) {
		// ignore
	}
	if (!data) {
		return part;
	}
	data = cloneAndChange(data, value => {
		if (markdown.uris && markdown.uris[value]) {
			return URI.revive(markdown.uris[value]);
		} else {
			return undefined;
		}
	});
	return encodeURIComponent(JSON.stringify(data));
}

function massageHref(markdown: IMarkdownString, href: string, isDomUri: boolean): string {
	const data = markdown.uris && markdown.uris[href];
	let uri = URI.revive(data);
	if (isDomUri) {
		if (href.startsWith(Schemas.data + ':')) {
			return href;
		}
		if (!uri) {
			uri = URI.parse(href);
		}
		// this URI will end up as "src"-attribute of a dom node
		// and because of that special rewriting needs to be done
		// so that the URI uses a protocol that's understood by
		// browsers (like http or https)
		return FileAccess.uriToBrowserUri(uri).toString(true);
	}
	if (!uri) {
		return href;
	}
	if (URI.parse(href).toString() === uri.toString()) {
		return href; // no transformation performed
	}
	if (uri.query) {
		uri = uri.with({ query: uriMassage(markdown, uri.query) });
	}
	return uri.toString();
}

function postProcessCodeBlockLanguageId(lang: string | undefined): string {
	if (!lang) {
		return '';
	}

	const parts = lang.split(/[\s+|:|,|\{|\?]/, 1);
	if (parts.length) {
		return parts[0];
	}
	return lang;
}

function resolveWithBaseUri(baseUri: URI, href: string): string {
	const hasScheme = /^\w[\w\d+.-]*:/.test(href);
	if (hasScheme) {
		return href;
	}

	if (baseUri.path.endsWith('/')) {
		return resolvePath(baseUri, href).toString();
	} else {
		return resolvePath(dirname(baseUri), href).toString();
	}
}

type MdStrConfig = {
	readonly isTrusted?: boolean | MarkdownStringTrustedOptions;
	readonly baseUri?: UriComponents;
};

function sanitizeRenderedMarkdown(
	renderedMarkdown: string,
	originalMdStrConfig: MdStrConfig,
	options: MarkdownSanitizerConfig = {},
): TrustedHTML {
	const sanitizerConfig = getDomSanitizerConfig(originalMdStrConfig, options);
	return domSanitize.sanitizeHtml(renderedMarkdown, sanitizerConfig);
}

export const allowedMarkdownHtmlTags = Object.freeze([
	...domSanitize.basicMarkupHtmlTags,
	'input', // Allow inputs for rendering checkboxes. Other types of inputs are removed and the inputs are always disabled
]);

export const allowedMarkdownHtmlAttributes = Object.freeze<Array<string | domSanitize.SanitizeAttributeRule>>([
	'align',
	'autoplay',
	'alt',
	'colspan',
	'controls',
	'draggable',
	'height',
	'href',
	'loop',
	'muted',
	'playsinline',
	'poster',
	'rowspan',
	'src',
	'target',
	'title',
	'type',
	'width',
	'start',

	// Input (For disabled inputs)
	'checked',
	'disabled',
	'value',

	// Custom markdown attributes
	'data-code',
	'data-href',
	'data-severity',

	// Only allow very specific styles
	{
		attributeName: 'style',
		shouldKeep: (element, data) => {
			if (element.tagName === 'SPAN') {
				if (data.attrName === 'style') {
					return /^(color\:(#[0-9a-fA-F]+|var\(--vscode(-[a-zA-Z0-9]+)+\));)?(background-color\:(#[0-9a-fA-F]+|var\(--vscode(-[a-zA-Z0-9]+)+\));)?(border-radius:[0-9]+px;)?$/.test(data.attrValue);
				}
			}
			return false;
		}
	},

	// Only allow codicons for classes
	{
		attributeName: 'class',
		shouldKeep: (element, data) => {
			if (element.tagName === 'SPAN') {
				if (data.attrName === 'class') {
					return /^codicon codicon-[a-z\-]+( codicon-modifier-[a-z\-]+)?$/.test(data.attrValue);
				}
			}
			return false;
		},
	},
]);

function getDomSanitizerConfig(mdStrConfig: MdStrConfig, options: MarkdownSanitizerConfig): domSanitize.DomSanitizerConfig {
	const isTrusted = mdStrConfig.isTrusted ?? false;
	const allowedLinkSchemes = [
		Schemas.http,
		Schemas.https,
		Schemas.mailto,
		Schemas.file,
		Schemas.vscodeFileResource,
		Schemas.vscodeRemote,
		Schemas.vscodeRemoteResource,
		Schemas.vscodeNotebookCell,
		// For links that are handled entirely by the action handler
		Schemas.internal,
	];

	if (isTrusted) {
		allowedLinkSchemes.push(Schemas.command);
	}

	if (options.allowedLinkSchemes?.augment) {
		allowedLinkSchemes.push(...options.allowedLinkSchemes.augment);
	}

	return {
		// allowedTags should included everything that markdown renders to.
		// Since we have our own sanitize function for marked, it's possible we missed some tag so let dompurify make sure.
		// HTML tags that can result from markdown are from reading https://spec.commonmark.org/0.29/
		// HTML table tags that can result from markdown are from https://github.github.com/gfm/#tables-extension-
		allowedTags: {
			override: options.allowedTags?.override ?? allowedMarkdownHtmlTags
		},
		allowedAttributes: {
			override: options.allowedAttributes?.override ?? allowedMarkdownHtmlAttributes,
		},
		allowedLinkProtocols: {
			override: allowedLinkSchemes,
		},
		allowRelativeLinkPaths: !!mdStrConfig.baseUri,
		allowedMediaProtocols: {
			override: [
				Schemas.http,
				Schemas.https,
				Schemas.data,
				Schemas.file,
				Schemas.vscodeFileResource,
				Schemas.vscodeRemote,
				Schemas.vscodeRemoteResource,
			]
		},
		allowRelativeMediaPaths: !!mdStrConfig.baseUri,
		replaceWithPlaintext: options.replaceWithPlaintext,
	};
}

/**
 * Renders `str` as plaintext, stripping out Markdown syntax if it's a {@link IMarkdownString}.
 *
 * For example `# Header` would be output as `Header`.
 */
export function renderAsPlaintext(str: IMarkdownString | string, options?: {
	/** Controls if the ``` of code blocks should be preserved in the output or not */
	readonly includeCodeBlocksFences?: boolean;
	/** Controls if we want to format empty links from "Link [](file)" to "Link file" */
	readonly useLinkFormatter?: boolean;
}) {
	if (typeof str === 'string') {
		return str;
	}

	// values that are too long will freeze the UI
	let value = str.value ?? '';
	if (value.length > 100_000) {
		value = `${value.substr(0, 100_000)}…`;
	}

	const renderer = createPlainTextRenderer();
	if (options?.includeCodeBlocksFences) {
		renderer.code = codeBlockFences;
	}
	if (options?.useLinkFormatter) {
		renderer.link = linkFormatter;
	}

	const html = marked.parse(value, { async: false, renderer });
	return sanitizeRenderedMarkdown(html, { isTrusted: false }, {})
		.toString()
		.replace(/&(#\d+|[a-zA-Z]+);/g, m => unescapeInfo.get(m) ?? m)
		.trim();
}

const unescapeInfo = new Map<string, string>([
	['&quot;', '"'],
	['&nbsp;', ' '],
	['&amp;', '&'],
	['&#39;', '\''],
	['&lt;', '<'],
	['&gt;', '>'],
]);

function createPlainTextRenderer(): marked.Renderer {
	const renderer = new marked.Renderer();

	renderer.code = ({ text }: marked.Tokens.Code): string => {
		return escape(text);
	};
	renderer.blockquote = ({ text }: marked.Tokens.Blockquote): string => {
		return text + '\n';
	};
	renderer.html = (_: marked.Tokens.HTML): string => {
		return '';
	};
	renderer.heading = function ({ tokens }: marked.Tokens.Heading): string {
		return this.parser.parseInline(tokens) + '\n';
	};
	renderer.hr = (): string => {
		return '';
	};
	renderer.list = function ({ items }: marked.Tokens.List): string {
		return items.map(x => this.listitem(x)).join('\n') + '\n';
	};
	renderer.listitem = ({ text }: marked.Tokens.ListItem): string => {
		return text + '\n';
	};
	renderer.paragraph = function ({ tokens }: marked.Tokens.Paragraph): string {
		return this.parser.parseInline(tokens) + '\n';
	};
	renderer.table = function ({ header, rows }: marked.Tokens.Table): string {
		return header.map(cell => this.tablecell(cell)).join(' ') + '\n' + rows.map(cells => cells.map(cell => this.tablecell(cell)).join(' ')).join('\n') + '\n';
	};
	renderer.tablerow = ({ text }: marked.Tokens.TableRow): string => {
		return text;
	};
	renderer.tablecell = function ({ tokens }: marked.Tokens.TableCell): string {
		return this.parser.parseInline(tokens);
	};
	renderer.strong = ({ text }: marked.Tokens.Strong): string => {
		return text;
	};
	renderer.em = ({ text }: marked.Tokens.Em): string => {
		return text;
	};
	renderer.codespan = ({ text }: marked.Tokens.Codespan): string => {
		return escape(text);
	};
	renderer.br = (_: marked.Tokens.Br): string => {
		return '\n';
	};
	renderer.del = ({ text }: marked.Tokens.Del): string => {
		return text;
	};
	renderer.image = (_: marked.Tokens.Image): string => {
		return '';
	};
	renderer.text = ({ text }: marked.Tokens.Text): string => {
		return text;
	};
	renderer.link = ({ text }: marked.Tokens.Link): string => {
		return text;
	};
	return renderer;
}

const codeBlockFences = ({ text }: marked.Tokens.Code): string => {
	return `\n\`\`\`\n${escape(text)}\n\`\`\`\n`;
};

const linkFormatter = ({ text, href }: marked.Tokens.Link): string => {
	try {
		if (href) {
			const uri = URI.parse(href);
			return text.trim() || basename(uri);
		}
	} catch (e) {
		return text.trim() || pathBasename(href);
	}
	return text;
};

function mergeRawTokenText(tokens: marked.Token[]): string {
	let mergedTokenText = '';
	tokens.forEach(token => {
		mergedTokenText += token.raw;
	});
	return mergedTokenText;
}

function completeSingleLinePattern(token: marked.Tokens.Text | marked.Tokens.Paragraph): marked.Token | undefined {
	if (!token.tokens) {
		return undefined;
	}

	for (let i = token.tokens.length - 1; i >= 0; i--) {
		const subtoken = token.tokens[i];
		if (subtoken.type === 'text') {
			const lines = subtoken.raw.split('\n');
			const lastLine = lines[lines.length - 1];
			if (lastLine.includes('`')) {
				return completeCodespan(token);
			}

			else if (lastLine.includes('**')) {
				return completeDoublestar(token);
			}

			else if (lastLine.match(/\*\w/)) {
				return completeStar(token);
			}

			else if (lastLine.match(/(^|\s)__\w/)) {
				return completeDoubleUnderscore(token);
			}

			else if (lastLine.match(/(^|\s)_\w/)) {
				return completeUnderscore(token);
			}

			else if (
				// Text with start of link target
				hasLinkTextAndStartOfLinkTarget(lastLine) ||
				// This token doesn't have the link text, eg if it contains other markdown constructs that are in other subtokens.
				// But some preceding token does have an unbalanced [ at least
				hasStartOfLinkTargetAndNoLinkText(lastLine) && token.tokens.slice(0, i).some(t => t.type === 'text' && t.raw.match(/\[[^\]]*$/))
			) {
				const nextTwoSubTokens = token.tokens.slice(i + 1);

				// A markdown link can look like
				// [link text](https://microsoft.com "more text")
				// Where "more text" is a title for the link or an argument to a vscode command link
				if (
					// If the link was parsed as a link, then look for a link token and a text token with a quote
					nextTwoSubTokens[0]?.type === 'link' && nextTwoSubTokens[1]?.type === 'text' && nextTwoSubTokens[1].raw.match(/^ *"[^"]*$/) ||
					// And if the link was not parsed as a link (eg command link), just look for a single quote in this token
					lastLine.match(/^[^"]* +"[^"]*$/)
				) {

					return completeLinkTargetArg(token);
				}
				return completeLinkTarget(token);
			}

			// Contains the start of link text, and no following tokens contain the link target
			else if (lastLine.match(/(^|\s)\[\w*[^\]]*$/)) {
				return completeLinkText(token);
			}
		}
	}

	return undefined;
}

function hasLinkTextAndStartOfLinkTarget(str: string): boolean {
	return !!str.match(/(^|\s)\[.*\]\(\w*/);
}

function hasStartOfLinkTargetAndNoLinkText(str: string): boolean {
	return !!str.match(/^[^\[]*\]\([^\)]*$/);
}

function completeListItemPattern(list: marked.Tokens.List): marked.Tokens.List | undefined {
	// Patch up this one list item
	const lastListItem = list.items[list.items.length - 1];
	const lastListSubToken = lastListItem.tokens ? lastListItem.tokens[lastListItem.tokens.length - 1] : undefined;

	/*
	Example list token structures:

	list
		list_item
			text
				text
				codespan
				link
		list_item
			text
			code // Complete indented codeblock
		list_item
			text
			space
			text
				text // Incomplete indented codeblock
		list_item
			text
			list // Nested list
				list_item
					text
						text

	Contrast with paragraph:
	paragraph
		text
		codespan
	*/

	const listEndsInHeading = (list: marked.Tokens.List): boolean => {
		// A list item can be rendered as a heading for some reason when it has a subitem where we haven't rendered the text yet like this:
		// 1. list item
		//    -
		const lastItem = list.items.at(-1);
		const lastToken = lastItem?.tokens.at(-1);
		return lastToken?.type === 'heading' || lastToken?.type === 'list' && listEndsInHeading(lastToken as marked.Tokens.List);
	};

	let newToken: marked.Token | undefined;
	if (lastListSubToken?.type === 'text' && !('inRawBlock' in lastListItem)) { // Why does Tag have a type of 'text'
		newToken = completeSingleLinePattern(lastListSubToken as marked.Tokens.Text);
	} else if (listEndsInHeading(list)) {
		const newList = marked.lexer(list.raw.trim() + ' &nbsp;')[0] as marked.Tokens.List;
		if (newList.type !== 'list') {
			// Something went wrong
			return;
		}
		return newList;
	}

	if (!newToken || newToken.type !== 'paragraph') { // 'text' item inside the list item turns into paragraph
		// Nothing to fix, or not a pattern we were expecting
		return;
	}

	const previousListItemsText = mergeRawTokenText(list.items.slice(0, -1));

	// Grabbing the `- ` or `1. ` or `* ` off the list item because I can't find a better way to do this
	const lastListItemLead = lastListItem.raw.match(/^(\s*(-|\d+\.|\*) +)/)?.[0];
	if (!lastListItemLead) {
		// Is badly formatted
		return;
	}

	const newListItemText = lastListItemLead +
		mergeRawTokenText(lastListItem.tokens.slice(0, -1)) +
		newToken.raw;

	const newList = marked.lexer(previousListItemsText + newListItemText)[0] as marked.Tokens.List;
	if (newList.type !== 'list') {
		// Something went wrong
		return;
	}

	return newList;
}

function completeHeading(token: marked.Tokens.Heading, fullRawText: string): marked.TokensList | void {
	if (token.raw.match(/-\s*$/)) {
		return marked.lexer(fullRawText + ' &nbsp;');
	}
}

const maxIncompleteTokensFixRounds = 3;
export function fillInIncompleteTokens(tokens: marked.TokensList): marked.TokensList {
	for (let i = 0; i < maxIncompleteTokensFixRounds; i++) {
		const newTokens = fillInIncompleteTokensOnce(tokens);
		if (newTokens) {
			tokens = newTokens;
		} else {
			break;
		}
	}

	return tokens;
}

function fillInIncompleteTokensOnce(tokens: marked.TokensList): marked.TokensList | null {
	let i: number;
	let newTokens: marked.Token[] | undefined;
	for (i = 0; i < tokens.length; i++) {
		const token = tokens[i];

		if (token.type === 'paragraph' && token.raw.match(/(\n|^)\|/)) {
			newTokens = completeTable(tokens.slice(i));
			break;
		}
	}

	const lastToken = tokens.at(-1);
	if (!newTokens && lastToken?.type === 'list') {
		const newListToken = completeListItemPattern(lastToken as marked.Tokens.List);
		if (newListToken) {
			newTokens = [newListToken];
			i = tokens.length - 1;
		}
	}

	if (!newTokens && lastToken?.type === 'paragraph') {
		// Only operates on a single token, because any newline that follows this should break these patterns
		const newToken = completeSingleLinePattern(lastToken as marked.Tokens.Paragraph);
		if (newToken) {
			newTokens = [newToken];
			i = tokens.length - 1;
		}
	}

	if (newTokens) {
		const newTokensList = [
			...tokens.slice(0, i),
			...newTokens
		];
		(newTokensList as marked.TokensList).links = tokens.links;
		return newTokensList as marked.TokensList;
	}

	if (lastToken?.type === 'heading') {
		const completeTokens = completeHeading(lastToken as marked.Tokens.Heading, mergeRawTokenText(tokens));
		if (completeTokens) {
			return completeTokens;
		}
	}

	return null;
}


function completeCodespan(token: marked.Token): marked.Token {
	return completeWithString(token, '`');
}

function completeStar(tokens: marked.Token): marked.Token {
	return completeWithString(tokens, '*');
}

function completeUnderscore(tokens: marked.Token): marked.Token {
	return completeWithString(tokens, '_');
}

function completeLinkTarget(tokens: marked.Token): marked.Token {
	return completeWithString(tokens, ')', false);
}

function completeLinkTargetArg(tokens: marked.Token): marked.Token {
	return completeWithString(tokens, '")', false);
}

function completeLinkText(tokens: marked.Token): marked.Token {
	return completeWithString(tokens, '](https://microsoft.com)', false);
}

function completeDoublestar(tokens: marked.Token): marked.Token {
	return completeWithString(tokens, '**');
}

function completeDoubleUnderscore(tokens: marked.Token): marked.Token {
	return completeWithString(tokens, '__');
}

function completeWithString(tokens: marked.Token[] | marked.Token, closingString: string, shouldTrim = true): marked.Token {
	const mergedRawText = mergeRawTokenText(Array.isArray(tokens) ? tokens : [tokens]);

	// If it was completed correctly, this should be a single token.
	// Expecting either a Paragraph or a List
	const trimmedRawText = shouldTrim ? mergedRawText.trimEnd() : mergedRawText;
	return marked.lexer(trimmedRawText + closingString)[0];
}

function completeTable(tokens: marked.Token[]): marked.Token[] | undefined {
	const mergedRawText = mergeRawTokenText(tokens);
	const lines = mergedRawText.split('\n');

	let numCols: number | undefined; // The number of line1 col headers
	let hasSeparatorRow = false;
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();
		if (typeof numCols === 'undefined' && line.match(/^\s*\|/)) {
			const line1Matches = line.match(/(\|[^\|]+)(?=\||$)/g);
			if (line1Matches) {
				numCols = line1Matches.length;
			}
		} else if (typeof numCols === 'number') {
			if (line.match(/^\s*\|/)) {
				if (i !== lines.length - 1) {
					// We got the line1 header row, and the line2 separator row, but there are more lines, and it wasn't parsed as a table!
					// That's strange and means that the table is probably malformed in the source, so I won't try to patch it up.
					return undefined;
				}

				// Got a line2 separator row- partial or complete, doesn't matter, we'll replace it with a correct one
				hasSeparatorRow = true;
			} else {
				// The line after the header row isn't a valid separator row, so the table is malformed, don't fix it up
				return undefined;
			}
		}
	}

	if (typeof numCols === 'number' && numCols > 0) {
		const prefixText = hasSeparatorRow ? lines.slice(0, -1).join('\n') : mergedRawText;
		const line1EndsInPipe = !!prefixText.match(/\|\s*$/);
		const newRawText = prefixText + (line1EndsInPipe ? '' : '|') + `\n|${' --- |'.repeat(numCols)}`;
		return marked.lexer(newRawText);
	}

	return undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/mouseEvent.ts]---
Location: vscode-main/src/vs/base/browser/mouseEvent.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as browser from './browser.js';
import { IframeUtils } from './iframe.js';
import * as platform from '../common/platform.js';

export interface IMouseEvent {
	readonly browserEvent: MouseEvent;
	readonly leftButton: boolean;
	readonly middleButton: boolean;
	readonly rightButton: boolean;
	readonly buttons: number;
	readonly target: HTMLElement;
	readonly detail: number;
	readonly posx: number;
	readonly posy: number;
	readonly ctrlKey: boolean;
	readonly shiftKey: boolean;
	readonly altKey: boolean;
	readonly metaKey: boolean;
	readonly timestamp: number;
	readonly defaultPrevented: boolean;

	preventDefault(): void;
	stopPropagation(): void;
}

export class StandardMouseEvent implements IMouseEvent {

	public readonly browserEvent: MouseEvent;

	public readonly leftButton: boolean;
	public readonly middleButton: boolean;
	public readonly rightButton: boolean;
	public readonly buttons: number;
	public readonly target: HTMLElement;
	public detail: number;
	public readonly posx: number;
	public readonly posy: number;
	public readonly ctrlKey: boolean;
	public readonly shiftKey: boolean;
	public readonly altKey: boolean;
	public readonly metaKey: boolean;
	public readonly timestamp: number;
	public readonly defaultPrevented: boolean;

	constructor(targetWindow: Window, e: MouseEvent) {
		this.timestamp = Date.now();
		this.browserEvent = e;
		this.leftButton = e.button === 0;
		this.middleButton = e.button === 1;
		this.rightButton = e.button === 2;
		this.buttons = e.buttons;
		this.defaultPrevented = e.defaultPrevented;

		this.target = <HTMLElement>e.target;

		this.detail = e.detail || 1;
		if (e.type === 'dblclick') {
			this.detail = 2;
		}
		this.ctrlKey = e.ctrlKey;
		this.shiftKey = e.shiftKey;
		this.altKey = e.altKey;
		this.metaKey = e.metaKey;

		if (typeof e.pageX === 'number') {
			this.posx = e.pageX;
			this.posy = e.pageY;
		} else {
			// Probably hit by MSGestureEvent
			this.posx = e.clientX + this.target.ownerDocument.body.scrollLeft + this.target.ownerDocument.documentElement.scrollLeft;
			this.posy = e.clientY + this.target.ownerDocument.body.scrollTop + this.target.ownerDocument.documentElement.scrollTop;
		}

		// Find the position of the iframe this code is executing in relative to the iframe where the event was captured.
		const iframeOffsets = IframeUtils.getPositionOfChildWindowRelativeToAncestorWindow(targetWindow, e.view);
		this.posx -= iframeOffsets.left;
		this.posy -= iframeOffsets.top;
	}

	public preventDefault(): void {
		this.browserEvent.preventDefault();
	}

	public stopPropagation(): void {
		this.browserEvent.stopPropagation();
	}
}

export class DragMouseEvent extends StandardMouseEvent {

	public readonly dataTransfer: DataTransfer;

	constructor(targetWindow: Window, e: MouseEvent) {
		super(targetWindow, e);
		// eslint-disable-next-line local/code-no-any-casts
		this.dataTransfer = (<any>e).dataTransfer;
	}
}

export interface IMouseWheelEvent extends MouseEvent {
	readonly wheelDelta: number;
	readonly wheelDeltaX: number;
	readonly wheelDeltaY: number;

	readonly deltaX: number;
	readonly deltaY: number;
	readonly deltaZ: number;
	readonly deltaMode: number;
}

interface IWebKitMouseWheelEvent {
	wheelDeltaY: number;
	wheelDeltaX: number;
}

interface IGeckoMouseWheelEvent {
	HORIZONTAL_AXIS: number;
	VERTICAL_AXIS: number;
	axis: number;
	detail: number;
}

export class StandardWheelEvent {

	public readonly browserEvent: IMouseWheelEvent | null;
	public readonly deltaY: number;
	public readonly deltaX: number;
	public readonly target: Node;

	constructor(e: IMouseWheelEvent | null, deltaX: number = 0, deltaY: number = 0) {

		this.browserEvent = e || null;
		// eslint-disable-next-line local/code-no-any-casts
		this.target = e ? (e.target || (<any>e).targetNode || e.srcElement) : null;

		this.deltaY = deltaY;
		this.deltaX = deltaX;

		let shouldFactorDPR: boolean = false;
		if (browser.isChrome) {
			// Chrome version >= 123 contains the fix to factor devicePixelRatio into the wheel event.
			// See https://chromium.googlesource.com/chromium/src.git/+/be51b448441ff0c9d1f17e0f25c4bf1ab3f11f61
			const chromeVersionMatch = navigator.userAgent.match(/Chrome\/(\d+)/);
			const chromeMajorVersion = chromeVersionMatch ? parseInt(chromeVersionMatch[1]) : 123;
			shouldFactorDPR = chromeMajorVersion <= 122;
		}

		if (e) {
			// Old (deprecated) wheel events
			// eslint-disable-next-line local/code-no-any-casts
			const e1 = <IWebKitMouseWheelEvent><any>e;
			// eslint-disable-next-line local/code-no-any-casts
			const e2 = <IGeckoMouseWheelEvent><any>e;
			const devicePixelRatio = e.view?.devicePixelRatio || 1;

			// vertical delta scroll
			if (typeof e1.wheelDeltaY !== 'undefined') {
				if (shouldFactorDPR) {
					// Refs https://github.com/microsoft/vscode/issues/146403#issuecomment-1854538928
					this.deltaY = e1.wheelDeltaY / (120 * devicePixelRatio);
				} else {
					this.deltaY = e1.wheelDeltaY / 120;
				}
			} else if (typeof e2.VERTICAL_AXIS !== 'undefined' && e2.axis === e2.VERTICAL_AXIS) {
				this.deltaY = -e2.detail / 3;
			} else if (e.type === 'wheel') {
				// Modern wheel event
				// https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent
				const ev = <WheelEvent><unknown>e;

				if (ev.deltaMode === ev.DOM_DELTA_LINE) {
					// the deltas are expressed in lines
					if (browser.isFirefox && !platform.isMacintosh) {
						this.deltaY = -e.deltaY / 3;
					} else {
						this.deltaY = -e.deltaY;
					}
				} else {
					this.deltaY = -e.deltaY / 40;
				}
			}

			// horizontal delta scroll
			if (typeof e1.wheelDeltaX !== 'undefined') {
				if (browser.isSafari && platform.isWindows) {
					this.deltaX = - (e1.wheelDeltaX / 120);
				} else if (shouldFactorDPR) {
					// Refs https://github.com/microsoft/vscode/issues/146403#issuecomment-1854538928
					this.deltaX = e1.wheelDeltaX / (120 * devicePixelRatio);
				} else {
					this.deltaX = e1.wheelDeltaX / 120;
				}
			} else if (typeof e2.HORIZONTAL_AXIS !== 'undefined' && e2.axis === e2.HORIZONTAL_AXIS) {
				this.deltaX = -e.detail / 3;
			} else if (e.type === 'wheel') {
				// Modern wheel event
				// https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent
				const ev = <WheelEvent><unknown>e;

				if (ev.deltaMode === ev.DOM_DELTA_LINE) {
					// the deltas are expressed in lines
					if (browser.isFirefox && !platform.isMacintosh) {
						this.deltaX = -e.deltaX / 3;
					} else {
						this.deltaX = -e.deltaX;
					}
				} else {
					this.deltaX = -e.deltaX / 40;
				}
			}

			// Assume a vertical scroll if nothing else worked
			if (this.deltaY === 0 && this.deltaX === 0 && e.wheelDelta) {
				if (shouldFactorDPR) {
					// Refs https://github.com/microsoft/vscode/issues/146403#issuecomment-1854538928
					this.deltaY = e.wheelDelta / (120 * devicePixelRatio);
				} else {
					this.deltaY = e.wheelDelta / 120;
				}
			}
		}
	}

	public preventDefault(): void {
		this.browserEvent?.preventDefault();
	}

	public stopPropagation(): void {
		this.browserEvent?.stopPropagation();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/performance.ts]---
Location: vscode-main/src/vs/base/browser/performance.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export namespace inputLatency {

	// Measurements are recorded as totals, the average is calculated when the final measurements
	// are created.
	interface ICumulativeMeasurement {
		total: number;
		min: number;
		max: number;
	}
	const totalKeydownTime: ICumulativeMeasurement = { total: 0, min: Number.MAX_VALUE, max: 0 };
	const totalInputTime: ICumulativeMeasurement = { ...totalKeydownTime };
	const totalRenderTime: ICumulativeMeasurement = { ...totalKeydownTime };
	const totalInputLatencyTime: ICumulativeMeasurement = { ...totalKeydownTime };
	let measurementsCount = 0;



	// The state of each event, this helps ensure the integrity of the measurement and that
	// something unexpected didn't happen that could skew the measurement.
	const enum EventPhase {
		Before = 0,
		InProgress = 1,
		Finished = 2
	}
	const state = {
		keydown: EventPhase.Before,
		input: EventPhase.Before,
		render: EventPhase.Before,
	};

	/**
	 * Record the start of the keydown event.
	 */
	export function onKeyDown() {
		/** Direct Check C. See explanation in {@link recordIfFinished} */
		recordIfFinished();
		performance.mark('inputlatency/start');
		performance.mark('keydown/start');
		state.keydown = EventPhase.InProgress;
		queueMicrotask(markKeyDownEnd);
	}

	/**
	 * Mark the end of the keydown event.
	 */
	function markKeyDownEnd() {
		if (state.keydown === EventPhase.InProgress) {
			performance.mark('keydown/end');
			state.keydown = EventPhase.Finished;
		}
	}

	/**
	 * Record the start of the beforeinput event.
	 */
	export function onBeforeInput() {
		performance.mark('input/start');
		state.input = EventPhase.InProgress;
		/** Schedule Task A. See explanation in {@link recordIfFinished} */
		scheduleRecordIfFinishedTask();
	}

	/**
	 * Record the start of the input event.
	 */
	export function onInput() {
		if (state.input === EventPhase.Before) {
			// it looks like we didn't receive a `beforeinput`
			onBeforeInput();
		}
		queueMicrotask(markInputEnd);
	}

	function markInputEnd() {
		if (state.input === EventPhase.InProgress) {
			performance.mark('input/end');
			state.input = EventPhase.Finished;
		}
	}

	/**
	 * Record the start of the keyup event.
	 */
	export function onKeyUp() {
		/** Direct Check D. See explanation in {@link recordIfFinished} */
		recordIfFinished();
	}

	/**
	 * Record the start of the selectionchange event.
	 */
	export function onSelectionChange() {
		/** Direct Check E. See explanation in {@link recordIfFinished} */
		recordIfFinished();
	}

	/**
	 * Record the start of the animation frame performing the rendering.
	 */
	export function onRenderStart() {
		// Render may be triggered during input, but we only measure the following animation frame
		if (state.keydown === EventPhase.Finished && state.input === EventPhase.Finished && state.render === EventPhase.Before) {
			// Only measure the first render after keyboard input
			performance.mark('render/start');
			state.render = EventPhase.InProgress;
			queueMicrotask(markRenderEnd);
			/** Schedule Task B. See explanation in {@link recordIfFinished} */
			scheduleRecordIfFinishedTask();
		}
	}

	/**
	 * Mark the end of the animation frame performing the rendering.
	 */
	function markRenderEnd() {
		if (state.render === EventPhase.InProgress) {
			performance.mark('render/end');
			state.render = EventPhase.Finished;
		}
	}

	function scheduleRecordIfFinishedTask() {
		// Here we can safely assume that the `setTimeout` will not be
		// artificially delayed by 4ms because we schedule it from
		// event handlers
		setTimeout(recordIfFinished);
	}

	/**
	 * Record the input latency sample if input handling and rendering are finished.
	 *
	 * The challenge here is that we want to record the latency in such a way that it includes
	 * also the layout and painting work the browser does during the animation frame task.
	 *
	 * Simply scheduling a new task (via `setTimeout`) from the animation frame task would
	 * schedule the new task at the end of the task queue (after other code that uses `setTimeout`),
	 * so we need to use multiple strategies to make sure our task runs before others:
	 *
	 * We schedule tasks (A and B):
	 *    - we schedule a task A (via a `setTimeout` call) when the input starts in `markInputStart`.
	 *      If the animation frame task is scheduled quickly by the browser, then task A has a very good
	 *      chance of being the very first task after the animation frame and thus will record the input latency.
	 *    - however, if the animation frame task is scheduled a bit later, then task A might execute
	 *      before the animation frame task. We therefore schedule another task B from `markRenderStart`.
	 *
	 * We do direct checks in browser event handlers (C, D, E):
	 *    - if the browser has multiple keydown events queued up, they will be scheduled before the `setTimeout` tasks,
	 *      so we do a direct check in the keydown event handler (C).
	 *    - depending on timing, sometimes the animation frame is scheduled even before the `keyup` event, so we
	 *      do a direct check there too (E).
	 *    - the browser oftentimes emits a `selectionchange` event after an `input`, so we do a direct check there (D).
	 */
	function recordIfFinished() {
		if (state.keydown === EventPhase.Finished && state.input === EventPhase.Finished && state.render === EventPhase.Finished) {
			performance.mark('inputlatency/end');

			performance.measure('keydown', 'keydown/start', 'keydown/end');
			performance.measure('input', 'input/start', 'input/end');
			performance.measure('render', 'render/start', 'render/end');
			performance.measure('inputlatency', 'inputlatency/start', 'inputlatency/end');

			addMeasure('keydown', totalKeydownTime);
			addMeasure('input', totalInputTime);
			addMeasure('render', totalRenderTime);
			addMeasure('inputlatency', totalInputLatencyTime);

			// console.info(
			// 	`input latency=${performance.getEntriesByName('inputlatency')[0].duration.toFixed(1)} [` +
			// 	`keydown=${performance.getEntriesByName('keydown')[0].duration.toFixed(1)}, ` +
			// 	`input=${performance.getEntriesByName('input')[0].duration.toFixed(1)}, ` +
			// 	`render=${performance.getEntriesByName('render')[0].duration.toFixed(1)}` +
			// 	`]`
			// );

			measurementsCount++;

			reset();
		}
	}

	function addMeasure(entryName: string, cumulativeMeasurement: ICumulativeMeasurement): void {
		const duration = performance.getEntriesByName(entryName)[0].duration;
		cumulativeMeasurement.total += duration;
		cumulativeMeasurement.min = Math.min(cumulativeMeasurement.min, duration);
		cumulativeMeasurement.max = Math.max(cumulativeMeasurement.max, duration);
	}

	/**
	 * Clear the current sample.
	 */
	function reset() {
		performance.clearMarks('keydown/start');
		performance.clearMarks('keydown/end');
		performance.clearMarks('input/start');
		performance.clearMarks('input/end');
		performance.clearMarks('render/start');
		performance.clearMarks('render/end');
		performance.clearMarks('inputlatency/start');
		performance.clearMarks('inputlatency/end');

		performance.clearMeasures('keydown');
		performance.clearMeasures('input');
		performance.clearMeasures('render');
		performance.clearMeasures('inputlatency');

		state.keydown = EventPhase.Before;
		state.input = EventPhase.Before;
		state.render = EventPhase.Before;
	}

	export interface IInputLatencyMeasurements {
		keydown: IInputLatencySingleMeasurement;
		input: IInputLatencySingleMeasurement;
		render: IInputLatencySingleMeasurement;
		total: IInputLatencySingleMeasurement;
		sampleCount: number;
	}

	export interface IInputLatencySingleMeasurement {
		average: number;
		min: number;
		max: number;
	}

	/**
	 * Gets all input latency samples and clears the internal buffers to start recording a new set
	 * of samples.
	 */
	export function getAndClearMeasurements(): IInputLatencyMeasurements | undefined {
		if (measurementsCount === 0) {
			return undefined;
		}

		// Assemble the result
		const result = {
			keydown: cumulativeToFinalMeasurement(totalKeydownTime),
			input: cumulativeToFinalMeasurement(totalInputTime),
			render: cumulativeToFinalMeasurement(totalRenderTime),
			total: cumulativeToFinalMeasurement(totalInputLatencyTime),
			sampleCount: measurementsCount
		};

		// Clear the cumulative measurements
		clearCumulativeMeasurement(totalKeydownTime);
		clearCumulativeMeasurement(totalInputTime);
		clearCumulativeMeasurement(totalRenderTime);
		clearCumulativeMeasurement(totalInputLatencyTime);
		measurementsCount = 0;

		return result;
	}

	function cumulativeToFinalMeasurement(cumulative: ICumulativeMeasurement): IInputLatencySingleMeasurement {
		return {
			average: cumulative.total / measurementsCount,
			max: cumulative.max,
			min: cumulative.min,
		};
	}

	function clearCumulativeMeasurement(cumulative: ICumulativeMeasurement): void {
		cumulative.total = 0;
		cumulative.min = Number.MAX_VALUE;
		cumulative.max = 0;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/pixelRatio.ts]---
Location: vscode-main/src/vs/base/browser/pixelRatio.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getWindowId, onDidUnregisterWindow } from './dom.js';
import { Emitter, Event } from '../common/event.js';
import { Disposable, markAsSingleton } from '../common/lifecycle.js';

type BackingStoreContext = CanvasRenderingContext2D & {
	webkitBackingStorePixelRatio?: number;
	mozBackingStorePixelRatio?: number;
	msBackingStorePixelRatio?: number;
	oBackingStorePixelRatio?: number;
	backingStorePixelRatio?: number;
};

/**
 * See https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio#monitoring_screen_resolution_or_zoom_level_changes
 */
class DevicePixelRatioMonitor extends Disposable {

	private readonly _onDidChange = this._register(new Emitter<void>());
	readonly onDidChange = this._onDidChange.event;

	private readonly _listener: () => void;
	private _mediaQueryList: MediaQueryList | null;

	constructor(targetWindow: Window) {
		super();

		this._listener = () => this._handleChange(targetWindow, true);
		this._mediaQueryList = null;
		this._handleChange(targetWindow, false);
	}

	private _handleChange(targetWindow: Window, fireEvent: boolean): void {
		this._mediaQueryList?.removeEventListener('change', this._listener);

		this._mediaQueryList = targetWindow.matchMedia(`(resolution: ${targetWindow.devicePixelRatio}dppx)`);
		this._mediaQueryList.addEventListener('change', this._listener);

		if (fireEvent) {
			this._onDidChange.fire();
		}
	}
}

export interface IPixelRatioMonitor {
	readonly value: number;
	readonly onDidChange: Event<number>;
}

class PixelRatioMonitorImpl extends Disposable implements IPixelRatioMonitor {

	private readonly _onDidChange = this._register(new Emitter<number>());
	readonly onDidChange = this._onDidChange.event;

	private _value: number;

	get value(): number {
		return this._value;
	}

	constructor(targetWindow: Window) {
		super();

		this._value = this._getPixelRatio(targetWindow);

		const dprMonitor = this._register(new DevicePixelRatioMonitor(targetWindow));
		this._register(dprMonitor.onDidChange(() => {
			this._value = this._getPixelRatio(targetWindow);
			this._onDidChange.fire(this._value);
		}));
	}

	private _getPixelRatio(targetWindow: Window): number {
		const ctx = document.createElement('canvas').getContext('2d') as BackingStoreContext | null;
		const dpr = targetWindow.devicePixelRatio || 1;
		const bsr = ctx?.webkitBackingStorePixelRatio ||
			ctx?.mozBackingStorePixelRatio ||
			ctx?.msBackingStorePixelRatio ||
			ctx?.oBackingStorePixelRatio ||
			ctx?.backingStorePixelRatio || 1;
		return dpr / bsr;
	}
}

class PixelRatioMonitorFacade {

	private readonly mapWindowIdToPixelRatioMonitor = new Map<number, PixelRatioMonitorImpl>();

	private _getOrCreatePixelRatioMonitor(targetWindow: Window): PixelRatioMonitorImpl {
		const targetWindowId = getWindowId(targetWindow);
		let pixelRatioMonitor = this.mapWindowIdToPixelRatioMonitor.get(targetWindowId);
		if (!pixelRatioMonitor) {
			pixelRatioMonitor = markAsSingleton(new PixelRatioMonitorImpl(targetWindow));
			this.mapWindowIdToPixelRatioMonitor.set(targetWindowId, pixelRatioMonitor);

			markAsSingleton(Event.once(onDidUnregisterWindow)(({ vscodeWindowId }) => {
				if (vscodeWindowId === targetWindowId) {
					pixelRatioMonitor?.dispose();
					this.mapWindowIdToPixelRatioMonitor.delete(targetWindowId);
				}
			}));
		}
		return pixelRatioMonitor;
	}

	getInstance(targetWindow: Window): IPixelRatioMonitor {
		return this._getOrCreatePixelRatioMonitor(targetWindow);
	}
}

/**
 * Returns the pixel ratio.
 *
 * This is useful for rendering <canvas> elements at native screen resolution or for being used as
 * a cache key when storing font measurements. Fonts might render differently depending on resolution
 * and any measurements need to be discarded for example when a window is moved from a monitor to another.
 */
export const PixelRatio = new PixelRatioMonitorFacade();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/touch.ts]---
Location: vscode-main/src/vs/base/browser/touch.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DomUtils from './dom.js';
import { mainWindow } from './window.js';
import { memoize } from '../common/decorators.js';
import { Event as EventUtils } from '../common/event.js';
import { Disposable, IDisposable, markAsSingleton, toDisposable } from '../common/lifecycle.js';
import { LinkedList } from '../common/linkedList.js';

export namespace EventType {
	export const Tap = '-monaco-gesturetap';
	export const Change = '-monaco-gesturechange';
	export const Start = '-monaco-gesturestart';
	export const End = '-monaco-gesturesend';
	export const Contextmenu = '-monaco-gesturecontextmenu';
}

interface TouchData {
	id: number;
	initialTarget: EventTarget;
	initialTimeStamp: number;
	initialPageX: number;
	initialPageY: number;
	rollingTimestamps: number[];
	rollingPageX: number[];
	rollingPageY: number[];
}

export interface GestureEvent extends MouseEvent {
	initialTarget: EventTarget | undefined;
	translationX: number;
	translationY: number;
	pageX: number;
	pageY: number;
	tapCount: number;
}

interface Touch {
	identifier: number;
	screenX: number;
	screenY: number;
	clientX: number;
	clientY: number;
	pageX: number;
	pageY: number;
	radiusX: number;
	radiusY: number;
	rotationAngle: number;
	force: number;
	target: Element;
}

interface TouchList {
	[i: number]: Touch;
	length: number;
	item(index: number): Touch;
	identifiedTouch(id: number): Touch;
}

interface TouchEvent extends Event {
	touches: TouchList;
	targetTouches: TouchList;
	changedTouches: TouchList;
}

export class Gesture extends Disposable {

	private static readonly SCROLL_FRICTION = -0.005;
	private static INSTANCE: Gesture;
	private static readonly HOLD_DELAY = 700;

	private dispatched = false;
	private readonly targets = new LinkedList<HTMLElement>();
	private readonly ignoreTargets = new LinkedList<HTMLElement>();
	private handle: IDisposable | null;

	private readonly activeTouches: { [id: number]: TouchData };

	private _lastSetTapCountTime: number;

	private static readonly CLEAR_TAP_COUNT_TIME = 400; // ms


	private constructor() {
		super();

		this.activeTouches = {};
		this.handle = null;
		this._lastSetTapCountTime = 0;

		this._register(EventUtils.runAndSubscribe(DomUtils.onDidRegisterWindow, ({ window, disposables }) => {
			disposables.add(DomUtils.addDisposableListener(window.document, 'touchstart', (e: TouchEvent) => this.onTouchStart(e), { passive: false }));
			disposables.add(DomUtils.addDisposableListener(window.document, 'touchend', (e: TouchEvent) => this.onTouchEnd(window, e)));
			disposables.add(DomUtils.addDisposableListener(window.document, 'touchmove', (e: TouchEvent) => this.onTouchMove(e), { passive: false }));
		}, { window: mainWindow, disposables: this._store }));
	}

	public static addTarget(element: HTMLElement): IDisposable {
		if (!Gesture.isTouchDevice()) {
			return Disposable.None;
		}
		if (!Gesture.INSTANCE) {
			Gesture.INSTANCE = markAsSingleton(new Gesture());
		}

		const remove = Gesture.INSTANCE.targets.push(element);
		return toDisposable(remove);
	}

	public static ignoreTarget(element: HTMLElement): IDisposable {
		if (!Gesture.isTouchDevice()) {
			return Disposable.None;
		}
		if (!Gesture.INSTANCE) {
			Gesture.INSTANCE = markAsSingleton(new Gesture());
		}

		const remove = Gesture.INSTANCE.ignoreTargets.push(element);
		return toDisposable(remove);
	}

	@memoize
	static isTouchDevice(): boolean {
		// `'ontouchstart' in window` always evaluates to true with typescript's modern typings. This causes `window` to be
		// `never` later in `window.navigator`. That's why we need the explicit `window as Window` cast
		return 'ontouchstart' in mainWindow || navigator.maxTouchPoints > 0;
	}

	public override dispose(): void {
		if (this.handle) {
			this.handle.dispose();
			this.handle = null;
		}

		super.dispose();
	}

	private onTouchStart(e: TouchEvent): void {
		const timestamp = Date.now(); // use Date.now() because on FF e.timeStamp is not epoch based.

		if (this.handle) {
			this.handle.dispose();
			this.handle = null;
		}

		for (let i = 0, len = e.targetTouches.length; i < len; i++) {
			const touch = e.targetTouches.item(i);

			this.activeTouches[touch.identifier] = {
				id: touch.identifier,
				initialTarget: touch.target,
				initialTimeStamp: timestamp,
				initialPageX: touch.pageX,
				initialPageY: touch.pageY,
				rollingTimestamps: [timestamp],
				rollingPageX: [touch.pageX],
				rollingPageY: [touch.pageY]
			};

			const evt = this.newGestureEvent(EventType.Start, touch.target);
			evt.pageX = touch.pageX;
			evt.pageY = touch.pageY;
			this.dispatchEvent(evt);
		}

		if (this.dispatched) {
			e.preventDefault();
			e.stopPropagation();
			this.dispatched = false;
		}
	}

	private onTouchEnd(targetWindow: Window, e: TouchEvent): void {
		const timestamp = Date.now(); // use Date.now() because on FF e.timeStamp is not epoch based.

		const activeTouchCount = Object.keys(this.activeTouches).length;

		for (let i = 0, len = e.changedTouches.length; i < len; i++) {

			const touch = e.changedTouches.item(i);

			if (!this.activeTouches.hasOwnProperty(String(touch.identifier))) {
				console.warn('move of an UNKNOWN touch', touch);
				continue;
			}

			const data = this.activeTouches[touch.identifier],
				holdTime = Date.now() - data.initialTimeStamp;

			if (holdTime < Gesture.HOLD_DELAY
				&& Math.abs(data.initialPageX - data.rollingPageX.at(-1)!) < 30
				&& Math.abs(data.initialPageY - data.rollingPageY.at(-1)!) < 30) {

				const evt = this.newGestureEvent(EventType.Tap, data.initialTarget);
				evt.pageX = data.rollingPageX.at(-1)!;
				evt.pageY = data.rollingPageY.at(-1)!;
				this.dispatchEvent(evt);

			} else if (holdTime >= Gesture.HOLD_DELAY
				&& Math.abs(data.initialPageX - data.rollingPageX.at(-1)!) < 30
				&& Math.abs(data.initialPageY - data.rollingPageY.at(-1)!) < 30) {

				const evt = this.newGestureEvent(EventType.Contextmenu, data.initialTarget);
				evt.pageX = data.rollingPageX.at(-1)!;
				evt.pageY = data.rollingPageY.at(-1)!;
				this.dispatchEvent(evt);

			} else if (activeTouchCount === 1) {
				const finalX = data.rollingPageX.at(-1)!;
				const finalY = data.rollingPageY.at(-1)!;

				const deltaT = data.rollingTimestamps.at(-1)! - data.rollingTimestamps[0];
				const deltaX = finalX - data.rollingPageX[0];
				const deltaY = finalY - data.rollingPageY[0];

				// We need to get all the dispatch targets on the start of the inertia event
				const dispatchTo = [...this.targets].filter(t => data.initialTarget instanceof Node && t.contains(data.initialTarget));
				this.inertia(targetWindow, dispatchTo, timestamp,	// time now
					Math.abs(deltaX) / deltaT,						// speed
					deltaX > 0 ? 1 : -1,							// x direction
					finalX,											// x now
					Math.abs(deltaY) / deltaT,  					// y speed
					deltaY > 0 ? 1 : -1,							// y direction
					finalY											// y now
				);
			}


			this.dispatchEvent(this.newGestureEvent(EventType.End, data.initialTarget));
			// forget about this touch
			delete this.activeTouches[touch.identifier];
		}

		if (this.dispatched) {
			e.preventDefault();
			e.stopPropagation();
			this.dispatched = false;
		}
	}

	private newGestureEvent(type: string, initialTarget?: EventTarget): GestureEvent {
		const event = document.createEvent('CustomEvent') as unknown as GestureEvent;
		event.initEvent(type, false, true);
		event.initialTarget = initialTarget;
		event.tapCount = 0;
		return event;
	}

	private dispatchEvent(event: GestureEvent): void {
		if (event.type === EventType.Tap) {
			const currentTime = (new Date()).getTime();
			let setTapCount = 0;
			if (currentTime - this._lastSetTapCountTime > Gesture.CLEAR_TAP_COUNT_TIME) {
				setTapCount = 1;
			} else {
				setTapCount = 2;
			}

			this._lastSetTapCountTime = currentTime;
			event.tapCount = setTapCount;
		} else if (event.type === EventType.Change || event.type === EventType.Contextmenu) {
			// tap is canceled by scrolling or context menu
			this._lastSetTapCountTime = 0;
		}

		if (event.initialTarget instanceof Node) {
			for (const ignoreTarget of this.ignoreTargets) {
				if (ignoreTarget.contains(event.initialTarget)) {
					return;
				}
			}

			const targets: [number, HTMLElement][] = [];
			for (const target of this.targets) {
				if (target.contains(event.initialTarget)) {
					let depth = 0;
					let now: Node | null = event.initialTarget;
					while (now && now !== target) {
						depth++;
						now = now.parentElement;
					}
					targets.push([depth, target]);
				}
			}

			targets.sort((a, b) => a[0] - b[0]);

			for (const [_, target] of targets) {
				target.dispatchEvent(event);
				this.dispatched = true;
			}
		}
	}

	private inertia(targetWindow: Window, dispatchTo: readonly EventTarget[], t1: number, vX: number, dirX: number, x: number, vY: number, dirY: number, y: number): void {
		this.handle = DomUtils.scheduleAtNextAnimationFrame(targetWindow, () => {
			const now = Date.now();

			// velocity: old speed + accel_over_time
			const deltaT = now - t1;
			let delta_pos_x = 0, delta_pos_y = 0;
			let stopped = true;

			vX += Gesture.SCROLL_FRICTION * deltaT;
			vY += Gesture.SCROLL_FRICTION * deltaT;

			if (vX > 0) {
				stopped = false;
				delta_pos_x = dirX * vX * deltaT;
			}

			if (vY > 0) {
				stopped = false;
				delta_pos_y = dirY * vY * deltaT;
			}

			// dispatch translation event
			const evt = this.newGestureEvent(EventType.Change);
			evt.translationX = delta_pos_x;
			evt.translationY = delta_pos_y;
			dispatchTo.forEach(d => d.dispatchEvent(evt));

			if (!stopped) {
				this.inertia(targetWindow, dispatchTo, now, vX, dirX, x + delta_pos_x, vY, dirY, y + delta_pos_y);
			}
		});
	}

	private onTouchMove(e: TouchEvent): void {
		const timestamp = Date.now(); // use Date.now() because on FF e.timeStamp is not epoch based.

		for (let i = 0, len = e.changedTouches.length; i < len; i++) {

			const touch = e.changedTouches.item(i);

			if (!this.activeTouches.hasOwnProperty(String(touch.identifier))) {
				console.warn('end of an UNKNOWN touch', touch);
				continue;
			}

			const data = this.activeTouches[touch.identifier];

			const evt = this.newGestureEvent(EventType.Change, data.initialTarget);
			evt.translationX = touch.pageX - data.rollingPageX.at(-1)!;
			evt.translationY = touch.pageY - data.rollingPageY.at(-1)!;
			evt.pageX = touch.pageX;
			evt.pageY = touch.pageY;
			this.dispatchEvent(evt);

			// only keep a few data points, to average the final speed
			if (data.rollingPageX.length > 3) {
				data.rollingPageX.shift();
				data.rollingPageY.shift();
				data.rollingTimestamps.shift();
			}

			data.rollingPageX.push(touch.pageX);
			data.rollingPageY.push(touch.pageY);
			data.rollingTimestamps.push(timestamp);
		}

		if (this.dispatched) {
			e.preventDefault();
			e.stopPropagation();
			this.dispatched = false;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/trustedTypes.ts]---
Location: vscode-main/src/vs/base/browser/trustedTypes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { onUnexpectedError } from '../common/errors.js';
import { getMonacoEnvironment } from './browser.js';

type TrustedTypePolicyOptions = import('trusted-types/lib/index.d.ts').TrustedTypePolicyOptions;

export function createTrustedTypesPolicy<Options extends TrustedTypePolicyOptions>(
	policyName: string,
	policyOptions?: Options,
): undefined | Pick<TrustedTypePolicy, 'name' | Extract<keyof Options, keyof TrustedTypePolicyOptions>> {

	const monacoEnvironment = getMonacoEnvironment();

	if (monacoEnvironment?.createTrustedTypesPolicy) {
		try {
			return monacoEnvironment.createTrustedTypesPolicy(policyName, policyOptions);
		} catch (err) {
			onUnexpectedError(err);
			return undefined;
		}
	}
	try {
		// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
		return (globalThis as any).trustedTypes?.createPolicy(policyName, policyOptions);
	} catch (err) {
		onUnexpectedError(err);
		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/window.ts]---
Location: vscode-main/src/vs/base/browser/window.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export type CodeWindow = Window & typeof globalThis & {
	readonly vscodeWindowId: number;
};

export function ensureCodeWindow(targetWindow: Window, fallbackWindowId: number): asserts targetWindow is CodeWindow {
	const codeWindow = targetWindow as Partial<CodeWindow>;

	if (typeof codeWindow.vscodeWindowId !== 'number') {
		Object.defineProperty(codeWindow, 'vscodeWindowId', {
			get: () => fallbackWindowId
		});
	}
}

// eslint-disable-next-line no-restricted-globals
export const mainWindow = window as CodeWindow;

export function isAuxiliaryWindow(obj: Window): obj is CodeWindow {
	if (obj === mainWindow) {
		return false;
	}

	const candidate = obj as CodeWindow | undefined;

	return typeof candidate?.vscodeWindowId === 'number';
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/dompurify/cgmanifest.json]---
Location: vscode-main/src/vs/base/browser/dompurify/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "dompurify",
					"repositoryUrl": "https://github.com/cure53/DOMPurify",
					"commitHash": "eaa0bdb26a1d0164af587d9059b98269008faece",
					"tag": "3.2.7"
				}
			},
			"license": "Apache 2.0",
			"version": "3.2.7"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/dompurify/dompurify.d.ts]---
Location: vscode-main/src/vs/base/browser/dompurify/dompurify.d.ts

```typescript
/*! @license DOMPurify 3.2.7 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.7/LICENSE */

import type { TrustedTypePolicy, TrustedHTML, TrustedTypesWindow } from 'trusted-types/lib/index.d.ts';

/**
 * Configuration to control DOMPurify behavior.
 */
interface Config {
	/**
	 * Extend the existing array of allowed attributes.
	 */
	ADD_ATTR?: string[] | undefined;
	/**
	 * Extend the existing array of elements that can use Data URIs.
	 */
	ADD_DATA_URI_TAGS?: string[] | undefined;
	/**
	 * Extend the existing array of allowed tags.
	 */
	ADD_TAGS?: string[] | undefined;
	/**
	 * Extend the existing array of elements that are safe for URI-like values (be careful, XSS risk).
	 */
	ADD_URI_SAFE_ATTR?: string[] | undefined;
	/**
	 * Allow ARIA attributes, leave other safe HTML as is (default is true).
	 */
	ALLOW_ARIA_ATTR?: boolean | undefined;
	/**
	 * Allow HTML5 data attributes, leave other safe HTML as is (default is true).
	 */
	ALLOW_DATA_ATTR?: boolean | undefined;
	/**
	 * Allow external protocol handlers in URL attributes (default is false, be careful, XSS risk).
	 * By default only `http`, `https`, `ftp`, `ftps`, `tel`, `mailto`, `callto`, `sms`, `cid` and `xmpp` are allowed.
	 */
	ALLOW_UNKNOWN_PROTOCOLS?: boolean | undefined;
	/**
	 * Decide if self-closing tags in attributes are allowed.
	 * Usually removed due to a mXSS issue in jQuery 3.0.
	 */
	ALLOW_SELF_CLOSE_IN_ATTR?: boolean | undefined;
	/**
	 * Allow only specific attributes.
	 */
	ALLOWED_ATTR?: string[] | undefined;
	/**
	 * Allow only specific elements.
	 */
	ALLOWED_TAGS?: string[] | undefined;
	/**
	 * Allow only specific namespaces. Defaults to:
	 *  - `http://www.w3.org/1999/xhtml`
	 *  - `http://www.w3.org/2000/svg`
	 *  - `http://www.w3.org/1998/Math/MathML`
	 */
	ALLOWED_NAMESPACES?: string[] | undefined;
	/**
	 * Allow specific protocols handlers in URL attributes via regex (be careful, XSS risk).
	 * Default RegExp:
	 * ```
	 * /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;
	 * ```
	 */
	ALLOWED_URI_REGEXP?: RegExp | undefined;
	/**
	 * Define how custom elements are handled.
	 */
	CUSTOM_ELEMENT_HANDLING?: {
		/**
		 * Regular expression or function to match to allowed elements.
		 * Default is null (disallow any custom elements).
		 */
		tagNameCheck?: RegExp | ((tagName: string) => boolean) | null | undefined;
		/**
		 * Regular expression or function to match to allowed attributes.
		 * Default is null (disallow any attributes not on the allow list).
		 */
		attributeNameCheck?: RegExp | ((attributeName: string, tagName?: string) => boolean) | null | undefined;
		/**
		 * Allow custom elements derived from built-ins if they pass `tagNameCheck`. Default is false.
		 */
		allowCustomizedBuiltInElements?: boolean | undefined;
	};
	/**
	 * Add attributes to block-list.
	 */
	FORBID_ATTR?: string[] | undefined;
	/**
	 * Add child elements to be removed when their parent is removed.
	 */
	FORBID_CONTENTS?: string[] | undefined;
	/**
	 * Add elements to block-list.
	 */
	FORBID_TAGS?: string[] | undefined;
	/**
	 * Glue elements like style, script or others to `document.body` and prevent unintuitive browser behavior in several edge-cases (default is false).
	 */
	FORCE_BODY?: boolean | undefined;
	/**
	 * Map of non-standard HTML element names to support. Map to true to enable support. For example:
	 *
	 * ```
	 * HTML_INTEGRATION_POINTS: { foreignobject: true }
	 * ```
	 */
	HTML_INTEGRATION_POINTS?: Record<string, boolean> | undefined;
	/**
	 * Sanitize a node "in place", which is much faster depending on how you use DOMPurify.
	 */
	IN_PLACE?: boolean | undefined;
	/**
	 * Keep an element's content when the element is removed (default is true).
	 */
	KEEP_CONTENT?: boolean | undefined;
	/**
	 * Map of MathML element names to support. Map to true to enable support. For example:
	 *
	 * ```
	 * MATHML_TEXT_INTEGRATION_POINTS: { mtext: true }
	 * ```
	 */
	MATHML_TEXT_INTEGRATION_POINTS?: Record<string, boolean> | undefined;
	/**
	 * Change the default namespace from HTML to something different.
	 */
	NAMESPACE?: string | undefined;
	/**
	 * Change the parser type so sanitized data is treated as XML and not as HTML, which is the default.
	 */
	PARSER_MEDIA_TYPE?: DOMParserSupportedType | undefined;
	/**
	 * Return a DOM `DocumentFragment` instead of an HTML string (default is false).
	 */
	RETURN_DOM_FRAGMENT?: boolean | undefined;
	/**
	 * Return a DOM `HTMLBodyElement` instead of an HTML string (default is false).
	 */
	RETURN_DOM?: boolean | undefined;
	/**
	 * Return a TrustedHTML object instead of a string if possible.
	 */
	RETURN_TRUSTED_TYPE?: boolean | undefined;
	/**
	 * Strip `{{ ... }}`, `${ ... }` and `<% ... %>` to make output safe for template systems.
	 * Be careful please, this mode is not recommended for production usage.
	 * Allowing template parsing in user-controlled HTML is not advised at all.
	 * Only use this mode if there is really no alternative.
	 */
	SAFE_FOR_TEMPLATES?: boolean | undefined;
	/**
	 * Change how e.g. comments containing risky HTML characters are treated.
	 * Be very careful, this setting should only be set to `false` if you really only handle
	 * HTML and nothing else, no SVG, MathML or the like.
	 * Otherwise, changing from `true` to `false` will lead to XSS in this or some other way.
	 */
	SAFE_FOR_XML?: boolean | undefined;
	/**
	 * Use DOM Clobbering protection on output (default is true, handle with care, minor XSS risks here).
	 */
	SANITIZE_DOM?: boolean | undefined;
	/**
	 * Enforce strict DOM Clobbering protection via namespace isolation (default is false).
	 * When enabled, isolates the namespace of named properties (i.e., `id` and `name` attributes)
	 * from JS variables by prefixing them with the string `user-content-`
	 */
	SANITIZE_NAMED_PROPS?: boolean | undefined;
	/**
	 * Supplied policy must define `createHTML` and `createScriptURL`.
	 */
	TRUSTED_TYPES_POLICY?: TrustedTypePolicy | undefined;
	/**
	 * Controls categories of allowed elements.
	 *
	 * Note that the `USE_PROFILES` setting will override the `ALLOWED_TAGS` setting
	 * so don't use them together.
	 */
	USE_PROFILES?: false | UseProfilesConfig | undefined;
	/**
	 * Return entire document including <html> tags (default is false).
	 */
	WHOLE_DOCUMENT?: boolean | undefined;
}
/**
 * Defines categories of allowed elements.
 */
interface UseProfilesConfig {
	/**
	 * Allow all safe MathML elements.
	 */
	mathMl?: boolean | undefined;
	/**
	 * Allow all safe SVG elements.
	 */
	svg?: boolean | undefined;
	/**
	 * Allow all save SVG Filters.
	 */
	svgFilters?: boolean | undefined;
	/**
	 * Allow all safe HTML elements.
	 */
	html?: boolean | undefined;
}

declare const _default: DOMPurify;

interface DOMPurify {
	/**
	 * Creates a DOMPurify instance using the given window-like object. Defaults to `window`.
	 */
	(root?: WindowLike): DOMPurify;
	/**
	 * Version label, exposed for easier checks
	 * if DOMPurify is up to date or not
	 */
	version: string;
	/**
	 * Array of elements that DOMPurify removed during sanitation.
	 * Empty if nothing was removed.
	 */
	removed: Array<RemovedElement | RemovedAttribute>;
	/**
	 * Expose whether this browser supports running the full DOMPurify.
	 */
	isSupported: boolean;
	/**
	 * Set the configuration once.
	 *
	 * @param cfg configuration object
	 */
	setConfig(cfg?: Config): void;
	/**
	 * Removes the configuration.
	 */
	clearConfig(): void;
	/**
	 * Provides core sanitation functionality.
	 *
	 * @param dirty string or DOM node
	 * @param cfg object
	 * @returns Sanitized TrustedHTML.
	 */
	sanitize(dirty: string | Node, cfg: Config & {
		RETURN_TRUSTED_TYPE: true;
	}): TrustedHTML;
	/**
	 * Provides core sanitation functionality.
	 *
	 * @param dirty DOM node
	 * @param cfg object
	 * @returns Sanitized DOM node.
	 */
	sanitize(dirty: Node, cfg: Config & {
		IN_PLACE: true;
	}): Node;
	/**
	 * Provides core sanitation functionality.
	 *
	 * @param dirty string or DOM node
	 * @param cfg object
	 * @returns Sanitized DOM node.
	 */
	sanitize(dirty: string | Node, cfg: Config & {
		RETURN_DOM: true;
	}): Node;
	/**
	 * Provides core sanitation functionality.
	 *
	 * @param dirty string or DOM node
	 * @param cfg object
	 * @returns Sanitized document fragment.
	 */
	sanitize(dirty: string | Node, cfg: Config & {
		RETURN_DOM_FRAGMENT: true;
	}): DocumentFragment;
	/**
	 * Provides core sanitation functionality.
	 *
	 * @param dirty string or DOM node
	 * @param cfg object
	 * @returns Sanitized string.
	 */
	sanitize(dirty: string | Node, cfg?: Config): string;
	/**
	 * Checks if an attribute value is valid.
	 * Uses last set config, if any. Otherwise, uses config defaults.
	 *
	 * @param tag Tag name of containing element.
	 * @param attr Attribute name.
	 * @param value Attribute value.
	 * @returns Returns true if `value` is valid. Otherwise, returns false.
	 */
	isValidAttribute(tag: string, attr: string, value: string): boolean;
	/**
	 * Adds a DOMPurify hook.
	 *
	 * @param entryPoint entry point for the hook to add
	 * @param hookFunction function to execute
	 */
	addHook(entryPoint: BasicHookName, hookFunction: NodeHook): void;
	/**
	 * Adds a DOMPurify hook.
	 *
	 * @param entryPoint entry point for the hook to add
	 * @param hookFunction function to execute
	 */
	addHook(entryPoint: ElementHookName, hookFunction: ElementHook): void;
	/**
	 * Adds a DOMPurify hook.
	 *
	 * @param entryPoint entry point for the hook to add
	 * @param hookFunction function to execute
	 */
	addHook(entryPoint: DocumentFragmentHookName, hookFunction: DocumentFragmentHook): void;
	/**
	 * Adds a DOMPurify hook.
	 *
	 * @param entryPoint entry point for the hook to add
	 * @param hookFunction function to execute
	 */
	addHook(entryPoint: 'uponSanitizeElement', hookFunction: UponSanitizeElementHook): void;
	/**
	 * Adds a DOMPurify hook.
	 *
	 * @param entryPoint entry point for the hook to add
	 * @param hookFunction function to execute
	 */
	addHook(entryPoint: 'uponSanitizeAttribute', hookFunction: UponSanitizeAttributeHook): void;
	/**
	 * Remove a DOMPurify hook at a given entryPoint
	 * (pops it from the stack of hooks if hook not specified)
	 *
	 * @param entryPoint entry point for the hook to remove
	 * @param hookFunction optional specific hook to remove
	 * @returns removed hook
	 */
	removeHook(entryPoint: BasicHookName, hookFunction?: NodeHook): NodeHook | undefined;
	/**
	 * Remove a DOMPurify hook at a given entryPoint
	 * (pops it from the stack of hooks if hook not specified)
	 *
	 * @param entryPoint entry point for the hook to remove
	 * @param hookFunction optional specific hook to remove
	 * @returns removed hook
	 */
	removeHook(entryPoint: ElementHookName, hookFunction?: ElementHook): ElementHook | undefined;
	/**
	 * Remove a DOMPurify hook at a given entryPoint
	 * (pops it from the stack of hooks if hook not specified)
	 *
	 * @param entryPoint entry point for the hook to remove
	 * @param hookFunction optional specific hook to remove
	 * @returns removed hook
	 */
	removeHook(entryPoint: DocumentFragmentHookName, hookFunction?: DocumentFragmentHook): DocumentFragmentHook | undefined;
	/**
	 * Remove a DOMPurify hook at a given entryPoint
	 * (pops it from the stack of hooks if hook not specified)
	 *
	 * @param entryPoint entry point for the hook to remove
	 * @param hookFunction optional specific hook to remove
	 * @returns removed hook
	 */
	removeHook(entryPoint: 'uponSanitizeElement', hookFunction?: UponSanitizeElementHook): UponSanitizeElementHook | undefined;
	/**
	 * Remove a DOMPurify hook at a given entryPoint
	 * (pops it from the stack of hooks if hook not specified)
	 *
	 * @param entryPoint entry point for the hook to remove
	 * @param hookFunction optional specific hook to remove
	 * @returns removed hook
	 */
	removeHook(entryPoint: 'uponSanitizeAttribute', hookFunction?: UponSanitizeAttributeHook): UponSanitizeAttributeHook | undefined;
	/**
	 * Removes all DOMPurify hooks at a given entryPoint
	 *
	 * @param entryPoint entry point for the hooks to remove
	 */
	removeHooks(entryPoint: HookName): void;
	/**
	 * Removes all DOMPurify hooks.
	 */
	removeAllHooks(): void;
}
/**
 * An element removed by DOMPurify.
 */
interface RemovedElement {
	/**
	 * The element that was removed.
	 */
	element: Node;
}
/**
 * An element removed by DOMPurify.
 */
interface RemovedAttribute {
	/**
	 * The attribute that was removed.
	 */
	attribute: Attr | null;
	/**
	 * The element that the attribute was removed.
	 */
	from: Node;
}
type BasicHookName = 'beforeSanitizeElements' | 'afterSanitizeElements' | 'uponSanitizeShadowNode';
type ElementHookName = 'beforeSanitizeAttributes' | 'afterSanitizeAttributes';
type DocumentFragmentHookName = 'beforeSanitizeShadowDOM' | 'afterSanitizeShadowDOM';
type UponSanitizeElementHookName = 'uponSanitizeElement';
type UponSanitizeAttributeHookName = 'uponSanitizeAttribute';
type HookName = BasicHookName | ElementHookName | DocumentFragmentHookName | UponSanitizeElementHookName | UponSanitizeAttributeHookName;
type NodeHook = (this: DOMPurify, currentNode: Node, hookEvent: null, config: Config) => void;
type ElementHook = (this: DOMPurify, currentNode: Element, hookEvent: null, config: Config) => void;
type DocumentFragmentHook = (this: DOMPurify, currentNode: DocumentFragment, hookEvent: null, config: Config) => void;
type UponSanitizeElementHook = (this: DOMPurify, currentNode: Node, hookEvent: UponSanitizeElementHookEvent, config: Config) => void;
type UponSanitizeAttributeHook = (this: DOMPurify, currentNode: Element, hookEvent: UponSanitizeAttributeHookEvent, config: Config) => void;
interface UponSanitizeElementHookEvent {
	tagName: string;
	allowedTags: Record<string, boolean>;
}
interface UponSanitizeAttributeHookEvent {
	attrName: string;
	attrValue: string;
	keepAttr: boolean;
	allowedAttributes: Record<string, boolean>;
	forceKeepAttr: boolean | undefined;
}
/**
 * A `Window`-like object containing the properties and types that DOMPurify requires.
 */
type WindowLike = Pick<typeof globalThis, 'DocumentFragment' | 'HTMLTemplateElement' | 'Node' | 'Element' | 'NodeFilter' | 'NamedNodeMap' | 'HTMLFormElement' | 'DOMParser'> & {
	document?: Document;
	MozNamedAttrMap?: typeof window.NamedNodeMap;
} & Pick<TrustedTypesWindow, 'trustedTypes'>;

export { type Config, type DOMPurify, type DocumentFragmentHook, type ElementHook, type HookName, type NodeHook, type RemovedAttribute, type RemovedElement, type UponSanitizeAttributeHook, type UponSanitizeAttributeHookEvent, type UponSanitizeElementHook, type UponSanitizeElementHookEvent, type WindowLike, _default as default };
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/dompurify/dompurify.js]---
Location: vscode-main/src/vs/base/browser/dompurify/dompurify.js

```javascript
/*! @license DOMPurify 3.2.7 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.7/LICENSE */

const {
  entries,
  setPrototypeOf,
  isFrozen,
  getPrototypeOf,
  getOwnPropertyDescriptor
} = Object;
let {
  freeze,
  seal,
  create
} = Object; // eslint-disable-line import/no-mutable-exports
let {
  apply,
  construct
} = typeof Reflect !== 'undefined' && Reflect;
if (!freeze) {
  freeze = function freeze(x) {
    return x;
  };
}
if (!seal) {
  seal = function seal(x) {
    return x;
  };
}
if (!apply) {
  apply = function apply(func, thisArg) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    return func.apply(thisArg, args);
  };
}
if (!construct) {
  construct = function construct(Func) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    return new Func(...args);
  };
}
const arrayForEach = unapply(Array.prototype.forEach);
const arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
const arrayPop = unapply(Array.prototype.pop);
const arrayPush = unapply(Array.prototype.push);
const arraySplice = unapply(Array.prototype.splice);
const stringToLowerCase = unapply(String.prototype.toLowerCase);
const stringToString = unapply(String.prototype.toString);
const stringMatch = unapply(String.prototype.match);
const stringReplace = unapply(String.prototype.replace);
const stringIndexOf = unapply(String.prototype.indexOf);
const stringTrim = unapply(String.prototype.trim);
const objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
const regExpTest = unapply(RegExp.prototype.test);
const typeErrorCreate = unconstruct(TypeError);
/**
 * Creates a new function that calls the given function with a specified thisArg and arguments.
 *
 * @param func - The function to be wrapped and called.
 * @returns A new function that calls the given function with a specified thisArg and arguments.
 */
function unapply(func) {
  return function (thisArg) {
    if (thisArg instanceof RegExp) {
      thisArg.lastIndex = 0;
    }
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    return apply(func, thisArg, args);
  };
}
/**
 * Creates a new function that constructs an instance of the given constructor function with the provided arguments.
 *
 * @param func - The constructor function to be wrapped and called.
 * @returns A new function that constructs an instance of the given constructor function with the provided arguments.
 */
function unconstruct(Func) {
  return function () {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return construct(Func, args);
  };
}
/**
 * Add properties to a lookup table
 *
 * @param set - The set to which elements will be added.
 * @param array - The array containing elements to be added to the set.
 * @param transformCaseFunc - An optional function to transform the case of each element before adding to the set.
 * @returns The modified set with added elements.
 */
function addToSet(set, array) {
  let transformCaseFunc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : stringToLowerCase;
  if (setPrototypeOf) {
    // Make 'in' and truthy checks like Boolean(set.constructor)
    // independent of any properties defined on Object.prototype.
    // Prevent prototype setters from intercepting set as a this value.
    setPrototypeOf(set, null);
  }
  let l = array.length;
  while (l--) {
    let element = array[l];
    if (typeof element === 'string') {
      const lcElement = transformCaseFunc(element);
      if (lcElement !== element) {
        // Config presets (e.g. tags.js, attrs.js) are immutable.
        if (!isFrozen(array)) {
          array[l] = lcElement;
        }
        element = lcElement;
      }
    }
    set[element] = true;
  }
  return set;
}
/**
 * Clean up an array to harden against CSPP
 *
 * @param array - The array to be cleaned.
 * @returns The cleaned version of the array
 */
function cleanArray(array) {
  for (let index = 0; index < array.length; index++) {
    const isPropertyExist = objectHasOwnProperty(array, index);
    if (!isPropertyExist) {
      array[index] = null;
    }
  }
  return array;
}
/**
 * Shallow clone an object
 *
 * @param object - The object to be cloned.
 * @returns A new object that copies the original.
 */
function clone(object) {
  const newObject = create(null);
  for (const [property, value] of entries(object)) {
    const isPropertyExist = objectHasOwnProperty(object, property);
    if (isPropertyExist) {
      if (Array.isArray(value)) {
        newObject[property] = cleanArray(value);
      } else if (value && typeof value === 'object' && value.constructor === Object) {
        newObject[property] = clone(value);
      } else {
        newObject[property] = value;
      }
    }
  }
  return newObject;
}
/**
 * This method automatically checks if the prop is function or getter and behaves accordingly.
 *
 * @param object - The object to look up the getter function in its prototype chain.
 * @param prop - The property name for which to find the getter function.
 * @returns The getter function found in the prototype chain or a fallback function.
 */
function lookupGetter(object, prop) {
  while (object !== null) {
    const desc = getOwnPropertyDescriptor(object, prop);
    if (desc) {
      if (desc.get) {
        return unapply(desc.get);
      }
      if (typeof desc.value === 'function') {
        return unapply(desc.value);
      }
    }
    object = getPrototypeOf(object);
  }
  function fallbackValue() {
    return null;
  }
  return fallbackValue;
}

const html$1 = freeze(['a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meter', 'nav', 'nobr', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'search', 'section', 'select', 'shadow', 'slot', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr']);
const svg$1 = freeze(['svg', 'a', 'altglyph', 'altglyphdef', 'altglyphitem', 'animatecolor', 'animatemotion', 'animatetransform', 'circle', 'clippath', 'defs', 'desc', 'ellipse', 'enterkeyhint', 'exportparts', 'filter', 'font', 'g', 'glyph', 'glyphref', 'hkern', 'image', 'inputmode', 'line', 'lineargradient', 'marker', 'mask', 'metadata', 'mpath', 'part', 'path', 'pattern', 'polygon', 'polyline', 'radialgradient', 'rect', 'slot', 'stop', 'style', 'switch', 'symbol', 'text', 'textpath', 'title', 'tref', 'tspan', 'view', 'vkern']);
const svgFilters = freeze(['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence']);
// List of SVG elements that are disallowed by default.
// We still need to know them so that we can do namespace
// checks properly in case one wants to add them to
// allow-list.
const svgDisallowed = freeze(['animate', 'color-profile', 'cursor', 'discard', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignobject', 'hatch', 'hatchpath', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'missing-glyph', 'script', 'set', 'solidcolor', 'unknown', 'use']);
const mathMl$1 = freeze(['math', 'menclose', 'merror', 'mfenced', 'mfrac', 'mglyph', 'mi', 'mlabeledtr', 'mmultiscripts', 'mn', 'mo', 'mover', 'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mspace', 'msqrt', 'mstyle', 'msub', 'msup', 'msubsup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover', 'mprescripts']);
// Similarly to SVG, we want to know all MathML elements,
// even those that we disallow by default.
const mathMlDisallowed = freeze(['maction', 'maligngroup', 'malignmark', 'mlongdiv', 'mscarries', 'mscarry', 'msgroup', 'mstack', 'msline', 'msrow', 'semantics', 'annotation', 'annotation-xml', 'mprescripts', 'none']);
const text = freeze(['#text']);

const html = freeze(['accept', 'action', 'align', 'alt', 'autocapitalize', 'autocomplete', 'autopictureinpicture', 'autoplay', 'background', 'bgcolor', 'border', 'capture', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'clear', 'color', 'cols', 'colspan', 'controls', 'controlslist', 'coords', 'crossorigin', 'datetime', 'decoding', 'default', 'dir', 'disabled', 'disablepictureinpicture', 'disableremoteplayback', 'download', 'draggable', 'enctype', 'enterkeyhint', 'exportparts', 'face', 'for', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'id', 'inert', 'inputmode', 'integrity', 'ismap', 'kind', 'label', 'lang', 'list', 'loading', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'minlength', 'multiple', 'muted', 'name', 'nonce', 'noshade', 'novalidate', 'nowrap', 'open', 'optimum', 'part', 'pattern', 'placeholder', 'playsinline', 'popover', 'popovertarget', 'popovertargetaction', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'rev', 'reversed', 'role', 'rows', 'rowspan', 'spellcheck', 'scope', 'selected', 'shape', 'size', 'sizes', 'slot', 'span', 'srclang', 'start', 'src', 'srcset', 'step', 'style', 'summary', 'tabindex', 'title', 'translate', 'type', 'usemap', 'valign', 'value', 'width', 'wrap', 'xmlns', 'slot']);
const svg = freeze(['accent-height', 'accumulate', 'additive', 'alignment-baseline', 'amplitude', 'ascent', 'attributename', 'attributetype', 'azimuth', 'basefrequency', 'baseline-shift', 'begin', 'bias', 'by', 'class', 'clip', 'clippathunits', 'clip-path', 'clip-rule', 'color', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'cx', 'cy', 'd', 'dx', 'dy', 'diffuseconstant', 'direction', 'display', 'divisor', 'dur', 'edgemode', 'elevation', 'end', 'exponent', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'filterunits', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'fx', 'fy', 'g1', 'g2', 'glyph-name', 'glyphref', 'gradientunits', 'gradienttransform', 'height', 'href', 'id', 'image-rendering', 'in', 'in2', 'intercept', 'k', 'k1', 'k2', 'k3', 'k4', 'kerning', 'keypoints', 'keysplines', 'keytimes', 'lang', 'lengthadjust', 'letter-spacing', 'kernelmatrix', 'kernelunitlength', 'lighting-color', 'local', 'marker-end', 'marker-mid', 'marker-start', 'markerheight', 'markerunits', 'markerwidth', 'maskcontentunits', 'maskunits', 'max', 'mask', 'media', 'method', 'mode', 'min', 'name', 'numoctaves', 'offset', 'operator', 'opacity', 'order', 'orient', 'orientation', 'origin', 'overflow', 'paint-order', 'path', 'pathlength', 'patterncontentunits', 'patterntransform', 'patternunits', 'points', 'preservealpha', 'preserveaspectratio', 'primitiveunits', 'r', 'rx', 'ry', 'radius', 'refx', 'refy', 'repeatcount', 'repeatdur', 'restart', 'result', 'rotate', 'scale', 'seed', 'shape-rendering', 'slope', 'specularconstant', 'specularexponent', 'spreadmethod', 'startoffset', 'stddeviation', 'stitchtiles', 'stop-color', 'stop-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke', 'stroke-width', 'style', 'surfacescale', 'systemlanguage', 'tabindex', 'tablevalues', 'targetx', 'targety', 'transform', 'transform-origin', 'text-anchor', 'text-decoration', 'text-rendering', 'textlength', 'type', 'u1', 'u2', 'unicode', 'values', 'viewbox', 'visibility', 'version', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'width', 'word-spacing', 'wrap', 'writing-mode', 'xchannelselector', 'ychannelselector', 'x', 'x1', 'x2', 'xmlns', 'y', 'y1', 'y2', 'z', 'zoomandpan']);
const mathMl = freeze(['accent', 'accentunder', 'align', 'bevelled', 'close', 'columnsalign', 'columnlines', 'columnspan', 'denomalign', 'depth', 'dir', 'display', 'displaystyle', 'encoding', 'fence', 'frame', 'height', 'href', 'id', 'largeop', 'length', 'linethickness', 'lspace', 'lquote', 'mathbackground', 'mathcolor', 'mathsize', 'mathvariant', 'maxsize', 'minsize', 'movablelimits', 'notation', 'numalign', 'open', 'rowalign', 'rowlines', 'rowspacing', 'rowspan', 'rspace', 'rquote', 'scriptlevel', 'scriptminsize', 'scriptsizemultiplier', 'selection', 'separator', 'separators', 'stretchy', 'subscriptshift', 'supscriptshift', 'symmetric', 'voffset', 'width', 'xmlns']);
const xml = freeze(['xlink:href', 'xml:id', 'xlink:title', 'xml:space', 'xmlns:xlink']);

// eslint-disable-next-line unicorn/better-regex
const MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm); // Specify template detection regex for SAFE_FOR_TEMPLATES mode
const ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
const TMPLIT_EXPR = seal(/\$\{[\w\W]*/gm); // eslint-disable-line unicorn/better-regex
const DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/); // eslint-disable-line no-useless-escape
const ARIA_ATTR = seal(/^aria-[\-\w]+$/); // eslint-disable-line no-useless-escape
const IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i // eslint-disable-line no-useless-escape
);
const IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
const ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g // eslint-disable-line no-control-regex
);
const DOCTYPE_NAME = seal(/^html$/i);
const CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);

var EXPRESSIONS = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ARIA_ATTR: ARIA_ATTR,
  ATTR_WHITESPACE: ATTR_WHITESPACE,
  CUSTOM_ELEMENT: CUSTOM_ELEMENT,
  DATA_ATTR: DATA_ATTR,
  DOCTYPE_NAME: DOCTYPE_NAME,
  ERB_EXPR: ERB_EXPR,
  IS_ALLOWED_URI: IS_ALLOWED_URI,
  IS_SCRIPT_OR_DATA: IS_SCRIPT_OR_DATA,
  MUSTACHE_EXPR: MUSTACHE_EXPR,
  TMPLIT_EXPR: TMPLIT_EXPR
});

/* eslint-disable @typescript-eslint/indent */
// https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
const NODE_TYPE = {
  element: 1,
  attribute: 2,
  text: 3,
  cdataSection: 4,
  entityReference: 5,
  // Deprecated
  entityNode: 6,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9,
  documentType: 10,
  documentFragment: 11,
  notation: 12 // Deprecated
};
const getGlobal = function getGlobal() {
  return typeof window === 'undefined' ? null : window;
};
/**
 * Creates a no-op policy for internal use only.
 * Don't export this function outside this module!
 * @param trustedTypes The policy factory.
 * @param purifyHostElement The Script element used to load DOMPurify (to determine policy name suffix).
 * @return The policy created (or null, if Trusted Types
 * are not supported or creating the policy failed).
 */
const _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, purifyHostElement) {
  if (typeof trustedTypes !== 'object' || typeof trustedTypes.createPolicy !== 'function') {
    return null;
  }
  // Allow the callers to control the unique policy name
  // by adding a data-tt-policy-suffix to the script element with the DOMPurify.
  // Policy creation with duplicate names throws in Trusted Types.
  let suffix = null;
  const ATTR_NAME = 'data-tt-policy-suffix';
  if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
    suffix = purifyHostElement.getAttribute(ATTR_NAME);
  }
  const policyName = 'dompurify' + (suffix ? '#' + suffix : '');
  try {
    return trustedTypes.createPolicy(policyName, {
      createHTML(html) {
        return html;
      },
      createScriptURL(scriptUrl) {
        return scriptUrl;
      }
    });
  } catch (_) {
    // Policy creation failed (most likely another DOMPurify script has
    // already run). Skip creating the policy, as this will only cause errors
    // if TT are enforced.
    console.warn('TrustedTypes policy ' + policyName + ' could not be created.');
    return null;
  }
};
const _createHooksMap = function _createHooksMap() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
function createDOMPurify() {
  let window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getGlobal();
  const DOMPurify = root => createDOMPurify(root);
  DOMPurify.version = '3.2.7';
  DOMPurify.removed = [];
  if (!window || !window.document || window.document.nodeType !== NODE_TYPE.document || !window.Element) {
    // Not running in a browser, provide a factory function
    // so that you can pass your own Window
    DOMPurify.isSupported = false;
    return DOMPurify;
  }
  let {
    document
  } = window;
  const originalDocument = document;
  const currentScript = originalDocument.currentScript;
  const {
    DocumentFragment,
    HTMLTemplateElement,
    Node,
    Element,
    NodeFilter,
    NamedNodeMap = window.NamedNodeMap || window.MozNamedAttrMap,
    HTMLFormElement,
    DOMParser,
    trustedTypes
  } = window;
  const ElementPrototype = Element.prototype;
  const cloneNode = lookupGetter(ElementPrototype, 'cloneNode');
  const remove = lookupGetter(ElementPrototype, 'remove');
  const getNextSibling = lookupGetter(ElementPrototype, 'nextSibling');
  const getChildNodes = lookupGetter(ElementPrototype, 'childNodes');
  const getParentNode = lookupGetter(ElementPrototype, 'parentNode');
  // As per issue #47, the web-components registry is inherited by a
  // new document created via createHTMLDocument. As per the spec
  // (http://w3c.github.io/webcomponents/spec/custom/#creating-and-passing-registries)
  // a new empty registry is used when creating a template contents owner
  // document, so we use that as our parent document to ensure nothing
  // is inherited.
  if (typeof HTMLTemplateElement === 'function') {
    const template = document.createElement('template');
    if (template.content && template.content.ownerDocument) {
      document = template.content.ownerDocument;
    }
  }
  let trustedTypesPolicy;
  let emptyHTML = '';
  const {
    implementation,
    createNodeIterator,
    createDocumentFragment,
    getElementsByTagName
  } = document;
  const {
    importNode
  } = originalDocument;
  let hooks = _createHooksMap();
  /**
   * Expose whether this browser supports running the full DOMPurify.
   */
  DOMPurify.isSupported = typeof entries === 'function' && typeof getParentNode === 'function' && implementation && implementation.createHTMLDocument !== undefined;
  const {
    MUSTACHE_EXPR,
    ERB_EXPR,
    TMPLIT_EXPR,
    DATA_ATTR,
    ARIA_ATTR,
    IS_SCRIPT_OR_DATA,
    ATTR_WHITESPACE,
    CUSTOM_ELEMENT
  } = EXPRESSIONS;
  let {
    IS_ALLOWED_URI: IS_ALLOWED_URI$1
  } = EXPRESSIONS;
  /**
   * We consider the elements and attributes below to be safe. Ideally
   * don't add any new ones but feel free to remove unwanted ones.
   */
  /* allowed element names */
  let ALLOWED_TAGS = null;
  const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
  /* Allowed attribute names */
  let ALLOWED_ATTR = null;
  const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
  /*
   * Configure how DOMPurify should handle custom elements and their attributes as well as customized built-in elements.
   * @property {RegExp|Function|null} tagNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any custom elements)
   * @property {RegExp|Function|null} attributeNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any attributes not on the allow list)
   * @property {boolean} allowCustomizedBuiltInElements allow custom elements derived from built-ins if they pass CUSTOM_ELEMENT_HANDLING.tagNameCheck. Default: `false`.
   */
  let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
    tagNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: false
    }
  }));
  /* Explicitly forbidden tags (overrides ALLOWED_TAGS/ADD_TAGS) */
  let FORBID_TAGS = null;
  /* Explicitly forbidden attributes (overrides ALLOWED_ATTR/ADD_ATTR) */
  let FORBID_ATTR = null;
  /* Decide if ARIA attributes are okay */
  let ALLOW_ARIA_ATTR = true;
  /* Decide if custom data attributes are okay */
  let ALLOW_DATA_ATTR = true;
  /* Decide if unknown protocols are okay */
  let ALLOW_UNKNOWN_PROTOCOLS = false;
  /* Decide if self-closing tags in attributes are allowed.
   * Usually removed due to a mXSS issue in jQuery 3.0 */
  let ALLOW_SELF_CLOSE_IN_ATTR = true;
  /* Output should be safe for common template engines.
   * This means, DOMPurify removes data attributes, mustaches and ERB
   */
  let SAFE_FOR_TEMPLATES = false;
  /* Output should be safe even for XML used within HTML and alike.
   * This means, DOMPurify removes comments when containing risky content.
   */
  let SAFE_FOR_XML = true;
  /* Decide if document with <html>... should be returned */
  let WHOLE_DOCUMENT = false;
  /* Track whether config is already set on this instance of DOMPurify. */
  let SET_CONFIG = false;
  /* Decide if all elements (e.g. style, script) must be children of
   * document.body. By default, browsers might move them to document.head */
  let FORCE_BODY = false;
  /* Decide if a DOM `HTMLBodyElement` should be returned, instead of a html
   * string (or a TrustedHTML object if Trusted Types are supported).
   * If `WHOLE_DOCUMENT` is enabled a `HTMLHtmlElement` will be returned instead
   */
  let RETURN_DOM = false;
  /* Decide if a DOM `DocumentFragment` should be returned, instead of a html
   * string  (or a TrustedHTML object if Trusted Types are supported) */
  let RETURN_DOM_FRAGMENT = false;
  /* Try to return a Trusted Type object instead of a string, return a string in
   * case Trusted Types are not supported  */
  let RETURN_TRUSTED_TYPE = false;
  /* Output should be free from DOM clobbering attacks?
   * This sanitizes markups named with colliding, clobberable built-in DOM APIs.
   */
  let SANITIZE_DOM = true;
  /* Achieve full DOM Clobbering protection by isolating the namespace of named
   * properties and JS variables, mitigating attacks that abuse the HTML/DOM spec rules.
   *
   * HTML/DOM spec rules that enable DOM Clobbering:
   *   - Named Access on Window (§7.3.3)
   *   - DOM Tree Accessors (§3.1.5)
   *   - Form Element Parent-Child Relations (§4.10.3)
   *   - Iframe srcdoc / Nested WindowProxies (§4.8.5)
   *   - HTMLCollection (§4.2.10.2)
   *
   * Namespace isolation is implemented by prefixing `id` and `name` attributes
   * with a constant string, i.e., `user-content-`
   */
  let SANITIZE_NAMED_PROPS = false;
  const SANITIZE_NAMED_PROPS_PREFIX = 'user-content-';
  /* Keep element content when removing element? */
  let KEEP_CONTENT = true;
  /* If a `Node` is passed to sanitize(), then performs sanitization in-place instead
   * of importing it into a new Document and returning a sanitized copy */
  let IN_PLACE = false;
  /* Allow usage of profiles like html, svg and mathMl */
  let USE_PROFILES = {};
  /* Tags to ignore content of when KEEP_CONTENT is true */
  let FORBID_CONTENTS = null;
  const DEFAULT_FORBID_CONTENTS = addToSet({}, ['annotation-xml', 'audio', 'colgroup', 'desc', 'foreignobject', 'head', 'iframe', 'math', 'mi', 'mn', 'mo', 'ms', 'mtext', 'noembed', 'noframes', 'noscript', 'plaintext', 'script', 'style', 'svg', 'template', 'thead', 'title', 'video', 'xmp']);
  /* Tags that are safe for data: URIs */
  let DATA_URI_TAGS = null;
  const DEFAULT_DATA_URI_TAGS = addToSet({}, ['audio', 'video', 'img', 'source', 'image', 'track']);
  /* Attributes safe for values like "javascript:" */
  let URI_SAFE_ATTRIBUTES = null;
  const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ['alt', 'class', 'for', 'id', 'label', 'name', 'pattern', 'placeholder', 'role', 'summary', 'title', 'value', 'style', 'xmlns']);
  const MATHML_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
  const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
  /* Document namespace */
  let NAMESPACE = HTML_NAMESPACE;
  let IS_EMPTY_INPUT = false;
  /* Allowed XHTML+XML namespaces */
  let ALLOWED_NAMESPACES = null;
  const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
  let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ['mi', 'mo', 'mn', 'ms', 'mtext']);
  let HTML_INTEGRATION_POINTS = addToSet({}, ['annotation-xml']);
  // Certain elements are allowed in both SVG and HTML
  // namespace. We need to specify them explicitly
  // so that they don't get erroneously deleted from
  // HTML namespace.
  const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ['title', 'style', 'font', 'a', 'script']);
  /* Parsing of strict XHTML documents */
  let PARSER_MEDIA_TYPE = null;
  const SUPPORTED_PARSER_MEDIA_TYPES = ['application/xhtml+xml', 'text/html'];
  const DEFAULT_PARSER_MEDIA_TYPE = 'text/html';
  let transformCaseFunc = null;
  /* Keep a reference to config to pass to hooks */
  let CONFIG = null;
  /* Ideally, do not touch anything below this line */
  /* ______________________________________________ */
  const formElement = document.createElement('form');
  const isRegexOrFunction = function isRegexOrFunction(testValue) {
    return testValue instanceof RegExp || testValue instanceof Function;
  };
  /**
   * _parseConfig
   *
   * @param cfg optional config literal
   */
  // eslint-disable-next-line complexity
  const _parseConfig = function _parseConfig() {
    let cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (CONFIG && CONFIG === cfg) {
      return;
    }
    /* Shield configuration object from tampering */
    if (!cfg || typeof cfg !== 'object') {
      cfg = {};
    }
    /* Shield configuration object from prototype pollution */
    cfg = clone(cfg);
    PARSER_MEDIA_TYPE =
    // eslint-disable-next-line unicorn/prefer-includes
    SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
    // HTML tags and attributes are not case-sensitive, converting to lowercase. Keeping XHTML as is.
    transformCaseFunc = PARSER_MEDIA_TYPE === 'application/xhtml+xml' ? stringToString : stringToLowerCase;
    /* Set configuration parameters */
    ALLOWED_TAGS = objectHasOwnProperty(cfg, 'ALLOWED_TAGS') ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
    ALLOWED_ATTR = objectHasOwnProperty(cfg, 'ALLOWED_ATTR') ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
    ALLOWED_NAMESPACES = objectHasOwnProperty(cfg, 'ALLOWED_NAMESPACES') ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
    URI_SAFE_ATTRIBUTES = objectHasOwnProperty(cfg, 'ADD_URI_SAFE_ATTR') ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR, transformCaseFunc) : DEFAULT_URI_SAFE_ATTRIBUTES;
    DATA_URI_TAGS = objectHasOwnProperty(cfg, 'ADD_DATA_URI_TAGS') ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS, transformCaseFunc) : DEFAULT_DATA_URI_TAGS;
    FORBID_CONTENTS = objectHasOwnProperty(cfg, 'FORBID_CONTENTS') ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
    FORBID_TAGS = objectHasOwnProperty(cfg, 'FORBID_TAGS') ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : clone({});
    FORBID_ATTR = objectHasOwnProperty(cfg, 'FORBID_ATTR') ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : clone({});
    USE_PROFILES = objectHasOwnProperty(cfg, 'USE_PROFILES') ? cfg.USE_PROFILES : false;
    ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false; // Default true
    ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false; // Default true
    ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false; // Default false
    ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false; // Default true
    SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false; // Default false
    SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false; // Default true
    WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false; // Default false
    RETURN_DOM = cfg.RETURN_DOM || false; // Default false
    RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false; // Default false
    RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false; // Default false
    FORCE_BODY = cfg.FORCE_BODY || false; // Default false
    SANITIZE_DOM = cfg.SANITIZE_DOM !== false; // Default true
    SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false; // Default false
    KEEP_CONTENT = cfg.KEEP_CONTENT !== false; // Default true
    IN_PLACE = cfg.IN_PLACE || false; // Default false
    IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI;
    NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
    MATHML_TEXT_INTEGRATION_POINTS = cfg.MATHML_TEXT_INTEGRATION_POINTS || MATHML_TEXT_INTEGRATION_POINTS;
    HTML_INTEGRATION_POINTS = cfg.HTML_INTEGRATION_POINTS || HTML_INTEGRATION_POINTS;
    CUSTOM_ELEMENT_HANDLING = cfg.CUSTOM_ELEMENT_HANDLING || {};
    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
    }
    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
    }
    if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === 'boolean') {
      CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
    }
    if (SAFE_FOR_TEMPLATES) {
      ALLOW_DATA_ATTR = false;
    }
    if (RETURN_DOM_FRAGMENT) {
      RETURN_DOM = true;
    }
    /* Parse profile info */
    if (USE_PROFILES) {
      ALLOWED_TAGS = addToSet({}, text);
      ALLOWED_ATTR = [];
      if (USE_PROFILES.html === true) {
        addToSet(ALLOWED_TAGS, html$1);
        addToSet(ALLOWED_ATTR, html);
      }
      if (USE_PROFILES.svg === true) {
        addToSet(ALLOWED_TAGS, svg$1);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.svgFilters === true) {
        addToSet(ALLOWED_TAGS, svgFilters);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.mathMl === true) {
        addToSet(ALLOWED_TAGS, mathMl$1);
        addToSet(ALLOWED_ATTR, mathMl);
        addToSet(ALLOWED_ATTR, xml);
      }
    }
    /* Merge configuration parameters */
    if (cfg.ADD_TAGS) {
      if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
        ALLOWED_TAGS = clone(ALLOWED_TAGS);
      }
      addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
    }
    if (cfg.ADD_ATTR) {
      if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
        ALLOWED_ATTR = clone(ALLOWED_ATTR);
      }
      addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
    }
    if (cfg.ADD_URI_SAFE_ATTR) {
      addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
    }
    if (cfg.FORBID_CONTENTS) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
        FORBID_CONTENTS = clone(FORBID_CONTENTS);
      }
      addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
    }
    /* Add #text in case KEEP_CONTENT is set to true */
    if (KEEP_CONTENT) {
      ALLOWED_TAGS['#text'] = true;
    }
    /* Add html, head and body to ALLOWED_TAGS in case WHOLE_DOCUMENT is true */
    if (WHOLE_DOCUMENT) {
      addToSet(ALLOWED_TAGS, ['html', 'head', 'body']);
    }
    /* Add tbody to ALLOWED_TAGS in case tables are permitted, see #286, #365 */
    if (ALLOWED_TAGS.table) {
      addToSet(ALLOWED_TAGS, ['tbody']);
      delete FORBID_TAGS.tbody;
    }
    if (cfg.TRUSTED_TYPES_POLICY) {
      if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== 'function') {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      }
      if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== 'function') {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      }
      // Overwrite existing TrustedTypes policy.
      trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
      // Sign local variables required by `sanitize`.
      emptyHTML = trustedTypesPolicy.createHTML('');
    } else {
      // Uninitialized policy, attempt to initialize the internal dompurify policy.
      if (trustedTypesPolicy === undefined) {
        trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
      }
      // If creating the internal policy succeeded sign internal variables.
      if (trustedTypesPolicy !== null && typeof emptyHTML === 'string') {
        emptyHTML = trustedTypesPolicy.createHTML('');
      }
    }
    // Prevent further manipulation of configuration.
    // Not available in IE8, Safari 5, etc.
    if (freeze) {
      freeze(cfg);
    }
    CONFIG = cfg;
  };
  /* Keep track of all possible SVG and MathML tags
   * so that we can perform the namespace checks
   * correctly. */
  const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
  const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
  /**
   * @param element a DOM element whose namespace is being checked
   * @returns Return false if the element has a
   *  namespace that a spec-compliant parser would never
   *  return. Return true otherwise.
   */
  const _checkValidNamespace = function _checkValidNamespace(element) {
    let parent = getParentNode(element);
    // In JSDOM, if we're inside shadow DOM, then parentNode
    // can be null. We just simulate parent in this case.
    if (!parent || !parent.tagName) {
      parent = {
        namespaceURI: NAMESPACE,
        tagName: 'template'
      };
    }
    const tagName = stringToLowerCase(element.tagName);
    const parentTagName = stringToLowerCase(parent.tagName);
    if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
      return false;
    }
    if (element.namespaceURI === SVG_NAMESPACE) {
      // The only way to switch from HTML namespace to SVG
      // is via <svg>. If it happens via any other tag, then
      // it should be killed.
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === 'svg';
      }
      // The only way to switch from MathML to SVG is via`
      // svg if parent is either <annotation-xml> or MathML
      // text integration points.
      if (parent.namespaceURI === MATHML_NAMESPACE) {
        return tagName === 'svg' && (parentTagName === 'annotation-xml' || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
      }
      // We only allow elements that are defined in SVG
      // spec. All others are disallowed in SVG namespace.
      return Boolean(ALL_SVG_TAGS[tagName]);
    }
    if (element.namespaceURI === MATHML_NAMESPACE) {
      // The only way to switch from HTML namespace to MathML
      // is via <math>. If it happens via any other tag, then
      // it should be killed.
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === 'math';
      }
      // The only way to switch from SVG to MathML is via
      // <math> and HTML integration points
      if (parent.namespaceURI === SVG_NAMESPACE) {
        return tagName === 'math' && HTML_INTEGRATION_POINTS[parentTagName];
      }
      // We only allow elements that are defined in MathML
      // spec. All others are disallowed in MathML namespace.
      return Boolean(ALL_MATHML_TAGS[tagName]);
    }
    if (element.namespaceURI === HTML_NAMESPACE) {
      // The only way to switch from SVG to HTML is via
      // HTML integration points, and from MathML to HTML
      // is via MathML text integration points
      if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      // We disallow tags that are specific for MathML
      // or SVG and should never appear in HTML namespace
      return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
    }
    // For XHTML and XML documents that support custom namespaces
    if (PARSER_MEDIA_TYPE === 'application/xhtml+xml' && ALLOWED_NAMESPACES[element.namespaceURI]) {
      return true;
    }
    // The code should never reach this place (this means
    // that the element somehow got namespace that is not
    // HTML, SVG, MathML or allowed via ALLOWED_NAMESPACES).
    // Return false just in case.
    return false;
  };
  /**
   * _forceRemove
   *
   * @param node a DOM node
   */
  const _forceRemove = function _forceRemove(node) {
    arrayPush(DOMPurify.removed, {
      element: node
    });
    try {
      // eslint-disable-next-line unicorn/prefer-dom-node-remove
      getParentNode(node).removeChild(node);
    } catch (_) {
      remove(node);
    }
  };
  /**
   * _removeAttribute
   *
   * @param name an Attribute name
   * @param element a DOM node
   */
  const _removeAttribute = function _removeAttribute(name, element) {
    try {
      arrayPush(DOMPurify.removed, {
        attribute: element.getAttributeNode(name),
        from: element
      });
    } catch (_) {
      arrayPush(DOMPurify.removed, {
        attribute: null,
        from: element
      });
    }
    element.removeAttribute(name);
    // We void attribute values for unremovable "is" attributes
    if (name === 'is') {
      if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
        try {
          _forceRemove(element);
        } catch (_) {}
      } else {
        try {
          element.setAttribute(name, '');
        } catch (_) {}
      }
    }
  };
  /**
   * _initDocument
   *
   * @param dirty - a string of dirty markup
   * @return a DOM, filled with the dirty markup
   */
  const _initDocument = function _initDocument(dirty) {
    /* Create a HTML document */
    let doc = null;
    let leadingWhitespace = null;
    if (FORCE_BODY) {
      dirty = '<remove></remove>' + dirty;
    } else {
      /* If FORCE_BODY isn't used, leading whitespace needs to be preserved manually */
      const matches = stringMatch(dirty, /^[\r\n\t ]+/);
      leadingWhitespace = matches && matches[0];
    }
    if (PARSER_MEDIA_TYPE === 'application/xhtml+xml' && NAMESPACE === HTML_NAMESPACE) {
      // Root of XHTML doc must contain xmlns declaration (see https://www.w3.org/TR/xhtml1/normative.html#strict)
      dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + '</body></html>';
    }
    const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
    /*
     * Use the DOMParser API by default, fallback later if needs be
     * DOMParser not work for svg when has multiple root element.
     */
    if (NAMESPACE === HTML_NAMESPACE) {
      try {
        doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
      } catch (_) {}
    }
    /* Use createHTMLDocument in case DOMParser is not available */
    if (!doc || !doc.documentElement) {
      doc = implementation.createDocument(NAMESPACE, 'template', null);
      try {
        doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
      } catch (_) {
        // Syntax error if dirtyPayload is invalid xml
      }
    }
    const body = doc.body || doc.documentElement;
    if (dirty && leadingWhitespace) {
      body.insertBefore(document.createTextNode(leadingWhitespace), body.childNodes[0] || null);
    }
    /* Work on whole document or just its body */
    if (NAMESPACE === HTML_NAMESPACE) {
      return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? 'html' : 'body')[0];
    }
    return WHOLE_DOCUMENT ? doc.documentElement : body;
  };
  /**
   * Creates a NodeIterator object that you can use to traverse filtered lists of nodes or elements in a document.
   *
   * @param root The root element or node to start traversing on.
   * @return The created NodeIterator
   */
  const _createNodeIterator = function _createNodeIterator(root) {
    return createNodeIterator.call(root.ownerDocument || root, root,
    // eslint-disable-next-line no-bitwise
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION, null);
  };
  /**
   * _isClobbered
   *
   * @param element element to check for clobbering attacks
   * @return true if clobbered, false if safe
   */
  const _isClobbered = function _isClobbered(element) {
    return element instanceof HTMLFormElement && (typeof element.nodeName !== 'string' || typeof element.textContent !== 'string' || typeof element.removeChild !== 'function' || !(element.attributes instanceof NamedNodeMap) || typeof element.removeAttribute !== 'function' || typeof element.setAttribute !== 'function' || typeof element.namespaceURI !== 'string' || typeof element.insertBefore !== 'function' || typeof element.hasChildNodes !== 'function');
  };
  /**
   * Checks whether the given object is a DOM node.
   *
   * @param value object to check whether it's a DOM node
   * @return true is object is a DOM node
   */
  const _isNode = function _isNode(value) {
    return typeof Node === 'function' && value instanceof Node;
  };
  function _executeHooks(hooks, currentNode, data) {
    arrayForEach(hooks, hook => {
      hook.call(DOMPurify, currentNode, data, CONFIG);
    });
  }
  /**
   * _sanitizeElements
   *
   * @protect nodeName
   * @protect textContent
   * @protect removeChild
   * @param currentNode to check for permission to exist
   * @return true if node was killed, false if left alive
   */
  const _sanitizeElements = function _sanitizeElements(currentNode) {
    let content = null;
    /* Execute a hook if present */
    _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
    /* Check if element is clobbered or can clobber */
    if (_isClobbered(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Now let's check the element's type and name */
    const tagName = transformCaseFunc(currentNode.nodeName);
    /* Execute a hook if present */
    _executeHooks(hooks.uponSanitizeElement, currentNode, {
      tagName,
      allowedTags: ALLOWED_TAGS
    });
    /* Detect mXSS attempts abusing namespace confusion */
    if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(/<[/\w!]/g, currentNode.innerHTML) && regExpTest(/<[/\w!]/g, currentNode.textContent)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Remove any occurrence of processing instructions */
    if (currentNode.nodeType === NODE_TYPE.progressingInstruction) {
      _forceRemove(currentNode);
      return true;
    }
    /* Remove any kind of possibly harmful comments */
    if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(/<[/\w]/g, currentNode.data)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Remove element if anything forbids its presence */
    if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
      /* Check if we have a custom element to handle */
      if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
          return false;
        }
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
          return false;
        }
      }
      /* Keep content except for bad-listed elements */
      if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
        const parentNode = getParentNode(currentNode) || currentNode.parentNode;
        const childNodes = getChildNodes(currentNode) || currentNode.childNodes;
        if (childNodes && parentNode) {
          const childCount = childNodes.length;
          for (let i = childCount - 1; i >= 0; --i) {
            const childClone = cloneNode(childNodes[i], true);
            childClone.__removalCount = (currentNode.__removalCount || 0) + 1;
            parentNode.insertBefore(childClone, getNextSibling(currentNode));
          }
        }
      }
      _forceRemove(currentNode);
      return true;
    }
    /* Check whether element has a valid namespace */
    if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Make sure that older browsers don't get fallback-tag mXSS */
    if ((tagName === 'noscript' || tagName === 'noembed' || tagName === 'noframes') && regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Sanitize element content to be template-safe */
    if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
      /* Get the element's text content */
      content = currentNode.textContent;
      arrayForEach([MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR], expr => {
        content = stringReplace(content, expr, ' ');
      });
      if (currentNode.textContent !== content) {
        arrayPush(DOMPurify.removed, {
          element: currentNode.cloneNode()
        });
        currentNode.textContent = content;
      }
    }
    /* Execute a hook if present */
    _executeHooks(hooks.afterSanitizeElements, currentNode, null);
    return false;
  };
  /**
   * _isValidAttribute
   *
   * @param lcTag Lowercase tag name of containing element.
   * @param lcName Lowercase attribute name.
   * @param value Attribute value.
   * @return Returns true if `value` is valid, otherwise false.
   */
  // eslint-disable-next-line complexity
  const _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
    /* Make sure attribute cannot clobber */
    if (SANITIZE_DOM && (lcName === 'id' || lcName === 'name') && (value in document || value in formElement)) {
      return false;
    }
    /* Allow valid data-* attributes: At least one character after "-"
        (https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
        XML-compatible (https://html.spec.whatwg.org/multipage/infrastructure.html#xml-compatible and http://www.w3.org/TR/xml/#d0e804)
        We don't need to check the value; it's always URI safe. */
    if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR, lcName)) ; else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR, lcName)) ; else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
      if (
      // First condition does a very basic check if a) it's basically a valid custom element tagname AND
      // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
      // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
      _isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName, lcTag)) ||
      // Alternative, second condition checks if it's an `is`-attribute, AND
      // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
      lcName === 'is' && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))) ; else {
        return false;
      }
      /* Check value is safe. First, is attr inert? If so, is safe */
    } else if (URI_SAFE_ATTRIBUTES[lcName]) ; else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE, ''))) ; else if ((lcName === 'src' || lcName === 'xlink:href' || lcName === 'href') && lcTag !== 'script' && stringIndexOf(value, 'data:') === 0 && DATA_URI_TAGS[lcTag]) ; else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA, stringReplace(value, ATTR_WHITESPACE, ''))) ; else if (value) {
      return false;
    } else ;
    return true;
  };
  /**
   * _isBasicCustomElement
   * checks if at least one dash is included in tagName, and it's not the first char
   * for more sophisticated checking see https://github.com/sindresorhus/validate-element-name
   *
   * @param tagName name of the tag of the node to sanitize
   * @returns Returns true if the tag name meets the basic criteria for a custom element, otherwise false.
   */
  const _isBasicCustomElement = function _isBasicCustomElement(tagName) {
    return tagName !== 'annotation-xml' && stringMatch(tagName, CUSTOM_ELEMENT);
  };
  /**
   * _sanitizeAttributes
   *
   * @protect attributes
   * @protect nodeName
   * @protect removeAttribute
   * @protect setAttribute
   *
   * @param currentNode to sanitize
   */
  const _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
    /* Execute a hook if present */
    _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
    const {
      attributes
    } = currentNode;
    /* Check if we have attributes; if not we might have a text node */
    if (!attributes || _isClobbered(currentNode)) {
      return;
    }
    const hookEvent = {
      attrName: '',
      attrValue: '',
      keepAttr: true,
      allowedAttributes: ALLOWED_ATTR,
      forceKeepAttr: undefined
    };
    let l = attributes.length;
    /* Go backwards over all attributes; safely remove bad ones */
    while (l--) {
      const attr = attributes[l];
      const {
        name,
        namespaceURI,
        value: attrValue
      } = attr;
      const lcName = transformCaseFunc(name);
      const initValue = attrValue;
      let value = name === 'value' ? initValue : stringTrim(initValue);
      /* Execute a hook if present */
      hookEvent.attrName = lcName;
      hookEvent.attrValue = value;
      hookEvent.keepAttr = true;
      hookEvent.forceKeepAttr = undefined; // Allows developers to see this is a property they can set
      _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
      value = hookEvent.attrValue;
      /* Full DOM Clobbering protection via namespace isolation,
       * Prefix id and name attributes with `user-content-`
       */
      if (SANITIZE_NAMED_PROPS && (lcName === 'id' || lcName === 'name')) {
        // Remove the attribute with this value
        _removeAttribute(name, currentNode);
        // Prefix the value and later re-create the attribute with the sanitized value
        value = SANITIZE_NAMED_PROPS_PREFIX + value;
      }
      /* Work around a security issue with comments inside attributes */
      if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|title|textarea)/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Make sure we cannot easily use animated hrefs, even if animations are allowed */
      if (lcName === 'attributename' && stringMatch(value, 'href')) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Did the hooks approve of the attribute? */
      if (hookEvent.forceKeepAttr) {
        continue;
      }
      /* Did the hooks approve of the attribute? */
      if (!hookEvent.keepAttr) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Work around a security issue in jQuery 3.0 */
      if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Sanitize attribute content to be template-safe */
      if (SAFE_FOR_TEMPLATES) {
        arrayForEach([MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR], expr => {
          value = stringReplace(value, expr, ' ');
        });
      }
      /* Is `value` valid for this attribute? */
      const lcTag = transformCaseFunc(currentNode.nodeName);
      if (!_isValidAttribute(lcTag, lcName, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Handle attributes that require Trusted Types */
      if (trustedTypesPolicy && typeof trustedTypes === 'object' && typeof trustedTypes.getAttributeType === 'function') {
        if (namespaceURI) ; else {
          switch (trustedTypes.getAttributeType(lcTag, lcName)) {
            case 'TrustedHTML':
              {
                value = trustedTypesPolicy.createHTML(value);
                break;
              }
            case 'TrustedScriptURL':
              {
                value = trustedTypesPolicy.createScriptURL(value);
                break;
              }
          }
        }
      }
      /* Handle invalid data-* attribute set by try-catching it */
      if (value !== initValue) {
        try {
          if (namespaceURI) {
            currentNode.setAttributeNS(namespaceURI, name, value);
          } else {
            /* Fallback to setAttribute() for browser-unrecognized namespaces e.g. "x-schema". */
            currentNode.setAttribute(name, value);
          }
          if (_isClobbered(currentNode)) {
            _forceRemove(currentNode);
          } else {
            arrayPop(DOMPurify.removed);
          }
        } catch (_) {
          _removeAttribute(name, currentNode);
        }
      }
    }
    /* Execute a hook if present */
    _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
  };
  /**
   * _sanitizeShadowDOM
   *
   * @param fragment to iterate over recursively
   */
  const _sanitizeShadowDOM = function _sanitizeShadowDOM(fragment) {
    let shadowNode = null;
    const shadowIterator = _createNodeIterator(fragment);
    /* Execute a hook if present */
    _executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
    while (shadowNode = shadowIterator.nextNode()) {
      /* Execute a hook if present */
      _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
      /* Sanitize tags and elements */
      _sanitizeElements(shadowNode);
      /* Check attributes next */
      _sanitizeAttributes(shadowNode);
      /* Deep shadow DOM detected */
      if (shadowNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM(shadowNode.content);
      }
    }
    /* Execute a hook if present */
    _executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
  };
  // eslint-disable-next-line complexity
  DOMPurify.sanitize = function (dirty) {
    let cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let body = null;
    let importedNode = null;
    let currentNode = null;
    let returnNode = null;
    /* Make sure we have a string to sanitize.
      DO NOT return early, as this will return the wrong type if
      the user has requested a DOM object rather than a string */
    IS_EMPTY_INPUT = !dirty;
    if (IS_EMPTY_INPUT) {
      dirty = '<!-->';
    }
    /* Stringify, in case dirty is an object */
    if (typeof dirty !== 'string' && !_isNode(dirty)) {
      if (typeof dirty.toString === 'function') {
        dirty = dirty.toString();
        if (typeof dirty !== 'string') {
          throw typeErrorCreate('dirty is not a string, aborting');
        }
      } else {
        throw typeErrorCreate('toString is not a function');
      }
    }
    /* Return dirty HTML if DOMPurify cannot run */
    if (!DOMPurify.isSupported) {
      return dirty;
    }
    /* Assign config vars */
    if (!SET_CONFIG) {
      _parseConfig(cfg);
    }
    /* Clean up removed elements */
    DOMPurify.removed = [];
    /* Check if dirty is correctly typed for IN_PLACE */
    if (typeof dirty === 'string') {
      IN_PLACE = false;
    }
    if (IN_PLACE) {
      /* Do some early pre-sanitization to avoid unsafe root nodes */
      if (dirty.nodeName) {
        const tagName = transformCaseFunc(dirty.nodeName);
        if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
          throw typeErrorCreate('root node is forbidden and cannot be sanitized in-place');
        }
      }
    } else if (dirty instanceof Node) {
      /* If dirty is a DOM element, append to an empty document to avoid
         elements being stripped by the parser */
      body = _initDocument('<!---->');
      importedNode = body.ownerDocument.importNode(dirty, true);
      if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === 'BODY') {
        /* Node is already a body, use as is */
        body = importedNode;
      } else if (importedNode.nodeName === 'HTML') {
        body = importedNode;
      } else {
        // eslint-disable-next-line unicorn/prefer-dom-node-append
        body.appendChild(importedNode);
      }
    } else {
      /* Exit directly if we have nothing to do */
      if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT &&
      // eslint-disable-next-line unicorn/prefer-includes
      dirty.indexOf('<') === -1) {
        return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
      }
      /* Initialize the document to work on */
      body = _initDocument(dirty);
      /* Check we have a DOM node from the data */
      if (!body) {
        return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : '';
      }
    }
    /* Remove first element node (ours) if FORCE_BODY is set */
    if (body && FORCE_BODY) {
      _forceRemove(body.firstChild);
    }
    /* Get node iterator */
    const nodeIterator = _createNodeIterator(IN_PLACE ? dirty : body);
    /* Now start iterating over the created document */
    while (currentNode = nodeIterator.nextNode()) {
      /* Sanitize tags and elements */
      _sanitizeElements(currentNode);
      /* Check attributes next */
      _sanitizeAttributes(currentNode);
      /* Shadow DOM detected, sanitize it */
      if (currentNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM(currentNode.content);
      }
    }
    /* If we sanitized `dirty` in-place, return it. */
    if (IN_PLACE) {
      return dirty;
    }
    /* Return sanitized string or DOM */
    if (RETURN_DOM) {
      if (RETURN_DOM_FRAGMENT) {
        returnNode = createDocumentFragment.call(body.ownerDocument);
        while (body.firstChild) {
          // eslint-disable-next-line unicorn/prefer-dom-node-append
          returnNode.appendChild(body.firstChild);
        }
      } else {
        returnNode = body;
      }
      if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
        /*
          AdoptNode() is not used because internal state is not reset
          (e.g. the past names map of a HTMLFormElement), this is safe
          in theory but we would rather not risk another attack vector.
          The state that is cloned by importNode() is explicitly defined
          by the specs.
        */
        returnNode = importNode.call(originalDocument, returnNode, true);
      }
      return returnNode;
    }
    let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
    /* Serialize doctype if allowed */
    if (WHOLE_DOCUMENT && ALLOWED_TAGS['!doctype'] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
      serializedHTML = '<!DOCTYPE ' + body.ownerDocument.doctype.name + '>\n' + serializedHTML;
    }
    /* Sanitize final string template-safe */
    if (SAFE_FOR_TEMPLATES) {
      arrayForEach([MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR], expr => {
        serializedHTML = stringReplace(serializedHTML, expr, ' ');
      });
    }
    return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
  };
  DOMPurify.setConfig = function () {
    let cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _parseConfig(cfg);
    SET_CONFIG = true;
  };
  DOMPurify.clearConfig = function () {
    CONFIG = null;
    SET_CONFIG = false;
  };
  DOMPurify.isValidAttribute = function (tag, attr, value) {
    /* Initialize shared config vars if necessary. */
    if (!CONFIG) {
      _parseConfig({});
    }
    const lcTag = transformCaseFunc(tag);
    const lcName = transformCaseFunc(attr);
    return _isValidAttribute(lcTag, lcName, value);
  };
  DOMPurify.addHook = function (entryPoint, hookFunction) {
    if (typeof hookFunction !== 'function') {
      return;
    }
    arrayPush(hooks[entryPoint], hookFunction);
  };
  DOMPurify.removeHook = function (entryPoint, hookFunction) {
    if (hookFunction !== undefined) {
      const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
      return index === -1 ? undefined : arraySplice(hooks[entryPoint], index, 1)[0];
    }
    return arrayPop(hooks[entryPoint]);
  };
  DOMPurify.removeHooks = function (entryPoint) {
    hooks[entryPoint] = [];
  };
  DOMPurify.removeAllHooks = function () {
    hooks = _createHooksMap();
  };
  return DOMPurify;
}
var purify = createDOMPurify();

export { purify as default };
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/dompurify/dompurify.license.txt]---
Location: vscode-main/src/vs/base/browser/dompurify/dompurify.license.txt

```text
DOMPurify
Copyright 2015 Mario Heiderich

DOMPurify is free software; you can redistribute it and/or modify it under the
terms of either:

a) the Apache License Version 2.0, or
b) the Mozilla Public License Version 2.0

-----------------------------------------------------------------------------

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

-----------------------------------------------------------------------------
Mozilla Public License, version 2.0

1. Definitions

1.1. “Contributor”

     means each individual or legal entity that creates, contributes to the
     creation of, or owns Covered Software.

1.2. “Contributor Version”

     means the combination of the Contributions of others (if any) used by a
     Contributor and that particular Contributor’s Contribution.

1.3. “Contribution”

     means Covered Software of a particular Contributor.

1.4. “Covered Software”

     means Source Code Form to which the initial Contributor has attached the
     notice in Exhibit A, the Executable Form of such Source Code Form, and
     Modifications of such Source Code Form, in each case including portions
     thereof.

1.5. “Incompatible With Secondary Licenses”
     means

     a. that the initial Contributor has attached the notice described in
        Exhibit B to the Covered Software; or

     b. that the Covered Software was made available under the terms of version
        1.1 or earlier of the License, but not also under the terms of a
        Secondary License.

1.6. “Executable Form”

     means any form of the work other than Source Code Form.

1.7. “Larger Work”

     means a work that combines Covered Software with other material, in a separate
     file or files, that is not Covered Software.

1.8. “License”

     means this document.

1.9. “Licensable”

     means having the right to grant, to the maximum extent possible, whether at the
     time of the initial grant or subsequently, any and all of the rights conveyed by
     this License.

1.10. “Modifications”

     means any of the following:

     a. any file in Source Code Form that results from an addition to, deletion
        from, or modification of the contents of Covered Software; or

     b. any new file in Source Code Form that contains any Covered Software.

1.11. “Patent Claims” of a Contributor

      means any patent claim(s), including without limitation, method, process,
      and apparatus claims, in any patent Licensable by such Contributor that
      would be infringed, but for the grant of the License, by the making,
      using, selling, offering for sale, having made, import, or transfer of
      either its Contributions or its Contributor Version.

1.12. “Secondary License”

      means either the GNU General Public License, Version 2.0, the GNU Lesser
      General Public License, Version 2.1, the GNU Affero General Public
      License, Version 3.0, or any later versions of those licenses.

1.13. “Source Code Form”

      means the form of the work preferred for making modifications.

1.14. “You” (or “Your”)

      means an individual or a legal entity exercising rights under this
      License. For legal entities, “You” includes any entity that controls, is
      controlled by, or is under common control with You. For purposes of this
      definition, “control” means (a) the power, direct or indirect, to cause
      the direction or management of such entity, whether by contract or
      otherwise, or (b) ownership of more than fifty percent (50%) of the
      outstanding shares or beneficial ownership of such entity.


2. License Grants and Conditions

2.1. Grants

     Each Contributor hereby grants You a world-wide, royalty-free,
     non-exclusive license:

     a. under intellectual property rights (other than patent or trademark)
        Licensable by such Contributor to use, reproduce, make available,
        modify, display, perform, distribute, and otherwise exploit its
        Contributions, either on an unmodified basis, with Modifications, or as
        part of a Larger Work; and

     b. under Patent Claims of such Contributor to make, use, sell, offer for
        sale, have made, import, and otherwise transfer either its Contributions
        or its Contributor Version.

2.2. Effective Date

     The licenses granted in Section 2.1 with respect to any Contribution become
     effective for each Contribution on the date the Contributor first distributes
     such Contribution.

2.3. Limitations on Grant Scope

     The licenses granted in this Section 2 are the only rights granted under this
     License. No additional rights or licenses will be implied from the distribution
     or licensing of Covered Software under this License. Notwithstanding Section
     2.1(b) above, no patent license is granted by a Contributor:

     a. for any code that a Contributor has removed from Covered Software; or

     b. for infringements caused by: (i) Your and any other third party’s
        modifications of Covered Software, or (ii) the combination of its
        Contributions with other software (except as part of its Contributor
        Version); or

     c. under Patent Claims infringed by Covered Software in the absence of its
        Contributions.

     This License does not grant any rights in the trademarks, service marks, or
     logos of any Contributor (except as may be necessary to comply with the
     notice requirements in Section 3.4).

2.4. Subsequent Licenses

     No Contributor makes additional grants as a result of Your choice to
     distribute the Covered Software under a subsequent version of this License
     (see Section 10.2) or under the terms of a Secondary License (if permitted
     under the terms of Section 3.3).

2.5. Representation

     Each Contributor represents that the Contributor believes its Contributions
     are its original creation(s) or it has sufficient rights to grant the
     rights to its Contributions conveyed by this License.

2.6. Fair Use

     This License is not intended to limit any rights You have under applicable
     copyright doctrines of fair use, fair dealing, or other equivalents.

2.7. Conditions

     Sections 3.1, 3.2, 3.3, and 3.4 are conditions of the licenses granted in
     Section 2.1.


3. Responsibilities

3.1. Distribution of Source Form

     All distribution of Covered Software in Source Code Form, including any
     Modifications that You create or to which You contribute, must be under the
     terms of this License. You must inform recipients that the Source Code Form
     of the Covered Software is governed by the terms of this License, and how
     they can obtain a copy of this License. You may not attempt to alter or
     restrict the recipients’ rights in the Source Code Form.

3.2. Distribution of Executable Form

     If You distribute Covered Software in Executable Form then:

     a. such Covered Software must also be made available in Source Code Form,
        as described in Section 3.1, and You must inform recipients of the
        Executable Form how they can obtain a copy of such Source Code Form by
        reasonable means in a timely manner, at a charge no more than the cost
        of distribution to the recipient; and

     b. You may distribute such Executable Form under the terms of this License,
        or sublicense it under different terms, provided that the license for
        the Executable Form does not attempt to limit or alter the recipients’
        rights in the Source Code Form under this License.

3.3. Distribution of a Larger Work

     You may create and distribute a Larger Work under terms of Your choice,
     provided that You also comply with the requirements of this License for the
     Covered Software. If the Larger Work is a combination of Covered Software
     with a work governed by one or more Secondary Licenses, and the Covered
     Software is not Incompatible With Secondary Licenses, this License permits
     You to additionally distribute such Covered Software under the terms of
     such Secondary License(s), so that the recipient of the Larger Work may, at
     their option, further distribute the Covered Software under the terms of
     either this License or such Secondary License(s).

3.4. Notices

     You may not remove or alter the substance of any license notices (including
     copyright notices, patent notices, disclaimers of warranty, or limitations
     of liability) contained within the Source Code Form of the Covered
     Software, except that You may alter any license notices to the extent
     required to remedy known factual inaccuracies.

3.5. Application of Additional Terms

     You may choose to offer, and to charge a fee for, warranty, support,
     indemnity or liability obligations to one or more recipients of Covered
     Software. However, You may do so only on Your own behalf, and not on behalf
     of any Contributor. You must make it absolutely clear that any such
     warranty, support, indemnity, or liability obligation is offered by You
     alone, and You hereby agree to indemnify every Contributor for any
     liability incurred by such Contributor as a result of warranty, support,
     indemnity or liability terms You offer. You may include additional
     disclaimers of warranty and limitations of liability specific to any
     jurisdiction.

4. Inability to Comply Due to Statute or Regulation

   If it is impossible for You to comply with any of the terms of this License
   with respect to some or all of the Covered Software due to statute, judicial
   order, or regulation then You must: (a) comply with the terms of this License
   to the maximum extent possible; and (b) describe the limitations and the code
   they affect. Such description must be placed in a text file included with all
   distributions of the Covered Software under this License. Except to the
   extent prohibited by statute or regulation, such description must be
   sufficiently detailed for a recipient of ordinary skill to be able to
   understand it.

5. Termination

5.1. The rights granted under this License will terminate automatically if You
     fail to comply with any of its terms. However, if You become compliant,
     then the rights granted under this License from a particular Contributor
     are reinstated (a) provisionally, unless and until such Contributor
     explicitly and finally terminates Your grants, and (b) on an ongoing basis,
     if such Contributor fails to notify You of the non-compliance by some
     reasonable means prior to 60 days after You have come back into compliance.
     Moreover, Your grants from a particular Contributor are reinstated on an
     ongoing basis if such Contributor notifies You of the non-compliance by
     some reasonable means, this is the first time You have received notice of
     non-compliance with this License from such Contributor, and You become
     compliant prior to 30 days after Your receipt of the notice.

5.2. If You initiate litigation against any entity by asserting a patent
     infringement claim (excluding declaratory judgment actions, counter-claims,
     and cross-claims) alleging that a Contributor Version directly or
     indirectly infringes any patent, then the rights granted to You by any and
     all Contributors for the Covered Software under Section 2.1 of this License
     shall terminate.

5.3. In the event of termination under Sections 5.1 or 5.2 above, all end user
     license agreements (excluding distributors and resellers) which have been
     validly granted by You or Your distributors under this License prior to
     termination shall survive termination.

6. Disclaimer of Warranty

   Covered Software is provided under this License on an “as is” basis, without
   warranty of any kind, either expressed, implied, or statutory, including,
   without limitation, warranties that the Covered Software is free of defects,
   merchantable, fit for a particular purpose or non-infringing. The entire
   risk as to the quality and performance of the Covered Software is with You.
   Should any Covered Software prove defective in any respect, You (not any
   Contributor) assume the cost of any necessary servicing, repair, or
   correction. This disclaimer of warranty constitutes an essential part of this
   License. No use of  any Covered Software is authorized under this License
   except under this disclaimer.

7. Limitation of Liability

   Under no circumstances and under no legal theory, whether tort (including
   negligence), contract, or otherwise, shall any Contributor, or anyone who
   distributes Covered Software as permitted above, be liable to You for any
   direct, indirect, special, incidental, or consequential damages of any
   character including, without limitation, damages for lost profits, loss of
   goodwill, work stoppage, computer failure or malfunction, or any and all
   other commercial damages or losses, even if such party shall have been
   informed of the possibility of such damages. This limitation of liability
   shall not apply to liability for death or personal injury resulting from such
   party’s negligence to the extent applicable law prohibits such limitation.
   Some jurisdictions do not allow the exclusion or limitation of incidental or
   consequential damages, so this exclusion and limitation may not apply to You.

8. Litigation

   Any litigation relating to this License may be brought only in the courts of
   a jurisdiction where the defendant maintains its principal place of business
   and such litigation shall be governed by laws of that jurisdiction, without
   reference to its conflict-of-law provisions. Nothing in this Section shall
   prevent a party’s ability to bring cross-claims or counter-claims.

9. Miscellaneous

   This License represents the complete agreement concerning the subject matter
   hereof. If any provision of this License is held to be unenforceable, such
   provision shall be reformed only to the extent necessary to make it
   enforceable. Any law or regulation which provides that the language of a
   contract shall be construed against the drafter shall not be used to construe
   this License against a Contributor.


10. Versions of the License

10.1. New Versions

      Mozilla Foundation is the license steward. Except as provided in Section
      10.3, no one other than the license steward has the right to modify or
      publish new versions of this License. Each version will be given a
      distinguishing version number.

10.2. Effect of New Versions

      You may distribute the Covered Software under the terms of the version of
      the License under which You originally received the Covered Software, or
      under the terms of any subsequent version published by the license
      steward.

10.3. Modified Versions

      If you create software not governed by this License, and you want to
      create a new license for such software, you may create and use a modified
      version of this License if you rename the license and remove any
      references to the name of the license steward (except to note that such
      modified license differs from this License).

10.4. Distributing Source Code Form that is Incompatible With Secondary Licenses
      If You choose to distribute Source Code Form that is Incompatible With
      Secondary Licenses under the terms of this version of the License, the
      notice described in Exhibit B of this License must be attached.

Exhibit A - Source Code Form License Notice

      This Source Code Form is subject to the
      terms of the Mozilla Public License, v.
      2.0. If a copy of the MPL was not
      distributed with this file, You can
      obtain one at
      http://mozilla.org/MPL/2.0/.

If it is not possible or desirable to put the notice in a particular file, then
You may include the notice in a location (such as a LICENSE file in a relevant
directory) where a recipient would be likely to look for such a notice.

You may add additional accurate notices of copyright ownership.

Exhibit B - “Incompatible With Secondary Licenses” Notice

      This Source Code Form is “Incompatible
      With Secondary Licenses”, as defined by
      the Mozilla Public License, v. 2.0.
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/widget.ts]---
Location: vscode-main/src/vs/base/browser/ui/widget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../dom.js';
import { IKeyboardEvent, StandardKeyboardEvent } from '../keyboardEvent.js';
import { IMouseEvent, StandardMouseEvent } from '../mouseEvent.js';
import { Gesture } from '../touch.js';
import { Disposable, IDisposable } from '../../common/lifecycle.js';

export abstract class Widget extends Disposable {

	protected onclick(domNode: HTMLElement, listener: (e: IMouseEvent) => void): void {
		this._register(dom.addDisposableListener(domNode, dom.EventType.CLICK, (e: MouseEvent) => listener(new StandardMouseEvent(dom.getWindow(domNode), e))));
	}

	protected onmousedown(domNode: HTMLElement, listener: (e: IMouseEvent) => void): void {
		this._register(dom.addDisposableListener(domNode, dom.EventType.MOUSE_DOWN, (e: MouseEvent) => listener(new StandardMouseEvent(dom.getWindow(domNode), e))));
	}

	protected onmouseover(domNode: HTMLElement, listener: (e: IMouseEvent) => void): void {
		this._register(dom.addDisposableListener(domNode, dom.EventType.MOUSE_OVER, (e: MouseEvent) => listener(new StandardMouseEvent(dom.getWindow(domNode), e))));
	}

	protected onmouseleave(domNode: HTMLElement, listener: (e: IMouseEvent) => void): void {
		this._register(dom.addDisposableListener(domNode, dom.EventType.MOUSE_LEAVE, (e: MouseEvent) => listener(new StandardMouseEvent(dom.getWindow(domNode), e))));
	}

	protected onkeydown(domNode: HTMLElement, listener: (e: IKeyboardEvent) => void): void {
		this._register(dom.addDisposableListener(domNode, dom.EventType.KEY_DOWN, (e: KeyboardEvent) => listener(new StandardKeyboardEvent(e))));
	}

	protected onkeyup(domNode: HTMLElement, listener: (e: IKeyboardEvent) => void): void {
		this._register(dom.addDisposableListener(domNode, dom.EventType.KEY_UP, (e: KeyboardEvent) => listener(new StandardKeyboardEvent(e))));
	}

	protected oninput(domNode: HTMLElement, listener: (e: Event) => void): void {
		this._register(dom.addDisposableListener(domNode, dom.EventType.INPUT, listener));
	}

	protected onblur(domNode: HTMLElement, listener: (e: Event) => void): void {
		this._register(dom.addDisposableListener(domNode, dom.EventType.BLUR, listener));
	}

	protected onfocus(domNode: HTMLElement, listener: (e: Event) => void): void {
		this._register(dom.addDisposableListener(domNode, dom.EventType.FOCUS, listener));
	}

	protected onchange(domNode: HTMLElement, listener: (e: Event) => void): void {
		this._register(dom.addDisposableListener(domNode, dom.EventType.CHANGE, listener));
	}

	protected ignoreGesture(domNode: HTMLElement): IDisposable {
		return Gesture.ignoreTarget(domNode);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/actionbar/actionbar.css]---
Location: vscode-main/src/vs/base/browser/ui/actionbar/actionbar.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-action-bar {
	white-space: nowrap;
	height: 100%;
}

.monaco-action-bar .actions-container {
	display: flex;
	margin: 0 auto;
	padding: 0;
	height: 100%;
	width: 100%;
	align-items: center;
}

.monaco-action-bar.vertical .actions-container {
	display: inline-block;
}

.monaco-action-bar .action-item {
	display: block;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	position: relative;  /* DO NOT REMOVE - this is the key to preventing the ghosting icon bug in Chrome 42 */
}

.monaco-action-bar .action-item.disabled {
	cursor: default;
}

.monaco-action-bar .action-item .icon,
.monaco-action-bar .action-item .codicon {
	display: block;
}

.monaco-action-bar .action-item .codicon {
	display: flex;
	align-items: center;
	width: 16px;
	height: 16px;
}

.monaco-action-bar .action-label {
	display: flex;
	font-size: 11px;
	padding: 3px;
	border-radius: 5px;
}

.monaco-action-bar .action-item.disabled .action-label:not(.icon) ,
.monaco-action-bar .action-item.disabled .action-label:not(.icon)::before,
.monaco-action-bar .action-item.disabled .action-label:not(.icon):hover {
	color: var(--vscode-disabledForeground);
}

/* Unable to change color of SVGs, hence opacity is used */
.monaco-action-bar .action-item.disabled .action-label.icon ,
.monaco-action-bar .action-item.disabled .action-label.icon::before,
.monaco-action-bar .action-item.disabled .action-label.icon:hover {
	opacity: 0.6;
}

/* Vertical actions */

.monaco-action-bar.vertical {
	text-align: left;
}

.monaco-action-bar.vertical .action-item {
	display: block;
}

.monaco-action-bar.vertical .action-label.separator {
	display: block;
	border-bottom: 1px solid var(--vscode-disabledForeground);
	padding-top: 1px;
	margin-left: .8em;
	margin-right: .8em;
}

.monaco-action-bar .action-item .action-label.separator {
	width: 1px;
	height: 16px;
	margin: 5px 4px !important;
	cursor: default;
	min-width: 1px;
	padding: 0;
	background-color: var(--vscode-disabledForeground);
}

.secondary-actions .monaco-action-bar .action-label {
	margin-left: 6px;
}

/* Action Items */
.monaco-action-bar .action-item.select-container {
	overflow: hidden; /* somehow the dropdown overflows its container, we prevent it here to not push */
	flex: 1;
	max-width: 170px;
	min-width: 60px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 10px;
}

.monaco-action-bar .action-item.action-dropdown-item {
	display: flex;
}

.monaco-action-bar .action-item.action-dropdown-item > .action-dropdown-item-separator {
	display: flex;
	align-items: center;
	cursor: default;
}

.monaco-action-bar .action-item.action-dropdown-item > .action-dropdown-item-separator > div {
	width: 1px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/actionbar/actionbar.ts]---
Location: vscode-main/src/vs/base/browser/ui/actionbar/actionbar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../dom.js';
import { StandardKeyboardEvent } from '../../keyboardEvent.js';
import { ActionViewItem, BaseActionViewItem, IActionViewItemOptions } from './actionViewItems.js';
import { createInstantHoverDelegate } from '../hover/hoverDelegateFactory.js';
import { IHoverDelegate } from '../hover/hoverDelegate.js';
import { ActionRunner, IAction, IActionRunner, IRunEvent, Separator } from '../../../common/actions.js';
import { Emitter } from '../../../common/event.js';
import { KeyCode, KeyMod } from '../../../common/keyCodes.js';
import { Disposable, DisposableMap, DisposableStore, dispose, IDisposable } from '../../../common/lifecycle.js';
import * as types from '../../../common/types.js';
import './actionbar.css';

export interface IActionViewItem extends IDisposable {
	action: IAction;
	actionRunner: IActionRunner;
	setActionContext(context: unknown): void;
	render(element: HTMLElement): void;
	isEnabled(): boolean;
	focus(fromRight?: boolean): void; // TODO@isidorn what is this?
	blur(): void;
	showHover?(): void;
}

export interface IActionViewItemProvider {
	(action: IAction, options: IActionViewItemOptions): IActionViewItem | undefined;
}

export const enum ActionsOrientation {
	HORIZONTAL,
	VERTICAL,
}

export interface ActionTrigger {
	keys?: KeyCode[];
	keyDown: boolean;
}

export interface IActionBarOptions {
	readonly orientation?: ActionsOrientation;
	readonly context?: unknown;
	readonly actionViewItemProvider?: IActionViewItemProvider;
	readonly actionRunner?: IActionRunner;
	readonly ariaLabel?: string;
	readonly ariaRole?: string;
	readonly triggerKeys?: ActionTrigger;
	readonly allowContextMenu?: boolean;
	readonly preventLoopNavigation?: boolean;
	readonly focusOnlyEnabledItems?: boolean;
	readonly hoverDelegate?: IHoverDelegate;
	/**
	 * If true, toggled primary items are highlighted with a background color.
	 * Some action bars exclusively use icon states, we don't want to enable this for them.
	 * Thus, this is opt-in.
	 */
	readonly highlightToggledItems?: boolean;
}

export interface IActionOptions extends IActionViewItemOptions {
	index?: number;
}

export class ActionBar extends Disposable implements IActionRunner {

	private readonly options: IActionBarOptions;
	private readonly _hoverDelegate: IHoverDelegate;

	private _actionRunner: IActionRunner;
	private readonly _actionRunnerDisposables = this._register(new DisposableStore());
	private _context: unknown;
	private readonly _orientation: ActionsOrientation;
	private readonly _triggerKeys: {
		keys: KeyCode[];
		keyDown: boolean;
	};

	// View Items
	viewItems: IActionViewItem[];
	private readonly viewItemDisposables = this._register(new DisposableMap<IActionViewItem>());
	private previouslyFocusedItem?: number;
	protected focusedItem?: number;
	private focusTracker: DOM.IFocusTracker;

	// Trigger Key Tracking
	private triggerKeyDown: boolean = false;

	private focusable: boolean = true;

	// Elements
	domNode: HTMLElement;
	protected readonly actionsList: HTMLElement;

	private readonly _onDidBlur = this._register(new Emitter<void>());
	get onDidBlur() { return this._onDidBlur.event; }

	private readonly _onDidCancel = this._register(new Emitter<void>({ onWillAddFirstListener: () => this.cancelHasListener = true }));
	get onDidCancel() { return this._onDidCancel.event; }
	private cancelHasListener = false;

	private readonly _onDidRun = this._register(new Emitter<IRunEvent>());
	get onDidRun() { return this._onDidRun.event; }

	private readonly _onWillRun = this._register(new Emitter<IRunEvent>());
	get onWillRun() { return this._onWillRun.event; }

	constructor(container: HTMLElement, options: IActionBarOptions = {}) {
		super();

		this.options = options;
		this._context = options.context ?? null;
		this._orientation = this.options.orientation ?? ActionsOrientation.HORIZONTAL;
		this._triggerKeys = {
			keyDown: this.options.triggerKeys?.keyDown ?? false,
			keys: this.options.triggerKeys?.keys ?? [KeyCode.Enter, KeyCode.Space]
		};

		this._hoverDelegate = options.hoverDelegate ?? this._register(createInstantHoverDelegate());

		if (this.options.actionRunner) {
			this._actionRunner = this.options.actionRunner;
		} else {
			this._actionRunner = new ActionRunner();
			this._actionRunnerDisposables.add(this._actionRunner);
		}

		this._actionRunnerDisposables.add(this._actionRunner.onDidRun(e => this._onDidRun.fire(e)));
		this._actionRunnerDisposables.add(this._actionRunner.onWillRun(e => this._onWillRun.fire(e)));

		this.viewItems = [];
		this.focusedItem = undefined;

		this.domNode = document.createElement('div');
		this.domNode.className = 'monaco-action-bar';

		let previousKeys: KeyCode[];
		let nextKeys: KeyCode[];

		switch (this._orientation) {
			case ActionsOrientation.HORIZONTAL:
				previousKeys = [KeyCode.LeftArrow];
				nextKeys = [KeyCode.RightArrow];
				break;
			case ActionsOrientation.VERTICAL:
				previousKeys = [KeyCode.UpArrow];
				nextKeys = [KeyCode.DownArrow];
				this.domNode.className += ' vertical';
				break;
		}

		this._register(DOM.addDisposableListener(this.domNode, DOM.EventType.KEY_DOWN, e => {
			const event = new StandardKeyboardEvent(e);
			let eventHandled = true;
			const focusedItem = typeof this.focusedItem === 'number' ? this.viewItems[this.focusedItem] : undefined;

			if (previousKeys && (event.equals(previousKeys[0]) || event.equals(previousKeys[1]))) {
				eventHandled = this.focusPrevious();
			} else if (nextKeys && (event.equals(nextKeys[0]) || event.equals(nextKeys[1]))) {
				eventHandled = this.focusNext();
			} else if (event.equals(KeyCode.Escape) && this.cancelHasListener) {
				this._onDidCancel.fire();
			} else if (event.equals(KeyCode.Home)) {
				eventHandled = this.focusFirst();
			} else if (event.equals(KeyCode.End)) {
				eventHandled = this.focusLast();
			} else if (event.equals(KeyCode.Tab) && focusedItem instanceof BaseActionViewItem && focusedItem.trapsArrowNavigation) {
				// Tab, so forcibly focus next #219199
				eventHandled = this.focusNext(undefined, true);
			} else if (this.isTriggerKeyEvent(event)) {
				// Staying out of the else branch even if not triggered
				if (this._triggerKeys.keyDown) {
					this.doTrigger(event);
				} else {
					this.triggerKeyDown = true;
				}
			} else {
				eventHandled = false;
			}

			if (eventHandled) {
				event.preventDefault();
				event.stopPropagation();
			}
		}));

		this._register(DOM.addDisposableListener(this.domNode, DOM.EventType.KEY_UP, e => {
			const event = new StandardKeyboardEvent(e);

			// Run action on Enter/Space
			if (this.isTriggerKeyEvent(event)) {
				if (!this._triggerKeys.keyDown && this.triggerKeyDown) {
					this.triggerKeyDown = false;
					this.doTrigger(event);
				}

				event.preventDefault();
				event.stopPropagation();
			}

			// Recompute focused item
			else if (event.equals(KeyCode.Tab) || event.equals(KeyMod.Shift | KeyCode.Tab) || event.equals(KeyCode.UpArrow) || event.equals(KeyCode.DownArrow) || event.equals(KeyCode.LeftArrow) || event.equals(KeyCode.RightArrow)) {
				this.updateFocusedItem();
			}
		}));

		this.focusTracker = this._register(DOM.trackFocus(this.domNode));
		this._register(this.focusTracker.onDidBlur(() => {
			if (DOM.getActiveElement() === this.domNode || !DOM.isAncestor(DOM.getActiveElement(), this.domNode)) {
				this._onDidBlur.fire();
				this.previouslyFocusedItem = this.focusedItem;
				this.focusedItem = undefined;
				this.triggerKeyDown = false;
			}
		}));

		this._register(this.focusTracker.onDidFocus(() => this.updateFocusedItem()));

		this.actionsList = document.createElement('ul');
		this.actionsList.className = 'actions-container';
		if (this.options.highlightToggledItems) {
			this.actionsList.classList.add('highlight-toggled');
		}
		this.actionsList.setAttribute('role', this.options.ariaRole || 'toolbar');

		if (this.options.ariaLabel) {
			this.actionsList.setAttribute('aria-label', this.options.ariaLabel);
		}

		this.domNode.appendChild(this.actionsList);

		container.appendChild(this.domNode);
	}

	private refreshRole(): void {
		if (this.length() >= 1) {
			this.actionsList.setAttribute('role', this.options.ariaRole || 'toolbar');
		} else {
			this.actionsList.setAttribute('role', 'presentation');
		}
	}

	setAriaLabel(label: string): void {
		if (label) {
			this.actionsList.setAttribute('aria-label', label);
		} else {
			this.actionsList.removeAttribute('aria-label');
		}
	}

	// Some action bars should not be focusable at times
	// When an action bar is not focusable make sure to make all the elements inside it not focusable
	// When an action bar is focusable again, make sure the first item can be focused
	setFocusable(focusable: boolean): void {
		this.focusable = focusable;
		if (this.focusable) {
			const firstEnabled = this.viewItems.find(vi => vi instanceof BaseActionViewItem && vi.isEnabled());
			if (firstEnabled instanceof BaseActionViewItem) {
				firstEnabled.setFocusable(true);
			}
		} else {
			this.viewItems.forEach(vi => {
				if (vi instanceof BaseActionViewItem) {
					vi.setFocusable(false);
				}
			});
		}
	}

	private isTriggerKeyEvent(event: StandardKeyboardEvent): boolean {
		let ret = false;
		this._triggerKeys.keys.forEach(keyCode => {
			ret = ret || event.equals(keyCode);
		});

		return ret;
	}

	private updateFocusedItem(): void {
		for (let i = 0; i < this.actionsList.children.length; i++) {
			const elem = this.actionsList.children[i];
			if (DOM.isAncestor(DOM.getActiveElement(), elem)) {
				this.focusedItem = i;
				this.viewItems[this.focusedItem]?.showHover?.();
				break;
			}
		}
	}

	get context(): unknown {
		return this._context;
	}

	set context(context: unknown) {
		this._context = context;
		this.viewItems.forEach(i => i.setActionContext(context));
	}

	get actionRunner(): IActionRunner {
		return this._actionRunner;
	}

	set actionRunner(actionRunner: IActionRunner) {
		this._actionRunner = actionRunner;

		// when setting a new `IActionRunner` make sure to dispose old listeners and
		// start to forward events from the new listener
		this._actionRunnerDisposables.clear();
		this._actionRunnerDisposables.add(this._actionRunner.onDidRun(e => this._onDidRun.fire(e)));
		this._actionRunnerDisposables.add(this._actionRunner.onWillRun(e => this._onWillRun.fire(e)));
		this.viewItems.forEach(item => item.actionRunner = actionRunner);
	}

	getContainer(): HTMLElement {
		return this.domNode;
	}

	hasAction(action: IAction): boolean {
		return this.viewItems.findIndex(candidate => candidate.action.id === action.id) !== -1;
	}

	getAction(indexOrElement: number | HTMLElement): IAction | undefined {

		// by index
		if (typeof indexOrElement === 'number') {
			return this.viewItems[indexOrElement]?.action;
		}

		// by element
		if (DOM.isHTMLElement(indexOrElement)) {
			while (indexOrElement.parentElement !== this.actionsList) {
				if (!indexOrElement.parentElement) {
					return undefined;
				}
				indexOrElement = indexOrElement.parentElement;
			}
			for (let i = 0; i < this.actionsList.childNodes.length; i++) {
				if (this.actionsList.childNodes[i] === indexOrElement) {
					return this.viewItems[i].action;
				}
			}
		}

		return undefined;
	}

	push(arg: IAction | ReadonlyArray<IAction>, options: IActionOptions = {}): void {
		const actions: ReadonlyArray<IAction> = Array.isArray(arg) ? arg : [arg];

		let index = types.isNumber(options.index) ? options.index : null;

		actions.forEach((action: IAction) => {
			const actionViewItemElement = document.createElement('li');
			actionViewItemElement.className = 'action-item';
			actionViewItemElement.setAttribute('role', 'presentation');

			let item: IActionViewItem | undefined;

			const viewItemOptions: IActionViewItemOptions = { hoverDelegate: this._hoverDelegate, ...options, isTabList: this.options.ariaRole === 'tablist' };
			if (this.options.actionViewItemProvider) {
				item = this.options.actionViewItemProvider(action, viewItemOptions);
			}

			if (!item) {
				item = new ActionViewItem(this.context, action, viewItemOptions);
			}

			// Prevent native context menu on actions
			if (!this.options.allowContextMenu) {
				this.viewItemDisposables.set(item, DOM.addDisposableListener(actionViewItemElement, DOM.EventType.CONTEXT_MENU, (e: DOM.EventLike) => {
					DOM.EventHelper.stop(e, true);
				}));
			}

			item.actionRunner = this._actionRunner;
			item.setActionContext(this.context);
			item.render(actionViewItemElement);

			if (index === null || index < 0 || index >= this.actionsList.children.length) {
				this.actionsList.appendChild(actionViewItemElement);
				this.viewItems.push(item);
			} else {
				this.actionsList.insertBefore(actionViewItemElement, this.actionsList.children[index]);
				this.viewItems.splice(index, 0, item);
				index++;
			}
		});

		// We need to allow for the first enabled item to be focused on using tab navigation #106441
		if (this.focusable) {
			let didFocus = false;
			for (const item of this.viewItems) {
				if (!(item instanceof BaseActionViewItem)) {
					continue;
				}

				let focus: boolean;
				if (didFocus) {
					focus = false; // already focused an item
				} else if (item.action.id === Separator.ID) {
					focus = false; // never focus a separator
				} else if (!item.isEnabled() && this.options.focusOnlyEnabledItems) {
					focus = false; // never focus a disabled item
				} else {
					focus = true;
				}

				if (focus) {
					item.setFocusable(true);
					didFocus = true;
				} else {
					item.setFocusable(false);
				}
			}
		}

		if (typeof this.focusedItem === 'number') {
			// After a clear actions might be re-added to simply toggle some actions. We should preserve focus #97128
			this.focus(this.focusedItem);
		}
		this.refreshRole();
	}

	getWidth(index: number): number {
		if (index >= 0 && index < this.actionsList.children.length) {
			const item = this.actionsList.children.item(index);
			if (item) {
				return item.clientWidth;
			}
		}

		return 0;
	}

	getHeight(index: number): number {
		if (index >= 0 && index < this.actionsList.children.length) {
			const item = this.actionsList.children.item(index);
			if (item) {
				return item.clientHeight;
			}
		}

		return 0;
	}

	pull(index: number): void {
		if (index >= 0 && index < this.viewItems.length) {
			this.actionsList.childNodes[index].remove();
			this.viewItemDisposables.deleteAndDispose(this.viewItems[index]);
			dispose(this.viewItems.splice(index, 1));
			this.refreshRole();
		}
	}

	clear(): void {
		if (this.isEmpty()) {
			return;
		}

		this.viewItems = dispose(this.viewItems);
		this.viewItemDisposables.clearAndDisposeAll();
		DOM.clearNode(this.actionsList);
		this.refreshRole();
	}

	length(): number {
		return this.viewItems.length;
	}

	isEmpty(): boolean {
		return this.viewItems.length === 0;
	}

	focus(index?: number): void;
	focus(selectFirst?: boolean): void;
	focus(arg?: number | boolean): void {
		let selectFirst: boolean = false;
		let index: number | undefined = undefined;
		if (arg === undefined) {
			selectFirst = true;
		} else if (typeof arg === 'number') {
			index = arg;
		} else if (typeof arg === 'boolean') {
			selectFirst = arg;
		}

		if (selectFirst && typeof this.focusedItem === 'undefined') {
			const firstEnabled = this.viewItems.findIndex(item => item.isEnabled());
			// Focus the first enabled item
			this.focusedItem = firstEnabled === -1 ? undefined : firstEnabled;
			this.updateFocus(undefined, undefined, true);
		} else {
			if (index !== undefined) {
				this.focusedItem = index;
			}

			this.updateFocus(undefined, undefined, true);
		}
	}

	private focusFirst(): boolean {
		this.focusedItem = this.length() - 1;
		return this.focusNext(true);
	}

	private focusLast(): boolean {
		this.focusedItem = 0;
		return this.focusPrevious(true);
	}

	protected focusNext(forceLoop?: boolean, forceFocus?: boolean): boolean {
		if (typeof this.focusedItem === 'undefined') {
			this.focusedItem = this.viewItems.length - 1;
		} else if (this.viewItems.length <= 1) {
			return false;
		}

		const startIndex = this.focusedItem;
		let item: IActionViewItem;
		do {

			if (!forceLoop && this.options.preventLoopNavigation && this.focusedItem + 1 >= this.viewItems.length) {
				this.focusedItem = startIndex;
				return false;
			}

			this.focusedItem = (this.focusedItem + 1) % this.viewItems.length;
			item = this.viewItems[this.focusedItem];
		} while (this.focusedItem !== startIndex && ((this.options.focusOnlyEnabledItems && !item.isEnabled()) || item.action.id === Separator.ID));

		this.updateFocus(undefined, undefined, forceFocus);
		return true;
	}

	protected focusPrevious(forceLoop?: boolean): boolean {
		if (typeof this.focusedItem === 'undefined') {
			this.focusedItem = 0;
		} else if (this.viewItems.length <= 1) {
			return false;
		}

		const startIndex = this.focusedItem;
		let item: IActionViewItem;

		do {
			this.focusedItem = this.focusedItem - 1;
			if (this.focusedItem < 0) {
				if (!forceLoop && this.options.preventLoopNavigation) {
					this.focusedItem = startIndex;
					return false;
				}

				this.focusedItem = this.viewItems.length - 1;
			}
			item = this.viewItems[this.focusedItem];
		} while (this.focusedItem !== startIndex && ((this.options.focusOnlyEnabledItems && !item.isEnabled()) || item.action.id === Separator.ID));


		this.updateFocus(true);
		return true;
	}

	protected updateFocus(fromRight?: boolean, preventScroll?: boolean, forceFocus: boolean = false): void {
		if (typeof this.focusedItem === 'undefined') {
			this.actionsList.focus({ preventScroll });
		}

		if (this.previouslyFocusedItem !== undefined && this.previouslyFocusedItem !== this.focusedItem) {
			this.viewItems[this.previouslyFocusedItem]?.blur();
		}
		const actionViewItem = this.focusedItem !== undefined ? this.viewItems[this.focusedItem] : undefined;
		if (actionViewItem) {
			let focusItem = true;

			if (!types.isFunction(actionViewItem.focus)) {
				focusItem = false;
			}

			if (this.options.focusOnlyEnabledItems && types.isFunction(actionViewItem.isEnabled) && !actionViewItem.isEnabled()) {
				focusItem = false;
			}

			if (actionViewItem.action.id === Separator.ID) {
				focusItem = false;
			}
			if (!focusItem) {
				this.actionsList.focus({ preventScroll });
				this.previouslyFocusedItem = undefined;
			} else if (forceFocus || this.previouslyFocusedItem !== this.focusedItem) {
				actionViewItem.focus(fromRight);
				this.previouslyFocusedItem = this.focusedItem;
			}
			if (focusItem) {
				actionViewItem.showHover?.();
			}
		}
	}

	private doTrigger(event: StandardKeyboardEvent): void {
		if (typeof this.focusedItem === 'undefined') {
			return; //nothing to focus
		}

		// trigger action
		const actionViewItem = this.viewItems[this.focusedItem];
		if (actionViewItem instanceof BaseActionViewItem) {
			const context = (actionViewItem._context === null || actionViewItem._context === undefined) ? event : actionViewItem._context;
			this.run(actionViewItem._action, context);
		}
	}

	async run(action: IAction, context?: unknown): Promise<void> {
		await this._actionRunner.run(action, context);
	}

	override dispose(): void {
		this._context = undefined;
		this.viewItems = dispose(this.viewItems);
		this.getContainer().remove();
		super.dispose();
	}
}

export function prepareActions(actions: IAction[]): IAction[] {
	if (!actions.length) {
		return actions;
	}

	// Clean up leading separators
	let firstIndexOfAction = -1;
	for (let i = 0; i < actions.length; i++) {
		if (actions[i].id === Separator.ID) {
			continue;
		}

		firstIndexOfAction = i;
		break;
	}

	if (firstIndexOfAction === -1) {
		return [];
	}

	actions = actions.slice(firstIndexOfAction);

	// Clean up trailing separators
	for (let h = actions.length - 1; h >= 0; h--) {
		const isSeparator = actions[h].id === Separator.ID;
		if (isSeparator) {
			actions.splice(h, 1);
		} else {
			break;
		}
	}

	// Clean up separator duplicates
	let foundAction = false;
	for (let k = actions.length - 1; k >= 0; k--) {
		const isSeparator = actions[k].id === Separator.ID;
		if (isSeparator && !foundAction) {
			actions.splice(k, 1);
		} else if (!isSeparator) {
			foundAction = true;
		} else if (isSeparator) {
			foundAction = false;
		}
	}

	return actions;
}
```

--------------------------------------------------------------------------------

````

---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 65
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 65 of 552)

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

---[FILE: extensions/notebook-renderers/src/index.ts]---
Location: vscode-main/extensions/notebook-renderers/src/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { ActivationFunction, OutputItem, RendererContext } from 'vscode-notebook-renderer';
import { createOutputContent, appendOutput, scrollableClass } from './textHelper';
import { HtmlRenderingHook, IDisposable, IRichRenderContext, JavaScriptRenderingHook, OutputWithAppend, RenderOptions } from './rendererTypes';
import { ttPolicy } from './htmlHelper';
import { formatStackTrace } from './stackTraceHelper';

function clearContainer(container: HTMLElement) {
	while (container.firstChild) {
		container.firstChild.remove();
	}
}

function renderImage(outputInfo: OutputItem, element: HTMLElement): IDisposable {
	const blob = new Blob([outputInfo.data() as Uint8Array<ArrayBuffer>], { type: outputInfo.mime });
	const src = URL.createObjectURL(blob);
	const disposable = {
		dispose: () => {
			URL.revokeObjectURL(src);
		}
	};

	if (element.firstChild) {
		const display = element.firstChild as HTMLElement;
		if (display.firstChild && display.firstChild.nodeName === 'IMG' && display.firstChild instanceof HTMLImageElement) {
			display.firstChild.src = src;
			return disposable;
		}
	}

	const image = document.createElement('img');
	image.src = src;
	const alt = getAltText(outputInfo);
	if (alt) {
		image.alt = alt;
	}
	image.setAttribute('data-vscode-context', JSON.stringify({
		webviewSection: 'image',
		outputId: outputInfo.id,
		'preventDefaultContextMenuItems': true
	}));
	const display = document.createElement('div');
	display.classList.add('display');
	display.appendChild(image);
	element.appendChild(display);

	return disposable;
}

const preservedScriptAttributes: (keyof HTMLScriptElement)[] = [
	'type', 'src', 'nonce', 'noModule', 'async',
];

const domEval = (container: Element) => {
	const arr = Array.from(container.getElementsByTagName('script'));
	for (let n = 0; n < arr.length; n++) {
		const node = arr[n];
		const scriptTag = document.createElement('script');
		const trustedScript = ttPolicy?.createScript(node.innerText) ?? node.innerText;
		scriptTag.text = trustedScript as string;
		for (const key of preservedScriptAttributes) {
			const val = node[key] || node.getAttribute && node.getAttribute(key);
			if (val) {
				scriptTag.setAttribute(key, val as unknown as string);
			}
		}

		// TODO@connor4312: should script with src not be removed?
		container.appendChild(scriptTag).parentNode!.removeChild(scriptTag);
	}
};

function getAltText(outputInfo: OutputItem) {
	const metadata = outputInfo.metadata as Record<string, unknown> | undefined;
	if (typeof metadata === 'object' && metadata && typeof metadata.vscode_altText === 'string') {
		return metadata.vscode_altText;
	}
	return undefined;
}

function fixUpSvgElement(outputInfo: OutputItem, element: HTMLElement) {
	if (outputInfo.mime.indexOf('svg') > -1) {
		const svgElement = element.querySelector('svg');
		const altText = getAltText(outputInfo);
		if (svgElement && altText) {
			const title = document.createElement('title');
			title.innerText = altText;
			svgElement.prepend(title);
		}

		if (svgElement) {
			svgElement.classList.add('output-image');

			svgElement.setAttribute('data-vscode-context', JSON.stringify({
				webviewSection: 'image',
				outputId: outputInfo.id,
				'preventDefaultContextMenuItems': true
			}));
		}
	}
}

async function renderHTML(outputInfo: OutputItem, container: HTMLElement, signal: AbortSignal, hooks: Iterable<HtmlRenderingHook>): Promise<void> {
	clearContainer(container);
	let element: HTMLElement = document.createElement('div');
	const htmlContent = outputInfo.text();
	const trustedHtml = ttPolicy?.createHTML(htmlContent) ?? htmlContent;
	element.innerHTML = trustedHtml as string;
	fixUpSvgElement(outputInfo, element);

	for (const hook of hooks) {
		element = (await hook.postRender(outputInfo, element, signal)) ?? element;
		if (signal.aborted) {
			return;
		}
	}

	container.appendChild(element);
	domEval(element);
}

async function renderJavascript(outputInfo: OutputItem, container: HTMLElement, signal: AbortSignal, hooks: Iterable<JavaScriptRenderingHook>): Promise<void> {
	let scriptText = outputInfo.text();

	for (const hook of hooks) {
		scriptText = (await hook.preEvaluate(outputInfo, container, scriptText, signal)) ?? scriptText;
		if (signal.aborted) {
			return;
		}
	}

	const script = document.createElement('script');
	script.type = 'module';
	script.textContent = scriptText;

	const element = document.createElement('div');
	const trustedHtml = ttPolicy?.createHTML(script.outerHTML) ?? script.outerHTML;
	element.innerHTML = trustedHtml as string;
	container.appendChild(element);
	domEval(element);
}

interface Event<T> {
	(listener: (e: T) => any, thisArgs?: any, disposables?: IDisposable[]): IDisposable;
}

function createDisposableStore(): { push(...disposables: IDisposable[]): void; dispose(): void } {
	const localDisposables: IDisposable[] = [];
	const disposable = {
		push: (...disposables: IDisposable[]) => {
			localDisposables.push(...disposables);
		},
		dispose: () => {
			localDisposables.forEach(d => d.dispose());
		}
	};

	return disposable;
}

type DisposableStore = ReturnType<typeof createDisposableStore>;

function renderError(
	outputInfo: OutputItem,
	outputElement: HTMLElement,
	ctx: IRichRenderContext,
	trustHtml: boolean
): IDisposable {
	const disposableStore = createDisposableStore();

	clearContainer(outputElement);

	type ErrorLike = Partial<Error>;

	let err: ErrorLike;
	try {
		err = <ErrorLike>JSON.parse(outputInfo.text());
	} catch (e) {
		console.log(e);
		return disposableStore;
	}

	const headerMessage = err.name && err.message ? `${err.name}: ${err.message}` : err.name || err.message;

	if (err.stack) {
		const minimalError = ctx.settings.minimalError && !!headerMessage?.length;
		outputElement.classList.add('traceback');

		const { formattedStack, errorLocation } = formatStackTrace(err.stack, trustHtml);

		const outputScrolling = !minimalError && scrollingEnabled(outputInfo, ctx.settings);
		const lineLimit = minimalError ? 1000 : ctx.settings.lineLimit;
		const outputOptions = { linesLimit: lineLimit, scrollable: outputScrolling, trustHtml, linkifyFilePaths: false };

		const content = createOutputContent(outputInfo.id, formattedStack, outputOptions);
		const stackTraceElement = document.createElement('div');
		stackTraceElement.appendChild(content);
		outputElement.classList.toggle('word-wrap', ctx.settings.outputWordWrap);
		disposableStore.push(ctx.onDidChangeSettings(e => {
			outputElement.classList.toggle('word-wrap', e.outputWordWrap);
		}));

		if (minimalError) {
			createMinimalError(errorLocation, headerMessage, stackTraceElement, outputElement);
		} else {
			stackTraceElement.classList.toggle('scrollable', outputScrolling);
			outputElement.appendChild(stackTraceElement);
			initializeScroll(stackTraceElement, disposableStore);
		}
	} else {
		const header = document.createElement('div');
		if (headerMessage) {
			header.innerText = headerMessage;
			outputElement.appendChild(header);
		}
	}

	outputElement.classList.add('error');
	return disposableStore;
}

function createMinimalError(errorLocation: string | undefined, headerMessage: string, stackTrace: HTMLDivElement, outputElement: HTMLElement) {
	const outputDiv = document.createElement('div');
	const headerSection = document.createElement('div');
	headerSection.classList.add('error-output-header');

	if (errorLocation && errorLocation.indexOf('<a') === 0) {
		headerSection.innerHTML = errorLocation;
	}
	const header = document.createElement('span');
	header.innerText = headerMessage;
	headerSection.appendChild(header);
	outputDiv.appendChild(headerSection);

	function addButton(linkElement: HTMLElement) {
		const button = document.createElement('li');
		button.appendChild(linkElement);
		// the :hover css selector doesn't work in the webview,
		// so we need to add the hover class manually
		button.onmouseover = function () {
			button.classList.add('hover');
		};
		button.onmouseout = function () {
			button.classList.remove('hover');
		};
		return button;
	}

	const buttons = document.createElement('ul');
	buttons.classList.add('error-output-actions');
	outputDiv.appendChild(buttons);

	const toggleStackLink = document.createElement('a');
	toggleStackLink.innerText = 'Show Details';
	toggleStackLink.href = '#!';
	buttons.appendChild(addButton(toggleStackLink));

	toggleStackLink.onclick = (e) => {
		e.preventDefault();
		const hidden = stackTrace.style.display === 'none';
		stackTrace.style.display = hidden ? '' : 'none';
		toggleStackLink.innerText = hidden ? 'Hide Details' : 'Show Details';
	};

	outputDiv.appendChild(stackTrace);
	stackTrace.style.display = 'none';
	outputElement.appendChild(outputDiv);
}

function getPreviousMatchingContentGroup(outputElement: HTMLElement) {
	const outputContainer = outputElement.parentElement;
	let match: HTMLElement | undefined = undefined;

	let previous = outputContainer?.previousSibling;
	while (previous) {
		const outputElement = (previous.firstChild as HTMLElement | null);
		if (!outputElement || !outputElement.classList.contains('output-stream')) {
			break;
		}

		match = outputElement.firstChild as HTMLElement;
		previous = previous?.previousSibling;
	}

	return match;
}

function onScrollHandler(e: globalThis.Event) {
	const target = e.target as HTMLElement;
	if (target.scrollTop === 0) {
		target.classList.remove('more-above');
	} else {
		target.classList.add('more-above');
	}
}

function onKeypressHandler(e: KeyboardEvent) {
	if (e.ctrlKey || e.shiftKey) {
		return;
	}
	if (e.code === 'ArrowDown' || e.code === 'ArrowUp' ||
		e.code === 'End' || e.code === 'Home' ||
		e.code === 'PageUp' || e.code === 'PageDown') {
		// These should change the scroll position, not adjust the selected cell in the notebook
		e.stopPropagation();
	}
}

// if there is a scrollable output, it will be scrolled to the given value if provided or the bottom of the element
function initializeScroll(scrollableElement: HTMLElement, disposables: DisposableStore, scrollTop?: number) {
	if (scrollableElement.classList.contains(scrollableClass)) {
		const scrollbarVisible = scrollableElement.scrollHeight > scrollableElement.clientHeight;
		scrollableElement.classList.toggle('scrollbar-visible', scrollbarVisible);
		scrollableElement.scrollTop = scrollTop !== undefined ? scrollTop : scrollableElement.scrollHeight;
		if (scrollbarVisible) {
			scrollableElement.addEventListener('scroll', onScrollHandler);
			disposables.push({ dispose: () => scrollableElement.removeEventListener('scroll', onScrollHandler) });
			scrollableElement.addEventListener('keydown', onKeypressHandler);
			disposables.push({ dispose: () => scrollableElement.removeEventListener('keydown', onKeypressHandler) });
		}
	}
}

// Find the scrollTop of the existing scrollable output, return undefined if at the bottom or element doesn't exist
function findScrolledHeight(container: HTMLElement): number | undefined {
	const scrollableElement = container.querySelector('.' + scrollableClass);
	if (scrollableElement && scrollableElement.scrollHeight - scrollableElement.scrollTop - scrollableElement.clientHeight > 2) {
		// not scrolled to the bottom
		return scrollableElement.scrollTop;
	}
	return undefined;
}

function scrollingEnabled(output: OutputItem, options: RenderOptions) {
	const metadata = output.metadata as Record<string, unknown> | undefined;
	return (typeof metadata === 'object' && metadata
		&& typeof metadata.scrollable === 'boolean') ?
		metadata.scrollable : options.outputScrolling;
}

//  div.cell_container
//    div.output_container
//      div.output.output-stream		<-- outputElement parameter
//        div.scrollable? tabindex="0" 	<-- contentParent
//          div output-item-id="{guid}"	<-- content from outputItem parameter
function renderStream(outputInfo: OutputWithAppend, outputElement: HTMLElement, error: boolean, ctx: IRichRenderContext): IDisposable {
	const disposableStore = createDisposableStore();
	const outputScrolling = scrollingEnabled(outputInfo, ctx.settings);
	const outputOptions = { linesLimit: ctx.settings.lineLimit, scrollable: outputScrolling, trustHtml: false, error, linkifyFilePaths: ctx.settings.linkifyFilePaths };

	outputElement.classList.add('output-stream');

	const scrollTop = outputScrolling ? findScrolledHeight(outputElement) : undefined;

	const previousOutputParent = getPreviousMatchingContentGroup(outputElement);
	// If the previous output item for the same cell was also a stream, append this output to the previous
	if (previousOutputParent) {
		const existingContent = previousOutputParent.querySelector(`[output-item-id="${outputInfo.id}"]`) as HTMLElement | null;
		if (existingContent) {
			appendOutput(outputInfo, existingContent, outputOptions);
		} else {
			const newContent = createOutputContent(outputInfo.id, outputInfo.text(), outputOptions);
			previousOutputParent.appendChild(newContent);
		}
		previousOutputParent.classList.toggle('scrollbar-visible', previousOutputParent.scrollHeight > previousOutputParent.clientHeight);
		previousOutputParent.scrollTop = scrollTop !== undefined ? scrollTop : previousOutputParent.scrollHeight;
	} else {
		const existingContent = outputElement.querySelector(`[output-item-id="${outputInfo.id}"]`) as HTMLElement | null;
		let contentParent = existingContent?.parentElement;
		if (existingContent && contentParent) {
			appendOutput(outputInfo, existingContent, outputOptions);
		} else {
			const newContent = createOutputContent(outputInfo.id, outputInfo.text(), outputOptions);
			contentParent = document.createElement('div');
			contentParent.appendChild(newContent);
			while (outputElement.firstChild) {
				outputElement.firstChild.remove();
			}
			outputElement.appendChild(contentParent);
		}

		contentParent.classList.toggle('scrollable', outputScrolling);
		outputElement.classList.toggle('word-wrap', ctx.settings.outputWordWrap);
		disposableStore.push(ctx.onDidChangeSettings(e => {
			outputElement.classList.toggle('word-wrap', e.outputWordWrap);
		}));

		initializeScroll(contentParent, disposableStore, scrollTop);
	}

	return disposableStore;
}

function renderText(outputInfo: OutputItem, outputElement: HTMLElement, ctx: IRichRenderContext): IDisposable {
	const disposableStore = createDisposableStore();
	clearContainer(outputElement);

	const text = outputInfo.text();
	const outputScrolling = scrollingEnabled(outputInfo, ctx.settings);
	const outputOptions = { linesLimit: ctx.settings.lineLimit, scrollable: outputScrolling, trustHtml: false, linkifyFilePaths: ctx.settings.linkifyFilePaths };
	const content = createOutputContent(outputInfo.id, text, outputOptions);
	content.classList.add('output-plaintext');
	content.classList.toggle('word-wrap', ctx.settings.outputWordWrap);
	disposableStore.push(ctx.onDidChangeSettings(e => {
		content.classList.toggle('word-wrap', e.outputWordWrap);
	}));

	content.classList.toggle('scrollable', outputScrolling);
	outputElement.appendChild(content);
	initializeScroll(content, disposableStore);

	return disposableStore;
}

export const activate: ActivationFunction<void> = (ctx) => {
	const disposables = new Map<string, IDisposable>();
	const htmlHooks = new Set<HtmlRenderingHook>();
	const jsHooks = new Set<JavaScriptRenderingHook>();

	const latestContext = ctx as (RendererContext<void> & { readonly settings: RenderOptions; readonly onDidChangeSettings: Event<RenderOptions> });

	const style = document.createElement('style');
	style.textContent = `
	#container div.output.remove-padding {
		padding-left: 0;
		padding-right: 0;
	}
	.output-plaintext,
	.output-stream,
	.traceback {
		display: inline-block;
		width: 100%;
		line-height: var(--notebook-cell-output-line-height);
		font-family: var(--notebook-cell-output-font-family);
		font-size: var(--notebook-cell-output-font-size);
		user-select: text;
		-webkit-user-select: text;
		-ms-user-select: text;
		cursor: auto;
		word-wrap: break-word;
		/* text/stream output container should scroll but preserve newline character */
		white-space: pre;
	}
	/* When wordwrap turned on, force it to pre-wrap */
	#container div.output_container .word-wrap {
		white-space: pre-wrap;
	}
	#container div.output>div {
		padding-left: var(--notebook-output-node-left-padding);
		padding-right: var(--notebook-output-node-padding);
		box-sizing: border-box;
		border-width: 1px;
		border-style: solid;
		border-color: transparent;
	}
	#container div.output>div:focus {
		outline: 0;
		border-color: var(--theme-input-focus-border-color);
	}
	#container div.output .scrollable {
		overflow-y: auto;
		max-height: var(--notebook-cell-output-max-height);
	}
	#container div.output .scrollable.scrollbar-visible {
		border-color: var(--vscode-editorWidget-border);
	}
	#container div.output .scrollable.scrollbar-visible:focus {
		border-color: var(--theme-input-focus-border-color);
	}
	#container div.truncation-message {
		font-style: italic;
		font-family: var(--theme-font-family);
		padding-top: 4px;
	}
	#container div.output .scrollable div {
		cursor: text;
	}
	#container div.output .scrollable div a {
		cursor: pointer;
	}
	#container div.output .scrollable.more-above {
		box-shadow: var(--vscode-scrollbar-shadow) 0 6px 6px -6px inset
	}
	.output-plaintext .code-bold,
	.output-stream .code-bold,
	.traceback .code-bold {
		font-weight: bold;
	}
	.output-plaintext .code-italic,
	.output-stream .code-italic,
	.traceback .code-italic {
		font-style: italic;
	}
	.output-plaintext .code-strike-through,
	.output-stream .code-strike-through,
	.traceback .code-strike-through {
		text-decoration: line-through;
	}
	.output-plaintext .code-underline,
	.output-stream .code-underline,
	.traceback .code-underline {
		text-decoration: underline;
	}
	#container ul.error-output-actions {
		margin: 0px;
		padding: 6px 0px 0px 6px;
		padding-inline-start: 0px;
	}
	#container .error-output-actions li {
		padding: 0px 4px 0px 4px;
		border-radius: 5px;
		height: 20px;
		display: inline-flex;
		cursor: pointer;
		border: solid 1px var(--vscode-notebook-cellToolbarSeparator);
	}
	#container .error-output-actions li.hover {
		background-color: var(--vscode-toolbar-hoverBackground);
	}
	#container .error-output-actions li:focus-within {
		border-color: var(--theme-input-focus-border-color);
	}
	#container .error-output-actions a:focus {
		outline: 0;
	}
	#container .error-output-actions li a {
		color: var(--vscode-foreground);
		text-decoration: none;
	}
	#container .error-output-header a {
		padding-right: 12px;
	}
	`;
	document.body.appendChild(style);

	return {
		renderOutputItem: async (outputInfo, element, signal?: AbortSignal) => {
			element.classList.add('remove-padding');
			switch (outputInfo.mime) {
				case 'text/html':
				case 'image/svg+xml': {
					if (!ctx.workspace.isTrusted) {
						return;
					}

					await renderHTML(outputInfo, element, signal!, htmlHooks);
					break;
				}
				case 'application/javascript': {
					if (!ctx.workspace.isTrusted) {
						return;
					}

					renderJavascript(outputInfo, element, signal!, jsHooks);
					break;
				}
				case 'image/gif':
				case 'image/png':
				case 'image/jpeg':
				case 'image/git':
					{
						disposables.get(outputInfo.id)?.dispose();
						const disposable = renderImage(outputInfo, element);
						disposables.set(outputInfo.id, disposable);
					}
					break;
				case 'application/vnd.code.notebook.error':
					{
						disposables.get(outputInfo.id)?.dispose();
						const disposable = renderError(outputInfo, element, latestContext, ctx.workspace.isTrusted);
						disposables.set(outputInfo.id, disposable);
					}
					break;
				case 'application/vnd.code.notebook.stdout':
				case 'application/x.notebook.stdout':
				case 'application/x.notebook.stream':
					{
						disposables.get(outputInfo.id)?.dispose();
						const disposable = renderStream(outputInfo, element, false, latestContext);
						disposables.set(outputInfo.id, disposable);
					}
					break;
				case 'application/vnd.code.notebook.stderr':
				case 'application/x.notebook.stderr':
					{
						disposables.get(outputInfo.id)?.dispose();
						const disposable = renderStream(outputInfo, element, true, latestContext);
						disposables.set(outputInfo.id, disposable);
					}
					break;
				case 'text/plain':
					{
						disposables.get(outputInfo.id)?.dispose();
						const disposable = renderText(outputInfo, element, latestContext);
						disposables.set(outputInfo.id, disposable);
					}
					break;
				default:
					if (outputInfo.mime.indexOf('text/') > -1) {
						disposables.get(outputInfo.id)?.dispose();
						const disposable = renderText(outputInfo, element, latestContext);
						disposables.set(outputInfo.id, disposable);
					}
					break;
			}
			if (element.querySelector('div')) {
				element.querySelector('div')!.tabIndex = 0;
			}

		},
		disposeOutputItem: (id: string | undefined) => {
			if (id) {
				disposables.get(id)?.dispose();
			} else {
				disposables.forEach(d => d.dispose());
			}
		},
		experimental_registerHtmlRenderingHook: (hook: HtmlRenderingHook): IDisposable => {
			htmlHooks.add(hook);
			return {
				dispose: () => {
					htmlHooks.delete(hook);
				}
			};
		},
		experimental_registerJavaScriptRenderingHook: (hook: JavaScriptRenderingHook): IDisposable => {
			jsHooks.add(hook);
			return {
				dispose: () => {
					jsHooks.delete(hook);
				}
			};
		}
	};
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/notebook-renderers/src/linkify.ts]---
Location: vscode-main/extensions/notebook-renderers/src/linkify.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ttPolicy } from './htmlHelper';

const CONTROL_CODES = '\\u0000-\\u0020\\u007f-\\u009f';
const WEB_LINK_REGEX = new RegExp('(?:[a-zA-Z][a-zA-Z0-9+.-]{2,}:\\/\\/|data:|www\\.)[^\\s' + CONTROL_CODES + '"]{2,}[^\\s' + CONTROL_CODES + '"\')}\\],:;.!?]', 'ug');

const WIN_ABSOLUTE_PATH = /(?<=^|\s)(?:[a-zA-Z]:(?:(?:\\|\/)[\w\.-]*)+)/;
const WIN_RELATIVE_PATH = /(?<=^|\s)(?:(?:\~|\.)(?:(?:\\|\/)[\w\.-]*)+)/;
const WIN_PATH = new RegExp(`(${WIN_ABSOLUTE_PATH.source}|${WIN_RELATIVE_PATH.source})`);
const POSIX_PATH = /(?<=^|\s)((?:\~|\.)?(?:\/[\w\.-]*)+)/;
const LINE_COLUMN = /(?:\:([\d]+))?(?:\:([\d]+))?/;
const isWindows = (typeof navigator !== 'undefined') ? navigator.userAgent && navigator.userAgent.indexOf('Windows') >= 0 : false;
const PATH_LINK_REGEX = new RegExp(`${isWindows ? WIN_PATH.source : POSIX_PATH.source}${LINE_COLUMN.source}`, 'g');
const HTML_LINK_REGEX = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1[^>]*?>.*?<\/a>/gi;

const MAX_LENGTH = 2000;

type LinkKind = 'web' | 'path' | 'html' | 'text';
type LinkPart = {
	kind: LinkKind;
	value: string;
	captures: string[];
};

export type LinkOptions = {
	trustHtml?: boolean;
	linkifyFilePaths: boolean;
};

export class LinkDetector {

	// used by unit tests
	static injectedHtmlCreator: (value: string) => string;

	private shouldGenerateHtml(trustHtml: boolean) {
		return trustHtml && (!!LinkDetector.injectedHtmlCreator || !!ttPolicy);
	}

	private createHtml(value: string) {
		if (LinkDetector.injectedHtmlCreator) {
			return LinkDetector.injectedHtmlCreator(value);
		}
		else {
			return ttPolicy?.createHTML(value).toString();
		}
	}

	/**
	 * Matches and handles web urls, absolute and relative file links in the string provided.
	 * Returns <span/> element that wraps the processed string, where matched links are replaced by <a/>.
	 * 'onclick' event is attached to all anchored links that opens them in the editor.
	 * When splitLines is true, each line of the text, even if it contains no links, is wrapped in a <span>
	 * and added as a child of the returned <span>.
	 */
	linkify(text: string, options: LinkOptions, splitLines?: boolean): HTMLElement {
		if (splitLines) {
			const lines = text.split('\n');
			for (let i = 0; i < lines.length - 1; i++) {
				lines[i] = lines[i] + '\n';
			}
			if (!lines[lines.length - 1]) {
				// Remove the last element ('') that split added.
				lines.pop();
			}
			const elements = lines.map(line => this.linkify(line, options, false));
			if (elements.length === 1) {
				// Do not wrap single line with extra span.
				return elements[0];
			}
			const container = document.createElement('span');
			elements.forEach(e => container.appendChild(e));
			return container;
		}

		const container = document.createElement('span');
		for (const part of this.detectLinks(text, !!options.trustHtml, options.linkifyFilePaths)) {
			try {
				let span: HTMLSpanElement | null = null;
				switch (part.kind) {
					case 'text':
						container.appendChild(document.createTextNode(part.value));
						break;
					case 'web':
					case 'path':
						container.appendChild(this.createWebLink(part.value));
						break;
					case 'html':
						span = document.createElement('span');
						span.innerHTML = this.createHtml(part.value)!;
						container.appendChild(span);
						break;
				}
			} catch (e) {
				container.appendChild(document.createTextNode(part.value));
			}
		}
		return container;
	}

	private createWebLink(url: string): Node {
		const link = this.createLink(url);
		link.href = url;
		return link;
	}

	// private createPathLink(text: string, path: string, lineNumber: number, columnNumber: number, workspaceFolder: string | undefined): Node {
	// 	if (path[0] === '/' && path[1] === '/') {
	// 		// Most likely a url part which did not match, for example ftp://path.
	// 		return document.createTextNode(text);
	// 	}

	// 	const options = { selection: { startLineNumber: lineNumber, startColumn: columnNumber } };
	// 	if (path[0] === '.') {
	// 		if (!workspaceFolder) {
	// 			return document.createTextNode(text);
	// 		}
	// 		const uri = workspaceFolder.toResource(path);
	// 		const link = this.createLink(text);
	// 		this.decorateLink(link, uri, (preserveFocus: boolean) => this.editorService.openEditor({ resource: uri, options: { ...options, preserveFocus } }));
	// 		return link;
	// 	}

	// 	if (path[0] === '~') {
	// 		const userHome = this.pathService.resolvedUserHome;
	// 		if (userHome) {
	// 			path = osPath.join(userHome.fsPath, path.substring(1));
	// 		}
	// 	}

	// 	const link = this.createLink(text);
	// 	link.tabIndex = 0;
	// 	const uri = URI.file(osPath.normalize(path));
	// 	this.fileService.resolve(uri).then(stat => {
	// 		if (stat.isDirectory) {
	// 			return;
	// 		}
	// 		this.decorateLink(link, uri, (preserveFocus: boolean) => this.editorService.openEditor({ resource: uri, options: { ...options, preserveFocus } }));
	// 	}).catch(() => {
	// 		// If the uri can not be resolved we should not spam the console with error, remain quite #86587
	// 	});
	// 	return link;
	// }

	private createLink(text: string): HTMLAnchorElement {
		const link = document.createElement('a');
		link.textContent = text;
		return link;
	}

	private detectLinks(text: string, trustHtml: boolean, detectFilepaths: boolean): LinkPart[] {
		if (text.length > MAX_LENGTH) {
			return [{ kind: 'text', value: text, captures: [] }];
		}

		const regexes: RegExp[] = [];
		const kinds: LinkKind[] = [];
		const result: LinkPart[] = [];

		if (this.shouldGenerateHtml(trustHtml)) {
			regexes.push(HTML_LINK_REGEX);
			kinds.push('html');
		}
		regexes.push(WEB_LINK_REGEX);
		kinds.push('web');
		if (detectFilepaths) {
			regexes.push(PATH_LINK_REGEX);
			kinds.push('path');
		}


		const splitOne = (text: string, regexIndex: number) => {
			if (regexIndex >= regexes.length) {
				result.push({ value: text, kind: 'text', captures: [] });
				return;
			}
			const regex = regexes[regexIndex];
			let currentIndex = 0;
			let match;
			regex.lastIndex = 0;
			while ((match = regex.exec(text)) !== null) {
				const stringBeforeMatch = text.substring(currentIndex, match.index);
				if (stringBeforeMatch) {
					splitOne(stringBeforeMatch, regexIndex + 1);
				}
				const value = match[0];
				result.push({
					value: value,
					kind: kinds[regexIndex],
					captures: match.slice(1)
				});
				currentIndex = match.index + value.length;
			}
			const stringAfterMatches = text.substring(currentIndex);
			if (stringAfterMatches) {
				splitOne(stringAfterMatches, regexIndex + 1);
			}
		};

		splitOne(text, 0);
		return result;
	}
}

const linkDetector = new LinkDetector();
export function linkify(text: string, linkOptions: LinkOptions, splitLines?: boolean) {
	return linkDetector.linkify(text, linkOptions, splitLines);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/notebook-renderers/src/rendererTypes.ts]---
Location: vscode-main/extensions/notebook-renderers/src/rendererTypes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { OutputItem, RendererContext } from 'vscode-notebook-renderer';
import { Event } from 'vscode';

export interface IDisposable {
	dispose(): void;
}

export interface HtmlRenderingHook {
	/**
	 * Invoked after the output item has been rendered but before it has been appended to the document.
	 *
	 * @return A new `HTMLElement` or `undefined` to continue using the provided element.
	 */
	postRender(outputItem: OutputItem, element: HTMLElement, signal: AbortSignal): HTMLElement | undefined | Promise<HTMLElement | undefined>;
}

export interface JavaScriptRenderingHook {
	/**
	 * Invoked before the script is evaluated.
	 *
	 * @return A new string of JavaScript or `undefined` to continue using the provided string.
	 */
	preEvaluate(outputItem: OutputItem, element: HTMLElement, script: string, signal: AbortSignal): string | undefined | Promise<string | undefined>;
}

export interface RenderOptions {
	readonly lineLimit: number;
	readonly outputScrolling: boolean;
	readonly outputWordWrap: boolean;
	readonly linkifyFilePaths: boolean;
	readonly minimalError: boolean;
}

export type IRichRenderContext = RendererContext<void> & { readonly settings: RenderOptions; readonly onDidChangeSettings: Event<RenderOptions> };

export type OutputElementOptions = {
	linesLimit: number;
	scrollable?: boolean;
	error?: boolean;
	trustHtml?: boolean;
	linkifyFilePaths: boolean;
};

export interface OutputWithAppend extends OutputItem {
	appendedText?(): string | undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/notebook-renderers/src/stackTraceHelper.ts]---
Location: vscode-main/extensions/notebook-renderers/src/stackTraceHelper.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function formatStackTrace(stack: string, trustHtml: boolean): { formattedStack: string; errorLocation?: string } {
	let cleaned: string;
	// Ansi colors are described here:
	// https://en.wikipedia.org/wiki/ANSI_escape_code under the SGR section

	// Remove background colors. The ones from IPython don't work well with
	// themes 40-49 sets background color
	cleaned = stack.replace(/\u001b\[4\dm/g, '');
	cleaned = cleaned.replace(/(?<=\u001b\[[\d;]*?);4\d(?=m)/g, '');

	// Also remove specific foreground colors (38 is the ascii code for picking one) (they don't translate either)
	// Turn them into default foreground
	cleaned = cleaned.replace(/\u001b\[38;.*?\d+m/g, '\u001b[39m');

	// Turn all foreground colors after the --> to default foreground
	cleaned = cleaned.replace(/(;32m[ ->]*?)(\d+)(.*)\n/g, (_s, prefix, num, suffix) => {
		suffix = suffix.replace(/\u001b\[3\d+m/g, '\u001b[39m');
		return `${prefix}${num}${suffix}\n`;
	});

	if (isIpythonStackTrace(cleaned) && trustHtml) {
		return linkifyStack(cleaned);
	}

	return { formattedStack: cleaned };
}

const formatSequence = /\u001b\[.+?m/g;
const fileRegex = /File\s+(?:\u001b\[.+?m)?(.+):(\d+)/;
// look for the "--->" before a line number
const lineNumberRegex = /(-+>(?:\u001b\[[\d;]*m|\s)*)(\d+)(.*)/;
// just capturing parts of "Cell In[3], line 2" with lots of formatting in between
const cellRegex = /^(?<prefix>(?:\u001b\[[\d;]*m|\s)*Cell(?:\u001b\[[\d;]*m|\s)*In(?:\u001b\[[\d;]*m|\s)*\[(?<executionCount>\d+)\](?:\u001b\[[\d;]*m|\s|,)+)(?<lineLabel>line (?<lineNumber>\d+))[^\n]*$/m;
// older versions of IPython ~8.3.0
const inputRegex = /(?<prefix>Input\s+?(?:\u001b\[.+?m)(?<cellLabel>In\s*\[(?<executionCount>\d+)\]))(?<postfix>.*)/;

function isIpythonStackTrace(stack: string) {
	return cellRegex.test(stack) || inputRegex.test(stack) || fileRegex.test(stack);
}

function stripFormatting(text: string) {
	return text.replace(formatSequence, '').trim();
}

type cellLocation = { kind: 'cell'; path: string };
type fileLocation = { kind: 'file'; path: string };

type location = cellLocation | fileLocation;

function linkifyStack(stack: string): { formattedStack: string; errorLocation?: string } {
	const lines = stack.split('\n');

	let fileOrCell: location | undefined;
	let locationLink = '';

	for (const i in lines) {

		const original = lines[i];
		if (fileRegex.test(original)) {
			const fileMatch = lines[i].match(fileRegex);
			fileOrCell = { kind: 'file', path: stripFormatting(fileMatch![1]) };

			continue;
		} else if (cellRegex.test(original)) {
			fileOrCell = {
				kind: 'cell',
				path: stripFormatting(original.replace(cellRegex, 'vscode-notebook-cell:?execution_count=$<executionCount>'))
			};
			const link = original.replace(cellRegex, `<a href=\'${fileOrCell.path}&line=$<lineNumber>\'>line $<lineNumber></a>`);
			lines[i] = original.replace(cellRegex, `$<prefix>${link}`);
			locationLink = locationLink || link;

			continue;
		} else if (inputRegex.test(original)) {
			fileOrCell = {
				kind: 'cell',
				path: stripFormatting(original.replace(inputRegex, 'vscode-notebook-cell:?execution_count=$<executionCount>'))
			};
			const link = original.replace(inputRegex, `<a href=\'${fileOrCell.path}\'>$<cellLabel></a>`);
			lines[i] = original.replace(inputRegex, `Input ${link}$<postfix>`);

			continue;
		} else if (!fileOrCell || original.trim() === '') {
			// we don't have a location, so don't linkify anything
			fileOrCell = undefined;

			continue;
		} else if (lineNumberRegex.test(original)) {
			lines[i] = original.replace(lineNumberRegex, (_s, prefix, num, suffix) => {
				return fileOrCell?.kind === 'file' ?
					`${prefix}<a href='${fileOrCell?.path}:${num}'>${num}</a>${suffix}` :
					`${prefix}<a href='${fileOrCell?.path}&line=${num}'>${num}</a>${suffix}`;
			});

			continue;
		}
	}

	const errorLocation = locationLink;
	return { formattedStack: lines.join('\n'), errorLocation };
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/notebook-renderers/src/textHelper.ts]---
Location: vscode-main/extensions/notebook-renderers/src/textHelper.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { handleANSIOutput } from './ansi';
import { LinkOptions } from './linkify';
import { OutputElementOptions, OutputWithAppend } from './rendererTypes';
export const scrollableClass = 'scrollable';

const softScrollableLineLimit = 5000;
const hardScrollableLineLimit = 8000;

/**
 * Output is Truncated. View as a [scrollable element] or open in a [text editor]. Adjust cell output [settings...]
 */
function generateViewMoreElement(outputId: string) {

	const container = document.createElement('div');
	container.classList.add('truncation-message');
	const first = document.createElement('span');
	first.textContent = 'Output is truncated. View as a ';
	container.appendChild(first);

	const viewAsScrollableLink = document.createElement('a');
	viewAsScrollableLink.textContent = 'scrollable element';
	viewAsScrollableLink.href = `command:cellOutput.enableScrolling?${outputId}`;
	viewAsScrollableLink.ariaLabel = 'enable scrollable output';
	container.appendChild(viewAsScrollableLink);

	const second = document.createElement('span');
	second.textContent = ' or open in a ';
	container.appendChild(second);

	const openInTextEditorLink = document.createElement('a');
	openInTextEditorLink.textContent = 'text editor';
	openInTextEditorLink.href = `command:workbench.action.openLargeOutput?${outputId}`;
	openInTextEditorLink.ariaLabel = 'open output in text editor';
	container.appendChild(openInTextEditorLink);

	const third = document.createElement('span');
	third.textContent = '. Adjust cell output ';
	container.appendChild(third);

	const layoutSettingsLink = document.createElement('a');
	layoutSettingsLink.textContent = 'settings';
	layoutSettingsLink.href = `command:workbench.action.openSettings?%5B%22%40tag%3AnotebookOutputLayout%22%5D`;
	layoutSettingsLink.ariaLabel = 'notebook output settings';
	container.appendChild(layoutSettingsLink);

	const fourth = document.createElement('span');
	fourth.textContent = '...';
	container.appendChild(fourth);

	return container;
}

function generateNestedViewAllElement(outputId: string) {
	const container = document.createElement('div');

	const link = document.createElement('a');
	link.textContent = '...';
	link.href = `command:workbench.action.openLargeOutput?${outputId}`;
	link.ariaLabel = 'Open full output in text editor';
	link.title = 'Open full output in text editor';
	link.style.setProperty('text-decoration', 'none');
	container.appendChild(link);

	return container;
}

function truncatedArrayOfString(id: string, buffer: string[], linesLimit: number, linkOptions: LinkOptions) {
	const container = document.createElement('div');
	container.setAttribute('data-vscode-context', JSON.stringify({
		webviewSection: 'text',
		outputId: id,
		'preventDefaultContextMenuItems': true
	}));
	const lineCount = buffer.length;

	if (lineCount <= linesLimit) {
		const spanElement = handleANSIOutput(buffer.join('\n'), linkOptions);
		container.appendChild(spanElement);
		return container;
	}

	container.appendChild(handleANSIOutput(buffer.slice(0, linesLimit - 5).join('\n'), linkOptions));

	// truncated piece
	const elipses = document.createElement('div');
	elipses.innerText = '...';
	container.appendChild(elipses);

	container.appendChild(handleANSIOutput(buffer.slice(lineCount - 5).join('\n'), linkOptions));

	container.appendChild(generateViewMoreElement(id));

	return container;
}

function scrollableArrayOfString(id: string, buffer: string[], linkOptions: LinkOptions) {
	const element = document.createElement('div');
	element.setAttribute('data-vscode-context', JSON.stringify({
		webviewSection: 'text',
		outputId: id,
		'preventDefaultContextMenuItems': true
	}));
	if (buffer.length > softScrollableLineLimit) {
		element.appendChild(generateNestedViewAllElement(id));
	}

	element.appendChild(handleANSIOutput(buffer.slice(-1 * softScrollableLineLimit).join('\n'), linkOptions));

	return element;
}

const outputLengths: Record<string, number> = {};

function appendScrollableOutput(element: HTMLElement, id: string, appended: string, linkOptions: LinkOptions) {
	if (!outputLengths[id]) {
		outputLengths[id] = 0;
	}

	const buffer = appended.split(/\r\n|\r|\n/g);
	const appendedLength = buffer.length + outputLengths[id];
	// Only append outputs up to the hard limit of lines, then replace it with the last softLimit number of lines
	if (appendedLength > hardScrollableLineLimit) {
		return false;
	}
	else {
		element.appendChild(handleANSIOutput(buffer.join('\n'), linkOptions));
		outputLengths[id] = appendedLength;
	}
	return true;
}

export function createOutputContent(id: string, outputText: string, options: OutputElementOptions): HTMLElement {
	const { linesLimit, error, scrollable, trustHtml, linkifyFilePaths } = options;
	const linkOptions: LinkOptions = { linkifyFilePaths, trustHtml };
	const buffer = outputText.split(/\r\n|\r|\n/g);
	outputLengths[id] = outputLengths[id] = Math.min(buffer.length, softScrollableLineLimit);

	let outputElement: HTMLElement;
	if (scrollable) {
		outputElement = scrollableArrayOfString(id, buffer, linkOptions);
	} else {
		outputElement = truncatedArrayOfString(id, buffer, linesLimit, linkOptions);
	}

	outputElement.setAttribute('output-item-id', id);
	if (error) {
		outputElement.classList.add('error');
	}

	return outputElement;
}

export function appendOutput(outputInfo: OutputWithAppend, existingContent: HTMLElement, options: OutputElementOptions) {
	const appendedText = outputInfo.appendedText?.();
	const linkOptions = { linkifyFilePaths: options.linkifyFilePaths, trustHtml: options.trustHtml };
	// appending output only supported for scrollable ouputs currently
	if (appendedText && options.scrollable) {
		if (appendScrollableOutput(existingContent, outputInfo.id, appendedText, linkOptions)) {
			return;
		}
	}

	const newContent = createOutputContent(outputInfo.id, outputInfo.text(), options);
	existingContent.replaceWith(newContent);
	while (newContent.nextSibling) {
		// clear out any stale content if we had previously combined streaming outputs into this one
		newContent.nextSibling.remove();
	}

}
```

--------------------------------------------------------------------------------

---[FILE: extensions/notebook-renderers/src/test/index.ts]---
Location: vscode-main/extensions/notebook-renderers/src/test/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import * as testRunner from '../../../../test/integration/electron/testrunner';

const options: import('mocha').MochaOptions = {
	ui: 'tdd',
	color: true,
	timeout: 60000
};

// These integration tests is being run in multiple environments (electron, web, remote)
// so we need to set the suite name based on the environment as the suite name is used
// for the test results file name
let suite = '';
if (process.env.VSCODE_BROWSER) {
	suite = `${process.env.VSCODE_BROWSER} Browser Integration notebook output renderer Tests`;
} else if (process.env.REMOTE_VSCODE) {
	suite = 'Remote Integration notebook output renderer Tests';
} else {
	suite = 'Integration notebook output renderer Tests';
}

if (process.env.BUILD_ARTIFACTSTAGINGDIRECTORY || process.env.GITHUB_WORKSPACE) {
	options.reporter = 'mocha-multi-reporters';
	options.reporterOptions = {
		reporterEnabled: 'spec, mocha-junit-reporter',
		mochaJunitReporterReporterOptions: {
			testsuitesTitle: `${suite} ${process.platform}`,
			mochaFile: path.join(
				process.env.BUILD_ARTIFACTSTAGINGDIRECTORY || process.env.GITHUB_WORKSPACE || __dirname,
				`test-results/${process.platform}-${process.arch}-${suite.toLowerCase().replace(/[^\w]/g, '-')}-results.xml`)
		}
	};
}

testRunner.configure(options);

export = testRunner;
```

--------------------------------------------------------------------------------

---[FILE: extensions/notebook-renderers/src/test/linkify.test.ts]---
Location: vscode-main/extensions/notebook-renderers/src/test/linkify.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { JSDOM } from 'jsdom';
import { LinkDetector, linkify } from '../linkify';

const dom = new JSDOM();
global.document = dom.window.document;

suite('Notebook builtin output link detection', () => {

	LinkDetector.injectedHtmlCreator = (value: string) => value;

	test('no links', () => {
		const htmlWithLinks = linkify('hello', { linkifyFilePaths: true, trustHtml: true }, true);
		assert.equal(htmlWithLinks.innerHTML, 'hello');
	});

	test('web link detection', () => {
		const htmlWithLinks = linkify('something www.example.com something', { linkifyFilePaths: true, trustHtml: true }, true);
		const htmlWithLinks2 = linkify('something www.example.com something', { linkifyFilePaths: false, trustHtml: false }, true);

		assert.equal(htmlWithLinks.innerHTML, 'something <a href="www.example.com">www.example.com</a> something');
		assert.equal(htmlWithLinks.textContent, 'something www.example.com something');
		assert.equal(htmlWithLinks2.innerHTML, 'something <a href="www.example.com">www.example.com</a> something');
		assert.equal(htmlWithLinks2.textContent, 'something www.example.com something');
	});

	test('html link detection', () => {
		const htmlWithLinks = linkify('something <a href="www.example.com">link</a> something', { linkifyFilePaths: true, trustHtml: true }, true);
		const htmlWithLinks2 = linkify('something <a href="www.example.com">link</a> something', { linkifyFilePaths: false, trustHtml: true }, true);

		assert.equal(htmlWithLinks.innerHTML, 'something <span><a href="www.example.com">link</a></span> something');
		assert.equal(htmlWithLinks.textContent, 'something link something');
		assert.equal(htmlWithLinks2.innerHTML, 'something <span><a href="www.example.com">link</a></span> something');
		assert.equal(htmlWithLinks2.textContent, 'something link something');
	});

	test('html link without trust', () => {
		const htmlWithLinks = linkify('something <a href="file.py">link</a> something', { linkifyFilePaths: true, trustHtml: false }, true);

		assert.equal(htmlWithLinks.innerHTML, 'something &lt;a href="file.py"&gt;link&lt;/a&gt; something');
		assert.equal(htmlWithLinks.textContent, 'something <a href="file.py">link</a> something');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/notebook-renderers/src/test/notebookRenderer.test.ts]---
Location: vscode-main/extensions/notebook-renderers/src/test/notebookRenderer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { activate } from '..';
import { RendererApi } from 'vscode-notebook-renderer';
import { IDisposable, IRichRenderContext, OutputWithAppend, RenderOptions } from '../rendererTypes';
import { JSDOM } from 'jsdom';
import { LinkDetector } from '../linkify';

const dom = new JSDOM();
global.document = dom.window.document;

suite('Notebook builtin output renderer', () => {

	const error = {
		name: 'TypeError',
		message: 'Expected type `str`, but received type `<class \'int\'>`',
		stack: '\u001b[1;31m---------------------------------------------------------------------------\u001b[0m' +
			'\u001b[1;31mTypeError\u001b[0m                                 Traceback (most recent call last)' +
			'\u001b[1;32mc:\\src\\test\\ws1\\testing.py\u001b[0m in \u001b[0;36mline 2\n\u001b[0;32m      <a href=\'file:///c%3A/src/test/ws1/testing.py?line=34\'>35</a>\u001b[0m \u001b[39m# %%\u001b[39;00m\n\u001b[1;32m----> <a href=\'file:///c%3A/src/test/ws1/testing.py?line=35\'>36</a>\u001b[0m \u001b[39mraise\u001b[39;00m \u001b[39mTypeError\u001b[39;00m(\u001b[39m\'\u001b[39m\u001b[39merror = f\u001b[39m\u001b[39m"\u001b[39m\u001b[39mExpected type `str`, but received type `\u001b[39m\u001b[39m{\u001b[39m\u001b[39mtype(name)}`\u001b[39m\u001b[39m"\u001b[39m\u001b[39m\'\u001b[39m)\n' +
			'\u001b[1;31mTypeError\u001b[0m: Expected type `str`, but received type `<class \'int\'>`"'
	};

	const errorMimeType = 'application/vnd.code.notebook.error';

	const stdoutMimeType = 'application/vnd.code.notebook.stdout';
	const stderrMimeType = 'application/vnd.code.notebook.stderr';

	const textLikeMimeTypes = [
		stdoutMimeType,
		stderrMimeType,
		'text/plain'
	];

	type optionalRenderOptions = { [k in keyof RenderOptions]?: RenderOptions[k] };

	type handler = (e: RenderOptions) => any;

	const settingsChangedHandlers: handler[] = [];
	function fireSettingsChange(options: optionalRenderOptions) {
		settingsChangedHandlers.forEach((handler) => handler(options as RenderOptions));
	}

	function createContext(settings?: optionalRenderOptions): IRichRenderContext {
		settingsChangedHandlers.length = 0;
		return {
			setState(_value: void) { },
			getState() { return undefined; },
			async getRenderer(_id): Promise<RendererApi | undefined> { return undefined; },
			settings: {
				outputWordWrap: true,
				outputScrolling: true,
				lineLimit: 30,
				...settings
			} as RenderOptions,
			onDidChangeSettings(listener: handler, _thisArgs?: any, disposables?: IDisposable[]) {
				settingsChangedHandlers.push(listener);

				const dispose = () => {
					settingsChangedHandlers.splice(settingsChangedHandlers.indexOf(listener), 1);
				};

				disposables?.push({ dispose });
				return {
					dispose
				};
			},
			workspace: {
				isTrusted: true
			}
		};
	}

	function createElement(elementType: 'div' | 'span', classes: string[]) {
		const el = global.document.createElement(elementType);
		classes.forEach((c) => el.classList.add(c));
		return el;
	}

	// Helper to generate HTML similar to what is passed to the renderer
	// <div class="cell_container" >
	//   <div class="output_container" >
	//     <div class="output" >
	class OutputHtml {
		private readonly cell = createElement('div', ['cell_container']);
		private readonly firstOutput: HTMLElement;

		constructor() {
			const outputContainer = createElement('div', ['output_container']);
			const outputElement = createElement('div', ['output']);

			this.cell.appendChild(outputContainer);
			outputContainer.appendChild(outputElement);

			this.firstOutput = outputElement;
		}

		public get cellElement() {
			return this.cell;
		}

		public getFirstOuputElement() {
			return this.firstOutput;
		}

		public appendOutputElement() {
			const outputElement = createElement('div', ['output']);
			const outputContainer = createElement('div', ['output_container']);
			this.cell.appendChild(outputContainer);
			outputContainer.appendChild(outputElement);

			return outputElement;
		}
	}

	function createOutputItem(text: string, mime: string, id: string = '123', appendedText?: string): OutputWithAppend {
		return {
			id: id,
			mime: mime,
			appendedText() {
				return appendedText;
			},
			text() {
				return text;
			},
			blob() {
				return new Blob([text], { type: mime });
			},
			json() {
				return '{ }';
			},
			data() {
				return new Uint8Array();
			},
			metadata: {}
		};
	}

	textLikeMimeTypes.forEach((mimeType) => {
		test(`Render with wordwrap and scrolling for mimetype ${mimeType}`, async () => {
			const context = createContext({ outputWordWrap: true, outputScrolling: true });
			const renderer = await activate(context);
			assert.ok(renderer, 'Renderer not created');

			const outputElement = new OutputHtml().getFirstOuputElement();
			const outputItem = createOutputItem('content', mimeType);
			await renderer!.renderOutputItem(outputItem, outputElement);

			const inserted = outputElement.firstChild as HTMLElement;
			assert.ok(inserted, `nothing appended to output element: ${outputElement.innerHTML}`);
			assert.ok(outputElement.classList.contains('remove-padding'), `Padding should be removed for scrollable outputs ${outputElement.classList}`);
			if (mimeType === 'text/plain') {
				assert.ok(inserted.classList.contains('word-wrap'), `Word wrap should be enabled for text/plain ${outputElement.classList}`);
			} else {
				assert.ok(outputElement.classList.contains('word-wrap') && inserted.classList.contains('scrollable'),
					`output content classList should contain word-wrap and scrollable ${inserted.classList}`);
			}
			assert.ok(inserted.innerHTML.indexOf('>content</') > -1, `Content was not added to output element: ${outputElement.innerHTML}`);
		});

		test(`Render without wordwrap or scrolling for mimetype ${mimeType}`, async () => {
			const context = createContext({ outputWordWrap: false, outputScrolling: false });
			const renderer = await activate(context);
			assert.ok(renderer, 'Renderer not created');

			const outputElement = new OutputHtml().getFirstOuputElement();
			const outputItem = createOutputItem('content', mimeType);
			await renderer!.renderOutputItem(outputItem, outputElement);

			const inserted = outputElement.firstChild as HTMLElement;
			assert.ok(inserted, `nothing appended to output element: ${outputElement.innerHTML}`);
			assert.ok(outputElement.classList.contains('remove-padding'), `Padding should be removed for non-scrollable outputs: ${outputElement.classList}`);
			assert.ok(!outputElement.classList.contains('word-wrap') && !inserted.classList.contains('scrollable'),
				`output content classList should not contain word-wrap and scrollable ${inserted.classList}`);
			assert.ok(inserted.innerHTML.indexOf('>content</') > -1, `Content was not added to output element: ${outputElement.innerHTML}`);
		});

		test(`Replace content in element for mimetype ${mimeType}`, async () => {
			const context = createContext();
			const renderer = await activate(context);
			assert.ok(renderer, 'Renderer not created');

			const outputElement = new OutputHtml().getFirstOuputElement();
			const outputItem = createOutputItem('content', mimeType);
			await renderer!.renderOutputItem(outputItem, outputElement);
			const outputItem2 = createOutputItem('replaced content', mimeType);
			await renderer!.renderOutputItem(outputItem2, outputElement);

			const inserted = outputElement.firstChild as HTMLElement;
			assert.ok(inserted.innerHTML.indexOf('>content</') === -1, `Old content was not removed to output element: ${outputElement.innerHTML}`);
			assert.ok(inserted.innerHTML.indexOf('>replaced content</') !== -1, `Content was not added to output element: ${outputElement.innerHTML}`);
		});

	});

	test('Append streaming output', async () => {
		const context = createContext({ outputWordWrap: false, outputScrolling: true });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

		const outputElement = new OutputHtml().getFirstOuputElement();
		const outputItem = createOutputItem('content', stdoutMimeType, '123', 'ignoredAppend');
		await renderer!.renderOutputItem(outputItem, outputElement);
		const outputItem2 = createOutputItem('content\nappended', stdoutMimeType, '123', '\nappended');
		await renderer!.renderOutputItem(outputItem2, outputElement);

		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(inserted.innerHTML.indexOf('>content</') !== -1, `Previous content should still exist: ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('ignoredAppend') === -1, `Append value should not be used on first render: ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>appended</') !== -1, `Content was not appended to output element: ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>content</') === inserted.innerHTML.lastIndexOf('>content</'), `Original content should not be duplicated: ${outputElement.innerHTML}`);
	});

	test(`Appending multiple streaming outputs`, async () => {
		const context = createContext({ outputScrolling: true });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

		const outputHtml = new OutputHtml();
		const firstOutputElement = outputHtml.getFirstOuputElement();
		const outputItem1 = createOutputItem('first stream content', stdoutMimeType, '1');
		const outputItem2 = createOutputItem(JSON.stringify(error), errorMimeType, '2');
		const outputItem3 = createOutputItem('second stream content', stdoutMimeType, '3');
		await renderer!.renderOutputItem(outputItem1, firstOutputElement);
		const secondOutputElement = outputHtml.appendOutputElement();
		await renderer!.renderOutputItem(outputItem2, secondOutputElement);
		const thirdOutputElement = outputHtml.appendOutputElement();
		await renderer!.renderOutputItem(outputItem3, thirdOutputElement);

		const appendedItem1 = createOutputItem('', stdoutMimeType, '1', ' appended1');
		await renderer!.renderOutputItem(appendedItem1, firstOutputElement);
		const appendedItem3 = createOutputItem('', stdoutMimeType, '3', ' appended3');
		await renderer!.renderOutputItem(appendedItem3, thirdOutputElement);

		assert.ok(firstOutputElement.innerHTML.indexOf('>first stream content') > -1, `Content was not added to output element: ${outputHtml.cellElement.innerHTML}`);
		assert.ok(firstOutputElement.innerHTML.indexOf('appended1') > -1, `Content was not appended to output element: ${outputHtml.cellElement.innerHTML}`);
		assert.ok(secondOutputElement.innerHTML.indexOf('>TypeError</') > -1, `Content was not added to output element: ${outputHtml.cellElement.innerHTML}`);
		assert.ok(thirdOutputElement.innerHTML.indexOf('>second stream content') > -1, `Content was not added to output element: ${outputHtml.cellElement.innerHTML}`);
		assert.ok(thirdOutputElement.innerHTML.indexOf('appended3') > -1, `Content was not appended to output element: ${outputHtml.cellElement.innerHTML}`);
	});

	test('Append large streaming outputs', async () => {
		const context = createContext({ outputWordWrap: false, outputScrolling: true });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

		const outputElement = new OutputHtml().getFirstOuputElement();
		const lotsOfLines = new Array(4998).fill('line').join('\n');
		const firstOuput = lotsOfLines + 'expected1';
		const outputItem = createOutputItem(firstOuput, stdoutMimeType, '123');
		await renderer!.renderOutputItem(outputItem, outputElement);
		const appended = '\n' + lotsOfLines + 'expectedAppend';
		const outputItem2 = createOutputItem(firstOuput + appended, stdoutMimeType, '123', appended);
		await renderer!.renderOutputItem(outputItem2, outputElement);

		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(inserted.innerHTML.indexOf('expected1') !== -1, `Last bit of previous content should still exist`);
		assert.ok(inserted.innerHTML.indexOf('expectedAppend') !== -1, `Content was not appended to output element`);
	});

	test('Streaming outputs larger than the line limit are truncated', async () => {
		const context = createContext({ outputWordWrap: false, outputScrolling: true });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

		const outputElement = new OutputHtml().getFirstOuputElement();
		const lotsOfLines = new Array(11000).fill('line').join('\n');
		const firstOuput = 'shouldBeTruncated' + lotsOfLines + 'expected1';
		const outputItem = createOutputItem(firstOuput, stdoutMimeType, '123');
		await renderer!.renderOutputItem(outputItem, outputElement);

		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(inserted.innerHTML.indexOf('expected1') !== -1, `Last bit of content should exist`);
		assert.ok(inserted.innerHTML.indexOf('shouldBeTruncated') === -1, `Beginning content should be truncated`);
	});

	test(`Render filepath links in text output when enabled`, async () => {
		LinkDetector.injectedHtmlCreator = (value: string) => value;
		const context = createContext({ outputWordWrap: true, outputScrolling: true, linkifyFilePaths: true });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

		const outputElement = new OutputHtml().getFirstOuputElement();
		const outputItem = createOutputItem('./dir/file.txt', stdoutMimeType);
		await renderer!.renderOutputItem(outputItem, outputElement);

		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(inserted, `nothing appended to output element: ${outputElement.innerHTML}`);
		assert.ok(outputElement.innerHTML.indexOf('<a href="./dir/file.txt">') !== -1, `inner HTML:\n ${outputElement.innerHTML}`);
	});

	test(`No filepath links in text output when disabled`, async () => {
		LinkDetector.injectedHtmlCreator = (value: string) => value;
		const context = createContext({ outputWordWrap: true, outputScrolling: true, linkifyFilePaths: false });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

		const outputElement = new OutputHtml().getFirstOuputElement();
		const outputItem = createOutputItem('./dir/file.txt', stdoutMimeType);
		await renderer!.renderOutputItem(outputItem, outputElement);

		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(inserted, `nothing appended to output element: ${outputElement.innerHTML}`);
		assert.ok(outputElement.innerHTML.indexOf('<a href="./dir/file.txt">') === -1, `inner HTML:\n ${outputElement.innerHTML}`);
	});

	test(`Render with wordwrap and scrolling for error output`, async () => {
		LinkDetector.injectedHtmlCreator = (value: string) => value;
		const context = createContext({ outputWordWrap: true, outputScrolling: true });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

		const outputElement = new OutputHtml().getFirstOuputElement();
		const outputItem = createOutputItem(JSON.stringify(error), errorMimeType);
		await renderer!.renderOutputItem(outputItem, outputElement);

		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(inserted, `nothing appended to output element: ${outputElement.innerHTML}`);
		assert.ok(outputElement.classList.contains('remove-padding'), 'Padding should be removed for scrollable outputs');
		assert.ok(outputElement.classList.contains('word-wrap') && inserted.classList.contains('scrollable'),
			`output content classList should contain word-wrap and scrollable ${inserted.classList}`);
		assert.ok(inserted.innerHTML.indexOf('>Expected type `str`, but received type') > -1, `Content was not added to output element:\n ${outputElement.innerHTML}`);
		assert.ok(inserted.textContent!.indexOf('Expected type `str`, but received type `<class \'int\'>`') > -1, `Content was not added to output element:\n ${outputElement.textContent}`);
		assert.ok(inserted.textContent!.indexOf('<a href') === -1, 'HTML links should be rendered');
	});

	test(`Replace content in element for error output`, async () => {
		const context = createContext();
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

		const outputElement = new OutputHtml().getFirstOuputElement();
		const outputItem = createOutputItem(JSON.stringify(error), errorMimeType);
		await renderer!.renderOutputItem(outputItem, outputElement);
		const error2: typeof error = { ...error, message: 'new message', stack: 'replaced content' };
		const outputItem2 = createOutputItem(JSON.stringify(error2), errorMimeType);
		await renderer!.renderOutputItem(outputItem2, outputElement);

		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(inserted.innerHTML.indexOf('Expected type `str`, but received type') === -1, `Content was not removed from output element:\n ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>replaced content</') !== -1, `Content was not added to output element:\n ${outputElement.innerHTML}`);
	});

	test(`Multiple adjacent streaming outputs should be consolidated one element`, async () => {
		const context = createContext();
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

		const outputHtml = new OutputHtml();
		const outputElement = outputHtml.getFirstOuputElement();
		const outputItem1 = createOutputItem('first stream content', stdoutMimeType, '1');
		const outputItem2 = createOutputItem('second stream content', stdoutMimeType, '2');
		const outputItem3 = createOutputItem('third stream content', stderrMimeType, '3');
		await renderer!.renderOutputItem(outputItem1, outputElement);
		await renderer!.renderOutputItem(outputItem2, outputHtml.appendOutputElement());
		await renderer!.renderOutputItem(outputItem3, outputHtml.appendOutputElement());


		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(inserted, `nothing appended to output element: ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>first stream content</') > -1, `Content was not added to output element: ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>second stream content</') > -1, `Content was not added to output element: ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>third stream content</') > -1, `Content was not added to output element: ${outputElement.innerHTML}`);
	});

	test(`Consolidated streaming outputs should replace matching outputs correctly`, async () => {
		const context = createContext({ outputScrolling: false });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

		const outputHtml = new OutputHtml();
		const outputElement = outputHtml.getFirstOuputElement();
		const outputItem1 = createOutputItem('first stream content', stdoutMimeType, '1');
		const outputItem2 = createOutputItem('second stream content', stdoutMimeType, '2');
		await renderer!.renderOutputItem(outputItem1, outputElement);
		const secondOutput = outputHtml.appendOutputElement();
		await renderer!.renderOutputItem(outputItem2, secondOutput);
		const newOutputItem1 = createOutputItem('replaced content', stdoutMimeType, '2');
		await renderer!.renderOutputItem(newOutputItem1, secondOutput);


		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(inserted, `nothing appended to output element: ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>first stream content</') > -1, `Content was not added to output element: ${outputHtml.cellElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>replaced content</') > -1, `Content was not added to output element: ${outputHtml.cellElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>second stream content</') === -1, `Content was not replaced in output element: ${outputHtml.cellElement.innerHTML}`);
	});

	test(`Consolidated streaming outputs should append matching outputs correctly`, async () => {
		const context = createContext({ outputScrolling: true });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

		const outputHtml = new OutputHtml();
		const outputElement = outputHtml.getFirstOuputElement();
		const outputItem1 = createOutputItem('first stream content', stdoutMimeType, '1');
		const outputItem2 = createOutputItem('second stream content', stdoutMimeType, '2');
		await renderer!.renderOutputItem(outputItem1, outputElement);
		const secondOutput = outputHtml.appendOutputElement();
		await renderer!.renderOutputItem(outputItem2, secondOutput);
		const appendingOutput = createOutputItem('', stdoutMimeType, '2', ' appended');
		await renderer!.renderOutputItem(appendingOutput, secondOutput);


		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(inserted, `nothing appended to output element: ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>first stream content</') > -1, `Content was not added to output element: ${outputHtml.cellElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>second stream content') > -1, `Second content was not added to ouptut element: ${outputHtml.cellElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('appended') > -1, `Content was not appended to ouptut element: ${outputHtml.cellElement.innerHTML}`);
	});

	test(`Streaming outputs interleaved with other mime types will produce separate outputs`, async () => {
		const context = createContext({ outputScrolling: false });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

		const outputHtml = new OutputHtml();
		const firstOutputElement = outputHtml.getFirstOuputElement();
		const outputItem1 = createOutputItem('first stream content', stdoutMimeType, '1');
		const outputItem2 = createOutputItem(JSON.stringify(error), errorMimeType, '2');
		const outputItem3 = createOutputItem('second stream content', stdoutMimeType, '3');
		await renderer!.renderOutputItem(outputItem1, firstOutputElement);
		const secondOutputElement = outputHtml.appendOutputElement();
		await renderer!.renderOutputItem(outputItem2, secondOutputElement);
		const thirdOutputElement = outputHtml.appendOutputElement();
		await renderer!.renderOutputItem(outputItem3, thirdOutputElement);

		assert.ok(firstOutputElement.innerHTML.indexOf('>first stream content</') > -1, `Content was not added to output element: ${outputHtml.cellElement.innerHTML}`);
		assert.ok(secondOutputElement.innerHTML.indexOf('>TypeError</') > -1, `Content was not added to output element: ${outputHtml.cellElement.innerHTML}`);
		assert.ok(thirdOutputElement.innerHTML.indexOf('>second stream content</') > -1, `Content was not added to output element: ${outputHtml.cellElement.innerHTML}`);
	});

	test(`Multiple adjacent streaming outputs, rerendering the first should erase the rest`, async () => {
		const context = createContext();
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

		const outputHtml = new OutputHtml();
		const outputElement = outputHtml.getFirstOuputElement();
		const outputItem1 = createOutputItem('first stream content', stdoutMimeType, '1');
		const outputItem2 = createOutputItem('second stream content', stdoutMimeType, '2');
		const outputItem3 = createOutputItem('third stream content', stderrMimeType, '3');
		await renderer!.renderOutputItem(outputItem1, outputElement);
		await renderer!.renderOutputItem(outputItem2, outputHtml.appendOutputElement());
		await renderer!.renderOutputItem(outputItem3, outputHtml.appendOutputElement());
		const newOutputItem1 = createOutputItem('replaced content', stderrMimeType, '1');
		await renderer!.renderOutputItem(newOutputItem1, outputElement);


		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(inserted, `nothing appended to output element: ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>replaced content</') > -1, `Content was not added to output element: ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>first stream content</') === -1, `Content was not cleared: ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>second stream content</') === -1, `Content was not cleared: ${outputElement.innerHTML}`);
		assert.ok(inserted.innerHTML.indexOf('>third stream content</') === -1, `Content was not cleared: ${outputElement.innerHTML}`);
	});

	test(`Rendered output will wrap on settings change event`, async () => {
		const context = createContext({ outputWordWrap: false, outputScrolling: true });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

		const outputElement = new OutputHtml().getFirstOuputElement();
		const outputItem = createOutputItem('content', stdoutMimeType);
		await renderer!.renderOutputItem(outputItem, outputElement);
		fireSettingsChange({ outputWordWrap: true, outputScrolling: true });

		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(outputElement.classList.contains('word-wrap') && inserted.classList.contains('scrollable'),
			`output content classList should contain word-wrap and scrollable ${inserted.classList}`);
	});

	test(`Settings event change listeners should not grow if output is re-rendered`, async () => {
		const context = createContext({ outputWordWrap: false });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

		const outputElement = new OutputHtml().getFirstOuputElement();
		await renderer!.renderOutputItem(createOutputItem('content', stdoutMimeType), outputElement);
		const handlerCount = settingsChangedHandlers.length;
		await renderer!.renderOutputItem(createOutputItem('content', stdoutMimeType), outputElement);

		assert.equal(settingsChangedHandlers.length, handlerCount);
	});

	const rawIPythonError = {
		name: 'NameError',
		message: `name 'x' is not defined`,
		stack: '\u001b[1;31m---------------------------------------------------------------------------\u001b[0m' +
			'\u001b[1;31mNameError\u001b[0m                                 Traceback (most recent call last)' +
			'Cell \u001b[1;32mIn[2], line 1\u001b[0m\n\u001b[1;32m----> 1\u001b[0m \u001b[43mmyfunc\u001b[49m\u001b[43m(\u001b[49m\u001b[43m)\u001b[49m\n' +
			'Cell \u001b[1;32mIn[1], line 2\u001b[0m, in \u001b[0;36mmyfunc\u001b[1;34m()\u001b[0m\n\u001b[0;32m      1\u001b[0m \u001b[38;5;28;01mdef\u001b[39;00m \u001b[38;5;21mmyfunc\u001b[39m():\n\u001b[1;32m----> 2\u001b[0m     \u001b[38;5;28mprint\u001b[39m(\u001b[43mx\u001b[49m)\n' +
			`\u001b[1;31mNameError\u001b[0m: name 'x' is not defined`
	};

	test(`Should clean up raw IPython error stack traces`, async () => {
		LinkDetector.injectedHtmlCreator = (value: string) => value;
		const context = createContext({ outputWordWrap: true, outputScrolling: true });
		const renderer = await activate(context);
		assert.ok(renderer, 'Renderer not created');

		const outputElement = new OutputHtml().getFirstOuputElement();
		const outputItem = createOutputItem(JSON.stringify(rawIPythonError), errorMimeType);
		await renderer!.renderOutputItem(outputItem, outputElement);

		const inserted = outputElement.firstChild as HTMLElement;
		assert.ok(inserted, `nothing appended to output element: ${outputElement.innerHTML}`);
		assert.ok(outputElement.innerHTML.indexOf('class="code-background-colored"') === -1, `inner HTML:\n ${outputElement.innerHTML}`);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: extensions/notebook-renderers/src/test/stackTraceHelper.test.ts]---
Location: vscode-main/extensions/notebook-renderers/src/test/stackTraceHelper.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { formatStackTrace } from '../stackTraceHelper';
import * as assert from 'assert';

// The stack frames for these tests can be retreived by using the raw json for a notebook with an error
suite('StackTraceHelper', () => {

	test('Non Ipython stack trace is left alone', () => {
		const stack = 'DivideError: integer division error\n' +
			'Stacktrace:\n' +
			'[1] divide_by_zero(x:: Int64)\n' +
			'@Main c:\\src\\test\\3\\otherlanguages\\julia.ipynb: 3\n' +
			'[2] top - level scope\n' +
			'@c:\\src\\test\\3\\otherlanguages\\julia.ipynb: 1; ';
		assert.equal(formatStackTrace(stack, true).formattedStack, stack);
	});

	const formatSequence = /\u001b\[.+?m/g;
	function stripAsciiFormatting(text: string) {
		return text.replace(formatSequence, '');
	}

	test('IPython stack line numbers are linkified for IPython 8.3.6', () => {
		const stack =
			'\u001b[1;31m---------------------------------------------------------------------------\u001b[0m\n' +
			'\u001b[1;31mException\u001b[0m                                 Traceback (most recent call last)\n' +
			'Cell \u001b[1;32mIn[3], line 2\u001b[0m\n' +
			'\u001b[0;32m      1\u001b[0m \u001b[38;5;28;01mimport\u001b[39;00m \u001b[38;5;21;01mmyLib\u001b[39;00m\n' +
			'\u001b[1;32m----> 2\u001b[0m \u001b[43mmyLib\u001b[49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mthrowEx\u001b[49m\u001b[43m(\u001b[49m\u001b[43m)\u001b[49m\n' +
			'\n' +
			'File \u001b[1;32mC:\\venvs\\myLib.py:2\u001b[0m, in \u001b[0;36mthrowEx\u001b[1;34m()\u001b[0m\n' +
			'\u001b[0;32m      1\u001b[0m \u001b[38;5;28;01mdef\u001b[39;00m \u001b[38;5;21mthrowEx\u001b[39m():\n' +
			'\u001b[1;32m----> 2\u001b[0m     \u001b[38;5;28;01mraise\u001b[39;00m \u001b[38;5;167;01mException\u001b[39;00m\n\n' +
			'\u001b[1;31mException\u001b[0m\n:';

		const { formattedStack, errorLocation } = formatStackTrace(stack, true);
		const cleanStack = stripAsciiFormatting(formattedStack);
		assert.ok(cleanStack.indexOf('Cell In[3], <a href=\'vscode-notebook-cell:?execution_count=3&line=2\'>line 2</a>') > 0, 'Missing line link in ' + cleanStack);
		assert.ok(cleanStack.indexOf('<a href=\'vscode-notebook-cell:?execution_count=3&line=2\'>2</a>') > 0, 'Missing frame link in ' + cleanStack);
		assert.ok(cleanStack.indexOf('<a href=\'C:\\venvs\\myLib.py:2\'>2</a>') > 0, 'Missing frame link in ' + cleanStack);
		assert.equal(errorLocation, '<a href=\'vscode-notebook-cell:?execution_count=3&line=2\'>line 2</a>');
	});

	test('IPython stack line numbers are linkified for IPython 9.0.0', () => {
		const stack =
			'\u001b[31m---------------------------------------------------------------------------\u001b[39m\n' +
			'\u001b[31mTypeError\u001b[39m                                 Traceback (most recent call last)\n' +
			'\u001b[36mCell\u001b[39m\u001b[36m \u001b[39m\u001b[32mIn[3]\u001b[39m\u001b[32m, line 2\u001b[39m\n' +
			'\u001b[32m      1\u001b[39m x = firstItem((\u001b[32m1\u001b[39m, \u001b[32m2\u001b[39m, \u001b[32m3\u001b[39m, \u001b[32m5\u001b[39m))\n' +
			'\u001b[32m----> \u001b[39m\u001b[32m2\u001b[39m y = \u001b[43mx\u001b[49m\u001b[43m \u001b[49m\u001b[43m+\u001b[49m\u001b[43m \u001b[49m\u001b[32;43m1\u001b[39;49m\n' +
			'\u001b[32m      3\u001b[39m \u001b[38;5;28mprint\u001b[39m(y)\n' +
			'\n' +
			'\u001b[31mTypeError\u001b[39m: unsupported operand type(s) for +: "NoneType" and "int"\n';

		const { formattedStack, errorLocation } = formatStackTrace(stack, true);
		const cleanStack = stripAsciiFormatting(formattedStack);
		assert.ok(cleanStack.indexOf('Cell In[3], <a href=\'vscode-notebook-cell:?execution_count=3&line=2\'>line 2</a>') > 0, 'Missing line link in ' + cleanStack);
		assert.ok(cleanStack.indexOf('<a href=\'vscode-notebook-cell:?execution_count=3&line=2\'>2</a>') > 0, 'Missing frame link in ' + cleanStack);
		assert.equal(errorLocation, '<a href=\'vscode-notebook-cell:?execution_count=3&line=2\'>line 2</a>');
	});

	test('Does not have catastrophic backtracking https://github.com/microsoft/vscode/issues/251731', () => {
		const stack =
			'\u001b[31m---------------------------------------------------------------------------\u001b[39m\n' +
			'\u001b[31mZeroDivisionError\u001b[39m                         Traceback (most recent call last)\n' +
			'\u001b[36mCell\u001b[39m\u001b[36m \u001b[39m\u001b[32mIn[1]\u001b[39m\u001b[32m, line 2\u001b[39m\n\u001b[32m      1\u001b[39m raw_str = \u001b[33mr\u001b[39m\u001b[33m\"\u001b[39m\u001b[33m\\\u001b[39m\u001b[33ma\u001b[39m\u001b[33m\\\u001b[39m\u001b[33mc\u001b[39m\u001b[33m\\\u001b[39m\u001b[33me\u001b[39m\u001b[33m\\\u001b[39m\u001b[33mf\u001b[39m\u001b[33m\\\u001b[39m\u001b[33mg\u001b[39m\u001b[33m\\\u001b[39m\u001b[33mh\u001b[39m\u001b[33m\\\u001b[39m\u001b[33mi\u001b[39m\u001b[33m\\\u001b[39m\u001b[33mk\u001b[39m\u001b[33m\\\u001b[39m\u001b[33ml\u001b[39m\u001b[33m\\\u001b[39m\u001b[33mm\u001b[39m\u001b[33m\\\u001b[39m\u001b[33mn\u001b[39m\u001b[33m\\\u001b[39m\u001b[33mo\u001b[39m\u001b[33m\"\u001b[39m\n\u001b[32m----> \u001b[39m\u001b[32m2\u001b[39m \u001b[32;43m1\u001b[39;49m\u001b[43m/\u001b[49m\u001b[32;43m0\u001b[39;49m\n\n' +
			'\u001b[31mZeroDivisionError\u001b[39m: division by zero\n';

		const { formattedStack, errorLocation } = formatStackTrace(stack, true);
		const cleanStack = stripAsciiFormatting(formattedStack);
		assert.ok(cleanStack.indexOf('Cell In[1], <a href=\'vscode-notebook-cell:?execution_count=1&line=2\'>line 2</a>') > 0, 'Missing line link in ' + cleanStack);
		assert.ok(cleanStack.indexOf('<a href=\'vscode-notebook-cell:?execution_count=1&line=2\'>2</a>') > 0, 'Missing frame link in ' + cleanStack);
		assert.equal(errorLocation, '<a href=\'vscode-notebook-cell:?execution_count=1&line=2\'>line 2</a>');
	});

	test('Stack trace is not linkified when HTML is not trusted', () => {
		const stack =
			'\u001b[31m---------------------------------------------------------------------------\u001b[39m\n' +
			'\u001b[31mTypeError\u001b[39m                                 Traceback (most recent call last)\n' +
			'\u001b[36mCell\u001b[39m\u001b[36m \u001b[39m\u001b[32mIn[3]\u001b[39m\u001b[32m, line 2\u001b[39m\n' +
			'\u001b[32m      1\u001b[39m x = firstItem((\u001b[32m1\u001b[39m, \u001b[32m2\u001b[39m, \u001b[32m3\u001b[39m, \u001b[32m5\u001b[39m))\n' +
			'\u001b[32m----> \u001b[39m\u001b[32m2\u001b[39m y = \u001b[43mx\u001b[49m\u001b[43m \u001b[49m\u001b[43m+\u001b[49m\u001b[43m \u001b[49m\u001b[32;43m1\u001b[39;49m\n' +
			'\u001b[32m      3\u001b[39m \u001b[38;5;28mprint\u001b[39m(y)\n' +
			'\n' +
			'\u001b[31mTypeError\u001b[39m: unsupported operand type(s) for +: "NoneType" and "int"\n';

		const formattedLines = formatStackTrace(stack, false).formattedStack.split('\n');
		formattedLines.forEach(line => assert.ok(!/<a href=.*>/.test(line), 'line should not contain a link: ' + line));
	});

	test('IPython stack line numbers are linkified for IPython 8.3', () => {
		// stack frames within functions do not list the line number, i.e.
		// 'Input In [1], in myfunc()' vs
		// 'Input In [2], in <cell line: 5>()'
		const stack =
			'\u001b[1;31m---------------------------------------------------------------------------\u001b[0m\n' +
			'\u001b[1;31mException\u001b[0m                                 Traceback (most recent call last)\n' +
			'Input \u001b[1;32mIn [2]\u001b[0m, in \u001b[0;36m<cell line: 5>\u001b[1;34m()\u001b[0m\n' +
			'\u001b[0;32m      3\u001b[0m \u001b[38;5;28mprint\u001b[39m(\u001b[38;5;124m\'\u001b[39m\u001b[38;5;124mipykernel\u001b[39m\u001b[38;5;124m\'\u001b[39m, ipykernel\u001b[38;5;241m.\u001b[39m__version__)\n' +
			'\u001b[0;32m      4\u001b[0m \u001b[38;5;28mprint\u001b[39m(\u001b[38;5;124m\'\u001b[39m\u001b[38;5;124mipython\u001b[39m\u001b[38;5;124m\'\u001b[39m, IPython\u001b[38;5;241m.\u001b[39m__version__)\n' +
			'\u001b[1;32m----> 5\u001b[0m \u001b[43mmyfunc\u001b[49m\u001b[43m(\u001b[49m\u001b[43m)\u001b[49m\n' +
			'\n\n' +
			'Input \u001b[1;32mIn [1]\u001b[0m, in \u001b[0;36mmyfunc\u001b[1;34m()\u001b[0m\n' +
			'\u001b[0;32m      3\u001b[0m \u001b[38;5;28;01mdef\u001b[39;00m \u001b[38;5;21mmyfunc\u001b[39m():\n' +
			'\u001b[1;32m----> 4\u001b[0m     \u001b[43mmyLib\u001b[49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mthrowEx\u001b[49m\u001b[43m(\u001b[49m\u001b[43m)\u001b[49m\n' +
			'\n\n' +
			'File \u001b[1;32mC:\\venvs\\myLib.py:2\u001b[0m, in \u001b[0;36mthrowEx\u001b[1;34m()\u001b[0m\n' +
			'\u001b[0;32m      1\u001b[0m \u001b[38;5;28;01mdef\u001b[39;00m \u001b[38;5;21mthrowEx\u001b[39m():\n' +
			'\u001b[1;32m----> 2\u001b[0m     \u001b[38;5;28;01mraise\u001b[39;00m \u001b[38;5;167;01mException\u001b[39;00m\n' +
			'\n' +
			'\u001b[1;31mException\u001b[0m:\n';

		const { formattedStack } = formatStackTrace(stack, true);
		const formatted = stripAsciiFormatting(formattedStack);
		assert.ok(formatted.indexOf('Input <a href=\'vscode-notebook-cell:?execution_count=2\'>In [2]</a>, in <cell line: 5>') > 0, 'Missing cell link in ' + formatted);
		assert.ok(formatted.indexOf('Input <a href=\'vscode-notebook-cell:?execution_count=1\'>In [1]</a>, in myfunc()') > 0, 'Missing cell link in ' + formatted);
		assert.ok(formatted.indexOf('<a href=\'vscode-notebook-cell:?execution_count=2&line=5\'>5</a>') > 0, 'Missing frame link in ' + formatted);
	});

	test('IPython stack trace lines without associated location are not linkified', () => {
		const stack =
			'\u001b[1;31m---------------------------------------------------------------------------\u001b[0m\n' +
			'\u001b[1;31mException\u001b[0m                                 Traceback (most recent call last)\n' +
			'Cell \u001b[1;32mIn[3], line 2\u001b[0m\n' +
			'\n' +
			'unknown source\n' +
			'\u001b[0;32m      1\u001b[0m \u001b[38;5;28;01mdef\u001b[39;00m \u001b[38;5;21mthrowEx\u001b[39m():\n' +
			'\u001b[1;32m----> 2\u001b[0m     \u001b[38;5;28;01mraise\u001b[39;00m \u001b[38;5;167;01mException\u001b[39;00m\n\n' +
			'\u001b[1;31mException\u001b[0m\n:';

		const formatted = formatStackTrace(stack, true).formattedStack;
		assert.ok(!/<a href=.*>\d<\/a>/.test(formatted), formatted);
	});

	test('IPython stack without line numbers are not linkified', () => {
		const stack =
			'\u001b[1;36m  Cell \u001b[1;32mIn[6], line 1\u001b[1;36m\u001b[0m\n' +
			'\u001b[1;33m    print(\u001b[0m\n' +
			'\u001b[1;37m          ^\u001b[0m\n' +
			'\u001b[1;31mSyntaxError\u001b[0m\u001b[1;31m:\u001b[0m incomplete input\n' +
			// contrived examples to check for more false positives
			'1  print(\n' +
			'a 1  print(\n' +
			'   1a  print(\n';

		const formattedLines = formatStackTrace(stack, true).formattedStack.split('\n');
		assert.ok(/<a href='vscode-notebook-cell.*>/.test(formattedLines[0]), 'line should contain a link: ' + formattedLines[0]);
		formattedLines.slice(1).forEach(line => assert.ok(!/<a href=.*>/.test(line), 'line should not contain a link: ' + line));
	});

	test('background (40-49) ANSI colors are removed', () => {
		const stack =
			'open\u001b[39;49m\u001b[43m(\u001b[49m\u001b[33;43m\'\u001b[39;49m\u001b[33;43minput.txt\u001b[39;49m\u001b[33;43m\'\u001b[39;49m\u001b[43m)\u001b[49m;';

		const formattedLines = formatStackTrace(stack, true).formattedStack.split('\n');
		assert.ok(!/4\d/.test(formattedLines[0]), 'should not contain background colors ' + formattedLines[0]);
		formattedLines.slice(1).forEach(line => assert.ok(!/<a href=.*>/.test(line), 'line should not contain a link: ' + line));
	});

});
```

--------------------------------------------------------------------------------

---[FILE: extensions/npm/.npmrc]---
Location: vscode-main/extensions/npm/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/npm/.vscodeignore]---
Location: vscode-main/extensions/npm/.vscodeignore

```text
src/**
out/**
tsconfig.json
.vscode/**
extension.webpack.config.js
extension-browser.webpack.config.js
package-lock.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/npm/extension-browser.webpack.config.js]---
Location: vscode-main/extensions/npm/extension-browser.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import { browser as withBrowserDefaults } from '../shared.webpack.config.mjs';

const config = withBrowserDefaults({
	context: import.meta.dirname,
	entry: {
		extension: './src/npmBrowserMain.ts'
	},
	output: {
		filename: 'npmBrowserMain.js'
	},
	resolve: {
		fallback: {
			'child_process': false
		}
	}
});

export default config;
```

--------------------------------------------------------------------------------

---[FILE: extensions/npm/extension.webpack.config.js]---
Location: vscode-main/extensions/npm/extension.webpack.config.js

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
		extension: './src/npmMain.ts',
	},
	output: {
		filename: 'npmMain.js',
	},
	resolve: {
		mainFields: ['module', 'main'],
		extensions: ['.ts', '.js'] // support ts-files and js-files
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/npm/package-lock.json]---
Location: vscode-main/extensions/npm/package-lock.json

```json
{
  "name": "npm",
  "version": "1.0.1",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "npm",
      "version": "1.0.1",
      "license": "MIT",
      "dependencies": {
        "find-up": "^5.0.0",
        "find-yarn-workspace-root": "^2.0.0",
        "jsonc-parser": "^3.2.0",
        "minimatch": "^5.1.6",
        "request-light": "^0.7.0",
        "vscode-uri": "^3.0.8",
        "which": "^4.0.0",
        "which-pm": "^2.1.1"
      },
      "devDependencies": {
        "@types/minimatch": "^5.1.2",
        "@types/node": "22.x",
        "@types/which": "^3.0.0"
      },
      "engines": {
        "vscode": "0.10.x"
      }
    },
    "node_modules/@types/minimatch": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/@types/minimatch/-/minimatch-5.1.2.tgz",
      "integrity": "sha512-K0VQKziLUWkVKiRVrx4a40iPaxTUefQmjtkQofBkYRcoaaL/8rhwDWww9qWbrgicNOgnpIsMxyNIUM4+n6dUIA==",
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
    "node_modules/@types/which": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/@types/which/-/which-3.0.0.tgz",
      "integrity": "sha512-ASCxdbsrwNfSMXALlC3Decif9rwDMu+80KGp5zI2RLRotfMsTv7fHL8W8VDp24wymzDyIFudhUeSCugrgRFfHQ==",
      "dev": true
    },
    "node_modules/argparse": {
      "version": "1.0.9",
      "resolved": "https://registry.npmjs.org/argparse/-/argparse-1.0.9.tgz",
      "integrity": "sha1-c9g7wmP4bpf4zE9rrhsOkKfSLIY= sha512-iK7YPKV+GsvihPUTKcM3hh2gq47zSFCpVDv/Ay2O9mzuD7dfvLV4vhms4XcjZvv4VRgXuGLMEts51IlTjS11/A==",
      "dependencies": {
        "sprintf-js": "~1.0.2"
      }
    },
    "node_modules/balanced-match": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.0.tgz",
      "integrity": "sha1-ibTRmasr7kneFk6gK4nORi1xt2c= sha512-9Y0g0Q8rmSt+H33DfKv7FOc3v+iRI+o1lbzt8jGcIosYW37IIW/2XVYq5NPdmaD5NQ59Nk26Kl/vZbwW9Fr8vg=="
    },
    "node_modules/brace-expansion": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-2.0.2.tgz",
      "integrity": "sha512-Jt0vHyM+jmUBqojB7E1NIYadt0vI0Qxjxd2TErW94wDz+E2LAm5vKMXXwg6ZZBTHPuUlDgQHKXvjGBdfcF1ZDQ==",
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^1.0.0"
      }
    },
    "node_modules/braces": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/braces/-/braces-3.0.3.tgz",
      "integrity": "sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==",
      "dependencies": {
        "fill-range": "^7.1.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/esprima": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/esprima/-/esprima-4.0.1.tgz",
      "integrity": "sha512-eGuFFw7Upda+g4p+QHvnW0RyTX/SVeJBDM/gCtMARO0cLuT2HcEKnTPvhjV6aGeqrCB/sbNop0Kszm0jsaWU4A==",
      "bin": {
        "esparse": "bin/esparse.js",
        "esvalidate": "bin/esvalidate.js"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/fill-range": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/fill-range/-/fill-range-7.1.1.tgz",
      "integrity": "sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==",
      "dependencies": {
        "to-regex-range": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/find-up": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/find-up/-/find-up-5.0.0.tgz",
      "integrity": "sha512-78/PXT1wlLLDgTzDs7sjq9hzz0vXD+zn+7wypEe4fXQxCmdmqfGsEPQxmiCSQI3ajFV91bVSsvNtrJRiW6nGng==",
      "dependencies": {
        "locate-path": "^6.0.0",
        "path-exists": "^4.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/find-yarn-workspace-root": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/find-yarn-workspace-root/-/find-yarn-workspace-root-2.0.0.tgz",
      "integrity": "sha512-1IMnbjt4KzsQfnhnzNd8wUEgXZ44IzZaZmnLYx7D5FZlaHt2gW20Cri8Q+E/t5tIj4+epTBub+2Zxu/vNILzqQ==",
      "dependencies": {
        "micromatch": "^4.0.2"
      }
    },
    "node_modules/graceful-fs": {
      "version": "4.2.4",
      "resolved": "https://registry.npmjs.org/graceful-fs/-/graceful-fs-4.2.4.tgz",
      "integrity": "sha512-WjKPNJF79dtJAVniUlGGWHYGz2jWxT6VhN/4m1NdkbZ2nOsEF+cI1Edgql5zCRhs/VsQYRvrXctxktVXZUkixw=="
    },
    "node_modules/is-number": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/is-number/-/is-number-7.0.0.tgz",
      "integrity": "sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==",
      "engines": {
        "node": ">=0.12.0"
      }
    },
    "node_modules/isexe": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/isexe/-/isexe-3.1.1.tgz",
      "integrity": "sha512-LpB/54B+/2J5hqQ7imZHfdU31OlgQqx7ZicVlkm9kzg9/w8GKLEcFfJl/t7DCEDueOyBAD6zCCwTO6Fzs0NoEQ==",
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/js-yaml": {
      "version": "3.14.2",
      "resolved": "https://registry.npmjs.org/js-yaml/-/js-yaml-3.14.2.tgz",
      "integrity": "sha512-PMSmkqxr106Xa156c2M265Z+FTrPl+oxd/rgOQy2tijQeK5TxQ43psO1ZCwhVOSdnn+RzkzlRz/eY4BgJBYVpg==",
      "license": "MIT",
      "dependencies": {
        "argparse": "^1.0.7",
        "esprima": "^4.0.0"
      },
      "bin": {
        "js-yaml": "bin/js-yaml.js"
      }
    },
    "node_modules/jsonc-parser": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/jsonc-parser/-/jsonc-parser-3.2.0.tgz",
      "integrity": "sha512-gfFQZrcTc8CnKXp6Y4/CBT3fTc0OVuDofpre4aEeEpSBPV5X5v4+Vmx+8snU7RLPrNHPKSgLxGo9YuQzz20o+w=="
    },
    "node_modules/load-yaml-file": {
      "version": "0.2.0",
      "resolved": "https://registry.npmjs.org/load-yaml-file/-/load-yaml-file-0.2.0.tgz",
      "integrity": "sha512-OfCBkGEw4nN6JLtgRidPX6QxjBQGQf72q3si2uvqyFEMbycSFFHwAZeXx6cJgFM9wmLrf9zBwCP3Ivqa+LLZPw==",
      "dependencies": {
        "graceful-fs": "^4.1.5",
        "js-yaml": "^3.13.0",
        "pify": "^4.0.1",
        "strip-bom": "^3.0.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/locate-path": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/locate-path/-/locate-path-6.0.0.tgz",
      "integrity": "sha512-iPZK6eYjbxRu3uB4/WZ3EsEIMJFMqAoopl3R+zuq0UjcAm/MO6KCweDgPfP3elTztoKP3KtnVHxTn2NHBSDVUw==",
      "dependencies": {
        "p-locate": "^5.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/micromatch": {
      "version": "4.0.8",
      "resolved": "https://registry.npmjs.org/micromatch/-/micromatch-4.0.8.tgz",
      "integrity": "sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==",
      "license": "MIT",
      "dependencies": {
        "braces": "^3.0.3",
        "picomatch": "^2.3.1"
      },
      "engines": {
        "node": ">=8.6"
      }
    },
    "node_modules/minimatch": {
      "version": "5.1.6",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-5.1.6.tgz",
      "integrity": "sha512-lKwV/1brpG6mBUFHtb7NUmtABCb2WZZmm2wNiOA5hAb8VdCS4B3dtMWyvcoViccwAW/COERjXLt0zP1zXUN26g==",
      "dependencies": {
        "brace-expansion": "^2.0.1"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/p-limit": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/p-limit/-/p-limit-3.1.0.tgz",
      "integrity": "sha512-TYOanM3wGwNGsZN2cVTYPArw454xnXj5qmWF1bEoAc4+cU/ol7GVh7odevjp1FNHduHc3KZMcFduxU5Xc6uJRQ==",
      "dependencies": {
        "yocto-queue": "^0.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/p-locate": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/p-locate/-/p-locate-5.0.0.tgz",
      "integrity": "sha512-LaNjtRWUBY++zB5nE/NwcaoMylSPk+S+ZHNB1TzdbMJMny6dynpAGt7X/tl/QYq3TIeE6nxHppbo2LGymrG5Pw==",
      "dependencies": {
        "p-limit": "^3.0.2"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/path-exists": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/path-exists/-/path-exists-4.0.0.tgz",
      "integrity": "sha512-ak9Qy5Q7jYb2Wwcey5Fpvg2KoAc/ZIhLSLOSBmRmygPsGwkVVt0fZa0qrtMz+m6tJTAHfZQ8FnmB4MG4LWy7/w==",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/picomatch": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-2.3.1.tgz",
      "integrity": "sha512-JU3teHTNjmE2VCGFzuY8EXzCDVwEqB2a8fsIvwaStHhAWJEeVd1o1QD80CU6+ZdEXXSLbSsuLwJjkCBWqRQUVA==",
      "license": "MIT",
      "engines": {
        "node": ">=8.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/pify": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/pify/-/pify-4.0.1.tgz",
      "integrity": "sha512-uB80kBFb/tfd68bVleG9T5GGsGPjJrLAUpR5PZIrhBnIaRTQRjqdJSsIKkOP6OAIFbj7GOrcudc5pNjZ+geV2g==",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/request-light": {
      "version": "0.7.0",
      "resolved": "https://registry.npmjs.org/request-light/-/request-light-0.7.0.tgz",
      "integrity": "sha512-lMbBMrDoxgsyO+yB3sDcrDuX85yYt7sS8BfQd11jtbW/z5ZWgLZRcEGLsLoYw7I0WSUGQBs8CC8ScIxkTX1+6Q=="
    },
    "node_modules/sprintf-js": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/sprintf-js/-/sprintf-js-1.0.3.tgz",
      "integrity": "sha1-BOaSb2YolTVPPdAVIDYzuFcpfiw= sha512-D9cPgkvLlV3t3IzL0D0YLvGA9Ahk4PcvVwUbN0dSGr1aP0Nrt4AEnTUbuGvquEC0mA64Gqt1fzirlRs5ibXx8g=="
    },
    "node_modules/strip-bom": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/strip-bom/-/strip-bom-3.0.0.tgz",
      "integrity": "sha1-IzTBjpx1n3vdVv3vfprj1YjmjtM= sha512-vavAMRXOgBVNF6nyEEmL3DBK19iRpDcoIwW+swQ+CbGiu7lju6t+JklA1MHweoWtadgt4ISVUsXLyDq34ddcwA==",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/to-regex-range": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/to-regex-range/-/to-regex-range-5.0.1.tgz",
      "integrity": "sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==",
      "dependencies": {
        "is-number": "^7.0.0"
      },
      "engines": {
        "node": ">=8.0"
      }
    },
    "node_modules/undici-types": {
      "version": "6.20.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.20.0.tgz",
      "integrity": "sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/vscode-uri": {
      "version": "3.0.8",
      "resolved": "https://registry.npmjs.org/vscode-uri/-/vscode-uri-3.0.8.tgz",
      "integrity": "sha512-AyFQ0EVmsOZOlAnxoFOGOq1SQDWAB7C6aqMGS23svWAllfOaxbuFvcT8D1i8z3Gyn8fraVeZNNmN6e9bxxXkKw=="
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
    },
    "node_modules/which-pm": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/which-pm/-/which-pm-2.1.1.tgz",
      "integrity": "sha512-xzzxNw2wMaoCWXiGE8IJ9wuPMU+EYhFksjHxrRT8kMT5SnocBPRg69YAMtyV4D12fP582RA+k3P8H9J5EMdIxQ==",
      "dependencies": {
        "load-yaml-file": "^0.2.0",
        "path-exists": "^4.0.0"
      },
      "engines": {
        "node": ">=8.15"
      }
    },
    "node_modules/yocto-queue": {
      "version": "0.1.0",
      "resolved": "https://registry.npmjs.org/yocto-queue/-/yocto-queue-0.1.0.tgz",
      "integrity": "sha512-rVksvsnNCdJ/ohGc6xgPwyN8eheCxsiLM8mxuE/t/mOVqJewPuO1miLpTHQiRgTKCLexL4MeAFVagts7HmNZ2Q==",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/npm/package.json]---
Location: vscode-main/extensions/npm/package.json

```json
{
  "name": "npm",
  "publisher": "vscode",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.1",
  "private": true,
  "license": "MIT",
  "engines": {
    "vscode": "0.10.x"
  },
  "icon": "images/npm_icon.png",
  "categories": [
    "Other"
  ],
  "enabledApiProposals": [
    "terminalQuickFixProvider"
  ],
  "scripts": {
    "compile": "npx gulp compile-extension:npm",
    "watch": "npx gulp watch-extension:npm"
  },
  "dependencies": {
    "find-up": "^5.0.0",
    "find-yarn-workspace-root": "^2.0.0",
    "jsonc-parser": "^3.2.0",
    "minimatch": "^5.1.6",
    "request-light": "^0.7.0",
    "which": "^4.0.0",
    "which-pm": "^2.1.1",
    "vscode-uri": "^3.0.8"
  },
  "devDependencies": {
    "@types/minimatch": "^5.1.2",
    "@types/node": "22.x",
    "@types/which": "^3.0.0"
  },
  "main": "./out/npmMain",
  "browser": "./dist/browser/npmBrowserMain",
  "activationEvents": [
    "onTaskType:npm",
    "onLanguage:json",
    "workspaceContains:package.json"
  ],
  "capabilities": {
    "virtualWorkspaces": {
      "supported": "limited",
      "description": "%virtualWorkspaces%"
    },
    "untrustedWorkspaces": {
      "supported": "limited",
      "description": "%workspaceTrust%"
    }
  },
  "contributes": {
    "languages": [
      {
        "id": "ignore",
        "extensions": [
          ".npmignore"
        ]
      },
      {
        "id": "properties",
        "extensions": [
          ".npmrc"
        ]
      }
    ],
    "views": {
      "explorer": [
        {
          "id": "npm",
          "name": "%view.name%",
          "when": "npm:showScriptExplorer",
          "icon": "$(json)",
          "visibility": "hidden",
          "contextualTitle": "%view.name%"
        }
      ]
    },
    "commands": [
      {
        "command": "npm.runScript",
        "title": "%command.run%",
        "icon": "$(run)"
      },
      {
        "command": "npm.debugScript",
        "title": "%command.debug%",
        "icon": "$(debug)"
      },
      {
        "command": "npm.openScript",
        "title": "%command.openScript%"
      },
      {
        "command": "npm.runInstall",
        "title": "%command.runInstall%"
      },
      {
        "command": "npm.refresh",
        "title": "%command.refresh%",
        "icon": "$(refresh)"
      },
      {
        "command": "npm.runSelectedScript",
        "title": "%command.runSelectedScript%"
      },
      {
        "command": "npm.runScriptFromFolder",
        "title": "%command.runScriptFromFolder%"
      },
      {
        "command": "npm.packageManager",
        "title": "%command.packageManager%"
      }
    ],
    "menus": {
      "commandPalette": [
        {
          "command": "npm.refresh",
          "when": "false"
        },
        {
          "command": "npm.runScript",
          "when": "false"
        },
        {
          "command": "npm.debugScript",
          "when": "false"
        },
        {
          "command": "npm.openScript",
          "when": "false"
        },
        {
          "command": "npm.runInstall",
          "when": "false"
        },
        {
          "command": "npm.runSelectedScript",
          "when": "false"
        },
        {
          "command": "npm.runScriptFromFolder",
          "when": "false"
        },
        {
          "command": "npm.packageManager",
          "when": "false"
        }
      ],
      "editor/context": [
        {
          "command": "npm.runSelectedScript",
          "when": "resourceFilename == 'package.json' && resourceScheme == file",
          "group": "navigation@+1"
        }
      ],
      "view/title": [
        {
          "command": "npm.refresh",
          "when": "view == npm",
          "group": "navigation"
        }
      ],
      "view/item/context": [
        {
          "command": "npm.openScript",
          "when": "view == npm && viewItem == packageJSON",
          "group": "navigation@1"
        },
        {
          "command": "npm.runInstall",
          "when": "view == npm && viewItem == packageJSON",
          "group": "navigation@2"
        },
        {
          "command": "npm.openScript",
          "when": "view == npm && viewItem == script",
          "group": "navigation@1"
        },
        {
          "command": "npm.runScript",
          "when": "view == npm && viewItem == script",
          "group": "navigation@2"
        },
        {
          "command": "npm.runScript",
          "when": "view == npm && viewItem == script",
          "group": "inline"
        },
        {
          "command": "npm.debugScript",
          "when": "view == npm && viewItem == script",
          "group": "inline"
        },
        {
          "command": "npm.debugScript",
          "when": "view == npm && viewItem == script",
          "group": "navigation@3"
        }
      ],
      "explorer/context": [
        {
          "when": "config.npm.enableRunFromFolder && explorerViewletVisible && explorerResourceIsFolder && resourceScheme == file",
          "command": "npm.runScriptFromFolder",
          "group": "2_workspace"
        }
      ]
    },
    "configuration": {
      "id": "npm",
      "type": "object",
      "title": "Npm",
      "properties": {
        "npm.autoDetect": {
          "type": "string",
          "enum": [
            "off",
            "on"
          ],
          "default": "on",
          "scope": "resource",
          "description": "%config.npm.autoDetect%"
        },
        "npm.runSilent": {
          "type": "boolean",
          "default": false,
          "scope": "resource",
          "markdownDescription": "%config.npm.runSilent%"
        },
        "npm.packageManager": {
          "scope": "resource",
          "type": "string",
          "enum": [
            "auto",
            "npm",
            "yarn",
            "pnpm",
            "bun"
          ],
          "enumDescriptions": [
            "%config.npm.packageManager.auto%",
            "%config.npm.packageManager.npm%",
            "%config.npm.packageManager.yarn%",
            "%config.npm.packageManager.pnpm%",
            "%config.npm.packageManager.bun%"
          ],
          "default": "auto",
          "description": "%config.npm.packageManager%"
        },
        "npm.scriptRunner": {
          "scope": "resource",
          "type": "string",
          "enum": [
            "auto",
            "npm",
            "yarn",
            "pnpm",
            "bun",
            "node"
          ],
          "enumDescriptions": [
            "%config.npm.scriptRunner.auto%",
            "%config.npm.scriptRunner.npm%",
            "%config.npm.scriptRunner.yarn%",
            "%config.npm.scriptRunner.pnpm%",
            "%config.npm.scriptRunner.bun%",
            "%config.npm.scriptRunner.node%"
          ],
          "default": "auto",
          "description": "%config.npm.scriptRunner%"
        },
        "npm.exclude": {
          "type": [
            "string",
            "array"
          ],
          "items": {
            "type": "string"
          },
          "description": "%config.npm.exclude%",
          "scope": "resource"
        },
        "npm.enableScriptExplorer": {
          "type": "boolean",
          "default": false,
          "scope": "resource",
          "deprecationMessage": "The NPM Script Explorer is now available in 'Views' menu in the Explorer in all folders.",
          "description": "%config.npm.enableScriptExplorer%"
        },
        "npm.enableRunFromFolder": {
          "type": "boolean",
          "default": false,
          "scope": "resource",
          "description": "%config.npm.enableRunFromFolder%"
        },
        "npm.scriptExplorerAction": {
          "type": "string",
          "enum": [
            "open",
            "run"
          ],
          "markdownDescription": "%config.npm.scriptExplorerAction%",
          "scope": "window",
          "default": "open"
        },
        "npm.scriptExplorerExclude": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "markdownDescription": "%config.npm.scriptExplorerExclude%",
          "scope": "resource",
          "default": []
        },
        "npm.fetchOnlinePackageInfo": {
          "type": "boolean",
          "description": "%config.npm.fetchOnlinePackageInfo%",
          "default": true,
          "scope": "window",
          "tags": [
            "usesOnlineServices"
          ]
        },
        "npm.scriptHover": {
          "type": "boolean",
          "description": "%config.npm.scriptHover%",
          "default": true,
          "scope": "window"
        }
      }
    },
    "jsonValidation": [
      {
        "fileMatch": "package.json",
        "url": "https://www.schemastore.org/package"
      },
      {
        "fileMatch": "bower.json",
        "url": "https://www.schemastore.org/bower"
      }
    ],
    "taskDefinitions": [
      {
        "type": "npm",
        "required": [
          "script"
        ],
        "properties": {
          "script": {
            "type": "string",
            "description": "%taskdef.script%"
          },
          "path": {
            "type": "string",
            "description": "%taskdef.path%"
          }
        },
        "when": "shellExecutionSupported"
      }
    ],
    "terminalQuickFixes": [
      {
        "id": "ms-vscode.npm-command",
        "commandLineMatcher": "npm",
        "commandExitResult": "error",
        "outputMatcher": {
          "anchor": "bottom",
          "length": 8,
          "lineMatcher": "Did you mean (?:this|one of these)\\?((?:\\n.+?npm .+ #.+)+)",
          "offset": 2
        }
      }
    ]
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/npm/package.nls.json]---
Location: vscode-main/extensions/npm/package.nls.json

```json
{
	"description": "Extension to add task support for npm scripts.",
	"displayName": "NPM support for VS Code",
	"workspaceTrust": "This extension executes tasks, which require trust to run.",
	"virtualWorkspaces": "Functionality that requires running the 'npm' command is not available in virtual workspaces.",
	"config.npm.autoDetect": "Controls whether npm scripts should be automatically detected.",
	"config.npm.runSilent": "Run npm commands with the `--silent` option.",
	"config.npm.packageManager": "The package manager used to install dependencies.",
	"config.npm.packageManager.npm": "Use npm as the package manager.",
	"config.npm.packageManager.yarn": "Use yarn as the package manager.",
	"config.npm.packageManager.pnpm": "Use pnpm as the package manager.",
	"config.npm.packageManager.bun": "Use bun as the package manager.",
	"config.npm.packageManager.auto": "Auto-detect which package manager to use based on lock files and installed package managers.",
	"config.npm.scriptRunner": "The script runner used to run scripts.",
	"config.npm.scriptRunner.npm": "Use npm as the script runner.",
	"config.npm.scriptRunner.yarn": "Use yarn as the script runner.",
	"config.npm.scriptRunner.pnpm": "Use pnpm as the script runner.",
	"config.npm.scriptRunner.bun": "Use bun as the script runner.",
	"config.npm.scriptRunner.node": "Use Node.js as the script runner.",
	"config.npm.scriptRunner.auto": "Auto-detect which script runner to use based on lock files and installed package managers.",
	"config.npm.exclude": "Configure glob patterns for folders that should be excluded from automatic script detection.",
	"config.npm.enableScriptExplorer": "Enable an explorer view for npm scripts when there is no top-level 'package.json' file.",
	"config.npm.scriptExplorerAction": "The default click action used in the NPM Scripts Explorer: `open` or `run`, the default is `open`.",
	"config.npm.scriptExplorerExclude": "An array of regular expressions that indicate which scripts should be excluded from the NPM Scripts view.",
	"config.npm.enableRunFromFolder": "Enable running npm scripts contained in a folder from the Explorer context menu.",
	"config.npm.fetchOnlinePackageInfo": "Fetch data from https://registry.npmjs.org and https://registry.bower.io to provide auto-completion and information on hover features on npm dependencies.",
	"config.npm.scriptHover": "Display hover with 'Run' and 'Debug' commands for scripts.",
	"npm.parseError": "Npm task detection: failed to parse the file {0}",
	"taskdef.script": "The npm script to customize.",
	"taskdef.path": "The path to the folder of the package.json file that provides the script. Can be omitted.",
	"view.name": "NPM Scripts",
	"command.refresh": "Refresh",
	"command.run": "Run",
	"command.debug": "Debug",
	"command.openScript": "Open",
	"command.runInstall": "Run Install",
	"command.runSelectedScript": "Run Script",
	"command.runScriptFromFolder": "Run NPM Script in Folder...",
	"command.packageManager": "Get Configured Package Manager"
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/npm/README.md]---
Location: vscode-main/extensions/npm/README.md

```markdown
# Node npm

**Notice:** This extension is bundled with Visual Studio Code. It can be disabled but not uninstalled.

## Features

### Task Running

This extension supports running npm scripts defined in the `package.json` as [tasks](https://code.visualstudio.com/docs/editor/tasks). Scripts with the name 'build', 'compile', or 'watch'
are treated as build tasks.

To run scripts as tasks, use the **Tasks** menu.

For more information about auto detection of Tasks, see the [documentation](https://code.visualstudio.com/Docs/editor/tasks#_task-autodetection).

### Script Explorer

The Npm Script Explorer shows the npm scripts found in your workspace. The explorer view is enabled by the setting `npm.enableScriptExplorer`. A script can be opened, run, or debug from the explorer.

### Run Scripts from the Editor

The extension supports to run the selected script as a task when editing the `package.json`file. You can either run a script from
the hover shown on a script or using the command `Run Selected Npm Script`.

### Run Scripts from a Folder in the Explorer

The extension supports running a script as a task from a folder in the Explorer. The command  `Run NPM Script in Folder...` shown in the Explorer context menu finds all scripts in `package.json` files that are contained in this folder. You can then select the script to be executed as a task from the resulting list. You enable this support with the `npm.runScriptFromFolder` which is `false` by default.

### Others

The extension fetches data from <https://registry.npmjs.org> and <https://registry.bower.io> to provide auto-completion and information on hover features on npm dependencies.

## Settings

- `npm.autoDetect` - Enable detecting scripts as tasks, the default is `on`.
- `npm.runSilent` - Run npm script with the `--silent` option, the default is `false`.
- `npm.packageManager` - The package manager used to install dependencies: `auto`, `npm`, `yarn`, `pnpm` or `bun`. The default is `auto`, which detects your package manager based on files in your workspace.
- `npm.scriptRunner` - The script runner used to run the scripts: `auto`, `npm`, `yarn`, `pnpm`, `bun` or `node`. The default is `auto`, which detects your script runner based on files in your workspace.
- `npm.exclude` - Glob patterns for folders that should be excluded from automatic script detection. The pattern is matched against the **absolute path** of the package.json. For example, to exclude all test folders use '&ast;&ast;/test/&ast;&ast;'.
- `npm.enableScriptExplorer` - Enable an explorer view for npm scripts.
- `npm.scriptExplorerAction` - The default click action: `open` or `run`, the default is `open`.
- `npm.enableRunFromFolder` - Enable running npm scripts from the context menu of folders in Explorer, the default is `false`.
- `npm.scriptCodeLens.enable` - Enable/disable the code lenses to run a script, the default is `false`.
```

--------------------------------------------------------------------------------

---[FILE: extensions/npm/tsconfig.json]---
Location: vscode-main/extensions/npm/tsconfig.json

```json
{
	"extends": "../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"types": [
			"node"
		],
		"typeRoots": [
			"./node_modules/@types"
		]
	},
	"include": [
		"src/**/*",
		"../../src/vscode-dts/vscode.d.ts",
		"../../src/vscode-dts/vscode.proposed.terminalQuickFixProvider.d.ts",
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/npm/.vscode/launch.json]---
Location: vscode-main/extensions/npm/.vscode/launch.json

```json
{
	"version": "0.2.0",
	"configurations": [
		{
			"name": "Launch Extension",
			"type": "extensionHost",
			"request": "launch",
			"runtimeExecutable": "${execPath}",
			"args": [
				"--extensionDevelopmentPath=${workspaceFolder}"
			],
			"sourceMaps": true,
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/npm/.vscode/tasks.json]---
Location: vscode-main/extensions/npm/.vscode/tasks.json

```json
{
	"version": "2.0.0",
	"command": "npm",
	"type": "shell",
	"presentation": {
		"reveal": "silent",
	},
	"args": ["run", "compile"],
	"isBackground": true,
	"problemMatcher": "$tsc-watch"
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/npm/images/code.svg]---
Location: vscode-main/extensions/npm/images/code.svg

```text
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.32798 5.00905L1.2384 8.09746L4.32798 11.1859L3.5016 12.0123L0 8.51065V7.68427L3.5016 4.18267L4.32798 5.00905ZM12.4984 4.18267L11.672 5.00905L14.7616 8.09746L11.672 11.1859L12.4984 12.0123L16 8.51065V7.68427L12.4984 4.18267ZM4.56142 13.672L5.6049 14.1949L11.4409 2.52291L10.3974 2L4.56142 13.672V13.672Z" fill="black"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: extensions/npm/src/commands.ts]---
Location: vscode-main/extensions/npm/src/commands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

import {
	detectNpmScriptsForFolder,
	findScriptAtPosition,
	runScript,
	IFolderTaskItem
} from './tasks';


export function runSelectedScript(context: vscode.ExtensionContext) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}
	const document = editor.document;
	const contents = document.getText();
	const script = findScriptAtPosition(editor.document, contents, editor.selection.anchor);
	if (script) {
		runScript(context, script, document);
	} else {
		const message = vscode.l10n.t("Could not find a valid npm script at the selection.");
		vscode.window.showErrorMessage(message);
	}
}

export async function selectAndRunScriptFromFolder(context: vscode.ExtensionContext, selectedFolders: vscode.Uri[]) {
	if (selectedFolders.length === 0) {
		return;
	}
	const selectedFolder = selectedFolders[0];

	const taskList: IFolderTaskItem[] = await detectNpmScriptsForFolder(context, selectedFolder);

	if (taskList && taskList.length > 0) {
		const quickPick = vscode.window.createQuickPick<IFolderTaskItem>();
		quickPick.placeholder = 'Select an npm script to run in folder';
		quickPick.items = taskList;

		const toDispose: vscode.Disposable[] = [];

		const pickPromise = new Promise<IFolderTaskItem | undefined>((c) => {
			toDispose.push(quickPick.onDidAccept(() => {
				toDispose.forEach(d => d.dispose());
				c(quickPick.selectedItems[0]);
			}));
			toDispose.push(quickPick.onDidHide(() => {
				toDispose.forEach(d => d.dispose());
				c(undefined);
			}));
		});
		quickPick.show();
		const result = await pickPromise;
		quickPick.dispose();
		if (result) {
			vscode.tasks.executeTask(result.task);
		}
	}
	else {
		vscode.window.showInformationMessage(`No npm scripts found in ${selectedFolder.fsPath}`, { modal: true });
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/npm/src/npmBrowserMain.ts]---
Location: vscode-main/extensions/npm/src/npmBrowserMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as httpRequest from 'request-light';
import * as vscode from 'vscode';
import { addJSONProviders } from './features/jsonContributions';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
	context.subscriptions.push(addJSONProviders(httpRequest.xhr, undefined));
}

export function deactivate(): void {
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/npm/src/npmMain.ts]---
Location: vscode-main/extensions/npm/src/npmMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as httpRequest from 'request-light';
import * as vscode from 'vscode';
import { addJSONProviders } from './features/jsonContributions';
import { runSelectedScript, selectAndRunScriptFromFolder } from './commands';
import { NpmScriptsTreeDataProvider } from './npmView';
import { getScriptRunner, getPackageManager, invalidateTasksCache, NpmTaskProvider, hasPackageJson } from './tasks';
import { invalidateHoverScriptsCache, NpmScriptHoverProvider } from './scriptHover';
import { NpmScriptLensProvider } from './npmScriptLens';
import which from 'which';

let treeDataProvider: NpmScriptsTreeDataProvider | undefined;

function invalidateScriptCaches() {
	invalidateHoverScriptsCache();
	invalidateTasksCache();
	if (treeDataProvider) {
		treeDataProvider.refresh();
	}
}

export async function activate(context: vscode.ExtensionContext): Promise<void> {
	configureHttpRequest();
	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
		if (e.affectsConfiguration('http.proxy') || e.affectsConfiguration('http.proxyStrictSSL')) {
			configureHttpRequest();
		}
	}));

	const npmCommandPath = await getNPMCommandPath();
	context.subscriptions.push(addJSONProviders(httpRequest.xhr, npmCommandPath));
	registerTaskProvider(context);

	treeDataProvider = registerExplorer(context);

	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e) => {
		if (e.affectsConfiguration('npm.exclude') || e.affectsConfiguration('npm.autoDetect') || e.affectsConfiguration('npm.scriptExplorerExclude') || e.affectsConfiguration('npm.runSilent') || e.affectsConfiguration('npm.packageManager') || e.affectsConfiguration('npm.scriptRunner')) {
			invalidateTasksCache();
			if (treeDataProvider) {
				treeDataProvider.refresh();
			}
		}
		if (e.affectsConfiguration('npm.scriptExplorerAction')) {
			if (treeDataProvider) {
				treeDataProvider.refresh();
			}
		}
	}));

	registerHoverProvider(context);

	context.subscriptions.push(vscode.commands.registerCommand('npm.runSelectedScript', runSelectedScript));

	if (await hasPackageJson()) {
		vscode.commands.executeCommand('setContext', 'npm:showScriptExplorer', true);
	}

	context.subscriptions.push(vscode.commands.registerCommand('npm.runScriptFromFolder', selectAndRunScriptFromFolder));
	context.subscriptions.push(vscode.commands.registerCommand('npm.refresh', () => {
		invalidateScriptCaches();
	}));
	context.subscriptions.push(vscode.commands.registerCommand('npm.scriptRunner', (args) => {
		if (args instanceof vscode.Uri) {
			return getScriptRunner(args, context, true);
		}
		return '';
	}));
	context.subscriptions.push(vscode.commands.registerCommand('npm.packageManager', (args) => {
		if (args instanceof vscode.Uri) {
			return getPackageManager(args, context, true);
		}
		return '';
	}));
	context.subscriptions.push(new NpmScriptLensProvider());

	context.subscriptions.push(vscode.window.registerTerminalQuickFixProvider('ms-vscode.npm-command', {
		provideTerminalQuickFixes({ outputMatch }) {
			if (!outputMatch) {
				return;
			}

			const lines = outputMatch.regexMatch[1];
			const fixes: vscode.TerminalQuickFixTerminalCommand[] = [];
			for (const line of lines.split('\n')) {
				// search from the second char, since the lines might be prefixed with
				// "npm ERR!" which comes before the actual command suggestion.
				const begin = line.indexOf('npm', 1);
				if (begin === -1) {
					continue;
				}

				const end = line.lastIndexOf('#');
				fixes.push({ terminalCommand: line.slice(begin, end === -1 ? undefined : end - 1) });
			}

			return fixes;
		},
	}));
}

async function getNPMCommandPath(): Promise<string | undefined> {
	if (vscode.workspace.isTrusted && canRunNpmInCurrentWorkspace()) {
		try {
			return await which(process.platform === 'win32' ? 'npm.cmd' : 'npm');
		} catch (e) {
			return undefined;
		}
	}
	return undefined;
}

function canRunNpmInCurrentWorkspace() {
	if (vscode.workspace.workspaceFolders) {
		return vscode.workspace.workspaceFolders.some(f => f.uri.scheme === 'file');
	}
	return false;
}

let taskProvider: NpmTaskProvider;
function registerTaskProvider(context: vscode.ExtensionContext): vscode.Disposable | undefined {
	if (vscode.workspace.workspaceFolders) {
		const watcher = vscode.workspace.createFileSystemWatcher('**/package.json');
		watcher.onDidChange((_e) => invalidateScriptCaches());
		watcher.onDidDelete((_e) => invalidateScriptCaches());
		watcher.onDidCreate((_e) => invalidateScriptCaches());
		context.subscriptions.push(watcher);

		const workspaceWatcher = vscode.workspace.onDidChangeWorkspaceFolders((_e) => invalidateScriptCaches());
		context.subscriptions.push(workspaceWatcher);

		taskProvider = new NpmTaskProvider(context);
		const disposable = vscode.tasks.registerTaskProvider('npm', taskProvider);
		context.subscriptions.push(disposable);
		return disposable;
	}
	return undefined;
}

function registerExplorer(context: vscode.ExtensionContext): NpmScriptsTreeDataProvider | undefined {
	if (vscode.workspace.workspaceFolders) {
		const treeDataProvider = new NpmScriptsTreeDataProvider(context, taskProvider!);
		const view = vscode.window.createTreeView('npm', { treeDataProvider: treeDataProvider, showCollapseAll: true });
		context.subscriptions.push(view);
		return treeDataProvider;
	}
	return undefined;
}

function registerHoverProvider(context: vscode.ExtensionContext): NpmScriptHoverProvider | undefined {
	if (vscode.workspace.workspaceFolders) {
		const npmSelector: vscode.DocumentSelector = {
			language: 'json',
			scheme: 'file',
			pattern: '**/package.json'
		};
		const provider = new NpmScriptHoverProvider(context);
		context.subscriptions.push(vscode.languages.registerHoverProvider(npmSelector, provider));
		return provider;
	}
	return undefined;
}

function configureHttpRequest() {
	const httpSettings = vscode.workspace.getConfiguration('http');
	httpRequest.configure(httpSettings.get<string>('proxy', ''), httpSettings.get<boolean>('proxyStrictSSL', true));
}

export function deactivate(): void {
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/npm/src/npmScriptLens.ts]---
Location: vscode-main/extensions/npm/src/npmScriptLens.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import {
	CodeLens,
	CodeLensProvider,
	Disposable,
	EventEmitter,
	languages,
	TextDocument,
	Uri,
	workspace,
	l10n
} from 'vscode';
import { readScripts } from './readScripts';
import { getRunScriptCommand } from './tasks';


const enum Constants {
	ConfigKey = 'debug.javascript.codelens.npmScripts',
}

const getFreshLensLocation = () => workspace.getConfiguration().get(Constants.ConfigKey);

/**
 * Npm script lens provider implementation. Can show a "Debug" text above any
 * npm script, or the npm scripts section.
 */
export class NpmScriptLensProvider implements CodeLensProvider, Disposable {
	private lensLocation = getFreshLensLocation();
	private readonly changeEmitter = new EventEmitter<void>();
	private subscriptions: Disposable[] = [];

	/**
	 * @inheritdoc
	 */
	public readonly onDidChangeCodeLenses = this.changeEmitter.event;

	constructor() {
		this.subscriptions.push(
			this.changeEmitter,
			workspace.onDidChangeConfiguration(evt => {
				if (evt.affectsConfiguration(Constants.ConfigKey)) {
					this.lensLocation = getFreshLensLocation();
					this.changeEmitter.fire();
				}
			}),
			languages.registerCodeLensProvider(
				{
					language: 'json',
					pattern: '**/package.json',
				},
				this,
			)
		);
	}

	/**
	 * @inheritdoc
	 */
	public async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
		if (this.lensLocation === 'never') {
			return [];
		}

		const tokens = readScripts(document);
		if (!tokens) {
			return [];
		}

		const title = '$(debug-start) ' + l10n.t("Debug");
		const cwd = path.dirname(document.uri.fsPath);
		if (this.lensLocation === 'top') {
			return [
				new CodeLens(
					tokens.location.range,
					{
						title,
						command: 'extension.js-debug.npmScript',
						arguments: [cwd],
					},
				),
			];
		}

		if (this.lensLocation === 'all') {
			const folder = Uri.joinPath(document.uri, '..');
			return Promise.all(tokens.scripts.map(
				async ({ name, nameRange }) => {
					const runScriptCommand = await getRunScriptCommand(name, folder);
					return new CodeLens(
						nameRange,
						{
							title,
							command: 'extension.js-debug.createDebuggerTerminal',
							arguments: [runScriptCommand.join(' '), workspace.getWorkspaceFolder(document.uri), { cwd }],
						},
					);
				},
			));
		}

		return [];
	}

	/**
	 * @inheritdoc
	 */
	public dispose() {
		this.subscriptions.forEach(s => s.dispose());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/npm/src/npmView.ts]---
Location: vscode-main/extensions/npm/src/npmView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import {
	commands, Event, EventEmitter, ExtensionContext,
	Range,
	Selection, Task,
	TaskGroup, tasks, TextDocument, TextDocumentShowOptions, ThemeIcon, TreeDataProvider, TreeItem, TreeItemLabel, TreeItemCollapsibleState, Uri,
	window, workspace, WorkspaceFolder, Position, Location, l10n
} from 'vscode';
import { readScripts } from './readScripts';
import {
	createInstallationTask, getTaskName, isAutoDetectionEnabled, isWorkspaceFolder, INpmTaskDefinition,
	NpmTaskProvider,
	startDebugging,
	detectPackageManager,
	ITaskWithLocation,
	INSTALL_SCRIPT
} from './tasks';


class Folder extends TreeItem {
	packages: PackageJSON[] = [];
	workspaceFolder: WorkspaceFolder;

	constructor(folder: WorkspaceFolder) {
		super(folder.name, TreeItemCollapsibleState.Expanded);
		this.contextValue = 'folder';
		this.resourceUri = folder.uri;
		this.workspaceFolder = folder;
		this.iconPath = ThemeIcon.Folder;
	}

	addPackage(packageJson: PackageJSON) {
		this.packages.push(packageJson);
	}
}

const packageName = 'package.json';

class PackageJSON extends TreeItem {
	path: string;
	folder: Folder;
	scripts: NpmScript[] = [];

	static getLabel(relativePath: string): string {
		if (relativePath.length > 0) {
			return path.join(relativePath, packageName);
		}
		return packageName;
	}

	constructor(folder: Folder, relativePath: string) {
		super(PackageJSON.getLabel(relativePath), TreeItemCollapsibleState.Expanded);
		this.folder = folder;
		this.path = relativePath;
		this.contextValue = 'packageJSON';
		if (relativePath) {
			this.resourceUri = Uri.file(path.join(folder!.resourceUri!.fsPath, relativePath, packageName));
		} else {
			this.resourceUri = Uri.file(path.join(folder!.resourceUri!.fsPath, packageName));
		}
		this.iconPath = ThemeIcon.File;
	}

	addScript(script: NpmScript) {
		this.scripts.push(script);
	}
}

type ExplorerCommands = 'open' | 'run';

class NpmScript extends TreeItem {
	task: Task;
	package: PackageJSON;
	taskLocation?: Location;

	constructor(_context: ExtensionContext, packageJson: PackageJSON, task: ITaskWithLocation) {
		const name = packageJson.path.length > 0
			? task.task.name.substring(0, task.task.name.length - packageJson.path.length - 2)
			: task.task.name;
		super(name, TreeItemCollapsibleState.None);
		this.taskLocation = task.location;
		const command: ExplorerCommands = name === `${INSTALL_SCRIPT} ` ? 'run' : workspace.getConfiguration('npm').get<ExplorerCommands>('scriptExplorerAction') || 'open';

		const commandList = {
			'open': {
				title: 'Edit Script',
				command: 'vscode.open',
				arguments: [
					this.taskLocation?.uri,
					this.taskLocation ?
						{
							selection: new Range(this.taskLocation.range.start, this.taskLocation.range.start)
						} satisfies TextDocumentShowOptions
						: undefined
				]
			},
			'run': {
				title: 'Run Script',
				command: 'npm.runScript',
				arguments: [this]
			}
		};
		this.contextValue = 'script';
		this.package = packageJson;
		this.task = task.task;
		this.command = commandList[command];

		if (this.task.group && this.task.group === TaskGroup.Clean) {
			this.iconPath = new ThemeIcon('wrench-subaction');
		} else {
			this.iconPath = new ThemeIcon('wrench');
		}
		if (this.task.detail) {
			this.tooltip = this.task.detail;
			this.description = this.task.detail;
		}
	}

	getFolder(): WorkspaceFolder {
		return this.package.folder.workspaceFolder;
	}
}

class NoScripts extends TreeItem {
	constructor(message: string) {
		super(message, TreeItemCollapsibleState.None);
		this.contextValue = 'noscripts';
	}
}

type TaskTree = Folder[] | PackageJSON[] | NoScripts[];

export class NpmScriptsTreeDataProvider implements TreeDataProvider<TreeItem> {
	private taskTree: TaskTree | null = null;
	private extensionContext: ExtensionContext;
	private _onDidChangeTreeData: EventEmitter<TreeItem | null> = new EventEmitter<TreeItem | null>();
	readonly onDidChangeTreeData: Event<TreeItem | null> = this._onDidChangeTreeData.event;

	constructor(private context: ExtensionContext, public taskProvider: NpmTaskProvider) {
		const subscriptions = context.subscriptions;
		this.extensionContext = context;
		subscriptions.push(commands.registerCommand('npm.runScript', this.runScript, this));
		subscriptions.push(commands.registerCommand('npm.debugScript', this.debugScript, this));
		subscriptions.push(commands.registerCommand('npm.openScript', this.openScript, this));
		subscriptions.push(commands.registerCommand('npm.runInstall', this.runInstall, this));
	}

	private async runScript(script: NpmScript) {
		// Call detectPackageManager to trigger the multiple lock files warning.
		await detectPackageManager(script.getFolder().uri, this.context, true);
		tasks.executeTask(script.task);
	}

	private async debugScript(script: NpmScript) {
		startDebugging(this.extensionContext, script.task.definition.script, path.dirname(script.package.resourceUri!.fsPath), script.getFolder());
	}

	private findScriptPosition(document: TextDocument, script?: NpmScript) {
		const scripts = readScripts(document);
		if (!scripts) {
			return undefined;
		}

		if (!script) {
			return scripts.location.range.start;
		}

		const found = scripts.scripts.find(s => getTaskName(s.name, script.task.definition.path) === script.task.name);
		return found?.nameRange.start;
	}

	private async runInstall(selection: PackageJSON) {
		let uri: Uri | undefined = undefined;
		if (selection instanceof PackageJSON) {
			uri = selection.resourceUri;
		}
		if (!uri) {
			return;
		}
		const task = await createInstallationTask(this.context, selection.folder.workspaceFolder, uri);
		tasks.executeTask(task);
	}

	private async openScript(selection: PackageJSON | NpmScript) {
		let uri: Uri | undefined = undefined;
		if (selection instanceof PackageJSON) {
			uri = selection.resourceUri!;
		} else if (selection instanceof NpmScript) {
			uri = selection.package.resourceUri;
		}
		if (!uri) {
			return;
		}
		const document: TextDocument = await workspace.openTextDocument(uri);
		const position = this.findScriptPosition(document, selection instanceof NpmScript ? selection : undefined) || new Position(0, 0);
		await window.showTextDocument(document, { preserveFocus: true, selection: new Selection(position, position) });
	}

	public refresh() {
		this.taskTree = null;
		this._onDidChangeTreeData.fire(null);
	}

	getTreeItem(element: TreeItem): TreeItem {
		return element;
	}

	getParent(element: TreeItem): TreeItem | null {
		if (element instanceof Folder) {
			return null;
		}
		if (element instanceof PackageJSON) {
			return element.folder;
		}
		if (element instanceof NpmScript) {
			return element.package;
		}
		if (element instanceof NoScripts) {
			return null;
		}
		return null;
	}

	async getChildren(element?: TreeItem): Promise<TreeItem[]> {
		if (!this.taskTree) {
			const taskItems = await this.taskProvider.tasksWithLocation;
			if (taskItems) {
				const taskTree = this.buildTaskTree(taskItems);
				this.taskTree = this.sortTaskTree(taskTree);
				if (this.taskTree.length === 0) {
					let message = l10n.t("No scripts found.");
					if (!isAutoDetectionEnabled()) {
						message = l10n.t('The setting "npm.autoDetect" is "off".');
					}
					this.taskTree = [new NoScripts(message)];
				}
			}
		}
		if (element instanceof Folder) {
			return element.packages;
		}
		if (element instanceof PackageJSON) {
			return element.scripts;
		}
		if (element instanceof NpmScript) {
			return [];
		}
		if (element instanceof NoScripts) {
			return [];
		}
		if (!element) {
			if (this.taskTree) {
				return this.taskTree;
			}
		}
		return [];
	}

	private isInstallTask(task: Task): boolean {
		const fullName = getTaskName('install', task.definition.path);
		return fullName === task.name;
	}

	private getTaskTreeItemLabel(taskTreeLabel: string | TreeItemLabel | undefined): string {
		if (taskTreeLabel === undefined) {
			return '';
		}

		if (typeof taskTreeLabel === 'string') {
			return taskTreeLabel;
		}

		return taskTreeLabel.label;
	}

	private sortTaskTree(taskTree: TaskTree) {
		return taskTree.sort((first: TreeItem, second: TreeItem) => {
			const firstLabel = this.getTaskTreeItemLabel(first.label);
			const secondLabel = this.getTaskTreeItemLabel(second.label);
			return firstLabel.localeCompare(secondLabel);
		});
	}

	private buildTaskTree(tasks: ITaskWithLocation[]): TaskTree {
		const folders: Map<String, Folder> = new Map();
		const packages: Map<String, PackageJSON> = new Map();

		let folder = null;
		let packageJson = null;

		const excludeConfig: Map<string, RegExp[]> = new Map();

		tasks.forEach(each => {
			const location = each.location;
			if (location && !excludeConfig.has(location.uri.toString())) {
				const regularExpressionsSetting = workspace.getConfiguration('npm', location.uri).get<string[]>('scriptExplorerExclude', []);
				excludeConfig.set(location.uri.toString(), regularExpressionsSetting?.map(value => RegExp(value)));
			}
			const regularExpressions = (location && excludeConfig.has(location.uri.toString())) ? excludeConfig.get(location.uri.toString()) : undefined;

			if (regularExpressions && regularExpressions.some((regularExpression) => (<INpmTaskDefinition>each.task.definition).script.match(regularExpression))) {
				return;
			}

			if (isWorkspaceFolder(each.task.scope) && !this.isInstallTask(each.task)) {
				folder = folders.get(each.task.scope.name);
				if (!folder) {
					folder = new Folder(each.task.scope);
					folders.set(each.task.scope.name, folder);
				}
				const definition: INpmTaskDefinition = <INpmTaskDefinition>each.task.definition;
				const relativePath = definition.path ? definition.path : '';
				const fullPath = path.join(each.task.scope.name, relativePath);
				packageJson = packages.get(fullPath);
				if (!packageJson) {
					packageJson = new PackageJSON(folder, relativePath);
					folder.addPackage(packageJson);
					packages.set(fullPath, packageJson);
				}
				const script = new NpmScript(this.extensionContext, packageJson, each);
				packageJson.addScript(script);
			}
		});
		if (folders.size === 1) {
			return [...packages.values()];
		}
		return [...folders.values()];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/npm/src/preferred-pm.ts]---
Location: vscode-main/extensions/npm/src/preferred-pm.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import findWorkspaceRoot = require('../node_modules/find-yarn-workspace-root');
import findUp from 'find-up';
import * as path from 'path';
import whichPM from 'which-pm';
import { Uri, workspace } from 'vscode';

interface PreferredProperties {
	isPreferred: boolean;
	hasLockfile: boolean;
}

async function pathExists(filePath: string) {
	try {
		await workspace.fs.stat(Uri.file(filePath));
	} catch {
		return false;
	}
	return true;
}

async function isBunPreferred(pkgPath: string): Promise<PreferredProperties> {
	if (await pathExists(path.join(pkgPath, 'bun.lockb'))) {
		return { isPreferred: true, hasLockfile: true };
	}

	if (await pathExists(path.join(pkgPath, 'bun.lock'))) {
		return { isPreferred: true, hasLockfile: true };
	}

	return { isPreferred: false, hasLockfile: false };
}

async function isPNPMPreferred(pkgPath: string): Promise<PreferredProperties> {
	if (await pathExists(path.join(pkgPath, 'pnpm-lock.yaml'))) {
		return { isPreferred: true, hasLockfile: true };
	}
	if (await pathExists(path.join(pkgPath, 'shrinkwrap.yaml'))) {
		return { isPreferred: true, hasLockfile: true };
	}
	if (await findUp('pnpm-lock.yaml', { cwd: pkgPath })) {
		return { isPreferred: true, hasLockfile: true };
	}

	return { isPreferred: false, hasLockfile: false };
}

async function isYarnPreferred(pkgPath: string): Promise<PreferredProperties> {
	if (await pathExists(path.join(pkgPath, 'yarn.lock'))) {
		return { isPreferred: true, hasLockfile: true };
	}

	try {
		if (typeof findWorkspaceRoot(pkgPath) === 'string') {
			return { isPreferred: true, hasLockfile: false };
		}
	} catch (err) { }

	return { isPreferred: false, hasLockfile: false };
}

async function isNPMPreferred(pkgPath: string): Promise<PreferredProperties> {
	const lockfileExists = await pathExists(path.join(pkgPath, 'package-lock.json'));
	return { isPreferred: lockfileExists, hasLockfile: lockfileExists };
}

export async function findPreferredPM(pkgPath: string): Promise<{ name: string; multipleLockFilesDetected: boolean }> {
	const detectedPackageManagerNames: string[] = [];
	const detectedPackageManagerProperties: PreferredProperties[] = [];

	const npmPreferred = await isNPMPreferred(pkgPath);
	if (npmPreferred.isPreferred) {
		detectedPackageManagerNames.push('npm');
		detectedPackageManagerProperties.push(npmPreferred);
	}

	const pnpmPreferred = await isPNPMPreferred(pkgPath);
	if (pnpmPreferred.isPreferred) {
		detectedPackageManagerNames.push('pnpm');
		detectedPackageManagerProperties.push(pnpmPreferred);
	}

	const yarnPreferred = await isYarnPreferred(pkgPath);
	if (yarnPreferred.isPreferred) {
		detectedPackageManagerNames.push('yarn');
		detectedPackageManagerProperties.push(yarnPreferred);
	}

	const bunPreferred = await isBunPreferred(pkgPath);
	if (bunPreferred.isPreferred) {
		detectedPackageManagerNames.push('bun');
		detectedPackageManagerProperties.push(bunPreferred);
	}

	const pmUsedForInstallation: { name: string } | null = await whichPM(pkgPath);

	if (pmUsedForInstallation && !detectedPackageManagerNames.includes(pmUsedForInstallation.name)) {
		detectedPackageManagerNames.push(pmUsedForInstallation.name);
		detectedPackageManagerProperties.push({ isPreferred: true, hasLockfile: false });
	}

	let lockfilesCount = 0;
	detectedPackageManagerProperties.forEach(detected => lockfilesCount += detected.hasLockfile ? 1 : 0);

	return {
		name: detectedPackageManagerNames[0] || 'npm',
		multipleLockFilesDetected: lockfilesCount > 1
	};
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/npm/src/readScripts.ts]---
Location: vscode-main/extensions/npm/src/readScripts.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { JSONVisitor, visit } from 'jsonc-parser';
import { Location, Position, Range, TextDocument } from 'vscode';

export interface INpmScriptReference {
	name: string;
	value: string;
	nameRange: Range;
	valueRange: Range;
}

export interface INpmScriptInfo {
	location: Location;
	scripts: INpmScriptReference[];
}

export const readScripts = (document: TextDocument, buffer = document.getText()): INpmScriptInfo | undefined => {
	let start: Position | undefined;
	let end: Position | undefined;
	let inScripts = false;
	let buildingScript: { name: string; nameRange: Range } | void;
	let level = 0;

	const scripts: INpmScriptReference[] = [];
	const visitor: JSONVisitor = {
		onError() {
			// no-op
		},
		onObjectBegin() {
			level++;
		},
		onObjectEnd(offset) {
			if (inScripts) {
				end = document.positionAt(offset);
				inScripts = false;
			}
			level--;
		},
		onLiteralValue(value: unknown, offset: number, length: number) {
			if (buildingScript && typeof value === 'string') {
				scripts.push({
					...buildingScript,
					value,
					valueRange: new Range(document.positionAt(offset), document.positionAt(offset + length)),
				});
				buildingScript = undefined;
			}
		},
		onObjectProperty(property: string, offset: number, length: number) {
			if (level === 1 && property === 'scripts') {
				inScripts = true;
				start = document.positionAt(offset);
			} else if (inScripts) {
				buildingScript = {
					name: property,
					nameRange: new Range(document.positionAt(offset), document.positionAt(offset + length))
				};
			}
		},
	};

	visit(buffer, visitor);

	if (start === undefined) {
		return undefined;
	}

	return { location: new Location(document.uri, new Range(start, end ?? start)), scripts };
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/npm/src/scriptHover.ts]---
Location: vscode-main/extensions/npm/src/scriptHover.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { dirname } from 'path';
import {
	CancellationToken, commands, ExtensionContext,
	Hover, HoverProvider, MarkdownString, l10n, Position, ProviderResult,
	tasks, TextDocument,
	Uri, workspace
} from 'vscode';
import { INpmScriptInfo, readScripts } from './readScripts';
import {
	createScriptRunnerTask,
	startDebugging
} from './tasks';


let cachedDocument: Uri | undefined = undefined;
let cachedScripts: INpmScriptInfo | undefined = undefined;

export function invalidateHoverScriptsCache(document?: TextDocument) {
	if (!document) {
		cachedDocument = undefined;
		return;
	}
	if (document.uri === cachedDocument) {
		cachedDocument = undefined;
	}
}

export class NpmScriptHoverProvider implements HoverProvider {
	private enabled: boolean;

	constructor(private context: ExtensionContext) {
		context.subscriptions.push(commands.registerCommand('npm.runScriptFromHover', this.runScriptFromHover, this));
		context.subscriptions.push(commands.registerCommand('npm.debugScriptFromHover', this.debugScriptFromHover, this));
		context.subscriptions.push(workspace.onDidChangeTextDocument((e) => {
			invalidateHoverScriptsCache(e.document);
		}));

		const isEnabled = () => workspace.getConfiguration('npm').get<boolean>('scriptHover', true);
		this.enabled = isEnabled();
		context.subscriptions.push(workspace.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration('npm.scriptHover')) {
				this.enabled = isEnabled();
			}
		}));
	}

	public provideHover(document: TextDocument, position: Position, _token: CancellationToken): ProviderResult<Hover> {
		if (!this.enabled) {
			return;
		}

		let hover: Hover | undefined = undefined;

		if (!cachedDocument || cachedDocument.fsPath !== document.uri.fsPath) {
			cachedScripts = readScripts(document);
			cachedDocument = document.uri;
		}

		cachedScripts?.scripts.forEach(({ name, nameRange }) => {
			if (nameRange.contains(position)) {
				const contents: MarkdownString = new MarkdownString();
				contents.isTrusted = true;
				contents.appendMarkdown(this.createRunScriptMarkdown(name, document.uri));
				contents.appendMarkdown(this.createDebugScriptMarkdown(name, document.uri));
				hover = new Hover(contents);
			}
		});
		return hover;
	}

	private createRunScriptMarkdown(script: string, documentUri: Uri): string {
		const args = {
			documentUri: documentUri,
			script: script,
		};
		return this.createMarkdownLink(
			l10n.t("Run Script"),
			'npm.runScriptFromHover',
			args,
			l10n.t("Run the script as a task")
		);
	}

	private createDebugScriptMarkdown(script: string, documentUri: Uri): string {
		const args = {
			documentUri: documentUri,
			script: script,
		};
		return this.createMarkdownLink(
			l10n.t("Debug Script"),
			'npm.debugScriptFromHover',
			args,
			l10n.t("Runs the script under the debugger"),
			'|'
		);
	}

	private createMarkdownLink(label: string, cmd: string, args: any, tooltip: string, separator?: string): string {
		const encodedArgs = encodeURIComponent(JSON.stringify(args));
		let prefix = '';
		if (separator) {
			prefix = ` ${separator} `;
		}
		return `${prefix}[${label}](command:${cmd}?${encodedArgs} "${tooltip}")`;
	}

	public async runScriptFromHover(args: any) {
		const script = args.script;
		const documentUri = args.documentUri;
		const folder = workspace.getWorkspaceFolder(documentUri);
		if (folder) {
			const task = await createScriptRunnerTask(this.context, script, folder, documentUri);
			await tasks.executeTask(task);
		}
	}

	public debugScriptFromHover(args: { script: string; documentUri: Uri }) {
		const script = args.script;
		const documentUri = args.documentUri;
		const folder = workspace.getWorkspaceFolder(documentUri);
		if (folder) {
			startDebugging(this.context, script, dirname(documentUri.fsPath), folder);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/npm/src/tasks.ts]---
Location: vscode-main/extensions/npm/src/tasks.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
	TaskDefinition, Task, TaskGroup, WorkspaceFolder, RelativePattern, ShellExecution, Uri, workspace,
	TaskProvider, TextDocument, tasks, TaskScope, QuickPickItem, window, Position, ExtensionContext, env,
	ShellQuotedString, ShellQuoting, commands, Location, CancellationTokenSource, l10n
} from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import minimatch from 'minimatch';
import { Utils } from 'vscode-uri';
import { findPreferredPM } from './preferred-pm';
import { readScripts } from './readScripts';

const excludeRegex = new RegExp('^(node_modules|.vscode-test)$', 'i');

export interface INpmTaskDefinition extends TaskDefinition {
	script: string;
	path?: string;
}

export interface IFolderTaskItem extends QuickPickItem {
	label: string;
	task: Task;
}

type AutoDetect = 'on' | 'off';

let cachedTasks: ITaskWithLocation[] | undefined = undefined;

export const INSTALL_SCRIPT = 'install';

export interface ITaskLocation {
	document: Uri;
	line: Position;
}

export interface ITaskWithLocation {
	task: Task;
	location?: Location;
}

export class NpmTaskProvider implements TaskProvider {

	constructor(private context: ExtensionContext) {
	}

	get tasksWithLocation(): Promise<ITaskWithLocation[]> {
		return provideNpmScripts(this.context, false);
	}

	public async provideTasks() {
		const tasks = await provideNpmScripts(this.context, true);
		return tasks.map(task => task.task);
	}

	public async resolveTask(_task: Task): Promise<Task | undefined> {
		const npmTask = _task.definition.script;
		if (npmTask) {
			const kind = _task.definition as INpmTaskDefinition;
			let packageJsonUri: Uri;
			if (_task.scope === undefined || _task.scope === TaskScope.Global || _task.scope === TaskScope.Workspace) {
				// scope is required to be a WorkspaceFolder for resolveTask
				return undefined;
			}
			if (kind.path) {
				packageJsonUri = _task.scope.uri.with({ path: _task.scope.uri.path + '/' + kind.path + `${kind.path.endsWith('/') ? '' : '/'}` + 'package.json' });
			} else {
				packageJsonUri = _task.scope.uri.with({ path: _task.scope.uri.path + '/package.json' });
			}
			let task: Task;
			if (kind.script === INSTALL_SCRIPT) {
				task = await createInstallationTask(this.context, _task.scope, packageJsonUri);
			} else {
				task = await createScriptRunnerTask(this.context, kind.script, _task.scope, packageJsonUri);
			}
			// VSCode requires that task.definition must not change between resolutions
			// We need to restore task.definition to its original value
			task.definition = kind;
			return task;
		}
		return undefined;
	}
}

export function invalidateTasksCache() {
	cachedTasks = undefined;
}

const buildNames: string[] = ['build', 'compile', 'watch'];
function isBuildTask(name: string): boolean {
	for (const buildName of buildNames) {
		if (name.indexOf(buildName) !== -1) {
			return true;
		}
	}
	return false;
}

const testNames: string[] = ['test'];
function isTestTask(name: string): boolean {
	for (const testName of testNames) {
		if (name === testName) {
			return true;
		}
	}
	return false;
}
const preScripts: Set<string> = new Set([
	'install', 'pack', 'pack', 'publish', 'restart', 'shrinkwrap',
	'stop', 'test', 'uninstall', 'version'
]);

const postScripts: Set<string> = new Set([
	'install', 'pack', 'pack', 'publish', 'publishOnly', 'restart', 'shrinkwrap',
	'stop', 'test', 'uninstall', 'version'
]);

function canHavePrePostScript(name: string): boolean {
	return preScripts.has(name) || postScripts.has(name);
}

export function isWorkspaceFolder(value: any): value is WorkspaceFolder {
	return value && typeof value !== 'number';
}

export async function getScriptRunner(folder: Uri, context?: ExtensionContext, showWarning?: boolean): Promise<string> {
	let scriptRunner = workspace.getConfiguration('npm', folder).get<string>('scriptRunner', 'npm');

	if (scriptRunner === 'auto') {
		scriptRunner = await detectPackageManager(folder, context, showWarning);
	}

	return scriptRunner;
}

export async function getPackageManager(folder: Uri, context?: ExtensionContext, showWarning?: boolean): Promise<string> {
	let packageManager = workspace.getConfiguration('npm', folder).get<string>('packageManager', 'npm');

	if (packageManager === 'auto') {
		packageManager = await detectPackageManager(folder, context, showWarning);
	}

	return packageManager;
}

export async function detectPackageManager(folder: Uri, extensionContext?: ExtensionContext, showWarning: boolean = false): Promise<string> {
	const { name, multipleLockFilesDetected: multiplePMDetected } = await findPreferredPM(folder.fsPath);
	const neverShowWarning = 'npm.multiplePMWarning.neverShow';
	if (showWarning && multiplePMDetected && extensionContext && !extensionContext.globalState.get<boolean>(neverShowWarning)) {
		const multiplePMWarning = l10n.t('Using {0} as the preferred package manager. Found multiple lockfiles for {1}.  To resolve this issue, delete the lockfiles that don\'t match your preferred package manager or change the setting "npm.packageManager" to a value other than "auto".', name, folder.fsPath);
		const neverShowAgain = l10n.t("Do not show again");
		const learnMore = l10n.t("Learn more");
		window.showInformationMessage(multiplePMWarning, learnMore, neverShowAgain).then(result => {
			switch (result) {
				case neverShowAgain: extensionContext.globalState.update(neverShowWarning, true); break;
				case learnMore: env.openExternal(Uri.parse('https://docs.npmjs.com/cli/v9/configuring-npm/package-lock-json'));
			}
		});
	}

	return name;
}

export async function hasNpmScripts(): Promise<boolean> {
	const folders = workspace.workspaceFolders;
	if (!folders) {
		return false;
	}
	for (const folder of folders) {
		if (isAutoDetectionEnabled(folder) && !excludeRegex.test(Utils.basename(folder.uri))) {
			const relativePattern = new RelativePattern(folder, '**/package.json');
			const paths = await workspace.findFiles(relativePattern, '**/node_modules/**');
			if (paths.length > 0) {
				return true;
			}
		}
	}
	return false;
}

async function* findNpmPackages(): AsyncGenerator<Uri> {

	const visitedPackageJsonFiles: Set<string> = new Set();

	const folders = workspace.workspaceFolders;
	if (!folders) {
		return;
	}
	for (const folder of folders) {
		if (isAutoDetectionEnabled(folder) && !excludeRegex.test(Utils.basename(folder.uri))) {
			const relativePattern = new RelativePattern(folder, '**/package.json');
			const paths = await workspace.findFiles(relativePattern, '**/{node_modules,.vscode-test}/**');
			for (const path of paths) {
				if (!isExcluded(folder, path) && !visitedPackageJsonFiles.has(path.fsPath)) {
					yield path;
					visitedPackageJsonFiles.add(path.fsPath);
				}
			}
		}
	}
}


export async function detectNpmScriptsForFolder(context: ExtensionContext, folder: Uri): Promise<IFolderTaskItem[]> {

	const folderTasks: IFolderTaskItem[] = [];

	if (excludeRegex.test(Utils.basename(folder))) {
		return folderTasks;
	}
	const relativePattern = new RelativePattern(folder.fsPath, '**/package.json');
	const paths = await workspace.findFiles(relativePattern, '**/node_modules/**');

	const visitedPackageJsonFiles: Set<string> = new Set();
	for (const path of paths) {
		if (!visitedPackageJsonFiles.has(path.fsPath)) {
			const tasks = await provideNpmScriptsForFolder(context, path, true);
			visitedPackageJsonFiles.add(path.fsPath);
			folderTasks.push(...tasks.map(t => ({ label: t.task.name, task: t.task })));
		}
	}
	return folderTasks;
}

export async function provideNpmScripts(context: ExtensionContext, showWarning: boolean): Promise<ITaskWithLocation[]> {
	if (!cachedTasks) {
		const allTasks: ITaskWithLocation[] = [];
		for await (const path of findNpmPackages()) {
			const tasks = await provideNpmScriptsForFolder(context, path, showWarning);
			allTasks.push(...tasks);
		}
		cachedTasks = allTasks;
	}
	return cachedTasks;
}

export function isAutoDetectionEnabled(folder?: WorkspaceFolder): boolean {
	return workspace.getConfiguration('npm', folder?.uri).get<AutoDetect>('autoDetect') === 'on';
}

function isExcluded(folder: WorkspaceFolder, packageJsonUri: Uri) {
	function testForExclusionPattern(path: string, pattern: string): boolean {
		return minimatch(path, pattern, { dot: true });
	}

	const exclude = workspace.getConfiguration('npm', folder.uri).get<string | string[]>('exclude');
	const packageJsonFolder = path.dirname(packageJsonUri.fsPath);

	if (exclude) {
		if (Array.isArray(exclude)) {
			for (const pattern of exclude) {
				if (testForExclusionPattern(packageJsonFolder, pattern)) {
					return true;
				}
			}
		} else if (testForExclusionPattern(packageJsonFolder, exclude)) {
			return true;
		}
	}
	return false;
}

function isDebugScript(script: string): boolean {
	const match = script.match(/--(inspect|debug)(-brk)?(=((\[[0-9a-fA-F:]*\]|[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+|[a-zA-Z0-9\.]*):)?(\d+))?/);
	return match !== null;
}

async function provideNpmScriptsForFolder(context: ExtensionContext, packageJsonUri: Uri, showWarning: boolean): Promise<ITaskWithLocation[]> {
	const emptyTasks: ITaskWithLocation[] = [];

	const folder = workspace.getWorkspaceFolder(packageJsonUri);
	if (!folder) {
		return emptyTasks;
	}
	const scripts = await getScripts(packageJsonUri);
	if (!scripts) {
		return emptyTasks;
	}

	const result: ITaskWithLocation[] = [];

	for (const { name, value, nameRange } of scripts.scripts) {
		const task = await createScriptRunnerTask(context, name, folder!, packageJsonUri, value, showWarning);
		result.push({ task, location: new Location(packageJsonUri, nameRange) });
	}

	if (!workspace.getConfiguration('npm', folder).get<string[]>('scriptExplorerExclude', []).find(e => e.includes(INSTALL_SCRIPT))) {
		result.push({ task: await createInstallationTask(context, folder, packageJsonUri, 'install dependencies from package', showWarning) });
	}
	return result;
}

export function getTaskName(script: string, relativePath: string | undefined) {
	if (relativePath && relativePath.length) {
		return `${script} - ${relativePath.substring(0, relativePath.length - 1)}`;
	}
	return script;
}

function escapeCommandLine(cmd: string[]): (string | ShellQuotedString)[] {
	return cmd.map(arg => {
		if (/\s/.test(arg)) {
			return { value: arg, quoting: arg.includes('--') ? ShellQuoting.Weak : ShellQuoting.Strong };
		} else {
			return arg;
		}
	});
}

function getRelativePath(rootUri: Uri, packageJsonUri: Uri): string {
	const absolutePath = packageJsonUri.path.substring(0, packageJsonUri.path.length - 'package.json'.length);
	return absolutePath.substring(rootUri.path.length + 1);
}

export async function getRunScriptCommand(script: string, folder: Uri, context?: ExtensionContext, showWarning = true): Promise<string[]> {
	const scriptRunner = await getScriptRunner(folder, context, showWarning);

	if (scriptRunner === 'node') {
		return ['node', '--run', script];
	} else {
		const result = [scriptRunner, 'run'];
		if (workspace.getConfiguration('npm', folder).get<boolean>('runSilent')) {
			result.push('--silent');
		}
		result.push(script);
		return result;
	}
}

export async function createScriptRunnerTask(context: ExtensionContext, script: string, folder: WorkspaceFolder, packageJsonUri: Uri, scriptValue?: string, showWarning?: boolean): Promise<Task> {
	const kind: INpmTaskDefinition = { type: 'npm', script };

	const relativePackageJson = getRelativePath(folder.uri, packageJsonUri);
	if (relativePackageJson.length && !kind.path) {
		kind.path = relativePackageJson.substring(0, relativePackageJson.length - 1);
	}
	const taskName = getTaskName(script, relativePackageJson);
	const cwd = path.dirname(packageJsonUri.fsPath);
	const args = await getRunScriptCommand(script, folder.uri, context, showWarning);
	const scriptRunner = args.shift()!;
	const task = new Task(kind, folder, taskName, 'npm', new ShellExecution(scriptRunner, escapeCommandLine(args), { cwd: cwd }));
	task.detail = scriptValue;

	const lowerCaseTaskName = script.toLowerCase();
	if (isBuildTask(lowerCaseTaskName)) {
		task.group = TaskGroup.Build;
	} else if (isTestTask(lowerCaseTaskName)) {
		task.group = TaskGroup.Test;
	} else if (canHavePrePostScript(lowerCaseTaskName)) {
		task.group = TaskGroup.Clean; // hack: use Clean group to tag pre/post scripts
	} else if (scriptValue && isDebugScript(scriptValue)) {
		// todo@connor4312: all scripts are now debuggable, what is a 'debug script'?
		task.group = TaskGroup.Rebuild; // hack: use Rebuild group to tag debug scripts
	}
	return task;
}

async function getInstallDependenciesCommand(folder: Uri, context?: ExtensionContext, showWarning = true): Promise<string[]> {
	const packageManager = await getPackageManager(folder, context, showWarning);
	const result = [packageManager, INSTALL_SCRIPT];
	if (workspace.getConfiguration('npm', folder).get<boolean>('runSilent')) {
		result.push('--silent');
	}
	return result;
}

export async function createInstallationTask(context: ExtensionContext, folder: WorkspaceFolder, packageJsonUri: Uri, scriptValue?: string, showWarning?: boolean): Promise<Task> {
	const kind: INpmTaskDefinition = { type: 'npm', script: INSTALL_SCRIPT };

	const relativePackageJson = getRelativePath(folder.uri, packageJsonUri);
	if (relativePackageJson.length && !kind.path) {
		kind.path = relativePackageJson.substring(0, relativePackageJson.length - 1);
	}
	const taskName = getTaskName(INSTALL_SCRIPT, relativePackageJson);
	const cwd = path.dirname(packageJsonUri.fsPath);
	const args = await getInstallDependenciesCommand(folder.uri, context, showWarning);
	const packageManager = args.shift()!;
	const task = new Task(kind, folder, taskName, 'npm', new ShellExecution(packageManager, escapeCommandLine(args), { cwd: cwd }));
	task.detail = scriptValue;
	task.group = TaskGroup.Clean;

	return task;
}


export function getPackageJsonUriFromTask(task: Task): Uri | null {
	if (isWorkspaceFolder(task.scope)) {
		if (task.definition.path) {
			return Uri.file(path.join(task.scope.uri.fsPath, task.definition.path, 'package.json'));
		} else {
			return Uri.file(path.join(task.scope.uri.fsPath, 'package.json'));
		}
	}
	return null;
}

export async function hasPackageJson(): Promise<boolean> {
	// Faster than `findFiles` for workspaces with a root package.json.
	if (await hasRootPackageJson()) {
		return true;
	}
	const token = new CancellationTokenSource();
	// Search for files for max 1 second.
	const timeout = setTimeout(() => token.cancel(), 1000);
	const files = await workspace.findFiles('**/package.json', undefined, 1, token.token);
	clearTimeout(timeout);
	return files.length > 0;
}

async function hasRootPackageJson(): Promise<boolean> {
	const folders = workspace.workspaceFolders;
	if (!folders) {
		return false;
	}
	for (const folder of folders) {
		if (folder.uri.scheme === 'file') {
			const packageJson = path.join(folder.uri.fsPath, 'package.json');
			if (await exists(packageJson)) {
				return true;
			}
		}
	}
	return false;
}

async function exists(file: string): Promise<boolean> {
	return new Promise<boolean>((resolve, _reject) => {
		fs.exists(file, (value) => {
			resolve(value);
		});
	});
}

export async function runScript(context: ExtensionContext, script: string, document: TextDocument) {
	const uri = document.uri;
	const folder = workspace.getWorkspaceFolder(uri);
	if (folder) {
		const task = await createScriptRunnerTask(context, script, folder, uri);
		tasks.executeTask(task);
	}
}

export async function startDebugging(context: ExtensionContext, scriptName: string, cwd: string, folder: WorkspaceFolder) {
	const runScriptCommand = await getRunScriptCommand(scriptName, folder.uri, context, true);

	commands.executeCommand(
		'extension.js-debug.createDebuggerTerminal',
		runScriptCommand.join(' '),
		folder,
		{ cwd },
	);
}


export type StringMap = { [s: string]: string };

export function findScriptAtPosition(document: TextDocument, buffer: string, position: Position): string | undefined {
	const read = readScripts(document, buffer);
	if (!read) {
		return undefined;
	}

	for (const script of read.scripts) {
		if (script.nameRange.start.isBeforeOrEqual(position) && script.valueRange.end.isAfterOrEqual(position)) {
			return script.name;
		}
	}

	return undefined;
}

export async function getScripts(packageJsonUri: Uri) {
	if (packageJsonUri.scheme !== 'file') {
		return undefined;
	}

	const packageJson = packageJsonUri.fsPath;
	if (!await exists(packageJson)) {
		return undefined;
	}

	try {
		const document: TextDocument = await workspace.openTextDocument(packageJsonUri);
		return readScripts(document);
	} catch (e) {
		const localizedParseError = l10n.t("Npm task detection: failed to parse the file {0}", packageJsonUri.fsPath);
		throw new Error(localizedParseError);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/npm/src/features/date.ts]---
Location: vscode-main/extensions/npm/src/features/date.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { l10n } from 'vscode';


const minute = 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
const month = day * 30;
const year = day * 365;

/**
 * Create a localized of the time between now and the specified date.
 * @param date The date to generate the difference from.
 * @param appendAgoLabel Whether to append the " ago" to the end.
 * @param useFullTimeWords Whether to use full words (eg. seconds) instead of
 * shortened (eg. secs).
 * @param disallowNow Whether to disallow the string "now" when the difference
 * is less than 30 seconds.
 */
export function fromNow(date: number | Date, appendAgoLabel?: boolean, useFullTimeWords?: boolean, disallowNow?: boolean): string {
	if (typeof date !== 'number') {
		date = date.getTime();
	}

	const seconds = Math.round((new Date().getTime() - date) / 1000);
	if (seconds < -30) {
		return l10n.t('in {0}', fromNow(new Date().getTime() + seconds * 1000, false));
	}

	if (!disallowNow && seconds < 30) {
		return l10n.t('now');
	}

	let value: number;
	if (seconds < minute) {
		value = seconds;

		if (appendAgoLabel) {
			if (value === 1) {
				return useFullTimeWords
					? l10n.t('{0} second ago', value)
					: l10n.t('{0} sec ago', value);
			} else {
				return useFullTimeWords
					? l10n.t('{0} seconds ago', value)
					: l10n.t('{0} secs ago', value);
			}
		} else {
			if (value === 1) {
				return useFullTimeWords
					? l10n.t('{0} second', value)
					: l10n.t('{0} sec', value);
			} else {
				return useFullTimeWords
					? l10n.t('{0} seconds', value)
					: l10n.t('{0} secs', value);
			}
		}
	}

	if (seconds < hour) {
		value = Math.floor(seconds / minute);
		if (appendAgoLabel) {
			if (value === 1) {
				return useFullTimeWords
					? l10n.t('{0} minute ago', value)
					: l10n.t('{0} min ago', value);
			} else {
				return useFullTimeWords
					? l10n.t('{0} minutes ago', value)
					: l10n.t('{0} mins ago', value);
			}
		} else {
			if (value === 1) {
				return useFullTimeWords
					? l10n.t('{0} minute', value)
					: l10n.t('{0} min', value);
			} else {
				return useFullTimeWords
					? l10n.t('{0} minutes', value)
					: l10n.t('{0} mins', value);
			}
		}
	}

	if (seconds < day) {
		value = Math.floor(seconds / hour);
		if (appendAgoLabel) {
			if (value === 1) {
				return useFullTimeWords
					? l10n.t('{0} hour ago', value)
					: l10n.t('{0} hr ago', value);
			} else {
				return useFullTimeWords
					? l10n.t('{0} hours ago', value)
					: l10n.t('{0} hrs ago', value);
			}
		} else {
			if (value === 1) {
				return useFullTimeWords
					? l10n.t('{0} hour', value)
					: l10n.t('{0} hr', value);
			} else {
				return useFullTimeWords
					? l10n.t('{0} hours', value)
					: l10n.t('{0} hrs', value);
			}
		}
	}

	if (seconds < week) {
		value = Math.floor(seconds / day);
		if (appendAgoLabel) {
			return value === 1
				? l10n.t('{0} day ago', value)
				: l10n.t('{0} days ago', value);
		} else {
			return value === 1
				? l10n.t('{0} day', value)
				: l10n.t('{0} days', value);
		}
	}

	if (seconds < month) {
		value = Math.floor(seconds / week);
		if (appendAgoLabel) {
			if (value === 1) {
				return useFullTimeWords
					? l10n.t('{0} week ago', value)
					: l10n.t('{0} wk ago', value);
			} else {
				return useFullTimeWords
					? l10n.t('{0} weeks ago', value)
					: l10n.t('{0} wks ago', value);
			}
		} else {
			if (value === 1) {
				return useFullTimeWords
					? l10n.t('{0} week', value)
					: l10n.t('{0} wk', value);
			} else {
				return useFullTimeWords
					? l10n.t('{0} weeks', value)
					: l10n.t('{0} wks', value);
			}
		}
	}

	if (seconds < year) {
		value = Math.floor(seconds / month);
		if (appendAgoLabel) {
			if (value === 1) {
				return useFullTimeWords
					? l10n.t('{0} month ago', value)
					: l10n.t('{0} mo ago', value);
			} else {
				return useFullTimeWords
					? l10n.t('{0} months ago', value)
					: l10n.t('{0} mos ago', value);
			}
		} else {
			if (value === 1) {
				return useFullTimeWords
					? l10n.t('{0} month', value)
					: l10n.t('{0} mo', value);
			} else {
				return useFullTimeWords
					? l10n.t('{0} months', value)
					: l10n.t('{0} mos', value);
			}
		}
	}

	value = Math.floor(seconds / year);
	if (appendAgoLabel) {
		if (value === 1) {
			return useFullTimeWords
				? l10n.t('{0} year ago', value)
				: l10n.t('{0} yr ago', value);
		} else {
			return useFullTimeWords
				? l10n.t('{0} years ago', value)
				: l10n.t('{0} yrs ago', value);
		}
	} else {
		if (value === 1) {
			return useFullTimeWords
				? l10n.t('{0} year', value)
				: l10n.t('{0} yr', value);
		} else {
			return useFullTimeWords
				? l10n.t('{0} years', value)
				: l10n.t('{0} yrs', value);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/npm/src/features/jsonContributions.ts]---
Location: vscode-main/extensions/npm/src/features/jsonContributions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Location, getLocation, createScanner, SyntaxKind, ScanError, JSONScanner } from 'jsonc-parser';
import { PackageJSONContribution } from './packageJSONContribution';
import { XHRRequest } from 'request-light';

import {
	CompletionItem, CompletionItemProvider, CompletionList, TextDocument, Position, Hover, HoverProvider,
	CancellationToken, Range, DocumentSelector, languages, Disposable, Uri, MarkdownString
} from 'vscode';

export interface ISuggestionsCollector {
	add(suggestion: CompletionItem): void;
	error(message: string): void;
	log(message: string): void;
	setAsIncomplete(): void;
}

export interface IJSONContribution {
	getDocumentSelector(): DocumentSelector;
	getInfoContribution(resourceUri: Uri, location: Location): Thenable<MarkdownString[] | null> | null;
	collectPropertySuggestions(resourceUri: Uri, location: Location, currentWord: string, addValue: boolean, isLast: boolean, result: ISuggestionsCollector): Thenable<any> | null;
	collectValueSuggestions(resourceUri: Uri, location: Location, result: ISuggestionsCollector): Thenable<any> | null;
	collectDefaultSuggestions(resourceUri: Uri, result: ISuggestionsCollector): Thenable<any>;
	resolveSuggestion?(resourceUri: Uri | undefined, item: CompletionItem): Thenable<CompletionItem | null> | null;
}

export function addJSONProviders(xhr: XHRRequest, npmCommandPath: string | undefined): Disposable {
	const contributions = [new PackageJSONContribution(xhr, npmCommandPath)];
	const subscriptions: Disposable[] = [];
	contributions.forEach(contribution => {
		const selector = contribution.getDocumentSelector();
		subscriptions.push(languages.registerCompletionItemProvider(selector, new JSONCompletionItemProvider(contribution), '"', ':'));
		subscriptions.push(languages.registerHoverProvider(selector, new JSONHoverProvider(contribution)));
	});
	return Disposable.from(...subscriptions);
}

export class JSONHoverProvider implements HoverProvider {

	constructor(private jsonContribution: IJSONContribution) {
	}

	public provideHover(document: TextDocument, position: Position, _token: CancellationToken): Thenable<Hover> | null {
		const offset = document.offsetAt(position);
		const location = getLocation(document.getText(), offset);
		if (!location.previousNode) {
			return null;
		}
		const node = location.previousNode;
		if (node && node.offset <= offset && offset <= node.offset + node.length) {
			const promise = this.jsonContribution.getInfoContribution(document.uri, location);
			if (promise) {
				return promise.then(htmlContent => {
					const range = new Range(document.positionAt(node.offset), document.positionAt(node.offset + node.length));
					const result: Hover = {
						contents: htmlContent || [],
						range: range
					};
					return result;
				});
			}
		}
		return null;
	}
}

export class JSONCompletionItemProvider implements CompletionItemProvider {

	private lastResource: Uri | undefined;

	constructor(private jsonContribution: IJSONContribution) {
	}

	public resolveCompletionItem(item: CompletionItem, _token: CancellationToken): Thenable<CompletionItem | null> {
		if (this.jsonContribution.resolveSuggestion) {
			const resolver = this.jsonContribution.resolveSuggestion(this.lastResource, item);
			if (resolver) {
				return resolver;
			}
		}
		return Promise.resolve(item);
	}

	public provideCompletionItems(document: TextDocument, position: Position, _token: CancellationToken): Thenable<CompletionList | null> | null {
		this.lastResource = document.uri;


		const currentWord = this.getCurrentWord(document, position);
		let overwriteRange: Range;

		const items: CompletionItem[] = [];
		let isIncomplete = false;

		const offset = document.offsetAt(position);
		const location = getLocation(document.getText(), offset);

		const node = location.previousNode;
		if (node && node.offset <= offset && offset <= node.offset + node.length && (node.type === 'property' || node.type === 'string' || node.type === 'number' || node.type === 'boolean' || node.type === 'null')) {
			overwriteRange = new Range(document.positionAt(node.offset), document.positionAt(node.offset + node.length));
		} else {
			overwriteRange = new Range(document.positionAt(offset - currentWord.length), position);
		}

		const proposed: { [key: string]: boolean } = {};
		const collector: ISuggestionsCollector = {
			add: (suggestion: CompletionItem) => {
				const key = typeof suggestion.label === 'string'
					? suggestion.label
					: suggestion.label.label;
				if (!proposed[key]) {
					proposed[key] = true;
					suggestion.range = { replacing: overwriteRange, inserting: new Range(overwriteRange.start, overwriteRange.start) };
					items.push(suggestion);
				}
			},
			setAsIncomplete: () => isIncomplete = true,
			error: (message: string) => console.error(message),
			log: (message: string) => console.log(message)
		};

		let collectPromise: Thenable<any> | null = null;

		if (location.isAtPropertyKey) {
			const scanner = createScanner(document.getText(), true);
			const addValue = !location.previousNode || !this.hasColonAfter(scanner, location.previousNode.offset + location.previousNode.length);
			const isLast = this.isLast(scanner, document.offsetAt(position));
			collectPromise = this.jsonContribution.collectPropertySuggestions(document.uri, location, currentWord, addValue, isLast, collector);
		} else {
			if (location.path.length === 0) {
				collectPromise = this.jsonContribution.collectDefaultSuggestions(document.uri, collector);
			} else {
				collectPromise = this.jsonContribution.collectValueSuggestions(document.uri, location, collector);
			}
		}
		if (collectPromise) {
			return collectPromise.then(() => {
				if (items.length > 0 || isIncomplete) {
					return new CompletionList(items, isIncomplete);
				}
				return null;
			});
		}
		return null;
	}

	private getCurrentWord(document: TextDocument, position: Position) {
		let i = position.character - 1;
		const text = document.lineAt(position.line).text;
		while (i >= 0 && ' \t\n\r\v":{[,'.indexOf(text.charAt(i)) === -1) {
			i--;
		}
		return text.substring(i + 1, position.character);
	}

	private isLast(scanner: JSONScanner, offset: number): boolean {
		scanner.setPosition(offset);
		let nextToken = scanner.scan();
		if (nextToken === SyntaxKind.StringLiteral && scanner.getTokenError() === ScanError.UnexpectedEndOfString) {
			nextToken = scanner.scan();
		}
		return nextToken === SyntaxKind.CloseBraceToken || nextToken === SyntaxKind.EOF;
	}
	private hasColonAfter(scanner: JSONScanner, offset: number): boolean {
		scanner.setPosition(offset);
		return scanner.scan() === SyntaxKind.ColonToken;
	}

}

export const xhrDisabled = () => Promise.reject({ responseText: 'Use of online resources is disabled.' });
```

--------------------------------------------------------------------------------

````

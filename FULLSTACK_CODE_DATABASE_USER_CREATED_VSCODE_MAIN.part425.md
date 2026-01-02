---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 425
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 425 of 552)

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

---[FILE: src/vs/workbench/contrib/notebook/browser/view/renderers/webviewPreloads.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/renderers/webviewPreloads.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Event } from '../../../../../../base/common/event.js';
import type { IDisposable } from '../../../../../../base/common/lifecycle.js';
import type * as webviewMessages from './webviewMessages.js';
import type { NotebookCellMetadata } from '../../../common/notebookCommon.js';
import type * as rendererApi from 'vscode-notebook-renderer';
import type { NotebookCellOutputTransferData } from '../../../../../../platform/dnd/browser/dnd.js';

// !! IMPORTANT !! ----------------------------------------------------------------------------------
// import { RenderOutputType } from 'vs/workbench/contrib/notebook/browser/notebookBrowser';
// We can ONLY IMPORT as type in this module. This also applies to const enums that would evaporate
// in normal compiles but remain a dependency in transpile-only compiles
// !! IMPORTANT !! ----------------------------------------------------------------------------------

// !! IMPORTANT !! everything must be in-line within the webviewPreloads
// function. Imports are not allowed. This is stringified and injected into
// the webview.

declare namespace globalThis {
	const acquireVsCodeApi: () => ({
		getState(): { [key: string]: unknown };
		setState(data: { [key: string]: unknown }): void;
		postMessage: (msg: unknown) => void;
	});
}

declare class ResizeObserver {
	constructor(onChange: (entries: { target: HTMLElement; contentRect?: ClientRect }[]) => void);
	observe(element: Element): void;
	disconnect(): void;
}

declare class Highlight {
	constructor();
	add(range: AbstractRange): void;
	clear(): void;
	priority: number;
}

interface CSSHighlights {
	set(rule: string, highlight: Highlight): void;
}
declare namespace CSS {
	let highlights: CSSHighlights | undefined;
}


type Listener<T> = { fn: (evt: T) => void; thisArg: unknown };

interface EmitterLike<T> {
	fire(data: T): void;
	readonly event: Event<T>;
}

interface PreloadStyles {
	readonly outputNodePadding: number;
	readonly outputNodeLeftPadding: number;
	readonly tokenizationCss: string;
}

export interface PreloadOptions {
	dragAndDropEnabled: boolean;
}

export interface RenderOptions {
	readonly lineLimit: number;
	readonly outputScrolling: boolean;
	readonly outputWordWrap: boolean;
	readonly linkifyFilePaths: boolean;
	readonly minimalError: boolean;
}

interface PreloadContext {
	readonly nonce: string;
	readonly style: PreloadStyles;
	readonly options: PreloadOptions;
	readonly renderOptions: RenderOptions;
	readonly rendererData: readonly webviewMessages.RendererMetadata[];
	readonly staticPreloadsData: readonly webviewMessages.StaticPreloadMetadata[];
	readonly isWorkspaceTrusted: boolean;
}

declare function requestIdleCallback(callback: (args: IdleDeadline) => void, options?: { timeout: number }): number;
declare function cancelIdleCallback(handle: number): void;

declare function __import(path: string): Promise<any>;

async function webviewPreloads(ctx: PreloadContext) {

	/* eslint-disable no-restricted-globals, no-restricted-syntax */

	// The use of global `window` should be fine in this context, even
	// with aux windows. This code is running from within an `iframe`
	// where there is only one `window` object anyway.

	const userAgent = navigator.userAgent;
	const isChrome = (userAgent.indexOf('Chrome') >= 0);
	const textEncoder = new TextEncoder();
	const textDecoder = new TextDecoder();

	function promiseWithResolvers<T>(): { promise: Promise<T>; resolve: (value: T | PromiseLike<T>) => void; reject: (err?: any) => void } {
		let resolve: (value: T | PromiseLike<T>) => void;
		let reject: (reason?: any) => void;
		const promise = new Promise<T>((res, rej) => {
			resolve = res;
			reject = rej;
		});
		return { promise, resolve: resolve!, reject: reject! };
	}

	let currentOptions = ctx.options;
	const isWorkspaceTrusted = ctx.isWorkspaceTrusted;
	let currentRenderOptions = ctx.renderOptions;
	const settingChange: EmitterLike<RenderOptions> = createEmitter<RenderOptions>();

	const acquireVsCodeApi = globalThis.acquireVsCodeApi;
	const vscode = acquireVsCodeApi();
	delete (globalThis as { acquireVsCodeApi: unknown }).acquireVsCodeApi;

	const tokenizationStyle = new CSSStyleSheet();
	tokenizationStyle.replaceSync(ctx.style.tokenizationCss);

	const runWhenIdle: (callback: (idle: IdleDeadline) => void, timeout?: number) => IDisposable = (typeof requestIdleCallback !== 'function' || typeof cancelIdleCallback !== 'function')
		? (runner) => {
			setTimeout(() => {
				if (disposed) {
					return;
				}
				const end = Date.now() + 15; // one frame at 64fps
				runner(Object.freeze({
					didTimeout: true,
					timeRemaining() {
						return Math.max(0, end - Date.now());
					}
				}));
			});
			let disposed = false;
			return {
				dispose() {
					if (disposed) {
						return;
					}
					disposed = true;
				}
			};
		}
		: (runner, timeout?) => {
			const handle: number = requestIdleCallback(runner, typeof timeout === 'number' ? { timeout } : undefined);
			let disposed = false;
			return {
				dispose() {
					if (disposed) {
						return;
					}
					disposed = true;
					cancelIdleCallback(handle);
				}
			};
		};
	function getOutputContainer(event: FocusEvent | MouseEvent) {
		for (const node of event.composedPath()) {
			if (node instanceof HTMLElement && node.classList.contains('output')) {
				return {
					id: node.id
				};
			}
		}
		return;
	}
	let lastFocusedOutput: { id: string } | undefined = undefined;
	const handleOutputFocusOut = (event: FocusEvent) => {
		const outputFocus = event && getOutputContainer(event);
		if (!outputFocus) {
			return;
		}
		// Possible we're tabbing through the elements of the same output.
		// Lets see if focus is set back to the same output.
		lastFocusedOutput = undefined;
		setTimeout(() => {
			if (lastFocusedOutput?.id === outputFocus.id) {
				return;
			}
			postNotebookMessage<webviewMessages.IOutputBlurMessage>('outputBlur', outputFocus);
		}, 0);
	};

	const hasActiveEditableElement = (
		parent: Node | DocumentFragment,
		root: ShadowRoot | Document = document
	): boolean => {
		const element = root.activeElement;
		return !!(element && parent.contains(element)
			&& (element.matches(':read-write') || element.tagName.toLowerCase() === 'select'
				|| (element.shadowRoot && hasActiveEditableElement(element.shadowRoot, element.shadowRoot)))
		);
	};

	// check if an input element is focused within the output element
	const checkOutputInputFocus = (e: FocusEvent) => {
		lastFocusedOutput = getOutputContainer(e);
		const activeElement = window.document.activeElement;
		if (!activeElement) {
			return;
		}

		const id = lastFocusedOutput?.id;
		if (id && (hasActiveEditableElement(activeElement, window.document))) {
			postNotebookMessage<webviewMessages.IOutputInputFocusMessage>('outputInputFocus', { inputFocused: true, id });

			activeElement.addEventListener('blur', () => {
				postNotebookMessage<webviewMessages.IOutputInputFocusMessage>('outputInputFocus', { inputFocused: false, id });
			}, { once: true });
		}
	};

	const handleInnerClick = (event: MouseEvent) => {
		if (!event || !event.view || !event.view.document) {
			return;
		}

		const outputFocus = lastFocusedOutput = getOutputContainer(event);
		for (const node of event.composedPath()) {
			if (node instanceof HTMLAnchorElement && node.href) {
				if (node.href.startsWith('blob:')) {
					if (outputFocus) {
						postNotebookMessage<webviewMessages.IOutputFocusMessage>('outputFocus', outputFocus);
					}

					handleBlobUrlClick(node.href, node.download);
				} else if (node.href.startsWith('data:')) {
					if (outputFocus) {
						postNotebookMessage<webviewMessages.IOutputFocusMessage>('outputFocus', outputFocus);
					}
					handleDataUrl(node.href, node.download);
				} else if (node.getAttribute('href')?.trim().startsWith('#')) {
					// Scrolling to location within current doc

					if (!node.hash) {
						postNotebookMessage<webviewMessages.IScrollToRevealMessage>('scroll-to-reveal', { scrollTop: 0 });
						return;
					}

					const targetId = node.hash.substring(1);

					// Check outer document first
					let scrollTarget: Element | null | undefined = event.view.document.getElementById(targetId);

					if (!scrollTarget) {
						// Fallback to checking preview shadow doms
						for (const preview of event.view.document.querySelectorAll('.preview')) {
							scrollTarget = preview.shadowRoot?.getElementById(targetId);
							if (scrollTarget) {
								break;
							}
						}
					}

					if (scrollTarget) {
						const scrollTop = scrollTarget.getBoundingClientRect().top + event.view.scrollY;
						postNotebookMessage<webviewMessages.IScrollToRevealMessage>('scroll-to-reveal', { scrollTop });
						return;
					}
				} else {
					const href = node.getAttribute('href');
					if (href) {
						if (href.startsWith('command:') && outputFocus) {
							postNotebookMessage<webviewMessages.IOutputFocusMessage>('outputFocus', outputFocus);
						}
						postNotebookMessage<webviewMessages.IClickedLinkMessage>('clicked-link', { href });
					}
				}

				event.preventDefault();
				event.stopPropagation();
				return;
			}
		}

		if (outputFocus) {
			postNotebookMessage<webviewMessages.IOutputFocusMessage>('outputFocus', outputFocus);
		}
	};

	const blurOutput = () => {
		const selection = window.getSelection();
		if (!selection) {
			return;
		}
		selection.removeAllRanges();
	};

	const selectOutputContents = (cellOrOutputId: string) => {
		const selection = window.getSelection();
		if (!selection) {
			return;
		}
		const cellOutputContainer = window.document.getElementById(cellOrOutputId);
		if (!cellOutputContainer) {
			return;
		}
		selection.removeAllRanges();
		const range = document.createRange();
		range.selectNode(cellOutputContainer);
		selection.addRange(range);

	};

	const selectInputContents = (cellOrOutputId: string) => {
		const cellOutputContainer = window.document.getElementById(cellOrOutputId);
		if (!cellOutputContainer) {
			return;
		}
		const activeElement = window.document.activeElement;
		if (activeElement && hasActiveEditableElement(activeElement, window.document)) {
			(activeElement as HTMLInputElement).select();
		}
	};

	const onPageUpDownSelectionHandler = (e: KeyboardEvent) => {
		if (!lastFocusedOutput?.id || !e.shiftKey) {
			return;
		}

		// If we're pressing `Shift+Up/Down` then we want to select a line at a time.
		if (e.shiftKey && (e.code === 'ArrowUp' || e.code === 'ArrowDown')) {
			e.stopPropagation(); // We don't want the notebook to handle this, default behavior is what we need.
			return;
		}

		// We want to handle just `Shift + PageUp/PageDown` & `Shift + Cmd + ArrowUp/ArrowDown` (for mac)
		if (!(e.code === 'PageUp' || e.code === 'PageDown') && !(e.metaKey && (e.code === 'ArrowDown' || e.code === 'ArrowUp'))) {
			return;
		}
		const outputContainer = window.document.getElementById(lastFocusedOutput.id);
		const selection = window.getSelection();
		if (!outputContainer || !selection?.anchorNode) {
			return;
		}
		const activeElement = window.document.activeElement;
		if (activeElement && hasActiveEditableElement(activeElement, window.document)) {
			// Leave for default behavior.
			return;
		}

		// These should change the scroll position, not adjust the selected cell in the notebook
		e.stopPropagation(); // We don't want the notebook to handle this.
		e.preventDefault(); // We will handle selection.

		const { anchorNode, anchorOffset } = selection;
		const range = document.createRange();
		if (e.code === 'PageDown' || e.code === 'ArrowDown') {
			range.setStart(anchorNode, anchorOffset);
			range.setEnd(outputContainer, 1);
		}
		else {
			range.setStart(outputContainer, 0);
			range.setEnd(anchorNode, anchorOffset);
		}
		selection.removeAllRanges();
		selection.addRange(range);
	};

	const disableNativeSelectAll = (e: KeyboardEvent) => {
		if (!lastFocusedOutput?.id) {
			return;
		}
		const activeElement = window.document.activeElement;
		if (activeElement && hasActiveEditableElement(activeElement, window.document)) {
			// The input element will handle this.
			return;
		}

		if ((e.key === 'a' && e.ctrlKey) || (e.metaKey && e.key === 'a')) {
			e.preventDefault(); // We will handle selection in editor code.
			return;
		}
	};

	const handleDataUrl = async (data: string | ArrayBuffer | null, downloadName: string) => {
		postNotebookMessage<webviewMessages.IClickedDataUrlMessage>('clicked-data-url', {
			data,
			downloadName
		});
	};

	const handleBlobUrlClick = async (url: string, downloadName: string) => {
		try {
			const response = await fetch(url);
			const blob = await response.blob();
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				handleDataUrl(reader.result, downloadName);
			});
			reader.readAsDataURL(blob);
		} catch (e) {
			console.error(e.message);
		}
	};

	window.document.body.addEventListener('click', handleInnerClick);
	window.document.body.addEventListener('focusin', checkOutputInputFocus);
	window.document.body.addEventListener('focusout', handleOutputFocusOut);
	window.document.body.addEventListener('keydown', onPageUpDownSelectionHandler);
	window.document.body.addEventListener('keydown', disableNativeSelectAll);

	interface RendererContext extends rendererApi.RendererContext<unknown> {
		readonly onDidChangeSettings: Event<RenderOptions>;
		readonly settings: RenderOptions;
	}

	interface RendererModule {
		readonly activate: rendererApi.ActivationFunction;
	}

	interface KernelPreloadContext {
		readonly onDidReceiveKernelMessage: Event<unknown>;
		postKernelMessage(data: unknown): void;
	}

	interface KernelPreloadModule {
		activate(ctx: KernelPreloadContext): Promise<void> | void;
	}

	interface IObservedElement {
		id: string;
		output: boolean;
		lastKnownPadding: number;
		lastKnownHeight: number;
		cellId: string;
	}

	function createKernelContext(): KernelPreloadContext {
		return Object.freeze({
			onDidReceiveKernelMessage: onDidReceiveKernelMessage.event,
			postKernelMessage: (data: unknown) => postNotebookMessage('customKernelMessage', { message: data }),
		});
	}

	async function runKernelPreload(url: string): Promise<void> {
		try {
			return await activateModuleKernelPreload(url);
		} catch (e) {
			console.error(e);
			throw e;
		}
	}

	async function activateModuleKernelPreload(url: string) {
		const module: KernelPreloadModule = await __import(url);
		if (!module.activate) {
			console.error(`Notebook preload '${url}' was expected to be a module but it does not export an 'activate' function`);
			return;
		}
		return module.activate(createKernelContext());
	}

	const dimensionUpdater = new class {
		private readonly pending = new Map<string, webviewMessages.DimensionUpdate>();

		updateHeight(id: string, height: number, options: { init?: boolean; isOutput?: boolean }) {
			if (!this.pending.size) {
				setTimeout(() => {
					this.updateImmediately();
				}, 0);
			}
			const update = this.pending.get(id);
			if (update && update.isOutput) {
				this.pending.set(id, {
					id,
					height,
					init: update.init,
					isOutput: update.isOutput
				});
			} else {
				this.pending.set(id, {
					id,
					height,
					...options,
				});
			}
		}

		updateImmediately() {
			if (!this.pending.size) {
				return;
			}

			postNotebookMessage<webviewMessages.IDimensionMessage>('dimension', {
				updates: Array.from(this.pending.values())
			});
			this.pending.clear();
		}
	};

	function elementHasContent(height: number) {
		// we need to account for a potential 1px top and bottom border on a child within the output container
		return height > 2.1;
	}

	const resizeObserver = new class {

		private readonly _observer: ResizeObserver;

		private readonly _observedElements = new WeakMap<Element, IObservedElement>();
		private _outputResizeTimer: Timeout | undefined;

		constructor() {
			this._observer = new ResizeObserver(entries => {
				for (const entry of entries) {
					if (!window.document.body.contains(entry.target)) {
						continue;
					}

					const observedElementInfo = this._observedElements.get(entry.target);
					if (!observedElementInfo) {
						continue;
					}

					this.postResizeMessage(observedElementInfo.cellId);

					if (entry.target.id !== observedElementInfo.id) {
						continue;
					}

					if (!entry.contentRect) {
						continue;
					}

					if (!observedElementInfo.output) {
						// markup, update directly
						this.updateHeight(observedElementInfo, entry.target.offsetHeight);
						continue;
					}

					const hasContent = elementHasContent(entry.contentRect.height);
					const shouldUpdatePadding =
						(hasContent && observedElementInfo.lastKnownPadding === 0) ||
						(!hasContent && observedElementInfo.lastKnownPadding !== 0);

					if (shouldUpdatePadding) {
						// Do not update dimension in resize observer
						window.requestAnimationFrame(() => {
							if (hasContent) {
								entry.target.style.padding = `${ctx.style.outputNodePadding}px ${ctx.style.outputNodePadding}px ${ctx.style.outputNodePadding}px ${ctx.style.outputNodeLeftPadding}px`;
							} else {
								entry.target.style.padding = `0px`;
							}
							this.updateHeight(observedElementInfo, hasContent ? entry.target.offsetHeight : 0);
						});
					} else {
						this.updateHeight(observedElementInfo, hasContent ? entry.target.offsetHeight : 0);
					}
				}
			});
		}

		private updateHeight(observedElementInfo: IObservedElement, offsetHeight: number) {
			if (observedElementInfo.lastKnownHeight !== offsetHeight) {
				observedElementInfo.lastKnownHeight = offsetHeight;
				dimensionUpdater.updateHeight(observedElementInfo.id, offsetHeight, {
					isOutput: observedElementInfo.output
				});
			}
		}

		public observe(container: Element, id: string, output: boolean, cellId: string) {
			if (this._observedElements.has(container)) {
				return;
			}

			this._observedElements.set(container, { id, output, lastKnownPadding: ctx.style.outputNodePadding, lastKnownHeight: -1, cellId });
			this._observer.observe(container);
		}

		private postResizeMessage(cellId: string) {
			// Debounce this callback to only happen after
			// 250 ms. Don't need resize events that often.
			clearTimeout(this._outputResizeTimer);
			this._outputResizeTimer = setTimeout(() => {
				postNotebookMessage('outputResized', {
					cellId
				});
			}, 250);

		}
	};

	let previousDelta: number | undefined;
	let scrollTimeout: Timeout | undefined;
	let scrolledElement: Element | undefined;
	let lastTimeScrolled: number | undefined;
	function flagRecentlyScrolled(node: Element, deltaY?: number) {
		scrolledElement = node;
		if (deltaY === undefined) {
			lastTimeScrolled = Date.now();
			previousDelta = undefined;
			node.setAttribute('recentlyScrolled', 'true');
			clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(() => { scrolledElement?.removeAttribute('recentlyScrolled'); }, 300);
			return true;
		}

		if (node.hasAttribute('recentlyScrolled')) {
			if (lastTimeScrolled && Date.now() - lastTimeScrolled > 400) {
				// it has been a while since we actually scrolled
				// if scroll velocity increases significantly, it's likely a new scroll event
				if (!!previousDelta && deltaY < 0 && deltaY < previousDelta - 8) {
					clearTimeout(scrollTimeout);
					scrolledElement?.removeAttribute('recentlyScrolled');
					return false;
				} else if (!!previousDelta && deltaY > 0 && deltaY > previousDelta + 8) {
					clearTimeout(scrollTimeout);
					scrolledElement?.removeAttribute('recentlyScrolled');
					return false;
				}

				// the tail end of a smooth scrolling event (from a trackpad) can go on for a while
				// so keep swallowing it, but we can shorten the timeout since the events occur rapidly
				clearTimeout(scrollTimeout);
				scrollTimeout = setTimeout(() => { scrolledElement?.removeAttribute('recentlyScrolled'); }, 50);
			} else {
				clearTimeout(scrollTimeout);
				scrollTimeout = setTimeout(() => { scrolledElement?.removeAttribute('recentlyScrolled'); }, 300);
			}

			previousDelta = deltaY;
			return true;
		}

		return false;
	}

	function eventTargetShouldHandleScroll(event: WheelEvent) {
		for (let node = event.target as Node | null; node; node = node.parentNode) {
			if (!(node instanceof Element) || node.id === 'container' || node.classList.contains('cell_container') || node.classList.contains('markup') || node.classList.contains('output_container')) {
				return false;
			}

			// scroll up
			if (event.deltaY < 0 && node.scrollTop > 0) {
				// there is still some content to scroll
				flagRecentlyScrolled(node);
				return true;
			}

			// scroll down
			if (event.deltaY > 0 && node.scrollTop + node.clientHeight < node.scrollHeight) {
				// per https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight
				// scrollTop is not rounded but scrollHeight and clientHeight are
				// so we need to check if the difference is less than some threshold
				if (node.scrollHeight - node.scrollTop - node.clientHeight < 2) {
					continue;
				}

				// if the node is not scrollable, we can continue. We don't check the computed style always as it's expensive
				if (window.getComputedStyle(node).overflowY === 'hidden' || window.getComputedStyle(node).overflowY === 'visible') {
					continue;
				}

				flagRecentlyScrolled(node);
				return true;
			}

			if (flagRecentlyScrolled(node, event.deltaY)) {
				return true;
			}
		}

		return false;
	}

	const handleWheel = (event: WheelEvent & { wheelDeltaX?: number; wheelDeltaY?: number; wheelDelta?: number }) => {
		if (event.defaultPrevented || eventTargetShouldHandleScroll(event)) {
			return;
		}
		postNotebookMessage<webviewMessages.IWheelMessage>('did-scroll-wheel', {
			payload: {
				deltaMode: event.deltaMode,
				deltaX: event.deltaX,
				deltaY: event.deltaY,
				deltaZ: event.deltaZ,
				// Refs https://github.com/microsoft/vscode/issues/146403#issuecomment-1854538928
				wheelDelta: event.wheelDelta && isChrome ? (event.wheelDelta / window.devicePixelRatio) : event.wheelDelta,
				wheelDeltaX: event.wheelDeltaX && isChrome ? (event.wheelDeltaX / window.devicePixelRatio) : event.wheelDeltaX,
				wheelDeltaY: event.wheelDeltaY && isChrome ? (event.wheelDeltaY / window.devicePixelRatio) : event.wheelDeltaY,
				detail: event.detail,
				shiftKey: event.shiftKey,
				type: event.type
			}
		});
	};

	function focusFirstFocusableOrContainerInOutput(cellOrOutputId: string, alternateId?: string) {
		const cellOutputContainer = window.document.getElementById(cellOrOutputId) ??
			(alternateId ? window.document.getElementById(alternateId) : undefined);
		if (cellOutputContainer) {
			if (cellOutputContainer.contains(window.document.activeElement)) {
				return;
			}
			const id = cellOutputContainer.id;
			let focusableElement = cellOutputContainer.querySelector('[tabindex="0"], [href], button, input, option, select, textarea') as HTMLElement | null;
			if (!focusableElement) {
				focusableElement = cellOutputContainer;
				focusableElement.tabIndex = -1;
				postNotebookMessage<webviewMessages.IOutputInputFocusMessage>('outputInputFocus', { inputFocused: false, id });
			} else {
				const inputFocused = hasActiveEditableElement(focusableElement, focusableElement.ownerDocument);
				postNotebookMessage<webviewMessages.IOutputInputFocusMessage>('outputInputFocus', { inputFocused, id });
			}

			lastFocusedOutput = cellOutputContainer;
			postNotebookMessage<webviewMessages.IOutputFocusMessage>('outputFocus', { id: cellOutputContainer.id });
			focusableElement.focus();
		}
	}

	function createFocusSink(cellId: string, focusNext?: boolean) {
		const element = document.createElement('div');
		element.id = `focus-sink-${cellId}`;
		element.tabIndex = 0;
		element.addEventListener('focus', () => {
			postNotebookMessage<webviewMessages.IFocusEditorMessage>('focus-editor', {
				cellId: cellId,
				focusNext
			});
		});

		return element;
	}

	function _internalHighlightRange(range: Range, tagName = 'mark', attributes = {}) {
		// derived from https://github.com/Treora/dom-highlight-range/blob/master/highlight-range.js

		// Return an array of the text nodes in the range. Split the start and end nodes if required.
		function _textNodesInRange(range: Range): Text[] {
			if (!range.startContainer.ownerDocument) {
				return [];
			}

			// If the start or end node is a text node and only partly in the range, split it.
			if (range.startContainer.nodeType === Node.TEXT_NODE && range.startOffset > 0) {
				const startContainer = range.startContainer as Text;
				const endOffset = range.endOffset; // (this may get lost when the splitting the node)
				const createdNode = startContainer.splitText(range.startOffset);
				if (range.endContainer === startContainer) {
					// If the end was in the same container, it will now be in the newly created node.
					range.setEnd(createdNode, endOffset - range.startOffset);
				}

				range.setStart(createdNode, 0);
			}

			if (
				range.endContainer.nodeType === Node.TEXT_NODE
				&& range.endOffset < (range.endContainer as Text).length
			) {
				(range.endContainer as Text).splitText(range.endOffset);
			}

			// Collect the text nodes.
			const walker = range.startContainer.ownerDocument.createTreeWalker(
				range.commonAncestorContainer,
				NodeFilter.SHOW_TEXT,
				node => range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
			);

			walker.currentNode = range.startContainer;

			// // Optimise by skipping nodes that are explicitly outside the range.
			// const NodeTypesWithCharacterOffset = [
			//  Node.TEXT_NODE,
			//  Node.PROCESSING_INSTRUCTION_NODE,
			//  Node.COMMENT_NODE,
			// ];
			// if (!NodeTypesWithCharacterOffset.includes(range.startContainer.nodeType)) {
			//   if (range.startOffset < range.startContainer.childNodes.length) {
			//     walker.currentNode = range.startContainer.childNodes[range.startOffset];
			//   } else {
			//     walker.nextSibling(); // TODO verify this is correct.
			//   }
			// }

			const nodes: Text[] = [];
			if (walker.currentNode.nodeType === Node.TEXT_NODE) {
				nodes.push(walker.currentNode as Text);
			}

			while (walker.nextNode() && range.comparePoint(walker.currentNode, 0) !== 1) {
				if (walker.currentNode.nodeType === Node.TEXT_NODE) {
					nodes.push(walker.currentNode as Text);
				}
			}

			return nodes;
		}

		// Replace [node] with <tagName ...attributes>[node]</tagName>
		function wrapNodeInHighlight(node: Text, tagName: string, attributes: any) {
			const highlightElement = node.ownerDocument.createElement(tagName);
			Object.keys(attributes).forEach(key => {
				highlightElement.setAttribute(key, attributes[key]);
			});
			const tempRange = node.ownerDocument.createRange();
			tempRange.selectNode(node);
			tempRange.surroundContents(highlightElement);
			return highlightElement;
		}

		if (range.collapsed) {
			return {
				remove: () => { },
				update: () => { }
			};
		}

		// First put all nodes in an array (splits start and end nodes if needed)
		const nodes = _textNodesInRange(range);

		// Highlight each node
		const highlightElements: Element[] = [];
		for (const nodeIdx in nodes) {
			const highlightElement = wrapNodeInHighlight(nodes[nodeIdx], tagName, attributes);
			highlightElements.push(highlightElement);
		}

		// Remove a highlight element created with wrapNodeInHighlight.
		function _removeHighlight(highlightElement: Element) {
			if (highlightElement.childNodes.length === 1) {
				highlightElement.replaceWith(highlightElement.firstChild!);
			} else {
				// If the highlight somehow contains multiple nodes now, move them all.
				while (highlightElement.firstChild) {
					highlightElement.parentNode?.insertBefore(highlightElement.firstChild, highlightElement);
				}
				highlightElement.remove();
			}
		}

		// Return a function that cleans up the highlightElements.
		function _removeHighlights() {
			// Remove each of the created highlightElements.
			for (const highlightIdx in highlightElements) {
				_removeHighlight(highlightElements[highlightIdx]);
			}
		}

		function _updateHighlight(highlightElement: Element, attributes: any = {}) {
			Object.keys(attributes).forEach(key => {
				highlightElement.setAttribute(key, attributes[key]);
			});
		}

		function updateHighlights(attributes: any) {
			for (const highlightIdx in highlightElements) {
				_updateHighlight(highlightElements[highlightIdx], attributes);
			}
		}

		return {
			remove: _removeHighlights,
			update: updateHighlights
		};
	}

	interface ICommonRange {
		collapsed: boolean;
		commonAncestorContainer: Node;
		endContainer: Node;
		endOffset: number;
		startContainer: Node;
		startOffset: number;

	}

	interface IHighlightResult {
		range: ICommonRange;
		dispose: () => void;
		update: (color: string | undefined, className: string | undefined) => void;
	}

	function selectRange(_range: ICommonRange) {
		const sel = window.getSelection();
		if (sel) {
			try {
				sel.removeAllRanges();
				const r = document.createRange();
				r.setStart(_range.startContainer, _range.startOffset);
				r.setEnd(_range.endContainer, _range.endOffset);
				sel.addRange(r);
			} catch (e) {
				console.log(e);
			}
		}
	}

	function highlightRange(range: Range, useCustom: boolean, tagName = 'mark', attributes = {}): IHighlightResult {
		if (useCustom) {
			const ret = _internalHighlightRange(range, tagName, attributes);
			return {
				range: range,
				dispose: ret.remove,
				update: (color: string | undefined, className: string | undefined) => {
					if (className === undefined) {
						ret.update({
							'style': `background-color: ${color}`
						});
					} else {
						ret.update({
							'class': className
						});
					}
				}
			};
		} else {
			window.document.execCommand('hiliteColor', false, matchColor);
			const cloneRange = window.getSelection()!.getRangeAt(0).cloneRange();
			const _range = {
				collapsed: cloneRange.collapsed,
				commonAncestorContainer: cloneRange.commonAncestorContainer,
				endContainer: cloneRange.endContainer,
				endOffset: cloneRange.endOffset,
				startContainer: cloneRange.startContainer,
				startOffset: cloneRange.startOffset
			};
			return {
				range: _range,
				dispose: () => {
					selectRange(_range);
					try {
						document.designMode = 'On';
						window.document.execCommand('removeFormat', false, undefined);
						document.designMode = 'Off';
						window.getSelection()?.removeAllRanges();
					} catch (e) {
						console.log(e);
					}
				},
				update: (color: string | undefined, className: string | undefined) => {
					selectRange(_range);
					try {
						document.designMode = 'On';
						window.document.execCommand('removeFormat', false, undefined);
						window.document.execCommand('hiliteColor', false, color);
						document.designMode = 'Off';
						window.getSelection()?.removeAllRanges();
					} catch (e) {
						console.log(e);
					}
				}
			};
		}
	}

	function createEmitter<T>(listenerChange: (listeners: Set<Listener<T>>) => void = () => undefined): EmitterLike<T> {
		const listeners = new Set<Listener<T>>();
		return {
			fire(data) {
				for (const listener of [...listeners]) {
					listener.fn.call(listener.thisArg, data);
				}
			},
			event(fn, thisArg, disposables) {
				const listenerObj = { fn, thisArg };
				const disposable: IDisposable = {
					dispose: () => {
						listeners.delete(listenerObj);
						listenerChange(listeners);
					},
				};

				listeners.add(listenerObj);
				listenerChange(listeners);

				if (disposables instanceof Array) {
					disposables.push(disposable);
				} else if (disposables) {
					disposables.add(disposable);
				}

				return disposable;
			},
		};
	}

	function showRenderError(errorText: string, outputNode: HTMLElement, errors: readonly Error[]) {
		outputNode.innerText = errorText;
		const errList = document.createElement('ul');
		for (const result of errors) {
			console.error(result);
			const item = document.createElement('li');
			item.innerText = result.message;
			errList.appendChild(item);
		}
		outputNode.appendChild(errList);
	}

	const outputItemRequests = new class {
		private _requestPool = 0;
		private readonly _requests = new Map</*requestId*/number, { resolve: (x: webviewMessages.OutputItemEntry | undefined) => void }>();

		getOutputItem(outputId: string, mime: string) {
			const requestId = this._requestPool++;

			const { promise, resolve } = promiseWithResolvers<webviewMessages.OutputItemEntry | undefined>();
			this._requests.set(requestId, { resolve });

			postNotebookMessage<webviewMessages.IGetOutputItemMessage>('getOutputItem', { requestId, outputId, mime });
			return promise;
		}

		resolveOutputItem(requestId: number, output: webviewMessages.OutputItemEntry | undefined) {
			const request = this._requests.get(requestId);
			if (!request) {
				return;
			}

			this._requests.delete(requestId);
			request.resolve(output);
		}
	};

	interface AdditionalOutputItemInfo {
		readonly mime: string;
		getItem(): Promise<rendererApi.OutputItem | undefined>;
	}

	interface ExtendedOutputItem extends rendererApi.OutputItem {
		readonly _allOutputItems: ReadonlyArray<AdditionalOutputItemInfo>;
		appendedText?(): string | undefined;
	}

	let hasWarnedAboutAllOutputItemsProposal = false;

	function createOutputItem(
		id: string,
		mime: string,
		metadata: unknown,
		valueBytes: Uint8Array,
		allOutputItemData: ReadonlyArray<{ readonly mime: string }>,
		appended?: { valueBytes: Uint8Array; previousVersion: number }
	): ExtendedOutputItem {

		function create(
			id: string,
			mime: string,
			metadata: unknown,
			valueBytes: Uint8Array,
			appended?: { valueBytes: Uint8Array; previousVersion: number }
		): ExtendedOutputItem {
			return Object.freeze<ExtendedOutputItem>({
				id,
				mime,
				metadata,

				appendedText(): string | undefined {
					if (appended) {
						return textDecoder.decode(appended.valueBytes);
					}
					return undefined;
				},

				data(): Uint8Array {
					return valueBytes;
				},

				text(): string {
					return textDecoder.decode(valueBytes);
				},

				json() {
					return JSON.parse(this.text());
				},

				blob(): Blob {
					return new Blob([valueBytes as Uint8Array<ArrayBuffer>], { type: this.mime });
				},

				get _allOutputItems() {
					if (!hasWarnedAboutAllOutputItemsProposal) {
						hasWarnedAboutAllOutputItemsProposal = true;
						console.warn(`'_allOutputItems' is proposed API. DO NOT ship an extension that depends on it!`);
					}
					return allOutputItemList;
				},
			});
		}

		const allOutputItemCache = new Map</*mime*/string, Promise<(rendererApi.OutputItem & ExtendedOutputItem) | undefined>>();
		const allOutputItemList = Object.freeze(allOutputItemData.map(outputItem => {
			const mime = outputItem.mime;
			return Object.freeze({
				mime,
				getItem() {
					const existingTask = allOutputItemCache.get(mime);
					if (existingTask) {
						return existingTask;
					}

					const task = outputItemRequests.getOutputItem(id, mime).then(item => {
						return item ? create(id, item.mime, metadata, item.valueBytes) : undefined;
					});
					allOutputItemCache.set(mime, task);

					return task;
				}
			});
		}));

		const item = create(id, mime, metadata, valueBytes, appended);
		allOutputItemCache.set(mime, Promise.resolve(item));
		return item;
	}

	const onDidReceiveKernelMessage = createEmitter<unknown>();

	const ttPolicy = window.trustedTypes?.createPolicy('notebookRenderer', {
		createHTML: value => value, // CodeQL [SM03712] The rendered content is provided by renderer extensions, which are responsible for sanitizing their content themselves. The notebook webview is also sandboxed.
		createScript: value => value, // CodeQL [SM03712] The rendered content is provided by renderer extensions, which are responsible for sanitizing their content themselves. The notebook webview is also sandboxed.
	});

	window.addEventListener('wheel', handleWheel);

	interface IFindMatch {
		type: 'preview' | 'output';
		id: string;
		cellId: string;
		container: Node;
		originalRange: Range;
		isShadow: boolean;
		searchPreviewInfo?: ISearchPreviewInfo;
		highlightResult?: IHighlightResult;
	}

	interface ISearchPreviewInfo {
		line: string;
		range: {
			start: number;
			end: number;
		};
	}

	interface IHighlighter {
		addHighlights(matches: IFindMatch[], ownerID: string): void;
		removeHighlights(ownerID: string): void;
		highlightCurrentMatch(index: number, ownerID: string): void;
		unHighlightCurrentMatch(index: number, ownerID: string): void;
		dispose(): void;
	}

	interface IHighlightInfo {
		matches: IFindMatch[];
		currentMatchIndex: number;
	}

	const matchColor = window.getComputedStyle(window.document.getElementById('_defaultColorPalatte')!).color;
	const currentMatchColor = window.getComputedStyle(window.document.getElementById('_defaultColorPalatte')!).backgroundColor;

	class JSHighlighter implements IHighlighter {
		private _activeHighlightInfo: Map<string, IHighlightInfo>;

		constructor(
		) {
			this._activeHighlightInfo = new Map();
		}

		addHighlights(matches: IFindMatch[], ownerID: string): void {
			for (let i = matches.length - 1; i >= 0; i--) {
				const match = matches[i];
				const ret = highlightRange(match.originalRange, true, 'mark', match.isShadow ? {
					'style': 'background-color: ' + matchColor + ';',
				} : {
					'class': 'find-match'
				});
				match.highlightResult = ret;
			}

			const highlightInfo: IHighlightInfo = {
				matches,
				currentMatchIndex: -1
			};
			this._activeHighlightInfo.set(ownerID, highlightInfo);
		}

		removeHighlights(ownerID: string): void {
			this._activeHighlightInfo.get(ownerID)?.matches.forEach(match => {
				match.highlightResult?.dispose();
			});
			this._activeHighlightInfo.delete(ownerID);
		}

		highlightCurrentMatch(index: number, ownerID: string) {
			const highlightInfo = this._activeHighlightInfo.get(ownerID);
			if (!highlightInfo) {
				console.error('Modified current highlight match before adding highlight list.');
				return;
			}
			const oldMatch = highlightInfo.matches[highlightInfo.currentMatchIndex];
			oldMatch?.highlightResult?.update(matchColor, oldMatch.isShadow ? undefined : 'find-match');

			const match = highlightInfo.matches[index];
			highlightInfo.currentMatchIndex = index;
			const sel = window.getSelection();
			if (!!match && !!sel && match.highlightResult) {
				let offset = 0;
				try {
					const outputOffset = window.document.getElementById(match.id)!.getBoundingClientRect().top;
					const tempRange = document.createRange();
					tempRange.selectNode(match.highlightResult.range.startContainer);

					match.highlightResult.range.startContainer.parentElement?.scrollIntoView({ behavior: 'auto', block: 'end', inline: 'nearest' });

					const rangeOffset = tempRange.getBoundingClientRect().top;
					tempRange.detach();

					offset = rangeOffset - outputOffset;
				} catch (e) {
					console.error(e);
				}

				match.highlightResult?.update(currentMatchColor, match.isShadow ? undefined : 'current-find-match');

				window.document.getSelection()?.removeAllRanges();
				postNotebookMessage('didFindHighlightCurrent', {
					offset
				});
			}
		}

		unHighlightCurrentMatch(index: number, ownerID: string) {
			const highlightInfo = this._activeHighlightInfo.get(ownerID);
			if (!highlightInfo) {
				return;
			}
			const oldMatch = highlightInfo.matches[index];
			if (oldMatch && oldMatch.highlightResult) {
				oldMatch.highlightResult.update(matchColor, oldMatch.isShadow ? undefined : 'find-match');
			}
		}

		dispose() {
			window.document.getSelection()?.removeAllRanges();
			this._activeHighlightInfo.forEach(highlightInfo => {
				highlightInfo.matches.forEach(match => {
					match.highlightResult?.dispose();
				});
			});
		}
	}

	class CSSHighlighter implements IHighlighter {
		private _activeHighlightInfo: Map<string, IHighlightInfo>;
		private _matchesHighlight: Highlight;
		private _currentMatchesHighlight: Highlight;

		constructor() {
			this._activeHighlightInfo = new Map();
			this._matchesHighlight = new Highlight();
			this._matchesHighlight.priority = 1;
			this._currentMatchesHighlight = new Highlight();
			this._currentMatchesHighlight.priority = 2;
			CSS.highlights?.set(`find-highlight`, this._matchesHighlight);
			CSS.highlights?.set(`current-find-highlight`, this._currentMatchesHighlight);
		}

		_refreshRegistry(updateMatchesHighlight = true) {
			// for performance reasons, only update the full list of highlights when we need to
			if (updateMatchesHighlight) {
				this._matchesHighlight.clear();
			}

			this._currentMatchesHighlight.clear();

			this._activeHighlightInfo.forEach((highlightInfo) => {

				if (updateMatchesHighlight) {
					for (let i = 0; i < highlightInfo.matches.length; i++) {
						this._matchesHighlight.add(highlightInfo.matches[i].originalRange);
					}
				}
				if (highlightInfo.currentMatchIndex < highlightInfo.matches.length && highlightInfo.currentMatchIndex >= 0) {
					this._currentMatchesHighlight.add(highlightInfo.matches[highlightInfo.currentMatchIndex].originalRange);
				}
			});
		}

		addHighlights(
			matches: IFindMatch[],
			ownerID: string
		) {

			for (let i = 0; i < matches.length; i++) {
				this._matchesHighlight.add(matches[i].originalRange);
			}

			const newEntry: IHighlightInfo = {
				matches,
				currentMatchIndex: -1,
			};

			this._activeHighlightInfo.set(ownerID, newEntry);
		}

		highlightCurrentMatch(index: number, ownerID: string): void {
			const highlightInfo = this._activeHighlightInfo.get(ownerID);
			if (!highlightInfo) {
				console.error('Modified current highlight match before adding highlight list.');
				return;
			}

			highlightInfo.currentMatchIndex = index;
			const match = highlightInfo.matches[index];

			if (match) {
				let offset = 0;
				try {
					const outputOffset = window.document.getElementById(match.id)!.getBoundingClientRect().top;
					match.originalRange.startContainer.parentElement?.scrollIntoView({ behavior: 'auto', block: 'end', inline: 'nearest' });
					const rangeOffset = match.originalRange.getBoundingClientRect().top;
					offset = rangeOffset - outputOffset;
					postNotebookMessage('didFindHighlightCurrent', {
						offset
					});
				} catch (e) {
					console.error(e);
				}
			}
			this._refreshRegistry(false);
		}

		unHighlightCurrentMatch(index: number, ownerID: string): void {
			const highlightInfo = this._activeHighlightInfo.get(ownerID);
			if (!highlightInfo) {
				return;
			}

			highlightInfo.currentMatchIndex = -1;
		}

		removeHighlights(ownerID: string) {
			this._activeHighlightInfo.delete(ownerID);
			this._refreshRegistry();
		}

		dispose(): void {
			window.document.getSelection()?.removeAllRanges();
			this._currentMatchesHighlight.clear();
			this._matchesHighlight.clear();
		}
	}

	const _highlighter = (CSS.highlights) ? new CSSHighlighter() : new JSHighlighter();

	function extractSelectionLine(selection: Selection): ISearchPreviewInfo {
		const range = selection.getRangeAt(0);

		// we need to keep a reference to the old selection range to re-apply later
		const oldRange = range.cloneRange();
		const captureLength = selection.toString().length;

		// use selection API to modify selection to get entire line (the first line if multi-select)

		// collapse selection to start so that the cursor position is at beginning of match
		selection.collapseToStart();

		// extend selection in both directions to select the line
		selection.modify('move', 'backward', 'lineboundary');
		selection.modify('extend', 'forward', 'lineboundary');

		const line = selection.toString();

		// using the original range and the new range, we can find the offset of the match from the line start.
		const rangeStart = getStartOffset(selection.getRangeAt(0), oldRange);

		// line range for match
		const lineRange = {
			start: rangeStart,
			end: rangeStart + captureLength,
		};

		// re-add the old range so that the selection is restored
		selection.removeAllRanges();
		selection.addRange(oldRange);

		return { line, range: lineRange };
	}

	function getStartOffset(lineRange: Range, originalRange: Range) {
		// sometimes, the old and new range are in different DOM elements (ie: when the match is inside of <b></b>)
		// so we need to find the first common ancestor DOM element and find the positions of the old and new range relative to that.
		const firstCommonAncestor = findFirstCommonAncestor(lineRange.startContainer, originalRange.startContainer);

		const selectionOffset = getSelectionOffsetRelativeTo(firstCommonAncestor, lineRange.startContainer) + lineRange.startOffset;
		const textOffset = getSelectionOffsetRelativeTo(firstCommonAncestor, originalRange.startContainer) + originalRange.startOffset;
		return textOffset - selectionOffset;
	}

	// modified from https://stackoverflow.com/a/68583466/16253823
	function findFirstCommonAncestor(nodeA: Node, nodeB: Node) {
		const range = new Range();
		range.setStart(nodeA, 0);
		range.setEnd(nodeB, 0);
		return range.commonAncestorContainer;
	}

	function getTextContentLength(node: Node): number {
		let length = 0;

		if (node.nodeType === Node.TEXT_NODE) {
			length += node.textContent?.length || 0;
		} else {
			for (const childNode of node.childNodes) {
				length += getTextContentLength(childNode);
			}
		}

		return length;
	}

	// modified from https://stackoverflow.com/a/48812529/16253823
	function getSelectionOffsetRelativeTo(parentElement: Node, currentNode: Node | null): number {
		if (!currentNode) {
			return 0;
		}
		let offset = 0;

		if (currentNode === parentElement || !parentElement.contains(currentNode)) {
			return offset;
		}


		// count the number of chars before the current dom elem and the start of the dom
		let prevSibling = currentNode.previousSibling;
		while (prevSibling) {
			offset += getTextContentLength(prevSibling);
			prevSibling = prevSibling.previousSibling;
		}

		return offset + getSelectionOffsetRelativeTo(parentElement, currentNode.parentNode);
	}

	const find = (query: string, options: { wholeWord?: boolean; caseSensitive?: boolean; includeMarkup: boolean; includeOutput: boolean; shouldGetSearchPreviewInfo: boolean; ownerID: string; findIds: string[] }) => {
		let find = true;
		let matches: IFindMatch[] = [];

		const range = document.createRange();
		range.selectNodeContents(window.document.getElementById('findStart')!);
		const sel = window.getSelection();
		sel?.removeAllRanges();
		sel?.addRange(range);

		viewModel.toggleDragDropEnabled(false);

		try {
			document.designMode = 'On';

			while (find && matches.length < 500) {
				find = (window as unknown as { find: (query: string, caseSensitive: boolean, backwards: boolean, wrapAround: boolean, wholeWord: boolean, searchInFrames: boolean, includeMarkup: boolean) => boolean }).find(query, /* caseSensitive*/ !!options.caseSensitive,
				/* backwards*/ false,
				/* wrapAround*/ false,
				/* wholeWord */ !!options.wholeWord,
				/* searchInFrames*/ true,
					false);

				if (find) {
					const selection = window.getSelection();
					if (!selection) {
						console.log('no selection');
						break;
					}

					// Markdown preview are rendered in a shadow DOM.
					if (options.includeMarkup && selection.rangeCount > 0 && selection.getRangeAt(0).startContainer.nodeType === 1
						&& (selection.getRangeAt(0).startContainer as Element).classList.contains('markup')) {
						// markdown preview container
						const preview = (selection.anchorNode?.firstChild as Element);
						const root = preview.shadowRoot as ShadowRoot & { getSelection: () => Selection };
						const shadowSelection = root?.getSelection ? root?.getSelection() : null;
						// find the match in the shadow dom by checking the selection inside the shadow dom
						if (shadowSelection && shadowSelection.anchorNode) {
							matches.push({
								type: 'preview',
								id: preview.id,
								cellId: preview.id,
								container: preview,
								isShadow: true,
								originalRange: shadowSelection.getRangeAt(0),
								searchPreviewInfo: options.shouldGetSearchPreviewInfo ? extractSelectionLine(shadowSelection) : undefined,
							});
						}
					}

					// Outputs might be rendered inside a shadow DOM.
					if (options.includeOutput && selection.rangeCount > 0 && selection.getRangeAt(0).startContainer.nodeType === 1
						&& (selection.getRangeAt(0).startContainer as Element).classList.contains('output_container')) {
						// output container
						const cellId = selection.getRangeAt(0).startContainer.parentElement!.id;
						const outputNode = (selection.anchorNode?.firstChild as Element);
						const root = outputNode.shadowRoot as ShadowRoot & { getSelection: () => Selection };
						const shadowSelection = root?.getSelection ? root?.getSelection() : null;
						if (shadowSelection && shadowSelection.anchorNode) {
							matches.push({
								type: 'output',
								id: outputNode.id,
								cellId: cellId,
								container: outputNode,
								isShadow: true,
								originalRange: shadowSelection.getRangeAt(0),
								searchPreviewInfo: options.shouldGetSearchPreviewInfo ? extractSelectionLine(shadowSelection) : undefined,
							});
						}
					}

					const anchorNode = selection.anchorNode?.parentElement;

					if (anchorNode) {
						const lastEl: any = matches.length ? matches[matches.length - 1] : null;

						// Optimization: avoid searching for the output container
						if (lastEl && lastEl.container.contains(anchorNode) && options.includeOutput) {
							matches.push({
								type: lastEl.type,
								id: lastEl.id,
								cellId: lastEl.cellId,
								container: lastEl.container,
								isShadow: false,
								originalRange: selection.getRangeAt(0),
								searchPreviewInfo: options.shouldGetSearchPreviewInfo ? extractSelectionLine(selection) : undefined,
							});

						} else {
							// Traverse up the DOM to find the container
							for (let node = anchorNode as Element | null; node; node = node.parentElement) {
								if (!(node instanceof Element)) {
									break;
								}

								if (node.classList.contains('output') && options.includeOutput) {
									// inside output
									const cellId = node.parentElement?.parentElement?.id;
									if (cellId) {
										matches.push({
											type: 'output',
											id: node.id,
											cellId: cellId,
											container: node,
											isShadow: false,
											originalRange: selection.getRangeAt(0),
											searchPreviewInfo: options.shouldGetSearchPreviewInfo ? extractSelectionLine(selection) : undefined,
										});
									}
									break;
								}

								if (node.id === 'container' || node === window.document.body) {
									break;
								}
							}
						}

					} else {
						break;
					}
				}
			}
		} catch (e) {
			console.log(e);
		}


		matches = matches.filter(match => options.findIds.length ? options.findIds.includes(match.cellId) : true);
		_highlighter.addHighlights(matches, options.ownerID);
		window.document.getSelection()?.removeAllRanges();

		viewModel.toggleDragDropEnabled(currentOptions.dragAndDropEnabled);

		document.designMode = 'Off';

		postNotebookMessage('didFind', {
			matches: matches.map((match, index) => ({
				type: match.type,
				id: match.id,
				cellId: match.cellId,
				index,
				searchPreviewInfo: match.searchPreviewInfo,
			}))
		});
	};

	const copyOutputImage = async (outputId: string, altOutputId: string, textAlternates?: { mimeType: string; content: string }[], retries = 5) => {
		if (!window.document.hasFocus() && retries > 0) {
			// copyImage can be called from outside of the webview, which means this function may be running whilst the webview is gaining focus.
			// Since navigator.clipboard.write requires the document to be focused, we need to wait for focus.
			// We cannot use a listener, as there is a high chance the focus is gained during the setup of the listener resulting in us missing it.
			setTimeout(() => { copyOutputImage(outputId, altOutputId, textAlternates, retries - 1); }, 50);
			return;
		}

		try {
			const outputElement = window.document.getElementById(outputId)
				?? window.document.getElementById(altOutputId);

			let image = outputElement?.querySelector('img');

			if (!image) {
				const svgImage = outputElement?.querySelector('svg.output-image') ??
					outputElement?.querySelector('div.svgContainerStyle > svg');

				if (svgImage) {
					image = new Image();
					image.src = 'data:image/svg+xml,' + encodeURIComponent(svgImage.outerHTML);
				}
			}

			if (image) {
				const ensureImageLoaded = (img: HTMLImageElement): Promise<HTMLImageElement> => {
					return new Promise((resolve, reject) => {
						if (img.complete && img.naturalWidth > 0) {
							resolve(img);
						} else {
							img.onload = () => resolve(img);
							img.onerror = () => reject(new Error('Failed to load image'));
							setTimeout(() => reject(new Error('Image load timeout')), 5000);
						}
					});
				};
				const imageToCopy = await ensureImageLoaded(image);

				// Build clipboard data with both image and text formats
				const clipboardData: Record<string, any> = {
					'image/png': new Promise((resolve) => {
						const canvas = document.createElement('canvas');
						canvas.width = imageToCopy.naturalWidth;
						canvas.height = imageToCopy.naturalHeight;
						const context = canvas.getContext('2d');
						context!.drawImage(imageToCopy, 0, 0);

						canvas.toBlob((blob) => {
							if (blob) {
								resolve(blob);
							} else {
								console.error('No blob data to write to clipboard');
							}
							canvas.remove();
						}, 'image/png');
					})
				};

				// Add text alternates if provided
				if (textAlternates) {
					for (const alternate of textAlternates) {
						clipboardData[alternate.mimeType] = alternate.content;
					}
				}

				await navigator.clipboard.write([new ClipboardItem(clipboardData)]);
			} else {
				console.error('Could not find image element to copy for output with id', outputId);
			}
		} catch (e) {
			console.error('Could not copy image:', e);
		}
	};

	window.addEventListener('message', async rawEvent => {
		const event = rawEvent as ({ data: webviewMessages.ToWebviewMessage });

		switch (event.data.type) {
			case 'initializeMarkup': {
				try {
					await Promise.all(event.data.cells.map(info => viewModel.ensureMarkupCell(info)));
				} finally {
					dimensionUpdater.updateImmediately();
					postNotebookMessage('initializedMarkup', { requestId: event.data.requestId });
				}
				break;
			}
			case 'createMarkupCell':
				viewModel.ensureMarkupCell(event.data.cell);
				break;

			case 'showMarkupCell':
				viewModel.showMarkupCell(event.data.id, event.data.top, event.data.content, event.data.metadata);
				break;

			case 'hideMarkupCells':
				for (const id of event.data.ids) {
					viewModel.hideMarkupCell(id);
				}
				break;

			case 'unhideMarkupCells':
				for (const id of event.data.ids) {
					viewModel.unhideMarkupCell(id);
				}
				break;

			case 'deleteMarkupCell':
				for (const id of event.data.ids) {
					viewModel.deleteMarkupCell(id);
				}
				break;

			case 'updateSelectedMarkupCells':
				viewModel.updateSelectedCells(event.data.selectedCellIds);
				break;

			case 'html': {
				const data = event.data;
				if (data.createOnIdle) {
					outputRunner.enqueueIdle(data.outputId, signal => {
						// cancel the idle callback if it exists
						return viewModel.renderOutputCell(data, signal);
					});
				} else {
					outputRunner.enqueue(data.outputId, signal => {
						// cancel the idle callback if it exists
						return viewModel.renderOutputCell(data, signal);
					});
				}
				break;
			}
			case 'view-scroll':
				{
					// const date = new Date();
					// console.log('----- will scroll ----  ', date.getMinutes() + ':' + date.getSeconds() + ':' + date.getMilliseconds());

					event.data.widgets.forEach(widget => {
						outputRunner.enqueue(widget.outputId, () => {
							viewModel.updateOutputsScroll([widget]);
						});
					});
					viewModel.updateMarkupScrolls(event.data.markupCells);
					break;
				}
			case 'clear':
				renderers.clearAll();
				viewModel.clearAll();
				window.document.getElementById('container')!.innerText = '';
				break;

			case 'clearOutput': {
				const { cellId, rendererId, outputId } = event.data;
				outputRunner.cancelOutput(outputId);
				viewModel.clearOutput(cellId, outputId, rendererId);
				break;
			}
			case 'hideOutput': {
				const { cellId, outputId } = event.data;
				outputRunner.enqueue(outputId, () => {
					viewModel.hideOutput(cellId);
				});
				break;
			}
			case 'showOutput': {
				const { outputId, cellTop, cellId, content } = event.data;
				outputRunner.enqueue(outputId, () => {
					viewModel.showOutput(cellId, outputId, cellTop);
					if (content) {
						viewModel.updateAndRerender(cellId, outputId, content);
					}
				});
				break;
			}
			case 'copyImage': {
				await copyOutputImage(event.data.outputId, event.data.altOutputId, event.data.textAlternates);
				break;
			}
			case 'ack-dimension': {
				for (const { cellId, outputId, height } of event.data.updates) {
					viewModel.updateOutputHeight(cellId, outputId, height);
				}
				break;
			}
			case 'preload': {
				const resources = event.data.resources;
				for (const { uri } of resources) {
					kernelPreloads.load(uri);
				}
				break;
			}
			case 'updateRenderers': {
				const { rendererData } = event.data;
				renderers.updateRendererData(rendererData);
				break;
			}
			case 'focus-output':
				focusFirstFocusableOrContainerInOutput(event.data.cellOrOutputId, event.data.alternateId);
				break;
			case 'blur-output':
				blurOutput();
				break;
			case 'select-output-contents':
				selectOutputContents(event.data.cellOrOutputId);
				break;
			case 'select-input-contents':
				selectInputContents(event.data.cellOrOutputId);
				break;
			case 'decorations': {
				let outputContainer = window.document.getElementById(event.data.cellId);
				if (!outputContainer) {
					viewModel.ensureOutputCell(event.data.cellId, -100000, true);
					outputContainer = window.document.getElementById(event.data.cellId);
				}
				outputContainer?.classList.add(...event.data.addedClassNames);
				outputContainer?.classList.remove(...event.data.removedClassNames);
				break;
			}
			case 'markupDecorations': {
				const markupCell = window.document.getElementById(event.data.cellId);
				// The cell may not have been added yet if it is out of view.
				// Decorations will be added when the cell is shown.
				if (markupCell) {
					markupCell?.classList.add(...event.data.addedClassNames);
					markupCell?.classList.remove(...event.data.removedClassNames);
				}
				break;
			}
			case 'customKernelMessage':
				onDidReceiveKernelMessage.fire(event.data.message);
				break;
			case 'customRendererMessage':
				renderers.getRenderer(event.data.rendererId)?.receiveMessage(event.data.message);
				break;
			case 'notebookStyles': {
				const documentStyle = window.document.documentElement.style;

				for (let i = documentStyle.length - 1; i >= 0; i--) {
					const property = documentStyle[i];

					// Don't remove properties that the webview might have added separately
					if (property && property.startsWith('--notebook-')) {
						documentStyle.removeProperty(property);
					}
				}

				// Re-add new properties
				for (const [name, value] of Object.entries(event.data.styles)) {
					documentStyle.setProperty(`--${name}`, value);
				}
				break;
			}
			case 'notebookOptions':
				currentOptions = event.data.options;
				viewModel.toggleDragDropEnabled(currentOptions.dragAndDropEnabled);
				currentRenderOptions = event.data.renderOptions;
				settingChange.fire(currentRenderOptions);
				break;
			case 'tokenizedCodeBlock': {
				const { codeBlockId, html } = event.data;
				MarkdownCodeBlock.highlightCodeBlock(codeBlockId, html);
				break;
			}
			case 'tokenizedStylesChanged': {
				tokenizationStyle.replaceSync(event.data.css);
				break;
			}
			case 'find': {
				_highlighter.removeHighlights(event.data.options.ownerID);
				find(event.data.query, event.data.options);
				break;
			}
			case 'findHighlightCurrent': {
				_highlighter?.highlightCurrentMatch(event.data.index, event.data.ownerID);
				break;
			}
			case 'findUnHighlightCurrent': {
				_highlighter?.unHighlightCurrentMatch(event.data.index, event.data.ownerID);
				break;
			}
			case 'findStop': {
				_highlighter.removeHighlights(event.data.ownerID);
				break;
			}
			case 'returnOutputItem': {
				outputItemRequests.resolveOutputItem(event.data.requestId, event.data.output);
			}
		}
	});

	const renderFallbackErrorName = 'vscode.fallbackToNextRenderer';

	class Renderer {

		private _onMessageEvent = createEmitter();
		private _loadPromise?: Promise<rendererApi.RendererApi | undefined>;
		private _api: rendererApi.RendererApi | undefined;

		constructor(
			public readonly data: webviewMessages.RendererMetadata,
		) { }

		public receiveMessage(message: unknown) {
			this._onMessageEvent.fire(message);
		}

		public async renderOutputItem(item: rendererApi.OutputItem, element: HTMLElement, signal: AbortSignal): Promise<void> {
			try {
				await this.load();
			} catch (e) {
				if (!signal.aborted) {
					showRenderError(`Error loading renderer '${this.data.id}'`, element, e instanceof Error ? [e] : []);
				}
				return;
			}

			if (!this._api) {
				if (!signal.aborted) {
					showRenderError(`Renderer '${this.data.id}' does not implement renderOutputItem`, element, []);
				}
				return;
			}

			try {
				const renderStart = performance.now();
				await this._api.renderOutputItem(item, element, signal);
				this.postDebugMessage('Rendered output item', { id: item.id, duration: `${performance.now() - renderStart}ms` });

			} catch (e) {
				if (signal.aborted) {
					return;
				}

				if (e instanceof Error && e.name === renderFallbackErrorName) {
					throw e;
				}

				showRenderError(`Error rendering output item using '${this.data.id}'`, element, e instanceof Error ? [e] : []);
				this.postDebugMessage('Rendering output item failed', { id: item.id, error: e + '' });
			}
		}

		public disposeOutputItem(id?: string): void {
			this._api?.disposeOutputItem?.(id);
		}

		private createRendererContext(): RendererContext {
			const { id, messaging } = this.data;
			const context: RendererContext = {
				setState: newState => vscode.setState({ ...vscode.getState(), [id]: newState }),
				getState: <T>() => {
					const state = vscode.getState();
					return typeof state === 'object' && state ? state[id] as T : undefined;
				},
				getRenderer: async (id: string) => {
					const renderer = renderers.getRenderer(id);
					if (!renderer) {
						return undefined;
					}
					if (renderer._api) {
						return renderer._api;
					}
					return renderer.load();
				},
				workspace: {
					get isTrusted() { return isWorkspaceTrusted; }
				},
				settings: {
					get lineLimit() { return currentRenderOptions.lineLimit; },
					get outputScrolling() { return currentRenderOptions.outputScrolling; },
					get outputWordWrap() { return currentRenderOptions.outputWordWrap; },
					get linkifyFilePaths() { return currentRenderOptions.linkifyFilePaths; },
					get minimalError() { return currentRenderOptions.minimalError; },
				},
				get onDidChangeSettings() { return settingChange.event; }
			};

			if (messaging) {
				context.onDidReceiveMessage = this._onMessageEvent.event;
				context.postMessage = message => postNotebookMessage('customRendererMessage', { rendererId: id, message });
			}

			return Object.freeze(context);
		}

		private load(): Promise<rendererApi.RendererApi | undefined> {
			this._loadPromise ??= this._load();
			return this._loadPromise;
		}

		/** Inner function cached in the _loadPromise(). */
		private async _load(): Promise<rendererApi.RendererApi | undefined> {
			this.postDebugMessage('Start loading renderer');

			try {
				// Preloads need to be loaded before loading renderers.
				await kernelPreloads.waitForAllCurrent();

				const importStart = performance.now();
				const module: RendererModule = await __import(this.data.entrypoint.path);
				this.postDebugMessage('Imported renderer', { duration: `${performance.now() - importStart}ms` });

				if (!module) {
					return;
				}

				this._api = await module.activate(this.createRendererContext());
				this.postDebugMessage('Activated renderer', { duration: `${performance.now() - importStart}ms` });

				const dependantRenderers = ctx.rendererData
					.filter(d => d.entrypoint.extends === this.data.id);

				if (dependantRenderers.length) {
					this.postDebugMessage('Activating dependant renderers', { dependents: dependantRenderers.map(x => x.id).join(', ') });
				}

				// Load all renderers that extend this renderer
				await Promise.all(dependantRenderers.map(async d => {
					const renderer = renderers.getRenderer(d.id);
					if (!renderer) {
						throw new Error(`Could not find extending renderer: ${d.id}`);
					}

					try {
						return await renderer.load();
					} catch (e) {
						// Squash any errors extends errors. They won't prevent the renderer
						// itself from working, so just log them.
						console.error(e);
						this.postDebugMessage('Activating dependant renderer failed', { dependent: d.id, error: e + '' });
						return undefined;
					}
				}));

				return this._api;
			} catch (e) {
				this.postDebugMessage('Loading renderer failed');
				throw e;
			}
		}

		private postDebugMessage(msg: string, data?: Record<string, string>) {
			postNotebookMessage<webviewMessages.ILogRendererDebugMessage>('logRendererDebugMessage', {
				message: `[renderer ${this.data.id}] - ${msg}`,
				data
			});
		}
	}

	const kernelPreloads = new class {
		private readonly preloads = new Map<string /* uri */, Promise<unknown>>();

		/**
		 * Returns a promise that resolves when the given preload is activated.
		 */
		public waitFor(uri: string) {
			return this.preloads.get(uri) || Promise.resolve(new Error(`Preload not ready: ${uri}`));
		}

		/**
		 * Loads a preload.
		 * @param uri URI to load from
		 * @param originalUri URI to show in an error message if the preload is invalid.
		 */
		public load(uri: string) {
			const promise = Promise.all([
				runKernelPreload(uri),
				this.waitForAllCurrent(),
			]);

			this.preloads.set(uri, promise);
			return promise;
		}

		/**
		 * Returns a promise that waits for all currently-registered preloads to
		 * activate before resolving.
		 */
		public waitForAllCurrent() {
			return Promise.all([...this.preloads.values()].map(p => p.catch(err => err)));
		}
	};

	const outputRunner = new class {
		private readonly outputs = new Map<string, { abort: AbortController; queue: Promise<unknown> }>();

		/**
		 * Pushes the action onto the list of actions for the given output ID,
		 * ensuring that it's run in-order.
		 */
		public enqueue(outputId: string, action: (cancelSignal: AbortSignal) => unknown) {
			this.pendingOutputCreationRequest.get(outputId)?.dispose();
			this.pendingOutputCreationRequest.delete(outputId);

			const record = this.outputs.get(outputId);
			if (!record) {
				const controller = new AbortController();
				this.outputs.set(outputId, { abort: controller, queue: new Promise(r => r(action(controller.signal))) });
			} else {
				record.queue = record.queue.then(async r => {
					if (!record.abort.signal.aborted) {
						await action(record.abort.signal);
					}
				});
			}
		}

		private pendingOutputCreationRequest: Map<string, IDisposable> = new Map();

		public enqueueIdle(outputId: string, action: (cancelSignal: AbortSignal) => unknown) {
			this.pendingOutputCreationRequest.get(outputId)?.dispose();
			outputRunner.pendingOutputCreationRequest.set(outputId, runWhenIdle(() => {
				outputRunner.enqueue(outputId, action);
				outputRunner.pendingOutputCreationRequest.delete(outputId);
			}));
		}

		/**
		 * Cancels the rendering of all outputs.
		 */
		public cancelAll() {
			// Delete all pending idle requests
			this.pendingOutputCreationRequest.forEach(r => r.dispose());
			this.pendingOutputCreationRequest.clear();

			for (const { abort } of this.outputs.values()) {
				abort.abort();
			}
			this.outputs.clear();
		}

		/**
		 * Cancels any ongoing rendering out an output.
		 */
		public cancelOutput(outputId: string) {
			// Delete the pending idle request if it exists
			this.pendingOutputCreationRequest.get(outputId)?.dispose();
			this.pendingOutputCreationRequest.delete(outputId);

			const output = this.outputs.get(outputId);
			if (output) {
				output.abort.abort();
				this.outputs.delete(outputId);
			}
		}
	};

	const renderers = new class {
		private readonly _renderers = new Map</* id */ string, Renderer>();

		constructor() {
			for (const renderer of ctx.rendererData) {
				this.addRenderer(renderer);
			}
		}

		public getRenderer(id: string): Renderer | undefined {
			return this._renderers.get(id);
		}

		private rendererEqual(a: webviewMessages.RendererMetadata, b: webviewMessages.RendererMetadata) {
			if (a.id !== b.id || a.entrypoint.path !== b.entrypoint.path || a.entrypoint.extends !== b.entrypoint.extends || a.messaging !== b.messaging) {
				return false;
			}

			if (a.mimeTypes.length !== b.mimeTypes.length) {
				return false;
			}

			for (let i = 0; i < a.mimeTypes.length; i++) {
				if (a.mimeTypes[i] !== b.mimeTypes[i]) {
					return false;
				}
			}

			return true;
		}

		public updateRendererData(rendererData: readonly webviewMessages.RendererMetadata[]) {
			const oldKeys = new Set(this._renderers.keys());
			const newKeys = new Set(rendererData.map(d => d.id));

			for (const renderer of rendererData) {
				const existing = this._renderers.get(renderer.id);
				if (existing && this.rendererEqual(existing.data, renderer)) {
					continue;
				}

				this.addRenderer(renderer);
			}

			for (const key of oldKeys) {
				if (!newKeys.has(key)) {
					this._renderers.delete(key);
				}
			}
		}

		private addRenderer(renderer: webviewMessages.RendererMetadata) {
			this._renderers.set(renderer.id, new Renderer(renderer));
		}

		public clearAll() {
			outputRunner.cancelAll();
			for (const renderer of this._renderers.values()) {
				renderer.disposeOutputItem();
			}
		}

		public clearOutput(rendererId: string, outputId: string) {
			outputRunner.cancelOutput(outputId);
			this._renderers.get(rendererId)?.disposeOutputItem(outputId);
		}

		public async render(item: ExtendedOutputItem, preferredRendererId: string | undefined, element: HTMLElement, signal: AbortSignal): Promise<void> {
			const primaryRenderer = this.findRenderer(preferredRendererId, item);
			if (!primaryRenderer) {
				const errorMessage = (window.document.documentElement.style.getPropertyValue('--notebook-cell-renderer-not-found-error') || '').replace('$0', () => item.mime);
				this.showRenderError(item, element, errorMessage);
				return;
			}

			// Try primary renderer first
			if (!(await this._doRender(item, element, primaryRenderer, signal)).continue) {
				return;
			}

			// Primary renderer failed in an expected way. Fallback to render the next mime types
			for (const additionalItemData of item._allOutputItems) {
				if (additionalItemData.mime === item.mime) {
					continue;
				}

				const additionalItem = await additionalItemData.getItem();
				if (signal.aborted) {
					return;
				}

				if (additionalItem) {
					const renderer = this.findRenderer(undefined, additionalItem);
					if (renderer) {
						if (!(await this._doRender(additionalItem, element, renderer, signal)).continue) {
							return; // We rendered successfully
						}
					}
				}
			}

			// All renderers have failed and there is nothing left to fallback to
			const errorMessage = (window.document.documentElement.style.getPropertyValue('--notebook-cell-renderer-fallbacks-exhausted') || '').replace('$0', () => item.mime);
			this.showRenderError(item, element, errorMessage);
		}

		private async _doRender(item: rendererApi.OutputItem, element: HTMLElement, renderer: Renderer, signal: AbortSignal): Promise<{ continue: boolean }> {
			try {
				await renderer.renderOutputItem(item, element, signal);
				return { continue: false }; // We rendered successfully
			} catch (e) {
				if (signal.aborted) {
					return { continue: false };
				}

				if (e instanceof Error && e.name === renderFallbackErrorName) {
					return { continue: true };
				} else {
					throw e; // Bail and let callers handle unknown errors
				}
			}
		}

		private findRenderer(preferredRendererId: string | undefined, info: rendererApi.OutputItem) {
			let renderer: Renderer | undefined;

			if (typeof preferredRendererId === 'string') {
				renderer = Array.from(this._renderers.values())
					.find((renderer) => renderer.data.id === preferredRendererId);
			} else {
				const renderers = Array.from(this._renderers.values())
					.filter((renderer) => renderer.data.mimeTypes.includes(info.mime) && !renderer.data.entrypoint.extends);

				if (renderers.length) {
					// De-prioritize built-in renderers
					renderers.sort((a, b) => +a.data.isBuiltin - +b.data.isBuiltin);

					// Use first renderer we find in sorted list
					renderer = renderers[0];
				}
			}
			return renderer;
		}

		private showRenderError(info: rendererApi.OutputItem, element: HTMLElement, errorMessage: string) {
			const errorContainer = document.createElement('div');

			const error = document.createElement('div');
			error.className = 'no-renderer-error';
			error.innerText = errorMessage;

			const cellText = document.createElement('div');
			cellText.innerText = info.text();

			errorContainer.appendChild(error);
			errorContainer.appendChild(cellText);

			element.innerText = '';
			element.appendChild(errorContainer);
		}
	}();

	const viewModel = new class ViewModel {

		private readonly _markupCells = new Map<string, MarkupCell>();
		private readonly _outputCells = new Map<string, OutputCell>();

		public clearAll() {
			for (const cell of this._markupCells.values()) {
				cell.dispose();
			}
			this._markupCells.clear();

			for (const output of this._outputCells.values()) {
				output.dispose();
			}
			this._outputCells.clear();
		}

		private async createMarkupCell(init: webviewMessages.IMarkupCellInitialization, top: number, visible: boolean): Promise<MarkupCell> {
			const existing = this._markupCells.get(init.cellId);
			if (existing) {
				console.error(`Trying to create markup that already exists: ${init.cellId}`);
				return existing;
			}

			const cell = new MarkupCell(init.cellId, init.mime, init.content, top, init.metadata);
			cell.element.style.visibility = visible ? '' : 'hidden';
			this._markupCells.set(init.cellId, cell);

			await cell.ready;
			return cell;
		}

		public async ensureMarkupCell(info: webviewMessages.IMarkupCellInitialization): Promise<void> {
			let cell = this._markupCells.get(info.cellId);
			if (cell) {
				cell.element.style.visibility = info.visible ? '' : 'hidden';
				await cell.updateContentAndRender(info.content, info.metadata);
			} else {
				cell = await this.createMarkupCell(info, info.offset, info.visible);
			}
		}

		public deleteMarkupCell(id: string) {
			const cell = this.getExpectedMarkupCell(id);
			if (cell) {
				cell.remove();
				cell.dispose();
				this._markupCells.delete(id);
			}
		}

		public async updateMarkupContent(id: string, newContent: string, metadata: NotebookCellMetadata): Promise<void> {
			const cell = this.getExpectedMarkupCell(id);
			await cell?.updateContentAndRender(newContent, metadata);
		}

		public showMarkupCell(id: string, top: number, newContent: string | undefined, metadata: NotebookCellMetadata | undefined): void {
			const cell = this.getExpectedMarkupCell(id);
			cell?.show(top, newContent, metadata);
		}

		public hideMarkupCell(id: string): void {
			const cell = this.getExpectedMarkupCell(id);
			cell?.hide();
		}

		public unhideMarkupCell(id: string): void {
			const cell = this.getExpectedMarkupCell(id);
			cell?.unhide();
		}

		private getExpectedMarkupCell(id: string): MarkupCell | undefined {
			const cell = this._markupCells.get(id);
			if (!cell) {
				console.log(`Could not find markup cell '${id}'`);
				return undefined;
			}
			return cell;
		}

		public updateSelectedCells(selectedCellIds: readonly string[]) {
			const selectedCellSet = new Set<string>(selectedCellIds);
			for (const cell of this._markupCells.values()) {
				cell.setSelected(selectedCellSet.has(cell.id));
			}
		}

		public toggleDragDropEnabled(dragAndDropEnabled: boolean) {
			for (const cell of this._markupCells.values()) {
				cell.toggleDragDropEnabled(dragAndDropEnabled);
			}
		}

		public updateMarkupScrolls(markupCells: readonly webviewMessages.IMarkupCellScrollTops[]) {
			for (const { id, top } of markupCells) {
				const cell = this._markupCells.get(id);
				if (cell) {
					cell.element.style.top = `${top}px`;
				}
			}
		}

		public async renderOutputCell(data: webviewMessages.ICreationRequestMessage, signal: AbortSignal): Promise<void> {
			const preloadErrors = await Promise.all<undefined | Error>(
				data.requiredPreloads.map(p => kernelPreloads.waitFor(p.uri).then(() => undefined, err => err))
			);
			if (signal.aborted) {
				return;
			}

			const cellOutput = this.ensureOutputCell(data.cellId, data.cellTop, false);
			return cellOutput.renderOutputElement(data, preloadErrors, signal);
		}

		public ensureOutputCell(cellId: string, cellTop: number, skipCellTopUpdateIfExist: boolean): OutputCell {
			let cell = this._outputCells.get(cellId);
			const existed = !!cell;
			if (!cell) {
				cell = new OutputCell(cellId);
				this._outputCells.set(cellId, cell);
			}

			if (existed && skipCellTopUpdateIfExist) {
				return cell;
			}

			cell.element.style.top = cellTop + 'px';
			return cell;
		}

		public clearOutput(cellId: string, outputId: string, rendererId: string | undefined) {
			const cell = this._outputCells.get(cellId);
			cell?.clearOutput(outputId, rendererId);
		}

		public showOutput(cellId: string, outputId: string, top: number) {
			const cell = this._outputCells.get(cellId);
			cell?.show(outputId, top);
		}

		public updateAndRerender(cellId: string, outputId: string, content: webviewMessages.ICreationContent) {
			const cell = this._outputCells.get(cellId);
			cell?.updateContentAndRerender(outputId, content);
		}

		public hideOutput(cellId: string) {
			const cell = this._outputCells.get(cellId);
			cell?.hide();
		}

		public updateOutputHeight(cellId: string, outputId: string, height: number) {
			const cell = this._outputCells.get(cellId);
			cell?.updateOutputHeight(outputId, height);
		}

		public updateOutputsScroll(updates: webviewMessages.IContentWidgetTopRequest[]) {
			for (const request of updates) {
				const cell = this._outputCells.get(request.cellId);
				cell?.updateScroll(request);
			}
		}
	}();

	class MarkdownCodeBlock {
		private static pendingCodeBlocksToHighlight = new Map<string, HTMLElement>();

		public static highlightCodeBlock(id: string, html: string) {
			const el = MarkdownCodeBlock.pendingCodeBlocksToHighlight.get(id);
			if (!el) {
				return;
			}
			const trustedHtml = ttPolicy?.createHTML(html) ?? html;
			el.innerHTML = trustedHtml as string; // CodeQL [SM03712] The rendered content comes from VS Code's tokenizer and is considered safe
			const root = el.getRootNode();
			if (root instanceof ShadowRoot) {
				if (!root.adoptedStyleSheets.includes(tokenizationStyle)) {
					root.adoptedStyleSheets.push(tokenizationStyle);
				}
			}
		}

		public static requestHighlightCodeBlock(root: HTMLElement | ShadowRoot) {
			const codeBlocks: Array<{ value: string; lang: string; id: string }> = [];
			let i = 0;
			for (const el of root.querySelectorAll('.vscode-code-block')) {
				const lang = el.getAttribute('data-vscode-code-block-lang');
				if (el.textContent && lang) {
					const id = `${Date.now()}-${i++}`;
					codeBlocks.push({ value: el.textContent, lang: lang, id });
					MarkdownCodeBlock.pendingCodeBlocksToHighlight.set(id, el as HTMLElement);
				}
			}

			return codeBlocks;
		}
	}

	class MarkupCell {

		public readonly ready: Promise<void>;

		public readonly id: string;
		public readonly element: HTMLElement;

		private readonly outputItem: ExtendedOutputItem;

		/// Internal field that holds text content
		private _content: { readonly value: string; readonly version: number; readonly metadata: NotebookCellMetadata };

		private _isDisposed = false;
		private renderTaskAbort?: AbortController;

		constructor(id: string, mime: string, content: string, top: number, metadata: NotebookCellMetadata) {
			const self = this;
			this.id = id;
			this._content = { value: content, version: 0, metadata: metadata };

			const { promise, resolve, reject } = promiseWithResolvers<void>();
			this.ready = promise;

			let cachedData: { readonly version: number; readonly value: Uint8Array } | undefined;
			this.outputItem = Object.freeze<ExtendedOutputItem>({
				id,
				mime,

				get metadata(): NotebookCellMetadata {
					return self._content.metadata;
				},

				text: (): string => {
					return this._content.value;
				},

				json: () => {
					return undefined;
				},

				data: (): Uint8Array => {
					if (cachedData?.version === this._content.version) {
						return cachedData.value;
					}

					const data = textEncoder.encode(this._content.value);
					cachedData = { version: this._content.version, value: data };
					return data;
				},

				blob(): Blob {
					return new Blob([this.data() as Uint8Array<ArrayBuffer>], { type: this.mime });
				},

				_allOutputItems: [{
					mime,
					getItem: async () => this.outputItem,
				}]
			});

			const root = window.document.getElementById('container')!;
			const markupCell = document.createElement('div');
			markupCell.className = 'markup';
			markupCell.style.position = 'absolute';
			markupCell.style.width = '100%';

			this.element = document.createElement('div');
			this.element.id = this.id;
			this.element.classList.add('preview');
			this.element.style.position = 'absolute';
			this.element.style.top = top + 'px';
			this.toggleDragDropEnabled(currentOptions.dragAndDropEnabled);
			markupCell.appendChild(this.element);
			root.appendChild(markupCell);

			this.addEventListeners();

			this.updateContentAndRender(this._content.value, this._content.metadata).then(() => {
				if (!this._isDisposed) {
					resizeObserver.observe(this.element, this.id, false, this.id);
				}
				resolve();
			}, () => reject());
		}

		public dispose() {
			this._isDisposed = true;
			this.renderTaskAbort?.abort();
			this.renderTaskAbort = undefined;
		}

		private addEventListeners() {
			this.element.addEventListener('dblclick', () => {
				postNotebookMessage<webviewMessages.IToggleMarkupPreviewMessage>('toggleMarkupPreview', { cellId: this.id });
			});

			this.element.addEventListener('click', e => {
				postNotebookMessage<webviewMessages.IClickMarkupCellMessage>('clickMarkupCell', {
					cellId: this.id,
					altKey: e.altKey,
					ctrlKey: e.ctrlKey,
					metaKey: e.metaKey,
					shiftKey: e.shiftKey,
				});
			});

			this.element.addEventListener('contextmenu', e => {
				postNotebookMessage<webviewMessages.IContextMenuMarkupCellMessage>('contextMenuMarkupCell', {
					cellId: this.id,
					clientX: e.clientX,
					clientY: e.clientY,
				});
			});

			this.element.addEventListener('mouseenter', () => {
				postNotebookMessage<webviewMessages.IMouseEnterMarkupCellMessage>('mouseEnterMarkupCell', { cellId: this.id });
			});

			this.element.addEventListener('mouseleave', () => {
				postNotebookMessage<webviewMessages.IMouseLeaveMarkupCellMessage>('mouseLeaveMarkupCell', { cellId: this.id });
			});

			this.element.addEventListener('dragstart', e => {
				markupCellDragManager.startDrag(e, this.id);
			});

			this.element.addEventListener('drag', e => {
				markupCellDragManager.updateDrag(e, this.id);
			});

			this.element.addEventListener('dragend', e => {
				markupCellDragManager.endDrag(e, this.id);
			});
		}

		public async updateContentAndRender(newContent: string, metadata: NotebookCellMetadata): Promise<void> {
			this._content = { value: newContent, version: this._content.version + 1, metadata };

			this.renderTaskAbort?.abort();

			const controller = new AbortController();
			this.renderTaskAbort = controller;
			try {
				await renderers.render(this.outputItem, undefined, this.element, this.renderTaskAbort.signal);
			} finally {
				if (this.renderTaskAbort === controller) {
					this.renderTaskAbort = undefined;
				}
			}

			const root = (this.element.shadowRoot ?? this.element);
			const html = [];
			for (const child of root.children) {
				switch (child.tagName) {
					case 'LINK':
					case 'SCRIPT':
					case 'STYLE':
						// not worth sending over since it will be stripped before rendering
						break;

					default:
						html.push(child.outerHTML);
						break;
				}
			}

			const codeBlocks: Array<{ value: string; lang: string; id: string }> = MarkdownCodeBlock.requestHighlightCodeBlock(root);

			postNotebookMessage<webviewMessages.IRenderedMarkupMessage>('renderedMarkup', {
				cellId: this.id,
				html: html.join(''),
				codeBlocks
			});

			dimensionUpdater.updateHeight(this.id, this.element.offsetHeight, {
				isOutput: false
			});
		}

		public show(top: number, newContent: string | undefined, metadata: NotebookCellMetadata | undefined): void {
			this.element.style.visibility = '';
			this.element.style.top = `${top}px`;
			if (typeof newContent === 'string' || metadata) {
				this.updateContentAndRender(newContent ?? this._content.value, metadata ?? this._content.metadata);
			} else {
				this.updateMarkupDimensions();
			}
		}

		public hide() {
			this.element.style.visibility = 'hidden';
		}

		public unhide() {
			this.element.style.visibility = '';
			this.updateMarkupDimensions();
		}

		public remove() {
			this.element.remove();
		}

		private async updateMarkupDimensions() {
			dimensionUpdater.updateHeight(this.id, this.element.offsetHeight, {
				isOutput: false
			});
		}

		public setSelected(selected: boolean) {
			this.element.classList.toggle('selected', selected);
		}

		public toggleDragDropEnabled(enabled: boolean) {
			if (enabled) {
				this.element.classList.add('draggable');
				this.element.setAttribute('draggable', 'true');
			} else {
				this.element.classList.remove('draggable');
				this.element.removeAttribute('draggable');
			}
		}
	}

	class OutputCell {
		public readonly element: HTMLElement;
		private readonly outputElements = new Map</*outputId*/ string, OutputContainer>();

		constructor(cellId: string) {
			const container = window.document.getElementById('container')!;

			const upperWrapperElement = createFocusSink(cellId);
			container.appendChild(upperWrapperElement);

			this.element = document.createElement('div');
			this.element.style.position = 'absolute';
			this.element.style.outline = '0';

			this.element.id = cellId;
			this.element.classList.add('cell_container');

			container.appendChild(this.element);
			this.element = this.element;

			const lowerWrapperElement = createFocusSink(cellId, true);
			container.appendChild(lowerWrapperElement);
		}

		public dispose() {
			for (const output of this.outputElements.values()) {
				output.dispose();
			}
			this.outputElements.clear();
		}

		private createOutputElement(data: webviewMessages.ICreationRequestMessage): OutputElement {
			let outputContainer = this.outputElements.get(data.outputId);
			if (!outputContainer) {
				outputContainer = new OutputContainer(data.outputId);
				this.element.appendChild(outputContainer.element);
				this.outputElements.set(data.outputId, outputContainer);
			}

			return outputContainer.createOutputElement(data.outputId, data.outputOffset, data.left, data.cellId);
		}

		public async renderOutputElement(data: webviewMessages.ICreationRequestMessage, preloadErrors: ReadonlyArray<Error | undefined>, signal: AbortSignal) {
			const startTime = Date.now();
			const outputElement /** outputNode */ = this.createOutputElement(data);
			await outputElement.render(data.content, data.rendererId, preloadErrors, signal);

			// don't hide until after this step so that the height is right
			outputElement/** outputNode */.element.style.visibility = data.initiallyHidden ? 'hidden' : '';

			if (!!data.executionId && !!data.rendererId) {
				let outputSize: number | undefined = undefined;
				if (data.content.type === 1 /* extension */) {
					outputSize = data.content.output.valueBytes.length;
				}

				// Only send performance messages for non-empty outputs up to a certain size
				if (outputSize !== undefined && outputSize > 0 && outputSize < 100 * 1024) {
					postNotebookMessage<webviewMessages.IPerformanceMessage>('notebookPerformanceMessage', {
						cellId: data.cellId,
						executionId: data.executionId,
						duration: Date.now() - startTime,
						rendererId: data.rendererId,
						outputSize
					});
				}
			}
		}

		public clearOutput(outputId: string, rendererId: string | undefined) {
			const output = this.outputElements.get(outputId);
			output?.clear(rendererId);
			output?.dispose();
			this.outputElements.delete(outputId);
		}

		public show(outputId: string, top: number) {
			const outputContainer = this.outputElements.get(outputId);
			if (!outputContainer) {
				return;
			}

			this.element.style.visibility = '';
			this.element.style.top = `${top}px`;
		}

		public hide() {
			this.element.style.visibility = 'hidden';
		}

		public updateContentAndRerender(outputId: string, content: webviewMessages.ICreationContent) {
			this.outputElements.get(outputId)?.updateContentAndRender(content);
		}

		public updateOutputHeight(outputId: string, height: number) {
			this.outputElements.get(outputId)?.updateHeight(height);
		}

		public updateScroll(request: webviewMessages.IContentWidgetTopRequest) {
			this.element.style.top = `${request.cellTop}px`;

			const outputElement = this.outputElements.get(request.outputId);
			if (outputElement) {
				outputElement.updateScroll(request.outputOffset);

				if (request.forceDisplay && outputElement.outputNode) {
					// TODO @rebornix @mjbvz, there is a misalignment here.
					// We set output visibility on cell container, other than output container or output node itself.
					outputElement.outputNode.element.style.visibility = '';
				}
			}

			if (request.forceDisplay) {
				this.element.style.visibility = '';
			}
		}
	}

	class OutputContainer {

		public readonly element: HTMLElement;

		private _outputNode?: OutputElement;

		get outputNode() {
			return this._outputNode;
		}

		constructor(
			private readonly outputId: string,
		) {
			this.element = document.createElement('div');
			this.element.classList.add('output_container');
			this.element.setAttribute('data-vscode-context', JSON.stringify({ 'preventDefaultContextMenuItems': true }));
			this.element.style.position = 'absolute';
			this.element.style.overflow = 'hidden';
		}

		public dispose() {
			this._outputNode?.dispose();
		}

		public clear(rendererId: string | undefined) {
			if (rendererId) {
				renderers.clearOutput(rendererId, this.outputId);
			}
			this.element.remove();
		}

		public updateHeight(height: number) {
			this.element.style.maxHeight = `${height}px`;
			this.element.style.height = `${height}px`;
		}

		public updateScroll(outputOffset: number) {
			this.element.style.top = `${outputOffset}px`;
		}

		public createOutputElement(outputId: string, outputOffset: number, left: number, cellId: string): OutputElement {
			this.element.innerText = '';
			this.element.style.maxHeight = '0px';
			this.element.style.top = `${outputOffset}px`;

			this._outputNode?.dispose();
			this._outputNode = new OutputElement(outputId, left, cellId);
			this.element.appendChild(this._outputNode.element);
			return this._outputNode;
		}

		public updateContentAndRender(content: webviewMessages.ICreationContent) {
			this._outputNode?.updateAndRerender(content);
		}
	}

	vscode.postMessage({
		__vscode_notebook_message: true,
		type: 'initialized'
	});

	for (const preload of ctx.staticPreloadsData) {
		kernelPreloads.load(preload.entrypoint);
	}

	function postNotebookMessage<T extends webviewMessages.FromWebviewMessage>(
		type: T['type'],
		properties: Omit<T, '__vscode_notebook_message' | 'type'>
	) {
		vscode.postMessage({
			__vscode_notebook_message: true,
			type,
			...properties
		});
	}

	class OutputElement {
		public readonly element: HTMLElement;
		private _content?: {
			readonly preferredRendererId: string | undefined;
			readonly preloadErrors: ReadonlyArray<Error | undefined>;
		};
		private hasResizeObserver = false;

		private renderTaskAbort?: AbortController;
		private isImageOutput = false;

		constructor(
			private readonly outputId: string,
			left: number,
			public readonly cellId: string
		) {
			this.element = document.createElement('div');
			this.element.id = outputId;
			this.element.classList.add('output');
			this.element.style.position = 'absolute';
			this.element.style.top = `0px`;
			this.element.style.left = left + 'px';
			this.element.style.padding = `${ctx.style.outputNodePadding}px ${ctx.style.outputNodePadding}px ${ctx.style.outputNodePadding}px ${ctx.style.outputNodeLeftPadding}`;

			this.element.addEventListener('mouseenter', () => {
				postNotebookMessage<webviewMessages.IMouseEnterMessage>('mouseenter', { id: outputId });
			});
			this.element.addEventListener('mouseleave', () => {
				postNotebookMessage<webviewMessages.IMouseLeaveMessage>('mouseleave', { id: outputId });
			});

			// Add drag handler
			this.element.addEventListener('dragstart', (e: DragEvent) => {
				if (!e.dataTransfer) {
					return;
				}

				const outputData: NotebookCellOutputTransferData = {
					outputId: this.outputId,
				};

				e.dataTransfer.setData('notebook-cell-output', JSON.stringify(outputData));
			});

			// Add alt key handlers
			window.addEventListener('keydown', (e) => {
				if (e.altKey) {
					this.element.draggable = true;
				}
			});

			window.addEventListener('keyup', (e) => {
				if (!e.altKey) {
					this.element.draggable = this.isImageOutput;
				}
			});

			// Handle window blur to reset draggable state
			window.addEventListener('blur', () => {
				this.element.draggable = this.isImageOutput;
			});
		}

		public dispose() {
			this.renderTaskAbort?.abort();
			this.renderTaskAbort = undefined;
		}

		public async render(content: webviewMessages.ICreationContent, preferredRendererId: string | undefined, preloadErrors: ReadonlyArray<Error | undefined>, signal?: AbortSignal) {
			this.renderTaskAbort?.abort();
			this.renderTaskAbort = undefined;

			this._content = { preferredRendererId, preloadErrors };
			if (content.type === 0 /* RenderOutputType.Html */) {
				const trustedHtml = ttPolicy?.createHTML(content.htmlContent) ?? content.htmlContent;
				this.element.innerHTML = trustedHtml as string;  // CodeQL [SM03712] The content comes from renderer extensions, not from direct user input.
			} else if (preloadErrors.some(e => e instanceof Error)) {
				const errors = preloadErrors.filter((e): e is Error => e instanceof Error);
				showRenderError(`Error loading preloads`, this.element, errors);
			} else {

				const imageMimeTypes = ['image/png', 'image/jpeg', 'image/svg'];
				this.isImageOutput = imageMimeTypes.includes(content.output.mime);
				this.element.draggable = this.isImageOutput;

				const item = createOutputItem(this.outputId, content.output.mime, content.metadata, content.output.valueBytes, content.allOutputs, content.output.appended);

				const controller = new AbortController();
				this.renderTaskAbort = controller;

				// Abort rendering if caller aborts
				signal?.addEventListener('abort', () => controller.abort());

				try {
					await renderers.render(item, preferredRendererId, this.element, controller.signal);
				} finally {
					if (this.renderTaskAbort === controller) {
						this.renderTaskAbort = undefined;
					}
				}
			}

			if (!this.hasResizeObserver) {
				this.hasResizeObserver = true;
				resizeObserver.observe(this.element, this.outputId, true, this.cellId);
			}

			const offsetHeight = this.element.offsetHeight;
			const cps = document.defaultView!.getComputedStyle(this.element);
			const verticalPadding = parseFloat(cps.paddingTop) + parseFloat(cps.paddingBottom);
			const contentHeight = offsetHeight - verticalPadding;
			if (elementHasContent(contentHeight) && cps.padding === '0px') {
				// we set padding to zero if the output has no content (then we can have a zero-height output DOM node)
				// thus we need to ensure the padding is accounted when updating the init height of the output
				dimensionUpdater.updateHeight(this.outputId, offsetHeight + ctx.style.outputNodePadding * 2, {
					isOutput: true,
					init: true
				});

				this.element.style.padding = `${ctx.style.outputNodePadding}px ${ctx.style.outputNodePadding}px ${ctx.style.outputNodePadding}px ${ctx.style.outputNodeLeftPadding}`;
			} else if (elementHasContent(contentHeight)) {
				dimensionUpdater.updateHeight(this.outputId, this.element.offsetHeight, {
					isOutput: true,
					init: true
				});
				this.element.style.padding = `0 ${ctx.style.outputNodePadding}px 0 ${ctx.style.outputNodeLeftPadding}`;
			} else {
				// we have a zero-height output DOM node
				dimensionUpdater.updateHeight(this.outputId, 0, {
					isOutput: true,
					init: true,
				});
			}

			const root = this.element.shadowRoot ?? this.element;
			const codeBlocks: Array<{ value: string; lang: string; id: string }> = MarkdownCodeBlock.requestHighlightCodeBlock(root);

			if (codeBlocks.length > 0) {
				postNotebookMessage<webviewMessages.IRenderedCellOutputMessage>('renderedCellOutput', {
					codeBlocks
				});
			}
		}

		public updateAndRerender(content: webviewMessages.ICreationContent) {
			if (this._content) {
				this.render(content, this._content.preferredRendererId, this._content.preloadErrors);
			}
		}
	}

	const markupCellDragManager = new class MarkupCellDragManager {

		private currentDrag: { cellId: string; clientY: number } | undefined;

		// Transparent overlay that prevents elements from inside the webview from eating
		// drag events.
		private dragOverlay?: HTMLElement;

		constructor() {
			window.document.addEventListener('dragover', e => {
				// Allow dropping dragged markup cells
				e.preventDefault();
			});

			window.document.addEventListener('drop', e => {
				e.preventDefault();

				const drag = this.currentDrag;
				if (!drag) {
					return;
				}

				this.currentDrag = undefined;
				postNotebookMessage<webviewMessages.ICellDropMessage>('cell-drop', {
					cellId: drag.cellId,
					ctrlKey: e.ctrlKey,
					altKey: e.altKey,
					dragOffsetY: e.clientY,
				});
			});
		}

		startDrag(e: DragEvent, cellId: string) {
			if (!e.dataTransfer) {
				return;
			}

			if (!currentOptions.dragAndDropEnabled) {
				return;
			}

			this.currentDrag = { cellId, clientY: e.clientY };

			const overlayZIndex = 9999;
			if (!this.dragOverlay) {
				this.dragOverlay = document.createElement('div');
				this.dragOverlay.style.position = 'absolute';
				this.dragOverlay.style.top = '0';
				this.dragOverlay.style.left = '0';
				this.dragOverlay.style.zIndex = `${overlayZIndex}`;
				this.dragOverlay.style.width = '100%';
				this.dragOverlay.style.height = '100%';
				this.dragOverlay.style.background = 'transparent';
				window.document.body.appendChild(this.dragOverlay);
			}
			(e.target as HTMLElement).style.zIndex = `${overlayZIndex + 1}`;
			(e.target as HTMLElement).classList.add('dragging');

			postNotebookMessage<webviewMessages.ICellDragStartMessage>('cell-drag-start', {
				cellId: cellId,
				dragOffsetY: e.clientY,
			});

			// Continuously send updates while dragging instead of relying on `updateDrag`.
			// This lets us scroll the list based on drag position.
			const trySendDragUpdate = () => {
				if (this.currentDrag?.cellId !== cellId) {
					return;
				}

				postNotebookMessage<webviewMessages.ICellDragMessage>('cell-drag', {
					cellId: cellId,
					dragOffsetY: this.currentDrag.clientY,
				});
				window.requestAnimationFrame(trySendDragUpdate);
			};
			window.requestAnimationFrame(trySendDragUpdate);
		}

		updateDrag(e: DragEvent, cellId: string) {
			if (cellId !== this.currentDrag?.cellId) {
				this.currentDrag = undefined;
			} else {
				this.currentDrag = { cellId, clientY: e.clientY };
			}
		}

		endDrag(e: DragEvent, cellId: string) {
			this.currentDrag = undefined;
			(e.target as HTMLElement).classList.remove('dragging');
			postNotebookMessage<webviewMessages.ICellDragEndMessage>('cell-drag-end', {
				cellId: cellId
			});

			if (this.dragOverlay) {
				this.dragOverlay.remove();
				this.dragOverlay = undefined;
			}

			(e.target as HTMLElement).style.zIndex = '';
		}
	}();
}

export function preloadsScriptStr(styleValues: PreloadStyles, options: PreloadOptions, renderOptions: RenderOptions, renderers: readonly webviewMessages.RendererMetadata[], preloads: readonly webviewMessages.StaticPreloadMetadata[], isWorkspaceTrusted: boolean, nonce: string) {
	const ctx: PreloadContext = {
		style: styleValues,
		options,
		renderOptions,
		rendererData: renderers,
		staticPreloadsData: preloads,
		isWorkspaceTrusted,
		nonce,
	};
	// TS will try compiling `import()` in webviewPreloads, so use a helper function instead
	// of using `import(...)` directly
	return `
		const __import = (x) => import(x);
		(${webviewPreloads})(
			JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(ctx))}"))
		)\n//# sourceURL=notebookWebviewPreloads.js\n`;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/renderers/webviewThemeMapping.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/renderers/webviewThemeMapping.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WebviewStyles } from '../../../../webview/browser/webview.js';

const mapping: ReadonlyMap<string, string> = new Map([
	['theme-font-family', 'vscode-font-family'],
	['theme-font-weight', 'vscode-font-weight'],
	['theme-font-size', 'vscode-font-size'],
	['theme-code-font-family', 'vscode-editor-font-family'],
	['theme-code-font-weight', 'vscode-editor-font-weight'],
	['theme-code-font-size', 'vscode-editor-font-size'],
	['theme-scrollbar-background', 'vscode-scrollbarSlider-background'],
	['theme-scrollbar-hover-background', 'vscode-scrollbarSlider-hoverBackground'],
	['theme-scrollbar-active-background', 'vscode-scrollbarSlider-activeBackground'],
	['theme-quote-background', 'vscode-textBlockQuote-background'],
	['theme-quote-border', 'vscode-textBlockQuote-border'],
	['theme-code-foreground', 'vscode-textPreformat-foreground'],
	['theme-code-background', 'vscode-textPreformat-background'],
	// Editor
	['theme-background', 'vscode-editor-background'],
	['theme-foreground', 'vscode-editor-foreground'],
	['theme-ui-foreground', 'vscode-foreground'],
	['theme-link', 'vscode-textLink-foreground'],
	['theme-link-active', 'vscode-textLink-activeForeground'],
	// Buttons
	['theme-button-background', 'vscode-button-background'],
	['theme-button-hover-background', 'vscode-button-hoverBackground'],
	['theme-button-foreground', 'vscode-button-foreground'],
	['theme-button-secondary-background', 'vscode-button-secondaryBackground'],
	['theme-button-secondary-hover-background', 'vscode-button-secondaryHoverBackground'],
	['theme-button-secondary-foreground', 'vscode-button-secondaryForeground'],
	['theme-button-hover-foreground', 'vscode-button-foreground'],
	['theme-button-focus-foreground', 'vscode-button-foreground'],
	['theme-button-secondary-hover-foreground', 'vscode-button-secondaryForeground'],
	['theme-button-secondary-focus-foreground', 'vscode-button-secondaryForeground'],
	// Inputs
	['theme-input-background', 'vscode-input-background'],
	['theme-input-foreground', 'vscode-input-foreground'],
	['theme-input-placeholder-foreground', 'vscode-input-placeholderForeground'],
	['theme-input-focus-border-color', 'vscode-focusBorder'],
	// Menus
	['theme-menu-background', 'vscode-menu-background'],
	['theme-menu-foreground', 'vscode-menu-foreground'],
	['theme-menu-hover-background', 'vscode-menu-selectionBackground'],
	['theme-menu-focus-background', 'vscode-menu-selectionBackground'],
	['theme-menu-hover-foreground', 'vscode-menu-selectionForeground'],
	['theme-menu-focus-foreground', 'vscode-menu-selectionForeground'],
	// Errors
	['theme-error-background', 'vscode-inputValidation-errorBackground'],
	['theme-error-foreground', 'vscode-foreground'],
	['theme-warning-background', 'vscode-inputValidation-warningBackground'],
	['theme-warning-foreground', 'vscode-foreground'],
	['theme-info-background', 'vscode-inputValidation-infoBackground'],
	['theme-info-foreground', 'vscode-foreground'],
	// Notebook:
	['theme-notebook-output-background', 'vscode-notebook-outputContainerBackgroundColor'],
	['theme-notebook-output-border', 'vscode-notebook-outputContainerBorderColor'],
	['theme-notebook-cell-selected-background', 'vscode-notebook-selectedCellBackground'],
	['theme-notebook-symbol-highlight-background', 'vscode-notebook-symbolHighlightBackground'],
	['theme-notebook-diff-removed-background', 'vscode-diffEditor-removedTextBackground'],
	['theme-notebook-diff-inserted-background', 'vscode-diffEditor-insertedTextBackground'],
]);

const constants: Readonly<WebviewStyles> = {
	'theme-input-border-width': '1px',
	'theme-button-primary-hover-shadow': 'none',
	'theme-button-secondary-hover-shadow': 'none',
	'theme-input-border-color': 'transparent',
};

/**
 * Transforms base vscode theme variables into generic variables for notebook
 * renderers.
 * @see https://github.com/microsoft/vscode/issues/107985 for context
 * @deprecated
 */
export const transformWebviewThemeVars = (s: Readonly<WebviewStyles>): WebviewStyles => {
	const result = { ...s, ...constants };
	for (const [target, src] of mapping) {
		result[target] = s[src];
	}

	return result;
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/viewModel/baseCellViewModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewModel/baseCellViewModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, IDisposable, IReference, MutableDisposable, dispose } from '../../../../../base/common/lifecycle.js';
import { Mimes } from '../../../../../base/common/mime.js';
import { ICodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { ICodeEditorService } from '../../../../../editor/browser/services/codeEditorService.js';
import { IEditorCommentsOptions } from '../../../../../editor/common/config/editorOptions.js';
import { IPosition } from '../../../../../editor/common/core/position.js';
import { IRange, Range } from '../../../../../editor/common/core/range.js';
import { Selection } from '../../../../../editor/common/core/selection.js';
import * as editorCommon from '../../../../../editor/common/editorCommon.js';
import * as model from '../../../../../editor/common/model.js';
import { SearchParams } from '../../../../../editor/common/model/textModelSearch.js';
import { IResolvedTextEditorModel, ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IUndoRedoService } from '../../../../../platform/undoRedo/common/undoRedo.js';
import { IWordWrapTransientState, readTransientState, writeTransientState } from '../../../codeEditor/browser/toggleWordWrap.js';
import { CellEditState, CellFocusMode, CellLayoutChangeEvent, CursorAtBoundary, CursorAtLineBoundary, IEditableCellViewModel, INotebookCellDecorationOptions } from '../notebookBrowser.js';
import { NotebookOptionsChangeEvent } from '../notebookOptions.js';
import { CellViewModelStateChangeEvent } from '../notebookViewEvents.js';
import { ViewContext } from './viewContext.js';
import { NotebookCellTextModel } from '../../common/model/notebookCellTextModel.js';
import { CellKind, INotebookCellStatusBarItem, INotebookFindOptions } from '../../common/notebookCommon.js';
import { IInlineChatSessionService } from '../../../inlineChat/browser/inlineChatSessionService.js';

export abstract class BaseCellViewModel extends Disposable {

	protected readonly _onDidChangeEditorAttachState = this._register(new Emitter<void>());
	// Do not merge this event with `onDidChangeState` as we are using `Event.once(onDidChangeEditorAttachState)` elsewhere.
	readonly onDidChangeEditorAttachState = this._onDidChangeEditorAttachState.event;
	protected readonly _onDidChangeState = this._register(new Emitter<CellViewModelStateChangeEvent>());
	public readonly onDidChangeState: Event<CellViewModelStateChangeEvent> = this._onDidChangeState.event;

	get handle() {
		return this.model.handle;
	}
	get uri() {
		return this.model.uri;
	}
	get lineCount() {
		return this.model.textBuffer.getLineCount();
	}
	get metadata() {
		return this.model.metadata;
	}
	get internalMetadata() {
		return this.model.internalMetadata;
	}
	get language() {
		return this.model.language;
	}

	get mime(): string {
		if (typeof this.model.mime === 'string') {
			return this.model.mime;
		}

		switch (this.language) {
			case 'markdown':
				return Mimes.markdown;

			default:
				return Mimes.text;
		}
	}

	abstract cellKind: CellKind;

	private _editState: CellEditState = CellEditState.Preview;

	private _lineNumbers: 'on' | 'off' | 'inherit' = 'inherit';
	get lineNumbers(): 'on' | 'off' | 'inherit' {
		return this._lineNumbers;
	}

	set lineNumbers(lineNumbers: 'on' | 'off' | 'inherit') {
		if (lineNumbers === this._lineNumbers) {
			return;
		}

		this._lineNumbers = lineNumbers;
		this._onDidChangeState.fire({ cellLineNumberChanged: true });
	}

	private _commentOptions: IEditorCommentsOptions;
	public get commentOptions(): IEditorCommentsOptions {
		return this._commentOptions;
	}

	public set commentOptions(newOptions: IEditorCommentsOptions) {
		this._commentOptions = newOptions;
	}

	private _focusMode: CellFocusMode = CellFocusMode.Container;
	get focusMode() {
		return this._focusMode;
	}
	set focusMode(newMode: CellFocusMode) {
		if (this._focusMode !== newMode) {
			this._focusMode = newMode;
			this._onDidChangeState.fire({ focusModeChanged: true });
		}
	}

	protected _textEditor?: ICodeEditor;
	get editorAttached(): boolean {
		return !!this._textEditor;
	}
	private _editorListeners: IDisposable[] = [];
	private _editorViewStates: editorCommon.ICodeEditorViewState | null = null;
	private _editorTransientState: IWordWrapTransientState | null = null;
	private _resolvedCellDecorations = new Map<string, INotebookCellDecorationOptions>();
	private readonly _textModelRefChangeDisposable = this._register(new MutableDisposable());

	private readonly _cellDecorationsChanged = this._register(new Emitter<{ added: INotebookCellDecorationOptions[]; removed: INotebookCellDecorationOptions[] }>());
	readonly onCellDecorationsChanged: Event<{ added: INotebookCellDecorationOptions[]; removed: INotebookCellDecorationOptions[] }> = this._cellDecorationsChanged.event;

	private _resolvedDecorations = new Map<string, {
		id?: string;
		options: model.IModelDeltaDecoration;
	}>();
	private _lastDecorationId: number = 0;

	private _cellStatusBarItems = new Map<string, INotebookCellStatusBarItem>();
	private readonly _onDidChangeCellStatusBarItems = this._register(new Emitter<void>());
	readonly onDidChangeCellStatusBarItems: Event<void> = this._onDidChangeCellStatusBarItems.event;
	private _lastStatusBarId: number = 0;

	get textModel(): model.ITextModel | undefined {
		return this.model.textModel;
	}

	hasModel(): this is IEditableCellViewModel {
		return !!this.textModel;
	}

	private _dragging: boolean = false;
	get dragging(): boolean {
		return this._dragging;
	}

	set dragging(v: boolean) {
		this._dragging = v;
		this._onDidChangeState.fire({ dragStateChanged: true });
	}

	protected _textModelRef: IReference<IResolvedTextEditorModel> | undefined;

	private _inputCollapsed: boolean = false;
	get isInputCollapsed(): boolean {
		return this._inputCollapsed;
	}
	set isInputCollapsed(v: boolean) {
		this._inputCollapsed = v;
		this._onDidChangeState.fire({ inputCollapsedChanged: true });
	}

	private _outputCollapsed: boolean = false;
	get isOutputCollapsed(): boolean {
		return this._outputCollapsed;
	}
	set isOutputCollapsed(v: boolean) {
		this._outputCollapsed = v;
		this._onDidChangeState.fire({ outputCollapsedChanged: true });
	}

	protected _commentHeight = 0;

	set commentHeight(height: number) {
		if (this._commentHeight === height) {
			return;
		}
		this._commentHeight = height;
		this.layoutChange({ commentHeight: true }, 'BaseCellViewModel#commentHeight');
	}

	private _isDisposed = false;
	private _isReadonly = false;

	constructor(
		readonly viewType: string,
		readonly model: NotebookCellTextModel,
		public id: string,
		private readonly _viewContext: ViewContext,
		private readonly _configurationService: IConfigurationService,
		private readonly _modelService: ITextModelService,
		private readonly _undoRedoService: IUndoRedoService,
		private readonly _codeEditorService: ICodeEditorService,
		private readonly _inlineChatSessionService: IInlineChatSessionService
		// private readonly _keymapService: INotebookKeymapService
	) {
		super();

		this._register(model.onDidChangeMetadata(() => {
			this._onDidChangeState.fire({ metadataChanged: true });
		}));

		this._register(model.onDidChangeInternalMetadata(e => {
			this._onDidChangeState.fire({ internalMetadataChanged: true });
			if (e.lastRunSuccessChanged) {
				// Statusbar visibility may change
				this.layoutChange({});
			}
		}));

		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('notebook.lineNumbers')) {
				this.lineNumbers = 'inherit';
			}
		}));

		if (this.model.collapseState?.inputCollapsed) {
			this._inputCollapsed = true;
		}

		if (this.model.collapseState?.outputCollapsed) {
			this._outputCollapsed = true;
		}

		this._commentOptions = this._configurationService.getValue<IEditorCommentsOptions>('editor.comments', { overrideIdentifier: this.language });
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('editor.comments')) {
				this._commentOptions = this._configurationService.getValue<IEditorCommentsOptions>('editor.comments', { overrideIdentifier: this.language });
			}
		}));
	}


	updateOptions(e: NotebookOptionsChangeEvent): void {
		if (this._textEditor && typeof e.readonly === 'boolean') {
			this._textEditor.updateOptions({ readOnly: e.readonly });
		}
		if (typeof e.readonly === 'boolean') {
			this._isReadonly = e.readonly;
		}
	}
	abstract getHeight(lineHeight: number): number;
	abstract onDeselect(): void;
	abstract layoutChange(change: CellLayoutChangeEvent, source?: string): void;

	assertTextModelAttached(): boolean {
		if (this.textModel && this._textEditor && this._textEditor.getModel() === this.textModel) {
			return true;
		}

		return false;
	}

	// private handleKeyDown(e: IKeyboardEvent) {
	// 	if (this.viewType === IPYNB_VIEW_TYPE && isWindows && e.ctrlKey && e.keyCode === KeyCode.Enter) {
	// 		this._keymapService.promptKeymapRecommendation();
	// 	}
	// }

	attachTextEditor(editor: ICodeEditor, estimatedHasHorizontalScrolling?: boolean) {
		if (!editor.hasModel()) {
			throw new Error('Invalid editor: model is missing');
		}

		if (this._textEditor === editor) {
			if (this._editorListeners.length === 0) {
				this._editorListeners.push(this._textEditor.onDidChangeCursorSelection(() => { this._onDidChangeState.fire({ selectionChanged: true }); }));
				// this._editorListeners.push(this._textEditor.onKeyDown(e => this.handleKeyDown(e)));
				this._onDidChangeState.fire({ selectionChanged: true });
			}
			return;
		}

		this._textEditor = editor;
		if (this._isReadonly) {
			editor.updateOptions({ readOnly: this._isReadonly });
		}
		if (this._editorViewStates) {
			this._restoreViewState(this._editorViewStates);
		} else {
			// If no real editor view state was persisted, restore a default state.
			// This forces the editor to measure its content width immediately.
			if (estimatedHasHorizontalScrolling) {
				this._restoreViewState({
					contributionsState: {},
					cursorState: [],
					viewState: {
						scrollLeft: 0,
						firstPosition: { lineNumber: 1, column: 1 },
						firstPositionDeltaTop: this._viewContext.notebookOptions.getLayoutConfiguration().editorTopPadding
					}
				});
			}
		}

		if (this._editorTransientState) {
			writeTransientState(editor.getModel(), this._editorTransientState, this._codeEditorService);
		}

		if (this._isDisposed) {
			// Restore View State could adjust the editor layout and trigger a list view update. The list view update might then dispose this view model.
			return;
		}

		editor.changeDecorations((accessor) => {
			this._resolvedDecorations.forEach((value, key) => {
				if (key.startsWith('_lazy_')) {
					// lazy ones
					const ret = accessor.addDecoration(value.options.range, value.options.options);
					this._resolvedDecorations.get(key)!.id = ret;
				}
				else {
					const ret = accessor.addDecoration(value.options.range, value.options.options);
					this._resolvedDecorations.get(key)!.id = ret;
				}
			});
		});

		this._editorListeners.push(editor.onDidChangeCursorSelection(() => { this._onDidChangeState.fire({ selectionChanged: true }); }));
		this._editorListeners.push(this._inlineChatSessionService.onWillStartSession((e) => {
			if (e === this._textEditor && this.textBuffer.getLength() === 0) {
				this.enableAutoLanguageDetection();
			}
		}));

		this._onDidChangeState.fire({ selectionChanged: true });
		this._onDidChangeEditorAttachState.fire();
	}

	detachTextEditor() {
		this.saveViewState();
		this.saveTransientState();
		// decorations need to be cleared first as editors can be resued.
		this._textEditor?.changeDecorations((accessor) => {
			this._resolvedDecorations.forEach(value => {
				const resolvedid = value.id;

				if (resolvedid) {
					accessor.removeDecoration(resolvedid);
				}
			});
		});

		this._textEditor = undefined;
		dispose(this._editorListeners);
		this._editorListeners = [];
		this._onDidChangeEditorAttachState.fire();

		if (this._textModelRef) {
			this._textModelRef.dispose();
			this._textModelRef = undefined;
		}
		this._textModelRefChangeDisposable.clear();
	}

	getText(): string {
		return this.model.getValue();
	}

	getAlternativeId(): number {
		return this.model.alternativeId;
	}

	getTextLength(): number {
		return this.model.getTextLength();
	}

	enableAutoLanguageDetection() {
		this.model.enableAutoLanguageDetection();
	}

	private saveViewState(): void {
		if (!this._textEditor) {
			return;
		}

		this._editorViewStates = this._textEditor.saveViewState();
	}

	private saveTransientState() {
		if (!this._textEditor || !this._textEditor.hasModel()) {
			return;
		}

		this._editorTransientState = readTransientState(this._textEditor.getModel(), this._codeEditorService);
	}

	saveEditorViewState() {
		if (this._textEditor) {
			this._editorViewStates = this._textEditor.saveViewState();
		}

		return this._editorViewStates;
	}

	restoreEditorViewState(editorViewStates: editorCommon.ICodeEditorViewState | null, totalHeight?: number) {
		this._editorViewStates = editorViewStates;
	}

	private _restoreViewState(state: editorCommon.ICodeEditorViewState | null): void {
		if (state) {
			this._textEditor?.restoreViewState(state);
		}
	}

	addModelDecoration(decoration: model.IModelDeltaDecoration): string {
		if (!this._textEditor) {
			const id = ++this._lastDecorationId;
			const decorationId = `_lazy_${this.id};${id}`;
			this._resolvedDecorations.set(decorationId, { options: decoration });
			return decorationId;
		}

		let id: string;
		this._textEditor.changeDecorations((accessor) => {
			id = accessor.addDecoration(decoration.range, decoration.options);
			this._resolvedDecorations.set(id, { id, options: decoration });
		});
		return id!;
	}

	removeModelDecoration(decorationId: string) {
		const realDecorationId = this._resolvedDecorations.get(decorationId);

		if (this._textEditor && realDecorationId && realDecorationId.id !== undefined) {
			this._textEditor.changeDecorations((accessor) => {
				accessor.removeDecoration(realDecorationId.id!);
			});
		}

		// lastly, remove all the cache
		this._resolvedDecorations.delete(decorationId);
	}

	deltaModelDecorations(oldDecorations: readonly string[], newDecorations: readonly model.IModelDeltaDecoration[]): string[] {
		oldDecorations.forEach(id => {
			this.removeModelDecoration(id);
		});

		const ret = newDecorations.map(option => {
			return this.addModelDecoration(option);
		});

		return ret;
	}

	private _removeCellDecoration(decorationId: string) {
		const options = this._resolvedCellDecorations.get(decorationId);
		this._resolvedCellDecorations.delete(decorationId);

		if (options) {
			for (const existingOptions of this._resolvedCellDecorations.values()) {
				// don't remove decorations that are applied from other entries
				if (options.className === existingOptions.className) {
					options.className = undefined;
				}
				if (options.outputClassName === existingOptions.outputClassName) {
					options.outputClassName = undefined;
				}
				if (options.gutterClassName === existingOptions.gutterClassName) {
					options.gutterClassName = undefined;
				}
				if (options.topClassName === existingOptions.topClassName) {
					options.topClassName = undefined;
				}
			}

			this._cellDecorationsChanged.fire({ added: [], removed: [options] });
		}
	}

	private _addCellDecoration(options: INotebookCellDecorationOptions): string {
		const id = ++this._lastDecorationId;
		const decorationId = `_cell_${this.id};${id}`;
		this._resolvedCellDecorations.set(decorationId, options);
		this._cellDecorationsChanged.fire({ added: [options], removed: [] });
		return decorationId;
	}

	getCellDecorations() {
		return [...this._resolvedCellDecorations.values()];
	}

	getCellDecorationRange(decorationId: string): Range | null {
		if (this._textEditor) {
			// (this._textEditor as CodeEditorWidget).decora
			return this._textEditor.getModel()?.getDecorationRange(decorationId) ?? null;
		}

		return null;
	}

	deltaCellDecorations(oldDecorations: string[], newDecorations: INotebookCellDecorationOptions[]): string[] {
		oldDecorations.forEach(id => {
			this._removeCellDecoration(id);
		});

		const ret = newDecorations.map(option => {
			return this._addCellDecoration(option);
		});

		return ret;
	}

	deltaCellStatusBarItems(oldItems: readonly string[], newItems: readonly INotebookCellStatusBarItem[]): string[] {
		oldItems.forEach(id => {
			const item = this._cellStatusBarItems.get(id);
			if (item) {
				this._cellStatusBarItems.delete(id);
			}
		});

		const newIds = newItems.map(item => {
			const id = ++this._lastStatusBarId;
			const itemId = `_cell_${this.id};${id}`;
			this._cellStatusBarItems.set(itemId, item);
			return itemId;
		});

		this._onDidChangeCellStatusBarItems.fire();

		return newIds;
	}

	getCellStatusBarItems(): INotebookCellStatusBarItem[] {
		return Array.from(this._cellStatusBarItems.values());
	}

	revealRangeInCenter(range: Range) {
		this._textEditor?.revealRangeInCenter(range, editorCommon.ScrollType.Immediate);
	}

	setSelection(range: Range) {
		this._textEditor?.setSelection(range);
	}

	setSelections(selections: Selection[]) {
		if (selections.length) {
			if (this._textEditor) {
				this._textEditor?.setSelections(selections);
			} else if (this._editorViewStates) {
				this._editorViewStates.cursorState = selections.map(selection => {
					return {
						inSelectionMode: !selection.isEmpty(),
						selectionStart: selection.getStartPosition(),
						position: selection.getEndPosition(),
					};
				});
			}
		}
	}

	getSelections() {
		return this._textEditor?.getSelections()
			?? this._editorViewStates?.cursorState.map(state => new Selection(state.selectionStart.lineNumber, state.selectionStart.column, state.position.lineNumber, state.position.column))
			?? [];
	}

	getSelectionsStartPosition(): IPosition[] | undefined {
		if (this._textEditor) {
			const selections = this._textEditor.getSelections();
			return selections?.map(s => s.getStartPosition());
		} else {
			const selections = this._editorViewStates?.cursorState;
			return selections?.map(s => s.selectionStart);
		}
	}

	getLineScrollTopOffset(line: number): number {
		if (!this._textEditor) {
			return 0;
		}

		const editorPadding = this._viewContext.notebookOptions.computeEditorPadding(this.internalMetadata, this.uri);
		return this._textEditor.getTopForLineNumber(line) + editorPadding.top;
	}

	getPositionScrollTopOffset(range: Selection | Range): number {
		if (!this._textEditor) {
			return 0;
		}


		const position = range instanceof Selection ? range.getPosition() : range.getStartPosition();

		const editorPadding = this._viewContext.notebookOptions.computeEditorPadding(this.internalMetadata, this.uri);
		return this._textEditor.getTopForPosition(position.lineNumber, position.column) + editorPadding.top;
	}

	cursorAtLineBoundary(): CursorAtLineBoundary {
		if (!this._textEditor || !this.textModel || !this._textEditor.hasTextFocus()) {
			return CursorAtLineBoundary.None;
		}

		const selection = this._textEditor.getSelection();

		if (!selection || !selection.isEmpty()) {
			return CursorAtLineBoundary.None;
		}

		const currentLineLength = this.textModel.getLineLength(selection.startLineNumber);

		if (currentLineLength === 0) {
			return CursorAtLineBoundary.Both;
		}

		switch (selection.startColumn) {
			case 1:
				return CursorAtLineBoundary.Start;
			case currentLineLength + 1:
				return CursorAtLineBoundary.End;
			default:
				return CursorAtLineBoundary.None;
		}
	}

	cursorAtBoundary(): CursorAtBoundary {
		if (!this._textEditor) {
			return CursorAtBoundary.None;
		}

		if (!this.textModel) {
			return CursorAtBoundary.None;
		}

		// only validate primary cursor
		const selection = this._textEditor.getSelection();

		// only validate empty cursor
		if (!selection || !selection.isEmpty()) {
			return CursorAtBoundary.None;
		}

		const firstViewLineTop = this._textEditor.getTopForPosition(1, 1);
		const lastViewLineTop = this._textEditor.getTopForPosition(this.textModel.getLineCount(), this.textModel.getLineLength(this.textModel.getLineCount()));
		const selectionTop = this._textEditor.getTopForPosition(selection.startLineNumber, selection.startColumn);

		if (selectionTop === lastViewLineTop) {
			if (selectionTop === firstViewLineTop) {
				return CursorAtBoundary.Both;
			} else {
				return CursorAtBoundary.Bottom;
			}
		} else {
			if (selectionTop === firstViewLineTop) {
				return CursorAtBoundary.Top;
			} else {
				return CursorAtBoundary.None;
			}
		}
	}

	private _editStateSource: string = '';

	get editStateSource(): string {
		return this._editStateSource;
	}

	updateEditState(newState: CellEditState, source: string) {
		if (newState === this._editState) {
			return;
		}

		this._editStateSource = source;
		this._editState = newState;
		this._onDidChangeState.fire({ editStateChanged: true });
		if (this._editState === CellEditState.Preview) {
			this.focusMode = CellFocusMode.Container;
		}
	}

	getEditState() {
		return this._editState;
	}

	get textBuffer() {
		return this.model.textBuffer;
	}

	/**
	 * Text model is used for editing.
	 */
	async resolveTextModel(): Promise<model.ITextModel> {
		if (!this._textModelRef || !this.textModel) {
			this._textModelRef = await this._modelService.createModelReference(this.uri);
			if (this._isDisposed) {
				return this.textModel!;
			}

			if (!this._textModelRef) {
				throw new Error(`Cannot resolve text model for ${this.uri}`);
			}
			this._textModelRefChangeDisposable.value = this.textModel!.onDidChangeContent(() => this.onDidChangeTextModelContent());
		}

		return this.textModel!;
	}

	protected abstract onDidChangeTextModelContent(): void;

	protected cellStartFind(value: string, options: INotebookFindOptions): model.FindMatch[] | null {
		let cellMatches: model.FindMatch[] = [];

		const lineCount = this.textBuffer.getLineCount();
		const findRange: IRange[] = options.findScope?.selectedTextRanges ?? [new Range(1, 1, lineCount, this.textBuffer.getLineLength(lineCount) + 1)];

		if (this.assertTextModelAttached()) {
			cellMatches = this.textModel!.findMatches(
				value,
				findRange,
				options.regex || false,
				options.caseSensitive || false,
				options.wholeWord ? options.wordSeparators || null : null,
				options.regex || false);
		} else {
			const searchParams = new SearchParams(value, options.regex || false, options.caseSensitive || false, options.wholeWord ? options.wordSeparators || null : null,);
			const searchData = searchParams.parseSearchRequest();

			if (!searchData) {
				return null;
			}

			findRange.forEach(range => {
				cellMatches.push(...this.textBuffer.findMatchesLineByLine(new Range(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn), searchData, options.regex || false, 1000));
			});
		}

		return cellMatches;
	}

	override dispose() {
		this._isDisposed = true;
		super.dispose();

		dispose(this._editorListeners);

		// Only remove the undo redo stack if we map this cell uri to itself
		// If we are not in perCell mode, it will map to the full NotebookDocument and
		// we don't want to remove that entire document undo / redo stack when a cell is deleted
		if (this._undoRedoService.getUriComparisonKey(this.uri) === this.uri.toString()) {
			this._undoRedoService.removeElements(this.uri);
		}

		this._textModelRef?.dispose();
	}

	toJSON(): object {
		return {
			handle: this.handle
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/viewModel/cellEdit.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewModel/cellEdit.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Range } from '../../../../../editor/common/core/range.js';
import { Selection } from '../../../../../editor/common/core/selection.js';
import { CellKind, IOutputDto, NotebookCellMetadata, SelectionStateType } from '../../common/notebookCommon.js';
import { IResourceUndoRedoElement, UndoRedoElementType } from '../../../../../platform/undoRedo/common/undoRedo.js';
import { URI } from '../../../../../base/common/uri.js';
import { BaseCellViewModel } from './baseCellViewModel.js';
import { CellFocusMode } from '../notebookBrowser.js';
import { NotebookCellTextModel } from '../../common/model/notebookCellTextModel.js';
import { ITextCellEditingDelegate } from '../../common/model/cellEdit.js';


export interface IViewCellEditingDelegate extends ITextCellEditingDelegate {
	createCellViewModel?(cell: NotebookCellTextModel): BaseCellViewModel;
	createCell?(index: number, source: string, language: string, type: CellKind, metadata: NotebookCellMetadata | undefined, outputs: IOutputDto[]): BaseCellViewModel;
}

export class JoinCellEdit implements IResourceUndoRedoElement {
	type: UndoRedoElementType.Resource = UndoRedoElementType.Resource;
	label: string = 'Join Cell';
	code: string = 'undoredo.textBufferEdit';
	private _deletedRawCell: NotebookCellTextModel;
	constructor(
		public resource: URI,
		private index: number,
		private direction: 'above' | 'below',
		private cell: BaseCellViewModel,
		private selections: Selection[],
		private inverseRange: Range,
		private insertContent: string,
		private removedCell: BaseCellViewModel,
		private editingDelegate: IViewCellEditingDelegate,
	) {
		this._deletedRawCell = this.removedCell.model;
	}

	async undo(): Promise<void> {
		if (!this.editingDelegate.insertCell || !this.editingDelegate.createCellViewModel) {
			throw new Error('Notebook Insert Cell not implemented for Undo/Redo');
		}

		await this.cell.resolveTextModel();

		this.cell.textModel?.applyEdits([
			{ range: this.inverseRange, text: '' }
		]);

		this.cell.setSelections(this.selections);

		const cell = this.editingDelegate.createCellViewModel(this._deletedRawCell);
		if (this.direction === 'above') {
			this.editingDelegate.insertCell(this.index, this._deletedRawCell, { kind: SelectionStateType.Handle, primary: cell.handle, selections: [cell.handle] });
			cell.focusMode = CellFocusMode.Editor;
		} else {
			this.editingDelegate.insertCell(this.index, cell.model, { kind: SelectionStateType.Handle, primary: this.cell.handle, selections: [this.cell.handle] });
			this.cell.focusMode = CellFocusMode.Editor;
		}
	}

	async redo(): Promise<void> {
		if (!this.editingDelegate.deleteCell) {
			throw new Error('Notebook Delete Cell not implemented for Undo/Redo');
		}

		await this.cell.resolveTextModel();
		this.cell.textModel?.applyEdits([
			{ range: this.inverseRange, text: this.insertContent }
		]);

		this.editingDelegate.deleteCell(this.index, { kind: SelectionStateType.Handle, primary: this.cell.handle, selections: [this.cell.handle] });
		this.cell.focusMode = CellFocusMode.Editor;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/viewModel/cellEditorOptions.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewModel/cellEditorOptions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { deepClone } from '../../../../../base/common/objects.js';
import { IEditorOptions } from '../../../../../editor/common/config/editorOptions.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IBaseCellEditorOptions, INotebookEditorDelegate } from '../notebookBrowser.js';
import { NotebookOptions } from '../notebookOptions.js';

export class BaseCellEditorOptions extends Disposable implements IBaseCellEditorOptions {
	private static fixedEditorOptions: IEditorOptions = {
		scrollBeyondLastLine: false,
		scrollbar: {
			verticalScrollbarSize: 14,
			horizontal: 'auto',
			useShadows: true,
			verticalHasArrows: false,
			horizontalHasArrows: false,
			alwaysConsumeMouseWheel: false
		},
		renderLineHighlightOnlyWhenFocus: true,
		overviewRulerLanes: 0,
		lineDecorationsWidth: 0,
		folding: true,
		fixedOverflowWidgets: true,
		minimap: { enabled: false },
		renderValidationDecorations: 'on',
		lineNumbersMinChars: 3
	};

	private readonly _localDisposableStore = this._register(new DisposableStore());
	private readonly _onDidChange = this._register(new Emitter<void>());
	readonly onDidChange: Event<void> = this._onDidChange.event;
	private _value: IEditorOptions;

	get value(): Readonly<IEditorOptions> {
		return this._value;
	}

	constructor(readonly notebookEditor: INotebookEditorDelegate, readonly notebookOptions: NotebookOptions, readonly configurationService: IConfigurationService, readonly language: string) {
		super();
		this._register(configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('editor') || e.affectsConfiguration('notebook')) {
				this._recomputeOptions();
			}
		}));

		this._register(notebookOptions.onDidChangeOptions(e => {
			if (e.cellStatusBarVisibility || e.editorTopPadding || e.editorOptionsCustomizations) {
				this._recomputeOptions();
			}
		}));

		this._register(this.notebookEditor.onDidChangeModel(() => {
			this._localDisposableStore.clear();

			if (this.notebookEditor.hasModel()) {
				this._localDisposableStore.add(this.notebookEditor.onDidChangeOptions(() => {
					this._recomputeOptions();
				}));

				this._recomputeOptions();
			}
		}));

		if (this.notebookEditor.hasModel()) {
			this._localDisposableStore.add(this.notebookEditor.onDidChangeOptions(() => {
				this._recomputeOptions();
			}));
		}

		this._value = this._computeEditorOptions();
	}

	private _recomputeOptions(): void {
		this._value = this._computeEditorOptions();
		this._onDidChange.fire();
	}

	private _computeEditorOptions() {
		const editorOptions = deepClone(this.configurationService.getValue<IEditorOptions>('editor', { overrideIdentifier: this.language }));
		const editorOptionsOverrideRaw = this.notebookOptions.getDisplayOptions().editorOptionsCustomizations;
		const editorOptionsOverride: Record<string, unknown> = {};
		if (editorOptionsOverrideRaw) {
			for (const key in editorOptionsOverrideRaw) {
				if (key.indexOf('editor.') === 0) {
					editorOptionsOverride[key.substring(7)] = editorOptionsOverrideRaw[key as keyof typeof editorOptionsOverrideRaw];
				}
			}
		}
		const computed = Object.freeze({
			...editorOptions,
			...BaseCellEditorOptions.fixedEditorOptions,
			...editorOptionsOverride,
			...{ padding: { top: 12, bottom: 12 } },
			readOnly: this.notebookEditor.isReadOnly
		});

		return computed;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/viewModel/cellOutputTextHelper.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewModel/cellOutputTextHelper.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IClipboardService } from '../../../../../platform/clipboard/common/clipboardService.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { NotebookTextModel } from '../../common/model/notebookTextModel.js';
import { IOutputItemDto } from '../../common/notebookCommon.js';
import { isTextStreamMime } from '../../../../../base/common/mime.js';
import { ICellOutputViewModel, ICellViewModel } from '../notebookBrowser.js';

interface Error {
	name: string;
	message: string;
	stack?: string;
}

export function getAllOutputsText(notebook: NotebookTextModel, viewCell: ICellViewModel, shortErrors: boolean = false): string {
	const outputText: string[] = [];
	for (let i = 0; i < viewCell.outputsViewModels.length; i++) {
		const outputViewModel = viewCell.outputsViewModels[i];
		const outputTextModel = viewCell.model.outputs[i];
		const [mimeTypes, pick] = outputViewModel.resolveMimeTypes(notebook, undefined);
		const mimeType = mimeTypes[pick].mimeType;
		let buffer = outputTextModel.outputs.find(output => output.mime === mimeType);

		if (!buffer || mimeType.startsWith('image')) {
			buffer = outputTextModel.outputs.find(output => !output.mime.startsWith('image'));
		}

		if (!buffer) {
			continue;
		}

		let text = '';
		if (isTextStreamMime(mimeType)) {
			const { text: stream, count } = getOutputStreamText(outputViewModel);
			text = stream;
			if (count > 1) {
				i += count - 1;
			}
		} else {
			text = getOutputText(mimeType, buffer, shortErrors);
		}

		outputText.push(text);
	}

	let outputContent: string;
	if (outputText.length > 1) {
		outputContent = outputText.map((output, i) => {
			return `Cell output ${i + 1} of ${outputText.length}\n${output}`;
		}).join('\n');
	} else {
		outputContent = outputText[0] ?? '';
	}

	return outputContent;
}

export function getOutputStreamText(output: ICellOutputViewModel): { text: string; count: number } {
	let text = '';
	const cellViewModel = output.cellViewModel as ICellViewModel;
	let index = cellViewModel.outputsViewModels.indexOf(output);
	let count = 0;
	while (index < cellViewModel.model.outputs.length) {
		const nextCellOutput = cellViewModel.model.outputs[index];
		const nextOutput = nextCellOutput.outputs.find(output => isTextStreamMime(output.mime));
		if (!nextOutput) {
			break;
		}

		text = text + decoder.decode(nextOutput.data.buffer);
		index = index + 1;
		count++;
	}

	return { text: text.trim(), count };
}

const decoder = new TextDecoder();

export function getOutputText(mimeType: string, buffer: IOutputItemDto, shortError: boolean = false): string {
	let text = `${mimeType}`; // default in case we can't get the text value for some reason.

	const charLimit = 100000;
	text = decoder.decode(buffer.data.slice(0, charLimit).buffer);

	if (buffer.data.byteLength > charLimit) {
		text = text + '...(truncated)';
	} else if (mimeType === 'application/vnd.code.notebook.error') {
		text = text.replace(/\\u001b\[[0-9;]*m/gi, '');
		try {
			const error = JSON.parse(text) as Error;
			if (!error.stack || shortError) {
				text = `${error.name}: ${error.message}`;
			} else {
				text = error.stack;
			}
		} catch {
			// just use raw text
		}
	}

	return text.trim();
}

export async function copyCellOutput(mimeType: string | undefined, outputViewModel: ICellOutputViewModel, clipboardService: IClipboardService, logService: ILogService) {
	const cellOutput = outputViewModel.model;
	const output = mimeType && TEXT_BASED_MIMETYPES.includes(mimeType) ?
		cellOutput.outputs.find(output => output.mime === mimeType) :
		cellOutput.outputs.find(output => TEXT_BASED_MIMETYPES.includes(output.mime));

	mimeType = output?.mime;

	if (!mimeType || !output) {
		return;
	}

	const text = isTextStreamMime(mimeType) ? getOutputStreamText(outputViewModel).text : getOutputText(mimeType, output);

	try {
		await clipboardService.writeText(text);

	} catch (e) {
		logService.error(`Failed to copy content: ${e}`);
	}
}

export const TEXT_BASED_MIMETYPES = [
	'text/latex',
	'text/html',
	'application/vnd.code.notebook.error',
	'application/vnd.code.notebook.stdout',
	'application/x.notebook.stdout',
	'application/x.notebook.stream',
	'application/vnd.code.notebook.stderr',
	'application/x.notebook.stderr',
	'text/plain',
	'text/markdown',
	'application/json'
];
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/viewModel/cellOutputViewModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewModel/cellOutputViewModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { observableValue } from '../../../../../base/common/observable.js';
import { ICellOutputViewModel, IGenericCellViewModel } from '../notebookBrowser.js';
import { NotebookTextModel } from '../../common/model/notebookTextModel.js';
import { ICellOutput, IOrderedMimeType, RENDERER_NOT_AVAILABLE } from '../../common/notebookCommon.js';
import { INotebookService } from '../../common/notebookService.js';

let handle = 0;
export class CellOutputViewModel extends Disposable implements ICellOutputViewModel {
	private _onDidResetRendererEmitter = this._register(new Emitter<void>());
	readonly onDidResetRenderer = this._onDidResetRendererEmitter.event;

	private alwaysShow = false;
	visible = observableValue<boolean>('outputVisible', false);
	setVisible(visible = true, force: boolean = false) {
		if (!visible && this.alwaysShow) {
			// we are forced to show, so no-op
			return;
		}

		if (force && visible) {
			this.alwaysShow = true;
		}

		this.visible.set(visible, undefined);
	}

	outputHandle = handle++;
	get model(): ICellOutput {
		return this._outputRawData;
	}

	private _pickedMimeType: IOrderedMimeType | undefined;
	get pickedMimeType() {
		return this._pickedMimeType;
	}

	set pickedMimeType(value: IOrderedMimeType | undefined) {
		this._pickedMimeType = value;
	}

	constructor(
		readonly cellViewModel: IGenericCellViewModel,
		private readonly _outputRawData: ICellOutput,
		private readonly _notebookService: INotebookService
	) {
		super();
	}

	hasMultiMimeType() {
		if (this._outputRawData.outputs.length < 2) {
			return false;
		}

		const firstMimeType = this._outputRawData.outputs[0].mime;
		return this._outputRawData.outputs.some(output => output.mime !== firstMimeType);
	}

	resolveMimeTypes(textModel: NotebookTextModel, kernelProvides: readonly string[] | undefined): [readonly IOrderedMimeType[], number] {
		const mimeTypes = this._notebookService.getOutputMimeTypeInfo(textModel, kernelProvides, this.model);
		const index = mimeTypes.findIndex(mimeType => mimeType.rendererId !== RENDERER_NOT_AVAILABLE && mimeType.isTrusted);

		return [mimeTypes, Math.max(index, 0)];
	}

	resetRenderer() {
		// reset the output renderer
		this._pickedMimeType = undefined;
		this.model.bumpVersion();
		this._onDidResetRendererEmitter.fire();
	}

	toRawJSON() {
		return {
			outputs: this._outputRawData.outputs,
			// TODO@rebronix, no id, right?
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/viewModel/cellSelectionCollection.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewModel/cellSelectionCollection.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { cellRangesEqual, ICellRange } from '../../common/notebookRange.js';

// Challenge is List View talks about `element`, which needs extra work to convert to ICellRange as we support Folding and Cell Move
export class NotebookCellSelectionCollection extends Disposable {

	private readonly _onDidChangeSelection = this._register(new Emitter<string>());
	get onDidChangeSelection(): Event<string> { return this._onDidChangeSelection.event; }

	private _primary: ICellRange = { start: 0, end: 0 };

	private _selections: ICellRange[] = [{ start: 0, end: 0 }];

	get selections(): ICellRange[] {
		return this._selections;
	}

	get focus(): ICellRange {
		return this._primary;
	}

	setState(primary: ICellRange | null, selections: ICellRange[], forceEventEmit: boolean, source: 'view' | 'model') {
		const validPrimary = primary ?? { start: 0, end: 0 };
		const validSelections = selections.length > 0 ? selections : [{ start: 0, end: 0 }];

		const changed = !cellRangesEqual([validPrimary], [this._primary]) || !cellRangesEqual(this._selections, validSelections);

		this._primary = validPrimary;
		this._selections = validSelections;
		if (changed || forceEventEmit) {
			this._onDidChangeSelection.fire(source);
		}
	}

	setSelections(selections: ICellRange[], forceEventEmit: boolean, source: 'view' | 'model') {
		this.setState(this._primary, selections, forceEventEmit, source);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/viewModel/codeCellViewModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewModel/codeCellViewModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event, PauseableEmitter } from '../../../../../base/common/event.js';
import { dispose } from '../../../../../base/common/lifecycle.js';
import { observableValue } from '../../../../../base/common/observable.js';
import * as UUID from '../../../../../base/common/uuid.js';
import { ICodeEditorService } from '../../../../../editor/browser/services/codeEditorService.js';
import * as editorCommon from '../../../../../editor/common/editorCommon.js';
import { PrefixSumComputer } from '../../../../../editor/common/model/prefixSumComputer.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IUndoRedoService } from '../../../../../platform/undoRedo/common/undoRedo.js';
import { CellEditState, CellFindMatch, CellLayoutState, CodeCellLayoutChangeEvent, CodeCellLayoutInfo, ICellOutputViewModel, ICellViewModel } from '../notebookBrowser.js';
import { NotebookOptionsChangeEvent } from '../notebookOptions.js';
import { NotebookLayoutInfo } from '../notebookViewEvents.js';
import { CellOutputViewModel } from './cellOutputViewModel.js';
import { ViewContext } from './viewContext.js';
import { NotebookCellTextModel } from '../../common/model/notebookCellTextModel.js';
import { CellKind, INotebookFindOptions, NotebookCellOutputsSplice } from '../../common/notebookCommon.js';
import { ICellExecutionError, ICellExecutionStateChangedEvent } from '../../common/notebookExecutionStateService.js';
import { INotebookService } from '../../common/notebookService.js';
import { BaseCellViewModel } from './baseCellViewModel.js';
import { IInlineChatSessionService } from '../../../inlineChat/browser/inlineChatSessionService.js';

export const outputDisplayLimit = 500;

export class CodeCellViewModel extends BaseCellViewModel implements ICellViewModel {
	readonly cellKind = CellKind.Code;

	protected readonly _onLayoutInfoRead = this._register(new Emitter<void>());
	readonly onLayoutInfoRead = this._onLayoutInfoRead.event;

	protected readonly _onDidStartExecution = this._register(new Emitter<ICellExecutionStateChangedEvent>());
	readonly onDidStartExecution = this._onDidStartExecution.event;
	protected readonly _onDidStopExecution = this._register(new Emitter<ICellExecutionStateChangedEvent>());
	readonly onDidStopExecution = this._onDidStopExecution.event;

	protected readonly _onDidChangeOutputs = this._register(new Emitter<NotebookCellOutputsSplice>());
	readonly onDidChangeOutputs = this._onDidChangeOutputs.event;

	private readonly _onDidRemoveOutputs = this._register(new Emitter<readonly ICellOutputViewModel[]>());
	readonly onDidRemoveOutputs = this._onDidRemoveOutputs.event;

	private _outputCollection: number[] = [];

	private _outputsTop: PrefixSumComputer | null = null;

	protected _pauseableEmitter = this._register(new PauseableEmitter<CodeCellLayoutChangeEvent>());

	readonly onDidChangeLayout = this._pauseableEmitter.event;

	private _editorHeight = 0;
	set editorHeight(height: number) {
		if (this._editorHeight === height) {
			return;
		}

		this._editorHeight = height;
		this.layoutChange({ editorHeight: true }, 'CodeCellViewModel#editorHeight');
	}

	get editorHeight() {
		throw new Error('editorHeight is write-only');
	}

	private _chatHeight = 0;
	set chatHeight(height: number) {
		if (this._chatHeight === height) {
			return;
		}

		this._chatHeight = height;
		this.layoutChange({ chatHeight: true }, 'CodeCellViewModel#chatHeight');
	}

	get chatHeight() {
		return this._chatHeight;
	}

	private _hoveringOutput: boolean = false;
	public get outputIsHovered(): boolean {
		return this._hoveringOutput;
	}

	public set outputIsHovered(v: boolean) {
		this._hoveringOutput = v;
		this._onDidChangeState.fire({ outputIsHoveredChanged: true });
	}

	private _focusOnOutput: boolean = false;
	public get outputIsFocused(): boolean {
		return this._focusOnOutput;
	}

	public set outputIsFocused(v: boolean) {
		this._focusOnOutput = v;
		this._onDidChangeState.fire({ outputIsFocusedChanged: true });
	}

	private _focusInputInOutput: boolean = false;
	public get inputInOutputIsFocused(): boolean {
		return this._focusInputInOutput;
	}

	public set inputInOutputIsFocused(v: boolean) {
		this._focusInputInOutput = v;
	}

	private _outputMinHeight: number = 0;

	private get outputMinHeight() {
		return this._outputMinHeight;
	}

	/**
	 * The minimum height of the output region. It's only set to non-zero temporarily when replacing an output with a new one.
	 * It's reset to 0 when the new output is rendered, or in one second.
	 */
	private set outputMinHeight(newMin: number) {
		this._outputMinHeight = newMin;
	}

	private _layoutInfo: CodeCellLayoutInfo;

	get layoutInfo() {
		return this._layoutInfo;
	}

	private _outputViewModels: ICellOutputViewModel[];

	get outputsViewModels() {
		return this._outputViewModels;
	}

	readonly executionErrorDiagnostic = observableValue<ICellExecutionError | undefined>('excecutionError', undefined);

	constructor(
		viewType: string,
		model: NotebookCellTextModel,
		initialNotebookLayoutInfo: NotebookLayoutInfo | null,
		readonly viewContext: ViewContext,
		@IConfigurationService configurationService: IConfigurationService,
		@INotebookService private readonly _notebookService: INotebookService,
		@ITextModelService modelService: ITextModelService,
		@IUndoRedoService undoRedoService: IUndoRedoService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@IInlineChatSessionService inlineChatSessionService: IInlineChatSessionService
	) {
		super(viewType, model, UUID.generateUuid(), viewContext, configurationService, modelService, undoRedoService, codeEditorService, inlineChatSessionService);
		this._outputViewModels = this.model.outputs.map(output => new CellOutputViewModel(this, output, this._notebookService));

		this._register(this.model.onDidChangeOutputs((splice) => {
			const removedOutputs: ICellOutputViewModel[] = [];
			let outputLayoutChange = false;
			for (let i = splice.start; i < splice.start + splice.deleteCount; i++) {
				if (this._outputCollection[i] !== undefined && this._outputCollection[i] !== 0) {
					outputLayoutChange = true;
				}
			}

			this._outputCollection.splice(splice.start, splice.deleteCount, ...splice.newOutputs.map(() => 0));
			removedOutputs.push(...this._outputViewModels.splice(splice.start, splice.deleteCount, ...splice.newOutputs.map(output => new CellOutputViewModel(this, output, this._notebookService))));

			this._outputsTop = null;
			this._onDidChangeOutputs.fire(splice);
			this._onDidRemoveOutputs.fire(removedOutputs);
			if (outputLayoutChange) {
				this.layoutChange({ outputHeight: true }, 'CodeCellViewModel#model.onDidChangeOutputs');
			}
			if (!this._outputCollection.length) {
				this.executionErrorDiagnostic.set(undefined, undefined);
			}
			dispose(removedOutputs);
		}));

		this._outputCollection = new Array(this.model.outputs.length);
		const layoutConfiguration = this.viewContext.notebookOptions.getLayoutConfiguration();
		this._layoutInfo = {
			fontInfo: initialNotebookLayoutInfo?.fontInfo || null,
			editorHeight: 0,
			editorWidth: initialNotebookLayoutInfo
				? this.viewContext.notebookOptions.computeCodeCellEditorWidth(initialNotebookLayoutInfo.width)
				: 0,
			chatHeight: 0,
			statusBarHeight: 0,
			commentOffset: 0,
			commentHeight: 0,
			outputContainerOffset: 0,
			outputTotalHeight: 0,
			outputShowMoreContainerHeight: 0,
			outputShowMoreContainerOffset: 0,
			totalHeight: this.computeTotalHeight(17, 0, 0, 0),
			codeIndicatorHeight: 0,
			outputIndicatorHeight: 0,
			bottomToolbarOffset: 0,
			layoutState: CellLayoutState.Uninitialized,
			estimatedHasHorizontalScrolling: false,
			outlineWidth: 1,
			topMargin: layoutConfiguration.cellTopMargin,
			bottomMargin: layoutConfiguration.cellBottomMargin,
		};
	}

	updateExecutionState(e: ICellExecutionStateChangedEvent) {
		if (e.changed) {
			this.executionErrorDiagnostic.set(undefined, undefined);
			this._onDidStartExecution.fire(e);
		} else {
			this._onDidStopExecution.fire(e);
		}
	}

	override updateOptions(e: NotebookOptionsChangeEvent) {
		super.updateOptions(e);
		if (e.cellStatusBarVisibility || e.insertToolbarPosition || e.cellToolbarLocation) {
			this.layoutChange({});
		}
	}

	pauseLayout() {
		this._pauseableEmitter.pause();
	}

	resumeLayout() {
		this._pauseableEmitter.resume();
	}

	layoutChange(state: CodeCellLayoutChangeEvent, source?: string) {
		// recompute
		this._ensureOutputsTop();
		const notebookLayoutConfiguration = this.viewContext.notebookOptions.getLayoutConfiguration();
		const bottomToolbarDimensions = this.viewContext.notebookOptions.computeBottomToolbarDimensions(this.viewType);
		const outputShowMoreContainerHeight = state.outputShowMoreContainerHeight ? state.outputShowMoreContainerHeight : this._layoutInfo.outputShowMoreContainerHeight;
		const outputTotalHeight = Math.max(this._outputMinHeight, this.isOutputCollapsed ? notebookLayoutConfiguration.collapsedIndicatorHeight : this._outputsTop!.getTotalSum());
		const commentHeight = state.commentHeight ? this._commentHeight : this._layoutInfo.commentHeight;

		const originalLayout = this.layoutInfo;
		if (!this.isInputCollapsed) {
			let newState: CellLayoutState;
			let editorHeight: number;
			let totalHeight: number;
			let hasHorizontalScrolling = false;
			const chatHeight = state.chatHeight ? this._chatHeight : this._layoutInfo.chatHeight;
			if (!state.editorHeight && this._layoutInfo.layoutState === CellLayoutState.FromCache && !state.outputHeight) {
				// No new editorHeight info - keep cached totalHeight and estimate editorHeight
				const estimate = this.estimateEditorHeight(state.font?.lineHeight ?? this._layoutInfo.fontInfo?.lineHeight);
				editorHeight = estimate.editorHeight;
				hasHorizontalScrolling = estimate.hasHorizontalScrolling;
				totalHeight = this._layoutInfo.totalHeight;
				newState = CellLayoutState.FromCache;
			} else if (state.editorHeight || this._layoutInfo.layoutState === CellLayoutState.Measured) {
				// Editor has been measured
				editorHeight = this._editorHeight;
				totalHeight = this.computeTotalHeight(this._editorHeight, outputTotalHeight, outputShowMoreContainerHeight, chatHeight);
				newState = CellLayoutState.Measured;
				hasHorizontalScrolling = this._layoutInfo.estimatedHasHorizontalScrolling;
			} else {
				const estimate = this.estimateEditorHeight(state.font?.lineHeight ?? this._layoutInfo.fontInfo?.lineHeight);
				editorHeight = estimate.editorHeight;
				hasHorizontalScrolling = estimate.hasHorizontalScrolling;
				totalHeight = this.computeTotalHeight(editorHeight, outputTotalHeight, outputShowMoreContainerHeight, chatHeight);
				newState = CellLayoutState.Estimated;
			}

			const statusBarHeight = this.viewContext.notebookOptions.computeEditorStatusbarHeight(this.internalMetadata, this.uri);
			const codeIndicatorHeight = editorHeight + statusBarHeight;
			const outputIndicatorHeight = outputTotalHeight + outputShowMoreContainerHeight;
			const outputContainerOffset = notebookLayoutConfiguration.editorToolbarHeight
				+ notebookLayoutConfiguration.cellTopMargin // CELL_TOP_MARGIN
				+ chatHeight
				+ editorHeight
				+ statusBarHeight;
			const outputShowMoreContainerOffset = totalHeight
				- bottomToolbarDimensions.bottomToolbarGap
				- bottomToolbarDimensions.bottomToolbarHeight / 2
				- outputShowMoreContainerHeight;
			const bottomToolbarOffset = this.viewContext.notebookOptions.computeBottomToolbarOffset(totalHeight, this.viewType);
			const editorWidth = state.outerWidth !== undefined
				? this.viewContext.notebookOptions.computeCodeCellEditorWidth(state.outerWidth)
				: this._layoutInfo?.editorWidth;

			this._layoutInfo = {
				fontInfo: state.font ?? this._layoutInfo.fontInfo ?? null,
				chatHeight,
				editorHeight,
				editorWidth,
				statusBarHeight,
				outputContainerOffset,
				outputTotalHeight,
				outputShowMoreContainerHeight,
				outputShowMoreContainerOffset,
				commentOffset: outputContainerOffset + outputTotalHeight,
				commentHeight,
				totalHeight,
				codeIndicatorHeight,
				outputIndicatorHeight,
				bottomToolbarOffset,
				layoutState: newState,
				estimatedHasHorizontalScrolling: hasHorizontalScrolling,
				topMargin: notebookLayoutConfiguration.cellTopMargin,
				bottomMargin: notebookLayoutConfiguration.cellBottomMargin,
				outlineWidth: 1
			};
		} else {
			const codeIndicatorHeight = notebookLayoutConfiguration.collapsedIndicatorHeight;
			const outputIndicatorHeight = outputTotalHeight + outputShowMoreContainerHeight;
			const chatHeight = state.chatHeight ? this._chatHeight : this._layoutInfo.chatHeight;

			const outputContainerOffset = notebookLayoutConfiguration.cellTopMargin + notebookLayoutConfiguration.collapsedIndicatorHeight;
			const totalHeight =
				notebookLayoutConfiguration.cellTopMargin
				+ notebookLayoutConfiguration.collapsedIndicatorHeight
				+ notebookLayoutConfiguration.cellBottomMargin //CELL_BOTTOM_MARGIN
				+ bottomToolbarDimensions.bottomToolbarGap //BOTTOM_CELL_TOOLBAR_GAP
				+ chatHeight
				+ commentHeight
				+ outputTotalHeight + outputShowMoreContainerHeight;
			const outputShowMoreContainerOffset = totalHeight
				- bottomToolbarDimensions.bottomToolbarGap
				- bottomToolbarDimensions.bottomToolbarHeight / 2
				- outputShowMoreContainerHeight;
			const bottomToolbarOffset = this.viewContext.notebookOptions.computeBottomToolbarOffset(totalHeight, this.viewType);
			const editorWidth = state.outerWidth !== undefined
				? this.viewContext.notebookOptions.computeCodeCellEditorWidth(state.outerWidth)
				: this._layoutInfo?.editorWidth;

			this._layoutInfo = {
				fontInfo: state.font ?? this._layoutInfo.fontInfo ?? null,
				editorHeight: this._layoutInfo.editorHeight,
				editorWidth,
				chatHeight: chatHeight,
				statusBarHeight: 0,
				outputContainerOffset,
				outputTotalHeight,
				outputShowMoreContainerHeight,
				outputShowMoreContainerOffset,
				commentOffset: outputContainerOffset + outputTotalHeight,
				commentHeight,
				totalHeight,
				codeIndicatorHeight,
				outputIndicatorHeight,
				bottomToolbarOffset,
				layoutState: this._layoutInfo.layoutState,
				estimatedHasHorizontalScrolling: false,
				outlineWidth: 1,
				topMargin: notebookLayoutConfiguration.cellTopMargin,
				bottomMargin: notebookLayoutConfiguration.cellBottomMargin,
			};
		}

		this._fireOnDidChangeLayout({
			...state,
			totalHeight: this.layoutInfo.totalHeight !== originalLayout.totalHeight,
			source,
		});
	}

	private _fireOnDidChangeLayout(state: CodeCellLayoutChangeEvent) {
		this._pauseableEmitter.fire(state);
	}

	override restoreEditorViewState(editorViewStates: editorCommon.ICodeEditorViewState | null, totalHeight?: number) {
		super.restoreEditorViewState(editorViewStates);
		if (totalHeight !== undefined && this._layoutInfo.layoutState !== CellLayoutState.Measured) {
			this._layoutInfo = {
				...this._layoutInfo,
				totalHeight: totalHeight,
				layoutState: CellLayoutState.FromCache,
			};
		}
	}

	getDynamicHeight() {
		this._onLayoutInfoRead.fire();
		return this._layoutInfo.totalHeight;
	}

	getHeight(lineHeight: number) {
		if (this._layoutInfo.layoutState === CellLayoutState.Uninitialized) {
			const estimate = this.estimateEditorHeight(lineHeight);
			return this.computeTotalHeight(estimate.editorHeight, 0, 0, 0);
		} else {
			return this._layoutInfo.totalHeight;
		}
	}

	private estimateEditorHeight(lineHeight: number | undefined = 20): { editorHeight: number; hasHorizontalScrolling: boolean } {
		let hasHorizontalScrolling = false;
		const cellEditorOptions = this.viewContext.getBaseCellEditorOptions(this.language);
		if (this.layoutInfo.fontInfo && cellEditorOptions.value.wordWrap === 'off') {
			for (let i = 0; i < this.lineCount; i++) {
				const max = this.textBuffer.getLineLastNonWhitespaceColumn(i + 1);
				const estimatedWidth = max * (this.layoutInfo.fontInfo.typicalHalfwidthCharacterWidth + this.layoutInfo.fontInfo.letterSpacing);
				if (estimatedWidth > this.layoutInfo.editorWidth) {
					hasHorizontalScrolling = true;
					break;
				}
			}
		}

		const verticalScrollbarHeight = hasHorizontalScrolling ? 12 : 0; // take zoom level into account
		const editorPadding = this.viewContext.notebookOptions.computeEditorPadding(this.internalMetadata, this.uri);
		const editorHeight = this.lineCount * lineHeight
			+ editorPadding.top
			+ editorPadding.bottom // EDITOR_BOTTOM_PADDING
			+ verticalScrollbarHeight;
		return {
			editorHeight,
			hasHorizontalScrolling
		};
	}

	private computeTotalHeight(editorHeight: number, outputsTotalHeight: number, outputShowMoreContainerHeight: number, chatHeight: number): number {
		const layoutConfiguration = this.viewContext.notebookOptions.getLayoutConfiguration();
		const { bottomToolbarGap } = this.viewContext.notebookOptions.computeBottomToolbarDimensions(this.viewType);
		return layoutConfiguration.editorToolbarHeight
			+ layoutConfiguration.cellTopMargin
			+ chatHeight
			+ editorHeight
			+ this.viewContext.notebookOptions.computeEditorStatusbarHeight(this.internalMetadata, this.uri)
			+ this._commentHeight
			+ outputsTotalHeight
			+ outputShowMoreContainerHeight
			+ bottomToolbarGap
			+ layoutConfiguration.cellBottomMargin;
	}

	protected onDidChangeTextModelContent(): void {
		if (this.getEditState() !== CellEditState.Editing) {
			this.updateEditState(CellEditState.Editing, 'onDidChangeTextModelContent');
			this._onDidChangeState.fire({ contentChanged: true });
		}
	}

	onDeselect() {
		this.updateEditState(CellEditState.Preview, 'onDeselect');
	}

	updateOutputShowMoreContainerHeight(height: number) {
		this.layoutChange({ outputShowMoreContainerHeight: height }, 'CodeCellViewModel#updateOutputShowMoreContainerHeight');
	}

	updateOutputMinHeight(height: number) {
		this.outputMinHeight = height;
	}

	unlockOutputHeight() {
		this.outputMinHeight = 0;
		this.layoutChange({ outputHeight: true });
	}

	updateOutputHeight(index: number, height: number, source?: string) {
		if (index >= this._outputCollection.length) {
			throw new Error('Output index out of range!');
		}

		this._ensureOutputsTop();

		try {
			if (index === 0 || height > 0) {
				this._outputViewModels[index].setVisible(true);
			} else if (height === 0) {
				this._outputViewModels[index].setVisible(false);
			}
		} catch (e) {
			const errorMessage = `Failed to update output height for cell ${this.handle}, output ${index}. `
				+ `this.outputCollection.length: ${this._outputCollection.length}, this._outputViewModels.length: ${this._outputViewModels.length}`;
			throw new Error(`${errorMessage}.\n Error: ${e.message}`);
		}

		if (this._outputViewModels[index].visible.get() && height < 28) {
			height = 28;
		}

		this._outputCollection[index] = height;
		if (this._outputsTop!.setValue(index, height)) {
			this.layoutChange({ outputHeight: true }, source);
		}
	}

	getOutputOffsetInContainer(index: number) {
		this._ensureOutputsTop();

		if (index >= this._outputCollection.length) {
			throw new Error('Output index out of range!');
		}

		return this._outputsTop!.getPrefixSum(index - 1);
	}

	getOutputOffset(index: number): number {
		return this.layoutInfo.outputContainerOffset + this.getOutputOffsetInContainer(index);
	}

	spliceOutputHeights(start: number, deleteCnt: number, heights: number[]) {
		this._ensureOutputsTop();

		this._outputsTop!.removeValues(start, deleteCnt);
		if (heights.length) {
			const values = new Uint32Array(heights.length);
			for (let i = 0; i < heights.length; i++) {
				values[i] = heights[i];
			}

			this._outputsTop!.insertValues(start, values);
		}

		this.layoutChange({ outputHeight: true }, 'CodeCellViewModel#spliceOutputs');
	}

	private _ensureOutputsTop(): void {
		if (!this._outputsTop) {
			const values = new Uint32Array(this._outputCollection.length);
			for (let i = 0; i < this._outputCollection.length; i++) {
				values[i] = this._outputCollection[i];
			}

			this._outputsTop = new PrefixSumComputer(values);
		}
	}

	private readonly _hasFindResult = this._register(new Emitter<boolean>());
	public readonly hasFindResult: Event<boolean> = this._hasFindResult.event;

	startFind(value: string, options: INotebookFindOptions): CellFindMatch | null {
		const matches = super.cellStartFind(value, options);

		if (matches === null) {
			return null;
		}

		return {
			cell: this,
			contentMatches: matches
		};
	}

	override dispose() {
		super.dispose();

		this._outputCollection = [];
		this._outputsTop = null;
		dispose(this._outputViewModels);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/viewModel/eventDispatcher.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewModel/eventDispatcher.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { NotebookCellStateChangedEvent, NotebookLayoutChangedEvent, NotebookMetadataChangedEvent, NotebookViewEvent, NotebookViewEventType } from '../notebookViewEvents.js';

export class NotebookEventDispatcher extends Disposable {
	private readonly _onDidChangeLayout = this._register(new Emitter<NotebookLayoutChangedEvent>());
	readonly onDidChangeLayout = this._onDidChangeLayout.event;

	private readonly _onDidChangeMetadata = this._register(new Emitter<NotebookMetadataChangedEvent>());
	readonly onDidChangeMetadata = this._onDidChangeMetadata.event;

	private readonly _onDidChangeCellState = this._register(new Emitter<NotebookCellStateChangedEvent>());
	readonly onDidChangeCellState = this._onDidChangeCellState.event;

	emit(events: NotebookViewEvent[]) {
		for (let i = 0, len = events.length; i < len; i++) {
			const e = events[i];

			switch (e.type) {
				case NotebookViewEventType.LayoutChanged:
					this._onDidChangeLayout.fire(e);
					break;
				case NotebookViewEventType.MetadataChanged:
					this._onDidChangeMetadata.fire(e);
					break;
				case NotebookViewEventType.CellStateChanged:
					this._onDidChangeCellState.fire(e);
					break;
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/viewModel/foldingModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewModel/foldingModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { renderAsPlaintext } from '../../../../../base/browser/markdownRenderer.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { DisposableStore, IDisposable } from '../../../../../base/common/lifecycle.js';
import { marked } from '../../../../../base/common/marked/marked.js';
import { TrackedRangeStickiness } from '../../../../../editor/common/model.js';
import { FoldingLimitReporter } from '../../../../../editor/contrib/folding/browser/folding.js';
import { FoldingRegion, FoldingRegions } from '../../../../../editor/contrib/folding/browser/foldingRanges.js';
import { IFoldingRangeData, sanitizeRanges } from '../../../../../editor/contrib/folding/browser/syntaxRangeProvider.js';
import { INotebookViewModel } from '../notebookBrowser.js';
import { CellKind } from '../../common/notebookCommon.js';
import { cellRangesToIndexes, ICellRange } from '../../common/notebookRange.js';

type RegionFilter = (r: FoldingRegion) => boolean;
type RegionFilterWithLevel = (r: FoldingRegion, level: number) => boolean;

const foldingRangeLimit: FoldingLimitReporter = {
	limit: 5000,
	update: () => { }
};

export class FoldingModel implements IDisposable {
	private _viewModel: INotebookViewModel | null = null;
	private readonly _viewModelStore = new DisposableStore();
	private _regions: FoldingRegions;
	get regions() {
		return this._regions;
	}

	private readonly _onDidFoldingRegionChanges = new Emitter<void>();
	readonly onDidFoldingRegionChanged: Event<void> = this._onDidFoldingRegionChanges.event;

	private _foldingRangeDecorationIds: string[] = [];

	constructor() {
		this._regions = new FoldingRegions(new Uint32Array(0), new Uint32Array(0));
	}

	dispose() {
		this._onDidFoldingRegionChanges.dispose();
		this._viewModelStore.dispose();
	}

	detachViewModel() {
		this._viewModelStore.clear();
		this._viewModel = null;
	}

	attachViewModel(model: INotebookViewModel) {
		this._viewModel = model;

		this._viewModelStore.add(this._viewModel.onDidChangeViewCells(() => {
			this.recompute();
		}));

		this._viewModelStore.add(this._viewModel.onDidChangeSelection(() => {
			if (!this._viewModel) {
				return;
			}

			const indexes = cellRangesToIndexes(this._viewModel.getSelections());

			let changed = false;

			indexes.forEach(index => {
				let regionIndex = this.regions.findRange(index + 1);

				while (regionIndex !== -1) {
					if (this._regions.isCollapsed(regionIndex) && index > this._regions.getStartLineNumber(regionIndex) - 1) {
						this._regions.setCollapsed(regionIndex, false);
						changed = true;
					}
					regionIndex = this._regions.getParentIndex(regionIndex);
				}
			});

			if (changed) {
				this._onDidFoldingRegionChanges.fire();
			}

		}));

		this.recompute();
	}

	getRegionAtLine(lineNumber: number): FoldingRegion | null {
		if (this._regions) {
			const index = this._regions.findRange(lineNumber);
			if (index >= 0) {
				return this._regions.toRegion(index);
			}
		}
		return null;
	}

	getRegionsInside(region: FoldingRegion | null, filter?: RegionFilter | RegionFilterWithLevel): FoldingRegion[] {
		const result: FoldingRegion[] = [];
		const index = region ? region.regionIndex + 1 : 0;
		const endLineNumber = region ? region.endLineNumber : Number.MAX_VALUE;

		if (filter && filter.length === 2) {
			const levelStack: FoldingRegion[] = [];
			for (let i = index, len = this._regions.length; i < len; i++) {
				const current = this._regions.toRegion(i);
				if (this._regions.getStartLineNumber(i) < endLineNumber) {
					while (levelStack.length > 0 && !current.containedBy(levelStack[levelStack.length - 1])) {
						levelStack.pop();
					}
					levelStack.push(current);
					if (filter(current, levelStack.length)) {
						result.push(current);
					}
				} else {
					break;
				}
			}
		} else {
			for (let i = index, len = this._regions.length; i < len; i++) {
				const current = this._regions.toRegion(i);
				if (this._regions.getStartLineNumber(i) < endLineNumber) {
					if (!filter || (filter as RegionFilter)(current)) {
						result.push(current);
					}
				} else {
					break;
				}
			}
		}
		return result;
	}

	getAllRegionsAtLine(lineNumber: number, filter?: (r: FoldingRegion, level: number) => boolean): FoldingRegion[] {
		const result: FoldingRegion[] = [];
		if (this._regions) {
			let index = this._regions.findRange(lineNumber);
			let level = 1;
			while (index >= 0) {
				const current = this._regions.toRegion(index);
				if (!filter || filter(current, level)) {
					result.push(current);
				}
				level++;
				index = current.parentIndex;
			}
		}
		return result;
	}

	setCollapsed(index: number, newState: boolean) {
		this._regions.setCollapsed(index, newState);
	}

	recompute() {
		if (!this._viewModel) {
			return;
		}

		const viewModel = this._viewModel;
		const cells = viewModel.viewCells;
		const stack: { index: number; level: number; endIndex: number }[] = [];

		for (let i = 0; i < cells.length; i++) {
			const cell = cells[i];

			if (cell.cellKind !== CellKind.Markup || cell.language !== 'markdown') {
				continue;
			}

			const minDepth = Math.min(7, ...Array.from(getMarkdownHeadersInCell(cell.getText()), header => header.depth));
			if (minDepth < 7) {
				// header 1 to 6
				stack.push({ index: i, level: minDepth, endIndex: 0 });
			}
		}

		// calculate folding ranges
		const rawFoldingRanges: IFoldingRangeData[] = stack.map((entry, startIndex) => {
			let end: number | undefined = undefined;
			for (let i = startIndex + 1; i < stack.length; ++i) {
				if (stack[i].level <= entry.level) {
					end = stack[i].index - 1;
					break;
				}
			}

			const endIndex = end !== undefined ? end : cells.length - 1;

			// one based
			return {
				start: entry.index + 1,
				end: endIndex + 1,
				rank: 1
			};
		}).filter(range => range.start !== range.end);

		const newRegions = sanitizeRanges(rawFoldingRanges, foldingRangeLimit);

		// restore collased state
		let i = 0;
		const nextCollapsed = () => {
			while (i < this._regions.length) {
				const isCollapsed = this._regions.isCollapsed(i);
				i++;
				if (isCollapsed) {
					return i - 1;
				}
			}
			return -1;
		};

		let k = 0;
		let collapsedIndex = nextCollapsed();

		while (collapsedIndex !== -1 && k < newRegions.length) {
			// get the latest range
			const decRange = viewModel.getTrackedRange(this._foldingRangeDecorationIds[collapsedIndex]);
			if (decRange) {
				const collasedStartIndex = decRange.start;

				while (k < newRegions.length) {
					const startIndex = newRegions.getStartLineNumber(k) - 1;
					if (collasedStartIndex >= startIndex) {
						newRegions.setCollapsed(k, collasedStartIndex === startIndex);
						k++;
					} else {
						break;
					}
				}
			}
			collapsedIndex = nextCollapsed();
		}

		while (k < newRegions.length) {
			newRegions.setCollapsed(k, false);
			k++;
		}

		const cellRanges: ICellRange[] = [];
		for (let i = 0; i < newRegions.length; i++) {
			const region = newRegions.toRegion(i);
			cellRanges.push({ start: region.startLineNumber - 1, end: region.endLineNumber - 1 });
		}

		// remove old tracked ranges and add new ones
		// TODO@rebornix, implement delta
		this._foldingRangeDecorationIds.forEach(id => viewModel.setTrackedRange(id, null, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter));
		this._foldingRangeDecorationIds = cellRanges.map(region => viewModel.setTrackedRange(null, region, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter)).filter(str => str !== null) as string[];

		this._regions = newRegions;
		this._onDidFoldingRegionChanges.fire();
	}

	getMemento(): ICellRange[] {
		const collapsedRanges: ICellRange[] = [];
		let i = 0;
		while (i < this._regions.length) {
			const isCollapsed = this._regions.isCollapsed(i);

			if (isCollapsed) {
				const region = this._regions.toRegion(i);
				collapsedRanges.push({ start: region.startLineNumber - 1, end: region.endLineNumber - 1 });
			}

			i++;
		}

		return collapsedRanges;
	}

	public applyMemento(state: ICellRange[]): boolean {
		if (!this._viewModel) {
			return false;
		}

		let i = 0;
		let k = 0;

		while (k < state.length && i < this._regions.length) {
			// get the latest range
			const decRange = this._viewModel.getTrackedRange(this._foldingRangeDecorationIds[i]);
			if (decRange) {
				const collasedStartIndex = state[k].start;

				while (i < this._regions.length) {
					const startIndex = this._regions.getStartLineNumber(i) - 1;
					if (collasedStartIndex >= startIndex) {
						this._regions.setCollapsed(i, collasedStartIndex === startIndex);
						i++;
					} else {
						break;
					}
				}
			}
			k++;
		}

		while (i < this._regions.length) {
			this._regions.setCollapsed(i, false);
			i++;
		}

		return true;
	}
}

export function updateFoldingStateAtIndex(foldingModel: FoldingModel, index: number, collapsed: boolean) {
	const range = foldingModel.regions.findRange(index + 1);
	foldingModel.setCollapsed(range, collapsed);
}

export function* getMarkdownHeadersInCell(cellContent: string): Iterable<{ readonly depth: number; readonly text: string }> {
	for (const token of marked.lexer(cellContent, { gfm: true })) {
		if (token.type === 'heading') {
			yield {
				depth: token.depth,
				text: renderAsPlaintext({ value: token.raw }).trim()
			};
		}
	}
}
```

--------------------------------------------------------------------------------

````

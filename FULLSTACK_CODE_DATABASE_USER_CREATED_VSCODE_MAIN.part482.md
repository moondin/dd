---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 482
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 482 of 552)

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

---[FILE: src/vs/workbench/contrib/webview/browser/pre/index.html]---
Location: vscode-main/src/vs/workbench/contrib/webview/browser/pre/index.html

```html
<!DOCTYPE html>
<html lang="en" style="width: 100%; height: 100%;">

<head>
	<meta charset="UTF-8">

	<meta http-equiv="Content-Security-Policy"
		content="default-src 'none'; script-src 'sha256-TaWGDzV7c9rUH2q/5ygOyYUHSyHIqBMYfucPh3lnKvU=' 'self'; frame-src 'self'; style-src 'unsafe-inline';">

	<!-- Disable pinch zooming -->
	<meta name="viewport"
		content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
</head>

<body style="margin: 0; overflow: hidden; width: 100%; height: 100%; overscroll-behavior-x: none;" role="document">
	<script async type="module">
		// @ts-check
		/// <reference lib="dom" />

		const isSafari = (
			navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
			navigator.userAgent &&
			navigator.userAgent.indexOf('CriOS') === -1 &&
			navigator.userAgent.indexOf('FxiOS') === -1
		);

		const isFirefox = (
			navigator.userAgent &&
			navigator.userAgent.indexOf('Firefox') >= 0
		);

		const searchParams = new URL(location.toString()).searchParams;
		const ID = searchParams.get('id');
		const webviewOrigin = searchParams.get('origin');
		const onElectron = searchParams.get('platform') === 'electron';
		const disableServiceWorker = searchParams.has('disableServiceWorker');
		const expectedWorkerVersion = parseInt(searchParams.get('swVersion'));

		/**
		 * @param {string} name
		 * @param {Record<string, string>} [options]
		 */
		const perfMark = (name, options = {}) => {
			performance.mark(`webview/index.html/${name}`, {
				detail: {
					id: ID,
					...options
				}
			});
		}

		perfMark('scriptStart');

		/** @type {MessageChannel | undefined} */
		let outerIframeMessageChannel;

		/**
		 * Use polling to track focus of main webview and iframes within the webview
		 *
		 * @param {Object} handlers
		 * @param {() => void} handlers.onFocus
		 * @param {() => void} handlers.onBlur
		 */
		const trackFocus = ({ onFocus, onBlur }) => {
			const interval = 250;
			let isFocused = document.hasFocus();
			setInterval(() => {
				const target = getActiveFrame();
				const isCurrentlyFocused = document.hasFocus() || !!(target && target.contentDocument && target.contentDocument.body.classList.contains('vscode-context-menu-visible'));
				if (isCurrentlyFocused === isFocused) {
					return;
				}
				isFocused = isCurrentlyFocused;
				if (isCurrentlyFocused) {
					onFocus();
				} else {
					onBlur();
				}
			}, interval);
		};

		const getActiveFrame = () => {
			return /** @type {HTMLIFrameElement | undefined} */ (document.getElementById('active-frame'));
		};

		const getPendingFrame = () => {
			return /** @type {HTMLIFrameElement | undefined} */ (document.getElementById('pending-frame'));
		};

		/**
		 * @template T
		 * @param {T | undefined | null} obj
		 * @return {T}
		 */
		function assertIsDefined(obj) {
			if (typeof obj === 'undefined' || obj === null) {
				throw new Error('Found unexpected null');
			}
			return obj;
		}

		const vscodePostMessageFuncName = '__vscode_post_message__';

		const defaultStyles = document.createElement('style');
		defaultStyles.id = '_defaultStyles';
		defaultStyles.textContent = `
		@layer vscode-default {
			html {
				scrollbar-color: var(--vscode-scrollbarSlider-background) var(--vscode-editor-background);
			}

			body {
				overscroll-behavior-x: none;
				background-color: transparent;
				color: var(--vscode-editor-foreground);
				font-family: var(--vscode-font-family);
				font-weight: var(--vscode-font-weight);
				font-size: var(--vscode-font-size);
				margin: 0;
				padding: 0 20px;
			}

			img, video {
				max-width: 100%;
				max-height: 100%;
			}

			a, a code {
				color: var(--vscode-textLink-foreground);
			}

			p > a {
				text-decoration: var(--text-link-decoration);
			}

			a:hover {
				color: var(--vscode-textLink-activeForeground);
			}

			a:focus,
			input:focus,
			select:focus,
			textarea:focus {
				outline: 1px solid -webkit-focus-ring-color;
				outline-offset: -1px;
			}

			code {
				font-family: var(--monaco-monospace-font);
				color: var(--vscode-textPreformat-foreground);
				background-color: var(--vscode-textPreformat-background);
				padding: 1px 3px;
				border-radius: 4px;
			}

			pre code {
				padding: 0;
			}

			blockquote {
				background: var(--vscode-textBlockQuote-background);
				border-color: var(--vscode-textBlockQuote-border);
			}

			kbd {
				background-color: var(--vscode-keybindingLabel-background);
				color: var(--vscode-keybindingLabel-foreground);
				border-style: solid;
				border-width: 1px;
				border-radius: 3px;
				border-color: var(--vscode-keybindingLabel-border);
				border-bottom-color: var(--vscode-keybindingLabel-bottomBorder);
				box-shadow: inset 0 -1px 0 var(--vscode-widget-shadow);
				vertical-align: middle;
				padding: 1px 3px;
			}

			::-webkit-scrollbar {
				width: 10px;
				height: 10px;
			}

			::-webkit-scrollbar-corner {
				background-color: var(--vscode-editor-background);
			}

			::-webkit-scrollbar-thumb {
				background-color: var(--vscode-scrollbarSlider-background);
			}
			::-webkit-scrollbar-thumb:hover {
				background-color: var(--vscode-scrollbarSlider-hoverBackground);
			}
			::-webkit-scrollbar-thumb:active {
				background-color: var(--vscode-scrollbarSlider-activeBackground);
			}
			::highlight(find-highlight) {
				background-color: var(--vscode-editor-findMatchHighlightBackground);
			}
			::highlight(current-find-highlight) {
				background-color: var(--vscode-editor-findMatchBackground);
			}
		}`;

		/**
		 * @param {boolean} allowMultipleAPIAcquire
		 * @param {*} [state]
		 * @return {string}
		 */
		function getVsCodeApiScript(allowMultipleAPIAcquire, state) {
			const encodedState = state ? encodeURIComponent(state) : undefined;
			return /* js */`
					globalThis.acquireVsCodeApi = (function() {
						const originalPostMessage = window.parent['${vscodePostMessageFuncName}'].bind(window.parent);
						const doPostMessage = (channel, data, transfer) => {
							originalPostMessage(channel, data, transfer);
						};

						let acquired = false;

						let state = ${state ? `JSON.parse(decodeURIComponent("${encodedState}"))` : undefined};

						return () => {
							if (acquired && !${allowMultipleAPIAcquire}) {
								throw new Error('An instance of the VS Code API has already been acquired');
							}
							acquired = true;
							return Object.freeze({
								postMessage: function(message, transfer) {
									doPostMessage('onmessage', { message, transfer }, transfer);
								},
								setState: function(newState) {
									state = newState;
									doPostMessage('do-update-state', JSON.stringify(newState));
									return newState;
								},
								getState: function() {
									return state;
								}
							});
						};
					})();
					window.parent = window;
					window.top = window;
					window.frameElement = null;
				`;
		}

		/** @type {Promise<void>} */
		const workerReady = new Promise((resolve, reject) => {
			if (disableServiceWorker) {
				return resolve();
			}

			if (!areServiceWorkersEnabled()) {
				return reject(new Error('Service Workers are not enabled. Webviews will not work. Try disabling private/incognito mode.'));
			}

			const swPath = encodeURI(`service-worker.js?v=${expectedWorkerVersion}&vscode-resource-base-authority=${searchParams.get('vscode-resource-base-authority')}&remoteAuthority=${searchParams.get('remoteAuthority') ?? ''}`);
			navigator.serviceWorker.register(swPath, { type: 'module' })
				.then(async registration => {
					/**
					 * @param {MessageEvent} event
					 */
					const versionHandler = async (event) => {
						if (event.data.channel !== 'version') {
							return;
						}

						navigator.serviceWorker.removeEventListener('message', versionHandler);
						if (event.data.version === expectedWorkerVersion) {
							return resolve();
						} else {
							console.log(`Found unexpected service worker version. Found: ${event.data.version}. Expected: ${expectedWorkerVersion}`);
							console.log(`Attempting to reload service worker`);

							// If we have the wrong version, try once (and only once) to unregister and re-register
							// Note that `.update` doesn't seem to work desktop electron at the moment so we use
							// `unregister` and `register` here.
							return registration.unregister()
								.then(() => navigator.serviceWorker.register(swPath))
								.finally(() => { resolve(); });
						}
					};
					navigator.serviceWorker.addEventListener('message', versionHandler);

					const postVersionMessage = (/** @type {ServiceWorker} */ controller) => {
						outerIframeMessageChannel = new MessageChannel();
						controller.postMessage({ channel: 'version' }, [outerIframeMessageChannel.port2]);
					};

					// At this point, either the service worker is ready and
					// became our controller, or we need to wait for it.
					// Note that navigator.serviceWorker.controller could be a
					// controller from a previously loaded service worker.
					const currentController = navigator.serviceWorker.controller;
					if (currentController?.scriptURL.endsWith(swPath)) {
						// service worker already loaded & ready to receive messages
						postVersionMessage(currentController);
					} else {
						if (currentController) {
							console.log(`Found unexpected service worker controller. Found: ${currentController.scriptURL}. Expected: ${swPath}. Waiting for controllerchange.`);
						} else {
							console.log(`No service worker controller found. Waiting for controllerchange.`);
						}

						// Either there's no controlling service worker, or it's an old one.
						// Wait for it to change before posting the message
						const onControllerChange = () => {
							navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
							if (navigator.serviceWorker.controller) {
								postVersionMessage(navigator.serviceWorker.controller);
							} else {
								return reject(new Error('No controller found.'));
							}
						};
						navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
					}
				}).catch(error => {
					if (!onElectron && error instanceof Error && error.message.includes('user denied permission')) {
						return reject(new Error(`Could not register service worker. Please make sure third party cookies are enabled: ${error}`));
					}
					return reject(new Error(`Could not register service worker: ${error}.`));
				});
		});

		/**
		 *  @type {import('../webviewMessages').WebviewHostMessaging}
		 */
		const hostMessaging = new class HostMessaging {

			constructor() {
				this.channel = new MessageChannel();

				/** @type {Map<string, Array<(event: MessageEvent, data: any) => void>>} */
				this.handlers = new Map();

				this.channel.port1.onmessage = (e) => {
					const channel = e.data.channel;
					const handlers = this.handlers.get(channel);
					if (handlers) {
						for (const handler of handlers) {
							handler(e, e.data.args);
						}
					} else {
						console.log('no handler for ', e);
					}
				};
			}

			postMessage(channel, data, transfer) {
				this.channel.port1.postMessage({ channel, data }, transfer);
			}

			onMessage(channel, handler) {
				let handlers = this.handlers.get(channel);
				if (!handlers) {
					handlers = [];
					this.handlers.set(channel, handlers);
				}
				handlers.push(handler);
			}

			async signalReady() {
				const start = (/** @type {string} */ parentOrigin) => {
					perfMark('signalingReady');
					window.parent.postMessage({ target: ID, channel: 'webview-ready', data: {} }, parentOrigin, [this.channel.port2]);
				};

				const parentOrigin = searchParams.get('parentOrigin');

				const hostname = location.hostname;

				if (!crypto.subtle) {
					// cannot validate, not running in a secure context
					throw new Error(`'crypto.subtle' is not available so webviews will not work. This is likely because the editor is not running in a secure context (https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts).`);
				}

				// Here the `parentOriginHash()` function from `src/vs/workbench/common/webview.ts` is inlined
				// compute a sha-256 composed of `parentOrigin` and `salt` converted to base 32
				let parentOriginHash;
				try {
					const strData = JSON.stringify({ parentOrigin, salt: webviewOrigin });
					const encoder = new TextEncoder();
					const arrData = encoder.encode(strData);
					const hash = await crypto.subtle.digest('sha-256', arrData);
					const hashArray = Array.from(new Uint8Array(hash));
					const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
					// sha256 has 256 bits, so we need at most ceil(lg(2^256-1)/lg(32)) = 52 chars to represent it in base 32
					parentOriginHash = BigInt(`0x${hashHex}`).toString(32).padStart(52, '0');
				} catch (err) {
					throw err instanceof Error ? err : new Error(String(err));
				}

				if (hostname === parentOriginHash || hostname.startsWith(parentOriginHash + '.')) {
					// validation succeeded!
					return start(parentOrigin);
				}

				throw new Error(`Expected '${parentOriginHash}' as hostname or subdomain!`);
			}
		}();

		const unloadMonitor = new class {

			constructor() {
				this.confirmBeforeClose = 'keyboardOnly';
				this.isModifierKeyDown = false;

				hostMessaging.onMessage('set-confirm-before-close', (_e, data) => {
					this.confirmBeforeClose = data;
				});

				hostMessaging.onMessage('content', (_e, data) => {
					this.confirmBeforeClose = data.confirmBeforeClose;
				});

				window.addEventListener('beforeunload', (event) => {
					if (onElectron) {
						return;
					}

					switch (this.confirmBeforeClose) {
						case 'always': {
							event.preventDefault();
							event.returnValue = '';
							return '';
						}
						case 'never': {
							break;
						}
						case 'keyboardOnly':
						default: {
							if (this.isModifierKeyDown) {
								event.preventDefault();
								event.returnValue = '';
								return '';
							}
							break;
						}
					}
				});
			}

			onIframeLoaded(/** @type {HTMLIFrameElement} */ frame) {
				assertIsDefined(frame.contentWindow).addEventListener('keydown', e => {
					this.isModifierKeyDown = e.metaKey || e.ctrlKey || e.altKey;
				});

				assertIsDefined(frame.contentWindow).addEventListener('keyup', () => {
					this.isModifierKeyDown = false;
				});
			}
		};

		// state
		let firstLoad = true;
		/** @type {any} */
		let loadTimeout;
		let styleVersion = 0;

		/** @type {Array<{ readonly message: any, transfer?: ArrayBuffer[] }>} */
		let pendingMessages = [];

		const initData = {
			/** @type {number | undefined} */
			initialScrollProgress: undefined,

			/** @type {{ [key: string]: string } | undefined} */
			styles: undefined,

			/** @type {string | undefined} */
			activeTheme: undefined,

			/** @type {string | undefined} */
			themeId: undefined,

			/** @type {string | undefined} */
			themeLabel: undefined,

			/** @type {boolean} */
			screenReader: false,

			/** @type {boolean} */
			reduceMotion: false,
		};

		if (!disableServiceWorker) {
			hostMessaging.onMessage('did-load-resource', (_event, data) => {
				assertIsDefined(navigator.serviceWorker.controller).postMessage({ channel: 'did-load-resource', data }, data.data?.buffer ? [data.data.buffer] : []);
			});

			hostMessaging.onMessage('did-load-localhost', (_event, data) => {
				assertIsDefined(navigator.serviceWorker.controller).postMessage({ channel: 'did-load-localhost', data });
			});

			navigator.serviceWorker.addEventListener('message', event => {
				switch (event.data.channel) {
					case 'load-resource':
					case 'load-localhost':
						hostMessaging.postMessage(event.data.channel, event.data);
						return;
				}
			});
		}

		/**
		 * @param {HTMLDocument?} document
		 * @param {HTMLElement?} body
		 */
		const applyStyles = (document, body) => {
			if (!document) {
				return;
			}

			if (body) {
				body.classList.remove('vscode-light', 'vscode-dark', 'vscode-high-contrast', 'vscode-high-contrast-light', 'vscode-reduce-motion', 'vscode-using-screen-reader');

				if (initData.activeTheme) {
					body.classList.add(initData.activeTheme);
					if (initData.activeTheme === 'vscode-high-contrast-light') {
						// backwards compatibility
						body.classList.add('vscode-high-contrast');
					}
				}

				if (initData.reduceMotion) {
					body.classList.add('vscode-reduce-motion');
				}

				if (initData.screenReader) {
					body.classList.add('vscode-using-screen-reader');
				}

				body.dataset.vscodeThemeKind = initData.activeTheme;
				/** @deprecated data-vscode-theme-name will be removed, use data-vscode-theme-id instead */
				body.dataset.vscodeThemeName = initData.themeLabel || '';
				body.dataset.vscodeThemeId = initData.themeId || '';
			}

			if (initData.styles) {
				const documentStyle = document.documentElement.style;

				// Remove stale properties
				for (let i = documentStyle.length - 1; i >= 0; i--) {
					const property = documentStyle[i];

					// Don't remove properties that the webview might have added separately
					if (property && property.startsWith('--vscode-')) {
						documentStyle.removeProperty(property);
					}
				}

				// Re-add new properties
				for (const [variable, value] of Object.entries(initData.styles)) {
					documentStyle.setProperty(`--${variable}`, value);
				}
			}
		};

		/**
		 * @param {MouseEvent} event
		 */
		const handleInnerClick = (event) => {
			if (!event?.view?.document) {
				return;
			}

			const baseElement = event.view.document.querySelector('base');

			for (const pathElement of event.composedPath()) {
				/** @type {any} */
				const node = pathElement;
				if (node.tagName && node.tagName.toLowerCase() === 'a' && node.href) {
					if (node.getAttribute('href') === '#') {
						event.view.scrollTo(0, 0);
					} else if (node.hash && (node.getAttribute('href') === node.hash || (baseElement && node.href === baseElement.href + node.hash))) {
						const fragment = node.hash.slice(1);
						const decodedFragment = decodeURIComponent(fragment);
						const scrollTarget = event.view.document.getElementById(fragment) ?? event.view.document.getElementById(decodedFragment);
						if (scrollTarget) {
							scrollTarget.scrollIntoView();
						} else if (decodedFragment.toLowerCase() === 'top') {
							event.view.scrollTo(0, 0);
						}
					} else {
						hostMessaging.postMessage('did-click-link', { uri: node.href.baseVal || node.href });
					}
					event.preventDefault();
					return;
				}
			}
		};

		/**
		 * @param {MouseEvent} event
		 */
		const handleAuxClick = (event) => {
			// Prevent middle clicks opening a broken link in the browser
			if (!event?.view?.document) {
				return;
			}

			if (event.button === 1) {
				for (const pathElement of event.composedPath()) {
					/** @type {any} */
					const node = pathElement;
					if (node.tagName && node.tagName.toLowerCase() === 'a' && node.href) {
						event.preventDefault();
						return;
					}
				}
			}
		};

		/**
		 * @param {KeyboardEvent} e
		 */
		const handleInnerKeydown = (e) => {
			// If the keypress would trigger a browser event, such as copy or paste,
			// make sure we block the browser from dispatching it. Instead VS Code
			// handles these events and will dispatch a copy/paste back to the webview
			// if needed
			if (isUndoRedo(e) || isPrint(e) || isFindEvent(e) || isSaveEvent(e)) {
				e.preventDefault();
			} else if (isCopyPasteOrCut(e)) {
				if (onElectron) {
					e.preventDefault();
				} else {
					return; // let the browser handle this
				}
			} else if (!onElectron && (isCloseTab(e) || isNewWindow(e) || isHelp(e) || isRefresh(e))) {
				// Prevent Ctrl+W closing window / Ctrl+N opening new window in PWA.
				// (No effect in a regular browser tab.)
				e.preventDefault();
			}

			hostMessaging.postMessage('did-keydown', {
				key: e.key,
				keyCode: e.keyCode,
				code: e.code,
				shiftKey: e.shiftKey,
				altKey: e.altKey,
				ctrlKey: e.ctrlKey,
				metaKey: e.metaKey,
				repeat: e.repeat
			});
		};
		/**
		 * @param {KeyboardEvent} e
		 */
		const handleInnerKeyup = (e) => {
			hostMessaging.postMessage('did-keyup', {
				key: e.key,
				keyCode: e.keyCode,
				code: e.code,
				shiftKey: e.shiftKey,
				altKey: e.altKey,
				ctrlKey: e.ctrlKey,
				metaKey: e.metaKey,
				repeat: e.repeat
			});
		};

		/**
		 * @param {KeyboardEvent} e
		 * @return {boolean}
		 */
		function isCopyPasteOrCut(e) {
			const hasMeta = e.ctrlKey || e.metaKey;
			// 45: keyCode of "Insert"
			const shiftInsert = e.shiftKey && e.keyCode === 45;
			// 67, 86, 88: keyCode of "C", "V", "X"
			return (hasMeta && [67, 86, 88].includes(e.keyCode)) || shiftInsert;
		}

		/**
		 * @param {KeyboardEvent} e
		 * @return {boolean}
		 */
		function isUndoRedo(e) {
			const hasMeta = e.ctrlKey || e.metaKey;
			// 90, 89: keyCode of "Z", "Y"
			return hasMeta && [90, 89].includes(e.keyCode);
		}

		/**
		 * @param {KeyboardEvent} e
		 * @return {boolean}
		 */
		function isPrint(e) {
			const hasMeta = e.ctrlKey || e.metaKey;
			// 80: keyCode of "P"
			return hasMeta && e.keyCode === 80;
		}

		/**
		 * @param {KeyboardEvent} e
		 * @return {boolean}
		 */
		function isFindEvent(e) {
			const hasMeta = e.ctrlKey || e.metaKey;
			// 70: keyCode of "F"
			return hasMeta && e.keyCode === 70;
		}

		/**
		 * @param {KeyboardEvent} e
		 * @return {boolean}
		 */
		function isSaveEvent(e) {
			const hasMeta = e.ctrlKey || e.metaKey;
			// 83: keyCode of "S"
			return hasMeta && e.keyCode === 83;
		}

		/**
		 * @param {KeyboardEvent} e
		 * @return {boolean}
		 */
		function isCloseTab(e) {
			const hasMeta = e.ctrlKey || e.metaKey;
			// 87: keyCode of "W"
			return hasMeta && e.keyCode === 87;
		}

		/**
		 * @param {KeyboardEvent} e
		 * @return {boolean}
		 */
		function isNewWindow(e) {
			const hasMeta = e.ctrlKey || e.metaKey;
			// 78: keyCode of "N"
			return hasMeta && e.keyCode === 78;
		}

		/**
		 * @param {KeyboardEvent} e
		 * @return {boolean}
		 */
		function isHelp(e) {
			// 112: keyCode of "F1"
			return e.keyCode === 112;
		}

		/**
		 * @param {KeyboardEvent} e
		 * @return {boolean}
		 */
		function isRefresh(e) {
			// 116: keyCode of "F5"
			return e.keyCode === 116;
		}

		let isHandlingScroll = false;

		/**
		 * @param {WheelEvent} event
		 */
		const handleWheel = (event) => {
			if (isHandlingScroll) {
				return;
			}

			hostMessaging.postMessage('did-scroll-wheel', {
				deltaMode: event.deltaMode,
				deltaX: event.deltaX,
				deltaY: event.deltaY,
				deltaZ: event.deltaZ,
				detail: event.detail,
				type: event.type
			});
		};

		/**
		 * @param {Event} event
		 */
		const handleInnerScroll = (event) => {
			if (isHandlingScroll) {
				return;
			}

			const target = /** @type {HTMLDocument | null} */ (event.target);
			const currentTarget = /** @type {Window | null} */ (event.currentTarget);
			if (!currentTarget || !target?.body) {
				return;
			}

			const progress = currentTarget.scrollY / target.body.clientHeight;
			if (isNaN(progress)) {
				return;
			}

			isHandlingScroll = true;
			window.requestAnimationFrame(() => {
				try {
					hostMessaging.postMessage('did-scroll', { scrollYPercentage: progress });
				} catch (e) {
					// noop
				}
				isHandlingScroll = false;
			});
		};

		function handleInnerDragStartEvent(/** @type {DragEvent} */ e) {
			if (e.defaultPrevented) {
				// Extension code has already handled this event
				return;
			}

			if (!e.dataTransfer || e.shiftKey) {
				return;
			}

			// Only handle drags from outside editor for now
			if (e.dataTransfer.items.length && Array.prototype.every.call(e.dataTransfer.items, item => item.kind === 'file')) {
				hostMessaging.postMessage('drag-start', undefined);
			}
		}


		function handleInnerDragEvent(/** @type {DragEvent} */ e) {
			/**
			 * To ensure that the drop event always fires as expected, you should always include a preventDefault() call in the part of your code which handles the dragover event.
			 * source: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event
			 **/
			e.preventDefault();

			if (!e.dataTransfer) {
				return;
			}


			// Only handle drags from outside editor for now
			if (e.dataTransfer.items.length && Array.prototype.every.call(e.dataTransfer.items, item => item.kind === 'file')) {
				hostMessaging.postMessage('drag', {
					shiftKey: e.shiftKey
				});
			}

		}

		function handleInnerDropEvent(/**@type {DragEvent} */e) {
			e.preventDefault();
		}

		/**
		 * @param {() => void} callback
		 */
		function onDomReady(callback) {
			if (document.readyState === 'interactive' || document.readyState === 'complete') {
				callback();
			} else {
				document.addEventListener('DOMContentLoaded', callback);
			}
		}

		function areServiceWorkersEnabled() {
			try {
				return !!navigator.serviceWorker;
			} catch (e) {
				return false;
			}
		}

		/**
		 * @param {import('../webviewMessages').UpdateContentEvent} data
		 * @return {string}
		 */
		function toContentHtml(data) {
			const options = data.options;
			const text = data.contents;
			const newDocument = new DOMParser().parseFromString(text, 'text/html');

			newDocument.querySelectorAll('a').forEach(a => {
				if (!a.title) {
					const href = a.getAttribute('href');
					if (typeof href === 'string') {
						a.title = href;
					}
				}
			});

			// Set default aria role
			if (!newDocument.body.hasAttribute('role')) {
				newDocument.body.setAttribute('role', 'document');
			}

			// Inject default script
			if (options.allowScripts) {
				const defaultScript = newDocument.createElement('script');
				defaultScript.id = '_vscodeApiScript';
				defaultScript.textContent = getVsCodeApiScript(options.allowMultipleAPIAcquire, data.state);
				newDocument.head.prepend(defaultScript);
			}

			// Inject default styles
			newDocument.head.prepend(defaultStyles.cloneNode(true));

			applyStyles(newDocument, newDocument.body);

			// Strip out unsupported http-equiv tags
			for (const metaElement of Array.from(newDocument.querySelectorAll('meta'))) {
				const httpEquiv = metaElement.getAttribute('http-equiv');
				if (httpEquiv && !/^(content-security-policy|default-style|content-type)$/i.test(httpEquiv)) {
					console.warn(`Removing unsupported meta http-equiv: ${httpEquiv}`);
					metaElement.remove();
				}
			}

			// Check for CSP
			const csp = newDocument.querySelector('meta[http-equiv="Content-Security-Policy"]');
			if (!csp) {
				hostMessaging.postMessage('no-csp-found', undefined);
			} else {
				try {
					// Attempt to rewrite CSPs that hardcode old-style resource endpoint
					const cspContent = csp.getAttribute('content');
					if (cspContent) {
						const newCsp = cspContent.replace(/(vscode-webview-resource|vscode-resource):(?=(\s|;|$))/g, data.cspSource);
						csp.setAttribute('content', newCsp);
					}
				} catch (e) {
					console.error(`Could not rewrite csp: ${e}`);
				}
			}

			// set DOCTYPE for newDocument explicitly as DOMParser.parseFromString strips it off
			// and DOCTYPE is needed in the iframe to ensure that the user agent stylesheet is correctly overridden
			return '<!DOCTYPE html>\n' + newDocument.documentElement.outerHTML;
		}

		// Also forward events before the contents of the webview have loaded
		window.addEventListener('keydown', handleInnerKeydown);
		window.addEventListener('keyup', handleInnerKeyup);
		window.addEventListener('dragenter', handleInnerDragStartEvent);
		window.addEventListener('dragover', handleInnerDragEvent);
		window.addEventListener('drag', handleInnerDragEvent);
		window.addEventListener('drop', handleInnerDropEvent);


		onDomReady(() => {
			if (!document.body) {
				return;
			}

			hostMessaging.onMessage('styles', (_event, data) => {
				++styleVersion;

				initData.styles = data.styles;
				initData.activeTheme = data.activeTheme;
				initData.themeLabel = data.themeLabel;
				initData.themeId = data.themeId;
				initData.reduceMotion = data.reduceMotion;
				initData.screenReader = data.screenReader;

				const target = getActiveFrame();
				if (!target) {
					return;
				}

				if (target.contentDocument) {
					applyStyles(target.contentDocument, target.contentDocument.body);
				}
			});

			// propagate focus
			hostMessaging.onMessage('focus', () => {
				const activeFrame = getActiveFrame();
				if (!activeFrame || !activeFrame.contentWindow) {
					// Focus the top level webview instead
					window.focus();
					return;
				}

				if (document.activeElement === activeFrame) {
					// We are already focused on the iframe (or one of its children) so no need
					// to refocus.
					return;
				}

				activeFrame.contentWindow.focus();
			});

			// update iframe-contents
			let updateId = 0;
			hostMessaging.onMessage('content', async (_event, /** @type {import('../webviewMessages').UpdateContentEvent} */ data) => {
				perfMark('content/started');

				const currentUpdateId = ++updateId;
				try {
					await workerReady;
					perfMark('content/workerReady');
				} catch (e) {
					console.error(`Webview fatal error: ${e}`);
					hostMessaging.postMessage('fatal-error', { message: e + '' });
					return;
				}

				if (currentUpdateId !== updateId) {
					return;
				}

				const options = data.options;
				const newDocument = toContentHtml(data);

				const initialStyleVersion = styleVersion;

				const frame = getActiveFrame();
				const wasFirstLoad = firstLoad;
				// keep current scrollY around and use later
				/** @type {(body: HTMLElement, window: Window) => void} */
				let setInitialScrollPosition;
				if (firstLoad) {
					firstLoad = false;
					setInitialScrollPosition = (body, window) => {
						if (typeof initData.initialScrollProgress === 'number' && !isNaN(initData.initialScrollProgress)) {
							if (window.scrollY === 0) {
								window.scroll(0, body.clientHeight * initData.initialScrollProgress);
							}
						}
					};
				} else {
					const scrollY = frame && frame.contentDocument && frame.contentDocument.body ? assertIsDefined(frame.contentWindow).scrollY : 0;
					setInitialScrollPosition = (body, window) => {
						if (window.scrollY === 0) {
							window.scroll(0, scrollY);
						}
					};
				}

				// Clean up old pending frames and set current one as new one
				const previousPendingFrame = getPendingFrame();
				if (previousPendingFrame) {
					previousPendingFrame.setAttribute('id', '');
					previousPendingFrame.remove();
				}
				if (!wasFirstLoad) {
					pendingMessages = [];
				}

				const newFrame = document.createElement('iframe');
				newFrame.title = data.title;
				newFrame.setAttribute('id', 'pending-frame');
				newFrame.setAttribute('frameborder', '0');

				const sandboxRules = new Set(['allow-same-origin', 'allow-pointer-lock']);
				if (options.allowScripts) {
					sandboxRules.add('allow-scripts');
					sandboxRules.add('allow-downloads');
				}
				if (options.allowForms) {
					sandboxRules.add('allow-forms');
				}
				newFrame.setAttribute('sandbox', Array.from(sandboxRules).join(' '));

				const allowRules = ['cross-origin-isolated;', 'autoplay;', 'local-network-access;'];
				if (!isFirefox && options.allowScripts) {
					allowRules.push('clipboard-read;', 'clipboard-write;');
				}
				newFrame.setAttribute('allow', allowRules.join(' '));
				// We should just be able to use srcdoc, but I wasn't
				// seeing the service worker applying properly.
				// Fake load an empty on the correct origin and then write real html
				// into it to get around this.
				const fakeUrlParams = new URLSearchParams({ id: ID });
				if (globalThis.crossOriginIsolated) {
					fakeUrlParams.set('vscode-coi', '3'); /*COOP+COEP*/
				}
				newFrame.src = `./fake.html?${fakeUrlParams.toString()}`;

				newFrame.style.cssText = 'display: block; margin: 0; overflow: hidden; position: absolute; width: 100%; height: 100%; visibility: hidden';
				document.body.appendChild(newFrame);

				newFrame.contentWindow.addEventListener('keydown', handleInnerKeydown);
				newFrame.contentWindow.addEventListener('keyup', handleInnerKeyup);

				/**
				 * @param {Document} contentDocument
				 */
				function onFrameLoaded(contentDocument) {
					perfMark('content/innerFrameLoaded')

					// Workaround for https://bugs.chromium.org/p/chromium/issues/detail?id=978325
					setTimeout(() => {
						contentDocument.open();
						contentDocument.write(newDocument);
						contentDocument.close();
						hookupOnLoadHandlers(newFrame);
						perfMark('content/wroteInnerContent')

						if (initialStyleVersion !== styleVersion) {
							applyStyles(contentDocument, contentDocument.body);
						}
					}, 0);
				}

				if (!options.allowScripts && isSafari) {
					// On Safari for iframes with scripts disabled, the `DOMContentLoaded` never seems to be fired: https://bugs.webkit.org/show_bug.cgi?id=33604
					// Use polling instead.
					const interval = setInterval(() => {
						// If the frame is no longer mounted, loading has stopped
						if (!newFrame.parentElement) {
							clearInterval(interval);
							return;
						}

						const contentDocument = assertIsDefined(newFrame.contentDocument);
						if (contentDocument.location.pathname.endsWith('/fake.html') && contentDocument.readyState !== 'loading') {
							clearInterval(interval);
							onFrameLoaded(contentDocument);
						}
					}, 10);
				} else {
					assertIsDefined(newFrame.contentWindow).addEventListener('DOMContentLoaded', e => {
						const contentDocument = e.target ? (/** @type {HTMLDocument} */ (e.target)) : undefined;
						onFrameLoaded(assertIsDefined(contentDocument));
					});
				}

				/**
				 * @param {Document} contentDocument
				 * @param {Window} contentWindow
				 */
				const onLoad = (contentDocument, contentWindow) => {
					if (contentDocument && contentDocument.body) {
						// Workaround for https://github.com/microsoft/vscode/issues/12865
						// check new scrollY and reset if necessary
						setInitialScrollPosition(contentDocument.body, contentWindow);
					}

					const newFrame = getPendingFrame();
					if (newFrame && newFrame.contentDocument && newFrame.contentDocument === contentDocument) {
						const wasFocused = document.hasFocus();
						const oldActiveFrame = getActiveFrame();
						oldActiveFrame?.remove();
						// Styles may have changed since we created the element. Make sure we re-style
						if (initialStyleVersion !== styleVersion) {
							applyStyles(newFrame.contentDocument, newFrame.contentDocument.body);
						}
						newFrame.setAttribute('id', 'active-frame');
						newFrame.style.visibility = 'visible';

						contentWindow.addEventListener('scroll', handleInnerScroll);
						contentWindow.addEventListener('wheel', handleWheel);

						if (wasFocused) {
							contentWindow.focus();
						}

						// Get body size
						const docEl = contentDocument.documentElement;
						if (docEl) {
							const postSize = () => {
								hostMessaging.postMessage('updated-intrinsic-content-size', {
									width: docEl.offsetWidth,
									height: docEl.offsetHeight
								});
							};

							const resizeObserver = new ResizeObserver(postSize);
							resizeObserver.observe(docEl);
							postSize();
						}

						pendingMessages.forEach((message) => {
							contentWindow.postMessage(message.message, window.origin, message.transfer);
						});
						pendingMessages = [];
					}
				};

				/**
				 * @param {HTMLIFrameElement} newFrame
				 */
				function hookupOnLoadHandlers(newFrame) {
					clearTimeout(loadTimeout);
					loadTimeout = undefined;
					loadTimeout = setTimeout(() => {
						clearTimeout(loadTimeout);
						loadTimeout = undefined;
						onLoad(assertIsDefined(newFrame.contentDocument), assertIsDefined(newFrame.contentWindow));
					}, 200);

					const contentWindow = assertIsDefined(newFrame.contentWindow);

					contentWindow.addEventListener('load', function (e) {
						const contentDocument = /** @type {Document} */ (e.target);

						if (loadTimeout) {
							clearTimeout(loadTimeout);
							loadTimeout = undefined;
							onLoad(contentDocument, this);
						}
					});

					// Bubble out various events
					contentWindow.addEventListener('click', handleInnerClick);
					contentWindow.addEventListener('auxclick', handleAuxClick);
					contentWindow.addEventListener('keydown', handleInnerKeydown);
					contentWindow.addEventListener('keyup', handleInnerKeyup);
					contentWindow.addEventListener('contextmenu', e => {
						if (e.defaultPrevented) {
							// Extension code has already handled this event
							return;
						}

						e.preventDefault();

						/** @type { Record<string, boolean>} */
						let context = {};

						/** @type {HTMLElement | null} */
						let el = e.target;
						while (true) {
							if (!el) {
								break;
							}

							// Search self/ancestors for the closest context data attribute
							el = el.closest('[data-vscode-context]');
							if (!el) {
								break;
							}

							try {
								context = { ...JSON.parse(el.dataset.vscodeContext), ...context };
							} catch (e) {
								console.error(`Error parsing 'data-vscode-context' as json`, el, e);
							}

							el = el.parentElement;
						}

						hostMessaging.postMessage('did-context-menu', {
							clientX: e.clientX,
							clientY: e.clientY,
							context: context
						});
					});

					contentWindow.addEventListener('dragenter', handleInnerDragStartEvent);
					contentWindow.addEventListener('dragover', handleInnerDragEvent);
					contentWindow.addEventListener('drag', handleInnerDragEvent);
					contentWindow.addEventListener('drop', handleInnerDropEvent);

					unloadMonitor.onIframeLoaded(newFrame);
				}

				if (!disableServiceWorker && outerIframeMessageChannel) {
					outerIframeMessageChannel.port1.onmessage = event => {
						switch (event.data.channel) {
							case 'load-resource':
							case 'load-localhost':
								hostMessaging.postMessage(event.data.channel, event.data);
								return;
						}
					};
				}
			});

			// propagate vscode-context-menu-visible class
			hostMessaging.onMessage('set-context-menu-visible', (_event, data) => {
				const target = getActiveFrame();
				if (target && target.contentDocument) {
					target.contentDocument.body.classList.toggle('vscode-context-menu-visible', data.visible);
				}
			});

			hostMessaging.onMessage('set-title', async (_event, data) => {
				const target = getActiveFrame();
				if (target) {
					target.title = data;
				}
			});

			// Forward message to the embedded iframe
			hostMessaging.onMessage('message', (_event, data) => {
				const pending = getPendingFrame();
				if (!pending) {
					const target = getActiveFrame();
					if (target) {
						assertIsDefined(target.contentWindow).postMessage(data.message, window.origin, data.transfer);
						return;
					}
				}
				pendingMessages.push(data);
			});

			hostMessaging.onMessage('initial-scroll-position', (_event, progress) => {
				initData.initialScrollProgress = progress;
			});

			hostMessaging.onMessage('execCommand', (_event, data) => {
				const target = getActiveFrame();
				if (!target) {
					return;
				}
				assertIsDefined(target.contentDocument).execCommand(data);
			});

			/** @type {string | undefined} */
			let lastFindValue = undefined;

			hostMessaging.onMessage('find', (_event, data) => {
				const target = getActiveFrame();
				if (!target) {
					return;
				}

				if (!data.previous && lastFindValue !== data.value && target.contentWindow) {
					// Reset selection so we start search at the head of the last search
					const selection = target.contentWindow.getSelection();
					if (selection) {
						selection.collapse(selection.anchorNode);
					}
				}
				lastFindValue = data.value;

				const didFind = (/** @type {any} */ (target.contentWindow)).find(
					data.value,
					/* caseSensitive*/ false,
					/* backwards*/ data.previous,
					/* wrapAround*/ true,
					/* wholeWord */ false,
					/* searchInFrames*/ false,
					false);
				hostMessaging.postMessage('did-find', didFind);
			});

			hostMessaging.onMessage('find-stop', (_event, data) => {
				const target = getActiveFrame();
				if (!target) {
					return;
				}

				lastFindValue = undefined;

				if (!data.clearSelection && target.contentWindow) {
					const selection = target.contentWindow.getSelection();
					if (selection) {
						for (let i = 0; i < selection.rangeCount; i++) {
							selection.removeRange(selection.getRangeAt(i));
						}
					}
				}
			});

			trackFocus({
				onFocus: () => hostMessaging.postMessage('did-focus', undefined),
				onBlur: () => hostMessaging.postMessage('did-blur', undefined)
			});

			(/** @type {any} */ (window))[vscodePostMessageFuncName] = (/** @type {string} */ command, /** @type {any} */ data) => {
				switch (command) {
					case 'onmessage':
					case 'do-update-state':
						hostMessaging.postMessage(command, data);
						break;
				}
			};

			hostMessaging.signalReady();
		});
	</script>
</body>

</html>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webview/browser/pre/service-worker.js]---
Location: vscode-main/src/vs/workbench/contrib/webview/browser/pre/service-worker.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
//@ts-check
/// <reference lib="webworker" />

/** @type {ServiceWorkerGlobalScope} */
const sw = /** @type {any} */ (self);

const VERSION = 4;

const resourceCacheName = `vscode-resource-cache-${VERSION}`;

const rootPath = sw.location.pathname.replace(/\/service-worker.js$/, '');

const searchParams = new URL(location.toString()).searchParams;

const remoteAuthority = searchParams.get('remoteAuthority');

/** @type {MessagePort|undefined} */
let outerIframeMessagePort;

/**
 * Origin used for resources
 */
const resourceBaseAuthority = searchParams.get('vscode-resource-base-authority');

/**
 * @param {string} name
 * @param {Record<string, string>} [options]
 */
const perfMark = (name, options = {}) => {
	performance.mark(`webview/service-worker/${name}`, {
		detail: {
			...options
		}
	});
};

perfMark('scriptStart');

/** @type {number} */
const resolveTimeout = 30_000;


/**
 * @template T
 * @typedef {{ status: 'ok', value: T } | { status: 'timeout' }} RequestStoreResult
 */


/**
 * @template T
 * @typedef {{ resolve: (x: RequestStoreResult<T>) => void, promise: Promise<RequestStoreResult<T>> }} RequestStoreEntry
 */


/**
 * @template T
 */
class RequestStore {
	constructor() {
		/** @type {Map<number, RequestStoreEntry<T>>} */
		this.map = new Map();
		/** @type {number} */
		this.requestPool = 0;
	}

	/**
	 * @returns {{ requestId: number, promise: Promise<RequestStoreResult<T>> }}
	 */
	create() {
		const requestId = ++this.requestPool;

		/** @type {(x: RequestStoreResult<T>) => void} */
		let resolve;
		const promise = new Promise(r => resolve = r);

		/** @type {RequestStoreEntry<T>} */
		const entry = { resolve, promise };
		this.map.set(requestId, entry);

		const dispose = () => {
			clearTimeout(timeout);
			const existingEntry = this.map.get(requestId);
			if (existingEntry === entry) {
				existingEntry.resolve({ status: 'timeout' });
				this.map.delete(requestId);
			}
		};
		const timeout = setTimeout(dispose, resolveTimeout);
		return { requestId, promise };
	}

	/**
	 * @param {number} requestId
	 * @param {T} result
	 * @returns {boolean}
	 */
	resolve(requestId, result) {
		const entry = this.map.get(requestId);
		if (!entry) {
			return false;
		}
		entry.resolve({ status: 'ok', value: result });
		this.map.delete(requestId);
		return true;
	}
}

/**
 * Map of requested paths to responses.
 */
/** @type {RequestStore<ResourceResponse>} */
const resourceRequestStore = new RequestStore();

/**
 * Map of requested localhost origins to optional redirects.
 */
/** @type {RequestStore<string|undefined>} */
const localhostRequestStore = new RequestStore();

const unauthorized = () =>
	new Response('Unauthorized', { status: 401, });

const notFound = () =>
	new Response('Not Found', { status: 404, });

const methodNotAllowed = () =>
	new Response('Method Not Allowed', { status: 405, });

const requestTimeout = () =>
	new Response('Request Timeout', { status: 408, });

sw.addEventListener('message', async (event) => {
	if (!event.source) {
		return;
	}

	/** @type {Client} */
	const source = event.source;
	switch (event.data.channel) {
		case 'version': {
			perfMark('version/request');
			outerIframeMessagePort = event.ports[0];
			sw.clients.get(source.id).then(client => {
				perfMark('version/reply');
				if (client) {
					client.postMessage({
						channel: 'version',
						version: VERSION
					});
				}
			});
			return;
		}
		case 'did-load-resource': {
			/** @type {ResourceResponse} */
			const response = event.data.data;
			if (!resourceRequestStore.resolve(response.id, response)) {
				console.log('Could not resolve unknown resource', response.path);
			}
			return;
		}
		case 'did-load-localhost': {
			const data = event.data.data;
			if (!localhostRequestStore.resolve(data.id, data.location)) {
				console.log('Could not resolve unknown localhost', data.origin);
			}
			return;
		}
		default: {
			console.log('Unknown message');
			return;
		}
	}
});

sw.addEventListener('fetch', (event) => {
	const requestUrl = new URL(event.request.url);
	if (typeof resourceBaseAuthority === 'string' && requestUrl.protocol === 'https:' && requestUrl.hostname.endsWith('.' + resourceBaseAuthority)) {
		switch (event.request.method) {
			case 'GET':
			case 'HEAD': {
				const firstHostSegment = requestUrl.hostname.slice(0, requestUrl.hostname.length - (resourceBaseAuthority.length + 1));
				const scheme = firstHostSegment.split('+', 1)[0];
				const authority = firstHostSegment.slice(scheme.length + 1); // may be empty
				return event.respondWith(processResourceRequest(event, {
					scheme,
					authority,
					path: requestUrl.pathname,
					query: requestUrl.search.replace(/^\?/, ''),
				}));
			}
			default: {
				return event.respondWith(methodNotAllowed());
			}
		}
	}

	// If we're making a request against the remote authority, we want to go
	// through VS Code itself so that we are authenticated properly.  If the
	// service worker is hosted on the same origin we will have cookies and
	// authentication will not be an issue.
	if (requestUrl.origin !== sw.origin && requestUrl.host === remoteAuthority) {
		switch (event.request.method) {
			case 'GET':
			case 'HEAD': {
				return event.respondWith(processResourceRequest(event, {
					path: requestUrl.pathname,
					scheme: requestUrl.protocol.slice(0, requestUrl.protocol.length - 1),
					authority: requestUrl.host,
					query: requestUrl.search.replace(/^\?/, ''),
				}));
			}
			default: {
				return event.respondWith(methodNotAllowed());
			}
		}
	}

	// See if it's a localhost request
	if (requestUrl.origin !== sw.origin && requestUrl.host.match(/^(localhost|127.0.0.1|0.0.0.0):(\d+)$/)) {
		return event.respondWith(processLocalhostRequest(event, requestUrl));
	}
});

sw.addEventListener('install', (event) => {
	event.waitUntil(sw.skipWaiting()); // Activate worker immediately
});

sw.addEventListener('activate', (event) => {
	event.waitUntil(sw.clients.claim()); // Become available to all pages
});


/**
 * @typedef {Object} ResourceRequestUrlComponents
 * @property {string} scheme
 * @property {string} authority
 * @property {string} path
 * @property {string} query
 */

/**
 * @param {FetchEvent} event
 * @param {ResourceRequestUrlComponents} requestUrlComponents
 * @returns {Promise<Response>}
 */
async function processResourceRequest(
	event,
	requestUrlComponents
) {
	let client = await sw.clients.get(event.clientId);
	if (!client) {
		client = await getWorkerClientForId(event.clientId);
		if (!client) {
			console.error('Could not find inner client for request');
			return notFound();
		}
	}

	const webviewId = getWebviewIdForClient(client);

	// Refs https://github.com/microsoft/vscode/issues/244143
	// With PlzDedicatedWorker, worker subresources and blob wokers
	// will use clients different from the window client.
	// Since we cannot different a worker main resource from a worker subresource
	// we will use message channel to the outer iframe provided at the time
	// of service worker controller version initialization.
	if (!webviewId && client.type !== 'worker' && client.type !== 'sharedworker') {
		console.error('Could not resolve webview id');
		return notFound();
	}

	const shouldTryCaching = (event.request.method === 'GET');

	/**
	 * @param {RequestStoreResult<ResourceResponse>} result
	 * @param {Response|undefined} cachedResponse
	 * @returns {Response}
	 */
	const resolveResourceEntry = (result, cachedResponse) => {
		if (result.status === 'timeout') {
			return requestTimeout();
		}

		/** @type {Record<string, string>} */
		const accessControlHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Cross-Origin-Resource-Policy': 'cross-origin',
		};

		const entry = result.value;
		if (entry.status === 304) { // Not modified
			if (cachedResponse) {
				const r = cachedResponse.clone();
				for (const [key, value] of Object.entries(accessControlHeaders)) {
					r.headers.set(key, value);
				}
				return r;
			} else {
				throw new Error('No cache found');
			}
		}

		if (entry.status === 401) {
			return unauthorized();
		}

		if (entry.status !== 200) {
			return notFound();
		}

		const byteLength = entry.data.byteLength;

		const range = event.request.headers.get('range');
		if (range) {
			// To support seeking for videos, we need to handle range requests
			const bytes = range.match(/^bytes\=(\d+)\-(\d+)?$/g);
			if (bytes) {
				// TODO: Right now we are always reading the full file content. This is a bad idea
				// for large video files :)

				const start = Number(bytes[1]);
				const end = Number(bytes[2]) || byteLength - 1;
				return new Response(entry.data.slice(start, end + 1), {
					status: 206,
					headers: {
						...accessControlHeaders,
						'Content-range': `bytes 0-${end}/${byteLength}`,
					}
				});
			} else {
				// We don't understand the requested bytes
				return new Response(null, {
					status: 416,
					headers: {
						...accessControlHeaders,
						'Content-range': `*/${byteLength}`
					}
				});
			}
		}

		/** @type {Record<string, string>} */
		const headers = {
			...accessControlHeaders,
			'Content-Type': entry.mime,
			'Content-Length': byteLength.toString(),
		};

		if (entry.etag) {
			headers['ETag'] = entry.etag;
			headers['Cache-Control'] = 'no-cache';
		}
		if (entry.mtime) {
			headers['Last-Modified'] = new Date(entry.mtime).toUTCString();
		}

		// support COI requests, see network.ts#COI.getHeadersFromQuery(...)
		const coiRequest = new URL(event.request.url).searchParams.get('vscode-coi');
		if (coiRequest === '3') {
			headers['Cross-Origin-Opener-Policy'] = 'same-origin';
			headers['Cross-Origin-Embedder-Policy'] = 'require-corp';
		} else if (coiRequest === '2') {
			headers['Cross-Origin-Embedder-Policy'] = 'require-corp';
		} else if (coiRequest === '1') {
			headers['Cross-Origin-Opener-Policy'] = 'same-origin';
		}

		const response = new Response(entry.data, {
			status: 200,
			headers
		});

		if (shouldTryCaching && entry.etag) {
			caches.open(resourceCacheName).then(cache => {
				return cache.put(event.request, response);
			});
		}
		return response.clone();
	};

	/** @type {Response|undefined} */
	let cached;
	if (shouldTryCaching) {
		const cache = await caches.open(resourceCacheName);
		cached = await cache.match(event.request);
	}

	const { requestId, promise } = resourceRequestStore.create();

	if (webviewId) {
		const parentClients = await getOuterIframeClient(webviewId);
		if (!parentClients.length) {
			console.log('Could not find parent client for request');
			return notFound();
		}

		for (const parentClient of parentClients) {
			parentClient.postMessage({
				channel: 'load-resource',
				id: requestId,
				scheme: requestUrlComponents.scheme,
				authority: requestUrlComponents.authority,
				path: requestUrlComponents.path,
				query: requestUrlComponents.query,
				ifNoneMatch: cached?.headers.get('ETag'),
			});
		}
	} else if (client.type === 'worker' || client.type === 'sharedworker') {
		outerIframeMessagePort?.postMessage({
			channel: 'load-resource',
			id: requestId,
			scheme: requestUrlComponents.scheme,
			authority: requestUrlComponents.authority,
			path: requestUrlComponents.path,
			query: requestUrlComponents.query,
			ifNoneMatch: cached?.headers.get('ETag'),
		});
	}

	return promise.then(entry => resolveResourceEntry(entry, cached));
}

/**
 * @param {FetchEvent} event
 * @param {URL} requestUrl
 * @returns {Promise<Response>}
 */
async function processLocalhostRequest(
	event,
	requestUrl
) {
	const client = await sw.clients.get(event.clientId);
	if (!client) {
		// This is expected when requesting resources on other localhost ports
		// that are not spawned by vs code
		return fetch(event.request);
	}
	const webviewId = getWebviewIdForClient(client);
	// Refs https://github.com/microsoft/vscode/issues/244143
	// With PlzDedicatedWorker, worker subresources and blob wokers
	// will use clients different from the window client.
	// Since we cannot different a worker main resource from a worker subresource
	// we will use message channel to the outer iframe provided at the time
	// of service worker controller version initialization.
	if (!webviewId && client.type !== 'worker' && client.type !== 'sharedworker') {
		console.error('Could not resolve webview id');
		return fetch(event.request);
	}

	const origin = requestUrl.origin;

	/**
	 * @param {RequestStoreResult<string|undefined>} result
	 * @returns {Promise<Response>}
	 */
	const resolveRedirect = async function (result) {
		if (result.status !== 'ok' || !result.value) {
			return fetch(event.request);
		}

		const redirectOrigin = result.value;
		const location = event.request.url.replace(new RegExp(`^${requestUrl.origin}(/|$)`), `${redirectOrigin}$1`);
		return new Response(null, {
			status: 302,
			headers: {
				Location: location
			}
		});
	};

	const { requestId, promise } = localhostRequestStore.create();
	if (webviewId) {
		const parentClients = await getOuterIframeClient(webviewId);
		if (!parentClients.length) {
			console.log('Could not find parent client for request');
			return notFound();
		}
		for (const parentClient of parentClients) {
			parentClient.postMessage({
				channel: 'load-localhost',
				origin: origin,
				id: requestId,
			});
		}
	} else if (client.type === 'worker' || client.type === 'sharedworker') {
		outerIframeMessagePort?.postMessage({
			channel: 'load-localhost',
			origin: origin,
			id: requestId,
		});
	}

	return promise.then(resolveRedirect);
}

/**
 * @param {Client} client
 * @returns {string|null}
 */
function getWebviewIdForClient(client) {
	const requesterClientUrl = new URL(client.url);
	return requesterClientUrl.searchParams.get('id');
}

/**
 * @param {string} webviewId
 * @returns {Promise<Client[]>}
 */
async function getOuterIframeClient(webviewId) {
	const allClients = await sw.clients.matchAll({ includeUncontrolled: true });
	return allClients.filter(client => {
		const clientUrl = new URL(client.url);
		const hasExpectedPathName = (clientUrl.pathname === `${rootPath}/` || clientUrl.pathname === `${rootPath}/index.html` || clientUrl.pathname === `${rootPath}/index-no-csp.html`);
		return hasExpectedPathName && clientUrl.searchParams.get('id') === webviewId;
	});
}

/**
 * @param {string} clientId
 * @returns {Promise<Client|undefined>}
 */
async function getWorkerClientForId(clientId) {
	const allDedicatedWorkerClients = await sw.clients.matchAll({ type: 'worker' });
	const allSharedWorkerClients = await sw.clients.matchAll({ type: 'sharedworker' });
	const allWorkerClients = [...allDedicatedWorkerClients, ...allSharedWorkerClients];
	return allWorkerClients.find(client => {
		return client.id === clientId;
	});
}


/**
 * @typedef {(
 *   | { readonly status: 200, id: number, path: string, mime: string, data: Uint8Array, etag: string|undefined, mtime: number|undefined }
 *   | { readonly status: 304, id: number, path: string, mime: string, mtime: number|undefined }
 *   | { readonly status: 401, id: number, path: string }
 *   | { readonly status: 404, id: number, path: string }
 * )} ResourceResponse
 */
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webview/common/webview.ts]---
Location: vscode-main/src/vs/workbench/contrib/webview/common/webview.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../../base/common/charCode.js';
import { Schemas } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';

export interface WebviewRemoteInfo {
	readonly isRemote: boolean;
	readonly authority: string | undefined;
}

/**
 * Root from which resources in webviews are loaded.
 *
 * This is hardcoded because we never expect to actually hit it. Instead these requests
 * should always go to a service worker.
 */
export const webviewResourceBaseHost = 'vscode-cdn.net';

export const webviewRootResourceAuthority = `vscode-resource.${webviewResourceBaseHost}`;

export const webviewGenericCspSource = `'self' https://*.${webviewResourceBaseHost}`;

/**
 * Construct a uri that can load resources inside a webview
 *
 * We encode the resource component of the uri so that on the main thread
 * we know where to load the resource from (remote or truly local):
 *
 * ```txt
 * ${scheme}+${resource-authority}.vscode-resource.vscode-cdn.net/${path}
 * ```
 *
 * @param resource Uri of the resource to load.
 * @param remoteInfo Optional information about the remote that specifies where `resource` should be resolved from.
 */
export function asWebviewUri(resource: URI, remoteInfo?: WebviewRemoteInfo): URI {
	if (resource.scheme === Schemas.http || resource.scheme === Schemas.https) {
		return resource;
	}

	if (remoteInfo && remoteInfo.authority && remoteInfo.isRemote && resource.scheme === Schemas.file) {
		resource = URI.from({
			scheme: Schemas.vscodeRemote,
			authority: remoteInfo.authority,
			path: resource.path,
		});
	}

	return URI.from({
		scheme: Schemas.https,
		authority: `${resource.scheme}+${encodeAuthority(resource.authority)}.${webviewRootResourceAuthority}`,
		path: resource.path,
		fragment: resource.fragment,
		query: resource.query,
	});
}

function encodeAuthority(authority: string): string {
	return authority.replace(/./g, char => {
		const code = char.charCodeAt(0);
		if (
			(code >= CharCode.a && code <= CharCode.z)
			|| (code >= CharCode.A && code <= CharCode.Z)
			|| (code >= CharCode.Digit0 && code <= CharCode.Digit9)
		) {
			return char;
		}
		return '-' + code.toString(16).padStart(4, '0');
	});
}

export function decodeAuthority(authority: string) {
	return authority.replace(/-([0-9a-f]{4})/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webview/electron-browser/webview.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/webview/electron-browser/webview.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerAction2 } from '../../../../platform/actions/common/actions.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IWebviewService } from '../browser/webview.js';
import * as webviewCommands from './webviewCommands.js';
import { ElectronWebviewService } from './webviewService.js';

registerSingleton(IWebviewService, ElectronWebviewService, InstantiationType.Delayed);

registerAction2(webviewCommands.OpenWebviewDeveloperToolsAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webview/electron-browser/webviewCommands.ts]---
Location: vscode-main/src/vs/workbench/contrib/webview/electron-browser/webviewCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { getActiveWindow } from '../../../../base/browser/dom.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { Action2 } from '../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';

export class OpenWebviewDeveloperToolsAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.webview.openDeveloperTools',
			title: nls.localize2('openToolsLabel', "Open Webview Developer Tools"),
			category: Categories.Developer,
			metadata: {
				description: nls.localize('openToolsDescription', "Opens Developer Tools for active webviews")
			},
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const nativeHostService = accessor.get(INativeHostService);

		// eslint-disable-next-line no-restricted-syntax
		const iframeWebviewElements = getActiveWindow().document.querySelectorAll('iframe.webview.ready');
		if (iframeWebviewElements.length) {
			console.info(nls.localize('iframeWebviewAlert', "Using standard dev tools to debug iframe based webview"));
			nativeHostService.openDevTools();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webview/electron-browser/webviewElement.ts]---
Location: vscode-main/src/vs/workbench/contrib/webview/electron-browser/webviewElement.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Delayer } from '../../../../base/common/async.js';
import { VSBuffer, VSBufferReadableStream } from '../../../../base/common/buffer.js';
import { Schemas } from '../../../../base/common/network.js';
import { consumeStream } from '../../../../base/common/stream.js';
import { ProxyChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IMainProcessService } from '../../../../platform/ipc/common/mainProcessService.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IRemoteAuthorityResolverService } from '../../../../platform/remote/common/remoteAuthorityResolver.js';
import { ITunnelService } from '../../../../platform/tunnel/common/tunnel.js';
import { FindInFrameOptions, IWebviewManagerService } from '../../../../platform/webview/common/webviewManagerService.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { WebviewThemeDataProvider } from '../browser/themeing.js';
import { WebviewInitInfo } from '../browser/webview.js';
import { WebviewElement } from '../browser/webviewElement.js';
import { WindowIgnoreMenuShortcutsManager } from './windowIgnoreMenuShortcutsManager.js';

/**
 * Webview backed by an iframe but that uses Electron APIs to power the webview.
 */
export class ElectronWebviewElement extends WebviewElement {

	private readonly _webviewKeyboardHandler: WindowIgnoreMenuShortcutsManager;

	private _findStarted: boolean = false;
	private _cachedHtmlContent: string | undefined;

	private readonly _webviewMainService: IWebviewManagerService;
	private readonly _iframeDelayer = this._register(new Delayer<void>(200));

	protected override get platform() { return 'electron'; }

	constructor(
		initInfo: WebviewInitInfo,
		webviewThemeDataProvider: WebviewThemeDataProvider,
		@IContextMenuService contextMenuService: IContextMenuService,
		@ITunnelService tunnelService: ITunnelService,
		@IFileService fileService: IFileService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IRemoteAuthorityResolverService remoteAuthorityResolverService: IRemoteAuthorityResolverService,
		@ILogService logService: ILogService,
		@IConfigurationService configurationService: IConfigurationService,
		@IMainProcessService mainProcessService: IMainProcessService,
		@INotificationService notificationService: INotificationService,
		@INativeHostService private readonly _nativeHostService: INativeHostService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IAccessibilityService accessibilityService: IAccessibilityService,
	) {
		super(initInfo, webviewThemeDataProvider,
			configurationService, contextMenuService, notificationService, environmentService,
			fileService, logService, remoteAuthorityResolverService, tunnelService, instantiationService, accessibilityService);

		this._webviewKeyboardHandler = new WindowIgnoreMenuShortcutsManager(configurationService, mainProcessService, _nativeHostService);

		this._webviewMainService = ProxyChannel.toService<IWebviewManagerService>(mainProcessService.getChannel('webview'));

		if (initInfo.options.enableFindWidget) {
			this._register(this.onDidHtmlChange((newContent) => {
				if (this._findStarted && this._cachedHtmlContent !== newContent) {
					this.stopFind(false);
					this._cachedHtmlContent = newContent;
				}
			}));

			this._register(this._webviewMainService.onFoundInFrame((result) => {
				this._hasFindResult.fire(result.matches > 0);
			}));
		}
	}

	override dispose(): void {
		// Make sure keyboard handler knows it closed (#71800)
		this._webviewKeyboardHandler.didBlur();

		super.dispose();
	}

	protected override webviewContentEndpoint(iframeId: string): string {
		return `${Schemas.vscodeWebview}://${iframeId}`;
	}

	protected override streamToBuffer(stream: VSBufferReadableStream): Promise<ArrayBufferLike> {
		// Join buffers from stream without using the Node.js backing pool.
		// This lets us transfer the resulting buffer to the webview.
		return consumeStream<VSBuffer, ArrayBufferLike>(stream, (buffers: readonly VSBuffer[]) => {
			const totalLength = buffers.reduce((prev, curr) => prev + curr.byteLength, 0);
			const ret = new ArrayBuffer(totalLength);
			const view = new Uint8Array(ret);
			let offset = 0;
			for (const element of buffers) {
				view.set(element.buffer, offset);
				offset += element.byteLength;
			}
			return ret;
		});
	}

	/**
	 * Webviews expose a stateful find API.
	 * Successive calls to find will move forward or backward through onFindResults
	 * depending on the supplied options.
	 *
	 * @param value The string to search for. Empty strings are ignored.
	 */
	public override find(value: string, previous: boolean): void {
		if (!this.element) {
			return;
		}

		if (!this._findStarted) {
			this.updateFind(value);
		} else {
			// continuing the find, so set findNext to false
			const options: FindInFrameOptions = { forward: !previous, findNext: false, matchCase: false };
			this._webviewMainService.findInFrame({ windowId: this._nativeHostService.windowId }, this.id, value, options);
		}
	}

	public override updateFind(value: string) {
		if (!value || !this.element) {
			return;
		}

		// FindNext must be true for a first request
		const options: FindInFrameOptions = {
			forward: true,
			findNext: true,
			matchCase: false
		};

		this._iframeDelayer.trigger(() => {
			this._findStarted = true;
			this._webviewMainService.findInFrame({ windowId: this._nativeHostService.windowId }, this.id, value, options);
		});
	}

	public override stopFind(keepSelection?: boolean): void {
		if (!this.element) {
			return;
		}
		this._iframeDelayer.cancel();
		this._findStarted = false;
		this._webviewMainService.stopFindInFrame({ windowId: this._nativeHostService.windowId }, this.id, {
			keepSelection
		});
		this._onDidStopFind.fire();
	}

	protected override handleFocusChange(isFocused: boolean): void {
		super.handleFocusChange(isFocused);
		if (isFocused) {
			this._webviewKeyboardHandler.didFocus();
		} else {
			this._webviewKeyboardHandler.didBlur();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webview/electron-browser/webviewService.ts]---
Location: vscode-main/src/vs/workbench/contrib/webview/electron-browser/webviewService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWebviewElement, WebviewInitInfo } from '../browser/webview.js';
import { WebviewService } from '../browser/webviewService.js';
import { ElectronWebviewElement } from './webviewElement.js';

export class ElectronWebviewService extends WebviewService {

	override createWebviewElement(initInfo: WebviewInitInfo): IWebviewElement {
		const webview = this._instantiationService.createInstance(ElectronWebviewElement, initInfo, this._webviewThemeDataProvider);
		this.registerNewWebview(webview);
		return webview;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webview/electron-browser/windowIgnoreMenuShortcutsManager.ts]---
Location: vscode-main/src/vs/workbench/contrib/webview/electron-browser/windowIgnoreMenuShortcutsManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isMacintosh } from '../../../../base/common/platform.js';
import { ProxyChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IMainProcessService } from '../../../../platform/ipc/common/mainProcessService.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { IWebviewManagerService } from '../../../../platform/webview/common/webviewManagerService.js';
import { hasNativeTitlebar } from '../../../../platform/window/common/window.js';

export class WindowIgnoreMenuShortcutsManager {

	private readonly _isUsingNativeTitleBars: boolean;

	private readonly _webviewMainService: IWebviewManagerService;

	constructor(
		configurationService: IConfigurationService,
		mainProcessService: IMainProcessService,
		private readonly _nativeHostService: INativeHostService
	) {
		this._isUsingNativeTitleBars = hasNativeTitlebar(configurationService);

		this._webviewMainService = ProxyChannel.toService<IWebviewManagerService>(mainProcessService.getChannel('webview'));
	}

	public didFocus(): void {
		this.setIgnoreMenuShortcuts(true);
	}

	public didBlur(): void {
		this.setIgnoreMenuShortcuts(false);
	}

	private get _shouldToggleMenuShortcutsEnablement() {
		return isMacintosh || this._isUsingNativeTitleBars;
	}

	protected setIgnoreMenuShortcuts(value: boolean) {
		if (this._shouldToggleMenuShortcutsEnablement) {
			this._webviewMainService.setIgnoreMenuShortcuts({ windowId: this._nativeHostService.windowId }, value);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webviewPanel/browser/webviewCommands.ts]---
Location: vscode-main/src/vs/workbench/contrib/webviewPanel/browser/webviewCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import * as nls from '../../../../nls.js';
import { Action2, MenuId } from '../../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { IWebviewService, KEYBINDING_CONTEXT_WEBVIEW_FIND_WIDGET_ENABLED, KEYBINDING_CONTEXT_WEBVIEW_FIND_WIDGET_FOCUSED, KEYBINDING_CONTEXT_WEBVIEW_FIND_WIDGET_VISIBLE, IWebview } from '../../webview/browser/webview.js';
import { WebviewEditor } from './webviewEditor.js';
import { WebviewInput } from './webviewEditorInput.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';

const webviewActiveContextKeyExpr = ContextKeyExpr.and(ContextKeyExpr.equals('activeEditor', WebviewEditor.ID), EditorContextKeys.focus.toNegated() /* https://github.com/microsoft/vscode/issues/58668 */)!;

export class ShowWebViewEditorFindWidgetAction extends Action2 {
	public static readonly ID = 'editor.action.webvieweditor.showFind';
	public static readonly LABEL = nls.localize('editor.action.webvieweditor.showFind', "Show find");

	constructor() {
		super({
			id: ShowWebViewEditorFindWidgetAction.ID,
			title: ShowWebViewEditorFindWidgetAction.LABEL,
			keybinding: {
				when: ContextKeyExpr.and(webviewActiveContextKeyExpr, KEYBINDING_CONTEXT_WEBVIEW_FIND_WIDGET_ENABLED),
				primary: KeyMod.CtrlCmd | KeyCode.KeyF,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(accessor: ServicesAccessor): void {
		getActiveWebviewEditor(accessor)?.showFind();
	}
}

export class HideWebViewEditorFindCommand extends Action2 {
	public static readonly ID = 'editor.action.webvieweditor.hideFind';
	public static readonly LABEL = nls.localize('editor.action.webvieweditor.hideFind', "Stop find");

	constructor() {
		super({
			id: HideWebViewEditorFindCommand.ID,
			title: HideWebViewEditorFindCommand.LABEL,
			keybinding: {
				when: ContextKeyExpr.and(webviewActiveContextKeyExpr, KEYBINDING_CONTEXT_WEBVIEW_FIND_WIDGET_VISIBLE),
				primary: KeyCode.Escape,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(accessor: ServicesAccessor): void {
		getActiveWebviewEditor(accessor)?.hideFind();
	}
}

export class WebViewEditorFindNextCommand extends Action2 {
	public static readonly ID = 'editor.action.webvieweditor.findNext';
	public static readonly LABEL = nls.localize('editor.action.webvieweditor.findNext', 'Find next');

	constructor() {
		super({
			id: WebViewEditorFindNextCommand.ID,
			title: WebViewEditorFindNextCommand.LABEL,
			keybinding: {
				when: ContextKeyExpr.and(webviewActiveContextKeyExpr, KEYBINDING_CONTEXT_WEBVIEW_FIND_WIDGET_FOCUSED),
				primary: KeyCode.Enter,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(accessor: ServicesAccessor): void {
		getActiveWebviewEditor(accessor)?.runFindAction(false);
	}
}

export class WebViewEditorFindPreviousCommand extends Action2 {
	public static readonly ID = 'editor.action.webvieweditor.findPrevious';
	public static readonly LABEL = nls.localize('editor.action.webvieweditor.findPrevious', 'Find previous');

	constructor() {
		super({
			id: WebViewEditorFindPreviousCommand.ID,
			title: WebViewEditorFindPreviousCommand.LABEL,
			keybinding: {
				when: ContextKeyExpr.and(webviewActiveContextKeyExpr, KEYBINDING_CONTEXT_WEBVIEW_FIND_WIDGET_FOCUSED),
				primary: KeyMod.Shift | KeyCode.Enter,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(accessor: ServicesAccessor): void {
		getActiveWebviewEditor(accessor)?.runFindAction(true);
	}
}

export class ReloadWebviewAction extends Action2 {
	static readonly ID = 'workbench.action.webview.reloadWebviewAction';
	static readonly LABEL = nls.localize2('refreshWebviewLabel', "Reload Webviews");

	public constructor() {
		super({
			id: ReloadWebviewAction.ID,
			title: ReloadWebviewAction.LABEL,
			category: Categories.Developer,
			menu: [{
				id: MenuId.CommandPalette
			}]
		});
	}

	public async run(accessor: ServicesAccessor): Promise<void> {
		const webviewService = accessor.get(IWebviewService);
		for (const webview of webviewService.webviews) {
			webview.reload();
		}
	}
}

function getActiveWebviewEditor(accessor: ServicesAccessor): IWebview | undefined {
	const editorService = accessor.get(IEditorService);
	const activeEditor = editorService.activeEditor;
	return activeEditor instanceof WebviewInput ? activeEditor.webview : undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webviewPanel/browser/webviewEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/webviewPanel/browser/webviewEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../base/browser/dom.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { DisposableStore, IDisposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { isWeb } from '../../../../base/common/platform.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import * as nls from '../../../../nls.js';
import { IContextKeyService, IScopedContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { EditorPane } from '../../../browser/parts/editor/editorPane.js';
import { IEditorOpenContext } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IOverlayWebview } from '../../webview/browser/webview.js';
import { WebviewWindowDragMonitor } from '../../webview/browser/webviewWindowDragMonitor.js';
import { WebviewInput } from './webviewEditorInput.js';
import { IEditorGroup, IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IWorkbenchLayoutService, Parts } from '../../../services/layout/browser/layoutService.js';

/**
 * Tracks the id of the actively focused webview.
 */
export const CONTEXT_ACTIVE_WEBVIEW_PANEL_ID = new RawContextKey<string>('activeWebviewPanelId', '', {
	type: 'string',
	description: nls.localize('context.activeWebviewId', "The viewType of the currently active webview panel."),
});

export class WebviewEditor extends EditorPane {

	public static readonly ID = 'WebviewEditor';

	private _element?: HTMLElement;
	private _dimension?: DOM.Dimension;
	private _visible = false;
	private _isDisposed = false;

	private readonly _webviewVisibleDisposables = this._register(new DisposableStore());
	private readonly _onFocusWindowHandler = this._register(new MutableDisposable());

	private readonly _onDidFocusWebview = this._register(new Emitter<void>());
	public override get onDidFocus(): Event<any> { return this._onDidFocusWebview.event; }

	private readonly _scopedContextKeyService = this._register(new MutableDisposable<IScopedContextKeyService>());

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IEditorGroupsService private readonly _editorGroupsService: IEditorGroupsService,
		@IEditorService private readonly _editorService: IEditorService,
		@IWorkbenchLayoutService private readonly _workbenchLayoutService: IWorkbenchLayoutService,
		@IHostService private readonly _hostService: IHostService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
	) {
		super(WebviewEditor.ID, group, telemetryService, themeService, storageService);

		const part = _editorGroupsService.getPart(group);
		this._register(Event.any(part.onDidScroll, part.onDidAddGroup, part.onDidRemoveGroup, part.onDidMoveGroup)(() => {
			if (this.webview && this._visible) {
				this.synchronizeWebviewContainerDimensions(this.webview);
			}
		}));
	}

	private get webview(): IOverlayWebview | undefined {
		return this.input instanceof WebviewInput ? this.input.webview : undefined;
	}

	override get scopedContextKeyService(): IContextKeyService | undefined {
		return this._scopedContextKeyService.value;
	}

	protected createEditor(parent: HTMLElement): void {
		const element = document.createElement('div');
		this._element = element;
		this._element.id = `webview-editor-element-${generateUuid()}`;
		parent.appendChild(element);

		this._scopedContextKeyService.value = this._register(this._contextKeyService.createScoped(element));
	}

	public override dispose(): void {
		this._isDisposed = true;

		this._element?.remove();
		this._element = undefined;

		super.dispose();
	}

	public override layout(dimension: DOM.Dimension): void {
		this._dimension = dimension;
		if (this.webview && this._visible) {
			this.synchronizeWebviewContainerDimensions(this.webview, dimension);
		}
	}

	public override focus(): void {
		super.focus();
		if (!this._onFocusWindowHandler.value && !isWeb) {
			// Make sure we restore focus when switching back to a VS Code window
			this._onFocusWindowHandler.value = this._hostService.onDidChangeFocus(focused => {
				if (focused && this._editorService.activeEditorPane === this && this._workbenchLayoutService.hasFocus(Parts.EDITOR_PART)) {
					this.focus();
				}
			});
		}
		this.webview?.focus();
	}

	protected override setEditorVisible(visible: boolean): void {
		this._visible = visible;
		if (this.input instanceof WebviewInput && this.webview) {
			if (visible) {
				this.claimWebview(this.input);
			} else {
				this.webview.release(this);
			}
		}
		super.setEditorVisible(visible);
	}

	public override clearInput() {
		if (this.webview) {
			this.webview.release(this);
			this._webviewVisibleDisposables.clear();
		}

		super.clearInput();
	}

	public override async setInput(input: EditorInput, options: IEditorOptions, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		if (this.input && input.matches(this.input)) {
			return;
		}

		const alreadyOwnsWebview = input instanceof WebviewInput && input.webview === this.webview;
		if (this.webview && !alreadyOwnsWebview) {
			this.webview.release(this);
		}

		await super.setInput(input, options, context, token);
		await input.resolve();

		if (token.isCancellationRequested || this._isDisposed) {
			return;
		}

		if (input instanceof WebviewInput) {
			input.updateGroup(this.group.id);

			if (!alreadyOwnsWebview) {
				this.claimWebview(input);
			}
			if (this._dimension) {
				this.layout(this._dimension);
			}
		}
	}

	private claimWebview(input: WebviewInput): void {
		input.claim(this, this.window, this.scopedContextKeyService);

		if (this._element) {
			this._element.setAttribute('aria-flowto', input.webview.container.id);
			DOM.setParentFlowTo(input.webview.container, this._element);
		}

		this._webviewVisibleDisposables.clear();

		// Webviews are not part of the normal editor dom, so we have to register our own drag and drop handler on them.
		this._webviewVisibleDisposables.add(this._editorGroupsService.createEditorDropTarget(input.webview.container, {
			containsGroup: (group) => this.group.id === group.id
		}));

		this._webviewVisibleDisposables.add(new WebviewWindowDragMonitor(this.window, () => this.webview));

		this.synchronizeWebviewContainerDimensions(input.webview);
		this._webviewVisibleDisposables.add(this.trackFocus(input.webview));
	}

	private synchronizeWebviewContainerDimensions(webview: IOverlayWebview, dimension?: DOM.Dimension) {
		if (!this._element?.isConnected) {
			return;
		}

		const rootContainer = this._workbenchLayoutService.getContainer(this.window, Parts.EDITOR_PART);
		webview.layoutWebviewOverElement(this._element.parentElement!, dimension, rootContainer);
	}

	private trackFocus(webview: IOverlayWebview): IDisposable {
		const store = new DisposableStore();

		// Track focus in webview content
		const webviewContentFocusTracker = DOM.trackFocus(webview.container);
		store.add(webviewContentFocusTracker);
		store.add(webviewContentFocusTracker.onDidFocus(() => this._onDidFocusWebview.fire()));

		// Track focus in webview element
		store.add(webview.onDidFocus(() => this._onDidFocusWebview.fire()));

		return store;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webviewPanel/browser/webviewEditorInput.ts]---
Location: vscode-main/src/vs/workbench/contrib/webviewPanel/browser/webviewEditorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeWindow } from '../../../../base/browser/window.js';
import { Schemas } from '../../../../base/common/network.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { isDark } from '../../../../platform/theme/common/theme.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { EditorInputCapabilities, GroupIdentifier, IUntypedEditorInput, Verbosity } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IOverlayWebview } from '../../webview/browser/webview.js';

export interface WebviewInputInitInfo {
	readonly viewType: string;
	readonly providedId: string | undefined;
	readonly name: string;
	readonly iconPath: WebviewIconPath | undefined;
}

export class WebviewInput extends EditorInput {

	public static typeId = 'workbench.editors.webviewInput';

	public override get typeId(): string {
		return WebviewInput.typeId;
	}

	public override get editorId(): string {
		return this.viewType;
	}

	public override get capabilities(): EditorInputCapabilities {
		return EditorInputCapabilities.Readonly | EditorInputCapabilities.Singleton | EditorInputCapabilities.CanDropIntoEditor;
	}

	private readonly _resourceId = generateUuid();

	private _webviewTitle: string;
	private _iconPath?: WebviewIconPath;
	private _group?: GroupIdentifier;

	private _webview: IOverlayWebview;

	private _hasTransfered = false;

	get resource() {
		return URI.from({
			scheme: Schemas.webviewPanel,
			path: `webview-panel/webview-${this.providerId}-${this._resourceId}`
		});
	}

	public readonly viewType: string;
	public readonly providerId: string | undefined;

	constructor(
		init: WebviewInputInitInfo,
		webview: IOverlayWebview,
		@IThemeService private readonly _themeService: IThemeService,
	) {
		super();

		this.viewType = init.viewType;
		this.providerId = init.providedId;

		this._webviewTitle = init.name;
		this._iconPath = init.iconPath;
		this._webview = webview;

		this._register(_themeService.onDidColorThemeChange(() => {
			// Potentially update icon
			this._onDidChangeLabel.fire();
		}));
	}

	override dispose() {
		if (!this.isDisposed()) {
			if (!this._hasTransfered) {
				this._webview?.dispose();
			}
		}
		super.dispose();
	}

	public override getName(): string {
		return this._webviewTitle;
	}

	public override getTitle(_verbosity?: Verbosity): string {
		return this.getName();
	}

	public override getDescription(): string | undefined {
		return undefined;
	}

	public setWebviewTitle(value: string): void {
		this._webviewTitle = value;
		this.webview.setTitle(value);
		this._onDidChangeLabel.fire();
	}

	public getWebviewTitle(): string | undefined {
		return this._webviewTitle;
	}

	public get webview(): IOverlayWebview {
		return this._webview;
	}

	public get extension() {
		return this.webview.extension;
	}

	override getIcon(): URI | ThemeIcon | undefined {
		if (!this._iconPath) {
			return;
		}

		if (ThemeIcon.isThemeIcon(this._iconPath)) {
			return this._iconPath;
		}

		return isDark(this._themeService.getColorTheme().type)
			? this._iconPath.dark
			: (this._iconPath.light ?? this._iconPath.dark);
	}

	public get iconPath() {
		return this._iconPath;
	}

	public set iconPath(value: WebviewIconPath | undefined) {
		this._iconPath = value;
		this._onDidChangeLabel.fire();
	}

	public override matches(other: EditorInput | IUntypedEditorInput): boolean {
		return super.matches(other) || other === this;
	}

	public get group(): GroupIdentifier | undefined {
		return this._group;
	}

	public updateGroup(group: GroupIdentifier): void {
		this._group = group;
	}

	protected transfer(other: WebviewInput): WebviewInput | undefined {
		if (this._hasTransfered) {
			return undefined;
		}
		this._hasTransfered = true;
		other._webview = this._webview;
		return other;
	}

	public claim(claimant: unknown, targetWindow: CodeWindow, scopedContextKeyService: IContextKeyService | undefined): void {
		return this._webview.claim(claimant, targetWindow, scopedContextKeyService);
	}
}
export type WebviewIconPath = ThemeIcon | {
	readonly light: URI;
	readonly dark: URI;
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webviewPanel/browser/webviewEditorInputSerializer.ts]---
Location: vscode-main/src/vs/workbench/contrib/webviewPanel/browser/webviewEditorInputSerializer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI, UriComponents } from '../../../../base/common/uri.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IEditorSerializer } from '../../../common/editor.js';
import { WebviewContentOptions, WebviewExtensionDescription, WebviewOptions } from '../../webview/browser/webview.js';
import { WebviewIconPath, WebviewInput } from './webviewEditorInput.js';
import { IWebviewWorkbenchService } from './webviewWorkbenchService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';

export type SerializedWebviewOptions = WebviewOptions & WebviewContentOptions;

type SerializedIconPath = ThemeIcon | {
	light: string | UriComponents;
	dark: string | UriComponents;
};

export interface SerializedWebview {
	readonly origin: string | undefined;
	readonly viewType: string;
	readonly providedId: string | undefined;
	readonly title: string;
	readonly options: SerializedWebviewOptions;
	readonly extensionLocation: UriComponents | undefined;
	readonly extensionId: string | undefined;
	readonly state: any;
	readonly iconPath: SerializedIconPath | undefined;
	readonly group?: number;
}

export interface DeserializedWebview {
	readonly origin: string | undefined;
	readonly viewType: string;
	readonly providedId: string | undefined;
	readonly title: string;
	readonly webviewOptions: WebviewOptions;
	readonly contentOptions: WebviewContentOptions;
	readonly extension: WebviewExtensionDescription | undefined;
	readonly state: any;
	readonly iconPath: WebviewIconPath | undefined;
	readonly group?: number;
}

export class WebviewEditorInputSerializer implements IEditorSerializer {

	public static readonly ID = WebviewInput.typeId;

	public constructor(
		@IWebviewWorkbenchService private readonly _webviewWorkbenchService: IWebviewWorkbenchService
	) { }

	public canSerialize(input: WebviewInput): boolean {
		return this._webviewWorkbenchService.shouldPersist(input);
	}

	public serialize(input: WebviewInput): string | undefined {
		if (!this.canSerialize(input)) {
			return undefined;
		}

		const data = this.toJson(input);
		try {
			return JSON.stringify(data);
		} catch {
			return undefined;
		}
	}

	public deserialize(
		_instantiationService: IInstantiationService,
		serializedEditorInput: string
	): WebviewInput {
		const data = this.fromJson(JSON.parse(serializedEditorInput));
		return this._webviewWorkbenchService.openRevivedWebview({
			webviewInitInfo: {
				providedViewType: data.providedId,
				origin: data.origin,
				title: data.title,
				options: data.webviewOptions,
				contentOptions: data.contentOptions,
				extension: data.extension,
			},
			viewType: data.viewType,
			title: data.title,
			iconPath: data.iconPath,
			state: data.state,
			group: data.group
		});
	}

	protected fromJson(data: SerializedWebview): DeserializedWebview {
		return {
			...data,
			extension: reviveWebviewExtensionDescription(data.extensionId, data.extensionLocation),
			iconPath: reviveWebviewIconPath(data.iconPath),
			state: reviveState(data.state),
			webviewOptions: restoreWebviewOptions(data.options),
			contentOptions: restoreWebviewContentOptions(data.options),
		};
	}

	protected toJson(input: WebviewInput): SerializedWebview {
		return {
			origin: input.webview.origin,
			viewType: input.viewType,
			providedId: input.providerId,
			title: input.getName(),
			options: { ...input.webview.options, ...input.webview.contentOptions },
			extensionLocation: input.extension?.location,
			extensionId: input.extension?.id.value,
			state: input.webview.state,
			iconPath: input.iconPath
				? ThemeIcon.isThemeIcon(input.iconPath)
					? input.iconPath
					: { light: input.iconPath.light, dark: input.iconPath.dark, }
				: undefined,
			group: input.group
		};
	}
}

export function reviveWebviewExtensionDescription(
	extensionId: string | undefined,
	extensionLocation: UriComponents | undefined,
): WebviewExtensionDescription | undefined {
	if (!extensionId) {
		return undefined;
	}

	const location = reviveUri(extensionLocation);
	if (!location) {
		return undefined;
	}

	return {
		id: new ExtensionIdentifier(extensionId),
		location,
	};
}

export function reviveWebviewIconPath(data: SerializedIconPath | undefined): WebviewIconPath | undefined {
	if (!data) {
		return undefined;
	}

	if (ThemeIcon.isThemeIcon(data)) {
		return data;
	}

	const light = reviveUri(data.light);
	const dark = reviveUri(data.dark);
	return light && dark ? { light, dark } : undefined;
}

function reviveUri(data: string | UriComponents): URI;
function reviveUri(data: string | UriComponents | undefined): URI | undefined;
function reviveUri(data: string | UriComponents | undefined): URI | undefined {
	if (!data) {
		return undefined;
	}

	try {
		if (typeof data === 'string') {
			return URI.parse(data);
		}
		return URI.from(data);
	} catch {
		return undefined;
	}
}

function reviveState(state: unknown | undefined): undefined | string {
	return typeof state === 'string' ? state : undefined;
}

export function restoreWebviewOptions(options: SerializedWebviewOptions): WebviewOptions {
	return options;
}

export function restoreWebviewContentOptions(options: SerializedWebviewOptions): WebviewContentOptions {
	return {
		...options,
		localResourceRoots: options.localResourceRoots?.map(uri => reviveUri(uri)),
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webviewPanel/browser/webviewPanel.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/webviewPanel/browser/webviewPanel.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { registerAction2 } from '../../../../platform/actions/common/actions.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { EditorPaneDescriptor, IEditorPaneRegistry } from '../../../browser/editor.js';
import { IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { EditorExtensions, IEditorFactoryRegistry } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IEditorGroup, IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { HideWebViewEditorFindCommand, ReloadWebviewAction, ShowWebViewEditorFindWidgetAction, WebViewEditorFindNextCommand, WebViewEditorFindPreviousCommand } from './webviewCommands.js';
import { WebviewEditor } from './webviewEditor.js';
import { WebviewInput } from './webviewEditorInput.js';
import { WebviewEditorInputSerializer } from './webviewEditorInputSerializer.js';
import { IWebviewWorkbenchService, WebviewEditorService } from './webviewWorkbenchService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';

(Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane)).registerEditorPane(EditorPaneDescriptor.create(
	WebviewEditor,
	WebviewEditor.ID,
	localize('webview.editor.label', "webview editor")),
	[new SyncDescriptor(WebviewInput)]);

class WebviewPanelContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.webviewPanel';

	constructor(
		@IEditorService editorService: IEditorService,
		@IEditorGroupsService private readonly editorGroupService: IEditorGroupsService
	) {
		super();

		this._register(editorService.onWillOpenEditor(e => {
			const group = editorGroupService.getGroup(e.groupId);
			if (group) {
				this.onEditorOpening(e.editor, group);
			}
		}));
	}

	private onEditorOpening(
		editor: EditorInput,
		group: IEditorGroup
	): void {
		if (!(editor instanceof WebviewInput) || editor.typeId !== WebviewInput.typeId) {
			return;
		}

		if (group.contains(editor)) {
			return;
		}

		let previousGroup: IEditorGroup | undefined;
		const groups = this.editorGroupService.groups;
		for (const group of groups) {
			if (group.contains(editor)) {
				previousGroup = group;
				break;
			}
		}

		if (!previousGroup) {
			return;
		}

		previousGroup.closeEditor(editor);
	}
}

registerWorkbenchContribution2(WebviewPanelContribution.ID, WebviewPanelContribution, WorkbenchPhase.BlockStartup);

Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(
	WebviewEditorInputSerializer.ID,
	WebviewEditorInputSerializer);

registerSingleton(IWebviewWorkbenchService, WebviewEditorService, InstantiationType.Delayed);

registerAction2(ShowWebViewEditorFindWidgetAction);
registerAction2(HideWebViewEditorFindCommand);
registerAction2(WebViewEditorFindNextCommand);
registerAction2(WebViewEditorFindPreviousCommand);
registerAction2(ReloadWebviewAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webviewPanel/browser/webviewWorkbenchService.ts]---
Location: vscode-main/src/vs/workbench/contrib/webviewPanel/browser/webviewWorkbenchService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancelablePromise, createCancelablePromise, DeferredPromise } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { memoize } from '../../../../base/common/decorators.js';
import { isCancellationError } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { combinedDisposable, Disposable, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { EditorActivation } from '../../../../platform/editor/common/editor.js';
import { createDecorator, IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { GroupIdentifier } from '../../../common/editor.js';
import { DiffEditorInput } from '../../../common/editor/diffEditorInput.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IEditorGroup, IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { ACTIVE_GROUP_TYPE, IEditorService, SIDE_GROUP_TYPE } from '../../../services/editor/common/editorService.js';
import { IOverlayWebview, IWebviewService, WebviewInitInfo } from '../../webview/browser/webview.js';
import { CONTEXT_ACTIVE_WEBVIEW_PANEL_ID } from './webviewEditor.js';
import { WebviewIconPath, WebviewInput, WebviewInputInitInfo } from './webviewEditorInput.js';

export interface IWebViewShowOptions {
	readonly group?: IEditorGroup | GroupIdentifier | ACTIVE_GROUP_TYPE | SIDE_GROUP_TYPE;
	readonly preserveFocus?: boolean;
}

export const IWebviewWorkbenchService = createDecorator<IWebviewWorkbenchService>('webviewEditorService');

/**
 * Service responsible for showing and managing webview editors in the workbench.
 */
export interface IWebviewWorkbenchService {
	readonly _serviceBrand: undefined;

	/**
	 * Event fired when focus switches to a different webview editor.
	 *
	 * Fires `undefined` if focus switches to a non-webview editor.
	 */
	readonly onDidChangeActiveWebviewEditor: Event<WebviewInput | undefined>;

	/**
	 * Create a new webview editor and open it in the workbench.
	 */
	openWebview(
		webviewInitInfo: WebviewInitInfo,
		viewType: string,
		title: string,
		iconPath: WebviewIconPath | undefined,
		showOptions: IWebViewShowOptions,
	): WebviewInput;

	/**
	 * Open a webview that is being restored from serialization.
	 */
	openRevivedWebview(options: {
		webviewInitInfo: WebviewInitInfo;
		viewType: string;
		title: string;
		iconPath: WebviewIconPath | undefined;
		state: any;
		group: number | undefined;
	}): WebviewInput;

	/**
	 * Reveal an already opened webview editor in the workbench.
	 */
	revealWebview(
		webview: WebviewInput,
		group: IEditorGroup | GroupIdentifier | ACTIVE_GROUP_TYPE | SIDE_GROUP_TYPE,
		preserveFocus: boolean
	): void;

	/**
	 * Register a new {@link WebviewResolver}.
	 *
	 * If there are any webviews awaiting revival that this resolver can handle, they will be resolved by it.
	 */
	registerResolver(resolver: WebviewResolver): IDisposable;

	/**
	 * Check if a webview should be serialized across window reloads.
	 */
	shouldPersist(input: WebviewInput): boolean;

	/**
	 * Try to resolve a webview. This will block until a resolver is registered for the webview.
	 */
	resolveWebview(webview: WebviewInput, token: CancellationToken): Promise<void>;
}

/**
 * Handles filling in the content of webview before it can be shown to the user.
 */
interface WebviewResolver {
	/**
	 * Returns true if the resolver can resolve the given webview.
	 */
	canResolve(webview: WebviewInput): boolean;

	/**
	 * Resolves the webview.
	 */
	resolveWebview(webview: WebviewInput, token: CancellationToken): Promise<void>;
}

function canRevive(reviver: WebviewResolver, webview: WebviewInput): boolean {
	return reviver.canResolve(webview);
}

export class LazilyResolvedWebviewEditorInput extends WebviewInput {

	private _resolved = false;
	private _resolvePromise?: CancelablePromise<void>;

	constructor(
		init: WebviewInputInitInfo,
		webview: IOverlayWebview,
		@IThemeService themeService: IThemeService,
		@IWebviewWorkbenchService private readonly _webviewWorkbenchService: IWebviewWorkbenchService,
	) {
		super(init, webview, themeService);
	}

	override dispose() {
		super.dispose();
		this._resolvePromise?.cancel();
		this._resolvePromise = undefined;
	}

	@memoize
	public override async resolve() {
		if (!this._resolved) {
			this._resolved = true;
			this._resolvePromise = createCancelablePromise(token => this._webviewWorkbenchService.resolveWebview(this, token));
			try {
				await this._resolvePromise;
			} catch (e) {
				if (!isCancellationError(e)) {
					throw e;
				}
			}
		}
		return super.resolve();
	}

	protected override transfer(other: LazilyResolvedWebviewEditorInput): WebviewInput | undefined {
		if (!super.transfer(other)) {
			return;
		}

		other._resolved = this._resolved;
		return other;
	}
}


class RevivalPool {
	private _awaitingRevival: Array<{
		readonly input: WebviewInput;
		readonly promise: DeferredPromise<void>;
		readonly disposable: IDisposable;
	}> = [];

	public enqueueForRestoration(input: WebviewInput, token: CancellationToken): Promise<void> {
		const promise = new DeferredPromise<void>();

		const remove = () => {
			const index = this._awaitingRevival.findIndex(entry => input === entry.input);
			if (index >= 0) {
				this._awaitingRevival.splice(index, 1);
			}
		};

		const disposable = combinedDisposable(
			input.webview.onDidDispose(remove),
			token.onCancellationRequested(() => {
				remove();
				promise.cancel();
			}),
		);

		this._awaitingRevival.push({ input, promise, disposable });

		return promise.p;
	}

	public reviveFor(reviver: WebviewResolver, token: CancellationToken) {
		const toRevive = this._awaitingRevival.filter(({ input }) => canRevive(reviver, input));
		this._awaitingRevival = this._awaitingRevival.filter(({ input }) => !canRevive(reviver, input));

		for (const { input, promise: resolve, disposable } of toRevive) {
			reviver.resolveWebview(input, token).then(x => resolve.complete(x), err => resolve.error(err)).finally(() => {
				disposable.dispose();
			});
		}
	}
}


export class WebviewEditorService extends Disposable implements IWebviewWorkbenchService {
	declare readonly _serviceBrand: undefined;

	private readonly _revivers = new Set<WebviewResolver>();
	private readonly _revivalPool = new RevivalPool();

	constructor(
		@IEditorGroupsService editorGroupsService: IEditorGroupsService,
		@IEditorService private readonly _editorService: IEditorService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IWebviewService private readonly _webviewService: IWebviewService,
	) {
		super();

		this._register(editorGroupsService.registerContextKeyProvider({
			contextKey: CONTEXT_ACTIVE_WEBVIEW_PANEL_ID,
			getGroupContextKeyValue: (group) => this.getWebviewId(group.activeEditor),
		}));

		this._register(_editorService.onDidActiveEditorChange(() => {
			this.updateActiveWebview();
		}));

		// The user may have switched focus between two sides of a diff editor
		this._register(_webviewService.onDidChangeActiveWebview(() => {
			this.updateActiveWebview();
		}));

		this.updateActiveWebview();
	}

	private _activeWebview: WebviewInput | undefined;

	private readonly _onDidChangeActiveWebviewEditor = this._register(new Emitter<WebviewInput | undefined>());
	public readonly onDidChangeActiveWebviewEditor = this._onDidChangeActiveWebviewEditor.event;

	private getWebviewId(input: EditorInput | null): string {
		let webviewInput: WebviewInput | undefined;
		if (input instanceof WebviewInput) {
			webviewInput = input;
		} else if (input instanceof DiffEditorInput) {
			if (input.primary instanceof WebviewInput) {
				webviewInput = input.primary;
			} else if (input.secondary instanceof WebviewInput) {
				webviewInput = input.secondary;
			}
		}

		return webviewInput?.webview.providedViewType ?? '';
	}

	private updateActiveWebview() {
		const activeInput = this._editorService.activeEditor;

		let newActiveWebview: WebviewInput | undefined;
		if (activeInput instanceof WebviewInput) {
			newActiveWebview = activeInput;
		} else if (activeInput instanceof DiffEditorInput) {
			if (activeInput.primary instanceof WebviewInput && activeInput.primary.webview === this._webviewService.activeWebview) {
				newActiveWebview = activeInput.primary;
			} else if (activeInput.secondary instanceof WebviewInput && activeInput.secondary.webview === this._webviewService.activeWebview) {
				newActiveWebview = activeInput.secondary;
			}
		}
		if (newActiveWebview !== this._activeWebview) {
			this._activeWebview = newActiveWebview;
			this._onDidChangeActiveWebviewEditor.fire(newActiveWebview);
		}
	}

	public openWebview(
		webviewInitInfo: WebviewInitInfo,
		viewType: string,
		title: string,
		iconPath: WebviewIconPath | undefined,
		showOptions: IWebViewShowOptions,
	): WebviewInput {
		const webview = this._webviewService.createWebviewOverlay(webviewInitInfo);
		const webviewInput = this._instantiationService.createInstance(WebviewInput, { viewType, name: title, providedId: webviewInitInfo.providedViewType, iconPath }, webview);
		this._editorService.openEditor(webviewInput, {
			pinned: true,
			preserveFocus: showOptions.preserveFocus,
			// preserve pre 1.38 behaviour to not make group active when preserveFocus: true
			// but make sure to restore the editor to fix https://github.com/microsoft/vscode/issues/79633
			activation: showOptions.preserveFocus ? EditorActivation.RESTORE : undefined
		}, showOptions.group);
		return webviewInput;
	}

	public revealWebview(
		webview: WebviewInput,
		group: IEditorGroup | GroupIdentifier | ACTIVE_GROUP_TYPE | SIDE_GROUP_TYPE,
		preserveFocus: boolean
	): void {
		const topLevelEditor = this.findTopLevelEditorForWebview(webview);

		this._editorService.openEditor(topLevelEditor, {
			preserveFocus,
			// preserve pre 1.38 behaviour to not make group active when preserveFocus: true
			// but make sure to restore the editor to fix https://github.com/microsoft/vscode/issues/79633
			activation: preserveFocus ? EditorActivation.RESTORE : undefined
		}, group);
	}

	private findTopLevelEditorForWebview(webview: WebviewInput): EditorInput {
		for (const editor of this._editorService.editors) {
			if (editor === webview) {
				return editor;
			}
			if (editor instanceof DiffEditorInput) {
				if (webview === editor.primary || webview === editor.secondary) {
					return editor;
				}
			}
		}
		return webview;
	}

	public openRevivedWebview(options: {
		webviewInitInfo: WebviewInitInfo;
		viewType: string;
		title: string;
		iconPath: WebviewIconPath | undefined;
		state: any;
		group: number | undefined;
	}): WebviewInput {
		const webview = this._webviewService.createWebviewOverlay(options.webviewInitInfo);
		webview.state = options.state;

		const webviewInput = this._instantiationService.createInstance(LazilyResolvedWebviewEditorInput, {
			viewType: options.viewType,
			providedId: options.webviewInitInfo.providedViewType,
			name: options.title,
			iconPath: options.iconPath
		}, webview);
		webviewInput.iconPath = options.iconPath;

		if (typeof options.group === 'number') {
			webviewInput.updateGroup(options.group);
		}
		return webviewInput;
	}

	public registerResolver(reviver: WebviewResolver): IDisposable {
		this._revivers.add(reviver);

		const cts = new CancellationTokenSource();
		this._revivalPool.reviveFor(reviver, cts.token);

		return toDisposable(() => {
			this._revivers.delete(reviver);
			cts.dispose(true);
		});
	}

	public shouldPersist(webview: WebviewInput): boolean {
		// Revived webviews may not have an actively registered reviver but we still want to persist them
		// since a reviver should exist when it is actually needed.
		if (webview instanceof LazilyResolvedWebviewEditorInput) {
			return true;
		}

		return Iterable.some(this._revivers.values(), reviver => canRevive(reviver, webview));
	}

	private async tryRevive(webview: WebviewInput, token: CancellationToken): Promise<boolean> {
		for (const reviver of this._revivers.values()) {
			if (canRevive(reviver, webview)) {
				await reviver.resolveWebview(webview, token);
				return true;
			}
		}
		return false;
	}

	public async resolveWebview(webview: WebviewInput, token: CancellationToken): Promise<void> {
		const didRevive = await this.tryRevive(webview, token);
		if (!didRevive && !token.isCancellationRequested) {
			// A reviver may not be registered yet. Put into pool and resolve promise when we can revive
			return this._revivalPool.enqueueForRestoration(webview, token);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webviewView/browser/webviewView.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/webviewView/browser/webviewView.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IWebviewViewService, WebviewViewService } from './webviewViewService.js';

registerSingleton(IWebviewViewService, WebviewViewService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webviewView/browser/webviewViewPane.ts]---
Location: vscode-main/src/vs/workbench/contrib/webviewView/browser/webviewViewPane.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { addDisposableListener, Dimension, EventType, findParentWithClass, getWindow } from '../../../../base/browser/dom.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Emitter } from '../../../../base/common/event.js';
import { DisposableStore, IDisposable, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IProgressService } from '../../../../platform/progress/common/progress.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ViewPane, ViewPaneShowActions } from '../../../browser/parts/views/viewPane.js';
import { IViewletViewOptions } from '../../../browser/parts/views/viewsViewlet.js';
import { Memento } from '../../../common/memento.js';
import { IViewBadge, IViewDescriptorService } from '../../../common/views.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { ExtensionKeyedWebviewOriginStore, IOverlayWebview, IWebviewService, WebviewContentPurpose } from '../../webview/browser/webview.js';
import { WebviewWindowDragMonitor } from '../../webview/browser/webviewWindowDragMonitor.js';
import { IWebviewViewService, WebviewView } from './webviewViewService.js';
import { IActivityService, NumberBadge } from '../../../services/activity/common/activity.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';

const storageKeys = {
	webviewState: 'webviewState',
} as const;

interface WebviewViewState {
	[storageKeys.webviewState]?: string | undefined;
}

export class WebviewViewPane extends ViewPane {

	private static _originStore?: ExtensionKeyedWebviewOriginStore;

	private static getOriginStore(storageService: IStorageService): ExtensionKeyedWebviewOriginStore {
		this._originStore ??= new ExtensionKeyedWebviewOriginStore('webviewViews.origins', storageService);
		return this._originStore;
	}

	private readonly _webview = this._register(new MutableDisposable<IOverlayWebview>());
	private readonly _webviewDisposables = this._register(new DisposableStore());
	private _activated = false;

	private _container?: HTMLElement;
	private _rootContainer?: HTMLElement;
	private _resizeObserver?: ResizeObserver;

	private readonly defaultTitle: string;
	private setTitle: string | undefined;

	private badge: IViewBadge | undefined;
	private readonly activity = this._register(new MutableDisposable<IDisposable>());

	private readonly memento: Memento<WebviewViewState>;
	private readonly viewState: WebviewViewState;
	private readonly extensionId?: ExtensionIdentifier;

	private _repositionTimeout?: Timeout;

	constructor(
		options: IViewletViewOptions,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IOpenerService openerService: IOpenerService,
		@IHoverService hoverService: IHoverService,
		@IThemeService themeService: IThemeService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IActivityService private readonly activityService: IActivityService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IProgressService private readonly progressService: IProgressService,
		@IStorageService private readonly storageService: IStorageService,
		@IViewsService private readonly viewService: IViewsService,
		@IWebviewService private readonly webviewService: IWebviewService,
		@IWebviewViewService private readonly webviewViewService: IWebviewViewService,
	) {
		super({ ...options, titleMenuId: MenuId.ViewTitle, showActions: ViewPaneShowActions.WhenExpanded }, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);
		this.extensionId = options.fromExtensionId;
		this.defaultTitle = this.title;

		this.memento = new Memento(`webviewView.${this.id}`, storageService);
		this.viewState = this.memento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);

		this._register(this.onDidChangeBodyVisibility(() => this.updateTreeVisibility()));

		this._register(this.webviewViewService.onNewResolverRegistered(e => {
			if (e.viewType === this.id) {
				// Potentially re-activate if we have a new resolver
				this.updateTreeVisibility();
			}
		}));

		this.updateTreeVisibility();
	}

	private readonly _onDidChangeVisibility = this._register(new Emitter<boolean>());
	readonly onDidChangeVisibility = this._onDidChangeVisibility.event;

	private readonly _onDispose = this._register(new Emitter<void>());
	readonly onDispose = this._onDispose.event;

	override dispose() {
		this._onDispose.fire();

		clearTimeout(this._repositionTimeout);

		super.dispose();
	}

	override focus(): void {
		super.focus();
		this._webview.value?.focus();
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);

		this._container = container;
		this._rootContainer = undefined;

		if (!this._resizeObserver) {
			this._resizeObserver = new ResizeObserver(() => {
				setTimeout(() => {
					this.layoutWebview();
				}, 0);
			});

			this._register(toDisposable(() => {
				this._resizeObserver?.disconnect();
			}));
			this._resizeObserver.observe(container);
		}
	}

	public override saveState() {
		if (this._webview.value) {
			this.viewState[storageKeys.webviewState] = this._webview.value.state;
		}

		this.memento.saveMemento();
		super.saveState();
	}

	protected override layoutBody(height: number, width: number): void {
		super.layoutBody(height, width);

		this.layoutWebview(new Dimension(width, height));
	}

	private updateTreeVisibility() {
		if (this.isBodyVisible()) {
			this.activate();
			this._webview.value?.claim(this, getWindow(this.element), undefined);
		} else {
			this._webview.value?.release(this);
		}
	}

	private activate() {
		if (this._activated) {
			return;
		}

		this._activated = true;

		const origin = this.extensionId ? WebviewViewPane.getOriginStore(this.storageService).getOrigin(this.id, this.extensionId) : undefined;
		const webview = this.webviewService.createWebviewOverlay({
			origin,
			providedViewType: this.id,
			title: this.title,
			options: { purpose: WebviewContentPurpose.WebviewView },
			contentOptions: {},
			extension: this.extensionId ? { id: this.extensionId } : undefined
		});
		webview.state = this.viewState[storageKeys.webviewState];
		this._webview.value = webview;

		if (this._container) {
			this.layoutWebview();
		}

		this._webviewDisposables.add(toDisposable(() => {
			this._webview.value?.release(this);
		}));

		this._webviewDisposables.add(webview.onDidUpdateState(() => {
			this.viewState[storageKeys.webviewState] = webview.state;
		}));

		// Re-dispatch all drag events back to the drop target to support view drag drop
		for (const event of [EventType.DRAG, EventType.DRAG_END, EventType.DRAG_ENTER, EventType.DRAG_LEAVE, EventType.DRAG_START]) {
			this._webviewDisposables.add(addDisposableListener(this._webview.value.container, event, e => {
				e.preventDefault();
				e.stopImmediatePropagation();
				this.dropTargetElement.dispatchEvent(new DragEvent(e.type, e));
			}));
		}

		this._webviewDisposables.add(new WebviewWindowDragMonitor(getWindow(this.element), () => this._webview.value));

		const source = this._webviewDisposables.add(new CancellationTokenSource());

		this.withProgress(async () => {
			await this.extensionService.activateByEvent(`onView:${this.id}`);

			const self = this;
			const webviewView: WebviewView = {
				webview,
				onDidChangeVisibility: this.onDidChangeBodyVisibility,
				onDispose: this.onDispose,

				get title(): string | undefined { return self.setTitle; },
				set title(value: string | undefined) { self.updateTitle(value); },

				get description(): string | undefined { return self.titleDescription; },
				set description(value: string | undefined) { self.updateTitleDescription(value); },

				get badge(): IViewBadge | undefined { return self.badge; },
				set badge(badge: IViewBadge | undefined) { self.updateBadge(badge); },

				dispose: () => {
					// Only reset and clear the webview itself. Don't dispose of the view container
					this._activated = false;
					this._webview.clear();
					this._webviewDisposables.clear();
				},

				show: (preserveFocus) => {
					this.viewService.openView(this.id, !preserveFocus);
				}
			};

			await this.webviewViewService.resolve(this.id, webviewView, source.token);
		});
	}

	protected override updateTitle(value: string | undefined) {
		this.setTitle = value;
		super.updateTitle(typeof value === 'string' ? value : this.defaultTitle);
	}

	protected updateBadge(badge: IViewBadge | undefined) {

		if (this.badge?.value === badge?.value &&
			this.badge?.tooltip === badge?.tooltip) {
			return;
		}

		this.badge = badge;
		if (badge) {
			const activity = {
				badge: new NumberBadge(badge.value, () => badge.tooltip),
				priority: 150
			};
			this.activity.value = this.activityService.showViewActivity(this.id, activity);
		}
	}

	private async withProgress(task: () => Promise<void>): Promise<void> {
		return this.progressService.withProgress({ location: this.id, delay: 500 }, task);
	}

	override onDidScrollRoot() {
		this.layoutWebview();
	}

	private doLayoutWebview(dimension?: Dimension) {
		const webviewEntry = this._webview.value;
		if (!this._container || !webviewEntry) {
			return;
		}

		if (!this._rootContainer || !this._rootContainer.isConnected) {
			this._rootContainer = this.findRootContainer(this._container);
		}

		webviewEntry.layoutWebviewOverElement(this._container, dimension, this._rootContainer);
	}

	private layoutWebview(dimension?: Dimension) {
		this.doLayoutWebview(dimension);
		// Temporary fix for https://github.com/microsoft/vscode/issues/110450
		// There is an animation that lasts about 200ms, update the webview positioning once this animation is complete.
		clearTimeout(this._repositionTimeout);
		this._repositionTimeout = setTimeout(() => this.doLayoutWebview(dimension), 200);
	}

	private findRootContainer(container: HTMLElement): HTMLElement | undefined {
		return findParentWithClass(container, 'monaco-scrollable-element') ?? undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webviewView/browser/webviewViewService.ts]---
Location: vscode-main/src/vs/workbench/contrib/webviewView/browser/webviewViewService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { promiseWithResolvers } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IViewBadge } from '../../../common/views.js';
import { IOverlayWebview } from '../../webview/browser/webview.js';

/**
 * A webview shown in a view pane.
 */
export interface WebviewView {
	/**
	 * The text displayed in the view's title.
	 */
	title?: string;

	/**
	 * Additional text shown for this view.
	 */
	description?: string;

	/**
	 * The badge shown for this view.
	 */
	badge?: IViewBadge;

	/**
	 * The webview associated with this webview view.
	 */
	readonly webview: IOverlayWebview;

	/**
	 * Fired when the visibility of the webview view changes.
	 *
	 * This can happen when the view itself is hidden, when the view is collapsed, or when the user switches away from
	 * the view.
	 */
	readonly onDidChangeVisibility: Event<boolean>;

	/**
	 * Fired when the webview view has been disposed of.
	 */
	readonly onDispose: Event<void>;

	/**
	 * Dispose of the webview view and clean up any associated resources.
	 */
	dispose(): void;

	/**
	 * Force the webview view to show.
	 */
	show(preserveFocus: boolean): void;
}

/**
 * Fill in the contents of a newly created webview view.
 */
interface IWebviewViewResolver {
	/**
	 * Fill in the contents of a webview view.
	 */
	resolve(webviewView: WebviewView, cancellation: CancellationToken): Promise<void>;
}

export const IWebviewViewService = createDecorator<IWebviewViewService>('webviewViewService');

export interface IWebviewViewService {

	readonly _serviceBrand: undefined;

	/**
	 * Fired when a resolver has been registered
	 */
	readonly onNewResolverRegistered: Event<{ readonly viewType: string }>;

	/**
	 * Register a new {@link IWebviewViewResolver webview view resolver}.
	 */
	register(viewType: string, resolver: IWebviewViewResolver): IDisposable;

	/**
	 * Try to resolve a webview view. The promise will not resolve until a resolver for the webview has been registered
	 * and run
	 */
	resolve(viewType: string, webview: WebviewView, cancellation: CancellationToken): Promise<void>;
}

export class WebviewViewService extends Disposable implements IWebviewViewService {

	readonly _serviceBrand: undefined;

	private readonly _resolvers = new Map<string, IWebviewViewResolver>();

	private readonly _awaitingRevival = new Map<string, { readonly webview: WebviewView; readonly resolve: () => void }>();

	private readonly _onNewResolverRegistered = this._register(new Emitter<{ readonly viewType: string }>());
	public readonly onNewResolverRegistered = this._onNewResolverRegistered.event;

	register(viewType: string, resolver: IWebviewViewResolver): IDisposable {
		if (this._resolvers.has(viewType)) {
			throw new Error(`View resolver already registered for ${viewType}`);
		}

		this._resolvers.set(viewType, resolver);
		this._onNewResolverRegistered.fire({ viewType: viewType });

		const pending = this._awaitingRevival.get(viewType);
		if (pending) {
			resolver.resolve(pending.webview, CancellationToken.None).then(() => {
				this._awaitingRevival.delete(viewType);
				pending.resolve();
			});
		}

		return toDisposable(() => {
			this._resolvers.delete(viewType);
		});
	}

	resolve(viewType: string, webview: WebviewView, cancellation: CancellationToken): Promise<void> {
		const resolver = this._resolvers.get(viewType);
		if (!resolver) {
			if (this._awaitingRevival.has(viewType)) {
				throw new Error('View already awaiting revival');
			}

			const { promise, resolve } = promiseWithResolvers<void>();
			this._awaitingRevival.set(viewType, { webview, resolve });
			return promise;
		}

		return resolver.resolve(webview, cancellation);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/welcomeBanner/browser/welcomeBanner.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/welcomeBanner/browser/welcomeBanner.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContributionsRegistry } from '../../../common/contributions.js';
import { IBannerService } from '../../../services/banner/browser/bannerService.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IBrowserWorkbenchEnvironmentService } from '../../../services/environment/browser/environmentService.js';
import { URI } from '../../../../base/common/uri.js';
import { ThemeIcon } from '../../../../base/common/themables.js';

class WelcomeBannerContribution {

	private static readonly WELCOME_BANNER_DISMISSED_KEY = 'workbench.banner.welcome.dismissed';

	constructor(
		@IBannerService bannerService: IBannerService,
		@IStorageService storageService: IStorageService,
		@IBrowserWorkbenchEnvironmentService environmentService: IBrowserWorkbenchEnvironmentService
	) {
		const welcomeBanner = environmentService.options?.welcomeBanner;
		if (!welcomeBanner) {
			return; // welcome banner is not enabled
		}

		if (storageService.getBoolean(WelcomeBannerContribution.WELCOME_BANNER_DISMISSED_KEY, StorageScope.PROFILE, false)) {
			return; // welcome banner dismissed
		}

		let icon: ThemeIcon | URI | undefined = undefined;
		if (typeof welcomeBanner.icon === 'string') {
			icon = ThemeIcon.fromId(welcomeBanner.icon);
		} else if (welcomeBanner.icon) {
			icon = URI.revive(welcomeBanner.icon);
		}

		bannerService.show({
			id: 'welcome.banner',
			message: welcomeBanner.message,
			icon,
			actions: welcomeBanner.actions,
			onClose: () => {
				storageService.store(WelcomeBannerContribution.WELCOME_BANNER_DISMISSED_KEY, true, StorageScope.PROFILE, StorageTarget.MACHINE);
			}
		});
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench)
	.registerWorkbenchContribution(WelcomeBannerContribution, LifecyclePhase.Restored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/welcomeGettingStarted/browser/gettingStarted.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/welcomeGettingStarted/browser/gettingStarted.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../nls.js';
import { GettingStartedInputSerializer, GettingStartedPage, inWelcomeContext } from './gettingStarted.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { EditorExtensions, IEditorFactoryRegistry } from '../../../common/editor.js';
import { MenuId, registerAction2, Action2 } from '../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ContextKeyExpr, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IEditorService, SIDE_GROUP } from '../../../services/editor/common/editorService.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { EditorPaneDescriptor, IEditorPaneRegistry } from '../../../browser/editor.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { IWalkthroughsService } from './gettingStartedService.js';
import { GettingStartedEditorOptions, GettingStartedInput } from './gettingStartedInput.js';
import { registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';
import { ConfigurationScope, Extensions as ConfigurationExtensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { workbenchConfigurationNodeBase } from '../../../common/configuration.js';
import { CommandsRegistry, ICommandService } from '../../../../platform/commands/common/commands.js';
import { IQuickInputService, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';
import { isLinux, isMacintosh, isWindows, OperatingSystem as OS } from '../../../../base/common/platform.js';
import { IExtensionManagementServerService } from '../../../services/extensionManagement/common/extensionManagement.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { StartupPageEditorResolverContribution, StartupPageRunnerContribution } from './startupPage.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { AccessibleViewRegistry } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { GettingStartedAccessibleView } from './gettingStartedAccessibleView.js';

export * as icons from './gettingStartedIcons.js';

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.openWalkthrough',
			title: localize2('miWelcome', 'Welcome'),
			category: Categories.Help,
			f1: true,
			menu: {
				id: MenuId.MenubarHelpMenu,
				group: '1_welcome',
				order: 1,
			},
			metadata: {
				description: localize2('minWelcomeDescription', 'Opens a Walkthrough to help you get started in VS Code.')
			}
		});
	}

	public run(
		accessor: ServicesAccessor,
		walkthroughID: string | { category: string; step: string } | undefined,
		optionsOrToSide: { toSide?: boolean; inactive?: boolean } | boolean | undefined
	) {
		const editorService = accessor.get(IEditorService);
		const commandService = accessor.get(ICommandService);

		const toSide = typeof optionsOrToSide === 'object' ? optionsOrToSide.toSide : optionsOrToSide;
		const inactive = typeof optionsOrToSide === 'object' ? optionsOrToSide.inactive : false;
		const activeEditor = editorService.activeEditor;

		if (walkthroughID) {
			const selectedCategory = typeof walkthroughID === 'string' ? walkthroughID : walkthroughID.category;
			let selectedStep: string | undefined;
			if (typeof walkthroughID === 'object' && 'category' in walkthroughID && 'step' in walkthroughID) {
				selectedStep = `${walkthroughID.category}#${walkthroughID.step}`;
			} else {
				selectedStep = undefined;
			}

			// If the walkthrough is already open just reveal the step
			if (selectedStep && activeEditor instanceof GettingStartedInput && activeEditor.selectedCategory === selectedCategory) {
				activeEditor.showWelcome = false;
				commandService.executeCommand('walkthroughs.selectStep', selectedStep);
				return;
			}

			let options: GettingStartedEditorOptions;
			if (selectedCategory) {
				// Otherwise open the walkthrough editor with the selected category and step
				options = { selectedCategory, selectedStep, showWelcome: false, preserveFocus: toSide ?? false, inactive };
			} else {
				// Open Welcome page
				options = { selectedCategory, selectedStep, showWelcome: true, preserveFocus: toSide ?? false, inactive };
			}
			editorService.openEditor({
				resource: GettingStartedInput.RESOURCE,
				options
			}, toSide ? SIDE_GROUP : undefined);

		} else {
			editorService.openEditor({
				resource: GettingStartedInput.RESOURCE,
				options: { preserveFocus: toSide ?? false, inactive }
			}, toSide ? SIDE_GROUP : undefined);
		}
	}
});

Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(GettingStartedInput.ID, GettingStartedInputSerializer);
Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		GettingStartedPage,
		GettingStartedPage.ID,
		localize('welcome', "Welcome")
	),
	[
		new SyncDescriptor(GettingStartedInput)
	]
);

const category = localize2('welcome', "Welcome");

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'welcome.goBack',
			title: localize2('welcome.goBack', 'Go Back'),
			category,
			keybinding: {
				weight: KeybindingWeight.EditorContrib,
				primary: KeyCode.Escape,
				when: inWelcomeContext
			},
			precondition: ContextKeyExpr.equals('activeEditor', 'gettingStartedPage'),
			f1: true
		});
	}

	run(accessor: ServicesAccessor) {
		const editorService = accessor.get(IEditorService);
		const editorPane = editorService.activeEditorPane;
		if (editorPane instanceof GettingStartedPage) {
			editorPane.escape();
		}
	}
});

CommandsRegistry.registerCommand({
	id: 'walkthroughs.selectStep',
	handler: (accessor, stepID: string) => {
		const editorService = accessor.get(IEditorService);
		const editorPane = editorService.activeEditorPane;
		if (editorPane instanceof GettingStartedPage) {
			editorPane.selectStepLoose(stepID);
		} else {
			console.error('Cannot run walkthroughs.selectStep outside of walkthrough context');
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'welcome.markStepComplete',
			title: localize('welcome.markStepComplete', "Mark Step Complete"),
			category,
		});
	}

	run(accessor: ServicesAccessor, arg: string) {
		if (!arg) { return; }
		const gettingStartedService = accessor.get(IWalkthroughsService);
		gettingStartedService.progressStep(arg);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'welcome.markStepIncomplete',
			title: localize('welcome.markStepInomplete', "Mark Step Incomplete"),
			category,
		});
	}

	run(accessor: ServicesAccessor, arg: string) {
		if (!arg) { return; }
		const gettingStartedService = accessor.get(IWalkthroughsService);
		gettingStartedService.deprogressStep(arg);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'welcome.showAllWalkthroughs',
			title: localize2('welcome.showAllWalkthroughs', 'Open Walkthrough...'),
			category,
			f1: true,
			menu: {
				id: MenuId.MenubarHelpMenu,
				group: '1_welcome',
				order: 3,
			},
		});
	}

	private async getQuickPickItems(
		contextService: IContextKeyService,
		gettingStartedService: IWalkthroughsService
	): Promise<IQuickPickItem[]> {
		const categories = await gettingStartedService.getWalkthroughs();
		return categories
			.filter(c => contextService.contextMatchesRules(c.when))
			.map(x => ({
				id: x.id,
				label: x.title,
				detail: x.description,
				description: x.source,
			}));
	}

	async run(accessor: ServicesAccessor) {
		const commandService = accessor.get(ICommandService);
		const contextService = accessor.get(IContextKeyService);
		const quickInputService = accessor.get(IQuickInputService);
		const gettingStartedService = accessor.get(IWalkthroughsService);
		const extensionService = accessor.get(IExtensionService);

		const disposables = new DisposableStore();
		const quickPick = disposables.add(quickInputService.createQuickPick());
		quickPick.canSelectMany = false;
		quickPick.matchOnDescription = true;
		quickPick.matchOnDetail = true;
		quickPick.placeholder = localize('pickWalkthroughs', 'Select a walkthrough to open');
		quickPick.items = await this.getQuickPickItems(contextService, gettingStartedService);
		quickPick.busy = true;
		disposables.add(quickPick.onDidAccept(() => {
			const selection = quickPick.selectedItems[0];
			if (selection) {
				commandService.executeCommand('workbench.action.openWalkthrough', selection.id);
			}
			quickPick.hide();
		}));
		disposables.add(quickPick.onDidHide(() => disposables.dispose()));
		await extensionService.whenInstalledExtensionsRegistered();
		disposables.add(gettingStartedService.onDidAddWalkthrough(async () => {
			quickPick.items = await this.getQuickPickItems(contextService, gettingStartedService);
		}));
		quickPick.show();
		quickPick.busy = false;
	}
});

CommandsRegistry.registerCommand({
	id: 'welcome.newWorkspaceChat',
	handler: (accessor, stepID: string) => {
		const commandService = accessor.get(ICommandService);
		commandService.executeCommand('workbench.action.chat.open', { mode: 'agent', query: '#new ', isPartialQuery: true });
	}
});

export const WorkspacePlatform = new RawContextKey<'mac' | 'linux' | 'windows' | 'webworker' | undefined>('workspacePlatform', undefined, localize('workspacePlatform', "The platform of the current workspace, which in remote or serverless contexts may be different from the platform of the UI"));
class WorkspacePlatformContribution {

	static readonly ID = 'workbench.contrib.workspacePlatform';

	constructor(
		@IExtensionManagementServerService private readonly extensionManagementServerService: IExtensionManagementServerService,
		@IRemoteAgentService private readonly remoteAgentService: IRemoteAgentService,
		@IContextKeyService private readonly contextService: IContextKeyService,
	) {
		this.remoteAgentService.getEnvironment().then(env => {
			const remoteOS = env?.os;

			const remotePlatform = remoteOS === OS.Macintosh ? 'mac'
				: remoteOS === OS.Windows ? 'windows'
					: remoteOS === OS.Linux ? 'linux'
						: undefined;

			if (remotePlatform) {
				WorkspacePlatform.bindTo(this.contextService).set(remotePlatform);
			} else if (this.extensionManagementServerService.localExtensionManagementServer) {
				if (isMacintosh) {
					WorkspacePlatform.bindTo(this.contextService).set('mac');
				} else if (isLinux) {
					WorkspacePlatform.bindTo(this.contextService).set('linux');
				} else if (isWindows) {
					WorkspacePlatform.bindTo(this.contextService).set('windows');
				}
			} else if (this.extensionManagementServerService.webExtensionManagementServer) {
				WorkspacePlatform.bindTo(this.contextService).set('webworker');
			} else {
				console.error('Error: Unable to detect workspace platform');
			}
		});
	}
}

const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
configurationRegistry.registerConfiguration({
	...workbenchConfigurationNodeBase,
	properties: {
		'workbench.welcomePage.walkthroughs.openOnInstall': {
			scope: ConfigurationScope.MACHINE,
			type: 'boolean',
			default: true,
			description: localize('workbench.welcomePage.walkthroughs.openOnInstall', "When enabled, an extension's walkthrough will open upon install of the extension.")
		},
		'workbench.startupEditor': {
			'scope': ConfigurationScope.RESOURCE,
			'type': 'string',
			'enum': ['none', 'welcomePage', 'readme', 'newUntitledFile', 'welcomePageInEmptyWorkbench', 'terminal'],
			'enumDescriptions': [
				localize({ comment: ['This is the description for a setting. Values surrounded by single quotes are not to be translated.'], key: 'workbench.startupEditor.none' }, "Start without an editor."),
				localize({ comment: ['This is the description for a setting. Values surrounded by single quotes are not to be translated.'], key: 'workbench.startupEditor.welcomePage' }, "Open the Welcome page, with content to aid in getting started with VS Code and extensions."),
				localize({ comment: ['This is the description for a setting. Values surrounded by single quotes are not to be translated.'], key: 'workbench.startupEditor.readme' }, "Open the README when opening a folder that contains one, fallback to 'welcomePage' otherwise. Note: This is only observed as a global configuration, it will be ignored if set in a workspace or folder configuration."),
				localize({ comment: ['This is the description for a setting. Values surrounded by single quotes are not to be translated.'], key: 'workbench.startupEditor.newUntitledFile' }, "Open a new untitled text file (only applies when opening an empty window)."),
				localize({ comment: ['This is the description for a setting. Values surrounded by single quotes are not to be translated.'], key: 'workbench.startupEditor.welcomePageInEmptyWorkbench' }, "Open the Welcome page when opening an empty workbench."),
				localize({ comment: ['This is the description for a setting. Values surrounded by single quotes are not to be translated.'], key: 'workbench.startupEditor.terminal' }, "Open a new terminal in the editor area."),
			],
			'default': 'welcomePage',
			'description': localize('workbench.startupEditor', "Controls which editor is shown at startup, if none are restored from the previous session.")
		},
		'workbench.welcomePage.preferReducedMotion': {
			scope: ConfigurationScope.APPLICATION,
			type: 'boolean',
			default: false,
			deprecationMessage: localize('deprecationMessage', "Deprecated, use the global `workbench.reduceMotion`."),
			description: localize('workbench.welcomePage.preferReducedMotion', "When enabled, reduce motion in welcome page.")
		}
	}
});

registerWorkbenchContribution2(WorkspacePlatformContribution.ID, WorkspacePlatformContribution, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(StartupPageEditorResolverContribution.ID, StartupPageEditorResolverContribution, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(StartupPageRunnerContribution.ID, StartupPageRunnerContribution, WorkbenchPhase.AfterRestored);

AccessibleViewRegistry.register(new GettingStartedAccessibleView());
```

--------------------------------------------------------------------------------

````

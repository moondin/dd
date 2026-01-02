---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 163
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 163 of 552)

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

---[FILE: src/vs/nls.messages.ts]---
Location: vscode-main/src/vs/nls.messages.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/*
 * This module exists so that the AMD build of the monaco editor can replace this with an async loader plugin.
 * If you add new functions to this module make sure that they are also provided in the AMD build of the monaco editor.
 *
 * TODO@esm remove me once we no longer ship an AMD build.
 */

export function getNLSMessages(): string[] {
	return globalThis._VSCODE_NLS_MESSAGES;
}

export function getNLSLanguage(): string | undefined {
	return globalThis._VSCODE_NLS_LANGUAGE;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/nls.ts]---
Location: vscode-main/src/vs/nls.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// eslint-disable-next-line local/code-import-patterns
import { getNLSLanguage, getNLSMessages } from './nls.messages.js';
// eslint-disable-next-line local/code-import-patterns
export { getNLSLanguage, getNLSMessages } from './nls.messages.js';

declare const document: { location?: { hash?: string } } | undefined;
const isPseudo = getNLSLanguage() === 'pseudo' || (typeof document !== 'undefined' && document.location && typeof document.location.hash === 'string' && document.location.hash.indexOf('pseudo=true') >= 0);

export interface ILocalizeInfo {
	key: string;
	comment: string[];
}

export interface ILocalizedString {
	original: string;
	value: string;
}

function _format(message: string, args: (string | number | boolean | undefined | null)[]): string {
	let result: string;

	if (args.length === 0) {
		result = message;
	} else {
		result = message.replace(/\{(\d+)\}/g, (match, rest) => {
			const index = rest[0];
			const arg = args[index];
			let result = match;
			if (typeof arg === 'string') {
				result = arg;
			} else if (typeof arg === 'number' || typeof arg === 'boolean' || arg === void 0 || arg === null) {
				result = String(arg);
			}
			return result;
		});
	}

	if (isPseudo) {
		// FF3B and FF3D is the Unicode zenkaku representation for [ and ]
		result = '\uFF3B' + result.replace(/[aouei]/g, '$&$&') + '\uFF3D';
	}

	return result;
}

/**
 * Marks a string to be localized. Returns the localized string.
 *
 * @param info The {@linkcode ILocalizeInfo} which describes the id and comments associated with the localized string.
 * @param message The string to localize
 * @param args The arguments to the string
 *
 * @note `message` can contain `{n}` notation where it is replaced by the nth value in `...args`
 * @example `localize({ key: 'sayHello', comment: ['Welcomes user'] }, 'hello {0}', name)`
 *
 * @returns string The localized string.
 */
export function localize(info: ILocalizeInfo, message: string, ...args: (string | number | boolean | undefined | null)[]): string;

/**
 * Marks a string to be localized. Returns the localized string.
 *
 * @param key The key to use for localizing the string
 * @param message The string to localize
 * @param args The arguments to the string
 *
 * @note `message` can contain `{n}` notation where it is replaced by the nth value in `...args`
 * @example For example, `localize('sayHello', 'hello {0}', name)`
 *
 * @returns string The localized string.
 */
export function localize(key: string, message: string, ...args: (string | number | boolean | undefined | null)[]): string;

/**
 * @skipMangle
 */
export function localize(data: ILocalizeInfo | string /* | number when built */, message: string /* | null when built */, ...args: (string | number | boolean | undefined | null)[]): string {
	if (typeof data === 'number') {
		return _format(lookupMessage(data, message), args);
	}
	return _format(message, args);
}

/**
 * Only used when built: Looks up the message in the global NLS table.
 * This table is being made available as a global through bootstrapping
 * depending on the target context.
 */
function lookupMessage(index: number, fallback: string | null): string {
	const message = getNLSMessages()?.[index];
	if (typeof message !== 'string') {
		if (typeof fallback === 'string') {
			return fallback;
		}
		throw new Error(`!!! NLS MISSING: ${index} !!!`);
	}
	return message;
}

/**
 * Marks a string to be localized. Returns an {@linkcode ILocalizedString}
 * which contains the localized string and the original string.
 *
 * @param info The {@linkcode ILocalizeInfo} which describes the id and comments associated with the localized string.
 * @param message The string to localize
 * @param args The arguments to the string
 *
 * @note `message` can contain `{n}` notation where it is replaced by the nth value in `...args`
 * @example `localize2({ key: 'sayHello', comment: ['Welcomes user'] }, 'hello {0}', name)`
 *
 * @returns ILocalizedString which contains the localized string and the original string.
 */
export function localize2(info: ILocalizeInfo, message: string, ...args: (string | number | boolean | undefined | null)[]): ILocalizedString;

/**
 * Marks a string to be localized. Returns an {@linkcode ILocalizedString}
 * which contains the localized string and the original string.
 *
 * @param key The key to use for localizing the string
 * @param message The string to localize
 * @param args The arguments to the string
 *
 * @note `message` can contain `{n}` notation where it is replaced by the nth value in `...args`
 * @example `localize('sayHello', 'hello {0}', name)`
 *
 * @returns ILocalizedString which contains the localized string and the original string.
 */
export function localize2(key: string, message: string, ...args: (string | number | boolean | undefined | null)[]): ILocalizedString;

/**
 * @skipMangle
 */
export function localize2(data: ILocalizeInfo | string /* | number when built */, originalMessage: string, ...args: (string | number | boolean | undefined | null)[]): ILocalizedString {
	let message: string;
	if (typeof data === 'number') {
		message = lookupMessage(data, originalMessage);
	} else {
		message = originalMessage;
	}

	const value = _format(message, args);

	return {
		value,
		original: originalMessage === message ? value : _format(originalMessage, args)
	};
}

export interface INLSLanguagePackConfiguration {

	/**
	 * The path to the translations config file that contains pointers to
	 * all message bundles for `main` and extensions.
	 */
	readonly translationsConfigFile: string;

	/**
	 * The path to the file containing the translations for this language
	 * pack as flat string array.
	 */
	readonly messagesFile: string;

	/**
	 * The path to the file that can be used to signal a corrupt language
	 * pack, for example when reading the `messagesFile` fails. This will
	 * instruct the application to re-create the cache on next startup.
	 */
	readonly corruptMarkerFile: string;
}

export interface INLSConfiguration {

	/**
	 * Locale as defined in `argv.json` or `app.getLocale()`.
	 */
	readonly userLocale: string;

	/**
	 * Locale as defined by the OS (e.g. `app.getPreferredSystemLanguages()`).
	 */
	readonly osLocale: string;

	/**
	 * The actual language of the UI that ends up being used considering `userLocale`
	 * and `osLocale`.
	 */
	readonly resolvedLanguage: string;

	/**
	 * Defined if a language pack is used that is not the
	 * default english language pack. This requires a language
	 * pack to be installed as extension.
	 */
	readonly languagePack?: INLSLanguagePackConfiguration;

	/**
	 * The path to the file containing the default english messages
	 * as flat string array. The file is only present in built
	 * versions of the application.
	 */
	readonly defaultMessagesFile: string;

	/**
	 * Below properties are deprecated and only there to continue support
	 * for `vscode-nls` module that depends on them.
	 * Refs https://github.com/microsoft/vscode-nls/blob/main/src/node/main.ts#L36-L46
	 */
	/** @deprecated */
	readonly locale: string;
	/** @deprecated */
	readonly availableLanguages: Record<string, string>;
	/** @deprecated */
	readonly _languagePackSupport?: boolean;
	/** @deprecated */
	readonly _languagePackId?: string;
	/** @deprecated */
	readonly _translationsConfigFile?: string;
	/** @deprecated */
	readonly _cacheRoot?: string;
	/** @deprecated */
	readonly _resolvedLanguagePackCoreLocation?: string;
	/** @deprecated */
	readonly _corruptedFile?: string;
}

export interface ILanguagePack {
	readonly hash: string;
	readonly label: string | undefined;
	readonly extensions: {
		readonly extensionIdentifier: { readonly id: string; readonly uuid?: string };
		readonly version: string;
	}[];
	readonly translations: Record<string, string | undefined>;
}

export type ILanguagePacks = Record<string, ILanguagePack | undefined>;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/broadcast.ts]---
Location: vscode-main/src/vs/base/browser/broadcast.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { mainWindow } from './window.js';
import { getErrorMessage } from '../common/errors.js';
import { Emitter } from '../common/event.js';
import { Disposable, toDisposable } from '../common/lifecycle.js';

export class BroadcastDataChannel<T> extends Disposable {

	private broadcastChannel: BroadcastChannel | undefined;

	private readonly _onDidReceiveData = this._register(new Emitter<T>());
	readonly onDidReceiveData = this._onDidReceiveData.event;

	constructor(private readonly channelName: string) {
		super();

		// Use BroadcastChannel
		if ('BroadcastChannel' in mainWindow) {
			try {
				this.broadcastChannel = new BroadcastChannel(channelName);
				const listener = (event: MessageEvent) => {
					this._onDidReceiveData.fire(event.data);
				};
				this.broadcastChannel.addEventListener('message', listener);
				this._register(toDisposable(() => {
					if (this.broadcastChannel) {
						this.broadcastChannel.removeEventListener('message', listener);
						this.broadcastChannel.close();
					}
				}));
			} catch (error) {
				console.warn('Error while creating broadcast channel. Falling back to localStorage.', getErrorMessage(error));
			}
		}

		// BroadcastChannel is not supported. Use storage.
		if (!this.broadcastChannel) {
			this.channelName = `BroadcastDataChannel.${channelName}`;
			this.createBroadcastChannel();
		}
	}

	private createBroadcastChannel(): void {
		const listener = (event: StorageEvent) => {
			if (event.key === this.channelName && event.newValue) {
				this._onDidReceiveData.fire(JSON.parse(event.newValue));
			}
		};
		mainWindow.addEventListener('storage', listener);
		this._register(toDisposable(() => mainWindow.removeEventListener('storage', listener)));
	}

	/**
	 * Sends the data to other BroadcastChannel objects set up for this channel. Data can be structured objects, e.g. nested objects and arrays.
	 * @param data data to broadcast
	 */
	postData(data: T): void {
		if (this.broadcastChannel) {
			this.broadcastChannel.postMessage(data);
		} else {
			// remove previous changes so that event is triggered even if new changes are same as old changes
			localStorage.removeItem(this.channelName);
			localStorage.setItem(this.channelName, JSON.stringify(data));
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/browser.ts]---
Location: vscode-main/src/vs/base/browser/browser.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeWindow, mainWindow } from './window.js';
import { Emitter } from '../common/event.js';

class WindowManager {

	static readonly INSTANCE = new WindowManager();

	// --- Zoom Level

	private readonly mapWindowIdToZoomLevel = new Map<number, number>();

	private readonly _onDidChangeZoomLevel = new Emitter<number>();
	readonly onDidChangeZoomLevel = this._onDidChangeZoomLevel.event;

	getZoomLevel(targetWindow: Window): number {
		return this.mapWindowIdToZoomLevel.get(this.getWindowId(targetWindow)) ?? 0;
	}
	setZoomLevel(zoomLevel: number, targetWindow: Window): void {
		if (this.getZoomLevel(targetWindow) === zoomLevel) {
			return;
		}

		const targetWindowId = this.getWindowId(targetWindow);
		this.mapWindowIdToZoomLevel.set(targetWindowId, zoomLevel);
		this._onDidChangeZoomLevel.fire(targetWindowId);
	}

	// --- Zoom Factor

	private readonly mapWindowIdToZoomFactor = new Map<number, number>();

	getZoomFactor(targetWindow: Window): number {
		return this.mapWindowIdToZoomFactor.get(this.getWindowId(targetWindow)) ?? 1;
	}
	setZoomFactor(zoomFactor: number, targetWindow: Window): void {
		this.mapWindowIdToZoomFactor.set(this.getWindowId(targetWindow), zoomFactor);
	}

	// --- Fullscreen

	private readonly _onDidChangeFullscreen = new Emitter<number>();
	readonly onDidChangeFullscreen = this._onDidChangeFullscreen.event;

	private readonly mapWindowIdToFullScreen = new Map<number, boolean>();

	setFullscreen(fullscreen: boolean, targetWindow: Window): void {
		if (this.isFullscreen(targetWindow) === fullscreen) {
			return;
		}

		const windowId = this.getWindowId(targetWindow);
		this.mapWindowIdToFullScreen.set(windowId, fullscreen);
		this._onDidChangeFullscreen.fire(windowId);
	}
	isFullscreen(targetWindow: Window): boolean {
		return !!this.mapWindowIdToFullScreen.get(this.getWindowId(targetWindow));
	}

	private getWindowId(targetWindow: Window): number {
		return (targetWindow as CodeWindow).vscodeWindowId;
	}
}

export function addMatchMediaChangeListener(targetWindow: Window, query: string | MediaQueryList, callback: (this: MediaQueryList, ev: MediaQueryListEvent) => unknown): void {
	if (typeof query === 'string') {
		query = targetWindow.matchMedia(query);
	}
	query.addEventListener('change', callback);
}

/** A zoom index, e.g. 1, 2, 3 */
export function setZoomLevel(zoomLevel: number, targetWindow: Window): void {
	WindowManager.INSTANCE.setZoomLevel(zoomLevel, targetWindow);
}
export function getZoomLevel(targetWindow: Window): number {
	return WindowManager.INSTANCE.getZoomLevel(targetWindow);
}
export const onDidChangeZoomLevel = WindowManager.INSTANCE.onDidChangeZoomLevel;

/** The zoom scale for an index, e.g. 1, 1.2, 1.4 */
export function getZoomFactor(targetWindow: Window): number {
	return WindowManager.INSTANCE.getZoomFactor(targetWindow);
}
export function setZoomFactor(zoomFactor: number, targetWindow: Window): void {
	WindowManager.INSTANCE.setZoomFactor(zoomFactor, targetWindow);
}

export function setFullscreen(fullscreen: boolean, targetWindow: Window): void {
	WindowManager.INSTANCE.setFullscreen(fullscreen, targetWindow);
}
export function isFullscreen(targetWindow: Window): boolean {
	return WindowManager.INSTANCE.isFullscreen(targetWindow);
}
export const onDidChangeFullscreen = WindowManager.INSTANCE.onDidChangeFullscreen;

const userAgent = navigator.userAgent;

export const isFirefox = (userAgent.indexOf('Firefox') >= 0);
export const isWebKit = (userAgent.indexOf('AppleWebKit') >= 0);
export const isChrome = (userAgent.indexOf('Chrome') >= 0);
export const isSafari = (!isChrome && (userAgent.indexOf('Safari') >= 0));
export const isWebkitWebView = (!isChrome && !isSafari && isWebKit);
export const isElectron = (userAgent.indexOf('Electron/') >= 0);
export const isAndroid = (userAgent.indexOf('Android') >= 0);

let standalone = false;
if (typeof mainWindow.matchMedia === 'function') {
	const standaloneMatchMedia = mainWindow.matchMedia('(display-mode: standalone) or (display-mode: window-controls-overlay)');
	const fullScreenMatchMedia = mainWindow.matchMedia('(display-mode: fullscreen)');
	standalone = standaloneMatchMedia.matches;
	addMatchMediaChangeListener(mainWindow, standaloneMatchMedia, ({ matches }) => {
		// entering fullscreen would change standaloneMatchMedia.matches to false
		// if standalone is true (running as PWA) and entering fullscreen, skip this change
		if (standalone && fullScreenMatchMedia.matches) {
			return;
		}
		// otherwise update standalone (browser to PWA or PWA to browser)
		standalone = matches;
	});
}
export function isStandalone(): boolean {
	return standalone;
}

// Visible means that the feature is enabled, not necessarily being rendered
// e.g. visible is true even in fullscreen mode where the controls are hidden
// See docs at https://developer.mozilla.org/en-US/docs/Web/API/WindowControlsOverlay/visible
export function isWCOEnabled(): boolean {
	return !!(navigator as Navigator & { windowControlsOverlay?: { visible: boolean } })?.windowControlsOverlay?.visible;
}

// Returns the bounding rect of the titlebar area if it is supported and defined
// See docs at https://developer.mozilla.org/en-US/docs/Web/API/WindowControlsOverlay/getTitlebarAreaRect
export function getWCOTitlebarAreaRect(targetWindow: Window): DOMRect | undefined {
	return (targetWindow.navigator as Navigator & { windowControlsOverlay?: { getTitlebarAreaRect: () => DOMRect } })?.windowControlsOverlay?.getTitlebarAreaRect();
}

export interface IMonacoEnvironment {

	createTrustedTypesPolicy?<Options extends TrustedTypePolicyOptions>(
		policyName: string,
		policyOptions?: Options,
	): undefined | Pick<TrustedTypePolicy, 'name' | Extract<keyof Options, keyof TrustedTypePolicyOptions>>;

	getWorker?(moduleId: string, label: string): Worker | Promise<Worker>;

	getWorkerUrl?(moduleId: string, label: string): string;

	globalAPI?: boolean;

}
interface IGlobalWithMonacoEnvironment {
	MonacoEnvironment?: IMonacoEnvironment;
}
export function getMonacoEnvironment(): IMonacoEnvironment | undefined {
	return (globalThis as IGlobalWithMonacoEnvironment).MonacoEnvironment;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/canIUse.ts]---
Location: vscode-main/src/vs/base/browser/canIUse.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as browser from './browser.js';
import { mainWindow } from './window.js';
import * as platform from '../common/platform.js';

export const enum KeyboardSupport {
	Always,
	FullScreen,
	None
}

/**
 * Browser feature we can support in current platform, browser and environment.
 */
export const BrowserFeatures = {
	clipboard: {
		writeText: (
			platform.isNative
			|| (document.queryCommandSupported && document.queryCommandSupported('copy'))
			|| !!(navigator && navigator.clipboard && navigator.clipboard.writeText)
		),
		readText: (
			platform.isNative
			|| !!(navigator && navigator.clipboard && navigator.clipboard.readText)
		)
	},
	keyboard: (() => {
		if (platform.isNative || browser.isStandalone()) {
			return KeyboardSupport.Always;
		}

		if ((navigator as Navigator & { keyboard?: unknown }).keyboard || browser.isSafari) {
			return KeyboardSupport.FullScreen;
		}

		return KeyboardSupport.None;
	})(),

	// 'ontouchstart' in window always evaluates to true with typescript's modern typings. This causes `window` to be
	// `never` later in `window.navigator`. That's why we need the explicit `window as Window` cast
	touch: 'ontouchstart' in mainWindow || navigator.maxTouchPoints > 0,
	pointerEvents: mainWindow.PointerEvent && ('ontouchstart' in mainWindow || navigator.maxTouchPoints > 0)
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/contextmenu.ts]---
Location: vscode-main/src/vs/base/browser/contextmenu.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { StandardMouseEvent } from './mouseEvent.js';
import { IActionViewItemOptions } from './ui/actionbar/actionViewItems.js';
import { IActionViewItem } from './ui/actionbar/actionbar.js';
import { AnchorAlignment, AnchorAxisAlignment, IAnchor } from './ui/contextview/contextview.js';
import { IAction, IActionRunner } from '../common/actions.js';
import { ResolvedKeybinding } from '../common/keybindings.js';
import { OmitOptional } from '../common/types.js';

export interface IContextMenuEvent {
	readonly shiftKey?: boolean;
	readonly ctrlKey?: boolean;
	readonly altKey?: boolean;
	readonly metaKey?: boolean;
}

/**
 * A specific context menu location to position the menu at.
 * Uses some TypeScript type tricks to prevent allowing to
 * pass in a `MouseEvent` and force people to use `StandardMouseEvent`.
 */
type ContextMenuLocation = OmitOptional<IAnchor> & { getModifierState?: never };

export interface IContextMenuDelegate {
	/**
	 * The anchor where to position the context view.
	 * Use a `HTMLElement` to position the view at the element,
	 * a `StandardMouseEvent` to position it at the mouse position
	 * or an `ContextMenuLocation` to position it at a specific location.
	 */
	getAnchor(): HTMLElement | StandardMouseEvent | ContextMenuLocation;
	getActions(): readonly IAction[];
	getCheckedActionsRepresentation?(action: IAction): 'radio' | 'checkbox';
	getActionViewItem?(action: IAction, options: IActionViewItemOptions): IActionViewItem | undefined;
	getActionsContext?(event?: IContextMenuEvent): unknown;
	getKeyBinding?(action: IAction): ResolvedKeybinding | undefined;
	getMenuClassName?(): string;
	onHide?(didCancel: boolean): void;
	actionRunner?: IActionRunner;
	skipTelemetry?: boolean;
	autoSelectFirstItem?: boolean;
	anchorAlignment?: AnchorAlignment;
	anchorAxisAlignment?: AnchorAxisAlignment;
	domForShadowRoot?: HTMLElement;
	/**
	 * custom context menus with higher layers are rendered higher in z-index order
	 */
	layer?: number;
}

export interface IContextMenuProvider {
	showContextMenu(delegate: IContextMenuDelegate): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/cssValue.ts]---
Location: vscode-main/src/vs/base/browser/cssValue.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Color } from '../common/color.js';
import { FileAccess } from '../common/network.js';
import { URI } from '../common/uri.js';

export type CssFragment = string & { readonly __cssFragment: unique symbol };

function asFragment(raw: string): CssFragment {
	return raw as CssFragment;
}

export function asCssValueWithDefault(cssPropertyValue: string | undefined, dflt: string): string {
	if (cssPropertyValue !== undefined) {
		const variableMatch = cssPropertyValue.match(/^\s*var\((.+)\)$/);
		if (variableMatch) {
			const varArguments = variableMatch[1].split(',', 2);
			if (varArguments.length === 2) {
				dflt = asCssValueWithDefault(varArguments[1].trim(), dflt);
			}
			return `var(${varArguments[0]}, ${dflt})`;
		}
		return cssPropertyValue;
	}
	return dflt;
}

export function sizeValue(value: string): CssFragment {
	const out = value.replaceAll(/[^\w.%+-]/gi, '');
	if (out !== value) {
		console.warn(`CSS size ${value} modified to ${out} to be safe for CSS`);
	}
	return asFragment(out);
}

export function hexColorValue(value: string): CssFragment {
	const out = value.replaceAll(/[^[0-9a-fA-F#]]/gi, '');
	if (out !== value) {
		console.warn(`CSS hex color ${value} modified to ${out} to be safe for CSS`);
	}
	return asFragment(out);
}

export function identValue(value: string): CssFragment {
	const out = value.replaceAll(/[^_\-a-z0-9]/gi, '');
	if (out !== value) {
		console.warn(`CSS ident value ${value} modified to ${out} to be safe for CSS`);
	}
	return asFragment(out);
}

export function stringValue(value: string): CssFragment {
	return asFragment(`'${value.replaceAll(/'/g, '\\000027')}'`);
}

/**
 * returns url('...')
 */
export function asCSSUrl(uri: URI | null | undefined): CssFragment {
	if (!uri) {
		return asFragment(`url('')`);
	}
	return inline`url('${asFragment(CSS.escape(FileAccess.uriToBrowserUri(uri).toString(true)))}')`;
}

export function className(value: string, escapingExpected = false): CssFragment {
	const out = CSS.escape(value);
	if (!escapingExpected && out !== value) {
		console.warn(`CSS class name ${value} modified to ${out} to be safe for CSS`);
	}
	return asFragment(out);
}

type InlineCssTemplateValue = CssFragment | Color;

/**
 * Template string tag that that constructs a CSS fragment.
 *
 * All expressions in the template must be css safe values.
 */
export function inline(strings: TemplateStringsArray, ...values: InlineCssTemplateValue[]): CssFragment {
	return asFragment(strings.reduce((result, str, i) => {
		const value = values[i] || '';
		return result + str + value;
	}, ''));
}


export class Builder {
	private readonly _parts: CssFragment[] = [];

	push(...parts: CssFragment[]): void {
		this._parts.push(...parts);
	}

	join(joiner = '\n'): CssFragment {
		return asFragment(this._parts.join(joiner));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/deviceAccess.ts]---
Location: vscode-main/src/vs/base/browser/deviceAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// https://wicg.github.io/webusb/

interface UsbDevice {
	readonly deviceClass: number;
	readonly deviceProtocol: number;
	readonly deviceSubclass: number;
	readonly deviceVersionMajor: number;
	readonly deviceVersionMinor: number;
	readonly deviceVersionSubminor: number;
	readonly manufacturerName?: string;
	readonly productId: number;
	readonly productName?: string;
	readonly serialNumber?: string;
	readonly usbVersionMajor: number;
	readonly usbVersionMinor: number;
	readonly usbVersionSubminor: number;
	readonly vendorId: number;
}

interface USB {
	requestDevice(options: { filters: unknown[] }): Promise<UsbDevice>;
}

export interface UsbDeviceData {
	readonly deviceClass: number;
	readonly deviceProtocol: number;
	readonly deviceSubclass: number;
	readonly deviceVersionMajor: number;
	readonly deviceVersionMinor: number;
	readonly deviceVersionSubminor: number;
	readonly manufacturerName?: string;
	readonly productId: number;
	readonly productName?: string;
	readonly serialNumber?: string;
	readonly usbVersionMajor: number;
	readonly usbVersionMinor: number;
	readonly usbVersionSubminor: number;
	readonly vendorId: number;
}

export async function requestUsbDevice(options?: { filters?: unknown[] }): Promise<UsbDeviceData | undefined> {
	const usb = (navigator as Navigator & { usb?: USB }).usb;
	if (!usb) {
		return undefined;
	}

	const device = await usb.requestDevice({ filters: options?.filters ?? [] });
	if (!device) {
		return undefined;
	}

	return {
		deviceClass: device.deviceClass,
		deviceProtocol: device.deviceProtocol,
		deviceSubclass: device.deviceSubclass,
		deviceVersionMajor: device.deviceVersionMajor,
		deviceVersionMinor: device.deviceVersionMinor,
		deviceVersionSubminor: device.deviceVersionSubminor,
		manufacturerName: device.manufacturerName,
		productId: device.productId,
		productName: device.productName,
		serialNumber: device.serialNumber,
		usbVersionMajor: device.usbVersionMajor,
		usbVersionMinor: device.usbVersionMinor,
		usbVersionSubminor: device.usbVersionSubminor,
		vendorId: device.vendorId,
	};
}

// https://wicg.github.io/serial/

interface SerialPortInfo {
	readonly usbVendorId?: number | undefined;
	readonly usbProductId?: number | undefined;
}

interface SerialPort {
	getInfo(): SerialPortInfo;
}

interface Serial {
	requestPort(options: { filters: unknown[] }): Promise<SerialPort>;
}

export interface SerialPortData {
	readonly usbVendorId?: number | undefined;
	readonly usbProductId?: number | undefined;
}

export async function requestSerialPort(options?: { filters?: unknown[] }): Promise<SerialPortData | undefined> {
	const serial = (navigator as Navigator & { serial?: Serial }).serial;
	if (!serial) {
		return undefined;
	}

	const port = await serial.requestPort({ filters: options?.filters ?? [] });
	if (!port) {
		return undefined;
	}

	const info = port.getInfo();
	return {
		usbVendorId: info.usbVendorId,
		usbProductId: info.usbProductId
	};
}

// https://wicg.github.io/webhid/

interface HidDevice {
	readonly opened: boolean;
	readonly vendorId: number;
	readonly productId: number;
	readonly productName: string;
	readonly collections: [];
}

interface HID {
	requestDevice(options: { filters: unknown[] }): Promise<HidDevice[]>;
}

export interface HidDeviceData {
	readonly opened: boolean;
	readonly vendorId: number;
	readonly productId: number;
	readonly productName: string;
	readonly collections: [];
}

export async function requestHidDevice(options?: { filters?: unknown[] }): Promise<HidDeviceData | undefined> {
	const hid = (navigator as Navigator & { hid?: HID }).hid;
	if (!hid) {
		return undefined;
	}

	const devices = await hid.requestDevice({ filters: options?.filters ?? [] });
	if (!devices.length) {
		return undefined;
	}

	const device = devices[0];
	return {
		opened: device.opened,
		vendorId: device.vendorId,
		productId: device.productId,
		productName: device.productName,
		collections: device.collections
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/dnd.ts]---
Location: vscode-main/src/vs/base/browser/dnd.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { addDisposableListener } from './dom.js';
import { Disposable } from '../common/lifecycle.js';
import { Mimes } from '../common/mime.js';

/**
 * A helper that will execute a provided function when the provided HTMLElement receives
 *  dragover event for 800ms. If the drag is aborted before, the callback will not be triggered.
 */
export class DelayedDragHandler extends Disposable {
	private timeout: Timeout | undefined = undefined;

	constructor(container: HTMLElement, callback: () => void) {
		super();

		this._register(addDisposableListener(container, 'dragover', e => {
			e.preventDefault(); // needed so that the drop event fires (https://stackoverflow.com/questions/21339924/drop-event-not-firing-in-chrome)

			if (!this.timeout) {
				this.timeout = setTimeout(() => {
					callback();

					this.timeout = undefined;
				}, 800);
			}
		}));

		['dragleave', 'drop', 'dragend'].forEach(type => {
			this._register(addDisposableListener(container, type, () => {
				this.clearDragTimeout();
			}));
		});
	}

	private clearDragTimeout(): void {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = undefined;
		}
	}

	override dispose(): void {
		super.dispose();

		this.clearDragTimeout();
	}
}

// Common data transfers
export const DataTransfers = {

	/**
	 * Application specific resource transfer type
	 */
	RESOURCES: 'ResourceURLs',

	/**
	 * Browser specific transfer type to download
	 */
	DOWNLOAD_URL: 'DownloadURL',

	/**
	 * Browser specific transfer type for files
	 */
	FILES: 'Files',

	/**
	 * Typically transfer type for copy/paste transfers.
	 */
	TEXT: Mimes.text,

	/**
	 * Internal type used to pass around text/uri-list data.
	 *
	 * This is needed to work around https://bugs.chromium.org/p/chromium/issues/detail?id=239745.
	 */
	INTERNAL_URI_LIST: 'application/vnd.code.uri-list',
};

export interface IDragAndDropData {
	update(dataTransfer: DataTransfer): void;
	getData(): unknown;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/dom.ts]---
Location: vscode-main/src/vs/base/browser/dom.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as browser from './browser.js';
import { BrowserFeatures } from './canIUse.js';
import { hasModifierKeys, IKeyboardEvent, StandardKeyboardEvent } from './keyboardEvent.js';
import { IMouseEvent, StandardMouseEvent } from './mouseEvent.js';
import { AbstractIdleValue, IntervalTimer, TimeoutTimer, _runWhenIdle, IdleDeadline } from '../common/async.js';
import { BugIndicatingError, onUnexpectedError } from '../common/errors.js';
import * as event from '../common/event.js';
import { KeyCode } from '../common/keyCodes.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../common/lifecycle.js';
import { RemoteAuthorities } from '../common/network.js';
import * as platform from '../common/platform.js';
import { URI } from '../common/uri.js';
import { hash } from '../common/hash.js';
import { CodeWindow, ensureCodeWindow, mainWindow } from './window.js';
import { isPointWithinTriangle } from '../common/numbers.js';
import { IObservable, derived, derivedOpts, IReader, observableValue, isObservable } from '../common/observable.js';

export interface IRegisteredCodeWindow {
	readonly window: CodeWindow;
	readonly disposables: DisposableStore;
}

//# region Multi-Window Support Utilities

export const {
	registerWindow,
	getWindow,
	getDocument,
	getWindows,
	getWindowsCount,
	getWindowId,
	getWindowById,
	hasWindow,
	onDidRegisterWindow,
	onWillUnregisterWindow,
	onDidUnregisterWindow
} = (function () {
	const windows = new Map<number, IRegisteredCodeWindow>();

	ensureCodeWindow(mainWindow, 1);
	const mainWindowRegistration = { window: mainWindow, disposables: new DisposableStore() };
	windows.set(mainWindow.vscodeWindowId, mainWindowRegistration);

	const onDidRegisterWindow = new event.Emitter<IRegisteredCodeWindow>();
	const onDidUnregisterWindow = new event.Emitter<CodeWindow>();
	const onWillUnregisterWindow = new event.Emitter<CodeWindow>();

	function getWindowById(windowId: number): IRegisteredCodeWindow | undefined;
	function getWindowById(windowId: number | undefined, fallbackToMain: true): IRegisteredCodeWindow;
	function getWindowById(windowId: number | undefined, fallbackToMain?: boolean): IRegisteredCodeWindow | undefined {
		const window = typeof windowId === 'number' ? windows.get(windowId) : undefined;

		return window ?? (fallbackToMain ? mainWindowRegistration : undefined);
	}

	return {
		onDidRegisterWindow: onDidRegisterWindow.event,
		onWillUnregisterWindow: onWillUnregisterWindow.event,
		onDidUnregisterWindow: onDidUnregisterWindow.event,
		registerWindow(window: CodeWindow): IDisposable {
			if (windows.has(window.vscodeWindowId)) {
				return Disposable.None;
			}

			const disposables = new DisposableStore();

			const registeredWindow = {
				window,
				disposables: disposables.add(new DisposableStore())
			};
			windows.set(window.vscodeWindowId, registeredWindow);

			disposables.add(toDisposable(() => {
				windows.delete(window.vscodeWindowId);
				onDidUnregisterWindow.fire(window);
			}));

			disposables.add(addDisposableListener(window, EventType.BEFORE_UNLOAD, () => {
				onWillUnregisterWindow.fire(window);
			}));

			onDidRegisterWindow.fire(registeredWindow);

			return disposables;
		},
		getWindows(): Iterable<IRegisteredCodeWindow> {
			return windows.values();
		},
		getWindowsCount(): number {
			return windows.size;
		},
		getWindowId(targetWindow: Window): number {
			return (targetWindow as CodeWindow).vscodeWindowId;
		},
		hasWindow(windowId: number): boolean {
			return windows.has(windowId);
		},
		getWindowById,
		getWindow(e: Node | UIEvent | undefined | null): CodeWindow {
			const candidateNode = e as Node | undefined | null;
			if (candidateNode?.ownerDocument?.defaultView) {
				return candidateNode.ownerDocument.defaultView.window as CodeWindow;
			}

			const candidateEvent = e as UIEvent | undefined | null;
			if (candidateEvent?.view) {
				return candidateEvent.view.window as CodeWindow;
			}

			return mainWindow;
		},
		getDocument(e: Node | UIEvent | undefined | null): Document {
			const candidateNode = e as Node | undefined | null;
			return getWindow(candidateNode).document;
		}
	};
})();

//#endregion

export function clearNode(node: HTMLElement): void {
	while (node.firstChild) {
		node.firstChild.remove();
	}
}

class DomListener implements IDisposable {

	private _handler: (e: any) => void;
	private _node: EventTarget;
	private readonly _type: string;
	private readonly _options: boolean | AddEventListenerOptions;

	constructor(node: EventTarget, type: string, handler: (e: any) => void, options?: boolean | AddEventListenerOptions) {
		this._node = node;
		this._type = type;
		this._handler = handler;
		this._options = (options || false);
		this._node.addEventListener(this._type, this._handler, this._options);
	}

	dispose(): void {
		if (!this._handler) {
			// Already disposed
			return;
		}

		this._node.removeEventListener(this._type, this._handler, this._options);

		// Prevent leakers from holding on to the dom or handler func
		this._node = null!;
		this._handler = null!;
	}
}

export function addDisposableListener<K extends keyof GlobalEventHandlersEventMap>(node: EventTarget, type: K, handler: (event: GlobalEventHandlersEventMap[K]) => void, useCapture?: boolean): IDisposable;
export function addDisposableListener(node: EventTarget, type: string, handler: (event: any) => void, useCapture?: boolean): IDisposable;
export function addDisposableListener(node: EventTarget, type: string, handler: (event: any) => void, options: AddEventListenerOptions): IDisposable;
export function addDisposableListener(node: EventTarget, type: string, handler: (event: any) => void, useCaptureOrOptions?: boolean | AddEventListenerOptions): IDisposable {
	return new DomListener(node, type, handler, useCaptureOrOptions);
}

export interface IAddStandardDisposableListenerSignature {
	(node: HTMLElement | Element | Document, type: 'click', handler: (event: IMouseEvent) => void, useCapture?: boolean): IDisposable;
	(node: HTMLElement | Element | Document, type: 'mousedown', handler: (event: IMouseEvent) => void, useCapture?: boolean): IDisposable;
	(node: HTMLElement | Element | Document, type: 'keydown', handler: (event: IKeyboardEvent) => void, useCapture?: boolean): IDisposable;
	(node: HTMLElement | Element | Document, type: 'keypress', handler: (event: IKeyboardEvent) => void, useCapture?: boolean): IDisposable;
	(node: HTMLElement | Element | Document, type: 'keyup', handler: (event: IKeyboardEvent) => void, useCapture?: boolean): IDisposable;
	(node: HTMLElement | Element | Document, type: 'pointerdown', handler: (event: PointerEvent) => void, useCapture?: boolean): IDisposable;
	(node: HTMLElement | Element | Document, type: 'pointermove', handler: (event: PointerEvent) => void, useCapture?: boolean): IDisposable;
	(node: HTMLElement | Element | Document, type: 'pointerup', handler: (event: PointerEvent) => void, useCapture?: boolean): IDisposable;
	(node: HTMLElement | Element | Document, type: string, handler: (event: any) => void, useCapture?: boolean): IDisposable;
}
function _wrapAsStandardMouseEvent(targetWindow: Window, handler: (e: IMouseEvent) => void): (e: MouseEvent) => void {
	return function (e: MouseEvent) {
		return handler(new StandardMouseEvent(targetWindow, e));
	};
}
function _wrapAsStandardKeyboardEvent(handler: (e: IKeyboardEvent) => void): (e: KeyboardEvent) => void {
	return function (e: KeyboardEvent) {
		return handler(new StandardKeyboardEvent(e));
	};
}
export const addStandardDisposableListener: IAddStandardDisposableListenerSignature = function addStandardDisposableListener(node: HTMLElement | Element | Document, type: string, handler: (event: any) => void, useCapture?: boolean): IDisposable {
	let wrapHandler = handler;

	if (type === 'click' || type === 'mousedown' || type === 'contextmenu') {
		wrapHandler = _wrapAsStandardMouseEvent(getWindow(node), handler);
	} else if (type === 'keydown' || type === 'keypress' || type === 'keyup') {
		wrapHandler = _wrapAsStandardKeyboardEvent(handler);
	}

	return addDisposableListener(node, type, wrapHandler, useCapture);
};

export const addStandardDisposableGenericMouseDownListener = function addStandardDisposableListener(node: HTMLElement, handler: (event: any) => void, useCapture?: boolean): IDisposable {
	const wrapHandler = _wrapAsStandardMouseEvent(getWindow(node), handler);

	return addDisposableGenericMouseDownListener(node, wrapHandler, useCapture);
};

export const addStandardDisposableGenericMouseUpListener = function addStandardDisposableListener(node: HTMLElement, handler: (event: any) => void, useCapture?: boolean): IDisposable {
	const wrapHandler = _wrapAsStandardMouseEvent(getWindow(node), handler);

	return addDisposableGenericMouseUpListener(node, wrapHandler, useCapture);
};
export function addDisposableGenericMouseDownListener(node: EventTarget, handler: (event: any) => void, useCapture?: boolean): IDisposable {
	return addDisposableListener(node, platform.isIOS && BrowserFeatures.pointerEvents ? EventType.POINTER_DOWN : EventType.MOUSE_DOWN, handler, useCapture);
}

export function addDisposableGenericMouseMoveListener(node: EventTarget, handler: (event: any) => void, useCapture?: boolean): IDisposable {
	return addDisposableListener(node, platform.isIOS && BrowserFeatures.pointerEvents ? EventType.POINTER_MOVE : EventType.MOUSE_MOVE, handler, useCapture);
}

export function addDisposableGenericMouseUpListener(node: EventTarget, handler: (event: any) => void, useCapture?: boolean): IDisposable {
	return addDisposableListener(node, platform.isIOS && BrowserFeatures.pointerEvents ? EventType.POINTER_UP : EventType.MOUSE_UP, handler, useCapture);
}

/**
 * Execute the callback the next time the browser is idle, returning an
 * {@link IDisposable} that will cancel the callback when disposed. This wraps
 * [requestIdleCallback] so it will fallback to [setTimeout] if the environment
 * doesn't support it.
 *
 * @param targetWindow The window for which to run the idle callback
 * @param callback The callback to run when idle, this includes an
 * [IdleDeadline] that provides the time alloted for the idle callback by the
 * browser. Not respecting this deadline will result in a degraded user
 * experience.
 * @param timeout A timeout at which point to queue no longer wait for an idle
 * callback but queue it on the regular event loop (like setTimeout). Typically
 * this should not be used.
 *
 * [IdleDeadline]: https://developer.mozilla.org/en-US/docs/Web/API/IdleDeadline
 * [requestIdleCallback]: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
 * [setTimeout]: https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout
 */
export function runWhenWindowIdle(targetWindow: Window | typeof globalThis, callback: (idle: IdleDeadline) => void, timeout?: number): IDisposable {
	return _runWhenIdle(targetWindow, callback, timeout);
}

/**
 * An implementation of the "idle-until-urgent"-strategy as introduced
 * here: https://philipwalton.com/articles/idle-until-urgent/
 */
export class WindowIdleValue<T> extends AbstractIdleValue<T> {
	constructor(targetWindow: Window | typeof globalThis, executor: () => T) {
		super(targetWindow, executor);
	}
}

/**
 * Schedule a callback to be run at the next animation frame.
 * This allows multiple parties to register callbacks that should run at the next animation frame.
 * If currently in an animation frame, `runner` will be executed immediately.
 * @return token that can be used to cancel the scheduled runner (only if `runner` was not executed immediately).
 */
export let runAtThisOrScheduleAtNextAnimationFrame: (targetWindow: Window, runner: () => void, priority?: number) => IDisposable;
/**
 * Schedule a callback to be run at the next animation frame.
 * This allows multiple parties to register callbacks that should run at the next animation frame.
 * If currently in an animation frame, `runner` will be executed at the next animation frame.
 * @return token that can be used to cancel the scheduled runner.
 */
export let scheduleAtNextAnimationFrame: (targetWindow: Window, runner: () => void, priority?: number) => IDisposable;

export function disposableWindowInterval(targetWindow: Window, handler: () => void | boolean /* stop interval */ | Promise<unknown>, interval: number, iterations?: number): IDisposable {
	let iteration = 0;
	const timer = targetWindow.setInterval(() => {
		iteration++;
		if ((typeof iterations === 'number' && iteration >= iterations) || handler() === true) {
			disposable.dispose();
		}
	}, interval);
	const disposable = toDisposable(() => {
		targetWindow.clearInterval(timer);
	});
	return disposable;
}

export class WindowIntervalTimer extends IntervalTimer {

	private readonly defaultTarget?: Window & typeof globalThis;

	/**
	 *
	 * @param node The optional node from which the target window is determined
	 */
	constructor(node?: Node) {
		super();
		this.defaultTarget = node && getWindow(node);
	}

	override cancelAndSet(runner: () => void, interval: number, targetWindow?: Window & typeof globalThis): void {
		return super.cancelAndSet(runner, interval, targetWindow ?? this.defaultTarget);
	}
}

class AnimationFrameQueueItem implements IDisposable {

	private _runner: () => void;
	public priority: number;
	private _canceled: boolean;

	constructor(runner: () => void, priority: number = 0) {
		this._runner = runner;
		this.priority = priority;
		this._canceled = false;
	}

	dispose(): void {
		this._canceled = true;
	}

	execute(): void {
		if (this._canceled) {
			return;
		}

		try {
			this._runner();
		} catch (e) {
			onUnexpectedError(e);
		}
	}

	// Sort by priority (largest to lowest)
	static sort(a: AnimationFrameQueueItem, b: AnimationFrameQueueItem): number {
		return b.priority - a.priority;
	}
}

(function () {
	/**
	 * The runners scheduled at the next animation frame
	 */
	const NEXT_QUEUE = new Map<number /* window ID */, AnimationFrameQueueItem[]>();
	/**
	 * The runners scheduled at the current animation frame
	 */
	const CURRENT_QUEUE = new Map<number /* window ID */, AnimationFrameQueueItem[]>();
	/**
	 * A flag to keep track if the native requestAnimationFrame was already called
	 */
	const animFrameRequested = new Map<number /* window ID */, boolean>();
	/**
	 * A flag to indicate if currently handling a native requestAnimationFrame callback
	 */
	const inAnimationFrameRunner = new Map<number /* window ID */, boolean>();

	const animationFrameRunner = (targetWindowId: number) => {
		animFrameRequested.set(targetWindowId, false);

		const currentQueue = NEXT_QUEUE.get(targetWindowId) ?? [];
		CURRENT_QUEUE.set(targetWindowId, currentQueue);
		NEXT_QUEUE.set(targetWindowId, []);

		inAnimationFrameRunner.set(targetWindowId, true);
		while (currentQueue.length > 0) {
			currentQueue.sort(AnimationFrameQueueItem.sort);
			const top = currentQueue.shift()!;
			top.execute();
		}
		inAnimationFrameRunner.set(targetWindowId, false);
	};

	scheduleAtNextAnimationFrame = (targetWindow: Window, runner: () => void, priority: number = 0) => {
		const targetWindowId = getWindowId(targetWindow);
		const item = new AnimationFrameQueueItem(runner, priority);

		let nextQueue = NEXT_QUEUE.get(targetWindowId);
		if (!nextQueue) {
			nextQueue = [];
			NEXT_QUEUE.set(targetWindowId, nextQueue);
		}
		nextQueue.push(item);

		if (!animFrameRequested.get(targetWindowId)) {
			animFrameRequested.set(targetWindowId, true);
			targetWindow.requestAnimationFrame(() => animationFrameRunner(targetWindowId));
		}

		return item;
	};

	runAtThisOrScheduleAtNextAnimationFrame = (targetWindow: Window, runner: () => void, priority?: number) => {
		const targetWindowId = getWindowId(targetWindow);
		if (inAnimationFrameRunner.get(targetWindowId)) {
			const item = new AnimationFrameQueueItem(runner, priority);
			let currentQueue = CURRENT_QUEUE.get(targetWindowId);
			if (!currentQueue) {
				currentQueue = [];
				CURRENT_QUEUE.set(targetWindowId, currentQueue);
			}
			currentQueue.push(item);
			return item;
		} else {
			return scheduleAtNextAnimationFrame(targetWindow, runner, priority);
		}
	};
})();

export function measure(targetWindow: Window, callback: () => void): IDisposable {
	return scheduleAtNextAnimationFrame(targetWindow, callback, 10000 /* must be early */);
}

export function modify(targetWindow: Window, callback: () => void): IDisposable {
	return scheduleAtNextAnimationFrame(targetWindow, callback, -10000 /* must be late */);
}

/**
 * Add a throttled listener. `handler` is fired at most every 8.33333ms or with the next animation frame (if browser supports it).
 */
export interface IEventMerger<R, E> {
	(lastEvent: R | null, currentEvent: E): R;
}

const MINIMUM_TIME_MS = 8;
function DEFAULT_EVENT_MERGER<T>(_lastEvent: unknown, currentEvent: T) {
	return currentEvent;
}

class TimeoutThrottledDomListener<R, E extends Event> extends Disposable {

	constructor(node: Node, type: string, handler: (event: R) => void, eventMerger: IEventMerger<R, E> = DEFAULT_EVENT_MERGER as IEventMerger<R, E>, minimumTimeMs: number = MINIMUM_TIME_MS) {
		super();

		let lastEvent: R | null = null;
		let lastHandlerTime = 0;
		const timeout = this._register(new TimeoutTimer());

		const invokeHandler = () => {
			lastHandlerTime = (new Date()).getTime();
			handler(<R>lastEvent);
			lastEvent = null;
		};

		this._register(addDisposableListener(node, type, (e) => {

			lastEvent = eventMerger(lastEvent, e);
			const elapsedTime = (new Date()).getTime() - lastHandlerTime;

			if (elapsedTime >= minimumTimeMs) {
				timeout.cancel();
				invokeHandler();
			} else {
				timeout.setIfNotSet(invokeHandler, minimumTimeMs - elapsedTime);
			}
		}));
	}
}

export function addDisposableThrottledListener<R, E extends Event = Event>(node: any, type: string, handler: (event: R) => void, eventMerger?: IEventMerger<R, E>, minimumTimeMs?: number): IDisposable {
	return new TimeoutThrottledDomListener<R, E>(node, type, handler, eventMerger, minimumTimeMs);
}

export function getComputedStyle(el: HTMLElement): CSSStyleDeclaration {
	return getWindow(el).getComputedStyle(el, null);
}

export function getClientArea(element: HTMLElement, defaultValue?: Dimension, fallbackElement?: HTMLElement): Dimension {
	const elWindow = getWindow(element);
	const elDocument = elWindow.document;

	// Try with DOM clientWidth / clientHeight
	if (element !== elDocument.body) {
		return new Dimension(element.clientWidth, element.clientHeight);
	}

	// If visual view port exits and it's on mobile, it should be used instead of window innerWidth / innerHeight, or document.body.clientWidth / document.body.clientHeight
	if (platform.isIOS && elWindow?.visualViewport) {
		return new Dimension(elWindow.visualViewport.width, elWindow.visualViewport.height);
	}

	// Try innerWidth / innerHeight
	if (elWindow?.innerWidth && elWindow.innerHeight) {
		return new Dimension(elWindow.innerWidth, elWindow.innerHeight);
	}

	// Try with document.body.clientWidth / document.body.clientHeight
	if (elDocument.body && elDocument.body.clientWidth && elDocument.body.clientHeight) {
		return new Dimension(elDocument.body.clientWidth, elDocument.body.clientHeight);
	}

	// Try with document.documentElement.clientWidth / document.documentElement.clientHeight
	if (elDocument.documentElement && elDocument.documentElement.clientWidth && elDocument.documentElement.clientHeight) {
		return new Dimension(elDocument.documentElement.clientWidth, elDocument.documentElement.clientHeight);
	}

	if (fallbackElement) {
		return getClientArea(fallbackElement, defaultValue);
	}

	if (defaultValue) {
		return defaultValue;
	}

	throw new Error('Unable to figure out browser width and height');
}

class SizeUtils {
	// Adapted from WinJS
	// Converts a CSS positioning string for the specified element to pixels.
	private static convertToPixels(element: HTMLElement, value: string): number {
		return parseFloat(value) || 0;
	}

	private static getDimension(element: HTMLElement, cssPropertyName: string): number {
		const computedStyle = getComputedStyle(element);
		const value = computedStyle ? computedStyle.getPropertyValue(cssPropertyName) : '0';
		return SizeUtils.convertToPixels(element, value);
	}

	static getBorderLeftWidth(element: HTMLElement): number {
		return SizeUtils.getDimension(element, 'border-left-width');
	}
	static getBorderRightWidth(element: HTMLElement): number {
		return SizeUtils.getDimension(element, 'border-right-width');
	}
	static getBorderTopWidth(element: HTMLElement): number {
		return SizeUtils.getDimension(element, 'border-top-width');
	}
	static getBorderBottomWidth(element: HTMLElement): number {
		return SizeUtils.getDimension(element, 'border-bottom-width');
	}

	static getPaddingLeft(element: HTMLElement): number {
		return SizeUtils.getDimension(element, 'padding-left');
	}
	static getPaddingRight(element: HTMLElement): number {
		return SizeUtils.getDimension(element, 'padding-right');
	}
	static getPaddingTop(element: HTMLElement): number {
		return SizeUtils.getDimension(element, 'padding-top');
	}
	static getPaddingBottom(element: HTMLElement): number {
		return SizeUtils.getDimension(element, 'padding-bottom');
	}

	static getMarginLeft(element: HTMLElement): number {
		return SizeUtils.getDimension(element, 'margin-left');
	}
	static getMarginTop(element: HTMLElement): number {
		return SizeUtils.getDimension(element, 'margin-top');
	}
	static getMarginRight(element: HTMLElement): number {
		return SizeUtils.getDimension(element, 'margin-right');
	}
	static getMarginBottom(element: HTMLElement): number {
		return SizeUtils.getDimension(element, 'margin-bottom');
	}
}

// ----------------------------------------------------------------------------------------
// Position & Dimension

export interface IDimension {
	readonly width: number;
	readonly height: number;
}

export class Dimension implements IDimension {

	static readonly None = new Dimension(0, 0);

	constructor(
		readonly width: number,
		readonly height: number,
	) { }

	with(width: number = this.width, height: number = this.height): Dimension {
		if (width !== this.width || height !== this.height) {
			return new Dimension(width, height);
		} else {
			return this;
		}
	}

	static is(obj: unknown): obj is IDimension {
		return typeof obj === 'object' && typeof (<IDimension>obj).height === 'number' && typeof (<IDimension>obj).width === 'number';
	}

	static lift(obj: IDimension): Dimension {
		if (obj instanceof Dimension) {
			return obj;
		} else {
			return new Dimension(obj.width, obj.height);
		}
	}

	static equals(a: Dimension | undefined, b: Dimension | undefined): boolean {
		if (a === b) {
			return true;
		}
		if (!a || !b) {
			return false;
		}
		return a.width === b.width && a.height === b.height;
	}
}

export interface IDomPosition {
	readonly left: number;
	readonly top: number;
}

export function getTopLeftOffset(element: HTMLElement): IDomPosition {
	// Adapted from WinJS.Utilities.getPosition
	// and added borders to the mix

	let offsetParent = element.offsetParent;
	let top = element.offsetTop;
	let left = element.offsetLeft;

	while (
		(element = <HTMLElement>element.parentNode) !== null
		&& element !== element.ownerDocument.body
		&& element !== element.ownerDocument.documentElement
	) {
		top -= element.scrollTop;
		const c = isShadowRoot(element) ? null : getComputedStyle(element);
		if (c) {
			left -= c.direction !== 'rtl' ? element.scrollLeft : -element.scrollLeft;
		}

		if (element === offsetParent) {
			left += SizeUtils.getBorderLeftWidth(element);
			top += SizeUtils.getBorderTopWidth(element);
			top += element.offsetTop;
			left += element.offsetLeft;
			offsetParent = element.offsetParent;
		}
	}

	return {
		left: left,
		top: top
	};
}

export interface IDomNodePagePosition {
	left: number;
	top: number;
	width: number;
	height: number;
}

export function size(element: HTMLElement, width: number | null, height: number | null): void {
	if (typeof width === 'number') {
		element.style.width = `${width}px`;
	}

	if (typeof height === 'number') {
		element.style.height = `${height}px`;
	}
}

export function position(element: HTMLElement, top: number, right?: number, bottom?: number, left?: number, position: string = 'absolute'): void {
	if (typeof top === 'number') {
		element.style.top = `${top}px`;
	}

	if (typeof right === 'number') {
		element.style.right = `${right}px`;
	}

	if (typeof bottom === 'number') {
		element.style.bottom = `${bottom}px`;
	}

	if (typeof left === 'number') {
		element.style.left = `${left}px`;
	}

	element.style.position = position;
}

/**
 * Returns the position of a dom node relative to the entire page.
 */
export function getDomNodePagePosition(domNode: HTMLElement): IDomNodePagePosition {
	const bb = domNode.getBoundingClientRect();
	const window = getWindow(domNode);
	return {
		left: bb.left + window.scrollX,
		top: bb.top + window.scrollY,
		width: bb.width,
		height: bb.height
	};
}

/**
 * Returns whether the element is in the bottom right quarter of the container.
 *
 * @param element the element to check for being in the bottom right quarter
 * @param container the container to check against
 * @returns true if the element is in the bottom right quarter of the container
 */
export function isElementInBottomRightQuarter(element: HTMLElement, container: HTMLElement): boolean {
	const position = getDomNodePagePosition(element);
	const clientArea = getClientArea(container);

	return position.left > clientArea.width / 2 && position.top > clientArea.height / 2;
}

/**
 * Returns the effective zoom on a given element before window zoom level is applied
 */
export function getDomNodeZoomLevel(domNode: HTMLElement): number {
	let testElement: HTMLElement | null = domNode;
	let zoom = 1.0;
	do {
		// eslint-disable-next-line local/code-no-any-casts
		const elementZoomLevel = (getComputedStyle(testElement) as any).zoom;
		if (elementZoomLevel !== null && elementZoomLevel !== undefined && elementZoomLevel !== '1') {
			zoom *= elementZoomLevel;
		}

		testElement = testElement.parentElement;
	} while (testElement !== null && testElement !== testElement.ownerDocument.documentElement);

	return zoom;
}


// Adapted from WinJS
// Gets the width of the element, including margins.
export function getTotalWidth(element: HTMLElement): number {
	const margin = SizeUtils.getMarginLeft(element) + SizeUtils.getMarginRight(element);
	return element.offsetWidth + margin;
}

export function getContentWidth(element: HTMLElement): number {
	const border = SizeUtils.getBorderLeftWidth(element) + SizeUtils.getBorderRightWidth(element);
	const padding = SizeUtils.getPaddingLeft(element) + SizeUtils.getPaddingRight(element);
	return element.offsetWidth - border - padding;
}

export function getTotalScrollWidth(element: HTMLElement): number {
	const margin = SizeUtils.getMarginLeft(element) + SizeUtils.getMarginRight(element);
	return element.scrollWidth + margin;
}

// Adapted from WinJS
// Gets the height of the content of the specified element. The content height does not include borders or padding.
export function getContentHeight(element: HTMLElement): number {
	const border = SizeUtils.getBorderTopWidth(element) + SizeUtils.getBorderBottomWidth(element);
	const padding = SizeUtils.getPaddingTop(element) + SizeUtils.getPaddingBottom(element);
	return element.offsetHeight - border - padding;
}

// Adapted from WinJS
// Gets the height of the element, including its margins.
export function getTotalHeight(element: HTMLElement): number {
	const margin = SizeUtils.getMarginTop(element) + SizeUtils.getMarginBottom(element);
	return element.offsetHeight + margin;
}

// Gets the left coordinate of the specified element relative to the specified parent.
function getRelativeLeft(element: HTMLElement, parent: HTMLElement): number {
	if (element === null) {
		return 0;
	}

	const elementPosition = getTopLeftOffset(element);
	const parentPosition = getTopLeftOffset(parent);
	return elementPosition.left - parentPosition.left;
}

export function getLargestChildWidth(parent: HTMLElement, children: HTMLElement[]): number {
	const childWidths = children.map((child) => {
		return Math.max(getTotalScrollWidth(child), getTotalWidth(child)) + getRelativeLeft(child, parent) || 0;
	});
	const maxWidth = Math.max(...childWidths);
	return maxWidth;
}

// ----------------------------------------------------------------------------------------

export function isAncestor(testChild: Node | null, testAncestor: Node | null): boolean {
	return Boolean(testAncestor?.contains(testChild));
}

const parentFlowToDataKey = 'parentFlowToElementId';

/**
 * Set an explicit parent to use for nodes that are not part of the
 * regular dom structure.
 */
export function setParentFlowTo(fromChildElement: HTMLElement, toParentElement: Element): void {
	fromChildElement.dataset[parentFlowToDataKey] = toParentElement.id;
}

function getParentFlowToElement(node: HTMLElement): HTMLElement | null {
	const flowToParentId = node.dataset[parentFlowToDataKey];
	if (typeof flowToParentId === 'string') {
		// eslint-disable-next-line no-restricted-syntax
		return node.ownerDocument.getElementById(flowToParentId);
	}
	return null;
}

/**
 * Check if `testAncestor` is an ancestor of `testChild`, observing the explicit
 * parents set by `setParentFlowTo`.
 */
export function isAncestorUsingFlowTo(testChild: Node, testAncestor: Node): boolean {
	let node: Node | null = testChild;
	while (node) {
		if (node === testAncestor) {
			return true;
		}

		if (isHTMLElement(node)) {
			const flowToParentElement = getParentFlowToElement(node);
			if (flowToParentElement) {
				node = flowToParentElement;
				continue;
			}
		}
		node = node.parentNode;
	}

	return false;
}

export function findParentWithClass(node: HTMLElement, clazz: string, stopAtClazzOrNode?: string | HTMLElement): HTMLElement | null {
	while (node && node.nodeType === node.ELEMENT_NODE) {
		if (node.classList.contains(clazz)) {
			return node;
		}

		if (stopAtClazzOrNode) {
			if (typeof stopAtClazzOrNode === 'string') {
				if (node.classList.contains(stopAtClazzOrNode)) {
					return null;
				}
			} else {
				if (node === stopAtClazzOrNode) {
					return null;
				}
			}
		}

		node = <HTMLElement>node.parentNode;
	}

	return null;
}

export function hasParentWithClass(node: HTMLElement, clazz: string, stopAtClazzOrNode?: string | HTMLElement): boolean {
	return !!findParentWithClass(node, clazz, stopAtClazzOrNode);
}

export function isShadowRoot(node: Node): node is ShadowRoot {
	return (
		node && !!(<ShadowRoot>node).host && !!(<ShadowRoot>node).mode
	);
}

export function isInShadowDOM(domNode: Node): boolean {
	return !!getShadowRoot(domNode);
}

export function getShadowRoot(domNode: Node): ShadowRoot | null {
	while (domNode.parentNode) {
		if (domNode === domNode.ownerDocument?.body) {
			// reached the body
			return null;
		}
		domNode = domNode.parentNode;
	}
	return isShadowRoot(domNode) ? domNode : null;
}

/**
 * Returns the active element across all child windows
 * based on document focus. Falls back to the main
 * window if no window has focus.
 */
export function getActiveElement(): Element | null {
	let result = getActiveDocument().activeElement;

	while (result?.shadowRoot) {
		result = result.shadowRoot.activeElement;
	}

	return result;
}

/**
 * Returns true if the focused window active element matches
 * the provided element. Falls back to the main window if no
 * window has focus.
 */
export function isActiveElement(element: Element): boolean {
	return getActiveElement() === element;
}

/**
 * Returns true if the focused window active element is contained in
 * `ancestor`. Falls back to the main window if no window has focus.
 */
export function isAncestorOfActiveElement(ancestor: Element): boolean {
	return isAncestor(getActiveElement(), ancestor);
}

/**
 * Returns whether the element is in the active `document`. The active
 * document has focus or will be the main windows document.
 */
export function isActiveDocument(element: Element): boolean {
	return element.ownerDocument === getActiveDocument();
}

/**
 * Returns the active document across main and child windows.
 * Prefers the window with focus, otherwise falls back to
 * the main windows document.
 */
export function getActiveDocument(): Document {
	if (getWindowsCount() <= 1) {
		return mainWindow.document;
	}

	const documents = Array.from(getWindows()).map(({ window }) => window.document);
	return documents.find(doc => doc.hasFocus()) ?? mainWindow.document;
}

/**
 * Returns the active window across main and child windows.
 * Prefers the window with focus, otherwise falls back to
 * the main window.
 */
export function getActiveWindow(): CodeWindow {
	const document = getActiveDocument();
	return (document.defaultView?.window ?? mainWindow) as CodeWindow;
}

interface IMutationObserver {
	users: number;
	readonly observer: MutationObserver;
	readonly onDidMutate: event.Event<MutationRecord[]>;
}

export const sharedMutationObserver = new class {

	readonly mutationObservers = new Map<Node, Map<number, IMutationObserver>>();

	observe(target: Node, disposables: DisposableStore, options?: MutationObserverInit): event.Event<MutationRecord[]> {
		let mutationObserversPerTarget = this.mutationObservers.get(target);
		if (!mutationObserversPerTarget) {
			mutationObserversPerTarget = new Map<number, IMutationObserver>();
			this.mutationObservers.set(target, mutationObserversPerTarget);
		}

		const optionsHash = hash(options);
		let mutationObserverPerOptions = mutationObserversPerTarget.get(optionsHash);
		if (!mutationObserverPerOptions) {
			const onDidMutate = new event.Emitter<MutationRecord[]>();
			const observer = new MutationObserver(mutations => onDidMutate.fire(mutations));
			observer.observe(target, options);

			const resolvedMutationObserverPerOptions = mutationObserverPerOptions = {
				users: 1,
				observer,
				onDidMutate: onDidMutate.event
			};

			disposables.add(toDisposable(() => {
				resolvedMutationObserverPerOptions.users -= 1;

				if (resolvedMutationObserverPerOptions.users === 0) {
					onDidMutate.dispose();
					observer.disconnect();

					mutationObserversPerTarget?.delete(optionsHash);
					if (mutationObserversPerTarget?.size === 0) {
						this.mutationObservers.delete(target);
					}
				}
			}));

			mutationObserversPerTarget.set(optionsHash, mutationObserverPerOptions);
		} else {
			mutationObserverPerOptions.users += 1;
		}

		return mutationObserverPerOptions.onDidMutate;
	}
};

export function createMetaElement(container: HTMLElement = mainWindow.document.head): HTMLMetaElement {
	return createHeadElement('meta', container);
}

export function createLinkElement(container: HTMLElement = mainWindow.document.head): HTMLLinkElement {
	return createHeadElement('link', container);
}

function createHeadElement<K extends keyof HTMLElementTagNameMap>(tagName: K, container: HTMLElement = mainWindow.document.head): HTMLElementTagNameMap[K] {
	const element = document.createElement(tagName);
	container.appendChild(element);
	return element;
}

export function isHTMLElement(e: unknown): e is HTMLElement {
	// eslint-disable-next-line no-restricted-syntax
	return e instanceof HTMLElement || e instanceof getWindow(e as Node).HTMLElement;
}

export function isHTMLAnchorElement(e: unknown): e is HTMLAnchorElement {
	// eslint-disable-next-line no-restricted-syntax
	return e instanceof HTMLAnchorElement || e instanceof getWindow(e as Node).HTMLAnchorElement;
}

export function isHTMLSpanElement(e: unknown): e is HTMLSpanElement {
	// eslint-disable-next-line no-restricted-syntax
	return e instanceof HTMLSpanElement || e instanceof getWindow(e as Node).HTMLSpanElement;
}

export function isHTMLTextAreaElement(e: unknown): e is HTMLTextAreaElement {
	// eslint-disable-next-line no-restricted-syntax
	return e instanceof HTMLTextAreaElement || e instanceof getWindow(e as Node).HTMLTextAreaElement;
}

export function isHTMLInputElement(e: unknown): e is HTMLInputElement {
	// eslint-disable-next-line no-restricted-syntax
	return e instanceof HTMLInputElement || e instanceof getWindow(e as Node).HTMLInputElement;
}

export function isHTMLButtonElement(e: unknown): e is HTMLButtonElement {
	// eslint-disable-next-line no-restricted-syntax
	return e instanceof HTMLButtonElement || e instanceof getWindow(e as Node).HTMLButtonElement;
}

export function isHTMLDivElement(e: unknown): e is HTMLDivElement {
	// eslint-disable-next-line no-restricted-syntax
	return e instanceof HTMLDivElement || e instanceof getWindow(e as Node).HTMLDivElement;
}

export function isSVGElement(e: unknown): e is SVGElement {
	// eslint-disable-next-line no-restricted-syntax
	return e instanceof SVGElement || e instanceof getWindow(e as Node).SVGElement;
}

export function isMouseEvent(e: unknown): e is MouseEvent {
	// eslint-disable-next-line no-restricted-syntax
	return e instanceof MouseEvent || e instanceof getWindow(e as UIEvent).MouseEvent;
}

export function isKeyboardEvent(e: unknown): e is KeyboardEvent {
	// eslint-disable-next-line no-restricted-syntax
	return e instanceof KeyboardEvent || e instanceof getWindow(e as UIEvent).KeyboardEvent;
}

export function isPointerEvent(e: unknown): e is PointerEvent {
	// eslint-disable-next-line no-restricted-syntax
	return e instanceof PointerEvent || e instanceof getWindow(e as UIEvent).PointerEvent;
}

export function isDragEvent(e: unknown): e is DragEvent {
	// eslint-disable-next-line no-restricted-syntax
	return e instanceof DragEvent || e instanceof getWindow(e as UIEvent).DragEvent;
}

export const EventType = {
	// Mouse
	CLICK: 'click',
	AUXCLICK: 'auxclick',
	DBLCLICK: 'dblclick',
	MOUSE_UP: 'mouseup',
	MOUSE_DOWN: 'mousedown',
	MOUSE_OVER: 'mouseover',
	MOUSE_MOVE: 'mousemove',
	MOUSE_OUT: 'mouseout',
	MOUSE_ENTER: 'mouseenter',
	MOUSE_LEAVE: 'mouseleave',
	MOUSE_WHEEL: 'wheel',
	POINTER_UP: 'pointerup',
	POINTER_DOWN: 'pointerdown',
	POINTER_MOVE: 'pointermove',
	POINTER_LEAVE: 'pointerleave',
	CONTEXT_MENU: 'contextmenu',
	WHEEL: 'wheel',
	// Keyboard
	KEY_DOWN: 'keydown',
	KEY_PRESS: 'keypress',
	KEY_UP: 'keyup',
	// HTML Document
	LOAD: 'load',
	BEFORE_UNLOAD: 'beforeunload',
	UNLOAD: 'unload',
	PAGE_SHOW: 'pageshow',
	PAGE_HIDE: 'pagehide',
	PASTE: 'paste',
	ABORT: 'abort',
	ERROR: 'error',
	RESIZE: 'resize',
	SCROLL: 'scroll',
	FULLSCREEN_CHANGE: 'fullscreenchange',
	WK_FULLSCREEN_CHANGE: 'webkitfullscreenchange',
	// Form
	SELECT: 'select',
	CHANGE: 'change',
	SUBMIT: 'submit',
	RESET: 'reset',
	FOCUS: 'focus',
	FOCUS_IN: 'focusin',
	FOCUS_OUT: 'focusout',
	BLUR: 'blur',
	INPUT: 'input',
	// Local Storage
	STORAGE: 'storage',
	// Drag
	DRAG_START: 'dragstart',
	DRAG: 'drag',
	DRAG_ENTER: 'dragenter',
	DRAG_LEAVE: 'dragleave',
	DRAG_OVER: 'dragover',
	DROP: 'drop',
	DRAG_END: 'dragend',
	// Animation
	ANIMATION_START: browser.isWebKit ? 'webkitAnimationStart' : 'animationstart',
	ANIMATION_END: browser.isWebKit ? 'webkitAnimationEnd' : 'animationend',
	ANIMATION_ITERATION: browser.isWebKit ? 'webkitAnimationIteration' : 'animationiteration'
} as const;

export interface EventLike {
	preventDefault(): void;
	stopPropagation(): void;
}

export function isEventLike(obj: unknown): obj is EventLike {
	const candidate = obj as EventLike | undefined;

	return !!(candidate && typeof candidate.preventDefault === 'function' && typeof candidate.stopPropagation === 'function');
}

export const EventHelper = {
	stop: <T extends EventLike>(e: T, cancelBubble?: boolean): T => {
		e.preventDefault();
		if (cancelBubble) {
			e.stopPropagation();
		}
		return e;
	}
};

export interface IFocusTracker extends Disposable {
	readonly onDidFocus: event.Event<void>;
	readonly onDidBlur: event.Event<void>;
	refreshState(): void;
}

export function saveParentsScrollTop(node: Element): number[] {
	const r: number[] = [];
	for (let i = 0; node && node.nodeType === node.ELEMENT_NODE; i++) {
		r[i] = node.scrollTop;
		node = <Element>node.parentNode;
	}
	return r;
}

export function restoreParentsScrollTop(node: Element, state: number[]): void {
	for (let i = 0; node && node.nodeType === node.ELEMENT_NODE; i++) {
		if (node.scrollTop !== state[i]) {
			node.scrollTop = state[i];
		}
		node = <Element>node.parentNode;
	}
}

class FocusTracker extends Disposable implements IFocusTracker {

	private readonly _onDidFocus = this._register(new event.Emitter<void>());
	get onDidFocus() { return this._onDidFocus.event; }

	private readonly _onDidBlur = this._register(new event.Emitter<void>());
	get onDidBlur() { return this._onDidBlur.event; }

	private _refreshStateHandler: () => void;

	private static hasFocusWithin(element: HTMLElement | Window): boolean {
		if (isHTMLElement(element)) {
			const shadowRoot = getShadowRoot(element);
			const activeElement = (shadowRoot ? shadowRoot.activeElement : element.ownerDocument.activeElement);
			return isAncestor(activeElement, element);
		} else {
			const window = element;
			return isAncestor(window.document.activeElement, window.document);
		}
	}

	constructor(element: HTMLElement | Window) {
		super();
		let hasFocus = FocusTracker.hasFocusWithin(element);
		let loosingFocus = false;

		const onFocus = () => {
			loosingFocus = false;
			if (!hasFocus) {
				hasFocus = true;
				this._onDidFocus.fire();
			}
		};

		const onBlur = () => {
			if (hasFocus) {
				loosingFocus = true;
				(isHTMLElement(element) ? getWindow(element) : element).setTimeout(() => {
					if (loosingFocus) {
						loosingFocus = false;
						hasFocus = false;
						this._onDidBlur.fire();
					}
				}, 0);
			}
		};

		this._refreshStateHandler = () => {
			const currentNodeHasFocus = FocusTracker.hasFocusWithin(<HTMLElement>element);
			if (currentNodeHasFocus !== hasFocus) {
				if (hasFocus) {
					onBlur();
				} else {
					onFocus();
				}
			}
		};

		this._register(addDisposableListener(element, EventType.FOCUS, onFocus, true));
		this._register(addDisposableListener(element, EventType.BLUR, onBlur, true));
		if (isHTMLElement(element)) {
			this._register(addDisposableListener(element, EventType.FOCUS_IN, () => this._refreshStateHandler()));
			this._register(addDisposableListener(element, EventType.FOCUS_OUT, () => this._refreshStateHandler()));
		}

	}

	refreshState() {
		this._refreshStateHandler();
	}
}

/**
 * Creates a new `IFocusTracker` instance that tracks focus changes on the given `element` and its descendants.
 *
 * @param element The `HTMLElement` or `Window` to track focus changes on.
 * @returns An `IFocusTracker` instance.
 */
export function trackFocus(element: HTMLElement | Window): IFocusTracker {
	return new FocusTracker(element);
}

export function after<T extends Node>(sibling: HTMLElement, child: T): T {
	sibling.after(child);
	return child;
}

export function append<T extends Node>(parent: HTMLElement, child: T): T;
export function append<T extends Node>(parent: HTMLElement, ...children: (T | string)[]): void;
export function append<T extends Node>(parent: HTMLElement, ...children: (T | string)[]): T | void {
	parent.append(...children);
	if (children.length === 1 && typeof children[0] !== 'string') {
		return children[0];
	}
}

export function prepend<T extends Node>(parent: HTMLElement, child: T): T {
	parent.insertBefore(child, parent.firstChild);
	return child;
}

/**
 * Removes all children from `parent` and appends `children`
 */
export function reset(parent: HTMLElement, ...children: Array<Node | string>): void {
	parent.textContent = '';
	append(parent, ...children);
}

const SELECTOR_REGEX = /([\w\-]+)?(#([\w\-]+))?((\.([\w\-]+))*)/;

export enum Namespace {
	HTML = 'http://www.w3.org/1999/xhtml',
	SVG = 'http://www.w3.org/2000/svg'
}

function _$<T extends Element>(namespace: Namespace, description: string, attrs?: { [key: string]: any }, ...children: Array<Node | string>): T {
	const match = SELECTOR_REGEX.exec(description);

	if (!match) {
		throw new Error('Bad use of emmet');
	}

	const tagName = match[1] || 'div';
	let result: T;

	if (namespace !== Namespace.HTML) {
		result = document.createElementNS(namespace as string, tagName) as T;
	} else {
		result = document.createElement(tagName) as unknown as T;
	}

	if (match[3]) {
		result.id = match[3];
	}
	if (match[4]) {
		result.className = match[4].replace(/\./g, ' ').trim();
	}

	if (attrs) {
		Object.entries(attrs).forEach(([name, value]) => {
			if (typeof value === 'undefined') {
				return;
			}

			if (/^on\w+$/.test(name)) {
				// eslint-disable-next-line local/code-no-any-casts
				(<any>result)[name] = value;
			} else if (name === 'selected') {
				if (value) {
					result.setAttribute(name, 'true');
				}

			} else {
				result.setAttribute(name, value);
			}
		});
	}

	result.append(...children);

	return result;
}

export function $<T extends HTMLElement>(description: string, attrs?: { [key: string]: any }, ...children: Array<Node | string>): T {
	return _$(Namespace.HTML, description, attrs, ...children);
}

$.SVG = function <T extends SVGElement>(description: string, attrs?: { [key: string]: any }, ...children: Array<Node | string>): T {
	return _$(Namespace.SVG, description, attrs, ...children);
};

export function join(nodes: Node[], separator: Node | string): Node[] {
	const result: Node[] = [];

	nodes.forEach((node, index) => {
		if (index > 0) {
			if (separator instanceof Node) {
				result.push(separator.cloneNode());
			} else {
				result.push(document.createTextNode(separator));
			}
		}

		result.push(node);
	});

	return result;
}

export function setVisibility(visible: boolean, ...elements: HTMLElement[]): void {
	if (visible) {
		show(...elements);
	} else {
		hide(...elements);
	}
}

export function show(...elements: HTMLElement[]): void {
	for (const element of elements) {
		element.style.display = '';
		element.removeAttribute('aria-hidden');
	}
}

export function hide(...elements: HTMLElement[]): void {
	for (const element of elements) {
		element.style.display = 'none';
		element.setAttribute('aria-hidden', 'true');
	}
}

function findParentWithAttribute(node: Node | null, attribute: string): HTMLElement | null {
	while (node && node.nodeType === node.ELEMENT_NODE) {
		if (isHTMLElement(node) && node.hasAttribute(attribute)) {
			return node;
		}

		node = node.parentNode;
	}

	return null;
}

export function removeTabIndexAndUpdateFocus(node: HTMLElement): void {
	if (!node || !node.hasAttribute('tabIndex')) {
		return;
	}

	// If we are the currently focused element and tabIndex is removed,
	// standard DOM behavior is to move focus to the <body> element. We
	// typically never want that, rather put focus to the closest element
	// in the hierarchy of the parent DOM nodes.
	if (node.ownerDocument.activeElement === node) {
		const parentFocusable = findParentWithAttribute(node.parentElement, 'tabIndex');
		parentFocusable?.focus();
	}

	node.removeAttribute('tabindex');
}

export function finalHandler<T extends Event>(fn: (event: T) => unknown): (event: T) => unknown {
	return e => {
		e.preventDefault();
		e.stopPropagation();
		fn(e);
	};
}

export function domContentLoaded(targetWindow: Window): Promise<void> {
	return new Promise<void>(resolve => {
		const readyState = targetWindow.document.readyState;
		if (readyState === 'complete' || (targetWindow.document && targetWindow.document.body !== null)) {
			resolve(undefined);
		} else {
			const listener = () => {
				targetWindow.window.removeEventListener('DOMContentLoaded', listener, false);
				resolve();
			};

			targetWindow.window.addEventListener('DOMContentLoaded', listener, false);
		}
	});
}

/**
 * Find a value usable for a dom node size such that the likelihood that it would be
 * displayed with constant screen pixels size is as high as possible.
 *
 * e.g. We would desire for the cursors to be 2px (CSS px) wide. Under a devicePixelRatio
 * of 1.25, the cursor will be 2.5 screen pixels wide. Depending on how the dom node aligns/"snaps"
 * with the screen pixels, it will sometimes be rendered with 2 screen pixels, and sometimes with 3 screen pixels.
 */
export function computeScreenAwareSize(window: Window, cssPx: number): number {
	const screenPx = window.devicePixelRatio * cssPx;
	return Math.max(1, Math.floor(screenPx)) / window.devicePixelRatio;
}

/**
 * Open safely a new window. This is the best way to do so, but you cannot tell
 * if the window was opened or if it was blocked by the browser's popup blocker.
 * If you want to tell if the browser blocked the new window, use {@link windowOpenWithSuccess}.
 *
 * See https://github.com/microsoft/monaco-editor/issues/601
 * To protect against malicious code in the linked site, particularly phishing attempts,
 * the window.opener should be set to null to prevent the linked site from having access
 * to change the location of the current page.
 * See https://mathiasbynens.github.io/rel-noopener/
 */
export function windowOpenNoOpener(url: string): void {
	// By using 'noopener' in the `windowFeatures` argument, the newly created window will
	// not be able to use `window.opener` to reach back to the current page.
	// See https://stackoverflow.com/a/46958731
	// See https://developer.mozilla.org/en-US/docs/Web/API/Window/open#noopener
	// However, this also doesn't allow us to realize if the browser blocked
	// the creation of the window.
	mainWindow.open(url, '_blank', 'noopener');
}

/**
 * Open a new window in a popup. This is the best way to do so, but you cannot tell
 * if the window was opened or if it was blocked by the browser's popup blocker.
 * If you want to tell if the browser blocked the new window, use {@link windowOpenWithSuccess}.
 *
 * Note: this does not set {@link window.opener} to null. This is to allow the opened popup to
 * be able to use {@link window.close} to close itself. Because of this, you should only use
 * this function on urls that you trust.
 *
 * In otherwords, you should almost always use {@link windowOpenNoOpener} instead of this function.
 */
const popupWidth = 780, popupHeight = 640;
export function windowOpenPopup(url: string): void {
	const left = Math.floor(mainWindow.screenLeft + mainWindow.innerWidth / 2 - popupWidth / 2);
	const top = Math.floor(mainWindow.screenTop + mainWindow.innerHeight / 2 - popupHeight / 2);
	mainWindow.open(
		url,
		'_blank',
		`width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
	);
}

/**
 * Attempts to open a window and returns whether it succeeded. This technique is
 * not appropriate in certain contexts, like for example when the JS context is
 * executing inside a sandboxed iframe. If it is not necessary to know if the
 * browser blocked the new window, use {@link windowOpenNoOpener}.
 *
 * See https://github.com/microsoft/monaco-editor/issues/601
 * See https://github.com/microsoft/monaco-editor/issues/2474
 * See https://mathiasbynens.github.io/rel-noopener/
 *
 * @param url the url to open
 * @param noOpener whether or not to set the {@link window.opener} to null. You should leave the default
 * (true) unless you trust the url that is being opened.
 * @returns boolean indicating if the {@link window.open} call succeeded
 */
export function windowOpenWithSuccess(url: string, noOpener = true): boolean {
	const newTab = mainWindow.open();
	if (newTab) {
		if (noOpener) {
			// see `windowOpenNoOpener` for details on why this is important
			// eslint-disable-next-line local/code-no-any-casts
			(newTab as any).opener = null;
		}
		newTab.location.href = url;
		return true;
	}
	return false;
}

export function animate(targetWindow: Window, fn: () => void): IDisposable {
	const step = () => {
		fn();
		stepDisposable = scheduleAtNextAnimationFrame(targetWindow, step);
	};

	let stepDisposable = scheduleAtNextAnimationFrame(targetWindow, step);
	return toDisposable(() => stepDisposable.dispose());
}

RemoteAuthorities.setPreferredWebSchema(/^https:/.test(mainWindow.location.href) ? 'https' : 'http');

export function triggerDownload(dataOrUri: Uint8Array | URI, name: string): void {

	// If the data is provided as Buffer, we create a
	// blob URL out of it to produce a valid link
	let url: string;
	if (URI.isUri(dataOrUri)) {
		url = dataOrUri.toString(true);
	} else {
		const blob = new Blob([dataOrUri as Uint8Array<ArrayBuffer>]);
		url = URL.createObjectURL(blob);

		// Ensure to free the data from DOM eventually
		setTimeout(() => URL.revokeObjectURL(url));
	}

	// In order to download from the browser, the only way seems
	// to be creating a <a> element with download attribute that
	// points to the file to download.
	// See also https://developers.google.com/web/updates/2011/08/Downloading-resources-in-HTML5-a-download
	const activeWindow = getActiveWindow();
	const anchor = document.createElement('a');
	activeWindow.document.body.appendChild(anchor);
	anchor.download = name;
	anchor.href = url;
	anchor.click();

	// Ensure to remove the element from DOM eventually
	setTimeout(() => anchor.remove());
}

export function triggerUpload(): Promise<FileList | undefined> {
	return new Promise<FileList | undefined>(resolve => {

		// In order to upload to the browser, create a
		// input element of type `file` and click it
		// to gather the selected files
		const activeWindow = getActiveWindow();
		const input = document.createElement('input');
		activeWindow.document.body.appendChild(input);
		input.type = 'file';
		input.multiple = true;

		// Resolve once the input event has fired once
		event.Event.once(event.Event.fromDOMEventEmitter(input, 'input'))(() => {
			resolve(input.files ?? undefined);
		});

		input.click();

		// Ensure to remove the element from DOM eventually
		setTimeout(() => input.remove());
	});
}

export interface INotification extends IDisposable {
	readonly onClick: event.Event<void>;
}

function sanitizeNotificationText(text: string): string {
	return text.replace(/`/g, '\''); // convert backticks to single quotes
}

export async function triggerNotification(message: string, options?: { detail?: string; sticky?: boolean }): Promise<INotification | undefined> {
	const permission = await Notification.requestPermission();
	if (permission !== 'granted') {
		return;
	}

	const disposables = new DisposableStore();

	const notification = new Notification(sanitizeNotificationText(message), {
		body: options?.detail ? sanitizeNotificationText(options.detail) : undefined,
		requireInteraction: options?.sticky,
	});

	const onClick = new event.Emitter<void>();
	disposables.add(addDisposableListener(notification, 'click', () => onClick.fire()));
	disposables.add(addDisposableListener(notification, 'close', () => disposables.dispose()));

	disposables.add(toDisposable(() => notification.close()));

	return {
		onClick: onClick.event,
		dispose: () => disposables.dispose()
	};
}

export enum DetectedFullscreenMode {

	/**
	 * The document is fullscreen, e.g. because an element
	 * in the document requested to be fullscreen.
	 */
	DOCUMENT = 1,

	/**
	 * The browser is fullscreen, e.g. because the user enabled
	 * native window fullscreen for it.
	 */
	BROWSER
}

export interface IDetectedFullscreen {

	/**
	 * Figure out if the document is fullscreen or the browser.
	 */
	mode: DetectedFullscreenMode;

	/**
	 * Whether we know for sure that we are in fullscreen mode or
	 * it is a guess.
	 */
	guess: boolean;
}

export function detectFullscreen(targetWindow: Window): IDetectedFullscreen | null {

	// Browser fullscreen: use DOM APIs to detect
	// eslint-disable-next-line local/code-no-any-casts
	if (targetWindow.document.fullscreenElement || (<any>targetWindow.document).webkitFullscreenElement || (<any>targetWindow.document).webkitIsFullScreen) {
		return { mode: DetectedFullscreenMode.DOCUMENT, guess: false };
	}

	// There is no standard way to figure out if the browser
	// is using native fullscreen. Via checking on screen
	// height and comparing that to window height, we can guess
	// it though.

	if (targetWindow.innerHeight === targetWindow.screen.height) {
		// if the height of the window matches the screen height, we can
		// safely assume that the browser is fullscreen because no browser
		// chrome is taking height away (e.g. like toolbars).
		return { mode: DetectedFullscreenMode.BROWSER, guess: false };
	}

	if (platform.isMacintosh || platform.isLinux) {
		// macOS and Linux do not properly report `innerHeight`, only Windows does
		if (targetWindow.outerHeight === targetWindow.screen.height && targetWindow.outerWidth === targetWindow.screen.width) {
			// if the height of the browser matches the screen height, we can
			// only guess that we are in fullscreen. It is also possible that
			// the user has turned off taskbars in the OS and the browser is
			// simply able to span the entire size of the screen.
			return { mode: DetectedFullscreenMode.BROWSER, guess: true };
		}
	}

	// Not in fullscreen
	return null;
}

type ModifierKey = 'alt' | 'ctrl' | 'shift' | 'meta';

export interface IModifierKeyStatus {
	altKey: boolean;
	shiftKey: boolean;
	ctrlKey: boolean;
	metaKey: boolean;
	lastKeyPressed?: ModifierKey;
	lastKeyReleased?: ModifierKey;
	event?: KeyboardEvent;
}

export class ModifierKeyEmitter extends event.Emitter<IModifierKeyStatus> {

	private readonly _subscriptions = new DisposableStore();
	private _keyStatus: IModifierKeyStatus;
	private static instance: ModifierKeyEmitter | undefined;

	private constructor() {
		super();

		this._keyStatus = {
			altKey: false,
			shiftKey: false,
			ctrlKey: false,
			metaKey: false
		};

		this._subscriptions.add(event.Event.runAndSubscribe(onDidRegisterWindow, ({ window, disposables }) => this.registerListeners(window, disposables), { window: mainWindow, disposables: this._subscriptions }));
	}

	private registerListeners(window: Window, disposables: DisposableStore): void {
		disposables.add(addDisposableListener(window, 'keydown', e => {
			if (e.defaultPrevented) {
				return;
			}

			const event = new StandardKeyboardEvent(e);
			// If Alt-key keydown event is repeated, ignore it #112347
			// Only known to be necessary for Alt-Key at the moment #115810
			if (event.keyCode === KeyCode.Alt && e.repeat) {
				return;
			}

			if (e.altKey && !this._keyStatus.altKey) {
				this._keyStatus.lastKeyPressed = 'alt';
			} else if (e.ctrlKey && !this._keyStatus.ctrlKey) {
				this._keyStatus.lastKeyPressed = 'ctrl';
			} else if (e.metaKey && !this._keyStatus.metaKey) {
				this._keyStatus.lastKeyPressed = 'meta';
			} else if (e.shiftKey && !this._keyStatus.shiftKey) {
				this._keyStatus.lastKeyPressed = 'shift';
			} else if (event.keyCode !== KeyCode.Alt) {
				this._keyStatus.lastKeyPressed = undefined;
			} else {
				return;
			}

			this._keyStatus.altKey = e.altKey;
			this._keyStatus.ctrlKey = e.ctrlKey;
			this._keyStatus.metaKey = e.metaKey;
			this._keyStatus.shiftKey = e.shiftKey;

			if (this._keyStatus.lastKeyPressed) {
				this._keyStatus.event = e;
				this.fire(this._keyStatus);
			}
		}, true));

		disposables.add(addDisposableListener(window, 'keyup', e => {
			if (e.defaultPrevented) {
				return;
			}

			if (!e.altKey && this._keyStatus.altKey) {
				this._keyStatus.lastKeyReleased = 'alt';
			} else if (!e.ctrlKey && this._keyStatus.ctrlKey) {
				this._keyStatus.lastKeyReleased = 'ctrl';
			} else if (!e.metaKey && this._keyStatus.metaKey) {
				this._keyStatus.lastKeyReleased = 'meta';
			} else if (!e.shiftKey && this._keyStatus.shiftKey) {
				this._keyStatus.lastKeyReleased = 'shift';
			} else {
				this._keyStatus.lastKeyReleased = undefined;
			}

			if (this._keyStatus.lastKeyPressed !== this._keyStatus.lastKeyReleased) {
				this._keyStatus.lastKeyPressed = undefined;
			}

			this._keyStatus.altKey = e.altKey;
			this._keyStatus.ctrlKey = e.ctrlKey;
			this._keyStatus.metaKey = e.metaKey;
			this._keyStatus.shiftKey = e.shiftKey;

			if (this._keyStatus.lastKeyReleased) {
				this._keyStatus.event = e;
				this.fire(this._keyStatus);
			}
		}, true));

		disposables.add(addDisposableListener(window.document.body, 'mousedown', () => {
			this._keyStatus.lastKeyPressed = undefined;
		}, true));

		disposables.add(addDisposableListener(window.document.body, 'mouseup', () => {
			this._keyStatus.lastKeyPressed = undefined;
		}, true));

		disposables.add(addDisposableListener(window.document.body, 'mousemove', e => {
			if (e.buttons) {
				this._keyStatus.lastKeyPressed = undefined;
			}
		}, true));

		disposables.add(addDisposableListener(window, 'blur', () => {
			this.resetKeyStatus();
		}));
	}

	get keyStatus(): IModifierKeyStatus {
		return this._keyStatus;
	}

	get isModifierPressed(): boolean {
		return hasModifierKeys(this._keyStatus);
	}

	/**
	 * Allows to explicitly reset the key status based on more knowledge (#109062)
	 */
	resetKeyStatus(): void {
		this.doResetKeyStatus();
		this.fire(this._keyStatus);
	}

	private doResetKeyStatus(): void {
		this._keyStatus = {
			altKey: false,
			shiftKey: false,
			ctrlKey: false,
			metaKey: false
		};
	}

	static getInstance() {
		if (!ModifierKeyEmitter.instance) {
			ModifierKeyEmitter.instance = new ModifierKeyEmitter();
		}

		return ModifierKeyEmitter.instance;
	}

	static disposeInstance() {
		if (ModifierKeyEmitter.instance) {
			ModifierKeyEmitter.instance.dispose();
			ModifierKeyEmitter.instance = undefined;
		}
	}

	override dispose() {
		super.dispose();
		this._subscriptions.dispose();
	}
}

export function getCookieValue(name: string): string | undefined {
	const match = document.cookie.match('(^|[^;]+)\\s*' + name + '\\s*=\\s*([^;]+)'); // See https://stackoverflow.com/a/25490531

	return match ? match.pop() : undefined;
}

export interface IDragAndDropObserverCallbacks {
	readonly onDragEnter?: (e: DragEvent) => void;
	readonly onDragLeave?: (e: DragEvent) => void;
	readonly onDrop?: (e: DragEvent) => void;
	readonly onDragEnd?: (e: DragEvent) => void;
	readonly onDragStart?: (e: DragEvent) => void;
	readonly onDrag?: (e: DragEvent) => void;
	readonly onDragOver?: (e: DragEvent, dragDuration: number) => void;
}

export class DragAndDropObserver extends Disposable {

	// A helper to fix issues with repeated DRAG_ENTER / DRAG_LEAVE
	// calls see https://github.com/microsoft/vscode/issues/14470
	// when the element has child elements where the events are fired
	// repeadedly.
	private counter: number = 0;

	// Allows to measure the duration of the drag operation.
	private dragStartTime = 0;

	constructor(private readonly element: HTMLElement, private readonly callbacks: IDragAndDropObserverCallbacks) {
		super();

		this.registerListeners();
	}

	private registerListeners(): void {
		if (this.callbacks.onDragStart) {
			this._register(addDisposableListener(this.element, EventType.DRAG_START, (e: DragEvent) => {
				this.callbacks.onDragStart?.(e);
			}));
		}

		if (this.callbacks.onDrag) {
			this._register(addDisposableListener(this.element, EventType.DRAG, (e: DragEvent) => {
				this.callbacks.onDrag?.(e);
			}));
		}

		this._register(addDisposableListener(this.element, EventType.DRAG_ENTER, (e: DragEvent) => {
			this.counter++;
			this.dragStartTime = e.timeStamp;

			this.callbacks.onDragEnter?.(e);
		}));

		this._register(addDisposableListener(this.element, EventType.DRAG_OVER, (e: DragEvent) => {
			e.preventDefault(); // needed so that the drop event fires (https://stackoverflow.com/questions/21339924/drop-event-not-firing-in-chrome)

			this.callbacks.onDragOver?.(e, e.timeStamp - this.dragStartTime);
		}));

		this._register(addDisposableListener(this.element, EventType.DRAG_LEAVE, (e: DragEvent) => {
			this.counter--;

			if (this.counter === 0) {
				this.dragStartTime = 0;

				this.callbacks.onDragLeave?.(e);
			}
		}));

		this._register(addDisposableListener(this.element, EventType.DRAG_END, (e: DragEvent) => {
			this.counter = 0;
			this.dragStartTime = 0;

			this.callbacks.onDragEnd?.(e);
		}));

		this._register(addDisposableListener(this.element, EventType.DROP, (e: DragEvent) => {
			this.counter = 0;
			this.dragStartTime = 0;

			this.callbacks.onDrop?.(e);
		}));
	}
}

type HTMLElementAttributeKeys<T> = Partial<{ [K in keyof T]: T[K] extends Function ? never : T[K] extends object ? HTMLElementAttributeKeys<T[K]> : T[K] }>;
type ElementAttributes<T> = HTMLElementAttributeKeys<T> & Record<string, any>;
type RemoveHTMLElement<T> = T extends HTMLElement ? never : T;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
type ArrayToObj<T extends readonly any[]> = UnionToIntersection<RemoveHTMLElement<T[number]>>;
type HHTMLElementTagNameMap = HTMLElementTagNameMap & { '': HTMLDivElement };

type TagToElement<T> = T extends `${infer TStart}#${string}`
	? TStart extends keyof HHTMLElementTagNameMap
	? HHTMLElementTagNameMap[TStart]
	: HTMLElement
	: T extends `${infer TStart}.${string}`
	? TStart extends keyof HHTMLElementTagNameMap
	? HHTMLElementTagNameMap[TStart]
	: HTMLElement
	: T extends keyof HTMLElementTagNameMap
	? HTMLElementTagNameMap[T]
	: HTMLElement;

type TagToElementAndId<TTag> = TTag extends `${infer TTag}@${infer TId}`
	? { element: TagToElement<TTag>; id: TId }
	: { element: TagToElement<TTag>; id: 'root' };

type TagToRecord<TTag> = TagToElementAndId<TTag> extends { element: infer TElement; id: infer TId }
	? Record<(TId extends string ? TId : never) | 'root', TElement>
	: never;

type Child = HTMLElement | string | Record<string, HTMLElement>;

const H_REGEX = /(?<tag>[\w\-]+)?(?:#(?<id>[\w\-]+))?(?<class>(?:\.(?:[\w\-]+))*)(?:@(?<name>(?:[\w\_])+))?/;

/**
 * A helper function to create nested dom nodes.
 *
 *
 * ```ts
 * const elements = h('div.code-view', [
 * 	h('div.title@title'),
 * 	h('div.container', [
 * 		h('div.gutter@gutterDiv'),
 * 		h('div@editor'),
 * 	]),
 * ]);
 * const editor = createEditor(elements.editor);
 * ```
*/
export function h<TTag extends string>
	(tag: TTag):
	TagToRecord<TTag> extends infer Y ? { [TKey in keyof Y]: Y[TKey] } : never;

export function h<TTag extends string, T extends Child[]>
	(tag: TTag, children: [...T]):
	(ArrayToObj<T> & TagToRecord<TTag>) extends infer Y ? { [TKey in keyof Y]: Y[TKey] } : never;

export function h<TTag extends string>
	(tag: TTag, attributes: Partial<ElementAttributes<TagToElement<TTag>>>):
	TagToRecord<TTag> extends infer Y ? { [TKey in keyof Y]: Y[TKey] } : never;

export function h<TTag extends string, T extends Child[]>
	(tag: TTag, attributes: Partial<ElementAttributes<TagToElement<TTag>>>, children: [...T]):
	(ArrayToObj<T> & TagToRecord<TTag>) extends infer Y ? { [TKey in keyof Y]: Y[TKey] } : never;

export function h(tag: string, ...args: [] | [attributes: { $: string } & Partial<ElementAttributes<HTMLElement>> | Record<string, any>, children?: any[]] | [children: any[]]): Record<string, HTMLElement> {
	let attributes: { $?: string } & Partial<ElementAttributes<HTMLElement>>;
	let children: (Record<string, HTMLElement> | HTMLElement)[] | undefined;

	if (Array.isArray(args[0])) {
		attributes = {};
		children = args[0];
	} else {
		// eslint-disable-next-line local/code-no-any-casts
		attributes = args[0] as any || {};
		children = args[1];
	}

	const match = H_REGEX.exec(tag);

	if (!match || !match.groups) {
		throw new Error('Bad use of h');
	}

	const tagName = match.groups['tag'] || 'div';
	const el = document.createElement(tagName);

	if (match.groups['id']) {
		el.id = match.groups['id'];
	}

	const classNames = [];
	if (match.groups['class']) {
		for (const className of match.groups['class'].split('.')) {
			if (className !== '') {
				classNames.push(className);
			}
		}
	}
	if (attributes.className !== undefined) {
		for (const className of attributes.className.split('.')) {
			if (className !== '') {
				classNames.push(className);
			}
		}
	}
	if (classNames.length > 0) {
		el.className = classNames.join(' ');
	}

	const result: Record<string, HTMLElement> = {};

	if (match.groups['name']) {
		result[match.groups['name']] = el;
	}

	if (children) {
		for (const c of children) {
			if (isHTMLElement(c)) {
				el.appendChild(c);
			} else if (typeof c === 'string') {
				el.append(c);
			} else if ('root' in c) {
				Object.assign(result, c);
				el.appendChild(c.root);
			}
		}
	}

	for (const [key, value] of Object.entries(attributes)) {
		if (key === 'className') {
			continue;
		} else if (key === 'style') {
			for (const [cssKey, cssValue] of Object.entries(value)) {
				el.style.setProperty(
					camelCaseToHyphenCase(cssKey),
					typeof cssValue === 'number' ? cssValue + 'px' : '' + cssValue
				);
			}
		} else if (key === 'tabIndex') {
			el.tabIndex = value;
		} else {
			el.setAttribute(camelCaseToHyphenCase(key), value.toString());
		}
	}

	result['root'] = el;

	return result;
}

/** @deprecated This is a duplication of the h function. Needs cleanup. */
export function svgElem<TTag extends string>
	(tag: TTag):
	TagToRecord<TTag> extends infer Y ? { [TKey in keyof Y]: Y[TKey] } : never;
/** @deprecated This is a duplication of the h function. Needs cleanup. */
export function svgElem<TTag extends string, T extends Child[]>
	(tag: TTag, children: [...T]):
	(ArrayToObj<T> & TagToRecord<TTag>) extends infer Y ? { [TKey in keyof Y]: Y[TKey] } : never;
/** @deprecated This is a duplication of the h function. Needs cleanup. */
export function svgElem<TTag extends string>
	(tag: TTag, attributes: Partial<ElementAttributes<TagToElement<TTag>>>):
	TagToRecord<TTag> extends infer Y ? { [TKey in keyof Y]: Y[TKey] } : never;
/** @deprecated This is a duplication of the h function. Needs cleanup. */
export function svgElem<TTag extends string, T extends Child[]>
	(tag: TTag, attributes: Partial<ElementAttributes<TagToElement<TTag>>>, children: [...T]):
	(ArrayToObj<T> & TagToRecord<TTag>) extends infer Y ? { [TKey in keyof Y]: Y[TKey] } : never;
/** @deprecated This is a duplication of the h function. Needs cleanup. */
export function svgElem(tag: string, ...args: [] | [attributes: { $: string } & Partial<ElementAttributes<HTMLElement>> | Record<string, any>, children?: any[]] | [children: any[]]): Record<string, HTMLElement> {
	let attributes: { $?: string } & Partial<ElementAttributes<HTMLElement>>;
	let children: (Record<string, HTMLElement> | HTMLElement)[] | undefined;

	if (Array.isArray(args[0])) {
		attributes = {};
		children = args[0];
	} else {
		// eslint-disable-next-line local/code-no-any-casts
		attributes = args[0] as any || {};
		children = args[1];
	}

	const match = H_REGEX.exec(tag);

	if (!match || !match.groups) {
		throw new Error('Bad use of h');
	}

	const tagName = match.groups['tag'] || 'div';
	// eslint-disable-next-line local/code-no-any-casts
	const el = document.createElementNS('http://www.w3.org/2000/svg', tagName) as any as HTMLElement;

	if (match.groups['id']) {
		el.id = match.groups['id'];
	}

	const classNames = [];
	if (match.groups['class']) {
		for (const className of match.groups['class'].split('.')) {
			if (className !== '') {
				classNames.push(className);
			}
		}
	}
	if (attributes.className !== undefined) {
		for (const className of attributes.className.split('.')) {
			if (className !== '') {
				classNames.push(className);
			}
		}
	}
	if (classNames.length > 0) {
		el.className = classNames.join(' ');
	}

	const result: Record<string, HTMLElement> = {};

	if (match.groups['name']) {
		result[match.groups['name']] = el;
	}

	if (children) {
		for (const c of children) {
			if (isHTMLElement(c)) {
				el.appendChild(c);
			} else if (typeof c === 'string') {
				el.append(c);
			} else if ('root' in c) {
				Object.assign(result, c);
				el.appendChild(c.root);
			}
		}
	}

	for (const [key, value] of Object.entries(attributes)) {
		if (key === 'className') {
			continue;
		} else if (key === 'style') {
			for (const [cssKey, cssValue] of Object.entries(value)) {
				el.style.setProperty(
					camelCaseToHyphenCase(cssKey),
					typeof cssValue === 'number' ? cssValue + 'px' : '' + cssValue
				);
			}
		} else if (key === 'tabIndex') {
			el.tabIndex = value;
		} else {
			el.setAttribute(camelCaseToHyphenCase(key), value.toString());
		}
	}

	result['root'] = el;

	return result;
}

function camelCaseToHyphenCase(str: string) {
	return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function copyAttributes(from: Element, to: Element, filter?: string[]): void {
	for (const { name, value } of from.attributes) {
		if (!filter || filter.includes(name)) {
			to.setAttribute(name, value);
		}
	}
}

function copyAttribute(from: Element, to: Element, name: string): void {
	const value = from.getAttribute(name);
	if (value) {
		to.setAttribute(name, value);
	} else {
		to.removeAttribute(name);
	}
}

export function trackAttributes(from: Element, to: Element, filter?: string[]): IDisposable {
	copyAttributes(from, to, filter);

	const disposables = new DisposableStore();

	disposables.add(sharedMutationObserver.observe(from, disposables, { attributes: true, attributeFilter: filter })(mutations => {
		for (const mutation of mutations) {
			if (mutation.type === 'attributes' && mutation.attributeName) {
				copyAttribute(from, to, mutation.attributeName);
			}
		}
	}));

	return disposables;
}

export function isEditableElement(element: Element): boolean {
	return element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'textarea' || isHTMLElement(element) && !!element.editContext;
}

/**
 * Helper for calculating the "safe triangle" occluded by hovers to avoid early dismissal.
 * @see https://www.smashingmagazine.com/2023/08/better-context-menus-safe-triangles/ for example
 */
export class SafeTriangle {
	// 4 points (x, y), 8 length
	private points = new Int16Array(8);

	constructor(
		private readonly originX: number,
		private readonly originY: number,
		target: HTMLElement
	) {
		const { top, left, right, bottom } = target.getBoundingClientRect();
		const t = this.points;
		let i = 0;

		t[i++] = left;
		t[i++] = top;

		t[i++] = right;
		t[i++] = top;

		t[i++] = left;
		t[i++] = bottom;

		t[i++] = right;
		t[i++] = bottom;
	}

	public contains(x: number, y: number) {
		const { points, originX, originY } = this;
		for (let i = 0; i < 4; i++) {
			const p1 = 2 * i;
			const p2 = 2 * ((i + 1) % 4);
			if (isPointWithinTriangle(x, y, originX, originY, points[p1], points[p1 + 1], points[p2], points[p2 + 1])) {
				return true;
			}
		}

		return false;
	}
}


export namespace n {
	function nodeNs<TMap extends Record<string, any>>(elementNs: string | undefined = undefined): DomTagCreateFn<TMap> {
		return (tag, attributes, children) => {
			const className = attributes.class;
			delete attributes.class;
			const ref = attributes.ref;
			delete attributes.ref;
			const obsRef = attributes.obsRef;
			delete attributes.obsRef;

			// eslint-disable-next-line local/code-no-any-casts
			return new ObserverNodeWithElement(tag as any, ref, obsRef, elementNs, className, attributes, children);
		};
	}

	function node<TMap extends Record<string, any>, TKey extends keyof TMap>(tag: TKey, elementNs: string | undefined = undefined): DomCreateFn<TMap[TKey], TMap[TKey]> {
		// eslint-disable-next-line local/code-no-any-casts
		const f = nodeNs(elementNs) as any;
		return (attributes, children) => {
			return f(tag, attributes, children);
		};
	}

	export const div: DomCreateFn<HTMLDivElement, HTMLDivElement> = node<HTMLElementTagNameMap, 'div'>('div');

	export const elem = nodeNs<HTMLElementTagNameMap>(undefined);

	export const svg: DomCreateFn<SVGElementTagNameMap2['svg'], SVGElement> = node<SVGElementTagNameMap2, 'svg'>('svg', 'http://www.w3.org/2000/svg');

	export const svgElem = nodeNs<SVGElementTagNameMap2>('http://www.w3.org/2000/svg');

	export function ref<T = HTMLOrSVGElement>(): IRefWithVal<T> {
		let value: T | undefined = undefined;
		const result: IRef<T> = function (val: T) {
			value = val;
		};
		Object.defineProperty(result, 'element', {
			get() {
				if (!value) {
					throw new BugIndicatingError('Make sure the ref is set before accessing the element. Maybe wrong initialization order?');
				}
				return value;
			}
		});
		// eslint-disable-next-line local/code-no-any-casts
		return result as any;
	}
}
type Value<T> = T | IObservable<T>;
type ValueOrList<T> = Value<T> | ValueOrList<T>[];
type ValueOrList2<T> = ValueOrList<T> | ValueOrList<ValueOrList<T>>;
type HTMLOrSVGElement = HTMLElement | SVGElement;
type SVGElementTagNameMap2 = {
	svg: SVGElement & {
		width: number;
		height: number;
		transform: string;
		viewBox: string;
		fill: string;
	};
	path: SVGElement & {
		d: string;
		stroke: string;
		fill: string;
	};
	linearGradient: SVGElement & {
		id: string;
		x1: string | number;
		x2: string | number;
	};
	stop: SVGElement & {
		offset: string;
	};
	rect: SVGElement & {
		x: number;
		y: number;
		width: number;
		height: number;
		fill: string;
	};
	defs: SVGElement;
};
type DomTagCreateFn<TMap extends Record<string, any>> = <TTag extends keyof TMap>(
	tag: TTag,
	attributes: ElementAttributeKeys<TMap[TTag]> & { class?: ValueOrList<string | false | undefined>; ref?: IRef<TMap[TTag]>; obsRef?: IRef<ObserverNodeWithElement<TMap[TTag]> | null> },
	children?: ChildNode
) => ObserverNode<TMap[TTag]>;
type DomCreateFn<TAttributes, TResult extends HTMLOrSVGElement> = (
	attributes: ElementAttributeKeys<TAttributes> & { class?: ValueOrList<string | false | undefined>; ref?: IRef<TResult>; obsRef?: IRef<ObserverNodeWithElement<TResult> | null> },
	children?: ChildNode
) => ObserverNode<TResult>;

export type ChildNode = ValueOrList2<HTMLOrSVGElement | string | ObserverNode | undefined>;

export type IRef<T> = (value: T) => void;

export interface IRefWithVal<T> extends IRef<T> {
	readonly element: T;
}

export abstract class ObserverNode<T extends HTMLOrSVGElement = HTMLOrSVGElement> {
	private readonly _deriveds: (IObservable<any>)[] = [];

	protected readonly _element: T;

	constructor(
		tag: string,
		ref: IRef<T> | undefined,
		obsRef: IRef<ObserverNodeWithElement<T> | null> | undefined,
		ns: string | undefined,
		className: ValueOrList<string | undefined | false> | undefined,
		attributes: ElementAttributeKeys<T>,
		children: ChildNode
	) {
		this._element = (ns ? document.createElementNS(ns, tag) : document.createElement(tag)) as unknown as T;
		if (ref) {
			ref(this._element);
		}
		if (obsRef) {
			this._deriveds.push(derived((_reader) => {
				obsRef(this as unknown as ObserverNodeWithElement<T>);
				_reader.store.add({
					dispose: () => {
						obsRef(null);
					}
				});
			}));
		}

		if (className) {
			if (hasObservable(className)) {
				this._deriveds.push(derived(this, reader => {
					/** @description set.class */
					setClassName(this._element, getClassName(className, reader));
				}));
			} else {
				setClassName(this._element, getClassName(className, undefined));
			}
		}

		for (const [key, value] of Object.entries(attributes)) {
			if (key === 'style') {
				for (const [cssKey, cssValue] of Object.entries(value)) {
					const key = camelCaseToHyphenCase(cssKey);
					if (isObservable(cssValue)) {
						this._deriveds.push(derivedOpts({ owner: this, debugName: () => `set.style.${key}` }, reader => {
							this._element.style.setProperty(key, convertCssValue(cssValue.read(reader)));
						}));
					} else {
						this._element.style.setProperty(key, convertCssValue(cssValue));
					}
				}
			} else if (key === 'tabIndex') {
				if (isObservable(value)) {
					this._deriveds.push(derived(this, reader => {
						/** @description set.tabIndex */
						// eslint-disable-next-line local/code-no-any-casts
						this._element.tabIndex = value.read(reader) as any;
					}));
				} else {
					this._element.tabIndex = value;
				}
			} else if (key.startsWith('on')) {
				// eslint-disable-next-line local/code-no-any-casts
				(this._element as any)[key] = value;
			} else {
				if (isObservable(value)) {
					this._deriveds.push(derivedOpts({ owner: this, debugName: () => `set.${key}` }, reader => {
						setOrRemoveAttribute(this._element, key, value.read(reader));
					}));
				} else {
					setOrRemoveAttribute(this._element, key, value);
				}
			}
		}

		if (children) {
			function getChildren(reader: IReader | undefined, children: ValueOrList2<HTMLOrSVGElement | string | ObserverNode | undefined>): (HTMLOrSVGElement | string)[] {
				if (isObservable(children)) {
					return getChildren(reader, children.read(reader));
				}
				if (Array.isArray(children)) {
					return children.flatMap(c => getChildren(reader, c));
				}
				if (children instanceof ObserverNode) {
					if (reader) {
						children.readEffect(reader);
					}
					return [children._element];
				}
				if (children) {
					return [children];
				}
				return [];
			}

			const d = derived(this, reader => {
				/** @description set.children */
				this._element.replaceChildren(...getChildren(reader, children));
			});
			this._deriveds.push(d);
			if (!childrenIsObservable(children)) {
				d.get();
			}
		}
	}

	readEffect(reader: IReader | undefined): void {
		for (const d of this._deriveds) {
			d.read(reader);
		}
	}

	keepUpdated(store: DisposableStore): ObserverNodeWithElement<T> {
		derived(reader => {
			/** update */
			this.readEffect(reader);
		}).recomputeInitiallyAndOnChange(store);
		return this as unknown as ObserverNodeWithElement<T>;
	}

	/**
	 * Creates a live element that will keep the element updated as long as the returned object is not disposed.
	*/
	toDisposableLiveElement() {
		const store = new DisposableStore();
		this.keepUpdated(store);
		return new LiveElement(this._element, store);
	}

	private _isHovered: IObservable<boolean> | undefined = undefined;

	get isHovered(): IObservable<boolean> {
		if (!this._isHovered) {
			const hovered = observableValue<boolean>('hovered', false);
			this._element.addEventListener('mouseenter', (_e) => hovered.set(true, undefined));
			this._element.addEventListener('mouseleave', (_e) => hovered.set(false, undefined));
			this._isHovered = hovered;
		}
		return this._isHovered;
	}

	private _didMouseMoveDuringHover: IObservable<boolean> | undefined = undefined;

	get didMouseMoveDuringHover(): IObservable<boolean> {
		if (!this._didMouseMoveDuringHover) {
			let _hovering = false;
			const hovered = observableValue<boolean>('didMouseMoveDuringHover', false);
			this._element.addEventListener('mouseenter', (_e) => {
				_hovering = true;
			});
			this._element.addEventListener('mousemove', (_e) => {
				if (_hovering) {
					hovered.set(true, undefined);
				}
			});
			this._element.addEventListener('mouseleave', (_e) => {
				_hovering = false;
				hovered.set(false, undefined);
			});
			this._didMouseMoveDuringHover = hovered;
		}
		return this._didMouseMoveDuringHover;
	}
}

function setClassName(domNode: HTMLOrSVGElement, className: string) {
	if (isSVGElement(domNode)) {
		domNode.setAttribute('class', className);
	} else {
		domNode.className = className;
	}
}

function resolve<T>(value: ValueOrList<T>, reader: IReader | undefined, cb: (val: T) => void): void {
	if (isObservable(value)) {
		cb(value.read(reader));
		return;
	}
	if (Array.isArray(value)) {
		for (const v of value) {
			resolve(v, reader, cb);
		}
		return;
	}
	// eslint-disable-next-line local/code-no-any-casts
	cb(value as any);
}
function getClassName(className: ValueOrList<string | undefined | false> | undefined, reader: IReader | undefined): string {
	let result = '';
	resolve(className, reader, val => {
		if (val) {
			if (result.length === 0) {
				result = val;
			} else {
				result += ' ' + val;
			}
		}
	});
	return result;
}
function hasObservable(value: ValueOrList<unknown>): boolean {
	if (isObservable(value)) {
		return true;
	}
	if (Array.isArray(value)) {
		return value.some(v => hasObservable(v));
	}
	return false;
}
function convertCssValue(value: any): string {
	if (typeof value === 'number') {
		return value + 'px';
	}
	return value;
}
function childrenIsObservable(children: ValueOrList2<HTMLOrSVGElement | string | ObserverNode | undefined>): boolean {
	if (isObservable(children)) {
		return true;
	}
	if (Array.isArray(children)) {
		return children.some(c => childrenIsObservable(c));
	}
	return false;
}

export class LiveElement<T extends HTMLOrSVGElement = HTMLElement> {
	constructor(
		public readonly element: T,
		private readonly _disposable: IDisposable
	) { }

	dispose() {
		this._disposable.dispose();
	}
}

export class ObserverNodeWithElement<T extends HTMLOrSVGElement = HTMLOrSVGElement> extends ObserverNode<T> {
	public get element() {
		return this._element;
	}
}
function setOrRemoveAttribute(element: HTMLOrSVGElement, key: string, value: unknown) {
	if (value === null || value === undefined) {
		element.removeAttribute(camelCaseToHyphenCase(key));
	} else {
		element.setAttribute(camelCaseToHyphenCase(key), String(value));
	}
}

type ElementAttributeKeys<T> = Partial<{
	[K in keyof T]: T[K] extends Function ? never : T[K] extends object ? ElementAttributeKeys<T[K]> : Value<number | T[K] | undefined | null>;
}>;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/domSanitize.ts]---
Location: vscode-main/src/vs/base/browser/domSanitize.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from '../common/network.js';
import { reset } from './dom.js';
// eslint-disable-next-line no-restricted-imports
import dompurify, * as DomPurifyTypes from './dompurify/dompurify.js';

/**
 * List of safe, non-input html tags.
 */
export const basicMarkupHtmlTags = Object.freeze([
	'a',
	'abbr',
	'b',
	'bdo',
	'blockquote',
	'br',
	'caption',
	'cite',
	'code',
	'col',
	'colgroup',
	'dd',
	'del',
	'details',
	'dfn',
	'div',
	'dl',
	'dt',
	'em',
	'figcaption',
	'figure',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'hr',
	'i',
	'img',
	'ins',
	'kbd',
	'label',
	'li',
	'mark',
	'ol',
	'p',
	'pre',
	'q',
	'rp',
	'rt',
	'ruby',
	's',
	'samp',
	'small',
	'small',
	'source',
	'span',
	'strike',
	'strong',
	'sub',
	'summary',
	'sup',
	'table',
	'tbody',
	'td',
	'tfoot',
	'th',
	'thead',
	'time',
	'tr',
	'tt',
	'u',
	'ul',
	'var',
	'video',
	'wbr',
]);

export const defaultAllowedAttrs = Object.freeze([
	'href',
	'target',
	'src',
	'alt',
	'title',
	'for',
	'name',
	'role',
	'tabindex',
	'x-dispatch',
	'required',
	'checked',
	'placeholder',
	'type',
	'start',
	'width',
	'height',
	'align',
]);


const fakeRelativeUrlProtocol = 'vscode-relative-path';

interface AllowedLinksConfig {
	readonly override: readonly string[] | '*';
	readonly allowRelativePaths: boolean;
}

function validateLink(value: string, allowedProtocols: AllowedLinksConfig): boolean {
	if (allowedProtocols.override === '*') {
		return true; // allow all protocols
	}

	try {
		const url = new URL(value, fakeRelativeUrlProtocol + '://');
		if (allowedProtocols.override.includes(url.protocol.replace(/:$/, ''))) {
			return true;
		}

		if (allowedProtocols.allowRelativePaths
			&& url.protocol === fakeRelativeUrlProtocol + ':'
			&& !value.trim().toLowerCase().startsWith(fakeRelativeUrlProtocol)
		) {
			return true;
		}

		return false;
	} catch (e) {
		return false;
	}
}

/**
 * Hooks dompurify using `afterSanitizeAttributes` to check that all `href` and `src`
 * attributes are valid.
 */
function hookDomPurifyHrefAndSrcSanitizer(allowedLinkProtocols: AllowedLinksConfig, allowedMediaProtocols: AllowedLinksConfig) {
	dompurify.addHook('afterSanitizeAttributes', (node) => {
		// check all href/src attributes for validity
		for (const attr of ['href', 'src']) {
			if (node.hasAttribute(attr)) {
				const attrValue = node.getAttribute(attr) as string;
				if (attr === 'href') {
					if (!attrValue.startsWith('#') && !validateLink(attrValue, allowedLinkProtocols)) {
						node.removeAttribute(attr);
					}
				} else { // 'src'
					if (!validateLink(attrValue, allowedMediaProtocols)) {
						node.removeAttribute(attr);
					}
				}
			}
		}
	});
}

/**
 * Predicate that checks if an attribute should be kept or removed.
 *
 * @returns A boolean indicating whether the attribute should be kept or a string with the sanitized value (which implicitly keeps the attribute)
 */
export type SanitizeAttributePredicate = (node: Element, data: { readonly attrName: string; readonly attrValue: string }) => boolean | string;

export interface SanitizeAttributeRule {
	readonly attributeName: string;
	shouldKeep: SanitizeAttributePredicate;
}


export interface DomSanitizerConfig {
	/**
	 * Configured the allowed html tags.
	 */
	readonly allowedTags?: {
		readonly override?: readonly string[];
		readonly augment?: readonly string[];
	};

	/**
	 * Configured the allowed html attributes.
	 */
	readonly allowedAttributes?: {
		readonly override?: ReadonlyArray<string | SanitizeAttributeRule>;
		readonly augment?: ReadonlyArray<string | SanitizeAttributeRule>;
	};

	/**
	 * List of allowed protocols for `href` attributes.
	 */
	readonly allowedLinkProtocols?: {
		readonly override?: readonly string[] | '*';
	};

	/**
	 * If set, allows relative paths for links.
	 */
	readonly allowRelativeLinkPaths?: boolean;

	/**
	 * List of allowed protocols for `src` attributes.
	 */
	readonly allowedMediaProtocols?: {
		readonly override?: readonly string[] | '*';
	};

	/**
	 * If set, allows relative paths for media (images, videos, etc).
	 */
	readonly allowRelativeMediaPaths?: boolean;

	/**
	 * If set, replaces unsupported tags with their plaintext representation instead of removing them.
	 *
	 * For example, <p><bad>"text"</bad></p> becomes <p>"<bad>text</bad>"</p>.
	 */
	readonly replaceWithPlaintext?: boolean;
}

const defaultDomPurifyConfig = Object.freeze({
	ALLOWED_TAGS: [...basicMarkupHtmlTags],
	ALLOWED_ATTR: [...defaultAllowedAttrs],
	// We sanitize the src/href attributes later if needed
	ALLOW_UNKNOWN_PROTOCOLS: true,
} satisfies DomPurifyTypes.Config);

/**
 * Sanitizes an html string.
 *
 * @param untrusted The HTML string to sanitize.
 * @param config Optional configuration for sanitization. If not provided, defaults to a safe configuration.
 *
 * @returns A sanitized string of html.
 */
export function sanitizeHtml(untrusted: string, config?: DomSanitizerConfig): TrustedHTML {
	return doSanitizeHtml(untrusted, config, 'trusted');
}

function doSanitizeHtml(untrusted: string, config: DomSanitizerConfig | undefined, outputType: 'dom'): DocumentFragment;
function doSanitizeHtml(untrusted: string, config: DomSanitizerConfig | undefined, outputType: 'trusted'): TrustedHTML;
function doSanitizeHtml(untrusted: string, config: DomSanitizerConfig | undefined, outputType: 'dom' | 'trusted'): TrustedHTML | DocumentFragment {
	try {
		const resolvedConfig: DomPurifyTypes.Config = { ...defaultDomPurifyConfig };

		if (config?.allowedTags) {
			if (config.allowedTags.override) {
				resolvedConfig.ALLOWED_TAGS = [...config.allowedTags.override];
			}

			if (config.allowedTags.augment) {
				resolvedConfig.ALLOWED_TAGS = [...(resolvedConfig.ALLOWED_TAGS ?? []), ...config.allowedTags.augment];
			}
		}

		let resolvedAttributes: Array<string | SanitizeAttributeRule> = [...defaultAllowedAttrs];
		if (config?.allowedAttributes) {
			if (config.allowedAttributes.override) {
				resolvedAttributes = [...config.allowedAttributes.override];
			}

			if (config.allowedAttributes.augment) {
				resolvedAttributes = [...resolvedAttributes, ...config.allowedAttributes.augment];
			}
		}

		// All attr names are lower-case in the sanitizer hooks
		resolvedAttributes = resolvedAttributes.map((attr): string | SanitizeAttributeRule => {
			if (typeof attr === 'string') {
				return attr.toLowerCase();
			}
			return {
				attributeName: attr.attributeName.toLowerCase(),
				shouldKeep: attr.shouldKeep,
			};
		});

		const allowedAttrNames = new Set(resolvedAttributes.map(attr => typeof attr === 'string' ? attr : attr.attributeName));
		const allowedAttrPredicates = new Map<string, SanitizeAttributeRule>();
		for (const attr of resolvedAttributes) {
			if (typeof attr === 'string') {
				// New string attribute value clears previously set predicates
				allowedAttrPredicates.delete(attr);
			} else {
				allowedAttrPredicates.set(attr.attributeName, attr);
			}
		}

		resolvedConfig.ALLOWED_ATTR = Array.from(allowedAttrNames);

		hookDomPurifyHrefAndSrcSanitizer(
			{
				override: config?.allowedLinkProtocols?.override ?? [Schemas.http, Schemas.https],
				allowRelativePaths: config?.allowRelativeLinkPaths ?? false
			},
			{
				override: config?.allowedMediaProtocols?.override ?? [Schemas.http, Schemas.https],
				allowRelativePaths: config?.allowRelativeMediaPaths ?? false
			});

		if (config?.replaceWithPlaintext) {
			dompurify.addHook('uponSanitizeElement', replaceWithPlainTextHook);
		}

		if (allowedAttrPredicates.size) {
			dompurify.addHook('uponSanitizeAttribute', (node, e) => {
				const predicate = allowedAttrPredicates.get(e.attrName);
				if (predicate) {
					const result = predicate.shouldKeep(node, e);
					if (typeof result === 'string') {
						e.keepAttr = true;
						e.attrValue = result;
					} else {
						e.keepAttr = result;
					}
				} else {
					e.keepAttr = allowedAttrNames.has(e.attrName);
				}
			});
		}

		if (outputType === 'dom') {
			return dompurify.sanitize(untrusted, {
				...resolvedConfig,
				RETURN_DOM_FRAGMENT: true
			});
		} else {
			return dompurify.sanitize(untrusted, {
				...resolvedConfig,
				RETURN_TRUSTED_TYPE: true
			}) as unknown as TrustedHTML; // Cast from lib TrustedHTML to global TrustedHTML
		}
	} finally {
		dompurify.removeAllHooks();
	}
}

const selfClosingTags = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

const replaceWithPlainTextHook: DomPurifyTypes.UponSanitizeElementHook = (node, data, _config) => {
	if (!data.allowedTags[data.tagName] && data.tagName !== 'body') {
		const replacement = convertTagToPlaintext(node);
		if (replacement) {
			if (node.nodeType === Node.COMMENT_NODE) {
				// Workaround for https://github.com/cure53/DOMPurify/issues/1005
				// The comment will be deleted in the next phase. However if we try to remove it now, it will cause
				// an exception. Instead we insert the text node before the comment.
				node.parentElement?.insertBefore(replacement, node);
			} else {
				node.parentElement?.replaceChild(replacement, node);
			}
		}
	}
};

export function convertTagToPlaintext(node: Node): DocumentFragment | undefined {
	if (!node.ownerDocument) {
		return;
	}

	let startTagText: string;
	let endTagText: string | undefined;
	if (node.nodeType === Node.COMMENT_NODE) {
		startTagText = `<!--${node.textContent}-->`;
	} else if (node instanceof Element) {
		const tagName = node.tagName.toLowerCase();
		const isSelfClosing = selfClosingTags.includes(tagName);
		const attrString = node.attributes.length ?
			' ' + Array.from(node.attributes)
				.map(attr => `${attr.name}="${attr.value}"`)
				.join(' ')
			: '';
		startTagText = `<${tagName}${attrString}>`;
		if (!isSelfClosing) {
			endTagText = `</${tagName}>`;
		}
	} else {
		return;
	}

	const fragment = document.createDocumentFragment();
	const textNode = node.ownerDocument.createTextNode(startTagText);
	fragment.appendChild(textNode);
	while (node.firstChild) {
		fragment.appendChild(node.firstChild);
	}

	const endTagTextNode = endTagText ? node.ownerDocument.createTextNode(endTagText) : undefined;
	if (endTagTextNode) {
		fragment.appendChild(endTagTextNode);
	}

	return fragment;
}

/**
 * Sanitizes the given `value` and reset the given `node` with it.
 */
export function safeSetInnerHtml(node: HTMLElement, untrusted: string, config?: DomSanitizerConfig): void {
	const fragment = doSanitizeHtml(untrusted, config, 'dom');
	reset(node, fragment);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/domStylesheets.ts]---
Location: vscode-main/src/vs/base/browser/domStylesheets.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore, toDisposable, IDisposable } from '../common/lifecycle.js';
import { autorun, IObservable } from '../common/observable.js';
import { isFirefox } from './browser.js';
import { getWindows, sharedMutationObserver } from './dom.js';
import { mainWindow } from './window.js';

const globalStylesheets = new Map<HTMLStyleElement /* main stylesheet */, Set<HTMLStyleElement /* aux window clones that track the main stylesheet */>>();

export function isGlobalStylesheet(node: Node): boolean {
	return globalStylesheets.has(node as HTMLStyleElement);
}

/**
 * A version of createStyleSheet which has a unified API to initialize/set the style content.
 */
export function createStyleSheet2(): WrappedStyleElement {
	return new WrappedStyleElement();
}

class WrappedStyleElement {
	private _currentCssStyle = '';
	private _styleSheet: HTMLStyleElement | undefined = undefined;

	public setStyle(cssStyle: string): void {
		if (cssStyle === this._currentCssStyle) {
			return;
		}
		this._currentCssStyle = cssStyle;

		if (!this._styleSheet) {
			this._styleSheet = createStyleSheet(mainWindow.document.head, (s) => s.textContent = cssStyle);
		} else {
			this._styleSheet.textContent = cssStyle;
		}
	}

	public dispose(): void {
		if (this._styleSheet) {
			this._styleSheet.remove();
			this._styleSheet = undefined;
		}
	}
}

export function createStyleSheet(container: HTMLElement = mainWindow.document.head, beforeAppend?: (style: HTMLStyleElement) => void, disposableStore?: DisposableStore): HTMLStyleElement {
	const style = document.createElement('style');
	style.type = 'text/css';
	style.media = 'screen';
	beforeAppend?.(style);
	container.appendChild(style);

	if (disposableStore) {
		disposableStore.add(toDisposable(() => style.remove()));
	}

	// With <head> as container, the stylesheet becomes global and is tracked
	// to support auxiliary windows to clone the stylesheet.
	if (container === mainWindow.document.head) {
		const globalStylesheetClones = new Set<HTMLStyleElement>();
		globalStylesheets.set(style, globalStylesheetClones);
		if (disposableStore) {
			disposableStore.add(toDisposable(() => globalStylesheets.delete(style)));
		}

		for (const { window: targetWindow, disposables } of getWindows()) {
			if (targetWindow === mainWindow) {
				continue; // main window is already tracked
			}

			const cloneDisposable = disposables.add(cloneGlobalStyleSheet(style, globalStylesheetClones, targetWindow));
			disposableStore?.add(cloneDisposable);
		}
	}

	return style;
}

export function cloneGlobalStylesheets(targetWindow: Window): IDisposable {
	const disposables = new DisposableStore();

	for (const [globalStylesheet, clonedGlobalStylesheets] of globalStylesheets) {
		disposables.add(cloneGlobalStyleSheet(globalStylesheet, clonedGlobalStylesheets, targetWindow));
	}

	return disposables;
}

function cloneGlobalStyleSheet(globalStylesheet: HTMLStyleElement, globalStylesheetClones: Set<HTMLStyleElement>, targetWindow: Window): IDisposable {
	const disposables = new DisposableStore();

	const clone = globalStylesheet.cloneNode(true) as HTMLStyleElement;
	targetWindow.document.head.appendChild(clone);
	disposables.add(toDisposable(() => clone.remove()));

	for (const rule of getDynamicStyleSheetRules(globalStylesheet)) {
		clone.sheet?.insertRule(rule.cssText, clone.sheet?.cssRules.length);
	}

	disposables.add(sharedMutationObserver.observe(globalStylesheet, disposables, { childList: true, subtree: isFirefox, characterData: isFirefox })(() => {
		clone.textContent = globalStylesheet.textContent;
	}));

	globalStylesheetClones.add(clone);
	disposables.add(toDisposable(() => globalStylesheetClones.delete(clone)));

	return disposables;
}

let _sharedStyleSheet: HTMLStyleElement | null = null;
function getSharedStyleSheet(): HTMLStyleElement {
	if (!_sharedStyleSheet) {
		_sharedStyleSheet = createStyleSheet();
	}
	return _sharedStyleSheet;
}

function getDynamicStyleSheetRules(style: HTMLStyleElement) {
	if (style?.sheet?.rules) {
		// Chrome, IE
		return style.sheet.rules;
	}
	if (style?.sheet?.cssRules) {
		// FF
		return style.sheet.cssRules;
	}
	return [];
}

export function createCSSRule(selector: string, cssText: string, style = getSharedStyleSheet()): void {
	if (!style || !cssText) {
		return;
	}

	style.sheet?.insertRule(`${selector} {${cssText}}`, 0);

	// Apply rule also to all cloned global stylesheets
	for (const clonedGlobalStylesheet of globalStylesheets.get(style) ?? []) {
		createCSSRule(selector, cssText, clonedGlobalStylesheet);
	}
}

export function removeCSSRulesContainingSelector(ruleName: string, style = getSharedStyleSheet()): void {
	if (!style) {
		return;
	}

	const rules = getDynamicStyleSheetRules(style);
	const toDelete: number[] = [];
	for (let i = 0; i < rules.length; i++) {
		const rule = rules[i];
		if (isCSSStyleRule(rule) && rule.selectorText.indexOf(ruleName) !== -1) {
			toDelete.push(i);
		}
	}

	for (let i = toDelete.length - 1; i >= 0; i--) {
		style.sheet?.deleteRule(toDelete[i]);
	}

	// Remove rules also from all cloned global stylesheets
	for (const clonedGlobalStylesheet of globalStylesheets.get(style) ?? []) {
		removeCSSRulesContainingSelector(ruleName, clonedGlobalStylesheet);
	}
}

function isCSSStyleRule(rule: CSSRule): rule is CSSStyleRule {
	return typeof (rule as CSSStyleRule).selectorText === 'string';
}

export function createStyleSheetFromObservable(css: IObservable<string>): IDisposable {
	const store = new DisposableStore();
	const w = store.add(createStyleSheet2());
	store.add(autorun(reader => {
		w.setStyle(css.read(reader));
	}));
	return store;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/event.ts]---
Location: vscode-main/src/vs/base/browser/event.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { GestureEvent } from './touch.js';
import { Emitter, Event as BaseEvent } from '../common/event.js';
import { IDisposable } from '../common/lifecycle.js';

export type EventHandler = HTMLElement | HTMLDocument | Window;

export interface IDomEvent {
	<K extends keyof HTMLElementEventMap>(element: EventHandler, type: K, useCapture?: boolean): BaseEvent<HTMLElementEventMap[K]>;
	(element: EventHandler, type: string, useCapture?: boolean): BaseEvent<unknown>;
}

export interface DOMEventMap extends HTMLElementEventMap, DocumentEventMap, WindowEventMap {
	'-monaco-gesturetap': GestureEvent;
	'-monaco-gesturechange': GestureEvent;
	'-monaco-gesturestart': GestureEvent;
	'-monaco-gesturesend': GestureEvent;
	'-monaco-gesturecontextmenu': GestureEvent;
	'compositionstart': CompositionEvent;
	'compositionupdate': CompositionEvent;
	'compositionend': CompositionEvent;
}

export class DomEmitter<K extends keyof DOMEventMap> implements IDisposable {

	private readonly emitter: Emitter<DOMEventMap[K]>;

	get event(): BaseEvent<DOMEventMap[K]> {
		return this.emitter.event;
	}

	constructor(element: Window & typeof globalThis, type: WindowEventMap, useCapture?: boolean);
	constructor(element: Document, type: DocumentEventMap, useCapture?: boolean);
	constructor(element: EventHandler, type: K, useCapture?: boolean);
	constructor(element: EventHandler, type: K, useCapture?: boolean) {
		const fn = (e: Event) => this.emitter.fire(e as DOMEventMap[K]);
		this.emitter = new Emitter({
			onWillAddFirstListener: () => element.addEventListener(type, fn, useCapture),
			onDidRemoveLastListener: () => element.removeEventListener(type, fn, useCapture)
		});
	}

	dispose(): void {
		this.emitter.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/fastDomNode.ts]---
Location: vscode-main/src/vs/base/browser/fastDomNode.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export class FastDomNode<T extends HTMLElement> {

	private _maxWidth: string = '';
	private _width: string = '';
	private _height: string = '';
	private _top: string = '';
	private _left: string = '';
	private _bottom: string = '';
	private _right: string = '';
	private _paddingTop: string = '';
	private _paddingLeft: string = '';
	private _paddingBottom: string = '';
	private _paddingRight: string = '';
	private _fontFamily: string = '';
	private _fontWeight: string = '';
	private _fontSize: string = '';
	private _fontStyle: string = '';
	private _fontFeatureSettings: string = '';
	private _fontVariationSettings: string = '';
	private _textDecoration: string = '';
	private _lineHeight: string = '';
	private _letterSpacing: string = '';
	private _className: string = '';
	private _display: string = '';
	private _position: string = '';
	private _visibility: string = '';
	private _color: string = '';
	private _backgroundColor: string = '';
	private _layerHint: boolean = false;
	private _contain: 'none' | 'strict' | 'content' | 'size' | 'layout' | 'style' | 'paint' = 'none';
	private _boxShadow: string = '';

	constructor(
		public readonly domNode: T
	) { }

	public focus(): void {
		this.domNode.focus();
	}

	public setMaxWidth(_maxWidth: number | string): void {
		const maxWidth = numberAsPixels(_maxWidth);
		if (this._maxWidth === maxWidth) {
			return;
		}
		this._maxWidth = maxWidth;
		this.domNode.style.maxWidth = this._maxWidth;
	}

	public setWidth(_width: number | string): void {
		const width = numberAsPixels(_width);
		if (this._width === width) {
			return;
		}
		this._width = width;
		this.domNode.style.width = this._width;
	}

	public setHeight(_height: number | string): void {
		const height = numberAsPixels(_height);
		if (this._height === height) {
			return;
		}
		this._height = height;
		this.domNode.style.height = this._height;
	}

	public setTop(_top: number | string): void {
		const top = numberAsPixels(_top);
		if (this._top === top) {
			return;
		}
		this._top = top;
		this.domNode.style.top = this._top;
	}

	public setLeft(_left: number | string): void {
		const left = numberAsPixels(_left);
		if (this._left === left) {
			return;
		}
		this._left = left;
		this.domNode.style.left = this._left;
	}

	public setBottom(_bottom: number | string): void {
		const bottom = numberAsPixels(_bottom);
		if (this._bottom === bottom) {
			return;
		}
		this._bottom = bottom;
		this.domNode.style.bottom = this._bottom;
	}

	public setRight(_right: number | string): void {
		const right = numberAsPixels(_right);
		if (this._right === right) {
			return;
		}
		this._right = right;
		this.domNode.style.right = this._right;
	}

	public setPaddingTop(_paddingTop: number | string): void {
		const paddingTop = numberAsPixels(_paddingTop);
		if (this._paddingTop === paddingTop) {
			return;
		}
		this._paddingTop = paddingTop;
		this.domNode.style.paddingTop = this._paddingTop;
	}

	public setPaddingLeft(_paddingLeft: number | string): void {
		const paddingLeft = numberAsPixels(_paddingLeft);
		if (this._paddingLeft === paddingLeft) {
			return;
		}
		this._paddingLeft = paddingLeft;
		this.domNode.style.paddingLeft = this._paddingLeft;
	}

	public setPaddingBottom(_paddingBottom: number | string): void {
		const paddingBottom = numberAsPixels(_paddingBottom);
		if (this._paddingBottom === paddingBottom) {
			return;
		}
		this._paddingBottom = paddingBottom;
		this.domNode.style.paddingBottom = this._paddingBottom;
	}

	public setPaddingRight(_paddingRight: number | string): void {
		const paddingRight = numberAsPixels(_paddingRight);
		if (this._paddingRight === paddingRight) {
			return;
		}
		this._paddingRight = paddingRight;
		this.domNode.style.paddingRight = this._paddingRight;
	}

	public setFontFamily(fontFamily: string): void {
		if (this._fontFamily === fontFamily) {
			return;
		}
		this._fontFamily = fontFamily;
		this.domNode.style.fontFamily = this._fontFamily;
	}

	public setFontWeight(fontWeight: string): void {
		if (this._fontWeight === fontWeight) {
			return;
		}
		this._fontWeight = fontWeight;
		this.domNode.style.fontWeight = this._fontWeight;
	}

	public setFontSize(_fontSize: number | string): void {
		const fontSize = numberAsPixels(_fontSize);
		if (this._fontSize === fontSize) {
			return;
		}
		this._fontSize = fontSize;
		this.domNode.style.fontSize = this._fontSize;
	}

	public setFontStyle(fontStyle: string): void {
		if (this._fontStyle === fontStyle) {
			return;
		}
		this._fontStyle = fontStyle;
		this.domNode.style.fontStyle = this._fontStyle;
	}

	public setFontFeatureSettings(fontFeatureSettings: string): void {
		if (this._fontFeatureSettings === fontFeatureSettings) {
			return;
		}
		this._fontFeatureSettings = fontFeatureSettings;
		this.domNode.style.fontFeatureSettings = this._fontFeatureSettings;
	}

	public setFontVariationSettings(fontVariationSettings: string): void {
		if (this._fontVariationSettings === fontVariationSettings) {
			return;
		}
		this._fontVariationSettings = fontVariationSettings;
		this.domNode.style.fontVariationSettings = this._fontVariationSettings;
	}

	public setTextDecoration(textDecoration: string): void {
		if (this._textDecoration === textDecoration) {
			return;
		}
		this._textDecoration = textDecoration;
		this.domNode.style.textDecoration = this._textDecoration;
	}

	public setLineHeight(_lineHeight: number | string): void {
		const lineHeight = numberAsPixels(_lineHeight);
		if (this._lineHeight === lineHeight) {
			return;
		}
		this._lineHeight = lineHeight;
		this.domNode.style.lineHeight = this._lineHeight;
	}

	public setLetterSpacing(_letterSpacing: number | string): void {
		const letterSpacing = numberAsPixels(_letterSpacing);
		if (this._letterSpacing === letterSpacing) {
			return;
		}
		this._letterSpacing = letterSpacing;
		this.domNode.style.letterSpacing = this._letterSpacing;
	}

	public setClassName(className: string): void {
		if (this._className === className) {
			return;
		}
		this._className = className;
		this.domNode.className = this._className;
	}

	public toggleClassName(className: string, shouldHaveIt?: boolean): void {
		this.domNode.classList.toggle(className, shouldHaveIt);
		this._className = this.domNode.className;
	}

	public setDisplay(display: string): void {
		if (this._display === display) {
			return;
		}
		this._display = display;
		this.domNode.style.display = this._display;
	}

	public setPosition(position: string): void {
		if (this._position === position) {
			return;
		}
		this._position = position;
		this.domNode.style.position = this._position;
	}

	public setVisibility(visibility: string): void {
		if (this._visibility === visibility) {
			return;
		}
		this._visibility = visibility;
		this.domNode.style.visibility = this._visibility;
	}

	public setColor(color: string): void {
		if (this._color === color) {
			return;
		}
		this._color = color;
		this.domNode.style.color = this._color;
	}

	public setBackgroundColor(backgroundColor: string): void {
		if (this._backgroundColor === backgroundColor) {
			return;
		}
		this._backgroundColor = backgroundColor;
		this.domNode.style.backgroundColor = this._backgroundColor;
	}

	public setLayerHinting(layerHint: boolean): void {
		if (this._layerHint === layerHint) {
			return;
		}
		this._layerHint = layerHint;
		this.domNode.style.transform = this._layerHint ? 'translate3d(0px, 0px, 0px)' : '';
	}

	public setBoxShadow(boxShadow: string): void {
		if (this._boxShadow === boxShadow) {
			return;
		}
		this._boxShadow = boxShadow;
		this.domNode.style.boxShadow = boxShadow;
	}

	public setContain(contain: 'none' | 'strict' | 'content' | 'size' | 'layout' | 'style' | 'paint'): void {
		if (this._contain === contain) {
			return;
		}
		this._contain = contain;
		this.domNode.style.contain = this._contain;
	}

	public setAttribute(name: string, value: string): void {
		this.domNode.setAttribute(name, value);
	}

	public removeAttribute(name: string): void {
		this.domNode.removeAttribute(name);
	}

	public appendChild(child: FastDomNode<T>): void {
		this.domNode.appendChild(child.domNode);
	}

	public removeChild(child: FastDomNode<T>): void {
		this.domNode.removeChild(child.domNode);
	}
}

function numberAsPixels(value: number | string): string {
	return (typeof value === 'number' ? `${value}px` : value);
}

export function createFastDomNode<T extends HTMLElement>(domNode: T): FastDomNode<T> {
	return new FastDomNode(domNode);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/fonts.ts]---
Location: vscode-main/src/vs/base/browser/fonts.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { mainWindow } from './window.js';
import type { IJSONSchemaSnippet } from '../common/jsonSchema.js';
import { isElectron, isMacintosh, isWindows } from '../common/platform.js';

/**
 * The best font-family to be used in CSS based on the platform:
 * - Windows: Segoe preferred, fallback to sans-serif
 * - macOS: standard system font, fallback to sans-serif
 * - Linux: standard system font preferred, fallback to Ubuntu fonts
 *
 * Note: this currently does not adjust for different locales.
 */
export const DEFAULT_FONT_FAMILY = isWindows ? '"Segoe WPC", "Segoe UI", sans-serif' : isMacintosh ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'system-ui, "Ubuntu", "Droid Sans", sans-serif';

interface FontData {
	readonly family: string;
}

export const getFonts = async (): Promise<string[]> => {
	try {
		// @ts-ignore
		const fonts = await mainWindow.queryLocalFonts() as FontData[];
		const fontsArray = [...fonts];
		const families = fontsArray.map(font => font.family);
		return families;
	} catch (error) {
		console.error(`Failed to query fonts: ${error}`);
		return [];
	}
};


export const getFontSnippets = async (): Promise<IJSONSchemaSnippet[]> => {
	if (!isElectron) {
		return [];
	}
	const fonts = await getFonts();
	const snippets: IJSONSchemaSnippet[] = fonts.map(font => {
		return {
			body: `${font}`
		};
	});
	return snippets;
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/formattedTextRenderer.ts]---
Location: vscode-main/src/vs/base/browser/formattedTextRenderer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from './dom.js';
import { IKeyboardEvent } from './keyboardEvent.js';
import { IMouseEvent } from './mouseEvent.js';
import { DisposableStore } from '../common/lifecycle.js';

export interface IContentActionHandler {
	readonly callback: (content: string, event: IMouseEvent | IKeyboardEvent) => void;
	readonly disposables: DisposableStore;
}

export interface FormattedTextRenderOptions {
	readonly actionHandler?: IContentActionHandler;
	readonly renderCodeSegments?: boolean;
}

export function renderText(text: string, _options?: FormattedTextRenderOptions, target?: HTMLElement): HTMLElement {
	const element = target ?? document.createElement('div');
	element.textContent = text;
	return element;
}

export function renderFormattedText(formattedText: string, options?: FormattedTextRenderOptions, target?: HTMLElement): HTMLElement {
	const element = target ?? document.createElement('div');
	element.textContent = '';
	_renderFormattedText(element, parseFormattedText(formattedText, !!options?.renderCodeSegments), options?.actionHandler, options?.renderCodeSegments);
	return element;
}

class StringStream {
	private source: string;
	private index: number;

	constructor(source: string) {
		this.source = source;
		this.index = 0;
	}

	public eos(): boolean {
		return this.index >= this.source.length;
	}

	public next(): string {
		const next = this.peek();
		this.advance();
		return next;
	}

	public peek(): string {
		return this.source[this.index];
	}

	public advance(): void {
		this.index++;
	}
}

const enum FormatType {
	Invalid,
	Root,
	Text,
	Bold,
	Italics,
	Action,
	ActionClose,
	Code,
	NewLine
}

interface IFormatParseTree {
	type: FormatType;
	content?: string;
	index?: number;
	children?: IFormatParseTree[];
}

function _renderFormattedText(element: Node, treeNode: IFormatParseTree, actionHandler?: IContentActionHandler, renderCodeSegments?: boolean) {
	let child: Node | undefined;

	if (treeNode.type === FormatType.Text) {
		child = document.createTextNode(treeNode.content || '');
	} else if (treeNode.type === FormatType.Bold) {
		child = document.createElement('b');
	} else if (treeNode.type === FormatType.Italics) {
		child = document.createElement('i');
	} else if (treeNode.type === FormatType.Code && renderCodeSegments) {
		child = document.createElement('code');
	} else if (treeNode.type === FormatType.Action && actionHandler) {
		const a = document.createElement('a');
		actionHandler.disposables.add(DOM.addStandardDisposableListener(a, 'click', (event) => {
			actionHandler.callback(String(treeNode.index), event);
		}));

		child = a;
	} else if (treeNode.type === FormatType.NewLine) {
		child = document.createElement('br');
	} else if (treeNode.type === FormatType.Root) {
		child = element;
	}

	if (child && element !== child) {
		element.appendChild(child);
	}

	if (child && Array.isArray(treeNode.children)) {
		treeNode.children.forEach((nodeChild) => {
			_renderFormattedText(child, nodeChild, actionHandler, renderCodeSegments);
		});
	}
}

function parseFormattedText(content: string, parseCodeSegments: boolean): IFormatParseTree {

	const root: IFormatParseTree = {
		type: FormatType.Root,
		children: []
	};

	let actionViewItemIndex = 0;
	let current = root;
	const stack: IFormatParseTree[] = [];
	const stream = new StringStream(content);

	while (!stream.eos()) {
		let next = stream.next();

		const isEscapedFormatType = (next === '\\' && formatTagType(stream.peek(), parseCodeSegments) !== FormatType.Invalid);
		if (isEscapedFormatType) {
			next = stream.next(); // unread the backslash if it escapes a format tag type
		}

		if (!isEscapedFormatType && isFormatTag(next, parseCodeSegments) && next === stream.peek()) {
			stream.advance();

			if (current.type === FormatType.Text) {
				current = stack.pop()!;
			}

			const type = formatTagType(next, parseCodeSegments);
			if (current.type === type || (current.type === FormatType.Action && type === FormatType.ActionClose)) {
				current = stack.pop()!;
			} else {
				const newCurrent: IFormatParseTree = {
					type: type,
					children: []
				};

				if (type === FormatType.Action) {
					newCurrent.index = actionViewItemIndex;
					actionViewItemIndex++;
				}

				current.children!.push(newCurrent);
				stack.push(current);
				current = newCurrent;
			}
		} else if (next === '\n') {
			if (current.type === FormatType.Text) {
				current = stack.pop()!;
			}

			current.children!.push({
				type: FormatType.NewLine
			});

		} else {
			if (current.type !== FormatType.Text) {
				const textCurrent: IFormatParseTree = {
					type: FormatType.Text,
					content: next
				};
				current.children!.push(textCurrent);
				stack.push(current);
				current = textCurrent;

			} else {
				current.content += next;
			}
		}
	}

	if (current.type === FormatType.Text) {
		current = stack.pop()!;
	}

	if (stack.length) {
		// incorrectly formatted string literal
	}

	return root;
}

function isFormatTag(char: string, supportCodeSegments: boolean): boolean {
	return formatTagType(char, supportCodeSegments) !== FormatType.Invalid;
}

function formatTagType(char: string, supportCodeSegments: boolean): FormatType {
	switch (char) {
		case '*':
			return FormatType.Bold;
		case '_':
			return FormatType.Italics;
		case '[':
			return FormatType.Action;
		case ']':
			return FormatType.ActionClose;
		case '`':
			return supportCodeSegments ? FormatType.Code : FormatType.Invalid;
		default:
			return FormatType.Invalid;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/globalPointerMoveMonitor.ts]---
Location: vscode-main/src/vs/base/browser/globalPointerMoveMonitor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from './dom.js';
import { DisposableStore, IDisposable, toDisposable } from '../common/lifecycle.js';

export interface IPointerMoveCallback {
	(event: PointerEvent): void;
}

export interface IOnStopCallback {
	(browserEvent?: PointerEvent | KeyboardEvent): void;
}

export class GlobalPointerMoveMonitor implements IDisposable {

	private readonly _hooks = new DisposableStore();
	private _pointerMoveCallback: IPointerMoveCallback | null = null;
	private _onStopCallback: IOnStopCallback | null = null;

	public dispose(): void {
		this.stopMonitoring(false);
		this._hooks.dispose();
	}

	public stopMonitoring(invokeStopCallback: boolean, browserEvent?: PointerEvent | KeyboardEvent): void {
		if (!this.isMonitoring()) {
			// Not monitoring
			return;
		}

		// Unhook
		this._hooks.clear();
		this._pointerMoveCallback = null;
		const onStopCallback = this._onStopCallback;
		this._onStopCallback = null;

		if (invokeStopCallback && onStopCallback) {
			onStopCallback(browserEvent);
		}
	}

	public isMonitoring(): boolean {
		return !!this._pointerMoveCallback;
	}

	public startMonitoring(
		initialElement: Element,
		pointerId: number,
		initialButtons: number,
		pointerMoveCallback: IPointerMoveCallback,
		onStopCallback: IOnStopCallback
	): void {
		if (this.isMonitoring()) {
			this.stopMonitoring(false);
		}
		this._pointerMoveCallback = pointerMoveCallback;
		this._onStopCallback = onStopCallback;

		let eventSource: Element | Window = initialElement;

		try {
			initialElement.setPointerCapture(pointerId);
			this._hooks.add(toDisposable(() => {
				try {
					initialElement.releasePointerCapture(pointerId);
				} catch (err) {
					// See https://github.com/microsoft/vscode/issues/161731
					//
					// `releasePointerCapture` sometimes fails when being invoked with the exception:
					//     DOMException: Failed to execute 'releasePointerCapture' on 'Element':
					//     No active pointer with the given id is found.
					//
					// There's no need to do anything in case of failure
				}
			}));
		} catch (err) {
			// See https://github.com/microsoft/vscode/issues/144584
			// See https://github.com/microsoft/vscode/issues/146947
			// `setPointerCapture` sometimes fails when being invoked
			// from a `mousedown` listener on macOS and Windows
			// and it always fails on Linux with the exception:
			//     DOMException: Failed to execute 'setPointerCapture' on 'Element':
			//     No active pointer with the given id is found.
			// In case of failure, we bind the listeners on the window
			eventSource = dom.getWindow(initialElement);
		}

		this._hooks.add(dom.addDisposableListener(
			eventSource,
			dom.EventType.POINTER_MOVE,
			(e) => {
				if (e.buttons !== initialButtons) {
					// Buttons state has changed in the meantime
					this.stopMonitoring(true);
					return;
				}

				e.preventDefault();
				this._pointerMoveCallback!(e);
			}
		));

		this._hooks.add(dom.addDisposableListener(
			eventSource,
			dom.EventType.POINTER_UP,
			(e: PointerEvent) => this.stopMonitoring(true)
		));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/history.ts]---
Location: vscode-main/src/vs/base/browser/history.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../common/event.js';

export interface IHistoryNavigationWidget {

	readonly element: HTMLElement;

	showPreviousValue(): void;

	showNextValue(): void;

	readonly onDidFocus: Event<void>;

	readonly onDidBlur: Event<void>;

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/iframe.ts]---
Location: vscode-main/src/vs/base/browser/iframe.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Represents a window in a possible chain of iframes
 */
interface IWindowChainElement {
	/**
	 * The window object for it
	 */
	readonly window: WeakRef<Window>;
	/**
	 * The iframe element inside the window.parent corresponding to window
	 */
	readonly iframeElement: Element | null;
}

const sameOriginWindowChainCache = new WeakMap<Window, IWindowChainElement[] | null>();

function getParentWindowIfSameOrigin(w: Window): Window | null {
	if (!w.parent || w.parent === w) {
		return null;
	}

	// Cannot really tell if we have access to the parent window unless we try to access something in it
	try {
		const location = w.location;
		const parentLocation = w.parent.location;
		if (location.origin !== 'null' && parentLocation.origin !== 'null' && location.origin !== parentLocation.origin) {
			return null;
		}
	} catch (e) {
		return null;
	}

	return w.parent;
}

export class IframeUtils {

	/**
	 * Returns a chain of embedded windows with the same origin (which can be accessed programmatically).
	 * Having a chain of length 1 might mean that the current execution environment is running outside of an iframe or inside an iframe embedded in a window with a different origin.
	 */
	private static getSameOriginWindowChain(targetWindow: Window): IWindowChainElement[] {
		let windowChainCache = sameOriginWindowChainCache.get(targetWindow);
		if (!windowChainCache) {
			windowChainCache = [];
			sameOriginWindowChainCache.set(targetWindow, windowChainCache);
			let w: Window | null = targetWindow;
			let parent: Window | null;
			do {
				parent = getParentWindowIfSameOrigin(w);
				if (parent) {
					windowChainCache.push({
						window: new WeakRef(w),
						iframeElement: w.frameElement || null
					});
				} else {
					windowChainCache.push({
						window: new WeakRef(w),
						iframeElement: null
					});
				}
				w = parent;
			} while (w);
		}
		return windowChainCache.slice(0);
	}

	/**
	 * Returns the position of `childWindow` relative to `ancestorWindow`
	 */
	public static getPositionOfChildWindowRelativeToAncestorWindow(childWindow: Window, ancestorWindow: Window | null) {

		if (!ancestorWindow || childWindow === ancestorWindow) {
			return {
				top: 0,
				left: 0
			};
		}

		let top = 0, left = 0;

		const windowChain = this.getSameOriginWindowChain(childWindow);

		for (const windowChainEl of windowChain) {
			const windowInChain = windowChainEl.window.deref();
			top += windowInChain?.scrollY ?? 0;
			left += windowInChain?.scrollX ?? 0;

			if (windowInChain === ancestorWindow) {
				break;
			}

			if (!windowChainEl.iframeElement) {
				break;
			}

			const boundingRect = windowChainEl.iframeElement.getBoundingClientRect();
			top += boundingRect.top;
			left += boundingRect.left;
		}

		return {
			top: top,
			left: left
		};
	}
}

/**
 * Returns a sha-256 composed of `parentOrigin` and `salt` converted to base 32
 */
export async function parentOriginHash(parentOrigin: string, salt: string): Promise<string> {
	// This same code is also inlined at `src/vs/workbench/services/extensions/worker/webWorkerExtensionHostIframe.html`
	if (!crypto.subtle) {
		throw new Error(`'crypto.subtle' is not available so webviews will not work. This is likely because the editor is not running in a secure context (https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts).`);
	}

	const strData = JSON.stringify({ parentOrigin, salt });
	const encoder = new TextEncoder();
	const arrData = encoder.encode(strData);
	const hash = await crypto.subtle.digest('sha-256', arrData);
	return sha256AsBase32(hash);
}

function sha256AsBase32(bytes: ArrayBuffer): string {
	const array = Array.from(new Uint8Array(bytes));
	const hexArray = array.map(b => b.toString(16).padStart(2, '0')).join('');
	// sha256 has 256 bits, so we need at most ceil(lg(2^256-1)/lg(32)) = 52 chars to represent it in base 32
	return BigInt(`0x${hexArray}`).toString(32).padStart(52, '0');
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/indexedDB.ts]---
Location: vscode-main/src/vs/base/browser/indexedDB.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { toErrorMessage } from '../common/errorMessage.js';
import { ErrorNoTelemetry, getErrorMessage } from '../common/errors.js';
import { mark } from '../common/performance.js';

class MissingStoresError extends Error {
	constructor(readonly db: IDBDatabase) {
		super('Missing stores');
	}
}

export class DBClosedError extends Error {
	readonly code = 'DBClosed';
	constructor(dbName: string) {
		super(`IndexedDB database '${dbName}' is closed.`);
	}
}

export class IndexedDB {

	static async create(name: string, version: number | undefined, stores: string[]): Promise<IndexedDB> {
		const database = await IndexedDB.openDatabase(name, version, stores);
		return new IndexedDB(database, name);
	}

	private static async openDatabase(name: string, version: number | undefined, stores: string[]): Promise<IDBDatabase> {
		mark(`code/willOpenDatabase/${name}`);
		try {
			return await IndexedDB.doOpenDatabase(name, version, stores);
		} catch (err) {
			if (err instanceof MissingStoresError) {
				console.info(`Attempting to recreate the IndexedDB once.`, name);

				try {
					// Try to delete the db
					await IndexedDB.deleteDatabase(err.db);
				} catch (error) {
					console.error(`Error while deleting the IndexedDB`, getErrorMessage(error));
					throw error;
				}

				return await IndexedDB.doOpenDatabase(name, version, stores);
			}

			throw err;
		} finally {
			mark(`code/didOpenDatabase/${name}`);
		}
	}

	private static doOpenDatabase(name: string, version: number | undefined, stores: string[]): Promise<IDBDatabase> {
		return new Promise((c, e) => {
			const request = indexedDB.open(name, version);
			request.onerror = () => e(request.error);
			request.onsuccess = () => {
				const db = request.result;
				for (const store of stores) {
					if (!db.objectStoreNames.contains(store)) {
						console.error(`Error while opening IndexedDB. Could not find '${store}'' object store`);
						e(new MissingStoresError(db));
						return;
					}
				}
				c(db);
			};
			request.onupgradeneeded = () => {
				const db = request.result;
				for (const store of stores) {
					if (!db.objectStoreNames.contains(store)) {
						db.createObjectStore(store);
					}
				}
			};
		});
	}

	private static deleteDatabase(database: IDBDatabase): Promise<void> {
		return new Promise((c, e) => {
			// Close any opened connections
			database.close();

			// Delete the db
			const deleteRequest = indexedDB.deleteDatabase(database.name);
			deleteRequest.onerror = (err) => e(deleteRequest.error);
			deleteRequest.onsuccess = () => c();
		});
	}

	private database: IDBDatabase | null = null;
	private readonly pendingTransactions: IDBTransaction[] = [];

	constructor(database: IDBDatabase, private readonly name: string) {
		this.database = database;
	}

	hasPendingTransactions(): boolean {
		return this.pendingTransactions.length > 0;
	}

	close(): void {
		if (this.pendingTransactions.length) {
			this.pendingTransactions.splice(0, this.pendingTransactions.length).forEach(transaction => transaction.abort());
		}
		this.database?.close();
		this.database = null;
	}

	runInTransaction<T>(store: string, transactionMode: IDBTransactionMode, dbRequestFn: (store: IDBObjectStore) => IDBRequest<T>[]): Promise<T[]>;
	runInTransaction<T>(store: string, transactionMode: IDBTransactionMode, dbRequestFn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T>;
	async runInTransaction<T>(store: string, transactionMode: IDBTransactionMode, dbRequestFn: (store: IDBObjectStore) => IDBRequest<T> | IDBRequest<T>[]): Promise<T | T[]> {
		if (!this.database) {
			throw new DBClosedError(this.name);
		}
		const transaction = this.database.transaction(store, transactionMode);
		this.pendingTransactions.push(transaction);
		return new Promise<T | T[]>((c, e) => {
			transaction.oncomplete = () => {
				if (Array.isArray(request)) {
					c(request.map(r => r.result));
				} else {
					c(request.result);
				}
			};
			transaction.onerror = () => e(transaction.error ? ErrorNoTelemetry.fromError(transaction.error) : new ErrorNoTelemetry('unknown error'));
			transaction.onabort = () => e(transaction.error ? ErrorNoTelemetry.fromError(transaction.error) : new ErrorNoTelemetry('unknown error'));
			const request = dbRequestFn(transaction.objectStore(store));
		}).finally(() => this.pendingTransactions.splice(this.pendingTransactions.indexOf(transaction), 1));
	}

	async getKeyValues<V>(store: string, isValid: (value: unknown) => value is V): Promise<Map<string, V>> {
		if (!this.database) {
			throw new DBClosedError(this.name);
		}
		const transaction = this.database.transaction(store, 'readonly');
		this.pendingTransactions.push(transaction);
		return new Promise<Map<string, V>>(resolve => {
			const items = new Map<string, V>();

			const objectStore = transaction.objectStore(store);

			// Open a IndexedDB Cursor to iterate over key/values
			const cursor = objectStore.openCursor();
			if (!cursor) {
				return resolve(items); // this means the `ItemTable` was empty
			}

			// Iterate over rows of `ItemTable` until the end
			cursor.onsuccess = () => {
				if (cursor.result) {

					// Keep cursor key/value in our map
					if (isValid(cursor.result.value)) {
						items.set(cursor.result.key.toString(), cursor.result.value);
					}

					// Advance cursor to next row
					cursor.result.continue();
				} else {
					resolve(items); // reached end of table
				}
			};

			// Error handlers
			const onError = (error: Error | null) => {
				console.error(`IndexedDB getKeyValues(): ${toErrorMessage(error, true)}`);

				resolve(items);
			};
			cursor.onerror = () => onError(cursor.error);
			transaction.onerror = () => onError(transaction.error);
		}).finally(() => this.pendingTransactions.splice(this.pendingTransactions.indexOf(transaction), 1));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/keyboardEvent.ts]---
Location: vscode-main/src/vs/base/browser/keyboardEvent.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as browser from './browser.js';
import { EVENT_KEY_CODE_MAP, isModifierKey, KeyCode, KeyCodeUtils, KeyMod } from '../common/keyCodes.js';
import { KeyCodeChord } from '../common/keybindings.js';
import * as platform from '../common/platform.js';

function extractKeyCode(e: KeyboardEvent): KeyCode {
	if (e.charCode) {
		// "keypress" events mostly
		const char = String.fromCharCode(e.charCode).toUpperCase();
		return KeyCodeUtils.fromString(char);
	}

	const keyCode = e.keyCode;

	// browser quirks
	if (keyCode === 3) {
		return KeyCode.PauseBreak;
	} else if (browser.isFirefox) {
		switch (keyCode) {
			case 59: return KeyCode.Semicolon;
			case 60:
				if (platform.isLinux) { return KeyCode.IntlBackslash; }
				break;
			case 61: return KeyCode.Equal;
			// based on: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode#numpad_keys
			case 107: return KeyCode.NumpadAdd;
			case 109: return KeyCode.NumpadSubtract;
			case 173: return KeyCode.Minus;
			case 224:
				if (platform.isMacintosh) { return KeyCode.Meta; }
				break;
		}
	} else if (browser.isWebKit) {
		if (platform.isMacintosh && keyCode === 93) {
			// the two meta keys in the Mac have different key codes (91 and 93)
			return KeyCode.Meta;
		} else if (!platform.isMacintosh && keyCode === 92) {
			return KeyCode.Meta;
		}
	}

	// cross browser keycodes:
	return EVENT_KEY_CODE_MAP[keyCode] || KeyCode.Unknown;
}

export interface IKeyboardEvent {

	readonly _standardKeyboardEventBrand: true;

	readonly browserEvent: KeyboardEvent;
	readonly target: HTMLElement;

	readonly ctrlKey: boolean;
	readonly shiftKey: boolean;
	readonly altKey: boolean;
	readonly metaKey: boolean;
	readonly altGraphKey: boolean;
	readonly keyCode: KeyCode;
	readonly code: string;

	/**
	 * @internal
	 */
	toKeyCodeChord(): KeyCodeChord;
	equals(keybinding: number): boolean;

	preventDefault(): void;
	stopPropagation(): void;
}

const ctrlKeyMod = (platform.isMacintosh ? KeyMod.WinCtrl : KeyMod.CtrlCmd);
const altKeyMod = KeyMod.Alt;
const shiftKeyMod = KeyMod.Shift;
const metaKeyMod = (platform.isMacintosh ? KeyMod.CtrlCmd : KeyMod.WinCtrl);

export function printKeyboardEvent(e: KeyboardEvent): string {
	const modifiers: string[] = [];
	if (e.ctrlKey) {
		modifiers.push(`ctrl`);
	}
	if (e.shiftKey) {
		modifiers.push(`shift`);
	}
	if (e.altKey) {
		modifiers.push(`alt`);
	}
	if (e.metaKey) {
		modifiers.push(`meta`);
	}
	return `modifiers: [${modifiers.join(',')}], code: ${e.code}, keyCode: ${e.keyCode}, key: ${e.key}`;
}

export function printStandardKeyboardEvent(e: StandardKeyboardEvent): string {
	const modifiers: string[] = [];
	if (e.ctrlKey) {
		modifiers.push(`ctrl`);
	}
	if (e.shiftKey) {
		modifiers.push(`shift`);
	}
	if (e.altKey) {
		modifiers.push(`alt`);
	}
	if (e.metaKey) {
		modifiers.push(`meta`);
	}
	return `modifiers: [${modifiers.join(',')}], code: ${e.code}, keyCode: ${e.keyCode} ('${KeyCodeUtils.toString(e.keyCode)}')`;
}

export function hasModifierKeys(keyStatus: {
	readonly ctrlKey: boolean;
	readonly shiftKey: boolean;
	readonly altKey: boolean;
	readonly metaKey: boolean;
}): boolean {
	return keyStatus.ctrlKey || keyStatus.shiftKey || keyStatus.altKey || keyStatus.metaKey;
}

export class StandardKeyboardEvent implements IKeyboardEvent {

	readonly _standardKeyboardEventBrand = true;

	public readonly browserEvent: KeyboardEvent;
	public readonly target: HTMLElement;

	public readonly ctrlKey: boolean;
	public readonly shiftKey: boolean;
	public readonly altKey: boolean;
	public readonly metaKey: boolean;
	public readonly altGraphKey: boolean;
	public readonly keyCode: KeyCode;
	public readonly code: string;

	private _asKeybinding: number;
	private _asKeyCodeChord: KeyCodeChord;

	constructor(source: KeyboardEvent) {
		const e = source;

		this.browserEvent = e;
		this.target = <HTMLElement>e.target;

		this.ctrlKey = e.ctrlKey;
		this.shiftKey = e.shiftKey;
		this.altKey = e.altKey;
		this.metaKey = e.metaKey;
		this.altGraphKey = e.getModifierState?.('AltGraph');
		this.keyCode = extractKeyCode(e);
		this.code = e.code;

		// console.info(e.type + ": keyCode: " + e.keyCode + ", which: " + e.which + ", charCode: " + e.charCode + ", detail: " + e.detail + " ====> " + this.keyCode + ' -- ' + KeyCode[this.keyCode]);

		this.ctrlKey = this.ctrlKey || this.keyCode === KeyCode.Ctrl;
		this.altKey = this.altKey || this.keyCode === KeyCode.Alt;
		this.shiftKey = this.shiftKey || this.keyCode === KeyCode.Shift;
		this.metaKey = this.metaKey || this.keyCode === KeyCode.Meta;

		this._asKeybinding = this._computeKeybinding();
		this._asKeyCodeChord = this._computeKeyCodeChord();

		// console.log(`code: ${e.code}, keyCode: ${e.keyCode}, key: ${e.key}`);
	}

	public preventDefault(): void {
		if (this.browserEvent && this.browserEvent.preventDefault) {
			this.browserEvent.preventDefault();
		}
	}

	public stopPropagation(): void {
		if (this.browserEvent && this.browserEvent.stopPropagation) {
			this.browserEvent.stopPropagation();
		}
	}

	public toKeyCodeChord(): KeyCodeChord {
		return this._asKeyCodeChord;
	}

	public equals(other: number): boolean {
		return this._asKeybinding === other;
	}

	private _computeKeybinding(): number {
		let key = KeyCode.Unknown;
		if (!isModifierKey(this.keyCode)) {
			key = this.keyCode;
		}

		let result = 0;
		if (this.ctrlKey) {
			result |= ctrlKeyMod;
		}
		if (this.altKey) {
			result |= altKeyMod;
		}
		if (this.shiftKey) {
			result |= shiftKeyMod;
		}
		if (this.metaKey) {
			result |= metaKeyMod;
		}
		result |= key;

		return result;
	}

	private _computeKeyCodeChord(): KeyCodeChord {
		let key = KeyCode.Unknown;
		if (!isModifierKey(this.keyCode)) {
			key = this.keyCode;
		}
		return new KeyCodeChord(this.ctrlKey, this.shiftKey, this.altKey, this.metaKey, key);
	}
}
```

--------------------------------------------------------------------------------

````

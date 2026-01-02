---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 197
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 197 of 552)

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

---[FILE: src/vs/editor/browser/editorDom.ts]---
Location: vscode-main/src/vs/editor/browser/editorDom.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../base/browser/dom.js';
import * as domStylesheetsJs from '../../base/browser/domStylesheets.js';
import { GlobalPointerMoveMonitor } from '../../base/browser/globalPointerMoveMonitor.js';
import { StandardMouseEvent } from '../../base/browser/mouseEvent.js';
import { RunOnceScheduler } from '../../base/common/async.js';
import { Disposable, DisposableMap, DisposableStore, IDisposable } from '../../base/common/lifecycle.js';
import { ICodeEditor } from './editorBrowser.js';
import { asCssVariable } from '../../platform/theme/common/colorRegistry.js';
import { ThemeColor } from '../../base/common/themables.js';

/**
 * Coordinates relative to the whole document (e.g. mouse event's pageX and pageY)
 */
export class PageCoordinates {
	_pageCoordinatesBrand: void = undefined;

	constructor(
		public readonly x: number,
		public readonly y: number
	) { }

	public toClientCoordinates(targetWindow: Window): ClientCoordinates {
		return new ClientCoordinates(this.x - targetWindow.scrollX, this.y - targetWindow.scrollY);
	}
}

/**
 * Coordinates within the application's client area (i.e. origin is document's scroll position).
 *
 * For example, clicking in the top-left corner of the client area will
 * always result in a mouse event with a client.x value of 0, regardless
 * of whether the page is scrolled horizontally.
 */
export class ClientCoordinates {
	_clientCoordinatesBrand: void = undefined;

	constructor(
		public readonly clientX: number,
		public readonly clientY: number
	) { }

	public toPageCoordinates(targetWindow: Window): PageCoordinates {
		return new PageCoordinates(this.clientX + targetWindow.scrollX, this.clientY + targetWindow.scrollY);
	}
}

/**
 * The position of the editor in the page.
 */
export class EditorPagePosition {
	_editorPagePositionBrand: void = undefined;

	constructor(
		public readonly x: number,
		public readonly y: number,
		public readonly width: number,
		public readonly height: number
	) { }
}

/**
 * Coordinates relative to the (top;left) of the editor that can be used safely with other internal editor metrics.
 * **NOTE**: This position is obtained by taking page coordinates and transforming them relative to the
 * editor's (top;left) position in a way in which scale transformations are taken into account.
 * **NOTE**: These coordinates could be negative if the mouse position is outside the editor.
 */
export class CoordinatesRelativeToEditor {
	_positionRelativeToEditorBrand: void = undefined;

	constructor(
		public readonly x: number,
		public readonly y: number
	) { }
}

export function createEditorPagePosition(editorViewDomNode: HTMLElement): EditorPagePosition {
	const editorPos = dom.getDomNodePagePosition(editorViewDomNode);
	return new EditorPagePosition(editorPos.left, editorPos.top, editorPos.width, editorPos.height);
}

export function createCoordinatesRelativeToEditor(editorViewDomNode: HTMLElement, editorPagePosition: EditorPagePosition, pos: PageCoordinates) {
	// The editor's page position is read from the DOM using getBoundingClientRect().
	//
	// getBoundingClientRect() returns the actual dimensions, while offsetWidth and offsetHeight
	// reflect the unscaled size. We can use this difference to detect a transform:scale()
	// and we will apply the transformation in inverse to get mouse coordinates that make sense inside the editor.
	//
	// This could be expanded to cover rotation as well maybe by walking the DOM up from `editorViewDomNode`
	// and computing the effective transformation matrix using getComputedStyle(element).transform.
	//
	const scaleX = editorPagePosition.width / editorViewDomNode.offsetWidth;
	const scaleY = editorPagePosition.height / editorViewDomNode.offsetHeight;

	// Adjust mouse offsets if editor appears to be scaled via transforms
	const relativeX = (pos.x - editorPagePosition.x) / scaleX;
	const relativeY = (pos.y - editorPagePosition.y) / scaleY;
	return new CoordinatesRelativeToEditor(relativeX, relativeY);
}

export class EditorMouseEvent extends StandardMouseEvent {
	_editorMouseEventBrand: void = undefined;

	/**
	 * If the event is a result of using `setPointerCapture`, the `event.target`
	 * does not necessarily reflect the position in the editor.
	 */
	public readonly isFromPointerCapture: boolean;

	/**
	 * Coordinates relative to the whole document.
	 */
	public readonly pos: PageCoordinates;

	/**
	 * Editor's coordinates relative to the whole document.
	 */
	public readonly editorPos: EditorPagePosition;

	/**
	 * Coordinates relative to the (top;left) of the editor.
	 * *NOTE*: These coordinates are preferred because they take into account transformations applied to the editor.
	 * *NOTE*: These coordinates could be negative if the mouse position is outside the editor.
	 */
	public readonly relativePos: CoordinatesRelativeToEditor;

	constructor(e: MouseEvent, isFromPointerCapture: boolean, editorViewDomNode: HTMLElement) {
		super(dom.getWindow(editorViewDomNode), e);
		this.isFromPointerCapture = isFromPointerCapture;
		this.pos = new PageCoordinates(this.posx, this.posy);
		this.editorPos = createEditorPagePosition(editorViewDomNode);
		this.relativePos = createCoordinatesRelativeToEditor(editorViewDomNode, this.editorPos, this.pos);
	}
}

export class EditorMouseEventFactory {

	private readonly _editorViewDomNode: HTMLElement;

	constructor(editorViewDomNode: HTMLElement) {
		this._editorViewDomNode = editorViewDomNode;
	}

	private _create(e: MouseEvent): EditorMouseEvent {
		return new EditorMouseEvent(e, false, this._editorViewDomNode);
	}

	public onContextMenu(target: HTMLElement, callback: (e: EditorMouseEvent) => void): IDisposable {
		return dom.addDisposableListener(target, dom.EventType.CONTEXT_MENU, (e: MouseEvent) => {
			callback(this._create(e));
		});
	}

	public onMouseUp(target: HTMLElement, callback: (e: EditorMouseEvent) => void): IDisposable {
		return dom.addDisposableListener(target, dom.EventType.MOUSE_UP, (e: MouseEvent) => {
			callback(this._create(e));
		});
	}

	public onMouseDown(target: HTMLElement, callback: (e: EditorMouseEvent) => void): IDisposable {
		return dom.addDisposableListener(target, dom.EventType.MOUSE_DOWN, (e: MouseEvent) => {
			callback(this._create(e));
		});
	}

	public onPointerDown(target: HTMLElement, callback: (e: EditorMouseEvent, pointerId: number) => void): IDisposable {
		return dom.addDisposableListener(target, dom.EventType.POINTER_DOWN, (e: PointerEvent) => {
			callback(this._create(e), e.pointerId);
		});
	}

	public onMouseLeave(target: HTMLElement, callback: (e: EditorMouseEvent) => void): IDisposable {
		return dom.addDisposableListener(target, dom.EventType.MOUSE_LEAVE, (e: MouseEvent) => {
			callback(this._create(e));
		});
	}

	public onMouseMove(target: HTMLElement, callback: (e: EditorMouseEvent) => void): IDisposable {
		return dom.addDisposableListener(target, dom.EventType.MOUSE_MOVE, (e) => callback(this._create(e)));
	}
}

export class EditorPointerEventFactory {

	private readonly _editorViewDomNode: HTMLElement;

	constructor(editorViewDomNode: HTMLElement) {
		this._editorViewDomNode = editorViewDomNode;
	}

	private _create(e: MouseEvent): EditorMouseEvent {
		return new EditorMouseEvent(e, false, this._editorViewDomNode);
	}

	public onPointerUp(target: HTMLElement, callback: (e: EditorMouseEvent) => void): IDisposable {
		return dom.addDisposableListener(target, 'pointerup', (e: MouseEvent) => {
			callback(this._create(e));
		});
	}

	public onPointerDown(target: HTMLElement, callback: (e: EditorMouseEvent, pointerId: number) => void): IDisposable {
		return dom.addDisposableListener(target, dom.EventType.POINTER_DOWN, (e: PointerEvent) => {
			callback(this._create(e), e.pointerId);
		});
	}

	public onPointerLeave(target: HTMLElement, callback: (e: EditorMouseEvent) => void): IDisposable {
		return dom.addDisposableListener(target, dom.EventType.POINTER_LEAVE, (e: MouseEvent) => {
			callback(this._create(e));
		});
	}

	public onPointerMove(target: HTMLElement, callback: (e: EditorMouseEvent) => void): IDisposable {
		return dom.addDisposableListener(target, 'pointermove', (e) => callback(this._create(e)));
	}
}

export class GlobalEditorPointerMoveMonitor extends Disposable {

	private readonly _editorViewDomNode: HTMLElement;
	private readonly _globalPointerMoveMonitor: GlobalPointerMoveMonitor;
	private _keydownListener: IDisposable | null;

	constructor(editorViewDomNode: HTMLElement) {
		super();
		this._editorViewDomNode = editorViewDomNode;
		this._globalPointerMoveMonitor = this._register(new GlobalPointerMoveMonitor());
		this._keydownListener = null;
	}

	public startMonitoring(
		initialElement: Element,
		pointerId: number,
		initialButtons: number,
		pointerMoveCallback: (e: EditorMouseEvent) => void,
		onStopCallback: (browserEvent?: PointerEvent | KeyboardEvent) => void
	): void {

		// Add a <<capture>> keydown event listener that will cancel the monitoring
		// if something other than a modifier key is pressed
		this._keydownListener = dom.addStandardDisposableListener(initialElement.ownerDocument, 'keydown', (e) => {
			const chord = e.toKeyCodeChord();
			if (chord.isModifierKey()) {
				// Allow modifier keys
				return;
			}
			this._globalPointerMoveMonitor.stopMonitoring(true, e.browserEvent);
		}, true);

		this._globalPointerMoveMonitor.startMonitoring(
			initialElement,
			pointerId,
			initialButtons,
			(e) => {
				pointerMoveCallback(new EditorMouseEvent(e, true, this._editorViewDomNode));
			},
			(e) => {
				this._keydownListener!.dispose();
				onStopCallback(e);
			}
		);
	}

	public stopMonitoring(): void {
		this._globalPointerMoveMonitor.stopMonitoring(true);
	}
}


/**
 * A helper to create dynamic css rules, bound to a class name.
 * Rules are reused.
 * Reference counting and delayed garbage collection ensure that no rules leak.
*/
export class DynamicCssRules {
	private static _idPool = 0;
	private readonly _instanceId = ++DynamicCssRules._idPool;
	private _counter = 0;
	private readonly _rules = new DisposableMap<string, RefCountedCssRule>();

	// We delay garbage collection so that hanging rules can be reused.
	private readonly _garbageCollectionScheduler = new RunOnceScheduler(() => this.garbageCollect(), 1000);

	constructor(
		private readonly _editor: ICodeEditor
	) { }

	dispose(): void {
		this._rules.dispose();
		this._garbageCollectionScheduler.dispose();
	}

	public createClassNameRef(options: CssProperties): ClassNameReference {
		const rule = this.getOrCreateRule(options);
		rule.increaseRefCount();

		return {
			className: rule.className,
			dispose: () => {
				rule.decreaseRefCount();
				this._garbageCollectionScheduler.schedule();
			}
		};
	}

	private getOrCreateRule(properties: CssProperties): RefCountedCssRule {
		const key = this.computeUniqueKey(properties);
		let existingRule = this._rules.get(key);
		if (!existingRule) {
			const counter = this._counter++;
			existingRule = new RefCountedCssRule(key, `dyn-rule-${this._instanceId}-${counter}`,
				dom.isInShadowDOM(this._editor.getContainerDomNode())
					? this._editor.getContainerDomNode()
					: undefined,
				properties
			);
			this._rules.set(key, existingRule);
		}
		return existingRule;
	}

	private computeUniqueKey(properties: CssProperties): string {
		return JSON.stringify(properties);
	}

	private garbageCollect() {
		for (const rule of this._rules.values()) {
			if (!rule.hasReferences()) {
				this._rules.deleteAndDispose(rule.key);
			}
		}
	}
}

export interface ClassNameReference extends IDisposable {
	className: string;
}

export interface CssProperties {
	border?: string;
	borderColor?: string | ThemeColor;
	borderRadius?: string;
	fontStyle?: string;
	fontWeight?: string;
	fontSize?: string;
	fontFamily?: string;
	unicodeBidi?: string;
	textDecoration?: string;
	color?: string | ThemeColor;
	backgroundColor?: string | ThemeColor;
	opacity?: string;
	verticalAlign?: string;
	cursor?: string;
	margin?: string;
	padding?: string;
	width?: string;
	height?: string;
	display?: string;
}

class RefCountedCssRule {
	private _referenceCount: number = 0;
	private _styleElement: HTMLStyleElement | undefined;
	private readonly _styleElementDisposables: DisposableStore;

	constructor(
		public readonly key: string,
		public readonly className: string,
		_containerElement: HTMLElement | undefined,
		public readonly properties: CssProperties,
	) {
		this._styleElementDisposables = new DisposableStore();
		this._styleElement = domStylesheetsJs.createStyleSheet(_containerElement, undefined, this._styleElementDisposables);
		this._styleElement.textContent = this.getCssText(this.className, this.properties);
	}

	private getCssText(className: string, properties: CssProperties): string {
		let str = `.${className} {`;
		for (const prop in properties) {
			const value = (properties as Record<string, unknown>)[prop] as string | ThemeColor;
			let cssValue: unknown;
			if (typeof value === 'object') {
				cssValue = asCssVariable(value.id);
			} else {
				cssValue = value;
			}

			const cssPropName = camelToDashes(prop);
			str += `\n\t${cssPropName}: ${cssValue};`;
		}
		str += `\n}`;
		return str;
	}

	public dispose(): void {
		this._styleElementDisposables.dispose();
		this._styleElement = undefined;
	}

	public increaseRefCount(): void {
		this._referenceCount++;
	}

	public decreaseRefCount(): void {
		this._referenceCount--;
	}

	public hasReferences(): boolean {
		return this._referenceCount > 0;
	}
}

function camelToDashes(str: string): string {
	return str.replace(/(^[A-Z])/, ([first]) => first.toLowerCase())
		.replace(/([A-Z])/g, ([letter]) => `-${letter.toLowerCase()}`);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/editorExtensions.ts]---
Location: vscode-main/src/vs/editor/browser/editorExtensions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../nls.js';
import { URI } from '../../base/common/uri.js';
import { ICodeEditor, IDiffEditor } from './editorBrowser.js';
import { ICodeEditorService } from './services/codeEditorService.js';
import { Position } from '../common/core/position.js';
import { IEditorContribution, IDiffEditorContribution } from '../common/editorCommon.js';
import { ITextModel } from '../common/model.js';
import { IModelService } from '../common/services/model.js';
import { ITextModelService } from '../common/services/resolverService.js';
import { MenuId, MenuRegistry, Action2 } from '../../platform/actions/common/actions.js';
import { CommandsRegistry, ICommandMetadata } from '../../platform/commands/common/commands.js';
import { ContextKeyExpr, IContextKeyService, ContextKeyExpression } from '../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor as InstantiationServicesAccessor, BrandedService, IInstantiationService, IConstructorSignature } from '../../platform/instantiation/common/instantiation.js';
import { IKeybindings, KeybindingsRegistry, KeybindingWeight } from '../../platform/keybinding/common/keybindingsRegistry.js';
import { Registry } from '../../platform/registry/common/platform.js';
import { ITelemetryService } from '../../platform/telemetry/common/telemetry.js';
import { assertType } from '../../base/common/types.js';
import { ThemeIcon } from '../../base/common/themables.js';
import { IDisposable } from '../../base/common/lifecycle.js';
import { KeyMod, KeyCode } from '../../base/common/keyCodes.js';
import { ILogService } from '../../platform/log/common/log.js';
import { getActiveElement } from '../../base/browser/dom.js';
import { TriggerInlineEditCommandsRegistry } from './triggerInlineEditCommandsRegistry.js';

export type ServicesAccessor = InstantiationServicesAccessor;
export type EditorContributionCtor = IConstructorSignature<IEditorContribution, [ICodeEditor]>;
export type DiffEditorContributionCtor = IConstructorSignature<IDiffEditorContribution, [IDiffEditor]>;

export const enum EditorContributionInstantiation {
	/**
	 * The contribution is created eagerly when the {@linkcode ICodeEditor} is instantiated.
	 * Only Eager contributions can participate in saving or restoring of view state.
	 */
	Eager,

	/**
	 * The contribution is created at the latest 50ms after the first render after attaching a text model.
	 * If the contribution is explicitly requested via `getContribution`, it will be instantiated sooner.
	 * If there is idle time available, it will be instantiated sooner.
	 */
	AfterFirstRender,

	/**
	 * The contribution is created before the editor emits events produced by user interaction (mouse events, keyboard events).
	 * If the contribution is explicitly requested via `getContribution`, it will be instantiated sooner.
	 * If there is idle time available, it will be instantiated sooner.
	 */
	BeforeFirstInteraction,

	/**
	 * The contribution is created when there is idle time available, at the latest 5000ms after the editor creation.
	 * If the contribution is explicitly requested via `getContribution`, it will be instantiated sooner.
	 */
	Eventually,

	/**
	 * The contribution is created only when explicitly requested via `getContribution`.
	 */
	Lazy,
}

export interface IEditorContributionDescription {
	readonly id: string;
	readonly ctor: EditorContributionCtor;
	readonly instantiation: EditorContributionInstantiation;
}

export interface IDiffEditorContributionDescription {
	id: string;
	ctor: DiffEditorContributionCtor;
}

//#region Command

export interface ICommandKeybindingsOptions extends IKeybindings {
	kbExpr?: ContextKeyExpression | null;
	weight: number;
	/**
	 * the default keybinding arguments
	 */
	args?: unknown;
}
export interface ICommandMenuOptions {
	menuId: MenuId;
	group: string;
	order: number;
	when?: ContextKeyExpression;
	title: string;
	icon?: ThemeIcon;
}
export interface ICommandOptions {
	id: string;
	precondition: ContextKeyExpression | undefined;
	kbOpts?: ICommandKeybindingsOptions | ICommandKeybindingsOptions[];
	metadata?: ICommandMetadata;
	menuOpts?: ICommandMenuOptions | ICommandMenuOptions[];
	canTriggerInlineEdits?: boolean;
}
export abstract class Command {
	public readonly id: string;
	public readonly precondition: ContextKeyExpression | undefined;
	private readonly _kbOpts: ICommandKeybindingsOptions | ICommandKeybindingsOptions[] | undefined;
	private readonly _menuOpts: ICommandMenuOptions | ICommandMenuOptions[] | undefined;
	public readonly metadata: ICommandMetadata | undefined;
	public readonly canTriggerInlineEdits: boolean | undefined;

	constructor(opts: ICommandOptions) {
		this.id = opts.id;
		this.precondition = opts.precondition;
		this._kbOpts = opts.kbOpts;
		this._menuOpts = opts.menuOpts;
		this.metadata = opts.metadata;
		this.canTriggerInlineEdits = opts.canTriggerInlineEdits;
	}

	public register(): void {

		if (Array.isArray(this._menuOpts)) {
			this._menuOpts.forEach(this._registerMenuItem, this);
		} else if (this._menuOpts) {
			this._registerMenuItem(this._menuOpts);
		}

		if (this._kbOpts) {
			const kbOptsArr = Array.isArray(this._kbOpts) ? this._kbOpts : [this._kbOpts];
			for (const kbOpts of kbOptsArr) {
				let kbWhen = kbOpts.kbExpr;
				if (this.precondition) {
					if (kbWhen) {
						kbWhen = ContextKeyExpr.and(kbWhen, this.precondition);
					} else {
						kbWhen = this.precondition;
					}
				}

				const desc = {
					id: this.id,
					weight: kbOpts.weight,
					args: kbOpts.args,
					when: kbWhen,
					primary: kbOpts.primary,
					secondary: kbOpts.secondary,
					win: kbOpts.win,
					linux: kbOpts.linux,
					mac: kbOpts.mac,
				};

				KeybindingsRegistry.registerKeybindingRule(desc);
			}
		}

		CommandsRegistry.registerCommand({
			id: this.id,
			handler: (accessor, args) => this.runCommand(accessor, args),
			metadata: this.metadata
		});

		if (this.canTriggerInlineEdits) {
			TriggerInlineEditCommandsRegistry.registerCommand(this.id);
		}
	}

	private _registerMenuItem(item: ICommandMenuOptions): void {
		MenuRegistry.appendMenuItem(item.menuId, {
			group: item.group,
			command: {
				id: this.id,
				title: item.title,
				icon: item.icon,
				precondition: this.precondition
			},
			when: item.when,
			order: item.order
		});
	}

	public abstract runCommand(accessor: ServicesAccessor, args: unknown): void | Promise<void>;
}

//#endregion Command

//#region MultiplexingCommand

/**
 * Potential override for a command.
 *
 * @return `true` or a Promise if the command was successfully run. This stops other overrides from being executed.
 */
export type CommandImplementation = (accessor: ServicesAccessor, args: unknown) => boolean | Promise<void>;

interface ICommandImplementationRegistration {
	priority: number;
	name: string;
	implementation: CommandImplementation;
	when?: ContextKeyExpression;
}

export class MultiCommand extends Command {

	private readonly _implementations: ICommandImplementationRegistration[] = [];

	/**
	 * A higher priority gets to be looked at first
	 */
	public addImplementation(priority: number, name: string, implementation: CommandImplementation, when?: ContextKeyExpression): IDisposable {
		this._implementations.push({ priority, name, implementation, when });
		this._implementations.sort((a, b) => b.priority - a.priority);
		return {
			dispose: () => {
				for (let i = 0; i < this._implementations.length; i++) {
					if (this._implementations[i].implementation === implementation) {
						this._implementations.splice(i, 1);
						return;
					}
				}
			}
		};
	}

	public runCommand(accessor: ServicesAccessor, args: unknown): void | Promise<void> {
		const logService = accessor.get(ILogService);
		const contextKeyService = accessor.get(IContextKeyService);
		logService.trace(`Executing Command '${this.id}' which has ${this._implementations.length} bound.`);
		for (const impl of this._implementations) {
			if (impl.when) {
				const context = contextKeyService.getContext(getActiveElement());
				const value = impl.when.evaluate(context);
				if (!value) {
					continue;
				}
			}
			const result = impl.implementation(accessor, args);
			if (result) {
				logService.trace(`Command '${this.id}' was handled by '${impl.name}'.`);
				if (typeof result === 'boolean') {
					return;
				}
				return result;
			}
		}
		logService.trace(`The Command '${this.id}' was not handled by any implementation.`);
	}
}

//#endregion

/**
 * A command that delegates to another command's implementation.
 *
 * This lets different commands be registered but share the same implementation
 */
export class ProxyCommand extends Command {
	constructor(
		private readonly command: Command,
		opts: ICommandOptions
	) {
		super(opts);
	}

	public runCommand(accessor: ServicesAccessor, args: unknown): void | Promise<void> {
		return this.command.runCommand(accessor, args);
	}
}

//#region EditorCommand

export interface IContributionCommandOptions<T> extends ICommandOptions {
	handler: (controller: T, args: unknown) => void;
}
export interface EditorControllerCommand<T extends IEditorContribution> {
	new(opts: IContributionCommandOptions<T>): EditorCommand;
}
export abstract class EditorCommand extends Command {

	/**
	 * Create a command class that is bound to a certain editor contribution.
	 */
	public static bindToContribution<T extends IEditorContribution>(controllerGetter: (editor: ICodeEditor) => T | null): EditorControllerCommand<T> {
		return class EditorControllerCommandImpl extends EditorCommand {
			private readonly _callback: (controller: T, args: unknown) => void;

			constructor(opts: IContributionCommandOptions<T>) {
				super(opts);

				this._callback = opts.handler;
			}

			public runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, args: unknown): void {
				const controller = controllerGetter(editor);
				if (controller) {
					this._callback(controller, args);
				}
			}
		};
	}

	public static runEditorCommand<T = unknown>(
		accessor: ServicesAccessor,
		args: T,
		precondition: ContextKeyExpression | undefined,
		runner: (accessor: ServicesAccessor, editor: ICodeEditor, args: T) => void | Promise<void>
	): void | Promise<void> {
		const codeEditorService = accessor.get(ICodeEditorService);

		// Find the editor with text focus or active
		const editor = codeEditorService.getFocusedCodeEditor() || codeEditorService.getActiveCodeEditor();
		if (!editor) {
			// well, at least we tried...
			return;
		}

		return editor.invokeWithinContext((editorAccessor) => {
			const kbService = editorAccessor.get(IContextKeyService);
			if (!kbService.contextMatchesRules(precondition ?? undefined)) {
				// precondition does not hold
				return;
			}

			return runner(editorAccessor, editor, args);
		});
	}

	public runCommand(accessor: ServicesAccessor, args: unknown): void | Promise<void> {
		return EditorCommand.runEditorCommand(accessor, args, this.precondition, (accessor, editor, args) => this.runEditorCommand(accessor, editor, args));
	}

	public abstract runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, args: unknown): void | Promise<void>;
}

//#endregion EditorCommand

//#region EditorAction

export interface IEditorActionContextMenuOptions {
	group: string;
	order: number;
	when?: ContextKeyExpression;
	menuId?: MenuId;
}
export type IActionOptions = ICommandOptions & {
	contextMenuOpts?: IEditorActionContextMenuOptions | IEditorActionContextMenuOptions[];
} & ({
	label: nls.ILocalizedString;
	alias?: string;
} | {
	label: string;
	alias: string;
});

export abstract class EditorAction extends EditorCommand {

	private static convertOptions(opts: IActionOptions): ICommandOptions {

		let menuOpts: ICommandMenuOptions[];
		if (Array.isArray(opts.menuOpts)) {
			menuOpts = opts.menuOpts;
		} else if (opts.menuOpts) {
			menuOpts = [opts.menuOpts];
		} else {
			menuOpts = [];
		}

		function withDefaults(item: Partial<ICommandMenuOptions>): ICommandMenuOptions {
			if (!item.menuId) {
				item.menuId = MenuId.EditorContext;
			}
			if (!item.title) {
				item.title = typeof opts.label === 'string' ? opts.label : opts.label.value;
			}
			item.when = ContextKeyExpr.and(opts.precondition, item.when);
			return <ICommandMenuOptions>item;
		}

		if (Array.isArray(opts.contextMenuOpts)) {
			menuOpts.push(...opts.contextMenuOpts.map(withDefaults));
		} else if (opts.contextMenuOpts) {
			menuOpts.push(withDefaults(opts.contextMenuOpts));
		}

		opts.menuOpts = menuOpts;
		return <ICommandOptions>opts;
	}

	public readonly label: string;
	public readonly alias: string;

	constructor(opts: IActionOptions) {
		super(EditorAction.convertOptions(opts));
		if (typeof opts.label === 'string') {
			this.label = opts.label;
			this.alias = opts.alias ?? opts.label;
		} else {
			this.label = opts.label.value;
			this.alias = opts.alias ?? opts.label.original;
		}
	}

	public runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, args: unknown): void | Promise<void> {
		this.reportTelemetry(accessor, editor);
		return this.run(accessor, editor, args || {});
	}

	protected reportTelemetry(accessor: ServicesAccessor, editor: ICodeEditor) {
		type EditorActionInvokedClassification = {
			owner: 'alexdima';
			comment: 'An editor action has been invoked.';
			name: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The label of the action that was invoked.' };
			id: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The identifier of the action that was invoked.' };
		};
		type EditorActionInvokedEvent = {
			name: string;
			id: string;
		};
		accessor.get(ITelemetryService).publicLog2<EditorActionInvokedEvent, EditorActionInvokedClassification>('editorActionInvoked', { name: this.label, id: this.id });
	}

	public abstract run(accessor: ServicesAccessor, editor: ICodeEditor, args: unknown): void | Promise<void>;
}

export type EditorActionImplementation = (accessor: ServicesAccessor, editor: ICodeEditor, args: unknown) => boolean | Promise<void>;

export class MultiEditorAction extends EditorAction {

	private readonly _implementations: [number, EditorActionImplementation][] = [];

	/**
	 * A higher priority gets to be looked at first
	 */
	public addImplementation(priority: number, implementation: EditorActionImplementation): IDisposable {
		this._implementations.push([priority, implementation]);
		this._implementations.sort((a, b) => b[0] - a[0]);
		return {
			dispose: () => {
				for (let i = 0; i < this._implementations.length; i++) {
					if (this._implementations[i][1] === implementation) {
						this._implementations.splice(i, 1);
						return;
					}
				}
			}
		};
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor, args: unknown): void | Promise<void> {
		for (const impl of this._implementations) {
			const result = impl[1](accessor, editor, args);
			if (result) {
				if (typeof result === 'boolean') {
					return;
				}
				return result;
			}
		}
	}

}

//#endregion EditorAction

//#region EditorAction2

export abstract class EditorAction2 extends Action2 {

	run(accessor: ServicesAccessor, ...args: unknown[]) {
		// Find the editor with text focus or active
		const codeEditorService = accessor.get(ICodeEditorService);
		const editor = codeEditorService.getFocusedCodeEditor() || codeEditorService.getActiveCodeEditor();
		if (!editor) {
			// well, at least we tried...
			return;
		}
		// precondition does hold
		return editor.invokeWithinContext((editorAccessor) => {
			const kbService = editorAccessor.get(IContextKeyService);
			const logService = editorAccessor.get(ILogService);
			const enabled = kbService.contextMatchesRules(this.desc.precondition ?? undefined);
			if (!enabled) {
				logService.debug(`[EditorAction2] NOT running command because its precondition is FALSE`, this.desc.id, this.desc.precondition?.serialize());
				return;
			}
			return this.runEditorCommand(editorAccessor, editor, ...args);
		});
	}

	abstract runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, ...args: unknown[]): unknown;
}

//#endregion

// --- Registration of commands and actions


export function registerModelAndPositionCommand(id: string, handler: (accessor: ServicesAccessor, model: ITextModel, position: Position, ...args: unknown[]) => unknown) {
	CommandsRegistry.registerCommand(id, function (accessor, ...args) {

		const instaService = accessor.get(IInstantiationService);

		const [resource, position] = args;
		assertType(URI.isUri(resource));
		assertType(Position.isIPosition(position));

		const model = accessor.get(IModelService).getModel(resource);
		if (model) {
			const editorPosition = Position.lift(position);
			return instaService.invokeFunction(handler, model, editorPosition, ...args.slice(2));
		}

		return accessor.get(ITextModelService).createModelReference(resource).then(reference => {
			return new Promise((resolve, reject) => {
				try {
					const result = instaService.invokeFunction(handler, reference.object.textEditorModel, Position.lift(position), args.slice(2));
					resolve(result);
				} catch (err) {
					reject(err);
				}
			}).finally(() => {
				reference.dispose();
			});
		});
	});
}

export function registerEditorCommand<T extends EditorCommand>(editorCommand: T): T {
	EditorContributionRegistry.INSTANCE.registerEditorCommand(editorCommand);
	return editorCommand;
}

export function registerEditorAction<T extends EditorAction>(ctor: { new(): T }): T {
	const action = new ctor();
	EditorContributionRegistry.INSTANCE.registerEditorAction(action);
	return action;
}

export function registerMultiEditorAction<T extends MultiEditorAction>(action: T): T {
	EditorContributionRegistry.INSTANCE.registerEditorAction(action);
	return action;
}

export function registerInstantiatedEditorAction(editorAction: EditorAction): void {
	EditorContributionRegistry.INSTANCE.registerEditorAction(editorAction);
}

/**
 * Registers an editor contribution. Editor contributions have a lifecycle which is bound
 * to a specific code editor instance.
 */
export function registerEditorContribution<Services extends BrandedService[]>(id: string, ctor: { new(editor: ICodeEditor, ...services: Services): IEditorContribution }, instantiation: EditorContributionInstantiation): void {
	EditorContributionRegistry.INSTANCE.registerEditorContribution(id, ctor, instantiation);
}

/**
 * Registers a diff editor contribution. Diff editor contributions have a lifecycle which
 * is bound to a specific diff editor instance.
 */
export function registerDiffEditorContribution<Services extends BrandedService[]>(id: string, ctor: { new(editor: IDiffEditor, ...services: Services): IEditorContribution }): void {
	EditorContributionRegistry.INSTANCE.registerDiffEditorContribution(id, ctor);
}

export namespace EditorExtensionsRegistry {

	export function getEditorCommand(commandId: string): EditorCommand {
		return EditorContributionRegistry.INSTANCE.getEditorCommand(commandId);
	}

	export function getEditorActions(): Iterable<EditorAction> {
		return EditorContributionRegistry.INSTANCE.getEditorActions();
	}

	export function getEditorContributions(): IEditorContributionDescription[] {
		return EditorContributionRegistry.INSTANCE.getEditorContributions();
	}

	export function getSomeEditorContributions(ids: string[]): IEditorContributionDescription[] {
		return EditorContributionRegistry.INSTANCE.getEditorContributions().filter(c => ids.indexOf(c.id) >= 0);
	}

	export function getDiffEditorContributions(): IDiffEditorContributionDescription[] {
		return EditorContributionRegistry.INSTANCE.getDiffEditorContributions();
	}
}

// Editor extension points
const Extensions = {
	EditorCommonContributions: 'editor.contributions'
};

class EditorContributionRegistry {

	public static readonly INSTANCE = new EditorContributionRegistry();

	private readonly editorContributions: IEditorContributionDescription[] = [];
	private readonly diffEditorContributions: IDiffEditorContributionDescription[] = [];
	private readonly editorActions: EditorAction[] = [];
	private readonly editorCommands: { [commandId: string]: EditorCommand } = Object.create(null);

	constructor() {
	}

	public registerEditorContribution<Services extends BrandedService[]>(id: string, ctor: { new(editor: ICodeEditor, ...services: Services): IEditorContribution }, instantiation: EditorContributionInstantiation): void {
		this.editorContributions.push({ id, ctor: ctor as EditorContributionCtor, instantiation });
	}

	public getEditorContributions(): IEditorContributionDescription[] {
		return this.editorContributions.slice(0);
	}

	public registerDiffEditorContribution<Services extends BrandedService[]>(id: string, ctor: { new(editor: IDiffEditor, ...services: Services): IEditorContribution }): void {
		this.diffEditorContributions.push({ id, ctor: ctor as DiffEditorContributionCtor });
	}

	public getDiffEditorContributions(): IDiffEditorContributionDescription[] {
		return this.diffEditorContributions.slice(0);
	}

	public registerEditorAction(action: EditorAction) {
		action.register();
		this.editorActions.push(action);
	}

	public getEditorActions(): Iterable<EditorAction> {
		return this.editorActions;
	}

	public registerEditorCommand(editorCommand: EditorCommand) {
		editorCommand.register();
		this.editorCommands[editorCommand.id] = editorCommand;
	}

	public getEditorCommand(commandId: string): EditorCommand {
		return (this.editorCommands[commandId] || null);
	}

}
Registry.add(Extensions.EditorCommonContributions, EditorContributionRegistry.INSTANCE);

function registerCommand<T extends Command>(command: T): T {
	command.register();
	return command;
}

export const UndoCommand = registerCommand(new MultiCommand({
	id: 'undo',
	precondition: undefined,
	kbOpts: {
		weight: KeybindingWeight.EditorCore,
		primary: KeyMod.CtrlCmd | KeyCode.KeyZ
	},
	menuOpts: [{
		menuId: MenuId.MenubarEditMenu,
		group: '1_do',
		title: nls.localize({ key: 'miUndo', comment: ['&& denotes a mnemonic'] }, "&&Undo"),
		order: 1
	}, {
		menuId: MenuId.CommandPalette,
		group: '',
		title: nls.localize('undo', "Undo"),
		order: 1
	}, {
		menuId: MenuId.SimpleEditorContext,
		group: '1_do',
		title: nls.localize('undo', "Undo"),
		order: 1
	}]
}));

registerCommand(new ProxyCommand(UndoCommand, { id: 'default:undo', precondition: undefined }));

export const RedoCommand = registerCommand(new MultiCommand({
	id: 'redo',
	precondition: undefined,
	kbOpts: {
		weight: KeybindingWeight.EditorCore,
		primary: KeyMod.CtrlCmd | KeyCode.KeyY,
		secondary: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyZ],
		mac: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyZ }
	},
	menuOpts: [{
		menuId: MenuId.MenubarEditMenu,
		group: '1_do',
		title: nls.localize({ key: 'miRedo', comment: ['&& denotes a mnemonic'] }, "&&Redo"),
		order: 2
	}, {
		menuId: MenuId.CommandPalette,
		group: '',
		title: nls.localize('redo', "Redo"),
		order: 1
	}, {
		menuId: MenuId.SimpleEditorContext,
		group: '1_do',
		title: nls.localize('redo', "Redo"),
		order: 2
	}]
}));

registerCommand(new ProxyCommand(RedoCommand, { id: 'default:redo', precondition: undefined }));

export const SelectAllCommand = registerCommand(new MultiCommand({
	id: 'editor.action.selectAll',
	precondition: undefined,
	kbOpts: {
		weight: KeybindingWeight.EditorCore,
		kbExpr: null,
		primary: KeyMod.CtrlCmd | KeyCode.KeyA
	},
	menuOpts: [{
		menuId: MenuId.MenubarSelectionMenu,
		group: '1_basic',
		title: nls.localize({ key: 'miSelectAll', comment: ['&& denotes a mnemonic'] }, "&&Select All"),
		order: 1
	}, {
		menuId: MenuId.CommandPalette,
		group: '',
		title: nls.localize('selectAll', "Select All"),
		order: 1
	}, {
		menuId: MenuId.SimpleEditorContext,
		group: '9_select',
		title: nls.localize('selectAll', "Select All"),
		order: 1
	}]
}));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/observableCodeEditor.ts]---
Location: vscode-main/src/vs/editor/browser/observableCodeEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { equalsIfDefinedC, arrayEqualsC } from '../../base/common/equals.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../base/common/lifecycle.js';
import { DebugLocation, IObservable, IObservableWithChange, IReader, ITransaction, TransactionImpl, autorun, autorunOpts, derived, derivedOpts, derivedWithSetter, observableFromEvent, observableFromEventOpts, observableSignal, observableSignalFromEvent, observableValue, observableValueOpts } from '../../base/common/observable.js';
import { EditorOption, FindComputedEditorOptionValueById } from '../common/config/editorOptions.js';
import { LineRange } from '../common/core/ranges/lineRange.js';
import { OffsetRange } from '../common/core/ranges/offsetRange.js';
import { Position } from '../common/core/position.js';
import { Selection } from '../common/core/selection.js';
import { ICursorSelectionChangedEvent } from '../common/cursorEvents.js';
import { IModelDeltaDecoration, ITextModel } from '../common/model.js';
import { IModelContentChangedEvent } from '../common/textModelEvents.js';
import { ContentWidgetPositionPreference, ICodeEditor, IContentWidget, IContentWidgetPosition, IEditorMouseEvent, IOverlayWidget, IOverlayWidgetPosition, IPasteEvent } from './editorBrowser.js';
import { Point } from '../common/core/2d/point.js';

/**
 * Returns a facade for the code editor that provides observables for various states/events.
*/
export function observableCodeEditor(editor: ICodeEditor): ObservableCodeEditor {
	return ObservableCodeEditor.get(editor);
}

export class ObservableCodeEditor extends Disposable {
	private static readonly _map = new Map<ICodeEditor, ObservableCodeEditor>();

	/**
	 * Make sure that editor is not disposed yet!
	*/
	public static get(editor: ICodeEditor): ObservableCodeEditor {
		let result = ObservableCodeEditor._map.get(editor);
		if (!result) {
			result = new ObservableCodeEditor(editor);
			ObservableCodeEditor._map.set(editor, result);
			const d = editor.onDidDispose(() => {
				const item = ObservableCodeEditor._map.get(editor);
				if (item) {
					ObservableCodeEditor._map.delete(editor);
					item.dispose();
					d.dispose();
				}
			});
		}
		return result;
	}

	private _updateCounter;
	private _currentTransaction: TransactionImpl | undefined;

	private _beginUpdate(): void {
		this._updateCounter++;
		if (this._updateCounter === 1) {
			this._currentTransaction = new TransactionImpl(() => {
				/** @description Update editor state */
			});
		}
	}

	private _endUpdate(): void {
		this._updateCounter--;
		if (this._updateCounter === 0) {
			const t = this._currentTransaction!;
			this._currentTransaction = undefined;
			t.finish();
		}
	}

	private constructor(public readonly editor: ICodeEditor) {
		super();
		this._updateCounter = 0;
		this._currentTransaction = undefined;
		this._model = observableValue(this, this.editor.getModel());
		this.model = this._model;
		this.isReadonly = observableFromEventOpts({ owner: this, getTransaction: () => this._currentTransaction }, this.editor.onDidChangeConfiguration, () => this.editor.getOption(EditorOption.readOnly));
		this._versionId = observableValueOpts<number | null, IModelContentChangedEvent | undefined>({ owner: this, lazy: true }, this.editor.getModel()?.getVersionId() ?? null);
		this.versionId = this._versionId;
		this._selections = observableValueOpts<Selection[] | null, ICursorSelectionChangedEvent | undefined>(
			{ owner: this, equalsFn: equalsIfDefinedC(arrayEqualsC(Selection.selectionsEqual)), lazy: true },
			this.editor.getSelections() ?? null
		);
		this.selections = this._selections;
		this.positions = derivedOpts<readonly Position[] | null>(
			{ owner: this, equalsFn: equalsIfDefinedC(arrayEqualsC(Position.equals)) },
			reader => this.selections.read(reader)?.map(s => s.getStartPosition()) ?? null
		);
		this.isFocused = observableFromEventOpts({ owner: this, getTransaction: () => this._currentTransaction }, e => {
			const d1 = this.editor.onDidFocusEditorWidget(e);
			const d2 = this.editor.onDidBlurEditorWidget(e);
			return {
				dispose() {
					d1.dispose();
					d2.dispose();
				}
			};
		}, () => this.editor.hasWidgetFocus());
		this.isTextFocused = observableFromEventOpts({ owner: this, getTransaction: () => this._currentTransaction }, e => {
			const d1 = this.editor.onDidFocusEditorText(e);
			const d2 = this.editor.onDidBlurEditorText(e);
			return {
				dispose() {
					d1.dispose();
					d2.dispose();
				}
			};
		}, () => this.editor.hasTextFocus());
		this.inComposition = observableFromEventOpts({ owner: this, getTransaction: () => this._currentTransaction }, e => {
			const d1 = this.editor.onDidCompositionStart(() => {
				e(undefined);
			});
			const d2 = this.editor.onDidCompositionEnd(() => {
				e(undefined);
			});
			return {
				dispose() {
					d1.dispose();
					d2.dispose();
				}
			};
		}, () => this.editor.inComposition);
		this.value = derivedWithSetter(this,
			reader => { this.versionId.read(reader); return this.model.read(reader)?.getValue() ?? ''; },
			(value, tx) => {
				const model = this.model.get();
				if (model !== null) {
					if (value !== model.getValue()) {
						model.setValue(value);
					}
				}
			}
		);
		this.valueIsEmpty = derived(this, reader => { this.versionId.read(reader); return this.editor.getModel()?.getValueLength() === 0; });
		this.cursorSelection = derivedOpts({ owner: this, equalsFn: equalsIfDefinedC(Selection.selectionsEqual) }, reader => this.selections.read(reader)?.[0] ?? null);
		this.cursorPosition = derivedOpts({ owner: this, equalsFn: Position.equals }, reader => this.selections.read(reader)?.[0]?.getPosition() ?? null);
		this.cursorLineNumber = derived<number | null>(this, reader => this.cursorPosition.read(reader)?.lineNumber ?? null);
		this.onDidType = observableSignal<string>(this);
		this.onDidPaste = observableSignal<IPasteEvent>(this);
		this.scrollTop = observableFromEventOpts({ owner: this, getTransaction: () => this._currentTransaction }, this.editor.onDidScrollChange, () => this.editor.getScrollTop());
		this.scrollLeft = observableFromEventOpts({ owner: this, getTransaction: () => this._currentTransaction }, this.editor.onDidScrollChange, () => this.editor.getScrollLeft());
		this.layoutInfo = observableFromEventOpts({ owner: this, getTransaction: () => this._currentTransaction }, this.editor.onDidLayoutChange, () => this.editor.getLayoutInfo());
		this.layoutInfoContentLeft = this.layoutInfo.map(l => l.contentLeft);
		this.layoutInfoDecorationsLeft = this.layoutInfo.map(l => l.decorationsLeft);
		this.layoutInfoWidth = this.layoutInfo.map(l => l.width);
		this.layoutInfoHeight = this.layoutInfo.map(l => l.height);
		this.layoutInfoMinimap = this.layoutInfo.map(l => l.minimap);
		this.layoutInfoVerticalScrollbarWidth = this.layoutInfo.map(l => l.verticalScrollbarWidth);
		this.contentWidth = observableFromEventOpts({ owner: this, getTransaction: () => this._currentTransaction }, this.editor.onDidContentSizeChange, () => this.editor.getContentWidth());
		this.contentHeight = observableFromEventOpts({ owner: this, getTransaction: () => this._currentTransaction }, this.editor.onDidContentSizeChange, () => this.editor.getContentHeight());
		this._onDidChangeViewZones = observableSignalFromEvent(this, this.editor.onDidChangeViewZones);
		this._onDidHiddenAreasChanged = observableSignalFromEvent(this, this.editor.onDidChangeHiddenAreas);
		this._onDidLineHeightChanged = observableSignalFromEvent(this, this.editor.onDidChangeLineHeight);

		this._widgetCounter = 0;
		this.openedPeekWidgets = observableValue(this, 0);

		this._register(this.editor.onBeginUpdate(() => this._beginUpdate()));
		this._register(this.editor.onEndUpdate(() => this._endUpdate()));

		this._register(this.editor.onDidChangeModel(() => {
			this._beginUpdate();
			try {
				this._model.set(this.editor.getModel(), this._currentTransaction);
				this._forceUpdate();
			} finally {
				this._endUpdate();
			}
		}));

		this._register(this.editor.onDidType((e) => {
			this._beginUpdate();
			try {
				this._forceUpdate();
				this.onDidType.trigger(this._currentTransaction, e);
			} finally {
				this._endUpdate();
			}
		}));

		this._register(this.editor.onDidPaste((e) => {
			this._beginUpdate();
			try {
				this._forceUpdate();
				this.onDidPaste.trigger(this._currentTransaction, e);
			} finally {
				this._endUpdate();
			}
		}));

		this._register(this.editor.onDidChangeModelContent(e => {
			this._beginUpdate();
			try {
				this._versionId.set(this.editor.getModel()?.getVersionId() ?? null, this._currentTransaction, e);
				this._forceUpdate();
			} finally {
				this._endUpdate();
			}
		}));

		this._register(this.editor.onDidChangeCursorSelection(e => {
			this._beginUpdate();
			try {
				this._selections.set(this.editor.getSelections(), this._currentTransaction, e);
				this._forceUpdate();
			} finally {
				this._endUpdate();
			}
		}));

		this.domNode = derived(reader => {
			this.model.read(reader);
			return this.editor.getDomNode();
		});
	}

	/**
	 * Batches the transactions started by observableFromEvent.
	 *
	 * If the callback causes the editor to fire an event that updates
	 * an observable value backed by observableFromEvent (such as scrollTop etc.),
	 * then all such updates will be part of the same transaction.
	*/
	public transaction<T>(cb: (tx: ITransaction) => T): T {
		this._beginUpdate();
		try {
			return cb(this._currentTransaction!);
		} finally {
			this._endUpdate();
		}
	}

	public forceUpdate(): void;
	public forceUpdate<T>(cb: (tx: ITransaction) => T): T;
	public forceUpdate<T>(cb?: (tx: ITransaction) => T): T {
		this._beginUpdate();
		try {
			this._forceUpdate();
			if (!cb) { return undefined as T; }
			return cb(this._currentTransaction!);
		} finally {
			this._endUpdate();
		}
	}

	private _forceUpdate(): void {
		this._beginUpdate();
		try {
			this._model.set(this.editor.getModel(), this._currentTransaction);
			this._versionId.set(this.editor.getModel()?.getVersionId() ?? null, this._currentTransaction, undefined);
			this._selections.set(this.editor.getSelections(), this._currentTransaction, undefined);
		} finally {
			this._endUpdate();
		}
	}

	private readonly _model;
	public readonly model: IObservable<ITextModel | null>;

	public readonly isReadonly;

	private readonly _versionId;
	public readonly versionId: IObservableWithChange<number | null, IModelContentChangedEvent | undefined>;

	private readonly _selections;
	public readonly selections: IObservableWithChange<Selection[] | null, ICursorSelectionChangedEvent | undefined>;


	public readonly positions;

	public readonly isFocused;

	public readonly isTextFocused;

	public readonly inComposition;

	public readonly value;
	public readonly valueIsEmpty;
	public readonly cursorSelection;
	public readonly cursorPosition;
	public readonly cursorLineNumber;

	public readonly onDidType;
	public readonly onDidPaste;

	public readonly scrollTop;
	public readonly scrollLeft;

	public readonly layoutInfo;
	public readonly layoutInfoContentLeft;
	public readonly layoutInfoDecorationsLeft;
	public readonly layoutInfoWidth;
	public readonly layoutInfoHeight;
	public readonly layoutInfoMinimap;
	public readonly layoutInfoVerticalScrollbarWidth;

	public readonly contentWidth;
	public readonly contentHeight;

	public readonly domNode;

	public getOption<T extends EditorOption>(id: T, debugLocation = DebugLocation.ofCaller()): IObservable<FindComputedEditorOptionValueById<T>> {
		return observableFromEvent(this, cb => this.editor.onDidChangeConfiguration(e => {
			if (e.hasChanged(id)) { cb(undefined); }
		}), () => this.editor.getOption(id), debugLocation);
	}

	public setDecorations(decorations: IObservable<IModelDeltaDecoration[]>): IDisposable {
		const d = new DisposableStore();
		const decorationsCollection = this.editor.createDecorationsCollection();
		d.add(autorunOpts({ owner: this, debugName: () => `Apply decorations from ${decorations.debugName}` }, reader => {
			const d = decorations.read(reader);
			decorationsCollection.set(d);
		}));
		d.add({
			dispose: () => {
				decorationsCollection.clear();
			}
		});
		return d;
	}

	private _widgetCounter;

	public createOverlayWidget(widget: IObservableOverlayWidget): IDisposable {
		const overlayWidgetId = 'observableOverlayWidget' + (this._widgetCounter++);
		const w: IOverlayWidget = {
			getDomNode: () => widget.domNode,
			getPosition: () => widget.position.get(),
			getId: () => overlayWidgetId,
			allowEditorOverflow: widget.allowEditorOverflow,
			getMinContentWidthInPx: () => widget.minContentWidthInPx.get(),
		};
		this.editor.addOverlayWidget(w);
		const d = autorun(reader => {
			widget.position.read(reader);
			widget.minContentWidthInPx.read(reader);
			this.editor.layoutOverlayWidget(w);
		});
		return toDisposable(() => {
			d.dispose();
			this.editor.removeOverlayWidget(w);
		});
	}

	public createContentWidget(widget: IObservableContentWidget): IDisposable {
		const contentWidgetId = 'observableContentWidget' + (this._widgetCounter++);
		const w: IContentWidget = {
			getDomNode: () => widget.domNode,
			getPosition: () => widget.position.get(),
			getId: () => contentWidgetId,
			allowEditorOverflow: widget.allowEditorOverflow,
		};
		this.editor.addContentWidget(w);
		const d = autorun(reader => {
			widget.position.read(reader);
			this.editor.layoutContentWidget(w);
		});
		return toDisposable(() => {
			d.dispose();
			this.editor.removeContentWidget(w);
		});
	}

	public observeLineOffsetRange(lineRange: IObservable<LineRange>, store: DisposableStore): IObservable<OffsetRange> {
		const start = this.observePosition(lineRange.map(r => new Position(r.startLineNumber, 1)), store);
		const end = this.observePosition(lineRange.map(r => new Position(r.endLineNumberExclusive + 1, 1)), store);

		return derived(reader => {
			start.read(reader);
			end.read(reader);
			const range = lineRange.read(reader);
			const lineCount = this.model.read(reader)?.getLineCount();
			const s = (
				(typeof lineCount !== 'undefined' && range.startLineNumber > lineCount
					? this.editor.getBottomForLineNumber(lineCount)
					: this.editor.getTopForLineNumber(range.startLineNumber)
				)
				- this.scrollTop.read(reader)
			);
			const e = range.isEmpty ? s : (this.editor.getBottomForLineNumber(range.endLineNumberExclusive - 1) - this.scrollTop.read(reader));
			return new OffsetRange(s, e);
		});
	}

	/**
	 * Uses an approximation if the exact position cannot be determined.
	 */
	getLeftOfPosition(position: Position, reader: IReader | undefined): number {
		this.layoutInfo.read(reader);
		this.value.read(reader);

		let offset = this.editor.getOffsetForColumn(position.lineNumber, position.column);
		if (offset === -1) {
			// approximation
			const typicalHalfwidthCharacterWidth = this.editor.getOption(EditorOption.fontInfo).typicalHalfwidthCharacterWidth;
			const approximation = position.column * typicalHalfwidthCharacterWidth;
			offset = approximation;
		}
		return offset;
	}

	public observePosition(position: IObservable<Position | null>, store: DisposableStore): IObservable<Point | null> {
		let pos = position.get();
		const result = observableValueOpts<Point | null>({ owner: this, debugName: () => `topLeftOfPosition${pos?.toString()}`, equalsFn: equalsIfDefinedC(Point.equals) }, new Point(0, 0));
		const contentWidgetId = `observablePositionWidget` + (this._widgetCounter++);
		const domNode = document.createElement('div');
		const w: IContentWidget = {
			getDomNode: () => domNode,
			getPosition: () => {
				return pos ? { preference: [ContentWidgetPositionPreference.EXACT], position: position.get() } : null;
			},
			getId: () => contentWidgetId,
			allowEditorOverflow: false,
			useDisplayNone: true,
			afterRender: (position, coordinate) => {
				const model = this._model.get();
				if (model && pos && pos.lineNumber > model.getLineCount()) {
					// the position is after the last line
					result.set(new Point(0, this.editor.getBottomForLineNumber(model.getLineCount()) - this.scrollTop.get()), undefined);
				} else {
					result.set(coordinate ? new Point(coordinate.left, coordinate.top) : null, undefined);
				}
			},
		};
		this.editor.addContentWidget(w);
		store.add(autorun(reader => {
			pos = position.read(reader);
			this.editor.layoutContentWidget(w);
		}));
		store.add(toDisposable(() => {
			this.editor.removeContentWidget(w);
		}));
		return result;
	}

	public readonly openedPeekWidgets;

	isTargetHovered(predicate: (target: IEditorMouseEvent) => boolean, store: DisposableStore): IObservable<boolean> {
		const isHovered = observableValue('isInjectedTextHovered', false);
		store.add(this.editor.onMouseMove(e => {
			const val = predicate(e);
			isHovered.set(val, undefined);
		}));

		store.add(this.editor.onMouseLeave(E => {
			isHovered.set(false, undefined);
		}));
		return isHovered;
	}

	observeLineHeightForPosition(position: IObservable<Position> | Position): IObservable<number>;
	observeLineHeightForPosition(position: IObservable<null>): IObservable<null>;
	observeLineHeightForPosition(position: IObservable<Position | null> | Position): IObservable<number | null> {
		return derived(reader => {
			const pos = position instanceof Position ? position : position.read(reader);
			if (pos === null) {
				return null;
			}

			this.getOption(EditorOption.lineHeight).read(reader);

			return this.editor.getLineHeightForPosition(pos);
		});
	}

	observeLineHeightForLine(lineNumber: IObservable<number> | number): IObservable<number>;
	observeLineHeightForLine(lineNumber: IObservable<null>): IObservable<null>;
	observeLineHeightForLine(lineNumber: IObservable<number | null> | number): IObservable<number | null> {
		if (typeof lineNumber === 'number') {
			return this.observeLineHeightForPosition(new Position(lineNumber, 1));
		}

		return derived(reader => {
			const line = lineNumber.read(reader);
			if (line === null) {
				return null;
			}

			return this.observeLineHeightForPosition(new Position(line, 1)).read(reader);
		});
	}

	observeLineHeightsForLineRange(lineNumber: IObservable<LineRange> | LineRange): IObservable<number[]> {
		return derived(reader => {
			const range = lineNumber instanceof LineRange ? lineNumber : lineNumber.read(reader);

			const heights: number[] = [];
			for (let i = range.startLineNumber; i < range.endLineNumberExclusive; i++) {
				heights.push(this.observeLineHeightForLine(i).read(reader));
			}
			return heights;
		});
	}

	private readonly _onDidChangeViewZones;
	private readonly _onDidHiddenAreasChanged;
	private readonly _onDidLineHeightChanged;

	/**
	 * Get the vertical position (top offset) for the line's bottom w.r.t. to the first line.
	 */
	observeTopForLineNumber(lineNumber: number): IObservable<number> {
		return derived(reader => {
			this.layoutInfo.read(reader);
			this._onDidChangeViewZones.read(reader);
			this._onDidHiddenAreasChanged.read(reader);
			this._onDidLineHeightChanged.read(reader);
			this._versionId.read(reader);
			return this.editor.getTopForLineNumber(lineNumber);
		});
	}

	/**
	 * Get the vertical position (top offset) for the line's bottom w.r.t. to the first line.
	 */
	observeBottomForLineNumber(lineNumber: number): IObservable<number> {
		return derived(reader => {
			this.layoutInfo.read(reader);
			this._onDidChangeViewZones.read(reader);
			this._onDidHiddenAreasChanged.read(reader);
			this._onDidLineHeightChanged.read(reader);
			this._versionId.read(reader);
			return this.editor.getBottomForLineNumber(lineNumber);
		});
	}
}

interface IObservableOverlayWidget {
	get domNode(): HTMLElement;
	readonly position: IObservable<IOverlayWidgetPosition | null>;
	readonly minContentWidthInPx: IObservable<number>;
	get allowEditorOverflow(): boolean;
}

interface IObservableContentWidget {
	get domNode(): HTMLElement;
	readonly position: IObservable<IContentWidgetPosition | null>;
	get allowEditorOverflow(): boolean;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/stableEditorScroll.ts]---
Location: vscode-main/src/vs/editor/browser/stableEditorScroll.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ICodeEditor } from './editorBrowser.js';
import { Position } from '../common/core/position.js';
import { ScrollType } from '../common/editorCommon.js';

export class StableEditorScrollState {

	public static capture(editor: ICodeEditor): StableEditorScrollState {
		if (editor.getScrollTop() === 0 || editor.hasPendingScrollAnimation()) {
			// Never mess with the scroll top if the editor is at the top of the file or if there is a pending scroll animation
			return new StableEditorScrollState(editor.getScrollTop(), editor.getContentHeight(), null, 0, null);
		}

		let visiblePosition: Position | null = null;
		let visiblePositionScrollDelta = 0;
		const visibleRanges = editor.getVisibleRanges();
		if (visibleRanges.length > 0) {
			visiblePosition = visibleRanges[0].getStartPosition();
			const visiblePositionScrollTop = editor.getTopForPosition(visiblePosition.lineNumber, visiblePosition.column);
			visiblePositionScrollDelta = editor.getScrollTop() - visiblePositionScrollTop;
		}
		return new StableEditorScrollState(editor.getScrollTop(), editor.getContentHeight(), visiblePosition, visiblePositionScrollDelta, editor.getPosition());
	}

	constructor(
		private readonly _initialScrollTop: number,
		private readonly _initialContentHeight: number,
		private readonly _visiblePosition: Position | null,
		private readonly _visiblePositionScrollDelta: number,
		private readonly _cursorPosition: Position | null,
	) {
	}

	public restore(editor: ICodeEditor): void {
		if (this._initialContentHeight === editor.getContentHeight() && this._initialScrollTop === editor.getScrollTop()) {
			// The editor's content height and scroll top haven't changed, so we don't need to do anything
			return;
		}

		if (this._visiblePosition) {
			const visiblePositionScrollTop = editor.getTopForPosition(this._visiblePosition.lineNumber, this._visiblePosition.column);
			editor.setScrollTop(visiblePositionScrollTop + this._visiblePositionScrollDelta);
		}
	}

	public restoreRelativeVerticalPositionOfCursor(editor: ICodeEditor): void {
		if (this._initialContentHeight === editor.getContentHeight() && this._initialScrollTop === editor.getScrollTop()) {
			// The editor's content height and scroll top haven't changed, so we don't need to do anything
			return;
		}

		const currentCursorPosition = editor.getPosition();

		if (!this._cursorPosition || !currentCursorPosition) {
			return;
		}

		const offset = editor.getTopForLineNumber(currentCursorPosition.lineNumber) - editor.getTopForLineNumber(this._cursorPosition.lineNumber);
		editor.setScrollTop(editor.getScrollTop() + offset, ScrollType.Immediate);
	}
}


export class StableEditorBottomScrollState {

	public static capture(editor: ICodeEditor): StableEditorBottomScrollState {
		if (editor.hasPendingScrollAnimation()) {
			// Never mess with the scroll if there is a pending scroll animation
			return new StableEditorBottomScrollState(editor.getScrollTop(), editor.getContentHeight(), null, 0);
		}

		let visiblePosition: Position | null = null;
		let visiblePositionScrollDelta = 0;
		const visibleRanges = editor.getVisibleRanges();
		if (visibleRanges.length > 0) {
			visiblePosition = visibleRanges.at(-1)!.getEndPosition();
			const visiblePositionScrollBottom = editor.getBottomForLineNumber(visiblePosition.lineNumber);
			visiblePositionScrollDelta = visiblePositionScrollBottom - editor.getScrollTop();
		}
		return new StableEditorBottomScrollState(editor.getScrollTop(), editor.getContentHeight(), visiblePosition, visiblePositionScrollDelta);
	}

	constructor(
		private readonly _initialScrollTop: number,
		private readonly _initialContentHeight: number,
		private readonly _visiblePosition: Position | null,
		private readonly _visiblePositionScrollDelta: number,
	) {
	}

	public restore(editor: ICodeEditor): void {
		if (this._initialContentHeight === editor.getContentHeight() && this._initialScrollTop === editor.getScrollTop()) {
			// The editor's content height and scroll top haven't changed, so we don't need to do anything
			return;
		}

		if (this._visiblePosition) {
			const visiblePositionScrollBottom = editor.getBottomForLineNumber(this._visiblePosition.lineNumber);
			editor.setScrollTop(visiblePositionScrollBottom - this._visiblePositionScrollDelta, ScrollType.Immediate);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/triggerInlineEditCommandsRegistry.ts]---
Location: vscode-main/src/vs/editor/browser/triggerInlineEditCommandsRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Registry for commands that can trigger Inline Edits (NES) when invoked.
 */
export abstract class TriggerInlineEditCommandsRegistry {

	private static REGISTERED_COMMANDS = new Set<string>();

	public static getRegisteredCommands(): readonly string[] {
		return [...TriggerInlineEditCommandsRegistry.REGISTERED_COMMANDS];
	}

	public static registerCommand(commandId: string): void {
		TriggerInlineEditCommandsRegistry.REGISTERED_COMMANDS.add(commandId);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/view.ts]---
Location: vscode-main/src/vs/editor/browser/view.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../base/browser/dom.js';
import { FastDomNode, createFastDomNode } from '../../base/browser/fastDomNode.js';
import { IMouseWheelEvent } from '../../base/browser/mouseEvent.js';
import { inputLatency } from '../../base/browser/performance.js';
import { CodeWindow } from '../../base/browser/window.js';
import { BugIndicatingError, onUnexpectedError } from '../../base/common/errors.js';
import { Disposable, IDisposable } from '../../base/common/lifecycle.js';
import { IPointerHandlerHelper } from './controller/mouseHandler.js';
import { PointerHandlerLastRenderData } from './controller/mouseTarget.js';
import { PointerHandler } from './controller/pointerHandler.js';
import { IContentWidget, IContentWidgetPosition, IEditorAriaOptions, IGlyphMarginWidget, IGlyphMarginWidgetPosition, IMouseTarget, IOverlayWidget, IOverlayWidgetPosition, IViewZoneChangeAccessor } from './editorBrowser.js';
import { LineVisibleRanges, RenderingContext, RestrictedRenderingContext } from './view/renderingContext.js';
import { ICommandDelegate, ViewController } from './view/viewController.js';
import { ContentViewOverlays, MarginViewOverlays } from './view/viewOverlays.js';
import { PartFingerprint, PartFingerprints, ViewPart } from './view/viewPart.js';
import { ViewUserInputEvents } from './view/viewUserInputEvents.js';
import { BlockDecorations } from './viewParts/blockDecorations/blockDecorations.js';
import { ViewContentWidgets } from './viewParts/contentWidgets/contentWidgets.js';
import { CurrentLineHighlightOverlay, CurrentLineMarginHighlightOverlay } from './viewParts/currentLineHighlight/currentLineHighlight.js';
import { DecorationsOverlay } from './viewParts/decorations/decorations.js';
import { EditorScrollbar } from './viewParts/editorScrollbar/editorScrollbar.js';
import { GlyphMarginWidgets } from './viewParts/glyphMargin/glyphMargin.js';
import { IndentGuidesOverlay } from './viewParts/indentGuides/indentGuides.js';
import { LineNumbersOverlay } from './viewParts/lineNumbers/lineNumbers.js';
import { ViewLines } from './viewParts/viewLines/viewLines.js';
import { LinesDecorationsOverlay } from './viewParts/linesDecorations/linesDecorations.js';
import { Margin } from './viewParts/margin/margin.js';
import { MarginViewLineDecorationsOverlay } from './viewParts/marginDecorations/marginDecorations.js';
import { Minimap } from './viewParts/minimap/minimap.js';
import { ViewOverlayWidgets } from './viewParts/overlayWidgets/overlayWidgets.js';
import { DecorationsOverviewRuler } from './viewParts/overviewRuler/decorationsOverviewRuler.js';
import { OverviewRuler } from './viewParts/overviewRuler/overviewRuler.js';
import { Rulers } from './viewParts/rulers/rulers.js';
import { ScrollDecorationViewPart } from './viewParts/scrollDecoration/scrollDecoration.js';
import { SelectionsOverlay } from './viewParts/selections/selections.js';
import { ViewCursors } from './viewParts/viewCursors/viewCursors.js';
import { ViewZones } from './viewParts/viewZones/viewZones.js';
import { WhitespaceOverlay } from './viewParts/whitespace/whitespace.js';
import { IEditorConfiguration } from '../common/config/editorConfiguration.js';
import { EditorOption } from '../common/config/editorOptions.js';
import { Position } from '../common/core/position.js';
import { Range } from '../common/core/range.js';
import { Selection } from '../common/core/selection.js';
import { ScrollType } from '../common/editorCommon.js';
import { GlyphMarginLane, IGlyphMarginLanesModel } from '../common/model.js';
import { ViewEventHandler } from '../common/viewEventHandler.js';
import * as viewEvents from '../common/viewEvents.js';
import { ViewportData } from '../common/viewLayout/viewLinesViewportData.js';
import { IViewModel } from '../common/viewModel.js';
import { ViewContext } from '../common/viewModel/viewContext.js';
import { IInstantiationService } from '../../platform/instantiation/common/instantiation.js';
import { IColorTheme, getThemeTypeSelector } from '../../platform/theme/common/themeService.js';
import { ViewGpuContext } from './gpu/viewGpuContext.js';
import { ViewLinesGpu } from './viewParts/viewLinesGpu/viewLinesGpu.js';
import { AbstractEditContext } from './controller/editContext/editContext.js';
import { IVisibleRangeProvider, TextAreaEditContext } from './controller/editContext/textArea/textAreaEditContext.js';
import { NativeEditContext } from './controller/editContext/native/nativeEditContext.js';
import { RulersGpu } from './viewParts/rulersGpu/rulersGpu.js';
import { GpuMarkOverlay } from './viewParts/gpuMark/gpuMark.js';
import { AccessibilitySupport } from '../../platform/accessibility/common/accessibility.js';
import { Event, Emitter } from '../../base/common/event.js';


export interface IContentWidgetData {
	widget: IContentWidget;
	position: IContentWidgetPosition | null;
}

export interface IOverlayWidgetData {
	widget: IOverlayWidget;
	position: IOverlayWidgetPosition | null;
}

export interface IGlyphMarginWidgetData {
	widget: IGlyphMarginWidget;
	position: IGlyphMarginWidgetPosition;
}

export class View extends ViewEventHandler {

	private _widgetFocusTracker: CodeEditorWidgetFocusTracker;

	private readonly _scrollbar: EditorScrollbar;
	private readonly _context: ViewContext;
	private readonly _viewGpuContext?: ViewGpuContext;
	private _selections: Selection[];

	// The view lines
	private readonly _viewLines: ViewLines;
	private readonly _viewLinesGpu?: ViewLinesGpu;

	// These are parts, but we must do some API related calls on them, so we keep a reference
	private readonly _viewZones: ViewZones;
	private readonly _contentWidgets: ViewContentWidgets;
	private readonly _overlayWidgets: ViewOverlayWidgets;
	private readonly _glyphMarginWidgets: GlyphMarginWidgets;
	private readonly _viewCursors: ViewCursors;
	private readonly _viewParts: ViewPart[];
	private readonly _viewController: ViewController;

	private _editContextEnabled: boolean;
	private _accessibilitySupport: AccessibilitySupport;
	private _editContext: AbstractEditContext;
	private readonly _pointerHandler: PointerHandler;

	// Dom nodes
	private readonly _linesContent: FastDomNode<HTMLElement>;
	public readonly domNode: FastDomNode<HTMLElement>;
	private readonly _overflowGuardContainer: FastDomNode<HTMLElement>;

	// Actual mutable state
	private _shouldRecomputeGlyphMarginLanes: boolean = false;
	private _renderAnimationFrame: IDisposable | null;
	private _ownerID: string;

	constructor(
		editorContainer: HTMLElement,
		ownerID: string,
		commandDelegate: ICommandDelegate,
		configuration: IEditorConfiguration,
		colorTheme: IColorTheme,
		model: IViewModel,
		userInputEvents: ViewUserInputEvents,
		overflowWidgetsDomNode: HTMLElement | undefined,
		@IInstantiationService private readonly _instantiationService: IInstantiationService
	) {
		super();
		this._ownerID = ownerID;

		this._widgetFocusTracker = this._register(
			new CodeEditorWidgetFocusTracker(editorContainer, overflowWidgetsDomNode)
		);
		this._register(this._widgetFocusTracker.onChange(() => {
			this._context.viewModel.setHasWidgetFocus(this._widgetFocusTracker.hasFocus());
		}));

		this._selections = [new Selection(1, 1, 1, 1)];
		this._renderAnimationFrame = null;

		this._overflowGuardContainer = createFastDomNode(document.createElement('div'));
		PartFingerprints.write(this._overflowGuardContainer, PartFingerprint.OverflowGuard);
		this._overflowGuardContainer.setClassName('overflow-guard');

		this._viewController = new ViewController(configuration, model, userInputEvents, commandDelegate);

		// The view context is passed on to most classes (basically to reduce param. counts in ctors)
		this._context = new ViewContext(configuration, colorTheme, model);

		// Ensure the view is the first event handler in order to update the layout
		this._context.addEventHandler(this);

		this._viewParts = [];

		// Keyboard handler
		this._editContextEnabled = this._context.configuration.options.get(EditorOption.effectiveEditContext);
		this._accessibilitySupport = this._context.configuration.options.get(EditorOption.accessibilitySupport);
		this._editContext = this._instantiateEditContext();

		this._viewParts.push(this._editContext);

		// These two dom nodes must be constructed up front, since references are needed in the layout provider (scrolling & co.)
		this._linesContent = createFastDomNode(document.createElement('div'));
		this._linesContent.setClassName('lines-content' + ' monaco-editor-background');
		this._linesContent.setPosition('absolute');

		this.domNode = createFastDomNode(document.createElement('div'));
		this.domNode.setClassName(this._getEditorClassName());
		// Set role 'code' for better screen reader support https://github.com/microsoft/vscode/issues/93438
		this.domNode.setAttribute('role', 'code');

		if (this._context.configuration.options.get(EditorOption.experimentalGpuAcceleration) === 'on') {
			this._viewGpuContext = this._instantiationService.createInstance(ViewGpuContext, this._context);
		}

		this._scrollbar = new EditorScrollbar(this._context, this._linesContent, this.domNode, this._overflowGuardContainer);
		this._viewParts.push(this._scrollbar);

		// View Lines
		this._viewLines = new ViewLines(this._context, this._viewGpuContext, this._linesContent);
		if (this._viewGpuContext) {
			this._viewLinesGpu = this._instantiationService.createInstance(ViewLinesGpu, this._context, this._viewGpuContext);
		}

		// View Zones
		this._viewZones = new ViewZones(this._context);
		this._viewParts.push(this._viewZones);

		// Decorations overview ruler
		const decorationsOverviewRuler = new DecorationsOverviewRuler(this._context);
		this._viewParts.push(decorationsOverviewRuler);


		const scrollDecoration = new ScrollDecorationViewPart(this._context);
		this._viewParts.push(scrollDecoration);

		const contentViewOverlays = new ContentViewOverlays(this._context);
		this._viewParts.push(contentViewOverlays);
		contentViewOverlays.addDynamicOverlay(new CurrentLineHighlightOverlay(this._context));
		contentViewOverlays.addDynamicOverlay(new SelectionsOverlay(this._context));
		contentViewOverlays.addDynamicOverlay(new IndentGuidesOverlay(this._context));
		contentViewOverlays.addDynamicOverlay(new DecorationsOverlay(this._context));
		contentViewOverlays.addDynamicOverlay(new WhitespaceOverlay(this._context));

		const marginViewOverlays = new MarginViewOverlays(this._context);
		this._viewParts.push(marginViewOverlays);
		marginViewOverlays.addDynamicOverlay(new CurrentLineMarginHighlightOverlay(this._context));
		marginViewOverlays.addDynamicOverlay(new MarginViewLineDecorationsOverlay(this._context));
		marginViewOverlays.addDynamicOverlay(new LinesDecorationsOverlay(this._context));
		marginViewOverlays.addDynamicOverlay(new LineNumbersOverlay(this._context));
		if (this._viewGpuContext) {
			marginViewOverlays.addDynamicOverlay(new GpuMarkOverlay(this._context, this._viewGpuContext));
		}

		// Glyph margin widgets
		this._glyphMarginWidgets = new GlyphMarginWidgets(this._context);
		this._viewParts.push(this._glyphMarginWidgets);

		const margin = new Margin(this._context);
		margin.getDomNode().appendChild(this._viewZones.marginDomNode);
		margin.getDomNode().appendChild(marginViewOverlays.getDomNode());
		margin.getDomNode().appendChild(this._glyphMarginWidgets.domNode);
		this._viewParts.push(margin);

		// Content widgets
		this._contentWidgets = new ViewContentWidgets(this._context, this.domNode);
		this._viewParts.push(this._contentWidgets);

		this._viewCursors = new ViewCursors(this._context);
		this._viewParts.push(this._viewCursors);

		// Overlay widgets
		this._overlayWidgets = new ViewOverlayWidgets(this._context, this.domNode);
		this._viewParts.push(this._overlayWidgets);

		const rulers = this._viewGpuContext
			? new RulersGpu(this._context, this._viewGpuContext)
			: new Rulers(this._context);
		this._viewParts.push(rulers);

		const blockOutline = new BlockDecorations(this._context);
		this._viewParts.push(blockOutline);

		const minimap = new Minimap(this._context);
		this._viewParts.push(minimap);

		// -------------- Wire dom nodes up

		if (decorationsOverviewRuler) {
			const overviewRulerData = this._scrollbar.getOverviewRulerLayoutInfo();
			overviewRulerData.parent.insertBefore(decorationsOverviewRuler.getDomNode(), overviewRulerData.insertBefore);
		}

		this._linesContent.appendChild(contentViewOverlays.getDomNode());
		if ('domNode' in rulers) {
			this._linesContent.appendChild(rulers.domNode);
		}
		this._linesContent.appendChild(this._viewZones.domNode);
		this._linesContent.appendChild(this._viewLines.getDomNode());
		this._linesContent.appendChild(this._contentWidgets.domNode);
		this._linesContent.appendChild(this._viewCursors.getDomNode());
		this._overflowGuardContainer.appendChild(margin.getDomNode());
		this._overflowGuardContainer.appendChild(this._scrollbar.getDomNode());
		if (this._viewGpuContext) {
			this._overflowGuardContainer.appendChild(this._viewGpuContext.canvas);
		}
		this._overflowGuardContainer.appendChild(scrollDecoration.getDomNode());
		this._overflowGuardContainer.appendChild(this._overlayWidgets.getDomNode());
		this._overflowGuardContainer.appendChild(minimap.getDomNode());
		this._overflowGuardContainer.appendChild(blockOutline.domNode);
		this.domNode.appendChild(this._overflowGuardContainer);

		if (overflowWidgetsDomNode) {
			overflowWidgetsDomNode.appendChild(this._contentWidgets.overflowingContentWidgetsDomNode.domNode);
			overflowWidgetsDomNode.appendChild(this._overlayWidgets.overflowingOverlayWidgetsDomNode.domNode);
		} else {
			this.domNode.appendChild(this._contentWidgets.overflowingContentWidgetsDomNode);
			this.domNode.appendChild(this._overlayWidgets.overflowingOverlayWidgetsDomNode);
		}

		this._applyLayout();

		// Pointer handler
		this._pointerHandler = this._register(new PointerHandler(this._context, this._viewController, this._createPointerHandlerHelper()));
	}

	private _instantiateEditContext(): AbstractEditContext {
		const usingExperimentalEditContext = this._context.configuration.options.get(EditorOption.effectiveEditContext);
		if (usingExperimentalEditContext) {
			return this._instantiationService.createInstance(NativeEditContext, this._ownerID, this._context, this._overflowGuardContainer, this._viewController, this._createTextAreaHandlerHelper());
		} else {
			return this._instantiationService.createInstance(TextAreaEditContext, this._ownerID, this._context, this._overflowGuardContainer, this._viewController, this._createTextAreaHandlerHelper());
		}
	}

	private _updateEditContext(): void {
		const editContextEnabled = this._context.configuration.options.get(EditorOption.effectiveEditContext);
		const accessibilitySupport = this._context.configuration.options.get(EditorOption.accessibilitySupport);
		if (this._editContextEnabled === editContextEnabled && this._accessibilitySupport === accessibilitySupport) {
			return;
		}
		this._editContextEnabled = editContextEnabled;
		this._accessibilitySupport = accessibilitySupport;
		const isEditContextFocused = this._editContext.isFocused();
		const indexOfEditContext = this._viewParts.indexOf(this._editContext);
		this._editContext.dispose();
		this._editContext = this._instantiateEditContext();
		if (isEditContextFocused) {
			this._editContext.focus();
		}
		if (indexOfEditContext !== -1) {
			this._viewParts.splice(indexOfEditContext, 1, this._editContext);
		}
	}

	private _computeGlyphMarginLanes(): IGlyphMarginLanesModel {
		const model = this._context.viewModel.model;
		const laneModel = this._context.viewModel.glyphLanes;
		type Glyph = { range: Range; lane: GlyphMarginLane; persist?: boolean };
		let glyphs: Glyph[] = [];
		let maxLineNumber = 0;

		// Add all margin decorations
		glyphs = glyphs.concat(model.getAllMarginDecorations().map((decoration) => {
			const lane = decoration.options.glyphMargin?.position ?? GlyphMarginLane.Center;
			maxLineNumber = Math.max(maxLineNumber, decoration.range.endLineNumber);
			return { range: decoration.range, lane, persist: decoration.options.glyphMargin?.persistLane };
		}));

		// Add all glyph margin widgets
		glyphs = glyphs.concat(this._glyphMarginWidgets.getWidgets().map((widget) => {
			const range = model.validateRange(widget.preference.range);
			maxLineNumber = Math.max(maxLineNumber, range.endLineNumber);
			return { range, lane: widget.preference.lane };
		}));

		// Sorted by their start position
		glyphs.sort((a, b) => Range.compareRangesUsingStarts(a.range, b.range));

		laneModel.reset(maxLineNumber);
		for (const glyph of glyphs) {
			laneModel.push(glyph.lane, glyph.range, glyph.persist);
		}

		return laneModel;
	}

	private _createPointerHandlerHelper(): IPointerHandlerHelper {
		return {
			viewDomNode: this.domNode.domNode,
			linesContentDomNode: this._linesContent.domNode,
			viewLinesDomNode: this._viewLines.getDomNode().domNode,
			viewLinesGpu: this._viewLinesGpu,

			focusTextArea: () => {
				this.focus();
			},

			dispatchTextAreaEvent: (event: CustomEvent) => {
				this._editContext.domNode.domNode.dispatchEvent(event);
			},

			getLastRenderData: (): PointerHandlerLastRenderData => {
				const lastViewCursorsRenderData = this._viewCursors.getLastRenderData() || [];
				const lastTextareaPosition = this._editContext.getLastRenderData();
				return new PointerHandlerLastRenderData(lastViewCursorsRenderData, lastTextareaPosition);
			},
			renderNow: (): void => {
				this.render(true, false);
			},
			shouldSuppressMouseDownOnViewZone: (viewZoneId: string) => {
				return this._viewZones.shouldSuppressMouseDownOnViewZone(viewZoneId);
			},
			shouldSuppressMouseDownOnWidget: (widgetId: string) => {
				return this._contentWidgets.shouldSuppressMouseDownOnWidget(widgetId);
			},
			getPositionFromDOMInfo: (spanNode: HTMLElement, offset: number) => {
				this._flushAccumulatedAndRenderNow();
				return this._viewLines.getPositionFromDOMInfo(spanNode, offset);
			},

			visibleRangeForPosition: (lineNumber: number, column: number) => {
				this._flushAccumulatedAndRenderNow();
				const position = new Position(lineNumber, column);
				return this._viewLines.visibleRangeForPosition(position) ?? this._viewLinesGpu?.visibleRangeForPosition(position) ?? null;
			},

			getLineWidth: (lineNumber: number) => {
				this._flushAccumulatedAndRenderNow();
				if (this._viewLinesGpu) {
					const result = this._viewLinesGpu.getLineWidth(lineNumber);
					if (result !== undefined) {
						return result;
					}
				}
				return this._viewLines.getLineWidth(lineNumber);
			}
		};
	}

	private _createTextAreaHandlerHelper(): IVisibleRangeProvider {
		return {
			visibleRangeForPosition: (position: Position) => {
				this._flushAccumulatedAndRenderNow();
				return this._viewLines.visibleRangeForPosition(position);
			},
			linesVisibleRangesForRange: (range: Range, includeNewLines: boolean): LineVisibleRanges[] | null => {
				this._flushAccumulatedAndRenderNow();
				return this._viewLines.linesVisibleRangesForRange(range, includeNewLines);
			}
		};
	}

	private _applyLayout(): void {
		const options = this._context.configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);

		this.domNode.setWidth(layoutInfo.width);
		this.domNode.setHeight(layoutInfo.height);

		this._overflowGuardContainer.setWidth(layoutInfo.width);
		this._overflowGuardContainer.setHeight(layoutInfo.height);

		// https://stackoverflow.com/questions/38905916/content-in-google-chrome-larger-than-16777216-px-not-being-rendered
		this._linesContent.setWidth(16777216);
		this._linesContent.setHeight(16777216);
	}

	private _getEditorClassName() {
		const focused = this._editContext.isFocused() ? ' focused' : '';
		return this._context.configuration.options.get(EditorOption.editorClassName) + ' ' + getThemeTypeSelector(this._context.theme.type) + focused;
	}

	// --- begin event handlers
	public override handleEvents(events: viewEvents.ViewEvent[]): void {
		super.handleEvents(events);
		this._scheduleRender();
	}
	public override onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		this.domNode.setClassName(this._getEditorClassName());
		this._updateEditContext();
		this._applyLayout();
		return false;
	}
	public override onCursorStateChanged(e: viewEvents.ViewCursorStateChangedEvent): boolean {
		this._selections = e.selections;
		return false;
	}
	public override onDecorationsChanged(e: viewEvents.ViewDecorationsChangedEvent): boolean {
		if (e.affectsGlyphMargin) {
			this._shouldRecomputeGlyphMarginLanes = true;
		}
		return false;
	}
	public override onFocusChanged(e: viewEvents.ViewFocusChangedEvent): boolean {
		this.domNode.setClassName(this._getEditorClassName());
		return false;
	}
	public override onThemeChanged(e: viewEvents.ViewThemeChangedEvent): boolean {
		this._context.theme.update(e.theme);
		this.domNode.setClassName(this._getEditorClassName());
		return false;
	}

	// --- end event handlers

	public override dispose(): void {
		if (this._renderAnimationFrame !== null) {
			this._renderAnimationFrame.dispose();
			this._renderAnimationFrame = null;
		}

		this._contentWidgets.overflowingContentWidgetsDomNode.domNode.remove();
		this._overlayWidgets.overflowingOverlayWidgetsDomNode.domNode.remove();

		this._context.removeEventHandler(this);
		this._viewGpuContext?.dispose();

		this._viewLines.dispose();
		this._viewLinesGpu?.dispose();

		// Destroy view parts
		for (const viewPart of this._viewParts) {
			viewPart.dispose();
		}

		super.dispose();
	}

	private _scheduleRender(): void {
		if (this._store.isDisposed) {
			throw new BugIndicatingError();
		}
		if (this._renderAnimationFrame === null) {
			// TODO: workaround fix for https://github.com/microsoft/vscode/issues/229825
			if (this._editContext instanceof NativeEditContext) {
				this._editContext.setEditContextOnDomNode();
			}
			const rendering = this._createCoordinatedRendering();
			this._renderAnimationFrame = EditorRenderingCoordinator.INSTANCE.scheduleCoordinatedRendering({
				window: dom.getWindow(this.domNode?.domNode),
				prepareRenderText: () => {
					if (this._store.isDisposed) {
						throw new BugIndicatingError();
					}
					try {
						return rendering.prepareRenderText();
					} finally {
						this._renderAnimationFrame = null;
					}
				},
				renderText: () => {
					if (this._store.isDisposed) {
						throw new BugIndicatingError();
					}
					return rendering.renderText();
				},
				prepareRender: (viewParts: ViewPart[], ctx: RenderingContext) => {
					if (this._store.isDisposed) {
						throw new BugIndicatingError();
					}
					return rendering.prepareRender(viewParts, ctx);
				},
				render: (viewParts: ViewPart[], ctx: RestrictedRenderingContext) => {
					if (this._store.isDisposed) {
						throw new BugIndicatingError();
					}
					return rendering.render(viewParts, ctx);
				}
			});
		}
	}

	private _flushAccumulatedAndRenderNow(): void {
		const rendering = this._createCoordinatedRendering();
		safeInvokeNoArg(() => rendering.prepareRenderText());
		const data = safeInvokeNoArg(() => rendering.renderText());
		if (data) {
			const [viewParts, ctx] = data;
			safeInvokeNoArg(() => rendering.prepareRender(viewParts, ctx));
			safeInvokeNoArg(() => rendering.render(viewParts, ctx));
		}
	}

	private _getViewPartsToRender(): ViewPart[] {
		const result: ViewPart[] = [];
		let resultLen = 0;
		for (const viewPart of this._viewParts) {
			if (viewPart.shouldRender()) {
				result[resultLen++] = viewPart;
			}
		}
		return result;
	}

	private _createCoordinatedRendering() {
		return {
			prepareRenderText: () => {
				if (this._shouldRecomputeGlyphMarginLanes) {
					this._shouldRecomputeGlyphMarginLanes = false;
					const model = this._computeGlyphMarginLanes();
					this._context.configuration.setGlyphMarginDecorationLaneCount(model.requiredLanes);
				}
				inputLatency.onRenderStart();
			},
			renderText: (): [ViewPart[], RenderingContext] | null => {
				if (!this.domNode.domNode.isConnected) {
					return null;
				}
				let viewPartsToRender = this._getViewPartsToRender();
				if (!this._viewLines.shouldRender() && viewPartsToRender.length === 0) {
					// Nothing to render
					return null;
				}
				const partialViewportData = this._context.viewLayout.getLinesViewportData();
				this._context.viewModel.setViewport(partialViewportData.startLineNumber, partialViewportData.endLineNumber, partialViewportData.centeredLineNumber);

				const viewportData = new ViewportData(
					this._selections,
					partialViewportData,
					this._context.viewLayout.getWhitespaceViewportData(),
					this._context.viewModel
				);

				if (this._contentWidgets.shouldRender()) {
					// Give the content widgets a chance to set their max width before a possible synchronous layout
					this._contentWidgets.onBeforeRender(viewportData);
				}

				if (this._viewLines.shouldRender()) {
					this._viewLines.renderText(viewportData);
					this._viewLines.onDidRender();

					// Rendering of viewLines might cause scroll events to occur, so collect view parts to render again
					viewPartsToRender = this._getViewPartsToRender();
				}

				if (this._viewLinesGpu?.shouldRender()) {
					this._viewLinesGpu.renderText(viewportData);
					this._viewLinesGpu.onDidRender();
				}

				return [viewPartsToRender, new RenderingContext(this._context.viewLayout, viewportData, this._viewLines, this._viewLinesGpu)];
			},
			prepareRender: (viewPartsToRender: ViewPart[], ctx: RenderingContext) => {
				for (const viewPart of viewPartsToRender) {
					viewPart.prepareRender(ctx);
				}
			},
			render: (viewPartsToRender: ViewPart[], ctx: RestrictedRenderingContext) => {
				for (const viewPart of viewPartsToRender) {
					viewPart.render(ctx);
					viewPart.onDidRender();
				}
			}
		};
	}

	// --- BEGIN CodeEditor helpers

	public delegateVerticalScrollbarPointerDown(browserEvent: PointerEvent): void {
		this._scrollbar.delegateVerticalScrollbarPointerDown(browserEvent);
	}

	public delegateScrollFromMouseWheelEvent(browserEvent: IMouseWheelEvent) {
		this._scrollbar.delegateScrollFromMouseWheelEvent(browserEvent);
	}

	public restoreState(scrollPosition: { scrollLeft: number; scrollTop: number }): void {
		this._context.viewModel.viewLayout.setScrollPosition({
			scrollTop: scrollPosition.scrollTop,
			scrollLeft: scrollPosition.scrollLeft
		}, ScrollType.Immediate);
		this._context.viewModel.visibleLinesStabilized();
	}

	public getOffsetForColumn(modelLineNumber: number, modelColumn: number): number {
		const modelPosition = this._context.viewModel.model.validatePosition({
			lineNumber: modelLineNumber,
			column: modelColumn
		});
		const viewPosition = this._context.viewModel.coordinatesConverter.convertModelPositionToViewPosition(modelPosition);
		this._flushAccumulatedAndRenderNow();
		const visibleRange = this._viewLines.visibleRangeForPosition(new Position(viewPosition.lineNumber, viewPosition.column));
		if (!visibleRange) {
			return -1;
		}
		return visibleRange.left;
	}

	public getLineWidth(modelLineNumber: number): number {
		const model = this._context.viewModel.model;
		const viewLine = this._context.viewModel.coordinatesConverter.convertModelPositionToViewPosition(new Position(modelLineNumber, model.getLineMaxColumn(modelLineNumber))).lineNumber;
		this._flushAccumulatedAndRenderNow();
		const width = this._viewLines.getLineWidth(viewLine);

		return width;
	}

	public getTargetAtClientPoint(clientX: number, clientY: number): IMouseTarget | null {
		const mouseTarget = this._pointerHandler.getTargetAtClientPoint(clientX, clientY);
		if (!mouseTarget) {
			return null;
		}
		return ViewUserInputEvents.convertViewToModelMouseTarget(mouseTarget, this._context.viewModel.coordinatesConverter);
	}

	public createOverviewRuler(cssClassName: string): OverviewRuler {
		return new OverviewRuler(this._context, cssClassName);
	}

	public change(callback: (changeAccessor: IViewZoneChangeAccessor) => unknown): void {
		this._viewZones.changeViewZones(callback);
		this._scheduleRender();
	}

	public render(now: boolean, everything: boolean): void {
		if (everything) {
			// Force everything to render...
			this._viewLines.forceShouldRender();
			for (const viewPart of this._viewParts) {
				viewPart.forceShouldRender();
			}
		}
		if (now) {
			this._flushAccumulatedAndRenderNow();
		} else {
			this._scheduleRender();
		}
	}

	public writeScreenReaderContent(reason: string): void {
		this._editContext.writeScreenReaderContent(reason);
	}

	public focus(): void {
		this._editContext.focus();
	}

	public isFocused(): boolean {
		return this._editContext.isFocused();
	}

	public isWidgetFocused(): boolean {
		return this._widgetFocusTracker.hasFocus();
	}

	public refreshFocusState() {
		this._editContext.refreshFocusState();
		this._widgetFocusTracker.refreshState();
	}

	public setAriaOptions(options: IEditorAriaOptions): void {
		this._editContext.setAriaOptions(options);
	}

	public addContentWidget(widgetData: IContentWidgetData): void {
		this._contentWidgets.addWidget(widgetData.widget);
		this.layoutContentWidget(widgetData);
		this._scheduleRender();
	}

	public layoutContentWidget(widgetData: IContentWidgetData): void {
		this._contentWidgets.setWidgetPosition(
			widgetData.widget,
			widgetData.position?.position ?? null,
			widgetData.position?.secondaryPosition ?? null,
			widgetData.position?.preference ?? null,
			widgetData.position?.positionAffinity ?? null
		);
		if (this._contentWidgets.shouldRender()) {
			this._scheduleRender();
		}
	}

	public removeContentWidget(widgetData: IContentWidgetData): void {
		this._contentWidgets.removeWidget(widgetData.widget);
		this._scheduleRender();
	}

	public addOverlayWidget(widgetData: IOverlayWidgetData): void {
		this._overlayWidgets.addWidget(widgetData.widget);
		this.layoutOverlayWidget(widgetData);
		this._scheduleRender();
	}

	public layoutOverlayWidget(widgetData: IOverlayWidgetData): void {
		const shouldRender = this._overlayWidgets.setWidgetPosition(widgetData.widget, widgetData.position);
		if (shouldRender) {
			this._scheduleRender();
		}
	}

	public removeOverlayWidget(widgetData: IOverlayWidgetData): void {
		this._overlayWidgets.removeWidget(widgetData.widget);
		this._scheduleRender();
	}

	public addGlyphMarginWidget(widgetData: IGlyphMarginWidgetData): void {
		this._glyphMarginWidgets.addWidget(widgetData.widget);
		this._shouldRecomputeGlyphMarginLanes = true;
		this._scheduleRender();
	}

	public layoutGlyphMarginWidget(widgetData: IGlyphMarginWidgetData): void {
		const newPreference = widgetData.position;
		const shouldRender = this._glyphMarginWidgets.setWidgetPosition(widgetData.widget, newPreference);
		if (shouldRender) {
			this._shouldRecomputeGlyphMarginLanes = true;
			this._scheduleRender();
		}
	}

	public removeGlyphMarginWidget(widgetData: IGlyphMarginWidgetData): void {
		this._glyphMarginWidgets.removeWidget(widgetData.widget);
		this._shouldRecomputeGlyphMarginLanes = true;
		this._scheduleRender();
	}

	// --- END CodeEditor helpers

}

function safeInvokeNoArg<T>(func: () => T): T | null {
	try {
		return func();
	} catch (e) {
		onUnexpectedError(e);
		return null;
	}
}

interface ICoordinatedRendering {
	readonly window: CodeWindow;
	prepareRenderText(): void;
	renderText(): [ViewPart[], RenderingContext] | null;
	prepareRender(viewParts: ViewPart[], ctx: RenderingContext): void;
	render(viewParts: ViewPart[], ctx: RestrictedRenderingContext): void;
}

class EditorRenderingCoordinator {

	public static INSTANCE = new EditorRenderingCoordinator();

	private _coordinatedRenderings: ICoordinatedRendering[] = [];
	private _animationFrameRunners = new Map<CodeWindow, IDisposable>();

	private constructor() { }

	scheduleCoordinatedRendering(rendering: ICoordinatedRendering): IDisposable {
		this._coordinatedRenderings.push(rendering);
		this._scheduleRender(rendering.window);
		return {
			dispose: () => {
				const renderingIndex = this._coordinatedRenderings.indexOf(rendering);
				if (renderingIndex === -1) {
					return;
				}
				this._coordinatedRenderings.splice(renderingIndex, 1);

				if (this._coordinatedRenderings.length === 0) {
					// There are no more renderings to coordinate => cancel animation frames
					for (const [_, disposable] of this._animationFrameRunners) {
						disposable.dispose();
					}
					this._animationFrameRunners.clear();
				}
			}
		};
	}

	private _scheduleRender(window: CodeWindow): void {
		if (!this._animationFrameRunners.has(window)) {
			const runner = () => {
				this._animationFrameRunners.delete(window);
				this._onRenderScheduled();
			};
			this._animationFrameRunners.set(window, dom.runAtThisOrScheduleAtNextAnimationFrame(window, runner, 100));
		}
	}

	private _onRenderScheduled(): void {
		const coordinatedRenderings = this._coordinatedRenderings.slice(0);
		this._coordinatedRenderings = [];

		for (const rendering of coordinatedRenderings) {
			safeInvokeNoArg(() => rendering.prepareRenderText());
		}

		const datas: ([ViewPart[], RenderingContext] | null)[] = [];
		for (let i = 0, len = coordinatedRenderings.length; i < len; i++) {
			const rendering = coordinatedRenderings[i];
			datas[i] = safeInvokeNoArg(() => rendering.renderText());
		}

		for (let i = 0, len = coordinatedRenderings.length; i < len; i++) {
			const rendering = coordinatedRenderings[i];
			const data = datas[i];
			if (!data) {
				continue;
			}
			const [viewParts, ctx] = data;
			safeInvokeNoArg(() => rendering.prepareRender(viewParts, ctx));
		}

		for (let i = 0, len = coordinatedRenderings.length; i < len; i++) {
			const rendering = coordinatedRenderings[i];
			const data = datas[i];
			if (!data) {
				continue;
			}
			const [viewParts, ctx] = data;
			safeInvokeNoArg(() => rendering.render(viewParts, ctx));
		}
	}
}

class CodeEditorWidgetFocusTracker extends Disposable {

	private _hasDomElementFocus: boolean;
	private readonly _domFocusTracker: dom.IFocusTracker;
	private readonly _overflowWidgetsDomNode: dom.IFocusTracker | undefined;

	private readonly _onChange: Emitter<void> = this._register(new Emitter<void>());
	public readonly onChange: Event<void> = this._onChange.event;

	private _overflowWidgetsDomNodeHasFocus: boolean;

	private _hadFocus: boolean | undefined = undefined;

	constructor(domElement: HTMLElement, overflowWidgetsDomNode: HTMLElement | undefined) {
		super();

		this._hasDomElementFocus = false;
		this._domFocusTracker = this._register(dom.trackFocus(domElement));

		this._overflowWidgetsDomNodeHasFocus = false;

		this._register(this._domFocusTracker.onDidFocus(() => {
			this._hasDomElementFocus = true;
			this._update();
		}));
		this._register(this._domFocusTracker.onDidBlur(() => {
			this._hasDomElementFocus = false;
			this._update();
		}));

		if (overflowWidgetsDomNode) {
			this._overflowWidgetsDomNode = this._register(dom.trackFocus(overflowWidgetsDomNode));
			this._register(this._overflowWidgetsDomNode.onDidFocus(() => {
				this._overflowWidgetsDomNodeHasFocus = true;
				this._update();
			}));
			this._register(this._overflowWidgetsDomNode.onDidBlur(() => {
				this._overflowWidgetsDomNodeHasFocus = false;
				this._update();
			}));
		}
	}

	private _update() {
		const focused = this._hasDomElementFocus || this._overflowWidgetsDomNodeHasFocus;
		if (this._hadFocus !== focused) {
			this._hadFocus = focused;
			this._onChange.fire(undefined);
		}
	}

	public hasFocus(): boolean {
		return this._hadFocus ?? false;
	}

	public refreshState(): void {
		this._domFocusTracker.refreshState();
		this._overflowWidgetsDomNode?.refreshState?.();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/config/charWidthReader.ts]---
Location: vscode-main/src/vs/editor/browser/config/charWidthReader.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { applyFontInfo } from './domFontInfo.js';
import { BareFontInfo } from '../../common/config/fontInfo.js';

export const enum CharWidthRequestType {
	Regular = 0,
	Italic = 1,
	Bold = 2
}

export class CharWidthRequest {

	public readonly chr: string;
	public readonly type: CharWidthRequestType;
	public width: number;

	constructor(chr: string, type: CharWidthRequestType) {
		this.chr = chr;
		this.type = type;
		this.width = 0;
	}

	public fulfill(width: number) {
		this.width = width;
	}
}

class DomCharWidthReader {

	private readonly _bareFontInfo: BareFontInfo;
	private readonly _requests: CharWidthRequest[];

	private _container: HTMLElement | null;
	private _testElements: HTMLSpanElement[] | null;

	constructor(bareFontInfo: BareFontInfo, requests: CharWidthRequest[]) {
		this._bareFontInfo = bareFontInfo;
		this._requests = requests;

		this._container = null;
		this._testElements = null;
	}

	public read(targetWindow: Window): void {
		// Create a test container with all these test elements
		this._createDomElements();

		// Add the container to the DOM
		targetWindow.document.body.appendChild(this._container!);

		// Read character widths
		this._readFromDomElements();

		// Remove the container from the DOM
		this._container?.remove();

		this._container = null;
		this._testElements = null;
	}

	private _createDomElements(): void {
		const container = document.createElement('div');
		container.style.position = 'absolute';
		container.style.top = '-50000px';
		container.style.width = '50000px';

		const regularDomNode = document.createElement('div');
		applyFontInfo(regularDomNode, this._bareFontInfo);
		container.appendChild(regularDomNode);

		const boldDomNode = document.createElement('div');
		applyFontInfo(boldDomNode, this._bareFontInfo);
		boldDomNode.style.fontWeight = 'bold';
		container.appendChild(boldDomNode);

		const italicDomNode = document.createElement('div');
		applyFontInfo(italicDomNode, this._bareFontInfo);
		italicDomNode.style.fontStyle = 'italic';
		container.appendChild(italicDomNode);

		const testElements: HTMLSpanElement[] = [];
		for (const request of this._requests) {

			let parent: HTMLElement;
			if (request.type === CharWidthRequestType.Regular) {
				parent = regularDomNode;
			}
			if (request.type === CharWidthRequestType.Bold) {
				parent = boldDomNode;
			}
			if (request.type === CharWidthRequestType.Italic) {
				parent = italicDomNode;
			}

			parent!.appendChild(document.createElement('br'));

			const testElement = document.createElement('span');
			DomCharWidthReader._render(testElement, request);
			parent!.appendChild(testElement);

			testElements.push(testElement);
		}

		this._container = container;
		this._testElements = testElements;
	}

	private static _render(testElement: HTMLElement, request: CharWidthRequest): void {
		if (request.chr === ' ') {
			let htmlString = '\u00a0';
			// Repeat character 256 (2^8) times
			for (let i = 0; i < 8; i++) {
				htmlString += htmlString;
			}
			testElement.innerText = htmlString;
		} else {
			let testString = request.chr;
			// Repeat character 256 (2^8) times
			for (let i = 0; i < 8; i++) {
				testString += testString;
			}
			testElement.textContent = testString;
		}
	}

	private _readFromDomElements(): void {
		for (let i = 0, len = this._requests.length; i < len; i++) {
			const request = this._requests[i];
			const testElement = this._testElements![i];

			request.fulfill(testElement.offsetWidth / 256);
		}
	}
}

export function readCharWidths(targetWindow: Window, bareFontInfo: BareFontInfo, requests: CharWidthRequest[]): void {
	const reader = new DomCharWidthReader(bareFontInfo, requests);
	reader.read(targetWindow);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/config/domFontInfo.ts]---
Location: vscode-main/src/vs/editor/browser/config/domFontInfo.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FastDomNode } from '../../../base/browser/fastDomNode.js';
import { BareFontInfo } from '../../common/config/fontInfo.js';

export function applyFontInfo(domNode: FastDomNode<HTMLElement> | HTMLElement, fontInfo: BareFontInfo): void {
	if (domNode instanceof FastDomNode) {
		domNode.setFontFamily(fontInfo.getMassagedFontFamily());
		domNode.setFontWeight(fontInfo.fontWeight);
		domNode.setFontSize(fontInfo.fontSize);
		domNode.setFontFeatureSettings(fontInfo.fontFeatureSettings);
		domNode.setFontVariationSettings(fontInfo.fontVariationSettings);
		domNode.setLineHeight(fontInfo.lineHeight);
		domNode.setLetterSpacing(fontInfo.letterSpacing);
	} else {
		domNode.style.fontFamily = fontInfo.getMassagedFontFamily();
		domNode.style.fontWeight = fontInfo.fontWeight;
		domNode.style.fontSize = fontInfo.fontSize + 'px';
		domNode.style.fontFeatureSettings = fontInfo.fontFeatureSettings;
		domNode.style.fontVariationSettings = fontInfo.fontVariationSettings;
		domNode.style.lineHeight = fontInfo.lineHeight + 'px';
		domNode.style.letterSpacing = fontInfo.letterSpacing + 'px';
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/config/editorConfiguration.ts]---
Location: vscode-main/src/vs/editor/browser/config/editorConfiguration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as browser from '../../../base/browser/browser.js';
import * as arrays from '../../../base/common/arrays.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import * as objects from '../../../base/common/objects.js';
import * as platform from '../../../base/common/platform.js';
import { ElementSizeObserver } from './elementSizeObserver.js';
import { FontMeasurements } from './fontMeasurements.js';
import { migrateOptions } from './migrateOptions.js';
import { TabFocus } from './tabFocus.js';
import { ComputeOptionsMemory, ConfigurationChangedEvent, EditorOption, editorOptionsRegistry, FindComputedEditorOptionValueById, IComputedEditorOptions, IEditorOptions, IEnvironmentalOptions } from '../../common/config/editorOptions.js';
import { EditorZoom } from '../../common/config/editorZoom.js';
import { BareFontInfo, FontInfo, IValidatedEditorOptions } from '../../common/config/fontInfo.js';
import { createBareFontInfoFromValidatedSettings } from '../../common/config/fontInfoFromSettings.js';
import { IDimension } from '../../common/core/2d/dimension.js';
import { IEditorConfiguration } from '../../common/config/editorConfiguration.js';
import { AccessibilitySupport, IAccessibilityService } from '../../../platform/accessibility/common/accessibility.js';
import { getWindow, getWindowById } from '../../../base/browser/dom.js';
import { PixelRatio } from '../../../base/browser/pixelRatio.js';
import { MenuId } from '../../../platform/actions/common/actions.js';
import { InputMode } from '../../common/inputMode.js';

export interface IEditorConstructionOptions extends IEditorOptions {
	/**
	 * The initial editor dimension (to avoid measuring the container).
	 */
	dimension?: IDimension;
	/**
	 * Place overflow widgets inside an external DOM node.
	 * Defaults to an internal DOM node.
	 */
	overflowWidgetsDomNode?: HTMLElement;
}

export class EditorConfiguration extends Disposable implements IEditorConfiguration {

	private _onDidChange = this._register(new Emitter<ConfigurationChangedEvent>());
	public readonly onDidChange: Event<ConfigurationChangedEvent> = this._onDidChange.event;

	private _onDidChangeFast = this._register(new Emitter<ConfigurationChangedEvent>());
	public readonly onDidChangeFast: Event<ConfigurationChangedEvent> = this._onDidChangeFast.event;

	public readonly isSimpleWidget: boolean;
	public readonly contextMenuId: MenuId;
	private readonly _containerObserver: ElementSizeObserver;

	private _isDominatedByLongLines: boolean = false;
	private _viewLineCount: number = 1;
	private _lineNumbersDigitCount: number = 1;
	private _reservedHeight: number = 0;
	private _glyphMarginDecorationLaneCount: number = 1;
	private _targetWindowId: number;

	private readonly _computeOptionsMemory: ComputeOptionsMemory = new ComputeOptionsMemory();
	/**
	 * Raw options as they were passed in and merged with all calls to `updateOptions`.
	 */
	private readonly _rawOptions: IEditorOptions;
	/**
	 * Validated version of `_rawOptions`.
	 */
	private _validatedOptions: ValidatedEditorOptions;
	/**
	 * Complete options which are a combination of passed in options and env values.
	 */
	public options: ComputedEditorOptions;

	constructor(
		isSimpleWidget: boolean,
		contextMenuId: MenuId,
		options: Readonly<IEditorConstructionOptions>,
		container: HTMLElement | null,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService
	) {
		super();
		this.isSimpleWidget = isSimpleWidget;
		this.contextMenuId = contextMenuId;
		this._containerObserver = this._register(new ElementSizeObserver(container, options.dimension));
		this._targetWindowId = getWindow(container).vscodeWindowId;

		this._rawOptions = deepCloneAndMigrateOptions(options);
		this._validatedOptions = EditorOptionsUtil.validateOptions(this._rawOptions);
		this.options = this._computeOptions();

		if (this.options.get(EditorOption.automaticLayout)) {
			this._containerObserver.startObserving();
		}

		this._register(EditorZoom.onDidChangeZoomLevel(() => this._recomputeOptions()));
		this._register(TabFocus.onDidChangeTabFocus(() => this._recomputeOptions()));
		this._register(this._containerObserver.onDidChange(() => this._recomputeOptions()));
		this._register(FontMeasurements.onDidChange(() => this._recomputeOptions()));
		this._register(PixelRatio.getInstance(getWindow(container)).onDidChange(() => this._recomputeOptions()));
		this._register(this._accessibilityService.onDidChangeScreenReaderOptimized(() => this._recomputeOptions()));
		this._register(InputMode.onDidChangeInputMode(() => this._recomputeOptions()));
	}

	private _recomputeOptions(): void {
		const newOptions = this._computeOptions();
		const changeEvent = EditorOptionsUtil.checkEquals(this.options, newOptions);
		if (changeEvent === null) {
			// nothing changed!
			return;
		}

		this.options = newOptions;
		this._onDidChangeFast.fire(changeEvent);
		this._onDidChange.fire(changeEvent);
	}

	private _computeOptions(): ComputedEditorOptions {
		const partialEnv = this._readEnvConfiguration();
		const bareFontInfo = createBareFontInfoFromValidatedSettings(this._validatedOptions, partialEnv.pixelRatio, this.isSimpleWidget);
		const fontInfo = this._readFontInfo(bareFontInfo);
		const env: IEnvironmentalOptions = {
			memory: this._computeOptionsMemory,
			outerWidth: partialEnv.outerWidth,
			outerHeight: partialEnv.outerHeight - this._reservedHeight,
			fontInfo: fontInfo,
			extraEditorClassName: partialEnv.extraEditorClassName,
			isDominatedByLongLines: this._isDominatedByLongLines,
			viewLineCount: this._viewLineCount,
			lineNumbersDigitCount: this._lineNumbersDigitCount,
			emptySelectionClipboard: partialEnv.emptySelectionClipboard,
			pixelRatio: partialEnv.pixelRatio,
			tabFocusMode: this._validatedOptions.get(EditorOption.tabFocusMode) || TabFocus.getTabFocusMode(),
			inputMode: InputMode.getInputMode(),
			accessibilitySupport: partialEnv.accessibilitySupport,
			glyphMarginDecorationLaneCount: this._glyphMarginDecorationLaneCount,
			editContextSupported: partialEnv.editContextSupported
		};
		return EditorOptionsUtil.computeOptions(this._validatedOptions, env);
	}

	protected _readEnvConfiguration(): IEnvConfiguration {
		return {
			extraEditorClassName: getExtraEditorClassName(),
			outerWidth: this._containerObserver.getWidth(),
			outerHeight: this._containerObserver.getHeight(),
			emptySelectionClipboard: browser.isWebKit || browser.isFirefox,
			pixelRatio: PixelRatio.getInstance(getWindowById(this._targetWindowId, true).window).value,
			// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
			editContextSupported: typeof (globalThis as any).EditContext === 'function',
			accessibilitySupport: (
				this._accessibilityService.isScreenReaderOptimized()
					? AccessibilitySupport.Enabled
					: this._accessibilityService.getAccessibilitySupport()
			)
		};
	}

	protected _readFontInfo(bareFontInfo: BareFontInfo): FontInfo {
		return FontMeasurements.readFontInfo(getWindowById(this._targetWindowId, true).window, bareFontInfo);
	}

	public getRawOptions(): IEditorOptions {
		return this._rawOptions;
	}

	public updateOptions(_newOptions: Readonly<IEditorOptions>): void {
		const newOptions = deepCloneAndMigrateOptions(_newOptions);

		const didChange = EditorOptionsUtil.applyUpdate(this._rawOptions, newOptions);
		if (!didChange) {
			return;
		}

		this._validatedOptions = EditorOptionsUtil.validateOptions(this._rawOptions);
		this._recomputeOptions();
	}

	public observeContainer(dimension?: IDimension): void {
		this._containerObserver.observe(dimension);
	}

	public setIsDominatedByLongLines(isDominatedByLongLines: boolean): void {
		if (this._isDominatedByLongLines === isDominatedByLongLines) {
			return;
		}
		this._isDominatedByLongLines = isDominatedByLongLines;
		this._recomputeOptions();
	}

	public setModelLineCount(modelLineCount: number): void {
		const lineNumbersDigitCount = digitCount(modelLineCount);
		if (this._lineNumbersDigitCount === lineNumbersDigitCount) {
			return;
		}
		this._lineNumbersDigitCount = lineNumbersDigitCount;
		this._recomputeOptions();
	}

	public setViewLineCount(viewLineCount: number): void {
		if (this._viewLineCount === viewLineCount) {
			return;
		}
		this._viewLineCount = viewLineCount;
		this._recomputeOptions();
	}

	public setReservedHeight(reservedHeight: number) {
		if (this._reservedHeight === reservedHeight) {
			return;
		}
		this._reservedHeight = reservedHeight;
		this._recomputeOptions();
	}

	public setGlyphMarginDecorationLaneCount(decorationLaneCount: number): void {
		if (this._glyphMarginDecorationLaneCount === decorationLaneCount) {
			return;
		}
		this._glyphMarginDecorationLaneCount = decorationLaneCount;
		this._recomputeOptions();
	}
}

function digitCount(n: number): number {
	let r = 0;
	while (n) {
		n = Math.floor(n / 10);
		r++;
	}
	return r ? r : 1;
}

function getExtraEditorClassName(): string {
	let extra = '';
	if (browser.isSafari || browser.isWebkitWebView) {
		// See https://github.com/microsoft/vscode/issues/108822
		extra += 'no-minimap-shadow ';
		extra += 'enable-user-select ';
	} else {
		// Use user-select: none in all browsers except Safari and native macOS WebView
		extra += 'no-user-select ';
	}
	if (platform.isMacintosh) {
		extra += 'mac ';
	}
	return extra;
}

export interface IEnvConfiguration {
	extraEditorClassName: string;
	outerWidth: number;
	outerHeight: number;
	emptySelectionClipboard: boolean;
	pixelRatio: number;
	accessibilitySupport: AccessibilitySupport;
	editContextSupported: boolean;
}

class ValidatedEditorOptions implements IValidatedEditorOptions {
	private readonly _values: unknown[] = [];
	public _read<T>(option: EditorOption): T {
		return this._values[option] as T;
	}
	public get<T extends EditorOption>(id: T): FindComputedEditorOptionValueById<T> {
		return this._values[id] as FindComputedEditorOptionValueById<T>;
	}
	public _write<T>(option: EditorOption, value: T): void {
		this._values[option] = value;
	}
}

export class ComputedEditorOptions implements IComputedEditorOptions {
	private readonly _values: unknown[] = [];
	public _read<T>(id: EditorOption): T {
		if (id >= this._values.length) {
			throw new Error('Cannot read uninitialized value');
		}
		return this._values[id] as T;
	}
	public get<T extends EditorOption>(id: T): FindComputedEditorOptionValueById<T> {
		return this._read(id);
	}
	public _write<T>(id: EditorOption, value: T): void {
		this._values[id] = value;
	}
}

class EditorOptionsUtil {

	public static validateOptions(options: IEditorOptions): ValidatedEditorOptions {
		const result = new ValidatedEditorOptions();
		for (const editorOption of editorOptionsRegistry) {
			const value = (editorOption.name === '_never_' ? undefined : (options as Record<string, unknown>)[editorOption.name]);
			result._write(editorOption.id, editorOption.validate(value));
		}
		return result;
	}

	public static computeOptions(options: ValidatedEditorOptions, env: IEnvironmentalOptions): ComputedEditorOptions {
		const result = new ComputedEditorOptions();
		for (const editorOption of editorOptionsRegistry) {
			result._write(editorOption.id, editorOption.compute(env, result, options._read(editorOption.id)));
		}
		return result;
	}

	private static _deepEquals<T>(a: T, b: T): boolean {
		if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) {
			return a === b;
		}
		if (Array.isArray(a) || Array.isArray(b)) {
			return (Array.isArray(a) && Array.isArray(b) ? arrays.equals(a, b) : false);
		}
		if (Object.keys(a as unknown as object).length !== Object.keys(b as unknown as object).length) {
			return false;
		}
		for (const key in a) {
			if (!EditorOptionsUtil._deepEquals(a[key], b[key])) {
				return false;
			}
		}
		return true;
	}

	public static checkEquals(a: ComputedEditorOptions, b: ComputedEditorOptions): ConfigurationChangedEvent | null {
		const result: boolean[] = [];
		let somethingChanged = false;
		for (const editorOption of editorOptionsRegistry) {
			const changed = !EditorOptionsUtil._deepEquals(a._read(editorOption.id), b._read(editorOption.id));
			result[editorOption.id] = changed;
			if (changed) {
				somethingChanged = true;
			}
		}
		return (somethingChanged ? new ConfigurationChangedEvent(result) : null);
	}

	/**
	 * Returns true if something changed.
	 * Modifies `options`.
	*/
	public static applyUpdate(options: IEditorOptions, update: Readonly<IEditorOptions>): boolean {
		let changed = false;
		for (const editorOption of editorOptionsRegistry) {
			if (update.hasOwnProperty(editorOption.name)) {
				const result = editorOption.applyUpdate((options as Record<string, unknown>)[editorOption.name], (update as Record<string, unknown>)[editorOption.name]);
				(options as Record<string, unknown>)[editorOption.name] = result.newValue;
				changed = changed || result.didChange;
			}
		}
		return changed;
	}
}

function deepCloneAndMigrateOptions(_options: Readonly<IEditorOptions>): IEditorOptions {
	const options = objects.deepClone(_options);
	migrateOptions(options);
	return options;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/config/elementSizeObserver.ts]---
Location: vscode-main/src/vs/editor/browser/config/elementSizeObserver.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../base/common/lifecycle.js';
import { IDimension } from '../../common/core/2d/dimension.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { getWindow, scheduleAtNextAnimationFrame } from '../../../base/browser/dom.js';

export class ElementSizeObserver extends Disposable {

	private _onDidChange = this._register(new Emitter<void>());
	public readonly onDidChange: Event<void> = this._onDidChange.event;

	private readonly _referenceDomElement: HTMLElement | null;
	private _width: number;
	private _height: number;
	private _resizeObserver: ResizeObserver | null;

	constructor(referenceDomElement: HTMLElement | null, dimension: IDimension | undefined) {
		super();
		this._referenceDomElement = referenceDomElement;
		this._width = -1;
		this._height = -1;
		this._resizeObserver = null;
		this.measureReferenceDomElement(false, dimension);
	}

	public override dispose(): void {
		this.stopObserving();
		super.dispose();
	}

	public getWidth(): number {
		return this._width;
	}

	public getHeight(): number {
		return this._height;
	}

	public startObserving(): void {
		if (!this._resizeObserver && this._referenceDomElement) {
			// We want to react to the resize observer only once per animation frame
			// The first time the resize observer fires, we will react to it immediately.
			// Otherwise we will postpone to the next animation frame.
			// We'll use `observeContentRect` to store the content rect we received.

			let observedDimension: IDimension | null = null;
			const observeNow = () => {
				if (observedDimension) {
					this.observe({ width: observedDimension.width, height: observedDimension.height });
				} else {
					this.observe();
				}
			};

			let shouldObserve = false;
			let alreadyObservedThisAnimationFrame = false;

			const update = () => {
				if (shouldObserve && !alreadyObservedThisAnimationFrame) {
					try {
						shouldObserve = false;
						alreadyObservedThisAnimationFrame = true;
						observeNow();
					} finally {
						scheduleAtNextAnimationFrame(getWindow(this._referenceDomElement), () => {
							alreadyObservedThisAnimationFrame = false;
							update();
						});
					}
				}
			};

			this._resizeObserver = new ResizeObserver((entries) => {
				if (entries && entries[0] && entries[0].contentRect) {
					observedDimension = { width: entries[0].contentRect.width, height: entries[0].contentRect.height };
				} else {
					observedDimension = null;
				}
				shouldObserve = true;
				update();
			});
			this._resizeObserver.observe(this._referenceDomElement);
		}
	}

	public stopObserving(): void {
		if (this._resizeObserver) {
			this._resizeObserver.disconnect();
			this._resizeObserver = null;
		}
	}

	public observe(dimension?: IDimension): void {
		this.measureReferenceDomElement(true, dimension);
	}

	private measureReferenceDomElement(emitEvent: boolean, dimension?: IDimension): void {
		let observedWidth = 0;
		let observedHeight = 0;
		if (dimension) {
			observedWidth = dimension.width;
			observedHeight = dimension.height;
		} else if (this._referenceDomElement) {
			observedWidth = this._referenceDomElement.clientWidth;
			observedHeight = this._referenceDomElement.clientHeight;
		}
		observedWidth = Math.max(5, observedWidth);
		observedHeight = Math.max(5, observedHeight);
		if (this._width !== observedWidth || this._height !== observedHeight) {
			this._width = observedWidth;
			this._height = observedHeight;
			if (emitEvent) {
				this._onDidChange.fire();
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/config/fontMeasurements.ts]---
Location: vscode-main/src/vs/editor/browser/config/fontMeasurements.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getWindowId } from '../../../base/browser/dom.js';
import { PixelRatio } from '../../../base/browser/pixelRatio.js';
import { Emitter } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { CharWidthRequest, CharWidthRequestType, readCharWidths } from './charWidthReader.js';
import { EditorFontLigatures } from '../../common/config/editorOptions.js';
import { BareFontInfo, FontInfo, SERIALIZED_FONT_INFO_VERSION } from '../../common/config/fontInfo.js';

/**
 * Serializable font information.
 */
export interface ISerializedFontInfo {
	readonly version: number;
	readonly pixelRatio: number;
	readonly fontFamily: string;
	readonly fontWeight: string;
	readonly fontSize: number;
	readonly fontFeatureSettings: string;
	readonly fontVariationSettings: string;
	readonly lineHeight: number;
	readonly letterSpacing: number;
	readonly isMonospace: boolean;
	readonly typicalHalfwidthCharacterWidth: number;
	readonly typicalFullwidthCharacterWidth: number;
	readonly canUseHalfwidthRightwardsArrow: boolean;
	readonly spaceWidth: number;
	readonly middotWidth: number;
	readonly wsmiddotWidth: number;
	readonly maxDigitWidth: number;
}

export class FontMeasurementsImpl extends Disposable {

	private readonly _cache = new Map<number, FontMeasurementsCache>();

	private _evictUntrustedReadingsTimeout = -1;

	private readonly _onDidChange = this._register(new Emitter<void>());
	public readonly onDidChange = this._onDidChange.event;

	public override dispose(): void {
		if (this._evictUntrustedReadingsTimeout !== -1) {
			clearTimeout(this._evictUntrustedReadingsTimeout);
			this._evictUntrustedReadingsTimeout = -1;
		}
		super.dispose();
	}

	/**
	 * Clear all cached font information and trigger a change event.
	 */
	public clearAllFontInfos(): void {
		this._cache.clear();
		this._onDidChange.fire();
	}

	private _ensureCache(targetWindow: Window): FontMeasurementsCache {
		const windowId = getWindowId(targetWindow);
		let cache = this._cache.get(windowId);
		if (!cache) {
			cache = new FontMeasurementsCache();
			this._cache.set(windowId, cache);
		}
		return cache;
	}

	private _writeToCache(targetWindow: Window, item: BareFontInfo, value: FontInfo): void {
		const cache = this._ensureCache(targetWindow);
		cache.put(item, value);

		if (!value.isTrusted && this._evictUntrustedReadingsTimeout === -1) {
			// Try reading again after some time
			this._evictUntrustedReadingsTimeout = targetWindow.setTimeout(() => {
				this._evictUntrustedReadingsTimeout = -1;
				this._evictUntrustedReadings(targetWindow);
			}, 5000);
		}
	}

	private _evictUntrustedReadings(targetWindow: Window): void {
		const cache = this._ensureCache(targetWindow);
		const values = cache.getValues();
		let somethingRemoved = false;
		for (const item of values) {
			if (!item.isTrusted) {
				somethingRemoved = true;
				cache.remove(item);
			}
		}
		if (somethingRemoved) {
			this._onDidChange.fire();
		}
	}

	/**
	 * Serialized currently cached font information.
	 */
	public serializeFontInfo(targetWindow: Window): ISerializedFontInfo[] {
		// Only save trusted font info (that has been measured in this running instance)
		const cache = this._ensureCache(targetWindow);
		return cache.getValues().filter(item => item.isTrusted);
	}

	/**
	 * Restore previously serialized font informations.
	 */
	public restoreFontInfo(targetWindow: Window, savedFontInfos: ISerializedFontInfo[]): void {
		// Take all the saved font info and insert them in the cache without the trusted flag.
		// The reason for this is that a font might have been installed on the OS in the meantime.
		for (const savedFontInfo of savedFontInfos) {
			if (savedFontInfo.version !== SERIALIZED_FONT_INFO_VERSION) {
				// cannot use older version
				continue;
			}
			const fontInfo = new FontInfo(savedFontInfo, false);
			this._writeToCache(targetWindow, fontInfo, fontInfo);
		}
	}

	/**
	 * Read font information.
	 */
	public readFontInfo(targetWindow: Window, bareFontInfo: BareFontInfo): FontInfo {
		const cache = this._ensureCache(targetWindow);
		if (!cache.has(bareFontInfo)) {
			let readConfig = this._actualReadFontInfo(targetWindow, bareFontInfo);

			if (readConfig.typicalHalfwidthCharacterWidth <= 2 || readConfig.typicalFullwidthCharacterWidth <= 2 || readConfig.spaceWidth <= 2 || readConfig.maxDigitWidth <= 2) {
				// Hey, it's Bug 14341 ... we couldn't read
				readConfig = new FontInfo({
					pixelRatio: PixelRatio.getInstance(targetWindow).value,
					fontFamily: readConfig.fontFamily,
					fontWeight: readConfig.fontWeight,
					fontSize: readConfig.fontSize,
					fontFeatureSettings: readConfig.fontFeatureSettings,
					fontVariationSettings: readConfig.fontVariationSettings,
					lineHeight: readConfig.lineHeight,
					letterSpacing: readConfig.letterSpacing,
					isMonospace: readConfig.isMonospace,
					typicalHalfwidthCharacterWidth: Math.max(readConfig.typicalHalfwidthCharacterWidth, 5),
					typicalFullwidthCharacterWidth: Math.max(readConfig.typicalFullwidthCharacterWidth, 5),
					canUseHalfwidthRightwardsArrow: readConfig.canUseHalfwidthRightwardsArrow,
					spaceWidth: Math.max(readConfig.spaceWidth, 5),
					middotWidth: Math.max(readConfig.middotWidth, 5),
					wsmiddotWidth: Math.max(readConfig.wsmiddotWidth, 5),
					maxDigitWidth: Math.max(readConfig.maxDigitWidth, 5),
				}, false);
			}

			this._writeToCache(targetWindow, bareFontInfo, readConfig);
		}
		return cache.get(bareFontInfo);
	}

	private _createRequest(chr: string, type: CharWidthRequestType, all: CharWidthRequest[], monospace: CharWidthRequest[] | null): CharWidthRequest {
		const result = new CharWidthRequest(chr, type);
		all.push(result);
		monospace?.push(result);
		return result;
	}

	private _actualReadFontInfo(targetWindow: Window, bareFontInfo: BareFontInfo): FontInfo {
		const all: CharWidthRequest[] = [];
		const monospace: CharWidthRequest[] = [];

		const typicalHalfwidthCharacter = this._createRequest('n', CharWidthRequestType.Regular, all, monospace);
		const typicalFullwidthCharacter = this._createRequest('\uff4d', CharWidthRequestType.Regular, all, null);
		const space = this._createRequest(' ', CharWidthRequestType.Regular, all, monospace);
		const digit0 = this._createRequest('0', CharWidthRequestType.Regular, all, monospace);
		const digit1 = this._createRequest('1', CharWidthRequestType.Regular, all, monospace);
		const digit2 = this._createRequest('2', CharWidthRequestType.Regular, all, monospace);
		const digit3 = this._createRequest('3', CharWidthRequestType.Regular, all, monospace);
		const digit4 = this._createRequest('4', CharWidthRequestType.Regular, all, monospace);
		const digit5 = this._createRequest('5', CharWidthRequestType.Regular, all, monospace);
		const digit6 = this._createRequest('6', CharWidthRequestType.Regular, all, monospace);
		const digit7 = this._createRequest('7', CharWidthRequestType.Regular, all, monospace);
		const digit8 = this._createRequest('8', CharWidthRequestType.Regular, all, monospace);
		const digit9 = this._createRequest('9', CharWidthRequestType.Regular, all, monospace);

		// monospace test: used for whitespace rendering
		const rightwardsArrow = this._createRequest('→', CharWidthRequestType.Regular, all, monospace);
		const halfwidthRightwardsArrow = this._createRequest('￫', CharWidthRequestType.Regular, all, null);

		// U+00B7 - MIDDLE DOT
		const middot = this._createRequest('·', CharWidthRequestType.Regular, all, monospace);

		// U+2E31 - WORD SEPARATOR MIDDLE DOT
		const wsmiddotWidth = this._createRequest(String.fromCharCode(0x2E31), CharWidthRequestType.Regular, all, null);

		// monospace test: some characters
		const monospaceTestChars = '|/-_ilm%';
		for (let i = 0, len = monospaceTestChars.length; i < len; i++) {
			this._createRequest(monospaceTestChars.charAt(i), CharWidthRequestType.Regular, all, monospace);
			this._createRequest(monospaceTestChars.charAt(i), CharWidthRequestType.Italic, all, monospace);
			this._createRequest(monospaceTestChars.charAt(i), CharWidthRequestType.Bold, all, monospace);
		}

		readCharWidths(targetWindow, bareFontInfo, all);

		const maxDigitWidth = Math.max(digit0.width, digit1.width, digit2.width, digit3.width, digit4.width, digit5.width, digit6.width, digit7.width, digit8.width, digit9.width);

		let isMonospace = (bareFontInfo.fontFeatureSettings === EditorFontLigatures.OFF);
		const referenceWidth = monospace[0].width;
		for (let i = 1, len = monospace.length; isMonospace && i < len; i++) {
			const diff = referenceWidth - monospace[i].width;
			if (diff < -0.001 || diff > 0.001) {
				isMonospace = false;
				break;
			}
		}

		let canUseHalfwidthRightwardsArrow = true;
		if (isMonospace && halfwidthRightwardsArrow.width !== referenceWidth) {
			// using a halfwidth rightwards arrow would break monospace...
			canUseHalfwidthRightwardsArrow = false;
		}
		if (halfwidthRightwardsArrow.width > rightwardsArrow.width) {
			// using a halfwidth rightwards arrow would paint a larger arrow than a regular rightwards arrow
			canUseHalfwidthRightwardsArrow = false;
		}

		return new FontInfo({
			pixelRatio: PixelRatio.getInstance(targetWindow).value,
			fontFamily: bareFontInfo.fontFamily,
			fontWeight: bareFontInfo.fontWeight,
			fontSize: bareFontInfo.fontSize,
			fontFeatureSettings: bareFontInfo.fontFeatureSettings,
			fontVariationSettings: bareFontInfo.fontVariationSettings,
			lineHeight: bareFontInfo.lineHeight,
			letterSpacing: bareFontInfo.letterSpacing,
			isMonospace: isMonospace,
			typicalHalfwidthCharacterWidth: typicalHalfwidthCharacter.width,
			typicalFullwidthCharacterWidth: typicalFullwidthCharacter.width,
			canUseHalfwidthRightwardsArrow: canUseHalfwidthRightwardsArrow,
			spaceWidth: space.width,
			middotWidth: middot.width,
			wsmiddotWidth: wsmiddotWidth.width,
			maxDigitWidth: maxDigitWidth
		}, true);
	}
}

class FontMeasurementsCache {

	private readonly _keys: { [key: string]: BareFontInfo };
	private readonly _values: { [key: string]: FontInfo };

	constructor() {
		this._keys = Object.create(null);
		this._values = Object.create(null);
	}

	public has(item: BareFontInfo): boolean {
		const itemId = item.getId();
		return !!this._values[itemId];
	}

	public get(item: BareFontInfo): FontInfo {
		const itemId = item.getId();
		return this._values[itemId];
	}

	public put(item: BareFontInfo, value: FontInfo): void {
		const itemId = item.getId();
		this._keys[itemId] = item;
		this._values[itemId] = value;
	}

	public remove(item: FontInfo): void {
		const itemId = item.getId();
		delete this._keys[itemId];
		delete this._values[itemId];
	}

	public getValues(): FontInfo[] {
		return Object.keys(this._keys).map(id => this._values[id]);
	}
}

export const FontMeasurements = new FontMeasurementsImpl();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/config/migrateOptions.ts]---
Location: vscode-main/src/vs/editor/browser/config/migrateOptions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IEditorOptions } from '../../common/config/editorOptions.js';

export interface ISettingsReader {
	(key: string): unknown;
}

export interface ISettingsWriter {
	(key: string, value: unknown): void;
}

export class EditorSettingMigration {

	public static items: EditorSettingMigration[] = [];

	constructor(
		public readonly key: string,
		public readonly migrate: (value: unknown, read: ISettingsReader, write: ISettingsWriter) => void
	) { }

	apply(options: unknown): void {
		const value = EditorSettingMigration._read(options, this.key);
		const read = (key: string) => EditorSettingMigration._read(options, key);
		const write = (key: string, value: unknown) => EditorSettingMigration._write(options, key, value);
		this.migrate(value, read, write);
	}

	private static _read(source: unknown, key: string): unknown {
		if (typeof source === 'undefined' || source === null) {
			return undefined;
		}

		const firstDotIndex = key.indexOf('.');
		if (firstDotIndex >= 0) {
			const firstSegment = key.substring(0, firstDotIndex);
			return this._read((source as Record<string, unknown>)[firstSegment], key.substring(firstDotIndex + 1));
		}
		return (source as Record<string, unknown>)[key];
	}

	private static _write(target: unknown, key: string, value: unknown): void {
		const firstDotIndex = key.indexOf('.');
		if (firstDotIndex >= 0) {
			const firstSegment = key.substring(0, firstDotIndex);
			(target as Record<string, unknown>)[firstSegment] = (target as Record<string, unknown>)[firstSegment] || {};
			this._write((target as Record<string, unknown>)[firstSegment], key.substring(firstDotIndex + 1), value);
			return;
		}
		(target as Record<string, unknown>)[key] = value;
	}
}

function registerEditorSettingMigration(key: string, migrate: (value: unknown, read: ISettingsReader, write: ISettingsWriter) => void): void {
	EditorSettingMigration.items.push(new EditorSettingMigration(key, migrate));
}

function registerSimpleEditorSettingMigration(key: string, values: [unknown, unknown][]): void {
	registerEditorSettingMigration(key, (value, read, write) => {
		if (typeof value !== 'undefined') {
			for (const [oldValue, newValue] of values) {
				if (value === oldValue) {
					write(key, newValue);
					return;
				}
			}
		}
	});
}

/**
 * Compatibility with old options
 */
export function migrateOptions(options: IEditorOptions): void {
	EditorSettingMigration.items.forEach(migration => migration.apply(options));
}

registerSimpleEditorSettingMigration('wordWrap', [[true, 'on'], [false, 'off']]);
registerSimpleEditorSettingMigration('lineNumbers', [[true, 'on'], [false, 'off']]);
registerSimpleEditorSettingMigration('cursorBlinking', [['visible', 'solid']]);
registerSimpleEditorSettingMigration('renderWhitespace', [[true, 'boundary'], [false, 'none']]);
registerSimpleEditorSettingMigration('renderLineHighlight', [[true, 'line'], [false, 'none']]);
registerSimpleEditorSettingMigration('acceptSuggestionOnEnter', [[true, 'on'], [false, 'off']]);
registerSimpleEditorSettingMigration('tabCompletion', [[false, 'off'], [true, 'onlySnippets']]);
registerSimpleEditorSettingMigration('hover', [[true, { enabled: true }], [false, { enabled: false }]]);
registerSimpleEditorSettingMigration('parameterHints', [[true, { enabled: true }], [false, { enabled: false }]]);
registerSimpleEditorSettingMigration('autoIndent', [[false, 'advanced'], [true, 'full']]);
registerSimpleEditorSettingMigration('matchBrackets', [[true, 'always'], [false, 'never']]);
registerSimpleEditorSettingMigration('renderFinalNewline', [[true, 'on'], [false, 'off']]);
registerSimpleEditorSettingMigration('cursorSmoothCaretAnimation', [[true, 'on'], [false, 'off']]);
registerSimpleEditorSettingMigration('occurrencesHighlight', [[true, 'singleFile'], [false, 'off']]);
registerSimpleEditorSettingMigration('wordBasedSuggestions', [[true, 'matchingDocuments'], [false, 'off']]);
registerSimpleEditorSettingMigration('defaultColorDecorators', [[true, 'auto'], [false, 'never']]);
registerSimpleEditorSettingMigration('minimap.autohide', [[true, 'mouseover'], [false, 'none']]);

registerEditorSettingMigration('autoClosingBrackets', (value, read, write) => {
	if (value === false) {
		write('autoClosingBrackets', 'never');
		if (typeof read('autoClosingQuotes') === 'undefined') {
			write('autoClosingQuotes', 'never');
		}
		if (typeof read('autoSurround') === 'undefined') {
			write('autoSurround', 'never');
		}
	}
});

registerEditorSettingMigration('renderIndentGuides', (value, read, write) => {
	if (typeof value !== 'undefined') {
		write('renderIndentGuides', undefined);
		if (typeof read('guides.indentation') === 'undefined') {
			write('guides.indentation', !!value);
		}
	}
});

registerEditorSettingMigration('highlightActiveIndentGuide', (value, read, write) => {
	if (typeof value !== 'undefined') {
		write('highlightActiveIndentGuide', undefined);
		if (typeof read('guides.highlightActiveIndentation') === 'undefined') {
			write('guides.highlightActiveIndentation', !!value);
		}
	}
});

const suggestFilteredTypesMapping: Record<string, string> = {
	method: 'showMethods',
	function: 'showFunctions',
	constructor: 'showConstructors',
	deprecated: 'showDeprecated',
	field: 'showFields',
	variable: 'showVariables',
	class: 'showClasses',
	struct: 'showStructs',
	interface: 'showInterfaces',
	module: 'showModules',
	property: 'showProperties',
	event: 'showEvents',
	operator: 'showOperators',
	unit: 'showUnits',
	value: 'showValues',
	constant: 'showConstants',
	enum: 'showEnums',
	enumMember: 'showEnumMembers',
	keyword: 'showKeywords',
	text: 'showWords',
	color: 'showColors',
	file: 'showFiles',
	reference: 'showReferences',
	folder: 'showFolders',
	typeParameter: 'showTypeParameters',
	snippet: 'showSnippets',
};

registerEditorSettingMigration('suggest.filteredTypes', (value, read, write) => {
	if (value && typeof value === 'object') {
		for (const entry of Object.entries(suggestFilteredTypesMapping)) {
			const v = (value as Record<string, unknown>)[entry[0]];
			if (v === false) {
				if (typeof read(`suggest.${entry[1]}`) === 'undefined') {
					write(`suggest.${entry[1]}`, false);
				}
			}
		}
		write('suggest.filteredTypes', undefined);
	}
});

registerEditorSettingMigration('quickSuggestions', (input, read, write) => {
	if (typeof input === 'boolean') {
		const value = input ? 'on' : 'off';
		const newValue = { comments: value, strings: value, other: value };
		write('quickSuggestions', newValue);
	}
});

// Sticky Scroll

registerEditorSettingMigration('experimental.stickyScroll.enabled', (value, read, write) => {
	if (typeof value === 'boolean') {
		write('experimental.stickyScroll.enabled', undefined);
		if (typeof read('stickyScroll.enabled') === 'undefined') {
			write('stickyScroll.enabled', value);
		}
	}
});

registerEditorSettingMigration('experimental.stickyScroll.maxLineCount', (value, read, write) => {
	if (typeof value === 'number') {
		write('experimental.stickyScroll.maxLineCount', undefined);
		if (typeof read('stickyScroll.maxLineCount') === 'undefined') {
			write('stickyScroll.maxLineCount', value);
		}
	}
});

// Edit Context

registerEditorSettingMigration('editor.experimentalEditContextEnabled', (value, read, write) => {
	if (typeof value === 'boolean') {
		write('editor.experimentalEditContextEnabled', undefined);
		if (typeof read('editor.editContext') === 'undefined') {
			write('editor.editContext', value);
		}
	}
});

// Code Actions on Save
registerEditorSettingMigration('codeActionsOnSave', (value, read, write) => {
	if (value && typeof value === 'object') {
		let toBeModified = false;
		const newValue: Record<string, unknown> = {};
		for (const entry of Object.entries(value)) {
			if (typeof entry[1] === 'boolean') {
				toBeModified = true;
				newValue[entry[0]] = entry[1] ? 'explicit' : 'never';
			} else {
				newValue[entry[0]] = entry[1];
			}
		}
		if (toBeModified) {
			write(`codeActionsOnSave`, newValue);
		}
	}
});

// Migrate Quick Fix Settings
registerEditorSettingMigration('codeActionWidget.includeNearbyQuickfixes', (value, read, write) => {
	if (typeof value === 'boolean') {
		write('codeActionWidget.includeNearbyQuickfixes', undefined);
		if (typeof read('codeActionWidget.includeNearbyQuickFixes') === 'undefined') {
			write('codeActionWidget.includeNearbyQuickFixes', value);
		}
	}
});

// Migrate the lightbulb settings
registerEditorSettingMigration('lightbulb.enabled', (value, read, write) => {
	if (typeof value === 'boolean') {
		write('lightbulb.enabled', value ? undefined : 'off');
	}
});

// NES Code Shifting
registerEditorSettingMigration('inlineSuggest.edits.codeShifting', (value, read, write) => {
	if (typeof value === 'boolean') {
		write('inlineSuggest.edits.codeShifting', undefined);
		write('inlineSuggest.edits.allowCodeShifting', value ? 'always' : 'never');
	}
});

// Migrate Hover
registerEditorSettingMigration('hover.enabled', (value, read, write) => {
	if (typeof value === 'boolean') {
		write('hover.enabled', value ? 'on' : 'off');
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/config/tabFocus.ts]---
Location: vscode-main/src/vs/editor/browser/config/tabFocus.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';

class TabFocusImpl extends Disposable {
	private _tabFocus: boolean = false;
	private readonly _onDidChangeTabFocus = this._register(new Emitter<boolean>());
	public readonly onDidChangeTabFocus: Event<boolean> = this._onDidChangeTabFocus.event;

	public getTabFocusMode(): boolean {
		return this._tabFocus;
	}

	public setTabFocusMode(tabFocusMode: boolean): void {
		this._tabFocus = tabFocusMode;
		this._onDidChangeTabFocus.fire(this._tabFocus);
	}
}

/**
 * Control what pressing Tab does.
 * If it is false, pressing Tab or Shift-Tab will be handled by the editor.
 * If it is true, pressing Tab or Shift-Tab will move the browser focus.
 * Defaults to false.
 */
export const TabFocus = new TabFocusImpl();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/controller/dragScrolling.ts]---
Location: vscode-main/src/vs/editor/browser/controller/dragScrolling.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../base/browser/dom.js';
import { Disposable, IDisposable } from '../../../base/common/lifecycle.js';
import { EditorOption } from '../../common/config/editorOptions.js';
import { Position } from '../../common/core/position.js';
import { ViewContext } from '../../common/viewModel/viewContext.js';
import { NavigationCommandRevealType } from '../coreCommands.js';
import { IMouseTarget, IMouseTargetOutsideEditor } from '../editorBrowser.js';
import { createCoordinatesRelativeToEditor, createEditorPagePosition, EditorMouseEvent, PageCoordinates } from '../editorDom.js';
import { IPointerHandlerHelper } from './mouseHandler.js';
import { MouseTarget, MouseTargetFactory } from './mouseTarget.js';

export abstract class DragScrolling extends Disposable {

	private _operation: DragScrollingOperation | null;

	constructor(
		protected readonly _context: ViewContext,
		protected readonly _viewHelper: IPointerHandlerHelper,
		protected readonly _mouseTargetFactory: MouseTargetFactory,
		protected readonly _dispatchMouse: (position: IMouseTarget, inSelectionMode: boolean, revealType: NavigationCommandRevealType) => void
	) {
		super();
		this._operation = null;
	}

	public override dispose(): void {
		super.dispose();
		this.stop();
	}

	public start(position: IMouseTargetOutsideEditor, mouseEvent: EditorMouseEvent): void {
		if (this._operation) {
			this._operation.setPosition(position, mouseEvent);
		} else {
			this._operation = this._createDragScrollingOperation(position, mouseEvent);
		}
	}

	public stop(): void {
		if (this._operation) {
			this._operation.dispose();
			this._operation = null;
		}
	}

	protected abstract _createDragScrollingOperation(position: IMouseTargetOutsideEditor, mouseEvent: EditorMouseEvent): DragScrollingOperation;
}

export abstract class DragScrollingOperation extends Disposable {

	protected _position: IMouseTargetOutsideEditor;
	protected _mouseEvent: EditorMouseEvent;
	private _lastTime: number;
	protected _animationFrameDisposable: IDisposable;

	constructor(
		protected readonly _context: ViewContext,
		protected readonly _viewHelper: IPointerHandlerHelper,
		protected readonly _mouseTargetFactory: MouseTargetFactory,
		protected readonly _dispatchMouse: (position: IMouseTarget, inSelectionMode: boolean, revealType: NavigationCommandRevealType) => void,
		position: IMouseTargetOutsideEditor,
		mouseEvent: EditorMouseEvent
	) {
		super();
		this._position = position;
		this._mouseEvent = mouseEvent;
		this._lastTime = Date.now();
		this._animationFrameDisposable = dom.scheduleAtNextAnimationFrame(dom.getWindow(mouseEvent.browserEvent), () => this._execute());
	}

	public override dispose(): void {
		this._animationFrameDisposable.dispose();
		super.dispose();
	}

	public setPosition(position: IMouseTargetOutsideEditor, mouseEvent: EditorMouseEvent): void {
		this._position = position;
		this._mouseEvent = mouseEvent;
	}

	/**
	 * update internal state and return elapsed ms since last time
	 */
	protected _tick(): number {
		const now = Date.now();
		const elapsed = now - this._lastTime;
		this._lastTime = now;
		return elapsed;
	}

	protected abstract _execute(): void;

}

export class TopBottomDragScrolling extends DragScrolling {
	protected _createDragScrollingOperation(position: IMouseTargetOutsideEditor, mouseEvent: EditorMouseEvent): DragScrollingOperation {
		return new TopBottomDragScrollingOperation(this._context, this._viewHelper, this._mouseTargetFactory, this._dispatchMouse, position, mouseEvent);
	}
}

export class TopBottomDragScrollingOperation extends DragScrollingOperation {

	/**
	 * get the number of lines per second to auto-scroll
	 */
	private _getScrollSpeed(): number {
		const lineHeight = this._context.configuration.options.get(EditorOption.lineHeight);
		const viewportInLines = this._context.configuration.options.get(EditorOption.layoutInfo).height / lineHeight;
		const outsideDistanceInLines = this._position.outsideDistance / lineHeight;

		if (outsideDistanceInLines <= 1.5) {
			return Math.max(30, viewportInLines * (1 + outsideDistanceInLines));
		}
		if (outsideDistanceInLines <= 3) {
			return Math.max(60, viewportInLines * (2 + outsideDistanceInLines));
		}
		return Math.max(200, viewportInLines * (7 + outsideDistanceInLines));
	}

	protected _execute(): void {
		const lineHeight = this._context.configuration.options.get(EditorOption.lineHeight);
		const scrollSpeedInLines = this._getScrollSpeed();
		const elapsed = this._tick();
		const scrollInPixels = scrollSpeedInLines * (elapsed / 1000) * lineHeight;
		const scrollValue = (this._position.outsidePosition === 'above' ? -scrollInPixels : scrollInPixels);

		this._context.viewModel.viewLayout.deltaScrollNow(0, scrollValue);
		this._viewHelper.renderNow();

		const viewportData = this._context.viewLayout.getLinesViewportData();
		const edgeLineNumber = (this._position.outsidePosition === 'above' ? viewportData.startLineNumber : viewportData.endLineNumber);
		const cannotScrollAnymore = (this._position.outsidePosition === 'above' ? viewportData.startLineNumber === 1 : viewportData.endLineNumber === this._context.viewModel.getLineCount());

		// First, try to find a position that matches the horizontal position of the mouse
		let mouseTarget: IMouseTarget;
		{
			const editorPos = createEditorPagePosition(this._viewHelper.viewDomNode);
			const horizontalScrollbarHeight = this._context.configuration.options.get(EditorOption.layoutInfo).horizontalScrollbarHeight;
			const pos = new PageCoordinates(this._mouseEvent.pos.x, editorPos.y + editorPos.height - horizontalScrollbarHeight - 0.1);
			const relativePos = createCoordinatesRelativeToEditor(this._viewHelper.viewDomNode, editorPos, pos);
			mouseTarget = this._mouseTargetFactory.createMouseTarget(this._viewHelper.getLastRenderData(), editorPos, pos, relativePos, null);
		}
		if (!mouseTarget.position || mouseTarget.position.lineNumber !== edgeLineNumber || cannotScrollAnymore) {
			if (this._position.outsidePosition === 'above') {
				mouseTarget = MouseTarget.createOutsideEditor(this._position.mouseColumn, new Position(edgeLineNumber, 1), 'above', this._position.outsideDistance);
			} else {
				mouseTarget = MouseTarget.createOutsideEditor(this._position.mouseColumn, new Position(edgeLineNumber, this._context.viewModel.getLineMaxColumn(edgeLineNumber)), 'below', this._position.outsideDistance);
			}
		}

		this._dispatchMouse(mouseTarget, true, NavigationCommandRevealType.None);
		this._animationFrameDisposable = dom.scheduleAtNextAnimationFrame(dom.getWindow(mouseTarget.element), () => this._execute());
	}
}

export class LeftRightDragScrolling extends DragScrolling {
	protected _createDragScrollingOperation(position: IMouseTargetOutsideEditor, mouseEvent: EditorMouseEvent): DragScrollingOperation {
		return new LeftRightDragScrollingOperation(this._context, this._viewHelper, this._mouseTargetFactory, this._dispatchMouse, position, mouseEvent);
	}
}

export class LeftRightDragScrollingOperation extends DragScrollingOperation {

	/**
	 * get the number of cols per second to auto-scroll
	 */
	private _getScrollSpeed(): number {
		const charWidth = this._context.configuration.options.get(EditorOption.fontInfo).typicalFullwidthCharacterWidth;
		const viewportInChars = this._context.configuration.options.get(EditorOption.layoutInfo).contentWidth / charWidth;
		const outsideDistanceInChars = this._position.outsideDistance / charWidth;
		if (outsideDistanceInChars <= 1.5) {
			return Math.max(30, viewportInChars * (1 + outsideDistanceInChars));
		}
		if (outsideDistanceInChars <= 3) {
			return Math.max(60, viewportInChars * (2 + outsideDistanceInChars));
		}
		return Math.max(200, viewportInChars * (7 + outsideDistanceInChars));
	}

	protected _execute(): void {
		const charWidth = this._context.configuration.options.get(EditorOption.fontInfo).typicalFullwidthCharacterWidth;
		const scrollSpeedInChars = this._getScrollSpeed();
		const elapsed = this._tick();
		const scrollInPixels = scrollSpeedInChars * (elapsed / 1000) * charWidth * 0.5;
		const scrollValue = (this._position.outsidePosition === 'left' ? -scrollInPixels : scrollInPixels);

		this._context.viewModel.viewLayout.deltaScrollNow(scrollValue, 0);
		this._viewHelper.renderNow();

		if (!this._position.position) {
			return;
		}
		const edgeLineNumber = this._position.position.lineNumber;

		// First, try to find a position that matches the horizontal position of the mouse
		let mouseTarget: IMouseTarget;
		{
			const editorPos = createEditorPagePosition(this._viewHelper.viewDomNode);
			const horizontalScrollbarHeight = this._context.configuration.options.get(EditorOption.layoutInfo).horizontalScrollbarHeight;
			const pos = new PageCoordinates(this._mouseEvent.pos.x, editorPos.y + editorPos.height - horizontalScrollbarHeight - 0.1);
			const relativePos = createCoordinatesRelativeToEditor(this._viewHelper.viewDomNode, editorPos, pos);
			mouseTarget = this._mouseTargetFactory.createMouseTarget(this._viewHelper.getLastRenderData(), editorPos, pos, relativePos, null);
		}

		if (this._position.outsidePosition === 'left') {
			mouseTarget = MouseTarget.createOutsideEditor(mouseTarget.mouseColumn, new Position(edgeLineNumber, mouseTarget.mouseColumn), 'left', this._position.outsideDistance);
		} else {
			mouseTarget = MouseTarget.createOutsideEditor(mouseTarget.mouseColumn, new Position(edgeLineNumber, mouseTarget.mouseColumn), 'right', this._position.outsideDistance);
		}

		this._dispatchMouse(mouseTarget, true, NavigationCommandRevealType.None);
		this._animationFrameDisposable = dom.scheduleAtNextAnimationFrame(dom.getWindow(mouseTarget.element), () => this._execute());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/controller/mouseHandler.ts]---
Location: vscode-main/src/vs/editor/browser/controller/mouseHandler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../base/browser/dom.js';
import { StandardWheelEvent, IMouseWheelEvent } from '../../../base/browser/mouseEvent.js';
import { Disposable, IDisposable } from '../../../base/common/lifecycle.js';
import * as platform from '../../../base/common/platform.js';
import { HitTestContext, MouseTarget, MouseTargetFactory, PointerHandlerLastRenderData } from './mouseTarget.js';
import { IMouseTarget, IMouseTargetViewZoneData, MouseTargetType } from '../editorBrowser.js';
import { ClientCoordinates, EditorMouseEvent, EditorMouseEventFactory, GlobalEditorPointerMoveMonitor, createEditorPagePosition, createCoordinatesRelativeToEditor } from '../editorDom.js';
import { ViewController } from '../view/viewController.js';
import { EditorZoom } from '../../common/config/editorZoom.js';
import { Position } from '../../common/core/position.js';
import { Selection } from '../../common/core/selection.js';
import { HorizontalPosition } from '../view/renderingContext.js';
import { ViewContext } from '../../common/viewModel/viewContext.js';
import * as viewEvents from '../../common/viewEvents.js';
import { ViewEventHandler } from '../../common/viewEventHandler.js';
import { EditorOption } from '../../common/config/editorOptions.js';
import { NavigationCommandRevealType } from '../coreCommands.js';
import { MouseWheelClassifier } from '../../../base/browser/ui/scrollbar/scrollableElement.js';
import type { ViewLinesGpu } from '../viewParts/viewLinesGpu/viewLinesGpu.js';
import { TopBottomDragScrolling, LeftRightDragScrolling } from './dragScrolling.js';
import { TextDirection } from '../../common/model.js';

export interface IPointerHandlerHelper {
	viewDomNode: HTMLElement;
	linesContentDomNode: HTMLElement;
	viewLinesDomNode: HTMLElement;
	viewLinesGpu: ViewLinesGpu | undefined;

	focusTextArea(): void;
	dispatchTextAreaEvent(event: CustomEvent): void;

	/**
	 * Get the last rendered information for cursors & textarea.
	 */
	getLastRenderData(): PointerHandlerLastRenderData;

	/**
	 * Render right now
	 */
	renderNow(): void;

	shouldSuppressMouseDownOnViewZone(viewZoneId: string): boolean;
	shouldSuppressMouseDownOnWidget(widgetId: string): boolean;

	/**
	 * Decode a position from a rendered dom node
	 */
	getPositionFromDOMInfo(spanNode: HTMLElement, offset: number): Position | null;

	visibleRangeForPosition(lineNumber: number, column: number): HorizontalPosition | null;
	getLineWidth(lineNumber: number): number;
}

export class MouseHandler extends ViewEventHandler {

	protected _context: ViewContext;
	protected viewController: ViewController;
	protected viewHelper: IPointerHandlerHelper;
	protected mouseTargetFactory: MouseTargetFactory;
	protected readonly _mouseDownOperation: MouseDownOperation;
	private lastMouseLeaveTime: number;
	private _height: number;
	private _mouseLeaveMonitor: IDisposable | null = null;

	constructor(context: ViewContext, viewController: ViewController, viewHelper: IPointerHandlerHelper) {
		super();

		this._context = context;
		this.viewController = viewController;
		this.viewHelper = viewHelper;
		this.mouseTargetFactory = new MouseTargetFactory(this._context, viewHelper);

		this._mouseDownOperation = this._register(new MouseDownOperation(
			this._context,
			this.viewController,
			this.viewHelper,
			this.mouseTargetFactory,
			(e, testEventTarget) => this._createMouseTarget(e, testEventTarget),
			(e) => this._getMouseColumn(e)
		));

		this.lastMouseLeaveTime = -1;
		this._height = this._context.configuration.options.get(EditorOption.layoutInfo).height;

		const mouseEvents = new EditorMouseEventFactory(this.viewHelper.viewDomNode);

		this._register(mouseEvents.onContextMenu(this.viewHelper.viewDomNode, (e) => this._onContextMenu(e, true)));

		this._register(mouseEvents.onMouseMove(this.viewHelper.viewDomNode, (e) => {
			this._onMouseMove(e);

			// See https://github.com/microsoft/vscode/issues/138789
			// When moving the mouse really quickly, the browser sometimes forgets to
			// send us a `mouseleave` or `mouseout` event. We therefore install here
			// a global `mousemove` listener to manually recover if the mouse goes outside
			// the editor. As soon as the mouse leaves outside of the editor, we
			// remove this listener

			if (!this._mouseLeaveMonitor) {
				this._mouseLeaveMonitor = dom.addDisposableListener(this.viewHelper.viewDomNode.ownerDocument, 'mousemove', (e) => {
					if (!this.viewHelper.viewDomNode.contains(e.target as Node | null)) {
						// went outside the editor!
						this._onMouseLeave(new EditorMouseEvent(e, false, this.viewHelper.viewDomNode));
					}
				});
			}
		}));

		this._register(mouseEvents.onMouseUp(this.viewHelper.viewDomNode, (e) => this._onMouseUp(e)));

		this._register(mouseEvents.onMouseLeave(this.viewHelper.viewDomNode, (e) => this._onMouseLeave(e)));

		// `pointerdown` events can't be used to determine if there's a double click, or triple click
		// because their `e.detail` is always 0.
		// We will therefore save the pointer id for the mouse and then reuse it in the `mousedown` event
		// for `element.setPointerCapture`.
		let capturePointerId: number = 0;
		this._register(mouseEvents.onPointerDown(this.viewHelper.viewDomNode, (e, pointerId) => {
			capturePointerId = pointerId;
		}));
		// The `pointerup` listener registered by `GlobalEditorPointerMoveMonitor` does not get invoked 100% of the times.
		// I speculate that this is because the `pointerup` listener is only registered during the `mousedown` event, and perhaps
		// the `pointerup` event is already queued for dispatching, which makes it that the new listener doesn't get fired.
		// See https://github.com/microsoft/vscode/issues/146486 for repro steps.
		// To compensate for that, we simply register here a `pointerup` listener and just communicate it.
		this._register(dom.addDisposableListener(this.viewHelper.viewDomNode, dom.EventType.POINTER_UP, (e: PointerEvent) => {
			this._mouseDownOperation.onPointerUp();
		}));
		this._register(mouseEvents.onMouseDown(this.viewHelper.viewDomNode, (e) => this._onMouseDown(e, capturePointerId)));
		this._setupMouseWheelZoomListener();

		this._context.addEventHandler(this);
	}

	private _setupMouseWheelZoomListener(): void {

		const classifier = MouseWheelClassifier.INSTANCE;

		let prevMouseWheelTime = 0;
		let gestureStartZoomLevel = EditorZoom.getZoomLevel();
		let gestureHasZoomModifiers = false;
		let gestureAccumulatedDelta = 0;

		const onMouseWheel = (browserEvent: IMouseWheelEvent) => {
			this.viewController.emitMouseWheel(browserEvent);

			if (!this._context.configuration.options.get(EditorOption.mouseWheelZoom)) {
				return;
			}

			const e = new StandardWheelEvent(browserEvent);
			classifier.acceptStandardWheelEvent(e);

			if (classifier.isPhysicalMouseWheel()) {
				if (hasMouseWheelZoomModifiers(browserEvent)) {
					const zoomLevel: number = EditorZoom.getZoomLevel();
					const delta = e.deltaY > 0 ? 1 : -1;
					EditorZoom.setZoomLevel(zoomLevel + delta);
					e.preventDefault();
					e.stopPropagation();
				}
			} else {
				// we consider mousewheel events that occur within 50ms of each other to be part of the same gesture
				// we don't want to consider mouse wheel events where ctrl/cmd is pressed during the inertia phase
				// we also want to accumulate deltaY values from the same gesture and use that to set the zoom level
				if (Date.now() - prevMouseWheelTime > 50) {
					// reset if more than 50ms have passed
					gestureStartZoomLevel = EditorZoom.getZoomLevel();
					gestureHasZoomModifiers = hasMouseWheelZoomModifiers(browserEvent);
					gestureAccumulatedDelta = 0;
				}

				prevMouseWheelTime = Date.now();
				gestureAccumulatedDelta += e.deltaY;

				if (gestureHasZoomModifiers) {
					EditorZoom.setZoomLevel(gestureStartZoomLevel + gestureAccumulatedDelta / 5);
					e.preventDefault();
					e.stopPropagation();
				}
			}
		};
		this._register(dom.addDisposableListener(this.viewHelper.viewDomNode, dom.EventType.MOUSE_WHEEL, onMouseWheel, { capture: true, passive: false }));

		function hasMouseWheelZoomModifiers(browserEvent: IMouseWheelEvent): boolean {
			return (
				platform.isMacintosh
					// on macOS we support cmd + two fingers scroll (`metaKey` set)
					// and also the two fingers pinch gesture (`ctrKey` set)
					? ((browserEvent.metaKey || browserEvent.ctrlKey) && !browserEvent.shiftKey && !browserEvent.altKey)
					: (browserEvent.ctrlKey && !browserEvent.metaKey && !browserEvent.shiftKey && !browserEvent.altKey)
			);
		}
	}

	public override dispose(): void {
		this._context.removeEventHandler(this);
		if (this._mouseLeaveMonitor) {
			this._mouseLeaveMonitor.dispose();
			this._mouseLeaveMonitor = null;
		}
		super.dispose();
	}

	// --- begin event handlers
	public override onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		if (e.hasChanged(EditorOption.layoutInfo)) {
			// layout change
			const height = this._context.configuration.options.get(EditorOption.layoutInfo).height;
			if (this._height !== height) {
				this._height = height;
				this._mouseDownOperation.onHeightChanged();
			}
		}
		return false;
	}
	public override onCursorStateChanged(e: viewEvents.ViewCursorStateChangedEvent): boolean {
		this._mouseDownOperation.onCursorStateChanged(e);
		return false;
	}
	public override onFocusChanged(e: viewEvents.ViewFocusChangedEvent): boolean {
		return false;
	}
	// --- end event handlers

	public getTargetAtClientPoint(clientX: number, clientY: number): IMouseTarget | null {
		const clientPos = new ClientCoordinates(clientX, clientY);
		const pos = clientPos.toPageCoordinates(dom.getWindow(this.viewHelper.viewDomNode));
		const editorPos = createEditorPagePosition(this.viewHelper.viewDomNode);

		if (pos.y < editorPos.y || pos.y > editorPos.y + editorPos.height || pos.x < editorPos.x || pos.x > editorPos.x + editorPos.width) {
			return null;
		}

		const relativePos = createCoordinatesRelativeToEditor(this.viewHelper.viewDomNode, editorPos, pos);
		return this.mouseTargetFactory.createMouseTarget(this.viewHelper.getLastRenderData(), editorPos, pos, relativePos, null);
	}

	protected _createMouseTarget(e: EditorMouseEvent, testEventTarget: boolean): IMouseTarget {
		let target: HTMLElement | null = e.target;
		if (!this.viewHelper.viewDomNode.contains(target)) {
			const shadowRoot = dom.getShadowRoot(this.viewHelper.viewDomNode);
			if (shadowRoot) {
				const potentialTarget = shadowRoot.elementsFromPoint(e.posx, e.posy).find(
					(el: Element) => this.viewHelper.viewDomNode.contains(el)
				) ?? null;
				target = potentialTarget as HTMLElement;
			}
		}
		return this.mouseTargetFactory.createMouseTarget(this.viewHelper.getLastRenderData(), e.editorPos, e.pos, e.relativePos, testEventTarget ? target : null);
	}

	private _getMouseColumn(e: EditorMouseEvent): number {
		return this.mouseTargetFactory.getMouseColumn(e.relativePos);
	}

	protected _onContextMenu(e: EditorMouseEvent, testEventTarget: boolean): void {
		this.viewController.emitContextMenu({
			event: e,
			target: this._createMouseTarget(e, testEventTarget)
		});
	}

	protected _onMouseMove(e: EditorMouseEvent): void {
		const targetIsWidget = this.mouseTargetFactory.mouseTargetIsWidget(e);
		if (!targetIsWidget) {
			e.preventDefault();
		}

		if (this._mouseDownOperation.isActive()) {
			// In selection/drag operation
			return;
		}
		const actualMouseMoveTime = e.timestamp;
		if (actualMouseMoveTime < this.lastMouseLeaveTime) {
			// Due to throttling, this event occurred before the mouse left the editor, therefore ignore it.
			return;
		}

		this.viewController.emitMouseMove({
			event: e,
			target: this._createMouseTarget(e, true)
		});
	}

	protected _onMouseLeave(e: EditorMouseEvent): void {
		if (this._mouseLeaveMonitor) {
			this._mouseLeaveMonitor.dispose();
			this._mouseLeaveMonitor = null;
		}
		this.lastMouseLeaveTime = (new Date()).getTime();
		this.viewController.emitMouseLeave({
			event: e,
			target: null
		});
	}

	protected _onMouseUp(e: EditorMouseEvent): void {
		this.viewController.emitMouseUp({
			event: e,
			target: this._createMouseTarget(e, true)
		});
	}

	protected _onMouseDown(e: EditorMouseEvent, pointerId: number): void {
		const t = this._createMouseTarget(e, true);

		const targetIsContent = (t.type === MouseTargetType.CONTENT_TEXT || t.type === MouseTargetType.CONTENT_EMPTY);
		const targetIsGutter = (t.type === MouseTargetType.GUTTER_GLYPH_MARGIN || t.type === MouseTargetType.GUTTER_LINE_NUMBERS || t.type === MouseTargetType.GUTTER_LINE_DECORATIONS);
		const targetIsLineNumbers = (t.type === MouseTargetType.GUTTER_LINE_NUMBERS);
		const selectOnLineNumbers = this._context.configuration.options.get(EditorOption.selectOnLineNumbers);
		const targetIsViewZone = (t.type === MouseTargetType.CONTENT_VIEW_ZONE || t.type === MouseTargetType.GUTTER_VIEW_ZONE);
		const targetIsWidget = (t.type === MouseTargetType.CONTENT_WIDGET);

		let shouldHandle = e.leftButton || e.middleButton;
		if (platform.isMacintosh && e.leftButton && e.ctrlKey) {
			shouldHandle = false;
		}

		const focus = () => {
			e.preventDefault();
			this.viewHelper.focusTextArea();
		};

		if (shouldHandle && (targetIsContent || (targetIsLineNumbers && selectOnLineNumbers))) {
			focus();
			this._mouseDownOperation.start(t.type, e, pointerId);

		} else if (targetIsGutter) {
			// Do not steal focus
			e.preventDefault();
		} else if (targetIsViewZone) {
			const viewZoneData = t.detail;
			if (shouldHandle && this.viewHelper.shouldSuppressMouseDownOnViewZone(viewZoneData.viewZoneId)) {
				focus();
				this._mouseDownOperation.start(t.type, e, pointerId);
				e.preventDefault();
			}
		} else if (targetIsWidget && this.viewHelper.shouldSuppressMouseDownOnWidget(t.detail)) {
			focus();
			e.preventDefault();
		}

		this.viewController.emitMouseDown({
			event: e,
			target: t
		});
	}

	protected _onMouseWheel(e: IMouseWheelEvent): void {
		this.viewController.emitMouseWheel(e);
	}
}

class MouseDownOperation extends Disposable {

	private readonly _createMouseTarget: (e: EditorMouseEvent, testEventTarget: boolean) => IMouseTarget;
	private readonly _getMouseColumn: (e: EditorMouseEvent) => number;

	private readonly _mouseMoveMonitor: GlobalEditorPointerMoveMonitor;
	private readonly _topBottomDragScrolling: TopBottomDragScrolling;
	private readonly _leftRightDragScrolling: LeftRightDragScrolling;
	private readonly _mouseState: MouseDownState;

	private _currentSelection: Selection;
	private _isActive: boolean;
	private _lastMouseEvent: EditorMouseEvent | null;

	constructor(
		private readonly _context: ViewContext,
		private readonly _viewController: ViewController,
		private readonly _viewHelper: IPointerHandlerHelper,
		private readonly _mouseTargetFactory: MouseTargetFactory,
		createMouseTarget: (e: EditorMouseEvent, testEventTarget: boolean) => IMouseTarget,
		getMouseColumn: (e: EditorMouseEvent) => number
	) {
		super();
		this._createMouseTarget = createMouseTarget;
		this._getMouseColumn = getMouseColumn;

		this._mouseMoveMonitor = this._register(new GlobalEditorPointerMoveMonitor(this._viewHelper.viewDomNode));
		this._topBottomDragScrolling = this._register(new TopBottomDragScrolling(
			this._context,
			this._viewHelper,
			this._mouseTargetFactory,
			(position, inSelectionMode, revealType) => this._dispatchMouse(position, inSelectionMode, revealType)
		));
		this._leftRightDragScrolling = this._register(new LeftRightDragScrolling(
			this._context,
			this._viewHelper,
			this._mouseTargetFactory,
			(position, inSelectionMode, revealType) => this._dispatchMouse(position, inSelectionMode, revealType)
		));
		this._mouseState = new MouseDownState();

		this._currentSelection = new Selection(1, 1, 1, 1);
		this._isActive = false;
		this._lastMouseEvent = null;
	}

	public override dispose(): void {
		super.dispose();
	}

	public isActive(): boolean {
		return this._isActive;
	}

	private _onMouseDownThenMove(e: EditorMouseEvent): void {
		this._lastMouseEvent = e;
		this._mouseState.setModifiers(e);

		const position = this._findMousePosition(e, false);
		if (!position) {
			// Ignoring because position is unknown
			return;
		}

		if (this._mouseState.isDragAndDrop) {
			this._viewController.emitMouseDrag({
				event: e,
				target: position
			});
		} else {
			if (position.type === MouseTargetType.OUTSIDE_EDITOR) {
				if (position.outsidePosition === 'above' || position.outsidePosition === 'below') {
					this._topBottomDragScrolling.start(position, e);
					this._leftRightDragScrolling.stop();
				} else {
					this._leftRightDragScrolling.start(position, e);
					this._topBottomDragScrolling.stop();
				}
			} else {
				this._topBottomDragScrolling.stop();
				this._leftRightDragScrolling.stop();
				this._dispatchMouse(position, true, NavigationCommandRevealType.Minimal);
			}
		}
	}

	public start(targetType: MouseTargetType, e: EditorMouseEvent, pointerId: number): void {
		this._lastMouseEvent = e;

		this._mouseState.setStartedOnLineNumbers(targetType === MouseTargetType.GUTTER_LINE_NUMBERS);
		this._mouseState.setStartButtons(e);
		this._mouseState.setModifiers(e);
		const position = this._findMousePosition(e, true);
		if (!position || !position.position) {
			// Ignoring because position is unknown
			return;
		}

		this._mouseState.trySetCount(e.detail, position.position);

		// Overwrite the detail of the MouseEvent, as it will be sent out in an event and contributions might rely on it.
		e.detail = this._mouseState.count;

		const options = this._context.configuration.options;

		if (!options.get(EditorOption.readOnly)
			&& options.get(EditorOption.dragAndDrop)
			&& !options.get(EditorOption.columnSelection)
			&& !this._mouseState.altKey // we don't support multiple mouse
			&& e.detail < 2 // only single click on a selection can work
			&& !this._isActive // the mouse is not down yet
			&& !this._currentSelection.isEmpty() // we don't drag single cursor
			&& (position.type === MouseTargetType.CONTENT_TEXT) // single click on text
			&& position.position && this._currentSelection.containsPosition(position.position) // single click on a selection
		) {
			this._mouseState.isDragAndDrop = true;
			this._isActive = true;

			this._mouseMoveMonitor.startMonitoring(
				this._viewHelper.viewLinesDomNode,
				pointerId,
				e.buttons,
				(e) => this._onMouseDownThenMove(e),
				(browserEvent?: MouseEvent | KeyboardEvent) => {
					const position = this._findMousePosition(this._lastMouseEvent!, false);

					if (dom.isKeyboardEvent(browserEvent)) {
						// cancel
						this._viewController.emitMouseDropCanceled();
					} else {
						this._viewController.emitMouseDrop({
							event: this._lastMouseEvent!,
							target: (position ? this._createMouseTarget(this._lastMouseEvent!, true) : null) // Ignoring because position is unknown, e.g., Content View Zone
						});
					}

					this._stop();
				}
			);

			return;
		}

		this._mouseState.isDragAndDrop = false;
		this._dispatchMouse(position, e.shiftKey, NavigationCommandRevealType.Minimal);

		if (!this._isActive) {
			this._isActive = true;
			this._mouseMoveMonitor.startMonitoring(
				this._viewHelper.viewLinesDomNode,
				pointerId,
				e.buttons,
				(e) => this._onMouseDownThenMove(e),
				() => this._stop()
			);
		}
	}

	private _stop(): void {
		this._isActive = false;
		this._topBottomDragScrolling.stop();
		this._leftRightDragScrolling.stop();
	}

	public onHeightChanged(): void {
		this._mouseMoveMonitor.stopMonitoring();
	}

	public onPointerUp(): void {
		this._mouseMoveMonitor.stopMonitoring();
	}

	public onCursorStateChanged(e: viewEvents.ViewCursorStateChangedEvent): void {
		this._currentSelection = e.selections[0];
	}

	private _getPositionOutsideEditor(e: EditorMouseEvent): IMouseTarget | null {
		const editorContent = e.editorPos;
		const model = this._context.viewModel;
		const viewLayout = this._context.viewLayout;

		const mouseColumn = this._getMouseColumn(e);

		if (e.posy < editorContent.y) {
			const outsideDistance = editorContent.y - e.posy;
			const verticalOffset = Math.max(viewLayout.getCurrentScrollTop() - outsideDistance, 0);
			const viewZoneData = HitTestContext.getZoneAtCoord(this._context, verticalOffset);
			if (viewZoneData) {
				const newPosition = this._helpPositionJumpOverViewZone(viewZoneData);
				if (newPosition) {
					return MouseTarget.createOutsideEditor(mouseColumn, newPosition, 'above', outsideDistance);
				}
			}

			const aboveLineNumber = viewLayout.getLineNumberAtVerticalOffset(verticalOffset);
			return MouseTarget.createOutsideEditor(mouseColumn, new Position(aboveLineNumber, 1), 'above', outsideDistance);
		}

		if (e.posy > editorContent.y + editorContent.height) {
			const outsideDistance = e.posy - editorContent.y - editorContent.height;
			const verticalOffset = viewLayout.getCurrentScrollTop() + e.relativePos.y;
			const viewZoneData = HitTestContext.getZoneAtCoord(this._context, verticalOffset);
			if (viewZoneData) {
				const newPosition = this._helpPositionJumpOverViewZone(viewZoneData);
				if (newPosition) {
					return MouseTarget.createOutsideEditor(mouseColumn, newPosition, 'below', outsideDistance);
				}
			}

			const belowLineNumber = viewLayout.getLineNumberAtVerticalOffset(verticalOffset);
			return MouseTarget.createOutsideEditor(mouseColumn, new Position(belowLineNumber, model.getLineMaxColumn(belowLineNumber)), 'below', outsideDistance);
		}

		const possibleLineNumber = viewLayout.getLineNumberAtVerticalOffset(viewLayout.getCurrentScrollTop() + e.relativePos.y);

		const layoutInfo = this._context.configuration.options.get(EditorOption.layoutInfo);

		const xLeftBoundary = layoutInfo.contentLeft;
		if (e.relativePos.x <= xLeftBoundary) {
			const outsideDistance = xLeftBoundary - e.relativePos.x;
			const isRtl = model.getTextDirection(possibleLineNumber) === TextDirection.RTL;
			return MouseTarget.createOutsideEditor(mouseColumn, new Position(possibleLineNumber, isRtl ? model.getLineMaxColumn(possibleLineNumber) : 1), 'left', outsideDistance);
		}

		const contentRight = (
			layoutInfo.minimap.minimapLeft === 0
				? layoutInfo.width - layoutInfo.verticalScrollbarWidth // Happens when minimap is hidden
				: layoutInfo.minimap.minimapLeft
		);
		const xRightBoundary = contentRight;
		if (e.relativePos.x >= xRightBoundary) {
			const outsideDistance = e.relativePos.x - xRightBoundary;
			const isRtl = model.getTextDirection(possibleLineNumber) === TextDirection.RTL;
			return MouseTarget.createOutsideEditor(mouseColumn, new Position(possibleLineNumber, isRtl ? 1 : model.getLineMaxColumn(possibleLineNumber)), 'right', outsideDistance);
		}

		return null;
	}

	private _findMousePosition(e: EditorMouseEvent, testEventTarget: boolean): IMouseTarget | null {
		const positionOutsideEditor = this._getPositionOutsideEditor(e);
		if (positionOutsideEditor) {
			return positionOutsideEditor;
		}

		const t = this._createMouseTarget(e, testEventTarget);
		const hintedPosition = t.position;
		if (!hintedPosition) {
			return null;
		}

		if (t.type === MouseTargetType.CONTENT_VIEW_ZONE || t.type === MouseTargetType.GUTTER_VIEW_ZONE) {
			const newPosition = this._helpPositionJumpOverViewZone(t.detail);
			if (newPosition) {
				return MouseTarget.createViewZone(t.type, t.element, t.mouseColumn, newPosition, t.detail);
			}
		}

		return t;
	}

	private _helpPositionJumpOverViewZone(viewZoneData: IMouseTargetViewZoneData): Position | null {
		// Force position on view zones to go above or below depending on where selection started from
		const selectionStart = new Position(this._currentSelection.selectionStartLineNumber, this._currentSelection.selectionStartColumn);
		const positionBefore = viewZoneData.positionBefore;
		const positionAfter = viewZoneData.positionAfter;

		if (positionBefore && positionAfter) {
			if (positionBefore.isBefore(selectionStart)) {
				return positionBefore;
			} else {
				return positionAfter;
			}
		}
		return null;
	}

	private _dispatchMouse(position: IMouseTarget, inSelectionMode: boolean, revealType: NavigationCommandRevealType): void {
		if (!position.position) {
			return;
		}
		this._viewController.dispatchMouse({
			position: position.position,
			mouseColumn: position.mouseColumn,
			startedOnLineNumbers: this._mouseState.startedOnLineNumbers,
			revealType,

			inSelectionMode: inSelectionMode,
			mouseDownCount: this._mouseState.count,
			altKey: this._mouseState.altKey,
			ctrlKey: this._mouseState.ctrlKey,
			metaKey: this._mouseState.metaKey,
			shiftKey: this._mouseState.shiftKey,

			leftButton: this._mouseState.leftButton,
			middleButton: this._mouseState.middleButton,

			onInjectedText: position.type === MouseTargetType.CONTENT_TEXT && position.detail.injectedText !== null
		});
	}
}

class MouseDownState {

	private static readonly CLEAR_MOUSE_DOWN_COUNT_TIME = 400; // ms

	private _altKey: boolean;
	public get altKey(): boolean { return this._altKey; }

	private _ctrlKey: boolean;
	public get ctrlKey(): boolean { return this._ctrlKey; }

	private _metaKey: boolean;
	public get metaKey(): boolean { return this._metaKey; }

	private _shiftKey: boolean;
	public get shiftKey(): boolean { return this._shiftKey; }

	private _leftButton: boolean;
	public get leftButton(): boolean { return this._leftButton; }

	private _middleButton: boolean;
	public get middleButton(): boolean { return this._middleButton; }

	private _startedOnLineNumbers: boolean;
	public get startedOnLineNumbers(): boolean { return this._startedOnLineNumbers; }

	private _lastMouseDownPosition: Position | null;
	private _lastMouseDownPositionEqualCount: number;
	private _lastMouseDownCount: number;
	private _lastSetMouseDownCountTime: number;
	public isDragAndDrop: boolean;

	constructor() {
		this._altKey = false;
		this._ctrlKey = false;
		this._metaKey = false;
		this._shiftKey = false;
		this._leftButton = false;
		this._middleButton = false;
		this._startedOnLineNumbers = false;
		this._lastMouseDownPosition = null;
		this._lastMouseDownPositionEqualCount = 0;
		this._lastMouseDownCount = 0;
		this._lastSetMouseDownCountTime = 0;
		this.isDragAndDrop = false;
	}

	public get count(): number {
		return this._lastMouseDownCount;
	}

	public setModifiers(source: EditorMouseEvent) {
		this._altKey = source.altKey;
		this._ctrlKey = source.ctrlKey;
		this._metaKey = source.metaKey;
		this._shiftKey = source.shiftKey;
	}

	public setStartButtons(source: EditorMouseEvent) {
		this._leftButton = source.leftButton;
		this._middleButton = source.middleButton;
	}

	public setStartedOnLineNumbers(startedOnLineNumbers: boolean): void {
		this._startedOnLineNumbers = startedOnLineNumbers;
	}

	public trySetCount(setMouseDownCount: number, newMouseDownPosition: Position): void {
		// a. Invalidate multiple clicking if too much time has passed (will be hit by IE because the detail field of mouse events contains garbage in IE10)
		const currentTime = (new Date()).getTime();
		if (currentTime - this._lastSetMouseDownCountTime > MouseDownState.CLEAR_MOUSE_DOWN_COUNT_TIME) {
			setMouseDownCount = 1;
		}
		this._lastSetMouseDownCountTime = currentTime;

		// b. Ensure that we don't jump from single click to triple click in one go (will be hit by IE because the detail field of mouse events contains garbage in IE10)
		if (setMouseDownCount > this._lastMouseDownCount + 1) {
			setMouseDownCount = this._lastMouseDownCount + 1;
		}

		// c. Invalidate multiple clicking if the logical position is different
		if (this._lastMouseDownPosition && this._lastMouseDownPosition.equals(newMouseDownPosition)) {
			this._lastMouseDownPositionEqualCount++;
		} else {
			this._lastMouseDownPositionEqualCount = 1;
		}
		this._lastMouseDownPosition = newMouseDownPosition;

		// Finally set the lastMouseDownCount
		this._lastMouseDownCount = Math.min(setMouseDownCount, this._lastMouseDownPositionEqualCount);
	}

}
```

--------------------------------------------------------------------------------

````

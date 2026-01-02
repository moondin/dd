---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 276
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 276 of 552)

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

---[FILE: src/vs/platform/files/test/node/fixtures/service/small.txt]---
Location: vscode-main/src/vs/platform/files/test/node/fixtures/service/small.txt

```text
Small File
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/test/node/fixtures/service/small_umlaut.txt]---
Location: vscode-main/src/vs/platform/files/test/node/fixtures/service/small_umlaut.txt

```text
Small File with Ümlaut
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/test/node/fixtures/service/some_utf8_bom.txt]---
Location: vscode-main/src/vs/platform/files/test/node/fixtures/service/some_utf8_bom.txt

```text
This is some UTF 8 with BOM file.
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/test/node/fixtures/service/deep/company.js]---
Location: vscode-main/src/vs/platform/files/test/node/fixtures/service/deep/company.js

```javascript
'use strict';
/// <reference path="employee.ts" />
var Workforce;
(function (Workforce_1) {
    var Company = (function () {
        function Company() {
        }
        return Company;
    })();
    (function (property, Workforce, IEmployee) {
        if (property === undefined) { property = employees; }
        if (IEmployee === undefined) { IEmployee = []; }
        property;
        calculateMonthlyExpenses();
        {
            var result = 0;
            for (var i = 0; i < employees.length; i++) {
                result += employees[i].calculatePay();
            }
            return result;
        }
    });
})(Workforce || (Workforce = {}));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/test/node/fixtures/service/deep/conway.js]---
Location: vscode-main/src/vs/platform/files/test/node/fixtures/service/deep/conway.js

```javascript
'use strict';
var Conway;
(function (Conway) {
    var Cell = (function () {
        function Cell() {
        }
        return Cell;
    })();
    (function (property, number, property, number, property, boolean) {
        if (property === undefined) { property = row; }
        if (property === undefined) { property = col; }
        if (property === undefined) { property = live; }
    });
    var GameOfLife = (function () {
        function GameOfLife() {
        }
        return GameOfLife;
    })();
    (function () {
        property;
        gridSize = 50;
        property;
        canvasSize = 600;
        property;
        lineColor = '#cdcdcd';
        property;
        liveColor = '#666';
        property;
        deadColor = '#eee';
        property;
        initialLifeProbability = 0.5;
        property;
        animationRate = 60;
        property;
        cellSize = 0;
        property;
        context: ICanvasRenderingContext2D;
        property;
        world = createWorld();
        circleOfLife();
        function createWorld() {
            return travelWorld(function (cell) {
                cell.live = Math.random() < initialLifeProbability;
                return cell;
            });
        }
        function circleOfLife() {
            world = travelWorld(function (cell) {
                cell = world[cell.row][cell.col];
                draw(cell);
                return resolveNextGeneration(cell);
            });
            setTimeout(function () { circleOfLife(); }, animationRate);
        }
        function resolveNextGeneration(cell) {
            var count = countNeighbors(cell);
            var newCell = new Cell(cell.row, cell.col, cell.live);
            if (count < 2 || count > 3)
                newCell.live = false;
            else if (count == 3)
                newCell.live = true;
            return newCell;
        }
        function countNeighbors(cell) {
            var neighbors = 0;
            for (var row = -1; row <= 1; row++) {
                for (var col = -1; col <= 1; col++) {
                    if (row == 0 && col == 0)
                        continue;
                    if (isAlive(cell.row + row, cell.col + col)) {
                        neighbors++;
                    }
                }
            }
            return neighbors;
        }
        function isAlive(row, col) {
            // todo - need to guard with worl[row] exists?
            if (row < 0 || col < 0 || row >= gridSize || col >= gridSize)
                return false;
            return world[row][col].live;
        }
        function travelWorld(callback) {
            var result = [];
            for (var row = 0; row < gridSize; row++) {
                var rowData = [];
                for (var col = 0; col < gridSize; col++) {
                    rowData.push(callback(new Cell(row, col, false)));
                }
                result.push(rowData);
            }
            return result;
        }
        function draw(cell) {
            if (context == null)
                context = createDrawingContext();
            if (cellSize == 0)
                cellSize = canvasSize / gridSize;
            context.strokeStyle = lineColor;
            context.strokeRect(cell.row * cellSize, cell.col * cellSize, cellSize, cellSize);
            context.fillStyle = cell.live ? liveColor : deadColor;
            context.fillRect(cell.row * cellSize, cell.col * cellSize, cellSize, cellSize);
        }
        function createDrawingContext() {
            var canvas = document.getElementById('conway-canvas');
            if (canvas == null) {
                canvas = document.createElement('canvas');
                canvas.id = "conway-canvas";
                canvas.width = canvasSize;
                canvas.height = canvasSize;
                document.body.appendChild(canvas);
            }
            return canvas.getContext('2d');
        }
    });
})(Conway || (Conway = {}));
var game = new Conway.GameOfLife();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/test/node/fixtures/service/deep/employee.js]---
Location: vscode-main/src/vs/platform/files/test/node/fixtures/service/deep/employee.js

```javascript
'use strict';
var Workforce;
(function (Workforce) {
    var Employee = (function () {
        function Employee() {
        }
        return Employee;
    })();
    (property);
    name: string, property;
    basepay: number;
    implements;
    IEmployee;
    {
        name;
        basepay;
    }
    var SalesEmployee = (function () {
        function SalesEmployee() {
        }
        return SalesEmployee;
    })();
    ();
    Employee(name, basepay);
    {
        function calculatePay() {
            var multiplier = (document.getElementById("mult")), as = any, value;
            return _super.calculatePay.call(this) * multiplier + bonus;
        }
    }
    var employee = new Employee('Bob', 1000);
    var salesEmployee = new SalesEmployee('Jim', 800, 400);
    salesEmployee.calclatePay(); // error: No member 'calclatePay' on SalesEmployee
})(Workforce || (Workforce = {}));
extern;
var $;
var s = Workforce.salesEmployee.calculatePay();
$('#results').text(s);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/test/node/fixtures/service/deep/small.js]---
Location: vscode-main/src/vs/platform/files/test/node/fixtures/service/deep/small.js

```javascript
'use strict';
var M;
(function (M) {
    var C = (function () {
        function C() {
        }
        return C;
    })();
    (function (x, property, number) {
        if (property === undefined) { property = w; }
        var local = 1;
        // unresolved symbol because x is local
        //self.x++;
        self.w--; // ok because w is a property
        property;
        f = function (y) {
            return y + x + local + w + self.w;
        };
        function sum(z) {
            return z + f(z) + w + self.w;
        }
    });
})(M || (M = {}));
var c = new M.C(12, 5);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/history/browser/contextScopedHistoryWidget.ts]---
Location: vscode-main/src/vs/platform/history/browser/contextScopedHistoryWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IHistoryNavigationWidget } from '../../../base/browser/history.js';
import { IContextViewProvider } from '../../../base/browser/ui/contextview/contextview.js';
import { FindInput, IFindInputOptions } from '../../../base/browser/ui/findinput/findInput.js';
import { IReplaceInputOptions, ReplaceInput } from '../../../base/browser/ui/findinput/replaceInput.js';
import { HistoryInputBox, IHistoryInputOptions } from '../../../base/browser/ui/inputbox/inputBox.js';
import { KeyCode, KeyMod } from '../../../base/common/keyCodes.js';
import { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from '../../contextkey/common/contextkey.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../keybinding/common/keybindingsRegistry.js';
import { localize } from '../../../nls.js';
import { DisposableStore, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { isActiveElement } from '../../../base/browser/dom.js';

export const historyNavigationVisible = new RawContextKey<boolean>('suggestWidgetVisible', false, localize('suggestWidgetVisible', "Whether suggestion are visible"));

const HistoryNavigationWidgetFocusContext = 'historyNavigationWidgetFocus';
const HistoryNavigationForwardsEnablementContext = 'historyNavigationForwardsEnabled';
const HistoryNavigationBackwardsEnablementContext = 'historyNavigationBackwardsEnabled';

export interface IHistoryNavigationContext extends IDisposable {
	historyNavigationForwardsEnablement: IContextKey<boolean>;
	historyNavigationBackwardsEnablement: IContextKey<boolean>;
}

let lastFocusedWidget: IHistoryNavigationWidget | undefined = undefined;
const widgets: IHistoryNavigationWidget[] = [];

export function registerAndCreateHistoryNavigationContext(scopedContextKeyService: IContextKeyService, widget: IHistoryNavigationWidget): IHistoryNavigationContext {
	if (widgets.includes(widget)) {
		throw new Error('Cannot register the same widget multiple times');
	}

	widgets.push(widget);
	const disposableStore = new DisposableStore();
	const historyNavigationWidgetFocus = new RawContextKey<boolean>(HistoryNavigationWidgetFocusContext, false).bindTo(scopedContextKeyService);
	const historyNavigationForwardsEnablement = new RawContextKey<boolean>(HistoryNavigationForwardsEnablementContext, true).bindTo(scopedContextKeyService);
	const historyNavigationBackwardsEnablement = new RawContextKey<boolean>(HistoryNavigationBackwardsEnablementContext, true).bindTo(scopedContextKeyService);

	const onDidFocus = () => {
		historyNavigationWidgetFocus.set(true);
		lastFocusedWidget = widget;
	};

	const onDidBlur = () => {
		historyNavigationWidgetFocus.set(false);
		if (lastFocusedWidget === widget) {
			lastFocusedWidget = undefined;
		}
	};

	// Check for currently being focused
	if (isActiveElement(widget.element)) {
		onDidFocus();
	}

	disposableStore.add(widget.onDidFocus(() => onDidFocus()));
	disposableStore.add(widget.onDidBlur(() => onDidBlur()));
	disposableStore.add(toDisposable(() => {
		widgets.splice(widgets.indexOf(widget), 1);
		onDidBlur();
	}));

	return {
		historyNavigationForwardsEnablement,
		historyNavigationBackwardsEnablement,
		dispose() {
			disposableStore.dispose();
		}
	};
}

export class ContextScopedHistoryInputBox extends HistoryInputBox {

	constructor(container: HTMLElement, contextViewProvider: IContextViewProvider | undefined, options: IHistoryInputOptions,
		@IContextKeyService contextKeyService: IContextKeyService
	) {
		super(container, contextViewProvider, options);
		const scopedContextKeyService = this._register(contextKeyService.createScoped(this.element));
		this._register(registerAndCreateHistoryNavigationContext(scopedContextKeyService, this));
	}

}

export class ContextScopedFindInput extends FindInput {

	constructor(container: HTMLElement | null, contextViewProvider: IContextViewProvider, options: IFindInputOptions,
		@IContextKeyService contextKeyService: IContextKeyService
	) {
		super(container, contextViewProvider, options);
		const scopedContextKeyService = this._register(contextKeyService.createScoped(this.inputBox.element));
		this._register(registerAndCreateHistoryNavigationContext(scopedContextKeyService, this.inputBox));
	}
}

export class ContextScopedReplaceInput extends ReplaceInput {

	constructor(container: HTMLElement | null, contextViewProvider: IContextViewProvider | undefined, options: IReplaceInputOptions,
		@IContextKeyService contextKeyService: IContextKeyService, showReplaceOptions: boolean = false
	) {
		super(container, contextViewProvider, showReplaceOptions, options);
		const scopedContextKeyService = this._register(contextKeyService.createScoped(this.inputBox.element));
		this._register(registerAndCreateHistoryNavigationContext(scopedContextKeyService, this.inputBox));
	}

}

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'history.showPrevious',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(
		ContextKeyExpr.has(HistoryNavigationWidgetFocusContext),
		ContextKeyExpr.equals(HistoryNavigationBackwardsEnablementContext, true),
		ContextKeyExpr.not('isComposing'),
		historyNavigationVisible.isEqualTo(false),
	),
	primary: KeyCode.UpArrow,
	secondary: [KeyMod.Alt | KeyCode.UpArrow],
	handler: (accessor) => {
		lastFocusedWidget?.showPreviousValue();
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'history.showNext',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(
		ContextKeyExpr.has(HistoryNavigationWidgetFocusContext),
		ContextKeyExpr.equals(HistoryNavigationForwardsEnablementContext, true),
		ContextKeyExpr.not('isComposing'),
		historyNavigationVisible.isEqualTo(false),
	),
	primary: KeyCode.DownArrow,
	secondary: [KeyMod.Alt | KeyCode.DownArrow],
	handler: (accessor) => {
		lastFocusedWidget?.showNextValue();
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/history/browser/historyWidgetKeybindingHint.ts]---
Location: vscode-main/src/vs/platform/history/browser/historyWidgetKeybindingHint.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IKeybindingService } from '../../keybinding/common/keybinding.js';

export function showHistoryKeybindingHint(keybindingService: IKeybindingService): boolean {
	return keybindingService.lookupKeybinding('history.showPrevious')?.getElectronAccelerator() === 'Up' && keybindingService.lookupKeybinding('history.showNext')?.getElectronAccelerator() === 'Down';
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/hover/browser/hover.css]---
Location: vscode-main/src/vs/platform/hover/browser/hover.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* stylelint-disable layer-checker */

.monaco-hover.workbench-hover {
	position: relative;
	font-size: 13px;
	line-height: 19px;
	/* Must be higher than sash's z-index and terminal canvases */
	z-index: 40;
	overflow: hidden;
	max-width: 700px;
	background: var(--vscode-editorHoverWidget-background);
	border: 1px solid var(--vscode-editorHoverWidget-border);
	border-radius: 5px;
	color: var(--vscode-editorHoverWidget-foreground);
	box-shadow: 0 2px 8px var(--vscode-widget-shadow);
}

.monaco-hover.workbench-hover .monaco-action-bar .action-item .codicon {
	/* Given our font-size, adjust action icons accordingly */
	width: 13px;
	height: 13px;
}

.monaco-hover.workbench-hover hr {
	border-bottom: none;
}

.monaco-hover.workbench-hover.compact {
	font-size: 12px;
}

.monaco-hover.workbench-hover.compact .monaco-action-bar .action-item .codicon {
	/* Given our font-size, adjust action icons accordingly */
	width: 12px;
	height: 12px;
}

.monaco-hover.workbench-hover.compact .hover-contents {
	padding: 2px 8px;
}

.workbench-hover-container.locked .monaco-hover.workbench-hover {
	outline: 1px solid var(--vscode-editorHoverWidget-border);
}
.workbench-hover-container:focus-within.locked .monaco-hover.workbench-hover {
	outline-color: var(--vscode-focusBorder);
}

.workbench-hover-pointer {
	position: absolute;
	/* Must be higher than workbench hover z-index */
	z-index: 41;
	pointer-events: none;
}

.workbench-hover-pointer:after {
	content: '';
	position: absolute;
	width: 5px;
	height: 5px;
	background-color: var(--vscode-editorHoverWidget-background);
	border-right: 1px solid var(--vscode-editorHoverWidget-border);
	border-bottom: 1px solid var(--vscode-editorHoverWidget-border);
}
.workbench-hover-container:not(:focus-within).locked .workbench-hover-pointer:after {
	width: 4px;
	height: 4px;
	border-right-width: 2px;
	border-bottom-width: 2px;
}
.workbench-hover-container:focus-within .workbench-hover-pointer:after {
	border-right: 1px solid var(--vscode-focusBorder);
	border-bottom: 1px solid var(--vscode-focusBorder);
}

.workbench-hover-pointer.left   { left: -3px; }
.workbench-hover-pointer.right  { right: 3px; }
.workbench-hover-pointer.top    { top: -3px; }
.workbench-hover-pointer.bottom { bottom: 3px; }

.workbench-hover-pointer.left:after {
	transform: rotate(135deg);
}

.workbench-hover-pointer.right:after {
	transform: rotate(315deg);
}

.workbench-hover-pointer.top:after {
	transform: rotate(225deg);
}

.workbench-hover-pointer.bottom:after {
	transform: rotate(45deg);
}

.monaco-hover.workbench-hover a {
	color: var(--vscode-textLink-foreground);
}

.monaco-hover.workbench-hover a:focus {
	outline: 1px solid;
	outline-offset: -1px;
	text-decoration: underline;
	outline-color: var(--vscode-focusBorder);
}

.monaco-hover.workbench-hover a.codicon:focus,
.monaco-hover.workbench-hover a.monaco-button:focus {
	text-decoration: none;
}

.monaco-hover.workbench-hover a:hover,
.monaco-hover.workbench-hover a:active {
	color: var(--vscode-textLink-activeForeground);
}

.monaco-hover.workbench-hover code {
	background: var(--vscode-textCodeBlock-background);
}

.monaco-hover.workbench-hover .hover-row .actions {
	background: var(--vscode-editorHoverWidget-statusBarBackground);
}

.monaco-hover.workbench-hover.right-aligned {
	/* The context view service wraps strangely when it's right up against the edge without this */
	left: 1px;
}

.monaco-hover.workbench-hover.right-aligned .hover-row.status-bar .actions {
	flex-direction: row-reverse;
}

.monaco-hover.workbench-hover.right-aligned .hover-row.status-bar .actions .action-container {
	margin-right: 0;
	margin-left: 16px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/hover/browser/hover.ts]---
Location: vscode-main/src/vs/platform/hover/browser/hover.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../instantiation/common/instantiation.js';
import { Disposable, DisposableStore } from '../../../base/common/lifecycle.js';
import { IHoverDelegate, IHoverDelegateOptions } from '../../../base/browser/ui/hover/hoverDelegate.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { addStandardDisposableListener, isHTMLElement } from '../../../base/browser/dom.js';
import { KeyCode } from '../../../base/common/keyCodes.js';
import type { IHoverDelegate2, IHoverOptions, IHoverWidget, IManagedHoverContentOrFactory } from '../../../base/browser/ui/hover/hover.js';

export const IHoverService = createDecorator<IHoverService>('hoverService');

export interface IHoverService extends IHoverDelegate2 {
	readonly _serviceBrand: undefined;
}

export interface IHoverDelayOptions {
	readonly instantHover?: boolean;
	readonly dynamicDelay?: (content?: IManagedHoverContentOrFactory) => number | undefined;
}

export class WorkbenchHoverDelegate extends Disposable implements IHoverDelegate {

	private lastHoverHideTime = 0;
	private timeLimit = 200;

	private _delay: number;
	get delay(): number | ((content: IManagedHoverContentOrFactory) => number) {
		if (this.isInstantlyHovering()) {
			return 0; // show instantly when a hover was recently shown
		}

		if (this.hoverOptions?.dynamicDelay) {
			return content => this.hoverOptions?.dynamicDelay?.(content) ?? this._delay;
		}

		return this._delay;
	}

	private readonly hoverDisposables = this._register(new DisposableStore());

	constructor(
		public readonly placement: 'mouse' | 'element',
		private readonly hoverOptions: IHoverDelayOptions | undefined,
		private overrideOptions: Partial<IHoverOptions> | ((options: IHoverDelegateOptions, focus?: boolean) => Partial<IHoverOptions>) = {},
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IHoverService private readonly hoverService: IHoverService,
	) {
		super();

		this._delay = this.configurationService.getValue<number>('workbench.hover.delay');
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('workbench.hover.delay')) {
				this._delay = this.configurationService.getValue<number>('workbench.hover.delay');
			}
		}));
	}

	showHover(options: IHoverDelegateOptions, focus?: boolean): IHoverWidget | undefined {
		const overrideOptions = typeof this.overrideOptions === 'function' ? this.overrideOptions(options, focus) : this.overrideOptions;

		// close hover on escape
		this.hoverDisposables.clear();
		const targets = isHTMLElement(options.target) ? [options.target] : options.target.targetElements;
		for (const target of targets) {
			this.hoverDisposables.add(addStandardDisposableListener(target, 'keydown', (e) => {
				if (e.equals(KeyCode.Escape)) {
					this.hoverService.hideHover();
				}
			}));
		}

		const id = isHTMLElement(options.content)
			? undefined
			: typeof options.content === 'string'
				? options.content.toString()
				: options.content.value;

		return this.hoverService.showInstantHover({
			...options,
			...overrideOptions,
			persistence: {
				hideOnKeyDown: true,
				...overrideOptions.persistence
			},
			id,
			appearance: {
				...options.appearance,
				compact: true,
				skipFadeInAnimation: this.isInstantlyHovering(),
				...overrideOptions.appearance
			}
		}, focus);
	}

	private isInstantlyHovering(): boolean {
		return !!this.hoverOptions?.instantHover && Date.now() - this.lastHoverHideTime < this.timeLimit;
	}

	setInstantHoverTimeLimit(timeLimit: number): void {
		if (!this.hoverOptions?.instantHover) {
			throw new Error('Instant hover is not enabled');
		}
		this.timeLimit = timeLimit;
	}

	onDidHideHover(): void {
		this.hoverDisposables.clear();
		if (this.hoverOptions?.instantHover) {
			this.lastHoverHideTime = Date.now();
		}
	}
}

// TODO@benibenj remove this, only temp fix for contextviews
export const nativeHoverDelegate: IHoverDelegate = {
	showHover: function (): IHoverWidget | undefined {
		throw new Error('Native hover function not implemented.');
	},
	delay: 0,
	showNativeHover: true
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/hover/browser/hoverService.ts]---
Location: vscode-main/src/vs/platform/hover/browser/hoverService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from '../../instantiation/common/extensions.js';
import { registerThemingParticipant } from '../../theme/common/themeService.js';
import { editorHoverBorder } from '../../theme/common/colorRegistry.js';
import { IHoverService } from './hover.js';
import { IContextMenuService } from '../../contextview/browser/contextView.js';
import { IInstantiationService } from '../../instantiation/common/instantiation.js';
import { HoverWidget } from './hoverWidget.js';
import { IContextViewProvider, IDelegate } from '../../../base/browser/ui/contextview/contextview.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { addDisposableListener, EventType, getActiveElement, isAncestorOfActiveElement, isAncestor, getWindow, isHTMLElement, isEditableElement } from '../../../base/browser/dom.js';
import { IKeybindingService } from '../../keybinding/common/keybinding.js';
import { StandardKeyboardEvent } from '../../../base/browser/keyboardEvent.js';
import { ResultKind } from '../../keybinding/common/keybindingResolver.js';
import { IAccessibilityService } from '../../accessibility/common/accessibility.js';
import { ILayoutService } from '../../layout/browser/layoutService.js';
import { mainWindow } from '../../../base/browser/window.js';
import { ContextViewHandler } from '../../contextview/browser/contextViewService.js';
import { HoverStyle, isManagedHoverTooltipMarkdownString, type IHoverLifecycleOptions, type IHoverOptions, type IHoverTarget, type IHoverWidget, type IManagedHover, type IManagedHoverContentOrFactory, type IManagedHoverOptions } from '../../../base/browser/ui/hover/hover.js';
import type { IHoverDelegate, IHoverDelegateTarget } from '../../../base/browser/ui/hover/hoverDelegate.js';
import { ManagedHoverWidget } from './updatableHoverWidget.js';
import { timeout, TimeoutTimer } from '../../../base/common/async.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { isNumber, isString } from '../../../base/common/types.js';
import { KeyChord, KeyCode, KeyMod } from '../../../base/common/keyCodes.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../keybinding/common/keybindingsRegistry.js';
import { IMarkdownString } from '../../../base/common/htmlContent.js';
import { stripIcons } from '../../../base/common/iconLabels.js';

export class HoverService extends Disposable implements IHoverService {
	declare readonly _serviceBrand: undefined;

	private _contextViewHandler: IContextViewProvider;
	private _currentHoverOptions: IHoverOptions | undefined;
	private _currentHover: HoverWidget | undefined;
	private _currentDelayedHover: HoverWidget | undefined;
	private _currentDelayedHoverWasShown: boolean = false;
	private _currentDelayedHoverGroupId: number | string | undefined;
	private _lastHoverOptions: IHoverOptions | undefined;

	private _lastFocusedElementBeforeOpen: HTMLElement | undefined;

	private readonly _delayedHovers = new Map<HTMLElement, { show: (focus: boolean) => void }>();
	private readonly _managedHovers = new Map<HTMLElement, IManagedHover>();

	constructor(
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@ILayoutService private readonly _layoutService: ILayoutService,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService
	) {
		super();

		this._register(contextMenuService.onDidShowContextMenu(() => this.hideHover()));
		this._contextViewHandler = this._register(new ContextViewHandler(this._layoutService));

		this._register(KeybindingsRegistry.registerCommandAndKeybindingRule({
			id: 'workbench.action.showHover',
			weight: KeybindingWeight.EditorCore,
			primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyI),
			handler: () => { this._showAndFocusHoverForActiveElement(); },
		}));
	}

	showInstantHover(options: IHoverOptions, focus?: boolean, skipLastFocusedUpdate?: boolean, dontShow?: boolean): IHoverWidget | undefined {
		const hover = this._createHover(options, skipLastFocusedUpdate);
		if (!hover) {
			return undefined;
		}
		this._showHover(hover, options, focus);
		return hover;
	}

	showDelayedHover(
		options: IHoverOptions,
		lifecycleOptions: Pick<IHoverLifecycleOptions, 'groupId'>,
	): IHoverWidget | undefined {
		// Set `id` to default if it's undefined
		if (options.id === undefined) {
			options.id = getHoverIdFromContent(options.content);
		}

		if (!this._currentDelayedHover || this._currentDelayedHoverWasShown) {
			// Current hover is locked, reject
			if (this._currentHover?.isLocked) {
				return undefined;
			}

			// Identity is the same, return current hover
			if (getHoverOptionsIdentity(this._currentHoverOptions) === getHoverOptionsIdentity(options)) {
				return this._currentHover;
			}

			// Check group identity, if it's the same skip the delay and show the hover immediately
			if (this._currentHover && !this._currentHover.isDisposed && this._currentDelayedHoverGroupId !== undefined && this._currentDelayedHoverGroupId === lifecycleOptions?.groupId) {
				return this.showInstantHover({
					...options,
					appearance: {
						...options.appearance,
						skipFadeInAnimation: true
					}
				});
			}
		} else if (this._currentDelayedHover && getHoverOptionsIdentity(this._currentHoverOptions) === getHoverOptionsIdentity(options)) {
			// If the hover is the same but timeout is not finished yet, return the current hover
			return this._currentDelayedHover;
		}

		const hover = this._createHover(options, undefined);
		if (!hover) {
			this._currentDelayedHover = undefined;
			this._currentDelayedHoverWasShown = false;
			this._currentDelayedHoverGroupId = undefined;
			return undefined;
		}

		this._currentDelayedHover = hover;
		this._currentDelayedHoverWasShown = false;
		this._currentDelayedHoverGroupId = lifecycleOptions?.groupId;

		timeout(this._configurationService.getValue<number>('workbench.hover.delay')).then(() => {
			if (hover && !hover.isDisposed) {
				this._currentDelayedHoverWasShown = true;
				this._showHover(hover, options);
			}
		});

		return hover;
	}

	setupDelayedHover(
		target: HTMLElement,
		options: (() => Omit<IHoverOptions, 'target'>) | Omit<IHoverOptions, 'target'>,
		lifecycleOptions?: IHoverLifecycleOptions,
	): IDisposable {
		const resolveHoverOptions = (e?: MouseEvent) => {
			const resolved: IHoverOptions = {
				...typeof options === 'function' ? options() : options,
				target
			};
			if (resolved.style === HoverStyle.Mouse && e) {
				resolved.target = resolveMouseStyleHoverTarget(target, e);
			}
			return resolved;
		};
		return this._setupDelayedHover(target, resolveHoverOptions, lifecycleOptions);
	}

	setupDelayedHoverAtMouse(
		target: HTMLElement,
		options: (() => Omit<IHoverOptions, 'target' | 'position'>) | Omit<IHoverOptions, 'target' | 'position'>,
		lifecycleOptions?: IHoverLifecycleOptions,
	): IDisposable {
		const resolveHoverOptions = (e?: MouseEvent) => ({
			...typeof options === 'function' ? options() : options,
			target: e ? resolveMouseStyleHoverTarget(target, e) : target
		} satisfies IHoverOptions);
		return this._setupDelayedHover(target, resolveHoverOptions, lifecycleOptions);
	}

	private _setupDelayedHover(
		target: HTMLElement,
		resolveHoverOptions: ((e?: MouseEvent) => IHoverOptions),
		lifecycleOptions?: IHoverLifecycleOptions,
	) {
		const store = new DisposableStore();
		store.add(addDisposableListener(target, EventType.MOUSE_OVER, e => {
			this.showDelayedHover(resolveHoverOptions(e), {
				groupId: lifecycleOptions?.groupId
			});
		}));
		if (lifecycleOptions?.setupKeyboardEvents) {
			store.add(addDisposableListener(target, EventType.KEY_DOWN, e => {
				const evt = new StandardKeyboardEvent(e);
				if (evt.equals(KeyCode.Space) || evt.equals(KeyCode.Enter)) {
					this.showInstantHover(resolveHoverOptions(), true);
				}
			}));
		}

		this._delayedHovers.set(target, { show: (focus: boolean) => { this.showInstantHover(resolveHoverOptions(), focus); } });
		store.add(toDisposable(() => this._delayedHovers.delete(target)));

		return store;
	}

	private _createHover(options: IHoverOptions, skipLastFocusedUpdate?: boolean): HoverWidget | undefined {
		this._currentDelayedHover = undefined;

		if (options.content === '') {
			return undefined;
		}

		if (this._currentHover?.isLocked) {
			return undefined;
		}

		// Set `id` to default if it's undefined
		if (options.id === undefined) {
			options.id = getHoverIdFromContent(options.content);
		}

		if (getHoverOptionsIdentity(this._currentHoverOptions) === getHoverOptionsIdentity(options)) {
			return undefined;
		}
		this._currentHoverOptions = options;
		this._lastHoverOptions = options;
		const trapFocus = options.trapFocus || this._accessibilityService.isScreenReaderOptimized();
		const activeElement = getActiveElement();
		// HACK, remove this check when #189076 is fixed
		if (!skipLastFocusedUpdate) {
			if (trapFocus && activeElement) {
				if (!activeElement.classList.contains('monaco-hover')) {
					this._lastFocusedElementBeforeOpen = activeElement as HTMLElement;
				}
			} else {
				this._lastFocusedElementBeforeOpen = undefined;
			}
		}

		const hoverDisposables = new DisposableStore();
		const hover = this._instantiationService.createInstance(HoverWidget, options);
		if (options.persistence?.sticky) {
			hover.isLocked = true;
		}

		// Adjust target position when a mouse event is provided as the hover position
		if (options.position?.hoverPosition && !isNumber(options.position.hoverPosition)) {
			options.target = {
				targetElements: isHTMLElement(options.target) ? [options.target] : options.target.targetElements,
				x: options.position.hoverPosition.x + 10
			};
		}

		hover.onDispose(() => {
			const hoverWasFocused = this._currentHover?.domNode && isAncestorOfActiveElement(this._currentHover.domNode);
			if (hoverWasFocused) {
				// Required to handle cases such as closing the hover with the escape key
				this._lastFocusedElementBeforeOpen?.focus();
			}

			// Only clear the current options if it's the current hover, the current options help
			// reduce flickering when the same hover is shown multiple times
			if (getHoverOptionsIdentity(this._currentHoverOptions) === getHoverOptionsIdentity(options)) {
				this.doHideHover();
			}
			hoverDisposables.dispose();
		}, undefined, hoverDisposables);
		// Set the container explicitly to enable aux window support
		if (!options.container) {
			const targetElement = isHTMLElement(options.target) ? options.target : options.target.targetElements[0];
			options.container = this._layoutService.getContainer(getWindow(targetElement));
		}

		hover.onRequestLayout(() => this._contextViewHandler.layout(), undefined, hoverDisposables);
		if (options.persistence?.sticky) {
			hoverDisposables.add(addDisposableListener(getWindow(options.container).document, EventType.MOUSE_DOWN, e => {
				if (!isAncestor(e.target as HTMLElement, hover.domNode)) {
					this.doHideHover();
				}
			}));
		} else {
			if ('targetElements' in options.target) {
				for (const element of options.target.targetElements) {
					hoverDisposables.add(addDisposableListener(element, EventType.CLICK, () => this.hideHover()));
				}
			} else {
				hoverDisposables.add(addDisposableListener(options.target, EventType.CLICK, () => this.hideHover()));
			}
			const focusedElement = getActiveElement();
			if (focusedElement) {
				const focusedElementDocument = getWindow(focusedElement).document;
				hoverDisposables.add(addDisposableListener(focusedElement, EventType.KEY_DOWN, e => this._keyDown(e, hover, !!options.persistence?.hideOnKeyDown)));
				hoverDisposables.add(addDisposableListener(focusedElementDocument, EventType.KEY_DOWN, e => this._keyDown(e, hover, !!options.persistence?.hideOnKeyDown)));
				hoverDisposables.add(addDisposableListener(focusedElement, EventType.KEY_UP, e => this._keyUp(e, hover)));
				hoverDisposables.add(addDisposableListener(focusedElementDocument, EventType.KEY_UP, e => this._keyUp(e, hover)));
			}
		}

		if ('IntersectionObserver' in mainWindow) {
			const observer = new IntersectionObserver(e => this._intersectionChange(e, hover), { threshold: 0 });
			const firstTargetElement = 'targetElements' in options.target ? options.target.targetElements[0] : options.target;
			observer.observe(firstTargetElement);
			hoverDisposables.add(toDisposable(() => observer.disconnect()));
		}

		this._currentHover = hover;

		return hover;
	}

	private _showHover(hover: HoverWidget, options: IHoverOptions, focus?: boolean) {
		this._contextViewHandler.showContextView(
			new HoverContextViewDelegate(hover, focus),
			options.container
		);
	}

	hideHover(force?: boolean): void {
		if ((!force && this._currentHover?.isLocked) || !this._currentHoverOptions) {
			return;
		}
		this.doHideHover();
	}

	private doHideHover(): void {
		this._currentHover = undefined;
		this._currentHoverOptions = undefined;
		this._contextViewHandler.hideContextView();
	}

	private _intersectionChange(entries: IntersectionObserverEntry[], hover: IDisposable): void {
		const entry = entries[entries.length - 1];
		if (!entry.isIntersecting) {
			hover.dispose();
		}
	}

	showAndFocusLastHover(): void {
		if (!this._lastHoverOptions) {
			return;
		}
		this.showInstantHover(this._lastHoverOptions, true, true);
	}

	private _showAndFocusHoverForActiveElement(): void {
		// TODO: if hover is visible, focus it to avoid flickering

		let activeElement = getActiveElement() as HTMLElement | null;
		while (activeElement) {
			const hover = this._delayedHovers.get(activeElement) ?? this._managedHovers.get(activeElement);
			if (hover) {
				hover.show(true);
				return;
			}

			activeElement = activeElement.parentElement;
		}
	}

	private _keyDown(e: KeyboardEvent, hover: HoverWidget, hideOnKeyDown: boolean) {
		if (e.key === 'Alt') {
			hover.isLocked = true;
			return;
		}
		const event = new StandardKeyboardEvent(e);
		const keybinding = this._keybindingService.resolveKeyboardEvent(event);
		if (keybinding.getSingleModifierDispatchChords().some(value => !!value) || this._keybindingService.softDispatch(event, event.target).kind !== ResultKind.NoMatchingKb) {
			return;
		}
		if (hideOnKeyDown && (!this._currentHoverOptions?.trapFocus || e.key !== 'Tab')) {
			this.hideHover();
			this._lastFocusedElementBeforeOpen?.focus();
		}
	}

	private _keyUp(e: KeyboardEvent, hover: HoverWidget) {
		if (e.key === 'Alt') {
			hover.isLocked = false;
			// Hide if alt is released while the mouse is not over hover/target
			if (!hover.isMouseIn) {
				this.hideHover();
				this._lastFocusedElementBeforeOpen?.focus();
			}
		}
	}

	// TODO: Investigate performance of this function. There seems to be a lot of content created
	//       and thrown away on start up
	setupManagedHover(hoverDelegate: IHoverDelegate, targetElement: HTMLElement, content: IManagedHoverContentOrFactory, options?: IManagedHoverOptions | undefined): IManagedHover {
		if (hoverDelegate.showNativeHover) {
			return setupNativeHover(targetElement, content);
		}

		targetElement.setAttribute('custom-hover', 'true');

		if (targetElement.title !== '') {
			console.warn('HTML element already has a title attribute, which will conflict with the custom hover. Please remove the title attribute.');
			console.trace('Stack trace:', targetElement.title);
			targetElement.title = '';
		}

		let hoverPreparation: IDisposable | undefined;
		let hoverWidget: ManagedHoverWidget | undefined;

		const hideHover = (disposeWidget: boolean, disposePreparation: boolean) => {
			const hadHover = hoverWidget !== undefined;
			if (disposeWidget) {
				hoverWidget?.dispose();
				hoverWidget = undefined;
			}
			if (disposePreparation) {
				hoverPreparation?.dispose();
				hoverPreparation = undefined;
			}
			if (hadHover) {
				hoverDelegate.onDidHideHover?.();
				hoverWidget = undefined;
			}
		};

		const triggerShowHover = (delay: number, focus?: boolean, target?: IHoverDelegateTarget, trapFocus?: boolean) => {
			return new TimeoutTimer(async () => {
				if (!hoverWidget || hoverWidget.isDisposed) {
					hoverWidget = new ManagedHoverWidget(hoverDelegate, target || targetElement, delay > 0);
					await hoverWidget.update(typeof content === 'function' ? content() : content, focus, { ...options, trapFocus });
				}
			}, delay);
		};

		const store = new DisposableStore();
		let isMouseDown = false;
		store.add(addDisposableListener(targetElement, EventType.MOUSE_DOWN, () => {
			isMouseDown = true;
			hideHover(true, true);
		}, true));
		store.add(addDisposableListener(targetElement, EventType.MOUSE_UP, () => {
			isMouseDown = false;
		}, true));
		store.add(addDisposableListener(targetElement, EventType.MOUSE_LEAVE, (e: MouseEvent) => {
			isMouseDown = false;
			// HACK: `fromElement` is a non-standard property. Not sure what to replace it with,
			// `relatedTarget` is NOT equivalent.
			interface MouseEventWithFrom extends MouseEvent {
				fromElement: Element | null;
			}
			hideHover(false, (e as MouseEventWithFrom).fromElement === targetElement);
		}, true));
		store.add(addDisposableListener(targetElement, EventType.MOUSE_OVER, (e: MouseEvent) => {
			if (hoverPreparation) {
				return;
			}

			const mouseOverStore: DisposableStore = new DisposableStore();

			const target: IHoverDelegateTarget = {
				targetElements: [targetElement],
				dispose: () => { }
			};
			if (hoverDelegate.placement === undefined || hoverDelegate.placement === 'mouse') {
				// track the mouse position
				const onMouseMove = (e: MouseEvent) => {
					target.x = e.x + 10;
					if (!eventIsRelatedToTarget(e, targetElement)) {
						hideHover(true, true);
					}
				};
				mouseOverStore.add(addDisposableListener(targetElement, EventType.MOUSE_MOVE, onMouseMove, true));
			}

			hoverPreparation = mouseOverStore;

			if (!eventIsRelatedToTarget(e, targetElement)) {
				return; // Do not show hover when the mouse is over another hover target
			}

			mouseOverStore.add(triggerShowHover(typeof hoverDelegate.delay === 'function' ? hoverDelegate.delay(content) : hoverDelegate.delay, false, target));
		}, true));

		const onFocus = (e: FocusEvent) => {
			if (isMouseDown || hoverPreparation) {
				return;
			}
			if (!eventIsRelatedToTarget(e, targetElement)) {
				return; // Do not show hover when the focus is on another hover target
			}

			const target: IHoverDelegateTarget = {
				targetElements: [targetElement],
				dispose: () => { }
			};
			const toDispose: DisposableStore = new DisposableStore();
			const onBlur = () => hideHover(true, true);
			toDispose.add(addDisposableListener(targetElement, EventType.BLUR, onBlur, true));
			toDispose.add(triggerShowHover(typeof hoverDelegate.delay === 'function' ? hoverDelegate.delay(content) : hoverDelegate.delay, false, target));
			hoverPreparation = toDispose;
		};

		// Do not show hover when focusing an input or textarea
		if (!isEditableElement(targetElement)) {
			store.add(addDisposableListener(targetElement, EventType.FOCUS, onFocus, true));
		}

		const hover: IManagedHover = {
			show: focus => {
				hideHover(false, true); // terminate a ongoing mouse over preparation
				triggerShowHover(0, focus, undefined, focus); // show hover immediately
			},
			hide: () => {
				hideHover(true, true);
			},
			update: async (newContent, hoverOptions) => {
				content = newContent;
				await hoverWidget?.update(content, undefined, hoverOptions);
			},
			dispose: () => {
				this._managedHovers.delete(targetElement);
				store.dispose();
				hideHover(true, true);
			}
		};
		this._managedHovers.set(targetElement, hover);
		return hover;
	}

	showManagedHover(target: HTMLElement): void {
		const hover = this._managedHovers.get(target);
		if (hover) {
			hover.show(true);
		}
	}

	public override dispose(): void {
		this._managedHovers.forEach(hover => hover.dispose());
		super.dispose();
	}
}

function getHoverOptionsIdentity(options: IHoverOptions | undefined): IHoverOptions | number | string | undefined {
	if (options === undefined) {
		return undefined;
	}
	return options?.id ?? options;
}

function getHoverIdFromContent(content: string | HTMLElement | IMarkdownString): string | undefined {
	if (isHTMLElement(content)) {
		return undefined;
	}
	if (typeof content === 'string') {
		return content.toString();
	}
	return content.value;
}

function getStringContent(contentOrFactory: IManagedHoverContentOrFactory): string | undefined {
	const content = typeof contentOrFactory === 'function' ? contentOrFactory() : contentOrFactory;
	if (isString(content)) {
		// Icons don't render in the native hover so we strip them out
		return stripIcons(content);
	}
	if (isManagedHoverTooltipMarkdownString(content)) {
		return content.markdownNotSupportedFallback;
	}
	return undefined;
}

function setupNativeHover(targetElement: HTMLElement, content: IManagedHoverContentOrFactory): IManagedHover {
	function updateTitle(title: string | undefined) {
		if (title) {
			targetElement.setAttribute('title', title);
		} else {
			targetElement.removeAttribute('title');
		}
	}

	updateTitle(getStringContent(content));
	return {
		update: (content) => updateTitle(getStringContent(content)),
		show: () => { },
		hide: () => { },
		dispose: () => updateTitle(undefined),
	};
}

class HoverContextViewDelegate implements IDelegate {

	// Render over all other context views
	public readonly layer = 1;

	get anchorPosition() {
		return this._hover.anchor;
	}

	constructor(
		private readonly _hover: HoverWidget,
		private readonly _focus: boolean = false
	) {
	}

	render(container: HTMLElement) {
		this._hover.render(container);
		if (this._focus) {
			this._hover.focus();
		}
		return this._hover;
	}

	getAnchor() {
		return {
			x: this._hover.x,
			y: this._hover.y
		};
	}

	layout() {
		this._hover.layout();
	}
}

function eventIsRelatedToTarget(event: UIEvent, target: HTMLElement): boolean {
	return isHTMLElement(event.target) && getHoverTargetElement(event.target, target) === target;
}

function getHoverTargetElement(element: HTMLElement, stopElement?: HTMLElement): HTMLElement {
	stopElement = stopElement ?? getWindow(element).document.body;
	while (!element.hasAttribute('custom-hover') && element !== stopElement) {
		element = element.parentElement!;
	}
	return element;
}

function resolveMouseStyleHoverTarget(target: HTMLElement, e: MouseEvent): IHoverTarget {
	return {
		targetElements: [target],
		x: e.x + 10
	};
}

registerSingleton(IHoverService, HoverService, InstantiationType.Delayed);

registerThemingParticipant((theme, collector) => {
	const hoverBorder = theme.getColor(editorHoverBorder);
	if (hoverBorder) {
		collector.addRule(`.monaco-hover.workbench-hover .hover-row:not(:first-child):not(:empty) { border-top: 1px solid ${hoverBorder.transparent(0.5)}; }`);
		collector.addRule(`.monaco-hover.workbench-hover hr { border-top: 1px solid ${hoverBorder.transparent(0.5)}; }`);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/hover/browser/hoverWidget.ts]---
Location: vscode-main/src/vs/platform/hover/browser/hoverWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './hover.css';
import { DisposableStore, MutableDisposable } from '../../../base/common/lifecycle.js';
import { Event, Emitter } from '../../../base/common/event.js';
import * as dom from '../../../base/browser/dom.js';
import { IKeybindingService } from '../../keybinding/common/keybinding.js';
import { KeyCode } from '../../../base/common/keyCodes.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { HoverAction, HoverPosition, HoverWidget as BaseHoverWidget, getHoverAccessibleViewHint } from '../../../base/browser/ui/hover/hoverWidget.js';
import { Widget } from '../../../base/browser/ui/widget.js';
import { AnchorPosition } from '../../../base/browser/ui/contextview/contextview.js';
import { IMarkdownRendererService } from '../../markdown/browser/markdownRenderer.js';
import { isMarkdownString } from '../../../base/common/htmlContent.js';
import { localize } from '../../../nls.js';
import { isMacintosh } from '../../../base/common/platform.js';
import { IAccessibilityService } from '../../accessibility/common/accessibility.js';
import { status } from '../../../base/browser/ui/aria/aria.js';
import { HoverStyle, type IHoverOptions, type IHoverTarget, type IHoverWidget } from '../../../base/browser/ui/hover/hover.js';
import { TimeoutTimer } from '../../../base/common/async.js';
import { isNumber } from '../../../base/common/types.js';

const $ = dom.$;
type TargetRect = {
	left: number;
	right: number;
	top: number;
	bottom: number;
	width: number;
	height: number;
	center: { x: number; y: number };
};

const enum Constants {
	PointerSize = 3,
	HoverBorderWidth = 2,
	HoverWindowEdgeMargin = 2,
}

export class HoverWidget extends Widget implements IHoverWidget {
	private readonly _messageListeners = new DisposableStore();
	private readonly _lockMouseTracker: CompositeMouseTracker;

	private readonly _hover: BaseHoverWidget;
	private readonly _hoverPointer: HTMLElement | undefined;
	private readonly _hoverContainer: HTMLElement;
	private readonly _target: IHoverTarget;
	private readonly _linkHandler: ((url: string) => void) | undefined;

	private _isDisposed: boolean = false;
	private _hoverPosition: HoverPosition;
	private _forcePosition: boolean = false;
	private _x: number = 0;
	private _y: number = 0;
	private _isLocked: boolean = false;
	private _enableFocusTraps: boolean = false;
	private _addedFocusTrap: boolean = false;
	private _maxHeightRatioRelativeToWindow: number = 0.5;

	private get _targetWindow(): Window {
		return dom.getWindow(this._target.targetElements[0]);
	}
	private get _targetDocumentElement(): HTMLElement {
		return dom.getWindow(this._target.targetElements[0]).document.documentElement;
	}

	get isDisposed(): boolean { return this._isDisposed; }
	get isMouseIn(): boolean { return this._lockMouseTracker.isMouseIn; }
	get domNode(): HTMLElement { return this._hover.containerDomNode; }

	private readonly _onDispose = this._register(new Emitter<void>());
	get onDispose(): Event<void> { return this._onDispose.event; }
	private readonly _onRequestLayout = this._register(new Emitter<void>());
	get onRequestLayout(): Event<void> { return this._onRequestLayout.event; }

	get anchor(): AnchorPosition { return this._hoverPosition === HoverPosition.BELOW ? AnchorPosition.BELOW : AnchorPosition.ABOVE; }
	get x(): number { return this._x; }
	get y(): number { return this._y; }

	/**
	 * Whether the hover is "locked" by holding the alt/option key. When locked, the hover will not
	 * hide and can be hovered regardless of whether the `hideOnHover` hover option is set.
	 */
	get isLocked(): boolean { return this._isLocked; }
	set isLocked(value: boolean) {
		if (this._isLocked === value) {
			return;
		}
		this._isLocked = value;
		this._hoverContainer.classList.toggle('locked', this._isLocked);
	}

	constructor(
		options: IHoverOptions,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IMarkdownRendererService private readonly _markdownRenderer: IMarkdownRendererService,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService
	) {
		super();

		this._linkHandler = options.linkHandler;

		this._target = 'targetElements' in options.target ? options.target : new ElementHoverTarget(options.target);

		if (options.style) {
			switch (options.style) {
				case HoverStyle.Pointer: {
					options.appearance ??= {};
					options.appearance.compact ??= true;
					options.appearance.showPointer ??= true;
					break;
				}
				case HoverStyle.Mouse: {
					options.appearance ??= {};
					options.appearance.compact ??= true;
					break;
				}
			}
		}

		this._hoverPointer = options.appearance?.showPointer ? $('div.workbench-hover-pointer') : undefined;
		this._hover = this._register(new BaseHoverWidget(!options.appearance?.skipFadeInAnimation));
		this._hover.containerDomNode.classList.add('workbench-hover');
		if (options.appearance?.compact) {
			this._hover.containerDomNode.classList.add('workbench-hover', 'compact');
		}
		if (options.additionalClasses) {
			this._hover.containerDomNode.classList.add(...options.additionalClasses);
		}
		if (options.position?.forcePosition) {
			this._forcePosition = true;
		}
		if (options.trapFocus) {
			this._enableFocusTraps = true;
		}

		const maxHeightRatio = options.appearance?.maxHeightRatio;
		if (maxHeightRatio !== undefined && maxHeightRatio > 0 && maxHeightRatio <= 1) {
			this._maxHeightRatioRelativeToWindow = maxHeightRatio;
		}

		// Default to position above when the position is unspecified or a mouse event
		this._hoverPosition = options.position?.hoverPosition === undefined
			? HoverPosition.ABOVE
			: isNumber(options.position.hoverPosition)
				? options.position.hoverPosition
				: HoverPosition.BELOW;

		// Don't allow mousedown out of the widget, otherwise preventDefault will call and text will
		// not be selected.
		this.onmousedown(this._hover.containerDomNode, e => e.stopPropagation());

		// Hide hover on escape
		this.onkeydown(this._hover.containerDomNode, e => {
			if (e.equals(KeyCode.Escape)) {
				this.dispose();
			}
		});

		// Hide when the window loses focus
		this._register(dom.addDisposableListener(this._targetWindow, 'blur', () => this.dispose()));

		const rowElement = $('div.hover-row.markdown-hover');
		const contentsElement = $('div.hover-contents');
		if (typeof options.content === 'string') {
			contentsElement.textContent = options.content;
			contentsElement.style.whiteSpace = 'pre-wrap';

		} else if (dom.isHTMLElement(options.content)) {
			contentsElement.appendChild(options.content);
			contentsElement.classList.add('html-hover-contents');

		} else {
			const markdown = options.content;

			const { element } = this._register(this._markdownRenderer.render(markdown, {
				actionHandler: this._linkHandler,
				asyncRenderCallback: () => {
					contentsElement.classList.add('code-hover-contents');
					this.layout();
					// This changes the dimensions of the hover so trigger a layout
					this._onRequestLayout.fire();
				}
			}));
			contentsElement.appendChild(element);
		}
		rowElement.appendChild(contentsElement);
		this._hover.contentsDomNode.appendChild(rowElement);

		if (options.actions && options.actions.length > 0) {
			const statusBarElement = $('div.hover-row.status-bar');
			const actionsElement = $('div.actions');
			options.actions.forEach(action => {
				const keybinding = this._keybindingService.lookupKeybinding(action.commandId);
				const keybindingLabel = keybinding ? keybinding.getLabel() : null;
				this._register(HoverAction.render(actionsElement, {
					label: action.label,
					commandId: action.commandId,
					run: e => {
						action.run(e);
						this.dispose();
					},
					iconClass: action.iconClass
				}, keybindingLabel));
			});
			statusBarElement.appendChild(actionsElement);
			this._hover.containerDomNode.appendChild(statusBarElement);
		}

		this._hoverContainer = $('div.workbench-hover-container');
		if (this._hoverPointer) {
			this._hoverContainer.appendChild(this._hoverPointer);
		}
		this._hoverContainer.appendChild(this._hover.containerDomNode);

		// Determine whether to hide on hover
		let hideOnHover: boolean;
		if (options.actions && options.actions.length > 0) {
			// If there are actions, require hover so they can be accessed
			hideOnHover = false;
		} else {
			if (options.persistence?.hideOnHover === undefined) {
				// When unset, will default to true when it's a string or when it's markdown that
				// appears to have a link using a naive check for '](' and '</a>'
				hideOnHover = typeof options.content === 'string' ||
					isMarkdownString(options.content) && !options.content.value.includes('](') && !options.content.value.includes('</a>');
			} else {
				// It's set explicitly
				hideOnHover = options.persistence.hideOnHover;
			}
		}

		// Show the hover hint if needed
		if (options.appearance?.showHoverHint) {
			const statusBarElement = $('div.hover-row.status-bar');
			const infoElement = $('div.info');
			infoElement.textContent = localize('hoverhint', 'Hold {0} key to mouse over', isMacintosh ? 'Option' : 'Alt');
			statusBarElement.appendChild(infoElement);
			this._hover.containerDomNode.appendChild(statusBarElement);
		}

		const mouseTrackerTargets = [...this._target.targetElements];
		if (!hideOnHover) {
			mouseTrackerTargets.push(this._hoverContainer);
		}
		const mouseTracker = this._register(new CompositeMouseTracker(mouseTrackerTargets));
		this._register(mouseTracker.onMouseOut(() => {
			if (!this._isLocked) {
				this.dispose();
			}
		}));

		// Setup another mouse tracker when hideOnHover is set in order to track the hover as well
		// when it is locked. This ensures the hover will hide on mouseout after alt has been
		// released to unlock the element.
		if (hideOnHover) {
			const mouseTracker2Targets = [...this._target.targetElements, this._hoverContainer];
			this._lockMouseTracker = this._register(new CompositeMouseTracker(mouseTracker2Targets));
			this._register(this._lockMouseTracker.onMouseOut(() => {
				if (!this._isLocked) {
					this.dispose();
				}
			}));
		} else {
			this._lockMouseTracker = mouseTracker;
		}
	}

	private addFocusTrap() {
		if (!this._enableFocusTraps || this._addedFocusTrap) {
			return;
		}
		this._addedFocusTrap = true;

		// Add a hover tab loop if the hover has at least one element with a valid tabIndex
		const firstContainerFocusElement = this._hover.containerDomNode;
		const lastContainerFocusElement = this.findLastFocusableChild(this._hover.containerDomNode);
		if (lastContainerFocusElement) {
			const beforeContainerFocusElement = dom.prepend(this._hoverContainer, $('div'));
			const afterContainerFocusElement = dom.append(this._hoverContainer, $('div'));
			beforeContainerFocusElement.tabIndex = 0;
			afterContainerFocusElement.tabIndex = 0;
			this._register(dom.addDisposableListener(afterContainerFocusElement, 'focus', (e) => {
				firstContainerFocusElement.focus();
				e.preventDefault();
			}));
			this._register(dom.addDisposableListener(beforeContainerFocusElement, 'focus', (e) => {
				lastContainerFocusElement.focus();
				e.preventDefault();
			}));
		}
	}

	private findLastFocusableChild(root: Node): HTMLElement | undefined {
		if (root.hasChildNodes()) {
			for (let i = 0; i < root.childNodes.length; i++) {
				const node = root.childNodes.item(root.childNodes.length - i - 1);
				if (node.nodeType === node.ELEMENT_NODE) {
					const parsedNode = node as HTMLElement;
					if (typeof parsedNode.tabIndex === 'number' && parsedNode.tabIndex >= 0) {
						return parsedNode;
					}
				}
				const recursivelyFoundElement = this.findLastFocusableChild(node);
				if (recursivelyFoundElement) {
					return recursivelyFoundElement;
				}
			}
		}
		return undefined;
	}

	public render(container: HTMLElement): void {
		container.appendChild(this._hoverContainer);
		const hoverFocused = this._hoverContainer.contains(this._hoverContainer.ownerDocument.activeElement);
		const accessibleViewHint = hoverFocused && getHoverAccessibleViewHint(this._configurationService.getValue('accessibility.verbosity.hover') === true && this._accessibilityService.isScreenReaderOptimized(), this._keybindingService.lookupKeybinding('editor.action.accessibleView')?.getAriaLabel());
		if (accessibleViewHint) {

			status(accessibleViewHint);
		}
		this.layout();
		this.addFocusTrap();
	}

	public layout() {
		this._hover.containerDomNode.classList.remove('right-aligned');
		this._hover.contentsDomNode.style.maxHeight = '';

		const getZoomAccountedBoundingClientRect = (e: HTMLElement) => {
			const zoom = dom.getDomNodeZoomLevel(e);

			const boundingRect = e.getBoundingClientRect();
			return {
				top: boundingRect.top * zoom,
				bottom: boundingRect.bottom * zoom,
				right: boundingRect.right * zoom,
				left: boundingRect.left * zoom,
			};
		};

		const targetBounds = this._target.targetElements.map(e => getZoomAccountedBoundingClientRect(e));
		const { top, right, bottom, left } = targetBounds[0];
		const width = right - left;
		const height = bottom - top;

		const targetRect: TargetRect = {
			top, right, bottom, left, width, height,
			center: {
				x: left + (width / 2),
				y: top + (height / 2)
			}
		};

		// These calls adjust the position depending on spacing.
		this.adjustHorizontalHoverPosition(targetRect);
		this.adjustVerticalHoverPosition(targetRect);
		// This call limits the maximum height of the hover.
		this.adjustHoverMaxHeight(targetRect);

		// Offset the hover position if there is a pointer so it aligns with the target element
		this._hoverContainer.style.padding = '';
		this._hoverContainer.style.margin = '';
		if (this._hoverPointer) {
			switch (this._hoverPosition) {
				case HoverPosition.RIGHT:
					targetRect.left += Constants.PointerSize;
					targetRect.right += Constants.PointerSize;
					this._hoverContainer.style.paddingLeft = `${Constants.PointerSize}px`;
					this._hoverContainer.style.marginLeft = `${-Constants.PointerSize}px`;
					break;
				case HoverPosition.LEFT:
					targetRect.left -= Constants.PointerSize;
					targetRect.right -= Constants.PointerSize;
					this._hoverContainer.style.paddingRight = `${Constants.PointerSize}px`;
					this._hoverContainer.style.marginRight = `${-Constants.PointerSize}px`;
					break;
				case HoverPosition.BELOW:
					targetRect.top += Constants.PointerSize;
					targetRect.bottom += Constants.PointerSize;
					this._hoverContainer.style.paddingTop = `${Constants.PointerSize}px`;
					this._hoverContainer.style.marginTop = `${-Constants.PointerSize}px`;
					break;
				case HoverPosition.ABOVE:
					targetRect.top -= Constants.PointerSize;
					targetRect.bottom -= Constants.PointerSize;
					this._hoverContainer.style.paddingBottom = `${Constants.PointerSize}px`;
					this._hoverContainer.style.marginBottom = `${-Constants.PointerSize}px`;
					break;
			}

			targetRect.center.x = targetRect.left + (width / 2);
			targetRect.center.y = targetRect.top + (height / 2);
		}

		this.computeXCordinate(targetRect);
		this.computeYCordinate(targetRect);

		if (this._hoverPointer) {
			// reset
			this._hoverPointer.classList.remove('top');
			this._hoverPointer.classList.remove('left');
			this._hoverPointer.classList.remove('right');
			this._hoverPointer.classList.remove('bottom');

			this.setHoverPointerPosition(targetRect);
		}
		this._hover.onContentsChanged();
	}

	private computeXCordinate(target: TargetRect): void {
		const hoverWidth = this._hover.containerDomNode.clientWidth + Constants.HoverBorderWidth;

		if (this._target.x !== undefined) {
			this._x = this._target.x;
		}

		else if (this._hoverPosition === HoverPosition.RIGHT) {
			this._x = target.right;
		}

		else if (this._hoverPosition === HoverPosition.LEFT) {
			this._x = target.left - hoverWidth;
		}

		else {
			if (this._hoverPointer) {
				this._x = target.center.x - (this._hover.containerDomNode.clientWidth / 2);
			} else {
				this._x = target.left;
			}

			// Hover is going beyond window towards right end
			if (this._x + hoverWidth >= this._targetDocumentElement.clientWidth) {
				this._hover.containerDomNode.classList.add('right-aligned');
				this._x = Math.max(this._targetDocumentElement.clientWidth - hoverWidth - Constants.HoverWindowEdgeMargin, this._targetDocumentElement.clientLeft);
			}
		}

		// Hover is going beyond window towards left end
		if (this._x < this._targetDocumentElement.clientLeft) {
			this._x = target.left + Constants.HoverWindowEdgeMargin;
		}

	}

	private computeYCordinate(target: TargetRect): void {
		if (this._target.y !== undefined) {
			this._y = this._target.y;
		}

		else if (this._hoverPosition === HoverPosition.ABOVE) {
			this._y = target.top;
		}

		else if (this._hoverPosition === HoverPosition.BELOW) {
			this._y = target.bottom - 2;
		}

		else {
			if (this._hoverPointer) {
				this._y = target.center.y + (this._hover.containerDomNode.clientHeight / 2);
			} else {
				this._y = target.bottom;
			}
		}

		// Hover on bottom is going beyond window
		if (this._y > this._targetWindow.innerHeight) {
			this._y = target.bottom;
		}
	}

	private adjustHorizontalHoverPosition(target: TargetRect): void {
		// Do not adjust horizontal hover position if x cordiante is provided
		if (this._target.x !== undefined) {
			return;
		}

		const hoverPointerOffset = (this._hoverPointer ? Constants.PointerSize : 0);

		// When force position is enabled, restrict max width
		if (this._forcePosition) {
			const padding = hoverPointerOffset + Constants.HoverBorderWidth;
			if (this._hoverPosition === HoverPosition.RIGHT) {
				this._hover.containerDomNode.style.maxWidth = `${this._targetDocumentElement.clientWidth - target.right - padding}px`;
			} else if (this._hoverPosition === HoverPosition.LEFT) {
				this._hover.containerDomNode.style.maxWidth = `${target.left - padding}px`;
			}
			return;
		}

		// Position hover on right to target
		if (this._hoverPosition === HoverPosition.RIGHT) {
			const roomOnRight = this._targetDocumentElement.clientWidth - target.right;
			// Hover on the right is going beyond window.
			if (roomOnRight < this._hover.containerDomNode.clientWidth + hoverPointerOffset) {
				const roomOnLeft = target.left;
				// There's enough room on the left, flip the hover position
				if (roomOnLeft >= this._hover.containerDomNode.clientWidth + hoverPointerOffset) {
					this._hoverPosition = HoverPosition.LEFT;
				}
				// Hover on the left would go beyond window too
				else {
					this._hoverPosition = HoverPosition.BELOW;
				}
			}
		}
		// Position hover on left to target
		else if (this._hoverPosition === HoverPosition.LEFT) {

			const roomOnLeft = target.left;
			// Hover on the left is going beyond window.
			if (roomOnLeft < this._hover.containerDomNode.clientWidth + hoverPointerOffset) {
				const roomOnRight = this._targetDocumentElement.clientWidth - target.right;
				// There's enough room on the right, flip the hover position
				if (roomOnRight >= this._hover.containerDomNode.clientWidth + hoverPointerOffset) {
					this._hoverPosition = HoverPosition.RIGHT;
				}
				// Hover on the right would go beyond window too
				else {
					this._hoverPosition = HoverPosition.BELOW;
				}
			}
			// Hover on the left is going beyond window.
			if (target.left - this._hover.containerDomNode.clientWidth - hoverPointerOffset <= this._targetDocumentElement.clientLeft) {
				this._hoverPosition = HoverPosition.RIGHT;
			}
		}
	}

	private adjustVerticalHoverPosition(target: TargetRect): void {
		// Do not adjust vertical hover position if the y coordinate is provided
		// or the position is forced
		if (this._target.y !== undefined || this._forcePosition) {
			return;
		}

		const hoverPointerOffset = (this._hoverPointer ? Constants.PointerSize : 0);

		// Position hover on top of the target
		if (this._hoverPosition === HoverPosition.ABOVE) {
			// Hover on top is going beyond window
			if (target.top - this._hover.containerDomNode.clientHeight - hoverPointerOffset < 0) {
				this._hoverPosition = HoverPosition.BELOW;
			}
		}

		// Position hover below the target
		else if (this._hoverPosition === HoverPosition.BELOW) {
			// Hover on bottom is going beyond window
			if (target.bottom + this._hover.containerDomNode.offsetHeight + hoverPointerOffset > this._targetWindow.innerHeight) {
				this._hoverPosition = HoverPosition.ABOVE;
			}
		}
	}

	private adjustHoverMaxHeight(target: TargetRect): void {
		let maxHeight = this._targetWindow.innerHeight * this._maxHeightRatioRelativeToWindow;

		// When force position is enabled, restrict max height
		if (this._forcePosition) {
			const padding = (this._hoverPointer ? Constants.PointerSize : 0) + Constants.HoverBorderWidth;
			if (this._hoverPosition === HoverPosition.ABOVE) {
				maxHeight = Math.min(maxHeight, target.top - padding);
			} else if (this._hoverPosition === HoverPosition.BELOW) {
				maxHeight = Math.min(maxHeight, this._targetWindow.innerHeight - target.bottom - padding);
			}
		}

		this._hover.containerDomNode.style.maxHeight = `${maxHeight}px`;
		if (this._hover.contentsDomNode.clientHeight < this._hover.contentsDomNode.scrollHeight) {
			// Add padding for a vertical scrollbar
			const extraRightPadding = `${this._hover.scrollbar.options.verticalScrollbarSize}px`;
			if (this._hover.contentsDomNode.style.paddingRight !== extraRightPadding) {
				this._hover.contentsDomNode.style.paddingRight = extraRightPadding;
			}
		}
	}

	private setHoverPointerPosition(target: TargetRect): void {
		if (!this._hoverPointer) {
			return;
		}

		switch (this._hoverPosition) {
			case HoverPosition.LEFT:
			case HoverPosition.RIGHT: {
				this._hoverPointer.classList.add(this._hoverPosition === HoverPosition.LEFT ? 'right' : 'left');
				const hoverHeight = this._hover.containerDomNode.clientHeight;

				// If hover is taller than target, then show the pointer at the center of target
				if (hoverHeight > target.height) {
					this._hoverPointer.style.top = `${target.center.y - (this._y - hoverHeight) - Constants.PointerSize}px`;
				}

				// Otherwise show the pointer at the center of hover
				else {
					this._hoverPointer.style.top = `${Math.round((hoverHeight / 2)) - Constants.PointerSize}px`;
				}

				break;
			}
			case HoverPosition.ABOVE:
			case HoverPosition.BELOW: {
				this._hoverPointer.classList.add(this._hoverPosition === HoverPosition.ABOVE ? 'bottom' : 'top');
				const hoverWidth = this._hover.containerDomNode.clientWidth;

				// Position pointer at the center of the hover
				let pointerLeftPosition = Math.round((hoverWidth / 2)) - Constants.PointerSize;

				// If pointer goes beyond target then position it at the center of the target
				const pointerX = this._x + pointerLeftPosition;
				if (pointerX < target.left || pointerX > target.right) {
					pointerLeftPosition = target.center.x - this._x - Constants.PointerSize;
				}

				this._hoverPointer.style.left = `${pointerLeftPosition}px`;
				break;
			}
		}
	}

	public focus() {
		this._hover.containerDomNode.focus();
	}

	public hide(): void {
		this.dispose();
	}

	public override dispose(): void {
		if (!this._isDisposed) {
			this._onDispose.fire();
			this._target.dispose?.();
			this._hoverContainer.remove();
			this._messageListeners.dispose();
			super.dispose();
		}
		this._isDisposed = true;
	}
}

class CompositeMouseTracker extends Widget {
	private _isMouseIn: boolean = true;
	private readonly _mouseTimer: MutableDisposable<TimeoutTimer> = this._register(new MutableDisposable());

	private readonly _onMouseOut = this._register(new Emitter<void>());
	get onMouseOut(): Event<void> { return this._onMouseOut.event; }

	get isMouseIn(): boolean { return this._isMouseIn; }

	/**
	 * @param _elements The target elements to track mouse in/out events on.
	 * @param _eventDebounceDelay The delay in ms to debounce the event firing. This is used to
	 * allow a short period for the mouse to move into the hover or a nearby target element. For
	 * example hovering a scroll bar will not hide the hover immediately.
	 */
	constructor(
		private _elements: HTMLElement[],
		private _eventDebounceDelay: number = 200
	) {
		super();

		for (const element of this._elements) {
			this.onmouseover(element, () => this._onTargetMouseOver());
			this.onmouseleave(element, () => this._onTargetMouseLeave());
		}
	}

	private _onTargetMouseOver(): void {
		this._isMouseIn = true;
		this._mouseTimer.clear();
	}

	private _onTargetMouseLeave(): void {
		this._isMouseIn = false;
		// Evaluate whether the mouse is still outside asynchronously such that other mouse targets
		// have the opportunity to first their mouse in event.
		this._mouseTimer.value = new TimeoutTimer(() => this._fireIfMouseOutside(), this._eventDebounceDelay);
	}

	private _fireIfMouseOutside(): void {
		if (!this._isMouseIn) {
			this._onMouseOut.fire();
		}
	}
}

class ElementHoverTarget implements IHoverTarget {
	readonly targetElements: readonly HTMLElement[];

	constructor(
		private _element: HTMLElement
	) {
		this.targetElements = [this._element];
	}

	dispose(): void {
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/hover/browser/updatableHoverWidget.ts]---
Location: vscode-main/src/vs/platform/hover/browser/updatableHoverWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isHTMLElement } from '../../../base/browser/dom.js';
import { isManagedHoverTooltipMarkdownString, type IHoverWidget, type IManagedHoverContent, type IManagedHoverOptions } from '../../../base/browser/ui/hover/hover.js';
import type { IHoverDelegate, IHoverDelegateOptions, IHoverDelegateTarget } from '../../../base/browser/ui/hover/hoverDelegate.js';
import { HoverPosition } from '../../../base/browser/ui/hover/hoverWidget.js';
import { CancellationTokenSource } from '../../../base/common/cancellation.js';
import { isMarkdownString, type IMarkdownString } from '../../../base/common/htmlContent.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { isFunction, isString } from '../../../base/common/types.js';
import { localize } from '../../../nls.js';

type IManagedHoverResolvedContent = IMarkdownString | string | HTMLElement | undefined;

export class ManagedHoverWidget implements IDisposable {

	private _hoverWidget: IHoverWidget | undefined;
	private _cancellationTokenSource: CancellationTokenSource | undefined;

	constructor(private hoverDelegate: IHoverDelegate, private target: IHoverDelegateTarget | HTMLElement, private fadeInAnimation: boolean) { }

	onDidHide() {
		if (this._cancellationTokenSource) {
			// there's an computation ongoing, cancel it
			this._cancellationTokenSource.dispose(true);
			this._cancellationTokenSource = undefined;
		}
	}

	async update(content: IManagedHoverContent, focus?: boolean, options?: IManagedHoverOptions): Promise<void> {
		if (this._cancellationTokenSource) {
			// there's an computation ongoing, cancel it
			this._cancellationTokenSource.dispose(true);
			this._cancellationTokenSource = undefined;
		}
		if (this.isDisposed) {
			return;
		}

		let resolvedContent: string | HTMLElement | IMarkdownString | undefined;
		if (isString(content) || isHTMLElement(content) || content === undefined) {
			resolvedContent = content;
		} else {
			// compute the content, potentially long-running

			this._cancellationTokenSource = new CancellationTokenSource();
			const token = this._cancellationTokenSource.token;

			let managedContent;
			if (isManagedHoverTooltipMarkdownString(content)) {
				if (isFunction(content.markdown)) {
					managedContent = content.markdown(token).then(resolvedContent => resolvedContent ?? content.markdownNotSupportedFallback);
				} else {
					managedContent = content.markdown ?? content.markdownNotSupportedFallback;
				}
			} else {
				managedContent = content.element(token);
			}

			// compute the content
			if (managedContent instanceof Promise) {

				// show 'Loading' if no hover is up yet
				if (!this._hoverWidget) {
					this.show(localize('iconLabel.loading', "Loading..."), focus, options);
				}

				resolvedContent = await managedContent;
			} else {
				resolvedContent = managedContent;
			}

			if (this.isDisposed || token.isCancellationRequested) {
				// either the widget has been closed in the meantime
				// or there has been a new call to `update`
				return;
			}
		}

		this.show(resolvedContent, focus, options);
	}

	private show(content: IManagedHoverResolvedContent, focus?: boolean, options?: IManagedHoverOptions): void {
		const oldHoverWidget = this._hoverWidget;

		if (this.hasContent(content)) {
			const hoverOptions: IHoverDelegateOptions = {
				content,
				target: this.target,
				actions: options?.actions,
				linkHandler: options?.linkHandler,
				trapFocus: options?.trapFocus,
				appearance: {
					showPointer: this.hoverDelegate.placement === 'element',
					skipFadeInAnimation: !this.fadeInAnimation || !!oldHoverWidget, // do not fade in if the hover is already showing
					showHoverHint: options?.appearance?.showHoverHint,
				},
				position: {
					hoverPosition: HoverPosition.BELOW,
				},
			};

			this._hoverWidget = this.hoverDelegate.showHover(hoverOptions, focus);
		}
		oldHoverWidget?.dispose();
	}

	private hasContent(content: IManagedHoverResolvedContent): content is NonNullable<IManagedHoverResolvedContent> {
		if (!content) {
			return false;
		}

		if (isMarkdownString(content)) {
			return !!content.value;
		}

		return true;
	}

	get isDisposed() {
		return this._hoverWidget?.isDisposed;
	}

	dispose(): void {
		this._hoverWidget?.dispose();
		this._cancellationTokenSource?.dispose(true);
		this._cancellationTokenSource = undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/hover/test/browser/nullHoverService.ts]---
Location: vscode-main/src/vs/platform/hover/test/browser/nullHoverService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IManagedHoverContent, IManagedHoverOptions } from '../../../../base/browser/ui/hover/hover.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import type { IHoverService } from '../../browser/hover.js';

export const NullHoverService: IHoverService = {
	_serviceBrand: undefined,
	hideHover: () => undefined,
	showInstantHover: () => undefined,
	showDelayedHover: () => undefined,
	setupDelayedHover: () => Disposable.None,
	setupDelayedHoverAtMouse: () => Disposable.None,
	setupManagedHover: () => ({
		dispose: () => { },
		show: (focus?: boolean) => { },
		hide: () => { },
		update: (tooltip: IManagedHoverContent, options?: IManagedHoverOptions) => { }
	}),
	showAndFocusLastHover: () => undefined,
	showManagedHover: () => undefined
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/imageResize/browser/imageResizeService.ts]---
Location: vscode-main/src/vs/platform/imageResize/browser/imageResizeService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { decodeBase64, VSBuffer } from '../../../base/common/buffer.js';
import { joinPath } from '../../../base/common/resources.js';
import { URI } from '../../../base/common/uri.js';
import { IFileService } from '../../files/common/files.js';
import { InstantiationType, registerSingleton } from '../../instantiation/common/extensions.js';
import { ILogService } from '../../log/common/log.js';
import { IImageResizeService } from '../common/imageResizeService.js';


export class ImageResizeService implements IImageResizeService {

	declare readonly _serviceBrand: undefined;

	/**
	 * Resizes an image provided as a UInt8Array string. Resizing is based on Open AI's algorithm for tokenzing images.
	 * https://platform.openai.com/docs/guides/vision#calculating-costs
	 * @param data - The UInt8Array string of the image to resize.
	 * @returns A promise that resolves to the UInt8Array string of the resized image.
	 */

	async resizeImage(data: Uint8Array | string, mimeType?: string): Promise<Uint8Array> {
		const isGif = mimeType === 'image/gif';

		if (typeof data === 'string') {
			data = this.convertStringToUInt8Array(data);
		}

		return new Promise((resolve, reject) => {
			const blob = new Blob([data as Uint8Array<ArrayBuffer>], { type: mimeType });
			const img = new Image();
			const url = URL.createObjectURL(blob);
			img.src = url;

			img.onload = () => {
				URL.revokeObjectURL(url);
				let { width, height } = img;

				if ((width <= 768 || height <= 768) && !isGif) {
					resolve(data);
					return;
				}

				// Calculate the new dimensions while maintaining the aspect ratio
				if (width > 2048 || height > 2048) {
					const scaleFactor = 2048 / Math.max(width, height);
					width = Math.round(width * scaleFactor);
					height = Math.round(height * scaleFactor);
				}

				const scaleFactor = 768 / Math.min(width, height);
				width = Math.round(width * scaleFactor);
				height = Math.round(height * scaleFactor);

				const canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext('2d');
				if (ctx) {
					ctx.drawImage(img, 0, 0, width, height);

					const jpegTypes = ['image/jpeg', 'image/jpg'];
					const outputMimeType = mimeType && jpegTypes.includes(mimeType) ? 'image/jpeg' : 'image/png';

					canvas.toBlob(blob => {
						if (blob) {
							const reader = new FileReader();
							reader.onload = () => {
								resolve(new Uint8Array(reader.result as ArrayBuffer));
							};
							reader.onerror = (error) => reject(error);
							reader.readAsArrayBuffer(blob);
						} else {
							reject(new Error('Failed to create blob from canvas'));
						}
					}, outputMimeType);
				} else {
					reject(new Error('Failed to get canvas context'));
				}
			};
			img.onerror = (error) => {
				URL.revokeObjectURL(url);
				reject(error);
			};
		});
	}

	convertStringToUInt8Array(data: string): Uint8Array {
		const base64Data = data.includes(',') ? data.split(',')[1] : data;
		if (this.isValidBase64(base64Data)) {
			return decodeBase64(base64Data).buffer;
		}
		return new TextEncoder().encode(data);
	}

	// Only used for URLs
	convertUint8ArrayToString(data: Uint8Array): string {
		try {
			const decoder = new TextDecoder();
			const decodedString = decoder.decode(data);
			return decodedString;
		} catch {
			return '';
		}
	}

	isValidBase64(str: string): boolean {
		try {
			decodeBase64(str);
			return true;
		} catch {
			return false;
		}
	}

	async createFileForMedia(fileService: IFileService, imagesFolder: URI, dataTransfer: Uint8Array, mimeType: string): Promise<URI | undefined> {
		const exists = await fileService.exists(imagesFolder);
		if (!exists) {
			await fileService.createFolder(imagesFolder);
		}

		const ext = mimeType.split('/')[1] || 'png';
		const filename = `image-${Date.now()}.${ext}`;
		const fileUri = joinPath(imagesFolder, filename);

		const buffer = VSBuffer.wrap(dataTransfer);
		await fileService.writeFile(fileUri, buffer);

		return fileUri;
	}

	async cleanupOldImages(fileService: IFileService, logService: ILogService, imagesFolder: URI): Promise<void> {
		const exists = await fileService.exists(imagesFolder);
		if (!exists) {
			return;
		}

		const duration = 7 * 24 * 60 * 60 * 1000; // 7 days
		const files = await fileService.resolve(imagesFolder);
		if (!files.children) {
			return;
		}

		await Promise.all(files.children.map(async (file) => {
			try {
				const timestamp = this.getTimestampFromFilename(file.name);
				if (timestamp && (Date.now() - timestamp > duration)) {
					await fileService.del(file.resource);
				}
			} catch (err) {
				logService.error('Failed to clean up old images', err);
			}
		}));
	}

	getTimestampFromFilename(filename: string): number | undefined {
		const match = filename.match(/image-(\d+)\./);
		if (match) {
			return parseInt(match[1], 10);
		}
		return undefined;
	}


}

registerSingleton(IImageResizeService, ImageResizeService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/imageResize/common/imageResizeService.ts]---
Location: vscode-main/src/vs/platform/imageResize/common/imageResizeService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IImageResizeService = createDecorator<IImageResizeService>('imageResizeMainService');


export interface IImageResizeService {

	readonly _serviceBrand: undefined;

	/**
	 * Resizes an image to a maximum dimension of 768px while maintaining aspect ratio.
	 */
	resizeImage(data: Uint8Array | string, mimeType?: string): Promise<Uint8Array>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/instantiation/common/descriptors.ts]---
Location: vscode-main/src/vs/platform/instantiation/common/descriptors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export class SyncDescriptor<T> {

	readonly ctor: any;
	readonly staticArguments: unknown[];
	readonly supportsDelayedInstantiation: boolean;

	constructor(ctor: new (...args: any[]) => T, staticArguments: unknown[] = [], supportsDelayedInstantiation: boolean = false) {
		this.ctor = ctor;
		this.staticArguments = staticArguments;
		this.supportsDelayedInstantiation = supportsDelayedInstantiation;
	}
}

export interface SyncDescriptor0<T> {
	readonly ctor: new () => T;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/instantiation/common/extensions.ts]---
Location: vscode-main/src/vs/platform/instantiation/common/extensions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { SyncDescriptor } from './descriptors.js';
import { BrandedService, ServiceIdentifier } from './instantiation.js';

const _registry: [ServiceIdentifier<any>, SyncDescriptor<any>][] = [];

export const enum InstantiationType {
	/**
	 * Instantiate this service as soon as a consumer depends on it. _Note_ that this
	 * is more costly as some upfront work is done that is likely not needed
	 */
	Eager = 0,

	/**
	 * Instantiate this service as soon as a consumer uses it. This is the _better_
	 * way of registering a service.
	 */
	Delayed = 1
}

export function registerSingleton<T, Services extends BrandedService[]>(id: ServiceIdentifier<T>, ctor: new (...services: Services) => T, supportsDelayedInstantiation: InstantiationType): void;
export function registerSingleton<T, Services extends BrandedService[]>(id: ServiceIdentifier<T>, descriptor: SyncDescriptor<any>): void;
export function registerSingleton<T, Services extends BrandedService[]>(id: ServiceIdentifier<T>, ctorOrDescriptor: { new(...services: Services): T } | SyncDescriptor<any>, supportsDelayedInstantiation?: boolean | InstantiationType): void {
	if (!(ctorOrDescriptor instanceof SyncDescriptor)) {
		ctorOrDescriptor = new SyncDescriptor<T>(ctorOrDescriptor as new (...args: any[]) => T, [], Boolean(supportsDelayedInstantiation));
	}

	_registry.push([id, ctorOrDescriptor]);
}

export function getSingletonServiceDescriptors(): [ServiceIdentifier<any>, SyncDescriptor<any>][] {
	return _registry;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/instantiation/common/graph.ts]---
Location: vscode-main/src/vs/platform/instantiation/common/graph.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export class Node<T> {


	readonly incoming = new Map<string, Node<T>>();
	readonly outgoing = new Map<string, Node<T>>();

	constructor(
		readonly key: string,
		readonly data: T
	) { }
}

export class Graph<T> {

	private readonly _nodes = new Map<string, Node<T>>();

	constructor(private readonly _hashFn: (element: T) => string) {
		// empty
	}

	roots(): Node<T>[] {
		const ret: Node<T>[] = [];
		for (const node of this._nodes.values()) {
			if (node.outgoing.size === 0) {
				ret.push(node);
			}
		}
		return ret;
	}

	insertEdge(from: T, to: T): void {
		const fromNode = this.lookupOrInsertNode(from);
		const toNode = this.lookupOrInsertNode(to);

		fromNode.outgoing.set(toNode.key, toNode);
		toNode.incoming.set(fromNode.key, fromNode);
	}

	removeNode(data: T): void {
		const key = this._hashFn(data);
		this._nodes.delete(key);
		for (const node of this._nodes.values()) {
			node.outgoing.delete(key);
			node.incoming.delete(key);
		}
	}

	lookupOrInsertNode(data: T): Node<T> {
		const key = this._hashFn(data);
		let node = this._nodes.get(key);

		if (!node) {
			node = new Node(key, data);
			this._nodes.set(key, node);
		}

		return node;
	}

	lookup(data: T): Node<T> | undefined {
		return this._nodes.get(this._hashFn(data));
	}

	isEmpty(): boolean {
		return this._nodes.size === 0;
	}

	toString(): string {
		const data: string[] = [];
		for (const [key, value] of this._nodes) {
			data.push(`${key}\n\t(-> incoming)[${[...value.incoming.keys()].join(', ')}]\n\t(outgoing ->)[${[...value.outgoing.keys()].join(',')}]\n`);

		}
		return data.join('\n');
	}

	/**
	 * This is brute force and slow and **only** be used
	 * to trouble shoot.
	 */
	findCycleSlow() {
		for (const [id, node] of this._nodes) {
			const seen = new Set<string>([id]);
			const res = this._findCycle(node, seen);
			if (res) {
				return res;
			}
		}
		return undefined;
	}

	private _findCycle(node: Node<T>, seen: Set<string>): string | undefined {
		for (const [id, outgoing] of node.outgoing) {
			if (seen.has(id)) {
				return [...seen, id].join(' -> ');
			}
			seen.add(id);
			const value = this._findCycle(outgoing, seen);
			if (value) {
				return value;
			}
			seen.delete(id);
		}
		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/instantiation/common/instantiation.ts]---
Location: vscode-main/src/vs/platform/instantiation/common/instantiation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore } from '../../../base/common/lifecycle.js';
import * as descriptors from './descriptors.js';
import { ServiceCollection } from './serviceCollection.js';

// ------ internal util

export namespace _util {

	export const serviceIds = new Map<string, ServiceIdentifier<any>>();

	export const DI_TARGET = '$di$target';
	export const DI_DEPENDENCIES = '$di$dependencies';

	export function getServiceDependencies(ctor: DI_TARGET_OBJ): { id: ServiceIdentifier<any>; index: number }[] {
		return ctor[DI_DEPENDENCIES] || [];
	}

	export interface DI_TARGET_OBJ extends Function {
		[DI_TARGET]: Function;
		[DI_DEPENDENCIES]: { id: ServiceIdentifier<any>; index: number }[];
	}
}

// --- interfaces ------

export type BrandedService = { _serviceBrand: undefined };

export interface IConstructorSignature<T, Args extends any[] = []> {
	new <Services extends BrandedService[]>(...args: [...Args, ...Services]): T;
}

export interface ServicesAccessor {
	get<T>(id: ServiceIdentifier<T>): T;
}

export const IInstantiationService = createDecorator<IInstantiationService>('instantiationService');

/**
 * Given a list of arguments as a tuple, attempt to extract the leading, non-service arguments
 * to their own tuple.
 */
export type GetLeadingNonServiceArgs<TArgs extends any[]> =
	TArgs extends [] ? []
	: TArgs extends [...infer TFirst, BrandedService] ? GetLeadingNonServiceArgs<TFirst>
	: TArgs;

export interface IInstantiationService {

	readonly _serviceBrand: undefined;

	/**
	 * Synchronously creates an instance that is denoted by the descriptor
	 */
	createInstance<T>(descriptor: descriptors.SyncDescriptor0<T>): T;
	createInstance<Ctor extends new (...args: any[]) => unknown, R extends InstanceType<Ctor>>(ctor: Ctor, ...args: GetLeadingNonServiceArgs<ConstructorParameters<Ctor>>): R;

	/**
	 * Calls a function with a service accessor.
	 */
	invokeFunction<R, TS extends any[] = []>(fn: (accessor: ServicesAccessor, ...args: TS) => R, ...args: TS): R;

	/**
	 * Creates a child of this service which inherits all current services
	 * and adds/overwrites the given services.
	 *
	 * NOTE that the returned child is `disposable` and should be disposed when not used
	 * anymore. This will also dispose all the services that this service has created.
	 */
	createChild(services: ServiceCollection, store?: DisposableStore): IInstantiationService;

	/**
	 * Disposes this instantiation service.
	 *
	 * - Will dispose all services that this instantiation service has created.
	 * - Will dispose all its children but not its parent.
	 * - Will NOT dispose services-instances that this service has been created with
	 * - Will NOT dispose consumer-instances this service has created
	 */
	dispose(): void;
}


/**
 * Identifies a service of type `T`.
 */
export interface ServiceIdentifier<T> {
	(...args: any[]): void;
	type: T;
}


function storeServiceDependency(id: ServiceIdentifier<unknown>, target: Function, index: number): void {
	if ((target as _util.DI_TARGET_OBJ)[_util.DI_TARGET] === target) {
		(target as _util.DI_TARGET_OBJ)[_util.DI_DEPENDENCIES].push({ id, index });
	} else {
		(target as _util.DI_TARGET_OBJ)[_util.DI_DEPENDENCIES] = [{ id, index }];
		(target as _util.DI_TARGET_OBJ)[_util.DI_TARGET] = target;
	}
}

/**
 * The *only* valid way to create a {{ServiceIdentifier}}.
 */
export function createDecorator<T>(serviceId: string): ServiceIdentifier<T> {

	if (_util.serviceIds.has(serviceId)) {
		return _util.serviceIds.get(serviceId)!;
	}

	const id = function (target: Function, key: string, index: number) {
		if (arguments.length !== 3) {
			throw new Error('@IServiceName-decorator can only be used to decorate a parameter');
		}
		storeServiceDependency(id, target, index);
	} as ServiceIdentifier<T>;

	id.toString = () => serviceId;

	_util.serviceIds.set(serviceId, id);
	return id;
}

export function refineServiceDecorator<T1, T extends T1>(serviceIdentifier: ServiceIdentifier<T1>): ServiceIdentifier<T> {
	return <ServiceIdentifier<T>>serviceIdentifier;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/instantiation/common/instantiationService.ts]---
Location: vscode-main/src/vs/platform/instantiation/common/instantiationService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { GlobalIdleValue } from '../../../base/common/async.js';
import { Event } from '../../../base/common/event.js';
import { illegalState } from '../../../base/common/errors.js';
import { DisposableStore, dispose, IDisposable, isDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { SyncDescriptor, SyncDescriptor0 } from './descriptors.js';
import { Graph } from './graph.js';
import { GetLeadingNonServiceArgs, IInstantiationService, ServiceIdentifier, ServicesAccessor, _util } from './instantiation.js';
import { ServiceCollection } from './serviceCollection.js';
import { LinkedList } from '../../../base/common/linkedList.js';

// TRACING
const _enableAllTracing = false
	// || "TRUE" // DO NOT CHECK IN!
	;

class CyclicDependencyError extends Error {
	constructor(graph: Graph<any>) {
		super('cyclic dependency between services');
		this.message = graph.findCycleSlow() ?? `UNABLE to detect cycle, dumping graph: \n${graph.toString()}`;
	}
}

export class InstantiationService implements IInstantiationService {

	declare readonly _serviceBrand: undefined;

	readonly _globalGraph?: Graph<string>;
	private _globalGraphImplicitDependency?: string;

	private _isDisposed = false;
	private readonly _servicesToMaybeDispose = new Set<any>();
	private readonly _children = new Set<InstantiationService>();

	constructor(
		private readonly _services: ServiceCollection = new ServiceCollection(),
		private readonly _strict: boolean = false,
		private readonly _parent?: InstantiationService,
		private readonly _enableTracing: boolean = _enableAllTracing
	) {

		this._services.set(IInstantiationService, this);
		this._globalGraph = _enableTracing ? _parent?._globalGraph ?? new Graph(e => e) : undefined;
	}

	dispose(): void {
		if (!this._isDisposed) {
			this._isDisposed = true;
			// dispose all child services
			dispose(this._children);
			this._children.clear();

			// dispose all services created by this service
			for (const candidate of this._servicesToMaybeDispose) {
				if (isDisposable(candidate)) {
					candidate.dispose();
				}
			}
			this._servicesToMaybeDispose.clear();
		}
	}

	private _throwIfDisposed(): void {
		if (this._isDisposed) {
			throw new Error('InstantiationService has been disposed');
		}
	}

	createChild(services: ServiceCollection, store?: DisposableStore): IInstantiationService {
		this._throwIfDisposed();

		const that = this;
		const result = new class extends InstantiationService {
			override dispose(): void {
				that._children.delete(result);
				super.dispose();
			}
		}(services, this._strict, this, this._enableTracing);
		this._children.add(result);

		store?.add(result);
		return result;
	}

	invokeFunction<R, TS extends any[] = []>(fn: (accessor: ServicesAccessor, ...args: TS) => R, ...args: TS): R {
		this._throwIfDisposed();

		const _trace = Trace.traceInvocation(this._enableTracing, fn);
		let _done = false;
		try {
			const accessor: ServicesAccessor = {
				get: <T>(id: ServiceIdentifier<T>) => {

					if (_done) {
						throw illegalState('service accessor is only valid during the invocation of its target method');
					}

					const result = this._getOrCreateServiceInstance(id, _trace);
					if (!result) {
						this._throwIfStrict(`[invokeFunction] unknown service '${id}'`, false);
					}
					return result;
				}
			};
			return fn(accessor, ...args);
		} finally {
			_done = true;
			_trace.stop();
		}
	}

	createInstance<T>(descriptor: SyncDescriptor0<T>): T;
	createInstance<Ctor extends new (...args: any[]) => unknown, R extends InstanceType<Ctor>>(ctor: Ctor, ...args: GetLeadingNonServiceArgs<ConstructorParameters<Ctor>>): R;
	createInstance(ctorOrDescriptor: any | SyncDescriptor<any>, ...rest: unknown[]): unknown {
		this._throwIfDisposed();

		let _trace: Trace;
		let result: unknown;
		if (ctorOrDescriptor instanceof SyncDescriptor) {
			_trace = Trace.traceCreation(this._enableTracing, ctorOrDescriptor.ctor);
			result = this._createInstance(ctorOrDescriptor.ctor, ctorOrDescriptor.staticArguments.concat(rest), _trace);
		} else {
			_trace = Trace.traceCreation(this._enableTracing, ctorOrDescriptor);
			result = this._createInstance(ctorOrDescriptor, rest, _trace);
		}
		_trace.stop();
		return result;
	}

	private _createInstance<T>(ctor: any, args: unknown[] = [], _trace: Trace): T {

		// arguments defined by service decorators
		const serviceDependencies = _util.getServiceDependencies(ctor).sort((a, b) => a.index - b.index);
		const serviceArgs: unknown[] = [];
		for (const dependency of serviceDependencies) {
			const service = this._getOrCreateServiceInstance(dependency.id, _trace);
			if (!service) {
				this._throwIfStrict(`[createInstance] ${ctor.name} depends on UNKNOWN service ${dependency.id}.`, false);
			}
			serviceArgs.push(service);
		}

		const firstServiceArgPos = serviceDependencies.length > 0 ? serviceDependencies[0].index : args.length;

		// check for argument mismatches, adjust static args if needed
		if (args.length !== firstServiceArgPos) {
			console.trace(`[createInstance] First service dependency of ${ctor.name} at position ${firstServiceArgPos + 1} conflicts with ${args.length} static arguments`);

			const delta = firstServiceArgPos - args.length;
			if (delta > 0) {
				args = args.concat(new Array(delta));
			} else {
				args = args.slice(0, firstServiceArgPos);
			}
		}

		// now create the instance
		return Reflect.construct<any, T>(ctor, args.concat(serviceArgs));
	}

	private _setCreatedServiceInstance<T>(id: ServiceIdentifier<T>, instance: T): void {
		if (this._services.get(id) instanceof SyncDescriptor) {
			this._services.set(id, instance);
		} else if (this._parent) {
			this._parent._setCreatedServiceInstance(id, instance);
		} else {
			throw new Error('illegalState - setting UNKNOWN service instance');
		}
	}

	private _getServiceInstanceOrDescriptor<T>(id: ServiceIdentifier<T>): T | SyncDescriptor<T> {
		const instanceOrDesc = this._services.get(id);
		if (!instanceOrDesc && this._parent) {
			return this._parent._getServiceInstanceOrDescriptor(id);
		} else {
			return instanceOrDesc;
		}
	}

	protected _getOrCreateServiceInstance<T>(id: ServiceIdentifier<T>, _trace: Trace): T {
		if (this._globalGraph && this._globalGraphImplicitDependency) {
			this._globalGraph.insertEdge(this._globalGraphImplicitDependency, String(id));
		}
		const thing = this._getServiceInstanceOrDescriptor(id);
		if (thing instanceof SyncDescriptor) {
			return this._safeCreateAndCacheServiceInstance(id, thing, _trace.branch(id, true));
		} else {
			_trace.branch(id, false);
			return thing;
		}
	}

	private readonly _activeInstantiations = new Set<ServiceIdentifier<any>>();


	private _safeCreateAndCacheServiceInstance<T>(id: ServiceIdentifier<T>, desc: SyncDescriptor<T>, _trace: Trace): T {
		if (this._activeInstantiations.has(id)) {
			throw new Error(`illegal state - RECURSIVELY instantiating service '${id}'`);
		}
		this._activeInstantiations.add(id);
		try {
			return this._createAndCacheServiceInstance(id, desc, _trace);
		} finally {
			this._activeInstantiations.delete(id);
		}
	}

	private _createAndCacheServiceInstance<T>(id: ServiceIdentifier<T>, desc: SyncDescriptor<T>, _trace: Trace): T {

		type Triple = { id: ServiceIdentifier<any>; desc: SyncDescriptor<any>; _trace: Trace };
		const graph = new Graph<Triple>(data => data.id.toString());

		let cycleCount = 0;
		const stack = [{ id, desc, _trace }];
		const seen = new Set<string>();
		while (stack.length) {
			const item = stack.pop()!;

			if (seen.has(String(item.id))) {
				continue;
			}
			seen.add(String(item.id));

			graph.lookupOrInsertNode(item);

			// a weak but working heuristic for cycle checks
			if (cycleCount++ > 1000) {
				throw new CyclicDependencyError(graph);
			}

			// check all dependencies for existence and if they need to be created first
			for (const dependency of _util.getServiceDependencies(item.desc.ctor)) {

				const instanceOrDesc = this._getServiceInstanceOrDescriptor(dependency.id);
				if (!instanceOrDesc) {
					this._throwIfStrict(`[createInstance] ${id} depends on ${dependency.id} which is NOT registered.`, true);
				}

				// take note of all service dependencies
				this._globalGraph?.insertEdge(String(item.id), String(dependency.id));

				if (instanceOrDesc instanceof SyncDescriptor) {
					const d = { id: dependency.id, desc: instanceOrDesc, _trace: item._trace.branch(dependency.id, true) };
					graph.insertEdge(item, d);
					stack.push(d);
				}
			}
		}

		while (true) {
			const roots = graph.roots();

			// if there is no more roots but still
			// nodes in the graph we have a cycle
			if (roots.length === 0) {
				if (!graph.isEmpty()) {
					throw new CyclicDependencyError(graph);
				}
				break;
			}

			for (const { data } of roots) {
				// Repeat the check for this still being a service sync descriptor. That's because
				// instantiating a dependency might have side-effect and recursively trigger instantiation
				// so that some dependencies are now fullfilled already.
				const instanceOrDesc = this._getServiceInstanceOrDescriptor(data.id);
				if (instanceOrDesc instanceof SyncDescriptor) {
					// create instance and overwrite the service collections
					const instance = this._createServiceInstanceWithOwner(data.id, data.desc.ctor, data.desc.staticArguments, data.desc.supportsDelayedInstantiation, data._trace);
					this._setCreatedServiceInstance(data.id, instance);
				}
				graph.removeNode(data);
			}
		}
		return <T>this._getServiceInstanceOrDescriptor(id);
	}

	private _createServiceInstanceWithOwner<T>(id: ServiceIdentifier<T>, ctor: any, args: unknown[] = [], supportsDelayedInstantiation: boolean, _trace: Trace): T {
		if (this._services.get(id) instanceof SyncDescriptor) {
			return this._createServiceInstance(id, ctor, args, supportsDelayedInstantiation, _trace, this._servicesToMaybeDispose);
		} else if (this._parent) {
			return this._parent._createServiceInstanceWithOwner(id, ctor, args, supportsDelayedInstantiation, _trace);
		} else {
			throw new Error(`illegalState - creating UNKNOWN service instance ${ctor.name}`);
		}
	}

	private _createServiceInstance<T>(id: ServiceIdentifier<T>, ctor: any, args: unknown[] = [], supportsDelayedInstantiation: boolean, _trace: Trace, disposeBucket: Set<any>): T {
		if (!supportsDelayedInstantiation) {
			// eager instantiation
			const result = this._createInstance<T>(ctor, args, _trace);
			disposeBucket.add(result);
			return result;

		} else {
			const child = new InstantiationService(undefined, this._strict, this, this._enableTracing);
			child._globalGraphImplicitDependency = String(id);

			type EaryListenerData = {
				listener: Parameters<Event<any>>;
				disposable?: IDisposable;
			};

			// Return a proxy object that's backed by an idle value. That
			// strategy is to instantiate services in our idle time or when actually
			// needed but not when injected into a consumer

			// return "empty events" when the service isn't instantiated yet
			const earlyListeners = new Map<string, LinkedList<EaryListenerData>>();

			const idle = new GlobalIdleValue<any>(() => {
				const result = child._createInstance<T>(ctor, args, _trace);

				// early listeners that we kept are now being subscribed to
				// the real service
				for (const [key, values] of earlyListeners) {
					// eslint-disable-next-line local/code-no-any-casts
					const candidate = <Event<any>>(<any>result)[key];
					if (typeof candidate === 'function') {
						for (const value of values) {
							value.disposable = candidate.apply(result, value.listener);
						}
					}
				}
				earlyListeners.clear();
				disposeBucket.add(result);
				return result;
			});
			return <T>new Proxy(Object.create(null), {
				get(target: any, key: PropertyKey): unknown {

					if (!idle.isInitialized) {
						// looks like an event
						if (typeof key === 'string' && (key.startsWith('onDid') || key.startsWith('onWill'))) {
							let list = earlyListeners.get(key);
							if (!list) {
								list = new LinkedList();
								earlyListeners.set(key, list);
							}
							const event: Event<any> = (callback, thisArg, disposables) => {
								if (idle.isInitialized) {
									return idle.value[key](callback, thisArg, disposables);
								} else {
									const entry: EaryListenerData = { listener: [callback, thisArg, disposables], disposable: undefined };
									const rm = list.push(entry);
									const result = toDisposable(() => {
										rm();
										entry.disposable?.dispose();
									});
									return result;
								}
							};
							return event;
						}
					}

					// value already exists
					if (key in target) {
						return target[key];
					}

					// create value
					const obj = idle.value;
					let prop = obj[key];
					if (typeof prop !== 'function') {
						return prop;
					}
					prop = prop.bind(obj);
					target[key] = prop;
					return prop;
				},
				set(_target: T, p: PropertyKey, value: any): boolean {
					idle.value[p] = value;
					return true;
				},
				getPrototypeOf(_target: T) {
					return ctor.prototype;
				}
			});
		}
	}

	private _throwIfStrict(msg: string, printWarning: boolean): void {
		if (printWarning) {
			console.warn(msg);
		}
		if (this._strict) {
			throw new Error(msg);
		}
	}
}

//#region -- tracing ---

const enum TraceType {
	None = 0,
	Creation = 1,
	Invocation = 2,
	Branch = 3,
}

export class Trace {

	static all = new Set<string>();

	private static readonly _None = new class extends Trace {
		constructor() { super(TraceType.None, null); }
		override stop() { }
		override branch() { return this; }
	};

	static traceInvocation(_enableTracing: boolean, ctor: any): Trace {
		return !_enableTracing ? Trace._None : new Trace(TraceType.Invocation, ctor.name || new Error().stack!.split('\n').slice(3, 4).join('\n'));
	}

	static traceCreation(_enableTracing: boolean, ctor: any): Trace {
		return !_enableTracing ? Trace._None : new Trace(TraceType.Creation, ctor.name);
	}

	private static _totals: number = 0;
	private readonly _start: number = Date.now();
	private readonly _dep: [ServiceIdentifier<any>, boolean, Trace?][] = [];

	private constructor(
		readonly type: TraceType,
		readonly name: string | null
	) { }

	branch(id: ServiceIdentifier<any>, first: boolean): Trace {
		const child = new Trace(TraceType.Branch, id.toString());
		this._dep.push([id, first, child]);
		return child;
	}

	stop() {
		const dur = Date.now() - this._start;
		Trace._totals += dur;

		let causedCreation = false;

		function printChild(n: number, trace: Trace) {
			const res: string[] = [];
			const prefix = new Array(n + 1).join('\t');
			for (const [id, first, child] of trace._dep) {
				if (first && child) {
					causedCreation = true;
					res.push(`${prefix}CREATES -> ${id}`);
					const nested = printChild(n + 1, child);
					if (nested) {
						res.push(nested);
					}
				} else {
					res.push(`${prefix}uses -> ${id}`);
				}
			}
			return res.join('\n');
		}

		const lines = [
			`${this.type === TraceType.Creation ? 'CREATE' : 'CALL'} ${this.name}`,
			`${printChild(1, this)}`,
			`DONE, took ${dur.toFixed(2)}ms (grand total ${Trace._totals.toFixed(2)}ms)`
		];

		if (dur > 2 || causedCreation) {
			Trace.all.add(lines.join('\n'));
		}
	}
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/instantiation/common/serviceCollection.ts]---
Location: vscode-main/src/vs/platform/instantiation/common/serviceCollection.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ServiceIdentifier } from './instantiation.js';
import { SyncDescriptor } from './descriptors.js';

export class ServiceCollection {

	private _entries = new Map<ServiceIdentifier<any>, any>();

	constructor(...entries: [ServiceIdentifier<any>, any][]) {
		for (const [id, service] of entries) {
			this.set(id, service);
		}
	}

	set<T>(id: ServiceIdentifier<T>, instanceOrDescriptor: T | SyncDescriptor<T>): T | SyncDescriptor<T> {
		const result = this._entries.get(id);
		this._entries.set(id, instanceOrDescriptor);
		return result;
	}

	has(id: ServiceIdentifier<any>): boolean {
		return this._entries.has(id);
	}

	get<T>(id: ServiceIdentifier<T>): T | SyncDescriptor<T> {
		return this._entries.get(id);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/instantiation/test/common/graph.test.ts]---
Location: vscode-main/src/vs/platform/instantiation/test/common/graph.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { Graph } from '../../common/graph.js';

suite('Graph', () => {

	let graph: Graph<string>;

	setup(() => {
		graph = new Graph<string>(s => s);
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('is possible to lookup nodes that don\'t exist', function () {
		assert.strictEqual(graph.lookup('ddd'), undefined);
	});

	test('inserts nodes when not there yet', function () {
		assert.strictEqual(graph.lookup('ddd'), undefined);
		assert.strictEqual(graph.lookupOrInsertNode('ddd').data, 'ddd');
		assert.strictEqual(graph.lookup('ddd')!.data, 'ddd');
	});

	test('can remove nodes and get length', function () {
		assert.ok(graph.isEmpty());
		assert.strictEqual(graph.lookup('ddd'), undefined);
		assert.strictEqual(graph.lookupOrInsertNode('ddd').data, 'ddd');
		assert.ok(!graph.isEmpty());
		graph.removeNode('ddd');
		assert.strictEqual(graph.lookup('ddd'), undefined);
		assert.ok(graph.isEmpty());
	});

	test('root', () => {
		graph.insertEdge('1', '2');
		let roots = graph.roots();
		assert.strictEqual(roots.length, 1);
		assert.strictEqual(roots[0].data, '2');

		graph.insertEdge('2', '1');
		roots = graph.roots();
		assert.strictEqual(roots.length, 0);
	});

	test('root complex', function () {
		graph.insertEdge('1', '2');
		graph.insertEdge('1', '3');
		graph.insertEdge('3', '4');

		const roots = graph.roots();
		assert.strictEqual(roots.length, 2);
		assert(['2', '4'].every(n => roots.some(node => node.data === n)));
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/instantiation/test/common/instantiationService.test.ts]---
Location: vscode-main/src/vs/platform/instantiation/test/common/instantiationService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Emitter, Event } from '../../../../base/common/event.js';
import { dispose } from '../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { SyncDescriptor } from '../../common/descriptors.js';
import { createDecorator, IInstantiationService, ServicesAccessor } from '../../common/instantiation.js';
import { InstantiationService } from '../../common/instantiationService.js';
import { ServiceCollection } from '../../common/serviceCollection.js';

const IService1 = createDecorator<IService1>('service1');

interface IService1 {
	readonly _serviceBrand: undefined;
	c: number;
}

class Service1 implements IService1 {
	declare readonly _serviceBrand: undefined;
	c = 1;
}

const IService2 = createDecorator<IService2>('service2');

interface IService2 {
	readonly _serviceBrand: undefined;
	d: boolean;
}

class Service2 implements IService2 {
	declare readonly _serviceBrand: undefined;
	d = true;
}

const IService3 = createDecorator<IService3>('service3');

interface IService3 {
	readonly _serviceBrand: undefined;
	s: string;
}

class Service3 implements IService3 {
	declare readonly _serviceBrand: undefined;
	s = 'farboo';
}

const IDependentService = createDecorator<IDependentService>('dependentService');

interface IDependentService {
	readonly _serviceBrand: undefined;
	name: string;
}

class DependentService implements IDependentService {
	declare readonly _serviceBrand: undefined;
	constructor(@IService1 service: IService1) {
		assert.strictEqual(service.c, 1);
	}

	name = 'farboo';
}

class Service1Consumer {

	constructor(@IService1 service1: IService1) {
		assert.ok(service1);
		assert.strictEqual(service1.c, 1);
	}
}

class Target2Dep {

	constructor(@IService1 service1: IService1, @IService2 service2: Service2) {
		assert.ok(service1 instanceof Service1);
		assert.ok(service2 instanceof Service2);
	}
}

class TargetWithStaticParam {
	constructor(v: boolean, @IService1 service1: IService1) {
		assert.ok(v);
		assert.ok(service1);
		assert.strictEqual(service1.c, 1);
	}
}



class DependentServiceTarget {
	constructor(@IDependentService d: IDependentService) {
		assert.ok(d);
		assert.strictEqual(d.name, 'farboo');
	}
}

class DependentServiceTarget2 {
	constructor(@IDependentService d: IDependentService, @IService1 s: IService1) {
		assert.ok(d);
		assert.strictEqual(d.name, 'farboo');
		assert.ok(s);
		assert.strictEqual(s.c, 1);
	}
}


class ServiceLoop1 implements IService1 {
	declare readonly _serviceBrand: undefined;
	c = 1;

	constructor(@IService2 s: IService2) {

	}
}

class ServiceLoop2 implements IService2 {
	declare readonly _serviceBrand: undefined;
	d = true;

	constructor(@IService1 s: IService1) {

	}
}

suite('Instantiation Service', () => {

	test('service collection, cannot overwrite', function () {
		const collection = new ServiceCollection();
		let result = collection.set(IService1, null!);
		assert.strictEqual(result, undefined);
		result = collection.set(IService1, new Service1());
		assert.strictEqual(result, null);
	});

	test('service collection, add/has', function () {
		const collection = new ServiceCollection();
		collection.set(IService1, null!);
		assert.ok(collection.has(IService1));

		collection.set(IService2, null!);
		assert.ok(collection.has(IService1));
		assert.ok(collection.has(IService2));
	});

	test('@Param - simple clase', function () {
		const collection = new ServiceCollection();
		const service = new InstantiationService(collection);
		collection.set(IService1, new Service1());
		collection.set(IService2, new Service2());
		collection.set(IService3, new Service3());

		service.createInstance(Service1Consumer);
	});

	test('@Param - fixed args', function () {
		const collection = new ServiceCollection();
		const service = new InstantiationService(collection);
		collection.set(IService1, new Service1());
		collection.set(IService2, new Service2());
		collection.set(IService3, new Service3());

		service.createInstance(TargetWithStaticParam, true);
	});

	test('service collection is live', function () {

		const collection = new ServiceCollection();
		collection.set(IService1, new Service1());

		const service = new InstantiationService(collection);
		service.createInstance(Service1Consumer);

		collection.set(IService2, new Service2());

		service.createInstance(Target2Dep);
		service.invokeFunction(function (a) {
			assert.ok(a.get(IService1));
			assert.ok(a.get(IService2));
		});
	});

	// we made this a warning
	// test('@Param - too many args', function () {
	// 	let service = instantiationService.create(Object.create(null));
	// 	service.addSingleton(IService1, new Service1());
	// 	service.addSingleton(IService2, new Service2());
	// 	service.addSingleton(IService3, new Service3());

	// 	assert.throws(() => service.createInstance(ParameterTarget2, true, 2));
	// });

	// test('@Param - too few args', function () {
	// 	let service = instantiationService.create(Object.create(null));
	// 	service.addSingleton(IService1, new Service1());
	// 	service.addSingleton(IService2, new Service2());
	// 	service.addSingleton(IService3, new Service3());

	// 	assert.throws(() => service.createInstance(ParameterTarget2));
	// });

	test('SyncDesc - no dependencies', function () {
		const collection = new ServiceCollection();
		const service = new InstantiationService(collection);
		collection.set(IService1, new SyncDescriptor<IService1>(Service1));

		service.invokeFunction(accessor => {

			const service1 = accessor.get(IService1);
			assert.ok(service1);
			assert.strictEqual(service1.c, 1);

			const service2 = accessor.get(IService1);
			assert.ok(service1 === service2);
		});
	});

	test('SyncDesc - service with service dependency', function () {
		const collection = new ServiceCollection();
		const service = new InstantiationService(collection);
		collection.set(IService1, new SyncDescriptor<IService1>(Service1));
		collection.set(IDependentService, new SyncDescriptor<IDependentService>(DependentService));

		service.invokeFunction(accessor => {
			const d = accessor.get(IDependentService);
			assert.ok(d);
			assert.strictEqual(d.name, 'farboo');
		});
	});

	test('SyncDesc - target depends on service future', function () {
		const collection = new ServiceCollection();
		const service = new InstantiationService(collection);
		collection.set(IService1, new SyncDescriptor<IService1>(Service1));
		collection.set(IDependentService, new SyncDescriptor<IDependentService>(DependentService));

		const d = service.createInstance(DependentServiceTarget);
		assert.ok(d instanceof DependentServiceTarget);

		const d2 = service.createInstance(DependentServiceTarget2);
		assert.ok(d2 instanceof DependentServiceTarget2);
	});

	test('SyncDesc - explode on loop', function () {
		const collection = new ServiceCollection();
		const service = new InstantiationService(collection);
		collection.set(IService1, new SyncDescriptor<IService1>(ServiceLoop1));
		collection.set(IService2, new SyncDescriptor<IService2>(ServiceLoop2));

		assert.throws(() => {
			service.invokeFunction(accessor => {
				accessor.get(IService1);
			});
		});
		assert.throws(() => {
			service.invokeFunction(accessor => {
				accessor.get(IService2);
			});
		});

		try {
			service.invokeFunction(accessor => {
				accessor.get(IService1);
			});
		} catch (err) {
			assert.ok(err.name);
			assert.ok(err.message);
		}
	});

	test('Invoke - get services', function () {
		const collection = new ServiceCollection();
		const service = new InstantiationService(collection);
		collection.set(IService1, new Service1());
		collection.set(IService2, new Service2());

		function test(accessor: ServicesAccessor) {
			assert.ok(accessor.get(IService1) instanceof Service1);
			assert.strictEqual(accessor.get(IService1).c, 1);

			return true;
		}

		assert.strictEqual(service.invokeFunction(test), true);
	});

	test('Invoke - get service, optional', function () {
		const collection = new ServiceCollection([IService1, new Service1()]);
		const service = new InstantiationService(collection, true);

		function test(accessor: ServicesAccessor) {
			assert.ok(accessor.get(IService1) instanceof Service1);
			assert.throws(() => accessor.get(IService2));
			return true;
		}
		assert.strictEqual(service.invokeFunction(test), true);
	});

	test('Invoke - keeping accessor NOT allowed', function () {
		const collection = new ServiceCollection();
		const service = new InstantiationService(collection);
		collection.set(IService1, new Service1());
		collection.set(IService2, new Service2());

		let cached: ServicesAccessor;

		function test(accessor: ServicesAccessor) {
			assert.ok(accessor.get(IService1) instanceof Service1);
			assert.strictEqual(accessor.get(IService1).c, 1);
			cached = accessor;
			return true;
		}

		assert.strictEqual(service.invokeFunction(test), true);

		assert.throws(() => cached.get(IService2));
	});

	test('Invoke - throw error', function () {
		const collection = new ServiceCollection();
		const service = new InstantiationService(collection);
		collection.set(IService1, new Service1());
		collection.set(IService2, new Service2());

		function test(accessor: ServicesAccessor) {
			throw new Error();
		}

		assert.throws(() => service.invokeFunction(test));
	});

	test('Create child', function () {

		let serviceInstanceCount = 0;

		const CtorCounter = class implements Service1 {
			declare readonly _serviceBrand: undefined;
			c = 1;
			constructor() {
				serviceInstanceCount += 1;
			}
		};

		// creating the service instance BEFORE the child service
		let service = new InstantiationService(new ServiceCollection([IService1, new SyncDescriptor(CtorCounter)]));
		service.createInstance(Service1Consumer);

		// second instance must be earlier ONE
		let child = service.createChild(new ServiceCollection([IService2, new Service2()]));
		child.createInstance(Service1Consumer);

		assert.strictEqual(serviceInstanceCount, 1);

		// creating the service instance AFTER the child service
		serviceInstanceCount = 0;
		service = new InstantiationService(new ServiceCollection([IService1, new SyncDescriptor(CtorCounter)]));
		child = service.createChild(new ServiceCollection([IService2, new Service2()]));

		// second instance must be earlier ONE
		service.createInstance(Service1Consumer);
		child.createInstance(Service1Consumer);

		assert.strictEqual(serviceInstanceCount, 1);
	});

	test('Remote window / integration tests is broken #105562', function () {

		const Service1 = createDecorator<any>('service1');
		class Service1Impl {
			constructor(@IInstantiationService insta: IInstantiationService) {
				const c = insta.invokeFunction(accessor => accessor.get(Service2)); // THIS is the recursive call
				assert.ok(c);
			}
		}
		const Service2 = createDecorator<any>('service2');
		class Service2Impl {
			constructor() { }
		}

		// This service depends on Service1 and Service2 BUT creating Service1 creates Service2 (via recursive invocation)
		// and then Servce2 should not be created a second time
		const Service21 = createDecorator<any>('service21');
		class Service21Impl {
			constructor(@Service2 public readonly service2: Service2Impl, @Service1 public readonly service1: Service1Impl) { }
		}

		const insta = new InstantiationService(new ServiceCollection(
			[Service1, new SyncDescriptor(Service1Impl)],
			[Service2, new SyncDescriptor(Service2Impl)],
			[Service21, new SyncDescriptor(Service21Impl)],
		));

		const obj = insta.invokeFunction(accessor => accessor.get(Service21));
		assert.ok(obj);
	});

	test('Sync/Async dependency loop', async function () {

		const A = createDecorator<A>('A');
		const B = createDecorator<B>('B');
		interface A { _serviceBrand: undefined; doIt(): void }
		interface B { _serviceBrand: undefined; b(): boolean }

		class BConsumer {
			constructor(@B private readonly b: B) {

			}
			doIt() {
				return this.b.b();
			}
		}

		class AService implements A {
			_serviceBrand: undefined;
			prop: BConsumer;
			constructor(@IInstantiationService insta: IInstantiationService) {
				this.prop = insta.createInstance(BConsumer);
			}
			doIt() {
				return this.prop.doIt();
			}
		}

		class BService implements B {
			_serviceBrand: undefined;
			constructor(@A a: A) {
				assert.ok(a);
			}
			b() { return true; }
		}

		// SYNC -> explodes AImpl -> [insta:BConsumer] -> BImpl -> AImpl
		{
			const insta1 = new InstantiationService(new ServiceCollection(
				[A, new SyncDescriptor(AService)],
				[B, new SyncDescriptor(BService)],
			), true, undefined, true);

			try {
				insta1.invokeFunction(accessor => accessor.get(A));
				assert.ok(false);

			} catch (error) {
				assert.ok(error instanceof Error);
				assert.ok(error.message.includes('RECURSIVELY'));
			}
		}

		// ASYNC -> doesn't explode but cycle is tracked
		{
			const insta2 = new InstantiationService(new ServiceCollection(
				[A, new SyncDescriptor(AService, undefined, true)],
				[B, new SyncDescriptor(BService, undefined)],
			), true, undefined, true);

			const a = insta2.invokeFunction(accessor => accessor.get(A));
			a.doIt();

			const cycle = insta2._globalGraph?.findCycleSlow();
			assert.strictEqual(cycle, 'A -> B -> A');
		}
	});

	test('Delayed and events', function () {
		const A = createDecorator<A>('A');
		interface A {
			_serviceBrand: undefined;
			readonly onDidDoIt: Event<any>;
			doIt(): void;
		}

		let created = false;
		class AImpl implements A {
			_serviceBrand: undefined;
			_doIt = 0;

			_onDidDoIt = new Emitter<this>();
			readonly onDidDoIt: Event<this> = this._onDidDoIt.event;

			constructor() {
				created = true;
			}

			doIt(): void {
				this._doIt += 1;
				this._onDidDoIt.fire(this);
			}
		}

		const insta = new InstantiationService(new ServiceCollection(
			[A, new SyncDescriptor(AImpl, undefined, true)],
		), true, undefined, true);

		class Consumer {
			constructor(@A public readonly a: A) {
				// eager subscribe -> NO service instance
			}
		}

		const c: Consumer = insta.createInstance(Consumer);
		let eventCount = 0;

		// subscribing to event doesn't trigger instantiation
		const listener = (e: any) => {
			assert.ok(e instanceof AImpl);
			eventCount++;
		};
		const d1 = c.a.onDidDoIt(listener);
		const d2 = c.a.onDidDoIt(listener);
		assert.strictEqual(created, false);
		assert.strictEqual(eventCount, 0);
		d2.dispose();

		// instantiation happens on first call
		c.a.doIt();
		assert.strictEqual(created, true);
		assert.strictEqual(eventCount, 1);


		const d3 = c.a.onDidDoIt(listener);
		c.a.doIt();
		assert.strictEqual(eventCount, 3);

		dispose([d1, d3]);
	});


	test('Capture event before init, use after init', function () {
		const A = createDecorator<A>('A');
		interface A {
			_serviceBrand: undefined;
			readonly onDidDoIt: Event<any>;
			doIt(): void;
			noop(): void;
		}

		let created = false;
		class AImpl implements A {
			_serviceBrand: undefined;
			_doIt = 0;

			_onDidDoIt = new Emitter<this>();
			readonly onDidDoIt: Event<this> = this._onDidDoIt.event;

			constructor() {
				created = true;
			}

			doIt(): void {
				this._doIt += 1;
				this._onDidDoIt.fire(this);
			}

			noop(): void {
			}
		}

		const insta = new InstantiationService(new ServiceCollection(
			[A, new SyncDescriptor(AImpl, undefined, true)],
		), true, undefined, true);

		class Consumer {
			constructor(@A public readonly a: A) {
				// eager subscribe -> NO service instance
			}
		}

		const c: Consumer = insta.createInstance(Consumer);
		let eventCount = 0;

		// subscribing to event doesn't trigger instantiation
		const listener = (e: any) => {
			assert.ok(e instanceof AImpl);
			eventCount++;
		};

		const event = c.a.onDidDoIt;

		// const d1 = c.a.onDidDoIt(listener);
		assert.strictEqual(created, false);

		c.a.noop();
		assert.strictEqual(created, true);

		const d1 = event(listener);

		c.a.doIt();


		// instantiation happens on first call
		assert.strictEqual(eventCount, 1);

		dispose(d1);
	});

	test('Dispose early event listener', function () {
		const A = createDecorator<A>('A');
		interface A {
			_serviceBrand: undefined;
			readonly onDidDoIt: Event<any>;
			doIt(): void;
		}
		let created = false;
		class AImpl implements A {
			_serviceBrand: undefined;
			_doIt = 0;

			_onDidDoIt = new Emitter<this>();
			readonly onDidDoIt: Event<this> = this._onDidDoIt.event;

			constructor() {
				created = true;
			}

			doIt(): void {
				this._doIt += 1;
				this._onDidDoIt.fire(this);
			}
		}

		const insta = new InstantiationService(new ServiceCollection(
			[A, new SyncDescriptor(AImpl, undefined, true)],
		), true, undefined, true);

		class Consumer {
			constructor(@A public readonly a: A) {
				// eager subscribe -> NO service instance
			}
		}

		const c: Consumer = insta.createInstance(Consumer);
		let eventCount = 0;

		// subscribing to event doesn't trigger instantiation
		const listener = (e: any) => {
			assert.ok(e instanceof AImpl);
			eventCount++;
		};

		const d1 = c.a.onDidDoIt(listener);
		assert.strictEqual(created, false);
		assert.strictEqual(eventCount, 0);

		c.a.doIt();

		// instantiation happens on first call
		assert.strictEqual(created, true);
		assert.strictEqual(eventCount, 1);

		dispose(d1);

		c.a.doIt();
		assert.strictEqual(eventCount, 1);
	});


	test('Dispose services it created', function () {
		let disposedA = false;
		let disposedB = false;

		const A = createDecorator<A>('A');
		interface A {
			_serviceBrand: undefined;
			value: 1;
		}
		class AImpl implements A {
			_serviceBrand: undefined;
			value: 1 = 1;
			dispose() {
				disposedA = true;
			}
		}

		const B = createDecorator<B>('B');
		interface B {
			_serviceBrand: undefined;
			value: 1;
		}
		class BImpl implements B {
			_serviceBrand: undefined;
			value: 1 = 1;
			dispose() {
				disposedB = true;
			}
		}

		const insta = new InstantiationService(new ServiceCollection(
			[A, new SyncDescriptor(AImpl, undefined, true)],
			[B, new BImpl()],
		), true, undefined, true);

		class Consumer {
			constructor(
				@A public readonly a: A,
				@B public readonly b: B
			) {
				assert.strictEqual(a.value, b.value);
			}
		}

		const c: Consumer = insta.createInstance(Consumer);

		insta.dispose();
		assert.ok(c);
		assert.strictEqual(disposedA, true);
		assert.strictEqual(disposedB, false);
	});

	test('Disposed service cannot be used anymore', function () {


		const B = createDecorator<B>('B');
		interface B {
			_serviceBrand: undefined;
			value: 1;
		}
		class BImpl implements B {
			_serviceBrand: undefined;
			value: 1 = 1;
		}

		const insta = new InstantiationService(new ServiceCollection(
			[B, new BImpl()],
		), true, undefined, true);

		class Consumer {
			constructor(
				@B public readonly b: B
			) {
				assert.strictEqual(b.value, 1);
			}
		}

		const c: Consumer = insta.createInstance(Consumer);
		assert.ok(c);

		insta.dispose();

		assert.throws(() => insta.createInstance(Consumer));
		assert.throws(() => insta.invokeFunction(accessor => { }));
		assert.throws(() => insta.createChild(new ServiceCollection()));
	});

	test('Child does not dispose parent', function () {

		const B = createDecorator<B>('B');
		interface B {
			_serviceBrand: undefined;
			value: 1;
		}
		class BImpl implements B {
			_serviceBrand: undefined;
			value: 1 = 1;
		}

		const insta1 = new InstantiationService(new ServiceCollection(
			[B, new BImpl()],
		), true, undefined, true);

		const insta2 = insta1.createChild(new ServiceCollection());

		class Consumer {
			constructor(
				@B public readonly b: B
			) {
				assert.strictEqual(b.value, 1);
			}
		}

		assert.ok(insta1.createInstance(Consumer));
		assert.ok(insta2.createInstance(Consumer));

		insta2.dispose();

		assert.ok(insta1.createInstance(Consumer)); // parent NOT disposed by child
		assert.throws(() => insta2.createInstance(Consumer));
	});

	test('Parent does dispose children', function () {

		const B = createDecorator<B>('B');
		interface B {
			_serviceBrand: undefined;
			value: 1;
		}
		class BImpl implements B {
			_serviceBrand: undefined;
			value: 1 = 1;
		}

		const insta1 = new InstantiationService(new ServiceCollection(
			[B, new BImpl()],
		), true, undefined, true);

		const insta2 = insta1.createChild(new ServiceCollection());

		class Consumer {
			constructor(
				@B public readonly b: B
			) {
				assert.strictEqual(b.value, 1);
			}
		}

		assert.ok(insta1.createInstance(Consumer));
		assert.ok(insta2.createInstance(Consumer));

		insta1.dispose();

		assert.throws(() => insta2.createInstance(Consumer)); // child is disposed by parent
		assert.throws(() => insta1.createInstance(Consumer));
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/instantiation/test/common/instantiationServiceMock.ts]---
Location: vscode-main/src/vs/platform/instantiation/test/common/instantiationServiceMock.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as sinon from 'sinon';
import { DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { SyncDescriptor, SyncDescriptor0 } from '../../common/descriptors.js';
import { GetLeadingNonServiceArgs, ServiceIdentifier, ServicesAccessor } from '../../common/instantiation.js';
import { InstantiationService, Trace } from '../../common/instantiationService.js';
import { ServiceCollection } from '../../common/serviceCollection.js';

interface IServiceMock<T> {
	id: ServiceIdentifier<T>;
	service: any;
}

const isSinonSpyLike = (fn: Function): fn is sinon.SinonSpy => fn && 'callCount' in fn;

export class TestInstantiationService extends InstantiationService implements IDisposable, ServicesAccessor {

	private _servciesMap: Map<ServiceIdentifier<any>, any>;
	private readonly _classStubs: Map<Function, any> = new Map();
	private readonly _parentTestService: TestInstantiationService | undefined;

	constructor(private _serviceCollection: ServiceCollection = new ServiceCollection(), strict: boolean = false, parent?: TestInstantiationService, private _properDispose?: boolean) {
		super(_serviceCollection, strict, parent);

		this._servciesMap = new Map<ServiceIdentifier<any>, any>();
		this._parentTestService = parent;
	}

	public get<T>(service: ServiceIdentifier<T>): T {
		return super._getOrCreateServiceInstance(service, Trace.traceCreation(false, TestInstantiationService));
	}

	public set<T>(service: ServiceIdentifier<T>, instance: T): T {
		return <T>this._serviceCollection.set(service, instance);
	}

	public mock<T>(service: ServiceIdentifier<T>): T | sinon.SinonMock {
		return <T>this._create(service, { mock: true });
	}

	public stubInstance<T>(ctor: new (...args: any[]) => T, instance: Partial<T>): void {
		this._classStubs.set(ctor, instance);
	}

	protected _getClassStub(ctor: Function): unknown {
		return this._classStubs.get(ctor) ?? this._parentTestService?._getClassStub(ctor);
	}

	public override createInstance<T>(descriptor: SyncDescriptor0<T>): T;
	public override createInstance<Ctor extends new (...args: any[]) => unknown, R extends InstanceType<Ctor>>(ctor: Ctor, ...args: GetLeadingNonServiceArgs<ConstructorParameters<Ctor>>): R;
	public override createInstance(ctorOrDescriptor: any | SyncDescriptor<any>, ...rest: unknown[]): unknown {
		const stub = this._getClassStub(ctorOrDescriptor as Function);
		if (stub) {
			return stub;
		}
		return super.createInstance(ctorOrDescriptor, ...rest);
	}

	public stub<T>(service: ServiceIdentifier<T>, obj: Partial<NoInfer<T>> | Function): T;
	public stub<T, V>(service: ServiceIdentifier<T>, obj: Partial<NoInfer<T>> | Function, property: string, value: V): V extends Function ? sinon.SinonSpy : sinon.SinonStub;
	public stub<T, V>(service: ServiceIdentifier<T>, property: string, value: V): V extends Function ? sinon.SinonSpy : sinon.SinonStub;
	public stub<T>(serviceIdentifier: ServiceIdentifier<T>, arg2: any, arg3?: string, arg4?: any): sinon.SinonStub | sinon.SinonSpy {
		const service = typeof arg2 !== 'string' ? arg2 : undefined;
		const serviceMock: IServiceMock<any> = { id: serviceIdentifier, service: service };
		const property = typeof arg2 === 'string' ? arg2 : arg3;
		const value = typeof arg2 === 'string' ? arg3 : arg4;

		const stubObject = this._create(serviceMock, { stub: true }, service && !property);
		if (property) {
			if (stubObject[property]) {
				if (stubObject[property].hasOwnProperty('restore')) {
					stubObject[property].restore();
				}
				if (typeof value === 'function') {
					const spy = isSinonSpyLike(value) ? value : sinon.spy(value);
					stubObject[property] = spy;
					return spy;
				} else {
					const stub = value ? sinon.stub().returns(value) : sinon.stub();
					stubObject[property] = stub;
					return stub;
				}
			} else {
				stubObject[property] = value;
			}
		}
		return stubObject;
	}

	public stubPromise<T>(service?: ServiceIdentifier<T>, fnProperty?: string, value?: any): T | sinon.SinonStub;
	public stubPromise<T, V>(service?: ServiceIdentifier<T>, ctor?: any, fnProperty?: string, value?: V): V extends Function ? sinon.SinonSpy : sinon.SinonStub;
	public stubPromise<T, V>(service?: ServiceIdentifier<T>, obj?: any, fnProperty?: string, value?: V): V extends Function ? sinon.SinonSpy : sinon.SinonStub;
	public stubPromise(arg1?: any, arg2?: any, arg3?: any, arg4?: any): sinon.SinonStub | sinon.SinonSpy {
		arg3 = typeof arg2 === 'string' ? Promise.resolve(arg3) : arg3;
		arg4 = typeof arg2 !== 'string' && typeof arg3 === 'string' ? Promise.resolve(arg4) : arg4;
		return this.stub(arg1, arg2, arg3, arg4);
	}

	public spy<T>(service: ServiceIdentifier<T>, fnProperty: string): sinon.SinonSpy {
		const spy = sinon.spy();
		this.stub(service, fnProperty, spy);
		return spy;
	}

	private _create<T>(serviceMock: IServiceMock<T>, options: SinonOptions, reset?: boolean): any;
	private _create<T>(ctor: any, options: SinonOptions): any;
	private _create(arg1: any, options: SinonOptions, reset: boolean = false): any {
		if (this.isServiceMock(arg1)) {
			const service = this._getOrCreateService(arg1, options, reset);
			this._serviceCollection.set(arg1.id, service);
			return service;
		}
		return options.mock ? sinon.mock(arg1) : this._createStub(arg1);
	}

	private _getOrCreateService<T>(serviceMock: IServiceMock<T>, opts: SinonOptions, reset?: boolean): any {
		const service: any = this._serviceCollection.get(serviceMock.id);
		if (!reset && service) {
			if (opts.mock && service['sinonOptions'] && !!service['sinonOptions'].mock) {
				return service;
			}
			if (opts.stub && service['sinonOptions'] && !!service['sinonOptions'].stub) {
				return service;
			}
		}
		return this._createService(serviceMock, opts);
	}

	private _createService(serviceMock: IServiceMock<any>, opts: SinonOptions): any {
		serviceMock.service = serviceMock.service ? serviceMock.service : this._servciesMap.get(serviceMock.id);
		const service = opts.mock ? sinon.mock(serviceMock.service) : this._createStub(serviceMock.service);
		service['sinonOptions'] = opts;
		return service;
	}

	private _createStub(arg: any): any {
		return typeof arg === 'object' ? arg : sinon.createStubInstance(arg);
	}

	private isServiceMock(arg1: any): boolean {
		return typeof arg1 === 'object' && arg1.hasOwnProperty('id');
	}

	override createChild(services: ServiceCollection): TestInstantiationService {
		return new TestInstantiationService(services, false, this);
	}

	override dispose() {
		sinon.restore();
		if (this._properDispose) {
			super.dispose();
		}
	}
}

interface SinonOptions {
	mock?: boolean;
	stub?: boolean;
}

export type ServiceIdCtorPair<T> = [id: ServiceIdentifier<T>, ctorOrInstance: T | (new (...args: any[]) => T)];

export function createServices(disposables: DisposableStore, services: ServiceIdCtorPair<any>[]): TestInstantiationService {
	const serviceIdentifiers: ServiceIdentifier<any>[] = [];
	const serviceCollection = new ServiceCollection();

	const define = <T>(id: ServiceIdentifier<T>, ctorOrInstance: T | (new (...args: any[]) => T)) => {
		if (!serviceCollection.has(id)) {
			if (typeof ctorOrInstance === 'function') {
				serviceCollection.set(id, new SyncDescriptor(ctorOrInstance as new (...args: any[]) => T));
			} else {
				serviceCollection.set(id, ctorOrInstance);
			}
		}
		serviceIdentifiers.push(id);
	};

	for (const [id, ctor] of services) {
		define(id, ctor);
	}

	const instantiationService = disposables.add(new TestInstantiationService(serviceCollection, true));
	disposables.add(toDisposable(() => {
		for (const id of serviceIdentifiers) {
			const instanceOrDescriptor = serviceCollection.get(id);
			if (typeof instanceOrDescriptor.dispose === 'function') {
				instanceOrDescriptor.dispose();
			}
		}
	}));
	return instantiationService;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/ipc/common/mainProcessService.ts]---
Location: vscode-main/src/vs/platform/ipc/common/mainProcessService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IChannel, IPCServer, IServerChannel, StaticRouter } from '../../../base/parts/ipc/common/ipc.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IRemoteService } from './services.js';

export const IMainProcessService = createDecorator<IMainProcessService>('mainProcessService');

export interface IMainProcessService extends IRemoteService { }

/**
 * An implementation of `IMainProcessService` that leverages `IPCServer`.
 */
export class MainProcessService implements IMainProcessService {

	declare readonly _serviceBrand: undefined;

	constructor(
		private server: IPCServer,
		private router: StaticRouter
	) { }

	getChannel(channelName: string): IChannel {
		return this.server.getChannel(channelName, this.router);
	}

	registerChannel(channelName: string, channel: IServerChannel<string>): void {
		this.server.registerChannel(channelName, channel);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/ipc/common/services.ts]---
Location: vscode-main/src/vs/platform/ipc/common/services.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IChannel, IServerChannel } from '../../../base/parts/ipc/common/ipc.js';

export interface IRemoteService {

	readonly _serviceBrand: undefined;

	getChannel(channelName: string): IChannel;
	registerChannel(channelName: string, channel: IServerChannel<string>): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/ipc/electron-browser/mainProcessService.ts]---
Location: vscode-main/src/vs/platform/ipc/electron-browser/mainProcessService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../base/common/lifecycle.js';
import { IChannel, IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { Client as IPCElectronClient } from '../../../base/parts/ipc/electron-browser/ipc.electron.js';
import { IMainProcessService } from '../common/mainProcessService.js';

/**
 * An implementation of `IMainProcessService` that leverages Electron's IPC.
 */
export class ElectronIPCMainProcessService extends Disposable implements IMainProcessService {

	declare readonly _serviceBrand: undefined;

	private mainProcessConnection: IPCElectronClient;

	constructor(
		windowId: number
	) {
		super();

		this.mainProcessConnection = this._register(new IPCElectronClient(`window:${windowId}`));
	}

	getChannel(channelName: string): IChannel {
		return this.mainProcessConnection.getChannel(channelName);
	}

	registerChannel(channelName: string, channel: IServerChannel<string>): void {
		this.mainProcessConnection.registerChannel(channelName, channel);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/ipc/electron-browser/services.ts]---
Location: vscode-main/src/vs/platform/ipc/electron-browser/services.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IChannel, ProxyChannel } from '../../../base/parts/ipc/common/ipc.js';
import { SyncDescriptor } from '../../instantiation/common/descriptors.js';
import { registerSingleton } from '../../instantiation/common/extensions.js';
import { createDecorator, IInstantiationService, ServiceIdentifier } from '../../instantiation/common/instantiation.js';
import { IMainProcessService } from '../common/mainProcessService.js';
import { IRemoteService } from '../common/services.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ChannelClientCtor<T> = { new(channel: IChannel, ...args: any[]): T };
type Remote = { getChannel(channelName: string): IChannel };

abstract class RemoteServiceStub<T extends object> {
	constructor(
		channelName: string,
		options: IRemoteServiceWithChannelClientOptions<T> | IRemoteServiceWithProxyOptions | undefined,
		remote: Remote,
		instantiationService: IInstantiationService
	) {
		const channel = remote.getChannel(channelName);

		if (isRemoteServiceWithChannelClientOptions(options)) {
			return instantiationService.createInstance(new SyncDescriptor(options.channelClientCtor, [channel]));
		}

		return ProxyChannel.toService(channel, options?.proxyOptions);
	}
}

export interface IRemoteServiceWithChannelClientOptions<T> {
	readonly channelClientCtor: ChannelClientCtor<T>;
}

export interface IRemoteServiceWithProxyOptions {
	readonly proxyOptions?: ProxyChannel.ICreateProxyServiceOptions;
}

function isRemoteServiceWithChannelClientOptions<T>(obj: unknown): obj is IRemoteServiceWithChannelClientOptions<T> {
	const candidate = obj as IRemoteServiceWithChannelClientOptions<T> | undefined;

	return !!candidate?.channelClientCtor;
}

//#region Main Process

class MainProcessRemoteServiceStub<T extends object> extends RemoteServiceStub<T> {
	constructor(channelName: string, options: IRemoteServiceWithChannelClientOptions<T> | IRemoteServiceWithProxyOptions | undefined, @IMainProcessService ipcService: IMainProcessService, @IInstantiationService instantiationService: IInstantiationService) {
		super(channelName, options, ipcService, instantiationService);
	}
}

export function registerMainProcessRemoteService<T>(id: ServiceIdentifier<T>, channelName: string, options?: IRemoteServiceWithChannelClientOptions<T> | IRemoteServiceWithProxyOptions): void {
	registerSingleton(id, new SyncDescriptor(MainProcessRemoteServiceStub, [channelName, options], true));
}

//#endregion

//#region Shared Process

export const ISharedProcessService = createDecorator<ISharedProcessService>('sharedProcessService');

export interface ISharedProcessService extends IRemoteService {

	/**
	 * Allows to create a `MessagePort` connection between the
	 * shared process and the renderer process.
	 *
	 * Use this only when you need raw IPC to the shared process
	 * via `postMessage` and `on('message')` of special data structures
	 * like typed arrays.
	 *
	 * Callers have to call `port.start()` after having installed
	 * listeners to enable the data flow.
	 */
	createRawConnection(): Promise<MessagePort>;

	notifyRestored(): void;
}

class SharedProcessRemoteServiceStub<T extends object> extends RemoteServiceStub<T> {
	constructor(channelName: string, options: IRemoteServiceWithChannelClientOptions<T> | IRemoteServiceWithProxyOptions | undefined, @ISharedProcessService ipcService: ISharedProcessService, @IInstantiationService instantiationService: IInstantiationService) {
		super(channelName, options, ipcService, instantiationService);
	}
}

export function registerSharedProcessRemoteService<T>(id: ServiceIdentifier<T>, channelName: string, options?: IRemoteServiceWithChannelClientOptions<T> | IRemoteServiceWithProxyOptions): void {
	registerSingleton(id, new SyncDescriptor(SharedProcessRemoteServiceStub, [channelName, options], true));
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/jsonschemas/common/jsonContributionRegistry.ts]---
Location: vscode-main/src/vs/platform/jsonschemas/common/jsonContributionRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { getCompressedContent, IJSONSchema } from '../../../base/common/jsonSchema.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import * as platform from '../../registry/common/platform.js';

export const Extensions = {
	JSONContribution: 'base.contributions.json'
};

export interface ISchemaContributions {
	schemas: { [id: string]: IJSONSchema };
}

export interface IJSONContributionRegistry {

	readonly onDidChangeSchema: Event<string>;
	readonly onDidChangeSchemaAssociations: Event<void>;

	/**
	 * Register a schema to the registry.
	 */
	registerSchema(uri: string, unresolvedSchemaContent: IJSONSchema, store?: DisposableStore): void;

	registerSchemaAssociation(uri: string, glob: string): IDisposable;

	/**
	 * Notifies all listeners that the content of the given schema has changed.
	 * @param uri The id of the schema
	 */
	notifySchemaChanged(uri: string): void;

	/**
	 * Get all schemas
	 */
	getSchemaContributions(): ISchemaContributions;

	getSchemaAssociations(): { [uri: string]: string[] };

	/**
	 * Gets the (compressed) content of the schema with the given schema ID (if any)
	 * @param uri The id of the schema
	 */
	getSchemaContent(uri: string): string | undefined;

	/**
	 * Returns true if there's a schema that matches the given schema ID
	 * @param uri The id of the schema
	 */
	hasSchemaContent(uri: string): boolean;
}



function normalizeId(id: string) {
	if (id.length > 0 && id.charAt(id.length - 1) === '#') {
		return id.substring(0, id.length - 1);
	}
	return id;
}



class JSONContributionRegistry extends Disposable implements IJSONContributionRegistry {

	private readonly schemasById: { [id: string]: IJSONSchema } = {};
	private readonly schemaAssociations: { [uri: string]: string[] } = {};

	private readonly _onDidChangeSchema = this._register(new Emitter<string>());
	readonly onDidChangeSchema: Event<string> = this._onDidChangeSchema.event;

	private readonly _onDidChangeSchemaAssociations = this._register(new Emitter<void>());
	readonly onDidChangeSchemaAssociations: Event<void> = this._onDidChangeSchemaAssociations.event;

	public registerSchema(uri: string, unresolvedSchemaContent: IJSONSchema, store?: DisposableStore): void {
		const normalizedUri = normalizeId(uri);
		this.schemasById[normalizedUri] = unresolvedSchemaContent;
		this._onDidChangeSchema.fire(uri);

		if (store) {
			store.add(toDisposable(() => {
				delete this.schemasById[normalizedUri];
				this._onDidChangeSchema.fire(uri);
			}));
		}
	}

	public registerSchemaAssociation(uri: string, glob: string): IDisposable {
		const normalizedUri = normalizeId(uri);
		if (!this.schemaAssociations[normalizedUri]) {
			this.schemaAssociations[normalizedUri] = [];
		}
		if (!this.schemaAssociations[normalizedUri].includes(glob)) {
			this.schemaAssociations[normalizedUri].push(glob);
			this._onDidChangeSchemaAssociations.fire();
		}

		return toDisposable(() => {
			const associations = this.schemaAssociations[normalizedUri];
			if (associations) {
				const index = associations.indexOf(glob);
				if (index !== -1) {
					associations.splice(index, 1);
					if (associations.length === 0) {
						delete this.schemaAssociations[normalizedUri];
					}
					this._onDidChangeSchemaAssociations.fire();
				}
			}
		});
	}

	public notifySchemaChanged(uri: string): void {
		this._onDidChangeSchema.fire(uri);
	}

	public getSchemaContributions(): ISchemaContributions {
		return {
			schemas: this.schemasById,
		};
	}

	public getSchemaContent(uri: string): string | undefined {
		const schema = this.schemasById[uri];
		return schema ? getCompressedContent(schema) : undefined;
	}

	public hasSchemaContent(uri: string): boolean {
		return !!this.schemasById[uri];
	}

	public getSchemaAssociations(): { [uri: string]: string[] } {
		return this.schemaAssociations;
	}

}

const jsonContributionRegistry = new JSONContributionRegistry();
platform.Registry.add(Extensions.JSONContribution, jsonContributionRegistry);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/keybinding/common/abstractKeybindingService.ts]---
Location: vscode-main/src/vs/platform/keybinding/common/abstractKeybindingService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WorkbenchActionExecutedClassification, WorkbenchActionExecutedEvent } from '../../../base/common/actions.js';
import * as arrays from '../../../base/common/arrays.js';
import { IntervalTimer, TimeoutTimer } from '../../../base/common/async.js';
import { illegalState } from '../../../base/common/errors.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { IME } from '../../../base/common/ime.js';
import { KeyCode } from '../../../base/common/keyCodes.js';
import { Keybinding, ResolvedChord, ResolvedKeybinding, SingleModifierChord } from '../../../base/common/keybindings.js';
import { Disposable, IDisposable } from '../../../base/common/lifecycle.js';
import * as nls from '../../../nls.js';

import { ICommandService } from '../../commands/common/commands.js';
import { IContextKeyService, IContextKeyServiceTarget } from '../../contextkey/common/contextkey.js';
import { IKeybindingService, IKeyboardEvent, KeybindingsSchemaContribution } from './keybinding.js';
import { ResolutionResult, KeybindingResolver, ResultKind, NoMatchingKb } from './keybindingResolver.js';
import { ResolvedKeybindingItem } from './resolvedKeybindingItem.js';
import { ILogService } from '../../log/common/log.js';
import { INotificationService, IStatusHandle } from '../../notification/common/notification.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';

interface CurrentChord {
	keypress: string;
	label: string | null;
}

const HIGH_FREQ_COMMANDS = /^(cursor|delete|undo|redo|tab|editor\.action\.clipboard)/;

export abstract class AbstractKeybindingService extends Disposable implements IKeybindingService {

	public _serviceBrand: undefined;

	protected readonly _onDidUpdateKeybindings: Emitter<void> = this._register(new Emitter<void>());
	get onDidUpdateKeybindings(): Event<void> {
		return this._onDidUpdateKeybindings ? this._onDidUpdateKeybindings.event : Event.None; // Sinon stubbing walks properties on prototype
	}

	/** recently recorded keypresses that can trigger a keybinding;
	 *
	 * example: say, there's "cmd+k cmd+i" keybinding;
	 * the user pressed "cmd+k" (before they press "cmd+i")
	 * "cmd+k" would be stored in this array, when on pressing "cmd+i", the service
	 * would invoke the command bound by the keybinding
	 */
	private _currentChords: CurrentChord[];

	private _currentChordChecker: IntervalTimer;
	private _currentChordStatusMessage: IStatusHandle | null;
	private _ignoreSingleModifiers: KeybindingModifierSet;
	private _currentSingleModifier: SingleModifierChord | null;
	private _currentSingleModifierClearTimeout: TimeoutTimer;
	protected _currentlyDispatchingCommandId: string | null;

	protected _logging: boolean;

	public get inChordMode(): boolean {
		return this._currentChords.length > 0;
	}

	constructor(
		private _contextKeyService: IContextKeyService,
		protected _commandService: ICommandService,
		protected _telemetryService: ITelemetryService,
		private _notificationService: INotificationService,
		protected _logService: ILogService,
	) {
		super();

		this._currentChords = [];
		this._currentChordChecker = new IntervalTimer();
		this._currentChordStatusMessage = null;
		this._ignoreSingleModifiers = KeybindingModifierSet.EMPTY;
		this._currentSingleModifier = null;
		this._currentSingleModifierClearTimeout = new TimeoutTimer();
		this._currentlyDispatchingCommandId = null;
		this._logging = false;
	}

	public override dispose(): void {
		super.dispose();
	}

	protected abstract _getResolver(): KeybindingResolver;
	protected abstract _documentHasFocus(): boolean;
	public abstract resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[];
	public abstract resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding;
	public abstract resolveUserBinding(userBinding: string): ResolvedKeybinding[];
	public abstract registerSchemaContribution(contribution: KeybindingsSchemaContribution): IDisposable;
	public abstract _dumpDebugInfo(): string;
	public abstract _dumpDebugInfoJSON(): string;

	public getDefaultKeybindingsContent(): string {
		return '';
	}

	public toggleLogging(): boolean {
		this._logging = !this._logging;
		return this._logging;
	}

	protected _log(str: string): void {
		if (this._logging) {
			this._logService.info(`[KeybindingService]: ${str}`);
		}
	}

	public getDefaultKeybindings(): readonly ResolvedKeybindingItem[] {
		return this._getResolver().getDefaultKeybindings();
	}

	public getKeybindings(): readonly ResolvedKeybindingItem[] {
		return this._getResolver().getKeybindings();
	}

	public customKeybindingsCount(): number {
		return 0;
	}

	public lookupKeybindings(commandId: string): ResolvedKeybinding[] {
		return arrays.coalesce(
			this._getResolver().lookupKeybindings(commandId).map(item => item.resolvedKeybinding)
		);
	}

	public lookupKeybinding(commandId: string, context?: IContextKeyService, enforceContextCheck = false): ResolvedKeybinding | undefined {
		const result = this._getResolver().lookupPrimaryKeybinding(commandId, context || this._contextKeyService, enforceContextCheck);
		if (!result) {
			return undefined;
		}
		return result.resolvedKeybinding;
	}

	public dispatchEvent(e: IKeyboardEvent, target: IContextKeyServiceTarget): boolean {
		return this._dispatch(e, target);
	}

	// TODO@ulugbekna: update namings to align with `_doDispatch`
	// TODO@ulugbekna: this fn doesn't seem to take into account single-modifier keybindings, eg `shift shift`
	public softDispatch(e: IKeyboardEvent, target: IContextKeyServiceTarget): ResolutionResult {
		this._log(`/ Soft dispatching keyboard event`);
		const keybinding = this.resolveKeyboardEvent(e);
		if (keybinding.hasMultipleChords()) {
			console.warn('keyboard event should not be mapped to multiple chords');
			return NoMatchingKb;
		}
		const [firstChord,] = keybinding.getDispatchChords();
		if (firstChord === null) {
			// cannot be dispatched, probably only modifier keys
			this._log(`\\ Keyboard event cannot be dispatched`);
			return NoMatchingKb;
		}

		const contextValue = this._contextKeyService.getContext(target);
		const currentChords = this._currentChords.map((({ keypress }) => keypress));
		return this._getResolver().resolve(contextValue, currentChords, firstChord);
	}

	private _scheduleLeaveChordMode(): void {
		const chordLastInteractedTime = Date.now();
		this._currentChordChecker.cancelAndSet(() => {

			if (!this._documentHasFocus()) {
				// Focus has been lost => leave chord mode
				this._leaveChordMode();
				return;
			}

			if (Date.now() - chordLastInteractedTime > 5000) {
				// 5 seconds elapsed => leave chord mode
				this._leaveChordMode();
			}

		}, 500);
	}

	private _expectAnotherChord(firstChord: string, keypressLabel: string | null): void {

		this._currentChords.push({ keypress: firstChord, label: keypressLabel });

		switch (this._currentChords.length) {
			case 0:
				throw illegalState('impossible');
			case 1:
				// TODO@ulugbekna: revise this message and the one below (at least, fix terminology)
				this._currentChordStatusMessage = this._notificationService.status(nls.localize('first.chord', "({0}) was pressed. Waiting for second key of chord...", keypressLabel));
				break;
			default: {
				const fullKeypressLabel = this._currentChords.map(({ label }) => label).join(', ');
				this._currentChordStatusMessage = this._notificationService.status(nls.localize('next.chord', "({0}) was pressed. Waiting for next key of chord...", fullKeypressLabel));
			}
		}

		this._scheduleLeaveChordMode();

		if (IME.enabled) {
			IME.disable();
		}
	}

	private _leaveChordMode(): void {
		if (this._currentChordStatusMessage) {
			this._currentChordStatusMessage.close();
			this._currentChordStatusMessage = null;
		}
		this._currentChordChecker.cancel();
		this._currentChords = [];
		IME.enable();
	}

	public dispatchByUserSettingsLabel(userSettingsLabel: string, target: IContextKeyServiceTarget): void {
		this._log(`/ Dispatching keybinding triggered via menu entry accelerator - ${userSettingsLabel}`);
		const keybindings = this.resolveUserBinding(userSettingsLabel);
		if (keybindings.length === 0) {
			this._log(`\\ Could not resolve - ${userSettingsLabel}`);
		} else {
			this._doDispatch(keybindings[0], target, /*isSingleModiferChord*/false);
		}
	}

	protected _dispatch(e: IKeyboardEvent, target: IContextKeyServiceTarget): boolean {
		return this._doDispatch(this.resolveKeyboardEvent(e), target, /*isSingleModiferChord*/false);
	}

	protected _singleModifierDispatch(e: IKeyboardEvent, target: IContextKeyServiceTarget): boolean {
		const keybinding = this.resolveKeyboardEvent(e);
		const [singleModifier,] = keybinding.getSingleModifierDispatchChords();

		if (singleModifier) {

			if (this._ignoreSingleModifiers.has(singleModifier)) {
				this._log(`+ Ignoring single modifier ${singleModifier} due to it being pressed together with other keys.`);
				this._ignoreSingleModifiers = KeybindingModifierSet.EMPTY;
				this._currentSingleModifierClearTimeout.cancel();
				this._currentSingleModifier = null;
				return false;
			}

			this._ignoreSingleModifiers = KeybindingModifierSet.EMPTY;

			if (this._currentSingleModifier === null) {
				// we have a valid `singleModifier`, store it for the next keyup, but clear it in 300ms
				this._log(`+ Storing single modifier for possible chord ${singleModifier}.`);
				this._currentSingleModifier = singleModifier;
				this._currentSingleModifierClearTimeout.cancelAndSet(() => {
					this._log(`+ Clearing single modifier due to 300ms elapsed.`);
					this._currentSingleModifier = null;
				}, 300);
				return false;
			}

			if (singleModifier === this._currentSingleModifier) {
				// bingo!
				this._log(`/ Dispatching single modifier chord ${singleModifier} ${singleModifier}`);
				this._currentSingleModifierClearTimeout.cancel();
				this._currentSingleModifier = null;
				return this._doDispatch(keybinding, target, /*isSingleModiferChord*/true);
			}

			this._log(`+ Clearing single modifier due to modifier mismatch: ${this._currentSingleModifier} ${singleModifier}`);
			this._currentSingleModifierClearTimeout.cancel();
			this._currentSingleModifier = null;
			return false;
		}

		// When pressing a modifier and holding it pressed with any other modifier or key combination,
		// the pressed modifiers should no longer be considered for single modifier dispatch.
		const [firstChord,] = keybinding.getChords();
		this._ignoreSingleModifiers = new KeybindingModifierSet(firstChord);

		if (this._currentSingleModifier !== null) {
			this._log(`+ Clearing single modifier due to other key up.`);
		}
		this._currentSingleModifierClearTimeout.cancel();
		this._currentSingleModifier = null;
		return false;
	}

	private _doDispatch(userKeypress: ResolvedKeybinding, target: IContextKeyServiceTarget, isSingleModiferChord = false): boolean {
		let shouldPreventDefault = false;

		if (userKeypress.hasMultipleChords()) { // warn - because user can press a single chord at a time
			console.warn('Unexpected keyboard event mapped to multiple chords');
			return false;
		}

		let userPressedChord: string | null = null;
		let currentChords: string[] | null = null;

		if (isSingleModiferChord) {
			// The keybinding is the second keypress of a single modifier chord, e.g. "shift shift".
			// A single modifier can only occur when the same modifier is pressed in short sequence,
			// hence we disregard `_currentChord` and use the same modifier instead.
			const [dispatchKeyname,] = userKeypress.getSingleModifierDispatchChords();
			userPressedChord = dispatchKeyname;
			currentChords = dispatchKeyname ? [dispatchKeyname] : []; // TODO@ulugbekna: in the `else` case we assign an empty array - make sure `resolve` can handle an empty array well
		} else {
			[userPressedChord,] = userKeypress.getDispatchChords();
			currentChords = this._currentChords.map(({ keypress }) => keypress);
		}

		if (userPressedChord === null) {
			this._log(`\\ Keyboard event cannot be dispatched in keydown phase.`);
			// cannot be dispatched, probably only modifier keys
			return shouldPreventDefault;
		}

		const contextValue = this._contextKeyService.getContext(target);
		const keypressLabel = userKeypress.getLabel();

		const resolveResult = this._getResolver().resolve(contextValue, currentChords, userPressedChord);

		switch (resolveResult.kind) {

			case ResultKind.NoMatchingKb: {

				this._logService.trace('KeybindingService#dispatch', keypressLabel, `[ No matching keybinding ]`);

				if (this.inChordMode) {
					const currentChordsLabel = this._currentChords.map(({ label }) => label).join(', ');
					this._log(`+ Leaving multi-chord mode: Nothing bound to "${currentChordsLabel}, ${keypressLabel}".`);
					this._notificationService.status(nls.localize('missing.chord', "The key combination ({0}, {1}) is not a command.", currentChordsLabel, keypressLabel), { hideAfter: 10 * 1000 /* 10s */ });
					this._leaveChordMode();

					shouldPreventDefault = true;
				}
				return shouldPreventDefault;
			}

			case ResultKind.MoreChordsNeeded: {

				this._logService.trace('KeybindingService#dispatch', keypressLabel, `[ Several keybindings match - more chords needed ]`);

				shouldPreventDefault = true;
				this._expectAnotherChord(userPressedChord, keypressLabel);
				this._log(this._currentChords.length === 1 ? `+ Entering multi-chord mode...` : `+ Continuing multi-chord mode...`);
				return shouldPreventDefault;
			}

			case ResultKind.KbFound: {

				this._logService.trace('KeybindingService#dispatch', keypressLabel, `[ Will dispatch command ${resolveResult.commandId} ]`);

				if (resolveResult.commandId === null || resolveResult.commandId === '') {

					if (this.inChordMode) {
						const currentChordsLabel = this._currentChords.map(({ label }) => label).join(', ');
						this._log(`+ Leaving chord mode: Nothing bound to "${currentChordsLabel}, ${keypressLabel}".`);
						this._notificationService.status(nls.localize('missing.chord', "The key combination ({0}, {1}) is not a command.", currentChordsLabel, keypressLabel), { hideAfter: 10 * 1000 /* 10s */ });
						this._leaveChordMode();
						shouldPreventDefault = true;
					}

				} else {
					if (this.inChordMode) {
						this._leaveChordMode();
					}

					if (!resolveResult.isBubble) {
						shouldPreventDefault = true;
					}

					this._log(`+ Invoking command ${resolveResult.commandId}.`);
					this._currentlyDispatchingCommandId = resolveResult.commandId;
					try {
						if (typeof resolveResult.commandArgs === 'undefined') {
							this._commandService.executeCommand(resolveResult.commandId).then(undefined, err => this._notificationService.warn(err));
						} else {
							this._commandService.executeCommand(resolveResult.commandId, resolveResult.commandArgs).then(undefined, err => this._notificationService.warn(err));
						}
					} finally {
						this._currentlyDispatchingCommandId = null;
					}

					if (!HIGH_FREQ_COMMANDS.test(resolveResult.commandId)) {
						this._telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: resolveResult.commandId, from: 'keybinding', detail: userKeypress.getUserSettingsLabel() ?? undefined });
					}
				}

				return shouldPreventDefault;
			}
		}
	}

	abstract enableKeybindingHoldMode(commandId: string): Promise<void> | undefined;

	mightProducePrintableCharacter(event: IKeyboardEvent): boolean {
		if (event.ctrlKey || event.metaKey) {
			// ignore ctrl/cmd-combination but not shift/alt-combinatios
			return false;
		}
		// weak check for certain ranges. this is properly implemented in a subclass
		// with access to the KeyboardMapperFactory.
		if ((event.keyCode >= KeyCode.KeyA && event.keyCode <= KeyCode.KeyZ)
			|| (event.keyCode >= KeyCode.Digit0 && event.keyCode <= KeyCode.Digit9)) {
			return true;
		}
		return false;
	}
}

class KeybindingModifierSet {

	public static EMPTY = new KeybindingModifierSet(null);

	private readonly _ctrlKey: boolean;
	private readonly _shiftKey: boolean;
	private readonly _altKey: boolean;
	private readonly _metaKey: boolean;

	constructor(source: ResolvedChord | null) {
		this._ctrlKey = source ? source.ctrlKey : false;
		this._shiftKey = source ? source.shiftKey : false;
		this._altKey = source ? source.altKey : false;
		this._metaKey = source ? source.metaKey : false;
	}

	has(modifier: SingleModifierChord) {
		switch (modifier) {
			case 'ctrl': return this._ctrlKey;
			case 'shift': return this._shiftKey;
			case 'alt': return this._altKey;
			case 'meta': return this._metaKey;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/keybinding/common/baseResolvedKeybinding.ts]---
Location: vscode-main/src/vs/platform/keybinding/common/baseResolvedKeybinding.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { illegalArgument } from '../../../base/common/errors.js';
import { AriaLabelProvider, ElectronAcceleratorLabelProvider, UILabelProvider, UserSettingsLabelProvider } from '../../../base/common/keybindingLabels.js';
import { Chord, SingleModifierChord, ResolvedKeybinding, ResolvedChord } from '../../../base/common/keybindings.js';
import { OperatingSystem } from '../../../base/common/platform.js';

export abstract class BaseResolvedKeybinding<T extends Chord> extends ResolvedKeybinding {

	protected readonly _os: OperatingSystem;
	protected readonly _chords: readonly T[];

	constructor(os: OperatingSystem, chords: readonly T[]) {
		super();
		if (chords.length === 0) {
			throw illegalArgument(`chords`);
		}
		this._os = os;
		this._chords = chords;
	}

	public getLabel(): string | null {
		return UILabelProvider.toLabel(this._os, this._chords, (keybinding) => this._getLabel(keybinding));
	}

	public getAriaLabel(): string | null {
		return AriaLabelProvider.toLabel(this._os, this._chords, (keybinding) => this._getAriaLabel(keybinding));
	}

	public getElectronAccelerator(): string | null {
		if (this._chords.length > 1) {
			// [Electron Accelerators] Electron cannot handle chords
			return null;
		}
		if (this._chords[0].isDuplicateModifierCase()) {
			// [Electron Accelerators] Electron cannot handle modifier only keybindings
			// e.g. "shift shift"
			return null;
		}
		return ElectronAcceleratorLabelProvider.toLabel(this._os, this._chords, (keybinding) => this._getElectronAccelerator(keybinding));
	}

	public getUserSettingsLabel(): string | null {
		return UserSettingsLabelProvider.toLabel(this._os, this._chords, (keybinding) => this._getUserSettingsLabel(keybinding));
	}

	public isWYSIWYG(): boolean {
		return this._chords.every((keybinding) => this._isWYSIWYG(keybinding));
	}

	public hasMultipleChords(): boolean {
		return (this._chords.length > 1);
	}

	public getChords(): ResolvedChord[] {
		return this._chords.map((keybinding) => this._getChord(keybinding));
	}

	private _getChord(keybinding: T): ResolvedChord {
		return new ResolvedChord(
			keybinding.ctrlKey,
			keybinding.shiftKey,
			keybinding.altKey,
			keybinding.metaKey,
			this._getLabel(keybinding),
			this._getAriaLabel(keybinding)
		);
	}

	public getDispatchChords(): (string | null)[] {
		return this._chords.map((keybinding) => this._getChordDispatch(keybinding));
	}

	public getSingleModifierDispatchChords(): (SingleModifierChord | null)[] {
		return this._chords.map((keybinding) => this._getSingleModifierChordDispatch(keybinding));
	}

	protected abstract _getLabel(keybinding: T): string | null;
	protected abstract _getAriaLabel(keybinding: T): string | null;
	protected abstract _getElectronAccelerator(keybinding: T): string | null;
	protected abstract _getUserSettingsLabel(keybinding: T): string | null;
	protected abstract _isWYSIWYG(keybinding: T): boolean;
	protected abstract _getChordDispatch(keybinding: T): string | null;
	protected abstract _getSingleModifierChordDispatch(keybinding: T): SingleModifierChord | null;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/keybinding/common/keybinding.ts]---
Location: vscode-main/src/vs/platform/keybinding/common/keybinding.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { IJSONSchema } from '../../../base/common/jsonSchema.js';
import { KeyCode } from '../../../base/common/keyCodes.js';
import { ResolvedKeybinding, Keybinding } from '../../../base/common/keybindings.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { IContextKeyService, IContextKeyServiceTarget } from '../../contextkey/common/contextkey.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ResolutionResult } from './keybindingResolver.js';
import { ResolvedKeybindingItem } from './resolvedKeybindingItem.js';

export interface IUserFriendlyKeybinding {
	key: string;
	command: string;
	args?: any;
	when?: string;
}

export interface IKeyboardEvent {
	readonly _standardKeyboardEventBrand: true;

	readonly ctrlKey: boolean;
	readonly shiftKey: boolean;
	readonly altKey: boolean;
	readonly metaKey: boolean;
	readonly altGraphKey: boolean;
	readonly keyCode: KeyCode;
	readonly code: string;
}

export interface KeybindingsSchemaContribution {
	readonly onDidChange?: Event<void>;

	getSchemaAdditions(): IJSONSchema[];
}

export const IKeybindingService = createDecorator<IKeybindingService>('keybindingService');

export interface IKeybindingService {
	readonly _serviceBrand: undefined;

	readonly inChordMode: boolean;

	readonly onDidUpdateKeybindings: Event<void>;

	/**
	 * Returns none, one or many (depending on keyboard layout)!
	 */
	resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[];

	resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding;

	resolveUserBinding(userBinding: string): ResolvedKeybinding[];

	/**
	 * Resolve and dispatch `keyboardEvent` and invoke the command.
	 */
	dispatchEvent(e: IKeyboardEvent, target: IContextKeyServiceTarget): boolean;

	/**
	 * Resolve and dispatch `keyboardEvent`, but do not invoke the command or change inner state.
	 */
	softDispatch(keyboardEvent: IKeyboardEvent, target: IContextKeyServiceTarget): ResolutionResult;

	/**
	 * Enable hold mode for this command. This is only possible if the command is current being dispatched, meaning
	 * we are after its keydown and before is keyup event.
	 *
	 * @returns A promise that resolves when hold stops, returns undefined if hold mode could not be enabled.
	 */
	enableKeybindingHoldMode(commandId: string): Promise<void> | undefined;

	dispatchByUserSettingsLabel(userSettingsLabel: string, target: IContextKeyServiceTarget): void;

	/**
	 * Look up keybindings for a command.
	 * Use `lookupKeybinding` if you are interested in the preferred keybinding.
	 */
	lookupKeybindings(commandId: string): ResolvedKeybinding[];

	/**
	 * Look up the preferred (last defined) keybinding for a command.
	 * @returns The preferred keybinding or null if the command is not bound.
	 */
	lookupKeybinding(commandId: string, context?: IContextKeyService, enforceContextCheck?: boolean): ResolvedKeybinding | undefined;

	getDefaultKeybindingsContent(): string;

	getDefaultKeybindings(): readonly ResolvedKeybindingItem[];

	getKeybindings(): readonly ResolvedKeybindingItem[];

	customKeybindingsCount(): number;

	/**
	 * Will the given key event produce a character that's rendered on screen, e.g. in a
	 * text box. *Note* that the results of this function can be incorrect.
	 */
	mightProducePrintableCharacter(event: IKeyboardEvent): boolean;

	registerSchemaContribution(contribution: KeybindingsSchemaContribution): IDisposable;

	toggleLogging(): boolean;

	_dumpDebugInfo(): string;
	_dumpDebugInfoJSON(): string;
}
```

--------------------------------------------------------------------------------

````

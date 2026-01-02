---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 240
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 240 of 552)

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

---[FILE: src/vs/editor/contrib/symbolIcons/browser/symbolIcons.css]---
Location: vscode-main/src/vs/editor/contrib/symbolIcons/browser/symbolIcons.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* stylelint-disable layer-checker */

.monaco-editor .codicon.codicon-symbol-array,
.monaco-workbench .codicon.codicon-symbol-array { color: var(--vscode-symbolIcon-arrayForeground); }
.monaco-editor .codicon.codicon-symbol-boolean,
.monaco-workbench .codicon.codicon-symbol-boolean { color: var(--vscode-symbolIcon-booleanForeground); }
.monaco-editor .codicon.codicon-symbol-class,
.monaco-workbench .codicon.codicon-symbol-class { color: var(--vscode-symbolIcon-classForeground); }
.monaco-editor .codicon.codicon-symbol-method,
.monaco-workbench .codicon.codicon-symbol-method { color: var(--vscode-symbolIcon-methodForeground); }
.monaco-editor .codicon.codicon-symbol-color,
.monaco-workbench .codicon.codicon-symbol-color { color: var(--vscode-symbolIcon-colorForeground); }
.monaco-editor .codicon.codicon-symbol-constant,
.monaco-workbench .codicon.codicon-symbol-constant { color: var(--vscode-symbolIcon-constantForeground); }
.monaco-editor .codicon.codicon-symbol-constructor,
.monaco-workbench .codicon.codicon-symbol-constructor { color: var(--vscode-symbolIcon-constructorForeground); }
.monaco-editor .codicon.codicon-symbol-value,
.monaco-workbench .codicon.codicon-symbol-value,
.monaco-editor .codicon.codicon-symbol-enum,
.monaco-workbench .codicon.codicon-symbol-enum { color: var(--vscode-symbolIcon-enumeratorForeground); }
.monaco-editor .codicon.codicon-symbol-enum-member,
.monaco-workbench .codicon.codicon-symbol-enum-member { color: var(--vscode-symbolIcon-enumeratorMemberForeground); }
.monaco-editor .codicon.codicon-symbol-event,
.monaco-workbench .codicon.codicon-symbol-event { color: var(--vscode-symbolIcon-eventForeground); }
.monaco-editor .codicon.codicon-symbol-field,
.monaco-workbench .codicon.codicon-symbol-field { color: var(--vscode-symbolIcon-fieldForeground); }
.monaco-editor .codicon.codicon-symbol-file,
.monaco-workbench .codicon.codicon-symbol-file { color: var(--vscode-symbolIcon-fileForeground); }
.monaco-editor .codicon.codicon-symbol-folder,
.monaco-workbench .codicon.codicon-symbol-folder { color: var(--vscode-symbolIcon-folderForeground); }
.monaco-editor .codicon.codicon-symbol-function,
.monaco-workbench .codicon.codicon-symbol-function { color: var(--vscode-symbolIcon-functionForeground); }
.monaco-editor .codicon.codicon-symbol-interface,
.monaco-workbench .codicon.codicon-symbol-interface { color: var(--vscode-symbolIcon-interfaceForeground); }
.monaco-editor .codicon.codicon-symbol-key,
.monaco-workbench .codicon.codicon-symbol-key { color: var(--vscode-symbolIcon-keyForeground); }
.monaco-editor .codicon.codicon-symbol-keyword,
.monaco-workbench .codicon.codicon-symbol-keyword { color: var(--vscode-symbolIcon-keywordForeground); }
.monaco-editor .codicon.codicon-symbol-module,
.monaco-workbench .codicon.codicon-symbol-module { color: var(--vscode-symbolIcon-moduleForeground); }
.monaco-editor .codicon.codicon-symbol-namespace,
.monaco-workbench .codicon.codicon-symbol-namespace { color: var(--vscode-symbolIcon-namespaceForeground); }
.monaco-editor .codicon.codicon-symbol-null,
.monaco-workbench .codicon.codicon-symbol-null { color: var(--vscode-symbolIcon-nullForeground); }
.monaco-editor .codicon.codicon-symbol-number,
.monaco-workbench .codicon.codicon-symbol-number { color: var(--vscode-symbolIcon-numberForeground); }
.monaco-editor .codicon.codicon-symbol-object,
.monaco-workbench .codicon.codicon-symbol-object { color: var(--vscode-symbolIcon-objectForeground); }
.monaco-editor .codicon.codicon-symbol-operator,
.monaco-workbench .codicon.codicon-symbol-operator { color: var(--vscode-symbolIcon-operatorForeground); }
.monaco-editor .codicon.codicon-symbol-package,
.monaco-workbench .codicon.codicon-symbol-package { color: var(--vscode-symbolIcon-packageForeground); }
.monaco-editor .codicon.codicon-symbol-property,
.monaco-workbench .codicon.codicon-symbol-property { color: var(--vscode-symbolIcon-propertyForeground); }
.monaco-editor .codicon.codicon-symbol-reference,
.monaco-workbench .codicon.codicon-symbol-reference { color: var(--vscode-symbolIcon-referenceForeground); }
.monaco-editor .codicon.codicon-symbol-snippet,
.monaco-workbench .codicon.codicon-symbol-snippet { color: var(--vscode-symbolIcon-snippetForeground); }
.monaco-editor .codicon.codicon-symbol-string,
.monaco-workbench .codicon.codicon-symbol-string { color: var(--vscode-symbolIcon-stringForeground); }
.monaco-editor .codicon.codicon-symbol-struct,
.monaco-workbench .codicon.codicon-symbol-struct { color: var(--vscode-symbolIcon-structForeground); }
.monaco-editor .codicon.codicon-symbol-text,
.monaco-workbench .codicon.codicon-symbol-text { color: var(--vscode-symbolIcon-textForeground); }
.monaco-editor .codicon.codicon-symbol-type-parameter,
.monaco-workbench .codicon.codicon-symbol-type-parameter { color: var(--vscode-symbolIcon-typeParameterForeground); }
.monaco-editor .codicon.codicon-symbol-unit,
.monaco-workbench .codicon.codicon-symbol-unit { color: var(--vscode-symbolIcon-unitForeground); }
.monaco-editor .codicon.codicon-symbol-variable,
.monaco-workbench .codicon.codicon-symbol-variable { color: var(--vscode-symbolIcon-variableForeground); }
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/symbolIcons/browser/symbolIcons.ts]---
Location: vscode-main/src/vs/editor/contrib/symbolIcons/browser/symbolIcons.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './symbolIcons.css';
import { localize } from '../../../../nls.js';
import { foreground, registerColor } from '../../../../platform/theme/common/colorRegistry.js';

export const SYMBOL_ICON_ARRAY_FOREGROUND = registerColor('symbolIcon.arrayForeground', foreground, localize('symbolIcon.arrayForeground', 'The foreground color for array symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_BOOLEAN_FOREGROUND = registerColor('symbolIcon.booleanForeground', foreground, localize('symbolIcon.booleanForeground', 'The foreground color for boolean symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_CLASS_FOREGROUND = registerColor('symbolIcon.classForeground', {
	dark: '#EE9D28',
	light: '#D67E00',
	hcDark: '#EE9D28',
	hcLight: '#D67E00'
}, localize('symbolIcon.classForeground', 'The foreground color for class symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_COLOR_FOREGROUND = registerColor('symbolIcon.colorForeground', foreground, localize('symbolIcon.colorForeground', 'The foreground color for color symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_CONSTANT_FOREGROUND = registerColor('symbolIcon.constantForeground', foreground, localize('symbolIcon.constantForeground', 'The foreground color for constant symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_CONSTRUCTOR_FOREGROUND = registerColor('symbolIcon.constructorForeground', {
	dark: '#B180D7',
	light: '#652D90',
	hcDark: '#B180D7',
	hcLight: '#652D90'
}, localize('symbolIcon.constructorForeground', 'The foreground color for constructor symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_ENUMERATOR_FOREGROUND = registerColor('symbolIcon.enumeratorForeground', {
	dark: '#EE9D28',
	light: '#D67E00',
	hcDark: '#EE9D28',
	hcLight: '#D67E00'
}, localize('symbolIcon.enumeratorForeground', 'The foreground color for enumerator symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_ENUMERATOR_MEMBER_FOREGROUND = registerColor('symbolIcon.enumeratorMemberForeground', {
	dark: '#75BEFF',
	light: '#007ACC',
	hcDark: '#75BEFF',
	hcLight: '#007ACC'
}, localize('symbolIcon.enumeratorMemberForeground', 'The foreground color for enumerator member symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_EVENT_FOREGROUND = registerColor('symbolIcon.eventForeground', {
	dark: '#EE9D28',
	light: '#D67E00',
	hcDark: '#EE9D28',
	hcLight: '#D67E00'
}, localize('symbolIcon.eventForeground', 'The foreground color for event symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_FIELD_FOREGROUND = registerColor('symbolIcon.fieldForeground', {
	dark: '#75BEFF',
	light: '#007ACC',
	hcDark: '#75BEFF',
	hcLight: '#007ACC'
}, localize('symbolIcon.fieldForeground', 'The foreground color for field symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_FILE_FOREGROUND = registerColor('symbolIcon.fileForeground', foreground, localize('symbolIcon.fileForeground', 'The foreground color for file symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_FOLDER_FOREGROUND = registerColor('symbolIcon.folderForeground', foreground, localize('symbolIcon.folderForeground', 'The foreground color for folder symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_FUNCTION_FOREGROUND = registerColor('symbolIcon.functionForeground', {
	dark: '#B180D7',
	light: '#652D90',
	hcDark: '#B180D7',
	hcLight: '#652D90'
}, localize('symbolIcon.functionForeground', 'The foreground color for function symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_INTERFACE_FOREGROUND = registerColor('symbolIcon.interfaceForeground', {
	dark: '#75BEFF',
	light: '#007ACC',
	hcDark: '#75BEFF',
	hcLight: '#007ACC'
}, localize('symbolIcon.interfaceForeground', 'The foreground color for interface symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_KEY_FOREGROUND = registerColor('symbolIcon.keyForeground', foreground, localize('symbolIcon.keyForeground', 'The foreground color for key symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_KEYWORD_FOREGROUND = registerColor('symbolIcon.keywordForeground', foreground, localize('symbolIcon.keywordForeground', 'The foreground color for keyword symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_METHOD_FOREGROUND = registerColor('symbolIcon.methodForeground', {
	dark: '#B180D7',
	light: '#652D90',
	hcDark: '#B180D7',
	hcLight: '#652D90'
}, localize('symbolIcon.methodForeground', 'The foreground color for method symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_MODULE_FOREGROUND = registerColor('symbolIcon.moduleForeground', foreground, localize('symbolIcon.moduleForeground', 'The foreground color for module symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_NAMESPACE_FOREGROUND = registerColor('symbolIcon.namespaceForeground', foreground, localize('symbolIcon.namespaceForeground', 'The foreground color for namespace symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_NULL_FOREGROUND = registerColor('symbolIcon.nullForeground', foreground, localize('symbolIcon.nullForeground', 'The foreground color for null symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_NUMBER_FOREGROUND = registerColor('symbolIcon.numberForeground', foreground, localize('symbolIcon.numberForeground', 'The foreground color for number symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_OBJECT_FOREGROUND = registerColor('symbolIcon.objectForeground', foreground, localize('symbolIcon.objectForeground', 'The foreground color for object symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_OPERATOR_FOREGROUND = registerColor('symbolIcon.operatorForeground', foreground, localize('symbolIcon.operatorForeground', 'The foreground color for operator symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_PACKAGE_FOREGROUND = registerColor('symbolIcon.packageForeground', foreground, localize('symbolIcon.packageForeground', 'The foreground color for package symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_PROPERTY_FOREGROUND = registerColor('symbolIcon.propertyForeground', foreground, localize('symbolIcon.propertyForeground', 'The foreground color for property symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_REFERENCE_FOREGROUND = registerColor('symbolIcon.referenceForeground', foreground, localize('symbolIcon.referenceForeground', 'The foreground color for reference symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_SNIPPET_FOREGROUND = registerColor('symbolIcon.snippetForeground', foreground, localize('symbolIcon.snippetForeground', 'The foreground color for snippet symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_STRING_FOREGROUND = registerColor('symbolIcon.stringForeground', foreground, localize('symbolIcon.stringForeground', 'The foreground color for string symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_STRUCT_FOREGROUND = registerColor('symbolIcon.structForeground', foreground, localize('symbolIcon.structForeground', 'The foreground color for struct symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_TEXT_FOREGROUND = registerColor('symbolIcon.textForeground', foreground, localize('symbolIcon.textForeground', 'The foreground color for text symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_TYPEPARAMETER_FOREGROUND = registerColor('symbolIcon.typeParameterForeground', foreground, localize('symbolIcon.typeParameterForeground', 'The foreground color for type parameter symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_UNIT_FOREGROUND = registerColor('symbolIcon.unitForeground', foreground, localize('symbolIcon.unitForeground', 'The foreground color for unit symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));

export const SYMBOL_ICON_VARIABLE_FOREGROUND = registerColor('symbolIcon.variableForeground', {
	dark: '#75BEFF',
	light: '#007ACC',
	hcDark: '#75BEFF',
	hcLight: '#007ACC',
}, localize('symbolIcon.variableForeground', 'The foreground color for variable symbols. These symbols appear in the outline, breadcrumb, and suggest widget.'));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/toggleTabFocusMode/browser/toggleTabFocusMode.ts]---
Location: vscode-main/src/vs/editor/contrib/toggleTabFocusMode/browser/toggleTabFocusMode.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { alert } from '../../../../base/browser/ui/aria/aria.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { TabFocus } from '../../../browser/config/tabFocus.js';
import * as nls from '../../../../nls.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';

export class ToggleTabFocusModeAction extends Action2 {

	public static readonly ID = 'editor.action.toggleTabFocusMode';

	constructor() {
		super({
			id: ToggleTabFocusModeAction.ID,
			title: nls.localize2({ key: 'toggle.tabMovesFocus', comment: ['Turn on/off use of tab key for moving focus around VS Code'] }, 'Toggle Tab Key Moves Focus'),
			precondition: undefined,
			keybinding: {
				primary: KeyMod.CtrlCmd | KeyCode.KeyM,
				mac: { primary: KeyMod.WinCtrl | KeyMod.Shift | KeyCode.KeyM },
				weight: KeybindingWeight.EditorContrib
			},
			metadata: {
				description: nls.localize2('tabMovesFocusDescriptions', "Determines whether the tab key moves focus around the workbench or inserts the tab character in the current editor. This is also called tab trapping, tab navigation, or tab focus mode."),
			},
			f1: true
		});
	}

	public run(): void {
		const oldValue = TabFocus.getTabFocusMode();
		const newValue = !oldValue;
		TabFocus.setTabFocusMode(newValue);
		if (newValue) {
			alert(nls.localize('toggle.tabMovesFocus.on', "Pressing Tab will now move focus to the next focusable element"));
		} else {
			alert(nls.localize('toggle.tabMovesFocus.off', "Pressing Tab will now insert the tab character"));
		}
	}
}

registerAction2(ToggleTabFocusModeAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/tokenization/browser/tokenization.ts]---
Location: vscode-main/src/vs/editor/contrib/tokenization/browser/tokenization.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { StopWatch } from '../../../../base/common/stopwatch.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, registerEditorAction, ServicesAccessor } from '../../../browser/editorExtensions.js';
import * as nls from '../../../../nls.js';

class ForceRetokenizeAction extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.forceRetokenize',
			label: nls.localize2('forceRetokenize', "Developer: Force Retokenize"),
			precondition: undefined
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		if (!editor.hasModel()) {
			return;
		}
		const model = editor.getModel();
		model.tokenization.resetTokenization();
		const sw = new StopWatch();
		model.tokenization.forceTokenization(model.getLineCount());
		sw.stop();
		console.log(`tokenization took ${sw.elapsed()}`);

	}
}

registerEditorAction(ForceRetokenizeAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/unicodeHighlighter/browser/bannerController.css]---
Location: vscode-main/src/vs/editor/contrib/unicodeHighlighter/browser/bannerController.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.editor-banner {
	box-sizing: border-box;
	cursor: default;
	width: 100%;
	font-size: 12px;
	display: flex;
	overflow: visible;

	height: 26px;

	background: var(--vscode-banner-background);
}


.editor-banner .icon-container {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	padding: 0 6px 0 10px;
}

.editor-banner .icon-container.custom-icon {
	background-repeat: no-repeat;
	background-position: center center;
	background-size: 16px;
	width: 16px;
	padding: 0;
	margin: 0 6px 0 10px;
}

.editor-banner .message-container {
	display: flex;
	align-items: center;
	line-height: 26px;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.editor-banner .message-container p {
	margin-block-start: 0;
	margin-block-end: 0;
}

.editor-banner .message-actions-container {
	flex-grow: 1;
	flex-shrink: 0;
	line-height: 26px;
	margin: 0 4px;
}

.editor-banner .message-actions-container a.monaco-button {
	width: inherit;
	margin: 2px 8px;
	padding: 0px 12px;
}

.editor-banner .message-actions-container a {
	padding: 3px;
	margin-left: 12px;
	text-decoration: underline;
}

.editor-banner .action-container {
	padding: 0 10px 0 6px;
}

.editor-banner {
	background-color: var(--vscode-banner-background);
}

.editor-banner,
.editor-banner .action-container .codicon,
.editor-banner .message-actions-container .monaco-link {
	color: var(--vscode-banner-foreground);
}

.editor-banner .icon-container .codicon {
	color: var(--vscode-banner-iconForeground);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/unicodeHighlighter/browser/bannerController.ts]---
Location: vscode-main/src/vs/editor/contrib/unicodeHighlighter/browser/bannerController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import './bannerController.css';
import { localize } from '../../../../nls.js';
import { $, append, clearNode } from '../../../../base/browser/dom.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { Action } from '../../../../base/common/actions.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IMarkdownRendererService } from '../../../../platform/markdown/browser/markdownRenderer.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILinkDescriptor, Link } from '../../../../platform/opener/browser/link.js';
import { widgetClose } from '../../../../platform/theme/common/iconRegistry.js';
import { ThemeIcon } from '../../../../base/common/themables.js';

const BANNER_ELEMENT_HEIGHT = 26;

export class BannerController extends Disposable {
	private readonly banner: Banner;

	constructor(
		private readonly _editor: ICodeEditor,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();

		this.banner = this._register(this.instantiationService.createInstance(Banner));
	}

	public hide() {
		this._editor.setBanner(null, 0);
		this.banner.clear();
	}

	public show(item: IBannerItem) {
		this.banner.show({
			...item,
			onClose: () => {
				this.hide();
				item.onClose?.();
			}
		});
		this._editor.setBanner(this.banner.element, BANNER_ELEMENT_HEIGHT);
	}
}

// TODO@hediet: Investigate if this can be reused by the workspace banner (bannerPart.ts).
class Banner extends Disposable {
	public element: HTMLElement;

	private messageActionsContainer: HTMLElement | undefined;

	private actionBar: ActionBar | undefined;

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IMarkdownRendererService private readonly markdownRendererService: IMarkdownRendererService,
	) {
		super();

		this.element = $('div.editor-banner');
		this.element.tabIndex = 0;
	}

	private getAriaLabel(item: IBannerItem): string | undefined {
		if (item.ariaLabel) {
			return item.ariaLabel;
		}
		if (typeof item.message === 'string') {
			return item.message;
		}

		return undefined;
	}

	private getBannerMessage(message: MarkdownString | string): HTMLElement {
		if (typeof message === 'string') {
			const element = $('span');
			element.innerText = message;
			return element;
		}

		return this.markdownRendererService.render(message).element;
	}

	public clear() {
		clearNode(this.element);
	}

	public show(item: IBannerItem) {
		// Clear previous item
		clearNode(this.element);

		// Banner aria label
		const ariaLabel = this.getAriaLabel(item);
		if (ariaLabel) {
			this.element.setAttribute('aria-label', ariaLabel);
		}

		// Icon
		const iconContainer = append(this.element, $('div.icon-container'));
		iconContainer.setAttribute('aria-hidden', 'true');

		if (item.icon) {
			iconContainer.appendChild($(`div${ThemeIcon.asCSSSelector(item.icon)}`));
		}

		// Message
		const messageContainer = append(this.element, $('div.message-container'));
		messageContainer.setAttribute('aria-hidden', 'true');
		messageContainer.appendChild(this.getBannerMessage(item.message));

		// Message Actions
		this.messageActionsContainer = append(this.element, $('div.message-actions-container'));
		if (item.actions) {
			for (const action of item.actions) {
				this._register(this.instantiationService.createInstance(Link, this.messageActionsContainer, { ...action, tabIndex: -1 }, {}));
			}
		}

		// Action
		const actionBarContainer = append(this.element, $('div.action-container'));
		this.actionBar = this._register(new ActionBar(actionBarContainer));
		this.actionBar.push(this._register(
			new Action(
				'banner.close',
				localize('closeBanner', "Close Banner"),
				ThemeIcon.asClassName(widgetClose),
				true,
				() => {
					if (typeof item.onClose === 'function') {
						item.onClose();
					}
				}
			)
		), { icon: true, label: false });
		this.actionBar.setFocusable(false);
	}
}

export interface IBannerItem {
	readonly id: string;
	readonly icon: ThemeIcon | undefined;
	readonly message: string | MarkdownString;
	readonly actions?: ILinkDescriptor[];
	readonly ariaLabel?: string;
	readonly onClose?: () => void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/unicodeHighlighter/browser/unicodeHighlighter.css]---
Location: vscode-main/src/vs/editor/contrib/unicodeHighlighter/browser/unicodeHighlighter.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .unicode-highlight {
	border: 1px solid var(--vscode-editorUnicodeHighlight-border);
	background-color: var(--vscode-editorUnicodeHighlight-background);
	box-sizing: border-box;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/unicodeHighlighter/browser/unicodeHighlighter.ts]---
Location: vscode-main/src/vs/editor/contrib/unicodeHighlighter/browser/unicodeHighlighter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RunOnceScheduler } from '../../../../base/common/async.js';
import { CharCode } from '../../../../base/common/charCode.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { createCommandUri, MarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import * as platform from '../../../../base/common/platform.js';
import { InvisibleCharacters, isBasicASCII } from '../../../../base/common/strings.js';
import './unicodeHighlighter.css';
import { IActiveCodeEditor, ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, EditorContributionInstantiation, registerEditorContribution, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { InUntrustedWorkspace, inUntrustedWorkspace, EditorOption, InternalUnicodeHighlightOptions, unicodeHighlightConfigKeys } from '../../../common/config/editorOptions.js';
import { Range } from '../../../common/core/range.js';
import { IEditorContribution } from '../../../common/editorCommon.js';
import { IModelDecoration, IModelDeltaDecoration, ITextModel, TrackedRangeStickiness } from '../../../common/model.js';
import { ModelDecorationOptions } from '../../../common/model/textModel.js';
import { UnicodeHighlighterOptions, UnicodeHighlighterReason, UnicodeHighlighterReasonKind, UnicodeTextModelHighlighter } from '../../../common/services/unicodeTextModelHighlighter.js';
import { IEditorWorkerService, IUnicodeHighlightsResult } from '../../../common/services/editorWorker.js';
import { HoverAnchor, HoverAnchorType, HoverParticipantRegistry, IEditorHoverParticipant, IEditorHoverRenderContext, IHoverPart, IRenderedHoverParts } from '../../hover/browser/hoverTypes.js';
import { MarkdownHover, renderMarkdownHovers } from '../../hover/browser/markdownHoverParticipant.js';
import { BannerController } from './bannerController.js';
import * as nls from '../../../../nls.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IQuickInputService, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { IWorkspaceTrustManagementService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { safeIntl } from '../../../../base/common/date.js';
import { isModelDecorationInComment, isModelDecorationInString, isModelDecorationVisible } from '../../../common/viewModel/viewModelDecoration.js';
import { IMarkdownRendererService } from '../../../../platform/markdown/browser/markdownRenderer.js';

export const warningIcon = registerIcon('extensions-warning-message', Codicon.warning, nls.localize('warningIcon', 'Icon shown with a warning message in the extensions editor.'));

export class UnicodeHighlighter extends Disposable implements IEditorContribution {
	public static readonly ID = 'editor.contrib.unicodeHighlighter';

	private _highlighter: DocumentUnicodeHighlighter | ViewportUnicodeHighlighter | null = null;
	private _options: InternalUnicodeHighlightOptions;

	private readonly _bannerController: BannerController;
	private _bannerClosed: boolean = false;

	constructor(
		private readonly _editor: ICodeEditor,
		@IEditorWorkerService private readonly _editorWorkerService: IEditorWorkerService,
		@IWorkspaceTrustManagementService private readonly _workspaceTrustService: IWorkspaceTrustManagementService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super();

		this._bannerController = this._register(instantiationService.createInstance(BannerController, _editor));

		this._register(this._editor.onDidChangeModel(() => {
			this._bannerClosed = false;
			this._updateHighlighter();
		}));

		this._options = _editor.getOption(EditorOption.unicodeHighlighting);

		this._register(_workspaceTrustService.onDidChangeTrust(e => {
			this._updateHighlighter();
		}));

		this._register(_editor.onDidChangeConfiguration(e => {
			if (e.hasChanged(EditorOption.unicodeHighlighting)) {
				this._options = _editor.getOption(EditorOption.unicodeHighlighting);
				this._updateHighlighter();
			}
		}));

		this._updateHighlighter();
	}

	public override dispose(): void {
		if (this._highlighter) {
			this._highlighter.dispose();
			this._highlighter = null;
		}
		super.dispose();
	}

	private readonly _updateState = (state: IUnicodeHighlightsResult | null): void => {
		if (state && state.hasMore) {
			if (this._bannerClosed) {
				return;
			}

			// This document contains many non-basic ASCII characters.
			const max = Math.max(state.ambiguousCharacterCount, state.nonBasicAsciiCharacterCount, state.invisibleCharacterCount);

			let data;
			if (state.nonBasicAsciiCharacterCount >= max) {
				data = {
					message: nls.localize('unicodeHighlighting.thisDocumentHasManyNonBasicAsciiUnicodeCharacters', 'This document contains many non-basic ASCII unicode characters'),
					command: new DisableHighlightingOfNonBasicAsciiCharactersAction(),
				};
			} else if (state.ambiguousCharacterCount >= max) {
				data = {
					message: nls.localize('unicodeHighlighting.thisDocumentHasManyAmbiguousUnicodeCharacters', 'This document contains many ambiguous unicode characters'),
					command: new DisableHighlightingOfAmbiguousCharactersAction(),
				};
			} else if (state.invisibleCharacterCount >= max) {
				data = {
					message: nls.localize('unicodeHighlighting.thisDocumentHasManyInvisibleUnicodeCharacters', 'This document contains many invisible unicode characters'),
					command: new DisableHighlightingOfInvisibleCharactersAction(),
				};
			} else {
				throw new Error('Unreachable');
			}

			this._bannerController.show({
				id: 'unicodeHighlightBanner',
				message: data.message,
				icon: warningIcon,
				actions: [
					{
						label: data.command.shortLabel,
						href: `command:${data.command.desc.id}`
					}
				],
				onClose: () => {
					this._bannerClosed = true;
				},
			});
		} else {
			this._bannerController.hide();
		}
	};

	private _updateHighlighter(): void {
		this._updateState(null);

		if (this._highlighter) {
			this._highlighter.dispose();
			this._highlighter = null;
		}
		if (!this._editor.hasModel()) {
			return;
		}
		const options = resolveOptions(this._workspaceTrustService.isWorkspaceTrusted(), this._options);

		if (
			[
				options.nonBasicASCII,
				options.ambiguousCharacters,
				options.invisibleCharacters,
			].every((option) => option === false)
		) {
			// Don't do anything if the feature is fully disabled
			return;
		}

		const highlightOptions: UnicodeHighlighterOptions = {
			nonBasicASCII: options.nonBasicASCII,
			ambiguousCharacters: options.ambiguousCharacters,
			invisibleCharacters: options.invisibleCharacters,
			includeComments: options.includeComments,
			includeStrings: options.includeStrings,
			allowedCodePoints: Object.keys(options.allowedCharacters).map(c => c.codePointAt(0)!),
			allowedLocales: Object.keys(options.allowedLocales).map(locale => {
				if (locale === '_os') {
					const osLocale = safeIntl.NumberFormat().value.resolvedOptions().locale;
					return osLocale;
				} else if (locale === '_vscode') {
					return platform.language;
				}
				return locale;
			}),
		};

		if (this._editorWorkerService.canComputeUnicodeHighlights(this._editor.getModel().uri)) {
			this._highlighter = new DocumentUnicodeHighlighter(this._editor, highlightOptions, this._updateState, this._editorWorkerService);
		} else {
			this._highlighter = new ViewportUnicodeHighlighter(this._editor, highlightOptions, this._updateState);
		}
	}

	public getDecorationInfo(decoration: IModelDecoration): UnicodeHighlighterDecorationInfo | null {
		if (this._highlighter) {
			return this._highlighter.getDecorationInfo(decoration);
		}
		return null;
	}
}

export interface UnicodeHighlighterDecorationInfo {
	reason: UnicodeHighlighterReason;
	inComment: boolean;
	inString: boolean;
}

type Resolve<T> =
	T extends InUntrustedWorkspace ? never
	: T extends 'auto' ? never : T;

type ResolvedOptions = { [TKey in keyof InternalUnicodeHighlightOptions]: Resolve<InternalUnicodeHighlightOptions[TKey]> };

function resolveOptions(trusted: boolean, options: InternalUnicodeHighlightOptions): ResolvedOptions {
	return {
		nonBasicASCII: options.nonBasicASCII === inUntrustedWorkspace ? !trusted : options.nonBasicASCII,
		ambiguousCharacters: options.ambiguousCharacters,
		invisibleCharacters: options.invisibleCharacters,
		includeComments: options.includeComments === inUntrustedWorkspace ? !trusted : options.includeComments,
		includeStrings: options.includeStrings === inUntrustedWorkspace ? !trusted : options.includeStrings,
		allowedCharacters: options.allowedCharacters,
		allowedLocales: options.allowedLocales,
	};
}

class DocumentUnicodeHighlighter extends Disposable {
	private readonly _model: ITextModel;
	private readonly _updateSoon: RunOnceScheduler;
	private _decorations;

	constructor(
		private readonly _editor: IActiveCodeEditor,
		private readonly _options: UnicodeHighlighterOptions,
		private readonly _updateState: (state: IUnicodeHighlightsResult | null) => void,
		@IEditorWorkerService private readonly _editorWorkerService: IEditorWorkerService,
	) {
		super();
		this._model = this._editor.getModel();
		this._decorations = this._editor.createDecorationsCollection();
		this._updateSoon = this._register(new RunOnceScheduler(() => this._update(), 250));

		this._register(this._editor.onDidChangeModelContent(() => {
			this._updateSoon.schedule();
		}));

		this._updateSoon.schedule();
	}

	public override dispose() {
		this._decorations.clear();
		super.dispose();
	}

	private _update(): void {
		if (this._model.isDisposed()) {
			return;
		}

		if (!this._model.mightContainNonBasicASCII()) {
			this._decorations.clear();
			return;
		}

		const modelVersionId = this._model.getVersionId();
		this._editorWorkerService
			.computedUnicodeHighlights(this._model.uri, this._options)
			.then((info) => {
				if (this._model.isDisposed()) {
					return;
				}
				if (this._model.getVersionId() !== modelVersionId) {
					// model changed in the meantime
					return;
				}
				this._updateState(info);

				const decorations: IModelDeltaDecoration[] = [];
				if (!info.hasMore) {
					// Don't show decoration if there are too many.
					// In this case, a banner is shown.
					for (const range of info.ranges) {
						decorations.push({
							range: range,
							options: Decorations.instance.getDecorationFromOptions(this._options),
						});
					}
				}
				this._decorations.set(decorations);
			});
	}

	public getDecorationInfo(decoration: IModelDecoration): UnicodeHighlighterDecorationInfo | null {
		if (!this._decorations.has(decoration)) {
			return null;
		}
		const model = this._editor.getModel();
		if (
			!isModelDecorationVisible(model, decoration)
		) {
			return null;
		}
		const text = model.getValueInRange(decoration.range);
		return {
			reason: computeReason(text, this._options)!,
			inComment: isModelDecorationInComment(model, decoration),
			inString: isModelDecorationInString(model, decoration),
		};
	}
}

class ViewportUnicodeHighlighter extends Disposable {

	private readonly _model: ITextModel;
	private readonly _updateSoon: RunOnceScheduler;
	private readonly _decorations;

	constructor(
		private readonly _editor: IActiveCodeEditor,
		private readonly _options: UnicodeHighlighterOptions,
		private readonly _updateState: (state: IUnicodeHighlightsResult | null) => void,
	) {
		super();
		this._model = this._editor.getModel();
		this._decorations = this._editor.createDecorationsCollection();

		this._updateSoon = this._register(new RunOnceScheduler(() => this._update(), 250));

		this._register(this._editor.onDidLayoutChange(() => {
			this._updateSoon.schedule();
		}));
		this._register(this._editor.onDidScrollChange(() => {
			this._updateSoon.schedule();
		}));
		this._register(this._editor.onDidChangeHiddenAreas(() => {
			this._updateSoon.schedule();
		}));
		this._register(this._editor.onDidChangeModelContent(() => {
			this._updateSoon.schedule();
		}));

		this._updateSoon.schedule();
	}

	public override dispose() {
		this._decorations.clear();
		super.dispose();
	}

	private _update(): void {
		if (this._model.isDisposed()) {
			return;
		}

		if (!this._model.mightContainNonBasicASCII()) {
			this._decorations.clear();
			return;
		}

		const ranges = this._editor.getVisibleRanges();
		const decorations: IModelDeltaDecoration[] = [];
		const totalResult: IUnicodeHighlightsResult = {
			ranges: [],
			ambiguousCharacterCount: 0,
			invisibleCharacterCount: 0,
			nonBasicAsciiCharacterCount: 0,
			hasMore: false,
		};
		for (const range of ranges) {
			const result = UnicodeTextModelHighlighter.computeUnicodeHighlights(this._model, this._options, range);
			for (const r of result.ranges) {
				totalResult.ranges.push(r);
			}
			totalResult.ambiguousCharacterCount += totalResult.ambiguousCharacterCount;
			totalResult.invisibleCharacterCount += totalResult.invisibleCharacterCount;
			totalResult.nonBasicAsciiCharacterCount += totalResult.nonBasicAsciiCharacterCount;
			totalResult.hasMore = totalResult.hasMore || result.hasMore;
		}

		if (!totalResult.hasMore) {
			// Don't show decorations if there are too many.
			// A banner will be shown instead.
			for (const range of totalResult.ranges) {
				decorations.push({ range, options: Decorations.instance.getDecorationFromOptions(this._options) });
			}
		}
		this._updateState(totalResult);

		this._decorations.set(decorations);
	}

	public getDecorationInfo(decoration: IModelDecoration): UnicodeHighlighterDecorationInfo | null {
		if (!this._decorations.has(decoration)) {
			return null;
		}
		const model = this._editor.getModel();
		const text = model.getValueInRange(decoration.range);
		if (!isModelDecorationVisible(model, decoration)) {
			return null;
		}
		return {
			reason: computeReason(text, this._options)!,
			inComment: isModelDecorationInComment(model, decoration),
			inString: isModelDecorationInString(model, decoration),
		};
	}
}

export class UnicodeHighlighterHover implements IHoverPart {
	constructor(
		public readonly owner: IEditorHoverParticipant<UnicodeHighlighterHover>,
		public readonly range: Range,
		public readonly decoration: IModelDecoration
	) { }

	public isValidForHoverAnchor(anchor: HoverAnchor): boolean {
		return (
			anchor.type === HoverAnchorType.Range
			&& this.range.startColumn <= anchor.range.startColumn
			&& this.range.endColumn >= anchor.range.endColumn
		);
	}
}

const configureUnicodeHighlightOptionsStr = nls.localize('unicodeHighlight.configureUnicodeHighlightOptions', 'Configure Unicode Highlight Options');

export class UnicodeHighlighterHoverParticipant implements IEditorHoverParticipant<MarkdownHover> {

	public readonly hoverOrdinal: number = 5;

	constructor(
		private readonly _editor: ICodeEditor,
		@IMarkdownRendererService private readonly _markdownRendererService: IMarkdownRendererService,
	) { }

	computeSync(anchor: HoverAnchor, lineDecorations: IModelDecoration[]): MarkdownHover[] {
		if (!this._editor.hasModel() || anchor.type !== HoverAnchorType.Range) {
			return [];
		}

		const model = this._editor.getModel();

		const unicodeHighlighter = this._editor.getContribution<UnicodeHighlighter>(UnicodeHighlighter.ID);
		if (!unicodeHighlighter) {
			return [];
		}

		const result: MarkdownHover[] = [];
		const existedReason = new Set<string>();
		let index = 300;
		for (const d of lineDecorations) {

			const highlightInfo = unicodeHighlighter.getDecorationInfo(d);
			if (!highlightInfo) {
				continue;
			}
			const char = model.getValueInRange(d.range);
			// text refers to a single character.
			const codePoint = char.codePointAt(0)!;

			const codePointStr = formatCodePointMarkdown(codePoint);

			let reason: string;
			switch (highlightInfo.reason.kind) {
				case UnicodeHighlighterReasonKind.Ambiguous: {
					if (isBasicASCII(highlightInfo.reason.confusableWith)) {
						reason = nls.localize(
							'unicodeHighlight.characterIsAmbiguousASCII',
							'The character {0} could be confused with the ASCII character {1}, which is more common in source code.',
							codePointStr,
							formatCodePointMarkdown(highlightInfo.reason.confusableWith.codePointAt(0)!)
						);
					} else {
						reason = nls.localize(
							'unicodeHighlight.characterIsAmbiguous',
							'The character {0} could be confused with the character {1}, which is more common in source code.',
							codePointStr,
							formatCodePointMarkdown(highlightInfo.reason.confusableWith.codePointAt(0)!)
						);
					}
					break;
				}

				case UnicodeHighlighterReasonKind.Invisible:
					reason = nls.localize(
						'unicodeHighlight.characterIsInvisible',
						'The character {0} is invisible.',
						codePointStr
					);
					break;

				case UnicodeHighlighterReasonKind.NonBasicAscii:
					reason = nls.localize(
						'unicodeHighlight.characterIsNonBasicAscii',
						'The character {0} is not a basic ASCII character.',
						codePointStr
					);
					break;
			}

			if (existedReason.has(reason)) {
				continue;
			}
			existedReason.add(reason);

			const adjustSettingsArgs: ShowExcludeOptionsArgs = {
				codePoint: codePoint,
				reason: highlightInfo.reason,
				inComment: highlightInfo.inComment,
				inString: highlightInfo.inString,
			};

			const adjustSettings = nls.localize('unicodeHighlight.adjustSettings', 'Adjust settings');
			const uri = createCommandUri(ShowExcludeOptions.ID, adjustSettingsArgs);
			const markdown = new MarkdownString('', true)
				.appendMarkdown(reason)
				.appendText(' ')
				.appendLink(uri, adjustSettings, configureUnicodeHighlightOptionsStr);
			result.push(new MarkdownHover(this, d.range, [markdown], false, index++));
		}
		return result;
	}

	public renderHoverParts(context: IEditorHoverRenderContext, hoverParts: MarkdownHover[]): IRenderedHoverParts<MarkdownHover> {
		return renderMarkdownHovers(context, hoverParts, this._editor, this._markdownRendererService);
	}

	public getAccessibleContent(hoverPart: MarkdownHover): string {
		return hoverPart.contents.map(c => c.value).join('\n');
	}
}

function codePointToHex(codePoint: number): string {
	return `U+${codePoint.toString(16).padStart(4, '0')}`;
}

function formatCodePointMarkdown(codePoint: number) {
	let value = `\`${codePointToHex(codePoint)}\``;
	if (!InvisibleCharacters.isInvisibleCharacter(codePoint)) {
		// Don't render any control characters or any invisible characters, as they cannot be seen anyways.
		value += ` "${`${renderCodePointAsInlineCode(codePoint)}`}"`;
	}
	return value;
}

function renderCodePointAsInlineCode(codePoint: number): string {
	if (codePoint === CharCode.BackTick) {
		return '`` ` ``';
	}
	return '`' + String.fromCodePoint(codePoint) + '`';
}

function computeReason(char: string, options: UnicodeHighlighterOptions): UnicodeHighlighterReason | null {
	return UnicodeTextModelHighlighter.computeUnicodeHighlightReason(char, options);
}

class Decorations {
	public static readonly instance = new Decorations();

	private readonly map = new Map<string, ModelDecorationOptions>();

	getDecorationFromOptions(options: UnicodeHighlighterOptions): ModelDecorationOptions {
		return this.getDecoration(!options.includeComments, !options.includeStrings);
	}

	private getDecoration(hideInComments: boolean, hideInStrings: boolean): ModelDecorationOptions {
		const key = `${hideInComments}${hideInStrings}`;
		let options = this.map.get(key);
		if (!options) {
			options = ModelDecorationOptions.createDynamic({
				description: 'unicode-highlight',
				stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
				className: 'unicode-highlight',
				showIfCollapsed: true,
				overviewRuler: null,
				minimap: null,
				hideInCommentTokens: hideInComments,
				hideInStringTokens: hideInStrings,
			});
			this.map.set(key, options);
		}
		return options;
	}
}

interface IDisableUnicodeHighlightAction {
	shortLabel: string;
}

export class DisableHighlightingInCommentsAction extends EditorAction implements IDisableUnicodeHighlightAction {
	public static ID = 'editor.action.unicodeHighlight.disableHighlightingInComments';
	public readonly shortLabel = nls.localize('unicodeHighlight.disableHighlightingInComments.shortLabel', 'Disable Highlight In Comments');
	constructor() {
		super({
			id: DisableHighlightingOfAmbiguousCharactersAction.ID,
			label: nls.localize2('action.unicodeHighlight.disableHighlightingInComments', "Disable highlighting of characters in comments"),
			precondition: undefined
		});
	}

	public async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);
		if (configurationService) {
			this.runAction(configurationService);
		}
	}

	public async runAction(configurationService: IConfigurationService): Promise<void> {
		await configurationService.updateValue(unicodeHighlightConfigKeys.includeComments, false, ConfigurationTarget.USER);
	}
}

export class DisableHighlightingInStringsAction extends EditorAction implements IDisableUnicodeHighlightAction {
	public static ID = 'editor.action.unicodeHighlight.disableHighlightingInStrings';
	public readonly shortLabel = nls.localize('unicodeHighlight.disableHighlightingInStrings.shortLabel', 'Disable Highlight In Strings');
	constructor() {
		super({
			id: DisableHighlightingOfAmbiguousCharactersAction.ID,
			label: nls.localize2('action.unicodeHighlight.disableHighlightingInStrings', "Disable highlighting of characters in strings"),
			precondition: undefined
		});
	}

	public async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);
		if (configurationService) {
			this.runAction(configurationService);
		}
	}

	public async runAction(configurationService: IConfigurationService): Promise<void> {
		await configurationService.updateValue(unicodeHighlightConfigKeys.includeStrings, false, ConfigurationTarget.USER);
	}
}

export class DisableHighlightingOfAmbiguousCharactersAction extends Action2 implements IDisableUnicodeHighlightAction {
	public static ID = 'editor.action.unicodeHighlight.disableHighlightingOfAmbiguousCharacters';
	public readonly shortLabel = nls.localize('unicodeHighlight.disableHighlightingOfAmbiguousCharacters.shortLabel', 'Disable Ambiguous Highlight');
	constructor() {
		super({
			id: DisableHighlightingOfAmbiguousCharactersAction.ID,
			title: nls.localize2('action.unicodeHighlight.disableHighlightingOfAmbiguousCharacters', "Disable highlighting of ambiguous characters"),
			precondition: undefined,
			f1: false,
		});
	}

	public async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);
		if (configurationService) {
			this.runAction(configurationService);
		}
	}

	public async runAction(configurationService: IConfigurationService): Promise<void> {
		await configurationService.updateValue(unicodeHighlightConfigKeys.ambiguousCharacters, false, ConfigurationTarget.USER);
	}
}

export class DisableHighlightingOfInvisibleCharactersAction extends Action2 implements IDisableUnicodeHighlightAction {
	public static ID = 'editor.action.unicodeHighlight.disableHighlightingOfInvisibleCharacters';
	public readonly shortLabel = nls.localize('unicodeHighlight.disableHighlightingOfInvisibleCharacters.shortLabel', 'Disable Invisible Highlight');
	constructor() {
		super({
			id: DisableHighlightingOfInvisibleCharactersAction.ID,
			title: nls.localize2('action.unicodeHighlight.disableHighlightingOfInvisibleCharacters', "Disable highlighting of invisible characters"),
			precondition: undefined,
			f1: false,
		});
	}

	public async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);
		if (configurationService) {
			this.runAction(configurationService);
		}
	}

	public async runAction(configurationService: IConfigurationService): Promise<void> {
		await configurationService.updateValue(unicodeHighlightConfigKeys.invisibleCharacters, false, ConfigurationTarget.USER);
	}
}

export class DisableHighlightingOfNonBasicAsciiCharactersAction extends Action2 implements IDisableUnicodeHighlightAction {
	public static ID = 'editor.action.unicodeHighlight.disableHighlightingOfNonBasicAsciiCharacters';
	public readonly shortLabel = nls.localize('unicodeHighlight.disableHighlightingOfNonBasicAsciiCharacters.shortLabel', 'Disable Non ASCII Highlight');
	constructor() {
		super({
			id: DisableHighlightingOfNonBasicAsciiCharactersAction.ID,
			title: nls.localize2('action.unicodeHighlight.disableHighlightingOfNonBasicAsciiCharacters', "Disable highlighting of non basic ASCII characters"),
			precondition: undefined,
			f1: false,
		});
	}

	public async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);
		if (configurationService) {
			this.runAction(configurationService);
		}
	}

	public async runAction(configurationService: IConfigurationService): Promise<void> {
		await configurationService.updateValue(unicodeHighlightConfigKeys.nonBasicASCII, false, ConfigurationTarget.USER);
	}
}

interface ShowExcludeOptionsArgs {
	codePoint: number;
	reason: UnicodeHighlighterReason;
	inComment: boolean;
	inString: boolean;
}

export class ShowExcludeOptions extends Action2 {
	public static ID = 'editor.action.unicodeHighlight.showExcludeOptions';
	constructor() {
		super({
			id: ShowExcludeOptions.ID,
			title: nls.localize2('action.unicodeHighlight.showExcludeOptions', "Show Exclude Options"),
			precondition: undefined,
			f1: false,
		});
	}

	public async run(accessor: ServicesAccessor, args: any): Promise<void> {
		const { codePoint, reason, inString, inComment } = args as ShowExcludeOptionsArgs;

		const char = String.fromCodePoint(codePoint);

		const quickPickService = accessor.get(IQuickInputService);
		const configurationService = accessor.get(IConfigurationService);

		interface ExtendedOptions extends IQuickPickItem {
			run(): Promise<void>;
		}

		function getExcludeCharFromBeingHighlightedLabel(codePoint: number) {
			if (InvisibleCharacters.isInvisibleCharacter(codePoint)) {
				return nls.localize('unicodeHighlight.excludeInvisibleCharFromBeingHighlighted', 'Exclude {0} (invisible character) from being highlighted', codePointToHex(codePoint));
			}
			return nls.localize('unicodeHighlight.excludeCharFromBeingHighlighted', 'Exclude {0} from being highlighted', `${codePointToHex(codePoint)} "${char}"`);
		}

		const options: ExtendedOptions[] = [];

		if (reason.kind === UnicodeHighlighterReasonKind.Ambiguous) {
			for (const locale of reason.notAmbiguousInLocales) {
				options.push({
					label: nls.localize("unicodeHighlight.allowCommonCharactersInLanguage", "Allow unicode characters that are more common in the language \"{0}\".", locale),
					run: async () => {
						excludeLocaleFromBeingHighlighted(configurationService, [locale]);
					},
				});
			}
		}

		options.push(
			{
				label: getExcludeCharFromBeingHighlightedLabel(codePoint),
				run: () => excludeCharFromBeingHighlighted(configurationService, [codePoint])
			}
		);

		if (inComment) {
			const action = new DisableHighlightingInCommentsAction();
			options.push({ label: action.label, run: async () => action.runAction(configurationService) });
		} else if (inString) {
			const action = new DisableHighlightingInStringsAction();
			options.push({ label: action.label, run: async () => action.runAction(configurationService) });
		}

		function getTitle(options: Action2) {
			return typeof options.desc.title === 'string' ? options.desc.title : options.desc.title.value;
		}

		if (reason.kind === UnicodeHighlighterReasonKind.Ambiguous) {
			const action = new DisableHighlightingOfAmbiguousCharactersAction();
			options.push({ label: getTitle(action), run: async () => action.runAction(configurationService) });
		} else if (reason.kind === UnicodeHighlighterReasonKind.Invisible) {
			const action = new DisableHighlightingOfInvisibleCharactersAction();
			options.push({ label: getTitle(action), run: async () => action.runAction(configurationService) });
		} else if (reason.kind === UnicodeHighlighterReasonKind.NonBasicAscii) {
			const action = new DisableHighlightingOfNonBasicAsciiCharactersAction();
			options.push({ label: getTitle(action), run: async () => action.runAction(configurationService) });
		} else {
			expectNever(reason);
		}

		const result = await quickPickService.pick(
			options,
			{ title: configureUnicodeHighlightOptionsStr }
		);

		if (result) {
			await result.run();
		}
	}
}

async function excludeCharFromBeingHighlighted(configurationService: IConfigurationService, charCodes: number[]) {
	const existingValue = configurationService.getValue(unicodeHighlightConfigKeys.allowedCharacters);

	let value: Record<string, boolean>;
	if ((typeof existingValue === 'object') && existingValue) {
		// eslint-disable-next-line local/code-no-any-casts
		value = existingValue as any;
	} else {
		value = {};
	}

	for (const charCode of charCodes) {
		value[String.fromCodePoint(charCode)] = true;
	}

	await configurationService.updateValue(unicodeHighlightConfigKeys.allowedCharacters, value, ConfigurationTarget.USER);
}

async function excludeLocaleFromBeingHighlighted(configurationService: IConfigurationService, locales: string[]) {
	const existingValue = configurationService.inspect(unicodeHighlightConfigKeys.allowedLocales).user?.value;

	let value: Record<string, boolean>;
	if ((typeof existingValue === 'object') && existingValue) {
		// Copy value, as the existing value is read only
		// eslint-disable-next-line local/code-no-any-casts
		value = Object.assign({}, existingValue as any);
	} else {
		value = {};
	}

	for (const locale of locales) {
		value[locale] = true;
	}

	await configurationService.updateValue(unicodeHighlightConfigKeys.allowedLocales, value, ConfigurationTarget.USER);
}

function expectNever(value: never) {
	throw new Error(`Unexpected value: ${value}`);
}

registerAction2(DisableHighlightingOfAmbiguousCharactersAction);
registerAction2(DisableHighlightingOfInvisibleCharactersAction);
registerAction2(DisableHighlightingOfNonBasicAsciiCharactersAction);
registerAction2(ShowExcludeOptions);
registerEditorContribution(UnicodeHighlighter.ID, UnicodeHighlighter, EditorContributionInstantiation.AfterFirstRender);
HoverParticipantRegistry.register(UnicodeHighlighterHoverParticipant);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/unusualLineTerminators/browser/unusualLineTerminators.ts]---
Location: vscode-main/src/vs/editor/contrib/unusualLineTerminators/browser/unusualLineTerminators.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { basename } from '../../../../base/common/resources.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorContributionInstantiation, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { ICodeEditorService } from '../../../browser/services/codeEditorService.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { IEditorContribution } from '../../../common/editorCommon.js';
import { ITextModel } from '../../../common/model.js';
import * as nls from '../../../../nls.js';
import { IConfirmationResult, IDialogService } from '../../../../platform/dialogs/common/dialogs.js';

const ignoreUnusualLineTerminators = 'ignoreUnusualLineTerminators';

function writeIgnoreState(codeEditorService: ICodeEditorService, model: ITextModel, state: boolean): void {
	codeEditorService.setModelProperty(model.uri, ignoreUnusualLineTerminators, state);
}

function readIgnoreState(codeEditorService: ICodeEditorService, model: ITextModel): boolean | undefined {
	return codeEditorService.getModelProperty(model.uri, ignoreUnusualLineTerminators) as boolean | undefined;
}

export class UnusualLineTerminatorsDetector extends Disposable implements IEditorContribution {

	public static readonly ID = 'editor.contrib.unusualLineTerminatorsDetector';

	private _config: 'auto' | 'off' | 'prompt';
	private _isPresentingDialog: boolean = false;

	constructor(
		private readonly _editor: ICodeEditor,
		@IDialogService private readonly _dialogService: IDialogService,
		@ICodeEditorService private readonly _codeEditorService: ICodeEditorService
	) {
		super();

		this._config = this._editor.getOption(EditorOption.unusualLineTerminators);
		this._register(this._editor.onDidChangeConfiguration((e) => {
			if (e.hasChanged(EditorOption.unusualLineTerminators)) {
				this._config = this._editor.getOption(EditorOption.unusualLineTerminators);
				this._checkForUnusualLineTerminators();
			}
		}));

		this._register(this._editor.onDidChangeModel(() => {
			this._checkForUnusualLineTerminators();
		}));

		this._register(this._editor.onDidChangeModelContent((e) => {
			if (e.isUndoing) {
				// skip checking in case of undoing
				return;
			}
			this._checkForUnusualLineTerminators();
		}));

		this._checkForUnusualLineTerminators();
	}

	private async _checkForUnusualLineTerminators(): Promise<void> {
		if (this._config === 'off') {
			return;
		}
		if (!this._editor.hasModel()) {
			return;
		}
		const model = this._editor.getModel();
		if (!model.mightContainUnusualLineTerminators()) {
			return;
		}
		const ignoreState = readIgnoreState(this._codeEditorService, model);
		if (ignoreState === true) {
			// this model should be ignored
			return;
		}
		if (this._editor.getOption(EditorOption.readOnly)) {
			// read only editor => sorry!
			return;
		}

		if (this._config === 'auto') {
			// just do it!
			model.removeUnusualLineTerminators(this._editor.getSelections());
			return;
		}

		if (this._isPresentingDialog) {
			// we're currently showing the dialog, which is async.
			// avoid spamming the user
			return;
		}

		let result: IConfirmationResult;
		try {
			this._isPresentingDialog = true;
			result = await this._dialogService.confirm({
				title: nls.localize('unusualLineTerminators.title', "Unusual Line Terminators"),
				message: nls.localize('unusualLineTerminators.message', "Detected unusual line terminators"),
				detail: nls.localize('unusualLineTerminators.detail', "The file '{0}' contains one or more unusual line terminator characters, like Line Separator (LS) or Paragraph Separator (PS).\n\nIt is recommended to remove them from the file. This can be configured via `editor.unusualLineTerminators`.", basename(model.uri)),
				primaryButton: nls.localize({ key: 'unusualLineTerminators.fix', comment: ['&& denotes a mnemonic'] }, "&&Remove Unusual Line Terminators"),
				cancelButton: nls.localize('unusualLineTerminators.ignore', "Ignore")
			});
		} finally {
			this._isPresentingDialog = false;
		}

		if (!result.confirmed) {
			// this model should be ignored
			writeIgnoreState(this._codeEditorService, model, true);
			return;
		}

		model.removeUnusualLineTerminators(this._editor.getSelections());
	}
}

registerEditorContribution(UnusualLineTerminatorsDetector.ID, UnusualLineTerminatorsDetector, EditorContributionInstantiation.AfterFirstRender);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/wordHighlighter/browser/highlightDecorations.css]---
Location: vscode-main/src/vs/editor/contrib/wordHighlighter/browser/highlightDecorations.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .focused .selectionHighlight {
	background-color: var(--vscode-editor-selectionHighlightBackground);
	box-sizing: border-box;
	border: 1px solid var(--vscode-editor-selectionHighlightBorder);
}
.monaco-editor.hc-black .focused .selectionHighlight, .monaco-editor.hc-light .focused .selectionHighlight {
	border-style: dotted;
}

.monaco-editor .wordHighlight {
	background-color: var(--vscode-editor-wordHighlightBackground);
	box-sizing: border-box;
	border: 1px solid var(--vscode-editor-wordHighlightBorder);
}
.monaco-editor.hc-black .wordHighlight, .monaco-editor.hc-light .wordHighlight {
	border-style: dotted;
}

.monaco-editor .wordHighlightStrong {
	background-color: var(--vscode-editor-wordHighlightStrongBackground);
	box-sizing: border-box;
	border: 1px solid var(--vscode-editor-wordHighlightStrongBorder);
}
.monaco-editor.hc-black .wordHighlightStrong, .monaco-editor.hc-light .wordHighlightStrong {
	border-style: dotted;
}

.monaco-editor .wordHighlightText {
	background-color: var(--vscode-editor-wordHighlightTextBackground);
	box-sizing: border-box;
	border: 1px solid var(--vscode-editor-wordHighlightTextBorder);
}
.monaco-editor.hc-black .wordHighlightText, .monaco-editor.hc-light .wordHighlightText {
	border-style: dotted;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/wordHighlighter/browser/highlightDecorations.ts]---
Location: vscode-main/src/vs/editor/contrib/wordHighlighter/browser/highlightDecorations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './highlightDecorations.css';
import { MinimapPosition, OverviewRulerLane, TrackedRangeStickiness } from '../../../common/model.js';
import { ModelDecorationOptions } from '../../../common/model/textModel.js';
import { DocumentHighlightKind } from '../../../common/languages.js';
import * as nls from '../../../../nls.js';
import { activeContrastBorder, editorSelectionHighlight, minimapSelectionOccurrenceHighlight, overviewRulerSelectionHighlightForeground, registerColor } from '../../../../platform/theme/common/colorRegistry.js';
import { registerThemingParticipant, themeColorFromId } from '../../../../platform/theme/common/themeService.js';

const wordHighlightBackground = registerColor('editor.wordHighlightBackground', { dark: '#575757B8', light: '#57575740', hcDark: null, hcLight: null }, nls.localize('wordHighlight', 'Background color of a symbol during read-access, like reading a variable. The color must not be opaque so as not to hide underlying decorations.'), true);
registerColor('editor.wordHighlightStrongBackground', { dark: '#004972B8', light: '#0e639c40', hcDark: null, hcLight: null }, nls.localize('wordHighlightStrong', 'Background color of a symbol during write-access, like writing to a variable. The color must not be opaque so as not to hide underlying decorations.'), true);
registerColor('editor.wordHighlightTextBackground', wordHighlightBackground, nls.localize('wordHighlightText', 'Background color of a textual occurrence for a symbol. The color must not be opaque so as not to hide underlying decorations.'), true);
const wordHighlightBorder = registerColor('editor.wordHighlightBorder', { light: null, dark: null, hcDark: activeContrastBorder, hcLight: activeContrastBorder }, nls.localize('wordHighlightBorder', 'Border color of a symbol during read-access, like reading a variable.'));
registerColor('editor.wordHighlightStrongBorder', { light: null, dark: null, hcDark: activeContrastBorder, hcLight: activeContrastBorder }, nls.localize('wordHighlightStrongBorder', 'Border color of a symbol during write-access, like writing to a variable.'));
registerColor('editor.wordHighlightTextBorder', wordHighlightBorder, nls.localize('wordHighlightTextBorder', "Border color of a textual occurrence for a symbol."));
const overviewRulerWordHighlightForeground = registerColor('editorOverviewRuler.wordHighlightForeground', '#A0A0A0CC', nls.localize('overviewRulerWordHighlightForeground', 'Overview ruler marker color for symbol highlights. The color must not be opaque so as not to hide underlying decorations.'), true);
const overviewRulerWordHighlightStrongForeground = registerColor('editorOverviewRuler.wordHighlightStrongForeground', '#C0A0C0CC', nls.localize('overviewRulerWordHighlightStrongForeground', 'Overview ruler marker color for write-access symbol highlights. The color must not be opaque so as not to hide underlying decorations.'), true);
const overviewRulerWordHighlightTextForeground = registerColor('editorOverviewRuler.wordHighlightTextForeground', overviewRulerSelectionHighlightForeground, nls.localize('overviewRulerWordHighlightTextForeground', 'Overview ruler marker color of a textual occurrence for a symbol. The color must not be opaque so as not to hide underlying decorations.'), true);

const _WRITE_OPTIONS = ModelDecorationOptions.register({
	description: 'word-highlight-strong',
	stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
	className: 'wordHighlightStrong',
	overviewRuler: {
		color: themeColorFromId(overviewRulerWordHighlightStrongForeground),
		position: OverviewRulerLane.Center
	},
	minimap: {
		color: themeColorFromId(minimapSelectionOccurrenceHighlight),
		position: MinimapPosition.Inline
	},
});

const _TEXT_OPTIONS = ModelDecorationOptions.register({
	description: 'word-highlight-text',
	stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
	className: 'wordHighlightText',
	overviewRuler: {
		color: themeColorFromId(overviewRulerWordHighlightTextForeground),
		position: OverviewRulerLane.Center
	},
	minimap: {
		color: themeColorFromId(minimapSelectionOccurrenceHighlight),
		position: MinimapPosition.Inline
	},
});

const _SELECTION_HIGHLIGHT_OPTIONS = ModelDecorationOptions.register({
	description: 'selection-highlight-overview',
	stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
	className: 'selectionHighlight',
	overviewRuler: {
		color: themeColorFromId(overviewRulerSelectionHighlightForeground),
		position: OverviewRulerLane.Center
	},
	minimap: {
		color: themeColorFromId(minimapSelectionOccurrenceHighlight),
		position: MinimapPosition.Inline
	},
});

const _SELECTION_HIGHLIGHT_OPTIONS_NO_OVERVIEW = ModelDecorationOptions.register({
	description: 'selection-highlight',
	stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
	className: 'selectionHighlight',
});

const _REGULAR_OPTIONS = ModelDecorationOptions.register({
	description: 'word-highlight',
	stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
	className: 'wordHighlight',
	overviewRuler: {
		color: themeColorFromId(overviewRulerWordHighlightForeground),
		position: OverviewRulerLane.Center
	},
	minimap: {
		color: themeColorFromId(minimapSelectionOccurrenceHighlight),
		position: MinimapPosition.Inline
	},
});

export function getHighlightDecorationOptions(kind: DocumentHighlightKind | undefined): ModelDecorationOptions {
	if (kind === DocumentHighlightKind.Write) {
		return _WRITE_OPTIONS;
	} else if (kind === DocumentHighlightKind.Text) {
		return _TEXT_OPTIONS;
	} else {
		return _REGULAR_OPTIONS;
	}
}

export function getSelectionHighlightDecorationOptions(hasSemanticHighlights: boolean): ModelDecorationOptions {
	// Show in overviewRuler only if model has no semantic highlighting
	return (hasSemanticHighlights ? _SELECTION_HIGHLIGHT_OPTIONS_NO_OVERVIEW : _SELECTION_HIGHLIGHT_OPTIONS);
}

registerThemingParticipant((theme, collector) => {
	const selectionHighlight = theme.getColor(editorSelectionHighlight);
	if (selectionHighlight) {
		collector.addRule(`.monaco-editor .selectionHighlight { background-color: ${selectionHighlight.transparent(0.5)}; }`);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/wordHighlighter/browser/textualHighlightProvider.ts]---
Location: vscode-main/src/vs/editor/contrib/wordHighlighter/browser/textualHighlightProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { USUAL_WORD_SEPARATORS } from '../../../common/core/wordHelper.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { DocumentHighlight, DocumentHighlightKind, DocumentHighlightProvider, MultiDocumentHighlightProvider, ProviderResult } from '../../../common/languages.js';
import { ITextModel } from '../../../common/model.js';
import { Position } from '../../../common/core/position.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { LanguageFilter } from '../../../common/languageSelector.js';


class TextualDocumentHighlightProvider implements DocumentHighlightProvider, MultiDocumentHighlightProvider {

	selector: LanguageFilter = { language: '*' };

	provideDocumentHighlights(model: ITextModel, position: Position, token: CancellationToken): ProviderResult<DocumentHighlight[]> {
		const result: DocumentHighlight[] = [];

		const word = model.getWordAtPosition({
			lineNumber: position.lineNumber,
			column: position.column
		});

		if (!word) {
			return Promise.resolve(result);
		}

		if (model.isDisposed()) {
			return;
		}

		const matches = model.findMatches(word.word, true, false, true, USUAL_WORD_SEPARATORS, false);
		return matches.map(m => ({
			range: m.range,
			kind: DocumentHighlightKind.Text
		}));
	}

	provideMultiDocumentHighlights(primaryModel: ITextModel, position: Position, otherModels: ITextModel[], token: CancellationToken): ProviderResult<ResourceMap<DocumentHighlight[]>> {

		const result = new ResourceMap<DocumentHighlight[]>();

		const word = primaryModel.getWordAtPosition({
			lineNumber: position.lineNumber,
			column: position.column
		});
		if (!word) {
			return Promise.resolve(result);
		}


		for (const model of [primaryModel, ...otherModels]) {
			if (model.isDisposed()) {
				continue;
			}

			const matches = model.findMatches(word.word, true, false, true, USUAL_WORD_SEPARATORS, false);
			const highlights = matches.map(m => ({
				range: m.range,
				kind: DocumentHighlightKind.Text
			}));

			if (highlights) {
				result.set(model.uri, highlights);
			}
		}

		return result;
	}

}

export class TextualMultiDocumentHighlightFeature extends Disposable {
	constructor(
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
	) {
		super();
		this._register(languageFeaturesService.documentHighlightProvider.register('*', new TextualDocumentHighlightProvider()));
		this._register(languageFeaturesService.multiDocumentHighlightProvider.register('*', new TextualDocumentHighlightProvider()));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/wordHighlighter/browser/wordHighlighter.ts]---
Location: vscode-main/src/vs/editor/contrib/wordHighlighter/browser/wordHighlighter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { alert } from '../../../../base/browser/ui/aria/aria.js';
import { CancelablePromise, createCancelablePromise, Delayer, first } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { onUnexpectedError, onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { matchesScheme, Schemas } from '../../../../base/common/network.js';
import { isEqual } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IActiveCodeEditor, ICodeEditor, isDiffEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, EditorContributionInstantiation, IActionOptions, registerEditorAction, registerEditorContribution, registerModelAndPositionCommand } from '../../../browser/editorExtensions.js';
import { ICodeEditorService } from '../../../browser/services/codeEditorService.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { IWordAtPosition } from '../../../common/core/wordHelper.js';
import { CursorChangeReason, ICursorPositionChangedEvent } from '../../../common/cursorEvents.js';
import { IDiffEditor, IEditorContribution, IEditorDecorationsCollection } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { registerEditorFeature } from '../../../common/editorFeatures.js';
import { LanguageFeatureRegistry } from '../../../common/languageFeatureRegistry.js';
import { DocumentHighlight, DocumentHighlightProvider, MultiDocumentHighlightProvider } from '../../../common/languages.js';
import { score } from '../../../common/languageSelector.js';
import { IModelDeltaDecoration, ITextModel, shouldSynchronizeModel } from '../../../common/model.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { ITextModelService } from '../../../common/services/resolverService.js';
import { getHighlightDecorationOptions } from './highlightDecorations.js';
import { TextualMultiDocumentHighlightFeature } from './textualHighlightProvider.js';

const ctxHasWordHighlights = new RawContextKey<boolean>('hasWordHighlights', false);

export function getOccurrencesAtPosition(registry: LanguageFeatureRegistry<DocumentHighlightProvider>, model: ITextModel, position: Position, token: CancellationToken): Promise<ResourceMap<DocumentHighlight[]> | null | undefined> {
	const orderedByScore = registry.ordered(model);

	// in order of score ask the occurrences provider
	// until someone response with a good result
	// (good = non undefined and non null value)
	// (result of size == 0 is valid, no highlights is a valid/expected result -- not a signal to fall back to other providers)
	return first<DocumentHighlight[] | null | undefined>(orderedByScore.map(provider => () => {
		return Promise.resolve(provider.provideDocumentHighlights(model, position, token))
			.then(undefined, onUnexpectedExternalError);
	}), (result): result is DocumentHighlight[] => result !== undefined && result !== null).then(result => {
		if (result) {
			const map = new ResourceMap<DocumentHighlight[]>();
			map.set(model.uri, result);
			return map;
		}
		return new ResourceMap<DocumentHighlight[]>();
	});
}

export function getOccurrencesAcrossMultipleModels(registry: LanguageFeatureRegistry<MultiDocumentHighlightProvider>, model: ITextModel, position: Position, token: CancellationToken, otherModels: ITextModel[]): Promise<ResourceMap<DocumentHighlight[]> | null | undefined> {
	const orderedByScore = registry.ordered(model);

	// in order of score ask the occurrences provider
	// until someone response with a good result
	// (good = non undefined and non null ResourceMap)
	// (result of size == 0 is valid, no highlights is a valid/expected result -- not a signal to fall back to other providers)
	return first<ResourceMap<DocumentHighlight[]> | null | undefined>(orderedByScore.map(provider => () => {
		const filteredModels = otherModels.filter(otherModel => {
			return shouldSynchronizeModel(otherModel);
		}).filter(otherModel => {
			return score(provider.selector, otherModel.uri, otherModel.getLanguageId(), true, undefined, undefined) > 0;
		});
		return Promise.resolve(provider.provideMultiDocumentHighlights(model, position, filteredModels, token))
			.then(undefined, onUnexpectedExternalError);
	}), (result): result is ResourceMap<DocumentHighlight[]> => result !== undefined && result !== null);
}

interface IOccurenceAtPositionRequest {
	readonly result: Promise<ResourceMap<DocumentHighlight[]>>;
	isValid(model: ITextModel, selection: Selection, decorations: IEditorDecorationsCollection): boolean;
	cancel(): void;
}

interface IWordHighlighterQuery {
	modelInfo: {
		modelURI: URI;
		selection: Selection;
	} | null;
}

abstract class OccurenceAtPositionRequest implements IOccurenceAtPositionRequest {

	private readonly _wordRange: Range | null;
	private _result: CancelablePromise<ResourceMap<DocumentHighlight[]>> | null;

	constructor(private readonly _model: ITextModel, private readonly _selection: Selection, private readonly _wordSeparators: string) {
		this._wordRange = this._getCurrentWordRange(_model, _selection);
		this._result = null;
	}

	get result() {
		if (!this._result) {
			this._result = createCancelablePromise(token => this._compute(this._model, this._selection, this._wordSeparators, token));
		}
		return this._result;
	}

	protected abstract _compute(model: ITextModel, selection: Selection, wordSeparators: string, token: CancellationToken): Promise<ResourceMap<DocumentHighlight[]>>;

	private _getCurrentWordRange(model: ITextModel, selection: Selection): Range | null {
		const word = model.getWordAtPosition(selection.getPosition());
		if (word) {
			return new Range(selection.startLineNumber, word.startColumn, selection.startLineNumber, word.endColumn);
		}
		return null;
	}

	public isValid(model: ITextModel, selection: Selection, decorations: IEditorDecorationsCollection): boolean {

		const lineNumber = selection.startLineNumber;
		const startColumn = selection.startColumn;
		const endColumn = selection.endColumn;
		const currentWordRange = this._getCurrentWordRange(model, selection);

		let requestIsValid = Boolean(this._wordRange && this._wordRange.equalsRange(currentWordRange));

		// Even if we are on a different word, if that word is in the decorations ranges, the request is still valid
		// (Same symbol)
		for (let i = 0, len = decorations.length; !requestIsValid && i < len; i++) {
			const range = decorations.getRange(i);
			if (range && range.startLineNumber === lineNumber) {
				if (range.startColumn <= startColumn && range.endColumn >= endColumn) {
					requestIsValid = true;
				}
			}
		}

		return requestIsValid;
	}

	public cancel(): void {
		this.result.cancel();
	}
}

class SemanticOccurenceAtPositionRequest extends OccurenceAtPositionRequest {

	private readonly _providers: LanguageFeatureRegistry<DocumentHighlightProvider>;

	constructor(model: ITextModel, selection: Selection, wordSeparators: string, providers: LanguageFeatureRegistry<DocumentHighlightProvider>) {
		super(model, selection, wordSeparators);
		this._providers = providers;
	}

	protected _compute(model: ITextModel, selection: Selection, wordSeparators: string, token: CancellationToken): Promise<ResourceMap<DocumentHighlight[]>> {
		return getOccurrencesAtPosition(this._providers, model, selection.getPosition(), token).then(value => {
			if (!value) {
				return new ResourceMap<DocumentHighlight[]>();
			}
			return value;
		});
	}
}

class MultiModelOccurenceRequest extends OccurenceAtPositionRequest {
	private readonly _providers: LanguageFeatureRegistry<MultiDocumentHighlightProvider>;
	private readonly _otherModels: ITextModel[];

	constructor(model: ITextModel, selection: Selection, wordSeparators: string, providers: LanguageFeatureRegistry<MultiDocumentHighlightProvider>, otherModels: ITextModel[]) {
		super(model, selection, wordSeparators);
		this._providers = providers;
		this._otherModels = otherModels;
	}

	protected override _compute(model: ITextModel, selection: Selection, wordSeparators: string, token: CancellationToken): Promise<ResourceMap<DocumentHighlight[]>> {
		return getOccurrencesAcrossMultipleModels(this._providers, model, selection.getPosition(), token, this._otherModels).then(value => {
			if (!value) {
				return new ResourceMap<DocumentHighlight[]>();
			}
			return value;
		});
	}
}


function computeOccurencesAtPosition(registry: LanguageFeatureRegistry<DocumentHighlightProvider>, model: ITextModel, selection: Selection, wordSeparators: string): IOccurenceAtPositionRequest {
	return new SemanticOccurenceAtPositionRequest(model, selection, wordSeparators, registry);
}

function computeOccurencesMultiModel(registry: LanguageFeatureRegistry<MultiDocumentHighlightProvider>, model: ITextModel, selection: Selection, wordSeparators: string, otherModels: ITextModel[]): IOccurenceAtPositionRequest {
	return new MultiModelOccurenceRequest(model, selection, wordSeparators, registry, otherModels);
}

registerModelAndPositionCommand('_executeDocumentHighlights', async (accessor, model, position) => {
	const languageFeaturesService = accessor.get(ILanguageFeaturesService);
	const map = await getOccurrencesAtPosition(languageFeaturesService.documentHighlightProvider, model, position, CancellationToken.None);
	return map?.get(model.uri);
});

class WordHighlighter {

	private readonly editor: IActiveCodeEditor;
	private readonly providers: LanguageFeatureRegistry<DocumentHighlightProvider>;
	private readonly multiDocumentProviders: LanguageFeatureRegistry<MultiDocumentHighlightProvider>;
	private readonly model: ITextModel;
	private readonly decorations: IEditorDecorationsCollection;
	private readonly toUnhook = new DisposableStore();

	private readonly textModelService: ITextModelService;
	private readonly codeEditorService: ICodeEditorService;
	private readonly configurationService: IConfigurationService;
	private readonly logService: ILogService;

	private occurrencesHighlightEnablement: string;
	private occurrencesHighlightDelay: number;

	private workerRequestTokenId: number = 0;
	private workerRequest: IOccurenceAtPositionRequest | null;
	private workerRequestCompleted: boolean = false;
	private workerRequestValue: ResourceMap<DocumentHighlight[]> = new ResourceMap();

	private lastCursorPositionChangeTime: number = 0;
	private renderDecorationsTimer: Timeout | undefined = undefined;

	private readonly _hasWordHighlights: IContextKey<boolean>;
	private _ignorePositionChangeEvent: boolean;

	private readonly runDelayer: Delayer<void> = this.toUnhook.add(new Delayer<void>(50));

	private static storedDecorationIDs: ResourceMap<string[]> = new ResourceMap();
	private static query: IWordHighlighterQuery | null = null;

	constructor(
		editor: IActiveCodeEditor,
		providers: LanguageFeatureRegistry<DocumentHighlightProvider>,
		multiProviders: LanguageFeatureRegistry<MultiDocumentHighlightProvider>,
		contextKeyService: IContextKeyService,
		@ITextModelService textModelService: ITextModelService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@IConfigurationService configurationService: IConfigurationService,
		@ILogService logService: ILogService,
	) {
		this.editor = editor;
		this.providers = providers;
		this.multiDocumentProviders = multiProviders;

		this.codeEditorService = codeEditorService;
		this.textModelService = textModelService;
		this.configurationService = configurationService;
		this.logService = logService;

		this._hasWordHighlights = ctxHasWordHighlights.bindTo(contextKeyService);
		this._ignorePositionChangeEvent = false;
		this.occurrencesHighlightEnablement = this.editor.getOption(EditorOption.occurrencesHighlight);
		this.occurrencesHighlightDelay = this.configurationService.getValue<number>('editor.occurrencesHighlightDelay');
		this.model = this.editor.getModel();

		this.toUnhook.add(editor.onDidChangeCursorPosition((e: ICursorPositionChangedEvent) => {
			if (this._ignorePositionChangeEvent) {
				// We are changing the position => ignore this event
				return;
			}

			if (this.occurrencesHighlightEnablement === 'off') {
				// Early exit if nothing needs to be done!
				// Leave some form of early exit check here if you wish to continue being a cursor position change listener ;)
				return;
			}

			this.runDelayer.trigger(() => { this._onPositionChanged(e); });
		}));
		this.toUnhook.add(editor.onDidFocusEditorText((e) => {
			if (this.occurrencesHighlightEnablement === 'off') {
				// Early exit if nothing needs to be done
				return;
			}

			if (!this.workerRequest) {
				this.runDelayer.trigger(() => { this._run(); });
			}
		}));
		this.toUnhook.add(editor.onDidChangeModelContent((e) => {
			if (!matchesScheme(this.model.uri, 'output')) {
				this._stopAll();
			}
		}));
		this.toUnhook.add(editor.onDidChangeModel((e) => {
			if (!e.newModelUrl && e.oldModelUrl) {
				this._stopSingular();
			} else if (WordHighlighter.query) {
				this._run();
			}
		}));
		this.toUnhook.add(editor.onDidChangeConfiguration((e) => {
			const newEnablement = this.editor.getOption(EditorOption.occurrencesHighlight);
			if (this.occurrencesHighlightEnablement !== newEnablement) {
				this.occurrencesHighlightEnablement = newEnablement;
				switch (newEnablement) {
					case 'off':
						this._stopAll();
						break;
					case 'singleFile':
						this._stopAll(WordHighlighter.query?.modelInfo?.modelURI);
						break;
					case 'multiFile':
						if (WordHighlighter.query) {
							this._run(true);
						}
						break;
					default:
						console.warn('Unknown occurrencesHighlight setting value:', newEnablement);
						break;
				}
			}
		}));
		this.toUnhook.add(this.configurationService.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration('editor.occurrencesHighlightDelay')) {
				const newDelay = configurationService.getValue<number>('editor.occurrencesHighlightDelay');
				if (this.occurrencesHighlightDelay !== newDelay) {
					this.occurrencesHighlightDelay = newDelay;
				}
			}
		}));
		this.toUnhook.add(editor.onDidBlurEditorWidget(() => {
			// logic is as follows
			// - didBlur => active null => stopall
			// - didBlur => active nb   => if this.editor is notebook, do nothing (new cell, so we don't want to stopAll)
			//              active nb   => if this.editor is NOT nb,   stopAll

			const activeEditor = this.codeEditorService.getFocusedCodeEditor();
			if (!activeEditor) { // clicked into nb cell list, outline, terminal, etc
				this._stopAll();
			} else if (activeEditor.getModel()?.uri.scheme === Schemas.vscodeNotebookCell && this.editor.getModel()?.uri.scheme !== Schemas.vscodeNotebookCell) { // switched tabs from non-nb to nb
				this._stopAll();
			}
		}));

		this.decorations = this.editor.createDecorationsCollection();
		this.workerRequestTokenId = 0;
		this.workerRequest = null;
		this.workerRequestCompleted = false;

		this.lastCursorPositionChangeTime = 0;
		this.renderDecorationsTimer = undefined;

		// if there is a query already, highlight off that query
		if (WordHighlighter.query) {
			this._run();
		}
	}

	public hasDecorations(): boolean {
		return (this.decorations.length > 0);
	}

	public restore(delay: number): void {
		if (this.occurrencesHighlightEnablement === 'off') {
			return;
		}

		this.runDelayer.cancel();
		this.runDelayer.trigger(() => { this._run(false, delay); });
	}

	public trigger() {
		this.runDelayer.cancel();
		this._run(false, 0); // immediate rendering (delay = 0)
	}

	public stop(): void {
		if (this.occurrencesHighlightEnablement === 'off') {
			return;
		}

		this._stopAll();
	}

	private _getSortedHighlights(): Range[] {
		return (
			this.decorations.getRanges()
				.sort(Range.compareRangesUsingStarts)
		);
	}

	public moveNext() {
		const highlights = this._getSortedHighlights();
		const index = highlights.findIndex((range) => range.containsPosition(this.editor.getPosition()));
		const newIndex = ((index + 1) % highlights.length);
		const dest = highlights[newIndex];
		try {
			this._ignorePositionChangeEvent = true;
			this.editor.setPosition(dest.getStartPosition());
			this.editor.revealRangeInCenterIfOutsideViewport(dest);
			const word = this._getWord();
			if (word) {
				const lineContent = this.editor.getModel().getLineContent(dest.startLineNumber);
				alert(`${lineContent}, ${newIndex + 1} of ${highlights.length} for '${word.word}'`);
			}
		} finally {
			this._ignorePositionChangeEvent = false;
		}
	}

	public moveBack() {
		const highlights = this._getSortedHighlights();
		const index = highlights.findIndex((range) => range.containsPosition(this.editor.getPosition()));
		const newIndex = ((index - 1 + highlights.length) % highlights.length);
		const dest = highlights[newIndex];
		try {
			this._ignorePositionChangeEvent = true;
			this.editor.setPosition(dest.getStartPosition());
			this.editor.revealRangeInCenterIfOutsideViewport(dest);
			const word = this._getWord();
			if (word) {
				const lineContent = this.editor.getModel().getLineContent(dest.startLineNumber);
				alert(`${lineContent}, ${newIndex + 1} of ${highlights.length} for '${word.word}'`);
			}
		} finally {
			this._ignorePositionChangeEvent = false;
		}
	}

	private _removeSingleDecorations(): void {
		// return if no model
		if (!this.editor.hasModel()) {
			return;
		}

		const currentDecorationIDs = WordHighlighter.storedDecorationIDs.get(this.editor.getModel().uri);
		if (!currentDecorationIDs) {
			return;
		}

		this.editor.removeDecorations(currentDecorationIDs);
		WordHighlighter.storedDecorationIDs.delete(this.editor.getModel().uri);

		if (this.decorations.length > 0) {
			this.decorations.clear();
			this._hasWordHighlights.set(false);
		}
	}

	private _removeAllDecorations(preservedModel?: URI): void {
		const currentEditors = this.codeEditorService.listCodeEditors();
		const deleteURI = [];
		// iterate over editors and store models in currentModels
		for (const editor of currentEditors) {
			if (!editor.hasModel() || isEqual(editor.getModel().uri, preservedModel)) {
				continue;
			}

			const currentDecorationIDs = WordHighlighter.storedDecorationIDs.get(editor.getModel().uri);
			if (!currentDecorationIDs) {
				continue;
			}

			editor.removeDecorations(currentDecorationIDs);
			deleteURI.push(editor.getModel().uri);

			const editorHighlighterContrib = WordHighlighterContribution.get(editor);
			if (!editorHighlighterContrib?.wordHighlighter) {
				continue;
			}

			if (editorHighlighterContrib.wordHighlighter.decorations.length > 0) {
				editorHighlighterContrib.wordHighlighter.decorations.clear();
				editorHighlighterContrib.wordHighlighter.workerRequest = null;
				editorHighlighterContrib.wordHighlighter._hasWordHighlights.set(false);
			}
		}

		for (const uri of deleteURI) {
			WordHighlighter.storedDecorationIDs.delete(uri);
		}
	}

	private _stopSingular(): void {
		// Remove any existing decorations + a possible query, and re - run to update decorations
		this._removeSingleDecorations();

		if (this.editor.hasTextFocus()) {
			if (this.editor.getModel()?.uri.scheme !== Schemas.vscodeNotebookCell && WordHighlighter.query?.modelInfo?.modelURI.scheme !== Schemas.vscodeNotebookCell) { // clear query if focused non-nb editor
				WordHighlighter.query = null;
				this._run(); // TODO: @Yoyokrazy -- investigate why we need a full rerun here. likely addressed a case/patch in the first iteration of this feature
			} else { // remove modelInfo to account for nb cell being disposed
				if (WordHighlighter.query?.modelInfo) {
					WordHighlighter.query.modelInfo = null;
				}
			}
		}

		// Cancel any renderDecorationsTimer
		if (this.renderDecorationsTimer !== undefined) {
			clearTimeout(this.renderDecorationsTimer);
			this.renderDecorationsTimer = undefined;
		}

		// Cancel any worker request
		if (this.workerRequest !== null) {
			this.workerRequest.cancel();
			this.workerRequest = null;
		}

		// Invalidate any worker request callback
		if (!this.workerRequestCompleted) {
			this.workerRequestTokenId++;
			this.workerRequestCompleted = true;
		}
	}

	private _stopAll(preservedModel?: URI): void {
		// Remove any existing decorations
		// TODO: @Yoyokrazy -- this triggers as notebooks scroll, causing highlights to disappear momentarily.
		// maybe a nb type check?
		this._removeAllDecorations(preservedModel);

		// Cancel any renderDecorationsTimer
		if (this.renderDecorationsTimer !== undefined) {
			clearTimeout(this.renderDecorationsTimer);
			this.renderDecorationsTimer = undefined;
		}

		// Cancel any worker request
		if (this.workerRequest !== null) {
			this.workerRequest.cancel();
			this.workerRequest = null;
		}

		// Invalidate any worker request callback
		if (!this.workerRequestCompleted) {
			this.workerRequestTokenId++;
			this.workerRequestCompleted = true;
		}
	}

	private _onPositionChanged(e: ICursorPositionChangedEvent): void {

		// disabled
		if (this.occurrencesHighlightEnablement === 'off') {
			this._stopAll();
			return;
		}

		// ignore typing & other
		// need to check if the model is a notebook cell, should not stop if nb
		if (e.source !== 'api' && e.reason !== CursorChangeReason.Explicit) {
			this._stopAll();
			return;
		}

		this._run();
	}

	private _getWord(): IWordAtPosition | null {
		const editorSelection = this.editor.getSelection();
		const lineNumber = editorSelection.startLineNumber;
		const startColumn = editorSelection.startColumn;

		if (this.model.isDisposed()) {
			return null;
		}

		return this.model.getWordAtPosition({
			lineNumber: lineNumber,
			column: startColumn
		});
	}

	private getOtherModelsToHighlight(model: ITextModel): ITextModel[] {
		if (!model) {
			return [];
		}

		// notebook case
		const isNotebookEditor = model.uri.scheme === Schemas.vscodeNotebookCell;
		if (isNotebookEditor) {
			const currentModels: ITextModel[] = [];
			const currentEditors = this.codeEditorService.listCodeEditors();
			for (const editor of currentEditors) {
				const tempModel = editor.getModel();
				if (tempModel && tempModel !== model && tempModel.uri.scheme === Schemas.vscodeNotebookCell) {
					currentModels.push(tempModel);
				}
			}
			return currentModels;
		}

		// inline case
		// ? current works when highlighting outside of an inline diff, highlighting in.
		// ? broken when highlighting within a diff editor. highlighting the main editor does not work
		// ? editor group service could be useful here
		const currentModels: ITextModel[] = [];
		const currentEditors = this.codeEditorService.listCodeEditors();
		for (const editor of currentEditors) {
			if (!isDiffEditor(editor)) {
				continue;
			}
			const diffModel = (editor as IDiffEditor).getModel();
			if (!diffModel) {
				continue;
			}
			if (model === diffModel.modified) { // embedded inline chat diff would pass this, allowing highlights
				//? currentModels.push(diffModel.original);
				currentModels.push(diffModel.modified);
			}
		}
		if (currentModels.length) { // no matching editors have been found
			return currentModels;
		}

		// multi-doc OFF
		if (this.occurrencesHighlightEnablement === 'singleFile') {
			return [];
		}

		// multi-doc ON
		for (const editor of currentEditors) {
			const tempModel = editor.getModel();

			const isValidModel = tempModel && tempModel !== model;

			if (isValidModel) {
				currentModels.push(tempModel);
			}
		}
		return currentModels;
	}

	private async _run(multiFileConfigChange?: boolean, delay?: number): Promise<void> {

		const hasTextFocus = this.editor.hasTextFocus();
		if (!hasTextFocus) { // new nb cell scrolled in, didChangeModel fires
			if (!WordHighlighter.query) { // no previous query, nothing to highlight off of
				this._stopAll();
				return;
			}
		} else { // has text focus
			const editorSelection = this.editor.getSelection();

			// ignore multiline selection
			if (!editorSelection || editorSelection.startLineNumber !== editorSelection.endLineNumber) {
				WordHighlighter.query = null;
				this._stopAll();
				return;
			}

			const startColumn = editorSelection.startColumn;
			const endColumn = editorSelection.endColumn;

			const word = this._getWord();

			// The selection must be inside a word or surround one word at most
			if (!word || word.startColumn > startColumn || word.endColumn < endColumn) {
				// no previous query, nothing to highlight
				WordHighlighter.query = null;
				this._stopAll();
				return;
			}

			WordHighlighter.query = {
				modelInfo: {
					modelURI: this.model.uri,
					selection: editorSelection,
				}
			};
		}


		this.lastCursorPositionChangeTime = (new Date()).getTime();

		if (isEqual(this.editor.getModel().uri, WordHighlighter.query.modelInfo?.modelURI)) { // only trigger new worker requests from the primary model that initiated the query
			// case d)

			// check if the new queried word is contained in the range of a stored decoration for this model
			if (!multiFileConfigChange) {
				const currentModelDecorationRanges = this.decorations.getRanges();
				for (const storedRange of currentModelDecorationRanges) {
					if (storedRange.containsPosition(this.editor.getPosition())) {
						return;
					}
				}
			}

			// stop all previous actions if new word is highlighted
			// if we trigger the run off a setting change -> multifile highlighting, we do not want to remove decorations from this model
			this._stopAll(multiFileConfigChange ? this.model.uri : undefined);

			const myRequestId = ++this.workerRequestTokenId;
			this.workerRequestCompleted = false;

			const otherModelsToHighlight = this.getOtherModelsToHighlight(this.editor.getModel());

			// when reaching here, there are two possible states.
			// 		1) we have text focus, and a valid query was updated.
			// 		2) we do not have text focus, and a valid query is cached.
			// the query will ALWAYS have the correct data for the current highlight request, so it can always be passed to the workerRequest safely
			if (!WordHighlighter.query || !WordHighlighter.query.modelInfo) {
				return;
			}

			const queryModelRef = await this.textModelService.createModelReference(WordHighlighter.query.modelInfo.modelURI);
			try {
				this.workerRequest = this.computeWithModel(queryModelRef.object.textEditorModel, WordHighlighter.query.modelInfo.selection, otherModelsToHighlight);
				this.workerRequest?.result.then(data => {
					if (myRequestId === this.workerRequestTokenId) {
						this.workerRequestCompleted = true;
						this.workerRequestValue = data || [];
						this._beginRenderDecorations(delay ?? this.occurrencesHighlightDelay);
					}
				}, onUnexpectedError);
			} catch (e) {
				this.logService.error('Unexpected error during occurrence request. Log: ', e);
			} finally {
				queryModelRef.dispose();
			}

		} else if (this.model.uri.scheme === Schemas.vscodeNotebookCell) {
			// new wordHighlighter coming from a different model, NOT the query model, need to create a textModel ref

			const myRequestId = ++this.workerRequestTokenId;
			this.workerRequestCompleted = false;

			if (!WordHighlighter.query || !WordHighlighter.query.modelInfo) {
				return;
			}

			const queryModelRef = await this.textModelService.createModelReference(WordHighlighter.query.modelInfo.modelURI);
			try {
				this.workerRequest = this.computeWithModel(queryModelRef.object.textEditorModel, WordHighlighter.query.modelInfo.selection, [this.model]);
				this.workerRequest?.result.then(data => {
					if (myRequestId === this.workerRequestTokenId) {
						this.workerRequestCompleted = true;
						this.workerRequestValue = data || [];
						this._beginRenderDecorations(delay ?? this.occurrencesHighlightDelay);
					}
				}, onUnexpectedError);
			} catch (e) {
				this.logService.error('Unexpected error during occurrence request. Log: ', e);
			} finally {
				queryModelRef.dispose();
			}
		}
	}

	private computeWithModel(model: ITextModel, selection: Selection, otherModels: ITextModel[]): IOccurenceAtPositionRequest | null {
		if (!otherModels.length) {
			return computeOccurencesAtPosition(this.providers, model, selection, this.editor.getOption(EditorOption.wordSeparators));
		} else {
			return computeOccurencesMultiModel(this.multiDocumentProviders, model, selection, this.editor.getOption(EditorOption.wordSeparators), otherModels);
		}
	}

	private _beginRenderDecorations(delay: number): void {
		const currentTime = (new Date()).getTime();
		const minimumRenderTime = this.lastCursorPositionChangeTime + delay;

		if (currentTime >= minimumRenderTime) {
			// Synchronous
			this.renderDecorationsTimer = undefined;
			this.renderDecorations();
		} else {
			// Asynchronous
			this.renderDecorationsTimer = setTimeout(() => {
				this.renderDecorations();
			}, (minimumRenderTime - currentTime));
		}
	}

	private renderDecorations(): void {
		this.renderDecorationsTimer = undefined;
		// create new loop, iterate over current editors using this.codeEditorService.listCodeEditors(),
		// if the URI of that codeEditor is in the map, then add the decorations to the decorations array
		// then set the decorations for the editor
		const currentEditors = this.codeEditorService.listCodeEditors();
		for (const editor of currentEditors) {
			const editorHighlighterContrib = WordHighlighterContribution.get(editor);
			if (!editorHighlighterContrib) {
				continue;
			}

			const newDecorations: IModelDeltaDecoration[] = [];
			const uri = editor.getModel()?.uri;
			if (uri && this.workerRequestValue.has(uri)) {
				const oldDecorationIDs: string[] | undefined = WordHighlighter.storedDecorationIDs.get(uri);
				const newDocumentHighlights = this.workerRequestValue.get(uri);
				if (newDocumentHighlights) {
					for (const highlight of newDocumentHighlights) {
						if (!highlight.range) {
							continue;
						}
						newDecorations.push({
							range: highlight.range,
							options: getHighlightDecorationOptions(highlight.kind)
						});
					}
				}

				let newDecorationIDs: string[] = [];
				editor.changeDecorations((changeAccessor) => {
					newDecorationIDs = changeAccessor.deltaDecorations(oldDecorationIDs ?? [], newDecorations);
				});
				WordHighlighter.storedDecorationIDs = WordHighlighter.storedDecorationIDs.set(uri, newDecorationIDs);

				if (newDecorations.length > 0) {
					editorHighlighterContrib.wordHighlighter?.decorations.set(newDecorations);
					editorHighlighterContrib.wordHighlighter?._hasWordHighlights.set(true);
				}
			}
		}

		// clear the worker request when decorations are completed
		this.workerRequest = null;
	}

	public dispose(): void {
		this._stopSingular();
		this.toUnhook.dispose();
	}
}

export class WordHighlighterContribution extends Disposable implements IEditorContribution {

	public static readonly ID = 'editor.contrib.wordHighlighter';

	public static get(editor: ICodeEditor): WordHighlighterContribution | null {
		return editor.getContribution<WordHighlighterContribution>(WordHighlighterContribution.ID);
	}

	private _wordHighlighter: WordHighlighter | null;

	constructor(
		editor: ICodeEditor,
		@IContextKeyService contextKeyService: IContextKeyService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@ITextModelService textModelService: ITextModelService,
		@IConfigurationService configurationService: IConfigurationService,
		@ILogService logService: ILogService,
	) {
		super();
		this._wordHighlighter = null;
		const createWordHighlighterIfPossible = () => {
			if (editor.hasModel() && !editor.getModel().isTooLargeForTokenization() && editor.getModel().uri.scheme !== Schemas.accessibleView) {
				this._wordHighlighter = new WordHighlighter(editor, languageFeaturesService.documentHighlightProvider, languageFeaturesService.multiDocumentHighlightProvider, contextKeyService, textModelService, codeEditorService, configurationService, logService);
			}
		};
		this._register(editor.onDidChangeModel((e) => {
			if (this._wordHighlighter) {
				if (!e.newModelUrl && e.oldModelUrl?.scheme !== Schemas.vscodeNotebookCell) { // happens when switching tabs to a notebook that has focus in the cell list, no new model URI (this also doesn't make it to the wordHighlighter, bc no editor.hasModel)
					this.wordHighlighter?.stop();
				}

				this._wordHighlighter.dispose();
				this._wordHighlighter = null;
			}
			createWordHighlighterIfPossible();
		}));
		createWordHighlighterIfPossible();
	}

	public get wordHighlighter(): WordHighlighter | null {
		return this._wordHighlighter;
	}

	public saveViewState(): boolean {
		if (this._wordHighlighter && this._wordHighlighter.hasDecorations()) {
			return true;
		}
		return false;
	}

	public moveNext() {
		this._wordHighlighter?.moveNext();
	}

	public moveBack() {
		this._wordHighlighter?.moveBack();
	}

	public restoreViewState(state: boolean | undefined): void {
		if (this._wordHighlighter && state) {
			this._wordHighlighter.restore(250); // 250 ms delay to restoring view state, since only exts call this
		}
	}

	public stopHighlighting() {
		this._wordHighlighter?.stop();
	}

	public override dispose(): void {
		if (this._wordHighlighter) {
			this._wordHighlighter.dispose();
			this._wordHighlighter = null;
		}
		super.dispose();
	}
}


class WordHighlightNavigationAction extends EditorAction {

	private readonly _isNext: boolean;

	constructor(next: boolean, opts: IActionOptions) {
		super(opts);
		this._isNext = next;
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const controller = WordHighlighterContribution.get(editor);
		if (!controller) {
			return;
		}

		if (this._isNext) {
			controller.moveNext();
		} else {
			controller.moveBack();
		}
	}
}

class NextWordHighlightAction extends WordHighlightNavigationAction {
	constructor() {
		super(true, {
			id: 'editor.action.wordHighlight.next',
			label: nls.localize2('wordHighlight.next.label', "Go to Next Symbol Highlight"),
			precondition: ctxHasWordHighlights,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyCode.F7,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}
}

class PrevWordHighlightAction extends WordHighlightNavigationAction {
	constructor() {
		super(false, {
			id: 'editor.action.wordHighlight.prev',
			label: nls.localize2('wordHighlight.previous.label', "Go to Previous Symbol Highlight"),
			precondition: ctxHasWordHighlights,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.Shift | KeyCode.F7,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}
}

class TriggerWordHighlightAction extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.wordHighlight.trigger',
			label: nls.localize2('wordHighlight.trigger.label', "Trigger Symbol Highlight"),
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: 0,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const controller = WordHighlighterContribution.get(editor);
		if (!controller) {
			return;
		}

		controller.restoreViewState(true);
	}
}

registerEditorContribution(WordHighlighterContribution.ID, WordHighlighterContribution, EditorContributionInstantiation.Eager); // eager because it uses `saveViewState`/`restoreViewState`
registerEditorAction(NextWordHighlightAction);
registerEditorAction(PrevWordHighlightAction);
registerEditorAction(TriggerWordHighlightAction);
registerEditorFeature(TextualMultiDocumentHighlightFeature);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/wordOperations/browser/wordOperations.ts]---
Location: vscode-main/src/vs/editor/contrib/wordOperations/browser/wordOperations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import * as nls from '../../../../nls.js';
import { CONTEXT_ACCESSIBILITY_MODE_ENABLED } from '../../../../platform/accessibility/common/accessibility.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { IsWindowsContext } from '../../../../platform/contextkey/common/contextkeys.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, EditorCommand, ICommandOptions, registerEditorAction, registerEditorCommand, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { ReplaceCommand } from '../../../common/commands/replaceCommand.js';
import { EditorOption, EditorOptions } from '../../../common/config/editorOptions.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { getMapForWordSeparators, WordCharacterClassifier } from '../../../common/core/wordCharacterClassifier.js';
import { DeleteWordContext, WordNavigationType, WordOperations } from '../../../common/cursor/cursorWordOperations.js';
import { CursorState } from '../../../common/cursorCommon.js';
import { CursorChangeReason } from '../../../common/cursorEvents.js';
import { ScrollType } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { ITextModel } from '../../../common/model.js';

export interface MoveWordOptions extends ICommandOptions {
	inSelectionMode: boolean;
	wordNavigationType: WordNavigationType;
}

export abstract class MoveWordCommand extends EditorCommand {

	private readonly _inSelectionMode: boolean;
	private readonly _wordNavigationType: WordNavigationType;

	constructor(opts: MoveWordOptions) {
		super(opts);
		this._inSelectionMode = opts.inSelectionMode;
		this._wordNavigationType = opts.wordNavigationType;
	}

	public runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, args: unknown): void {
		if (!editor.hasModel()) {
			return;
		}
		const wordSeparators = getMapForWordSeparators(editor.getOption(EditorOption.wordSeparators), editor.getOption(EditorOption.wordSegmenterLocales));
		const model = editor.getModel();
		const selections = editor.getSelections();
		const hasMulticursor = selections.length > 1;
		const result = selections.map((sel) => {
			const inPosition = new Position(sel.positionLineNumber, sel.positionColumn);
			const outPosition = this._move(wordSeparators, model, inPosition, this._wordNavigationType, hasMulticursor);
			return this._moveTo(sel, outPosition, this._inSelectionMode);
		});

		model.pushStackElement();
		editor._getViewModel().setCursorStates('moveWordCommand', CursorChangeReason.Explicit, result.map(r => CursorState.fromModelSelection(r)));
		if (result.length === 1) {
			const pos = new Position(result[0].positionLineNumber, result[0].positionColumn);
			editor.revealPosition(pos, ScrollType.Smooth);
		}
	}

	private _moveTo(from: Selection, to: Position, inSelectionMode: boolean): Selection {
		if (inSelectionMode) {
			// move just position
			return new Selection(
				from.selectionStartLineNumber,
				from.selectionStartColumn,
				to.lineNumber,
				to.column
			);
		} else {
			// move everything
			return new Selection(
				to.lineNumber,
				to.column,
				to.lineNumber,
				to.column
			);
		}
	}

	protected abstract _move(wordSeparators: WordCharacterClassifier, model: ITextModel, position: Position, wordNavigationType: WordNavigationType, hasMulticursor: boolean): Position;
}

export class WordLeftCommand extends MoveWordCommand {
	protected _move(wordSeparators: WordCharacterClassifier, model: ITextModel, position: Position, wordNavigationType: WordNavigationType, hasMulticursor: boolean): Position {
		return WordOperations.moveWordLeft(wordSeparators, model, position, wordNavigationType, hasMulticursor);
	}
}

export class WordRightCommand extends MoveWordCommand {
	protected _move(wordSeparators: WordCharacterClassifier, model: ITextModel, position: Position, wordNavigationType: WordNavigationType, hasMulticursor: boolean): Position {
		return WordOperations.moveWordRight(wordSeparators, model, position, wordNavigationType);
	}
}

export class CursorWordStartLeft extends WordLeftCommand {
	constructor() {
		super({
			inSelectionMode: false,
			wordNavigationType: WordNavigationType.WordStart,
			id: 'cursorWordStartLeft',
			precondition: undefined
		});
	}
}

export class CursorWordEndLeft extends WordLeftCommand {
	constructor() {
		super({
			inSelectionMode: false,
			wordNavigationType: WordNavigationType.WordEnd,
			id: 'cursorWordEndLeft',
			precondition: undefined
		});
	}
}

export class CursorWordLeft extends WordLeftCommand {
	constructor() {
		super({
			inSelectionMode: false,
			wordNavigationType: WordNavigationType.WordStartFast,
			id: 'cursorWordLeft',
			precondition: undefined,
			kbOpts: {
				kbExpr: ContextKeyExpr.and(EditorContextKeys.textInputFocus, ContextKeyExpr.and(CONTEXT_ACCESSIBILITY_MODE_ENABLED, IsWindowsContext)?.negate()),
				primary: KeyMod.CtrlCmd | KeyCode.LeftArrow,
				mac: { primary: KeyMod.Alt | KeyCode.LeftArrow },
				weight: KeybindingWeight.EditorContrib
			}
		});
	}
}

export class CursorWordStartLeftSelect extends WordLeftCommand {
	constructor() {
		super({
			inSelectionMode: true,
			wordNavigationType: WordNavigationType.WordStart,
			id: 'cursorWordStartLeftSelect',
			precondition: undefined
		});
	}
}

export class CursorWordEndLeftSelect extends WordLeftCommand {
	constructor() {
		super({
			inSelectionMode: true,
			wordNavigationType: WordNavigationType.WordEnd,
			id: 'cursorWordEndLeftSelect',
			precondition: undefined
		});
	}
}

export class CursorWordLeftSelect extends WordLeftCommand {
	constructor() {
		super({
			inSelectionMode: true,
			wordNavigationType: WordNavigationType.WordStartFast,
			id: 'cursorWordLeftSelect',
			precondition: undefined,
			kbOpts: {
				kbExpr: ContextKeyExpr.and(EditorContextKeys.textInputFocus, ContextKeyExpr.and(CONTEXT_ACCESSIBILITY_MODE_ENABLED, IsWindowsContext)?.negate()),
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.LeftArrow,
				mac: { primary: KeyMod.Alt | KeyMod.Shift | KeyCode.LeftArrow },
				weight: KeybindingWeight.EditorContrib
			}
		});
	}
}

// Accessibility navigation commands should only be enabled on windows since they are tuned to what NVDA expects
export class CursorWordAccessibilityLeft extends WordLeftCommand {
	constructor() {
		super({
			inSelectionMode: false,
			wordNavigationType: WordNavigationType.WordAccessibility,
			id: 'cursorWordAccessibilityLeft',
			precondition: undefined
		});
	}

	protected override _move(wordCharacterClassifier: WordCharacterClassifier, model: ITextModel, position: Position, wordNavigationType: WordNavigationType, hasMulticursor: boolean): Position {
		return super._move(getMapForWordSeparators(EditorOptions.wordSeparators.defaultValue, wordCharacterClassifier.intlSegmenterLocales), model, position, wordNavigationType, hasMulticursor);
	}
}

export class CursorWordAccessibilityLeftSelect extends WordLeftCommand {
	constructor() {
		super({
			inSelectionMode: true,
			wordNavigationType: WordNavigationType.WordAccessibility,
			id: 'cursorWordAccessibilityLeftSelect',
			precondition: undefined
		});
	}

	protected override _move(wordCharacterClassifier: WordCharacterClassifier, model: ITextModel, position: Position, wordNavigationType: WordNavigationType, hasMulticursor: boolean): Position {
		return super._move(getMapForWordSeparators(EditorOptions.wordSeparators.defaultValue, wordCharacterClassifier.intlSegmenterLocales), model, position, wordNavigationType, hasMulticursor);
	}
}

export class CursorWordStartRight extends WordRightCommand {
	constructor() {
		super({
			inSelectionMode: false,
			wordNavigationType: WordNavigationType.WordStart,
			id: 'cursorWordStartRight',
			precondition: undefined
		});
	}
}

export class CursorWordEndRight extends WordRightCommand {
	constructor() {
		super({
			inSelectionMode: false,
			wordNavigationType: WordNavigationType.WordEnd,
			id: 'cursorWordEndRight',
			precondition: undefined,
			kbOpts: {
				kbExpr: ContextKeyExpr.and(EditorContextKeys.textInputFocus, ContextKeyExpr.and(CONTEXT_ACCESSIBILITY_MODE_ENABLED, IsWindowsContext)?.negate()),
				primary: KeyMod.CtrlCmd | KeyCode.RightArrow,
				mac: { primary: KeyMod.Alt | KeyCode.RightArrow },
				weight: KeybindingWeight.EditorContrib
			}
		});
	}
}

export class CursorWordRight extends WordRightCommand {
	constructor() {
		super({
			inSelectionMode: false,
			wordNavigationType: WordNavigationType.WordEnd,
			id: 'cursorWordRight',
			precondition: undefined
		});
	}
}

export class CursorWordStartRightSelect extends WordRightCommand {
	constructor() {
		super({
			inSelectionMode: true,
			wordNavigationType: WordNavigationType.WordStart,
			id: 'cursorWordStartRightSelect',
			precondition: undefined
		});
	}
}

export class CursorWordEndRightSelect extends WordRightCommand {
	constructor() {
		super({
			inSelectionMode: true,
			wordNavigationType: WordNavigationType.WordEnd,
			id: 'cursorWordEndRightSelect',
			precondition: undefined,
			kbOpts: {
				kbExpr: ContextKeyExpr.and(EditorContextKeys.textInputFocus, ContextKeyExpr.and(CONTEXT_ACCESSIBILITY_MODE_ENABLED, IsWindowsContext)?.negate()),
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.RightArrow,
				mac: { primary: KeyMod.Alt | KeyMod.Shift | KeyCode.RightArrow },
				weight: KeybindingWeight.EditorContrib
			}
		});
	}
}

export class CursorWordRightSelect extends WordRightCommand {
	constructor() {
		super({
			inSelectionMode: true,
			wordNavigationType: WordNavigationType.WordEnd,
			id: 'cursorWordRightSelect',
			precondition: undefined
		});
	}
}

export class CursorWordAccessibilityRight extends WordRightCommand {
	constructor() {
		super({
			inSelectionMode: false,
			wordNavigationType: WordNavigationType.WordAccessibility,
			id: 'cursorWordAccessibilityRight',
			precondition: undefined
		});
	}

	protected override _move(wordCharacterClassifier: WordCharacterClassifier, model: ITextModel, position: Position, wordNavigationType: WordNavigationType, hasMulticursor: boolean): Position {
		return super._move(getMapForWordSeparators(EditorOptions.wordSeparators.defaultValue, wordCharacterClassifier.intlSegmenterLocales), model, position, wordNavigationType, hasMulticursor);
	}
}

export class CursorWordAccessibilityRightSelect extends WordRightCommand {
	constructor() {
		super({
			inSelectionMode: true,
			wordNavigationType: WordNavigationType.WordAccessibility,
			id: 'cursorWordAccessibilityRightSelect',
			precondition: undefined
		});
	}

	protected override _move(wordCharacterClassifier: WordCharacterClassifier, model: ITextModel, position: Position, wordNavigationType: WordNavigationType, hasMulticursor: boolean): Position {
		return super._move(getMapForWordSeparators(EditorOptions.wordSeparators.defaultValue, wordCharacterClassifier.intlSegmenterLocales), model, position, wordNavigationType, hasMulticursor);
	}
}

export interface DeleteWordOptions extends ICommandOptions {
	whitespaceHeuristics: boolean;
	wordNavigationType: WordNavigationType;
}

export abstract class DeleteWordCommand extends EditorCommand {
	private readonly _whitespaceHeuristics: boolean;
	private readonly _wordNavigationType: WordNavigationType;

	constructor(opts: DeleteWordOptions) {
		super({ canTriggerInlineEdits: true, ...opts });
		this._whitespaceHeuristics = opts.whitespaceHeuristics;
		this._wordNavigationType = opts.wordNavigationType;
	}

	public runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, args: unknown): void {
		const languageConfigurationService = accessor?.get(ILanguageConfigurationService);

		if (!editor.hasModel() || !languageConfigurationService) {
			return;
		}
		const wordSeparators = getMapForWordSeparators(editor.getOption(EditorOption.wordSeparators), editor.getOption(EditorOption.wordSegmenterLocales));
		const model = editor.getModel();
		const selections = editor.getSelections();
		const autoClosingBrackets = editor.getOption(EditorOption.autoClosingBrackets);
		const autoClosingQuotes = editor.getOption(EditorOption.autoClosingQuotes);
		const autoClosingPairs = languageConfigurationService.getLanguageConfiguration(model.getLanguageId()).getAutoClosingPairs();
		const viewModel = editor._getViewModel();

		const commands = selections.map((sel) => {
			const deleteRange = this._delete({
				wordSeparators,
				model,
				selection: sel,
				whitespaceHeuristics: this._whitespaceHeuristics,
				autoClosingDelete: editor.getOption(EditorOption.autoClosingDelete),
				autoClosingBrackets,
				autoClosingQuotes,
				autoClosingPairs,
				autoClosedCharacters: viewModel.getCursorAutoClosedCharacters(),
			}, this._wordNavigationType);
			return new ReplaceCommand(deleteRange, '');
		});

		editor.pushUndoStop();
		editor.executeCommands(this.id, commands);
		editor.pushUndoStop();
	}

	protected abstract _delete(ctx: DeleteWordContext, wordNavigationType: WordNavigationType): Range;
}

export class DeleteWordLeftCommand extends DeleteWordCommand {
	protected _delete(ctx: DeleteWordContext, wordNavigationType: WordNavigationType): Range {
		const r = WordOperations.deleteWordLeft(ctx, wordNavigationType);
		if (r) {
			return r;
		}
		return new Range(1, 1, 1, 1);
	}
}

export class DeleteWordRightCommand extends DeleteWordCommand {
	protected _delete(ctx: DeleteWordContext, wordNavigationType: WordNavigationType): Range {
		const r = WordOperations.deleteWordRight(ctx, wordNavigationType);
		if (r) {
			return r;
		}
		const lineCount = ctx.model.getLineCount();
		const maxColumn = ctx.model.getLineMaxColumn(lineCount);
		return new Range(lineCount, maxColumn, lineCount, maxColumn);
	}
}

export class DeleteWordStartLeft extends DeleteWordLeftCommand {
	constructor() {
		super({
			whitespaceHeuristics: false,
			wordNavigationType: WordNavigationType.WordStart,
			id: 'deleteWordStartLeft',
			precondition: EditorContextKeys.writable
		});
	}
}

export class DeleteWordEndLeft extends DeleteWordLeftCommand {
	constructor() {
		super({
			whitespaceHeuristics: false,
			wordNavigationType: WordNavigationType.WordEnd,
			id: 'deleteWordEndLeft',
			precondition: EditorContextKeys.writable
		});
	}
}

export class DeleteWordLeft extends DeleteWordLeftCommand {
	constructor() {
		super({
			whitespaceHeuristics: true,
			wordNavigationType: WordNavigationType.WordStart,
			id: 'deleteWordLeft',
			precondition: EditorContextKeys.writable,
			kbOpts: {
				kbExpr: EditorContextKeys.textInputFocus,
				primary: KeyMod.CtrlCmd | KeyCode.Backspace,
				mac: { primary: KeyMod.Alt | KeyCode.Backspace },
				weight: KeybindingWeight.EditorContrib
			}
		});
	}
}

export class DeleteWordStartRight extends DeleteWordRightCommand {
	constructor() {
		super({
			whitespaceHeuristics: false,
			wordNavigationType: WordNavigationType.WordStart,
			id: 'deleteWordStartRight',
			precondition: EditorContextKeys.writable
		});
	}
}

export class DeleteWordEndRight extends DeleteWordRightCommand {
	constructor() {
		super({
			whitespaceHeuristics: false,
			wordNavigationType: WordNavigationType.WordEnd,
			id: 'deleteWordEndRight',
			precondition: EditorContextKeys.writable
		});
	}
}

export class DeleteWordRight extends DeleteWordRightCommand {
	constructor() {
		super({
			whitespaceHeuristics: true,
			wordNavigationType: WordNavigationType.WordEnd,
			id: 'deleteWordRight',
			precondition: EditorContextKeys.writable,
			kbOpts: {
				kbExpr: EditorContextKeys.textInputFocus,
				primary: KeyMod.CtrlCmd | KeyCode.Delete,
				mac: { primary: KeyMod.Alt | KeyCode.Delete },
				weight: KeybindingWeight.EditorContrib
			}
		});
	}
}

export class DeleteInsideWord extends EditorAction {

	constructor() {
		super({
			id: 'deleteInsideWord',
			precondition: EditorContextKeys.writable,
			label: nls.localize2('deleteInsideWord', "Delete Word"),
			metadata: {
				description: nls.localize2('deleteInsideWord.description', "Delete the word at the cursor"),
				args: [{
					name: 'args',
					schema: {
						type: 'object',
						properties: {
							'onlyWord': {
								type: 'boolean',
								default: false,
								description: nls.localize('deleteInsideWord.args.onlyWord', "Delete only the word and leave surrounding whitespace")
							}
						}
					}
				}]
			}
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor, args: unknown): void {
		if (!editor.hasModel()) {
			return;
		}

		type DeleteInsideWordArgs = { readonly onlyWord?: boolean };
		const onlyWord = !!(args && typeof args === 'object' && (args as DeleteInsideWordArgs).onlyWord);
		const wordSeparators = getMapForWordSeparators(editor.getOption(EditorOption.wordSeparators), editor.getOption(EditorOption.wordSegmenterLocales));
		const model = editor.getModel();
		const selections = editor.getSelections();

		const commands = selections.map((sel) => {
			const deleteRange = WordOperations.deleteInsideWord(wordSeparators, model, sel, onlyWord);
			return new ReplaceCommand(deleteRange, '');
		});

		editor.pushUndoStop();
		editor.executeCommands(this.id, commands);
		editor.pushUndoStop();
	}
}

registerEditorCommand(new CursorWordStartLeft());
registerEditorCommand(new CursorWordEndLeft());
registerEditorCommand(new CursorWordLeft());
registerEditorCommand(new CursorWordStartLeftSelect());
registerEditorCommand(new CursorWordEndLeftSelect());
registerEditorCommand(new CursorWordLeftSelect());
registerEditorCommand(new CursorWordStartRight());
registerEditorCommand(new CursorWordEndRight());
registerEditorCommand(new CursorWordRight());
registerEditorCommand(new CursorWordStartRightSelect());
registerEditorCommand(new CursorWordEndRightSelect());
registerEditorCommand(new CursorWordRightSelect());
registerEditorCommand(new CursorWordAccessibilityLeft());
registerEditorCommand(new CursorWordAccessibilityLeftSelect());
registerEditorCommand(new CursorWordAccessibilityRight());
registerEditorCommand(new CursorWordAccessibilityRightSelect());
registerEditorCommand(new DeleteWordStartLeft());
registerEditorCommand(new DeleteWordEndLeft());
registerEditorCommand(new DeleteWordLeft());
registerEditorCommand(new DeleteWordStartRight());
registerEditorCommand(new DeleteWordEndRight());
registerEditorCommand(new DeleteWordRight());
registerEditorAction(DeleteInsideWord);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/wordOperations/test/browser/wordOperations.test.ts]---
Location: vscode-main/src/vs/editor/contrib/wordOperations/test/browser/wordOperations.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { isFirefox } from '../../../../../base/common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { CoreEditingCommands } from '../../../../browser/coreCommands.js';
import { ICodeEditor } from '../../../../browser/editorBrowser.js';
import { EditorCommand } from '../../../../browser/editorExtensions.js';
import { Position } from '../../../../common/core/position.js';
import { Selection } from '../../../../common/core/selection.js';
import { ILanguageService } from '../../../../common/languages/language.js';
import { ILanguageConfigurationService } from '../../../../common/languages/languageConfigurationRegistry.js';
import { ViewModel } from '../../../../common/viewModel/viewModelImpl.js';
import { CursorWordAccessibilityLeft, CursorWordAccessibilityLeftSelect, CursorWordAccessibilityRight, CursorWordAccessibilityRightSelect, CursorWordEndLeft, CursorWordEndLeftSelect, CursorWordEndRight, CursorWordEndRightSelect, CursorWordLeft, CursorWordLeftSelect, CursorWordRight, CursorWordRightSelect, CursorWordStartLeft, CursorWordStartLeftSelect, CursorWordStartRight, CursorWordStartRightSelect, DeleteInsideWord, DeleteWordEndLeft, DeleteWordEndRight, DeleteWordLeft, DeleteWordRight, DeleteWordStartLeft, DeleteWordStartRight } from '../../browser/wordOperations.js';
import { deserializePipePositions, serializePipePositions, testRepeatedActionAndExtractPositions } from './wordTestUtils.js';
import { createCodeEditorServices, instantiateTestCodeEditor, withTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';
import { instantiateTextModel } from '../../../../test/common/testTextModel.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';

suite('WordOperations', () => {

	const _cursorWordStartLeft = new CursorWordStartLeft();
	const _cursorWordEndLeft = new CursorWordEndLeft();
	const _cursorWordLeft = new CursorWordLeft();
	const _cursorWordStartLeftSelect = new CursorWordStartLeftSelect();
	const _cursorWordEndLeftSelect = new CursorWordEndLeftSelect();
	const _cursorWordLeftSelect = new CursorWordLeftSelect();
	const _cursorWordStartRight = new CursorWordStartRight();
	const _cursorWordEndRight = new CursorWordEndRight();
	const _cursorWordRight = new CursorWordRight();
	const _cursorWordStartRightSelect = new CursorWordStartRightSelect();
	const _cursorWordEndRightSelect = new CursorWordEndRightSelect();
	const _cursorWordRightSelect = new CursorWordRightSelect();
	const _cursorWordAccessibilityLeft = new CursorWordAccessibilityLeft();
	const _cursorWordAccessibilityLeftSelect = new CursorWordAccessibilityLeftSelect();
	const _cursorWordAccessibilityRight = new CursorWordAccessibilityRight();
	const _cursorWordAccessibilityRightSelect = new CursorWordAccessibilityRightSelect();
	const _deleteWordLeft = new DeleteWordLeft();
	const _deleteWordStartLeft = new DeleteWordStartLeft();
	const _deleteWordEndLeft = new DeleteWordEndLeft();
	const _deleteWordRight = new DeleteWordRight();
	const _deleteWordStartRight = new DeleteWordStartRight();
	const _deleteWordEndRight = new DeleteWordEndRight();
	const _deleteInsideWord = new DeleteInsideWord();

	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;
	let languageConfigurationService: ILanguageConfigurationService;
	let languageService: ILanguageService;

	setup(() => {
		disposables = new DisposableStore();
		instantiationService = createCodeEditorServices(disposables);
		languageConfigurationService = instantiationService.get(ILanguageConfigurationService);
		languageService = instantiationService.get(ILanguageService);
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	function runEditorCommand(editor: ICodeEditor, command: EditorCommand): void {
		instantiationService.invokeFunction((accessor) => {
			command.runEditorCommand(accessor, editor, null);
		});
	}
	function cursorWordLeft(editor: ICodeEditor, inSelectionMode: boolean = false): void {
		runEditorCommand(editor, inSelectionMode ? _cursorWordLeftSelect : _cursorWordLeft);
	}
	function cursorWordAccessibilityLeft(editor: ICodeEditor, inSelectionMode: boolean = false): void {
		runEditorCommand(editor, inSelectionMode ? _cursorWordAccessibilityLeft : _cursorWordAccessibilityLeftSelect);
	}
	function cursorWordAccessibilityRight(editor: ICodeEditor, inSelectionMode: boolean = false): void {
		runEditorCommand(editor, inSelectionMode ? _cursorWordAccessibilityRightSelect : _cursorWordAccessibilityRight);
	}
	function cursorWordStartLeft(editor: ICodeEditor, inSelectionMode: boolean = false): void {
		runEditorCommand(editor, inSelectionMode ? _cursorWordStartLeftSelect : _cursorWordStartLeft);
	}
	function cursorWordEndLeft(editor: ICodeEditor, inSelectionMode: boolean = false): void {
		runEditorCommand(editor, inSelectionMode ? _cursorWordEndLeftSelect : _cursorWordEndLeft);
	}
	function cursorWordRight(editor: ICodeEditor, inSelectionMode: boolean = false): void {
		runEditorCommand(editor, inSelectionMode ? _cursorWordRightSelect : _cursorWordRight);
	}
	function moveWordEndRight(editor: ICodeEditor, inSelectionMode: boolean = false): void {
		runEditorCommand(editor, inSelectionMode ? _cursorWordEndRightSelect : _cursorWordEndRight);
	}
	function moveWordStartRight(editor: ICodeEditor, inSelectionMode: boolean = false): void {
		runEditorCommand(editor, inSelectionMode ? _cursorWordStartRightSelect : _cursorWordStartRight);
	}
	function deleteWordLeft(editor: ICodeEditor): void {
		runEditorCommand(editor, _deleteWordLeft);
	}
	function deleteWordStartLeft(editor: ICodeEditor): void {
		runEditorCommand(editor, _deleteWordStartLeft);
	}
	function deleteWordEndLeft(editor: ICodeEditor): void {
		runEditorCommand(editor, _deleteWordEndLeft);
	}
	function deleteWordRight(editor: ICodeEditor): void {
		runEditorCommand(editor, _deleteWordRight);
	}
	function deleteWordStartRight(editor: ICodeEditor): void {
		runEditorCommand(editor, _deleteWordStartRight);
	}
	function deleteWordEndRight(editor: ICodeEditor): void {
		runEditorCommand(editor, _deleteWordEndRight);
	}
	function deleteInsideWord(editor: ICodeEditor, args?: unknown): void {
		_deleteInsideWord.run(null!, editor, args);
	}

	test('cursorWordLeft - simple', () => {
		const EXPECTED = [
			'|    \t|My |First |Line\t ',
			'|\t|My |Second |Line',
			'|    |Third |Line🐶',
			'|',
			'|1',
		].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1000, 1000),
			ed => cursorWordLeft(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 1))
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('cursorWordLeft - with selection', () => {
		withTestCodeEditor([
			'    \tMy First Line\t ',
			'\tMy Second Line',
			'    Third Line🐶',
			'',
			'1',
		], {}, (editor) => {
			editor.setPosition(new Position(5, 2));
			cursorWordLeft(editor, true);
			assert.deepStrictEqual(editor.getSelection(), new Selection(5, 2, 5, 1));
		});
	});

	test('cursorWordLeft - issue #832', () => {
		const EXPECTED = ['|   |/* |Just |some   |more   |text |a|+= |3 |+|5-|3 |+ |7 |*/  '].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1000, 1000),
			ed => cursorWordLeft(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 1))
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('cursorWordLeft - issue #48046: Word selection doesn\'t work as usual', () => {
		const EXPECTED = [
			'|deep.|object.|property',
		].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1, 21),
			ed => cursorWordLeft(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 1))
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('cursorWordLeft - Recognize words', function () {
		if (isFirefox) {
			// https://github.com/microsoft/vscode/issues/219843
			return this.skip();
		}
		const EXPECTED = [
			'|/* |これ|は|テスト|です |/*',
		].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1000, 1000),
			ed => cursorWordLeft(ed, true),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 1)),
			{
				wordSegmenterLocales: 'ja'
			}
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('cursorWordLeft - Does not recognize words', () => {
		const EXPECTED = [
			'|/* |これはテストです |/*',
		].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1000, 1000),
			ed => cursorWordLeft(ed, true),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 1)),
			{
				wordSegmenterLocales: ''
			}
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('cursorWordLeft - issue #169904: cursors out of sync', () => {
		const text = [
			'.grid1 {',
			'  display: grid;',
			'  grid-template-columns:',
			'    [full-start] minmax(1em, 1fr)',
			'    [main-start] minmax(0, 40em) [main-end]',
			'    minmax(1em, 1fr) [full-end];',
			'}',
			'.grid2 {',
			'  display: grid;',
			'  grid-template-columns:',
			'    [full-start] minmax(1em, 1fr)',
			'    [main-start] minmax(0, 40em) [main-end] minmax(1em, 1fr) [full-end];',
			'}',
		];
		withTestCodeEditor(text, {}, (editor) => {
			editor.setSelections([
				new Selection(5, 44, 5, 44),
				new Selection(6, 32, 6, 32),
				new Selection(12, 44, 12, 44),
				new Selection(12, 72, 12, 72),
			]);
			cursorWordLeft(editor, false);
			assert.deepStrictEqual(editor.getSelections(), [
				new Selection(5, 43, 5, 43),
				new Selection(6, 31, 6, 31),
				new Selection(12, 43, 12, 43),
				new Selection(12, 71, 12, 71),
			]);

		});
	});

	test('cursorWordLeftSelect - issue #74369: cursorWordLeft and cursorWordLeftSelect do not behave consistently', () => {
		const EXPECTED = [
			'|this.|is.|a.|test',
		].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1, 15),
			ed => cursorWordLeft(ed, true),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 1))
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('cursorWordStartLeft', () => {
		// This is the behaviour observed in Visual Studio, please do not touch test
		const EXPECTED = ['|   |/* |Just |some   |more   |text |a|+= |3 |+|5|-|3 |+ |7 |*/  '].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1000, 1000),
			ed => cursorWordStartLeft(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 1))
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('cursorWordStartLeft - issue #51119: regression makes VS compatibility impossible', () => {
		// This is the behaviour observed in Visual Studio, please do not touch test
		const EXPECTED = ['|this|.|is|.|a|.|test'].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1000, 1000),
			ed => cursorWordStartLeft(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 1))
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('issue #51275 - cursorWordStartLeft does not push undo/redo stack element', () => {
		function type(viewModel: ViewModel, text: string) {
			for (let i = 0; i < text.length; i++) {
				viewModel.type(text.charAt(i), 'keyboard');
			}
		}

		withTestCodeEditor('', {}, (editor, viewModel) => {
			type(viewModel, 'foo bar baz');
			assert.strictEqual(editor.getValue(), 'foo bar baz');

			cursorWordStartLeft(editor);
			cursorWordStartLeft(editor);
			type(viewModel, 'q');

			assert.strictEqual(editor.getValue(), 'foo qbar baz');

			editor.runCommand(CoreEditingCommands.Undo, null);
			assert.strictEqual(editor.getValue(), 'foo bar baz');
		});
	});

	test('cursorWordEndLeft', () => {
		const EXPECTED = ['|   /*| Just| some|   more|   text| a|+=| 3| +|5|-|3| +| 7| */|  '].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1000, 1000),
			ed => cursorWordEndLeft(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 1))
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('cursorWordRight - simple', () => {
		const EXPECTED = [
			'    \tMy| First| Line|\t |',
			'\tMy| Second| Line|',
			'    Third| Line🐶|',
			'|',
			'1|',
		].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1, 1),
			ed => cursorWordRight(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(5, 2))
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('cursorWordRight - selection', () => {
		withTestCodeEditor([
			'    \tMy First Line\t ',
			'\tMy Second Line',
			'    Third Line🐶',
			'',
			'1',
		], {}, (editor, _) => {
			editor.setPosition(new Position(1, 1));
			cursorWordRight(editor, true);
			assert.deepStrictEqual(editor.getSelection(), new Selection(1, 1, 1, 8));
		});
	});

	test('cursorWordRight - issue #832', () => {
		const EXPECTED = [
			'   /*| Just| some|   more|   text| a|+=| 3| +5|-3| +| 7| */|  |',
		].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1, 1),
			ed => cursorWordRight(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 50))
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('cursorWordRight - issue #41199', () => {
		const EXPECTED = [
			'console|.log|(err|)|',
		].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1, 1),
			ed => cursorWordRight(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 17))
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('cursorWordRight - Recognize words', function () {
		if (isFirefox) {
			// https://github.com/microsoft/vscode/issues/219843
			return this.skip();
		}
		const EXPECTED = [
			'/*| これ|は|テスト|です|/*|',
		].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1, 1),
			ed => cursorWordRight(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 14)),
			{
				wordSegmenterLocales: 'ja'
			}
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('cursorWordRight - Does not recognize words', () => {
		const EXPECTED = [
			'/*| これはテストです|/*|',
		].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1, 1),
			ed => cursorWordRight(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 14)),
			{
				wordSegmenterLocales: ''
			}
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('moveWordEndRight', () => {
		const EXPECTED = [
			'   /*| Just| some|   more|   text| a|+=| 3| +5|-3| +| 7| */|  |',
		].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1, 1),
			ed => moveWordEndRight(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 50))
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('moveWordStartRight', () => {
		// This is the behaviour observed in Visual Studio, please do not touch test
		const EXPECTED = [
			'   |/* |Just |some   |more   |text |a|+= |3 |+|5|-|3 |+ |7 |*/  |',
		].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1, 1),
			ed => moveWordStartRight(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 50))
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('issue #51119: cursorWordStartRight regression makes VS compatibility impossible', () => {
		// This is the behaviour observed in Visual Studio, please do not touch test
		const EXPECTED = ['this|.|is|.|a|.|test|'].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1, 1),
			ed => moveWordStartRight(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 15))
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('issue #64810: cursorWordStartRight skips first word after newline', () => {
		// This is the behaviour observed in Visual Studio, please do not touch test
		const EXPECTED = ['Hello |World|', '|Hei |mailman|'].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1, 1),
			ed => moveWordStartRight(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(2, 12))
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('cursorWordAccessibilityLeft', () => {
		const EXPECTED = ['|   /* |Just |some   |more   |text |a+= |3 +|5-|3 + |7 */  '].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1000, 1000),
			ed => cursorWordAccessibilityLeft(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 1))
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('cursorWordAccessibilityRight', () => {
		const EXPECTED = ['   /* |Just |some   |more   |text |a+= |3 +|5-|3 + |7 */  |'].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1, 1),
			ed => cursorWordAccessibilityRight(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 50))
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('deleteWordLeft for non-empty selection', () => {
		withTestCodeEditor([
			'    \tMy First Line\t ',
			'\tMy Second Line',
			'    Third Line🐶',
			'',
			'1',
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setSelection(new Selection(3, 7, 3, 9));
			deleteWordLeft(editor);
			assert.strictEqual(model.getLineContent(3), '    Thd Line🐶');
			assert.deepStrictEqual(editor.getPosition(), new Position(3, 7));
		});
	});

	test('deleteWordLeft for cursor at beginning of document', () => {
		withTestCodeEditor([
			'    \tMy First Line\t ',
			'\tMy Second Line',
			'    Third Line🐶',
			'',
			'1',
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setPosition(new Position(1, 1));
			deleteWordLeft(editor);
			assert.strictEqual(model.getLineContent(1), '    \tMy First Line\t ');
			assert.deepStrictEqual(editor.getPosition(), new Position(1, 1));
		});
	});

	test('deleteWordLeft for cursor at end of whitespace', () => {
		withTestCodeEditor([
			'    \tMy First Line\t ',
			'\tMy Second Line',
			'    Third Line🐶',
			'',
			'1',
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setPosition(new Position(3, 11));
			deleteWordLeft(editor);
			assert.strictEqual(model.getLineContent(3), '    Line🐶');
			assert.deepStrictEqual(editor.getPosition(), new Position(3, 5));
		});
	});

	test('deleteWordLeft for cursor just behind a word', () => {
		withTestCodeEditor([
			'    \tMy First Line\t ',
			'\tMy Second Line',
			'    Third Line🐶',
			'',
			'1',
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setPosition(new Position(2, 11));
			deleteWordLeft(editor);
			assert.strictEqual(model.getLineContent(2), '\tMy  Line');
			assert.deepStrictEqual(editor.getPosition(), new Position(2, 5));
		});
	});

	test('deleteWordLeft for cursor inside of a word', () => {
		withTestCodeEditor([
			'    \tMy First Line\t ',
			'\tMy Second Line',
			'    Third Line🐶',
			'',
			'1',
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setPosition(new Position(1, 12));
			deleteWordLeft(editor);
			assert.strictEqual(model.getLineContent(1), '    \tMy st Line\t ');
			assert.deepStrictEqual(editor.getPosition(), new Position(1, 9));
		});
	});

	test('deleteWordRight for non-empty selection', () => {
		withTestCodeEditor([
			'    \tMy First Line\t ',
			'\tMy Second Line',
			'    Third Line🐶',
			'',
			'1',
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setSelection(new Selection(3, 7, 3, 9));
			deleteWordRight(editor);
			assert.strictEqual(model.getLineContent(3), '    Thd Line🐶');
			assert.deepStrictEqual(editor.getPosition(), new Position(3, 7));
		});
	});

	test('deleteWordRight for cursor at end of document', () => {
		withTestCodeEditor([
			'    \tMy First Line\t ',
			'\tMy Second Line',
			'    Third Line🐶',
			'',
			'1',
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setPosition(new Position(5, 3));
			deleteWordRight(editor);
			assert.strictEqual(model.getLineContent(5), '1');
			assert.deepStrictEqual(editor.getPosition(), new Position(5, 2));
		});
	});

	test('deleteWordRight for cursor at beggining of whitespace', () => {
		withTestCodeEditor([
			'    \tMy First Line\t ',
			'\tMy Second Line',
			'    Third Line🐶',
			'',
			'1',
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setPosition(new Position(3, 1));
			deleteWordRight(editor);
			assert.strictEqual(model.getLineContent(3), 'Third Line🐶');
			assert.deepStrictEqual(editor.getPosition(), new Position(3, 1));
		});
	});

	test('deleteWordRight for cursor just before a word', () => {
		withTestCodeEditor([
			'    \tMy First Line\t ',
			'\tMy Second Line',
			'    Third Line🐶',
			'',
			'1',
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setPosition(new Position(2, 5));
			deleteWordRight(editor);
			assert.strictEqual(model.getLineContent(2), '\tMy  Line');
			assert.deepStrictEqual(editor.getPosition(), new Position(2, 5));
		});
	});

	test('deleteWordRight for cursor inside of a word', () => {
		withTestCodeEditor([
			'    \tMy First Line\t ',
			'\tMy Second Line',
			'    Third Line🐶',
			'',
			'1',
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setPosition(new Position(1, 11));
			deleteWordRight(editor);
			assert.strictEqual(model.getLineContent(1), '    \tMy Fi Line\t ');
			assert.deepStrictEqual(editor.getPosition(), new Position(1, 11));
		});
	});

	test('deleteWordLeft - issue #832', () => {
		const EXPECTED = [
			'|   |/* |Just |some |text |a|+= |3 |+|5 |*/|  ',
		].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1000, 10000),
			ed => deleteWordLeft(ed),
			ed => ed.getPosition()!,
			ed => ed.getValue().length === 0
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('deleteWordStartLeft', () => {
		const EXPECTED = [
			'|   |/* |Just |some |text |a|+= |3 |+|5 |*/  ',
		].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1000, 10000),
			ed => deleteWordStartLeft(ed),
			ed => ed.getPosition()!,
			ed => ed.getValue().length === 0
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('deleteWordEndLeft', () => {
		const EXPECTED = [
			'|   /*| Just| some| text| a|+=| 3| +|5| */|  ',
		].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1000, 10000),
			ed => deleteWordEndLeft(ed),
			ed => ed.getPosition()!,
			ed => ed.getValue().length === 0
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('deleteWordLeft - issue #24947', () => {
		withTestCodeEditor([
			'{',
			'}'
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setPosition(new Position(2, 1));
			deleteWordLeft(editor); assert.strictEqual(model.getLineContent(1), '{}');
		});

		withTestCodeEditor([
			'{',
			'}'
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setPosition(new Position(2, 1));
			deleteWordStartLeft(editor); assert.strictEqual(model.getLineContent(1), '{}');
		});

		withTestCodeEditor([
			'{',
			'}'
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setPosition(new Position(2, 1));
			deleteWordEndLeft(editor); assert.strictEqual(model.getLineContent(1), '{}');
		});
	});

	test('deleteWordRight - issue #832', () => {
		const EXPECTED = '   |/*| Just| some| text| a|+=| 3| +|5|-|3| */|  |';
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1, 1),
			ed => deleteWordRight(ed),
			ed => new Position(1, text.length - ed.getValue().length + 1),
			ed => ed.getValue().length === 0
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('deleteWordRight - issue #3882', () => {
		withTestCodeEditor([
			'public void Add( int x,',
			'                 int y )'
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setPosition(new Position(1, 24));
			deleteWordRight(editor); assert.strictEqual(model.getLineContent(1), 'public void Add( int x,int y )', '001');
		});
	});

	test('deleteWordStartRight - issue #3882', () => {
		withTestCodeEditor([
			'public void Add( int x,',
			'                 int y )'
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setPosition(new Position(1, 24));
			deleteWordStartRight(editor); assert.strictEqual(model.getLineContent(1), 'public void Add( int x,int y )', '001');
		});
	});

	test('deleteWordEndRight - issue #3882', () => {
		withTestCodeEditor([
			'public void Add( int x,',
			'                 int y )'
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setPosition(new Position(1, 24));
			deleteWordEndRight(editor); assert.strictEqual(model.getLineContent(1), 'public void Add( int x,int y )', '001');
		});
	});

	test('deleteWordStartRight', () => {
		const EXPECTED = '   |/* |Just |some |text |a|+= |3 |+|5|-|3 |*/  |';
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1, 1),
			ed => deleteWordStartRight(ed),
			ed => new Position(1, text.length - ed.getValue().length + 1),
			ed => ed.getValue().length === 0
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('deleteWordEndRight', () => {
		const EXPECTED = '   /*| Just| some| text| a|+=| 3| +|5|-|3| */|  |';
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1, 1),
			ed => deleteWordEndRight(ed),
			ed => new Position(1, text.length - ed.getValue().length + 1),
			ed => ed.getValue().length === 0
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('deleteWordRight - issue #3882 (1): Ctrl+Delete removing entire line when used at the end of line', () => {
		withTestCodeEditor([
			'A line with text.',
			'   And another one'
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setPosition(new Position(1, 18));
			deleteWordRight(editor); assert.strictEqual(model.getLineContent(1), 'A line with text.And another one', '001');
		});
	});

	test('deleteWordLeft - issue #3882 (2): Ctrl+Delete removing entire line when used at the end of line', () => {
		withTestCodeEditor([
			'A line with text.',
			'   And another one'
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setPosition(new Position(2, 1));
			deleteWordLeft(editor); assert.strictEqual(model.getLineContent(1), 'A line with text.   And another one', '001');
		});
	});

	test('deleteWordLeft - issue #91855: Matching (quote, bracket, paren) doesn\'t get deleted when hitting Ctrl+Backspace', () => {
		const languageId = 'myTestMode';

		disposables.add(languageService.registerLanguage({ id: languageId }));
		disposables.add(languageConfigurationService.register(languageId, {
			autoClosingPairs: [
				{ open: '\"', close: '\"' }
			]
		}));

		const model = disposables.add(instantiateTextModel(instantiationService, 'a ""', languageId));
		const editor = disposables.add(instantiateTestCodeEditor(instantiationService, model, { autoClosingDelete: 'always' }));

		editor.setPosition(new Position(1, 4));
		deleteWordLeft(editor);
		assert.strictEqual(model.getLineContent(1), 'a ');
	});

	test('deleteInsideWord - empty line', () => {
		withTestCodeEditor([
			'Line1',
			'',
			'Line2'
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setPosition(new Position(2, 1));
			deleteInsideWord(editor);
			assert.strictEqual(model.getValue(), 'Line1\nLine2');
		});
	});

	test('deleteInsideWord - in whitespace 1', () => {
		withTestCodeEditor([
			'Just  some text.'
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setPosition(new Position(1, 6));
			deleteInsideWord(editor);
			assert.strictEqual(model.getValue(), 'Justsome text.');
		});
	});

	test('deleteInsideWord - in whitespace 2', () => {
		withTestCodeEditor([
			'Just     some text.'
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setPosition(new Position(1, 6));
			deleteInsideWord(editor);
			assert.strictEqual(model.getValue(), 'Justsome text.');
		});
	});

	test('deleteInsideWord - in whitespace 3', () => {
		withTestCodeEditor([
			'Just     "some text.'
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setPosition(new Position(1, 6));
			deleteInsideWord(editor);
			assert.strictEqual(model.getValue(), 'Just"some text.');
			deleteInsideWord(editor);
			assert.strictEqual(model.getValue(), '"some text.');
			deleteInsideWord(editor);
			assert.strictEqual(model.getValue(), 'some text.');
			deleteInsideWord(editor);
			assert.strictEqual(model.getValue(), 'text.');
			deleteInsideWord(editor);
			assert.strictEqual(model.getValue(), '.');
			deleteInsideWord(editor);
			assert.strictEqual(model.getValue(), '');
			deleteInsideWord(editor);
			assert.strictEqual(model.getValue(), '');
		});
	});

	test('deleteInsideWord - in non-words', () => {
		withTestCodeEditor([
			'x=3+4+5+6'
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setPosition(new Position(1, 7));
			deleteInsideWord(editor);
			assert.strictEqual(model.getValue(), 'x=3+45+6');
			deleteInsideWord(editor);
			assert.strictEqual(model.getValue(), 'x=3++6');
			deleteInsideWord(editor);
			assert.strictEqual(model.getValue(), 'x=36');
			deleteInsideWord(editor);
			assert.strictEqual(model.getValue(), 'x=');
			deleteInsideWord(editor);
			assert.strictEqual(model.getValue(), 'x');
			deleteInsideWord(editor);
			assert.strictEqual(model.getValue(), '');
			deleteInsideWord(editor);
			assert.strictEqual(model.getValue(), '');
		});
	});

	test('deleteInsideWord - in words 1', () => {
		withTestCodeEditor([
			'This is interesting'
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setPosition(new Position(1, 7));
			deleteInsideWord(editor);
			assert.strictEqual(model.getValue(), 'This interesting');
			deleteInsideWord(editor);
			assert.strictEqual(model.getValue(), 'This');
			deleteInsideWord(editor);
			assert.strictEqual(model.getValue(), '');
			deleteInsideWord(editor);
			assert.strictEqual(model.getValue(), '');
		});
	});

	test('deleteInsideWord - in words 2', () => {
		withTestCodeEditor([
			'This  is  interesting'
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setPosition(new Position(1, 7));
			deleteInsideWord(editor);
			assert.strictEqual(model.getValue(), 'This  interesting');
			deleteInsideWord(editor);
			assert.strictEqual(model.getValue(), 'This');
			deleteInsideWord(editor);
			assert.strictEqual(model.getValue(), '');
			deleteInsideWord(editor);
			assert.strictEqual(model.getValue(), '');
		});
	});

	test('deleteInsideWord - onlyWord: does not delete whitespace before last word', () => {
		withTestCodeEditor([
			'hello world'
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setPosition(new Position(1, 9));
			deleteInsideWord(editor, { onlyWord: true });
			assert.strictEqual(model.getValue(), 'hello ');
		});
	});

	test('deleteInsideWord - onlyWord: deletes just the word (leaves double spaces)', () => {
		withTestCodeEditor([
			'This is interesting'
		], {}, (editor, _) => {
			const model = editor.getModel()!;
			editor.setPosition(new Position(1, 7));
			deleteInsideWord(editor, { onlyWord: true });
			assert.strictEqual(model.getValue(), 'This  interesting');
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/wordOperations/test/browser/wordTestUtils.ts]---
Location: vscode-main/src/vs/editor/contrib/wordOperations/test/browser/wordTestUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Position } from '../../../../common/core/position.js';
import { ITestCodeEditor, TestCodeEditorInstantiationOptions, withTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';

export function deserializePipePositions(text: string): [string, Position[]] {
	let resultText = '';
	let lineNumber = 1;
	let charIndex = 0;
	const positions: Position[] = [];
	for (let i = 0, len = text.length; i < len; i++) {
		const chr = text.charAt(i);
		if (chr === '\n') {
			resultText += chr;
			lineNumber++;
			charIndex = 0;
			continue;
		}
		if (chr === '|') {
			positions.push(new Position(lineNumber, charIndex + 1));
		} else {
			resultText += chr;
			charIndex++;
		}
	}
	return [resultText, positions];
}

export function serializePipePositions(text: string, positions: Position[]): string {
	positions.sort(Position.compare);
	let resultText = '';
	let lineNumber = 1;
	let charIndex = 0;
	for (let i = 0, len = text.length; i < len; i++) {
		const chr = text.charAt(i);
		if (positions.length > 0 && positions[0].lineNumber === lineNumber && positions[0].column === charIndex + 1) {
			resultText += '|';
			positions.shift();
		}
		resultText += chr;
		if (chr === '\n') {
			lineNumber++;
			charIndex = 0;
		} else {
			charIndex++;
		}
	}
	if (positions.length > 0 && positions[0].lineNumber === lineNumber && positions[0].column === charIndex + 1) {
		resultText += '|';
		positions.shift();
	}
	if (positions.length > 0) {
		throw new Error(`Unexpected left over positions!!!`);
	}
	return resultText;
}

export function testRepeatedActionAndExtractPositions(text: string, initialPosition: Position, action: (editor: ITestCodeEditor) => void, record: (editor: ITestCodeEditor) => Position, stopCondition: (editor: ITestCodeEditor) => boolean, options: TestCodeEditorInstantiationOptions = {}): Position[] {
	const actualStops: Position[] = [];
	withTestCodeEditor(text, options, (editor) => {
		editor.setPosition(initialPosition);
		while (true) {
			action(editor);
			actualStops.push(record(editor));
			if (stopCondition(editor)) {
				break;
			}

			if (actualStops.length > 1000) {
				throw new Error(`Endless loop detected involving position ${editor.getPosition()}!`);
			}
		}
	});
	return actualStops;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/wordPartOperations/browser/wordPartOperations.ts]---
Location: vscode-main/src/vs/editor/contrib/wordPartOperations/browser/wordPartOperations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { registerEditorCommand } from '../../../browser/editorExtensions.js';
import { DeleteWordContext, WordNavigationType, WordPartOperations } from '../../../common/cursor/cursorWordOperations.js';
import { WordCharacterClassifier } from '../../../common/core/wordCharacterClassifier.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { ITextModel } from '../../../common/model.js';
import { DeleteWordCommand, MoveWordCommand } from '../../wordOperations/browser/wordOperations.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';

export class DeleteWordPartLeft extends DeleteWordCommand {
	constructor() {
		super({
			whitespaceHeuristics: true,
			wordNavigationType: WordNavigationType.WordStart,
			id: 'deleteWordPartLeft',
			precondition: EditorContextKeys.writable,
			kbOpts: {
				kbExpr: EditorContextKeys.textInputFocus,
				primary: 0,
				mac: { primary: KeyMod.WinCtrl | KeyMod.Alt | KeyCode.Backspace },
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	protected _delete(ctx: DeleteWordContext, wordNavigationType: WordNavigationType): Range {
		const r = WordPartOperations.deleteWordPartLeft(ctx);
		if (r) {
			return r;
		}
		return new Range(1, 1, 1, 1);
	}
}

export class DeleteWordPartRight extends DeleteWordCommand {
	constructor() {
		super({
			whitespaceHeuristics: true,
			wordNavigationType: WordNavigationType.WordEnd,
			id: 'deleteWordPartRight',
			precondition: EditorContextKeys.writable,
			kbOpts: {
				kbExpr: EditorContextKeys.textInputFocus,
				primary: 0,
				mac: { primary: KeyMod.WinCtrl | KeyMod.Alt | KeyCode.Delete },
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	protected _delete(ctx: DeleteWordContext, wordNavigationType: WordNavigationType): Range {
		const r = WordPartOperations.deleteWordPartRight(ctx);
		if (r) {
			return r;
		}
		const lineCount = ctx.model.getLineCount();
		const maxColumn = ctx.model.getLineMaxColumn(lineCount);
		return new Range(lineCount, maxColumn, lineCount, maxColumn);
	}
}

export class WordPartLeftCommand extends MoveWordCommand {
	protected _move(wordSeparators: WordCharacterClassifier, model: ITextModel, position: Position, wordNavigationType: WordNavigationType, hasMulticursor: boolean): Position {
		return WordPartOperations.moveWordPartLeft(wordSeparators, model, position, hasMulticursor);
	}
}
export class CursorWordPartLeft extends WordPartLeftCommand {
	constructor() {
		super({
			inSelectionMode: false,
			wordNavigationType: WordNavigationType.WordStart,
			id: 'cursorWordPartLeft',
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.textInputFocus,
				primary: 0,
				mac: { primary: KeyMod.WinCtrl | KeyMod.Alt | KeyCode.LeftArrow },
				weight: KeybindingWeight.EditorContrib
			}
		});
	}
}
// Register previous id for compatibility purposes
CommandsRegistry.registerCommandAlias('cursorWordPartStartLeft', 'cursorWordPartLeft');

export class CursorWordPartLeftSelect extends WordPartLeftCommand {
	constructor() {
		super({
			inSelectionMode: true,
			wordNavigationType: WordNavigationType.WordStart,
			id: 'cursorWordPartLeftSelect',
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.textInputFocus,
				primary: 0,
				mac: { primary: KeyMod.WinCtrl | KeyMod.Alt | KeyMod.Shift | KeyCode.LeftArrow },
				weight: KeybindingWeight.EditorContrib
			}
		});
	}
}
// Register previous id for compatibility purposes
CommandsRegistry.registerCommandAlias('cursorWordPartStartLeftSelect', 'cursorWordPartLeftSelect');

export class WordPartRightCommand extends MoveWordCommand {
	protected _move(wordSeparators: WordCharacterClassifier, model: ITextModel, position: Position, wordNavigationType: WordNavigationType, hasMulticursor: boolean): Position {
		return WordPartOperations.moveWordPartRight(wordSeparators, model, position);
	}
}
export class CursorWordPartRight extends WordPartRightCommand {
	constructor() {
		super({
			inSelectionMode: false,
			wordNavigationType: WordNavigationType.WordEnd,
			id: 'cursorWordPartRight',
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.textInputFocus,
				primary: 0,
				mac: { primary: KeyMod.WinCtrl | KeyMod.Alt | KeyCode.RightArrow },
				weight: KeybindingWeight.EditorContrib
			}
		});
	}
}
export class CursorWordPartRightSelect extends WordPartRightCommand {
	constructor() {
		super({
			inSelectionMode: true,
			wordNavigationType: WordNavigationType.WordEnd,
			id: 'cursorWordPartRightSelect',
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.textInputFocus,
				primary: 0,
				mac: { primary: KeyMod.WinCtrl | KeyMod.Alt | KeyMod.Shift | KeyCode.RightArrow },
				weight: KeybindingWeight.EditorContrib
			}
		});
	}
}


registerEditorCommand(new DeleteWordPartLeft());
registerEditorCommand(new DeleteWordPartRight());
registerEditorCommand(new CursorWordPartLeft());
registerEditorCommand(new CursorWordPartLeftSelect());
registerEditorCommand(new CursorWordPartRight());
registerEditorCommand(new CursorWordPartRightSelect());
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/wordPartOperations/test/browser/utils.ts]---
Location: vscode-main/src/vs/editor/contrib/wordPartOperations/test/browser/utils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ServiceIdentifier, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';

export class StaticServiceAccessor implements ServicesAccessor {
	private services = new Map<ServiceIdentifier<unknown>, unknown>();

	public withService<T>(id: ServiceIdentifier<T>, service: T): this {
		this.services.set(id, service);
		return this;
	}

	public get<T>(id: ServiceIdentifier<T>): T {
		const value = this.services.get(id);
		if (!value) {
			throw new Error('Service does not exist');
		}
		return value as T;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/wordPartOperations/test/browser/wordPartOperations.test.ts]---
Location: vscode-main/src/vs/editor/contrib/wordPartOperations/test/browser/wordPartOperations.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ICodeEditor } from '../../../../browser/editorBrowser.js';
import { EditorCommand } from '../../../../browser/editorExtensions.js';
import { Position } from '../../../../common/core/position.js';
import { ILanguageConfigurationService } from '../../../../common/languages/languageConfigurationRegistry.js';
import { deserializePipePositions, serializePipePositions, testRepeatedActionAndExtractPositions } from '../../../wordOperations/test/browser/wordTestUtils.js';
import { CursorWordPartLeft, CursorWordPartLeftSelect, CursorWordPartRight, CursorWordPartRightSelect, DeleteWordPartLeft, DeleteWordPartRight } from '../../browser/wordPartOperations.js';
import { StaticServiceAccessor } from './utils.js';
import { TestLanguageConfigurationService } from '../../../../test/common/modes/testLanguageConfigurationService.js';

suite('WordPartOperations', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const _deleteWordPartLeft = new DeleteWordPartLeft();
	const _deleteWordPartRight = new DeleteWordPartRight();
	const _cursorWordPartLeft = new CursorWordPartLeft();
	const _cursorWordPartLeftSelect = new CursorWordPartLeftSelect();
	const _cursorWordPartRight = new CursorWordPartRight();
	const _cursorWordPartRightSelect = new CursorWordPartRightSelect();

	const serviceAccessor = new StaticServiceAccessor().withService(
		ILanguageConfigurationService,
		new TestLanguageConfigurationService()
	);

	function runEditorCommand(editor: ICodeEditor, command: EditorCommand): void {
		command.runEditorCommand(serviceAccessor, editor, null);
	}
	function cursorWordPartLeft(editor: ICodeEditor, inSelectionmode: boolean = false): void {
		runEditorCommand(editor, inSelectionmode ? _cursorWordPartLeftSelect : _cursorWordPartLeft);
	}
	function cursorWordPartRight(editor: ICodeEditor, inSelectionmode: boolean = false): void {
		runEditorCommand(editor, inSelectionmode ? _cursorWordPartRightSelect : _cursorWordPartRight);
	}
	function deleteWordPartLeft(editor: ICodeEditor): void {
		runEditorCommand(editor, _deleteWordPartLeft);
	}
	function deleteWordPartRight(editor: ICodeEditor): void {
		runEditorCommand(editor, _deleteWordPartRight);
	}

	test('cursorWordPartLeft - basic', () => {
		const EXPECTED = [
			'|start| |line|',
			'|this|Is|A|Camel|Case|Var|  |this_|is_|a_|snake_|case_|var| |THIS_|IS_|CAPS_|SNAKE| |this_|IS|Mixed|Use|',
			'|end| |line'
		].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1000, 1000),
			ed => cursorWordPartLeft(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 1))
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('cursorWordPartLeft - issue #53899: whitespace', () => {
		const EXPECTED = '|myvar| |=| |\'|demonstration|     |of| |selection| |with| |space|\'';
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1000, 1000),
			ed => cursorWordPartLeft(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 1))
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('cursorWordPartLeft - issue #53899: underscores', () => {
		const EXPECTED = '|myvar| |=| |\'|demonstration_____|of| |selection| |with| |space|\'';
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1000, 1000),
			ed => cursorWordPartLeft(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 1))
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('cursorWordPartRight - basic', () => {
		const EXPECTED = [
			'start| |line|',
			'|this|Is|A|Camel|Case|Var|  |this|_is|_a|_snake|_case|_var| |THIS|_IS|_CAPS|_SNAKE| |this|_IS|Mixed|Use|',
			'|end| |line|'
		].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1, 1),
			ed => cursorWordPartRight(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(3, 9))
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('cursorWordPartRight - issue #53899: whitespace', () => {
		const EXPECTED = 'myvar| |=| |\'|demonstration|     |of| |selection| |with| |space|\'|';
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1, 1),
			ed => cursorWordPartRight(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 52))
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('cursorWordPartRight - issue #53899: underscores', () => {
		const EXPECTED = 'myvar| |=| |\'|demonstration|_____of| |selection| |with| |space|\'|';
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1, 1),
			ed => cursorWordPartRight(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 52))
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('cursorWordPartRight - issue #53899: second case', () => {
		const EXPECTED = [
			';| |--| |1|',
			'|;|        |--| |2|',
			'|;|    |#|3|',
			'|;|   |#|4|'
		].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1, 1),
			ed => cursorWordPartRight(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(4, 7))
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('issue #93239 - cursorWordPartRight', () => {
		const EXPECTED = [
			'foo|_bar|',
		].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1, 1),
			ed => cursorWordPartRight(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 8))
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('issue #93239 - cursorWordPartLeft', () => {
		const EXPECTED = [
			'|foo_|bar',
		].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1, 8),
			ed => cursorWordPartLeft(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 1))
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('deleteWordPartLeft - basic', () => {
		const EXPECTED = '|   |/*| |Just| |some| |text| |a|+=| |3| |+|5|-|3| |*/|  |this|Is|A|Camel|Case|Var|  |this_|is_|a_|snake_|case_|var| |THIS_|IS_|CAPS_|SNAKE| |this_|IS|Mixed|Use';
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1, 1000),
			ed => deleteWordPartLeft(ed),
			ed => ed.getPosition()!,
			ed => ed.getValue().length === 0
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('deleteWordPartRight - basic', () => {
		const EXPECTED = '   |/*| |Just| |some| |text| |a|+=| |3| |+|5|-|3| |*/|  |this|Is|A|Camel|Case|Var|  |this|_is|_a|_snake|_case|_var| |THIS|_IS|_CAPS|_SNAKE| |this|_IS|Mixed|Use|';
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1, 1),
			ed => deleteWordPartRight(ed),
			ed => new Position(1, text.length - ed.getValue().length + 1),
			ed => ed.getValue().length === 0
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('issue #158667: cursorWordPartLeft stops at "-" even when "-" is not in word separators', () => {
		const EXPECTED = [
			'|this-|is-|a-|kebab-|case-|var| |THIS-|IS-|CAPS-|KEBAB| |this-|IS|Mixed|Use',
		].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1000, 1000),
			ed => cursorWordPartLeft(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 1)),
			{ wordSeparators: '!"#&\'()*+,./:;<=>?@[\\]^`{|}·' } // default characters sans '$-%~' plus '·'
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('issue #158667: cursorWordPartRight stops at "-" even when "-" is not in word separators', () => {
		const EXPECTED = [
			'this|-is|-a|-kebab|-case|-var| |THIS|-IS|-CAPS|-KEBAB| |this|-IS|Mixed|Use|',
		].join('\n');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1, 1),
			ed => cursorWordPartRight(ed),
			ed => ed.getPosition()!,
			ed => ed.getPosition()!.equals(new Position(1, 60)),
			{ wordSeparators: '!"#&\'()*+,./:;<=>?@[\\]^`{|}·' } // default characters sans '$-%~' plus '·'
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('issue #158667: deleteWordPartLeft stops at "-" even when "-" is not in word separators', () => {
		const EXPECTED = [
			'|this-|is-|a-|kebab-|case-|var| |THIS-|IS-|CAPS-|KEBAB| |this-|IS|Mixed|Use',
		].join(' ');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1000, 1000),
			ed => deleteWordPartLeft(ed),
			ed => ed.getPosition()!,
			ed => ed.getValue().length === 0,
			{ wordSeparators: '!"#&\'()*+,./:;<=>?@[\\]^`{|}·' } // default characters sans '$-%~' plus '·'
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});

	test('issue #158667: deleteWordPartRight stops at "-" even when "-" is not in word separators', () => {
		const EXPECTED = [
			'this|-is|-a|-kebab|-case|-var| |THIS|-IS|-CAPS|-KEBAB| |this|-IS|Mixed|Use|',
		].join(' ');
		const [text,] = deserializePipePositions(EXPECTED);
		const actualStops = testRepeatedActionAndExtractPositions(
			text,
			new Position(1, 1),
			ed => deleteWordPartRight(ed),
			ed => new Position(1, text.length - ed.getValue().length + 1),
			ed => ed.getValue().length === 0,
			{ wordSeparators: '!"#&\'()*+,./:;<=>?@[\\]^`{|}·' } // default characters sans '$-%~' plus '·'
		);
		const actual = serializePipePositions(text, actualStops);
		assert.deepStrictEqual(actual, EXPECTED);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/zoneWidget/browser/zoneWidget.css]---
Location: vscode-main/src/vs/editor/contrib/zoneWidget/browser/zoneWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
.monaco-editor .zone-widget {
	position: absolute;
	z-index: 10;
}


.monaco-editor .zone-widget .zone-widget-container {
	border-top-style: solid;
	border-bottom-style: solid;
	border-top-width: 0;
	border-bottom-width: 0;
	position: relative;
}
```

--------------------------------------------------------------------------------

````

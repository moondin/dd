---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 259
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 259 of 552)

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

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-fragmented-eager-diffing/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-fragmented-eager-diffing/advanced.expected.diff.json

```json
{
	"original": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\nimport { IHistoryNavigationWidget } from 'vs/base/browser/history';\nimport { IContextViewProvider } from 'vs/base/browser/ui/contextview/contextview';\nimport { FindInput, IFindInputOptions } from 'vs/base/browser/ui/findinput/findInput';\nimport { IReplaceInputOptions, ReplaceInput } from 'vs/base/browser/ui/findinput/replaceInput';\nimport { HistoryInputBox, IHistoryInputOptions } from 'vs/base/browser/ui/inputbox/inputBox';\nimport { KeyCode, KeyMod } from 'vs/base/common/keyCodes';\nimport { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from 'vs/platform/contextkey/common/contextkey';\nimport { KeybindingsRegistry, KeybindingWeight } from 'vs/platform/keybinding/common/keybindingsRegistry';\nimport { localize } from 'vs/nls';\nimport { DisposableStore, IDisposable, toDisposable } from 'vs/base/common/lifecycle';\n\nexport const historyNavigationVisible = new RawContextKey<boolean>('suggestWidgetVisible', false, localize('suggestWidgetVisible', \"Whether suggestion are visible\"));\n\nconst HistoryNavigationWidgetFocusContext = 'historyNavigationWidgetFocus';\nconst HistoryNavigationForwardsEnablementContext = 'historyNavigationForwardsEnabled';\nconst HistoryNavigationBackwardsEnablementContext = 'historyNavigationBackwardsEnabled';\n\nexport interface IHistoryNavigationContext extends IDisposable {\n\tscopedContextKeyService: IContextKeyService;\n\thistoryNavigationForwardsEnablement: IContextKey<boolean>;\n\thistoryNavigationBackwardsEnablement: IContextKey<boolean>;\n}\n\nlet lastFocusedWidget: IHistoryNavigationWidget | undefined = undefined;\nconst widgets: IHistoryNavigationWidget[] = [];\n\nexport function registerAndCreateHistoryNavigationContext(contextKeyService: IContextKeyService, widget: IHistoryNavigationWidget): IHistoryNavigationContext {\n\tif (widgets.includes(widget)) {\n\t\tthrow new Error('Cannot register the same widget multiple times');\n\t}\n\n\twidgets.push(widget);\n\tconst disposableStore = new DisposableStore();\n\tconst scopedContextKeyService = disposableStore.add(contextKeyService.createScoped(widget.element));\n\tconst historyNavigationWidgetFocus = new RawContextKey<boolean>(HistoryNavigationWidgetFocusContext, false).bindTo(scopedContextKeyService);\n\tconst historyNavigationForwardsEnablement = new RawContextKey<boolean>(HistoryNavigationForwardsEnablementContext, true).bindTo(scopedContextKeyService);\n\tconst historyNavigationBackwardsEnablement = new RawContextKey<boolean>(HistoryNavigationBackwardsEnablementContext, true).bindTo(scopedContextKeyService);\n\n\tconst onDidFocus = () => {\n\t\thistoryNavigationWidgetFocus.set(true);\n\t\tlastFocusedWidget = widget;\n\t};\n\n\tconst onDidBlur = () => {\n\t\thistoryNavigationWidgetFocus.set(false);\n\t\tif (lastFocusedWidget === widget) {\n\t\t\tlastFocusedWidget = undefined;\n\t\t}\n\t};\n\n\t// Check for currently being focused\n\tif (widget.element === document.activeElement) {\n\t\tonDidFocus();\n\t}\n\n\tdisposableStore.add(widget.onDidFocus(() => onDidFocus()));\n\tdisposableStore.add(widget.onDidBlur(() => onDidBlur()));\n\tdisposableStore.add(toDisposable(() => {\n\t\twidgets.splice(widgets.indexOf(widget), 1);\n\t\tonDidBlur();\n\t}));\n\n\treturn {\n\t\tscopedContextKeyService,\n\t\thistoryNavigationForwardsEnablement,\n\t\thistoryNavigationBackwardsEnablement,\n\t\tdispose() {\n\t\t\tdisposableStore.dispose();\n\t\t}\n\t};\n}\n\nexport class ContextScopedHistoryInputBox extends HistoryInputBox {\n\n\tconstructor(container: HTMLElement, contextViewProvider: IContextViewProvider | undefined, options: IHistoryInputOptions,\n\t\t@IContextKeyService contextKeyService: IContextKeyService\n\t) {\n\t\tsuper(container, contextViewProvider, options);\n\t\tthis._register(registerAndCreateHistoryNavigationContext(contextKeyService, this));\n\t}\n\n}\n\nexport class ContextScopedFindInput extends FindInput {\n\n\tconstructor(container: HTMLElement | null, contextViewProvider: IContextViewProvider, options: IFindInputOptions,\n\t\t@IContextKeyService contextKeyService: IContextKeyService\n\t) {\n\t\tsuper(container, contextViewProvider, options);\n\t\tthis._register(registerAndCreateHistoryNavigationContext(contextKeyService, this.inputBox));\n\t}\n}\n\nexport class ContextScopedReplaceInput extends ReplaceInput {\n\n\tconstructor(container: HTMLElement | null, contextViewProvider: IContextViewProvider | undefined, options: IReplaceInputOptions,\n\t\t@IContextKeyService contextKeyService: IContextKeyService, showReplaceOptions: boolean = false\n\t) {\n\t\tsuper(container, contextViewProvider, showReplaceOptions, options);\n\t\tthis._register(registerAndCreateHistoryNavigationContext(contextKeyService, this.inputBox));\n\t}\n\n}\n\nKeybindingsRegistry.registerCommandAndKeybindingRule({\n\tid: 'history.showPrevious',\n\tweight: KeybindingWeight.WorkbenchContrib,\n\twhen: ContextKeyExpr.and(\n\t\tContextKeyExpr.has(HistoryNavigationWidgetFocusContext),\n\t\tContextKeyExpr.equals(HistoryNavigationBackwardsEnablementContext, true),\n\t\thistoryNavigationVisible.isEqualTo(false),\n\t),\n\tprimary: KeyCode.UpArrow,\n\tsecondary: [KeyMod.Alt | KeyCode.UpArrow],\n\thandler: (accessor) => {\n\t\tlastFocusedWidget?.showPreviousValue();\n\t}\n});\n\nKeybindingsRegistry.registerCommandAndKeybindingRule({\n\tid: 'history.showNext',\n\tweight: KeybindingWeight.WorkbenchContrib,\n\twhen: ContextKeyExpr.and(\n\t\tContextKeyExpr.has(HistoryNavigationWidgetFocusContext),\n\t\tContextKeyExpr.equals(HistoryNavigationForwardsEnablementContext, true),\n\t\thistoryNavigationVisible.isEqualTo(false),\n\t),\n\tprimary: KeyCode.DownArrow,\n\tsecondary: [KeyMod.Alt | KeyCode.DownArrow],\n\thandler: (accessor) => {\n\t\tlastFocusedWidget?.showNextValue();\n\t}\n});\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\nimport { IHistoryNavigationWidget } from 'vs/base/browser/history';\nimport { IContextViewProvider } from 'vs/base/browser/ui/contextview/contextview';\nimport { FindInput, IFindInputOptions } from 'vs/base/browser/ui/findinput/findInput';\nimport { IReplaceInputOptions, ReplaceInput } from 'vs/base/browser/ui/findinput/replaceInput';\nimport { HistoryInputBox, IHistoryInputOptions } from 'vs/base/browser/ui/inputbox/inputBox';\nimport { KeyCode, KeyMod } from 'vs/base/common/keyCodes';\nimport { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from 'vs/platform/contextkey/common/contextkey';\nimport { KeybindingsRegistry, KeybindingWeight } from 'vs/platform/keybinding/common/keybindingsRegistry';\nimport { localize } from 'vs/nls';\nimport { DisposableStore, IDisposable, toDisposable } from 'vs/base/common/lifecycle';\n\nexport const historyNavigationVisible = new RawContextKey<boolean>('suggestWidgetVisible', false, localize('suggestWidgetVisible', \"Whether suggestion are visible\"));\n\nconst HistoryNavigationWidgetFocusContext = 'historyNavigationWidgetFocus';\nconst HistoryNavigationForwardsEnablementContext = 'historyNavigationForwardsEnabled';\nconst HistoryNavigationBackwardsEnablementContext = 'historyNavigationBackwardsEnabled';\n\nexport interface IHistoryNavigationContext extends IDisposable {\n\thistoryNavigationForwardsEnablement: IContextKey<boolean>;\n\thistoryNavigationBackwardsEnablement: IContextKey<boolean>;\n}\n\nlet lastFocusedWidget: IHistoryNavigationWidget | undefined = undefined;\nconst widgets: IHistoryNavigationWidget[] = [];\n\nexport function registerAndCreateHistoryNavigationContext(scopedContextKeyService: IContextKeyService, widget: IHistoryNavigationWidget): IHistoryNavigationContext {\n\tif (widgets.includes(widget)) {\n\t\tthrow new Error('Cannot register the same widget multiple times');\n\t}\n\n\twidgets.push(widget);\n\tconst disposableStore = new DisposableStore();\n\tconst historyNavigationWidgetFocus = new RawContextKey<boolean>(HistoryNavigationWidgetFocusContext, false).bindTo(scopedContextKeyService);\n\tconst historyNavigationForwardsEnablement = new RawContextKey<boolean>(HistoryNavigationForwardsEnablementContext, true).bindTo(scopedContextKeyService);\n\tconst historyNavigationBackwardsEnablement = new RawContextKey<boolean>(HistoryNavigationBackwardsEnablementContext, true).bindTo(scopedContextKeyService);\n\n\tconst onDidFocus = () => {\n\t\thistoryNavigationWidgetFocus.set(true);\n\t\tlastFocusedWidget = widget;\n\t};\n\n\tconst onDidBlur = () => {\n\t\thistoryNavigationWidgetFocus.set(false);\n\t\tif (lastFocusedWidget === widget) {\n\t\t\tlastFocusedWidget = undefined;\n\t\t}\n\t};\n\n\t// Check for currently being focused\n\tif (widget.element === document.activeElement) {\n\t\tonDidFocus();\n\t}\n\n\tdisposableStore.add(widget.onDidFocus(() => onDidFocus()));\n\tdisposableStore.add(widget.onDidBlur(() => onDidBlur()));\n\tdisposableStore.add(toDisposable(() => {\n\t\twidgets.splice(widgets.indexOf(widget), 1);\n\t\tonDidBlur();\n\t}));\n\n\treturn {\n\t\thistoryNavigationForwardsEnablement,\n\t\thistoryNavigationBackwardsEnablement,\n\t\tdispose() {\n\t\t\tdisposableStore.dispose();\n\t\t}\n\t};\n}\n\nexport class ContextScopedHistoryInputBox extends HistoryInputBox {\n\n\tconstructor(container: HTMLElement, contextViewProvider: IContextViewProvider | undefined, options: IHistoryInputOptions,\n\t\t@IContextKeyService contextKeyService: IContextKeyService\n\t) {\n\t\tsuper(container, contextViewProvider, options);\n\t\tconst scopedContextKeyService = this._register(contextKeyService.createScoped(this.element));\n\t\tthis._register(registerAndCreateHistoryNavigationContext(scopedContextKeyService, this));\n\t}\n\n}\n\nexport class ContextScopedFindInput extends FindInput {\n\n\tconstructor(container: HTMLElement | null, contextViewProvider: IContextViewProvider, options: IFindInputOptions,\n\t\t@IContextKeyService contextKeyService: IContextKeyService\n\t) {\n\t\tsuper(container, contextViewProvider, options);\n\t\tconst scopedContextKeyService = this._register(contextKeyService.createScoped(this.inputBox.element));\n\t\tthis._register(registerAndCreateHistoryNavigationContext(scopedContextKeyService, this.inputBox));\n\t}\n}\n\nexport class ContextScopedReplaceInput extends ReplaceInput {\n\n\tconstructor(container: HTMLElement | null, contextViewProvider: IContextViewProvider | undefined, options: IReplaceInputOptions,\n\t\t@IContextKeyService contextKeyService: IContextKeyService, showReplaceOptions: boolean = false\n\t) {\n\t\tsuper(container, contextViewProvider, showReplaceOptions, options);\n\t\tconst scopedContextKeyService = this._register(contextKeyService.createScoped(this.inputBox.element));\n\t\tthis._register(registerAndCreateHistoryNavigationContext(scopedContextKeyService, this.inputBox));\n\t}\n\n}\n\nKeybindingsRegistry.registerCommandAndKeybindingRule({\n\tid: 'history.showPrevious',\n\tweight: KeybindingWeight.WorkbenchContrib,\n\twhen: ContextKeyExpr.and(\n\t\tContextKeyExpr.has(HistoryNavigationWidgetFocusContext),\n\t\tContextKeyExpr.equals(HistoryNavigationBackwardsEnablementContext, true),\n\t\thistoryNavigationVisible.isEqualTo(false),\n\t),\n\tprimary: KeyCode.UpArrow,\n\tsecondary: [KeyMod.Alt | KeyCode.UpArrow],\n\thandler: (accessor) => {\n\t\tlastFocusedWidget?.showPreviousValue();\n\t}\n});\n\nKeybindingsRegistry.registerCommandAndKeybindingRule({\n\tid: 'history.showNext',\n\tweight: KeybindingWeight.WorkbenchContrib,\n\twhen: ContextKeyExpr.and(\n\t\tContextKeyExpr.has(HistoryNavigationWidgetFocusContext),\n\t\tContextKeyExpr.equals(HistoryNavigationForwardsEnablementContext, true),\n\t\thistoryNavigationVisible.isEqualTo(false),\n\t),\n\tprimary: KeyCode.DownArrow,\n\tsecondary: [KeyMod.Alt | KeyCode.DownArrow],\n\thandler: (accessor) => {\n\t\tlastFocusedWidget?.showNextValue();\n\t}\n});\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[24,25)",
			"modifiedRange": "[24,24)",
			"innerChanges": [
				{
					"originalRange": "[24,1 -> 25,1]",
					"modifiedRange": "[24,1 -> 24,1]"
				}
			]
		},
		{
			"originalRange": "[32,33)",
			"modifiedRange": "[31,32)",
			"innerChanges": [
				{
					"originalRange": "[32,59 -> 32,60]",
					"modifiedRange": "[31,59 -> 31,66]"
				}
			]
		},
		{
			"originalRange": "[39,40)",
			"modifiedRange": "[38,38)",
			"innerChanges": [
				{
					"originalRange": "[39,1 -> 40,1]",
					"modifiedRange": "[38,1 -> 38,1]"
				}
			]
		},
		{
			"originalRange": "[69,70)",
			"modifiedRange": "[67,67)",
			"innerChanges": [
				{
					"originalRange": "[69,1 -> 70,1]",
					"modifiedRange": "[67,1 -> 67,1]"
				}
			]
		},
		{
			"originalRange": "[84,85)",
			"modifiedRange": "[81,83)",
			"innerChanges": [
				{
					"originalRange": "[84,1 -> 84,1]",
					"modifiedRange": "[81,1 -> 82,1]"
				},
				{
					"originalRange": "[84,60 -> 84,61]",
					"modifiedRange": "[82,60 -> 82,67]"
				}
			]
		},
		{
			"originalRange": "[95,96)",
			"modifiedRange": "[93,95)",
			"innerChanges": [
				{
					"originalRange": "[95,1 -> 95,1]",
					"modifiedRange": "[93,1 -> 94,1]"
				},
				{
					"originalRange": "[95,60 -> 95,61]",
					"modifiedRange": "[94,60 -> 94,67]"
				}
			]
		},
		{
			"originalRange": "[105,106)",
			"modifiedRange": "[104,106)",
			"innerChanges": [
				{
					"originalRange": "[105,1 -> 105,1]",
					"modifiedRange": "[104,1 -> 105,1]"
				},
				{
					"originalRange": "[105,60 -> 105,61]",
					"modifiedRange": "[105,60 -> 105,67]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-fragmented-eager-diffing/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-fragmented-eager-diffing/legacy.expected.diff.json

```json
{
	"original": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\nimport { IHistoryNavigationWidget } from 'vs/base/browser/history';\nimport { IContextViewProvider } from 'vs/base/browser/ui/contextview/contextview';\nimport { FindInput, IFindInputOptions } from 'vs/base/browser/ui/findinput/findInput';\nimport { IReplaceInputOptions, ReplaceInput } from 'vs/base/browser/ui/findinput/replaceInput';\nimport { HistoryInputBox, IHistoryInputOptions } from 'vs/base/browser/ui/inputbox/inputBox';\nimport { KeyCode, KeyMod } from 'vs/base/common/keyCodes';\nimport { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from 'vs/platform/contextkey/common/contextkey';\nimport { KeybindingsRegistry, KeybindingWeight } from 'vs/platform/keybinding/common/keybindingsRegistry';\nimport { localize } from 'vs/nls';\nimport { DisposableStore, IDisposable, toDisposable } from 'vs/base/common/lifecycle';\n\nexport const historyNavigationVisible = new RawContextKey<boolean>('suggestWidgetVisible', false, localize('suggestWidgetVisible', \"Whether suggestion are visible\"));\n\nconst HistoryNavigationWidgetFocusContext = 'historyNavigationWidgetFocus';\nconst HistoryNavigationForwardsEnablementContext = 'historyNavigationForwardsEnabled';\nconst HistoryNavigationBackwardsEnablementContext = 'historyNavigationBackwardsEnabled';\n\nexport interface IHistoryNavigationContext extends IDisposable {\n\tscopedContextKeyService: IContextKeyService;\n\thistoryNavigationForwardsEnablement: IContextKey<boolean>;\n\thistoryNavigationBackwardsEnablement: IContextKey<boolean>;\n}\n\nlet lastFocusedWidget: IHistoryNavigationWidget | undefined = undefined;\nconst widgets: IHistoryNavigationWidget[] = [];\n\nexport function registerAndCreateHistoryNavigationContext(contextKeyService: IContextKeyService, widget: IHistoryNavigationWidget): IHistoryNavigationContext {\n\tif (widgets.includes(widget)) {\n\t\tthrow new Error('Cannot register the same widget multiple times');\n\t}\n\n\twidgets.push(widget);\n\tconst disposableStore = new DisposableStore();\n\tconst scopedContextKeyService = disposableStore.add(contextKeyService.createScoped(widget.element));\n\tconst historyNavigationWidgetFocus = new RawContextKey<boolean>(HistoryNavigationWidgetFocusContext, false).bindTo(scopedContextKeyService);\n\tconst historyNavigationForwardsEnablement = new RawContextKey<boolean>(HistoryNavigationForwardsEnablementContext, true).bindTo(scopedContextKeyService);\n\tconst historyNavigationBackwardsEnablement = new RawContextKey<boolean>(HistoryNavigationBackwardsEnablementContext, true).bindTo(scopedContextKeyService);\n\n\tconst onDidFocus = () => {\n\t\thistoryNavigationWidgetFocus.set(true);\n\t\tlastFocusedWidget = widget;\n\t};\n\n\tconst onDidBlur = () => {\n\t\thistoryNavigationWidgetFocus.set(false);\n\t\tif (lastFocusedWidget === widget) {\n\t\t\tlastFocusedWidget = undefined;\n\t\t}\n\t};\n\n\t// Check for currently being focused\n\tif (widget.element === document.activeElement) {\n\t\tonDidFocus();\n\t}\n\n\tdisposableStore.add(widget.onDidFocus(() => onDidFocus()));\n\tdisposableStore.add(widget.onDidBlur(() => onDidBlur()));\n\tdisposableStore.add(toDisposable(() => {\n\t\twidgets.splice(widgets.indexOf(widget), 1);\n\t\tonDidBlur();\n\t}));\n\n\treturn {\n\t\tscopedContextKeyService,\n\t\thistoryNavigationForwardsEnablement,\n\t\thistoryNavigationBackwardsEnablement,\n\t\tdispose() {\n\t\t\tdisposableStore.dispose();\n\t\t}\n\t};\n}\n\nexport class ContextScopedHistoryInputBox extends HistoryInputBox {\n\n\tconstructor(container: HTMLElement, contextViewProvider: IContextViewProvider | undefined, options: IHistoryInputOptions,\n\t\t@IContextKeyService contextKeyService: IContextKeyService\n\t) {\n\t\tsuper(container, contextViewProvider, options);\n\t\tthis._register(registerAndCreateHistoryNavigationContext(contextKeyService, this));\n\t}\n\n}\n\nexport class ContextScopedFindInput extends FindInput {\n\n\tconstructor(container: HTMLElement | null, contextViewProvider: IContextViewProvider, options: IFindInputOptions,\n\t\t@IContextKeyService contextKeyService: IContextKeyService\n\t) {\n\t\tsuper(container, contextViewProvider, options);\n\t\tthis._register(registerAndCreateHistoryNavigationContext(contextKeyService, this.inputBox));\n\t}\n}\n\nexport class ContextScopedReplaceInput extends ReplaceInput {\n\n\tconstructor(container: HTMLElement | null, contextViewProvider: IContextViewProvider | undefined, options: IReplaceInputOptions,\n\t\t@IContextKeyService contextKeyService: IContextKeyService, showReplaceOptions: boolean = false\n\t) {\n\t\tsuper(container, contextViewProvider, showReplaceOptions, options);\n\t\tthis._register(registerAndCreateHistoryNavigationContext(contextKeyService, this.inputBox));\n\t}\n\n}\n\nKeybindingsRegistry.registerCommandAndKeybindingRule({\n\tid: 'history.showPrevious',\n\tweight: KeybindingWeight.WorkbenchContrib,\n\twhen: ContextKeyExpr.and(\n\t\tContextKeyExpr.has(HistoryNavigationWidgetFocusContext),\n\t\tContextKeyExpr.equals(HistoryNavigationBackwardsEnablementContext, true),\n\t\thistoryNavigationVisible.isEqualTo(false),\n\t),\n\tprimary: KeyCode.UpArrow,\n\tsecondary: [KeyMod.Alt | KeyCode.UpArrow],\n\thandler: (accessor) => {\n\t\tlastFocusedWidget?.showPreviousValue();\n\t}\n});\n\nKeybindingsRegistry.registerCommandAndKeybindingRule({\n\tid: 'history.showNext',\n\tweight: KeybindingWeight.WorkbenchContrib,\n\twhen: ContextKeyExpr.and(\n\t\tContextKeyExpr.has(HistoryNavigationWidgetFocusContext),\n\t\tContextKeyExpr.equals(HistoryNavigationForwardsEnablementContext, true),\n\t\thistoryNavigationVisible.isEqualTo(false),\n\t),\n\tprimary: KeyCode.DownArrow,\n\tsecondary: [KeyMod.Alt | KeyCode.DownArrow],\n\thandler: (accessor) => {\n\t\tlastFocusedWidget?.showNextValue();\n\t}\n});\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\nimport { IHistoryNavigationWidget } from 'vs/base/browser/history';\nimport { IContextViewProvider } from 'vs/base/browser/ui/contextview/contextview';\nimport { FindInput, IFindInputOptions } from 'vs/base/browser/ui/findinput/findInput';\nimport { IReplaceInputOptions, ReplaceInput } from 'vs/base/browser/ui/findinput/replaceInput';\nimport { HistoryInputBox, IHistoryInputOptions } from 'vs/base/browser/ui/inputbox/inputBox';\nimport { KeyCode, KeyMod } from 'vs/base/common/keyCodes';\nimport { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from 'vs/platform/contextkey/common/contextkey';\nimport { KeybindingsRegistry, KeybindingWeight } from 'vs/platform/keybinding/common/keybindingsRegistry';\nimport { localize } from 'vs/nls';\nimport { DisposableStore, IDisposable, toDisposable } from 'vs/base/common/lifecycle';\n\nexport const historyNavigationVisible = new RawContextKey<boolean>('suggestWidgetVisible', false, localize('suggestWidgetVisible', \"Whether suggestion are visible\"));\n\nconst HistoryNavigationWidgetFocusContext = 'historyNavigationWidgetFocus';\nconst HistoryNavigationForwardsEnablementContext = 'historyNavigationForwardsEnabled';\nconst HistoryNavigationBackwardsEnablementContext = 'historyNavigationBackwardsEnabled';\n\nexport interface IHistoryNavigationContext extends IDisposable {\n\thistoryNavigationForwardsEnablement: IContextKey<boolean>;\n\thistoryNavigationBackwardsEnablement: IContextKey<boolean>;\n}\n\nlet lastFocusedWidget: IHistoryNavigationWidget | undefined = undefined;\nconst widgets: IHistoryNavigationWidget[] = [];\n\nexport function registerAndCreateHistoryNavigationContext(scopedContextKeyService: IContextKeyService, widget: IHistoryNavigationWidget): IHistoryNavigationContext {\n\tif (widgets.includes(widget)) {\n\t\tthrow new Error('Cannot register the same widget multiple times');\n\t}\n\n\twidgets.push(widget);\n\tconst disposableStore = new DisposableStore();\n\tconst historyNavigationWidgetFocus = new RawContextKey<boolean>(HistoryNavigationWidgetFocusContext, false).bindTo(scopedContextKeyService);\n\tconst historyNavigationForwardsEnablement = new RawContextKey<boolean>(HistoryNavigationForwardsEnablementContext, true).bindTo(scopedContextKeyService);\n\tconst historyNavigationBackwardsEnablement = new RawContextKey<boolean>(HistoryNavigationBackwardsEnablementContext, true).bindTo(scopedContextKeyService);\n\n\tconst onDidFocus = () => {\n\t\thistoryNavigationWidgetFocus.set(true);\n\t\tlastFocusedWidget = widget;\n\t};\n\n\tconst onDidBlur = () => {\n\t\thistoryNavigationWidgetFocus.set(false);\n\t\tif (lastFocusedWidget === widget) {\n\t\t\tlastFocusedWidget = undefined;\n\t\t}\n\t};\n\n\t// Check for currently being focused\n\tif (widget.element === document.activeElement) {\n\t\tonDidFocus();\n\t}\n\n\tdisposableStore.add(widget.onDidFocus(() => onDidFocus()));\n\tdisposableStore.add(widget.onDidBlur(() => onDidBlur()));\n\tdisposableStore.add(toDisposable(() => {\n\t\twidgets.splice(widgets.indexOf(widget), 1);\n\t\tonDidBlur();\n\t}));\n\n\treturn {\n\t\thistoryNavigationForwardsEnablement,\n\t\thistoryNavigationBackwardsEnablement,\n\t\tdispose() {\n\t\t\tdisposableStore.dispose();\n\t\t}\n\t};\n}\n\nexport class ContextScopedHistoryInputBox extends HistoryInputBox {\n\n\tconstructor(container: HTMLElement, contextViewProvider: IContextViewProvider | undefined, options: IHistoryInputOptions,\n\t\t@IContextKeyService contextKeyService: IContextKeyService\n\t) {\n\t\tsuper(container, contextViewProvider, options);\n\t\tconst scopedContextKeyService = this._register(contextKeyService.createScoped(this.element));\n\t\tthis._register(registerAndCreateHistoryNavigationContext(scopedContextKeyService, this));\n\t}\n\n}\n\nexport class ContextScopedFindInput extends FindInput {\n\n\tconstructor(container: HTMLElement | null, contextViewProvider: IContextViewProvider, options: IFindInputOptions,\n\t\t@IContextKeyService contextKeyService: IContextKeyService\n\t) {\n\t\tsuper(container, contextViewProvider, options);\n\t\tconst scopedContextKeyService = this._register(contextKeyService.createScoped(this.inputBox.element));\n\t\tthis._register(registerAndCreateHistoryNavigationContext(scopedContextKeyService, this.inputBox));\n\t}\n}\n\nexport class ContextScopedReplaceInput extends ReplaceInput {\n\n\tconstructor(container: HTMLElement | null, contextViewProvider: IContextViewProvider | undefined, options: IReplaceInputOptions,\n\t\t@IContextKeyService contextKeyService: IContextKeyService, showReplaceOptions: boolean = false\n\t) {\n\t\tsuper(container, contextViewProvider, showReplaceOptions, options);\n\t\tconst scopedContextKeyService = this._register(contextKeyService.createScoped(this.inputBox.element));\n\t\tthis._register(registerAndCreateHistoryNavigationContext(scopedContextKeyService, this.inputBox));\n\t}\n\n}\n\nKeybindingsRegistry.registerCommandAndKeybindingRule({\n\tid: 'history.showPrevious',\n\tweight: KeybindingWeight.WorkbenchContrib,\n\twhen: ContextKeyExpr.and(\n\t\tContextKeyExpr.has(HistoryNavigationWidgetFocusContext),\n\t\tContextKeyExpr.equals(HistoryNavigationBackwardsEnablementContext, true),\n\t\thistoryNavigationVisible.isEqualTo(false),\n\t),\n\tprimary: KeyCode.UpArrow,\n\tsecondary: [KeyMod.Alt | KeyCode.UpArrow],\n\thandler: (accessor) => {\n\t\tlastFocusedWidget?.showPreviousValue();\n\t}\n});\n\nKeybindingsRegistry.registerCommandAndKeybindingRule({\n\tid: 'history.showNext',\n\tweight: KeybindingWeight.WorkbenchContrib,\n\twhen: ContextKeyExpr.and(\n\t\tContextKeyExpr.has(HistoryNavigationWidgetFocusContext),\n\t\tContextKeyExpr.equals(HistoryNavigationForwardsEnablementContext, true),\n\t\thistoryNavigationVisible.isEqualTo(false),\n\t),\n\tprimary: KeyCode.DownArrow,\n\tsecondary: [KeyMod.Alt | KeyCode.DownArrow],\n\thandler: (accessor) => {\n\t\tlastFocusedWidget?.showNextValue();\n\t}\n});\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[24,25)",
			"modifiedRange": "[24,24)",
			"innerChanges": null
		},
		{
			"originalRange": "[32,33)",
			"modifiedRange": "[31,32)",
			"innerChanges": [
				{
					"originalRange": "[32,59 -> 32,61]",
					"modifiedRange": "[31,59 -> 31,67]"
				}
			]
		},
		{
			"originalRange": "[39,40)",
			"modifiedRange": "[38,38)",
			"innerChanges": null
		},
		{
			"originalRange": "[69,70)",
			"modifiedRange": "[67,67)",
			"innerChanges": null
		},
		{
			"originalRange": "[84,85)",
			"modifiedRange": "[81,83)",
			"innerChanges": [
				{
					"originalRange": "[84,1 -> 84,1]",
					"modifiedRange": "[81,1 -> 82,1]"
				},
				{
					"originalRange": "[84,60 -> 84,62]",
					"modifiedRange": "[82,60 -> 82,68]"
				}
			]
		},
		{
			"originalRange": "[95,96)",
			"modifiedRange": "[93,95)",
			"innerChanges": [
				{
					"originalRange": "[95,1 -> 95,1]",
					"modifiedRange": "[93,1 -> 94,1]"
				},
				{
					"originalRange": "[95,60 -> 95,62]",
					"modifiedRange": "[94,60 -> 94,68]"
				}
			]
		},
		{
			"originalRange": "[105,106)",
			"modifiedRange": "[104,106)",
			"innerChanges": [
				{
					"originalRange": "[105,1 -> 105,1]",
					"modifiedRange": "[104,1 -> 105,1]"
				},
				{
					"originalRange": "[105,60 -> 105,62]",
					"modifiedRange": "[105,60 -> 105,68]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-fragmented-eager-diffing2/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-fragmented-eager-diffing2/1.tst

```text
import { assertIsDefined } from 'vs/base/common/types';
import { IInstantiationService, ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { MenuId, Action2, IAction2Options, IMenuService, SubmenuItemAction } from 'vs/platform/actions/common/actions';
import { createActionViewItem } from 'vs/platform/actions/browser/menuEntryActionViewItem';
import { parseLinkedText } from 'vs/base/common/linkedText';
import { IOpenerService } from 'vs/platform/opener/common/opener';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-fragmented-eager-diffing2/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-fragmented-eager-diffing2/2.tst

```text
import { assertIsDefined } from 'vs/base/common/types';
import { IInstantiationService, ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { MenuId, Action2, IAction2Options, SubmenuItemAction } from 'vs/platform/actions/common/actions';
import { createActionViewItem } from 'vs/platform/actions/browser/menuEntryActionViewItem';
import { parseLinkedText } from 'vs/base/common/linkedText';
import { IOpenerService } from 'vs/platform/opener/common/opener';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-fragmented-eager-diffing2/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-fragmented-eager-diffing2/advanced.expected.diff.json

```json
{
	"original": {
		"content": "import { assertIsDefined } from 'vs/base/common/types';\nimport { IInstantiationService, ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';\nimport { MenuId, Action2, IAction2Options, IMenuService, SubmenuItemAction } from 'vs/platform/actions/common/actions';\nimport { createActionViewItem } from 'vs/platform/actions/browser/menuEntryActionViewItem';\nimport { parseLinkedText } from 'vs/base/common/linkedText';\nimport { IOpenerService } from 'vs/platform/opener/common/opener';",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "import { assertIsDefined } from 'vs/base/common/types';\nimport { IInstantiationService, ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';\nimport { MenuId, Action2, IAction2Options, SubmenuItemAction } from 'vs/platform/actions/common/actions';\nimport { createActionViewItem } from 'vs/platform/actions/browser/menuEntryActionViewItem';\nimport { parseLinkedText } from 'vs/base/common/linkedText';\nimport { IOpenerService } from 'vs/platform/opener/common/opener';",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[3,4)",
			"modifiedRange": "[3,4)",
			"innerChanges": [
				{
					"originalRange": "[3,43 -> 3,57]",
					"modifiedRange": "[3,43 -> 3,43]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-fragmented-eager-diffing2/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-fragmented-eager-diffing2/legacy.expected.diff.json

```json
{
	"original": {
		"content": "import { assertIsDefined } from 'vs/base/common/types';\nimport { IInstantiationService, ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';\nimport { MenuId, Action2, IAction2Options, IMenuService, SubmenuItemAction } from 'vs/platform/actions/common/actions';\nimport { createActionViewItem } from 'vs/platform/actions/browser/menuEntryActionViewItem';\nimport { parseLinkedText } from 'vs/base/common/linkedText';\nimport { IOpenerService } from 'vs/platform/opener/common/opener';",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "import { assertIsDefined } from 'vs/base/common/types';\nimport { IInstantiationService, ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';\nimport { MenuId, Action2, IAction2Options, SubmenuItemAction } from 'vs/platform/actions/common/actions';\nimport { createActionViewItem } from 'vs/platform/actions/browser/menuEntryActionViewItem';\nimport { parseLinkedText } from 'vs/base/common/linkedText';\nimport { IOpenerService } from 'vs/platform/opener/common/opener';",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[3,4)",
			"modifiedRange": "[3,4)",
			"innerChanges": [
				{
					"originalRange": "[3,44 -> 3,58]",
					"modifiedRange": "[3,44 -> 3,44]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-fragmented-eager-diffing3/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-fragmented-eager-diffing3/1.tst

```text
import { assertIsDefined } from 'vs/base/common/types';
import { IInstantiationService, ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { MenuId, Action2, IAction2Options, IMenuServiceFooManager, ServiceManagerLocator } from 'vs/platform/actions/common/actions';
import { createActionViewItem } from 'vs/platform/actions/browser/menuEntryActionViewItem';
import { parseLinkedText } from 'vs/base/common/linkedText';
import { IOpenerService } from 'vs/platform/opener/common/opener';
ISFM,SML,SFMKL

console.log(MenuId, Action2, IAction2Options, IMenuServiceFooManager, ServiceManagerLocator);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-fragmented-eager-diffing3/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-fragmented-eager-diffing3/2.tst

```text
import { assertIsDefined } from 'vs/base/common/types';
import { IInstantiationService, ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { MenuId, Action2, IAction2Options, ServiceManagerLocator } from 'vs/platform/actions/common/actions';
import { createActionViewItem } from 'vs/platform/actions/browser/menuEntryActionViewItem';
import { parseLinkedText } from 'vs/base/common/linkedText';
import { IOpenerService } from 'vs/platform/opener/common/opener';
SML

console.log(MenuId, Action2, IAction2Options, ServiceManagerLocator);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-fragmented-eager-diffing3/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-fragmented-eager-diffing3/advanced.expected.diff.json

```json
{
	"original": {
		"content": "import { assertIsDefined } from 'vs/base/common/types';\nimport { IInstantiationService, ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';\nimport { MenuId, Action2, IAction2Options, IMenuServiceFooManager, ServiceManagerLocator } from 'vs/platform/actions/common/actions';\nimport { createActionViewItem } from 'vs/platform/actions/browser/menuEntryActionViewItem';\nimport { parseLinkedText } from 'vs/base/common/linkedText';\nimport { IOpenerService } from 'vs/platform/opener/common/opener';\nISFM,SML,SFMKL\n\nconsole.log(MenuId, Action2, IAction2Options, IMenuServiceFooManager, ServiceManagerLocator);",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "import { assertIsDefined } from 'vs/base/common/types';\nimport { IInstantiationService, ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';\nimport { MenuId, Action2, IAction2Options, ServiceManagerLocator } from 'vs/platform/actions/common/actions';\nimport { createActionViewItem } from 'vs/platform/actions/browser/menuEntryActionViewItem';\nimport { parseLinkedText } from 'vs/base/common/linkedText';\nimport { IOpenerService } from 'vs/platform/opener/common/opener';\nSML\n\nconsole.log(MenuId, Action2, IAction2Options, ServiceManagerLocator);",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[3,4)",
			"modifiedRange": "[3,4)",
			"innerChanges": [
				{
					"originalRange": "[3,43 -> 3,67]",
					"modifiedRange": "[3,43 -> 3,43]"
				}
			]
		},
		{
			"originalRange": "[7,8)",
			"modifiedRange": "[7,8)",
			"innerChanges": [
				{
					"originalRange": "[7,1 -> 7,6]",
					"modifiedRange": "[7,1 -> 7,1]"
				},
				{
					"originalRange": "[7,9 -> 7,15 EOL]",
					"modifiedRange": "[7,4 -> 7,4 EOL]"
				}
			]
		},
		{
			"originalRange": "[9,10)",
			"modifiedRange": "[9,10)",
			"innerChanges": [
				{
					"originalRange": "[9,46 -> 9,70]",
					"modifiedRange": "[9,46 -> 9,46]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-fragmented-eager-diffing3/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-fragmented-eager-diffing3/legacy.expected.diff.json

```json
{
	"original": {
		"content": "import { assertIsDefined } from 'vs/base/common/types';\nimport { IInstantiationService, ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';\nimport { MenuId, Action2, IAction2Options, IMenuServiceFooManager, ServiceManagerLocator } from 'vs/platform/actions/common/actions';\nimport { createActionViewItem } from 'vs/platform/actions/browser/menuEntryActionViewItem';\nimport { parseLinkedText } from 'vs/base/common/linkedText';\nimport { IOpenerService } from 'vs/platform/opener/common/opener';\nISFM,SML,SFMKL\n\nconsole.log(MenuId, Action2, IAction2Options, IMenuServiceFooManager, ServiceManagerLocator);",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "import { assertIsDefined } from 'vs/base/common/types';\nimport { IInstantiationService, ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';\nimport { MenuId, Action2, IAction2Options, ServiceManagerLocator } from 'vs/platform/actions/common/actions';\nimport { createActionViewItem } from 'vs/platform/actions/browser/menuEntryActionViewItem';\nimport { parseLinkedText } from 'vs/base/common/linkedText';\nimport { IOpenerService } from 'vs/platform/opener/common/opener';\nSML\n\nconsole.log(MenuId, Action2, IAction2Options, ServiceManagerLocator);",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[3,4)",
			"modifiedRange": "[3,4)",
			"innerChanges": [
				{
					"originalRange": "[3,44 -> 3,68]",
					"modifiedRange": "[3,44 -> 3,44]"
				}
			]
		},
		{
			"originalRange": "[7,8)",
			"modifiedRange": "[7,8)",
			"innerChanges": [
				{
					"originalRange": "[7,1 -> 7,6]",
					"modifiedRange": "[7,1 -> 7,1]"
				},
				{
					"originalRange": "[7,9 -> 7,15 EOL]",
					"modifiedRange": "[7,4 -> 7,4 EOL]"
				}
			]
		},
		{
			"originalRange": "[9,10)",
			"modifiedRange": "[9,10)",
			"innerChanges": [
				{
					"originalRange": "[9,47 -> 9,71]",
					"modifiedRange": "[9,47 -> 9,47]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-import-ws-affinity/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-import-ws-affinity/1.tst

```text
import { handledConflictMinimapOverViewRulerColor, unhandledConflictMinimapOverViewRulerColor } from 'vs/workbench/contrib/mergeEditor/browser/view/colors';
import { EditorGutter, IGutterItemInfo, IGutterItemView } from '../editorGutter';
import { CodeEditorView } from './codeEditorView';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-import-ws-affinity/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-import-ws-affinity/2.tst

```text
import { handledConflictMinimapOverViewRulerColor, unhandledConflictMinimapOverViewRulerColor } from 'vs/workbench/contrib/mergeEditor/browser/view/colors';
import { EditorGutter, IGutterItemInfo, IGutterItemView } from '../editorGutter';
import { CodeEditorView, TitleMenu } from './codeEditorView';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-import-ws-affinity/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-import-ws-affinity/advanced.expected.diff.json

```json
{
	"original": {
		"content": "import { handledConflictMinimapOverViewRulerColor, unhandledConflictMinimapOverViewRulerColor } from 'vs/workbench/contrib/mergeEditor/browser/view/colors';\nimport { EditorGutter, IGutterItemInfo, IGutterItemView } from '../editorGutter';\nimport { CodeEditorView } from './codeEditorView';\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "import { handledConflictMinimapOverViewRulerColor, unhandledConflictMinimapOverViewRulerColor } from 'vs/workbench/contrib/mergeEditor/browser/view/colors';\nimport { EditorGutter, IGutterItemInfo, IGutterItemView } from '../editorGutter';\nimport { CodeEditorView, TitleMenu } from './codeEditorView';\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[3,4)",
			"modifiedRange": "[3,4)",
			"innerChanges": [
				{
					"originalRange": "[3,24 -> 3,24]",
					"modifiedRange": "[3,24 -> 3,35]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-import-ws-affinity/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-import-ws-affinity/legacy.expected.diff.json

```json
{
	"original": {
		"content": "import { handledConflictMinimapOverViewRulerColor, unhandledConflictMinimapOverViewRulerColor } from 'vs/workbench/contrib/mergeEditor/browser/view/colors';\nimport { EditorGutter, IGutterItemInfo, IGutterItemView } from '../editorGutter';\nimport { CodeEditorView } from './codeEditorView';\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "import { handledConflictMinimapOverViewRulerColor, unhandledConflictMinimapOverViewRulerColor } from 'vs/workbench/contrib/mergeEditor/browser/view/colors';\nimport { EditorGutter, IGutterItemInfo, IGutterItemView } from '../editorGutter';\nimport { CodeEditorView, TitleMenu } from './codeEditorView';\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[3,4)",
			"modifiedRange": "[3,4)",
			"innerChanges": [
				{
					"originalRange": "[3,24 -> 3,24]",
					"modifiedRange": "[3,24 -> 3,35]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-insert/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-insert/1.tst

```text
const sequence2 = new SequenceFromIntArray(tgtDocLines);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-insert/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-insert/2.tst

```text
const sequence2 = new LineSequence(tgtDocLines, modifiedLines);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-insert/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-insert/advanced.expected.diff.json

```json
{
	"original": {
		"content": "const sequence2 = new SequenceFromIntArray(tgtDocLines);",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "const sequence2 = new LineSequence(tgtDocLines, modifiedLines);",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[1,2)",
			"modifiedRange": "[1,2)",
			"innerChanges": [
				{
					"originalRange": "[1,23 -> 1,43]",
					"modifiedRange": "[1,23 -> 1,35]"
				},
				{
					"originalRange": "[1,55 -> 1,55]",
					"modifiedRange": "[1,47 -> 1,62]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-insert/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-insert/legacy.expected.diff.json

```json
{
	"original": {
		"content": "const sequence2 = new SequenceFromIntArray(tgtDocLines);",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "const sequence2 = new LineSequence(tgtDocLines, modifiedLines);",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[1,2)",
			"modifiedRange": "[1,2)",
			"innerChanges": [
				{
					"originalRange": "[1,23 -> 1,23]",
					"modifiedRange": "[1,23 -> 1,27]"
				},
				{
					"originalRange": "[1,31 -> 1,43]",
					"modifiedRange": "[1,35 -> 1,35]"
				},
				{
					"originalRange": "[1,55 -> 1,55]",
					"modifiedRange": "[1,47 -> 1,62]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-methods/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-methods/1.tst

```text
interface Test {
    getDecorationsInViewport(visibleRange: Range): ViewModelDecoration[];
	getViewLineRenderingData(visibleRange: Range, lineNumber: number): ViewLineRenderingData;
    getViewLineData(lineNumber: number): ViewLineData;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-methods/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-methods/2.tst

```text
interface Test {
    getDecorationsInViewport(visibleRange: Range): ViewModelDecoration[];
    getViewportViewLineRenderingData(visibleRange: Range, lineNumber: number): ViewLineRenderingData;
    getViewLineRenderingData(lineNumber: number): ViewLineRenderingData;
    getViewLineData(lineNumber: number): ViewLineData;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-methods/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-methods/advanced.expected.diff.json

```json
{
	"original": {
		"content": "interface Test {\n    getDecorationsInViewport(visibleRange: Range): ViewModelDecoration[];\n\tgetViewLineRenderingData(visibleRange: Range, lineNumber: number): ViewLineRenderingData;\n    getViewLineData(lineNumber: number): ViewLineData;\n}",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "interface Test {\n    getDecorationsInViewport(visibleRange: Range): ViewModelDecoration[];\n    getViewportViewLineRenderingData(visibleRange: Range, lineNumber: number): ViewLineRenderingData;\n    getViewLineRenderingData(lineNumber: number): ViewLineRenderingData;\n    getViewLineData(lineNumber: number): ViewLineData;\n}",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[3,4)",
			"modifiedRange": "[3,5)",
			"innerChanges": [
				{
					"originalRange": "[3,1 -> 3,2]",
					"modifiedRange": "[3,1 -> 3,5]"
				},
				{
					"originalRange": "[3,5 -> 3,5]",
					"modifiedRange": "[3,8 -> 3,16]"
				},
				{
					"originalRange": "[4,1 -> 4,1]",
					"modifiedRange": "[4,1 -> 5,1]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-methods/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-methods/legacy.expected.diff.json

```json
{
	"original": {
		"content": "interface Test {\n    getDecorationsInViewport(visibleRange: Range): ViewModelDecoration[];\n\tgetViewLineRenderingData(visibleRange: Range, lineNumber: number): ViewLineRenderingData;\n    getViewLineData(lineNumber: number): ViewLineData;\n}",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "interface Test {\n    getDecorationsInViewport(visibleRange: Range): ViewModelDecoration[];\n    getViewportViewLineRenderingData(visibleRange: Range, lineNumber: number): ViewLineRenderingData;\n    getViewLineRenderingData(lineNumber: number): ViewLineRenderingData;\n    getViewLineData(lineNumber: number): ViewLineData;\n}",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[3,4)",
			"modifiedRange": "[3,5)",
			"innerChanges": [
				{
					"originalRange": "[3,1 -> 3,2]",
					"modifiedRange": "[3,1 -> 3,5]"
				},
				{
					"originalRange": "[3,9 -> 3,9]",
					"modifiedRange": "[3,12 -> 3,20]"
				},
				{
					"originalRange": "[3,91 -> 3,91 EOL]",
					"modifiedRange": "[3,102 -> 4,73 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-shift-to-ws/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-shift-to-ws/1.tst

```text
const childEndsAfterEnd = lengthGreaterThanEqual(nodeOffsetEnd, endOffset);
if (childEndsAfterEnd) {
    // No child after this child in the requested window, don't recurse
    node = child;
    level++;
    continue whileLoop;
}

const shouldContinue = collectBrackets(child, nodeOffsetStart, nodeOffsetEnd, startOffset, endOffset, push, level + 1, levelPerBracketType);
if (!shouldContinue) {
    return false;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-shift-to-ws/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-shift-to-ws/2.tst

```text
const childEndsAfterEnd = lengthGreaterThanEqual(nodeOffsetEnd, endOffset);
if (childEndsAfterEnd) {
    // No child after this child in the requested window, don't recurse
    node = child;
    level++;
    continue whileLoop;
}

const shouldContinue = collectBrackets(child, nodeOffsetStart, nodeOffsetEnd, startOffset, endOffset, push, level + 1, levelPerBracket + 1, levelPerBracketType);
if (!shouldContinue) {
    return false;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-shift-to-ws/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-shift-to-ws/advanced.expected.diff.json

```json
{
	"original": {
		"content": "const childEndsAfterEnd = lengthGreaterThanEqual(nodeOffsetEnd, endOffset);\nif (childEndsAfterEnd) {\n    // No child after this child in the requested window, don't recurse\n    node = child;\n    level++;\n    continue whileLoop;\n}\n\nconst shouldContinue = collectBrackets(child, nodeOffsetStart, nodeOffsetEnd, startOffset, endOffset, push, level + 1, levelPerBracketType);\nif (!shouldContinue) {\n    return false;\n}",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "const childEndsAfterEnd = lengthGreaterThanEqual(nodeOffsetEnd, endOffset);\nif (childEndsAfterEnd) {\n    // No child after this child in the requested window, don't recurse\n    node = child;\n    level++;\n    continue whileLoop;\n}\n\nconst shouldContinue = collectBrackets(child, nodeOffsetStart, nodeOffsetEnd, startOffset, endOffset, push, level + 1, levelPerBracket + 1, levelPerBracketType);\nif (!shouldContinue) {\n    return false;\n}",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[9,10)",
			"modifiedRange": "[9,10)",
			"innerChanges": [
				{
					"originalRange": "[9,119 -> 9,119]",
					"modifiedRange": "[9,119 -> 9,140]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-shift-to-ws/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-shift-to-ws/legacy.expected.diff.json

```json
{
	"original": {
		"content": "const childEndsAfterEnd = lengthGreaterThanEqual(nodeOffsetEnd, endOffset);\nif (childEndsAfterEnd) {\n    // No child after this child in the requested window, don't recurse\n    node = child;\n    level++;\n    continue whileLoop;\n}\n\nconst shouldContinue = collectBrackets(child, nodeOffsetStart, nodeOffsetEnd, startOffset, endOffset, push, level + 1, levelPerBracketType);\nif (!shouldContinue) {\n    return false;\n}",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "const childEndsAfterEnd = lengthGreaterThanEqual(nodeOffsetEnd, endOffset);\nif (childEndsAfterEnd) {\n    // No child after this child in the requested window, don't recurse\n    node = child;\n    level++;\n    continue whileLoop;\n}\n\nconst shouldContinue = collectBrackets(child, nodeOffsetStart, nodeOffsetEnd, startOffset, endOffset, push, level + 1, levelPerBracket + 1, levelPerBracketType);\nif (!shouldContinue) {\n    return false;\n}",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[9,10)",
			"modifiedRange": "[9,10)",
			"innerChanges": [
				{
					"originalRange": "[9,135 -> 9,135]",
					"modifiedRange": "[9,135 -> 9,156]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-shifting/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-shifting/1.tst

```text
[
	{
		"identifier": {
			"id": "pflannery.vscode-versionlens",
			"uuid": "07fc4a0a-11fc-4121-ba9a-f0d534c729d8"
		},
		"preRelease": false,
		"version": "1.0.9",
		"installed": true
	},
	{
		"identifier": {
			"id": "sumneko.lua",
			"uuid": "3a15b5a7-be12-47e3-8445-88ee3eabc8b2"
		},
		"preRelease": false,
		"version": "3.5.6",
		"installed": true
	},
	{
		"identifier": {
			"id": "vscode.bat",
			"uuid": "5ef96c58-076f-4167-8e40-62c9deb00496"
		},
		"preRelease": false,
		"version": "1.0.0"
	}
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-shifting/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-shifting/2.tst

```text
[
	{
		"identifier": {
			"id": "pflannery.vscode-versionlens",
			"uuid": "07fc4a0a-11fc-4121-ba9a-f0d534c729d8"
		},
		"preRelease": false,
		"version": "1.0.9",
		"installed": true
	},
	{
		"identifier": {
			"id": "vscode.bat",
			"uuid": "5ef96c58-076f-4167-8e40-62c9deb00496"
		},
		"preRelease": false,
		"version": "1.0.0"
	}
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-shifting/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-shifting/advanced.expected.diff.json

```json
{
	"original": {
		"content": "[\n\t{\n\t\t\"identifier\": {\n\t\t\t\"id\": \"pflannery.vscode-versionlens\",\n\t\t\t\"uuid\": \"07fc4a0a-11fc-4121-ba9a-f0d534c729d8\"\n\t\t},\n\t\t\"preRelease\": false,\n\t\t\"version\": \"1.0.9\",\n\t\t\"installed\": true\n\t},\n\t{\n\t\t\"identifier\": {\n\t\t\t\"id\": \"sumneko.lua\",\n\t\t\t\"uuid\": \"3a15b5a7-be12-47e3-8445-88ee3eabc8b2\"\n\t\t},\n\t\t\"preRelease\": false,\n\t\t\"version\": \"3.5.6\",\n\t\t\"installed\": true\n\t},\n\t{\n\t\t\"identifier\": {\n\t\t\t\"id\": \"vscode.bat\",\n\t\t\t\"uuid\": \"5ef96c58-076f-4167-8e40-62c9deb00496\"\n\t\t},\n\t\t\"preRelease\": false,\n\t\t\"version\": \"1.0.0\"\n\t}\n]",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "[\n\t{\n\t\t\"identifier\": {\n\t\t\t\"id\": \"pflannery.vscode-versionlens\",\n\t\t\t\"uuid\": \"07fc4a0a-11fc-4121-ba9a-f0d534c729d8\"\n\t\t},\n\t\t\"preRelease\": false,\n\t\t\"version\": \"1.0.9\",\n\t\t\"installed\": true\n\t},\n\t{\n\t\t\"identifier\": {\n\t\t\t\"id\": \"vscode.bat\",\n\t\t\t\"uuid\": \"5ef96c58-076f-4167-8e40-62c9deb00496\"\n\t\t},\n\t\t\"preRelease\": false,\n\t\t\"version\": \"1.0.0\"\n\t}\n]",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[11,20)",
			"modifiedRange": "[11,11)",
			"innerChanges": [
				{
					"originalRange": "[11,1 -> 20,1]",
					"modifiedRange": "[11,1 -> 11,1]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-shifting/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-shifting/legacy.expected.diff.json

```json
{
	"original": {
		"content": "[\n\t{\n\t\t\"identifier\": {\n\t\t\t\"id\": \"pflannery.vscode-versionlens\",\n\t\t\t\"uuid\": \"07fc4a0a-11fc-4121-ba9a-f0d534c729d8\"\n\t\t},\n\t\t\"preRelease\": false,\n\t\t\"version\": \"1.0.9\",\n\t\t\"installed\": true\n\t},\n\t{\n\t\t\"identifier\": {\n\t\t\t\"id\": \"sumneko.lua\",\n\t\t\t\"uuid\": \"3a15b5a7-be12-47e3-8445-88ee3eabc8b2\"\n\t\t},\n\t\t\"preRelease\": false,\n\t\t\"version\": \"3.5.6\",\n\t\t\"installed\": true\n\t},\n\t{\n\t\t\"identifier\": {\n\t\t\t\"id\": \"vscode.bat\",\n\t\t\t\"uuid\": \"5ef96c58-076f-4167-8e40-62c9deb00496\"\n\t\t},\n\t\t\"preRelease\": false,\n\t\t\"version\": \"1.0.0\"\n\t}\n]",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "[\n\t{\n\t\t\"identifier\": {\n\t\t\t\"id\": \"pflannery.vscode-versionlens\",\n\t\t\t\"uuid\": \"07fc4a0a-11fc-4121-ba9a-f0d534c729d8\"\n\t\t},\n\t\t\"preRelease\": false,\n\t\t\"version\": \"1.0.9\",\n\t\t\"installed\": true\n\t},\n\t{\n\t\t\"identifier\": {\n\t\t\t\"id\": \"vscode.bat\",\n\t\t\t\"uuid\": \"5ef96c58-076f-4167-8e40-62c9deb00496\"\n\t\t},\n\t\t\"preRelease\": false,\n\t\t\"version\": \"1.0.0\"\n\t}\n]",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[13,22)",
			"modifiedRange": "[13,13)",
			"innerChanges": null
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-strings/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-strings/1.tst

```text
interface Test {
    /**
     * Controls whether the fold actions in the gutter stay always visible or hide unless the mouse is over the gutter.
     * Defaults to 'mouseover'.
     */
    showFoldingControls?: 'always' | 'mouseover';
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-strings/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-strings/2.tst

```text
interface Test {
    /**
     * Controls whether the fold actions in the gutter stay always visible or hide unless the mouse is over the gutter.
     * Defaults to 'mouseover'.
     */
    showFoldingControls?: 'always' | 'never' | 'mouseover';
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-strings/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-strings/advanced.expected.diff.json

```json
{
	"original": {
		"content": "interface Test {\n    /**\n     * Controls whether the fold actions in the gutter stay always visible or hide unless the mouse is over the gutter.\n     * Defaults to 'mouseover'.\n     */\n    showFoldingControls?: 'always' | 'mouseover';\n}\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "interface Test {\n    /**\n     * Controls whether the fold actions in the gutter stay always visible or hide unless the mouse is over the gutter.\n     * Defaults to 'mouseover'.\n     */\n    showFoldingControls?: 'always' | 'never' | 'mouseover';\n}\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[6,7)",
			"modifiedRange": "[6,7)",
			"innerChanges": [
				{
					"originalRange": "[6,35 -> 6,35]",
					"modifiedRange": "[6,35 -> 6,45]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-strings/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-strings/legacy.expected.diff.json

```json
{
	"original": {
		"content": "interface Test {\n    /**\n     * Controls whether the fold actions in the gutter stay always visible or hide unless the mouse is over the gutter.\n     * Defaults to 'mouseover'.\n     */\n    showFoldingControls?: 'always' | 'mouseover';\n}\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "interface Test {\n    /**\n     * Controls whether the fold actions in the gutter stay always visible or hide unless the mouse is over the gutter.\n     * Defaults to 'mouseover'.\n     */\n    showFoldingControls?: 'always' | 'never' | 'mouseover';\n}\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[6,7)",
			"modifiedRange": "[6,7)",
			"innerChanges": [
				{
					"originalRange": "[6,39 -> 6,39]",
					"modifiedRange": "[6,39 -> 6,49]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-too-much-minimization/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-too-much-minimization/1.tst

```text
class Test {
    protected readonly checkboxesVisible = observableFromEvent<boolean>(
        this.configurationService.onDidChangeConfiguration,
        () => /** @description checkboxesVisible */ this.configurationService.getValue('mergeEditor.showCheckboxes') ?? false
    );

    protected readonly showDeletionMarkers = observableFromEvent<boolean>(
        this.configurationService.onDidChangeConfiguration,
        () => /** @description showDeletionMarkers */ this.configurationService.getValue('mergeEditor.showDeletionMarkers')
    );

    public readonly editor = this.instantiationService.createInstance(
        CodeEditorWidget,
        this.htmlElements.editor,
        {},
        {
            contributions: this.getEditorContributions(),
        }
    );
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-too-much-minimization/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-too-much-minimization/2.tst

```text
class Test {
    protected readonly checkboxesVisible = observableFromEvent<boolean>(
        this.configurationService.onDidChangeConfiguration,
        () => /** @description checkboxesVisible */ this.configurationService.getValue('mergeEditor.showCheckboxes') ?? false
    );

    protected readonly showDeletionMarkers = observableFromEvent<boolean>(
        this.configurationService.onDidChangeConfiguration,
        () => /** @description showDeletionMarkers */ this.configurationService.getValue('mergeEditor.showDeletionMarkers') ?? true
    );

    protected readonly useSimplifiedDecorations = observableFromEvent<boolean>(
        this.configurationService.onDidChangeConfiguration,
        () => /** @description useSimplifiedDecorations */ this.configurationService.getValue('mergeEditor.useSimplifiedDecorations') ?? false
    );

    public readonly editor = this.instantiationService.createInstance(
        CodeEditorWidget,
        this.htmlElements.editor,
        {},
        {
            contributions: this.getEditorContributions(),
        }
    );
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-too-much-minimization/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-too-much-minimization/advanced.expected.diff.json

```json
{
	"original": {
		"content": "class Test {\n    protected readonly checkboxesVisible = observableFromEvent<boolean>(\n        this.configurationService.onDidChangeConfiguration,\n        () => /** @description checkboxesVisible */ this.configurationService.getValue('mergeEditor.showCheckboxes') ?? false\n    );\n\n    protected readonly showDeletionMarkers = observableFromEvent<boolean>(\n        this.configurationService.onDidChangeConfiguration,\n        () => /** @description showDeletionMarkers */ this.configurationService.getValue('mergeEditor.showDeletionMarkers')\n    );\n\n    public readonly editor = this.instantiationService.createInstance(\n        CodeEditorWidget,\n        this.htmlElements.editor,\n        {},\n        {\n            contributions: this.getEditorContributions(),\n        }\n    );\n}\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "class Test {\n    protected readonly checkboxesVisible = observableFromEvent<boolean>(\n        this.configurationService.onDidChangeConfiguration,\n        () => /** @description checkboxesVisible */ this.configurationService.getValue('mergeEditor.showCheckboxes') ?? false\n    );\n\n    protected readonly showDeletionMarkers = observableFromEvent<boolean>(\n        this.configurationService.onDidChangeConfiguration,\n        () => /** @description showDeletionMarkers */ this.configurationService.getValue('mergeEditor.showDeletionMarkers') ?? true\n    );\n\n    protected readonly useSimplifiedDecorations = observableFromEvent<boolean>(\n        this.configurationService.onDidChangeConfiguration,\n        () => /** @description useSimplifiedDecorations */ this.configurationService.getValue('mergeEditor.useSimplifiedDecorations') ?? false\n    );\n\n    public readonly editor = this.instantiationService.createInstance(\n        CodeEditorWidget,\n        this.htmlElements.editor,\n        {},\n        {\n            contributions: this.getEditorContributions(),\n        }\n    );\n}\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[9,10)",
			"modifiedRange": "[9,15)",
			"innerChanges": [
				{
					"originalRange": "[9,124 -> 10,1]",
					"modifiedRange": "[9,124 -> 15,1]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-too-much-minimization/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-too-much-minimization/legacy.expected.diff.json

```json
{
	"original": {
		"content": "class Test {\n    protected readonly checkboxesVisible = observableFromEvent<boolean>(\n        this.configurationService.onDidChangeConfiguration,\n        () => /** @description checkboxesVisible */ this.configurationService.getValue('mergeEditor.showCheckboxes') ?? false\n    );\n\n    protected readonly showDeletionMarkers = observableFromEvent<boolean>(\n        this.configurationService.onDidChangeConfiguration,\n        () => /** @description showDeletionMarkers */ this.configurationService.getValue('mergeEditor.showDeletionMarkers')\n    );\n\n    public readonly editor = this.instantiationService.createInstance(\n        CodeEditorWidget,\n        this.htmlElements.editor,\n        {},\n        {\n            contributions: this.getEditorContributions(),\n        }\n    );\n}\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "class Test {\n    protected readonly checkboxesVisible = observableFromEvent<boolean>(\n        this.configurationService.onDidChangeConfiguration,\n        () => /** @description checkboxesVisible */ this.configurationService.getValue('mergeEditor.showCheckboxes') ?? false\n    );\n\n    protected readonly showDeletionMarkers = observableFromEvent<boolean>(\n        this.configurationService.onDidChangeConfiguration,\n        () => /** @description showDeletionMarkers */ this.configurationService.getValue('mergeEditor.showDeletionMarkers') ?? true\n    );\n\n    protected readonly useSimplifiedDecorations = observableFromEvent<boolean>(\n        this.configurationService.onDidChangeConfiguration,\n        () => /** @description useSimplifiedDecorations */ this.configurationService.getValue('mergeEditor.useSimplifiedDecorations') ?? false\n    );\n\n    public readonly editor = this.instantiationService.createInstance(\n        CodeEditorWidget,\n        this.htmlElements.editor,\n        {},\n        {\n            contributions: this.getEditorContributions(),\n        }\n    );\n}\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[9,10)",
			"modifiedRange": "[9,15)",
			"innerChanges": [
				{
					"originalRange": "[9,124 -> 9,124 EOL]",
					"modifiedRange": "[9,124 -> 14,143 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-unfragmented-diffing/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-unfragmented-diffing/1.tst

```text
import { KeyCode, KeyMod } from 'vs/base/common/keyCodes';
import { Disposable } from 'vs/base/common/lifecycle';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { EditorAction, EditorCommand, registerEditorAction, registerEditorCommand, registerEditorContribution, ServicesAccessor } from 'vs/editor/browser/editorExtensions';
import { IEditorContribution } from 'vs/editor/common/editorCommon';
import { EditorContextKeys } from 'vs/editor/common/editorContextKeys';
import * as languages from 'vs/editor/common/languages';
import { TriggerContext } from 'vs/editor/contrib/parameterHints/browser/parameterHintsModel';
import { Context } from 'vs/editor/contrib/parameterHints/browser/provideSignatureHelp';
import * as nls from 'vs/nls';
import { ContextKeyExpr } from 'vs/platform/contextkey/common/contextkey';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { KeybindingWeight } from 'vs/platform/keybinding/common/keybindingsRegistry';
import { ParameterHintsWidget } from './parameterHintsWidget';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-unfragmented-diffing/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-unfragmented-diffing/2.tst

```text
import { KeyCode, KeyMod } from 'vs/base/common/keyCodes';
import { Lazy } from 'vs/base/common/lazy';
import { Disposable } from 'vs/base/common/lifecycle';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { EditorAction, EditorCommand, registerEditorAction, registerEditorCommand, registerEditorContribution, ServicesAccessor } from 'vs/editor/browser/editorExtensions';
import { IEditorContribution } from 'vs/editor/common/editorCommon';
import { EditorContextKeys } from 'vs/editor/common/editorContextKeys';
import * as languages from 'vs/editor/common/languages';
import { ILanguageFeaturesService } from 'vs/editor/common/services/languageFeatures';
import { ParameterHintsModel, TriggerContext } from 'vs/editor/contrib/parameterHints/browser/parameterHintsModel';
import { Context } from 'vs/editor/contrib/parameterHints/browser/provideSignatureHelp';
import * as nls from 'vs/nls';
import { ContextKeyExpr } from 'vs/platform/contextkey/common/contextkey';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { KeybindingWeight } from 'vs/platform/keybinding/common/keybindingsRegistry';
import { ParameterHintsWidget } from './parameterHintsWidget';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-unfragmented-diffing/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-unfragmented-diffing/advanced.expected.diff.json

```json
{
	"original": {
		"content": "import { KeyCode, KeyMod } from 'vs/base/common/keyCodes';\nimport { Disposable } from 'vs/base/common/lifecycle';\nimport { ICodeEditor } from 'vs/editor/browser/editorBrowser';\nimport { EditorAction, EditorCommand, registerEditorAction, registerEditorCommand, registerEditorContribution, ServicesAccessor } from 'vs/editor/browser/editorExtensions';\nimport { IEditorContribution } from 'vs/editor/common/editorCommon';\nimport { EditorContextKeys } from 'vs/editor/common/editorContextKeys';\nimport * as languages from 'vs/editor/common/languages';\nimport { TriggerContext } from 'vs/editor/contrib/parameterHints/browser/parameterHintsModel';\nimport { Context } from 'vs/editor/contrib/parameterHints/browser/provideSignatureHelp';\nimport * as nls from 'vs/nls';\nimport { ContextKeyExpr } from 'vs/platform/contextkey/common/contextkey';\nimport { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';\nimport { KeybindingWeight } from 'vs/platform/keybinding/common/keybindingsRegistry';\nimport { ParameterHintsWidget } from './parameterHintsWidget';\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "import { KeyCode, KeyMod } from 'vs/base/common/keyCodes';\nimport { Lazy } from 'vs/base/common/lazy';\nimport { Disposable } from 'vs/base/common/lifecycle';\nimport { ICodeEditor } from 'vs/editor/browser/editorBrowser';\nimport { EditorAction, EditorCommand, registerEditorAction, registerEditorCommand, registerEditorContribution, ServicesAccessor } from 'vs/editor/browser/editorExtensions';\nimport { IEditorContribution } from 'vs/editor/common/editorCommon';\nimport { EditorContextKeys } from 'vs/editor/common/editorContextKeys';\nimport * as languages from 'vs/editor/common/languages';\nimport { ILanguageFeaturesService } from 'vs/editor/common/services/languageFeatures';\nimport { ParameterHintsModel, TriggerContext } from 'vs/editor/contrib/parameterHints/browser/parameterHintsModel';\nimport { Context } from 'vs/editor/contrib/parameterHints/browser/provideSignatureHelp';\nimport * as nls from 'vs/nls';\nimport { ContextKeyExpr } from 'vs/platform/contextkey/common/contextkey';\nimport { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';\nimport { KeybindingWeight } from 'vs/platform/keybinding/common/keybindingsRegistry';\nimport { ParameterHintsWidget } from './parameterHintsWidget';\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[2,2)",
			"modifiedRange": "[2,3)",
			"innerChanges": [
				{
					"originalRange": "[2,1 -> 2,1]",
					"modifiedRange": "[2,1 -> 3,1]"
				}
			]
		},
		{
			"originalRange": "[8,9)",
			"modifiedRange": "[9,11)",
			"innerChanges": [
				{
					"originalRange": "[8,9 -> 8,9]",
					"modifiedRange": "[9,9 -> 10,30]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-unfragmented-diffing/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-unfragmented-diffing/legacy.expected.diff.json

```json
{
	"original": {
		"content": "import { KeyCode, KeyMod } from 'vs/base/common/keyCodes';\nimport { Disposable } from 'vs/base/common/lifecycle';\nimport { ICodeEditor } from 'vs/editor/browser/editorBrowser';\nimport { EditorAction, EditorCommand, registerEditorAction, registerEditorCommand, registerEditorContribution, ServicesAccessor } from 'vs/editor/browser/editorExtensions';\nimport { IEditorContribution } from 'vs/editor/common/editorCommon';\nimport { EditorContextKeys } from 'vs/editor/common/editorContextKeys';\nimport * as languages from 'vs/editor/common/languages';\nimport { TriggerContext } from 'vs/editor/contrib/parameterHints/browser/parameterHintsModel';\nimport { Context } from 'vs/editor/contrib/parameterHints/browser/provideSignatureHelp';\nimport * as nls from 'vs/nls';\nimport { ContextKeyExpr } from 'vs/platform/contextkey/common/contextkey';\nimport { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';\nimport { KeybindingWeight } from 'vs/platform/keybinding/common/keybindingsRegistry';\nimport { ParameterHintsWidget } from './parameterHintsWidget';\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "import { KeyCode, KeyMod } from 'vs/base/common/keyCodes';\nimport { Lazy } from 'vs/base/common/lazy';\nimport { Disposable } from 'vs/base/common/lifecycle';\nimport { ICodeEditor } from 'vs/editor/browser/editorBrowser';\nimport { EditorAction, EditorCommand, registerEditorAction, registerEditorCommand, registerEditorContribution, ServicesAccessor } from 'vs/editor/browser/editorExtensions';\nimport { IEditorContribution } from 'vs/editor/common/editorCommon';\nimport { EditorContextKeys } from 'vs/editor/common/editorContextKeys';\nimport * as languages from 'vs/editor/common/languages';\nimport { ILanguageFeaturesService } from 'vs/editor/common/services/languageFeatures';\nimport { ParameterHintsModel, TriggerContext } from 'vs/editor/contrib/parameterHints/browser/parameterHintsModel';\nimport { Context } from 'vs/editor/contrib/parameterHints/browser/provideSignatureHelp';\nimport * as nls from 'vs/nls';\nimport { ContextKeyExpr } from 'vs/platform/contextkey/common/contextkey';\nimport { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';\nimport { KeybindingWeight } from 'vs/platform/keybinding/common/keybindingsRegistry';\nimport { ParameterHintsWidget } from './parameterHintsWidget';\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[2,2)",
			"modifiedRange": "[2,3)",
			"innerChanges": null
		},
		{
			"originalRange": "[8,9)",
			"modifiedRange": "[9,11)",
			"innerChanges": [
				{
					"originalRange": "[8,10 -> 8,10]",
					"modifiedRange": "[9,10 -> 10,31]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-unit-test/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-unit-test/1.tst

```text
test(() => {
    it(() => {
        console.log(1);
    })

    it(() => {
    })
});

test(() => {
    it(() => {
        console.log(1);
    })

    it(() => {
    })
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-unit-test/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-unit-test/2.tst

```text
test(() => {
    it(() => {
        console.log(1);
    })

    it(() => {
2        console.log(2);
    })

    it(() => {
    
    })
});

test(() => {
    it(() => {
        console.log(1);
    })

    it(() => {
    })

    it(() => {
    
    })
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-unit-test/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-unit-test/advanced.expected.diff.json

```json
{
	"original": {
		"content": "test(() => {\n    it(() => {\n        console.log(1);\n    })\n\n    it(() => {\n    })\n});\n\ntest(() => {\n    it(() => {\n        console.log(1);\n    })\n\n    it(() => {\n    })\n});",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "test(() => {\n    it(() => {\n        console.log(1);\n    })\n\n    it(() => {\n2        console.log(2);\n    })\n\n    it(() => {\n    \n    })\n});\n\ntest(() => {\n    it(() => {\n        console.log(1);\n    })\n\n    it(() => {\n    })\n\n    it(() => {\n    \n    })\n});",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[7,7)",
			"modifiedRange": "[7,12)",
			"innerChanges": [
				{
					"originalRange": "[7,1 -> 7,1]",
					"modifiedRange": "[7,1 -> 12,1]"
				}
			]
		},
		{
			"originalRange": "[17,17)",
			"modifiedRange": "[22,26)",
			"innerChanges": [
				{
					"originalRange": "[17,1 -> 17,1]",
					"modifiedRange": "[22,1 -> 26,1]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-unit-test/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-unit-test/legacy.expected.diff.json

```json
{
	"original": {
		"content": "test(() => {\n    it(() => {\n        console.log(1);\n    })\n\n    it(() => {\n    })\n});\n\ntest(() => {\n    it(() => {\n        console.log(1);\n    })\n\n    it(() => {\n    })\n});",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "test(() => {\n    it(() => {\n        console.log(1);\n    })\n\n    it(() => {\n2        console.log(2);\n    })\n\n    it(() => {\n    \n    })\n});\n\ntest(() => {\n    it(() => {\n        console.log(1);\n    })\n\n    it(() => {\n    })\n\n    it(() => {\n    \n    })\n});",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[7,7)",
			"modifiedRange": "[7,12)",
			"innerChanges": null
		},
		{
			"originalRange": "[17,17)",
			"modifiedRange": "[22,26)",
			"innerChanges": null
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/word-shared-letters/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/word-shared-letters/1.tst

```text
// test case 1:
{
	const abc = 1;
}

// test case 2:
{
	const private = 1;
}

// test case 3:
{
	const abc1 = 1;
}

// test case 4:
{
	const index = 1;
}

// test case 5:
{
	const InlineDecoration = 1;
}

// test case 6:
{
	const _getDecorationsInRange = 1;
}

// test case 7:
{
	const lord = 1;
}

// test case 8:
{
	const abc1 = 1;
}

// test case 1:
{
	// hello world
}

// test case 2:
{
	// optimizeSequenceDiffs
}

// test case 3:
{
	const optequffs = 1;
}

// test case 4:
{
	const abc = 1;
}

// test case 5:
{
	const abc = 1;
}

// test case 6:
{
	const abc = 1;
}

// test case 7:
{
	const abc = 1;
}

// test case 8:
{
	const abc = 1;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/word-shared-letters/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/word-shared-letters/2.tst

```text
// test case 1:
{
	const asciiLower = 1;
}

// test case 2:
{
	const protected = 1;
}

// test case 3:
{
	const abc2 = 1;
}

// test case 4:
{
	const undefined = 1;
}

// test case 5:
{
	const IDecorationsViewportData = 1;
}

// test case 6:
{
	const configuration = 1;
}

// test case 7:
{
	const helloWorld = 1;
}

// test case 8:
{
	const abc1 = 1;
}

// test case 1:
{
	// helwor
}

// test case 2:
{
	// optimize Sequence Diffs
}

// test case 3:
{
	const optimize Sequence Diffs = 1;
}

// test case 4:
{
	const abc = 1;
}

// test case 5:
{
	const abc = 1;
}

// test case 6:
{
	const abc = 1;
}

// test case 7:
{
	const abc = 1;
}

// test case 8:
{
	const abc = 1;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/word-shared-letters/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/word-shared-letters/advanced.expected.diff.json

```json
{
	"original": {
		"content": "// test case 1:\n{\n\tconst abc = 1;\n}\n\n// test case 2:\n{\n\tconst private = 1;\n}\n\n// test case 3:\n{\n\tconst abc1 = 1;\n}\n\n// test case 4:\n{\n\tconst index = 1;\n}\n\n// test case 5:\n{\n\tconst InlineDecoration = 1;\n}\n\n// test case 6:\n{\n\tconst _getDecorationsInRange = 1;\n}\n\n// test case 7:\n{\n\tconst lord = 1;\n}\n\n// test case 8:\n{\n\tconst abc1 = 1;\n}\n\n// test case 1:\n{\n\t// hello world\n}\n\n// test case 2:\n{\n\t// optimizeSequenceDiffs\n}\n\n// test case 3:\n{\n\tconst optequffs = 1;\n}\n\n// test case 4:\n{\n\tconst abc = 1;\n}\n\n// test case 5:\n{\n\tconst abc = 1;\n}\n\n// test case 6:\n{\n\tconst abc = 1;\n}\n\n// test case 7:\n{\n\tconst abc = 1;\n}\n\n// test case 8:\n{\n\tconst abc = 1;\n}\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "// test case 1:\n{\n\tconst asciiLower = 1;\n}\n\n// test case 2:\n{\n\tconst protected = 1;\n}\n\n// test case 3:\n{\n\tconst abc2 = 1;\n}\n\n// test case 4:\n{\n\tconst undefined = 1;\n}\n\n// test case 5:\n{\n\tconst IDecorationsViewportData = 1;\n}\n\n// test case 6:\n{\n\tconst configuration = 1;\n}\n\n// test case 7:\n{\n\tconst helloWorld = 1;\n}\n\n// test case 8:\n{\n\tconst abc1 = 1;\n}\n\n// test case 1:\n{\n\t// helwor\n}\n\n// test case 2:\n{\n\t// optimize Sequence Diffs\n}\n\n// test case 3:\n{\n\tconst optimize Sequence Diffs = 1;\n}\n\n// test case 4:\n{\n\tconst abc = 1;\n}\n\n// test case 5:\n{\n\tconst abc = 1;\n}\n\n// test case 6:\n{\n\tconst abc = 1;\n}\n\n// test case 7:\n{\n\tconst abc = 1;\n}\n\n// test case 8:\n{\n\tconst abc = 1;\n}\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[3,4)",
			"modifiedRange": "[3,4)",
			"innerChanges": [
				{
					"originalRange": "[3,8 -> 3,11]",
					"modifiedRange": "[3,8 -> 3,18]"
				}
			]
		},
		{
			"originalRange": "[8,9)",
			"modifiedRange": "[8,9)",
			"innerChanges": [
				{
					"originalRange": "[8,8 -> 8,15]",
					"modifiedRange": "[8,8 -> 8,17]"
				}
			]
		},
		{
			"originalRange": "[13,14)",
			"modifiedRange": "[13,14)",
			"innerChanges": [
				{
					"originalRange": "[13,11 -> 13,12]",
					"modifiedRange": "[13,11 -> 13,12]"
				}
			]
		},
		{
			"originalRange": "[18,19)",
			"modifiedRange": "[18,19)",
			"innerChanges": [
				{
					"originalRange": "[18,8 -> 18,13]",
					"modifiedRange": "[18,8 -> 18,17]"
				}
			]
		},
		{
			"originalRange": "[23,24)",
			"modifiedRange": "[23,24)",
			"innerChanges": [
				{
					"originalRange": "[23,8 -> 23,24]",
					"modifiedRange": "[23,8 -> 23,32]"
				}
			]
		},
		{
			"originalRange": "[28,29)",
			"modifiedRange": "[28,29)",
			"innerChanges": [
				{
					"originalRange": "[28,8 -> 28,30]",
					"modifiedRange": "[28,8 -> 28,21]"
				}
			]
		},
		{
			"originalRange": "[33,34)",
			"modifiedRange": "[33,34)",
			"innerChanges": [
				{
					"originalRange": "[33,8 -> 33,12]",
					"modifiedRange": "[33,8 -> 33,18]"
				}
			]
		},
		{
			"originalRange": "[43,44)",
			"modifiedRange": "[43,44)",
			"innerChanges": [
				{
					"originalRange": "[43,8 -> 43,11]",
					"modifiedRange": "[43,8 -> 43,8]"
				},
				{
					"originalRange": "[43,14 -> 43,16 EOL]",
					"modifiedRange": "[43,11 -> 43,11 EOL]"
				}
			]
		},
		{
			"originalRange": "[48,49)",
			"modifiedRange": "[48,49)",
			"innerChanges": [
				{
					"originalRange": "[48,13 -> 48,13]",
					"modifiedRange": "[48,13 -> 48,14]"
				},
				{
					"originalRange": "[48,21 -> 48,21]",
					"modifiedRange": "[48,22 -> 48,23]"
				}
			]
		},
		{
			"originalRange": "[53,54)",
			"modifiedRange": "[53,54)",
			"innerChanges": [
				{
					"originalRange": "[53,8 -> 53,17]",
					"modifiedRange": "[53,8 -> 53,31]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/word-shared-letters/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/word-shared-letters/legacy.expected.diff.json

```json
{
	"original": {
		"content": "// test case 1:\n{\n\tconst abc = 1;\n}\n\n// test case 2:\n{\n\tconst private = 1;\n}\n\n// test case 3:\n{\n\tconst abc1 = 1;\n}\n\n// test case 4:\n{\n\tconst index = 1;\n}\n\n// test case 5:\n{\n\tconst InlineDecoration = 1;\n}\n\n// test case 6:\n{\n\tconst _getDecorationsInRange = 1;\n}\n\n// test case 7:\n{\n\tconst lord = 1;\n}\n\n// test case 8:\n{\n\tconst abc1 = 1;\n}\n\n// test case 1:\n{\n\t// hello world\n}\n\n// test case 2:\n{\n\t// optimizeSequenceDiffs\n}\n\n// test case 3:\n{\n\tconst optequffs = 1;\n}\n\n// test case 4:\n{\n\tconst abc = 1;\n}\n\n// test case 5:\n{\n\tconst abc = 1;\n}\n\n// test case 6:\n{\n\tconst abc = 1;\n}\n\n// test case 7:\n{\n\tconst abc = 1;\n}\n\n// test case 8:\n{\n\tconst abc = 1;\n}\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "// test case 1:\n{\n\tconst asciiLower = 1;\n}\n\n// test case 2:\n{\n\tconst protected = 1;\n}\n\n// test case 3:\n{\n\tconst abc2 = 1;\n}\n\n// test case 4:\n{\n\tconst undefined = 1;\n}\n\n// test case 5:\n{\n\tconst IDecorationsViewportData = 1;\n}\n\n// test case 6:\n{\n\tconst configuration = 1;\n}\n\n// test case 7:\n{\n\tconst helloWorld = 1;\n}\n\n// test case 8:\n{\n\tconst abc1 = 1;\n}\n\n// test case 1:\n{\n\t// helwor\n}\n\n// test case 2:\n{\n\t// optimize Sequence Diffs\n}\n\n// test case 3:\n{\n\tconst optimize Sequence Diffs = 1;\n}\n\n// test case 4:\n{\n\tconst abc = 1;\n}\n\n// test case 5:\n{\n\tconst abc = 1;\n}\n\n// test case 6:\n{\n\tconst abc = 1;\n}\n\n// test case 7:\n{\n\tconst abc = 1;\n}\n\n// test case 8:\n{\n\tconst abc = 1;\n}\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[3,4)",
			"modifiedRange": "[3,4)",
			"innerChanges": [
				{
					"originalRange": "[3,9 -> 3,11]",
					"modifiedRange": "[3,9 -> 3,18]"
				}
			]
		},
		{
			"originalRange": "[8,9)",
			"modifiedRange": "[8,9)",
			"innerChanges": [
				{
					"originalRange": "[8,10 -> 8,15]",
					"modifiedRange": "[8,10 -> 8,17]"
				}
			]
		},
		{
			"originalRange": "[13,14)",
			"modifiedRange": "[13,14)",
			"innerChanges": [
				{
					"originalRange": "[13,11 -> 13,12]",
					"modifiedRange": "[13,11 -> 13,12]"
				}
			]
		},
		{
			"originalRange": "[18,19)",
			"modifiedRange": "[18,19)",
			"innerChanges": [
				{
					"originalRange": "[18,8 -> 18,13]",
					"modifiedRange": "[18,8 -> 18,17]"
				}
			]
		},
		{
			"originalRange": "[23,24)",
			"modifiedRange": "[23,24)",
			"innerChanges": [
				{
					"originalRange": "[23,9 -> 23,14]",
					"modifiedRange": "[23,9 -> 23,9]"
				},
				{
					"originalRange": "[23,24 -> 23,24]",
					"modifiedRange": "[23,19 -> 23,32]"
				}
			]
		},
		{
			"originalRange": "[28,29)",
			"modifiedRange": "[28,29)",
			"innerChanges": [
				{
					"originalRange": "[28,8 -> 28,16]",
					"modifiedRange": "[28,8 -> 28,15]"
				},
				{
					"originalRange": "[28,22 -> 28,30]",
					"modifiedRange": "[28,21 -> 28,21]"
				}
			]
		},
		{
			"originalRange": "[33,34)",
			"modifiedRange": "[33,34)",
			"innerChanges": [
				{
					"originalRange": "[33,8 -> 33,11]",
					"modifiedRange": "[33,8 -> 33,17]"
				}
			]
		},
		{
			"originalRange": "[43,44)",
			"modifiedRange": "[43,44)",
			"innerChanges": [
				{
					"originalRange": "[43,8 -> 43,11]",
					"modifiedRange": "[43,8 -> 43,8]"
				},
				{
					"originalRange": "[43,14 -> 43,16 EOL]",
					"modifiedRange": "[43,11 -> 43,11 EOL]"
				}
			]
		},
		{
			"originalRange": "[48,49)",
			"modifiedRange": "[48,49)",
			"innerChanges": [
				{
					"originalRange": "[48,13 -> 48,13]",
					"modifiedRange": "[48,13 -> 48,14]"
				},
				{
					"originalRange": "[48,21 -> 48,21]",
					"modifiedRange": "[48,22 -> 48,23]"
				}
			]
		},
		{
			"originalRange": "[53,54)",
			"modifiedRange": "[53,54)",
			"innerChanges": [
				{
					"originalRange": "[53,11 -> 53,11]",
					"modifiedRange": "[53,11 -> 53,18]"
				},
				{
					"originalRange": "[53,14 -> 53,14]",
					"modifiedRange": "[53,21 -> 53,28]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ws-alignment/1.tsx]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ws-alignment/1.tsx

```typescript
import { Stack, Text } from '@fluentui/react';
import { View } from '../../layout/layout';

export const WelcomeView = () => {
	return (
		<View title='VS Code Tools'>
			<Stack grow={true} verticalFill={true}>
				<Stack.Item>
					<Text>
						Welcome to the VS Code Tools application.
					</Text>
				</Stack.Item>
			</Stack>
		</View>
	);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ws-alignment/2.tsx]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ws-alignment/2.tsx

```typescript
import { Nav } from '@fluentui/react';
import { View } from '../../layout/layout';

export const WelcomeView = () => {
	return (
		<View title='VS Code Tools'>
			<Nav
				groups={[
					{
						links: [
							{ name: 'VS Code Standup (Redmond)', url: 'https://vscode-standup.azurewebsites.net', icon: 'JoinOnlineMeeting', target: '_blank' },
							{ name: 'VS Code Standup (Zurich)', url: 'https://stand.azurewebsites.net/', icon: 'JoinOnlineMeeting', target: '_blank' },
							{ name: 'VS Code Errors', url: 'https://errors.code.visualstudio.com', icon: 'ErrorBadge', target: '_blank' },
						]
					}
				]}>
			</Nav>
		</View>
	);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ws-alignment/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ws-alignment/advanced.expected.diff.json

```json
{
	"original": {
		"content": "import { Stack, Text } from '@fluentui/react';\nimport { View } from '../../layout/layout';\n\nexport const WelcomeView = () => {\n\treturn (\n\t\t<View title='VS Code Tools'>\n\t\t\t<Stack grow={true} verticalFill={true}>\n\t\t\t\t<Stack.Item>\n\t\t\t\t\t<Text>\n\t\t\t\t\t\tWelcome to the VS Code Tools application.\n\t\t\t\t\t</Text>\n\t\t\t\t</Stack.Item>\n\t\t\t</Stack>\n\t\t</View>\n\t);\n}\n",
		"fileName": "./1.tsx"
	},
	"modified": {
		"content": "import { Nav } from '@fluentui/react';\nimport { View } from '../../layout/layout';\n\nexport const WelcomeView = () => {\n\treturn (\n\t\t<View title='VS Code Tools'>\n\t\t\t<Nav\n\t\t\t\tgroups={[\n\t\t\t\t\t{\n\t\t\t\t\t\tlinks: [\n\t\t\t\t\t\t\t{ name: 'VS Code Standup (Redmond)', url: 'https://vscode-standup.azurewebsites.net', icon: 'JoinOnlineMeeting', target: '_blank' },\n\t\t\t\t\t\t\t{ name: 'VS Code Standup (Zurich)', url: 'https://stand.azurewebsites.net/', icon: 'JoinOnlineMeeting', target: '_blank' },\n\t\t\t\t\t\t\t{ name: 'VS Code Errors', url: 'https://errors.code.visualstudio.com', icon: 'ErrorBadge', target: '_blank' },\n\t\t\t\t\t\t]\n\t\t\t\t\t}\n\t\t\t\t]}>\n\t\t\t</Nav>\n\t\t</View>\n\t);\n}\n",
		"fileName": "./2.tsx"
	},
	"diffs": [
		{
			"originalRange": "[1,2)",
			"modifiedRange": "[1,2)",
			"innerChanges": [
				{
					"originalRange": "[1,10 -> 1,21]",
					"modifiedRange": "[1,10 -> 1,13]"
				}
			]
		},
		{
			"originalRange": "[7,14)",
			"modifiedRange": "[7,18)",
			"innerChanges": [
				{
					"originalRange": "[7,1 -> 13,1]",
					"modifiedRange": "[7,1 -> 17,1]"
				},
				{
					"originalRange": "[13,6 -> 13,11]",
					"modifiedRange": "[17,6 -> 17,9]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ws-alignment/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ws-alignment/legacy.expected.diff.json

```json
{
	"original": {
		"content": "import { Stack, Text } from '@fluentui/react';\nimport { View } from '../../layout/layout';\n\nexport const WelcomeView = () => {\n\treturn (\n\t\t<View title='VS Code Tools'>\n\t\t\t<Stack grow={true} verticalFill={true}>\n\t\t\t\t<Stack.Item>\n\t\t\t\t\t<Text>\n\t\t\t\t\t\tWelcome to the VS Code Tools application.\n\t\t\t\t\t</Text>\n\t\t\t\t</Stack.Item>\n\t\t\t</Stack>\n\t\t</View>\n\t);\n}\n",
		"fileName": "./1.tsx"
	},
	"modified": {
		"content": "import { Nav } from '@fluentui/react';\nimport { View } from '../../layout/layout';\n\nexport const WelcomeView = () => {\n\treturn (\n\t\t<View title='VS Code Tools'>\n\t\t\t<Nav\n\t\t\t\tgroups={[\n\t\t\t\t\t{\n\t\t\t\t\t\tlinks: [\n\t\t\t\t\t\t\t{ name: 'VS Code Standup (Redmond)', url: 'https://vscode-standup.azurewebsites.net', icon: 'JoinOnlineMeeting', target: '_blank' },\n\t\t\t\t\t\t\t{ name: 'VS Code Standup (Zurich)', url: 'https://stand.azurewebsites.net/', icon: 'JoinOnlineMeeting', target: '_blank' },\n\t\t\t\t\t\t\t{ name: 'VS Code Errors', url: 'https://errors.code.visualstudio.com', icon: 'ErrorBadge', target: '_blank' },\n\t\t\t\t\t\t]\n\t\t\t\t\t}\n\t\t\t\t]}>\n\t\t\t</Nav>\n\t\t</View>\n\t);\n}\n",
		"fileName": "./2.tsx"
	},
	"diffs": [
		{
			"originalRange": "[1,2)",
			"modifiedRange": "[1,2)",
			"innerChanges": [
				{
					"originalRange": "[1,10 -> 1,21]",
					"modifiedRange": "[1,10 -> 1,13]"
				}
			]
		},
		{
			"originalRange": "[7,14)",
			"modifiedRange": "[7,18)",
			"innerChanges": [
				{
					"originalRange": "[7,5 -> 7,11]",
					"modifiedRange": "[7,5 -> 8,5]"
				},
				{
					"originalRange": "[7,14 -> 7,43 EOL]",
					"modifiedRange": "[8,8 -> 11,140 EOL]"
				},
				{
					"originalRange": "[8,5 -> 8,6]",
					"modifiedRange": "[12,5 -> 12,25]"
				},
				{
					"originalRange": "[8,9 -> 9,12 EOL]",
					"modifiedRange": "[12,28 -> 12,131 EOL]"
				},
				{
					"originalRange": "[10,7 -> 10,22]",
					"modifiedRange": "[13,7 -> 13,17]"
				},
				{
					"originalRange": "[10,30 -> 10,48 EOL]",
					"modifiedRange": "[13,25 -> 14,8 EOL]"
				},
				{
					"originalRange": "[11,6 -> 11,13 EOL]",
					"modifiedRange": "[15,6 -> 15,7 EOL]"
				},
				{
					"originalRange": "[12,5 -> 12,17]",
					"modifiedRange": "[16,5 -> 16,7]"
				},
				{
					"originalRange": "[13,6 -> 13,11]",
					"modifiedRange": "[17,6 -> 17,9]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/accessibility/browser/accessibilityService.ts]---
Location: vscode-main/src/vs/platform/accessibility/browser/accessibilityService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { addDisposableListener } from '../../../base/browser/dom.js';
import { alert, status } from '../../../base/browser/ui/aria/aria.js';
import { mainWindow } from '../../../base/browser/window.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { AccessibilitySupport, CONTEXT_ACCESSIBILITY_MODE_ENABLED, IAccessibilityService } from '../common/accessibility.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../contextkey/common/contextkey.js';
import { ILayoutService } from '../../layout/browser/layoutService.js';

export class AccessibilityService extends Disposable implements IAccessibilityService {
	declare readonly _serviceBrand: undefined;

	private _accessibilityModeEnabledContext: IContextKey<boolean>;
	protected _accessibilitySupport = AccessibilitySupport.Unknown;
	protected readonly _onDidChangeScreenReaderOptimized = new Emitter<void>();

	protected _configMotionReduced: 'auto' | 'on' | 'off';
	protected _systemMotionReduced: boolean;
	protected readonly _onDidChangeReducedMotion = new Emitter<void>();

	private _linkUnderlinesEnabled: boolean;
	protected readonly _onDidChangeLinkUnderline = new Emitter<void>();

	constructor(
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@ILayoutService private readonly _layoutService: ILayoutService,
		@IConfigurationService protected readonly _configurationService: IConfigurationService
	) {
		super();
		this._accessibilityModeEnabledContext = CONTEXT_ACCESSIBILITY_MODE_ENABLED.bindTo(this._contextKeyService);

		const updateContextKey = () => this._accessibilityModeEnabledContext.set(this.isScreenReaderOptimized());
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('editor.accessibilitySupport')) {
				updateContextKey();
				this._onDidChangeScreenReaderOptimized.fire();
			}
			if (e.affectsConfiguration('workbench.reduceMotion')) {
				this._configMotionReduced = this._configurationService.getValue('workbench.reduceMotion');
				this._onDidChangeReducedMotion.fire();
			}
		}));
		updateContextKey();
		this._register(this.onDidChangeScreenReaderOptimized(() => updateContextKey()));

		const reduceMotionMatcher = mainWindow.matchMedia(`(prefers-reduced-motion: reduce)`);
		this._systemMotionReduced = reduceMotionMatcher.matches;
		this._configMotionReduced = this._configurationService.getValue<'auto' | 'on' | 'off'>('workbench.reduceMotion');

		this._linkUnderlinesEnabled = this._configurationService.getValue('accessibility.underlineLinks');

		this.initReducedMotionListeners(reduceMotionMatcher);
		this.initLinkUnderlineListeners();
	}

	private initReducedMotionListeners(reduceMotionMatcher: MediaQueryList) {

		this._register(addDisposableListener(reduceMotionMatcher, 'change', () => {
			this._systemMotionReduced = reduceMotionMatcher.matches;
			if (this._configMotionReduced === 'auto') {
				this._onDidChangeReducedMotion.fire();
			}
		}));

		const updateRootClasses = () => {
			const reduce = this.isMotionReduced();
			this._layoutService.mainContainer.classList.toggle('monaco-reduce-motion', reduce);
			this._layoutService.mainContainer.classList.toggle('monaco-enable-motion', !reduce);
		};

		updateRootClasses();
		this._register(this.onDidChangeReducedMotion(() => updateRootClasses()));
	}

	private initLinkUnderlineListeners() {
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('accessibility.underlineLinks')) {
				const linkUnderlinesEnabled = this._configurationService.getValue<boolean>('accessibility.underlineLinks');
				this._linkUnderlinesEnabled = linkUnderlinesEnabled;
				this._onDidChangeLinkUnderline.fire();
			}
		}));

		const updateLinkUnderlineClasses = () => {
			const underlineLinks = this._linkUnderlinesEnabled;
			this._layoutService.mainContainer.classList.toggle('underline-links', underlineLinks);
		};

		updateLinkUnderlineClasses();

		this._register(this.onDidChangeLinkUnderlines(() => updateLinkUnderlineClasses()));
	}

	public onDidChangeLinkUnderlines(listener: () => void) {
		return this._onDidChangeLinkUnderline.event(listener);
	}

	get onDidChangeScreenReaderOptimized(): Event<void> {
		return this._onDidChangeScreenReaderOptimized.event;
	}

	isScreenReaderOptimized(): boolean {
		const config = this._configurationService.getValue('editor.accessibilitySupport');
		return config === 'on' || (config === 'auto' && this._accessibilitySupport === AccessibilitySupport.Enabled);
	}

	get onDidChangeReducedMotion(): Event<void> {
		return this._onDidChangeReducedMotion.event;
	}

	isMotionReduced(): boolean {
		const config = this._configMotionReduced;
		return config === 'on' || (config === 'auto' && this._systemMotionReduced);
	}

	alwaysUnderlineAccessKeys(): Promise<boolean> {
		return Promise.resolve(false);
	}

	getAccessibilitySupport(): AccessibilitySupport {
		return this._accessibilitySupport;
	}

	setAccessibilitySupport(accessibilitySupport: AccessibilitySupport): void {
		if (this._accessibilitySupport === accessibilitySupport) {
			return;
		}

		this._accessibilitySupport = accessibilitySupport;
		this._onDidChangeScreenReaderOptimized.fire();
	}

	alert(message: string): void {
		alert(message);
	}

	status(message: string): void {
		status(message);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/accessibility/browser/accessibleView.ts]---
Location: vscode-main/src/vs/platform/accessibility/browser/accessibleView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IKeyboardEvent } from '../../keybinding/common/keybinding.js';
import { IPickerQuickAccessItem } from '../../quickinput/browser/pickerQuickAccess.js';
import { Event } from '../../../base/common/event.js';
import { IAction } from '../../../base/common/actions.js';
import { IQuickPickItem } from '../../quickinput/common/quickInput.js';
import { IDisposable, Disposable } from '../../../base/common/lifecycle.js';

export const IAccessibleViewService = createDecorator<IAccessibleViewService>('accessibleViewService');

export const enum AccessibleViewProviderId {
	Terminal = 'terminal',
	TerminalChat = 'terminal-chat',
	TerminalHelp = 'terminal-help',
	DiffEditor = 'diffEditor',
	MergeEditor = 'mergeEditor',
	PanelChat = 'panelChat',
	ChatTerminalOutput = 'chatTerminalOutput',
	InlineChat = 'inlineChat',
	AgentChat = 'agentChat',
	QuickChat = 'quickChat',
	InlineCompletions = 'inlineCompletions',
	KeybindingsEditor = 'keybindingsEditor',
	Notebook = 'notebook',
	ReplEditor = 'replEditor',
	Editor = 'editor',
	Hover = 'hover',
	Notification = 'notification',
	EmptyEditorHint = 'emptyEditorHint',
	Comments = 'comments',
	CommentThread = 'commentThread',
	Repl = 'repl',
	ReplHelp = 'replHelp',
	RunAndDebug = 'runAndDebug',
	Walkthrough = 'walkthrough',
	SourceControl = 'scm'
}

export const enum AccessibleViewType {
	Help = 'help',
	View = 'view'
}

export const enum NavigationType {
	Previous = 'previous',
	Next = 'next'
}

export interface IAccessibleViewOptions {
	readMoreUrl?: string;
	/**
	 * Defaults to markdown
	 */
	language?: string;
	type: AccessibleViewType;
	/**
	 * By default, places the cursor on the top line of the accessible view.
	 * If set to 'initial-bottom', places the cursor on the bottom line of the accessible view and preserves it henceforth.
	 * If set to 'bottom', places the cursor on the bottom line of the accessible view.
	 */
	position?: 'bottom' | 'initial-bottom';
	/**
	 * @returns a string that will be used as the content of the help dialog
	 * instead of the one provided by default.
	 */
	customHelp?: () => string;
	/**
	 * If this provider might want to request to be shown again, provide an ID.
	 */
	id?: AccessibleViewProviderId;

	/**
	 * Keybinding items to configure
	 */
	configureKeybindingItems?: IQuickPickItem[];

	/**
	 * Keybinding items that are already configured
	 */
	configuredKeybindingItems?: IQuickPickItem[];
}


export interface IAccessibleViewContentProvider extends IBasicContentProvider, IDisposable {
	id: AccessibleViewProviderId;
	verbositySettingKey: string;
	/**
	 * Note that a Codicon class should be provided for each action.
	 * If not, a default will be used.
	 */
	onKeyDown?(e: IKeyboardEvent): void;
	/**
	 * When the language is markdown, this is provided by default.
	 */
	getSymbols?(): IAccessibleViewSymbol[];
	/**
	 * Note that this will only take effect if the provider has an ID.
	 */
	readonly onDidRequestClearLastProvider?: Event<AccessibleViewProviderId>;
}


export interface IAccessibleViewSymbol extends IPickerQuickAccessItem {
	markdownToParse?: string;
	firstListItem?: string;
	lineNumber?: number;
	endLineNumber?: number;
}

export interface IPosition {
	lineNumber: number;
	column: number;
}

export interface IAccessibleViewService {
	readonly _serviceBrand: undefined;
	// The provider will be disposed when the view is closed
	show(provider: AccesibleViewContentProvider, position?: IPosition): void;
	showLastProvider(id: AccessibleViewProviderId): void;
	showAccessibleViewHelp(): void;
	next(): void;
	previous(): void;
	navigateToCodeBlock(type: 'next' | 'previous'): void;
	goToSymbol(): void;
	disableHint(): void;
	getPosition(id: AccessibleViewProviderId): IPosition | undefined;
	setPosition(position: IPosition, reveal?: boolean, select?: boolean): void;
	getLastPosition(): IPosition | undefined;
	/**
	 * If the setting is enabled, provides the open accessible view hint as a localized string.
	 * @param verbositySettingKey The setting key for the verbosity of the feature
	 */
	getOpenAriaHint(verbositySettingKey: string): string | null;
	getCodeBlockContext(): ICodeBlockActionContext | undefined;
	configureKeybindings(unassigned: boolean): void;
	openHelpLink(): void;
}


export interface ICodeBlockActionContext {
	code: string;
	languageId?: string;
	codeBlockIndex: number;
	element: unknown;
}

export type AccesibleViewContentProvider = AccessibleContentProvider | ExtensionContentProvider;

export class AccessibleContentProvider extends Disposable implements IAccessibleViewContentProvider {

	constructor(
		public id: AccessibleViewProviderId,
		public options: IAccessibleViewOptions,
		public provideContent: () => string,
		public onClose: () => void,
		public verbositySettingKey: string,
		public onOpen?: () => void,
		public actions?: IAction[],
		public provideNextContent?: () => string | undefined,
		public providePreviousContent?: () => string | undefined,
		public onDidChangeContent?: Event<void>,
		public onKeyDown?: (e: IKeyboardEvent) => void,
		public getSymbols?: () => IAccessibleViewSymbol[],
		public onDidRequestClearLastProvider?: Event<AccessibleViewProviderId>,
	) {
		super();
	}
}

export function isIAccessibleViewContentProvider(obj: unknown): obj is IAccessibleViewContentProvider {
	if (!obj || typeof obj !== 'object') {
		return false;
	}

	const candidate = obj as Partial<IAccessibleViewContentProvider>;
	return !!candidate.id
		&& !!candidate.options
		&& typeof candidate.provideContent === 'function'
		&& typeof candidate.onClose === 'function'
		&& typeof candidate.verbositySettingKey === 'string';
}

export class ExtensionContentProvider extends Disposable implements IBasicContentProvider {

	constructor(
		public readonly id: string,
		public options: IAccessibleViewOptions,
		public provideContent: () => string,
		public onClose: () => void,
		public onOpen?: () => void,
		public provideNextContent?: () => string | undefined,
		public providePreviousContent?: () => string | undefined,
		public actions?: IAction[],
		public onDidChangeContent?: Event<void>,
	) {
		super();
	}
}

export interface IBasicContentProvider extends IDisposable {
	id: string;
	options: IAccessibleViewOptions;
	onClose(): void;
	provideContent(): string;
	onOpen?(): void;
	actions?: IAction[];
	providePreviousContent?(): void;
	provideNextContent?(): void;
	readonly onDidChangeContent?: Event<void>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/accessibility/browser/accessibleViewRegistry.ts]---
Location: vscode-main/src/vs/platform/accessibility/browser/accessibleViewRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../base/common/lifecycle.js';
import { AccessibleViewType, AccessibleContentProvider, ExtensionContentProvider } from './accessibleView.js';
import { ContextKeyExpression } from '../../contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../instantiation/common/instantiation.js';

export interface IAccessibleViewImplementation {
	type: AccessibleViewType;
	priority: number;
	name: string;
	/**
	 * @returns the provider or undefined if the view should not be shown
	 */
	getProvider: (accessor: ServicesAccessor) => AccessibleContentProvider | ExtensionContentProvider | undefined;
	when?: ContextKeyExpression | undefined;
}

export const AccessibleViewRegistry = new class AccessibleViewRegistry {
	_implementations: IAccessibleViewImplementation[] = [];

	register(implementation: IAccessibleViewImplementation): IDisposable {
		this._implementations.push(implementation);
		return {
			dispose: () => {
				const idx = this._implementations.indexOf(implementation);
				if (idx !== -1) {
					this._implementations.splice(idx, 1);
				}
			}
		};
	}

	getImplementations(): IAccessibleViewImplementation[] {
		return this._implementations;
	}
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/accessibility/common/accessibility.ts]---
Location: vscode-main/src/vs/platform/accessibility/common/accessibility.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { RawContextKey } from '../../contextkey/common/contextkey.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IAccessibilityService = createDecorator<IAccessibilityService>('accessibilityService');

export interface IAccessibilityService {
	readonly _serviceBrand: undefined;

	readonly onDidChangeScreenReaderOptimized: Event<void>;
	readonly onDidChangeReducedMotion: Event<void>;

	alwaysUnderlineAccessKeys(): Promise<boolean>;
	isScreenReaderOptimized(): boolean;
	isMotionReduced(): boolean;
	getAccessibilitySupport(): AccessibilitySupport;
	setAccessibilitySupport(accessibilitySupport: AccessibilitySupport): void;
	alert(message: string): void;
	status(message: string): void;
}

export const enum AccessibilitySupport {
	/**
	 * This should be the browser case where it is not known if a screen reader is attached or no.
	 */
	Unknown = 0,

	Disabled = 1,

	Enabled = 2
}

export const CONTEXT_ACCESSIBILITY_MODE_ENABLED = new RawContextKey<boolean>('accessibilityModeEnabled', false);

export interface IAccessibilityInformation {
	label: string;
	role?: string;
}

export function isAccessibilityInformation(obj: unknown): obj is IAccessibilityInformation {
	if (!obj || typeof obj !== 'object') {
		return false;
	}

	const candidate = obj as Partial<IAccessibilityInformation>;
	return typeof candidate.label === 'string'
		&& (typeof candidate.role === 'undefined' || typeof candidate.role === 'string');
}

export const ACCESSIBLE_VIEW_SHOWN_STORAGE_PREFIX = 'ACCESSIBLE_VIEW_SHOWN_';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/accessibility/test/common/testAccessibilityService.ts]---
Location: vscode-main/src/vs/platform/accessibility/test/common/testAccessibilityService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { IAccessibilityService, AccessibilitySupport } from '../../common/accessibility.js';

export class TestAccessibilityService implements IAccessibilityService {

	declare readonly _serviceBrand: undefined;

	onDidChangeScreenReaderOptimized = Event.None;
	onDidChangeReducedMotion = Event.None;

	isScreenReaderOptimized(): boolean { return false; }
	isMotionReduced(): boolean { return true; }
	alwaysUnderlineAccessKeys(): Promise<boolean> { return Promise.resolve(false); }
	setAccessibilitySupport(accessibilitySupport: AccessibilitySupport): void { }
	getAccessibilitySupport(): AccessibilitySupport { return AccessibilitySupport.Unknown; }
	alert(message: string): void { }
	status(message: string): void { }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/accessibilitySignal/browser/accessibilitySignalService.ts]---
Location: vscode-main/src/vs/platform/accessibilitySignal/browser/accessibilitySignalService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { addDisposableListener } from '../../../base/browser/dom.js';
import { CachedFunction } from '../../../base/common/cache.js';
import { getStructuralKey } from '../../../base/common/equals.js';
import { Event, IValueWithChangeEvent } from '../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { FileAccess } from '../../../base/common/network.js';
import { derived, observableFromEvent, ValueWithChangeEventFromObservable } from '../../../base/common/observable.js';
import { localize } from '../../../nls.js';
import { IAccessibilityService } from '../../accessibility/common/accessibility.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { observableConfigValue } from '../../observable/common/platformObservableUtils.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';

export const IAccessibilitySignalService = createDecorator<IAccessibilitySignalService>('accessibilitySignalService');

export interface IAccessibilitySignalService {
	readonly _serviceBrand: undefined;
	playSignal(signal: AccessibilitySignal, options?: IAccessbilitySignalOptions): Promise<void>;
	playSignals(signals: (AccessibilitySignal | { signal: AccessibilitySignal; source: string })[]): Promise<void>;
	playSignalLoop(signal: AccessibilitySignal, milliseconds: number): IDisposable;

	getEnabledState(signal: AccessibilitySignal, userGesture: boolean, modality?: AccessibilityModality | undefined): IValueWithChangeEvent<boolean>;
	getDelayMs(signal: AccessibilitySignal, modality: AccessibilityModality, mode: 'line' | 'positional'): number;
	/**
	 * Avoid this method and prefer `.playSignal`!
	 * Only use it when you want to play the sound regardless of enablement, e.g. in the settings quick pick.
	 */
	playSound(signal: Sound, allowManyInParallel: boolean, token: typeof AcknowledgeDocCommentsToken): Promise<void>;

	/** @deprecated Use getEnabledState(...).onChange */
	isSoundEnabled(signal: AccessibilitySignal): boolean;
	/** @deprecated Use getEnabledState(...).value */
	isAnnouncementEnabled(signal: AccessibilitySignal): boolean;
	/** @deprecated Use getEnabledState(...).onChange */
	onSoundEnabledChanged(signal: AccessibilitySignal): Event<void>;
}

/** Make sure you understand the doc comments of the method you want to call when using this token! */
export const AcknowledgeDocCommentsToken = Symbol('AcknowledgeDocCommentsToken');

export type AccessibilityModality = 'sound' | 'announcement';

export interface IAccessbilitySignalOptions {
	allowManyInParallel?: boolean;

	modality?: AccessibilityModality;

	/**
	 * The source that triggered the signal (e.g. "diffEditor.cursorPositionChanged").
	 */
	source?: string;

	/**
	 * For actions like save or format, depending on the
	 * configured value, we will only
	 * play the sound if the user triggered the action.
	 */
	userGesture?: boolean;

	/**
	 * The custom message to alert with.
	 * This will override the default announcement message.
	 */
	customAlertMessage?: string;
}

export class AccessibilitySignalService extends Disposable implements IAccessibilitySignalService {
	readonly _serviceBrand: undefined;
	private readonly sounds: Map<string, HTMLAudioElement>;
	private readonly screenReaderAttached;
	private readonly sentTelemetry;

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IAccessibilityService private readonly accessibilityService: IAccessibilityService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
	) {
		super();
		this.sounds = new Map();
		this.screenReaderAttached = observableFromEvent(this,
			this.accessibilityService.onDidChangeScreenReaderOptimized,
			() => /** @description accessibilityService.onDidChangeScreenReaderOptimized */ this.accessibilityService.isScreenReaderOptimized()
		);
		this.sentTelemetry = new Set<string>();
		this.playingSounds = new Set<Sound>();
		this._signalConfigValue = new CachedFunction((signal: AccessibilitySignal) => observableConfigValue<{
			sound: EnabledState;
			announcement: EnabledState;
		}>(signal.settingsKey, { sound: 'off', announcement: 'off' }, this.configurationService));
		this._signalEnabledState = new CachedFunction(
			{ getCacheKey: getStructuralKey },
			(arg: { signal: AccessibilitySignal; userGesture: boolean; modality?: AccessibilityModality | undefined }) => {
				return derived(reader => {
					/** @description sound enabled */
					const setting = this._signalConfigValue.get(arg.signal).read(reader);

					if (arg.modality === 'sound' || arg.modality === undefined) {
						if (arg.signal.managesOwnEnablement || checkEnabledState(setting.sound, () => this.screenReaderAttached.read(reader), arg.userGesture)) {
							return true;
						}
					}
					if (arg.modality === 'announcement' || arg.modality === undefined) {
						if (checkEnabledState(setting.announcement, () => this.screenReaderAttached.read(reader), arg.userGesture)) {
							return true;
						}
					}
					return false;
				}).recomputeInitiallyAndOnChange(this._store);
			}
		);
	}

	public getEnabledState(signal: AccessibilitySignal, userGesture: boolean, modality?: AccessibilityModality | undefined): IValueWithChangeEvent<boolean> {
		return new ValueWithChangeEventFromObservable(this._signalEnabledState.get({ signal, userGesture, modality }));
	}

	public async playSignal(signal: AccessibilitySignal, options: IAccessbilitySignalOptions = {}): Promise<void> {
		const shouldPlayAnnouncement = options.modality === 'announcement' || options.modality === undefined;
		const announcementMessage = options.customAlertMessage ?? signal.announcementMessage;
		if (shouldPlayAnnouncement && this.isAnnouncementEnabled(signal, options.userGesture) && announcementMessage) {
			this.accessibilityService.status(announcementMessage);
		}

		const shouldPlaySound = options.modality === 'sound' || options.modality === undefined;
		if (shouldPlaySound && this.isSoundEnabled(signal, options.userGesture)) {
			this.sendSignalTelemetry(signal, options.source);
			await this.playSound(signal.sound.getSound(), options.allowManyInParallel);
		}
	}

	public async playSignals(signals: (AccessibilitySignal | { signal: AccessibilitySignal; source: string })[]): Promise<void> {
		for (const signal of signals) {
			this.sendSignalTelemetry('signal' in signal ? signal.signal : signal, 'source' in signal ? signal.source : undefined);
		}
		const signalArray = signals.map(s => 'signal' in s ? s.signal : s);
		const announcements = signalArray.filter(signal => this.isAnnouncementEnabled(signal)).map(s => s.announcementMessage);
		if (announcements.length) {
			this.accessibilityService.status(announcements.join(', '));
		}

		// Some sounds are reused. Don't play the same sound twice.
		const sounds = new Set(signalArray.filter(signal => this.isSoundEnabled(signal)).map(signal => signal.sound.getSound()));
		await Promise.all(Array.from(sounds).map(sound => this.playSound(sound, true)));

	}


	private sendSignalTelemetry(signal: AccessibilitySignal, source: string | undefined): void {
		const isScreenReaderOptimized = this.accessibilityService.isScreenReaderOptimized();
		const key = signal.name + (source ? `::${source}` : '') + (isScreenReaderOptimized ? '{screenReaderOptimized}' : '');
		// Only send once per user session
		if (this.sentTelemetry.has(key) || this.getVolumeInPercent() === 0) {
			return;
		}
		this.sentTelemetry.add(key);

		this.telemetryService.publicLog2<{
			signal: string;
			source: string;
			isScreenReaderOptimized: boolean;
		}, {
			owner: 'hediet';

			signal: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The signal that was played.' };
			source: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The source that triggered the signal (e.g. "diffEditorNavigation").' };
			isScreenReaderOptimized: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the user is using a screen reader' };

			comment: 'This data is collected to understand how signals are used and if more signals should be added.';
		}>('signal.played', {
			signal: signal.name,
			source: source ?? '',
			isScreenReaderOptimized,
		});
	}

	private getVolumeInPercent(): number {
		const volume = this.configurationService.getValue<number>('accessibility.signalOptions.volume');
		if (typeof volume !== 'number') {
			return 50;
		}

		return Math.max(Math.min(volume, 100), 0);
	}

	private readonly playingSounds;

	public async playSound(sound: Sound, allowManyInParallel = false): Promise<void> {
		if (!allowManyInParallel && this.playingSounds.has(sound)) {
			return;
		}
		this.playingSounds.add(sound);
		const url = FileAccess.asBrowserUri(`vs/platform/accessibilitySignal/browser/media/${sound.fileName}`).toString(true);

		try {
			const sound = this.sounds.get(url);
			if (sound) {
				sound.volume = this.getVolumeInPercent() / 100;
				sound.currentTime = 0;
				await sound.play();
			} else {
				const playedSound = await playAudio(url, this.getVolumeInPercent() / 100);
				this.sounds.set(url, playedSound);
			}
		} catch (e) {
			if (!e.message.includes('play() can only be initiated by a user gesture')) {
				// tracking this issue in #178642, no need to spam the console
				console.error('Error while playing sound', e);
			}
		} finally {
			this.playingSounds.delete(sound);
		}
	}

	public playSignalLoop(signal: AccessibilitySignal, milliseconds: number): IDisposable {
		let playing = true;
		const playSound = () => {
			if (playing) {
				this.playSignal(signal, { allowManyInParallel: true }).finally(() => {
					setTimeout(() => {
						if (playing) {
							playSound();
						}
					}, milliseconds);
				});
			}
		};
		playSound();
		return toDisposable(() => playing = false);
	}

	private readonly _signalConfigValue;

	private readonly _signalEnabledState;

	public isAnnouncementEnabled(signal: AccessibilitySignal, userGesture?: boolean): boolean {
		if (!signal.announcementMessage) {
			return false;
		}
		return this._signalEnabledState.get({ signal, userGesture: !!userGesture, modality: 'announcement' }).get();
	}

	public isSoundEnabled(signal: AccessibilitySignal, userGesture?: boolean): boolean {
		return this._signalEnabledState.get({ signal, userGesture: !!userGesture, modality: 'sound' }).get();
	}

	public onSoundEnabledChanged(signal: AccessibilitySignal): Event<void> {
		return this.getEnabledState(signal, false).onDidChange;
	}

	public getDelayMs(signal: AccessibilitySignal, modality: AccessibilityModality, mode: 'line' | 'positional'): number {
		if (!this.configurationService.getValue('accessibility.signalOptions.debouncePositionChanges')) {
			return 0;
		}
		let value: { sound: number; announcement: number };
		if (signal.name === AccessibilitySignal.errorAtPosition.name && mode === 'positional') {
			value = this.configurationService.getValue('accessibility.signalOptions.experimental.delays.errorAtPosition');
		} else if (signal.name === AccessibilitySignal.warningAtPosition.name && mode === 'positional') {
			value = this.configurationService.getValue('accessibility.signalOptions.experimental.delays.warningAtPosition');
		} else {
			value = this.configurationService.getValue('accessibility.signalOptions.experimental.delays.general');
		}
		return modality === 'sound' ? value.sound : value.announcement;
	}
}

type EnabledState = 'on' | 'off' | 'auto' | 'userGesture' | 'always' | 'never';
function checkEnabledState(state: EnabledState, getScreenReaderAttached: () => boolean, isTriggeredByUserGesture: boolean): boolean {
	return state === 'on' || state === 'always' || (state === 'auto' && getScreenReaderAttached()) || state === 'userGesture' && isTriggeredByUserGesture;
}

/**
 * Play the given audio url.
 * @volume value between 0 and 1
 */
async function playAudio(url: string, volume: number): Promise<HTMLAudioElement> {
	const disposables = new DisposableStore();
	try {
		return await doPlayAudio(url, volume, disposables);
	} finally {
		disposables.dispose();
	}
}

function doPlayAudio(url: string, volume: number, disposables: DisposableStore): Promise<HTMLAudioElement> {
	return new Promise<HTMLAudioElement>((resolve, reject) => {
		const audio = new Audio(url);
		audio.volume = volume;
		disposables.add(addDisposableListener(audio, 'ended', () => {
			resolve(audio);
		}));
		disposables.add(addDisposableListener(audio, 'error', (e) => {
			// When the error event fires, ended might not be called
			reject(e.error);
		}));
		audio.play().catch(e => {
			// When play fails, the error event is not fired.
			reject(e);
		});
	});
}

/**
 * Corresponds to the audio files in ./media.
*/
export class Sound {
	private static register(options: { fileName: string }): Sound {
		const sound = new Sound(options.fileName);
		return sound;
	}

	public static readonly error = Sound.register({ fileName: 'error.mp3' });
	public static readonly warning = Sound.register({ fileName: 'warning.mp3' });
	public static readonly success = Sound.register({ fileName: 'success.mp3' });
	public static readonly foldedArea = Sound.register({ fileName: 'foldedAreas.mp3' });
	public static readonly break = Sound.register({ fileName: 'break.mp3' });
	public static readonly quickFixes = Sound.register({ fileName: 'quickFixes.mp3' });
	public static readonly taskCompleted = Sound.register({ fileName: 'taskCompleted.mp3' });
	public static readonly taskFailed = Sound.register({ fileName: 'taskFailed.mp3' });
	public static readonly terminalBell = Sound.register({ fileName: 'terminalBell.mp3' });
	public static readonly diffLineInserted = Sound.register({ fileName: 'diffLineInserted.mp3' });
	public static readonly diffLineDeleted = Sound.register({ fileName: 'diffLineDeleted.mp3' });
	public static readonly diffLineModified = Sound.register({ fileName: 'diffLineModified.mp3' });
	public static readonly requestSent = Sound.register({ fileName: 'requestSent.mp3' });
	public static readonly responseReceived1 = Sound.register({ fileName: 'responseReceived1.mp3' });
	public static readonly responseReceived2 = Sound.register({ fileName: 'responseReceived2.mp3' });
	public static readonly responseReceived3 = Sound.register({ fileName: 'responseReceived3.mp3' });
	public static readonly responseReceived4 = Sound.register({ fileName: 'responseReceived4.mp3' });
	public static readonly clear = Sound.register({ fileName: 'clear.mp3' });
	public static readonly save = Sound.register({ fileName: 'save.mp3' });
	public static readonly format = Sound.register({ fileName: 'format.mp3' });
	public static readonly voiceRecordingStarted = Sound.register({ fileName: 'voiceRecordingStarted.mp3' });
	public static readonly voiceRecordingStopped = Sound.register({ fileName: 'voiceRecordingStopped.mp3' });
	public static readonly progress = Sound.register({ fileName: 'progress.mp3' });
	public static readonly chatEditModifiedFile = Sound.register({ fileName: 'chatEditModifiedFile.mp3' });
	public static readonly editsKept = Sound.register({ fileName: 'editsKept.mp3' });
	public static readonly editsUndone = Sound.register({ fileName: 'editsUndone.mp3' });
	public static readonly nextEditSuggestion = Sound.register({ fileName: 'nextEditSuggestion.mp3' });
	public static readonly terminalCommandSucceeded = Sound.register({ fileName: 'terminalCommandSucceeded.mp3' });
	public static readonly chatUserActionRequired = Sound.register({ fileName: 'chatUserActionRequired.mp3' });
	public static readonly codeActionTriggered = Sound.register({ fileName: 'codeActionTriggered.mp3' });
	public static readonly codeActionApplied = Sound.register({ fileName: 'codeActionApplied.mp3' });

	private constructor(public readonly fileName: string) { }
}

export class SoundSource {
	constructor(
		public readonly randomOneOf: Sound[]
	) { }

	public getSound(deterministic = false): Sound {
		if (deterministic || this.randomOneOf.length === 1) {
			return this.randomOneOf[0];
		} else {
			const index = Math.floor(Math.random() * this.randomOneOf.length);
			return this.randomOneOf[index];
		}
	}
}

export class AccessibilitySignal {
	private constructor(
		public readonly sound: SoundSource,
		public readonly name: string,
		public readonly legacySoundSettingsKey: string | undefined,
		public readonly settingsKey: string,
		public readonly legacyAnnouncementSettingsKey: string | undefined,
		public readonly announcementMessage: string | undefined,
		public readonly managesOwnEnablement: boolean = false
	) { }

	private static _signals = new Set<AccessibilitySignal>();
	private static register(options: {
		name: string;
		sound: Sound | {
			/**
			 * Gaming and other apps often play a sound variant when the same event happens again
			 * for an improved experience. This option enables playing a random sound.
			 */
			randomOneOf: Sound[];
		};
		legacySoundSettingsKey?: string;
		settingsKey: string;
		legacyAnnouncementSettingsKey?: string;
		announcementMessage?: string;
		delaySettingsKey?: string;
		managesOwnEnablement?: boolean;
	}): AccessibilitySignal {
		const soundSource = new SoundSource('randomOneOf' in options.sound ? options.sound.randomOneOf : [options.sound]);
		const signal = new AccessibilitySignal(
			soundSource,
			options.name,
			options.legacySoundSettingsKey,
			options.settingsKey,
			options.legacyAnnouncementSettingsKey,
			options.announcementMessage,
			options.managesOwnEnablement
		);
		AccessibilitySignal._signals.add(signal);
		return signal;
	}

	public static get allAccessibilitySignals() {
		return [...this._signals];
	}

	public static readonly errorAtPosition = AccessibilitySignal.register({
		name: localize('accessibilitySignals.positionHasError.name', 'Error at Position'),
		sound: Sound.error,
		announcementMessage: localize('accessibility.signals.positionHasError', 'Error'),
		settingsKey: 'accessibility.signals.positionHasError',
		delaySettingsKey: 'accessibility.signalOptions.delays.errorAtPosition'
	});
	public static readonly warningAtPosition = AccessibilitySignal.register({
		name: localize('accessibilitySignals.positionHasWarning.name', 'Warning at Position'),
		sound: Sound.warning,
		announcementMessage: localize('accessibility.signals.positionHasWarning', 'Warning'),
		settingsKey: 'accessibility.signals.positionHasWarning',
		delaySettingsKey: 'accessibility.signalOptions.delays.warningAtPosition'
	});

	public static readonly errorOnLine = AccessibilitySignal.register({
		name: localize('accessibilitySignals.lineHasError.name', 'Error on Line'),
		sound: Sound.error,
		legacySoundSettingsKey: 'audioCues.lineHasError',
		legacyAnnouncementSettingsKey: 'accessibility.alert.error',
		announcementMessage: localize('accessibility.signals.lineHasError', 'Error on Line'),
		settingsKey: 'accessibility.signals.lineHasError',
	});

	public static readonly warningOnLine = AccessibilitySignal.register({
		name: localize('accessibilitySignals.lineHasWarning.name', 'Warning on Line'),
		sound: Sound.warning,
		legacySoundSettingsKey: 'audioCues.lineHasWarning',
		legacyAnnouncementSettingsKey: 'accessibility.alert.warning',
		announcementMessage: localize('accessibility.signals.lineHasWarning', 'Warning on Line'),
		settingsKey: 'accessibility.signals.lineHasWarning',
	});
	public static readonly foldedArea = AccessibilitySignal.register({
		name: localize('accessibilitySignals.lineHasFoldedArea.name', 'Folded Area on Line'),
		sound: Sound.foldedArea,
		legacySoundSettingsKey: 'audioCues.lineHasFoldedArea',
		legacyAnnouncementSettingsKey: 'accessibility.alert.foldedArea',
		announcementMessage: localize('accessibility.signals.lineHasFoldedArea', 'Folded'),
		settingsKey: 'accessibility.signals.lineHasFoldedArea',
	});
	public static readonly break = AccessibilitySignal.register({
		name: localize('accessibilitySignals.lineHasBreakpoint.name', 'Breakpoint on Line'),
		sound: Sound.break,
		legacySoundSettingsKey: 'audioCues.lineHasBreakpoint',
		legacyAnnouncementSettingsKey: 'accessibility.alert.breakpoint',
		announcementMessage: localize('accessibility.signals.lineHasBreakpoint', 'Breakpoint'),
		settingsKey: 'accessibility.signals.lineHasBreakpoint',
	});
	public static readonly inlineSuggestion = AccessibilitySignal.register({
		name: localize('accessibilitySignals.lineHasInlineSuggestion.name', 'Inline Suggestion on Line'),
		sound: Sound.quickFixes,
		legacySoundSettingsKey: 'audioCues.lineHasInlineSuggestion',
		settingsKey: 'accessibility.signals.lineHasInlineSuggestion',
	});
	public static readonly nextEditSuggestion = AccessibilitySignal.register({
		name: localize('accessibilitySignals.nextEditSuggestion.name', 'Next Edit Suggestion on Line'),
		sound: Sound.nextEditSuggestion,
		legacySoundSettingsKey: 'audioCues.nextEditSuggestion',
		settingsKey: 'accessibility.signals.nextEditSuggestion',
		announcementMessage: localize('accessibility.signals.nextEditSuggestion', 'Next Edit Suggestion'),
	});
	public static readonly terminalQuickFix = AccessibilitySignal.register({
		name: localize('accessibilitySignals.terminalQuickFix.name', 'Terminal Quick Fix'),
		sound: Sound.quickFixes,
		legacySoundSettingsKey: 'audioCues.terminalQuickFix',
		legacyAnnouncementSettingsKey: 'accessibility.alert.terminalQuickFix',
		announcementMessage: localize('accessibility.signals.terminalQuickFix', 'Quick Fix'),
		settingsKey: 'accessibility.signals.terminalQuickFix',
	});

	public static readonly onDebugBreak = AccessibilitySignal.register({
		name: localize('accessibilitySignals.onDebugBreak.name', 'Debugger Stopped on Breakpoint'),
		sound: Sound.break,
		legacySoundSettingsKey: 'audioCues.onDebugBreak',
		legacyAnnouncementSettingsKey: 'accessibility.alert.onDebugBreak',
		announcementMessage: localize('accessibility.signals.onDebugBreak', 'Breakpoint'),
		settingsKey: 'accessibility.signals.onDebugBreak',
	});

	public static readonly noInlayHints = AccessibilitySignal.register({
		name: localize('accessibilitySignals.noInlayHints', 'No Inlay Hints on Line'),
		sound: Sound.error,
		legacySoundSettingsKey: 'audioCues.noInlayHints',
		legacyAnnouncementSettingsKey: 'accessibility.alert.noInlayHints',
		announcementMessage: localize('accessibility.signals.noInlayHints', 'No Inlay Hints'),
		settingsKey: 'accessibility.signals.noInlayHints',
	});

	public static readonly taskCompleted = AccessibilitySignal.register({
		name: localize('accessibilitySignals.taskCompleted', 'Task Completed'),
		sound: Sound.taskCompleted,
		legacySoundSettingsKey: 'audioCues.taskCompleted',
		legacyAnnouncementSettingsKey: 'accessibility.alert.taskCompleted',
		announcementMessage: localize('accessibility.signals.taskCompleted', 'Task Completed'),
		settingsKey: 'accessibility.signals.taskCompleted',
	});

	public static readonly taskFailed = AccessibilitySignal.register({
		name: localize('accessibilitySignals.taskFailed', 'Task Failed'),
		sound: Sound.taskFailed,
		legacySoundSettingsKey: 'audioCues.taskFailed',
		legacyAnnouncementSettingsKey: 'accessibility.alert.taskFailed',
		announcementMessage: localize('accessibility.signals.taskFailed', 'Task Failed'),
		settingsKey: 'accessibility.signals.taskFailed',
	});

	public static readonly terminalCommandFailed = AccessibilitySignal.register({
		name: localize('accessibilitySignals.terminalCommandFailed', 'Terminal Command Failed'),
		sound: Sound.error,
		legacySoundSettingsKey: 'audioCues.terminalCommandFailed',
		legacyAnnouncementSettingsKey: 'accessibility.alert.terminalCommandFailed',
		announcementMessage: localize('accessibility.signals.terminalCommandFailed', 'Command Failed'),
		settingsKey: 'accessibility.signals.terminalCommandFailed',
	});

	public static readonly terminalCommandSucceeded = AccessibilitySignal.register({
		name: localize('accessibilitySignals.terminalCommandSucceeded', 'Terminal Command Succeeded'),
		sound: Sound.terminalCommandSucceeded,
		announcementMessage: localize('accessibility.signals.terminalCommandSucceeded', 'Command Succeeded'),
		settingsKey: 'accessibility.signals.terminalCommandSucceeded',
	});

	public static readonly terminalBell = AccessibilitySignal.register({
		name: localize('accessibilitySignals.terminalBell', 'Terminal Bell'),
		sound: Sound.terminalBell,
		legacySoundSettingsKey: 'audioCues.terminalBell',
		legacyAnnouncementSettingsKey: 'accessibility.alert.terminalBell',
		announcementMessage: localize('accessibility.signals.terminalBell', 'Terminal Bell'),
		settingsKey: 'accessibility.signals.terminalBell',
	});

	public static readonly notebookCellCompleted = AccessibilitySignal.register({
		name: localize('accessibilitySignals.notebookCellCompleted', 'Notebook Cell Completed'),
		sound: Sound.taskCompleted,
		legacySoundSettingsKey: 'audioCues.notebookCellCompleted',
		legacyAnnouncementSettingsKey: 'accessibility.alert.notebookCellCompleted',
		announcementMessage: localize('accessibility.signals.notebookCellCompleted', 'Notebook Cell Completed'),
		settingsKey: 'accessibility.signals.notebookCellCompleted',
	});

	public static readonly notebookCellFailed = AccessibilitySignal.register({
		name: localize('accessibilitySignals.notebookCellFailed', 'Notebook Cell Failed'),
		sound: Sound.taskFailed,
		legacySoundSettingsKey: 'audioCues.notebookCellFailed',
		legacyAnnouncementSettingsKey: 'accessibility.alert.notebookCellFailed',
		announcementMessage: localize('accessibility.signals.notebookCellFailed', 'Notebook Cell Failed'),
		settingsKey: 'accessibility.signals.notebookCellFailed',
	});

	public static readonly diffLineInserted = AccessibilitySignal.register({
		name: localize('accessibilitySignals.diffLineInserted', 'Diff Line Inserted'),
		sound: Sound.diffLineInserted,
		legacySoundSettingsKey: 'audioCues.diffLineInserted',
		settingsKey: 'accessibility.signals.diffLineInserted',
	});

	public static readonly diffLineDeleted = AccessibilitySignal.register({
		name: localize('accessibilitySignals.diffLineDeleted', 'Diff Line Deleted'),
		sound: Sound.diffLineDeleted,
		legacySoundSettingsKey: 'audioCues.diffLineDeleted',
		settingsKey: 'accessibility.signals.diffLineDeleted',
	});

	public static readonly diffLineModified = AccessibilitySignal.register({
		name: localize('accessibilitySignals.diffLineModified', 'Diff Line Modified'),
		sound: Sound.diffLineModified,
		legacySoundSettingsKey: 'audioCues.diffLineModified',
		settingsKey: 'accessibility.signals.diffLineModified',
	});

	public static readonly chatEditModifiedFile = AccessibilitySignal.register({
		name: localize('accessibilitySignals.chatEditModifiedFile', 'Chat Edit Modified File'),
		sound: Sound.chatEditModifiedFile,
		announcementMessage: localize('accessibility.signals.chatEditModifiedFile', 'File Modified from Chat Edits'),
		settingsKey: 'accessibility.signals.chatEditModifiedFile',
	});

	public static readonly chatRequestSent = AccessibilitySignal.register({
		name: localize('accessibilitySignals.chatRequestSent', 'Chat Request Sent'),
		sound: Sound.requestSent,
		legacySoundSettingsKey: 'audioCues.chatRequestSent',
		legacyAnnouncementSettingsKey: 'accessibility.alert.chatRequestSent',
		announcementMessage: localize('accessibility.signals.chatRequestSent', 'Chat Request Sent'),
		settingsKey: 'accessibility.signals.chatRequestSent',
	});

	public static readonly chatResponseReceived = AccessibilitySignal.register({
		name: localize('accessibilitySignals.chatResponseReceived', 'Chat Response Received'),
		legacySoundSettingsKey: 'audioCues.chatResponseReceived',
		sound: {
			randomOneOf: [
				Sound.responseReceived1,
				Sound.responseReceived2,
				Sound.responseReceived3,
				Sound.responseReceived4
			]
		},
		settingsKey: 'accessibility.signals.chatResponseReceived'
	});

	public static readonly codeActionTriggered = AccessibilitySignal.register({
		name: localize('accessibilitySignals.codeActionRequestTriggered', 'Code Action Request Triggered'),
		sound: Sound.codeActionTriggered,
		legacySoundSettingsKey: 'audioCues.codeActionRequestTriggered',
		legacyAnnouncementSettingsKey: 'accessibility.alert.codeActionRequestTriggered',
		announcementMessage: localize('accessibility.signals.codeActionRequestTriggered', 'Code Action Request Triggered'),
		settingsKey: 'accessibility.signals.codeActionTriggered',
	});

	public static readonly codeActionApplied = AccessibilitySignal.register({
		name: localize('accessibilitySignals.codeActionApplied', 'Code Action Applied'),
		legacySoundSettingsKey: 'audioCues.codeActionApplied',
		sound: Sound.codeActionApplied,
		settingsKey: 'accessibility.signals.codeActionApplied'
	});


	public static readonly progress = AccessibilitySignal.register({
		name: localize('accessibilitySignals.progress', 'Progress'),
		sound: Sound.progress,
		legacySoundSettingsKey: 'audioCues.chatResponsePending',
		legacyAnnouncementSettingsKey: 'accessibility.alert.progress',
		announcementMessage: localize('accessibility.signals.progress', 'Progress'),
		settingsKey: 'accessibility.signals.progress'
	});

	public static readonly clear = AccessibilitySignal.register({
		name: localize('accessibilitySignals.clear', 'Clear'),
		sound: Sound.clear,
		legacySoundSettingsKey: 'audioCues.clear',
		legacyAnnouncementSettingsKey: 'accessibility.alert.clear',
		announcementMessage: localize('accessibility.signals.clear', 'Clear'),
		settingsKey: 'accessibility.signals.clear'
	});

	public static readonly save = AccessibilitySignal.register({
		name: localize('accessibilitySignals.save', 'Save'),
		sound: Sound.save,
		legacySoundSettingsKey: 'audioCues.save',
		legacyAnnouncementSettingsKey: 'accessibility.alert.save',
		announcementMessage: localize('accessibility.signals.save', 'Save'),
		settingsKey: 'accessibility.signals.save'
	});

	public static readonly format = AccessibilitySignal.register({
		name: localize('accessibilitySignals.format', 'Format'),
		sound: Sound.format,
		legacySoundSettingsKey: 'audioCues.format',
		legacyAnnouncementSettingsKey: 'accessibility.alert.format',
		announcementMessage: localize('accessibility.signals.format', 'Format'),
		settingsKey: 'accessibility.signals.format'
	});

	public static readonly voiceRecordingStarted = AccessibilitySignal.register({
		name: localize('accessibilitySignals.voiceRecordingStarted', 'Voice Recording Started'),
		sound: Sound.voiceRecordingStarted,
		legacySoundSettingsKey: 'audioCues.voiceRecordingStarted',
		settingsKey: 'accessibility.signals.voiceRecordingStarted'
	});

	public static readonly voiceRecordingStopped = AccessibilitySignal.register({
		name: localize('accessibilitySignals.voiceRecordingStopped', 'Voice Recording Stopped'),
		sound: Sound.voiceRecordingStopped,
		legacySoundSettingsKey: 'audioCues.voiceRecordingStopped',
		settingsKey: 'accessibility.signals.voiceRecordingStopped'
	});

	public static readonly editsKept = AccessibilitySignal.register({
		name: localize('accessibilitySignals.editsKept', 'Edits Kept'),
		sound: Sound.editsKept,
		announcementMessage: localize('accessibility.signals.editsKept', 'Edits Kept'),
		settingsKey: 'accessibility.signals.editsKept',
	});

	public static readonly editsUndone = AccessibilitySignal.register({
		name: localize('accessibilitySignals.editsUndone', 'Undo Edits'),
		sound: Sound.editsUndone,
		announcementMessage: localize('accessibility.signals.editsUndone', 'Edits Undone'),
		settingsKey: 'accessibility.signals.editsUndone',
	});

	public static readonly chatUserActionRequired = AccessibilitySignal.register({
		name: localize('accessibilitySignals.chatUserActionRequired', 'Chat User Action Required'),
		sound: Sound.chatUserActionRequired,
		announcementMessage: localize('accessibility.signals.chatUserActionRequired', 'Chat User Action Required'),
		settingsKey: 'accessibility.signals.chatUserActionRequired',
		managesOwnEnablement: true
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/accessibilitySignal/browser/progressAccessibilitySignalScheduler.ts]---
Location: vscode-main/src/vs/platform/accessibilitySignal/browser/progressAccessibilitySignalScheduler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RunOnceScheduler } from '../../../base/common/async.js';
import { Disposable, IDisposable } from '../../../base/common/lifecycle.js';
import { AccessibilitySignal, IAccessibilitySignalService } from './accessibilitySignalService.js';

const PROGRESS_SIGNAL_LOOP_DELAY = 5000;

/**
 * Schedules a signal to play while progress is happening.
 */
export class AccessibilityProgressSignalScheduler extends Disposable {
	private _scheduler: RunOnceScheduler;
	private _signalLoop: IDisposable | undefined;
	constructor(msDelayTime: number, msLoopTime: number | undefined, @IAccessibilitySignalService private readonly _accessibilitySignalService: IAccessibilitySignalService) {
		super();
		this._scheduler = this._register(new RunOnceScheduler(() => {
			this._signalLoop = this._accessibilitySignalService.playSignalLoop(AccessibilitySignal.progress, msLoopTime ?? PROGRESS_SIGNAL_LOOP_DELAY);
		}, msDelayTime));
		this._scheduler.schedule();
	}
	override dispose(): void {
		super.dispose();
		this._signalLoop?.dispose();
		this._scheduler.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/action/common/action.ts]---
Location: vscode-main/src/vs/platform/action/common/action.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI, UriDto } from '../../../base/common/uri.js';
import { ContextKeyExpression } from '../../contextkey/common/contextkey.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { Categories } from './actionCommonCategories.js';
import { ICommandMetadata } from '../../commands/common/commands.js';

export interface ILocalizedString {

	/**
	 * The localized value of the string.
	 */
	value: string;

	/**
	 * The original (non localized value of the string)
	 */
	original: string;
}

export function isLocalizedString(thing: unknown): thing is ILocalizedString {
	return !!thing
		&& typeof thing === 'object'
		&& typeof (thing as ILocalizedString).original === 'string'
		&& typeof (thing as ILocalizedString).value === 'string';
}

export interface ICommandActionTitle extends ILocalizedString {

	/**
	 * The title with a mnemonic designation. && precedes the mnemonic.
	 */
	mnemonicTitle?: string;
}

export type Icon = { dark?: URI; light?: URI } | ThemeIcon;

export interface ICommandActionToggleInfo {

	/**
	 * The condition that marks the action as toggled.
	 */
	condition: ContextKeyExpression;

	icon?: Icon;

	tooltip?: string;

	/**
	 * The title that goes well with a a check mark, e.g "(check) Line Numbers" vs "Toggle Line Numbers"
	 */
	title?: string;

	/**
	 * Like title but with a mnemonic designation.
	 */
	mnemonicTitle?: string;
}

export function isICommandActionToggleInfo(thing: ContextKeyExpression | ICommandActionToggleInfo | undefined): thing is ICommandActionToggleInfo {
	return thing ? (<ICommandActionToggleInfo>thing).condition !== undefined : false;
}

export interface ICommandActionSource {
	readonly id: string;
	readonly title: string;
}

export interface ICommandAction {
	id: string;
	title: string | ICommandActionTitle;
	shortTitle?: string | ICommandActionTitle;
	/**
	 * Metadata about this command, used for:
	 * - API commands
	 * - when showing keybindings that have no other UX
	 * - when searching for commands in the Command Palette
	 */
	metadata?: ICommandMetadata;
	category?: keyof typeof Categories | ILocalizedString | string;
	tooltip?: string | ILocalizedString;
	icon?: Icon;
	source?: ICommandActionSource;
	/**
	 * Precondition controls enablement (for example for a menu item, show
	 * it in grey or for a command, do not allow to invoke it)
	 */
	precondition?: ContextKeyExpression;

	/**
	 * The action is a toggle action. Define the context key expression that reflects its toggle-state
	 * or define toggle-info including an icon and a title that goes well with a checkmark.
	 */
	toggled?: ContextKeyExpression | ICommandActionToggleInfo;
}

export type ISerializableCommandAction = UriDto<ICommandAction>;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/action/common/actionCommonCategories.ts]---
Location: vscode-main/src/vs/platform/action/common/actionCommonCategories.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize2 } from '../../../nls.js';

export const Categories = Object.freeze({
	View: localize2('view', 'View'),
	Help: localize2('help', 'Help'),
	Test: localize2('test', 'Test'),
	File: localize2('file', 'File'),
	Preferences: localize2('preferences', 'Preferences'),
	Developer: localize2({ key: 'developer', comment: ['A developer on Code itself or someone diagnosing issues in Code'] }, "Developer"),
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/actions/browser/actionViewItemService.ts]---
Location: vscode-main/src/vs/platform/actions/browser/actionViewItemService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IActionViewItem } from '../../../base/browser/ui/actionbar/actionbar.js';
import { IActionViewItemOptions } from '../../../base/browser/ui/actionbar/actionViewItems.js';
import { IAction } from '../../../base/common/actions.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { InstantiationType, registerSingleton } from '../../instantiation/common/extensions.js';
import { createDecorator, IInstantiationService } from '../../instantiation/common/instantiation.js';
import { MenuId } from '../common/actions.js';


export const IActionViewItemService = createDecorator<IActionViewItemService>('IActionViewItemService');


export interface IActionViewItemFactory {
	(action: IAction, options: IActionViewItemOptions, instantiationService: IInstantiationService, windowId: number): IActionViewItem | undefined;
}

export interface IActionViewItemService {

	_serviceBrand: undefined;

	readonly onDidChange: Event<MenuId>;

	register(menu: MenuId, submenu: MenuId, provider: IActionViewItemFactory, event?: Event<unknown>): IDisposable;
	register(menu: MenuId, commandId: string, provider: IActionViewItemFactory, event?: Event<unknown>): IDisposable;

	lookUp(menu: MenuId, submenu: MenuId): IActionViewItemFactory | undefined;
	lookUp(menu: MenuId, commandId: string): IActionViewItemFactory | undefined;
}

export class NullActionViewItemService implements IActionViewItemService {
	_serviceBrand: undefined;

	readonly onDidChange: Event<MenuId> = Event.None;

	register(menu: MenuId, commandId: string | MenuId, provider: IActionViewItemFactory, event?: Event<unknown>): IDisposable {
		return Disposable.None;
	}

	lookUp(menu: MenuId, commandId: string | MenuId): IActionViewItemFactory | undefined {
		return undefined;
	}
}

class ActionViewItemService implements IActionViewItemService {

	declare _serviceBrand: undefined;

	private readonly _providers = new Map<string, IActionViewItemFactory>();

	private readonly _onDidChange = new Emitter<MenuId>();
	readonly onDidChange: Event<MenuId> = this._onDidChange.event;

	dispose(): void {
		this._onDidChange.dispose();
	}

	register(menu: MenuId, commandOrSubmenuId: string | MenuId, provider: IActionViewItemFactory, event?: Event<unknown>): IDisposable {
		const id = this._makeKey(menu, commandOrSubmenuId);
		if (this._providers.has(id)) {
			throw new Error(`A provider for the command ${commandOrSubmenuId} and menu ${menu} is already registered.`);
		}
		this._providers.set(id, provider);

		const listener = event?.(() => {
			this._onDidChange.fire(menu);
		});

		return toDisposable(() => {
			listener?.dispose();
			this._providers.delete(id);
		});
	}

	lookUp(menu: MenuId, commandOrMenuId: string | MenuId): IActionViewItemFactory | undefined {
		return this._providers.get(this._makeKey(menu, commandOrMenuId));
	}

	private _makeKey(menu: MenuId, commandOrMenuId: string | MenuId) {
		return `${menu.id}/${(commandOrMenuId instanceof MenuId ? commandOrMenuId.id : commandOrMenuId)}`;
	}
}

registerSingleton(IActionViewItemService, ActionViewItemService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/actions/browser/actionWidgetDropdownActionViewItem.ts]---
Location: vscode-main/src/vs/platform/actions/browser/actionWidgetDropdownActionViewItem.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, append } from '../../../base/browser/dom.js';
import { BaseActionViewItem } from '../../../base/browser/ui/actionbar/actionViewItems.js';
import { ILabelRenderer } from '../../../base/browser/ui/dropdown/dropdown.js';
import { getBaseLayerHoverDelegate } from '../../../base/browser/ui/hover/hoverDelegate2.js';
import { getDefaultHoverDelegate } from '../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { IAction } from '../../../base/common/actions.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { IActionWidgetService } from '../../actionWidget/browser/actionWidget.js';
import { ActionWidgetDropdown, IActionWidgetDropdownOptions } from '../../actionWidget/browser/actionWidgetDropdown.js';
import { IContextKeyService } from '../../contextkey/common/contextkey.js';
import { IKeybindingService } from '../../keybinding/common/keybinding.js';

/**
 * Action view item for the custom action widget dropdown widget.
 * Very closely based off of `DropdownMenuActionViewItem`, would be good to have some code re-use in the future
 */
export class ActionWidgetDropdownActionViewItem extends BaseActionViewItem {
	private actionWidgetDropdown: ActionWidgetDropdown | undefined;
	private actionItem: HTMLElement | null = null;
	constructor(
		action: IAction,
		private readonly actionWidgetOptions: Omit<IActionWidgetDropdownOptions, 'label' | 'labelRenderer'>,
		@IActionWidgetService private readonly _actionWidgetService: IActionWidgetService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
	) {
		super(undefined, action);
	}

	override render(container: HTMLElement): void {
		this.actionItem = container;

		const labelRenderer: ILabelRenderer = (el: HTMLElement): IDisposable | null => {
			this.element = append(el, $('a.action-label'));
			return this.renderLabel(this.element);
		};

		this.actionWidgetDropdown = this._register(new ActionWidgetDropdown(container, { ...this.actionWidgetOptions, labelRenderer }, this._actionWidgetService, this._keybindingService));
		this._register(this.actionWidgetDropdown.onDidChangeVisibility(visible => {
			this.element?.setAttribute('aria-expanded', `${visible}`);
		}));

		this.updateTooltip();
		this.updateEnabled();
	}

	protected renderLabel(element: HTMLElement): IDisposable | null {
		// todo@aeschli: remove codicon, should come through `this.options.classNames`
		element.classList.add('codicon');

		if (this._action.label) {
			this._register(getBaseLayerHoverDelegate().setupManagedHover(this.options.hoverDelegate ?? getDefaultHoverDelegate('mouse'), element, this._action.label));
		}

		return null;
	}

	protected override updateAriaLabel(): void {
		if (this.element) {
			this.setAriaLabelAttributes(this.element);
		}
	}

	protected setAriaLabelAttributes(element: HTMLElement): void {
		element.setAttribute('role', 'button');
		element.setAttribute('aria-haspopup', 'true');
		element.setAttribute('aria-expanded', 'false');
		element.ariaLabel = (this.getTooltip() + ' - ' + (element.textContent || this._action.label)) || '';
	}

	protected override getTooltip() {
		const keybinding = this._keybindingService.lookupKeybinding(this.action.id, this._contextKeyService);
		const keybindingLabel = keybinding && keybinding.getLabel();

		const tooltip = this.action.tooltip ?? this.action.label;
		return keybindingLabel
			? `${tooltip} (${keybindingLabel})`
			: tooltip;
	}

	show(): void {
		this.actionWidgetDropdown?.show();
	}

	protected override updateEnabled(): void {
		const disabled = !this.action.enabled;
		this.actionItem?.classList.toggle('disabled', disabled);
		this.element?.classList.toggle('disabled', disabled);
		this.actionWidgetDropdown?.setEnabled(!disabled);
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/actions/browser/buttonbar.ts]---
Location: vscode-main/src/vs/platform/actions/browser/buttonbar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ButtonBar, IButton } from '../../../base/browser/ui/button/button.js';
import { createInstantHoverDelegate } from '../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { ActionRunner, IAction, IActionRunner, SubmenuAction, WorkbenchActionExecutedClassification, WorkbenchActionExecutedEvent } from '../../../base/common/actions.js';
import { Codicon } from '../../../base/common/codicons.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { localize } from '../../../nls.js';
import { getActionBarActions } from './menuEntryActionViewItem.js';
import { IToolBarRenderOptions } from './toolbar.js';
import { MenuId, IMenuService, MenuItemAction, IMenuActionOptions } from '../common/actions.js';
import { IContextKeyService } from '../../contextkey/common/contextkey.js';
import { IContextMenuService } from '../../contextview/browser/contextView.js';
import { IHoverService } from '../../hover/browser/hover.js';
import { IKeybindingService } from '../../keybinding/common/keybinding.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';

export type IButtonConfigProvider = (action: IAction, index: number) => {
	showIcon?: boolean;
	showLabel?: boolean;
	isSecondary?: boolean;
} | undefined;

export interface IWorkbenchButtonBarOptions {
	telemetrySource?: string;
	buttonConfigProvider?: IButtonConfigProvider;
}

export class WorkbenchButtonBar extends ButtonBar {

	protected readonly _store = new DisposableStore();
	protected readonly _updateStore = new DisposableStore();

	private readonly _actionRunner: IActionRunner;
	private readonly _onDidChange = new Emitter<this>();
	readonly onDidChange: Event<this> = this._onDidChange.event;


	constructor(
		container: HTMLElement,
		private readonly _options: IWorkbenchButtonBarOptions | undefined,
		@IContextMenuService private readonly _contextMenuService: IContextMenuService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IHoverService private readonly _hoverService: IHoverService,
	) {
		super(container);

		this._actionRunner = this._store.add(new ActionRunner());
		if (_options?.telemetrySource) {
			this._actionRunner.onDidRun(e => {
				telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>(
					'workbenchActionExecuted',
					{ id: e.action.id, from: _options.telemetrySource! }
				);
			}, undefined, this._store);
		}
	}

	override dispose() {
		this._onDidChange.dispose();
		this._updateStore.dispose();
		this._store.dispose();
		super.dispose();
	}

	update(actions: IAction[], secondary: IAction[]): void {

		const conifgProvider: IButtonConfigProvider = this._options?.buttonConfigProvider ?? (() => ({ showLabel: true }));

		this._updateStore.clear();
		this.clear();

		// Support instamt hover between buttons
		const hoverDelegate = this._updateStore.add(createInstantHoverDelegate());

		for (let i = 0; i < actions.length; i++) {

			const secondary = i > 0;
			const actionOrSubmenu = actions[i];
			let action: IAction;
			let btn: IButton;
			let tooltip: string = '';
			const kb = actionOrSubmenu instanceof SubmenuAction ? '' : this._keybindingService.lookupKeybinding(actionOrSubmenu.id);
			if (kb) {
				tooltip = localize('labelWithKeybinding', "{0} ({1})", actionOrSubmenu.tooltip || actionOrSubmenu.label, kb.getLabel());
			} else {
				tooltip = actionOrSubmenu.tooltip || actionOrSubmenu.label;
			}
			if (actionOrSubmenu instanceof SubmenuAction && actionOrSubmenu.actions.length > 0) {
				const [first, ...rest] = actionOrSubmenu.actions;
				action = <MenuItemAction>first;
				btn = this.addButtonWithDropdown({
					secondary: conifgProvider(action, i)?.isSecondary ?? secondary,
					actionRunner: this._actionRunner,
					actions: rest,
					contextMenuProvider: this._contextMenuService,
					ariaLabel: tooltip,
					supportIcons: true,
				});
			} else {
				action = actionOrSubmenu;
				btn = this.addButton({
					secondary: conifgProvider(action, i)?.isSecondary ?? secondary,
					ariaLabel: tooltip,
					supportIcons: true,
				});
			}

			btn.enabled = action.enabled;
			btn.checked = action.checked ?? false;
			btn.element.classList.add('default-colors');
			const showLabel = conifgProvider(action, i)?.showLabel ?? true;
			if (showLabel) {
				btn.label = action.label;
			} else {
				btn.element.classList.add('monaco-text-button');
			}
			if (conifgProvider(action, i)?.showIcon) {
				if (action instanceof MenuItemAction && ThemeIcon.isThemeIcon(action.item.icon)) {
					if (!showLabel) {
						btn.icon = action.item.icon;
					} else {
						// this is REALLY hacky but combining a codicon and normal text is ugly because
						// the former define a font which doesn't work for text
						btn.label = `$(${action.item.icon.id}) ${action.label}`;
					}
				} else if (action.class) {
					btn.element.classList.add(...action.class.split(' '));
				}
			}

			this._updateStore.add(this._hoverService.setupManagedHover(hoverDelegate, btn.element, tooltip));
			this._updateStore.add(btn.onDidClick(async () => {
				this._actionRunner.run(action);
			}));
		}

		if (secondary.length > 0) {

			const btn = this.addButton({
				secondary: true,
				ariaLabel: localize('moreActions', "More Actions")
			});

			btn.icon = Codicon.dropDownButton;
			btn.element.classList.add('default-colors', 'monaco-text-button');

			btn.enabled = true;
			this._updateStore.add(this._hoverService.setupManagedHover(hoverDelegate, btn.element, localize('moreActions', "More Actions")));
			this._updateStore.add(btn.onDidClick(async () => {
				this._contextMenuService.showContextMenu({
					getAnchor: () => btn.element,
					getActions: () => secondary,
					actionRunner: this._actionRunner,
					onHide: () => btn.element.setAttribute('aria-expanded', 'false')
				});
				btn.element.setAttribute('aria-expanded', 'true');

			}));
		}
		this._onDidChange.fire(this);
	}
}

export interface IMenuWorkbenchButtonBarOptions extends IWorkbenchButtonBarOptions {
	menuOptions?: IMenuActionOptions;

	toolbarOptions?: IToolBarRenderOptions;
}

export class MenuWorkbenchButtonBar extends WorkbenchButtonBar {

	constructor(
		container: HTMLElement,
		menuId: MenuId,
		options: IMenuWorkbenchButtonBarOptions | undefined,
		@IMenuService menuService: IMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IKeybindingService keybindingService: IKeybindingService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IHoverService hoverService: IHoverService,
	) {
		super(container, options, contextMenuService, keybindingService, telemetryService, hoverService);

		const menu = menuService.createMenu(menuId, contextKeyService);
		this._store.add(menu);

		const update = () => {

			this.clear();

			const actions = getActionBarActions(
				menu.getActions(options?.menuOptions),
				options?.toolbarOptions?.primaryGroup
			);

			super.update(actions.primary, actions.secondary);
		};
		this._store.add(menu.onDidChange(update));
		update();
	}

	override dispose() {
		super.dispose();
	}

	override update(_actions: IAction[]): void {
		throw new Error('Use Menu or WorkbenchButtonBar');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/actions/browser/dropdownActionViewItemWithKeybinding.ts]---
Location: vscode-main/src/vs/platform/actions/browser/dropdownActionViewItemWithKeybinding.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IContextMenuProvider } from '../../../base/browser/contextmenu.js';
import { IActionProvider } from '../../../base/browser/ui/dropdown/dropdown.js';
import { DropdownMenuActionViewItem, IDropdownMenuActionViewItemOptions } from '../../../base/browser/ui/dropdown/dropdownActionViewItem.js';
import { IAction } from '../../../base/common/actions.js';
import * as nls from '../../../nls.js';
import { IContextKeyService } from '../../contextkey/common/contextkey.js';
import { IKeybindingService } from '../../keybinding/common/keybinding.js';

export class DropdownMenuActionViewItemWithKeybinding extends DropdownMenuActionViewItem {
	constructor(
		action: IAction,
		menuActionsOrProvider: readonly IAction[] | IActionProvider,
		contextMenuProvider: IContextMenuProvider,
		options: IDropdownMenuActionViewItemOptions = Object.create(null),
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
	) {
		super(action, menuActionsOrProvider, contextMenuProvider, options);
	}

	protected override getTooltip() {
		const keybinding = this.keybindingService.lookupKeybinding(this.action.id, this.contextKeyService);
		const keybindingLabel = keybinding && keybinding.getLabel();

		const tooltip = this.action.tooltip ?? this.action.label;
		return keybindingLabel
			? nls.localize('titleAndKb', "{0} ({1})", tooltip, keybindingLabel)
			: tooltip;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/actions/browser/dropdownWithPrimaryActionViewItem.ts]---
Location: vscode-main/src/vs/platform/actions/browser/dropdownWithPrimaryActionViewItem.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../base/browser/keyboardEvent.js';
import { ActionViewItem, BaseActionViewItem } from '../../../base/browser/ui/actionbar/actionViewItems.js';
import { DropdownMenuActionViewItem } from '../../../base/browser/ui/dropdown/dropdownActionViewItem.js';
import { IAction, IActionRunner } from '../../../base/common/actions.js';
import { Event } from '../../../base/common/event.js';
import { KeyCode } from '../../../base/common/keyCodes.js';
import { ResolvedKeybinding } from '../../../base/common/keybindings.js';
import { MenuEntryActionViewItem } from './menuEntryActionViewItem.js';
import { MenuItemAction } from '../common/actions.js';
import { IContextKeyService } from '../../contextkey/common/contextkey.js';
import { IKeybindingService } from '../../keybinding/common/keybinding.js';
import { INotificationService } from '../../notification/common/notification.js';
import { IThemeService } from '../../theme/common/themeService.js';
import { IContextMenuService } from '../../contextview/browser/contextView.js';
import { IAccessibilityService } from '../../accessibility/common/accessibility.js';
import { IHoverDelegate } from '../../../base/browser/ui/hover/hoverDelegate.js';

export interface IDropdownWithPrimaryActionViewItemOptions {
	actionRunner?: IActionRunner;
	getKeyBinding?: (action: IAction) => ResolvedKeybinding | undefined;
	hoverDelegate?: IHoverDelegate;
	menuAsChild?: boolean;
	skipTelemetry?: boolean;
}

export class DropdownWithPrimaryActionViewItem extends BaseActionViewItem {
	protected readonly _primaryAction: ActionViewItem;
	private _dropdown: DropdownMenuActionViewItem;
	private _container: HTMLElement | null = null;
	private _dropdownContainer: HTMLElement | null = null;

	get onDidChangeDropdownVisibility(): Event<boolean> {
		return this._dropdown.onDidChangeVisibility;
	}

	constructor(
		primaryAction: MenuItemAction,
		dropdownAction: IAction,
		dropdownMenuActions: readonly IAction[],
		className: string,
		private readonly _options: IDropdownWithPrimaryActionViewItemOptions | undefined,
		@IContextMenuService private readonly _contextMenuProvider: IContextMenuService,
		@IKeybindingService _keybindingService: IKeybindingService,
		@INotificationService _notificationService: INotificationService,
		@IContextKeyService _contextKeyService: IContextKeyService,
		@IThemeService _themeService: IThemeService,
		@IAccessibilityService _accessibilityService: IAccessibilityService
	) {
		super(null, primaryAction, { hoverDelegate: _options?.hoverDelegate });
		this._primaryAction = new MenuEntryActionViewItem(primaryAction, { hoverDelegate: _options?.hoverDelegate }, _keybindingService, _notificationService, _contextKeyService, _themeService, _contextMenuProvider, _accessibilityService);
		if (_options?.actionRunner) {
			this._primaryAction.actionRunner = _options.actionRunner;
		}

		this._dropdown = new DropdownMenuActionViewItem(dropdownAction, dropdownMenuActions, this._contextMenuProvider, {
			menuAsChild: _options?.menuAsChild ?? true,
			classNames: className ? ['codicon', 'codicon-chevron-down', className] : ['codicon', 'codicon-chevron-down'],
			actionRunner: this._options?.actionRunner,
			keybindingProvider: this._options?.getKeyBinding ?? (action => _keybindingService.lookupKeybinding(action.id)),
			hoverDelegate: _options?.hoverDelegate,
			skipTelemetry: _options?.skipTelemetry,
		});
	}

	override set actionRunner(actionRunner: IActionRunner) {
		super.actionRunner = actionRunner;

		this._primaryAction.actionRunner = actionRunner;
		this._dropdown.actionRunner = actionRunner;
	}

	override get actionRunner(): IActionRunner {
		return super.actionRunner;
	}

	override setActionContext(newContext: unknown): void {
		super.setActionContext(newContext);
		this._primaryAction.setActionContext(newContext);
		this._dropdown.setActionContext(newContext);
	}

	override render(container: HTMLElement): void {
		this._container = container;
		super.render(this._container);
		this._container.classList.add('monaco-dropdown-with-primary');
		const primaryContainer = DOM.$('.action-container');
		primaryContainer.role = 'button';
		primaryContainer.ariaDisabled = String(!this.action.enabled);
		this._primaryAction.render(DOM.append(this._container, primaryContainer));
		this._dropdownContainer = DOM.$('.dropdown-action-container');
		this._dropdown.render(DOM.append(this._container, this._dropdownContainer));
		this._register(DOM.addDisposableListener(primaryContainer, DOM.EventType.KEY_DOWN, (e: KeyboardEvent) => {
			if (!this.action.enabled) {
				return;
			}
			const event = new StandardKeyboardEvent(e);
			if (event.equals(KeyCode.RightArrow)) {
				this._primaryAction.element!.tabIndex = -1;
				this._dropdown.focus();
				event.stopPropagation();
			}
		}));
		this._register(DOM.addDisposableListener(this._dropdownContainer, DOM.EventType.KEY_DOWN, (e: KeyboardEvent) => {
			if (!this.action.enabled) {
				return;
			}
			const event = new StandardKeyboardEvent(e);
			if (event.equals(KeyCode.LeftArrow)) {
				this._primaryAction.element!.tabIndex = 0;
				this._dropdown.setFocusable(false);
				this._primaryAction.element?.focus();
				event.stopPropagation();
			}
		}));

		this.updateEnabled();
	}

	override focus(fromRight?: boolean): void {
		if (fromRight) {
			this._dropdown.focus();
		} else {
			this._primaryAction.element!.tabIndex = 0;
			this._primaryAction.element!.focus();
		}
	}

	override blur(): void {
		this._primaryAction.element!.tabIndex = -1;
		this._dropdown.blur();
		this._container!.blur();
	}

	override setFocusable(focusable: boolean): void {
		if (focusable) {
			this._primaryAction.element!.tabIndex = 0;
		} else {
			this._primaryAction.element!.tabIndex = -1;
			this._dropdown.setFocusable(false);
		}
	}

	protected override updateEnabled(): void {
		const disabled = !this.action.enabled;
		this.element?.classList.toggle('disabled', disabled);
	}

	update(dropdownAction: IAction, dropdownMenuActions: IAction[], dropdownIcon?: string): void {
		this._dropdown.dispose();
		this._dropdown = new DropdownMenuActionViewItem(dropdownAction, dropdownMenuActions, this._contextMenuProvider, {
			menuAsChild: this._options?.menuAsChild ?? true,
			classNames: ['codicon', dropdownIcon || 'codicon-chevron-down'],
			actionRunner: this._options?.actionRunner,
			hoverDelegate: this._options?.hoverDelegate,
			keybindingProvider: this._options?.getKeyBinding
		});
		if (this._dropdownContainer) {
			this._dropdown.render(this._dropdownContainer);
		}
	}

	showDropdown(): void {
		this._dropdown.show();
	}

	override dispose() {
		this._primaryAction.dispose();
		this._dropdown.dispose();
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/actions/browser/floatingMenu.ts]---
Location: vscode-main/src/vs/platform/actions/browser/floatingMenu.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, append, clearNode } from '../../../base/browser/dom.js';
import { Widget } from '../../../base/browser/ui/widget.js';
import { IAction } from '../../../base/common/actions.js';
import { Emitter } from '../../../base/common/event.js';
import { Disposable, DisposableStore, toDisposable } from '../../../base/common/lifecycle.js';
import { getFlatActionBarActions } from './menuEntryActionViewItem.js';
import { IMenu, IMenuService, MenuId } from '../common/actions.js';
import { IContextKeyService } from '../../contextkey/common/contextkey.js';
import { IInstantiationService } from '../../instantiation/common/instantiation.js';
import { asCssVariable, asCssVariableWithDefault, buttonBackground, buttonForeground, contrastBorder, editorBackground, editorForeground } from '../../theme/common/colorRegistry.js';

export class FloatingClickWidget extends Widget {

	private readonly _onClick = this._register(new Emitter<void>());
	readonly onClick = this._onClick.event;

	private _domNode: HTMLElement;

	constructor(private label: string) {
		super();

		this._domNode = $('.floating-click-widget');
		this._domNode.style.padding = '6px 11px';
		this._domNode.style.borderRadius = '2px';
		this._domNode.style.cursor = 'pointer';
		this._domNode.style.zIndex = '1';
	}

	getDomNode(): HTMLElement {
		return this._domNode;
	}

	render() {
		clearNode(this._domNode);
		this._domNode.style.backgroundColor = asCssVariableWithDefault(buttonBackground, asCssVariable(editorBackground));
		this._domNode.style.color = asCssVariableWithDefault(buttonForeground, asCssVariable(editorForeground));
		this._domNode.style.border = `1px solid ${asCssVariable(contrastBorder)}`;

		append(this._domNode, $('')).textContent = this.label;

		this.onclick(this._domNode, () => this._onClick.fire());
	}
}

export abstract class AbstractFloatingClickMenu extends Disposable {
	private readonly renderEmitter = new Emitter<FloatingClickWidget>();
	protected get onDidRender() { return this.renderEmitter.event; }
	private readonly menu: IMenu;

	constructor(
		menuId: MenuId,
		@IMenuService menuService: IMenuService,
		@IContextKeyService contextKeyService: IContextKeyService
	) {
		super();
		this.menu = this._register(menuService.createMenu(menuId, contextKeyService));
	}

	/** Should be called in implementation constructors after they initialized */
	protected render() {
		const menuDisposables = this._register(new DisposableStore());
		const renderMenuAsFloatingClickBtn = () => {
			menuDisposables.clear();
			if (!this.isVisible()) {
				return;
			}
			const actions = getFlatActionBarActions(this.menu.getActions({ renderShortTitle: true, shouldForwardArgs: true }));
			if (actions.length === 0) {
				return;
			}
			// todo@jrieken find a way to handle N actions, like showing a context menu
			const [first] = actions;
			const widget = this.createWidget(first, menuDisposables);
			menuDisposables.add(widget);
			menuDisposables.add(widget.onClick(() => first.run(this.getActionArg())));
			widget.render();
		};
		this._register(this.menu.onDidChange(renderMenuAsFloatingClickBtn));
		renderMenuAsFloatingClickBtn();
	}

	protected abstract createWidget(action: IAction, disposables: DisposableStore): FloatingClickWidget;

	protected getActionArg(): unknown {
		return undefined;
	}

	protected isVisible() {
		return true;
	}
}

export class FloatingClickMenu extends AbstractFloatingClickMenu {

	constructor(
		private readonly options: {
			/** Element the menu should be rendered into. */
			container: HTMLElement;
			/** Menu to show. If no actions are present, the button is hidden. */
			menuId: MenuId;
			/** Argument provided to the menu action */
			getActionArg: () => void;
		},
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IMenuService menuService: IMenuService,
		@IContextKeyService contextKeyService: IContextKeyService
	) {
		super(options.menuId, menuService, contextKeyService);
		this.render();
	}

	protected override createWidget(action: IAction, disposable: DisposableStore): FloatingClickWidget {
		const w = this.instantiationService.createInstance(FloatingClickWidget, action.label);
		const node = w.getDomNode();
		this.options.container.appendChild(node);
		disposable.add(toDisposable(() => node.remove()));
		return w;
	}

	protected override getActionArg(): unknown {
		return this.options.getActionArg();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/actions/browser/menuEntryActionViewItem.css]---
Location: vscode-main/src/vs/platform/actions/browser/menuEntryActionViewItem.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-action-bar .action-item.menu-entry .action-label.icon {
	width: 16px;
	height: 16px;
	background-repeat: no-repeat;
	background-position: 50%;
	background-size: 16px;
}

.monaco-action-bar .action-item.menu-entry.text-only .action-label {
	color: var(--vscode-descriptionForeground);
	overflow: hidden;
	border-radius: 2px;
}

.monaco-action-bar .action-item.menu-entry.text-only.use-comma:not(:last-of-type) .action-label::after {
	content: ', ';
}

.monaco-action-bar .action-item.menu-entry.text-only + .action-item:not(.text-only) > .monaco-dropdown .action-label {
	color: var(--vscode-descriptionForeground);
}

.monaco-dropdown-with-default {
	display: flex !important;
	flex-direction: row;
	border-radius: 5px;
}

.monaco-dropdown-with-default > .action-container > .action-label {
	margin-right: 0;
}

.monaco-dropdown-with-default > .action-container.menu-entry > .action-label.icon {
	width: 16px;
	height: 16px;
	background-repeat: no-repeat;
	background-position: 50%;
	background-size: 16px;
}

.monaco-dropdown-with-default:hover {
	background-color: var(--vscode-toolbar-hoverBackground);
}

.monaco-dropdown-with-default > .dropdown-action-container > .monaco-dropdown > .dropdown-label .codicon[class*='codicon-'] {
	font-size: 12px;
	padding-left: 0px;
	padding-right: 0px;
	line-height: 16px;
	margin-left: -3px;
}

.monaco-dropdown-with-default > .dropdown-action-container > .monaco-dropdown > .dropdown-label > .action-label {
	display: block;
	background-size: 16px;
	background-position: center center;
	background-repeat: no-repeat;
}
```

--------------------------------------------------------------------------------

````

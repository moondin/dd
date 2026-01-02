---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 242
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 242 of 552)

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

---[FILE: src/vs/editor/standalone/browser/inspectTokens/inspectTokens.ts]---
Location: vscode-main/src/vs/editor/standalone/browser/inspectTokens/inspectTokens.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './inspectTokens.css';
import { $, append, reset } from '../../../../base/browser/dom.js';
import { CharCode } from '../../../../base/common/charCode.js';
import { Color } from '../../../../base/common/color.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ContentWidgetPositionPreference, IActiveCodeEditor, ICodeEditor, IContentWidget, IContentWidgetPosition } from '../../../browser/editorBrowser.js';
import { EditorAction, ServicesAccessor, registerEditorAction, registerEditorContribution, EditorContributionInstantiation } from '../../../browser/editorExtensions.js';
import { Position } from '../../../common/core/position.js';
import { IEditorContribution } from '../../../common/editorCommon.js';
import { ITextModel } from '../../../common/model.js';
import { IState, ITokenizationSupport, TokenizationRegistry, ILanguageIdCodec, Token } from '../../../common/languages.js';
import { FontStyle, StandardTokenType, TokenMetadata } from '../../../common/encodedTokenAttributes.js';
import { NullState, nullTokenize, nullTokenizeEncoded } from '../../../common/languages/nullTokenize.js';
import { ILanguageService } from '../../../common/languages/language.js';
import { IStandaloneThemeService } from '../../common/standaloneTheme.js';
import { InspectTokensNLS } from '../../../common/standaloneStrings.js';


class InspectTokensController extends Disposable implements IEditorContribution {

	public static readonly ID = 'editor.contrib.inspectTokens';

	public static get(editor: ICodeEditor): InspectTokensController | null {
		return editor.getContribution<InspectTokensController>(InspectTokensController.ID);
	}

	private readonly _editor: ICodeEditor;
	private readonly _languageService: ILanguageService;
	private _widget: InspectTokensWidget | null;

	constructor(
		editor: ICodeEditor,
		@IStandaloneThemeService standaloneColorService: IStandaloneThemeService,
		@ILanguageService languageService: ILanguageService
	) {
		super();
		this._editor = editor;
		this._languageService = languageService;
		this._widget = null;

		this._register(this._editor.onDidChangeModel((e) => this.stop()));
		this._register(this._editor.onDidChangeModelLanguage((e) => this.stop()));
		this._register(TokenizationRegistry.onDidChange((e) => this.stop()));
		this._register(this._editor.onKeyUp((e) => e.keyCode === KeyCode.Escape && this.stop()));
	}

	public override dispose(): void {
		this.stop();
		super.dispose();
	}

	public launch(): void {
		if (this._widget) {
			return;
		}
		if (!this._editor.hasModel()) {
			return;
		}
		this._widget = new InspectTokensWidget(this._editor, this._languageService);
	}

	public stop(): void {
		if (this._widget) {
			this._widget.dispose();
			this._widget = null;
		}
	}
}

class InspectTokens extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.inspectTokens',
			label: InspectTokensNLS.inspectTokensAction,
			alias: 'Developer: Inspect Tokens',
			precondition: undefined
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const controller = InspectTokensController.get(editor);
		controller?.launch();
	}
}

interface ICompleteLineTokenization {
	startState: IState;
	tokens1: Token[];
	tokens2: Uint32Array;
	endState: IState;
}

interface IDecodedMetadata {
	languageId: string;
	tokenType: StandardTokenType;
	fontStyle: FontStyle;
	foreground: Color;
	background: Color;
}

function renderTokenText(tokenText: string): string {
	let result: string = '';
	for (let charIndex = 0, len = tokenText.length; charIndex < len; charIndex++) {
		const charCode = tokenText.charCodeAt(charIndex);
		switch (charCode) {
			case CharCode.Tab:
				result += '\u2192'; // &rarr;
				break;

			case CharCode.Space:
				result += '\u00B7'; // &middot;
				break;

			default:
				result += String.fromCharCode(charCode);
		}
	}
	return result;
}

function getSafeTokenizationSupport(languageIdCodec: ILanguageIdCodec, languageId: string): ITokenizationSupport {
	const tokenizationSupport = TokenizationRegistry.get(languageId);
	if (tokenizationSupport) {
		return tokenizationSupport;
	}
	const encodedLanguageId = languageIdCodec.encodeLanguageId(languageId);
	return {
		getInitialState: () => NullState,
		tokenize: (line: string, hasEOL: boolean, state: IState) => nullTokenize(languageId, state),
		tokenizeEncoded: (line: string, hasEOL: boolean, state: IState) => nullTokenizeEncoded(encodedLanguageId, state)
	};
}

class InspectTokensWidget extends Disposable implements IContentWidget {

	private static readonly _ID = 'editor.contrib.inspectTokensWidget';

	// Editor.IContentWidget.allowEditorOverflow
	public allowEditorOverflow = true;

	private readonly _editor: IActiveCodeEditor;
	private readonly _languageService: ILanguageService;
	private readonly _tokenizationSupport: ITokenizationSupport;
	private readonly _model: ITextModel;
	private readonly _domNode: HTMLElement;

	constructor(
		editor: IActiveCodeEditor,
		languageService: ILanguageService
	) {
		super();
		this._editor = editor;
		this._languageService = languageService;
		this._model = this._editor.getModel();
		this._domNode = document.createElement('div');
		this._domNode.className = 'tokens-inspect-widget';
		this._tokenizationSupport = getSafeTokenizationSupport(this._languageService.languageIdCodec, this._model.getLanguageId());
		this._compute(this._editor.getPosition());
		this._register(this._editor.onDidChangeCursorPosition((e) => this._compute(this._editor.getPosition())));
		this._editor.addContentWidget(this);
	}

	public override dispose(): void {
		this._editor.removeContentWidget(this);
		super.dispose();
	}

	public getId(): string {
		return InspectTokensWidget._ID;
	}

	private _compute(position: Position): void {
		const data = this._getTokensAtLine(position.lineNumber);

		let token1Index = 0;
		for (let i = data.tokens1.length - 1; i >= 0; i--) {
			const t = data.tokens1[i];
			if (position.column - 1 >= t.offset) {
				token1Index = i;
				break;
			}
		}

		let token2Index = 0;
		for (let i = (data.tokens2.length >>> 1); i >= 0; i--) {
			if (position.column - 1 >= data.tokens2[(i << 1)]) {
				token2Index = i;
				break;
			}
		}

		const lineContent = this._model.getLineContent(position.lineNumber);
		let tokenText = '';
		if (token1Index < data.tokens1.length) {
			const tokenStartIndex = data.tokens1[token1Index].offset;
			const tokenEndIndex = token1Index + 1 < data.tokens1.length ? data.tokens1[token1Index + 1].offset : lineContent.length;
			tokenText = lineContent.substring(tokenStartIndex, tokenEndIndex);
		}
		reset(this._domNode,
			$('h2.tm-token', undefined, renderTokenText(tokenText),
				$('span.tm-token-length', undefined, `${tokenText.length} ${tokenText.length === 1 ? 'char' : 'chars'}`)));

		append(this._domNode, $('hr.tokens-inspect-separator', { 'style': 'clear:both' }));

		const metadata = (token2Index << 1) + 1 < data.tokens2.length ? this._decodeMetadata(data.tokens2[(token2Index << 1) + 1]) : null;
		append(this._domNode, $('table.tm-metadata-table', undefined,
			$('tbody', undefined,
				$('tr', undefined,
					$('td.tm-metadata-key', undefined, 'language'),
					$('td.tm-metadata-value', undefined, `${metadata ? metadata.languageId : '-?-'}`)
				),
				$('tr', undefined,
					$('td.tm-metadata-key', undefined, 'token type' as string),
					$('td.tm-metadata-value', undefined, `${metadata ? this._tokenTypeToString(metadata.tokenType) : '-?-'}`)
				),
				$('tr', undefined,
					$('td.tm-metadata-key', undefined, 'font style' as string),
					$('td.tm-metadata-value', undefined, `${metadata ? this._fontStyleToString(metadata.fontStyle) : '-?-'}`)
				),
				$('tr', undefined,
					$('td.tm-metadata-key', undefined, 'foreground'),
					$('td.tm-metadata-value', undefined, `${metadata ? Color.Format.CSS.formatHex(metadata.foreground) : '-?-'}`)
				),
				$('tr', undefined,
					$('td.tm-metadata-key', undefined, 'background'),
					$('td.tm-metadata-value', undefined, `${metadata ? Color.Format.CSS.formatHex(metadata.background) : '-?-'}`)
				)
			)
		));
		append(this._domNode, $('hr.tokens-inspect-separator'));

		if (token1Index < data.tokens1.length) {
			append(this._domNode, $('span.tm-token-type', undefined, data.tokens1[token1Index].type));
		}

		this._editor.layoutContentWidget(this);
	}

	private _decodeMetadata(metadata: number): IDecodedMetadata {
		const colorMap = TokenizationRegistry.getColorMap()!;
		const languageId = TokenMetadata.getLanguageId(metadata);
		const tokenType = TokenMetadata.getTokenType(metadata);
		const fontStyle = TokenMetadata.getFontStyle(metadata);
		const foreground = TokenMetadata.getForeground(metadata);
		const background = TokenMetadata.getBackground(metadata);
		return {
			languageId: this._languageService.languageIdCodec.decodeLanguageId(languageId),
			tokenType: tokenType,
			fontStyle: fontStyle,
			foreground: colorMap[foreground],
			background: colorMap[background]
		};
	}

	private _tokenTypeToString(tokenType: StandardTokenType): string {
		switch (tokenType) {
			case StandardTokenType.Other: return 'Other';
			case StandardTokenType.Comment: return 'Comment';
			case StandardTokenType.String: return 'String';
			case StandardTokenType.RegEx: return 'RegEx';
			default: return '??';
		}
	}

	private _fontStyleToString(fontStyle: FontStyle): string {
		let r = '';
		if (fontStyle & FontStyle.Italic) {
			r += 'italic ';
		}
		if (fontStyle & FontStyle.Bold) {
			r += 'bold ';
		}
		if (fontStyle & FontStyle.Underline) {
			r += 'underline ';
		}
		if (fontStyle & FontStyle.Strikethrough) {
			r += 'strikethrough ';
		}
		if (r.length === 0) {
			r = '---';
		}
		return r;
	}

	private _getTokensAtLine(lineNumber: number): ICompleteLineTokenization {
		const stateBeforeLine = this._getStateBeforeLine(lineNumber);

		const tokenizationResult1 = this._tokenizationSupport.tokenize(this._model.getLineContent(lineNumber), true, stateBeforeLine);
		const tokenizationResult2 = this._tokenizationSupport.tokenizeEncoded(this._model.getLineContent(lineNumber), true, stateBeforeLine);

		return {
			startState: stateBeforeLine,
			tokens1: tokenizationResult1.tokens,
			tokens2: tokenizationResult2.tokens,
			endState: tokenizationResult1.endState
		};
	}

	private _getStateBeforeLine(lineNumber: number): IState {
		let state: IState = this._tokenizationSupport.getInitialState();

		for (let i = 1; i < lineNumber; i++) {
			const tokenizationResult = this._tokenizationSupport.tokenize(this._model.getLineContent(i), true, state);
			state = tokenizationResult.endState;
		}

		return state;
	}

	public getDomNode(): HTMLElement {
		return this._domNode;
	}

	public getPosition(): IContentWidgetPosition {
		return {
			position: this._editor.getPosition(),
			preference: [ContentWidgetPositionPreference.BELOW, ContentWidgetPositionPreference.ABOVE]
		};
	}
}

registerEditorContribution(InspectTokensController.ID, InspectTokensController, EditorContributionInstantiation.Lazy);
registerEditorAction(InspectTokens);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.css]---
Location: vscode-main/src/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .iPadShowKeyboard {
	width: 58px;
	min-width: 0;
	height: 36px;
	min-height: 0;
	margin: 0;
	padding: 0;
	position: absolute;
	resize: none;
	overflow: hidden;
	background: url('keyboard-light.svg') center center no-repeat;
	border: 4px solid #F6F6F6;
	border-radius: 4px;
}

.monaco-editor.vs-dark .iPadShowKeyboard {
	background: url('keyboard-dark.svg') center center no-repeat;
	border: 4px solid #252526;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.ts]---
Location: vscode-main/src/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './iPadShowKeyboard.css';
import * as dom from '../../../../base/browser/dom.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditor, IOverlayWidget, IOverlayWidgetPosition, OverlayWidgetPositionPreference } from '../../../browser/editorBrowser.js';
import { EditorContributionInstantiation, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { IEditorContribution } from '../../../common/editorCommon.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { isIOS } from '../../../../base/common/platform.js';

export class IPadShowKeyboard extends Disposable implements IEditorContribution {

	public static readonly ID = 'editor.contrib.iPadShowKeyboard';

	private readonly editor: ICodeEditor;
	private widget: ShowKeyboardWidget | null;

	constructor(editor: ICodeEditor) {
		super();
		this.editor = editor;
		this.widget = null;
		if (isIOS) {
			this._register(editor.onDidChangeConfiguration(() => this.update()));
			this.update();
		}
	}

	private update(): void {
		const shouldHaveWidget = (!this.editor.getOption(EditorOption.readOnly));

		if (!this.widget && shouldHaveWidget) {

			this.widget = new ShowKeyboardWidget(this.editor);

		} else if (this.widget && !shouldHaveWidget) {

			this.widget.dispose();
			this.widget = null;

		}
	}

	public override dispose(): void {
		super.dispose();
		if (this.widget) {
			this.widget.dispose();
			this.widget = null;
		}
	}
}

class ShowKeyboardWidget extends Disposable implements IOverlayWidget {

	private static readonly ID = 'editor.contrib.ShowKeyboardWidget';

	private readonly editor: ICodeEditor;

	private readonly _domNode: HTMLElement;

	constructor(editor: ICodeEditor) {
		super();
		this.editor = editor;
		this._domNode = document.createElement('textarea');
		this._domNode.className = 'iPadShowKeyboard';

		this._register(dom.addDisposableListener(this._domNode, 'touchstart', (e) => {
			this.editor.focus();
		}));
		this._register(dom.addDisposableListener(this._domNode, 'focus', (e) => {
			this.editor.focus();
		}));

		this.editor.addOverlayWidget(this);
	}

	public override dispose(): void {
		this.editor.removeOverlayWidget(this);
		super.dispose();
	}

	// ----- IOverlayWidget API

	public getId(): string {
		return ShowKeyboardWidget.ID;
	}

	public getDomNode(): HTMLElement {
		return this._domNode;
	}

	public getPosition(): IOverlayWidgetPosition {
		return {
			preference: OverlayWidgetPositionPreference.BOTTOM_RIGHT_CORNER
		};
	}
}

registerEditorContribution(IPadShowKeyboard.ID, IPadShowKeyboard, EditorContributionInstantiation.Eventually);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/browser/iPadShowKeyboard/keyboard-dark.svg]---
Location: vscode-main/src/vs/editor/standalone/browser/iPadShowKeyboard/keyboard-dark.svg

```text
<svg width="53" height="36" viewBox="0 0 53 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M48.0364 4.01042H4.00779L4.00779 32.0286H48.0364V4.01042ZM4.00779 0.0078125C1.79721 0.0078125 0.00518799 1.79984 0.00518799 4.01042V32.0286C0.00518799 34.2392 1.79721 36.0312 4.00779 36.0312H48.0364C50.247 36.0312 52.039 34.2392 52.039 32.0286V4.01042C52.039 1.79984 50.247 0.0078125 48.0364 0.0078125H4.00779ZM8.01042 8.01302H12.013V12.0156H8.01042V8.01302ZM20.0182 8.01302H16.0156V12.0156H20.0182V8.01302ZM24.0208 8.01302H28.0234V12.0156H24.0208V8.01302ZM36.0286 8.01302H32.026V12.0156H36.0286V8.01302ZM40.0312 8.01302H44.0339V12.0156H40.0312V8.01302ZM16.0156 16.0182H8.01042V20.0208H16.0156V16.0182ZM20.0182 16.0182H24.0208V20.0208H20.0182V16.0182ZM32.026 16.0182H28.0234V20.0208H32.026V16.0182ZM44.0339 16.0182V20.0208H36.0286V16.0182H44.0339ZM12.013 24.0234H8.01042V28.026H12.013V24.0234ZM16.0156 24.0234H36.0286V28.026H16.0156V24.0234ZM44.0339 24.0234H40.0312V28.026H44.0339V24.0234Z" fill="#C5C5C5"/>
</g>
<defs>
<clipPath id="clip0">
<rect width="53" height="36" fill="white"/>
</clipPath>
</defs>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/browser/iPadShowKeyboard/keyboard-light.svg]---
Location: vscode-main/src/vs/editor/standalone/browser/iPadShowKeyboard/keyboard-light.svg

```text
<svg width="53" height="36" viewBox="0 0 53 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M48.0364 4.01042H4.00779L4.00779 32.0286H48.0364V4.01042ZM4.00779 0.0078125C1.79721 0.0078125 0.00518799 1.79984 0.00518799 4.01042V32.0286C0.00518799 34.2392 1.79721 36.0312 4.00779 36.0312H48.0364C50.247 36.0312 52.039 34.2392 52.039 32.0286V4.01042C52.039 1.79984 50.247 0.0078125 48.0364 0.0078125H4.00779ZM8.01042 8.01302H12.013V12.0156H8.01042V8.01302ZM20.0182 8.01302H16.0156V12.0156H20.0182V8.01302ZM24.0208 8.01302H28.0234V12.0156H24.0208V8.01302ZM36.0286 8.01302H32.026V12.0156H36.0286V8.01302ZM40.0312 8.01302H44.0339V12.0156H40.0312V8.01302ZM16.0156 16.0182H8.01042V20.0208H16.0156V16.0182ZM20.0182 16.0182H24.0208V20.0208H20.0182V16.0182ZM32.026 16.0182H28.0234V20.0208H32.026V16.0182ZM44.0339 16.0182V20.0208H36.0286V16.0182H44.0339ZM12.013 24.0234H8.01042V28.026H12.013V24.0234ZM16.0156 24.0234H36.0286V28.026H16.0156V24.0234ZM44.0339 24.0234H40.0312V28.026H44.0339V24.0234Z" fill="#424242"/>
</g>
<defs>
<clipPath id="clip0">
<rect width="53" height="36" fill="white"/>
</clipPath>
</defs>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.ts]---
Location: vscode-main/src/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Registry } from '../../../../platform/registry/common/platform.js';
import { IQuickAccessRegistry, Extensions } from '../../../../platform/quickinput/common/quickAccess.js';
import { QuickCommandNLS } from '../../../common/standaloneStrings.js';
import { ICommandQuickPick } from '../../../../platform/quickinput/browser/commandsQuickAccess.js';
import { ICodeEditorService } from '../../../browser/services/codeEditorService.js';
import { AbstractEditorCommandsQuickAccessProvider } from '../../../contrib/quickAccess/browser/commandsQuickAccess.js';
import { IEditor } from '../../../common/editorCommon.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { EditorAction, registerEditorAction } from '../../../browser/editorExtensions.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';

export class StandaloneCommandsQuickAccessProvider extends AbstractEditorCommandsQuickAccessProvider {

	protected get activeTextEditorControl(): IEditor | undefined { return this.codeEditorService.getFocusedCodeEditor() ?? undefined; }

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
		@ICodeEditorService private readonly codeEditorService: ICodeEditorService,
		@IKeybindingService keybindingService: IKeybindingService,
		@ICommandService commandService: ICommandService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IDialogService dialogService: IDialogService
	) {
		super({ showAlias: false }, instantiationService, keybindingService, commandService, telemetryService, dialogService);
	}

	protected async getCommandPicks(): Promise<Array<ICommandQuickPick>> {
		return this.getCodeEditorCommandPicks();
	}

	protected hasAdditionalCommandPicks(): boolean {
		return false;
	}

	protected async getAdditionalCommandPicks(): Promise<ICommandQuickPick[]> {
		return [];
	}
}

export class GotoLineAction extends EditorAction {

	static readonly ID = 'editor.action.quickCommand';

	constructor() {
		super({
			id: GotoLineAction.ID,
			label: QuickCommandNLS.quickCommandActionLabel,
			alias: 'Command Palette',
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.focus,
				primary: KeyCode.F1,
				weight: KeybindingWeight.EditorContrib
			},
			contextMenuOpts: {
				group: 'z_commands',
				order: 1
			}
		});
	}

	run(accessor: ServicesAccessor): void {
		accessor.get(IQuickInputService).quickAccess.show(StandaloneCommandsQuickAccessProvider.PREFIX);
	}
}

registerEditorAction(GotoLineAction);

Registry.as<IQuickAccessRegistry>(Extensions.Quickaccess).registerQuickAccessProvider({
	ctor: StandaloneCommandsQuickAccessProvider,
	prefix: StandaloneCommandsQuickAccessProvider.PREFIX,
	helpEntries: [{ description: QuickCommandNLS.quickCommandHelp, commandId: GotoLineAction.ID }]
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess.ts]---
Location: vscode-main/src/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AbstractGotoLineQuickAccessProvider } from '../../../contrib/quickAccess/browser/gotoLineQuickAccess.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IQuickAccessRegistry, Extensions } from '../../../../platform/quickinput/common/quickAccess.js';
import { ICodeEditorService } from '../../../browser/services/codeEditorService.js';
import { GoToLineNLS } from '../../../common/standaloneStrings.js';
import { Event } from '../../../../base/common/event.js';
import { EditorAction, registerEditorAction, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { KeyMod, KeyCode } from '../../../../base/common/keyCodes.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';

export class StandaloneGotoLineQuickAccessProvider extends AbstractGotoLineQuickAccessProvider {

	protected readonly onDidActiveTextEditorControlChange = Event.None;

	constructor(
		@ICodeEditorService private readonly editorService: ICodeEditorService,
		@IStorageService protected override readonly storageService: IStorageService
	) {
		super();
	}

	protected get activeTextEditorControl() {
		return this.editorService.getFocusedCodeEditor() ?? undefined;
	}
}

export class GotoLineAction extends EditorAction {

	static readonly ID = 'editor.action.gotoLine';

	constructor() {
		super({
			id: GotoLineAction.ID,
			label: GoToLineNLS.gotoLineActionLabel,
			alias: 'Go to Line/Column...',
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.focus,
				primary: KeyMod.CtrlCmd | KeyCode.KeyG,
				mac: { primary: KeyMod.WinCtrl | KeyCode.KeyG },
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	run(accessor: ServicesAccessor): void {
		accessor.get(IQuickInputService).quickAccess.show(StandaloneGotoLineQuickAccessProvider.GO_TO_LINE_PREFIX);
	}
}

registerEditorAction(GotoLineAction);

Registry.as<IQuickAccessRegistry>(Extensions.Quickaccess).registerQuickAccessProvider({
	ctor: StandaloneGotoLineQuickAccessProvider,
	prefix: StandaloneGotoLineQuickAccessProvider.GO_TO_LINE_PREFIX,
	helpEntries: [{ description: GoToLineNLS.gotoLineActionLabel, commandId: GotoLineAction.ID }]
});

class GotoOffsetAction extends EditorAction {

	static readonly ID = 'editor.action.gotoOffset';

	constructor() {
		super({
			id: GotoOffsetAction.ID,
			label: GoToLineNLS.gotoOffsetActionLabel,
			alias: 'Go to Offset...',
			precondition: undefined,
		});
	}

	run(accessor: ServicesAccessor): void {
		accessor.get(IQuickInputService).quickAccess.show(StandaloneGotoLineQuickAccessProvider.GO_TO_OFFSET_PREFIX);
	}
}

registerEditorAction(GotoOffsetAction);

Registry.as<IQuickAccessRegistry>(Extensions.Quickaccess).registerQuickAccessProvider({
	ctor: StandaloneGotoLineQuickAccessProvider,
	prefix: StandaloneGotoLineQuickAccessProvider.GO_TO_OFFSET_PREFIX,
	helpEntries: [{ description: GoToLineNLS.gotoOffsetActionLabel, commandId: GotoOffsetAction.ID }]
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess.ts]---
Location: vscode-main/src/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import '../../../../base/browser/ui/codicons/codiconStyles.js'; // The codicon symbol styles are defined here and must be loaded
import '../../../contrib/symbolIcons/browser/symbolIcons.js'; // The codicon symbol colors are defined here and must be loaded to get colors
import { AbstractGotoSymbolQuickAccessProvider } from '../../../contrib/quickAccess/browser/gotoSymbolQuickAccess.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IQuickAccessRegistry, Extensions } from '../../../../platform/quickinput/common/quickAccess.js';
import { ICodeEditorService } from '../../../browser/services/codeEditorService.js';
import { QuickOutlineNLS } from '../../../common/standaloneStrings.js';
import { Event } from '../../../../base/common/event.js';
import { EditorAction, registerEditorAction } from '../../../browser/editorExtensions.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { KeyMod, KeyCode } from '../../../../base/common/keyCodes.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IQuickInputService, ItemActivation } from '../../../../platform/quickinput/common/quickInput.js';
import { IOutlineModelService } from '../../../contrib/documentSymbols/browser/outlineModel.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';

export class StandaloneGotoSymbolQuickAccessProvider extends AbstractGotoSymbolQuickAccessProvider {

	protected readonly onDidActiveTextEditorControlChange = Event.None;

	constructor(
		@ICodeEditorService private readonly editorService: ICodeEditorService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
		@IOutlineModelService outlineModelService: IOutlineModelService,
	) {
		super(languageFeaturesService, outlineModelService);
	}

	protected get activeTextEditorControl() {
		return this.editorService.getFocusedCodeEditor() ?? undefined;
	}
}

export class GotoSymbolAction extends EditorAction {

	static readonly ID = 'editor.action.quickOutline';

	constructor() {
		super({
			id: GotoSymbolAction.ID,
			label: QuickOutlineNLS.quickOutlineActionLabel,
			alias: 'Go to Symbol...',
			precondition: EditorContextKeys.hasDocumentSymbolProvider,
			kbOpts: {
				kbExpr: EditorContextKeys.focus,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyO,
				weight: KeybindingWeight.EditorContrib
			},
			contextMenuOpts: {
				group: 'navigation',
				order: 3
			}
		});
	}

	run(accessor: ServicesAccessor): void {
		accessor.get(IQuickInputService).quickAccess.show(AbstractGotoSymbolQuickAccessProvider.PREFIX, { itemActivation: ItemActivation.NONE });
	}
}

registerEditorAction(GotoSymbolAction);

Registry.as<IQuickAccessRegistry>(Extensions.Quickaccess).registerQuickAccessProvider({
	ctor: StandaloneGotoSymbolQuickAccessProvider,
	prefix: AbstractGotoSymbolQuickAccessProvider.PREFIX,
	helpEntries: [
		{ description: QuickOutlineNLS.quickOutlineActionLabel, prefix: AbstractGotoSymbolQuickAccessProvider.PREFIX, commandId: GotoSymbolAction.ID },
		{ description: QuickOutlineNLS.quickOutlineByCategoryActionLabel, prefix: AbstractGotoSymbolQuickAccessProvider.PREFIX_BY_CATEGORY }
	]
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess.ts]---
Location: vscode-main/src/vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Registry } from '../../../../platform/registry/common/platform.js';
import { IQuickAccessRegistry, Extensions } from '../../../../platform/quickinput/common/quickAccess.js';
import { QuickHelpNLS } from '../../../common/standaloneStrings.js';
import { HelpQuickAccessProvider } from '../../../../platform/quickinput/browser/helpQuickAccess.js';

Registry.as<IQuickAccessRegistry>(Extensions.Quickaccess).registerQuickAccessProvider({
	ctor: HelpQuickAccessProvider,
	prefix: '',
	helpEntries: [{ description: QuickHelpNLS.helpQuickAccessActionLabel }]
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/browser/quickInput/standaloneQuickInput.css]---
Location: vscode-main/src/vs/editor/standalone/browser/quickInput/standaloneQuickInput.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.quick-input-widget {
	font-size: 13px;
}

.quick-input-widget .monaco-highlighted-label .highlight,
.quick-input-widget .monaco-highlighted-label .highlight {
	color: #0066BF;
}

.vs .quick-input-widget .monaco-list-row.focused .monaco-highlighted-label .highlight,
.vs .quick-input-widget .monaco-list-row.focused .monaco-highlighted-label .highlight {
	color: #9DDDFF;
}

.vs-dark .quick-input-widget .monaco-highlighted-label .highlight,
.vs-dark .quick-input-widget .monaco-highlighted-label .highlight {
	color: #0097fb;
}

.hc-black .quick-input-widget .monaco-highlighted-label .highlight,
.hc-black .quick-input-widget .monaco-highlighted-label .highlight {
	color: #F38518;
}

.hc-light .quick-input-widget .monaco-highlighted-label .highlight,
.hc-light .quick-input-widget .monaco-highlighted-label .highlight {
	color: #0F4A85;
}

.monaco-keybinding > .monaco-keybinding-key {
	background-color: rgba(221, 221, 221, 0.4);
	border: solid 1px rgba(204, 204, 204, 0.4);
	border-bottom-color: rgba(187, 187, 187, 0.4);
	box-shadow: inset 0 -1px 0 rgba(187, 187, 187, 0.4);
	color: #555;
}

.hc-black .monaco-keybinding > .monaco-keybinding-key {
	background-color: transparent;
	border: solid 1px rgb(111, 195, 223);
	box-shadow: none;
	color: #fff;
}

.hc-light .monaco-keybinding > .monaco-keybinding-key {
	background-color: transparent;
	border: solid 1px #0F4A85;
	box-shadow: none;
	color: #292929;
}

.vs-dark .monaco-keybinding > .monaco-keybinding-key {
	background-color: rgba(128, 128, 128, 0.17);
	border: solid 1px rgba(51, 51, 51, 0.6);
	border-bottom-color: rgba(68, 68, 68, 0.6);
	box-shadow: inset 0 -1px 0 rgba(68, 68, 68, 0.6);
	color: #ccc;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/browser/quickInput/standaloneQuickInputService.ts]---
Location: vscode-main/src/vs/editor/standalone/browser/quickInput/standaloneQuickInputService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './standaloneQuickInput.css';
import { Event } from '../../../../base/common/event.js';
import { ICodeEditor, IOverlayWidget, IOverlayWidgetPosition } from '../../../browser/editorBrowser.js';
import { EditorContributionInstantiation, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { IEditorContribution } from '../../../common/editorCommon.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IQuickInputService, IQuickPickItem, IQuickPick, IInputBox, IQuickNavigateConfiguration, IPickOptions, QuickPickInput, IInputOptions, IQuickWidget, IQuickTree, IQuickTreeItem } from '../../../../platform/quickinput/common/quickInput.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { EditorScopedLayoutService } from '../standaloneLayoutService.js';
import { ICodeEditorService } from '../../../browser/services/codeEditorService.js';
import { QuickInputController, IQuickInputControllerHost } from '../../../../platform/quickinput/browser/quickInputController.js';
import { QuickInputService } from '../../../../platform/quickinput/browser/quickInputService.js';
import { createSingleCallFunction } from '../../../../base/common/functional.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';

class EditorScopedQuickInputService extends QuickInputService {

	private host: IQuickInputControllerHost | undefined = undefined;

	constructor(
		editor: ICodeEditor,
		@IInstantiationService instantiationService: IInstantiationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IThemeService themeService: IThemeService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@IConfigurationService configurationService: IConfigurationService,
	) {
		super(
			instantiationService,
			contextKeyService,
			themeService,
			new EditorScopedLayoutService(editor.getContainerDomNode(), codeEditorService),
			configurationService,
		);

		// Use the passed in code editor as host for the quick input widget
		const contribution = QuickInputEditorContribution.get(editor);
		if (contribution) {
			const widget = contribution.widget;
			this.host = {
				_serviceBrand: undefined,
				get mainContainer() { return widget.getDomNode(); },
				getContainer() { return widget.getDomNode(); },
				whenContainerStylesLoaded() { return undefined; },
				get containers() { return [widget.getDomNode()]; },
				get activeContainer() { return widget.getDomNode(); },
				get mainContainerDimension() { return editor.getLayoutInfo(); },
				get activeContainerDimension() { return editor.getLayoutInfo(); },
				get onDidLayoutMainContainer() { return editor.onDidLayoutChange; },
				get onDidLayoutActiveContainer() { return editor.onDidLayoutChange; },
				get onDidLayoutContainer() { return Event.map(editor.onDidLayoutChange, dimension => ({ container: widget.getDomNode(), dimension })); },
				get onDidChangeActiveContainer() { return Event.None; },
				get onDidAddContainer() { return Event.None; },
				get mainContainerOffset() { return { top: 0, quickPickTop: 0 }; },
				get activeContainerOffset() { return { top: 0, quickPickTop: 0 }; },
				focus: () => editor.focus()
			};
		} else {
			this.host = undefined;
		}
	}

	protected override createController(): QuickInputController {
		return super.createController(this.host);
	}
}

export class StandaloneQuickInputService implements IQuickInputService {

	declare readonly _serviceBrand: undefined;

	private mapEditorToService = new Map<ICodeEditor, EditorScopedQuickInputService>();
	private get activeService(): IQuickInputService {
		const editor = this.codeEditorService.getFocusedCodeEditor();
		if (!editor) {
			throw new Error('Quick input service needs a focused editor to work.');
		}

		// Find the quick input implementation for the focused
		// editor or create it lazily if not yet created
		let quickInputService = this.mapEditorToService.get(editor);
		if (!quickInputService) {
			const newQuickInputService = quickInputService = this.instantiationService.createInstance(EditorScopedQuickInputService, editor);
			this.mapEditorToService.set(editor, quickInputService);

			createSingleCallFunction(editor.onDidDispose)(() => {
				newQuickInputService.dispose();
				this.mapEditorToService.delete(editor);
			});
		}

		return quickInputService;
	}

	get currentQuickInput() { return this.activeService.currentQuickInput; }
	get quickAccess() { return this.activeService.quickAccess; }
	get backButton() { return this.activeService.backButton; }
	get onShow() { return this.activeService.onShow; }
	get onHide() { return this.activeService.onHide; }

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ICodeEditorService private readonly codeEditorService: ICodeEditorService
	) {
	}

	pick<T extends IQuickPickItem, O extends IPickOptions<T>>(picks: Promise<QuickPickInput<T>[]> | QuickPickInput<T>[], options?: O, token: CancellationToken = CancellationToken.None): Promise<(O extends { canPickMany: true } ? T[] : T) | undefined> {
		return (this.activeService as unknown as QuickInputController /* TS fail */).pick(picks, options, token);
	}

	input(options?: IInputOptions | undefined, token?: CancellationToken | undefined): Promise<string | undefined> {
		return this.activeService.input(options, token);
	}

	createQuickPick<T extends IQuickPickItem>(options: { useSeparators: true }): IQuickPick<T, { useSeparators: true }>;
	createQuickPick<T extends IQuickPickItem>(options?: { useSeparators: boolean }): IQuickPick<T, { useSeparators: false }>;
	createQuickPick<T extends IQuickPickItem>(options: { useSeparators: boolean } = { useSeparators: false }): IQuickPick<T, { useSeparators: boolean }> {
		return this.activeService.createQuickPick(options);
	}

	createInputBox(): IInputBox {
		return this.activeService.createInputBox();
	}

	createQuickWidget(): IQuickWidget {
		return this.activeService.createQuickWidget();
	}

	createQuickTree<T extends IQuickTreeItem>(): IQuickTree<T> {
		return this.activeService.createQuickTree();
	}

	focus(): void {
		return this.activeService.focus();
	}

	toggle(): void {
		return this.activeService.toggle();
	}

	navigate(next: boolean, quickNavigate?: IQuickNavigateConfiguration | undefined): void {
		return this.activeService.navigate(next, quickNavigate);
	}

	accept(): Promise<void> {
		return this.activeService.accept();
	}

	back(): Promise<void> {
		return this.activeService.back();
	}

	cancel(): Promise<void> {
		return this.activeService.cancel();
	}

	setAlignment(alignment: 'top' | 'center' | { top: number; left: number }): void {
		return this.activeService.setAlignment(alignment);
	}

	toggleHover(): void {
		return this.activeService.toggleHover();
	}
}

export class QuickInputEditorContribution implements IEditorContribution {

	static readonly ID = 'editor.controller.quickInput';

	static get(editor: ICodeEditor): QuickInputEditorContribution | null {
		return editor.getContribution<QuickInputEditorContribution>(QuickInputEditorContribution.ID);
	}

	readonly widget: QuickInputEditorWidget;

	constructor(private editor: ICodeEditor) {
		this.widget = new QuickInputEditorWidget(this.editor);
	}

	dispose(): void {
		this.widget.dispose();
	}
}

export class QuickInputEditorWidget implements IOverlayWidget {

	private static readonly ID = 'editor.contrib.quickInputWidget';

	private domNode: HTMLElement;

	constructor(private codeEditor: ICodeEditor) {
		this.domNode = document.createElement('div');

		this.codeEditor.addOverlayWidget(this);
	}

	getId(): string {
		return QuickInputEditorWidget.ID;
	}

	getDomNode(): HTMLElement {
		return this.domNode;
	}

	getPosition(): IOverlayWidgetPosition | null {
		return { preference: { top: 0, left: 0 } };
	}

	dispose(): void {
		this.codeEditor.removeOverlayWidget(this);
	}
}

registerEditorContribution(QuickInputEditorContribution.ID, QuickInputEditorContribution, EditorContributionInstantiation.Lazy);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch.ts]---
Location: vscode-main/src/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorContributionInstantiation, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { ICodeEditorService } from '../../../browser/services/codeEditorService.js';
import { ReferencesController } from '../../../contrib/gotoSymbol/browser/peek/referencesController.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';

export class StandaloneReferencesController extends ReferencesController {

	public constructor(
		editor: ICodeEditor,
		@IContextKeyService contextKeyService: IContextKeyService,
		@ICodeEditorService editorService: ICodeEditorService,
		@INotificationService notificationService: INotificationService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IStorageService storageService: IStorageService,
		@IConfigurationService configurationService: IConfigurationService,
	) {
		super(
			true,
			editor,
			contextKeyService,
			editorService,
			notificationService,
			instantiationService,
			storageService,
			configurationService
		);
	}
}

registerEditorContribution(ReferencesController.ID, StandaloneReferencesController, EditorContributionInstantiation.Lazy);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/browser/services/standaloneWebWorkerService.ts]---
Location: vscode-main/src/vs/editor/standalone/browser/services/standaloneWebWorkerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getMonacoEnvironment } from '../../../../base/browser/browser.js';
import { WebWorkerDescriptor } from '../../../../platform/webWorker/browser/webWorkerDescriptor.js';
import { WebWorkerService } from '../../../../platform/webWorker/browser/webWorkerServiceImpl.js';

export class StandaloneWebWorkerService extends WebWorkerService {
	protected override _createWorker(descriptor: WebWorkerDescriptor): Promise<Worker> {
		const monacoEnvironment = getMonacoEnvironment();
		if (monacoEnvironment) {
			if (typeof monacoEnvironment.getWorker === 'function') {
				const worker = monacoEnvironment.getWorker('workerMain.js', descriptor.label);
				if (worker !== undefined) {
					return Promise.resolve(worker);
				}
			}
		}

		return super._createWorker(descriptor);
	}

	override getWorkerUrl(descriptor: WebWorkerDescriptor): string {
		const monacoEnvironment = getMonacoEnvironment();
		if (monacoEnvironment) {
			if (typeof monacoEnvironment.getWorkerUrl === 'function') {
				const workerUrl = monacoEnvironment.getWorkerUrl('workerMain.js', descriptor.label);
				if (workerUrl !== undefined) {
					const absoluteUrl = new URL(workerUrl, document.baseURI).toString();
					return absoluteUrl;
				}
			}
		}

		if (!descriptor.esmModuleLocationBundler) {
			throw new Error(`You must define a function MonacoEnvironment.getWorkerUrl or MonacoEnvironment.getWorker for the worker label: ${descriptor.label}`);
		}

		const url = typeof descriptor.esmModuleLocationBundler === 'function' ? descriptor.esmModuleLocationBundler() : descriptor.esmModuleLocationBundler;
		const urlStr = url.toString();
		return urlStr;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast.ts]---
Location: vscode-main/src/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, ServicesAccessor, registerEditorAction } from '../../../browser/editorExtensions.js';
import { IStandaloneThemeService } from '../../common/standaloneTheme.js';
import { ToggleHighContrastNLS } from '../../../common/standaloneStrings.js';
import { isDark, isHighContrast } from '../../../../platform/theme/common/theme.js';
import { HC_BLACK_THEME_NAME, HC_LIGHT_THEME_NAME, VS_DARK_THEME_NAME, VS_LIGHT_THEME_NAME } from '../standaloneThemeService.js';

class ToggleHighContrast extends EditorAction {

	private _originalThemeName: string | null;

	constructor() {
		super({
			id: 'editor.action.toggleHighContrast',
			label: ToggleHighContrastNLS.toggleHighContrast,
			alias: 'Toggle High Contrast Theme',
			precondition: undefined
		});
		this._originalThemeName = null;
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const standaloneThemeService = accessor.get(IStandaloneThemeService);
		const currentTheme = standaloneThemeService.getColorTheme();
		if (isHighContrast(currentTheme.type)) {
			// We must toggle back to the integrator's theme
			standaloneThemeService.setTheme(this._originalThemeName || (isDark(currentTheme.type) ? VS_DARK_THEME_NAME : VS_LIGHT_THEME_NAME));
			this._originalThemeName = null;
		} else {
			standaloneThemeService.setTheme(isDark(currentTheme.type) ? HC_BLACK_THEME_NAME : HC_LIGHT_THEME_NAME);
			this._originalThemeName = currentTheme.themeName;
		}
	}
}

registerEditorAction(ToggleHighContrast);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/common/standaloneTheme.ts]---
Location: vscode-main/src/vs/editor/standalone/common/standaloneTheme.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Color } from '../../../base/common/color.js';
import { ITokenThemeRule, TokenTheme } from '../../common/languages/supports/tokenization.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { IColorTheme, IThemeService } from '../../../platform/theme/common/themeService.js';

export const IStandaloneThemeService = createDecorator<IStandaloneThemeService>('themeService');

export type BuiltinTheme = 'vs' | 'vs-dark' | 'hc-black' | 'hc-light';
export type IColors = { [colorId: string]: string };

export interface IStandaloneThemeData {
	base: BuiltinTheme;
	inherit: boolean;
	rules: ITokenThemeRule[];
	encodedTokensColors?: string[];
	colors: IColors;
}

export interface IStandaloneTheme extends IColorTheme {
	tokenTheme: TokenTheme;
	themeName: string;
}

export interface IStandaloneThemeService extends IThemeService {
	readonly _serviceBrand: undefined;

	setTheme(themeName: string): void;

	setAutoDetectHighContrast(autoDetectHighContrast: boolean): void;

	defineTheme(themeName: string, themeData: IStandaloneThemeData): void;

	getColorTheme(): IStandaloneTheme;

	setColorMapOverride(colorMapOverride: Color[] | null): void;

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/common/themes.ts]---
Location: vscode-main/src/vs/editor/standalone/common/themes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { editorActiveIndentGuide1, editorIndentGuide1 } from '../../common/core/editorColorRegistry.js';
import { IStandaloneThemeData } from './standaloneTheme.js';
import { editorBackground, editorForeground, editorInactiveSelection, editorSelectionHighlight } from '../../../platform/theme/common/colorRegistry.js';

/* -------------------------------- Begin vs theme -------------------------------- */
export const vs: IStandaloneThemeData = {
	base: 'vs',
	inherit: false,
	rules: [
		{ token: '', foreground: '000000', background: 'fffffe' },
		{ token: 'invalid', foreground: 'cd3131' },
		{ token: 'emphasis', fontStyle: 'italic' },
		{ token: 'strong', fontStyle: 'bold' },

		{ token: 'variable', foreground: '001188' },
		{ token: 'variable.predefined', foreground: '4864AA' },
		{ token: 'constant', foreground: 'dd0000' },
		{ token: 'comment', foreground: '008000' },
		{ token: 'number', foreground: '098658' },
		{ token: 'number.hex', foreground: '3030c0' },
		{ token: 'regexp', foreground: '800000' },
		{ token: 'annotation', foreground: '808080' },
		{ token: 'type', foreground: '008080' },

		{ token: 'delimiter', foreground: '000000' },
		{ token: 'delimiter.html', foreground: '383838' },
		{ token: 'delimiter.xml', foreground: '0000FF' },

		{ token: 'tag', foreground: '800000' },
		{ token: 'tag.id.pug', foreground: '4F76AC' },
		{ token: 'tag.class.pug', foreground: '4F76AC' },
		{ token: 'meta.scss', foreground: '800000' },
		{ token: 'metatag', foreground: 'e00000' },
		{ token: 'metatag.content.html', foreground: 'FF0000' },
		{ token: 'metatag.html', foreground: '808080' },
		{ token: 'metatag.xml', foreground: '808080' },
		{ token: 'metatag.php', fontStyle: 'bold' },

		{ token: 'key', foreground: '863B00' },
		{ token: 'string.key.json', foreground: 'A31515' },
		{ token: 'string.value.json', foreground: '0451A5' },

		{ token: 'attribute.name', foreground: 'FF0000' },
		{ token: 'attribute.value', foreground: '0451A5' },
		{ token: 'attribute.value.number', foreground: '098658' },
		{ token: 'attribute.value.unit', foreground: '098658' },
		{ token: 'attribute.value.html', foreground: '0000FF' },
		{ token: 'attribute.value.xml', foreground: '0000FF' },

		{ token: 'string', foreground: 'A31515' },
		{ token: 'string.html', foreground: '0000FF' },
		{ token: 'string.sql', foreground: 'FF0000' },
		{ token: 'string.yaml', foreground: '0451A5' },

		{ token: 'keyword', foreground: '0000FF' },
		{ token: 'keyword.json', foreground: '0451A5' },
		{ token: 'keyword.flow', foreground: 'AF00DB' },
		{ token: 'keyword.flow.scss', foreground: '0000FF' },

		{ token: 'operator.scss', foreground: '666666' },
		{ token: 'operator.sql', foreground: '778899' },
		{ token: 'operator.swift', foreground: '666666' },
		{ token: 'predefined.sql', foreground: 'C700C7' },
	],
	colors: {
		[editorBackground]: '#FFFFFE',
		[editorForeground]: '#000000',
		[editorInactiveSelection]: '#E5EBF1',
		[editorIndentGuide1]: '#D3D3D3',
		[editorActiveIndentGuide1]: '#939393',
		[editorSelectionHighlight]: '#ADD6FF4D'
	}
};
/* -------------------------------- End vs theme -------------------------------- */


/* -------------------------------- Begin vs-dark theme -------------------------------- */
export const vs_dark: IStandaloneThemeData = {
	base: 'vs-dark',
	inherit: false,
	rules: [
		{ token: '', foreground: 'D4D4D4', background: '1E1E1E' },
		{ token: 'invalid', foreground: 'f44747' },
		{ token: 'emphasis', fontStyle: 'italic' },
		{ token: 'strong', fontStyle: 'bold' },

		{ token: 'variable', foreground: '74B0DF' },
		{ token: 'variable.predefined', foreground: '4864AA' },
		{ token: 'variable.parameter', foreground: '9CDCFE' },
		{ token: 'constant', foreground: '569CD6' },
		{ token: 'comment', foreground: '608B4E' },
		{ token: 'number', foreground: 'B5CEA8' },
		{ token: 'number.hex', foreground: '5BB498' },
		{ token: 'regexp', foreground: 'B46695' },
		{ token: 'annotation', foreground: 'cc6666' },
		{ token: 'type', foreground: '3DC9B0' },

		{ token: 'delimiter', foreground: 'DCDCDC' },
		{ token: 'delimiter.html', foreground: '808080' },
		{ token: 'delimiter.xml', foreground: '808080' },

		{ token: 'tag', foreground: '569CD6' },
		{ token: 'tag.id.pug', foreground: '4F76AC' },
		{ token: 'tag.class.pug', foreground: '4F76AC' },
		{ token: 'meta.scss', foreground: 'A79873' },
		{ token: 'meta.tag', foreground: 'CE9178' },
		{ token: 'metatag', foreground: 'DD6A6F' },
		{ token: 'metatag.content.html', foreground: '9CDCFE' },
		{ token: 'metatag.html', foreground: '569CD6' },
		{ token: 'metatag.xml', foreground: '569CD6' },
		{ token: 'metatag.php', fontStyle: 'bold' },

		{ token: 'key', foreground: '9CDCFE' },
		{ token: 'string.key.json', foreground: '9CDCFE' },
		{ token: 'string.value.json', foreground: 'CE9178' },

		{ token: 'attribute.name', foreground: '9CDCFE' },
		{ token: 'attribute.value', foreground: 'CE9178' },
		{ token: 'attribute.value.number.css', foreground: 'B5CEA8' },
		{ token: 'attribute.value.unit.css', foreground: 'B5CEA8' },
		{ token: 'attribute.value.hex.css', foreground: 'D4D4D4' },

		{ token: 'string', foreground: 'CE9178' },
		{ token: 'string.sql', foreground: 'FF0000' },

		{ token: 'keyword', foreground: '569CD6' },
		{ token: 'keyword.flow', foreground: 'C586C0' },
		{ token: 'keyword.json', foreground: 'CE9178' },
		{ token: 'keyword.flow.scss', foreground: '569CD6' },

		{ token: 'operator.scss', foreground: '909090' },
		{ token: 'operator.sql', foreground: '778899' },
		{ token: 'operator.swift', foreground: '909090' },
		{ token: 'predefined.sql', foreground: 'FF00FF' },
	],
	colors: {
		[editorBackground]: '#1E1E1E',
		[editorForeground]: '#D4D4D4',
		[editorInactiveSelection]: '#3A3D41',
		[editorIndentGuide1]: '#404040',
		[editorActiveIndentGuide1]: '#707070',
		[editorSelectionHighlight]: '#ADD6FF26'
	}
};
/* -------------------------------- End vs-dark theme -------------------------------- */



/* -------------------------------- Begin hc-black theme -------------------------------- */
export const hc_black: IStandaloneThemeData = {
	base: 'hc-black',
	inherit: false,
	rules: [
		{ token: '', foreground: 'FFFFFF', background: '000000' },
		{ token: 'invalid', foreground: 'f44747' },
		{ token: 'emphasis', fontStyle: 'italic' },
		{ token: 'strong', fontStyle: 'bold' },

		{ token: 'variable', foreground: '1AEBFF' },
		{ token: 'variable.parameter', foreground: '9CDCFE' },
		{ token: 'constant', foreground: '569CD6' },
		{ token: 'comment', foreground: '608B4E' },
		{ token: 'number', foreground: 'FFFFFF' },
		{ token: 'regexp', foreground: 'C0C0C0' },
		{ token: 'annotation', foreground: '569CD6' },
		{ token: 'type', foreground: '3DC9B0' },

		{ token: 'delimiter', foreground: 'FFFF00' },
		{ token: 'delimiter.html', foreground: 'FFFF00' },

		{ token: 'tag', foreground: '569CD6' },
		{ token: 'tag.id.pug', foreground: '4F76AC' },
		{ token: 'tag.class.pug', foreground: '4F76AC' },
		{ token: 'meta', foreground: 'D4D4D4' },
		{ token: 'meta.tag', foreground: 'CE9178' },
		{ token: 'metatag', foreground: '569CD6' },
		{ token: 'metatag.content.html', foreground: '1AEBFF' },
		{ token: 'metatag.html', foreground: '569CD6' },
		{ token: 'metatag.xml', foreground: '569CD6' },
		{ token: 'metatag.php', fontStyle: 'bold' },

		{ token: 'key', foreground: '9CDCFE' },
		{ token: 'string.key', foreground: '9CDCFE' },
		{ token: 'string.value', foreground: 'CE9178' },

		{ token: 'attribute.name', foreground: '569CD6' },
		{ token: 'attribute.value', foreground: '3FF23F' },

		{ token: 'string', foreground: 'CE9178' },
		{ token: 'string.sql', foreground: 'FF0000' },

		{ token: 'keyword', foreground: '569CD6' },
		{ token: 'keyword.flow', foreground: 'C586C0' },

		{ token: 'operator.sql', foreground: '778899' },
		{ token: 'operator.swift', foreground: '909090' },
		{ token: 'predefined.sql', foreground: 'FF00FF' },
	],
	colors: {
		[editorBackground]: '#000000',
		[editorForeground]: '#FFFFFF',
		[editorIndentGuide1]: '#FFFFFF',
		[editorActiveIndentGuide1]: '#FFFFFF',
	}
};
/* -------------------------------- End hc-black theme -------------------------------- */

/* -------------------------------- Begin hc-light theme -------------------------------- */
export const hc_light: IStandaloneThemeData = {
	base: 'hc-light',
	inherit: false,
	rules: [
		{ token: '', foreground: '292929', background: 'FFFFFF' },
		{ token: 'invalid', foreground: 'B5200D' },
		{ token: 'emphasis', fontStyle: 'italic' },
		{ token: 'strong', fontStyle: 'bold' },

		{ token: 'variable', foreground: '264F70' },
		{ token: 'variable.predefined', foreground: '4864AA' },
		{ token: 'constant', foreground: 'dd0000' },
		{ token: 'comment', foreground: '008000' },
		{ token: 'number', foreground: '098658' },
		{ token: 'number.hex', foreground: '3030c0' },
		{ token: 'regexp', foreground: '800000' },
		{ token: 'annotation', foreground: '808080' },
		{ token: 'type', foreground: '008080' },

		{ token: 'delimiter', foreground: '000000' },
		{ token: 'delimiter.html', foreground: '383838' },

		{ token: 'tag', foreground: '800000' },
		{ token: 'tag.id.pug', foreground: '4F76AC' },
		{ token: 'tag.class.pug', foreground: '4F76AC' },
		{ token: 'meta.scss', foreground: '800000' },
		{ token: 'metatag', foreground: 'e00000' },
		{ token: 'metatag.content.html', foreground: 'B5200D' },
		{ token: 'metatag.html', foreground: '808080' },
		{ token: 'metatag.xml', foreground: '808080' },
		{ token: 'metatag.php', fontStyle: 'bold' },

		{ token: 'key', foreground: '863B00' },
		{ token: 'string.key.json', foreground: 'A31515' },
		{ token: 'string.value.json', foreground: '0451A5' },

		{ token: 'attribute.name', foreground: '264F78' },
		{ token: 'attribute.value', foreground: '0451A5' },

		{ token: 'string', foreground: 'A31515' },
		{ token: 'string.sql', foreground: 'B5200D' },

		{ token: 'keyword', foreground: '0000FF' },
		{ token: 'keyword.flow', foreground: 'AF00DB' },

		{ token: 'operator.sql', foreground: '778899' },
		{ token: 'operator.swift', foreground: '666666' },
		{ token: 'predefined.sql', foreground: 'C700C7' },
	],
	colors: {
		[editorBackground]: '#FFFFFF',
		[editorForeground]: '#292929',
		[editorIndentGuide1]: '#292929',
		[editorActiveIndentGuide1]: '#292929',
	}
};
/* -------------------------------- End hc-light theme -------------------------------- */
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/common/monarch/monarchCommon.ts]---
Location: vscode-main/src/vs/editor/standalone/common/monarch/monarchCommon.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { escapeRegExpCharacters } from '../../../../base/common/strings.js';

/*
 * This module exports common types and functionality shared between
 * the Monarch compiler that compiles JSON to ILexer, and the Monarch
 * Tokenizer (that highlights at runtime)
 */

/*
 * Type definitions to be used internally to Monarch.
 * Inside monarch we use fully typed definitions and compiled versions of the more abstract JSON descriptions.
 */

export const enum MonarchBracket {
	None = 0,
	Open = 1,
	Close = -1
}

export interface ILexerMin {
	languageId: string;
	includeLF: boolean;
	noThrow: boolean;
	ignoreCase: boolean;
	unicode: boolean;
	usesEmbedded: boolean;
	defaultToken: string;
	stateNames: { [stateName: string]: any };
	[attr: string]: any;
}

export interface ILexer extends ILexerMin {
	maxStack: number;
	start: string | null;
	ignoreCase: boolean;
	unicode: boolean;
	tokenPostfix: string;

	tokenizer: { [stateName: string]: IRule[] };
	brackets: IBracket[];
}

export interface IBracket {
	token: string;
	open: string;
	close: string;
}

export type FuzzyAction = IAction | string;

export function isFuzzyActionArr(what: FuzzyAction | FuzzyAction[]): what is FuzzyAction[] {
	return (Array.isArray(what));
}

export function isFuzzyAction(what: FuzzyAction | FuzzyAction[]): what is FuzzyAction {
	return !isFuzzyActionArr(what);
}

export function isString(what: FuzzyAction): what is string {
	return (typeof what === 'string');
}

export function isIAction(what: FuzzyAction): what is IAction {
	return !isString(what);
}

export interface IRule {
	action: FuzzyAction;
	matchOnlyAtLineStart: boolean;
	name: string;
	resolveRegex(state: string): RegExp;
}

export interface IAction {
	// an action is either a group of actions
	group?: FuzzyAction[];

	hasEmbeddedEndInCases?: boolean;
	// or a function that returns a fresh action
	test?: (id: string, matches: string[], state: string, eos: boolean) => FuzzyAction;

	// or it is a declarative action with a token value and various other attributes
	token?: string;
	tokenSubst?: boolean;
	next?: string;
	nextEmbedded?: string;
	bracket?: MonarchBracket;
	log?: string;
	switchTo?: string;
	goBack?: number;
	transform?: (states: string[]) => string[];
}

export interface IBranch {
	name: string;
	value: FuzzyAction;
	test?: (id: string, matches: string[], state: string, eos: boolean) => boolean;
}

// Small helper functions

/**
 * Is a string null, undefined, or empty?
 */
export function empty(s: string): boolean {
	return (s ? false : true);
}

/**
 * Puts a string to lower case if 'ignoreCase' is set.
 */
export function fixCase(lexer: ILexerMin, str: string): string {
	return (lexer.ignoreCase && str ? str.toLowerCase() : str);
}

/**
 * Ensures there are no bad characters in a CSS token class.
 */
export function sanitize(s: string) {
	return s.replace(/[&<>'"_]/g, '-'); // used on all output token CSS classes
}

// Logging

/**
 * Logs a message.
 */
export function log(lexer: ILexerMin, msg: string) {
	console.log(`${lexer.languageId}: ${msg}`);
}

// Throwing errors

export function createError(lexer: ILexerMin, msg: string): Error {
	return new Error(`${lexer.languageId}: ${msg}`);
}

// Helper functions for rule finding and substitution

/**
 * substituteMatches is used on lexer strings and can substitutes predefined patterns:
 * 		$$  => $
 * 		$#  => id
 * 		$n  => matched entry n
 * 		@attr => contents of lexer[attr]
 *
 * See documentation for more info
 */
export function substituteMatches(lexer: ILexerMin, str: string, id: string, matches: string[], state: string): string {
	const re = /\$((\$)|(#)|(\d\d?)|[sS](\d\d?)|@(\w+))/g;
	let stateMatches: string[] | null = null;
	return str.replace(re, function (full, sub?, dollar?, hash?, n?, s?, attr?, ofs?, total?) {
		if (!empty(dollar)) {
			return '$'; // $$
		}
		if (!empty(hash)) {
			return fixCase(lexer, id);   // default $#
		}
		if (!empty(n) && n < matches.length) {
			return fixCase(lexer, matches[n]); // $n
		}
		if (!empty(attr) && lexer && typeof (lexer[attr]) === 'string') {
			return lexer[attr]; //@attribute
		}
		if (stateMatches === null) { // split state on demand
			stateMatches = state.split('.');
			stateMatches.unshift(state);
		}
		if (!empty(s) && s < stateMatches.length) {
			return fixCase(lexer, stateMatches[s]); //$Sn
		}
		return '';
	});
}

/**
 * substituteMatchesRe is used on lexer regex rules and can substitutes predefined patterns:
 * 		$Sn => n'th part of state
 *
 */
export function substituteMatchesRe(lexer: ILexerMin, str: string, state: string): string {
	const re = /\$[sS](\d\d?)/g;
	let stateMatches: string[] | null = null;
	return str.replace(re, function (full, s) {
		if (stateMatches === null) { // split state on demand
			stateMatches = state.split('.');
			stateMatches.unshift(state);
		}
		if (!empty(s) && s < stateMatches.length) {
			return escapeRegExpCharacters(fixCase(lexer, stateMatches[s])); //$Sn
		}
		return '';
	});
}

/**
 * Find the tokenizer rules for a specific state (i.e. next action)
 */
export function findRules(lexer: ILexer, inState: string): IRule[] | null {
	let state: string | null = inState;
	while (state && state.length > 0) {
		const rules = lexer.tokenizer[state];
		if (rules) {
			return rules;
		}

		const idx = state.lastIndexOf('.');
		if (idx < 0) {
			state = null; // no further parent
		} else {
			state = state.substr(0, idx);
		}
	}
	return null;
}

/**
 * Is a certain state defined? In contrast to 'findRules' this works on a ILexerMin.
 * This is used during compilation where we may know the defined states
 * but not yet whether the corresponding rules are correct.
 */
export function stateExists(lexer: ILexerMin, inState: string): boolean {
	let state: string | null = inState;
	while (state && state.length > 0) {
		const exist = lexer.stateNames[state];
		if (exist) {
			return true;
		}

		const idx = state.lastIndexOf('.');
		if (idx < 0) {
			state = null; // no further parent
		} else {
			state = state.substr(0, idx);
		}
	}
	return false;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/common/monarch/monarchCompile.ts]---
Location: vscode-main/src/vs/editor/standalone/common/monarch/monarchCompile.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/*
 * This module only exports 'compile' which compiles a JSON language definition
 * into a typed and checked ILexer definition.
 */

import { isString } from '../../../../base/common/types.js';
import * as monarchCommon from './monarchCommon.js';
import { IMonarchLanguage, IMonarchLanguageBracket } from './monarchTypes.js';

/*
 * Type helpers
 *
 * Note: this is just for sanity checks on the JSON description which is
 * helpful for the programmer. No checks are done anymore once the lexer is
 * already 'compiled and checked'.
 *
 */

function isArrayOf(elemType: (x: any) => boolean, obj: any): boolean {
	if (!obj) {
		return false;
	}
	if (!(Array.isArray(obj))) {
		return false;
	}
	for (const el of obj) {
		if (!(elemType(el))) {
			return false;
		}
	}
	return true;
}

function bool(prop: any, defValue: boolean): boolean {
	if (typeof prop === 'boolean') {
		return prop;
	}
	return defValue;
}

function string(prop: any, defValue: string): string {
	if (typeof (prop) === 'string') {
		return prop;
	}
	return defValue;
}


function arrayToHash(array: string[]): { [name: string]: true } {
	const result: any = {};
	for (const e of array) {
		result[e] = true;
	}
	return result;
}


function createKeywordMatcher(arr: string[], caseInsensitive: boolean = false): (str: string) => boolean {
	if (caseInsensitive) {
		arr = arr.map(function (x) { return x.toLowerCase(); });
	}
	const hash = arrayToHash(arr);
	if (caseInsensitive) {
		return function (word) {
			return hash[word.toLowerCase()] !== undefined && hash.hasOwnProperty(word.toLowerCase());
		};
	} else {
		return function (word) {
			return hash[word] !== undefined && hash.hasOwnProperty(word);
		};
	}
}


// Lexer helpers

/**
 * Compiles a regular expression string, adding the 'i' flag if 'ignoreCase' is set, and the 'u' flag if 'unicode' is set.
 * Also replaces @\w+ or sequences with the content of the specified attribute
 * @\w+ replacement can be avoided by escaping `@` signs with another `@` sign.
 * @example /@attr/ will be replaced with the value of lexer[attr]
 * @example /@@text/ will not be replaced and will become /@text/.
 */
function compileRegExp<S extends true | false>(lexer: monarchCommon.ILexerMin, str: string, handleSn: S): S extends true ? RegExp | DynamicRegExp : RegExp;
function compileRegExp(lexer: monarchCommon.ILexerMin, str: string, handleSn: true | false): RegExp | DynamicRegExp {
	// @@ must be interpreted as a literal @, so we replace all occurences of @@ with a placeholder character
	str = str.replace(/@@/g, `\x01`);

	let n = 0;
	let hadExpansion: boolean;
	do {
		hadExpansion = false;
		str = str.replace(/@(\w+)/g, function (s, attr?) {
			hadExpansion = true;
			let sub = '';
			if (typeof (lexer[attr]) === 'string') {
				sub = lexer[attr];
			} else if (lexer[attr] && lexer[attr] instanceof RegExp) {
				sub = lexer[attr].source;
			} else {
				if (lexer[attr] === undefined) {
					throw monarchCommon.createError(lexer, 'language definition does not contain attribute \'' + attr + '\', used at: ' + str);
				} else {
					throw monarchCommon.createError(lexer, 'attribute reference \'' + attr + '\' must be a string, used at: ' + str);
				}
			}
			return (monarchCommon.empty(sub) ? '' : '(?:' + sub + ')');
		});
		n++;
	} while (hadExpansion && n < 5);

	// handle escaped @@
	str = str.replace(/\x01/g, '@');

	const flags = (lexer.ignoreCase ? 'i' : '') + (lexer.unicode ? 'u' : '');

	// handle $Sn
	if (handleSn) {
		const match = str.match(/\$[sS](\d\d?)/g);
		if (match) {
			let lastState: string | null = null;
			let lastRegEx: RegExp | null = null;
			return (state: string) => {
				if (lastRegEx && lastState === state) {
					return lastRegEx;
				}
				lastState = state;
				lastRegEx = new RegExp(monarchCommon.substituteMatchesRe(lexer, str, state), flags);
				return lastRegEx;
			};
		}
	}

	return new RegExp(str, flags);
}

/**
 * Compiles guard functions for case matches.
 * This compiles 'cases' attributes into efficient match functions.
 *
 */
function selectScrutinee(id: string, matches: string[], state: string, num: number): string | null {
	if (num < 0) {
		return id;
	}
	if (num < matches.length) {
		return matches[num];
	}
	if (num >= 100) {
		num = num - 100;
		const parts = state.split('.');
		parts.unshift(state);
		if (num < parts.length) {
			return parts[num];
		}
	}
	return null;
}

function createGuard(lexer: monarchCommon.ILexerMin, ruleName: string, tkey: string, val: monarchCommon.FuzzyAction): monarchCommon.IBranch {
	// get the scrutinee and pattern
	let scrut = -1; // -1: $!, 0-99: $n, 100+n: $Sn
	let oppat = tkey;
	let matches = tkey.match(/^\$(([sS]?)(\d\d?)|#)(.*)$/);
	if (matches) {
		if (matches[3]) { // if digits
			scrut = parseInt(matches[3]);
			if (matches[2]) {
				scrut = scrut + 100; // if [sS] present
			}
		}
		oppat = matches[4];
	}
	// get operator
	let op = '~';
	let pat = oppat;
	if (!oppat || oppat.length === 0) {
		op = '!=';
		pat = '';
	}
	else if (/^\w*$/.test(pat)) {  // just a word
		op = '==';
	}
	else {
		matches = oppat.match(/^(@|!@|~|!~|==|!=)(.*)$/);
		if (matches) {
			op = matches[1];
			pat = matches[2];
		}
	}

	// set the tester function
	let tester: (s: string, id: string, matches: string[], state: string, eos: boolean) => boolean;

	// special case a regexp that matches just words
	if ((op === '~' || op === '!~') && /^(\w|\|)*$/.test(pat)) {
		const inWords = createKeywordMatcher(pat.split('|'), lexer.ignoreCase);
		tester = function (s) { return (op === '~' ? inWords(s) : !inWords(s)); };
	}
	else if (op === '@' || op === '!@') {
		const words = lexer[pat];
		if (!words) {
			throw monarchCommon.createError(lexer, 'the @ match target \'' + pat + '\' is not defined, in rule: ' + ruleName);
		}
		if (!(isArrayOf(function (elem) { return (typeof (elem) === 'string'); }, words))) {
			throw monarchCommon.createError(lexer, 'the @ match target \'' + pat + '\' must be an array of strings, in rule: ' + ruleName);
		}
		const inWords = createKeywordMatcher(words, lexer.ignoreCase);
		tester = function (s) { return (op === '@' ? inWords(s) : !inWords(s)); };
	}
	else if (op === '~' || op === '!~') {
		if (pat.indexOf('$') < 0) {
			// precompile regular expression
			const re = compileRegExp(lexer, '^' + pat + '$', false);
			tester = function (s) { return (op === '~' ? re.test(s) : !re.test(s)); };
		}
		else {
			tester = function (s, id, matches, state) {
				const re = compileRegExp(lexer, '^' + monarchCommon.substituteMatches(lexer, pat, id, matches, state) + '$', false);
				return re.test(s);
			};
		}
	}
	else { // if (op==='==' || op==='!=') {
		if (pat.indexOf('$') < 0) {
			const patx = monarchCommon.fixCase(lexer, pat);
			tester = function (s) { return (op === '==' ? s === patx : s !== patx); };
		}
		else {
			const patx = monarchCommon.fixCase(lexer, pat);
			tester = function (s, id, matches, state, eos) {
				const patexp = monarchCommon.substituteMatches(lexer, patx, id, matches, state);
				return (op === '==' ? s === patexp : s !== patexp);
			};
		}
	}

	// return the branch object
	if (scrut === -1) {
		return {
			name: tkey, value: val, test: function (id, matches, state, eos) {
				return tester(id, id, matches, state, eos);
			}
		};
	}
	else {
		return {
			name: tkey, value: val, test: function (id, matches, state, eos) {
				const scrutinee = selectScrutinee(id, matches, state, scrut);
				return tester(!scrutinee ? '' : scrutinee, id, matches, state, eos);
			}
		};
	}
}

/**
 * Compiles an action: i.e. optimize regular expressions and case matches
 * and do many sanity checks.
 *
 * This is called only during compilation but if the lexer definition
 * contains user functions as actions (which is usually not allowed), then this
 * may be called during lexing. It is important therefore to compile common cases efficiently
 */
function compileAction(lexer: monarchCommon.ILexerMin, ruleName: string, action: any): monarchCommon.FuzzyAction {
	if (!action) {
		return { token: '' };
	}
	else if (typeof (action) === 'string') {
		return action; // { token: action };
	}
	else if (action.token || action.token === '') {
		if (typeof (action.token) !== 'string') {
			throw monarchCommon.createError(lexer, 'a \'token\' attribute must be of type string, in rule: ' + ruleName);
		}
		else {
			// only copy specific typed fields (only happens once during compile Lexer)
			const newAction: monarchCommon.IAction = { token: action.token };
			if (action.token.indexOf('$') >= 0) {
				newAction.tokenSubst = true;
			}
			if (typeof (action.bracket) === 'string') {
				if (action.bracket === '@open') {
					newAction.bracket = monarchCommon.MonarchBracket.Open;
				} else if (action.bracket === '@close') {
					newAction.bracket = monarchCommon.MonarchBracket.Close;
				} else {
					throw monarchCommon.createError(lexer, 'a \'bracket\' attribute must be either \'@open\' or \'@close\', in rule: ' + ruleName);
				}
			}
			if (action.next) {
				if (typeof (action.next) !== 'string') {
					throw monarchCommon.createError(lexer, 'the next state must be a string value in rule: ' + ruleName);
				}
				else {
					let next: string = action.next;
					if (!/^(@pop|@push|@popall)$/.test(next)) {
						if (next[0] === '@') {
							next = next.substr(1); // peel off starting @ sign
						}
						if (next.indexOf('$') < 0) {  // no dollar substitution, we can check if the state exists
							if (!monarchCommon.stateExists(lexer, monarchCommon.substituteMatches(lexer, next, '', [], ''))) {
								throw monarchCommon.createError(lexer, 'the next state \'' + action.next + '\' is not defined in rule: ' + ruleName);
							}
						}
					}
					newAction.next = next;
				}
			}
			if (typeof (action.goBack) === 'number') {
				newAction.goBack = action.goBack;
			}
			if (typeof (action.switchTo) === 'string') {
				newAction.switchTo = action.switchTo;
			}
			if (typeof (action.log) === 'string') {
				newAction.log = action.log;
			}
			if (typeof (action.nextEmbedded) === 'string') {
				newAction.nextEmbedded = action.nextEmbedded;
				lexer.usesEmbedded = true;
			}
			return newAction;
		}
	}
	else if (Array.isArray(action)) {
		const results: monarchCommon.FuzzyAction[] = [];
		for (let i = 0, len = action.length; i < len; i++) {
			results[i] = compileAction(lexer, ruleName, action[i]);
		}
		return { group: results };
	}
	else if (action.cases) {
		// build an array of test cases
		const cases: monarchCommon.IBranch[] = [];

		let hasEmbeddedEndInCases = false;
		// for each case, push a test function and result value
		for (const tkey in action.cases) {
			if (action.cases.hasOwnProperty(tkey)) {
				const val = compileAction(lexer, ruleName, action.cases[tkey]);

				// what kind of case
				if (tkey === '@default' || tkey === '@' || tkey === '') {
					cases.push({ test: undefined, value: val, name: tkey });
				}
				else if (tkey === '@eos') {
					cases.push({ test: function (id, matches, state, eos) { return eos; }, value: val, name: tkey });
				}
				else {
					cases.push(createGuard(lexer, ruleName, tkey, val));  // call separate function to avoid local variable capture
				}

				if (!hasEmbeddedEndInCases) {
					hasEmbeddedEndInCases = !isString(val) && (val.hasEmbeddedEndInCases || ['@pop', '@popall'].includes(val.nextEmbedded || ''));
				}
			}
		}

		// create a matching function
		const def = lexer.defaultToken;
		return {
			hasEmbeddedEndInCases,
			test: function (id, matches, state, eos) {
				for (const _case of cases) {
					const didmatch = (!_case.test || _case.test(id, matches, state, eos));
					if (didmatch) {
						return _case.value;
					}
				}
				return def;
			}
		};
	}
	else {
		throw monarchCommon.createError(lexer, 'an action must be a string, an object with a \'token\' or \'cases\' attribute, or an array of actions; in rule: ' + ruleName);
	}
}

type DynamicRegExp = (state: string) => RegExp;

/**
 * Helper class for creating matching rules
 */
class Rule implements monarchCommon.IRule {
	private regex: RegExp | DynamicRegExp = new RegExp('');
	public action: monarchCommon.FuzzyAction = { token: '' };
	public matchOnlyAtLineStart: boolean = false;
	public name: string = '';

	constructor(name: string) {
		this.name = name;
	}

	public setRegex(lexer: monarchCommon.ILexerMin, re: string | RegExp): void {
		let sregex: string;
		if (typeof (re) === 'string') {
			sregex = re;
		}
		else if (re instanceof RegExp) {
			sregex = re.source;
		}
		else {
			throw monarchCommon.createError(lexer, 'rules must start with a match string or regular expression: ' + this.name);
		}

		this.matchOnlyAtLineStart = (sregex.length > 0 && sregex[0] === '^');
		this.name = this.name + ': ' + sregex;
		this.regex = compileRegExp(lexer, '^(?:' + (this.matchOnlyAtLineStart ? sregex.substr(1) : sregex) + ')', true);
	}

	public setAction(lexer: monarchCommon.ILexerMin, act: monarchCommon.IAction) {
		this.action = compileAction(lexer, this.name, act);
	}

	public resolveRegex(state: string): RegExp {
		if (this.regex instanceof RegExp) {
			return this.regex;
		} else {
			return this.regex(state);
		}
	}
}

/**
 * Compiles a json description function into json where all regular expressions,
 * case matches etc, are compiled and all include rules are expanded.
 * We also compile the bracket definitions, supply defaults, and do many sanity checks.
 * If the 'jsonStrict' parameter is 'false', we allow at certain locations
 * regular expression objects and functions that get called during lexing.
 * (Currently we have no samples that need this so perhaps we should always have
 * jsonStrict to true).
 */
export function compile(languageId: string, json: IMonarchLanguage): monarchCommon.ILexer {
	if (!json || typeof (json) !== 'object') {
		throw new Error('Monarch: expecting a language definition object');
	}

	// Create our lexer
	const lexer: monarchCommon.ILexer = {
		languageId: languageId,
		includeLF: bool(json.includeLF, false),
		noThrow: false, // raise exceptions during compilation
		maxStack: 100,
		start: (typeof json.start === 'string' ? json.start : null),
		ignoreCase: bool(json.ignoreCase, false),
		unicode: bool(json.unicode, false),
		tokenPostfix: string(json.tokenPostfix, '.' + languageId),
		defaultToken: string(json.defaultToken, 'source'),
		usesEmbedded: false, // becomes true if we find a nextEmbedded action
		stateNames: {},
		tokenizer: {},
		brackets: []
	};

	// For calling compileAction later on
	// eslint-disable-next-line local/code-no-any-casts
	const lexerMin: monarchCommon.ILexerMin = <any>json;
	lexerMin.languageId = languageId;
	lexerMin.includeLF = lexer.includeLF;
	lexerMin.ignoreCase = lexer.ignoreCase;
	lexerMin.unicode = lexer.unicode;
	lexerMin.noThrow = lexer.noThrow;
	lexerMin.usesEmbedded = lexer.usesEmbedded;
	lexerMin.stateNames = json.tokenizer;
	lexerMin.defaultToken = lexer.defaultToken;


	// Compile an array of rules into newrules where RegExp objects are created.
	function addRules(state: string, newrules: monarchCommon.IRule[], rules: any[]) {
		for (const rule of rules) {

			let include = rule.include;
			if (include) {
				if (typeof (include) !== 'string') {
					throw monarchCommon.createError(lexer, 'an \'include\' attribute must be a string at: ' + state);
				}
				if (include[0] === '@') {
					include = include.substr(1); // peel off starting @
				}
				if (!json.tokenizer[include]) {
					throw monarchCommon.createError(lexer, 'include target \'' + include + '\' is not defined at: ' + state);
				}
				addRules(state + '.' + include, newrules, json.tokenizer[include]);
			}
			else {
				const newrule = new Rule(state);

				// Set up new rule attributes
				if (Array.isArray(rule) && rule.length >= 1 && rule.length <= 3) {
					newrule.setRegex(lexerMin, rule[0]);
					if (rule.length >= 3) {
						if (typeof (rule[1]) === 'string') {
							newrule.setAction(lexerMin, { token: rule[1], next: rule[2] });
						}
						else if (typeof (rule[1]) === 'object') {
							const rule1 = rule[1];
							rule1.next = rule[2];
							newrule.setAction(lexerMin, rule1);
						}
						else {
							throw monarchCommon.createError(lexer, 'a next state as the last element of a rule can only be given if the action is either an object or a string, at: ' + state);
						}
					}
					else {
						newrule.setAction(lexerMin, rule[1]);
					}
				}
				else {
					if (!rule.regex) {
						throw monarchCommon.createError(lexer, 'a rule must either be an array, or an object with a \'regex\' or \'include\' field at: ' + state);
					}
					if (rule.name) {
						if (typeof rule.name === 'string') {
							newrule.name = rule.name;
						}
					}
					if (rule.matchOnlyAtStart) {
						newrule.matchOnlyAtLineStart = bool(rule.matchOnlyAtLineStart, false);
					}
					newrule.setRegex(lexerMin, rule.regex);
					newrule.setAction(lexerMin, rule.action);
				}

				newrules.push(newrule);
			}
		}
	}

	// compile the tokenizer rules
	if (!json.tokenizer || typeof (json.tokenizer) !== 'object') {
		throw monarchCommon.createError(lexer, 'a language definition must define the \'tokenizer\' attribute as an object');
	}

	// eslint-disable-next-line local/code-no-any-casts
	lexer.tokenizer = <any>[];
	for (const key in json.tokenizer) {
		if (json.tokenizer.hasOwnProperty(key)) {
			if (!lexer.start) {
				lexer.start = key;
			}

			const rules = json.tokenizer[key];
			lexer.tokenizer[key] = new Array();
			addRules('tokenizer.' + key, lexer.tokenizer[key], rules);
		}
	}
	lexer.usesEmbedded = lexerMin.usesEmbedded;  // can be set during compileAction

	// Set simple brackets
	if (json.brackets) {
		// eslint-disable-next-line local/code-no-any-casts
		if (!(Array.isArray(<any>json.brackets))) {
			throw monarchCommon.createError(lexer, 'the \'brackets\' attribute must be defined as an array');
		}
	}
	else {
		json.brackets = [
			{ open: '{', close: '}', token: 'delimiter.curly' },
			{ open: '[', close: ']', token: 'delimiter.square' },
			{ open: '(', close: ')', token: 'delimiter.parenthesis' },
			{ open: '<', close: '>', token: 'delimiter.angle' }];
	}
	const brackets: IMonarchLanguageBracket[] = [];
	for (const el of json.brackets) {
		let desc: any = el;
		if (desc && Array.isArray(desc) && desc.length === 3) {
			desc = { token: desc[2], open: desc[0], close: desc[1] };
		}
		if (desc.open === desc.close) {
			throw monarchCommon.createError(lexer, 'open and close brackets in a \'brackets\' attribute must be different: ' + desc.open +
				'\n hint: use the \'bracket\' attribute if matching on equal brackets is required.');
		}
		if (typeof desc.open === 'string' && typeof desc.token === 'string' && typeof desc.close === 'string') {
			brackets.push({
				token: desc.token + lexer.tokenPostfix,
				open: monarchCommon.fixCase(lexer, desc.open),
				close: monarchCommon.fixCase(lexer, desc.close)
			});
		}
		else {
			throw monarchCommon.createError(lexer, 'every element in the \'brackets\' array must be a \'{open,close,token}\' object or array');
		}
	}
	lexer.brackets = brackets;

	// Disable throw so the syntax highlighter goes, no matter what
	lexer.noThrow = true;
	return lexer;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/common/monarch/monarchLexer.ts]---
Location: vscode-main/src/vs/editor/standalone/common/monarch/monarchLexer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Create a syntax highighter with a fully declarative JSON style lexer description
 * using regular expressions.
 */

import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import * as languages from '../../../common/languages.js';
import { NullState, nullTokenizeEncoded, nullTokenize } from '../../../common/languages/nullTokenize.js';
import { TokenTheme } from '../../../common/languages/supports/tokenization.js';
import { ILanguageService } from '../../../common/languages/language.js';
import * as monarchCommon from './monarchCommon.js';
import { IStandaloneThemeService } from '../standaloneTheme.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { LanguageId, MetadataConsts } from '../../../common/encodedTokenAttributes.js';

const CACHE_STACK_DEPTH = 5;

/**
 * Reuse the same stack elements up to a certain depth.
 */
class MonarchStackElementFactory {

	private static readonly _INSTANCE = new MonarchStackElementFactory(CACHE_STACK_DEPTH);
	public static create(parent: MonarchStackElement | null, state: string): MonarchStackElement {
		return this._INSTANCE.create(parent, state);
	}

	private readonly _maxCacheDepth: number;
	private readonly _entries: { [stackElementId: string]: MonarchStackElement };

	constructor(maxCacheDepth: number) {
		this._maxCacheDepth = maxCacheDepth;
		this._entries = Object.create(null);
	}

	public create(parent: MonarchStackElement | null, state: string): MonarchStackElement {
		if (parent !== null && parent.depth >= this._maxCacheDepth) {
			// no caching above a certain depth
			return new MonarchStackElement(parent, state);
		}
		let stackElementId = MonarchStackElement.getStackElementId(parent);
		if (stackElementId.length > 0) {
			stackElementId += '|';
		}
		stackElementId += state;

		let result = this._entries[stackElementId];
		if (result) {
			return result;
		}
		result = new MonarchStackElement(parent, state);
		this._entries[stackElementId] = result;
		return result;
	}
}

class MonarchStackElement {

	public readonly parent: MonarchStackElement | null;
	public readonly state: string;
	public readonly depth: number;

	constructor(parent: MonarchStackElement | null, state: string) {
		this.parent = parent;
		this.state = state;
		this.depth = (this.parent ? this.parent.depth : 0) + 1;
	}

	public static getStackElementId(element: MonarchStackElement | null): string {
		let result = '';
		while (element !== null) {
			if (result.length > 0) {
				result += '|';
			}
			result += element.state;
			element = element.parent;
		}
		return result;
	}

	private static _equals(a: MonarchStackElement | null, b: MonarchStackElement | null): boolean {
		while (a !== null && b !== null) {
			if (a === b) {
				return true;
			}
			if (a.state !== b.state) {
				return false;
			}
			a = a.parent;
			b = b.parent;
		}
		if (a === null && b === null) {
			return true;
		}
		return false;
	}

	public equals(other: MonarchStackElement): boolean {
		return MonarchStackElement._equals(this, other);
	}

	public push(state: string): MonarchStackElement {
		return MonarchStackElementFactory.create(this, state);
	}

	public pop(): MonarchStackElement | null {
		return this.parent;
	}

	public popall(): MonarchStackElement {
		let result: MonarchStackElement = this;
		while (result.parent) {
			result = result.parent;
		}
		return result;
	}

	public switchTo(state: string): MonarchStackElement {
		return MonarchStackElementFactory.create(this.parent, state);
	}
}

class EmbeddedLanguageData {
	public readonly languageId: string;
	public readonly state: languages.IState;

	constructor(languageId: string, state: languages.IState) {
		this.languageId = languageId;
		this.state = state;
	}

	public equals(other: EmbeddedLanguageData): boolean {
		return (
			this.languageId === other.languageId
			&& this.state.equals(other.state)
		);
	}

	public clone(): EmbeddedLanguageData {
		const stateClone = this.state.clone();
		// save an object
		if (stateClone === this.state) {
			return this;
		}
		return new EmbeddedLanguageData(this.languageId, this.state);
	}
}

/**
 * Reuse the same line states up to a certain depth.
 */
class MonarchLineStateFactory {

	private static readonly _INSTANCE = new MonarchLineStateFactory(CACHE_STACK_DEPTH);
	public static create(stack: MonarchStackElement, embeddedLanguageData: EmbeddedLanguageData | null): MonarchLineState {
		return this._INSTANCE.create(stack, embeddedLanguageData);
	}

	private readonly _maxCacheDepth: number;
	private readonly _entries: { [stackElementId: string]: MonarchLineState };

	constructor(maxCacheDepth: number) {
		this._maxCacheDepth = maxCacheDepth;
		this._entries = Object.create(null);
	}

	public create(stack: MonarchStackElement, embeddedLanguageData: EmbeddedLanguageData | null): MonarchLineState {
		if (embeddedLanguageData !== null) {
			// no caching when embedding
			return new MonarchLineState(stack, embeddedLanguageData);
		}
		if (stack !== null && stack.depth >= this._maxCacheDepth) {
			// no caching above a certain depth
			return new MonarchLineState(stack, embeddedLanguageData);
		}
		const stackElementId = MonarchStackElement.getStackElementId(stack);

		let result = this._entries[stackElementId];
		if (result) {
			return result;
		}
		result = new MonarchLineState(stack, null);
		this._entries[stackElementId] = result;
		return result;
	}
}

class MonarchLineState implements languages.IState {

	public readonly stack: MonarchStackElement;
	public readonly embeddedLanguageData: EmbeddedLanguageData | null;

	constructor(
		stack: MonarchStackElement,
		embeddedLanguageData: EmbeddedLanguageData | null
	) {
		this.stack = stack;
		this.embeddedLanguageData = embeddedLanguageData;
	}

	public clone(): languages.IState {
		const embeddedlanguageDataClone = this.embeddedLanguageData ? this.embeddedLanguageData.clone() : null;
		// save an object
		if (embeddedlanguageDataClone === this.embeddedLanguageData) {
			return this;
		}
		return MonarchLineStateFactory.create(this.stack, this.embeddedLanguageData);
	}

	public equals(other: languages.IState): boolean {
		if (!(other instanceof MonarchLineState)) {
			return false;
		}
		if (!this.stack.equals(other.stack)) {
			return false;
		}
		if (this.embeddedLanguageData === null && other.embeddedLanguageData === null) {
			return true;
		}
		if (this.embeddedLanguageData === null || other.embeddedLanguageData === null) {
			return false;
		}
		return this.embeddedLanguageData.equals(other.embeddedLanguageData);
	}
}

interface IMonarchTokensCollector {
	enterLanguage(languageId: string): void;
	emit(startOffset: number, type: string): void;
	nestedLanguageTokenize(embeddedLanguageLine: string, hasEOL: boolean, embeddedLanguageData: EmbeddedLanguageData, offsetDelta: number): languages.IState;
}

class MonarchClassicTokensCollector implements IMonarchTokensCollector {

	private _tokens: languages.Token[];
	private _languageId: string | null;
	private _lastTokenType: string | null;
	private _lastTokenLanguage: string | null;

	constructor() {
		this._tokens = [];
		this._languageId = null;
		this._lastTokenType = null;
		this._lastTokenLanguage = null;
	}

	public enterLanguage(languageId: string): void {
		this._languageId = languageId;
	}

	public emit(startOffset: number, type: string): void {
		if (this._lastTokenType === type && this._lastTokenLanguage === this._languageId) {
			return;
		}
		this._lastTokenType = type;
		this._lastTokenLanguage = this._languageId;
		this._tokens.push(new languages.Token(startOffset, type, this._languageId!));
	}

	public nestedLanguageTokenize(embeddedLanguageLine: string, hasEOL: boolean, embeddedLanguageData: EmbeddedLanguageData, offsetDelta: number): languages.IState {
		const nestedLanguageId = embeddedLanguageData.languageId;
		const embeddedModeState = embeddedLanguageData.state;

		const nestedLanguageTokenizationSupport = languages.TokenizationRegistry.get(nestedLanguageId);
		if (!nestedLanguageTokenizationSupport) {
			this.enterLanguage(nestedLanguageId);
			this.emit(offsetDelta, '');
			return embeddedModeState;
		}

		const nestedResult = nestedLanguageTokenizationSupport.tokenize(embeddedLanguageLine, hasEOL, embeddedModeState);
		if (offsetDelta !== 0) {
			for (const token of nestedResult.tokens) {
				this._tokens.push(new languages.Token(token.offset + offsetDelta, token.type, token.language));
			}
		} else {
			this._tokens = this._tokens.concat(nestedResult.tokens);
		}
		this._lastTokenType = null;
		this._lastTokenLanguage = null;
		this._languageId = null;
		return nestedResult.endState;
	}

	public finalize(endState: MonarchLineState): languages.TokenizationResult {
		return new languages.TokenizationResult(this._tokens, endState);
	}
}

class MonarchModernTokensCollector implements IMonarchTokensCollector {

	private readonly _languageService: ILanguageService;
	private readonly _theme: TokenTheme;
	private _prependTokens: Uint32Array | null;
	private _tokens: number[];
	private _currentLanguageId: LanguageId;
	private _lastTokenMetadata: number;

	constructor(languageService: ILanguageService, theme: TokenTheme) {
		this._languageService = languageService;
		this._theme = theme;
		this._prependTokens = null;
		this._tokens = [];
		this._currentLanguageId = LanguageId.Null;
		this._lastTokenMetadata = 0;
	}

	public enterLanguage(languageId: string): void {
		this._currentLanguageId = this._languageService.languageIdCodec.encodeLanguageId(languageId);
	}

	public emit(startOffset: number, type: string): void {
		const metadata = this._theme.match(this._currentLanguageId, type) | MetadataConsts.BALANCED_BRACKETS_MASK;
		if (this._lastTokenMetadata === metadata) {
			return;
		}
		this._lastTokenMetadata = metadata;
		this._tokens.push(startOffset);
		this._tokens.push(metadata);
	}

	private static _merge(a: Uint32Array | null, b: number[], c: Uint32Array | null): Uint32Array {
		const aLen = (a !== null ? a.length : 0);
		const bLen = b.length;
		const cLen = (c !== null ? c.length : 0);

		if (aLen === 0 && bLen === 0 && cLen === 0) {
			return new Uint32Array(0);
		}
		if (aLen === 0 && bLen === 0) {
			return c!;
		}
		if (bLen === 0 && cLen === 0) {
			return a!;
		}

		const result = new Uint32Array(aLen + bLen + cLen);
		if (a !== null) {
			result.set(a);
		}
		for (let i = 0; i < bLen; i++) {
			result[aLen + i] = b[i];
		}
		if (c !== null) {
			result.set(c, aLen + bLen);
		}
		return result;
	}

	public nestedLanguageTokenize(embeddedLanguageLine: string, hasEOL: boolean, embeddedLanguageData: EmbeddedLanguageData, offsetDelta: number): languages.IState {
		const nestedLanguageId = embeddedLanguageData.languageId;
		const embeddedModeState = embeddedLanguageData.state;

		const nestedLanguageTokenizationSupport = languages.TokenizationRegistry.get(nestedLanguageId);
		if (!nestedLanguageTokenizationSupport) {
			this.enterLanguage(nestedLanguageId);
			this.emit(offsetDelta, '');
			return embeddedModeState;
		}

		const nestedResult = nestedLanguageTokenizationSupport.tokenizeEncoded(embeddedLanguageLine, hasEOL, embeddedModeState);
		if (offsetDelta !== 0) {
			for (let i = 0, len = nestedResult.tokens.length; i < len; i += 2) {
				nestedResult.tokens[i] += offsetDelta;
			}
		}

		this._prependTokens = MonarchModernTokensCollector._merge(this._prependTokens, this._tokens, nestedResult.tokens);
		this._tokens = [];
		this._currentLanguageId = 0;
		this._lastTokenMetadata = 0;
		return nestedResult.endState;
	}

	public finalize(endState: MonarchLineState): languages.EncodedTokenizationResult {
		return new languages.EncodedTokenizationResult(
			MonarchModernTokensCollector._merge(this._prependTokens, this._tokens, null),
			[],
			endState
		);
	}
}

export type ILoadStatus = { loaded: true } | { loaded: false; promise: Promise<void> };

export class MonarchTokenizer extends Disposable implements languages.ITokenizationSupport, IDisposable {

	private readonly _languageService: ILanguageService;
	private readonly _standaloneThemeService: IStandaloneThemeService;
	private readonly _languageId: string;
	private readonly _lexer: monarchCommon.ILexer;
	private readonly _embeddedLanguages: { [languageId: string]: boolean };
	public embeddedLoaded: Promise<void>;
	private _maxTokenizationLineLength: number;

	constructor(languageService: ILanguageService, standaloneThemeService: IStandaloneThemeService, languageId: string, lexer: monarchCommon.ILexer, @IConfigurationService private readonly _configurationService: IConfigurationService) {
		super();
		this._languageService = languageService;
		this._standaloneThemeService = standaloneThemeService;
		this._languageId = languageId;
		this._lexer = lexer;
		this._embeddedLanguages = Object.create(null);
		this.embeddedLoaded = Promise.resolve(undefined);

		// Set up listening for embedded modes
		let emitting = false;
		this._register(languages.TokenizationRegistry.onDidChange((e) => {
			if (emitting) {
				return;
			}
			let isOneOfMyEmbeddedModes = false;
			for (let i = 0, len = e.changedLanguages.length; i < len; i++) {
				const language = e.changedLanguages[i];
				if (this._embeddedLanguages[language]) {
					isOneOfMyEmbeddedModes = true;
					break;
				}
			}
			if (isOneOfMyEmbeddedModes) {
				emitting = true;
				languages.TokenizationRegistry.handleChange([this._languageId]);
				emitting = false;
			}
		}));
		this._maxTokenizationLineLength = this._configurationService.getValue<number>('editor.maxTokenizationLineLength', {
			overrideIdentifier: this._languageId
		});
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('editor.maxTokenizationLineLength')) {
				this._maxTokenizationLineLength = this._configurationService.getValue<number>('editor.maxTokenizationLineLength', {
					overrideIdentifier: this._languageId
				});
			}
		}));
	}

	public getLoadStatus(): ILoadStatus {
		const promises: Thenable<any>[] = [];
		for (const nestedLanguageId in this._embeddedLanguages) {
			const tokenizationSupport = languages.TokenizationRegistry.get(nestedLanguageId);
			if (tokenizationSupport) {
				// The nested language is already loaded
				if (tokenizationSupport instanceof MonarchTokenizer) {
					const nestedModeStatus = tokenizationSupport.getLoadStatus();
					if (nestedModeStatus.loaded === false) {
						promises.push(nestedModeStatus.promise);
					}
				}
				continue;
			}

			if (!languages.TokenizationRegistry.isResolved(nestedLanguageId)) {
				// The nested language is in the process of being loaded
				promises.push(languages.TokenizationRegistry.getOrCreate(nestedLanguageId));
			}
		}

		if (promises.length === 0) {
			return {
				loaded: true
			};
		}
		return {
			loaded: false,
			promise: Promise.all(promises).then(_ => undefined)
		};
	}

	public getInitialState(): languages.IState {
		const rootState = MonarchStackElementFactory.create(null, this._lexer.start!);
		return MonarchLineStateFactory.create(rootState, null);
	}

	public tokenize(line: string, hasEOL: boolean, lineState: languages.IState): languages.TokenizationResult {
		if (line.length >= this._maxTokenizationLineLength) {
			return nullTokenize(this._languageId, lineState);
		}
		const tokensCollector = new MonarchClassicTokensCollector();
		const endLineState = this._tokenize(line, hasEOL, <MonarchLineState>lineState, tokensCollector);
		return tokensCollector.finalize(endLineState);
	}

	public tokenizeEncoded(line: string, hasEOL: boolean, lineState: languages.IState): languages.EncodedTokenizationResult {
		if (line.length >= this._maxTokenizationLineLength) {
			return nullTokenizeEncoded(this._languageService.languageIdCodec.encodeLanguageId(this._languageId), lineState);
		}
		const tokensCollector = new MonarchModernTokensCollector(this._languageService, this._standaloneThemeService.getColorTheme().tokenTheme);
		const endLineState = this._tokenize(line, hasEOL, <MonarchLineState>lineState, tokensCollector);
		return tokensCollector.finalize(endLineState);
	}

	private _tokenize(line: string, hasEOL: boolean, lineState: MonarchLineState, collector: IMonarchTokensCollector): MonarchLineState {
		if (lineState.embeddedLanguageData) {
			return this._nestedTokenize(line, hasEOL, lineState, 0, collector);
		} else {
			return this._myTokenize(line, hasEOL, lineState, 0, collector);
		}
	}

	private _findLeavingNestedLanguageOffset(line: string, state: MonarchLineState): number {
		let rules: monarchCommon.IRule[] | null = this._lexer.tokenizer[state.stack.state];
		if (!rules) {
			rules = monarchCommon.findRules(this._lexer, state.stack.state); // do parent matching
			if (!rules) {
				throw monarchCommon.createError(this._lexer, 'tokenizer state is not defined: ' + state.stack.state);
			}
		}

		let popOffset = -1;
		let hasEmbeddedPopRule = false;

		for (const rule of rules) {
			if (!monarchCommon.isIAction(rule.action) || !(rule.action.nextEmbedded === '@pop' || rule.action.hasEmbeddedEndInCases)) {
				continue;
			}
			hasEmbeddedPopRule = true;

			let regex = rule.resolveRegex(state.stack.state);
			const regexSource = regex.source;
			if (regexSource.substr(0, 4) === '^(?:' && regexSource.substr(regexSource.length - 1, 1) === ')') {
				const flags = (regex.ignoreCase ? 'i' : '') + (regex.unicode ? 'u' : '');
				regex = new RegExp(regexSource.substr(4, regexSource.length - 5), flags);
			}

			const result = line.search(regex);
			if (result === -1 || (result !== 0 && rule.matchOnlyAtLineStart)) {
				continue;
			}

			if (popOffset === -1 || result < popOffset) {
				popOffset = result;
			}
		}

		if (!hasEmbeddedPopRule) {
			throw monarchCommon.createError(this._lexer, 'no rule containing nextEmbedded: "@pop" in tokenizer embedded state: ' + state.stack.state);
		}

		return popOffset;
	}

	private _nestedTokenize(line: string, hasEOL: boolean, lineState: MonarchLineState, offsetDelta: number, tokensCollector: IMonarchTokensCollector): MonarchLineState {

		const popOffset = this._findLeavingNestedLanguageOffset(line, lineState);

		if (popOffset === -1) {
			// tokenization will not leave nested language
			const nestedEndState = tokensCollector.nestedLanguageTokenize(line, hasEOL, lineState.embeddedLanguageData!, offsetDelta);
			return MonarchLineStateFactory.create(lineState.stack, new EmbeddedLanguageData(lineState.embeddedLanguageData!.languageId, nestedEndState));
		}

		const nestedLanguageLine = line.substring(0, popOffset);
		if (nestedLanguageLine.length > 0) {
			// tokenize with the nested language
			tokensCollector.nestedLanguageTokenize(nestedLanguageLine, false, lineState.embeddedLanguageData!, offsetDelta);
		}

		const restOfTheLine = line.substring(popOffset);
		return this._myTokenize(restOfTheLine, hasEOL, lineState, offsetDelta + popOffset, tokensCollector);
	}

	private _safeRuleName(rule: monarchCommon.IRule | null): string {
		if (rule) {
			return rule.name;
		}
		return '(unknown)';
	}

	private _myTokenize(lineWithoutLF: string, hasEOL: boolean, lineState: MonarchLineState, offsetDelta: number, tokensCollector: IMonarchTokensCollector): MonarchLineState {
		tokensCollector.enterLanguage(this._languageId);

		const lineWithoutLFLength = lineWithoutLF.length;
		const line = (hasEOL && this._lexer.includeLF ? lineWithoutLF + '\n' : lineWithoutLF);
		const lineLength = line.length;

		let embeddedLanguageData = lineState.embeddedLanguageData;
		let stack = lineState.stack;
		let pos = 0;

		// regular expression group matching
		// these never need cloning or equality since they are only used within a line match
		interface GroupMatching {
			matches: string[];
			rule: monarchCommon.IRule | null;
			groups: { action: monarchCommon.FuzzyAction; matched: string }[];
		}
		let groupMatching: GroupMatching | null = null;

		// See https://github.com/microsoft/monaco-editor/issues/1235
		// Evaluate rules at least once for an empty line
		let forceEvaluation = true;

		while (forceEvaluation || pos < lineLength) {

			const pos0 = pos;
			const stackLen0 = stack.depth;
			const groupLen0 = groupMatching ? groupMatching.groups.length : 0;
			const state = stack.state;

			let matches: string[] | null = null;
			let matched: string | null = null;
			let action: monarchCommon.FuzzyAction | monarchCommon.FuzzyAction[] | null = null;
			let rule: monarchCommon.IRule | null = null;

			let enteringEmbeddedLanguage: string | null = null;

			// check if we need to process group matches first
			if (groupMatching) {
				matches = groupMatching.matches;
				const groupEntry = groupMatching.groups.shift()!;
				matched = groupEntry.matched;
				action = groupEntry.action;
				rule = groupMatching.rule;

				// cleanup if necessary
				if (groupMatching.groups.length === 0) {
					groupMatching = null;
				}
			} else {
				// otherwise we match on the token stream

				if (!forceEvaluation && pos >= lineLength) {
					// nothing to do
					break;
				}

				forceEvaluation = false;

				// get the rules for this state
				let rules: monarchCommon.IRule[] | null = this._lexer.tokenizer[state];
				if (!rules) {
					rules = monarchCommon.findRules(this._lexer, state); // do parent matching
					if (!rules) {
						throw monarchCommon.createError(this._lexer, 'tokenizer state is not defined: ' + state);
					}
				}

				// try each rule until we match
				const restOfLine = line.substr(pos);
				for (const rule of rules) {
					if (pos === 0 || !rule.matchOnlyAtLineStart) {
						matches = restOfLine.match(rule.resolveRegex(state));
						if (matches) {
							matched = matches[0];
							action = rule.action;
							break;
						}
					}
				}
			}

			// We matched 'rule' with 'matches' and 'action'
			if (!matches) {
				matches = [''];
				matched = '';
			}

			if (!action) {
				// bad: we didn't match anything, and there is no action to take
				// we need to advance the stream or we get progress trouble
				if (pos < lineLength) {
					matches = [line.charAt(pos)];
					matched = matches[0];
				}
				action = this._lexer.defaultToken;
			}

			if (matched === null) {
				// should never happen, needed for strict null checking
				break;
			}

			// advance stream
			pos += matched.length;

			// maybe call action function (used for 'cases')
			while (monarchCommon.isFuzzyAction(action) && monarchCommon.isIAction(action) && action.test) {
				action = action.test(matched, matches, state, pos === lineLength);
			}

			let result: monarchCommon.FuzzyAction | monarchCommon.FuzzyAction[] | null = null;
			// set the result: either a string or an array of actions
			if (typeof action === 'string' || Array.isArray(action)) {
				result = action;
			} else if (action.group) {
				result = action.group;
			} else if (action.token !== null && action.token !== undefined) {

				// do $n replacements?
				if (action.tokenSubst) {
					result = monarchCommon.substituteMatches(this._lexer, action.token, matched, matches, state);
				} else {
					result = action.token;
				}

				// enter embedded language?
				if (action.nextEmbedded) {
					if (action.nextEmbedded === '@pop') {
						if (!embeddedLanguageData) {
							throw monarchCommon.createError(this._lexer, 'cannot pop embedded language if not inside one');
						}
						embeddedLanguageData = null;
					} else if (embeddedLanguageData) {
						throw monarchCommon.createError(this._lexer, 'cannot enter embedded language from within an embedded language');
					} else {
						enteringEmbeddedLanguage = monarchCommon.substituteMatches(this._lexer, action.nextEmbedded, matched, matches, state);
					}
				}

				// state transformations
				if (action.goBack) { // back up the stream..
					pos = Math.max(0, pos - action.goBack);
				}

				if (action.switchTo && typeof action.switchTo === 'string') {
					let nextState = monarchCommon.substituteMatches(this._lexer, action.switchTo, matched, matches, state);  // switch state without a push...
					if (nextState[0] === '@') {
						nextState = nextState.substr(1); // peel off starting '@'
					}
					if (!monarchCommon.findRules(this._lexer, nextState)) {
						throw monarchCommon.createError(this._lexer, 'trying to switch to a state \'' + nextState + '\' that is undefined in rule: ' + this._safeRuleName(rule));
					} else {
						stack = stack.switchTo(nextState);
					}
				} else if (action.transform && typeof action.transform === 'function') {
					throw monarchCommon.createError(this._lexer, 'action.transform not supported');
				} else if (action.next) {
					if (action.next === '@push') {
						if (stack.depth >= this._lexer.maxStack) {
							throw monarchCommon.createError(this._lexer, 'maximum tokenizer stack size reached: [' +
								stack.state + ',' + stack.parent!.state + ',...]');
						} else {
							stack = stack.push(state);
						}
					} else if (action.next === '@pop') {
						if (stack.depth <= 1) {
							throw monarchCommon.createError(this._lexer, 'trying to pop an empty stack in rule: ' + this._safeRuleName(rule));
						} else {
							stack = stack.pop()!;
						}
					} else if (action.next === '@popall') {
						stack = stack.popall();
					} else {
						let nextState = monarchCommon.substituteMatches(this._lexer, action.next, matched, matches, state);
						if (nextState[0] === '@') {
							nextState = nextState.substr(1); // peel off starting '@'
						}

						if (!monarchCommon.findRules(this._lexer, nextState)) {
							throw monarchCommon.createError(this._lexer, 'trying to set a next state \'' + nextState + '\' that is undefined in rule: ' + this._safeRuleName(rule));
						} else {
							stack = stack.push(nextState);
						}
					}
				}

				if (action.log && typeof (action.log) === 'string') {
					monarchCommon.log(this._lexer, this._lexer.languageId + ': ' + monarchCommon.substituteMatches(this._lexer, action.log, matched, matches, state));
				}
			}

			// check result
			if (result === null) {
				throw monarchCommon.createError(this._lexer, 'lexer rule has no well-defined action in rule: ' + this._safeRuleName(rule));
			}

			const computeNewStateForEmbeddedLanguage = (enteringEmbeddedLanguage: string) => {
				// support language names, mime types, and language ids
				const languageId = (
					this._languageService.getLanguageIdByLanguageName(enteringEmbeddedLanguage)
					|| this._languageService.getLanguageIdByMimeType(enteringEmbeddedLanguage)
					|| enteringEmbeddedLanguage
				);

				const embeddedLanguageData = this._getNestedEmbeddedLanguageData(languageId);

				if (pos < lineLength) {
					// there is content from the embedded language on this line
					const restOfLine = lineWithoutLF.substr(pos);
					return this._nestedTokenize(restOfLine, hasEOL, MonarchLineStateFactory.create(stack, embeddedLanguageData), offsetDelta + pos, tokensCollector);
				} else {
					return MonarchLineStateFactory.create(stack, embeddedLanguageData);
				}
			};

			// is the result a group match?
			if (Array.isArray(result)) {
				if (groupMatching && groupMatching.groups.length > 0) {
					throw monarchCommon.createError(this._lexer, 'groups cannot be nested: ' + this._safeRuleName(rule));
				}
				if (matches.length !== result.length + 1) {
					throw monarchCommon.createError(this._lexer, 'matched number of groups does not match the number of actions in rule: ' + this._safeRuleName(rule));
				}
				let totalLen = 0;
				for (let i = 1; i < matches.length; i++) {
					totalLen += matches[i].length;
				}
				if (totalLen !== matched.length) {
					throw monarchCommon.createError(this._lexer, 'with groups, all characters should be matched in consecutive groups in rule: ' + this._safeRuleName(rule));
				}

				groupMatching = {
					rule: rule,
					matches: matches,
					groups: []
				};
				for (let i = 0; i < result.length; i++) {
					groupMatching.groups[i] = {
						action: result[i],
						matched: matches[i + 1]
					};
				}

				pos -= matched.length;
				// call recursively to initiate first result match
				continue;
			} else {
				// regular result

				// check for '@rematch'
				if (result === '@rematch') {
					pos -= matched.length;
					matched = '';  // better set the next state too..
					matches = null;
					result = '';

					// Even though `@rematch` was specified, if `nextEmbedded` also specified,
					// a state transition should occur.
					if (enteringEmbeddedLanguage !== null) {
						return computeNewStateForEmbeddedLanguage(enteringEmbeddedLanguage);
					}
				}

				// check progress
				if (matched.length === 0) {
					if (lineLength === 0 || stackLen0 !== stack.depth || state !== stack.state || (!groupMatching ? 0 : groupMatching.groups.length) !== groupLen0) {
						continue;
					} else {
						throw monarchCommon.createError(this._lexer, 'no progress in tokenizer in rule: ' + this._safeRuleName(rule));
					}
				}

				// return the result (and check for brace matching)
				// todo: for efficiency we could pre-sanitize tokenPostfix and substitutions
				let tokenType: string | null = null;
				if (monarchCommon.isString(result) && result.indexOf('@brackets') === 0) {
					const rest = result.substr('@brackets'.length);
					const bracket = findBracket(this._lexer, matched);
					if (!bracket) {
						throw monarchCommon.createError(this._lexer, '@brackets token returned but no bracket defined as: ' + matched);
					}
					tokenType = monarchCommon.sanitize(bracket.token + rest);
				} else {
					const token = (result === '' ? '' : result + this._lexer.tokenPostfix);
					tokenType = monarchCommon.sanitize(token);
				}

				if (pos0 < lineWithoutLFLength) {
					tokensCollector.emit(pos0 + offsetDelta, tokenType);
				}
			}

			if (enteringEmbeddedLanguage !== null) {
				return computeNewStateForEmbeddedLanguage(enteringEmbeddedLanguage);
			}
		}

		return MonarchLineStateFactory.create(stack, embeddedLanguageData);
	}

	private _getNestedEmbeddedLanguageData(languageId: string): EmbeddedLanguageData {
		if (!this._languageService.isRegisteredLanguageId(languageId)) {
			return new EmbeddedLanguageData(languageId, NullState);
		}

		if (languageId !== this._languageId) {
			// Fire language loading event
			this._languageService.requestBasicLanguageFeatures(languageId);
			languages.TokenizationRegistry.getOrCreate(languageId);
			this._embeddedLanguages[languageId] = true;
		}

		const tokenizationSupport = languages.TokenizationRegistry.get(languageId);
		if (tokenizationSupport) {
			return new EmbeddedLanguageData(languageId, tokenizationSupport.getInitialState());
		}

		return new EmbeddedLanguageData(languageId, NullState);
	}
}

/**
 * Searches for a bracket in the 'brackets' attribute that matches the input.
 */
function findBracket(lexer: monarchCommon.ILexer, matched: string) {
	if (!matched) {
		return null;
	}
	matched = monarchCommon.fixCase(lexer, matched);

	const brackets = lexer.brackets;
	for (const bracket of brackets) {
		if (bracket.open === matched) {
			return { token: bracket.token, bracketType: monarchCommon.MonarchBracket.Open };
		}
		else if (bracket.close === matched) {
			return { token: bracket.token, bracketType: monarchCommon.MonarchBracket.Close };
		}
	}
	return null;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/common/monarch/monarchTypes.ts]---
Location: vscode-main/src/vs/editor/standalone/common/monarch/monarchTypes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/*
 * Interface types for Monarch language definitions
 * These descriptions are really supposed to be JSON values but if using typescript
 * to describe them, these type definitions can help check the validity.
 */

/**
 * A Monarch language definition
 */
export interface IMonarchLanguage {
	/**
	 * map from string to ILanguageRule[]
	 */
	tokenizer: { [name: string]: IMonarchLanguageRule[] };
	/**
	 * is the language case insensitive?
	 */
	ignoreCase?: boolean;
	/**
	 * is the language unicode-aware? (i.e., /\u{1D306}/)
	 */
	unicode?: boolean;
	/**
	 * if no match in the tokenizer assign this token class (default 'source')
	 */
	defaultToken?: string;
	/**
	 * for example [['{','}','delimiter.curly']]
	 */
	brackets?: IMonarchLanguageBracket[];
	/**
	 * start symbol in the tokenizer (by default the first entry is used)
	 */
	start?: string;
	/**
	 * attach this to every token class (by default '.' + name)
	 */
	tokenPostfix?: string;
	/**
	 * include line feeds (in the form of a \n character) at the end of lines
	 * Defaults to false
	 */
	includeLF?: boolean;
	/**
	 * Other keys that can be referred to by the tokenizer.
	 */
	[key: string]: any;
}

/**
 * A rule is either a regular expression and an action
 * 		shorthands: [reg,act] == { regex: reg, action: act}
 *		and       : [reg,act,nxt] == { regex: reg, action: act{ next: nxt }}
 */
export type IShortMonarchLanguageRule1 = [string | RegExp, IMonarchLanguageAction];

export type IShortMonarchLanguageRule2 = [string | RegExp, IMonarchLanguageAction, string];

export interface IExpandedMonarchLanguageRule {
	/**
	 * match tokens
	 */
	regex?: string | RegExp;
	/**
	 * action to take on match
	 */
	action?: IMonarchLanguageAction;

	/**
	 * or an include rule. include all rules from the included state
	 */
	include?: string;
}

export type IMonarchLanguageRule = IShortMonarchLanguageRule1
	| IShortMonarchLanguageRule2
	| IExpandedMonarchLanguageRule;

/**
 * An action is either an array of actions...
 * ... or a case statement with guards...
 * ... or a basic action with a token value.
 */
export type IShortMonarchLanguageAction = string;

export interface IExpandedMonarchLanguageAction {
	/**
	 * array of actions for each parenthesized match group
	 */
	group?: IMonarchLanguageAction[];
	/**
	 * map from string to ILanguageAction
	 */
	cases?: Object;
	/**
	 * token class (ie. css class) (or "@brackets" or "@rematch")
	 */
	token?: string;
	/**
	 * the next state to push, or "@push", "@pop", "@popall"
	 */
	next?: string;
	/**
	 * switch to this state
	 */
	switchTo?: string;
	/**
	 * go back n characters in the stream
	 */
	goBack?: number;
	/**
	 * @open or @close
	 */
	bracket?: string;
	/**
	 * switch to embedded language (using the mimetype) or get out using "@pop"
	 */
	nextEmbedded?: string;
	/**
	 * log a message to the browser console window
	 */
	log?: string;
}

export type IMonarchLanguageAction = IShortMonarchLanguageAction | IExpandedMonarchLanguageAction | (IShortMonarchLanguageAction | IExpandedMonarchLanguageAction)[];

/**
 * This interface can be shortened as an array, ie. ['{','}','delimiter.curly']
 */
export interface IMonarchLanguageBracket {
	/**
	 * open bracket
	 */
	open: string;
	/**
	 * closing bracket
	 */
	close: string;
	/**
	 * token class
	 */
	token: string;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/test/browser/monarch.test.ts]---
Location: vscode-main/src/vs/editor/standalone/test/browser/monarch.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { Token, TokenizationRegistry } from '../../../common/languages.js';
import { ILanguageService } from '../../../common/languages/language.js';
import { LanguageService } from '../../../common/services/languageService.js';
import { StandaloneConfigurationService } from '../../browser/standaloneServices.js';
import { compile } from '../../common/monarch/monarchCompile.js';
import { MonarchTokenizer } from '../../common/monarch/monarchLexer.js';
import { IMonarchLanguage } from '../../common/monarch/monarchTypes.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { NullLogService } from '../../../../platform/log/common/log.js';

suite('Monarch', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function createMonarchTokenizer(languageService: ILanguageService, languageId: string, language: IMonarchLanguage, configurationService: IConfigurationService): MonarchTokenizer {
		return new MonarchTokenizer(languageService, null!, languageId, compile(languageId, language), configurationService);
	}

	function getTokens(tokenizer: MonarchTokenizer, lines: string[]): Token[][] {
		const actualTokens: Token[][] = [];
		let state = tokenizer.getInitialState();
		for (const line of lines) {
			const result = tokenizer.tokenize(line, true, state);
			actualTokens.push(result.tokens);
			state = result.endState;
		}
		return actualTokens;
	}

	test('Ensure @rematch and nextEmbedded can be used together in Monarch grammar', () => {
		const disposables = new DisposableStore();
		const languageService = disposables.add(new LanguageService());
		const configurationService = new StandaloneConfigurationService(new NullLogService());
		disposables.add(languageService.registerLanguage({ id: 'sql' }));
		disposables.add(TokenizationRegistry.register('sql', disposables.add(createMonarchTokenizer(languageService, 'sql', {
			tokenizer: {
				root: [
					[/./, 'token']
				]
			}
		}, configurationService))));
		const SQL_QUERY_START = '(SELECT|INSERT|UPDATE|DELETE|CREATE|REPLACE|ALTER|WITH)';
		const tokenizer = disposables.add(createMonarchTokenizer(languageService, 'test1', {
			tokenizer: {
				root: [
					[`(\"\"\")${SQL_QUERY_START}`, [{ 'token': 'string.quote', }, { token: '@rematch', next: '@endStringWithSQL', nextEmbedded: 'sql', },]],
					[/(""")$/, [{ token: 'string.quote', next: '@maybeStringIsSQL', },]],
				],
				maybeStringIsSQL: [
					[/(.*)/, {
						cases: {
							[`${SQL_QUERY_START}\\b.*`]: { token: '@rematch', next: '@endStringWithSQL', nextEmbedded: 'sql', },
							'@default': { token: '@rematch', switchTo: '@endDblDocString', },
						}
					}],
				],
				endDblDocString: [
					['[^\']+', 'string'],
					['\\\\\'', 'string'],
					['\'\'\'', 'string', '@popall'],
					['\'', 'string']
				],
				endStringWithSQL: [[/"""/, { token: 'string.quote', next: '@popall', nextEmbedded: '@pop', },]],
			}
		}, configurationService));

		const lines = [
			`mysql_query("""SELECT * FROM table_name WHERE ds = '<DATEID>'""")`,
			`mysql_query("""`,
			`SELECT *`,
			`FROM table_name`,
			`WHERE ds = '<DATEID>'`,
			`""")`,
		];

		const actualTokens = getTokens(tokenizer, lines);

		assert.deepStrictEqual(actualTokens, [
			[
				new Token(0, 'source.test1', 'test1'),
				new Token(12, 'string.quote.test1', 'test1'),
				new Token(15, 'token.sql', 'sql'),
				new Token(61, 'string.quote.test1', 'test1'),
				new Token(64, 'source.test1', 'test1')
			],
			[
				new Token(0, 'source.test1', 'test1'),
				new Token(12, 'string.quote.test1', 'test1')
			],
			[
				new Token(0, 'token.sql', 'sql')
			],
			[
				new Token(0, 'token.sql', 'sql')
			],
			[
				new Token(0, 'token.sql', 'sql')
			],
			[
				new Token(0, 'string.quote.test1', 'test1'),
				new Token(3, 'source.test1', 'test1')
			]
		]);
		disposables.dispose();
	});

	test('Test nextEmbedded: "@pop" in cases statement', () => {
		const disposables = new DisposableStore();
		const languageService = disposables.add(new LanguageService());
		const configurationService = new StandaloneConfigurationService(new NullLogService());
		disposables.add(languageService.registerLanguage({ id: 'sql' }));
		disposables.add(TokenizationRegistry.register('sql', disposables.add(createMonarchTokenizer(languageService, 'sql', {
			tokenizer: {
				root: [
					[/./, 'token']
				]
			}
		}, configurationService))));
		const SQL_QUERY_START = '(SELECT|INSERT|UPDATE|DELETE|CREATE|REPLACE|ALTER|WITH)';
		const tokenizer = disposables.add(createMonarchTokenizer(languageService, 'test1', {
			tokenizer: {
				root: [
					[`(\"\"\")${SQL_QUERY_START}`, [{ 'token': 'string.quote', }, { token: '@rematch', next: '@endStringWithSQL', nextEmbedded: 'sql', },]],
					[/(""")$/, [{ token: 'string.quote', next: '@maybeStringIsSQL', },]],
				],
				maybeStringIsSQL: [
					[/(.*)/, {
						cases: {
							[`${SQL_QUERY_START}\\b.*`]: { token: '@rematch', next: '@endStringWithSQL', nextEmbedded: 'sql', },
							'@default': { token: '@rematch', switchTo: '@endDblDocString', },
						}
					}],
				],
				endDblDocString: [
					['[^\']+', 'string'],
					['\\\\\'', 'string'],
					['\'\'\'', 'string', '@popall'],
					['\'', 'string']
				],
				endStringWithSQL: [[/"""/, {
					cases: {
						'"""': {
							cases: {
								'': { token: 'string.quote', next: '@popall', nextEmbedded: '@pop', }
							}
						},
						'@default': ''
					}
				}]],
			}
		}, configurationService));

		const lines = [
			`mysql_query("""SELECT * FROM table_name WHERE ds = '<DATEID>'""")`,
			`mysql_query("""`,
			`SELECT *`,
			`FROM table_name`,
			`WHERE ds = '<DATEID>'`,
			`""")`,
		];

		const actualTokens = getTokens(tokenizer, lines);

		assert.deepStrictEqual(actualTokens, [
			[
				new Token(0, 'source.test1', 'test1'),
				new Token(12, 'string.quote.test1', 'test1'),
				new Token(15, 'token.sql', 'sql'),
				new Token(61, 'string.quote.test1', 'test1'),
				new Token(64, 'source.test1', 'test1')
			],
			[
				new Token(0, 'source.test1', 'test1'),
				new Token(12, 'string.quote.test1', 'test1')
			],
			[
				new Token(0, 'token.sql', 'sql')
			],
			[
				new Token(0, 'token.sql', 'sql')
			],
			[
				new Token(0, 'token.sql', 'sql')
			],
			[
				new Token(0, 'string.quote.test1', 'test1'),
				new Token(3, 'source.test1', 'test1')
			]
		]);
		disposables.dispose();
	});


	test('microsoft/monaco-editor#1235: Empty Line Handling', () => {
		const disposables = new DisposableStore();
		const configurationService = new StandaloneConfigurationService(new NullLogService());
		const languageService = disposables.add(new LanguageService());
		const tokenizer = disposables.add(createMonarchTokenizer(languageService, 'test', {
			tokenizer: {
				root: [
					{ include: '@comments' },
				],

				comments: [
					[/\/\/$/, 'comment'], // empty single-line comment
					[/\/\//, 'comment', '@comment_cpp'],
				],

				comment_cpp: [
					[/(?:[^\\]|(?:\\.))+$/, 'comment', '@pop'],
					[/.+$/, 'comment'],
					[/$/, 'comment', '@pop']
					// No possible rule to detect an empty line and @pop?
				],
			},
		}, configurationService));

		const lines = [
			`// This comment \\`,
			`   continues on the following line`,
			``,
			`// This comment does NOT continue \\\\`,
			`   because the escape char was itself escaped`,
			``,
			`// This comment DOES continue because \\\\\\`,
			`   the 1st '\\' escapes the 2nd; the 3rd escapes EOL`,
			``,
			`// This comment continues to the following line \\`,
			``,
			`But the line was empty. This line should not be commented.`,
		];

		const actualTokens = getTokens(tokenizer, lines);

		assert.deepStrictEqual(actualTokens, [
			[new Token(0, 'comment.test', 'test')],
			[new Token(0, 'comment.test', 'test')],
			[],
			[new Token(0, 'comment.test', 'test')],
			[new Token(0, 'source.test', 'test')],
			[],
			[new Token(0, 'comment.test', 'test')],
			[new Token(0, 'comment.test', 'test')],
			[],
			[new Token(0, 'comment.test', 'test')],
			[],
			[new Token(0, 'source.test', 'test')]
		]);

		disposables.dispose();
	});

	test('microsoft/monaco-editor#2265: Exit a state at end of line', () => {
		const disposables = new DisposableStore();
		const configurationService = new StandaloneConfigurationService(new NullLogService());
		const languageService = disposables.add(new LanguageService());
		const tokenizer = disposables.add(createMonarchTokenizer(languageService, 'test', {
			includeLF: true,
			tokenizer: {
				root: [
					[/^\*/, '', '@inner'],
					[/\:\*/, '', '@inner'],
					[/[^*:]+/, 'string'],
					[/[*:]/, 'string']
				],
				inner: [
					[/\n/, '', '@pop'],
					[/\d+/, 'number'],
					[/[^\d]+/, '']
				]
			}
		}, configurationService));

		const lines = [
			`PRINT 10 * 20`,
			`*FX200, 3`,
			`PRINT 2*3:*FX200, 3`
		];

		const actualTokens = getTokens(tokenizer, lines);

		assert.deepStrictEqual(actualTokens, [
			[
				new Token(0, 'string.test', 'test'),
			],
			[
				new Token(0, '', 'test'),
				new Token(3, 'number.test', 'test'),
				new Token(6, '', 'test'),
				new Token(8, 'number.test', 'test'),
			],
			[
				new Token(0, 'string.test', 'test'),
				new Token(9, '', 'test'),
				new Token(13, 'number.test', 'test'),
				new Token(16, '', 'test'),
				new Token(18, 'number.test', 'test'),
			]
		]);

		disposables.dispose();
	});

	test('issue #115662: monarchCompile function need an extra option which can control replacement', () => {
		const disposables = new DisposableStore();
		const configurationService = new StandaloneConfigurationService(new NullLogService());
		const languageService = disposables.add(new LanguageService());

		const tokenizer1 = disposables.add(createMonarchTokenizer(languageService, 'test', {
			ignoreCase: false,
			uselessReplaceKey1: '@uselessReplaceKey2',
			uselessReplaceKey2: '@uselessReplaceKey3',
			uselessReplaceKey3: '@uselessReplaceKey4',
			uselessReplaceKey4: '@uselessReplaceKey5',
			uselessReplaceKey5: '@ham',
			tokenizer: {
				root: [
					{
						regex: /@\w+/.test('@ham')
							? new RegExp(`^${'@uselessReplaceKey1'}$`)
							: new RegExp(`^${'@ham'}$`),
						action: { token: 'ham' }
					},
				],
			},
		}, configurationService));

		const tokenizer2 = disposables.add(createMonarchTokenizer(languageService, 'test', {
			ignoreCase: false,
			tokenizer: {
				root: [
					{
						regex: /@@ham/,
						action: { token: 'ham' }
					},
				],
			},
		}, configurationService));

		const lines = [
			`@ham`
		];

		const actualTokens1 = getTokens(tokenizer1, lines);
		assert.deepStrictEqual(actualTokens1, [
			[
				new Token(0, 'ham.test', 'test'),
			]
		]);

		const actualTokens2 = getTokens(tokenizer2, lines);
		assert.deepStrictEqual(actualTokens2, [
			[
				new Token(0, 'ham.test', 'test'),
			]
		]);

		disposables.dispose();
	});

	test('microsoft/monaco-editor#2424: Allow to target @@', () => {
		const disposables = new DisposableStore();
		const configurationService = new StandaloneConfigurationService(new NullLogService());
		const languageService = disposables.add(new LanguageService());

		const tokenizer = disposables.add(createMonarchTokenizer(languageService, 'test', {
			ignoreCase: false,
			tokenizer: {
				root: [
					{
						regex: /@@@@/,
						action: { token: 'ham' }
					},
				],
			},
		}, configurationService));

		const lines = [
			`@@`
		];

		const actualTokens = getTokens(tokenizer, lines);
		assert.deepStrictEqual(actualTokens, [
			[
				new Token(0, 'ham.test', 'test'),
			]
		]);

		disposables.dispose();
	});

	test('microsoft/monaco-editor#3025: Check maxTokenizationLineLength before tokenizing', async () => {
		const disposables = new DisposableStore();

		const configurationService = new StandaloneConfigurationService(new NullLogService());
		const languageService = disposables.add(new LanguageService());

		// Set maxTokenizationLineLength to 4 so that "ham" works but "hamham" would fail
		await configurationService.updateValue('editor.maxTokenizationLineLength', 4);

		const tokenizer = disposables.add(createMonarchTokenizer(languageService, 'test', {
			tokenizer: {
				root: [
					{
						regex: /ham/,
						action: { token: 'ham' }
					},
				],
			},
		}, configurationService));

		const lines = [
			'ham', // length 3, should be tokenized
			'hamham' // length 6, should NOT be tokenized
		];

		const actualTokens = getTokens(tokenizer, lines);
		assert.deepStrictEqual(actualTokens, [
			[
				new Token(0, 'ham.test', 'test'),
			], [
				new Token(0, '', 'test')
			]
		]);

		disposables.dispose();
	});

	test('microsoft/monaco-editor#3128: allow state access within rules', () => {
		const disposables = new DisposableStore();
		const configurationService = new StandaloneConfigurationService(new NullLogService());
		const languageService = disposables.add(new LanguageService());

		const tokenizer = disposables.add(createMonarchTokenizer(languageService, 'test', {
			ignoreCase: false,
			encoding: /u|u8|U|L/,
			tokenizer: {
				root: [
					// C++ 11 Raw String
					[/@encoding?R\"(?:([^ ()\\\t]*))\(/, { token: 'string.raw.begin', next: '@raw.$1' }],
				],

				raw: [
					[/.*\)$S2\"/, 'string.raw', '@pop'],
					[/.*/, 'string.raw']
				],
			},
		}, configurationService));

		const lines = [
			`int main(){`,
			``,
			`	auto s = R""""(`,
			`	Hello World`,
			`	)"""";`,
			``,
			`	std::cout << "hello";`,
			``,
			`}`,
		];

		const actualTokens = getTokens(tokenizer, lines);
		assert.deepStrictEqual(actualTokens, [
			[new Token(0, 'source.test', 'test')],
			[],
			[new Token(0, 'source.test', 'test'), new Token(10, 'string.raw.begin.test', 'test')],
			[new Token(0, 'string.raw.test', 'test')],
			[new Token(0, 'string.raw.test', 'test'), new Token(6, 'source.test', 'test')],
			[],
			[new Token(0, 'source.test', 'test')],
			[],
			[new Token(0, 'source.test', 'test')],
		]);

		disposables.dispose();
	});

	test('microsoft/monaco-editor#4775: Raw-strings in c++ can break monarch', () => {
		const disposables = new DisposableStore();
		const configurationService = new StandaloneConfigurationService(new NullLogService());
		const languageService = disposables.add(new LanguageService());

		const tokenizer = disposables.add(createMonarchTokenizer(languageService, 'test', {
			ignoreCase: false,
			encoding: /u|u8|U|L/,
			tokenizer: {
				root: [
					// C++ 11 Raw String
					[/@encoding?R\"(?:([^ ()\\\t]*))\(/, { token: 'string.raw.begin', next: '@raw.$1' }],
				],

				raw: [
					[/.*\)$S2\"/, 'string.raw', '@pop'],
					[/.*/, 'string.raw']
				],
			},
		}, configurationService));

		const lines = [
			`R"[())"`,
		];

		const actualTokens = getTokens(tokenizer, lines);
		assert.deepStrictEqual(actualTokens, [
			[new Token(0, 'string.raw.begin.test', 'test'), new Token(4, 'string.raw.test', 'test')],
		]);

		disposables.dispose();
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/test/browser/standaloneLanguages.test.ts]---
Location: vscode-main/src/vs/editor/standalone/test/browser/standaloneLanguages.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Color } from '../../../../base/common/color.js';
import { Emitter } from '../../../../base/common/event.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { LanguageId, MetadataConsts } from '../../../common/encodedTokenAttributes.js';
import { IState, Token } from '../../../common/languages.js';
import { TokenTheme } from '../../../common/languages/supports/tokenization.js';
import { LanguageService } from '../../../common/services/languageService.js';
import { ILineTokens, IToken, TokenizationSupportAdapter, TokensProvider } from '../../browser/standaloneLanguages.js';
import { IStandaloneTheme, IStandaloneThemeData, IStandaloneThemeService } from '../../common/standaloneTheme.js';
import { UnthemedProductIconTheme } from '../../../../platform/theme/browser/iconsStyleSheet.js';
import { ColorIdentifier } from '../../../../platform/theme/common/colorRegistry.js';
import { ColorScheme } from '../../../../platform/theme/common/theme.js';
import { IColorTheme, IFileIconTheme, IProductIconTheme, ITokenStyle } from '../../../../platform/theme/common/themeService.js';

suite('TokenizationSupport2Adapter', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const languageId = 'tttt';
	// const tokenMetadata = (LanguageId.PlainText << MetadataConsts.LANGUAGEID_OFFSET);

	class MockTokenTheme extends TokenTheme {
		private counter = 0;
		constructor() {
			super(null!, null!);
		}
		public override match(languageId: LanguageId, token: string): number {
			return (
				((this.counter++) << MetadataConsts.FOREGROUND_OFFSET)
				| (languageId << MetadataConsts.LANGUAGEID_OFFSET)
			) >>> 0;
		}
	}

	class MockThemeService implements IStandaloneThemeService {
		declare readonly _serviceBrand: undefined;
		public setTheme(themeName: string): string {
			throw new Error('Not implemented');
		}
		public setAutoDetectHighContrast(autoDetectHighContrast: boolean): void {
			throw new Error('Not implemented');
		}
		public defineTheme(themeName: string, themeData: IStandaloneThemeData): void {
			throw new Error('Not implemented');
		}
		public getColorTheme(): IStandaloneTheme {
			return {
				label: 'mock',

				tokenTheme: new MockTokenTheme(),

				themeName: ColorScheme.LIGHT,

				type: ColorScheme.LIGHT,

				getColor: (color: ColorIdentifier, useDefault?: boolean): Color => {
					throw new Error('Not implemented');
				},

				defines: (color: ColorIdentifier): boolean => {
					throw new Error('Not implemented');
				},

				getTokenStyleMetadata: (type: string, modifiers: string[], modelLanguage: string): ITokenStyle | undefined => {
					return undefined;
				},

				semanticHighlighting: false,

				tokenColorMap: [],

				tokenFontMap: []
			};
		}
		setColorMapOverride(colorMapOverride: Color[] | null): void {
		}
		public getFileIconTheme(): IFileIconTheme {
			return {
				hasFileIcons: false,
				hasFolderIcons: false,
				hidesExplorerArrows: false
			};
		}

		private _builtInProductIconTheme = new UnthemedProductIconTheme();

		public getProductIconTheme(): IProductIconTheme {
			return this._builtInProductIconTheme;
		}
		public readonly onDidColorThemeChange = new Emitter<IColorTheme>().event;
		public readonly onDidFileIconThemeChange = new Emitter<IFileIconTheme>().event;
		public readonly onDidProductIconThemeChange = new Emitter<IProductIconTheme>().event;
	}

	class MockState implements IState {
		public static readonly INSTANCE = new MockState();
		private constructor() { }
		public clone(): IState {
			return this;
		}
		public equals(other: IState): boolean {
			return this === other;
		}
	}

	function testBadTokensProvider(providerTokens: IToken[], expectedClassicTokens: Token[], expectedModernTokens: number[]): void {

		class BadTokensProvider implements TokensProvider {
			public getInitialState(): IState {
				return MockState.INSTANCE;
			}
			public tokenize(line: string, state: IState): ILineTokens {
				return {
					tokens: providerTokens,
					endState: MockState.INSTANCE
				};
			}
		}

		const disposables = new DisposableStore();
		const languageService = disposables.add(new LanguageService());
		disposables.add(languageService.registerLanguage({ id: languageId }));
		const adapter = new TokenizationSupportAdapter(
			languageId,
			new BadTokensProvider(),
			languageService,
			new MockThemeService()
		);

		const actualClassicTokens = adapter.tokenize('whatever', true, MockState.INSTANCE);
		assert.deepStrictEqual(actualClassicTokens.tokens, expectedClassicTokens);

		const actualModernTokens = adapter.tokenizeEncoded('whatever', true, MockState.INSTANCE);
		const modernTokens: number[] = [];
		for (let i = 0; i < actualModernTokens.tokens.length; i++) {
			modernTokens[i] = actualModernTokens.tokens[i];
		}

		// Add the encoded language id to the expected tokens
		const encodedLanguageId = languageService.languageIdCodec.encodeLanguageId(languageId);
		const tokenLanguageMetadata = (encodedLanguageId << MetadataConsts.LANGUAGEID_OFFSET);
		for (let i = 1; i < expectedModernTokens.length; i += 2) {
			expectedModernTokens[i] |= tokenLanguageMetadata;
		}
		assert.deepStrictEqual(modernTokens, expectedModernTokens);

		disposables.dispose();
	}

	test('tokens always start at index 0', () => {
		testBadTokensProvider(
			[
				{ startIndex: 7, scopes: 'foo' },
				{ startIndex: 0, scopes: 'bar' }
			],
			[
				new Token(0, 'foo', languageId),
				new Token(0, 'bar', languageId),
			],
			[
				0, (0 << MetadataConsts.FOREGROUND_OFFSET) | MetadataConsts.BALANCED_BRACKETS_MASK,
				0, (1 << MetadataConsts.FOREGROUND_OFFSET) | MetadataConsts.BALANCED_BRACKETS_MASK
			]
		);
	});

	test('tokens always start after each other', () => {
		testBadTokensProvider(
			[
				{ startIndex: 0, scopes: 'foo' },
				{ startIndex: 5, scopes: 'bar' },
				{ startIndex: 3, scopes: 'foo' },
			],
			[
				new Token(0, 'foo', languageId),
				new Token(5, 'bar', languageId),
				new Token(5, 'foo', languageId),
			],
			[
				0, (0 << MetadataConsts.FOREGROUND_OFFSET) | MetadataConsts.BALANCED_BRACKETS_MASK,
				5, (1 << MetadataConsts.FOREGROUND_OFFSET) | MetadataConsts.BALANCED_BRACKETS_MASK,
				5, (2 << MetadataConsts.FOREGROUND_OFFSET) | MetadataConsts.BALANCED_BRACKETS_MASK
			]
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/test/browser/standaloneServices.test.ts]---
Location: vscode-main/src/vs/editor/standalone/test/browser/standaloneServices.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { StandaloneCodeEditorService } from '../../browser/standaloneCodeEditorService.js';
import { StandaloneCommandService, StandaloneConfigurationService, StandaloneKeybindingService, StandaloneNotificationService } from '../../browser/standaloneServices.js';
import { StandaloneThemeService } from '../../browser/standaloneThemeService.js';
import { ContextKeyService } from '../../../../platform/contextkey/browser/contextKeyService.js';
import { InstantiationService } from '../../../../platform/instantiation/common/instantiationService.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { IKeyboardEvent } from '../../../../platform/keybinding/common/keybinding.js';
import { NullLogService } from '../../../../platform/log/common/log.js';
import { NullTelemetryService } from '../../../../platform/telemetry/common/telemetryUtils.js';

suite('StandaloneKeybindingService', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	class TestStandaloneKeybindingService extends StandaloneKeybindingService {
		public testDispatch(e: IKeyboardEvent): void {
			super._dispatch(e, null!);
		}
	}

	test('issue microsoft/monaco-editor#167', () => {

		const disposables = new DisposableStore();
		const serviceCollection = new ServiceCollection();
		const instantiationService = new InstantiationService(serviceCollection, true);
		const configurationService = new StandaloneConfigurationService(new NullLogService());
		const contextKeyService = disposables.add(new ContextKeyService(configurationService));
		const commandService = new StandaloneCommandService(instantiationService);
		const notificationService = new StandaloneNotificationService();
		const standaloneThemeService = disposables.add(new StandaloneThemeService());
		const codeEditorService = disposables.add(new StandaloneCodeEditorService(contextKeyService, standaloneThemeService));
		const keybindingService = disposables.add(new TestStandaloneKeybindingService(contextKeyService, commandService, NullTelemetryService, notificationService, new NullLogService(), codeEditorService));

		let commandInvoked = false;
		disposables.add(keybindingService.addDynamicKeybinding('testCommand', KeyCode.F9, () => {
			commandInvoked = true;
		}, undefined));

		keybindingService.testDispatch({
			_standardKeyboardEventBrand: true,
			ctrlKey: false,
			shiftKey: false,
			altKey: false,
			metaKey: false,
			altGraphKey: false,
			keyCode: KeyCode.F9,
			code: null!
		});

		assert.ok(commandInvoked, 'command invoked');

		disposables.dispose();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/editorTestServices.ts]---
Location: vscode-main/src/vs/editor/test/browser/editorTestServices.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { ICodeEditor } from '../../browser/editorBrowser.js';
import { AbstractCodeEditorService, GlobalStyleSheet } from '../../browser/services/abstractCodeEditorService.js';
import { CommandsRegistry, ICommandEvent, ICommandService } from '../../../platform/commands/common/commands.js';
import { IResourceEditorInput } from '../../../platform/editor/common/editor.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';

export class TestCodeEditorService extends AbstractCodeEditorService {

	public readonly globalStyleSheet = new TestGlobalStyleSheet();

	protected override _createGlobalStyleSheet(): GlobalStyleSheet {
		return this.globalStyleSheet;
	}

	getActiveCodeEditor(): ICodeEditor | null {
		return null;
	}
	public lastInput?: IResourceEditorInput;
	override openCodeEditor(input: IResourceEditorInput, source: ICodeEditor | null, sideBySide?: boolean): Promise<ICodeEditor | null> {
		this.lastInput = input;
		return Promise.resolve(null);
	}
}

export class TestGlobalStyleSheet extends GlobalStyleSheet {

	public rules: string[] = [];

	constructor() {
		super(null!);
	}

	public override insertRule(selector: string, rule: string): void {
		this.rules.unshift(`${selector} {${rule}}`);
	}

	public override removeRulesContainingSelector(ruleName: string): void {
		for (let i = 0; i < this.rules.length; i++) {
			if (this.rules[i].indexOf(ruleName) >= 0) {
				this.rules.splice(i, 1);
				i--;
			}
		}
	}

	public read(): string {
		return this.rules.join('\n');
	}
}

export class TestCommandService implements ICommandService {
	declare readonly _serviceBrand: undefined;

	private readonly _instantiationService: IInstantiationService;

	private readonly _onWillExecuteCommand = new Emitter<ICommandEvent>();
	public readonly onWillExecuteCommand: Event<ICommandEvent> = this._onWillExecuteCommand.event;

	private readonly _onDidExecuteCommand = new Emitter<ICommandEvent>();
	public readonly onDidExecuteCommand: Event<ICommandEvent> = this._onDidExecuteCommand.event;

	constructor(instantiationService: IInstantiationService) {
		this._instantiationService = instantiationService;
	}

	public executeCommand<T>(id: string, ...args: unknown[]): Promise<T> {
		const command = CommandsRegistry.getCommand(id);
		if (!command) {
			return Promise.reject(new Error(`command '${id}' not found`));
		}

		try {
			this._onWillExecuteCommand.fire({ commandId: id, args });
			const result = this._instantiationService.invokeFunction.apply(this._instantiationService, [command.handler, ...args]) as T;
			this._onDidExecuteCommand.fire({ commandId: id, args });
			return Promise.resolve(result);
		} catch (err) {
			return Promise.reject(err);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/testCodeEditor.ts]---
Location: vscode-main/src/vs/editor/test/browser/testCodeEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { mock } from '../../../base/test/common/mock.js';
import { EditorConfiguration } from '../../browser/config/editorConfiguration.js';
import { IActiveCodeEditor, ICodeEditor } from '../../browser/editorBrowser.js';
import { ICodeEditorService } from '../../browser/services/codeEditorService.js';
import { View } from '../../browser/view.js';
import { CodeEditorWidget, ICodeEditorWidgetOptions } from '../../browser/widget/codeEditor/codeEditorWidget.js';
import * as editorOptions from '../../common/config/editorOptions.js';
import { IEditorContribution } from '../../common/editorCommon.js';
import { ILanguageService } from '../../common/languages/language.js';
import { ILanguageConfigurationService } from '../../common/languages/languageConfigurationRegistry.js';
import { ITextBufferFactory, ITextModel } from '../../common/model.js';
import { IEditorWorkerService } from '../../common/services/editorWorker.js';
import { ILanguageFeatureDebounceService, LanguageFeatureDebounceService } from '../../common/services/languageFeatureDebounce.js';
import { ILanguageFeaturesService } from '../../common/services/languageFeatures.js';
import { LanguageFeaturesService } from '../../common/services/languageFeaturesService.js';
import { LanguageService } from '../../common/services/languageService.js';
import { IModelService } from '../../common/services/model.js';
import { ModelService } from '../../common/services/modelService.js';
import { ITextResourcePropertiesService } from '../../common/services/textResourceConfiguration.js';
import { ViewModel } from '../../common/viewModel/viewModelImpl.js';
import { TestConfiguration } from './config/testConfiguration.js';
import { TestCodeEditorService, TestCommandService } from './editorTestServices.js';
import { TestLanguageConfigurationService } from '../common/modes/testLanguageConfigurationService.js';
import { TestEditorWorkerService } from '../common/services/testEditorWorkerService.js';
import { TestTextResourcePropertiesService } from '../common/services/testTextResourcePropertiesService.js';
import { instantiateTextModel } from '../common/testTextModel.js';
import { AccessibilitySupport, IAccessibilityService } from '../../../platform/accessibility/common/accessibility.js';
import { TestAccessibilityService } from '../../../platform/accessibility/test/common/testAccessibilityService.js';
import { MenuId } from '../../../platform/actions/common/actions.js';
import { IClipboardService } from '../../../platform/clipboard/common/clipboardService.js';
import { TestClipboardService } from '../../../platform/clipboard/test/common/testClipboardService.js';
import { ICommandService } from '../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../platform/configuration/test/common/testConfigurationService.js';
import { IContextKeyService, IContextKeyServiceTarget } from '../../../platform/contextkey/common/contextkey.js';
import { IDialogService } from '../../../platform/dialogs/common/dialogs.js';
import { TestDialogService } from '../../../platform/dialogs/test/common/testDialogService.js';
import { IEnvironmentService } from '../../../platform/environment/common/environment.js';
import { SyncDescriptor } from '../../../platform/instantiation/common/descriptors.js';
import { BrandedService, IInstantiationService, ServiceIdentifier, ServicesAccessor } from '../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../platform/instantiation/common/serviceCollection.js';
import { TestInstantiationService } from '../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IKeybindingService } from '../../../platform/keybinding/common/keybinding.js';
import { MockContextKeyService, MockKeybindingService } from '../../../platform/keybinding/test/common/mockKeybindingService.js';
import { ILoggerService, ILogService, NullLoggerService, NullLogService } from '../../../platform/log/common/log.js';
import { INotificationService } from '../../../platform/notification/common/notification.js';
import { TestNotificationService } from '../../../platform/notification/test/common/testNotificationService.js';
import { IOpenerService } from '../../../platform/opener/common/opener.js';
import { NullOpenerService } from '../../../platform/opener/test/common/nullOpenerService.js';
import { ITelemetryService } from '../../../platform/telemetry/common/telemetry.js';
import { NullTelemetryServiceShape } from '../../../platform/telemetry/common/telemetryUtils.js';
import { IThemeService } from '../../../platform/theme/common/themeService.js';
import { TestThemeService } from '../../../platform/theme/test/common/testThemeService.js';
import { IUndoRedoService } from '../../../platform/undoRedo/common/undoRedo.js';
import { UndoRedoService } from '../../../platform/undoRedo/common/undoRedoService.js';
import { ITreeSitterLibraryService } from '../../common/services/treeSitter/treeSitterLibraryService.js';
import { TestTreeSitterLibraryService } from '../common/services/testTreeSitterLibraryService.js';
import { IInlineCompletionsService, InlineCompletionsService } from '../../browser/services/inlineCompletionsService.js';
import { EditorCommand } from '../../browser/editorExtensions.js';
import { IDataChannelService, NullDataChannelService } from '../../../platform/dataChannel/common/dataChannel.js';

export interface ITestCodeEditor extends IActiveCodeEditor {
	getViewModel(): ViewModel | undefined;
	registerAndInstantiateContribution<T extends IEditorContribution, Services extends BrandedService[]>(id: string, ctor: new (editor: ICodeEditor, ...services: Services) => T): T;
	registerDisposable(disposable: IDisposable): void;
	runCommand(command: ITestEditorCommand, args?: any): void | Promise<void>;
	runAction(action: ITestEditorAction, args?: any): void | Promise<void>;
}

export interface ITestEditorCommand {
	runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, args?: any): void | Promise<void>;
}

export interface ITestEditorAction {
	run(accessor: ServicesAccessor, editor: ICodeEditor, args?: any): void | Promise<void>;
}

export class TestCodeEditor extends CodeEditorWidget implements ICodeEditor {

	//#region testing overrides
	protected override _createConfiguration(isSimpleWidget: boolean, contextMenuId: MenuId, options: Readonly<TestCodeEditorCreationOptions>): EditorConfiguration {
		return new TestConfiguration(options);
	}
	protected override _createView(viewModel: ViewModel): [View, boolean] {
		// Never create a view
		return [null! as View, false];
	}
	private _hasTextFocus = false;
	public setHasTextFocus(hasTextFocus: boolean): void {
		this._hasTextFocus = hasTextFocus;
	}
	public override hasTextFocus(): boolean {
		return this._hasTextFocus;
	}
	//#endregion

	//#region Testing utils
	public getViewModel(): ViewModel | undefined {
		return this._modelData ? this._modelData.viewModel : undefined;
	}
	public registerAndInstantiateContribution<T extends IEditorContribution>(id: string, ctor: new (editor: ICodeEditor, ...services: BrandedService[]) => T): T {
		const r: T = this._instantiationService.createInstance(ctor, this);
		this._contributions.set(id, r);
		return r;
	}
	public registerDisposable(disposable: IDisposable): void {
		this._register(disposable);
	}
	public runCommand(command: EditorCommand, args?: any): void | Promise<void> {
		return this._instantiationService.invokeFunction((accessor) => {
			return command.runEditorCommand(accessor, this, args);
		});
	}
	public runAction(action: ITestEditorAction, args?: any): void | Promise<void> {
		return this._instantiationService.invokeFunction((accessor) => {
			return action.run(accessor, this, args);
		});
	}
}

class TestEditorDomElement {
	parentElement: IContextKeyServiceTarget | null = null;
	ownerDocument = document;
	document = document;
	setAttribute(attr: string, value: string): void { }
	removeAttribute(attr: string): void { }
	hasAttribute(attr: string): boolean { return false; }
	getAttribute(attr: string): string | undefined { return undefined; }
	addEventListener(event: string): void { }
	removeEventListener(event: string): void { }
}

export interface TestCodeEditorCreationOptions extends editorOptions.IEditorOptions {
	/**
	 * If the editor has text focus.
	 * Defaults to true.
	 */
	hasTextFocus?: boolean;
	/**
	 * Env configuration
	 */
	envConfig?: ITestEnvConfiguration;
}

export interface TestCodeEditorInstantiationOptions extends TestCodeEditorCreationOptions {
	/**
	 * Services to use.
	 */
	serviceCollection?: ServiceCollection;
}

export interface ITestEnvConfiguration {
	extraEditorClassName?: string;
	outerWidth?: number;
	outerHeight?: number;
	emptySelectionClipboard?: boolean;
	pixelRatio?: number;
	accessibilitySupport?: AccessibilitySupport;
}

export function withTestCodeEditor(text: ITextModel | string | string[] | ITextBufferFactory, options: TestCodeEditorInstantiationOptions, callback: (editor: ITestCodeEditor, viewModel: ViewModel, instantiationService: TestInstantiationService) => void): void {
	return _withTestCodeEditor(text, options, callback);
}

export async function withAsyncTestCodeEditor(text: ITextModel | string | string[] | ITextBufferFactory, options: TestCodeEditorInstantiationOptions, callback: (editor: ITestCodeEditor, viewModel: ViewModel, instantiationService: TestInstantiationService) => Promise<void>): Promise<void> {
	return _withTestCodeEditor(text, options, callback);
}

function isTextModel(arg: ITextModel | string | string[] | ITextBufferFactory): arg is ITextModel {
	return Boolean(arg && (arg as ITextModel).uri);
}

function _withTestCodeEditor(arg: ITextModel | string | string[] | ITextBufferFactory, options: TestCodeEditorInstantiationOptions, callback: (editor: ITestCodeEditor, viewModel: ViewModel, instantiationService: TestInstantiationService) => void): void;
function _withTestCodeEditor(arg: ITextModel | string | string[] | ITextBufferFactory, options: TestCodeEditorInstantiationOptions, callback: (editor: ITestCodeEditor, viewModel: ViewModel, instantiationService: TestInstantiationService) => Promise<void>): Promise<void>;
function _withTestCodeEditor(arg: ITextModel | string | string[] | ITextBufferFactory, options: TestCodeEditorInstantiationOptions, callback: (editor: ITestCodeEditor, viewModel: ViewModel, instantiationService: TestInstantiationService) => Promise<void> | void): Promise<void> | void {
	const disposables = new DisposableStore();
	const instantiationService = createCodeEditorServices(disposables, options.serviceCollection);
	delete options.serviceCollection;

	// create a model if necessary
	let model: ITextModel;
	if (isTextModel(arg)) {
		model = arg;
	} else {
		model = disposables.add(instantiateTextModel(instantiationService, Array.isArray(arg) ? arg.join('\n') : arg));
	}

	const editor = disposables.add(instantiateTestCodeEditor(instantiationService, model, options));
	const viewModel = editor.getViewModel()!;
	viewModel.setHasFocus(true);
	const result = callback(editor, editor.getViewModel()!, instantiationService);
	if (result) {
		return result.then(() => disposables.dispose());
	}

	disposables.dispose();
}

export function createCodeEditorServices(disposables: Pick<DisposableStore, 'add'>, services: ServiceCollection = new ServiceCollection()): TestInstantiationService {
	const serviceIdentifiers: ServiceIdentifier<any>[] = [];
	const define = <T>(id: ServiceIdentifier<T>, ctor: new (...args: any[]) => T) => {
		if (!services.has(id)) {
			services.set(id, new SyncDescriptor(ctor));
		}
		serviceIdentifiers.push(id);
	};
	const defineInstance = <T>(id: ServiceIdentifier<T>, instance: T) => {
		if (!services.has(id)) {
			services.set(id, instance);
		}
		serviceIdentifiers.push(id);
	};

	define(IAccessibilityService, TestAccessibilityService);
	define(IKeybindingService, MockKeybindingService);
	define(IClipboardService, TestClipboardService);
	define(IEditorWorkerService, TestEditorWorkerService);
	defineInstance(IOpenerService, NullOpenerService);
	define(INotificationService, TestNotificationService);
	define(IDialogService, TestDialogService);
	define(IUndoRedoService, UndoRedoService);
	define(ILanguageService, LanguageService);
	define(ILanguageConfigurationService, TestLanguageConfigurationService);
	define(IConfigurationService, TestConfigurationService);
	define(ITextResourcePropertiesService, TestTextResourcePropertiesService);
	define(IThemeService, TestThemeService);
	define(ILogService, NullLogService);
	define(IModelService, ModelService);
	define(ICodeEditorService, TestCodeEditorService);
	define(IContextKeyService, MockContextKeyService);
	define(ICommandService, TestCommandService);
	define(ITelemetryService, NullTelemetryServiceShape);
	define(ILoggerService, NullLoggerService);
	define(IDataChannelService, NullDataChannelService);
	define(IEnvironmentService, class extends mock<IEnvironmentService>() {
		declare readonly _serviceBrand: undefined;
		override isBuilt: boolean = true;
		override isExtensionDevelopment: boolean = false;
	});
	define(ILanguageFeatureDebounceService, LanguageFeatureDebounceService);
	define(ILanguageFeaturesService, LanguageFeaturesService);
	define(ITreeSitterLibraryService, TestTreeSitterLibraryService);
	define(IInlineCompletionsService, InlineCompletionsService);

	const instantiationService = disposables.add(new TestInstantiationService(services, true));
	disposables.add(toDisposable(() => {
		for (const id of serviceIdentifiers) {
			const instanceOrDescriptor = services.get(id);
			if (typeof instanceOrDescriptor.dispose === 'function') {
				instanceOrDescriptor.dispose();
			}
		}
	}));
	return instantiationService;
}

export function createTestCodeEditor(model: ITextModel | undefined, options: TestCodeEditorInstantiationOptions = {}): ITestCodeEditor {
	const disposables = new DisposableStore();
	const instantiationService = createCodeEditorServices(disposables, options.serviceCollection);
	delete options.serviceCollection;

	const editor = instantiateTestCodeEditor(instantiationService, model || null, options);
	editor.registerDisposable(disposables);
	return editor;
}

export function instantiateTestCodeEditor(instantiationService: IInstantiationService, model: ITextModel | null, options: TestCodeEditorCreationOptions = {}): ITestCodeEditor {
	const codeEditorWidgetOptions: ICodeEditorWidgetOptions = {
		contributions: []
	};
	const editor = instantiationService.createInstance(
		TestCodeEditor,
		// eslint-disable-next-line local/code-no-any-casts
		<HTMLElement><any>new TestEditorDomElement(),
		options,
		codeEditorWidgetOptions
	);
	if (typeof options.hasTextFocus === 'undefined') {
		options.hasTextFocus = true;
	}
	editor.setHasTextFocus(options.hasTextFocus);
	editor.setModel(model);
	const viewModel = editor.getViewModel();
	viewModel?.setHasFocus(options.hasTextFocus);
	return <ITestCodeEditor>editor;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/testCommand.ts]---
Location: vscode-main/src/vs/editor/test/browser/testCommand.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IRange } from '../../common/core/range.js';
import { Selection, ISelection } from '../../common/core/selection.js';
import { ICommand, IEditOperationBuilder } from '../../common/editorCommon.js';
import { ITextModel } from '../../common/model.js';
import { instantiateTestCodeEditor, createCodeEditorServices } from './testCodeEditor.js';
import { instantiateTextModel } from '../common/testTextModel.js';
import { ServicesAccessor } from '../../../platform/instantiation/common/instantiation.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { ISingleEditOperation } from '../../common/core/editOperation.js';

export function testCommand(
	lines: string[],
	languageId: string | null,
	selection: Selection,
	commandFactory: (accessor: ServicesAccessor, selection: Selection) => ICommand,
	expectedLines: string[],
	expectedSelection: Selection,
	forceTokenization?: boolean,
	prepare?: (accessor: ServicesAccessor, disposables: DisposableStore) => void
): void {
	const disposables = new DisposableStore();
	const instantiationService = createCodeEditorServices(disposables);
	if (prepare) {
		instantiationService.invokeFunction(prepare, disposables);
	}
	const model = disposables.add(instantiateTextModel(instantiationService, lines.join('\n'), languageId));
	const editor = disposables.add(instantiateTestCodeEditor(instantiationService, model));
	const viewModel = editor.getViewModel()!;

	if (forceTokenization) {
		model.tokenization.forceTokenization(model.getLineCount());
	}

	viewModel.setSelections('tests', [selection]);

	const command = instantiationService.invokeFunction((accessor) => commandFactory(accessor, viewModel.getSelection()));
	viewModel.executeCommand(command, 'tests');

	assert.deepStrictEqual(model.getLinesContent(), expectedLines);

	const actualSelection = viewModel.getSelection();
	assert.deepStrictEqual(actualSelection.toString(), expectedSelection.toString());

	disposables.dispose();
}

/**
 * Extract edit operations if command `command` were to execute on model `model`
 */
export function getEditOperation(model: ITextModel, command: ICommand): ISingleEditOperation[] {
	const operations: ISingleEditOperation[] = [];
	const editOperationBuilder: IEditOperationBuilder = {
		addEditOperation: (range: IRange, text: string, forceMoveMarkers: boolean = false) => {
			operations.push({
				range: range,
				text: text,
				forceMoveMarkers: forceMoveMarkers
			});
		},

		addTrackedEditOperation: (range: IRange, text: string, forceMoveMarkers: boolean = false) => {
			operations.push({
				range: range,
				text: text,
				forceMoveMarkers: forceMoveMarkers
			});
		},


		trackSelection: (selection: ISelection) => {
			return '';
		}
	};
	command.getEditOperations(model, editOperationBuilder);
	return operations;
}
```

--------------------------------------------------------------------------------

````

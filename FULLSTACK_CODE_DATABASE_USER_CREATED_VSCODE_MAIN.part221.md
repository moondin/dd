---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 221
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 221 of 552)

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

---[FILE: src/vs/editor/contrib/codelens/browser/codelensController.ts]---
Location: vscode-main/src/vs/editor/contrib/codelens/browser/codelensController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { CancelablePromise, createCancelablePromise, disposableTimeout, RunOnceScheduler } from '../../../../base/common/async.js';
import { onUnexpectedError, onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { StableEditorScrollState } from '../../../browser/stableEditorScroll.js';
import { IActiveCodeEditor, ICodeEditor, IViewZoneChangeAccessor, MouseTargetType } from '../../../browser/editorBrowser.js';
import { EditorAction, EditorContributionInstantiation, registerEditorAction, registerEditorContribution, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { EDITOR_FONT_DEFAULTS } from '../../../common/config/fontInfo.js';
import { IEditorContribution } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { IModelDecorationsChangeAccessor } from '../../../common/model.js';
import { CodeLens, Command } from '../../../common/languages.js';
import { CodeLensItem, CodeLensModel, getCodeLensModel } from './codelens.js';
import { ICodeLensCache } from './codeLensCache.js';
import { CodeLensHelper, CodeLensWidget } from './codelensWidget.js';
import { localize, localize2 } from '../../../../nls.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { IFeatureDebounceInformation, ILanguageFeatureDebounceService } from '../../../common/services/languageFeatureDebounce.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';

export class CodeLensContribution implements IEditorContribution {

	static readonly ID: string = 'css.editor.codeLens';

	private readonly _disposables = new DisposableStore();
	private readonly _localToDispose = new DisposableStore();

	private readonly _lenses: CodeLensWidget[] = [];

	private readonly _provideCodeLensDebounce: IFeatureDebounceInformation;
	private readonly _resolveCodeLensesDebounce: IFeatureDebounceInformation;
	private readonly _resolveCodeLensesScheduler: RunOnceScheduler;

	private _getCodeLensModelPromise: CancelablePromise<CodeLensModel> | undefined;
	private readonly _oldCodeLensModels = new DisposableStore();
	private _currentCodeLensModel: CodeLensModel | undefined;
	private _resolveCodeLensesPromise: CancelablePromise<void[]> | undefined;

	constructor(
		private readonly _editor: ICodeEditor,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
		@ILanguageFeatureDebounceService debounceService: ILanguageFeatureDebounceService,
		@ICommandService private readonly _commandService: ICommandService,
		@INotificationService private readonly _notificationService: INotificationService,
		@ICodeLensCache private readonly _codeLensCache: ICodeLensCache
	) {
		this._provideCodeLensDebounce = debounceService.for(_languageFeaturesService.codeLensProvider, 'CodeLensProvide', { min: 250 });
		this._resolveCodeLensesDebounce = debounceService.for(_languageFeaturesService.codeLensProvider, 'CodeLensResolve', { min: 250, salt: 'resolve' });
		this._resolveCodeLensesScheduler = new RunOnceScheduler(() => this._resolveCodeLensesInViewport(), this._resolveCodeLensesDebounce.default());

		this._disposables.add(this._editor.onDidChangeModel(() => this._onModelChange()));
		this._disposables.add(this._editor.onDidChangeModelLanguage(() => this._onModelChange()));
		this._disposables.add(this._editor.onDidChangeConfiguration((e) => {
			if (e.hasChanged(EditorOption.fontInfo) || e.hasChanged(EditorOption.codeLensFontSize) || e.hasChanged(EditorOption.codeLensFontFamily)) {
				this._updateLensStyle();
			}
			if (e.hasChanged(EditorOption.codeLens)) {
				this._onModelChange();
			}
		}));
		this._disposables.add(_languageFeaturesService.codeLensProvider.onDidChange(this._onModelChange, this));
		this._onModelChange();

		this._updateLensStyle();
	}

	dispose(): void {
		this._localDispose();
		this._localToDispose.dispose();
		this._disposables.dispose();
		this._oldCodeLensModels.dispose();
		this._currentCodeLensModel?.dispose();
	}

	private _getLayoutInfo() {
		const lineHeightFactor = Math.max(1.3, this._editor.getOption(EditorOption.lineHeight) / this._editor.getOption(EditorOption.fontSize));
		let fontSize = this._editor.getOption(EditorOption.codeLensFontSize);
		if (!fontSize || fontSize < 5) {
			fontSize = (this._editor.getOption(EditorOption.fontSize) * .9) | 0;
		}
		return {
			fontSize,
			codeLensHeight: (fontSize * lineHeightFactor) | 0,
		};
	}

	private _updateLensStyle(): void {

		const { codeLensHeight, fontSize } = this._getLayoutInfo();
		const fontFamily = this._editor.getOption(EditorOption.codeLensFontFamily);
		const editorFontInfo = this._editor.getOption(EditorOption.fontInfo);

		const { style } = this._editor.getContainerDomNode();

		style.setProperty('--vscode-editorCodeLens-lineHeight', `${codeLensHeight}px`);
		style.setProperty('--vscode-editorCodeLens-fontSize', `${fontSize}px`);
		style.setProperty('--vscode-editorCodeLens-fontFeatureSettings', editorFontInfo.fontFeatureSettings);

		if (fontFamily) {
			style.setProperty('--vscode-editorCodeLens-fontFamily', fontFamily);
			style.setProperty('--vscode-editorCodeLens-fontFamilyDefault', EDITOR_FONT_DEFAULTS.fontFamily);
		}

		//
		this._editor.changeViewZones(accessor => {
			for (const lens of this._lenses) {
				lens.updateHeight(codeLensHeight, accessor);
			}
		});
	}

	private _localDispose(): void {
		this._getCodeLensModelPromise?.cancel();
		this._getCodeLensModelPromise = undefined;
		this._resolveCodeLensesPromise?.cancel();
		this._resolveCodeLensesPromise = undefined;
		this._localToDispose.clear();
		this._oldCodeLensModels.clear();
		this._currentCodeLensModel?.dispose();
	}

	private _onModelChange(): void {

		this._localDispose();

		const model = this._editor.getModel();
		if (!model) {
			return;
		}

		if (!this._editor.getOption(EditorOption.codeLens) || model.isTooLargeForTokenization()) {
			return;
		}

		const cachedLenses = this._codeLensCache.get(model);
		if (cachedLenses) {
			this._renderCodeLensSymbols(cachedLenses);
		}

		if (!this._languageFeaturesService.codeLensProvider.has(model)) {
			// no provider -> return but check with
			// cached lenses. they expire after 30 seconds
			if (cachedLenses) {
				disposableTimeout(() => {
					const cachedLensesNow = this._codeLensCache.get(model);
					if (cachedLenses === cachedLensesNow) {
						this._codeLensCache.delete(model);
						this._onModelChange();
					}
				}, 30 * 1000, this._localToDispose);
			}
			return;
		}

		for (const provider of this._languageFeaturesService.codeLensProvider.all(model)) {
			if (typeof provider.onDidChange === 'function') {
				const registration = provider.onDidChange(() => scheduler.schedule());
				this._localToDispose.add(registration);
			}
		}

		const scheduler = new RunOnceScheduler(() => {
			const t1 = Date.now();

			this._getCodeLensModelPromise?.cancel();
			this._getCodeLensModelPromise = createCancelablePromise(token => getCodeLensModel(this._languageFeaturesService.codeLensProvider, model, token));

			this._getCodeLensModelPromise.then(result => {
				if (this._currentCodeLensModel) {
					this._oldCodeLensModels.add(this._currentCodeLensModel);
				}
				this._currentCodeLensModel = result;

				// cache model to reduce flicker
				this._codeLensCache.put(model, result);

				// update moving average
				const newDelay = this._provideCodeLensDebounce.update(model, Date.now() - t1);
				scheduler.delay = newDelay;

				// render lenses
				this._renderCodeLensSymbols(result);
				// dom.scheduleAtNextAnimationFrame(() => this._resolveCodeLensesInViewport());
				this._resolveCodeLensesInViewportSoon();
			}, onUnexpectedError);

		}, this._provideCodeLensDebounce.get(model));

		this._localToDispose.add(scheduler);
		this._localToDispose.add(toDisposable(() => this._resolveCodeLensesScheduler.cancel()));
		this._localToDispose.add(this._editor.onDidChangeModelContent(() => {
			this._editor.changeDecorations(decorationsAccessor => {
				this._editor.changeViewZones(viewZonesAccessor => {
					const toDispose: CodeLensWidget[] = [];
					let lastLensLineNumber: number = -1;

					this._lenses.forEach((lens) => {
						if (!lens.isValid() || lastLensLineNumber === lens.getLineNumber()) {
							// invalid -> lens collapsed, attach range doesn't exist anymore
							// line_number -> lenses should never be on the same line
							toDispose.push(lens);

						} else {
							lens.update(viewZonesAccessor);
							lastLensLineNumber = lens.getLineNumber();
						}
					});

					const helper = new CodeLensHelper();
					toDispose.forEach((l) => {
						l.dispose(helper, viewZonesAccessor);
						this._lenses.splice(this._lenses.indexOf(l), 1);
					});
					helper.commit(decorationsAccessor);
				});
			});

			// Ask for all references again
			scheduler.schedule();

			// Cancel pending and active resolve requests
			this._resolveCodeLensesScheduler.cancel();
			this._resolveCodeLensesPromise?.cancel();
			this._resolveCodeLensesPromise = undefined;
		}));
		this._localToDispose.add(this._editor.onDidFocusEditorText(() => {
			scheduler.schedule();
		}));
		this._localToDispose.add(this._editor.onDidBlurEditorText(() => {
			scheduler.cancel();
		}));
		this._localToDispose.add(this._editor.onDidScrollChange(e => {
			if (e.scrollTopChanged && this._lenses.length > 0) {
				this._resolveCodeLensesInViewportSoon();
			}
		}));
		this._localToDispose.add(this._editor.onDidLayoutChange(() => {
			this._resolveCodeLensesInViewportSoon();
		}));
		this._localToDispose.add(toDisposable(() => {
			if (this._editor.getModel()) {
				const scrollState = StableEditorScrollState.capture(this._editor);
				this._editor.changeDecorations(decorationsAccessor => {
					this._editor.changeViewZones(viewZonesAccessor => {
						this._disposeAllLenses(decorationsAccessor, viewZonesAccessor);
					});
				});
				scrollState.restore(this._editor);
			} else {
				// No accessors available
				this._disposeAllLenses(undefined, undefined);
			}
		}));
		this._localToDispose.add(this._editor.onMouseDown(e => {
			if (e.target.type !== MouseTargetType.CONTENT_WIDGET) {
				return;
			}
			let target = e.target.element;
			if (target?.tagName === 'SPAN') {
				target = target.parentElement;
			}
			if (target?.tagName === 'A') {
				for (const lens of this._lenses) {
					const command = lens.getCommand(target as HTMLLinkElement);
					if (command) {
						this._commandService.executeCommand(command.id, ...(command.arguments || [])).catch(err => this._notificationService.error(err));
						break;
					}
				}
			}
		}));
		scheduler.schedule();
	}

	private _disposeAllLenses(decChangeAccessor: IModelDecorationsChangeAccessor | undefined, viewZoneChangeAccessor: IViewZoneChangeAccessor | undefined): void {
		const helper = new CodeLensHelper();
		for (const lens of this._lenses) {
			lens.dispose(helper, viewZoneChangeAccessor);
		}
		if (decChangeAccessor) {
			helper.commit(decChangeAccessor);
		}
		this._lenses.length = 0;
	}

	private _renderCodeLensSymbols(symbols: CodeLensModel): void {
		if (!this._editor.hasModel()) {
			return;
		}

		const maxLineNumber = this._editor.getModel().getLineCount();
		const groups: CodeLensItem[][] = [];
		let lastGroup: CodeLensItem[] | undefined;

		for (const symbol of symbols.lenses) {
			const line = symbol.symbol.range.startLineNumber;
			if (line < 1 || line > maxLineNumber) {
				// invalid code lens
				continue;
			} else if (lastGroup && lastGroup[lastGroup.length - 1].symbol.range.startLineNumber === line) {
				// on same line as previous
				lastGroup.push(symbol);
			} else {
				// on later line as previous
				lastGroup = [symbol];
				groups.push(lastGroup);
			}
		}

		if (!groups.length && !this._lenses.length) {
			// Nothing to change
			return;
		}

		const scrollState = StableEditorScrollState.capture(this._editor);
		const layoutInfo = this._getLayoutInfo();

		this._editor.changeDecorations(decorationsAccessor => {
			this._editor.changeViewZones(viewZoneAccessor => {

				const helper = new CodeLensHelper();
				let codeLensIndex = 0;
				let groupsIndex = 0;

				while (groupsIndex < groups.length && codeLensIndex < this._lenses.length) {

					const symbolsLineNumber = groups[groupsIndex][0].symbol.range.startLineNumber;
					const codeLensLineNumber = this._lenses[codeLensIndex].getLineNumber();

					if (codeLensLineNumber < symbolsLineNumber) {
						this._lenses[codeLensIndex].dispose(helper, viewZoneAccessor);
						this._lenses.splice(codeLensIndex, 1);
					} else if (codeLensLineNumber === symbolsLineNumber) {
						this._lenses[codeLensIndex].updateCodeLensSymbols(groups[groupsIndex], helper);
						groupsIndex++;
						codeLensIndex++;
					} else {
						this._lenses.splice(codeLensIndex, 0, new CodeLensWidget(groups[groupsIndex], <IActiveCodeEditor>this._editor, helper, viewZoneAccessor, layoutInfo.codeLensHeight, () => this._resolveCodeLensesInViewportSoon()));
						codeLensIndex++;
						groupsIndex++;
					}
				}

				// Delete extra code lenses
				while (codeLensIndex < this._lenses.length) {
					this._lenses[codeLensIndex].dispose(helper, viewZoneAccessor);
					this._lenses.splice(codeLensIndex, 1);
				}

				// Create extra symbols
				while (groupsIndex < groups.length) {
					this._lenses.push(new CodeLensWidget(groups[groupsIndex], <IActiveCodeEditor>this._editor, helper, viewZoneAccessor, layoutInfo.codeLensHeight, () => this._resolveCodeLensesInViewportSoon()));
					groupsIndex++;
				}

				helper.commit(decorationsAccessor);
			});
		});

		scrollState.restore(this._editor);
	}

	private _resolveCodeLensesInViewportSoon(): void {
		const model = this._editor.getModel();
		if (model) {
			this._resolveCodeLensesScheduler.schedule();
		}
	}

	private _resolveCodeLensesInViewport(): void {

		this._resolveCodeLensesPromise?.cancel();
		this._resolveCodeLensesPromise = undefined;

		const model = this._editor.getModel();
		if (!model) {
			return;
		}

		const toResolve: Array<ReadonlyArray<CodeLensItem>> = [];
		const lenses: CodeLensWidget[] = [];
		this._lenses.forEach((lens) => {
			const request = lens.computeIfNecessary(model);
			if (request) {
				toResolve.push(request);
				lenses.push(lens);
			}
		});

		if (toResolve.length === 0) {
			this._oldCodeLensModels.clear();
			return;
		}

		const t1 = Date.now();

		const resolvePromise = createCancelablePromise(token => {

			const promises = toResolve.map((request, i) => {

				const resolvedSymbols = new Array<CodeLens | undefined | null>(request.length);
				const promises = request.map((request, i) => {
					if (!request.symbol.command && typeof request.provider.resolveCodeLens === 'function') {
						return Promise.resolve(request.provider.resolveCodeLens(model, request.symbol, token)).then(symbol => {
							resolvedSymbols[i] = symbol;
						}, onUnexpectedExternalError);
					} else {
						resolvedSymbols[i] = request.symbol;
						return Promise.resolve(undefined);
					}
				});

				return Promise.all(promises).then(() => {
					if (!token.isCancellationRequested && !lenses[i].isDisposed()) {
						lenses[i].updateCommands(resolvedSymbols);
					}
				});
			});

			return Promise.all(promises);
		});
		this._resolveCodeLensesPromise = resolvePromise;

		this._resolveCodeLensesPromise.then(() => {

			// update moving average
			const newDelay = this._resolveCodeLensesDebounce.update(model, Date.now() - t1);
			this._resolveCodeLensesScheduler.delay = newDelay;

			if (this._currentCodeLensModel) { // update the cached state with new resolved items
				this._codeLensCache.put(model, this._currentCodeLensModel);
			}
			this._oldCodeLensModels.clear(); // dispose old models once we have updated the UI with the current model
			if (resolvePromise === this._resolveCodeLensesPromise) {
				this._resolveCodeLensesPromise = undefined;
			}
		}, err => {
			onUnexpectedError(err); // can also be cancellation!
			if (resolvePromise === this._resolveCodeLensesPromise) {
				this._resolveCodeLensesPromise = undefined;
			}
		});
	}

	async getModel(): Promise<CodeLensModel | undefined> {
		await this._getCodeLensModelPromise;
		await this._resolveCodeLensesPromise;
		return !this._currentCodeLensModel?.isDisposed
			? this._currentCodeLensModel
			: undefined;
	}
}

registerEditorContribution(CodeLensContribution.ID, CodeLensContribution, EditorContributionInstantiation.AfterFirstRender);

registerEditorAction(class ShowLensesInCurrentLine extends EditorAction {

	constructor() {
		super({
			id: 'codelens.showLensesInCurrentLine',
			precondition: EditorContextKeys.hasCodeLensProvider,
			label: localize2('showLensOnLine', "Show CodeLens Commands for Current Line"),
		});
	}

	async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {

		if (!editor.hasModel()) {
			return;
		}

		const quickInputService = accessor.get(IQuickInputService);
		const commandService = accessor.get(ICommandService);
		const notificationService = accessor.get(INotificationService);

		const lineNumber = editor.getSelection().positionLineNumber;
		const codelensController = editor.getContribution<CodeLensContribution>(CodeLensContribution.ID);
		if (!codelensController) {
			return;
		}

		const model = await codelensController.getModel();
		if (!model) {
			// nothing
			return;
		}

		const items: { label: string; command: Command }[] = [];
		for (const lens of model.lenses) {
			if (lens.symbol.command && lens.symbol.range.startLineNumber === lineNumber) {
				items.push({
					label: lens.symbol.command.title,
					command: lens.symbol.command
				});
			}
		}

		if (items.length === 0) {
			// We dont want an empty picker
			return;
		}

		const item = await quickInputService.pick(items, {
			canPickMany: false,
			placeHolder: localize('placeHolder', "Select a command")
		});
		if (!item) {
			// Nothing picked
			return;
		}

		let command = item.command;

		if (model.isDisposed) {
			// try to find the same command again in-case the model has been re-created in the meantime
			// this is a best attempt approach which shouldn't be needed because eager model re-creates
			// shouldn't happen due to focus in/out anymore
			const newModel = await codelensController.getModel();
			const newLens = newModel?.lenses.find(lens => lens.symbol.range.startLineNumber === lineNumber && lens.symbol.command?.title === command.title);
			if (!newLens || !newLens.symbol.command) {
				return;
			}
			command = newLens.symbol.command;
		}

		try {
			await commandService.executeCommand(command.id, ...(command.arguments || []));
		} catch (err) {
			notificationService.error(err);
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/codelens/browser/codelensWidget.css]---
Location: vscode-main/src/vs/editor/contrib/codelens/browser/codelensWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .codelens-decoration {
	overflow: hidden;
	display: inline-flex !important; /* !important to override inline display:block style */
	align-items: center;
	text-overflow: ellipsis;
	white-space: nowrap;
	color: var(--vscode-editorCodeLens-foreground);
	line-height: var(--vscode-editorCodeLens-lineHeight);
	font-size: var(--vscode-editorCodeLens-fontSize);
	padding-right: calc(var(--vscode-editorCodeLens-fontSize)*0.5);
	font-feature-settings: var(--vscode-editorCodeLens-fontFeatureSettings);
	font-family: var(--vscode-editorCodeLens-fontFamily), var(--vscode-editorCodeLens-fontFamilyDefault);
}

.monaco-editor .codelens-decoration > span,
.monaco-editor .codelens-decoration > a {
	user-select: none;
	-webkit-user-select: none;
	white-space: nowrap;
	vertical-align: sub;
	display: inline-flex;
	align-items: center;
}

.monaco-editor .codelens-decoration > a {
	text-decoration: none;
}

.monaco-editor .codelens-decoration > a:hover {
	cursor: pointer;
	color: var(--vscode-editorLink-activeForeground) !important;
}

.monaco-editor .codelens-decoration > a:hover .codicon {
	color: var(--vscode-editorLink-activeForeground) !important;
}

.monaco-editor .codelens-decoration .codicon[class*='codicon-'] {
	vertical-align: middle;
	color: currentColor !important;
	color: var(--vscode-editorCodeLens-foreground);
	line-height: var(--vscode-editorCodeLens-lineHeight);
	font-size: var(--vscode-editorCodeLens-fontSize);
}


.monaco-editor .codelens-decoration > a:hover .codicon::before {
	cursor: pointer;
}

@keyframes fadein {
	0% { opacity: 0;}
	100% { opacity: 1;}
}

.monaco-editor .codelens-decoration.fadein {
	animation: fadein 0.1s linear;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/codelens/browser/codelensWidget.ts]---
Location: vscode-main/src/vs/editor/contrib/codelens/browser/codelensWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { renderLabelWithIcons } from '../../../../base/browser/ui/iconLabel/iconLabels.js';
import { Constants } from '../../../../base/common/uint.js';
import './codelensWidget.css';
import { ContentWidgetPositionPreference, IActiveCodeEditor, IContentWidget, IContentWidgetPosition, IViewZone, IViewZoneChangeAccessor } from '../../../browser/editorBrowser.js';
import { Range } from '../../../common/core/range.js';
import { IModelDecorationsChangeAccessor, IModelDeltaDecoration, ITextModel } from '../../../common/model.js';
import { ModelDecorationOptions } from '../../../common/model/textModel.js';
import { CodeLens, Command } from '../../../common/languages.js';
import { CodeLensItem } from './codelens.js';

class CodeLensViewZone implements IViewZone {

	readonly suppressMouseDown: boolean;
	readonly domNode: HTMLElement;

	afterLineNumber: number;
	/**
	 * We want that this view zone, which reserves space for a code lens appears
	 * as close as possible to the next line, so we use a very large value here.
	 */
	readonly afterColumn = Constants.MAX_SAFE_SMALL_INTEGER;
	heightInPx: number;

	private _lastHeight?: number;
	private readonly _onHeight: () => void;

	constructor(afterLineNumber: number, heightInPx: number, onHeight: () => void) {
		this.afterLineNumber = afterLineNumber;
		this.heightInPx = heightInPx;

		this._onHeight = onHeight;
		this.suppressMouseDown = true;
		this.domNode = document.createElement('div');
	}

	onComputedHeight(height: number): void {
		if (this._lastHeight === undefined) {
			this._lastHeight = height;
		} else if (this._lastHeight !== height) {
			this._lastHeight = height;
			this._onHeight();
		}
	}

	isVisible(): boolean {
		return this._lastHeight !== 0
			&& this.domNode.hasAttribute('monaco-visible-view-zone');
	}
}

class CodeLensContentWidget implements IContentWidget {

	private static _idPool: number = 0;

	// Editor.IContentWidget.allowEditorOverflow
	readonly allowEditorOverflow: boolean = false;
	readonly suppressMouseDown: boolean = true;

	private readonly _id: string;
	private readonly _domNode: HTMLElement;
	private readonly _editor: IActiveCodeEditor;
	private readonly _commands = new Map<string, Command>();

	private _widgetPosition?: IContentWidgetPosition;
	private _isEmpty: boolean = true;

	constructor(
		editor: IActiveCodeEditor,
		line: number,
	) {
		this._editor = editor;
		this._id = `codelens.widget-${(CodeLensContentWidget._idPool++)}`;

		this.updatePosition(line);

		this._domNode = document.createElement('span');
		this._domNode.className = `codelens-decoration`;
	}

	withCommands(lenses: ReadonlyArray<CodeLens | undefined | null>, animate: boolean): void {
		this._commands.clear();

		const children: HTMLElement[] = [];
		let hasSymbol = false;
		for (let i = 0; i < lenses.length; i++) {
			const lens = lenses[i];
			if (!lens) {
				continue;
			}
			hasSymbol = true;
			if (lens.command) {
				const title = renderLabelWithIcons(lens.command.title.trim());
				if (lens.command.id) {
					const id = `c${(CodeLensContentWidget._idPool++)}`;
					children.push(dom.$('a', { id, title: lens.command.tooltip, role: 'button' }, ...title));
					this._commands.set(id, lens.command);
				} else {
					children.push(dom.$('span', { title: lens.command.tooltip }, ...title));
				}
				if (i + 1 < lenses.length) {
					children.push(dom.$('span', undefined, '\u00a0|\u00a0'));
				}
			}
		}

		if (!hasSymbol) {
			// symbols but no commands
			dom.reset(this._domNode, dom.$('span', undefined, 'no commands'));

		} else {
			// symbols and commands
			dom.reset(this._domNode, ...children);
			if (this._isEmpty && animate) {
				this._domNode.classList.add('fadein');
			}
			this._isEmpty = false;
		}
	}

	getCommand(link: HTMLLinkElement): Command | undefined {
		return link.parentElement === this._domNode
			? this._commands.get(link.id)
			: undefined;
	}

	getId(): string {
		return this._id;
	}

	getDomNode(): HTMLElement {
		return this._domNode;
	}

	updatePosition(line: number): void {
		const column = this._editor.getModel().getLineFirstNonWhitespaceColumn(line);
		this._widgetPosition = {
			position: { lineNumber: line, column: column },
			preference: [ContentWidgetPositionPreference.ABOVE]
		};
	}

	getPosition(): IContentWidgetPosition | null {
		return this._widgetPosition || null;
	}
}

export interface IDecorationIdCallback {
	(decorationId: string): void;
}

export class CodeLensHelper {

	private readonly _removeDecorations: string[];
	private readonly _addDecorations: IModelDeltaDecoration[];
	private readonly _addDecorationsCallbacks: IDecorationIdCallback[];

	constructor() {
		this._removeDecorations = [];
		this._addDecorations = [];
		this._addDecorationsCallbacks = [];
	}

	addDecoration(decoration: IModelDeltaDecoration, callback: IDecorationIdCallback): void {
		this._addDecorations.push(decoration);
		this._addDecorationsCallbacks.push(callback);
	}

	removeDecoration(decorationId: string): void {
		this._removeDecorations.push(decorationId);
	}

	commit(changeAccessor: IModelDecorationsChangeAccessor): void {
		const resultingDecorations = changeAccessor.deltaDecorations(this._removeDecorations, this._addDecorations);
		for (let i = 0, len = resultingDecorations.length; i < len; i++) {
			this._addDecorationsCallbacks[i](resultingDecorations[i]);
		}
	}
}

const codeLensDecorationOptions = ModelDecorationOptions.register({
	collapseOnReplaceEdit: true,
	description: 'codelens'
});

export class CodeLensWidget {

	private readonly _editor: IActiveCodeEditor;
	private readonly _viewZone: CodeLensViewZone;
	private readonly _viewZoneId: string;

	private _contentWidget?: CodeLensContentWidget;
	private _decorationIds: string[];
	private _data: readonly CodeLensItem[];
	private _isDisposed: boolean = false;

	constructor(
		data: readonly CodeLensItem[],
		editor: IActiveCodeEditor,
		helper: CodeLensHelper,
		viewZoneChangeAccessor: IViewZoneChangeAccessor,
		heightInPx: number,
		updateCallback: () => void
	) {
		this._editor = editor;
		this._data = data;

		// create combined range, track all ranges with decorations,
		// check if there is already something to render
		this._decorationIds = [];
		let range: Range | undefined;
		const lenses: CodeLens[] = [];

		this._data.forEach((codeLensData, i) => {

			if (codeLensData.symbol.command) {
				lenses.push(codeLensData.symbol);
			}

			helper.addDecoration({
				range: codeLensData.symbol.range,
				options: codeLensDecorationOptions
			}, id => this._decorationIds[i] = id);

			// the range contains all lenses on this line
			if (!range) {
				range = Range.lift(codeLensData.symbol.range);
			} else {
				range = Range.plusRange(range, codeLensData.symbol.range);
			}
		});

		this._viewZone = new CodeLensViewZone(range!.startLineNumber - 1, heightInPx, updateCallback);
		this._viewZoneId = viewZoneChangeAccessor.addZone(this._viewZone);

		if (lenses.length > 0) {
			this._createContentWidgetIfNecessary();
			this._contentWidget!.withCommands(lenses, false);
		}
	}

	private _createContentWidgetIfNecessary(): void {
		if (!this._contentWidget) {
			this._contentWidget = new CodeLensContentWidget(this._editor, this._viewZone.afterLineNumber + 1);
			this._editor.addContentWidget(this._contentWidget);
		} else {
			this._editor.layoutContentWidget(this._contentWidget);
		}
	}

	dispose(helper: CodeLensHelper, viewZoneChangeAccessor?: IViewZoneChangeAccessor): void {
		this._decorationIds.forEach(helper.removeDecoration, helper);
		this._decorationIds = [];
		viewZoneChangeAccessor?.removeZone(this._viewZoneId);
		if (this._contentWidget) {
			this._editor.removeContentWidget(this._contentWidget);
			this._contentWidget = undefined;
		}
		this._isDisposed = true;
	}

	isDisposed(): boolean {
		return this._isDisposed;
	}

	isValid(): boolean {
		return this._decorationIds.some((id, i) => {
			const range = this._editor.getModel().getDecorationRange(id);
			const symbol = this._data[i].symbol;
			return !!(range && Range.isEmpty(symbol.range) === range.isEmpty());
		});
	}

	updateCodeLensSymbols(data: readonly CodeLensItem[], helper: CodeLensHelper): void {
		this._decorationIds.forEach(helper.removeDecoration, helper);
		this._decorationIds = [];
		this._data = data;
		this._data.forEach((codeLensData, i) => {
			helper.addDecoration({
				range: codeLensData.symbol.range,
				options: codeLensDecorationOptions
			}, id => this._decorationIds[i] = id);
		});
	}

	updateHeight(height: number, viewZoneChangeAccessor: IViewZoneChangeAccessor): void {
		this._viewZone.heightInPx = height;
		viewZoneChangeAccessor.layoutZone(this._viewZoneId);
		if (this._contentWidget) {
			this._editor.layoutContentWidget(this._contentWidget);
		}
	}

	computeIfNecessary(model: ITextModel): readonly CodeLensItem[] | null {
		if (!this._viewZone.isVisible()) {
			return null;
		}

		// Read editor current state
		for (let i = 0; i < this._decorationIds.length; i++) {
			const range = model.getDecorationRange(this._decorationIds[i]);
			if (range) {
				this._data[i].symbol.range = range;
			}
		}
		return this._data;
	}

	updateCommands(symbols: ReadonlyArray<CodeLens | undefined | null>): void {
		this._createContentWidgetIfNecessary();
		this._contentWidget!.withCommands(symbols, true);

		for (let i = 0; i < this._data.length; i++) {
			const resolved = symbols[i];
			if (resolved) {
				const { symbol } = this._data[i];
				symbol.command = resolved.command || symbol.command;
			}
		}
	}

	getCommand(link: HTMLLinkElement): Command | undefined {
		return this._contentWidget?.getCommand(link);
	}

	getLineNumber(): number {
		const range = this._editor.getModel().getDecorationRange(this._decorationIds[0]);
		if (range) {
			return range.startLineNumber;
		}
		return -1;
	}

	update(viewZoneChangeAccessor: IViewZoneChangeAccessor): void {
		if (this.isValid()) {
			const range = this._editor.getModel().getDecorationRange(this._decorationIds[0]);
			if (range) {
				this._viewZone.afterLineNumber = range.startLineNumber - 1;
				viewZoneChangeAccessor.layoutZone(this._viewZoneId);

				if (this._contentWidget) {
					this._contentWidget.updatePosition(range.startLineNumber);
					this._editor.layoutContentWidget(this._contentWidget);
				}
			}
		}
	}

	getItems(): readonly CodeLensItem[] {
		return this._data;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/colorPicker/browser/color.ts]---
Location: vscode-main/src/vs/editor/contrib/colorPicker/browser/color.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { illegalArgument, onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { URI } from '../../../../base/common/uri.js';
import { IRange } from '../../../common/core/range.js';
import { ITextModel } from '../../../common/model.js';
import { DocumentColorProvider, IColorInformation, IColorPresentation } from '../../../common/languages.js';
import { IModelService } from '../../../common/services/model.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { LanguageFeatureRegistry } from '../../../common/languageFeatureRegistry.js';
import { DefaultDocumentColorProvider } from './defaultDocumentColorProvider.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ServicesAccessor } from '../../../browser/editorExtensions.js';

export async function getColors(colorProviderRegistry: LanguageFeatureRegistry<DocumentColorProvider>, model: ITextModel, token: CancellationToken, defaultColorDecoratorsEnablement: 'auto' | 'always' | 'never' = 'auto'): Promise<IColorData[]> {
	return _findColorData<IColorData>(new ColorDataCollector(), colorProviderRegistry, model, token, defaultColorDecoratorsEnablement);
}

export function getColorPresentations(model: ITextModel, colorInfo: IColorInformation, provider: DocumentColorProvider, token: CancellationToken): Promise<IColorPresentation[] | null | undefined> {
	return Promise.resolve(provider.provideColorPresentations(model, colorInfo, token));
}

export interface IColorData {
	colorInfo: IColorInformation;
	provider: DocumentColorProvider;
}

export interface IExtColorData { range: IRange; color: [number, number, number, number] }

interface DataCollector<T> {
	compute(provider: DocumentColorProvider, model: ITextModel, token: CancellationToken, result: T[]): Promise<boolean>;
}

class ColorDataCollector implements DataCollector<IColorData> {
	constructor() { }
	async compute(provider: DocumentColorProvider, model: ITextModel, token: CancellationToken, colors: IColorData[]): Promise<boolean> {
		const documentColors = await provider.provideDocumentColors(model, token);
		if (Array.isArray(documentColors)) {
			for (const colorInfo of documentColors) {
				colors.push({ colorInfo, provider });
			}
		}
		return Array.isArray(documentColors);
	}
}

export class ExtColorDataCollector implements DataCollector<IExtColorData> {
	constructor() { }
	async compute(provider: DocumentColorProvider, model: ITextModel, token: CancellationToken, colors: IExtColorData[]): Promise<boolean> {
		const documentColors = await provider.provideDocumentColors(model, token);
		if (Array.isArray(documentColors)) {
			for (const colorInfo of documentColors) {
				colors.push({ range: colorInfo.range, color: [colorInfo.color.red, colorInfo.color.green, colorInfo.color.blue, colorInfo.color.alpha] });
			}
		}
		return Array.isArray(documentColors);
	}

}

export class ColorPresentationsCollector implements DataCollector<IColorPresentation> {
	constructor(private colorInfo: IColorInformation) { }
	async compute(provider: DocumentColorProvider, model: ITextModel, _token: CancellationToken, colors: IColorPresentation[]): Promise<boolean> {
		const documentColors = await provider.provideColorPresentations(model, this.colorInfo, CancellationToken.None);
		if (Array.isArray(documentColors)) {
			colors.push(...documentColors);
		}
		return Array.isArray(documentColors);
	}
}

export async function _findColorData<T extends IColorPresentation | IExtColorData | IColorData>(collector: DataCollector<T>, colorProviderRegistry: LanguageFeatureRegistry<DocumentColorProvider>, model: ITextModel, token: CancellationToken, defaultColorDecoratorsEnablement: 'auto' | 'always' | 'never'): Promise<T[]> {
	let validDocumentColorProviderFound = false;
	let defaultProvider: DefaultDocumentColorProvider | undefined;
	const colorData: T[] = [];
	const documentColorProviders = colorProviderRegistry.ordered(model);
	for (let i = documentColorProviders.length - 1; i >= 0; i--) {
		const provider = documentColorProviders[i];
		if (defaultColorDecoratorsEnablement !== 'always' && provider instanceof DefaultDocumentColorProvider) {
			defaultProvider = provider;
		} else {
			try {
				if (await collector.compute(provider, model, token, colorData)) {
					validDocumentColorProviderFound = true;
				}
			} catch (e) {
				onUnexpectedExternalError(e);
			}
		}
	}
	if (validDocumentColorProviderFound) {
		return colorData;
	}
	if (defaultProvider && defaultColorDecoratorsEnablement !== 'never') {
		await collector.compute(defaultProvider, model, token, colorData);
		return colorData;
	}
	return [];
}

export function _setupColorCommand(accessor: ServicesAccessor, resource: URI): { model: ITextModel; colorProviderRegistry: LanguageFeatureRegistry<DocumentColorProvider>; defaultColorDecoratorsEnablement: 'auto' | 'always' | 'never' } {
	const { colorProvider: colorProviderRegistry } = accessor.get(ILanguageFeaturesService);
	const model = accessor.get(IModelService).getModel(resource);
	if (!model) {
		throw illegalArgument();
	}
	const defaultColorDecoratorsEnablement = accessor.get(IConfigurationService).getValue<'auto' | 'always' | 'never'>('editor.defaultColorDecorators', { resource });
	return { model, colorProviderRegistry, defaultColorDecoratorsEnablement };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/colorPicker/browser/colorDetector.ts]---
Location: vscode-main/src/vs/editor/contrib/colorPicker/browser/colorDetector.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancelablePromise, createCancelablePromise, TimeoutTimer } from '../../../../base/common/async.js';
import { RGBA } from '../../../../base/common/color.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { noBreakWhitespace } from '../../../../base/common/strings.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { DynamicCssRules } from '../../../browser/editorDom.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { IEditorContribution, IEditorDecorationsCollection } from '../../../common/editorCommon.js';
import { IModelDecoration, IModelDeltaDecoration } from '../../../common/model.js';
import { ModelDecorationOptions } from '../../../common/model/textModel.js';
import { IFeatureDebounceInformation, ILanguageFeatureDebounceService } from '../../../common/services/languageFeatureDebounce.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { getColors, IColorData } from './color.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';

export const ColorDecorationInjectedTextMarker = Object.create({});


export class ColorDetector extends Disposable implements IEditorContribution {

	public static readonly ID: string = 'editor.contrib.colorDetector';

	static readonly RECOMPUTE_TIME = 1000; // ms

	private readonly _localToDispose = this._register(new DisposableStore());
	private _computePromise: CancelablePromise<IColorData[]> | null;
	private _timeoutTimer: TimeoutTimer | null;
	private _debounceInformation: IFeatureDebounceInformation;

	private _decorationsIds: string[] = [];
	private _colorDatas = new Map<string, IColorData>();

	private readonly _colorDecoratorIds: IEditorDecorationsCollection;

	private _isColorDecoratorsEnabled: boolean;
	private _defaultColorDecoratorsEnablement: 'auto' | 'always' | 'never';

	private readonly _ruleFactory: DynamicCssRules;

	private readonly _decoratorLimitReporter = this._register(new DecoratorLimitReporter());

	constructor(
		private readonly _editor: ICodeEditor,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
		@ILanguageFeatureDebounceService languageFeatureDebounceService: ILanguageFeatureDebounceService,
	) {
		super();
		this._colorDecoratorIds = this._editor.createDecorationsCollection();
		this._ruleFactory = this._register(new DynamicCssRules(this._editor));
		this._debounceInformation = languageFeatureDebounceService.for(_languageFeaturesService.colorProvider, 'Document Colors', { min: ColorDetector.RECOMPUTE_TIME });
		this._register(_editor.onDidChangeModel(() => {
			this._isColorDecoratorsEnabled = this.isEnabled();
			this.updateColors();
		}));
		this._register(_editor.onDidChangeModelLanguage(() => this.updateColors()));
		this._register(_languageFeaturesService.colorProvider.onDidChange(() => this.updateColors()));
		this._register(_editor.onDidChangeConfiguration((e) => {
			const prevIsEnabled = this._isColorDecoratorsEnabled;
			this._isColorDecoratorsEnabled = this.isEnabled();
			this._defaultColorDecoratorsEnablement = this._editor.getOption(EditorOption.defaultColorDecorators);
			const updatedColorDecoratorsSetting = prevIsEnabled !== this._isColorDecoratorsEnabled || e.hasChanged(EditorOption.colorDecoratorsLimit);
			const updatedDefaultColorDecoratorsSetting = e.hasChanged(EditorOption.defaultColorDecorators);
			if (updatedColorDecoratorsSetting || updatedDefaultColorDecoratorsSetting) {
				if (this._isColorDecoratorsEnabled) {
					this.updateColors();
				}
				else {
					this.removeAllDecorations();
				}
			}
		}));

		this._timeoutTimer = null;
		this._computePromise = null;
		this._isColorDecoratorsEnabled = this.isEnabled();
		this._defaultColorDecoratorsEnablement = this._editor.getOption(EditorOption.defaultColorDecorators);
		this.updateColors();
	}

	isEnabled(): boolean {
		const model = this._editor.getModel();
		if (!model) {
			return false;
		}
		const languageId = model.getLanguageId();
		// handle deprecated settings. [languageId].colorDecorators.enable
		const deprecatedConfig = this._configurationService.getValue(languageId);
		if (deprecatedConfig && typeof deprecatedConfig === 'object') {
			// eslint-disable-next-line local/code-no-any-casts
			const colorDecorators = (deprecatedConfig as any)['colorDecorators']; // deprecatedConfig.valueOf('.colorDecorators.enable');
			if (colorDecorators && colorDecorators['enable'] !== undefined && !colorDecorators['enable']) {
				return colorDecorators['enable'];
			}
		}

		return this._editor.getOption(EditorOption.colorDecorators);
	}

	public get limitReporter() {
		return this._decoratorLimitReporter;
	}

	static get(editor: ICodeEditor): ColorDetector | null {
		return editor.getContribution<ColorDetector>(this.ID);
	}

	override dispose(): void {
		this.stop();
		this.removeAllDecorations();
		super.dispose();
	}

	private updateColors(): void {
		this.stop();

		if (!this._isColorDecoratorsEnabled) {
			return;
		}
		const model = this._editor.getModel();

		if (!model || !this._languageFeaturesService.colorProvider.has(model)) {
			return;
		}

		this._localToDispose.add(this._editor.onDidChangeModelContent(() => {
			if (!this._timeoutTimer) {
				this._timeoutTimer = new TimeoutTimer();
				this._timeoutTimer.cancelAndSet(() => {
					this._timeoutTimer = null;
					this.beginCompute();
				}, this._debounceInformation.get(model));
			}
		}));
		this.beginCompute();
	}

	private async beginCompute(): Promise<void> {
		this._computePromise = createCancelablePromise(async token => {
			const model = this._editor.getModel();
			if (!model) {
				return [];
			}
			const sw = new StopWatch(false);
			const colors = await getColors(this._languageFeaturesService.colorProvider, model, token, this._defaultColorDecoratorsEnablement);
			this._debounceInformation.update(model, sw.elapsed());
			return colors;
		});
		try {
			const colors = await this._computePromise;
			this.updateDecorations(colors);
			this.updateColorDecorators(colors);
			this._computePromise = null;
		} catch (e) {
			onUnexpectedError(e);
		}
	}

	private stop(): void {
		if (this._timeoutTimer) {
			this._timeoutTimer.cancel();
			this._timeoutTimer = null;
		}
		if (this._computePromise) {
			this._computePromise.cancel();
			this._computePromise = null;
		}
		this._localToDispose.clear();
	}

	private updateDecorations(colorDatas: IColorData[]): void {
		const decorations = colorDatas.map(c => ({
			range: {
				startLineNumber: c.colorInfo.range.startLineNumber,
				startColumn: c.colorInfo.range.startColumn,
				endLineNumber: c.colorInfo.range.endLineNumber,
				endColumn: c.colorInfo.range.endColumn
			},
			options: ModelDecorationOptions.EMPTY
		}));

		this._editor.changeDecorations((changeAccessor) => {
			this._decorationsIds = changeAccessor.deltaDecorations(this._decorationsIds, decorations);

			this._colorDatas = new Map<string, IColorData>();
			this._decorationsIds.forEach((id, i) => this._colorDatas.set(id, colorDatas[i]));
		});
	}

	private readonly _colorDecorationClassRefs = this._register(new DisposableStore());

	private updateColorDecorators(colorData: IColorData[]): void {
		this._colorDecorationClassRefs.clear();

		const decorations: IModelDeltaDecoration[] = [];

		const limit = this._editor.getOption(EditorOption.colorDecoratorsLimit);

		for (let i = 0; i < colorData.length && decorations.length < limit; i++) {
			const { red, green, blue, alpha } = colorData[i].colorInfo.color;
			const rgba = new RGBA(Math.round(red * 255), Math.round(green * 255), Math.round(blue * 255), alpha);
			const color = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;

			const ref = this._colorDecorationClassRefs.add(
				this._ruleFactory.createClassNameRef({
					backgroundColor: color
				})
			);

			decorations.push({
				range: {
					startLineNumber: colorData[i].colorInfo.range.startLineNumber,
					startColumn: colorData[i].colorInfo.range.startColumn,
					endLineNumber: colorData[i].colorInfo.range.endLineNumber,
					endColumn: colorData[i].colorInfo.range.endColumn
				},
				options: {
					description: 'colorDetector',
					before: {
						content: noBreakWhitespace,
						inlineClassName: `${ref.className} colorpicker-color-decoration`,
						inlineClassNameAffectsLetterSpacing: true,
						attachedData: ColorDecorationInjectedTextMarker
					}
				}
			});
		}
		const limited = limit < colorData.length ? limit : false;
		this._decoratorLimitReporter.update(colorData.length, limited);

		this._colorDecoratorIds.set(decorations);
	}

	private removeAllDecorations(): void {
		this._editor.removeDecorations(this._decorationsIds);
		this._decorationsIds = [];
		this._colorDecoratorIds.clear();
		this._colorDecorationClassRefs.clear();
	}

	getColorData(position: Position): IColorData | null {
		const model = this._editor.getModel();
		if (!model) {
			return null;
		}

		const decorations = model
			.getDecorationsInRange(Range.fromPositions(position, position))
			.filter(d => this._colorDatas.has(d.id));

		if (decorations.length === 0) {
			return null;
		}

		return this._colorDatas.get(decorations[0].id)!;
	}

	isColorDecoration(decoration: IModelDecoration): boolean {
		return this._colorDecoratorIds.has(decoration);
	}
}

export class DecoratorLimitReporter extends Disposable {
	private _onDidChange = this._register(new Emitter<void>());
	public readonly onDidChange: Event<void> = this._onDidChange.event;

	private _computed: number = 0;
	private _limited: number | false = false;
	public get computed(): number {
		return this._computed;
	}
	public get limited(): number | false {
		return this._limited;
	}
	public update(computed: number, limited: number | false) {
		if (computed !== this._computed || limited !== this._limited) {
			this._computed = computed;
			this._limited = limited;
			this._onDidChange.fire();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/colorPicker/browser/colorPicker.css]---
Location: vscode-main/src/vs/editor/contrib/colorPicker/browser/colorPicker.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.colorpicker-widget {
	height: 190px;
	user-select: none;
	-webkit-user-select: none;
}

/* Decoration */

.colorpicker-color-decoration,
.hc-light .colorpicker-color-decoration {
	border: solid 0.1em #000;
	box-sizing: border-box;
	margin: 0.1em 0.2em 0 0.2em;
	width: 0.8em;
	height: 0.8em;
	line-height: 0.8em;
	display: inline-block;
	cursor: pointer;
}

.hc-black .colorpicker-color-decoration,
.vs-dark .colorpicker-color-decoration {
	border: solid 0.1em #eee;
}

/* Header */

.colorpicker-header {
	display: flex;
	height: 24px;
	position: relative;
	background: url('images/opacity-background.png');
	background-size: 9px 9px;
	image-rendering: pixelated;
}

.colorpicker-header .picked-color {
	width: 240px;
	display: flex;
	align-items: center;
	justify-content: center;
	line-height: 24px;
	cursor: pointer;
	color: white;
	flex: 1;
	white-space: nowrap;
	overflow: hidden;
}

.colorpicker-header .picked-color .picked-color-presentation {
	white-space: nowrap;
	margin-left: 5px;
	margin-right: 5px;
}

.colorpicker-header .picked-color .codicon {
	color: inherit;
	font-size: 14px;
}

.colorpicker-header .picked-color.light {
	color: black;
}

.colorpicker-header .original-color {
	width: 74px;
	z-index: inherit;
	cursor: pointer;
}

.standalone-colorpicker {
	color: var(--vscode-editorHoverWidget-foreground);
	background-color: var(--vscode-editorHoverWidget-background);
	border: 1px solid var(--vscode-editorHoverWidget-border);
}

.colorpicker-header.standalone-colorpicker {
	border-bottom: none;
}

.colorpicker-header .close-button {
	cursor: pointer;
	background-color: var(--vscode-editorHoverWidget-background);
	border-left: 1px solid var(--vscode-editorHoverWidget-border);
}

.colorpicker-header .close-button-inner-div {
	width: 100%;
	height: 100%;
	text-align: center;
}

.colorpicker-header .close-button-inner-div:hover {
	background-color: var(--vscode-toolbar-hoverBackground);
}

.colorpicker-header .close-icon {
	padding: 3px;
}

/* Body */

.colorpicker-body {
	display: flex;
	padding: 8px;
	position: relative;
}

.colorpicker-body .saturation-wrap {
	overflow: hidden;
	height: 150px;
	position: relative;
	min-width: 220px;
	flex: 1;
}

.colorpicker-body .saturation-box {
	height: 150px;
	position: absolute;
}

.colorpicker-body .saturation-selection {
	width: 9px;
	height: 9px;
	margin: -5px 0 0 -5px;
	border: 1px solid rgb(255, 255, 255);
	border-radius: 100%;
	box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.8);
	position: absolute;
}

.colorpicker-body .strip {
	width: 25px;
	height: 150px;
}

.colorpicker-body .standalone-strip {
	width: 25px;
	height: 122px;
}

.colorpicker-body .hue-strip {
	position: relative;
	margin-left: 8px;
	cursor: grab;
	background: linear-gradient(to bottom, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);
}

.colorpicker-body .opacity-strip {
	position: relative;
	margin-left: 8px;
	cursor: grab;
	background: url('images/opacity-background.png');
	background-size: 9px 9px;
	image-rendering: pixelated;
}

.colorpicker-body .strip.grabbing {
	cursor: grabbing;
}

.colorpicker-body .slider {
	position: absolute;
	top: 0;
	left: -2px;
	width: calc(100% + 4px);
	height: 4px;
	box-sizing: border-box;
	border: 1px solid rgba(255, 255, 255, 0.71);
	box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.85);
}

.colorpicker-body .strip .overlay {
	height: 150px;
	pointer-events: none;
}

.colorpicker-body .standalone-strip .standalone-overlay {
	height: 122px;
	pointer-events: none;
}

.standalone-colorpicker-body {
	display: block;
	border: 1px solid transparent;
	border-bottom: 1px solid var(--vscode-editorHoverWidget-border);
	overflow: hidden;
}

.colorpicker-body .insert-button {
	position: absolute;
	height: 20px;
	width: 58px;
	padding: 0px;
	right: 8px;
	bottom: 8px;
	background: var(--vscode-button-background);
	color: var(--vscode-button-foreground);
	border-radius: 2px;
	border: none;
	cursor: pointer;
}

.colorpicker-body .insert-button:hover{
	background: var(--vscode-button-hoverBackground);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/colorPicker/browser/colorPickerContribution.ts]---
Location: vscode-main/src/vs/editor/contrib/colorPicker/browser/colorPickerContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { illegalArgument } from '../../../../base/common/errors.js';
import { URI } from '../../../../base/common/uri.js';
import { registerAction2 } from '../../../../platform/actions/common/actions.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { EditorContributionInstantiation, registerEditorAction, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { registerEditorFeature } from '../../../common/editorFeatures.js';
import { IColorPresentation } from '../../../common/languages.js';
import { HoverParticipantRegistry } from '../../hover/browser/hoverTypes.js';
import { _findColorData, _setupColorCommand, ColorPresentationsCollector, ExtColorDataCollector, IExtColorData } from './color.js';
import { ColorDetector } from './colorDetector.js';
import { DefaultDocumentColorProviderFeature } from './defaultDocumentColorProvider.js';
import { HoverColorPickerContribution } from './hoverColorPicker/hoverColorPickerContribution.js';
import { HoverColorPickerParticipant } from './hoverColorPicker/hoverColorPickerParticipant.js';
import { HideStandaloneColorPicker, InsertColorWithStandaloneColorPicker, ShowOrFocusStandaloneColorPicker } from './standaloneColorPicker/standaloneColorPickerActions.js';
import { StandaloneColorPickerController } from './standaloneColorPicker/standaloneColorPickerController.js';
import { Range } from '../../../common/core/range.js';

registerEditorAction(HideStandaloneColorPicker);
registerEditorAction(InsertColorWithStandaloneColorPicker);
registerAction2(ShowOrFocusStandaloneColorPicker);

registerEditorContribution(HoverColorPickerContribution.ID, HoverColorPickerContribution, EditorContributionInstantiation.BeforeFirstInteraction);
registerEditorContribution(StandaloneColorPickerController.ID, StandaloneColorPickerController, EditorContributionInstantiation.AfterFirstRender);
registerEditorContribution(ColorDetector.ID, ColorDetector, EditorContributionInstantiation.AfterFirstRender);
registerEditorFeature(DefaultDocumentColorProviderFeature);

HoverParticipantRegistry.register(HoverColorPickerParticipant);

CommandsRegistry.registerCommand('_executeDocumentColorProvider', function (accessor, ...args) {
	const [resource] = args;
	if (!(resource instanceof URI)) {
		throw illegalArgument();
	}
	const { model, colorProviderRegistry, defaultColorDecoratorsEnablement } = _setupColorCommand(accessor, resource);
	return _findColorData<IExtColorData>(new ExtColorDataCollector(), colorProviderRegistry, model, CancellationToken.None, defaultColorDecoratorsEnablement);
});

CommandsRegistry.registerCommand('_executeColorPresentationProvider', function (accessor, ...args) {
	const [color, context] = args;
	if (!context) {
		return;
	}

	const { uri, range } = context as { uri?: unknown; range?: unknown };
	if (!(uri instanceof URI) || !Array.isArray(color) || color.length !== 4 || !Range.isIRange(range)) {
		throw illegalArgument();
	}
	const { model, colorProviderRegistry, defaultColorDecoratorsEnablement } = _setupColorCommand(accessor, uri);
	const [red, green, blue, alpha] = color;
	return _findColorData<IColorPresentation>(new ColorPresentationsCollector({ range: range, color: { red, green, blue, alpha } }), colorProviderRegistry, model, CancellationToken.None, defaultColorDecoratorsEnablement);
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/colorPicker/browser/colorPickerModel.ts]---
Location: vscode-main/src/vs/editor/contrib/colorPicker/browser/colorPickerModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Color } from '../../../../base/common/color.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IColorPresentation } from '../../../common/languages.js';

export class ColorPickerModel {

	readonly originalColor: Color;
	private _color: Color;

	get color(): Color {
		return this._color;
	}

	set color(color: Color) {
		if (this._color.equals(color)) {
			return;
		}

		this._color = color;
		this._onDidChangeColor.fire(color);
	}

	get presentation(): IColorPresentation { return this.colorPresentations[this.presentationIndex]; }

	private _colorPresentations: IColorPresentation[];

	get colorPresentations(): IColorPresentation[] {
		return this._colorPresentations;
	}

	set colorPresentations(colorPresentations: IColorPresentation[]) {
		this._colorPresentations = colorPresentations;
		if (this.presentationIndex > colorPresentations.length - 1) {
			this.presentationIndex = 0;
		}
		this._onDidChangePresentation.fire(this.presentation);
	}

	private readonly _onColorFlushed = new Emitter<Color>();
	readonly onColorFlushed: Event<Color> = this._onColorFlushed.event;

	private readonly _onDidChangeColor = new Emitter<Color>();
	readonly onDidChangeColor: Event<Color> = this._onDidChangeColor.event;

	private readonly _onDidChangePresentation = new Emitter<IColorPresentation>();
	readonly onDidChangePresentation: Event<IColorPresentation> = this._onDidChangePresentation.event;

	constructor(color: Color, availableColorPresentations: IColorPresentation[], private presentationIndex: number) {
		this.originalColor = color;
		this._color = color;
		this._colorPresentations = availableColorPresentations;
	}

	selectNextColorPresentation(): void {
		this.presentationIndex = (this.presentationIndex + 1) % this.colorPresentations.length;
		this.flushColor();
		this._onDidChangePresentation.fire(this.presentation);
	}

	guessColorPresentation(color: Color, originalText: string): void {
		let presentationIndex = -1;
		for (let i = 0; i < this.colorPresentations.length; i++) {
			if (originalText.toLowerCase() === this.colorPresentations[i].label) {
				presentationIndex = i;
				break;
			}
		}

		if (presentationIndex === -1) {
			// check which color presentation text has same prefix as original text's prefix
			const originalTextPrefix = originalText.split('(')[0].toLowerCase();
			for (let i = 0; i < this.colorPresentations.length; i++) {
				if (this.colorPresentations[i].label.toLowerCase().startsWith(originalTextPrefix)) {
					presentationIndex = i;
					break;
				}
			}
		}

		if (presentationIndex !== -1 && presentationIndex !== this.presentationIndex) {
			this.presentationIndex = presentationIndex;
			this._onDidChangePresentation.fire(this.presentation);
		}
	}

	flushColor(): void {
		this._onColorFlushed.fire(this._color);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/colorPicker/browser/colorPickerParticipantUtils.ts]---
Location: vscode-main/src/vs/editor/contrib/colorPicker/browser/colorPickerParticipantUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Color, RGBA } from '../../../../base/common/color.js';
import { IActiveCodeEditor } from '../../../browser/editorBrowser.js';
import { ISingleEditOperation } from '../../../common/core/editOperation.js';
import { DocumentColorProvider, IColorInformation } from '../../../common/languages.js';
import { ITextModel, TrackedRangeStickiness } from '../../../common/model.js';
import { getColorPresentations } from './color.js';
import { ColorPickerModel } from './colorPickerModel.js';
import { Range } from '../../../common/core/range.js';

export const enum ColorPickerWidgetType {
	Hover = 'hover',
	Standalone = 'standalone'
}

export interface BaseColor {
	readonly range: Range;
	readonly model: ColorPickerModel;
	readonly provider: DocumentColorProvider;
}

export async function createColorHover(editorModel: ITextModel, colorInfo: IColorInformation, provider: DocumentColorProvider): Promise<BaseColor> {
	const originalText = editorModel.getValueInRange(colorInfo.range);
	const { red, green, blue, alpha } = colorInfo.color;
	const rgba = new RGBA(Math.round(red * 255), Math.round(green * 255), Math.round(blue * 255), alpha);
	const color = new Color(rgba);

	const colorPresentations = await getColorPresentations(editorModel, colorInfo, provider, CancellationToken.None);
	const model = new ColorPickerModel(color, [], 0);
	model.colorPresentations = colorPresentations || [];
	model.guessColorPresentation(color, originalText);

	return {
		range: Range.lift(colorInfo.range),
		model,
		provider
	};
}

export function updateEditorModel(editor: IActiveCodeEditor, range: Range, model: ColorPickerModel): Range {
	const textEdits: ISingleEditOperation[] = [];
	const edit = model.presentation.textEdit ?? { range, text: model.presentation.label, forceMoveMarkers: false };
	textEdits.push(edit);

	if (model.presentation.additionalTextEdits) {
		textEdits.push(...model.presentation.additionalTextEdits);
	}
	const replaceRange = Range.lift(edit.range);
	const trackedRange = editor.getModel()._setTrackedRange(null, replaceRange, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter);
	editor.executeEdits('colorpicker', textEdits);
	editor.pushUndoStop();
	return editor.getModel()._getTrackedRange(trackedRange) ?? replaceRange;
}

export async function updateColorPresentations(editorModel: ITextModel, colorPickerModel: ColorPickerModel, color: Color, range: Range, colorHover: BaseColor): Promise<void> {
	const colorPresentations = await getColorPresentations(editorModel, {
		range: range,
		color: {
			red: color.rgba.r / 255,
			green: color.rgba.g / 255,
			blue: color.rgba.b / 255,
			alpha: color.rgba.a
		}
	}, colorHover.provider, CancellationToken.None);
	colorPickerModel.colorPresentations = colorPresentations || [];
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/colorPicker/browser/colorPickerWidget.ts]---
Location: vscode-main/src/vs/editor/contrib/colorPicker/browser/colorPickerWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './colorPicker.css';
import { PixelRatio } from '../../../../base/browser/pixelRatio.js';
import * as dom from '../../../../base/browser/dom.js';
import { Widget } from '../../../../base/browser/ui/widget.js';
import { ColorPickerModel } from './colorPickerModel.js';
import { IEditorHoverColorPickerWidget } from '../../hover/browser/hoverTypes.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ColorPickerBody } from './colorPickerParts/colorPickerBody.js';
import { ColorPickerHeader } from './colorPickerParts/colorPickerHeader.js';
import { ColorPickerWidgetType } from './colorPickerParticipantUtils.js';

const $ = dom.$;

export class ColorPickerWidget extends Widget implements IEditorHoverColorPickerWidget {

	private static readonly ID = 'editor.contrib.colorPickerWidget';
	private readonly _domNode: HTMLElement;

	body: ColorPickerBody;
	header: ColorPickerHeader;

	constructor(container: Node, readonly model: ColorPickerModel, private pixelRatio: number, themeService: IThemeService, type: ColorPickerWidgetType) {
		super();

		this._register(PixelRatio.getInstance(dom.getWindow(container)).onDidChange(() => this.layout()));

		this._domNode = $('.colorpicker-widget');
		container.appendChild(this._domNode);

		this.header = this._register(new ColorPickerHeader(this._domNode, this.model, themeService, type));
		this.body = this._register(new ColorPickerBody(this._domNode, this.model, this.pixelRatio, type));
	}

	getId(): string {
		return ColorPickerWidget.ID;
	}

	layout(): void {
		this.body.layout();
	}

	get domNode(): HTMLElement {
		return this._domNode;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/colorPicker/browser/defaultDocumentColorProvider.ts]---
Location: vscode-main/src/vs/editor/contrib/colorPicker/browser/defaultDocumentColorProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Color, RGBA } from '../../../../base/common/color.js';
import { ITextModel } from '../../../common/model.js';
import { DocumentColorProvider, IColor, IColorInformation, IColorPresentation } from '../../../common/languages.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { IEditorWorkerService } from '../../../common/services/editorWorker.js';

export class DefaultDocumentColorProvider implements DocumentColorProvider {

	constructor(
		@IEditorWorkerService private readonly _editorWorkerService: IEditorWorkerService,
	) { }

	async provideDocumentColors(model: ITextModel, _token: CancellationToken): Promise<IColorInformation[] | null> {
		return this._editorWorkerService.computeDefaultDocumentColors(model.uri);
	}

	provideColorPresentations(_model: ITextModel, colorInfo: IColorInformation, _token: CancellationToken): IColorPresentation[] {
		const range = colorInfo.range;
		const colorFromInfo: IColor = colorInfo.color;
		const alpha = colorFromInfo.alpha;
		const color = new Color(new RGBA(Math.round(255 * colorFromInfo.red), Math.round(255 * colorFromInfo.green), Math.round(255 * colorFromInfo.blue), alpha));

		const rgb = alpha ? Color.Format.CSS.formatRGBA(color) : Color.Format.CSS.formatRGB(color);
		const hsl = alpha ? Color.Format.CSS.formatHSLA(color) : Color.Format.CSS.formatHSL(color);
		const hex = alpha ? Color.Format.CSS.formatHexA(color) : Color.Format.CSS.formatHex(color);

		const colorPresentations: IColorPresentation[] = [];
		colorPresentations.push({ label: rgb, textEdit: { range: range, text: rgb } });
		colorPresentations.push({ label: hsl, textEdit: { range: range, text: hsl } });
		colorPresentations.push({ label: hex, textEdit: { range: range, text: hex } });
		return colorPresentations;
	}
}

export class DefaultDocumentColorProviderFeature extends Disposable {
	constructor(
		@ILanguageFeaturesService _languageFeaturesService: ILanguageFeaturesService,
		@IEditorWorkerService editorWorkerService: IEditorWorkerService,
	) {
		super();
		this._register(_languageFeaturesService.colorProvider.register('*', new DefaultDocumentColorProvider(editorWorkerService)));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/colorPicker/browser/colorPickerParts/colorPickerBody.ts]---
Location: vscode-main/src/vs/editor/contrib/colorPicker/browser/colorPickerParts/colorPickerBody.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import '../colorPicker.css';
import * as dom from '../../../../../base/browser/dom.js';
import { Color, HSVA } from '../../../../../base/common/color.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ColorPickerModel } from '../colorPickerModel.js';
import { SaturationBox } from './colorPickerSaturationBox.js';
import { InsertButton } from './colorPickerInsertButton.js';
import { HueStrip, OpacityStrip, Strip } from './colorPickerStrip.js';
import { ColorPickerWidgetType } from '../colorPickerParticipantUtils.js';

const $ = dom.$;

export class ColorPickerBody extends Disposable {

	private readonly _domNode: HTMLElement;
	private readonly _saturationBox: SaturationBox;
	private readonly _hueStrip: Strip;
	private readonly _opacityStrip: Strip;
	private readonly _insertButton: InsertButton | null = null;

	constructor(container: HTMLElement, private readonly model: ColorPickerModel, private pixelRatio: number, type: ColorPickerWidgetType) {
		super();

		this._domNode = $('.colorpicker-body');
		dom.append(container, this._domNode);

		this._saturationBox = new SaturationBox(this._domNode, this.model, this.pixelRatio);
		this._register(this._saturationBox);
		this._register(this._saturationBox.onDidChange(this.onDidSaturationValueChange, this));
		this._register(this._saturationBox.onColorFlushed(this.flushColor, this));

		this._opacityStrip = new OpacityStrip(this._domNode, this.model, type);
		this._register(this._opacityStrip);
		this._register(this._opacityStrip.onDidChange(this.onDidOpacityChange, this));
		this._register(this._opacityStrip.onColorFlushed(this.flushColor, this));

		this._hueStrip = new HueStrip(this._domNode, this.model, type);
		this._register(this._hueStrip);
		this._register(this._hueStrip.onDidChange(this.onDidHueChange, this));
		this._register(this._hueStrip.onColorFlushed(this.flushColor, this));

		if (type === ColorPickerWidgetType.Standalone) {
			this._insertButton = this._register(new InsertButton(this._domNode));
			this._domNode.classList.add('standalone-colorpicker');
		}
	}

	private flushColor(): void {
		this.model.flushColor();
	}

	private onDidSaturationValueChange({ s, v }: { s: number; v: number }): void {
		const hsva = this.model.color.hsva;
		this.model.color = new Color(new HSVA(hsva.h, s, v, hsva.a));
	}

	private onDidOpacityChange(a: number): void {
		const hsva = this.model.color.hsva;
		this.model.color = new Color(new HSVA(hsva.h, hsva.s, hsva.v, a));
	}

	private onDidHueChange(value: number): void {
		const hsva = this.model.color.hsva;
		const h = (1 - value) * 360;

		this.model.color = new Color(new HSVA(h === 360 ? 0 : h, hsva.s, hsva.v, hsva.a));
	}

	get domNode() {
		return this._domNode;
	}

	get saturationBox() {
		return this._saturationBox;
	}

	get opacityStrip() {
		return this._opacityStrip;
	}

	get hueStrip() {
		return this._hueStrip;
	}

	get enterButton() {
		return this._insertButton;
	}

	layout(): void {
		this._saturationBox.layout();
		this._opacityStrip.layout();
		this._hueStrip.layout();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/colorPicker/browser/colorPickerParts/colorPickerCloseButton.ts]---
Location: vscode-main/src/vs/editor/contrib/colorPicker/browser/colorPickerParts/colorPickerCloseButton.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import '../colorPicker.css';
import * as dom from '../../../../../base/browser/dom.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { localize } from '../../../../../nls.js';
import { Emitter } from '../../../../../base/common/event.js';
import { registerIcon } from '../../../../../platform/theme/common/iconRegistry.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { Codicon } from '../../../../../base/common/codicons.js';

const $ = dom.$;

export class CloseButton extends Disposable {

	private _button: HTMLElement;
	private readonly _onClicked = this._register(new Emitter<void>());
	public readonly onClicked = this._onClicked.event;

	constructor(container: HTMLElement) {
		super();
		this._button = document.createElement('div');
		this._button.classList.add('close-button');
		dom.append(container, this._button);

		const innerDiv = document.createElement('div');
		innerDiv.classList.add('close-button-inner-div');
		dom.append(this._button, innerDiv);

		const closeButton = dom.append(innerDiv, $('.button' + ThemeIcon.asCSSSelector(registerIcon('color-picker-close', Codicon.close, localize('closeIcon', 'Icon to close the color picker')))));
		closeButton.classList.add('close-icon');
		this._register(dom.addDisposableListener(this._button, dom.EventType.CLICK, () => {
			this._onClicked.fire();
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/colorPicker/browser/colorPickerParts/colorPickerHeader.ts]---
Location: vscode-main/src/vs/editor/contrib/colorPicker/browser/colorPickerParts/colorPickerHeader.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import '../colorPicker.css';
import * as dom from '../../../../../base/browser/dom.js';
import { Color } from '../../../../../base/common/color.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ColorPickerModel } from '../colorPickerModel.js';
import { localize } from '../../../../../nls.js';
import { editorHoverBackground } from '../../../../../platform/theme/common/colorRegistry.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { CloseButton } from './colorPickerCloseButton.js';
import { ColorPickerWidgetType } from '../colorPickerParticipantUtils.js';

const $ = dom.$;

export class ColorPickerHeader extends Disposable {

	private readonly _domNode: HTMLElement;
	private readonly _pickedColorNode: HTMLElement;
	private readonly _pickedColorPresentation: HTMLElement;
	private readonly _originalColorNode: HTMLElement;
	private readonly _closeButton: CloseButton | null = null;
	private backgroundColor: Color;

	constructor(container: HTMLElement, private readonly model: ColorPickerModel, themeService: IThemeService, private type: ColorPickerWidgetType) {
		super();

		this._domNode = $('.colorpicker-header');
		dom.append(container, this._domNode);

		this._pickedColorNode = dom.append(this._domNode, $('.picked-color'));
		dom.append(this._pickedColorNode, $('span.codicon.codicon-color-mode'));
		this._pickedColorPresentation = dom.append(this._pickedColorNode, document.createElement('span'));
		this._pickedColorPresentation.classList.add('picked-color-presentation');

		const tooltip = localize('clickToToggleColorOptions', "Click to toggle color options (rgb/hsl/hex)");
		this._pickedColorNode.setAttribute('title', tooltip);

		this._originalColorNode = dom.append(this._domNode, $('.original-color'));
		this._originalColorNode.style.backgroundColor = Color.Format.CSS.format(this.model.originalColor) || '';

		this.backgroundColor = themeService.getColorTheme().getColor(editorHoverBackground) || Color.white;
		this._register(themeService.onDidColorThemeChange(theme => {
			this.backgroundColor = theme.getColor(editorHoverBackground) || Color.white;
		}));

		this._register(dom.addDisposableListener(this._pickedColorNode, dom.EventType.CLICK, () => this.model.selectNextColorPresentation()));
		this._register(dom.addDisposableListener(this._originalColorNode, dom.EventType.CLICK, () => {
			this.model.color = this.model.originalColor;
			this.model.flushColor();
		}));
		this._register(model.onDidChangeColor(this.onDidChangeColor, this));
		this._register(model.onDidChangePresentation(this.onDidChangePresentation, this));
		this._pickedColorNode.style.backgroundColor = Color.Format.CSS.format(model.color) || '';
		this._pickedColorNode.classList.toggle('light', model.color.rgba.a < 0.5 ? this.backgroundColor.isLighter() : model.color.isLighter());

		this.onDidChangeColor(this.model.color);

		// When the color picker widget is a standalone color picker widget, then add a close button
		if (this.type === ColorPickerWidgetType.Standalone) {
			this._domNode.classList.add('standalone-colorpicker');
			this._closeButton = this._register(new CloseButton(this._domNode));
		}
	}

	public get domNode(): HTMLElement {
		return this._domNode;
	}

	public get closeButton(): CloseButton | null {
		return this._closeButton;
	}

	public get pickedColorNode(): HTMLElement {
		return this._pickedColorNode;
	}

	public get originalColorNode(): HTMLElement {
		return this._originalColorNode;
	}

	private onDidChangeColor(color: Color): void {
		this._pickedColorNode.style.backgroundColor = Color.Format.CSS.format(color) || '';
		this._pickedColorNode.classList.toggle('light', color.rgba.a < 0.5 ? this.backgroundColor.isLighter() : color.isLighter());
		this.onDidChangePresentation();
	}

	private onDidChangePresentation(): void {
		this._pickedColorPresentation.textContent = this.model.presentation ? this.model.presentation.label : '';
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/colorPicker/browser/colorPickerParts/colorPickerInsertButton.ts]---
Location: vscode-main/src/vs/editor/contrib/colorPicker/browser/colorPickerParts/colorPickerInsertButton.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import '../colorPicker.css';
import * as dom from '../../../../../base/browser/dom.js';
import { Emitter } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';

export class InsertButton extends Disposable {

	private _button: HTMLElement;
	private readonly _onClicked = this._register(new Emitter<void>());
	public readonly onClicked = this._onClicked.event;

	constructor(container: HTMLElement) {
		super();
		this._button = dom.append(container, document.createElement('button'));
		this._button.classList.add('insert-button');
		this._button.textContent = 'Insert';
		this._register(dom.addDisposableListener(this._button, dom.EventType.CLICK, () => {
			this._onClicked.fire();
		}));
	}

	public get button(): HTMLElement {
		return this._button;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/colorPicker/browser/colorPickerParts/colorPickerSaturationBox.ts]---
Location: vscode-main/src/vs/editor/contrib/colorPicker/browser/colorPickerParts/colorPickerSaturationBox.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import '../colorPicker.css';
import * as dom from '../../../../../base/browser/dom.js';
import { GlobalPointerMoveMonitor } from '../../../../../base/browser/globalPointerMoveMonitor.js';
import { Color, HSVA } from '../../../../../base/common/color.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ColorPickerModel } from '../colorPickerModel.js';

const $ = dom.$;

export class SaturationBox extends Disposable {

	private readonly _domNode: HTMLElement;
	private readonly selection: HTMLElement;
	private readonly _canvas: HTMLCanvasElement;
	private width!: number;
	private height!: number;

	private monitor: GlobalPointerMoveMonitor | null;
	private readonly _onDidChange = new Emitter<{ s: number; v: number }>();
	readonly onDidChange: Event<{ s: number; v: number }> = this._onDidChange.event;

	private readonly _onColorFlushed = new Emitter<void>();
	readonly onColorFlushed: Event<void> = this._onColorFlushed.event;

	constructor(container: HTMLElement, private readonly model: ColorPickerModel, private pixelRatio: number) {
		super();

		this._domNode = $('.saturation-wrap');
		dom.append(container, this._domNode);

		// Create canvas, draw selected color
		this._canvas = document.createElement('canvas');
		this._canvas.className = 'saturation-box';
		dom.append(this._domNode, this._canvas);

		// Add selection circle
		this.selection = $('.saturation-selection');
		dom.append(this._domNode, this.selection);

		this.layout();

		this._register(dom.addDisposableListener(this._domNode, dom.EventType.POINTER_DOWN, e => this.onPointerDown(e)));
		this._register(this.model.onDidChangeColor(this.onDidChangeColor, this));
		this.monitor = null;
	}

	public get domNode() {
		return this._domNode;
	}

	private onPointerDown(e: PointerEvent): void {
		if (!e.target || !(e.target instanceof Element)) {
			return;
		}
		this.monitor = this._register(new GlobalPointerMoveMonitor());
		const origin = dom.getDomNodePagePosition(this._domNode);

		if (e.target !== this.selection) {
			this.onDidChangePosition(e.offsetX, e.offsetY);
		}

		this.monitor.startMonitoring(e.target, e.pointerId, e.buttons, event => this.onDidChangePosition(event.pageX - origin.left, event.pageY - origin.top), () => null);

		const pointerUpListener = dom.addDisposableListener(e.target.ownerDocument, dom.EventType.POINTER_UP, () => {
			this._onColorFlushed.fire();
			pointerUpListener.dispose();
			if (this.monitor) {
				this.monitor.stopMonitoring(true);
				this.monitor = null;
			}
		}, true);
	}

	private onDidChangePosition(left: number, top: number): void {
		const s = Math.max(0, Math.min(1, left / this.width));
		const v = Math.max(0, Math.min(1, 1 - (top / this.height)));

		this.paintSelection(s, v);
		this._onDidChange.fire({ s, v });
	}

	layout(): void {
		this.width = this._domNode.offsetWidth;
		this.height = this._domNode.offsetHeight;
		this._canvas.width = this.width * this.pixelRatio;
		this._canvas.height = this.height * this.pixelRatio;
		this.paint();

		const hsva = this.model.color.hsva;
		this.paintSelection(hsva.s, hsva.v);
	}

	private paint(): void {
		const hsva = this.model.color.hsva;
		const saturatedColor = new Color(new HSVA(hsva.h, 1, 1, 1));
		const ctx = this._canvas.getContext('2d')!;

		const whiteGradient = ctx.createLinearGradient(0, 0, this._canvas.width, 0);
		whiteGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
		whiteGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
		whiteGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

		const blackGradient = ctx.createLinearGradient(0, 0, 0, this._canvas.height);
		blackGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
		blackGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

		ctx.rect(0, 0, this._canvas.width, this._canvas.height);
		ctx.fillStyle = Color.Format.CSS.format(saturatedColor)!;
		ctx.fill();
		ctx.fillStyle = whiteGradient;
		ctx.fill();
		ctx.fillStyle = blackGradient;
		ctx.fill();
	}

	private paintSelection(s: number, v: number): void {
		this.selection.style.left = `${s * this.width}px`;
		this.selection.style.top = `${this.height - v * this.height}px`;
	}

	private onDidChangeColor(color: Color): void {
		if (this.monitor && this.monitor.isMonitoring()) {
			return;
		}
		this.paint();
		const hsva = color.hsva;
		this.paintSelection(hsva.s, hsva.v);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/colorPicker/browser/colorPickerParts/colorPickerStrip.ts]---
Location: vscode-main/src/vs/editor/contrib/colorPicker/browser/colorPickerParts/colorPickerStrip.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import '../colorPicker.css';
import * as dom from '../../../../../base/browser/dom.js';
import { GlobalPointerMoveMonitor } from '../../../../../base/browser/globalPointerMoveMonitor.js';
import { Color, RGBA } from '../../../../../base/common/color.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ColorPickerModel } from '../colorPickerModel.js';
import { ColorPickerWidgetType } from '../colorPickerParticipantUtils.js';

const $ = dom.$;

export abstract class Strip extends Disposable {

	protected domNode: HTMLElement;
	protected overlay: HTMLElement;
	protected slider: HTMLElement;
	private height!: number;

	private readonly _onDidChange = new Emitter<number>();
	readonly onDidChange: Event<number> = this._onDidChange.event;

	private readonly _onColorFlushed = new Emitter<void>();
	readonly onColorFlushed: Event<void> = this._onColorFlushed.event;

	constructor(container: HTMLElement, protected model: ColorPickerModel, type: ColorPickerWidgetType) {
		super();
		if (type === ColorPickerWidgetType.Standalone) {
			this.domNode = dom.append(container, $('.standalone-strip'));
			this.overlay = dom.append(this.domNode, $('.standalone-overlay'));
		} else {
			this.domNode = dom.append(container, $('.strip'));
			this.overlay = dom.append(this.domNode, $('.overlay'));
		}
		this.slider = dom.append(this.domNode, $('.slider'));
		this.slider.style.top = `0px`;

		this._register(dom.addDisposableListener(this.domNode, dom.EventType.POINTER_DOWN, e => this.onPointerDown(e)));
		this._register(model.onDidChangeColor(this.onDidChangeColor, this));
		this.layout();
	}

	layout(): void {
		this.height = this.domNode.offsetHeight - this.slider.offsetHeight;

		const value = this.getValue(this.model.color);
		this.updateSliderPosition(value);
	}

	protected onDidChangeColor(color: Color) {
		const value = this.getValue(color);
		this.updateSliderPosition(value);
	}

	private onPointerDown(e: PointerEvent): void {
		if (!e.target || !(e.target instanceof Element)) {
			return;
		}
		const monitor = this._register(new GlobalPointerMoveMonitor());
		const origin = dom.getDomNodePagePosition(this.domNode);
		this.domNode.classList.add('grabbing');

		if (e.target !== this.slider) {
			this.onDidChangeTop(e.offsetY);
		}

		monitor.startMonitoring(e.target, e.pointerId, e.buttons, event => this.onDidChangeTop(event.pageY - origin.top), () => null);

		const pointerUpListener = dom.addDisposableListener(e.target.ownerDocument, dom.EventType.POINTER_UP, () => {
			this._onColorFlushed.fire();
			pointerUpListener.dispose();
			monitor.stopMonitoring(true);
			this.domNode.classList.remove('grabbing');
		}, true);
	}

	private onDidChangeTop(top: number): void {
		const value = Math.max(0, Math.min(1, 1 - (top / this.height)));

		this.updateSliderPosition(value);
		this._onDidChange.fire(value);
	}

	private updateSliderPosition(value: number): void {
		this.slider.style.top = `${(1 - value) * this.height}px`;
	}

	protected abstract getValue(color: Color): number;
}

export class OpacityStrip extends Strip {

	constructor(container: HTMLElement, model: ColorPickerModel, type: ColorPickerWidgetType) {
		super(container, model, type);
		this.domNode.classList.add('opacity-strip');

		this.onDidChangeColor(this.model.color);
	}

	protected override onDidChangeColor(color: Color): void {
		super.onDidChangeColor(color);
		const { r, g, b } = color.rgba;
		const opaque = new Color(new RGBA(r, g, b, 1));
		const transparent = new Color(new RGBA(r, g, b, 0));

		this.overlay.style.background = `linear-gradient(to bottom, ${opaque} 0%, ${transparent} 100%)`;
	}

	protected getValue(color: Color): number {
		return color.hsva.a;
	}
}

export class HueStrip extends Strip {

	constructor(container: HTMLElement, model: ColorPickerModel, type: ColorPickerWidgetType) {
		super(container, model, type);
		this.domNode.classList.add('hue-strip');
	}

	protected getValue(color: Color): number {
		return 1 - (color.hsva.h / 360);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/colorPicker/browser/hoverColorPicker/hoverColorPicker.ts]---
Location: vscode-main/src/vs/editor/contrib/colorPicker/browser/hoverColorPicker/hoverColorPicker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IPartialEditorMouseEvent, MouseTargetType } from '../../../../browser/editorBrowser.js';
import { ColorDecorationInjectedTextMarker } from '../colorDetector.js';


export function isOnColorDecorator(mouseEvent: IPartialEditorMouseEvent): boolean {
	const target = mouseEvent.target;
	return !!target
		&& target.type === MouseTargetType.CONTENT_TEXT
		&& target.detail.injectedText?.options.attachedData === ColorDecorationInjectedTextMarker;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/colorPicker/browser/hoverColorPicker/hoverColorPickerContribution.ts]---
Location: vscode-main/src/vs/editor/contrib/colorPicker/browser/hoverColorPicker/hoverColorPickerContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ICodeEditor, IEditorMouseEvent } from '../../../../browser/editorBrowser.js';
import { EditorOption } from '../../../../common/config/editorOptions.js';
import { Range } from '../../../../common/core/range.js';
import { IEditorContribution } from '../../../../common/editorCommon.js';
import { ContentHoverController } from '../../../hover/browser/contentHoverController.js';
import { HoverStartMode, HoverStartSource } from '../../../hover/browser/hoverOperation.js';
import { isOnColorDecorator } from './hoverColorPicker.js';

export class HoverColorPickerContribution extends Disposable implements IEditorContribution {

	public static readonly ID: string = 'editor.contrib.colorContribution';

	static readonly RECOMPUTE_TIME = 1000; // ms

	constructor(private readonly _editor: ICodeEditor,
	) {
		super();
		this._register(_editor.onMouseDown((e) => this.onMouseDown(e)));
	}

	override dispose(): void {
		super.dispose();
	}

	private onMouseDown(mouseEvent: IEditorMouseEvent) {

		const colorDecoratorsActivatedOn = this._editor.getOption(EditorOption.colorDecoratorsActivatedOn);
		if (colorDecoratorsActivatedOn !== 'click' && colorDecoratorsActivatedOn !== 'clickAndHover') {
			return;
		}
		if (!isOnColorDecorator(mouseEvent)) {
			return;
		}
		const hoverController = this._editor.getContribution<ContentHoverController>(ContentHoverController.ID);
		if (!hoverController) {
			return;
		}
		if (hoverController.isColorPickerVisible) {
			return;
		}
		const targetRange = mouseEvent.target.range;
		if (!targetRange) {
			return;
		}
		const range = new Range(targetRange.startLineNumber, targetRange.startColumn + 1, targetRange.endLineNumber, targetRange.endColumn + 1);
		hoverController.showContentHover(range, HoverStartMode.Immediate, HoverStartSource.Click, false);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/colorPicker/browser/hoverColorPicker/hoverColorPickerParticipant.ts]---
Location: vscode-main/src/vs/editor/contrib/colorPicker/browser/hoverColorPicker/hoverColorPickerParticipant.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AsyncIterableProducer } from '../../../../../base/common/async.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { ICodeEditor } from '../../../../browser/editorBrowser.js';
import { Range } from '../../../../common/core/range.js';
import { IModelDecoration } from '../../../../common/model.js';
import { DocumentColorProvider } from '../../../../common/languages.js';
import { ColorDetector } from '../colorDetector.js';
import { ColorPickerModel } from '../colorPickerModel.js';
import { ColorPickerWidget } from '../colorPickerWidget.js';
import { HoverAnchor, HoverAnchorType, IEditorHoverParticipant, IEditorHoverRenderContext, IHoverPart, IRenderedHoverPart, IRenderedHoverParts, RenderedHoverParts } from '../../../hover/browser/hoverTypes.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import * as nls from '../../../../../nls.js';
import { BaseColor, ColorPickerWidgetType, createColorHover, updateColorPresentations, updateEditorModel } from '../colorPickerParticipantUtils.js';
import { EditorOption } from '../../../../common/config/editorOptions.js';
import { Dimension } from '../../../../../base/browser/dom.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { Color } from '../../../../../base/common/color.js';
import { HoverStartSource } from '../../../hover/browser/hoverOperation.js';

export class ColorHover implements IHoverPart, BaseColor {

	/**
	 * Force the hover to always be rendered at this specific range,
	 * even in the case of multiple hover parts.
	 */
	public readonly forceShowAtRange: boolean = true;

	constructor(
		public readonly owner: IEditorHoverParticipant<ColorHover>,
		public readonly range: Range,
		public readonly model: ColorPickerModel,
		public readonly provider: DocumentColorProvider
	) { }

	public isValidForHoverAnchor(anchor: HoverAnchor): boolean {
		return (
			anchor.type === HoverAnchorType.Range
			&& this.range.startColumn <= anchor.range.startColumn
			&& this.range.endColumn >= anchor.range.endColumn
		);
	}

	public static fromBaseColor(owner: IEditorHoverParticipant<ColorHover>, color: BaseColor): ColorHover {
		return new ColorHover(owner, color.range, color.model, color.provider);
	}
}

export class HoverColorPickerParticipant implements IEditorHoverParticipant<ColorHover> {

	public readonly hoverOrdinal: number = 2;

	private _colorPicker: ColorPickerWidget | undefined;

	constructor(
		private readonly _editor: ICodeEditor,
		@IThemeService private readonly _themeService: IThemeService,
	) { }

	public computeSync(_anchor: HoverAnchor, _lineDecorations: IModelDecoration[], source: HoverStartSource): ColorHover[] {
		return [];
	}

	public computeAsync(anchor: HoverAnchor, lineDecorations: IModelDecoration[], source: HoverStartSource, token: CancellationToken): AsyncIterableProducer<ColorHover> {
		return AsyncIterableProducer.fromPromise(this._computeAsync(anchor, lineDecorations, source));
	}

	private async _computeAsync(_anchor: HoverAnchor, lineDecorations: IModelDecoration[], source: HoverStartSource): Promise<ColorHover[]> {
		if (!this._editor.hasModel()) {
			return [];
		}
		if (!this._isValidRequest(source)) {
			return [];
		}
		const colorDetector = ColorDetector.get(this._editor);
		if (!colorDetector) {
			return [];
		}
		for (const d of lineDecorations) {
			if (!colorDetector.isColorDecoration(d)) {
				continue;
			}

			const colorData = colorDetector.getColorData(d.range.getStartPosition());
			if (colorData) {
				const colorHover = ColorHover.fromBaseColor(this, await createColorHover(this._editor.getModel(), colorData.colorInfo, colorData.provider));
				return [colorHover];
			}

		}
		return [];
	}

	private _isValidRequest(source: HoverStartSource): boolean {
		const decoratorActivatedOn = this._editor.getOption(EditorOption.colorDecoratorsActivatedOn);
		switch (source) {
			case HoverStartSource.Mouse:
				return decoratorActivatedOn === 'hover' || decoratorActivatedOn === 'clickAndHover';
			case HoverStartSource.Click:
				return decoratorActivatedOn === 'click' || decoratorActivatedOn === 'clickAndHover';
			case HoverStartSource.Keyboard:
				return true;
		}
	}

	public renderHoverParts(context: IEditorHoverRenderContext, hoverParts: ColorHover[]): IRenderedHoverParts<ColorHover> {
		const editor = this._editor;
		if (hoverParts.length === 0 || !editor.hasModel()) {
			return new RenderedHoverParts([]);
		}
		const minimumHeight = editor.getOption(EditorOption.lineHeight) + 8;
		context.setMinimumDimensions(new Dimension(302, minimumHeight));

		const disposables = new DisposableStore();
		const colorHover = hoverParts[0];
		const editorModel = editor.getModel();
		const model = colorHover.model;
		this._colorPicker = disposables.add(new ColorPickerWidget(context.fragment, model, editor.getOption(EditorOption.pixelRatio), this._themeService, ColorPickerWidgetType.Hover));

		let editorUpdatedByColorPicker = false;
		let range = new Range(colorHover.range.startLineNumber, colorHover.range.startColumn, colorHover.range.endLineNumber, colorHover.range.endColumn);

		disposables.add(model.onColorFlushed(async (color: Color) => {
			await updateColorPresentations(editorModel, model, color, range, colorHover);
			editorUpdatedByColorPicker = true;
			range = updateEditorModel(editor, range, model);
		}));
		disposables.add(model.onDidChangeColor((color: Color) => {
			updateColorPresentations(editorModel, model, color, range, colorHover);
		}));
		disposables.add(editor.onDidChangeModelContent((e) => {
			if (editorUpdatedByColorPicker) {
				editorUpdatedByColorPicker = false;
			} else {
				context.hide();
				editor.focus();
			}
		}));
		const renderedHoverPart: IRenderedHoverPart<ColorHover> = {
			hoverPart: ColorHover.fromBaseColor(this, colorHover),
			hoverElement: this._colorPicker.domNode,
			dispose() { disposables.dispose(); }
		};
		return new RenderedHoverParts([renderedHoverPart]);
	}

	public getAccessibleContent(hoverPart: ColorHover): string {
		return nls.localize('hoverAccessibilityColorParticipant', 'There is a color picker here.');
	}

	public handleResize(): void {
		this._colorPicker?.layout();
	}

	public handleContentsChanged(): void {
		this._colorPicker?.layout();
	}

	public handleHide(): void {
		this._colorPicker?.dispose();
		this._colorPicker = undefined;
	}

	public isColorPickerVisible(): boolean {
		return !!this._colorPicker;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/colorPicker/browser/standaloneColorPicker/standaloneColorPickerActions.ts]---
Location: vscode-main/src/vs/editor/contrib/colorPicker/browser/standaloneColorPicker/standaloneColorPickerActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ICodeEditor } from '../../../../browser/editorBrowser.js';
import { EditorAction, EditorAction2, ServicesAccessor } from '../../../../browser/editorExtensions.js';
import { KeyCode } from '../../../../../base/common/keyCodes.js';
import { localize, localize2 } from '../../../../../nls.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { EditorContextKeys } from '../../../../common/editorContextKeys.js';
import { MenuId } from '../../../../../platform/actions/common/actions.js';
import { StandaloneColorPickerController } from './standaloneColorPickerController.js';

export class ShowOrFocusStandaloneColorPicker extends EditorAction2 {
	constructor() {
		super({
			id: 'editor.action.showOrFocusStandaloneColorPicker',
			title: {
				...localize2('showOrFocusStandaloneColorPicker', "Show or Focus Standalone Color Picker"),
				mnemonicTitle: localize({ key: 'mishowOrFocusStandaloneColorPicker', comment: ['&& denotes a mnemonic'] }, "&&Show or Focus Standalone Color Picker"),
			},
			precondition: undefined,
			menu: [
				{ id: MenuId.CommandPalette },
			],
			metadata: {
				description: localize2('showOrFocusStandaloneColorPickerDescription', "Show or focus a standalone color picker which uses the default color provider. It displays hex/rgb/hsl colors."),
			}
		});
	}
	runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor) {
		StandaloneColorPickerController.get(editor)?.showOrFocus();
	}
}

export class HideStandaloneColorPicker extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.hideColorPicker',
			label: localize2({
				key: 'hideColorPicker',
				comment: [
					'Action that hides the color picker'
				]
			}, "Hide the Color Picker"),
			precondition: EditorContextKeys.standaloneColorPickerVisible.isEqualTo(true),
			kbOpts: {
				primary: KeyCode.Escape,
				weight: KeybindingWeight.EditorContrib
			},
			metadata: {
				description: localize2('hideColorPickerDescription', "Hide the standalone color picker."),
			}
		});
	}
	public run(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		StandaloneColorPickerController.get(editor)?.hide();
	}
}

export class InsertColorWithStandaloneColorPicker extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.insertColorWithStandaloneColorPicker',
			label: localize2({
				key: 'insertColorWithStandaloneColorPicker',
				comment: [
					'Action that inserts color with standalone color picker'
				]
			}, "Insert Color with Standalone Color Picker"),
			precondition: EditorContextKeys.standaloneColorPickerFocused.isEqualTo(true),
			kbOpts: {
				primary: KeyCode.Enter,
				weight: KeybindingWeight.EditorContrib
			},
			metadata: {
				description: localize2('insertColorWithStandaloneColorPickerDescription', "Insert hex/rgb/hsl colors with the focused standalone color picker."),
			}
		});
	}
	public run(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		StandaloneColorPickerController.get(editor)?.insertColor();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/colorPicker/browser/standaloneColorPicker/standaloneColorPickerController.ts]---
Location: vscode-main/src/vs/editor/contrib/colorPicker/browser/standaloneColorPicker/standaloneColorPickerController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IContextKey, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ICodeEditor } from '../../../../browser/editorBrowser.js';
import { IEditorContribution } from '../../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../../common/editorContextKeys.js';
import { StandaloneColorPickerWidget } from './standaloneColorPickerWidget.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';

export class StandaloneColorPickerController extends Disposable implements IEditorContribution {

	public static ID = 'editor.contrib.standaloneColorPickerController';
	private _standaloneColorPickerWidget: StandaloneColorPickerWidget | null = null;
	private _standaloneColorPickerVisible: IContextKey<boolean>;
	private _standaloneColorPickerFocused: IContextKey<boolean>;

	constructor(
		private readonly _editor: ICodeEditor,
		@IContextKeyService _contextKeyService: IContextKeyService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		super();
		this._standaloneColorPickerVisible = EditorContextKeys.standaloneColorPickerVisible.bindTo(_contextKeyService);
		this._standaloneColorPickerFocused = EditorContextKeys.standaloneColorPickerFocused.bindTo(_contextKeyService);
	}

	public showOrFocus() {
		if (!this._editor.hasModel()) {
			return;
		}
		if (!this._standaloneColorPickerVisible.get()) {
			this._standaloneColorPickerWidget = this._instantiationService.createInstance(
				StandaloneColorPickerWidget,
				this._editor,
				this._standaloneColorPickerVisible,
				this._standaloneColorPickerFocused
			);
		} else if (!this._standaloneColorPickerFocused.get()) {
			this._standaloneColorPickerWidget?.focus();
		}
	}

	public hide() {
		this._standaloneColorPickerFocused.set(false);
		this._standaloneColorPickerVisible.set(false);
		this._standaloneColorPickerWidget?.hide();
		this._editor.focus();
	}

	public insertColor() {
		this._standaloneColorPickerWidget?.updateEditor();
		this.hide();
	}

	public static get(editor: ICodeEditor) {
		return editor.getContribution<StandaloneColorPickerController>(StandaloneColorPickerController.ID);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/colorPicker/browser/standaloneColorPicker/standaloneColorPickerParticipant.ts]---
Location: vscode-main/src/vs/editor/contrib/colorPicker/browser/standaloneColorPicker/standaloneColorPickerParticipant.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Color } from '../../../../../base/common/color.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { IActiveCodeEditor, ICodeEditor } from '../../../../browser/editorBrowser.js';
import { LanguageFeatureRegistry } from '../../../../common/languageFeatureRegistry.js';
import { DocumentColorProvider, IColorInformation } from '../../../../common/languages.js';
import { IEditorHoverRenderContext } from '../../../hover/browser/hoverTypes.js';
import { getColors } from '../color.js';
import { ColorDetector } from '../colorDetector.js';
import { ColorPickerModel } from '../colorPickerModel.js';
import { BaseColor, ColorPickerWidgetType, createColorHover, updateColorPresentations, updateEditorModel } from '../colorPickerParticipantUtils.js';
import { ColorPickerWidget } from '../colorPickerWidget.js';
import { Range } from '../../../../common/core/range.js';
import { EditorOption } from '../../../../common/config/editorOptions.js';
import { Dimension } from '../../../../../base/browser/dom.js';

export class StandaloneColorPickerHover implements BaseColor {
	constructor(
		public readonly owner: StandaloneColorPickerParticipant,
		public readonly range: Range,
		public readonly model: ColorPickerModel,
		public readonly provider: DocumentColorProvider
	) { }

	public static fromBaseColor(owner: StandaloneColorPickerParticipant, color: BaseColor) {
		return new StandaloneColorPickerHover(owner, color.range, color.model, color.provider);
	}
}

export class StandaloneColorPickerRenderedParts extends Disposable {

	public color: Color;

	public colorPicker: ColorPickerWidget;

	constructor(editor: IActiveCodeEditor, context: IEditorHoverRenderContext, colorHover: StandaloneColorPickerHover, themeService: IThemeService) {
		super();
		const editorModel = editor.getModel();
		const colorPickerModel = colorHover.model;

		this.color = colorHover.model.color;
		this.colorPicker = this._register(new ColorPickerWidget(
			context.fragment,
			colorPickerModel,
			editor.getOption(EditorOption.pixelRatio),
			themeService,
			ColorPickerWidgetType.Standalone
		));

		this._register(colorPickerModel.onColorFlushed((color: Color) => {
			this.color = color;
		}));
		this._register(colorPickerModel.onDidChangeColor((color: Color) => {
			updateColorPresentations(editorModel, colorPickerModel, color, colorHover.range, colorHover);
		}));
		let editorUpdatedByColorPicker = false;
		this._register(editor.onDidChangeModelContent((e) => {
			if (editorUpdatedByColorPicker) {
				editorUpdatedByColorPicker = false;
			} else {
				context.hide();
				editor.focus();
			}
		}));
		updateColorPresentations(editorModel, colorPickerModel, this.color, colorHover.range, colorHover);
	}
}

export class StandaloneColorPickerParticipant {

	public readonly hoverOrdinal: number = 2;
	private _renderedParts: StandaloneColorPickerRenderedParts | undefined;

	constructor(
		private readonly _editor: ICodeEditor,
		@IThemeService private readonly _themeService: IThemeService,
	) { }

	public async createColorHover(defaultColorInfo: IColorInformation, defaultColorProvider: DocumentColorProvider, colorProviderRegistry: LanguageFeatureRegistry<DocumentColorProvider>): Promise<{ colorHover: StandaloneColorPickerHover; foundInEditor: boolean } | null> {
		if (!this._editor.hasModel()) {
			return null;
		}
		const colorDetector = ColorDetector.get(this._editor);
		if (!colorDetector) {
			return null;
		}
		const colors = await getColors(colorProviderRegistry, this._editor.getModel(), CancellationToken.None);
		let foundColorInfo: IColorInformation | null = null;
		let foundColorProvider: DocumentColorProvider | null = null;
		for (const colorData of colors) {
			const colorInfo = colorData.colorInfo;
			if (Range.containsRange(colorInfo.range, defaultColorInfo.range)) {
				foundColorInfo = colorInfo;
				foundColorProvider = colorData.provider;
			}
		}
		const colorInfo = foundColorInfo ?? defaultColorInfo;
		const colorProvider = foundColorProvider ?? defaultColorProvider;
		const foundInEditor = !!foundColorInfo;
		const colorHover = StandaloneColorPickerHover.fromBaseColor(this, await createColorHover(this._editor.getModel(), colorInfo, colorProvider));
		return { colorHover, foundInEditor };
	}

	public async updateEditorModel(colorHoverData: StandaloneColorPickerHover): Promise<void> {
		if (!this._editor.hasModel()) {
			return;
		}
		const colorPickerModel = colorHoverData.model;
		let range = new Range(colorHoverData.range.startLineNumber, colorHoverData.range.startColumn, colorHoverData.range.endLineNumber, colorHoverData.range.endColumn);
		if (this._color) {
			await updateColorPresentations(this._editor.getModel(), colorPickerModel, this._color, range, colorHoverData);
			range = updateEditorModel(this._editor, range, colorPickerModel);
		}
	}

	public renderHoverParts(context: IEditorHoverRenderContext, hoverParts: StandaloneColorPickerHover[]): StandaloneColorPickerRenderedParts | undefined {
		if (hoverParts.length === 0 || !this._editor.hasModel()) {
			return undefined;
		}
		this._setMinimumDimensions(context);
		this._renderedParts = new StandaloneColorPickerRenderedParts(this._editor, context, hoverParts[0], this._themeService);
		return this._renderedParts;
	}

	private _setMinimumDimensions(context: IEditorHoverRenderContext): void {
		const minimumHeight = this._editor.getOption(EditorOption.lineHeight) + 8;
		context.setMinimumDimensions(new Dimension(302, minimumHeight));
	}

	private get _color(): Color | undefined {
		return this._renderedParts?.color;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/colorPicker/browser/standaloneColorPicker/standaloneColorPickerWidget.ts]---
Location: vscode-main/src/vs/editor/contrib/colorPicker/browser/standaloneColorPicker/standaloneColorPickerWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import '../colorPicker.css';
import { Disposable, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { IEditorHoverRenderContext } from '../../../hover/browser/hoverTypes.js';
import { ContentWidgetPositionPreference, ICodeEditor, IContentWidget, IContentWidgetPosition } from '../../../../browser/editorBrowser.js';
import { PositionAffinity } from '../../../../common/model.js';
import { Position } from '../../../../common/core/position.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { EditorHoverStatusBar } from '../../../hover/browser/contentHoverStatusBar.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { Emitter } from '../../../../../base/common/event.js';
import { EditorOption } from '../../../../common/config/editorOptions.js';
import { IColorInformation } from '../../../../common/languages.js';
import { ILanguageFeaturesService } from '../../../../common/services/languageFeatures.js';
import { IContextKey } from '../../../../../platform/contextkey/common/contextkey.js';
import { IRange } from '../../../../common/core/range.js';
import { DefaultDocumentColorProvider } from '../defaultDocumentColorProvider.js';
import { IEditorWorkerService } from '../../../../common/services/editorWorker.js';
import { StandaloneColorPickerHover, StandaloneColorPickerParticipant, StandaloneColorPickerRenderedParts } from './standaloneColorPickerParticipant.js';
import * as dom from '../../../../../base/browser/dom.js';
import { InsertButton } from '../colorPickerParts/colorPickerInsertButton.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';

class StandaloneColorPickerResult {
	// The color picker result consists of: an array of color results and a boolean indicating if the color was found in the editor
	constructor(
		public readonly value: StandaloneColorPickerHover,
		public readonly foundInEditor: boolean
	) { }
}

const PADDING = 8;
const CLOSE_BUTTON_WIDTH = 22;

export class StandaloneColorPickerWidget extends Disposable implements IContentWidget {

	static readonly ID = 'editor.contrib.standaloneColorPickerWidget';
	readonly allowEditorOverflow = true;

	private readonly _position: Position | undefined = undefined;
	private readonly _standaloneColorPickerParticipant: StandaloneColorPickerParticipant;

	private _body: HTMLElement = document.createElement('div');
	private _colorHover: StandaloneColorPickerHover | null = null;
	private _selectionSetInEditor: boolean = false;

	private readonly _onResult = this._register(new Emitter<StandaloneColorPickerResult>());
	public readonly onResult = this._onResult.event;

	private readonly _renderedHoverParts: MutableDisposable<StandaloneColorPickerRenderedParts> = this._register(new MutableDisposable());
	private readonly _renderedStatusBar: MutableDisposable<EditorHoverStatusBar> = this._register(new MutableDisposable());

	constructor(
		private readonly _editor: ICodeEditor,
		private readonly _standaloneColorPickerVisible: IContextKey<boolean>,
		private readonly _standaloneColorPickerFocused: IContextKey<boolean>,
		@IInstantiationService _instantiationService: IInstantiationService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
		@IEditorWorkerService private readonly _editorWorkerService: IEditorWorkerService,
		@IHoverService private readonly _hoverService: IHoverService
	) {
		super();
		this._standaloneColorPickerVisible.set(true);
		this._standaloneColorPickerParticipant = _instantiationService.createInstance(StandaloneColorPickerParticipant, this._editor);
		this._position = this._editor._getViewModel()?.getPrimaryCursorState().modelState.position;
		const editorSelection = this._editor.getSelection();
		const selection = editorSelection ?
			{
				startLineNumber: editorSelection.startLineNumber,
				startColumn: editorSelection.startColumn,
				endLineNumber: editorSelection.endLineNumber,
				endColumn: editorSelection.endColumn
			} : { startLineNumber: 0, endLineNumber: 0, endColumn: 0, startColumn: 0 };
		const focusTracker = this._register(dom.trackFocus(this._body));
		this._register(focusTracker.onDidBlur(_ => {
			this.hide();
		}));
		this._register(focusTracker.onDidFocus(_ => {
			this.focus();
		}));
		// When the cursor position changes, hide the color picker
		this._register(this._editor.onDidChangeCursorPosition(() => {
			// Do not hide the color picker when the cursor changes position due to the keybindings
			if (!this._selectionSetInEditor) {
				this.hide();
			} else {
				this._selectionSetInEditor = false;
			}
		}));
		this._register(this._editor.onMouseMove((e) => {
			const classList = e.target.element?.classList;
			if (classList && classList.contains('colorpicker-color-decoration')) {
				this.hide();
			}
		}));
		this._register(this.onResult((result) => {
			this._render(result.value, result.foundInEditor);
		}));
		this._start(selection);
		this._body.style.zIndex = '50';
		this._editor.addContentWidget(this);
	}

	public updateEditor() {
		if (this._colorHover) {
			this._standaloneColorPickerParticipant.updateEditorModel(this._colorHover);
		}
	}

	public getId(): string {
		return StandaloneColorPickerWidget.ID;
	}

	public getDomNode(): HTMLElement {
		return this._body;
	}

	public getPosition(): IContentWidgetPosition | null {
		if (!this._position) {
			return null;
		}
		const positionPreference = this._editor.getOption(EditorOption.hover).above;
		return {
			position: this._position,
			secondaryPosition: this._position,
			preference: positionPreference ? [ContentWidgetPositionPreference.ABOVE, ContentWidgetPositionPreference.BELOW] : [ContentWidgetPositionPreference.BELOW, ContentWidgetPositionPreference.ABOVE],
			positionAffinity: PositionAffinity.None
		};
	}

	public hide(): void {
		this.dispose();
		this._standaloneColorPickerVisible.set(false);
		this._standaloneColorPickerFocused.set(false);
		this._editor.removeContentWidget(this);
		this._editor.focus();
	}

	public focus(): void {
		this._standaloneColorPickerFocused.set(true);
		this._body.focus();
	}

	private async _start(selection: IRange) {
		const computeAsyncResult = await this._computeAsync(selection);
		if (!computeAsyncResult) {
			return;
		}
		this._onResult.fire(new StandaloneColorPickerResult(computeAsyncResult.result, computeAsyncResult.foundInEditor));
	}

	private async _computeAsync(range: IRange): Promise<{ result: StandaloneColorPickerHover; foundInEditor: boolean } | null> {
		if (!this._editor.hasModel()) {
			return null;
		}
		const colorInfo: IColorInformation = {
			range: range,
			color: { red: 0, green: 0, blue: 0, alpha: 1 }
		};
		const colorHoverResult: { colorHover: StandaloneColorPickerHover; foundInEditor: boolean } | null = await this._standaloneColorPickerParticipant.createColorHover(colorInfo, new DefaultDocumentColorProvider(this._editorWorkerService), this._languageFeaturesService.colorProvider);
		if (!colorHoverResult) {
			return null;
		}
		return { result: colorHoverResult.colorHover, foundInEditor: colorHoverResult.foundInEditor };
	}

	private _render(colorHover: StandaloneColorPickerHover, foundInEditor: boolean) {
		const fragment = document.createDocumentFragment();
		this._renderedStatusBar.value = this._register(new EditorHoverStatusBar(this._keybindingService, this._hoverService));

		const context: IEditorHoverRenderContext = {
			fragment,
			statusBar: this._renderedStatusBar.value,
			onContentsChanged: () => { },
			setMinimumDimensions: () => { },
			hide: () => this.hide(),
			focus: () => this.focus()
		};

		this._colorHover = colorHover;
		this._renderedHoverParts.value = this._standaloneColorPickerParticipant.renderHoverParts(context, [colorHover]);
		if (!this._renderedHoverParts.value) {
			this._renderedStatusBar.clear();
			this._renderedHoverParts.clear();
			return;
		}
		const colorPicker = this._renderedHoverParts.value.colorPicker;
		this._body.classList.add('standalone-colorpicker-body');
		this._body.style.maxHeight = Math.max(this._editor.getLayoutInfo().height / 4, 250) + 'px';
		this._body.style.maxWidth = Math.max(this._editor.getLayoutInfo().width * 0.66, 500) + 'px';
		this._body.tabIndex = 0;
		this._body.appendChild(fragment);
		colorPicker.layout();

		const colorPickerBody = colorPicker.body;
		const saturationBoxWidth = colorPickerBody.saturationBox.domNode.clientWidth;
		const widthOfOriginalColorBox = colorPickerBody.domNode.clientWidth - saturationBoxWidth - CLOSE_BUTTON_WIDTH - PADDING;
		const enterButton: InsertButton | null = colorPicker.body.enterButton;
		enterButton?.onClicked(() => {
			this.updateEditor();
			this.hide();
		});
		const colorPickerHeader = colorPicker.header;
		const pickedColorNode = colorPickerHeader.pickedColorNode;
		pickedColorNode.style.width = saturationBoxWidth + PADDING + 'px';
		const originalColorNode = colorPickerHeader.originalColorNode;
		originalColorNode.style.width = widthOfOriginalColorBox + 'px';
		const closeButton = colorPicker.header.closeButton;
		closeButton?.onClicked(() => {
			this.hide();
		});
		// When found in the editor, highlight the selection in the editor
		if (foundInEditor) {
			if (enterButton) {
				enterButton.button.textContent = 'Replace';
			}
			this._selectionSetInEditor = true;
			this._editor.setSelection(colorHover.range);
		}
		this._editor.layoutContentWidget(this);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/comment/browser/blockCommentCommand.ts]---
Location: vscode-main/src/vs/editor/contrib/comment/browser/blockCommentCommand.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../../base/common/charCode.js';
import { EditOperation, ISingleEditOperation } from '../../../common/core/editOperation.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { ICommand, ICursorStateComputerData, IEditOperationBuilder } from '../../../common/editorCommon.js';
import { ITextModel } from '../../../common/model.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';

export class BlockCommentCommand implements ICommand {

	private readonly _selection: Selection;
	private readonly _insertSpace: boolean;
	private _usedEndToken: string | null;

	constructor(
		selection: Selection,
		insertSpace: boolean,
		private readonly languageConfigurationService: ILanguageConfigurationService
	) {
		this._selection = selection;
		this._insertSpace = insertSpace;
		this._usedEndToken = null;
	}

	public static _haystackHasNeedleAtOffset(haystack: string, needle: string, offset: number): boolean {
		if (offset < 0) {
			return false;
		}
		const needleLength = needle.length;
		const haystackLength = haystack.length;
		if (offset + needleLength > haystackLength) {
			return false;
		}

		for (let i = 0; i < needleLength; i++) {
			const codeA = haystack.charCodeAt(offset + i);
			const codeB = needle.charCodeAt(i);

			if (codeA === codeB) {
				continue;
			}
			if (codeA >= CharCode.A && codeA <= CharCode.Z && codeA + 32 === codeB) {
				// codeA is upper-case variant of codeB
				continue;
			}
			if (codeB >= CharCode.A && codeB <= CharCode.Z && codeB + 32 === codeA) {
				// codeB is upper-case variant of codeA
				continue;
			}

			return false;
		}
		return true;
	}

	private _createOperationsForBlockComment(selection: Range, startToken: string, endToken: string, insertSpace: boolean, model: ITextModel, builder: IEditOperationBuilder): void {
		const startLineNumber = selection.startLineNumber;
		const startColumn = selection.startColumn;
		const endLineNumber = selection.endLineNumber;
		const endColumn = selection.endColumn;

		const startLineText = model.getLineContent(startLineNumber);
		const endLineText = model.getLineContent(endLineNumber);

		let startTokenIndex = startLineText.lastIndexOf(startToken, startColumn - 1 + startToken.length);
		let endTokenIndex = endLineText.indexOf(endToken, endColumn - 1 - endToken.length);

		if (startTokenIndex !== -1 && endTokenIndex !== -1) {

			if (startLineNumber === endLineNumber) {
				const lineBetweenTokens = startLineText.substring(startTokenIndex + startToken.length, endTokenIndex);

				if (lineBetweenTokens.indexOf(endToken) >= 0) {
					// force to add a block comment
					startTokenIndex = -1;
					endTokenIndex = -1;
				}
			} else {
				const startLineAfterStartToken = startLineText.substring(startTokenIndex + startToken.length);
				const endLineBeforeEndToken = endLineText.substring(0, endTokenIndex);

				if (startLineAfterStartToken.indexOf(endToken) >= 0 || endLineBeforeEndToken.indexOf(endToken) >= 0) {
					// force to add a block comment
					startTokenIndex = -1;
					endTokenIndex = -1;
				}
			}
		}

		let ops: ISingleEditOperation[];

		if (startTokenIndex !== -1 && endTokenIndex !== -1) {
			// Consider spaces as part of the comment tokens
			if (insertSpace && startTokenIndex + startToken.length < startLineText.length && startLineText.charCodeAt(startTokenIndex + startToken.length) === CharCode.Space) {
				// Pretend the start token contains a trailing space
				startToken = startToken + ' ';
			}

			if (insertSpace && endTokenIndex > 0 && endLineText.charCodeAt(endTokenIndex - 1) === CharCode.Space) {
				// Pretend the end token contains a leading space
				endToken = ' ' + endToken;
				endTokenIndex -= 1;
			}
			ops = BlockCommentCommand._createRemoveBlockCommentOperations(
				new Range(startLineNumber, startTokenIndex + startToken.length + 1, endLineNumber, endTokenIndex + 1), startToken, endToken
			);
		} else {
			ops = BlockCommentCommand._createAddBlockCommentOperations(selection, startToken, endToken, this._insertSpace);
			this._usedEndToken = ops.length === 1 ? endToken : null;
		}

		for (const op of ops) {
			builder.addTrackedEditOperation(op.range, op.text);
		}
	}

	public static _createRemoveBlockCommentOperations(r: Range, startToken: string, endToken: string): ISingleEditOperation[] {
		const res: ISingleEditOperation[] = [];

		if (!Range.isEmpty(r)) {
			// Remove block comment start
			res.push(EditOperation.delete(new Range(
				r.startLineNumber, r.startColumn - startToken.length,
				r.startLineNumber, r.startColumn
			)));

			// Remove block comment end
			res.push(EditOperation.delete(new Range(
				r.endLineNumber, r.endColumn,
				r.endLineNumber, r.endColumn + endToken.length
			)));
		} else {
			// Remove both continuously
			res.push(EditOperation.delete(new Range(
				r.startLineNumber, r.startColumn - startToken.length,
				r.endLineNumber, r.endColumn + endToken.length
			)));
		}

		return res;
	}

	public static _createAddBlockCommentOperations(r: Range, startToken: string, endToken: string, insertSpace: boolean): ISingleEditOperation[] {
		const res: ISingleEditOperation[] = [];

		if (!Range.isEmpty(r)) {
			// Insert block comment start
			res.push(EditOperation.insert(new Position(r.startLineNumber, r.startColumn), startToken + (insertSpace ? ' ' : '')));

			// Insert block comment end
			res.push(EditOperation.insert(new Position(r.endLineNumber, r.endColumn), (insertSpace ? ' ' : '') + endToken));
		} else {
			// Insert both continuously
			res.push(EditOperation.replace(new Range(
				r.startLineNumber, r.startColumn,
				r.endLineNumber, r.endColumn
			), startToken + '  ' + endToken));
		}

		return res;
	}

	public getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void {
		const startLineNumber = this._selection.startLineNumber;
		const startColumn = this._selection.startColumn;

		model.tokenization.tokenizeIfCheap(startLineNumber);
		const languageId = model.getLanguageIdAtPosition(startLineNumber, startColumn);
		const config = this.languageConfigurationService.getLanguageConfiguration(languageId).comments;
		if (!config || !config.blockCommentStartToken || !config.blockCommentEndToken) {
			// Mode does not support block comments
			return;
		}

		this._createOperationsForBlockComment(this._selection, config.blockCommentStartToken, config.blockCommentEndToken, this._insertSpace, model, builder);
	}

	public computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		const inverseEditOperations = helper.getInverseEditOperations();
		if (inverseEditOperations.length === 2) {
			const startTokenEditOperation = inverseEditOperations[0];
			const endTokenEditOperation = inverseEditOperations[1];

			return new Selection(
				startTokenEditOperation.range.endLineNumber,
				startTokenEditOperation.range.endColumn,
				endTokenEditOperation.range.startLineNumber,
				endTokenEditOperation.range.startColumn
			);
		} else {
			const srcRange = inverseEditOperations[0].range;
			const deltaColumn = this._usedEndToken ? -this._usedEndToken.length - 1 : 0; // minus 1 space before endToken
			return new Selection(
				srcRange.endLineNumber,
				srcRange.endColumn + deltaColumn,
				srcRange.endLineNumber,
				srcRange.endColumn + deltaColumn
			);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/comment/browser/comment.ts]---
Location: vscode-main/src/vs/editor/contrib/comment/browser/comment.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyChord, KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import * as nls from '../../../../nls.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, IActionOptions, registerEditorAction, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { Range } from '../../../common/core/range.js';
import { ICommand } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { BlockCommentCommand } from './blockCommentCommand.js';
import { LineCommentCommand, Type } from './lineCommentCommand.js';

abstract class CommentLineAction extends EditorAction {

	private readonly _type: Type;

	constructor(type: Type, opts: IActionOptions) {
		super(opts);
		this._type = type;
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const languageConfigurationService = accessor.get(ILanguageConfigurationService);

		if (!editor.hasModel()) {
			return;
		}

		const model = editor.getModel();
		const commands: ICommand[] = [];
		const modelOptions = model.getOptions();
		const commentsOptions = editor.getOption(EditorOption.comments);

		const selections = editor.getSelections().map((selection, index) => ({ selection, index, ignoreFirstLine: false }));
		selections.sort((a, b) => Range.compareRangesUsingStarts(a.selection, b.selection));

		// Remove selections that would result in copying the same line
		let prev = selections[0];
		for (let i = 1; i < selections.length; i++) {
			const curr = selections[i];
			if (prev.selection.endLineNumber === curr.selection.startLineNumber) {
				// these two selections would copy the same line
				if (prev.index < curr.index) {
					// prev wins
					curr.ignoreFirstLine = true;
				} else {
					// curr wins
					prev.ignoreFirstLine = true;
					prev = curr;
				}
			}
		}


		for (const selection of selections) {
			commands.push(new LineCommentCommand(
				languageConfigurationService,
				selection.selection,
				modelOptions.indentSize,
				this._type,
				commentsOptions.insertSpace,
				commentsOptions.ignoreEmptyLines,
				selection.ignoreFirstLine
			));
		}

		editor.pushUndoStop();
		editor.executeCommands(this.id, commands);
		editor.pushUndoStop();
	}

}

class ToggleCommentLineAction extends CommentLineAction {
	constructor() {
		super(Type.Toggle, {
			id: 'editor.action.commentLine',
			label: nls.localize2('comment.line', "Toggle Line Comment"),
			precondition: EditorContextKeys.writable,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.CtrlCmd | KeyCode.Slash,
				weight: KeybindingWeight.EditorContrib
			},
			menuOpts: {
				menuId: MenuId.MenubarEditMenu,
				group: '5_insert',
				title: nls.localize({ key: 'miToggleLineComment', comment: ['&& denotes a mnemonic'] }, "&&Toggle Line Comment"),
				order: 1
			},
			canTriggerInlineEdits: true,
		});
	}
}

class AddLineCommentAction extends CommentLineAction {
	constructor() {
		super(Type.ForceAdd, {
			id: 'editor.action.addCommentLine',
			label: nls.localize2('comment.line.add', "Add Line Comment"),
			precondition: EditorContextKeys.writable,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyC),
				weight: KeybindingWeight.EditorContrib
			},
			canTriggerInlineEdits: true,
		});
	}
}

class RemoveLineCommentAction extends CommentLineAction {
	constructor() {
		super(Type.ForceRemove, {
			id: 'editor.action.removeCommentLine',
			label: nls.localize2('comment.line.remove', "Remove Line Comment"),
			precondition: EditorContextKeys.writable,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyU),
				weight: KeybindingWeight.EditorContrib
			},
			canTriggerInlineEdits: true,
		});
	}
}

class BlockCommentAction extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.blockComment',
			label: nls.localize2('comment.block', "Toggle Block Comment"),
			precondition: EditorContextKeys.writable,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.Shift | KeyMod.Alt | KeyCode.KeyA,
				linux: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyA },
				weight: KeybindingWeight.EditorContrib
			},
			menuOpts: {
				menuId: MenuId.MenubarEditMenu,
				group: '5_insert',
				title: nls.localize({ key: 'miToggleBlockComment', comment: ['&& denotes a mnemonic'] }, "Toggle &&Block Comment"),
				order: 2
			},
			canTriggerInlineEdits: true,
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const languageConfigurationService = accessor.get(ILanguageConfigurationService);

		if (!editor.hasModel()) {
			return;
		}

		const commentsOptions = editor.getOption(EditorOption.comments);
		const commands: ICommand[] = [];
		const selections = editor.getSelections();
		for (const selection of selections) {
			commands.push(new BlockCommentCommand(selection, commentsOptions.insertSpace, languageConfigurationService));
		}

		editor.pushUndoStop();
		editor.executeCommands(this.id, commands);
		editor.pushUndoStop();
	}
}

registerEditorAction(ToggleCommentLineAction);
registerEditorAction(AddLineCommentAction);
registerEditorAction(RemoveLineCommentAction);
registerEditorAction(BlockCommentAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/comment/browser/lineCommentCommand.ts]---
Location: vscode-main/src/vs/editor/contrib/comment/browser/lineCommentCommand.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../../base/common/charCode.js';
import * as strings from '../../../../base/common/strings.js';
import { Constants } from '../../../../base/common/uint.js';
import { EditOperation, ISingleEditOperation } from '../../../common/core/editOperation.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { ICommand, ICursorStateComputerData, IEditOperationBuilder } from '../../../common/editorCommon.js';
import { ITextModel } from '../../../common/model.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { BlockCommentCommand } from './blockCommentCommand.js';

export interface IInsertionPoint {
	ignore: boolean;
	commentStrOffset: number;
}

export interface ILinePreflightData {
	ignore: boolean;
	commentStr: string;
	commentStrOffset: number;
	commentStrLength: number;
}

export interface IPreflightDataSupported {
	supported: true;
	shouldRemoveComments: boolean;
	lines: ILinePreflightData[];
}
export interface IPreflightDataUnsupported {
	supported: false;
}
export type IPreflightData = IPreflightDataSupported | IPreflightDataUnsupported;

export interface ISimpleModel {
	getLineContent(lineNumber: number): string;
}

export const enum Type {
	Toggle = 0,
	ForceAdd = 1,
	ForceRemove = 2
}

export class LineCommentCommand implements ICommand {

	private readonly _selection: Selection;
	private readonly _indentSize: number;
	private readonly _type: Type;
	private readonly _insertSpace: boolean;
	private readonly _ignoreEmptyLines: boolean;
	private _selectionId: string | null;
	private _deltaColumn: number;
	private _moveEndPositionDown: boolean;
	private _ignoreFirstLine: boolean;

	constructor(
		private readonly languageConfigurationService: ILanguageConfigurationService,
		selection: Selection,
		indentSize: number,
		type: Type,
		insertSpace: boolean,
		ignoreEmptyLines: boolean,
		ignoreFirstLine?: boolean,
	) {
		this._selection = selection;
		this._indentSize = indentSize;
		this._type = type;
		this._insertSpace = insertSpace;
		this._selectionId = null;
		this._deltaColumn = 0;
		this._moveEndPositionDown = false;
		this._ignoreEmptyLines = ignoreEmptyLines;
		this._ignoreFirstLine = ignoreFirstLine || false;
	}

	/**
	 * Do an initial pass over the lines and gather info about the line comment string.
	 * Returns null if any of the lines doesn't support a line comment string.
	 */
	private static _gatherPreflightCommentStrings(model: ITextModel, startLineNumber: number, endLineNumber: number, languageConfigurationService: ILanguageConfigurationService): ILinePreflightData[] | null {

		model.tokenization.tokenizeIfCheap(startLineNumber);
		const languageId = model.getLanguageIdAtPosition(startLineNumber, 1);

		const config = languageConfigurationService.getLanguageConfiguration(languageId).comments;
		const commentStr = (config ? config.lineCommentToken : null);
		if (!commentStr) {
			// Mode does not support line comments
			return null;
		}

		const lines: ILinePreflightData[] = [];
		for (let i = 0, lineCount = endLineNumber - startLineNumber + 1; i < lineCount; i++) {
			lines[i] = {
				ignore: false,
				commentStr: commentStr,
				commentStrOffset: 0,
				commentStrLength: commentStr.length
			};
		}

		return lines;
	}

	/**
	 * Analyze lines and decide which lines are relevant and what the toggle should do.
	 * Also, build up several offsets and lengths useful in the generation of editor operations.
	 */
	public static _analyzeLines(type: Type, insertSpace: boolean, model: ISimpleModel, lines: ILinePreflightData[], startLineNumber: number, ignoreEmptyLines: boolean, ignoreFirstLine: boolean, languageConfigurationService: ILanguageConfigurationService, languageId: string): IPreflightData {
		let onlyWhitespaceLines = true;

		const config = languageConfigurationService.getLanguageConfiguration(languageId).comments;
		const lineCommentNoIndent = config?.lineCommentNoIndent ?? false;

		let shouldRemoveComments: boolean;
		if (type === Type.Toggle) {
			shouldRemoveComments = true;
		} else if (type === Type.ForceAdd) {
			shouldRemoveComments = false;
		} else {
			shouldRemoveComments = true;
		}

		for (let i = 0, lineCount = lines.length; i < lineCount; i++) {
			const lineData = lines[i];
			const lineNumber = startLineNumber + i;

			if (lineNumber === startLineNumber && ignoreFirstLine) {
				// first line ignored
				lineData.ignore = true;
				continue;
			}

			const lineContent = model.getLineContent(lineNumber);
			const lineContentStartOffset = strings.firstNonWhitespaceIndex(lineContent);

			if (lineContentStartOffset === -1) {
				// Empty or whitespace only line
				lineData.ignore = ignoreEmptyLines;
				lineData.commentStrOffset = lineCommentNoIndent ? 0 : lineContent.length;
				continue;
			}

			onlyWhitespaceLines = false;
			const offset = lineCommentNoIndent ? 0 : lineContentStartOffset;
			lineData.ignore = false;
			lineData.commentStrOffset = offset;

			if (shouldRemoveComments && !BlockCommentCommand._haystackHasNeedleAtOffset(lineContent, lineData.commentStr, offset)) {
				if (type === Type.Toggle) {
					// Every line so far has been a line comment, but this one is not
					shouldRemoveComments = false;
				} else if (type === Type.ForceAdd) {
					// Will not happen
				} else {
					lineData.ignore = true;
				}
			}

			if (shouldRemoveComments && insertSpace) {
				// Remove a following space if present
				const commentStrEndOffset = lineContentStartOffset + lineData.commentStrLength;
				if (commentStrEndOffset < lineContent.length && lineContent.charCodeAt(commentStrEndOffset) === CharCode.Space) {
					lineData.commentStrLength += 1;
				}
			}
		}

		if (type === Type.Toggle && onlyWhitespaceLines) {
			// For only whitespace lines, we insert comments
			shouldRemoveComments = false;

			// Also, no longer ignore them
			for (let i = 0, lineCount = lines.length; i < lineCount; i++) {
				lines[i].ignore = false;
			}
		}

		return {
			supported: true,
			shouldRemoveComments: shouldRemoveComments,
			lines: lines
		};
	}

	/**
	 * Analyze all lines and decide exactly what to do => not supported | insert line comments | remove line comments
	 */
	public static _gatherPreflightData(type: Type, insertSpace: boolean, model: ITextModel, startLineNumber: number, endLineNumber: number, ignoreEmptyLines: boolean, ignoreFirstLine: boolean, languageConfigurationService: ILanguageConfigurationService): IPreflightData {
		const lines = LineCommentCommand._gatherPreflightCommentStrings(model, startLineNumber, endLineNumber, languageConfigurationService);
		const languageId = model.getLanguageIdAtPosition(startLineNumber, 1);
		if (lines === null) {
			return {
				supported: false
			};
		}

		return LineCommentCommand._analyzeLines(type, insertSpace, model, lines, startLineNumber, ignoreEmptyLines, ignoreFirstLine, languageConfigurationService, languageId);
	}

	/**
	 * Given a successful analysis, execute either insert line comments, either remove line comments
	 */
	private _executeLineComments(model: ISimpleModel, builder: IEditOperationBuilder, data: IPreflightDataSupported, s: Selection): void {

		let ops: ISingleEditOperation[];

		if (data.shouldRemoveComments) {
			ops = LineCommentCommand._createRemoveLineCommentsOperations(data.lines, s.startLineNumber);
		} else {
			LineCommentCommand._normalizeInsertionPoint(model, data.lines, s.startLineNumber, this._indentSize);
			ops = this._createAddLineCommentsOperations(data.lines, s.startLineNumber);
		}

		const cursorPosition = new Position(s.positionLineNumber, s.positionColumn);

		for (let i = 0, len = ops.length; i < len; i++) {
			builder.addEditOperation(ops[i].range, ops[i].text);
			if (Range.isEmpty(ops[i].range) && Range.getStartPosition(ops[i].range).equals(cursorPosition)) {
				const lineContent = model.getLineContent(cursorPosition.lineNumber);
				if (lineContent.length + 1 === cursorPosition.column) {
					this._deltaColumn = (ops[i].text || '').length;
				}
			}
		}

		this._selectionId = builder.trackSelection(s);
	}

	private _attemptRemoveBlockComment(model: ITextModel, s: Selection, startToken: string, endToken: string): ISingleEditOperation[] | null {
		let startLineNumber = s.startLineNumber;
		let endLineNumber = s.endLineNumber;

		const startTokenAllowedBeforeColumn = endToken.length + Math.max(
			model.getLineFirstNonWhitespaceColumn(s.startLineNumber),
			s.startColumn
		);

		let startTokenIndex = model.getLineContent(startLineNumber).lastIndexOf(startToken, startTokenAllowedBeforeColumn - 1);
		let endTokenIndex = model.getLineContent(endLineNumber).indexOf(endToken, s.endColumn - 1 - startToken.length);

		if (startTokenIndex !== -1 && endTokenIndex === -1) {
			endTokenIndex = model.getLineContent(startLineNumber).indexOf(endToken, startTokenIndex + startToken.length);
			endLineNumber = startLineNumber;
		}

		if (startTokenIndex === -1 && endTokenIndex !== -1) {
			startTokenIndex = model.getLineContent(endLineNumber).lastIndexOf(startToken, endTokenIndex);
			startLineNumber = endLineNumber;
		}

		if (s.isEmpty() && (startTokenIndex === -1 || endTokenIndex === -1)) {
			startTokenIndex = model.getLineContent(startLineNumber).indexOf(startToken);
			if (startTokenIndex !== -1) {
				endTokenIndex = model.getLineContent(startLineNumber).indexOf(endToken, startTokenIndex + startToken.length);
			}
		}

		// We have to adjust to possible inner white space.
		// For Space after startToken, add Space to startToken - range math will work out.
		if (startTokenIndex !== -1 && model.getLineContent(startLineNumber).charCodeAt(startTokenIndex + startToken.length) === CharCode.Space) {
			startToken += ' ';
		}

		// For Space before endToken, add Space before endToken and shift index one left.
		if (endTokenIndex !== -1 && model.getLineContent(endLineNumber).charCodeAt(endTokenIndex - 1) === CharCode.Space) {
			endToken = ' ' + endToken;
			endTokenIndex -= 1;
		}

		if (startTokenIndex !== -1 && endTokenIndex !== -1) {
			return BlockCommentCommand._createRemoveBlockCommentOperations(
				new Range(startLineNumber, startTokenIndex + startToken.length + 1, endLineNumber, endTokenIndex + 1), startToken, endToken
			);
		}

		return null;
	}

	/**
	 * Given an unsuccessful analysis, delegate to the block comment command
	 */
	private _executeBlockComment(model: ITextModel, builder: IEditOperationBuilder, s: Selection): void {
		model.tokenization.tokenizeIfCheap(s.startLineNumber);
		const languageId = model.getLanguageIdAtPosition(s.startLineNumber, 1);
		const config = this.languageConfigurationService.getLanguageConfiguration(languageId).comments;
		if (!config || !config.blockCommentStartToken || !config.blockCommentEndToken) {
			// Mode does not support block comments
			return;
		}

		const startToken = config.blockCommentStartToken;
		const endToken = config.blockCommentEndToken;

		let ops = this._attemptRemoveBlockComment(model, s, startToken, endToken);
		if (!ops) {
			if (s.isEmpty()) {
				const lineContent = model.getLineContent(s.startLineNumber);
				let firstNonWhitespaceIndex = strings.firstNonWhitespaceIndex(lineContent);
				if (firstNonWhitespaceIndex === -1) {
					// Line is empty or contains only whitespace
					firstNonWhitespaceIndex = lineContent.length;
				}
				ops = BlockCommentCommand._createAddBlockCommentOperations(
					new Range(s.startLineNumber, firstNonWhitespaceIndex + 1, s.startLineNumber, lineContent.length + 1),
					startToken,
					endToken,
					this._insertSpace
				);
			} else {
				ops = BlockCommentCommand._createAddBlockCommentOperations(
					new Range(s.startLineNumber, model.getLineFirstNonWhitespaceColumn(s.startLineNumber), s.endLineNumber, model.getLineMaxColumn(s.endLineNumber)),
					startToken,
					endToken,
					this._insertSpace
				);
			}

			if (ops.length === 1) {
				// Leave cursor after token and Space
				this._deltaColumn = startToken.length + 1;
			}
		}
		this._selectionId = builder.trackSelection(s);
		for (const op of ops) {
			builder.addEditOperation(op.range, op.text);
		}
	}

	public getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void {

		let s = this._selection;
		this._moveEndPositionDown = false;

		if (s.startLineNumber === s.endLineNumber && this._ignoreFirstLine) {
			builder.addEditOperation(new Range(s.startLineNumber, model.getLineMaxColumn(s.startLineNumber), s.startLineNumber + 1, 1), s.startLineNumber === model.getLineCount() ? '' : '\n');
			this._selectionId = builder.trackSelection(s);
			return;
		}

		if (s.startLineNumber < s.endLineNumber && s.endColumn === 1) {
			this._moveEndPositionDown = true;
			s = s.setEndPosition(s.endLineNumber - 1, model.getLineMaxColumn(s.endLineNumber - 1));
		}

		const data = LineCommentCommand._gatherPreflightData(
			this._type,
			this._insertSpace,
			model,
			s.startLineNumber,
			s.endLineNumber,
			this._ignoreEmptyLines,
			this._ignoreFirstLine,
			this.languageConfigurationService
		);

		if (data.supported) {
			return this._executeLineComments(model, builder, data, s);
		}

		return this._executeBlockComment(model, builder, s);
	}

	public computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		let result = helper.getTrackedSelection(this._selectionId!);

		if (this._moveEndPositionDown) {
			result = result.setEndPosition(result.endLineNumber + 1, 1);
		}

		return new Selection(
			result.selectionStartLineNumber,
			result.selectionStartColumn + this._deltaColumn,
			result.positionLineNumber,
			result.positionColumn + this._deltaColumn
		);
	}

	/**
	 * Generate edit operations in the remove line comment case
	 */
	public static _createRemoveLineCommentsOperations(lines: ILinePreflightData[], startLineNumber: number): ISingleEditOperation[] {
		const res: ISingleEditOperation[] = [];

		for (let i = 0, len = lines.length; i < len; i++) {
			const lineData = lines[i];

			if (lineData.ignore) {
				continue;
			}

			res.push(EditOperation.delete(new Range(
				startLineNumber + i, lineData.commentStrOffset + 1,
				startLineNumber + i, lineData.commentStrOffset + lineData.commentStrLength + 1
			)));
		}

		return res;
	}

	/**
	 * Generate edit operations in the add line comment case
	 */
	private _createAddLineCommentsOperations(lines: ILinePreflightData[], startLineNumber: number): ISingleEditOperation[] {
		const res: ISingleEditOperation[] = [];
		const afterCommentStr = this._insertSpace ? ' ' : '';


		for (let i = 0, len = lines.length; i < len; i++) {
			const lineData = lines[i];

			if (lineData.ignore) {
				continue;
			}

			res.push(EditOperation.insert(new Position(startLineNumber + i, lineData.commentStrOffset + 1), lineData.commentStr + afterCommentStr));
		}

		return res;
	}

	private static nextVisibleColumn(currentVisibleColumn: number, indentSize: number, isTab: boolean, columnSize: number): number {
		if (isTab) {
			return currentVisibleColumn + (indentSize - (currentVisibleColumn % indentSize));
		}
		return currentVisibleColumn + columnSize;
	}

	/**
	 * Adjust insertion points to have them vertically aligned in the add line comment case
	 */
	public static _normalizeInsertionPoint(model: ISimpleModel, lines: IInsertionPoint[], startLineNumber: number, indentSize: number): void {
		let minVisibleColumn = Constants.MAX_SAFE_SMALL_INTEGER;
		let j: number;
		let lenJ: number;

		for (let i = 0, len = lines.length; i < len; i++) {
			if (lines[i].ignore) {
				continue;
			}

			const lineContent = model.getLineContent(startLineNumber + i);

			let currentVisibleColumn = 0;
			for (let j = 0, lenJ = lines[i].commentStrOffset; currentVisibleColumn < minVisibleColumn && j < lenJ; j++) {
				currentVisibleColumn = LineCommentCommand.nextVisibleColumn(currentVisibleColumn, indentSize, lineContent.charCodeAt(j) === CharCode.Tab, 1);
			}

			if (currentVisibleColumn < minVisibleColumn) {
				minVisibleColumn = currentVisibleColumn;
			}
		}

		minVisibleColumn = Math.floor(minVisibleColumn / indentSize) * indentSize;

		for (let i = 0, len = lines.length; i < len; i++) {
			if (lines[i].ignore) {
				continue;
			}

			const lineContent = model.getLineContent(startLineNumber + i);

			let currentVisibleColumn = 0;
			for (j = 0, lenJ = lines[i].commentStrOffset; currentVisibleColumn < minVisibleColumn && j < lenJ; j++) {
				currentVisibleColumn = LineCommentCommand.nextVisibleColumn(currentVisibleColumn, indentSize, lineContent.charCodeAt(j) === CharCode.Tab, 1);
			}

			if (currentVisibleColumn > minVisibleColumn) {
				lines[i].commentStrOffset = j - 1;
			} else {
				lines[i].commentStrOffset = j;
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/comment/test/browser/blockCommentCommand.test.ts]---
Location: vscode-main/src/vs/editor/contrib/comment/test/browser/blockCommentCommand.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Selection } from '../../../../common/core/selection.js';
import { ICommand } from '../../../../common/editorCommon.js';
import { ILanguageService } from '../../../../common/languages/language.js';
import { ILanguageConfigurationService } from '../../../../common/languages/languageConfigurationRegistry.js';
import { BlockCommentCommand } from '../../browser/blockCommentCommand.js';
import { testCommand } from '../../../../test/browser/testCommand.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';

function _testCommentCommand(lines: string[], selection: Selection, commandFactory: (accessor: ServicesAccessor, selection: Selection) => ICommand, expectedLines: string[], expectedSelection: Selection): void {
	const languageId = 'commentMode';
	const prepare = (accessor: ServicesAccessor, disposables: DisposableStore) => {
		const languageConfigurationService = accessor.get(ILanguageConfigurationService);
		const languageService = accessor.get(ILanguageService);
		disposables.add(languageService.registerLanguage({ id: languageId }));
		disposables.add(languageConfigurationService.register(languageId, {
			comments: { lineComment: '!@#', blockComment: ['<0', '0>'] }
		}));
	};
	testCommand(lines, languageId, selection, commandFactory, expectedLines, expectedSelection, undefined, prepare);
}

function testBlockCommentCommand(lines: string[], selection: Selection, expectedLines: string[], expectedSelection: Selection): void {
	_testCommentCommand(lines, selection, (accessor, sel) => new BlockCommentCommand(sel, true, accessor.get(ILanguageConfigurationService)), expectedLines, expectedSelection);
}

suite('Editor Contrib - Block Comment Command', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('empty selection wraps itself', function () {
		testBlockCommentCommand(
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 3, 1, 3),
			[
				'fi<0  0>rst',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 6, 1, 6)
		);
	});

	test('invisible selection ignored', function () {
		testBlockCommentCommand(
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 1, 1, 1),
			[
				'<0 first',
				' 0>\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 4, 2, 1)
		);
	});

	test('bug9511', () => {
		testBlockCommentCommand(
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 6, 1, 1),
			[
				'<0 first 0>',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 4, 1, 9)
		);

		testBlockCommentCommand(
			[
				'<0first0>',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 8, 1, 3),
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 1, 1, 6)
		);
	});

	test('one line selection', function () {
		testBlockCommentCommand(
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 6, 1, 3),
			[
				'fi<0 rst 0>',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 6, 1, 9)
		);
	});

	test('one line selection toggle', function () {
		testBlockCommentCommand(
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 6, 1, 3),
			[
				'fi<0 rst 0>',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 6, 1, 9)
		);

		testBlockCommentCommand(
			[
				'fi<0rst0>',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 8, 1, 5),
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 3, 1, 6)
		);

		testBlockCommentCommand(
			[
				'<0 first 0>',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 10, 1, 1),
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 1, 1, 6)
		);

		testBlockCommentCommand(
			[
				'<0 first0>',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 9, 1, 1),
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 1, 1, 6)
		);

		testBlockCommentCommand(
			[
				'<0first 0>',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 9, 1, 1),
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 1, 1, 6)
		);

		testBlockCommentCommand(
			[
				'fi<0rst0>',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 8, 1, 5),
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 3, 1, 6)
		);
	});

	test('multi line selection', function () {
		testBlockCommentCommand(
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 4, 1, 1),
			[
				'<0 first',
				'\tse 0>cond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 4, 2, 4)
		);
	});

	test('multi line selection toggle', function () {
		testBlockCommentCommand(
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 4, 1, 1),
			[
				'<0 first',
				'\tse 0>cond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 4, 2, 4)
		);

		testBlockCommentCommand(
			[
				'<0first',
				'\tse0>cond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 4, 1, 3),
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 1, 2, 4)
		);

		testBlockCommentCommand(
			[
				'<0 first',
				'\tse0>cond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 4, 1, 3),
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 1, 2, 4)
		);

		testBlockCommentCommand(
			[
				'<0first',
				'\tse 0>cond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 4, 1, 3),
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 1, 2, 4)
		);

		testBlockCommentCommand(
			[
				'<0 first',
				'\tse 0>cond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 4, 1, 3),
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 1, 2, 4)
		);
	});

	test('fuzzy removes', function () {
		testBlockCommentCommand(
			[
				'asd <0 qwe',
				'asd 0> qwe'
			],
			new Selection(2, 5, 1, 7),
			[
				'asd qwe',
				'asd qwe'
			],
			new Selection(1, 5, 2, 4)
		);

		testBlockCommentCommand(
			[
				'asd <0 qwe',
				'asd 0> qwe'
			],
			new Selection(2, 5, 1, 6),
			[
				'asd qwe',
				'asd qwe'
			],
			new Selection(1, 5, 2, 4)
		);

		testBlockCommentCommand(
			[
				'asd <0 qwe',
				'asd 0> qwe'
			],
			new Selection(2, 5, 1, 5),
			[
				'asd qwe',
				'asd qwe'
			],
			new Selection(1, 5, 2, 4)
		);

		testBlockCommentCommand(
			[
				'asd <0 qwe',
				'asd 0> qwe'
			],
			new Selection(2, 5, 1, 11),
			[
				'asd qwe',
				'asd qwe'
			],
			new Selection(1, 5, 2, 4)
		);

		testBlockCommentCommand(
			[
				'asd <0 qwe',
				'asd 0> qwe'
			],
			new Selection(2, 1, 1, 11),
			[
				'asd qwe',
				'asd qwe'
			],
			new Selection(1, 5, 2, 4)
		);

		testBlockCommentCommand(
			[
				'asd <0 qwe',
				'asd 0> qwe'
			],
			new Selection(2, 7, 1, 11),
			[
				'asd qwe',
				'asd qwe'
			],
			new Selection(1, 5, 2, 4)
		);
	});

	test('bug #30358', function () {
		testBlockCommentCommand(
			[
				'<0 start 0> middle end',
			],
			new Selection(1, 20, 1, 23),
			[
				'<0 start 0> middle <0 end 0>'
			],
			new Selection(1, 23, 1, 26)
		);

		testBlockCommentCommand(
			[
				'<0 start 0> middle <0 end 0>'
			],
			new Selection(1, 13, 1, 19),
			[
				'<0 start 0> <0 middle 0> <0 end 0>'
			],
			new Selection(1, 16, 1, 22)
		);
	});

	test('issue #34618', function () {
		testBlockCommentCommand(
			[
				'<0  0> middle end',
			],
			new Selection(1, 4, 1, 4),
			[
				' middle end'
			],
			new Selection(1, 1, 1, 1)
		);
	});

	test('insertSpace false', () => {
		function testLineCommentCommand(lines: string[], selection: Selection, expectedLines: string[], expectedSelection: Selection): void {
			_testCommentCommand(lines, selection, (accessor, sel) => new BlockCommentCommand(sel, false, accessor.get(ILanguageConfigurationService)), expectedLines, expectedSelection);
		}

		testLineCommentCommand(
			[
				'some text'
			],
			new Selection(1, 1, 1, 5),
			[
				'<0some0> text'
			],
			new Selection(1, 3, 1, 7)
		);
	});

	test('insertSpace false does not remove space', () => {
		function testLineCommentCommand(lines: string[], selection: Selection, expectedLines: string[], expectedSelection: Selection): void {
			_testCommentCommand(lines, selection, (accessor, sel) => new BlockCommentCommand(sel, false, accessor.get(ILanguageConfigurationService)), expectedLines, expectedSelection);
		}

		testLineCommentCommand(
			[
				'<0 some 0> text'
			],
			new Selection(1, 4, 1, 8),
			[
				' some  text'
			],
			new Selection(1, 1, 1, 7)
		);
	});
});
```

--------------------------------------------------------------------------------

````

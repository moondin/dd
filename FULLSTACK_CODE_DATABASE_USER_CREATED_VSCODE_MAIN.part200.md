---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 200
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 200 of 552)

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

---[FILE: src/vs/editor/browser/services/abstractCodeEditorService.ts]---
Location: vscode-main/src/vs/editor/browser/services/abstractCodeEditorService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../base/browser/dom.js';
import * as domStylesheets from '../../../base/browser/domStylesheets.js';
import * as cssJs from '../../../base/browser/cssValue.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { IDisposable, DisposableStore, Disposable, toDisposable, DisposableMap } from '../../../base/common/lifecycle.js';
import { LinkedList } from '../../../base/common/linkedList.js';
import * as strings from '../../../base/common/strings.js';
import { URI } from '../../../base/common/uri.js';
import { ICodeEditor, IDiffEditor } from '../editorBrowser.js';
import { ICodeEditorOpenHandler, ICodeEditorService } from './codeEditorService.js';
import { IContentDecorationRenderOptions, IDecorationRenderOptions, IThemeDecorationRenderOptions, isThemeColor } from '../../common/editorCommon.js';
import { IModelDecorationOptions, IModelDecorationOverviewRulerOptions, InjectedTextOptions, ITextModel, OverviewRulerLane, TrackedRangeStickiness } from '../../common/model.js';
import { IResourceEditorInput } from '../../../platform/editor/common/editor.js';
import { IColorTheme, IThemeService } from '../../../platform/theme/common/themeService.js';
import { ThemeColor } from '../../../base/common/themables.js';

export abstract class AbstractCodeEditorService extends Disposable implements ICodeEditorService {

	declare readonly _serviceBrand: undefined;

	private readonly _onWillCreateCodeEditor = this._register(new Emitter<void>());
	public readonly onWillCreateCodeEditor = this._onWillCreateCodeEditor.event;

	private readonly _onCodeEditorAdd: Emitter<ICodeEditor> = this._register(new Emitter<ICodeEditor>());
	public readonly onCodeEditorAdd: Event<ICodeEditor> = this._onCodeEditorAdd.event;

	private readonly _onCodeEditorRemove: Emitter<ICodeEditor> = this._register(new Emitter<ICodeEditor>());
	public readonly onCodeEditorRemove: Event<ICodeEditor> = this._onCodeEditorRemove.event;

	private readonly _onWillCreateDiffEditor = this._register(new Emitter<void>());
	public readonly onWillCreateDiffEditor = this._onWillCreateDiffEditor.event;

	private readonly _onDiffEditorAdd: Emitter<IDiffEditor> = this._register(new Emitter<IDiffEditor>());
	public readonly onDiffEditorAdd: Event<IDiffEditor> = this._onDiffEditorAdd.event;

	private readonly _onDiffEditorRemove: Emitter<IDiffEditor> = this._register(new Emitter<IDiffEditor>());
	public readonly onDiffEditorRemove: Event<IDiffEditor> = this._onDiffEditorRemove.event;

	private readonly _onDidChangeTransientModelProperty: Emitter<ITextModel> = this._register(new Emitter<ITextModel>());
	public readonly onDidChangeTransientModelProperty: Event<ITextModel> = this._onDidChangeTransientModelProperty.event;

	protected readonly _onDecorationTypeRegistered: Emitter<string> = this._register(new Emitter<string>());
	public onDecorationTypeRegistered: Event<string> = this._onDecorationTypeRegistered.event;

	private readonly _codeEditors: { [editorId: string]: ICodeEditor };
	private readonly _diffEditors: { [editorId: string]: IDiffEditor };
	protected _globalStyleSheet: GlobalStyleSheet | null;
	private readonly _decorationOptionProviders = new Map<string, IModelDecorationOptionsProvider>();
	private readonly _editorStyleSheets = new Map<string, RefCountedStyleSheet>();
	private readonly _codeEditorOpenHandlers = new LinkedList<ICodeEditorOpenHandler>();

	constructor(
		@IThemeService private readonly _themeService: IThemeService,
	) {
		super();
		this._codeEditors = Object.create(null);
		this._diffEditors = Object.create(null);
		this._globalStyleSheet = null;
	}

	willCreateCodeEditor(): void {
		this._onWillCreateCodeEditor.fire();
	}

	addCodeEditor(editor: ICodeEditor): void {
		this._codeEditors[editor.getId()] = editor;
		this._onCodeEditorAdd.fire(editor);
	}

	removeCodeEditor(editor: ICodeEditor): void {
		if (delete this._codeEditors[editor.getId()]) {
			this._onCodeEditorRemove.fire(editor);
		}
	}

	listCodeEditors(): ICodeEditor[] {
		return Object.keys(this._codeEditors).map(id => this._codeEditors[id]);
	}

	willCreateDiffEditor(): void {
		this._onWillCreateDiffEditor.fire();
	}

	addDiffEditor(editor: IDiffEditor): void {
		this._diffEditors[editor.getId()] = editor;
		this._onDiffEditorAdd.fire(editor);
	}

	removeDiffEditor(editor: IDiffEditor): void {
		if (delete this._diffEditors[editor.getId()]) {
			this._onDiffEditorRemove.fire(editor);
		}
	}

	listDiffEditors(): IDiffEditor[] {
		return Object.keys(this._diffEditors).map(id => this._diffEditors[id]);
	}

	getFocusedCodeEditor(): ICodeEditor | null {
		let editorWithWidgetFocus: ICodeEditor | null = null;

		const editors = this.listCodeEditors();
		for (const editor of editors) {

			if (editor.hasTextFocus()) {
				// bingo!
				return editor;
			}

			if (editor.hasWidgetFocus()) {
				editorWithWidgetFocus = editor;
			}
		}

		return editorWithWidgetFocus;
	}


	private _getOrCreateGlobalStyleSheet(): GlobalStyleSheet {
		if (!this._globalStyleSheet) {
			this._globalStyleSheet = this._createGlobalStyleSheet();
		}
		return this._globalStyleSheet;
	}

	protected _createGlobalStyleSheet(): GlobalStyleSheet {
		return new GlobalStyleSheet(domStylesheets.createStyleSheet());
	}

	private _getOrCreateStyleSheet(editor: ICodeEditor | undefined): GlobalStyleSheet | RefCountedStyleSheet {
		if (!editor) {
			return this._getOrCreateGlobalStyleSheet();
		}
		const domNode = editor.getContainerDomNode();
		if (!dom.isInShadowDOM(domNode)) {
			return this._getOrCreateGlobalStyleSheet();
		}
		const editorId = editor.getId();
		if (!this._editorStyleSheets.has(editorId)) {
			const refCountedStyleSheet = new RefCountedStyleSheet(this, editorId, domStylesheets.createStyleSheet(domNode));
			this._editorStyleSheets.set(editorId, refCountedStyleSheet);
		}
		return this._editorStyleSheets.get(editorId)!;
	}

	_removeEditorStyleSheets(editorId: string): void {
		this._editorStyleSheets.delete(editorId);
	}

	public registerDecorationType(description: string, key: string, options: IDecorationRenderOptions, parentTypeKey?: string, editor?: ICodeEditor): IDisposable {
		let provider = this._decorationOptionProviders.get(key);
		if (!provider) {
			const styleSheet = this._getOrCreateStyleSheet(editor);
			const providerArgs: ProviderArguments = {
				styleSheet: styleSheet,
				key: key,
				parentTypeKey: parentTypeKey,
				options: options || Object.create(null)
			};
			if (!parentTypeKey) {
				provider = new DecorationTypeOptionsProvider(description, this._themeService, styleSheet, providerArgs);
			} else {
				provider = new DecorationSubTypeOptionsProvider(this._themeService, styleSheet, providerArgs);
			}
			this._decorationOptionProviders.set(key, provider);
			this._onDecorationTypeRegistered.fire(key);
		}
		provider.refCount++;
		return {
			dispose: () => {
				this.removeDecorationType(key);
			}
		};
	}

	public listDecorationTypes(): string[] {
		return Array.from(this._decorationOptionProviders.keys());
	}

	public removeDecorationType(key: string): void {
		const provider = this._decorationOptionProviders.get(key);
		if (provider) {
			provider.refCount--;
			if (provider.refCount <= 0) {
				this._decorationOptionProviders.delete(key);
				provider.dispose();
				this.listCodeEditors().forEach((ed) => ed.removeDecorationsByType(key));
			}
		}
	}

	public resolveDecorationOptions(decorationTypeKey: string, writable: boolean): IModelDecorationOptions {
		const provider = this._decorationOptionProviders.get(decorationTypeKey);
		if (!provider) {
			throw new Error('Unknown decoration type key: ' + decorationTypeKey);
		}
		return provider.getOptions(this, writable);
	}

	public resolveDecorationCSSRules(decorationTypeKey: string) {
		const provider = this._decorationOptionProviders.get(decorationTypeKey);
		if (!provider) {
			return null;
		}
		return provider.resolveDecorationCSSRules();
	}

	private readonly _transientWatchers = this._register(new DisposableMap<string, ModelTransientSettingWatcher>());
	private readonly _modelProperties = new Map<string, Map<string, unknown>>();

	public setModelProperty(resource: URI, key: string, value: unknown): void {
		const key1 = resource.toString();
		let dest: Map<string, unknown>;
		if (this._modelProperties.has(key1)) {
			dest = this._modelProperties.get(key1)!;
		} else {
			dest = new Map<string, unknown>();
			this._modelProperties.set(key1, dest);
		}

		dest.set(key, value);
	}

	public getModelProperty(resource: URI, key: string): unknown {
		const key1 = resource.toString();
		if (this._modelProperties.has(key1)) {
			const innerMap = this._modelProperties.get(key1)!;
			return innerMap.get(key);
		}
		return undefined;
	}

	public setTransientModelProperty(model: ITextModel, key: string, value: unknown): void {
		const uri = model.uri.toString();

		let w = this._transientWatchers.get(uri);
		if (!w) {
			w = new ModelTransientSettingWatcher(uri, model, this);
			this._transientWatchers.set(uri, w);
		}

		const previousValue = w.get(key);
		if (previousValue !== value) {
			w.set(key, value);
			this._onDidChangeTransientModelProperty.fire(model);
		}
	}

	public getTransientModelProperty(model: ITextModel, key: string): unknown {
		const uri = model.uri.toString();

		const watcher = this._transientWatchers.get(uri);
		if (!watcher) {
			return undefined;
		}

		return watcher.get(key);
	}

	public getTransientModelProperties(model: ITextModel): [string, unknown][] | undefined {
		const uri = model.uri.toString();

		const watcher = this._transientWatchers.get(uri);
		if (!watcher) {
			return undefined;
		}

		return watcher.keys().map(key => [key, watcher.get(key)]);
	}

	_removeWatcher(w: ModelTransientSettingWatcher): void {
		this._transientWatchers.deleteAndDispose(w.uri);
	}

	abstract getActiveCodeEditor(): ICodeEditor | null;

	async openCodeEditor(input: IResourceEditorInput, source: ICodeEditor | null, sideBySide?: boolean): Promise<ICodeEditor | null> {
		for (const handler of this._codeEditorOpenHandlers) {
			const candidate = await handler(input, source, sideBySide);
			if (candidate !== null) {
				return candidate;
			}
		}
		return null;
	}

	registerCodeEditorOpenHandler(handler: ICodeEditorOpenHandler): IDisposable {
		const rm = this._codeEditorOpenHandlers.unshift(handler);
		return toDisposable(rm);
	}
}

export class ModelTransientSettingWatcher extends Disposable {
	public readonly uri: string;
	private readonly _values: { [key: string]: unknown };

	constructor(uri: string, model: ITextModel, owner: AbstractCodeEditorService) {
		super();

		this.uri = uri;
		this._values = {};
		this._register(model.onWillDispose(() => owner._removeWatcher(this)));
	}

	public set(key: string, value: unknown): void {
		this._values[key] = value;
	}

	public get(key: string): unknown {
		return this._values[key];
	}

	public keys(): string[] {
		return Object.keys(this._values);
	}
}

class RefCountedStyleSheet {

	private readonly _parent: AbstractCodeEditorService;
	private readonly _editorId: string;
	private readonly _styleSheet: HTMLStyleElement;
	private _refCount: number;

	public get sheet() {
		return this._styleSheet.sheet as CSSStyleSheet;
	}

	constructor(parent: AbstractCodeEditorService, editorId: string, styleSheet: HTMLStyleElement) {
		this._parent = parent;
		this._editorId = editorId;
		this._styleSheet = styleSheet;
		this._refCount = 0;
	}

	public ref(): void {
		this._refCount++;
	}

	public unref(): void {
		this._refCount--;
		if (this._refCount === 0) {
			this._styleSheet.remove();
			this._parent._removeEditorStyleSheets(this._editorId);
		}
	}

	public insertRule(selector: string, rule: string): void {
		domStylesheets.createCSSRule(selector, rule, this._styleSheet);
	}

	public removeRulesContainingSelector(ruleName: string): void {
		domStylesheets.removeCSSRulesContainingSelector(ruleName, this._styleSheet);
	}
}

export class GlobalStyleSheet {
	private readonly _styleSheet: HTMLStyleElement;

	public get sheet() {
		return this._styleSheet.sheet as CSSStyleSheet;
	}

	constructor(styleSheet: HTMLStyleElement) {
		this._styleSheet = styleSheet;
	}

	public ref(): void {
	}

	public unref(): void {
	}

	public insertRule(selector: string, rule: string): void {
		domStylesheets.createCSSRule(selector, rule, this._styleSheet);
	}

	public removeRulesContainingSelector(ruleName: string): void {
		domStylesheets.removeCSSRulesContainingSelector(ruleName, this._styleSheet);
	}
}

interface IModelDecorationOptionsProvider extends IDisposable {
	refCount: number;
	getOptions(codeEditorService: AbstractCodeEditorService, writable: boolean): IModelDecorationOptions;
	resolveDecorationCSSRules(): CSSRuleList;
}

class DecorationSubTypeOptionsProvider implements IModelDecorationOptionsProvider {

	private readonly _styleSheet: GlobalStyleSheet | RefCountedStyleSheet;
	public refCount: number;

	private readonly _parentTypeKey: string;
	private _beforeContentRules: DecorationCSSRules | null;
	private _afterContentRules: DecorationCSSRules | null;

	constructor(themeService: IThemeService, styleSheet: GlobalStyleSheet | RefCountedStyleSheet, providerArgs: ProviderArguments) {
		this._styleSheet = styleSheet;
		this._styleSheet.ref();
		this._parentTypeKey = providerArgs.parentTypeKey!;
		this.refCount = 0;

		this._beforeContentRules = new DecorationCSSRules(ModelDecorationCSSRuleType.BeforeContentClassName, providerArgs, themeService);
		this._afterContentRules = new DecorationCSSRules(ModelDecorationCSSRuleType.AfterContentClassName, providerArgs, themeService);
	}

	public getOptions(codeEditorService: AbstractCodeEditorService, writable: boolean): IModelDecorationOptions {
		const options = codeEditorService.resolveDecorationOptions(this._parentTypeKey, true);
		if (this._beforeContentRules) {
			options.beforeContentClassName = this._beforeContentRules.className;
		}
		if (this._afterContentRules) {
			options.afterContentClassName = this._afterContentRules.className;
		}
		return options;
	}

	public resolveDecorationCSSRules(): CSSRuleList {
		return this._styleSheet.sheet.cssRules;
	}

	public dispose(): void {
		if (this._beforeContentRules) {
			this._beforeContentRules.dispose();
			this._beforeContentRules = null;
		}
		if (this._afterContentRules) {
			this._afterContentRules.dispose();
			this._afterContentRules = null;
		}
		this._styleSheet.unref();
	}
}

interface ProviderArguments {
	styleSheet: GlobalStyleSheet | RefCountedStyleSheet;
	key: string;
	parentTypeKey?: string;
	options: IDecorationRenderOptions;
}


class DecorationTypeOptionsProvider implements IModelDecorationOptionsProvider {

	private readonly _disposables = new DisposableStore();
	private readonly _styleSheet: GlobalStyleSheet | RefCountedStyleSheet;
	public refCount: number;

	public description: string;
	public className: string | undefined;
	public inlineClassName: string | undefined;
	public inlineClassNameAffectsLetterSpacing: boolean | undefined;
	public beforeContentClassName: string | undefined;
	public afterContentClassName: string | undefined;
	public glyphMarginClassName: string | undefined;
	public isWholeLine: boolean;
	public lineHeight: number | undefined;
	public fontSize: string | undefined;
	public fontFamily: string | undefined;
	public fontWeight: string | undefined;
	public fontStyle: string | undefined;
	public overviewRuler: IModelDecorationOverviewRulerOptions | undefined;
	public stickiness: TrackedRangeStickiness | undefined;
	public beforeInjectedText: InjectedTextOptions | undefined;
	public afterInjectedText: InjectedTextOptions | undefined;

	constructor(description: string, themeService: IThemeService, styleSheet: GlobalStyleSheet | RefCountedStyleSheet, providerArgs: ProviderArguments) {
		this.description = description;

		this._styleSheet = styleSheet;
		this._styleSheet.ref();
		this.refCount = 0;

		const createCSSRules = (type: ModelDecorationCSSRuleType) => {
			const rules = new DecorationCSSRules(type, providerArgs, themeService);
			this._disposables.add(rules);
			if (rules.hasContent) {
				return rules.className;
			}
			return undefined;
		};
		const createInlineCSSRules = (type: ModelDecorationCSSRuleType) => {
			const rules = new DecorationCSSRules(type, providerArgs, themeService);
			this._disposables.add(rules);
			if (rules.hasContent) {
				return { className: rules.className, hasLetterSpacing: rules.hasLetterSpacing };
			}
			return null;
		};

		this.className = createCSSRules(ModelDecorationCSSRuleType.ClassName);
		const inlineData = createInlineCSSRules(ModelDecorationCSSRuleType.InlineClassName);
		if (inlineData) {
			this.inlineClassName = inlineData.className;
			this.inlineClassNameAffectsLetterSpacing = inlineData.hasLetterSpacing;
		}
		this.beforeContentClassName = createCSSRules(ModelDecorationCSSRuleType.BeforeContentClassName);
		this.afterContentClassName = createCSSRules(ModelDecorationCSSRuleType.AfterContentClassName);

		if (providerArgs.options.beforeInjectedText && providerArgs.options.beforeInjectedText.contentText) {
			const beforeInlineData = createInlineCSSRules(ModelDecorationCSSRuleType.BeforeInjectedTextClassName);
			this.beforeInjectedText = {
				content: providerArgs.options.beforeInjectedText.contentText,
				inlineClassName: beforeInlineData?.className,
				inlineClassNameAffectsLetterSpacing: beforeInlineData?.hasLetterSpacing || providerArgs.options.beforeInjectedText.affectsLetterSpacing
			};
		}

		if (providerArgs.options.afterInjectedText && providerArgs.options.afterInjectedText.contentText) {
			const afterInlineData = createInlineCSSRules(ModelDecorationCSSRuleType.AfterInjectedTextClassName);
			this.afterInjectedText = {
				content: providerArgs.options.afterInjectedText.contentText,
				inlineClassName: afterInlineData?.className,
				inlineClassNameAffectsLetterSpacing: afterInlineData?.hasLetterSpacing || providerArgs.options.afterInjectedText.affectsLetterSpacing
			};
		}

		this.glyphMarginClassName = createCSSRules(ModelDecorationCSSRuleType.GlyphMarginClassName);

		const options = providerArgs.options;
		this.isWholeLine = Boolean(options.isWholeLine);
		this.lineHeight = options.lineHeight;
		this.fontFamily = options.fontFamily;
		this.fontSize = options.fontSize;
		this.fontWeight = options.fontWeight;
		this.fontStyle = options.fontStyle;
		this.stickiness = options.rangeBehavior;

		const lightOverviewRulerColor = options.light && options.light.overviewRulerColor || options.overviewRulerColor;
		const darkOverviewRulerColor = options.dark && options.dark.overviewRulerColor || options.overviewRulerColor;
		if (
			typeof lightOverviewRulerColor !== 'undefined'
			|| typeof darkOverviewRulerColor !== 'undefined'
		) {
			this.overviewRuler = {
				color: lightOverviewRulerColor || darkOverviewRulerColor,
				darkColor: darkOverviewRulerColor || lightOverviewRulerColor,
				position: options.overviewRulerLane || OverviewRulerLane.Center
			};
		}
	}

	public getOptions(codeEditorService: AbstractCodeEditorService, writable: boolean): IModelDecorationOptions {
		if (!writable) {
			return this;
		}

		return {
			description: this.description,
			inlineClassName: this.inlineClassName,
			beforeContentClassName: this.beforeContentClassName,
			afterContentClassName: this.afterContentClassName,
			className: this.className,
			glyphMarginClassName: this.glyphMarginClassName,
			isWholeLine: this.isWholeLine,
			lineHeight: this.lineHeight,
			fontFamily: this.fontFamily,
			fontSize: this.fontSize,
			fontWeight: this.fontWeight,
			fontStyle: this.fontStyle,
			overviewRuler: this.overviewRuler,
			stickiness: this.stickiness,
			before: this.beforeInjectedText,
			after: this.afterInjectedText
		};
	}

	public resolveDecorationCSSRules(): CSSRuleList {
		return this._styleSheet.sheet.rules;
	}

	public dispose(): void {
		this._disposables.dispose();
		this._styleSheet.unref();
	}
}


export const _CSS_MAP: { [prop: string]: string } = {
	color: 'color:{0} !important;',
	opacity: 'opacity:{0};',
	backgroundColor: 'background-color:{0};',

	outline: 'outline:{0};',
	outlineColor: 'outline-color:{0};',
	outlineStyle: 'outline-style:{0};',
	outlineWidth: 'outline-width:{0};',

	border: 'border:{0};',
	borderColor: 'border-color:{0};',
	borderRadius: 'border-radius:{0};',
	borderSpacing: 'border-spacing:{0};',
	borderStyle: 'border-style:{0};',
	borderWidth: 'border-width:{0};',

	fontStyle: 'font-style:{0};',
	fontWeight: 'font-weight:{0};',
	fontSize: 'font-size:{0};',
	fontFamily: 'font-family:{0};',
	textDecoration: 'text-decoration:{0};',
	cursor: 'cursor:{0};',
	letterSpacing: 'letter-spacing:{0};',

	gutterIconPath: 'background:{0} center center no-repeat;',
	gutterIconSize: 'background-size:{0};',

	contentText: 'content:\'{0}\';',
	contentIconPath: 'content:{0};',
	margin: 'margin:{0};',
	padding: 'padding:{0};',
	width: 'width:{0};',
	height: 'height:{0};',

	verticalAlign: 'vertical-align:{0};',
};


class DecorationCSSRules {

	private _theme: IColorTheme;
	private readonly _className: string;
	private readonly _unThemedSelector: string;
	private _hasContent: boolean;
	private _hasLetterSpacing: boolean;
	private readonly _ruleType: ModelDecorationCSSRuleType;
	private _themeListener: IDisposable | null;
	private readonly _providerArgs: ProviderArguments;
	private _usesThemeColors: boolean;

	constructor(ruleType: ModelDecorationCSSRuleType, providerArgs: ProviderArguments, themeService: IThemeService) {
		this._theme = themeService.getColorTheme();
		this._ruleType = ruleType;
		this._providerArgs = providerArgs;
		this._usesThemeColors = false;
		this._hasContent = false;
		this._hasLetterSpacing = false;

		let className = CSSNameHelper.getClassName(this._providerArgs.key, ruleType);
		if (this._providerArgs.parentTypeKey) {
			className = className + ' ' + CSSNameHelper.getClassName(this._providerArgs.parentTypeKey, ruleType);
		}
		this._className = className;

		this._unThemedSelector = CSSNameHelper.getSelector(this._providerArgs.key, this._providerArgs.parentTypeKey, ruleType);

		this._buildCSS();

		if (this._usesThemeColors) {
			this._themeListener = themeService.onDidColorThemeChange(theme => {
				this._theme = themeService.getColorTheme();
				this._removeCSS();
				this._buildCSS();
			});
		} else {
			this._themeListener = null;
		}
	}

	public dispose() {
		if (this._hasContent) {
			this._removeCSS();
			this._hasContent = false;
		}
		if (this._themeListener) {
			this._themeListener.dispose();
			this._themeListener = null;
		}
	}

	public get hasContent(): boolean {
		return this._hasContent;
	}

	public get hasLetterSpacing(): boolean {
		return this._hasLetterSpacing;
	}

	public get className(): string {
		return this._className;
	}

	private _buildCSS(): void {
		const options = this._providerArgs.options;
		let unthemedCSS: string, lightCSS: string, darkCSS: string;
		switch (this._ruleType) {
			case ModelDecorationCSSRuleType.ClassName:
				unthemedCSS = this.getCSSTextForModelDecorationClassName(options);
				lightCSS = this.getCSSTextForModelDecorationClassName(options.light);
				darkCSS = this.getCSSTextForModelDecorationClassName(options.dark);
				break;
			case ModelDecorationCSSRuleType.InlineClassName:
				unthemedCSS = this.getCSSTextForModelDecorationInlineClassName(options);
				lightCSS = this.getCSSTextForModelDecorationInlineClassName(options.light);
				darkCSS = this.getCSSTextForModelDecorationInlineClassName(options.dark);
				break;
			case ModelDecorationCSSRuleType.GlyphMarginClassName:
				unthemedCSS = this.getCSSTextForModelDecorationGlyphMarginClassName(options);
				lightCSS = this.getCSSTextForModelDecorationGlyphMarginClassName(options.light);
				darkCSS = this.getCSSTextForModelDecorationGlyphMarginClassName(options.dark);
				break;
			case ModelDecorationCSSRuleType.BeforeContentClassName:
				unthemedCSS = this.getCSSTextForModelDecorationContentClassName(options.before);
				lightCSS = this.getCSSTextForModelDecorationContentClassName(options.light && options.light.before);
				darkCSS = this.getCSSTextForModelDecorationContentClassName(options.dark && options.dark.before);
				break;
			case ModelDecorationCSSRuleType.AfterContentClassName:
				unthemedCSS = this.getCSSTextForModelDecorationContentClassName(options.after);
				lightCSS = this.getCSSTextForModelDecorationContentClassName(options.light && options.light.after);
				darkCSS = this.getCSSTextForModelDecorationContentClassName(options.dark && options.dark.after);
				break;
			case ModelDecorationCSSRuleType.BeforeInjectedTextClassName:
				unthemedCSS = this.getCSSTextForModelDecorationContentClassName(options.beforeInjectedText);
				lightCSS = this.getCSSTextForModelDecorationContentClassName(options.light && options.light.beforeInjectedText);
				darkCSS = this.getCSSTextForModelDecorationContentClassName(options.dark && options.dark.beforeInjectedText);
				break;
			case ModelDecorationCSSRuleType.AfterInjectedTextClassName:
				unthemedCSS = this.getCSSTextForModelDecorationContentClassName(options.afterInjectedText);
				lightCSS = this.getCSSTextForModelDecorationContentClassName(options.light && options.light.afterInjectedText);
				darkCSS = this.getCSSTextForModelDecorationContentClassName(options.dark && options.dark.afterInjectedText);
				break;
			default:
				throw new Error('Unknown rule type: ' + this._ruleType);
		}
		const sheet = this._providerArgs.styleSheet;

		let hasContent = false;
		if (unthemedCSS.length > 0) {
			sheet.insertRule(this._unThemedSelector, unthemedCSS);
			hasContent = true;
		}
		if (lightCSS.length > 0) {
			sheet.insertRule(`.vs${this._unThemedSelector}, .hc-light${this._unThemedSelector}`, lightCSS);
			hasContent = true;
		}
		if (darkCSS.length > 0) {
			sheet.insertRule(`.vs-dark${this._unThemedSelector}, .hc-black${this._unThemedSelector}`, darkCSS);
			hasContent = true;
		}
		this._hasContent = hasContent;
	}

	private _removeCSS(): void {
		this._providerArgs.styleSheet.removeRulesContainingSelector(this._unThemedSelector);
	}

	/**
	 * Build the CSS for decorations styled via `className`.
	 */
	private getCSSTextForModelDecorationClassName(opts: IThemeDecorationRenderOptions | undefined): string {
		if (!opts) {
			return '';
		}
		const cssTextArr: string[] = [];
		this.collectCSSText(opts, ['backgroundColor'], cssTextArr);
		this.collectCSSText(opts, ['outline', 'outlineColor', 'outlineStyle', 'outlineWidth'], cssTextArr);
		this.collectBorderSettingsCSSText(opts, cssTextArr);
		return cssTextArr.join('');
	}

	/**
	 * Build the CSS for decorations styled via `inlineClassName`.
	 */
	private getCSSTextForModelDecorationInlineClassName(opts: IThemeDecorationRenderOptions | undefined): string {
		if (!opts) {
			return '';
		}
		const cssTextArr: string[] = [];
		this.collectCSSText(opts, ['fontStyle', 'fontWeight', 'fontFamily', 'fontSize', 'textDecoration', 'cursor', 'color', 'opacity', 'letterSpacing'], cssTextArr);
		if (opts.letterSpacing) {
			this._hasLetterSpacing = true;
		}
		return cssTextArr.join('');
	}

	/**
	 * Build the CSS for decorations styled before or after content.
	 */
	private getCSSTextForModelDecorationContentClassName(opts: IContentDecorationRenderOptions | undefined): string {
		if (!opts) {
			return '';
		}
		const cssTextArr: string[] = [];

		if (typeof opts !== 'undefined') {
			this.collectBorderSettingsCSSText(opts, cssTextArr);
			if (typeof opts.contentIconPath !== 'undefined') {
				cssTextArr.push(strings.format(_CSS_MAP.contentIconPath, cssJs.asCSSUrl(URI.revive(opts.contentIconPath))));
			}
			if (typeof opts.contentText === 'string') {
				const truncated = opts.contentText.match(/^.*$/m)![0]; // only take first line
				const escaped = truncated.replace(/['\\]/g, '\\$&');

				cssTextArr.push(strings.format(_CSS_MAP.contentText, escaped));
			}
			this.collectCSSText(opts, ['verticalAlign', 'fontStyle', 'fontWeight', 'fontSize', 'fontFamily', 'textDecoration', 'color', 'opacity', 'backgroundColor', 'margin', 'padding'], cssTextArr);
			if (this.collectCSSText(opts, ['width', 'height'], cssTextArr)) {
				cssTextArr.push('display:inline-block;');
			}
		}

		return cssTextArr.join('');
	}

	/**
	 * Build the CSS for decorations styled via `glyphMarginClassName`.
	 */
	private getCSSTextForModelDecorationGlyphMarginClassName(opts: IThemeDecorationRenderOptions | undefined): string {
		if (!opts) {
			return '';
		}
		const cssTextArr: string[] = [];

		if (typeof opts.gutterIconPath !== 'undefined') {
			cssTextArr.push(strings.format(_CSS_MAP.gutterIconPath, cssJs.asCSSUrl(URI.revive(opts.gutterIconPath))));
			if (typeof opts.gutterIconSize !== 'undefined') {
				cssTextArr.push(strings.format(_CSS_MAP.gutterIconSize, opts.gutterIconSize));
			}
		}

		return cssTextArr.join('');
	}

	private collectBorderSettingsCSSText(opts: unknown, cssTextArr: string[]): boolean {
		if (this.collectCSSText(opts, ['border', 'borderColor', 'borderRadius', 'borderSpacing', 'borderStyle', 'borderWidth'], cssTextArr)) {
			cssTextArr.push(strings.format('box-sizing: border-box;'));
			return true;
		}
		return false;
	}

	private collectCSSText(opts: unknown, properties: string[], cssTextArr: string[]): boolean {
		const lenBefore = cssTextArr.length;
		for (const property of properties) {
			const value = this.resolveValue((opts as Record<string, unknown>)[property] as string | ThemeColor);
			if (typeof value === 'string') {
				cssTextArr.push(strings.format(_CSS_MAP[property], value));
			}
		}
		return cssTextArr.length !== lenBefore;
	}

	private resolveValue(value: string | ThemeColor): string {
		if (isThemeColor(value)) {
			this._usesThemeColors = true;
			const color = this._theme.getColor(value.id);
			if (color) {
				return color.toString();
			}
			return 'transparent';
		}
		return value;
	}
}

const enum ModelDecorationCSSRuleType {
	ClassName = 0,
	InlineClassName = 1,
	GlyphMarginClassName = 2,
	BeforeContentClassName = 3,
	AfterContentClassName = 4,
	BeforeInjectedTextClassName = 5,
	AfterInjectedTextClassName = 6,
}

class CSSNameHelper {

	public static getClassName(key: string, type: ModelDecorationCSSRuleType): string {
		return 'ced-' + key + '-' + type;
	}

	public static getSelector(key: string, parentKey: string | undefined, ruleType: ModelDecorationCSSRuleType): string {
		let selector = '.monaco-editor .' + this.getClassName(key, ruleType);
		if (parentKey) {
			selector = selector + '.' + this.getClassName(parentKey, ruleType);
		}
		if (ruleType === ModelDecorationCSSRuleType.BeforeContentClassName) {
			selector += '::before';
		} else if (ruleType === ModelDecorationCSSRuleType.AfterContentClassName) {
			selector += '::after';
		}
		return selector;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/services/bulkEditService.ts]---
Location: vscode-main/src/vs/editor/browser/services/bulkEditService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ICodeEditor } from '../editorBrowser.js';
import { TextEdit, WorkspaceEdit, WorkspaceEditMetadata, IWorkspaceFileEdit, WorkspaceFileEditOptions, IWorkspaceTextEdit } from '../../common/languages.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { IProgress, IProgressStep } from '../../../platform/progress/common/progress.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { isObject } from '../../../base/common/types.js';
import { UndoRedoSource } from '../../../platform/undoRedo/common/undoRedo.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { TextModelEditSource } from '../../common/textModelEditSource.js';

export const IBulkEditService = createDecorator<IBulkEditService>('IWorkspaceEditService');

export class ResourceEdit {

	protected constructor(readonly metadata?: WorkspaceEditMetadata) { }

	static convert(edit: WorkspaceEdit): ResourceEdit[] {

		return edit.edits.map(edit => {
			if (ResourceTextEdit.is(edit)) {
				return ResourceTextEdit.lift(edit);
			}

			if (ResourceFileEdit.is(edit)) {
				return ResourceFileEdit.lift(edit);
			}
			throw new Error('Unsupported edit');
		});
	}
}

export class ResourceTextEdit extends ResourceEdit implements IWorkspaceTextEdit {

	static is(candidate: unknown): candidate is IWorkspaceTextEdit {
		if (candidate instanceof ResourceTextEdit) {
			return true;
		}
		return isObject(candidate)
			&& URI.isUri((<IWorkspaceTextEdit>candidate).resource)
			&& isObject((<IWorkspaceTextEdit>candidate).textEdit);
	}

	static lift(edit: IWorkspaceTextEdit): ResourceTextEdit {
		if (edit instanceof ResourceTextEdit) {
			return edit;
		} else {
			return new ResourceTextEdit(edit.resource, edit.textEdit, edit.versionId, edit.metadata);
		}
	}

	constructor(
		readonly resource: URI,
		readonly textEdit: TextEdit & { insertAsSnippet?: boolean; keepWhitespace?: boolean },
		readonly versionId: number | undefined = undefined,
		metadata?: WorkspaceEditMetadata,
	) {
		super(metadata);
	}
}

export class ResourceFileEdit extends ResourceEdit implements IWorkspaceFileEdit {

	static is(candidate: unknown): candidate is IWorkspaceFileEdit {
		if (candidate instanceof ResourceFileEdit) {
			return true;
		} else {
			return isObject(candidate)
				&& (Boolean((<IWorkspaceFileEdit>candidate).newResource) || Boolean((<IWorkspaceFileEdit>candidate).oldResource));
		}
	}

	static lift(edit: IWorkspaceFileEdit): ResourceFileEdit {
		if (edit instanceof ResourceFileEdit) {
			return edit;
		} else {
			return new ResourceFileEdit(edit.oldResource, edit.newResource, edit.options, edit.metadata);
		}
	}

	constructor(
		readonly oldResource: URI | undefined,
		readonly newResource: URI | undefined,
		readonly options: WorkspaceFileEditOptions = {},
		metadata?: WorkspaceEditMetadata
	) {
		super(metadata);
	}
}

export interface IBulkEditOptions {
	editor?: ICodeEditor;
	progress?: IProgress<IProgressStep>;
	token?: CancellationToken;
	showPreview?: boolean;
	label?: string;
	code?: string;
	quotableLabel?: string;
	undoRedoSource?: UndoRedoSource;
	undoRedoGroupId?: number;
	confirmBeforeUndo?: boolean;
	respectAutoSaveConfig?: boolean;
	reason?: TextModelEditSource;
}

export interface IBulkEditResult {
	ariaSummary: string;
	isApplied: boolean;
}

export type IBulkEditPreviewHandler = (edits: ResourceEdit[], options?: IBulkEditOptions) => Promise<ResourceEdit[]>;

export interface IBulkEditService {
	readonly _serviceBrand: undefined;

	hasPreviewHandler(): boolean;

	setPreviewHandler(handler: IBulkEditPreviewHandler): IDisposable;

	apply(edit: ResourceEdit[] | WorkspaceEdit, options?: IBulkEditOptions): Promise<IBulkEditResult>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/services/codeEditorService.ts]---
Location: vscode-main/src/vs/editor/browser/services/codeEditorService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { ICodeEditor, IDiffEditor } from '../editorBrowser.js';
import { IDecorationRenderOptions } from '../../common/editorCommon.js';
import { IModelDecorationOptions, ITextModel } from '../../common/model.js';
import { ITextResourceEditorInput } from '../../../platform/editor/common/editor.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { URI } from '../../../base/common/uri.js';
import { IDisposable } from '../../../base/common/lifecycle.js';

export const ICodeEditorService = createDecorator<ICodeEditorService>('codeEditorService');

export interface ICodeEditorService {
	readonly _serviceBrand: undefined;

	readonly onWillCreateCodeEditor: Event<void>;
	readonly onCodeEditorAdd: Event<ICodeEditor>;
	readonly onCodeEditorRemove: Event<ICodeEditor>;

	readonly onWillCreateDiffEditor: Event<void>;
	readonly onDiffEditorAdd: Event<IDiffEditor>;
	readonly onDiffEditorRemove: Event<IDiffEditor>;

	readonly onDidChangeTransientModelProperty: Event<ITextModel>;
	readonly onDecorationTypeRegistered: Event<string>;

	willCreateCodeEditor(): void;
	addCodeEditor(editor: ICodeEditor): void;
	removeCodeEditor(editor: ICodeEditor): void;
	listCodeEditors(): readonly ICodeEditor[];

	willCreateDiffEditor(): void;
	addDiffEditor(editor: IDiffEditor): void;
	removeDiffEditor(editor: IDiffEditor): void;
	listDiffEditors(): readonly IDiffEditor[];

	/**
	 * Returns the current focused code editor (if the focus is in the editor or in an editor widget) or null.
	 */
	getFocusedCodeEditor(): ICodeEditor | null;

	registerDecorationType(description: string, key: string, options: IDecorationRenderOptions, parentTypeKey?: string, editor?: ICodeEditor): IDisposable;
	listDecorationTypes(): string[];
	removeDecorationType(key: string): void;
	resolveDecorationOptions(typeKey: string, writable: boolean): IModelDecorationOptions;
	resolveDecorationCSSRules(decorationTypeKey: string): CSSRuleList | null;

	setModelProperty(resource: URI, key: string, value: unknown): void;
	getModelProperty(resource: URI, key: string): unknown;

	setTransientModelProperty(model: ITextModel, key: string, value: unknown): void;
	getTransientModelProperty(model: ITextModel, key: string): unknown;
	getTransientModelProperties(model: ITextModel): [string, unknown][] | undefined;

	getActiveCodeEditor(): ICodeEditor | null;
	openCodeEditor(input: ITextResourceEditorInput, source: ICodeEditor | null, sideBySide?: boolean): Promise<ICodeEditor | null>;
	registerCodeEditorOpenHandler(handler: ICodeEditorOpenHandler): IDisposable;
}

export interface ICodeEditorOpenHandler {
	(input: ITextResourceEditorInput, source: ICodeEditor | null, sideBySide?: boolean): Promise<ICodeEditor | null>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/services/contribution.ts]---
Location: vscode-main/src/vs/editor/browser/services/contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerSingleton, InstantiationType } from '../../../platform/instantiation/common/extensions.js';
import { IEditorWorkerService } from '../../common/services/editorWorker.js';
import { EditorWorkerService } from './editorWorkerService.js';

registerSingleton(IEditorWorkerService, EditorWorkerService, InstantiationType.Eager /* registers link detection and word based suggestions for any document */);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/services/editorWorkerService.ts]---
Location: vscode-main/src/vs/editor/browser/services/editorWorkerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { timeout } from '../../../base/common/async.js';
import { Disposable, IDisposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { logOnceWebWorkerWarning, IWebWorkerClient, Proxied } from '../../../base/common/worker/webWorker.js';
import { WebWorkerDescriptor } from '../../../platform/webWorker/browser/webWorkerDescriptor.js';
import { IWebWorkerService } from '../../../platform/webWorker/browser/webWorkerService.js';
import { Position } from '../../common/core/position.js';
import { IRange, Range } from '../../common/core/range.js';
import { ITextModel } from '../../common/model.js';
import * as languages from '../../common/languages.js';
import { ILanguageConfigurationService } from '../../common/languages/languageConfigurationRegistry.js';
import { EditorWorker } from '../../common/services/editorWebWorker.js';
import { DiffAlgorithmName, IEditorWorkerService, ILineChange, IUnicodeHighlightsResult } from '../../common/services/editorWorker.js';
import { IModelService } from '../../common/services/model.js';
import { ITextResourceConfigurationService } from '../../common/services/textResourceConfiguration.js';
import { isNonEmptyArray } from '../../../base/common/arrays.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { StopWatch } from '../../../base/common/stopwatch.js';
import { canceled, onUnexpectedError } from '../../../base/common/errors.js';
import { UnicodeHighlighterOptions } from '../../common/services/unicodeTextModelHighlighter.js';
import { ILanguageFeaturesService } from '../../common/services/languageFeatures.js';
import { IChange } from '../../common/diff/legacyLinesDiffComputer.js';
import { IDocumentDiff, IDocumentDiffProviderOptions } from '../../common/diff/documentDiffProvider.js';
import { ILinesDiffComputerOptions, MovedText } from '../../common/diff/linesDiffComputer.js';
import { DetailedLineRangeMapping, RangeMapping, LineRangeMapping } from '../../common/diff/rangeMapping.js';
import { LineRange } from '../../common/core/ranges/lineRange.js';
import { SectionHeader, FindSectionHeaderOptions } from '../../common/services/findSectionHeaders.js';
import { mainWindow } from '../../../base/browser/window.js';
import { WindowIntervalTimer } from '../../../base/browser/dom.js';
import { WorkerTextModelSyncClient } from '../../common/services/textModelSync/textModelSync.impl.js';
import { EditorWorkerHost } from '../../common/services/editorWorkerHost.js';
import { StringEdit } from '../../common/core/edits/stringEdit.js';
import { OffsetRange } from '../../common/core/ranges/offsetRange.js';
import { FileAccess } from '../../../base/common/network.js';

/**
 * Stop the worker if it was not needed for 5 min.
 */
const STOP_WORKER_DELTA_TIME_MS = 5 * 60 * 1000;

function canSyncModel(modelService: IModelService, resource: URI): boolean {
	const model = modelService.getModel(resource);
	if (!model) {
		return false;
	}
	if (model.isTooLargeForSyncing()) {
		return false;
	}
	return true;
}

export class EditorWorkerService extends Disposable implements IEditorWorkerService {

	declare readonly _serviceBrand: undefined;

	private readonly _modelService: IModelService;
	private readonly _workerManager: WorkerManager;
	private readonly _logService: ILogService;

	constructor(
		@IModelService modelService: IModelService,
		@ITextResourceConfigurationService configurationService: ITextResourceConfigurationService,
		@ILogService logService: ILogService,
		@ILanguageConfigurationService private readonly _languageConfigurationService: ILanguageConfigurationService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
		@IWebWorkerService private readonly _webWorkerService: IWebWorkerService,
	) {
		super();
		this._modelService = modelService;

		const workerDescriptor = new WebWorkerDescriptor({
			esmModuleLocation: () => FileAccess.asBrowserUri('vs/editor/common/services/editorWebWorkerMain.js'),
			esmModuleLocationBundler: () => new URL('../../common/services/editorWebWorkerMain.ts?workerModule', import.meta.url),
			label: 'editorWorkerService'
		});

		this._workerManager = this._register(new WorkerManager(workerDescriptor, this._modelService, this._webWorkerService));
		this._logService = logService;

		// register default link-provider and default completions-provider
		this._register(languageFeaturesService.linkProvider.register({ language: '*', hasAccessToAllModels: true }, {
			provideLinks: async (model, token) => {
				if (!canSyncModel(this._modelService, model.uri)) {
					return Promise.resolve({ links: [] }); // File too large
				}
				const worker = await this._workerWithResources([model.uri]);
				const links = await worker.$computeLinks(model.uri.toString());
				return links && { links };
			}
		}));
		this._register(languageFeaturesService.completionProvider.register('*', new WordBasedCompletionItemProvider(this._workerManager, configurationService, this._modelService, this._languageConfigurationService, this._logService, languageFeaturesService)));
	}

	public override dispose(): void {
		super.dispose();
	}

	public canComputeUnicodeHighlights(uri: URI): boolean {
		return canSyncModel(this._modelService, uri);
	}

	public async computedUnicodeHighlights(uri: URI, options: UnicodeHighlighterOptions, range?: IRange): Promise<IUnicodeHighlightsResult> {
		const worker = await this._workerWithResources([uri]);
		return worker.$computeUnicodeHighlights(uri.toString(), options, range);
	}

	public async computeDiff(original: URI, modified: URI, options: IDocumentDiffProviderOptions, algorithm: DiffAlgorithmName): Promise<IDocumentDiff | null> {
		const worker = await this._workerWithResources([original, modified], /* forceLargeModels */true);
		const result = await worker.$computeDiff(original.toString(), modified.toString(), options, algorithm);
		if (!result) {
			return null;
		}
		// Convert from space efficient JSON data to rich objects.
		const diff: IDocumentDiff = {
			identical: result.identical,
			quitEarly: result.quitEarly,
			changes: toLineRangeMappings(result.changes),
			moves: result.moves.map(m => new MovedText(
				new LineRangeMapping(new LineRange(m[0], m[1]), new LineRange(m[2], m[3])),
				toLineRangeMappings(m[4])
			))
		};
		return diff;

		function toLineRangeMappings(changes: readonly ILineChange[]): readonly DetailedLineRangeMapping[] {
			return changes.map(
				(c) => new DetailedLineRangeMapping(
					new LineRange(c[0], c[1]),
					new LineRange(c[2], c[3]),
					c[4]?.map(
						(c) => new RangeMapping(
							new Range(c[0], c[1], c[2], c[3]),
							new Range(c[4], c[5], c[6], c[7])
						)
					)
				)
			);
		}
	}

	public canComputeDirtyDiff(original: URI, modified: URI): boolean {
		return (canSyncModel(this._modelService, original) && canSyncModel(this._modelService, modified));
	}

	public async computeDirtyDiff(original: URI, modified: URI, ignoreTrimWhitespace: boolean): Promise<IChange[] | null> {
		const worker = await this._workerWithResources([original, modified]);
		return worker.$computeDirtyDiff(original.toString(), modified.toString(), ignoreTrimWhitespace);
	}

	public async computeMoreMinimalEdits(resource: URI, edits: languages.TextEdit[] | null | undefined, pretty: boolean = false): Promise<languages.TextEdit[] | undefined> {
		if (isNonEmptyArray(edits)) {
			if (!canSyncModel(this._modelService, resource)) {
				return Promise.resolve(edits); // File too large
			}
			const sw = StopWatch.create();
			const result = this._workerWithResources([resource]).then(worker => worker.$computeMoreMinimalEdits(resource.toString(), edits, pretty));
			result.finally(() => this._logService.trace('FORMAT#computeMoreMinimalEdits', resource.toString(true), sw.elapsed()));
			return Promise.race([result, timeout(1000).then(() => edits)]);

		} else {
			return Promise.resolve(undefined);
		}
	}

	public computeHumanReadableDiff(resource: URI, edits: languages.TextEdit[] | null | undefined): Promise<languages.TextEdit[] | undefined> {
		if (isNonEmptyArray(edits)) {
			if (!canSyncModel(this._modelService, resource)) {
				return Promise.resolve(edits); // File too large
			}
			const sw = StopWatch.create();
			const opts: ILinesDiffComputerOptions = { ignoreTrimWhitespace: false, maxComputationTimeMs: 1000, computeMoves: false };
			const result = (
				this._workerWithResources([resource])
					.then(worker => worker.$computeHumanReadableDiff(resource.toString(), edits, opts))
					.catch((err) => {
						onUnexpectedError(err);
						// In case of an exception, fall back to computeMoreMinimalEdits
						return this.computeMoreMinimalEdits(resource, edits, true);
					})
			);
			result.finally(() => this._logService.trace('FORMAT#computeHumanReadableDiff', resource.toString(true), sw.elapsed()));
			return result;

		} else {
			return Promise.resolve(undefined);
		}
	}

	public async computeStringEditFromDiff(original: string, modified: string, options: { maxComputationTimeMs: number }, algorithm: DiffAlgorithmName): Promise<StringEdit> {
		try {
			const worker = await this._workerWithResources([]);
			const edit = await worker.$computeStringDiff(original, modified, options, algorithm);
			return StringEdit.fromJson(edit);
		} catch (e) {
			onUnexpectedError(e);
			return StringEdit.replace(OffsetRange.ofLength(original.length), modified); // approximation
		}
	}

	public canNavigateValueSet(resource: URI): boolean {
		return (canSyncModel(this._modelService, resource));
	}

	public async navigateValueSet(resource: URI, range: IRange, up: boolean): Promise<languages.IInplaceReplaceSupportResult | null> {
		const model = this._modelService.getModel(resource);
		if (!model) {
			return null;
		}
		const wordDefRegExp = this._languageConfigurationService.getLanguageConfiguration(model.getLanguageId()).getWordDefinition();
		const wordDef = wordDefRegExp.source;
		const wordDefFlags = wordDefRegExp.flags;
		const worker = await this._workerWithResources([resource]);
		return worker.$navigateValueSet(resource.toString(), range, up, wordDef, wordDefFlags);
	}

	public canComputeWordRanges(resource: URI): boolean {
		return canSyncModel(this._modelService, resource);
	}

	public async computeWordRanges(resource: URI, range: IRange): Promise<{ [word: string]: IRange[] } | null> {
		const model = this._modelService.getModel(resource);
		if (!model) {
			return Promise.resolve(null);
		}
		const wordDefRegExp = this._languageConfigurationService.getLanguageConfiguration(model.getLanguageId()).getWordDefinition();
		const wordDef = wordDefRegExp.source;
		const wordDefFlags = wordDefRegExp.flags;
		const worker = await this._workerWithResources([resource]);
		return worker.$computeWordRanges(resource.toString(), range, wordDef, wordDefFlags);
	}

	public async findSectionHeaders(uri: URI, options: FindSectionHeaderOptions): Promise<SectionHeader[]> {
		const worker = await this._workerWithResources([uri]);
		return worker.$findSectionHeaders(uri.toString(), options);
	}

	public async computeDefaultDocumentColors(uri: URI): Promise<languages.IColorInformation[] | null> {
		const worker = await this._workerWithResources([uri]);
		return worker.$computeDefaultDocumentColors(uri.toString());
	}

	private async _workerWithResources(resources: URI[], forceLargeModels: boolean = false): Promise<Proxied<EditorWorker>> {
		const worker = await this._workerManager.withWorker();
		return await worker.workerWithSyncedResources(resources, forceLargeModels);
	}
}

class WordBasedCompletionItemProvider implements languages.CompletionItemProvider {

	private readonly _workerManager: WorkerManager;
	private readonly _configurationService: ITextResourceConfigurationService;
	private readonly _modelService: IModelService;

	readonly _debugDisplayName = 'wordbasedCompletions';

	constructor(
		workerManager: WorkerManager,
		configurationService: ITextResourceConfigurationService,
		modelService: IModelService,
		private readonly languageConfigurationService: ILanguageConfigurationService,
		private readonly logService: ILogService,
		private readonly languageFeaturesService: ILanguageFeaturesService,
	) {
		this._workerManager = workerManager;
		this._configurationService = configurationService;
		this._modelService = modelService;
	}

	async provideCompletionItems(model: ITextModel, position: Position): Promise<languages.CompletionList | undefined> {
		type WordBasedSuggestionsConfig = {
			wordBasedSuggestions?: 'off' | 'currentDocument' | 'matchingDocuments' | 'allDocuments' | 'offWithInlineSuggestions';
		};
		const config = this._configurationService.getValue<WordBasedSuggestionsConfig>(model.uri, position, 'editor');
		if (config.wordBasedSuggestions === 'off') {
			return undefined;
		}

		if (config.wordBasedSuggestions === 'offWithInlineSuggestions' && this.languageFeaturesService.inlineCompletionsProvider.has(model)) {
			return undefined;
		}

		const models: URI[] = [];
		if (config.wordBasedSuggestions === 'currentDocument') {
			// only current file and only if not too large
			if (canSyncModel(this._modelService, model.uri)) {
				models.push(model.uri);
			}
		} else {
			// either all files or files of same language
			for (const candidate of this._modelService.getModels()) {
				if (!canSyncModel(this._modelService, candidate.uri)) {
					continue;
				}
				if (candidate === model) {
					models.unshift(candidate.uri);

				} else if (config.wordBasedSuggestions === 'allDocuments' || candidate.getLanguageId() === model.getLanguageId()) {
					models.push(candidate.uri);
				}
			}
		}

		if (models.length === 0) {
			return undefined; // File too large, no other files
		}

		const wordDefRegExp = this.languageConfigurationService.getLanguageConfiguration(model.getLanguageId()).getWordDefinition();
		const word = model.getWordAtPosition(position);
		const replace = !word ? Range.fromPositions(position) : new Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn);
		const insert = replace.setEndPosition(position.lineNumber, position.column);

		// Trace logging about the word and replace/insert ranges
		this.logService.trace('[WordBasedCompletionItemProvider]', `word: "${word?.word || ''}", wordDef: "${wordDefRegExp}", replace: [${replace.toString()}], insert: [${insert.toString()}]`);

		const client = await this._workerManager.withWorker();
		const data = await client.textualSuggest(models, word?.word, wordDefRegExp);
		if (!data) {
			return undefined;
		}

		return {
			duration: data.duration,
			suggestions: data.words.map((word): languages.CompletionItem => {
				return {
					kind: languages.CompletionItemKind.Text,
					label: word,
					insertText: word,
					range: { insert, replace }
				};
			}),
		};
	}
}

class WorkerManager extends Disposable {

	private readonly _modelService: IModelService;
	private readonly _webWorkerService: IWebWorkerService;
	private _editorWorkerClient: EditorWorkerClient | null;
	private _lastWorkerUsedTime: number;

	constructor(
		private readonly _workerDescriptor: WebWorkerDescriptor,
		@IModelService modelService: IModelService,
		@IWebWorkerService webWorkerService: IWebWorkerService
	) {
		super();
		this._modelService = modelService;
		this._webWorkerService = webWorkerService;
		this._editorWorkerClient = null;
		this._lastWorkerUsedTime = (new Date()).getTime();

		const stopWorkerInterval = this._register(new WindowIntervalTimer());
		stopWorkerInterval.cancelAndSet(() => this._checkStopIdleWorker(), Math.round(STOP_WORKER_DELTA_TIME_MS / 2), mainWindow);

		this._register(this._modelService.onModelRemoved(_ => this._checkStopEmptyWorker()));
	}

	public override dispose(): void {
		if (this._editorWorkerClient) {
			this._editorWorkerClient.dispose();
			this._editorWorkerClient = null;
		}
		super.dispose();
	}

	/**
	 * Check if the model service has no more models and stop the worker if that is the case.
	 */
	private _checkStopEmptyWorker(): void {
		if (!this._editorWorkerClient) {
			return;
		}

		const models = this._modelService.getModels();
		if (models.length === 0) {
			// There are no more models => nothing possible for me to do
			this._editorWorkerClient.dispose();
			this._editorWorkerClient = null;
		}
	}

	/**
	 * Check if the worker has been idle for a while and then stop it.
	 */
	private _checkStopIdleWorker(): void {
		if (!this._editorWorkerClient) {
			return;
		}

		const timeSinceLastWorkerUsedTime = (new Date()).getTime() - this._lastWorkerUsedTime;
		if (timeSinceLastWorkerUsedTime > STOP_WORKER_DELTA_TIME_MS) {
			this._editorWorkerClient.dispose();
			this._editorWorkerClient = null;
		}
	}

	public withWorker(): Promise<EditorWorkerClient> {
		this._lastWorkerUsedTime = (new Date()).getTime();
		if (!this._editorWorkerClient) {
			this._editorWorkerClient = new EditorWorkerClient(this._workerDescriptor, false, this._modelService, this._webWorkerService);
		}
		return Promise.resolve(this._editorWorkerClient);
	}
}

class SynchronousWorkerClient<T extends IDisposable> implements IWebWorkerClient<T> {
	private readonly _instance: T;
	public readonly proxy: Proxied<T>;

	constructor(instance: T) {
		this._instance = instance;
		this.proxy = this._instance as Proxied<T>;
	}

	public dispose(): void {
		this._instance.dispose();
	}

	public setChannel<T extends object>(channel: string, handler: T): void {
		throw new Error(`Not supported`);
	}

	public getChannel<T extends object>(channel: string): Proxied<T> {
		throw new Error(`Not supported`);
	}
}

export interface IEditorWorkerClient {
	fhr(method: string, args: unknown[]): Promise<unknown>;
}

export class EditorWorkerClient extends Disposable implements IEditorWorkerClient {

	private readonly _modelService: IModelService;
	private readonly _webWorkerService: IWebWorkerService;
	private readonly _keepIdleModels: boolean;
	private _worker: IWebWorkerClient<EditorWorker> | null;
	private _modelManager: WorkerTextModelSyncClient | null;
	private _disposed = false;

	constructor(
		private readonly _workerDescriptorOrWorker: WebWorkerDescriptor | Worker | Promise<Worker>,
		keepIdleModels: boolean,
		@IModelService modelService: IModelService,
		@IWebWorkerService webWorkerService: IWebWorkerService
	) {
		super();
		this._modelService = modelService;
		this._webWorkerService = webWorkerService;
		this._keepIdleModels = keepIdleModels;
		this._worker = null;
		this._modelManager = null;
	}

	// foreign host request
	public fhr(method: string, args: unknown[]): Promise<unknown> {
		throw new Error(`Not implemented!`);
	}

	private _getOrCreateWorker(): IWebWorkerClient<EditorWorker> {
		if (!this._worker) {
			try {
				this._worker = this._register(this._webWorkerService.createWorkerClient<EditorWorker>(this._workerDescriptorOrWorker));
				EditorWorkerHost.setChannel(this._worker, this._createEditorWorkerHost());
			} catch (err) {
				logOnceWebWorkerWarning(err);
				this._worker = this._createFallbackLocalWorker();
			}
		}
		return this._worker;
	}

	protected async _getProxy(): Promise<Proxied<EditorWorker>> {
		try {
			const proxy = this._getOrCreateWorker().proxy;
			await proxy.$ping();
			return proxy;
		} catch (err) {
			logOnceWebWorkerWarning(err);
			this._worker = this._createFallbackLocalWorker();
			return this._worker.proxy;
		}
	}

	private _createFallbackLocalWorker(): SynchronousWorkerClient<EditorWorker> {
		return new SynchronousWorkerClient(new EditorWorker(null));
	}

	private _createEditorWorkerHost(): EditorWorkerHost {
		return {
			$fhr: (method, args) => this.fhr(method, args)
		};
	}

	private _getOrCreateModelManager(proxy: Proxied<EditorWorker>): WorkerTextModelSyncClient {
		if (!this._modelManager) {
			this._modelManager = this._register(new WorkerTextModelSyncClient(proxy, this._modelService, this._keepIdleModels));
		}
		return this._modelManager;
	}

	public async workerWithSyncedResources(resources: URI[], forceLargeModels: boolean = false): Promise<Proxied<EditorWorker>> {
		if (this._disposed) {
			return Promise.reject(canceled());
		}
		const proxy = await this._getProxy();
		this._getOrCreateModelManager(proxy).ensureSyncedResources(resources, forceLargeModels);
		return proxy;
	}

	public async textualSuggest(resources: URI[], leadingWord: string | undefined, wordDefRegExp: RegExp): Promise<{ words: string[]; duration: number } | null> {
		const proxy = await this.workerWithSyncedResources(resources);
		const wordDef = wordDefRegExp.source;
		const wordDefFlags = wordDefRegExp.flags;
		return proxy.$textualSuggest(resources.map(r => r.toString()), leadingWord, wordDef, wordDefFlags);
	}

	override dispose(): void {
		super.dispose();
		this._disposed = true;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/services/inlineCompletionsService.ts]---
Location: vscode-main/src/vs/editor/browser/services/inlineCompletionsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TimeoutTimer } from '../../../base/common/async.js';
import { BugIndicatingError } from '../../../base/common/errors.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { localize, localize2 } from '../../../nls.js';
import { Action2 } from '../../../platform/actions/common/actions.js';
import { ContextKeyExpr, IContextKeyService, RawContextKey } from '../../../platform/contextkey/common/contextkey.js';
import { InstantiationType, registerSingleton } from '../../../platform/instantiation/common/extensions.js';
import { createDecorator, ServicesAccessor } from '../../../platform/instantiation/common/instantiation.js';
import { IQuickInputService, IQuickPickItem } from '../../../platform/quickinput/common/quickInput.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../platform/telemetry/common/telemetry.js';

export const IInlineCompletionsService = createDecorator<IInlineCompletionsService>('IInlineCompletionsService');

export interface IInlineCompletionsService {
	readonly _serviceBrand: undefined;

	readonly onDidChangeIsSnoozing: Event<boolean>;

	/**
	 * Get the remaining time (in ms) for which inline completions should be snoozed,
	 * or 0 if not snoozed.
	 */
	readonly snoozeTimeLeft: number;

	/**
	 * Snooze inline completions for the specified duration. If already snoozed, extend the snooze time.
	 */
	snooze(durationMs?: number): void;

	/**
	 * Snooze inline completions for the specified duration. If already snoozed, overwrite the existing snooze time.
	 */
	setSnoozeDuration(durationMs: number): void;

	/**
	 * Check if inline completions are currently snoozed.
	*/
	isSnoozing(): boolean;

	/**
	 * Cancel the current snooze.
	*/
	cancelSnooze(): void;

	/**
	 * Report an inline completion.
	 */
	reportNewCompletion(requestUuid: string): void;
}

const InlineCompletionsSnoozing = new RawContextKey<boolean>('inlineCompletions.snoozed', false, localize('inlineCompletions.snoozed', "Whether inline completions are currently snoozed"));

export class InlineCompletionsService extends Disposable implements IInlineCompletionsService {
	declare readonly _serviceBrand: undefined;

	private _onDidChangeIsSnoozing = this._register(new Emitter<boolean>());
	readonly onDidChangeIsSnoozing: Event<boolean> = this._onDidChangeIsSnoozing.event;

	private static readonly SNOOZE_DURATION = 300_000; // 5 minutes

	private _snoozeTimeEnd: undefined | number = undefined;
	get snoozeTimeLeft(): number {
		if (this._snoozeTimeEnd === undefined) {
			return 0;
		}
		return Math.max(0, this._snoozeTimeEnd - Date.now());
	}

	private _timer: TimeoutTimer;

	constructor(
		@IContextKeyService private _contextKeyService: IContextKeyService,
		@ITelemetryService private _telemetryService: ITelemetryService,
	) {
		super();

		this._timer = this._register(new TimeoutTimer());

		const inlineCompletionsSnoozing = InlineCompletionsSnoozing.bindTo(this._contextKeyService);
		this._register(this.onDidChangeIsSnoozing(() => inlineCompletionsSnoozing.set(this.isSnoozing())));
	}

	snooze(durationMs: number = InlineCompletionsService.SNOOZE_DURATION): void {
		this.setSnoozeDuration(durationMs + this.snoozeTimeLeft);
	}

	setSnoozeDuration(durationMs: number): void {
		if (durationMs < 0) {
			throw new BugIndicatingError(`Invalid snooze duration: ${durationMs}. Duration must be non-negative.`);
		}
		if (durationMs === 0) {
			this.cancelSnooze();
			return;
		}

		const wasSnoozing = this.isSnoozing();
		const timeLeft = this.snoozeTimeLeft;

		this._snoozeTimeEnd = Date.now() + durationMs;

		if (!wasSnoozing) {
			this._onDidChangeIsSnoozing.fire(true);
		}

		this._timer.cancelAndSet(
			() => {
				if (!this.isSnoozing()) {
					this._onDidChangeIsSnoozing.fire(false);
				} else {
					throw new BugIndicatingError('Snooze timer did not fire as expected');
				}
			},
			this.snoozeTimeLeft + 1,
		);

		this._reportSnooze(durationMs - timeLeft, durationMs);
	}

	isSnoozing(): boolean {
		return this.snoozeTimeLeft > 0;
	}

	cancelSnooze(): void {
		if (this.isSnoozing()) {
			this._reportSnooze(-this.snoozeTimeLeft, 0);
			this._snoozeTimeEnd = undefined;
			this._timer.cancel();
			this._onDidChangeIsSnoozing.fire(false);
		}
	}

	private _lastCompletionId: string | undefined;
	private _recentCompletionIds: string[] = [];
	reportNewCompletion(requestUuid: string): void {
		this._lastCompletionId = requestUuid;

		this._recentCompletionIds.unshift(requestUuid);
		if (this._recentCompletionIds.length > 5) {
			this._recentCompletionIds.pop();
		}
	}

	private _reportSnooze(deltaMs: number, totalMs: number): void {
		const deltaSeconds = Math.round(deltaMs / 1000);
		const totalSeconds = Math.round(totalMs / 1000);
		type WorkspaceStatsClassification = {
			owner: 'benibenj';
			comment: 'Snooze duration for inline completions';
			deltaSeconds: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The duration by which the snooze has changed, in seconds.' };
			totalSeconds: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The total duration for which inline completions are snoozed, in seconds.' };
			lastCompletionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The ID of the last completion.' };
			recentCompletionIds: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The IDs of the recent completions.' };
		};
		type WorkspaceStatsEvent = {
			deltaSeconds: number;
			totalSeconds: number;
			lastCompletionId: string | undefined;
			recentCompletionIds: string[];
		};
		this._telemetryService.publicLog2<WorkspaceStatsEvent, WorkspaceStatsClassification>('inlineCompletions.snooze', {
			deltaSeconds,
			totalSeconds,
			lastCompletionId: this._lastCompletionId,
			recentCompletionIds: this._recentCompletionIds,
		});
	}
}

registerSingleton(IInlineCompletionsService, InlineCompletionsService, InstantiationType.Delayed);

const snoozeInlineSuggestId = 'editor.action.inlineSuggest.snooze';
const cancelSnoozeInlineSuggestId = 'editor.action.inlineSuggest.cancelSnooze';
const LAST_SNOOZE_DURATION_KEY = 'inlineCompletions.lastSnoozeDuration';

export class SnoozeInlineCompletion extends Action2 {
	public static ID = snoozeInlineSuggestId;
	constructor() {
		super({
			id: SnoozeInlineCompletion.ID,
			title: localize2('action.inlineSuggest.snooze', "Snooze Inline Suggestions"),
			precondition: ContextKeyExpr.true(),
			f1: true,
		});
	}

	public async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const quickInputService = accessor.get(IQuickInputService);
		const inlineCompletionsService = accessor.get(IInlineCompletionsService);
		const storageService = accessor.get(IStorageService);

		let durationMs: number | undefined;
		if (args.length > 0 && typeof args[0] === 'number') {
			durationMs = args[0] * 60_000;
		}

		if (!durationMs) {
			durationMs = await this.getDurationFromUser(quickInputService, storageService);
		}

		if (durationMs) {
			inlineCompletionsService.setSnoozeDuration(durationMs);
		}
	}

	private async getDurationFromUser(quickInputService: IQuickInputService, storageService: IStorageService): Promise<number | undefined> {
		const lastSelectedDuration = storageService.getNumber(LAST_SNOOZE_DURATION_KEY, StorageScope.PROFILE, 300_000);

		const items: (IQuickPickItem & { value: number })[] = [
			{ label: '1 minute', id: '1', value: 60_000 },
			{ label: '5 minutes', id: '5', value: 300_000 },
			{ label: '10 minutes', id: '10', value: 600_000 },
			{ label: '15 minutes', id: '15', value: 900_000 },
			{ label: '30 minutes', id: '30', value: 1_800_000 },
			{ label: '60 minutes', id: '60', value: 3_600_000 }
		];

		const picked = await quickInputService.pick(items, {
			placeHolder: localize('snooze.placeholder', "Select snooze duration for Inline Suggestions"),
			activeItem: items.find(item => item.value === lastSelectedDuration),
		});

		if (picked) {
			storageService.store(LAST_SNOOZE_DURATION_KEY, picked.value, StorageScope.PROFILE, StorageTarget.USER);
			return picked.value;
		}

		return undefined;
	}
}

export class CancelSnoozeInlineCompletion extends Action2 {
	public static ID = cancelSnoozeInlineSuggestId;
	constructor() {
		super({
			id: CancelSnoozeInlineCompletion.ID,
			title: localize2('action.inlineSuggest.cancelSnooze', "Cancel Snooze Inline Suggestions"),
			precondition: InlineCompletionsSnoozing,
			f1: true,
		});
	}

	public async run(accessor: ServicesAccessor): Promise<void> {
		accessor.get(IInlineCompletionsService).cancelSnooze();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/services/markerDecorations.ts]---
Location: vscode-main/src/vs/editor/browser/services/markerDecorations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IMarkerDecorationsService } from '../../common/services/markerDecorations.js';
import { EditorContributionInstantiation, registerEditorContribution } from '../editorExtensions.js';
import { ICodeEditor } from '../editorBrowser.js';
import { IEditorContribution } from '../../common/editorCommon.js';

export class MarkerDecorationsContribution implements IEditorContribution {

	public static readonly ID: string = 'editor.contrib.markerDecorations';

	constructor(
		_editor: ICodeEditor,
		@IMarkerDecorationsService _markerDecorationsService: IMarkerDecorationsService
	) {
		// Doesn't do anything, just requires `IMarkerDecorationsService` to make sure it gets instantiated
	}

	dispose(): void {
	}
}

registerEditorContribution(MarkerDecorationsContribution.ID, MarkerDecorationsContribution, EditorContributionInstantiation.Eager); // eager because it instantiates IMarkerDecorationsService which is responsible for rendering squiggles
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/services/openerService.ts]---
Location: vscode-main/src/vs/editor/browser/services/openerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../base/browser/dom.js';
import { mainWindow } from '../../../base/browser/window.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { LinkedList } from '../../../base/common/linkedList.js';
import { ResourceMap } from '../../../base/common/map.js';
import { parse } from '../../../base/common/marshalling.js';
import { matchesScheme, matchesSomeScheme, Schemas } from '../../../base/common/network.js';
import { normalizePath } from '../../../base/common/resources.js';
import { URI } from '../../../base/common/uri.js';
import { ICodeEditorService } from './codeEditorService.js';
import { ICommandService } from '../../../platform/commands/common/commands.js';
import { EditorOpenSource } from '../../../platform/editor/common/editor.js';
import { extractSelection, IExternalOpener, IExternalUriResolver, IOpener, IOpenerService, IResolvedExternalUri, IValidator, OpenOptions, ResolveExternalUriOptions } from '../../../platform/opener/common/opener.js';

class CommandOpener implements IOpener {

	constructor(@ICommandService private readonly _commandService: ICommandService) { }

	async open(target: URI | string, options?: OpenOptions): Promise<boolean> {
		if (!matchesScheme(target, Schemas.command)) {
			return false;
		}

		if (!options?.allowCommands) {
			// silently ignore commands when command-links are disabled, also
			// suppress other openers by returning TRUE
			return true;
		}

		if (typeof target === 'string') {
			target = URI.parse(target);
		}

		if (Array.isArray(options.allowCommands)) {
			// Only allow specific commands
			if (!options.allowCommands.includes(target.path)) {
				// Suppress other openers by returning TRUE
				return true;
			}
		}

		// execute as command
		let args: unknown[] = [];
		try {
			args = parse(decodeURIComponent(target.query));
		} catch {
			// ignore and retry
			try {
				args = parse(target.query);
			} catch {
				// ignore error
			}
		}
		if (!Array.isArray(args)) {
			args = [args];
		}
		await this._commandService.executeCommand(target.path, ...args);
		return true;
	}
}

class EditorOpener implements IOpener {

	constructor(@ICodeEditorService private readonly _editorService: ICodeEditorService) { }

	async open(target: URI | string, options: OpenOptions) {
		if (typeof target === 'string') {
			target = URI.parse(target);
		}

		const { selection, uri } = extractSelection(target);
		target = uri;

		if (target.scheme === Schemas.file) {
			target = normalizePath(target); // workaround for non-normalized paths (https://github.com/microsoft/vscode/issues/12954)
		}

		await this._editorService.openCodeEditor(
			{
				resource: target,
				options: {
					selection,
					source: options?.fromUserGesture ? EditorOpenSource.USER : EditorOpenSource.API,
					...options?.editorOptions
				}
			},
			this._editorService.getFocusedCodeEditor(),
			options?.openToSide
		);

		return true;
	}
}

export class OpenerService implements IOpenerService {

	declare readonly _serviceBrand: undefined;

	private readonly _openers = new LinkedList<IOpener>();
	private readonly _validators = new LinkedList<IValidator>();
	private readonly _resolvers = new LinkedList<IExternalUriResolver>();
	private readonly _resolvedUriTargets = new ResourceMap<URI>(uri => uri.with({ path: null, fragment: null, query: null }).toString());

	private _defaultExternalOpener: IExternalOpener;
	private readonly _externalOpeners = new LinkedList<IExternalOpener>();

	constructor(
		@ICodeEditorService editorService: ICodeEditorService,
		@ICommandService commandService: ICommandService
	) {
		// Default external opener is going through window.open()
		this._defaultExternalOpener = {
			openExternal: async href => {
				// ensure to open HTTP/HTTPS links into new windows
				// to not trigger a navigation. Any other link is
				// safe to be set as HREF to prevent a blank window
				// from opening.
				if (matchesSomeScheme(href, Schemas.http, Schemas.https)) {
					dom.windowOpenNoOpener(href);
				} else {
					mainWindow.location.href = href;
				}
				return true;
			}
		};

		// Default opener: any external, maito, http(s), command, and catch-all-editors
		this._openers.push({
			open: async (target: URI | string, options?: OpenOptions) => {
				if (options?.openExternal || matchesSomeScheme(target, Schemas.mailto, Schemas.http, Schemas.https, Schemas.vsls)) {
					// open externally
					await this._doOpenExternal(target, options);
					return true;
				}
				return false;
			}
		});
		this._openers.push(new CommandOpener(commandService));
		this._openers.push(new EditorOpener(editorService));
	}

	registerOpener(opener: IOpener): IDisposable {
		const remove = this._openers.unshift(opener);
		return { dispose: remove };
	}

	registerValidator(validator: IValidator): IDisposable {
		const remove = this._validators.push(validator);
		return { dispose: remove };
	}

	registerExternalUriResolver(resolver: IExternalUriResolver): IDisposable {
		const remove = this._resolvers.push(resolver);
		return { dispose: remove };
	}

	setDefaultExternalOpener(externalOpener: IExternalOpener): void {
		this._defaultExternalOpener = externalOpener;
	}

	registerExternalOpener(opener: IExternalOpener): IDisposable {
		const remove = this._externalOpeners.push(opener);
		return { dispose: remove };
	}

	async open(target: URI | string, options?: OpenOptions): Promise<boolean> {
		const targetURI = typeof target === 'string' ? URI.parse(target) : target;

		// Internal schemes are not openable and must instead be handled in event listeners
		if (targetURI.scheme === Schemas.internal) {
			return false;
		}

		// check with contributed validators
		if (!options?.skipValidation) {
			const validationTarget = this._resolvedUriTargets.get(targetURI) ?? target; // validate against the original URI that this URI resolves to, if one exists
			for (const validator of this._validators) {
				if (!(await validator.shouldOpen(validationTarget, options))) {
					return false;
				}
			}
		}

		// check with contributed openers
		for (const opener of this._openers) {
			const handled = await opener.open(target, options);
			if (handled) {
				return true;
			}
		}

		return false;
	}

	async resolveExternalUri(resource: URI, options?: ResolveExternalUriOptions): Promise<IResolvedExternalUri> {
		for (const resolver of this._resolvers) {
			try {
				const result = await resolver.resolveExternalUri(resource, options);
				if (result) {
					if (!this._resolvedUriTargets.has(result.resolved)) {
						this._resolvedUriTargets.set(result.resolved, resource);
					}
					return result;
				}
			} catch {
				// noop
			}
		}

		throw new Error('Could not resolve external URI: ' + resource.toString());
	}

	private async _doOpenExternal(resource: URI | string, options: OpenOptions | undefined): Promise<boolean> {

		//todo@jrieken IExternalUriResolver should support `uri: URI | string`
		const uri = typeof resource === 'string' ? URI.parse(resource) : resource;
		let externalUri: URI;

		try {
			externalUri = (await this.resolveExternalUri(uri, options)).resolved;
		} catch {
			externalUri = uri;
		}

		let href: string;
		if (typeof resource === 'string' && uri.toString() === externalUri.toString()) {
			// open the url-string AS IS
			href = resource;
		} else {
			// open URI using the toString(noEncode)+encodeURI-trick
			href = encodeURI(externalUri.toString(true));
		}

		if (options?.allowContributedOpeners) {
			const preferredOpenerId = typeof options?.allowContributedOpeners === 'string' ? options?.allowContributedOpeners : undefined;
			for (const opener of this._externalOpeners) {
				const didOpen = await opener.openExternal(href, {
					sourceUri: uri,
					preferredOpenerId,
				}, CancellationToken.None);
				if (didOpen) {
					return true;
				}
			}
		}

		return this._defaultExternalOpener.openExternal(href, { sourceUri: uri }, CancellationToken.None);
	}

	dispose() {
		this._validators.clear();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/view/domLineBreaksComputer.ts]---
Location: vscode-main/src/vs/editor/browser/view/domLineBreaksComputer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createTrustedTypesPolicy } from '../../../base/browser/trustedTypes.js';
import { CharCode } from '../../../base/common/charCode.js';
import * as strings from '../../../base/common/strings.js';
import { assertReturnsDefined } from '../../../base/common/types.js';
import { applyFontInfo } from '../config/domFontInfo.js';
import { WrappingIndent } from '../../common/config/editorOptions.js';
import { FontInfo } from '../../common/config/fontInfo.js';
import { StringBuilder } from '../../common/core/stringBuilder.js';
import { InjectedTextOptions } from '../../common/model.js';
import { ILineBreaksComputer, ILineBreaksComputerFactory, ModelLineProjectionData } from '../../common/modelLineProjectionData.js';
import { LineInjectedText } from '../../common/textModelEvents.js';

const ttPolicy = createTrustedTypesPolicy('domLineBreaksComputer', { createHTML: value => value });

export class DOMLineBreaksComputerFactory implements ILineBreaksComputerFactory {

	public static create(targetWindow: Window): DOMLineBreaksComputerFactory {
		return new DOMLineBreaksComputerFactory(new WeakRef(targetWindow));
	}

	constructor(private targetWindow: WeakRef<Window>) {
	}

	public createLineBreaksComputer(fontInfo: FontInfo, tabSize: number, wrappingColumn: number, wrappingIndent: WrappingIndent, wordBreak: 'normal' | 'keepAll', wrapOnEscapedLineFeeds: boolean): ILineBreaksComputer {
		const requests: string[] = [];
		const injectedTexts: (LineInjectedText[] | null)[] = [];
		return {
			addRequest: (lineText: string, injectedText: LineInjectedText[] | null, previousLineBreakData: ModelLineProjectionData | null) => {
				requests.push(lineText);
				injectedTexts.push(injectedText);
			},
			finalize: () => {
				return createLineBreaks(assertReturnsDefined(this.targetWindow.deref()), requests, fontInfo, tabSize, wrappingColumn, wrappingIndent, wordBreak, injectedTexts);
			}
		};
	}
}

function createLineBreaks(targetWindow: Window, requests: string[], fontInfo: FontInfo, tabSize: number, firstLineBreakColumn: number, wrappingIndent: WrappingIndent, wordBreak: 'normal' | 'keepAll', injectedTextsPerLine: (LineInjectedText[] | null)[]): (ModelLineProjectionData | null)[] {
	function createEmptyLineBreakWithPossiblyInjectedText(requestIdx: number): ModelLineProjectionData | null {
		const injectedTexts = injectedTextsPerLine[requestIdx];
		if (injectedTexts) {
			const lineText = LineInjectedText.applyInjectedText(requests[requestIdx], injectedTexts);

			const injectionOptions = injectedTexts.map(t => t.options);
			const injectionOffsets = injectedTexts.map(text => text.column - 1);

			// creating a `LineBreakData` with an invalid `breakOffsetsVisibleColumn` is OK
			// because `breakOffsetsVisibleColumn` will never be used because it contains injected text
			return new ModelLineProjectionData(injectionOffsets, injectionOptions, [lineText.length], [], 0);
		} else {
			return null;
		}
	}

	if (firstLineBreakColumn === -1) {
		const result: (ModelLineProjectionData | null)[] = [];
		for (let i = 0, len = requests.length; i < len; i++) {
			result[i] = createEmptyLineBreakWithPossiblyInjectedText(i);
		}
		return result;
	}

	const overallWidth = Math.round(firstLineBreakColumn * fontInfo.typicalHalfwidthCharacterWidth);
	const additionalIndent = (wrappingIndent === WrappingIndent.DeepIndent ? 2 : wrappingIndent === WrappingIndent.Indent ? 1 : 0);
	const additionalIndentSize = Math.round(tabSize * additionalIndent);
	const additionalIndentLength = Math.ceil(fontInfo.spaceWidth * additionalIndentSize);

	const containerDomNode = document.createElement('div');
	applyFontInfo(containerDomNode, fontInfo);

	const sb = new StringBuilder(10000);
	const firstNonWhitespaceIndices: number[] = [];
	const wrappedTextIndentLengths: number[] = [];
	const renderLineContents: string[] = [];
	const allCharOffsets: number[][] = [];
	const allVisibleColumns: number[][] = [];
	for (let i = 0; i < requests.length; i++) {
		const lineContent = LineInjectedText.applyInjectedText(requests[i], injectedTextsPerLine[i]);

		let firstNonWhitespaceIndex = 0;
		let wrappedTextIndentLength = 0;
		let width = overallWidth;

		if (wrappingIndent !== WrappingIndent.None) {
			firstNonWhitespaceIndex = strings.firstNonWhitespaceIndex(lineContent);
			if (firstNonWhitespaceIndex === -1) {
				// all whitespace line
				firstNonWhitespaceIndex = 0;

			} else {
				// Track existing indent

				for (let i = 0; i < firstNonWhitespaceIndex; i++) {
					const charWidth = (
						lineContent.charCodeAt(i) === CharCode.Tab
							? (tabSize - (wrappedTextIndentLength % tabSize))
							: 1
					);
					wrappedTextIndentLength += charWidth;
				}

				const indentWidth = Math.ceil(fontInfo.spaceWidth * wrappedTextIndentLength);

				// Force sticking to beginning of line if no character would fit except for the indentation
				if (indentWidth + fontInfo.typicalFullwidthCharacterWidth > overallWidth) {
					firstNonWhitespaceIndex = 0;
					wrappedTextIndentLength = 0;
				} else {
					width = overallWidth - indentWidth;
				}
			}
		}

		const renderLineContent = lineContent.substr(firstNonWhitespaceIndex);
		const tmp = renderLine(renderLineContent, wrappedTextIndentLength, tabSize, width, sb, additionalIndentLength);
		firstNonWhitespaceIndices[i] = firstNonWhitespaceIndex;
		wrappedTextIndentLengths[i] = wrappedTextIndentLength;
		renderLineContents[i] = renderLineContent;
		allCharOffsets[i] = tmp[0];
		allVisibleColumns[i] = tmp[1];
	}
	const html = sb.build();
	const trustedhtml = ttPolicy?.createHTML(html) ?? html;
	containerDomNode.innerHTML = trustedhtml as string;

	containerDomNode.style.position = 'absolute';
	containerDomNode.style.top = '10000px';
	if (wordBreak === 'keepAll') {
		// word-break: keep-all; overflow-wrap: anywhere
		containerDomNode.style.wordBreak = 'keep-all';
		containerDomNode.style.overflowWrap = 'anywhere';
	} else {
		// overflow-wrap: break-word
		containerDomNode.style.wordBreak = 'inherit';
		containerDomNode.style.overflowWrap = 'break-word';
	}
	targetWindow.document.body.appendChild(containerDomNode);

	const range = document.createRange();
	const lineDomNodes = Array.prototype.slice.call(containerDomNode.children, 0);

	const result: (ModelLineProjectionData | null)[] = [];
	for (let i = 0; i < requests.length; i++) {
		const lineDomNode = lineDomNodes[i];
		const breakOffsets: number[] | null = readLineBreaks(range, lineDomNode, renderLineContents[i], allCharOffsets[i]);
		if (breakOffsets === null) {
			result[i] = createEmptyLineBreakWithPossiblyInjectedText(i);
			continue;
		}

		const firstNonWhitespaceIndex = firstNonWhitespaceIndices[i];
		const wrappedTextIndentLength = wrappedTextIndentLengths[i] + additionalIndentSize;
		const visibleColumns = allVisibleColumns[i];

		const breakOffsetsVisibleColumn: number[] = [];
		for (let j = 0, len = breakOffsets.length; j < len; j++) {
			breakOffsetsVisibleColumn[j] = visibleColumns[breakOffsets[j]];
		}

		if (firstNonWhitespaceIndex !== 0) {
			// All break offsets are relative to the renderLineContent, make them absolute again
			for (let j = 0, len = breakOffsets.length; j < len; j++) {
				breakOffsets[j] += firstNonWhitespaceIndex;
			}
		}

		let injectionOptions: InjectedTextOptions[] | null;
		let injectionOffsets: number[] | null;
		const curInjectedTexts = injectedTextsPerLine[i];
		if (curInjectedTexts) {
			injectionOptions = curInjectedTexts.map(t => t.options);
			injectionOffsets = curInjectedTexts.map(text => text.column - 1);
		} else {
			injectionOptions = null;
			injectionOffsets = null;
		}

		result[i] = new ModelLineProjectionData(injectionOffsets, injectionOptions, breakOffsets, breakOffsetsVisibleColumn, wrappedTextIndentLength);
	}

	containerDomNode.remove();
	return result;
}

const enum Constants {
	SPAN_MODULO_LIMIT = 16384
}

function renderLine(lineContent: string, initialVisibleColumn: number, tabSize: number, width: number, sb: StringBuilder, wrappingIndentLength: number): [number[], number[]] {

	if (wrappingIndentLength !== 0) {
		const hangingOffset = String(wrappingIndentLength);
		sb.appendString('<div style="text-indent: -');
		sb.appendString(hangingOffset);
		sb.appendString('px; padding-left: ');
		sb.appendString(hangingOffset);
		sb.appendString('px; box-sizing: border-box; width:');
	} else {
		sb.appendString('<div style="width:');
	}
	sb.appendString(String(width));
	sb.appendString('px;">');
	// if (containsRTL) {
	// 	sb.appendASCIIString('" dir="ltr');
	// }

	const len = lineContent.length;
	let visibleColumn = initialVisibleColumn;
	let charOffset = 0;
	const charOffsets: number[] = [];
	const visibleColumns: number[] = [];
	let nextCharCode = (0 < len ? lineContent.charCodeAt(0) : CharCode.Null);

	sb.appendString('<span>');
	for (let charIndex = 0; charIndex < len; charIndex++) {
		if (charIndex !== 0 && charIndex % Constants.SPAN_MODULO_LIMIT === 0) {
			sb.appendString('</span><span>');
		}
		charOffsets[charIndex] = charOffset;
		visibleColumns[charIndex] = visibleColumn;
		const charCode = nextCharCode;
		nextCharCode = (charIndex + 1 < len ? lineContent.charCodeAt(charIndex + 1) : CharCode.Null);
		let producedCharacters = 1;
		let charWidth = 1;
		switch (charCode) {
			case CharCode.Tab:
				producedCharacters = (tabSize - (visibleColumn % tabSize));
				charWidth = producedCharacters;
				for (let space = 1; space <= producedCharacters; space++) {
					if (space < producedCharacters) {
						sb.appendCharCode(0xA0); // &nbsp;
					} else {
						sb.appendASCIICharCode(CharCode.Space);
					}
				}
				break;

			case CharCode.Space:
				if (nextCharCode === CharCode.Space) {
					sb.appendCharCode(0xA0); // &nbsp;
				} else {
					sb.appendASCIICharCode(CharCode.Space);
				}
				break;

			case CharCode.LessThan:
				sb.appendString('&lt;');
				break;

			case CharCode.GreaterThan:
				sb.appendString('&gt;');
				break;

			case CharCode.Ampersand:
				sb.appendString('&amp;');
				break;

			case CharCode.Null:
				sb.appendString('&#00;');
				break;

			case CharCode.UTF8_BOM:
			case CharCode.LINE_SEPARATOR:
			case CharCode.PARAGRAPH_SEPARATOR:
			case CharCode.NEXT_LINE:
				sb.appendCharCode(0xFFFD);
				break;

			default:
				if (strings.isFullWidthCharacter(charCode)) {
					charWidth++;
				}
				if (charCode < 32) {
					sb.appendCharCode(9216 + charCode);
				} else {
					sb.appendCharCode(charCode);
				}
		}

		charOffset += producedCharacters;
		visibleColumn += charWidth;
	}
	sb.appendString('</span>');

	charOffsets[lineContent.length] = charOffset;
	visibleColumns[lineContent.length] = visibleColumn;

	sb.appendString('</div>');

	return [charOffsets, visibleColumns];
}

function readLineBreaks(range: Range, lineDomNode: HTMLDivElement, lineContent: string, charOffsets: number[]): number[] | null {
	if (lineContent.length <= 1) {
		return null;
	}
	const spans = <HTMLSpanElement[]>Array.prototype.slice.call(lineDomNode.children, 0);

	const breakOffsets: number[] = [];
	try {
		discoverBreaks(range, spans, charOffsets, 0, null, lineContent.length - 1, null, breakOffsets);
	} catch (err) {
		console.log(err);
		return null;
	}

	if (breakOffsets.length === 0) {
		return null;
	}

	breakOffsets.push(lineContent.length);
	return breakOffsets;
}

function discoverBreaks(range: Range, spans: HTMLSpanElement[], charOffsets: number[], low: number, lowRects: DOMRectList | null, high: number, highRects: DOMRectList | null, result: number[]): void {
	if (low === high) {
		return;
	}

	lowRects = lowRects || readClientRect(range, spans, charOffsets[low], charOffsets[low + 1]);
	highRects = highRects || readClientRect(range, spans, charOffsets[high], charOffsets[high + 1]);

	if (Math.abs(lowRects[0].top - highRects[0].top) <= 0.1) {
		// same line
		return;
	}

	// there is at least one line break between these two offsets
	if (low + 1 === high) {
		// the two characters are adjacent, so the line break must be exactly between them
		result.push(high);
		return;
	}

	const mid = low + ((high - low) / 2) | 0;
	const midRects = readClientRect(range, spans, charOffsets[mid], charOffsets[mid + 1]);
	discoverBreaks(range, spans, charOffsets, low, lowRects, mid, midRects, result);
	discoverBreaks(range, spans, charOffsets, mid, midRects, high, highRects, result);
}

function readClientRect(range: Range, spans: HTMLSpanElement[], startOffset: number, endOffset: number): DOMRectList {
	range.setStart(spans[(startOffset / Constants.SPAN_MODULO_LIMIT) | 0].firstChild!, startOffset % Constants.SPAN_MODULO_LIMIT);
	range.setEnd(spans[(endOffset / Constants.SPAN_MODULO_LIMIT) | 0].firstChild!, endOffset % Constants.SPAN_MODULO_LIMIT);
	return range.getClientRects();
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/view/dynamicViewOverlay.ts]---
Location: vscode-main/src/vs/editor/browser/view/dynamicViewOverlay.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RenderingContext } from './renderingContext.js';
import { ViewEventHandler } from '../../common/viewEventHandler.js';

export abstract class DynamicViewOverlay extends ViewEventHandler {

	public abstract prepareRender(ctx: RenderingContext): void;

	public abstract render(startLineNumber: number, lineNumber: number): string;

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/view/renderingContext.ts]---
Location: vscode-main/src/vs/editor/browser/view/renderingContext.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Position } from '../../common/core/position.js';
import { Range } from '../../common/core/range.js';
import { ViewportData } from '../../common/viewLayout/viewLinesViewportData.js';
import { IViewLayout } from '../../common/viewModel.js';
import { ViewModelDecoration } from '../../common/viewModel/viewModelDecoration.js';

export interface IViewLines {
	linesVisibleRangesForRange(range: Range, includeNewLines: boolean): LineVisibleRanges[] | null;
	visibleRangeForPosition(position: Position): HorizontalPosition | null;
}

export abstract class RestrictedRenderingContext {
	_restrictedRenderingContextBrand: void = undefined;

	public readonly viewportData: ViewportData;

	public readonly scrollWidth: number;
	public readonly scrollHeight: number;

	public readonly visibleRange: Range;
	public readonly bigNumbersDelta: number;

	public readonly scrollTop: number;
	public readonly scrollLeft: number;

	public readonly viewportWidth: number;
	public readonly viewportHeight: number;

	private readonly _viewLayout: IViewLayout;

	constructor(viewLayout: IViewLayout, viewportData: ViewportData) {
		this._viewLayout = viewLayout;
		this.viewportData = viewportData;

		this.scrollWidth = this._viewLayout.getScrollWidth();
		this.scrollHeight = this._viewLayout.getScrollHeight();

		this.visibleRange = this.viewportData.visibleRange;
		this.bigNumbersDelta = this.viewportData.bigNumbersDelta;

		const vInfo = this._viewLayout.getCurrentViewport();
		this.scrollTop = vInfo.top;
		this.scrollLeft = vInfo.left;
		this.viewportWidth = vInfo.width;
		this.viewportHeight = vInfo.height;
	}

	public getScrolledTopFromAbsoluteTop(absoluteTop: number): number {
		return absoluteTop - this.scrollTop;
	}

	public getVerticalOffsetForLineNumber(lineNumber: number, includeViewZones?: boolean): number {
		return this._viewLayout.getVerticalOffsetForLineNumber(lineNumber, includeViewZones);
	}

	public getVerticalOffsetAfterLineNumber(lineNumber: number, includeViewZones?: boolean): number {
		return this._viewLayout.getVerticalOffsetAfterLineNumber(lineNumber, includeViewZones);
	}

	public getLineHeightForLineNumber(lineNumber: number): number {
		return this._viewLayout.getLineHeightForLineNumber(lineNumber);
	}

	public getDecorationsInViewport(): ViewModelDecoration[] {
		return this.viewportData.getDecorationsInViewport();
	}

}

export class RenderingContext extends RestrictedRenderingContext {
	_renderingContextBrand: void = undefined;

	private readonly _viewLines: IViewLines;
	private readonly _viewLinesGpu?: IViewLines;

	constructor(viewLayout: IViewLayout, viewportData: ViewportData, viewLines: IViewLines, viewLinesGpu?: IViewLines) {
		super(viewLayout, viewportData);
		this._viewLines = viewLines;
		this._viewLinesGpu = viewLinesGpu;
	}

	public linesVisibleRangesForRange(range: Range, includeNewLines: boolean): LineVisibleRanges[] | null {
		const domRanges = this._viewLines.linesVisibleRangesForRange(range, includeNewLines);
		if (!this._viewLinesGpu) {
			return domRanges;
		}
		const gpuRanges = this._viewLinesGpu.linesVisibleRangesForRange(range, includeNewLines);
		if (!domRanges) {
			return gpuRanges;
		}
		if (!gpuRanges) {
			return domRanges;
		}
		return domRanges.concat(gpuRanges).sort((a, b) => a.lineNumber - b.lineNumber);
	}

	public visibleRangeForPosition(position: Position): HorizontalPosition | null {
		return this._viewLines.visibleRangeForPosition(position) ?? this._viewLinesGpu?.visibleRangeForPosition(position) ?? null;
	}
}

export class LineVisibleRanges {
	/**
	 * Returns the element with the smallest `lineNumber`.
	 */
	public static firstLine(ranges: LineVisibleRanges[] | null): LineVisibleRanges | null {
		if (!ranges) {
			return null;
		}
		let result: LineVisibleRanges | null = null;
		for (const range of ranges) {
			if (!result || range.lineNumber < result.lineNumber) {
				result = range;
			}
		}
		return result;
	}

	/**
	 * Returns the element with the largest `lineNumber`.
	 */
	public static lastLine(ranges: LineVisibleRanges[] | null): LineVisibleRanges | null {
		if (!ranges) {
			return null;
		}
		let result: LineVisibleRanges | null = null;
		for (const range of ranges) {
			if (!result || range.lineNumber > result.lineNumber) {
				result = range;
			}
		}
		return result;
	}

	constructor(
		public readonly outsideRenderedLine: boolean,
		public readonly lineNumber: number,
		public readonly ranges: HorizontalRange[],
		/**
		 * Indicates if the requested range does not end in this line, but continues on the next line.
		 */
		public readonly continuesOnNextLine: boolean,
	) { }
}

export class HorizontalRange {
	_horizontalRangeBrand: void = undefined;

	public left: number;
	public width: number;

	public static from(ranges: FloatHorizontalRange[]): HorizontalRange[] {
		const result = new Array(ranges.length);
		for (let i = 0, len = ranges.length; i < len; i++) {
			const range = ranges[i];
			result[i] = new HorizontalRange(range.left, range.width);
		}
		return result;
	}

	constructor(left: number, width: number) {
		this.left = Math.round(left);
		this.width = Math.round(width);
	}

	public toString(): string {
		return `[${this.left},${this.width}]`;
	}
}

export class FloatHorizontalRange {
	_floatHorizontalRangeBrand: void = undefined;

	public left: number;
	public width: number;

	constructor(left: number, width: number) {
		this.left = left;
		this.width = width;
	}

	public toString(): string {
		return `[${this.left},${this.width}]`;
	}

	public static compare(a: FloatHorizontalRange, b: FloatHorizontalRange): number {
		return a.left - b.left;
	}
}

export class HorizontalPosition {
	public outsideRenderedLine: boolean;
	/**
	 * Math.round(this.originalLeft)
	 */
	public left: number;
	public originalLeft: number;

	constructor(outsideRenderedLine: boolean, left: number) {
		this.outsideRenderedLine = outsideRenderedLine;
		this.originalLeft = left;
		this.left = Math.round(this.originalLeft);
	}
}

export class VisibleRanges {
	constructor(
		public readonly outsideRenderedLine: boolean,
		public readonly ranges: FloatHorizontalRange[]
	) {
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/view/viewController.ts]---
Location: vscode-main/src/vs/editor/browser/view/viewController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IKeyboardEvent } from '../../../base/browser/keyboardEvent.js';
import { CoreNavigationCommands, NavigationCommandRevealType } from '../coreCommands.js';
import { IEditorMouseEvent, IPartialEditorMouseEvent } from '../editorBrowser.js';
import { ViewUserInputEvents } from './viewUserInputEvents.js';
import { Position } from '../../common/core/position.js';
import { Selection } from '../../common/core/selection.js';
import { IEditorConfiguration } from '../../common/config/editorConfiguration.js';
import { IViewModel } from '../../common/viewModel.js';
import { IMouseWheelEvent } from '../../../base/browser/mouseEvent.js';
import { EditorOption } from '../../common/config/editorOptions.js';
import * as platform from '../../../base/common/platform.js';

export interface IMouseDispatchData {
	position: Position;
	/**
	 * Desired mouse column (e.g. when position.column gets clamped to text length -- clicking after text on a line).
	 */
	mouseColumn: number;
	revealType: NavigationCommandRevealType;
	startedOnLineNumbers: boolean;

	inSelectionMode: boolean;
	mouseDownCount: number;
	altKey: boolean;
	ctrlKey: boolean;
	metaKey: boolean;
	shiftKey: boolean;

	leftButton: boolean;
	middleButton: boolean;
	onInjectedText: boolean;
}

export interface ICommandDelegate {
	paste(text: string, pasteOnNewLine: boolean, multicursorText: string[] | null, mode: string | null): void;
	type(text: string): void;
	compositionType(text: string, replacePrevCharCnt: number, replaceNextCharCnt: number, positionDelta: number): void;
	startComposition(): void;
	endComposition(): void;
	cut(): void;
}

export class ViewController {

	private readonly configuration: IEditorConfiguration;
	private readonly viewModel: IViewModel;
	private readonly userInputEvents: ViewUserInputEvents;
	private readonly commandDelegate: ICommandDelegate;

	constructor(
		configuration: IEditorConfiguration,
		viewModel: IViewModel,
		userInputEvents: ViewUserInputEvents,
		commandDelegate: ICommandDelegate
	) {
		this.configuration = configuration;
		this.viewModel = viewModel;
		this.userInputEvents = userInputEvents;
		this.commandDelegate = commandDelegate;
	}

	public paste(text: string, pasteOnNewLine: boolean, multicursorText: string[] | null, mode: string | null): void {
		this.commandDelegate.paste(text, pasteOnNewLine, multicursorText, mode);
	}

	public type(text: string): void {
		this.commandDelegate.type(text);
	}

	public compositionType(text: string, replacePrevCharCnt: number, replaceNextCharCnt: number, positionDelta: number): void {
		this.commandDelegate.compositionType(text, replacePrevCharCnt, replaceNextCharCnt, positionDelta);
	}

	public compositionStart(): void {
		this.commandDelegate.startComposition();
	}

	public compositionEnd(): void {
		this.commandDelegate.endComposition();
	}

	public cut(): void {
		this.commandDelegate.cut();
	}

	public setSelection(modelSelection: Selection): void {
		CoreNavigationCommands.SetSelection.runCoreEditorCommand(this.viewModel, {
			source: 'keyboard',
			selection: modelSelection
		});
	}

	private _validateViewColumn(viewPosition: Position): Position {
		const minColumn = this.viewModel.getLineMinColumn(viewPosition.lineNumber);
		if (viewPosition.column < minColumn) {
			return new Position(viewPosition.lineNumber, minColumn);
		}
		return viewPosition;
	}

	private _hasMulticursorModifier(data: IMouseDispatchData): boolean {
		switch (this.configuration.options.get(EditorOption.multiCursorModifier)) {
			case 'altKey':
				return data.altKey;
			case 'ctrlKey':
				return data.ctrlKey;
			case 'metaKey':
				return data.metaKey;
			default:
				return false;
		}
	}

	private _hasNonMulticursorModifier(data: IMouseDispatchData): boolean {
		switch (this.configuration.options.get(EditorOption.multiCursorModifier)) {
			case 'altKey':
				return data.ctrlKey || data.metaKey;
			case 'ctrlKey':
				return data.altKey || data.metaKey;
			case 'metaKey':
				return data.ctrlKey || data.altKey;
			default:
				return false;
		}
	}

	public dispatchMouse(data: IMouseDispatchData): void {
		const options = this.configuration.options;
		const selectionClipboardIsOn = (platform.isLinux && options.get(EditorOption.selectionClipboard));
		const columnSelection = options.get(EditorOption.columnSelection);
		const scrollOnMiddleClick = options.get(EditorOption.scrollOnMiddleClick);
		if (data.middleButton && !selectionClipboardIsOn) {
			if (scrollOnMiddleClick) {
				// nothing to do here, handled in the contribution
			} else {
				this._columnSelect(data.position, data.mouseColumn, data.inSelectionMode);
			}
		} else if (data.startedOnLineNumbers) {
			// If the dragging started on the gutter, then have operations work on the entire line
			if (this._hasMulticursorModifier(data)) {
				if (data.inSelectionMode) {
					this._lastCursorLineSelect(data.position, data.revealType);
				} else {
					this._createCursor(data.position, true);
				}
			} else {
				if (data.inSelectionMode) {
					this._lineSelectDrag(data.position, data.revealType);
				} else {
					this._lineSelect(data.position, data.revealType);
				}
			}
		} else if (data.mouseDownCount >= 4) {
			this._selectAll();
		} else if (data.mouseDownCount === 3) {
			if (this._hasMulticursorModifier(data)) {
				if (data.inSelectionMode) {
					this._lastCursorLineSelectDrag(data.position, data.revealType);
				} else {
					this._lastCursorLineSelect(data.position, data.revealType);
				}
			} else {
				if (data.inSelectionMode) {
					this._lineSelectDrag(data.position, data.revealType);
				} else {
					this._lineSelect(data.position, data.revealType);
				}
			}
		} else if (data.mouseDownCount === 2) {
			if (!data.onInjectedText) {
				if (this._hasMulticursorModifier(data)) {
					this._lastCursorWordSelect(data.position, data.revealType);
				} else {
					if (data.inSelectionMode) {
						this._wordSelectDrag(data.position, data.revealType);
					} else {
						this._wordSelect(data.position, data.revealType);
					}
				}
			}
		} else {
			if (this._hasMulticursorModifier(data)) {
				if (!this._hasNonMulticursorModifier(data)) {
					if (data.shiftKey) {
						this._columnSelect(data.position, data.mouseColumn, true);
					} else {
						// Do multi-cursor operations only when purely alt is pressed
						if (data.inSelectionMode) {
							this._lastCursorMoveToSelect(data.position, data.revealType);
						} else {
							this._createCursor(data.position, false);
						}
					}
				}
			} else {
				if (data.inSelectionMode) {
					if (data.altKey) {
						this._columnSelect(data.position, data.mouseColumn, true);
					} else {
						if (columnSelection) {
							this._columnSelect(data.position, data.mouseColumn, true);
						} else {
							this._moveToSelect(data.position, data.revealType);
						}
					}
				} else {
					this.moveTo(data.position, data.revealType);
				}
			}
		}
	}

	private _usualArgs(viewPosition: Position, revealType: NavigationCommandRevealType): CoreNavigationCommands.MoveCommandOptions {
		viewPosition = this._validateViewColumn(viewPosition);
		return {
			source: 'mouse',
			position: this._convertViewToModelPosition(viewPosition),
			viewPosition,
			revealType
		};
	}

	public moveTo(viewPosition: Position, revealType: NavigationCommandRevealType): void {
		CoreNavigationCommands.MoveTo.runCoreEditorCommand(this.viewModel, this._usualArgs(viewPosition, revealType));
	}

	private _moveToSelect(viewPosition: Position, revealType: NavigationCommandRevealType): void {
		CoreNavigationCommands.MoveToSelect.runCoreEditorCommand(this.viewModel, this._usualArgs(viewPosition, revealType));
	}

	private _columnSelect(viewPosition: Position, mouseColumn: number, doColumnSelect: boolean): void {
		viewPosition = this._validateViewColumn(viewPosition);
		CoreNavigationCommands.ColumnSelect.runCoreEditorCommand(this.viewModel, {
			source: 'mouse',
			position: this._convertViewToModelPosition(viewPosition),
			viewPosition: viewPosition,
			mouseColumn: mouseColumn,
			doColumnSelect: doColumnSelect
		});
	}

	private _createCursor(viewPosition: Position, wholeLine: boolean): void {
		viewPosition = this._validateViewColumn(viewPosition);
		CoreNavigationCommands.CreateCursor.runCoreEditorCommand(this.viewModel, {
			source: 'mouse',
			position: this._convertViewToModelPosition(viewPosition),
			viewPosition: viewPosition,
			wholeLine: wholeLine
		});
	}

	private _lastCursorMoveToSelect(viewPosition: Position, revealType: NavigationCommandRevealType): void {
		CoreNavigationCommands.LastCursorMoveToSelect.runCoreEditorCommand(this.viewModel, this._usualArgs(viewPosition, revealType));
	}

	private _wordSelect(viewPosition: Position, revealType: NavigationCommandRevealType): void {
		CoreNavigationCommands.WordSelect.runCoreEditorCommand(this.viewModel, this._usualArgs(viewPosition, revealType));
	}

	private _wordSelectDrag(viewPosition: Position, revealType: NavigationCommandRevealType): void {
		CoreNavigationCommands.WordSelectDrag.runCoreEditorCommand(this.viewModel, this._usualArgs(viewPosition, revealType));
	}

	private _lastCursorWordSelect(viewPosition: Position, revealType: NavigationCommandRevealType): void {
		CoreNavigationCommands.LastCursorWordSelect.runCoreEditorCommand(this.viewModel, this._usualArgs(viewPosition, revealType));
	}

	private _lineSelect(viewPosition: Position, revealType: NavigationCommandRevealType): void {
		CoreNavigationCommands.LineSelect.runCoreEditorCommand(this.viewModel, this._usualArgs(viewPosition, revealType));
	}

	private _lineSelectDrag(viewPosition: Position, revealType: NavigationCommandRevealType): void {
		CoreNavigationCommands.LineSelectDrag.runCoreEditorCommand(this.viewModel, this._usualArgs(viewPosition, revealType));
	}

	private _lastCursorLineSelect(viewPosition: Position, revealType: NavigationCommandRevealType): void {
		CoreNavigationCommands.LastCursorLineSelect.runCoreEditorCommand(this.viewModel, this._usualArgs(viewPosition, revealType));
	}

	private _lastCursorLineSelectDrag(viewPosition: Position, revealType: NavigationCommandRevealType): void {
		CoreNavigationCommands.LastCursorLineSelectDrag.runCoreEditorCommand(this.viewModel, this._usualArgs(viewPosition, revealType));
	}

	private _selectAll(): void {
		CoreNavigationCommands.SelectAll.runCoreEditorCommand(this.viewModel, { source: 'mouse' });
	}

	// ----------------------

	private _convertViewToModelPosition(viewPosition: Position): Position {
		return this.viewModel.coordinatesConverter.convertViewPositionToModelPosition(viewPosition);
	}

	public emitKeyDown(e: IKeyboardEvent): void {
		this.userInputEvents.emitKeyDown(e);
	}

	public emitKeyUp(e: IKeyboardEvent): void {
		this.userInputEvents.emitKeyUp(e);
	}

	public emitContextMenu(e: IEditorMouseEvent): void {
		this.userInputEvents.emitContextMenu(e);
	}

	public emitMouseMove(e: IEditorMouseEvent): void {
		this.userInputEvents.emitMouseMove(e);
	}

	public emitMouseLeave(e: IPartialEditorMouseEvent): void {
		this.userInputEvents.emitMouseLeave(e);
	}

	public emitMouseUp(e: IEditorMouseEvent): void {
		this.userInputEvents.emitMouseUp(e);
	}

	public emitMouseDown(e: IEditorMouseEvent): void {
		this.userInputEvents.emitMouseDown(e);
	}

	public emitMouseDrag(e: IEditorMouseEvent): void {
		this.userInputEvents.emitMouseDrag(e);
	}

	public emitMouseDrop(e: IPartialEditorMouseEvent): void {
		this.userInputEvents.emitMouseDrop(e);
	}

	public emitMouseDropCanceled(): void {
		this.userInputEvents.emitMouseDropCanceled();
	}

	public emitMouseWheel(e: IMouseWheelEvent): void {
		this.userInputEvents.emitMouseWheel(e);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/view/viewLayer.ts]---
Location: vscode-main/src/vs/editor/browser/view/viewLayer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FastDomNode, createFastDomNode } from '../../../base/browser/fastDomNode.js';
import { createTrustedTypesPolicy } from '../../../base/browser/trustedTypes.js';
import { BugIndicatingError } from '../../../base/common/errors.js';
import { EditorOption } from '../../common/config/editorOptions.js';
import { StringBuilder } from '../../common/core/stringBuilder.js';
import * as viewEvents from '../../common/viewEvents.js';
import { ViewportData } from '../../common/viewLayout/viewLinesViewportData.js';
import { ViewContext } from '../../common/viewModel/viewContext.js';

/**
 * Represents a visible line
 */
export interface IVisibleLine extends ILine {
	getDomNode(): HTMLElement | null;
	setDomNode(domNode: HTMLElement): void;

	/**
	 * Return null if the HTML should not be touched.
	 * Return the new HTML otherwise.
	 */
	renderLine(lineNumber: number, deltaTop: number, lineHeight: number, viewportData: ViewportData, sb: StringBuilder): boolean;

	/**
	 * Layout the line.
	 */
	layoutLine(lineNumber: number, deltaTop: number, lineHeight: number): void;
}

export interface ILine {
	onContentChanged(): void;
	onTokensChanged(): void;
}

export interface ILineFactory<T extends ILine> {
	createLine(): T;
}

export class RenderedLinesCollection<T extends ILine> {
	private _lines!: T[];
	private _rendLineNumberStart!: number;

	constructor(
		private readonly _lineFactory: ILineFactory<T>,
	) {
		this._set(1, []);
	}

	public flush(): void {
		this._set(1, []);
	}

	_set(rendLineNumberStart: number, lines: T[]): void {
		this._lines = lines;
		this._rendLineNumberStart = rendLineNumberStart;
	}

	_get(): { rendLineNumberStart: number; lines: T[] } {
		return {
			rendLineNumberStart: this._rendLineNumberStart,
			lines: this._lines
		};
	}

	/**
	 * @returns Inclusive line number that is inside this collection
	 */
	public getStartLineNumber(): number {
		return this._rendLineNumberStart;
	}

	/**
	 * @returns Inclusive line number that is inside this collection
	 */
	public getEndLineNumber(): number {
		return this._rendLineNumberStart + this._lines.length - 1;
	}

	public getCount(): number {
		return this._lines.length;
	}

	public getLine(lineNumber: number): T {
		const lineIndex = lineNumber - this._rendLineNumberStart;
		if (lineIndex < 0 || lineIndex >= this._lines.length) {
			throw new BugIndicatingError('Illegal value for lineNumber');
		}
		return this._lines[lineIndex];
	}

	/**
	 * @returns Lines that were removed from this collection
	 */
	public onLinesDeleted(deleteFromLineNumber: number, deleteToLineNumber: number): T[] | null {
		if (this.getCount() === 0) {
			// no lines
			return null;
		}

		const startLineNumber = this.getStartLineNumber();
		const endLineNumber = this.getEndLineNumber();

		if (deleteToLineNumber < startLineNumber) {
			// deleting above the viewport
			const deleteCnt = deleteToLineNumber - deleteFromLineNumber + 1;
			this._rendLineNumberStart -= deleteCnt;
			return null;
		}

		if (deleteFromLineNumber > endLineNumber) {
			// deleted below the viewport
			return null;
		}

		// Record what needs to be deleted
		let deleteStartIndex = 0;
		let deleteCount = 0;
		for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
			const lineIndex = lineNumber - this._rendLineNumberStart;

			if (deleteFromLineNumber <= lineNumber && lineNumber <= deleteToLineNumber) {
				// this is a line to be deleted
				if (deleteCount === 0) {
					// this is the first line to be deleted
					deleteStartIndex = lineIndex;
					deleteCount = 1;
				} else {
					deleteCount++;
				}
			}
		}

		// Adjust this._rendLineNumberStart for lines deleted above
		if (deleteFromLineNumber < startLineNumber) {
			// Something was deleted above
			let deleteAboveCount = 0;

			if (deleteToLineNumber < startLineNumber) {
				// the entire deleted lines are above
				deleteAboveCount = deleteToLineNumber - deleteFromLineNumber + 1;
			} else {
				deleteAboveCount = startLineNumber - deleteFromLineNumber;
			}

			this._rendLineNumberStart -= deleteAboveCount;
		}

		const deleted = this._lines.splice(deleteStartIndex, deleteCount);
		return deleted;
	}

	public onLinesChanged(changeFromLineNumber: number, changeCount: number): boolean {
		const changeToLineNumber = changeFromLineNumber + changeCount - 1;
		if (this.getCount() === 0) {
			// no lines
			return false;
		}

		const startLineNumber = this.getStartLineNumber();
		const endLineNumber = this.getEndLineNumber();

		let someoneNotified = false;

		for (let changedLineNumber = changeFromLineNumber; changedLineNumber <= changeToLineNumber; changedLineNumber++) {
			if (changedLineNumber >= startLineNumber && changedLineNumber <= endLineNumber) {
				// Notify the line
				this._lines[changedLineNumber - this._rendLineNumberStart].onContentChanged();
				someoneNotified = true;
			}
		}

		return someoneNotified;
	}

	public onLinesInserted(insertFromLineNumber: number, insertToLineNumber: number): T[] | null {
		if (this.getCount() === 0) {
			// no lines
			return null;
		}

		const insertCnt = insertToLineNumber - insertFromLineNumber + 1;
		const startLineNumber = this.getStartLineNumber();
		const endLineNumber = this.getEndLineNumber();

		if (insertFromLineNumber <= startLineNumber) {
			// inserting above the viewport
			this._rendLineNumberStart += insertCnt;
			return null;
		}

		if (insertFromLineNumber > endLineNumber) {
			// inserting below the viewport
			return null;
		}

		if (insertCnt + insertFromLineNumber > endLineNumber) {
			// insert inside the viewport in such a way that all remaining lines are pushed outside
			const deleted = this._lines.splice(insertFromLineNumber - this._rendLineNumberStart, endLineNumber - insertFromLineNumber + 1);
			return deleted;
		}

		// insert inside the viewport, push out some lines, but not all remaining lines
		const newLines: T[] = [];
		for (let i = 0; i < insertCnt; i++) {
			newLines[i] = this._lineFactory.createLine();
		}
		const insertIndex = insertFromLineNumber - this._rendLineNumberStart;
		const beforeLines = this._lines.slice(0, insertIndex);
		const afterLines = this._lines.slice(insertIndex, this._lines.length - insertCnt);
		const deletedLines = this._lines.slice(this._lines.length - insertCnt, this._lines.length);

		this._lines = beforeLines.concat(newLines).concat(afterLines);

		return deletedLines;
	}

	public onTokensChanged(ranges: { fromLineNumber: number; toLineNumber: number }[]): boolean {
		if (this.getCount() === 0) {
			// no lines
			return false;
		}

		const startLineNumber = this.getStartLineNumber();
		const endLineNumber = this.getEndLineNumber();

		let notifiedSomeone = false;
		for (let i = 0, len = ranges.length; i < len; i++) {
			const rng = ranges[i];

			if (rng.toLineNumber < startLineNumber || rng.fromLineNumber > endLineNumber) {
				// range outside viewport
				continue;
			}

			const from = Math.max(startLineNumber, rng.fromLineNumber);
			const to = Math.min(endLineNumber, rng.toLineNumber);

			for (let lineNumber = from; lineNumber <= to; lineNumber++) {
				const lineIndex = lineNumber - this._rendLineNumberStart;
				this._lines[lineIndex].onTokensChanged();
				notifiedSomeone = true;
			}
		}

		return notifiedSomeone;
	}
}

export class VisibleLinesCollection<T extends IVisibleLine> {

	public readonly domNode: FastDomNode<HTMLElement>;
	private readonly _linesCollection: RenderedLinesCollection<T>;

	constructor(
		private readonly _viewContext: ViewContext,
		private readonly _lineFactory: ILineFactory<T>,
	) {
		this.domNode = this._createDomNode();
		this._linesCollection = new RenderedLinesCollection<T>(this._lineFactory);
	}

	private _createDomNode(): FastDomNode<HTMLElement> {
		const domNode = createFastDomNode(document.createElement('div'));
		domNode.setClassName('view-layer');
		domNode.setPosition('absolute');
		domNode.domNode.setAttribute('role', 'presentation');
		domNode.domNode.setAttribute('aria-hidden', 'true');
		return domNode;
	}

	// ---- begin view event handlers

	public onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		if (e.hasChanged(EditorOption.layoutInfo)) {
			return true;
		}
		return false;
	}

	public onFlushed(e: viewEvents.ViewFlushedEvent, flushDom?: boolean): boolean {
		// No need to clear the dom node because a full .innerHTML will occur in
		// ViewLayerRenderer._render, however the fallback mechanism in the
		// GPU renderer may cause this to be necessary as the .innerHTML call
		// may not happen depending on the new state, leaving stale DOM nodes
		// around.
		if (flushDom) {
			const start = this._linesCollection.getStartLineNumber();
			const end = this._linesCollection.getEndLineNumber();
			for (let i = start; i <= end; i++) {
				this._linesCollection.getLine(i).getDomNode()?.remove();
			}
		}
		this._linesCollection.flush();
		return true;
	}

	public onLinesChanged(e: viewEvents.ViewLinesChangedEvent): boolean {
		return this._linesCollection.onLinesChanged(e.fromLineNumber, e.count);
	}

	public onLinesDeleted(e: viewEvents.ViewLinesDeletedEvent): boolean {
		const deleted = this._linesCollection.onLinesDeleted(e.fromLineNumber, e.toLineNumber);
		if (deleted) {
			// Remove from DOM
			for (let i = 0, len = deleted.length; i < len; i++) {
				const lineDomNode = deleted[i].getDomNode();
				lineDomNode?.remove();
			}
		}

		return true;
	}

	public onLinesInserted(e: viewEvents.ViewLinesInsertedEvent): boolean {
		const deleted = this._linesCollection.onLinesInserted(e.fromLineNumber, e.toLineNumber);
		if (deleted) {
			// Remove from DOM
			for (let i = 0, len = deleted.length; i < len; i++) {
				const lineDomNode = deleted[i].getDomNode();
				lineDomNode?.remove();
			}
		}

		return true;
	}

	public onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean {
		return e.scrollTopChanged;
	}

	public onTokensChanged(e: viewEvents.ViewTokensChangedEvent): boolean {
		return this._linesCollection.onTokensChanged(e.ranges);
	}

	public onZonesChanged(e: viewEvents.ViewZonesChangedEvent): boolean {
		return true;
	}

	// ---- end view event handlers

	public getStartLineNumber(): number {
		return this._linesCollection.getStartLineNumber();
	}

	public getEndLineNumber(): number {
		return this._linesCollection.getEndLineNumber();
	}

	public getVisibleLine(lineNumber: number): T {
		return this._linesCollection.getLine(lineNumber);
	}

	public renderLines(viewportData: ViewportData): void {

		const inp = this._linesCollection._get();

		const renderer = new ViewLayerRenderer<T>(this.domNode.domNode, this._lineFactory, viewportData, this._viewContext);

		const ctx: IRendererContext<T> = {
			rendLineNumberStart: inp.rendLineNumberStart,
			lines: inp.lines,
			linesLength: inp.lines.length
		};

		// Decide if this render will do a single update (single large .innerHTML) or many updates (inserting/removing dom nodes)
		const resCtx = renderer.render(ctx, viewportData.startLineNumber, viewportData.endLineNumber, viewportData.relativeVerticalOffset);

		this._linesCollection._set(resCtx.rendLineNumberStart, resCtx.lines);
	}
}

interface IRendererContext<T extends IVisibleLine> {
	rendLineNumberStart: number;
	lines: T[];
	linesLength: number;
}

class ViewLayerRenderer<T extends IVisibleLine> {

	private static _ttPolicy = createTrustedTypesPolicy('editorViewLayer', { createHTML: value => value });

	constructor(
		private readonly _domNode: HTMLElement,
		private readonly _lineFactory: ILineFactory<T>,
		private readonly _viewportData: ViewportData,
		private readonly _viewContext: ViewContext
	) {
	}

	public render(inContext: IRendererContext<T>, startLineNumber: number, stopLineNumber: number, deltaTop: number[]): IRendererContext<T> {

		const ctx: IRendererContext<T> = {
			rendLineNumberStart: inContext.rendLineNumberStart,
			lines: inContext.lines.slice(0),
			linesLength: inContext.linesLength
		};

		if ((ctx.rendLineNumberStart + ctx.linesLength - 1 < startLineNumber) || (stopLineNumber < ctx.rendLineNumberStart)) {
			// There is no overlap whatsoever
			ctx.rendLineNumberStart = startLineNumber;
			ctx.linesLength = stopLineNumber - startLineNumber + 1;
			ctx.lines = [];
			for (let x = startLineNumber; x <= stopLineNumber; x++) {
				ctx.lines[x - startLineNumber] = this._lineFactory.createLine();
			}
			this._finishRendering(ctx, true, deltaTop);
			return ctx;
		}

		// Update lines which will remain untouched
		this._renderUntouchedLines(
			ctx,
			Math.max(startLineNumber - ctx.rendLineNumberStart, 0),
			Math.min(stopLineNumber - ctx.rendLineNumberStart, ctx.linesLength - 1),
			deltaTop,
			startLineNumber
		);

		if (ctx.rendLineNumberStart > startLineNumber) {
			// Insert lines before
			const fromLineNumber = startLineNumber;
			const toLineNumber = Math.min(stopLineNumber, ctx.rendLineNumberStart - 1);
			if (fromLineNumber <= toLineNumber) {
				this._insertLinesBefore(ctx, fromLineNumber, toLineNumber, deltaTop, startLineNumber);
				ctx.linesLength += toLineNumber - fromLineNumber + 1;
			}
		} else if (ctx.rendLineNumberStart < startLineNumber) {
			// Remove lines before
			const removeCnt = Math.min(ctx.linesLength, startLineNumber - ctx.rendLineNumberStart);
			if (removeCnt > 0) {
				this._removeLinesBefore(ctx, removeCnt);
				ctx.linesLength -= removeCnt;
			}
		}

		ctx.rendLineNumberStart = startLineNumber;

		if (ctx.rendLineNumberStart + ctx.linesLength - 1 < stopLineNumber) {
			// Insert lines after
			const fromLineNumber = ctx.rendLineNumberStart + ctx.linesLength;
			const toLineNumber = stopLineNumber;

			if (fromLineNumber <= toLineNumber) {
				this._insertLinesAfter(ctx, fromLineNumber, toLineNumber, deltaTop, startLineNumber);
				ctx.linesLength += toLineNumber - fromLineNumber + 1;
			}

		} else if (ctx.rendLineNumberStart + ctx.linesLength - 1 > stopLineNumber) {
			// Remove lines after
			const fromLineNumber = Math.max(0, stopLineNumber - ctx.rendLineNumberStart + 1);
			const toLineNumber = ctx.linesLength - 1;
			const removeCnt = toLineNumber - fromLineNumber + 1;

			if (removeCnt > 0) {
				this._removeLinesAfter(ctx, removeCnt);
				ctx.linesLength -= removeCnt;
			}
		}

		this._finishRendering(ctx, false, deltaTop);

		return ctx;
	}

	private _renderUntouchedLines(ctx: IRendererContext<T>, startIndex: number, endIndex: number, deltaTop: number[], deltaLN: number): void {
		const rendLineNumberStart = ctx.rendLineNumberStart;
		const lines = ctx.lines;

		for (let i = startIndex; i <= endIndex; i++) {
			const lineNumber = rendLineNumberStart + i;
			lines[i].layoutLine(lineNumber, deltaTop[lineNumber - deltaLN], this._lineHeightForLineNumber(lineNumber));
		}
	}

	private _insertLinesBefore(ctx: IRendererContext<T>, fromLineNumber: number, toLineNumber: number, deltaTop: number[], deltaLN: number): void {
		const newLines: T[] = [];
		let newLinesLen = 0;
		for (let lineNumber = fromLineNumber; lineNumber <= toLineNumber; lineNumber++) {
			newLines[newLinesLen++] = this._lineFactory.createLine();
		}
		ctx.lines = newLines.concat(ctx.lines);
	}

	private _removeLinesBefore(ctx: IRendererContext<T>, removeCount: number): void {
		for (let i = 0; i < removeCount; i++) {
			const lineDomNode = ctx.lines[i].getDomNode();
			lineDomNode?.remove();
		}
		ctx.lines.splice(0, removeCount);
	}

	private _insertLinesAfter(ctx: IRendererContext<T>, fromLineNumber: number, toLineNumber: number, deltaTop: number[], deltaLN: number): void {
		const newLines: T[] = [];
		let newLinesLen = 0;
		for (let lineNumber = fromLineNumber; lineNumber <= toLineNumber; lineNumber++) {
			newLines[newLinesLen++] = this._lineFactory.createLine();
		}
		ctx.lines = ctx.lines.concat(newLines);
	}

	private _removeLinesAfter(ctx: IRendererContext<T>, removeCount: number): void {
		const removeIndex = ctx.linesLength - removeCount;

		for (let i = 0; i < removeCount; i++) {
			const lineDomNode = ctx.lines[removeIndex + i].getDomNode();
			lineDomNode?.remove();
		}
		ctx.lines.splice(removeIndex, removeCount);
	}

	private _finishRenderingNewLines(ctx: IRendererContext<T>, domNodeIsEmpty: boolean, newLinesHTML: string | TrustedHTML, wasNew: boolean[]): void {
		if (ViewLayerRenderer._ttPolicy) {
			newLinesHTML = ViewLayerRenderer._ttPolicy.createHTML(newLinesHTML as string);
		}
		const lastChild = <HTMLElement>this._domNode.lastChild;
		if (domNodeIsEmpty || !lastChild) {
			this._domNode.innerHTML = newLinesHTML as string; // explains the ugly casts -> https://github.com/microsoft/vscode/issues/106396#issuecomment-692625393;
		} else {
			lastChild.insertAdjacentHTML('afterend', newLinesHTML as string);
		}

		let currChild = <HTMLElement>this._domNode.lastChild;
		for (let i = ctx.linesLength - 1; i >= 0; i--) {
			const line = ctx.lines[i];
			if (wasNew[i]) {
				line.setDomNode(currChild);
				currChild = <HTMLElement>currChild.previousSibling;
			}
		}
	}

	private _finishRenderingInvalidLines(ctx: IRendererContext<T>, invalidLinesHTML: string | TrustedHTML, wasInvalid: boolean[]): void {
		const hugeDomNode = document.createElement('div');

		if (ViewLayerRenderer._ttPolicy) {
			invalidLinesHTML = ViewLayerRenderer._ttPolicy.createHTML(invalidLinesHTML as string);
		}
		hugeDomNode.innerHTML = invalidLinesHTML as string;

		for (let i = 0; i < ctx.linesLength; i++) {
			const line = ctx.lines[i];
			if (wasInvalid[i]) {
				const source = <HTMLElement>hugeDomNode.firstChild;
				const lineDomNode = line.getDomNode()!;
				lineDomNode.replaceWith(source);
				line.setDomNode(source);
			}
		}
	}

	private static readonly _sb = new StringBuilder(100000);

	private _finishRendering(ctx: IRendererContext<T>, domNodeIsEmpty: boolean, deltaTop: number[]): void {

		const sb = ViewLayerRenderer._sb;
		const linesLength = ctx.linesLength;
		const lines = ctx.lines;
		const rendLineNumberStart = ctx.rendLineNumberStart;

		const wasNew: boolean[] = [];
		{
			sb.reset();
			let hadNewLine = false;

			for (let i = 0; i < linesLength; i++) {
				const line = lines[i];
				wasNew[i] = false;

				const lineDomNode = line.getDomNode();
				if (lineDomNode) {
					// line is not new
					continue;
				}

				const renderedLineNumber = i + rendLineNumberStart;
				const renderResult = line.renderLine(renderedLineNumber, deltaTop[i], this._lineHeightForLineNumber(renderedLineNumber), this._viewportData, sb);
				if (!renderResult) {
					// line does not need rendering
					continue;
				}

				wasNew[i] = true;
				hadNewLine = true;
			}

			if (hadNewLine) {
				this._finishRenderingNewLines(ctx, domNodeIsEmpty, sb.build(), wasNew);
			}
		}

		{
			sb.reset();

			let hadInvalidLine = false;
			const wasInvalid: boolean[] = [];

			for (let i = 0; i < linesLength; i++) {
				const line = lines[i];
				wasInvalid[i] = false;

				if (wasNew[i]) {
					// line was new
					continue;
				}

				const renderedLineNumber = i + rendLineNumberStart;
				const renderResult = line.renderLine(renderedLineNumber, deltaTop[i], this._lineHeightForLineNumber(renderedLineNumber), this._viewportData, sb);
				if (!renderResult) {
					// line does not need rendering
					continue;
				}

				wasInvalid[i] = true;
				hadInvalidLine = true;
			}

			if (hadInvalidLine) {
				this._finishRenderingInvalidLines(ctx, sb.build(), wasInvalid);
			}
		}
	}

	private _lineHeightForLineNumber(lineNumber: number): number {
		return this._viewContext.viewLayout.getLineHeightForLineNumber(lineNumber);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/view/viewOverlays.ts]---
Location: vscode-main/src/vs/editor/browser/view/viewOverlays.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FastDomNode, createFastDomNode } from '../../../base/browser/fastDomNode.js';
import { applyFontInfo } from '../config/domFontInfo.js';
import { DynamicViewOverlay } from './dynamicViewOverlay.js';
import { IVisibleLine, VisibleLinesCollection } from './viewLayer.js';
import { ViewPart } from './viewPart.js';
import { StringBuilder } from '../../common/core/stringBuilder.js';
import { RenderingContext, RestrictedRenderingContext } from './renderingContext.js';
import { ViewContext } from '../../common/viewModel/viewContext.js';
import * as viewEvents from '../../common/viewEvents.js';
import { ViewportData } from '../../common/viewLayout/viewLinesViewportData.js';
import { EditorOption } from '../../common/config/editorOptions.js';

export class ViewOverlays extends ViewPart {
	private readonly _visibleLines: VisibleLinesCollection<ViewOverlayLine>;
	protected readonly domNode: FastDomNode<HTMLElement>;
	private _dynamicOverlays: DynamicViewOverlay[] = [];
	private _isFocused: boolean = false;

	constructor(context: ViewContext) {
		super(context);

		this._visibleLines = new VisibleLinesCollection(this._context, {
			createLine: () => new ViewOverlayLine(this._dynamicOverlays)
		});
		this.domNode = this._visibleLines.domNode;

		const options = this._context.configuration.options;
		const fontInfo = options.get(EditorOption.fontInfo);
		applyFontInfo(this.domNode, fontInfo);

		this.domNode.setClassName('view-overlays');
	}

	public override shouldRender(): boolean {
		if (super.shouldRender()) {
			return true;
		}

		for (let i = 0, len = this._dynamicOverlays.length; i < len; i++) {
			const dynamicOverlay = this._dynamicOverlays[i];
			if (dynamicOverlay.shouldRender()) {
				return true;
			}
		}

		return false;
	}

	public override dispose(): void {
		super.dispose();

		for (let i = 0, len = this._dynamicOverlays.length; i < len; i++) {
			const dynamicOverlay = this._dynamicOverlays[i];
			dynamicOverlay.dispose();
		}
		this._dynamicOverlays = [];
	}

	public getDomNode(): FastDomNode<HTMLElement> {
		return this.domNode;
	}

	public addDynamicOverlay(overlay: DynamicViewOverlay): void {
		this._dynamicOverlays.push(overlay);
	}

	// ----- event handlers

	public override onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		this._visibleLines.onConfigurationChanged(e);

		const options = this._context.configuration.options;
		const fontInfo = options.get(EditorOption.fontInfo);
		applyFontInfo(this.domNode, fontInfo);

		return true;
	}
	public override onFlushed(e: viewEvents.ViewFlushedEvent): boolean {
		return this._visibleLines.onFlushed(e);
	}
	public override onFocusChanged(e: viewEvents.ViewFocusChangedEvent): boolean {
		this._isFocused = e.isFocused;
		return true;
	}
	public override onLinesChanged(e: viewEvents.ViewLinesChangedEvent): boolean {
		return this._visibleLines.onLinesChanged(e);
	}
	public override onLinesDeleted(e: viewEvents.ViewLinesDeletedEvent): boolean {
		return this._visibleLines.onLinesDeleted(e);
	}
	public override onLinesInserted(e: viewEvents.ViewLinesInsertedEvent): boolean {
		return this._visibleLines.onLinesInserted(e);
	}
	public override onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean {
		return this._visibleLines.onScrollChanged(e) || true;
	}
	public override onTokensChanged(e: viewEvents.ViewTokensChangedEvent): boolean {
		return this._visibleLines.onTokensChanged(e);
	}
	public override onZonesChanged(e: viewEvents.ViewZonesChangedEvent): boolean {
		return this._visibleLines.onZonesChanged(e);
	}

	// ----- end event handlers

	public prepareRender(ctx: RenderingContext): void {
		const toRender = this._dynamicOverlays.filter(overlay => overlay.shouldRender());

		for (let i = 0, len = toRender.length; i < len; i++) {
			const dynamicOverlay = toRender[i];
			dynamicOverlay.prepareRender(ctx);
			dynamicOverlay.onDidRender();
		}
	}

	public render(ctx: RestrictedRenderingContext): void {
		// Overwriting to bypass `shouldRender` flag
		this._viewOverlaysRender(ctx);

		this.domNode.toggleClassName('focused', this._isFocused);
	}

	_viewOverlaysRender(ctx: RestrictedRenderingContext): void {
		this._visibleLines.renderLines(ctx.viewportData);
	}
}

export class ViewOverlayLine implements IVisibleLine {

	private readonly _dynamicOverlays: DynamicViewOverlay[];
	private _domNode: FastDomNode<HTMLElement> | null;
	private _renderedContent: string | null;

	constructor(dynamicOverlays: DynamicViewOverlay[]) {
		this._dynamicOverlays = dynamicOverlays;

		this._domNode = null;
		this._renderedContent = null;
	}

	public getDomNode(): HTMLElement | null {
		if (!this._domNode) {
			return null;
		}
		return this._domNode.domNode;
	}
	public setDomNode(domNode: HTMLElement): void {
		this._domNode = createFastDomNode(domNode);
	}

	public onContentChanged(): void {
		// Nothing
	}
	public onTokensChanged(): void {
		// Nothing
	}

	public renderLine(lineNumber: number, deltaTop: number, lineHeight: number, viewportData: ViewportData, sb: StringBuilder): boolean {
		let result = '';
		for (let i = 0, len = this._dynamicOverlays.length; i < len; i++) {
			const dynamicOverlay = this._dynamicOverlays[i];
			result += dynamicOverlay.render(viewportData.startLineNumber, lineNumber);
		}

		if (this._renderedContent === result) {
			// No rendering needed
			return false;
		}

		this._renderedContent = result;

		sb.appendString('<div style="top:');
		sb.appendString(String(deltaTop));
		sb.appendString('px;height:');
		sb.appendString(String(lineHeight));
		sb.appendString('px;line-height:');
		sb.appendString(String(lineHeight));
		sb.appendString('px;">');
		sb.appendString(result);
		sb.appendString('</div>');

		return true;
	}

	public layoutLine(lineNumber: number, deltaTop: number, lineHeight: number): void {
		if (this._domNode) {
			this._domNode.setTop(deltaTop);
			this._domNode.setHeight(lineHeight);
			this._domNode.setLineHeight(lineHeight);
		}
	}
}

export class ContentViewOverlays extends ViewOverlays {

	private _contentWidth: number;

	constructor(context: ViewContext) {
		super(context);
		const options = this._context.configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);
		this._contentWidth = layoutInfo.contentWidth;

		this.domNode.setHeight(0);
	}

	// --- begin event handlers

	public override onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		const options = this._context.configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);
		this._contentWidth = layoutInfo.contentWidth;
		return super.onConfigurationChanged(e) || true;
	}
	public override onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean {
		return super.onScrollChanged(e) || e.scrollWidthChanged;
	}

	// --- end event handlers

	override _viewOverlaysRender(ctx: RestrictedRenderingContext): void {
		super._viewOverlaysRender(ctx);

		this.domNode.setWidth(Math.max(ctx.scrollWidth, this._contentWidth));
	}
}

export class MarginViewOverlays extends ViewOverlays {

	private _contentLeft: number;

	constructor(context: ViewContext) {
		super(context);

		const options = this._context.configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);
		this._contentLeft = layoutInfo.contentLeft;

		this.domNode.setClassName('margin-view-overlays');
		this.domNode.setWidth(1);

		applyFontInfo(this.domNode, options.get(EditorOption.fontInfo));
	}

	public override onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		const options = this._context.configuration.options;
		applyFontInfo(this.domNode, options.get(EditorOption.fontInfo));
		const layoutInfo = options.get(EditorOption.layoutInfo);
		this._contentLeft = layoutInfo.contentLeft;
		return super.onConfigurationChanged(e) || true;
	}

	public override onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean {
		return super.onScrollChanged(e) || e.scrollHeightChanged;
	}

	override _viewOverlaysRender(ctx: RestrictedRenderingContext): void {
		super._viewOverlaysRender(ctx);
		const height = Math.min(ctx.scrollHeight, 1000000);
		this.domNode.setHeight(height);
		this.domNode.setWidth(this._contentLeft);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/view/viewPart.ts]---
Location: vscode-main/src/vs/editor/browser/view/viewPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FastDomNode } from '../../../base/browser/fastDomNode.js';
import { RenderingContext, RestrictedRenderingContext } from './renderingContext.js';
import { ViewContext } from '../../common/viewModel/viewContext.js';
import { ViewEventHandler } from '../../common/viewEventHandler.js';

export abstract class ViewPart extends ViewEventHandler {

	_context: ViewContext;

	constructor(context: ViewContext) {
		super();
		this._context = context;
		this._context.addEventHandler(this);
	}

	public override dispose(): void {
		this._context.removeEventHandler(this);
		super.dispose();
	}

	public abstract prepareRender(ctx: RenderingContext): void;
	public abstract render(ctx: RestrictedRenderingContext): void;
}

export const enum PartFingerprint {
	None,
	ContentWidgets,
	OverflowingContentWidgets,
	OverflowGuard,
	OverlayWidgets,
	OverflowingOverlayWidgets,
	ScrollableElement,
	TextArea,
	ViewLines,
	Minimap,
	ViewLinesGpu
}

export class PartFingerprints {

	public static write(target: Element | FastDomNode<HTMLElement>, partId: PartFingerprint) {
		target.setAttribute('data-mprt', String(partId));
	}

	public static read(target: Element): PartFingerprint {
		const r = target.getAttribute('data-mprt');
		if (r === null) {
			return PartFingerprint.None;
		}
		return parseInt(r, 10);
	}

	public static collect(child: Element | null, stopAt: Element): Uint8Array {
		const result: PartFingerprint[] = [];
		let resultLen = 0;

		while (child && child !== child.ownerDocument.body) {
			if (child === stopAt) {
				break;
			}
			if (child.nodeType === child.ELEMENT_NODE) {
				result[resultLen++] = this.read(child);
			}
			child = child.parentElement;
		}

		const r = new Uint8Array(resultLen);
		for (let i = 0; i < resultLen; i++) {
			r[i] = result[resultLen - i - 1];
		}
		return r;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/view/viewUserInputEvents.ts]---
Location: vscode-main/src/vs/editor/browser/view/viewUserInputEvents.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IKeyboardEvent } from '../../../base/browser/keyboardEvent.js';
import { IEditorMouseEvent, IMouseTarget, IMouseTargetViewZoneData, IPartialEditorMouseEvent, MouseTargetType } from '../editorBrowser.js';
import { IMouseWheelEvent } from '../../../base/browser/mouseEvent.js';
import { Position } from '../../common/core/position.js';
import { ICoordinatesConverter } from '../../common/coordinatesConverter.js';

export interface EventCallback<T> {
	(event: T): void;
}

export class ViewUserInputEvents {

	public onKeyDown: EventCallback<IKeyboardEvent> | null = null;
	public onKeyUp: EventCallback<IKeyboardEvent> | null = null;
	public onContextMenu: EventCallback<IEditorMouseEvent> | null = null;
	public onMouseMove: EventCallback<IEditorMouseEvent> | null = null;
	public onMouseLeave: EventCallback<IPartialEditorMouseEvent> | null = null;
	public onMouseDown: EventCallback<IEditorMouseEvent> | null = null;
	public onMouseUp: EventCallback<IEditorMouseEvent> | null = null;
	public onMouseDrag: EventCallback<IEditorMouseEvent> | null = null;
	public onMouseDrop: EventCallback<IPartialEditorMouseEvent> | null = null;
	public onMouseDropCanceled: EventCallback<void> | null = null;
	public onMouseWheel: EventCallback<IMouseWheelEvent> | null = null;

	private readonly _coordinatesConverter: ICoordinatesConverter;

	constructor(coordinatesConverter: ICoordinatesConverter) {
		this._coordinatesConverter = coordinatesConverter;
	}

	public emitKeyDown(e: IKeyboardEvent): void {
		this.onKeyDown?.(e);
	}

	public emitKeyUp(e: IKeyboardEvent): void {
		this.onKeyUp?.(e);
	}

	public emitContextMenu(e: IEditorMouseEvent): void {
		this.onContextMenu?.(this._convertViewToModelMouseEvent(e));
	}

	public emitMouseMove(e: IEditorMouseEvent): void {
		this.onMouseMove?.(this._convertViewToModelMouseEvent(e));
	}

	public emitMouseLeave(e: IPartialEditorMouseEvent): void {
		this.onMouseLeave?.(this._convertViewToModelMouseEvent(e));
	}

	public emitMouseDown(e: IEditorMouseEvent): void {
		this.onMouseDown?.(this._convertViewToModelMouseEvent(e));
	}

	public emitMouseUp(e: IEditorMouseEvent): void {
		this.onMouseUp?.(this._convertViewToModelMouseEvent(e));
	}

	public emitMouseDrag(e: IEditorMouseEvent): void {
		this.onMouseDrag?.(this._convertViewToModelMouseEvent(e));
	}

	public emitMouseDrop(e: IPartialEditorMouseEvent): void {
		this.onMouseDrop?.(this._convertViewToModelMouseEvent(e));
	}

	public emitMouseDropCanceled(): void {
		this.onMouseDropCanceled?.();
	}

	public emitMouseWheel(e: IMouseWheelEvent): void {
		this.onMouseWheel?.(e);
	}

	private _convertViewToModelMouseEvent(e: IEditorMouseEvent): IEditorMouseEvent;
	private _convertViewToModelMouseEvent(e: IPartialEditorMouseEvent): IPartialEditorMouseEvent;
	private _convertViewToModelMouseEvent(e: IEditorMouseEvent | IPartialEditorMouseEvent): IEditorMouseEvent | IPartialEditorMouseEvent {
		if (e.target) {
			return {
				event: e.event,
				target: this._convertViewToModelMouseTarget(e.target)
			};
		}
		return e;
	}

	private _convertViewToModelMouseTarget(target: IMouseTarget): IMouseTarget {
		return ViewUserInputEvents.convertViewToModelMouseTarget(target, this._coordinatesConverter);
	}

	public static convertViewToModelMouseTarget(target: IMouseTarget, coordinatesConverter: ICoordinatesConverter): IMouseTarget {
		const result = { ...target };
		if (result.position) {
			result.position = coordinatesConverter.convertViewPositionToModelPosition(result.position);
		}
		if (result.range) {
			result.range = coordinatesConverter.convertViewRangeToModelRange(result.range);
		}
		if (result.type === MouseTargetType.GUTTER_VIEW_ZONE || result.type === MouseTargetType.CONTENT_VIEW_ZONE) {
			result.detail = this.convertViewToModelViewZoneData(result.detail, coordinatesConverter);
		}
		return result;
	}

	private static convertViewToModelViewZoneData(data: IMouseTargetViewZoneData, coordinatesConverter: ICoordinatesConverter): IMouseTargetViewZoneData {
		return {
			viewZoneId: data.viewZoneId,
			positionBefore: data.positionBefore ? coordinatesConverter.convertViewPositionToModelPosition(data.positionBefore) : data.positionBefore,
			positionAfter: data.positionAfter ? coordinatesConverter.convertViewPositionToModelPosition(data.positionAfter) : data.positionAfter,
			position: coordinatesConverter.convertViewPositionToModelPosition(data.position),
			afterLineNumber: coordinatesConverter.convertViewPositionToModelPosition(new Position(data.afterLineNumber, 1)).lineNumber,
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/blockDecorations/blockDecorations.css]---
Location: vscode-main/src/vs/editor/browser/viewParts/blockDecorations/blockDecorations.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .blockDecorations-container {
	position: absolute;
	top: 0;
	pointer-events: none;
}

.monaco-editor .blockDecorations-block {
	position: absolute;
	box-sizing: border-box;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/blockDecorations/blockDecorations.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/blockDecorations/blockDecorations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createFastDomNode, FastDomNode } from '../../../../base/browser/fastDomNode.js';
import './blockDecorations.css';
import { RenderingContext, RestrictedRenderingContext } from '../../view/renderingContext.js';
import { ViewPart } from '../../view/viewPart.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import * as viewEvents from '../../../common/viewEvents.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';

export class BlockDecorations extends ViewPart {

	public domNode: FastDomNode<HTMLElement>;

	private readonly blocks: FastDomNode<HTMLElement>[] = [];

	private contentWidth: number = -1;
	private contentLeft: number = 0;

	constructor(context: ViewContext) {
		super(context);

		this.domNode = createFastDomNode<HTMLElement>(document.createElement('div'));
		this.domNode.setAttribute('role', 'presentation');
		this.domNode.setAttribute('aria-hidden', 'true');
		this.domNode.setClassName('blockDecorations-container');

		this.update();
	}

	private update(): boolean {
		let didChange = false;
		const options = this._context.configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);
		const newContentWidth = layoutInfo.contentWidth - layoutInfo.verticalScrollbarWidth;

		if (this.contentWidth !== newContentWidth) {
			this.contentWidth = newContentWidth;
			didChange = true;
		}

		const newContentLeft = layoutInfo.contentLeft;
		if (this.contentLeft !== newContentLeft) {
			this.contentLeft = newContentLeft;
			didChange = true;
		}

		return didChange;
	}

	public override dispose(): void {
		super.dispose();
	}

	// --- begin event handlers

	public override onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		return this.update();
	}
	public override onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean {
		return e.scrollTopChanged || e.scrollLeftChanged;
	}
	public override onDecorationsChanged(e: viewEvents.ViewDecorationsChangedEvent): boolean {
		return true;
	}

	public override onZonesChanged(e: viewEvents.ViewZonesChangedEvent): boolean {
		return true;
	}

	// --- end event handlers
	public prepareRender(ctx: RenderingContext): void {
		// Nothing to read
	}

	public render(ctx: RestrictedRenderingContext): void {
		let count = 0;
		const decorations = ctx.getDecorationsInViewport();
		for (const decoration of decorations) {
			if (!decoration.options.blockClassName) {
				continue;
			}

			let block = this.blocks[count];
			if (!block) {
				block = this.blocks[count] = createFastDomNode(document.createElement('div'));
				this.domNode.appendChild(block);
			}

			let top: number;
			let bottom: number;

			if (decoration.options.blockIsAfterEnd) {
				// range must be empty
				top = ctx.getVerticalOffsetAfterLineNumber(decoration.range.endLineNumber, false);
				bottom = ctx.getVerticalOffsetAfterLineNumber(decoration.range.endLineNumber, true);
			} else {
				top = ctx.getVerticalOffsetForLineNumber(decoration.range.startLineNumber, true);
				bottom = decoration.range.isEmpty() && !decoration.options.blockDoesNotCollapse
					? ctx.getVerticalOffsetForLineNumber(decoration.range.startLineNumber, false)
					: ctx.getVerticalOffsetAfterLineNumber(decoration.range.endLineNumber, true);
			}

			const [paddingTop, paddingRight, paddingBottom, paddingLeft] = decoration.options.blockPadding ?? [0, 0, 0, 0];

			block.setClassName('blockDecorations-block ' + decoration.options.blockClassName);
			block.setLeft(this.contentLeft - paddingLeft);
			block.setWidth(this.contentWidth + paddingLeft + paddingRight);
			block.setTop(top - ctx.scrollTop - paddingTop);
			block.setHeight(bottom - top + paddingTop + paddingBottom);

			count++;
		}

		for (let i = count; i < this.blocks.length; i++) {
			this.blocks[i].domNode.remove();
		}
		this.blocks.length = count;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/contentWidgets/contentWidgets.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/contentWidgets/contentWidgets.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { FastDomNode, createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import { ContentWidgetPositionPreference, IContentWidget, IContentWidgetRenderedCoordinate } from '../../editorBrowser.js';
import { PartFingerprint, PartFingerprints, ViewPart } from '../../view/viewPart.js';
import { RenderingContext, RestrictedRenderingContext } from '../../view/renderingContext.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';
import * as viewEvents from '../../../common/viewEvents.js';
import { ViewportData } from '../../../common/viewLayout/viewLinesViewportData.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { IDimension } from '../../../common/core/2d/dimension.js';
import { PositionAffinity } from '../../../common/model.js';
import { IPosition, Position } from '../../../common/core/position.js';
import { IViewModel } from '../../../common/viewModel.js';

/**
 * This view part is responsible for rendering the content widgets, which are
 * used for rendering elements that are associated to an editor position,
 * such as suggestions or the parameter hints.
 */
export class ViewContentWidgets extends ViewPart {

	private readonly _viewDomNode: FastDomNode<HTMLElement>;
	private _widgets: { [key: string]: Widget };

	public domNode: FastDomNode<HTMLElement>;
	public overflowingContentWidgetsDomNode: FastDomNode<HTMLElement>;

	constructor(context: ViewContext, viewDomNode: FastDomNode<HTMLElement>) {
		super(context);
		this._viewDomNode = viewDomNode;
		this._widgets = {};

		this.domNode = createFastDomNode(document.createElement('div'));
		PartFingerprints.write(this.domNode, PartFingerprint.ContentWidgets);
		this.domNode.setClassName('contentWidgets');
		this.domNode.setPosition('absolute');
		this.domNode.setTop(0);

		this.overflowingContentWidgetsDomNode = createFastDomNode(document.createElement('div'));
		PartFingerprints.write(this.overflowingContentWidgetsDomNode, PartFingerprint.OverflowingContentWidgets);
		this.overflowingContentWidgetsDomNode.setClassName('overflowingContentWidgets');
	}

	public override dispose(): void {
		super.dispose();
		this._widgets = {};
	}

	// --- begin event handlers

	public override onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		const keys = Object.keys(this._widgets);
		for (const widgetId of keys) {
			this._widgets[widgetId].onConfigurationChanged(e);
		}
		return true;
	}
	public override onDecorationsChanged(e: viewEvents.ViewDecorationsChangedEvent): boolean {
		// true for inline decorations that can end up relayouting text
		return true;
	}
	public override onFlushed(e: viewEvents.ViewFlushedEvent): boolean {
		return true;
	}
	public override onLineMappingChanged(e: viewEvents.ViewLineMappingChangedEvent): boolean {
		this._updateAnchorsViewPositions();
		return true;
	}
	public override onLinesChanged(e: viewEvents.ViewLinesChangedEvent): boolean {
		this._updateAnchorsViewPositions();
		return true;
	}
	public override onLinesDeleted(e: viewEvents.ViewLinesDeletedEvent): boolean {
		this._updateAnchorsViewPositions();
		return true;
	}
	public override onLinesInserted(e: viewEvents.ViewLinesInsertedEvent): boolean {
		this._updateAnchorsViewPositions();
		return true;
	}
	public override onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean {
		return true;
	}
	public override onZonesChanged(e: viewEvents.ViewZonesChangedEvent): boolean {
		return true;
	}

	// ---- end view event handlers

	private _updateAnchorsViewPositions(): void {
		const keys = Object.keys(this._widgets);
		for (const widgetId of keys) {
			this._widgets[widgetId].updateAnchorViewPosition();
		}
	}

	public addWidget(_widget: IContentWidget): void {
		const myWidget = new Widget(this._context, this._viewDomNode, _widget);
		this._widgets[myWidget.id] = myWidget;

		if (myWidget.allowEditorOverflow) {
			this.overflowingContentWidgetsDomNode.appendChild(myWidget.domNode);
		} else {
			this.domNode.appendChild(myWidget.domNode);
		}

		this.setShouldRender();
	}

	public setWidgetPosition(widget: IContentWidget, primaryAnchor: IPosition | null, secondaryAnchor: IPosition | null, preference: ContentWidgetPositionPreference[] | null, affinity: PositionAffinity | null): void {
		const myWidget = this._widgets[widget.getId()];
		myWidget.setPosition(primaryAnchor, secondaryAnchor, preference, affinity);

		if (!myWidget.useDisplayNone) {
			this.setShouldRender();
		}
	}

	public removeWidget(widget: IContentWidget): void {
		const widgetId = widget.getId();
		if (this._widgets.hasOwnProperty(widgetId)) {
			const myWidget = this._widgets[widgetId];
			delete this._widgets[widgetId];

			const domNode = myWidget.domNode.domNode;
			domNode.remove();
			domNode.removeAttribute('monaco-visible-content-widget');

			this.setShouldRender();
		}
	}

	public shouldSuppressMouseDownOnWidget(widgetId: string): boolean {
		if (this._widgets.hasOwnProperty(widgetId)) {
			return this._widgets[widgetId].suppressMouseDown;
		}
		return false;
	}

	public onBeforeRender(viewportData: ViewportData): void {
		const keys = Object.keys(this._widgets);
		for (const widgetId of keys) {
			this._widgets[widgetId].onBeforeRender(viewportData);
		}
	}

	public prepareRender(ctx: RenderingContext): void {
		const keys = Object.keys(this._widgets);
		for (const widgetId of keys) {
			this._widgets[widgetId].prepareRender(ctx);
		}
	}

	public render(ctx: RestrictedRenderingContext): void {
		const keys = Object.keys(this._widgets);
		for (const widgetId of keys) {
			this._widgets[widgetId].render(ctx);
		}
	}
}

interface IBoxLayoutResult {
	fitsAbove: boolean;
	aboveTop: number;

	fitsBelow: boolean;
	belowTop: number;

	left: number;
}

interface IOffViewportRenderData {
	kind: 'offViewport';
	preserveFocus: boolean;
}

interface IInViewportRenderData {
	kind: 'inViewport';
	coordinate: Coordinate;
	position: ContentWidgetPositionPreference;
}

type IRenderData = IInViewportRenderData | IOffViewportRenderData;

class Widget {
	private readonly _context: ViewContext;
	private readonly _viewDomNode: FastDomNode<HTMLElement>;
	private readonly _actual: IContentWidget;

	public readonly domNode: FastDomNode<HTMLElement>;
	public readonly id: string;
	public readonly allowEditorOverflow: boolean;
	public readonly suppressMouseDown: boolean;

	private readonly _fixedOverflowWidgets: boolean;
	private _contentWidth: number;
	private _contentLeft: number;

	private _primaryAnchor: PositionPair = new PositionPair(null, null);
	private _secondaryAnchor: PositionPair = new PositionPair(null, null);
	private _affinity: PositionAffinity | null;
	private _preference: ContentWidgetPositionPreference[] | null;
	private _cachedDomNodeOffsetWidth: number;
	private _cachedDomNodeOffsetHeight: number;
	private _maxWidth: number;
	private _isVisible: boolean;

	private _renderData: IRenderData | null;
	public readonly useDisplayNone: boolean;

	constructor(context: ViewContext, viewDomNode: FastDomNode<HTMLElement>, actual: IContentWidget) {
		this._context = context;
		this._viewDomNode = viewDomNode;
		this._actual = actual;

		const options = this._context.configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);
		const allowOverflow = options.get(EditorOption.allowOverflow);

		this.domNode = createFastDomNode(this._actual.getDomNode());
		this.id = this._actual.getId();
		this.allowEditorOverflow = (this._actual.allowEditorOverflow || false) && allowOverflow;
		this.suppressMouseDown = this._actual.suppressMouseDown || false;
		this.useDisplayNone = this._actual.useDisplayNone || false;

		this._fixedOverflowWidgets = options.get(EditorOption.fixedOverflowWidgets);
		this._contentWidth = layoutInfo.contentWidth;
		this._contentLeft = layoutInfo.contentLeft;

		this._affinity = null;
		this._preference = [];
		this._cachedDomNodeOffsetWidth = -1;
		this._cachedDomNodeOffsetHeight = -1;
		this._maxWidth = this._getMaxWidth();
		this._isVisible = false;
		this._renderData = null;

		this.domNode.setPosition((this._fixedOverflowWidgets && this.allowEditorOverflow) ? 'fixed' : 'absolute');
		this.domNode.setDisplay('none');
		this.domNode.setVisibility('hidden');
		this.domNode.setAttribute('widgetId', this.id);
		this.domNode.setMaxWidth(this._maxWidth);
	}

	public onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): void {
		const options = this._context.configuration.options;
		if (e.hasChanged(EditorOption.layoutInfo)) {
			const layoutInfo = options.get(EditorOption.layoutInfo);
			this._contentLeft = layoutInfo.contentLeft;
			this._contentWidth = layoutInfo.contentWidth;
			this._maxWidth = this._getMaxWidth();
		}
	}

	public updateAnchorViewPosition(): void {
		this._setPosition(this._affinity, this._primaryAnchor.modelPosition, this._secondaryAnchor.modelPosition);
	}

	private _setPosition(affinity: PositionAffinity | null, primaryAnchor: IPosition | null, secondaryAnchor: IPosition | null): void {
		this._affinity = affinity;
		this._primaryAnchor = getValidPositionPair(primaryAnchor, this._context.viewModel, this._affinity);
		this._secondaryAnchor = getValidPositionPair(secondaryAnchor, this._context.viewModel, this._affinity);

		function getValidPositionPair(position: IPosition | null, viewModel: IViewModel, affinity: PositionAffinity | null): PositionPair {
			if (!position) {
				return new PositionPair(null, null);
			}
			// Do not trust that widgets give a valid position
			const validModelPosition = viewModel.model.validatePosition(position);
			if (viewModel.coordinatesConverter.modelPositionIsVisible(validModelPosition)) {
				const viewPosition = viewModel.coordinatesConverter.convertModelPositionToViewPosition(validModelPosition, affinity ?? undefined);
				return new PositionPair(position, viewPosition);
			}
			return new PositionPair(position, null);
		}
	}

	private _getMaxWidth(): number {
		const elDocument = this.domNode.domNode.ownerDocument;
		const elWindow = elDocument.defaultView;
		return (
			this.allowEditorOverflow
				? elWindow?.innerWidth || elDocument.documentElement.offsetWidth || elDocument.body.offsetWidth
				: this._contentWidth
		);
	}

	public setPosition(primaryAnchor: IPosition | null, secondaryAnchor: IPosition | null, preference: ContentWidgetPositionPreference[] | null, affinity: PositionAffinity | null): void {
		this._setPosition(affinity, primaryAnchor, secondaryAnchor);
		this._preference = preference;
		if (!this.useDisplayNone && this._primaryAnchor.viewPosition && this._preference && this._preference.length > 0) {
			// this content widget would like to be visible if possible
			// we change it from `display:none` to `display:block` even if it
			// might be outside the viewport such that we can measure its size
			// in `prepareRender`
			this.domNode.setDisplay('block');
		} else {
			this.domNode.setDisplay('none');
		}
		this._cachedDomNodeOffsetWidth = -1;
		this._cachedDomNodeOffsetHeight = -1;
	}

	private _layoutBoxInViewport(anchor: AnchorCoordinate, width: number, height: number, ctx: RenderingContext): IBoxLayoutResult {
		// Our visible box is split horizontally by the current line => 2 boxes

		// a) the box above the line
		const aboveLineTop = anchor.top;
		const heightAvailableAboveLine = aboveLineTop;

		// b) the box under the line
		const underLineTop = anchor.top + anchor.height;
		const heightAvailableUnderLine = ctx.viewportHeight - underLineTop;

		const aboveTop = aboveLineTop - height;
		const fitsAbove = (heightAvailableAboveLine >= height);
		const belowTop = underLineTop;
		const fitsBelow = (heightAvailableUnderLine >= height);

		// And its left
		let left = anchor.left;
		if (left + width > ctx.scrollLeft + ctx.viewportWidth) {
			left = ctx.scrollLeft + ctx.viewportWidth - width;
		}
		if (left < ctx.scrollLeft) {
			left = ctx.scrollLeft;
		}

		return { fitsAbove, aboveTop, fitsBelow, belowTop, left };
	}

	private _layoutHorizontalSegmentInPage(windowSize: dom.Dimension, domNodePosition: dom.IDomNodePagePosition, left: number, width: number): [number, number] {
		// Leave some clearance to the left/right
		const LEFT_PADDING = 15;
		const RIGHT_PADDING = 15;

		// Initially, the limits are defined as the dom node limits
		const MIN_LIMIT = Math.max(LEFT_PADDING, domNodePosition.left - width);
		const MAX_LIMIT = Math.min(domNodePosition.left + domNodePosition.width + width, windowSize.width - RIGHT_PADDING);

		const elDocument = this._viewDomNode.domNode.ownerDocument;
		const elWindow = elDocument.defaultView;
		let absoluteLeft = domNodePosition.left + left - (elWindow?.scrollX ?? 0);

		if (absoluteLeft + width > MAX_LIMIT) {
			const delta = absoluteLeft - (MAX_LIMIT - width);
			absoluteLeft -= delta;
			left -= delta;
		}

		if (absoluteLeft < MIN_LIMIT) {
			const delta = absoluteLeft - MIN_LIMIT;
			absoluteLeft -= delta;
			left -= delta;
		}

		return [left, absoluteLeft];
	}

	private _layoutBoxInPage(anchor: AnchorCoordinate, width: number, height: number, ctx: RenderingContext): IBoxLayoutResult | null {
		const aboveTop = anchor.top - height;
		const belowTop = anchor.top + anchor.height;

		const domNodePosition = dom.getDomNodePagePosition(this._viewDomNode.domNode);
		const elDocument = this._viewDomNode.domNode.ownerDocument;
		const elWindow = elDocument.defaultView;
		const absoluteAboveTop = domNodePosition.top + aboveTop - (elWindow?.scrollY ?? 0);
		const absoluteBelowTop = domNodePosition.top + belowTop - (elWindow?.scrollY ?? 0);

		const windowSize = dom.getClientArea(elDocument.body);
		const [left, absoluteAboveLeft] = this._layoutHorizontalSegmentInPage(windowSize, domNodePosition, anchor.left - ctx.scrollLeft + this._contentLeft, width);

		// Leave some clearance to the top/bottom
		const TOP_PADDING = 22;
		const BOTTOM_PADDING = 22;

		const fitsAbove = (absoluteAboveTop >= TOP_PADDING);
		const fitsBelow = (absoluteBelowTop + height <= windowSize.height - BOTTOM_PADDING);

		if (this._fixedOverflowWidgets) {
			return {
				fitsAbove,
				aboveTop: Math.max(absoluteAboveTop, TOP_PADDING),
				fitsBelow,
				belowTop: absoluteBelowTop,
				left: absoluteAboveLeft
			};
		}

		return { fitsAbove, aboveTop, fitsBelow, belowTop, left };
	}

	private _prepareRenderWidgetAtExactPositionOverflowing(topLeft: Coordinate): Coordinate {
		return new Coordinate(topLeft.top, topLeft.left + this._contentLeft);
	}

	/**
	 * Compute the coordinates above and below the primary and secondary anchors.
	 * The content widget *must* touch the primary anchor.
	 * The content widget should touch if possible the secondary anchor.
	 */
	private _getAnchorsCoordinates(ctx: RenderingContext): { primary: AnchorCoordinate | null; secondary: AnchorCoordinate | null } {
		const primary = getCoordinates(this._primaryAnchor.viewPosition, this._affinity);
		const secondaryViewPosition = (this._secondaryAnchor.viewPosition?.lineNumber === this._primaryAnchor.viewPosition?.lineNumber ? this._secondaryAnchor.viewPosition : null);
		const secondary = getCoordinates(secondaryViewPosition, this._affinity);
		return { primary, secondary };

		function getCoordinates(position: Position | null, affinity: PositionAffinity | null): AnchorCoordinate | null {
			if (!position) {
				return null;
			}

			const horizontalPosition = ctx.visibleRangeForPosition(position);
			if (!horizontalPosition) {
				return null;
			}

			// Left-align widgets that should appear :before content
			const left = (position.column === 1 && affinity === PositionAffinity.LeftOfInjectedText ? 0 : horizontalPosition.left);
			const top = ctx.getVerticalOffsetForLineNumber(position.lineNumber) - ctx.scrollTop;
			const lineHeight = ctx.getLineHeightForLineNumber(position.lineNumber);
			return new AnchorCoordinate(top, left, lineHeight);
		}
	}

	private _reduceAnchorCoordinates(primary: AnchorCoordinate, secondary: AnchorCoordinate | null, width: number): AnchorCoordinate {
		if (!secondary) {
			return primary;
		}

		const fontInfo = this._context.configuration.options.get(EditorOption.fontInfo);

		let left = secondary.left;
		if (left < primary.left) {
			left = Math.max(left, primary.left - width + fontInfo.typicalFullwidthCharacterWidth);
		} else {
			left = Math.min(left, primary.left + width - fontInfo.typicalFullwidthCharacterWidth);
		}
		return new AnchorCoordinate(primary.top, left, primary.height);
	}

	private _prepareRenderWidget(ctx: RenderingContext): IRenderData | null {
		if (!this._preference || this._preference.length === 0) {
			return null;
		}

		const { primary, secondary } = this._getAnchorsCoordinates(ctx);
		if (!primary) {
			return {
				kind: 'offViewport',
				preserveFocus: this.domNode.domNode.contains(this.domNode.domNode.ownerDocument.activeElement)
			};
			// return null;
		}

		if (this._cachedDomNodeOffsetWidth === -1 || this._cachedDomNodeOffsetHeight === -1) {

			let preferredDimensions: IDimension | null = null;
			if (typeof this._actual.beforeRender === 'function') {
				preferredDimensions = safeInvoke(this._actual.beforeRender, this._actual);
			}
			if (preferredDimensions) {
				this._cachedDomNodeOffsetWidth = preferredDimensions.width;
				this._cachedDomNodeOffsetHeight = preferredDimensions.height;
			} else {
				const domNode = this.domNode.domNode;
				const clientRect = domNode.getBoundingClientRect();
				this._cachedDomNodeOffsetWidth = Math.round(clientRect.width);
				this._cachedDomNodeOffsetHeight = Math.round(clientRect.height);
			}
		}

		const anchor = this._reduceAnchorCoordinates(primary, secondary, this._cachedDomNodeOffsetWidth);

		let placement: IBoxLayoutResult | null;
		if (this.allowEditorOverflow) {
			placement = this._layoutBoxInPage(anchor, this._cachedDomNodeOffsetWidth, this._cachedDomNodeOffsetHeight, ctx);
		} else {
			placement = this._layoutBoxInViewport(anchor, this._cachedDomNodeOffsetWidth, this._cachedDomNodeOffsetHeight, ctx);
		}

		// Do two passes, first for perfect fit, second picks first option
		for (let pass = 1; pass <= 2; pass++) {
			for (const pref of this._preference) {
				// placement
				if (pref === ContentWidgetPositionPreference.ABOVE) {
					if (!placement) {
						// Widget outside of viewport
						return null;
					}
					if (pass === 2 || placement.fitsAbove) {
						return {
							kind: 'inViewport',
							coordinate: new Coordinate(placement.aboveTop, placement.left),
							position: ContentWidgetPositionPreference.ABOVE
						};
					}
				} else if (pref === ContentWidgetPositionPreference.BELOW) {
					if (!placement) {
						// Widget outside of viewport
						return null;
					}
					if (pass === 2 || placement.fitsBelow) {
						return {
							kind: 'inViewport',
							coordinate: new Coordinate(placement.belowTop, placement.left),
							position: ContentWidgetPositionPreference.BELOW
						};
					}
				} else {
					if (this.allowEditorOverflow) {
						return {
							kind: 'inViewport',
							coordinate: this._prepareRenderWidgetAtExactPositionOverflowing(new Coordinate(anchor.top, anchor.left)),
							position: ContentWidgetPositionPreference.EXACT
						};
					} else {
						return {
							kind: 'inViewport',
							coordinate: new Coordinate(anchor.top, anchor.left),
							position: ContentWidgetPositionPreference.EXACT
						};
					}
				}
			}
		}

		return null;
	}

	/**
	 * On this first pass, we ensure that the content widget (if it is in the viewport) has the max width set correctly.
	 */
	public onBeforeRender(viewportData: ViewportData): void {
		if (!this._primaryAnchor.viewPosition || !this._preference) {
			return;
		}

		if (this._primaryAnchor.viewPosition.lineNumber < viewportData.startLineNumber || this._primaryAnchor.viewPosition.lineNumber > viewportData.endLineNumber) {
			// Outside of viewport
			return;
		}

		this.domNode.setMaxWidth(this._maxWidth);
	}

	public prepareRender(ctx: RenderingContext): void {
		this._renderData = this._prepareRenderWidget(ctx);
	}

	public render(ctx: RestrictedRenderingContext): void {
		if (!this._renderData || this._renderData.kind === 'offViewport') {
			// This widget should be invisible
			if (this._isVisible) {
				this.domNode.removeAttribute('monaco-visible-content-widget');
				this._isVisible = false;

				if (this._renderData?.kind === 'offViewport' && this._renderData.preserveFocus) {
					// widget wants to be shown, but it is outside of the viewport and it
					// has focus which we need to preserve
					this.domNode.setTop(-1000);
				} else {
					this.domNode.setVisibility('hidden');
				}
			}

			if (typeof this._actual.afterRender === 'function') {
				safeInvoke(this._actual.afterRender, this._actual, null, null);
			}
			return;
		}

		// This widget should be visible
		if (this.allowEditorOverflow) {
			this.domNode.setTop(this._renderData.coordinate.top);
			this.domNode.setLeft(this._renderData.coordinate.left);
		} else {
			this.domNode.setTop(this._renderData.coordinate.top + ctx.scrollTop - ctx.bigNumbersDelta);
			this.domNode.setLeft(this._renderData.coordinate.left);
		}

		if (!this._isVisible) {
			this.domNode.setVisibility('inherit');
			this.domNode.setAttribute('monaco-visible-content-widget', 'true');
			this._isVisible = true;
		}

		if (typeof this._actual.afterRender === 'function') {
			safeInvoke(this._actual.afterRender, this._actual, this._renderData.position, this._renderData.coordinate);
		}
	}
}

class PositionPair {
	constructor(
		public readonly modelPosition: IPosition | null,
		public readonly viewPosition: Position | null
	) { }
}

class Coordinate implements IContentWidgetRenderedCoordinate {
	_coordinateBrand: void = undefined;

	constructor(
		public readonly top: number,
		public readonly left: number
	) { }
}

class AnchorCoordinate {
	_anchorCoordinateBrand: void = undefined;

	constructor(
		public readonly top: number,
		public readonly left: number,
		public readonly height: number
	) { }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function safeInvoke<T extends (...args: any[]) => any>(fn: T, thisArg: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> | null {
	try {
		return fn.call(thisArg, ...args);
	} catch {
		// ignore
		return null;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/currentLineHighlight/currentLineHighlight.css]---
Location: vscode-main/src/vs/editor/browser/viewParts/currentLineHighlight/currentLineHighlight.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .view-overlays .current-line {
	display: block;
	position: absolute;
	left: 0;
	top: 0;
	box-sizing: border-box;
	height: 100%;
}

.monaco-editor .margin-view-overlays .current-line {
	display: block;
	position: absolute;
	left: 0;
	top: 0;
	box-sizing: border-box;
	height: 100%;
}

.monaco-editor
	.margin-view-overlays
	.current-line.current-line-margin.current-line-margin-both {
	border-right: 0;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/currentLineHighlight/currentLineHighlight.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/currentLineHighlight/currentLineHighlight.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './currentLineHighlight.css';
import { DynamicViewOverlay } from '../../view/dynamicViewOverlay.js';
import { editorLineHighlight, editorInactiveLineHighlight, editorLineHighlightBorder } from '../../../common/core/editorColorRegistry.js';
import { RenderingContext } from '../../view/renderingContext.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';
import * as viewEvents from '../../../common/viewEvents.js';
import * as arrays from '../../../../base/common/arrays.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { Selection } from '../../../common/core/selection.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { isHighContrast } from '../../../../platform/theme/common/theme.js';
import { Position } from '../../../common/core/position.js';

export abstract class AbstractLineHighlightOverlay extends DynamicViewOverlay {
	private readonly _context: ViewContext;
	protected _renderLineHighlight: 'none' | 'gutter' | 'line' | 'all';
	protected _wordWrap: boolean;
	protected _contentLeft: number;
	protected _contentWidth: number;
	protected _selectionIsEmpty: boolean;
	protected _renderLineHighlightOnlyWhenFocus: boolean;
	protected _focused: boolean;
	/**
	 * Unique sorted list of view line numbers which have cursors sitting on them.
	 */
	private _cursorLineNumbers: number[];
	private _selections: Selection[];
	private _renderData: string[] | null;

	constructor(context: ViewContext) {
		super();
		this._context = context;

		const options = this._context.configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);
		this._renderLineHighlight = options.get(EditorOption.renderLineHighlight);
		this._renderLineHighlightOnlyWhenFocus = options.get(EditorOption.renderLineHighlightOnlyWhenFocus);
		this._wordWrap = layoutInfo.isViewportWrapping;
		this._contentLeft = layoutInfo.contentLeft;
		this._contentWidth = layoutInfo.contentWidth;
		this._selectionIsEmpty = true;
		this._focused = false;
		this._cursorLineNumbers = [1];
		this._selections = [new Selection(1, 1, 1, 1)];
		this._renderData = null;

		this._context.addEventHandler(this);
	}

	public override dispose(): void {
		this._context.removeEventHandler(this);
		super.dispose();
	}

	private _readFromSelections(): boolean {
		let hasChanged = false;

		const lineNumbers = new Set<number>();
		for (const selection of this._selections) {
			lineNumbers.add(selection.positionLineNumber);
		}
		const cursorsLineNumbers = Array.from(lineNumbers);
		cursorsLineNumbers.sort((a, b) => a - b);
		if (!arrays.equals(this._cursorLineNumbers, cursorsLineNumbers)) {
			this._cursorLineNumbers = cursorsLineNumbers;
			hasChanged = true;
		}

		const selectionIsEmpty = this._selections.every(s => s.isEmpty());
		if (this._selectionIsEmpty !== selectionIsEmpty) {
			this._selectionIsEmpty = selectionIsEmpty;
			hasChanged = true;
		}

		return hasChanged;
	}

	// --- begin event handlers
	public override onThemeChanged(e: viewEvents.ViewThemeChangedEvent): boolean {
		return this._readFromSelections();
	}
	public override onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		const options = this._context.configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);
		this._renderLineHighlight = options.get(EditorOption.renderLineHighlight);
		this._renderLineHighlightOnlyWhenFocus = options.get(EditorOption.renderLineHighlightOnlyWhenFocus);
		this._wordWrap = layoutInfo.isViewportWrapping;
		this._contentLeft = layoutInfo.contentLeft;
		this._contentWidth = layoutInfo.contentWidth;
		return true;
	}
	public override onCursorStateChanged(e: viewEvents.ViewCursorStateChangedEvent): boolean {
		this._selections = e.selections;
		return this._readFromSelections();
	}
	public override onFlushed(e: viewEvents.ViewFlushedEvent): boolean {
		return true;
	}
	public override onLinesDeleted(e: viewEvents.ViewLinesDeletedEvent): boolean {
		return true;
	}
	public override onLinesInserted(e: viewEvents.ViewLinesInsertedEvent): boolean {
		return true;
	}
	public override onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean {
		return e.scrollWidthChanged || e.scrollTopChanged;
	}
	public override onZonesChanged(e: viewEvents.ViewZonesChangedEvent): boolean {
		return true;
	}
	public override onFocusChanged(e: viewEvents.ViewFocusChangedEvent): boolean {
		if (!this._renderLineHighlightOnlyWhenFocus) {
			return false;
		}

		this._focused = e.isFocused;
		return true;
	}
	// --- end event handlers

	public prepareRender(ctx: RenderingContext): void {
		if (!this._shouldRenderThis()) {
			this._renderData = null;
			return;
		}
		const visibleStartLineNumber = ctx.visibleRange.startLineNumber;
		const visibleEndLineNumber = ctx.visibleRange.endLineNumber;

		// initialize renderData
		const renderData: string[] = [];
		for (let lineNumber = visibleStartLineNumber; lineNumber <= visibleEndLineNumber; lineNumber++) {
			const lineIndex = lineNumber - visibleStartLineNumber;
			renderData[lineIndex] = '';
		}

		if (this._wordWrap) {
			// do a first pass to render wrapped lines
			const renderedLineWrapped = this._renderOne(ctx, false);
			for (const cursorLineNumber of this._cursorLineNumbers) {

				const coordinatesConverter = this._context.viewModel.coordinatesConverter;
				const modelLineNumber = coordinatesConverter.convertViewPositionToModelPosition(new Position(cursorLineNumber, 1)).lineNumber;
				const firstViewLineNumber = coordinatesConverter.convertModelPositionToViewPosition(new Position(modelLineNumber, 1)).lineNumber;
				const lastViewLineNumber = coordinatesConverter.convertModelPositionToViewPosition(new Position(modelLineNumber, this._context.viewModel.model.getLineMaxColumn(modelLineNumber))).lineNumber;

				const firstLine = Math.max(firstViewLineNumber, visibleStartLineNumber);
				const lastLine = Math.min(lastViewLineNumber, visibleEndLineNumber);
				for (let lineNumber = firstLine; lineNumber <= lastLine; lineNumber++) {
					const lineIndex = lineNumber - visibleStartLineNumber;
					renderData[lineIndex] = renderedLineWrapped;
				}
			}
		}

		// do a second pass to render exact lines
		const renderedLineExact = this._renderOne(ctx, true);
		for (const cursorLineNumber of this._cursorLineNumbers) {
			if (cursorLineNumber < visibleStartLineNumber || cursorLineNumber > visibleEndLineNumber) {
				continue;
			}
			const lineIndex = cursorLineNumber - visibleStartLineNumber;
			renderData[lineIndex] = renderedLineExact;
		}

		this._renderData = renderData;
	}

	public render(startLineNumber: number, lineNumber: number): string {
		if (!this._renderData) {
			return '';
		}
		const lineIndex = lineNumber - startLineNumber;
		if (lineIndex >= this._renderData.length) {
			return '';
		}
		return this._renderData[lineIndex];
	}

	protected _shouldRenderInMargin(): boolean {
		return (
			(this._renderLineHighlight === 'gutter' || this._renderLineHighlight === 'all')
			&& (!this._renderLineHighlightOnlyWhenFocus || this._focused)
		);
	}

	protected _shouldRenderInContent(): boolean {
		return (
			(this._renderLineHighlight === 'line' || this._renderLineHighlight === 'all')
			&& this._selectionIsEmpty
			&& (!this._renderLineHighlightOnlyWhenFocus || this._focused)
		);
	}

	protected abstract _shouldRenderThis(): boolean;
	protected abstract _shouldRenderOther(): boolean;
	protected abstract _renderOne(ctx: RenderingContext, exact: boolean): string;
}

/**
 * Emphasizes the current line by drawing a border around it.
 */
export class CurrentLineHighlightOverlay extends AbstractLineHighlightOverlay {

	protected _renderOne(ctx: RenderingContext, exact: boolean): string {
		const className = 'current-line' + (this._shouldRenderInMargin() ? ' current-line-both' : '') + (exact ? ' current-line-exact' : '');
		return `<div class="${className}" style="width:${Math.max(ctx.scrollWidth, this._contentWidth)}px;"></div>`;
	}
	protected _shouldRenderThis(): boolean {
		return this._shouldRenderInContent();
	}
	protected _shouldRenderOther(): boolean {
		return this._shouldRenderInMargin();
	}
}

/**
 * Emphasizes the current line margin/gutter by drawing a border around it.
 */
export class CurrentLineMarginHighlightOverlay extends AbstractLineHighlightOverlay {
	protected _renderOne(ctx: RenderingContext, exact: boolean): string {
		const className = 'current-line' + (this._shouldRenderInMargin() ? ' current-line-margin' : '') + (this._shouldRenderOther() ? ' current-line-margin-both' : '') + (this._shouldRenderInMargin() && exact ? ' current-line-exact-margin' : '');
		return `<div class="${className}" style="width:${this._contentLeft}px"></div>`;
	}
	protected _shouldRenderThis(): boolean {
		return true;
	}
	protected _shouldRenderOther(): boolean {
		return this._shouldRenderInContent();
	}
}

registerThemingParticipant((theme, collector) => {
	const lineHighlight = theme.getColor(editorLineHighlight);
	const inactiveLineHighlight = theme.getColor(editorInactiveLineHighlight);

	// Apply active line highlight when editor is focused
	if (lineHighlight) {
		collector.addRule(`.monaco-editor.focused .view-overlays .current-line { background-color: ${lineHighlight}; }`);
		collector.addRule(`.monaco-editor.focused .margin-view-overlays .current-line-margin { background-color: ${lineHighlight}; border: none; }`);
	}

	// Apply inactive line highlight when editor is not focused
	if (inactiveLineHighlight) {
		collector.addRule(`.monaco-editor .view-overlays .current-line { background-color: ${inactiveLineHighlight}; }`);
		collector.addRule(`.monaco-editor .margin-view-overlays .current-line-margin { background-color: ${inactiveLineHighlight}; border: none; }`);
	}

	if (!lineHighlight || lineHighlight.isTransparent() || theme.defines(editorLineHighlightBorder)) {
		const lineHighlightBorder = theme.getColor(editorLineHighlightBorder);
		if (lineHighlightBorder) {
			collector.addRule(`.monaco-editor .view-overlays .current-line-exact { border: 2px solid ${lineHighlightBorder}; }`);
			collector.addRule(`.monaco-editor .margin-view-overlays .current-line-exact-margin { border: 2px solid ${lineHighlightBorder}; }`);
			if (isHighContrast(theme.type)) {
				collector.addRule(`.monaco-editor .view-overlays .current-line-exact { border-width: 1px; }`);
				collector.addRule(`.monaco-editor .margin-view-overlays .current-line-exact-margin { border-width: 1px; }`);
			}
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/decorations/decorations.css]---
Location: vscode-main/src/vs/editor/browser/viewParts/decorations/decorations.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/*
	Keeping name short for faster parsing.
	cdr = core decorations rendering (div)
*/
.monaco-editor .lines-content .cdr {
	position: absolute;
	height: 100%;
}
```

--------------------------------------------------------------------------------

````

---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 534
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 534 of 552)

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

---[FILE: src/vs/workbench/services/textMate/common/cgmanifest.json]---
Location: vscode-main/src/vs/workbench/services/textMate/common/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "other",
				"other": {
					"name": "lib-oniguruma",
					"downloadUrl": "https://github.com/kkos/oniguruma",
					"version": "6.9.5_rev1"
				}
			},
			"licenseDetail": [
				"Oniguruma LICENSE",
				"-----------------",
				"",
				"Copyright (c) 2002-2020  K.Kosako  <kkosako0@gmail.com>",
				"All rights reserved.",
				"",
				"The BSD License",
				"",
				"Redistribution and use in source and binary forms, with or without",
				"modification, are permitted provided that the following conditions",
				"are met:",
				"1. Redistributions of source code must retain the above copyright",
				"   notice, this list of conditions and the following disclaimer.",
				"2. Redistributions in binary form must reproduce the above copyright",
				"   notice, this list of conditions and the following disclaimer in the",
				"   documentation and/or other materials provided with the distribution.",
				"",
				"THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND",
				"ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE",
				"IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE",
				"ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE",
				"FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL",
				"DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS",
				"OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)",
				"HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT",
				"LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY",
				"OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF",
				"SUCH DAMAGE."
			],
			"isOnlyProductionDependency": true,
			"license": "BSD",
			"version": "6.9.5_rev1"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/textMate/common/TMGrammarFactory.ts]---
Location: vscode-main/src/vs/workbench/services/textMate/common/TMGrammarFactory.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { IValidEmbeddedLanguagesMap, IValidGrammarDefinition, TMScopeRegistry } from './TMScopeRegistry.js';
import type { IGrammar, IOnigLib, IRawTheme, Registry, StateStack } from 'vscode-textmate';

interface ITMGrammarFactoryHost {
	logTrace(msg: string): void;
	logError(msg: string, err: any): void;
	readFile(resource: URI): Promise<string>;
}

export interface ICreateGrammarResult {
	languageId: string;
	grammar: IGrammar | null;
	initialState: StateStack;
	containsEmbeddedLanguages: boolean;
	sourceExtensionId?: string;
}

export const missingTMGrammarErrorMessage = 'No TM Grammar registered for this language.';

export class TMGrammarFactory extends Disposable {

	private readonly _host: ITMGrammarFactoryHost;
	private readonly _initialState: StateStack;
	private readonly _scopeRegistry: TMScopeRegistry;
	private readonly _injections: { [scopeName: string]: string[] };
	private readonly _injectedEmbeddedLanguages: { [scopeName: string]: IValidEmbeddedLanguagesMap[] };
	private readonly _languageToScope: Map<string, string>;
	private readonly _grammarRegistry: Registry;

	constructor(host: ITMGrammarFactoryHost, grammarDefinitions: IValidGrammarDefinition[], vscodeTextmate: typeof import('vscode-textmate'), onigLib: Promise<IOnigLib>) {
		super();
		this._host = host;
		this._initialState = vscodeTextmate.INITIAL;
		this._scopeRegistry = new TMScopeRegistry();
		this._injections = {};
		this._injectedEmbeddedLanguages = {};
		this._languageToScope = new Map<string, string>();
		this._grammarRegistry = this._register(new vscodeTextmate.Registry({
			onigLib: onigLib,
			loadGrammar: async (scopeName: string) => {
				const grammarDefinition = this._scopeRegistry.getGrammarDefinition(scopeName);
				if (!grammarDefinition) {
					this._host.logTrace(`No grammar found for scope ${scopeName}`);
					return null;
				}
				const location = grammarDefinition.location;
				try {
					const content = await this._host.readFile(location);
					return vscodeTextmate.parseRawGrammar(content, location.path);
				} catch (e) {
					this._host.logError(`Unable to load and parse grammar for scope ${scopeName} from ${location}`, e);
					return null;
				}
			},
			getInjections: (scopeName: string) => {
				const scopeParts = scopeName.split('.');
				let injections: string[] = [];
				for (let i = 1; i <= scopeParts.length; i++) {
					const subScopeName = scopeParts.slice(0, i).join('.');
					injections = [...injections, ...(this._injections[subScopeName] || [])];
				}
				return injections;
			}
		}));

		for (const validGrammar of grammarDefinitions) {
			this._scopeRegistry.register(validGrammar);

			if (validGrammar.injectTo) {
				for (const injectScope of validGrammar.injectTo) {
					let injections = this._injections[injectScope];
					if (!injections) {
						this._injections[injectScope] = injections = [];
					}
					injections.push(validGrammar.scopeName);
				}

				if (validGrammar.embeddedLanguages) {
					for (const injectScope of validGrammar.injectTo) {
						let injectedEmbeddedLanguages = this._injectedEmbeddedLanguages[injectScope];
						if (!injectedEmbeddedLanguages) {
							this._injectedEmbeddedLanguages[injectScope] = injectedEmbeddedLanguages = [];
						}
						injectedEmbeddedLanguages.push(validGrammar.embeddedLanguages);
					}
				}
			}

			if (validGrammar.language) {
				this._languageToScope.set(validGrammar.language, validGrammar.scopeName);
			}
		}
	}

	public has(languageId: string): boolean {
		return this._languageToScope.has(languageId);
	}

	public setTheme(theme: IRawTheme, colorMap: string[]): void {
		this._grammarRegistry.setTheme(theme, colorMap);
	}

	public getColorMap(): string[] {
		return this._grammarRegistry.getColorMap();
	}

	public async createGrammar(languageId: string, encodedLanguageId: number): Promise<ICreateGrammarResult> {
		const scopeName = this._languageToScope.get(languageId);
		if (typeof scopeName !== 'string') {
			// No TM grammar defined
			throw new Error(missingTMGrammarErrorMessage);
		}

		const grammarDefinition = this._scopeRegistry.getGrammarDefinition(scopeName);
		if (!grammarDefinition) {
			// No TM grammar defined
			throw new Error(missingTMGrammarErrorMessage);
		}

		const embeddedLanguages = grammarDefinition.embeddedLanguages;
		if (this._injectedEmbeddedLanguages[scopeName]) {
			const injectedEmbeddedLanguages = this._injectedEmbeddedLanguages[scopeName];
			for (const injected of injectedEmbeddedLanguages) {
				for (const scope of Object.keys(injected)) {
					embeddedLanguages[scope] = injected[scope];
				}
			}
		}

		const containsEmbeddedLanguages = (Object.keys(embeddedLanguages).length > 0);

		let grammar: IGrammar | null;

		try {
			grammar = await this._grammarRegistry.loadGrammarWithConfiguration(
				scopeName,
				encodedLanguageId,
				{
					embeddedLanguages,
					// eslint-disable-next-line local/code-no-any-casts
					tokenTypes: <any>grammarDefinition.tokenTypes,
					balancedBracketSelectors: grammarDefinition.balancedBracketSelectors,
					unbalancedBracketSelectors: grammarDefinition.unbalancedBracketSelectors,
				}
			);
		} catch (err) {
			if (err.message && err.message.startsWith('No grammar provided for')) {
				// No TM grammar defined
				throw new Error(missingTMGrammarErrorMessage);
			}
			throw err;
		}

		return {
			languageId: languageId,
			grammar: grammar,
			initialState: this._initialState,
			containsEmbeddedLanguages: containsEmbeddedLanguages,
			sourceExtensionId: grammarDefinition.sourceExtensionId,
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/textMate/common/TMGrammars.ts]---
Location: vscode-main/src/vs/workbench/services/textMate/common/TMGrammars.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { ExtensionsRegistry, IExtensionPoint } from '../../extensions/common/extensionsRegistry.js';
import { languagesExtPoint } from '../../language/common/languageService.js';

export interface IEmbeddedLanguagesMap {
	[scopeName: string]: string;
}

export interface TokenTypesContribution {
	[scopeName: string]: string;
}

export interface ITMSyntaxExtensionPoint {
	language?: string; // undefined if the grammar is only included by other grammars
	scopeName: string;
	path: string;
	embeddedLanguages: IEmbeddedLanguagesMap;
	tokenTypes: TokenTypesContribution;
	injectTo: string[];
	balancedBracketScopes: string[];
	unbalancedBracketScopes: string[];
}

export const grammarsExtPoint: IExtensionPoint<ITMSyntaxExtensionPoint[]> = ExtensionsRegistry.registerExtensionPoint<ITMSyntaxExtensionPoint[]>({
	extensionPoint: 'grammars',
	deps: [languagesExtPoint],
	jsonSchema: {
		description: nls.localize('vscode.extension.contributes.grammars', 'Contributes textmate tokenizers.'),
		type: 'array',
		defaultSnippets: [{ body: [{ language: '${1:id}', scopeName: 'source.${2:id}', path: './syntaxes/${3:id}.tmLanguage.' }] }],
		items: {
			type: 'object',
			defaultSnippets: [{ body: { language: '${1:id}', scopeName: 'source.${2:id}', path: './syntaxes/${3:id}.tmLanguage.' } }],
			properties: {
				language: {
					description: nls.localize('vscode.extension.contributes.grammars.language', 'Language identifier for which this syntax is contributed to.'),
					type: 'string'
				},
				scopeName: {
					description: nls.localize('vscode.extension.contributes.grammars.scopeName', 'Textmate scope name used by the tmLanguage file.'),
					type: 'string'
				},
				path: {
					description: nls.localize('vscode.extension.contributes.grammars.path', 'Path of the tmLanguage file. The path is relative to the extension folder and typically starts with \'./syntaxes/\'.'),
					type: 'string'
				},
				embeddedLanguages: {
					description: nls.localize('vscode.extension.contributes.grammars.embeddedLanguages', 'A map of scope name to language id if this grammar contains embedded languages.'),
					type: 'object'
				},
				tokenTypes: {
					description: nls.localize('vscode.extension.contributes.grammars.tokenTypes', 'A map of scope name to token types.'),
					type: 'object',
					additionalProperties: {
						enum: ['string', 'comment', 'other']
					}
				},
				injectTo: {
					description: nls.localize('vscode.extension.contributes.grammars.injectTo', 'List of language scope names to which this grammar is injected to.'),
					type: 'array',
					items: {
						type: 'string'
					}
				},
				balancedBracketScopes: {
					description: nls.localize('vscode.extension.contributes.grammars.balancedBracketScopes', 'Defines which scope names contain balanced brackets.'),
					type: 'array',
					items: {
						type: 'string'
					},
					default: ['*'],
				},
				unbalancedBracketScopes: {
					description: nls.localize('vscode.extension.contributes.grammars.unbalancedBracketScopes', 'Defines which scope names do not contain balanced brackets.'),
					type: 'array',
					items: {
						type: 'string'
					},
					default: [],
				},
			},
			required: ['scopeName', 'path']
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/textMate/common/TMHelper.ts]---
Location: vscode-main/src/vs/workbench/services/textMate/common/TMHelper.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface IColorTheme {
	readonly tokenColors: ITokenColorizationRule[];
}

export interface ITokenColorizationRule {
	name?: string;
	scope?: string | string[];
	settings: ITokenColorizationSetting;
}

export interface ITokenColorizationSetting {
	foreground?: string;
	background?: string;
	fontStyle?: string;  // italic, underline, strikethrough, bold
}

export function findMatchingThemeRule(theme: IColorTheme, scopes: string[], onlyColorRules: boolean = true): ThemeRule | null {
	for (let i = scopes.length - 1; i >= 0; i--) {
		const parentScopes = scopes.slice(0, i);
		const scope = scopes[i];
		const r = findMatchingThemeRule2(theme, scope, parentScopes, onlyColorRules);
		if (r) {
			return r;
		}
	}
	return null;
}

function findMatchingThemeRule2(theme: IColorTheme, scope: string, parentScopes: string[], onlyColorRules: boolean): ThemeRule | null {
	let result: ThemeRule | null = null;

	// Loop backwards, to ensure the last most specific rule wins
	for (let i = theme.tokenColors.length - 1; i >= 0; i--) {
		const rule = theme.tokenColors[i];
		if (onlyColorRules && !rule.settings.foreground) {
			continue;
		}

		let selectors: string[];
		if (typeof rule.scope === 'string') {
			selectors = rule.scope.split(/,/).map(scope => scope.trim());
		} else if (Array.isArray(rule.scope)) {
			selectors = rule.scope;
		} else {
			continue;
		}

		for (let j = 0, lenJ = selectors.length; j < lenJ; j++) {
			const rawSelector = selectors[j];

			const themeRule = new ThemeRule(rawSelector, rule.settings);
			if (themeRule.matches(scope, parentScopes)) {
				if (themeRule.isMoreSpecific(result)) {
					result = themeRule;
				}
			}
		}
	}

	return result;
}

export class ThemeRule {
	readonly rawSelector: string;
	readonly settings: ITokenColorizationSetting;
	readonly scope: string;
	readonly parentScopes: string[];

	constructor(rawSelector: string, settings: ITokenColorizationSetting) {
		this.rawSelector = rawSelector;
		this.settings = settings;
		const rawSelectorPieces = this.rawSelector.split(/ /);
		this.scope = rawSelectorPieces[rawSelectorPieces.length - 1];
		this.parentScopes = rawSelectorPieces.slice(0, rawSelectorPieces.length - 1);
	}

	public matches(scope: string, parentScopes: string[]): boolean {
		return ThemeRule._matches(this.scope, this.parentScopes, scope, parentScopes);
	}

	private static _cmp(a: ThemeRule | null, b: ThemeRule | null): number {
		if (a === null && b === null) {
			return 0;
		}
		if (a === null) {
			// b > a
			return -1;
		}
		if (b === null) {
			// a > b
			return 1;
		}
		if (a.scope.length !== b.scope.length) {
			// longer scope length > shorter scope length
			return a.scope.length - b.scope.length;
		}
		const aParentScopesLen = a.parentScopes.length;
		const bParentScopesLen = b.parentScopes.length;
		if (aParentScopesLen !== bParentScopesLen) {
			// more parents > less parents
			return aParentScopesLen - bParentScopesLen;
		}
		for (let i = 0; i < aParentScopesLen; i++) {
			const aLen = a.parentScopes[i].length;
			const bLen = b.parentScopes[i].length;
			if (aLen !== bLen) {
				return aLen - bLen;
			}
		}
		return 0;
	}

	public isMoreSpecific(other: ThemeRule | null): boolean {
		return (ThemeRule._cmp(this, other) > 0);
	}

	private static _matchesOne(selectorScope: string, scope: string): boolean {
		const selectorPrefix = selectorScope + '.';
		if (selectorScope === scope || scope.substring(0, selectorPrefix.length) === selectorPrefix) {
			return true;
		}
		return false;
	}

	private static _matches(selectorScope: string, selectorParentScopes: string[], scope: string, parentScopes: string[]): boolean {
		if (!this._matchesOne(selectorScope, scope)) {
			return false;
		}

		let selectorParentIndex = selectorParentScopes.length - 1;
		let parentIndex = parentScopes.length - 1;
		while (selectorParentIndex >= 0 && parentIndex >= 0) {
			if (this._matchesOne(selectorParentScopes[selectorParentIndex], parentScopes[parentIndex])) {
				selectorParentIndex--;
			}
			parentIndex--;
		}

		if (selectorParentIndex === -1) {
			return true;
		}
		return false;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/textMate/common/TMScopeRegistry.ts]---
Location: vscode-main/src/vs/workbench/services/textMate/common/TMScopeRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as resources from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { LanguageId, StandardTokenType } from '../../../../editor/common/encodedTokenAttributes.js';

export interface IValidGrammarDefinition {
	location: URI;
	language?: string;
	scopeName: string;
	embeddedLanguages: IValidEmbeddedLanguagesMap;
	tokenTypes: IValidTokenTypeMap;
	injectTo?: string[];
	balancedBracketSelectors: string[];
	unbalancedBracketSelectors: string[];
	sourceExtensionId?: string;
}

export interface IValidTokenTypeMap {
	[selector: string]: StandardTokenType;
}

export interface IValidEmbeddedLanguagesMap {
	[scopeName: string]: LanguageId;
}

export class TMScopeRegistry {

	private _scopeNameToLanguageRegistration: { [scopeName: string]: IValidGrammarDefinition };

	constructor() {
		this._scopeNameToLanguageRegistration = Object.create(null);
	}

	public reset(): void {
		this._scopeNameToLanguageRegistration = Object.create(null);
	}

	public register(def: IValidGrammarDefinition): void {
		if (this._scopeNameToLanguageRegistration[def.scopeName]) {
			const existingRegistration = this._scopeNameToLanguageRegistration[def.scopeName];
			if (!resources.isEqual(existingRegistration.location, def.location)) {
				console.warn(
					`Overwriting grammar scope name to file mapping for scope ${def.scopeName}.\n` +
					`Old grammar file: ${existingRegistration.location.toString()}.\n` +
					`New grammar file: ${def.location.toString()}`
				);
			}
		}
		this._scopeNameToLanguageRegistration[def.scopeName] = def;
	}

	public getGrammarDefinition(scopeName: string): IValidGrammarDefinition | null {
		return this._scopeNameToLanguageRegistration[scopeName] || null;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/textMate/test/browser/arrayOperation.test.ts]---
Location: vscode-main/src/vs/workbench/services/textMate/test/browser/arrayOperation.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { MonotonousIndexTransformer } from '../../browser/indexTransformer.js';
import { LengthEdit, LengthReplacement } from '../../../../../editor/common/core/edits/lengthEdit.js';

suite('array operation', () => {
	function seq(start: number, end: number) {
		const result: number[] = [];
		for (let i = start; i < end; i++) {
			result.push(i);
		}
		return result;
	}

	test('simple', () => {
		const edit = LengthEdit.create([
			LengthReplacement.create(4, 7, 2),
			LengthReplacement.create(8, 8, 2),
			LengthReplacement.create(9, 11, 0),
		]);

		const arr = seq(0, 15).map(x => `item${x}`);
		const newArr = edit.applyArray(arr, undefined);
		assert.deepStrictEqual(newArr, [
			'item0',
			'item1',
			'item2',
			'item3',
			undefined,
			undefined,
			'item7',
			undefined,
			undefined,
			'item8',
			'item11',
			'item12',
			'item13',
			'item14',
		]);

		const transformer = new MonotonousIndexTransformer(edit);
		assert.deepStrictEqual(
			seq(0, 15).map((x) => {
				const t = transformer.transform(x);
				let r = `arr[${x}]: ${arr[x]} -> `;
				if (t !== undefined) {
					r += `newArr[${t}]: ${newArr[t]}`;
				} else {
					r += 'undefined';
				}
				return r;
			}),
			[
				'arr[0]: item0 -> newArr[0]: item0',
				'arr[1]: item1 -> newArr[1]: item1',
				'arr[2]: item2 -> newArr[2]: item2',
				'arr[3]: item3 -> newArr[3]: item3',
				'arr[4]: item4 -> undefined',
				'arr[5]: item5 -> undefined',
				'arr[6]: item6 -> undefined',
				'arr[7]: item7 -> newArr[6]: item7',
				'arr[8]: item8 -> newArr[9]: item8',
				'arr[9]: item9 -> undefined',
				'arr[10]: item10 -> undefined',
				'arr[11]: item11 -> newArr[10]: item11',
				'arr[12]: item12 -> newArr[11]: item12',
				'arr[13]: item13 -> newArr[12]: item13',
				'arr[14]: item14 -> newArr[13]: item14',
			]
		);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/textmodelResolver/common/textModelResolverService.ts]---
Location: vscode-main/src/vs/workbench/services/textmodelResolver/common/textModelResolverService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { IDisposable, toDisposable, IReference, ReferenceCollection, Disposable, AsyncReferenceCollection } from '../../../../base/common/lifecycle.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { TextResourceEditorModel } from '../../../common/editor/textResourceEditorModel.js';
import { ITextFileService, TextFileResolveReason } from '../../textfile/common/textfiles.js';
import { Schemas } from '../../../../base/common/network.js';
import { ITextModelService, ITextModelContentProvider, ITextEditorModel, IResolvedTextEditorModel, isResolvedTextEditorModel } from '../../../../editor/common/services/resolverService.js';
import { TextFileEditorModel } from '../../textfile/common/textFileEditorModel.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IUndoRedoService } from '../../../../platform/undoRedo/common/undoRedo.js';
import { ModelUndoRedoParticipant } from '../../../../editor/common/services/modelUndoRedoParticipant.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { UntitledTextEditorModel } from '../../untitled/common/untitledTextEditorModel.js';

class ResourceModelCollection extends ReferenceCollection<Promise<IResolvedTextEditorModel>> {

	private readonly providers = new Map<string, ITextModelContentProvider[]>();
	private readonly modelsToDispose = new Set<string>();

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ITextFileService private readonly textFileService: ITextFileService,
		@IFileService private readonly fileService: IFileService,
		@IModelService private readonly modelService: IModelService
	) {
		super();
	}

	protected createReferencedObject(key: string): Promise<IResolvedTextEditorModel> {
		return this.doCreateReferencedObject(key);
	}

	private async doCreateReferencedObject(key: string, skipActivateProvider?: boolean): Promise<IResolvedTextEditorModel> {

		// Untrack as being disposed
		this.modelsToDispose.delete(key);

		// inMemory Schema: go through model service cache
		const resource = URI.parse(key);
		if (resource.scheme === Schemas.inMemory) {
			const cachedModel = this.modelService.getModel(resource);
			if (!cachedModel) {
				throw new Error(`Unable to resolve inMemory resource ${key}`);
			}

			const model = this.instantiationService.createInstance(TextResourceEditorModel, resource);
			if (this.ensureResolvedModel(model, key)) {
				return model;
			}
		}

		// Untitled Schema: go through untitled text service
		if (resource.scheme === Schemas.untitled) {
			const model = await this.textFileService.untitled.resolve({ untitledResource: resource });
			if (this.ensureResolvedModel(model, key)) {
				return model;
			}
		}

		// File or remote file: go through text file service
		if (this.fileService.hasProvider(resource)) {
			const model = await this.textFileService.files.resolve(resource, { reason: TextFileResolveReason.REFERENCE });
			if (this.ensureResolvedModel(model, key)) {
				return model;
			}
		}

		// Virtual documents
		if (this.providers.has(resource.scheme)) {
			await this.resolveTextModelContent(key);

			const model = this.instantiationService.createInstance(TextResourceEditorModel, resource);
			if (this.ensureResolvedModel(model, key)) {
				return model;
			}
		}

		// Either unknown schema, or not yet registered, try to activate
		if (!skipActivateProvider) {
			await this.fileService.activateProvider(resource.scheme);

			return this.doCreateReferencedObject(key, true);
		}

		throw new Error(`Unable to resolve resource ${key}`);
	}

	private ensureResolvedModel(model: ITextEditorModel, key: string): model is IResolvedTextEditorModel {
		if (isResolvedTextEditorModel(model)) {
			return true;
		}

		throw new Error(`Unable to resolve resource ${key}`);
	}

	protected destroyReferencedObject(key: string, modelPromise: Promise<ITextEditorModel>): void {

		// inMemory is bound to a different lifecycle
		const resource = URI.parse(key);
		if (resource.scheme === Schemas.inMemory) {
			return;
		}

		// Track as being disposed before waiting for model to load
		// to handle the case that the reference is acquired again
		this.modelsToDispose.add(key);

		(async () => {
			try {
				const model = await modelPromise;

				if (!this.modelsToDispose.has(key)) {
					// return if model has been acquired again meanwhile
					return;
				}

				if (model instanceof TextFileEditorModel) {
					// text file models have conditions that prevent them
					// from dispose, so we have to wait until we can dispose
					await this.textFileService.files.canDispose(model);
				} else if (model instanceof UntitledTextEditorModel) {
					// untitled file models have conditions that prevent them
					// from dispose, so we have to wait until we can dispose
					await this.textFileService.untitled.canDispose(model);
				}

				if (!this.modelsToDispose.has(key)) {
					// return if model has been acquired again meanwhile
					return;
				}

				// Finally we can dispose the model
				model.dispose();
			} catch (error) {
				// ignore
			} finally {
				this.modelsToDispose.delete(key); // Untrack as being disposed
			}
		})();
	}

	registerTextModelContentProvider(scheme: string, provider: ITextModelContentProvider): IDisposable {
		let providers = this.providers.get(scheme);
		if (!providers) {
			providers = [];
			this.providers.set(scheme, providers);
		}

		providers.unshift(provider);

		return toDisposable(() => {
			const providersForScheme = this.providers.get(scheme);
			if (!providersForScheme) {
				return;
			}

			const index = providersForScheme.indexOf(provider);
			if (index === -1) {
				return;
			}

			providersForScheme.splice(index, 1);

			if (providersForScheme.length === 0) {
				this.providers.delete(scheme);
			}
		});
	}

	hasTextModelContentProvider(scheme: string): boolean {
		return this.providers.get(scheme) !== undefined;
	}

	private async resolveTextModelContent(key: string): Promise<ITextModel> {
		const resource = URI.parse(key);
		const providersForScheme = this.providers.get(resource.scheme) || [];

		for (const provider of providersForScheme) {
			const value = await provider.provideTextContent(resource);
			if (value) {
				return value;
			}
		}

		throw new Error(`Unable to resolve text model content for resource ${key}`);
	}
}

export class TextModelResolverService extends Disposable implements ITextModelService {

	declare readonly _serviceBrand: undefined;

	private _resourceModelCollection: ResourceModelCollection & ReferenceCollection<Promise<IResolvedTextEditorModel>> /* TS Fail */ | undefined = undefined;
	private get resourceModelCollection() {
		if (!this._resourceModelCollection) {
			this._resourceModelCollection = this.instantiationService.createInstance(ResourceModelCollection);
		}

		return this._resourceModelCollection;
	}

	private _asyncModelCollection: AsyncReferenceCollection<IResolvedTextEditorModel> | undefined = undefined;
	private get asyncModelCollection() {
		if (!this._asyncModelCollection) {
			this._asyncModelCollection = new AsyncReferenceCollection(this.resourceModelCollection);
		}

		return this._asyncModelCollection;
	}

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IFileService private readonly fileService: IFileService,
		@IUndoRedoService private readonly undoRedoService: IUndoRedoService,
		@IModelService private readonly modelService: IModelService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
	) {
		super();

		this._register(new ModelUndoRedoParticipant(this.modelService, this, this.undoRedoService));
	}

	async createModelReference(resource: URI): Promise<IReference<IResolvedTextEditorModel>> {

		// From this moment on, only operate on the canonical resource
		// to ensure we reduce the chance of resolving the same resource
		// with different resource forms (e.g. path casing on Windows)
		resource = this.uriIdentityService.asCanonicalUri(resource);

		return await this.asyncModelCollection.acquire(resource.toString());
	}

	registerTextModelContentProvider(scheme: string, provider: ITextModelContentProvider): IDisposable {
		return this.resourceModelCollection.registerTextModelContentProvider(scheme, provider);
	}

	canHandleResource(resource: URI): boolean {
		if (this.fileService.hasProvider(resource) || resource.scheme === Schemas.untitled || resource.scheme === Schemas.inMemory) {
			return true; // we handle file://, untitled:// and inMemory:// automatically
		}

		return this.resourceModelCollection.hasTextModelContentProvider(resource.scheme);
	}
}

registerSingleton(ITextModelService, TextModelResolverService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/textmodelResolver/test/browser/textModelResolverService.test.ts]---
Location: vscode-main/src/vs/workbench/services/textmodelResolver/test/browser/textModelResolverService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ITextModel } from '../../../../../editor/common/model.js';
import { URI } from '../../../../../base/common/uri.js';
import { TextResourceEditorInput } from '../../../../common/editor/textResourceEditorInput.js';
import { TextResourceEditorModel } from '../../../../common/editor/textResourceEditorModel.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { workbenchInstantiationService, TestServiceAccessor, ITestTextFileEditorModelManager } from '../../../../test/browser/workbenchTestServices.js';
import { ensureNoDisposablesAreLeakedInTestSuite, toResource } from '../../../../../base/test/common/utils.js';
import { TextFileEditorModel } from '../../../textfile/common/textFileEditorModel.js';
import { snapshotToString } from '../../../textfile/common/textfiles.js';
import { TextFileEditorModelManager } from '../../../textfile/common/textFileEditorModelManager.js';
import { Event } from '../../../../../base/common/event.js';
import { timeout } from '../../../../../base/common/async.js';
import { UntitledTextEditorInput } from '../../../untitled/common/untitledTextEditorInput.js';
import { createTextBufferFactory } from '../../../../../editor/common/model/textModel.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';

suite('Workbench - TextModelResolverService', () => {

	const disposables = new DisposableStore();
	let instantiationService: IInstantiationService;
	let accessor: TestServiceAccessor;

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables);
		accessor = instantiationService.createInstance(TestServiceAccessor);
		disposables.add(<TextFileEditorModelManager>accessor.textFileService.files);
	});

	teardown(() => {
		disposables.clear();
	});

	test('resolve resource', async () => {
		disposables.add(accessor.textModelResolverService.registerTextModelContentProvider('test', {
			provideTextContent: async function (resource: URI): Promise<ITextModel | null> {
				if (resource.scheme === 'test') {
					const modelContent = 'Hello Test';
					const languageSelection = accessor.languageService.createById('json');

					return accessor.modelService.createModel(modelContent, languageSelection, resource);
				}

				return null;
			}
		}));

		const resource = URI.from({ scheme: 'test', authority: null!, path: 'thePath' });
		const input = instantiationService.createInstance(TextResourceEditorInput, resource, 'The Name', 'The Description', undefined, undefined);

		const model = disposables.add(await input.resolve());
		assert.ok(model);
		assert.strictEqual(snapshotToString(((model as TextResourceEditorModel).createSnapshot()!)), 'Hello Test');
		let disposed = false;
		const disposedPromise = new Promise<void>(resolve => {
			Event.once(model.onWillDispose)(() => {
				disposed = true;
				resolve();
			});
		});
		input.dispose();

		await disposedPromise;
		assert.strictEqual(disposed, true);
	});

	test('resolve file', async function () {
		const textModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/file_resolver.txt'), 'utf8', undefined));
		(<ITestTextFileEditorModelManager>accessor.textFileService.files).add(textModel.resource, textModel);

		await textModel.resolve();

		const ref = await accessor.textModelResolverService.createModelReference(textModel.resource);

		const model = ref.object;
		const editorModel = model.textEditorModel;

		assert.ok(editorModel);
		assert.strictEqual(editorModel.getValue(), 'Hello Html');

		let disposed = false;
		Event.once(model.onWillDispose)(() => {
			disposed = true;
		});

		ref.dispose();
		await timeout(0);  // due to the reference resolving the model first which is async
		assert.strictEqual(disposed, true);
	});

	test('resolved dirty file eventually disposes', async function () {
		const textModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/file_resolver.txt'), 'utf8', undefined));
		(<ITestTextFileEditorModelManager>accessor.textFileService.files).add(textModel.resource, textModel);

		await textModel.resolve();

		textModel.updateTextEditorModel(createTextBufferFactory('make dirty'));

		const ref = await accessor.textModelResolverService.createModelReference(textModel.resource);

		let disposed = false;
		Event.once(textModel.onWillDispose)(() => {
			disposed = true;
		});

		ref.dispose();
		await timeout(0);
		assert.strictEqual(disposed, false); // not disposed because model still dirty

		textModel.revert();

		await timeout(0);
		assert.strictEqual(disposed, true); // now disposed because model got reverted
	});

	test('resolved dirty file does not dispose when new reference created', async function () {
		const textModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/file_resolver.txt'), 'utf8', undefined));
		(<ITestTextFileEditorModelManager>accessor.textFileService.files).add(textModel.resource, textModel);

		await textModel.resolve();

		textModel.updateTextEditorModel(createTextBufferFactory('make dirty'));

		const ref1 = await accessor.textModelResolverService.createModelReference(textModel.resource);

		let disposed = false;
		Event.once(textModel.onWillDispose)(() => {
			disposed = true;
		});

		ref1.dispose();
		await timeout(0);
		assert.strictEqual(disposed, false); // not disposed because model still dirty

		const ref2 = await accessor.textModelResolverService.createModelReference(textModel.resource);

		textModel.revert();

		await timeout(0);
		assert.strictEqual(disposed, false); // not disposed because we got another ref meanwhile

		ref2.dispose();

		await timeout(0);
		assert.strictEqual(disposed, true); // now disposed because last ref got disposed
	});

	test('resolve untitled', async () => {
		const service = accessor.untitledTextEditorService;
		const untitledModel = disposables.add(service.create());
		const input = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, untitledModel));

		await input.resolve();
		const ref = await accessor.textModelResolverService.createModelReference(input.resource);
		const model = ref.object;
		assert.strictEqual(untitledModel, model);
		const editorModel = model.textEditorModel;
		assert.ok(editorModel);
		ref.dispose();
		input.dispose();
		model.dispose();
	});

	test('even loading documents should be refcounted', async () => {
		let resolveModel!: Function;
		const waitForIt = new Promise(resolve => resolveModel = resolve);

		disposables.add(accessor.textModelResolverService.registerTextModelContentProvider('test', {
			provideTextContent: async (resource: URI): Promise<ITextModel> => {
				await waitForIt;

				const modelContent = 'Hello Test';
				const languageSelection = accessor.languageService.createById('json');
				return disposables.add(accessor.modelService.createModel(modelContent, languageSelection, resource));
			}
		}));

		const uri = URI.from({ scheme: 'test', authority: null!, path: 'thePath' });

		const modelRefPromise1 = accessor.textModelResolverService.createModelReference(uri);
		const modelRefPromise2 = accessor.textModelResolverService.createModelReference(uri);

		resolveModel();

		const modelRef1 = await modelRefPromise1;
		const model1 = modelRef1.object;
		const modelRef2 = await modelRefPromise2;
		const model2 = modelRef2.object;
		const textModel = model1.textEditorModel;

		assert.strictEqual(model1, model2, 'they are the same model');
		assert(!textModel.isDisposed(), 'the text model should not be disposed');

		modelRef1.dispose();
		assert(!textModel.isDisposed(), 'the text model should still not be disposed');

		const p1 = new Promise<void>(resolve => disposables.add(textModel.onWillDispose(resolve)));
		modelRef2.dispose();

		await p1;
		assert(textModel.isDisposed(), 'the text model should finally be disposed');
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/textresourceProperties/common/textResourcePropertiesService.ts]---
Location: vscode-main/src/vs/workbench/services/textresourceProperties/common/textResourcePropertiesService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ITextResourcePropertiesService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { OperatingSystem, OS } from '../../../../base/common/platform.js';
import { Schemas } from '../../../../base/common/network.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IRemoteAgentEnvironment } from '../../../../platform/remote/common/remoteAgentEnvironment.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';

export class TextResourcePropertiesService implements ITextResourcePropertiesService {

	declare readonly _serviceBrand: undefined;

	private remoteEnvironment: IRemoteAgentEnvironment | null = null;

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IStorageService private readonly storageService: IStorageService
	) {
		remoteAgentService.getEnvironment().then(remoteEnv => this.remoteEnvironment = remoteEnv);
	}

	getEOL(resource?: URI, language?: string): string {
		const eol = this.configurationService.getValue('files.eol', { overrideIdentifier: language, resource });
		if (eol && typeof eol === 'string' && eol !== 'auto') {
			return eol;
		}
		const os = this.getOS(resource);
		return os === OperatingSystem.Linux || os === OperatingSystem.Macintosh ? '\n' : '\r\n';
	}

	private getOS(resource?: URI): OperatingSystem {
		let os = OS;

		const remoteAuthority = this.environmentService.remoteAuthority;
		if (remoteAuthority) {
			if (resource && resource.scheme !== Schemas.file) {
				const osCacheKey = `resource.authority.os.${remoteAuthority}`;
				os = this.remoteEnvironment ? this.remoteEnvironment.os : /* Get it from cache */ this.storageService.getNumber(osCacheKey, StorageScope.WORKSPACE, OS);
				this.storageService.store(osCacheKey, os, StorageScope.WORKSPACE, StorageTarget.MACHINE);
			}
		}

		return os;
	}
}

registerSingleton(ITextResourcePropertiesService, TextResourcePropertiesService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/themes/browser/browserHostColorSchemeService.ts]---
Location: vscode-main/src/vs/workbench/services/themes/browser/browserHostColorSchemeService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { addMatchMediaChangeListener } from '../../../../base/browser/browser.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IHostColorSchemeService } from '../common/hostColorSchemeService.js';
import { mainWindow } from '../../../../base/browser/window.js';

export class BrowserHostColorSchemeService extends Disposable implements IHostColorSchemeService {

	declare readonly _serviceBrand: undefined;

	private readonly _onDidSchemeChangeEvent = this._register(new Emitter<void>());

	constructor(
	) {
		super();

		this.registerListeners();
	}

	private registerListeners(): void {

		addMatchMediaChangeListener(mainWindow, '(prefers-color-scheme: dark)', () => {
			this._onDidSchemeChangeEvent.fire();
		});
		addMatchMediaChangeListener(mainWindow, '(forced-colors: active)', () => {
			this._onDidSchemeChangeEvent.fire();
		});
	}

	get onDidChangeColorScheme(): Event<void> {
		return this._onDidSchemeChangeEvent.event;
	}

	get dark(): boolean {
		if (mainWindow.matchMedia(`(prefers-color-scheme: light)`).matches) {
			return false;
		} else if (mainWindow.matchMedia(`(prefers-color-scheme: dark)`).matches) {
			return true;
		}
		return false;
	}

	get highContrast(): boolean {
		if (mainWindow.matchMedia(`(forced-colors: active)`).matches) {
			return true;
		}
		return false;
	}

}

registerSingleton(IHostColorSchemeService, BrowserHostColorSchemeService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/themes/browser/fileIconThemeData.ts]---
Location: vscode-main/src/vs/workbench/services/themes/browser/fileIconThemeData.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import * as nls from '../../../../nls.js';
import * as paths from '../../../../base/common/path.js';
import * as resources from '../../../../base/common/resources.js';
import * as Json from '../../../../base/common/json.js';
import { ExtensionData, IThemeExtensionPoint, IWorkbenchFileIconTheme } from '../common/workbenchThemeService.js';
import { getParseErrorMessage } from '../../../../base/common/jsonErrorMessages.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IExtensionResourceLoaderService } from '../../../../platform/extensionResourceLoader/common/extensionResourceLoader.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { fontColorRegex, fontSizeRegex } from '../../../../platform/theme/common/iconRegistry.js';
import * as css from '../../../../base/browser/cssValue.js';
import { fileIconSelectorEscape } from '../../../../editor/common/services/getIconClasses.js';

export class FileIconThemeData implements IWorkbenchFileIconTheme {

	static readonly STORAGE_KEY = 'iconThemeData';

	id: string;
	label: string;
	settingsId: string | null;
	description?: string;
	hasFileIcons: boolean;
	hasFolderIcons: boolean;
	hidesExplorerArrows: boolean;
	isLoaded: boolean;
	location?: URI;
	extensionData?: ExtensionData;
	watch?: boolean;

	styleSheetContent?: string;

	private constructor(id: string, label: string, settingsId: string | null) {
		this.id = id;
		this.label = label;
		this.settingsId = settingsId;
		this.isLoaded = false;
		this.hasFileIcons = false;
		this.hasFolderIcons = false;
		this.hidesExplorerArrows = false;
	}

	public ensureLoaded(themeLoader: FileIconThemeLoader): Promise<string | undefined> {
		return !this.isLoaded ? this.load(themeLoader) : Promise.resolve(this.styleSheetContent);
	}

	public reload(themeLoader: FileIconThemeLoader): Promise<string | undefined> {
		return this.load(themeLoader);
	}

	private load(themeLoader: FileIconThemeLoader): Promise<string | undefined> {
		return themeLoader.load(this);
	}

	static fromExtensionTheme(iconTheme: IThemeExtensionPoint, iconThemeLocation: URI, extensionData: ExtensionData): FileIconThemeData {
		const id = extensionData.extensionId + '-' + iconTheme.id;
		const label = iconTheme.label || paths.basename(iconTheme.path);
		const settingsId = iconTheme.id;

		const themeData = new FileIconThemeData(id, label, settingsId);

		themeData.description = iconTheme.description;
		themeData.location = iconThemeLocation;
		themeData.extensionData = extensionData;
		themeData.watch = iconTheme._watch;
		themeData.isLoaded = false;
		return themeData;
	}

	private static _noIconTheme: FileIconThemeData | null = null;

	static get noIconTheme(): FileIconThemeData {
		let themeData = FileIconThemeData._noIconTheme;
		if (!themeData) {
			themeData = FileIconThemeData._noIconTheme = new FileIconThemeData('', '', null);
			themeData.hasFileIcons = false;
			themeData.hasFolderIcons = false;
			themeData.hidesExplorerArrows = false;
			themeData.isLoaded = true;
			themeData.extensionData = undefined;
			themeData.watch = false;
		}
		return themeData;
	}

	static createUnloadedTheme(id: string): FileIconThemeData {
		const themeData = new FileIconThemeData(id, '', '__' + id);
		themeData.isLoaded = false;
		themeData.hasFileIcons = false;
		themeData.hasFolderIcons = false;
		themeData.hidesExplorerArrows = false;
		themeData.extensionData = undefined;
		themeData.watch = false;
		return themeData;
	}


	static fromStorageData(storageService: IStorageService): FileIconThemeData | undefined {
		const input = storageService.get(FileIconThemeData.STORAGE_KEY, StorageScope.PROFILE);
		if (!input) {
			return undefined;
		}
		try {
			const data = JSON.parse(input);
			const theme = new FileIconThemeData('', '', null);
			for (const key in data) {
				switch (key) {
					case 'id':
					case 'label':
					case 'description':
					case 'settingsId':
					case 'styleSheetContent':
					case 'hasFileIcons':
					case 'hidesExplorerArrows':
					case 'hasFolderIcons':
					case 'watch':
						// eslint-disable-next-line local/code-no-any-casts
						(theme as any)[key] = data[key];
						break;
					case 'location':
						// ignore, no longer restore
						break;
					case 'extensionData':
						theme.extensionData = ExtensionData.fromJSONObject(data.extensionData);
						break;
				}
			}
			return theme;
		} catch (e) {
			return undefined;
		}
	}

	toStorage(storageService: IStorageService) {
		const data = JSON.stringify({
			id: this.id,
			label: this.label,
			description: this.description,
			settingsId: this.settingsId,
			styleSheetContent: this.styleSheetContent,
			hasFileIcons: this.hasFileIcons,
			hasFolderIcons: this.hasFolderIcons,
			hidesExplorerArrows: this.hidesExplorerArrows,
			extensionData: ExtensionData.toJSONObject(this.extensionData),
			watch: this.watch
		});
		storageService.store(FileIconThemeData.STORAGE_KEY, data, StorageScope.PROFILE, StorageTarget.MACHINE);
	}
}

interface IconDefinition {
	iconPath: string;
	fontColor: string;
	fontCharacter: string;
	fontSize: string;
	fontId: string;
}

interface FontDefinition {
	id: string;
	weight: string;
	style: string;
	size: string;
	src: { path: string; format: string }[];
}

interface IconsAssociation {
	folder?: string;
	file?: string;
	folderExpanded?: string;
	rootFolder?: string;
	rootFolderExpanded?: string;
	rootFolderNames?: { [folderName: string]: string };
	rootFolderNamesExpanded?: { [folderName: string]: string };
	folderNames?: { [folderName: string]: string };
	folderNamesExpanded?: { [folderName: string]: string };
	fileExtensions?: { [extension: string]: string };
	fileNames?: { [fileName: string]: string };
	languageIds?: { [languageId: string]: string };
}

interface IconThemeDocument extends IconsAssociation {
	iconDefinitions: { [key: string]: IconDefinition };
	fonts: FontDefinition[];
	light?: IconsAssociation;
	highContrast?: IconsAssociation;
	hidesExplorerArrows?: boolean;
	showLanguageModeIcons?: boolean;
}

export class FileIconThemeLoader {

	constructor(
		private readonly fileService: IExtensionResourceLoaderService,
		private readonly languageService: ILanguageService
	) {
	}

	public load(data: FileIconThemeData): Promise<string | undefined> {
		if (!data.location) {
			return Promise.resolve(data.styleSheetContent);
		}
		return this.loadIconThemeDocument(data.location).then(iconThemeDocument => {
			const result = this.processIconThemeDocument(data.id, data.location!, iconThemeDocument);
			data.styleSheetContent = result.content;
			data.hasFileIcons = result.hasFileIcons;
			data.hasFolderIcons = result.hasFolderIcons;
			data.hidesExplorerArrows = result.hidesExplorerArrows;
			data.isLoaded = true;
			return data.styleSheetContent;
		});
	}

	private loadIconThemeDocument(location: URI): Promise<IconThemeDocument> {
		return this.fileService.readExtensionResource(location).then((content) => {
			const errors: Json.ParseError[] = [];
			const contentValue = Json.parse(content, errors);
			if (errors.length > 0) {
				return Promise.reject(new Error(nls.localize('error.cannotparseicontheme', "Problems parsing file icons file: {0}", errors.map(e => getParseErrorMessage(e.error)).join(', '))));
			} else if (Json.getNodeType(contentValue) !== 'object') {
				return Promise.reject(new Error(nls.localize('error.invalidformat', "Invalid format for file icons theme file: Object expected.")));
			}
			return Promise.resolve(contentValue);
		});
	}

	private processIconThemeDocument(id: string, iconThemeDocumentLocation: URI, iconThemeDocument: IconThemeDocument): { content: string; hasFileIcons: boolean; hasFolderIcons: boolean; hidesExplorerArrows: boolean } {

		const result = { content: '', hasFileIcons: false, hasFolderIcons: false, hidesExplorerArrows: !!iconThemeDocument.hidesExplorerArrows };

		let hasSpecificFileIcons = false;

		if (!iconThemeDocument.iconDefinitions) {
			return result;
		}
		const selectorByDefinitionId: { [def: string]: css.Builder } = {};
		const coveredLanguages: { [languageId: string]: boolean } = {};

		const iconThemeDocumentLocationDirname = resources.dirname(iconThemeDocumentLocation);
		function resolvePath(path: string) {
			return resources.joinPath(iconThemeDocumentLocationDirname, path);
		}

		function collectSelectors(associations: IconsAssociation | undefined, baseThemeClassName?: css.CssFragment) {
			function addSelector(selector: css.CssFragment, defId: string) {
				if (defId) {
					let list = selectorByDefinitionId[defId];
					if (!list) {
						list = selectorByDefinitionId[defId] = new css.Builder();
					}
					list.push(selector);
				}
			}

			if (associations) {
				let qualifier = css.inline`.show-file-icons`;
				if (baseThemeClassName) {
					qualifier = css.inline`${baseThemeClassName} ${qualifier}`;
				}

				const expanded = css.inline`.monaco-tl-twistie.collapsible:not(.collapsed) + .monaco-tl-contents`;

				if (associations.folder) {
					addSelector(css.inline`${qualifier} .folder-icon::before`, associations.folder);
					result.hasFolderIcons = true;
				}

				if (associations.folderExpanded) {
					addSelector(css.inline`${qualifier} ${expanded} .folder-icon::before`, associations.folderExpanded);
					result.hasFolderIcons = true;
				}

				const rootFolder = associations.rootFolder || associations.folder;
				const rootFolderExpanded = associations.rootFolderExpanded || associations.folderExpanded;

				if (rootFolder) {
					addSelector(css.inline`${qualifier} .rootfolder-icon::before`, rootFolder);
					result.hasFolderIcons = true;
				}

				if (rootFolderExpanded) {
					addSelector(css.inline`${qualifier} ${expanded} .rootfolder-icon::before`, rootFolderExpanded);
					result.hasFolderIcons = true;
				}

				if (associations.file) {
					addSelector(css.inline`${qualifier} .file-icon::before`, associations.file);
					result.hasFileIcons = true;
				}

				const folderNames = associations.folderNames;
				if (folderNames) {
					for (const key in folderNames) {
						const selectors = new css.Builder();
						const name = handleParentFolder(key.toLowerCase(), selectors);
						selectors.push(css.inline`.${classSelectorPart(name)}-name-folder-icon`);
						addSelector(css.inline`${qualifier} ${selectors.join('')}.folder-icon::before`, folderNames[key]);
						result.hasFolderIcons = true;
					}
				}
				const folderNamesExpanded = associations.folderNamesExpanded;
				if (folderNamesExpanded) {
					for (const key in folderNamesExpanded) {
						const selectors = new css.Builder();
						const name = handleParentFolder(key.toLowerCase(), selectors);
						selectors.push(css.inline`.${classSelectorPart(name)}-name-folder-icon`);
						addSelector(css.inline`${qualifier} ${expanded} ${selectors.join('')}.folder-icon::before`, folderNamesExpanded[key]);
						result.hasFolderIcons = true;
					}
				}

				const rootFolderNames = associations.rootFolderNames;
				if (rootFolderNames) {
					for (const key in rootFolderNames) {
						const name = key.toLowerCase();
						addSelector(css.inline`${qualifier} .${classSelectorPart(name)}-root-name-folder-icon.rootfolder-icon::before`, rootFolderNames[key]);
						result.hasFolderIcons = true;
					}
				}
				const rootFolderNamesExpanded = associations.rootFolderNamesExpanded;
				if (rootFolderNamesExpanded) {
					for (const key in rootFolderNamesExpanded) {
						const name = key.toLowerCase();
						addSelector(css.inline`${qualifier} ${expanded} .${classSelectorPart(name)}-root-name-folder-icon.rootfolder-icon::before`, rootFolderNamesExpanded[key]);
						result.hasFolderIcons = true;
					}
				}

				const languageIds = associations.languageIds;
				if (languageIds) {
					if (!languageIds.jsonc && languageIds.json) {
						languageIds.jsonc = languageIds.json;
					}
					for (const languageId in languageIds) {
						addSelector(css.inline`${qualifier} .${classSelectorPart(languageId)}-lang-file-icon.file-icon::before`, languageIds[languageId]);
						result.hasFileIcons = true;
						hasSpecificFileIcons = true;
						coveredLanguages[languageId] = true;
					}
				}
				const fileExtensions = associations.fileExtensions;
				if (fileExtensions) {
					for (const key in fileExtensions) {
						const selectors = new css.Builder();
						const name = handleParentFolder(key.toLowerCase(), selectors);
						const segments = name.split('.');
						if (segments.length) {
							for (let i = 0; i < segments.length; i++) {
								selectors.push(css.inline`.${classSelectorPart(segments.slice(i).join('.'))}-ext-file-icon`);
							}
							selectors.push(css.inline`.ext-file-icon`); // extra segment to increase file-ext score
						}
						addSelector(css.inline`${qualifier} ${selectors.join('')}.file-icon::before`, fileExtensions[key]);
						result.hasFileIcons = true;
						hasSpecificFileIcons = true;
					}
				}
				const fileNames = associations.fileNames;
				if (fileNames) {
					for (const key in fileNames) {
						const selectors = new css.Builder();
						const fileName = handleParentFolder(key.toLowerCase(), selectors);
						selectors.push(css.inline`.${classSelectorPart(fileName)}-name-file-icon`);
						selectors.push(css.inline`.name-file-icon`); // extra segment to increase file-name score
						const segments = fileName.split('.');
						if (segments.length) {
							for (let i = 1; i < segments.length; i++) {
								selectors.push(css.inline`.${classSelectorPart(segments.slice(i).join('.'))}-ext-file-icon`);
							}
							selectors.push(css.inline`.ext-file-icon`); // extra segment to increase file-ext score
						}
						addSelector(css.inline`${qualifier} ${selectors.join('')}.file-icon::before`, fileNames[key]);
						result.hasFileIcons = true;
						hasSpecificFileIcons = true;
					}
				}
			}
		}
		collectSelectors(iconThemeDocument);
		collectSelectors(iconThemeDocument.light, css.inline`.vs`);
		collectSelectors(iconThemeDocument.highContrast, css.inline`.hc-black`);
		collectSelectors(iconThemeDocument.highContrast, css.inline`.hc-light`);

		if (!result.hasFileIcons && !result.hasFolderIcons) {
			return result;
		}

		const showLanguageModeIcons = iconThemeDocument.showLanguageModeIcons === true || (hasSpecificFileIcons && iconThemeDocument.showLanguageModeIcons !== false);

		const cssRules = new css.Builder();

		const fonts = iconThemeDocument.fonts;
		const fontSizes = new Map<string, string>();
		if (Array.isArray(fonts)) {
			const defaultFontSize = this.tryNormalizeFontSize(fonts[0].size) || '150%';
			fonts.forEach(font => {
				const fontSrcs = new css.Builder();
				fontSrcs.push(...font.src.map(l => css.inline`${css.asCSSUrl(resolvePath(l.path))} format(${css.stringValue(l.format)})`));
				cssRules.push(css.inline`@font-face { src: ${fontSrcs.join(', ')}; font-family: ${css.stringValue(font.id)}; font-weight: ${css.identValue(font.weight)}; font-style: ${css.identValue(font.style)}; font-display: block; }`);

				const fontSize = this.tryNormalizeFontSize(font.size);
				if (fontSize !== undefined && fontSize !== defaultFontSize) {
					fontSizes.set(font.id, fontSize);
				}
			});
			cssRules.push(css.inline`.show-file-icons .file-icon::before, .show-file-icons .folder-icon::before, .show-file-icons .rootfolder-icon::before { font-family: ${css.stringValue(fonts[0].id)}; font-size: ${css.sizeValue(defaultFontSize)}; }`);
		}

		// Use emQuads to prevent the icon from collapsing to zero height for image icons
		const emQuad = css.stringValue('\\2001');

		for (const defId in selectorByDefinitionId) {
			const selectors = selectorByDefinitionId[defId];
			const definition = iconThemeDocument.iconDefinitions[defId];
			if (definition) {
				if (definition.iconPath) {
					cssRules.push(css.inline`${selectors.join(', ')} { content: ${emQuad}; background-image: ${css.asCSSUrl(resolvePath(definition.iconPath))}; }`);
				} else if (definition.fontCharacter || definition.fontColor) {
					const body = new css.Builder();
					if (definition.fontColor && definition.fontColor.match(fontColorRegex)) {
						body.push(css.inline`color: ${css.hexColorValue(definition.fontColor)};`);
					}
					if (definition.fontCharacter) {
						body.push(css.inline`content: ${css.stringValue(definition.fontCharacter)};`);
					}
					const fontSize = definition.fontSize ?? (definition.fontId ? fontSizes.get(definition.fontId) : undefined);
					if (fontSize && fontSize.match(fontSizeRegex)) {
						body.push(css.inline`font-size: ${css.sizeValue(fontSize)};`);
					}
					if (definition.fontId) {
						body.push(css.inline`font-family: ${css.stringValue(definition.fontId)};`);
					}
					if (showLanguageModeIcons) {
						body.push(css.inline`background-image: unset;`); // potentially set by the language default
					}
					cssRules.push(css.inline`${selectors.join(', ')} { ${body.join(' ')} }`);
				}
			}
		}

		if (showLanguageModeIcons) {
			for (const languageId of this.languageService.getRegisteredLanguageIds()) {
				if (!coveredLanguages[languageId]) {
					const icon = this.languageService.getIcon(languageId);
					if (icon) {
						const selector = css.inline`.show-file-icons .${classSelectorPart(languageId)}-lang-file-icon.file-icon::before`;
						cssRules.push(css.inline`${selector} { content: ${emQuad}; background-image: ${css.asCSSUrl(icon.dark)}; }`);
						cssRules.push(css.inline`.vs ${selector} { content: ${emQuad}; background-image: ${css.asCSSUrl(icon.light)}; }`);
					}
				}
			}
		}

		result.content = cssRules.join('\n');
		return result;
	}

	/**
	 * Try converting absolute font sizes to relative values.
	 *
	 * This allows them to be scaled nicely depending on where they are used.
	 */
	private tryNormalizeFontSize(size: string | undefined): string | undefined {
		if (!size) {
			return undefined;
		}

		const defaultFontSizeInPx = 13;

		if (size.endsWith('px')) {
			const value = parseInt(size, 10);
			if (!isNaN(value)) {
				return Math.round((value / defaultFontSizeInPx) * 100) + '%';
			}
		}

		return size;
	}
}

function handleParentFolder(key: string, selectors: css.Builder): string {
	const lastIndexOfSlash = key.lastIndexOf('/');
	if (lastIndexOfSlash >= 0) {
		const parentFolder = key.substring(0, lastIndexOfSlash);
		selectors.push(css.inline`.${classSelectorPart(parentFolder)}-name-dir-icon`);
		return key.substring(lastIndexOfSlash + 1);
	}
	return key;
}

function classSelectorPart(str: string): css.CssFragment {
	str = fileIconSelectorEscape(str);
	return css.className(str, true);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/themes/browser/productIconThemeData.ts]---
Location: vscode-main/src/vs/workbench/services/themes/browser/productIconThemeData.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import * as nls from '../../../../nls.js';
import * as Paths from '../../../../base/common/path.js';
import * as resources from '../../../../base/common/resources.js';
import * as Json from '../../../../base/common/json.js';
import { ExtensionData, IThemeExtensionPoint, IWorkbenchProductIconTheme, ThemeSettingDefaults } from '../common/workbenchThemeService.js';
import { getParseErrorMessage } from '../../../../base/common/jsonErrorMessages.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { isObject, isString } from '../../../../base/common/types.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IconDefinition, getIconRegistry, IconContribution, IconFontDefinition, IconFontSource, fontIdRegex, fontWeightRegex, fontStyleRegex, fontFormatRegex } from '../../../../platform/theme/common/iconRegistry.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IExtensionResourceLoaderService } from '../../../../platform/extensionResourceLoader/common/extensionResourceLoader.js';

export const DEFAULT_PRODUCT_ICON_THEME_ID = ''; // TODO

export class ProductIconThemeData implements IWorkbenchProductIconTheme {

	static readonly STORAGE_KEY = 'productIconThemeData';

	id: string;
	label: string;
	settingsId: string;
	description?: string;
	isLoaded: boolean;
	location?: URI;
	extensionData?: ExtensionData;
	watch?: boolean;

	iconThemeDocument: ProductIconThemeDocument = { iconDefinitions: new Map() };
	styleSheetContent?: string;

	private constructor(id: string, label: string, settingsId: string) {
		this.id = id;
		this.label = label;
		this.settingsId = settingsId;
		this.isLoaded = false;
	}

	public getIcon(iconContribution: IconContribution): IconDefinition | undefined {
		return _resolveIconDefinition(iconContribution, this.iconThemeDocument);
	}

	public ensureLoaded(fileService: IExtensionResourceLoaderService, logService: ILogService): Promise<string | undefined> {
		return !this.isLoaded ? this.load(fileService, logService) : Promise.resolve(this.styleSheetContent);
	}

	public reload(fileService: IExtensionResourceLoaderService, logService: ILogService): Promise<string | undefined> {
		return this.load(fileService, logService);
	}

	private async load(fileService: IExtensionResourceLoaderService, logService: ILogService): Promise<string | undefined> {
		const location = this.location;
		if (!location) {
			return Promise.resolve(this.styleSheetContent);
		}
		const warnings: string[] = [];
		this.iconThemeDocument = await _loadProductIconThemeDocument(fileService, location, warnings);
		this.isLoaded = true;
		if (warnings.length) {
			logService.error(nls.localize('error.parseicondefs', "Problems processing product icons definitions in {0}:\n{1}", location.toString(), warnings.join('\n')));
		}
		return this.styleSheetContent;
	}

	static fromExtensionTheme(iconTheme: IThemeExtensionPoint, iconThemeLocation: URI, extensionData: ExtensionData): ProductIconThemeData {
		const id = extensionData.extensionId + '-' + iconTheme.id;
		const label = iconTheme.label || Paths.basename(iconTheme.path);
		const settingsId = iconTheme.id;

		const themeData = new ProductIconThemeData(id, label, settingsId);

		themeData.description = iconTheme.description;
		themeData.location = iconThemeLocation;
		themeData.extensionData = extensionData;
		themeData.watch = iconTheme._watch;
		themeData.isLoaded = false;
		return themeData;
	}

	static createUnloadedTheme(id: string): ProductIconThemeData {
		const themeData = new ProductIconThemeData(id, '', '__' + id);
		themeData.isLoaded = false;
		themeData.extensionData = undefined;
		themeData.watch = false;
		return themeData;
	}

	private static _defaultProductIconTheme: ProductIconThemeData | null = null;

	static get defaultTheme(): ProductIconThemeData {
		let themeData = ProductIconThemeData._defaultProductIconTheme;
		if (!themeData) {
			themeData = ProductIconThemeData._defaultProductIconTheme = new ProductIconThemeData(DEFAULT_PRODUCT_ICON_THEME_ID, nls.localize('defaultTheme', 'Default'), ThemeSettingDefaults.PRODUCT_ICON_THEME);
			themeData.isLoaded = true;
			themeData.extensionData = undefined;
			themeData.watch = false;
		}
		return themeData;
	}

	static fromStorageData(storageService: IStorageService): ProductIconThemeData | undefined {
		const input = storageService.get(ProductIconThemeData.STORAGE_KEY, StorageScope.PROFILE);
		if (!input) {
			return undefined;
		}
		try {
			const data = JSON.parse(input);
			const theme = new ProductIconThemeData('', '', '');
			for (const key in data) {
				switch (key) {
					case 'id':
					case 'label':
					case 'description':
					case 'settingsId':
					case 'styleSheetContent':
					case 'watch':
						// eslint-disable-next-line local/code-no-any-casts
						(theme as any)[key] = data[key];
						break;
					case 'location':
						// ignore, no longer restore
						break;
					case 'extensionData':
						theme.extensionData = ExtensionData.fromJSONObject(data.extensionData);
						break;
				}
			}
			const { iconDefinitions, iconFontDefinitions } = data;
			if (Array.isArray(iconDefinitions) && isObject(iconFontDefinitions)) {
				const restoredIconDefinitions = new Map<string, IconDefinition>();
				for (const entry of iconDefinitions) {
					const { id, fontCharacter, fontId } = entry;
					if (isString(id) && isString(fontCharacter)) {
						if (isString(fontId)) {
							const iconFontDefinition = IconFontDefinition.fromJSONObject(iconFontDefinitions[fontId]);
							if (iconFontDefinition) {
								restoredIconDefinitions.set(id, { fontCharacter, font: { id: fontId, definition: iconFontDefinition } });
							}
						} else {
							restoredIconDefinitions.set(id, { fontCharacter });
						}
					}
				}
				theme.iconThemeDocument = { iconDefinitions: restoredIconDefinitions };
			}
			return theme;
		} catch (e) {
			return undefined;
		}
	}

	toStorage(storageService: IStorageService) {
		const iconDefinitions = [];
		const iconFontDefinitions: { [id: string]: IconFontDefinition } = {};
		for (const entry of this.iconThemeDocument.iconDefinitions.entries()) {
			const font = entry[1].font;
			iconDefinitions.push({ id: entry[0], fontCharacter: entry[1].fontCharacter, fontId: font?.id });
			if (font && iconFontDefinitions[font.id] === undefined) {
				iconFontDefinitions[font.id] = IconFontDefinition.toJSONObject(font.definition);
			}
		}
		const data = JSON.stringify({
			id: this.id,
			label: this.label,
			description: this.description,
			settingsId: this.settingsId,
			styleSheetContent: this.styleSheetContent,
			watch: this.watch,
			extensionData: ExtensionData.toJSONObject(this.extensionData),
			iconDefinitions,
			iconFontDefinitions
		});
		storageService.store(ProductIconThemeData.STORAGE_KEY, data, StorageScope.PROFILE, StorageTarget.MACHINE);
	}
}

interface ProductIconThemeDocument {
	iconDefinitions: Map<string, IconDefinition>;
}

function _loadProductIconThemeDocument(fileService: IExtensionResourceLoaderService, location: URI, warnings: string[]): Promise<ProductIconThemeDocument> {
	return fileService.readExtensionResource(location).then((content) => {
		const parseErrors: Json.ParseError[] = [];
		const contentValue = Json.parse(content, parseErrors);
		if (parseErrors.length > 0) {
			return Promise.reject(new Error(nls.localize('error.cannotparseicontheme', "Problems parsing product icons file: {0}", parseErrors.map(e => getParseErrorMessage(e.error)).join(', '))));
		} else if (Json.getNodeType(contentValue) !== 'object') {
			return Promise.reject(new Error(nls.localize('error.invalidformat', "Invalid format for product icons theme file: Object expected.")));
		} else if (!contentValue.iconDefinitions || !Array.isArray(contentValue.fonts) || !contentValue.fonts.length) {
			return Promise.reject(new Error(nls.localize('error.missingProperties', "Invalid format for product icons theme file: Must contain iconDefinitions and fonts.")));
		}

		const iconThemeDocumentLocationDirname = resources.dirname(location);

		const sanitizedFonts: Map<string, IconFontDefinition> = new Map();
		for (const font of contentValue.fonts) {
			const fontId = font.id;
			if (isString(fontId) && fontId.match(fontIdRegex)) {

				let fontWeight = undefined;
				if (isString(font.weight) && font.weight.match(fontWeightRegex)) {
					fontWeight = font.weight;
				} else {
					warnings.push(nls.localize('error.fontWeight', 'Invalid font weight in font \'{0}\'. Ignoring setting.', font.id));
				}

				let fontStyle = undefined;
				if (isString(font.style) && font.style.match(fontStyleRegex)) {
					fontStyle = font.style;
				} else {
					warnings.push(nls.localize('error.fontStyle', 'Invalid font style in font \'{0}\'. Ignoring setting.', font.id));
				}

				const sanitizedSrc: IconFontSource[] = [];
				if (Array.isArray(font.src)) {
					for (const s of font.src) {
						if (isString(s.path) && isString(s.format) && s.format.match(fontFormatRegex)) {
							const iconFontLocation = resources.joinPath(iconThemeDocumentLocationDirname, s.path);
							sanitizedSrc.push({ location: iconFontLocation, format: s.format });
						} else {
							warnings.push(nls.localize('error.fontSrc', 'Invalid font source in font \'{0}\'. Ignoring source.', font.id));
						}
					}
				}
				if (sanitizedSrc.length) {
					sanitizedFonts.set(fontId, { weight: fontWeight, style: fontStyle, src: sanitizedSrc });
				} else {
					warnings.push(nls.localize('error.noFontSrc', 'No valid font source in font \'{0}\'. Ignoring font definition.', font.id));
				}
			} else {
				warnings.push(nls.localize('error.fontId', 'Missing or invalid font id \'{0}\'. Skipping font definition.', font.id));
			}
		}


		const iconDefinitions = new Map<string, IconDefinition>();

		const primaryFontId = contentValue.fonts[0].id as string;

		for (const iconId in contentValue.iconDefinitions) {
			const definition = contentValue.iconDefinitions[iconId];
			if (isString(definition.fontCharacter)) {
				const fontId = definition.fontId ?? primaryFontId;
				const fontDefinition = sanitizedFonts.get(fontId);
				if (fontDefinition) {

					const font = { id: `pi-${fontId}`, definition: fontDefinition };
					iconDefinitions.set(iconId, { fontCharacter: definition.fontCharacter, font });
				} else {
					warnings.push(nls.localize('error.icon.font', 'Skipping icon definition \'{0}\'. Unknown font.', iconId));
				}
			} else {
				warnings.push(nls.localize('error.icon.fontCharacter', 'Skipping icon definition \'{0}\': Needs to be defined', iconId));
			}
		}
		return { iconDefinitions };
	});
}

const iconRegistry = getIconRegistry();

function _resolveIconDefinition(iconContribution: IconContribution, iconThemeDocument: ProductIconThemeDocument): IconDefinition | undefined {
	const iconDefinitions = iconThemeDocument.iconDefinitions;
	let definition: IconDefinition | undefined = iconDefinitions.get(iconContribution.id);
	let defaults = iconContribution.defaults;
	while (!definition && ThemeIcon.isThemeIcon(defaults)) {
		// look if an inherited icon has a definition
		const ic = iconRegistry.getIcon(defaults.id);
		if (ic) {
			definition = iconDefinitions.get(ic.id);
			defaults = ic.defaults;
		} else {
			return undefined;
		}
	}
	if (definition) {
		return definition;
	}
	if (!ThemeIcon.isThemeIcon(defaults)) {
		return defaults;
	}
	return undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/themes/browser/workbenchThemeService.ts]---
Location: vscode-main/src/vs/workbench/services/themes/browser/workbenchThemeService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import * as types from '../../../../base/common/types.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { IWorkbenchThemeService, IWorkbenchColorTheme, IWorkbenchFileIconTheme, ExtensionData, ThemeSettings, IWorkbenchProductIconTheme, ThemeSettingTarget, ThemeSettingDefaults, COLOR_THEME_DARK_INITIAL_COLORS, COLOR_THEME_LIGHT_INITIAL_COLORS } from '../common/workbenchThemeService.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import * as errors from '../../../../base/common/errors.js';
import { IConfigurationService, ConfigurationTarget } from '../../../../platform/configuration/common/configuration.js';
import { ColorThemeData } from '../common/colorThemeData.js';
import { IColorTheme, Extensions as ThemingExtensions, IThemingRegistry } from '../../../../platform/theme/common/themeService.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { registerFileIconThemeSchemas } from '../common/fileIconThemeSchema.js';
import { IDisposable, Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { FileIconThemeData, FileIconThemeLoader } from './fileIconThemeData.js';
import { createStyleSheet } from '../../../../base/browser/domStylesheets.js';
import { IBrowserWorkbenchEnvironmentService } from '../../environment/browser/environmentService.js';
import { IFileService, FileChangeType } from '../../../../platform/files/common/files.js';
import { URI } from '../../../../base/common/uri.js';
import * as resources from '../../../../base/common/resources.js';
import { registerColorThemeSchemas } from '../common/colorThemeSchema.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { getRemoteAuthority } from '../../../../platform/remote/common/remoteHosts.js';
import { IWorkbenchLayoutService } from '../../layout/browser/layoutService.js';
import { IExtensionResourceLoaderService } from '../../../../platform/extensionResourceLoader/common/extensionResourceLoader.js';
import { ThemeRegistry, registerColorThemeExtensionPoint, registerFileIconThemeExtensionPoint, registerProductIconThemeExtensionPoint } from '../common/themeExtensionPoints.js';
import { updateColorThemeConfigurationSchemas, updateFileIconThemeConfigurationSchemas, ThemeConfiguration, updateProductIconThemeConfigurationSchemas } from '../common/themeConfiguration.js';
import { ProductIconThemeData, DEFAULT_PRODUCT_ICON_THEME_ID } from './productIconThemeData.js';
import { registerProductIconThemeSchemas } from '../common/productIconThemeSchema.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { isWeb } from '../../../../base/common/platform.js';
import { ColorScheme, ThemeTypeSelector } from '../../../../platform/theme/common/theme.js';
import { IHostColorSchemeService } from '../common/hostColorSchemeService.js';
import { RunOnceScheduler, Sequencer } from '../../../../base/common/async.js';
import { IUserDataInitializationService } from '../../userData/browser/userDataInit.js';
import { getIconsStyleSheet } from '../../../../platform/theme/browser/iconsStyleSheet.js';
import { asCssVariableName, getColorRegistry } from '../../../../platform/theme/common/colorRegistry.js';
import { asCssVariableName as asSizeCssVariableName, getSizeRegistry, sizeValueToCss } from '../../../../platform/theme/common/sizeRegistry.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { mainWindow } from '../../../../base/browser/window.js';

// implementation

const defaultThemeExtensionId = 'vscode-theme-defaults';

const DEFAULT_FILE_ICON_THEME_ID = 'vscode.vscode-theme-seti-vs-seti';
const fileIconsEnabledClass = 'file-icons-enabled';

const colorThemeRulesClassName = 'contributedColorTheme';
const fileIconThemeRulesClassName = 'contributedFileIconTheme';
const productIconThemeRulesClassName = 'contributedProductIconTheme';

const themingRegistry = Registry.as<IThemingRegistry>(ThemingExtensions.ThemingContribution);

function validateThemeId(theme: string): string {
	// migrations
	switch (theme) {
		case ThemeTypeSelector.VS: return `vs ${defaultThemeExtensionId}-themes-light_vs-json`;
		case ThemeTypeSelector.VS_DARK: return `vs-dark ${defaultThemeExtensionId}-themes-dark_vs-json`;
		case ThemeTypeSelector.HC_BLACK: return `hc-black ${defaultThemeExtensionId}-themes-hc_black-json`;
		case ThemeTypeSelector.HC_LIGHT: return `hc-light ${defaultThemeExtensionId}-themes-hc_light-json`;
	}
	return theme;
}

const colorThemesExtPoint = registerColorThemeExtensionPoint();
const fileIconThemesExtPoint = registerFileIconThemeExtensionPoint();
const productIconThemesExtPoint = registerProductIconThemeExtensionPoint();

export class WorkbenchThemeService extends Disposable implements IWorkbenchThemeService {
	declare readonly _serviceBrand: undefined;

	private readonly container: HTMLElement;
	private settings: ThemeConfiguration;

	private readonly colorThemeRegistry: ThemeRegistry<ColorThemeData>;
	private currentColorTheme: ColorThemeData;
	private readonly onColorThemeChange: Emitter<IWorkbenchColorTheme>;
	private readonly colorThemeWatcher: ThemeFileWatcher;
	private colorThemingParticipantChangeListener: IDisposable | undefined;
	private readonly colorThemeSequencer: Sequencer;

	private readonly fileIconThemeRegistry: ThemeRegistry<FileIconThemeData>;
	private currentFileIconTheme: FileIconThemeData;
	private readonly onFileIconThemeChange: Emitter<IWorkbenchFileIconTheme>;
	private readonly fileIconThemeLoader: FileIconThemeLoader;
	private readonly fileIconThemeWatcher: ThemeFileWatcher;
	private readonly fileIconThemeSequencer: Sequencer;

	private readonly productIconThemeRegistry: ThemeRegistry<ProductIconThemeData>;
	private currentProductIconTheme: ProductIconThemeData;
	private readonly onProductIconThemeChange: Emitter<IWorkbenchProductIconTheme>;
	private readonly productIconThemeWatcher: ThemeFileWatcher;
	private readonly productIconThemeSequencer: Sequencer;

	constructor(
		@IExtensionService extensionService: IExtensionService,
		@IStorageService private readonly storageService: IStorageService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IBrowserWorkbenchEnvironmentService private readonly environmentService: IBrowserWorkbenchEnvironmentService,
		@IFileService fileService: IFileService,
		@IExtensionResourceLoaderService private readonly extensionResourceLoaderService: IExtensionResourceLoaderService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@ILogService private readonly logService: ILogService,
		@IHostColorSchemeService private readonly hostColorService: IHostColorSchemeService,
		@IUserDataInitializationService private readonly userDataInitializationService: IUserDataInitializationService,
		@ILanguageService private readonly languageService: ILanguageService
	) {
		super();
		this.container = layoutService.mainContainer;
		this.settings = new ThemeConfiguration(configurationService, hostColorService);

		this.colorThemeRegistry = this._register(new ThemeRegistry(colorThemesExtPoint, ColorThemeData.fromExtensionTheme));
		this.colorThemeWatcher = this._register(new ThemeFileWatcher(fileService, environmentService, this.reloadCurrentColorTheme.bind(this)));
		this.onColorThemeChange = new Emitter<IWorkbenchColorTheme>({ leakWarningThreshold: 400 });
		this.currentColorTheme = ColorThemeData.createUnloadedTheme('');
		this.colorThemeSequencer = new Sequencer();

		this.fileIconThemeWatcher = this._register(new ThemeFileWatcher(fileService, environmentService, this.reloadCurrentFileIconTheme.bind(this)));
		this.fileIconThemeRegistry = this._register(new ThemeRegistry(fileIconThemesExtPoint, FileIconThemeData.fromExtensionTheme, true, FileIconThemeData.noIconTheme));
		this.fileIconThemeLoader = new FileIconThemeLoader(extensionResourceLoaderService, languageService);
		this.onFileIconThemeChange = new Emitter<IWorkbenchFileIconTheme>({ leakWarningThreshold: 400 });
		this.currentFileIconTheme = FileIconThemeData.createUnloadedTheme('');
		this.fileIconThemeSequencer = new Sequencer();

		this.productIconThemeWatcher = this._register(new ThemeFileWatcher(fileService, environmentService, this.reloadCurrentProductIconTheme.bind(this)));
		this.productIconThemeRegistry = this._register(new ThemeRegistry(productIconThemesExtPoint, ProductIconThemeData.fromExtensionTheme, true, ProductIconThemeData.defaultTheme));
		this.onProductIconThemeChange = new Emitter<IWorkbenchProductIconTheme>();
		this.currentProductIconTheme = ProductIconThemeData.createUnloadedTheme('');
		this.productIconThemeSequencer = new Sequencer();

		this._register(this.onDidColorThemeChange(theme => getColorRegistry().notifyThemeUpdate(theme)));

		// In order to avoid paint flashing for tokens, because
		// themes are loaded asynchronously, we need to initialize
		// a color theme document with good defaults until the theme is loaded
		let themeData: ColorThemeData | undefined = ColorThemeData.fromStorageData(this.storageService);
		const colorThemeSetting = this.settings.colorTheme;
		if (themeData && colorThemeSetting !== themeData.settingsId) {
			themeData = undefined;
		}

		const defaultColorMap = colorThemeSetting === ThemeSettingDefaults.COLOR_THEME_LIGHT ? COLOR_THEME_LIGHT_INITIAL_COLORS : colorThemeSetting === ThemeSettingDefaults.COLOR_THEME_DARK ? COLOR_THEME_DARK_INITIAL_COLORS : undefined;
		if (!themeData) {
			const initialColorTheme = environmentService.options?.initialColorTheme;
			if (initialColorTheme) {
				themeData = ColorThemeData.createUnloadedThemeForThemeType(initialColorTheme.themeType, initialColorTheme.colors ?? defaultColorMap);
			}
		}
		if (!themeData) {
			const colorScheme = this.settings.getPreferredColorScheme() ?? (isWeb ? ColorScheme.LIGHT : ColorScheme.DARK);
			themeData = ColorThemeData.createUnloadedThemeForThemeType(colorScheme, defaultColorMap);
		}
		themeData.setCustomizations(this.settings);
		this.applyTheme(themeData, undefined, true);

		const fileIconData = FileIconThemeData.fromStorageData(this.storageService);
		if (fileIconData) {
			this.applyAndSetFileIconTheme(fileIconData, true);
		}

		const productIconData = ProductIconThemeData.fromStorageData(this.storageService);
		if (productIconData) {
			this.applyAndSetProductIconTheme(productIconData, true);
		}

		extensionService.whenInstalledExtensionsRegistered().then(_ => {
			this.installConfigurationListener();
			this.installPreferredSchemeListener();
			this.installRegistryListeners();
			this.initialize().catch(errors.onUnexpectedError);
		});

		const codiconStyleSheet = createStyleSheet();
		codiconStyleSheet.id = 'codiconStyles';

		const iconsStyleSheet = this._register(getIconsStyleSheet(this));
		function updateAll() {
			codiconStyleSheet.textContent = iconsStyleSheet.getCSS();
		}

		const delayer = this._register(new RunOnceScheduler(updateAll, 0));
		this._register(iconsStyleSheet.onDidChange(() => delayer.schedule()));
		delayer.schedule();
	}

	private initialize(): Promise<[IWorkbenchColorTheme | null, IWorkbenchFileIconTheme | null, IWorkbenchProductIconTheme | null]> {
		const extDevLocs = this.environmentService.extensionDevelopmentLocationURI;
		const extDevLoc = extDevLocs && extDevLocs.length === 1 ? extDevLocs[0] : undefined; // in dev mode, switch to a theme provided by the extension under dev.

		const initializeColorTheme = async () => {
			const devThemes = this.colorThemeRegistry.findThemeByExtensionLocation(extDevLoc);
			if (devThemes.length) {
				const matchedColorTheme = devThemes.find(theme => theme.type === this.currentColorTheme.type);
				return this.setColorTheme(matchedColorTheme ? matchedColorTheme.id : devThemes[0].id, undefined);
			}
			let theme = this.colorThemeRegistry.findThemeBySettingsId(this.settings.colorTheme, undefined);
			if (!theme) {
				// If the current theme is not available, first make sure setting sync is complete
				await this.userDataInitializationService.whenInitializationFinished();
				// try to get the theme again, now with a fallback to the default themes
				const fallbackTheme = this.currentColorTheme.type === ColorScheme.LIGHT ? ThemeSettingDefaults.COLOR_THEME_LIGHT : ThemeSettingDefaults.COLOR_THEME_DARK;
				theme = this.colorThemeRegistry.findThemeBySettingsId(this.settings.colorTheme, fallbackTheme);
			}
			return this.setColorTheme(theme && theme.id, undefined);
		};

		const initializeFileIconTheme = async () => {
			const devThemes = this.fileIconThemeRegistry.findThemeByExtensionLocation(extDevLoc);
			if (devThemes.length) {
				return this.setFileIconTheme(devThemes[0].id, ConfigurationTarget.MEMORY);
			}
			let theme = this.fileIconThemeRegistry.findThemeBySettingsId(this.settings.fileIconTheme);
			if (!theme) {
				// If the current theme is not available, first make sure setting sync is complete
				await this.userDataInitializationService.whenInitializationFinished();
				theme = this.fileIconThemeRegistry.findThemeBySettingsId(this.settings.fileIconTheme);
			}
			return this.setFileIconTheme(theme ? theme.id : DEFAULT_FILE_ICON_THEME_ID, undefined);
		};

		const initializeProductIconTheme = async () => {
			const devThemes = this.productIconThemeRegistry.findThemeByExtensionLocation(extDevLoc);
			if (devThemes.length) {
				return this.setProductIconTheme(devThemes[0].id, ConfigurationTarget.MEMORY);
			}
			let theme = this.productIconThemeRegistry.findThemeBySettingsId(this.settings.productIconTheme);
			if (!theme) {
				// If the current theme is not available, first make sure setting sync is complete
				await this.userDataInitializationService.whenInitializationFinished();
				theme = this.productIconThemeRegistry.findThemeBySettingsId(this.settings.productIconTheme);
			}
			return this.setProductIconTheme(theme ? theme.id : DEFAULT_PRODUCT_ICON_THEME_ID, undefined);
		};


		return Promise.all([initializeColorTheme(), initializeFileIconTheme(), initializeProductIconTheme()]);
	}

	private installConfigurationListener() {
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(ThemeSettings.COLOR_THEME)
				|| e.affectsConfiguration(ThemeSettings.PREFERRED_DARK_THEME)
				|| e.affectsConfiguration(ThemeSettings.PREFERRED_LIGHT_THEME)
				|| e.affectsConfiguration(ThemeSettings.PREFERRED_HC_DARK_THEME)
				|| e.affectsConfiguration(ThemeSettings.PREFERRED_HC_LIGHT_THEME)
				|| e.affectsConfiguration(ThemeSettings.DETECT_COLOR_SCHEME)
				|| e.affectsConfiguration(ThemeSettings.DETECT_HC)
				|| e.affectsConfiguration(ThemeSettings.SYSTEM_COLOR_THEME)
			) {
				this.restoreColorTheme();
			}
			if (e.affectsConfiguration(ThemeSettings.FILE_ICON_THEME)) {
				this.restoreFileIconTheme();
			}
			if (e.affectsConfiguration(ThemeSettings.PRODUCT_ICON_THEME)) {
				this.restoreProductIconTheme();
			}
			if (this.currentColorTheme) {
				let hasColorChanges = false;
				if (e.affectsConfiguration(ThemeSettings.COLOR_CUSTOMIZATIONS)) {
					this.currentColorTheme.setCustomColors(this.settings.colorCustomizations);
					hasColorChanges = true;
				}
				if (e.affectsConfiguration(ThemeSettings.TOKEN_COLOR_CUSTOMIZATIONS)) {
					this.currentColorTheme.setCustomTokenColors(this.settings.tokenColorCustomizations);
					hasColorChanges = true;
				}
				if (e.affectsConfiguration(ThemeSettings.SEMANTIC_TOKEN_COLOR_CUSTOMIZATIONS)) {
					this.currentColorTheme.setCustomSemanticTokenColors(this.settings.semanticTokenColorCustomizations);
					hasColorChanges = true;
				}
				if (hasColorChanges) {
					this.updateDynamicCSSRules(this.currentColorTheme);
					this.onColorThemeChange.fire(this.currentColorTheme);
				}
			}
		}));
	}

	private installRegistryListeners(): Promise<void> {

		let prevColorId: string | undefined = undefined;

		// update settings schema setting for theme specific settings
		this._register(this.colorThemeRegistry.onDidChange(async event => {
			updateColorThemeConfigurationSchemas(event.themes);
			if (await this.restoreColorTheme()) { // checks if theme from settings exists and is set
				// restore theme
				if (this.currentColorTheme.settingsId === ThemeSettingDefaults.COLOR_THEME_DARK && !types.isUndefined(prevColorId) && await this.colorThemeRegistry.findThemeById(prevColorId)) {
					await this.setColorTheme(prevColorId, 'auto');
					prevColorId = undefined;
				} else if (event.added.some(t => t.settingsId === this.currentColorTheme.settingsId)) {
					await this.reloadCurrentColorTheme();
				}
			} else if (event.removed.some(t => t.settingsId === this.currentColorTheme.settingsId)) {
				// current theme is no longer available
				prevColorId = this.currentColorTheme.id;
				const defaultTheme = this.colorThemeRegistry.findThemeBySettingsId(ThemeSettingDefaults.COLOR_THEME_DARK);
				await this.setColorTheme(defaultTheme, 'auto');
			}
		}));

		let prevFileIconId: string | undefined = undefined;
		this._register(this._register(this.fileIconThemeRegistry.onDidChange(async event => {
			updateFileIconThemeConfigurationSchemas(event.themes);
			if (await this.restoreFileIconTheme()) { // checks if theme from settings exists and is set
				// restore theme
				if (this.currentFileIconTheme.id === DEFAULT_FILE_ICON_THEME_ID && !types.isUndefined(prevFileIconId) && this.fileIconThemeRegistry.findThemeById(prevFileIconId)) {
					await this.setFileIconTheme(prevFileIconId, 'auto');
					prevFileIconId = undefined;
				} else if (event.added.some(t => t.settingsId === this.currentFileIconTheme.settingsId)) {
					await this.reloadCurrentFileIconTheme();
				}
			} else if (event.removed.some(t => t.settingsId === this.currentFileIconTheme.settingsId)) {
				// current theme is no longer available
				prevFileIconId = this.currentFileIconTheme.id;
				await this.setFileIconTheme(DEFAULT_FILE_ICON_THEME_ID, 'auto');
			}

		})));

		let prevProductIconId: string | undefined = undefined;
		this._register(this.productIconThemeRegistry.onDidChange(async event => {
			updateProductIconThemeConfigurationSchemas(event.themes);
			if (await this.restoreProductIconTheme()) { // checks if theme from settings exists and is set
				// restore theme
				if (this.currentProductIconTheme.id === DEFAULT_PRODUCT_ICON_THEME_ID && !types.isUndefined(prevProductIconId) && this.productIconThemeRegistry.findThemeById(prevProductIconId)) {
					await this.setProductIconTheme(prevProductIconId, 'auto');
					prevProductIconId = undefined;
				} else if (event.added.some(t => t.settingsId === this.currentProductIconTheme.settingsId)) {
					await this.reloadCurrentProductIconTheme();
				}
			} else if (event.removed.some(t => t.settingsId === this.currentProductIconTheme.settingsId)) {
				// current theme is no longer available
				prevProductIconId = this.currentProductIconTheme.id;
				await this.setProductIconTheme(DEFAULT_PRODUCT_ICON_THEME_ID, 'auto');
			}
		}));
		this._register(this.languageService.onDidChange(() => this.reloadCurrentFileIconTheme()));

		return Promise.all([this.getColorThemes(), this.getFileIconThemes(), this.getProductIconThemes()]).then(([ct, fit, pit]) => {
			updateColorThemeConfigurationSchemas(ct);
			updateFileIconThemeConfigurationSchemas(fit);
			updateProductIconThemeConfigurationSchemas(pit);
		});
	}


	// preferred scheme handling

	private installPreferredSchemeListener() {
		this._register(this.hostColorService.onDidChangeColorScheme(() => {
			if (this.settings.isDetectingColorScheme()) {
				this.restoreColorTheme();
			}
		}));
	}

	public getColorTheme(): IWorkbenchColorTheme {
		return this.currentColorTheme;
	}

	public async getColorThemes(): Promise<IWorkbenchColorTheme[]> {
		return this.colorThemeRegistry.getThemes();
	}

	public getPreferredColorScheme(): ColorScheme | undefined {
		return this.settings.getPreferredColorScheme();
	}

	public async getMarketplaceColorThemes(publisher: string, name: string, version: string): Promise<IWorkbenchColorTheme[]> {
		const extensionLocation = await this.extensionResourceLoaderService.getExtensionGalleryResourceURL({ publisher, name, version }, 'extension');
		if (extensionLocation) {
			try {
				const manifestContent = await this.extensionResourceLoaderService.readExtensionResource(resources.joinPath(extensionLocation, 'package.json'));
				return this.colorThemeRegistry.getMarketplaceThemes(JSON.parse(manifestContent), extensionLocation, ExtensionData.fromName(publisher, name));
			} catch (e) {
				this.logService.error('Problem loading themes from marketplace', e);
			}
		}
		return [];
	}

	public get onDidColorThemeChange(): Event<IWorkbenchColorTheme> {
		return this.onColorThemeChange.event;
	}

	public setColorTheme(themeIdOrTheme: string | undefined | IWorkbenchColorTheme, settingsTarget: ThemeSettingTarget): Promise<IWorkbenchColorTheme | null> {
		return this.colorThemeSequencer.queue(async () => {
			return this.internalSetColorTheme(themeIdOrTheme, settingsTarget);
		});
	}

	private async internalSetColorTheme(themeIdOrTheme: string | undefined | IWorkbenchColorTheme, settingsTarget: ThemeSettingTarget): Promise<IWorkbenchColorTheme | null> {
		if (!themeIdOrTheme) {
			return null;
		}
		const themeId = types.isString(themeIdOrTheme) ? validateThemeId(themeIdOrTheme) : themeIdOrTheme.id;
		if (this.currentColorTheme.isLoaded && themeId === this.currentColorTheme.id) {
			if (settingsTarget !== 'preview') {
				this.currentColorTheme.toStorage(this.storageService);
			}
			return this.settings.setColorTheme(this.currentColorTheme, settingsTarget);
		}

		let themeData = this.colorThemeRegistry.findThemeById(themeId);
		if (!themeData) {
			if (themeIdOrTheme instanceof ColorThemeData) {
				themeData = themeIdOrTheme;
			} else {
				return null;
			}
		}
		try {
			await themeData.ensureLoaded(this.extensionResourceLoaderService);
			themeData.setCustomizations(this.settings);
			return this.applyTheme(themeData, settingsTarget);
		} catch (error) {
			throw new Error(nls.localize('error.cannotloadtheme', "Unable to load {0}: {1}", themeData.location?.toString(), error.message));
		}

	}

	private reloadCurrentColorTheme() {
		return this.colorThemeSequencer.queue(async () => {
			try {
				const theme = this.colorThemeRegistry.findThemeBySettingsId(this.currentColorTheme.settingsId) || this.currentColorTheme;
				await theme.reload(this.extensionResourceLoaderService);
				theme.setCustomizations(this.settings);
				await this.applyTheme(theme, undefined, false);
			} catch (error) {
				this.logService.info('Unable to reload {0}: {1}', this.currentColorTheme.location?.toString());
			}
		});
	}

	public async restoreColorTheme(): Promise<boolean> {
		return this.colorThemeSequencer.queue(async () => {
			const settingId = this.settings.colorTheme;
			const theme = this.colorThemeRegistry.findThemeBySettingsId(settingId);
			if (theme) {
				if (settingId !== this.currentColorTheme.settingsId) {
					await this.internalSetColorTheme(theme.id, undefined);
				} else if (theme !== this.currentColorTheme) {
					await theme.ensureLoaded(this.extensionResourceLoaderService);
					theme.setCustomizations(this.settings);
					await this.applyTheme(theme, undefined, true);
				}
				return true;
			}
			return false;
		});
	}

	private updateDynamicCSSRules(themeData: IColorTheme) {
		const cssRules = new Set<string>();
		const ruleCollector = {
			addRule: (rule: string) => {
				if (!cssRules.has(rule)) {
					cssRules.add(rule);
				}
			}
		};
		ruleCollector.addRule(`.monaco-workbench { forced-color-adjust: none; }`);
		themingRegistry.getThemingParticipants().forEach(p => p(themeData, ruleCollector, this.environmentService));

		const colorVariables: string[] = [];
		for (const item of getColorRegistry().getColors()) {
			const color = themeData.getColor(item.id, true);
			if (color) {
				colorVariables.push(`${asCssVariableName(item.id)}: ${color.toString()};`);
			}
		}

		const sizeVariables: string[] = [];
		for (const item of getSizeRegistry().getSizes()) {
			const sizeValue = getSizeRegistry().resolveDefaultSize(item.id, themeData);
			if (sizeValue) {
				sizeVariables.push(`${asSizeCssVariableName(item.id)}: ${sizeValueToCss(sizeValue)};`);
			}
		}

		ruleCollector.addRule(`.monaco-workbench { ${(colorVariables.concat(sizeVariables)).join('\n')} }`);

		_applyRules([...cssRules].join('\n'), colorThemeRulesClassName);
	}

	private applyTheme(newTheme: ColorThemeData, settingsTarget: ThemeSettingTarget, silent = false): Promise<IWorkbenchColorTheme | null> {
		this.updateDynamicCSSRules(newTheme);

		if (this.currentColorTheme.id) {
			this.container.classList.remove(...this.currentColorTheme.classNames);
		} else {
			this.container.classList.remove(ThemeTypeSelector.VS, ThemeTypeSelector.VS_DARK, ThemeTypeSelector.HC_BLACK, ThemeTypeSelector.HC_LIGHT);
		}
		this.container.classList.add(...newTheme.classNames);

		this.currentColorTheme.clearCaches();
		this.currentColorTheme = newTheme;
		if (!this.colorThemingParticipantChangeListener) {
			this.colorThemingParticipantChangeListener = themingRegistry.onThemingParticipantAdded(_ => this.updateDynamicCSSRules(this.currentColorTheme));
		}

		this.colorThemeWatcher.update(newTheme);

		this.sendTelemetry(newTheme.id, newTheme.extensionData, 'color');

		if (silent) {
			return Promise.resolve(null);
		}

		this.onColorThemeChange.fire(this.currentColorTheme);

		// remember theme data for a quick restore
		if (newTheme.isLoaded && settingsTarget !== 'preview') {
			newTheme.toStorage(this.storageService);
		}

		return this.settings.setColorTheme(this.currentColorTheme, settingsTarget);
	}


	private themeExtensionsActivated = new Map<string, boolean>();
	private sendTelemetry(themeId: string, themeData: ExtensionData | undefined, themeType: string) {
		if (themeData) {
			const key = themeType + themeData.extensionId;
			if (!this.themeExtensionsActivated.get(key)) {
				type ActivatePluginClassification = {
					owner: 'aeschli';
					comment: 'An event is fired when an color theme extension is first used as it provides the currently shown color theme.';
					id: { classification: 'PublicNonPersonalData'; purpose: 'FeatureInsight'; comment: 'The extension id.' };
					name: { classification: 'PublicNonPersonalData'; purpose: 'FeatureInsight'; comment: 'The extension name.' };
					isBuiltin: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the extension is a built-in extension.' };
					publisherDisplayName: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The extension publisher id.' };
					themeId: { classification: 'PublicNonPersonalData'; purpose: 'FeatureInsight'; comment: 'The id of the theme that triggered the first extension use.' };
				};
				type ActivatePluginEvent = {
					id: string;
					name: string;
					isBuiltin: boolean;
					publisherDisplayName: string;
					themeId: string;
				};
				this.telemetryService.publicLog2<ActivatePluginEvent, ActivatePluginClassification>('activatePlugin', {
					id: themeData.extensionId,
					name: themeData.extensionName,
					isBuiltin: themeData.extensionIsBuiltin,
					publisherDisplayName: themeData.extensionPublisher,
					themeId: themeId
				});
				this.themeExtensionsActivated.set(key, true);
			}
		}
	}

	public async getFileIconThemes(): Promise<IWorkbenchFileIconTheme[]> {
		return this.fileIconThemeRegistry.getThemes();
	}

	public getFileIconTheme() {
		return this.currentFileIconTheme;
	}

	public get onDidFileIconThemeChange(): Event<IWorkbenchFileIconTheme> {
		return this.onFileIconThemeChange.event;
	}

	public async setFileIconTheme(iconThemeOrId: string | undefined | IWorkbenchFileIconTheme, settingsTarget: ThemeSettingTarget): Promise<IWorkbenchFileIconTheme> {
		return this.fileIconThemeSequencer.queue(async () => {
			return this.internalSetFileIconTheme(iconThemeOrId, settingsTarget);
		});
	}

	private async internalSetFileIconTheme(iconThemeOrId: string | undefined | IWorkbenchFileIconTheme, settingsTarget: ThemeSettingTarget): Promise<IWorkbenchFileIconTheme> {
		if (iconThemeOrId === undefined) {
			iconThemeOrId = '';
		}
		const themeId = types.isString(iconThemeOrId) ? iconThemeOrId : iconThemeOrId.id;
		if (themeId !== this.currentFileIconTheme.id || !this.currentFileIconTheme.isLoaded) {

			let newThemeData = this.fileIconThemeRegistry.findThemeById(themeId);
			if (!newThemeData && iconThemeOrId instanceof FileIconThemeData) {
				newThemeData = iconThemeOrId;
			}
			if (!newThemeData) {
				newThemeData = FileIconThemeData.noIconTheme;
			}
			await newThemeData.ensureLoaded(this.fileIconThemeLoader);

			this.applyAndSetFileIconTheme(newThemeData); // updates this.currentFileIconTheme
		}

		const themeData = this.currentFileIconTheme;

		// remember theme data for a quick restore
		if (themeData.isLoaded && settingsTarget !== 'preview' && (!themeData.location || !getRemoteAuthority(themeData.location))) {
			themeData.toStorage(this.storageService);
		}
		await this.settings.setFileIconTheme(this.currentFileIconTheme, settingsTarget);

		return themeData;
	}

	public async getMarketplaceFileIconThemes(publisher: string, name: string, version: string): Promise<IWorkbenchFileIconTheme[]> {
		const extensionLocation = await this.extensionResourceLoaderService.getExtensionGalleryResourceURL({ publisher, name, version }, 'extension');
		if (extensionLocation) {
			try {
				const manifestContent = await this.extensionResourceLoaderService.readExtensionResource(resources.joinPath(extensionLocation, 'package.json'));
				return this.fileIconThemeRegistry.getMarketplaceThemes(JSON.parse(manifestContent), extensionLocation, ExtensionData.fromName(publisher, name));
			} catch (e) {
				this.logService.error('Problem loading themes from marketplace', e);
			}
		}
		return [];
	}

	private async reloadCurrentFileIconTheme() {
		return this.fileIconThemeSequencer.queue(async () => {
			await this.currentFileIconTheme.reload(this.fileIconThemeLoader);
			this.applyAndSetFileIconTheme(this.currentFileIconTheme);
		});
	}

	public async restoreFileIconTheme(): Promise<boolean> {
		return this.fileIconThemeSequencer.queue(async () => {
			const settingId = this.settings.fileIconTheme;
			const theme = this.fileIconThemeRegistry.findThemeBySettingsId(settingId);
			if (theme) {
				if (settingId !== this.currentFileIconTheme.settingsId) {
					await this.internalSetFileIconTheme(theme.id, undefined);
				} else if (theme !== this.currentFileIconTheme) {
					await theme.ensureLoaded(this.fileIconThemeLoader);
					this.applyAndSetFileIconTheme(theme, true);
				}
				return true;
			}
			return false;
		});
	}

	private applyAndSetFileIconTheme(iconThemeData: FileIconThemeData, silent = false): void {
		this.currentFileIconTheme = iconThemeData;

		_applyRules(iconThemeData.styleSheetContent!, fileIconThemeRulesClassName);

		if (iconThemeData.id) {
			this.container.classList.add(fileIconsEnabledClass);
		} else {
			this.container.classList.remove(fileIconsEnabledClass);
		}

		this.fileIconThemeWatcher.update(iconThemeData);

		if (iconThemeData.id) {
			this.sendTelemetry(iconThemeData.id, iconThemeData.extensionData, 'fileIcon');
		}

		if (!silent) {
			this.onFileIconThemeChange.fire(this.currentFileIconTheme);
		}
	}

	public async getProductIconThemes(): Promise<IWorkbenchProductIconTheme[]> {
		return this.productIconThemeRegistry.getThemes();
	}

	public getProductIconTheme() {
		return this.currentProductIconTheme;
	}

	public get onDidProductIconThemeChange(): Event<IWorkbenchProductIconTheme> {
		return this.onProductIconThemeChange.event;
	}

	public async setProductIconTheme(iconThemeOrId: string | undefined | IWorkbenchProductIconTheme, settingsTarget: ThemeSettingTarget): Promise<IWorkbenchProductIconTheme> {
		return this.productIconThemeSequencer.queue(async () => {
			return this.internalSetProductIconTheme(iconThemeOrId, settingsTarget);
		});
	}

	private async internalSetProductIconTheme(iconThemeOrId: string | undefined | IWorkbenchProductIconTheme, settingsTarget: ThemeSettingTarget): Promise<IWorkbenchProductIconTheme> {
		if (iconThemeOrId === undefined) {
			iconThemeOrId = '';
		}
		const themeId = types.isString(iconThemeOrId) ? iconThemeOrId : iconThemeOrId.id;
		if (themeId !== this.currentProductIconTheme.id || !this.currentProductIconTheme.isLoaded) {
			let newThemeData = this.productIconThemeRegistry.findThemeById(themeId);
			if (!newThemeData && iconThemeOrId instanceof ProductIconThemeData) {
				newThemeData = iconThemeOrId;
			}
			if (!newThemeData) {
				newThemeData = ProductIconThemeData.defaultTheme;
			}
			await newThemeData.ensureLoaded(this.extensionResourceLoaderService, this.logService);

			this.applyAndSetProductIconTheme(newThemeData); // updates this.currentProductIconTheme
		}
		const themeData = this.currentProductIconTheme;

		// remember theme data for a quick restore
		if (themeData.isLoaded && settingsTarget !== 'preview' && (!themeData.location || !getRemoteAuthority(themeData.location))) {
			themeData.toStorage(this.storageService);
		}
		await this.settings.setProductIconTheme(this.currentProductIconTheme, settingsTarget);

		return themeData;

	}

	public async getMarketplaceProductIconThemes(publisher: string, name: string, version: string): Promise<IWorkbenchProductIconTheme[]> {
		const extensionLocation = await this.extensionResourceLoaderService.getExtensionGalleryResourceURL({ publisher, name, version }, 'extension');
		if (extensionLocation) {
			try {
				const manifestContent = await this.extensionResourceLoaderService.readExtensionResource(resources.joinPath(extensionLocation, 'package.json'));
				return this.productIconThemeRegistry.getMarketplaceThemes(JSON.parse(manifestContent), extensionLocation, ExtensionData.fromName(publisher, name));
			} catch (e) {
				this.logService.error('Problem loading themes from marketplace', e);
			}
		}
		return [];
	}

	private async reloadCurrentProductIconTheme() {
		return this.productIconThemeSequencer.queue(async () => {
			await this.currentProductIconTheme.reload(this.extensionResourceLoaderService, this.logService);
			this.applyAndSetProductIconTheme(this.currentProductIconTheme);
		});
	}

	public async restoreProductIconTheme(): Promise<boolean> {
		return this.productIconThemeSequencer.queue(async () => {
			const settingId = this.settings.productIconTheme;
			const theme = this.productIconThemeRegistry.findThemeBySettingsId(settingId);
			if (theme) {
				if (settingId !== this.currentProductIconTheme.settingsId) {
					await this.internalSetProductIconTheme(theme.id, undefined);
				} else if (theme !== this.currentProductIconTheme) {
					await theme.ensureLoaded(this.extensionResourceLoaderService, this.logService);
					this.applyAndSetProductIconTheme(theme, true);
				}
				return true;
			}
			return false;
		});
	}

	private applyAndSetProductIconTheme(iconThemeData: ProductIconThemeData, silent = false): void {

		this.currentProductIconTheme = iconThemeData;

		_applyRules(iconThemeData.styleSheetContent!, productIconThemeRulesClassName);

		this.productIconThemeWatcher.update(iconThemeData);

		if (iconThemeData.id) {
			this.sendTelemetry(iconThemeData.id, iconThemeData.extensionData, 'productIcon');
		}
		if (!silent) {
			this.onProductIconThemeChange.fire(this.currentProductIconTheme);
		}
	}
}

class ThemeFileWatcher {

	private watchedLocation: URI | undefined;
	private readonly watcherDisposables = new DisposableStore();

	constructor(
		private readonly fileService: IFileService,
		private readonly environmentService: IBrowserWorkbenchEnvironmentService,
		private readonly onUpdate: () => void
	) { }

	update(theme: { location?: URI; watch?: boolean }) {
		if (!resources.isEqual(theme.location, this.watchedLocation)) {
			this.watchedLocation = undefined;
			this.watcherDisposables.clear();

			if (theme.location && (theme.watch || this.environmentService.isExtensionDevelopment)) {
				this.watchedLocation = theme.location;
				this.watcherDisposables.add(this.fileService.watch(theme.location));
				this.watcherDisposables.add(this.fileService.onDidFilesChange(e => {
					if (this.watchedLocation && e.contains(this.watchedLocation, FileChangeType.UPDATED)) {
						this.onUpdate();
					}
				}));
			}
		}
	}

	dispose() {
		this.watcherDisposables.dispose();
		this.watchedLocation = undefined;
	}
}

function _applyRules(styleSheetContent: string, rulesClassName: string) {
	// eslint-disable-next-line no-restricted-syntax
	const themeStyles = mainWindow.document.head.getElementsByClassName(rulesClassName);
	if (themeStyles.length === 0) {
		const elStyle = createStyleSheet();
		elStyle.className = rulesClassName;
		elStyle.textContent = styleSheetContent;
	} else {
		(<HTMLStyleElement>themeStyles[0]).textContent = styleSheetContent;
	}
}

registerColorThemeSchemas();
registerFileIconThemeSchemas();
registerProductIconThemeSchemas();

// The WorkbenchThemeService should stay eager as the constructor restores the
// last used colors / icons from storage. This needs to happen as quickly as possible
// for a flicker-free startup experience.
registerSingleton(IWorkbenchThemeService, WorkbenchThemeService, InstantiationType.Eager);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/themes/common/colorExtensionPoint.ts]---
Location: vscode-main/src/vs/workbench/services/themes/common/colorExtensionPoint.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { ExtensionsRegistry } from '../../extensions/common/extensionsRegistry.js';
import { IColorRegistry, Extensions as ColorRegistryExtensions } from '../../../../platform/theme/common/colorRegistry.js';
import { Color } from '../../../../base/common/color.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Extensions, IExtensionFeatureTableRenderer, IExtensionFeaturesRegistry, IRenderedData, IRowData, ITableData } from '../../extensionManagement/common/extensionFeatures.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { IExtensionManifest } from '../../../../platform/extensions/common/extensions.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';

interface IColorExtensionPoint {
	id: string;
	description: string;
	defaults: { light: string; dark: string; highContrast: string; highContrastLight?: string };
}

const colorRegistry: IColorRegistry = Registry.as<IColorRegistry>(ColorRegistryExtensions.ColorContribution);

const colorReferenceSchema = colorRegistry.getColorReferenceSchema();
const colorIdPattern = '^\\w+[.\\w+]*$';

const configurationExtPoint = ExtensionsRegistry.registerExtensionPoint<IColorExtensionPoint[]>({
	extensionPoint: 'colors',
	jsonSchema: {
		description: nls.localize('contributes.color', 'Contributes extension defined themable colors'),
		type: 'array',
		items: {
			type: 'object',
			properties: {
				id: {
					type: 'string',
					description: nls.localize('contributes.color.id', 'The identifier of the themable color'),
					pattern: colorIdPattern,
					patternErrorMessage: nls.localize('contributes.color.id.format', 'Identifiers must only contain letters, digits and dots and can not start with a dot'),
				},
				description: {
					type: 'string',
					description: nls.localize('contributes.color.description', 'The description of the themable color'),
				},
				defaults: {
					type: 'object',
					properties: {
						light: {
							description: nls.localize('contributes.defaults.light', 'The default color for light themes. Either a color value in hex (#RRGGBB[AA]) or the identifier of a themable color which provides the default.'),
							type: 'string',
							anyOf: [
								colorReferenceSchema,
								{ type: 'string', format: 'color-hex' }
							]
						},
						dark: {
							description: nls.localize('contributes.defaults.dark', 'The default color for dark themes. Either a color value in hex (#RRGGBB[AA]) or the identifier of a themable color which provides the default.'),
							type: 'string',
							anyOf: [
								colorReferenceSchema,
								{ type: 'string', format: 'color-hex' }
							]
						},
						highContrast: {
							description: nls.localize('contributes.defaults.highContrast', 'The default color for high contrast dark themes. Either a color value in hex (#RRGGBB[AA]) or the identifier of a themable color which provides the default. If not provided, the `dark` color is used as default for high contrast dark themes.'),
							type: 'string',
							anyOf: [
								colorReferenceSchema,
								{ type: 'string', format: 'color-hex' }
							]
						},
						highContrastLight: {
							description: nls.localize('contributes.defaults.highContrastLight', 'The default color for high contrast light themes. Either a color value in hex (#RRGGBB[AA]) or the identifier of a themable color which provides the default. If not provided, the `light` color is used as default for high contrast light themes.'),
							type: 'string',
							anyOf: [
								colorReferenceSchema,
								{ type: 'string', format: 'color-hex' }
							]
						}
					},
					required: ['light', 'dark']
				}
			}
		}
	}
});

export class ColorExtensionPoint {

	constructor() {
		configurationExtPoint.setHandler((extensions, delta) => {
			for (const extension of delta.added) {
				const extensionValue = <IColorExtensionPoint[]>extension.value;
				const collector = extension.collector;

				if (!extensionValue || !Array.isArray(extensionValue)) {
					collector.error(nls.localize('invalid.colorConfiguration', "'configuration.colors' must be a array"));
					return;
				}
				const parseColorValue = (s: string, name: string) => {
					if (s.length > 0) {
						if (s[0] === '#') {
							return Color.Format.CSS.parseHex(s);
						} else {
							return s;
						}
					}
					collector.error(nls.localize('invalid.default.colorType', "{0} must be either a color value in hex (#RRGGBB[AA] or #RGB[A]) or the identifier of a themable color which provides the default.", name));
					return Color.red;
				};

				for (const colorContribution of extensionValue) {
					if (typeof colorContribution.id !== 'string' || colorContribution.id.length === 0) {
						collector.error(nls.localize('invalid.id', "'configuration.colors.id' must be defined and can not be empty"));
						return;
					}
					if (!colorContribution.id.match(colorIdPattern)) {
						collector.error(nls.localize('invalid.id.format', "'configuration.colors.id' must only contain letters, digits and dots and can not start with a dot"));
						return;
					}
					if (typeof colorContribution.description !== 'string' || colorContribution.id.length === 0) {
						collector.error(nls.localize('invalid.description', "'configuration.colors.description' must be defined and can not be empty"));
						return;
					}
					const defaults = colorContribution.defaults;
					if (!defaults || typeof defaults !== 'object' || typeof defaults.light !== 'string' || typeof defaults.dark !== 'string') {
						collector.error(nls.localize('invalid.defaults', "'configuration.colors.defaults' must be defined and must contain 'light' and 'dark'"));
						return;
					}
					if (defaults.highContrast && typeof defaults.highContrast !== 'string') {
						collector.error(nls.localize('invalid.defaults.highContrast', "If defined, 'configuration.colors.defaults.highContrast' must be a string."));
						return;
					}
					if (defaults.highContrastLight && typeof defaults.highContrastLight !== 'string') {
						collector.error(nls.localize('invalid.defaults.highContrastLight', "If defined, 'configuration.colors.defaults.highContrastLight' must be a string."));
						return;
					}

					colorRegistry.registerColor(colorContribution.id, {
						light: parseColorValue(defaults.light, 'configuration.colors.defaults.light'),
						dark: parseColorValue(defaults.dark, 'configuration.colors.defaults.dark'),
						hcDark: parseColorValue(defaults.highContrast ?? defaults.dark, 'configuration.colors.defaults.highContrast'),
						hcLight: parseColorValue(defaults.highContrastLight ?? defaults.light, 'configuration.colors.defaults.highContrastLight'),
					}, colorContribution.description);
				}
			}
			for (const extension of delta.removed) {
				const extensionValue = <IColorExtensionPoint[]>extension.value;
				for (const colorContribution of extensionValue) {
					colorRegistry.deregisterColor(colorContribution.id);
				}
			}
		});
	}
}

class ColorDataRenderer extends Disposable implements IExtensionFeatureTableRenderer {

	readonly type = 'table';

	shouldRender(manifest: IExtensionManifest): boolean {
		return !!manifest.contributes?.colors;
	}

	render(manifest: IExtensionManifest): IRenderedData<ITableData> {
		const colors = manifest.contributes?.colors || [];
		if (!colors.length) {
			return { data: { headers: [], rows: [] }, dispose: () => { } };
		}

		const headers = [
			nls.localize('id', "ID"),
			nls.localize('description', "Description"),
			nls.localize('defaultDark', "Dark Default"),
			nls.localize('defaultLight', "Light Default"),
			nls.localize('defaultHC', "High Contrast Default"),
		];

		const toColor = (colorReference: string): Color | undefined => colorReference[0] === '#' ? Color.fromHex(colorReference) : undefined;

		const rows: IRowData[][] = colors.sort((a, b) => a.id.localeCompare(b.id))
			.map(color => {
				return [
					new MarkdownString().appendMarkdown(`\`${color.id}\``),
					color.description,
					toColor(color.defaults.dark) ?? new MarkdownString().appendMarkdown(`\`${color.defaults.dark}\``),
					toColor(color.defaults.light) ?? new MarkdownString().appendMarkdown(`\`${color.defaults.light}\``),
					toColor(color.defaults.highContrast) ?? new MarkdownString().appendMarkdown(`\`${color.defaults.highContrast}\``),
				];
			});

		return {
			data: {
				headers,
				rows
			},
			dispose: () => { }
		};
	}
}

Registry.as<IExtensionFeaturesRegistry>(Extensions.ExtensionFeaturesRegistry).registerExtensionFeature({
	id: 'colors',
	label: nls.localize('colors', "Colors"),
	access: {
		canToggle: false
	},
	renderer: new SyncDescriptor(ColorDataRenderer),
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/themes/common/colorThemeData.ts]---
Location: vscode-main/src/vs/workbench/services/themes/common/colorThemeData.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { basename } from '../../../../base/common/path.js';
import * as Json from '../../../../base/common/json.js';
import { Color } from '../../../../base/common/color.js';
import { ExtensionData, ITokenColorCustomizations, ITextMateThemingRule, IWorkbenchColorTheme, IColorMap, IThemeExtensionPoint, IColorCustomizations, ISemanticTokenRules, ISemanticTokenColorizationSetting, ISemanticTokenColorCustomizations, IThemeScopableCustomizations, IThemeScopedCustomizations, THEME_SCOPE_CLOSE_PAREN, THEME_SCOPE_OPEN_PAREN, themeScopeRegex, THEME_SCOPE_WILDCARD } from './workbenchThemeService.js';
import { convertSettings } from './themeCompatibility.js';
import * as nls from '../../../../nls.js';
import * as types from '../../../../base/common/types.js';
import * as resources from '../../../../base/common/resources.js';
import { Extensions as ColorRegistryExtensions, IColorRegistry, ColorIdentifier, editorBackground, editorForeground, DEFAULT_COLOR_CONFIG_VALUE } from '../../../../platform/theme/common/colorRegistry.js';
import { IFontTokenOptions, ITokenStyle, getThemeTypeSelector } from '../../../../platform/theme/common/themeService.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { getParseErrorMessage } from '../../../../base/common/jsonErrorMessages.js';
import { URI } from '../../../../base/common/uri.js';
import { parse as parsePList } from './plistParser.js';
import { TokenStyle, SemanticTokenRule, ProbeScope, getTokenClassificationRegistry, TokenStyleValue, TokenStyleData, parseClassifierString } from '../../../../platform/theme/common/tokenClassificationRegistry.js';
import { MatcherWithPriority, Matcher, createMatchers } from './textMateScopeMatcher.js';
import { IExtensionResourceLoaderService } from '../../../../platform/extensionResourceLoader/common/extensionResourceLoader.js';
import { CharCode } from '../../../../base/common/charCode.js';
import { StorageScope, IStorageService, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ThemeConfiguration } from './themeConfiguration.js';
import { ColorScheme, ThemeTypeSelector } from '../../../../platform/theme/common/theme.js';
import { ColorId, FontStyle, MetadataConsts } from '../../../../editor/common/encodedTokenAttributes.js';
import { toStandardTokenType } from '../../../../editor/common/languages/supports/tokenization.js';

const colorRegistry = Registry.as<IColorRegistry>(ColorRegistryExtensions.ColorContribution);

const tokenClassificationRegistry = getTokenClassificationRegistry();

const tokenGroupToScopesMap = {
	comments: ['comment', 'punctuation.definition.comment'],
	strings: ['string', 'meta.embedded.assembly'],
	keywords: ['keyword - keyword.operator', 'keyword.control', 'storage', 'storage.type'],
	numbers: ['constant.numeric'],
	types: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class'],
	functions: ['entity.name.function', 'support.function'],
	variables: ['variable', 'entity.name.variable']
};


export type TokenStyleDefinition = SemanticTokenRule | ProbeScope[] | TokenStyleValue;
export type TokenStyleDefinitions = { [P in keyof TokenStyleData]?: TokenStyleDefinition | undefined };

export type TextMateThemingRuleDefinitions = { [P in keyof TokenStyleData]?: ITextMateThemingRule | undefined; } & { scope?: ProbeScope };

interface IColorOrDefaultMap {
	[id: string]: Color | typeof DEFAULT_COLOR_CONFIG_VALUE;
}

export class ColorThemeData implements IWorkbenchColorTheme {

	static readonly STORAGE_KEY = 'colorThemeData';

	id: string;
	label: string;
	settingsId: string;
	description?: string;
	isLoaded: boolean;
	location?: URI; // only set for extension from the registry, not for themes restored from the storage
	watch?: boolean;
	extensionData?: ExtensionData;

	private themeSemanticHighlighting: boolean | undefined;
	private customSemanticHighlighting: boolean | undefined;
	private customSemanticHighlightingDeprecated: boolean | undefined;

	private themeTokenColors: ITextMateThemingRule[] = [];
	private customTokenColors: ITextMateThemingRule[] = [];
	private colorMap: IColorMap = {};
	private customColorMap: IColorOrDefaultMap = {};

	private semanticTokenRules: SemanticTokenRule[] = [];
	private customSemanticTokenRules: SemanticTokenRule[] = [];

	private themeTokenScopeMatchers: Matcher<ProbeScope>[] | undefined;
	private customTokenScopeMatchers: Matcher<ProbeScope>[] | undefined;

	private textMateThemingRules: ITextMateThemingRule[] | undefined = undefined; // created on demand
	private tokenColorIndex: TokenColorIndex | undefined = undefined; // created on demand
	private tokenFontIndex: TokenFontIndex | undefined = undefined; // created on demand

	private constructor(id: string, label: string, settingsId: string) {
		this.id = id;
		this.label = label;
		this.settingsId = settingsId;
		this.isLoaded = false;
	}

	get semanticHighlighting(): boolean {
		if (this.customSemanticHighlighting !== undefined) {
			return this.customSemanticHighlighting;
		}
		if (this.customSemanticHighlightingDeprecated !== undefined) {
			return this.customSemanticHighlightingDeprecated;
		}
		return !!this.themeSemanticHighlighting;
	}

	get tokenColors(): ITextMateThemingRule[] {
		if (!this.textMateThemingRules) {
			const result: ITextMateThemingRule[] = [];

			// the default rule (scope empty) is always the first rule. Ignore all other default rules.
			const foreground = this.getColor(editorForeground) || this.getDefault(editorForeground)!;
			const background = this.getColor(editorBackground) || this.getDefault(editorBackground)!;
			result.push({
				settings: {
					foreground: normalizeColor(foreground),
					background: normalizeColor(background)
				}
			});

			let hasDefaultTokens = false;

			function addRule(rule: ITextMateThemingRule) {
				if (rule.scope && rule.settings) {
					if (rule.scope === 'token.info-token') {
						hasDefaultTokens = true;
					}
					const ruleSettings = rule.settings;
					result.push({
						scope: rule.scope, settings: {
							foreground: normalizeColor(ruleSettings.foreground),
							background: normalizeColor(ruleSettings.background),
							fontStyle: ruleSettings.fontStyle,
							fontSize: ruleSettings.fontSize,
							fontFamily: ruleSettings.fontFamily,
							lineHeight: ruleSettings.lineHeight
						}
					});
				}
			}

			this.themeTokenColors.forEach(addRule);
			// Add the custom colors after the theme colors
			// so that they will override them
			this.customTokenColors.forEach(addRule);

			if (!hasDefaultTokens) {
				defaultThemeColors[this.type].forEach(addRule);
			}
			this.textMateThemingRules = result;
		}
		return this.textMateThemingRules;
	}

	public getColor(colorId: ColorIdentifier, useDefault?: boolean): Color | undefined {
		const customColor = this.customColorMap[colorId];
		if (customColor instanceof Color) {
			return customColor;
		}
		if (customColor === undefined) { /* !== DEFAULT_COLOR_CONFIG_VALUE */
			const color = this.colorMap[colorId];
			if (color !== undefined) {
				return color;
			}
		}
		if (useDefault !== false) {
			return this.getDefault(colorId);
		}
		return undefined;
	}

	private getTokenStyle(type: string, modifiers: string[], language: string, useDefault = true, definitions: TokenStyleDefinitions = {}): TokenStyle | undefined {
		const result: any = {
			foreground: undefined,
			bold: undefined,
			underline: undefined,
			strikethrough: undefined,
			italic: undefined
		};
		const score = {
			foreground: -1,
			bold: -1,
			underline: -1,
			strikethrough: -1,
			italic: -1,
			fontFamily: -1,
			fontSize: -1,
			lineHeight: -1
		};

		function _processStyle(matchScore: number, style: TokenStyle, definition: TokenStyleDefinition) {
			if (style.foreground && score.foreground <= matchScore) {
				score.foreground = matchScore;
				result.foreground = style.foreground;
				definitions.foreground = definition;
			}
			for (const p of ['bold', 'underline', 'strikethrough', 'italic']) {
				const property = p as keyof TokenStyle;
				const info = style[property];
				if (info !== undefined) {
					if (score[property] <= matchScore) {
						score[property] = matchScore;
						result[property] = info;
						definitions[property] = definition;
					}
				}
			}
		}
		function _processSemanticTokenRule(rule: SemanticTokenRule) {
			const matchScore = rule.selector.match(type, modifiers, language);
			if (matchScore >= 0) {
				_processStyle(matchScore, rule.style, rule);
			}
		}

		this.semanticTokenRules.forEach(_processSemanticTokenRule);
		this.customSemanticTokenRules.forEach(_processSemanticTokenRule);

		let hasUndefinedStyleProperty = false;
		for (const k in score) {
			const key = k as keyof TokenStyle;
			if (score[key] === -1) {
				hasUndefinedStyleProperty = true;
			} else {
				score[key] = Number.MAX_VALUE; // set it to the max, so it won't be replaced by a default
			}
		}
		if (hasUndefinedStyleProperty) {
			for (const rule of tokenClassificationRegistry.getTokenStylingDefaultRules()) {
				const matchScore = rule.selector.match(type, modifiers, language);
				if (matchScore >= 0) {
					let style: TokenStyle | undefined;
					if (rule.defaults.scopesToProbe) {
						style = this.resolveScopes(rule.defaults.scopesToProbe);
						if (style) {
							_processStyle(matchScore, style, rule.defaults.scopesToProbe);
						}
					}
					if (!style && useDefault !== false) {
						const tokenStyleValue = rule.defaults[this.type];
						style = this.resolveTokenStyleValue(tokenStyleValue);
						if (style) {
							_processStyle(matchScore, style, tokenStyleValue!);
						}
					}
				}
			}
		}
		return TokenStyle.fromData(result);

	}

	/**
	 * @param tokenStyleValue Resolve a tokenStyleValue in the context of a theme
	 */
	public resolveTokenStyleValue(tokenStyleValue: TokenStyleValue | undefined): TokenStyle | undefined {
		if (tokenStyleValue === undefined) {
			return undefined;
		} else if (typeof tokenStyleValue === 'string') {
			const { type, modifiers, language } = parseClassifierString(tokenStyleValue, '');
			return this.getTokenStyle(type, modifiers, language);
		} else if (typeof tokenStyleValue === 'object') {
			return tokenStyleValue;
		}
		return undefined;
	}

	public getTokenColorIndex(): TokenColorIndex {
		// collect all colors that tokens can have
		if (!this.tokenColorIndex) {
			const index = new TokenColorIndex();
			this.tokenColors.forEach(rule => {
				index.add(rule.settings.foreground);
				index.add(rule.settings.background);
			});

			this.semanticTokenRules.forEach(r => index.add(r.style.foreground));
			tokenClassificationRegistry.getTokenStylingDefaultRules().forEach(r => {
				const defaultColor = r.defaults[this.type];
				if (defaultColor && typeof defaultColor === 'object') {
					index.add(defaultColor.foreground);
				}
			});
			this.customSemanticTokenRules.forEach(r => index.add(r.style.foreground));

			this.tokenColorIndex = index;
		}
		return this.tokenColorIndex;
	}


	public getTokenFontIndex(): TokenFontIndex {
		if (!this.tokenFontIndex) {
			const index = new TokenFontIndex();
			this.tokenColors.forEach(r => index.add(r.settings.fontFamily, r.settings.fontSize, r.settings.lineHeight));
			this.tokenFontIndex = index;
		}
		return this.tokenFontIndex;
	}

	public get tokenColorMap(): string[] {
		return this.getTokenColorIndex().asArray();
	}

	public get tokenFontMap(): IFontTokenOptions[] {
		return this.getTokenFontIndex().asArray();
	}

	public getTokenStyleMetadata(typeWithLanguage: string, modifiers: string[], defaultLanguage: string, useDefault = true, definitions: TokenStyleDefinitions = {}): ITokenStyle | undefined {
		const { type, language } = parseClassifierString(typeWithLanguage, defaultLanguage);
		const style = this.getTokenStyle(type, modifiers, language, useDefault, definitions);
		if (!style) {
			return undefined;
		}

		return {
			foreground: this.getTokenColorIndex().get(style.foreground),
			bold: style.bold,
			underline: style.underline,
			strikethrough: style.strikethrough,
			italic: style.italic,
		};
	}

	public getTokenStylingRuleScope(rule: SemanticTokenRule): 'setting' | 'theme' | undefined {
		if (this.customSemanticTokenRules.indexOf(rule) !== -1) {
			return 'setting';
		}
		if (this.semanticTokenRules.indexOf(rule) !== -1) {
			return 'theme';
		}
		return undefined;
	}

	public getDefault(colorId: ColorIdentifier): Color | undefined {
		return colorRegistry.resolveDefaultColor(colorId, this);
	}


	public resolveScopes(scopes: ProbeScope[], definitions?: TextMateThemingRuleDefinitions): TokenStyle | undefined {

		if (!this.themeTokenScopeMatchers) {
			this.themeTokenScopeMatchers = this.themeTokenColors.map(getScopeMatcher);
		}
		if (!this.customTokenScopeMatchers) {
			this.customTokenScopeMatchers = this.customTokenColors.map(getScopeMatcher);
		}

		for (const scope of scopes) {
			let foreground: string | undefined = undefined;
			let fontStyle: string | undefined = undefined;
			let foregroundScore = -1;
			let fontStyleScore = -1;
			let fontStyleThemingRule: ITextMateThemingRule | undefined = undefined;
			let foregroundThemingRule: ITextMateThemingRule | undefined = undefined;

			function findTokenStyleForScopeInScopes(scopeMatchers: Matcher<ProbeScope>[], themingRules: ITextMateThemingRule[]) {
				for (let i = 0; i < scopeMatchers.length; i++) {
					const score = scopeMatchers[i](scope);
					if (score >= 0) {
						const themingRule = themingRules[i];
						const settings = themingRules[i].settings;
						if (score >= foregroundScore && settings.foreground) {
							foreground = settings.foreground;
							foregroundScore = score;
							foregroundThemingRule = themingRule;
						}
						if (score >= fontStyleScore && types.isString(settings.fontStyle)) {
							fontStyle = settings.fontStyle;
							fontStyleScore = score;
							fontStyleThemingRule = themingRule;
						}
					}
				}
			}
			findTokenStyleForScopeInScopes(this.themeTokenScopeMatchers, this.themeTokenColors);
			findTokenStyleForScopeInScopes(this.customTokenScopeMatchers, this.customTokenColors);
			if (foreground !== undefined || fontStyle !== undefined) {
				if (definitions) {
					definitions.foreground = foregroundThemingRule;
					definitions.bold = definitions.italic = definitions.underline = definitions.strikethrough = fontStyleThemingRule;
					definitions.scope = scope;
				}

				return TokenStyle.fromSettings(foreground, fontStyle);
			}
		}
		return undefined;
	}

	public defines(colorId: ColorIdentifier): boolean {
		const customColor = this.customColorMap[colorId];
		if (customColor instanceof Color) {
			return true;
		}
		return customColor === undefined /* !== DEFAULT_COLOR_CONFIG_VALUE */ && this.colorMap.hasOwnProperty(colorId);
	}

	public setCustomizations(settings: ThemeConfiguration) {
		this.setCustomColors(settings.colorCustomizations);
		this.setCustomTokenColors(settings.tokenColorCustomizations);
		this.setCustomSemanticTokenColors(settings.semanticTokenColorCustomizations);
	}

	public setCustomColors(colors: IColorCustomizations) {
		this.customColorMap = {};
		this.overwriteCustomColors(colors);

		const themeSpecificColors = this.getThemeSpecificColors(colors) as IColorCustomizations;
		if (types.isObject(themeSpecificColors)) {
			this.overwriteCustomColors(themeSpecificColors);
		}

		this.tokenColorIndex = undefined;
		this.textMateThemingRules = undefined;
		this.customTokenScopeMatchers = undefined;
	}

	private overwriteCustomColors(colors: IColorCustomizations) {
		for (const id in colors) {
			const colorVal = colors[id];
			if (colorVal === DEFAULT_COLOR_CONFIG_VALUE) {
				this.customColorMap[id] = DEFAULT_COLOR_CONFIG_VALUE;
			} else if (typeof colorVal === 'string') {
				this.customColorMap[id] = Color.fromHex(colorVal);
			}
		}
	}

	public setCustomTokenColors(customTokenColors: ITokenColorCustomizations) {
		this.customTokenColors = [];
		this.customSemanticHighlightingDeprecated = undefined;

		// first add the non-theme specific settings
		this.addCustomTokenColors(customTokenColors);

		// append theme specific settings. Last rules will win.
		const themeSpecificTokenColors = this.getThemeSpecificColors(customTokenColors) as ITokenColorCustomizations;
		if (types.isObject(themeSpecificTokenColors)) {
			this.addCustomTokenColors(themeSpecificTokenColors);
		}

		this.tokenColorIndex = undefined;
		this.textMateThemingRules = undefined;
		this.customTokenScopeMatchers = undefined;
	}

	public setCustomSemanticTokenColors(semanticTokenColors: ISemanticTokenColorCustomizations | undefined) {
		this.customSemanticTokenRules = [];
		this.customSemanticHighlighting = undefined;

		if (semanticTokenColors) {
			this.customSemanticHighlighting = semanticTokenColors.enabled;
			if (semanticTokenColors.rules) {
				this.readSemanticTokenRules(semanticTokenColors.rules);
			}
			const themeSpecificColors = this.getThemeSpecificColors(semanticTokenColors) as ISemanticTokenColorCustomizations;
			if (types.isObject(themeSpecificColors)) {
				if (themeSpecificColors.enabled !== undefined) {
					this.customSemanticHighlighting = themeSpecificColors.enabled;
				}
				if (themeSpecificColors.rules) {
					this.readSemanticTokenRules(themeSpecificColors.rules);
				}
			}
		}

		this.tokenColorIndex = undefined;
		this.textMateThemingRules = undefined;
	}

	public isThemeScope(key: string): boolean {
		return key.charAt(0) === THEME_SCOPE_OPEN_PAREN && key.charAt(key.length - 1) === THEME_SCOPE_CLOSE_PAREN;
	}

	public isThemeScopeMatch(themeId: string): boolean {
		const themeIdFirstChar = themeId.charAt(0);
		const themeIdLastChar = themeId.charAt(themeId.length - 1);
		const themeIdPrefix = themeId.slice(0, -1);
		const themeIdInfix = themeId.slice(1, -1);
		const themeIdSuffix = themeId.slice(1);
		return themeId === this.settingsId
			|| (this.settingsId.includes(themeIdInfix) && themeIdFirstChar === THEME_SCOPE_WILDCARD && themeIdLastChar === THEME_SCOPE_WILDCARD)
			|| (this.settingsId.startsWith(themeIdPrefix) && themeIdLastChar === THEME_SCOPE_WILDCARD)
			|| (this.settingsId.endsWith(themeIdSuffix) && themeIdFirstChar === THEME_SCOPE_WILDCARD);
	}

	public getThemeSpecificColors(colors: IThemeScopableCustomizations): IThemeScopedCustomizations | undefined {
		let themeSpecificColors: IThemeScopedCustomizations | undefined;
		for (const key in colors) {
			const scopedColors = colors[key];
			if (this.isThemeScope(key) && scopedColors instanceof Object && !Array.isArray(scopedColors)) {
				const themeScopeList = key.match(themeScopeRegex) || [];
				for (const themeScope of themeScopeList) {
					const themeId = themeScope.substring(1, themeScope.length - 1);
					if (this.isThemeScopeMatch(themeId)) {
						if (!themeSpecificColors) {
							themeSpecificColors = {};
						}
						const scopedThemeSpecificColors = scopedColors as IThemeScopedCustomizations;
						for (const subkey in scopedThemeSpecificColors) {
							const originalColors = themeSpecificColors[subkey];
							const overrideColors = scopedThemeSpecificColors[subkey];
							if (Array.isArray(originalColors) && Array.isArray(overrideColors)) {
								themeSpecificColors[subkey] = originalColors.concat(overrideColors);
							} else if (overrideColors) {
								themeSpecificColors[subkey] = overrideColors;
							}
						}
					}
				}
			}
		}
		return themeSpecificColors;
	}

	private readSemanticTokenRules(tokenStylingRuleSection: ISemanticTokenRules) {
		for (const key in tokenStylingRuleSection) {
			if (!this.isThemeScope(key)) { // still do this test until experimental settings are gone
				try {
					const rule = readSemanticTokenRule(key, tokenStylingRuleSection[key]);
					if (rule) {
						this.customSemanticTokenRules.push(rule);
					}
				} catch (e) {
					// invalid selector, ignore
				}
			}
		}
	}

	private addCustomTokenColors(customTokenColors: ITokenColorCustomizations) {
		// Put the general customizations such as comments, strings, etc. first so that
		// they can be overridden by specific customizations like "string.interpolated"
		for (const tokenGroup in tokenGroupToScopesMap) {
			const group = <keyof typeof tokenGroupToScopesMap>tokenGroup; // TS doesn't type 'tokenGroup' properly
			const value = customTokenColors[group];
			if (value) {
				const settings = typeof value === 'string' ? { foreground: value } : value;
				const scopes = tokenGroupToScopesMap[group];
				for (const scope of scopes) {
					this.customTokenColors.push({ scope, settings });
				}
			}
		}

		// specific customizations
		if (Array.isArray(customTokenColors.textMateRules)) {
			for (const rule of customTokenColors.textMateRules) {
				if (rule.scope && rule.settings) {
					this.customTokenColors.push(rule);
				}
			}
		}
		if (customTokenColors.semanticHighlighting !== undefined) {
			this.customSemanticHighlightingDeprecated = customTokenColors.semanticHighlighting;
		}
	}

	public ensureLoaded(extensionResourceLoaderService: IExtensionResourceLoaderService): Promise<void> {
		return !this.isLoaded ? this.load(extensionResourceLoaderService) : Promise.resolve(undefined);
	}

	public reload(extensionResourceLoaderService: IExtensionResourceLoaderService): Promise<void> {
		return this.load(extensionResourceLoaderService);
	}

	private load(extensionResourceLoaderService: IExtensionResourceLoaderService): Promise<void> {
		if (!this.location) {
			return Promise.resolve(undefined);
		}
		this.themeTokenColors = [];
		this.clearCaches();

		const result = {
			colors: {},
			textMateRules: [],
			semanticTokenRules: [],
			semanticHighlighting: false
		};
		return _loadColorTheme(extensionResourceLoaderService, this.location, result).then(_ => {
			this.isLoaded = true;
			this.semanticTokenRules = result.semanticTokenRules;
			this.colorMap = result.colors;
			this.themeTokenColors = result.textMateRules;
			this.themeSemanticHighlighting = result.semanticHighlighting;
		});
	}

	public clearCaches() {
		this.tokenColorIndex = undefined;
		this.textMateThemingRules = undefined;
		this.themeTokenScopeMatchers = undefined;
		this.customTokenScopeMatchers = undefined;
	}

	toStorage(storageService: IStorageService) {
		const colorMapData: { [key: string]: string } = {};
		for (const key in this.colorMap) {
			colorMapData[key] = Color.Format.CSS.formatHexA(this.colorMap[key], true);
		}
		// no need to persist custom colors, they will be taken from the settings
		const value = JSON.stringify({
			id: this.id,
			label: this.label,
			settingsId: this.settingsId,
			themeTokenColors: this.themeTokenColors.map(tc => ({ settings: tc.settings, scope: tc.scope })), // don't persist names
			semanticTokenRules: this.semanticTokenRules.map(SemanticTokenRule.toJSONObject),
			extensionData: ExtensionData.toJSONObject(this.extensionData),
			themeSemanticHighlighting: this.themeSemanticHighlighting,
			colorMap: colorMapData,
			watch: this.watch
		});

		// roam persisted color theme colors. Don't enable for icons as they contain references to fonts and images.
		storageService.store(ColorThemeData.STORAGE_KEY, value, StorageScope.PROFILE, StorageTarget.USER);
	}

	get themeTypeSelector(): ThemeTypeSelector {
		return this.classNames[0] as ThemeTypeSelector;
	}

	get classNames(): string[] {
		return this.id.split(' ');
	}

	get type(): ColorScheme {
		switch (this.themeTypeSelector) {
			case ThemeTypeSelector.VS: return ColorScheme.LIGHT;
			case ThemeTypeSelector.HC_BLACK: return ColorScheme.HIGH_CONTRAST_DARK;
			case ThemeTypeSelector.HC_LIGHT: return ColorScheme.HIGH_CONTRAST_LIGHT;
			default: return ColorScheme.DARK;
		}
	}

	// constructors

	static createUnloadedThemeForThemeType(themeType: ColorScheme, colorMap?: { [id: string]: string }): ColorThemeData {
		return ColorThemeData.createUnloadedTheme(getThemeTypeSelector(themeType), colorMap);
	}

	static createUnloadedTheme(id: string, colorMap?: { [id: string]: string }): ColorThemeData {
		const themeData = new ColorThemeData(id, '', '__' + id);
		themeData.isLoaded = false;
		themeData.themeTokenColors = [];
		themeData.watch = false;
		if (colorMap) {
			for (const id in colorMap) {
				themeData.colorMap[id] = Color.fromHex(colorMap[id]);
			}
		}
		return themeData;
	}

	static createLoadedEmptyTheme(id: string, settingsId: string): ColorThemeData {
		const themeData = new ColorThemeData(id, '', settingsId);
		themeData.isLoaded = true;
		themeData.themeTokenColors = [];
		themeData.watch = false;
		return themeData;
	}

	static fromStorageData(storageService: IStorageService): ColorThemeData | undefined {
		const input = storageService.get(ColorThemeData.STORAGE_KEY, StorageScope.PROFILE);
		if (!input) {
			return undefined;
		}
		try {
			const data = JSON.parse(input);
			const theme = new ColorThemeData('', '', '');
			for (const key in data) {
				switch (key) {
					case 'colorMap': {
						const colorMapData = data[key];
						for (const id in colorMapData) {
							theme.colorMap[id] = Color.fromHex(colorMapData[id]);
						}
						break;
					}
					case 'themeTokenColors':
					case 'id': case 'label': case 'settingsId': case 'watch': case 'themeSemanticHighlighting':
						// eslint-disable-next-line local/code-no-any-casts
						(theme as any)[key] = data[key];
						break;
					case 'semanticTokenRules': {
						const rulesData = data[key];
						if (Array.isArray(rulesData)) {
							for (const d of rulesData) {
								const rule = SemanticTokenRule.fromJSONObject(tokenClassificationRegistry, d);
								if (rule) {
									theme.semanticTokenRules.push(rule);
								}
							}
						}
						break;
					}
					case 'location':
						// ignore, no longer restore
						break;
					case 'extensionData':
						theme.extensionData = ExtensionData.fromJSONObject(data.extensionData);
						break;
				}
			}
			if (!theme.id || !theme.settingsId) {
				return undefined;
			}
			return theme;
		} catch (e) {
			return undefined;
		}
	}

	static fromExtensionTheme(theme: IThemeExtensionPoint, colorThemeLocation: URI, extensionData: ExtensionData): ColorThemeData {
		const baseTheme: string = theme['uiTheme'] || 'vs-dark';
		const themeSelector = toCSSSelector(extensionData.extensionId, theme.path);
		const id = `${baseTheme} ${themeSelector}`;
		const label = theme.label || basename(theme.path);
		const settingsId = theme.id || label;
		const themeData = new ColorThemeData(id, label, settingsId);
		themeData.description = theme.description;
		themeData.watch = theme._watch === true;
		themeData.location = colorThemeLocation;
		themeData.extensionData = extensionData;
		themeData.isLoaded = false;
		return themeData;
	}
}

function toCSSSelector(extensionId: string, path: string) {
	if (path.startsWith('./')) {
		path = path.substr(2);
	}
	let str = `${extensionId}-${path}`;

	//remove all characters that are not allowed in css
	str = str.replace(/[^_a-zA-Z0-9-]/g, '-');
	if (str.charAt(0).match(/[0-9-]/)) {
		str = '_' + str;
	}
	return str;
}

async function _loadColorTheme(extensionResourceLoaderService: IExtensionResourceLoaderService, themeLocation: URI, result: { textMateRules: ITextMateThemingRule[]; colors: IColorMap; semanticTokenRules: SemanticTokenRule[]; semanticHighlighting: boolean }): Promise<any> {
	if (resources.extname(themeLocation) === '.json') {
		const content = await extensionResourceLoaderService.readExtensionResource(themeLocation);
		const errors: Json.ParseError[] = [];
		const contentValue = Json.parse(content, errors);
		if (errors.length > 0) {
			return Promise.reject(new Error(nls.localize('error.cannotparsejson', "Problems parsing JSON theme file: {0}", errors.map(e => getParseErrorMessage(e.error)).join(', '))));
		} else if (Json.getNodeType(contentValue) !== 'object') {
			return Promise.reject(new Error(nls.localize('error.invalidformat', "Invalid format for JSON theme file: Object expected.")));
		}
		if (contentValue.include) {
			await _loadColorTheme(extensionResourceLoaderService, resources.joinPath(resources.dirname(themeLocation), contentValue.include), result);
		}
		if (Array.isArray(contentValue.settings)) {
			convertSettings(contentValue.settings, result);
			return null;
		}
		result.semanticHighlighting = result.semanticHighlighting || contentValue.semanticHighlighting;
		const colors = contentValue.colors;
		if (colors) {
			if (typeof colors !== 'object') {
				return Promise.reject(new Error(nls.localize({ key: 'error.invalidformat.colors', comment: ['{0} will be replaced by a path. Values in quotes should not be translated.'] }, "Problem parsing color theme file: {0}. Property 'colors' is not of type 'object'.", themeLocation.toString())));
			}
			// new JSON color themes format
			for (const colorId in colors) {
				const colorVal = colors[colorId];
				if (colorVal === DEFAULT_COLOR_CONFIG_VALUE) { // ignore colors that are set to to default
					delete result.colors[colorId];
				} else if (typeof colorVal === 'string') {
					result.colors[colorId] = Color.fromHex(colors[colorId]);
				}
			}
		}
		const tokenColors = contentValue.tokenColors;
		if (tokenColors) {
			if (Array.isArray(tokenColors)) {
				result.textMateRules.push(...tokenColors);
			} else if (typeof tokenColors === 'string') {
				await _loadSyntaxTokens(extensionResourceLoaderService, resources.joinPath(resources.dirname(themeLocation), tokenColors), result);
			} else {
				return Promise.reject(new Error(nls.localize({ key: 'error.invalidformat.tokenColors', comment: ['{0} will be replaced by a path. Values in quotes should not be translated.'] }, "Problem parsing color theme file: {0}. Property 'tokenColors' should be either an array specifying colors or a path to a TextMate theme file", themeLocation.toString())));
			}
		}
		const semanticTokenColors = contentValue.semanticTokenColors;
		if (semanticTokenColors && typeof semanticTokenColors === 'object') {
			for (const key in semanticTokenColors) {
				try {
					const rule = readSemanticTokenRule(key, semanticTokenColors[key]);
					if (rule) {
						result.semanticTokenRules.push(rule);
					}
				} catch (e) {
					return Promise.reject(new Error(nls.localize({ key: 'error.invalidformat.semanticTokenColors', comment: ['{0} will be replaced by a path. Values in quotes should not be translated.'] }, "Problem parsing color theme file: {0}. Property 'semanticTokenColors' contains a invalid selector", themeLocation.toString())));
				}
			}
		}
	} else {
		return _loadSyntaxTokens(extensionResourceLoaderService, themeLocation, result);
	}
}

function _loadSyntaxTokens(extensionResourceLoaderService: IExtensionResourceLoaderService, themeLocation: URI, result: { textMateRules: ITextMateThemingRule[]; colors: IColorMap }): Promise<any> {
	return extensionResourceLoaderService.readExtensionResource(themeLocation).then(content => {
		try {
			const contentValue = parsePList(content);
			const settings: ITextMateThemingRule[] = contentValue.settings;
			if (!Array.isArray(settings)) {
				return Promise.reject(new Error(nls.localize('error.plist.invalidformat', "Problem parsing tmTheme file: {0}. 'settings' is not array.")));
			}
			convertSettings(settings, result);
			return Promise.resolve(null);
		} catch (e) {
			return Promise.reject(new Error(nls.localize('error.cannotparse', "Problems parsing tmTheme file: {0}", e.message)));
		}
	}, error => {
		return Promise.reject(new Error(nls.localize('error.cannotload', "Problems loading tmTheme file {0}: {1}", themeLocation.toString(), error.message)));
	});
}

const defaultThemeColors: { [baseTheme: string]: ITextMateThemingRule[] } = {
	'light': [
		{ scope: 'token.info-token', settings: { foreground: '#316bcd' } },
		{ scope: 'token.warn-token', settings: { foreground: '#cd9731' } },
		{ scope: 'token.error-token', settings: { foreground: '#cd3131' } },
		{ scope: 'token.debug-token', settings: { foreground: '#800080' } }
	],
	'dark': [
		{ scope: 'token.info-token', settings: { foreground: '#6796e6' } },
		{ scope: 'token.warn-token', settings: { foreground: '#cd9731' } },
		{ scope: 'token.error-token', settings: { foreground: '#f44747' } },
		{ scope: 'token.debug-token', settings: { foreground: '#b267e6' } }
	],
	'hcLight': [
		{ scope: 'token.info-token', settings: { foreground: '#316bcd' } },
		{ scope: 'token.warn-token', settings: { foreground: '#cd9731' } },
		{ scope: 'token.error-token', settings: { foreground: '#cd3131' } },
		{ scope: 'token.debug-token', settings: { foreground: '#800080' } }
	],
	'hcDark': [
		{ scope: 'token.info-token', settings: { foreground: '#6796e6' } },
		{ scope: 'token.warn-token', settings: { foreground: '#008000' } },
		{ scope: 'token.error-token', settings: { foreground: '#FF0000' } },
		{ scope: 'token.debug-token', settings: { foreground: '#b267e6' } }
	]
};

const noMatch = (_scope: ProbeScope) => -1;

function nameMatcher(identifiers: string[], scopes: ProbeScope): number {
	if (scopes.length < identifiers.length) {
		return -1;
	}

	let score: number | undefined = undefined;
	const every = identifiers.every((identifier) => {
		for (let i = scopes.length - 1; i >= 0; i--) {
			if (scopesAreMatching(scopes[i], identifier)) {
				score = (i + 1) * 0x10000 + identifier.length;
				return true;
			}
		}
		return false;
	});
	return every && score !== undefined ? score : -1;
}
function scopesAreMatching(thisScopeName: string, scopeName: string): boolean {
	if (!thisScopeName) {
		return false;
	}
	if (thisScopeName === scopeName) {
		return true;
	}
	const len = scopeName.length;
	return thisScopeName.length > len && thisScopeName.substr(0, len) === scopeName && thisScopeName[len] === '.';
}

function getScopeMatcher(rule: ITextMateThemingRule): Matcher<ProbeScope> {
	const ruleScope = rule.scope;
	if (!ruleScope || !rule.settings) {
		return noMatch;
	}
	const matchers: MatcherWithPriority<ProbeScope>[] = [];
	if (Array.isArray(ruleScope)) {
		for (const rs of ruleScope) {
			createMatchers(rs, nameMatcher, matchers);
		}
	} else {
		createMatchers(ruleScope, nameMatcher, matchers);
	}

	if (matchers.length === 0) {
		return noMatch;
	}
	return (scope: ProbeScope) => {
		let max = matchers[0].matcher(scope);
		for (let i = 1; i < matchers.length; i++) {
			max = Math.max(max, matchers[i].matcher(scope));
		}
		return max;
	};
}

function readSemanticTokenRule(selectorString: string, settings: ISemanticTokenColorizationSetting | string | boolean | undefined): SemanticTokenRule | undefined {
	const selector = tokenClassificationRegistry.parseTokenSelector(selectorString);
	let style: TokenStyle | undefined;
	if (typeof settings === 'string') {
		style = TokenStyle.fromSettings(settings, undefined);
	} else if (isSemanticTokenColorizationSetting(settings)) {
		style = TokenStyle.fromSettings(settings.foreground, settings.fontStyle, settings.bold, settings.underline, settings.strikethrough, settings.italic);
	}
	if (style) {
		return { selector, style };
	}
	return undefined;
}

function isSemanticTokenColorizationSetting(style: any): style is ISemanticTokenColorizationSetting {
	return style && (types.isString(style.foreground) || types.isString(style.fontStyle) || types.isBoolean(style.italic)
		|| types.isBoolean(style.underline) || types.isBoolean(style.strikethrough) || types.isBoolean(style.bold));
}

export function findMetadata(colorThemeData: ColorThemeData, captureNames: string[], languageId: number, bracket: boolean): number {
	let metadata = 0;

	metadata |= (languageId << MetadataConsts.LANGUAGEID_OFFSET);

	const definitions: TextMateThemingRuleDefinitions = {};
	const tokenStyle = colorThemeData.resolveScopes([captureNames], definitions);

	if (captureNames.length > 0) {
		const standardToken = toStandardTokenType(captureNames[captureNames.length - 1]);
		metadata |= (standardToken << MetadataConsts.TOKEN_TYPE_OFFSET);
	}

	const fontStyle = definitions.foreground?.settings.fontStyle || definitions.bold?.settings.fontStyle;
	if (fontStyle?.includes('italic')) {
		metadata |= FontStyle.Italic | MetadataConsts.ITALIC_MASK;
	}
	if (fontStyle?.includes('bold')) {
		metadata |= FontStyle.Bold | MetadataConsts.BOLD_MASK;
	}
	if (fontStyle?.includes('underline')) {
		metadata |= FontStyle.Underline | MetadataConsts.UNDERLINE_MASK;
	}
	if (fontStyle?.includes('strikethrough')) {
		metadata |= FontStyle.Strikethrough | MetadataConsts.STRIKETHROUGH_MASK;
	}

	const foreground = tokenStyle?.foreground;
	const tokenStyleForeground = (foreground !== undefined) ? colorThemeData.getTokenColorIndex().get(foreground) : ColorId.DefaultForeground;
	metadata |= tokenStyleForeground << MetadataConsts.FOREGROUND_OFFSET;

	if (bracket) {
		metadata |= MetadataConsts.BALANCED_BRACKETS_MASK;
	}

	return metadata;
}

class TokenColorIndex {

	private _lastColorId: number;
	private _id2color: string[];
	private _color2id: { [color: string]: number };

	constructor() {
		this._lastColorId = 0;
		this._id2color = [];
		this._color2id = Object.create(null);
	}

	public add(color: string | Color | undefined): number {
		color = normalizeColor(color);
		if (color === undefined) {
			return 0;
		}

		let value = this._color2id[color];
		if (value) {
			return value;
		}
		value = ++this._lastColorId;
		this._color2id[color] = value;
		this._id2color[value] = color;
		return value;
	}

	public get(color: string | Color | undefined): number {
		color = normalizeColor(color);
		if (color === undefined) {
			return 0;
		}
		const value = this._color2id[color];
		if (value) {
			return value;
		}
		console.log(`Color ${color} not in index.`);
		return 0;
	}

	public asArray(): string[] {
		return this._id2color.slice(0);
	}
}

class TokenFontIndex {

	private _lastFontId: number;
	private _id2font: IFontTokenOptions[];
	private _font2id: Map<IFontTokenOptions, number>;

	constructor() {
		this._lastFontId = 0;
		this._id2font = [];
		this._font2id = new Map();
	}

	public add(fontFamily: string | undefined, fontSize: string | undefined, lineHeight: number | undefined): number {
		const font: IFontTokenOptions = { fontFamily, fontSize, lineHeight };
		let value = this._font2id.get(font);
		if (value) {
			return value;
		}
		value = ++this._lastFontId;
		this._font2id.set(font, value);
		this._id2font[value] = font;
		return value;
	}

	public get(font: IFontTokenOptions): number {
		const value = this._font2id.get(font);
		if (value) {
			return value;
		}
		return 0;
	}

	public asArray(): IFontTokenOptions[] {
		return this._id2font.slice(0);
	}
}

function normalizeColor(color: string | Color | undefined | null): string | undefined {
	if (!color) {
		return undefined;
	}
	if (typeof color !== 'string') {
		color = Color.Format.CSS.formatHexA(color, true);
	}
	const len = color.length;
	if (color.charCodeAt(0) !== CharCode.Hash || (len !== 4 && len !== 5 && len !== 7 && len !== 9)) {
		return undefined;
	}
	const result = [CharCode.Hash];

	for (let i = 1; i < len; i++) {
		const upper = hexUpper(color.charCodeAt(i));
		if (!upper) {
			return undefined;
		}
		result.push(upper);
		if (len === 4 || len === 5) {
			result.push(upper);
		}
	}

	if (result.length === 9 && result[7] === CharCode.F && result[8] === CharCode.F) {
		result.length = 7;
	}
	return String.fromCharCode(...result);
}

function hexUpper(charCode: CharCode): number {
	if (charCode >= CharCode.Digit0 && charCode <= CharCode.Digit9 || charCode >= CharCode.A && charCode <= CharCode.F) {
		return charCode;
	} else if (charCode >= CharCode.a && charCode <= CharCode.f) {
		return charCode - CharCode.a + CharCode.A;
	}
	return 0;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/themes/common/colorThemeSchema.ts]---
Location: vscode-main/src/vs/workbench/services/themes/common/colorThemeSchema.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as nls from '../../../../nls.js';

import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as JSONExtensions, IJSONContributionRegistry } from '../../../../platform/jsonschemas/common/jsonContributionRegistry.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';

import { workbenchColorsSchemaId } from '../../../../platform/theme/common/colorRegistry.js';
import { tokenStylingSchemaId } from '../../../../platform/theme/common/tokenClassificationRegistry.js';

const textMateScopes = [
	'comment',
	'comment.block',
	'comment.block.documentation',
	'comment.line',
	'constant',
	'constant.character',
	'constant.character.escape',
	'constant.numeric',
	'constant.numeric.integer',
	'constant.numeric.float',
	'constant.numeric.hex',
	'constant.numeric.octal',
	'constant.other',
	'constant.regexp',
	'constant.rgb-value',
	'emphasis',
	'entity',
	'entity.name',
	'entity.name.class',
	'entity.name.function',
	'entity.name.method',
	'entity.name.section',
	'entity.name.selector',
	'entity.name.tag',
	'entity.name.type',
	'entity.other',
	'entity.other.attribute-name',
	'entity.other.inherited-class',
	'invalid',
	'invalid.deprecated',
	'invalid.illegal',
	'keyword',
	'keyword.control',
	'keyword.operator',
	'keyword.operator.new',
	'keyword.operator.assignment',
	'keyword.operator.arithmetic',
	'keyword.operator.logical',
	'keyword.other',
	'markup',
	'markup.bold',
	'markup.changed',
	'markup.deleted',
	'markup.heading',
	'markup.inline.raw',
	'markup.inserted',
	'markup.italic',
	'markup.list',
	'markup.list.numbered',
	'markup.list.unnumbered',
	'markup.other',
	'markup.quote',
	'markup.raw',
	'markup.underline',
	'markup.underline.link',
	'meta',
	'meta.block',
	'meta.cast',
	'meta.class',
	'meta.function',
	'meta.function-call',
	'meta.preprocessor',
	'meta.return-type',
	'meta.selector',
	'meta.tag',
	'meta.type.annotation',
	'meta.type',
	'punctuation.definition.string.begin',
	'punctuation.definition.string.end',
	'punctuation.separator',
	'punctuation.separator.continuation',
	'punctuation.terminator',
	'storage',
	'storage.modifier',
	'storage.type',
	'string',
	'string.interpolated',
	'string.other',
	'string.quoted',
	'string.quoted.double',
	'string.quoted.other',
	'string.quoted.single',
	'string.quoted.triple',
	'string.regexp',
	'string.unquoted',
	'strong',
	'support',
	'support.class',
	'support.constant',
	'support.function',
	'support.other',
	'support.type',
	'support.type.property-name',
	'support.variable',
	'variable',
	'variable.language',
	'variable.name',
	'variable.other',
	'variable.other.readwrite',
	'variable.parameter'
];

export const textmateColorsSchemaId = 'vscode://schemas/textmate-colors';
export const textmateColorGroupSchemaId = `${textmateColorsSchemaId}#/definitions/colorGroup`;

const textmateColorSchema: IJSONSchema = {
	type: 'array',
	definitions: {
		colorGroup: {
			default: '#FF0000',
			anyOf: [
				{
					type: 'string',
					format: 'color-hex'
				},
				{
					$ref: '#/definitions/settings'
				}
			]
		},
		settings: {
			type: 'object',
			description: nls.localize('schema.token.settings', 'Colors and styles for the token.'),
			properties: {
				foreground: {
					type: 'string',
					description: nls.localize('schema.token.foreground', 'Foreground color for the token.'),
					format: 'color-hex',
					default: '#ff0000'
				},
				background: {
					type: 'string',
					deprecationMessage: nls.localize('schema.token.background.warning', 'Token background colors are currently not supported.')
				},
				fontStyle: {
					type: 'string',
					description: nls.localize('schema.token.fontStyle', 'Font style of the rule: \'italic\', \'bold\', \'underline\', \'strikethrough\' or a combination. The empty string unsets inherited settings.'),
					pattern: '^(\\s*\\b(italic|bold|underline|strikethrough))*\\s*$',
					patternErrorMessage: nls.localize('schema.fontStyle.error', 'Font style must be \'italic\', \'bold\', \'underline\', \'strikethrough\' or a combination or the empty string.'),
					defaultSnippets: [
						{ label: nls.localize('schema.token.fontStyle.none', 'None (clear inherited style)'), bodyText: '""' },
						{ body: 'italic' },
						{ body: 'bold' },
						{ body: 'underline' },
						{ body: 'strikethrough' },
						{ body: 'italic bold' },
						{ body: 'italic underline' },
						{ body: 'italic strikethrough' },
						{ body: 'bold underline' },
						{ body: 'bold strikethrough' },
						{ body: 'underline strikethrough' },
						{ body: 'italic bold underline' },
						{ body: 'italic bold strikethrough' },
						{ body: 'italic underline strikethrough' },
						{ body: 'bold underline strikethrough' },
						{ body: 'italic bold underline strikethrough' }
					]
				},
				fontFamily: {
					type: 'string',
					description: nls.localize('schema.token.fontFamily', 'Font family for the token (e.g., "Fira Code", "JetBrains Mono").')
				},
				fontSize: {
					type: 'string',
					description: nls.localize('schema.token.fontSize', 'Font size string for the token (e.g., "14px", "1.2em").')
				},
				lineHeight: {
					type: 'number',
					description: nls.localize('schema.token.lineHeight', 'Line height number for the token (e.g., "20").')
				}
			},
			additionalProperties: false,
			defaultSnippets: [{ body: { foreground: '${1:#FF0000}', fontStyle: '${2:bold}' } }]
		}
	},
	items: {
		type: 'object',
		defaultSnippets: [{ body: { scope: '${1:keyword.operator}', settings: { foreground: '${2:#FF0000}' } } }],
		properties: {
			name: {
				type: 'string',
				description: nls.localize('schema.properties.name', 'Description of the rule.')
			},
			scope: {
				description: nls.localize('schema.properties.scope', 'Scope selector against which this rule matches.'),
				anyOf: [
					{
						enum: textMateScopes
					},
					{
						type: 'string'
					},
					{
						type: 'array',
						items: {
							enum: textMateScopes
						}
					},
					{
						type: 'array',
						items: {
							type: 'string'
						}
					}
				]
			},
			settings: {
				$ref: '#/definitions/settings'
			}
		},
		required: [
			'settings'
		],
		additionalProperties: false
	}
};

export const colorThemeSchemaId = 'vscode://schemas/color-theme';

const colorThemeSchema: IJSONSchema = {
	type: 'object',
	allowComments: true,
	allowTrailingCommas: true,
	properties: {
		colors: {
			description: nls.localize('schema.workbenchColors', 'Colors in the workbench'),
			$ref: workbenchColorsSchemaId,
			additionalProperties: false
		},
		tokenColors: {
			anyOf: [{
				type: 'string',
				description: nls.localize('schema.tokenColors.path', 'Path to a tmTheme file (relative to the current file).')
			},
			{
				description: nls.localize('schema.colors', 'Colors for syntax highlighting'),
				$ref: textmateColorsSchemaId
			}
			]
		},
		semanticHighlighting: {
			type: 'boolean',
			description: nls.localize('schema.supportsSemanticHighlighting', 'Whether semantic highlighting should be enabled for this theme.')
		},
		semanticTokenColors: {
			type: 'object',
			description: nls.localize('schema.semanticTokenColors', 'Colors for semantic tokens'),
			$ref: tokenStylingSchemaId
		}
	}
};



export function registerColorThemeSchemas() {
	const schemaRegistry = Registry.as<IJSONContributionRegistry>(JSONExtensions.JSONContribution);
	schemaRegistry.registerSchema(colorThemeSchemaId, colorThemeSchema);
	schemaRegistry.registerSchema(textmateColorsSchemaId, textmateColorSchema);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/themes/common/fileIconThemeSchema.ts]---
Location: vscode-main/src/vs/workbench/services/themes/common/fileIconThemeSchema.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as nls from '../../../../nls.js';

import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as JSONExtensions, IJSONContributionRegistry } from '../../../../platform/jsonschemas/common/jsonContributionRegistry.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';
import { fontWeightRegex, fontStyleRegex, fontSizeRegex, fontIdRegex, fontColorRegex, fontIdErrorMessage } from '../../../../platform/theme/common/iconRegistry.js';

const schemaId = 'vscode://schemas/icon-theme';
const schema: IJSONSchema = {
	type: 'object',
	allowComments: true,
	allowTrailingCommas: true,
	definitions: {
		folderExpanded: {
			type: 'string',
			description: nls.localize('schema.folderExpanded', 'The folder icon for expanded folders. The expanded folder icon is optional. If not set, the icon defined for folder will be shown.')
		},
		folder: {
			type: 'string',
			description: nls.localize('schema.folder', 'The folder icon for collapsed folders, and if folderExpanded is not set, also for expanded folders.')

		},
		file: {
			type: 'string',
			description: nls.localize('schema.file', 'The default file icon, shown for all files that don\'t match any extension, filename or language id.')

		},
		rootFolder: {
			type: 'string',
			description: nls.localize('schema.rootFolder', 'The folder icon for collapsed root folders, and if rootFolderExpanded is not set, also for expanded root folders.')
		},
		rootFolderExpanded: {
			type: 'string',
			description: nls.localize('schema.rootFolderExpanded', 'The folder icon for expanded root folders. The expanded root folder icon is optional. If not set, the icon defined for root folder will be shown.')
		},
		rootFolderNames: {
			type: 'object',
			description: nls.localize('schema.rootFolderNames', 'Associates root folder names to icons. The object key is the root folder name. No patterns or wildcards are allowed. Root folder name matching is case insensitive.'),
			additionalProperties: {
				type: 'string',
				description: nls.localize('schema.folderName', 'The ID of the icon definition for the association.')
			}
		},
		rootFolderNamesExpanded: {
			type: 'object',
			description: nls.localize('schema.rootFolderNamesExpanded', 'Associates root folder names to icons for expanded root folders. The object key is the root folder name. No patterns or wildcards are allowed. Root folder name matching is case insensitive.'),
			additionalProperties: {
				type: 'string',
				description: nls.localize('schema.rootFolderNameExpanded', 'The ID of the icon definition for the association.')
			}
		},
		folderNames: {
			type: 'object',
			description: nls.localize('schema.folderNames', 'Associates folder names to icons. The object key is the folder name, not including any path segments. No patterns or wildcards are allowed. Folder name matching is case insensitive.'),
			additionalProperties: {
				type: 'string',
				description: nls.localize('schema.folderName', 'The ID of the icon definition for the association.')
			}
		},
		folderNamesExpanded: {
			type: 'object',
			description: nls.localize('schema.folderNamesExpanded', 'Associates folder names to icons for expanded folders. The object key is the folder name, not including any path segments. No patterns or wildcards are allowed. Folder name matching is case insensitive.'),
			additionalProperties: {
				type: 'string',
				description: nls.localize('schema.folderNameExpanded', 'The ID of the icon definition for the association.')
			}
		},
		fileExtensions: {
			type: 'object',
			description: nls.localize('schema.fileExtensions', 'Associates file extensions to icons. The object key is the file extension name. The extension name is the last segment of a file name after the last dot (not including the dot). Extensions are compared case insensitive.'),

			additionalProperties: {
				type: 'string',
				description: nls.localize('schema.fileExtension', 'The ID of the icon definition for the association.')
			}
		},
		fileNames: {
			type: 'object',
			description: nls.localize('schema.fileNames', 'Associates file names to icons. The object key is the full file name, but not including any path segments. File name can include dots and a possible file extension. No patterns or wildcards are allowed. File name matching is case insensitive.'),

			additionalProperties: {
				type: 'string',
				description: nls.localize('schema.fileName', 'The ID of the icon definition for the association.')
			}
		},
		languageIds: {
			type: 'object',
			description: nls.localize('schema.languageIds', 'Associates languages to icons. The object key is the language id as defined in the language contribution point.'),

			additionalProperties: {
				type: 'string',
				description: nls.localize('schema.languageId', 'The ID of the icon definition for the association.')
			}
		},
		associations: {
			type: 'object',
			properties: {
				folderExpanded: {
					$ref: '#/definitions/folderExpanded'
				},
				folder: {
					$ref: '#/definitions/folder'
				},
				file: {
					$ref: '#/definitions/file'
				},
				folderNames: {
					$ref: '#/definitions/folderNames'
				},
				folderNamesExpanded: {
					$ref: '#/definitions/folderNamesExpanded'
				},
				rootFolder: {
					$ref: '#/definitions/rootFolder'
				},
				rootFolderExpanded: {
					$ref: '#/definitions/rootFolderExpanded'
				},
				rootFolderNames: {
					$ref: '#/definitions/rootFolderNames'
				},
				rootFolderNamesExpanded: {
					$ref: '#/definitions/rootFolderNamesExpanded'
				},
				fileExtensions: {
					$ref: '#/definitions/fileExtensions'
				},
				fileNames: {
					$ref: '#/definitions/fileNames'
				},
				languageIds: {
					$ref: '#/definitions/languageIds'
				}
			}
		}
	},
	properties: {
		fonts: {
			type: 'array',
			description: nls.localize('schema.fonts', 'Fonts that are used in the icon definitions.'),
			items: {
				type: 'object',
				properties: {
					id: {
						type: 'string',
						description: nls.localize('schema.id', 'The ID of the font.'),
						pattern: fontIdRegex.source,
						patternErrorMessage: fontIdErrorMessage
					},
					src: {
						type: 'array',
						description: nls.localize('schema.src', 'The location of the font.'),
						items: {
							type: 'object',
							properties: {
								path: {
									type: 'string',
									description: nls.localize('schema.font-path', 'The font path, relative to the current file icon theme file.'),
								},
								format: {
									type: 'string',
									description: nls.localize('schema.font-format', 'The format of the font.'),
									enum: ['woff', 'woff2', 'truetype', 'opentype', 'embedded-opentype', 'svg']
								}
							},
							required: [
								'path',
								'format'
							]
						}
					},
					weight: {
						type: 'string',
						description: nls.localize('schema.font-weight', 'The weight of the font. See https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight for valid values.'),
						pattern: fontWeightRegex.source
					},
					style: {
						type: 'string',
						description: nls.localize('schema.font-style', 'The style of the font. See https://developer.mozilla.org/en-US/docs/Web/CSS/font-style for valid values.'),
						pattern: fontStyleRegex.source
					},
					size: {
						type: 'string',
						description: nls.localize('schema.font-size', 'The default size of the font. We strongly recommend using a percentage value, for example: 125%.'),
						pattern: fontSizeRegex.source
					}
				},
				required: [
					'id',
					'src'
				]
			}
		},
		iconDefinitions: {
			type: 'object',
			description: nls.localize('schema.iconDefinitions', 'Description of all icons that can be used when associating files to icons.'),
			additionalProperties: {
				type: 'object',
				description: nls.localize('schema.iconDefinition', 'An icon definition. The object key is the ID of the definition.'),
				properties: {
					iconPath: {
						type: 'string',
						description: nls.localize('schema.iconPath', 'When using a SVG or PNG: The path to the image. The path is relative to the icon set file.')
					},
					fontCharacter: {
						type: 'string',
						description: nls.localize('schema.fontCharacter', 'When using a glyph font: The character in the font to use.')
					},
					fontColor: {
						type: 'string',
						format: 'color-hex',
						description: nls.localize('schema.fontColor', 'When using a glyph font: The color to use.'),
						pattern: fontColorRegex.source
					},
					fontSize: {
						type: 'string',
						description: nls.localize('schema.fontSize', 'When using a font: The font size in percentage to the text font. If not set, defaults to the size in the font definition.'),
						pattern: fontSizeRegex.source
					},
					fontId: {
						type: 'string',
						description: nls.localize('schema.fontId', 'When using a font: The id of the font. If not set, defaults to the first font definition.'),
						pattern: fontIdRegex.source,
						patternErrorMessage: fontIdErrorMessage
					}
				}
			}
		},
		folderExpanded: {
			$ref: '#/definitions/folderExpanded'
		},
		folder: {
			$ref: '#/definitions/folder'
		},
		file: {
			$ref: '#/definitions/file'
		},
		folderNames: {
			$ref: '#/definitions/folderNames'
		},
		folderNamesExpanded: {
			$ref: '#/definitions/folderNamesExpanded'
		},
		rootFolder: {
			$ref: '#/definitions/rootFolder'
		},
		rootFolderExpanded: {
			$ref: '#/definitions/rootFolderExpanded'
		},
		rootFolderNames: {
			$ref: '#/definitions/rootFolderNames'
		},
		rootFolderNamesExpanded: {
			$ref: '#/definitions/rootFolderNamesExpanded'
		},
		fileExtensions: {
			$ref: '#/definitions/fileExtensions'
		},
		fileNames: {
			$ref: '#/definitions/fileNames'
		},
		languageIds: {
			$ref: '#/definitions/languageIds'
		},
		light: {
			$ref: '#/definitions/associations',
			description: nls.localize('schema.light', 'Optional associations for file icons in light color themes.')
		},
		highContrast: {
			$ref: '#/definitions/associations',
			description: nls.localize('schema.highContrast', 'Optional associations for file icons in high contrast color themes.')
		},
		hidesExplorerArrows: {
			type: 'boolean',
			description: nls.localize('schema.hidesExplorerArrows', 'Configures whether the file explorer\'s arrows should be hidden when this theme is active.')
		},
		showLanguageModeIcons: {
			type: 'boolean',
			description: nls.localize('schema.showLanguageModeIcons', 'Configures whether the default language icons should be used if the theme does not define an icon for a language.')
		}
	}
};

export function registerFileIconThemeSchemas() {
	const schemaRegistry = Registry.as<IJSONContributionRegistry>(JSONExtensions.JSONContribution);
	schemaRegistry.registerSchema(schemaId, schema);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/themes/common/hostColorSchemeService.ts]---
Location: vscode-main/src/vs/workbench/services/themes/common/hostColorSchemeService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export const IHostColorSchemeService = createDecorator<IHostColorSchemeService>('hostColorSchemeService');

export interface IHostColorSchemeService {

	readonly _serviceBrand: undefined;

	readonly dark: boolean;
	readonly highContrast: boolean;
	readonly onDidChangeColorScheme: Event<void>;

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/themes/common/iconExtensionPoint.ts]---
Location: vscode-main/src/vs/workbench/services/themes/common/iconExtensionPoint.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { ExtensionsRegistry } from '../../extensions/common/extensionsRegistry.js';
import { IIconRegistry, Extensions as IconRegistryExtensions } from '../../../../platform/theme/common/iconRegistry.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import * as resources from '../../../../base/common/resources.js';
import { IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { extname, posix } from '../../../../base/common/path.js';

interface IIconExtensionPoint {
	[id: string]: {
		description: string;
		default: { fontPath: string; fontCharacter: string } | string;
	};
}

const iconRegistry: IIconRegistry = Registry.as<IIconRegistry>(IconRegistryExtensions.IconContribution);

const iconReferenceSchema = iconRegistry.getIconReferenceSchema();
const iconIdPattern = `^${ThemeIcon.iconNameSegment}(-${ThemeIcon.iconNameSegment})+$`;

const iconConfigurationExtPoint = ExtensionsRegistry.registerExtensionPoint<IIconExtensionPoint>({
	extensionPoint: 'icons',
	jsonSchema: {
		description: nls.localize('contributes.icons', 'Contributes extension defined themable icons'),
		type: 'object',
		propertyNames: {
			pattern: iconIdPattern,
			description: nls.localize('contributes.icon.id', 'The identifier of the themable icon'),
			patternErrorMessage: nls.localize('contributes.icon.id.format', 'Identifiers can only contain letters, digits and minuses and need to consist of at least two segments in the form `component-iconname`.'),
		},
		additionalProperties: {
			type: 'object',
			properties: {
				description: {
					type: 'string',
					description: nls.localize('contributes.icon.description', 'The description of the themable icon'),
				},
				default: {
					anyOf: [
						iconReferenceSchema,
						{
							type: 'object',
							properties: {
								fontPath: {
									description: nls.localize('contributes.icon.default.fontPath', 'The path of the icon font that defines the icon.'),
									type: 'string'
								},
								fontCharacter: {
									description: nls.localize('contributes.icon.default.fontCharacter', 'The character for the icon in the icon font.'),
									type: 'string'
								}
							},
							required: ['fontPath', 'fontCharacter'],
							defaultSnippets: [{ body: { fontPath: '${1:myiconfont.woff}', fontCharacter: '${2:\\\\E001}' } }]
						}
					],
					description: nls.localize('contributes.icon.default', 'The default of the icon. Either a reference to an existing ThemeIcon or an icon in an icon font.'),
				}
			},
			required: ['description', 'default'],
			defaultSnippets: [{ body: { description: '${1:my icon}', default: { fontPath: '${2:myiconfont.woff}', fontCharacter: '${3:\\\\E001}' } } }]
		},
		defaultSnippets: [{ body: { '${1:my-icon-id}': { description: '${2:my icon}', default: { fontPath: '${3:myiconfont.woff}', fontCharacter: '${4:\\\\E001}' } } } }]
	}
});

export class IconExtensionPoint {

	constructor() {
		iconConfigurationExtPoint.setHandler((extensions, delta) => {
			for (const extension of delta.added) {
				const extensionValue = <IIconExtensionPoint>extension.value;
				const collector = extension.collector;

				if (!extensionValue || typeof extensionValue !== 'object') {
					collector.error(nls.localize('invalid.icons.configuration', "'configuration.icons' must be an object with the icon names as properties."));
					return;
				}

				for (const id in extensionValue) {
					if (!id.match(iconIdPattern)) {
						collector.error(nls.localize('invalid.icons.id.format', "'configuration.icons' keys represent the icon id and can only contain letter, digits and minuses. They need to consist of at least two segments in the form `component-iconname`."));
						return;
					}
					const iconContribution = extensionValue[id];
					if (typeof iconContribution.description !== 'string' || iconContribution.description.length === 0) {
						collector.error(nls.localize('invalid.icons.description', "'configuration.icons.description' must be defined and can not be empty"));
						return;
					}
					const defaultIcon = iconContribution.default;
					if (typeof defaultIcon === 'string') {
						iconRegistry.registerIcon(id, { id: defaultIcon }, iconContribution.description);
					} else if (typeof defaultIcon === 'object' && typeof defaultIcon.fontPath === 'string' && typeof defaultIcon.fontCharacter === 'string') {
						const fileExt = extname(defaultIcon.fontPath).substring(1);
						const format = formatMap[fileExt];
						if (!format) {
							collector.warn(nls.localize('invalid.icons.default.fontPath.extension', "Expected `contributes.icons.default.fontPath` to have file extension 'woff', woff2' or 'ttf', is '{0}'.", fileExt));
							return;
						}
						const extensionLocation = extension.description.extensionLocation;
						const iconFontLocation = resources.joinPath(extensionLocation, defaultIcon.fontPath);
						const fontId = getFontId(extension.description, defaultIcon.fontPath);
						const definition = iconRegistry.registerIconFont(fontId, { src: [{ location: iconFontLocation, format }] });
						if (!resources.isEqualOrParent(iconFontLocation, extensionLocation)) {
							collector.warn(nls.localize('invalid.icons.default.fontPath.path', "Expected `contributes.icons.default.fontPath` ({0}) to be included inside extension's folder ({0}).", iconFontLocation.path, extensionLocation.path));
							return;
						}
						iconRegistry.registerIcon(id, {
							fontCharacter: defaultIcon.fontCharacter,
							font: {
								id: fontId,
								definition
							}
						}, iconContribution.description);
					} else {
						collector.error(nls.localize('invalid.icons.default', "'configuration.icons.default' must be either a reference to the id of an other theme icon (string) or a icon definition (object) with properties `fontPath` and `fontCharacter`."));
					}
				}
			}
			for (const extension of delta.removed) {
				const extensionValue = <IIconExtensionPoint>extension.value;
				for (const id in extensionValue) {
					iconRegistry.deregisterIcon(id);
				}
			}
		});
	}
}

const formatMap: Record<string, string> = {
	'ttf': 'truetype',
	'woff': 'woff',
	'woff2': 'woff2'
};

function getFontId(description: IExtensionDescription, fontPath: string) {
	return posix.join(description.identifier.value, fontPath);
}
```

--------------------------------------------------------------------------------

````

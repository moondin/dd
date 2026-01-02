---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 217
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 217 of 552)

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

---[FILE: src/vs/editor/common/services/languageFeaturesService.ts]---
Location: vscode-main/src/vs/editor/common/services/languageFeaturesService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';
import { LanguageFeatureRegistry, NotebookInfo, NotebookInfoResolver } from '../languageFeatureRegistry.js';
import { CodeActionProvider, CodeLensProvider, CompletionItemProvider, DocumentPasteEditProvider, DeclarationProvider, DefinitionProvider, DocumentColorProvider, DocumentFormattingEditProvider, MultiDocumentHighlightProvider, DocumentHighlightProvider, DocumentDropEditProvider, DocumentRangeFormattingEditProvider, DocumentRangeSemanticTokensProvider, DocumentSemanticTokensProvider, DocumentSymbolProvider, EvaluatableExpressionProvider, FoldingRangeProvider, HoverProvider, ImplementationProvider, InlayHintsProvider, InlineCompletionsProvider, InlineValuesProvider, LinkedEditingRangeProvider, LinkProvider, OnTypeFormattingEditProvider, ReferenceProvider, RenameProvider, SelectionRangeProvider, SignatureHelpProvider, TypeDefinitionProvider, NewSymbolNamesProvider } from '../languages.js';
import { ILanguageFeaturesService } from './languageFeatures.js';
import { InstantiationType, registerSingleton } from '../../../platform/instantiation/common/extensions.js';

export class LanguageFeaturesService implements ILanguageFeaturesService {

	declare _serviceBrand: undefined;

	readonly referenceProvider = new LanguageFeatureRegistry<ReferenceProvider>(this._score.bind(this));
	readonly renameProvider = new LanguageFeatureRegistry<RenameProvider>(this._score.bind(this));
	readonly newSymbolNamesProvider = new LanguageFeatureRegistry<NewSymbolNamesProvider>(this._score.bind(this));
	readonly codeActionProvider = new LanguageFeatureRegistry<CodeActionProvider>(this._score.bind(this));
	readonly definitionProvider = new LanguageFeatureRegistry<DefinitionProvider>(this._score.bind(this));
	readonly typeDefinitionProvider = new LanguageFeatureRegistry<TypeDefinitionProvider>(this._score.bind(this));
	readonly declarationProvider = new LanguageFeatureRegistry<DeclarationProvider>(this._score.bind(this));
	readonly implementationProvider = new LanguageFeatureRegistry<ImplementationProvider>(this._score.bind(this));
	readonly documentSymbolProvider = new LanguageFeatureRegistry<DocumentSymbolProvider>(this._score.bind(this));
	readonly inlayHintsProvider = new LanguageFeatureRegistry<InlayHintsProvider>(this._score.bind(this));
	readonly colorProvider = new LanguageFeatureRegistry<DocumentColorProvider>(this._score.bind(this));
	readonly codeLensProvider = new LanguageFeatureRegistry<CodeLensProvider>(this._score.bind(this));
	readonly documentFormattingEditProvider = new LanguageFeatureRegistry<DocumentFormattingEditProvider>(this._score.bind(this));
	readonly documentRangeFormattingEditProvider = new LanguageFeatureRegistry<DocumentRangeFormattingEditProvider>(this._score.bind(this));
	readonly onTypeFormattingEditProvider = new LanguageFeatureRegistry<OnTypeFormattingEditProvider>(this._score.bind(this));
	readonly signatureHelpProvider = new LanguageFeatureRegistry<SignatureHelpProvider>(this._score.bind(this));
	readonly hoverProvider = new LanguageFeatureRegistry<HoverProvider>(this._score.bind(this));
	readonly documentHighlightProvider = new LanguageFeatureRegistry<DocumentHighlightProvider>(this._score.bind(this));
	readonly multiDocumentHighlightProvider = new LanguageFeatureRegistry<MultiDocumentHighlightProvider>(this._score.bind(this));
	readonly selectionRangeProvider = new LanguageFeatureRegistry<SelectionRangeProvider>(this._score.bind(this));
	readonly foldingRangeProvider = new LanguageFeatureRegistry<FoldingRangeProvider>(this._score.bind(this));
	readonly linkProvider = new LanguageFeatureRegistry<LinkProvider>(this._score.bind(this));
	readonly inlineCompletionsProvider = new LanguageFeatureRegistry<InlineCompletionsProvider>(this._score.bind(this));
	readonly completionProvider = new LanguageFeatureRegistry<CompletionItemProvider>(this._score.bind(this));
	readonly linkedEditingRangeProvider = new LanguageFeatureRegistry<LinkedEditingRangeProvider>(this._score.bind(this));
	readonly inlineValuesProvider = new LanguageFeatureRegistry<InlineValuesProvider>(this._score.bind(this));
	readonly evaluatableExpressionProvider = new LanguageFeatureRegistry<EvaluatableExpressionProvider>(this._score.bind(this));
	readonly documentRangeSemanticTokensProvider = new LanguageFeatureRegistry<DocumentRangeSemanticTokensProvider>(this._score.bind(this));
	readonly documentSemanticTokensProvider = new LanguageFeatureRegistry<DocumentSemanticTokensProvider>(this._score.bind(this));
	readonly documentDropEditProvider = new LanguageFeatureRegistry<DocumentDropEditProvider>(this._score.bind(this));
	readonly documentPasteEditProvider = new LanguageFeatureRegistry<DocumentPasteEditProvider>(this._score.bind(this));

	private _notebookTypeResolver?: NotebookInfoResolver;

	setNotebookTypeResolver(resolver: NotebookInfoResolver | undefined) {
		this._notebookTypeResolver = resolver;
	}

	private _score(uri: URI): NotebookInfo | undefined {
		return this._notebookTypeResolver?.(uri);
	}

}

registerSingleton(ILanguageFeaturesService, LanguageFeaturesService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/languagesAssociations.ts]---
Location: vscode-main/src/vs/editor/common/services/languagesAssociations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ParsedPattern, parse } from '../../../base/common/glob.js';
import { Mimes } from '../../../base/common/mime.js';
import { Schemas } from '../../../base/common/network.js';
import { basename, posix } from '../../../base/common/path.js';
import { DataUri } from '../../../base/common/resources.js';
import { endsWithIgnoreCase, equals, startsWithUTF8BOM } from '../../../base/common/strings.js';
import { URI } from '../../../base/common/uri.js';
import { PLAINTEXT_LANGUAGE_ID } from '../languages/modesRegistry.js';

export interface ILanguageAssociation {
	readonly id: string;
	readonly mime: string;
	readonly filename?: string;
	readonly extension?: string;
	readonly filepattern?: string;
	readonly firstline?: RegExp;
}

interface ILanguageAssociationItem extends ILanguageAssociation {
	readonly userConfigured: boolean;
	readonly filepatternParsed?: ParsedPattern;
	readonly filepatternOnPath?: boolean;
}

let registeredAssociations: ILanguageAssociationItem[] = [];
let nonUserRegisteredAssociations: ILanguageAssociationItem[] = [];
let userRegisteredAssociations: ILanguageAssociationItem[] = [];

/**
 * Associate a language to the registry (platform).
 * * **NOTE**: This association will lose over associations registered using `registerConfiguredLanguageAssociation`.
 * * **NOTE**: Use `clearPlatformLanguageAssociations` to remove all associations registered using this function.
 */
export function registerPlatformLanguageAssociation(association: ILanguageAssociation, warnOnOverwrite = false): void {
	_registerLanguageAssociation(association, false, warnOnOverwrite);
}

/**
 * Associate a language to the registry (configured).
 * * **NOTE**: This association will win over associations registered using `registerPlatformLanguageAssociation`.
 * * **NOTE**: Use `clearConfiguredLanguageAssociations` to remove all associations registered using this function.
 */
export function registerConfiguredLanguageAssociation(association: ILanguageAssociation): void {
	_registerLanguageAssociation(association, true, false);
}

function _registerLanguageAssociation(association: ILanguageAssociation, userConfigured: boolean, warnOnOverwrite: boolean): void {

	// Register
	const associationItem = toLanguageAssociationItem(association, userConfigured);
	registeredAssociations.push(associationItem);
	if (!associationItem.userConfigured) {
		nonUserRegisteredAssociations.push(associationItem);
	} else {
		userRegisteredAssociations.push(associationItem);
	}

	// Check for conflicts unless this is a user configured association
	if (warnOnOverwrite && !associationItem.userConfigured) {
		registeredAssociations.forEach(a => {
			if (a.mime === associationItem.mime || a.userConfigured) {
				return; // same mime or userConfigured is ok
			}

			if (associationItem.extension && a.extension === associationItem.extension) {
				console.warn(`Overwriting extension <<${associationItem.extension}>> to now point to mime <<${associationItem.mime}>>`);
			}

			if (associationItem.filename && a.filename === associationItem.filename) {
				console.warn(`Overwriting filename <<${associationItem.filename}>> to now point to mime <<${associationItem.mime}>>`);
			}

			if (associationItem.filepattern && a.filepattern === associationItem.filepattern) {
				console.warn(`Overwriting filepattern <<${associationItem.filepattern}>> to now point to mime <<${associationItem.mime}>>`);
			}

			if (associationItem.firstline && a.firstline === associationItem.firstline) {
				console.warn(`Overwriting firstline <<${associationItem.firstline}>> to now point to mime <<${associationItem.mime}>>`);
			}
		});
	}
}

function toLanguageAssociationItem(association: ILanguageAssociation, userConfigured: boolean): ILanguageAssociationItem {
	return {
		id: association.id,
		mime: association.mime,
		filename: association.filename,
		extension: association.extension,
		filepattern: association.filepattern,
		firstline: association.firstline,
		userConfigured: userConfigured,
		filepatternParsed: association.filepattern ? parse(association.filepattern, { ignoreCase: true }) : undefined,
		filepatternOnPath: association.filepattern ? association.filepattern.indexOf(posix.sep) >= 0 : false
	};
}

/**
 * Clear language associations from the registry (platform).
 */
export function clearPlatformLanguageAssociations(): void {
	registeredAssociations = registeredAssociations.filter(a => a.userConfigured);
	nonUserRegisteredAssociations = [];
}

/**
 * Clear language associations from the registry (configured).
 */
export function clearConfiguredLanguageAssociations(): void {
	registeredAssociations = registeredAssociations.filter(a => !a.userConfigured);
	userRegisteredAssociations = [];
}

interface IdAndMime {
	id: string;
	mime: string;
}

/**
 * Given a file, return the best matching mime types for it
 * based on the registered language associations.
 */
export function getMimeTypes(resource: URI | null, firstLine?: string): string[] {
	return getAssociations(resource, firstLine).map(item => item.mime);
}

/**
 * @see `getMimeTypes`
 */
export function getLanguageIds(resource: URI | null, firstLine?: string): string[] {
	return getAssociations(resource, firstLine).map(item => item.id);
}

function getAssociations(resource: URI | null, firstLine?: string): IdAndMime[] {
	let path: string | undefined;
	if (resource) {
		switch (resource.scheme) {
			case Schemas.file:
				path = resource.fsPath;
				break;
			case Schemas.data: {
				const metadata = DataUri.parseMetaData(resource);
				path = metadata.get(DataUri.META_DATA_LABEL);
				break;
			}
			case Schemas.vscodeNotebookCell:
				// File path not relevant for language detection of cell
				path = undefined;
				break;
			default:
				path = resource.path;
		}
	}

	if (!path) {
		return [{ id: 'unknown', mime: Mimes.unknown }];
	}

	path = path.toLowerCase();

	const filename = basename(path);

	// 1.) User configured mappings have highest priority
	const configuredLanguage = getAssociationByPath(path, filename, userRegisteredAssociations);
	if (configuredLanguage) {
		return [configuredLanguage, { id: PLAINTEXT_LANGUAGE_ID, mime: Mimes.text }];
	}

	// 2.) Registered mappings have middle priority
	const registeredLanguage = getAssociationByPath(path, filename, nonUserRegisteredAssociations);
	if (registeredLanguage) {
		return [registeredLanguage, { id: PLAINTEXT_LANGUAGE_ID, mime: Mimes.text }];
	}

	// 3.) Firstline has lowest priority
	if (firstLine) {
		const firstlineLanguage = getAssociationByFirstline(firstLine);
		if (firstlineLanguage) {
			return [firstlineLanguage, { id: PLAINTEXT_LANGUAGE_ID, mime: Mimes.text }];
		}
	}

	return [{ id: 'unknown', mime: Mimes.unknown }];
}

function getAssociationByPath(path: string, filename: string, associations: ILanguageAssociationItem[]): ILanguageAssociationItem | undefined {
	let filenameMatch: ILanguageAssociationItem | undefined = undefined;
	let patternMatch: ILanguageAssociationItem | undefined = undefined;
	let extensionMatch: ILanguageAssociationItem | undefined = undefined;

	// We want to prioritize associations based on the order they are registered so that the last registered
	// association wins over all other. This is for https://github.com/microsoft/vscode/issues/20074
	for (let i = associations.length - 1; i >= 0; i--) {
		const association = associations[i];

		// First exact name match
		if (equals(filename, association.filename, true)) {
			filenameMatch = association;
			break; // take it!
		}

		// Longest pattern match
		if (association.filepattern) {
			if (!patternMatch || association.filepattern.length > patternMatch.filepattern!.length) {
				const target = association.filepatternOnPath ? path : filename; // match on full path if pattern contains path separator
				if (association.filepatternParsed?.(target)) {
					patternMatch = association;
				}
			}
		}

		// Longest extension match
		if (association.extension) {
			if (!extensionMatch || association.extension.length > extensionMatch.extension!.length) {
				if (endsWithIgnoreCase(filename, association.extension)) {
					extensionMatch = association;
				}
			}
		}
	}

	// 1.) Exact name match has second highest priority
	if (filenameMatch) {
		return filenameMatch;
	}

	// 2.) Match on pattern
	if (patternMatch) {
		return patternMatch;
	}

	// 3.) Match on extension comes next
	if (extensionMatch) {
		return extensionMatch;
	}

	return undefined;
}

function getAssociationByFirstline(firstLine: string): ILanguageAssociationItem | undefined {
	if (startsWithUTF8BOM(firstLine)) {
		firstLine = firstLine.substring(1);
	}

	if (firstLine.length > 0) {

		// We want to prioritize associations based on the order they are registered so that the last registered
		// association wins over all other. This is for https://github.com/microsoft/vscode/issues/20074
		for (let i = registeredAssociations.length - 1; i >= 0; i--) {
			const association = registeredAssociations[i];
			if (!association.firstline) {
				continue;
			}

			const matches = firstLine.match(association.firstline);
			if (matches && matches.length > 0) {
				return association;
			}
		}
	}

	return undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/languageService.ts]---
Location: vscode-main/src/vs/editor/common/services/languageService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { LanguagesRegistry } from './languagesRegistry.js';
import { ILanguageNameIdPair, ILanguageSelection, ILanguageService, ILanguageIcon, ILanguageExtensionPoint } from '../languages/language.js';
import { ILanguageIdCodec, TokenizationRegistry } from '../languages.js';
import { PLAINTEXT_LANGUAGE_ID } from '../languages/modesRegistry.js';
import { IObservable, observableFromEvent } from '../../../base/common/observable.js';

export class LanguageService extends Disposable implements ILanguageService {
	public _serviceBrand: undefined;

	static instanceCount = 0;

	private readonly _onDidRequestBasicLanguageFeatures = this._register(new Emitter<string>());
	public readonly onDidRequestBasicLanguageFeatures = this._onDidRequestBasicLanguageFeatures.event;

	private readonly _onDidRequestRichLanguageFeatures = this._register(new Emitter<string>());
	public readonly onDidRequestRichLanguageFeatures = this._onDidRequestRichLanguageFeatures.event;

	protected readonly _onDidChange = this._register(new Emitter<void>({ leakWarningThreshold: 200 /* https://github.com/microsoft/vscode/issues/119968 */ }));
	public readonly onDidChange: Event<void> = this._onDidChange.event;

	private readonly _requestedBasicLanguages = new Set<string>();
	private readonly _requestedRichLanguages = new Set<string>();

	protected readonly _registry: LanguagesRegistry;
	public readonly languageIdCodec: ILanguageIdCodec;

	constructor(warnOnOverwrite = false) {
		super();
		LanguageService.instanceCount++;
		this._registry = this._register(new LanguagesRegistry(true, warnOnOverwrite));
		this.languageIdCodec = this._registry.languageIdCodec;
		this._register(this._registry.onDidChange(() => this._onDidChange.fire()));
	}

	public override dispose(): void {
		LanguageService.instanceCount--;
		super.dispose();
	}

	public registerLanguage(def: ILanguageExtensionPoint): IDisposable {
		return this._registry.registerLanguage(def);
	}

	public isRegisteredLanguageId(languageId: string | null | undefined): boolean {
		return this._registry.isRegisteredLanguageId(languageId);
	}

	public getRegisteredLanguageIds(): string[] {
		return this._registry.getRegisteredLanguageIds();
	}

	public getSortedRegisteredLanguageNames(): ILanguageNameIdPair[] {
		return this._registry.getSortedRegisteredLanguageNames();
	}

	public getLanguageName(languageId: string): string | null {
		return this._registry.getLanguageName(languageId);
	}

	public getMimeType(languageId: string): string | null {
		return this._registry.getMimeType(languageId);
	}

	public getIcon(languageId: string): ILanguageIcon | null {
		return this._registry.getIcon(languageId);
	}

	public getExtensions(languageId: string): ReadonlyArray<string> {
		return this._registry.getExtensions(languageId);
	}

	public getFilenames(languageId: string): ReadonlyArray<string> {
		return this._registry.getFilenames(languageId);
	}

	public getConfigurationFiles(languageId: string): ReadonlyArray<URI> {
		return this._registry.getConfigurationFiles(languageId);
	}

	public getLanguageIdByLanguageName(languageName: string): string | null {
		return this._registry.getLanguageIdByLanguageName(languageName);
	}

	public getLanguageIdByMimeType(mimeType: string | null | undefined): string | null {
		return this._registry.getLanguageIdByMimeType(mimeType);
	}

	public guessLanguageIdByFilepathOrFirstLine(resource: URI | null, firstLine?: string): string | null {
		const languageIds = this._registry.guessLanguageIdByFilepathOrFirstLine(resource, firstLine);
		return languageIds.at(0) ?? null;
	}

	public createById(languageId: string | null | undefined): ILanguageSelection {
		return new LanguageSelection(this.onDidChange, () => {
			return this._createAndGetLanguageIdentifier(languageId);
		});
	}

	public createByMimeType(mimeType: string | null | undefined): ILanguageSelection {
		return new LanguageSelection(this.onDidChange, () => {
			const languageId = this.getLanguageIdByMimeType(mimeType);
			return this._createAndGetLanguageIdentifier(languageId);
		});
	}

	public createByFilepathOrFirstLine(resource: URI | null, firstLine?: string): ILanguageSelection {
		return new LanguageSelection(this.onDidChange, () => {
			const languageId = this.guessLanguageIdByFilepathOrFirstLine(resource, firstLine);
			return this._createAndGetLanguageIdentifier(languageId);
		});
	}

	private _createAndGetLanguageIdentifier(languageId: string | null | undefined): string {
		if (!languageId || !this.isRegisteredLanguageId(languageId)) {
			// Fall back to plain text if language is unknown
			languageId = PLAINTEXT_LANGUAGE_ID;
		}

		return languageId;
	}

	public requestBasicLanguageFeatures(languageId: string): void {
		if (!this._requestedBasicLanguages.has(languageId)) {
			this._requestedBasicLanguages.add(languageId);
			this._onDidRequestBasicLanguageFeatures.fire(languageId);
		}
	}

	public requestRichLanguageFeatures(languageId: string): void {
		if (!this._requestedRichLanguages.has(languageId)) {
			this._requestedRichLanguages.add(languageId);

			// Ensure basic features are requested
			this.requestBasicLanguageFeatures(languageId);

			// Ensure tokenizers are created
			TokenizationRegistry.getOrCreate(languageId);

			this._onDidRequestRichLanguageFeatures.fire(languageId);
		}
	}
}

class LanguageSelection implements ILanguageSelection {
	private readonly _value: IObservable<string>;
	public readonly onDidChange: Event<string>;

	constructor(onDidChangeLanguages: Event<void>, selector: () => string) {
		this._value = observableFromEvent(this, onDidChangeLanguages, () => selector());
		this.onDidChange = Event.fromObservable(this._value);
	}

	public get languageId(): string {
		return this._value.get();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/languagesRegistry.ts]---
Location: vscode-main/src/vs/editor/common/services/languagesRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../base/common/lifecycle.js';
import { compareIgnoreCase, regExpLeadsToEndlessLoop } from '../../../base/common/strings.js';
import { clearPlatformLanguageAssociations, getLanguageIds, registerPlatformLanguageAssociation } from './languagesAssociations.js';
import { URI } from '../../../base/common/uri.js';
import { ILanguageIdCodec } from '../languages.js';
import { LanguageId } from '../encodedTokenAttributes.js';
import { ModesRegistry, PLAINTEXT_LANGUAGE_ID } from '../languages/modesRegistry.js';
import { ILanguageExtensionPoint, ILanguageNameIdPair, ILanguageIcon } from '../languages/language.js';
import { Extensions, IConfigurationRegistry } from '../../../platform/configuration/common/configurationRegistry.js';
import { Registry } from '../../../platform/registry/common/platform.js';

const hasOwnProperty = Object.prototype.hasOwnProperty;
const NULL_LANGUAGE_ID = 'vs.editor.nullLanguage';

interface IResolvedLanguage {
	identifier: string;
	name: string | null;
	mimetypes: string[];
	aliases: string[];
	extensions: string[];
	filenames: string[];
	configurationFiles: URI[];
	icons: ILanguageIcon[];
}

export class LanguageIdCodec implements ILanguageIdCodec {

	private _nextLanguageId: number;
	private readonly _languageIdToLanguage: string[] = [];
	private readonly _languageToLanguageId = new Map<string, number>();

	constructor() {
		this._register(NULL_LANGUAGE_ID, LanguageId.Null);
		this._register(PLAINTEXT_LANGUAGE_ID, LanguageId.PlainText);
		this._nextLanguageId = 2;
	}

	private _register(language: string, languageId: LanguageId): void {
		this._languageIdToLanguage[languageId] = language;
		this._languageToLanguageId.set(language, languageId);
	}

	public register(language: string): void {
		if (this._languageToLanguageId.has(language)) {
			return;
		}
		const languageId = this._nextLanguageId++;
		this._register(language, languageId);
	}

	public encodeLanguageId(languageId: string): LanguageId {
		return this._languageToLanguageId.get(languageId) || LanguageId.Null;
	}

	public decodeLanguageId(languageId: LanguageId): string {
		return this._languageIdToLanguage[languageId] || NULL_LANGUAGE_ID;
	}
}

export class LanguagesRegistry extends Disposable {

	static instanceCount = 0;

	private readonly _onDidChange: Emitter<void> = this._register(new Emitter<void>());
	public readonly onDidChange: Event<void> = this._onDidChange.event;

	private readonly _warnOnOverwrite: boolean;
	public readonly languageIdCodec: LanguageIdCodec;
	private _dynamicLanguages: ILanguageExtensionPoint[];
	private _languages: { [id: string]: IResolvedLanguage };
	private _mimeTypesMap: { [mimeType: string]: string };
	private _nameMap: { [name: string]: string };
	private _lowercaseNameMap: { [name: string]: string };

	constructor(useModesRegistry = true, warnOnOverwrite = false) {
		super();
		LanguagesRegistry.instanceCount++;

		this._warnOnOverwrite = warnOnOverwrite;
		this.languageIdCodec = new LanguageIdCodec();
		this._dynamicLanguages = [];
		this._languages = {};
		this._mimeTypesMap = {};
		this._nameMap = {};
		this._lowercaseNameMap = {};

		if (useModesRegistry) {
			this._initializeFromRegistry();
			this._register(ModesRegistry.onDidChangeLanguages((m) => {
				this._initializeFromRegistry();
			}));
		}
	}

	override dispose() {
		LanguagesRegistry.instanceCount--;
		super.dispose();
	}

	public setDynamicLanguages(def: ILanguageExtensionPoint[]): void {
		this._dynamicLanguages = def;
		this._initializeFromRegistry();
	}

	private _initializeFromRegistry(): void {
		this._languages = {};
		this._mimeTypesMap = {};
		this._nameMap = {};
		this._lowercaseNameMap = {};

		clearPlatformLanguageAssociations();
		const desc = (<ILanguageExtensionPoint[]>[]).concat(ModesRegistry.getLanguages()).concat(this._dynamicLanguages);
		this._registerLanguages(desc);
	}

	registerLanguage(desc: ILanguageExtensionPoint): IDisposable {
		return ModesRegistry.registerLanguage(desc);
	}

	_registerLanguages(desc: ILanguageExtensionPoint[]): void {

		for (const d of desc) {
			this._registerLanguage(d);
		}

		// Rebuild fast path maps
		this._mimeTypesMap = {};
		this._nameMap = {};
		this._lowercaseNameMap = {};
		Object.keys(this._languages).forEach((langId) => {
			const language = this._languages[langId];
			if (language.name) {
				this._nameMap[language.name] = language.identifier;
			}
			language.aliases.forEach((alias) => {
				this._lowercaseNameMap[alias.toLowerCase()] = language.identifier;
			});
			language.mimetypes.forEach((mimetype) => {
				this._mimeTypesMap[mimetype] = language.identifier;
			});
		});

		Registry.as<IConfigurationRegistry>(Extensions.Configuration).registerOverrideIdentifiers(this.getRegisteredLanguageIds());

		this._onDidChange.fire();
	}

	private _registerLanguage(lang: ILanguageExtensionPoint): void {
		const langId = lang.id;

		let resolvedLanguage: IResolvedLanguage;
		if (hasOwnProperty.call(this._languages, langId)) {
			resolvedLanguage = this._languages[langId];
		} else {
			this.languageIdCodec.register(langId);
			resolvedLanguage = {
				identifier: langId,
				name: null,
				mimetypes: [],
				aliases: [],
				extensions: [],
				filenames: [],
				configurationFiles: [],
				icons: []
			};
			this._languages[langId] = resolvedLanguage;
		}

		this._mergeLanguage(resolvedLanguage, lang);
	}

	private _mergeLanguage(resolvedLanguage: IResolvedLanguage, lang: ILanguageExtensionPoint): void {
		const langId = lang.id;

		let primaryMime: string | null = null;

		if (Array.isArray(lang.mimetypes) && lang.mimetypes.length > 0) {
			resolvedLanguage.mimetypes.push(...lang.mimetypes);
			primaryMime = lang.mimetypes[0];
		}

		if (!primaryMime) {
			primaryMime = `text/x-${langId}`;
			resolvedLanguage.mimetypes.push(primaryMime);
		}

		if (Array.isArray(lang.extensions)) {
			if (lang.configuration) {
				// insert first as this appears to be the 'primary' language definition
				resolvedLanguage.extensions = lang.extensions.concat(resolvedLanguage.extensions);
			} else {
				resolvedLanguage.extensions = resolvedLanguage.extensions.concat(lang.extensions);
			}
			for (const extension of lang.extensions) {
				registerPlatformLanguageAssociation({ id: langId, mime: primaryMime, extension: extension }, this._warnOnOverwrite);
			}
		}

		if (Array.isArray(lang.filenames)) {
			for (const filename of lang.filenames) {
				registerPlatformLanguageAssociation({ id: langId, mime: primaryMime, filename: filename }, this._warnOnOverwrite);
				resolvedLanguage.filenames.push(filename);
			}
		}

		if (Array.isArray(lang.filenamePatterns)) {
			for (const filenamePattern of lang.filenamePatterns) {
				registerPlatformLanguageAssociation({ id: langId, mime: primaryMime, filepattern: filenamePattern }, this._warnOnOverwrite);
			}
		}

		if (typeof lang.firstLine === 'string' && lang.firstLine.length > 0) {
			let firstLineRegexStr = lang.firstLine;
			if (firstLineRegexStr.charAt(0) !== '^') {
				firstLineRegexStr = '^' + firstLineRegexStr;
			}
			try {
				const firstLineRegex = new RegExp(firstLineRegexStr);
				if (!regExpLeadsToEndlessLoop(firstLineRegex)) {
					registerPlatformLanguageAssociation({ id: langId, mime: primaryMime, firstline: firstLineRegex }, this._warnOnOverwrite);
				}
			} catch (err) {
				// Most likely, the regex was bad
				console.warn(`[${lang.id}]: Invalid regular expression \`${firstLineRegexStr}\`: `, err);
			}
		}

		resolvedLanguage.aliases.push(langId);

		let langAliases: Array<string | null> | null = null;
		if (typeof lang.aliases !== 'undefined' && Array.isArray(lang.aliases)) {
			if (lang.aliases.length === 0) {
				// signal that this language should not get a name
				langAliases = [null];
			} else {
				langAliases = lang.aliases;
			}
		}

		if (langAliases !== null) {
			for (const langAlias of langAliases) {
				if (!langAlias || langAlias.length === 0) {
					continue;
				}
				resolvedLanguage.aliases.push(langAlias);
			}
		}

		const containsAliases = (langAliases !== null && langAliases.length > 0);
		if (containsAliases && langAliases![0] === null) {
			// signal that this language should not get a name
		} else {
			const bestName = (containsAliases ? langAliases![0] : null) || langId;
			if (containsAliases || !resolvedLanguage.name) {
				resolvedLanguage.name = bestName;
			}
		}

		if (lang.configuration) {
			resolvedLanguage.configurationFiles.push(lang.configuration);
		}

		if (lang.icon) {
			resolvedLanguage.icons.push(lang.icon);
		}
	}

	public isRegisteredLanguageId(languageId: string | null | undefined): boolean {
		if (!languageId) {
			return false;
		}
		return hasOwnProperty.call(this._languages, languageId);
	}

	public getRegisteredLanguageIds(): string[] {
		return Object.keys(this._languages);
	}

	public getSortedRegisteredLanguageNames(): ILanguageNameIdPair[] {
		const result: ILanguageNameIdPair[] = [];
		for (const languageName in this._nameMap) {
			if (hasOwnProperty.call(this._nameMap, languageName)) {
				result.push({
					languageName: languageName,
					languageId: this._nameMap[languageName]
				});
			}
		}
		result.sort((a, b) => compareIgnoreCase(a.languageName, b.languageName));
		return result;
	}

	public getLanguageName(languageId: string): string | null {
		if (!hasOwnProperty.call(this._languages, languageId)) {
			return null;
		}
		return this._languages[languageId].name;
	}

	public getMimeType(languageId: string): string | null {
		if (!hasOwnProperty.call(this._languages, languageId)) {
			return null;
		}
		const language = this._languages[languageId];
		return (language.mimetypes[0] || null);
	}

	public getExtensions(languageId: string): ReadonlyArray<string> {
		if (!hasOwnProperty.call(this._languages, languageId)) {
			return [];
		}
		return this._languages[languageId].extensions;
	}

	public getFilenames(languageId: string): ReadonlyArray<string> {
		if (!hasOwnProperty.call(this._languages, languageId)) {
			return [];
		}
		return this._languages[languageId].filenames;
	}

	public getIcon(languageId: string): ILanguageIcon | null {
		if (!hasOwnProperty.call(this._languages, languageId)) {
			return null;
		}
		const language = this._languages[languageId];
		return (language.icons[0] || null);
	}

	public getConfigurationFiles(languageId: string): ReadonlyArray<URI> {
		if (!hasOwnProperty.call(this._languages, languageId)) {
			return [];
		}
		return this._languages[languageId].configurationFiles || [];
	}

	public getLanguageIdByLanguageName(languageName: string): string | null {
		const languageNameLower = languageName.toLowerCase();
		if (!hasOwnProperty.call(this._lowercaseNameMap, languageNameLower)) {
			return null;
		}
		return this._lowercaseNameMap[languageNameLower];
	}

	public getLanguageIdByMimeType(mimeType: string | null | undefined): string | null {
		if (!mimeType) {
			return null;
		}
		if (hasOwnProperty.call(this._mimeTypesMap, mimeType)) {
			return this._mimeTypesMap[mimeType];
		}
		return null;
	}

	public guessLanguageIdByFilepathOrFirstLine(resource: URI | null, firstLine?: string): string[] {
		if (!resource && !firstLine) {
			return [];
		}
		return getLanguageIds(resource, firstLine);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/markerDecorations.ts]---
Location: vscode-main/src/vs/editor/common/services/markerDecorations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITextModel, IModelDecoration } from '../model.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { IMarker } from '../../../platform/markers/common/markers.js';
import { Event } from '../../../base/common/event.js';
import { Range } from '../core/range.js';
import { URI } from '../../../base/common/uri.js';
import { IDisposable } from '../../../base/common/lifecycle.js';

export const IMarkerDecorationsService = createDecorator<IMarkerDecorationsService>('markerDecorationsService');

export interface IMarkerDecorationsService {
	readonly _serviceBrand: undefined;

	readonly onDidChangeMarker: Event<ITextModel>;

	getMarker(uri: URI, decoration: IModelDecoration): IMarker | null;

	getLiveMarkers(uri: URI): [Range, IMarker][];

	addMarkerSuppression(uri: URI, range: Range): IDisposable;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/markerDecorationsService.ts]---
Location: vscode-main/src/vs/editor/common/services/markerDecorationsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IMarkerService, IMarker, MarkerSeverity, MarkerTag } from '../../../platform/markers/common/markers.js';
import { Disposable, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { IModelDeltaDecoration, ITextModel, IModelDecorationOptions, TrackedRangeStickiness, OverviewRulerLane, IModelDecoration, MinimapPosition, IModelDecorationMinimapOptions } from '../model.js';
import { ClassName } from '../model/intervalTree.js';
import { themeColorFromId } from '../../../platform/theme/common/themeService.js';
import { ThemeColor } from '../../../base/common/themables.js';
import { overviewRulerWarning, overviewRulerInfo, overviewRulerError } from '../core/editorColorRegistry.js';
import { IModelService } from './model.js';
import { Range } from '../core/range.js';
import { IMarkerDecorationsService } from './markerDecorations.js';
import { Schemas } from '../../../base/common/network.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { minimapInfo, minimapWarning, minimapError } from '../../../platform/theme/common/colorRegistry.js';
import { BidirectionalMap, ResourceMap } from '../../../base/common/map.js';
import { diffSets } from '../../../base/common/collections.js';
import { Iterable } from '../../../base/common/iterator.js';

export class MarkerDecorationsService extends Disposable implements IMarkerDecorationsService {

	declare readonly _serviceBrand: undefined;

	private readonly _onDidChangeMarker = this._register(new Emitter<ITextModel>());
	readonly onDidChangeMarker: Event<ITextModel> = this._onDidChangeMarker.event;

	private readonly _suppressedRanges = new ResourceMap<Set<Range>>();

	private readonly _markerDecorations = new ResourceMap<MarkerDecorations>();

	constructor(
		@IModelService modelService: IModelService,
		@IMarkerService private readonly _markerService: IMarkerService
	) {
		super();
		modelService.getModels().forEach(model => this._onModelAdded(model));
		this._register(modelService.onModelAdded(this._onModelAdded, this));
		this._register(modelService.onModelRemoved(this._onModelRemoved, this));
		this._register(this._markerService.onMarkerChanged(this._handleMarkerChange, this));
	}

	override dispose() {
		super.dispose();
		this._markerDecorations.forEach(value => value.dispose());
		this._markerDecorations.clear();
	}

	getMarker(uri: URI, decoration: IModelDecoration): IMarker | null {
		const markerDecorations = this._markerDecorations.get(uri);
		return markerDecorations ? (markerDecorations.getMarker(decoration) || null) : null;
	}

	getLiveMarkers(uri: URI): [Range, IMarker][] {
		const markerDecorations = this._markerDecorations.get(uri);
		return markerDecorations ? markerDecorations.getMarkers() : [];
	}

	addMarkerSuppression(uri: URI, range: Range): IDisposable {

		let suppressedRanges = this._suppressedRanges.get(uri);
		if (!suppressedRanges) {
			suppressedRanges = new Set<Range>();
			this._suppressedRanges.set(uri, suppressedRanges);
		}
		suppressedRanges.add(range);
		this._handleMarkerChange([uri]);

		return toDisposable(() => {
			const suppressedRanges = this._suppressedRanges.get(uri);
			if (suppressedRanges) {
				suppressedRanges.delete(range);
				if (suppressedRanges.size === 0) {
					this._suppressedRanges.delete(uri);
				}
				this._handleMarkerChange([uri]);
			}
		});
	}

	private _handleMarkerChange(changedResources: readonly URI[]): void {
		changedResources.forEach((resource) => {
			const markerDecorations = this._markerDecorations.get(resource);
			if (markerDecorations) {
				this._updateDecorations(markerDecorations);
			}
		});
	}

	private _onModelAdded(model: ITextModel): void {
		const markerDecorations = new MarkerDecorations(model);
		this._markerDecorations.set(model.uri, markerDecorations);
		this._updateDecorations(markerDecorations);
	}

	private _onModelRemoved(model: ITextModel): void {
		const markerDecorations = this._markerDecorations.get(model.uri);
		if (markerDecorations) {
			markerDecorations.dispose();
			this._markerDecorations.delete(model.uri);
		}

		// clean up markers for internal, transient models
		if (model.uri.scheme === Schemas.inMemory
			|| model.uri.scheme === Schemas.internal
			|| model.uri.scheme === Schemas.vscode) {
			this._markerService?.read({ resource: model.uri }).map(marker => marker.owner).forEach(owner => this._markerService.remove(owner, [model.uri]));
		}
	}

	private _updateDecorations(markerDecorations: MarkerDecorations): void {
		// Limit to the first 500 errors/warnings
		let markers = this._markerService.read({ resource: markerDecorations.model.uri, take: 500 });

		// filter markers from suppressed ranges
		const suppressedRanges = this._suppressedRanges.get(markerDecorations.model.uri);
		if (suppressedRanges) {
			markers = markers.filter(marker => {
				return !Iterable.some(suppressedRanges, candidate => Range.areIntersectingOrTouching(candidate, marker));
			});
		}

		if (markerDecorations.update(markers)) {
			this._onDidChangeMarker.fire(markerDecorations.model);
		}
	}
}

class MarkerDecorations extends Disposable {

	private readonly _map = new BidirectionalMap<IMarker, /*decoration id*/string>();

	constructor(
		readonly model: ITextModel
	) {
		super();
		this._register(toDisposable(() => {
			this.model.deltaDecorations([...this._map.values()], []);
			this._map.clear();
		}));
	}

	public update(markers: IMarker[]): boolean {

		// We use the fact that marker instances are not recreated when different owners
		// update. So we can compare references to find out what changed since the last update.

		const { added, removed } = diffSets(new Set(this._map.keys()), new Set(markers));

		if (added.length === 0 && removed.length === 0) {
			return false;
		}

		const oldIds: string[] = removed.map(marker => this._map.get(marker)!);
		const newDecorations: IModelDeltaDecoration[] = added.map(marker => {
			return {
				range: this._createDecorationRange(this.model, marker),
				options: this._createDecorationOption(marker)
			};
		});

		const ids = this.model.deltaDecorations(oldIds, newDecorations);
		for (const removedMarker of removed) {
			this._map.delete(removedMarker);
		}
		for (let index = 0; index < ids.length; index++) {
			this._map.set(added[index], ids[index]);
		}
		return true;
	}

	getMarker(decoration: IModelDecoration): IMarker | undefined {
		return this._map.getKey(decoration.id);
	}

	getMarkers(): [Range, IMarker][] {
		const res: [Range, IMarker][] = [];
		this._map.forEach((id, marker) => {
			const range = this.model.getDecorationRange(id);
			if (range) {
				res.push([range, marker]);
			}
		});
		return res;
	}

	private _createDecorationRange(model: ITextModel, rawMarker: IMarker): Range {

		let ret = Range.lift(rawMarker);

		if (rawMarker.severity === MarkerSeverity.Hint && !this._hasMarkerTag(rawMarker, MarkerTag.Unnecessary) && !this._hasMarkerTag(rawMarker, MarkerTag.Deprecated)) {
			// * never render hints on multiple lines
			// * make enough space for three dots
			ret = ret.setEndPosition(ret.startLineNumber, ret.startColumn + 2);
		}

		ret = model.validateRange(ret);

		if (ret.isEmpty()) {
			const maxColumn = model.getLineLastNonWhitespaceColumn(ret.startLineNumber) ||
				model.getLineMaxColumn(ret.startLineNumber);

			if (maxColumn === 1 || ret.endColumn >= maxColumn) {
				// empty line or behind eol
				// keep the range as is, it will be rendered 1ch wide
				return ret;
			}

			const word = model.getWordAtPosition(ret.getStartPosition());
			if (word) {
				ret = new Range(ret.startLineNumber, word.startColumn, ret.endLineNumber, word.endColumn);
			}
		} else if (rawMarker.endColumn === Number.MAX_VALUE && rawMarker.startColumn === 1 && ret.startLineNumber === ret.endLineNumber) {
			const minColumn = model.getLineFirstNonWhitespaceColumn(rawMarker.startLineNumber);
			if (minColumn < ret.endColumn) {
				ret = new Range(ret.startLineNumber, minColumn, ret.endLineNumber, ret.endColumn);
				rawMarker.startColumn = minColumn;
			}
		}
		return ret;
	}

	private _createDecorationOption(marker: IMarker): IModelDecorationOptions {

		let className: string | undefined;
		let color: ThemeColor | undefined = undefined;
		let zIndex: number;
		let inlineClassName: string | undefined = undefined;
		let minimap: IModelDecorationMinimapOptions | undefined;

		switch (marker.severity) {
			case MarkerSeverity.Hint:
				if (this._hasMarkerTag(marker, MarkerTag.Deprecated)) {
					className = undefined;
				} else if (this._hasMarkerTag(marker, MarkerTag.Unnecessary)) {
					className = ClassName.EditorUnnecessaryDecoration;
				} else {
					className = ClassName.EditorHintDecoration;
				}
				zIndex = 0;
				break;
			case MarkerSeverity.Info:
				className = ClassName.EditorInfoDecoration;
				color = themeColorFromId(overviewRulerInfo);
				zIndex = 10;
				minimap = {
					color: themeColorFromId(minimapInfo),
					position: MinimapPosition.Inline
				};
				break;
			case MarkerSeverity.Warning:
				className = ClassName.EditorWarningDecoration;
				color = themeColorFromId(overviewRulerWarning);
				zIndex = 20;
				minimap = {
					color: themeColorFromId(minimapWarning),
					position: MinimapPosition.Inline
				};
				break;
			case MarkerSeverity.Error:
			default:
				className = ClassName.EditorErrorDecoration;
				color = themeColorFromId(overviewRulerError);
				zIndex = 30;
				minimap = {
					color: themeColorFromId(minimapError),
					position: MinimapPosition.Inline
				};
				break;
		}

		if (marker.tags) {
			if (marker.tags.indexOf(MarkerTag.Unnecessary) !== -1) {
				inlineClassName = ClassName.EditorUnnecessaryInlineDecoration;
			}
			if (marker.tags.indexOf(MarkerTag.Deprecated) !== -1) {
				inlineClassName = ClassName.EditorDeprecatedInlineDecoration;
			}
		}

		return {
			description: 'marker-decoration',
			stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
			className,
			showIfCollapsed: true,
			overviewRuler: {
				color,
				position: OverviewRulerLane.Right
			},
			minimap,
			zIndex,
			inlineClassName,
		};
	}

	private _hasMarkerTag(marker: IMarker, tag: MarkerTag): boolean {
		if (marker.tags) {
			return marker.tags.indexOf(tag) >= 0;
		}
		return false;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/model.ts]---
Location: vscode-main/src/vs/editor/common/services/model.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { URI } from '../../../base/common/uri.js';
import { ITextBufferFactory, ITextModel, ITextModelCreationOptions } from '../model.js';
import { ILanguageSelection } from '../languages/language.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { DocumentSemanticTokensProvider, DocumentRangeSemanticTokensProvider } from '../languages.js';
import { TextModelEditSource } from '../textModelEditSource.js';

export const IModelService = createDecorator<IModelService>('modelService');

export type DocumentTokensProvider = DocumentSemanticTokensProvider | DocumentRangeSemanticTokensProvider;

export interface IModelService {
	readonly _serviceBrand: undefined;

	createModel(value: string | ITextBufferFactory, languageSelection: ILanguageSelection | null, resource?: URI, isForSimpleWidget?: boolean): ITextModel;

	updateModel(model: ITextModel, value: string | ITextBufferFactory, reason?: TextModelEditSource): void;

	destroyModel(resource: URI): void;

	getModels(): ITextModel[];

	getCreationOptions(language: string, resource: URI, isForSimpleWidget: boolean): ITextModelCreationOptions;

	getModel(resource: URI): ITextModel | null;

	readonly onModelAdded: Event<ITextModel>;

	readonly onModelRemoved: Event<ITextModel>;

	readonly onModelLanguageChanged: Event<{ readonly model: ITextModel; readonly oldLanguageId: string }>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/modelService.ts]---
Location: vscode-main/src/vs/editor/common/services/modelService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { StringSHA1 } from '../../../base/common/hash.js';
import { Disposable, DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import { equals } from '../../../base/common/objects.js';
import * as platform from '../../../base/common/platform.js';
import { URI } from '../../../base/common/uri.js';
import { IConfigurationChangeEvent, IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { IUndoRedoService, ResourceEditStackSnapshot } from '../../../platform/undoRedo/common/undoRedo.js';
import { clampedInt } from '../config/editorOptions.js';
import { EditOperation, ISingleEditOperation } from '../core/editOperation.js';
import { EDITOR_MODEL_DEFAULTS } from '../core/misc/textModelDefaults.js';
import { Range } from '../core/range.js';
import { ILanguageSelection } from '../languages/language.js';
import { PLAINTEXT_LANGUAGE_ID } from '../languages/modesRegistry.js';
import { DefaultEndOfLine, EndOfLinePreference, EndOfLineSequence, ITextBuffer, ITextBufferFactory, ITextModel, ITextModelCreationOptions } from '../model.js';
import { isEditStackElement } from '../model/editStack.js';
import { TextModel, createTextBuffer } from '../model/textModel.js';
import { EditSources, TextModelEditSource } from '../textModelEditSource.js';
import { IModelLanguageChangedEvent } from '../textModelEvents.js';
import { IModelService } from './model.js';
import { ITextResourcePropertiesService } from './textResourceConfiguration.js';

function MODEL_ID(resource: URI): string {
	return resource.toString();
}

class ModelData implements IDisposable {

	private readonly _modelEventListeners = new DisposableStore();

	constructor(
		public readonly model: TextModel,
		onWillDispose: (model: ITextModel) => void,
		onDidChangeLanguage: (model: ITextModel, e: IModelLanguageChangedEvent) => void
	) {
		this.model = model;
		this._modelEventListeners.add(model.onWillDispose(() => onWillDispose(model)));
		this._modelEventListeners.add(model.onDidChangeLanguage((e) => onDidChangeLanguage(model, e)));
	}

	public dispose(): void {
		this._modelEventListeners.dispose();
	}
}

interface IRawEditorConfig {
	tabSize?: unknown;
	indentSize?: unknown;
	insertSpaces?: unknown;
	detectIndentation?: unknown;
	trimAutoWhitespace?: unknown;
	creationOptions?: unknown;
	largeFileOptimizations?: unknown;
	bracketPairColorization?: unknown;
}

interface IRawConfig {
	eol?: unknown;
	editor?: IRawEditorConfig;
}

const DEFAULT_EOL = (platform.isLinux || platform.isMacintosh) ? DefaultEndOfLine.LF : DefaultEndOfLine.CRLF;

class DisposedModelInfo {
	constructor(
		public readonly uri: URI,
		public readonly initialUndoRedoSnapshot: ResourceEditStackSnapshot | null,
		public readonly time: number,
		public readonly sharesUndoRedoStack: boolean,
		public readonly heapSize: number,
		public readonly sha1: string,
		public readonly versionId: number,
		public readonly alternativeVersionId: number,
	) { }
}

export class ModelService extends Disposable implements IModelService {

	public static MAX_MEMORY_FOR_CLOSED_FILES_UNDO_STACK = 20 * 1024 * 1024;

	public _serviceBrand: undefined;

	private readonly _onModelAdded: Emitter<ITextModel> = this._register(new Emitter<ITextModel>());
	public readonly onModelAdded: Event<ITextModel> = this._onModelAdded.event;

	private readonly _onModelRemoved: Emitter<ITextModel> = this._register(new Emitter<ITextModel>());
	public readonly onModelRemoved: Event<ITextModel> = this._onModelRemoved.event;

	private readonly _onModelModeChanged = this._register(new Emitter<{ model: ITextModel; oldLanguageId: string }>());
	public readonly onModelLanguageChanged = this._onModelModeChanged.event;

	private _modelCreationOptionsByLanguageAndResource: { [languageAndResource: string]: ITextModelCreationOptions };

	/**
	 * All the models known in the system.
	 */
	private readonly _models: { [modelId: string]: ModelData };
	private readonly _disposedModels: Map<string, DisposedModelInfo>;
	private _disposedModelsHeapSize: number;

	constructor(
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ITextResourcePropertiesService private readonly _resourcePropertiesService: ITextResourcePropertiesService,
		@IUndoRedoService private readonly _undoRedoService: IUndoRedoService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService
	) {
		super();
		this._modelCreationOptionsByLanguageAndResource = Object.create(null);
		this._models = {};
		this._disposedModels = new Map<string, DisposedModelInfo>();
		this._disposedModelsHeapSize = 0;

		this._register(this._configurationService.onDidChangeConfiguration(e => this._updateModelOptions(e)));
		this._updateModelOptions(undefined);
	}

	private static _readModelOptions(config: IRawConfig, isForSimpleWidget: boolean): ITextModelCreationOptions {
		let tabSize = EDITOR_MODEL_DEFAULTS.tabSize;
		if (config.editor && typeof config.editor.tabSize !== 'undefined') {
			tabSize = clampedInt(config.editor.tabSize, EDITOR_MODEL_DEFAULTS.tabSize, 1, 100);
		}

		let indentSize: number | 'tabSize' = 'tabSize';
		if (config.editor && typeof config.editor.indentSize !== 'undefined' && config.editor.indentSize !== 'tabSize') {
			indentSize = clampedInt(config.editor.indentSize, 'tabSize', 1, 100);
		}

		let insertSpaces = EDITOR_MODEL_DEFAULTS.insertSpaces;
		if (config.editor && typeof config.editor.insertSpaces !== 'undefined') {
			insertSpaces = (config.editor.insertSpaces === 'false' ? false : Boolean(config.editor.insertSpaces));
		}

		let newDefaultEOL = DEFAULT_EOL;
		const eol = config.eol;
		if (eol === '\r\n') {
			newDefaultEOL = DefaultEndOfLine.CRLF;
		} else if (eol === '\n') {
			newDefaultEOL = DefaultEndOfLine.LF;
		}

		let trimAutoWhitespace = EDITOR_MODEL_DEFAULTS.trimAutoWhitespace;
		if (config.editor && typeof config.editor.trimAutoWhitespace !== 'undefined') {
			trimAutoWhitespace = (config.editor.trimAutoWhitespace === 'false' ? false : Boolean(config.editor.trimAutoWhitespace));
		}

		let detectIndentation = EDITOR_MODEL_DEFAULTS.detectIndentation;
		if (config.editor && typeof config.editor.detectIndentation !== 'undefined') {
			detectIndentation = (config.editor.detectIndentation === 'false' ? false : Boolean(config.editor.detectIndentation));
		}

		let largeFileOptimizations = EDITOR_MODEL_DEFAULTS.largeFileOptimizations;
		if (config.editor && typeof config.editor.largeFileOptimizations !== 'undefined') {
			largeFileOptimizations = (config.editor.largeFileOptimizations === 'false' ? false : Boolean(config.editor.largeFileOptimizations));
		}
		let bracketPairColorizationOptions = EDITOR_MODEL_DEFAULTS.bracketPairColorizationOptions;
		if (config.editor?.bracketPairColorization && typeof config.editor.bracketPairColorization === 'object') {
			const bpConfig = config.editor.bracketPairColorization as { enabled?: unknown; independentColorPoolPerBracketType?: unknown };
			bracketPairColorizationOptions = {
				enabled: !!bpConfig.enabled,
				independentColorPoolPerBracketType: !!bpConfig.independentColorPoolPerBracketType
			};
		}

		return {
			isForSimpleWidget: isForSimpleWidget,
			tabSize: tabSize,
			indentSize: indentSize,
			insertSpaces: insertSpaces,
			detectIndentation: detectIndentation,
			defaultEOL: newDefaultEOL,
			trimAutoWhitespace: trimAutoWhitespace,
			largeFileOptimizations: largeFileOptimizations,
			bracketPairColorizationOptions
		};
	}

	private _getEOL(resource: URI | undefined, language: string): string {
		if (resource) {
			return this._resourcePropertiesService.getEOL(resource, language);
		}
		const eol = this._configurationService.getValue('files.eol', { overrideIdentifier: language });
		if (eol && typeof eol === 'string' && eol !== 'auto') {
			return eol;
		}
		return platform.OS === platform.OperatingSystem.Linux || platform.OS === platform.OperatingSystem.Macintosh ? '\n' : '\r\n';
	}

	private _shouldRestoreUndoStack(): boolean {
		const result = this._configurationService.getValue('files.restoreUndoStack');
		if (typeof result === 'boolean') {
			return result;
		}
		return true;
	}

	public getCreationOptions(languageIdOrSelection: string | ILanguageSelection, resource: URI | undefined, isForSimpleWidget: boolean): ITextModelCreationOptions {
		const language = (typeof languageIdOrSelection === 'string' ? languageIdOrSelection : languageIdOrSelection.languageId);
		let creationOptions = this._modelCreationOptionsByLanguageAndResource[language + resource];
		if (!creationOptions) {
			const editor = this._configurationService.getValue<IRawEditorConfig>('editor', { overrideIdentifier: language, resource });
			const eol = this._getEOL(resource, language);
			creationOptions = ModelService._readModelOptions({ editor, eol }, isForSimpleWidget);
			this._modelCreationOptionsByLanguageAndResource[language + resource] = creationOptions;
		}
		return creationOptions;
	}

	private _updateModelOptions(e: IConfigurationChangeEvent | undefined): void {
		const oldOptionsByLanguageAndResource = this._modelCreationOptionsByLanguageAndResource;
		this._modelCreationOptionsByLanguageAndResource = Object.create(null);

		// Update options on all models
		const keys = Object.keys(this._models);
		for (let i = 0, len = keys.length; i < len; i++) {
			const modelId = keys[i];
			const modelData = this._models[modelId];
			const language = modelData.model.getLanguageId();
			const uri = modelData.model.uri;

			if (e && !e.affectsConfiguration('editor', { overrideIdentifier: language, resource: uri }) && !e.affectsConfiguration('files.eol', { overrideIdentifier: language, resource: uri })) {
				continue; // perf: skip if this model is not affected by configuration change
			}

			const oldOptions = oldOptionsByLanguageAndResource[language + uri];
			const newOptions = this.getCreationOptions(language, uri, modelData.model.isForSimpleWidget);
			ModelService._setModelOptionsForModel(modelData.model, newOptions, oldOptions);
		}
	}

	private static _setModelOptionsForModel(model: ITextModel, newOptions: ITextModelCreationOptions, currentOptions: ITextModelCreationOptions): void {
		if (currentOptions && currentOptions.defaultEOL !== newOptions.defaultEOL && model.getLineCount() === 1) {
			model.setEOL(newOptions.defaultEOL === DefaultEndOfLine.LF ? EndOfLineSequence.LF : EndOfLineSequence.CRLF);
		}

		if (currentOptions
			&& (currentOptions.detectIndentation === newOptions.detectIndentation)
			&& (currentOptions.insertSpaces === newOptions.insertSpaces)
			&& (currentOptions.tabSize === newOptions.tabSize)
			&& (currentOptions.indentSize === newOptions.indentSize)
			&& (currentOptions.trimAutoWhitespace === newOptions.trimAutoWhitespace)
			&& equals(currentOptions.bracketPairColorizationOptions, newOptions.bracketPairColorizationOptions)
		) {
			// Same indent opts, no need to touch the model
			return;
		}

		if (newOptions.detectIndentation) {
			model.detectIndentation(newOptions.insertSpaces, newOptions.tabSize);
			model.updateOptions({
				trimAutoWhitespace: newOptions.trimAutoWhitespace,
				bracketColorizationOptions: newOptions.bracketPairColorizationOptions
			});
		} else {
			model.updateOptions({
				insertSpaces: newOptions.insertSpaces,
				tabSize: newOptions.tabSize,
				indentSize: newOptions.indentSize,
				trimAutoWhitespace: newOptions.trimAutoWhitespace,
				bracketColorizationOptions: newOptions.bracketPairColorizationOptions
			});
		}
	}

	// --- begin IModelService

	private _insertDisposedModel(disposedModelData: DisposedModelInfo): void {
		this._disposedModels.set(MODEL_ID(disposedModelData.uri), disposedModelData);
		this._disposedModelsHeapSize += disposedModelData.heapSize;
	}

	private _removeDisposedModel(resource: URI): DisposedModelInfo | undefined {
		const disposedModelData = this._disposedModels.get(MODEL_ID(resource));
		if (disposedModelData) {
			this._disposedModelsHeapSize -= disposedModelData.heapSize;
		}
		this._disposedModels.delete(MODEL_ID(resource));
		return disposedModelData;
	}

	private _ensureDisposedModelsHeapSize(maxModelsHeapSize: number): void {
		if (this._disposedModelsHeapSize > maxModelsHeapSize) {
			// we must remove some old undo stack elements to free up some memory
			const disposedModels: DisposedModelInfo[] = [];
			this._disposedModels.forEach(entry => {
				if (!entry.sharesUndoRedoStack) {
					disposedModels.push(entry);
				}
			});
			disposedModels.sort((a, b) => a.time - b.time);
			while (disposedModels.length > 0 && this._disposedModelsHeapSize > maxModelsHeapSize) {
				const disposedModel = disposedModels.shift()!;
				this._removeDisposedModel(disposedModel.uri);
				if (disposedModel.initialUndoRedoSnapshot !== null) {
					this._undoRedoService.restoreSnapshot(disposedModel.initialUndoRedoSnapshot);
				}
			}
		}
	}

	private _createModelData(value: string | ITextBufferFactory, languageIdOrSelection: string | ILanguageSelection, resource: URI | undefined, isForSimpleWidget: boolean): ModelData {
		// create & save the model
		const options = this.getCreationOptions(languageIdOrSelection, resource, isForSimpleWidget);
		const model: TextModel = this._instantiationService.createInstance(TextModel,
			value,
			languageIdOrSelection,
			options,
			resource
		);
		if (resource && this._disposedModels.has(MODEL_ID(resource))) {
			const disposedModelData = this._removeDisposedModel(resource)!;
			const elements = this._undoRedoService.getElements(resource);
			const sha1Computer = this._getSHA1Computer();
			const sha1IsEqual = (
				sha1Computer.canComputeSHA1(model)
					? sha1Computer.computeSHA1(model) === disposedModelData.sha1
					: false
			);
			if (sha1IsEqual || disposedModelData.sharesUndoRedoStack) {
				for (const element of elements.past) {
					if (isEditStackElement(element) && element.matchesResource(resource)) {
						element.setModel(model);
					}
				}
				for (const element of elements.future) {
					if (isEditStackElement(element) && element.matchesResource(resource)) {
						element.setModel(model);
					}
				}
				this._undoRedoService.setElementsValidFlag(resource, true, (element) => (isEditStackElement(element) && element.matchesResource(resource)));
				if (sha1IsEqual) {
					model._overwriteVersionId(disposedModelData.versionId);
					model._overwriteAlternativeVersionId(disposedModelData.alternativeVersionId);
					model._overwriteInitialUndoRedoSnapshot(disposedModelData.initialUndoRedoSnapshot);
				}
			} else {
				if (disposedModelData.initialUndoRedoSnapshot !== null) {
					this._undoRedoService.restoreSnapshot(disposedModelData.initialUndoRedoSnapshot);
				}
			}
		}
		const modelId = MODEL_ID(model.uri);

		if (this._models[modelId]) {
			// There already exists a model with this id => this is a programmer error
			throw new Error('ModelService: Cannot add model because it already exists!');
		}

		const modelData = new ModelData(
			model,
			(model) => this._onWillDispose(model),
			(model, e) => this._onDidChangeLanguage(model, e)
		);
		this._models[modelId] = modelData;

		return modelData;
	}

	public updateModel(model: ITextModel, value: string | ITextBufferFactory, reason: TextModelEditSource = EditSources.unknown({ name: 'updateModel' })): void {
		const options = this.getCreationOptions(model.getLanguageId(), model.uri, model.isForSimpleWidget);
		const { textBuffer, disposable } = createTextBuffer(value, options.defaultEOL);

		// Return early if the text is already set in that form
		if (model.equalsTextBuffer(textBuffer)) {
			disposable.dispose();
			return;
		}

		// Otherwise find a diff between the values and update model
		model.pushStackElement();
		model.pushEOL(textBuffer.getEOL() === '\r\n' ? EndOfLineSequence.CRLF : EndOfLineSequence.LF);
		model.pushEditOperations(
			[],
			ModelService._computeEdits(model, textBuffer),
			() => [],
			undefined,
			reason
		);
		model.pushStackElement();
		disposable.dispose();
	}

	private static _commonPrefix(a: ITextModel, aLen: number, aDelta: number, b: ITextBuffer, bLen: number, bDelta: number): number {
		const maxResult = Math.min(aLen, bLen);

		let result = 0;
		for (let i = 0; i < maxResult && a.getLineContent(aDelta + i) === b.getLineContent(bDelta + i); i++) {
			result++;
		}
		return result;
	}

	private static _commonSuffix(a: ITextModel, aLen: number, aDelta: number, b: ITextBuffer, bLen: number, bDelta: number): number {
		const maxResult = Math.min(aLen, bLen);

		let result = 0;
		for (let i = 0; i < maxResult && a.getLineContent(aDelta + aLen - i) === b.getLineContent(bDelta + bLen - i); i++) {
			result++;
		}
		return result;
	}

	/**
	 * Compute edits to bring `model` to the state of `textSource`.
	 */
	public static _computeEdits(model: ITextModel, textBuffer: ITextBuffer): ISingleEditOperation[] {
		const modelLineCount = model.getLineCount();
		const textBufferLineCount = textBuffer.getLineCount();
		const commonPrefix = this._commonPrefix(model, modelLineCount, 1, textBuffer, textBufferLineCount, 1);

		if (modelLineCount === textBufferLineCount && commonPrefix === modelLineCount) {
			// equality case
			return [];
		}

		const commonSuffix = this._commonSuffix(model, modelLineCount - commonPrefix, commonPrefix, textBuffer, textBufferLineCount - commonPrefix, commonPrefix);

		let oldRange: Range;
		let newRange: Range;
		if (commonSuffix > 0) {
			oldRange = new Range(commonPrefix + 1, 1, modelLineCount - commonSuffix + 1, 1);
			newRange = new Range(commonPrefix + 1, 1, textBufferLineCount - commonSuffix + 1, 1);
		} else if (commonPrefix > 0) {
			oldRange = new Range(commonPrefix, model.getLineMaxColumn(commonPrefix), modelLineCount, model.getLineMaxColumn(modelLineCount));
			newRange = new Range(commonPrefix, 1 + textBuffer.getLineLength(commonPrefix), textBufferLineCount, 1 + textBuffer.getLineLength(textBufferLineCount));
		} else {
			oldRange = new Range(1, 1, modelLineCount, model.getLineMaxColumn(modelLineCount));
			newRange = new Range(1, 1, textBufferLineCount, 1 + textBuffer.getLineLength(textBufferLineCount));
		}

		return [EditOperation.replaceMove(oldRange, textBuffer.getValueInRange(newRange, EndOfLinePreference.TextDefined))];
	}

	public createModel(value: string | ITextBufferFactory, languageSelection: ILanguageSelection | null, resource?: URI, isForSimpleWidget: boolean = false): ITextModel {
		let modelData: ModelData;

		if (languageSelection) {
			modelData = this._createModelData(value, languageSelection, resource, isForSimpleWidget);
		} else {
			modelData = this._createModelData(value, PLAINTEXT_LANGUAGE_ID, resource, isForSimpleWidget);
		}

		this._onModelAdded.fire(modelData.model);

		return modelData.model;
	}

	public destroyModel(resource: URI): void {
		// We need to support that not all models get disposed through this service (i.e. model.dispose() should work!)
		const modelData = this._models[MODEL_ID(resource)];
		if (!modelData) {
			return;
		}
		modelData.model.dispose();
	}

	public getModels(): ITextModel[] {
		const ret: ITextModel[] = [];

		const keys = Object.keys(this._models);
		for (let i = 0, len = keys.length; i < len; i++) {
			const modelId = keys[i];
			ret.push(this._models[modelId].model);
		}

		return ret;
	}

	public getModel(resource: URI): ITextModel | null {
		const modelId = MODEL_ID(resource);
		const modelData = this._models[modelId];
		if (!modelData) {
			return null;
		}
		return modelData.model;
	}

	// --- end IModelService

	protected _schemaShouldMaintainUndoRedoElements(resource: URI) {
		return (
			resource.scheme === Schemas.file
			|| resource.scheme === Schemas.vscodeRemote
			|| resource.scheme === Schemas.vscodeUserData
			|| resource.scheme === Schemas.vscodeNotebookCell
			|| resource.scheme === 'fake-fs' // for tests
		);
	}

	private _onWillDispose(model: ITextModel): void {
		const modelId = MODEL_ID(model.uri);
		const modelData = this._models[modelId];

		const sharesUndoRedoStack = (this._undoRedoService.getUriComparisonKey(model.uri) !== model.uri.toString());
		let maintainUndoRedoStack = false;
		let heapSize = 0;
		if (sharesUndoRedoStack || (this._shouldRestoreUndoStack() && this._schemaShouldMaintainUndoRedoElements(model.uri))) {
			const elements = this._undoRedoService.getElements(model.uri);
			if (elements.past.length > 0 || elements.future.length > 0) {
				for (const element of elements.past) {
					if (isEditStackElement(element) && element.matchesResource(model.uri)) {
						maintainUndoRedoStack = true;
						heapSize += element.heapSize(model.uri);
						element.setModel(model.uri); // remove reference from text buffer instance
					}
				}
				for (const element of elements.future) {
					if (isEditStackElement(element) && element.matchesResource(model.uri)) {
						maintainUndoRedoStack = true;
						heapSize += element.heapSize(model.uri);
						element.setModel(model.uri); // remove reference from text buffer instance
					}
				}
			}
		}

		const maxMemory = ModelService.MAX_MEMORY_FOR_CLOSED_FILES_UNDO_STACK;
		const sha1Computer = this._getSHA1Computer();
		if (!maintainUndoRedoStack) {
			if (!sharesUndoRedoStack) {
				const initialUndoRedoSnapshot = modelData.model.getInitialUndoRedoSnapshot();
				if (initialUndoRedoSnapshot !== null) {
					this._undoRedoService.restoreSnapshot(initialUndoRedoSnapshot);
				}
			}
		} else if (!sharesUndoRedoStack && (heapSize > maxMemory || !sha1Computer.canComputeSHA1(model))) {
			// the undo stack for this file would never fit in the configured memory or the file is very large, so don't bother with it.
			const initialUndoRedoSnapshot = modelData.model.getInitialUndoRedoSnapshot();
			if (initialUndoRedoSnapshot !== null) {
				this._undoRedoService.restoreSnapshot(initialUndoRedoSnapshot);
			}
		} else {
			this._ensureDisposedModelsHeapSize(maxMemory - heapSize);
			// We only invalidate the elements, but they remain in the undo-redo service.
			this._undoRedoService.setElementsValidFlag(model.uri, false, (element) => (isEditStackElement(element) && element.matchesResource(model.uri)));
			this._insertDisposedModel(new DisposedModelInfo(model.uri, modelData.model.getInitialUndoRedoSnapshot(), Date.now(), sharesUndoRedoStack, heapSize, sha1Computer.computeSHA1(model), model.getVersionId(), model.getAlternativeVersionId()));
		}

		delete this._models[modelId];
		modelData.dispose();

		// clean up cache
		delete this._modelCreationOptionsByLanguageAndResource[model.getLanguageId() + model.uri];

		this._onModelRemoved.fire(model);
	}

	private _onDidChangeLanguage(model: ITextModel, e: IModelLanguageChangedEvent): void {
		const oldLanguageId = e.oldLanguage;
		const newLanguageId = model.getLanguageId();
		const oldOptions = this.getCreationOptions(oldLanguageId, model.uri, model.isForSimpleWidget);
		const newOptions = this.getCreationOptions(newLanguageId, model.uri, model.isForSimpleWidget);
		ModelService._setModelOptionsForModel(model, newOptions, oldOptions);
		this._onModelModeChanged.fire({ model, oldLanguageId: oldLanguageId });
	}

	protected _getSHA1Computer(): ITextModelSHA1Computer {
		return new DefaultModelSHA1Computer();
	}
}

export interface ITextModelSHA1Computer {
	canComputeSHA1(model: ITextModel): boolean;
	computeSHA1(model: ITextModel): string;
}

export class DefaultModelSHA1Computer implements ITextModelSHA1Computer {

	public static MAX_MODEL_SIZE = 10 * 1024 * 1024; // takes 200ms to compute a sha1 on a 10MB model on a new machine

	canComputeSHA1(model: ITextModel): boolean {
		return (model.getValueLength() <= DefaultModelSHA1Computer.MAX_MODEL_SIZE);
	}

	computeSHA1(model: ITextModel): string {
		// compute the sha1
		const shaComputer = new StringSHA1();
		const snapshot = model.createSnapshot();
		let text: string | null;
		while ((text = snapshot.read())) {
			shaComputer.update(text);
		}
		return shaComputer.digest();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/modelUndoRedoParticipant.ts]---
Location: vscode-main/src/vs/editor/common/services/modelUndoRedoParticipant.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IModelService } from './model.js';
import { ITextModelService } from './resolverService.js';
import { Disposable, IDisposable, dispose } from '../../../base/common/lifecycle.js';
import { IUndoRedoService } from '../../../platform/undoRedo/common/undoRedo.js';
import { IUndoRedoDelegate, MultiModelEditStackElement } from '../model/editStack.js';

export class ModelUndoRedoParticipant extends Disposable implements IUndoRedoDelegate {
	constructor(
		@IModelService private readonly _modelService: IModelService,
		@ITextModelService private readonly _textModelService: ITextModelService,
		@IUndoRedoService private readonly _undoRedoService: IUndoRedoService,
	) {
		super();
		this._register(this._modelService.onModelRemoved((model) => {
			// a model will get disposed, so let's check if the undo redo stack is maintained
			const elements = this._undoRedoService.getElements(model.uri);
			if (elements.past.length === 0 && elements.future.length === 0) {
				return;
			}
			for (const element of elements.past) {
				if (element instanceof MultiModelEditStackElement) {
					element.setDelegate(this);
				}
			}
			for (const element of elements.future) {
				if (element instanceof MultiModelEditStackElement) {
					element.setDelegate(this);
				}
			}
		}));
	}

	public prepareUndoRedo(element: MultiModelEditStackElement): IDisposable | Promise<IDisposable> {
		// Load all the needed text models
		const missingModels = element.getMissingModels();
		if (missingModels.length === 0) {
			// All models are available!
			return Disposable.None;
		}

		const disposablesPromises = missingModels.map(async (uri) => {
			try {
				const reference = await this._textModelService.createModelReference(uri);
				return <IDisposable>reference;
			} catch (err) {
				// This model could not be loaded, maybe it was deleted in the meantime?
				return Disposable.None;
			}
		});

		return Promise.all(disposablesPromises).then(disposables => {
			return {
				dispose: () => dispose(disposables)
			};
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/resolverService.ts]---
Location: vscode-main/src/vs/editor/common/services/resolverService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { IMarkdownString } from '../../../base/common/htmlContent.js';
import { IDisposable, IReference } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { ITextModel, ITextSnapshot } from '../model.js';
import { IResolvableEditorModel } from '../../../platform/editor/common/editor.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';

export const ITextModelService = createDecorator<ITextModelService>('textModelService');

export interface ITextModelService {
	readonly _serviceBrand: undefined;

	/**
	 * Provided a resource URI, it will return a model reference
	 * which should be disposed once not needed anymore.
	 */
	createModelReference(resource: URI): Promise<IReference<IResolvedTextEditorModel>>;

	/**
	 * Registers a specific `scheme` content provider.
	 */
	registerTextModelContentProvider(scheme: string, provider: ITextModelContentProvider): IDisposable;

	/**
	 * Check if the given resource can be resolved to a text model.
	 */
	canHandleResource(resource: URI): boolean;
}

export interface ITextModelContentProvider {

	/**
	 * Given a resource, return the content of the resource as `ITextModel`.
	 */
	provideTextContent(resource: URI): Promise<ITextModel | null> | null;
}

export interface ITextEditorModel extends IResolvableEditorModel {

	/**
	 * Emitted when the text model is about to be disposed.
	 */
	readonly onWillDispose: Event<void>;

	/**
	 * Provides access to the underlying `ITextModel`.
	 */
	readonly textEditorModel: ITextModel | null;

	/**
	 * Creates a snapshot of the model's contents.
	 */
	createSnapshot(this: IResolvedTextEditorModel): ITextSnapshot;
	createSnapshot(this: ITextEditorModel): ITextSnapshot | null;

	/**
	 * Signals if this model is readonly or not.
	 */
	isReadonly(): boolean | IMarkdownString;

	/**
	 * The language id of the text model if known.
	 */
	getLanguageId(): string | undefined;

	/**
	 * Find out if this text model has been disposed.
	 */
	isDisposed(): boolean;
}

export interface IResolvedTextEditorModel extends ITextEditorModel {

	/**
	 * Same as ITextEditorModel#textEditorModel, but never null.
	 */
	readonly textEditorModel: ITextModel;
}

export function isResolvedTextEditorModel(model: ITextEditorModel): model is IResolvedTextEditorModel {
	const candidate = model as IResolvedTextEditorModel;

	return !!candidate.textEditorModel;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/semanticTokensDto.ts]---
Location: vscode-main/src/vs/editor/common/services/semanticTokensDto.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../base/common/buffer.js';
import * as platform from '../../../base/common/platform.js';

export interface IFullSemanticTokensDto {
	id: number;
	type: 'full';
	data: Uint32Array;
}

export interface IDeltaSemanticTokensDto {
	id: number;
	type: 'delta';
	deltas: { start: number; deleteCount: number; data?: Uint32Array }[];
}

export type ISemanticTokensDto = IFullSemanticTokensDto | IDeltaSemanticTokensDto;

const enum EncodedSemanticTokensType {
	Full = 1,
	Delta = 2
}

function reverseEndianness(arr: Uint8Array): void {
	for (let i = 0, len = arr.length; i < len; i += 4) {
		// flip bytes 0<->3 and 1<->2
		const b0 = arr[i + 0];
		const b1 = arr[i + 1];
		const b2 = arr[i + 2];
		const b3 = arr[i + 3];
		arr[i + 0] = b3;
		arr[i + 1] = b2;
		arr[i + 2] = b1;
		arr[i + 3] = b0;
	}
}

function toLittleEndianBuffer(arr: Uint32Array): VSBuffer {
	const uint8Arr = new Uint8Array(arr.buffer, arr.byteOffset, arr.length * 4);
	if (!platform.isLittleEndian()) {
		// the byte order must be changed
		reverseEndianness(uint8Arr);
	}
	return VSBuffer.wrap(uint8Arr);
}

function fromLittleEndianBuffer(buff: VSBuffer): Uint32Array {
	const uint8Arr = buff.buffer;
	if (!platform.isLittleEndian()) {
		// the byte order must be changed
		reverseEndianness(uint8Arr);
	}
	if (uint8Arr.byteOffset % 4 === 0) {
		return new Uint32Array(uint8Arr.buffer, uint8Arr.byteOffset, uint8Arr.length / 4);
	} else {
		// unaligned memory access doesn't work on all platforms
		const data = new Uint8Array(uint8Arr.byteLength);
		data.set(uint8Arr);
		return new Uint32Array(data.buffer, data.byteOffset, data.length / 4);
	}
}

export function encodeSemanticTokensDto(semanticTokens: ISemanticTokensDto): VSBuffer {
	const dest = new Uint32Array(encodeSemanticTokensDtoSize(semanticTokens));
	let offset = 0;
	dest[offset++] = semanticTokens.id;
	if (semanticTokens.type === 'full') {
		dest[offset++] = EncodedSemanticTokensType.Full;
		dest[offset++] = semanticTokens.data.length;
		dest.set(semanticTokens.data, offset); offset += semanticTokens.data.length;
	} else {
		dest[offset++] = EncodedSemanticTokensType.Delta;
		dest[offset++] = semanticTokens.deltas.length;
		for (const delta of semanticTokens.deltas) {
			dest[offset++] = delta.start;
			dest[offset++] = delta.deleteCount;
			if (delta.data) {
				dest[offset++] = delta.data.length;
				dest.set(delta.data, offset); offset += delta.data.length;
			} else {
				dest[offset++] = 0;
			}
		}
	}
	return toLittleEndianBuffer(dest);
}

function encodeSemanticTokensDtoSize(semanticTokens: ISemanticTokensDto): number {
	let result = 0;
	result += (
		+ 1 // id
		+ 1 // type
	);
	if (semanticTokens.type === 'full') {
		result += (
			+ 1 // data length
			+ semanticTokens.data.length
		);
	} else {
		result += (
			+ 1 // delta count
		);
		result += (
			+ 1 // start
			+ 1 // deleteCount
			+ 1 // data length
		) * semanticTokens.deltas.length;
		for (const delta of semanticTokens.deltas) {
			if (delta.data) {
				result += delta.data.length;
			}
		}
	}
	return result;
}

export function decodeSemanticTokensDto(_buff: VSBuffer): ISemanticTokensDto {
	const src = fromLittleEndianBuffer(_buff);
	let offset = 0;
	const id = src[offset++];
	const type: EncodedSemanticTokensType = src[offset++];
	if (type === EncodedSemanticTokensType.Full) {
		const length = src[offset++];
		const data = src.subarray(offset, offset + length); offset += length;
		return {
			id: id,
			type: 'full',
			data: data
		};
	}
	const deltaCount = src[offset++];
	const deltas: { start: number; deleteCount: number; data?: Uint32Array }[] = [];
	for (let i = 0; i < deltaCount; i++) {
		const start = src[offset++];
		const deleteCount = src[offset++];
		const length = src[offset++];
		let data: Uint32Array | undefined;
		if (length > 0) {
			data = src.subarray(offset, offset + length); offset += length;
		}
		deltas[i] = { start, deleteCount, data };
	}
	return {
		id: id,
		type: 'delta',
		deltas: deltas
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/semanticTokensProviderStyling.ts]---
Location: vscode-main/src/vs/editor/common/services/semanticTokensProviderStyling.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { SemanticTokensLegend, SemanticTokens } from '../languages.js';
import { FontStyle, MetadataConsts, TokenMetadata } from '../encodedTokenAttributes.js';
import { IThemeService } from '../../../platform/theme/common/themeService.js';
import { ILogService, LogLevel } from '../../../platform/log/common/log.js';
import { SparseMultilineTokens } from '../tokens/sparseMultilineTokens.js';
import { ILanguageService } from '../languages/language.js';

const enum SemanticTokensProviderStylingConstants {
	NO_STYLING = 0b01111111111111111111111111111111
}

const ENABLE_TRACE = false;

export class SemanticTokensProviderStyling {

	private readonly _hashTable: HashTable;
	private _hasWarnedOverlappingTokens = false;
	private _hasWarnedInvalidLengthTokens = false;
	private _hasWarnedInvalidEditStart = false;

	constructor(
		private readonly _legend: SemanticTokensLegend,
		@IThemeService private readonly _themeService: IThemeService,
		@ILanguageService private readonly _languageService: ILanguageService,
		@ILogService private readonly _logService: ILogService
	) {
		this._hashTable = new HashTable();
	}

	public getMetadata(tokenTypeIndex: number, tokenModifierSet: number, languageId: string): number {
		const encodedLanguageId = this._languageService.languageIdCodec.encodeLanguageId(languageId);
		const entry = this._hashTable.get(tokenTypeIndex, tokenModifierSet, encodedLanguageId);
		let metadata: number;
		if (entry) {
			metadata = entry.metadata;
			if (ENABLE_TRACE && this._logService.getLevel() === LogLevel.Trace) {
				this._logService.trace(`SemanticTokensProviderStyling [CACHED] ${tokenTypeIndex} / ${tokenModifierSet}: foreground ${TokenMetadata.getForeground(metadata)}, fontStyle ${TokenMetadata.getFontStyle(metadata).toString(2)}`);
			}
		} else {
			let tokenType = this._legend.tokenTypes[tokenTypeIndex];
			const tokenModifiers: string[] = [];
			if (tokenType) {
				let modifierSet = tokenModifierSet;
				for (let modifierIndex = 0; modifierSet > 0 && modifierIndex < this._legend.tokenModifiers.length; modifierIndex++) {
					if (modifierSet & 1) {
						tokenModifiers.push(this._legend.tokenModifiers[modifierIndex]);
					}
					modifierSet = modifierSet >> 1;
				}
				if (ENABLE_TRACE && modifierSet > 0 && this._logService.getLevel() === LogLevel.Trace) {
					this._logService.trace(`SemanticTokensProviderStyling: unknown token modifier index: ${tokenModifierSet.toString(2)} for legend: ${JSON.stringify(this._legend.tokenModifiers)}`);
					tokenModifiers.push('not-in-legend');
				}

				const tokenStyle = this._themeService.getColorTheme().getTokenStyleMetadata(tokenType, tokenModifiers, languageId);
				if (typeof tokenStyle === 'undefined') {
					metadata = SemanticTokensProviderStylingConstants.NO_STYLING;
				} else {
					metadata = 0;
					if (typeof tokenStyle.italic !== 'undefined') {
						const italicBit = (tokenStyle.italic ? FontStyle.Italic : 0) << MetadataConsts.FONT_STYLE_OFFSET;
						metadata |= italicBit | MetadataConsts.SEMANTIC_USE_ITALIC;
					}
					if (typeof tokenStyle.bold !== 'undefined') {
						const boldBit = (tokenStyle.bold ? FontStyle.Bold : 0) << MetadataConsts.FONT_STYLE_OFFSET;
						metadata |= boldBit | MetadataConsts.SEMANTIC_USE_BOLD;
					}
					if (typeof tokenStyle.underline !== 'undefined') {
						const underlineBit = (tokenStyle.underline ? FontStyle.Underline : 0) << MetadataConsts.FONT_STYLE_OFFSET;
						metadata |= underlineBit | MetadataConsts.SEMANTIC_USE_UNDERLINE;
					}
					if (typeof tokenStyle.strikethrough !== 'undefined') {
						const strikethroughBit = (tokenStyle.strikethrough ? FontStyle.Strikethrough : 0) << MetadataConsts.FONT_STYLE_OFFSET;
						metadata |= strikethroughBit | MetadataConsts.SEMANTIC_USE_STRIKETHROUGH;
					}
					if (tokenStyle.foreground) {
						const foregroundBits = (tokenStyle.foreground) << MetadataConsts.FOREGROUND_OFFSET;
						metadata |= foregroundBits | MetadataConsts.SEMANTIC_USE_FOREGROUND;
					}
					if (metadata === 0) {
						// Nothing!
						metadata = SemanticTokensProviderStylingConstants.NO_STYLING;
					}
				}
			} else {
				if (ENABLE_TRACE && this._logService.getLevel() === LogLevel.Trace) {
					this._logService.trace(`SemanticTokensProviderStyling: unknown token type index: ${tokenTypeIndex} for legend: ${JSON.stringify(this._legend.tokenTypes)}`);
				}
				metadata = SemanticTokensProviderStylingConstants.NO_STYLING;
				tokenType = 'not-in-legend';
			}
			this._hashTable.add(tokenTypeIndex, tokenModifierSet, encodedLanguageId, metadata);

			if (ENABLE_TRACE && this._logService.getLevel() === LogLevel.Trace) {
				this._logService.trace(`SemanticTokensProviderStyling ${tokenTypeIndex} (${tokenType}) / ${tokenModifierSet} (${tokenModifiers.join(' ')}): foreground ${TokenMetadata.getForeground(metadata)}, fontStyle ${TokenMetadata.getFontStyle(metadata).toString(2)}`);
			}
		}

		return metadata;
	}

	public warnOverlappingSemanticTokens(lineNumber: number, startColumn: number): void {
		if (!this._hasWarnedOverlappingTokens) {
			this._hasWarnedOverlappingTokens = true;
			this._logService.warn(`Overlapping semantic tokens detected at lineNumber ${lineNumber}, column ${startColumn}`);
		}
	}

	public warnInvalidLengthSemanticTokens(lineNumber: number, startColumn: number): void {
		if (!this._hasWarnedInvalidLengthTokens) {
			this._hasWarnedInvalidLengthTokens = true;
			this._logService.warn(`Semantic token with invalid length detected at lineNumber ${lineNumber}, column ${startColumn}`);
		}
	}

	public warnInvalidEditStart(previousResultId: string | undefined, resultId: string | undefined, editIndex: number, editStart: number, maxExpectedStart: number): void {
		if (!this._hasWarnedInvalidEditStart) {
			this._hasWarnedInvalidEditStart = true;
			this._logService.warn(`Invalid semantic tokens edit detected (previousResultId: ${previousResultId}, resultId: ${resultId}) at edit #${editIndex}: The provided start offset ${editStart} is outside the previous data (length ${maxExpectedStart}).`);
		}
	}

}

const enum SemanticColoringConstants {
	/**
	 * Let's aim at having 8KB buffers if possible...
	 * So that would be 8192 / (5 * 4) = 409.6 tokens per area
	 */
	DesiredTokensPerArea = 400,

	/**
	 * Try to keep the total number of areas under 1024 if possible,
	 * simply compensate by having more tokens per area...
	 */
	DesiredMaxAreas = 1024,
}

export function toMultilineTokens2(tokens: SemanticTokens, styling: SemanticTokensProviderStyling, languageId: string): SparseMultilineTokens[] {
	const srcData = tokens.data;
	const tokenCount = (tokens.data.length / 5) | 0;
	const tokensPerArea = Math.max(Math.ceil(tokenCount / SemanticColoringConstants.DesiredMaxAreas), SemanticColoringConstants.DesiredTokensPerArea);
	const result: SparseMultilineTokens[] = [];

	let tokenIndex = 0;
	let lastLineNumber = 1;
	let lastStartCharacter = 0;
	while (tokenIndex < tokenCount) {
		const tokenStartIndex = tokenIndex;
		let tokenEndIndex = Math.min(tokenStartIndex + tokensPerArea, tokenCount);

		// Keep tokens on the same line in the same area...
		if (tokenEndIndex < tokenCount) {

			let smallTokenEndIndex = tokenEndIndex;
			while (smallTokenEndIndex - 1 > tokenStartIndex && srcData[5 * smallTokenEndIndex] === 0) {
				smallTokenEndIndex--;
			}

			if (smallTokenEndIndex - 1 === tokenStartIndex) {
				// there are so many tokens on this line that our area would be empty, we must now go right
				let bigTokenEndIndex = tokenEndIndex;
				while (bigTokenEndIndex + 1 < tokenCount && srcData[5 * bigTokenEndIndex] === 0) {
					bigTokenEndIndex++;
				}
				tokenEndIndex = bigTokenEndIndex;
			} else {
				tokenEndIndex = smallTokenEndIndex;
			}
		}

		let destData = new Uint32Array((tokenEndIndex - tokenStartIndex) * 4);
		let destOffset = 0;
		let areaLine = 0;
		let prevLineNumber = 0;
		let prevEndCharacter = 0;
		while (tokenIndex < tokenEndIndex) {
			const srcOffset = 5 * tokenIndex;
			const deltaLine = srcData[srcOffset];
			const deltaCharacter = srcData[srcOffset + 1];
			// Casting both `lineNumber`, `startCharacter` and `endCharacter` here to uint32 using `|0`
			// to validate below with the actual values that will be inserted in the Uint32Array result
			const lineNumber = (lastLineNumber + deltaLine) | 0;
			const startCharacter = (deltaLine === 0 ? (lastStartCharacter + deltaCharacter) | 0 : deltaCharacter);
			const length = srcData[srcOffset + 2];
			const endCharacter = (startCharacter + length) | 0;
			const tokenTypeIndex = srcData[srcOffset + 3];
			const tokenModifierSet = srcData[srcOffset + 4];

			if (endCharacter <= startCharacter) {
				// this token is invalid (most likely a negative length casted to uint32)
				styling.warnInvalidLengthSemanticTokens(lineNumber, startCharacter + 1);
			} else if (prevLineNumber === lineNumber && prevEndCharacter > startCharacter) {
				// this token overlaps with the previous token
				styling.warnOverlappingSemanticTokens(lineNumber, startCharacter + 1);
			} else {
				const metadata = styling.getMetadata(tokenTypeIndex, tokenModifierSet, languageId);

				if (metadata !== SemanticTokensProviderStylingConstants.NO_STYLING) {
					if (areaLine === 0) {
						areaLine = lineNumber;
					}
					destData[destOffset] = lineNumber - areaLine;
					destData[destOffset + 1] = startCharacter;
					destData[destOffset + 2] = endCharacter;
					destData[destOffset + 3] = metadata;
					destOffset += 4;

					prevLineNumber = lineNumber;
					prevEndCharacter = endCharacter;
				}
			}

			lastLineNumber = lineNumber;
			lastStartCharacter = startCharacter;
			tokenIndex++;
		}

		if (destOffset !== destData.length) {
			destData = destData.subarray(0, destOffset);
		}

		const tokens = SparseMultilineTokens.create(areaLine, destData);
		result.push(tokens);
	}

	return result;
}

class HashTableEntry {
	public readonly tokenTypeIndex: number;
	public readonly tokenModifierSet: number;
	public readonly languageId: number;
	public readonly metadata: number;
	public next: HashTableEntry | null;

	constructor(tokenTypeIndex: number, tokenModifierSet: number, languageId: number, metadata: number) {
		this.tokenTypeIndex = tokenTypeIndex;
		this.tokenModifierSet = tokenModifierSet;
		this.languageId = languageId;
		this.metadata = metadata;
		this.next = null;
	}
}

class HashTable {

	private static _SIZES = [3, 7, 13, 31, 61, 127, 251, 509, 1021, 2039, 4093, 8191, 16381, 32749, 65521, 131071, 262139, 524287, 1048573, 2097143];

	private _elementsCount: number;
	private _currentLengthIndex: number;
	private _currentLength: number;
	private _growCount: number;
	private _elements: (HashTableEntry | null)[];

	constructor() {
		this._elementsCount = 0;
		this._currentLengthIndex = 0;
		this._currentLength = HashTable._SIZES[this._currentLengthIndex];
		this._growCount = Math.round(this._currentLengthIndex + 1 < HashTable._SIZES.length ? 2 / 3 * this._currentLength : 0);
		this._elements = [];
		HashTable._nullOutEntries(this._elements, this._currentLength);
	}

	private static _nullOutEntries(entries: (HashTableEntry | null)[], length: number): void {
		for (let i = 0; i < length; i++) {
			entries[i] = null;
		}
	}

	private _hash2(n1: number, n2: number): number {
		return (((n1 << 5) - n1) + n2) | 0;  // n1 * 31 + n2, keep as int32
	}

	private _hashFunc(tokenTypeIndex: number, tokenModifierSet: number, languageId: number): number {
		return this._hash2(this._hash2(tokenTypeIndex, tokenModifierSet), languageId) % this._currentLength;
	}

	public get(tokenTypeIndex: number, tokenModifierSet: number, languageId: number): HashTableEntry | null {
		const hash = this._hashFunc(tokenTypeIndex, tokenModifierSet, languageId);

		let p = this._elements[hash];
		while (p) {
			if (p.tokenTypeIndex === tokenTypeIndex && p.tokenModifierSet === tokenModifierSet && p.languageId === languageId) {
				return p;
			}
			p = p.next;
		}

		return null;
	}

	public add(tokenTypeIndex: number, tokenModifierSet: number, languageId: number, metadata: number): void {
		this._elementsCount++;
		if (this._growCount !== 0 && this._elementsCount >= this._growCount) {
			// expand!
			const oldElements = this._elements;

			this._currentLengthIndex++;
			this._currentLength = HashTable._SIZES[this._currentLengthIndex];
			this._growCount = Math.round(this._currentLengthIndex + 1 < HashTable._SIZES.length ? 2 / 3 * this._currentLength : 0);
			this._elements = [];
			HashTable._nullOutEntries(this._elements, this._currentLength);

			for (const first of oldElements) {
				let p = first;
				while (p) {
					const oldNext = p.next;
					p.next = null;
					this._add(p);
					p = oldNext;
				}
			}
		}
		this._add(new HashTableEntry(tokenTypeIndex, tokenModifierSet, languageId, metadata));
	}

	private _add(element: HashTableEntry): void {
		const hash = this._hashFunc(element.tokenTypeIndex, element.tokenModifierSet, element.languageId);
		element.next = this._elements[hash];
		this._elements[hash] = element;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/semanticTokensStyling.ts]---
Location: vscode-main/src/vs/editor/common/services/semanticTokensStyling.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { DocumentSemanticTokensProvider, DocumentRangeSemanticTokensProvider } from '../languages.js';
import { SemanticTokensProviderStyling } from './semanticTokensProviderStyling.js';

export const ISemanticTokensStylingService = createDecorator<ISemanticTokensStylingService>('semanticTokensStylingService');

export type DocumentTokensProvider = DocumentSemanticTokensProvider | DocumentRangeSemanticTokensProvider;

export interface ISemanticTokensStylingService {
	readonly _serviceBrand: undefined;

	getStyling(provider: DocumentTokensProvider): SemanticTokensProviderStyling;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/semanticTokensStylingService.ts]---
Location: vscode-main/src/vs/editor/common/services/semanticTokensStylingService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../base/common/lifecycle.js';
import { ILanguageService } from '../languages/language.js';
import { DocumentTokensProvider } from './model.js';
import { IThemeService } from '../../../platform/theme/common/themeService.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { SemanticTokensProviderStyling } from './semanticTokensProviderStyling.js';
import { ISemanticTokensStylingService } from './semanticTokensStyling.js';
import { InstantiationType, registerSingleton } from '../../../platform/instantiation/common/extensions.js';

export class SemanticTokensStylingService extends Disposable implements ISemanticTokensStylingService {

	public _serviceBrand: undefined;

	private _caches: WeakMap<DocumentTokensProvider, SemanticTokensProviderStyling>;

	constructor(
		@IThemeService private readonly _themeService: IThemeService,
		@ILogService private readonly _logService: ILogService,
		@ILanguageService private readonly _languageService: ILanguageService,
	) {
		super();
		this._caches = new WeakMap<DocumentTokensProvider, SemanticTokensProviderStyling>();
		this._register(this._themeService.onDidColorThemeChange(() => {
			this._caches = new WeakMap<DocumentTokensProvider, SemanticTokensProviderStyling>();
		}));
	}

	public getStyling(provider: DocumentTokensProvider): SemanticTokensProviderStyling {
		if (!this._caches.has(provider)) {
			this._caches.set(provider, new SemanticTokensProviderStyling(provider.getLegend(), this._themeService, this._languageService, this._logService));
		}
		return this._caches.get(provider)!;
	}
}

registerSingleton(ISemanticTokensStylingService, SemanticTokensStylingService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/textResourceConfiguration.ts]---
Location: vscode-main/src/vs/editor/common/services/textResourceConfiguration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { URI } from '../../../base/common/uri.js';
import { IPosition } from '../core/position.js';
import { ConfigurationTarget, IConfigurationValue } from '../../../platform/configuration/common/configuration.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';

export const ITextResourceConfigurationService = createDecorator<ITextResourceConfigurationService>('textResourceConfigurationService');

export interface ITextResourceConfigurationChangeEvent {

	/**
	 * All affected keys. Also includes language overrides and keys changed under language overrides.
	 */
	readonly affectedKeys: ReadonlySet<string>;

	/**
	 * Returns `true` if the given section has changed for the given resource.
	 *
	 * Example: To check if the configuration section has changed for a given resource use `e.affectsConfiguration(resource, section)`.
	 *
	 * @param resource Resource for which the configuration has to be checked.
	 * @param section Section of the configuration
	 */
	affectsConfiguration(resource: URI | undefined, section: string): boolean;
}

export interface ITextResourceConfigurationService {

	readonly _serviceBrand: undefined;

	/**
	 * Event that fires when the configuration changes.
	 */
	readonly onDidChangeConfiguration: Event<ITextResourceConfigurationChangeEvent>;

	/**
	 * Fetches the value of the section for the given resource by applying language overrides.
	 * Value can be of native type or an object keyed off the section name.
	 *
	 * @param resource - Resource for which the configuration has to be fetched.
	 * @param position - Position in the resource for which configuration has to be fetched.
	 * @param section - Section of the configuration.
	 *
	 */
	getValue<T>(resource: URI | undefined, section?: string): T;
	getValue<T>(resource: URI | undefined, position?: IPosition, section?: string): T;

	/**
	 * Inspects the values of the section for the given resource by applying language overrides.
	 *
	 * @param resource - Resource for which the configuration has to be fetched.
	 * @param position - Position in the resource for which configuration has to be fetched.
	 * @param section - Section of the configuration.
	 *
	 */
	inspect<T>(resource: URI | undefined, position: IPosition | null, section: string): IConfigurationValue<Readonly<T>>;

	/**
	 * Update the configuration value for the given resource at the effective location.
	 *
	 * - If configurationTarget is not specified, target will be derived by checking where the configuration is defined.
	 * - If the language overrides for the give resource contains the configuration, then it is updated.
	 *
	 * @param resource Resource for which the configuration has to be updated
	 * @param key Configuration key
	 * @param value Configuration value
	 * @param configurationTarget Optional target into which the configuration has to be updated.
	 * If not specified, target will be derived by checking where the configuration is defined.
	 */
	updateValue(resource: URI | undefined, key: string, value: unknown, configurationTarget?: ConfigurationTarget): Promise<void>;

}

export const ITextResourcePropertiesService = createDecorator<ITextResourcePropertiesService>('textResourcePropertiesService');

export interface ITextResourcePropertiesService {

	readonly _serviceBrand: undefined;

	/**
	 * Returns the End of Line characters for the given resource
	 */
	getEOL(resource: URI, language?: string): string;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/textResourceConfigurationService.ts]---
Location: vscode-main/src/vs/editor/common/services/textResourceConfigurationService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { IPosition, Position } from '../core/position.js';
import { ILanguageService } from '../languages/language.js';
import { IModelService } from './model.js';
import { ITextResourceConfigurationService, ITextResourceConfigurationChangeEvent } from './textResourceConfiguration.js';
import { IConfigurationService, ConfigurationTarget, IConfigurationValue, IConfigurationChangeEvent } from '../../../platform/configuration/common/configuration.js';

export class TextResourceConfigurationService extends Disposable implements ITextResourceConfigurationService {

	public _serviceBrand: undefined;

	private readonly _onDidChangeConfiguration: Emitter<ITextResourceConfigurationChangeEvent> = this._register(new Emitter<ITextResourceConfigurationChangeEvent>());
	public readonly onDidChangeConfiguration: Event<ITextResourceConfigurationChangeEvent> = this._onDidChangeConfiguration.event;

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IModelService private readonly modelService: IModelService,
		@ILanguageService private readonly languageService: ILanguageService,
	) {
		super();
		this._register(this.configurationService.onDidChangeConfiguration(e => this._onDidChangeConfiguration.fire(this.toResourceConfigurationChangeEvent(e))));
	}

	getValue<T>(resource: URI | undefined, section?: string): T;
	getValue<T>(resource: URI | undefined, at?: IPosition, section?: string): T;
	getValue<T>(resource: URI | undefined, arg2?: unknown, arg3?: unknown): T {
		if (typeof arg3 === 'string') {
			return this._getValue(resource, Position.isIPosition(arg2) ? arg2 : null, arg3);
		}
		return this._getValue(resource, null, typeof arg2 === 'string' ? arg2 : undefined);
	}

	updateValue(resource: URI | undefined, key: string, value: unknown, configurationTarget?: ConfigurationTarget): Promise<void> {
		const language = resource ? this.getLanguage(resource, null) : null;
		const configurationValue = this.configurationService.inspect(key, { resource, overrideIdentifier: language });
		if (configurationTarget === undefined) {
			configurationTarget = this.deriveConfigurationTarget(configurationValue, language);
		}
		const overrideIdentifier = language && configurationValue.overrideIdentifiers?.includes(language) ? language : undefined;
		return this.configurationService.updateValue(key, value, { resource, overrideIdentifier }, configurationTarget);
	}

	private deriveConfigurationTarget(configurationValue: IConfigurationValue<unknown>, language: string | null): ConfigurationTarget {
		if (language) {
			if (configurationValue.memory?.override !== undefined) {
				return ConfigurationTarget.MEMORY;
			}
			if (configurationValue.workspaceFolder?.override !== undefined) {
				return ConfigurationTarget.WORKSPACE_FOLDER;
			}
			if (configurationValue.workspace?.override !== undefined) {
				return ConfigurationTarget.WORKSPACE;
			}
			if (configurationValue.userRemote?.override !== undefined) {
				return ConfigurationTarget.USER_REMOTE;
			}
			if (configurationValue.userLocal?.override !== undefined) {
				return ConfigurationTarget.USER_LOCAL;
			}
		}
		if (configurationValue.memory?.value !== undefined) {
			return ConfigurationTarget.MEMORY;
		}
		if (configurationValue.workspaceFolder?.value !== undefined) {
			return ConfigurationTarget.WORKSPACE_FOLDER;
		}
		if (configurationValue.workspace?.value !== undefined) {
			return ConfigurationTarget.WORKSPACE;
		}
		if (configurationValue.userRemote?.value !== undefined) {
			return ConfigurationTarget.USER_REMOTE;
		}
		return ConfigurationTarget.USER_LOCAL;
	}

	private _getValue<T>(resource: URI | undefined, position: IPosition | null, section: string | undefined): T {
		const language = resource ? this.getLanguage(resource, position) : undefined;
		if (typeof section === 'undefined') {
			return this.configurationService.getValue<T>({ resource, overrideIdentifier: language });
		}
		return this.configurationService.getValue<T>(section, { resource, overrideIdentifier: language });
	}

	inspect<T>(resource: URI | undefined, position: IPosition | null, section: string): IConfigurationValue<Readonly<T>> {
		const language = resource ? this.getLanguage(resource, position) : undefined;
		return this.configurationService.inspect<T>(section, { resource, overrideIdentifier: language });
	}

	private getLanguage(resource: URI, position: IPosition | null): string | null {
		const model = this.modelService.getModel(resource);
		if (model) {
			return position ? model.getLanguageIdAtPosition(position.lineNumber, position.column) : model.getLanguageId();
		}
		return this.languageService.guessLanguageIdByFilepathOrFirstLine(resource);
	}

	private toResourceConfigurationChangeEvent(configurationChangeEvent: IConfigurationChangeEvent): ITextResourceConfigurationChangeEvent {
		return {
			affectedKeys: configurationChangeEvent.affectedKeys,
			affectsConfiguration: (resource: URI | undefined, configuration: string) => {
				const overrideIdentifier = resource ? this.getLanguage(resource, null) : undefined;
				if (configurationChangeEvent.affectsConfiguration(configuration, { resource, overrideIdentifier })) {
					return true;
				}
				if (overrideIdentifier) {
					//TODO@sandy081 workaround for https://github.com/microsoft/vscode/issues/240410
					return configurationChangeEvent.affectedKeys.has(`[${overrideIdentifier}]`);
				}
				return false;
			}
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/treeViewsDnd.ts]---
Location: vscode-main/src/vs/editor/common/services/treeViewsDnd.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface ITreeViewsDnDService<T> {
	readonly _serviceBrand: undefined;

	removeDragOperationTransfer(uuid: string | undefined): Promise<T | undefined> | undefined;
	addDragOperationTransfer(uuid: string, transferPromise: Promise<T | undefined>): void;
}

export class TreeViewsDnDService<T> implements ITreeViewsDnDService<T> {
	_serviceBrand: undefined;
	private _dragOperations: Map<string, Promise<T | undefined>> = new Map();

	removeDragOperationTransfer(uuid: string | undefined): Promise<T | undefined> | undefined {
		if ((uuid && this._dragOperations.has(uuid))) {
			const operation = this._dragOperations.get(uuid);
			this._dragOperations.delete(uuid);
			return operation;
		}
		return undefined;
	}

	addDragOperationTransfer(uuid: string, transferPromise: Promise<T | undefined>): void {
		this._dragOperations.set(uuid, transferPromise);
	}
}


export class DraggedTreeItemsIdentifier {

	constructor(readonly identifier: string) { }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/treeViewsDndService.ts]---
Location: vscode-main/src/vs/editor/common/services/treeViewsDndService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from '../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { VSDataTransfer } from '../../../base/common/dataTransfer.js';
import { ITreeViewsDnDService as ITreeViewsDnDServiceCommon, TreeViewsDnDService } from './treeViewsDnd.js';

export interface ITreeViewsDnDService extends ITreeViewsDnDServiceCommon<VSDataTransfer> { }
export const ITreeViewsDnDService = createDecorator<ITreeViewsDnDService>('treeViewsDndService');
registerSingleton(ITreeViewsDnDService, TreeViewsDnDService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/unicodeTextModelHighlighter.ts]---
Location: vscode-main/src/vs/editor/common/services/unicodeTextModelHighlighter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IRange, Range } from '../core/range.js';
import { Searcher } from '../model/textModelSearch.js';
import * as strings from '../../../base/common/strings.js';
import { IUnicodeHighlightsResult } from './editorWorker.js';
import { assertNever } from '../../../base/common/assert.js';
import { DEFAULT_WORD_REGEXP, getWordAtText } from '../core/wordHelper.js';

export class UnicodeTextModelHighlighter {
	public static computeUnicodeHighlights(model: IUnicodeCharacterSearcherTarget, options: UnicodeHighlighterOptions, range?: IRange): IUnicodeHighlightsResult {
		const startLine = range ? range.startLineNumber : 1;
		const endLine = range ? range.endLineNumber : model.getLineCount();

		const codePointHighlighter = new CodePointHighlighter(options);

		const candidates = codePointHighlighter.getCandidateCodePoints();
		let regex: RegExp;
		if (candidates === 'allNonBasicAscii') {
			regex = new RegExp('[^\\t\\n\\r\\x20-\\x7E]', 'g');
		} else {
			regex = new RegExp(`${buildRegExpCharClassExpr(Array.from(candidates))}`, 'g');
		}

		const searcher = new Searcher(null, regex);
		const ranges: Range[] = [];
		let hasMore = false;
		let m: RegExpExecArray | null;

		let ambiguousCharacterCount = 0;
		let invisibleCharacterCount = 0;
		let nonBasicAsciiCharacterCount = 0;

		forLoop:
		for (let lineNumber = startLine, lineCount = endLine; lineNumber <= lineCount; lineNumber++) {
			const lineContent = model.getLineContent(lineNumber);
			const lineLength = lineContent.length;

			// Reset regex to search from the beginning
			searcher.reset(0);
			do {
				m = searcher.next(lineContent);
				if (m) {
					let startIndex = m.index;
					let endIndex = m.index + m[0].length;

					// Extend range to entire code point
					if (startIndex > 0) {
						const charCodeBefore = lineContent.charCodeAt(startIndex - 1);
						if (strings.isHighSurrogate(charCodeBefore)) {
							startIndex--;
						}
					}
					if (endIndex + 1 < lineLength) {
						const charCodeBefore = lineContent.charCodeAt(endIndex - 1);
						if (strings.isHighSurrogate(charCodeBefore)) {
							endIndex++;
						}
					}
					const str = lineContent.substring(startIndex, endIndex);
					let word = getWordAtText(startIndex + 1, DEFAULT_WORD_REGEXP, lineContent, 0);
					if (word && word.endColumn <= startIndex + 1) {
						// The word does not include the problematic character, ignore the word
						word = null;
					}
					const highlightReason = codePointHighlighter.shouldHighlightNonBasicASCII(str, word ? word.word : null);

					if (highlightReason !== SimpleHighlightReason.None) {
						if (highlightReason === SimpleHighlightReason.Ambiguous) {
							ambiguousCharacterCount++;
						} else if (highlightReason === SimpleHighlightReason.Invisible) {
							invisibleCharacterCount++;
						} else if (highlightReason === SimpleHighlightReason.NonBasicASCII) {
							nonBasicAsciiCharacterCount++;
						} else {
							assertNever(highlightReason);
						}

						const MAX_RESULT_LENGTH = 1000;
						if (ranges.length >= MAX_RESULT_LENGTH) {
							hasMore = true;
							break forLoop;
						}

						ranges.push(new Range(lineNumber, startIndex + 1, lineNumber, endIndex + 1));
					}
				}
			} while (m);
		}
		return {
			ranges,
			hasMore,
			ambiguousCharacterCount,
			invisibleCharacterCount,
			nonBasicAsciiCharacterCount
		};
	}

	public static computeUnicodeHighlightReason(char: string, options: UnicodeHighlighterOptions): UnicodeHighlighterReason | null {
		const codePointHighlighter = new CodePointHighlighter(options);

		const reason = codePointHighlighter.shouldHighlightNonBasicASCII(char, null);
		switch (reason) {
			case SimpleHighlightReason.None:
				return null;
			case SimpleHighlightReason.Invisible:
				return { kind: UnicodeHighlighterReasonKind.Invisible };

			case SimpleHighlightReason.Ambiguous: {
				const codePoint = char.codePointAt(0)!;
				const primaryConfusable = codePointHighlighter.ambiguousCharacters.getPrimaryConfusable(codePoint)!;
				const notAmbiguousInLocales =
					strings.AmbiguousCharacters.getLocales().filter(
						(l) =>
							!strings.AmbiguousCharacters.getInstance(
								new Set([...options.allowedLocales, l])
							).isAmbiguous(codePoint)
					);
				return { kind: UnicodeHighlighterReasonKind.Ambiguous, confusableWith: String.fromCodePoint(primaryConfusable), notAmbiguousInLocales };
			}
			case SimpleHighlightReason.NonBasicASCII:
				return { kind: UnicodeHighlighterReasonKind.NonBasicAscii };
		}
	}
}

function buildRegExpCharClassExpr(codePoints: number[], flags?: string): string {
	const src = `[${strings.escapeRegExpCharacters(
		codePoints.map((i) => String.fromCodePoint(i)).join('')
	)}]`;
	return src;
}

export const enum UnicodeHighlighterReasonKind {
	Ambiguous, Invisible, NonBasicAscii
}

export type UnicodeHighlighterReason = {
	kind: UnicodeHighlighterReasonKind.Ambiguous;
	confusableWith: string;
	notAmbiguousInLocales: string[];
} | {
	kind: UnicodeHighlighterReasonKind.Invisible;
} | {
	kind: UnicodeHighlighterReasonKind.NonBasicAscii;
};

class CodePointHighlighter {
	private readonly allowedCodePoints: Set<number>;
	public readonly ambiguousCharacters: strings.AmbiguousCharacters;
	constructor(private readonly options: UnicodeHighlighterOptions) {
		this.allowedCodePoints = new Set(options.allowedCodePoints);
		this.ambiguousCharacters = strings.AmbiguousCharacters.getInstance(new Set(options.allowedLocales));
	}

	public getCandidateCodePoints(): Set<number> | 'allNonBasicAscii' {
		if (this.options.nonBasicASCII) {
			return 'allNonBasicAscii';
		}

		const set = new Set<number>();

		if (this.options.invisibleCharacters) {
			for (const cp of strings.InvisibleCharacters.codePoints) {
				if (!isAllowedInvisibleCharacter(String.fromCodePoint(cp))) {
					set.add(cp);
				}
			}
		}

		if (this.options.ambiguousCharacters) {
			for (const cp of this.ambiguousCharacters.getConfusableCodePoints()) {
				set.add(cp);
			}
		}

		for (const cp of this.allowedCodePoints) {
			set.delete(cp);
		}

		return set;
	}

	public shouldHighlightNonBasicASCII(character: string, wordContext: string | null): SimpleHighlightReason {
		const codePoint = character.codePointAt(0)!;

		if (this.allowedCodePoints.has(codePoint)) {
			return SimpleHighlightReason.None;
		}

		if (this.options.nonBasicASCII) {
			return SimpleHighlightReason.NonBasicASCII;
		}

		let hasBasicASCIICharacters = false;
		let hasNonConfusableNonBasicAsciiCharacter = false;
		if (wordContext) {
			for (const char of wordContext) {
				const codePoint = char.codePointAt(0)!;
				const isBasicASCII = strings.isBasicASCII(char);
				hasBasicASCIICharacters = hasBasicASCIICharacters || isBasicASCII;

				if (
					!isBasicASCII &&
					!this.ambiguousCharacters.isAmbiguous(codePoint) &&
					!strings.InvisibleCharacters.isInvisibleCharacter(codePoint)
				) {
					hasNonConfusableNonBasicAsciiCharacter = true;
				}
			}
		}

		if (
			/* Don't allow mixing weird looking characters with ASCII */ !hasBasicASCIICharacters &&
			/* Is there an obviously weird looking character? */ hasNonConfusableNonBasicAsciiCharacter
		) {
			return SimpleHighlightReason.None;
		}

		if (this.options.invisibleCharacters) {
			// TODO check for emojis
			if (!isAllowedInvisibleCharacter(character) && strings.InvisibleCharacters.isInvisibleCharacter(codePoint)) {
				return SimpleHighlightReason.Invisible;
			}
		}

		if (this.options.ambiguousCharacters) {
			if (this.ambiguousCharacters.isAmbiguous(codePoint)) {
				return SimpleHighlightReason.Ambiguous;
			}
		}

		return SimpleHighlightReason.None;
	}
}

function isAllowedInvisibleCharacter(character: string): boolean {
	return character === ' ' || character === '\n' || character === '\t';
}

const enum SimpleHighlightReason {
	None,
	NonBasicASCII,
	Invisible,
	Ambiguous
}

export interface IUnicodeCharacterSearcherTarget {
	getLineCount(): number;
	getLineContent(lineNumber: number): string;
}

export interface UnicodeHighlighterOptions {
	nonBasicASCII: boolean;
	ambiguousCharacters: boolean;
	invisibleCharacters: boolean;
	includeComments: boolean;
	includeStrings: boolean;
	allowedCodePoints: number[];
	allowedLocales: string[];
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/textModelSync/textModelSync.impl.ts]---
Location: vscode-main/src/vs/editor/common/services/textModelSync/textModelSync.impl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IntervalTimer } from '../../../../base/common/async.js';
import { Disposable, DisposableStore, dispose, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { IWebWorkerClient, IWebWorkerServer } from '../../../../base/common/worker/webWorker.js';
import { IPosition, Position } from '../../core/position.js';
import { IRange, Range } from '../../core/range.js';
import { ensureValidWordDefinition, getWordAtText, IWordAtPosition } from '../../core/wordHelper.js';
import { IDocumentColorComputerTarget } from '../../languages/defaultDocumentColorsComputer.js';
import { ILinkComputerTarget } from '../../languages/linkComputer.js';
import { MirrorTextModel as BaseMirrorModel, IModelChangedEvent } from '../../model/mirrorTextModel.js';
import { IMirrorModel, IWordRange } from '../editorWebWorker.js';
import { IModelService } from '../model.js';
import { IRawModelData, IWorkerTextModelSyncChannelServer } from './textModelSync.protocol.js';

/**
 * Stop syncing a model to the worker if it was not needed for 1 min.
 */
export const STOP_SYNC_MODEL_DELTA_TIME_MS = 60 * 1000;

export const WORKER_TEXT_MODEL_SYNC_CHANNEL = 'workerTextModelSync';

export class WorkerTextModelSyncClient extends Disposable {

	public static create(workerClient: IWebWorkerClient<unknown>, modelService: IModelService): WorkerTextModelSyncClient {
		return new WorkerTextModelSyncClient(
			workerClient.getChannel<IWorkerTextModelSyncChannelServer>(WORKER_TEXT_MODEL_SYNC_CHANNEL),
			modelService
		);
	}

	private readonly _proxy: IWorkerTextModelSyncChannelServer;
	private readonly _modelService: IModelService;
	private _syncedModels: { [modelUrl: string]: IDisposable } = Object.create(null);
	private _syncedModelsLastUsedTime: { [modelUrl: string]: number } = Object.create(null);

	constructor(proxy: IWorkerTextModelSyncChannelServer, modelService: IModelService, keepIdleModels: boolean = false) {
		super();
		this._proxy = proxy;
		this._modelService = modelService;

		if (!keepIdleModels) {
			const timer = new IntervalTimer();
			timer.cancelAndSet(() => this._checkStopModelSync(), Math.round(STOP_SYNC_MODEL_DELTA_TIME_MS / 2));
			this._register(timer);
		}
	}

	public override dispose(): void {
		for (const modelUrl in this._syncedModels) {
			dispose(this._syncedModels[modelUrl]);
		}
		this._syncedModels = Object.create(null);
		this._syncedModelsLastUsedTime = Object.create(null);
		super.dispose();
	}

	public ensureSyncedResources(resources: URI[], forceLargeModels: boolean = false): void {
		for (const resource of resources) {
			const resourceStr = resource.toString();

			if (!this._syncedModels[resourceStr]) {
				this._beginModelSync(resource, forceLargeModels);
			}
			if (this._syncedModels[resourceStr]) {
				this._syncedModelsLastUsedTime[resourceStr] = (new Date()).getTime();
			}
		}
	}

	private _checkStopModelSync(): void {
		const currentTime = (new Date()).getTime();

		const toRemove: string[] = [];
		for (const modelUrl in this._syncedModelsLastUsedTime) {
			const elapsedTime = currentTime - this._syncedModelsLastUsedTime[modelUrl];
			if (elapsedTime > STOP_SYNC_MODEL_DELTA_TIME_MS) {
				toRemove.push(modelUrl);
			}
		}

		for (const e of toRemove) {
			this._stopModelSync(e);
		}
	}

	private _beginModelSync(resource: URI, forceLargeModels: boolean): void {
		const model = this._modelService.getModel(resource);
		if (!model) {
			return;
		}
		if (!forceLargeModels && model.isTooLargeForSyncing()) {
			return;
		}

		const modelUrl = resource.toString();

		this._proxy.$acceptNewModel({
			url: model.uri.toString(),
			lines: model.getLinesContent(),
			EOL: model.getEOL(),
			versionId: model.getVersionId()
		});

		const toDispose = new DisposableStore();
		toDispose.add(model.onDidChangeContent((e) => {
			this._proxy.$acceptModelChanged(modelUrl.toString(), e);
		}));
		toDispose.add(model.onWillDispose(() => {
			this._stopModelSync(modelUrl);
		}));
		toDispose.add(toDisposable(() => {
			this._proxy.$acceptRemovedModel(modelUrl);
		}));

		this._syncedModels[modelUrl] = toDispose;
	}

	private _stopModelSync(modelUrl: string): void {
		const toDispose = this._syncedModels[modelUrl];
		delete this._syncedModels[modelUrl];
		delete this._syncedModelsLastUsedTime[modelUrl];
		dispose(toDispose);
	}
}

export class WorkerTextModelSyncServer implements IWorkerTextModelSyncChannelServer {

	private readonly _models: { [uri: string]: MirrorModel };

	constructor() {
		this._models = Object.create(null);
	}

	public bindToServer(workerServer: IWebWorkerServer): void {
		workerServer.setChannel(WORKER_TEXT_MODEL_SYNC_CHANNEL, this);
	}

	public getModel(uri: string): ICommonModel | undefined {
		return this._models[uri];
	}

	public getModels(): ICommonModel[] {
		const all: MirrorModel[] = [];
		Object.keys(this._models).forEach((key) => all.push(this._models[key]));
		return all;
	}

	$acceptNewModel(data: IRawModelData): void {
		this._models[data.url] = new MirrorModel(URI.parse(data.url), data.lines, data.EOL, data.versionId);
	}

	$acceptModelChanged(uri: string, e: IModelChangedEvent): void {
		if (!this._models[uri]) {
			return;
		}
		const model = this._models[uri];
		model.onEvents(e);
	}

	$acceptRemovedModel(uri: string): void {
		if (!this._models[uri]) {
			return;
		}
		delete this._models[uri];
	}
}

export class MirrorModel extends BaseMirrorModel implements ICommonModel {

	public get uri(): URI {
		return this._uri;
	}

	public get eol(): string {
		return this._eol;
	}

	public getValue(): string {
		return this.getText();
	}

	public findMatches(regex: RegExp): RegExpMatchArray[] {
		const matches = [];
		for (let i = 0; i < this._lines.length; i++) {
			const line = this._lines[i];
			const offsetToAdd = this.offsetAt(new Position(i + 1, 1));
			const iteratorOverMatches = line.matchAll(regex);
			for (const match of iteratorOverMatches) {
				if (match.index || match.index === 0) {
					match.index = match.index + offsetToAdd;
				}
				matches.push(match);
			}
		}
		return matches;
	}

	public getLinesContent(): string[] {
		return this._lines.slice(0);
	}

	public getLineCount(): number {
		return this._lines.length;
	}

	public getLineContent(lineNumber: number): string {
		return this._lines[lineNumber - 1];
	}

	public getWordAtPosition(position: IPosition, wordDefinition: RegExp): Range | null {

		const wordAtText = getWordAtText(
			position.column,
			ensureValidWordDefinition(wordDefinition),
			this._lines[position.lineNumber - 1],
			0
		);

		if (wordAtText) {
			return new Range(position.lineNumber, wordAtText.startColumn, position.lineNumber, wordAtText.endColumn);
		}

		return null;
	}

	public getWordUntilPosition(position: IPosition, wordDefinition: RegExp): IWordAtPosition {
		const wordAtPosition = this.getWordAtPosition(position, wordDefinition);
		if (!wordAtPosition) {
			return {
				word: '',
				startColumn: position.column,
				endColumn: position.column
			};
		}
		return {
			word: this._lines[position.lineNumber - 1].substring(wordAtPosition.startColumn - 1, position.column - 1),
			startColumn: wordAtPosition.startColumn,
			endColumn: position.column
		};
	}


	public words(wordDefinition: RegExp): Iterable<string> {

		const lines = this._lines;
		const wordenize = this._wordenize.bind(this);

		let lineNumber = 0;
		let lineText = '';
		let wordRangesIdx = 0;
		let wordRanges: IWordRange[] = [];

		return {
			*[Symbol.iterator]() {
				while (true) {
					if (wordRangesIdx < wordRanges.length) {
						const value = lineText.substring(wordRanges[wordRangesIdx].start, wordRanges[wordRangesIdx].end);
						wordRangesIdx += 1;
						yield value;
					} else {
						if (lineNumber < lines.length) {
							lineText = lines[lineNumber];
							wordRanges = wordenize(lineText, wordDefinition);
							wordRangesIdx = 0;
							lineNumber += 1;
						} else {
							break;
						}
					}
				}
			}
		};
	}

	public getLineWords(lineNumber: number, wordDefinition: RegExp): IWordAtPosition[] {
		const content = this._lines[lineNumber - 1];
		const ranges = this._wordenize(content, wordDefinition);
		const words: IWordAtPosition[] = [];
		for (const range of ranges) {
			words.push({
				word: content.substring(range.start, range.end),
				startColumn: range.start + 1,
				endColumn: range.end + 1
			});
		}
		return words;
	}

	private _wordenize(content: string, wordDefinition: RegExp): IWordRange[] {
		const result: IWordRange[] = [];
		let match: RegExpExecArray | null;

		wordDefinition.lastIndex = 0; // reset lastIndex just to be sure

		while (match = wordDefinition.exec(content)) {
			if (match[0].length === 0) {
				// it did match the empty string
				break;
			}
			result.push({ start: match.index, end: match.index + match[0].length });
		}
		return result;
	}

	public getValueInRange(range: IRange): string {
		range = this._validateRange(range);

		if (range.startLineNumber === range.endLineNumber) {
			return this._lines[range.startLineNumber - 1].substring(range.startColumn - 1, range.endColumn - 1);
		}

		const lineEnding = this._eol;
		const startLineIndex = range.startLineNumber - 1;
		const endLineIndex = range.endLineNumber - 1;
		const resultLines: string[] = [];

		resultLines.push(this._lines[startLineIndex].substring(range.startColumn - 1));
		for (let i = startLineIndex + 1; i < endLineIndex; i++) {
			resultLines.push(this._lines[i]);
		}
		resultLines.push(this._lines[endLineIndex].substring(0, range.endColumn - 1));

		return resultLines.join(lineEnding);
	}

	public offsetAt(position: IPosition): number {
		position = this._validatePosition(position);
		this._ensureLineStarts();
		return this._lineStarts!.getPrefixSum(position.lineNumber - 2) + (position.column - 1);
	}

	public positionAt(offset: number): IPosition {
		offset = Math.floor(offset);
		offset = Math.max(0, offset);

		this._ensureLineStarts();
		const out = this._lineStarts!.getIndexOf(offset);
		const lineLength = this._lines[out.index].length;

		// Ensure we return a valid position
		return {
			lineNumber: 1 + out.index,
			column: 1 + Math.min(out.remainder, lineLength)
		};
	}

	private _validateRange(range: IRange): IRange {

		const start = this._validatePosition({ lineNumber: range.startLineNumber, column: range.startColumn });
		const end = this._validatePosition({ lineNumber: range.endLineNumber, column: range.endColumn });

		if (start.lineNumber !== range.startLineNumber
			|| start.column !== range.startColumn
			|| end.lineNumber !== range.endLineNumber
			|| end.column !== range.endColumn) {

			return {
				startLineNumber: start.lineNumber,
				startColumn: start.column,
				endLineNumber: end.lineNumber,
				endColumn: end.column
			};
		}

		return range;
	}

	private _validatePosition(position: IPosition): IPosition {
		if (!Position.isIPosition(position)) {
			throw new Error('bad position');
		}
		let { lineNumber, column } = position;
		let hasChanged = false;

		if (lineNumber < 1) {
			lineNumber = 1;
			column = 1;
			hasChanged = true;

		} else if (lineNumber > this._lines.length) {
			lineNumber = this._lines.length;
			column = this._lines[lineNumber - 1].length + 1;
			hasChanged = true;

		} else {
			const maxCharacter = this._lines[lineNumber - 1].length + 1;
			if (column < 1) {
				column = 1;
				hasChanged = true;
			}
			else if (column > maxCharacter) {
				column = maxCharacter;
				hasChanged = true;
			}
		}

		if (!hasChanged) {
			return position;
		} else {
			return { lineNumber, column };
		}
	}
}

export interface ICommonModel extends ILinkComputerTarget, IDocumentColorComputerTarget, IMirrorModel {
	uri: URI;
	version: number;
	eol: string;
	getValue(): string;

	getLinesContent(): string[];
	getLineCount(): number;
	getLineContent(lineNumber: number): string;
	getLineWords(lineNumber: number, wordDefinition: RegExp): IWordAtPosition[];
	words(wordDefinition: RegExp): Iterable<string>;
	getWordUntilPosition(position: IPosition, wordDefinition: RegExp): IWordAtPosition;
	getValueInRange(range: IRange): string;
	getWordAtPosition(position: IPosition, wordDefinition: RegExp): Range | null;
	offsetAt(position: IPosition): number;
	positionAt(offset: number): IPosition;
	findMatches(regex: RegExp): RegExpMatchArray[];
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/textModelSync/textModelSync.protocol.ts]---
Location: vscode-main/src/vs/editor/common/services/textModelSync/textModelSync.protocol.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IModelChangedEvent } from '../../model/mirrorTextModel.js';

export interface IWorkerTextModelSyncChannelServer {
	$acceptNewModel(data: IRawModelData): void;

	$acceptModelChanged(strURL: string, e: IModelChangedEvent): void;

	$acceptRemovedModel(strURL: string): void;
}

export interface IRawModelData {
	url: string;
	versionId: number;
	lines: string[];
	EOL: string;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/treeSitter/treeSitterLibraryService.ts]---
Location: vscode-main/src/vs/editor/common/services/treeSitter/treeSitterLibraryService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Language, Parser, Query } from '@vscode/tree-sitter-wasm';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IReader } from '../../../../base/common/observable.js';

export const ITreeSitterLibraryService = createDecorator<ITreeSitterLibraryService>('treeSitterLibraryService');

export interface ITreeSitterLibraryService {
	readonly _serviceBrand: undefined;

	/**
	 * Gets the tree sitter Parser constructor.
	 */
	getParserClass(): Promise<typeof Parser>;

	/**
	 * Checks whether a language is supported and available based setting enablement.
	 * @param languageId The language identifier to check.
	 * @param reader Optional observable reader.
	 */
	supportsLanguage(languageId: string, reader: IReader | undefined): boolean;

	/**
	 * Gets the tree sitter Language object synchronously.
	 * @param languageId The language identifier to retrieve.
	 * @param ignoreSupportsCheck Whether to ignore the supportsLanguage check.
	 * @param reader Optional observable reader.
	 */
	getLanguage(languageId: string, ignoreSupportsCheck: boolean, reader: IReader | undefined): Language | undefined;

	/**
	 * Gets the language as a promise, as opposed to via observables. This ignores the automatic
	 * supportsLanguage check.
	 *
	 * Warning: This approach is generally not recommended as it's not reactive, but it's the only
	 * way to catch and handle import errors when the grammar fails to load.
	 * @param languageId The language identifier to retrieve.
	 */
	getLanguagePromise(languageId: string): Promise<Language | undefined>;

	/**
	 * Gets the injection queries for a language. A return value of `null`
	 * indicates that there are no highlights queries for this language.
	 * @param languageId The language identifier to retrieve queries for.
	 * @param reader Optional observable reader.
	 */
	getInjectionQueries(languageId: string, reader: IReader | undefined): Query | null | undefined;

	/**
	 * Gets the highlighting queries for a language. A return value of `null`
	 * indicates that there are no highlights queries for this language.
	 * @param languageId The language identifier to retrieve queries for.
	 * @param reader Optional observable reader.
	 */
	getHighlightingQueries(languageId: string, reader: IReader | undefined): Query | null | undefined;

	/**
	 * Creates a one-off custom query for a language.
	 * @param language The Language to create the query for.
	 * @param querySource The query source string to compile.
	 */
	createQuery(language: Language, querySource: string): Promise<Query>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/treeSitter/treeSitterThemeService.ts]---
Location: vscode-main/src/vs/editor/common/services/treeSitter/treeSitterThemeService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IObservable, IReader } from '../../../../base/common/observable.js';

export const ITreeSitterThemeService = createDecorator<ITreeSitterThemeService>('treeSitterThemeService');

export interface ITreeSitterThemeService {
	readonly _serviceBrand: undefined;
	readonly onChange: IObservable<void>;

	findMetadata(captureNames: string[], languageId: number, bracket: boolean, reader: IReader | undefined): number;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/standalone/standaloneEnums.ts]---
Location: vscode-main/src/vs/editor/common/standalone/standaloneEnums.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY.


export enum AccessibilitySupport {
	/**
	 * This should be the browser case where it is not known if a screen reader is attached or no.
	 */
	Unknown = 0,
	Disabled = 1,
	Enabled = 2
}

export enum CodeActionTriggerType {
	Invoke = 1,
	Auto = 2
}

export enum CompletionItemInsertTextRule {
	None = 0,
	/**
	 * Adjust whitespace/indentation of multiline insert texts to
	 * match the current line indentation.
	 */
	KeepWhitespace = 1,
	/**
	 * `insertText` is a snippet.
	 */
	InsertAsSnippet = 4
}

export enum CompletionItemKind {
	Method = 0,
	Function = 1,
	Constructor = 2,
	Field = 3,
	Variable = 4,
	Class = 5,
	Struct = 6,
	Interface = 7,
	Module = 8,
	Property = 9,
	Event = 10,
	Operator = 11,
	Unit = 12,
	Value = 13,
	Constant = 14,
	Enum = 15,
	EnumMember = 16,
	Keyword = 17,
	Text = 18,
	Color = 19,
	File = 20,
	Reference = 21,
	Customcolor = 22,
	Folder = 23,
	TypeParameter = 24,
	User = 25,
	Issue = 26,
	Tool = 27,
	Snippet = 28
}

export enum CompletionItemTag {
	Deprecated = 1
}

/**
 * How a suggest provider was triggered.
 */
export enum CompletionTriggerKind {
	Invoke = 0,
	TriggerCharacter = 1,
	TriggerForIncompleteCompletions = 2
}

/**
 * A positioning preference for rendering content widgets.
 */
export enum ContentWidgetPositionPreference {
	/**
	 * Place the content widget exactly at a position
	 */
	EXACT = 0,
	/**
	 * Place the content widget above a position
	 */
	ABOVE = 1,
	/**
	 * Place the content widget below a position
	 */
	BELOW = 2
}

/**
 * Describes the reason the cursor has changed its position.
 */
export enum CursorChangeReason {
	/**
	 * Unknown or not set.
	 */
	NotSet = 0,
	/**
	 * A `model.setValue()` was called.
	 */
	ContentFlush = 1,
	/**
	 * The `model` has been changed outside of this cursor and the cursor recovers its position from associated markers.
	 */
	RecoverFromMarkers = 2,
	/**
	 * There was an explicit user gesture.
	 */
	Explicit = 3,
	/**
	 * There was a Paste.
	 */
	Paste = 4,
	/**
	 * There was an Undo.
	 */
	Undo = 5,
	/**
	 * There was a Redo.
	 */
	Redo = 6
}

/**
 * The default end of line to use when instantiating models.
 */
export enum DefaultEndOfLine {
	/**
	 * Use line feed (\n) as the end of line character.
	 */
	LF = 1,
	/**
	 * Use carriage return and line feed (\r\n) as the end of line character.
	 */
	CRLF = 2
}

/**
 * A document highlight kind.
 */
export enum DocumentHighlightKind {
	/**
	 * A textual occurrence.
	 */
	Text = 0,
	/**
	 * Read-access of a symbol, like reading a variable.
	 */
	Read = 1,
	/**
	 * Write-access of a symbol, like writing to a variable.
	 */
	Write = 2
}

/**
 * Configuration options for auto indentation in the editor
 */
export enum EditorAutoIndentStrategy {
	None = 0,
	Keep = 1,
	Brackets = 2,
	Advanced = 3,
	Full = 4
}

export enum EditorOption {
	acceptSuggestionOnCommitCharacter = 0,
	acceptSuggestionOnEnter = 1,
	accessibilitySupport = 2,
	accessibilityPageSize = 3,
	allowOverflow = 4,
	allowVariableLineHeights = 5,
	allowVariableFonts = 6,
	allowVariableFontsInAccessibilityMode = 7,
	ariaLabel = 8,
	ariaRequired = 9,
	autoClosingBrackets = 10,
	autoClosingComments = 11,
	screenReaderAnnounceInlineSuggestion = 12,
	autoClosingDelete = 13,
	autoClosingOvertype = 14,
	autoClosingQuotes = 15,
	autoIndent = 16,
	autoIndentOnPaste = 17,
	autoIndentOnPasteWithinString = 18,
	automaticLayout = 19,
	autoSurround = 20,
	bracketPairColorization = 21,
	guides = 22,
	codeLens = 23,
	codeLensFontFamily = 24,
	codeLensFontSize = 25,
	colorDecorators = 26,
	colorDecoratorsLimit = 27,
	columnSelection = 28,
	comments = 29,
	contextmenu = 30,
	copyWithSyntaxHighlighting = 31,
	cursorBlinking = 32,
	cursorSmoothCaretAnimation = 33,
	cursorStyle = 34,
	cursorSurroundingLines = 35,
	cursorSurroundingLinesStyle = 36,
	cursorWidth = 37,
	cursorHeight = 38,
	disableLayerHinting = 39,
	disableMonospaceOptimizations = 40,
	domReadOnly = 41,
	dragAndDrop = 42,
	dropIntoEditor = 43,
	editContext = 44,
	emptySelectionClipboard = 45,
	experimentalGpuAcceleration = 46,
	experimentalWhitespaceRendering = 47,
	extraEditorClassName = 48,
	fastScrollSensitivity = 49,
	find = 50,
	fixedOverflowWidgets = 51,
	folding = 52,
	foldingStrategy = 53,
	foldingHighlight = 54,
	foldingImportsByDefault = 55,
	foldingMaximumRegions = 56,
	unfoldOnClickAfterEndOfLine = 57,
	fontFamily = 58,
	fontInfo = 59,
	fontLigatures = 60,
	fontSize = 61,
	fontWeight = 62,
	fontVariations = 63,
	formatOnPaste = 64,
	formatOnType = 65,
	glyphMargin = 66,
	gotoLocation = 67,
	hideCursorInOverviewRuler = 68,
	hover = 69,
	inDiffEditor = 70,
	inlineSuggest = 71,
	letterSpacing = 72,
	lightbulb = 73,
	lineDecorationsWidth = 74,
	lineHeight = 75,
	lineNumbers = 76,
	lineNumbersMinChars = 77,
	linkedEditing = 78,
	links = 79,
	matchBrackets = 80,
	minimap = 81,
	mouseStyle = 82,
	mouseWheelScrollSensitivity = 83,
	mouseWheelZoom = 84,
	multiCursorMergeOverlapping = 85,
	multiCursorModifier = 86,
	mouseMiddleClickAction = 87,
	multiCursorPaste = 88,
	multiCursorLimit = 89,
	occurrencesHighlight = 90,
	occurrencesHighlightDelay = 91,
	overtypeCursorStyle = 92,
	overtypeOnPaste = 93,
	overviewRulerBorder = 94,
	overviewRulerLanes = 95,
	padding = 96,
	pasteAs = 97,
	parameterHints = 98,
	peekWidgetDefaultFocus = 99,
	placeholder = 100,
	definitionLinkOpensInPeek = 101,
	quickSuggestions = 102,
	quickSuggestionsDelay = 103,
	readOnly = 104,
	readOnlyMessage = 105,
	renameOnType = 106,
	renderRichScreenReaderContent = 107,
	renderControlCharacters = 108,
	renderFinalNewline = 109,
	renderLineHighlight = 110,
	renderLineHighlightOnlyWhenFocus = 111,
	renderValidationDecorations = 112,
	renderWhitespace = 113,
	revealHorizontalRightPadding = 114,
	roundedSelection = 115,
	rulers = 116,
	scrollbar = 117,
	scrollBeyondLastColumn = 118,
	scrollBeyondLastLine = 119,
	scrollPredominantAxis = 120,
	selectionClipboard = 121,
	selectionHighlight = 122,
	selectionHighlightMaxLength = 123,
	selectionHighlightMultiline = 124,
	selectOnLineNumbers = 125,
	showFoldingControls = 126,
	showUnused = 127,
	snippetSuggestions = 128,
	smartSelect = 129,
	smoothScrolling = 130,
	stickyScroll = 131,
	stickyTabStops = 132,
	stopRenderingLineAfter = 133,
	suggest = 134,
	suggestFontSize = 135,
	suggestLineHeight = 136,
	suggestOnTriggerCharacters = 137,
	suggestSelection = 138,
	tabCompletion = 139,
	tabIndex = 140,
	trimWhitespaceOnDelete = 141,
	unicodeHighlighting = 142,
	unusualLineTerminators = 143,
	useShadowDOM = 144,
	useTabStops = 145,
	wordBreak = 146,
	wordSegmenterLocales = 147,
	wordSeparators = 148,
	wordWrap = 149,
	wordWrapBreakAfterCharacters = 150,
	wordWrapBreakBeforeCharacters = 151,
	wordWrapColumn = 152,
	wordWrapOverride1 = 153,
	wordWrapOverride2 = 154,
	wrappingIndent = 155,
	wrappingStrategy = 156,
	showDeprecated = 157,
	inertialScroll = 158,
	inlayHints = 159,
	wrapOnEscapedLineFeeds = 160,
	effectiveCursorStyle = 161,
	editorClassName = 162,
	pixelRatio = 163,
	tabFocusMode = 164,
	layoutInfo = 165,
	wrappingInfo = 166,
	defaultColorDecorators = 167,
	colorDecoratorsActivatedOn = 168,
	inlineCompletionsAccessibilityVerbose = 169,
	effectiveEditContext = 170,
	scrollOnMiddleClick = 171,
	effectiveAllowVariableFonts = 172
}

/**
 * End of line character preference.
 */
export enum EndOfLinePreference {
	/**
	 * Use the end of line character identified in the text buffer.
	 */
	TextDefined = 0,
	/**
	 * Use line feed (\n) as the end of line character.
	 */
	LF = 1,
	/**
	 * Use carriage return and line feed (\r\n) as the end of line character.
	 */
	CRLF = 2
}

/**
 * End of line character preference.
 */
export enum EndOfLineSequence {
	/**
	 * Use line feed (\n) as the end of line character.
	 */
	LF = 0,
	/**
	 * Use carriage return and line feed (\r\n) as the end of line character.
	 */
	CRLF = 1
}

/**
 * Vertical Lane in the glyph margin of the editor.
 */
export enum GlyphMarginLane {
	Left = 1,
	Center = 2,
	Right = 3
}

export enum HoverVerbosityAction {
	/**
	 * Increase the verbosity of the hover
	 */
	Increase = 0,
	/**
	 * Decrease the verbosity of the hover
	 */
	Decrease = 1
}

/**
 * Describes what to do with the indentation when pressing Enter.
 */
export enum IndentAction {
	/**
	 * Insert new line and copy the previous line's indentation.
	 */
	None = 0,
	/**
	 * Insert new line and indent once (relative to the previous line's indentation).
	 */
	Indent = 1,
	/**
	 * Insert two new lines:
	 *  - the first one indented which will hold the cursor
	 *  - the second one at the same indentation level
	 */
	IndentOutdent = 2,
	/**
	 * Insert new line and outdent once (relative to the previous line's indentation).
	 */
	Outdent = 3
}

export enum InjectedTextCursorStops {
	Both = 0,
	Right = 1,
	Left = 2,
	None = 3
}

export enum InlayHintKind {
	Type = 1,
	Parameter = 2
}

export enum InlineCompletionEndOfLifeReasonKind {
	Accepted = 0,
	Rejected = 1,
	Ignored = 2
}

export enum InlineCompletionHintStyle {
	Code = 1,
	Label = 2
}

/**
 * How an {@link InlineCompletionsProvider inline completion provider} was triggered.
 */
export enum InlineCompletionTriggerKind {
	/**
	 * Completion was triggered automatically while editing.
	 * It is sufficient to return a single completion item in this case.
	 */
	Automatic = 0,
	/**
	 * Completion was triggered explicitly by a user gesture.
	 * Return multiple completion items to enable cycling through them.
	 */
	Explicit = 1
}
/**
 * Virtual Key Codes, the value does not hold any inherent meaning.
 * Inspired somewhat from https://msdn.microsoft.com/en-us/library/windows/desktop/dd375731(v=vs.85).aspx
 * But these are "more general", as they should work across browsers & OS`s.
 */
export enum KeyCode {
	DependsOnKbLayout = -1,
	/**
	 * Placed first to cover the 0 value of the enum.
	 */
	Unknown = 0,
	Backspace = 1,
	Tab = 2,
	Enter = 3,
	Shift = 4,
	Ctrl = 5,
	Alt = 6,
	PauseBreak = 7,
	CapsLock = 8,
	Escape = 9,
	Space = 10,
	PageUp = 11,
	PageDown = 12,
	End = 13,
	Home = 14,
	LeftArrow = 15,
	UpArrow = 16,
	RightArrow = 17,
	DownArrow = 18,
	Insert = 19,
	Delete = 20,
	Digit0 = 21,
	Digit1 = 22,
	Digit2 = 23,
	Digit3 = 24,
	Digit4 = 25,
	Digit5 = 26,
	Digit6 = 27,
	Digit7 = 28,
	Digit8 = 29,
	Digit9 = 30,
	KeyA = 31,
	KeyB = 32,
	KeyC = 33,
	KeyD = 34,
	KeyE = 35,
	KeyF = 36,
	KeyG = 37,
	KeyH = 38,
	KeyI = 39,
	KeyJ = 40,
	KeyK = 41,
	KeyL = 42,
	KeyM = 43,
	KeyN = 44,
	KeyO = 45,
	KeyP = 46,
	KeyQ = 47,
	KeyR = 48,
	KeyS = 49,
	KeyT = 50,
	KeyU = 51,
	KeyV = 52,
	KeyW = 53,
	KeyX = 54,
	KeyY = 55,
	KeyZ = 56,
	Meta = 57,
	ContextMenu = 58,
	F1 = 59,
	F2 = 60,
	F3 = 61,
	F4 = 62,
	F5 = 63,
	F6 = 64,
	F7 = 65,
	F8 = 66,
	F9 = 67,
	F10 = 68,
	F11 = 69,
	F12 = 70,
	F13 = 71,
	F14 = 72,
	F15 = 73,
	F16 = 74,
	F17 = 75,
	F18 = 76,
	F19 = 77,
	F20 = 78,
	F21 = 79,
	F22 = 80,
	F23 = 81,
	F24 = 82,
	NumLock = 83,
	ScrollLock = 84,
	/**
	 * Used for miscellaneous characters; it can vary by keyboard.
	 * For the US standard keyboard, the ';:' key
	 */
	Semicolon = 85,
	/**
	 * For any country/region, the '+' key
	 * For the US standard keyboard, the '=+' key
	 */
	Equal = 86,
	/**
	 * For any country/region, the ',' key
	 * For the US standard keyboard, the ',<' key
	 */
	Comma = 87,
	/**
	 * For any country/region, the '-' key
	 * For the US standard keyboard, the '-_' key
	 */
	Minus = 88,
	/**
	 * For any country/region, the '.' key
	 * For the US standard keyboard, the '.>' key
	 */
	Period = 89,
	/**
	 * Used for miscellaneous characters; it can vary by keyboard.
	 * For the US standard keyboard, the '/?' key
	 */
	Slash = 90,
	/**
	 * Used for miscellaneous characters; it can vary by keyboard.
	 * For the US standard keyboard, the '`~' key
	 */
	Backquote = 91,
	/**
	 * Used for miscellaneous characters; it can vary by keyboard.
	 * For the US standard keyboard, the '[{' key
	 */
	BracketLeft = 92,
	/**
	 * Used for miscellaneous characters; it can vary by keyboard.
	 * For the US standard keyboard, the '\|' key
	 */
	Backslash = 93,
	/**
	 * Used for miscellaneous characters; it can vary by keyboard.
	 * For the US standard keyboard, the ']}' key
	 */
	BracketRight = 94,
	/**
	 * Used for miscellaneous characters; it can vary by keyboard.
	 * For the US standard keyboard, the ''"' key
	 */
	Quote = 95,
	/**
	 * Used for miscellaneous characters; it can vary by keyboard.
	 */
	OEM_8 = 96,
	/**
	 * Either the angle bracket key or the backslash key on the RT 102-key keyboard.
	 */
	IntlBackslash = 97,
	Numpad0 = 98,// VK_NUMPAD0, 0x60, Numeric keypad 0 key
	Numpad1 = 99,// VK_NUMPAD1, 0x61, Numeric keypad 1 key
	Numpad2 = 100,// VK_NUMPAD2, 0x62, Numeric keypad 2 key
	Numpad3 = 101,// VK_NUMPAD3, 0x63, Numeric keypad 3 key
	Numpad4 = 102,// VK_NUMPAD4, 0x64, Numeric keypad 4 key
	Numpad5 = 103,// VK_NUMPAD5, 0x65, Numeric keypad 5 key
	Numpad6 = 104,// VK_NUMPAD6, 0x66, Numeric keypad 6 key
	Numpad7 = 105,// VK_NUMPAD7, 0x67, Numeric keypad 7 key
	Numpad8 = 106,// VK_NUMPAD8, 0x68, Numeric keypad 8 key
	Numpad9 = 107,// VK_NUMPAD9, 0x69, Numeric keypad 9 key
	NumpadMultiply = 108,// VK_MULTIPLY, 0x6A, Multiply key
	NumpadAdd = 109,// VK_ADD, 0x6B, Add key
	NUMPAD_SEPARATOR = 110,// VK_SEPARATOR, 0x6C, Separator key
	NumpadSubtract = 111,// VK_SUBTRACT, 0x6D, Subtract key
	NumpadDecimal = 112,// VK_DECIMAL, 0x6E, Decimal key
	NumpadDivide = 113,// VK_DIVIDE, 0x6F,
	/**
	 * Cover all key codes when IME is processing input.
	 */
	KEY_IN_COMPOSITION = 114,
	ABNT_C1 = 115,// Brazilian (ABNT) Keyboard
	ABNT_C2 = 116,// Brazilian (ABNT) Keyboard
	AudioVolumeMute = 117,
	AudioVolumeUp = 118,
	AudioVolumeDown = 119,
	BrowserSearch = 120,
	BrowserHome = 121,
	BrowserBack = 122,
	BrowserForward = 123,
	MediaTrackNext = 124,
	MediaTrackPrevious = 125,
	MediaStop = 126,
	MediaPlayPause = 127,
	LaunchMediaPlayer = 128,
	LaunchMail = 129,
	LaunchApp2 = 130,
	/**
	 * VK_CLEAR, 0x0C, CLEAR key
	 */
	Clear = 131,
	/**
	 * Placed last to cover the length of the enum.
	 * Please do not depend on this value!
	 */
	MAX_VALUE = 132
}

export enum MarkerSeverity {
	Hint = 1,
	Info = 2,
	Warning = 4,
	Error = 8
}

export enum MarkerTag {
	Unnecessary = 1,
	Deprecated = 2
}

/**
 * Position in the minimap to render the decoration.
 */
export enum MinimapPosition {
	Inline = 1,
	Gutter = 2
}

/**
 * Section header style.
 */
export enum MinimapSectionHeaderStyle {
	Normal = 1,
	Underlined = 2
}

/**
 * Type of hit element with the mouse in the editor.
 */
export enum MouseTargetType {
	/**
	 * Mouse is on top of an unknown element.
	 */
	UNKNOWN = 0,
	/**
	 * Mouse is on top of the textarea used for input.
	 */
	TEXTAREA = 1,
	/**
	 * Mouse is on top of the glyph margin
	 */
	GUTTER_GLYPH_MARGIN = 2,
	/**
	 * Mouse is on top of the line numbers
	 */
	GUTTER_LINE_NUMBERS = 3,
	/**
	 * Mouse is on top of the line decorations
	 */
	GUTTER_LINE_DECORATIONS = 4,
	/**
	 * Mouse is on top of the whitespace left in the gutter by a view zone.
	 */
	GUTTER_VIEW_ZONE = 5,
	/**
	 * Mouse is on top of text in the content.
	 */
	CONTENT_TEXT = 6,
	/**
	 * Mouse is on top of empty space in the content (e.g. after line text or below last line)
	 */
	CONTENT_EMPTY = 7,
	/**
	 * Mouse is on top of a view zone in the content.
	 */
	CONTENT_VIEW_ZONE = 8,
	/**
	 * Mouse is on top of a content widget.
	 */
	CONTENT_WIDGET = 9,
	/**
	 * Mouse is on top of the decorations overview ruler.
	 */
	OVERVIEW_RULER = 10,
	/**
	 * Mouse is on top of a scrollbar.
	 */
	SCROLLBAR = 11,
	/**
	 * Mouse is on top of an overlay widget.
	 */
	OVERLAY_WIDGET = 12,
	/**
	 * Mouse is outside of the editor.
	 */
	OUTSIDE_EDITOR = 13
}

export enum NewSymbolNameTag {
	AIGenerated = 1
}

export enum NewSymbolNameTriggerKind {
	Invoke = 0,
	Automatic = 1
}

/**
 * A positioning preference for rendering overlay widgets.
 */
export enum OverlayWidgetPositionPreference {
	/**
	 * Position the overlay widget in the top right corner
	 */
	TOP_RIGHT_CORNER = 0,
	/**
	 * Position the overlay widget in the bottom right corner
	 */
	BOTTOM_RIGHT_CORNER = 1,
	/**
	 * Position the overlay widget in the top center
	 */
	TOP_CENTER = 2
}

/**
 * Vertical Lane in the overview ruler of the editor.
 */
export enum OverviewRulerLane {
	Left = 1,
	Center = 2,
	Right = 4,
	Full = 7
}

/**
 * How a partial acceptance was triggered.
 */
export enum PartialAcceptTriggerKind {
	Word = 0,
	Line = 1,
	Suggest = 2
}

export enum PositionAffinity {
	/**
	 * Prefers the left most position.
	*/
	Left = 0,
	/**
	 * Prefers the right most position.
	*/
	Right = 1,
	/**
	 * No preference.
	*/
	None = 2,
	/**
	 * If the given position is on injected text, prefers the position left of it.
	*/
	LeftOfInjectedText = 3,
	/**
	 * If the given position is on injected text, prefers the position right of it.
	*/
	RightOfInjectedText = 4
}

export enum RenderLineNumbersType {
	Off = 0,
	On = 1,
	Relative = 2,
	Interval = 3,
	Custom = 4
}

export enum RenderMinimap {
	None = 0,
	Text = 1,
	Blocks = 2
}

export enum ScrollType {
	Smooth = 0,
	Immediate = 1
}

export enum ScrollbarVisibility {
	Auto = 1,
	Hidden = 2,
	Visible = 3
}

/**
 * The direction of a selection.
 */
export enum SelectionDirection {
	/**
	 * The selection starts above where it ends.
	 */
	LTR = 0,
	/**
	 * The selection starts below where it ends.
	 */
	RTL = 1
}

export enum ShowLightbulbIconMode {
	Off = 'off',
	OnCode = 'onCode',
	On = 'on'
}

export enum SignatureHelpTriggerKind {
	Invoke = 1,
	TriggerCharacter = 2,
	ContentChange = 3
}

/**
 * A symbol kind.
 */
export enum SymbolKind {
	File = 0,
	Module = 1,
	Namespace = 2,
	Package = 3,
	Class = 4,
	Method = 5,
	Property = 6,
	Field = 7,
	Constructor = 8,
	Enum = 9,
	Interface = 10,
	Function = 11,
	Variable = 12,
	Constant = 13,
	String = 14,
	Number = 15,
	Boolean = 16,
	Array = 17,
	Object = 18,
	Key = 19,
	Null = 20,
	EnumMember = 21,
	Struct = 22,
	Event = 23,
	Operator = 24,
	TypeParameter = 25
}

export enum SymbolTag {
	Deprecated = 1
}

/**
 * Text Direction for a decoration.
 */
export enum TextDirection {
	LTR = 0,
	RTL = 1
}

/**
 * The kind of animation in which the editor's cursor should be rendered.
 */
export enum TextEditorCursorBlinkingStyle {
	/**
	 * Hidden
	 */
	Hidden = 0,
	/**
	 * Blinking
	 */
	Blink = 1,
	/**
	 * Blinking with smooth fading
	 */
	Smooth = 2,
	/**
	 * Blinking with prolonged filled state and smooth fading
	 */
	Phase = 3,
	/**
	 * Expand collapse animation on the y axis
	 */
	Expand = 4,
	/**
	 * No-Blinking
	 */
	Solid = 5
}

/**
 * The style in which the editor's cursor should be rendered.
 */
export enum TextEditorCursorStyle {
	/**
	 * As a vertical line (sitting between two characters).
	 */
	Line = 1,
	/**
	 * As a block (sitting on top of a character).
	 */
	Block = 2,
	/**
	 * As a horizontal line (sitting under a character).
	 */
	Underline = 3,
	/**
	 * As a thin vertical line (sitting between two characters).
	 */
	LineThin = 4,
	/**
	 * As an outlined block (sitting on top of a character).
	 */
	BlockOutline = 5,
	/**
	 * As a thin horizontal line (sitting under a character).
	 */
	UnderlineThin = 6
}

/**
 * Describes the behavior of decorations when typing/editing near their edges.
 * Note: Please do not edit the values, as they very carefully match `DecorationRangeBehavior`
 */
export enum TrackedRangeStickiness {
	AlwaysGrowsWhenTypingAtEdges = 0,
	NeverGrowsWhenTypingAtEdges = 1,
	GrowsOnlyWhenTypingBefore = 2,
	GrowsOnlyWhenTypingAfter = 3
}

/**
 * Describes how to indent wrapped lines.
 */
export enum WrappingIndent {
	/**
	 * No indentation => wrapped lines begin at column 1.
	 */
	None = 0,
	/**
	 * Same => wrapped lines get the same indentation as the parent.
	 */
	Same = 1,
	/**
	 * Indent => wrapped lines get +1 indentation toward the parent.
	 */
	Indent = 2,
	/**
	 * DeepIndent => wrapped lines get +2 indentation toward the parent.
	 */
	DeepIndent = 3
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/tokens/common.ts]---
Location: vscode-main/src/vs/editor/common/tokens/common.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export class RateLimiter {
	private _lastRun: number;
	private readonly _minimumTimeBetweenRuns: number;

	constructor(public readonly timesPerSecond: number = 5) {
		this._lastRun = 0;
		this._minimumTimeBetweenRuns = 1000 / timesPerSecond;
	}

	public runIfNotLimited(callback: () => void): void {
		const now = Date.now();
		if (now - this._lastRun >= this._minimumTimeBetweenRuns) {
			this._lastRun = now;
			callback();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/tokens/contiguousMultilineTokens.ts]---
Location: vscode-main/src/vs/editor/common/tokens/contiguousMultilineTokens.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as arrays from '../../../base/common/arrays.js';
import { readUInt32BE, writeUInt32BE } from '../../../base/common/buffer.js';
import { Position } from '../core/position.js';
import { IRange } from '../core/range.js';
import { countEOL } from '../core/misc/eolCounter.js';
import { ContiguousTokensEditing } from './contiguousTokensEditing.js';
import { LineRange } from '../core/ranges/lineRange.js';

/**
 * Represents contiguous tokens over a contiguous range of lines.
 */
export class ContiguousMultilineTokens {
	public static deserialize(buff: Uint8Array, offset: number, result: ContiguousMultilineTokens[]): number {
		const view32 = new Uint32Array(buff.buffer);
		const startLineNumber = readUInt32BE(buff, offset); offset += 4;
		const count = readUInt32BE(buff, offset); offset += 4;
		const tokens: Uint32Array[] = [];
		for (let i = 0; i < count; i++) {
			const byteCount = readUInt32BE(buff, offset); offset += 4;
			tokens.push(view32.subarray(offset / 4, offset / 4 + byteCount / 4));
			offset += byteCount;
		}
		result.push(new ContiguousMultilineTokens(startLineNumber, tokens));
		return offset;
	}

	/**
	 * The start line number for this block of tokens.
	 */
	private _startLineNumber: number;

	/**
	 * The tokens are stored in a binary format. There is an element for each line,
	 * so `tokens[index]` contains all tokens on line `startLineNumber + index`.
	 *
	 * On a specific line, each token occupies two array indices. For token i:
	 *  - at offset 2*i => endOffset
	 *  - at offset 2*i + 1 => metadata
	 *
	 */
	private _tokens: (Uint32Array | ArrayBuffer | null)[];

	/**
	 * (Inclusive) start line number for these tokens.
	 */
	public get startLineNumber(): number {
		return this._startLineNumber;
	}

	/**
	 * (Inclusive) end line number for these tokens.
	 */
	public get endLineNumber(): number {
		return this._startLineNumber + this._tokens.length - 1;
	}

	constructor(startLineNumber: number, tokens: Uint32Array[]) {
		this._startLineNumber = startLineNumber;
		this._tokens = tokens;
	}

	getLineRange(): LineRange {
		return new LineRange(this._startLineNumber, this._startLineNumber + this._tokens.length);
	}

	/**
	 * @see {@link _tokens}
	 */
	public getLineTokens(lineNumber: number): Uint32Array | ArrayBuffer | null {
		return this._tokens[lineNumber - this._startLineNumber];
	}

	public appendLineTokens(lineTokens: Uint32Array): void {
		this._tokens.push(lineTokens);
	}

	public serializeSize(): number {
		let result = 0;
		result += 4; // 4 bytes for the start line number
		result += 4; // 4 bytes for the line count
		for (let i = 0; i < this._tokens.length; i++) {
			const lineTokens = this._tokens[i];
			if (!(lineTokens instanceof Uint32Array)) {
				throw new Error(`Not supported!`);
			}
			result += 4; // 4 bytes for the byte count
			result += lineTokens.byteLength;
		}
		return result;
	}

	public serialize(destination: Uint8Array, offset: number): number {
		writeUInt32BE(destination, this._startLineNumber, offset); offset += 4;
		writeUInt32BE(destination, this._tokens.length, offset); offset += 4;
		for (let i = 0; i < this._tokens.length; i++) {
			const lineTokens = this._tokens[i];
			if (!(lineTokens instanceof Uint32Array)) {
				throw new Error(`Not supported!`);
			}
			writeUInt32BE(destination, lineTokens.byteLength, offset); offset += 4;
			destination.set(new Uint8Array(lineTokens.buffer), offset); offset += lineTokens.byteLength;
		}
		return offset;
	}

	public applyEdit(range: IRange, text: string): void {
		const [eolCount, firstLineLength] = countEOL(text);
		this._acceptDeleteRange(range);
		this._acceptInsertText(new Position(range.startLineNumber, range.startColumn), eolCount, firstLineLength);
	}

	private _acceptDeleteRange(range: IRange): void {
		if (range.startLineNumber === range.endLineNumber && range.startColumn === range.endColumn) {
			// Nothing to delete
			return;
		}

		const firstLineIndex = range.startLineNumber - this._startLineNumber;
		const lastLineIndex = range.endLineNumber - this._startLineNumber;

		if (lastLineIndex < 0) {
			// this deletion occurs entirely before this block, so we only need to adjust line numbers
			const deletedLinesCount = lastLineIndex - firstLineIndex;
			this._startLineNumber -= deletedLinesCount;
			return;
		}

		if (firstLineIndex >= this._tokens.length) {
			// this deletion occurs entirely after this block, so there is nothing to do
			return;
		}

		if (firstLineIndex < 0 && lastLineIndex >= this._tokens.length) {
			// this deletion completely encompasses this block
			this._startLineNumber = 0;
			this._tokens = [];
			return;
		}

		if (firstLineIndex === lastLineIndex) {
			// a delete on a single line
			this._tokens[firstLineIndex] = ContiguousTokensEditing.delete(this._tokens[firstLineIndex], range.startColumn - 1, range.endColumn - 1);
			return;
		}

		if (firstLineIndex >= 0) {
			// The first line survives
			this._tokens[firstLineIndex] = ContiguousTokensEditing.deleteEnding(this._tokens[firstLineIndex], range.startColumn - 1);

			if (lastLineIndex < this._tokens.length) {
				// The last line survives
				const lastLineTokens = ContiguousTokensEditing.deleteBeginning(this._tokens[lastLineIndex], range.endColumn - 1);

				// Take remaining text on last line and append it to remaining text on first line
				this._tokens[firstLineIndex] = ContiguousTokensEditing.append(this._tokens[firstLineIndex], lastLineTokens);

				// Delete middle lines
				this._tokens.splice(firstLineIndex + 1, lastLineIndex - firstLineIndex);
			} else {
				// The last line does not survive

				// Take remaining text on last line and append it to remaining text on first line
				this._tokens[firstLineIndex] = ContiguousTokensEditing.append(this._tokens[firstLineIndex], null);

				// Delete lines
				this._tokens = this._tokens.slice(0, firstLineIndex + 1);
			}
		} else {
			// The first line does not survive

			const deletedBefore = -firstLineIndex;
			this._startLineNumber -= deletedBefore;

			// Remove beginning from last line
			this._tokens[lastLineIndex] = ContiguousTokensEditing.deleteBeginning(this._tokens[lastLineIndex], range.endColumn - 1);

			// Delete lines
			this._tokens = this._tokens.slice(lastLineIndex);
		}
	}

	private _acceptInsertText(position: Position, eolCount: number, firstLineLength: number): void {

		if (eolCount === 0 && firstLineLength === 0) {
			// Nothing to insert
			return;
		}

		const lineIndex = position.lineNumber - this._startLineNumber;

		if (lineIndex < 0) {
			// this insertion occurs before this block, so we only need to adjust line numbers
			this._startLineNumber += eolCount;
			return;
		}

		if (lineIndex >= this._tokens.length) {
			// this insertion occurs after this block, so there is nothing to do
			return;
		}

		if (eolCount === 0) {
			// Inserting text on one line
			this._tokens[lineIndex] = ContiguousTokensEditing.insert(this._tokens[lineIndex], position.column - 1, firstLineLength);
			return;
		}

		this._tokens[lineIndex] = ContiguousTokensEditing.deleteEnding(this._tokens[lineIndex], position.column - 1);
		this._tokens[lineIndex] = ContiguousTokensEditing.insert(this._tokens[lineIndex], position.column - 1, firstLineLength);

		this._insertLines(position.lineNumber, eolCount);
	}

	private _insertLines(insertIndex: number, insertCount: number): void {
		if (insertCount === 0) {
			return;
		}
		const lineTokens: (Uint32Array | ArrayBuffer | null)[] = [];
		for (let i = 0; i < insertCount; i++) {
			lineTokens[i] = null;
		}
		this._tokens = arrays.arrayInsert(this._tokens, insertIndex, lineTokens);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/tokens/contiguousMultilineTokensBuilder.ts]---
Location: vscode-main/src/vs/editor/common/tokens/contiguousMultilineTokensBuilder.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { readUInt32BE, writeUInt32BE } from '../../../base/common/buffer.js';
import { ContiguousMultilineTokens } from './contiguousMultilineTokens.js';

export class ContiguousMultilineTokensBuilder {

	public static deserialize(buff: Uint8Array): ContiguousMultilineTokens[] {
		let offset = 0;
		const count = readUInt32BE(buff, offset); offset += 4;
		const result: ContiguousMultilineTokens[] = [];
		for (let i = 0; i < count; i++) {
			offset = ContiguousMultilineTokens.deserialize(buff, offset, result);
		}
		return result;
	}

	private readonly _tokens: ContiguousMultilineTokens[];

	constructor() {
		this._tokens = [];
	}

	public add(lineNumber: number, lineTokens: Uint32Array): void {
		if (this._tokens.length > 0) {
			const last = this._tokens[this._tokens.length - 1];
			if (last.endLineNumber + 1 === lineNumber) {
				// append
				last.appendLineTokens(lineTokens);
				return;
			}
		}
		this._tokens.push(new ContiguousMultilineTokens(lineNumber, [lineTokens]));
	}

	public finalize(): ContiguousMultilineTokens[] {
		return this._tokens;
	}

	public serialize(): Uint8Array {
		const size = this._serializeSize();
		const result = new Uint8Array(size);
		this._serialize(result);
		return result;
	}

	private _serializeSize(): number {
		let result = 0;
		result += 4; // 4 bytes for the count
		for (let i = 0; i < this._tokens.length; i++) {
			result += this._tokens[i].serializeSize();
		}
		return result;
	}

	private _serialize(destination: Uint8Array): void {
		let offset = 0;
		writeUInt32BE(destination, this._tokens.length, offset); offset += 4;
		for (let i = 0; i < this._tokens.length; i++) {
			offset = this._tokens[i].serialize(destination, offset);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/tokens/contiguousTokensEditing.ts]---
Location: vscode-main/src/vs/editor/common/tokens/contiguousTokensEditing.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LineTokens } from './lineTokens.js';

export const EMPTY_LINE_TOKENS = (new Uint32Array(0)).buffer;

export class ContiguousTokensEditing {

	public static deleteBeginning(lineTokens: Uint32Array | ArrayBuffer | null, toChIndex: number): Uint32Array | ArrayBuffer | null {
		if (lineTokens === null || lineTokens === EMPTY_LINE_TOKENS) {
			return lineTokens;
		}
		return ContiguousTokensEditing.delete(lineTokens, 0, toChIndex);
	}

	public static deleteEnding(lineTokens: Uint32Array | ArrayBuffer | null, fromChIndex: number): Uint32Array | ArrayBuffer | null {
		if (lineTokens === null || lineTokens === EMPTY_LINE_TOKENS) {
			return lineTokens;
		}

		const tokens = toUint32Array(lineTokens);
		const lineTextLength = tokens[tokens.length - 2];
		return ContiguousTokensEditing.delete(lineTokens, fromChIndex, lineTextLength);
	}

	public static delete(lineTokens: Uint32Array | ArrayBuffer | null, fromChIndex: number, toChIndex: number): Uint32Array | ArrayBuffer | null {
		if (lineTokens === null || lineTokens === EMPTY_LINE_TOKENS || fromChIndex === toChIndex) {
			return lineTokens;
		}

		const tokens = toUint32Array(lineTokens);
		const tokensCount = (tokens.length >>> 1);

		// special case: deleting everything
		if (fromChIndex === 0 && tokens[tokens.length - 2] === toChIndex) {
			return EMPTY_LINE_TOKENS;
		}

		const fromTokenIndex = LineTokens.findIndexInTokensArray(tokens, fromChIndex);
		const fromTokenStartOffset = (fromTokenIndex > 0 ? tokens[(fromTokenIndex - 1) << 1] : 0);
		const fromTokenEndOffset = tokens[fromTokenIndex << 1];

		if (toChIndex < fromTokenEndOffset) {
			// the delete range is inside a single token
			const delta = (toChIndex - fromChIndex);
			for (let i = fromTokenIndex; i < tokensCount; i++) {
				tokens[i << 1] -= delta;
			}
			return lineTokens;
		}

		let dest: number;
		let lastEnd: number;
		if (fromTokenStartOffset !== fromChIndex) {
			tokens[fromTokenIndex << 1] = fromChIndex;
			dest = ((fromTokenIndex + 1) << 1);
			lastEnd = fromChIndex;
		} else {
			dest = (fromTokenIndex << 1);
			lastEnd = fromTokenStartOffset;
		}

		const delta = (toChIndex - fromChIndex);
		for (let tokenIndex = fromTokenIndex + 1; tokenIndex < tokensCount; tokenIndex++) {
			const tokenEndOffset = tokens[tokenIndex << 1] - delta;
			if (tokenEndOffset > lastEnd) {
				tokens[dest++] = tokenEndOffset;
				tokens[dest++] = tokens[(tokenIndex << 1) + 1];
				lastEnd = tokenEndOffset;
			}
		}

		if (dest === tokens.length) {
			// nothing to trim
			return lineTokens;
		}

		const tmp = new Uint32Array(dest);
		tmp.set(tokens.subarray(0, dest), 0);
		return tmp.buffer;
	}

	public static append(lineTokens: Uint32Array | ArrayBuffer | null, _otherTokens: Uint32Array | ArrayBuffer | null): Uint32Array | ArrayBuffer | null {
		if (_otherTokens === EMPTY_LINE_TOKENS) {
			return lineTokens;
		}
		if (lineTokens === EMPTY_LINE_TOKENS) {
			return _otherTokens;
		}
		if (lineTokens === null) {
			return lineTokens;
		}
		if (_otherTokens === null) {
			// cannot determine combined line length...
			return null;
		}
		const myTokens = toUint32Array(lineTokens);
		const otherTokens = toUint32Array(_otherTokens);
		const otherTokensCount = (otherTokens.length >>> 1);

		const result = new Uint32Array(myTokens.length + otherTokens.length);
		result.set(myTokens, 0);
		let dest = myTokens.length;
		const delta = myTokens[myTokens.length - 2];
		for (let i = 0; i < otherTokensCount; i++) {
			result[dest++] = otherTokens[(i << 1)] + delta;
			result[dest++] = otherTokens[(i << 1) + 1];
		}
		return result.buffer;
	}

	public static insert(lineTokens: Uint32Array | ArrayBuffer | null, chIndex: number, textLength: number): Uint32Array | ArrayBuffer | null {
		if (lineTokens === null || lineTokens === EMPTY_LINE_TOKENS) {
			// nothing to do
			return lineTokens;
		}

		const tokens = toUint32Array(lineTokens);
		const tokensCount = (tokens.length >>> 1);

		let fromTokenIndex = LineTokens.findIndexInTokensArray(tokens, chIndex);
		if (fromTokenIndex > 0) {
			const fromTokenStartOffset = tokens[(fromTokenIndex - 1) << 1];
			if (fromTokenStartOffset === chIndex) {
				fromTokenIndex--;
			}
		}
		for (let tokenIndex = fromTokenIndex; tokenIndex < tokensCount; tokenIndex++) {
			tokens[tokenIndex << 1] += textLength;
		}
		return lineTokens;
	}
}

export function toUint32Array(arr: Uint32Array | ArrayBuffer): Uint32Array<ArrayBuffer> {
	if (arr instanceof Uint32Array) {
		return arr as Uint32Array<ArrayBuffer>;
	} else {
		return new Uint32Array<ArrayBuffer>(arr);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/tokens/contiguousTokensStore.ts]---
Location: vscode-main/src/vs/editor/common/tokens/contiguousTokensStore.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as arrays from '../../../base/common/arrays.js';
import { Position } from '../core/position.js';
import { IRange } from '../core/range.js';
import { ContiguousTokensEditing, EMPTY_LINE_TOKENS, toUint32Array } from './contiguousTokensEditing.js';
import { LineTokens } from './lineTokens.js';
import { ILanguageIdCodec } from '../languages.js';
import { LanguageId, FontStyle, ColorId, StandardTokenType, MetadataConsts, TokenMetadata } from '../encodedTokenAttributes.js';
import { ITextModel } from '../model.js';
import { ContiguousMultilineTokens } from './contiguousMultilineTokens.js';

/**
 * Represents contiguous tokens in a text model.
 */
export class ContiguousTokensStore {
	private _lineTokens: (Uint32Array | ArrayBuffer | null)[];
	private _len: number;
	private readonly _languageIdCodec: ILanguageIdCodec;

	constructor(languageIdCodec: ILanguageIdCodec) {
		this._lineTokens = [];
		this._len = 0;
		this._languageIdCodec = languageIdCodec;
	}

	public flush(): void {
		this._lineTokens = [];
		this._len = 0;
	}

	get hasTokens(): boolean {
		return this._lineTokens.length > 0;
	}

	public getTokens(topLevelLanguageId: string, lineIndex: number, lineText: string): LineTokens {
		let rawLineTokens: Uint32Array | ArrayBuffer | null = null;
		if (lineIndex < this._len) {
			rawLineTokens = this._lineTokens[lineIndex];
		}

		if (rawLineTokens !== null && rawLineTokens !== EMPTY_LINE_TOKENS) {
			return new LineTokens(toUint32Array(rawLineTokens), lineText, this._languageIdCodec);
		}

		const lineTokens = new Uint32Array(2);
		lineTokens[0] = lineText.length;
		lineTokens[1] = getDefaultMetadata(this._languageIdCodec.encodeLanguageId(topLevelLanguageId));
		return new LineTokens(lineTokens, lineText, this._languageIdCodec);
	}

	private static _massageTokens(topLevelLanguageId: LanguageId, lineTextLength: number, _tokens: Uint32Array | ArrayBuffer | null): Uint32Array | ArrayBuffer {

		const tokens = _tokens ? toUint32Array(_tokens) : null;

		if (lineTextLength === 0) {
			let hasDifferentLanguageId = false;
			if (tokens && tokens.length > 1) {
				hasDifferentLanguageId = (TokenMetadata.getLanguageId(tokens[1]) !== topLevelLanguageId);
			}

			if (!hasDifferentLanguageId) {
				return EMPTY_LINE_TOKENS;
			}
		}

		if (!tokens || tokens.length === 0) {
			const tokens = new Uint32Array(2);
			tokens[0] = lineTextLength;
			tokens[1] = getDefaultMetadata(topLevelLanguageId);
			return tokens.buffer;
		}

		// Ensure the last token covers the end of the text
		tokens[tokens.length - 2] = lineTextLength;

		if (tokens.byteOffset === 0 && tokens.byteLength === tokens.buffer.byteLength) {
			// Store directly the ArrayBuffer pointer to save an object
			return tokens.buffer;
		}
		return tokens;
	}

	private _ensureLine(lineIndex: number): void {
		while (lineIndex >= this._len) {
			this._lineTokens[this._len] = null;
			this._len++;
		}
	}

	private _deleteLines(start: number, deleteCount: number): void {
		if (deleteCount === 0) {
			return;
		}
		if (start + deleteCount > this._len) {
			deleteCount = this._len - start;
		}
		this._lineTokens.splice(start, deleteCount);
		this._len -= deleteCount;
	}

	private _insertLines(insertIndex: number, insertCount: number): void {
		if (insertCount === 0) {
			return;
		}
		const lineTokens: (Uint32Array | ArrayBuffer | null)[] = [];
		for (let i = 0; i < insertCount; i++) {
			lineTokens[i] = null;
		}
		this._lineTokens = arrays.arrayInsert(this._lineTokens, insertIndex, lineTokens);
		this._len += insertCount;
	}

	public setTokens(topLevelLanguageId: string, lineIndex: number, lineTextLength: number, _tokens: Uint32Array | ArrayBuffer | null, checkEquality: boolean): boolean {
		const tokens = ContiguousTokensStore._massageTokens(this._languageIdCodec.encodeLanguageId(topLevelLanguageId), lineTextLength, _tokens);
		this._ensureLine(lineIndex);
		const oldTokens = this._lineTokens[lineIndex];
		this._lineTokens[lineIndex] = tokens;

		if (checkEquality) {
			return !ContiguousTokensStore._equals(oldTokens, tokens);
		}
		return false;
	}

	private static _equals(_a: Uint32Array | ArrayBuffer | null, _b: Uint32Array | ArrayBuffer | null) {
		if (!_a || !_b) {
			return !_a && !_b;
		}

		const a = toUint32Array(_a);
		const b = toUint32Array(_b);

		if (a.length !== b.length) {
			return false;
		}
		for (let i = 0, len = a.length; i < len; i++) {
			if (a[i] !== b[i]) {
				return false;
			}
		}
		return true;
	}

	//#region Editing

	public acceptEdit(range: IRange, eolCount: number, firstLineLength: number): void {
		this._acceptDeleteRange(range);
		this._acceptInsertText(new Position(range.startLineNumber, range.startColumn), eolCount, firstLineLength);
	}

	private _acceptDeleteRange(range: IRange): void {

		const firstLineIndex = range.startLineNumber - 1;
		if (firstLineIndex >= this._len) {
			return;
		}

		if (range.startLineNumber === range.endLineNumber) {
			if (range.startColumn === range.endColumn) {
				// Nothing to delete
				return;
			}

			this._lineTokens[firstLineIndex] = ContiguousTokensEditing.delete(this._lineTokens[firstLineIndex], range.startColumn - 1, range.endColumn - 1);
			return;
		}

		this._lineTokens[firstLineIndex] = ContiguousTokensEditing.deleteEnding(this._lineTokens[firstLineIndex], range.startColumn - 1);

		const lastLineIndex = range.endLineNumber - 1;
		let lastLineTokens: Uint32Array | ArrayBuffer | null = null;
		if (lastLineIndex < this._len) {
			lastLineTokens = ContiguousTokensEditing.deleteBeginning(this._lineTokens[lastLineIndex], range.endColumn - 1);
		}

		// Take remaining text on last line and append it to remaining text on first line
		this._lineTokens[firstLineIndex] = ContiguousTokensEditing.append(this._lineTokens[firstLineIndex], lastLineTokens);

		// Delete middle lines
		this._deleteLines(range.startLineNumber, range.endLineNumber - range.startLineNumber);
	}

	private _acceptInsertText(position: Position, eolCount: number, firstLineLength: number): void {

		if (eolCount === 0 && firstLineLength === 0) {
			// Nothing to insert
			return;
		}

		const lineIndex = position.lineNumber - 1;
		if (lineIndex >= this._len) {
			return;
		}

		if (eolCount === 0) {
			// Inserting text on one line
			this._lineTokens[lineIndex] = ContiguousTokensEditing.insert(this._lineTokens[lineIndex], position.column - 1, firstLineLength);
			return;
		}

		this._lineTokens[lineIndex] = ContiguousTokensEditing.deleteEnding(this._lineTokens[lineIndex], position.column - 1);
		this._lineTokens[lineIndex] = ContiguousTokensEditing.insert(this._lineTokens[lineIndex], position.column - 1, firstLineLength);

		this._insertLines(position.lineNumber, eolCount);
	}

	//#endregion

	public setMultilineTokens(tokens: ContiguousMultilineTokens[], textModel: ITextModel): { changes: { fromLineNumber: number; toLineNumber: number }[] } {
		if (tokens.length === 0) {
			return { changes: [] };
		}

		const ranges: { fromLineNumber: number; toLineNumber: number }[] = [];

		for (let i = 0, len = tokens.length; i < len; i++) {
			const element = tokens[i];
			let minChangedLineNumber = 0;
			let maxChangedLineNumber = 0;
			let hasChange = false;
			for (let lineNumber = element.startLineNumber; lineNumber <= element.endLineNumber; lineNumber++) {
				if (hasChange) {
					this.setTokens(textModel.getLanguageId(), lineNumber - 1, textModel.getLineLength(lineNumber), element.getLineTokens(lineNumber), false);
					maxChangedLineNumber = lineNumber;
				} else {
					const lineHasChange = this.setTokens(textModel.getLanguageId(), lineNumber - 1, textModel.getLineLength(lineNumber), element.getLineTokens(lineNumber), true);
					if (lineHasChange) {
						hasChange = true;
						minChangedLineNumber = lineNumber;
						maxChangedLineNumber = lineNumber;
					}
				}
			}
			if (hasChange) {
				ranges.push({ fromLineNumber: minChangedLineNumber, toLineNumber: maxChangedLineNumber, });
			}
		}

		return { changes: ranges };
	}
}

function getDefaultMetadata(topLevelLanguageId: LanguageId): number {
	return (
		(topLevelLanguageId << MetadataConsts.LANGUAGEID_OFFSET)
		| (StandardTokenType.Other << MetadataConsts.TOKEN_TYPE_OFFSET)
		| (FontStyle.None << MetadataConsts.FONT_STYLE_OFFSET)
		| (ColorId.DefaultForeground << MetadataConsts.FOREGROUND_OFFSET)
		| (ColorId.DefaultBackground << MetadataConsts.BACKGROUND_OFFSET)
		// If there is no grammar, we just take a guess and try to match brackets.
		| (MetadataConsts.BALANCED_BRACKETS_MASK)
	) >>> 0;
}
```

--------------------------------------------------------------------------------

````

---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 341
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 341 of 552)

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

---[FILE: src/vs/workbench/common/editor/textEditorModel.ts]---
Location: vscode-main/src/vs/workbench/common/editor/textEditorModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITextModel, ITextBufferFactory, ITextSnapshot, ModelConstants } from '../../../editor/common/model.js';
import { EditorModel } from './editorModel.js';
import { ILanguageSupport } from '../../services/textfile/common/textfiles.js';
import { URI } from '../../../base/common/uri.js';
import { ITextEditorModel, IResolvedTextEditorModel } from '../../../editor/common/services/resolverService.js';
import { ILanguageService, ILanguageSelection } from '../../../editor/common/languages/language.js';
import { IModelService } from '../../../editor/common/services/model.js';
import { MutableDisposable } from '../../../base/common/lifecycle.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../editor/common/languages/modesRegistry.js';
import { ILanguageDetectionService, LanguageDetectionLanguageEventSource } from '../../services/languageDetection/common/languageDetectionWorkerService.js';
import { ThrottledDelayer } from '../../../base/common/async.js';
import { IAccessibilityService } from '../../../platform/accessibility/common/accessibility.js';
import { localize } from '../../../nls.js';
import { IMarkdownString } from '../../../base/common/htmlContent.js';
import { TextModelEditSource } from '../../../editor/common/textModelEditSource.js';

/**
 * The base text editor model leverages the code editor model. This class is only intended to be subclassed and not instantiated.
 */
export class BaseTextEditorModel extends EditorModel implements ITextEditorModel, ILanguageSupport {

	private static readonly AUTO_DETECT_LANGUAGE_THROTTLE_DELAY = 600;

	protected textEditorModelHandle: URI | undefined = undefined;

	private createdEditorModel: boolean | undefined;

	private readonly modelDisposeListener = this._register(new MutableDisposable());
	private readonly autoDetectLanguageThrottler = this._register(new ThrottledDelayer<void>(BaseTextEditorModel.AUTO_DETECT_LANGUAGE_THROTTLE_DELAY));

	constructor(
		@IModelService protected modelService: IModelService,
		@ILanguageService protected languageService: ILanguageService,
		@ILanguageDetectionService private readonly languageDetectionService: ILanguageDetectionService,
		@IAccessibilityService private readonly accessibilityService: IAccessibilityService,
		textEditorModelHandle?: URI
	) {
		super();

		if (textEditorModelHandle) {
			this.handleExistingModel(textEditorModelHandle);
		}
	}

	private handleExistingModel(textEditorModelHandle: URI): void {

		// We need the resource to point to an existing model
		const model = this.modelService.getModel(textEditorModelHandle);
		if (!model) {
			throw new Error(`Document with resource ${textEditorModelHandle.toString(true)} does not exist`);
		}

		this.textEditorModelHandle = textEditorModelHandle;

		// Make sure we clean up when this model gets disposed
		this.registerModelDisposeListener(model);
	}

	private registerModelDisposeListener(model: ITextModel): void {
		this.modelDisposeListener.value = model.onWillDispose(() => {
			this.textEditorModelHandle = undefined; // make sure we do not dispose code editor model again
			this.dispose();
		});
	}

	get textEditorModel(): ITextModel | null {
		return this.textEditorModelHandle ? this.modelService.getModel(this.textEditorModelHandle) : null;
	}

	isReadonly(): boolean | IMarkdownString {
		return true;
	}

	private _blockLanguageChangeListener = false;
	private _languageChangeSource: 'user' | 'api' | undefined = undefined;
	get languageChangeSource() { return this._languageChangeSource; }
	get hasLanguageSetExplicitly() {
		// This is technically not 100% correct, because 'api' can also be
		// set as source if a model is resolved as text first and then
		// transitions into the resolved language. But to preserve the current
		// behaviour, we do not change this property. Rather, `languageChangeSource`
		// can be used to get more fine grained information.
		return typeof this._languageChangeSource === 'string';
	}

	setLanguageId(languageId: string, source?: string): void {

		// Remember that an explicit language was set
		this._languageChangeSource = 'user';

		this.setLanguageIdInternal(languageId, source);
	}

	private setLanguageIdInternal(languageId: string, source?: string): void {
		if (!this.isResolved()) {
			return;
		}

		if (!languageId || languageId === this.textEditorModel.getLanguageId()) {
			return;
		}

		this._blockLanguageChangeListener = true;
		try {
			this.textEditorModel.setLanguage(this.languageService.createById(languageId), source);
		} finally {
			this._blockLanguageChangeListener = false;
		}
	}

	protected installModelListeners(model: ITextModel): void {

		// Setup listener for lower level language changes
		const disposable = this._register(model.onDidChangeLanguage(e => {
			if (
				e.source === LanguageDetectionLanguageEventSource ||
				this._blockLanguageChangeListener
			) {
				return;
			}

			this._languageChangeSource = 'api';
			disposable.dispose();
		}));
	}

	getLanguageId(): string | undefined {
		return this.textEditorModel?.getLanguageId();
	}

	protected autoDetectLanguage(): Promise<void> {
		return this.autoDetectLanguageThrottler.trigger(() => this.doAutoDetectLanguage());
	}

	private async doAutoDetectLanguage(): Promise<void> {
		if (
			this.hasLanguageSetExplicitly || 																	// skip detection when the user has made an explicit choice on the language
			!this.textEditorModelHandle ||																		// require a URI to run the detection for
			!this.languageDetectionService.isEnabledForLanguage(this.getLanguageId() ?? PLAINTEXT_LANGUAGE_ID)	// require a valid language that is enlisted for detection
		) {
			return;
		}

		const lang = await this.languageDetectionService.detectLanguage(this.textEditorModelHandle);
		const prevLang = this.getLanguageId();
		if (lang && lang !== prevLang && !this.isDisposed()) {
			this.setLanguageIdInternal(lang, LanguageDetectionLanguageEventSource);
			const languageName = this.languageService.getLanguageName(lang);
			this.accessibilityService.alert(localize('languageAutoDetected', "Language {0} was automatically detected and set as the language mode.", languageName ?? lang));
		}
	}

	/**
	 * Creates the text editor model with the provided value, optional preferred language
	 * (can be comma separated for multiple values) and optional resource URL.
	 */
	protected createTextEditorModel(value: ITextBufferFactory, resource: URI | undefined, preferredLanguageId?: string): ITextModel {
		const firstLineText = this.getFirstLineText(value);
		const languageSelection = this.getOrCreateLanguage(resource, this.languageService, preferredLanguageId, firstLineText);

		return this.doCreateTextEditorModel(value, languageSelection, resource);
	}

	private doCreateTextEditorModel(value: ITextBufferFactory, languageSelection: ILanguageSelection, resource: URI | undefined): ITextModel {
		let model = resource && this.modelService.getModel(resource);
		if (!model) {
			model = this.modelService.createModel(value, languageSelection, resource);
			this.createdEditorModel = true;

			// Make sure we clean up when this model gets disposed
			this.registerModelDisposeListener(model);
		} else {
			this.updateTextEditorModel(value, languageSelection.languageId);
		}

		this.textEditorModelHandle = model.uri;

		return model;
	}

	protected getFirstLineText(value: ITextBufferFactory | ITextModel): string {

		// text buffer factory
		const textBufferFactory = value as ITextBufferFactory;
		if (typeof textBufferFactory.getFirstLineText === 'function') {
			return textBufferFactory.getFirstLineText(ModelConstants.FIRST_LINE_DETECTION_LENGTH_LIMIT);
		}

		// text model
		const textSnapshot = value as ITextModel;
		return textSnapshot.getLineContent(1).substr(0, ModelConstants.FIRST_LINE_DETECTION_LENGTH_LIMIT);
	}

	/**
	 * Gets the language for the given identifier. Subclasses can override to provide their own implementation of this lookup.
	 *
	 * @param firstLineText optional first line of the text buffer to set the language on. This can be used to guess a language from content.
	 */
	protected getOrCreateLanguage(resource: URI | undefined, languageService: ILanguageService, preferredLanguage: string | undefined, firstLineText?: string): ILanguageSelection {

		// lookup language via resource path if the provided language is unspecific
		if (!preferredLanguage || preferredLanguage === PLAINTEXT_LANGUAGE_ID) {
			return languageService.createByFilepathOrFirstLine(resource ?? null, firstLineText);
		}

		// otherwise take the preferred language for granted
		return languageService.createById(preferredLanguage);
	}

	/**
	 * Updates the text editor model with the provided value. If the value is the same as the model has, this is a no-op.
	 */
	updateTextEditorModel(newValue?: ITextBufferFactory, preferredLanguageId?: string, reason?: TextModelEditSource): void {
		if (!this.isResolved()) {
			return;
		}

		// contents
		if (newValue) {
			this.modelService.updateModel(this.textEditorModel, newValue, reason);
		}

		// language (only if specific and changed)
		if (preferredLanguageId && preferredLanguageId !== PLAINTEXT_LANGUAGE_ID && this.textEditorModel.getLanguageId() !== preferredLanguageId) {
			this.textEditorModel.setLanguage(this.languageService.createById(preferredLanguageId));
		}
	}

	createSnapshot(this: IResolvedTextEditorModel): ITextSnapshot;
	createSnapshot(this: ITextEditorModel): ITextSnapshot | null;
	createSnapshot(): ITextSnapshot | null {
		if (!this.textEditorModel) {
			return null;
		}

		return this.textEditorModel.createSnapshot(true /* preserve BOM */);
	}

	override isResolved(): this is IResolvedTextEditorModel {
		return !!this.textEditorModelHandle;
	}

	override dispose(): void {
		this.modelDisposeListener.dispose(); // dispose this first because it will trigger another dispose() otherwise

		if (this.textEditorModelHandle && this.createdEditorModel) {
			this.modelService.destroyModel(this.textEditorModelHandle);
		}

		this.textEditorModelHandle = undefined;
		this.createdEditorModel = false;

		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/editor/textResourceEditorInput.ts]---
Location: vscode-main/src/vs/workbench/common/editor/textResourceEditorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DEFAULT_EDITOR_ASSOCIATION, GroupIdentifier, IRevertOptions, isResourceEditorInput, IUntypedEditorInput } from '../editor.js';
import { EditorInput } from './editorInput.js';
import { AbstractResourceEditorInput } from './resourceEditorInput.js';
import { URI } from '../../../base/common/uri.js';
import { ITextFileService, ITextFileSaveOptions, ILanguageSupport } from '../../services/textfile/common/textfiles.js';
import { IEditorService } from '../../services/editor/common/editorService.js';
import { IFileService } from '../../../platform/files/common/files.js';
import { ILabelService } from '../../../platform/label/common/label.js';
import { Schemas } from '../../../base/common/network.js';
import { isEqual } from '../../../base/common/resources.js';
import { ITextEditorModel, ITextModelService } from '../../../editor/common/services/resolverService.js';
import { TextResourceEditorModel } from './textResourceEditorModel.js';
import { IReference } from '../../../base/common/lifecycle.js';
import { createTextBufferFactory } from '../../../editor/common/model/textModel.js';
import { IFilesConfigurationService } from '../../services/filesConfiguration/common/filesConfigurationService.js';
import { ITextResourceConfigurationService } from '../../../editor/common/services/textResourceConfiguration.js';
import { ICustomEditorLabelService } from '../../services/editor/common/customEditorLabelService.js';

/**
 * The base class for all editor inputs that open in text editors.
 */
export abstract class AbstractTextResourceEditorInput extends AbstractResourceEditorInput {

	constructor(
		resource: URI,
		preferredResource: URI | undefined,
		@IEditorService protected readonly editorService: IEditorService,
		@ITextFileService protected readonly textFileService: ITextFileService,
		@ILabelService labelService: ILabelService,
		@IFileService fileService: IFileService,
		@IFilesConfigurationService filesConfigurationService: IFilesConfigurationService,
		@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@ICustomEditorLabelService customEditorLabelService: ICustomEditorLabelService
	) {
		super(resource, preferredResource, labelService, fileService, filesConfigurationService, textResourceConfigurationService, customEditorLabelService);
	}

	override save(group: GroupIdentifier, options?: ITextFileSaveOptions): Promise<IUntypedEditorInput | undefined> {

		// If this is neither an `untitled` resource, nor a resource
		// we can handle with the file service, we can only "Save As..."
		if (this.resource.scheme !== Schemas.untitled && !this.fileService.hasProvider(this.resource)) {
			return this.saveAs(group, options);
		}

		// Normal save
		return this.doSave(options, false, group);
	}

	override saveAs(group: GroupIdentifier, options?: ITextFileSaveOptions): Promise<IUntypedEditorInput | undefined> {
		return this.doSave(options, true, group);
	}

	private async doSave(options: ITextFileSaveOptions | undefined, saveAs: boolean, group: GroupIdentifier | undefined): Promise<IUntypedEditorInput | undefined> {

		// Save / Save As
		let target: URI | undefined;
		if (saveAs) {
			target = await this.textFileService.saveAs(this.resource, undefined, { ...options, suggestedTarget: this.preferredResource });
		} else {
			target = await this.textFileService.save(this.resource, options);
		}

		if (!target) {
			return undefined; // save cancelled
		}

		return { resource: target };
	}

	override async revert(group: GroupIdentifier, options?: IRevertOptions): Promise<void> {
		await this.textFileService.revert(this.resource, options);
	}
}

/**
 * A read-only text editor input whos contents are made of the provided resource that points to an existing
 * code editor model.
 */
export class TextResourceEditorInput extends AbstractTextResourceEditorInput implements ILanguageSupport {

	static readonly ID: string = 'workbench.editors.resourceEditorInput';

	override get typeId(): string {
		return TextResourceEditorInput.ID;
	}

	override get editorId(): string | undefined {
		return DEFAULT_EDITOR_ASSOCIATION.id;
	}

	private cachedModel: TextResourceEditorModel | undefined = undefined;
	private modelReference: Promise<IReference<ITextEditorModel>> | undefined = undefined;

	constructor(
		resource: URI,
		private name: string | undefined,
		private description: string | undefined,
		private preferredLanguageId: string | undefined,
		private preferredContents: string | undefined,
		@ITextModelService private readonly textModelService: ITextModelService,
		@ITextFileService textFileService: ITextFileService,
		@IEditorService editorService: IEditorService,
		@IFileService fileService: IFileService,
		@ILabelService labelService: ILabelService,
		@IFilesConfigurationService filesConfigurationService: IFilesConfigurationService,
		@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@ICustomEditorLabelService customEditorLabelService: ICustomEditorLabelService
	) {
		super(resource, undefined, editorService, textFileService, labelService, fileService, filesConfigurationService, textResourceConfigurationService, customEditorLabelService);
	}

	override getName(): string {
		return this.name || super.getName();
	}

	setName(name: string): void {
		if (this.name !== name) {
			this.name = name;

			this._onDidChangeLabel.fire();
		}
	}

	override getDescription(): string | undefined {
		return this.description;
	}

	setDescription(description: string): void {
		if (this.description !== description) {
			this.description = description;

			this._onDidChangeLabel.fire();
		}
	}

	setLanguageId(languageId: string, source?: string): void {
		this.setPreferredLanguageId(languageId);

		this.cachedModel?.setLanguageId(languageId, source);
	}

	setPreferredLanguageId(languageId: string): void {
		this.preferredLanguageId = languageId;
	}

	setPreferredContents(contents: string): void {
		this.preferredContents = contents;
	}

	override async resolve(): Promise<ITextEditorModel> {

		// Unset preferred contents and language after resolving
		// once to prevent these properties to stick. We still
		// want the user to change the language in the editor
		// and want to show updated contents (if any) in future
		// `resolve` calls.
		const preferredContents = this.preferredContents;
		const preferredLanguageId = this.preferredLanguageId;
		this.preferredContents = undefined;
		this.preferredLanguageId = undefined;

		if (!this.modelReference) {
			this.modelReference = this.textModelService.createModelReference(this.resource);
		}

		const ref = await this.modelReference;

		// Ensure the resolved model is of expected type
		const model = ref.object;
		if (!(model instanceof TextResourceEditorModel)) {
			ref.dispose();
			this.modelReference = undefined;

			throw new Error(`Unexpected model for TextResourceEditorInput: ${this.resource}`);
		}

		this.cachedModel = model;

		// Set contents and language if preferred
		if (typeof preferredContents === 'string' || typeof preferredLanguageId === 'string') {
			model.updateTextEditorModel(typeof preferredContents === 'string' ? createTextBufferFactory(preferredContents) : undefined, preferredLanguageId);
		}

		return model;
	}

	override matches(otherInput: EditorInput | IUntypedEditorInput): boolean {
		if (this === otherInput) {
			return true;
		}

		if (otherInput instanceof TextResourceEditorInput) {
			return isEqual(otherInput.resource, this.resource);
		}

		if (isResourceEditorInput(otherInput)) {
			return super.matches(otherInput);
		}

		return false;
	}

	override dispose(): void {
		if (this.modelReference) {
			this.modelReference.then(ref => ref.dispose());
			this.modelReference = undefined;
		}

		this.cachedModel = undefined;

		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/editor/textResourceEditorModel.ts]---
Location: vscode-main/src/vs/workbench/common/editor/textResourceEditorModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BaseTextEditorModel } from './textEditorModel.js';
import { URI } from '../../../base/common/uri.js';
import { ILanguageService } from '../../../editor/common/languages/language.js';
import { IModelService } from '../../../editor/common/services/model.js';
import { ILanguageDetectionService } from '../../services/languageDetection/common/languageDetectionWorkerService.js';
import { IAccessibilityService } from '../../../platform/accessibility/common/accessibility.js';

/**
 * An editor model for in-memory, readonly text content that
 * is backed by an existing editor model.
 */
export class TextResourceEditorModel extends BaseTextEditorModel {

	constructor(
		resource: URI,
		@ILanguageService languageService: ILanguageService,
		@IModelService modelService: IModelService,
		@ILanguageDetectionService languageDetectionService: ILanguageDetectionService,
		@IAccessibilityService accessibilityService: IAccessibilityService,
	) {
		super(modelService, languageService, languageDetectionService, accessibilityService, resource);
	}

	override dispose(): void {

		// force this class to dispose the underlying model
		if (this.textEditorModelHandle) {
			this.modelService.destroyModel(this.textEditorModelHandle);
		}

		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/accessibility/browser/accessibility.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/accessibility/browser/accessibility.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { DynamicSpeechAccessibilityConfiguration, registerAccessibilityConfiguration } from './accessibilityConfiguration.js';
import { IWorkbenchContributionsRegistry, WorkbenchPhase, Extensions as WorkbenchExtensions, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { UnfocusedViewDimmingContribution } from './unfocusedViewDimmingContribution.js';
import { AccessibilityStatus } from './accessibilityStatus.js';
import { EditorAccessibilityHelpContribution } from './editorAccessibilityHelp.js';
import { SaveAccessibilitySignalContribution } from '../../accessibilitySignals/browser/saveAccessibilitySignal.js';
import { DiffEditorActiveAnnouncementContribution } from '../../accessibilitySignals/browser/openDiffEditorAnnouncement.js';
import { SpeechAccessibilitySignalContribution } from '../../speech/browser/speechAccessibilitySignal.js';
import { AccessibleViewInformationService, IAccessibleViewInformationService } from '../../../services/accessibility/common/accessibleViewInformationService.js';
import { IAccessibleViewService } from '../../../../platform/accessibility/browser/accessibleView.js';
import { AccessibleViewService } from './accessibleView.js';
import { AccesibleViewHelpContribution, AccesibleViewContributions } from './accessibleViewContributions.js';
import { ExtensionAccessibilityHelpDialogContribution } from './extensionAccesibilityHelp.contribution.js';

registerAccessibilityConfiguration();
registerSingleton(IAccessibleViewService, AccessibleViewService, InstantiationType.Delayed);
registerSingleton(IAccessibleViewInformationService, AccessibleViewInformationService, InstantiationType.Delayed);

const workbenchRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);
workbenchRegistry.registerWorkbenchContribution(EditorAccessibilityHelpContribution, LifecyclePhase.Eventually);
workbenchRegistry.registerWorkbenchContribution(UnfocusedViewDimmingContribution, LifecyclePhase.Restored);

workbenchRegistry.registerWorkbenchContribution(AccesibleViewHelpContribution, LifecyclePhase.Eventually);
workbenchRegistry.registerWorkbenchContribution(AccesibleViewContributions, LifecyclePhase.Eventually);

registerWorkbenchContribution2(AccessibilityStatus.ID, AccessibilityStatus, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(ExtensionAccessibilityHelpDialogContribution.ID, ExtensionAccessibilityHelpDialogContribution, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(SaveAccessibilitySignalContribution.ID, SaveAccessibilitySignalContribution, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(SpeechAccessibilitySignalContribution.ID, SpeechAccessibilitySignalContribution, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(DiffEditorActiveAnnouncementContribution.ID, DiffEditorActiveAnnouncementContribution, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(DynamicSpeechAccessibilityConfiguration.ID, DynamicSpeechAccessibilityConfiguration, WorkbenchPhase.AfterRestored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/accessibility/browser/accessibilityConfiguration.ts]---
Location: vscode-main/src/vs/workbench/contrib/accessibility/browser/accessibilityConfiguration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { ConfigurationScope, Extensions, IConfigurationNode, IConfigurationPropertySchema, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { workbenchConfigurationNodeBase, Extensions as WorkbenchExtensions, IConfigurationMigrationRegistry, ConfigurationKeyValuePairs, ConfigurationMigration } from '../../../common/configuration.js';
import { AccessibilitySignal } from '../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { AccessibilityVoiceSettingId, ISpeechService, SPEECH_LANGUAGES } from '../../speech/common/speechService.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { Event } from '../../../../base/common/event.js';
import { isDefined } from '../../../../base/common/types.js';

export const accessibilityHelpIsShown = new RawContextKey<boolean>('accessibilityHelpIsShown', false, true);
export const accessibleViewIsShown = new RawContextKey<boolean>('accessibleViewIsShown', false, true);
export const accessibleViewSupportsNavigation = new RawContextKey<boolean>('accessibleViewSupportsNavigation', false, true);
export const accessibleViewVerbosityEnabled = new RawContextKey<boolean>('accessibleViewVerbosityEnabled', false, true);
export const accessibleViewGoToSymbolSupported = new RawContextKey<boolean>('accessibleViewGoToSymbolSupported', false, true);
export const accessibleViewOnLastLine = new RawContextKey<boolean>('accessibleViewOnLastLine', false, true);
export const accessibleViewCurrentProviderId = new RawContextKey<string>('accessibleViewCurrentProviderId', undefined, undefined);
export const accessibleViewInCodeBlock = new RawContextKey<boolean>('accessibleViewInCodeBlock', undefined, undefined);
export const accessibleViewContainsCodeBlocks = new RawContextKey<boolean>('accessibleViewContainsCodeBlocks', undefined, undefined);
export const accessibleViewHasUnassignedKeybindings = new RawContextKey<boolean>('accessibleViewHasUnassignedKeybindings', undefined, undefined);
export const accessibleViewHasAssignedKeybindings = new RawContextKey<boolean>('accessibleViewHasAssignedKeybindings', undefined, undefined);

/**
 * Miscellaneous settings tagged with accessibility and implemented in the accessibility contrib but
 * were better to live under workbench for discoverability.
 */
export const enum AccessibilityWorkbenchSettingId {
	DimUnfocusedEnabled = 'accessibility.dimUnfocused.enabled',
	DimUnfocusedOpacity = 'accessibility.dimUnfocused.opacity',
	HideAccessibleView = 'accessibility.hideAccessibleView',
	AccessibleViewCloseOnKeyPress = 'accessibility.accessibleView.closeOnKeyPress',
	VerboseChatProgressUpdates = 'accessibility.verboseChatProgressUpdates'
}

export const enum ViewDimUnfocusedOpacityProperties {
	Default = 0.75,
	Minimum = 0.2,
	Maximum = 1
}

export const enum AccessibilityVerbositySettingId {
	Terminal = 'accessibility.verbosity.terminal',
	DiffEditor = 'accessibility.verbosity.diffEditor',
	MergeEditor = 'accessibility.verbosity.mergeEditor',
	Chat = 'accessibility.verbosity.panelChat',
	InlineChat = 'accessibility.verbosity.inlineChat',
	TerminalInlineChat = 'accessibility.verbosity.terminalChat',
	TerminalChatOutput = 'accessibility.verbosity.terminalChatOutput',
	InlineCompletions = 'accessibility.verbosity.inlineCompletions',
	KeybindingsEditor = 'accessibility.verbosity.keybindingsEditor',
	Notebook = 'accessibility.verbosity.notebook',
	Editor = 'accessibility.verbosity.editor',
	Hover = 'accessibility.verbosity.hover',
	Notification = 'accessibility.verbosity.notification',
	EmptyEditorHint = 'accessibility.verbosity.emptyEditorHint',
	ReplEditor = 'accessibility.verbosity.replEditor',
	Comments = 'accessibility.verbosity.comments',
	DiffEditorActive = 'accessibility.verbosity.diffEditorActive',
	Debug = 'accessibility.verbosity.debug',
	Walkthrough = 'accessibility.verbosity.walkthrough',
	SourceControl = 'accessibility.verbosity.sourceControl'
}

const baseVerbosityProperty: IConfigurationPropertySchema = {
	type: 'boolean',
	default: true,
	tags: ['accessibility']
};

export const accessibilityConfigurationNodeBase = Object.freeze<IConfigurationNode>({
	id: 'accessibility',
	title: localize('accessibilityConfigurationTitle', "Accessibility"),
	type: 'object'
});

export const soundFeatureBase: IConfigurationPropertySchema = {
	'type': 'string',
	'enum': ['auto', 'on', 'off'],
	'default': 'auto',
	'enumDescriptions': [
		localize('sound.enabled.auto', "Enable sound when a screen reader is attached."),
		localize('sound.enabled.on', "Enable sound."),
		localize('sound.enabled.off', "Disable sound.")
	],
	tags: ['accessibility'],
};

const signalFeatureBase: IConfigurationPropertySchema = {
	'type': 'object',
	'tags': ['accessibility'],
	additionalProperties: false,
	default: {
		sound: 'auto',
		announcement: 'auto'
	}
};

export const announcementFeatureBase: IConfigurationPropertySchema = {
	'type': 'string',
	'enum': ['auto', 'off'],
	'default': 'auto',
	'enumDescriptions': [
		localize('announcement.enabled.auto', "Enable announcement, will only play when in screen reader optimized mode."),
		localize('announcement.enabled.off', "Disable announcement.")
	],
	tags: ['accessibility'],
};

const defaultNoAnnouncement: IConfigurationPropertySchema = {
	'type': 'object',
	'tags': ['accessibility'],
	additionalProperties: false,
	'default': {
		'sound': 'auto',
	}
};

const configuration: IConfigurationNode = {
	...accessibilityConfigurationNodeBase,
	scope: ConfigurationScope.RESOURCE,
	properties: {
		[AccessibilityVerbositySettingId.Terminal]: {
			description: localize('verbosity.terminal.description', 'Provide information about how to access the terminal accessibility help menu when the terminal is focused.'),
			...baseVerbosityProperty
		},
		[AccessibilityVerbositySettingId.DiffEditor]: {
			description: localize('verbosity.diffEditor.description', 'Provide information about how to navigate changes in the diff editor when it is focused.'),
			...baseVerbosityProperty
		},
		[AccessibilityVerbositySettingId.Chat]: {
			description: localize('verbosity.chat.description', 'Provide information about how to access the chat help menu when the chat input is focused.'),
			...baseVerbosityProperty
		},
		[AccessibilityVerbositySettingId.InlineChat]: {
			description: localize('verbosity.interactiveEditor.description', 'Provide information about how to access the inline editor chat accessibility help menu and alert with hints that describe how to use the feature when the input is focused.'),
			...baseVerbosityProperty
		},
		[AccessibilityVerbositySettingId.TerminalChatOutput]: {
			description: localize('verbosity.terminalChatOutput.description', 'Provide information about how to open the chat terminal output in the Accessible View.'),
			...baseVerbosityProperty
		},
		[AccessibilityVerbositySettingId.InlineCompletions]: {
			description: localize('verbosity.inlineCompletions.description', 'Provide information about how to access the inline completions hover and Accessible View.'),
			...baseVerbosityProperty
		},
		[AccessibilityVerbositySettingId.KeybindingsEditor]: {
			description: localize('verbosity.keybindingsEditor.description', 'Provide information about how to change a keybinding in the keybindings editor when a row is focused.'),
			...baseVerbosityProperty
		},
		[AccessibilityVerbositySettingId.Notebook]: {
			description: localize('verbosity.notebook', 'Provide information about how to focus the cell container or inner editor when a notebook cell is focused.'),
			...baseVerbosityProperty
		},
		[AccessibilityVerbositySettingId.Hover]: {
			description: localize('verbosity.hover', 'Provide information about how to open the hover in an Accessible View.'),
			...baseVerbosityProperty
		},
		[AccessibilityVerbositySettingId.Notification]: {
			description: localize('verbosity.notification', 'Provide information about how to open the notification in an Accessible View.'),
			...baseVerbosityProperty
		},
		[AccessibilityVerbositySettingId.EmptyEditorHint]: {
			description: localize('verbosity.emptyEditorHint', 'Provide information about relevant actions in an empty text editor.'),
			...baseVerbosityProperty
		},
		[AccessibilityVerbositySettingId.ReplEditor]: {
			description: localize('verbosity.replEditor.description', 'Provide information about how to access the REPL editor accessibility help menu when the REPL editor is focused.'),
			...baseVerbosityProperty
		},
		[AccessibilityVerbositySettingId.Comments]: {
			description: localize('verbosity.comments', 'Provide information about actions that can be taken in the comment widget or in a file which contains comments.'),
			...baseVerbosityProperty
		},
		[AccessibilityVerbositySettingId.DiffEditorActive]: {
			description: localize('verbosity.diffEditorActive', 'Indicate when a diff editor becomes the active editor.'),
			...baseVerbosityProperty
		},
		[AccessibilityVerbositySettingId.Debug]: {
			description: localize('verbosity.debug', 'Provide information about how to access the debug console accessibility help dialog when the debug console or run and debug viewlet is focused. Note that a reload of the window is required for this to take effect.'),
			...baseVerbosityProperty
		},
		[AccessibilityVerbositySettingId.Walkthrough]: {
			description: localize('verbosity.walkthrough', 'Provide information about how to open the walkthrough in an Accessible View.'),
			...baseVerbosityProperty
		},
		[AccessibilityWorkbenchSettingId.AccessibleViewCloseOnKeyPress]: {
			markdownDescription: localize('terminal.integrated.accessibleView.closeOnKeyPress', "On keypress, close the Accessible View and focus the element from which it was invoked."),
			type: 'boolean',
			default: true
		},
		[AccessibilityVerbositySettingId.SourceControl]: {
			description: localize('verbosity.scm', 'Provide information about how to access the source control accessibility help menu when the input is focused.'),
			...baseVerbosityProperty
		},
		'accessibility.signalOptions.volume': {
			'description': localize('accessibility.signalOptions.volume', "The volume of the sounds in percent (0-100)."),
			'type': 'number',
			'minimum': 0,
			'maximum': 100,
			'default': 70,
			'tags': ['accessibility']
		},
		'accessibility.signalOptions.debouncePositionChanges': {
			'description': localize('accessibility.signalOptions.debouncePositionChanges', "Whether or not position changes should be debounced"),
			'type': 'boolean',
			'default': false,
			'tags': ['accessibility']
		},
		'accessibility.signalOptions.experimental.delays.general': {
			'type': 'object',
			'description': 'Delays for all signals besides error and warning at position',
			'additionalProperties': false,
			'properties': {
				'announcement': {
					'description': localize('accessibility.signalOptions.delays.general.announcement', "The delay in milliseconds before an announcement is made."),
					'type': 'number',
					'minimum': 0,
					'default': 3000
				},
				'sound': {
					'description': localize('accessibility.signalOptions.delays.general.sound', "The delay in milliseconds before a sound is played."),
					'type': 'number',
					'minimum': 0,
					'default': 400
				}
			},
			'tags': ['accessibility']
		},
		'accessibility.signalOptions.experimental.delays.warningAtPosition': {
			'type': 'object',
			'additionalProperties': false,
			'properties': {
				'announcement': {
					'description': localize('accessibility.signalOptions.delays.warningAtPosition.announcement', "The delay in milliseconds before an announcement is made when there's a warning at the position."),
					'type': 'number',
					'minimum': 0,
					'default': 3000
				},
				'sound': {
					'description': localize('accessibility.signalOptions.delays.warningAtPosition.sound', "The delay in milliseconds before a sound is played when there's a warning at the position."),
					'type': 'number',
					'minimum': 0,
					'default': 1000
				}
			},
			'tags': ['accessibility']
		},
		'accessibility.signalOptions.experimental.delays.errorAtPosition': {
			'type': 'object',
			'additionalProperties': false,
			'properties': {
				'announcement': {
					'description': localize('accessibility.signalOptions.delays.errorAtPosition.announcement', "The delay in milliseconds before an announcement is made when there's an error at the position."),
					'type': 'number',
					'minimum': 0,
					'default': 3000
				},
				'sound': {
					'description': localize('accessibility.signalOptions.delays.errorAtPosition.sound', "The delay in milliseconds before a sound is played when there's an error at the position."),
					'type': 'number',
					'minimum': 0,
					'default': 1000
				}
			},
			'tags': ['accessibility']
		},
		'accessibility.signals.lineHasBreakpoint': {
			...signalFeatureBase,
			'description': localize('accessibility.signals.lineHasBreakpoint', "Plays a signal - sound (audio cue) and/or announcement (alert) - when the active line has a breakpoint."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.lineHasBreakpoint.sound', "Plays a sound when the active line has a breakpoint."),
					...soundFeatureBase
				},
				'announcement': {
					'description': localize('accessibility.signals.lineHasBreakpoint.announcement', "Announces when the active line has a breakpoint."),
					...announcementFeatureBase
				},
			},
		},
		'accessibility.signals.lineHasInlineSuggestion': {
			...defaultNoAnnouncement,
			'description': localize('accessibility.signals.lineHasInlineSuggestion', "Plays a sound / audio cue when the active line has an inline suggestion."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.lineHasInlineSuggestion.sound', "Plays a sound when the active line has an inline suggestion."),
					...soundFeatureBase,
					'default': 'off'
				}
			}
		},
		'accessibility.signals.nextEditSuggestion': {
			...signalFeatureBase,
			'description': localize('accessibility.signals.nextEditSuggestion', "Plays a signal - sound / audio cue and/or announcement (alert) when there is a next edit suggestion."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.nextEditSuggestion.sound', "Plays a sound when there is a next edit suggestion."),
					...soundFeatureBase,
				},
				'announcement': {
					'description': localize('accessibility.signals.nextEditSuggestion.announcement', "Announces when there is a next edit suggestion."),
					...announcementFeatureBase,
				},
			}
		},
		'accessibility.signals.lineHasError': {
			...signalFeatureBase,
			'description': localize('accessibility.signals.lineHasError', "Plays a signal - sound (audio cue) and/or announcement (alert) - when the active line has an error."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.lineHasError.sound', "Plays a sound when the active line has an error."),
					...soundFeatureBase
				},
				'announcement': {
					'description': localize('accessibility.signals.lineHasError.announcement', "Announces when the active line has an error."),
					...announcementFeatureBase,
					default: 'off'
				},
			},
		},
		'accessibility.signals.lineHasFoldedArea': {
			...signalFeatureBase,
			'description': localize('accessibility.signals.lineHasFoldedArea', "Plays a signal - sound (audio cue) and/or announcement (alert) - the active line has a folded area that can be unfolded."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.lineHasFoldedArea.sound', "Plays a sound when the active line has a folded area that can be unfolded."),
					...soundFeatureBase,
					default: 'off'
				},
				'announcement': {
					'description': localize('accessibility.signals.lineHasFoldedArea.announcement', "Announces when the active line has a folded area that can be unfolded."),
					...announcementFeatureBase
				},
			}
		},
		'accessibility.signals.lineHasWarning': {
			...signalFeatureBase,
			'description': localize('accessibility.signals.lineHasWarning', "Plays a signal - sound (audio cue) and/or announcement (alert) - when the active line has a warning."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.lineHasWarning.sound', "Plays a sound when the active line has a warning."),
					...soundFeatureBase
				},
				'announcement': {
					'description': localize('accessibility.signals.lineHasWarning.announcement', "Announces when the active line has a warning."),
					...announcementFeatureBase,
					default: 'off'
				},
			},
		},
		'accessibility.signals.positionHasError': {
			...signalFeatureBase,
			'description': localize('accessibility.signals.positionHasError', "Plays a signal - sound (audio cue) and/or announcement (alert) - when the active line has a warning."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.positionHasError.sound', "Plays a sound when the active line has a warning."),
					...soundFeatureBase
				},
				'announcement': {
					'description': localize('accessibility.signals.positionHasError.announcement', "Announces when the active line has a warning."),
					...announcementFeatureBase,
					default: 'on'
				},
			},
		},
		'accessibility.signals.positionHasWarning': {
			...signalFeatureBase,
			'description': localize('accessibility.signals.positionHasWarning', "Plays a signal - sound (audio cue) and/or announcement (alert) - when the active line has a warning."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.positionHasWarning.sound', "Plays a sound when the active line has a warning."),
					...soundFeatureBase
				},
				'announcement': {
					'description': localize('accessibility.signals.positionHasWarning.announcement', "Announces when the active line has a warning."),
					...announcementFeatureBase,
					default: 'on'
				},
			},
		},
		'accessibility.signals.onDebugBreak': {
			...signalFeatureBase,
			'description': localize('accessibility.signals.onDebugBreak', "Plays a signal - sound (audio cue) and/or announcement (alert) - when the debugger stopped on a breakpoint."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.onDebugBreak.sound', "Plays a sound when the debugger stopped on a breakpoint."),
					...soundFeatureBase
				},
				'announcement': {
					'description': localize('accessibility.signals.onDebugBreak.announcement', "Announces when the debugger stopped on a breakpoint."),
					...announcementFeatureBase
				},
			}
		},
		'accessibility.signals.noInlayHints': {
			...signalFeatureBase,
			'description': localize('accessibility.signals.noInlayHints', "Plays a signal - sound (audio cue) and/or announcement (alert) - when trying to read a line with inlay hints that has no inlay hints."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.noInlayHints.sound', "Plays a sound when trying to read a line with inlay hints that has no inlay hints."),
					...soundFeatureBase
				},
				'announcement': {
					'description': localize('accessibility.signals.noInlayHints.announcement', "Announces when trying to read a line with inlay hints that has no inlay hints."),
					...announcementFeatureBase
				},
			}
		},
		'accessibility.signals.taskCompleted': {
			...signalFeatureBase,
			'description': localize('accessibility.signals.taskCompleted', "Plays a signal - sound (audio cue) and/or announcement (alert) - when a task is completed."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.taskCompleted.sound', "Plays a sound when a task is completed."),
					...soundFeatureBase
				},
				'announcement': {
					'description': localize('accessibility.signals.taskCompleted.announcement', "Announces when a task is completed."),
					...announcementFeatureBase
				},
			}
		},
		'accessibility.signals.taskFailed': {
			...signalFeatureBase,
			'description': localize('accessibility.signals.taskFailed', "Plays a signal - sound (audio cue) and/or announcement (alert) - when a task fails (non-zero exit code)."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.taskFailed.sound', "Plays a sound when a task fails (non-zero exit code)."),
					...soundFeatureBase
				},
				'announcement': {
					'description': localize('accessibility.signals.taskFailed.announcement', "Announces when a task fails (non-zero exit code)."),
					...announcementFeatureBase
				},
			}
		},
		'accessibility.signals.terminalCommandFailed': {
			...signalFeatureBase,
			'description': localize('accessibility.signals.terminalCommandFailed', "Plays a signal - sound (audio cue) and/or announcement (alert) - when a terminal command fails (non-zero exit code) or when a command with such an exit code is navigated to in the accessible view."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.terminalCommandFailed.sound', "Plays a sound when a terminal command fails (non-zero exit code) or when a command with such an exit code is navigated to in the accessible view."),
					...soundFeatureBase
				},
				'announcement': {
					'description': localize('accessibility.signals.terminalCommandFailed.announcement', "Announces when a terminal command fails (non-zero exit code) or when a command with such an exit code is navigated to in the accessible view."),
					...announcementFeatureBase
				},
			}
		},
		'accessibility.signals.terminalCommandSucceeded': {
			...signalFeatureBase,
			'description': localize('accessibility.signals.terminalCommandSucceeded', "Plays a signal - sound (audio cue) and/or announcement (alert) - when a terminal command succeeds (zero exit code) or when a command with such an exit code is navigated to in the accessible view."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.terminalCommandSucceeded.sound', "Plays a sound when a terminal command succeeds (zero exit code) or when a command with such an exit code is navigated to in the accessible view."),
					...soundFeatureBase
				},
				'announcement': {
					'description': localize('accessibility.signals.terminalCommandSucceeded.announcement', "Announces when a terminal command succeeds (zero exit code) or when a command with such an exit code is navigated to in the accessible view."),
					...announcementFeatureBase
				},
			}
		},
		'accessibility.signals.terminalQuickFix': {
			...signalFeatureBase,
			'description': localize('accessibility.signals.terminalQuickFix', "Plays a signal - sound (audio cue) and/or announcement (alert) - when terminal Quick Fixes are available."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.terminalQuickFix.sound', "Plays a sound when terminal Quick Fixes are available."),
					...soundFeatureBase
				},
				'announcement': {
					'description': localize('accessibility.signals.terminalQuickFix.announcement', "Announces when terminal Quick Fixes are available."),
					...announcementFeatureBase
				},
			}
		},
		'accessibility.signals.terminalBell': {
			...signalFeatureBase,
			'description': localize('accessibility.signals.terminalBell', "Plays a signal - sound (audio cue) and/or announcement (alert) - when the terminal bell is ringing."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.terminalBell.sound', "Plays a sound when the terminal bell is ringing."),
					...soundFeatureBase
				},
				'announcement': {
					'description': localize('accessibility.signals.terminalBell.announcement', "Announces when the terminal bell is ringing."),
					...announcementFeatureBase
				},
			}
		},
		'accessibility.signals.diffLineInserted': {
			...defaultNoAnnouncement,
			'description': localize('accessibility.signals.diffLineInserted', "Plays a sound / audio cue when the focus moves to an inserted line in Accessible Diff Viewer mode or to the next/previous change."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.sound', "Plays a sound when the focus moves to an inserted line in Accessible Diff Viewer mode or to the next/previous change."),
					...soundFeatureBase
				}
			}
		},
		'accessibility.signals.diffLineModified': {
			...defaultNoAnnouncement,
			'description': localize('accessibility.signals.diffLineModified', "Plays a sound / audio cue when the focus moves to an modified line in Accessible Diff Viewer mode or to the next/previous change."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.diffLineModified.sound', "Plays a sound when the focus moves to a modified line in Accessible Diff Viewer mode or to the next/previous change."),
					...soundFeatureBase
				}
			}
		},
		'accessibility.signals.diffLineDeleted': {
			...defaultNoAnnouncement,
			'description': localize('accessibility.signals.diffLineDeleted', "Plays a sound / audio cue when the focus moves to an deleted line in Accessible Diff Viewer mode or to the next/previous change."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.diffLineDeleted.sound', "Plays a sound when the focus moves to an deleted line in Accessible Diff Viewer mode or to the next/previous change."),
					...soundFeatureBase
				}
			}
		},
		'accessibility.signals.chatEditModifiedFile': {
			...defaultNoAnnouncement,
			'description': localize('accessibility.signals.chatEditModifiedFile', "Plays a sound / audio cue when revealing a file with changes from chat edits"),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.chatEditModifiedFile.sound', "Plays a sound when revealing a file with changes from chat edits"),
					...soundFeatureBase
				}
			}
		},
		'accessibility.signals.notebookCellCompleted': {
			...signalFeatureBase,
			'description': localize('accessibility.signals.notebookCellCompleted', "Plays a signal - sound (audio cue) and/or announcement (alert) - when a notebook cell execution is successfully completed."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.notebookCellCompleted.sound', "Plays a sound when a notebook cell execution is successfully completed."),
					...soundFeatureBase
				},
				'announcement': {
					'description': localize('accessibility.signals.notebookCellCompleted.announcement', "Announces when a notebook cell execution is successfully completed."),
					...announcementFeatureBase
				},
			}
		},
		'accessibility.signals.notebookCellFailed': {
			...signalFeatureBase,
			'description': localize('accessibility.signals.notebookCellFailed', "Plays a signal - sound (audio cue) and/or announcement (alert) - when a notebook cell execution fails."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.notebookCellFailed.sound', "Plays a sound when a notebook cell execution fails."),
					...soundFeatureBase
				},
				'announcement': {
					'description': localize('accessibility.signals.notebookCellFailed.announcement', "Announces when a notebook cell execution fails."),
					...announcementFeatureBase
				},
			}
		},
		'accessibility.signals.progress': {
			...signalFeatureBase,
			'description': localize('accessibility.signals.progress', "Plays a signal - sound (audio cue) and/or announcement (alert) - on loop while progress is occurring."),
			'default': {
				'sound': 'auto',
				'announcement': 'off'
			},
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.progress.sound', "Plays a sound on loop while progress is occurring."),
					...soundFeatureBase
				},
				'announcement': {
					'description': localize('accessibility.signals.progress.announcement', "Alerts on loop while progress is occurring."),
					...announcementFeatureBase
				},
			},
		},
		'accessibility.signals.chatRequestSent': {
			...signalFeatureBase,
			'description': localize('accessibility.signals.chatRequestSent', "Plays a signal - sound (audio cue) and/or announcement (alert) - when a chat request is made."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.chatRequestSent.sound', "Plays a sound when a chat request is made."),
					...soundFeatureBase
				},
				'announcement': {
					'description': localize('accessibility.signals.chatRequestSent.announcement', "Announces when a chat request is made."),
					...announcementFeatureBase
				},
			}
		},
		'accessibility.signals.chatResponseReceived': {
			...defaultNoAnnouncement,
			'description': localize('accessibility.signals.chatResponseReceived', "Plays a sound / audio cue when the response has been received."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.chatResponseReceived.sound', "Plays a sound on when the response has been received."),
					...soundFeatureBase
				},
			}
		},
		'accessibility.signals.codeActionTriggered': {
			...defaultNoAnnouncement,
			'description': localize('accessibility.signals.codeActionTriggered', "Plays a sound / audio cue - when a code action has been triggered."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.codeActionTriggered.sound', "Plays a sound when a code action has been triggered."),
					...soundFeatureBase
				}
			}
		},
		'accessibility.signals.codeActionApplied': {
			...defaultNoAnnouncement,
			'description': localize('accessibility.signals.codeActionApplied', "Plays a sound / audio cue when the code action has been applied."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.codeActionApplied.sound', "Plays a sound when the code action has been applied."),
					...soundFeatureBase
				},
			}
		},
		'accessibility.signals.voiceRecordingStarted': {
			...defaultNoAnnouncement,
			'description': localize('accessibility.signals.voiceRecordingStarted', "Plays a sound / audio cue when the voice recording has started."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.voiceRecordingStarted.sound', "Plays a sound when the voice recording has started."),
					...soundFeatureBase,
				},
			},
			'default': {
				'sound': 'on'
			}
		},
		'accessibility.signals.voiceRecordingStopped': {
			...defaultNoAnnouncement,
			'description': localize('accessibility.signals.voiceRecordingStopped', "Plays a sound / audio cue when the voice recording has stopped."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.voiceRecordingStopped.sound', "Plays a sound when the voice recording has stopped."),
					...soundFeatureBase,
					default: 'off'
				},
			}
		},
		'accessibility.signals.clear': {
			...signalFeatureBase,
			'description': localize('accessibility.signals.clear', "Plays a signal - sound (audio cue) and/or announcement (alert) - when a feature is cleared (for example, the terminal, Debug Console, or Output channel)."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.clear.sound', "Plays a sound when a feature is cleared."),
					...soundFeatureBase
				},
				'announcement': {
					'description': localize('accessibility.signals.clear.announcement', "Announces when a feature is cleared."),
					...announcementFeatureBase
				},
			},
		},
		'accessibility.signals.editsUndone': {
			...signalFeatureBase,
			'description': localize('accessibility.signals.editsUndone', "Plays a signal - sound (audio cue) and/or announcement (alert) - when edits have been undone."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.editsUndone.sound', "Plays a sound when edits have been undone."),
					...soundFeatureBase
				},
				'announcement': {
					'description': localize('accessibility.signals.editsUndone.announcement', "Announces when edits have been undone."),
					...announcementFeatureBase
				},
			},
		},
		'accessibility.signals.editsKept': {
			...signalFeatureBase,
			'description': localize('accessibility.signals.editsKept', "Plays a signal - sound (audio cue) and/or announcement (alert) - when edits are kept."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.editsKept.sound', "Plays a sound when edits are kept."),
					...soundFeatureBase
				},
				'announcement': {
					'description': localize('accessibility.signals.editsKept.announcement', "Announces when edits are kept."),
					...announcementFeatureBase
				},
			},
		},
		'accessibility.signals.save': {
			'type': 'object',
			'tags': ['accessibility'],
			additionalProperties: false,
			'markdownDescription': localize('accessibility.signals.save', "Plays a signal - sound (audio cue) and/or announcement (alert) - when a file is saved."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.save.sound', "Plays a sound when a file is saved."),
					'type': 'string',
					'enum': ['userGesture', 'always', 'never'],
					'default': 'never',
					'enumDescriptions': [
						localize('accessibility.signals.save.sound.userGesture', "Plays the sound when a user explicitly saves a file."),
						localize('accessibility.signals.save.sound.always', "Plays the sound whenever a file is saved, including auto save."),
						localize('accessibility.signals.save.sound.never', "Never plays the sound.")
					],
				},
				'announcement': {
					'description': localize('accessibility.signals.save.announcement', "Announces when a file is saved."),
					'type': 'string',
					'enum': ['userGesture', 'always', 'never'],
					'default': 'never',
					'enumDescriptions': [
						localize('accessibility.signals.save.announcement.userGesture', "Announces when a user explicitly saves a file."),
						localize('accessibility.signals.save.announcement.always', "Announces whenever a file is saved, including auto save."),
						localize('accessibility.signals.save.announcement.never', "Never plays the announcement.")
					],
				},
			},
			default: {
				'sound': 'never',
				'announcement': 'never'
			}
		},
		'accessibility.signals.format': {
			'type': 'object',
			'tags': ['accessibility'],
			additionalProperties: false,
			'markdownDescription': localize('accessibility.signals.format', "Plays a signal - sound (audio cue) and/or announcement (alert) - when a file or notebook is formatted."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.format.sound', "Plays a sound when a file or notebook is formatted."),
					'type': 'string',
					'enum': ['userGesture', 'always', 'never'],
					'default': 'never',
					'enumDescriptions': [
						localize('accessibility.signals.format.userGesture', "Plays the sound when a user explicitly formats a file."),
						localize('accessibility.signals.format.always', "Plays the sound whenever a file is formatted, including if it is set to format on save, type, or, paste, or run of a cell."),
						localize('accessibility.signals.format.never', "Never plays the sound.")
					],
				},
				'announcement': {
					'description': localize('accessibility.signals.format.announcement', "Announces when a file or notebook is formatted."),
					'type': 'string',
					'enum': ['userGesture', 'always', 'never'],
					'default': 'never',
					'enumDescriptions': [
						localize('accessibility.signals.format.announcement.userGesture', "Announces when a user explicitly formats a file."),
						localize('accessibility.signals.format.announcement.always', "Announces whenever a file is formatted, including if it is set to format on save, type, or, paste, or run of a cell."),
						localize('accessibility.signals.format.announcement.never', "Never announces.")
					],
				},
			},
			default: {
				'sound': 'never',
				'announcement': 'never'
			}
		},
		'accessibility.signals.chatUserActionRequired': {
			...signalFeatureBase,
			'markdownDescription': localize('accessibility.signals.chatUserActionRequired', "Plays a signal - sound (audio cue) and/or announcement (alert) - when user action is required in the chat."),
			'properties': {
				'sound': {
					'description': localize('accessibility.signals.chatUserActionRequired.sound', "Plays a sound when user action is required in the chat."),
					'type': 'string',
					'enum': ['auto', 'on', 'off'],
					'enumDescriptions': [
						localize('sound.enabled.autoWindow', "Enable sound when a screen reader is attached."),
						localize('sound.enabled.on', "Enable sound."),
						localize('sound.enabled.off', "Disable sound.")
					],
				},
				'announcement': {
					'description': localize('accessibility.signals.chatUserActionRequired.announcement', "Announces when a user action is required in the chat - including information about the action and how to take it."),
					...announcementFeatureBase
				},
			},
			default: {
				'sound': 'auto',
				'announcement': 'auto'
			},
			tags: ['accessibility']
		},
		'accessibility.underlineLinks': {
			'type': 'boolean',
			'description': localize('accessibility.underlineLinks', "Controls whether links should be underlined in the workbench."),
			'default': false,
		},
		'accessibility.debugWatchVariableAnnouncements': {
			'type': 'boolean',
			'description': localize('accessibility.debugWatchVariableAnnouncements', "Controls whether variable changes should be announced in the debug watch view."),
			'default': true,
		},
		'accessibility.replEditor.readLastExecutionOutput': {
			'type': 'boolean',
			'description': localize('accessibility.replEditor.readLastExecutedOutput', "Controls whether the output from an execution in the native REPL will be announced."),
			'default': true,
		},
		'accessibility.replEditor.autoFocusReplExecution': {
			type: 'string',
			enum: ['none', 'input', 'lastExecution'],
			default: 'input',
			description: localize('replEditor.autoFocusAppendedCell', "Control whether focus should automatically be sent to the REPL when code is executed."),
		},
		'accessibility.windowTitleOptimized': {
			'type': 'boolean',
			'default': true,
			'markdownDescription': localize('accessibility.windowTitleOptimized', "Controls whether the {0} should be optimized for screen readers when in screen reader mode. When enabled, the window title will have {1} appended to the end.", '`#window.title#`', '`activeEditorState`')
		},
		'accessibility.openChatEditedFiles': {
			'type': 'boolean',
			'default': false,
			'markdownDescription': localize('accessibility.openChatEditedFiles', "Controls whether files should be opened when the chat agent has applied edits to them.")
		},
		'accessibility.verboseChatProgressUpdates': {
			'type': 'boolean',
			'default': true,
			'markdownDescription': localize('accessibility.verboseChatProgressUpdates', "Controls whether verbose progress announcements should be made when a chat request is in progress, including information like searched text for <search term> with X results, created file <file_name>, or read file <file path>.")
		}
	}
};

export function registerAccessibilityConfiguration() {
	const registry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);
	registry.registerConfiguration(configuration);

	registry.registerConfiguration({
		...workbenchConfigurationNodeBase,
		properties: {
			[AccessibilityWorkbenchSettingId.DimUnfocusedEnabled]: {
				description: localize('dimUnfocusedEnabled', 'Whether to dim unfocused editors and terminals, which makes it more clear where typed input will go to. This works with the majority of editors with the notable exceptions of those that utilize iframes like notebooks and extension webview editors.'),
				type: 'boolean',
				default: false,
				tags: ['accessibility'],
				scope: ConfigurationScope.APPLICATION,
			},
			[AccessibilityWorkbenchSettingId.DimUnfocusedOpacity]: {
				markdownDescription: localize('dimUnfocusedOpacity', 'The opacity fraction (0.2 to 1.0) to use for unfocused editors and terminals. This will only take effect when {0} is enabled.', `\`#${AccessibilityWorkbenchSettingId.DimUnfocusedEnabled}#\``),
				type: 'number',
				minimum: ViewDimUnfocusedOpacityProperties.Minimum,
				maximum: ViewDimUnfocusedOpacityProperties.Maximum,
				default: ViewDimUnfocusedOpacityProperties.Default,
				tags: ['accessibility'],
				scope: ConfigurationScope.APPLICATION,
			},
			[AccessibilityWorkbenchSettingId.HideAccessibleView]: {
				description: localize('accessibility.hideAccessibleView', "Controls whether the Accessible View is hidden."),
				type: 'boolean',
				default: false,
				tags: ['accessibility']
			},
			[AccessibilityWorkbenchSettingId.VerboseChatProgressUpdates]: {
				'type': 'boolean',
				'default': true,
				'markdownDescription': localize('accessibility.verboseChatProgressUpdates', "Controls whether verbose progress announcements should be made when a chat request is in progress, including information like searched text for <search term> with X results, created file <file_name>, or read file <file path>.")
			}
		}
	});
}

export { AccessibilityVoiceSettingId };

export const SpeechTimeoutDefault = 0;

export class DynamicSpeechAccessibilityConfiguration extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.dynamicSpeechAccessibilityConfiguration';

	constructor(
		@ISpeechService private readonly speechService: ISpeechService
	) {
		super();

		this._register(Event.runAndSubscribe(speechService.onDidChangeHasSpeechProvider, () => this.updateConfiguration()));
	}

	private updateConfiguration(): void {
		if (!this.speechService.hasSpeechProvider) {
			return; // these settings require a speech provider
		}

		const languages = this.getLanguages();
		const languagesSorted = Object.keys(languages).sort((langA, langB) => {
			return languages[langA].name.localeCompare(languages[langB].name);
		});

		const registry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);
		registry.registerConfiguration({
			...accessibilityConfigurationNodeBase,
			properties: {
				[AccessibilityVoiceSettingId.SpeechTimeout]: {
					'markdownDescription': localize('voice.speechTimeout', "The duration in milliseconds that voice speech recognition remains active after you stop speaking. For example in a chat session, the transcribed text is submitted automatically after the timeout is met. Set to `0` to disable this feature."),
					'type': 'number',
					'default': SpeechTimeoutDefault,
					'minimum': 0,
					'tags': ['accessibility']
				},
				[AccessibilityVoiceSettingId.IgnoreCodeBlocks]: {
					'markdownDescription': localize('voice.ignoreCodeBlocks', "Whether to ignore code snippets in text-to-speech synthesis."),
					'type': 'boolean',
					'default': false,
					'tags': ['accessibility']
				},
				[AccessibilityVoiceSettingId.SpeechLanguage]: {
					'markdownDescription': localize('voice.speechLanguage', "The language that text-to-speech and speech-to-text should use. Select `auto` to use the configured display language if possible. Note that not all display languages maybe supported by speech recognition and synthesizers."),
					'type': 'string',
					'enum': languagesSorted,
					'default': 'auto',
					'tags': ['accessibility'],
					'enumDescriptions': languagesSorted.map(key => languages[key].name),
					'enumItemLabels': languagesSorted.map(key => languages[key].name)
				},
				[AccessibilityVoiceSettingId.AutoSynthesize]: {
					'type': 'string',
					'enum': ['on', 'off'],
					'enumDescriptions': [
						localize('accessibility.voice.autoSynthesize.on', "Enable the feature. When a screen reader is enabled, note that this will disable aria updates."),
						localize('accessibility.voice.autoSynthesize.off', "Disable the feature."),
					],
					'markdownDescription': localize('autoSynthesize', "Whether a textual response should automatically be read out aloud when speech was used as input. For example in a chat session, a response is automatically synthesized when voice was used as chat request."),
					'default': 'off',
					'tags': ['accessibility']
				}
			}
		});
	}

	private getLanguages(): { [locale: string]: { name: string } } {
		return {
			['auto']: {
				name: localize('speechLanguage.auto', "Auto (Use Display Language)")
			},
			...SPEECH_LANGUAGES
		};
	}
}

Registry.as<IConfigurationMigrationRegistry>(WorkbenchExtensions.ConfigurationMigration)
	.registerConfigurationMigrations([{
		key: 'audioCues.volume',
		migrateFn: (value, accessor) => {
			return [
				['accessibility.signalOptions.volume', { value }],
				['audioCues.volume', { value: undefined }]
			];
		}
	}]);

Registry.as<IConfigurationMigrationRegistry>(WorkbenchExtensions.ConfigurationMigration)
	.registerConfigurationMigrations([{
		key: 'audioCues.debouncePositionChanges',
		migrateFn: (value) => {
			return [
				['accessibility.signalOptions.debouncePositionChanges', { value }],
				['audioCues.debouncePositionChanges', { value: undefined }]
			];
		}
	}]);

Registry.as<IConfigurationMigrationRegistry>(WorkbenchExtensions.ConfigurationMigration)
	.registerConfigurationMigrations([{
		key: 'accessibility.signalOptions',
		migrateFn: (value, accessor) => {
			const delayGeneral = getDelaysFromConfig(accessor, 'general');
			const delayError = getDelaysFromConfig(accessor, 'errorAtPosition');
			const delayWarning = getDelaysFromConfig(accessor, 'warningAtPosition');
			const volume = getVolumeFromConfig(accessor);
			const debouncePositionChanges = getDebouncePositionChangesFromConfig(accessor);
			const result: [key: string, { value: any }][] = [];
			if (!!volume) {
				result.push(['accessibility.signalOptions.volume', { value: volume }]);
			}
			if (!!delayGeneral) {
				result.push(['accessibility.signalOptions.experimental.delays.general', { value: delayGeneral }]);
			}
			if (!!delayError) {
				result.push(['accessibility.signalOptions.experimental.delays.errorAtPosition', { value: delayError }]);
			}
			if (!!delayWarning) {
				result.push(['accessibility.signalOptions.experimental.delays.warningAtPosition', { value: delayWarning }]);
			}
			if (!!debouncePositionChanges) {
				result.push(['accessibility.signalOptions.debouncePositionChanges', { value: debouncePositionChanges }]);
			}
			result.push(['accessibility.signalOptions', { value: undefined }]);
			return result;
		}
	}]);


Registry.as<IConfigurationMigrationRegistry>(WorkbenchExtensions.ConfigurationMigration)
	.registerConfigurationMigrations([{
		key: 'accessibility.signals.sounds.volume',
		migrateFn: (value) => {
			return [
				['accessibility.signalOptions.volume', { value }],
				['accessibility.signals.sounds.volume', { value: undefined }]
			];
		}
	}]);

Registry.as<IConfigurationMigrationRegistry>(WorkbenchExtensions.ConfigurationMigration)
	.registerConfigurationMigrations([{
		key: 'accessibility.signals.debouncePositionChanges',
		migrateFn: (value) => {
			return [
				['accessibility.signalOptions.debouncePositionChanges', { value }],
				['accessibility.signals.debouncePositionChanges', { value: undefined }]
			];
		}
	}]);

function getDelaysFromConfig(accessor: (key: string) => any, type: 'general' | 'errorAtPosition' | 'warningAtPosition'): { announcement: number; sound: number } | undefined {
	return accessor(`accessibility.signalOptions.experimental.delays.${type}`) || accessor('accessibility.signalOptions')?.['experimental.delays']?.[`${type}`] || accessor('accessibility.signalOptions')?.['delays']?.[`${type}`];
}

function getVolumeFromConfig(accessor: (key: string) => any): string | undefined {
	return accessor('accessibility.signalOptions.volume') || accessor('accessibility.signalOptions')?.volume || accessor('accessibility.signals.sounds.volume') || accessor('audioCues.volume');
}

function getDebouncePositionChangesFromConfig(accessor: (key: string) => any): number | undefined {
	return accessor('accessibility.signalOptions.debouncePositionChanges') || accessor('accessibility.signalOptions')?.debouncePositionChanges || accessor('accessibility.signals.debouncePositionChanges') || accessor('audioCues.debouncePositionChanges');
}

Registry.as<IConfigurationMigrationRegistry>(WorkbenchExtensions.ConfigurationMigration)
	.registerConfigurationMigrations([{
		key: AccessibilityVoiceSettingId.AutoSynthesize,
		migrateFn: (value: boolean) => {
			let newValue: string | undefined;
			if (value === true) {
				newValue = 'on';
			} else if (value === false) {
				newValue = 'off';
			} else {
				return [];
			}
			return [
				[AccessibilityVoiceSettingId.AutoSynthesize, { value: newValue }],
			];
		}
	}]);

Registry.as<IConfigurationMigrationRegistry>(WorkbenchExtensions.ConfigurationMigration)
	.registerConfigurationMigrations([{
		key: 'accessibility.signals.chatResponsePending',
		migrateFn: (value, accessor) => {
			return [
				['accessibility.signals.progress', { value }],
				['accessibility.signals.chatResponsePending', { value: undefined }],
			];
		}
	}]);

Registry.as<IConfigurationMigrationRegistry>(WorkbenchExtensions.ConfigurationMigration)
	.registerConfigurationMigrations(AccessibilitySignal.allAccessibilitySignals.map<ConfigurationMigration | undefined>(item => item.legacySoundSettingsKey ? ({
		key: item.legacySoundSettingsKey,
		migrateFn: (sound, accessor) => {
			const configurationKeyValuePairs: ConfigurationKeyValuePairs = [];
			const legacyAnnouncementSettingsKey = item.legacyAnnouncementSettingsKey;
			let announcement: string | undefined;
			if (legacyAnnouncementSettingsKey) {
				announcement = accessor(legacyAnnouncementSettingsKey) ?? undefined;
				if (announcement !== undefined && typeof announcement !== 'string') {
					announcement = announcement ? 'auto' : 'off';
				}
			}
			configurationKeyValuePairs.push([`${item.legacySoundSettingsKey}`, { value: undefined }]);
			configurationKeyValuePairs.push([`${item.settingsKey}`, { value: announcement !== undefined ? { announcement, sound } : { sound } }]);
			return configurationKeyValuePairs;
		}
	}) : undefined).filter(isDefined));

Registry.as<IConfigurationMigrationRegistry>(WorkbenchExtensions.ConfigurationMigration)
	.registerConfigurationMigrations(AccessibilitySignal.allAccessibilitySignals.filter(i => !!i.legacyAnnouncementSettingsKey && !!i.legacySoundSettingsKey).map(item => ({
		key: item.legacyAnnouncementSettingsKey!,
		migrateFn: (announcement, accessor) => {
			const configurationKeyValuePairs: ConfigurationKeyValuePairs = [];
			const sound = accessor(item.settingsKey)?.sound || accessor(item.legacySoundSettingsKey!);
			if (announcement !== undefined && typeof announcement !== 'string') {
				announcement = announcement ? 'auto' : 'off';
			}
			configurationKeyValuePairs.push([`${item.settingsKey}`, { value: announcement !== undefined ? { announcement, sound } : { sound } }]);
			configurationKeyValuePairs.push([`${item.legacyAnnouncementSettingsKey}`, { value: undefined }]);
			configurationKeyValuePairs.push([`${item.legacySoundSettingsKey}`, { value: undefined }]);
			return configurationKeyValuePairs;
		}
	})));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/accessibility/browser/accessibilityStatus.ts]---
Location: vscode-main/src/vs/workbench/contrib/accessibility/browser/accessibilityStatus.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { Event } from '../../../../base/common/event.js';
import Severity from '../../../../base/common/severity.js';
import { localize } from '../../../../nls.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { INotificationHandle, INotificationService, NotificationPriority } from '../../../../platform/notification/common/notification.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IStatusbarEntryAccessor, IStatusbarService, StatusbarAlignment } from '../../../services/statusbar/browser/statusbar.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';

export class AccessibilityStatus extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.accessibilityStatus';

	private screenReaderNotification: INotificationHandle | null = null;
	private promptedScreenReader: boolean = false;
	private readonly screenReaderModeElement = this._register(new MutableDisposable<IStatusbarEntryAccessor>());

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@INotificationService private readonly notificationService: INotificationService,
		@IAccessibilityService private readonly accessibilityService: IAccessibilityService,
		@IStatusbarService private readonly statusbarService: IStatusbarService,
		@IOpenerService private readonly openerService: IOpenerService,
	) {
		super();

		this._register(CommandsRegistry.registerCommand({ id: 'showEditorScreenReaderNotification', handler: () => this.showScreenReaderNotification() }));

		this.updateScreenReaderModeElement(this.accessibilityService.isScreenReaderOptimized());

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.accessibilityService.onDidChangeScreenReaderOptimized(() => this.onScreenReaderModeChange()));

		this._register(this.configurationService.onDidChangeConfiguration(c => {
			if (c.affectsConfiguration('editor.accessibilitySupport')) {
				this.onScreenReaderModeChange();
			}
		}));
	}

	private showScreenReaderNotification(): void {
		this.screenReaderNotification = this.notificationService.prompt(
			Severity.Info,
			localize('screenReaderDetectedExplanation.question', "Screen reader usage detected. Do you want to enable {0} to optimize the editor for screen reader usage?", 'editor.accessibilitySupport'),
			[{
				label: localize('screenReaderDetectedExplanation.answerYes', "Yes"),
				run: () => {
					this.configurationService.updateValue('editor.accessibilitySupport', 'on', ConfigurationTarget.USER);
				}
			}, {
				label: localize('screenReaderDetectedExplanation.answerNo', "No"),
				run: () => {
					this.configurationService.updateValue('editor.accessibilitySupport', 'off', ConfigurationTarget.USER);
				}
			},
			{
				label: localize('screenReaderDetectedExplanation.answerLearnMore', "Learn More"),
				run: () => {
					this.openerService.open('https://code.visualstudio.com/docs/editor/accessibility#_screen-readers');
				}
			}],
			{
				sticky: true,
				priority: NotificationPriority.URGENT
			}
		);

		Event.once(this.screenReaderNotification.onDidClose)(() => this.screenReaderNotification = null);
	}
	private updateScreenReaderModeElement(visible: boolean): void {
		if (visible) {
			if (!this.screenReaderModeElement.value) {
				const text = localize('screenReaderDetected', "Screen Reader Optimized");
				this.screenReaderModeElement.value = this.statusbarService.addEntry({
					name: localize('status.editor.screenReaderMode', "Screen Reader Mode"),
					text,
					ariaLabel: text,
					command: 'showEditorScreenReaderNotification',
					kind: 'prominent',
					showInAllWindows: true
				}, 'status.editor.screenReaderMode', StatusbarAlignment.RIGHT, 100.6);
			}
		} else {
			this.screenReaderModeElement.clear();
		}
	}

	private onScreenReaderModeChange(): void {

		// We only support text based editors
		const screenReaderDetected = this.accessibilityService.isScreenReaderOptimized();
		if (screenReaderDetected) {
			const screenReaderConfiguration = this.configurationService.getValue('editor.accessibilitySupport');
			if (screenReaderConfiguration === 'auto') {
				if (!this.promptedScreenReader) {
					this.promptedScreenReader = true;
					setTimeout(() => this.showScreenReaderNotification(), 100);
				}
			}
		}

		if (this.screenReaderNotification) {
			this.screenReaderNotification.close();
		}
		this.updateScreenReaderModeElement(this.accessibilityService.isScreenReaderOptimized());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/accessibility/browser/accessibleView.ts]---
Location: vscode-main/src/vs/workbench/contrib/accessibility/browser/accessibleView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EventType, addDisposableListener, getActiveWindow, getWindow, isActiveElement } from '../../../../base/browser/dom.js';
import { IKeyboardEvent, StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { ActionsOrientation } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { alert } from '../../../../base/browser/ui/aria/aria.js';
import { IAction } from '../../../../base/common/actions.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import * as marked from '../../../../base/common/marked/marked.js';
import { Schemas } from '../../../../base/common/network.js';
import { isMacintosh, isWindows } from '../../../../base/common/platform.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { IEditorConstructionOptions } from '../../../../editor/browser/config/editorConfiguration.js';
import { EditorExtensionsRegistry } from '../../../../editor/browser/editorExtensions.js';
import { CodeEditorWidget, ICodeEditorWidgetOptions } from '../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { IPosition, Position } from '../../../../editor/common/core/position.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ITextModelContentProvider, ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { AccessibilityHelpNLS } from '../../../../editor/common/standaloneStrings.js';
import { CodeActionController } from '../../../../editor/contrib/codeAction/browser/codeActionController.js';
import { FloatingEditorToolbar } from '../../../../editor/contrib/floatingMenu/browser/floatingMenu.js';
import { localize } from '../../../../nls.js';
import { AccessibleContentProvider, AccessibleViewProviderId, AccessibleViewType, ExtensionContentProvider, IAccessibleViewService, IAccessibleViewSymbol, isIAccessibleViewContentProvider } from '../../../../platform/accessibility/browser/accessibleView.js';
import { ACCESSIBLE_VIEW_SHOWN_STORAGE_PREFIX, IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { getFlatActionBarActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { WorkbenchToolBar } from '../../../../platform/actions/browser/toolbar.js';
import { IMenuService, MenuId } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextViewDelegate, IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ResultKind } from '../../../../platform/keybinding/common/keybindingResolver.js';
import { ILayoutService } from '../../../../platform/layout/browser/layoutService.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IQuickInputService, IQuickPick, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { FloatingEditorClickMenu } from '../../../browser/codeeditor.js';
import { IChatCodeBlockContextProviderService } from '../../chat/browser/chat.js';
import { ICodeBlockActionContext } from '../../chat/browser/codeBlockPart.js';
import { getSimpleEditorOptions } from '../../codeEditor/browser/simpleEditorOptions.js';
import { AccessibilityCommandId } from '../common/accessibilityCommands.js';
import { AccessibilityVerbositySettingId, AccessibilityWorkbenchSettingId, accessibilityHelpIsShown, accessibleViewContainsCodeBlocks, accessibleViewCurrentProviderId, accessibleViewGoToSymbolSupported, accessibleViewHasAssignedKeybindings, accessibleViewHasUnassignedKeybindings, accessibleViewInCodeBlock, accessibleViewIsShown, accessibleViewOnLastLine, accessibleViewSupportsNavigation, accessibleViewVerbosityEnabled } from './accessibilityConfiguration.js';
import { resolveContentAndKeybindingItems } from './accessibleViewKeybindingResolver.js';

const enum DIMENSIONS {
	MAX_WIDTH = 600
}

export type AccesibleViewContentProvider = AccessibleContentProvider | ExtensionContentProvider;

interface ICodeBlock {
	startLine: number;
	endLine: number;
	code: string;
	languageId?: string;
	chatSessionResource: URI | undefined;
}

export class AccessibleView extends Disposable implements ITextModelContentProvider {
	private _editorWidget: CodeEditorWidget;

	private _accessiblityHelpIsShown: IContextKey<boolean>;
	private _onLastLine: IContextKey<boolean>;
	private _accessibleViewIsShown: IContextKey<boolean>;
	private _accessibleViewSupportsNavigation: IContextKey<boolean>;
	private _accessibleViewVerbosityEnabled: IContextKey<boolean>;
	private _accessibleViewGoToSymbolSupported: IContextKey<boolean>;
	private _accessibleViewCurrentProviderId: IContextKey<string>;
	private _accessibleViewInCodeBlock: IContextKey<boolean>;
	private _accessibleViewContainsCodeBlocks: IContextKey<boolean>;
	private _hasUnassignedKeybindings: IContextKey<boolean>;
	private _hasAssignedKeybindings: IContextKey<boolean>;

	private _codeBlocks?: ICodeBlock[];
	private _isInQuickPick: boolean = false;

	get editorWidget() { return this._editorWidget; }
	private _container: HTMLElement;
	private _title: HTMLElement;
	private readonly _toolbar: WorkbenchToolBar;

	private _currentProvider: AccesibleViewContentProvider | undefined;
	private _currentContent: string | undefined;

	private _lastProvider: AccesibleViewContentProvider | undefined;

	private _viewContainer: HTMLElement | undefined;


	constructor(
		@IOpenerService private readonly _openerService: IOpenerService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IModelService private readonly _modelService: IModelService,
		@IContextViewService private readonly _contextViewService: IContextViewService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@ILayoutService private readonly _layoutService: ILayoutService,
		@IMenuService private readonly _menuService: IMenuService,
		@ICommandService private readonly _commandService: ICommandService,
		@IChatCodeBlockContextProviderService private readonly _codeBlockContextProviderService: IChatCodeBlockContextProviderService,
		@IStorageService private readonly _storageService: IStorageService,
		@ITextModelService private readonly textModelResolverService: ITextModelService,
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
		@IAccessibilitySignalService private readonly _accessibilitySignalService: IAccessibilitySignalService,
	) {
		super();

		this._accessiblityHelpIsShown = accessibilityHelpIsShown.bindTo(this._contextKeyService);
		this._accessibleViewIsShown = accessibleViewIsShown.bindTo(this._contextKeyService);
		this._accessibleViewSupportsNavigation = accessibleViewSupportsNavigation.bindTo(this._contextKeyService);
		this._accessibleViewVerbosityEnabled = accessibleViewVerbosityEnabled.bindTo(this._contextKeyService);
		this._accessibleViewGoToSymbolSupported = accessibleViewGoToSymbolSupported.bindTo(this._contextKeyService);
		this._accessibleViewCurrentProviderId = accessibleViewCurrentProviderId.bindTo(this._contextKeyService);
		this._accessibleViewInCodeBlock = accessibleViewInCodeBlock.bindTo(this._contextKeyService);
		this._accessibleViewContainsCodeBlocks = accessibleViewContainsCodeBlocks.bindTo(this._contextKeyService);
		this._onLastLine = accessibleViewOnLastLine.bindTo(this._contextKeyService);
		this._hasUnassignedKeybindings = accessibleViewHasUnassignedKeybindings.bindTo(this._contextKeyService);
		this._hasAssignedKeybindings = accessibleViewHasAssignedKeybindings.bindTo(this._contextKeyService);

		this._container = document.createElement('div');
		this._container.classList.add('accessible-view');
		if (this._configurationService.getValue(AccessibilityWorkbenchSettingId.HideAccessibleView)) {
			this._container.classList.add('hide');
		}
		const codeEditorWidgetOptions: ICodeEditorWidgetOptions = {
			contributions: EditorExtensionsRegistry.getEditorContributions()
				.filter(c => c.id !== CodeActionController.ID && c.id !== FloatingEditorClickMenu.ID && c.id !== FloatingEditorToolbar.ID)
		};
		const titleBar = document.createElement('div');
		titleBar.classList.add('accessible-view-title-bar');
		this._title = document.createElement('div');
		this._title.classList.add('accessible-view-title');
		titleBar.appendChild(this._title);
		const actionBar = document.createElement('div');
		actionBar.classList.add('accessible-view-action-bar');
		titleBar.appendChild(actionBar);
		this._container.appendChild(titleBar);
		this._toolbar = this._register(_instantiationService.createInstance(WorkbenchToolBar, actionBar, { orientation: ActionsOrientation.HORIZONTAL }));
		this._toolbar.context = { viewId: 'accessibleView' };
		const toolbarElt = this._toolbar.getElement();
		toolbarElt.tabIndex = 0;

		const editorOptions: IEditorConstructionOptions = {
			...getSimpleEditorOptions(this._configurationService),
			lineDecorationsWidth: 6,
			dragAndDrop: false,
			cursorWidth: 1,
			wordWrap: 'off',
			wrappingStrategy: 'advanced',
			wrappingIndent: 'none',
			padding: { top: 2, bottom: 2 },
			quickSuggestions: false,
			renderWhitespace: 'none',
			dropIntoEditor: { enabled: false },
			readOnly: true,
			fontFamily: 'var(--monaco-monospace-font)'
		};
		this.textModelResolverService.registerTextModelContentProvider(Schemas.accessibleView, this);

		this._editorWidget = this._register(this._instantiationService.createInstance(CodeEditorWidget, this._container, editorOptions, codeEditorWidgetOptions));
		this._register(this._accessibilityService.onDidChangeScreenReaderOptimized(() => {
			if (this._currentProvider && this._accessiblityHelpIsShown.get()) {
				this.show(this._currentProvider);
			}
		}));
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (isIAccessibleViewContentProvider(this._currentProvider) && e.affectsConfiguration(this._currentProvider.verbositySettingKey)) {
				if (this._accessiblityHelpIsShown.get()) {
					this.show(this._currentProvider);
				}
				this._accessibleViewVerbosityEnabled.set(this._configurationService.getValue(this._currentProvider.verbositySettingKey));
				this._updateToolbar(this._currentProvider.actions, this._currentProvider.options.type);
			}
			if (e.affectsConfiguration(AccessibilityWorkbenchSettingId.HideAccessibleView)) {
				this._container.classList.toggle('hide', this._configurationService.getValue(AccessibilityWorkbenchSettingId.HideAccessibleView));
			}
		}));
		this._register(this._editorWidget.onDidDispose(() => this._resetContextKeys()));
		this._register(this._editorWidget.onDidChangeCursorPosition(() => {
			this._onLastLine.set(this._editorWidget.getPosition()?.lineNumber === this._editorWidget.getModel()?.getLineCount());
			const cursorPosition = this._editorWidget.getPosition()?.lineNumber;
			if (this._codeBlocks && cursorPosition !== undefined) {
				const inCodeBlock = this._codeBlocks.find(c => c.startLine <= cursorPosition && c.endLine >= cursorPosition) !== undefined;
				this._accessibleViewInCodeBlock.set(inCodeBlock);
			}
			this._playDiffSignals();
		}));
	}

	private _playDiffSignals(): void {
		if (this._currentProvider?.id !== AccessibleViewProviderId.DiffEditor && this._currentProvider?.id !== AccessibleViewProviderId.InlineCompletions) {
			return;
		}
		const position = this._editorWidget.getPosition();
		const model = this._editorWidget.getModel();
		if (!position || !model) {
			return undefined;
		}
		const lineContent = model.getLineContent(position.lineNumber);
		if (lineContent?.startsWith('+')) {
			this._accessibilitySignalService.playSignal(AccessibilitySignal.diffLineInserted);
		} else if (lineContent?.startsWith('-')) {
			this._accessibilitySignalService.playSignal(AccessibilitySignal.diffLineDeleted);
		}
	}

	provideTextContent(resource: URI): Promise<ITextModel | null> | null {
		return this._getTextModel(resource);
	}

	private _resetContextKeys(): void {
		this._accessiblityHelpIsShown.reset();
		this._accessibleViewIsShown.reset();
		this._accessibleViewSupportsNavigation.reset();
		this._accessibleViewVerbosityEnabled.reset();
		this._accessibleViewGoToSymbolSupported.reset();
		this._accessibleViewCurrentProviderId.reset();
		this._hasAssignedKeybindings.reset();
		this._hasUnassignedKeybindings.reset();
	}

	getPosition(id?: AccessibleViewProviderId): Position | undefined {
		if (!id || !this._lastProvider || this._lastProvider.id !== id) {
			return undefined;
		}
		return this._editorWidget.getPosition() || undefined;
	}

	setPosition(position: Position, reveal?: boolean, select?: boolean): void {
		this._editorWidget.setPosition(position);
		if (reveal) {
			this._editorWidget.revealPosition(position);
		}
		if (select) {
			const lineLength = this._editorWidget.getModel()?.getLineLength(position.lineNumber) ?? 0;
			if (lineLength) {
				this._editorWidget.setSelection({ startLineNumber: position.lineNumber, startColumn: 1, endLineNumber: position.lineNumber, endColumn: lineLength + 1 });
			}
		}
	}

	getCodeBlockContext(): ICodeBlockActionContext | undefined {
		const position = this._editorWidget.getPosition();
		if (!this._codeBlocks?.length || !position) {
			return;
		}
		const codeBlockIndex = this._codeBlocks?.findIndex(c => c.startLine <= position?.lineNumber && c.endLine >= position?.lineNumber);
		const codeBlock = codeBlockIndex !== undefined && codeBlockIndex > -1 ? this._codeBlocks[codeBlockIndex] : undefined;
		if (!codeBlock || codeBlockIndex === undefined) {
			return;
		}
		return { code: codeBlock.code, languageId: codeBlock.languageId, codeBlockIndex, element: undefined, chatSessionResource: codeBlock.chatSessionResource };
	}

	navigateToCodeBlock(type: 'next' | 'previous'): void {
		const position = this._editorWidget.getPosition();
		if (!this._codeBlocks?.length || !position) {
			return;
		}
		let codeBlock;
		const codeBlocks = this._codeBlocks.slice();
		if (type === 'previous') {
			codeBlock = codeBlocks.reverse().find(c => c.endLine < position.lineNumber);
		} else {
			codeBlock = codeBlocks.find(c => c.startLine > position.lineNumber);
		}
		if (!codeBlock) {
			return;
		}
		this.setPosition(new Position(codeBlock.startLine, 1), true);
	}

	showLastProvider(id: AccessibleViewProviderId): void {
		if (!this._lastProvider || this._lastProvider.options.id !== id) {
			return;
		}
		this.show(this._lastProvider);
	}

	show(provider?: AccesibleViewContentProvider, symbol?: IAccessibleViewSymbol, showAccessibleViewHelp?: boolean, position?: IPosition): void {
		provider = provider ?? this._currentProvider;
		if (!provider) {
			return;
		}
		provider.onOpen?.();
		const delegate: IContextViewDelegate = {
			getAnchor: () => { return { x: (getActiveWindow().innerWidth / 2) - ((Math.min(this._layoutService.activeContainerDimension.width * 0.62 /* golden cut */, DIMENSIONS.MAX_WIDTH)) / 2), y: this._layoutService.activeContainerOffset.quickPickTop }; },
			render: (container) => {
				this._viewContainer = container;
				this._viewContainer.classList.add('accessible-view-container');
				return this._render(provider, container, showAccessibleViewHelp);
			},
			onHide: () => {
				if (!showAccessibleViewHelp) {
					this._updateLastProvider();
					this._currentProvider?.dispose();
					this._currentProvider = undefined;
					this._resetContextKeys();
				}
			}
		};
		this._contextViewService.showContextView(delegate);

		if (position) {
			// Context view takes time to show up, so we need to wait for it to show up before we can set the position
			queueMicrotask(() => {
				this._editorWidget.revealLine(position.lineNumber);
				this._editorWidget.setSelection({ startLineNumber: position.lineNumber, startColumn: position.column, endLineNumber: position.lineNumber, endColumn: position.column });
			});
		}

		if (symbol && this._currentProvider) {
			this.showSymbol(this._currentProvider, symbol);
		}
		if (provider instanceof AccessibleContentProvider && provider.onDidRequestClearLastProvider) {
			this._register(provider.onDidRequestClearLastProvider((id: string) => {
				if (this._lastProvider?.options.id === id) {
					this._lastProvider = undefined;
				}
			}));
		}
		if (provider.options.id) {
			// only cache a provider with an ID so that it will eventually be cleared.
			this._lastProvider = provider;
		}
		if (provider.id === AccessibleViewProviderId.PanelChat || provider.id === AccessibleViewProviderId.QuickChat) {
			this._register(this._codeBlockContextProviderService.registerProvider({ getCodeBlockContext: () => this.getCodeBlockContext() }, 'accessibleView'));
		}
		if (provider instanceof ExtensionContentProvider) {
			this._storageService.store(`${ACCESSIBLE_VIEW_SHOWN_STORAGE_PREFIX}${provider.id}`, true, StorageScope.APPLICATION, StorageTarget.USER);
		}
		if (provider.onDidChangeContent) {
			this._register(provider.onDidChangeContent(() => {
				if (this._viewContainer) { this._render(provider, this._viewContainer, showAccessibleViewHelp); }
			}));
		}
	}

	previous(): void {
		const newContent = this._currentProvider?.providePreviousContent?.();
		if (!this._currentProvider || !this._viewContainer || !newContent) {
			return;
		}
		this._render(this._currentProvider, this._viewContainer, undefined, newContent);
	}

	next(): void {
		const newContent = this._currentProvider?.provideNextContent?.();
		if (!this._currentProvider || !this._viewContainer || !newContent) {
			return;
		}
		this._render(this._currentProvider, this._viewContainer, undefined, newContent);
	}

	private _verbosityEnabled(): boolean {
		if (!this._currentProvider) {
			return false;
		}
		return isIAccessibleViewContentProvider(this._currentProvider) ? this._configurationService.getValue(this._currentProvider.verbositySettingKey) === true : this._storageService.getBoolean(`${ACCESSIBLE_VIEW_SHOWN_STORAGE_PREFIX}${this._currentProvider.id}`, StorageScope.APPLICATION, false);
	}

	goToSymbol(): void {
		if (!this._currentProvider) {
			return;
		}
		this._isInQuickPick = true;
		this._instantiationService.createInstance(AccessibleViewSymbolQuickPick, this).show(this._currentProvider);
	}

	calculateCodeBlocks(markdown?: string): void {
		if (!markdown) {
			return;
		}
		if (this._currentProvider?.id !== AccessibleViewProviderId.PanelChat && this._currentProvider?.id !== AccessibleViewProviderId.QuickChat) {
			return;
		}
		if (this._currentProvider.options.language && this._currentProvider.options.language !== 'markdown') {
			// Symbols haven't been provided and we cannot parse this language
			return;
		}
		const lines = markdown.split('\n');
		this._codeBlocks = [];
		let inBlock = false;
		let startLine = 0;

		let languageId: string | undefined;
		lines.forEach((line, i) => {
			if (!inBlock && line.startsWith('```')) {
				inBlock = true;
				startLine = i + 1;
				languageId = line.substring(3).trim();
			} else if (inBlock && line.endsWith('```')) {
				inBlock = false;
				const endLine = i;
				const code = lines.slice(startLine, endLine).join('\n');
				this._codeBlocks?.push({ startLine, endLine, code, languageId, chatSessionResource: undefined });
			}
		});
		this._accessibleViewContainsCodeBlocks.set(this._codeBlocks.length > 0);
	}

	getSymbols(): IAccessibleViewSymbol[] | undefined {
		const provider = this._currentProvider ? this._currentProvider : undefined;
		if (!this._currentContent || !provider) {
			return;
		}
		const symbols: IAccessibleViewSymbol[] = 'getSymbols' in provider ? provider.getSymbols?.() || [] : [];
		if (symbols?.length) {
			return symbols;
		}
		if (provider.options.language && provider.options.language !== 'markdown') {
			// Symbols haven't been provided and we cannot parse this language
			return;
		}
		const markdownTokens: marked.TokensList | undefined = marked.marked.lexer(this._currentContent);
		if (!markdownTokens) {
			return;
		}
		this._convertTokensToSymbols(markdownTokens, symbols);
		return symbols.length ? symbols : undefined;
	}

	openHelpLink(): void {
		if (!this._currentProvider?.options.readMoreUrl) {
			return;
		}
		this._openerService.open(URI.parse(this._currentProvider.options.readMoreUrl));
	}

	configureKeybindings(unassigned: boolean): void {
		this._isInQuickPick = true;
		const provider = this._updateLastProvider();
		const items = unassigned ? provider?.options?.configureKeybindingItems : provider?.options?.configuredKeybindingItems;
		if (!items) {
			return;
		}
		const disposables = this._register(new DisposableStore());
		const quickPick: IQuickPick<IQuickPickItem> = disposables.add(this._quickInputService.createQuickPick());
		quickPick.items = items;
		quickPick.title = localize('keybindings', 'Configure keybindings');
		quickPick.placeholder = localize('selectKeybinding', 'Select a command ID to configure a keybinding for it');
		quickPick.show();
		disposables.add(quickPick.onDidAccept(async () => {
			const item = quickPick.selectedItems[0];
			if (item) {
				await this._commandService.executeCommand('workbench.action.openGlobalKeybindings', item.id);
			}
			quickPick.dispose();
		}));
		disposables.add(quickPick.onDidHide(() => {
			if (!quickPick.selectedItems.length && provider) {
				this.show(provider);
			}
			disposables.dispose();
			this._isInQuickPick = false;
		}));
	}

	private _convertTokensToSymbols(tokens: marked.TokensList, symbols: IAccessibleViewSymbol[]): void {
		let firstListItem: string | undefined;
		for (const token of tokens) {
			let label: string | undefined = undefined;
			if ('type' in token) {
				switch (token.type) {
					case 'heading':
					case 'paragraph':
					case 'code':
						label = token.text;
						break;
					case 'list': {
						const firstItem = (token as marked.Tokens.List).items[0];
						if (!firstItem) {
							break;
						}
						firstListItem = `- ${firstItem.text}`;
						label = (token as marked.Tokens.List).items.map(i => i.text).join(', ');
						break;
					}
				}
			}
			if (label) {
				symbols.push({ markdownToParse: label, label: localize('symbolLabel', "({0}) {1}", token.type, label), ariaLabel: localize('symbolLabelAria', "({0}) {1}", token.type, label), firstListItem });
				firstListItem = undefined;
			}
		}
	}

	showSymbol(provider: AccesibleViewContentProvider, symbol: IAccessibleViewSymbol): void {
		if (!this._currentContent) {
			return;
		}
		let lineNumber: number | undefined = symbol.lineNumber;
		const markdownToParse = symbol.markdownToParse;
		if (lineNumber === undefined && markdownToParse === undefined) {
			// No symbols provided and we cannot parse this language
			return;
		}

		if (lineNumber === undefined && markdownToParse) {
			// Note that this scales poorly, thus isn't used for worst case scenarios like the terminal, for which a line number will always be provided.
			// Parse the markdown to find the line number
			const index = this._currentContent.split('\n').findIndex(line => line.includes(markdownToParse.split('\n')[0]) || (symbol.firstListItem && line.includes(symbol.firstListItem))) ?? -1;
			if (index >= 0) {
				lineNumber = index + 1;
			}
		}
		if (lineNumber === undefined) {
			return;
		}
		this._isInQuickPick = false;
		this.show(provider, undefined, undefined, { lineNumber, column: 1 });
		this._updateContextKeys(provider, true);
	}

	disableHint(): void {
		if (!isIAccessibleViewContentProvider(this._currentProvider)) {
			return;
		}
		this._configurationService.updateValue(this._currentProvider?.verbositySettingKey, false);
		alert(localize('disableAccessibilityHelp', '{0} accessibility verbosity is now disabled', this._currentProvider.verbositySettingKey));
	}

	private _updateContextKeys(provider: AccesibleViewContentProvider, shown: boolean): void {
		if (provider.options.type === AccessibleViewType.Help) {
			this._accessiblityHelpIsShown.set(shown);
			this._accessibleViewIsShown.reset();
		} else {
			this._accessibleViewIsShown.set(shown);
			this._accessiblityHelpIsShown.reset();
		}
		this._accessibleViewSupportsNavigation.set(provider.provideNextContent !== undefined || provider.providePreviousContent !== undefined);
		this._accessibleViewVerbosityEnabled.set(this._verbosityEnabled());
		this._accessibleViewGoToSymbolSupported.set(this._goToSymbolsSupported() ? this.getSymbols()?.length! > 0 : false);
	}

	private _updateContent(provider: AccesibleViewContentProvider, updatedContent?: string): void {
		let content = updatedContent ?? provider.provideContent();
		if (provider.options.type === AccessibleViewType.View) {
			this._currentContent = content;
			this._hasUnassignedKeybindings.reset();
			this._hasAssignedKeybindings.reset();
			return;
		}
		const readMoreLinkHint = this._readMoreHint(provider);
		const disableHelpHint = this._disableVerbosityHint(provider);
		const screenReaderModeHint = this._screenReaderModeHint(provider);
		const exitThisDialogHint = this._exitDialogHint(provider);
		let configureKbHint = '';
		let configureAssignedKbHint = '';
		const resolvedContent = resolveContentAndKeybindingItems(this._keybindingService, screenReaderModeHint + content + readMoreLinkHint + disableHelpHint + exitThisDialogHint);
		if (resolvedContent) {
			content = resolvedContent.content.value;
			if (resolvedContent.configureKeybindingItems) {
				provider.options.configureKeybindingItems = resolvedContent.configureKeybindingItems;
				this._hasUnassignedKeybindings.set(true);
				configureKbHint = this._configureUnassignedKbHint();
			} else {
				this._hasAssignedKeybindings.reset();
			}
			if (resolvedContent.configuredKeybindingItems) {
				provider.options.configuredKeybindingItems = resolvedContent.configuredKeybindingItems;
				this._hasAssignedKeybindings.set(true);
				configureAssignedKbHint = this._configureAssignedKbHint();
			} else {
				this._hasAssignedKeybindings.reset();
			}
		}
		this._currentContent = content + configureKbHint + configureAssignedKbHint;
	}

	private _render(provider: AccesibleViewContentProvider, container: HTMLElement, showAccessibleViewHelp?: boolean, updatedContent?: string): IDisposable {
		this._currentProvider = provider;
		this._accessibleViewCurrentProviderId.set(provider.id);
		const verbose = this._verbosityEnabled();
		this._updateContent(provider, updatedContent);
		this.calculateCodeBlocks(this._currentContent);
		this._updateContextKeys(provider, true);
		const widgetIsFocused = this._editorWidget.hasTextFocus() || this._editorWidget.hasWidgetFocus();
		this._getTextModel(URI.from({ path: `accessible-view-${provider.id}`, scheme: Schemas.accessibleView, fragment: this._currentContent })).then((model) => {
			if (!model) {
				return;
			}
			this._editorWidget.setModel(model);
			const domNode = this._editorWidget.getDomNode();
			if (!domNode) {
				return;
			}
			model.setLanguage(provider.options.language ?? 'markdown');
			container.appendChild(this._container);
			let actionsHint = '';
			const hasActions = this._accessibleViewSupportsNavigation.get() || this._accessibleViewVerbosityEnabled.get() || this._accessibleViewGoToSymbolSupported.get() || provider.actions?.length;
			if (verbose && !showAccessibleViewHelp && hasActions) {
				actionsHint = provider.options.position ? localize('ariaAccessibleViewActionsBottom', 'Explore actions such as disabling this hint (Shift+Tab), use Escape to exit this dialog.') : localize('ariaAccessibleViewActions', 'Explore actions such as disabling this hint (Shift+Tab).');
			}
			let ariaLabel = provider.options.type === AccessibleViewType.Help ? localize('accessibility-help', "Accessibility Help") : localize('accessible-view', "Accessible View");
			this._title.textContent = ariaLabel;
			if (actionsHint && provider.options.type === AccessibleViewType.View) {
				ariaLabel = localize('accessible-view-hint', "Accessible View, {0}", actionsHint);
			} else if (actionsHint) {
				ariaLabel = localize('accessibility-help-hint', "Accessibility Help, {0}", actionsHint);
			}
			if (isWindows && widgetIsFocused) {
				// prevent the screen reader on windows from reading
				// the aria label again when it's refocused
				ariaLabel = '';
			}
			this._editorWidget.updateOptions({ ariaLabel });
			this._editorWidget.focus();
			if (this._currentProvider?.options.position) {
				const position = this._editorWidget.getPosition();
				const isDefaultPosition = position?.lineNumber === 1 && position.column === 1;
				if (this._currentProvider.options.position === 'bottom' || this._currentProvider.options.position === 'initial-bottom' && isDefaultPosition) {
					const lastLine = this.editorWidget.getModel()?.getLineCount();
					const position = lastLine !== undefined && lastLine > 0 ? new Position(lastLine, 1) : undefined;
					if (position) {
						this._editorWidget.setPosition(position);
						this._editorWidget.revealLine(position.lineNumber);
					}
				}
			}
		});
		this._updateToolbar(this._currentProvider.actions, provider.options.type);

		const hide = (e?: KeyboardEvent | IKeyboardEvent): void => {
			const thisWindowIsFocused = getWindow(this._editorWidget.getDomNode()).document.hasFocus();
			if (!thisWindowIsFocused) {
				// When switching windows, keep accessible view open
				e?.preventDefault();
				e?.stopPropagation();
				return;
			}
			if (!this._isInQuickPick) {
				provider.onClose();
			}
			e?.stopPropagation();
			this._contextViewService.hideContextView();
			if (this._isInQuickPick) {
				return;
			}
			this._updateContextKeys(provider, false);
			this._lastProvider = undefined;
			this._currentContent = undefined;
			this._currentProvider?.dispose();
			this._currentProvider = undefined;
		};
		const disposableStore = new DisposableStore();
		disposableStore.add(this._editorWidget.onKeyDown((e) => {
			if (e.keyCode === KeyCode.Enter) {
				this._commandService.executeCommand('editor.action.openLink');
			} else if (e.keyCode === KeyCode.Escape || shouldHide(e.browserEvent, this._keybindingService, this._configurationService)) {
				hide(e);
			} else if (e.keyCode === KeyCode.KeyH && provider.options.readMoreUrl) {
				const url: string = provider.options.readMoreUrl;
				alert(AccessibilityHelpNLS.openingDocs);
				this._openerService.open(URI.parse(url));
				e.preventDefault();
				e.stopPropagation();
			}
			if (provider instanceof AccessibleContentProvider) {
				provider.onKeyDown?.(e);
			}
		}));
		disposableStore.add(addDisposableListener(this._toolbar.getElement(), EventType.KEY_DOWN, (e: KeyboardEvent) => {
			const keyboardEvent = new StandardKeyboardEvent(e);
			if (keyboardEvent.equals(KeyCode.Escape)) {
				hide(e);
			}
		}));
		disposableStore.add(this._editorWidget.onDidBlurEditorWidget(() => {
			if (!isActiveElement(this._toolbar.getElement())) {
				hide();
			}
		}));
		disposableStore.add(this._editorWidget.onDidContentSizeChange(() => this._layout()));
		disposableStore.add(this._layoutService.onDidLayoutActiveContainer(() => this._layout()));
		return disposableStore;
	}

	private _updateToolbar(providedActions?: IAction[], type?: AccessibleViewType): void {
		this._toolbar.setAriaLabel(type === AccessibleViewType.Help ? localize('accessibleHelpToolbar', 'Accessibility Help') : localize('accessibleViewToolbar', "Accessible View"));
		const toolbarMenu = this._register(this._menuService.createMenu(MenuId.AccessibleView, this._contextKeyService));
		const menuActions = getFlatActionBarActions(toolbarMenu.getActions({}));
		if (providedActions) {
			for (const providedAction of providedActions) {
				providedAction.class = providedAction.class || ThemeIcon.asClassName(Codicon.primitiveSquare);
				providedAction.checked = undefined;
			}
			this._toolbar.setActions([...providedActions, ...menuActions]);
		} else {
			this._toolbar.setActions(menuActions);
		}
	}

	private _layout(): void {
		const dimension = this._layoutService.activeContainerDimension;
		const maxHeight = dimension.height && dimension.height * .4;
		const height = Math.min(maxHeight, this._editorWidget.getContentHeight());
		const width = Math.min(dimension.width * 0.62 /* golden cut */, DIMENSIONS.MAX_WIDTH);
		this._editorWidget.layout({ width, height });
	}

	private async _getTextModel(resource: URI): Promise<ITextModel | null> {
		const existing = this._modelService.getModel(resource);
		if (existing && !existing.isDisposed()) {
			return existing;
		}
		return this._modelService.createModel(resource.fragment, null, resource, false);
	}

	private _goToSymbolsSupported(): boolean {
		if (!this._currentProvider) {
			return false;
		}
		return this._currentProvider.options.type === AccessibleViewType.Help || this._currentProvider.options.language === 'markdown' || this._currentProvider.options.language === undefined || (this._currentProvider instanceof AccessibleContentProvider && !!this._currentProvider.getSymbols?.());
	}

	private _updateLastProvider(): AccesibleViewContentProvider | undefined {
		const provider = this._currentProvider;
		if (!provider) {
			return;
		}
		const lastProvider = provider instanceof AccessibleContentProvider ? new AccessibleContentProvider(
			provider.id,
			provider.options,
			provider.provideContent.bind(provider),
			provider.onClose.bind(provider),
			provider.verbositySettingKey,
			provider.onOpen?.bind(provider),
			provider.actions,
			provider.provideNextContent?.bind(provider),
			provider.providePreviousContent?.bind(provider),
			provider.onDidChangeContent?.bind(provider),
			provider.onKeyDown?.bind(provider),
			provider.getSymbols?.bind(provider),
		) : new ExtensionContentProvider(
			provider.id,
			provider.options,
			provider.provideContent.bind(provider),
			provider.onClose.bind(provider),
			provider.onOpen?.bind(provider),
			provider.provideNextContent?.bind(provider),
			provider.providePreviousContent?.bind(provider),
			provider.actions,
			provider.onDidChangeContent?.bind(provider),
		);
		return lastProvider;
	}

	public showAccessibleViewHelp(): void {
		const lastProvider = this._updateLastProvider();
		if (!lastProvider) {
			return;
		}
		let accessibleViewHelpProvider;
		if (lastProvider instanceof AccessibleContentProvider) {
			accessibleViewHelpProvider = new AccessibleContentProvider(
				lastProvider.id,
				{ type: AccessibleViewType.Help },
				() => lastProvider.options.customHelp ? lastProvider?.options.customHelp() : this._accessibleViewHelpDialogContent(this._goToSymbolsSupported()),
				() => {
					this._contextViewService.hideContextView();
					// HACK: Delay to allow the context view to hide #207638
					queueMicrotask(() => this.show(lastProvider));
				},
				lastProvider.verbositySettingKey
			);
		} else {
			accessibleViewHelpProvider = new ExtensionContentProvider(
				lastProvider.id,
				{ type: AccessibleViewType.Help },
				() => lastProvider.options.customHelp ? lastProvider?.options.customHelp() : this._accessibleViewHelpDialogContent(this._goToSymbolsSupported()),
				() => {
					this._contextViewService.hideContextView();
					// HACK: Delay to allow the context view to hide #207638
					queueMicrotask(() => this.show(lastProvider));
				},
			);
		}
		this._contextViewService.hideContextView();
		// HACK: Delay to allow the context view to hide #186514
		if (accessibleViewHelpProvider) {
			queueMicrotask(() => this.show(accessibleViewHelpProvider, undefined, true));
		}
	}

	private _accessibleViewHelpDialogContent(providerHasSymbols?: boolean): string {
		const navigationHint = this._navigationHint();
		const goToSymbolHint = this._goToSymbolHint(providerHasSymbols);
		const toolbarHint = localize('toolbar', "Navigate to the toolbar (Shift+Tab).");
		const chatHints = this._getChatHints();

		let hint = localize('intro', "In the accessible view, you can:\n");
		if (navigationHint) {
			hint += ' - ' + navigationHint + '\n';
		}
		if (goToSymbolHint) {
			hint += ' - ' + goToSymbolHint + '\n';
		}
		if (toolbarHint) {
			hint += ' - ' + toolbarHint + '\n';
		}
		if (chatHints) {
			hint += chatHints;
		}
		return hint;
	}

	private _getChatHints(): string | undefined {
		if (this._currentProvider?.id !== AccessibleViewProviderId.PanelChat && this._currentProvider?.id !== AccessibleViewProviderId.QuickChat) {
			return;
		}
		return [localize('insertAtCursor', " - Insert the code block at the cursor{0}.", '<keybinding:workbench.action.chat.insertCodeBlock>'),
		localize('insertIntoNewFile', " - Insert the code block into a new file{0}.", '<keybinding:workbench.action.chat.insertIntoNewFile>'),
		localize('runInTerminal', " - Run the code block in the terminal{0}.\n", '<keybinding:workbench.action.chat.runInTerminal>')].join('\n');
	}

	private _navigationHint(): string {
		return localize('accessibleViewNextPreviousHint', "Show the next item{0} or previous item{1}.", `<keybinding:${AccessibilityCommandId.ShowNext}`, `<keybinding:${AccessibilityCommandId.ShowPrevious}>`);
	}

	private _disableVerbosityHint(provider: AccesibleViewContentProvider): string {
		if (provider.options.type === AccessibleViewType.Help && this._verbosityEnabled()) {
			return localize('acessibleViewDisableHint', "\nDisable accessibility verbosity for this feature{0}.", `<keybinding:${AccessibilityCommandId.DisableVerbosityHint}>`);
		}
		return '';
	}

	private _goToSymbolHint(providerHasSymbols?: boolean): string | undefined {
		if (!providerHasSymbols) {
			return;
		}
		return localize('goToSymbolHint', 'Go to a symbol{0}.', `<keybinding:${AccessibilityCommandId.GoToSymbol}>`);
	}

	private _configureUnassignedKbHint(): string {
		const configureKb = this._keybindingService.lookupKeybinding(AccessibilityCommandId.AccessibilityHelpConfigureKeybindings)?.getAriaLabel();
		const keybindingToConfigureQuickPick = configureKb ? '(' + configureKb + ')' : 'by assigning a keybinding to the command Accessibility Help Configure Unassigned Keybindings.';
		return localize('configureKb', '\nConfigure keybindings for commands that lack them {0}.', keybindingToConfigureQuickPick);
	}

	private _configureAssignedKbHint(): string {
		const configureKb = this._keybindingService.lookupKeybinding(AccessibilityCommandId.AccessibilityHelpConfigureAssignedKeybindings)?.getAriaLabel();
		const keybindingToConfigureQuickPick = configureKb ? '(' + configureKb + ')' : 'by assigning a keybinding to the command Accessibility Help Configure Assigned Keybindings.';
		return localize('configureKbAssigned', '\nConfigure keybindings for commands that already have assignments {0}.', keybindingToConfigureQuickPick);
	}

	private _screenReaderModeHint(provider: AccesibleViewContentProvider): string {
		const accessibilitySupport = this._accessibilityService.isScreenReaderOptimized();
		let screenReaderModeHint = '';
		const turnOnMessage = (
			isMacintosh
				? AccessibilityHelpNLS.changeConfigToOnMac
				: AccessibilityHelpNLS.changeConfigToOnWinLinux
		);
		if (accessibilitySupport && provider.id === AccessibleViewProviderId.Editor) {
			screenReaderModeHint = AccessibilityHelpNLS.auto_on;
			screenReaderModeHint += '\n';
		} else if (!accessibilitySupport) {
			screenReaderModeHint = AccessibilityHelpNLS.auto_off + '\n' + turnOnMessage;
			screenReaderModeHint += '\n';
		}
		return screenReaderModeHint;
	}

	private _exitDialogHint(provider: AccesibleViewContentProvider): string {
		return this._verbosityEnabled() && !provider.options.position ? localize('exit', '\nExit this dialog (Escape).') : '';
	}

	private _readMoreHint(provider: AccesibleViewContentProvider): string {
		return provider.options.readMoreUrl ? localize("openDoc", "\nOpen a browser window with more information related to accessibility{0}.", `<keybinding:${AccessibilityCommandId.AccessibilityHelpOpenHelpLink}>`) : '';
	}
}

export class AccessibleViewService extends Disposable implements IAccessibleViewService {
	declare readonly _serviceBrand: undefined;
	private _accessibleView: AccessibleView | undefined;

	constructor(
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService
	) {
		super();
	}

	show(provider: AccesibleViewContentProvider, position?: Position): void {
		if (!this._accessibleView) {
			this._accessibleView = this._register(this._instantiationService.createInstance(AccessibleView));
		}
		this._accessibleView.show(provider, undefined, undefined, position);
	}
	configureKeybindings(unassigned: boolean): void {
		this._accessibleView?.configureKeybindings(unassigned);
	}
	openHelpLink(): void {
		this._accessibleView?.openHelpLink();
	}
	showLastProvider(id: AccessibleViewProviderId): void {
		this._accessibleView?.showLastProvider(id);
	}
	next(): void {
		this._accessibleView?.next();
	}
	previous(): void {
		this._accessibleView?.previous();
	}
	goToSymbol(): void {
		this._accessibleView?.goToSymbol();
	}
	getOpenAriaHint(verbositySettingKey: AccessibilityVerbositySettingId): string | null {
		if (!this._configurationService.getValue(verbositySettingKey)) {
			return null;
		}
		const keybinding = this._keybindingService.lookupKeybinding(AccessibilityCommandId.OpenAccessibleView)?.getAriaLabel();
		let hint = null;
		if (keybinding) {
			hint = localize('acessibleViewHint', "Inspect this in the accessible view with {0}", keybinding);
		} else {
			hint = localize('acessibleViewHintNoKbEither', "Inspect this in the accessible view via the command Open Accessible View which is currently not triggerable via keybinding.");
		}
		return hint;
	}
	disableHint(): void {
		this._accessibleView?.disableHint();
	}
	showAccessibleViewHelp(): void {
		this._accessibleView?.showAccessibleViewHelp();
	}
	getPosition(id: AccessibleViewProviderId): Position | undefined {
		return this._accessibleView?.getPosition(id) ?? undefined;
	}
	getLastPosition(): Position | undefined {
		const lastLine = this._accessibleView?.editorWidget.getModel()?.getLineCount();
		return lastLine !== undefined && lastLine > 0 ? new Position(lastLine, 1) : undefined;
	}
	setPosition(position: Position, reveal?: boolean, select?: boolean): void {
		this._accessibleView?.setPosition(position, reveal, select);
	}
	getCodeBlockContext(): ICodeBlockActionContext | undefined {
		return this._accessibleView?.getCodeBlockContext();
	}
	navigateToCodeBlock(type: 'next' | 'previous'): void {
		this._accessibleView?.navigateToCodeBlock(type);
	}
}

class AccessibleViewSymbolQuickPick {
	constructor(private _accessibleView: AccessibleView, @IQuickInputService private readonly _quickInputService: IQuickInputService) {

	}
	show(provider: AccesibleViewContentProvider): void {
		const disposables = new DisposableStore();
		const quickPick = disposables.add(this._quickInputService.createQuickPick<IAccessibleViewSymbol>());
		quickPick.placeholder = localize('accessibleViewSymbolQuickPickPlaceholder', "Type to search symbols");
		quickPick.title = localize('accessibleViewSymbolQuickPickTitle', "Go to Symbol Accessible View");
		const picks = [];
		const symbols = this._accessibleView.getSymbols();
		if (!symbols) {
			return;
		}
		for (const symbol of symbols) {
			picks.push({
				label: symbol.label,
				ariaLabel: symbol.ariaLabel,
				firstListItem: symbol.firstListItem,
				lineNumber: symbol.lineNumber,
				endLineNumber: symbol.endLineNumber,
				markdownToParse: symbol.markdownToParse
			});
		}
		quickPick.canSelectMany = false;
		quickPick.items = picks;
		quickPick.show();
		disposables.add(quickPick.onDidAccept(() => {
			this._accessibleView.showSymbol(provider, quickPick.selectedItems[0]);
			quickPick.hide();
		}));
		disposables.add(quickPick.onDidHide(() => {
			if (quickPick.selectedItems.length === 0) {
				// this was escaped, so refocus the accessible view
				this._accessibleView.show(provider);
			}
			disposables.dispose();
		}));
	}
}


function shouldHide(event: KeyboardEvent, keybindingService: IKeybindingService, configurationService: IConfigurationService): boolean {
	if (!configurationService.getValue(AccessibilityWorkbenchSettingId.AccessibleViewCloseOnKeyPress)) {
		return false;
	}
	const standardKeyboardEvent = new StandardKeyboardEvent(event);
	const resolveResult = keybindingService.softDispatch(standardKeyboardEvent, standardKeyboardEvent.target);

	const isValidChord = resolveResult.kind === ResultKind.MoreChordsNeeded;
	if (keybindingService.inChordMode || isValidChord) {
		return false;
	}
	return shouldHandleKey(event) && !event.ctrlKey && !event.altKey && !event.metaKey && !event.shiftKey;
}

function shouldHandleKey(event: KeyboardEvent): boolean {
	return !!event.code.match(/^(Key[A-Z]|Digit[0-9]|Equal|Comma|Period|Slash|Quote|Backquote|Backslash|Minus|Semicolon|Space|Enter)$/);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/accessibility/browser/accessibleViewActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/accessibility/browser/accessibleViewActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { Command, MultiCommand, ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { localize } from '../../../../nls.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { AccessibilityCommandId } from '../common/accessibilityCommands.js';
import { accessibilityHelpIsShown, accessibleViewContainsCodeBlocks, accessibleViewCurrentProviderId, accessibleViewGoToSymbolSupported, accessibleViewHasAssignedKeybindings, accessibleViewHasUnassignedKeybindings, accessibleViewIsShown, accessibleViewSupportsNavigation, accessibleViewVerbosityEnabled } from './accessibilityConfiguration.js';
import { AccessibleViewProviderId, IAccessibleViewService } from '../../../../platform/accessibility/browser/accessibleView.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { InlineCompletionsController } from '../../../../editor/contrib/inlineCompletions/browser/controller/inlineCompletionsController.js';

const accessibleViewMenu = {
	id: MenuId.AccessibleView,
	group: 'navigation',
	when: accessibleViewIsShown
};
const commandPalette = {
	id: MenuId.CommandPalette,
	group: '',
	order: 1
};
class AccessibleViewNextAction extends Action2 {
	constructor() {
		super({
			id: AccessibilityCommandId.ShowNext,
			precondition: ContextKeyExpr.and(accessibleViewIsShown, accessibleViewSupportsNavigation),
			keybinding: {
				primary: KeyMod.Alt | KeyCode.BracketRight,
				weight: KeybindingWeight.WorkbenchContrib
			},
			menu: [
				commandPalette,
				{
					...accessibleViewMenu,
					when: ContextKeyExpr.and(accessibleViewIsShown, accessibleViewSupportsNavigation),
				}],
			icon: Codicon.arrowDown,
			title: localize('editor.action.accessibleViewNext', "Show Next in Accessible View")
		});
	}
	run(accessor: ServicesAccessor): void {
		accessor.get(IAccessibleViewService).next();
	}
}
registerAction2(AccessibleViewNextAction);


class AccessibleViewNextCodeBlockAction extends Action2 {
	constructor() {
		super({
			id: AccessibilityCommandId.NextCodeBlock,
			precondition: ContextKeyExpr.and(accessibleViewContainsCodeBlocks, ContextKeyExpr.or(ContextKeyExpr.equals(accessibleViewCurrentProviderId.key, AccessibleViewProviderId.PanelChat), ContextKeyExpr.equals(accessibleViewCurrentProviderId.key, AccessibleViewProviderId.InlineChat), ContextKeyExpr.equals(accessibleViewCurrentProviderId.key, AccessibleViewProviderId.QuickChat))),
			keybinding: {
				primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.PageDown,
				mac: { primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.PageDown, },
				weight: KeybindingWeight.WorkbenchContrib,
			},
			icon: Codicon.arrowRight,
			menu:
			{
				...accessibleViewMenu,
				when: ContextKeyExpr.and(accessibleViewIsShown, accessibleViewContainsCodeBlocks),
			},
			title: localize('editor.action.accessibleViewNextCodeBlock', "Accessible View: Next Code Block")
		});
	}
	run(accessor: ServicesAccessor): void {
		accessor.get(IAccessibleViewService).navigateToCodeBlock('next');
	}
}
registerAction2(AccessibleViewNextCodeBlockAction);


class AccessibleViewPreviousCodeBlockAction extends Action2 {
	constructor() {
		super({
			id: AccessibilityCommandId.PreviousCodeBlock,
			precondition: ContextKeyExpr.and(accessibleViewContainsCodeBlocks, ContextKeyExpr.or(ContextKeyExpr.equals(accessibleViewCurrentProviderId.key, AccessibleViewProviderId.PanelChat), ContextKeyExpr.equals(accessibleViewCurrentProviderId.key, AccessibleViewProviderId.InlineChat), ContextKeyExpr.equals(accessibleViewCurrentProviderId.key, AccessibleViewProviderId.QuickChat))),
			keybinding: {
				primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.PageUp,
				mac: { primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.PageUp, },
				weight: KeybindingWeight.WorkbenchContrib,
			},
			icon: Codicon.arrowLeft,
			menu: {
				...accessibleViewMenu,
				when: ContextKeyExpr.and(accessibleViewIsShown, accessibleViewContainsCodeBlocks),
			},
			title: localize('editor.action.accessibleViewPreviousCodeBlock', "Accessible View: Previous Code Block")
		});
	}
	run(accessor: ServicesAccessor): void {
		accessor.get(IAccessibleViewService).navigateToCodeBlock('previous');
	}
}
registerAction2(AccessibleViewPreviousCodeBlockAction);

class AccessibleViewPreviousAction extends Action2 {
	constructor() {
		super({
			id: AccessibilityCommandId.ShowPrevious,
			precondition: ContextKeyExpr.and(accessibleViewIsShown, accessibleViewSupportsNavigation),
			keybinding: {
				primary: KeyMod.Alt | KeyCode.BracketLeft,
				weight: KeybindingWeight.WorkbenchContrib
			},
			icon: Codicon.arrowUp,
			menu: [
				commandPalette,
				{
					...accessibleViewMenu,
					when: ContextKeyExpr.and(accessibleViewIsShown, accessibleViewSupportsNavigation),
				}
			],
			title: localize('editor.action.accessibleViewPrevious', "Show Previous in Accessible View")
		});
	}
	run(accessor: ServicesAccessor): void {
		accessor.get(IAccessibleViewService).previous();
	}
}
registerAction2(AccessibleViewPreviousAction);


class AccessibleViewGoToSymbolAction extends Action2 {
	constructor() {
		super({
			id: AccessibilityCommandId.GoToSymbol,
			precondition: ContextKeyExpr.and(ContextKeyExpr.or(accessibleViewIsShown, accessibilityHelpIsShown), accessibleViewGoToSymbolSupported),
			keybinding: {
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyO,
				secondary: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Period],
				weight: KeybindingWeight.WorkbenchContrib + 10
			},
			icon: Codicon.symbolMisc,
			menu: [
				commandPalette,
				{
					...accessibleViewMenu,
					when: ContextKeyExpr.and(ContextKeyExpr.or(accessibleViewIsShown, accessibilityHelpIsShown), accessibleViewGoToSymbolSupported),
				}
			],
			title: localize('editor.action.accessibleViewGoToSymbol', "Go To Symbol in Accessible View")
		});
	}
	run(accessor: ServicesAccessor): void {
		accessor.get(IAccessibleViewService).goToSymbol();
	}
}
registerAction2(AccessibleViewGoToSymbolAction);

function registerCommand<T extends Command>(command: T): T {
	command.register();
	return command;
}

export const AccessibilityHelpAction = registerCommand(new MultiCommand({
	id: AccessibilityCommandId.OpenAccessibilityHelp,
	precondition: undefined,
	kbOpts: {
		primary: KeyMod.Alt | KeyCode.F1,
		weight: KeybindingWeight.WorkbenchContrib,
		linux: {
			primary: KeyMod.Alt | KeyMod.Shift | KeyCode.F1,
			secondary: [KeyMod.Alt | KeyCode.F1]
		},
		kbExpr: accessibilityHelpIsShown.toNegated()
	},
	menuOpts: [{
		menuId: MenuId.CommandPalette,
		group: '',
		title: localize('editor.action.accessibilityHelp', "Open Accessibility Help"),
		order: 1
	}],
}));


export const AccessibleViewAction = registerCommand(new MultiCommand({
	id: AccessibilityCommandId.OpenAccessibleView,
	precondition: undefined,
	kbOpts: {
		primary: KeyMod.Alt | KeyCode.F2,
		weight: KeybindingWeight.WorkbenchContrib,
		linux: {
			primary: KeyMod.Alt | KeyMod.Shift | KeyCode.F2,
			secondary: [KeyMod.Alt | KeyCode.F2]
		}
	},
	menuOpts: [{
		menuId: MenuId.CommandPalette,
		group: '',
		title: localize('editor.action.accessibleView', "Open Accessible View"),
		order: 1
	}],
}));

class AccessibleViewDisableHintAction extends Action2 {
	constructor() {
		super({
			id: AccessibilityCommandId.DisableVerbosityHint,
			precondition: ContextKeyExpr.and(ContextKeyExpr.or(accessibleViewIsShown, accessibilityHelpIsShown), accessibleViewVerbosityEnabled),
			keybinding: {
				primary: KeyMod.Alt | KeyCode.F6,
				weight: KeybindingWeight.WorkbenchContrib
			},
			icon: Codicon.bellSlash,
			menu: [
				commandPalette,
				{
					id: MenuId.AccessibleView,
					group: 'navigation',
					when: ContextKeyExpr.and(ContextKeyExpr.or(accessibleViewIsShown, accessibilityHelpIsShown), accessibleViewVerbosityEnabled),
				}
			],
			title: localize('editor.action.accessibleViewDisableHint', "Disable Accessible View Hint")
		});
	}
	run(accessor: ServicesAccessor): void {
		accessor.get(IAccessibleViewService).disableHint();
	}
}
registerAction2(AccessibleViewDisableHintAction);

class AccessibilityHelpConfigureKeybindingsAction extends Action2 {
	constructor() {
		super({
			id: AccessibilityCommandId.AccessibilityHelpConfigureKeybindings,
			precondition: ContextKeyExpr.and(accessibilityHelpIsShown, accessibleViewHasUnassignedKeybindings),
			icon: Codicon.recordKeys,
			keybinding: {
				primary: KeyMod.Alt | KeyCode.KeyK,
				weight: KeybindingWeight.WorkbenchContrib
			},
			menu: [
				{
					id: MenuId.AccessibleView,
					group: 'navigation',
					order: 3,
					when: accessibleViewHasUnassignedKeybindings,
				}
			],
			title: localize('editor.action.accessibilityHelpConfigureUnassignedKeybindings', "Accessibility Help Configure Unassigned Keybindings")
		});
	}
	async run(accessor: ServicesAccessor): Promise<void> {
		await accessor.get(IAccessibleViewService).configureKeybindings(true);
	}
}
registerAction2(AccessibilityHelpConfigureKeybindingsAction);

class AccessibilityHelpConfigureAssignedKeybindingsAction extends Action2 {
	constructor() {
		super({
			id: AccessibilityCommandId.AccessibilityHelpConfigureAssignedKeybindings,
			precondition: ContextKeyExpr.and(accessibilityHelpIsShown, accessibleViewHasAssignedKeybindings),
			icon: Codicon.recordKeys,
			keybinding: {
				primary: KeyMod.Alt | KeyCode.KeyA,
				weight: KeybindingWeight.WorkbenchContrib
			},
			menu: [
				{
					id: MenuId.AccessibleView,
					group: 'navigation',
					order: 4,
					when: accessibleViewHasAssignedKeybindings,
				}
			],
			title: localize('editor.action.accessibilityHelpConfigureAssignedKeybindings', "Accessibility Help Configure Assigned Keybindings")
		});
	}
	async run(accessor: ServicesAccessor): Promise<void> {
		await accessor.get(IAccessibleViewService).configureKeybindings(false);
	}
}
registerAction2(AccessibilityHelpConfigureAssignedKeybindingsAction);


class AccessibilityHelpOpenHelpLinkAction extends Action2 {
	constructor() {
		super({
			id: AccessibilityCommandId.AccessibilityHelpOpenHelpLink,
			precondition: ContextKeyExpr.and(accessibilityHelpIsShown),
			keybinding: {
				primary: KeyMod.Alt | KeyCode.KeyH,
				weight: KeybindingWeight.WorkbenchContrib
			},
			title: localize('editor.action.accessibilityHelpOpenHelpLink', "Accessibility Help Open Help Link")
		});
	}
	run(accessor: ServicesAccessor): void {
		accessor.get(IAccessibleViewService).openHelpLink();
	}
}
registerAction2(AccessibilityHelpOpenHelpLinkAction);

class AccessibleViewAcceptInlineCompletionAction extends Action2 {
	constructor() {
		super({
			id: AccessibilityCommandId.AccessibleViewAcceptInlineCompletion,
			precondition: ContextKeyExpr.and(accessibleViewIsShown, ContextKeyExpr.equals(accessibleViewCurrentProviderId.key, AccessibleViewProviderId.InlineCompletions)),
			keybinding: {
				primary: KeyMod.CtrlCmd | KeyCode.Slash,
				mac: { primary: KeyMod.WinCtrl | KeyCode.Slash },
				weight: KeybindingWeight.WorkbenchContrib
			},
			icon: Codicon.check,
			menu: [
				commandPalette,
				{
					id: MenuId.AccessibleView,
					group: 'navigation',
					order: 0,
					when: ContextKeyExpr.and(accessibleViewIsShown, ContextKeyExpr.equals(accessibleViewCurrentProviderId.key, AccessibleViewProviderId.InlineCompletions))
				}],
			title: localize('editor.action.accessibleViewAcceptInlineCompletionAction', "Accept Inline Completion")
		});
	}
	async run(accessor: ServicesAccessor): Promise<void> {
		const codeEditorService = accessor.get(ICodeEditorService);
		const editor = codeEditorService.getActiveCodeEditor() || codeEditorService.getFocusedCodeEditor();
		if (!editor) {
			return;
		}
		const model = InlineCompletionsController.get(editor)?.model.get();
		const state = model?.state.get();
		if (!model || !state) {
			return;
		}
		await model.accept(editor);
		model.stop();
		editor.focus();
	}
}
registerAction2(AccessibleViewAcceptInlineCompletionAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/accessibility/browser/accessibleViewContributions.ts]---
Location: vscode-main/src/vs/workbench/contrib/accessibility/browser/accessibleViewContributions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { accessibleViewIsShown } from './accessibilityConfiguration.js';
import { AccessibilityHelpAction, AccessibleViewAction } from './accessibleViewActions.js';
import { AccessibleViewType, AccessibleContentProvider, ExtensionContentProvider, IAccessibleViewService } from '../../../../platform/accessibility/browser/accessibleView.js';
import { AccessibleViewRegistry } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';

export class AccesibleViewHelpContribution extends Disposable {
	static ID: 'accesibleViewHelpContribution';
	constructor() {
		super();
		this._register(AccessibilityHelpAction.addImplementation(115, 'accessible-view-help', accessor => {
			accessor.get(IAccessibleViewService).showAccessibleViewHelp();
			return true;
		}, accessibleViewIsShown));
	}
}

export class AccesibleViewContributions extends Disposable {
	static ID: 'accesibleViewContributions';
	constructor() {
		super();
		AccessibleViewRegistry.getImplementations().forEach(impl => {
			const implementation = (accessor: ServicesAccessor) => {
				const provider: AccessibleContentProvider | ExtensionContentProvider | undefined = impl.getProvider(accessor);
				if (!provider) {
					return false;
				}
				try {
					accessor.get(IAccessibleViewService).show(provider);
					return true;
				} catch {
					provider.dispose();
					return false;
				}
			};
			if (impl.type === AccessibleViewType.View) {
				this._register(AccessibleViewAction.addImplementation(impl.priority, impl.name, implementation, impl.when));
			} else {
				this._register(AccessibilityHelpAction.addImplementation(impl.priority, impl.name, implementation, impl.when));
			}
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/accessibility/browser/accessibleViewKeybindingResolver.ts]---
Location: vscode-main/src/vs/workbench/contrib/accessibility/browser/accessibleViewKeybindingResolver.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IPickerQuickAccessItem } from '../../../../platform/quickinput/browser/pickerQuickAccess.js';

export function resolveContentAndKeybindingItems(keybindingService: IKeybindingService, value?: string): { content: MarkdownString; configureKeybindingItems: IPickerQuickAccessItem[] | undefined; configuredKeybindingItems: IPickerQuickAccessItem[] | undefined } | undefined {
	if (!value) {
		return;
	}
	const configureKeybindingItems: IPickerQuickAccessItem[] = [];
	const configuredKeybindingItems: IPickerQuickAccessItem[] = [];
	const matches = value.matchAll(/(\<keybinding:(?<commandId>[^\<]*)\>)/gm);
	for (const match of [...matches]) {
		const commandId = match?.groups?.commandId;
		let kbLabel;
		if (match?.length && commandId) {
			const keybinding = keybindingService.lookupKeybinding(commandId)?.getAriaLabel();
			if (!keybinding) {
				kbLabel = ` (unassigned keybinding)`;
				configureKeybindingItems.push({
					label: commandId,
					id: commandId
				});
			} else {
				kbLabel = ' (' + keybinding + ')';
				configuredKeybindingItems.push({
					label: commandId,
					id: commandId
				});
			}
			value = value.replace(match[0], kbLabel);
		}
	}
	const content = new MarkdownString(value);
	content.isTrusted = true;
	return { content, configureKeybindingItems: configureKeybindingItems.length ? configureKeybindingItems : undefined, configuredKeybindingItems: configuredKeybindingItems.length ? configuredKeybindingItems : undefined };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/accessibility/browser/editorAccessibilityHelp.ts]---
Location: vscode-main/src/vs/workbench/contrib/accessibility/browser/editorAccessibilityHelp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { EditorOption } from '../../../../editor/common/config/editorOptions.js';
import { AccessibilityHelpNLS } from '../../../../editor/common/standaloneStrings.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { AccessibilityHelpAction } from './accessibleViewActions.js';
import { ChatContextKeys } from '../../chat/common/chatContextKeys.js';
import { CommentAccessibilityHelpNLS } from '../../comments/browser/commentsAccessibility.js';
import { CommentContextKeys } from '../../comments/common/commentContextKeys.js';
import { NEW_UNTITLED_FILE_COMMAND_ID } from '../../files/browser/fileConstants.js';
import { IAccessibleViewService, IAccessibleViewContentProvider, AccessibleViewProviderId, IAccessibleViewOptions, AccessibleViewType } from '../../../../platform/accessibility/browser/accessibleView.js';
import { AccessibilityVerbositySettingId } from './accessibilityConfiguration.js';
import { ctxHasEditorModification, ctxHasRequestInProgress } from '../../chat/browser/chatEditing/chatEditingEditorContextKeys.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';

export class EditorAccessibilityHelpContribution extends Disposable {
	static ID: 'editorAccessibilityHelpContribution';
	constructor() {
		super();
		this._register(AccessibilityHelpAction.addImplementation(90, 'editor', async accessor => {
			const codeEditorService = accessor.get(ICodeEditorService);
			const accessibleViewService = accessor.get(IAccessibleViewService);
			const instantiationService = accessor.get(IInstantiationService);
			const commandService = accessor.get(ICommandService);
			let codeEditor = codeEditorService.getActiveCodeEditor() || codeEditorService.getFocusedCodeEditor();
			if (!codeEditor) {
				await commandService.executeCommand(NEW_UNTITLED_FILE_COMMAND_ID);
				codeEditor = codeEditorService.getActiveCodeEditor()!;
			}
			accessibleViewService.show(instantiationService.createInstance(EditorAccessibilityHelpProvider, codeEditor));
		}));
	}
}

class EditorAccessibilityHelpProvider extends Disposable implements IAccessibleViewContentProvider {
	id = AccessibleViewProviderId.Editor;
	onClose() {
		this._editor.focus();
	}
	options: IAccessibleViewOptions = { type: AccessibleViewType.Help, readMoreUrl: 'https://go.microsoft.com/fwlink/?linkid=851010' };
	verbositySettingKey = AccessibilityVerbositySettingId.Editor;
	constructor(
		private readonly _editor: ICodeEditor,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IAccessibilityService private readonly accessibilityService: IAccessibilityService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
	) {
		super();
	}

	provideContent(): string {
		const options = this._editor.getOptions();
		const content = [];

		if (options.get(EditorOption.inDiffEditor)) {
			if (options.get(EditorOption.readOnly)) {
				content.push(AccessibilityHelpNLS.readonlyDiffEditor);
			} else {
				content.push(AccessibilityHelpNLS.editableDiffEditor);
			}
		} else {
			if (options.get(EditorOption.readOnly)) {
				content.push(AccessibilityHelpNLS.readonlyEditor);
			} else {
				content.push(AccessibilityHelpNLS.editableEditor);
			}
		}
		if (this.accessibilityService.isScreenReaderOptimized() && this._configurationService.getValue('accessibility.windowTitleOptimized')) {
			content.push(AccessibilityHelpNLS.defaultWindowTitleIncludesEditorState);
		} else {
			content.push(AccessibilityHelpNLS.defaultWindowTitleExcludingEditorState);
		}
		content.push(AccessibilityHelpNLS.toolbar);

		const chatEditInfo = getChatEditInfo(this._keybindingService, this._contextKeyService, this._editor);
		if (chatEditInfo) {
			content.push(chatEditInfo);
		}

		content.push(AccessibilityHelpNLS.listSignalSounds);
		content.push(AccessibilityHelpNLS.listAlerts);


		const chatCommandInfo = getChatCommandInfo(this._keybindingService, this._contextKeyService);
		if (chatCommandInfo) {
			content.push(chatCommandInfo);
		}

		const commentCommandInfo = getCommentCommandInfo(this._keybindingService, this._contextKeyService, this._editor);
		if (commentCommandInfo) {
			content.push(commentCommandInfo);
		}

		content.push(AccessibilityHelpNLS.suggestActions);
		content.push(AccessibilityHelpNLS.acceptSuggestAction);
		content.push(AccessibilityHelpNLS.toggleSuggestionFocus);

		if (options.get(EditorOption.stickyScroll).enabled) {
			content.push(AccessibilityHelpNLS.stickScroll);
		}

		if (options.get(EditorOption.tabFocusMode)) {
			content.push(AccessibilityHelpNLS.tabFocusModeOnMsg);
		} else {
			content.push(AccessibilityHelpNLS.tabFocusModeOffMsg);
		}
		content.push(AccessibilityHelpNLS.codeFolding);
		content.push(AccessibilityHelpNLS.intellisense);
		content.push(AccessibilityHelpNLS.showOrFocusHover);
		content.push(AccessibilityHelpNLS.goToSymbol);
		content.push(AccessibilityHelpNLS.startDebugging);
		content.push(AccessibilityHelpNLS.setBreakpoint);
		content.push(AccessibilityHelpNLS.debugExecuteSelection);
		content.push(AccessibilityHelpNLS.addToWatch);
		return content.join('\n');
	}
}

export function getCommentCommandInfo(keybindingService: IKeybindingService, contextKeyService: IContextKeyService, editor: ICodeEditor): string | undefined {
	const editorContext = contextKeyService.getContext(editor.getDomNode()!);
	if (editorContext.getValue<boolean>(CommentContextKeys.activeEditorHasCommentingRange.key)) {
		return [CommentAccessibilityHelpNLS.intro, CommentAccessibilityHelpNLS.addComment, CommentAccessibilityHelpNLS.nextCommentThread, CommentAccessibilityHelpNLS.previousCommentThread, CommentAccessibilityHelpNLS.nextRange, CommentAccessibilityHelpNLS.previousRange].join('\n');
	}
	return;
}

export function getChatCommandInfo(keybindingService: IKeybindingService, contextKeyService: IContextKeyService): string | undefined {
	if (ChatContextKeys.enabled.getValue(contextKeyService)) {
		return [AccessibilityHelpNLS.quickChat, AccessibilityHelpNLS.startInlineChat].join('\n');
	}
	return;
}

export function getChatEditInfo(keybindingService: IKeybindingService, contextKeyService: IContextKeyService, editor: ICodeEditor): string | undefined {
	const editorContext = contextKeyService.getContext(editor.getDomNode()!);
	if (editorContext.getValue<boolean>(ctxHasEditorModification.key)) {
		return AccessibilityHelpNLS.chatEditorModification + '\n' + AccessibilityHelpNLS.chatEditActions;
	} else if (editorContext.getValue<boolean>(ctxHasRequestInProgress.key)) {
		return AccessibilityHelpNLS.chatEditorRequestInProgress;
	}
	return;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/accessibility/browser/extensionAccesibilityHelp.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/accessibility/browser/extensionAccesibilityHelp.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableMap, IDisposable, DisposableStore, Disposable } from '../../../../base/common/lifecycle.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { AccessibleViewType, ExtensionContentProvider } from '../../../../platform/accessibility/browser/accessibleView.js';
import { AccessibleViewRegistry } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { FocusedViewContext } from '../../../common/contextkeys.js';
import { IViewsRegistry, Extensions, IViewDescriptor } from '../../../common/views.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';

export class ExtensionAccessibilityHelpDialogContribution extends Disposable {
	static ID = 'extensionAccessibilityHelpDialogContribution';
	private _viewHelpDialogMap = this._register(new DisposableMap<string, IDisposable>());
	constructor(@IKeybindingService keybindingService: IKeybindingService) {
		super();
		this._register(Registry.as<IViewsRegistry>(Extensions.ViewsRegistry).onViewsRegistered(e => {
			for (const view of e) {
				for (const viewDescriptor of view.views) {
					if (viewDescriptor.accessibilityHelpContent) {
						this._viewHelpDialogMap.set(viewDescriptor.id, registerAccessibilityHelpAction(keybindingService, viewDescriptor));
					}
				}
			}
		}));
		this._register(Registry.as<IViewsRegistry>(Extensions.ViewsRegistry).onViewsDeregistered(e => {
			for (const viewDescriptor of e.views) {
				if (viewDescriptor.accessibilityHelpContent) {
					this._viewHelpDialogMap.get(viewDescriptor.id)?.dispose();
				}
			}
		}));
	}
}

function registerAccessibilityHelpAction(keybindingService: IKeybindingService, viewDescriptor: IViewDescriptor): IDisposable {
	const disposableStore = new DisposableStore();
	const content = viewDescriptor.accessibilityHelpContent?.value;
	if (!content) {
		throw new Error('No content provided for the accessibility help dialog');
	}
	disposableStore.add(AccessibleViewRegistry.register({
		priority: 95,
		name: viewDescriptor.id,
		type: AccessibleViewType.Help,
		when: FocusedViewContext.isEqualTo(viewDescriptor.id),
		getProvider: (accessor: ServicesAccessor) => {
			const viewsService = accessor.get(IViewsService);
			return new ExtensionContentProvider(
				viewDescriptor.id,
				{ type: AccessibleViewType.Help },
				() => content,
				() => viewsService.openView(viewDescriptor.id, true),
			);
		},
	}));

	disposableStore.add(keybindingService.onDidUpdateKeybindings(() => {
		disposableStore.clear();
		disposableStore.add(registerAccessibilityHelpAction(keybindingService, viewDescriptor));
	}));
	return disposableStore;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/accessibility/browser/unfocusedViewDimmingContribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/accessibility/browser/unfocusedViewDimmingContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createStyleSheet } from '../../../../base/browser/domStylesheets.js';
import { Event } from '../../../../base/common/event.js';
import { Disposable, DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { clamp } from '../../../../base/common/numbers.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { AccessibilityWorkbenchSettingId, ViewDimUnfocusedOpacityProperties } from './accessibilityConfiguration.js';

export class UnfocusedViewDimmingContribution extends Disposable implements IWorkbenchContribution {
	private _styleElement?: HTMLStyleElement;
	private _styleElementDisposables: DisposableStore | undefined = undefined;

	constructor(
		@IConfigurationService configurationService: IConfigurationService,
	) {
		super();

		this._register(toDisposable(() => this._removeStyleElement()));

		this._register(Event.runAndSubscribe(configurationService.onDidChangeConfiguration, e => {
			if (e && !e.affectsConfiguration(AccessibilityWorkbenchSettingId.DimUnfocusedEnabled) && !e.affectsConfiguration(AccessibilityWorkbenchSettingId.DimUnfocusedOpacity)) {
				return;
			}

			let cssTextContent = '';

			const enabled = ensureBoolean(configurationService.getValue(AccessibilityWorkbenchSettingId.DimUnfocusedEnabled), false);
			if (enabled) {
				const opacity = clamp(
					ensureNumber(configurationService.getValue(AccessibilityWorkbenchSettingId.DimUnfocusedOpacity), ViewDimUnfocusedOpacityProperties.Default),
					ViewDimUnfocusedOpacityProperties.Minimum,
					ViewDimUnfocusedOpacityProperties.Maximum
				);

				if (opacity !== 1) {
					// These filter rules are more specific than may be expected as the `filter`
					// rule can cause problems if it's used inside the element like on editor hovers
					const rules = new Set<string>();
					const filterRule = `filter: opacity(${opacity});`;
					// Terminal tabs
					rules.add(`.monaco-workbench .pane-body.integrated-terminal:not(:focus-within) .tabs-container { ${filterRule} }`);
					// Terminals
					rules.add(`.monaco-workbench .pane-body.integrated-terminal .terminal-wrapper:not(:focus-within) { ${filterRule} }`);
					// Text editors
					rules.add(`.monaco-workbench .editor-instance:not(:focus-within) .monaco-editor { ${filterRule} }`);
					// Breadcrumbs
					rules.add(`.monaco-workbench .editor-instance:not(:focus-within) .breadcrumbs-below-tabs { ${filterRule} }`);
					// Terminal editors
					rules.add(`.monaco-workbench .editor-instance:not(:focus-within) .terminal-wrapper { ${filterRule} }`);
					// Settings editor
					rules.add(`.monaco-workbench .editor-instance:not(:focus-within) .settings-editor { ${filterRule} }`);
					// Keybindings editor
					rules.add(`.monaco-workbench .editor-instance:not(:focus-within) .keybindings-editor { ${filterRule} }`);
					// Editor placeholder (error case)
					rules.add(`.monaco-workbench .editor-instance:not(:focus-within) .monaco-editor-pane-placeholder { ${filterRule} }`);
					// Welcome editor
					rules.add(`.monaco-workbench .editor-instance:not(:focus-within) .gettingStartedContainer { ${filterRule} }`);
					cssTextContent = [...rules].join('\n');
				}

			}

			if (cssTextContent.length === 0) {
				this._removeStyleElement();
			} else {
				this._getStyleElement().textContent = cssTextContent;
			}
		}));
	}

	private _getStyleElement(): HTMLStyleElement {
		if (!this._styleElement) {
			this._styleElementDisposables = new DisposableStore();
			this._styleElement = createStyleSheet(undefined, undefined, this._styleElementDisposables);
			this._styleElement.className = 'accessibilityUnfocusedViewOpacity';
		}
		return this._styleElement;
	}

	private _removeStyleElement(): void {
		this._styleElementDisposables?.dispose();
		this._styleElementDisposables = undefined;
		this._styleElement = undefined;
	}
}


function ensureBoolean(value: unknown, defaultValue: boolean): boolean {
	return typeof value === 'boolean' ? value : defaultValue;
}

function ensureNumber(value: unknown, defaultValue: number): number {
	return typeof value === 'number' ? value : defaultValue;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/accessibility/common/accessibilityCommands.ts]---
Location: vscode-main/src/vs/workbench/contrib/accessibility/common/accessibilityCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const enum AccessibilityCommandId {
	OpenAccessibleView = 'editor.action.accessibleView',
	OpenAccessibilityHelp = 'editor.action.accessibilityHelp',
	DisableVerbosityHint = 'editor.action.accessibleViewDisableHint',
	GoToSymbol = 'editor.action.accessibleViewGoToSymbol',
	ShowNext = 'editor.action.accessibleViewNext',
	ShowPrevious = 'editor.action.accessibleViewPrevious',
	AccessibleViewAcceptInlineCompletion = 'editor.action.accessibleViewAcceptInlineCompletion',
	NextCodeBlock = 'editor.action.accessibleViewNextCodeBlock',
	PreviousCodeBlock = 'editor.action.accessibleViewPreviousCodeBlock',
	AccessibilityHelpConfigureKeybindings = 'editor.action.accessibilityHelpConfigureKeybindings',
	AccessibilityHelpConfigureAssignedKeybindings = 'editor.action.accessibilityHelpConfigureAssignedKeybindings',
	AccessibilityHelpOpenHelpLink = 'editor.action.accessibilityHelpOpenHelpLink',
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/accessibilitySignals/browser/accessibilitySignal.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/accessibilitySignals/browser/accessibilitySignal.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AccessibilitySignalService, IAccessibilitySignalService } from '../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { registerAction2 } from '../../../../platform/actions/common/actions.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';
import { AccessibilitySignalLineDebuggerContribution } from './accessibilitySignalDebuggerContribution.js';
import { ShowAccessibilityAnnouncementHelp, ShowSignalSoundHelp } from './commands.js';
import { EditorTextPropertySignalsContribution } from './editorTextPropertySignalsContribution.js';
import { wrapInReloadableClass0 } from '../../../../platform/observable/common/wrapInReloadableClass.js';

registerSingleton(IAccessibilitySignalService, AccessibilitySignalService, InstantiationType.Delayed);

registerWorkbenchContribution2('EditorTextPropertySignalsContribution', wrapInReloadableClass0(() => EditorTextPropertySignalsContribution), WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2('AccessibilitySignalLineDebuggerContribution', AccessibilitySignalLineDebuggerContribution, WorkbenchPhase.AfterRestored);

registerAction2(ShowSignalSoundHelp);
registerAction2(ShowAccessibilityAnnouncementHelp);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/accessibilitySignals/browser/accessibilitySignalDebuggerContribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/accessibilitySignals/browser/accessibilitySignalDebuggerContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { autorunWithStore, observableFromEvent } from '../../../../base/common/observable.js';
import { IAccessibilitySignalService, AccessibilitySignal, AccessibilitySignalService } from '../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IDebugService, IDebugSession } from '../../debug/common/debug.js';

export class AccessibilitySignalLineDebuggerContribution
	extends Disposable
	implements IWorkbenchContribution {

	constructor(
		@IDebugService debugService: IDebugService,
		@IAccessibilitySignalService private readonly accessibilitySignalService: AccessibilitySignalService,
	) {
		super();

		const isEnabled = observableFromEvent(this,
			accessibilitySignalService.onSoundEnabledChanged(AccessibilitySignal.onDebugBreak),
			() => accessibilitySignalService.isSoundEnabled(AccessibilitySignal.onDebugBreak)
		);
		this._register(autorunWithStore((reader, store) => {
			/** @description subscribe to debug sessions */
			if (!isEnabled.read(reader)) {
				return;
			}

			const sessionDisposables = new Map<IDebugSession, IDisposable>();
			store.add(toDisposable(() => {
				sessionDisposables.forEach(d => d.dispose());
				sessionDisposables.clear();
			}));

			store.add(
				debugService.onDidNewSession((session) =>
					sessionDisposables.set(session, this.handleSession(session))
				)
			);

			store.add(debugService.onDidEndSession(({ session }) => {
				sessionDisposables.get(session)?.dispose();
				sessionDisposables.delete(session);
			}));

			debugService
				.getModel()
				.getSessions()
				.forEach((session) =>
					sessionDisposables.set(session, this.handleSession(session))
				);
		}));
	}

	private handleSession(session: IDebugSession): IDisposable {
		return session.onDidChangeState(e => {
			const stoppedDetails = session.getStoppedDetails();
			const BREAKPOINT_STOP_REASON = 'breakpoint';
			if (stoppedDetails && stoppedDetails.reason === BREAKPOINT_STOP_REASON) {
				this.accessibilitySignalService.playSignal(AccessibilitySignal.onDebugBreak);
			}
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/accessibilitySignals/browser/commands.ts]---
Location: vscode-main/src/vs/workbench/contrib/accessibilitySignals/browser/commands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { localize, localize2 } from '../../../../nls.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { Action2 } from '../../../../platform/actions/common/actions.js';
import { AccessibilitySignal, AcknowledgeDocCommentsToken, IAccessibilitySignalService } from '../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IQuickInputService, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { IPreferencesService } from '../../../services/preferences/common/preferences.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';

export class ShowSignalSoundHelp extends Action2 {
	static readonly ID = 'signals.sounds.help';

	constructor() {
		super({
			id: ShowSignalSoundHelp.ID,
			title: localize2('signals.sound.help', "Help: List Signal Sounds"),
			f1: true,
			metadata: {
				description: localize('accessibility.sound.help.description', "List all accessibility sounds, noises, or audio cues and configure their settings")
			}
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const accessibilitySignalService = accessor.get(IAccessibilitySignalService);
		const quickInputService = accessor.get(IQuickInputService);
		const configurationService = accessor.get(IConfigurationService);
		const accessibilityService = accessor.get(IAccessibilityService);
		const preferencesService = accessor.get(IPreferencesService);
		const userGestureSignals = [AccessibilitySignal.save, AccessibilitySignal.format];
		const items: (IQuickPickItem & { signal: AccessibilitySignal })[] = AccessibilitySignal.allAccessibilitySignals.map((signal, idx) => ({
			label: userGestureSignals.includes(signal) ? `${signal.name} (${configurationService.getValue(signal.settingsKey + '.sound')})` : signal.name,
			signal,
			buttons: userGestureSignals.includes(signal) ? [{
				iconClass: ThemeIcon.asClassName(Codicon.settingsGear),
				tooltip: localize('sounds.help.settings', 'Configure Sound'),
				alwaysVisible: true
			}] : []
		})).sort((a, b) => a.label.localeCompare(b.label));
		const disposables = new DisposableStore();
		const qp = disposables.add(quickInputService.createQuickPick<IQuickPickItem & { signal: AccessibilitySignal }>());
		qp.items = items;
		qp.selectedItems = items.filter(i => accessibilitySignalService.isSoundEnabled(i.signal) || userGestureSignals.includes(i.signal) && configurationService.getValue(i.signal.settingsKey + '.sound') !== 'never');
		disposables.add(qp.onDidAccept(() => {
			const enabledSounds = qp.selectedItems.map(i => i.signal);
			// eslint-disable-next-line local/code-no-any-casts
			const disabledSounds = qp.items.map(i => (i as any).signal).filter(i => !enabledSounds.includes(i));
			for (const signal of enabledSounds) {
				let { sound, announcement } = configurationService.getValue<{ sound: string; announcement?: string }>(signal.settingsKey);
				sound = userGestureSignals.includes(signal) ? 'userGesture' : accessibilityService.isScreenReaderOptimized() ? 'auto' : 'on';
				if (announcement) {
					configurationService.updateValue(signal.settingsKey, { sound, announcement });
				} else {
					configurationService.updateValue(signal.settingsKey, { sound });
				}
			}

			for (const signal of disabledSounds) {
				const announcement = configurationService.getValue(signal.settingsKey + '.announcement');
				const sound = getDisabledSettingValue(userGestureSignals.includes(signal), accessibilityService.isScreenReaderOptimized());
				const value = announcement ? { sound, announcement } : { sound };
				configurationService.updateValue(signal.settingsKey, value);
			}
			qp.hide();
		}));
		disposables.add(qp.onDidTriggerItemButton(e => {
			preferencesService.openUserSettings({ jsonEditor: true, revealSetting: { key: e.item.signal.settingsKey, edit: true } });
		}));
		disposables.add(qp.onDidChangeActive(() => {
			accessibilitySignalService.playSound(qp.activeItems[0].signal.sound.getSound(true), true, AcknowledgeDocCommentsToken);
		}));
		disposables.add(qp.onDidHide(() => disposables.dispose()));
		qp.placeholder = localize('sounds.help.placeholder', 'Select a sound to play and configure');
		qp.canSelectMany = true;
		await qp.show();
	}
}

function getDisabledSettingValue(isUserGestureSignal: boolean, isScreenReaderOptimized: boolean): string {
	return isScreenReaderOptimized ? (isUserGestureSignal ? 'never' : 'off') : (isUserGestureSignal ? 'never' : 'auto');
}

export class ShowAccessibilityAnnouncementHelp extends Action2 {
	static readonly ID = 'accessibility.announcement.help';

	constructor() {
		super({
			id: ShowAccessibilityAnnouncementHelp.ID,
			title: localize2('accessibility.announcement.help', "Help: List Signal Announcements"),
			f1: true,
			metadata: {
				description: localize('accessibility.announcement.help.description', "List all accessibility announcements, alerts, braille messages, and configure their settings")
			}
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const accessibilitySignalService = accessor.get(IAccessibilitySignalService);
		const quickInputService = accessor.get(IQuickInputService);
		const configurationService = accessor.get(IConfigurationService);
		const accessibilityService = accessor.get(IAccessibilityService);
		const preferencesService = accessor.get(IPreferencesService);
		const userGestureSignals = [AccessibilitySignal.save, AccessibilitySignal.format];
		const items: (IQuickPickItem & { signal: AccessibilitySignal })[] = AccessibilitySignal.allAccessibilitySignals.filter(c => !!c.legacyAnnouncementSettingsKey).map((signal, idx) => ({
			label: userGestureSignals.includes(signal) ? `${signal.name} (${configurationService.getValue(signal.settingsKey + '.announcement')})` : signal.name,
			signal,
			buttons: userGestureSignals.includes(signal) ? [{
				iconClass: ThemeIcon.asClassName(Codicon.settingsGear),
				tooltip: localize('announcement.help.settings', 'Configure Announcement'),
				alwaysVisible: true,
			}] : []
		})).sort((a, b) => a.label.localeCompare(b.label));
		const disposables = new DisposableStore();
		const qp = disposables.add(quickInputService.createQuickPick<IQuickPickItem & { signal: AccessibilitySignal }>());
		qp.items = items;
		qp.selectedItems = items.filter(i => accessibilitySignalService.isAnnouncementEnabled(i.signal) || userGestureSignals.includes(i.signal) && configurationService.getValue(i.signal.settingsKey + '.announcement') !== 'never');
		const screenReaderOptimized = accessibilityService.isScreenReaderOptimized();
		disposables.add(qp.onDidAccept(() => {
			if (!screenReaderOptimized) {
				// announcements are off by default when screen reader is not active
				qp.hide();
				return;
			}
			const enabledAnnouncements = qp.selectedItems.map(i => i.signal);
			const disabledAnnouncements = AccessibilitySignal.allAccessibilitySignals.filter(cue => !!cue.legacyAnnouncementSettingsKey && !enabledAnnouncements.includes(cue));
			for (const signal of enabledAnnouncements) {
				let { sound, announcement } = configurationService.getValue<{ sound: string; announcement?: string }>(signal.settingsKey);
				announcement = userGestureSignals.includes(signal) ? 'userGesture' : signal.announcementMessage && accessibilityService.isScreenReaderOptimized() ? 'auto' : undefined;
				configurationService.updateValue(signal.settingsKey, { sound, announcement });
			}

			for (const signal of disabledAnnouncements) {
				const announcement = getDisabledSettingValue(userGestureSignals.includes(signal), true);
				const sound = configurationService.getValue(signal.settingsKey + '.sound');
				const value = announcement ? { sound, announcement } : { sound };
				configurationService.updateValue(signal.settingsKey, value);
			}
			qp.hide();
		}));
		disposables.add(qp.onDidTriggerItemButton(e => {
			preferencesService.openUserSettings({ jsonEditor: true, revealSetting: { key: e.item.signal.settingsKey, edit: true } });
		}));
		disposables.add(qp.onDidHide(() => disposables.dispose()));
		qp.placeholder = screenReaderOptimized ? localize('announcement.help.placeholder', 'Select an announcement to configure') : localize('announcement.help.placeholder.disabled', 'Screen reader is not active, announcements are disabled by default.');
		qp.canSelectMany = true;
		await qp.show();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/accessibilitySignals/browser/editorTextPropertySignalsContribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/accessibilitySignals/browser/editorTextPropertySignalsContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { disposableTimeout } from '../../../../base/common/async.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { IReader, autorun, autorunWithStore, derived, observableFromEvent, observableFromPromise, observableFromValueWithChangeEvent, observableSignalFromEvent, wasEventTriggeredRecently } from '../../../../base/common/observable.js';
import { isDefined } from '../../../../base/common/types.js';
import { ICodeEditor, isCodeEditor, isDiffEditor } from '../../../../editor/browser/editorBrowser.js';
import { Position } from '../../../../editor/common/core/position.js';
import { CursorChangeReason } from '../../../../editor/common/cursorEvents.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { FoldingController } from '../../../../editor/contrib/folding/browser/folding.js';
import { AccessibilityModality, AccessibilitySignal, IAccessibilitySignalService } from '../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IMarkerService, MarkerSeverity } from '../../../../platform/markers/common/markers.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IDebugService } from '../../debug/common/debug.js';

export class EditorTextPropertySignalsContribution extends Disposable implements IWorkbenchContribution {
	private readonly _textProperties: TextProperty[];

	private readonly _someAccessibilitySignalIsEnabled;

	private readonly _activeEditorObservable;

	constructor(
		@IEditorService private readonly _editorService: IEditorService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IAccessibilitySignalService private readonly _accessibilitySignalService: IAccessibilitySignalService
	) {
		super();
		this._textProperties = [
			this._instantiationService.createInstance(MarkerTextProperty, AccessibilitySignal.errorAtPosition, AccessibilitySignal.errorOnLine, MarkerSeverity.Error),
			this._instantiationService.createInstance(MarkerTextProperty, AccessibilitySignal.warningAtPosition, AccessibilitySignal.warningOnLine, MarkerSeverity.Warning),
			this._instantiationService.createInstance(FoldedAreaTextProperty),
			this._instantiationService.createInstance(BreakpointTextProperty),
		];
		this._someAccessibilitySignalIsEnabled = derived(this, reader =>
			this._textProperties
				.flatMap(p => [p.lineSignal, p.positionSignal])
				.filter(isDefined)
				.some(signal => observableFromValueWithChangeEvent(this, this._accessibilitySignalService.getEnabledState(signal, false)).read(reader))
		);
		this._activeEditorObservable = observableFromEvent(this,
			this._editorService.onDidActiveEditorChange,
			(_) => {
				const activeTextEditorControl = this._editorService.activeTextEditorControl;

				const editor = isDiffEditor(activeTextEditorControl)
					? activeTextEditorControl.getOriginalEditor()
					: isCodeEditor(activeTextEditorControl)
						? activeTextEditorControl
						: undefined;

				return editor && editor.hasModel() ? { editor, model: editor.getModel() } : undefined;
			}
		);

		this._register(autorunWithStore((reader, store) => {
			/** @description updateSignalsEnabled */
			if (!this._someAccessibilitySignalIsEnabled.read(reader)) {
				return;
			}
			const activeEditor = this._activeEditorObservable.read(reader);
			if (activeEditor) {
				this._registerAccessibilitySignalsForEditor(activeEditor.editor, activeEditor.model, store);
			}
		}));
	}

	private _registerAccessibilitySignalsForEditor(editor: ICodeEditor, editorModel: ITextModel, store: DisposableStore): void {
		let lastLine = -1;
		const ignoredLineSignalsForCurrentLine = new Set<TextProperty>();

		const timeouts = store.add(new DisposableStore());

		const propertySources = this._textProperties.map(p => ({ source: p.createSource(editor, editorModel), property: p }));

		const didType = wasEventTriggeredRecently(editor.onDidChangeModelContent, 100, store);

		store.add(editor.onDidChangeCursorPosition(args => {
			timeouts.clear();

			if (
				args &&
				args.reason !== CursorChangeReason.Explicit &&
				args.reason !== CursorChangeReason.NotSet
			) {
				// Ignore cursor changes caused by navigation (e.g. which happens when execution is paused).
				ignoredLineSignalsForCurrentLine.clear();
				return;
			}

			const trigger = (property: TextProperty, source: TextPropertySource, mode: 'line' | 'positional') => {
				const signal = mode === 'line' ? property.lineSignal : property.positionSignal;
				if (
					!signal
					|| !this._accessibilitySignalService.getEnabledState(signal, false).value
					|| !source.isPresent(position, mode, undefined)
				) {
					return;
				}

				for (const modality of ['sound', 'announcement'] as AccessibilityModality[]) {
					if (this._accessibilitySignalService.getEnabledState(signal, false, modality).value) {
						const delay = this._accessibilitySignalService.getDelayMs(signal, modality, mode) + (didType.get() ? 1000 : 0);

						timeouts.add(disposableTimeout(() => {
							if (source.isPresent(position, mode, undefined)) {
								if (!(mode === 'line') || !ignoredLineSignalsForCurrentLine.has(property)) {
									this._accessibilitySignalService.playSignal(signal, { modality });
								}
								ignoredLineSignalsForCurrentLine.add(property);
							}
						}, delay));
					}
				}
			};

			// React to cursor changes
			const position = args.position;
			const lineNumber = position.lineNumber;
			if (lineNumber !== lastLine) {
				ignoredLineSignalsForCurrentLine.clear();
				lastLine = lineNumber;
				for (const p of propertySources) {
					trigger(p.property, p.source, 'line');
				}
			}
			for (const p of propertySources) {
				trigger(p.property, p.source, 'positional');
			}

			// React to property state changes for the current cursor position
			for (const s of propertySources) {
				if (
					![s.property.lineSignal, s.property.positionSignal]
						.some(s => s && this._accessibilitySignalService.getEnabledState(s, false).value)
				) {
					return;
				}

				let lastValueAtPosition: boolean | undefined = undefined;
				let lastValueOnLine: boolean | undefined = undefined;
				timeouts.add(autorun(reader => {
					const newValueAtPosition = s.source.isPresentAtPosition(args.position, reader);
					const newValueOnLine = s.source.isPresentOnLine(args.position.lineNumber, reader);

					if (lastValueAtPosition !== undefined && lastValueAtPosition !== undefined) {
						if (!lastValueAtPosition && newValueAtPosition) {
							trigger(s.property, s.source, 'positional');
						}
						if (!lastValueOnLine && newValueOnLine) {
							trigger(s.property, s.source, 'line');
						}
					}

					lastValueAtPosition = newValueAtPosition;
					lastValueOnLine = newValueOnLine;
				}));
			}
		}));
	}
}

interface TextProperty {
	readonly positionSignal?: AccessibilitySignal;
	readonly lineSignal?: AccessibilitySignal;
	readonly debounceWhileTyping?: boolean;
	createSource(editor: ICodeEditor, model: ITextModel): TextPropertySource;
}

class TextPropertySource {
	public static notPresent = new TextPropertySource({ isPresentAtPosition: () => false, isPresentOnLine: () => false });

	public readonly isPresentOnLine: (lineNumber: number, reader: IReader | undefined) => boolean;
	public readonly isPresentAtPosition: (position: Position, reader: IReader | undefined) => boolean;

	constructor(options: {
		isPresentOnLine: (lineNumber: number, reader: IReader | undefined) => boolean;
		isPresentAtPosition?: (position: Position, reader: IReader | undefined) => boolean;
	}) {
		this.isPresentOnLine = options.isPresentOnLine;
		this.isPresentAtPosition = options.isPresentAtPosition ?? (() => false);
	}

	public isPresent(position: Position, mode: 'line' | 'positional', reader: IReader | undefined): boolean {
		return mode === 'line' ? this.isPresentOnLine(position.lineNumber, reader) : this.isPresentAtPosition(position, reader);
	}
}

class MarkerTextProperty implements TextProperty {
	public readonly debounceWhileTyping = true;
	constructor(
		public readonly positionSignal: AccessibilitySignal,
		public readonly lineSignal: AccessibilitySignal,
		private readonly severity: MarkerSeverity,
		@IMarkerService private readonly markerService: IMarkerService,

	) { }

	createSource(editor: ICodeEditor, model: ITextModel): TextPropertySource {
		const obs = observableSignalFromEvent('onMarkerChanged', this.markerService.onMarkerChanged);
		return new TextPropertySource({
			isPresentAtPosition: (position, reader) => {
				obs.read(reader);
				const hasMarker = this.markerService
					.read({ resource: model.uri })
					.some(
						(m) =>
							m.severity === this.severity &&
							m.startLineNumber <= position.lineNumber &&
							position.lineNumber <= m.endLineNumber &&
							m.startColumn <= position.column &&
							position.column <= m.endColumn
					);
				return hasMarker;
			},
			isPresentOnLine: (lineNumber, reader) => {
				obs.read(reader);
				const hasMarker = this.markerService
					.read({ resource: model.uri })
					.some(
						(m) =>
							m.severity === this.severity &&
							m.startLineNumber <= lineNumber &&
							lineNumber <= m.endLineNumber
					);
				return hasMarker;
			}
		});
	}
}

class FoldedAreaTextProperty implements TextProperty {
	public readonly lineSignal = AccessibilitySignal.foldedArea;

	createSource(editor: ICodeEditor, _model: ITextModel): TextPropertySource {
		const foldingController = FoldingController.get(editor);
		if (!foldingController) { return TextPropertySource.notPresent; }

		const foldingModel = observableFromPromise(foldingController.getFoldingModel() ?? Promise.resolve(undefined));
		return new TextPropertySource({
			isPresentOnLine(lineNumber, reader): boolean {
				const m = foldingModel.read(reader);
				const regionAtLine = m.value?.getRegionAtLine(lineNumber);
				const hasFolding = !regionAtLine
					? false
					: regionAtLine.isCollapsed &&
					regionAtLine.startLineNumber === lineNumber;
				return hasFolding;
			}
		});
	}
}

class BreakpointTextProperty implements TextProperty {
	public readonly lineSignal = AccessibilitySignal.break;

	constructor(@IDebugService private readonly debugService: IDebugService) { }

	createSource(editor: ICodeEditor, model: ITextModel): TextPropertySource {
		const signal = observableSignalFromEvent('onDidChangeBreakpoints', this.debugService.getModel().onDidChangeBreakpoints);
		const debugService = this.debugService;
		return new TextPropertySource({
			isPresentOnLine(lineNumber, reader): boolean {
				signal.read(reader);
				const breakpoints = debugService
					.getModel()
					.getBreakpoints({ uri: model.uri, lineNumber });
				const hasBreakpoints = breakpoints.length > 0;
				return hasBreakpoints;
			}
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/accessibilitySignals/browser/openDiffEditorAnnouncement.ts]---
Location: vscode-main/src/vs/workbench/contrib/accessibilitySignals/browser/openDiffEditorAnnouncement.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { isDiffEditor } from '../../../../editor/browser/editorBrowser.js';
import { localize } from '../../../../nls.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { Event } from '../../../../base/common/event.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';

export class DiffEditorActiveAnnouncementContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.diffEditorActiveAnnouncement';

	private _onDidActiveEditorChangeListener?: IDisposable;

	constructor(
		@IEditorService private readonly _editorService: IEditorService,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService,
		@IConfigurationService private readonly _configurationService: IConfigurationService
	) {
		super();
		this._register(Event.runAndSubscribe(_accessibilityService.onDidChangeScreenReaderOptimized, () => this._updateListener()));
		this._register(_configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(AccessibilityVerbositySettingId.DiffEditorActive)) {
				this._updateListener();
			}
		}));
	}

	private _updateListener(): void {
		const announcementEnabled = this._configurationService.getValue(AccessibilityVerbositySettingId.DiffEditorActive);
		const screenReaderOptimized = this._accessibilityService.isScreenReaderOptimized();

		if (!announcementEnabled || !screenReaderOptimized) {
			this._onDidActiveEditorChangeListener?.dispose();
			this._onDidActiveEditorChangeListener = undefined;
			return;
		}

		if (this._onDidActiveEditorChangeListener) {
			return;
		}

		this._onDidActiveEditorChangeListener = this._register(this._editorService.onDidActiveEditorChange(() => {
			if (isDiffEditor(this._editorService.activeTextEditorControl)) {
				this._accessibilityService.alert(localize('openDiffEditorAnnouncement', "Diff editor"));
			}
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/accessibilitySignals/browser/saveAccessibilitySignal.ts]---
Location: vscode-main/src/vs/workbench/contrib/accessibilitySignals/browser/saveAccessibilitySignal.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { SaveReason } from '../../../common/editor.js';
import { IWorkingCopyService } from '../../../services/workingCopy/common/workingCopyService.js';

export class SaveAccessibilitySignalContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.saveAccessibilitySignal';

	constructor(
		@IAccessibilitySignalService private readonly _accessibilitySignalService: IAccessibilitySignalService,
		@IWorkingCopyService private readonly _workingCopyService: IWorkingCopyService,
	) {
		super();
		this._register(this._workingCopyService.onDidSave(e => this._accessibilitySignalService.playSignal(AccessibilitySignal.save, { userGesture: e.reason === SaveReason.EXPLICIT })));
	}
}
```

--------------------------------------------------------------------------------

````

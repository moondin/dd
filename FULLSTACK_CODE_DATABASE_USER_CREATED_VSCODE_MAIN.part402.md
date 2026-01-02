---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 402
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 402 of 552)

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

---[FILE: src/vs/workbench/contrib/interactive/browser/interactiveEditorInput.ts]---
Location: vscode-main/src/vs/workbench/contrib/interactive/browser/interactiveEditorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { IReference } from '../../../../base/common/lifecycle.js';
import * as paths from '../../../../base/common/path.js';
import { isEqual, joinPath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../editor/common/languages/modesRegistry.js';
import { IResolvedTextEditorModel, ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { EditorInputCapabilities, GroupIdentifier, IRevertOptions, ISaveOptions, IUntypedEditorInput } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IInteractiveDocumentService } from './interactiveDocumentService.js';
import { IInteractiveHistoryService } from './interactiveHistoryService.js';
import { IResolvedNotebookEditorModel, NotebookSetting } from '../../notebook/common/notebookCommon.js';
import { ICompositeNotebookEditorInput, NotebookEditorInput } from '../../notebook/common/notebookEditorInput.js';
import { INotebookService } from '../../notebook/common/notebookService.js';

export class InteractiveEditorInput extends EditorInput implements ICompositeNotebookEditorInput {
	static create(instantiationService: IInstantiationService, resource: URI, inputResource: URI, title?: string, language?: string) {
		return instantiationService.createInstance(InteractiveEditorInput, resource, inputResource, title, language);
	}

	private static windowNames: Record<string, string> = {};

	static setName(notebookUri: URI, title: string | undefined) {
		if (title) {
			this.windowNames[notebookUri.path] = title;
		}
	}

	static readonly ID: string = 'workbench.input.interactive';

	public override get editorId(): string {
		return 'interactive';
	}

	override get typeId(): string {
		return InteractiveEditorInput.ID;
	}

	private name: string;
	private readonly isScratchpad: boolean;

	get language() {
		return this._inputModelRef?.object.textEditorModel.getLanguageId() ?? this._initLanguage;
	}
	private _initLanguage?: string;

	private _notebookEditorInput: NotebookEditorInput;
	get notebookEditorInput() {
		return this._notebookEditorInput;
	}

	get editorInputs() {
		return [this._notebookEditorInput];
	}

	private _resource: URI;

	override get resource(): URI {
		return this._resource;
	}

	private _inputResource: URI;

	get inputResource() {
		return this._inputResource;
	}
	private _inputResolver: Promise<IResolvedNotebookEditorModel | null> | null;
	private _editorModelReference: IResolvedNotebookEditorModel | null;

	private _inputModelRef: IReference<IResolvedTextEditorModel> | null;

	get primary(): EditorInput {
		return this._notebookEditorInput;
	}
	private _textModelService: ITextModelService;
	private _interactiveDocumentService: IInteractiveDocumentService;
	private _historyService: IInteractiveHistoryService;


	constructor(
		resource: URI,
		inputResource: URI,
		title: string | undefined,
		languageId: string | undefined,
		@IInstantiationService instantiationService: IInstantiationService,
		@ITextModelService textModelService: ITextModelService,
		@IInteractiveDocumentService interactiveDocumentService: IInteractiveDocumentService,
		@IInteractiveHistoryService historyService: IInteractiveHistoryService,
		@INotebookService private readonly _notebookService: INotebookService,
		@IFileDialogService private readonly _fileDialogService: IFileDialogService,
		@IConfigurationService configurationService: IConfigurationService
	) {
		const input = NotebookEditorInput.getOrCreate(instantiationService, resource, undefined, 'interactive', {});
		super();
		this.isScratchpad = configurationService.getValue<boolean>(NotebookSetting.InteractiveWindowPromptToSave) !== true;
		this._notebookEditorInput = input;
		this._register(this._notebookEditorInput);
		this.name = title ?? InteractiveEditorInput.windowNames[resource.path] ?? paths.basename(resource.path, paths.extname(resource.path));
		this._initLanguage = languageId;
		this._resource = resource;
		this._inputResource = inputResource;
		this._inputResolver = null;
		this._editorModelReference = null;
		this._inputModelRef = null;
		this._textModelService = textModelService;
		this._interactiveDocumentService = interactiveDocumentService;
		this._historyService = historyService;

		this._registerListeners();
	}

	private _registerListeners(): void {
		const oncePrimaryDisposed = Event.once(this.primary.onWillDispose);
		this._register(oncePrimaryDisposed(() => {
			if (!this.isDisposed()) {
				this.dispose();
			}
		}));

		// Re-emit some events from the primary side to the outside
		this._register(this.primary.onDidChangeDirty(() => this._onDidChangeDirty.fire()));
		this._register(this.primary.onDidChangeLabel(() => this._onDidChangeLabel.fire()));

		// Re-emit some events from both sides to the outside
		this._register(this.primary.onDidChangeCapabilities(() => this._onDidChangeCapabilities.fire()));
	}

	override get capabilities(): EditorInputCapabilities {
		const scratchPad = this.isScratchpad ? EditorInputCapabilities.Scratchpad : 0;

		return EditorInputCapabilities.Untitled
			| EditorInputCapabilities.Readonly
			| scratchPad;
	}

	private async _resolveEditorModel() {
		if (!this._editorModelReference) {
			this._editorModelReference = await this._notebookEditorInput.resolve();
		}

		return this._editorModelReference;
	}

	override async resolve(): Promise<IResolvedNotebookEditorModel | null> {
		if (this._editorModelReference) {
			return this._editorModelReference;
		}

		if (this._inputResolver) {
			return this._inputResolver;
		}

		this._inputResolver = this._resolveEditorModel();

		return this._inputResolver;
	}

	async resolveInput(language?: string) {
		if (this._inputModelRef) {
			return this._inputModelRef.object.textEditorModel;
		}

		const resolvedLanguage = language ?? this._initLanguage ?? PLAINTEXT_LANGUAGE_ID;
		this._interactiveDocumentService.willCreateInteractiveDocument(this.resource, this.inputResource, resolvedLanguage);
		this._inputModelRef = await this._textModelService.createModelReference(this.inputResource);

		return this._inputModelRef.object.textEditorModel;
	}

	override async save(group: GroupIdentifier, options?: ISaveOptions): Promise<EditorInput | IUntypedEditorInput | undefined> {
		if (this._editorModelReference) {

			if (this.hasCapability(EditorInputCapabilities.Untitled)) {
				return this.saveAs(group, options);
			} else {
				await this._editorModelReference.save(options);
			}

			return this;
		}

		return undefined;
	}

	override async saveAs(group: GroupIdentifier, options?: ISaveOptions): Promise<IUntypedEditorInput | undefined> {
		if (!this._editorModelReference) {
			return undefined;
		}

		const provider = this._notebookService.getContributedNotebookType('interactive');

		if (!provider) {
			return undefined;
		}

		const filename = this.getName() + '.ipynb';
		const pathCandidate = joinPath(await this._fileDialogService.defaultFilePath(), filename);

		const target = await this._fileDialogService.pickFileToSave(pathCandidate, options?.availableFileSystems);
		if (!target) {
			return undefined; // save cancelled
		}

		const saved = await this._editorModelReference.saveAs(target);
		if (saved && 'resource' in saved && saved.resource) {
			this._notebookService.getNotebookTextModel(saved.resource)?.dispose();
		}
		return saved;
	}

	override matches(otherInput: EditorInput | IUntypedEditorInput): boolean {
		if (super.matches(otherInput)) {
			return true;
		}
		if (otherInput instanceof InteractiveEditorInput) {
			return isEqual(this.resource, otherInput.resource) && isEqual(this.inputResource, otherInput.inputResource);
		}
		return false;
	}

	override getName() {
		return this.name;
	}

	override isDirty(): boolean {
		if (this.isScratchpad) {
			return false;
		}

		return this._editorModelReference?.isDirty() ?? false;
	}

	override isModified() {
		return this._editorModelReference?.isModified() ?? false;
	}

	override async revert(_group: GroupIdentifier, options?: IRevertOptions): Promise<void> {
		if (this._editorModelReference && this._editorModelReference.isDirty()) {
			await this._editorModelReference.revert(options);
		}
	}

	override dispose() {
		// we support closing the interactive window without prompt, so the editor model should not be dirty
		this._editorModelReference?.revert({ soft: true });

		this._notebookEditorInput?.dispose();
		this._editorModelReference?.dispose();
		this._editorModelReference = null;
		this._interactiveDocumentService.willRemoveInteractiveDocument(this.resource, this.inputResource);
		this._inputModelRef?.dispose();
		this._inputModelRef = null;
		super.dispose();
	}

	get historyService() {
		return this._historyService;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/interactive/browser/interactiveHistoryService.ts]---
Location: vscode-main/src/vs/workbench/contrib/interactive/browser/interactiveHistoryService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { HistoryNavigator2 } from '../../../../base/common/history.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { URI } from '../../../../base/common/uri.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export const IInteractiveHistoryService = createDecorator<IInteractiveHistoryService>('IInteractiveHistoryService');

export interface IInteractiveHistoryService {
	readonly _serviceBrand: undefined;

	matchesCurrent(uri: URI, value: string): boolean;
	addToHistory(uri: URI, value: string): void;
	getPreviousValue(uri: URI): string | null;
	getNextValue(uri: URI): string | null;
	replaceLast(uri: URI, value: string): void;
	clearHistory(uri: URI): void;
	has(uri: URI): boolean;
}

export class InteractiveHistoryService extends Disposable implements IInteractiveHistoryService {
	declare readonly _serviceBrand: undefined;
	_history: ResourceMap<HistoryNavigator2<string>>;

	constructor() {
		super();

		this._history = new ResourceMap<HistoryNavigator2<string>>();
	}

	matchesCurrent(uri: URI, value: string): boolean {
		const history = this._history.get(uri);
		if (!history) {
			return false;
		}

		return history.current() === value;
	}

	addToHistory(uri: URI, value: string): void {
		const history = this._history.get(uri);
		if (!history) {
			this._history.set(uri, new HistoryNavigator2<string>([value], 50));
			return;
		}

		history.resetCursor();
		history.add(value);
	}

	getPreviousValue(uri: URI): string | null {
		const history = this._history.get(uri);
		return history?.previous() ?? null;
	}

	getNextValue(uri: URI): string | null {
		const history = this._history.get(uri);

		return history?.next() ?? null;
	}

	replaceLast(uri: URI, value: string) {
		const history = this._history.get(uri);
		if (!history) {
			this._history.set(uri, new HistoryNavigator2<string>([value], 50));
			return;
		} else {
			history.replaceLast(value);
			history.resetCursor();
		}
	}

	clearHistory(uri: URI) {
		this._history.delete(uri);
	}

	has(uri: URI) {
		return this._history.has(uri) ? true : false;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/interactive/browser/replInputHintContentWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/interactive/browser/replInputHintContentWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { status } from '../../../../base/browser/ui/aria/aria.js';
import { KeybindingLabel } from '../../../../base/browser/ui/keybindingLabel/keybindingLabel.js';
import { Event } from '../../../../base/common/event.js';
import { ResolvedKeybinding } from '../../../../base/common/keybindings.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { OS } from '../../../../base/common/platform.js';
import { ContentWidgetPositionPreference, ICodeEditor, IContentWidget, IContentWidgetPosition } from '../../../../editor/browser/editorBrowser.js';
import { ConfigurationChangedEvent, EditorOption } from '../../../../editor/common/config/editorOptions.js';
import { Position } from '../../../../editor/common/core/position.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { AccessibilityCommandId } from '../../accessibility/common/accessibilityCommands.js';
import { ReplEditorSettings } from './interactiveCommon.js';


export class ReplInputHintContentWidget extends Disposable implements IContentWidget {

	private static readonly ID = 'replInput.widget.emptyHint';

	private domNode: HTMLElement | undefined;
	private ariaLabel: string = '';
	private label: KeybindingLabel | undefined;

	constructor(
		private readonly editor: ICodeEditor,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
	) {
		super();

		this._register(this.editor.onDidChangeConfiguration((e: ConfigurationChangedEvent) => {
			if (this.domNode && e.hasChanged(EditorOption.fontInfo)) {
				this.editor.applyFontInfo(this.domNode);
			}
		}));
		const onDidFocusEditorText = Event.debounce(this.editor.onDidFocusEditorText, () => undefined, 500);
		this._register(onDidFocusEditorText(() => {
			if (this.editor.hasTextFocus() && this.ariaLabel && configurationService.getValue(AccessibilityVerbositySettingId.ReplEditor)) {
				status(this.ariaLabel);
			}
		}));
		this._register(configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(ReplEditorSettings.executeWithShiftEnter)) {
				this.setHint();
			}
		}));
		this.editor.addContentWidget(this);
	}

	getId(): string {
		return ReplInputHintContentWidget.ID;
	}

	getPosition(): IContentWidgetPosition | null {
		return {
			position: { lineNumber: 1, column: 1 },
			preference: [ContentWidgetPositionPreference.EXACT]
		};
	}

	getDomNode(): HTMLElement {
		if (!this.domNode) {
			this.domNode = dom.$('.empty-editor-hint');
			this.domNode.style.width = 'max-content';
			this.domNode.style.paddingLeft = '4px';

			this.setHint();

			this._register(dom.addDisposableListener(this.domNode, 'click', () => {
				this.editor.focus();
			}));

			this.editor.applyFontInfo(this.domNode);
			const lineHeight = this.editor.getLineHeightForPosition(new Position(1, 1));
			this.domNode.style.lineHeight = lineHeight + 'px';
		}

		return this.domNode;
	}

	private setHint() {
		if (!this.domNode) {
			return;
		}
		while (this.domNode.firstChild) {
			this.domNode.removeChild(this.domNode.firstChild);
		}

		const hintElement = dom.$('div.empty-hint-text');
		hintElement.style.cursor = 'text';
		hintElement.style.whiteSpace = 'nowrap';

		const keybinding = this.getKeybinding();
		const keybindingHintLabel = keybinding?.getLabel();

		if (keybinding && keybindingHintLabel) {
			const actionPart = localize('emptyHintText', 'Press {0} to execute. ', keybindingHintLabel);

			const [before, after] = actionPart.split(keybindingHintLabel).map((fragment) => {
				const hintPart = dom.$('span', undefined, fragment);
				hintPart.style.fontStyle = 'italic';
				return hintPart;
			});

			hintElement.appendChild(before);

			if (this.label) {
				this.label.dispose();
			}
			this.label = this._register(new KeybindingLabel(hintElement, OS));
			this.label.set(keybinding);
			this.label.element.style.width = 'min-content';
			this.label.element.style.display = 'inline';

			hintElement.appendChild(after);
			this.domNode.append(hintElement);

			const helpKeybinding = this.keybindingService.lookupKeybinding(AccessibilityCommandId.OpenAccessibilityHelp)?.getLabel();
			const helpInfo = helpKeybinding
				? localize('ReplInputAriaLabelHelp', "Use {0} for accessibility help. ", helpKeybinding)
				: localize('ReplInputAriaLabelHelpNoKb', "Run the Open Accessibility Help command for more information. ");

			this.ariaLabel = actionPart.concat(helpInfo, localize('disableHint', ' Toggle {0} in settings to disable this hint.', AccessibilityVerbositySettingId.ReplEditor));
		}
	}

	private getKeybinding() {
		const keybindings = this.keybindingService.lookupKeybindings('interactive.execute');
		const shiftEnterConfig = this.configurationService.getValue(ReplEditorSettings.executeWithShiftEnter);
		const hasEnterChord = (kb: ResolvedKeybinding, modifier: string = '') => {
			const chords = kb.getDispatchChords();
			const chord = modifier + 'Enter';
			const chordAlt = modifier + '[Enter]';
			return chords.length === 1 && (chords[0] === chord || chords[0] === chordAlt);
		};

		if (shiftEnterConfig) {
			const keybinding = keybindings.find(kb => hasEnterChord(kb, 'shift+'));
			if (keybinding) {
				return keybinding;
			}
		} else {
			let keybinding = keybindings.find(kb => hasEnterChord(kb));
			if (keybinding) {
				return keybinding;
			}
			keybinding = this.keybindingService.lookupKeybindings('python.execInREPLEnter')
				.find(kb => hasEnterChord(kb));
			if (keybinding) {
				return keybinding;
			}
		}

		return keybindings?.[0];
	}

	override dispose(): void {
		super.dispose();
		this.editor.removeContentWidget(this);
		this.label?.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/interactive/browser/media/interactive.css]---
Location: vscode-main/src/vs/workbench/contrib/interactive/browser/media/interactive.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.interactive-editor .input-cell-container {
	box-sizing: border-box;
}

.interactive-editor .input-cell-container .input-focus-indicator {
	position: absolute;
	left: 0px;
	height: 19px;
}

.interactive-editor .input-cell-container .input-focus-indicator::before {
	border-left: 3px solid transparent;
	border-radius: 2px;
	margin-left: 4px;
	content: "";
	position: absolute;
	width: 0px;
	height: 100%;
	z-index: 10;
	left: 0px;
	top: 0px;
	height: 100%;
}

.interactive-editor .input-cell-container .run-button-container {
	position: absolute;
}

.interactive-editor .input-cell-container .run-button-container .monaco-toolbar .actions-container {
	justify-content: center;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/issue/browser/baseIssueReporterService.ts]---
Location: vscode-main/src/vs/workbench/contrib/issue/browser/baseIssueReporterService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { $, isHTMLInputElement, isHTMLTextAreaElement, reset } from '../../../../base/browser/dom.js';
import { createStyleSheet } from '../../../../base/browser/domStylesheets.js';
import { Button, ButtonWithDropdown, unthemedButtonStyles } from '../../../../base/browser/ui/button/button.js';
import { renderIcon } from '../../../../base/browser/ui/iconLabel/iconLabels.js';
import { Delayer, RunOnceScheduler } from '../../../../base/common/async.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { groupBy } from '../../../../base/common/collections.js';
import { debounce } from '../../../../base/common/decorators.js';
import { CancellationError } from '../../../../base/common/errors.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { isLinuxSnap, isMacintosh } from '../../../../base/common/platform.js';
import { IProductConfiguration } from '../../../../base/common/product.js';
import { joinPath } from '../../../../base/common/resources.js';
import { escape } from '../../../../base/common/strings.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { Action } from '../../../../base/common/actions.js';
import { localize } from '../../../../nls.js';
import { IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { getIconsStyleSheet } from '../../../../platform/theme/browser/iconsStyleSheet.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IIssueFormService, IssueReporterData, IssueReporterExtensionData, IssueType } from '../common/issue.js';
import { normalizeGitHubUrl } from '../common/issueReporterUtil.js';
import { IssueReporterModel, IssueReporterData as IssueReporterModelData } from './issueReporterModel.js';
import { IAuthenticationService } from '../../../services/authentication/common/authentication.js';

const MAX_URL_LENGTH = 7500;

// Github API and issues on web has a limit of 65536. If extension data is too large, we will allow users to downlaod and attach it as a file.
// We round down to be safe.
// ref https://github.com/github/issues/issues/12858

const MAX_EXTENSION_DATA_LENGTH = 60000;

interface SearchResult {
	html_url: string;
	title: string;
	state?: string;
}

enum IssueSource {
	VSCode = 'vscode',
	Extension = 'extension',
	Marketplace = 'marketplace',
	Unknown = 'unknown'
}


export class BaseIssueReporterService extends Disposable {
	public issueReporterModel: IssueReporterModel;
	public receivedSystemInfo = false;
	public numberOfSearchResultsDisplayed = 0;
	public receivedPerformanceInfo = false;
	public shouldQueueSearch = false;
	public hasBeenSubmitted = false;
	public openReporter = false;
	public loadingExtensionData = false;
	public selectedExtension = '';
	public delayedSubmit = new Delayer<void>(300);
	public publicGithubButton!: Button | ButtonWithDropdown;
	public internalGithubButton!: Button | ButtonWithDropdown;
	public nonGitHubIssueUrl = false;
	public needsUpdate = false;
	public acknowledged = false;
	private createAction: Action;
	private previewAction: Action;
	private privateAction: Action;

	constructor(
		public disableExtensions: boolean,
		public data: IssueReporterData,
		public os: {
			type: string;
			arch: string;
			release: string;
		},
		public product: IProductConfiguration,
		public readonly window: Window,
		public readonly isWeb: boolean,
		@IIssueFormService public readonly issueFormService: IIssueFormService,
		@IThemeService public readonly themeService: IThemeService,
		@IFileService public readonly fileService: IFileService,
		@IFileDialogService public readonly fileDialogService: IFileDialogService,
		@IContextMenuService public readonly contextMenuService: IContextMenuService,
		@IAuthenticationService public readonly authenticationService: IAuthenticationService,
		@IOpenerService public readonly openerService: IOpenerService
	) {
		super();
		const targetExtension = data.extensionId ? data.enabledExtensions.find(extension => extension.id.toLocaleLowerCase() === data.extensionId?.toLocaleLowerCase()) : undefined;
		this.issueReporterModel = new IssueReporterModel({
			...data,
			issueType: data.issueType || IssueType.Bug,
			versionInfo: {
				vscodeVersion: `${product.nameShort} ${!!product.darwinUniversalAssetId ? `${product.version} (Universal)` : product.version} (${product.commit || 'Commit unknown'}, ${product.date || 'Date unknown'})`,
				os: `${this.os.type} ${this.os.arch} ${this.os.release}${isLinuxSnap ? ' snap' : ''}`
			},
			extensionsDisabled: !!this.disableExtensions,
			fileOnExtension: data.extensionId ? !targetExtension?.isBuiltin : undefined,
			selectedExtension: targetExtension
		});

		this._register(this.authenticationService.onDidChangeSessions(async () => {
			const previousAuthState = !!this.data.githubAccessToken;

			let githubAccessToken = '';
			try {
				const githubSessions = await this.authenticationService.getSessions('github');
				const potentialSessions = githubSessions.filter(session => session.scopes.includes('repo'));
				githubAccessToken = potentialSessions[0]?.accessToken;
			} catch (e) {
				// Ignore
			}

			this.data.githubAccessToken = githubAccessToken;

			const currentAuthState = !!githubAccessToken;
			if (previousAuthState !== currentAuthState) {
				this.updateButtonStates();
			}
		}));

		const fileOnMarketplace = data.issueSource === IssueSource.Marketplace;
		const fileOnProduct = data.issueSource === IssueSource.VSCode;
		this.issueReporterModel.update({ fileOnMarketplace, fileOnProduct });

		this.createAction = this._register(new Action('issueReporter.create', localize('create', "Create on GitHub"), undefined, true, async () => {
			this.delayedSubmit.trigger(async () => {
				this.createIssue(true); // create issue
			});
		}));
		this.previewAction = this._register(new Action('issueReporter.preview', localize('preview', "Preview on GitHub"), undefined, true, async () => {
			this.delayedSubmit.trigger(async () => {
				this.createIssue(false); // preview issue
			});
		}));
		this.privateAction = this._register(new Action('issueReporter.privateCreate', localize('privateCreate', "Create Internally"), undefined, true, async () => {
			this.delayedSubmit.trigger(async () => {
				this.createIssue(true, true); // create private issue
			});
		}));

		const issueTitle = data.issueTitle;
		if (issueTitle) {
			// eslint-disable-next-line no-restricted-syntax
			const issueTitleElement = this.getElementById<HTMLInputElement>('issue-title');
			if (issueTitleElement) {
				issueTitleElement.value = issueTitle;
			}
		}

		const issueBody = data.issueBody;
		if (issueBody) {
			// eslint-disable-next-line no-restricted-syntax
			const description = this.getElementById<HTMLTextAreaElement>('description');
			if (description) {
				description.value = issueBody;
				this.issueReporterModel.update({ issueDescription: issueBody });
			}
		}

		if (this.window.document.documentElement.lang !== 'en') {
			// eslint-disable-next-line no-restricted-syntax
			show(this.getElementById('english'));
		}

		const codiconStyleSheet = createStyleSheet();
		codiconStyleSheet.id = 'codiconStyles';

		const iconsStyleSheet = this._register(getIconsStyleSheet(this.themeService));
		function updateAll() {
			codiconStyleSheet.textContent = iconsStyleSheet.getCSS();
		}

		const delayer = new RunOnceScheduler(updateAll, 0);
		this._register(iconsStyleSheet.onDidChange(() => delayer.schedule()));
		delayer.schedule();

		this.handleExtensionData(data.enabledExtensions);
		this.setUpTypes();

		// Handle case where extension is pre-selected through the command
		if ((data.data || data.uri) && targetExtension) {
			this.updateExtensionStatus(targetExtension);
		}

		// initialize the reporting button(s)
		// eslint-disable-next-line no-restricted-syntax
		const issueReporterElement = this.getElementById('issue-reporter');
		if (issueReporterElement) {
			this.updateButtonStates();
		}
	}

	render(): void {
		this.renderBlocks();
	}

	setInitialFocus() {
		const { fileOnExtension } = this.issueReporterModel.getData();
		if (fileOnExtension) {
			// eslint-disable-next-line no-restricted-syntax
			const issueTitle = this.window.document.getElementById('issue-title');
			issueTitle?.focus();
		} else {
			// eslint-disable-next-line no-restricted-syntax
			const issueType = this.window.document.getElementById('issue-type');
			issueType?.focus();
		}
	}

	public updateButtonStates() {
		// eslint-disable-next-line no-restricted-syntax
		const issueReporterElement = this.getElementById('issue-reporter');
		if (!issueReporterElement) {
			// shouldn't occur -- throw?
			return;
		}


		// public elements section
		// eslint-disable-next-line no-restricted-syntax
		let publicElements = this.getElementById('public-elements');
		if (!publicElements) {
			publicElements = document.createElement('div');
			publicElements.id = 'public-elements';
			publicElements.classList.add('public-elements');
			issueReporterElement.appendChild(publicElements);
		}
		this.updatePublicGithubButton(publicElements);
		this.updatePublicRepoLink(publicElements);


		// private filing section
		// eslint-disable-next-line no-restricted-syntax
		let internalElements = this.getElementById('internal-elements');
		if (!internalElements) {
			internalElements = document.createElement('div');
			internalElements.id = 'internal-elements';
			internalElements.classList.add('internal-elements');
			internalElements.classList.add('hidden');
			issueReporterElement.appendChild(internalElements);
		}
		// eslint-disable-next-line no-restricted-syntax
		let filingRow = this.getElementById('internal-top-row');
		if (!filingRow) {
			filingRow = document.createElement('div');
			filingRow.id = 'internal-top-row';
			filingRow.classList.add('internal-top-row');
			internalElements.appendChild(filingRow);
		}
		this.updateInternalFilingNote(filingRow);
		this.updateInternalGithubButton(filingRow);
		this.updateInternalElementsVisibility();
	}

	private updateInternalFilingNote(container: HTMLElement) {
		// eslint-disable-next-line no-restricted-syntax
		let filingNote = this.getElementById('internal-preview-message');
		if (!filingNote) {
			filingNote = document.createElement('span');
			filingNote.id = 'internal-preview-message';
			filingNote.classList.add('internal-preview-message');
			container.appendChild(filingNote);
		}

		filingNote.textContent = escape(localize('internalPreviewMessage', 'If your copilot debug logs contain private information:'));
	}

	private updatePublicGithubButton(container: HTMLElement): void {
		// eslint-disable-next-line no-restricted-syntax
		const issueReporterElement = this.getElementById('issue-reporter');
		if (!issueReporterElement) {
			return;
		}

		// Dispose of the existing button
		if (this.publicGithubButton) {
			this.publicGithubButton.dispose();
		}

		// setup button + dropdown if applicable
		if (!this.acknowledged && this.needsUpdate) { // * old version and hasn't ack'd
			this.publicGithubButton = this._register(new Button(container, unthemedButtonStyles));
			this.publicGithubButton.label = localize('acknowledge', "Confirm Version Acknowledgement");
			this.publicGithubButton.enabled = false;
		} else if (this.data.githubAccessToken && this.isPreviewEnabled()) { // * has access token, create by default, preview dropdown
			this.publicGithubButton = this._register(new ButtonWithDropdown(container, {
				contextMenuProvider: this.contextMenuService,
				actions: [this.previewAction],
				addPrimaryActionToDropdown: false,
				...unthemedButtonStyles
			}));
			this._register(this.publicGithubButton.onDidClick(() => {
				this.createAction.run();
			}));
			this.publicGithubButton.label = localize('createOnGitHub', "Create on GitHub");
			this.publicGithubButton.enabled = true;
		} else if (this.data.githubAccessToken && !this.isPreviewEnabled()) { // * Access token but invalid preview state: simple Button (create only)
			this.publicGithubButton = this._register(new Button(container, unthemedButtonStyles));
			this._register(this.publicGithubButton.onDidClick(() => {
				this.createAction.run();
			}));
			this.publicGithubButton.label = localize('createOnGitHub', "Create on GitHub");
			this.publicGithubButton.enabled = true;
		} else { // * No access token: simple Button (preview only)
			this.publicGithubButton = this._register(new Button(container, unthemedButtonStyles));
			this._register(this.publicGithubButton.onDidClick(() => {
				this.previewAction.run();
			}));
			this.publicGithubButton.label = localize('previewOnGitHub', "Preview on GitHub");
			this.publicGithubButton.enabled = true;
		}

		// make sure that the repo link is after the button
		// eslint-disable-next-line no-restricted-syntax
		const repoLink = this.getElementById('show-repo-name');
		if (repoLink) {
			container.insertBefore(this.publicGithubButton.element, repoLink);
		}
	}

	private updatePublicRepoLink(container: HTMLElement): void {
		// eslint-disable-next-line no-restricted-syntax
		let issueRepoName = this.getElementById('show-repo-name') as HTMLAnchorElement;
		if (!issueRepoName) {
			issueRepoName = document.createElement('a');
			issueRepoName.id = 'show-repo-name';
			issueRepoName.classList.add('hidden');
			container.appendChild(issueRepoName);
		}


		const selectedExtension = this.issueReporterModel.getData().selectedExtension;
		if (selectedExtension && selectedExtension.uri) {
			const urlString = URI.revive(selectedExtension.uri).toString();
			issueRepoName.href = urlString;
			issueRepoName.addEventListener('click', (e) => this.openLink(e));
			issueRepoName.addEventListener('auxclick', (e) => this.openLink(<MouseEvent>e));
			const gitHubInfo = this.parseGitHubUrl(urlString);
			issueRepoName.textContent = gitHubInfo ? gitHubInfo.owner + '/' + gitHubInfo.repositoryName : urlString;
			Object.assign(issueRepoName.style, {
				alignSelf: 'flex-end',
				display: 'block',
				fontSize: '13px',
				padding: '4px 0px',
				textDecoration: 'none',
				width: 'auto'
			});
			show(issueRepoName);
		} else if (issueRepoName) {
			// clear styles
			issueRepoName.removeAttribute('style');
			hide(issueRepoName);
		}
	}

	private updateInternalGithubButton(container: HTMLElement): void {
		// eslint-disable-next-line no-restricted-syntax
		const issueReporterElement = this.getElementById('issue-reporter');
		if (!issueReporterElement) {
			return;
		}

		// Dispose of the existing button
		if (this.internalGithubButton) {
			this.internalGithubButton.dispose();
		}

		if (this.data.githubAccessToken && this.data.privateUri) {
			this.internalGithubButton = this._register(new Button(container, unthemedButtonStyles));
			this._register(this.internalGithubButton.onDidClick(() => {
				this.privateAction.run();
			}));

			this.internalGithubButton.element.id = 'internal-create-btn';
			this.internalGithubButton.element.classList.add('internal-create-subtle');
			this.internalGithubButton.label = localize('createInternally', "Create Internally");
			this.internalGithubButton.enabled = true;
			this.internalGithubButton.setTitle(this.data.privateUri.path!.slice(1));
		}
	}

	private updateInternalElementsVisibility(): void {
		// eslint-disable-next-line no-restricted-syntax
		const container = this.getElementById('internal-elements');
		if (!container) {
			// shouldn't happen
			return;
		}

		if (this.data.githubAccessToken && this.data.privateUri) {
			show(container);
			container.style.display = ''; //todo: necessary even with show?
			if (this.internalGithubButton) {
				this.internalGithubButton.enabled = this.publicGithubButton?.enabled ?? false;
			}
		} else {
			hide(container);
			container.style.display = 'none'; //todo: necessary even with hide?
		}
	}

	private async updateIssueReporterUri(extension: IssueReporterExtensionData): Promise<void> {
		try {
			if (extension.uri) {
				const uri = URI.revive(extension.uri);
				extension.bugsUrl = uri.toString();
			}
		} catch (e) {
			this.renderBlocks();
		}
	}

	private handleExtensionData(extensions: IssueReporterExtensionData[]) {
		const installedExtensions = extensions.filter(x => !x.isBuiltin);
		const { nonThemes, themes } = groupBy(installedExtensions, ext => {
			return ext.isTheme ? 'themes' : 'nonThemes';
		});

		const numberOfThemeExtesions = (themes && themes.length) ?? 0;
		this.issueReporterModel.update({ numberOfThemeExtesions, enabledNonThemeExtesions: nonThemes, allExtensions: installedExtensions });
		this.updateExtensionTable(nonThemes ?? [], numberOfThemeExtesions);
		if (this.disableExtensions || installedExtensions.length === 0) {
			// eslint-disable-next-line no-restricted-syntax
			(<HTMLButtonElement>this.getElementById('disableExtensions')).disabled = true;
		}

		this.updateExtensionSelector(installedExtensions);
	}

	private updateExtensionSelector(extensions: IssueReporterExtensionData[]): void {
		interface IOption {
			name: string;
			id: string;
		}

		const extensionOptions: IOption[] = extensions.map(extension => {
			return {
				name: extension.displayName || extension.name || '',
				id: extension.id
			};
		});

		// Sort extensions by name
		extensionOptions.sort((a, b) => {
			const aName = a.name.toLowerCase();
			const bName = b.name.toLowerCase();
			if (aName > bName) {
				return 1;
			}

			if (aName < bName) {
				return -1;
			}

			return 0;
		});

		const makeOption = (extension: IOption, selectedExtension?: IssueReporterExtensionData): HTMLOptionElement => {
			const selected = selectedExtension && extension.id === selectedExtension.id;
			return $<HTMLOptionElement>('option', {
				'value': extension.id,
				'selected': selected || ''
			}, extension.name);
		};

		// eslint-disable-next-line no-restricted-syntax
		const extensionsSelector = this.getElementById<HTMLSelectElement>('extension-selector');
		if (extensionsSelector) {
			const { selectedExtension } = this.issueReporterModel.getData();
			reset(extensionsSelector, this.makeOption('', localize('selectExtension', "Select extension"), true), ...extensionOptions.map(extension => makeOption(extension, selectedExtension)));

			if (!selectedExtension) {
				extensionsSelector.selectedIndex = 0;
			}

			this.addEventListener('extension-selector', 'change', async (e: Event) => {
				this.clearExtensionData();
				const selectedExtensionId = (<HTMLInputElement>e.target).value;
				this.selectedExtension = selectedExtensionId;
				const extensions = this.issueReporterModel.getData().allExtensions;
				const matches = extensions.filter(extension => extension.id === selectedExtensionId);
				if (matches.length) {
					this.issueReporterModel.update({ selectedExtension: matches[0] });
					const selectedExtension = this.issueReporterModel.getData().selectedExtension;
					if (selectedExtension) {
						const iconElement = document.createElement('span');
						iconElement.classList.add(...ThemeIcon.asClassNameArray(Codicon.loading), 'codicon-modifier-spin');
						this.setLoading(iconElement);
						const openReporterData = await this.sendReporterMenu(selectedExtension);
						if (openReporterData) {
							if (this.selectedExtension === selectedExtensionId) {
								this.removeLoading(iconElement, true);
								this.data = openReporterData;
							}
						}
						else {
							if (!this.loadingExtensionData) {
								iconElement.classList.remove(...ThemeIcon.asClassNameArray(Codicon.loading), 'codicon-modifier-spin');
							}
							this.removeLoading(iconElement);
							// if not using command, should have no configuration data in fields we care about and check later.
							this.clearExtensionData();

							// case when previous extension was opened from normal openIssueReporter command
							selectedExtension.data = undefined;
							selectedExtension.uri = undefined;
						}
						if (this.selectedExtension === selectedExtensionId) {
							// repopulates the fields with the new data given the selected extension.
							this.updateExtensionStatus(matches[0]);
							this.openReporter = false;
						}
					} else {
						this.issueReporterModel.update({ selectedExtension: undefined });
						this.clearSearchResults();
						this.clearExtensionData();
						this.validateSelectedExtension();
						this.updateExtensionStatus(matches[0]);
					}
				}

				// Update internal action visibility after explicit selection
				this.updateInternalElementsVisibility();
			});
		}

		this.addEventListener('problem-source', 'change', (_) => {
			this.clearExtensionData();
			this.validateSelectedExtension();
		});
	}

	private async sendReporterMenu(extension: IssueReporterExtensionData): Promise<IssueReporterData | undefined> {
		try {
			const timeoutPromise = new Promise<undefined>((_, reject) =>
				setTimeout(() => reject(new Error('sendReporterMenu timed out')), 10000)
			);
			const data = await Promise.race([
				this.issueFormService.sendReporterMenu(extension.id),
				timeoutPromise
			]);
			return data;
		} catch (e) {
			console.error(e);
			return undefined;
		}
	}

	private updateAcknowledgementState() {
		// eslint-disable-next-line no-restricted-syntax
		const acknowledgementCheckbox = this.getElementById<HTMLInputElement>('includeAcknowledgement');
		if (acknowledgementCheckbox) {
			this.acknowledged = acknowledgementCheckbox.checked;
			this.updateButtonStates();
		}
	}

	public setEventHandlers(): void {
		(['includeSystemInfo', 'includeProcessInfo', 'includeWorkspaceInfo', 'includeExtensions', 'includeExperiments', 'includeExtensionData'] as const).forEach(elementId => {
			this.addEventListener(elementId, 'click', (event: Event) => {
				event.stopPropagation();
				this.issueReporterModel.update({ [elementId]: !this.issueReporterModel.getData()[elementId] });
			});
		});

		this.addEventListener('includeAcknowledgement', 'click', (event: Event) => {
			event.stopPropagation();
			this.updateAcknowledgementState();
		});

		// eslint-disable-next-line no-restricted-syntax
		const showInfoElements = this.window.document.getElementsByClassName('showInfo');
		for (let i = 0; i < showInfoElements.length; i++) {
			const showInfo = showInfoElements.item(i)!;
			(showInfo as HTMLAnchorElement).addEventListener('click', (e: MouseEvent) => {
				e.preventDefault();
				const label = (<HTMLDivElement>e.target);
				if (label) {
					const containingElement = label.parentElement && label.parentElement.parentElement;
					const info = containingElement && containingElement.lastElementChild;
					if (info && info.classList.contains('hidden')) {
						show(info);
						label.textContent = localize('hide', "hide");
					} else {
						hide(info);
						label.textContent = localize('show', "show");
					}
				}
			});
		}

		this.addEventListener('issue-source', 'change', (e: Event) => {
			const value = (<HTMLInputElement>e.target).value;
			// eslint-disable-next-line no-restricted-syntax
			const problemSourceHelpText = this.getElementById('problem-source-help-text')!;
			if (value === '') {
				this.issueReporterModel.update({ fileOnExtension: undefined });
				show(problemSourceHelpText);
				this.clearSearchResults();
				this.render();
				return;
			} else {
				hide(problemSourceHelpText);
			}

			// eslint-disable-next-line no-restricted-syntax
			const descriptionTextArea = <HTMLInputElement>this.getElementById('issue-title');
			if (value === IssueSource.VSCode) {
				descriptionTextArea.placeholder = localize('vscodePlaceholder', "E.g Workbench is missing problems panel");
			} else if (value === IssueSource.Extension) {
				descriptionTextArea.placeholder = localize('extensionPlaceholder', "E.g. Missing alt text on extension readme image");
			} else if (value === IssueSource.Marketplace) {
				descriptionTextArea.placeholder = localize('marketplacePlaceholder', "E.g Cannot disable installed extension");
			} else {
				descriptionTextArea.placeholder = localize('undefinedPlaceholder', "Please enter a title");
			}

			let fileOnExtension, fileOnMarketplace, fileOnProduct = false;
			if (value === IssueSource.Extension) {
				fileOnExtension = true;
			} else if (value === IssueSource.Marketplace) {
				fileOnMarketplace = true;
			} else if (value === IssueSource.VSCode) {
				fileOnProduct = true;
			}

			this.issueReporterModel.update({ fileOnExtension, fileOnMarketplace, fileOnProduct });
			this.render();

			// eslint-disable-next-line no-restricted-syntax
			const title = (<HTMLInputElement>this.getElementById('issue-title')).value;
			this.searchIssues(title, fileOnExtension, fileOnMarketplace);
		});

		this.addEventListener('description', 'input', (e: Event) => {
			const issueDescription = (<HTMLInputElement>e.target).value;
			this.issueReporterModel.update({ issueDescription });

			// Only search for extension issues on title change
			if (this.issueReporterModel.fileOnExtension() === false) {
				// eslint-disable-next-line no-restricted-syntax
				const title = (<HTMLInputElement>this.getElementById('issue-title')).value;
				this.searchVSCodeIssues(title, issueDescription);
			}
		});

		this.addEventListener('issue-title', 'input', _ => {
			// eslint-disable-next-line no-restricted-syntax
			const titleElement = this.getElementById('issue-title') as HTMLInputElement;
			if (titleElement) {
				const title = titleElement.value;
				this.issueReporterModel.update({ issueTitle: title });
			}
		});

		this.addEventListener('issue-title', 'input', (e: Event) => {
			const title = (<HTMLInputElement>e.target).value;
			// eslint-disable-next-line no-restricted-syntax
			const lengthValidationMessage = this.getElementById('issue-title-length-validation-error');
			const issueUrl = this.getIssueUrl();
			if (title && this.getIssueUrlWithTitle(title, issueUrl).length > MAX_URL_LENGTH) {
				show(lengthValidationMessage);
			} else {
				hide(lengthValidationMessage);
			}
			// eslint-disable-next-line no-restricted-syntax
			const issueSource = this.getElementById<HTMLSelectElement>('issue-source');
			if (!issueSource || issueSource.value === '') {
				return;
			}

			const { fileOnExtension, fileOnMarketplace } = this.issueReporterModel.getData();
			this.searchIssues(title, fileOnExtension, fileOnMarketplace);
		});

		// We handle clicks in the dropdown actions now

		this.addEventListener('disableExtensions', 'click', () => {
			this.issueFormService.reloadWithExtensionsDisabled();
		});

		this.addEventListener('extensionBugsLink', 'click', (e: Event) => {
			const url = (<HTMLElement>e.target).innerText;
			this.openLink(url);
		});

		this.addEventListener('disableExtensions', 'keydown', (e: Event) => {
			e.stopPropagation();
			if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
				this.issueFormService.reloadWithExtensionsDisabled();
			}
		});

		this.window.document.onkeydown = async (e: KeyboardEvent) => {
			const cmdOrCtrlKey = isMacintosh ? e.metaKey : e.ctrlKey;
			// Cmd/Ctrl+Enter previews issue and closes window
			if (cmdOrCtrlKey && e.key === 'Enter') {
				this.delayedSubmit.trigger(async () => {
					if (await this.createIssue()) {
						this.close();
					}
				});
			}

			// Cmd/Ctrl + w closes issue window
			if (cmdOrCtrlKey && e.key === 'w') {
				e.stopPropagation();
				e.preventDefault();

				// eslint-disable-next-line no-restricted-syntax
				const issueTitle = (<HTMLInputElement>this.getElementById('issue-title'))!.value;
				const { issueDescription } = this.issueReporterModel.getData();
				if (!this.hasBeenSubmitted && (issueTitle || issueDescription)) {
					// fire and forget
					this.issueFormService.showConfirmCloseDialog();
				} else {
					this.close();
				}
			}

			// With latest electron upgrade, cmd+a is no longer propagating correctly for inputs in this window on mac
			// Manually perform the selection
			if (isMacintosh) {
				if (cmdOrCtrlKey && e.key === 'a' && e.target) {
					if (isHTMLInputElement(e.target) || isHTMLTextAreaElement(e.target)) {
						(<HTMLInputElement>e.target).select();
					}
				}
			}
		};

		// Handle the guidance link specifically to use openerService
		this.addEventListener('review-guidance-help-text', 'click', (e: Event) => {
			const target = e.target as HTMLElement;
			if (target.tagName === 'A' && target.getAttribute('target') === '_blank') {
				this.openLink(<MouseEvent>e);
			}
		});
	}

	public updatePerformanceInfo(info: Partial<IssueReporterData>) {
		this.issueReporterModel.update(info);
		this.receivedPerformanceInfo = true;

		const state = this.issueReporterModel.getData();
		this.updateProcessInfo(state);
		this.updateWorkspaceInfo(state);
		this.updateButtonStates();
	}

	private isPreviewEnabled() {
		const issueType = this.issueReporterModel.getData().issueType;

		if (this.loadingExtensionData) {
			return false;
		}

		if (this.isWeb) {
			if (issueType === IssueType.FeatureRequest || issueType === IssueType.PerformanceIssue || issueType === IssueType.Bug) {
				return true;
			}
		} else {
			if (issueType === IssueType.Bug && this.receivedSystemInfo) {
				return true;
			}

			if (issueType === IssueType.PerformanceIssue && this.receivedSystemInfo && this.receivedPerformanceInfo) {
				return true;
			}

			if (issueType === IssueType.FeatureRequest) {
				return true;
			}
		}

		return false;
	}

	private getExtensionRepositoryUrl(): string | undefined {
		const selectedExtension = this.issueReporterModel.getData().selectedExtension;
		return selectedExtension && selectedExtension.repositoryUrl;
	}

	public getExtensionBugsUrl(): string | undefined {
		const selectedExtension = this.issueReporterModel.getData().selectedExtension;
		return selectedExtension && selectedExtension.bugsUrl;
	}

	public searchVSCodeIssues(title: string, issueDescription?: string): void {
		if (title) {
			this.searchDuplicates(title, issueDescription);
		} else {
			this.clearSearchResults();
		}
	}

	public searchIssues(title: string, fileOnExtension: boolean | undefined, fileOnMarketplace: boolean | undefined): void {
		if (fileOnExtension) {
			return this.searchExtensionIssues(title);
		}

		if (fileOnMarketplace) {
			return this.searchMarketplaceIssues(title);
		}

		const description = this.issueReporterModel.getData().issueDescription;
		this.searchVSCodeIssues(title, description);
	}

	private searchExtensionIssues(title: string): void {
		const url = this.getExtensionGitHubUrl();
		if (title) {
			const matches = /^https?:\/\/github\.com\/(.*)/.exec(url);
			if (matches && matches.length) {
				const repo = matches[1];
				return this.searchGitHub(repo, title);
			}

			// If the extension has no repository, display empty search results
			if (this.issueReporterModel.getData().selectedExtension) {
				this.clearSearchResults();
				return this.displaySearchResults([]);

			}
		}

		this.clearSearchResults();
	}

	private searchMarketplaceIssues(title: string): void {
		if (title) {
			const gitHubInfo = this.parseGitHubUrl(this.product.reportMarketplaceIssueUrl!);
			if (gitHubInfo) {
				return this.searchGitHub(`${gitHubInfo.owner}/${gitHubInfo.repositoryName}`, title);
			}
		}
	}

	public async close(): Promise<void> {
		await this.issueFormService.closeReporter();
	}

	public clearSearchResults(): void {
		// eslint-disable-next-line no-restricted-syntax
		const similarIssues = this.getElementById('similar-issues')!;
		similarIssues.innerText = '';
		this.numberOfSearchResultsDisplayed = 0;
	}

	@debounce(300)
	private searchGitHub(repo: string, title: string): void {
		const query = `is:issue+repo:${repo}+${title}`;
		// eslint-disable-next-line no-restricted-syntax
		const similarIssues = this.getElementById('similar-issues')!;

		fetch(`https://api.github.com/search/issues?q=${query}`).then((response) => {
			response.json().then(result => {
				similarIssues.innerText = '';
				if (result && result.items) {
					this.displaySearchResults(result.items);
				}
			}).catch(_ => {
				console.warn('Timeout or query limit exceeded');
			});
		}).catch(_ => {
			console.warn('Error fetching GitHub issues');
		});
	}

	@debounce(300)
	private searchDuplicates(title: string, body?: string): void {
		const url = 'https://vscode-probot.westus.cloudapp.azure.com:7890/duplicate_candidates';
		const init = {
			method: 'POST',
			body: JSON.stringify({
				title,
				body
			}),
			headers: new Headers({
				'Content-Type': 'application/json'
			})
		};

		fetch(url, init).then((response) => {
			response.json().then(result => {
				this.clearSearchResults();

				if (result && result.candidates) {
					this.displaySearchResults(result.candidates);
				} else {
					throw new Error('Unexpected response, no candidates property');
				}
			}).catch(_ => {
				// Ignore
			});
		}).catch(_ => {
			// Ignore
		});
	}

	private displaySearchResults(results: SearchResult[]) {
		// eslint-disable-next-line no-restricted-syntax
		const similarIssues = this.getElementById('similar-issues')!;
		if (results.length) {
			const issues = $('div.issues-container');
			const issuesText = $('div.list-title');
			issuesText.textContent = localize('similarIssues', "Similar issues");

			this.numberOfSearchResultsDisplayed = results.length < 5 ? results.length : 5;
			for (let i = 0; i < this.numberOfSearchResultsDisplayed; i++) {
				const issue = results[i];
				const link = $('a.issue-link', { href: issue.html_url });
				link.textContent = issue.title;
				link.title = issue.title;
				link.addEventListener('click', (e) => this.openLink(e));
				link.addEventListener('auxclick', (e) => this.openLink(<MouseEvent>e));

				let issueState: HTMLElement;
				let item: HTMLElement;
				if (issue.state) {
					issueState = $('span.issue-state');

					const issueIcon = $('span.issue-icon');
					issueIcon.appendChild(renderIcon(issue.state === 'open' ? Codicon.issueOpened : Codicon.issueClosed));

					const issueStateLabel = $('span.issue-state.label');
					issueStateLabel.textContent = issue.state === 'open' ? localize('open', "Open") : localize('closed', "Closed");

					issueState.title = issue.state === 'open' ? localize('open', "Open") : localize('closed', "Closed");
					issueState.appendChild(issueIcon);
					issueState.appendChild(issueStateLabel);

					item = $('div.issue', undefined, issueState, link);
				} else {
					item = $('div.issue', undefined, link);
				}

				issues.appendChild(item);
			}

			similarIssues.appendChild(issuesText);
			similarIssues.appendChild(issues);
		}
	}

	private setUpTypes(): void {
		const makeOption = (issueType: IssueType, description: string) => $('option', { 'value': issueType.valueOf() }, escape(description));

		// eslint-disable-next-line no-restricted-syntax
		const typeSelect = this.getElementById('issue-type')! as HTMLSelectElement;
		const { issueType } = this.issueReporterModel.getData();
		reset(typeSelect,
			makeOption(IssueType.Bug, localize('bugReporter', "Bug Report")),
			makeOption(IssueType.FeatureRequest, localize('featureRequest', "Feature Request")),
			makeOption(IssueType.PerformanceIssue, localize('performanceIssue', "Performance Issue (freeze, slow, crash)"))
		);

		typeSelect.value = issueType.toString();

		this.setSourceOptions();
	}

	public makeOption(value: string, description: string, disabled: boolean): HTMLOptionElement {
		const option: HTMLOptionElement = document.createElement('option');
		option.disabled = disabled;
		option.value = value;
		option.textContent = description;

		return option;
	}

	public setSourceOptions(): void {
		// eslint-disable-next-line no-restricted-syntax
		const sourceSelect = this.getElementById('issue-source')! as HTMLSelectElement;
		const { issueType, fileOnExtension, selectedExtension, fileOnMarketplace, fileOnProduct } = this.issueReporterModel.getData();
		let selected = sourceSelect.selectedIndex;
		if (selected === -1) {
			if (fileOnExtension !== undefined) {
				selected = fileOnExtension ? 2 : 1;
			} else if (selectedExtension?.isBuiltin) {
				selected = 1;
			} else if (fileOnMarketplace) {
				selected = 3;
			} else if (fileOnProduct) {
				selected = 1;
			}
		}

		sourceSelect.innerText = '';
		sourceSelect.append(this.makeOption('', localize('selectSource', "Select source"), true));
		sourceSelect.append(this.makeOption(IssueSource.VSCode, localize('vscode', "Visual Studio Code"), false));
		sourceSelect.append(this.makeOption(IssueSource.Extension, localize('extension', "A VS Code extension"), false));
		if (this.product.reportMarketplaceIssueUrl) {
			sourceSelect.append(this.makeOption(IssueSource.Marketplace, localize('marketplace', "Extensions Marketplace"), false));
		}

		if (issueType !== IssueType.FeatureRequest) {
			sourceSelect.append(this.makeOption(IssueSource.Unknown, localize('unknown', "Don't know"), false));
		}

		if (selected !== -1 && selected < sourceSelect.options.length) {
			sourceSelect.selectedIndex = selected;
		} else {
			sourceSelect.selectedIndex = 0;
			// eslint-disable-next-line no-restricted-syntax
			hide(this.getElementById('problem-source-help-text'));
		}
	}

	public async renderBlocks(): Promise<void> {
		// Depending on Issue Type, we render different blocks and text
		const { issueType, fileOnExtension, fileOnMarketplace, selectedExtension } = this.issueReporterModel.getData();
		// eslint-disable-next-line no-restricted-syntax
		const blockContainer = this.getElementById('block-container');
		// eslint-disable-next-line no-restricted-syntax
		const systemBlock = this.window.document.querySelector('.block-system');
		// eslint-disable-next-line no-restricted-syntax
		const processBlock = this.window.document.querySelector('.block-process');
		// eslint-disable-next-line no-restricted-syntax
		const workspaceBlock = this.window.document.querySelector('.block-workspace');
		// eslint-disable-next-line no-restricted-syntax
		const extensionsBlock = this.window.document.querySelector('.block-extensions');
		// eslint-disable-next-line no-restricted-syntax
		const experimentsBlock = this.window.document.querySelector('.block-experiments');
		// eslint-disable-next-line no-restricted-syntax
		const extensionDataBlock = this.window.document.querySelector('.block-extension-data');

		// eslint-disable-next-line no-restricted-syntax
		const problemSource = this.getElementById('problem-source')!;
		// eslint-disable-next-line no-restricted-syntax
		const descriptionTitle = this.getElementById('issue-description-label')!;
		// eslint-disable-next-line no-restricted-syntax
		const descriptionSubtitle = this.getElementById('issue-description-subtitle')!;
		// eslint-disable-next-line no-restricted-syntax
		const extensionSelector = this.getElementById('extension-selection')!;
		// eslint-disable-next-line no-restricted-syntax
		const downloadExtensionDataLink = <HTMLAnchorElement>this.getElementById('extension-data-download')!;

		// eslint-disable-next-line no-restricted-syntax
		const titleTextArea = this.getElementById('issue-title-container')!;
		// eslint-disable-next-line no-restricted-syntax
		const descriptionTextArea = this.getElementById('description')!;
		// eslint-disable-next-line no-restricted-syntax
		const extensionDataTextArea = this.getElementById('extension-data')!;

		// Hide all by default
		hide(blockContainer);
		hide(systemBlock);
		hide(processBlock);
		hide(workspaceBlock);
		hide(extensionsBlock);
		hide(experimentsBlock);
		hide(extensionSelector);
		hide(extensionDataTextArea);
		hide(extensionDataBlock);
		hide(downloadExtensionDataLink);

		show(problemSource);
		show(titleTextArea);
		show(descriptionTextArea);

		if (fileOnExtension) {
			show(extensionSelector);
		}

		const extensionData = this.issueReporterModel.getData().extensionData;
		if (extensionData && extensionData.length > MAX_EXTENSION_DATA_LENGTH) {
			show(downloadExtensionDataLink);
			const date = new Date();
			const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
			const formattedTime = date.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
			const fileName = `extensionData_${formattedDate}_${formattedTime}.md`;
			const handleLinkClick = async () => {
				const downloadPath = await this.fileDialogService.showSaveDialog({
					title: localize('saveExtensionData', "Save Extension Data"),
					availableFileSystems: [Schemas.file],
					defaultUri: joinPath(await this.fileDialogService.defaultFilePath(Schemas.file), fileName),
				});

				if (downloadPath) {
					await this.fileService.writeFile(downloadPath, VSBuffer.fromString(extensionData));
				}
			};

			downloadExtensionDataLink.addEventListener('click', handleLinkClick);

			this._register({
				dispose: () => downloadExtensionDataLink.removeEventListener('click', handleLinkClick)
			});
		}

		if (selectedExtension && this.nonGitHubIssueUrl) {
			hide(titleTextArea);
			hide(descriptionTextArea);
			reset(descriptionTitle, localize('handlesIssuesElsewhere', "This extension handles issues outside of VS Code"));
			reset(descriptionSubtitle, localize('elsewhereDescription', "The '{0}' extension prefers to use an external issue reporter. To be taken to that issue reporting experience, click the button below.", selectedExtension.displayName));
			this.publicGithubButton.label = localize('openIssueReporter', "Open External Issue Reporter");
			return;
		}

		if (fileOnExtension && selectedExtension?.data) {
			const data = selectedExtension?.data;
			(extensionDataTextArea as HTMLElement).innerText = data.toString();
			(extensionDataTextArea as HTMLTextAreaElement).readOnly = true;
			show(extensionDataBlock);
		}

		// only if we know comes from the open reporter command
		if (fileOnExtension && this.openReporter) {
			(extensionDataTextArea as HTMLTextAreaElement).readOnly = true;
			setTimeout(() => {
				// delay to make sure from command or not
				if (this.openReporter) {
					show(extensionDataBlock);
				}
			}, 100);
			show(extensionDataBlock);
		}

		if (issueType === IssueType.Bug) {
			if (!fileOnMarketplace) {
				show(blockContainer);
				show(systemBlock);
				show(experimentsBlock);
				if (!fileOnExtension) {
					show(extensionsBlock);
				}
			}

			reset(descriptionTitle, localize('stepsToReproduce', "Steps to Reproduce") + ' ', $('span.required-input', undefined, '*'));
			reset(descriptionSubtitle, localize('bugDescription', "Share the steps needed to reliably reproduce the problem. Please include actual and expected results. We support GitHub-flavored Markdown. You will be able to edit your issue and add screenshots when we preview it on GitHub."));
		} else if (issueType === IssueType.PerformanceIssue) {
			if (!fileOnMarketplace) {
				show(blockContainer);
				show(systemBlock);
				show(processBlock);
				show(workspaceBlock);
				show(experimentsBlock);
			}

			if (fileOnExtension) {
				show(extensionSelector);
			} else if (!fileOnMarketplace) {
				show(extensionsBlock);
			}

			reset(descriptionTitle, localize('stepsToReproduce', "Steps to Reproduce") + ' ', $('span.required-input', undefined, '*'));
			reset(descriptionSubtitle, localize('performanceIssueDesciption', "When did this performance issue happen? Does it occur on startup or after a specific series of actions? We support GitHub-flavored Markdown. You will be able to edit your issue and add screenshots when we preview it on GitHub."));
		} else if (issueType === IssueType.FeatureRequest) {
			reset(descriptionTitle, localize('description', "Description") + ' ', $('span.required-input', undefined, '*'));
			reset(descriptionSubtitle, localize('featureRequestDescription', "Please describe the feature you would like to see. We support GitHub-flavored Markdown. You will be able to edit your issue and add screenshots when we preview it on GitHub."));
		}
	}

	public validateInput(inputId: string): boolean {
		// eslint-disable-next-line no-restricted-syntax
		const inputElement = (<HTMLInputElement>this.getElementById(inputId));
		// eslint-disable-next-line no-restricted-syntax
		const inputValidationMessage = this.getElementById(`${inputId}-empty-error`);
		// eslint-disable-next-line no-restricted-syntax
		const descriptionShortMessage = this.getElementById(`description-short-error`);
		if (inputId === 'description' && this.nonGitHubIssueUrl && this.data.extensionId) {
			return true;
		} else if (!inputElement.value) {
			inputElement.classList.add('invalid-input');
			inputValidationMessage?.classList.remove('hidden');
			descriptionShortMessage?.classList.add('hidden');
			return false;
		} else if (inputId === 'description' && inputElement.value.length < 10) {
			inputElement.classList.add('invalid-input');
			descriptionShortMessage?.classList.remove('hidden');
			inputValidationMessage?.classList.add('hidden');
			return false;
		} else {
			inputElement.classList.remove('invalid-input');
			inputValidationMessage?.classList.add('hidden');
			if (inputId === 'description') {
				descriptionShortMessage?.classList.add('hidden');
			}
			return true;
		}
	}

	public validateInputs(): boolean {
		let isValid = true;
		['issue-title', 'description', 'issue-source'].forEach(elementId => {
			isValid = this.validateInput(elementId) && isValid;
		});

		if (this.issueReporterModel.fileOnExtension()) {
			isValid = this.validateInput('extension-selector') && isValid;
		}

		return isValid;
	}

	public async submitToGitHub(issueTitle: string, issueBody: string, gitHubDetails: { owner: string; repositoryName: string }): Promise<boolean> {
		const url = `https://api.github.com/repos/${gitHubDetails.owner}/${gitHubDetails.repositoryName}/issues`;
		const init = {
			method: 'POST',
			body: JSON.stringify({
				title: issueTitle,
				body: issueBody
			}),
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${this.data.githubAccessToken}`,
				'User-Agent': 'request'
			})
		};

		const response = await fetch(url, init);
		if (!response.ok) {
			console.error('Invalid GitHub URL provided.');
			return false;
		}
		const result = await response.json();
		await this.openLink(result.html_url);
		this.close();
		return true;
	}

	public async createIssue(shouldCreate?: boolean, privateUri?: boolean): Promise<boolean> {
		const selectedExtension = this.issueReporterModel.getData().selectedExtension;
		// Short circuit if the extension provides a custom issue handler
		if (this.nonGitHubIssueUrl) {
			const url = this.getExtensionBugsUrl();
			if (url) {
				this.hasBeenSubmitted = true;
				return true;
			}
		}

		if (!this.validateInputs()) {
			// If inputs are invalid, set focus to the first one and add listeners on them
			// to detect further changes
			// eslint-disable-next-line no-restricted-syntax
			const invalidInput = this.window.document.getElementsByClassName('invalid-input');
			if (invalidInput.length) {
				(<HTMLInputElement>invalidInput[0]).focus();
			}

			this.addEventListener('issue-title', 'input', _ => {
				this.validateInput('issue-title');
			});

			this.addEventListener('description', 'input', _ => {
				this.validateInput('description');
			});

			this.addEventListener('issue-source', 'change', _ => {
				this.validateInput('issue-source');
			});

			if (this.issueReporterModel.fileOnExtension()) {
				this.addEventListener('extension-selector', 'change', _ => {
					this.validateInput('extension-selector');
				});
			}

			return false;
		}

		this.hasBeenSubmitted = true;

		// eslint-disable-next-line no-restricted-syntax
		const issueTitle = (<HTMLInputElement>this.getElementById('issue-title')).value;
		const issueBody = this.issueReporterModel.serialize();

		let issueUrl = privateUri ? this.getPrivateIssueUrl() : this.getIssueUrl();
		if (!issueUrl) {
			console.error(`No ${privateUri ? 'private ' : ''}issue url found`);
			return false;
		}
		if (selectedExtension?.uri) {
			const uri = URI.revive(selectedExtension.uri);
			issueUrl = uri.toString();
		}

		const gitHubDetails = this.parseGitHubUrl(issueUrl);
		if (this.data.githubAccessToken && gitHubDetails && shouldCreate) {
			return this.submitToGitHub(issueTitle, issueBody, gitHubDetails);
		}

		// eslint-disable-next-line no-restricted-syntax
		const baseUrl = this.getIssueUrlWithTitle((<HTMLInputElement>this.getElementById('issue-title')).value, issueUrl);
		let url = baseUrl + `&body=${encodeURIComponent(issueBody)}`;

		url = this.addTemplateToUrl(url, gitHubDetails?.owner, gitHubDetails?.repositoryName);

		if (url.length > MAX_URL_LENGTH) {
			try {
				url = await this.writeToClipboard(baseUrl, issueBody);
				url = this.addTemplateToUrl(url, gitHubDetails?.owner, gitHubDetails?.repositoryName);
			} catch (_) {
				console.error('Writing to clipboard failed');
				return false;
			}
		}

		await this.openLink(url);

		return true;
	}

	public async writeToClipboard(baseUrl: string, issueBody: string): Promise<string> {
		const shouldWrite = await this.issueFormService.showClipboardDialog();
		if (!shouldWrite) {
			throw new CancellationError();
		}

		return baseUrl + `&body=${encodeURIComponent(localize('pasteData', "We have written the needed data into your clipboard because it was too large to send. Please paste."))}`;
	}

	public addTemplateToUrl(baseUrl: string, owner?: string, repositoryName?: string): string {
		const isVscode = this.issueReporterModel.getData().fileOnProduct;
		const isMicrosoft = owner?.toLowerCase() === 'microsoft';
		const needsTemplate = isVscode || (isMicrosoft && (repositoryName === 'vscode' || repositoryName === 'vscode-python'));

		if (needsTemplate) {
			try {
				const url = new URL(baseUrl);
				url.searchParams.set('template', 'bug_report.md');
				return url.toString();
			} catch {
				// fallback if baseUrl is not a valid URL
				return baseUrl + '&template=bug_report.md';
			}
		}
		return baseUrl;
	}

	public getIssueUrl(): string {
		return this.issueReporterModel.fileOnExtension()
			? this.getExtensionGitHubUrl()
			: this.issueReporterModel.getData().fileOnMarketplace
				? this.product.reportMarketplaceIssueUrl!
				: this.product.reportIssueUrl!;
	}

	// for when command 'workbench.action.openIssueReporter' passes along a
	// `privateUri` UriComponents value
	public getPrivateIssueUrl(): string | undefined {
		return URI.revive(this.data.privateUri)?.toString();
	}

	public parseGitHubUrl(url: string): undefined | { repositoryName: string; owner: string } {
		// Assumes a GitHub url to a particular repo, https://github.com/repositoryName/owner.
		// Repository name and owner cannot contain '/'
		const match = /^https?:\/\/github\.com\/([^\/]*)\/([^\/]*).*/.exec(url);
		if (match && match.length) {
			return {
				owner: match[1],
				repositoryName: match[2]
			};
		} else {
			console.error('No GitHub issues match');
		}

		return undefined;
	}

	private getExtensionGitHubUrl(): string {
		let repositoryUrl = '';
		const bugsUrl = this.getExtensionBugsUrl();
		const extensionUrl = this.getExtensionRepositoryUrl();
		// If given, try to match the extension's bug url
		if (bugsUrl && bugsUrl.match(/^https?:\/\/github\.com\/([^\/]*)\/([^\/]*)\/?(\/issues)?$/)) {
			// matches exactly: https://github.com/owner/repo/issues
			repositoryUrl = normalizeGitHubUrl(bugsUrl);
		} else if (extensionUrl && extensionUrl.match(/^https?:\/\/github\.com\/([^\/]*)\/([^\/]*)$/)) {
			// matches exactly: https://github.com/owner/repo
			repositoryUrl = normalizeGitHubUrl(extensionUrl);
		} else {
			this.nonGitHubIssueUrl = true;
			repositoryUrl = bugsUrl || extensionUrl || '';
		}

		return repositoryUrl;
	}

	public getIssueUrlWithTitle(issueTitle: string, repositoryUrl: string): string {
		if (this.issueReporterModel.fileOnExtension()) {
			repositoryUrl = repositoryUrl + '/issues/new';
		}

		const queryStringPrefix = repositoryUrl.indexOf('?') === -1 ? '?' : '&';
		return `${repositoryUrl}${queryStringPrefix}title=${encodeURIComponent(issueTitle)}`;
	}

	public clearExtensionData(): void {
		this.nonGitHubIssueUrl = false;
		this.issueReporterModel.update({ extensionData: undefined });
		this.data.issueBody = this.data.issueBody || '';
		this.data.data = undefined;
		this.data.uri = undefined;
		this.data.privateUri = undefined;
	}

	public async updateExtensionStatus(extension: IssueReporterExtensionData) {
		this.issueReporterModel.update({ selectedExtension: extension });

		// uses this.configuuration.data to ensure that data is coming from `openReporter` command.
		const template = this.data.issueBody;
		if (template) {
			// eslint-disable-next-line no-restricted-syntax
			const descriptionTextArea = this.getElementById('description')!;
			const descriptionText = (descriptionTextArea as HTMLTextAreaElement).value;
			if (descriptionText === '' || !descriptionText.includes(template.toString())) {
				const fullTextArea = descriptionText + (descriptionText === '' ? '' : '\n') + template.toString();
				(descriptionTextArea as HTMLTextAreaElement).value = fullTextArea;
				this.issueReporterModel.update({ issueDescription: fullTextArea });
			}
		}

		const data = this.data.data;
		if (data) {
			this.issueReporterModel.update({ extensionData: data });
			extension.data = data;
			// eslint-disable-next-line no-restricted-syntax
			const extensionDataBlock = this.window.document.querySelector('.block-extension-data')!;
			show(extensionDataBlock);
			this.renderBlocks();
		}

		const uri = this.data.uri;
		if (uri) {
			extension.uri = uri;
			this.updateIssueReporterUri(extension);
		}

		this.validateSelectedExtension();
		// eslint-disable-next-line no-restricted-syntax
		const title = (<HTMLInputElement>this.getElementById('issue-title')).value;
		this.searchExtensionIssues(title);

		this.updateButtonStates();
		this.renderBlocks();
	}

	public validateSelectedExtension(): void {
		// eslint-disable-next-line no-restricted-syntax
		const extensionValidationMessage = this.getElementById('extension-selection-validation-error')!;
		// eslint-disable-next-line no-restricted-syntax
		const extensionValidationNoUrlsMessage = this.getElementById('extension-selection-validation-error-no-url')!;
		hide(extensionValidationMessage);
		hide(extensionValidationNoUrlsMessage);

		const extension = this.issueReporterModel.getData().selectedExtension;
		if (!extension) {
			this.publicGithubButton.enabled = true;
			return;
		}

		if (this.loadingExtensionData) {
			return;
		}

		const hasValidGitHubUrl = this.getExtensionGitHubUrl();
		if (hasValidGitHubUrl) {
			this.publicGithubButton.enabled = true;
		} else {
			this.setExtensionValidationMessage();
			this.publicGithubButton.enabled = false;
		}
	}

	public setLoading(element: HTMLElement) {
		// Show loading
		this.openReporter = true;
		this.loadingExtensionData = true;
		this.updateButtonStates();

		// eslint-disable-next-line no-restricted-syntax
		const extensionDataCaption = this.getElementById('extension-id')!;
		hide(extensionDataCaption);

		// eslint-disable-next-line no-restricted-syntax
		const extensionDataCaption2 = Array.from(this.window.document.querySelectorAll('.ext-parens'));
		extensionDataCaption2.forEach(extensionDataCaption2 => hide(extensionDataCaption2));

		// eslint-disable-next-line no-restricted-syntax
		const showLoading = this.getElementById('ext-loading')!;
		show(showLoading);
		while (showLoading.firstChild) {
			showLoading.firstChild.remove();
		}
		showLoading.append(element);

		this.renderBlocks();
	}

	public removeLoading(element: HTMLElement, fromReporter: boolean = false) {
		this.openReporter = fromReporter;
		this.loadingExtensionData = false;
		this.updateButtonStates();

		// eslint-disable-next-line no-restricted-syntax
		const extensionDataCaption = this.getElementById('extension-id')!;
		show(extensionDataCaption);

		// eslint-disable-next-line no-restricted-syntax
		const extensionDataCaption2 = Array.from(this.window.document.querySelectorAll('.ext-parens'));
		extensionDataCaption2.forEach(extensionDataCaption2 => show(extensionDataCaption2));

		// eslint-disable-next-line no-restricted-syntax
		const hideLoading = this.getElementById('ext-loading')!;
		hide(hideLoading);
		if (hideLoading.firstChild) {
			element.remove();
		}
		this.renderBlocks();
	}

	private setExtensionValidationMessage(): void {
		// eslint-disable-next-line no-restricted-syntax
		const extensionValidationMessage = this.getElementById('extension-selection-validation-error')!;
		// eslint-disable-next-line no-restricted-syntax
		const extensionValidationNoUrlsMessage = this.getElementById('extension-selection-validation-error-no-url')!;
		const bugsUrl = this.getExtensionBugsUrl();
		if (bugsUrl) {
			show(extensionValidationMessage);
			// eslint-disable-next-line no-restricted-syntax
			const link = this.getElementById('extensionBugsLink')!;
			link.textContent = bugsUrl;
			return;
		}

		const extensionUrl = this.getExtensionRepositoryUrl();
		if (extensionUrl) {
			show(extensionValidationMessage);
			// eslint-disable-next-line no-restricted-syntax
			const link = this.getElementById('extensionBugsLink');
			link!.textContent = extensionUrl;
			return;
		}

		show(extensionValidationNoUrlsMessage);
	}

	private updateProcessInfo(state: IssueReporterModelData) {
		// eslint-disable-next-line no-restricted-syntax
		const target = this.window.document.querySelector('.block-process .block-info') as HTMLElement;
		if (target) {
			reset(target, $('code', undefined, state.processInfo ?? ''));
		}
	}

	private updateWorkspaceInfo(state: IssueReporterModelData) {
		// eslint-disable-next-line no-restricted-syntax
		this.window.document.querySelector('.block-workspace .block-info code')!.textContent = '\n' + state.workspaceInfo;
	}

	public updateExtensionTable(extensions: IssueReporterExtensionData[], numThemeExtensions: number): void {
		// eslint-disable-next-line no-restricted-syntax
		const target = this.window.document.querySelector<HTMLElement>('.block-extensions .block-info');
		if (target) {
			if (this.disableExtensions) {
				reset(target, localize('disabledExtensions', "Extensions are disabled"));
				return;
			}

			const themeExclusionStr = numThemeExtensions ? `\n(${numThemeExtensions} theme extensions excluded)` : '';
			extensions = extensions || [];

			if (!extensions.length) {
				target.innerText = 'Extensions: none' + themeExclusionStr;
				return;
			}

			reset(target, this.getExtensionTableHtml(extensions), document.createTextNode(themeExclusionStr));
		}
	}

	private getExtensionTableHtml(extensions: IssueReporterExtensionData[]): HTMLTableElement {
		return $('table', undefined,
			$('tr', undefined,
				$('th', undefined, 'Extension'),
				$('th', undefined, 'Author (truncated)' as string),
				$('th', undefined, 'Version')
			),
			...extensions.map(extension => $('tr', undefined,
				$('td', undefined, extension.name),
				$('td', undefined, extension.publisher?.substr(0, 3) ?? 'N/A'),
				$('td', undefined, extension.version)
			))
		);
	}

	private async openLink(eventOrUrl: MouseEvent | string): Promise<void> {
		if (typeof eventOrUrl === 'string') {
			// Direct URL call
			await this.openerService.open(eventOrUrl, { openExternal: true });
		} else {
			// MouseEvent call
			const event = eventOrUrl;
			event.preventDefault();
			event.stopPropagation();
			// Exclude right click
			if (event.which < 3) {
				await this.openerService.open((<HTMLAnchorElement>event.target).href, { openExternal: true });
			}
		}
	}

	public getElementById<T extends HTMLElement = HTMLElement>(elementId: string): T | undefined {
		// eslint-disable-next-line no-restricted-syntax
		const element = this.window.document.getElementById(elementId) as T | undefined;
		if (element) {
			return element;
		} else {
			return undefined;
		}
	}

	public addEventListener(elementId: string, eventType: string, handler: (event: Event) => void): void {
		// eslint-disable-next-line no-restricted-syntax
		const element = this.getElementById(elementId);
		element?.addEventListener(eventType, handler);
	}
}

// helper functions

export function hide(el: Element | undefined | null) {
	el?.classList.add('hidden');
}
export function show(el: Element | undefined | null) {
	el?.classList.remove('hidden');
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/issue/browser/issue.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/issue/browser/issue.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { Extensions as ConfigurationExtensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions, IWorkbenchContributionsRegistry } from '../../../common/contributions.js';
import { IssueFormService } from './issueFormService.js';
import { BrowserIssueService } from './issueService.js';
import './issueTroubleshoot.js';
import { IIssueFormService, IWorkbenchIssueService } from '../common/issue.js';
import { BaseIssueContribution } from '../common/issue.contribution.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';


class WebIssueContribution extends BaseIssueContribution {
	constructor(@IProductService productService: IProductService, @IConfigurationService configurationService: IConfigurationService) {
		super(productService, configurationService);
		Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).registerConfiguration({
			properties: {
				'issueReporter.experimental.webReporter': {
					type: 'boolean',
					default: productService.quality !== 'stable',
					description: 'Enable experimental issue reporter for web.',
				},
			}
		});
	}
}

Registry.as<IWorkbenchContributionsRegistry>(Extensions.Workbench).registerWorkbenchContribution(WebIssueContribution, LifecyclePhase.Restored);

registerSingleton(IWorkbenchIssueService, BrowserIssueService, InstantiationType.Delayed);
registerSingleton(IIssueFormService, IssueFormService, InstantiationType.Delayed);

CommandsRegistry.registerCommand('_issues.getSystemStatus', (accessor) => {
	return nls.localize('statusUnsupported', "The --status argument is not yet supported in browsers.");
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/issue/browser/issueFormService.ts]---
Location: vscode-main/src/vs/workbench/contrib/issue/browser/issueFormService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { safeSetInnerHtml } from '../../../../base/browser/domSanitize.js';
import { createStyleSheet } from '../../../../base/browser/domStylesheets.js';
import { getMenuWidgetCSS, Menu, unthemedMenuStyles } from '../../../../base/browser/ui/menu/menu.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { isLinux, isWindows } from '../../../../base/common/platform.js';
import Severity from '../../../../base/common/severity.js';
import { localize } from '../../../../nls.js';
import { IMenuService, MenuId } from '../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { ExtensionIdentifier, ExtensionIdentifierSet } from '../../../../platform/extensions/common/extensions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import product from '../../../../platform/product/common/product.js';
import { IRectangle } from '../../../../platform/window/common/window.js';
import { AuxiliaryWindowMode, IAuxiliaryWindowService } from '../../../services/auxiliaryWindow/browser/auxiliaryWindowService.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IIssueFormService, IssueReporterData } from '../common/issue.js';
import BaseHtml from './issueReporterPage.js';
import { IssueWebReporter } from './issueReporterService.js';
import './media/issueReporter.css';

export interface IssuePassData {
	issueTitle: string;
	issueBody: string;
}

export class IssueFormService implements IIssueFormService {

	readonly _serviceBrand: undefined;

	protected currentData: IssueReporterData | undefined;

	protected issueReporterWindow: Window | null = null;
	protected extensionIdentifierSet: ExtensionIdentifierSet = new ExtensionIdentifierSet();

	protected arch: string = '';
	protected release: string = '';
	protected type: string = '';

	constructor(
		@IInstantiationService protected readonly instantiationService: IInstantiationService,
		@IAuxiliaryWindowService protected readonly auxiliaryWindowService: IAuxiliaryWindowService,
		@IMenuService protected readonly menuService: IMenuService,
		@IContextKeyService protected readonly contextKeyService: IContextKeyService,
		@ILogService protected readonly logService: ILogService,
		@IDialogService protected readonly dialogService: IDialogService,
		@IHostService protected readonly hostService: IHostService
	) { }

	async openReporter(data: IssueReporterData): Promise<void> {
		if (this.hasToReload(data)) {
			return;
		}

		await this.openAuxIssueReporter(data);

		if (this.issueReporterWindow) {
			const issueReporter = this.instantiationService.createInstance(IssueWebReporter, false, data, { type: this.type, arch: this.arch, release: this.release }, product, this.issueReporterWindow);
			issueReporter.render();
		}
	}

	async openAuxIssueReporter(data: IssueReporterData, bounds?: IRectangle): Promise<void> {

		let issueReporterBounds: Partial<IRectangle> = { width: 700, height: 800 };

		// Center Issue Reporter Window based on bounds from native host service
		if (bounds && bounds.x && bounds.y) {
			const centerX = bounds.x + bounds.width / 2;
			const centerY = bounds.y + bounds.height / 2;
			issueReporterBounds = { ...issueReporterBounds, x: centerX - 350, y: centerY - 400 };
		}

		const disposables = new DisposableStore();

		// Auxiliary Window
		const auxiliaryWindow = disposables.add(await this.auxiliaryWindowService.open({ mode: AuxiliaryWindowMode.Normal, bounds: issueReporterBounds, nativeTitlebar: true, disableFullscreen: true }));

		const platformClass = isWindows ? 'windows' : isLinux ? 'linux' : 'mac';

		if (auxiliaryWindow) {
			await auxiliaryWindow.whenStylesHaveLoaded;
			auxiliaryWindow.window.document.title = 'Issue Reporter';
			auxiliaryWindow.window.document.body.classList.add('issue-reporter-body', 'monaco-workbench', platformClass);

			// removes preset monaco-workbench container
			auxiliaryWindow.container.remove();

			// The Menu class uses a static globalStyleSheet that's created lazily on first menu creation.
			// Since auxiliary windows clone stylesheets from main window, but Menu.globalStyleSheet
			// may not exist yet in main window, we need to ensure menu styles are available here.
			if (!Menu.globalStyleSheet) {
				const menuStyleSheet = createStyleSheet(auxiliaryWindow.window.document.head);
				menuStyleSheet.textContent = getMenuWidgetCSS(unthemedMenuStyles, false);
			}

			// custom issue reporter wrapper that preserves critical auxiliary window container styles
			const div = document.createElement('div');
			div.classList.add('monaco-workbench');
			auxiliaryWindow.window.document.body.appendChild(div);
			safeSetInnerHtml(div, BaseHtml(), {
				// Also allow input elements
				allowedTags: {
					augment: [
						'input',
						'select',
						'checkbox',
						'textarea',
					]
				},
				allowedAttributes: {
					augment: [
						'id',
						'class',
						'style',
						'textarea',
					]
				}
			});

			this.issueReporterWindow = auxiliaryWindow.window;
		} else {
			console.error('Failed to open auxiliary window');
			disposables.dispose();
		}

		// handle closing issue reporter
		this.issueReporterWindow?.addEventListener('beforeunload', () => {
			auxiliaryWindow.window.close();
			disposables.dispose();
			this.issueReporterWindow = null;
		});
	}

	async sendReporterMenu(extensionId: string): Promise<IssueReporterData | undefined> {
		const menu = this.menuService.createMenu(MenuId.IssueReporter, this.contextKeyService);

		// render menu and dispose
		const actions = menu.getActions({ renderShortTitle: true }).flatMap(entry => entry[1]);
		for (const action of actions) {
			try {
				if (action.item && 'source' in action.item && action.item.source?.id.toLowerCase() === extensionId.toLowerCase()) {
					this.extensionIdentifierSet.add(extensionId.toLowerCase());
					await action.run();
				}
			} catch (error) {
				console.error(error);
			}
		}

		if (!this.extensionIdentifierSet.has(extensionId)) {
			// send undefined to indicate no action was taken
			return undefined;
		}

		// we found the extension, now we clean up the menu and remove it from the set. This is to ensure that we do duplicate extension identifiers
		this.extensionIdentifierSet.delete(new ExtensionIdentifier(extensionId));
		menu.dispose();

		const result = this.currentData;

		// reset current data.
		this.currentData = undefined;

		return result ?? undefined;
	}

	//#region used by issue reporter

	async closeReporter(): Promise<void> {
		this.issueReporterWindow?.close();
	}

	async reloadWithExtensionsDisabled(): Promise<void> {
		if (this.issueReporterWindow) {
			try {
				await this.hostService.reload({ disableExtensions: true });
			} catch (error) {
				this.logService.error(error);
			}
		}
	}

	async showConfirmCloseDialog(): Promise<void> {
		await this.dialogService.prompt({
			type: Severity.Warning,
			message: localize('confirmCloseIssueReporter', "Your input will not be saved. Are you sure you want to close this window?"),
			buttons: [
				{
					label: localize({ key: 'yes', comment: ['&& denotes a mnemonic'] }, "&&Yes"),
					run: () => {
						this.closeReporter();
						this.issueReporterWindow = null;
					}
				},
				{
					label: localize('cancel', "Cancel"),
					run: () => { }
				}
			]
		});
	}

	async showClipboardDialog(): Promise<boolean> {
		let result = false;

		await this.dialogService.prompt({
			type: Severity.Warning,
			message: localize('issueReporterWriteToClipboard', "There is too much data to send to GitHub directly. The data will be copied to the clipboard, please paste it into the GitHub issue page that is opened."),
			buttons: [
				{
					label: localize({ key: 'ok', comment: ['&& denotes a mnemonic'] }, "&&OK"),
					run: () => { result = true; }
				},
				{
					label: localize('cancel', "Cancel"),
					run: () => { result = false; }
				}
			]
		});

		return result;
	}

	hasToReload(data: IssueReporterData): boolean {
		if (data.extensionId && this.extensionIdentifierSet.has(data.extensionId)) {
			this.currentData = data;
			this.issueReporterWindow?.focus();
			return true;
		}

		if (this.issueReporterWindow) {
			this.issueReporterWindow.focus();
			return true;
		}

		return false;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/issue/browser/issueQuickAccess.ts]---
Location: vscode-main/src/vs/workbench/contrib/issue/browser/issueQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { PickerQuickAccessProvider, IPickerQuickAccessItem, FastAndSlowPicks, Picks, TriggerAction } from '../../../../platform/quickinput/browser/pickerQuickAccess.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IMenuService, MenuId, MenuItemAction, SubmenuItemAction } from '../../../../platform/actions/common/actions.js';
import { matchesFuzzy } from '../../../../base/common/filters.js';
import { IQuickPickSeparator } from '../../../../platform/quickinput/common/quickInput.js';
import { localize } from '../../../../nls.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { IssueSource } from '../common/issue.js';
import { IProductService } from '../../../../platform/product/common/productService.js';

export class IssueQuickAccess extends PickerQuickAccessProvider<IPickerQuickAccessItem> {

	static PREFIX = 'issue ';

	constructor(
		@IMenuService private readonly menuService: IMenuService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@ICommandService private readonly commandService: ICommandService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IProductService private readonly productService: IProductService
	) {
		super(IssueQuickAccess.PREFIX, { canAcceptInBackground: true });
	}

	protected override _getPicks(filter: string): Picks<IPickerQuickAccessItem> | FastAndSlowPicks<IPickerQuickAccessItem> | Promise<Picks<IPickerQuickAccessItem> | FastAndSlowPicks<IPickerQuickAccessItem>> | null {
		const issuePicksConst = new Array<IPickerQuickAccessItem | IQuickPickSeparator>();
		const issuePicksParts = new Array<IPickerQuickAccessItem | IQuickPickSeparator>();
		const extensionIdSet = new Set<string>();

		// Add default items
		const productLabel = this.productService.nameLong;
		const marketPlaceLabel = localize("reportExtensionMarketplace", "Extension Marketplace");
		const productFilter = matchesFuzzy(filter, productLabel, true);
		const marketPlaceFilter = matchesFuzzy(filter, marketPlaceLabel, true);

		// Add product pick if product filter matches
		if (productFilter) {
			issuePicksConst.push({
				label: productLabel,
				ariaLabel: productLabel,
				highlights: { label: productFilter },
				accept: () => this.commandService.executeCommand('workbench.action.openIssueReporter', { issueSource: IssueSource.VSCode })
			});
		}

		// Add marketplace pick if marketplace filter matches
		if (marketPlaceFilter) {
			issuePicksConst.push({
				label: marketPlaceLabel,
				ariaLabel: marketPlaceLabel,
				highlights: { label: marketPlaceFilter },
				accept: () => this.commandService.executeCommand('workbench.action.openIssueReporter', { issueSource: IssueSource.Marketplace })
			});
		}

		issuePicksConst.push({ type: 'separator', label: localize('extensions', "Extensions") });


		// gets menu actions from contributed
		const actions = this.menuService.getMenuActions(MenuId.IssueReporter, this.contextKeyService, { renderShortTitle: true }).flatMap(entry => entry[1]);

		// create picks from contributed menu
		actions.forEach(action => {
			if ('source' in action.item && action.item.source) {
				extensionIdSet.add(action.item.source.id);
			}

			const pick = this._createPick(filter, action);
			if (pick) {
				issuePicksParts.push(pick);
			}
		});


		// create picks from extensions
		this.extensionService.extensions.forEach(extension => {
			if (!extension.isBuiltin) {
				const pick = this._createPick(filter, undefined, extension);
				const id = extension.identifier.value;
				if (pick && !extensionIdSet.has(id)) {
					issuePicksParts.push(pick);
				}
				extensionIdSet.add(id);
			}
		});

		issuePicksParts.sort((a, b) => {
			const aLabel = a.label ?? '';
			const bLabel = b.label ?? '';
			return aLabel.localeCompare(bLabel);
		});

		return [...issuePicksConst, ...issuePicksParts];
	}

	private _createPick(filter: string, action?: MenuItemAction | SubmenuItemAction | undefined, extension?: IExtensionDescription): IPickerQuickAccessItem | undefined {
		const buttons = [{
			iconClass: ThemeIcon.asClassName(Codicon.info),
			tooltip: localize('contributedIssuePage', "Open Extension Page")
		}];

		let label: string;
		let trigger: () => TriggerAction;
		let accept: () => void;
		if (action && 'source' in action.item && action.item.source) {
			label = action.item.source?.title;
			trigger = () => {
				if ('source' in action.item && action.item.source) {
					this.commandService.executeCommand('extension.open', action.item.source.id);
				}
				return TriggerAction.CLOSE_PICKER;
			};
			accept = () => {
				action.run();
			};

		} else if (extension) {
			label = extension.displayName ?? extension.name;
			trigger = () => {
				this.commandService.executeCommand('extension.open', extension.identifier.value);
				return TriggerAction.CLOSE_PICKER;
			};
			accept = () => {
				this.commandService.executeCommand('workbench.action.openIssueReporter', extension.identifier.value);
			};

		} else {
			return undefined;
		}

		const highlights = matchesFuzzy(filter, label, true);
		if (highlights) {
			return {
				label,
				highlights: { label: highlights },
				buttons,
				trigger,
				accept
			};
		}
		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/issue/browser/issueReporterModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/issue/browser/issueReporterModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { mainWindow } from '../../../../base/browser/window.js';
import { isRemoteDiagnosticError, SystemInfo } from '../../../../platform/diagnostics/common/diagnostics.js';
import { ISettingSearchResult, IssueReporterExtensionData, IssueType } from '../common/issue.js';

interface VersionInfo {
	vscodeVersion: string;
	os: string;
}

export interface IssueReporterData {
	issueType: IssueType;
	issueDescription?: string;
	issueTitle?: string;
	extensionData?: string;

	versionInfo?: VersionInfo;
	systemInfo?: SystemInfo;
	systemInfoWeb?: string;
	processInfo?: string;
	workspaceInfo?: string;

	includeSystemInfo: boolean;
	includeWorkspaceInfo: boolean;
	includeProcessInfo: boolean;
	includeExtensions: boolean;
	includeExperiments: boolean;
	includeExtensionData: boolean;

	numberOfThemeExtesions?: number;
	allExtensions: IssueReporterExtensionData[];
	enabledNonThemeExtesions?: IssueReporterExtensionData[];
	extensionsDisabled?: boolean;
	fileOnExtension?: boolean;
	fileOnMarketplace?: boolean;
	fileOnProduct?: boolean;
	selectedExtension?: IssueReporterExtensionData;
	actualSearchResults?: ISettingSearchResult[];
	query?: string;
	filterResultCount?: number;
	experimentInfo?: string;
	restrictedMode?: boolean;
	isUnsupported?: boolean;
}

export class IssueReporterModel {
	private readonly _data: IssueReporterData;

	constructor(initialData?: Partial<IssueReporterData>) {
		const defaultData = {
			issueType: IssueType.Bug,
			includeSystemInfo: true,
			includeWorkspaceInfo: true,
			includeProcessInfo: true,
			includeExtensions: true,
			includeExperiments: true,
			includeExtensionData: true,
			allExtensions: []
		};

		this._data = initialData ? Object.assign(defaultData, initialData) : defaultData;

		mainWindow.addEventListener('message', async (event) => {
			if (event.data && event.data.sendChannel === 'vscode:triggerIssueData') {
				mainWindow.postMessage({
					data: { issueBody: this._data.issueDescription, issueTitle: this._data.issueTitle },
					replyChannel: 'vscode:triggerIssueDataResponse'
				}, '*');
			}
		});
	}

	getData(): IssueReporterData {
		return this._data;
	}

	update(newData: Partial<IssueReporterData>): void {
		Object.assign(this._data, newData);
	}

	serialize(): string {
		const modes = [];
		if (this._data.restrictedMode) {
			modes.push('Restricted');
		}
		if (this._data.isUnsupported) {
			modes.push('Unsupported');
		}
		return `
Type: <b>${this.getIssueTypeTitle()}</b>

${this._data.issueDescription}
${this.getExtensionVersion()}
VS Code version: ${this._data.versionInfo && this._data.versionInfo.vscodeVersion}
OS version: ${this._data.versionInfo && this._data.versionInfo.os}
Modes:${modes.length ? ' ' + modes.join(', ') : ''}
${this.getRemoteOSes()}
${this.getInfos()}
<!-- generated by issue reporter -->`;
	}

	private getRemoteOSes(): string {
		if (this._data.systemInfo && this._data.systemInfo.remoteData.length) {
			return this._data.systemInfo.remoteData
				.map(remote => isRemoteDiagnosticError(remote) ? remote.errorMessage : `Remote OS version: ${remote.machineInfo.os}`).join('\n') + '\n';
		}

		return '';
	}

	fileOnExtension(): boolean | undefined {
		const fileOnExtensionSupported = this._data.issueType === IssueType.Bug
			|| this._data.issueType === IssueType.PerformanceIssue
			|| this._data.issueType === IssueType.FeatureRequest;

		return fileOnExtensionSupported && this._data.fileOnExtension;
	}

	private getExtensionVersion(): string {
		if (this.fileOnExtension() && this._data.selectedExtension) {
			return `\nExtension version: ${this._data.selectedExtension.version}`;
		} else {
			return '';
		}
	}

	private getIssueTypeTitle(): string {
		if (this._data.issueType === IssueType.Bug) {
			return 'Bug';
		} else if (this._data.issueType === IssueType.PerformanceIssue) {
			return 'Performance Issue';
		} else {
			return 'Feature Request';
		}
	}

	private getInfos(): string {
		let info = '';

		if (this._data.fileOnMarketplace) {
			return info;
		}

		const isBugOrPerformanceIssue = this._data.issueType === IssueType.Bug || this._data.issueType === IssueType.PerformanceIssue;

		if (isBugOrPerformanceIssue) {
			if (this._data.includeExtensionData && this._data.extensionData) {
				info += this.getExtensionData();
			}

			if (this._data.includeSystemInfo && this._data.systemInfo) {
				info += this.generateSystemInfoMd();
			}

			if (this._data.includeSystemInfo && this._data.systemInfoWeb) {
				info += 'System Info: ' + this._data.systemInfoWeb;
			}
		}

		if (this._data.issueType === IssueType.PerformanceIssue) {
			if (this._data.includeProcessInfo) {
				info += this.generateProcessInfoMd();
			}

			if (this._data.includeWorkspaceInfo) {
				info += this.generateWorkspaceInfoMd();
			}
		}

		if (isBugOrPerformanceIssue) {
			if (!this._data.fileOnExtension && this._data.includeExtensions) {
				info += this.generateExtensionsMd();
			}

			if (this._data.includeExperiments && this._data.experimentInfo) {
				info += this.generateExperimentsInfoMd();
			}
		}

		return info;
	}

	private getExtensionData(): string {
		return this._data.extensionData ?? '';
	}

	private generateSystemInfoMd(): string {
		let md = `<details>
<summary>System Info</summary>

|Item|Value|
|---|---|
`;

		if (this._data.systemInfo) {

			md += `|CPUs|${this._data.systemInfo.cpus}|
|GPU Status|${Object.keys(this._data.systemInfo.gpuStatus).map(key => `${key}: ${this._data.systemInfo!.gpuStatus[key]}`).join('<br>')}|
|Load (avg)|${this._data.systemInfo.load}|
|Memory (System)|${this._data.systemInfo.memory}|
|Process Argv|${this._data.systemInfo.processArgs.replace(/\\/g, '\\\\')}|
|Screen Reader|${this._data.systemInfo.screenReader}|
|VM|${this._data.systemInfo.vmHint}|`;

			if (this._data.systemInfo.linuxEnv) {
				md += `\n|DESKTOP_SESSION|${this._data.systemInfo.linuxEnv.desktopSession}|
|XDG_CURRENT_DESKTOP|${this._data.systemInfo.linuxEnv.xdgCurrentDesktop}|
|XDG_SESSION_DESKTOP|${this._data.systemInfo.linuxEnv.xdgSessionDesktop}|
|XDG_SESSION_TYPE|${this._data.systemInfo.linuxEnv.xdgSessionType}|`;
			}

			this._data.systemInfo.remoteData.forEach(remote => {
				if (isRemoteDiagnosticError(remote)) {
					md += `\n\n${remote.errorMessage}`;
				} else {
					md += `

|Item|Value|
|---|---|
|Remote|${remote.latency ? `${remote.hostName} (latency: ${remote.latency.current.toFixed(2)}ms last, ${remote.latency.average.toFixed(2)}ms average)` : remote.hostName}|
|OS|${remote.machineInfo.os}|
|CPUs|${remote.machineInfo.cpus}|
|Memory (System)|${remote.machineInfo.memory}|
|VM|${remote.machineInfo.vmHint}|`;
				}
			});
		}

		md += '\n</details>';

		return md;
	}

	private generateProcessInfoMd(): string {
		return `<details>
<summary>Process Info</summary>

\`\`\`
${this._data.processInfo}
\`\`\`

</details>
`;
	}

	private generateWorkspaceInfoMd(): string {
		return `<details>
<summary>Workspace Info</summary>

\`\`\`
${this._data.workspaceInfo};
\`\`\`

</details>
`;
	}

	private generateExperimentsInfoMd(): string {
		return `<details>
<summary>A/B Experiments</summary>

\`\`\`
${this._data.experimentInfo}
\`\`\`

</details>
`;
	}

	private generateExtensionsMd(): string {
		if (this._data.extensionsDisabled) {
			return 'Extensions disabled';
		}

		const themeExclusionStr = this._data.numberOfThemeExtesions ? `\n(${this._data.numberOfThemeExtesions} theme extensions excluded)` : '';

		if (!this._data.enabledNonThemeExtesions) {
			return 'Extensions: none' + themeExclusionStr;
		}

		const tableHeader = `Extension|Author (truncated)|Version
---|---|---`;
		const table = this._data.enabledNonThemeExtesions.map(e => {
			return `${e.name}|${e.publisher?.substr(0, 3) ?? 'N/A'}|${e.version}`;
		}).join('\n');

		return `<details><summary>Extensions (${this._data.enabledNonThemeExtesions.length})</summary>

${tableHeader}
${table}
${themeExclusionStr}

</details>`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/issue/browser/issueReporterPage.ts]---
Location: vscode-main/src/vs/workbench/contrib/issue/browser/issueReporterPage.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { escape } from '../../../../base/common/strings.js';
import { localize } from '../../../../nls.js';

const sendSystemInfoLabel = escape(localize('sendSystemInfo', "Include my system information"));
const sendProcessInfoLabel = escape(localize('sendProcessInfo', "Include my currently running processes"));
const sendWorkspaceInfoLabel = escape(localize('sendWorkspaceInfo', "Include my workspace metadata"));
const sendExtensionsLabel = escape(localize('sendExtensions', "Include my enabled extensions"));
const sendExperimentsLabel = escape(localize('sendExperiments', "Include A/B experiment info"));
const sendExtensionData = escape(localize('sendExtensionData', "Include additional extension info"));
const acknowledgementsLabel = escape(localize('acknowledgements', "I acknowledge that my VS Code version is not updated and this issue may be closed."));
const reviewGuidanceLabel = localize( // intentionally not escaped because of its embedded tags
	{
		key: 'reviewGuidanceLabel',
		comment: [
			'{Locked="<a href=\"https://github.com/microsoft/vscode/wiki/Submitting-Bugs-and-Suggestions\" target=\"_blank\">"}',
			'{Locked="</a>"}'
		]
	},
	'Before you report an issue here please <a href="https://github.com/microsoft/vscode/wiki/Submitting-Bugs-and-Suggestions" target="_blank">review the guidance we provide</a>. Please complete the form in English.'
);

export default (): string => `
<div id="update-banner" class="issue-reporter-update-banner hidden">
	<span class="update-banner-text" id="update-banner-text">
		<!-- To be dynamically filled -->
	</span>
</div>
<div class="issue-reporter" id="issue-reporter">
	<div id="english" class="input-group hidden">${escape(localize('completeInEnglish', "Please complete the form in English."))}</div>

	<div id="review-guidance-help-text" class="input-group">${reviewGuidanceLabel}</div>

	<div class="section">
		<div class="input-group">
			<label class="inline-label" for="issue-type">${escape(localize('issueTypeLabel', "This is a"))}</label>
			<select id="issue-type" class="inline-form-control">
				<!-- To be dynamically filled -->
			</select>
		</div>

		<div class="input-group" id="problem-source">
			<label class="inline-label" for="issue-source">${escape(localize('issueSourceLabel', "For"))} <span class="required-input">*</span></label>
			<select id="issue-source" class="inline-form-control" required>
				<!-- To be dynamically filled -->
			</select>
			<div id="issue-source-empty-error" class="validation-error hidden" role="alert">${escape(localize('issueSourceEmptyValidation', "An issue source is required."))}</div>
			<div id="problem-source-help-text" class="instructions hidden">${escape(localize('disableExtensionsLabelText', "Try to reproduce the problem after {0}. If the problem only reproduces when extensions are active, it is likely an issue with an extension."))
		.replace('{0}', () => `<span tabIndex=0 role="button" id="disableExtensions" class="workbenchCommand">${escape(localize('disableExtensions', "disabling all extensions and reloading the window"))}</span>`)}
			</div>

			<div id="extension-selection">
				<label class="inline-label" for="extension-selector">${escape(localize('chooseExtension', "Extension"))} <span class="required-input">*</span></label>
				<select id="extension-selector" class="inline-form-control">
					<!-- To be dynamically filled -->
				</select>
				<div id="extension-selection-validation-error" class="validation-error hidden" role="alert">${escape(localize('extensionWithNonstandardBugsUrl', "The issue reporter is unable to create issues for this extension. Please visit {0} to report an issue."))
		.replace('{0}', () => `<span tabIndex=0 role="button" id="extensionBugsLink" class="workbenchCommand"><!-- To be dynamically filled --></span>`)}</div>
				<div id="extension-selection-validation-error-no-url" class="validation-error hidden" role="alert">
					${escape(localize('extensionWithNoBugsUrl', "The issue reporter is unable to create issues for this extension, as it does not specify a URL for reporting issues. Please check the marketplace page of this extension to see if other instructions are available."))}
				</div>
			</div>
		</div>

		<div id="issue-title-container" class="input-group">
			<label class="inline-label" for="issue-title">${escape(localize('issueTitleLabel', "Title"))} <span class="required-input">*</span></label>
			<input id="issue-title" type="text" class="inline-form-control" placeholder="${escape(localize('issueTitleRequired', "Please enter a title."))}" required>
			<div id="issue-title-empty-error" class="validation-error hidden" role="alert">${escape(localize('titleEmptyValidation', "A title is required."))}</div>
			<div id="issue-title-length-validation-error" class="validation-error hidden" role="alert">${escape(localize('titleLengthValidation', "The title is too long."))}</div>
			<small id="similar-issues">
				<!-- To be dynamically filled -->
			</small>
		</div>

	</div>

	<div class="input-group description-section">
		<label for="description" id="issue-description-label">
			<!-- To be dynamically filled -->
		</label>
		<div class="instructions" id="issue-description-subtitle">
			<!-- To be dynamically filled -->
		</div>
		<div class="block-info-text">
			<textarea name="description" id="description" placeholder="${escape(localize('details', "Please enter details."))}" required></textarea>
		</div>
		<div id="description-empty-error" class="validation-error hidden" role="alert">${escape(localize('descriptionEmptyValidation', "A description is required."))}</div>
		<div id="description-short-error" class="validation-error hidden" role="alert">${escape(localize('descriptionTooShortValidation', "Please provide a longer description."))}</div>
	</div>

	<div class="system-info" id="block-container">
		<div class="block block-extension-data">
			<input class="send-extension-data" aria-label="${sendExtensionData}" type="checkbox" id="includeExtensionData" checked/>
			<label class="extension-caption" id="extension-caption" for="includeExtensionData">
				${sendExtensionData}
				<span id="ext-loading" hidden></span>
				<span class="ext-parens" hidden>(</span><a href="#" class="showInfo" id="extension-id">${escape(localize('show', "show"))}</a><span class="ext-parens" hidden>)</span>
				<a id="extension-data-download">${escape(localize('downloadExtensionData', "Download Extension Data"))}</a>
			</label>
			<pre class="block-info" id="extension-data" placeholder="${escape(localize('extensionData', "Extension does not have additional data to include."))}" style="white-space: pre-wrap; user-select: text;">
				<!-- To be dynamically filled -->
			</pre>
		</div>

		<div class="block block-system">
			<input class="sendData" aria-label="${sendSystemInfoLabel}" type="checkbox" id="includeSystemInfo" checked/>
			<label class="caption" for="includeSystemInfo">
				${sendSystemInfoLabel}
				(<a href="#" class="showInfo">${escape(localize('show', "show"))}</a>)
			</label>
			<div class="block-info hidden" style="user-select: text;">
				<!-- To be dynamically filled -->
		</div>
		</div>
		<div class="block block-process">
			<input class="sendData" aria-label="${sendProcessInfoLabel}" type="checkbox" id="includeProcessInfo" checked/>
			<label class="caption" for="includeProcessInfo">
				${sendProcessInfoLabel}
				(<a href="#" class="showInfo">${escape(localize('show', "show"))}</a>)
			</label>
			<pre class="block-info hidden" style="user-select: text;">
				<code>
				<!-- To be dynamically filled -->
				</code>
			</pre>
		</div>
		<div class="block block-workspace">
			<input class="sendData" aria-label="${sendWorkspaceInfoLabel}" type="checkbox" id="includeWorkspaceInfo" checked/>
			<label class="caption" for="includeWorkspaceInfo">
				${sendWorkspaceInfoLabel}
				(<a href="#" class="showInfo">${escape(localize('show', "show"))}</a>)
			</label>
			<pre id="systemInfo" class="block-info hidden" style="user-select: text;">
				<code>
				<!-- To be dynamically filled -->
				</code>
			</pre>
		</div>
		<div class="block block-extensions">
			<input class="sendData" aria-label="${sendExtensionsLabel}" type="checkbox" id="includeExtensions" checked/>
			<label class="caption" for="includeExtensions">
				${sendExtensionsLabel}
				(<a href="#" class="showInfo">${escape(localize('show', "show"))}</a>)
			</label>
			<div id="systemInfo" class="block-info hidden" style="user-select: text;">
				<!-- To be dynamically filled -->
			</div>
		</div>
		<div class="block block-experiments">
			<input class="sendData" aria-label="${sendExperimentsLabel}" type="checkbox" id="includeExperiments" checked/>
			<label class="caption" for="includeExperiments">
				${sendExperimentsLabel}
				(<a href="#" class="showInfo">${escape(localize('show', "show"))}</a>)
			</label>
			<pre class="block-info hidden" style="user-select: text;">
				<!-- To be dynamically filled -->
			</pre>
		</div>
		<div class="block block-acknowledgements hidden" id="version-acknowledgements">
			<input class="sendData" aria-label="${acknowledgementsLabel}" type="checkbox" id="includeAcknowledgement"/>
			<label class="caption" for="includeAcknowledgement">
				${acknowledgementsLabel}
			</label>
		</div>
	</div>

</div>`;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/issue/browser/issueReporterService.ts]---
Location: vscode-main/src/vs/workbench/contrib/issue/browser/issueReporterService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IProductConfiguration } from '../../../../base/common/product.js';
import { localize } from '../../../../nls.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IAuthenticationService } from '../../../services/authentication/common/authentication.js';
import { IIssueFormService, IssueReporterData } from '../common/issue.js';
import { BaseIssueReporterService } from './baseIssueReporterService.js';

// GitHub has let us know that we could up our limit here to 8k. We chose 7500 to play it safe.
// ref https://github.com/microsoft/vscode/issues/159191

export class IssueWebReporter extends BaseIssueReporterService {
	constructor(
		disableExtensions: boolean,
		data: IssueReporterData,
		os: {
			type: string;
			arch: string;
			release: string;
		},
		product: IProductConfiguration,
		window: Window,
		@IIssueFormService issueFormService: IIssueFormService,
		@IThemeService themeService: IThemeService,
		@IFileService fileService: IFileService,
		@IFileDialogService fileDialogService: IFileDialogService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IAuthenticationService authenticationService: IAuthenticationService,
		@IOpenerService openerService: IOpenerService
	) {
		super(disableExtensions, data, os, product, window, true, issueFormService, themeService, fileService, fileDialogService, contextMenuService, authenticationService, openerService);

		// eslint-disable-next-line no-restricted-syntax
		const target = this.window.document.querySelector<HTMLElement>('.block-system .block-info');

		const webInfo = this.window.navigator.userAgent;
		if (webInfo) {
			target?.appendChild(this.window.document.createTextNode(webInfo));
			this.receivedSystemInfo = true;
			this.issueReporterModel.update({ systemInfoWeb: webInfo });
		}

		this.setEventHandlers();
	}

	public override setEventHandlers(): void {
		super.setEventHandlers();

		this.addEventListener('issue-type', 'change', (event: Event) => {
			const issueType = parseInt((<HTMLInputElement>event.target).value);
			this.issueReporterModel.update({ issueType: issueType });

			// Resets placeholder
			// eslint-disable-next-line no-restricted-syntax
			const descriptionTextArea = <HTMLInputElement>this.getElementById('issue-title');
			if (descriptionTextArea) {
				descriptionTextArea.placeholder = localize('undefinedPlaceholder', "Please enter a title");
			}

			this.updateButtonStates();
			this.setSourceOptions();
			this.render();
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/issue/browser/issueService.ts]---
Location: vscode-main/src/vs/workbench/contrib/issue/browser/issueService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getZoomLevel } from '../../../../base/browser/browser.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { userAgent } from '../../../../base/common/platform.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IExtensionManagementService } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { ExtensionType, IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { normalizeGitHubUrl } from '../common/issueReporterUtil.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { buttonBackground, buttonForeground, buttonHoverBackground, foreground, inputActiveOptionBorder, inputBackground, inputBorder, inputForeground, inputValidationErrorBackground, inputValidationErrorBorder, inputValidationErrorForeground, scrollbarSliderActiveBackground, scrollbarSliderBackground, scrollbarSliderHoverBackground, textLinkActiveForeground, textLinkForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { IColorTheme, IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IWorkspaceTrustManagementService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { SIDE_BAR_BACKGROUND } from '../../../common/theme.js';
import { IIssueFormService, IssueReporterData, IssueReporterExtensionData, IssueReporterStyles, IWorkbenchIssueService } from '../common/issue.js';
import { IWorkbenchAssignmentService } from '../../../services/assignment/common/assignmentService.js';
import { IAuthenticationService } from '../../../services/authentication/common/authentication.js';
import { IWorkbenchExtensionEnablementService } from '../../../services/extensionManagement/common/extensionManagement.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IIntegrityService } from '../../../services/integrity/common/integrity.js';


export class BrowserIssueService implements IWorkbenchIssueService {
	declare readonly _serviceBrand: undefined;

	constructor(
		@IExtensionService private readonly extensionService: IExtensionService,
		@IProductService private readonly productService: IProductService,
		@IIssueFormService private readonly issueFormService: IIssueFormService,
		@IThemeService private readonly themeService: IThemeService,
		@IWorkbenchAssignmentService private readonly experimentService: IWorkbenchAssignmentService,
		@IWorkspaceTrustManagementService private readonly workspaceTrustManagementService: IWorkspaceTrustManagementService,
		@IIntegrityService private readonly integrityService: IIntegrityService,
		@IExtensionManagementService private readonly extensionManagementService: IExtensionManagementService,
		@IWorkbenchExtensionEnablementService private readonly extensionEnablementService: IWorkbenchExtensionEnablementService,
		@IAuthenticationService private readonly authenticationService: IAuthenticationService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IOpenerService private readonly openerService: IOpenerService
	) { }

	async openReporter(options: Partial<IssueReporterData>): Promise<void> {
		// If web reporter setting is false open the old GitHub issue reporter
		if (!this.configurationService.getValue<boolean>('issueReporter.experimental.webReporter')) {
			const extensionId = options.extensionId;
			// If we don't have a extensionId, treat this as a Core issue
			if (!extensionId) {
				if (this.productService.reportIssueUrl) {
					const uri = this.getIssueUriFromStaticContent(this.productService.reportIssueUrl);
					await this.openerService.open(uri, { openExternal: true });
					return;
				}
				throw new Error(`No issue reporting URL configured for ${this.productService.nameLong}.`);
			}

			const selectedExtension = this.extensionService.extensions.filter(ext => ext.identifier.value === options.extensionId)[0];
			const extensionGitHubUrl = this.getExtensionGitHubUrl(selectedExtension);
			if (!extensionGitHubUrl) {
				throw new Error(`Unable to find issue reporting url for ${extensionId}`);
			}
			const uri = this.getIssueUriFromStaticContent(`${extensionGitHubUrl}/issues/new`, selectedExtension);
			await this.openerService.open(uri, { openExternal: true });
		}

		if (this.productService.reportIssueUrl) {
			const theme = this.themeService.getColorTheme();
			const experiments = await this.experimentService.getCurrentExperiments();

			let githubAccessToken = '';
			try {
				const githubSessions = await this.authenticationService.getSessions('github');
				const potentialSessions = githubSessions.filter(session => session.scopes.includes('repo'));
				githubAccessToken = potentialSessions[0]?.accessToken;
			} catch (e) {
				// Ignore
			}

			// air on the side of caution and have false be the default
			let isUnsupported = false;
			try {
				isUnsupported = !(await this.integrityService.isPure()).isPure;
			} catch (e) {
				// Ignore
			}

			const extensionData: IssueReporterExtensionData[] = [];
			try {
				const extensions = await this.extensionManagementService.getInstalled();
				const enabledExtensions = extensions.filter(extension => this.extensionEnablementService.isEnabled(extension) || (options.extensionId && extension.identifier.id === options.extensionId));
				extensionData.push(...enabledExtensions.map((extension): IssueReporterExtensionData => {
					const { manifest } = extension;
					const manifestKeys = manifest.contributes ? Object.keys(manifest.contributes) : [];
					const isTheme = !manifest.main && !manifest.browser && manifestKeys.length === 1 && manifestKeys[0] === 'themes';
					const isBuiltin = extension.type === ExtensionType.System;
					return {
						name: manifest.name,
						publisher: manifest.publisher,
						version: manifest.version,
						repositoryUrl: manifest.repository && manifest.repository.url,
						bugsUrl: manifest.bugs && manifest.bugs.url,
						displayName: manifest.displayName,
						id: extension.identifier.id,
						data: options.data,
						uri: options.uri,
						isTheme,
						isBuiltin,
						extensionData: 'Extensions data loading',
					};
				}));
			} catch (e) {
				extensionData.push({
					name: 'Workbench Issue Service',
					publisher: 'Unknown',
					version: 'Unknown',
					repositoryUrl: undefined,
					bugsUrl: undefined,
					extensionData: `Extensions not loaded: ${e}`,
					displayName: `Extensions not loaded: ${e}`,
					id: 'workbench.issue',
					isTheme: false,
					isBuiltin: true
				});
			}

			const issueReporterData: IssueReporterData = Object.assign({
				styles: getIssueReporterStyles(theme),
				zoomLevel: getZoomLevel(mainWindow),
				enabledExtensions: extensionData,
				experiments: experiments?.join('\n'),
				restrictedMode: !this.workspaceTrustManagementService.isWorkspaceTrusted(),
				isUnsupported,
				githubAccessToken
			}, options);

			return this.issueFormService.openReporter(issueReporterData);
		}
		throw new Error(`No issue reporting URL configured for ${this.productService.nameLong}.`);

	}

	private getExtensionGitHubUrl(extension: IExtensionDescription): string {
		if (extension.isBuiltin && this.productService.reportIssueUrl) {
			return normalizeGitHubUrl(this.productService.reportIssueUrl);
		}

		let repositoryUrl = '';

		const bugsUrl = extension?.bugs?.url;
		const extensionUrl = extension?.repository?.url;

		// If given, try to match the extension's bug url
		if (bugsUrl && bugsUrl.match(/^https?:\/\/github\.com\/(.*)/)) {
			repositoryUrl = normalizeGitHubUrl(bugsUrl);
		} else if (extensionUrl && extensionUrl.match(/^https?:\/\/github\.com\/(.*)/)) {
			repositoryUrl = normalizeGitHubUrl(extensionUrl);
		}

		return repositoryUrl;
	}

	private getIssueUriFromStaticContent(baseUri: string, extension?: IExtensionDescription): string {
		const issueDescription = `ADD ISSUE DESCRIPTION HERE

Version: ${this.productService.version}
Commit: ${this.productService.commit ?? 'unknown'}
User Agent: ${userAgent ?? 'unknown'}
Embedder: ${this.productService.embedderIdentifier ?? 'unknown'}
${extension?.version ? `\nExtension version: ${extension.version}` : ''}
<!-- generated by web issue reporter -->`;

		return `${baseUri}?body=${encodeURIComponent(issueDescription)}&labels=web`;
	}
}

export function getIssueReporterStyles(theme: IColorTheme): IssueReporterStyles {
	return {
		backgroundColor: getColor(theme, SIDE_BAR_BACKGROUND),
		color: getColor(theme, foreground),
		textLinkColor: getColor(theme, textLinkForeground),
		textLinkActiveForeground: getColor(theme, textLinkActiveForeground),
		inputBackground: getColor(theme, inputBackground),
		inputForeground: getColor(theme, inputForeground),
		inputBorder: getColor(theme, inputBorder),
		inputActiveBorder: getColor(theme, inputActiveOptionBorder),
		inputErrorBorder: getColor(theme, inputValidationErrorBorder),
		inputErrorBackground: getColor(theme, inputValidationErrorBackground),
		inputErrorForeground: getColor(theme, inputValidationErrorForeground),
		buttonBackground: getColor(theme, buttonBackground),
		buttonForeground: getColor(theme, buttonForeground),
		buttonHoverBackground: getColor(theme, buttonHoverBackground),
		sliderActiveColor: getColor(theme, scrollbarSliderActiveBackground),
		sliderBackgroundColor: getColor(theme, scrollbarSliderBackground),
		sliderHoverColor: getColor(theme, scrollbarSliderHoverBackground),
	};
}

function getColor(theme: IColorTheme, key: string): string | undefined {
	const color = theme.getColor(key);
	return color ? color.toString() : undefined;
}

registerSingleton(IWorkbenchIssueService, BrowserIssueService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/issue/browser/issueTroubleshoot.ts]---
Location: vscode-main/src/vs/workbench/contrib/issue/browser/issueTroubleshoot.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../nls.js';
import { IExtensionManagementService } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { ExtensionType } from '../../../../platform/extensions/common/extensions.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IWorkbenchIssueService } from '../common/issue.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IUserDataProfileImportExportService, IUserDataProfileManagementService, IUserDataProfileService } from '../../../services/userDataProfile/common/userDataProfile.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IExtensionBisectService } from '../../../services/extensionManagement/browser/extensionBisect.js';
import { INotificationHandle, INotificationService, IPromptChoice, NotificationPriority, Severity } from '../../../../platform/notification/common/notification.js';
import { IWorkbenchExtensionEnablementService } from '../../../services/extensionManagement/common/extensionManagement.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { ServicesAccessor, createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ContextKeyExpr, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions, IWorkbenchContributionsRegistry } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { URI } from '../../../../base/common/uri.js';
import { RemoteNameContext } from '../../../common/contextkeys.js';
import { IsWebContext } from '../../../../platform/contextkey/common/contextkeys.js';

const ITroubleshootIssueService = createDecorator<ITroubleshootIssueService>('ITroubleshootIssueService');

interface ITroubleshootIssueService {
	_serviceBrand: undefined;
	isActive(): boolean;
	start(): Promise<void>;
	resume(): Promise<void>;
	stop(): Promise<void>;
}

enum TroubleshootStage {
	EXTENSIONS = 1,
	WORKBENCH,
}

type TroubleShootResult = 'good' | 'bad' | 'stop';

class TroubleShootState {

	static fromJSON(raw: string | undefined): TroubleShootState | undefined {
		if (!raw) {
			return undefined;
		}
		try {
			interface Raw extends TroubleShootState { }
			const data: Raw = JSON.parse(raw);
			if (
				(data.stage === TroubleshootStage.EXTENSIONS || data.stage === TroubleshootStage.WORKBENCH)
				&& typeof data.profile === 'string'
			) {
				return new TroubleShootState(data.stage, data.profile);
			}
		} catch { /* ignore */ }
		return undefined;
	}

	constructor(
		readonly stage: TroubleshootStage,
		readonly profile: string,
	) { }
}

class TroubleshootIssueService extends Disposable implements ITroubleshootIssueService {

	readonly _serviceBrand: undefined;

	static readonly storageKey = 'issueTroubleshootState';

	private notificationHandle: INotificationHandle | undefined;

	constructor(
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IUserDataProfileManagementService private readonly userDataProfileManagementService: IUserDataProfileManagementService,
		@IUserDataProfileImportExportService private readonly userDataProfileImportExportService: IUserDataProfileImportExportService,
		@IDialogService private readonly dialogService: IDialogService,
		@IExtensionBisectService private readonly extensionBisectService: IExtensionBisectService,
		@INotificationService private readonly notificationService: INotificationService,
		@IExtensionManagementService private readonly extensionManagementService: IExtensionManagementService,
		@IWorkbenchExtensionEnablementService private readonly extensionEnablementService: IWorkbenchExtensionEnablementService,
		@IWorkbenchIssueService private readonly issueService: IWorkbenchIssueService,
		@IProductService private readonly productService: IProductService,
		@IHostService private readonly hostService: IHostService,
		@IStorageService private readonly storageService: IStorageService,
		@IOpenerService private readonly openerService: IOpenerService,
	) {
		super();
	}

	isActive(): boolean {
		return this.state !== undefined;
	}

	async start(): Promise<void> {
		if (this.isActive()) {
			throw new Error('invalid state');
		}

		const res = await this.dialogService.confirm({
			message: localize('troubleshoot issue', "Troubleshoot Issue"),
			detail: localize('detail.start', "Issue troubleshooting is a process to help you identify the cause for an issue. The cause for an issue can be a misconfiguration, due to an extension, or be {0} itself.\n\nDuring the process the window reloads repeatedly. Each time you must confirm if you are still seeing the issue.", this.productService.nameLong),
			primaryButton: localize({ key: 'msg', comment: ['&& denotes a mnemonic'] }, "&&Troubleshoot Issue"),
			custom: true
		});

		if (!res.confirmed) {
			return;
		}

		const originalProfile = this.userDataProfileService.currentProfile;
		await this.userDataProfileImportExportService.createTroubleshootProfile();
		this.state = new TroubleShootState(TroubleshootStage.EXTENSIONS, originalProfile.id);
		await this.resume();
	}

	async resume(): Promise<void> {
		if (!this.isActive()) {
			return;
		}

		if (this.state?.stage === TroubleshootStage.EXTENSIONS && !this.extensionBisectService.isActive) {
			await this.reproduceIssueWithExtensionsDisabled();
		}

		if (this.state?.stage === TroubleshootStage.WORKBENCH) {
			await this.reproduceIssueWithEmptyProfile();
		}

		await this.stop();
	}

	async stop(): Promise<void> {
		if (!this.isActive()) {
			return;
		}

		if (this.notificationHandle) {
			this.notificationHandle.close();
			this.notificationHandle = undefined;
		}

		if (this.extensionBisectService.isActive) {
			await this.extensionBisectService.reset();
		}

		const profile = this.userDataProfilesService.profiles.find(p => p.id === this.state?.profile) ?? this.userDataProfilesService.defaultProfile;
		this.state = undefined;
		await this.userDataProfileManagementService.switchProfile(profile);
	}

	private async reproduceIssueWithExtensionsDisabled(): Promise<void> {
		if (!(await this.extensionManagementService.getInstalled(ExtensionType.User)).length) {
			this.state = new TroubleShootState(TroubleshootStage.WORKBENCH, this.state!.profile);
			return;
		}

		const result = await this.askToReproduceIssue(localize('profile.extensions.disabled', "Issue troubleshooting is active and has temporarily disabled all installed extensions. Check if you can still reproduce the problem and proceed by selecting from these options."));
		if (result === 'good') {
			const profile = this.userDataProfilesService.profiles.find(p => p.id === this.state!.profile) ?? this.userDataProfilesService.defaultProfile;
			await this.reproduceIssueWithExtensionsBisect(profile);
		}
		if (result === 'bad') {
			this.state = new TroubleShootState(TroubleshootStage.WORKBENCH, this.state!.profile);
		}
		if (result === 'stop') {
			await this.stop();
		}
	}

	private async reproduceIssueWithEmptyProfile(): Promise<void> {
		await this.userDataProfileManagementService.createAndEnterTransientProfile();
		this.updateState(this.state);
		const result = await this.askToReproduceIssue(localize('empty.profile', "Issue troubleshooting is active and has temporarily reset your configurations to defaults. Check if you can still reproduce the problem and proceed by selecting from these options."));
		if (result === 'stop') {
			await this.stop();
		}
		if (result === 'good') {
			await this.askToReportIssue(localize('issue is with configuration', "Issue troubleshooting has identified that the issue is caused by your configurations. Please report the issue by exporting your configurations using \"Export Profile\" command and share the file in the issue report."));
		}
		if (result === 'bad') {
			await this.askToReportIssue(localize('issue is in core', "Issue troubleshooting has identified that the issue is with {0}.", this.productService.nameLong));
		}
	}

	private async reproduceIssueWithExtensionsBisect(profile: IUserDataProfile): Promise<void> {
		await this.userDataProfileManagementService.switchProfile(profile);
		const extensions = (await this.extensionManagementService.getInstalled(ExtensionType.User)).filter(ext => this.extensionEnablementService.isEnabled(ext));
		await this.extensionBisectService.start(extensions);
		await this.hostService.reload();
	}

	private askToReproduceIssue(message: string): Promise<TroubleShootResult> {
		return new Promise((c, e) => {
			const goodPrompt: IPromptChoice = {
				label: localize('I cannot reproduce', "I Can't Reproduce"),
				run: () => c('good')
			};
			const badPrompt: IPromptChoice = {
				label: localize('This is Bad', "I Can Reproduce"),
				run: () => c('bad')
			};
			const stop: IPromptChoice = {
				label: localize('Stop', "Stop"),
				run: () => c('stop')
			};
			this.notificationHandle = this.notificationService.prompt(
				Severity.Info,
				message,
				[goodPrompt, badPrompt, stop],
				{ sticky: true, priority: NotificationPriority.URGENT }
			);
		});
	}

	private async askToReportIssue(message: string): Promise<void> {
		let isCheckedInInsiders = false;
		if (this.productService.quality === 'stable') {
			const res = await this.askToReproduceIssueWithInsiders();
			if (res === 'good') {
				await this.dialogService.prompt({
					type: Severity.Info,
					message: localize('troubleshoot issue', "Troubleshoot Issue"),
					detail: localize('use insiders', "This likely means that the issue has been addressed already and will be available in an upcoming release. You can safely use {0} insiders until the new stable version is available.", this.productService.nameLong),
					custom: true
				});
				return;
			}
			if (res === 'stop') {
				await this.stop();
				return;
			}
			if (res === 'bad') {
				isCheckedInInsiders = true;
			}
		}

		await this.issueService.openReporter({
			issueBody: `> ${message} ${isCheckedInInsiders ? `It is confirmed that the issue exists in ${this.productService.nameLong} Insiders` : ''}`,
		});
	}

	private async askToReproduceIssueWithInsiders(): Promise<TroubleShootResult | undefined> {
		const confirmRes = await this.dialogService.confirm({
			type: 'info',
			message: localize('troubleshoot issue', "Troubleshoot Issue"),
			primaryButton: localize('download insiders', "Download {0} Insiders", this.productService.nameLong),
			cancelButton: localize('report anyway', "Report Issue Anyway"),
			detail: localize('ask to download insiders', "Please try to download and reproduce the issue in {0} insiders.", this.productService.nameLong),
			custom: {
				disableCloseAction: true,
			}
		});

		if (!confirmRes.confirmed) {
			return undefined;
		}

		const opened = await this.openerService.open(URI.parse('https://aka.ms/vscode-insiders'));
		if (!opened) {
			return undefined;
		}

		const res = await this.dialogService.prompt<TroubleShootResult>({
			type: 'info',
			message: localize('troubleshoot issue', "Troubleshoot Issue"),
			buttons: [{
				label: localize('good', "I can't reproduce"),
				run: () => 'good'
			}, {
				label: localize('bad', "I can reproduce"),
				run: () => 'bad'
			}],
			cancelButton: {
				label: localize('stop', "Stop"),
				run: () => 'stop'
			},
			detail: localize('ask to reproduce issue', "Please try to reproduce the issue in {0} insiders and confirm if the issue exists there.", this.productService.nameLong),
			custom: {
				disableCloseAction: true,
			}
		});

		return res.result;
	}

	private _state: TroubleShootState | undefined | null;
	get state(): TroubleShootState | undefined {
		if (this._state === undefined) {
			const raw = this.storageService.get(TroubleshootIssueService.storageKey, StorageScope.PROFILE);
			this._state = TroubleShootState.fromJSON(raw);
		}
		return this._state || undefined;
	}

	set state(state: TroubleShootState | undefined) {
		this._state = state ?? null;
		this.updateState(state);
	}

	private updateState(state: TroubleShootState | undefined) {
		if (state) {
			this.storageService.store(TroubleshootIssueService.storageKey, JSON.stringify(state), StorageScope.PROFILE, StorageTarget.MACHINE);
		} else {
			this.storageService.remove(TroubleshootIssueService.storageKey, StorageScope.PROFILE);
		}
	}
}

class IssueTroubleshootUi extends Disposable {

	static ctxIsTroubleshootActive = new RawContextKey<boolean>('isIssueTroubleshootActive', false);

	constructor(
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@ITroubleshootIssueService private readonly troubleshootIssueService: ITroubleshootIssueService,
		@IStorageService storageService: IStorageService,
	) {
		super();
		this.updateContext();
		if (troubleshootIssueService.isActive()) {
			troubleshootIssueService.resume();
		}
		this._register(storageService.onDidChangeValue(StorageScope.PROFILE, TroubleshootIssueService.storageKey, this._store)(() => {
			this.updateContext();
		}));
	}

	private updateContext(): void {
		IssueTroubleshootUi.ctxIsTroubleshootActive.bindTo(this.contextKeyService).set(this.troubleshootIssueService.isActive());
	}

}

Registry.as<IWorkbenchContributionsRegistry>(Extensions.Workbench).registerWorkbenchContribution(IssueTroubleshootUi, LifecyclePhase.Restored);

registerAction2(class TroubleshootIssueAction extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.troubleshootIssue.start',
			title: localize2('troubleshootIssue', 'Troubleshoot Issue...'),
			category: Categories.Help,
			f1: true,
			precondition: ContextKeyExpr.and(IssueTroubleshootUi.ctxIsTroubleshootActive.negate(), RemoteNameContext.isEqualTo(''), IsWebContext.negate()),
		});
	}
	run(accessor: ServicesAccessor): Promise<void> {
		return accessor.get(ITroubleshootIssueService).start();
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.troubleshootIssue.stop',
			title: localize2('title.stop', 'Stop Troubleshoot Issue'),
			category: Categories.Help,
			f1: true,
			precondition: IssueTroubleshootUi.ctxIsTroubleshootActive
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		return accessor.get(ITroubleshootIssueService).stop();
	}
});


registerSingleton(ITroubleshootIssueService, TroubleshootIssueService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/issue/browser/media/issueReporter.css]---
Location: vscode-main/src/vs/workbench/contrib/issue/browser/media/issueReporter.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.web.issue-reporter-body {
	position: absolute;
	overflow-y: scroll;
}

.web.issue-reporter-body .monaco-workbench select{
	-webkit-appearance: auto;
	appearance: auto;
}

/**
 * Table
 */

.issue-reporter-body table {
	width: 100%;
	max-width: 100%;
	background-color: transparent;
	border-collapse: collapse;
}

.issue-reporter-body th {
	vertical-align: bottom;
	border-bottom: 1px solid;
	padding: 5px;
	text-align: inherit;
}

.issue-reporter-body td {
	padding: 5px;
	vertical-align: top;
}

.issue-reporter-body tr td:first-child {
	width: 30%;
}

.issue-reporter-body label {
	user-select: none;
}

.issue-reporter-body .block-settingsSearchResults-details {
	padding-bottom: .5rem;
}

.issue-reporter-body .block-settingsSearchResults-details > div {
	padding: .5rem .75rem;
}

.issue-reporter-body .section {
	margin-bottom: .5em;
}

/**
 * Forms
 */
.issue-reporter-body input[type="text"],
.issue-reporter-body textarea {
	display: block;
	width: 100%;
	padding: .375rem .75rem;
	font-size: 1rem;
	line-height: 1.5;
	color: #495057;
}

.issue-reporter-body textarea {
	overflow: auto;
	resize: vertical;
}

/**
 * Button
 */
.issue-reporter-body .monaco-text-button {
	display: block;
	width: auto;
	padding: 4px 10px;
	align-self: flex-end;
	font-size: 13px;
}

.issue-reporter-body .monaco-button-dropdown {
	align-self: flex-end;
}

.issue-reporter-body .monaco-button-dropdown > .monaco-button.monaco-dropdown-button {
	padding: 0 4px;
}

.issue-reporter-body select {
	height: calc(2.25rem + 2px);
	display: inline-block;
	padding: 3px 3px;
	font-size: 14px;
	line-height: 1.5;
	color: #495057;
	border: none;
}

.issue-reporter-body * {
	box-sizing: border-box;
}

.issue-reporter-body .issue-reporter textarea,
.issue-reporter-body .issue-reporter input,
.issue-reporter-body .issue-reporter select {
	font-family: inherit;
}

.issue-reporter-body html {
	color: #CCCCCC;
	height: 100%;
}

.issue-reporter-body .extension-caption .codicon-modifier-spin {
	padding-bottom: 3px;
	margin-left: 2px;
}

/* Font Families (with CJK support) */

.issue-reporter-body .mac.web {
	font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

.issue-reporter-body .mac.web:lang(zh-Hans) {
	font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", sans-serif;
}

.issue-reporter-body .mac.web:lang(zh-Hant) {
	font-family: -apple-system, BlinkMacSystemFont, "PingFang TC", sans-serif;
}

.issue-reporter-body .mac.web:lang(ja) {
	font-family: -apple-system, BlinkMacSystemFont, "Hiragino Kaku Gothic Pro", sans-serif;
}

.issue-reporter-body .mac.web:lang(ko) {
	font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Nanum Gothic", "AppleGothic", sans-serif;
}

.issue-reporter-body .windows.web {
	font-family: "Segoe WPC", "Segoe UI", sans-serif;
}

.issue-reporter-body .windows.web:lang(zh-Hans) {
	font-family: "Segoe WPC", "Segoe UI", "Microsoft YaHei", sans-serif;
}

.issue-reporter-body .windows.web:lang(zh-Hant) {
	font-family: "Segoe WPC", "Segoe UI", "Microsoft Jhenghei", sans-serif;
}

.issue-reporter-body .windows.web:lang(ja) {
	font-family: "Segoe WPC", "Segoe UI", "Yu Gothic UI", "Meiryo UI", sans-serif;
}

.issue-reporter-body .windows.web:lang(ko) {
	font-family: "Segoe WPC", "Segoe UI", "Malgun Gothic", "Dotom", sans-serif;
}


/* Linux: add `system-ui` as first font and not `Ubuntu` to allow other distribution pick their standard OS font */
.issue-reporter-body .linux.web {
	font-family: system-ui, "Ubuntu", "Droid Sans", sans-serif;
}

.issue-reporter-body .linux.web:lang(zh-Hans) {
	font-family: system-ui, "Ubuntu", "Droid Sans", "Source Han Sans SC", "Source Han Sans CN", "Source Han Sans", sans-serif;
}

.issue-reporter-body .linux.web:lang(zh-Hant) {
	font-family: system-ui, "Ubuntu", "Droid Sans", "Source Han Sans TC", "Source Han Sans TW", "Source Han Sans", sans-serif;
}

.issue-reporter-body .linux.web:lang(ja) {
	font-family: system-ui, "Ubuntu", "Droid Sans", "Source Han Sans J", "Source Han Sans JP", "Source Han Sans", sans-serif;
}

.issue-reporter-body .linux.web:lang(ko) {
	font-family: system-ui, "Ubuntu", "Droid Sans", "Source Han Sans K", "Source Han Sans JR", "Source Han Sans", "UnDotum", "FBaekmuk Gulim", sans-serif;
}

body.issue-reporter-body  {
	margin: 0;
	overflow-y: auto;
	height: 100%;
	background-color: var(--vscode-editor-background)
}

.issue-reporter-body .monaco-workbench {
	height: 100%;
	overflow: auto;
}

.issue-reporter-body .hidden {
	display: none;
}

.issue-reporter-body .block {
	font-size: 12px;
}

.issue-reporter-body .block .block-info {
	width: 100%;
	font-size: 12px;
	overflow: auto;
	overflow-wrap: break-word;
	margin: 5px;
	padding: 10px;
}

.issue-reporter-body #issue-reporter {
	max-width: 85vw;
	margin-left: auto;
	margin-right: auto;
	padding-top: 2em;
	padding-bottom: 2em;
	display: flex;
	flex-direction: column;
	overflow: visible;
}

.issue-reporter-body .description-section {
	flex-grow: 0;
	display: flex;
	flex-direction: column;
	flex-shrink: 0;
}

.issue-reporter-body textarea {
	flex-grow: 1;
	height: 200px;
}

.issue-reporter-body .block-info-text {
	display: flex;
	flex-grow: 0;
	flex-direction: column;
}

.issue-reporter-body #github-submit-btn {
	flex-shrink: 0;
	margin: 0; /* Reset margin since parent container handles spacing */
}

.issue-reporter-body .two-col {
	display: inline-block;
	width: 49%;
}

.issue-reporter-body #vscode-version {
	width: 90%;
}

.issue-reporter-body .issue-reporter .input-group {
	margin-bottom: 1em;
	font-size: 16px;
}

.issue-reporter-body #extension-selection {
	margin-top: 1em;
}

.issue-reporter-body .issue-reporter select,
.issue-reporter-body .issue-reporter input,
.issue-reporter-body .issue-reporter textarea {
	border: 1px solid transparent;
	margin-top: 10px;
}


.issue-reporter-body .validation-error {
	font-size: 12px;
	padding: 10px;
	border-top: 0px !important;
}

.issue-reporter-body .system-info {
	margin-bottom: 10px;
}


.issue-reporter-body .issue-reporter input[type="checkbox"] {
	width: auto;
	display: inline-block;
	margin-top: 0;
	vertical-align: middle;
	cursor: pointer;
}

.issue-reporter-body .issue-reporter input:disabled {
	opacity: 0.6;
}

.issue-reporter-body .list-title {
	margin-top: 1em;
	margin-left: 1em;
}

.issue-reporter-body .instructions {
	font-size: 12px;
	margin-top: .5em;
}

.issue-reporter-body a,
.issue-reporter-body .workbenchCommand {
	cursor: pointer;
	border: 1px solid transparent;
	color: var(--vscode-textLink-foreground);
}

.issue-reporter-body .workbenchCommand:disabled {
	color: #868e96;
	cursor: default
}

.issue-reporter-body .block-extensions .block-info {
	margin-bottom: 1.5em;
}

.issue-reporter-body .showInfo,
.issue-reporter-body .input-group a {
	color: var(--vscode-textLink-foreground);
}

.issue-reporter-body .section .input-group .validation-error {
	margin-left: 100px;
}

.issue-reporter-body .section .inline-form-control,
.issue-reporter-body .section .inline-label {
	display: inline-block;
	font-size: initial;
}

.issue-reporter-body .section .inline-label {
	width: 95px;
}

.issue-reporter-body .section .inline-form-control,
.issue-reporter-body .section .input-group .validation-error {
	width: calc(100% - 100px);
}

.issue-reporter-body .issue-reporter .inline-label,
.issue-reporter-body .issue-reporter #issue-description-label {
	font-size: initial;
	cursor: default;
}

.issue-reporter-body .monaco-workbench .issue-reporter label {
	cursor: default;
}

.issue-reporter-body #issue-type,
.issue-reporter-body #issue-source,
.issue-reporter-body #extension-selector {
	cursor: pointer;
	cursor: pointer;
	appearance: auto;
	border: none;
	border-right: 6px solid transparent;
	padding-left: 10px;
}

.issue-reporter-body #similar-issues {
	margin-left: 15%;
	display: block;
}

.issue-reporter-body #problem-source-help-text {
	margin-left: calc(15% + 1em);
}

@media (max-width: 950px) {
	.issue-reporter-body .section .inline-label {
		width: 15%;
		font-size: 16px;
	}

	.issue-reporter-body #problem-source-help-text {
		margin-left: calc(15% + 1em);
	}

	.issue-reporter-body .section .inline-form-control,
	.issue-reporter-body .section .input-group .validation-error {
		width: calc(85% - 5px);
	}

	.issue-reporter-body .section .input-group .validation-error {
		margin-left: calc(15% + 4px);
	}
}

@media (max-width: 620px) {
	.issue-reporter-body .section .inline-label {
		display: none !important;
	}

	.issue-reporter-body #problem-source-help-text {
		margin-left: 1em;
	}

	.issue-reporter-body .section .inline-form-control,
	.issue-reporter-body .section .input-group .validation-error {
		width: 100%;
	}

	.issue-reporter-body #similar-issues,
	.issue-reporter-body .section .input-group .validation-error {
		margin-left: 0;
	}
}

.issue-reporter-body::-webkit-scrollbar {
	width: 14px;
}

.issue-reporter-body::-webkit-scrollbar-thumb {
	min-height: 20px;
}

.issue-reporter-body::-webkit-scrollbar-corner {
	display: none;
}

.issue-reporter-body .issues-container {
	margin-left: 1.5em;
	margin-top: .5em;
	max-height: 92px;
	overflow-y: auto;
}

.issue-reporter-body .issues-container > .issue {
	padding: 4px 0;
	display: flex;
}

.issue-reporter-body .issues-container > .issue > .issue-link {
	width: calc(100% - 82px);
	overflow: hidden;
	padding-top: 3px;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.issue-reporter-body .issues-container > .issue > .issue-state .codicon {
	width: 16px;
}

.issue-reporter-body .issues-container > .issue > .issue-state {
	display: flex;
	width: 77px;
	padding: 3px 6px;
	margin-right: 5px;
	color: #CCCCCC;
	background-color: #3c3c3c;
	border-radius: .25rem;
}

.issue-reporter-body .issues-container > .issue .label {
	padding-top: 2px;
	margin-left: 5px;
	width: 44px;
	text-overflow: ellipsis;
	overflow: hidden;
}

.issue-reporter-body .issues-container > .issue .issue-icon {
	padding-top: 2px;
}

.issue-reporter-body a {
	color: var(--vscode-textLink-foreground);
}

.issue-reporter-body .issue-reporter input[type="text"],
.issue-reporter-body .issue-reporter textarea,
.issue-reporter-body .issue-reporter select,
.issue-reporter-body .issue-reporter .issues-container > .issue > .issue-state,
.issue-reporter-body .issue-reporter .block-info {
	background-color: var(--vscode-input-background);
	color: var(--vscode-input-foreground);
}

.issue-reporter-body .monaco-workbench,
.issue-reporter-body::-webkit-scrollbar-track {
	background-color: var(--vscode-editor-background) !important;
}

.issue-reporter-body .issue-reporter input[type="text"],
.issue-reporter-body .issue-reporter textarea,
.issue-reporter-body .issue-reporter select {
	border: 1px solid var(--vscode-input-border)
}

.issue-reporter-body .issue-reporter input[type='text']:focus,
.issue-reporter-body .issue-reporter textarea:focus,
.issue-reporter-body .issue-reporter select:focus,
.issue-reporter-body .issue-reporter summary:focus,
.issue-reporter-body .issue-reporter button:focus,
.issue-reporter-body .issue-reporter a:focus,
.issue-reporter-body .issue-reporter .workbenchCommand:focus {
	border: 1px solid var(--vscode-inputOption-activeBorder);
	outline-style: none;
}

.issue-reporter-body .invalid-input,
.issue-reporter-body .invalid-input:focus,
.issue-reporter-body .validation-error {
	border: 1px solid var(--vscode-inputValidation-errorBorder) !important
}

.issue-reporter-body .required-input {
	color: var(--vscode-inputValidation-errorBorder)
}

.issue-reporter-body .validation-error {
	background: var(--vscode-inputValidation-errorBackground);
	color: var(--vscode-inputValidation-errorForeground)
}

.issue-reporter-body a,
.issue-reporter-body .workbenchCommand {
	color: var(--vscode-textLink-foreground)
}

.issue-reporter-body a:hover,
.issue-reporter-body .workbenchCommand:hover {
	color: var(--vscode-textLink-activeForeground)
}

.issue-reporter-body::-webkit-scrollbar-thumb:active {
	background-color: var(--vscode-scrollbarSlider-activeBackground)
}


.issue-reporter-body::-webkit-scrollbar-thumb,
.issue-reporter-body::-webkit-scrollbar-thumb:hover {
	background-color: var(--vscode-scrollbarSlider-hoverBackground)
}

.issue-reporter-update-banner {
	color: var(--vscode-textLink-foreground);
	color: var(--vscode-button-foreground);
	background-color: var(--vscode-button-background);
	padding: 10px;
	text-align: center;
	position: sticky;
	top: 0;
	z-index: 1000;
}

/* Public elements section styling */
.issue-reporter-body .public-elements {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	margin-top: 10px;
	margin-bottom: 10px;
}

.issue-reporter-body .public-elements .monaco-text-button,
.issue-reporter-body .public-elements .monaco-button-dropdown {
	align-self: flex-end;
}

.issue-reporter-body .public-elements #show-repo-name {
	align-self: flex-end;
	font-size: 12px;
}

/* Internal elements section styling */
.issue-reporter-body .internal-elements {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	margin-top: 8px;
}

.issue-reporter-body .internal-elements .internal-top-row {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 12px;
	justify-content: flex-end;
}

.issue-reporter-body .internal-elements .internal-preview-message {
	font-size: 10px;
	opacity: 0.8;
	text-align: right;
	white-space: nowrap;
	display: inline-flex;
	align-items: center;
	line-height: 15px; /* approximate button height for vertical centering */
}

.issue-reporter-body .internal-elements .monaco-text-button {
	font-size: 10px;
	padding: 2px 8px;
}

.issue-reporter-body .internal-elements #show-private-repo-name {
	align-self: flex-end;
	font-size: 12px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/issue/common/issue.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/issue/common/issue.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { localize, localize2 } from '../../../../nls.js';
import { ICommandAction } from '../../../../platform/action/common/action.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { MenuId, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { CommandsRegistry, ICommandMetadata } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IssueReporterData, IWorkbenchIssueService } from './issue.js';

const OpenIssueReporterActionId = 'workbench.action.openIssueReporter';
const OpenIssueReporterApiId = 'vscode.openIssueReporter';

const OpenIssueReporterCommandMetadata: ICommandMetadata = {
	description: 'Open the issue reporter and optionally prefill part of the form.',
	args: [
		{
			name: 'options',
			description: 'Data to use to prefill the issue reporter with.',
			isOptional: true,
			schema: {
				oneOf: [
					{
						type: 'string',
						description: 'The extension id to preselect.'
					},
					{
						type: 'object',
						properties: {
							extensionId: {
								type: 'string'
							},
							issueTitle: {
								type: 'string'
							},
							issueBody: {
								type: 'string'
							}
						}

					}
				]
			}
		},
	]
};

interface OpenIssueReporterArgs {
	readonly extensionId?: string;
	readonly issueTitle?: string;
	readonly issueBody?: string;
	readonly extensionData?: string;
}

export class BaseIssueContribution extends Disposable implements IWorkbenchContribution {
	constructor(
		@IProductService productService: IProductService,
		@IConfigurationService configurationService: IConfigurationService,
	) {
		super();

		if (!configurationService.getValue<boolean>('telemetry.feedback.enabled')) {
			this._register(CommandsRegistry.registerCommand({
				id: 'workbench.action.openIssueReporter',
				handler: function (accessor) {
					const data = accessor.get(INotificationService);
					data.info('Feedback is disabled.');

				},
			}));
			return;
		}

		if (!productService.reportIssueUrl) {
			return;
		}

		this._register(CommandsRegistry.registerCommand({
			id: OpenIssueReporterActionId,
			handler: function (accessor, args?: string | [string] | OpenIssueReporterArgs) {
				const data: Partial<IssueReporterData> =
					typeof args === 'string'
						? { extensionId: args }
						: Array.isArray(args)
							? { extensionId: args[0] }
							: args ?? {};

				return accessor.get(IWorkbenchIssueService).openReporter(data);
			},
			metadata: OpenIssueReporterCommandMetadata
		}));

		this._register(CommandsRegistry.registerCommand({
			id: OpenIssueReporterApiId,
			handler: function (accessor, args?: string | [string] | OpenIssueReporterArgs) {
				const data: Partial<IssueReporterData> =
					typeof args === 'string'
						? { extensionId: args }
						: Array.isArray(args)
							? { extensionId: args[0] }
							: args ?? {};

				return accessor.get(IWorkbenchIssueService).openReporter(data);
			},
			metadata: OpenIssueReporterCommandMetadata
		}));

		const reportIssue: ICommandAction = {
			id: OpenIssueReporterActionId,
			title: localize2({ key: 'reportIssueInEnglish', comment: ['Translate this to "Report Issue in English" in all languages please!'] }, "Report Issue..."),
			category: Categories.Help
		};

		this._register(MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command: reportIssue }));

		this._register(MenuRegistry.appendMenuItem(MenuId.MenubarHelpMenu, {
			group: '3_feedback',
			command: {
				id: OpenIssueReporterActionId,
				title: localize({ key: 'miReportIssue', comment: ['&& denotes a mnemonic', 'Translate this to "Report Issue in English" in all languages please!'] }, "Report &&Issue")
			},
			order: 3
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/issue/common/issue.ts]---
Location: vscode-main/src/vs/workbench/contrib/issue/common/issue.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { UriComponents } from '../../../../base/common/uri.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

// Since data sent through the service is serialized to JSON, functions will be lost, so Color objects
// should not be sent as their 'toString' method will be stripped. Instead convert to strings before sending.
export interface WindowStyles {
	backgroundColor?: string;
	color?: string;
}
export interface WindowData {
	styles: WindowStyles;
	zoomLevel: number;
}

export const enum IssueType {
	Bug,
	PerformanceIssue,
	FeatureRequest
}

export enum IssueSource {
	VSCode = 'vscode',
	Extension = 'extension',
	Marketplace = 'marketplace'
}

export interface IssueReporterStyles extends WindowStyles {
	textLinkColor?: string;
	textLinkActiveForeground?: string;
	inputBackground?: string;
	inputForeground?: string;
	inputBorder?: string;
	inputErrorBorder?: string;
	inputErrorBackground?: string;
	inputErrorForeground?: string;
	inputActiveBorder?: string;
	buttonBackground?: string;
	buttonForeground?: string;
	buttonHoverBackground?: string;
	sliderBackgroundColor?: string;
	sliderHoverColor?: string;
	sliderActiveColor?: string;
}

export interface IssueReporterExtensionData {
	name: string;
	publisher: string | undefined;
	version: string;
	id: string;
	isTheme: boolean;
	isBuiltin: boolean;
	displayName: string | undefined;
	repositoryUrl: string | undefined;
	bugsUrl: string | undefined;
	extensionData?: string;
	extensionTemplate?: string;
	data?: string;
	uri?: UriComponents;
	privateUri?: UriComponents;
}

export interface IssueReporterData extends WindowData {
	styles: IssueReporterStyles;
	enabledExtensions: IssueReporterExtensionData[];
	issueType?: IssueType;
	issueSource?: IssueSource;
	extensionId?: string;
	experiments?: string;
	restrictedMode: boolean;
	isUnsupported: boolean;
	githubAccessToken: string;
	issueTitle?: string;
	issueBody?: string;
	data?: string;
	uri?: UriComponents;
	privateUri?: UriComponents;
}

export interface ISettingSearchResult {
	extensionId: string;
	key: string;
	score: number;
}

export const IIssueFormService = createDecorator<IIssueFormService>('issueFormService');

export interface IIssueFormService {
	readonly _serviceBrand: undefined;

	// Used by the issue reporter
	openReporter(data: IssueReporterData): Promise<void>;
	reloadWithExtensionsDisabled(): Promise<void>;
	showConfirmCloseDialog(): Promise<void>;
	showClipboardDialog(): Promise<boolean>;
	sendReporterMenu(extensionId: string): Promise<IssueReporterData | undefined>;
	closeReporter(): Promise<void>;
}

export const IWorkbenchIssueService = createDecorator<IWorkbenchIssueService>('workbenchIssueService');

export interface IWorkbenchIssueService {
	readonly _serviceBrand: undefined;
	openReporter(dataOverrides?: Partial<IssueReporterData>): Promise<void>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/issue/common/issueReporterUtil.ts]---
Location: vscode-main/src/vs/workbench/contrib/issue/common/issueReporterUtil.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { rtrim } from '../../../../base/common/strings.js';

export function normalizeGitHubUrl(url: string): string {
	// If the url has a .git suffix, remove it
	if (url.endsWith('.git')) {
		url = url.substr(0, url.length - 4);
	}

	// Remove trailing slash
	url = rtrim(url, '/');

	if (url.endsWith('/new')) {
		url = rtrim(url, '/new');
	}

	if (url.endsWith('/issues')) {
		url = rtrim(url, '/issues');
	}

	return url;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/issue/electron-browser/issue.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/issue/electron-browser/issue.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../base/common/lifecycle.js';
import { localize, localize2 } from '../../../../nls.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IProcessService } from '../../../../platform/process/common/process.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IQuickAccessRegistry, Extensions as QuickAccessExtensions } from '../../../../platform/quickinput/common/quickAccess.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions, IWorkbenchContributionsRegistry } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { IssueQuickAccess } from '../browser/issueQuickAccess.js';
import '../browser/issueTroubleshoot.js';
import { BaseIssueContribution } from '../common/issue.contribution.js';
import { IIssueFormService, IWorkbenchIssueService, IssueType } from '../common/issue.js';
import { NativeIssueService } from './issueService.js';
import { NativeIssueFormService } from './nativeIssueFormService.js';

//#region Issue Contribution
registerSingleton(IWorkbenchIssueService, NativeIssueService, InstantiationType.Delayed);
registerSingleton(IIssueFormService, NativeIssueFormService, InstantiationType.Delayed);

class NativeIssueContribution extends BaseIssueContribution {

	constructor(
		@IProductService productService: IProductService,
		@IConfigurationService configurationService: IConfigurationService
	) {
		super(productService, configurationService);

		if (!configurationService.getValue<boolean>('telemetry.feedback.enabled')) {
			return;
		}

		if (productService.reportIssueUrl) {
			this._register(registerAction2(ReportPerformanceIssueUsingReporterAction));
		}

		let disposable: IDisposable | undefined;

		const registerQuickAccessProvider = () => {
			disposable = Registry.as<IQuickAccessRegistry>(QuickAccessExtensions.Quickaccess).registerQuickAccessProvider({
				ctor: IssueQuickAccess,
				prefix: IssueQuickAccess.PREFIX,
				contextKey: 'inReportIssuePicker',
				placeholder: localize('tasksQuickAccessPlaceholder', "Type the name of an extension to report on."),
				helpEntries: [{
					description: localize('openIssueReporter', "Open Issue Reporter"),
					commandId: 'workbench.action.openIssueReporter'
				}]
			});
		};

		this._register(configurationService.onDidChangeConfiguration(e => {
			if (!configurationService.getValue<boolean>('extensions.experimental.issueQuickAccess') && disposable) {
				disposable.dispose();
				disposable = undefined;
			} else if (!disposable) {
				registerQuickAccessProvider();
			}
		}));

		if (configurationService.getValue<boolean>('extensions.experimental.issueQuickAccess')) {
			registerQuickAccessProvider();
		}
	}
}
Registry.as<IWorkbenchContributionsRegistry>(Extensions.Workbench).registerWorkbenchContribution(NativeIssueContribution, LifecyclePhase.Restored);

class ReportPerformanceIssueUsingReporterAction extends Action2 {

	static readonly ID = 'workbench.action.reportPerformanceIssueUsingReporter';

	constructor() {
		super({
			id: ReportPerformanceIssueUsingReporterAction.ID,
			title: localize2({ key: 'reportPerformanceIssue', comment: [`Here, 'issue' means problem or bug`] }, "Report Performance Issue..."),
			category: Categories.Help,
			f1: true
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const issueService = accessor.get(IWorkbenchIssueService); // later can just get IIssueFormService

		return issueService.openReporter({ issueType: IssueType.PerformanceIssue });
	}
}

CommandsRegistry.registerCommand('_issues.getSystemStatus', (accessor) => {
	return accessor.get(IProcessService).getSystemStatus();
});

// #endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/issue/electron-browser/issueReporterService.ts]---
Location: vscode-main/src/vs/workbench/contrib/issue/electron-browser/issueReporterService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { $, reset } from '../../../../base/browser/dom.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { CancellationError } from '../../../../base/common/errors.js';
import { Schemas } from '../../../../base/common/network.js';
import { IProductConfiguration } from '../../../../base/common/product.js';
import { joinPath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { isRemoteDiagnosticError } from '../../../../platform/diagnostics/common/diagnostics.js';
import { IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IProcessService } from '../../../../platform/process/common/process.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IUpdateService, StateType } from '../../../../platform/update/common/update.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { applyZoom } from '../../../../platform/window/electron-browser/window.js';
import { IAuthenticationService } from '../../../services/authentication/common/authentication.js';
import { BaseIssueReporterService } from '../browser/baseIssueReporterService.js';
import { IssueReporterData as IssueReporterModelData } from '../browser/issueReporterModel.js';
import { IIssueFormService, IssueReporterData, IssueType } from '../common/issue.js';

// GitHub has let us know that we could up our limit here to 8k. We chose 7500 to play it safe.
// ref https://github.com/microsoft/vscode/issues/159191
const MAX_URL_LENGTH = 7500;

// Github API and issues on web has a limit of 65536. We chose 65500 to play it safe.
// ref https://github.com/github/issues/issues/12858
const MAX_GITHUB_API_LENGTH = 65500;


export class IssueReporter extends BaseIssueReporterService {
	private readonly processService: IProcessService;
	constructor(
		disableExtensions: boolean,
		data: IssueReporterData,
		os: {
			type: string;
			arch: string;
			release: string;
		},
		product: IProductConfiguration,
		window: Window,
		@INativeHostService private readonly nativeHostService: INativeHostService,
		@IIssueFormService issueFormService: IIssueFormService,
		@IProcessService processService: IProcessService,
		@IThemeService themeService: IThemeService,
		@IFileService fileService: IFileService,
		@IFileDialogService fileDialogService: IFileDialogService,
		@IUpdateService private readonly updateService: IUpdateService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IAuthenticationService authenticationService: IAuthenticationService,
		@IOpenerService openerService: IOpenerService
	) {
		super(disableExtensions, data, os, product, window, false, issueFormService, themeService, fileService, fileDialogService, contextMenuService, authenticationService, openerService);
		this.processService = processService;
		this.processService.getSystemInfo().then(info => {
			this.issueReporterModel.update({ systemInfo: info });
			this.receivedSystemInfo = true;

			this.updateSystemInfo(this.issueReporterModel.getData());
			this.updateButtonStates();
		});
		if (this.data.issueType === IssueType.PerformanceIssue) {
			this.processService.getPerformanceInfo().then(info => {
				this.updatePerformanceInfo(info as Partial<IssueReporterData>);
			});
		}

		this.checkForUpdates();
		this.setEventHandlers();
		applyZoom(this.data.zoomLevel, this.window);
		this.updateExperimentsInfo(this.data.experiments);
		this.updateRestrictedMode(this.data.restrictedMode);
		this.updateUnsupportedMode(this.data.isUnsupported);
	}

	private async checkForUpdates(): Promise<void> {
		const updateState = this.updateService.state;
		if (updateState.type === StateType.Ready || updateState.type === StateType.Downloaded) {
			this.needsUpdate = true;
			// eslint-disable-next-line no-restricted-syntax
			const includeAcknowledgement = this.getElementById('version-acknowledgements');
			// eslint-disable-next-line no-restricted-syntax
			const updateBanner = this.getElementById('update-banner');
			if (updateBanner && includeAcknowledgement) {
				includeAcknowledgement.classList.remove('hidden');
				updateBanner.classList.remove('hidden');
				updateBanner.textContent = localize('updateAvailable', "A new version of {0} is available.", this.product.nameLong);
			}
		}
	}

	public override setEventHandlers(): void {
		super.setEventHandlers();

		this.addEventListener('issue-type', 'change', (event: Event) => {
			const issueType = parseInt((<HTMLInputElement>event.target).value);
			this.issueReporterModel.update({ issueType: issueType });
			if (issueType === IssueType.PerformanceIssue && !this.receivedPerformanceInfo) {
				this.processService.getPerformanceInfo().then(info => {
					this.updatePerformanceInfo(info as Partial<IssueReporterData>);
				});
			}

			// Resets placeholder
			// eslint-disable-next-line no-restricted-syntax
			const descriptionTextArea = <HTMLInputElement>this.getElementById('issue-title');
			if (descriptionTextArea) {
				descriptionTextArea.placeholder = localize('undefinedPlaceholder', "Please enter a title");
			}

			this.updateButtonStates();
			this.setSourceOptions();
			this.render();
		});
	}

	public override async submitToGitHub(issueTitle: string, issueBody: string, gitHubDetails: { owner: string; repositoryName: string }): Promise<boolean> {
		if (issueBody.length > MAX_GITHUB_API_LENGTH) {
			const extensionData = this.issueReporterModel.getData().extensionData;
			if (extensionData) {
				issueBody = issueBody.replace(extensionData, '');
				const date = new Date();
				const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
				const formattedTime = date.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
				const fileName = `extensionData_${formattedDate}_${formattedTime}.md`;
				try {
					const downloadPath = await this.fileDialogService.showSaveDialog({
						title: localize('saveExtensionData', "Save Extension Data"),
						availableFileSystems: [Schemas.file],
						defaultUri: joinPath(await this.fileDialogService.defaultFilePath(Schemas.file), fileName),
					});

					if (downloadPath) {
						await this.fileService.writeFile(downloadPath, VSBuffer.fromString(extensionData));
					}
				} catch (e) {
					console.error('Writing extension data to file failed');
					return false;
				}
			} else {
				console.error('Issue body too large to submit to GitHub');
				return false;
			}
		}
		const url = `https://api.github.com/repos/${gitHubDetails.owner}/${gitHubDetails.repositoryName}/issues`;
		const init = {
			method: 'POST',
			body: JSON.stringify({
				title: issueTitle,
				body: issueBody
			}),
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${this.data.githubAccessToken}`
			})
		};

		const response = await fetch(url, init);
		if (!response.ok) {
			console.error('Invalid GitHub URL provided.');
			return false;
		}
		const result = await response.json();
		await this.openerService.open(result.html_url, { openExternal: true });
		this.close();
		return true;
	}

	public override async createIssue(shouldCreate?: boolean, privateUri?: boolean): Promise<boolean> {
		const selectedExtension = this.issueReporterModel.getData().selectedExtension;
		// Short circuit if the extension provides a custom issue handler
		if (this.nonGitHubIssueUrl) {
			const url = this.getExtensionBugsUrl();
			if (url) {
				this.hasBeenSubmitted = true;
				await this.openerService.open(url, { openExternal: true });
				return true;
			}
		}

		if (!this.validateInputs()) {
			// If inputs are invalid, set focus to the first one and add listeners on them
			// to detect further changes
			// eslint-disable-next-line no-restricted-syntax
			const invalidInput = this.window.document.getElementsByClassName('invalid-input');
			if (invalidInput.length) {
				(<HTMLInputElement>invalidInput[0]).focus();
			}

			this.addEventListener('issue-title', 'input', _ => {
				this.validateInput('issue-title');
			});

			this.addEventListener('description', 'input', _ => {
				this.validateInput('description');
			});

			this.addEventListener('issue-source', 'change', _ => {
				this.validateInput('issue-source');
			});

			if (this.issueReporterModel.fileOnExtension()) {
				this.addEventListener('extension-selector', 'change', _ => {
					this.validateInput('extension-selector');
					this.validateInput('description');
				});
			}

			return false;
		}

		this.hasBeenSubmitted = true;

		// eslint-disable-next-line no-restricted-syntax
		const issueTitle = (<HTMLInputElement>this.getElementById('issue-title')).value;
		const issueBody = this.issueReporterModel.serialize();

		let issueUrl = privateUri ? this.getPrivateIssueUrl() : this.getIssueUrl();
		if (!issueUrl && selectedExtension?.uri) {
			const uri = URI.revive(selectedExtension.uri);
			issueUrl = uri.toString();
		} else if (!issueUrl) {
			console.error(`No ${privateUri ? 'private ' : ''}issue url found`);
			return false;
		}

		const gitHubDetails = this.parseGitHubUrl(issueUrl);

		// eslint-disable-next-line no-restricted-syntax
		const baseUrl = this.getIssueUrlWithTitle((<HTMLInputElement>this.getElementById('issue-title')).value, issueUrl);
		let url = baseUrl + `&body=${encodeURIComponent(issueBody)}`;

		url = this.addTemplateToUrl(url, gitHubDetails?.owner, gitHubDetails?.repositoryName);

		if (this.data.githubAccessToken && gitHubDetails && shouldCreate) {
			if (await this.submitToGitHub(issueTitle, issueBody, gitHubDetails)) {
				return true;
			}
		}

		try {
			if (url.length > MAX_URL_LENGTH || issueBody.length > MAX_GITHUB_API_LENGTH) {
				url = await this.writeToClipboard(baseUrl, issueBody);
				url = this.addTemplateToUrl(url, gitHubDetails?.owner, gitHubDetails?.repositoryName);
			}
		} catch (_) {
			console.error('Writing to clipboard failed');
			return false;
		}

		await this.openerService.open(url, { openExternal: true });
		return true;
	}

	public override async writeToClipboard(baseUrl: string, issueBody: string): Promise<string> {
		const shouldWrite = await this.issueFormService.showClipboardDialog();
		if (!shouldWrite) {
			throw new CancellationError();
		}

		await this.nativeHostService.writeClipboardText(issueBody);

		return baseUrl + `&body=${encodeURIComponent(localize('pasteData', "We have written the needed data into your clipboard because it was too large to send. Please paste."))}`;
	}

	private updateSystemInfo(state: IssueReporterModelData) {
		// eslint-disable-next-line no-restricted-syntax
		const target = this.window.document.querySelector<HTMLElement>('.block-system .block-info');

		if (target) {
			const systemInfo = state.systemInfo!;
			const renderedDataTable = $('table', undefined,
				$('tr', undefined,
					$('td', undefined, 'CPUs'),
					$('td', undefined, systemInfo.cpus || '')
				),
				$('tr', undefined,
					$('td', undefined, 'GPU Status' as string),
					$('td', undefined, Object.keys(systemInfo.gpuStatus).map(key => `${key}: ${systemInfo.gpuStatus[key]}`).join('\n'))
				),
				$('tr', undefined,
					$('td', undefined, 'Load (avg)' as string),
					$('td', undefined, systemInfo.load || '')
				),
				$('tr', undefined,
					$('td', undefined, 'Memory (System)' as string),
					$('td', undefined, systemInfo.memory)
				),
				$('tr', undefined,
					$('td', undefined, 'Process Argv' as string),
					$('td', undefined, systemInfo.processArgs)
				),
				$('tr', undefined,
					$('td', undefined, 'Screen Reader' as string),
					$('td', undefined, systemInfo.screenReader)
				),
				$('tr', undefined,
					$('td', undefined, 'VM'),
					$('td', undefined, systemInfo.vmHint)
				)
			);
			reset(target, renderedDataTable);

			systemInfo.remoteData.forEach(remote => {
				target.appendChild($<HTMLHRElement>('hr'));
				if (isRemoteDiagnosticError(remote)) {
					const remoteDataTable = $('table', undefined,
						$('tr', undefined,
							$('td', undefined, 'Remote'),
							$('td', undefined, remote.hostName)
						),
						$('tr', undefined,
							$('td', undefined, ''),
							$('td', undefined, remote.errorMessage)
						)
					);
					target.appendChild(remoteDataTable);
				} else {
					const remoteDataTable = $('table', undefined,
						$('tr', undefined,
							$('td', undefined, 'Remote'),
							$('td', undefined, remote.latency ? `${remote.hostName} (latency: ${remote.latency.current.toFixed(2)}ms last, ${remote.latency.average.toFixed(2)}ms average)` : remote.hostName)
						),
						$('tr', undefined,
							$('td', undefined, 'OS'),
							$('td', undefined, remote.machineInfo.os)
						),
						$('tr', undefined,
							$('td', undefined, 'CPUs'),
							$('td', undefined, remote.machineInfo.cpus || '')
						),
						$('tr', undefined,
							$('td', undefined, 'Memory (System)' as string),
							$('td', undefined, remote.machineInfo.memory)
						),
						$('tr', undefined,
							$('td', undefined, 'VM'),
							$('td', undefined, remote.machineInfo.vmHint)
						)
					);
					target.appendChild(remoteDataTable);
				}
			});
		}
	}

	private updateRestrictedMode(restrictedMode: boolean) {
		this.issueReporterModel.update({ restrictedMode });
	}

	private updateUnsupportedMode(isUnsupported: boolean) {
		this.issueReporterModel.update({ isUnsupported });
	}

	private updateExperimentsInfo(experimentInfo: string | undefined) {
		this.issueReporterModel.update({ experimentInfo });
		// eslint-disable-next-line no-restricted-syntax
		const target = this.window.document.querySelector<HTMLElement>('.block-experiments .block-info');
		if (target) {
			target.textContent = experimentInfo ? experimentInfo : localize('noCurrentExperiments', "No current experiments.");
		}
	}
}
```

--------------------------------------------------------------------------------

````

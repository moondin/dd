---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 344
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 344 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/browser/chatAttachmentWidgets.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatAttachmentWidgets.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { $ } from '../../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { StandardMouseEvent } from '../../../../base/browser/mouseEvent.js';
import { Button } from '../../../../base/browser/ui/button/button.js';
import { HoverStyle, IDelayedHoverOptions, type IHoverLifecycleOptions, type IHoverOptions } from '../../../../base/browser/ui/hover/hover.js';
import { createInstantHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { HoverPosition } from '../../../../base/browser/ui/hover/hoverWidget.js';
import { Codicon } from '../../../../base/common/codicons.js';
import * as event from '../../../../base/common/event.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { basename, dirname } from '../../../../base/common/path.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { IRange } from '../../../../editor/common/core/range.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { LanguageFeatureRegistry } from '../../../../editor/common/languageFeatureRegistry.js';
import { Location, SymbolKind } from '../../../../editor/common/languages.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { ILanguageFeaturesService } from '../../../../editor/common/services/languageFeatures.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { localize } from '../../../../nls.js';
import { getFlatContextMenuActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IMenuService, MenuId } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IContextKey, IContextKeyService, IScopedContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { fillInSymbolsDragData } from '../../../../platform/dnd/browser/dnd.js';
import { IOpenEditorOptions, registerOpenEditorListeners } from '../../../../platform/editor/browser/editor.js';
import { ITextEditorOptions } from '../../../../platform/editor/common/editor.js';
import { FileKind, IFileService } from '../../../../platform/files/common/files.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IMarkdownRendererService } from '../../../../platform/markdown/browser/markdownRenderer.js';
import { IOpenerService, OpenInternalOptions } from '../../../../platform/opener/common/opener.js';
import { FolderThemeIcon, IThemeService } from '../../../../platform/theme/common/themeService.js';
import { fillEditorsDragData } from '../../../browser/dnd.js';
import { IFileLabelOptions, IResourceLabel, ResourceLabels } from '../../../browser/labels.js';
import { ResourceContextKey } from '../../../common/contextkeys.js';
import { IEditorService, SIDE_GROUP } from '../../../services/editor/common/editorService.js';
import { IPreferencesService } from '../../../services/preferences/common/preferences.js';
import { revealInSideBarCommand } from '../../files/browser/fileActions.contribution.js';
import { CellUri } from '../../notebook/common/notebookCommon.js';
import { INotebookService } from '../../notebook/common/notebookService.js';
import { toHistoryItemHoverContent } from '../../scm/browser/scmHistory.js';
import { getHistoryItemEditorTitle } from '../../scm/browser/util.js';
import { ITerminalService } from '../../terminal/browser/terminal.js';
import { IChatContentReference } from '../common/chatService.js';
import { IChatRequestPasteVariableEntry, IChatRequestVariableEntry, IElementVariableEntry, INotebookOutputVariableEntry, IPromptFileVariableEntry, IPromptTextVariableEntry, ISCMHistoryItemVariableEntry, OmittedState, PromptFileVariableKind, ChatRequestToolReferenceEntry, ISCMHistoryItemChangeVariableEntry, ISCMHistoryItemChangeRangeVariableEntry, ITerminalVariableEntry } from '../common/chatVariableEntries.js';
import { ILanguageModelChatMetadataAndIdentifier, ILanguageModelsService } from '../common/languageModels.js';
import { ILanguageModelToolsService, ToolSet } from '../common/languageModelToolsService.js';
import { getCleanPromptName } from '../common/promptSyntax/config/promptFileLocations.js';

const commonHoverOptions: Partial<IHoverOptions> = {
	style: HoverStyle.Pointer,
	position: {
		hoverPosition: HoverPosition.BELOW
	},
	trapFocus: true,
};
const commonHoverLifecycleOptions: IHoverLifecycleOptions = {
	groupId: 'chat-attachments',
};

abstract class AbstractChatAttachmentWidget extends Disposable {
	public readonly element: HTMLElement;
	public readonly label: IResourceLabel;

	private readonly _onDidDelete: event.Emitter<Event> = this._register(new event.Emitter<Event>());
	get onDidDelete(): event.Event<Event> {
		return this._onDidDelete.event;
	}

	private readonly _onDidOpen: event.Emitter<void> = this._register(new event.Emitter<void>());
	get onDidOpen(): event.Event<void> {
		return this._onDidOpen.event;
	}

	constructor(
		protected readonly attachment: IChatRequestVariableEntry,
		private readonly options: { shouldFocusClearButton: boolean; supportsDeletion: boolean },
		container: HTMLElement,
		contextResourceLabels: ResourceLabels,
		protected readonly currentLanguageModel: ILanguageModelChatMetadataAndIdentifier | undefined,
		@ICommandService protected readonly commandService: ICommandService,
		@IOpenerService protected readonly openerService: IOpenerService,
		@ITerminalService protected readonly terminalService?: ITerminalService,
	) {
		super();
		this.element = dom.append(container, $('.chat-attached-context-attachment.show-file-icons'));
		this.attachClearButton();
		this.label = contextResourceLabels.create(this.element, { supportIcons: true, hoverTargetOverride: this.element });
		this._register(this.label);
		this.element.tabIndex = 0;
		this.element.role = 'button';

		// Add middle-click support for removal
		this._register(dom.addDisposableListener(this.element, dom.EventType.AUXCLICK, (e: MouseEvent) => {
			if (e.button === 1 /* Middle Button */ && this.options.supportsDeletion && !this.attachment.range) {
				e.preventDefault();
				e.stopPropagation();
				this._onDidDelete.fire(e);
			}
		}));
	}

	protected modelSupportsVision() {
		return modelSupportsVision(this.currentLanguageModel);
	}

	protected attachClearButton() {

		if (this.attachment.range || !this.options.supportsDeletion) {
			// no clear button for attachments with ranges because range means
			// referenced from prompt
			return;
		}

		const clearButton = new Button(this.element, {
			supportIcons: true,
			hoverDelegate: createInstantHoverDelegate(),
			title: localize('chat.attachment.clearButton', "Remove from context")
		});
		clearButton.element.tabIndex = -1;
		clearButton.icon = Codicon.close;
		this._register(clearButton);
		this._register(event.Event.once(clearButton.onDidClick)((e) => {
			this._onDidDelete.fire(e);
		}));
		this._register(dom.addStandardDisposableListener(this.element, dom.EventType.KEY_DOWN, e => {
			if (e.keyCode === KeyCode.Backspace || e.keyCode === KeyCode.Delete) {
				this._onDidDelete.fire(e.browserEvent);
			}
		}));
	}

	protected addResourceOpenHandlers(resource: URI, range: IRange | undefined): void {
		this.element.style.cursor = 'pointer';

		this._register(registerOpenEditorListeners(this.element, async options => {
			if (this.attachment.kind === 'directory') {
				await this.openResource(resource, options, true);
			} else {
				await this.openResource(resource, options, false, range);
			}
		}));
	}

	protected async openResource(resource: URI, options: Partial<IOpenEditorOptions>, isDirectory: true): Promise<void>;
	protected async openResource(resource: URI, options: Partial<IOpenEditorOptions>, isDirectory: false, range: IRange | undefined): Promise<void>;
	protected async openResource(resource: URI, openOptions: Partial<IOpenEditorOptions>, isDirectory?: boolean, range?: IRange): Promise<void> {
		if (isDirectory) {
			// Reveal Directory in explorer
			this.commandService.executeCommand(revealInSideBarCommand.id, resource);
			return;
		}

		if (resource.scheme === Schemas.vscodeTerminal) {
			this.terminalService?.openResource(resource);
			return;
		}

		// Open file in editor
		const openTextEditorOptions: ITextEditorOptions | undefined = range ? { selection: range } : undefined;
		const options: OpenInternalOptions = {
			fromUserGesture: true,
			openToSide: openOptions.openToSide,
			editorOptions: {
				...openTextEditorOptions,
				...openOptions.editorOptions
			},
		};

		await this.openerService.open(resource, options);
		this._onDidOpen.fire();
		this.element.focus();
	}
}

function modelSupportsVision(currentLanguageModel: ILanguageModelChatMetadataAndIdentifier | undefined) {
	return currentLanguageModel?.metadata.capabilities?.vision ?? false;
}

export class FileAttachmentWidget extends AbstractChatAttachmentWidget {

	constructor(
		resource: URI,
		range: IRange | undefined,
		attachment: IChatRequestVariableEntry,
		correspondingContentReference: IChatContentReference | undefined,
		currentLanguageModel: ILanguageModelChatMetadataAndIdentifier | undefined,
		options: { shouldFocusClearButton: boolean; supportsDeletion: boolean },
		container: HTMLElement,
		contextResourceLabels: ResourceLabels,
		@ICommandService commandService: ICommandService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService private readonly themeService: IThemeService,
		@IHoverService private readonly hoverService: IHoverService,
		@ILanguageModelsService private readonly languageModelsService: ILanguageModelsService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super(attachment, options, container, contextResourceLabels, currentLanguageModel, commandService, openerService);

		const fileBasename = basename(resource.path);
		const fileDirname = dirname(resource.path);
		const friendlyName = `${fileBasename} ${fileDirname}`;
		let ariaLabel = range ? localize('chat.fileAttachmentWithRange', "Attached file, {0}, line {1} to line {2}", friendlyName, range.startLineNumber, range.endLineNumber) : localize('chat.fileAttachment', "Attached file, {0}", friendlyName);

		if (attachment.omittedState === OmittedState.Full) {
			ariaLabel = localize('chat.omittedFileAttachment', "Omitted this file: {0}", attachment.name);
			this.renderOmittedWarning(friendlyName, ariaLabel);
		} else {
			const fileOptions: IFileLabelOptions = { hidePath: true, title: correspondingContentReference?.options?.status?.description };
			this.label.setFile(resource, attachment.kind === 'file' ? {
				...fileOptions,
				fileKind: FileKind.FILE,
				range,
			} : {
				...fileOptions,
				fileKind: FileKind.FOLDER,
				icon: !this.themeService.getFileIconTheme().hasFolderIcons ? FolderThemeIcon : undefined
			});
		}

		this.element.ariaLabel = ariaLabel;

		this.instantiationService.invokeFunction(accessor => {
			this._register(hookUpResourceAttachmentDragAndContextMenu(accessor, this.element, resource));
		});
		this.addResourceOpenHandlers(resource, range);
	}

	private renderOmittedWarning(friendlyName: string, ariaLabel: string) {
		const pillIcon = dom.$('div.chat-attached-context-pill', {}, dom.$('span.codicon.codicon-warning'));
		const textLabel = dom.$('span.chat-attached-context-custom-text', {}, friendlyName);
		this.element.appendChild(pillIcon);
		this.element.appendChild(textLabel);

		const hoverElement = dom.$('div.chat-attached-context-hover');
		hoverElement.setAttribute('aria-label', ariaLabel);
		this.element.classList.add('warning');

		hoverElement.textContent = localize('chat.fileAttachmentHover', "{0} does not support this file type.", this.currentLanguageModel ? this.languageModelsService.lookupLanguageModel(this.currentLanguageModel.identifier)?.name : this.currentLanguageModel ?? 'This model');
		this._register(this.hoverService.setupDelayedHover(this.element, {
			...commonHoverOptions,
			content: hoverElement,
		}, commonHoverLifecycleOptions));
	}
}


export class TerminalCommandAttachmentWidget extends AbstractChatAttachmentWidget {

	constructor(
		attachment: ITerminalVariableEntry,
		currentLanguageModel: ILanguageModelChatMetadataAndIdentifier | undefined,
		options: { shouldFocusClearButton: boolean; supportsDeletion: boolean },
		container: HTMLElement,
		contextResourceLabels: ResourceLabels,
		@ICommandService commandService: ICommandService,
		@IOpenerService openerService: IOpenerService,
		@IHoverService private readonly hoverService: IHoverService,
		@ITerminalService protected override readonly terminalService: ITerminalService,
	) {
		super(attachment, options, container, contextResourceLabels, currentLanguageModel, commandService, openerService, terminalService);

		const ariaLabel = localize('chat.terminalCommand', "Terminal command, {0}", attachment.command);
		const clickHandler = () => this.openResource(attachment.resource, { editorOptions: { preserveFocus: true } }, false, undefined);

		this._register(createTerminalCommandElements(this.element, attachment, ariaLabel, this.hoverService, clickHandler));

		this._register(dom.addDisposableListener(this.element, dom.EventType.KEY_DOWN, async (e: KeyboardEvent) => {
			const event = new StandardKeyboardEvent(e);
			if (event.equals(KeyCode.Enter) || event.equals(KeyCode.Space)) {
				dom.EventHelper.stop(e, true);
				await clickHandler();
			}
		}));
	}
}

const enum TerminalConstants {
	MaxAttachmentOutputLineCount = 5,
	MaxAttachmentOutputLineLength = 80,
}

function createTerminalCommandElements(
	element: HTMLElement,
	attachment: ITerminalVariableEntry,
	ariaLabel: string,
	hoverService: IHoverService,
	clickHandler: () => Promise<void>
): IDisposable {
	const disposable = new DisposableStore();
	element.ariaLabel = ariaLabel;
	element.style.cursor = 'pointer';

	const terminalIconSpan = dom.$('span');
	terminalIconSpan.classList.add(...ThemeIcon.asClassNameArray(Codicon.terminal));
	const pillIcon = dom.$('div.chat-attached-context-pill', {}, terminalIconSpan);
	const textLabel = dom.$('span.chat-attached-context-custom-text', {}, attachment.command);
	element.appendChild(pillIcon);
	element.appendChild(textLabel);

	disposable.add(dom.addDisposableListener(element, dom.EventType.CLICK, e => {
		e.preventDefault();
		e.stopPropagation();
		clickHandler();
	}));

	disposable.add(hoverService.setupDelayedHover(element, () => getHoverContent(ariaLabel, attachment), commonHoverLifecycleOptions));
	return disposable;
}

function getHoverContent(ariaLabel: string, attachment: ITerminalVariableEntry): IDelayedHoverOptions {
	{
		const hoverElement = dom.$('div.chat-attached-context-hover');
		hoverElement.setAttribute('aria-label', ariaLabel);

		const commandTitle = dom.$('div', {}, typeof attachment.exitCode === 'number'
			? localize('chat.terminalCommandHoverCommandTitleExit', "Command: {0}, exit code: {1}", attachment.command, attachment.exitCode)
			: localize('chat.terminalCommandHoverCommandTitle', "Command"));
		commandTitle.classList.add('attachment-additional-info');
		const commandBlock = dom.$('pre.chat-terminal-command-block');
		hoverElement.append(commandTitle, commandBlock);

		if (attachment.output && attachment.output.trim().length > 0) {
			const outputTitle = dom.$('div', {}, localize('chat.terminalCommandHoverOutputTitle', "Output:"));
			outputTitle.classList.add('attachment-additional-info');
			const outputBlock = dom.$('pre.chat-terminal-command-output');
			const fullOutputLines = attachment.output.split('\n');
			const hoverOutputLines = [];
			for (const line of fullOutputLines) {
				if (hoverOutputLines.length >= TerminalConstants.MaxAttachmentOutputLineCount) {
					hoverOutputLines.push('...');
					break;
				}
				const trimmed = line.trim();
				if (trimmed.length === 0) {
					continue;
				}
				if (trimmed.length > TerminalConstants.MaxAttachmentOutputLineLength) {
					hoverOutputLines.push(`${trimmed.slice(0, TerminalConstants.MaxAttachmentOutputLineLength)}...`);
				} else {
					hoverOutputLines.push(trimmed);
				}
			}
			outputBlock.textContent = hoverOutputLines.join('\n');
			hoverElement.append(outputTitle, outputBlock);
		}

		return {
			...commonHoverOptions,
			content: hoverElement,
		};
	}
}

export class ImageAttachmentWidget extends AbstractChatAttachmentWidget {

	constructor(
		resource: URI | undefined,
		attachment: IChatRequestVariableEntry,
		currentLanguageModel: ILanguageModelChatMetadataAndIdentifier | undefined,
		options: { shouldFocusClearButton: boolean; supportsDeletion: boolean },
		container: HTMLElement,
		contextResourceLabels: ResourceLabels,
		@ICommandService commandService: ICommandService,
		@IOpenerService openerService: IOpenerService,
		@IHoverService private readonly hoverService: IHoverService,
		@ILanguageModelsService private readonly languageModelsService: ILanguageModelsService,
		@IInstantiationService instantiationService: IInstantiationService,
		@ILabelService private readonly labelService: ILabelService,
	) {
		super(attachment, options, container, contextResourceLabels, currentLanguageModel, commandService, openerService);

		let ariaLabel: string;
		if (attachment.omittedState === OmittedState.Full) {
			ariaLabel = localize('chat.omittedImageAttachment', "Omitted this image: {0}", attachment.name);
		} else if (attachment.omittedState === OmittedState.Partial) {
			ariaLabel = localize('chat.partiallyOmittedImageAttachment', "Partially omitted this image: {0}", attachment.name);
		} else {
			ariaLabel = localize('chat.imageAttachment', "Attached image, {0}", attachment.name);
		}

		const ref = attachment.references?.[0]?.reference;
		resource = ref && URI.isUri(ref) ? ref : undefined;
		const clickHandler = async () => {
			if (resource) {
				await this.openResource(resource, { editorOptions: { preserveFocus: true } }, false, undefined);
			}
		};

		const currentLanguageModelName = this.currentLanguageModel ? this.languageModelsService.lookupLanguageModel(this.currentLanguageModel.identifier)?.name ?? this.currentLanguageModel.identifier : 'Current model';

		const fullName = resource ? this.labelService.getUriLabel(resource) : (attachment.fullName || attachment.name);
		this._register(createImageElements(resource, attachment.name, fullName, this.element, attachment.value as Uint8Array, this.hoverService, ariaLabel, currentLanguageModelName, clickHandler, this.currentLanguageModel, attachment.omittedState));

		if (resource) {
			this.addResourceOpenHandlers(resource, undefined);
			instantiationService.invokeFunction(accessor => {
				this._register(hookUpResourceAttachmentDragAndContextMenu(accessor, this.element, resource));
			});
		}
	}
}

function createImageElements(resource: URI | undefined, name: string, fullName: string,
	element: HTMLElement,
	buffer: ArrayBuffer | Uint8Array,
	hoverService: IHoverService, ariaLabel: string,
	currentLanguageModelName: string | undefined,
	clickHandler: () => void,
	currentLanguageModel?: ILanguageModelChatMetadataAndIdentifier,
	omittedState?: OmittedState): IDisposable {

	const disposable = new DisposableStore();
	if (omittedState === OmittedState.Partial) {
		element.classList.add('partial-warning');
	}

	element.ariaLabel = ariaLabel;
	element.style.position = 'relative';

	if (resource) {
		element.style.cursor = 'pointer';
		disposable.add(dom.addDisposableListener(element, 'click', clickHandler));
	}
	const supportsVision = modelSupportsVision(currentLanguageModel);
	const pillIcon = dom.$('div.chat-attached-context-pill', {}, dom.$(supportsVision ? 'span.codicon.codicon-file-media' : 'span.codicon.codicon-warning'));
	const textLabel = dom.$('span.chat-attached-context-custom-text', {}, name);
	element.appendChild(pillIcon);
	element.appendChild(textLabel);

	const hoverElement = dom.$('div.chat-attached-context-hover');
	hoverElement.setAttribute('aria-label', ariaLabel);

	if ((!supportsVision && currentLanguageModel) || omittedState === OmittedState.Full) {
		element.classList.add('warning');
		hoverElement.textContent = localize('chat.imageAttachmentHover', "{0} does not support images.", currentLanguageModelName ?? 'This model');
		disposable.add(hoverService.setupDelayedHover(element, {
			content: hoverElement,
			style: HoverStyle.Pointer,
		}));
	} else {
		disposable.add(hoverService.setupDelayedHover(element, {
			content: hoverElement,
			style: HoverStyle.Pointer,
		}));

		const blob = new Blob([buffer as Uint8Array<ArrayBuffer>], { type: 'image/png' });
		const url = URL.createObjectURL(blob);
		const pillImg = dom.$('img.chat-attached-context-pill-image', { src: url, alt: '' });
		const pill = dom.$('div.chat-attached-context-pill', {}, pillImg);

		// eslint-disable-next-line no-restricted-syntax
		const existingPill = element.querySelector('.chat-attached-context-pill');
		if (existingPill) {
			existingPill.replaceWith(pill);
		}

		const hoverImage = dom.$('img.chat-attached-context-image', { src: url, alt: '' });
		const imageContainer = dom.$('div.chat-attached-context-image-container', {}, hoverImage);
		hoverElement.appendChild(imageContainer);

		if (resource) {
			const urlContainer = dom.$('a.chat-attached-context-url', {}, omittedState === OmittedState.Partial ? localize('chat.imageAttachmentWarning', "This GIF was partially omitted - current frame will be sent.") : fullName);
			const separator = dom.$('div.chat-attached-context-url-separator');
			disposable.add(dom.addDisposableListener(urlContainer, 'click', () => clickHandler()));
			hoverElement.append(separator, urlContainer);
		}

		hoverImage.onload = () => { URL.revokeObjectURL(url); };
		hoverImage.onerror = () => {
			// reset to original icon on error or invalid image
			const pillIcon = dom.$('div.chat-attached-context-pill', {}, dom.$('span.codicon.codicon-file-media'));
			const pill = dom.$('div.chat-attached-context-pill', {}, pillIcon);
			// eslint-disable-next-line no-restricted-syntax
			const existingPill = element.querySelector('.chat-attached-context-pill');
			if (existingPill) {
				existingPill.replaceWith(pill);
			}
		};
	}
	return disposable;
}

export class PasteAttachmentWidget extends AbstractChatAttachmentWidget {

	constructor(
		attachment: IChatRequestPasteVariableEntry,
		currentLanguageModel: ILanguageModelChatMetadataAndIdentifier | undefined,
		options: { shouldFocusClearButton: boolean; supportsDeletion: boolean },
		container: HTMLElement,
		contextResourceLabels: ResourceLabels,
		@ICommandService commandService: ICommandService,
		@IOpenerService openerService: IOpenerService,
		@IHoverService private readonly hoverService: IHoverService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super(attachment, options, container, contextResourceLabels, currentLanguageModel, commandService, openerService);

		const ariaLabel = localize('chat.attachment', "Attached context, {0}", attachment.name);
		this.element.ariaLabel = ariaLabel;

		const classNames = ['file-icon', `${attachment.language}-lang-file-icon`];
		let resource: URI | undefined;
		let range: IRange | undefined;

		if (attachment.copiedFrom) {
			resource = attachment.copiedFrom.uri;
			range = attachment.copiedFrom.range;
			const filename = basename(resource.path);
			this.label.setLabel(filename, undefined, { extraClasses: classNames });
		} else {
			this.label.setLabel(attachment.fileName, undefined, { extraClasses: classNames });
		}
		this.element.appendChild(dom.$('span.attachment-additional-info', {}, `Pasted ${attachment.pastedLines}`));

		this.element.style.position = 'relative';

		const sourceUri = attachment.copiedFrom?.uri;
		const hoverContent = new MarkdownString(`${sourceUri ? this.instantiationService.invokeFunction(accessor => accessor.get(ILabelService).getUriLabel(sourceUri, { relative: true })) : attachment.fileName}\n\n---\n\n\`\`\`${attachment.language}\n\n${attachment.code}\n\`\`\``);
		this._register(this.hoverService.setupDelayedHover(this.element, {
			...commonHoverOptions,
			content: hoverContent,
		}, commonHoverLifecycleOptions));

		const copiedFromResource = attachment.copiedFrom?.uri;
		if (copiedFromResource) {
			this._register(this.instantiationService.invokeFunction(hookUpResourceAttachmentDragAndContextMenu, this.element, copiedFromResource));
			this.addResourceOpenHandlers(copiedFromResource, range);
		}
	}
}

export class DefaultChatAttachmentWidget extends AbstractChatAttachmentWidget {
	constructor(
		resource: URI | undefined,
		range: IRange | undefined,
		attachment: IChatRequestVariableEntry,
		correspondingContentReference: IChatContentReference | undefined,
		currentLanguageModel: ILanguageModelChatMetadataAndIdentifier | undefined,
		options: { shouldFocusClearButton: boolean; supportsDeletion: boolean },
		container: HTMLElement,
		contextResourceLabels: ResourceLabels,
		@ICommandService commandService: ICommandService,
		@IOpenerService openerService: IOpenerService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super(attachment, options, container, contextResourceLabels, currentLanguageModel, commandService, openerService);

		const attachmentLabel = attachment.fullName ?? attachment.name;
		const withIcon = attachment.icon?.id ? `$(${attachment.icon.id})\u00A0${attachmentLabel}` : attachmentLabel;
		this.label.setLabel(withIcon, correspondingContentReference?.options?.status?.description);
		this.element.ariaLabel = localize('chat.attachment', "Attached context, {0}", attachment.name);

		if (attachment.kind === 'diagnostic') {
			if (attachment.filterUri) {
				resource = attachment.filterUri ? URI.revive(attachment.filterUri) : undefined;
				range = attachment.filterRange;
			} else {
				this.element.style.cursor = 'pointer';
				this._register(dom.addDisposableListener(this.element, dom.EventType.CLICK, () => {
					this.commandService.executeCommand('workbench.panel.markers.view.focus');
				}));
			}
		}

		if (attachment.kind === 'symbol') {
			const scopedContextKeyService = this._register(this.contextKeyService.createScoped(this.element));
			this._register(this.instantiationService.invokeFunction(hookUpSymbolAttachmentDragAndContextMenu, this.element, scopedContextKeyService, { ...attachment, kind: attachment.symbolKind }, MenuId.ChatInputSymbolAttachmentContext));
		}

		if (resource) {
			this.addResourceOpenHandlers(resource, range);
		}
	}
}

export class PromptFileAttachmentWidget extends AbstractChatAttachmentWidget {

	private hintElement: HTMLElement;

	constructor(
		attachment: IPromptFileVariableEntry,
		currentLanguageModel: ILanguageModelChatMetadataAndIdentifier | undefined,
		options: { shouldFocusClearButton: boolean; supportsDeletion: boolean },
		container: HTMLElement,
		contextResourceLabels: ResourceLabels,
		@ICommandService commandService: ICommandService,
		@IOpenerService openerService: IOpenerService,
		@ILabelService private readonly labelService: ILabelService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super(attachment, options, container, contextResourceLabels, currentLanguageModel, commandService, openerService);


		this.hintElement = dom.append(this.element, dom.$('span.prompt-type'));

		this.updateLabel(attachment);

		this.instantiationService.invokeFunction(accessor => {
			this._register(hookUpResourceAttachmentDragAndContextMenu(accessor, this.element, attachment.value));
		});
		this.addResourceOpenHandlers(attachment.value, undefined);
	}

	private updateLabel(attachment: IPromptFileVariableEntry) {
		const resource = attachment.value;
		const fileBasename = basename(resource.path);
		const fileDirname = dirname(resource.path);
		const friendlyName = `${fileBasename} ${fileDirname}`;
		const isPrompt = attachment.id.startsWith(PromptFileVariableKind.PromptFile);
		const ariaLabel = isPrompt
			? localize('chat.promptAttachment', "Prompt file, {0}", friendlyName)
			: localize('chat.instructionsAttachment', "Instructions attachment, {0}", friendlyName);
		const typeLabel = isPrompt
			? localize('prompt', "Prompt")
			: localize('instructions', "Instructions");

		const title = this.labelService.getUriLabel(resource) + (attachment.originLabel ? `\n${attachment.originLabel}` : '');

		//const { topError } = this.promptFile;
		this.element.classList.remove('warning', 'error');

		// if there are some errors/warning during the process of resolving
		// attachment references (including all the nested child references),
		// add the issue details in the hover title for the attachment, one
		// error/warning at a time because there is a limited space available
		// if (topError) {
		// 	const { errorSubject: subject } = topError;
		// 	const isError = (subject === 'root');
		// 	this.element.classList.add((isError) ? 'error' : 'warning');

		// 	const severity = (isError)
		// 		? localize('error', "Error")
		// 		: localize('warning', "Warning");

		// 	title += `\n[${severity}]: ${topError.localizedMessage}`;
		// }

		const fileWithoutExtension = getCleanPromptName(resource);
		this.label.setFile(URI.file(fileWithoutExtension), {
			fileKind: FileKind.FILE,
			hidePath: true,
			range: undefined,
			title,
			icon: ThemeIcon.fromId(Codicon.bookmark.id),
			extraClasses: [],
		});

		this.hintElement.innerText = typeLabel;


		this.element.ariaLabel = ariaLabel;
	}
}

export class PromptTextAttachmentWidget extends AbstractChatAttachmentWidget {

	constructor(
		attachment: IPromptTextVariableEntry,
		currentLanguageModel: ILanguageModelChatMetadataAndIdentifier | undefined,
		options: { shouldFocusClearButton: boolean; supportsDeletion: boolean },
		container: HTMLElement,
		contextResourceLabels: ResourceLabels,
		@ICommandService commandService: ICommandService,
		@IOpenerService openerService: IOpenerService,
		@IPreferencesService preferencesService: IPreferencesService,
		@IHoverService hoverService: IHoverService
	) {
		super(attachment, options, container, contextResourceLabels, currentLanguageModel, commandService, openerService);

		if (attachment.settingId) {
			const openSettings = () => preferencesService.openSettings({ jsonEditor: false, query: `@id:${attachment.settingId}` });

			this.element.style.cursor = 'pointer';
			this._register(dom.addDisposableListener(this.element, dom.EventType.CLICK, async (e: MouseEvent) => {
				dom.EventHelper.stop(e, true);
				openSettings();
			}));

			this._register(dom.addDisposableListener(this.element, dom.EventType.KEY_DOWN, async (e: KeyboardEvent) => {
				const event = new StandardKeyboardEvent(e);
				if (event.equals(KeyCode.Enter) || event.equals(KeyCode.Space)) {
					dom.EventHelper.stop(e, true);
					openSettings();
				}
			}));
		}
		this.label.setLabel(localize('instructions.label', 'Additional Instructions'), undefined, undefined);

		this._register(hoverService.setupDelayedHover(this.element, {
			...commonHoverOptions,
			content: attachment.value,
		}, commonHoverLifecycleOptions));
	}
}


export class ToolSetOrToolItemAttachmentWidget extends AbstractChatAttachmentWidget {
	constructor(
		attachment: ChatRequestToolReferenceEntry,
		currentLanguageModel: ILanguageModelChatMetadataAndIdentifier | undefined,
		options: { shouldFocusClearButton: boolean; supportsDeletion: boolean },
		container: HTMLElement,
		contextResourceLabels: ResourceLabels,
		@ILanguageModelToolsService toolsService: ILanguageModelToolsService,
		@ICommandService commandService: ICommandService,
		@IOpenerService openerService: IOpenerService,
		@IHoverService hoverService: IHoverService
	) {
		super(attachment, options, container, contextResourceLabels, currentLanguageModel, commandService, openerService);


		const toolOrToolSet = Iterable.find(toolsService.getTools(), tool => tool.id === attachment.id) ?? Iterable.find(toolsService.toolSets.get(), toolSet => toolSet.id === attachment.id);

		let name = attachment.name;
		const icon = attachment.icon ?? Codicon.tools;

		if (toolOrToolSet instanceof ToolSet) {
			name = toolOrToolSet.referenceName;
		} else if (toolOrToolSet) {
			name = toolOrToolSet.toolReferenceName ?? name;
		}

		this.label.setLabel(`$(${icon.id})\u00A0${name}`, undefined);

		this.element.style.cursor = 'pointer';
		this.element.ariaLabel = localize('chat.attachment', "Attached context, {0}", name);

		let hoverContent: string | undefined;

		if (toolOrToolSet instanceof ToolSet) {
			hoverContent = localize('toolset', "{0} - {1}", toolOrToolSet.description ?? toolOrToolSet.referenceName, toolOrToolSet.source.label);
		} else if (toolOrToolSet) {
			hoverContent = localize('tool', "{0} - {1}", toolOrToolSet.userDescription ?? toolOrToolSet.modelDescription, toolOrToolSet.source.label);
		}

		if (hoverContent) {
			this._register(hoverService.setupDelayedHover(this.element, {
				...commonHoverOptions,
				content: hoverContent,
			}, commonHoverLifecycleOptions));
		}
	}


}

export class NotebookCellOutputChatAttachmentWidget extends AbstractChatAttachmentWidget {
	constructor(
		resource: URI,
		attachment: INotebookOutputVariableEntry,
		currentLanguageModel: ILanguageModelChatMetadataAndIdentifier | undefined,
		options: { shouldFocusClearButton: boolean; supportsDeletion: boolean },
		container: HTMLElement,
		contextResourceLabels: ResourceLabels,
		@ICommandService commandService: ICommandService,
		@IOpenerService openerService: IOpenerService,
		@IHoverService private readonly hoverService: IHoverService,
		@ILanguageModelsService private readonly languageModelsService: ILanguageModelsService,
		@INotebookService private readonly notebookService: INotebookService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super(attachment, options, container, contextResourceLabels, currentLanguageModel, commandService, openerService);

		switch (attachment.mimeType) {
			case 'application/vnd.code.notebook.error': {
				this.renderErrorOutput(resource, attachment);
				break;
			}
			case 'image/png':
			case 'image/jpeg':
			case 'image/svg': {
				this.renderImageOutput(resource, attachment);
				break;
			}
			default: {
				this.renderGenericOutput(resource, attachment);
			}
		}

		this.instantiationService.invokeFunction(accessor => {
			this._register(hookUpResourceAttachmentDragAndContextMenu(accessor, this.element, resource));
		});
		this.addResourceOpenHandlers(resource, undefined);
	}
	getAriaLabel(attachment: INotebookOutputVariableEntry): string {
		return localize('chat.NotebookImageAttachment', "Attached Notebook output, {0}", attachment.name);
	}
	private renderErrorOutput(resource: URI, attachment: INotebookOutputVariableEntry) {
		const attachmentLabel = attachment.name;
		const withIcon = attachment.icon?.id ? `$(${attachment.icon.id})\u00A0${attachmentLabel}` : attachmentLabel;
		const buffer = this.getOutputItem(resource, attachment)?.data.buffer ?? new Uint8Array();
		let title: string | undefined = undefined;
		try {
			const error = JSON.parse(new TextDecoder().decode(buffer)) as Error;
			if (error.name && error.message) {
				title = `${error.name}: ${error.message}`;
			}
		} catch {
			//
		}
		this.label.setLabel(withIcon, undefined, { title });
		this.element.ariaLabel = this.getAriaLabel(attachment);
	}
	private renderGenericOutput(resource: URI, attachment: INotebookOutputVariableEntry) {
		this.element.ariaLabel = this.getAriaLabel(attachment);
		this.label.setFile(resource, { hidePath: true, icon: ThemeIcon.fromId('output') });
	}
	private renderImageOutput(resource: URI, attachment: INotebookOutputVariableEntry) {
		let ariaLabel: string;
		if (attachment.omittedState === OmittedState.Full) {
			ariaLabel = localize('chat.omittedNotebookImageAttachment', "Omitted this Notebook ouput: {0}", attachment.name);
		} else if (attachment.omittedState === OmittedState.Partial) {
			ariaLabel = localize('chat.partiallyOmittedNotebookImageAttachment', "Partially omitted this Notebook output: {0}", attachment.name);
		} else {
			ariaLabel = this.getAriaLabel(attachment);
		}

		const clickHandler = async () => await this.openResource(resource, { editorOptions: { preserveFocus: true } }, false, undefined);
		const currentLanguageModelName = this.currentLanguageModel ? this.languageModelsService.lookupLanguageModel(this.currentLanguageModel.identifier)?.name ?? this.currentLanguageModel.identifier : undefined;
		const buffer = this.getOutputItem(resource, attachment)?.data.buffer ?? new Uint8Array();
		this._register(createImageElements(resource, attachment.name, attachment.name, this.element, buffer, this.hoverService, ariaLabel, currentLanguageModelName, clickHandler, this.currentLanguageModel, attachment.omittedState));
	}

	private getOutputItem(resource: URI, attachment: INotebookOutputVariableEntry) {
		const parsedInfo = CellUri.parseCellOutputUri(resource);
		if (!parsedInfo || typeof parsedInfo.cellHandle !== 'number' || typeof parsedInfo.outputIndex !== 'number') {
			return undefined;
		}
		const notebook = this.notebookService.getNotebookTextModel(parsedInfo.notebook);
		if (!notebook) {
			return undefined;
		}
		const cell = notebook.cells.find(c => c.handle === parsedInfo.cellHandle);
		if (!cell) {
			return undefined;
		}
		const output = cell.outputs.length > parsedInfo.outputIndex ? cell.outputs[parsedInfo.outputIndex] : undefined;
		return output?.outputs.find(o => o.mime === attachment.mimeType);
	}

}

export class ElementChatAttachmentWidget extends AbstractChatAttachmentWidget {
	constructor(
		attachment: IElementVariableEntry,
		currentLanguageModel: ILanguageModelChatMetadataAndIdentifier | undefined,
		options: { shouldFocusClearButton: boolean; supportsDeletion: boolean },
		container: HTMLElement,
		contextResourceLabels: ResourceLabels,
		@ICommandService commandService: ICommandService,
		@IOpenerService openerService: IOpenerService,
		@IEditorService editorService: IEditorService,
	) {
		super(attachment, options, container, contextResourceLabels, currentLanguageModel, commandService, openerService);

		const ariaLabel = localize('chat.elementAttachment', "Attached element, {0}", attachment.name);
		this.element.ariaLabel = ariaLabel;

		this.element.style.position = 'relative';
		this.element.style.cursor = 'pointer';
		const attachmentLabel = attachment.name;
		const withIcon = attachment.icon?.id ? `$(${attachment.icon.id})\u00A0${attachmentLabel}` : attachmentLabel;
		this.label.setLabel(withIcon, undefined, { title: localize('chat.clickToViewContents', "Click to view the contents of: {0}", attachmentLabel) });

		this._register(dom.addDisposableListener(this.element, dom.EventType.CLICK, async () => {
			const content = attachment.value?.toString() || '';
			await editorService.openEditor({
				resource: undefined,
				contents: content,
				options: {
					pinned: true
				}
			});
		}));
	}
}

export class SCMHistoryItemAttachmentWidget extends AbstractChatAttachmentWidget {
	constructor(
		attachment: ISCMHistoryItemVariableEntry,
		currentLanguageModel: ILanguageModelChatMetadataAndIdentifier | undefined,
		options: { shouldFocusClearButton: boolean; supportsDeletion: boolean },
		container: HTMLElement,
		contextResourceLabels: ResourceLabels,
		@ICommandService commandService: ICommandService,
		@IMarkdownRendererService markdownRendererService: IMarkdownRendererService,
		@IHoverService hoverService: IHoverService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService themeService: IThemeService
	) {
		super(attachment, options, container, contextResourceLabels, currentLanguageModel, commandService, openerService);

		this.label.setLabel(attachment.name, undefined);

		this.element.style.cursor = 'pointer';
		this.element.ariaLabel = localize('chat.attachment', "Attached context, {0}", attachment.name);

		const { content, disposables } = toHistoryItemHoverContent(markdownRendererService, attachment.historyItem, false);
		this._store.add(hoverService.setupDelayedHover(this.element, {
			...commonHoverOptions,
			content,
		}, commonHoverLifecycleOptions));
		this._store.add(disposables);

		this._store.add(dom.addDisposableListener(this.element, dom.EventType.CLICK, (e: MouseEvent) => {
			dom.EventHelper.stop(e, true);
			this._openAttachment(attachment);
		}));

		this._store.add(dom.addDisposableListener(this.element, dom.EventType.KEY_DOWN, (e: KeyboardEvent) => {
			const event = new StandardKeyboardEvent(e);
			if (event.equals(KeyCode.Enter) || event.equals(KeyCode.Space)) {
				dom.EventHelper.stop(e, true);
				this._openAttachment(attachment);
			}
		}));
	}

	private async _openAttachment(attachment: ISCMHistoryItemVariableEntry): Promise<void> {
		await this.commandService.executeCommand('_workbench.openMultiDiffEditor', {
			title: getHistoryItemEditorTitle(attachment.historyItem), multiDiffSourceUri: attachment.value
		});
	}
}

export class SCMHistoryItemChangeAttachmentWidget extends AbstractChatAttachmentWidget {
	constructor(
		attachment: ISCMHistoryItemChangeVariableEntry,
		currentLanguageModel: ILanguageModelChatMetadataAndIdentifier | undefined,
		options: { shouldFocusClearButton: boolean; supportsDeletion: boolean },
		container: HTMLElement,
		contextResourceLabels: ResourceLabels,
		@ICommandService commandService: ICommandService,
		@IHoverService hoverService: IHoverService,
		@IMarkdownRendererService markdownRendererService: IMarkdownRendererService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService themeService: IThemeService,
		@IEditorService private readonly editorService: IEditorService,
	) {
		super(attachment, options, container, contextResourceLabels, currentLanguageModel, commandService, openerService);

		const nameSuffix = `\u00A0$(${Codicon.gitCommit.id})${attachment.historyItem.displayId ?? attachment.historyItem.id}`;
		this.label.setFile(attachment.value, { fileKind: FileKind.FILE, hidePath: true, nameSuffix });

		this.element.ariaLabel = localize('chat.attachment', "Attached context, {0}", attachment.name);

		const { content, disposables } = toHistoryItemHoverContent(markdownRendererService, attachment.historyItem, false);
		this._store.add(hoverService.setupDelayedHover(this.element, {
			...commonHoverOptions, content,
		}, commonHoverLifecycleOptions));
		this._store.add(disposables);

		this.addResourceOpenHandlers(attachment.value, undefined);
	}

	protected override async openResource(resource: URI, options: IOpenEditorOptions, isDirectory: true): Promise<void>;
	protected override async openResource(resource: URI, options: IOpenEditorOptions, isDirectory: false, range: IRange | undefined): Promise<void>;
	protected override async openResource(resource: URI, options: IOpenEditorOptions, isDirectory?: boolean, range?: IRange): Promise<void> {
		const attachment = this.attachment as ISCMHistoryItemChangeVariableEntry;
		const historyItem = attachment.historyItem;

		await this.editorService.openEditor({
			resource,
			label: `${basename(resource.path)} (${historyItem.displayId ?? historyItem.id})`,
			options: { ...options.editorOptions }
		}, options.openToSide ? SIDE_GROUP : undefined);
	}
}

export class SCMHistoryItemChangeRangeAttachmentWidget extends AbstractChatAttachmentWidget {
	constructor(
		attachment: ISCMHistoryItemChangeRangeVariableEntry,
		currentLanguageModel: ILanguageModelChatMetadataAndIdentifier | undefined,
		options: { shouldFocusClearButton: boolean; supportsDeletion: boolean },
		container: HTMLElement,
		contextResourceLabels: ResourceLabels,
		@ICommandService commandService: ICommandService,
		@IOpenerService openerService: IOpenerService,
		@IEditorService private readonly editorService: IEditorService,
	) {
		super(attachment, options, container, contextResourceLabels, currentLanguageModel, commandService, openerService);

		const historyItemStartId = attachment.historyItemChangeStart.historyItem.displayId ?? attachment.historyItemChangeStart.historyItem.id;
		const historyItemEndId = attachment.historyItemChangeEnd.historyItem.displayId ?? attachment.historyItemChangeEnd.historyItem.id;

		const nameSuffix = `\u00A0$(${Codicon.gitCommit.id})${historyItemStartId}..${historyItemEndId}`;
		this.label.setFile(attachment.value, { fileKind: FileKind.FILE, hidePath: true, nameSuffix });

		this.element.ariaLabel = localize('chat.attachment', "Attached context, {0}", attachment.name);

		this.addResourceOpenHandlers(attachment.value, undefined);
	}

	protected override async openResource(resource: URI, options: IOpenEditorOptions, isDirectory: true): Promise<void>;
	protected override async openResource(resource: URI, options: IOpenEditorOptions, isDirectory: false, range: IRange | undefined): Promise<void>;
	protected override async openResource(resource: URI, options: IOpenEditorOptions, isDirectory?: boolean, range?: IRange): Promise<void> {
		const attachment = this.attachment as ISCMHistoryItemChangeRangeVariableEntry;
		const historyItemChangeStart = attachment.historyItemChangeStart;
		const historyItemChangeEnd = attachment.historyItemChangeEnd;

		const originalUriTitle = `${basename(historyItemChangeStart.uri.fsPath)} (${historyItemChangeStart.historyItem.displayId ?? historyItemChangeStart.historyItem.id})`;
		const modifiedUriTitle = `${basename(historyItemChangeEnd.uri.fsPath)} (${historyItemChangeEnd.historyItem.displayId ?? historyItemChangeEnd.historyItem.id})`;

		await this.editorService.openEditor({
			original: { resource: historyItemChangeStart.uri },
			modified: { resource: historyItemChangeEnd.uri },
			label: `${originalUriTitle} ↔ ${modifiedUriTitle}`,
			options: { ...options.editorOptions }
		}, options.openToSide ? SIDE_GROUP : undefined);
	}
}

export function hookUpResourceAttachmentDragAndContextMenu(accessor: ServicesAccessor, widget: HTMLElement, resource: URI): IDisposable {
	const contextKeyService = accessor.get(IContextKeyService);
	const instantiationService = accessor.get(IInstantiationService);

	const store = new DisposableStore();

	// Context
	const scopedContextKeyService = store.add(contextKeyService.createScoped(widget));
	store.add(setResourceContext(accessor, scopedContextKeyService, resource));

	// Drag and drop
	widget.draggable = true;
	store.add(dom.addDisposableListener(widget, 'dragstart', e => {
		instantiationService.invokeFunction(accessor => fillEditorsDragData(accessor, [resource], e));
		e.dataTransfer?.setDragImage(widget, 0, 0);
	}));

	// Context menu
	store.add(addBasicContextMenu(accessor, widget, scopedContextKeyService, MenuId.ChatInputResourceAttachmentContext, resource));

	return store;
}

export function hookUpSymbolAttachmentDragAndContextMenu(accessor: ServicesAccessor, widget: HTMLElement, scopedContextKeyService: IScopedContextKeyService, attachment: { name: string; value: Location; kind: SymbolKind }, contextMenuId: MenuId): IDisposable {
	const instantiationService = accessor.get(IInstantiationService);
	const languageFeaturesService = accessor.get(ILanguageFeaturesService);
	const textModelService = accessor.get(ITextModelService);

	const store = new DisposableStore();

	// Context
	store.add(setResourceContext(accessor, scopedContextKeyService, attachment.value.uri));

	const chatResourceContext = chatAttachmentResourceContextKey.bindTo(scopedContextKeyService);
	chatResourceContext.set(attachment.value.uri.toString());

	// Drag and drop
	widget.draggable = true;
	store.add(dom.addDisposableListener(widget, 'dragstart', e => {
		instantiationService.invokeFunction(accessor => fillEditorsDragData(accessor, [{ resource: attachment.value.uri, selection: attachment.value.range }], e));

		fillInSymbolsDragData([{
			fsPath: attachment.value.uri.fsPath,
			range: attachment.value.range,
			name: attachment.name,
			kind: attachment.kind,
		}], e);

		e.dataTransfer?.setDragImage(widget, 0, 0);
	}));

	// Context menu
	const providerContexts: ReadonlyArray<[IContextKey<boolean>, LanguageFeatureRegistry<unknown>]> = [
		[EditorContextKeys.hasDefinitionProvider.bindTo(scopedContextKeyService), languageFeaturesService.definitionProvider],
		[EditorContextKeys.hasReferenceProvider.bindTo(scopedContextKeyService), languageFeaturesService.referenceProvider],
		[EditorContextKeys.hasImplementationProvider.bindTo(scopedContextKeyService), languageFeaturesService.implementationProvider],
		[EditorContextKeys.hasTypeDefinitionProvider.bindTo(scopedContextKeyService), languageFeaturesService.typeDefinitionProvider],
	];

	const updateContextKeys = async () => {
		const modelRef = await textModelService.createModelReference(attachment.value.uri);
		try {
			const model = modelRef.object.textEditorModel;
			for (const [contextKey, registry] of providerContexts) {
				contextKey.set(registry.has(model));
			}
		} finally {
			modelRef.dispose();
		}
	};
	store.add(addBasicContextMenu(accessor, widget, scopedContextKeyService, contextMenuId, attachment.value, updateContextKeys));

	return store;
}

function setResourceContext(accessor: ServicesAccessor, scopedContextKeyService: IScopedContextKeyService, resource: URI) {
	const fileService = accessor.get(IFileService);
	const languageService = accessor.get(ILanguageService);
	const modelService = accessor.get(IModelService);

	const resourceContextKey = new ResourceContextKey(scopedContextKeyService, fileService, languageService, modelService);
	resourceContextKey.set(resource);
	return resourceContextKey;
}

function addBasicContextMenu(accessor: ServicesAccessor, widget: HTMLElement, scopedContextKeyService: IScopedContextKeyService, menuId: MenuId, arg: unknown, updateContextKeys?: () => Promise<void>): IDisposable {
	const contextMenuService = accessor.get(IContextMenuService);
	const menuService = accessor.get(IMenuService);

	return dom.addDisposableListener(widget, dom.EventType.CONTEXT_MENU, async domEvent => {
		const event = new StandardMouseEvent(dom.getWindow(domEvent), domEvent);
		dom.EventHelper.stop(domEvent, true);

		try {
			await updateContextKeys?.();
		} catch (e) {
			console.error(e);
		}

		contextMenuService.showContextMenu({
			contextKeyService: scopedContextKeyService,
			getAnchor: () => event,
			getActions: () => {
				const menu = menuService.getMenuActions(menuId, scopedContextKeyService, { arg });
				return getFlatContextMenuActions(menu);
			},
		});
	});
}

export const chatAttachmentResourceContextKey = new RawContextKey<string>('chatAttachmentResource', undefined, { type: 'URI', description: localize('resource', "The full value of the chat attachment resource, including scheme and path") });
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentMarkdownRenderer.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentMarkdownRenderer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $ } from '../../../../base/browser/dom.js';
import { IRenderedMarkdown, MarkdownRenderOptions } from '../../../../base/browser/markdownRenderer.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { IMarkdownRenderer, IMarkdownRendererService } from '../../../../platform/markdown/browser/markdownRenderer.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import product from '../../../../platform/product/common/product.js';

export const allowedChatMarkdownHtmlTags = Object.freeze([
	'b',
	'blockquote',
	'br',
	'code',
	'del',
	'em',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'hr',
	'i',
	'ins',
	'li',
	'ol',
	'p',
	'pre',
	's',
	'strong',
	'sub',
	'sup',
	'table',
	'tbody',
	'td',
	'th',
	'thead',
	'tr',
	'ul',
	'a',
	'img',

	// TODO@roblourens when we sanitize attributes in markdown source, we can ban these elements at that step. microsoft/vscode-copilot#5091
	// Not in the official list, but used for codicons and other vscode markdown extensions
	'span',
	'div',

	'input', // Allowed for rendering checkboxes. Other types of inputs are removed and the inputs are always disabled
]);

/**
 * This wraps the MarkdownRenderer and applies sanitizer options needed for chat content.
 */
export class ChatContentMarkdownRenderer implements IMarkdownRenderer {
	constructor(
		@ILanguageService languageService: ILanguageService,
		@IOpenerService openerService: IOpenerService,
		@IConfigurationService configurationService: IConfigurationService,
		@IHoverService private readonly hoverService: IHoverService,
		@IMarkdownRendererService private readonly markdownRendererService: IMarkdownRendererService,
	) { }

	render(markdown: IMarkdownString, options?: MarkdownRenderOptions, outElement?: HTMLElement): IRenderedMarkdown {
		options = {
			...options,
			sanitizerConfig: {
				replaceWithPlaintext: true,
				allowedTags: {
					override: allowedChatMarkdownHtmlTags,
				},
				...options?.sanitizerConfig,
				allowedLinkSchemes: { augment: [product.urlProtocol] },
				remoteImageIsAllowed: (_uri) => false,
			}
		};

		const mdWithBody: IMarkdownString = (markdown && markdown.supportHtml) ?
			{
				...markdown,

				// dompurify uses DOMParser, which strips leading comments. Wrapping it all in 'body' prevents this.
				// The \n\n prevents marked.js from parsing the body contents as just text in an 'html' token, instead of actual markdown.
				value: `<body>\n\n${markdown.value}</body>`,
			}
			: markdown;
		const result = this.markdownRendererService.render(mdWithBody, options, outElement);

		// In some cases, the renderer can return top level text nodes  but our CSS expects
		// all text to be in a <p> for margin to be applied properly.
		// So just normalize it.
		result.element.normalize();
		for (const child of result.element.childNodes) {
			if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
				child.replaceWith($('p', undefined, child.textContent));
			}
		}
		return this.attachCustomHover(result);
	}

	private attachCustomHover(result: IRenderedMarkdown): IRenderedMarkdown {
		const store = new DisposableStore();
		// eslint-disable-next-line no-restricted-syntax
		result.element.querySelectorAll('a').forEach((element) => {
			if (element.title) {
				const title = element.title;
				element.title = '';
				store.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('element'), element, title));
			}
		});

		return {
			element: result.element,
			dispose: () => {
				result.dispose();
				store.dispose();
			}
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContext.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContext.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { localize } from '../../../../nls.js';

import { IWorkbenchContribution, registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';
import { IChatContextService } from './chatContextService.js';
import { isProposedApiEnabled } from '../../../services/extensions/common/extensions.js';
import { ExtensionsRegistry } from '../../../services/extensions/common/extensionsRegistry.js';

interface IChatContextExtensionPoint {
	id: string;
	icon: string;
	displayName: string;
}

const extensionPoint = ExtensionsRegistry.registerExtensionPoint<IChatContextExtensionPoint[]>({
	extensionPoint: 'chatContext',
	jsonSchema: {
		description: localize('chatContextExtPoint', 'Contributes chat context integrations to the chat widget.'),
		type: 'array',
		items: {
			type: 'object',
			properties: {
				id: {
					description: localize('chatContextExtPoint.id', 'A unique identifier for this item.'),
					type: 'string',
				},
				icon: {
					description: localize('chatContextExtPoint.icon', 'The icon associated with this chat context item.'),
					type: 'string'
				},
				displayName: {
					description: localize('chatContextExtPoint.title', 'A user-friendly name for this item which is used for display in menus.'),
					type: 'string'
				}
			},
			required: ['id', 'icon', 'displayName'],
		}
	}
});

export class ChatContextContribution extends Disposable implements IWorkbenchContribution {
	public static readonly ID = 'workbench.contrib.chatContextContribution';

	constructor(
		@IChatContextService private readonly _chatContextService: IChatContextService
	) {
		super();
		extensionPoint.setHandler(extensions => {
			for (const ext of extensions) {
				if (!isProposedApiEnabled(ext.description, 'chatContextProvider')) {
					continue;
				}
				if (!Array.isArray(ext.value)) {
					continue;
				}
				for (const contribution of ext.value) {
					const icon = contribution.icon ? ThemeIcon.fromString(contribution.icon) : undefined;
					if (!icon) {
						continue;
					}

					this._chatContextService.setChatContextProvider(`${ext.description.id}-${contribution.id}`, { title: contribution.displayName, icon });
				}
			}
		});
	}
}

registerWorkbenchContribution2(ChatContextContribution.ID, ChatContextContribution, WorkbenchPhase.AfterRestored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContextPickService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContextPickService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { derived, IObservable, ObservablePromise } from '../../../../base/common/observable.js';
import { compare } from '../../../../base/common/strings.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { isObject } from '../../../../base/common/types.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IQuickItem, IQuickPickSeparator } from '../../../../platform/quickinput/common/quickInput.js';
import { IChatRequestVariableEntry } from '../common/chatVariableEntries.js';
import { IChatWidget } from './chat.js';


export interface IChatContextPickerPickItem extends Partial<IQuickItem> {
	label: string;
	iconClass?: string;
	iconClasses?: readonly string[];
	description?: string;
	detail?: string;
	disabled?: boolean;
	asAttachment(): ChatContextPickAttachment | Promise<ChatContextPickAttachment>;
}

export type ChatContextPickAttachment = IChatRequestVariableEntry | IChatRequestVariableEntry[] | 'noop';

export function isChatContextPickerPickItem(item: unknown): item is IChatContextPickerPickItem {
	return isObject(item) && typeof (item as IChatContextPickerPickItem).asAttachment === 'function';
}

interface IChatContextItem {
	readonly label: string;
	readonly icon: ThemeIcon;
	readonly commandId?: string;
	readonly ordinal?: number;
	isEnabled?(widget: IChatWidget): Promise<boolean> | boolean;
}

export interface IChatContextValueItem extends IChatContextItem {
	readonly type: 'valuePick';

	asAttachment(widget: IChatWidget): Promise<IChatRequestVariableEntry | IChatRequestVariableEntry[] | undefined>;
}

export type ChatContextPick = IChatContextPickerPickItem | IQuickPickSeparator;

export interface IChatContextPicker {
	readonly placeholder: string;
	/**
	 * Picks that should either be:
	 * - A promise that resolves to the picked items
	 * - A function that maps input query into items to display.
	 */
	readonly picks: Promise<ChatContextPick[]> | ((query: IObservable<string>, token: CancellationToken) => IObservable<{ busy: boolean; picks: ChatContextPick[] }>);

	/** Return true to cancel the default behavior */
	readonly goBack?: () => boolean;

	readonly configure?: {
		label: string;
		commandId: string;
	};

	readonly dispose?: () => void;
}

export interface IChatContextPickerItem extends IChatContextItem {
	readonly type: 'pickerPick';

	asPicker(widget: IChatWidget): IChatContextPicker;
}

/**
 * Helper for use in {@IChatContextPickerItem} that wraps a simple query->promise
 * function into the requisite observable.
 */
export function picksWithPromiseFn(fn: (query: string, token: CancellationToken) => Promise<ChatContextPick[]>): (query: IObservable<string>, token: CancellationToken) => IObservable<{ busy: boolean; picks: ChatContextPick[] }> {
	return (query, token) => {
		const promise = derived(reader => {
			const queryValue = query.read(reader);
			const cts = new CancellationTokenSource(token);
			reader.store.add(toDisposable(() => cts.dispose(true)));
			return new ObservablePromise(fn(queryValue, cts.token));
		});

		return promise.map((value, reader) => {
			const result = value.promiseResult.read(reader);
			return { picks: result?.data || [], busy: result === undefined };
		});
	};
}

export interface IChatContextPickService {
	_serviceBrand: undefined;

	items: Iterable<IChatContextValueItem | IChatContextPickerItem>;

	/**
	 * Register a value or  picker to the "Add Context" flow. A value directly resolved to a
	 * chat attachment and a picker first shows a list of items to pick from and then
	 * resolves the selected item to a chat attachment.
	 */
	registerChatContextItem(item: IChatContextValueItem | IChatContextPickerItem): IDisposable;
}

export const IChatContextPickService = createDecorator<IChatContextPickService>('IContextPickService');

export class ChatContextPickService implements IChatContextPickService {

	declare _serviceBrand: undefined;

	private readonly _picks: IChatContextValueItem[] = [];

	readonly items: Iterable<IChatContextValueItem> = this._picks;

	registerChatContextItem(pick: IChatContextValueItem): IDisposable {
		this._picks.push(pick);

		this._picks.sort((a, b) => {
			const valueA = a.ordinal ?? 0;
			const valueB = b.ordinal ?? 0;
			if (valueA === valueB) {
				return compare(a.label, b.label);
			} else if (valueA < valueB) {
				return 1;
			} else {
				return -1;
			}
		});

		return toDisposable(() => {
			const index = this._picks.indexOf(pick);
			if (index >= 0) {
				this._picks.splice(index, 1);
			}
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContextService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContextService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ThemeIcon } from '../../../../base/common/themables.js';
import { LanguageSelector, score } from '../../../../editor/common/languageSelector.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IChatContextPicker, IChatContextPickerItem, IChatContextPickService } from './chatContextPickService.js';
import { IChatContextItem, IChatContextProvider } from '../common/chatContext.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IChatRequestWorkspaceVariableEntry, IGenericChatRequestVariableEntry, StringChatContextValue } from '../common/chatVariableEntries.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { Disposable, DisposableMap, IDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';

export const IChatContextService = createDecorator<IChatContextService>('chatContextService');

export interface IChatContextService extends ChatContextService { }

interface IChatContextProviderEntry {
	picker?: { title: string; icon: ThemeIcon };
	chatContextProvider?: {
		selector: LanguageSelector | undefined;
		provider: IChatContextProvider;
	};
}

export class ChatContextService extends Disposable {
	_serviceBrand: undefined;

	private readonly _providers = new Map<string, IChatContextProviderEntry>();
	private readonly _workspaceContext = new Map<string, IChatContextItem[]>();
	private readonly _registeredPickers = this._register(new DisposableMap<string, IDisposable>());
	private _lastResourceContext: Map<StringChatContextValue, { originalItem: IChatContextItem; provider: IChatContextProvider }> = new Map();

	constructor(
		@IChatContextPickService private readonly _contextPickService: IChatContextPickService,
		@IExtensionService private readonly _extensionService: IExtensionService
	) {
		super();
	}

	setChatContextProvider(id: string, picker: { title: string; icon: ThemeIcon }): void {
		const providerEntry = this._providers.get(id) ?? { picker: undefined };
		providerEntry.picker = picker;
		this._providers.set(id, providerEntry);
		this._registerWithPickService(id);
	}

	private _registerWithPickService(id: string): void {
		const providerEntry = this._providers.get(id);
		if (!providerEntry || !providerEntry.picker || !providerEntry.chatContextProvider) {
			return;
		}
		const title = `${providerEntry.picker.title.replace(/\.+$/, '')}...`;
		this._registeredPickers.set(id, this._contextPickService.registerChatContextItem(this._asPicker(title, providerEntry.picker.icon, id)));
	}

	registerChatContextProvider(id: string, selector: LanguageSelector | undefined, provider: IChatContextProvider): void {
		const providerEntry = this._providers.get(id) ?? { picker: undefined };
		providerEntry.chatContextProvider = { selector, provider };
		this._providers.set(id, providerEntry);
		this._registerWithPickService(id);
	}

	unregisterChatContextProvider(id: string): void {
		this._providers.delete(id);
		this._registeredPickers.deleteAndDispose(id);
	}

	updateWorkspaceContextItems(id: string, items: IChatContextItem[]): void {
		this._workspaceContext.set(id, items);
	}

	getWorkspaceContextItems(): IChatRequestWorkspaceVariableEntry[] {
		const items: IChatRequestWorkspaceVariableEntry[] = [];
		for (const workspaceContexts of this._workspaceContext.values()) {
			for (const item of workspaceContexts) {
				if (!item.value) {
					continue;
				}
				items.push({
					value: item.value,
					name: item.label,
					modelDescription: item.modelDescription,
					id: item.label,
					kind: 'workspace'
				});
			}
		}
		return items;
	}

	async contextForResource(uri: URI): Promise<StringChatContextValue | undefined> {
		return this._contextForResource(uri, false);
	}

	private async _contextForResource(uri: URI, withValue: boolean): Promise<StringChatContextValue | undefined> {
		const scoredProviders: Array<{ score: number; provider: IChatContextProvider }> = [];
		for (const providerEntry of this._providers.values()) {
			if (!providerEntry.chatContextProvider?.provider.provideChatContextForResource || (providerEntry.chatContextProvider.selector === undefined)) {
				continue;
			}
			const matchScore = score(providerEntry.chatContextProvider.selector, uri, '', true, undefined, undefined);
			scoredProviders.push({ score: matchScore, provider: providerEntry.chatContextProvider.provider });
		}
		scoredProviders.sort((a, b) => b.score - a.score);
		if (scoredProviders.length === 0 || scoredProviders[0].score <= 0) {
			return;
		}
		const context = (await scoredProviders[0].provider.provideChatContextForResource!(uri, withValue, CancellationToken.None));
		if (!context) {
			return;
		}
		const contextValue: StringChatContextValue = {
			value: undefined,
			name: context.label,
			icon: context.icon,
			uri: uri,
			modelDescription: context.modelDescription
		};
		this._lastResourceContext.clear();
		this._lastResourceContext.set(contextValue, { originalItem: context, provider: scoredProviders[0].provider });
		return contextValue;
	}

	async resolveChatContext(context: StringChatContextValue): Promise<StringChatContextValue> {
		if (context.value !== undefined) {
			return context;
		}

		const item = this._lastResourceContext.get(context);
		if (!item) {
			const resolved = await this._contextForResource(context.uri, true);
			context.value = resolved?.value;
			context.modelDescription = resolved?.modelDescription;
			return context;
		} else if (item.provider.resolveChatContext) {
			const resolved = await item.provider.resolveChatContext(item.originalItem, CancellationToken.None);
			if (resolved) {
				context.value = resolved.value;
				context.modelDescription = resolved.modelDescription;
				return context;
			}
		}
		return context;
	}

	private _asPicker(title: string, icon: ThemeIcon, id: string): IChatContextPickerItem {
		const asPicker = (): IChatContextPicker => {
			let providerEntry = this._providers.get(id);
			if (!providerEntry) {
				throw new Error('No chat context provider registered');
			}

			const picks = async (): Promise<IChatContextItem[]> => {
				if (providerEntry && !providerEntry.chatContextProvider) {
					// Activate the extension providing the chat context provider
					await this._extensionService.activateByEvent(`onChatContextProvider:${id}`);
					providerEntry = this._providers.get(id);
					if (!providerEntry?.chatContextProvider) {
						return [];
					}
				}
				const results = await providerEntry?.chatContextProvider!.provider.provideChatContext({}, CancellationToken.None);
				return results || [];
			};

			return {
				picks: picks().then(items => {
					return items.map(item => ({
						label: item.label,
						iconClass: ThemeIcon.asClassName(item.icon),
						asAttachment: async (): Promise<IGenericChatRequestVariableEntry> => {
							let contextValue = item;
							if ((contextValue.value === undefined) && providerEntry?.chatContextProvider?.provider!.resolveChatContext) {
								contextValue = await providerEntry.chatContextProvider.provider.resolveChatContext(item, CancellationToken.None);
							}
							return {
								kind: 'generic',
								id: contextValue.label,
								name: contextValue.label,
								icon: contextValue.icon,
								value: contextValue.value
							};
						}
					}));
				}),
				placeholder: title
			};
		};

		const picker: IChatContextPickerItem = {
			asPicker,
			type: 'pickerPick',
			label: title,
			icon
		};

		return picker;
	}
}

registerSingleton(IChatContextService, ChatContextService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatDiffBlockPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatDiffBlockPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Emitter } from '../../../../base/common/event.js';
import { hashAsync } from '../../../../base/common/hash.js';
import { Disposable, IReference, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { IResolvedTextEditorModel, ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { EditorModel } from '../../../common/editor/editorModel.js';
import { IChatResponseViewModel } from '../common/chatViewModel.js';
import { IDisposableReference } from './chatContentParts/chatCollections.js';
import { DiffEditorPool } from './chatContentParts/chatContentCodePools.js';
import { CodeCompareBlockPart, ICodeCompareBlockData, ICodeCompareBlockDiffData } from './codeBlockPart.js';

/**
 * Parses unified diff format into before/after content.
 * Supports standard unified diff format with - and + prefixes.
 */
export function parseUnifiedDiff(diffText: string): { before: string; after: string } {
	const lines = diffText.split('\n');
	const beforeLines: string[] = [];
	const afterLines: string[] = [];

	for (const line of lines) {
		if (line.startsWith('- ')) {
			beforeLines.push(line.substring(2));
		} else if (line.startsWith('-')) {
			beforeLines.push(line.substring(1));
		} else if (line.startsWith('+ ')) {
			afterLines.push(line.substring(2));
		} else if (line.startsWith('+')) {
			afterLines.push(line.substring(1));
		} else if (line.startsWith(' ')) {
			// Context line - appears in both
			const content = line.substring(1);
			beforeLines.push(content);
			afterLines.push(content);
		} else if (!line.startsWith('@@') && !line.startsWith('---') && !line.startsWith('+++') && !line.startsWith('diff ')) {
			// Regular line without prefix - treat as context
			beforeLines.push(line);
			afterLines.push(line);
		}
	}

	return {
		before: beforeLines.join('\n'),
		after: afterLines.join('\n')
	};
}

/**
 * Simple diff editor model for inline diffs in markdown code blocks
 */
class SimpleDiffEditorModel extends EditorModel {
	public readonly original: ITextModel;
	public readonly modified: ITextModel;

	constructor(
		private readonly _original: IReference<IResolvedTextEditorModel>,
		private readonly _modified: IReference<IResolvedTextEditorModel>,
	) {
		super();
		this.original = this._original.object.textEditorModel;
		this.modified = this._modified.object.textEditorModel;
	}

	public override dispose() {
		super.dispose();
		this._original.dispose();
		this._modified.dispose();
	}
}

export interface IMarkdownDiffBlockData {
	readonly element: IChatResponseViewModel;
	readonly codeBlockIndex: number;
	readonly languageId: string;
	readonly beforeContent: string;
	readonly afterContent: string;
	readonly codeBlockResource?: URI;
	readonly isReadOnly?: boolean;
	readonly horizontalPadding?: number;
}

/**
 * Renders a diff block from markdown content.
 * This is a lightweight wrapper that uses CodeCompareBlockPart for the actual rendering.
 */
export class MarkdownDiffBlockPart extends Disposable {
	private readonly _onDidChangeContentHeight = this._register(new Emitter<void>());
	public readonly onDidChangeContentHeight = this._onDidChangeContentHeight.event;

	readonly element: HTMLElement;
	private readonly comparePart: IDisposableReference<CodeCompareBlockPart>;
	private readonly modelRef = this._register(new MutableDisposable<SimpleDiffEditorModel>());

	constructor(
		data: IMarkdownDiffBlockData,
		diffEditorPool: DiffEditorPool,
		currentWidth: number,
		@IModelService private readonly modelService: IModelService,
		@ITextModelService private readonly textModelService: ITextModelService,
		@ILanguageService private readonly languageService: ILanguageService,
	) {
		super();

		this.comparePart = this._register(diffEditorPool.get());

		this._register(this.comparePart.object.onDidChangeContentHeight(() => {
			this._onDidChangeContentHeight.fire();
		}));

		// Create in-memory models for the diff
		const originalUri = URI.from({
			scheme: Schemas.vscodeChatCodeBlock,
			path: `/chat-diff-original-${data.codeBlockIndex}-${generateUuid()}`,
		});
		const modifiedUri = URI.from({
			scheme: Schemas.vscodeChatCodeBlock,
			path: `/chat-diff-modified-${data.codeBlockIndex}-${generateUuid()}`,
		});

		const languageSelection = this.languageService.createById(data.languageId);

		// Create the models
		this._register(this.modelService.createModel(data.beforeContent, languageSelection, originalUri, false));
		this._register(this.modelService.createModel(data.afterContent, languageSelection, modifiedUri, false));

		const modelsPromise = Promise.all([
			this.textModelService.createModelReference(originalUri),
			this.textModelService.createModelReference(modifiedUri)
		]).then(([originalRef, modifiedRef]) => {
			return new SimpleDiffEditorModel(originalRef, modifiedRef);
		});

		const compareData: ICodeCompareBlockData = {
			element: data.element,
			isReadOnly: data.isReadOnly,
			horizontalPadding: data.horizontalPadding,
			edit: {
				uri: data.codeBlockResource || modifiedUri,
				edits: [],
				kind: 'textEditGroup',
				done: true
			},
			diffData: modelsPromise.then(async model => {
				this.modelRef.value = model;
				const diffData: ICodeCompareBlockDiffData = {
					original: model.original,
					modified: model.modified,
					originalSha1: await hashAsync(model.original.getValue()),
				};
				return diffData;
			})
		};

		this.comparePart.object.render(compareData, currentWidth, CancellationToken.None);
		this.element = this.comparePart.object.element;
	}

	layout(width: number): void {
		this.comparePart.object.layout(width);
	}

	reset(): void {
		this.modelRef.clear();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatDragAndDrop.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatDragAndDrop.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DataTransfers } from '../../../../base/browser/dnd.js';
import { $, DragAndDropObserver } from '../../../../base/browser/dom.js';
import { renderLabelWithIcons } from '../../../../base/browser/ui/iconLabel/iconLabels.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { UriList } from '../../../../base/common/dataTransfer.js';
import { IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { Mimes } from '../../../../base/common/mime.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { CodeDataTransfers, containsDragType, extractEditorsDropData, extractMarkerDropData, extractNotebookCellOutputDropData, extractSymbolDropData } from '../../../../platform/dnd/browser/dnd.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IThemeService, Themable } from '../../../../platform/theme/common/themeService.js';
import { ISharedWebContentExtractorService } from '../../../../platform/webContentExtractor/common/webContentExtractor.js';
import { IExtensionService, isProposedApiEnabled } from '../../../services/extensions/common/extensions.js';
import { extractSCMHistoryItemDropData } from '../../scm/browser/scmHistoryChatContext.js';
import { IChatRequestVariableEntry } from '../common/chatVariableEntries.js';
import { IChatWidget } from './chat.js';
import { ChatAttachmentModel } from './chatAttachmentModel.js';
import { IChatAttachmentResolveService, ImageTransferData } from './chatAttachmentResolveService.js';
import { IChatInputStyles } from './chatInputPart.js';
import { convertStringToUInt8Array } from './chatImageUtils.js';

enum ChatDragAndDropType {
	FILE_INTERNAL,
	FILE_EXTERNAL,
	FOLDER,
	IMAGE,
	SYMBOL,
	HTML,
	MARKER,
	NOTEBOOK_CELL_OUTPUT,
	SCM_HISTORY_ITEM
}

const IMAGE_DATA_REGEX = /^data:image\/[a-z]+;base64,/;
const URL_REGEX = /^https?:\/\/.+/;

export class ChatDragAndDrop extends Themable {

	private readonly overlays: Map<HTMLElement, { overlay: HTMLElement; disposable: IDisposable }> = new Map();
	private overlayText?: HTMLElement;
	private overlayTextBackground: string = '';
	private disableOverlay: boolean = false;

	constructor(
		private readonly widgetRef: () => IChatWidget | undefined,
		private readonly attachmentModel: ChatAttachmentModel,
		private readonly styles: IChatInputStyles,
		@IThemeService themeService: IThemeService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@ISharedWebContentExtractorService private readonly webContentExtractorService: ISharedWebContentExtractorService,
		@ILogService private readonly logService: ILogService,
		@IChatAttachmentResolveService private readonly chatAttachmentResolveService: IChatAttachmentResolveService
	) {
		super(themeService);

		this.updateStyles();

		this._register(toDisposable(() => {
			this.overlays.forEach(({ overlay, disposable }) => {
				disposable.dispose();
				overlay.remove();
			});

			this.overlays.clear();
			this.currentActiveTarget = undefined;
			this.overlayText?.remove();
			this.overlayText = undefined;
		}));
	}

	addOverlay(target: HTMLElement, overlayContainer: HTMLElement): void {
		this.removeOverlay(target);

		const { overlay, disposable } = this.createOverlay(target, overlayContainer);
		this.overlays.set(target, { overlay, disposable });
	}

	removeOverlay(target: HTMLElement): void {
		if (this.currentActiveTarget === target) {
			this.currentActiveTarget = undefined;
		}

		const existingOverlay = this.overlays.get(target);
		if (existingOverlay) {
			existingOverlay.overlay.remove();
			existingOverlay.disposable.dispose();
			this.overlays.delete(target);
		}
	}

	setDisabledOverlay(disable: boolean) {
		this.disableOverlay = disable;
	}

	private currentActiveTarget: HTMLElement | undefined = undefined;
	private createOverlay(target: HTMLElement, overlayContainer: HTMLElement): { overlay: HTMLElement; disposable: IDisposable } {
		const overlay = document.createElement('div');
		overlay.classList.add('chat-dnd-overlay');
		this.updateOverlayStyles(overlay);
		overlayContainer.appendChild(overlay);

		const disposable = new DragAndDropObserver(target, {
			onDragOver: (e) => {
				if (this.disableOverlay) {
					return;
				}

				e.stopPropagation();
				e.preventDefault();

				if (target === this.currentActiveTarget) {
					return;
				}

				if (this.currentActiveTarget) {
					this.setOverlay(this.currentActiveTarget, undefined);
				}

				this.currentActiveTarget = target;

				this.onDragEnter(e, target);

			},
			onDragLeave: (e) => {
				if (this.disableOverlay) {
					return;
				}
				if (target === this.currentActiveTarget) {
					this.currentActiveTarget = undefined;
				}

				this.onDragLeave(e, target);
			},
			onDrop: (e) => {
				if (this.disableOverlay) {
					return;
				}
				e.stopPropagation();
				e.preventDefault();

				if (target !== this.currentActiveTarget) {
					return;
				}

				this.currentActiveTarget = undefined;
				this.onDrop(e, target);
			},
		});

		return { overlay, disposable };
	}

	private onDragEnter(e: DragEvent, target: HTMLElement): void {
		const estimatedDropType = this.guessDropType(e);
		this.updateDropFeedback(e, target, estimatedDropType);
	}

	private onDragLeave(e: DragEvent, target: HTMLElement): void {
		this.updateDropFeedback(e, target, undefined);
	}

	private onDrop(e: DragEvent, target: HTMLElement): void {
		this.updateDropFeedback(e, target, undefined);
		this.drop(e);
	}

	private async drop(e: DragEvent): Promise<void> {
		const contexts = await this.resolveAttachmentsFromDragEvent(e);
		if (contexts.length === 0) {
			return;
		}

		this.attachmentModel.addContext(...contexts);
	}

	private updateDropFeedback(e: DragEvent, target: HTMLElement, dropType: ChatDragAndDropType | undefined): void {
		const showOverlay = dropType !== undefined;
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = showOverlay ? 'copy' : 'none';
		}

		this.setOverlay(target, dropType);
	}

	private guessDropType(e: DragEvent): ChatDragAndDropType | undefined {
		// This is an estimation based on the datatransfer types/items
		if (containsDragType(e, CodeDataTransfers.NOTEBOOK_CELL_OUTPUT)) {
			return ChatDragAndDropType.NOTEBOOK_CELL_OUTPUT;
		} else if (containsDragType(e, CodeDataTransfers.SCM_HISTORY_ITEM)) {
			return ChatDragAndDropType.SCM_HISTORY_ITEM;
		} else if (containsImageDragType(e)) {
			return this.extensionService.extensions.some(ext => isProposedApiEnabled(ext, 'chatReferenceBinaryData')) ? ChatDragAndDropType.IMAGE : undefined;
		} else if (containsDragType(e, 'text/html')) {
			return ChatDragAndDropType.HTML;
		} else if (containsDragType(e, CodeDataTransfers.SYMBOLS)) {
			return ChatDragAndDropType.SYMBOL;
		} else if (containsDragType(e, CodeDataTransfers.MARKERS)) {
			return ChatDragAndDropType.MARKER;
		} else if (containsDragType(e, DataTransfers.FILES)) {
			return ChatDragAndDropType.FILE_EXTERNAL;
		} else if (containsDragType(e, CodeDataTransfers.EDITORS)) {
			return ChatDragAndDropType.FILE_INTERNAL;
		} else if (containsDragType(e, Mimes.uriList, CodeDataTransfers.FILES, DataTransfers.RESOURCES, DataTransfers.INTERNAL_URI_LIST)) {
			return ChatDragAndDropType.FOLDER;
		}

		return undefined;
	}

	private isDragEventSupported(e: DragEvent): boolean {
		// if guessed drop type is undefined, it means the drop is not supported
		const dropType = this.guessDropType(e);
		return dropType !== undefined;
	}

	private getDropTypeName(type: ChatDragAndDropType): string {
		switch (type) {
			case ChatDragAndDropType.FILE_INTERNAL: return localize('file', 'File');
			case ChatDragAndDropType.FILE_EXTERNAL: return localize('file', 'File');
			case ChatDragAndDropType.FOLDER: return localize('folder', 'Folder');
			case ChatDragAndDropType.IMAGE: return localize('image', 'Image');
			case ChatDragAndDropType.SYMBOL: return localize('symbol', 'Symbol');
			case ChatDragAndDropType.MARKER: return localize('problem', 'Problem');
			case ChatDragAndDropType.HTML: return localize('url', 'URL');
			case ChatDragAndDropType.NOTEBOOK_CELL_OUTPUT: return localize('notebookOutput', 'Output');
			case ChatDragAndDropType.SCM_HISTORY_ITEM: return localize('scmHistoryItem', 'Change');
		}
	}

	private async resolveAttachmentsFromDragEvent(e: DragEvent): Promise<IChatRequestVariableEntry[]> {
		if (!this.isDragEventSupported(e)) {
			return [];
		}

		if (containsDragType(e, CodeDataTransfers.NOTEBOOK_CELL_OUTPUT)) {
			const notebookOutputData = extractNotebookCellOutputDropData(e);
			if (notebookOutputData) {
				return this.chatAttachmentResolveService.resolveNotebookOutputAttachContext(notebookOutputData);
			}
		}

		if (containsDragType(e, CodeDataTransfers.SCM_HISTORY_ITEM)) {
			const scmHistoryItemData = extractSCMHistoryItemDropData(e);
			if (scmHistoryItemData) {
				return this.chatAttachmentResolveService.resolveSourceControlHistoryItemAttachContext(scmHistoryItemData);
			}
		}

		const markerData = extractMarkerDropData(e);
		if (markerData) {
			return this.chatAttachmentResolveService.resolveMarkerAttachContext(markerData);
		}

		if (containsDragType(e, CodeDataTransfers.SYMBOLS)) {
			const symbolsData = extractSymbolDropData(e);
			return this.chatAttachmentResolveService.resolveSymbolsAttachContext(symbolsData);
		}

		const editorDragData = extractEditorsDropData(e);
		if (editorDragData.length > 0) {
			return coalesce(await Promise.all(editorDragData.map(editorInput => {
				return this.chatAttachmentResolveService.resolveEditorAttachContext(editorInput);
			})));
		}

		const internal = e.dataTransfer?.getData(DataTransfers.INTERNAL_URI_LIST);
		if (internal) {
			const uriList = UriList.parse(internal);
			if (uriList.length) {
				return coalesce(await Promise.all(
					uriList.map(uri => this.chatAttachmentResolveService.resolveEditorAttachContext({ resource: URI.parse(uri) }))
				));
			}
		}

		if (!containsDragType(e, DataTransfers.INTERNAL_URI_LIST) && containsDragType(e, Mimes.uriList) && ((containsDragType(e, Mimes.html) || containsDragType(e, Mimes.text) /* Text mime needed for safari support */))) {
			return this.resolveHTMLAttachContext(e);
		}

		return [];
	}

	private async downloadImageAsUint8Array(url: string): Promise<Uint8Array | undefined> {
		try {
			const extractedImages = await this.webContentExtractorService.readImage(URI.parse(url), CancellationToken.None);
			if (extractedImages) {
				return extractedImages.buffer;
			}
		} catch (error) {
			this.logService.warn('Fetch failed:', error);
		}

		// TODO: use dnd provider to insert text @justschen
		const widget = this.widgetRef();
		const selection = widget?.inputEditor.getSelection();
		if (selection && widget) {
			widget.inputEditor.executeEdits('chatInsertUrl', [{ range: selection, text: url }]);
		}

		this.logService.warn(`Image URLs must end in .jpg, .png, .gif, .webp, or .bmp. Failed to fetch image from this URL: ${url}`);
		return undefined;
	}

	private async resolveHTMLAttachContext(e: DragEvent): Promise<IChatRequestVariableEntry[]> {
		const existingAttachmentNames = new Set<string>(this.attachmentModel.attachments.map(attachment => attachment.name));
		const createDisplayName = (): string => {
			const baseName = localize('dragAndDroppedImageName', 'Image from URL');
			let uniqueName = baseName;
			let baseNameInstance = 1;

			while (existingAttachmentNames.has(uniqueName)) {
				uniqueName = `${baseName} ${++baseNameInstance}`;
			}

			existingAttachmentNames.add(uniqueName);
			return uniqueName;
		};

		const getImageTransferDataFromUrl = async (url: string): Promise<ImageTransferData | undefined> => {
			const resource = URI.parse(url);

			if (IMAGE_DATA_REGEX.test(url)) {
				return { data: convertStringToUInt8Array(url), name: createDisplayName(), resource };
			}

			if (URL_REGEX.test(url)) {
				const data = await this.downloadImageAsUint8Array(url);
				if (data) {
					return { data, name: createDisplayName(), resource, id: url };
				}
			}

			return undefined;
		};

		const getImageTransferDataFromFile = async (file: File): Promise<ImageTransferData | undefined> => {
			try {
				const buffer = await file.arrayBuffer();
				return { data: new Uint8Array(buffer), name: createDisplayName() };
			} catch (error) {
				this.logService.error('Error reading file:', error);
			}

			return undefined;
		};

		const imageTransferData: ImageTransferData[] = [];

		// Image Web File Drag and Drop
		const imageFiles = extractImageFilesFromDragEvent(e);
		if (imageFiles.length) {
			const imageTransferDataFromFiles = await Promise.all(imageFiles.map(file => getImageTransferDataFromFile(file)));
			imageTransferData.push(...imageTransferDataFromFiles.filter(data => !!data));
		}

		// Image Web URL Drag and Drop
		const imageUrls = extractUrlsFromDragEvent(e);
		if (imageUrls.length) {
			const imageTransferDataFromUrl = await Promise.all(imageUrls.map(getImageTransferDataFromUrl));
			imageTransferData.push(...imageTransferDataFromUrl.filter(data => !!data));
		}

		return await this.chatAttachmentResolveService.resolveImageAttachContext(imageTransferData);
	}

	private setOverlay(target: HTMLElement, type: ChatDragAndDropType | undefined): void {
		// Remove any previous overlay text
		this.overlayText?.remove();
		this.overlayText = undefined;

		const { overlay } = this.overlays.get(target)!;
		if (type !== undefined) {
			// Render the overlay text

			const iconAndtextElements = renderLabelWithIcons(`$(${Codicon.attach.id}) ${this.getOverlayText(type)}`);
			const htmlElements = iconAndtextElements.map(element => {
				if (typeof element === 'string') {
					return $('span.overlay-text', undefined, element);
				}
				return element;
			});

			this.overlayText = $('span.attach-context-overlay-text', undefined, ...htmlElements);
			this.overlayText.style.backgroundColor = this.overlayTextBackground;
			overlay.appendChild(this.overlayText);
		}

		overlay.classList.toggle('visible', type !== undefined);
	}

	private getOverlayText(type: ChatDragAndDropType): string {
		const typeName = this.getDropTypeName(type);
		return localize('attacAsContext', 'Attach {0} as Context', typeName);
	}

	private updateOverlayStyles(overlay: HTMLElement): void {
		overlay.style.backgroundColor = this.getColor(this.styles.overlayBackground) || '';
		overlay.style.color = this.getColor(this.styles.listForeground) || '';
	}

	override updateStyles(): void {
		this.overlays.forEach(overlay => this.updateOverlayStyles(overlay.overlay));
		this.overlayTextBackground = this.getColor(this.styles.listBackground) || '';
	}
}

function containsImageDragType(e: DragEvent): boolean {
	// Image detection should not have false positives, only false negatives are allowed
	if (containsDragType(e, 'image')) {
		return true;
	}

	if (containsDragType(e, DataTransfers.FILES)) {
		const files = e.dataTransfer?.files;
		if (files && files.length > 0) {
			return Array.from(files).some(file => file.type.startsWith('image/'));
		}

		const items = e.dataTransfer?.items;
		if (items && items.length > 0) {
			return Array.from(items).some(item => item.type.startsWith('image/'));
		}
	}

	return false;
}

function extractUrlsFromDragEvent(e: DragEvent, logService?: ILogService): string[] {
	const textUrl = e.dataTransfer?.getData('text/uri-list');
	if (textUrl) {
		try {
			const urls = UriList.parse(textUrl);
			if (urls.length > 0) {
				return urls;
			}
		} catch (error) {
			logService?.error('Error parsing URI list:', error);
			return [];
		}
	}

	return [];
}

function extractImageFilesFromDragEvent(e: DragEvent): File[] {
	const files = e.dataTransfer?.files;
	if (!files) {
		return [];
	}

	return Array.from(files).filter(file => file.type.startsWith('image/'));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEdinputInputContentProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEdinputInputContentProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ITextModelContentProvider, ITextModelService } from '../../../../editor/common/services/resolverService.js';


export class ChatInputBoxContentProvider extends Disposable implements ITextModelContentProvider {
	constructor(
		@ITextModelService textModelService: ITextModelService,
		@IModelService private readonly modelService: IModelService,
		@ILanguageService private readonly languageService: ILanguageService
	) {
		super();
		this._register(textModelService.registerTextModelContentProvider(Schemas.vscodeChatInput, this));
	}

	async provideTextContent(resource: URI): Promise<ITextModel | null> {
		const existing = this.modelService.getModel(resource);
		if (existing) {
			return existing;
		}
		return this.modelService.createModel('', this.languageService.createById('chatinput'), resource);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { renderIcon } from '../../../../base/browser/ui/iconLabel/iconLabels.js';
import { raceCancellationError } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import * as nls from '../../../../nls.js';
import { IContextKeyService, IScopedContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { editorBackground, editorForeground, inputBackground } from '../../../../platform/theme/common/colorRegistry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { EditorPane } from '../../../browser/parts/editor/editorPane.js';
import { IEditorOpenContext } from '../../../common/editor.js';
import { EDITOR_DRAG_AND_DROP_BACKGROUND } from '../../../common/theme.js';
import { IEditorGroup } from '../../../services/editor/common/editorGroupsService.js';
import { ChatContextKeys } from '../common/chatContextKeys.js';
import { IChatModel, IChatModelInputState, IExportableChatData, ISerializableChatData } from '../common/chatModel.js';
import { IChatService } from '../common/chatService.js';
import { IChatSessionsService, localChatSessionType } from '../common/chatSessionsService.js';
import { ChatAgentLocation, ChatModeKind } from '../common/constants.js';
import { clearChatEditor } from './actions/chatClear.js';
import { ChatEditorInput } from './chatEditorInput.js';
import { ChatWidget } from './chatWidget.js';

export interface IChatEditorOptions extends IEditorOptions {
	/**
	 * Input state of the model when the editor is opened. Currently needed since
	 * new sessions are not persisted but may go away with
	 * https://github.com/microsoft/vscode/pull/278476 as input state is stored on the model.
	 */
	modelInputState?: IChatModelInputState;
	target?: { data: IExportableChatData | ISerializableChatData };
	title?: {
		preferred?: string;
		fallback?: string;
	};
}

export class ChatEditor extends EditorPane {
	private _widget!: ChatWidget;
	public get widget(): ChatWidget {
		return this._widget;
	}
	private _scopedContextKeyService!: IScopedContextKeyService;
	override get scopedContextKeyService() {
		return this._scopedContextKeyService;
	}

	private dimension = new dom.Dimension(0, 0);
	private _loadingContainer: HTMLElement | undefined;
	private _editorContainer: HTMLElement | undefined;

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IStorageService storageService: IStorageService,
		@IChatSessionsService private readonly chatSessionsService: IChatSessionsService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IChatService private readonly chatService: IChatService,
	) {
		super(ChatEditorInput.EditorID, group, telemetryService, themeService, storageService);
	}

	private async clear() {
		if (this.input) {
			return this.instantiationService.invokeFunction(clearChatEditor, this.input as ChatEditorInput);
		}
	}

	protected override createEditor(parent: HTMLElement): void {
		this._editorContainer = parent;
		// Ensure the container has position relative for the loading overlay
		parent.classList.add('chat-editor-relative');
		this._scopedContextKeyService = this._register(this.contextKeyService.createScoped(parent));
		const scopedInstantiationService = this._register(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, this.scopedContextKeyService])));
		ChatContextKeys.inChatEditor.bindTo(this._scopedContextKeyService).set(true);

		this._widget = this._register(
			scopedInstantiationService.createInstance(
				ChatWidget,
				ChatAgentLocation.Chat,
				undefined,
				{
					autoScroll: mode => mode !== ChatModeKind.Ask,
					renderFollowups: true,
					supportsFileReferences: true,
					clear: () => this.clear(),
					rendererOptions: {
						renderTextEditsAsSummary: (uri) => {
							return true;
						},
						referencesExpandedWhenEmptyResponse: false,
						progressMessageAtBottomOfResponse: mode => mode !== ChatModeKind.Ask,
					},
					enableImplicitContext: true,
					enableWorkingSet: 'explicit',
					supportsChangingModes: true,
				},
				{
					listForeground: editorForeground,
					listBackground: editorBackground,
					overlayBackground: EDITOR_DRAG_AND_DROP_BACKGROUND,
					inputEditorBackground: inputBackground,
					resultEditorBackground: editorBackground
				}));
		this._register(this.widget.onDidSubmitAgent(() => {
			this.group.pinEditor(this.input);
		}));
		this.widget.render(parent);
		this.widget.setVisible(true);
	}

	protected override setEditorVisible(visible: boolean): void {
		super.setEditorVisible(visible);

		this.widget?.setVisible(visible);

		if (visible && this.widget) {
			this.widget.layout(this.dimension.height, this.dimension.width);
		}
	}

	public override focus(): void {
		super.focus();

		this.widget?.focusInput();
	}

	override clearInput(): void {
		this.saveState();
		this.widget.setModel(undefined);
		super.clearInput();
	}

	private showLoadingInChatWidget(message: string): void {
		if (!this._editorContainer) {
			return;
		}

		// If already showing, just update text
		if (this._loadingContainer) {
			// eslint-disable-next-line no-restricted-syntax
			const existingText = this._loadingContainer.querySelector('.chat-loading-content span');
			if (existingText) {
				existingText.textContent = message;
				return; // aria-live will announce the text change
			}
			this.hideLoadingInChatWidget(); // unexpected structure
		}

		// Mark container busy for assistive technologies
		this._editorContainer.setAttribute('aria-busy', 'true');

		this._loadingContainer = dom.append(this._editorContainer, dom.$('.chat-loading-overlay'));
		// Accessibility: announce loading state politely without stealing focus
		this._loadingContainer.setAttribute('role', 'status');
		this._loadingContainer.setAttribute('aria-live', 'polite');
		// Rely on live region text content instead of aria-label to avoid duplicate announcements
		this._loadingContainer.tabIndex = -1; // ensure it isn't focusable
		const loadingContent = dom.append(this._loadingContainer, dom.$('.chat-loading-content'));
		const spinner = renderIcon(ThemeIcon.modify(Codicon.loading, 'spin'));
		spinner.setAttribute('aria-hidden', 'true');
		loadingContent.appendChild(spinner);
		const text = dom.append(loadingContent, dom.$('span'));
		text.textContent = message;
	}

	private hideLoadingInChatWidget(): void {
		if (this._loadingContainer) {
			this._loadingContainer.remove();
			this._loadingContainer = undefined;
		}
		if (this._editorContainer) {
			this._editorContainer.removeAttribute('aria-busy');
		}
	}

	override async setInput(input: ChatEditorInput, options: IChatEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		// Show loading indicator early for non-local sessions to prevent layout shifts
		let isContributedChatSession = false;
		const chatSessionType = input.getSessionType();
		if (chatSessionType !== localChatSessionType) {
			const loadingMessage = nls.localize('chatEditor.loadingSession', "Loading...");
			this.showLoadingInChatWidget(loadingMessage);
		}

		await super.setInput(input, options, context, token);
		if (token.isCancellationRequested) {
			this.hideLoadingInChatWidget();
			return;
		}

		if (!this.widget) {
			throw new Error('ChatEditor lifecycle issue: no editor widget');
		}

		if (chatSessionType !== localChatSessionType) {
			try {
				await raceCancellationError(this.chatSessionsService.canResolveChatSession(input.resource), token);
				const contributions = this.chatSessionsService.getAllChatSessionContributions();
				const contribution = contributions.find(c => c.type === chatSessionType);
				if (contribution) {
					this.widget.lockToCodingAgent(contribution.name, contribution.displayName, contribution.type);
					isContributedChatSession = true;
				} else {
					this.widget.unlockFromCodingAgent();
				}
			} catch (error) {
				this.hideLoadingInChatWidget();
				throw error;
			}
		} else {
			this.widget.unlockFromCodingAgent();
		}

		try {
			const editorModel = await raceCancellationError(input.resolve(), token);

			if (!editorModel) {
				throw new Error(`Failed to get model for chat editor. resource: ${input.sessionResource}`);
			}

			// Hide loading state before updating model
			if (chatSessionType !== localChatSessionType) {
				this.hideLoadingInChatWidget();
			}

			if (options?.modelInputState) {
				editorModel.model.inputModel.setState(options.modelInputState);
			}

			this.updateModel(editorModel.model);

			if (isContributedChatSession && options?.title?.preferred && input.sessionResource) {
				this.chatService.setChatSessionTitle(input.sessionResource, options.title.preferred);
			}
		} catch (error) {
			this.hideLoadingInChatWidget();
			throw error;
		}
	}

	private updateModel(model: IChatModel): void {
		this.widget.setModel(model);
	}

	override layout(dimension: dom.Dimension, position?: dom.IDomPosition | undefined): void {
		this.dimension = dimension;
		if (this.widget) {
			this.widget.layout(dimension.height, dimension.width);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditorInput.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Disposable, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { isEqual } from '../../../../base/common/resources.js';
import { truncate } from '../../../../base/common/strings.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import * as nls from '../../../../nls.js';
import { ConfirmResult, IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { EditorInputCapabilities, IEditorIdentifier, IEditorSerializer, IUntypedEditorInput, Verbosity } from '../../../common/editor.js';
import { EditorInput, IEditorCloseHandler } from '../../../common/editor/editorInput.js';
import { IChatEditingSession, ModifiedFileEntryState } from '../common/chatEditingService.js';
import { IChatModel } from '../common/chatModel.js';
import { IChatModelReference, IChatService } from '../common/chatService.js';
import { IChatSessionsService, localChatSessionType } from '../common/chatSessionsService.js';
import { LocalChatSessionUri, getChatSessionType } from '../common/chatUri.js';
import { ChatAgentLocation, ChatEditorTitleMaxLength } from '../common/constants.js';
import { IClearEditingSessionConfirmationOptions } from './actions/chatActions.js';
import type { IChatEditorOptions } from './chatEditor.js';

const ChatEditorIcon = registerIcon('chat-editor-label-icon', Codicon.chatSparkle, nls.localize('chatEditorLabelIcon', 'Icon of the chat editor label.'));

export class ChatEditorInput extends EditorInput implements IEditorCloseHandler {
	/** Maps input name strings to sets of active editor counts */
	static readonly countsInUseMap = new Map<string, Set<number>>();

	static readonly TypeID: string = 'workbench.input.chatSession';
	static readonly EditorID: string = 'workbench.editor.chatSession';

	private readonly inputCount: number;
	private readonly inputName: string;

	private _sessionResource: URI | undefined;

	/**
	 * Get the uri of the session this editor input is associated with.
	 *
	 * This should be preferred over using `resource` directly, as it handles cases where a chat editor becomes a session
	 */
	public get sessionResource(): URI | undefined { return this._sessionResource; }

	private hasCustomTitle: boolean = false;
	private didTransferOutEditingSession = false;
	private cachedIcon: ThemeIcon | URI | undefined;

	private readonly modelRef = this._register(new MutableDisposable<IChatModelReference>());

	private get model(): IChatModel | undefined {
		return this.modelRef.value?.object;
	}

	static getNewEditorUri(): URI {
		return ChatEditorUri.getNewEditorUri();
	}

	private static getNextCount(inputName: string): number {
		let count = 0;
		while (ChatEditorInput.countsInUseMap.get(inputName)?.has(count)) {
			count++;
		}

		return count;
	}

	constructor(
		readonly resource: URI,
		readonly options: IChatEditorOptions,
		@IChatService private readonly chatService: IChatService,
		@IDialogService private readonly dialogService: IDialogService,
		@IChatSessionsService private readonly chatSessionsService: IChatSessionsService,
	) {
		super();

		if (resource.scheme === Schemas.vscodeChatEditor) {
			const parsed = ChatEditorUri.parse(resource);
			if (!parsed || typeof parsed !== 'number') {
				throw new Error('Invalid chat URI');
			}
		} else if (resource.scheme === Schemas.vscodeLocalChatSession) {
			const localSessionId = LocalChatSessionUri.parseLocalSessionId(resource);
			if (!localSessionId) {
				throw new Error('Invalid local chat session URI');
			}
			this._sessionResource = resource;
		} else {
			this._sessionResource = resource;
		}

		// Check if we already have a custom title for this session
		const hasExistingCustomTitle = this._sessionResource && (
			this.chatService.getSession(this._sessionResource)?.title ||
			this.chatService.getPersistedSessionTitle(this._sessionResource)?.trim()
		);

		this.hasCustomTitle = Boolean(hasExistingCustomTitle);

		// Input counts are unique to the displayed fallback title
		this.inputName = options.title?.fallback ?? '';
		if (!ChatEditorInput.countsInUseMap.has(this.inputName)) {
			ChatEditorInput.countsInUseMap.set(this.inputName, new Set());
		}

		// Only allocate a count if we don't already have a custom title
		if (!this.hasCustomTitle) {
			this.inputCount = ChatEditorInput.getNextCount(this.inputName);
			ChatEditorInput.countsInUseMap.get(this.inputName)?.add(this.inputCount);
			this._register(toDisposable(() => {
				// Only remove if we haven't already removed it due to custom title
				if (!this.hasCustomTitle) {
					ChatEditorInput.countsInUseMap.get(this.inputName)?.delete(this.inputCount);
					if (ChatEditorInput.countsInUseMap.get(this.inputName)?.size === 0) {
						ChatEditorInput.countsInUseMap.delete(this.inputName);
					}
				}
			}));
		} else {
			this.inputCount = 0; // Not used when we have a custom title
		}
	}

	override closeHandler = this;

	showConfirm(): boolean {
		return !!(this.model && shouldShowClearEditingSessionConfirmation(this.model));
	}

	transferOutEditingSession(): IChatEditingSession | undefined {
		this.didTransferOutEditingSession = true;
		return this.model?.editingSession;
	}

	async confirm(editors: ReadonlyArray<IEditorIdentifier>): Promise<ConfirmResult> {
		if (!this.model?.editingSession || this.didTransferOutEditingSession || this.getSessionType() !== localChatSessionType) {
			return ConfirmResult.SAVE;
		}

		const titleOverride = nls.localize('chatEditorConfirmTitle', "Close Chat Editor");
		const messageOverride = nls.localize('chat.startEditing.confirmation.pending.message.default', "Closing the chat editor will end your current edit session.");
		const result = await showClearEditingSessionConfirmation(this.model, this.dialogService, { titleOverride, messageOverride });
		return result ? ConfirmResult.SAVE : ConfirmResult.CANCEL;
	}

	override get editorId(): string | undefined {
		return ChatEditorInput.EditorID;
	}

	override get capabilities(): EditorInputCapabilities {
		return super.capabilities | EditorInputCapabilities.Singleton | EditorInputCapabilities.CanDropIntoEditor;
	}

	override matches(otherInput: EditorInput | IUntypedEditorInput): boolean {
		if (!(otherInput instanceof ChatEditorInput)) {
			return false;
		}

		return isEqual(this.sessionResource, otherInput.sessionResource);
	}

	override get typeId(): string {
		return ChatEditorInput.TypeID;
	}

	override getName(): string {
		// If we have a resolved model, use its title
		if (this.model?.title) {
			// Only truncate if the default title is being used (don't truncate custom titles)
			return this.model.hasCustomTitle ? this.model.title : truncate(this.model.title, ChatEditorTitleMaxLength);
		}

		// If we have a sessionId but no resolved model, try to get the title from persisted sessions
		if (this._sessionResource) {
			// First try the active session registry
			const existingSession = this.chatService.getSession(this._sessionResource);
			if (existingSession?.title) {
				return existingSession.title;
			}

			// If not in active registry, try persisted session data
			const persistedTitle = this.chatService.getPersistedSessionTitle(this._sessionResource);
			if (persistedTitle && persistedTitle.trim()) { // Only use non-empty persisted titles
				return persistedTitle;
			}
		}

		// If a preferred title was provided in options, use it
		if (this.options.title?.preferred) {
			return this.options.title.preferred;
		}

		// Fall back to default naming pattern
		const inputCountSuffix = (this.inputCount > 0 ? ` ${this.inputCount + 1}` : '');
		const defaultName = this.options.title?.fallback ?? nls.localize('chatEditorName', "Chat");
		return defaultName + inputCountSuffix;
	}

	override getTitle(verbosity?: Verbosity): string {
		const name = this.getName();
		if (verbosity === Verbosity.LONG) { // Verbosity LONG is used for tooltips
			const sessionTypeDisplayName = this.getSessionTypeDisplayName();
			if (sessionTypeDisplayName) {
				return `${name} | ${sessionTypeDisplayName}`;
			}
		}
		return name;
	}

	private getSessionTypeDisplayName(): string | undefined {
		const sessionType = this.getSessionType();
		if (sessionType === localChatSessionType) {
			return;
		}
		const contributions = this.chatSessionsService.getAllChatSessionContributions();
		const contribution = contributions.find(c => c.type === sessionType);
		return contribution?.displayName;
	}

	override getIcon(): ThemeIcon | URI | undefined {
		const resolvedIcon = this.resolveIcon();
		if (resolvedIcon) {
			this.cachedIcon = resolvedIcon;
			return resolvedIcon;
		}

		// Fall back to default icon
		return ChatEditorIcon;
	}

	private resolveIcon(): ThemeIcon | URI | undefined {
		// TODO@osortega,@rebornix double check: Chat Session Item icon is reserved for chat session list and deprecated for chat session status. thus here we use session type icon. We may want to show status for the Editor Title.
		const sessionType = this.getSessionType();
		if (sessionType !== localChatSessionType) {
			const typeIcon = this.chatSessionsService.getIconForSessionType(sessionType);
			if (typeIcon) {
				return typeIcon;
			}
		}

		return undefined;
	}

	/**
	 * Returns chat session type from a URI, or {@linkcode localChatSessionType} if not specified or cannot be determined.
	 */
	public getSessionType(): string {
		return getChatSessionType(this.resource);
	}

	override async resolve(): Promise<ChatEditorModel | null> {
		const searchParams = new URLSearchParams(this.resource.query);
		const chatSessionType = searchParams.get('chatSessionType');
		const inputType = chatSessionType ?? this.resource.authority;

		if (this._sessionResource) {
			this.modelRef.value = await this.chatService.loadSessionForResource(this._sessionResource, ChatAgentLocation.Chat, CancellationToken.None);

			// For local session only, if we find no existing session, create a new one
			if (!this.model && LocalChatSessionUri.parseLocalSessionId(this._sessionResource)) {
				this.modelRef.value = this.chatService.startSession(ChatAgentLocation.Chat, { canUseTools: true });
			}
		} else if (!this.options.target) {
			this.modelRef.value = this.chatService.startSession(ChatAgentLocation.Chat, { canUseTools: !inputType });
		} else if (this.options.target.data) {
			this.modelRef.value = this.chatService.loadSessionFromContent(this.options.target.data);
		}

		if (!this.model || this.isDisposed()) {
			return null;
		}

		this._sessionResource = this.model.sessionResource;

		this._register(this.model.onDidChange((e) => {
			// When a custom title is set, we no longer need the numeric count
			if (e && e.kind === 'setCustomTitle' && !this.hasCustomTitle) {
				this.hasCustomTitle = true;
				ChatEditorInput.countsInUseMap.get(this.inputName)?.delete(this.inputCount);
				if (ChatEditorInput.countsInUseMap.get(this.inputName)?.size === 0) {
					ChatEditorInput.countsInUseMap.delete(this.inputName);
				}
			}
			// Invalidate icon cache when label changes
			this.cachedIcon = undefined;
			this._onDidChangeLabel.fire();
		}));

		// Check if icon has changed after model resolution
		const newIcon = this.resolveIcon();
		if (newIcon && (!this.cachedIcon || !this.iconsEqual(this.cachedIcon, newIcon))) {
			this.cachedIcon = newIcon;
		}

		this._onDidChangeLabel.fire();

		return this._register(new ChatEditorModel(this.model));
	}

	private iconsEqual(a: ThemeIcon | URI, b: ThemeIcon | URI): boolean {
		if (ThemeIcon.isThemeIcon(a) && ThemeIcon.isThemeIcon(b)) {
			return a.id === b.id;
		}
		if (a instanceof URI && b instanceof URI) {
			return a.toString() === b.toString();
		}
		return false;
	}

}

export class ChatEditorModel extends Disposable {
	private _isResolved = false;

	constructor(
		readonly model: IChatModel
	) { super(); }

	async resolve(): Promise<void> {
		this._isResolved = true;
	}

	isResolved(): boolean {
		return this._isResolved;
	}

	isDisposed(): boolean {
		return this._store.isDisposed;
	}
}


namespace ChatEditorUri {

	const scheme = Schemas.vscodeChatEditor;

	export function getNewEditorUri(): URI {
		const handle = Math.floor(Math.random() * 1e9);
		return URI.from({ scheme, path: `chat-${handle}` });
	}

	export function parse(resource: URI): number | undefined {
		if (resource.scheme !== scheme) {
			return undefined;
		}

		const match = resource.path.match(/chat-(\d+)/);
		const handleStr = match?.[1];
		if (typeof handleStr !== 'string') {
			return undefined;
		}

		const handle = parseInt(handleStr);
		if (isNaN(handle)) {
			return undefined;
		}

		return handle;
	}
}

interface ISerializedChatEditorInput {
	readonly options: IChatEditorOptions;
	readonly resource: URI;
	readonly sessionResource: URI | undefined;
}

export class ChatEditorInputSerializer implements IEditorSerializer {
	canSerialize(input: EditorInput): input is ChatEditorInput {
		return input instanceof ChatEditorInput && !!input.sessionResource;
	}

	serialize(input: EditorInput): string | undefined {
		if (!this.canSerialize(input)) {
			return undefined;
		}

		const obj: ISerializedChatEditorInput = {
			options: input.options,
			sessionResource: input.sessionResource,
			resource: input.resource,

		};
		return JSON.stringify(obj);
	}

	deserialize(instantiationService: IInstantiationService, serializedEditor: string): EditorInput | undefined {
		try {
			// Old inputs have a session id for local session
			const parsed: ISerializedChatEditorInput & { readonly sessionId: string | undefined } = JSON.parse(serializedEditor);

			// First if we have a modern session resource, use that
			if (parsed.sessionResource) {
				const sessionResource = URI.revive(parsed.sessionResource);
				return instantiationService.createInstance(ChatEditorInput, sessionResource, parsed.options);
			}

			// Otherwise check to see if we're a chat editor with a local session id
			let resource = URI.revive(parsed.resource);
			if (resource.scheme === Schemas.vscodeChatEditor && parsed.sessionId) {
				resource = LocalChatSessionUri.forSession(parsed.sessionId);
			}

			return instantiationService.createInstance(ChatEditorInput, resource, parsed.options);
		} catch (err) {
			return undefined;
		}
	}
}

export async function showClearEditingSessionConfirmation(model: IChatModel, dialogService: IDialogService, options?: IClearEditingSessionConfirmationOptions): Promise<boolean> {
	const undecidedEdits = shouldShowClearEditingSessionConfirmation(model, options);
	if (!undecidedEdits) {
		return true; // safe to dispose without confirmation
	}

	const defaultPhrase = nls.localize('chat.startEditing.confirmation.pending.message.default1', "Starting a new chat will end your current edit session.");
	const defaultTitle = nls.localize('chat.startEditing.confirmation.title', "Start new chat?");
	const phrase = options?.messageOverride ?? defaultPhrase;
	const title = options?.titleOverride ?? defaultTitle;

	const { result } = await dialogService.prompt({
		title,
		message: phrase + ' ' + nls.localize('chat.startEditing.confirmation.pending.message.2', "Do you want to keep pending edits to {0} files?", undecidedEdits),
		type: 'info',
		cancelButton: true,
		buttons: [
			{
				label: nls.localize('chat.startEditing.confirmation.acceptEdits', "Keep & Continue"),
				run: async () => {
					await model.editingSession!.accept();
					return true;
				}
			},
			{
				label: nls.localize('chat.startEditing.confirmation.discardEdits', "Undo & Continue"),
				run: async () => {
					await model.editingSession!.reject();
					return true;
				}
			}
		],
	});

	return Boolean(result);
}

/** Returns the number of files in the  model's modifications that need a prompt before saving */
export function shouldShowClearEditingSessionConfirmation(model: IChatModel, options?: IClearEditingSessionConfirmationOptions): number {
	if (!model.editingSession || (model.willKeepAlive && !options?.isArchiveAction)) {
		return 0; // safe to dispose without confirmation
	}

	const currentEdits = model.editingSession.entries.get();
	const undecidedEdits = currentEdits.filter((edit) => edit.state.get() === ModifiedFileEntryState.Modified);
	return undecidedEdits.length;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatElicitationRequestPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatElicitationRequestPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAction } from '../../../../base/common/actions.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IObservable, observableValue } from '../../../../base/common/observable.js';
import { ElicitationState, IChatElicitationRequest, IChatElicitationRequestSerialized } from '../common/chatService.js';
import { ToolDataSource } from '../common/languageModelToolsService.js';

export class ChatElicitationRequestPart extends Disposable implements IChatElicitationRequest {
	public readonly kind = 'elicitation2';
	public state = observableValue('state', ElicitationState.Pending);
	public acceptedResult?: Record<string, unknown>;

	private readonly _isHiddenValue = observableValue<boolean>('isHidden', false);
	public readonly isHidden: IObservable<boolean> = this._isHiddenValue;
	public reject?: (() => Promise<void>) | undefined;

	constructor(
		public readonly title: string | IMarkdownString,
		public readonly message: string | IMarkdownString,
		public readonly subtitle: string | IMarkdownString,
		public readonly acceptButtonLabel: string,
		public readonly rejectButtonLabel: string | undefined,
		// True when the primary action is accepted, otherwise the action that was selected
		private readonly _accept: (value: IAction | true) => Promise<ElicitationState>,
		reject?: () => Promise<ElicitationState>,
		public readonly source?: ToolDataSource,
		public readonly moreActions?: IAction[],
		public readonly onHide?: () => void,
	) {
		super();

		if (reject) {
			this.reject = async () => {
				const state = await reject!();
				this.state.set(state, undefined);
			};
		}
	}

	accept(value: IAction | true): Promise<void> {
		return this._accept(value).then(state => {
			this.state.set(state, undefined);
		});
	}

	hide(): void {
		if (this._isHiddenValue.get()) {
			return;
		}
		this._isHiddenValue.set(true, undefined, undefined);
		this.onHide?.();
		this.dispose();
	}

	public toJSON() {
		const state = this.state.get();

		return {
			kind: 'elicitationSerialized',
			title: this.title,
			message: this.message,
			state: state === ElicitationState.Pending ? ElicitationState.Rejected : state,
			acceptedResult: this.acceptedResult,
			subtitle: this.subtitle,
			source: this.source,
			isHidden: this._isHiddenValue.get(),
		} satisfies IChatElicitationRequestSerialized;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatFollowups.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatFollowups.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { Button, IButtonStyles } from '../../../../base/browser/ui/button/button.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { IChatAgentService } from '../common/chatAgents.js';
import { formatChatQuestion } from '../common/chatParserTypes.js';
import { IChatFollowup } from '../common/chatService.js';
import { ChatAgentLocation } from '../common/constants.js';

const $ = dom.$;

export class ChatFollowups<T extends IChatFollowup> extends Disposable {
	constructor(
		container: HTMLElement,
		followups: T[],
		private readonly location: ChatAgentLocation,
		private readonly options: IButtonStyles | undefined,
		private readonly clickHandler: (followup: T) => void,
		@IChatAgentService private readonly chatAgentService: IChatAgentService
	) {
		super();

		const followupsContainer = dom.append(container, $('.interactive-session-followups'));
		followups.forEach(followup => this.renderFollowup(followupsContainer, followup));
	}

	private renderFollowup(container: HTMLElement, followup: T): void {

		if (!this.chatAgentService.getDefaultAgent(this.location)) {
			// No default agent yet, which affects how followups are rendered, so can't render this yet
			return;
		}

		const tooltipPrefix = formatChatQuestion(this.chatAgentService, this.location, '', followup.agentId, followup.subCommand);
		if (tooltipPrefix === undefined) {
			return;
		}

		const baseTitle = followup.kind === 'reply' ?
			(followup.title || followup.message)
			: followup.title;
		const message = followup.kind === 'reply' ? followup.message : followup.title;
		const tooltip = (tooltipPrefix +
			(followup.tooltip || message)).trim();
		const button = this._register(new Button(container, { ...this.options, title: tooltip }));
		if (followup.kind === 'reply') {
			button.element.classList.add('interactive-followup-reply');
		} else if (followup.kind === 'command') {
			button.element.classList.add('interactive-followup-command');
		}
		button.element.ariaLabel = localize('followUpAriaLabel', "Follow up question: {0}", baseTitle);
		button.label = new MarkdownString(baseTitle);

		this._register(button.onDidClick(() => this.clickHandler(followup)));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatImageUtils.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatImageUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { decodeBase64, VSBuffer } from '../../../../base/common/buffer.js';
import { joinPath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { ILogService } from '../../../../platform/log/common/log.js';

/**
 * Resizes an image provided as a UInt8Array string. Resizing is based on Open AI's algorithm for tokenzing images.
 * https://platform.openai.com/docs/guides/vision#calculating-costs
 * @param data - The UInt8Array string of the image to resize.
 * @returns A promise that resolves to the UInt8Array string of the resized image.
 */

export async function resizeImage(data: Uint8Array | string, mimeType?: string): Promise<Uint8Array> {
	const isGif = mimeType === 'image/gif';

	if (typeof data === 'string') {
		data = convertStringToUInt8Array(data);
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

export function convertStringToUInt8Array(data: string): Uint8Array {
	const base64Data = data.includes(',') ? data.split(',')[1] : data;
	if (isValidBase64(base64Data)) {
		return decodeBase64(base64Data).buffer;
	}
	return new TextEncoder().encode(data);
}

// Only used for URLs
export function convertUint8ArrayToString(data: Uint8Array): string {
	try {
		const decoder = new TextDecoder();
		const decodedString = decoder.decode(data);
		return decodedString;
	} catch {
		return '';
	}
}

function isValidBase64(str: string): boolean {
	// checks if the string is a valid base64 string that is NOT encoded
	return /^[A-Za-z0-9+/]*={0,2}$/.test(str) && (() => {
		try {
			atob(str);
			return true;
		} catch {
			return false;
		}
	})();
}

export async function createFileForMedia(fileService: IFileService, imagesFolder: URI, dataTransfer: Uint8Array, mimeType: string): Promise<URI | undefined> {
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

export async function cleanupOldImages(fileService: IFileService, logService: ILogService, imagesFolder: URI): Promise<void> {
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
			const timestamp = getTimestampFromFilename(file.name);
			if (timestamp && (Date.now() - timestamp > duration)) {
				await fileService.del(file.resource);
			}
		} catch (err) {
			logService.error('Failed to clean up old images', err);
		}
	}));
}

function getTimestampFromFilename(filename: string): number | undefined {
	const match = filename.match(/image-(\d+)\./);
	if (match) {
		return parseInt(match[1], 10);
	}
	return undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatInlineAnchorWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatInlineAnchorWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { StandardMouseEvent } from '../../../../base/browser/mouseEvent.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { IRange } from '../../../../editor/common/core/range.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { Location, SymbolKinds } from '../../../../editor/common/languages.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { getIconClasses } from '../../../../editor/common/services/getIconClasses.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { DefinitionAction } from '../../../../editor/contrib/gotoSymbol/browser/goToCommands.js';
import * as nls from '../../../../nls.js';
import { getFlatContextMenuActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { Action2, IMenuService, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IResourceStat } from '../../../../platform/dnd/browser/dnd.js';
import { ITextResourceEditorInput } from '../../../../platform/editor/common/editor.js';
import { FileKind, IFileService } from '../../../../platform/files/common/files.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { FolderThemeIcon, IThemeService } from '../../../../platform/theme/common/themeService.js';
import { fillEditorsDragData } from '../../../browser/dnd.js';
import { ResourceContextKey } from '../../../common/contextkeys.js';
import { IEditorService, SIDE_GROUP } from '../../../services/editor/common/editorService.js';
import { INotebookDocumentService } from '../../../services/notebook/common/notebookDocumentService.js';
import { ExplorerFolderContext } from '../../files/common/files.js';
import { IWorkspaceSymbol } from '../../search/common/search.js';
import { IChatContentInlineReference } from '../common/chatService.js';
import { IChatWidgetService } from './chat.js';
import { chatAttachmentResourceContextKey, hookUpSymbolAttachmentDragAndContextMenu } from './chatAttachmentWidgets.js';
import { IChatMarkdownAnchorService } from './chatContentParts/chatMarkdownAnchorService.js';

type ContentRefData =
	| { readonly kind: 'symbol'; readonly symbol: IWorkspaceSymbol }
	| {
		readonly kind?: undefined;
		readonly uri: URI;
		readonly range?: IRange;
	};

export function renderFileWidgets(element: HTMLElement, instantiationService: IInstantiationService, chatMarkdownAnchorService: IChatMarkdownAnchorService, disposables: DisposableStore) {
	// eslint-disable-next-line no-restricted-syntax
	const links = element.querySelectorAll('a');
	links.forEach(a => {
		// Empty link text -> render file widget
		if (!a.textContent?.trim()) {
			const href = a.getAttribute('data-href');
			const uri = href ? URI.parse(href) : undefined;
			if (uri?.scheme) {
				const widget = instantiationService.createInstance(InlineAnchorWidget, a, { kind: 'inlineReference', inlineReference: uri });
				disposables.add(chatMarkdownAnchorService.register(widget));
				disposables.add(widget);
			}
		}
	});
}

export class InlineAnchorWidget extends Disposable {

	public static readonly className = 'chat-inline-anchor-widget';

	private readonly _chatResourceContext: IContextKey<string>;

	readonly data: ContentRefData;

	constructor(
		private readonly element: HTMLAnchorElement | HTMLElement,
		public readonly inlineReference: IChatContentInlineReference,
		@IContextKeyService originalContextKeyService: IContextKeyService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IFileService fileService: IFileService,
		@IHoverService hoverService: IHoverService,
		@IInstantiationService instantiationService: IInstantiationService,
		@ILabelService labelService: ILabelService,
		@ILanguageService languageService: ILanguageService,
		@IMenuService menuService: IMenuService,
		@IModelService modelService: IModelService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@INotebookDocumentService private readonly notebookDocumentService: INotebookDocumentService,
	) {
		super();

		// TODO: Make sure we handle updates from an inlineReference being `resolved` late

		this.data = 'uri' in inlineReference.inlineReference
			? inlineReference.inlineReference
			: 'name' in inlineReference.inlineReference
				? { kind: 'symbol', symbol: inlineReference.inlineReference }
				: { uri: inlineReference.inlineReference };

		const contextKeyService = this._register(originalContextKeyService.createScoped(element));
		this._chatResourceContext = chatAttachmentResourceContextKey.bindTo(contextKeyService);

		element.classList.add(InlineAnchorWidget.className, 'show-file-icons');

		let iconText: Array<string | HTMLElement>;
		let iconClasses: string[];

		let location: { readonly uri: URI; readonly range?: IRange };

		let updateContextKeys: (() => Promise<void>) | undefined;
		if (this.data.kind === 'symbol') {
			const symbol = this.data.symbol;

			location = this.data.symbol.location;
			iconText = [this.data.symbol.name];
			iconClasses = ['codicon', ...getIconClasses(modelService, languageService, undefined, undefined, SymbolKinds.toIcon(symbol.kind))];

			this._store.add(instantiationService.invokeFunction(accessor => hookUpSymbolAttachmentDragAndContextMenu(accessor, element, contextKeyService, { value: symbol.location, name: symbol.name, kind: symbol.kind }, MenuId.ChatInlineSymbolAnchorContext)));
		} else {
			location = this.data;

			const filePathLabel = labelService.getUriBasenameLabel(location.uri);
			if (location.range && this.data.kind !== 'symbol') {
				const suffix = location.range.startLineNumber === location.range.endLineNumber
					? `:${location.range.startLineNumber}`
					: `:${location.range.startLineNumber}-${location.range.endLineNumber}`;

				iconText = [filePathLabel, dom.$('span.label-suffix', undefined, suffix)];
			} else if (location.uri.scheme === 'vscode-notebook-cell' && this.data.kind !== 'symbol') {
				iconText = [`${filePathLabel} • cell${this.getCellIndex(location.uri)}`];
			} else {
				iconText = [filePathLabel];
			}

			let fileKind = location.uri.path.endsWith('/') ? FileKind.FOLDER : FileKind.FILE;
			const recomputeIconClasses = () => getIconClasses(modelService, languageService, location.uri, fileKind, fileKind === FileKind.FOLDER && !themeService.getFileIconTheme().hasFolderIcons ? FolderThemeIcon : undefined);

			iconClasses = recomputeIconClasses();

			const refreshIconClasses = () => {
				iconEl.classList.remove(...iconClasses);
				iconClasses = recomputeIconClasses();
				iconEl.classList.add(...iconClasses);
			};

			this._register(themeService.onDidFileIconThemeChange(() => {
				refreshIconClasses();
			}));

			const isFolderContext = ExplorerFolderContext.bindTo(contextKeyService);
			fileService.stat(location.uri)
				.then(stat => {
					isFolderContext.set(stat.isDirectory);
					if (stat.isDirectory) {
						fileKind = FileKind.FOLDER;
						refreshIconClasses();
					}
				})
				.catch(() => { });

			// Context menu
			this._register(dom.addDisposableListener(element, dom.EventType.CONTEXT_MENU, async domEvent => {
				const event = new StandardMouseEvent(dom.getWindow(domEvent), domEvent);
				dom.EventHelper.stop(domEvent, true);

				try {
					await updateContextKeys?.();
				} catch (e) {
					console.error(e);
				}

				if (this._store.isDisposed) {
					return;
				}

				contextMenuService.showContextMenu({
					contextKeyService,
					getAnchor: () => event,
					getActions: () => {
						const menu = menuService.getMenuActions(MenuId.ChatInlineResourceAnchorContext, contextKeyService, { arg: location.uri });
						return getFlatContextMenuActions(menu);
					},
				});
			}));

			// Add line range label for screen readers
			if (location.range) {
				if (location.range.startLineNumber === location.range.endLineNumber) {
					element.setAttribute('aria-label', nls.localize('chat.inlineAnchor.ariaLabel.line', "{0} line {1}", filePathLabel, location.range.startLineNumber));
				} else {
					element.setAttribute('aria-label', nls.localize('chat.inlineAnchor.ariaLabel.range', "{0} lines {1} to {2}", filePathLabel, location.range.startLineNumber, location.range.endLineNumber));
				}
			}
		}

		const resourceContextKey = this._register(new ResourceContextKey(contextKeyService, fileService, languageService, modelService));
		resourceContextKey.set(location.uri);
		this._chatResourceContext.set(location.uri.toString());

		const iconEl = dom.$('span.icon');
		iconEl.classList.add(...iconClasses);
		element.replaceChildren(iconEl, dom.$('span.icon-label', {}, ...iconText));

		const fragment = location.range ? `${location.range.startLineNumber},${location.range.startColumn}` : '';
		element.setAttribute('data-href', (fragment ? location.uri.with({ fragment }) : location.uri).toString());

		// Hover
		const relativeLabel = labelService.getUriLabel(location.uri, { relative: true });
		this._register(hoverService.setupManagedHover(getDefaultHoverDelegate('element'), element, relativeLabel));

		// Drag and drop
		if (this.data.kind !== 'symbol') {
			element.draggable = true;
			this._register(dom.addDisposableListener(element, 'dragstart', e => {
				const stat: IResourceStat = {
					resource: location.uri,
					selection: location.range,
				};
				instantiationService.invokeFunction(accessor => fillEditorsDragData(accessor, [stat], e));


				e.dataTransfer?.setDragImage(element, 0, 0);
			}));
		}
	}

	getHTMLElement(): HTMLElement {
		return this.element;
	}

	private getCellIndex(location: URI) {
		const notebook = this.notebookDocumentService.getNotebook(location);
		const index = notebook?.getCellIndex(location) ?? -1;
		return index >= 0 ? ` ${index + 1}` : '';
	}
}

//#region Resource context menu

registerAction2(class AddFileToChatAction extends Action2 {

	static readonly id = 'chat.inlineResourceAnchor.addFileToChat';

	constructor() {
		super({
			id: AddFileToChatAction.id,
			title: nls.localize2('actions.attach.label', "Add File to Chat"),
			menu: [{
				id: MenuId.ChatInlineResourceAnchorContext,
				group: 'chat',
				order: 1,
				when: ExplorerFolderContext.negate(),
			}]
		});
	}

	override async run(accessor: ServicesAccessor, resource: URI): Promise<void> {
		const chatWidgetService = accessor.get(IChatWidgetService);

		const widget = chatWidgetService.lastFocusedWidget;
		if (widget) {
			widget.attachmentModel.addFile(resource);

		}
	}
});

//#endregion

//#region Resource keybindings

registerAction2(class CopyResourceAction extends Action2 {

	static readonly id = 'chat.inlineResourceAnchor.copyResource';

	constructor() {
		super({
			id: CopyResourceAction.id,
			title: nls.localize2('actions.copy.label', "Copy"),
			f1: false,
			precondition: chatAttachmentResourceContextKey,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.KeyC,
			}
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const chatWidgetService = accessor.get(IChatMarkdownAnchorService);
		const clipboardService = accessor.get(IClipboardService);

		const anchor = chatWidgetService.lastFocusedAnchor;
		if (!anchor) {
			return;
		}

		// TODO: we should also write out the standard mime types so that external programs can use them
		// like how `fillEditorsDragData` works but without having an event to work with.
		const resource = anchor.data.kind === 'symbol' ? anchor.data.symbol.location.uri : anchor.data.uri;
		clipboardService.writeResources([resource]);
	}
});

registerAction2(class OpenToSideResourceAction extends Action2 {

	static readonly id = 'chat.inlineResourceAnchor.openToSide';

	constructor() {
		super({
			id: OpenToSideResourceAction.id,
			title: nls.localize2('actions.openToSide.label', "Open to the Side"),
			f1: false,
			precondition: chatAttachmentResourceContextKey,
			keybinding: {
				weight: KeybindingWeight.ExternalExtension + 2,
				primary: KeyMod.CtrlCmd | KeyCode.Enter,
				mac: {
					primary: KeyMod.WinCtrl | KeyCode.Enter
				},
			},
			menu: [MenuId.ChatInlineSymbolAnchorContext, MenuId.ChatInputSymbolAttachmentContext].map(id => ({
				id: id,
				group: 'navigation',
				order: 1
			}))
		});
	}

	override async run(accessor: ServicesAccessor, arg?: Location | URI): Promise<void> {
		const editorService = accessor.get(IEditorService);

		const target = this.getTarget(accessor, arg);
		if (!target) {
			return;
		}

		const input: ITextResourceEditorInput = URI.isUri(target)
			? { resource: target }
			: {
				resource: target.uri, options: {
					selection: {
						startColumn: target.range.startColumn,
						startLineNumber: target.range.startLineNumber,
					}
				}
			};

		await editorService.openEditors([input], SIDE_GROUP);
	}

	private getTarget(accessor: ServicesAccessor, arg: URI | Location | undefined): Location | URI | undefined {
		const chatWidgetService = accessor.get(IChatMarkdownAnchorService);

		if (arg) {
			return arg;
		}

		const anchor = chatWidgetService.lastFocusedAnchor;
		if (!anchor) {
			return undefined;
		}

		return anchor.data.kind === 'symbol' ? anchor.data.symbol.location : anchor.data.uri;
	}
});

//#endregion

//#region Symbol context menu

registerAction2(class GoToDefinitionAction extends Action2 {

	static readonly id = 'chat.inlineSymbolAnchor.goToDefinition';

	constructor() {
		super({
			id: GoToDefinitionAction.id,
			title: {
				...nls.localize2('actions.goToDecl.label', "Go to Definition"),
				mnemonicTitle: nls.localize({ key: 'miGotoDefinition', comment: ['&& denotes a mnemonic'] }, "Go to &&Definition"),
			},
			menu: [MenuId.ChatInlineSymbolAnchorContext, MenuId.ChatInputSymbolAttachmentContext].map(id => ({
				id,
				group: '4_symbol_nav',
				order: 1.1,
				when: EditorContextKeys.hasDefinitionProvider,
			}))
		});
	}

	override async run(accessor: ServicesAccessor, location: Location): Promise<unknown> {
		const editorService = accessor.get(ICodeEditorService);
		const instantiationService = accessor.get(IInstantiationService);

		await openEditorWithSelection(editorService, location);

		const action = new DefinitionAction({ openToSide: false, openInPeek: false, muteMessage: true }, { title: { value: '', original: '' }, id: '', precondition: undefined });
		return instantiationService.invokeFunction(accessor => action.run(accessor));
	}
});

async function openEditorWithSelection(editorService: ICodeEditorService, location: Location) {
	await editorService.openCodeEditor({
		resource: location.uri, options: {
			selection: {
				startColumn: location.range.startColumn,
				startLineNumber: location.range.startLineNumber,
			}
		}
	}, null);
}

async function runGoToCommand(accessor: ServicesAccessor, command: string, location: Location) {
	const editorService = accessor.get(ICodeEditorService);
	const commandService = accessor.get(ICommandService);

	await openEditorWithSelection(editorService, location);

	return commandService.executeCommand(command);
}

registerAction2(class GoToTypeDefinitionsAction extends Action2 {

	static readonly id = 'chat.inlineSymbolAnchor.goToTypeDefinitions';

	constructor() {
		super({
			id: GoToTypeDefinitionsAction.id,
			title: {
				...nls.localize2('goToTypeDefinitions.label', "Go to Type Definitions"),
				mnemonicTitle: nls.localize({ key: 'miGotoTypeDefinition', comment: ['&& denotes a mnemonic'] }, "Go to &&Type Definitions"),
			},
			menu: [MenuId.ChatInlineSymbolAnchorContext, MenuId.ChatInputSymbolAttachmentContext].map(id => ({
				id,
				group: '4_symbol_nav',
				order: 1.1,
				when: EditorContextKeys.hasTypeDefinitionProvider,
			})),
		});
	}

	override async run(accessor: ServicesAccessor, location: Location): Promise<void> {
		await runGoToCommand(accessor, 'editor.action.goToTypeDefinition', location);
	}
});

registerAction2(class GoToImplementations extends Action2 {

	static readonly id = 'chat.inlineSymbolAnchor.goToImplementations';

	constructor() {
		super({
			id: GoToImplementations.id,
			title: {
				...nls.localize2('goToImplementations.label', "Go to Implementations"),
				mnemonicTitle: nls.localize({ key: 'miGotoImplementations', comment: ['&& denotes a mnemonic'] }, "Go to &&Implementations"),
			},
			menu: [MenuId.ChatInlineSymbolAnchorContext, MenuId.ChatInputSymbolAttachmentContext].map(id => ({
				id,
				group: '4_symbol_nav',
				order: 1.2,
				when: EditorContextKeys.hasImplementationProvider,
			})),
		});
	}

	override async run(accessor: ServicesAccessor, location: Location): Promise<void> {
		await runGoToCommand(accessor, 'editor.action.goToImplementation', location);
	}
});

registerAction2(class GoToReferencesAction extends Action2 {

	static readonly id = 'chat.inlineSymbolAnchor.goToReferences';

	constructor() {
		super({
			id: GoToReferencesAction.id,
			title: {
				...nls.localize2('goToReferences.label', "Go to References"),
				mnemonicTitle: nls.localize({ key: 'miGotoReference', comment: ['&& denotes a mnemonic'] }, "Go to &&References"),
			},
			menu: [MenuId.ChatInlineSymbolAnchorContext, MenuId.ChatInputSymbolAttachmentContext].map(id => ({
				id,
				group: '4_symbol_nav',
				order: 1.3,
				when: EditorContextKeys.hasReferenceProvider,
			})),
		});
	}

	override async run(accessor: ServicesAccessor, location: Location): Promise<void> {
		await runGoToCommand(accessor, 'editor.action.goToReferences', location);
	}
});

//#endregion
```

--------------------------------------------------------------------------------

````

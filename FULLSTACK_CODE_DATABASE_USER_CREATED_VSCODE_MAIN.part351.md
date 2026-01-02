---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 351
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 351 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/browser/actions/codeBlockOperations.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/actions/codeBlockOperations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { AsyncIterableObject } from '../../../../../base/common/async.js';
import { VSBuffer } from '../../../../../base/common/buffer.js';
import { CancellationToken, CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { CharCode } from '../../../../../base/common/charCode.js';
import { isCancellationError } from '../../../../../base/common/errors.js';
import { isEqual } from '../../../../../base/common/resources.js';
import * as strings from '../../../../../base/common/strings.js';
import { URI } from '../../../../../base/common/uri.js';
import { getCodeEditor, IActiveCodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { IBulkEditService, ResourceTextEdit } from '../../../../../editor/browser/services/bulkEditService.js';
import { ICodeEditorService } from '../../../../../editor/browser/services/codeEditorService.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { TextEdit } from '../../../../../editor/common/languages.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { EditDeltaInfo, EditSuggestionId } from '../../../../../editor/common/textModelEditSource.js';
import { localize } from '../../../../../nls.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { IProgressService, ProgressLocation } from '../../../../../platform/progress/common/progress.js';
import { IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { ITextFileService } from '../../../../services/textfile/common/textfiles.js';
import { IAiEditTelemetryService } from '../../../editTelemetry/browser/telemetry/aiEditTelemetry/aiEditTelemetryService.js';
import { reviewEdits, reviewNotebookEdits } from '../../../inlineChat/browser/inlineChatController.js';
import { insertCell } from '../../../notebook/browser/controller/cellOperations.js';
import { IActiveNotebookEditor, INotebookEditor } from '../../../notebook/browser/notebookBrowser.js';
import { CellKind, ICellEditOperation, NOTEBOOK_EDITOR_ID } from '../../../notebook/common/notebookCommon.js';
import { INotebookService } from '../../../notebook/common/notebookService.js';
import { ICodeMapperCodeBlock, ICodeMapperRequest, ICodeMapperResponse, ICodeMapperService } from '../../common/chatCodeMapperService.js';
import { ChatUserAction, IChatService } from '../../common/chatService.js';
import { IChatRequestViewModel, isRequestVM, isResponseVM } from '../../common/chatViewModel.js';
import { ICodeBlockActionContext } from '../codeBlockPart.js';

export class InsertCodeBlockOperation {
	constructor(
		@IEditorService private readonly editorService: IEditorService,
		@ITextFileService private readonly textFileService: ITextFileService,
		@IBulkEditService private readonly bulkEditService: IBulkEditService,
		@ICodeEditorService private readonly codeEditorService: ICodeEditorService,
		@IChatService private readonly chatService: IChatService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IDialogService private readonly dialogService: IDialogService,
		@IAiEditTelemetryService private readonly aiEditTelemetryService: IAiEditTelemetryService,
	) {
	}

	public async run(context: ICodeBlockActionContext) {
		const activeEditorControl = getEditableActiveCodeEditor(this.editorService);
		if (activeEditorControl) {
			await this.handleTextEditor(activeEditorControl, context);
		} else {
			const activeNotebookEditor = getActiveNotebookEditor(this.editorService);
			if (activeNotebookEditor) {
				await this.handleNotebookEditor(activeNotebookEditor, context);
			} else {
				this.notify(localize('insertCodeBlock.noActiveEditor', "To insert the code block, open a code editor or notebook editor and set the cursor at the location where to insert the code block."));
			}
		}

		if (isResponseVM(context.element)) {
			const requestId = context.element.requestId;
			const request = context.element.session.getItems().find(item => item.id === requestId && isRequestVM(item)) as IChatRequestViewModel | undefined;
			notifyUserAction(this.chatService, context, {
				kind: 'insert',
				codeBlockIndex: context.codeBlockIndex,
				totalCharacters: context.code.length,
				totalLines: context.code.split('\n').length,
				languageId: context.languageId,
				modelId: request?.modelId ?? '',
			});

			const codeBlockInfo = context.element.model.codeBlockInfos?.at(context.codeBlockIndex);

			this.aiEditTelemetryService.handleCodeAccepted({
				acceptanceMethod: 'insertAtCursor',
				suggestionId: codeBlockInfo?.suggestionId,
				editDeltaInfo: EditDeltaInfo.fromText(context.code),
				feature: 'sideBarChat',
				languageId: context.languageId,
				modeId: context.element.model.request?.modeInfo?.modeId,
				modelId: request?.modelId,
				presentation: 'codeBlock',
				applyCodeBlockSuggestionId: undefined,
				source: undefined,
			});
		}
	}

	private async handleNotebookEditor(notebookEditor: IActiveNotebookEditor, codeBlockContext: ICodeBlockActionContext): Promise<boolean> {
		if (notebookEditor.isReadOnly) {
			this.notify(localize('insertCodeBlock.readonlyNotebook', "Cannot insert the code block to read-only notebook editor."));
			return false;
		}
		const focusRange = notebookEditor.getFocus();
		const next = Math.max(focusRange.end - 1, 0);
		insertCell(this.languageService, notebookEditor, next, CellKind.Code, 'below', codeBlockContext.code, true);
		return true;
	}

	private async handleTextEditor(codeEditor: IActiveCodeEditor, codeBlockContext: ICodeBlockActionContext): Promise<boolean> {
		const activeModel = codeEditor.getModel();
		if (isReadOnly(activeModel, this.textFileService)) {
			this.notify(localize('insertCodeBlock.readonly', "Cannot insert the code block to read-only code editor."));
			return false;
		}

		const range = codeEditor.getSelection() ?? new Range(activeModel.getLineCount(), 1, activeModel.getLineCount(), 1);
		const text = reindent(codeBlockContext.code, activeModel, range.startLineNumber);

		const edits = [new ResourceTextEdit(activeModel.uri, { range, text })];
		await this.bulkEditService.apply(edits);
		this.codeEditorService.listCodeEditors().find(editor => editor.getModel()?.uri.toString() === activeModel.uri.toString())?.focus();
		return true;
	}

	private notify(message: string) {
		//this.notificationService.notify({ severity: Severity.Info, message });
		this.dialogService.info(message);
	}
}

type IComputeEditsResult = { readonly editsProposed: boolean; readonly codeMapper?: string };

export class ApplyCodeBlockOperation {

	constructor(
		@IEditorService private readonly editorService: IEditorService,
		@ITextFileService private readonly textFileService: ITextFileService,
		@IChatService private readonly chatService: IChatService,
		@IFileService private readonly fileService: IFileService,
		@IDialogService private readonly dialogService: IDialogService,
		@ILogService private readonly logService: ILogService,
		@ICodeMapperService private readonly codeMapperService: ICodeMapperService,
		@IProgressService private readonly progressService: IProgressService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@ILabelService private readonly labelService: ILabelService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@INotebookService private readonly notebookService: INotebookService,
	) {
	}

	public async run(context: ICodeBlockActionContext): Promise<void> {
		let activeEditorControl = getEditableActiveCodeEditor(this.editorService);

		const codemapperUri = await this.evaluateURIToUse(context.codemapperUri, activeEditorControl);
		if (!codemapperUri) {
			return;
		}

		if (codemapperUri && !isEqual(activeEditorControl?.getModel().uri, codemapperUri) && !this.notebookService.hasSupportedNotebooks(codemapperUri)) {
			// reveal the target file
			try {
				const editorPane = await this.editorService.openEditor({ resource: codemapperUri });
				const codeEditor = getCodeEditor(editorPane?.getControl());
				if (codeEditor && codeEditor.hasModel()) {
					this.tryToRevealCodeBlock(codeEditor, context.code);
					activeEditorControl = codeEditor;
				} else {
					this.notify(localize('applyCodeBlock.errorOpeningFile', "Failed to open {0} in a code editor.", codemapperUri.toString()));
					return;
				}
			} catch (e) {
				this.logService.info('[ApplyCodeBlockOperation] error opening code mapper file', codemapperUri, e);
				return;
			}
		}

		let codeBlockSuggestionId: EditSuggestionId | undefined = undefined;

		if (isResponseVM(context.element)) {
			const codeBlockInfo = context.element.model.codeBlockInfos?.at(context.codeBlockIndex);
			if (codeBlockInfo) {
				codeBlockSuggestionId = codeBlockInfo.suggestionId;
			}
		}

		let result: IComputeEditsResult | undefined = undefined;

		if (activeEditorControl && !this.notebookService.hasSupportedNotebooks(codemapperUri)) {
			result = await this.handleTextEditor(activeEditorControl, context.chatSessionResource, context.code, codeBlockSuggestionId);
		} else {
			const activeNotebookEditor = getActiveNotebookEditor(this.editorService);
			if (activeNotebookEditor) {
				result = await this.handleNotebookEditor(activeNotebookEditor, context.chatSessionResource, context.code);
			} else {
				this.notify(localize('applyCodeBlock.noActiveEditor', "To apply this code block, open a code or notebook editor."));
			}
		}

		if (isResponseVM(context.element)) {
			const requestId = context.element.requestId;
			const request = context.element.session.getItems().find(item => item.id === requestId && isRequestVM(item)) as IChatRequestViewModel | undefined;
			notifyUserAction(this.chatService, context, {
				kind: 'apply',
				codeBlockIndex: context.codeBlockIndex,
				totalCharacters: context.code.length,
				codeMapper: result?.codeMapper,
				editsProposed: !!result?.editsProposed,
				totalLines: context.code.split('\n').length,
				modelId: request?.modelId ?? '',
				languageId: context.languageId,
			});
		}
	}

	private async evaluateURIToUse(resource: URI | undefined, activeEditorControl: IActiveCodeEditor | undefined): Promise<URI | undefined> {
		if (resource && await this.fileService.exists(resource)) {
			return resource;
		}

		const activeEditorOption = activeEditorControl?.getModel().uri ? { label: localize('activeEditor', "Active editor '{0}'", this.labelService.getUriLabel(activeEditorControl.getModel().uri, { relative: true })), id: 'activeEditor' } : undefined;
		const untitledEditorOption = { label: localize('newUntitledFile', "New untitled editor"), id: 'newUntitledFile' };

		const options = [];
		if (resource) {
			// code block had an URI, but it doesn't exist
			options.push({ label: localize('createFile', "New file '{0}'", this.labelService.getUriLabel(resource, { relative: true })), id: 'createFile' });
			options.push(untitledEditorOption);
			if (activeEditorOption) {
				options.push(activeEditorOption);
			}
		} else {
			// code block had no URI
			if (activeEditorOption) {
				options.push(activeEditorOption);
			}
			options.push(untitledEditorOption);
		}

		const selected = options.length > 1 ? await this.quickInputService.pick(options, { placeHolder: localize('selectOption', "Select where to apply the code block") }) : options[0];
		if (selected) {
			switch (selected.id) {
				case 'createFile':
					if (resource) {
						try {
							await this.fileService.writeFile(resource, VSBuffer.fromString(''));
						} catch (error) {
							this.notify(localize('applyCodeBlock.fileWriteError', "Failed to create file: {0}", error.message));
							return URI.from({ scheme: 'untitled', path: resource.path });
						}
					}
					return resource;
				case 'newUntitledFile':
					return URI.from({ scheme: 'untitled', path: resource ? resource.path : 'Untitled-1' });
				case 'activeEditor':
					return activeEditorControl?.getModel().uri;
			}
		}
		return undefined;
	}

	private async handleNotebookEditor(notebookEditor: IActiveNotebookEditor, chatSessionResource: URI | undefined, code: string): Promise<IComputeEditsResult | undefined> {
		if (notebookEditor.isReadOnly) {
			this.notify(localize('applyCodeBlock.readonlyNotebook', "Cannot apply code block to read-only notebook editor."));
			return undefined;
		}
		const uri = notebookEditor.textModel.uri;
		const codeBlock = { code, resource: uri, markdownBeforeBlock: undefined };
		const codeMapper = this.codeMapperService.providers[0]?.displayName;
		if (!codeMapper) {
			this.notify(localize('applyCodeBlock.noCodeMapper', "No code mapper available."));
			return undefined;
		}
		let editsProposed = false;
		const cancellationTokenSource = new CancellationTokenSource();
		try {
			const iterable = await this.progressService.withProgress<AsyncIterable<[URI, TextEdit[]] | ICellEditOperation[]>>(
				{ location: ProgressLocation.Notification, delay: 500, sticky: true, cancellable: true },
				async progress => {
					progress.report({ message: localize('applyCodeBlock.progress', "Applying code block using {0}...", codeMapper) });
					const editsIterable = this.getNotebookEdits(codeBlock, chatSessionResource, cancellationTokenSource.token);
					return await this.waitForFirstElement(editsIterable);
				},
				() => cancellationTokenSource.cancel()
			);
			editsProposed = await this.applyNotebookEditsWithInlinePreview(iterable, uri, cancellationTokenSource);
		} catch (e) {
			if (!isCancellationError(e)) {
				this.notify(localize('applyCodeBlock.error', "Failed to apply code block: {0}", e.message));
			}
		} finally {
			cancellationTokenSource.dispose();
		}

		return {
			editsProposed,
			codeMapper
		};
	}

	private async handleTextEditor(codeEditor: IActiveCodeEditor, chatSessionResource: URI | undefined, code: string, applyCodeBlockSuggestionId: EditSuggestionId | undefined): Promise<IComputeEditsResult | undefined> {
		const activeModel = codeEditor.getModel();
		if (isReadOnly(activeModel, this.textFileService)) {
			this.notify(localize('applyCodeBlock.readonly', "Cannot apply code block to read-only file."));
			return undefined;
		}

		const codeBlock = { code, resource: activeModel.uri, chatSessionResource, markdownBeforeBlock: undefined };

		const codeMapper = this.codeMapperService.providers[0]?.displayName;
		if (!codeMapper) {
			this.notify(localize('applyCodeBlock.noCodeMapper', "No code mapper available."));
			return undefined;
		}
		let editsProposed = false;
		const cancellationTokenSource = new CancellationTokenSource();
		try {
			const iterable = await this.progressService.withProgress<AsyncIterable<TextEdit[]>>(
				{ location: ProgressLocation.Notification, delay: 500, sticky: true, cancellable: true },
				async progress => {
					progress.report({ message: localize('applyCodeBlock.progress', "Applying code block using {0}...", codeMapper) });
					const editsIterable = this.getTextEdits(codeBlock, chatSessionResource, cancellationTokenSource.token);
					return await this.waitForFirstElement(editsIterable);
				},
				() => cancellationTokenSource.cancel()
			);
			editsProposed = await this.applyWithInlinePreview(iterable, codeEditor, cancellationTokenSource, applyCodeBlockSuggestionId);
		} catch (e) {
			if (!isCancellationError(e)) {
				this.notify(localize('applyCodeBlock.error', "Failed to apply code block: {0}", e.message));
			}
		} finally {
			cancellationTokenSource.dispose();
		}

		return {
			editsProposed,
			codeMapper
		};
	}

	private getTextEdits(codeBlock: ICodeMapperCodeBlock, chatSessionResource: URI | undefined, token: CancellationToken): AsyncIterable<TextEdit[]> {
		return new AsyncIterableObject<TextEdit[]>(async executor => {
			const request: ICodeMapperRequest = {
				codeBlocks: [codeBlock],
				chatSessionResource,
			};
			const response: ICodeMapperResponse = {
				textEdit: (target: URI, edit: TextEdit[]) => {
					executor.emitOne(edit);
				},
				notebookEdit(_resource, _edit) {
					//
				},
			};
			const result = await this.codeMapperService.mapCode(request, response, token);
			if (result?.errorMessage) {
				executor.reject(new Error(result.errorMessage));
			}
		});
	}

	private getNotebookEdits(codeBlock: ICodeMapperCodeBlock, chatSessionResource: URI | undefined, token: CancellationToken): AsyncIterable<[URI, TextEdit[]] | ICellEditOperation[]> {
		return new AsyncIterableObject<[URI, TextEdit[]] | ICellEditOperation[]>(async executor => {
			const request: ICodeMapperRequest = {
				codeBlocks: [codeBlock],
				chatSessionResource,
				location: 'panel'
			};
			const response: ICodeMapperResponse = {
				textEdit: (target: URI, edits: TextEdit[]) => {
					executor.emitOne([target, edits]);
				},
				notebookEdit(_resource, edit) {
					executor.emitOne(edit);
				},
			};
			const result = await this.codeMapperService.mapCode(request, response, token);
			if (result?.errorMessage) {
				executor.reject(new Error(result.errorMessage));
			}
		});
	}

	private async waitForFirstElement<T>(iterable: AsyncIterable<T>): Promise<AsyncIterable<T>> {
		const iterator = iterable[Symbol.asyncIterator]();
		let result = await iterator.next();

		if (result.done) {
			return {
				async *[Symbol.asyncIterator]() {
					return;
				}
			};
		}

		return {
			async *[Symbol.asyncIterator]() {
				while (!result.done) {
					yield result.value;
					result = await iterator.next();
				}
			}
		};
	}

	private async applyWithInlinePreview(edits: AsyncIterable<TextEdit[]>, codeEditor: IActiveCodeEditor, tokenSource: CancellationTokenSource, applyCodeBlockSuggestionId: EditSuggestionId | undefined): Promise<boolean> {
		return this.instantiationService.invokeFunction(reviewEdits, codeEditor, edits, tokenSource.token, applyCodeBlockSuggestionId);
	}

	private async applyNotebookEditsWithInlinePreview(edits: AsyncIterable<[URI, TextEdit[]] | ICellEditOperation[]>, uri: URI, tokenSource: CancellationTokenSource): Promise<boolean> {
		return this.instantiationService.invokeFunction(reviewNotebookEdits, uri, edits, tokenSource.token);
	}

	private tryToRevealCodeBlock(codeEditor: IActiveCodeEditor, codeBlock: string): void {
		const match = codeBlock.match(/(\S[^\n]*)\n/); // substring that starts with a non-whitespace character and ends with a newline
		if (match && match[1].length > 10) {
			const findMatch = codeEditor.getModel().findNextMatch(match[1], { lineNumber: 1, column: 1 }, false, false, null, false);
			if (findMatch) {
				codeEditor.revealRangeInCenter(findMatch.range);
			}
		}
	}

	private notify(message: string) {
		//this.notificationService.notify({ severity: Severity.Info, message });
		this.dialogService.info(message);
	}

}

function notifyUserAction(chatService: IChatService, context: ICodeBlockActionContext, action: ChatUserAction) {
	if (isResponseVM(context.element)) {
		chatService.notifyUserAction({
			agentId: context.element.agent?.id,
			command: context.element.slashCommand?.name,
			sessionResource: context.element.sessionResource,
			requestId: context.element.requestId,
			result: context.element.result,
			action
		});
	}
}

function getActiveNotebookEditor(editorService: IEditorService): IActiveNotebookEditor | undefined {
	const activeEditorPane = editorService.activeEditorPane;
	if (activeEditorPane?.getId() === NOTEBOOK_EDITOR_ID) {
		const notebookEditor = activeEditorPane.getControl() as INotebookEditor;
		if (notebookEditor.hasModel()) {
			return notebookEditor;
		}
	}
	return undefined;
}

function getEditableActiveCodeEditor(editorService: IEditorService): IActiveCodeEditor | undefined {
	const activeCodeEditorInNotebook = getActiveNotebookEditor(editorService)?.activeCodeEditor;
	if (activeCodeEditorInNotebook && activeCodeEditorInNotebook.hasTextFocus() && activeCodeEditorInNotebook.hasModel()) {
		return activeCodeEditorInNotebook;
	}

	let codeEditor = getCodeEditor(editorService.activeTextEditorControl);
	if (!codeEditor) {
		for (const editor of editorService.visibleTextEditorControls) {
			codeEditor = getCodeEditor(editor);
			if (codeEditor) {
				break;
			}
		}
	}

	if (!codeEditor || !codeEditor.hasModel()) {
		return undefined;
	}
	return codeEditor;
}

function isReadOnly(model: ITextModel, textFileService: ITextFileService): boolean {
	// Check if model is editable, currently only support untitled and text file
	const activeTextModel = textFileService.files.get(model.uri) ?? textFileService.untitled.get(model.uri);
	return !!activeTextModel?.isReadonly();
}

function reindent(codeBlockContent: string, model: ITextModel, seletionStartLine: number): string {
	const newContent = strings.splitLines(codeBlockContent);
	if (newContent.length === 0) {
		return codeBlockContent;
	}

	const formattingOptions = model.getFormattingOptions();
	const codeIndentLevel = computeIndentation(model.getLineContent(seletionStartLine), formattingOptions.tabSize).level;

	const indents = newContent.map(line => computeIndentation(line, formattingOptions.tabSize));

	// find the smallest indent level in the code block
	const newContentIndentLevel = indents.reduce<number>((min, indent, index) => {
		if (indent.length !== newContent[index].length) { // ignore empty lines
			return Math.min(indent.level, min);
		}
		return min;
	}, Number.MAX_VALUE);

	if (newContentIndentLevel === Number.MAX_VALUE || newContentIndentLevel === codeIndentLevel) {
		// all lines are empty or the indent is already correct
		return codeBlockContent;
	}
	const newLines = [];
	for (let i = 0; i < newContent.length; i++) {
		const { level, length } = indents[i];
		const newLevel = Math.max(0, codeIndentLevel + level - newContentIndentLevel);
		const newIndentation = formattingOptions.insertSpaces ? ' '.repeat(formattingOptions.tabSize * newLevel) : '\t'.repeat(newLevel);
		newLines.push(newIndentation + newContent[i].substring(length));
	}
	return newLines.join('\n');
}

/**
 * Returns:
 *  - level: the line's the ident level in tabs
 *  - length: the number of characters of the leading whitespace
 */
export function computeIndentation(line: string, tabSize: number): { level: number; length: number } {
	let nSpaces = 0;
	let level = 0;
	let i = 0;
	let length = 0;
	const len = line.length;
	while (i < len) {
		const chCode = line.charCodeAt(i);
		if (chCode === CharCode.Space) {
			nSpaces++;
			if (nSpaces === tabSize) {
				level++;
				nSpaces = 0;
				length = i + 1;
			}
		} else if (chCode === CharCode.Tab) {
			level++;
			nSpaces = 0;
			length = i + 1;
		} else {
			break;
		}
		i++;
	}
	return { level, length };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/agentSessions/agentSessions.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/agentSessions/agentSessions.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../../base/common/codicons.js';
import { localize2 } from '../../../../../nls.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { registerSingleton, InstantiationType } from '../../../../../platform/instantiation/common/extensions.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { AgentSessionsViewerOrientation, AgentSessionsViewerPosition } from './agentSessions.js';
import { IAgentSessionsService, AgentSessionsService } from './agentSessionsService.js';
import { LocalAgentsSessionsProvider } from './localAgentSessionsProvider.js';
import { registerWorkbenchContribution2, WorkbenchPhase } from '../../../../common/contributions.js';
import { ISubmenuItem, MenuId, MenuRegistry, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ArchiveAgentSessionAction, ArchiveAgentSessionSectionAction, UnarchiveAgentSessionAction, OpenAgentSessionInEditorGroupAction, OpenAgentSessionInNewEditorGroupAction, OpenAgentSessionInNewWindowAction, ShowAgentSessionsSidebar, HideAgentSessionsSidebar, ToggleAgentSessionsSidebar, RefreshAgentSessionsViewerAction, FindAgentSessionInViewerAction, MarkAgentSessionUnreadAction, MarkAgentSessionReadAction, FocusAgentSessionsAction, SetAgentSessionsOrientationStackedAction, SetAgentSessionsOrientationSideBySideAction, ToggleChatViewSessionsAction, PickAgentSessionAction, ArchiveAllAgentSessionsAction, RenameAgentSessionAction, DeleteAgentSessionAction, DeleteAllLocalSessionsAction } from './agentSessionsActions.js';

//#region Actions and Menus

registerAction2(FocusAgentSessionsAction);
registerAction2(PickAgentSessionAction);
registerAction2(ArchiveAllAgentSessionsAction);
registerAction2(ArchiveAgentSessionSectionAction);
registerAction2(ArchiveAgentSessionAction);
registerAction2(UnarchiveAgentSessionAction);
registerAction2(RenameAgentSessionAction);
registerAction2(DeleteAgentSessionAction);
registerAction2(DeleteAllLocalSessionsAction);
registerAction2(MarkAgentSessionUnreadAction);
registerAction2(MarkAgentSessionReadAction);
registerAction2(OpenAgentSessionInNewWindowAction);
registerAction2(OpenAgentSessionInEditorGroupAction);
registerAction2(OpenAgentSessionInNewEditorGroupAction);
registerAction2(RefreshAgentSessionsViewerAction);
registerAction2(FindAgentSessionInViewerAction);
registerAction2(ShowAgentSessionsSidebar);
registerAction2(HideAgentSessionsSidebar);
registerAction2(ToggleAgentSessionsSidebar);
registerAction2(ToggleChatViewSessionsAction);
registerAction2(SetAgentSessionsOrientationStackedAction);
registerAction2(SetAgentSessionsOrientationSideBySideAction);

// --- Agent Sessions Toolbar

MenuRegistry.appendMenuItem(MenuId.AgentSessionsToolbar, {
	submenu: MenuId.AgentSessionsViewerFilterSubMenu,
	title: localize2('filterAgentSessions', "Filter Agent Sessions"),
	group: 'navigation',
	order: 3,
	icon: Codicon.filter,
	when: ChatContextKeys.agentSessionsViewerLimited.negate()
} satisfies ISubmenuItem);

MenuRegistry.appendMenuItem(MenuId.AgentSessionsToolbar, {
	command: {
		id: ShowAgentSessionsSidebar.ID,
		title: ShowAgentSessionsSidebar.TITLE,
		icon: Codicon.layoutSidebarRightOff,
	},
	group: 'navigation',
	order: 5,
	when: ContextKeyExpr.and(
		ChatContextKeys.agentSessionsViewerOrientation.isEqualTo(AgentSessionsViewerOrientation.Stacked),
		ChatContextKeys.agentSessionsViewerPosition.isEqualTo(AgentSessionsViewerPosition.Right)
	)
});

MenuRegistry.appendMenuItem(MenuId.AgentSessionsToolbar, {
	command: {
		id: ShowAgentSessionsSidebar.ID,
		title: ShowAgentSessionsSidebar.TITLE,
		icon: Codicon.layoutSidebarLeftOff,
	},
	group: 'navigation',
	order: 5,
	when: ContextKeyExpr.and(
		ChatContextKeys.agentSessionsViewerOrientation.isEqualTo(AgentSessionsViewerOrientation.Stacked),
		ChatContextKeys.agentSessionsViewerPosition.isEqualTo(AgentSessionsViewerPosition.Left)
	)
});

MenuRegistry.appendMenuItem(MenuId.AgentSessionsToolbar, {
	command: {
		id: HideAgentSessionsSidebar.ID,
		title: HideAgentSessionsSidebar.TITLE,
		icon: Codicon.layoutSidebarRight,
	},
	group: 'navigation',
	order: 5,
	when: ContextKeyExpr.and(
		ChatContextKeys.agentSessionsViewerOrientation.isEqualTo(AgentSessionsViewerOrientation.SideBySide),
		ChatContextKeys.agentSessionsViewerPosition.isEqualTo(AgentSessionsViewerPosition.Right)
	)
});

MenuRegistry.appendMenuItem(MenuId.AgentSessionsToolbar, {
	command: {
		id: HideAgentSessionsSidebar.ID,
		title: HideAgentSessionsSidebar.TITLE,
		icon: Codicon.layoutSidebarLeft,
	},
	group: 'navigation',
	order: 5,
	when: ContextKeyExpr.and(
		ChatContextKeys.agentSessionsViewerOrientation.isEqualTo(AgentSessionsViewerOrientation.SideBySide),
		ChatContextKeys.agentSessionsViewerPosition.isEqualTo(AgentSessionsViewerPosition.Left)
	)
});

// --- Sessions Title Toolbar

MenuRegistry.appendMenuItem(MenuId.ChatViewSessionTitleToolbar, {
	command: {
		id: ShowAgentSessionsSidebar.ID,
		title: ShowAgentSessionsSidebar.TITLE,
		icon: Codicon.layoutSidebarLeftOff,
	},
	group: 'navigation',
	order: 1,
	when: ContextKeyExpr.and(
		ContextKeyExpr.or(
			ChatContextKeys.agentSessionsViewerVisible.negate(),
			ChatContextKeys.agentSessionsViewerOrientation.isEqualTo(AgentSessionsViewerOrientation.Stacked),
		),
		ChatContextKeys.agentSessionsViewerPosition.isEqualTo(AgentSessionsViewerPosition.Left)
	)
});

MenuRegistry.appendMenuItem(MenuId.ChatViewSessionTitleToolbar, {
	command: {
		id: ShowAgentSessionsSidebar.ID,
		title: ShowAgentSessionsSidebar.TITLE,
		icon: Codicon.layoutSidebarRightOff,
	},
	group: 'navigation',
	order: 1,
	when: ContextKeyExpr.and(
		ContextKeyExpr.or(
			ChatContextKeys.agentSessionsViewerVisible.negate(),
			ChatContextKeys.agentSessionsViewerOrientation.isEqualTo(AgentSessionsViewerOrientation.Stacked),
		),
		ChatContextKeys.agentSessionsViewerPosition.isEqualTo(AgentSessionsViewerPosition.Right)
	)
});

//#endregion

//#region Workbench Contributions

registerWorkbenchContribution2(LocalAgentsSessionsProvider.ID, LocalAgentsSessionsProvider, WorkbenchPhase.AfterRestored);
registerSingleton(IAgentSessionsService, AgentSessionsService, InstantiationType.Delayed);

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/agentSessions/agentSessions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/agentSessions/agentSessions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../../nls.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { URI } from '../../../../../base/common/uri.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { localChatSessionType } from '../../common/chatSessionsService.js';
import { foreground, listActiveSelectionForeground, registerColor, transparent } from '../../../../../platform/theme/common/colorRegistry.js';

export enum AgentSessionProviders {
	Local = localChatSessionType,
	Background = 'copilotcli',
	Cloud = 'copilot-cloud-agent',
}

export function getAgentSessionProviderName(provider: AgentSessionProviders): string {
	switch (provider) {
		case AgentSessionProviders.Local:
			return localize('chat.session.providerLabel.local', "Local");
		case AgentSessionProviders.Background:
			return localize('chat.session.providerLabel.background', "Background");
		case AgentSessionProviders.Cloud:
			return localize('chat.session.providerLabel.cloud', "Cloud");
	}
}

export function getAgentSessionProviderIcon(provider: AgentSessionProviders): ThemeIcon {
	switch (provider) {
		case AgentSessionProviders.Local:
			return Codicon.vm;
		case AgentSessionProviders.Background:
			return Codicon.worktree;
		case AgentSessionProviders.Cloud:
			return Codicon.cloud;
	}
}

export enum AgentSessionsViewerOrientation {
	Stacked = 1,
	SideBySide,
}

export enum AgentSessionsViewerPosition {
	Left = 1,
	Right,
}

export interface IAgentSessionsControl {
	refresh(): void;
	openFind(): void;
	reveal(sessionResource: URI): void;
}

export const agentSessionReadIndicatorForeground = registerColor(
	'agentSessionReadIndicator.foreground',
	{ dark: transparent(foreground, 0.15), light: transparent(foreground, 0.15), hcDark: null, hcLight: null },
	localize('agentSessionReadIndicatorForeground', "Foreground color for the read indicator in an agent session.")
);

export const agentSessionSelectedBadgeBorder = registerColor(
	'agentSessionSelectedBadge.border',
	{ dark: transparent(listActiveSelectionForeground, 0.3), light: transparent(listActiveSelectionForeground, 0.3), hcDark: foreground, hcLight: foreground },
	localize('agentSessionSelectedBadgeBorder', "Border color for the badges in selected agent session items.")
);

export const agentSessionSelectedUnfocusedBadgeBorder = registerColor(
	'agentSessionSelectedUnfocusedBadge.border',
	{ dark: transparent(foreground, 0.3), light: transparent(foreground, 0.3), hcDark: foreground, hcLight: foreground },
	localize('agentSessionSelectedUnfocusedBadgeBorder', "Border color for the badges in selected agent session items when the view is unfocused.")
);

export const AGENT_SESSION_RENAME_ACTION_ID = 'agentSession.rename';
export const AGENT_SESSION_DELETE_ACTION_ID = 'agentSession.delete';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/agentSessions/agentSessionsActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/agentSessions/agentSessionsActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../../nls.js';
import { AgentSessionSection, IAgentSession, IAgentSessionSection, IMarshalledAgentSessionContext, isAgentSessionSection, isMarshalledAgentSessionContext } from './agentSessionsModel.js';
import { Action2, MenuId, MenuRegistry } from '../../../../../platform/actions/common/actions.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { AGENT_SESSION_DELETE_ACTION_ID, AGENT_SESSION_RENAME_ACTION_ID, AgentSessionProviders, AgentSessionsViewerOrientation, IAgentSessionsControl } from './agentSessions.js';
import { IChatService } from '../../common/chatService.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { IChatEditorOptions } from '../chatEditor.js';
import { ChatViewId, IChatWidgetService } from '../chat.js';
import { ACTIVE_GROUP, AUX_WINDOW_GROUP, PreferredGroup, SIDE_GROUP } from '../../../../services/editor/common/editorService.js';
import { IViewDescriptorService, ViewContainerLocation } from '../../../../common/views.js';
import { getPartByLocation } from '../../../../services/views/browser/viewsService.js';
import { IWorkbenchLayoutService, Position } from '../../../../services/layout/browser/layoutService.js';
import { IAgentSessionsService } from './agentSessionsService.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { ChatEditorInput, showClearEditingSessionConfirmation } from '../chatEditorInput.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ChatConfiguration } from '../../common/constants.js';
import { ACTION_ID_NEW_CHAT, CHAT_CATEGORY } from '../actions/chatActions.js';
import { IViewsService } from '../../../../services/views/common/viewsService.js';
import { ChatViewPane } from '../chatViewPane.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { AgentSessionsPicker } from './agentSessionsPicker.js';
import { ActiveEditorContext } from '../../../../common/contextkeys.js';
import { IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';

//#region Chat View

export class ToggleChatViewSessionsAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.chat.toggleChatViewSessions',
			title: localize2('chat.toggleChatViewSessions.label', "Show Sessions"),
			toggled: ContextKeyExpr.equals(`config.${ChatConfiguration.ChatViewSessionsEnabled}`, true),
			menu: {
				id: MenuId.ChatWelcomeContext,
				group: '0_sessions',
				order: 1,
				when: ChatContextKeys.inChatEditor.negate()
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);

		const chatViewSessionsEnabled = configurationService.getValue<boolean>(ChatConfiguration.ChatViewSessionsEnabled);
		await configurationService.updateValue(ChatConfiguration.ChatViewSessionsEnabled, !chatViewSessionsEnabled);
	}
}

const agentSessionsOrientationSubmenu = new MenuId('chatAgentSessionsOrientationSubmenu');
MenuRegistry.appendMenuItem(MenuId.ChatWelcomeContext, {
	submenu: agentSessionsOrientationSubmenu,
	title: localize2('chat.sessionsOrientation', "Sessions Orientation"),
	group: '0_sessions',
	order: 2,
	when: ChatContextKeys.inChatEditor.negate()
});


export class SetAgentSessionsOrientationStackedAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.chat.setAgentSessionsOrientationStacked',
			title: localize2('chat.sessionsOrientation.stacked', "Stacked"),
			toggled: ContextKeyExpr.equals(`config.${ChatConfiguration.ChatViewSessionsOrientation}`, 'stacked'),
			precondition: ContextKeyExpr.equals(`config.${ChatConfiguration.ChatViewSessionsEnabled}`, true),
			menu: {
				id: agentSessionsOrientationSubmenu,
				group: 'navigation',
				order: 2
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const commandService = accessor.get(ICommandService);

		await commandService.executeCommand(HideAgentSessionsSidebar.ID);
	}
}

export class SetAgentSessionsOrientationSideBySideAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.chat.setAgentSessionsOrientationSideBySide',
			title: localize2('chat.sessionsOrientation.sideBySide', "Side by Side"),
			toggled: ContextKeyExpr.notEquals(`config.${ChatConfiguration.ChatViewSessionsOrientation}`, 'stacked'),
			precondition: ContextKeyExpr.equals(`config.${ChatConfiguration.ChatViewSessionsEnabled}`, true),
			menu: {
				id: agentSessionsOrientationSubmenu,
				group: 'navigation',
				order: 3
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const commandService = accessor.get(ICommandService);

		await commandService.executeCommand(ShowAgentSessionsSidebar.ID);
	}
}

export class PickAgentSessionAction extends Action2 {

	constructor() {
		super({
			id: `workbench.action.chat.history`,
			title: localize2('agentSessions.open', "Open Agent Session..."),
			menu: [
				{
					id: MenuId.ViewTitle,
					when: ContextKeyExpr.and(
						ContextKeyExpr.equals('view', ChatViewId),
						ContextKeyExpr.equals(`config.${ChatConfiguration.ChatViewSessionsEnabled}`, false)
					),
					group: 'navigation',
					order: 2
				},
				{
					id: MenuId.ViewTitle,
					when: ContextKeyExpr.and(
						ContextKeyExpr.equals('view', ChatViewId),
						ContextKeyExpr.equals(`config.${ChatConfiguration.ChatViewSessionsEnabled}`, true)
					),
					group: '2_history',
					order: 1
				},
				{
					id: MenuId.EditorTitle,
					when: ActiveEditorContext.isEqualTo(ChatEditorInput.EditorID),
				}
			],
			category: CHAT_CATEGORY,
			icon: Codicon.history,
			f1: true,
			precondition: ChatContextKeys.enabled
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const instantiationService = accessor.get(IInstantiationService);

		const agentSessionsPicker = instantiationService.createInstance(AgentSessionsPicker);
		await agentSessionsPicker.pickAgentSession();
	}
}

export class ArchiveAllAgentSessionsAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.chat.archiveAllAgentSessions',
			title: localize2('archiveAll.label', "Archive All Workspace Agent Sessions"),
			precondition: ChatContextKeys.enabled,
			category: CHAT_CATEGORY,
			f1: true,
		});
	}
	async run(accessor: ServicesAccessor) {
		const agentSessionsService = accessor.get(IAgentSessionsService);
		const dialogService = accessor.get(IDialogService);

		const sessionsToArchive = agentSessionsService.model.sessions.filter(session => !session.isArchived());
		if (sessionsToArchive.length === 0) {
			return;
		}

		const confirmed = await dialogService.confirm({
			message: sessionsToArchive.length === 1
				? localize('archiveAllSessions.confirmSingle', "Are you sure you want to archive 1 agent session?")
				: localize('archiveAllSessions.confirm', "Are you sure you want to archive {0} agent sessions?", sessionsToArchive.length),
			detail: localize('archiveAllSessions.detail', "You can unarchive sessions later if needed from the Chat view."),
			primaryButton: localize('archiveAllSessions.archive', "Archive")
		});

		if (!confirmed.confirmed) {
			return;
		}

		for (const session of sessionsToArchive) {
			session.setArchived(true);
		}
	}
}

export class ArchiveAgentSessionSectionAction extends Action2 {

	constructor() {
		super({
			id: 'agentSessionSection.archive',
			title: localize2('archiveSection', "Archive All"),
			icon: Codicon.archive,
			menu: {
				id: MenuId.AgentSessionSectionToolbar,
				group: 'navigation',
				order: 1,
				when: ChatContextKeys.agentSessionSection.notEqualsTo(AgentSessionSection.Archived),
			}
		});
	}

	async run(accessor: ServicesAccessor, context?: IAgentSessionSection): Promise<void> {
		if (!context || !isAgentSessionSection(context)) {
			return;
		}

		const dialogService = accessor.get(IDialogService);

		const confirmed = await dialogService.confirm({
			message: context.sessions.length === 1
				? localize('archiveSectionSessions.confirmSingle', "Are you sure you want to archive 1 agent session from '{0}'?", context.label)
				: localize('archiveSectionSessions.confirm', "Are you sure you want to archive {0} agent sessions from '{1}'?", context.sessions.length, context.label),
			detail: localize('archiveSectionSessions.detail', "You can unarchive sessions later if needed from the sessions view."),
			primaryButton: localize('archiveSectionSessions.archive', "Archive All")
		});

		if (!confirmed.confirmed) {
			return;
		}

		for (const session of context.sessions) {
			session.setArchived(true);
		}
	}
}

//#endregion

//#region Session Actions

abstract class BaseAgentSessionAction extends Action2 {

	async run(accessor: ServicesAccessor, context?: IAgentSession | IMarshalledAgentSessionContext): Promise<void> {
		const agentSessionsService = accessor.get(IAgentSessionsService);
		const viewsService = accessor.get(IViewsService);

		let session: IAgentSession | undefined;
		if (isMarshalledAgentSessionContext(context)) {
			session = agentSessionsService.getSession(context.session.resource);
		} else {
			session = context;
		}

		if (!session) {
			const chatView = viewsService.getActiveViewWithId<ChatViewPane>(ChatViewId);
			session = chatView?.getFocusedSessions().at(0);
		}

		if (session) {
			await this.runWithSession(session, accessor);
		}
	}

	abstract runWithSession(session: IAgentSession, accessor: ServicesAccessor): Promise<void> | void;
}

export class MarkAgentSessionUnreadAction extends BaseAgentSessionAction {

	constructor() {
		super({
			id: 'agentSession.markUnread',
			title: localize2('markUnread', "Mark as Unread"),
			menu: {
				id: MenuId.AgentSessionsContext,
				group: 'edit',
				order: 1,
				when: ContextKeyExpr.and(
					ChatContextKeys.isReadAgentSession,
					ChatContextKeys.isArchivedAgentSession.negate() // no read state for archived sessions
				),
			}
		});
	}

	runWithSession(session: IAgentSession): void {
		session.setRead(false);
	}
}

export class MarkAgentSessionReadAction extends BaseAgentSessionAction {

	constructor() {
		super({
			id: 'agentSession.markRead',
			title: localize2('markRead', "Mark as Read"),
			menu: {
				id: MenuId.AgentSessionsContext,
				group: 'edit',
				order: 1,
				when: ContextKeyExpr.and(
					ChatContextKeys.isReadAgentSession.negate(),
					ChatContextKeys.isArchivedAgentSession.negate() // no read state for archived sessions
				),
			}
		});
	}

	runWithSession(session: IAgentSession): void {
		session.setRead(true);
	}
}

export class ArchiveAgentSessionAction extends BaseAgentSessionAction {

	constructor() {
		super({
			id: 'agentSession.archive',
			title: localize2('archive', "Archive"),
			icon: Codicon.archive,
			keybinding: {
				primary: KeyCode.Delete,
				mac: { primary: KeyMod.CtrlCmd | KeyCode.Backspace },
				weight: KeybindingWeight.WorkbenchContrib + 1,
				when: ContextKeyExpr.and(
					ChatContextKeys.agentSessionsViewerFocused,
					ChatContextKeys.isArchivedAgentSession.negate()
				)
			},
			menu: [{
				id: MenuId.AgentSessionItemToolbar,
				group: 'navigation',
				order: 1,
				when: ChatContextKeys.isArchivedAgentSession.negate(),
			}, {
				id: MenuId.AgentSessionsContext,
				group: 'edit',
				order: 2,
				when: ChatContextKeys.isArchivedAgentSession.negate()
			}]
		});
	}

	async runWithSession(session: IAgentSession, accessor: ServicesAccessor): Promise<void> {
		const chatService = accessor.get(IChatService);
		const chatModel = chatService.getSession(session.resource);
		const dialogService = accessor.get(IDialogService);

		if (chatModel && !await showClearEditingSessionConfirmation(chatModel, dialogService, {
			isArchiveAction: true,
			titleOverride: localize('archiveSession', "Archive chat with pending edits?"),
			messageOverride: localize('archiveSessionDescription', "You have pending changes in this chat session.")
		})) {
			return;
		}

		session.setArchived(true);
	}
}

export class UnarchiveAgentSessionAction extends BaseAgentSessionAction {

	constructor() {
		super({
			id: 'agentSession.unarchive',
			title: localize2('unarchive', "Unarchive"),
			icon: Codicon.unarchive,
			keybinding: {
				primary: KeyMod.Shift | KeyCode.Delete,
				mac: {
					primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Backspace,
				},
				weight: KeybindingWeight.WorkbenchContrib + 1,
				when: ContextKeyExpr.and(
					ChatContextKeys.agentSessionsViewerFocused,
					ChatContextKeys.isArchivedAgentSession
				)
			},
			menu: [{
				id: MenuId.AgentSessionItemToolbar,
				group: 'navigation',
				order: 1,
				when: ChatContextKeys.isArchivedAgentSession,
			}, {
				id: MenuId.AgentSessionsContext,
				group: 'edit',
				order: 2,
				when: ChatContextKeys.isArchivedAgentSession,
			}]
		});
	}

	runWithSession(session: IAgentSession): void {
		session.setArchived(false);
	}
}

export class RenameAgentSessionAction extends BaseAgentSessionAction {

	constructor() {
		super({
			id: AGENT_SESSION_RENAME_ACTION_ID,
			title: localize2('rename', "Rename..."),
			keybinding: {
				primary: KeyCode.F2,
				mac: {
					primary: KeyCode.Enter
				},
				weight: KeybindingWeight.WorkbenchContrib + 1,
				when: ContextKeyExpr.and(
					ChatContextKeys.agentSessionsViewerFocused,
					ChatContextKeys.agentSessionType.isEqualTo(AgentSessionProviders.Local)
				),
			},
			menu: {
				id: MenuId.AgentSessionsContext,
				group: 'edit',
				order: 3,
				when: ChatContextKeys.agentSessionType.isEqualTo(AgentSessionProviders.Local)
			}
		});
	}

	async runWithSession(session: IAgentSession, accessor: ServicesAccessor): Promise<void> {
		const quickInputService = accessor.get(IQuickInputService);
		const chatService = accessor.get(IChatService);

		const title = await quickInputService.input({ prompt: localize('newChatTitle', "New agent session title"), value: session.label });
		if (title) {
			chatService.setChatSessionTitle(session.resource, title);
		}
	}
}

export class DeleteAgentSessionAction extends BaseAgentSessionAction {

	constructor() {
		super({
			id: AGENT_SESSION_DELETE_ACTION_ID,
			title: localize2('delete', "Delete..."),
			menu: {
				id: MenuId.AgentSessionsContext,
				group: 'edit',
				order: 4,
				when: ChatContextKeys.agentSessionType.isEqualTo(AgentSessionProviders.Local)
			}
		});
	}

	async runWithSession(session: IAgentSession, accessor: ServicesAccessor): Promise<void> {
		const chatService = accessor.get(IChatService);
		const dialogService = accessor.get(IDialogService);
		const widgetService = accessor.get(IChatWidgetService);

		const confirmed = await dialogService.confirm({
			message: localize('deleteSession.confirm', "Are you sure you want to delete this chat session?"),
			detail: localize('deleteSession.detail', "This action cannot be undone."),
			primaryButton: localize('deleteSession.delete', "Delete")
		});

		if (!confirmed.confirmed) {
			return;
		}

		// Clear chat widget
		await widgetService.getWidgetBySessionResource(session.resource)?.clear();

		// Remove from storage
		await chatService.removeHistoryEntry(session.resource);
	}
}

export class DeleteAllLocalSessionsAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.chat.clearHistory',
			title: localize2('agentSessions.deleteAll', "Delete All Local Workspace Chat Sessions"),
			precondition: ChatContextKeys.enabled,
			category: CHAT_CATEGORY,
			f1: true,
		});
	}

	async run(accessor: ServicesAccessor, ...args: unknown[]) {
		const chatService = accessor.get(IChatService);
		const widgetService = accessor.get(IChatWidgetService);
		const dialogService = accessor.get(IDialogService);

		const confirmed = await dialogService.confirm({
			message: localize('deleteAllChats.confirm', "Are you sure you want to delete all local workspace chat sessions?"),
			detail: localize('deleteAllChats.detail', "This action cannot be undone."),
			primaryButton: localize('deleteAllChats.button', "Delete All")
		});

		if (!confirmed.confirmed) {
			return;
		}

		// Clear all chat widgets
		await Promise.all(widgetService.getAllWidgets().map(widget => widget.clear()));

		// Remove from storage
		await chatService.clearAllHistoryEntries();
	}
}

abstract class BaseOpenAgentSessionAction extends BaseAgentSessionAction {

	async runWithSession(session: IAgentSession, accessor: ServicesAccessor): Promise<void> {
		const chatWidgetService = accessor.get(IChatWidgetService);

		const uri = session.resource;

		await chatWidgetService.openSession(uri, this.getTargetGroup(), {
			...this.getOptions(),
			pinned: true
		});
	}

	protected abstract getTargetGroup(): PreferredGroup;

	protected abstract getOptions(): IChatEditorOptions;
}

export class OpenAgentSessionInEditorGroupAction extends BaseOpenAgentSessionAction {

	static readonly id = 'workbench.action.chat.openSessionInEditorGroup';

	constructor() {
		super({
			id: OpenAgentSessionInEditorGroupAction.id,
			title: localize2('chat.openSessionInEditorGroup.label', "Open as Editor"),
			keybinding: {
				primary: KeyMod.CtrlCmd | KeyCode.Enter,
				mac: {
					primary: KeyMod.WinCtrl | KeyCode.Enter
				},
				weight: KeybindingWeight.WorkbenchContrib + 1,
				when: ChatContextKeys.agentSessionsViewerFocused,
			},
			menu: {
				id: MenuId.AgentSessionsContext,
				order: 1,
				group: 'navigation'
			}
		});
	}

	protected getTargetGroup(): PreferredGroup {
		return ACTIVE_GROUP;
	}

	protected getOptions(): IChatEditorOptions {
		return {};
	}
}

export class OpenAgentSessionInNewEditorGroupAction extends BaseOpenAgentSessionAction {

	static readonly id = 'workbench.action.chat.openSessionInNewEditorGroup';

	constructor() {
		super({
			id: OpenAgentSessionInNewEditorGroupAction.id,
			title: localize2('chat.openSessionInNewEditorGroup.label', "Open to the Side"),
			keybinding: {
				primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.Enter,
				mac: {
					primary: KeyMod.WinCtrl | KeyMod.Alt | KeyCode.Enter
				},
				weight: KeybindingWeight.WorkbenchContrib + 1,
				when: ChatContextKeys.agentSessionsViewerFocused,
			},
			menu: {
				id: MenuId.AgentSessionsContext,
				order: 2,
				group: 'navigation'
			}
		});
	}

	protected getTargetGroup(): PreferredGroup {
		return SIDE_GROUP;
	}

	protected getOptions(): IChatEditorOptions {
		return {};
	}
}

export class OpenAgentSessionInNewWindowAction extends BaseOpenAgentSessionAction {

	static readonly id = 'workbench.action.chat.openSessionInNewWindow';

	constructor() {
		super({
			id: OpenAgentSessionInNewWindowAction.id,
			title: localize2('chat.openSessionInNewWindow.label', "Open in New Window"),
			menu: {
				id: MenuId.AgentSessionsContext,
				order: 3,
				group: 'navigation'
			}
		});
	}

	protected getTargetGroup(): PreferredGroup {
		return AUX_WINDOW_GROUP;
	}

	protected getOptions(): IChatEditorOptions {
		return {
			auxiliary: { compact: true, bounds: { width: 800, height: 640 } }
		};
	}
}

//#endregion

//#region Agent Sessions Sidebar

export class RefreshAgentSessionsViewerAction extends Action2 {

	constructor() {
		super({
			id: 'agentSessionsViewer.refresh',
			title: localize2('refresh', "Refresh Agent Sessions"),
			icon: Codicon.refresh,
			menu: {
				id: MenuId.AgentSessionsToolbar,
				group: 'navigation',
				order: 1,
				when: ChatContextKeys.agentSessionsViewerLimited.negate()
			},
		});
	}

	override run(accessor: ServicesAccessor, agentSessionsControl: IAgentSessionsControl) {
		agentSessionsControl.refresh();
	}
}

export class FindAgentSessionInViewerAction extends Action2 {

	constructor() {
		super({
			id: 'agentSessionsViewer.find',
			title: localize2('find', "Find Agent Session"),
			icon: Codicon.search,
			menu: {
				id: MenuId.AgentSessionsToolbar,
				group: 'navigation',
				order: 2,
				when: ChatContextKeys.agentSessionsViewerLimited.negate()
			}
		});
	}

	override run(accessor: ServicesAccessor, agentSessionsControl: IAgentSessionsControl) {
		return agentSessionsControl.openFind();
	}
}

abstract class UpdateChatViewWidthAction extends Action2 {

	async run(accessor: ServicesAccessor): Promise<void> {
		const layoutService = accessor.get(IWorkbenchLayoutService);
		const viewDescriptorService = accessor.get(IViewDescriptorService);
		const configurationService = accessor.get(IConfigurationService);
		const viewsService = accessor.get(IViewsService);

		const chatLocation = viewDescriptorService.getViewLocationById(ChatViewId);
		if (typeof chatLocation !== 'number') {
			return; // we need a view location
		}

		// Determine if we can resize the view: this is not possible
		// for when the chat view is in the panel at the top or bottom
		const panelPosition = layoutService.getPanelPosition();
		const canResizeView = chatLocation !== ViewContainerLocation.Panel || (panelPosition === Position.LEFT || panelPosition === Position.RIGHT);

		// Update configuration if needed
		let chatView = viewsService.getActiveViewWithId<ChatViewPane>(ChatViewId);
		if (!chatView) {
			chatView = await viewsService.openView<ChatViewPane>(ChatViewId, false);
		}
		if (!chatView) {
			return; // we need the chat view
		}

		const configuredOrientation = configurationService.getValue<'stacked' | 'sideBySide' | unknown>(ChatConfiguration.ChatViewSessionsOrientation);
		let validatedConfiguredOrientation: 'stacked' | 'sideBySide';
		if (configuredOrientation === 'stacked' || configuredOrientation === 'sideBySide') {
			validatedConfiguredOrientation = configuredOrientation;
		} else {
			validatedConfiguredOrientation = 'sideBySide'; // default
		}

		const newOrientation = this.getOrientation();

		if ((!canResizeView || validatedConfiguredOrientation === 'sideBySide') && newOrientation === AgentSessionsViewerOrientation.Stacked) {
			chatView.updateConfiguredSessionsViewerOrientation('stacked');
		} else if ((!canResizeView || validatedConfiguredOrientation === 'stacked') && newOrientation === AgentSessionsViewerOrientation.SideBySide) {
			chatView.updateConfiguredSessionsViewerOrientation('sideBySide');
		}

		const part = getPartByLocation(chatLocation);
		let currentSize = layoutService.getSize(part);

		const sideBySideMinWidth = 600 + 1;	// account for possible theme border
		const stackedMaxWidth = sideBySideMinWidth - 1;

		if (
			(newOrientation === AgentSessionsViewerOrientation.SideBySide && currentSize.width >= sideBySideMinWidth) ||	// already wide enough to show side by side
			newOrientation === AgentSessionsViewerOrientation.Stacked														// always wide enough to show stacked
		) {
			return; // size suffices
		}

		if (!canResizeView) {
			return; // location does not allow for resize (panel top or bottom)
		}

		if (chatLocation === ViewContainerLocation.AuxiliaryBar) {
			layoutService.setAuxiliaryBarMaximized(false); // Leave maximized state if applicable
			currentSize = layoutService.getSize(part);
		}

		const lastWidthForOrientation = chatView?.getLastDimensions(newOrientation)?.width;

		let newWidth: number;
		if (newOrientation === AgentSessionsViewerOrientation.SideBySide) {
			newWidth = Math.max(sideBySideMinWidth, lastWidthForOrientation || Math.round(layoutService.mainContainerDimension.width / 2));
		} else {
			newWidth = Math.min(stackedMaxWidth, lastWidthForOrientation || stackedMaxWidth);
		}

		layoutService.setSize(part, {
			width: newWidth,
			height: currentSize.height
		});
	}

	abstract getOrientation(): AgentSessionsViewerOrientation;
}

export class ShowAgentSessionsSidebar extends UpdateChatViewWidthAction {

	static readonly ID = 'agentSessions.showAgentSessionsSidebar';
	static readonly TITLE = localize2('showAgentSessionsSidebar', "Show Agent Sessions Sidebar");

	constructor() {
		super({
			id: ShowAgentSessionsSidebar.ID,
			title: ShowAgentSessionsSidebar.TITLE,
			precondition: ContextKeyExpr.and(
				ChatContextKeys.enabled,
				ChatContextKeys.agentSessionsViewerOrientation.isEqualTo(AgentSessionsViewerOrientation.Stacked),
				ContextKeyExpr.equals(`config.${ChatConfiguration.ChatViewSessionsEnabled}`, true)
			),
			f1: true,
			category: CHAT_CATEGORY,
		});
	}

	override getOrientation(): AgentSessionsViewerOrientation {
		return AgentSessionsViewerOrientation.SideBySide;
	}
}

export class HideAgentSessionsSidebar extends UpdateChatViewWidthAction {

	static readonly ID = 'agentSessions.hideAgentSessionsSidebar';
	static readonly TITLE = localize2('hideAgentSessionsSidebar', "Hide Agent Sessions Sidebar");

	constructor() {
		super({
			id: HideAgentSessionsSidebar.ID,
			title: HideAgentSessionsSidebar.TITLE,
			precondition: ContextKeyExpr.and(
				ChatContextKeys.enabled,
				ChatContextKeys.agentSessionsViewerOrientation.isEqualTo(AgentSessionsViewerOrientation.SideBySide),
				ContextKeyExpr.equals(`config.${ChatConfiguration.ChatViewSessionsEnabled}`, true)
			),
			f1: true,
			category: CHAT_CATEGORY,
		});
	}

	override getOrientation(): AgentSessionsViewerOrientation {
		return AgentSessionsViewerOrientation.Stacked;
	}
}

export class ToggleAgentSessionsSidebar extends Action2 {

	static readonly ID = 'agentSessions.toggleAgentSessionsSidebar';
	static readonly TITLE = localize2('toggleAgentSessionsSidebar', "Toggle Agent Sessions Sidebar");

	constructor() {
		super({
			id: ToggleAgentSessionsSidebar.ID,
			title: ToggleAgentSessionsSidebar.TITLE,
			precondition: ContextKeyExpr.and(
				ChatContextKeys.enabled,
				ContextKeyExpr.equals(`config.${ChatConfiguration.ChatViewSessionsEnabled}`, true)
			),
			f1: true,
			category: CHAT_CATEGORY,
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const commandService = accessor.get(ICommandService);
		const viewsService = accessor.get(IViewsService);

		const chatView = viewsService.getActiveViewWithId<ChatViewPane>(ChatViewId);
		const currentOrientation = chatView?.getSessionsViewerOrientation();

		if (currentOrientation === AgentSessionsViewerOrientation.SideBySide) {
			await commandService.executeCommand(HideAgentSessionsSidebar.ID);
		} else {
			await commandService.executeCommand(ShowAgentSessionsSidebar.ID);
		}
	}
}

export class FocusAgentSessionsAction extends Action2 {

	static readonly id = 'workbench.action.chat.focusAgentSessionsViewer';

	constructor() {
		super({
			id: FocusAgentSessionsAction.id,
			title: localize2('chat.focusAgentSessionsViewer.label', "Focus Agent Sessions"),
			precondition: ContextKeyExpr.and(
				ChatContextKeys.enabled,
				ContextKeyExpr.equals(`config.${ChatConfiguration.ChatViewSessionsEnabled}`, true)
			),
			category: CHAT_CATEGORY,
			f1: true,
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const viewsService = accessor.get(IViewsService);
		const configurationService = accessor.get(IConfigurationService);
		const commandService = accessor.get(ICommandService);

		const chatView = await viewsService.openView<ChatViewPane>(ChatViewId, true);
		const focused = chatView?.focusSessions();
		if (focused) {
			return;
		}

		const configuredSessionsViewerOrientation = configurationService.getValue<'stacked' | 'sideBySide' | unknown>(ChatConfiguration.ChatViewSessionsOrientation);
		if (configuredSessionsViewerOrientation === 'stacked') {
			await commandService.executeCommand(ACTION_ID_NEW_CHAT);
		} else {
			await commandService.executeCommand(ShowAgentSessionsSidebar.ID);
		}

		chatView?.focusSessions();
	}
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/agentSessions/agentSessionsControl.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/agentSessions/agentSessionsControl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IContextKey, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IOpenEvent, WorkbenchCompressibleAsyncDataTree } from '../../../../../platform/list/browser/listService.js';
import { $, append, EventHelper } from '../../../../../base/browser/dom.js';
import { IAgentSession, IAgentSessionsModel, IMarshalledAgentSessionContext, isAgentSession, isAgentSessionSection } from './agentSessionsModel.js';
import { AgentSessionListItem, AgentSessionRenderer, AgentSessionsAccessibilityProvider, AgentSessionsCompressionDelegate, AgentSessionsDataSource, AgentSessionsDragAndDrop, AgentSessionsIdentityProvider, AgentSessionsKeyboardNavigationLabelProvider, AgentSessionsListDelegate, AgentSessionSectionRenderer, AgentSessionsSorter, IAgentSessionsFilter, IAgentSessionsSorterOptions } from './agentSessionsViewer.js';
import { FuzzyScore } from '../../../../../base/common/filters.js';
import { IMenuService, MenuId } from '../../../../../platform/actions/common/actions.js';
import { IChatSessionsService } from '../../common/chatSessionsService.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { ACTION_ID_NEW_CHAT } from '../actions/chatActions.js';
import { Event } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ITreeContextMenuEvent } from '../../../../../base/browser/ui/tree/tree.js';
import { MarshalledId } from '../../../../../base/common/marshallingIds.js';
import { Separator } from '../../../../../base/common/actions.js';
import { RenderIndentGuides, TreeFindMode } from '../../../../../base/browser/ui/tree/abstractTree.js';
import { IAgentSessionsService } from './agentSessionsService.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { IListStyles } from '../../../../../base/browser/ui/list/listWidget.js';
import { IStyleOverride } from '../../../../../platform/theme/browser/defaultStyles.js';
import { IAgentSessionsControl } from './agentSessions.js';
import { HoverPosition } from '../../../../../base/browser/ui/hover/hoverWidget.js';
import { URI } from '../../../../../base/common/uri.js';
import { openSession } from './agentSessionsOpener.js';

export interface IAgentSessionsControlOptions extends IAgentSessionsSorterOptions {
	readonly overrideStyles?: IStyleOverride<IListStyles>;
	readonly filter?: IAgentSessionsFilter;

	getHoverPosition(): HoverPosition;
}

type AgentSessionOpenedClassification = {
	owner: 'bpasero';
	providerType: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The provider type of the opened agent session.' };
	comment: 'Event fired when a agent session is opened from the agent sessions control.';
};

type AgentSessionOpenedEvent = {
	providerType: string;
};

export class AgentSessionsControl extends Disposable implements IAgentSessionsControl {

	private sessionsContainer: HTMLElement | undefined;
	private sessionsList: WorkbenchCompressibleAsyncDataTree<IAgentSessionsModel, AgentSessionListItem, FuzzyScore> | undefined;

	private visible: boolean = true;

	private focusedAgentSessionArchivedContextKey: IContextKey<boolean>;
	private focusedAgentSessionReadContextKey: IContextKey<boolean>;
	private focusedAgentSessionTypeContextKey: IContextKey<string>;

	constructor(
		private readonly container: HTMLElement,
		private readonly options: IAgentSessionsControlOptions,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IChatSessionsService private readonly chatSessionsService: IChatSessionsService,
		@ICommandService private readonly commandService: ICommandService,
		@IMenuService private readonly menuService: IMenuService,
		@IAgentSessionsService private readonly agentSessionsService: IAgentSessionsService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
	) {
		super();

		this.focusedAgentSessionArchivedContextKey = ChatContextKeys.isArchivedAgentSession.bindTo(this.contextKeyService);
		this.focusedAgentSessionReadContextKey = ChatContextKeys.isReadAgentSession.bindTo(this.contextKeyService);
		this.focusedAgentSessionTypeContextKey = ChatContextKeys.agentSessionType.bindTo(this.contextKeyService);

		this.createList(this.container);
	}

	private createList(container: HTMLElement): void {
		this.sessionsContainer = append(container, $('.agent-sessions-viewer'));

		const sorter = new AgentSessionsSorter(this.options);
		const list = this.sessionsList = this._register(this.instantiationService.createInstance(WorkbenchCompressibleAsyncDataTree,
			'AgentSessionsView',
			this.sessionsContainer,
			new AgentSessionsListDelegate(),
			new AgentSessionsCompressionDelegate(),
			[
				this.instantiationService.createInstance(AgentSessionRenderer, this.options),
				this.instantiationService.createInstance(AgentSessionSectionRenderer),
			],
			new AgentSessionsDataSource(this.options.filter, sorter),
			{
				accessibilityProvider: new AgentSessionsAccessibilityProvider(),
				dnd: this.instantiationService.createInstance(AgentSessionsDragAndDrop),
				identityProvider: new AgentSessionsIdentityProvider(),
				horizontalScrolling: false,
				multipleSelectionSupport: false,
				findWidgetEnabled: true,
				defaultFindMode: TreeFindMode.Filter,
				keyboardNavigationLabelProvider: new AgentSessionsKeyboardNavigationLabelProvider(),
				overrideStyles: this.options.overrideStyles,
				expandOnlyOnTwistieClick: true,
				twistieAdditionalCssClass: () => 'force-no-twistie',
				collapseByDefault: () => false,
				renderIndentGuides: RenderIndentGuides.None,
			}
		)) as WorkbenchCompressibleAsyncDataTree<IAgentSessionsModel, AgentSessionListItem, FuzzyScore>;

		ChatContextKeys.agentSessionsViewerFocused.bindTo(list.contextKeyService);

		const model = this.agentSessionsService.model;

		this._register(Event.any(
			this.options.filter?.onDidChange ?? Event.None,
			model.onDidChangeSessions
		)(() => {
			if (this.visible) {
				list.updateChildren();
			}
		}));

		list.setInput(model);

		this._register(list.onDidOpen(e => this.openAgentSession(e)));
		this._register(list.onContextMenu(e => this.showContextMenu(e)));

		this._register(list.onMouseDblClick(({ element }) => {
			if (element === null) {
				this.commandService.executeCommand(ACTION_ID_NEW_CHAT);
			}
		}));

		this._register(Event.any(list.onDidChangeFocus, model.onDidChangeSessions)(() => {
			const focused = list.getFocus().at(0);
			if (focused && isAgentSession(focused)) {
				this.focusedAgentSessionArchivedContextKey.set(focused.isArchived());
				this.focusedAgentSessionReadContextKey.set(focused.isRead());
				this.focusedAgentSessionTypeContextKey.set(focused.providerType);
			} else {
				this.focusedAgentSessionArchivedContextKey.reset();
				this.focusedAgentSessionReadContextKey.reset();
				this.focusedAgentSessionTypeContextKey.reset();
			}
		}));
	}

	private async openAgentSession(e: IOpenEvent<AgentSessionListItem | undefined>): Promise<void> {
		const element = e.element;
		if (!element || isAgentSessionSection(element)) {
			return; // Section headers are not openable
		}

		this.telemetryService.publicLog2<AgentSessionOpenedEvent, AgentSessionOpenedClassification>('agentSessionOpened', {
			providerType: element.providerType
		});

		await this.instantiationService.invokeFunction(openSession, element, e);
	}

	private async showContextMenu({ element, anchor, browserEvent }: ITreeContextMenuEvent<AgentSessionListItem>): Promise<void> {
		if (!element || isAgentSessionSection(element)) {
			return; // No context menu for section headers
		}

		EventHelper.stop(browserEvent, true);

		await this.chatSessionsService.activateChatSessionItemProvider(element.providerType);

		const contextOverlay: Array<[string, boolean | string]> = [];
		contextOverlay.push([ChatContextKeys.isArchivedAgentSession.key, element.isArchived()]);
		contextOverlay.push([ChatContextKeys.isReadAgentSession.key, element.isRead()]);
		contextOverlay.push([ChatContextKeys.agentSessionType.key, element.providerType]);
		const menu = this.menuService.createMenu(MenuId.AgentSessionsContext, this.contextKeyService.createOverlay(contextOverlay));

		const marshalledSession: IMarshalledAgentSessionContext = { session: element, $mid: MarshalledId.AgentSessionContext };
		this.contextMenuService.showContextMenu({
			getActions: () => Separator.join(...menu.getActions({ arg: marshalledSession, shouldForwardArgs: true }).map(([, actions]) => actions)),
			getAnchor: () => anchor,
			getActionsContext: () => marshalledSession,
		});

		menu.dispose();
	}

	openFind(): void {
		this.sessionsList?.openFind();
	}

	refresh(): Promise<void> {
		return this.agentSessionsService.model.resolve(undefined);
	}

	async update(): Promise<void> {
		await this.sessionsList?.updateChildren();
	}

	setVisible(visible: boolean): void {
		if (this.visible === visible) {
			return;
		}

		this.visible = visible;

		if (this.visible) {
			this.sessionsList?.updateChildren();
		}
	}

	layout(height: number, width: number): void {
		this.sessionsList?.layout(height, width);
	}

	focus(): void {
		this.sessionsList?.domFocus();
	}

	clearFocus(): void {
		this.sessionsList?.setFocus([]);
		this.sessionsList?.setSelection([]);
	}

	scrollToTop(): void {
		if (this.sessionsList) {
			this.sessionsList.scrollTop = 0;
		}
	}

	getFocus(): IAgentSession[] {
		const focused = this.sessionsList?.getFocus() ?? [];

		return focused.filter(e => isAgentSession(e));
	}

	reveal(sessionResource: URI): void {
		if (!this.sessionsList) {
			return;
		}

		const session = this.agentSessionsService.model.getSession(sessionResource);
		if (!session || !this.sessionsList.hasNode(session)) {
			return;
		}

		if (this.sessionsList.getRelativeTop(session) === null) {
			this.sessionsList.reveal(session, 0.5); // only reveal when not already visible
		}

		this.sessionsList.setFocus([session]);
		this.sessionsList.setSelection([session]);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/agentSessions/agentSessionsFilter.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/agentSessions/agentSessionsFilter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { equals } from '../../../../../base/common/objects.js';
import { localize } from '../../../../../nls.js';
import { registerAction2, Action2, MenuId } from '../../../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { IChatSessionsService } from '../../common/chatSessionsService.js';
import { AgentSessionProviders, getAgentSessionProviderName } from './agentSessions.js';
import { AgentSessionStatus, IAgentSession } from './agentSessionsModel.js';
import { IAgentSessionsFilter } from './agentSessionsViewer.js';

export interface IAgentSessionsFilterOptions extends Partial<IAgentSessionsFilter> {

	readonly filterMenuId: MenuId;

	readonly limitResults?: () => number | undefined;
	notifyResults?(count: number): void;

	readonly groupResults?: () => boolean | undefined;

	overrideExclude?(session: IAgentSession): boolean | undefined;
}

interface IAgentSessionsViewExcludes {
	readonly providers: readonly string[];
	readonly states: readonly AgentSessionStatus[];

	readonly archived: boolean;
	readonly read: boolean;
}

const DEFAULT_EXCLUDES: IAgentSessionsViewExcludes = Object.freeze({
	providers: [] as const,
	states: [] as const,
	archived: true as const,
	read: false as const,
});

export class AgentSessionsFilter extends Disposable implements Required<IAgentSessionsFilter> {

	private readonly STORAGE_KEY: string;

	private readonly _onDidChange = this._register(new Emitter<void>());
	readonly onDidChange = this._onDidChange.event;

	readonly limitResults = () => this.options.limitResults?.();
	readonly groupResults = () => this.options.groupResults?.();

	private excludes = DEFAULT_EXCLUDES;

	private readonly actionDisposables = this._register(new DisposableStore());

	constructor(
		private readonly options: IAgentSessionsFilterOptions,
		@IChatSessionsService private readonly chatSessionsService: IChatSessionsService,
		@IStorageService private readonly storageService: IStorageService,
	) {
		super();

		this.STORAGE_KEY = `agentSessions.filterExcludes.${this.options.filterMenuId.id.toLowerCase()}`;

		this.updateExcludes(false);

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.chatSessionsService.onDidChangeItemsProviders(() => this.updateFilterActions()));
		this._register(this.chatSessionsService.onDidChangeAvailability(() => this.updateFilterActions()));

		this._register(this.storageService.onDidChangeValue(StorageScope.PROFILE, this.STORAGE_KEY, this._store)(() => this.updateExcludes(true)));
	}

	private updateExcludes(fromEvent: boolean): void {
		const excludedTypesRaw = this.storageService.get(this.STORAGE_KEY, StorageScope.PROFILE);
		if (excludedTypesRaw) {
			try {
				this.excludes = JSON.parse(excludedTypesRaw) as IAgentSessionsViewExcludes;
			} catch {
				this.resetExcludes();
			}
		} else {
			this.resetExcludes();
		}

		this.updateFilterActions();

		if (fromEvent) {
			this._onDidChange.fire();
		}
	}

	private resetExcludes(): void {
		this.excludes = {
			providers: [...DEFAULT_EXCLUDES.providers],
			states: [...DEFAULT_EXCLUDES.states],
			archived: DEFAULT_EXCLUDES.archived,
			read: DEFAULT_EXCLUDES.read,
		};
	}

	private storeExcludes(excludes: IAgentSessionsViewExcludes): void {
		this.excludes = excludes;

		this.storageService.store(this.STORAGE_KEY, JSON.stringify(this.excludes), StorageScope.PROFILE, StorageTarget.USER);
	}

	private updateFilterActions(): void {
		this.actionDisposables.clear();

		this.registerProviderActions(this.actionDisposables);
		this.registerStateActions(this.actionDisposables);
		this.registerArchivedActions(this.actionDisposables);
		this.registerReadActions(this.actionDisposables);
		this.registerResetAction(this.actionDisposables);
	}

	private registerProviderActions(disposables: DisposableStore): void {
		const providers: { id: string; label: string }[] = [
			{ id: AgentSessionProviders.Local, label: getAgentSessionProviderName(AgentSessionProviders.Local) },
			{ id: AgentSessionProviders.Background, label: getAgentSessionProviderName(AgentSessionProviders.Background) },
			{ id: AgentSessionProviders.Cloud, label: getAgentSessionProviderName(AgentSessionProviders.Cloud) },
		];

		for (const provider of this.chatSessionsService.getAllChatSessionContributions()) {
			if (providers.find(p => p.id === provider.type)) {
				continue; // already added
			}

			providers.push({ id: provider.type, label: provider.name });
		}

		const that = this;
		let counter = 0;
		for (const provider of providers) {
			disposables.add(registerAction2(class extends Action2 {
				constructor() {
					super({
						id: `agentSessions.filter.toggleExclude:${provider.id}.${that.options.filterMenuId.id.toLowerCase()}`,
						title: provider.label,
						menu: {
							id: that.options.filterMenuId,
							group: '1_providers',
							order: counter++,
						},
						toggled: that.excludes.providers.includes(provider.id) ? ContextKeyExpr.false() : ContextKeyExpr.true(),
					});
				}
				run(): void {
					const providerExcludes = new Set(that.excludes.providers);
					if (!providerExcludes.delete(provider.id)) {
						providerExcludes.add(provider.id);
					}

					that.storeExcludes({ ...that.excludes, providers: Array.from(providerExcludes) });
				}
			}));
		}
	}

	private registerStateActions(disposables: DisposableStore): void {
		const states: { id: AgentSessionStatus; label: string }[] = [
			{ id: AgentSessionStatus.Completed, label: localize('agentSessionStatus.completed', "Completed") },
			{ id: AgentSessionStatus.InProgress, label: localize('agentSessionStatus.inProgress', "In Progress") },
			{ id: AgentSessionStatus.NeedsInput, label: localize('agentSessionStatus.needsInput', "Input Needed") },
			{ id: AgentSessionStatus.Failed, label: localize('agentSessionStatus.failed', "Failed") },
		];

		const that = this;
		let counter = 0;
		for (const state of states) {
			disposables.add(registerAction2(class extends Action2 {
				constructor() {
					super({
						id: `agentSessions.filter.toggleExcludeState:${state.id}.${that.options.filterMenuId.id.toLowerCase()}`,
						title: state.label,
						menu: {
							id: that.options.filterMenuId,
							group: '2_states',
							order: counter++,
						},
						toggled: that.excludes.states.includes(state.id) ? ContextKeyExpr.false() : ContextKeyExpr.true(),
					});
				}
				run(): void {
					const stateExcludes = new Set(that.excludes.states);
					if (!stateExcludes.delete(state.id)) {
						stateExcludes.add(state.id);
					}

					that.storeExcludes({ ...that.excludes, states: Array.from(stateExcludes) });
				}
			}));
		}
	}

	private registerArchivedActions(disposables: DisposableStore): void {
		const that = this;
		disposables.add(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: `agentSessions.filter.toggleExcludeArchived.${that.options.filterMenuId.id.toLowerCase()}`,
					title: localize('agentSessions.filter.archived', 'Archived'),
					menu: {
						id: that.options.filterMenuId,
						group: '3_props',
						order: 1000,
					},
					toggled: that.excludes.archived ? ContextKeyExpr.false() : ContextKeyExpr.true(),
				});
			}
			run(): void {
				that.storeExcludes({ ...that.excludes, archived: !that.excludes.archived });
			}
		}));
	}

	private registerReadActions(disposables: DisposableStore): void {
		const that = this;
		disposables.add(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: `agentSessions.filter.toggleExcludeRead.${that.options.filterMenuId.id.toLowerCase()}`,
					title: localize('agentSessions.filter.read', 'Read'),
					menu: {
						id: that.options.filterMenuId,
						group: '3_props',
						order: 0,
					},
					toggled: that.excludes.read ? ContextKeyExpr.false() : ContextKeyExpr.true(),
				});
			}
			run(): void {
				that.storeExcludes({ ...that.excludes, read: !that.excludes.read });
			}
		}));
	}

	private registerResetAction(disposables: DisposableStore): void {
		const that = this;
		disposables.add(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: `agentSessions.filter.resetExcludes.${that.options.filterMenuId.id.toLowerCase()}`,
					title: localize('agentSessions.filter.reset', "Reset"),
					menu: {
						id: that.options.filterMenuId,
						group: '4_reset',
						order: 0,
					},
				});
			}
			run(): void {
				that.resetExcludes();

				that.storageService.store(that.STORAGE_KEY, JSON.stringify(that.excludes), StorageScope.PROFILE, StorageTarget.USER);
			}
		}));
	}

	isDefault(): boolean {
		return equals(this.excludes, DEFAULT_EXCLUDES);
	}

	exclude(session: IAgentSession): boolean {
		const overrideExclude = this.options?.overrideExclude?.(session);
		if (typeof overrideExclude === 'boolean') {
			return overrideExclude;
		}

		if (this.excludes.archived && session.isArchived()) {
			return true;
		}

		if (this.excludes.read && (session.isArchived() || session.isRead())) {
			return true;
		}

		if (this.excludes.providers.includes(session.providerType)) {
			return true;
		}

		if (this.excludes.states.includes(session.status)) {
			return true;
		}

		return false;
	}

	notifyResults(count: number): void {
		this.options.notifyResults?.(count);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/agentSessions/agentSessionsModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/agentSessions/agentSessionsModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ThrottledDelayer } from '../../../../../base/common/async.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { IMarkdownString } from '../../../../../base/common/htmlContent.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../../base/common/map.js';
import { MarshalledId } from '../../../../../base/common/marshallingIds.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { URI, UriComponents } from '../../../../../base/common/uri.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { ILifecycleService } from '../../../../services/lifecycle/common/lifecycle.js';
import { ChatSessionStatus as AgentSessionStatus, IChatSessionFileChange, IChatSessionItem, IChatSessionsExtensionPoint, IChatSessionsService, isSessionInProgressStatus } from '../../common/chatSessionsService.js';
import { AgentSessionProviders, getAgentSessionProviderIcon, getAgentSessionProviderName } from './agentSessions.js';

//#region Interfaces, Types

export { ChatSessionStatus as AgentSessionStatus } from '../../common/chatSessionsService.js';
export { isSessionInProgressStatus } from '../../common/chatSessionsService.js';

export interface IAgentSessionsModel {

	readonly onWillResolve: Event<void>;
	readonly onDidResolve: Event<void>;

	readonly onDidChangeSessions: Event<void>;

	readonly sessions: IAgentSession[];
	getSession(resource: URI): IAgentSession | undefined;

	resolve(provider: string | string[] | undefined): Promise<void>;
}

interface IAgentSessionData extends Omit<IChatSessionItem, 'archived' | 'iconPath'> {

	readonly providerType: string;
	readonly providerLabel: string;

	readonly resource: URI;

	readonly status: AgentSessionStatus;

	readonly tooltip?: string | IMarkdownString;

	readonly label: string;
	readonly description?: string | IMarkdownString;
	readonly badge?: string | IMarkdownString;
	readonly icon: ThemeIcon;

	readonly timing: IChatSessionItem['timing'] & {
		readonly inProgressTime?: number;
		readonly finishedOrFailedTime?: number;
	};

	readonly changes?: IChatSessionItem['changes'];
}

/**
 * Checks if the provided changes object represents valid diff information.
 */
export function hasValidDiff(changes: IAgentSession['changes']): boolean {
	if (!changes) {
		return false;
	}

	if (changes instanceof Array) {
		return changes.length > 0;
	}

	return changes.files > 0 || changes.insertions > 0 || changes.deletions > 0;
}

/**
 * Gets a summary of agent session changes, converting from array format to object format if needed.
 */
export function getAgentChangesSummary(changes: IAgentSession['changes']) {
	if (!changes) {
		return;
	}

	if (!(changes instanceof Array)) {
		return changes;
	}

	let insertions = 0;
	let deletions = 0;
	for (const change of changes) {
		insertions += change.insertions;
		deletions += change.deletions;
	}

	return { files: changes.length, insertions, deletions };
}

export interface IAgentSession extends IAgentSessionData {
	isArchived(): boolean;
	setArchived(archived: boolean): void;

	isRead(): boolean;
	setRead(read: boolean): void;
}

interface IInternalAgentSessionData extends IAgentSessionData {

	/**
	 * The `archived` property is provided by the session provider
	 * and will be used as the initial value if the user has not
	 * changed the archived state for the session previously. It
	 * is kept internal to not expose it publicly. Use `isArchived()`
	 * and `setArchived()` methods instead.
	 */
	readonly archived: boolean | undefined;
}

interface IInternalAgentSession extends IAgentSession, IInternalAgentSessionData { }

export function isLocalAgentSessionItem(session: IAgentSession): boolean {
	return session.providerType === AgentSessionProviders.Local;
}

export function isAgentSession(obj: unknown): obj is IAgentSession {
	const session = obj as IAgentSession | undefined;

	return URI.isUri(session?.resource) && typeof session.setArchived === 'function' && typeof session.setRead === 'function';
}

export function isAgentSessionsModel(obj: unknown): obj is IAgentSessionsModel {
	const sessionsModel = obj as IAgentSessionsModel | undefined;

	return Array.isArray(sessionsModel?.sessions) && typeof sessionsModel?.getSession === 'function';
}

interface IAgentSessionState {
	readonly archived: boolean;
	readonly read: number /* last date turned read */;
}

export const enum AgentSessionSection {
	InProgress = 'inProgress',
	Today = 'today',
	Yesterday = 'yesterday',
	Week = 'week',
	Older = 'older',
	Archived = 'archived',
}

export interface IAgentSessionSection {
	readonly section: AgentSessionSection;
	readonly label: string;
	readonly sessions: IAgentSession[];
}

export function isAgentSessionSection(obj: IAgentSessionsModel | IAgentSession | IAgentSessionSection): obj is IAgentSessionSection {
	const candidate = obj as IAgentSessionSection;

	return typeof candidate.section === 'string' && Array.isArray(candidate.sessions);
}

export interface IMarshalledAgentSessionContext {
	readonly $mid: MarshalledId.AgentSessionContext;
	readonly session: IAgentSession;
}

export function isMarshalledAgentSessionContext(thing: unknown): thing is IMarshalledAgentSessionContext {
	if (typeof thing === 'object' && thing !== null) {
		const candidate = thing as IMarshalledAgentSessionContext;
		return candidate.$mid === MarshalledId.AgentSessionContext && typeof candidate.session === 'object' && candidate.session !== null;
	}

	return false;
}

//#endregion

export class AgentSessionsModel extends Disposable implements IAgentSessionsModel {

	private readonly _onWillResolve = this._register(new Emitter<void>());
	readonly onWillResolve = this._onWillResolve.event;

	private readonly _onDidResolve = this._register(new Emitter<void>());
	readonly onDidResolve = this._onDidResolve.event;

	private readonly _onDidChangeSessions = this._register(new Emitter<void>());
	readonly onDidChangeSessions = this._onDidChangeSessions.event;

	private _sessions: ResourceMap<IInternalAgentSession>;
	get sessions(): IAgentSession[] { return Array.from(this._sessions.values()); }

	private readonly resolver = this._register(new ThrottledDelayer<void>(100));
	private readonly providersToResolve = new Set<string | undefined>();

	private readonly mapSessionToState = new ResourceMap<{
		status: AgentSessionStatus;

		inProgressTime?: number;
		finishedOrFailedTime?: number;
	}>();

	private readonly cache: AgentSessionsCache;

	constructor(
		@IChatSessionsService private readonly chatSessionsService: IChatSessionsService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IStorageService private readonly storageService: IStorageService,
		@ILogService private readonly logService: ILogService,
	) {
		super();

		this._sessions = new ResourceMap<IInternalAgentSession>();

		this.cache = this.instantiationService.createInstance(AgentSessionsCache);
		for (const data of this.cache.loadCachedSessions()) {
			const session = this.toAgentSession(data);
			this._sessions.set(session.resource, session);
		}
		this.sessionStates = this.cache.loadSessionStates();

		this.registerListeners();
	}

	private registerListeners(): void {

		// Sessions changes
		this._register(this.chatSessionsService.onDidChangeItemsProviders(({ chatSessionType: provider }) => this.resolve(provider)));
		this._register(this.chatSessionsService.onDidChangeAvailability(() => this.resolve(undefined)));
		this._register(this.chatSessionsService.onDidChangeSessionItems(provider => this.resolve(provider)));

		// State
		this._register(this.storageService.onWillSaveState(() => {
			this.cache.saveCachedSessions(Array.from(this._sessions.values()));
			this.cache.saveSessionStates(this.sessionStates);
		}));
	}

	getSession(resource: URI): IAgentSession | undefined {
		return this._sessions.get(resource);
	}

	async resolve(provider: string | string[] | undefined): Promise<void> {
		if (Array.isArray(provider)) {
			for (const p of provider) {
				this.providersToResolve.add(p);
			}
		} else {
			this.providersToResolve.add(provider);
		}

		return this.resolver.trigger(async token => {
			if (token.isCancellationRequested || this.lifecycleService.willShutdown) {
				return;
			}

			try {
				this._onWillResolve.fire();
				return await this.doResolve(token);
			} finally {
				this._onDidResolve.fire();
			}
		});
	}

	private async doResolve(token: CancellationToken): Promise<void> {
		const providersToResolve = Array.from(this.providersToResolve);
		this.providersToResolve.clear();

		const mapSessionContributionToType = new Map<string, IChatSessionsExtensionPoint>();
		for (const contribution of this.chatSessionsService.getAllChatSessionContributions()) {
			mapSessionContributionToType.set(contribution.type, contribution);
		}

		const resolvedProviders = new Set<string>();
		const sessions = new ResourceMap<IInternalAgentSession>();
		for (const provider of this.chatSessionsService.getAllChatSessionItemProviders()) {
			if (!providersToResolve.includes(undefined) && !providersToResolve.includes(provider.chatSessionType)) {
				continue; // skip: not considered for resolving
			}

			let providerSessions: IChatSessionItem[];
			try {
				providerSessions = await provider.provideChatSessionItems(token);
			} catch (error) {
				this.logService.error(`Failed to resolve sessions for provider ${provider.chatSessionType}`, error);
				continue; // skip: failed to resolve sessions for provider
			}

			resolvedProviders.add(provider.chatSessionType);

			if (token.isCancellationRequested) {
				return;
			}

			for (const session of providerSessions) {

				// Icon + Label
				let icon: ThemeIcon;
				let providerLabel: string;
				switch ((provider.chatSessionType)) {
					case AgentSessionProviders.Local:
						providerLabel = getAgentSessionProviderName(AgentSessionProviders.Local);
						icon = getAgentSessionProviderIcon(AgentSessionProviders.Local);
						break;
					case AgentSessionProviders.Background:
						providerLabel = getAgentSessionProviderName(AgentSessionProviders.Background);
						icon = getAgentSessionProviderIcon(AgentSessionProviders.Background);
						break;
					case AgentSessionProviders.Cloud:
						providerLabel = getAgentSessionProviderName(AgentSessionProviders.Cloud);
						icon = getAgentSessionProviderIcon(AgentSessionProviders.Cloud);
						break;
					default: {
						providerLabel = mapSessionContributionToType.get(provider.chatSessionType)?.name ?? provider.chatSessionType;
						icon = session.iconPath ?? Codicon.terminal;
					}
				}

				// State + Timings
				// TODO@bpasero this is a workaround for not having precise timing info in sessions
				// yet: we only track the time when a transition changes because then we can say with
				// confidence that the time is correct by assuming `Date.now()`. A better approach would
				// be to get all this information directly from the session.
				const status = session.status ?? AgentSessionStatus.Completed;
				const state = this.mapSessionToState.get(session.resource);
				let inProgressTime = state?.inProgressTime;
				let finishedOrFailedTime = state?.finishedOrFailedTime;

				// No previous state, just add it
				if (!state) {
					this.mapSessionToState.set(session.resource, {
						status,
						inProgressTime: isSessionInProgressStatus(status) ? Date.now() : undefined, // this is not accurate but best effort
					});
				}

				// State changed, update it
				else if (status !== state.status) {
					inProgressTime = isSessionInProgressStatus(status) ? Date.now() : state.inProgressTime;
					finishedOrFailedTime = !isSessionInProgressStatus(status) ? Date.now() : state.finishedOrFailedTime;

					this.mapSessionToState.set(session.resource, {
						status,
						inProgressTime,
						finishedOrFailedTime
					});
				}

				const changes = session.changes;
				const normalizedChanges = changes && !(changes instanceof Array)
					? { files: changes.files, insertions: changes.insertions, deletions: changes.deletions }
					: changes;

				// Times: it is important to always provide a start and end time to track
				// unread/read state for example.
				// If somehow the provider does not provide any, fallback to last known
				let startTime = session.timing.startTime;
				let endTime = session.timing.endTime;
				if (!startTime || !endTime) {
					const existing = this._sessions.get(session.resource);
					if (!startTime && existing?.timing.startTime) {
						startTime = existing.timing.startTime;
					}

					if (!endTime && existing?.timing.endTime) {
						endTime = existing.timing.endTime;
					}
				}

				sessions.set(session.resource, this.toAgentSession({
					providerType: provider.chatSessionType,
					providerLabel,
					resource: session.resource,
					label: session.label,
					description: session.description,
					icon,
					badge: session.badge,
					tooltip: session.tooltip,
					status,
					archived: session.archived,
					timing: { startTime, endTime, inProgressTime, finishedOrFailedTime },
					changes: normalizedChanges,
				}));
			}
		}

		for (const [, session] of this._sessions) {
			if (!resolvedProviders.has(session.providerType)) {
				sessions.set(session.resource, session); // fill in existing sessions for providers that did not resolve
			}
		}

		this._sessions = sessions;

		for (const [resource] of this.mapSessionToState) {
			if (!sessions.has(resource)) {
				this.mapSessionToState.delete(resource); // clean up tracking for removed sessions
			}
		}

		for (const [resource] of this.sessionStates) {
			if (!sessions.has(resource)) {
				this.sessionStates.delete(resource); // clean up states for removed sessions
			}
		}

		this._onDidChangeSessions.fire();
	}

	private toAgentSession(data: IInternalAgentSessionData): IInternalAgentSession {
		return {
			...data,
			isArchived: () => this.isArchived(data),
			setArchived: (archived: boolean) => this.setArchived(data, archived),
			isRead: () => this.isRead(data),
			setRead: (read: boolean) => this.setRead(data, read),
		};
	}

	//#region States

	// In order to reduce the amount of unread sessions a user will
	// see after updating to 1.107, we specify a fixed date that a
	// session needs to be created after to be considered unread unless
	// the user has explicitly marked it as read.
	private static readonly READ_STATE_INITIAL_DATE = Date.UTC(2025, 11 /* December */, 8);

	private readonly sessionStates: ResourceMap<IAgentSessionState>;

	private isArchived(session: IInternalAgentSessionData): boolean {
		return this.sessionStates.get(session.resource)?.archived ?? Boolean(session.archived);
	}

	private setArchived(session: IInternalAgentSessionData, archived: boolean): void {
		if (archived === this.isArchived(session)) {
			return; // no change
		}

		const state = this.sessionStates.get(session.resource) ?? { archived: false, read: 0 };
		this.sessionStates.set(session.resource, { ...state, archived });

		this._onDidChangeSessions.fire();
	}

	private isRead(session: IInternalAgentSessionData): boolean {
		const readDate = this.sessionStates.get(session.resource)?.read;

		return (readDate ?? AgentSessionsModel.READ_STATE_INITIAL_DATE) >= (session.timing.endTime ?? session.timing.startTime);
	}

	private setRead(session: IInternalAgentSessionData, read: boolean): void {
		if (read === this.isRead(session)) {
			return; // no change
		}

		const state = this.sessionStates.get(session.resource) ?? { archived: false, read: 0 };
		this.sessionStates.set(session.resource, { ...state, read: read ? Date.now() : 0 });

		this._onDidChangeSessions.fire();
	}

	//#endregion
}

//#region Sessions Cache

interface ISerializedAgentSession extends Omit<IAgentSessionData, 'iconPath' | 'resource' | 'icon'> {

	readonly providerType: string;
	readonly providerLabel: string;

	readonly resource: UriComponents;

	readonly status: AgentSessionStatus;

	readonly tooltip?: string | IMarkdownString;

	readonly label: string;
	readonly description?: string | IMarkdownString;
	readonly badge?: string | IMarkdownString;
	readonly icon: string;

	readonly archived: boolean | undefined;

	readonly timing: {
		readonly startTime: number;
		readonly endTime?: number;
	};

	readonly changes?: readonly IChatSessionFileChange[] | {
		readonly files: number;
		readonly insertions: number;
		readonly deletions: number;
	};
}

interface ISerializedAgentSessionState extends IAgentSessionState {
	readonly resource: UriComponents;
}

class AgentSessionsCache {

	private static readonly SESSIONS_STORAGE_KEY = 'agentSessions.model.cache';
	private static readonly STATE_STORAGE_KEY = 'agentSessions.state.cache';

	constructor(
		@IStorageService private readonly storageService: IStorageService
	) { }

	//#region Sessions

	saveCachedSessions(sessions: IInternalAgentSessionData[]): void {
		const serialized: ISerializedAgentSession[] = sessions.map(session => ({
			providerType: session.providerType,
			providerLabel: session.providerLabel,

			resource: session.resource.toJSON(),

			icon: session.icon.id,
			label: session.label,
			description: session.description,
			badge: session.badge,
			tooltip: session.tooltip,

			status: session.status,
			archived: session.archived,

			timing: {
				startTime: session.timing.startTime,
				endTime: session.timing.endTime,
			},

			changes: session.changes,
		} satisfies ISerializedAgentSession));

		this.storageService.store(AgentSessionsCache.SESSIONS_STORAGE_KEY, JSON.stringify(serialized), StorageScope.WORKSPACE, StorageTarget.MACHINE);
	}

	loadCachedSessions(): IInternalAgentSessionData[] {
		const sessionsCache = this.storageService.get(AgentSessionsCache.SESSIONS_STORAGE_KEY, StorageScope.WORKSPACE);
		if (!sessionsCache) {
			return [];
		}

		try {
			const cached = JSON.parse(sessionsCache) as ISerializedAgentSession[];
			return cached.map(session => ({
				providerType: session.providerType,
				providerLabel: session.providerLabel,

				resource: URI.revive(session.resource),

				icon: ThemeIcon.fromId(session.icon),
				label: session.label,
				description: session.description,
				badge: session.badge,
				tooltip: session.tooltip,

				status: session.status,
				archived: session.archived,

				timing: {
					startTime: session.timing.startTime,
					endTime: session.timing.endTime,
				},

				changes: Array.isArray(session.changes) ? session.changes.map((change: IChatSessionFileChange) => ({
					modifiedUri: URI.revive(change.modifiedUri),
					originalUri: change.originalUri ? URI.revive(change.originalUri) : undefined,
					insertions: change.insertions,
					deletions: change.deletions,
				})) : session.changes,
			}));
		} catch {
			return []; // invalid data in storage, fallback to empty sessions list
		}
	}

	//#endregion

	//#region States

	saveSessionStates(states: ResourceMap<IAgentSessionState>): void {
		const serialized: ISerializedAgentSessionState[] = Array.from(states.entries()).map(([resource, state]) => ({
			resource: resource.toJSON(),
			archived: state.archived,
			read: state.read
		}));

		this.storageService.store(AgentSessionsCache.STATE_STORAGE_KEY, JSON.stringify(serialized), StorageScope.WORKSPACE, StorageTarget.MACHINE);
	}

	loadSessionStates(): ResourceMap<IAgentSessionState> {
		const states = new ResourceMap<IAgentSessionState>();

		const statesCache = this.storageService.get(AgentSessionsCache.STATE_STORAGE_KEY, StorageScope.WORKSPACE);
		if (!statesCache) {
			return states;
		}

		try {
			const cached = JSON.parse(statesCache) as ISerializedAgentSessionState[];

			for (const entry of cached) {
				states.set(URI.revive(entry.resource), {
					archived: entry.archived,
					read: entry.read
				});
			}
		} catch {
			// invalid data in storage, fallback to empty states
		}

		return states;
	}

	//#endregion
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/agentSessions/agentSessionsOpener.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/agentSessions/agentSessionsOpener.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAgentSession, isLocalAgentSessionItem } from './agentSessionsModel.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { IChatEditorOptions } from '../chatEditor.js';
import { ChatViewPaneTarget, IChatWidgetService } from '../chat.js';
import { ACTIVE_GROUP, SIDE_GROUP } from '../../../../services/editor/common/editorService.js';
import { IEditorOptions } from '../../../../../platform/editor/common/editor.js';
import { IChatSessionsService } from '../../common/chatSessionsService.js';
import { Schemas } from '../../../../../base/common/network.js';

export async function openSession(accessor: ServicesAccessor, session: IAgentSession, openOptions?: { sideBySide?: boolean; editorOptions?: IEditorOptions }): Promise<void> {
	const chatSessionsService = accessor.get(IChatSessionsService);
	const chatWidgetService = accessor.get(IChatWidgetService);

	session.setRead(true); // mark as read when opened

	let sessionOptions: IChatEditorOptions;
	if (isLocalAgentSessionItem(session)) {
		sessionOptions = {};
	} else {
		sessionOptions = { title: { preferred: session.label } };
	}

	let options: IChatEditorOptions = {
		...sessionOptions,
		...openOptions?.editorOptions,
		revealIfOpened: true // always try to reveal if already opened
	};

	await chatSessionsService.activateChatSessionItemProvider(session.providerType); // ensure provider is activated before trying to open

	let target: typeof SIDE_GROUP | typeof ACTIVE_GROUP | typeof ChatViewPaneTarget | undefined;
	if (openOptions?.sideBySide) {
		target = ACTIVE_GROUP;
	} else {
		target = ChatViewPaneTarget;
	}

	const isLocalChatSession = session.resource.scheme === Schemas.vscodeChatEditor || session.resource.scheme === Schemas.vscodeLocalChatSession;
	if (!isLocalChatSession && !(await chatSessionsService.canResolveChatSession(session.resource))) {
		target = openOptions?.sideBySide ? SIDE_GROUP : ACTIVE_GROUP; // force to open in editor if session cannot be resolved in panel
		options = { ...options, revealIfOpened: true };
	}

	await chatWidgetService.openSession(session.resource, target, options);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/agentSessions/agentSessionsPicker.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/agentSessions/agentSessionsPicker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { renderAsPlaintext } from '../../../../../base/browser/markdownRenderer.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { fromNow } from '../../../../../base/common/date.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { localize } from '../../../../../nls.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IQuickInputButton, IQuickInputService, IQuickPickItem, IQuickPickSeparator } from '../../../../../platform/quickinput/common/quickInput.js';
import { openSession } from './agentSessionsOpener.js';
import { IAgentSession, isLocalAgentSessionItem } from './agentSessionsModel.js';
import { IAgentSessionsService } from './agentSessionsService.js';
import { AgentSessionsSorter, groupAgentSessions } from './agentSessionsViewer.js';
import { AGENT_SESSION_DELETE_ACTION_ID, AGENT_SESSION_RENAME_ACTION_ID } from './agentSessions.js';

interface ISessionPickItem extends IQuickPickItem {
	readonly session: IAgentSession;
}

const archiveButton: IQuickInputButton = {
	iconClass: ThemeIcon.asClassName(Codicon.archive),
	tooltip: localize('archiveSession', "Archive")
};

const unarchiveButton: IQuickInputButton = {
	iconClass: ThemeIcon.asClassName(Codicon.inbox),
	tooltip: localize('unarchiveSession', "Unarchive")
};

const renameButton: IQuickInputButton = {
	iconClass: ThemeIcon.asClassName(Codicon.edit),
	tooltip: localize('renameSession', "Rename")
};

const deleteButton: IQuickInputButton = {
	iconClass: ThemeIcon.asClassName(Codicon.trash),
	tooltip: localize('deleteSession', "Delete")
};

export class AgentSessionsPicker {

	private readonly sorter = new AgentSessionsSorter();

	constructor(
		@IAgentSessionsService private readonly agentSessionsService: IAgentSessionsService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ICommandService private readonly commandService: ICommandService,
	) { }

	async pickAgentSession(): Promise<void> {
		const disposables = new DisposableStore();
		const picker = disposables.add(this.quickInputService.createQuickPick<ISessionPickItem>({ useSeparators: true }));

		picker.items = this.createPickerItems();
		picker.canAcceptInBackground = true;
		picker.placeholder = localize('chatAgentPickerPlaceholder', "Search agent sessions by name");

		disposables.add(picker.onDidAccept(e => {
			const pick = picker.selectedItems[0];
			if (pick) {
				this.instantiationService.invokeFunction(openSession, pick.session, {
					sideBySide: e.inBackground,
					editorOptions: {
						preserveFocus: e.inBackground,
						pinned: false
					}
				});
			}

			if (!e.inBackground) {
				picker.hide();
			}
		}));

		disposables.add(picker.onDidTriggerItemButton(async e => {
			const session = e.item.session;

			let reopenResolved: boolean = false;
			if (e.button === renameButton) {
				reopenResolved = true;
				await this.commandService.executeCommand(AGENT_SESSION_RENAME_ACTION_ID, session);
			} else if (e.button === deleteButton) {
				reopenResolved = true;
				await this.commandService.executeCommand(AGENT_SESSION_DELETE_ACTION_ID, session);
			} else {
				const newArchivedState = !session.isArchived();
				session.setArchived(newArchivedState);
			}

			if (reopenResolved) {
				await this.agentSessionsService.model.resolve(session.providerType);
				this.pickAgentSession();
			} else {
				picker.items = this.createPickerItems();
			}
		}));

		disposables.add(picker.onDidHide(() => disposables.dispose()));
		picker.show();
	}

	private createPickerItems(): (ISessionPickItem | IQuickPickSeparator)[] {
		const sessions = this.agentSessionsService.model.sessions.sort(this.sorter.compare.bind(this.sorter));
		const items: (ISessionPickItem | IQuickPickSeparator)[] = [];

		const groupedSessions = groupAgentSessions(sessions);

		for (const group of groupedSessions.values()) {
			if (group.sessions.length > 0) {
				items.push({ type: 'separator', label: group.label });
				items.push(...group.sessions.map(session => this.toPickItem(session)));
			}
		}

		return items;
	}

	private toPickItem(session: IAgentSession): ISessionPickItem {
		const descriptionText = typeof session.description === 'string' ? session.description : session.description ? renderAsPlaintext(session.description) : undefined;
		const timeAgo = fromNow(session.timing.endTime || session.timing.startTime);
		const descriptionParts = [descriptionText, session.providerLabel, timeAgo].filter(part => !!part);
		const description = descriptionParts.join(' • ');

		const buttons: IQuickInputButton[] = [];
		if (isLocalAgentSessionItem(session)) {
			buttons.push(renameButton);
			buttons.push(deleteButton);
		}
		buttons.push(session.isArchived() ? unarchiveButton : archiveButton);

		return {
			id: session.resource.toString(),
			label: session.label,
			tooltip: session.tooltip,
			description,
			iconClass: ThemeIcon.asClassName(session.icon),
			buttons,
			session
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/agentSessions/agentSessionsService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/agentSessions/agentSessionsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { createDecorator, IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { AgentSessionsModel, IAgentSession, IAgentSessionsModel } from './agentSessionsModel.js';

export interface IAgentSessionsService {

	readonly _serviceBrand: undefined;

	readonly model: IAgentSessionsModel;

	getSession(resource: URI): IAgentSession | undefined;
}

export class AgentSessionsService extends Disposable implements IAgentSessionsService {

	declare readonly _serviceBrand: undefined;

	private _model: IAgentSessionsModel | undefined;
	get model(): IAgentSessionsModel {
		if (!this._model) {
			this._model = this._register(this.instantiationService.createInstance(AgentSessionsModel));
			this._model.resolve(undefined /* all providers */);
		}

		return this._model;
	}

	constructor(@IInstantiationService private readonly instantiationService: IInstantiationService) {
		super();
	}

	getSession(resource: URI): IAgentSession | undefined {
		return this.model.getSession(resource);
	}
}

export const IAgentSessionsService = createDecorator<IAgentSessionsService>('agentSessions');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/agentSessions/agentSessionsViewer.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/agentSessions/agentSessionsViewer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/agentsessionsviewer.css';
import { h } from '../../../../../base/browser/dom.js';
import { localize } from '../../../../../nls.js';
import { IIdentityProvider, IListVirtualDelegate } from '../../../../../base/browser/ui/list/list.js';
import { IListAccessibilityProvider } from '../../../../../base/browser/ui/list/listWidget.js';
import { ITreeCompressionDelegate } from '../../../../../base/browser/ui/tree/asyncDataTree.js';
import { ICompressedTreeNode } from '../../../../../base/browser/ui/tree/compressedObjectTreeModel.js';
import { ICompressibleKeyboardNavigationLabelProvider, ICompressibleTreeRenderer } from '../../../../../base/browser/ui/tree/objectTree.js';
import { ITreeNode, ITreeElementRenderDetails, IAsyncDataSource, ITreeSorter, ITreeDragAndDrop, ITreeDragOverReaction } from '../../../../../base/browser/ui/tree/tree.js';
import { Disposable, DisposableStore, IDisposable } from '../../../../../base/common/lifecycle.js';
import { AgentSessionSection, AgentSessionStatus, getAgentChangesSummary, hasValidDiff, IAgentSession, IAgentSessionSection, IAgentSessionsModel, isAgentSession, isAgentSessionSection, isAgentSessionsModel, isSessionInProgressStatus } from './agentSessionsModel.js';
import { IconLabel } from '../../../../../base/browser/ui/iconLabel/iconLabel.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { fromNow, getDurationString } from '../../../../../base/common/date.js';
import { FuzzyScore, createMatches } from '../../../../../base/common/filters.js';
import { IMarkdownRendererService } from '../../../../../platform/markdown/browser/markdownRenderer.js';
import { allowedChatMarkdownHtmlTags } from '../chatContentMarkdownRenderer.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { IDragAndDropData } from '../../../../../base/browser/dnd.js';
import { ListViewTargetSector } from '../../../../../base/browser/ui/list/listView.js';
import { coalesce } from '../../../../../base/common/arrays.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { fillEditorsDragData } from '../../../../browser/dnd.js';
import { HoverStyle } from '../../../../../base/browser/ui/hover/hover.js';
import { HoverPosition } from '../../../../../base/browser/ui/hover/hoverWidget.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { IntervalTimer } from '../../../../../base/common/async.js';
import { MenuWorkbenchToolBar } from '../../../../../platform/actions/browser/toolbar.js';
import { MenuId } from '../../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { Event } from '../../../../../base/common/event.js';
import { renderAsPlaintext } from '../../../../../base/browser/markdownRenderer.js';
import { MarkdownString, IMarkdownString } from '../../../../../base/common/htmlContent.js';

export type AgentSessionListItem = IAgentSession | IAgentSessionSection;

//#region Agent Session Renderer

interface IAgentSessionItemTemplate {
	readonly element: HTMLElement;

	// Column 1
	readonly icon: HTMLElement;

	// Column 2 Row 1
	readonly title: IconLabel;
	readonly titleToolbar: MenuWorkbenchToolBar;

	// Column 2 Row 2
	readonly diffContainer: HTMLElement;
	readonly diffFilesSpan: HTMLSpanElement;
	readonly diffAddedSpan: HTMLSpanElement;
	readonly diffRemovedSpan: HTMLSpanElement;

	readonly badge: HTMLElement;
	readonly description: HTMLElement;
	readonly status: HTMLElement;

	readonly contextKeyService: IContextKeyService;
	readonly elementDisposable: DisposableStore;
	readonly disposables: IDisposable;
}

export interface IAgentSessionRendererOptions {
	getHoverPosition(): HoverPosition;
}

export class AgentSessionRenderer implements ICompressibleTreeRenderer<IAgentSession, FuzzyScore, IAgentSessionItemTemplate> {

	static readonly TEMPLATE_ID = 'agent-session';

	readonly templateId = AgentSessionRenderer.TEMPLATE_ID;

	constructor(
		private readonly options: IAgentSessionRendererOptions,
		@IMarkdownRendererService private readonly markdownRendererService: IMarkdownRendererService,
		@IProductService private readonly productService: IProductService,
		@IHoverService private readonly hoverService: IHoverService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
	) { }

	renderTemplate(container: HTMLElement): IAgentSessionItemTemplate {
		const disposables = new DisposableStore();
		const elementDisposable = disposables.add(new DisposableStore());

		const elements = h(
			'div.agent-session-item@item',
			[
				h('div.agent-session-icon-col', [
					h('div.agent-session-icon@icon')
				]),
				h('div.agent-session-main-col', [
					h('div.agent-session-title-row', [
						h('div.agent-session-title@title'),
						h('div.agent-session-title-toolbar@titleToolbar'),
					]),
					h('div.agent-session-details-row', [
						h('div.agent-session-diff-container@diffContainer',
							[
								h('span.agent-session-diff-files@filesSpan'),
								h('span.agent-session-diff-added@addedSpan'),
								h('span.agent-session-diff-removed@removedSpan')
							]),
						h('div.agent-session-badge@badge'),
						h('div.agent-session-description@description'),
						h('div.agent-session-status@status')
					])
				])
			]
		);

		const contextKeyService = disposables.add(this.contextKeyService.createScoped(elements.item));
		const scopedInstantiationService = disposables.add(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, contextKeyService])));
		const titleToolbar = disposables.add(scopedInstantiationService.createInstance(MenuWorkbenchToolBar, elements.titleToolbar, MenuId.AgentSessionItemToolbar, {
			menuOptions: { shouldForwardArgs: true },
		}));

		container.appendChild(elements.item);

		return {
			element: elements.item,
			icon: elements.icon,
			title: disposables.add(new IconLabel(elements.title, { supportHighlights: true, supportIcons: true })),
			titleToolbar,
			diffContainer: elements.diffContainer,
			diffFilesSpan: elements.filesSpan,
			diffAddedSpan: elements.addedSpan,
			diffRemovedSpan: elements.removedSpan,
			badge: elements.badge,
			description: elements.description,
			status: elements.status,
			contextKeyService,
			elementDisposable,
			disposables
		};
	}

	renderElement(session: ITreeNode<IAgentSession, FuzzyScore>, index: number, template: IAgentSessionItemTemplate, details?: ITreeElementRenderDetails): void {

		// Clear old state
		template.elementDisposable.clear();
		template.diffFilesSpan.textContent = '';
		template.diffAddedSpan.textContent = '';
		template.diffRemovedSpan.textContent = '';
		template.badge.textContent = '';
		template.description.textContent = '';

		// Archived
		template.element.classList.toggle('archived', session.element.isArchived());

		// Icon
		template.icon.className = `agent-session-icon ${ThemeIcon.asClassName(this.getIcon(session.element))}`;

		// Title
		const markdownTitle = new MarkdownString(session.element.label);
		template.title.setLabel(renderAsPlaintext(markdownTitle), undefined, { matches: createMatches(session.filterData) });

		// Title Actions - Update context keys
		ChatContextKeys.isArchivedAgentSession.bindTo(template.contextKeyService).set(session.element.isArchived());
		ChatContextKeys.isReadAgentSession.bindTo(template.contextKeyService).set(session.element.isRead());
		ChatContextKeys.agentSessionType.bindTo(template.contextKeyService).set(session.element.providerType);
		template.titleToolbar.context = session.element;

		// Diff information
		let hasDiff = false;
		const { changes: diff } = session.element;
		if (!isSessionInProgressStatus(session.element.status) && diff && hasValidDiff(diff)) {
			if (this.renderDiff(session, template)) {
				hasDiff = true;
			}
		}
		template.diffContainer.classList.toggle('has-diff', hasDiff);

		// Badge
		let hasBadge = false;
		if (!isSessionInProgressStatus(session.element.status)) {
			hasBadge = this.renderBadge(session, template);
		}
		template.badge.classList.toggle('has-badge', hasBadge);

		// Description (unless diff is shown)
		if (!hasDiff) {
			this.renderDescription(session, template, hasBadge);
		}

		// Status
		this.renderStatus(session, template);

		// Hover
		this.renderHover(session, template);
	}

	private renderBadge(session: ITreeNode<IAgentSession, FuzzyScore>, template: IAgentSessionItemTemplate): boolean {
		const badge = session.element.badge;
		if (badge) {
			this.renderMarkdownOrText(badge, template.badge, template.elementDisposable);
		}

		return !!badge;
	}

	private renderMarkdownOrText(content: string | IMarkdownString, container: HTMLElement, disposables: DisposableStore): void {
		if (typeof content === 'string') {
			container.textContent = content;
		} else {
			disposables.add(this.markdownRendererService.render(content, {
				sanitizerConfig: {
					replaceWithPlaintext: true,
					allowedTags: {
						override: allowedChatMarkdownHtmlTags,
					},
					allowedLinkSchemes: { augment: [this.productService.urlProtocol] }
				},
			}, container));
		}
	}

	private renderDiff(session: ITreeNode<IAgentSession, FuzzyScore>, template: IAgentSessionItemTemplate): boolean {
		const diff = getAgentChangesSummary(session.element.changes);
		if (!diff) {
			return false;
		}

		if (diff.files > 0) {
			template.diffFilesSpan.textContent = diff.files === 1 ? localize('diffFile', "1 file") : localize('diffFiles', "{0} files", diff.files);
		}

		if (diff.insertions >= 0 /* render even `0` for more homogeneity */) {
			template.diffAddedSpan.textContent = `+${diff.insertions}`;
		}

		if (diff.deletions >= 0 /* render even `0` for more homogeneity */) {
			template.diffRemovedSpan.textContent = `-${diff.deletions}`;
		}

		return true;
	}

	private getIcon(session: IAgentSession): ThemeIcon {
		if (session.status === AgentSessionStatus.InProgress) {
			return Codicon.sessionInProgress;
		}

		if (session.status === AgentSessionStatus.NeedsInput) {
			return Codicon.report;
		}

		if (session.status === AgentSessionStatus.Failed) {
			return Codicon.error;
		}

		if (!session.isRead() && !session.isArchived()) {
			return Codicon.circleFilled;
		}

		return Codicon.circleSmallFilled;
	}

	private renderDescription(session: ITreeNode<IAgentSession, FuzzyScore>, template: IAgentSessionItemTemplate, hasBadge: boolean): void {
		const description = session.element.description;
		if (description) {
			this.renderMarkdownOrText(description, template.description, template.elementDisposable);
		}

		// Fallback to state label
		else {
			if (isSessionInProgressStatus(session.element.status)) {
				template.description.textContent = localize('chat.session.status.inProgress', "Working...");
			} else if (session.element.status === AgentSessionStatus.NeedsInput) {
				template.description.textContent = localize('chat.session.status.needsInput', "Input needed.");
			} else if (hasBadge && session.element.status === AgentSessionStatus.Completed) {
				template.description.textContent = ''; // no description if completed and has badge
			} else if (
				session.element.timing.finishedOrFailedTime &&
				session.element.timing.inProgressTime &&
				session.element.timing.finishedOrFailedTime > session.element.timing.inProgressTime
			) {
				const duration = this.toDuration(session.element.timing.inProgressTime, session.element.timing.finishedOrFailedTime);

				template.description.textContent = session.element.status === AgentSessionStatus.Failed ?
					localize('chat.session.status.failedAfter', "Failed after {0}.", duration ?? '1s') :
					localize('chat.session.status.completedAfter', "Finished in {0}.", duration ?? '1s');
			} else {
				template.description.textContent = session.element.status === AgentSessionStatus.Failed ?
					localize('chat.session.status.failed', "Failed") :
					localize('chat.session.status.completed', "Finished");
			}
		}
	}

	private toDuration(startTime: number, endTime: number): string | undefined {
		const elapsed = Math.round((endTime - startTime) / 1000) * 1000;
		if (elapsed < 1000) {
			return undefined;
		}

		return getDurationString(elapsed);
	}

	private renderStatus(session: ITreeNode<IAgentSession, FuzzyScore>, template: IAgentSessionItemTemplate): void {

		const getStatus = (session: IAgentSession) => {
			let timeLabel: string | undefined;
			if (isSessionInProgressStatus(session.status) && session.timing.inProgressTime) {
				timeLabel = this.toDuration(session.timing.inProgressTime, Date.now());
			}

			if (!timeLabel) {
				timeLabel = fromNow(session.timing.endTime || session.timing.startTime);
			}

			return `${session.providerLabel} • ${timeLabel}`;
		};

		template.status.textContent = getStatus(session.element);
		const timer = template.elementDisposable.add(new IntervalTimer());
		timer.cancelAndSet(() => template.status.textContent = getStatus(session.element), isSessionInProgressStatus(session.element.status) ? 1000 /* every second */ : 60 * 1000 /* every minute */);
	}

	private renderHover(session: ITreeNode<IAgentSession, FuzzyScore>, template: IAgentSessionItemTemplate): void {
		const tooltip = session.element.tooltip;
		if (tooltip) {
			template.elementDisposable.add(
				this.hoverService.setupDelayedHover(template.element, () => ({
					content: tooltip,
					style: HoverStyle.Pointer,
					position: {
						hoverPosition: this.options.getHoverPosition()
					}
				}), { groupId: 'agent.sessions' })
			);
		}
	}

	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<IAgentSession>, FuzzyScore>, index: number, templateData: IAgentSessionItemTemplate, details?: ITreeElementRenderDetails): void {
		throw new Error('Should never happen since session is incompressible');
	}

	disposeElement(element: ITreeNode<IAgentSession, FuzzyScore>, index: number, template: IAgentSessionItemTemplate, details?: ITreeElementRenderDetails): void {
		template.elementDisposable.clear();
	}

	disposeTemplate(templateData: IAgentSessionItemTemplate): void {
		templateData.disposables.dispose();
	}
}

//#endregion

//#region Section Header Renderer

interface IAgentSessionSectionTemplate {
	readonly container: HTMLElement;
	readonly label: HTMLSpanElement;
	readonly toolbar: MenuWorkbenchToolBar;
	readonly contextKeyService: IContextKeyService;
	readonly disposables: IDisposable;
}

export class AgentSessionSectionRenderer implements ICompressibleTreeRenderer<IAgentSessionSection, FuzzyScore, IAgentSessionSectionTemplate> {

	static readonly TEMPLATE_ID = 'agent-session-section';

	readonly templateId = AgentSessionSectionRenderer.TEMPLATE_ID;

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
	) { }

	renderTemplate(container: HTMLElement): IAgentSessionSectionTemplate {
		const disposables = new DisposableStore();

		const elements = h(
			'div.agent-session-section@container',
			[
				h('span.agent-session-section-label@label'),
				h('div.agent-session-section-toolbar@toolbar')
			]
		);

		const contextKeyService = disposables.add(this.contextKeyService.createScoped(elements.container));
		const scopedInstantiationService = disposables.add(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, contextKeyService])));
		const toolbar = disposables.add(scopedInstantiationService.createInstance(MenuWorkbenchToolBar, elements.toolbar, MenuId.AgentSessionSectionToolbar, {
			menuOptions: { shouldForwardArgs: true },
		}));

		container.appendChild(elements.container);

		return {
			container: elements.container,
			label: elements.label,
			toolbar,
			contextKeyService,
			disposables
		};
	}

	renderElement(element: ITreeNode<IAgentSessionSection, FuzzyScore>, index: number, template: IAgentSessionSectionTemplate, details?: ITreeElementRenderDetails): void {

		// Label
		template.label.textContent = element.element.label;

		// Toolbar
		ChatContextKeys.agentSessionSection.bindTo(template.contextKeyService).set(element.element.section);
		template.toolbar.context = element.element;
	}

	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<IAgentSessionSection>, FuzzyScore>, index: number, templateData: IAgentSessionSectionTemplate, details?: ITreeElementRenderDetails): void {
		throw new Error('Should never happen since section header is incompressible');
	}

	disposeElement(element: ITreeNode<IAgentSessionSection, FuzzyScore>, index: number, template: IAgentSessionSectionTemplate, details?: ITreeElementRenderDetails): void {
		// noop
	}

	disposeTemplate(templateData: IAgentSessionSectionTemplate): void {
		templateData.disposables.dispose();
	}
}

//#endregion

export class AgentSessionsListDelegate implements IListVirtualDelegate<AgentSessionListItem> {

	static readonly ITEM_HEIGHT = 52;
	static readonly SECTION_HEIGHT = 26;

	getHeight(element: AgentSessionListItem): number {
		if (isAgentSessionSection(element)) {
			return AgentSessionsListDelegate.SECTION_HEIGHT;
		}

		return AgentSessionsListDelegate.ITEM_HEIGHT;
	}

	getTemplateId(element: AgentSessionListItem): string {
		if (isAgentSessionSection(element)) {
			return AgentSessionSectionRenderer.TEMPLATE_ID;
		}

		return AgentSessionRenderer.TEMPLATE_ID;
	}
}

export class AgentSessionsAccessibilityProvider implements IListAccessibilityProvider<AgentSessionListItem> {

	getWidgetAriaLabel(): string {
		return localize('agentSessions', "Agent Sessions");
	}

	getAriaLabel(element: AgentSessionListItem): string | null {
		if (isAgentSessionSection(element)) {
			return localize('agentSessionSectionAriaLabel', "{0} sessions section", element.label);
		}

		let statusLabel: string;
		switch (element.status) {
			case AgentSessionStatus.NeedsInput:
				statusLabel = localize('agentSessionNeedsInput', "needs input");
				break;
			case AgentSessionStatus.InProgress:
				statusLabel = localize('agentSessionInProgress', "in progress");
				break;
			case AgentSessionStatus.Failed:
				statusLabel = localize('agentSessionFailed', "failed");
				break;
			default:
				statusLabel = localize('agentSessionCompleted', "completed");
		}

		return localize('agentSessionItemAriaLabel', "{0} session {1} ({2}), created {3}", element.providerLabel, element.label, statusLabel, new Date(element.timing.startTime).toLocaleString());
	}
}

export interface IAgentSessionsFilter {

	/**
	 * An event that fires when the filter changes and sessions
	 * should be re-evaluated.
	 */
	readonly onDidChange: Event<void>;

	/**
	 * Optional limit on the number of sessions to show.
	 */
	readonly limitResults?: () => number | undefined;

	/**
	 * Whether to show section headers to group sessions.
	 * When false, sessions are shown as a flat list.
	 */
	readonly groupResults?: () => boolean | undefined;

	/**
	 * A callback to notify the filter about the number of
	 * results after filtering.
	 */
	notifyResults?(count: number): void;

	/**
	 * The logic to exclude sessions from the view.
	 */
	exclude(session: IAgentSession): boolean;
}

export class AgentSessionsDataSource implements IAsyncDataSource<IAgentSessionsModel, AgentSessionListItem> {

	constructor(
		private readonly filter: IAgentSessionsFilter | undefined,
		private readonly sorter: ITreeSorter<IAgentSession>,
	) { }

	hasChildren(element: IAgentSessionsModel | AgentSessionListItem): boolean {

		// Sessions model
		if (isAgentSessionsModel(element)) {
			return true;
		}

		// Sessions	section
		else if (isAgentSessionSection(element)) {
			return element.sessions.length > 0;
		}

		// Session element
		else {
			return false;
		}
	}

	getChildren(element: IAgentSessionsModel | AgentSessionListItem): Iterable<AgentSessionListItem> {

		// Sessions model
		if (isAgentSessionsModel(element)) {

			// Apply filter if configured
			let filteredSessions = element.sessions.filter(session => !this.filter?.exclude(session));

			// Apply sorter unless we group into sections or we are to limit results
			const limitResultsCount = this.filter?.limitResults?.();
			if (!this.filter?.groupResults?.() || typeof limitResultsCount === 'number') {
				filteredSessions.sort(this.sorter.compare.bind(this.sorter));
			}

			// Apply limiter if configured (requires sorting)
			if (typeof limitResultsCount === 'number') {
				filteredSessions = filteredSessions.slice(0, limitResultsCount);
			}

			// Callback results count
			this.filter?.notifyResults?.(filteredSessions.length);

			// Group sessions into sections if enabled
			if (this.filter?.groupResults?.()) {
				return this.groupSessionsIntoSections(filteredSessions);
			}

			// Otherwise return flat sorted list
			return filteredSessions;
		}

		// Sessions	section
		else if (isAgentSessionSection(element)) {
			return element.sessions;
		}

		// Session element
		else {
			return [];
		}
	}

	private groupSessionsIntoSections(sessions: IAgentSession[]): AgentSessionListItem[] {
		const result: AgentSessionListItem[] = [];

		const sortedSessions = sessions.sort(this.sorter.compare.bind(this.sorter));
		const groupedSessions = groupAgentSessions(sortedSessions);

		for (const { sessions, section, label } of groupedSessions.values()) {
			if (sessions.length === 0) {
				continue;
			}

			result.push({ section, label, sessions });
		}

		return result;
	}
}

const DAY_THRESHOLD = 24 * 60 * 60 * 1000;
const WEEK_THRESHOLD = 7 * DAY_THRESHOLD;

export const AgentSessionSectionLabels = {
	[AgentSessionSection.InProgress]: localize('agentSessions.inProgressSection', "In Progress"),
	[AgentSessionSection.Today]: localize('agentSessions.todaySection', "Today"),
	[AgentSessionSection.Yesterday]: localize('agentSessions.yesterdaySection', "Yesterday"),
	[AgentSessionSection.Week]: localize('agentSessions.weekSection', "Last Week"),
	[AgentSessionSection.Older]: localize('agentSessions.olderSection', "Older"),
	[AgentSessionSection.Archived]: localize('agentSessions.archivedSection', "Archived"),
};

export function groupAgentSessions(sessions: IAgentSession[]): Map<AgentSessionSection, IAgentSessionSection> {
	const now = Date.now();
	const startOfToday = new Date(now).setHours(0, 0, 0, 0);
	const startOfYesterday = startOfToday - DAY_THRESHOLD;
	const weekThreshold = now - WEEK_THRESHOLD;

	const inProgressSessions: IAgentSession[] = [];
	const todaySessions: IAgentSession[] = [];
	const yesterdaySessions: IAgentSession[] = [];
	const weekSessions: IAgentSession[] = [];
	const olderSessions: IAgentSession[] = [];
	const archivedSessions: IAgentSession[] = [];

	for (const session of sessions) {
		if (isSessionInProgressStatus(session.status)) {
			inProgressSessions.push(session);
		} else if (session.isArchived()) {
			archivedSessions.push(session);
		} else {
			const sessionTime = session.timing.endTime || session.timing.startTime;
			if (sessionTime >= startOfToday) {
				todaySessions.push(session);
			} else if (sessionTime >= startOfYesterday) {
				yesterdaySessions.push(session);
			} else if (sessionTime >= weekThreshold) {
				weekSessions.push(session);
			} else {
				olderSessions.push(session);
			}
		}
	}

	return new Map<AgentSessionSection, IAgentSessionSection>([
		[AgentSessionSection.InProgress, { section: AgentSessionSection.InProgress, label: AgentSessionSectionLabels[AgentSessionSection.InProgress], sessions: inProgressSessions }],
		[AgentSessionSection.Today, { section: AgentSessionSection.Today, label: AgentSessionSectionLabels[AgentSessionSection.Today], sessions: todaySessions }],
		[AgentSessionSection.Yesterday, { section: AgentSessionSection.Yesterday, label: AgentSessionSectionLabels[AgentSessionSection.Yesterday], sessions: yesterdaySessions }],
		[AgentSessionSection.Week, { section: AgentSessionSection.Week, label: AgentSessionSectionLabels[AgentSessionSection.Week], sessions: weekSessions }],
		[AgentSessionSection.Older, { section: AgentSessionSection.Older, label: AgentSessionSectionLabels[AgentSessionSection.Older], sessions: olderSessions }],
		[AgentSessionSection.Archived, { section: AgentSessionSection.Archived, label: AgentSessionSectionLabels[AgentSessionSection.Archived], sessions: archivedSessions }],
	]);
}

export class AgentSessionsIdentityProvider implements IIdentityProvider<IAgentSessionsModel | AgentSessionListItem> {

	getId(element: IAgentSessionsModel | AgentSessionListItem): string {
		if (isAgentSessionSection(element)) {
			return `section-${element.section}`;
		}

		if (isAgentSession(element)) {
			return element.resource.toString();
		}

		return 'agent-sessions-id';
	}
}

export class AgentSessionsCompressionDelegate implements ITreeCompressionDelegate<AgentSessionListItem> {

	isIncompressible(element: AgentSessionListItem): boolean {
		return true;
	}
}

export interface IAgentSessionsSorterOptions {
	overrideCompare?(sessionA: IAgentSession, sessionB: IAgentSession): number | undefined;
}

export class AgentSessionsSorter implements ITreeSorter<IAgentSession> {

	constructor(private readonly options?: IAgentSessionsSorterOptions) { }

	compare(sessionA: IAgentSession, sessionB: IAgentSession): number {

		// Input Needed
		const aNeedsInput = sessionA.status === AgentSessionStatus.NeedsInput;
		const bNeedsInput = sessionB.status === AgentSessionStatus.NeedsInput;

		if (aNeedsInput && !bNeedsInput) {
			return -1; // a (needs input) comes before b (other)
		}
		if (!aNeedsInput && bNeedsInput) {
			return 1; // a (other) comes after b (needs input)
		}

		// In Progress
		const aInProgress = sessionA.status === AgentSessionStatus.InProgress;
		const bInProgress = sessionB.status === AgentSessionStatus.InProgress;

		if (aInProgress && !bInProgress) {
			return -1; // a (in-progress) comes before b (finished)
		}
		if (!aInProgress && bInProgress) {
			return 1; // a (finished) comes after b (in-progress)
		}

		// Archived
		const aArchived = sessionA.isArchived();
		const bArchived = sessionB.isArchived();

		if (!aArchived && bArchived) {
			return -1; // a (non-archived) comes before b (archived)
		}
		if (aArchived && !bArchived) {
			return 1; // a (archived) comes after b (non-archived)
		}

		// Before we compare by time, allow override
		const override = this.options?.overrideCompare?.(sessionA, sessionB);
		if (typeof override === 'number') {
			return override;
		}

		//Sort by end or start time (most recent first)
		return (sessionB.timing.endTime || sessionB.timing.startTime) - (sessionA.timing.endTime || sessionA.timing.startTime);
	}
}

export class AgentSessionsKeyboardNavigationLabelProvider implements ICompressibleKeyboardNavigationLabelProvider<AgentSessionListItem> {

	getKeyboardNavigationLabel(element: AgentSessionListItem): string {
		if (isAgentSessionSection(element)) {
			return element.label;
		}

		return element.label;
	}

	getCompressedNodeKeyboardNavigationLabel(elements: AgentSessionListItem[]): { toString(): string | undefined } | undefined {
		return undefined; // not enabled
	}
}

export class AgentSessionsDragAndDrop extends Disposable implements ITreeDragAndDrop<AgentSessionListItem> {

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super();
	}

	onDragStart(data: IDragAndDropData, originalEvent: DragEvent): void {
		const elements = (data.getData() as AgentSessionListItem[]).filter(e => isAgentSession(e));
		const uris = coalesce(elements.map(e => e.resource));
		this.instantiationService.invokeFunction(accessor => fillEditorsDragData(accessor, uris, originalEvent));
	}

	getDragURI(element: AgentSessionListItem): string | null {
		if (isAgentSessionSection(element)) {
			return null; // section headers are not draggable
		}

		return element.resource.toString();
	}

	getDragLabel?(elements: AgentSessionListItem[], originalEvent: DragEvent): string | undefined {
		const sessions = elements.filter(e => isAgentSession(e));
		if (sessions.length === 1) {
			return sessions[0].label;
		}

		return localize('agentSessions.dragLabel', "{0} agent sessions", sessions.length);
	}

	onDragOver(data: IDragAndDropData, targetElement: AgentSessionListItem | undefined, targetIndex: number | undefined, targetSector: ListViewTargetSector | undefined, originalEvent: DragEvent): boolean | ITreeDragOverReaction {
		return false;
	}

	drop(data: IDragAndDropData, targetElement: AgentSessionListItem | undefined, targetIndex: number | undefined, targetSector: ListViewTargetSector | undefined, originalEvent: DragEvent): void { }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/agentSessions/localAgentSessionsProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/agentSessions/localAgentSessionsProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { coalesce } from '../../../../../base/common/arrays.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Emitter } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ResourceSet } from '../../../../../base/common/map.js';
import { Schemas } from '../../../../../base/common/network.js';
import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { IChatModel } from '../../common/chatModel.js';
import { IChatDetail, IChatService, ResponseModelState } from '../../common/chatService.js';
import { ChatSessionStatus, IChatSessionItem, IChatSessionItemProvider, IChatSessionsService, localChatSessionType } from '../../common/chatSessionsService.js';
import { getChatSessionType } from '../../common/chatUri.js';

interface IChatSessionItemWithProvider extends IChatSessionItem {
	readonly provider: IChatSessionItemProvider;
}

export class LocalAgentsSessionsProvider extends Disposable implements IChatSessionItemProvider, IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.localAgentsSessionsProvider';

	readonly chatSessionType = localChatSessionType;

	private readonly _onDidChange = this._register(new Emitter<void>());
	readonly onDidChange = this._onDidChange.event;

	readonly _onDidChangeChatSessionItems = this._register(new Emitter<void>());
	readonly onDidChangeChatSessionItems = this._onDidChangeChatSessionItems.event;

	constructor(
		@IChatService private readonly chatService: IChatService,
		@IChatSessionsService private readonly chatSessionsService: IChatSessionsService,
	) {
		super();

		this._register(this.chatSessionsService.registerChatSessionItemProvider(this));

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.chatSessionsService.registerChatModelChangeListeners(
			this.chatService,
			Schemas.vscodeLocalChatSession,
			() => this._onDidChangeChatSessionItems.fire()
		));

		this._register(this.chatSessionsService.onDidChangeSessionItems(sessionType => {
			if (sessionType === this.chatSessionType) {
				this._onDidChange.fire();
			}
		}));

		this._register(this.chatService.onDidDisposeSession(e => {
			const session = e.sessionResource.filter(resource => getChatSessionType(resource) === this.chatSessionType);
			if (session.length > 0) {
				this._onDidChangeChatSessionItems.fire();
			}
		}));
	}

	async provideChatSessionItems(token: CancellationToken): Promise<IChatSessionItem[]> {
		const sessions: IChatSessionItemWithProvider[] = [];
		const sessionsByResource = new ResourceSet();

		for (const sessionDetail of await this.chatService.getLiveSessionItems()) {
			const editorSession = this.toChatSessionItem(sessionDetail);
			if (!editorSession) {
				continue;
			}

			sessionsByResource.add(sessionDetail.sessionResource);
			sessions.push(editorSession);
		}

		if (!token.isCancellationRequested) {
			const history = await this.getHistoryItems();
			sessions.push(...history.filter(historyItem => !sessionsByResource.has(historyItem.resource)));
		}

		return sessions;
	}

	private async getHistoryItems(): Promise<IChatSessionItemWithProvider[]> {
		try {
			const historyItems = await this.chatService.getHistorySessionItems();

			return coalesce(historyItems.map(history => this.toChatSessionItem(history)));
		} catch (error) {
			return [];
		}
	}

	private toChatSessionItem(chat: IChatDetail): IChatSessionItemWithProvider | undefined {
		const model = this.chatService.getSession(chat.sessionResource);

		let description: string | undefined;
		if (model) {
			if (!model.hasRequests) {
				return undefined; // ignore sessions without requests
			}

			description = this.chatSessionsService.getInProgressSessionDescription(model);
		}

		return {
			resource: chat.sessionResource,
			provider: this,
			label: chat.title,
			description,
			status: model ? this.modelToStatus(model) : this.chatResponseStateToStatus(chat.lastResponseState),
			iconPath: Codicon.chatSparkle,
			timing: chat.timing,
			changes: chat.stats ? {
				insertions: chat.stats.added,
				deletions: chat.stats.removed,
				files: chat.stats.fileCount,
			} : undefined
		};
	}

	private modelToStatus(model: IChatModel): ChatSessionStatus | undefined {
		if (model.requestInProgress.get()) {
			return ChatSessionStatus.InProgress;
		}

		const lastRequest = model.getRequests().at(-1);
		if (lastRequest?.response) {
			if (lastRequest.response.state === ResponseModelState.NeedsInput) {
				return ChatSessionStatus.NeedsInput;
			} else if (lastRequest.response.isCanceled || lastRequest.response.result?.errorDetails?.code === 'canceled') {
				return ChatSessionStatus.Completed;
			} else if (lastRequest.response.result?.errorDetails) {
				return ChatSessionStatus.Failed;
			} else if (lastRequest.response.isComplete) {
				return ChatSessionStatus.Completed;
			} else {
				return ChatSessionStatus.InProgress;
			}
		}

		return undefined;
	}

	private chatResponseStateToStatus(state: ResponseModelState): ChatSessionStatus {
		switch (state) {
			case ResponseModelState.Cancelled:
			case ResponseModelState.Complete:
				return ChatSessionStatus.Completed;
			case ResponseModelState.Failed:
				return ChatSessionStatus.Failed;
			case ResponseModelState.Pending:
				return ChatSessionStatus.InProgress;
			case ResponseModelState.NeedsInput:
				return ChatSessionStatus.NeedsInput;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/agentSessions/media/agentsessionsviewer.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/agentSessions/media/agentsessionsviewer.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.agent-sessions-viewer {

	flex: 1 1 auto;
	height: 100%;
	min-height: 0;

	.monaco-list-row .force-no-twistie {
		display: none !important;
	}

	.monaco-list-row.selected .agent-session-details-row {
		color: unset;

		.rendered-markdown {
			a {
				color: unset;
			}
		}

		.agent-session-diff-container {
			background-color: unset;
			outline: 1px solid var(--vscode-agentSessionSelectedBadge-border);

			.agent-session-diff-files,
			.agent-session-diff-added,
			.agent-session-diff-removed {
				color: unset;
			}
		}

		.agent-session-badge {
			background-color: unset;
			outline: 1px solid var(--vscode-agentSessionSelectedBadge-border);
		}
	}

	.monaco-list:not(:focus) .monaco-list-row.selected .agent-session-details-row .agent-session-diff-container,
	.monaco-list:not(:focus) .monaco-list-row.selected .agent-session-details-row .agent-session-badge {
		outline: 1px solid var(--vscode-agentSessionSelectedUnfocusedBadge-border);
	}

	.monaco-list-row .agent-session-title-toolbar {
		/* for the absolute positioning of the toolbar below */
		position: relative;

		.monaco-toolbar {
			/* this is required because the overal height (including the padding needed for hover feedback) would push down the title otherwise */
			position: absolute;
			right: 0;
			top: 0;
			display: none;
		}
	}

	.monaco-list-row:hover .agent-session-title-toolbar,
	.monaco-list-row.focused .agent-session-title-toolbar {
		width: 22px;

		.monaco-toolbar {
			display: block;
		}
	}

	.agent-session-item {
		display: flex;
		flex-direction: row;
		/* to offset from possible scrollbar */
		padding: 8px 12px 8px 8px;

		&.archived {
			color: var(--vscode-descriptionForeground);
		}

		.agent-session-main-col,
		.agent-session-title-row,
		.agent-session-details-row {
			flex: 1;
			min-width: 0;
		}

		.agent-session-icon-col {
			display: flex;
			align-items: flex-start;

			.agent-session-icon {
				flex-shrink: 0;
				font-size: 16px;

				&.codicon.codicon-session-in-progress {
					color: var(--vscode-textLink-foreground);
				}

				&.codicon.codicon-error {
					color: var(--vscode-errorForeground);
				}

				&.codicon.codicon-report {
					color: var(--vscode-textLink-foreground);
				}

				&.codicon.codicon-circle-filled {
					color: var(--vscode-textLink-foreground);
				}

				&.codicon.codicon-circle-small-filled {
					color: var(--vscode-agentSessionReadIndicator-foreground);
				}
			}
		}

		.agent-session-main-col {
			padding-left: 8px;
		}

		.agent-session-title-row,
		.agent-session-details-row {
			display: flex;
			align-items: center;
			line-height: 16px;
		}

		.agent-session-title-row {
			padding-bottom: 4px;
		}

		.agent-session-details-row {
			gap: 4px;
			font-size: 12px;
			color: var(--vscode-descriptionForeground);

			.rendered-markdown {
				p {
					display: flex;
					align-items: center;
					margin: 0;

					> span.codicon {
						margin-right: 2px;
					}
				}

				a {
					color: var(--vscode-descriptionForeground);
				}
			}

			.agent-session-diff-container {
				background-color: var(--vscode-toolbar-hoverBackground);
				font-weight: 500;
				display: flex;
				gap: 4px;
				padding: 0 4px;
				font-variant-numeric: tabular-nums;
				border-radius: 5px;

				&:not(.has-diff) {
					display: none;
				}

				.agent-session-diff-files {
					color: var(--vscode-descriptionForeground);
				}

				.agent-session-diff-added {
					color: var(--vscode-chat-linesAddedForeground);
				}

				.agent-session-diff-removed {
					color: var(--vscode-chat-linesRemovedForeground);
				}
			}

			.agent-session-badge {
				background-color: var(--vscode-toolbar-hoverBackground);
				font-weight: 500;
				padding: 0 4px;
				font-variant-numeric: tabular-nums;
				border-radius: 5px;

				&:not(.has-badge) {
					display: none;
				}

				.codicon {
					font-size: 12px;
				}
			}
		}

		.agent-session-title,
		.agent-session-description {
			/* push other items to the end */
			flex: 1;
			text-overflow: ellipsis;
			overflow: hidden;
		}

		.agent-session-status {
			padding-left: 8px;
			font-variant-numeric: tabular-nums;

			/* In case the changes toolbar to the left is greedy, we give up space */
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	.agent-session-section {
		display: flex;
		align-items: center;
		font-size: 11px;
		color: var(--vscode-descriptionForeground);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		/* align with session item padding */
		padding: 0 12px 0 8px;

		.agent-session-section-label {
			flex: 1;
		}

		.agent-session-section-toolbar {
			/* for the absolute positioning of the toolbar below */
			position: relative;

			.monaco-toolbar {
				/* this is required because the overal height (including the padding needed for hover feedback) would push down the label otherwise */
				position: absolute;
				right: 0;
				top: 0;
				display: none;
			}
		}
	}

	.monaco-list-row:hover .agent-session-section .agent-session-section-toolbar,
	.monaco-list-row.focused .agent-session-section .agent-session-section-toolbar {
		width: 22px;

		.monaco-toolbar {
			display: block;
		}
	}

	.monaco-list:focus .monaco-list-row.focused.selected .agent-session-section-label,
	.monaco-list:focus .monaco-list-row.selected .agent-session-section-label {
		color: var(--vscode-list-activeSelectionForeground);
	}

	.monaco-list:not(:focus) .monaco-list-row.selected .agent-session-section-label {
		color: var(--vscode-list-inactiveSelectionForeground);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/attachments/implicitContextAttachment.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/attachments/implicitContextAttachment.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../../../base/browser/keyboardEvent.js';
import { StandardMouseEvent } from '../../../../../base/browser/mouseEvent.js';
import { Button } from '../../../../../base/browser/ui/button/button.js';
import { getDefaultHoverDelegate } from '../../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { KeyCode } from '../../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import { basename, dirname } from '../../../../../base/common/resources.js';
import { URI } from '../../../../../base/common/uri.js';
import { Location } from '../../../../../editor/common/languages.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { localize } from '../../../../../nls.js';
import { getFlatContextMenuActions } from '../../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IMenuService, MenuId } from '../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { FileKind, IFileService } from '../../../../../platform/files/common/files.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { IResourceLabel, ResourceLabels } from '../../../../browser/labels.js';
import { ResourceContextKey } from '../../../../common/contextkeys.js';
import { IChatRequestImplicitVariableEntry, IChatRequestStringVariableEntry, isStringImplicitContextValue } from '../../common/chatVariableEntries.js';
import { IChatWidget } from '../chat.js';
import { ChatAttachmentModel } from '../chatAttachmentModel.js';
import { IChatContextService } from '../chatContextService.js';

export class ImplicitContextAttachmentWidget extends Disposable {
	public readonly domNode: HTMLElement;

	private readonly renderDisposables = this._register(new DisposableStore());

	constructor(
		private readonly widgetRef: () => IChatWidget | undefined,
		private readonly attachment: IChatRequestImplicitVariableEntry,
		private readonly resourceLabels: ResourceLabels,
		private readonly attachmentModel: ChatAttachmentModel,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@ILabelService private readonly labelService: ILabelService,
		@IMenuService private readonly menuService: IMenuService,
		@IFileService private readonly fileService: IFileService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IModelService private readonly modelService: IModelService,
		@IHoverService private readonly hoverService: IHoverService,
		@IConfigurationService private readonly configService: IConfigurationService,
		@IChatContextService private readonly chatContextService: IChatContextService,
	) {
		super();

		this.domNode = dom.$('.chat-attached-context-attachment.show-file-icons.implicit');
		this.render();
	}

	private render() {
		dom.clearNode(this.domNode);
		this.renderDisposables.clear();

		this.domNode.classList.toggle('disabled', !this.attachment.enabled);
		const file: URI | undefined = this.attachment.uri;
		const attachmentTypeName = file?.scheme === Schemas.vscodeNotebookCell ? localize('cell.lowercase', "cell") : localize('file.lowercase', "file");

		const isSuggestedEnabled = this.configService.getValue('chat.implicitContext.suggestedContext');

		// Create toggle button BEFORE the label so it appears on the left
		if (isSuggestedEnabled) {
			if (!this.attachment.isSelection) {
				const buttonMsg = this.attachment.enabled ? localize('disable', "Disable current {0} context", attachmentTypeName) : '';
				const toggleButton = this.renderDisposables.add(new Button(this.domNode, { supportIcons: true, title: buttonMsg }));
				toggleButton.icon = this.attachment.enabled ? Codicon.x : Codicon.plus;
				this.renderDisposables.add(toggleButton.onDidClick(async (e) => {
					e.stopPropagation();
					e.preventDefault();
					if (!this.attachment.enabled) {
						await this.convertToRegularAttachment();
					}
					this.attachment.enabled = false;
				}));
			}

			if (!this.attachment.enabled && this.attachment.isSelection) {
				this.domNode.classList.remove('disabled');
			}

			this.renderDisposables.add(dom.addDisposableListener(this.domNode, dom.EventType.CLICK, async (e) => {
				if (!this.attachment.enabled && !this.attachment.isSelection) {
					await this.convertToRegularAttachment();
				}
			}));

			this.renderDisposables.add(dom.addDisposableListener(this.domNode, dom.EventType.KEY_DOWN, async (e) => {
				const event = new StandardKeyboardEvent(e);
				if (event.equals(KeyCode.Enter) || event.equals(KeyCode.Space)) {
					if (!this.attachment.enabled && !this.attachment.isSelection) {
						e.preventDefault();
						e.stopPropagation();
						await this.convertToRegularAttachment();
					}
				}
			}));
		} else {
			const buttonMsg = this.attachment.enabled ? localize('disable', "Disable current {0} context", attachmentTypeName) : localize('enable', "Enable current {0} context", attachmentTypeName);
			const toggleButton = this.renderDisposables.add(new Button(this.domNode, { supportIcons: true, title: buttonMsg }));
			toggleButton.icon = this.attachment.enabled ? Codicon.eye : Codicon.eyeClosed;
			this.renderDisposables.add(toggleButton.onDidClick((e) => {
				e.stopPropagation(); // prevent it from triggering the click handler on the parent immediately after rerendering
				this.attachment.enabled = !this.attachment.enabled;
			}));
		}

		const label = this.resourceLabels.create(this.domNode, { supportIcons: true });

		let title: string;
		if (isStringImplicitContextValue(this.attachment.value)) {
			title = this.renderString(label);
		} else {
			title = this.renderResource(this.attachment.value, label);
		}

		this._register(this.hoverService.setupManagedHover(getDefaultHoverDelegate('element'), this.domNode, title));

		// Context menu
		const scopedContextKeyService = this.renderDisposables.add(this.contextKeyService.createScoped(this.domNode));

		const resourceContextKey = this.renderDisposables.add(new ResourceContextKey(scopedContextKeyService, this.fileService, this.languageService, this.modelService));
		resourceContextKey.set(file);

		this.renderDisposables.add(dom.addDisposableListener(this.domNode, dom.EventType.CONTEXT_MENU, async domEvent => {
			const event = new StandardMouseEvent(dom.getWindow(domEvent), domEvent);
			dom.EventHelper.stop(domEvent, true);

			this.contextMenuService.showContextMenu({
				contextKeyService: scopedContextKeyService,
				getAnchor: () => event,
				getActions: () => {
					const menu = this.menuService.getMenuActions(MenuId.ChatInputResourceAttachmentContext, scopedContextKeyService, { arg: file });
					return getFlatContextMenuActions(menu);
				},
			});
		}));
	}

	private renderString(resourceLabel: IResourceLabel): string {
		const label = this.attachment.name;
		const icon = this.attachment.icon;
		const title = localize('openFile', "Current file context");
		resourceLabel.setLabel(label, undefined, { iconPath: icon, title });
		return title;
	}

	private renderResource(attachmentValue: Location | URI | undefined, label: IResourceLabel): string {
		const file = URI.isUri(attachmentValue) ? attachmentValue : attachmentValue!.uri;
		const range = URI.isUri(attachmentValue) || !this.attachment.isSelection ? undefined : attachmentValue!.range;

		const attachmentTypeName = file.scheme === Schemas.vscodeNotebookCell ? localize('cell.lowercase', "cell") : localize('file.lowercase', "file");

		const fileBasename = basename(file);
		const fileDirname = dirname(file);
		const friendlyName = `${fileBasename} ${fileDirname}`;
		const ariaLabel = range ? localize('chat.fileAttachmentWithRange', "Attached {0}, {1}, line {2} to line {3}", attachmentTypeName, friendlyName, range.startLineNumber, range.endLineNumber) : localize('chat.fileAttachment', "Attached {0}, {1}", attachmentTypeName, friendlyName);

		const uriLabel = this.labelService.getUriLabel(file, { relative: true });
		const currentFile = localize('openEditor', "Current {0} context", attachmentTypeName);
		const inactive = localize('enableHint', "Enable current {0} context", attachmentTypeName);
		const currentFileHint = this.attachment.enabled || this.attachment.isSelection ? currentFile : inactive;
		const title = `${currentFileHint}\n${uriLabel}`;

		label.setFile(file, {
			fileKind: FileKind.FILE,
			hidePath: true,
			range,
			title
		});
		this.domNode.ariaLabel = ariaLabel;
		this.domNode.tabIndex = 0;

		return title;
	}

	private async convertToRegularAttachment(): Promise<void> {
		if (!this.attachment.value) {
			return;
		}
		if (isStringImplicitContextValue(this.attachment.value)) {
			if (this.attachment.value.value === undefined) {
				await this.chatContextService.resolveChatContext(this.attachment.value);
			}
			const context: IChatRequestStringVariableEntry = {
				kind: 'string',
				value: this.attachment.value.value,
				id: this.attachment.id,
				name: this.attachment.name,
				icon: this.attachment.value.icon,
				modelDescription: this.attachment.value.modelDescription,
				uri: this.attachment.value.uri
			};
			this.attachmentModel.addContext(context);
		} else {
			const file = URI.isUri(this.attachment.value) ? this.attachment.value : this.attachment.value.uri;
			this.attachmentModel.addFile(file);
		}
		this.widgetRef()?.focusInput();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatAgentCommandContentPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatAgentCommandContentPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { Disposable } from '../../../../../base/common/lifecycle.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { IChatAgentCommand } from '../../common/chatAgents.js';
import { chatSubcommandLeader } from '../../common/chatParserTypes.js';
import { IChatRendererContent } from '../../common/chatViewModel.js';
import { ChatTreeItem } from '../chat.js';
import { IChatContentPart } from './chatContentParts.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { localize } from '../../../../../nls.js';
import { Button } from '../../../../../base/browser/ui/button/button.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { HoverStyle } from '../../../../../base/browser/ui/hover/hover.js';


export class ChatAgentCommandContentPart extends Disposable implements IChatContentPart {

	readonly domNode: HTMLElement = document.createElement('span');

	constructor(
		cmd: IChatAgentCommand,
		onClick: () => void,
		@IHoverService private readonly _hoverService: IHoverService,
	) {
		super();
		this.domNode.classList.add('chat-agent-command');
		this.domNode.setAttribute('aria-label', cmd.name);
		this.domNode.setAttribute('role', 'button');

		const groupId = generateUuid();

		const commandSpan = document.createElement('span');
		this.domNode.appendChild(commandSpan);
		commandSpan.innerText = chatSubcommandLeader + cmd.name;
		this._store.add(this._hoverService.setupDelayedHover(commandSpan, {
			content: cmd.description,
			style: HoverStyle.Pointer,
		}, { groupId }));

		const rerun = localize('rerun', "Rerun without {0}{1}", chatSubcommandLeader, cmd.name);
		const btn = new Button(this.domNode, { ariaLabel: rerun });
		btn.icon = Codicon.close;
		this._store.add(btn.onDidClick(() => onClick()));
		this._store.add(btn);
		this._store.add(this._hoverService.setupDelayedHover(btn.element, {
			content: rerun,
			style: HoverStyle.Pointer,
		}, { groupId }));
	}

	hasSameContent(other: IChatRendererContent, followingContent: IChatRendererContent[], element: ChatTreeItem): boolean {
		return false;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatAnonymousRateLimitedPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatAnonymousRateLimitedPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, append } from '../../../../../base/browser/dom.js';
import { Button } from '../../../../../base/browser/ui/button/button.js';
import { WorkbenchActionExecutedClassification, WorkbenchActionExecutedEvent } from '../../../../../base/common/actions.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { localize } from '../../../../../nls.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { defaultButtonStyles } from '../../../../../platform/theme/browser/defaultStyles.js';
import { IChatEntitlementService } from '../../../../services/chat/common/chatEntitlementService.js';
import { IChatErrorDetailsPart, IChatRendererContent } from '../../common/chatViewModel.js';
import { IChatContentPart } from './chatContentParts.js';

export class ChatAnonymousRateLimitedPart extends Disposable implements IChatContentPart {

	readonly domNode: HTMLElement;

	constructor(
		private readonly content: IChatErrorDetailsPart,
		@ICommandService commandService: ICommandService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IChatEntitlementService chatEntitlementService: IChatEntitlementService
	) {
		super();

		this.domNode = $('.chat-rate-limited-widget');

		const icon = append(this.domNode, $('span'));
		icon.classList.add(...ThemeIcon.asClassNameArray(Codicon.info));

		const messageContainer = append(this.domNode, $('.chat-rate-limited-message'));

		const message = append(messageContainer, $('div'));
		message.textContent = localize('anonymousRateLimited', "Continue the conversation by signing in. Your free account gets 50 premium requests a month plus access to more models and AI features.");

		const signInButton = this._register(new Button(messageContainer, { ...defaultButtonStyles, supportIcons: true }));
		signInButton.label = localize('enableMoreAIFeatures', "Enable more AI features");
		signInButton.element.classList.add('chat-rate-limited-button');

		this._register(signInButton.onDidClick(async () => {
			const commandId = 'workbench.action.chat.triggerSetup';
			telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: commandId, from: 'chat-response' });

			await commandService.executeCommand(commandId);
		}));
	}

	hasSameContent(other: IChatRendererContent): boolean {
		return other.kind === this.content.kind && !!other.errorDetails.isRateLimited;
	}

	addDisposable(disposable: IDisposable): void {
		this._register(disposable);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/chatAttachmentsContentPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/chatAttachmentsContentPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { Emitter } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { basename } from '../../../../../base/common/path.js';
import { URI } from '../../../../../base/common/uri.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ResourceLabels } from '../../../../browser/labels.js';
import { IChatRequestVariableEntry, isElementVariableEntry, isImageVariableEntry, isNotebookOutputVariableEntry, isPasteVariableEntry, isPromptFileVariableEntry, isPromptTextVariableEntry, isSCMHistoryItemChangeRangeVariableEntry, isSCMHistoryItemChangeVariableEntry, isSCMHistoryItemVariableEntry, isTerminalVariableEntry, isWorkspaceVariableEntry, OmittedState } from '../../common/chatVariableEntries.js';
import { ChatResponseReferencePartStatusKind, IChatContentReference } from '../../common/chatService.js';
import { DefaultChatAttachmentWidget, ElementChatAttachmentWidget, FileAttachmentWidget, ImageAttachmentWidget, NotebookCellOutputChatAttachmentWidget, PasteAttachmentWidget, PromptFileAttachmentWidget, PromptTextAttachmentWidget, SCMHistoryItemAttachmentWidget, SCMHistoryItemChangeAttachmentWidget, SCMHistoryItemChangeRangeAttachmentWidget, TerminalCommandAttachmentWidget, ToolSetOrToolItemAttachmentWidget } from '../chatAttachmentWidgets.js';

export interface IChatAttachmentsContentPartOptions {
	readonly variables: IChatRequestVariableEntry[];
	readonly contentReferences?: ReadonlyArray<IChatContentReference>;
	readonly domNode?: HTMLElement;
	readonly limit?: number;
}

export class ChatAttachmentsContentPart extends Disposable {
	private readonly attachedContextDisposables = this._register(new DisposableStore());

	private readonly _onDidChangeVisibility = this._register(new Emitter<boolean>());
	private readonly _contextResourceLabels: ResourceLabels;
	private _showingAll = false;

	private readonly variables: IChatRequestVariableEntry[];
	private readonly contentReferences: ReadonlyArray<IChatContentReference>;
	private readonly limit?: number;
	public readonly domNode: HTMLElement | undefined;

	public contextMenuHandler?: (attachment: IChatRequestVariableEntry, event: MouseEvent) => void;

	constructor(
		options: IChatAttachmentsContentPartOptions,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();
		this.variables = options.variables;
		this.contentReferences = options.contentReferences ?? [];
		this.limit = options.limit;
		this.domNode = options.domNode ?? dom.$('.chat-attached-context');

		this._contextResourceLabels = this._register(this.instantiationService.createInstance(ResourceLabels, { onDidChangeVisibility: this._onDidChangeVisibility.event }));

		this.initAttachedContext(this.domNode);
		if (!this.domNode.childElementCount) {
			this.domNode = undefined;
		}
	}

	private initAttachedContext(container: HTMLElement) {
		dom.clearNode(container);
		this.attachedContextDisposables.clear();

		const visibleAttachments = this.getVisibleAttachments();
		const hasMoreAttachments = this.limit && this.variables.length > this.limit && !this._showingAll;

		for (const attachment of visibleAttachments) {
			this.renderAttachment(attachment, container);
		}

		if (hasMoreAttachments) {
			this.renderShowMoreButton(container);
		}
	}

	private getVisibleAttachments(): IChatRequestVariableEntry[] {
		if (!this.limit || this._showingAll) {
			return this.variables;
		}
		return this.variables.slice(0, this.limit);
	}

	private renderShowMoreButton(container: HTMLElement) {
		const remainingCount = this.variables.length - (this.limit ?? 0);

		// Create a button that looks like the attachment pills
		const showMoreButton = dom.$('div.chat-attached-context-attachment.chat-attachments-show-more-button');
		showMoreButton.setAttribute('role', 'button');
		showMoreButton.setAttribute('tabindex', '0');
		showMoreButton.style.cursor = 'pointer';

		// Add pill icon (ellipsis)
		const pillIcon = dom.$('div.chat-attached-context-pill', {}, dom.$('span.codicon.codicon-ellipsis'));

		// Add text label
		const textLabel = dom.$('span.chat-attached-context-custom-text');
		textLabel.textContent = `${remainingCount} more`;

		showMoreButton.appendChild(pillIcon);
		showMoreButton.appendChild(textLabel);

		// Add click and keyboard event handlers
		const clickHandler = () => {
			this._showingAll = true;
			this.initAttachedContext(container);
		};

		this.attachedContextDisposables.add(dom.addDisposableListener(showMoreButton, 'click', clickHandler));
		this.attachedContextDisposables.add(dom.addDisposableListener(showMoreButton, 'keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				clickHandler();
			}
		}));

		container.appendChild(showMoreButton);
		this.attachedContextDisposables.add({ dispose: () => showMoreButton.remove() });
	}

	private renderAttachment(attachment: IChatRequestVariableEntry, container: HTMLElement) {
		const resource = URI.isUri(attachment.value) ? attachment.value : attachment.value && typeof attachment.value === 'object' && 'uri' in attachment.value && URI.isUri(attachment.value.uri) ? attachment.value.uri : undefined;
		const range = attachment.value && typeof attachment.value === 'object' && 'range' in attachment.value && Range.isIRange(attachment.value.range) ? attachment.value.range : undefined;
		const correspondingContentReference = this.contentReferences.find((ref) => (typeof ref.reference === 'object' && 'variableName' in ref.reference && ref.reference.variableName === attachment.name) || (URI.isUri(ref.reference) && basename(ref.reference.path) === attachment.name));
		const isAttachmentOmitted = correspondingContentReference?.options?.status?.kind === ChatResponseReferencePartStatusKind.Omitted;
		const isAttachmentPartialOrOmitted = isAttachmentOmitted || correspondingContentReference?.options?.status?.kind === ChatResponseReferencePartStatusKind.Partial;

		let widget;
		if (attachment.kind === 'tool' || attachment.kind === 'toolset') {
			widget = this.instantiationService.createInstance(ToolSetOrToolItemAttachmentWidget, attachment, undefined, { shouldFocusClearButton: false, supportsDeletion: false }, container, this._contextResourceLabels);
		} else if (isElementVariableEntry(attachment)) {
			widget = this.instantiationService.createInstance(ElementChatAttachmentWidget, attachment, undefined, { shouldFocusClearButton: false, supportsDeletion: false }, container, this._contextResourceLabels);
		} else if (isImageVariableEntry(attachment)) {
			attachment.omittedState = isAttachmentPartialOrOmitted ? OmittedState.Full : attachment.omittedState;
			widget = this.instantiationService.createInstance(ImageAttachmentWidget, resource, attachment, undefined, { shouldFocusClearButton: false, supportsDeletion: false }, container, this._contextResourceLabels);
		} else if (isPromptFileVariableEntry(attachment)) {
			if (attachment.automaticallyAdded) {
				return; // Skip automatically added prompt files
			}
			widget = this.instantiationService.createInstance(PromptFileAttachmentWidget, attachment, undefined, { shouldFocusClearButton: false, supportsDeletion: false }, container, this._contextResourceLabels);
		} else if (isPromptTextVariableEntry(attachment)) {
			if (attachment.automaticallyAdded) {
				return; // Skip automatically added prompt text
			}
			widget = this.instantiationService.createInstance(PromptTextAttachmentWidget, attachment, undefined, { shouldFocusClearButton: false, supportsDeletion: false }, container, this._contextResourceLabels);
		} else if (resource && (attachment.kind === 'file' || attachment.kind === 'directory')) {
			widget = this.instantiationService.createInstance(FileAttachmentWidget, resource, range, attachment, correspondingContentReference, undefined, { shouldFocusClearButton: false, supportsDeletion: false }, container, this._contextResourceLabels);
		} else if (isTerminalVariableEntry(attachment)) {
			widget = this.instantiationService.createInstance(TerminalCommandAttachmentWidget, attachment, undefined, { shouldFocusClearButton: false, supportsDeletion: false }, container, this._contextResourceLabels);
		} else if (isPasteVariableEntry(attachment)) {
			widget = this.instantiationService.createInstance(PasteAttachmentWidget, attachment, undefined, { shouldFocusClearButton: false, supportsDeletion: false }, container, this._contextResourceLabels);
		} else if (resource && isNotebookOutputVariableEntry(attachment)) {
			widget = this.instantiationService.createInstance(NotebookCellOutputChatAttachmentWidget, resource, attachment, undefined, { shouldFocusClearButton: false, supportsDeletion: false }, container, this._contextResourceLabels);
		} else if (isSCMHistoryItemVariableEntry(attachment)) {
			widget = this.instantiationService.createInstance(SCMHistoryItemAttachmentWidget, attachment, undefined, { shouldFocusClearButton: false, supportsDeletion: false }, container, this._contextResourceLabels);
		} else if (isSCMHistoryItemChangeVariableEntry(attachment)) {
			widget = this.instantiationService.createInstance(SCMHistoryItemChangeAttachmentWidget, attachment, undefined, { shouldFocusClearButton: false, supportsDeletion: false }, container, this._contextResourceLabels);
		} else if (isSCMHistoryItemChangeRangeVariableEntry(attachment)) {
			widget = this.instantiationService.createInstance(SCMHistoryItemChangeRangeAttachmentWidget, attachment, undefined, { shouldFocusClearButton: false, supportsDeletion: false }, container, this._contextResourceLabels);
		} else if (isWorkspaceVariableEntry(attachment)) {
			// skip workspace attachments
			return;
		} else {
			widget = this.instantiationService.createInstance(DefaultChatAttachmentWidget, resource, range, attachment, correspondingContentReference, undefined, { shouldFocusClearButton: false, supportsDeletion: false }, container, this._contextResourceLabels);
		}

		let ariaLabel: string | null = null;

		if (isAttachmentPartialOrOmitted) {
			widget.element.classList.add('warning');
		}
		const description = correspondingContentReference?.options?.status?.description;
		if (isAttachmentPartialOrOmitted) {
			ariaLabel = `${ariaLabel}${description ? ` ${description}` : ''}`;
			for (const selector of ['.monaco-icon-suffix-container', '.monaco-icon-name-container']) {
				// eslint-disable-next-line no-restricted-syntax
				const element = widget.label.element.querySelector(selector);
				if (element) {
					element.classList.add('warning');
				}
			}
		}

		this._register(dom.addDisposableListener(widget.element, 'contextmenu', e => this.contextMenuHandler?.(attachment, e)));

		if (this.attachedContextDisposables.isDisposed) {
			widget.dispose();
			return;
		}

		if (ariaLabel) {
			widget.element.ariaLabel = ariaLabel;
		}

		this.attachedContextDisposables.add(widget);
	}
}
```

--------------------------------------------------------------------------------

````

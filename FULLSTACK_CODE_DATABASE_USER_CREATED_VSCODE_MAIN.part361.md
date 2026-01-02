---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 361
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 361 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/common/chatModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { asArray } from '../../../../base/common/arrays.js';
import { softAssertNever } from '../../../../base/common/assert.js';
import { VSBuffer, decodeHex, encodeHex } from '../../../../base/common/buffer.js';
import { BugIndicatingError } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IMarkdownString, MarkdownString, isMarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable, IDisposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { revive } from '../../../../base/common/marshalling.js';
import { Schemas } from '../../../../base/common/network.js';
import { equals } from '../../../../base/common/objects.js';
import { IObservable, autorun, autorunSelfDisposable, derived, observableFromEvent, observableSignalFromEvent, observableValue, observableValueOpts } from '../../../../base/common/observable.js';
import { basename, isEqual } from '../../../../base/common/resources.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { WithDefinedProps } from '../../../../base/common/types.js';
import { URI, UriComponents, UriDto, isUriComponents } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { IRange } from '../../../../editor/common/core/range.js';
import { OffsetRange } from '../../../../editor/common/core/ranges/offsetRange.js';
import { ISelection } from '../../../../editor/common/core/selection.js';
import { TextEdit } from '../../../../editor/common/languages.js';
import { EditSuggestionId } from '../../../../editor/common/textModelEditSource.js';
import { localize } from '../../../../nls.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { CellUri, ICellEditOperation } from '../../notebook/common/notebookCommon.js';
import { migrateLegacyTerminalToolSpecificData } from './chat.js';
import { IChatAgentCommand, IChatAgentData, IChatAgentResult, IChatAgentService, UserSelectedTools, reviveSerializedAgent } from './chatAgents.js';
import { IChatEditingService, IChatEditingSession, ModifiedFileEntryState, editEntriesToMultiDiffData } from './chatEditingService.js';
import { ChatRequestTextPart, IParsedChatRequest, reviveParsedChatRequest } from './chatParserTypes.js';
import { ChatAgentVoteDirection, ChatAgentVoteDownReason, ChatResponseClearToPreviousToolInvocationReason, ElicitationState, IChatAgentMarkdownContentWithVulnerability, IChatClearToPreviousToolInvocation, IChatCodeCitation, IChatCommandButton, IChatConfirmation, IChatContentInlineReference, IChatContentReference, IChatEditingSessionAction, IChatElicitationRequest, IChatElicitationRequestSerialized, IChatExtensionsContent, IChatFollowup, IChatLocationData, IChatMarkdownContent, IChatMcpServersStarting, IChatModelReference, IChatMultiDiffData, IChatMultiDiffDataSerialized, IChatNotebookEdit, IChatPrepareToolInvocationPart, IChatProgress, IChatProgressMessage, IChatPullRequestContent, IChatResponseCodeblockUriPart, IChatResponseProgressFileTreeData, IChatService, IChatSessionContext, IChatSessionTiming, IChatTask, IChatTaskSerialized, IChatTextEdit, IChatThinkingPart, IChatToolInvocation, IChatToolInvocationSerialized, IChatTreeData, IChatUndoStop, IChatUsedContext, IChatWarningMessage, ResponseModelState, isIUsedContext } from './chatService.js';
import { LocalChatSessionUri } from './chatUri.js';
import { ChatRequestToolReferenceEntry, IChatRequestVariableEntry } from './chatVariableEntries.js';
import { ChatAgentLocation, ChatModeKind } from './constants.js';
import { ILanguageModelChatMetadata, ILanguageModelChatMetadataAndIdentifier } from './languageModels.js';


export const CHAT_ATTACHABLE_IMAGE_MIME_TYPES: Record<string, string> = {
	png: 'image/png',
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	gif: 'image/gif',
	webp: 'image/webp',
};

export function getAttachableImageExtension(mimeType: string): string | undefined {
	return Object.entries(CHAT_ATTACHABLE_IMAGE_MIME_TYPES).find(([_, value]) => value === mimeType)?.[0];
}

export interface IChatRequestVariableData {
	variables: IChatRequestVariableEntry[];
}

export interface IChatRequestModel {
	readonly id: string;
	readonly timestamp: number;
	readonly modeInfo?: IChatRequestModeInfo;
	readonly session: IChatModel;
	readonly message: IParsedChatRequest;
	readonly attempt: number;
	readonly variableData: IChatRequestVariableData;
	readonly confirmation?: string;
	readonly locationData?: IChatLocationData;
	readonly attachedContext?: IChatRequestVariableEntry[];
	readonly isCompleteAddedRequest: boolean;
	readonly response?: IChatResponseModel;
	readonly editedFileEvents?: IChatAgentEditedFileEvent[];
	shouldBeRemovedOnSend: IChatRequestDisablement | undefined;
	shouldBeBlocked: boolean;
	readonly modelId?: string;
	readonly userSelectedTools?: UserSelectedTools;
}

export interface ICodeBlockInfo {
	readonly suggestionId: EditSuggestionId;
}

export interface IChatTextEditGroupState {
	sha1: string;
	applied: number;
}

export interface IChatTextEditGroup {
	uri: URI;
	edits: TextEdit[][];
	state?: IChatTextEditGroupState;
	kind: 'textEditGroup';
	done: boolean | undefined;
	isExternalEdit?: boolean;
}

export function isCellTextEditOperation(value: unknown): value is ICellTextEditOperation {
	const candidate = value as ICellTextEditOperation;
	return !!candidate && !!candidate.edit && !!candidate.uri && URI.isUri(candidate.uri);
}

export function isCellTextEditOperationArray(value: ICellTextEditOperation[] | ICellEditOperation[]): value is ICellTextEditOperation[] {
	return value.some(isCellTextEditOperation);
}

export interface ICellTextEditOperation {
	edit: TextEdit;
	uri: URI;
}

export interface IChatNotebookEditGroup {
	uri: URI;
	edits: (ICellTextEditOperation[] | ICellEditOperation[])[];
	state?: IChatTextEditGroupState;
	kind: 'notebookEditGroup';
	done: boolean | undefined;
	isExternalEdit?: boolean;
}

/**
 * Progress kinds that are included in the history of a response.
 * Excludes "internal" types that are included in history.
 */
export type IChatProgressHistoryResponseContent =
	| IChatMarkdownContent
	| IChatAgentMarkdownContentWithVulnerability
	| IChatResponseCodeblockUriPart
	| IChatTreeData
	| IChatMultiDiffDataSerialized
	| IChatContentInlineReference
	| IChatProgressMessage
	| IChatCommandButton
	| IChatWarningMessage
	| IChatTask
	| IChatTaskSerialized
	| IChatTextEditGroup
	| IChatNotebookEditGroup
	| IChatConfirmation
	| IChatExtensionsContent
	| IChatThinkingPart
	| IChatPullRequestContent;

/**
 * "Normal" progress kinds that are rendered as parts of the stream of content.
 */
export type IChatProgressResponseContent =
	| IChatProgressHistoryResponseContent
	| IChatToolInvocation
	| IChatToolInvocationSerialized
	| IChatMultiDiffData
	| IChatUndoStop
	| IChatPrepareToolInvocationPart
	| IChatElicitationRequest
	| IChatElicitationRequestSerialized
	| IChatClearToPreviousToolInvocation
	| IChatMcpServersStarting;

const nonHistoryKinds = new Set(['toolInvocation', 'toolInvocationSerialized', 'undoStop', 'prepareToolInvocation']);
function isChatProgressHistoryResponseContent(content: IChatProgressResponseContent): content is IChatProgressHistoryResponseContent {
	return !nonHistoryKinds.has(content.kind);
}

export function toChatHistoryContent(content: ReadonlyArray<IChatProgressResponseContent>): IChatProgressHistoryResponseContent[] {
	return content.filter(isChatProgressHistoryResponseContent);
}

export type IChatProgressRenderableResponseContent = Exclude<IChatProgressResponseContent, IChatContentInlineReference | IChatAgentMarkdownContentWithVulnerability | IChatResponseCodeblockUriPart>;

export interface IResponse {
	readonly value: ReadonlyArray<IChatProgressResponseContent>;
	getMarkdown(): string;
	toString(): string;
}

export interface IChatResponseModel {
	readonly onDidChange: Event<ChatResponseModelChangeReason>;
	readonly id: string;
	readonly requestId: string;
	readonly request: IChatRequestModel | undefined;
	readonly username: string;
	readonly avatarIcon?: ThemeIcon | URI;
	readonly session: IChatModel;
	readonly agent?: IChatAgentData;
	readonly usedContext: IChatUsedContext | undefined;
	readonly contentReferences: ReadonlyArray<IChatContentReference>;
	readonly codeCitations: ReadonlyArray<IChatCodeCitation>;
	readonly progressMessages: ReadonlyArray<IChatProgressMessage>;
	readonly slashCommand?: IChatAgentCommand;
	readonly agentOrSlashCommandDetected: boolean;
	/** View of the response shown to the user, may have parts omitted from undo stops. */
	readonly response: IResponse;
	/** Entire response from the model. */
	readonly entireResponse: IResponse;
	/** Milliseconds timestamp when this chat response was created. */
	readonly timestamp: number;
	/** Milliseconds timestamp when this chat response was completed or cancelled. */
	readonly completedAt?: number;
	/** The state of this response */
	readonly state: ResponseModelState;
	/**
	 * Adjusted millisecond timestamp that excludes the duration during which
	 * the model was pending user confirmation. `Date.now() - confirmationAdjustedTimestamp`
	 * will return the amount of time the response was busy generating content.
	 * This is updated only when `isPendingConfirmation` changes state.
	 */
	readonly confirmationAdjustedTimestamp: IObservable<number>;
	readonly isComplete: boolean;
	readonly isCanceled: boolean;
	readonly isPendingConfirmation: IObservable<{ startedWaitingAt: number; detail?: string } | undefined>;
	readonly isInProgress: IObservable<boolean>;
	readonly shouldBeRemovedOnSend: IChatRequestDisablement | undefined;
	shouldBeBlocked: boolean;
	readonly isCompleteAddedRequest: boolean;
	/** A stale response is one that has been persisted and rehydrated, so e.g. Commands that have their arguments stored in the EH are gone. */
	readonly isStale: boolean;
	readonly vote: ChatAgentVoteDirection | undefined;
	readonly voteDownReason: ChatAgentVoteDownReason | undefined;
	readonly followups?: IChatFollowup[] | undefined;
	readonly result?: IChatAgentResult;
	readonly codeBlockInfos: ICodeBlockInfo[] | undefined;

	initializeCodeBlockInfos(codeBlockInfo: ICodeBlockInfo[]): void;
	addUndoStop(undoStop: IChatUndoStop): void;
	setVote(vote: ChatAgentVoteDirection): void;
	setVoteDownReason(reason: ChatAgentVoteDownReason | undefined): void;
	setEditApplied(edit: IChatTextEditGroup, editCount: number): boolean;
	updateContent(progress: IChatProgressResponseContent | IChatTextEdit | IChatNotebookEdit | IChatTask, quiet?: boolean): void;
	/**
	 * Adopts any partially-undo {@link response} as the {@link entireResponse}.
	 * Only valid when {@link isComplete}. This is needed because otherwise an
	 * undone and then diverged state would start showing old data because the
	 * undo stops would no longer exist in the model.
	 */
	finalizeUndoState(): void;
}

export type ChatResponseModelChangeReason =
	| { reason: 'other' }
	| { reason: 'completedRequest' }
	| { reason: 'undoStop'; id: string };

export const defaultChatResponseModelChangeReason: ChatResponseModelChangeReason = { reason: 'other' };

export interface IChatRequestModeInfo {
	kind: ChatModeKind | undefined; // is undefined in case of modeId == 'apply'
	isBuiltin: boolean;
	modeInstructions: IChatRequestModeInstructions | undefined;
	modeId: 'ask' | 'agent' | 'edit' | 'custom' | 'applyCodeBlock' | undefined;
	applyCodeBlockSuggestionId: EditSuggestionId | undefined;
}

export interface IChatRequestModeInstructions {
	readonly name: string;
	readonly content: string;
	readonly toolReferences: readonly ChatRequestToolReferenceEntry[];
	readonly metadata?: Record<string, boolean | string | number>;
}

export interface IChatRequestModelParameters {
	session: ChatModel;
	message: IParsedChatRequest;
	variableData: IChatRequestVariableData;
	timestamp: number;
	attempt?: number;
	modeInfo?: IChatRequestModeInfo;
	confirmation?: string;
	locationData?: IChatLocationData;
	attachedContext?: IChatRequestVariableEntry[];
	isCompleteAddedRequest?: boolean;
	modelId?: string;
	restoredId?: string;
	editedFileEvents?: IChatAgentEditedFileEvent[];
	userSelectedTools?: UserSelectedTools;
}

export class ChatRequestModel implements IChatRequestModel {
	public readonly id: string;
	public response: ChatResponseModel | undefined;
	public shouldBeRemovedOnSend: IChatRequestDisablement | undefined;
	public readonly timestamp: number;
	public readonly message: IParsedChatRequest;
	public readonly isCompleteAddedRequest: boolean;
	public readonly modelId?: string;
	public readonly modeInfo?: IChatRequestModeInfo;
	public readonly userSelectedTools?: UserSelectedTools;

	public shouldBeBlocked: boolean = false;

	private _session: ChatModel;
	private readonly _attempt: number;
	private _variableData: IChatRequestVariableData;
	private readonly _confirmation?: string;
	private readonly _locationData?: IChatLocationData;
	private readonly _attachedContext?: IChatRequestVariableEntry[];
	private readonly _editedFileEvents?: IChatAgentEditedFileEvent[];

	public get session(): ChatModel {
		return this._session;
	}

	public get attempt(): number {
		return this._attempt;
	}

	public get variableData(): IChatRequestVariableData {
		return this._variableData;
	}

	public set variableData(v: IChatRequestVariableData) {
		this._variableData = v;
	}

	public get confirmation(): string | undefined {
		return this._confirmation;
	}

	public get locationData(): IChatLocationData | undefined {
		return this._locationData;
	}

	public get attachedContext(): IChatRequestVariableEntry[] | undefined {
		return this._attachedContext;
	}

	public get editedFileEvents(): IChatAgentEditedFileEvent[] | undefined {
		return this._editedFileEvents;
	}

	constructor(params: IChatRequestModelParameters) {
		this._session = params.session;
		this.message = params.message;
		this._variableData = params.variableData;
		this.timestamp = params.timestamp;
		this._attempt = params.attempt ?? 0;
		this.modeInfo = params.modeInfo;
		this._confirmation = params.confirmation;
		this._locationData = params.locationData;
		this._attachedContext = params.attachedContext;
		this.isCompleteAddedRequest = params.isCompleteAddedRequest ?? false;
		this.modelId = params.modelId;
		this.id = params.restoredId ?? 'request_' + generateUuid();
		this._editedFileEvents = params.editedFileEvents;
		this.userSelectedTools = params.userSelectedTools;
	}

	adoptTo(session: ChatModel) {
		this._session = session;
	}
}

class AbstractResponse implements IResponse {
	protected _responseParts: IChatProgressResponseContent[];

	/**
	 * A stringified representation of response data which might be presented to a screenreader or used when copying a response.
	 */
	protected _responseRepr = '';

	/**
	 * Just the markdown content of the response, used for determining the rendering rate of markdown
	 */
	protected _markdownContent = '';

	get value(): IChatProgressResponseContent[] {
		return this._responseParts;
	}

	constructor(value: IChatProgressResponseContent[]) {
		this._responseParts = value;
		this._updateRepr();
	}

	toString(): string {
		return this._responseRepr;
	}

	/**
	 * _Just_ the content of markdown parts in the response
	 */
	getMarkdown(): string {
		return this._markdownContent;
	}

	protected _updateRepr() {
		this._responseRepr = this.partsToRepr(this._responseParts);

		this._markdownContent = this._responseParts.map(part => {
			if (part.kind === 'inlineReference') {
				return this.inlineRefToRepr(part);
			} else if (part.kind === 'markdownContent' || part.kind === 'markdownVuln') {
				return part.content.value;
			} else {
				return '';
			}
		})
			.filter(s => s.length > 0)
			.join('');
	}

	private partsToRepr(parts: readonly IChatProgressResponseContent[]): string {
		const blocks: string[] = [];
		let currentBlockSegments: string[] = [];
		let hasEditGroupsAfterLastClear = false;

		for (const part of parts) {
			let segment: { text: string; isBlock?: boolean } | undefined;
			switch (part.kind) {
				case 'clearToPreviousToolInvocation':
					currentBlockSegments = [];
					blocks.length = 0;
					hasEditGroupsAfterLastClear = false; // Reset edit groups flag when clearing
					continue;
				case 'treeData':
				case 'progressMessage':
				case 'codeblockUri':
				case 'extensions':
				case 'pullRequest':
				case 'undoStop':
				case 'prepareToolInvocation':
				case 'elicitation2':
				case 'elicitationSerialized':
				case 'thinking':
				case 'multiDiffData':
				case 'mcpServersStarting':
					// Ignore
					continue;
				case 'toolInvocation':
				case 'toolInvocationSerialized':
					// Include tool invocations in the copy text
					segment = this.getToolInvocationText(part);
					break;
				case 'inlineReference':
					segment = { text: this.inlineRefToRepr(part) };
					break;
				case 'command':
					segment = { text: part.command.title, isBlock: true };
					break;
				case 'textEditGroup':
				case 'notebookEditGroup':
					// Mark that we have edit groups after the last clear
					hasEditGroupsAfterLastClear = true;
					// Skip individual edit groups to avoid duplication
					continue;
				case 'confirmation':
					if (part.message instanceof MarkdownString) {
						segment = { text: `${part.title}\n${part.message.value}`, isBlock: true };
						break;
					}
					segment = { text: `${part.title}\n${part.message}`, isBlock: true };
					break;
				case 'markdownContent':
				case 'markdownVuln':
				case 'progressTask':
				case 'progressTaskSerialized':
				case 'warning':
					segment = { text: part.content.value };
					break;
				default:
					// Ignore any unknown/obsolete parts, but assert that all are handled:
					softAssertNever(part);
					continue;
			}

			if (segment.isBlock) {
				if (currentBlockSegments.length) {
					blocks.push(currentBlockSegments.join(''));
					currentBlockSegments = [];
				}
				blocks.push(segment.text);
			} else {
				currentBlockSegments.push(segment.text);
			}
		}

		if (currentBlockSegments.length) {
			blocks.push(currentBlockSegments.join(''));
		}

		// Add consolidated edit summary at the end if there were any edit groups after the last clear
		if (hasEditGroupsAfterLastClear) {
			blocks.push(localize('editsSummary', "Made changes."));
		}

		return blocks.join('\n\n');
	}

	private inlineRefToRepr(part: IChatContentInlineReference) {
		if ('uri' in part.inlineReference) {
			return this.uriToRepr(part.inlineReference.uri);
		}

		return 'name' in part.inlineReference
			? '`' + part.inlineReference.name + '`'
			: this.uriToRepr(part.inlineReference);
	}

	private getToolInvocationText(toolInvocation: IChatToolInvocation | IChatToolInvocationSerialized): { text: string; isBlock?: boolean } {
		// Extract the message and input details
		let message = '';
		let input = '';

		if (toolInvocation.pastTenseMessage) {
			message = typeof toolInvocation.pastTenseMessage === 'string'
				? toolInvocation.pastTenseMessage
				: toolInvocation.pastTenseMessage.value;
		} else {
			message = typeof toolInvocation.invocationMessage === 'string'
				? toolInvocation.invocationMessage
				: toolInvocation.invocationMessage.value;
		}

		// Handle different types of tool invocations
		if (toolInvocation.toolSpecificData) {
			if (toolInvocation.toolSpecificData.kind === 'terminal') {
				message = 'Ran terminal command';
				const terminalData = migrateLegacyTerminalToolSpecificData(toolInvocation.toolSpecificData);
				input = terminalData.commandLine.userEdited ?? terminalData.commandLine.toolEdited ?? terminalData.commandLine.original;
			}
		}

		// Format the tool invocation text
		let text = message;
		if (input) {
			text += `: ${input}`;
		}

		// For completed tool invocations, also include the result details if available
		if (toolInvocation.kind === 'toolInvocationSerialized' || (toolInvocation.kind === 'toolInvocation' && IChatToolInvocation.isComplete(toolInvocation))) {
			const resultDetails = IChatToolInvocation.resultDetails(toolInvocation);
			if (resultDetails && 'input' in resultDetails) {
				const resultPrefix = toolInvocation.kind === 'toolInvocationSerialized' || IChatToolInvocation.isComplete(toolInvocation) ? 'Completed' : 'Errored';
				text += `\n${resultPrefix} with input: ${resultDetails.input}`;
			}
		}

		return { text, isBlock: true };
	}

	private uriToRepr(uri: URI): string {
		if (uri.scheme === Schemas.http || uri.scheme === Schemas.https) {
			return uri.toString(false);
		}

		return basename(uri);
	}
}

/** A view of a subset of a response */
class ResponseView extends AbstractResponse {
	constructor(
		_response: IResponse,
		public readonly undoStop: string,
	) {
		let idx = _response.value.findIndex(v => v.kind === 'undoStop' && v.id === undoStop);
		// Undo stops are inserted before `codeblockUri`'s, which are preceeded by a
		// markdownContent containing the opening code fence. Adjust the index
		// backwards to avoid a buggy response if it looked like this happened.
		if (_response.value[idx + 1]?.kind === 'codeblockUri' && _response.value[idx - 1]?.kind === 'markdownContent') {
			idx--;
		}

		super(idx === -1 ? _response.value.slice() : _response.value.slice(0, idx));
	}
}

export class Response extends AbstractResponse implements IDisposable {
	private _onDidChangeValue = new Emitter<void>();
	public get onDidChangeValue() {
		return this._onDidChangeValue.event;
	}

	private _citations: IChatCodeCitation[] = [];


	constructor(value: IMarkdownString | ReadonlyArray<IMarkdownString | IChatResponseProgressFileTreeData | IChatContentInlineReference | IChatAgentMarkdownContentWithVulnerability | IChatResponseCodeblockUriPart | IChatThinkingPart>) {
		super(asArray(value).map((v) => (
			'kind' in v ? v :
				isMarkdownString(v) ? { content: v, kind: 'markdownContent' } satisfies IChatMarkdownContent :
					{ kind: 'treeData', treeData: v }
		)));
	}

	dispose(): void {
		this._onDidChangeValue.dispose();
	}


	clear(): void {
		this._responseParts = [];
		this._updateRepr(true);
	}

	clearToPreviousToolInvocation(message?: string): void {
		// look through the response parts and find the last tool invocation, then slice the response parts to that point
		let lastToolInvocationIndex = -1;
		for (let i = this._responseParts.length - 1; i >= 0; i--) {
			const part = this._responseParts[i];
			if (part.kind === 'toolInvocation' || part.kind === 'toolInvocationSerialized') {
				lastToolInvocationIndex = i;
				break;
			}
		}
		if (lastToolInvocationIndex !== -1) {
			this._responseParts = this._responseParts.slice(0, lastToolInvocationIndex + 1);
		} else {
			this._responseParts = [];
		}
		if (message) {
			this._responseParts.push({ kind: 'warning', content: new MarkdownString(message) });
		}
		this._updateRepr(true);
	}

	updateContent(progress: IChatProgressResponseContent | IChatTextEdit | IChatNotebookEdit | IChatTask, quiet?: boolean): void {
		if (progress.kind === 'clearToPreviousToolInvocation') {
			if (progress.reason === ChatResponseClearToPreviousToolInvocationReason.CopyrightContentRetry) {
				this.clearToPreviousToolInvocation(localize('copyrightContentRetry', "Response cleared due to possible match to public code, retrying with modified prompt."));
			} else if (progress.reason === ChatResponseClearToPreviousToolInvocationReason.FilteredContentRetry) {
				this.clearToPreviousToolInvocation(localize('filteredContentRetry', "Response cleared due to content safety filters, retrying with modified prompt."));
			} else {
				this.clearToPreviousToolInvocation();
			}
			return;
		} else if (progress.kind === 'markdownContent') {

			// last response which is NOT a text edit group because we do want to support heterogenous streaming but not have
			// the MD be chopped up by text edit groups (and likely other non-renderable parts)
			const lastResponsePart = this._responseParts
				.filter(p => p.kind !== 'textEditGroup')
				.at(-1);

			if (!lastResponsePart || lastResponsePart.kind !== 'markdownContent' || !canMergeMarkdownStrings(lastResponsePart.content, progress.content)) {
				// The last part can't be merged with- not markdown, or markdown with different permissions
				this._responseParts.push(progress);
			} else {
				// Don't modify the current object, since it's being diffed by the renderer
				const idx = this._responseParts.indexOf(lastResponsePart);
				this._responseParts[idx] = { ...lastResponsePart, content: appendMarkdownString(lastResponsePart.content, progress.content) };
			}
			this._updateRepr(quiet);
		} else if (progress.kind === 'thinking') {

			// tries to split thinking chunks if it is an array. only while certain models give us array chunks.
			const lastResponsePart = this._responseParts
				.filter(p => p.kind !== 'textEditGroup')
				.at(-1);

			const lastText = lastResponsePart && lastResponsePart.kind === 'thinking'
				? (Array.isArray(lastResponsePart.value) ? lastResponsePart.value.join('') : (lastResponsePart.value || ''))
				: '';
			const currText = Array.isArray(progress.value) ? progress.value.join('') : (progress.value || '');
			const isEmpty = (s: string) => s.length === 0;

			// Do not merge if either the current or last thinking chunk is empty; empty chunks separate thinking
			if (!lastResponsePart
				|| lastResponsePart.kind !== 'thinking'
				|| isEmpty(currText)
				|| isEmpty(lastText)
				|| !canMergeMarkdownStrings(new MarkdownString(lastText), new MarkdownString(currText))) {
				this._responseParts.push(progress);
			} else {
				const idx = this._responseParts.indexOf(lastResponsePart);
				this._responseParts[idx] = {
					...lastResponsePart,
					value: appendMarkdownString(new MarkdownString(lastText), new MarkdownString(currText)).value
				};
			}
			this._updateRepr(quiet);
		} else if (progress.kind === 'textEdit' || progress.kind === 'notebookEdit') {
			// If the progress.uri is a cell Uri, its possible its part of the inline chat.
			// Old approach of notebook inline chat would not start and end with notebook Uri, so we need to check for old approach.
			const useOldApproachForInlineNotebook = progress.uri.scheme === Schemas.vscodeNotebookCell && !this._responseParts.find(part => part.kind === 'notebookEditGroup');
			// merge edits for the same file no matter when they come in
			const notebookUri = useOldApproachForInlineNotebook ? undefined : CellUri.parse(progress.uri)?.notebook;
			const uri = notebookUri ?? progress.uri;
			let found = false;
			const groupKind = progress.kind === 'textEdit' && !notebookUri ? 'textEditGroup' : 'notebookEditGroup';
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const edits: any = groupKind === 'textEditGroup' ? progress.edits : progress.edits.map(edit => TextEdit.isTextEdit(edit) ? { uri: progress.uri, edit } : edit);
			const isExternalEdit = progress.isExternalEdit;
			for (let i = 0; !found && i < this._responseParts.length; i++) {
				const candidate = this._responseParts[i];
				if (candidate.kind === groupKind && !candidate.done && isEqual(candidate.uri, uri)) {
					candidate.edits.push(edits);
					candidate.done = progress.done;
					found = true;
				}
			}
			if (!found) {
				this._responseParts.push({
					kind: groupKind,
					uri,
					edits: groupKind === 'textEditGroup' ? [edits] : edits,
					done: progress.done,
					isExternalEdit,
				});
			}
			this._updateRepr(quiet);
		} else if (progress.kind === 'progressTask') {
			// Add a new resolving part
			const responsePosition = this._responseParts.push(progress) - 1;
			this._updateRepr(quiet);

			const disp = progress.onDidAddProgress(() => {
				this._updateRepr(false);
			});

			progress.task?.().then((content) => {
				// Stop listening for progress updates once the task settles
				disp.dispose();

				// Replace the resolving part's content with the resolved response
				if (typeof content === 'string') {
					(this._responseParts[responsePosition] as IChatTask).content = new MarkdownString(content);
				}
				this._updateRepr(false);
			});

		} else if (progress.kind === 'toolInvocation') {
			autorunSelfDisposable(reader => {
				progress.state.read(reader); // update repr when state changes
				this._updateRepr(false);

				if (IChatToolInvocation.isComplete(progress, reader)) {
					reader.dispose();
				}
			});
			this._responseParts.push(progress);
			this._updateRepr(quiet);
		} else {
			this._responseParts.push(progress);
			this._updateRepr(quiet);
		}
	}

	public addCitation(citation: IChatCodeCitation) {
		this._citations.push(citation);
		this._updateRepr();
	}

	protected override _updateRepr(quiet?: boolean) {
		super._updateRepr();
		if (!this._onDidChangeValue) {
			return; // called from parent constructor
		}

		this._responseRepr += this._citations.length ? '\n\n' + getCodeCitationsMessage(this._citations) : '';

		if (!quiet) {
			this._onDidChangeValue.fire();
		}
	}
}

export interface IChatResponseModelParameters {
	responseContent: IMarkdownString | ReadonlyArray<IMarkdownString | IChatResponseProgressFileTreeData | IChatContentInlineReference | IChatAgentMarkdownContentWithVulnerability | IChatResponseCodeblockUriPart | IChatThinkingPart>;
	session: ChatModel;
	agent?: IChatAgentData;
	slashCommand?: IChatAgentCommand;
	requestId: string;
	timestamp?: number;
	vote?: ChatAgentVoteDirection;
	voteDownReason?: ChatAgentVoteDownReason;
	result?: IChatAgentResult;
	followups?: ReadonlyArray<IChatFollowup>;
	isCompleteAddedRequest?: boolean;
	shouldBeRemovedOnSend?: IChatRequestDisablement;
	shouldBeBlocked?: boolean;
	restoredId?: string;
	modelState?: ResponseModelStateT;
	timeSpentWaiting?: number;
	/**
	 * undefined means it will be set later.
	*/
	codeBlockInfos: ICodeBlockInfo[] | undefined;
}

type ResponseModelStateT =
	| { value: ResponseModelState.Pending }
	| { value: ResponseModelState.NeedsInput }
	| { value: ResponseModelState.Complete | ResponseModelState.Cancelled | ResponseModelState.Failed; completedAt: number };

export class ChatResponseModel extends Disposable implements IChatResponseModel {
	private readonly _onDidChange = this._register(new Emitter<ChatResponseModelChangeReason>());
	readonly onDidChange = this._onDidChange.event;

	public readonly id: string;
	public readonly requestId: string;
	private _session: ChatModel;
	private _agent: IChatAgentData | undefined;
	private _slashCommand: IChatAgentCommand | undefined;
	private _modelState = observableValue<ResponseModelStateT>(this, { value: ResponseModelState.Pending });
	private _vote?: ChatAgentVoteDirection;
	private _voteDownReason?: ChatAgentVoteDownReason;
	private _result?: IChatAgentResult;
	private _shouldBeRemovedOnSend: IChatRequestDisablement | undefined;
	public readonly isCompleteAddedRequest: boolean;
	private _shouldBeBlocked: boolean = false;
	private readonly _timestamp: number;
	private _timeSpentWaitingAccumulator: number;

	public confirmationAdjustedTimestamp: IObservable<number>;

	public get shouldBeBlocked() {
		return this._shouldBeBlocked;
	}

	public get request(): IChatRequestModel | undefined {
		return this.session.getRequests().find(r => r.id === this.requestId);
	}

	public get session() {
		return this._session;
	}

	public get shouldBeRemovedOnSend() {
		return this._shouldBeRemovedOnSend;
	}

	public get isComplete(): boolean {
		return this._modelState.get().value !== ResponseModelState.Pending && this._modelState.get().value !== ResponseModelState.NeedsInput;
	}

	public get timestamp(): number {
		return this._timestamp;
	}

	public set shouldBeRemovedOnSend(disablement: IChatRequestDisablement | undefined) {
		this._shouldBeRemovedOnSend = disablement;
		this._onDidChange.fire(defaultChatResponseModelChangeReason);
	}

	public get isCanceled(): boolean {
		return this._modelState.get().value === ResponseModelState.Cancelled;
	}

	public get completedAt(): number | undefined {
		const state = this._modelState.get();
		if (state.value === ResponseModelState.Complete || state.value === ResponseModelState.Cancelled || state.value === ResponseModelState.Failed) {
			return state.completedAt;
		}
		return undefined;
	}

	public get state(): ResponseModelState {
		const state = this._modelState.get().value;
		if (state === ResponseModelState.Complete && !!this._result?.errorDetails && this.result?.errorDetails?.code !== 'canceled') {
			// This check covers sessions created in previous vscode versions which saved a failed response as 'Complete'
			return ResponseModelState.Failed;
		}

		return state;
	}

	public get vote(): ChatAgentVoteDirection | undefined {
		return this._vote;
	}

	public get voteDownReason(): ChatAgentVoteDownReason | undefined {
		return this._voteDownReason;
	}

	public get followups(): IChatFollowup[] | undefined {
		return this._followups;
	}

	private _response: Response;
	private _finalizedResponse?: IResponse;
	public get entireResponse(): IResponse {
		return this._finalizedResponse || this._response;
	}

	public get result(): IChatAgentResult | undefined {
		return this._result;
	}

	public get username(): string {
		return this.session.responderUsername;
	}

	public get avatarIcon(): ThemeIcon | URI | undefined {
		return this.session.responderAvatarIcon;
	}

	private _followups?: IChatFollowup[];

	public get agent(): IChatAgentData | undefined {
		return this._agent;
	}

	public get slashCommand(): IChatAgentCommand | undefined {
		return this._slashCommand;
	}

	private _agentOrSlashCommandDetected: boolean | undefined;
	public get agentOrSlashCommandDetected(): boolean {
		return this._agentOrSlashCommandDetected ?? false;
	}

	private _usedContext: IChatUsedContext | undefined;
	public get usedContext(): IChatUsedContext | undefined {
		return this._usedContext;
	}

	private readonly _contentReferences: IChatContentReference[] = [];
	public get contentReferences(): ReadonlyArray<IChatContentReference> {
		return Array.from(this._contentReferences);
	}

	private readonly _codeCitations: IChatCodeCitation[] = [];
	public get codeCitations(): ReadonlyArray<IChatCodeCitation> {
		return this._codeCitations;
	}

	private readonly _progressMessages: IChatProgressMessage[] = [];
	public get progressMessages(): ReadonlyArray<IChatProgressMessage> {
		return this._progressMessages;
	}

	private _isStale: boolean = false;
	public get isStale(): boolean {
		return this._isStale;
	}


	readonly isPendingConfirmation: IObservable<{ startedWaitingAt: number; detail?: string } | undefined>;

	readonly isInProgress: IObservable<boolean>;

	private _responseView?: ResponseView;
	public get response(): IResponse {
		const undoStop = this._shouldBeRemovedOnSend?.afterUndoStop;
		if (!undoStop) {
			return this._finalizedResponse || this._response;
		}

		if (this._responseView?.undoStop !== undoStop) {
			this._responseView = new ResponseView(this._response, undoStop);
		}

		return this._responseView;
	}

	private _codeBlockInfos: ICodeBlockInfo[] | undefined;
	public get codeBlockInfos(): ICodeBlockInfo[] | undefined {
		return this._codeBlockInfos;
	}

	constructor(params: IChatResponseModelParameters) {
		super();

		this._session = params.session;
		this._agent = params.agent;
		this._slashCommand = params.slashCommand;
		this.requestId = params.requestId;
		this._timestamp = params.timestamp || Date.now();
		if (params.modelState) {
			this._modelState.set(params.modelState, undefined);
		}
		this._timeSpentWaitingAccumulator = params.timeSpentWaiting || 0;
		this._vote = params.vote;
		this._voteDownReason = params.voteDownReason;
		this._result = params.result;
		this._followups = params.followups ? [...params.followups] : undefined;
		this.isCompleteAddedRequest = params.isCompleteAddedRequest ?? false;
		this._shouldBeRemovedOnSend = params.shouldBeRemovedOnSend;
		this._shouldBeBlocked = params.shouldBeBlocked ?? false;

		// If we are creating a response with some existing content, consider it stale
		this._isStale = Array.isArray(params.responseContent) && (params.responseContent.length !== 0 || isMarkdownString(params.responseContent) && params.responseContent.value.length !== 0);

		this._response = this._register(new Response(params.responseContent));
		this._codeBlockInfos = params.codeBlockInfos ? [...params.codeBlockInfos] : undefined;

		const signal = observableSignalFromEvent(this, this.onDidChange);

		const _pendingInfo = signal.map((_value, r): string | undefined => {
			signal.read(r);

			for (const part of this._response.value) {
				if (part.kind === 'toolInvocation' && part.state.read(r).type === IChatToolInvocation.StateKind.WaitingForConfirmation) {
					const title = part.confirmationMessages?.title;
					return title ? (isMarkdownString(title) ? title.value : title) : undefined;
				}
				if (part.kind === 'confirmation' && !part.isUsed) {
					return part.title;
				}
				if (part.kind === 'elicitation2' && part.state.read(r) === ElicitationState.Pending) {
					const title = part.title;
					return isMarkdownString(title) ? title.value : title;
				}
			}

			return undefined;
		});

		const _startedWaitingAt = _pendingInfo.map(p => !!p).map(p => p ? Date.now() : undefined);
		this.isPendingConfirmation = _startedWaitingAt.map((waiting, r) => waiting ? { startedWaitingAt: waiting, detail: _pendingInfo.read(r) } : undefined);

		this.isInProgress = signal.map((_value, r) => {

			signal.read(r);

			return !_pendingInfo.read(r)
				&& !this.shouldBeRemovedOnSend
				&& (this._modelState.read(r).value === ResponseModelState.Pending || this._modelState.read(r).value === ResponseModelState.NeedsInput);
		});

		this._register(this._response.onDidChangeValue(() => this._onDidChange.fire(defaultChatResponseModelChangeReason)));
		this.id = params.restoredId ?? 'response_' + generateUuid();

		this._register(this._session.onDidChange((e) => {
			if (e.kind === 'setCheckpoint') {
				const isDisabled = e.disabledResponseIds.has(this.id);
				const didChange = this._shouldBeBlocked === isDisabled;
				this._shouldBeBlocked = isDisabled;
				if (didChange) {
					this._onDidChange.fire(defaultChatResponseModelChangeReason);
				}
			}
		}));

		let lastStartedWaitingAt: number | undefined = undefined;
		this.confirmationAdjustedTimestamp = derived(reader => {
			const pending = this.isPendingConfirmation.read(reader);
			if (pending) {
				this._modelState.set({ value: ResponseModelState.NeedsInput }, undefined);
				if (!lastStartedWaitingAt) {
					lastStartedWaitingAt = pending.startedWaitingAt;
				}
			} else if (lastStartedWaitingAt) {
				// Restore state to Pending if it was set to NeedsInput by this observable
				if (this._modelState.read(reader).value === ResponseModelState.NeedsInput) {
					this._modelState.set({ value: ResponseModelState.Pending }, undefined);
				}
				this._timeSpentWaitingAccumulator += Date.now() - lastStartedWaitingAt;
				lastStartedWaitingAt = undefined;
			}

			return this._timestamp + this._timeSpentWaitingAccumulator;
		}).recomputeInitiallyAndOnChange(this._store);
	}

	initializeCodeBlockInfos(codeBlockInfo: ICodeBlockInfo[]): void {
		if (this._codeBlockInfos) {
			throw new BugIndicatingError('Code block infos have already been initialized');
		}
		this._codeBlockInfos = [...codeBlockInfo];
	}

	/**
	 * Apply a progress update to the actual response content.
	 */
	updateContent(responsePart: IChatProgressResponseContent | IChatTextEdit | IChatNotebookEdit, quiet?: boolean) {
		this._response.updateContent(responsePart, quiet);
	}

	/**
	 * Adds an undo stop at the current position in the stream.
	 */
	addUndoStop(undoStop: IChatUndoStop) {
		this._onDidChange.fire({ reason: 'undoStop', id: undoStop.id });
		this._response.updateContent(undoStop, true);
	}

	/**
	 * Apply one of the progress updates that are not part of the actual response content.
	 */
	applyReference(progress: IChatUsedContext | IChatContentReference) {
		if (progress.kind === 'usedContext') {
			this._usedContext = progress;
		} else if (progress.kind === 'reference') {
			this._contentReferences.push(progress);
			this._onDidChange.fire(defaultChatResponseModelChangeReason);
		}
	}

	applyCodeCitation(progress: IChatCodeCitation) {
		this._codeCitations.push(progress);
		this._response.addCitation(progress);
		this._onDidChange.fire(defaultChatResponseModelChangeReason);
	}

	setAgent(agent: IChatAgentData, slashCommand?: IChatAgentCommand) {
		this._agent = agent;
		this._slashCommand = slashCommand;
		this._agentOrSlashCommandDetected = !agent.isDefault || !!slashCommand;
		this._onDidChange.fire(defaultChatResponseModelChangeReason);
	}

	setResult(result: IChatAgentResult): void {
		this._result = result;
		this._onDidChange.fire(defaultChatResponseModelChangeReason);
	}

	complete(): void {
		// No-op if it's already complete
		if (this.isComplete) {
			return;
		}
		if (this._result?.errorDetails?.responseIsRedacted) {
			this._response.clear();
		}

		// Canceled sessions can be considered 'Complete'
		const state = !!this._result?.errorDetails && this._result.errorDetails.code !== 'canceled' ? ResponseModelState.Failed : ResponseModelState.Complete;
		this._modelState.set({ value: state, completedAt: Date.now() }, undefined);
		this._onDidChange.fire({ reason: 'completedRequest' });
	}

	cancel(): void {
		this._modelState.set({ value: ResponseModelState.Cancelled, completedAt: Date.now() }, undefined);
		this._onDidChange.fire({ reason: 'completedRequest' });
	}

	setFollowups(followups: IChatFollowup[] | undefined): void {
		this._followups = followups;
		this._onDidChange.fire(defaultChatResponseModelChangeReason); // Fire so that command followups get rendered on the row
	}

	setVote(vote: ChatAgentVoteDirection): void {
		this._vote = vote;
		this._onDidChange.fire(defaultChatResponseModelChangeReason);
	}

	setVoteDownReason(reason: ChatAgentVoteDownReason | undefined): void {
		this._voteDownReason = reason;
		this._onDidChange.fire(defaultChatResponseModelChangeReason);
	}

	setEditApplied(edit: IChatTextEditGroup, editCount: number): boolean {
		if (!this.response.value.includes(edit)) {
			return false;
		}
		if (!edit.state) {
			return false;
		}
		edit.state.applied = editCount; // must not be edit.edits.length
		this._onDidChange.fire(defaultChatResponseModelChangeReason);
		return true;
	}

	adoptTo(session: ChatModel) {
		this._session = session;
		this._onDidChange.fire(defaultChatResponseModelChangeReason);
	}


	finalizeUndoState(): void {
		this._finalizedResponse = this.response;
		this._responseView = undefined;
		this._shouldBeRemovedOnSend = undefined;
	}

	toJSON(): ISerializableChatResponseData {
		const modelState = this._modelState.get();
		const pendingConfirmation = this.isPendingConfirmation.get();

		return {
			responseId: this.id,
			result: this.result,
			responseMarkdownInfo: this.codeBlockInfos?.map<ISerializableMarkdownInfo>(info => ({ suggestionId: info.suggestionId })),
			followups: this.followups,
			modelState: modelState.value === ResponseModelState.Pending || modelState.value === ResponseModelState.NeedsInput ? { value: ResponseModelState.Cancelled, completedAt: Date.now() } : modelState,
			vote: this.vote,
			voteDownReason: this.voteDownReason,
			slashCommand: this.slashCommand,
			usedContext: this.usedContext,
			contentReferences: this.contentReferences,
			codeCitations: this.codeCitations,
			timestamp: this._timestamp,
			timeSpentWaiting: (pendingConfirmation ? Date.now() - pendingConfirmation.startedWaitingAt : 0) + this._timeSpentWaitingAccumulator,
		} satisfies WithDefinedProps<ISerializableChatResponseData>;
	}
}


export interface IChatRequestDisablement {
	requestId: string;
	afterUndoStop?: string;
}

/**
 * Information about a chat request that needs user input to continue.
 */
export interface IChatRequestNeedsInputInfo {
	/** The chat session title */
	readonly title: string;
	/** Optional detail message, e.g., "<toolname> needs approval to run." */
	readonly detail?: string;
}

export interface IChatModel extends IDisposable {
	readonly onDidDispose: Event<void>;
	readonly onDidChange: Event<IChatChangeEvent>;
	/** @deprecated Use {@link sessionResource} instead */
	readonly sessionId: string;
	/** Milliseconds timestamp this chat model was created. */
	readonly timestamp: number;
	readonly timing: IChatSessionTiming;
	readonly sessionResource: URI;
	readonly initialLocation: ChatAgentLocation;
	readonly title: string;
	readonly hasCustomTitle: boolean;
	/** True whenever a request is currently running */
	readonly requestInProgress: IObservable<boolean>;
	/** Provides session information when a request needs user interaction to continue */
	readonly requestNeedsInput: IObservable<IChatRequestNeedsInputInfo | undefined>;
	readonly inputPlaceholder?: string;
	readonly editingSession?: IChatEditingSession | undefined;
	readonly checkpoint: IChatRequestModel | undefined;
	startEditingSession(isGlobalEditingSession?: boolean, transferFromSession?: IChatEditingSession): void;
	/** Input model for managing input state */
	readonly inputModel: IInputModel;
	readonly hasRequests: boolean;
	readonly lastRequest: IChatRequestModel | undefined;
	/** Whether this model will be kept alive while it is running or has edits */
	readonly willKeepAlive: boolean;
	readonly lastRequestObs: IObservable<IChatRequestModel | undefined>;
	getRequests(): IChatRequestModel[];
	setCheckpoint(requestId: string | undefined): void;

	toExport(): IExportableChatData;
	toJSON(): ISerializableChatData;
	readonly contributedChatSession: IChatSessionContext | undefined;
}

export interface ISerializableChatsData {
	[sessionId: string]: ISerializableChatData;
}

export type ISerializableChatAgentData = UriDto<IChatAgentData>;

interface ISerializableChatResponseData {
	responseId?: string;
	result?: IChatAgentResult; // Optional for backcompat
	responseMarkdownInfo?: ISerializableMarkdownInfo[];
	followups?: ReadonlyArray<IChatFollowup>;
	modelState?: ResponseModelStateT;
	vote?: ChatAgentVoteDirection;
	voteDownReason?: ChatAgentVoteDownReason;
	timestamp?: number;
	slashCommand?: IChatAgentCommand;
	/** For backward compat: should be optional */
	usedContext?: IChatUsedContext;
	contentReferences?: ReadonlyArray<IChatContentReference>;
	codeCitations?: ReadonlyArray<IChatCodeCitation>;
	timeSpentWaiting?: number;
}

export interface ISerializableChatRequestData extends ISerializableChatResponseData {
	requestId: string;
	message: string | IParsedChatRequest; // string => old format
	/** Is really like "prompt data". This is the message in the format in which the agent gets it + variable values. */
	variableData: IChatRequestVariableData;
	response: ReadonlyArray<IMarkdownString | IChatResponseProgressFileTreeData | IChatContentInlineReference | IChatAgentMarkdownContentWithVulnerability | IChatThinkingPart> | undefined;

	/**Old, persisted name for shouldBeRemovedOnSend */
	isHidden?: boolean;
	shouldBeRemovedOnSend?: IChatRequestDisablement;
	agent?: ISerializableChatAgentData;
	workingSet?: UriComponents[];
	// responseErrorDetails: IChatResponseErrorDetails | undefined;
	/** @deprecated modelState is used instead now */
	isCanceled?: boolean;
	timestamp?: number;
	confirmation?: string;
	editedFileEvents?: IChatAgentEditedFileEvent[];
	modelId?: string;
}

export interface ISerializableMarkdownInfo {
	readonly suggestionId: EditSuggestionId;
}

export interface IExportableChatData {
	initialLocation: ChatAgentLocation | undefined;
	requests: ISerializableChatRequestData[];
	responderUsername: string;
	responderAvatarIconUri: ThemeIcon | UriComponents | undefined; // Keeping Uri name for backcompat
}

/*
	NOTE: every time the serialized data format is updated, we need to create a new interface, because we may need to handle any old data format when parsing.
*/

export interface ISerializableChatData1 extends IExportableChatData {
	sessionId: string;
	creationDate: number;

	/** Indicates that this session was created in this window. Is cleared after the chat has been written to storage once. Needed to sync chat creations/deletions between empty windows. */
	isNew?: boolean;
}

export interface ISerializableChatData2 extends ISerializableChatData1 {
	version: 2;
	lastMessageDate: number;
	computedTitle: string | undefined;
}

export interface ISerializableChatData3 extends Omit<ISerializableChatData2, 'version' | 'computedTitle'> {
	version: 3;
	customTitle: string | undefined;
	/**
	 * Whether the session had pending edits when it was stored.
	 * todo@connor4312 This will be cleaned up with the globalization of edits.
	 */
	hasPendingEdits?: boolean;
	/** Current draft input state (added later, fully backwards compatible) */
	inputState?: ISerializableChatModelInputState;
}

/**
 * Input model for managing chat input state independently from the chat model.
 * This keeps display logic separated from the core chat model.
 *
 * The input model:
 * - Manages the current draft state (text, attachments, mode, model selection, cursor/selection)
 * - Provides an observable interface for reactive UI updates
 * - Automatically persists through the chat model's serialization
 * - Enables bidirectional sync between the UI (ChatInputPart) and the model
 * - Uses `undefined` state to indicate no persisted state (new/empty chat)
 *
 * This architecture ensures that:
 * - Input state is preserved when moving chats between editor/sidebar/window
 * - No manual state transfer is needed when switching contexts
 * - The UI stays in sync with the persisted state
 * - New chats use UI defaults (persisted preferences) instead of hardcoded values
 */
export interface IInputModel {
	/** Observable for current input state (undefined for new/uninitialized chats) */
	readonly state: IObservable<IChatModelInputState | undefined>;

	/** Update the input state (partial update) */
	setState(state: Partial<IChatModelInputState>): void;

	/** Clear input state (after sending or clearing) */
	clearState(): void;

	/** Serializes the state */
	toJSON(): ISerializableChatModelInputState | undefined;
}

/**
 * Represents the current state of the chat input that hasn't been sent yet.
 * This is the "draft" state that should be preserved across sessions.
 */
export interface IChatModelInputState {
	/** Current attachments in the input */
	attachments: readonly IChatRequestVariableEntry[];

	/** Currently selected chat mode */
	mode: {
		/** Mode ID (e.g., 'ask', 'edit', 'agent', or custom mode ID) */
		id: string;
		/** Mode kind for builtin modes */
		kind: ChatModeKind | undefined;
	};

	/** Currently selected language model, if any */
	selectedModel: ILanguageModelChatMetadataAndIdentifier | undefined;

	/** Current input text */
	inputText: string;

	/** Current selection ranges */
	selections: ISelection[];

	/** Contributed stored state */
	contrib: Record<string, unknown>;
}

/**
 * Serializable version of IChatModelInputState
 */
export interface ISerializableChatModelInputState {
	attachments: readonly IChatRequestVariableEntry[];
	mode: {
		id: string;
		kind: ChatModeKind | undefined;
	};
	selectedModel: {
		identifier: string;
		metadata: ILanguageModelChatMetadata;
	} | undefined;
	inputText: string;
	selections: ISelection[];
	contrib: Record<string, unknown>;
}

/**
* Chat data that has been parsed and normalized to the current format.
*/
export type ISerializableChatData = ISerializableChatData3;

/**
 * Chat data that has been loaded but not normalized, and could be any format
 */
export type ISerializableChatDataIn = ISerializableChatData1 | ISerializableChatData2 | ISerializableChatData3;

/**
 * Normalize chat data from storage to the current format.
 * TODO- ChatModel#_deserialize and reviveSerializedAgent also still do some normalization and maybe that should be done in here too.
 */
export function normalizeSerializableChatData(raw: ISerializableChatDataIn): ISerializableChatData {
	normalizeOldFields(raw);

	if (!('version' in raw)) {
		return {
			version: 3,
			...raw,
			lastMessageDate: raw.creationDate,
			customTitle: undefined,
		};
	}

	if (raw.version === 2) {
		return {
			...raw,
			version: 3,
			customTitle: raw.computedTitle
		};
	}

	return raw;
}

function normalizeOldFields(raw: ISerializableChatDataIn): void {
	// Fill in fields that very old chat data may be missing
	if (!raw.sessionId) {
		raw.sessionId = generateUuid();
	}

	if (!raw.creationDate) {
		raw.creationDate = getLastYearDate();
	}

	if ('version' in raw && (raw.version === 2 || raw.version === 3)) {
		if (!raw.lastMessageDate) {
			// A bug led to not porting creationDate properly, and that was copied to lastMessageDate, so fix that up if missing.
			raw.lastMessageDate = getLastYearDate();
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, local/code-no-any-casts
	if ((raw.initialLocation as any) === 'editing-session') {
		raw.initialLocation = ChatAgentLocation.Chat;
	}
}

function getLastYearDate(): number {
	const lastYearDate = new Date();
	lastYearDate.setFullYear(lastYearDate.getFullYear() - 1);
	return lastYearDate.getTime();
}

export function isExportableSessionData(obj: unknown): obj is IExportableChatData {
	return !!obj &&
		Array.isArray((obj as IExportableChatData).requests) &&
		typeof (obj as IExportableChatData).responderUsername === 'string';
}

export function isSerializableSessionData(obj: unknown): obj is ISerializableChatData {
	const data = obj as ISerializableChatData;
	return isExportableSessionData(obj) &&
		typeof data.creationDate === 'number' &&
		typeof data.sessionId === 'string' &&
		obj.requests.every((request: ISerializableChatRequestData) =>
			!request.usedContext /* for backward compat allow missing usedContext */ || isIUsedContext(request.usedContext)
		);
}

export type IChatChangeEvent =
	| IChatInitEvent
	| IChatAddRequestEvent | IChatChangedRequestEvent | IChatRemoveRequestEvent
	| IChatAddResponseEvent
	| IChatSetAgentEvent
	| IChatMoveEvent
	| IChatSetHiddenEvent
	| IChatCompletedRequestEvent
	| IChatSetCheckpointEvent
	| IChatSetCustomTitleEvent
	;

export interface IChatAddRequestEvent {
	kind: 'addRequest';
	request: IChatRequestModel;
}

export interface IChatSetCheckpointEvent {
	kind: 'setCheckpoint';
	disabledRequestIds: Set<string>;
	disabledResponseIds: Set<string>;
}

export interface IChatChangedRequestEvent {
	kind: 'changedRequest';
	request: IChatRequestModel;
}

export interface IChatCompletedRequestEvent {
	kind: 'completedRequest';
	request: IChatRequestModel;
}

export interface IChatAddResponseEvent {
	kind: 'addResponse';
	response: IChatResponseModel;
}

export const enum ChatRequestRemovalReason {
	/**
	 * "Normal" remove
	 */
	Removal,

	/**
	 * Removed because the request will be resent
	 */
	Resend,

	/**
	 * Remove because the request is moving to another model
	 */
	Adoption
}

export interface IChatRemoveRequestEvent {
	kind: 'removeRequest';
	requestId: string;
	responseId?: string;
	reason: ChatRequestRemovalReason;
}

export interface IChatSetHiddenEvent {
	kind: 'setHidden';
}

export interface IChatMoveEvent {
	kind: 'move';
	target: URI;
	range: IRange;
}

export interface IChatSetAgentEvent {
	kind: 'setAgent';
	agent: IChatAgentData;
	command?: IChatAgentCommand;
}

export interface IChatSetCustomTitleEvent {
	kind: 'setCustomTitle';
	title: string;
}

export interface IChatInitEvent {
	kind: 'initialize';
}

/**
 * Internal implementation of IInputModel
 */
class InputModel implements IInputModel {
	private readonly _state: ReturnType<typeof observableValue<IChatModelInputState | undefined>>;
	readonly state: IObservable<IChatModelInputState | undefined>;

	constructor(initialState: IChatModelInputState | undefined) {
		this._state = observableValueOpts({ debugName: 'inputModelState', equalsFn: equals }, initialState);
		this.state = this._state;
	}

	setState(state: Partial<IChatModelInputState>): void {
		const current = this._state.get();
		this._state.set({
			// If current is undefined, provide defaults for required fields
			attachments: [],
			mode: { id: 'agent', kind: ChatModeKind.Agent },
			selectedModel: undefined,
			inputText: '',
			selections: [],
			contrib: {},
			...current,
			...state
		}, undefined);
	}

	clearState(): void {
		this._state.set(undefined, undefined);
	}

	toJSON(): ISerializableChatModelInputState | undefined {
		const value = this.state.get();
		if (!value) {
			return undefined;
		}

		return {
			contrib: value.contrib,
			attachments: value.attachments,
			mode: value.mode,
			selectedModel: value.selectedModel ? {
				identifier: value.selectedModel.identifier,
				metadata: value.selectedModel.metadata
			} : undefined,
			inputText: value.inputText,
			selections: value.selections
		};
	}
}

export class ChatModel extends Disposable implements IChatModel {
	static getDefaultTitle(requests: (ISerializableChatRequestData | IChatRequestModel)[]): string {
		const firstRequestMessage = requests.at(0)?.message ?? '';
		const message = typeof firstRequestMessage === 'string' ?
			firstRequestMessage :
			firstRequestMessage.text;
		return message.split('\n')[0].substring(0, 200);
	}

	private readonly _onDidDispose = this._register(new Emitter<void>());
	readonly onDidDispose = this._onDidDispose.event;

	private readonly _onDidChange = this._register(new Emitter<IChatChangeEvent>());
	readonly onDidChange = this._onDidChange.event;

	private _requests: ChatRequestModel[];

	private _contributedChatSession: IChatSessionContext | undefined;
	public get contributedChatSession(): IChatSessionContext | undefined {
		return this._contributedChatSession;
	}
	public setContributedChatSession(session: IChatSessionContext | undefined) {
		this._contributedChatSession = session;
	}
	readonly lastRequestObs: IObservable<IChatRequestModel | undefined>;

	// TODO to be clear, this is not the same as the id from the session object, which belongs to the provider.
	// It's easier to be able to identify this model before its async initialization is complete
	private readonly _sessionId: string;
	/** @deprecated Use {@link sessionResource} instead */
	get sessionId(): string {
		return this._sessionId;
	}

	private readonly _sessionResource: URI;
	get sessionResource(): URI {
		return this._sessionResource;
	}

	readonly requestInProgress: IObservable<boolean>;
	readonly requestNeedsInput: IObservable<IChatRequestNeedsInputInfo | undefined>;

	/** Input model for managing input state */
	readonly inputModel: InputModel;

	get hasRequests(): boolean {
		return this._requests.length > 0;
	}

	get lastRequest(): ChatRequestModel | undefined {
		return this._requests.at(-1);
	}

	private _timestamp: number;
	get timestamp(): number {
		return this._timestamp;
	}

	get timing(): IChatSessionTiming {
		const lastResponse = this._requests.at(-1)?.response;
		return {
			startTime: this._timestamp,
			endTime: lastResponse?.completedAt ?? lastResponse?.timestamp
		};
	}

	private _lastMessageDate: number;
	get lastMessageDate(): number {
		return this._lastMessageDate;
	}

	private get _defaultAgent() {
		return this.chatAgentService.getDefaultAgent(ChatAgentLocation.Chat, ChatModeKind.Ask);
	}

	private readonly _initialResponderUsername: string | undefined;
	get responderUsername(): string {
		return this._defaultAgent?.fullName ??
			this._initialResponderUsername ?? '';
	}

	private readonly _initialResponderAvatarIconUri: ThemeIcon | URI | undefined;
	get responderAvatarIcon(): ThemeIcon | URI | undefined {
		return this._defaultAgent?.metadata.themeIcon ??
			this._initialResponderAvatarIconUri;
	}

	private _isImported = false;
	get isImported(): boolean {
		return this._isImported;
	}

	private _customTitle: string | undefined;
	get customTitle(): string | undefined {
		return this._customTitle;
	}

	get title(): string {
		return this._customTitle || ChatModel.getDefaultTitle(this._requests);
	}

	get hasCustomTitle(): boolean {
		return this._customTitle !== undefined;
	}

	private _editingSession: IChatEditingSession | undefined;

	get editingSession(): IChatEditingSession | undefined {
		return this._editingSession;
	}

	private readonly _initialLocation: ChatAgentLocation;
	get initialLocation(): ChatAgentLocation {
		return this._initialLocation;
	}

	private readonly _canUseTools: boolean = true;
	get canUseTools(): boolean {
		return this._canUseTools;
	}

	private _disableBackgroundKeepAlive: boolean;
	get willKeepAlive(): boolean {
		return !this._disableBackgroundKeepAlive;
	}

	constructor(
		initialData: ISerializableChatData | IExportableChatData | undefined,
		initialModelProps: { initialLocation: ChatAgentLocation; canUseTools: boolean; inputState?: ISerializableChatModelInputState; resource?: URI; sessionId?: string; disableBackgroundKeepAlive?: boolean },
		@ILogService private readonly logService: ILogService,
		@IChatAgentService private readonly chatAgentService: IChatAgentService,
		@IChatEditingService private readonly chatEditingService: IChatEditingService,
		@IChatService private readonly chatService: IChatService,
	) {
		super();

		const isValidExportedData = isExportableSessionData(initialData);
		const isValidFullData = isValidExportedData && isSerializableSessionData(initialData);
		if (initialData && !isValidExportedData) {
			this.logService.warn(`ChatModel#constructor: Loaded malformed session data: ${JSON.stringify(initialData)}`);
		}

		this._isImported = !!initialData && isValidExportedData && !isValidFullData;
		this._sessionId = (isValidFullData && initialData.sessionId) || initialModelProps.sessionId || generateUuid();
		this._sessionResource = initialModelProps.resource ?? LocalChatSessionUri.forSession(this._sessionId);
		this._disableBackgroundKeepAlive = initialModelProps.disableBackgroundKeepAlive ?? false;

		this._requests = initialData ? this._deserialize(initialData) : [];
		this._timestamp = (isValidFullData && initialData.creationDate) || Date.now();
		this._lastMessageDate = (isValidFullData && initialData.lastMessageDate) || this._timestamp;
		this._customTitle = isValidFullData ? initialData.customTitle : undefined;

		// Initialize input model from serialized data (undefined for new chats)
		const serializedInputState = initialModelProps.inputState || (isValidFullData && initialData.inputState ? initialData.inputState : undefined);
		this.inputModel = new InputModel(serializedInputState && {
			attachments: serializedInputState.attachments,
			mode: serializedInputState.mode,
			selectedModel: serializedInputState.selectedModel && {
				identifier: serializedInputState.selectedModel.identifier,
				metadata: serializedInputState.selectedModel.metadata
			},
			contrib: serializedInputState.contrib,
			inputText: serializedInputState.inputText,
			selections: serializedInputState.selections
		});

		this._initialResponderUsername = initialData?.responderUsername;
		this._initialResponderAvatarIconUri = isUriComponents(initialData?.responderAvatarIconUri) ? URI.revive(initialData.responderAvatarIconUri) : initialData?.responderAvatarIconUri;

		this._initialLocation = initialData?.initialLocation ?? initialModelProps.initialLocation;
		this._canUseTools = initialModelProps.canUseTools;

		this.lastRequestObs = observableFromEvent(this, this.onDidChange, () => this._requests.at(-1));

		this._register(autorun(reader => {
			const request = this.lastRequestObs.read(reader);
			if (!request?.response) {
				return;
			}

			reader.store.add(request.response.onDidChange(async ev => {
				if (ev.reason === 'completedRequest' && this._editingSession) {
					if (request === this._requests.at(-1)
						&& request.session.sessionResource.scheme !== Schemas.vscodeLocalChatSession
						&& this._editingSession.hasEditsInRequest(request.id)
					) {
						const diffs = this._editingSession.getDiffsForFilesInRequest(request.id);
						request.response?.updateContent(editEntriesToMultiDiffData(diffs), true);
					}
					this._onDidChange.fire({ kind: 'completedRequest', request });
				}
			}));
		}));

		this.requestInProgress = this.lastRequestObs.map((request, r) => {
			return request?.response?.isInProgress.read(r) ?? false;
		});

		this.requestNeedsInput = this.lastRequestObs.map((request, r) => {
			const pendingInfo = request?.response?.isPendingConfirmation.read(r);
			if (!pendingInfo) {
				return undefined;
			}
			return {
				title: this.title,
				detail: pendingInfo.detail,
			};
		});

		// Retain a reference to itself when a request is in progress, so the ChatModel stays alive in the background
		// only while running a request. TODO also keep it alive for 5min or so so we don't have to dispose/restore too often?
		if (this.initialLocation === ChatAgentLocation.Chat && !initialModelProps.disableBackgroundKeepAlive) {
			const selfRef = this._register(new MutableDisposable<IChatModelReference>());
			this._register(autorun(r => {
				const inProgress = this.requestInProgress.read(r);
				const needsInput = this.requestNeedsInput.read(r);
				const shouldStayAlive = inProgress || !!needsInput;
				if (shouldStayAlive && !selfRef.value) {
					selfRef.value = chatService.getActiveSessionReference(this._sessionResource);
				} else if (!shouldStayAlive && selfRef.value) {
					selfRef.clear();
				}
			}));
		}
	}

	startEditingSession(isGlobalEditingSession?: boolean, transferFromSession?: IChatEditingSession): void {
		const session = this._editingSession ??= this._register(
			transferFromSession
				? this.chatEditingService.transferEditingSession(this, transferFromSession)
				: isGlobalEditingSession
					? this.chatEditingService.startOrContinueGlobalEditingSession(this)
					: this.chatEditingService.createEditingSession(this)
		);

		if (!this._disableBackgroundKeepAlive) {
			// todo@connor4312: hold onto a reference so background sessions don't
			// trigger early disposal. This will be cleaned up with the globalization of edits.
			const selfRef = this._register(new MutableDisposable<IChatModelReference>());
			this._register(autorun(r => {
				const hasModified = session.entries.read(r).some(e => e.state.read(r) === ModifiedFileEntryState.Modified);
				if (hasModified && !selfRef.value) {
					selfRef.value = this.chatService.getActiveSessionReference(this._sessionResource);
				} else if (!hasModified && selfRef.value) {
					selfRef.clear();
				}
			}));
		}

		this._register(autorun(reader => {
			this._setDisabledRequests(session.requestDisablement.read(reader));
		}));
	}

	private currentEditedFileEvents = new ResourceMap<IChatAgentEditedFileEvent>();
	notifyEditingAction(action: IChatEditingSessionAction): void {
		const state = action.outcome === 'accepted' ? ChatRequestEditedFileEventKind.Keep :
			action.outcome === 'rejected' ? ChatRequestEditedFileEventKind.Undo :
				action.outcome === 'userModified' ? ChatRequestEditedFileEventKind.UserModification : null;
		if (state === null) {
			return;
		}

		if (!this.currentEditedFileEvents.has(action.uri) || this.currentEditedFileEvents.get(action.uri)?.eventKind === ChatRequestEditedFileEventKind.Keep) {
			this.currentEditedFileEvents.set(action.uri, { eventKind: state, uri: action.uri });
		}
	}

	private _deserialize(obj: IExportableChatData | ISerializableChatData): ChatRequestModel[] {
		const requests = obj.requests;
		if (!Array.isArray(requests)) {
			this.logService.error(`Ignoring malformed session data: ${JSON.stringify(obj)}`);
			return [];
		}

		try {
			return requests.map((raw: ISerializableChatRequestData) => {
				const parsedRequest =
					typeof raw.message === 'string'
						? this.getParsedRequestFromString(raw.message)
						: reviveParsedChatRequest(raw.message);

				// Old messages don't have variableData, or have it in the wrong (non-array) shape
				const variableData: IChatRequestVariableData = this.reviveVariableData(raw.variableData);
				const request = new ChatRequestModel({
					session: this,
					message: parsedRequest,
					variableData,
					timestamp: raw.timestamp ?? -1,
					restoredId: raw.requestId,
					confirmation: raw.confirmation,
					editedFileEvents: raw.editedFileEvents,
					modelId: raw.modelId,
				});
				request.shouldBeRemovedOnSend = raw.isHidden ? { requestId: raw.requestId } : raw.shouldBeRemovedOnSend;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any, local/code-no-any-casts
				if (raw.response || raw.result || (raw as any).responseErrorDetails) {
					const agent = (raw.agent && 'metadata' in raw.agent) ? // Check for the new format, ignore entries in the old format
						reviveSerializedAgent(raw.agent) : undefined;

					// Port entries from old format
					const result = 'responseErrorDetails' in raw ?
						// eslint-disable-next-line local/code-no-dangerous-type-assertions
						{ errorDetails: raw.responseErrorDetails } as IChatAgentResult : raw.result;
					request.response = new ChatResponseModel({
						responseContent: raw.response ?? [new MarkdownString(raw.response)],
						session: this,
						agent,
						slashCommand: raw.slashCommand,
						requestId: request.id,
						modelState: raw.modelState || { value: raw.isCanceled ? ResponseModelState.Cancelled : ResponseModelState.Complete, completedAt: 'lastMessageDate' in obj ? obj.lastMessageDate : Date.now() },
						vote: raw.vote,
						timestamp: raw.timestamp,
						voteDownReason: raw.voteDownReason,
						result,
						followups: raw.followups,
						restoredId: raw.responseId,
						timeSpentWaiting: raw.timeSpentWaiting,
						shouldBeBlocked: request.shouldBeBlocked,
						codeBlockInfos: raw.responseMarkdownInfo?.map<ICodeBlockInfo>(info => ({ suggestionId: info.suggestionId })),
					});
					request.response.shouldBeRemovedOnSend = raw.isHidden ? { requestId: raw.requestId } : raw.shouldBeRemovedOnSend;
					if (raw.usedContext) { // @ulugbekna: if this's a new vscode sessions, doc versions are incorrect anyway?
						request.response.applyReference(revive(raw.usedContext));
					}

					raw.contentReferences?.forEach(r => request.response!.applyReference(revive(r)));
					raw.codeCitations?.forEach(c => request.response!.applyCodeCitation(revive(c)));
				}
				return request;
			});
		} catch (error) {
			this.logService.error('Failed to parse chat data', error);
			return [];
		}
	}

	private reviveVariableData(raw: IChatRequestVariableData): IChatRequestVariableData {
		const variableData = raw && Array.isArray(raw.variables)
			? raw :
			{ variables: [] };

		variableData.variables = variableData.variables.map<IChatRequestVariableEntry>((v): IChatRequestVariableEntry => {
			// Old variables format
			if (v && 'values' in v && Array.isArray(v.values)) {
				return {
					kind: 'generic',
					id: v.id ?? '',
					name: v.name,
					value: v.values[0]?.value,
					range: v.range,
					modelDescription: v.modelDescription,
					references: v.references
				};
			} else {
				return v;
			}
		});

		return variableData;
	}

	private getParsedRequestFromString(message: string): IParsedChatRequest {
		// TODO These offsets won't be used, but chat replies need to go through the parser as well
		const parts = [new ChatRequestTextPart(new OffsetRange(0, message.length), { startColumn: 1, startLineNumber: 1, endColumn: 1, endLineNumber: 1 }, message)];
		return {
			text: message,
			parts
		};
	}



	getRequests(): ChatRequestModel[] {
		return this._requests;
	}

	resetCheckpoint(): void {
		for (const request of this._requests) {
			request.shouldBeBlocked = false;
		}
	}

	setCheckpoint(requestId: string | undefined) {
		let checkpoint: ChatRequestModel | undefined;
		let checkpointIndex = -1;
		if (requestId !== undefined) {
			this._requests.forEach((request, index) => {
				if (request.id === requestId) {
					checkpointIndex = index;
					checkpoint = request;
					request.shouldBeBlocked = true;
				}
			});

			if (!checkpoint) {
				return; // Invalid request ID
			}
		}

		const disabledRequestIds = new Set<string>();
		const disabledResponseIds = new Set<string>();
		for (let i = this._requests.length - 1; i >= 0; i -= 1) {
			const request = this._requests[i];
			if (this._checkpoint && !checkpoint) {
				request.shouldBeBlocked = false;
			} else if (checkpoint && i >= checkpointIndex) {
				request.shouldBeBlocked = true;
				disabledRequestIds.add(request.id);
				if (request.response) {
					disabledResponseIds.add(request.response.id);
				}
			} else if (checkpoint && i < checkpointIndex) {
				request.shouldBeBlocked = false;
			}
		}

		this._checkpoint = checkpoint;
		this._onDidChange.fire({
			kind: 'setCheckpoint',
			disabledRequestIds,
			disabledResponseIds
		});
	}

	private _checkpoint: ChatRequestModel | undefined = undefined;
	public get checkpoint() {
		return this._checkpoint;
	}

	private _setDisabledRequests(requestIds: IChatRequestDisablement[]) {
		this._requests.forEach((request) => {
			const shouldBeRemovedOnSend = requestIds.find(r => r.requestId === request.id);
			request.shouldBeRemovedOnSend = shouldBeRemovedOnSend;
			if (request.response) {
				request.response.shouldBeRemovedOnSend = shouldBeRemovedOnSend;
			}
		});

		this._onDidChange.fire({ kind: 'setHidden' });
	}

	addRequest(message: IParsedChatRequest, variableData: IChatRequestVariableData, attempt: number, modeInfo?: IChatRequestModeInfo, chatAgent?: IChatAgentData, slashCommand?: IChatAgentCommand, confirmation?: string, locationData?: IChatLocationData, attachments?: IChatRequestVariableEntry[], isCompleteAddedRequest?: boolean, modelId?: string, userSelectedTools?: UserSelectedTools, id?: string): ChatRequestModel {
		const editedFileEvents = [...this.currentEditedFileEvents.values()];
		this.currentEditedFileEvents.clear();
		const request = new ChatRequestModel({
			restoredId: id,
			session: this,
			message,
			variableData,
			timestamp: Date.now(),
			attempt,
			modeInfo,
			confirmation,
			locationData,
			attachedContext: attachments,
			isCompleteAddedRequest,
			modelId,
			editedFileEvents: editedFileEvents.length ? editedFileEvents : undefined,
			userSelectedTools,
		});
		request.response = new ChatResponseModel({
			responseContent: [],
			session: this,
			agent: chatAgent,
			slashCommand,
			requestId: request.id,
			isCompleteAddedRequest,
			codeBlockInfos: undefined,
		});

		this._requests.push(request);
		this._lastMessageDate = Date.now();
		this._onDidChange.fire({ kind: 'addRequest', request });
		return request;
	}

	public setCustomTitle(title: string): void {
		this._customTitle = title;
		this._onDidChange.fire({ kind: 'setCustomTitle', title });
	}

	updateRequest(request: ChatRequestModel, variableData: IChatRequestVariableData) {
		request.variableData = variableData;
		this._onDidChange.fire({ kind: 'changedRequest', request });
	}

	adoptRequest(request: ChatRequestModel): void {
		// this doesn't use `removeRequest` because it must not dispose the request object
		const oldOwner = request.session;
		const index = oldOwner._requests.findIndex((candidate: ChatRequestModel) => candidate.id === request.id);

		if (index === -1) {
			return;
		}

		oldOwner._requests.splice(index, 1);

		request.adoptTo(this);
		request.response?.adoptTo(this);
		this._requests.push(request);

		oldOwner._onDidChange.fire({ kind: 'removeRequest', requestId: request.id, responseId: request.response?.id, reason: ChatRequestRemovalReason.Adoption });
		this._onDidChange.fire({ kind: 'addRequest', request });
	}

	acceptResponseProgress(request: ChatRequestModel, progress: IChatProgress, quiet?: boolean): void {
		if (!request.response) {
			request.response = new ChatResponseModel({
				responseContent: [],
				session: this,
				requestId: request.id,
				codeBlockInfos: undefined,
			});
		}

		if (request.response.isComplete) {
			throw new Error('acceptResponseProgress: Adding progress to a completed response');
		}

		if (progress.kind === 'usedContext' || progress.kind === 'reference') {
			request.response.applyReference(progress);
		} else if (progress.kind === 'codeCitation') {
			request.response.applyCodeCitation(progress);
		} else if (progress.kind === 'move') {
			this._onDidChange.fire({ kind: 'move', target: progress.uri, range: progress.range });
		} else if (progress.kind === 'codeblockUri' && progress.isEdit) {
			request.response.addUndoStop({ id: progress.undoStopId ?? generateUuid(), kind: 'undoStop' });
			request.response.updateContent(progress, quiet);
		} else if (progress.kind === 'progressTaskResult') {
			// Should have been handled upstream, not sent to model
			this.logService.error(`Couldn't handle progress: ${JSON.stringify(progress)}`);
		} else {
			request.response.updateContent(progress, quiet);
		}
	}

	removeRequest(id: string, reason: ChatRequestRemovalReason = ChatRequestRemovalReason.Removal): void {
		const index = this._requests.findIndex(request => request.id === id);
		const request = this._requests[index];

		if (index !== -1) {
			this._onDidChange.fire({ kind: 'removeRequest', requestId: request.id, responseId: request.response?.id, reason });
			this._requests.splice(index, 1);
			request.response?.dispose();
		}
	}

	cancelRequest(request: ChatRequestModel): void {
		if (request.response) {
			request.response.cancel();
		}
	}

	setResponse(request: ChatRequestModel, result: IChatAgentResult): void {
		if (!request.response) {
			request.response = new ChatResponseModel({
				responseContent: [],
				session: this,
				requestId: request.id,
				codeBlockInfos: undefined,
			});
		}

		request.response.setResult(result);
	}

	setFollowups(request: ChatRequestModel, followups: IChatFollowup[] | undefined): void {
		if (!request.response) {
			// Maybe something went wrong?
			return;
		}
		request.response.setFollowups(followups);
	}

	setResponseModel(request: ChatRequestModel, response: ChatResponseModel): void {
		request.response = response;
		this._onDidChange.fire({ kind: 'addResponse', response });
	}

	toExport(): IExportableChatData {
		return {
			responderUsername: this.responderUsername,
			responderAvatarIconUri: this.responderAvatarIcon,
			initialLocation: this.initialLocation,
			requests: this._requests.map((r): ISerializableChatRequestData => {
				const message = {
					...r.message,
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					parts: r.message.parts.map((p: any) => p && 'toJSON' in p ? (p.toJSON as Function)() : p)
				};
				const agent = r.response?.agent;
				const agentJson = agent && 'toJSON' in agent ? (agent.toJSON as Function)() :
					agent ? { ...agent } : undefined;
				return {
					requestId: r.id,
					message,
					variableData: r.variableData,
					response: r.response ?
						r.response.entireResponse.value.map(item => {
							// Keeping the shape of the persisted data the same for back compat
							if (item.kind === 'treeData') {
								return item.treeData;
							} else if (item.kind === 'markdownContent') {
								return item.content;
							} else {
								// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
								return item as any; // TODO
							}
						})
						: undefined,
					shouldBeRemovedOnSend: r.shouldBeRemovedOnSend,
					agent: agentJson,
					timestamp: r.timestamp,
					confirmation: r.confirmation,
					editedFileEvents: r.editedFileEvents,
					modelId: r.modelId,
					...r.response?.toJSON(),
				};
			}),
		};
	}

	toJSON(): ISerializableChatData {
		return {
			version: 3,
			...this.toExport(),
			sessionId: this.sessionId,
			creationDate: this._timestamp,
			lastMessageDate: this._lastMessageDate,
			customTitle: this._customTitle,
			hasPendingEdits: !!(this._editingSession?.entries.get().some(e => e.state.get() === ModifiedFileEntryState.Modified)),
			inputState: this.inputModel.toJSON(),
		};
	}

	override dispose() {
		this._requests.forEach(r => r.response?.dispose());
		this._onDidDispose.fire();

		super.dispose();
	}
}

export function updateRanges(variableData: IChatRequestVariableData, diff: number): IChatRequestVariableData {
	return {
		variables: variableData.variables.map(v => ({
			...v,
			range: v.range && {
				start: v.range.start - diff,
				endExclusive: v.range.endExclusive - diff
			}
		}))
	};
}

export function canMergeMarkdownStrings(md1: IMarkdownString, md2: IMarkdownString): boolean {
	if (md1.baseUri && md2.baseUri) {
		const baseUriEquals = md1.baseUri.scheme === md2.baseUri.scheme
			&& md1.baseUri.authority === md2.baseUri.authority
			&& md1.baseUri.path === md2.baseUri.path
			&& md1.baseUri.query === md2.baseUri.query
			&& md1.baseUri.fragment === md2.baseUri.fragment;
		if (!baseUriEquals) {
			return false;
		}
	} else if (md1.baseUri || md2.baseUri) {
		return false;
	}

	return equals(md1.isTrusted, md2.isTrusted) &&
		md1.supportHtml === md2.supportHtml &&
		md1.supportThemeIcons === md2.supportThemeIcons;
}

export function appendMarkdownString(md1: IMarkdownString, md2: IMarkdownString | string): IMarkdownString {
	const appendedValue = typeof md2 === 'string' ? md2 : md2.value;
	return {
		value: md1.value + appendedValue,
		isTrusted: md1.isTrusted,
		supportThemeIcons: md1.supportThemeIcons,
		supportHtml: md1.supportHtml,
		baseUri: md1.baseUri
	};
}

export function getCodeCitationsMessage(citations: ReadonlyArray<IChatCodeCitation>): string {
	if (citations.length === 0) {
		return '';
	}

	const licenseTypes = citations.reduce((set, c) => set.add(c.license), new Set<string>());
	const label = licenseTypes.size === 1 ?
		localize('codeCitation', "Similar code found with 1 license type", licenseTypes.size) :
		localize('codeCitations', "Similar code found with {0} license types", licenseTypes.size);
	return label;
}

export enum ChatRequestEditedFileEventKind {
	Keep = 1,
	Undo = 2,
	UserModification = 3,
}

export interface IChatAgentEditedFileEvent {
	readonly uri: URI;
	readonly eventKind: ChatRequestEditedFileEventKind;
}

/** URI for a resource embedded in a chat request/response */
export namespace ChatResponseResource {
	export const scheme = 'vscode-chat-response-resource';

	export function createUri(sessionResource: URI, toolCallId: string, index: number, basename?: string): URI {
		return URI.from({
			scheme: ChatResponseResource.scheme,
			authority: encodeHex(VSBuffer.fromString(sessionResource.toString())),
			path: `/tool/${toolCallId}/${index}` + (basename ? `/${basename}` : ''),
		});
	}

	export function parseUri(uri: URI): undefined | { sessionResource: URI; toolCallId: string; index: number } {
		if (uri.scheme !== ChatResponseResource.scheme) {
			return undefined;
		}

		const parts = uri.path.split('/');
		if (parts.length < 5) {
			return undefined;
		}

		const [, kind, toolCallId, index] = parts;
		if (kind !== 'tool') {
			return undefined;
		}

		let sessionResource: URI;
		try {
			sessionResource = URI.parse(decodeHex(uri.authority).toString());
		} catch (e) {
			if (e instanceof SyntaxError) { // pre-1.108 local session ID
				sessionResource = LocalChatSessionUri.forSession(uri.authority);
			} else {
				throw e;
			}
		}

		return {
			sessionResource,
			toolCallId: toolCallId,
			index: Number(index),
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatModelStore.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatModelStore.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';
import { DisposableStore, IDisposable, IReference, ReferenceCollection } from '../../../../base/common/lifecycle.js';
import { ObservableMap } from '../../../../base/common/observable.js';
import { URI } from '../../../../base/common/uri.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IChatEditingSession } from './chatEditingService.js';
import { ChatModel, IExportableChatData, ISerializableChatData, ISerializableChatModelInputState } from './chatModel.js';
import { ChatAgentLocation } from './constants.js';

export interface IStartSessionProps {
	readonly initialData?: IExportableChatData | ISerializableChatData;
	readonly location: ChatAgentLocation;
	readonly sessionResource: URI;
	readonly sessionId?: string;
	readonly canUseTools: boolean;
	readonly transferEditingSession?: IChatEditingSession;
	readonly disableBackgroundKeepAlive?: boolean;
	readonly inputState?: ISerializableChatModelInputState;
}

export interface ChatModelStoreDelegate {
	createModel: (props: IStartSessionProps) => ChatModel;
	willDisposeModel: (model: ChatModel) => Promise<void>;
}

export class ChatModelStore extends ReferenceCollection<ChatModel> implements IDisposable {
	private readonly _store = new DisposableStore();

	private readonly _models = new ObservableMap<string, ChatModel>();
	private readonly _modelsToDispose = new Set<string>();
	private readonly _pendingDisposals = new Set<Promise<void>>();

	private readonly _onDidDisposeModel = this._store.add(new Emitter<ChatModel>());
	public readonly onDidDisposeModel = this._onDidDisposeModel.event;

	constructor(
		private readonly delegate: ChatModelStoreDelegate,
		@ILogService private readonly logService: ILogService,
	) {
		super();
	}

	public get observable() {
		return this._models.observable;
	}

	public values(): Iterable<ChatModel> {
		return this._models.values();
	}

	/**
	 * Get a ChatModel directly without acquiring a reference.
	 */
	public get(uri: URI): ChatModel | undefined {
		return this._models.get(this.toKey(uri));
	}

	public has(uri: URI): boolean {
		return this._models.has(this.toKey(uri));
	}

	public acquireExisting(uri: URI): IReference<ChatModel> | undefined {
		const key = this.toKey(uri);
		if (!this._models.has(key)) {
			return undefined;
		}
		return this.acquire(key);
	}

	public acquireOrCreate(props: IStartSessionProps): IReference<ChatModel> {
		return this.acquire(this.toKey(props.sessionResource), props);
	}

	protected createReferencedObject(key: string, props?: IStartSessionProps): ChatModel {
		this._modelsToDispose.delete(key);
		const existingModel = this._models.get(key);
		if (existingModel) {
			return existingModel;
		}

		if (!props) {
			throw new Error(`No start session props provided for chat session ${key}`);
		}

		this.logService.trace(`Creating chat session ${key}`);
		const model = this.delegate.createModel(props);
		if (model.sessionResource.toString() !== key) {
			throw new Error(`Chat session key mismatch for ${key}`);
		}
		this._models.set(key, model);
		return model;
	}

	protected destroyReferencedObject(key: string, object: ChatModel): void {
		this._modelsToDispose.add(key);
		const promise = this.doDestroyReferencedObject(key, object);
		this._pendingDisposals.add(promise);
		promise.finally(() => {
			this._pendingDisposals.delete(promise);
		});
	}

	private async doDestroyReferencedObject(key: string, object: ChatModel): Promise<void> {
		try {
			await this.delegate.willDisposeModel(object);
		} catch (error) {
			this.logService.error(error);
		} finally {
			if (this._modelsToDispose.has(key)) {
				this.logService.trace(`Disposing chat session ${key}`);
				this._models.delete(key);
				this._onDidDisposeModel.fire(object);
				object.dispose();
			}
			this._modelsToDispose.delete(key);
		}
	}

	/**
	 * For test use only
	 */
	async waitForModelDisposals(): Promise<void> {
		await Promise.all(this._pendingDisposals);
	}

	private toKey(uri: URI): string {
		return uri.toString();
	}

	dispose(): void {
		this._store.dispose();
		this._models.forEach(model => model.dispose());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatModes.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatModes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { constObservable, IObservable, ISettableObservable, observableValue, transaction } from '../../../../base/common/observable.js';
import { URI } from '../../../../base/common/uri.js';
import { IOffsetRange } from '../../../../editor/common/core/ranges/offsetRange.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IChatAgentService } from './chatAgents.js';
import { ChatContextKeys } from './chatContextKeys.js';
import { ChatConfiguration, ChatModeKind } from './constants.js';
import { IHandOff } from './promptSyntax/promptFileParser.js';
import { ExtensionAgentSourceType, IAgentSource, ICustomAgent, IPromptsService, PromptsStorage } from './promptSyntax/service/promptsService.js';

export const IChatModeService = createDecorator<IChatModeService>('chatModeService');
export interface IChatModeService {
	readonly _serviceBrand: undefined;

	// TODO expose an observable list of modes
	readonly onDidChangeChatModes: Event<void>;
	getModes(): { builtin: readonly IChatMode[]; custom: readonly IChatMode[] };
	findModeById(id: string): IChatMode | undefined;
	findModeByName(name: string): IChatMode | undefined;
}

export class ChatModeService extends Disposable implements IChatModeService {
	declare readonly _serviceBrand: undefined;

	private static readonly CUSTOM_MODES_STORAGE_KEY = 'chat.customModes';

	private readonly hasCustomModes: IContextKey<boolean>;
	private readonly agentModeDisabledByPolicy: IContextKey<boolean>;
	private readonly _customModeInstances = new Map<string, CustomChatMode>();

	private readonly _onDidChangeChatModes = new Emitter<void>();
	public readonly onDidChangeChatModes = this._onDidChangeChatModes.event;

	constructor(
		@IPromptsService private readonly promptsService: IPromptsService,
		@IChatAgentService private readonly chatAgentService: IChatAgentService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@ILogService private readonly logService: ILogService,
		@IStorageService private readonly storageService: IStorageService,
		@IConfigurationService private readonly configurationService: IConfigurationService
	) {
		super();

		this.hasCustomModes = ChatContextKeys.Modes.hasCustomChatModes.bindTo(contextKeyService);
		this.agentModeDisabledByPolicy = ChatContextKeys.Modes.agentModeDisabledByPolicy.bindTo(contextKeyService);

		// Initialize the policy context key
		this.updateAgentModePolicyContextKey();

		// Load cached modes from storage first
		this.loadCachedModes();

		void this.refreshCustomPromptModes(true);
		this._register(this.promptsService.onDidChangeCustomAgents(() => {
			void this.refreshCustomPromptModes(true);
		}));
		this._register(this.storageService.onWillSaveState(() => this.saveCachedModes()));

		// Listen for configuration changes that affect agent mode policy
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(ChatConfiguration.AgentEnabled)) {
				this.updateAgentModePolicyContextKey();
				this._onDidChangeChatModes.fire();
			}
		}));

		// Ideally we can get rid of the setting to disable agent mode?
		let didHaveToolsAgent = this.chatAgentService.hasToolsAgent;
		this._register(this.chatAgentService.onDidChangeAgents(() => {
			if (didHaveToolsAgent !== this.chatAgentService.hasToolsAgent) {
				didHaveToolsAgent = this.chatAgentService.hasToolsAgent;
				this._onDidChangeChatModes.fire();
			}
		}));
	}

	private loadCachedModes(): void {
		try {
			const cachedCustomModes = this.storageService.getObject(ChatModeService.CUSTOM_MODES_STORAGE_KEY, StorageScope.WORKSPACE);
			if (cachedCustomModes) {
				this.deserializeCachedModes(cachedCustomModes);
			}
		} catch (error) {
			this.logService.error(error, 'Failed to load cached custom agents');
		}
	}

	private deserializeCachedModes(cachedCustomModes: unknown): void {
		if (!Array.isArray(cachedCustomModes)) {
			this.logService.error('Invalid cached custom modes data: expected array');
			return;
		}

		for (const cachedMode of cachedCustomModes) {
			if (isCachedChatModeData(cachedMode) && cachedMode.uri) {
				try {
					const uri = URI.revive(cachedMode.uri);
					const customChatMode: ICustomAgent = {
						uri,
						name: cachedMode.name,
						description: cachedMode.description,
						tools: cachedMode.customTools,
						model: cachedMode.model,
						argumentHint: cachedMode.argumentHint,
						agentInstructions: cachedMode.modeInstructions ?? { content: cachedMode.body ?? '', toolReferences: [] },
						handOffs: cachedMode.handOffs,
						target: cachedMode.target,
						infer: cachedMode.infer,
						source: reviveChatModeSource(cachedMode.source) ?? { storage: PromptsStorage.local }
					};
					const instance = new CustomChatMode(customChatMode);
					this._customModeInstances.set(uri.toString(), instance);
				} catch (error) {
					this.logService.error(error, 'Failed to revive cached custom agent');
				}
			}
		}

		this.hasCustomModes.set(this._customModeInstances.size > 0);
	}

	private saveCachedModes(): void {
		try {
			const modesToCache = Array.from(this._customModeInstances.values());
			this.storageService.store(ChatModeService.CUSTOM_MODES_STORAGE_KEY, modesToCache, StorageScope.WORKSPACE, StorageTarget.MACHINE);
		} catch (error) {
			this.logService.warn('Failed to save cached custom agents', error);
		}
	}

	private async refreshCustomPromptModes(fireChangeEvent?: boolean): Promise<void> {
		try {
			const customModes = await this.promptsService.getCustomAgents(CancellationToken.None);

			// Create a new set of mode instances, reusing existing ones where possible
			const seenUris = new Set<string>();

			for (const customMode of customModes) {
				const uriString = customMode.uri.toString();
				seenUris.add(uriString);

				let modeInstance = this._customModeInstances.get(uriString);
				if (modeInstance) {
					// Update existing instance with new data
					modeInstance.updateData(customMode);
				} else {
					// Create new instance
					modeInstance = new CustomChatMode(customMode);
					this._customModeInstances.set(uriString, modeInstance);
				}
			}

			// Clean up instances for modes that no longer exist
			for (const [uriString] of this._customModeInstances.entries()) {
				if (!seenUris.has(uriString)) {
					this._customModeInstances.delete(uriString);
				}
			}

			this.hasCustomModes.set(this._customModeInstances.size > 0);
		} catch (error) {
			this.logService.error(error, 'Failed to load custom agents');
			this._customModeInstances.clear();
			this.hasCustomModes.set(false);
		}
		if (fireChangeEvent) {
			this._onDidChangeChatModes.fire();
		}
	}

	getModes(): { builtin: readonly IChatMode[]; custom: readonly IChatMode[] } {
		return {
			builtin: this.getBuiltinModes(),
			custom: this.getCustomModes(),
		};
	}

	findModeById(id: string | ChatModeKind): IChatMode | undefined {
		return this.getBuiltinModes().find(mode => mode.id === id) ?? this._customModeInstances.get(id);
	}

	findModeByName(name: string): IChatMode | undefined {
		return this.getBuiltinModes().find(mode => mode.name.get() === name) ?? this.getCustomModes().find(mode => mode.name.get() === name);
	}

	private getBuiltinModes(): IChatMode[] {
		const builtinModes: IChatMode[] = [
			ChatMode.Ask,
		];

		// Include Agent mode if:
		// - It's enabled (hasToolsAgent is true), OR
		// - It's disabled by policy (so we can show it with a lock icon)
		// But hide it if the user manually disabled it via settings
		if (this.chatAgentService.hasToolsAgent || this.isAgentModeDisabledByPolicy()) {
			builtinModes.unshift(ChatMode.Agent);
		}
		builtinModes.push(ChatMode.Edit);
		return builtinModes;
	}

	private getCustomModes(): IChatMode[] {
		// Show custom modes when agent mode is enabled OR when disabled by policy (to show them in the policy-managed group)
		return this.chatAgentService.hasToolsAgent || this.isAgentModeDisabledByPolicy() ? Array.from(this._customModeInstances.values()) : [];
	}

	private updateAgentModePolicyContextKey(): void {
		this.agentModeDisabledByPolicy.set(this.isAgentModeDisabledByPolicy());
	}

	private isAgentModeDisabledByPolicy(): boolean {
		return this.configurationService.inspect<boolean>(ChatConfiguration.AgentEnabled).policyValue === false;
	}
}

export interface IChatModeData {
	readonly id: string;
	readonly name: string;
	readonly description?: string;
	readonly kind: ChatModeKind;
	readonly customTools?: readonly string[];
	readonly model?: string;
	readonly argumentHint?: string;
	readonly modeInstructions?: IChatModeInstructions;
	readonly body?: string; /* deprecated */
	readonly handOffs?: readonly IHandOff[];
	readonly uri?: URI;
	readonly source?: IChatModeSourceData;
	readonly target?: string;
	readonly infer?: boolean;
}

export interface IChatMode {
	readonly id: string;
	readonly name: IObservable<string>;
	readonly label: IObservable<string>;
	readonly description: IObservable<string | undefined>;
	readonly isBuiltin: boolean;
	readonly kind: ChatModeKind;
	readonly customTools?: IObservable<readonly string[] | undefined>;
	readonly handOffs?: IObservable<readonly IHandOff[] | undefined>;
	readonly model?: IObservable<string | undefined>;
	readonly argumentHint?: IObservable<string | undefined>;
	readonly modeInstructions?: IObservable<IChatModeInstructions>;
	readonly uri?: IObservable<URI>;
	readonly source?: IAgentSource;
	readonly target?: IObservable<string | undefined>;
	readonly infer?: IObservable<boolean | undefined>;
}

export interface IVariableReference {
	readonly name: string;
	readonly range: IOffsetRange;
}

export interface IChatModeInstructions {
	readonly content: string;
	readonly toolReferences: readonly IVariableReference[];
	readonly metadata?: Record<string, boolean | string | number>;
}

function isCachedChatModeData(data: unknown): data is IChatModeData {
	if (typeof data !== 'object' || data === null) {
		return false;
	}

	const mode = data as IChatModeData;
	return typeof mode.id === 'string' &&
		typeof mode.name === 'string' &&
		typeof mode.kind === 'string' &&
		(mode.description === undefined || typeof mode.description === 'string') &&
		(mode.customTools === undefined || Array.isArray(mode.customTools)) &&
		(mode.modeInstructions === undefined || (typeof mode.modeInstructions === 'object' && mode.modeInstructions !== null)) &&
		(mode.model === undefined || typeof mode.model === 'string') &&
		(mode.argumentHint === undefined || typeof mode.argumentHint === 'string') &&
		(mode.handOffs === undefined || Array.isArray(mode.handOffs)) &&
		(mode.uri === undefined || (typeof mode.uri === 'object' && mode.uri !== null)) &&
		(mode.source === undefined || isChatModeSourceData(mode.source)) &&
		(mode.target === undefined || typeof mode.target === 'string') &&
		(mode.infer === undefined || typeof mode.infer === 'boolean');
}

export class CustomChatMode implements IChatMode {
	private readonly _nameObservable: ISettableObservable<string>;
	private readonly _descriptionObservable: ISettableObservable<string | undefined>;
	private readonly _customToolsObservable: ISettableObservable<readonly string[] | undefined>;
	private readonly _modeInstructions: ISettableObservable<IChatModeInstructions>;
	private readonly _uriObservable: ISettableObservable<URI>;
	private readonly _modelObservable: ISettableObservable<string | undefined>;
	private readonly _argumentHintObservable: ISettableObservable<string | undefined>;
	private readonly _handoffsObservable: ISettableObservable<readonly IHandOff[] | undefined>;
	private readonly _targetObservable: ISettableObservable<string | undefined>;
	private readonly _inferObservable: ISettableObservable<boolean | undefined>;
	private _source: IAgentSource;

	public readonly id: string;

	get name(): IObservable<string> {
		return this._nameObservable;
	}

	get description(): IObservable<string | undefined> {
		return this._descriptionObservable;
	}

	public get isBuiltin(): boolean {
		return isBuiltinChatMode(this);
	}

	get customTools(): IObservable<readonly string[] | undefined> {
		return this._customToolsObservable;
	}

	get model(): IObservable<string | undefined> {
		return this._modelObservable;
	}

	get argumentHint(): IObservable<string | undefined> {
		return this._argumentHintObservable;
	}

	get modeInstructions(): IObservable<IChatModeInstructions> {
		return this._modeInstructions;
	}

	get uri(): IObservable<URI> {
		return this._uriObservable;
	}

	get label(): IObservable<string> {
		return this.name;
	}

	get handOffs(): IObservable<readonly IHandOff[] | undefined> {
		return this._handoffsObservable;
	}

	get source(): IAgentSource {
		return this._source;
	}

	get target(): IObservable<string | undefined> {
		return this._targetObservable;
	}

	get infer(): IObservable<boolean | undefined> {
		return this._inferObservable;
	}

	public readonly kind = ChatModeKind.Agent;

	constructor(
		customChatMode: ICustomAgent
	) {
		this.id = customChatMode.uri.toString();
		this._nameObservable = observableValue('name', customChatMode.name);
		this._descriptionObservable = observableValue('description', customChatMode.description);
		this._customToolsObservable = observableValue('customTools', customChatMode.tools);
		this._modelObservable = observableValue('model', customChatMode.model);
		this._argumentHintObservable = observableValue('argumentHint', customChatMode.argumentHint);
		this._handoffsObservable = observableValue('handOffs', customChatMode.handOffs);
		this._targetObservable = observableValue('target', customChatMode.target);
		this._inferObservable = observableValue('infer', customChatMode.infer);
		this._modeInstructions = observableValue('_modeInstructions', customChatMode.agentInstructions);
		this._uriObservable = observableValue('uri', customChatMode.uri);
		this._source = customChatMode.source;
	}

	/**
	 * Updates the underlying data and triggers observable changes
	 */
	updateData(newData: ICustomAgent): void {
		transaction(tx => {
			this._nameObservable.set(newData.name, tx);
			this._descriptionObservable.set(newData.description, tx);
			this._customToolsObservable.set(newData.tools, tx);
			this._modelObservable.set(newData.model, tx);
			this._argumentHintObservable.set(newData.argumentHint, tx);
			this._handoffsObservable.set(newData.handOffs, tx);
			this._targetObservable.set(newData.target, tx);
			this._inferObservable.set(newData.infer, tx);
			this._modeInstructions.set(newData.agentInstructions, tx);
			this._uriObservable.set(newData.uri, tx);
			this._source = newData.source;
		});
	}

	toJSON(): IChatModeData {
		return {
			id: this.id,
			name: this.name.get(),
			description: this.description.get(),
			kind: this.kind,
			customTools: this.customTools.get(),
			model: this.model.get(),
			argumentHint: this.argumentHint.get(),
			modeInstructions: this.modeInstructions.get(),
			uri: this.uri.get(),
			handOffs: this.handOffs.get(),
			source: serializeChatModeSource(this._source),
			target: this.target.get(),
			infer: this.infer.get()
		};
	}
}

type IChatModeSourceData =
	| { readonly storage: PromptsStorage.extension; readonly extensionId: string; type?: ExtensionAgentSourceType }
	| { readonly storage: PromptsStorage.local | PromptsStorage.user };

function isChatModeSourceData(value: unknown): value is IChatModeSourceData {
	if (typeof value !== 'object' || value === null) {
		return false;
	}
	const data = value as { storage?: unknown; extensionId?: unknown };
	if (data.storage === PromptsStorage.extension) {
		return typeof data.extensionId === 'string';
	}
	return data.storage === PromptsStorage.local || data.storage === PromptsStorage.user;
}

function serializeChatModeSource(source: IAgentSource | undefined): IChatModeSourceData | undefined {
	if (!source) {
		return undefined;
	}
	if (source.storage === PromptsStorage.extension) {
		return { storage: PromptsStorage.extension, extensionId: source.extensionId.value, type: source.type };
	}
	return { storage: source.storage };
}

function reviveChatModeSource(data: IChatModeSourceData | undefined): IAgentSource | undefined {
	if (!data) {
		return undefined;
	}
	if (data.storage === PromptsStorage.extension) {
		return { storage: PromptsStorage.extension, extensionId: new ExtensionIdentifier(data.extensionId), type: data.type ?? ExtensionAgentSourceType.contribution };
	}
	return { storage: data.storage };
}

export class BuiltinChatMode implements IChatMode {
	public readonly name: IObservable<string>;
	public readonly label: IObservable<string>;
	public readonly description: IObservable<string>;

	constructor(
		public readonly kind: ChatModeKind,
		label: string,
		description: string
	) {
		this.name = constObservable(kind);
		this.label = constObservable(label);
		this.description = observableValue('description', description);
	}

	public get isBuiltin(): boolean {
		return isBuiltinChatMode(this);
	}

	get id(): string {
		// Need a differentiator?
		return this.kind;
	}

	get target(): IObservable<string | undefined> {
		return observableValue('target', undefined);
	}

	/**
	 * Getters are not json-stringified
	 */
	toJSON(): IChatModeData {
		return {
			id: this.id,
			name: this.name.get(),
			description: this.description.get(),
			kind: this.kind
		};
	}
}

export namespace ChatMode {
	export const Ask = new BuiltinChatMode(ChatModeKind.Ask, 'Ask', localize('chatDescription', "Explore and understand your code"));
	export const Edit = new BuiltinChatMode(ChatModeKind.Edit, 'Edit', localize('editsDescription', "Edit or refactor selected code"));
	export const Agent = new BuiltinChatMode(ChatModeKind.Agent, 'Agent', localize('agentDescription', "Describe what to build next"));
}

export function isBuiltinChatMode(mode: IChatMode): boolean {
	return mode.id === ChatMode.Ask.id ||
		mode.id === ChatMode.Edit.id ||
		mode.id === ChatMode.Agent.id;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatParserTypes.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatParserTypes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { revive } from '../../../../base/common/marshalling.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IOffsetRange, OffsetRange } from '../../../../editor/common/core/ranges/offsetRange.js';
import { IRange } from '../../../../editor/common/core/range.js';
import { IChatAgentCommand, IChatAgentData, IChatAgentService, reviveSerializedAgent } from './chatAgents.js';
import { IChatSlashData } from './chatSlashCommands.js';
import { IChatRequestProblemsVariable, IChatRequestVariableValue } from './chatVariables.js';
import { ChatAgentLocation } from './constants.js';
import { IToolData } from './languageModelToolsService.js';
import { IChatRequestToolEntry, IChatRequestToolSetEntry, IChatRequestVariableEntry, IDiagnosticVariableEntryFilterData } from './chatVariableEntries.js';

// These are in a separate file to avoid circular dependencies with the dependencies of the parser

export interface IParsedChatRequest {
	readonly parts: ReadonlyArray<IParsedChatRequestPart>;
	readonly text: string;
}

export interface IParsedChatRequestPart {
	readonly kind: string; // for serialization
	readonly range: IOffsetRange;
	readonly editorRange: IRange;
	readonly text: string;
	/** How this part is represented in the prompt going to the agent */
	readonly promptText: string;
}

export function getPromptText(request: IParsedChatRequest): { message: string; diff: number } {
	const message = request.parts.map(r => r.promptText).join('').trimStart();
	const diff = request.text.length - message.length;

	return { message, diff };
}

export class ChatRequestTextPart implements IParsedChatRequestPart {
	static readonly Kind = 'text';
	readonly kind = ChatRequestTextPart.Kind;
	constructor(readonly range: OffsetRange, readonly editorRange: IRange, readonly text: string) { }

	get promptText(): string {
		return this.text;
	}
}

// warning, these also show up in a regex in the parser
export const chatVariableLeader = '#';
export const chatAgentLeader = '@';
export const chatSubcommandLeader = '/';

/**
 * An invocation of a static variable that can be resolved by the variable service
 * @deprecated, but kept for backwards compatibility with old persisted chat requests
 */
class ChatRequestVariablePart implements IParsedChatRequestPart {
	static readonly Kind = 'var';
	readonly kind = ChatRequestVariablePart.Kind;
	constructor(readonly range: OffsetRange, readonly editorRange: IRange, readonly variableName: string, readonly variableArg: string, readonly variableId: string) { }

	get text(): string {
		const argPart = this.variableArg ? `:${this.variableArg}` : '';
		return `${chatVariableLeader}${this.variableName}${argPart}`;
	}

	get promptText(): string {
		return this.text;
	}
}

/**
 * An invocation of a tool
 */
export class ChatRequestToolPart implements IParsedChatRequestPart {
	static readonly Kind = 'tool';
	readonly kind = ChatRequestToolPart.Kind;
	constructor(readonly range: OffsetRange, readonly editorRange: IRange, readonly toolName: string, readonly toolId: string, readonly displayName?: string, readonly icon?: IToolData['icon']) { }

	get text(): string {
		return `${chatVariableLeader}${this.toolName}`;
	}

	get promptText(): string {
		return this.text;
	}

	toVariableEntry(): IChatRequestToolEntry {
		return { kind: 'tool', id: this.toolId, name: this.toolName, range: this.range, value: undefined, icon: ThemeIcon.isThemeIcon(this.icon) ? this.icon : undefined, fullName: this.displayName };
	}
}

/**
 * An invocation of a tool
 */
export class ChatRequestToolSetPart implements IParsedChatRequestPart {
	static readonly Kind = 'toolset';
	readonly kind = ChatRequestToolSetPart.Kind;
	constructor(readonly range: OffsetRange, readonly editorRange: IRange, readonly id: string, readonly name: string, readonly icon: ThemeIcon, readonly tools: IChatRequestToolEntry[]) { }

	get text(): string {
		return `${chatVariableLeader}${this.name}`;
	}

	get promptText(): string {
		return this.text;
	}

	toVariableEntry(): IChatRequestToolSetEntry {
		return { kind: 'toolset', id: this.id, name: this.name, range: this.range, icon: this.icon, value: this.tools };
	}
}

/**
 * An invocation of an agent that can be resolved by the agent service
 */
export class ChatRequestAgentPart implements IParsedChatRequestPart {
	static readonly Kind = 'agent';
	readonly kind = ChatRequestAgentPart.Kind;
	constructor(readonly range: OffsetRange, readonly editorRange: IRange, readonly agent: IChatAgentData) { }

	get text(): string {

		return `${chatAgentLeader}${this.agent.name}`;
	}

	get promptText(): string {
		return '';
	}
}

/**
 * An invocation of an agent's subcommand
 */
export class ChatRequestAgentSubcommandPart implements IParsedChatRequestPart {
	static readonly Kind = 'subcommand';
	readonly kind = ChatRequestAgentSubcommandPart.Kind;
	constructor(readonly range: OffsetRange, readonly editorRange: IRange, readonly command: IChatAgentCommand) { }

	get text(): string {
		return `${chatSubcommandLeader}${this.command.name}`;
	}

	get promptText(): string {
		return '';
	}
}

/**
 * An invocation of a standalone slash command
 */
export class ChatRequestSlashCommandPart implements IParsedChatRequestPart {
	static readonly Kind = 'slash';
	readonly kind = ChatRequestSlashCommandPart.Kind;
	constructor(readonly range: OffsetRange, readonly editorRange: IRange, readonly slashCommand: IChatSlashData) { }

	get text(): string {
		return `${chatSubcommandLeader}${this.slashCommand.command}`;
	}

	get promptText(): string {
		return `${chatSubcommandLeader}${this.slashCommand.command}`;
	}
}

/**
 * An invocation of a standalone slash command
 */
export class ChatRequestSlashPromptPart implements IParsedChatRequestPart {
	static readonly Kind = 'prompt';
	readonly kind = ChatRequestSlashPromptPart.Kind;
	constructor(readonly range: OffsetRange, readonly editorRange: IRange, readonly name: string) { }

	get text(): string {
		return `${chatSubcommandLeader}${this.name}`;
	}

	get promptText(): string {
		return `${chatSubcommandLeader}${this.name}`;
	}
}

/**
 * An invocation of a dynamic reference like '#file:'
 */
export class ChatRequestDynamicVariablePart implements IParsedChatRequestPart {
	static readonly Kind = 'dynamic';
	readonly kind = ChatRequestDynamicVariablePart.Kind;
	constructor(readonly range: OffsetRange, readonly editorRange: IRange, readonly text: string, readonly id: string, readonly modelDescription: string | undefined, readonly data: IChatRequestVariableValue, readonly fullName?: string, readonly icon?: ThemeIcon, readonly isFile?: boolean, readonly isDirectory?: boolean) { }

	get referenceText(): string {
		return this.text.replace(chatVariableLeader, '');
	}

	get promptText(): string {
		return this.text;
	}

	toVariableEntry(): IChatRequestVariableEntry {
		if (this.id === 'vscode.problems') {
			return IDiagnosticVariableEntryFilterData.toEntry((this.data as IChatRequestProblemsVariable).filter);
		}

		return { kind: this.isDirectory ? 'directory' : this.isFile ? 'file' : 'generic', id: this.id, name: this.referenceText, range: this.range, value: this.data, fullName: this.fullName, icon: this.icon };
	}
}

export function reviveParsedChatRequest(serialized: IParsedChatRequest): IParsedChatRequest {
	return {
		text: serialized.text,
		parts: serialized.parts.map(part => {
			if (part.kind === ChatRequestTextPart.Kind) {
				return new ChatRequestTextPart(
					new OffsetRange(part.range.start, part.range.endExclusive),
					part.editorRange,
					part.text
				);
			} else if (part.kind === ChatRequestVariablePart.Kind) {
				return new ChatRequestVariablePart(
					new OffsetRange(part.range.start, part.range.endExclusive),
					part.editorRange,
					(part as ChatRequestVariablePart).variableName,
					(part as ChatRequestVariablePart).variableArg,
					(part as ChatRequestVariablePart).variableId || '',
				);
			} else if (part.kind === ChatRequestToolPart.Kind) {
				return new ChatRequestToolPart(
					new OffsetRange(part.range.start, part.range.endExclusive),
					part.editorRange,
					(part as ChatRequestToolPart).toolName,
					(part as ChatRequestToolPart).toolId,
					(part as ChatRequestToolPart).displayName,
					(part as ChatRequestToolPart).icon,
				);
			} else if (part.kind === ChatRequestToolSetPart.Kind) {
				return new ChatRequestToolSetPart(
					new OffsetRange(part.range.start, part.range.endExclusive),
					part.editorRange,
					(part as ChatRequestToolSetPart).id,
					(part as ChatRequestToolSetPart).name,
					(part as ChatRequestToolSetPart).icon,
					(part as ChatRequestToolSetPart).tools ?? [],
				);
			} else if (part.kind === ChatRequestAgentPart.Kind) {
				let agent = (part as ChatRequestAgentPart).agent;
				agent = reviveSerializedAgent(agent);

				return new ChatRequestAgentPart(
					new OffsetRange(part.range.start, part.range.endExclusive),
					part.editorRange,
					agent
				);
			} else if (part.kind === ChatRequestAgentSubcommandPart.Kind) {
				return new ChatRequestAgentSubcommandPart(
					new OffsetRange(part.range.start, part.range.endExclusive),
					part.editorRange,
					(part as ChatRequestAgentSubcommandPart).command
				);
			} else if (part.kind === ChatRequestSlashCommandPart.Kind) {
				return new ChatRequestSlashCommandPart(
					new OffsetRange(part.range.start, part.range.endExclusive),
					part.editorRange,
					(part as ChatRequestSlashCommandPart).slashCommand
				);
			} else if (part.kind === ChatRequestSlashPromptPart.Kind) {
				return new ChatRequestSlashPromptPart(
					new OffsetRange(part.range.start, part.range.endExclusive),
					part.editorRange,
					(part as ChatRequestSlashPromptPart).name
				);
			} else if (part.kind === ChatRequestDynamicVariablePart.Kind) {
				return new ChatRequestDynamicVariablePart(
					new OffsetRange(part.range.start, part.range.endExclusive),
					part.editorRange,
					(part as ChatRequestDynamicVariablePart).text,
					(part as ChatRequestDynamicVariablePart).id,
					(part as ChatRequestDynamicVariablePart).modelDescription,
					revive((part as ChatRequestDynamicVariablePart).data),
					(part as ChatRequestDynamicVariablePart).fullName,
					(part as ChatRequestDynamicVariablePart).icon,
					(part as ChatRequestDynamicVariablePart).isFile,
					(part as ChatRequestDynamicVariablePart).isDirectory
				);
			} else {
				throw new Error(`Unknown chat request part: ${part.kind}`);
			}
		})
	};
}

export function extractAgentAndCommand(parsed: IParsedChatRequest): { agentPart: ChatRequestAgentPart | undefined; commandPart: ChatRequestAgentSubcommandPart | undefined } {
	const agentPart = parsed.parts.find((r): r is ChatRequestAgentPart => r instanceof ChatRequestAgentPart);
	const commandPart = parsed.parts.find((r): r is ChatRequestAgentSubcommandPart => r instanceof ChatRequestAgentSubcommandPart);
	return { agentPart, commandPart };
}

export function formatChatQuestion(chatAgentService: IChatAgentService, location: ChatAgentLocation, prompt: string, participant: string | null = null, command: string | null = null): string | undefined {
	let question = '';
	if (participant && participant !== chatAgentService.getDefaultAgent(location)?.id) {
		const agent = chatAgentService.getAgent(participant);
		if (!agent) {
			// Refers to agent that doesn't exist
			return undefined;
		}

		question += `${chatAgentLeader}${agent.name} `;
		if (command) {
			question += `${chatSubcommandLeader}${command} `;
		}
	}
	return question + prompt;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatParticipantContribTypes.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatParticipantContribTypes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ChatModeKind, RawChatParticipantLocation } from './constants.js';

export interface IRawChatCommandContribution {
	name: string;
	description: string;
	sampleRequest?: string;
	isSticky?: boolean;
	when?: string;
	disambiguation?: { category: string; categoryName?: string /** Deprecated */; description: string; examples: string[] }[];
}

export interface IRawChatParticipantContribution {
	id: string;
	name: string;
	fullName: string;
	when?: string;
	description?: string;
	isDefault?: boolean;
	isSticky?: boolean;
	sampleRequest?: string;
	commands?: IRawChatCommandContribution[];
	locations?: RawChatParticipantLocation[];
	/**
	 * Valid for default participants in 'panel' location
	 */
	modes?: ChatModeKind[];
	disambiguation?: { category: string; categoryName?: string /** Deprecated */; description: string; examples: string[] }[];
}

/**
 * Hardcoding the previous id of the Copilot Chat provider to avoid breaking view locations, persisted data, etc.
 * DON'T use this for any new data, only for old persisted data.
 * @deprecated
 */
export const CHAT_PROVIDER_ID = 'copilot';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatRequestParser.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatRequestParser.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { IPosition, Position } from '../../../../editor/common/core/position.js';
import { Range } from '../../../../editor/common/core/range.js';
import { OffsetRange } from '../../../../editor/common/core/ranges/offsetRange.js';
import { IChatAgentData, IChatAgentService } from './chatAgents.js';
import { ChatRequestAgentPart, ChatRequestAgentSubcommandPart, ChatRequestDynamicVariablePart, ChatRequestSlashCommandPart, ChatRequestSlashPromptPart, ChatRequestTextPart, ChatRequestToolPart, ChatRequestToolSetPart, IParsedChatRequest, IParsedChatRequestPart, chatAgentLeader, chatSubcommandLeader, chatVariableLeader } from './chatParserTypes.js';
import { IChatSlashCommandService } from './chatSlashCommands.js';
import { IChatVariablesService, IDynamicVariable } from './chatVariables.js';
import { ChatAgentLocation, ChatModeKind } from './constants.js';
import { IToolData, ToolSet } from './languageModelToolsService.js';
import { IPromptsService } from './promptSyntax/service/promptsService.js';

const agentReg = /^@([\w_\-\.]+)(?=(\s|$|\b))/i; // An @-agent
const variableReg = /^#([\w_\-]+)(:\d+)?(?=(\s|$|\b))/i; // A #-variable with an optional numeric : arg (@response:2)
const slashReg = /^\/([\p{L}\d_\-\.:]+)(?=(\s|$|\b))/iu; // A / command

export interface IChatParserContext {
	/** Used only as a disambiguator, when the query references an agent that has a duplicate with the same name. */
	selectedAgent?: IChatAgentData;
	mode?: ChatModeKind;
	/** Parse as this agent, even when it does not appear in the query text */
	forcedAgent?: IChatAgentData;
}

export class ChatRequestParser {
	constructor(
		@IChatAgentService private readonly agentService: IChatAgentService,
		@IChatVariablesService private readonly variableService: IChatVariablesService,
		@IChatSlashCommandService private readonly slashCommandService: IChatSlashCommandService,
		@IPromptsService private readonly promptsService: IPromptsService,
	) { }

	parseChatRequest(sessionResource: URI, message: string, location: ChatAgentLocation = ChatAgentLocation.Chat, context?: IChatParserContext): IParsedChatRequest {
		const parts: IParsedChatRequestPart[] = [];
		const references = this.variableService.getDynamicVariables(sessionResource); // must access this list before any async calls
		const toolsByName = new Map<string, IToolData>();
		const toolSetsByName = new Map<string, ToolSet>();
		for (const [entry, enabled] of this.variableService.getSelectedToolAndToolSets(sessionResource)) {
			if (enabled) {
				if (entry instanceof ToolSet) {
					toolSetsByName.set(entry.referenceName, entry);
				} else {
					toolsByName.set(entry.toolReferenceName ?? entry.displayName, entry);
				}
			}
		}

		let lineNumber = 1;
		let column = 1;
		for (let i = 0; i < message.length; i++) {
			const previousChar = message.charAt(i - 1);
			const char = message.charAt(i);
			let newPart: IParsedChatRequestPart | undefined;
			if (previousChar.match(/\s/) || i === 0) {
				if (char === chatVariableLeader) {
					newPart = this.tryToParseVariable(message.slice(i), i, new Position(lineNumber, column), parts, toolsByName, toolSetsByName);
				} else if (char === chatAgentLeader) {
					newPart = this.tryToParseAgent(message.slice(i), message, i, new Position(lineNumber, column), parts, location, context);
				} else if (char === chatSubcommandLeader) {
					newPart = this.tryToParseSlashCommand(message.slice(i), message, i, new Position(lineNumber, column), parts, location, context);
				}

				if (!newPart) {
					newPart = this.tryToParseDynamicVariable(message.slice(i), i, new Position(lineNumber, column), references);
				}
			}

			if (newPart) {
				if (i !== 0) {
					// Insert a part for all the text we passed over, then insert the new parsed part
					const previousPart = parts.at(-1);
					const previousPartEnd = previousPart?.range.endExclusive ?? 0;
					const previousPartEditorRangeEndLine = previousPart?.editorRange.endLineNumber ?? 1;
					const previousPartEditorRangeEndCol = previousPart?.editorRange.endColumn ?? 1;
					parts.push(new ChatRequestTextPart(
						new OffsetRange(previousPartEnd, i),
						new Range(previousPartEditorRangeEndLine, previousPartEditorRangeEndCol, lineNumber, column),
						message.slice(previousPartEnd, i)));
				}

				parts.push(newPart);
			}

			if (char === '\n') {
				lineNumber++;
				column = 1;
			} else {
				column++;
			}
		}

		const lastPart = parts.at(-1);
		const lastPartEnd = lastPart?.range.endExclusive ?? 0;
		if (lastPartEnd < message.length) {
			parts.push(new ChatRequestTextPart(
				new OffsetRange(lastPartEnd, message.length),
				new Range(lastPart?.editorRange.endLineNumber ?? 1, lastPart?.editorRange.endColumn ?? 1, lineNumber, column),
				message.slice(lastPartEnd, message.length)));
		}

		return {
			parts,
			text: message,
		};
	}

	private tryToParseAgent(message: string, fullMessage: string, offset: number, position: IPosition, parts: Array<IParsedChatRequestPart>, location: ChatAgentLocation, context: IChatParserContext | undefined): ChatRequestAgentPart | undefined {
		const nextAgentMatch = message.match(agentReg);
		if (!nextAgentMatch) {
			return;
		}

		const [full, name] = nextAgentMatch;
		const agentRange = new OffsetRange(offset, offset + full.length);
		const agentEditorRange = new Range(position.lineNumber, position.column, position.lineNumber, position.column + full.length);

		let agents = this.agentService.getAgentsByName(name);
		if (!agents.length) {
			const fqAgent = this.agentService.getAgentByFullyQualifiedId(name);
			if (fqAgent) {
				agents = [fqAgent];
			}
		}

		// If there is more than one agent with this name, and the user picked it from the suggest widget, then the selected agent should be in the
		// context and we use that one.
		const agent = agents.length > 1 && context?.selectedAgent ?
			context.selectedAgent :
			agents.find((a) => a.locations.includes(location));
		if (!agent) {
			return;
		}

		if (context?.mode && !agent.modes.includes(context.mode)) {
			return;
		}

		if (parts.some(p => p instanceof ChatRequestAgentPart)) {
			// Only one agent allowed
			return;
		}

		// The agent must come first
		if (parts.some(p => (p instanceof ChatRequestTextPart && p.text.trim() !== '') || !(p instanceof ChatRequestAgentPart))) {
			return;
		}

		const previousPart = parts.at(-1);
		const previousPartEnd = previousPart?.range.endExclusive ?? 0;
		const textSincePreviousPart = fullMessage.slice(previousPartEnd, offset);
		if (textSincePreviousPart.trim() !== '') {
			return;
		}

		return new ChatRequestAgentPart(agentRange, agentEditorRange, agent);
	}

	private tryToParseVariable(message: string, offset: number, position: IPosition, parts: ReadonlyArray<IParsedChatRequestPart>, toolsByName: ReadonlyMap<string, IToolData>, toolSetsByName: ReadonlyMap<string, ToolSet>): ChatRequestToolPart | ChatRequestToolSetPart | undefined {
		const nextVariableMatch = message.match(variableReg);
		if (!nextVariableMatch) {
			return;
		}

		const [full, name] = nextVariableMatch;
		const varRange = new OffsetRange(offset, offset + full.length);
		const varEditorRange = new Range(position.lineNumber, position.column, position.lineNumber, position.column + full.length);

		const tool = toolsByName.get(name);
		if (tool) {
			return new ChatRequestToolPart(varRange, varEditorRange, name, tool.id, tool.displayName, tool.icon);
		}

		const toolset = toolSetsByName.get(name);
		if (toolset) {
			const value = Array.from(toolset.getTools()).map(t => new ChatRequestToolPart(varRange, varEditorRange, t.toolReferenceName ?? t.displayName, t.id, t.displayName, t.icon).toVariableEntry());
			return new ChatRequestToolSetPart(varRange, varEditorRange, toolset.id, toolset.referenceName, toolset.icon, value);
		}

		return;
	}

	private tryToParseSlashCommand(remainingMessage: string, fullMessage: string, offset: number, position: IPosition, parts: ReadonlyArray<IParsedChatRequestPart>, location: ChatAgentLocation, context?: IChatParserContext): ChatRequestSlashCommandPart | ChatRequestAgentSubcommandPart | ChatRequestSlashPromptPart | undefined {
		const nextSlashMatch = remainingMessage.match(slashReg);
		if (!nextSlashMatch) {
			return;
		}

		if (parts.some(p => !(p instanceof ChatRequestAgentPart) && !(p instanceof ChatRequestTextPart && p.text.trim() === ''))) {
			// no other part than agent or non-whitespace text allowed: that also means no other slash command
			return;
		}

		// only whitespace after the last part
		const previousPart = parts.at(-1);
		const previousPartEnd = previousPart?.range.endExclusive ?? 0;
		const textSincePreviousPart = fullMessage.slice(previousPartEnd, offset);
		if (textSincePreviousPart.trim() !== '') {
			return;
		}

		const [full, command] = nextSlashMatch;
		const slashRange = new OffsetRange(offset, offset + full.length);
		const slashEditorRange = new Range(position.lineNumber, position.column, position.lineNumber, position.column + full.length);

		const usedAgent = parts.find((p): p is ChatRequestAgentPart => p instanceof ChatRequestAgentPart)?.agent ??
			(context?.forcedAgent ? context.forcedAgent : undefined);
		if (usedAgent) {
			const subCommand = usedAgent.slashCommands.find(c => c.name === command);
			if (subCommand) {
				// Valid agent subcommand
				return new ChatRequestAgentSubcommandPart(slashRange, slashEditorRange, subCommand);
			}
		} else {
			const slashCommands = this.slashCommandService.getCommands(location, context?.mode ?? ChatModeKind.Ask);
			const slashCommand = slashCommands.find(c => c.command === command);
			if (slashCommand) {
				// Valid standalone slash command
				return new ChatRequestSlashCommandPart(slashRange, slashEditorRange, slashCommand);
			} else {
				// check for with default agent for this location
				const defaultAgent = this.agentService.getDefaultAgent(location, context?.mode);
				const subCommand = defaultAgent?.slashCommands.find(c => c.name === command);
				if (subCommand) {
					// Valid default agent subcommand
					return new ChatRequestAgentSubcommandPart(slashRange, slashEditorRange, subCommand);
				}
			}

			// if there's no agent, asume it is a prompt slash command
			const isPromptCommand = this.promptsService.isValidSlashCommandName(command);
			if (isPromptCommand) {
				return new ChatRequestSlashPromptPart(slashRange, slashEditorRange, command);
			}
		}
		return;
	}

	private tryToParseDynamicVariable(message: string, offset: number, position: IPosition, references: ReadonlyArray<IDynamicVariable>): ChatRequestDynamicVariablePart | undefined {
		const refAtThisPosition = references.find(r =>
			r.range.startLineNumber === position.lineNumber &&
			r.range.startColumn === position.column);
		if (refAtThisPosition) {
			const length = refAtThisPosition.range.endColumn - refAtThisPosition.range.startColumn;
			const text = message.substring(0, length);
			const range = new OffsetRange(offset, offset + length);
			return new ChatRequestDynamicVariablePart(range, refAtThisPosition.range, text, refAtThisPosition.id, refAtThisPosition.modelDescription, refAtThisPosition.data, refAtThisPosition.fullName, refAtThisPosition.icon, refAtThisPosition.isFile, refAtThisPosition.isDirectory);
		}

		return;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatResponseResourceFileSystemProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatResponseResourceFileSystemProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { decodeBase64, VSBuffer } from '../../../../base/common/buffer.js';
import { Event } from '../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { newWriteableStream, ReadableStreamEvents } from '../../../../base/common/stream.js';
import { URI } from '../../../../base/common/uri.js';
import { createFileSystemProviderError, FileSystemProviderCapabilities, FileSystemProviderErrorCode, FileType, IFileService, IFileSystemProviderWithFileAtomicReadCapability, IFileSystemProviderWithFileReadStreamCapability, IFileSystemProviderWithFileReadWriteCapability, IStat } from '../../../../platform/files/common/files.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { ChatResponseResource } from './chatModel.js';
import { IChatService, IChatToolInvocation, IChatToolInvocationSerialized } from './chatService.js';
import { isToolResultInputOutputDetails } from './languageModelToolsService.js';

export class ChatResponseResourceFileSystemProvider extends Disposable implements
	IWorkbenchContribution,
	IFileSystemProviderWithFileReadWriteCapability,
	IFileSystemProviderWithFileAtomicReadCapability,
	IFileSystemProviderWithFileReadStreamCapability {

	public static readonly ID = 'workbench.contrib.chatResponseResourceFileSystemProvider';

	public readonly onDidChangeCapabilities = Event.None;
	public readonly onDidChangeFile = Event.None;

	public readonly capabilities: FileSystemProviderCapabilities = FileSystemProviderCapabilities.None
		| FileSystemProviderCapabilities.Readonly
		| FileSystemProviderCapabilities.PathCaseSensitive
		| FileSystemProviderCapabilities.FileReadStream
		| FileSystemProviderCapabilities.FileAtomicRead
		| FileSystemProviderCapabilities.FileReadWrite;

	constructor(
		@IChatService private readonly chatService: IChatService,
		@IFileService private readonly _fileService: IFileService
	) {
		super();
		this._register(this._fileService.registerProvider(ChatResponseResource.scheme, this));
	}

	readFile(resource: URI): Promise<Uint8Array> {
		return Promise.resolve(this.lookupURI(resource));
	}

	readFileStream(resource: URI): ReadableStreamEvents<Uint8Array> {
		const stream = newWriteableStream<Uint8Array>(data => VSBuffer.concat(data.map(data => VSBuffer.wrap(data))).buffer);
		Promise.resolve(this.lookupURI(resource)).then(v => stream.end(v));
		return stream;
	}

	async stat(resource: URI): Promise<IStat> {
		const r = await this.lookupURI(resource);
		return {
			type: FileType.File,
			ctime: 0,
			mtime: 0,
			size: r.length,
		};
	}

	delete(): Promise<void> {
		throw createFileSystemProviderError('fs is readonly', FileSystemProviderErrorCode.NoPermissions);
	}

	watch(): IDisposable {
		return Disposable.None;
	}

	mkdir(): Promise<void> {
		throw createFileSystemProviderError('fs is readonly', FileSystemProviderErrorCode.NoPermissions);
	}

	readdir(): Promise<[string, FileType][]> {
		return Promise.resolve([]);
	}

	rename(): Promise<void> {
		throw createFileSystemProviderError('fs is readonly', FileSystemProviderErrorCode.NoPermissions);
	}

	writeFile(): Promise<void> {
		throw createFileSystemProviderError('fs is readonly', FileSystemProviderErrorCode.NoPermissions);
	}

	private findMatchingInvocation(uri: URI) {
		const parsed = ChatResponseResource.parseUri(uri);
		if (!parsed) {
			throw createFileSystemProviderError(`File not found`, FileSystemProviderErrorCode.FileNotFound);
		}
		const { sessionResource, toolCallId, index } = parsed;
		const session = this.chatService.getSession(sessionResource);
		if (!session) {
			throw createFileSystemProviderError(`File not found`, FileSystemProviderErrorCode.FileNotFound);
		}

		const requests = session.getRequests();
		for (let k = requests.length - 1; k >= 0; k--) {
			const req = requests[k];
			const tc = req.response?.entireResponse.value.find((r): r is IChatToolInvocation | IChatToolInvocationSerialized => (r.kind === 'toolInvocation' || r.kind === 'toolInvocationSerialized') && r.toolCallId === toolCallId);
			if (tc) {
				return { result: tc, index };
			}
		}

		throw createFileSystemProviderError(`File not found`, FileSystemProviderErrorCode.FileNotFound);
	}

	private lookupURI(uri: URI): Uint8Array | Promise<Uint8Array> {
		const { result, index } = this.findMatchingInvocation(uri);
		const details = IChatToolInvocation.resultDetails(result);
		if (!isToolResultInputOutputDetails(details)) {
			throw createFileSystemProviderError(`Tool does not have I/O`, FileSystemProviderErrorCode.FileNotFound);
		}

		const part = details.output.at(index);
		if (!part) {
			throw createFileSystemProviderError(`Tool does not have part`, FileSystemProviderErrorCode.FileNotFound);
		}

		if (part.type === 'ref') {
			return this._fileService.readFile(part.uri).then(r => r.value.buffer);
		}

		return part.isText ? new TextEncoder().encode(part.value) : decodeBase64(part.value).buffer;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAction } from '../../../../base/common/actions.js';
import { DeferredPromise } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { DisposableStore, IReference } from '../../../../base/common/lifecycle.js';
import { autorun, autorunSelfDisposable, IObservable, IReader } from '../../../../base/common/observable.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { hasKey } from '../../../../base/common/types.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { IRange, Range } from '../../../../editor/common/core/range.js';
import { ISelection } from '../../../../editor/common/core/selection.js';
import { Command, Location, TextEdit } from '../../../../editor/common/languages.js';
import { FileType } from '../../../../platform/files/common/files.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IAutostartResult } from '../../mcp/common/mcpTypes.js';
import { ICellEditOperation } from '../../notebook/common/notebookCommon.js';
import { IWorkspaceSymbol } from '../../search/common/search.js';
import { IChatAgentCommand, IChatAgentData, IChatAgentResult, UserSelectedTools } from './chatAgents.js';
import { IChatEditingSession } from './chatEditingService.js';
import { IChatModel, IChatModelInputState, IChatRequestModeInfo, IChatRequestModel, IChatRequestVariableData, IChatResponseModel, IExportableChatData, ISerializableChatData } from './chatModel.js';
import { IParsedChatRequest } from './chatParserTypes.js';
import { IChatParserContext } from './chatRequestParser.js';
import { IChatRequestVariableEntry } from './chatVariableEntries.js';
import { IChatRequestVariableValue } from './chatVariables.js';
import { ChatAgentLocation } from './constants.js';
import { IPreparedToolInvocation, IToolConfirmationMessages, IToolResult, IToolResultInputOutputDetails, ToolDataSource } from './languageModelToolsService.js';

export interface IChatRequest {
	message: string;
	variables: Record<string, IChatRequestVariableValue[]>;
}

export enum ChatErrorLevel {
	Info = 0,
	Warning = 1,
	Error = 2
}

export interface IChatResponseErrorDetailsConfirmationButton {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
	label: string;
	isSecondary?: boolean;
}

export interface IChatResponseErrorDetails {
	message: string;
	responseIsIncomplete?: boolean;
	responseIsFiltered?: boolean;
	responseIsRedacted?: boolean;
	isQuotaExceeded?: boolean;
	isRateLimited?: boolean;
	level?: ChatErrorLevel;
	confirmationButtons?: IChatResponseErrorDetailsConfirmationButton[];
	code?: string;
}

export interface IChatResponseProgressFileTreeData {
	label: string;
	uri: URI;
	type?: FileType;
	children?: IChatResponseProgressFileTreeData[];
}

export type IDocumentContext = {
	uri: URI;
	version: number;
	ranges: IRange[];
};

export function isIDocumentContext(obj: unknown): obj is IDocumentContext {
	return (
		!!obj &&
		typeof obj === 'object' &&
		'uri' in obj && obj.uri instanceof URI &&
		'version' in obj && typeof obj.version === 'number' &&
		'ranges' in obj && Array.isArray(obj.ranges) && obj.ranges.every(Range.isIRange)
	);
}

export interface IChatUsedContext {
	documents: IDocumentContext[];
	kind: 'usedContext';
}

export function isIUsedContext(obj: unknown): obj is IChatUsedContext {
	return (
		!!obj &&
		typeof obj === 'object' &&
		'documents' in obj &&
		Array.isArray(obj.documents) &&
		obj.documents.every(isIDocumentContext)
	);
}

export interface IChatContentVariableReference {
	variableName: string;
	value?: URI | Location;
}

export enum ChatResponseReferencePartStatusKind {
	Complete = 1,
	Partial = 2,
	Omitted = 3
}

export enum ChatResponseClearToPreviousToolInvocationReason {
	NoReason = 0,
	FilteredContentRetry = 1,
	CopyrightContentRetry = 2,
}

export interface IChatContentReference {
	reference: URI | Location | IChatContentVariableReference | string;
	iconPath?: ThemeIcon | { light: URI; dark?: URI };
	options?: {
		status?: { description: string; kind: ChatResponseReferencePartStatusKind };
		diffMeta?: { added: number; removed: number };
		originalUri?: URI;
	};
	kind: 'reference';
}

export interface IChatCodeCitation {
	value: URI;
	license: string;
	snippet: string;
	kind: 'codeCitation';
}

export interface IChatContentInlineReference {
	resolveId?: string;
	inlineReference: URI | Location | IWorkspaceSymbol;
	name?: string;
	kind: 'inlineReference';
}

export interface IChatMarkdownContent {
	kind: 'markdownContent';
	content: IMarkdownString;
	inlineReferences?: Record<string, IChatContentInlineReference>;
	fromSubagent?: boolean;
}

export interface IChatTreeData {
	treeData: IChatResponseProgressFileTreeData;
	kind: 'treeData';
}
export interface IMultiDiffResource {
	originalUri?: URI;
	modifiedUri?: URI;
	goToFileUri?: URI;
	added?: number;
	removed?: number;
}

export interface IChatMultiDiffInnerData {
	title: string;
	resources: IMultiDiffResource[];
}

export interface IChatMultiDiffData {
	multiDiffData: IChatMultiDiffInnerData | IObservable<IChatMultiDiffInnerData>;
	kind: 'multiDiffData';
	collapsed?: boolean;
	readOnly?: boolean;
}

export interface IChatMultiDiffDataSerialized {
	multiDiffData: IChatMultiDiffInnerData;
	kind: 'multiDiffData';
	collapsed?: boolean;
	readOnly?: boolean;
}

export class ChatMultiDiffData implements IChatMultiDiffData {
	public readonly kind = 'multiDiffData';
	public readonly collapsed?: boolean | undefined;
	public readonly readOnly?: boolean | undefined;
	public readonly multiDiffData: IChatMultiDiffData['multiDiffData'];

	constructor(opts: {
		multiDiffData: IChatMultiDiffInnerData | IObservable<IChatMultiDiffInnerData>;
		collapsed?: boolean;
		readOnly?: boolean;
	}) {
		this.readOnly = opts.readOnly;
		this.collapsed = opts.collapsed;
		this.multiDiffData = opts.multiDiffData;
	}

	toJSON(): IChatMultiDiffDataSerialized {
		return {
			kind: this.kind,
			multiDiffData: hasKey(this.multiDiffData, { title: true }) ? this.multiDiffData : this.multiDiffData.get(),
			collapsed: this.collapsed,
			readOnly: this.readOnly,
		};
	}
}

export interface IChatProgressMessage {
	content: IMarkdownString;
	kind: 'progressMessage';
}

export interface IChatTask extends IChatTaskDto {
	deferred: DeferredPromise<string | void>;
	progress: (IChatWarningMessage | IChatContentReference)[];
	readonly onDidAddProgress: Event<IChatWarningMessage | IChatContentReference>;
	add(progress: IChatWarningMessage | IChatContentReference): void;

	complete: (result: string | void) => void;
	task: () => Promise<string | void>;
	isSettled: () => boolean;
}

export interface IChatUndoStop {
	kind: 'undoStop';
	id: string;
}

export interface IChatExternalEditsDto {
	kind: 'externalEdits';
	undoStopId: string;
	start: boolean; /** true=start, false=stop */
	resources: UriComponents[];
}

export interface IChatTaskDto {
	content: IMarkdownString;
	kind: 'progressTask';
}

export interface IChatTaskSerialized {
	content: IMarkdownString;
	progress: (IChatWarningMessage | IChatContentReference)[];
	kind: 'progressTaskSerialized';
}

export interface IChatTaskResult {
	content: IMarkdownString | void;
	kind: 'progressTaskResult';
}

export interface IChatWarningMessage {
	content: IMarkdownString;
	kind: 'warning';
}

export interface IChatAgentVulnerabilityDetails {
	title: string;
	description: string;
}

export interface IChatResponseCodeblockUriPart {
	kind: 'codeblockUri';
	uri: URI;
	isEdit?: boolean;
	undoStopId?: string;
}

export interface IChatAgentMarkdownContentWithVulnerability {
	content: IMarkdownString;
	vulnerabilities: IChatAgentVulnerabilityDetails[];
	kind: 'markdownVuln';
}

export interface IChatCommandButton {
	command: Command;
	kind: 'command';
}

export interface IChatMoveMessage {
	uri: URI;
	range: IRange;
	kind: 'move';
}

export interface IChatTextEdit {
	uri: URI;
	edits: TextEdit[];
	kind: 'textEdit';
	done?: boolean;
	isExternalEdit?: boolean;
}

export interface IChatClearToPreviousToolInvocation {
	kind: 'clearToPreviousToolInvocation';
	reason: ChatResponseClearToPreviousToolInvocationReason;
}

export interface IChatNotebookEdit {
	uri: URI;
	edits: ICellEditOperation[];
	kind: 'notebookEdit';
	done?: boolean;
	isExternalEdit?: boolean;
}

export interface IChatConfirmation {
	title: string;
	message: string | IMarkdownString;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
	buttons?: string[];
	isUsed?: boolean;
	kind: 'confirmation';
}

export const enum ElicitationState {
	Pending = 'pending',
	Accepted = 'accepted',
	Rejected = 'rejected',
}

export interface IChatElicitationRequest {
	kind: 'elicitation2'; // '2' because initially serialized data used the same kind
	title: string | IMarkdownString;
	message: string | IMarkdownString;
	acceptButtonLabel: string;
	rejectButtonLabel: string | undefined;
	subtitle?: string | IMarkdownString;
	source?: ToolDataSource;
	state: IObservable<ElicitationState>;
	acceptedResult?: Record<string, unknown>;
	moreActions?: IAction[];
	accept(value: IAction | true): Promise<void>;
	reject?: () => Promise<void>;
	isHidden?: IObservable<boolean>;
	hide?(): void;
}

export interface IChatElicitationRequestSerialized {
	kind: 'elicitationSerialized';
	title: string | IMarkdownString;
	message: string | IMarkdownString;
	subtitle: string | IMarkdownString | undefined;
	source: ToolDataSource | undefined;
	state: ElicitationState.Accepted | ElicitationState.Rejected;
	isHidden: boolean;
	acceptedResult?: Record<string, unknown>;
}

export interface IChatThinkingPart {
	kind: 'thinking';
	value?: string | string[];
	id?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	metadata?: { readonly [key: string]: any };
	generatedTitle?: string;
}

export interface IChatTerminalToolInvocationData {
	kind: 'terminal';
	commandLine: {
		original: string;
		userEdited?: string;
		toolEdited?: string;
	};
	/** Message for model recommending the use of an alternative tool */
	alternativeRecommendation?: string;
	language: string;
	terminalToolSessionId?: string;
	/** The predefined command ID that will be used for this terminal command */
	terminalCommandId?: string;
	/** Serialized URI for the command that was executed in the terminal */
	terminalCommandUri?: UriComponents;
	/** Serialized output of the executed command */
	terminalCommandOutput?: {
		text: string;
		truncated?: boolean;
		lineCount?: number;
	};
	/** Stored theme colors at execution time to style detached output */
	terminalTheme?: {
		background?: string;
		foreground?: string;
	};
	/** Stored command state to restore decorations after reload */
	terminalCommandState?: {
		exitCode?: number;
		timestamp?: number;
		duration?: number;
	};
	autoApproveInfo?: IMarkdownString;
}

/**
 * @deprecated This is the old API shape, we should support this for a while before removing it so
 * we don't break existing chats
 */
export interface ILegacyChatTerminalToolInvocationData {
	kind: 'terminal';
	command: string;
	language: string;
}

export interface IChatToolInputInvocationData {
	kind: 'input';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	rawInput: any;
}

export const enum ToolConfirmKind {
	Denied,
	ConfirmationNotNeeded,
	Setting,
	LmServicePerTool,
	UserAction,
	Skipped
}

export type ConfirmedReason =
	| { type: ToolConfirmKind.Denied }
	| { type: ToolConfirmKind.ConfirmationNotNeeded }
	| { type: ToolConfirmKind.Setting; id: string }
	| { type: ToolConfirmKind.LmServicePerTool; scope: 'session' | 'workspace' | 'profile' }
	| { type: ToolConfirmKind.UserAction }
	| { type: ToolConfirmKind.Skipped };

export interface IChatToolInvocation {
	readonly presentation: IPreparedToolInvocation['presentation'];
	readonly toolSpecificData?: IChatTerminalToolInvocationData | ILegacyChatTerminalToolInvocationData | IChatToolInputInvocationData | IChatExtensionsContent | IChatPullRequestContent | IChatTodoListContent;
	readonly confirmationMessages?: IToolConfirmationMessages;
	readonly originMessage: string | IMarkdownString | undefined;
	readonly invocationMessage: string | IMarkdownString;
	readonly pastTenseMessage: string | IMarkdownString | undefined;
	readonly source: ToolDataSource;
	readonly toolId: string;
	readonly toolCallId: string;
	readonly parameters: unknown;
	readonly fromSubAgent?: boolean;
	readonly state: IObservable<IChatToolInvocation.State>;
	generatedTitle?: string;

	kind: 'toolInvocation';
}

export namespace IChatToolInvocation {
	export const enum StateKind {
		WaitingForConfirmation,
		Executing,
		WaitingForPostApproval,
		Completed,
		Cancelled,
	}

	interface IChatToolInvocationStateBase {
		type: StateKind;
	}

	interface IChatToolInvocationWaitingForConfirmationState extends IChatToolInvocationStateBase {
		type: StateKind.WaitingForConfirmation;
		confirm(reason: ConfirmedReason): void;
	}

	interface IChatToolInvocationPostConfirmState {
		confirmed: ConfirmedReason;
	}

	interface IChatToolInvocationExecutingState extends IChatToolInvocationStateBase, IChatToolInvocationPostConfirmState {
		type: StateKind.Executing;
		progress: IObservable<{ message?: string | IMarkdownString; progress: number | undefined }>;
	}

	interface IChatToolInvocationPostExecuteState extends IChatToolInvocationPostConfirmState {
		resultDetails: IToolResult['toolResultDetails'];
	}

	interface IChatToolWaitingForPostApprovalState extends IChatToolInvocationStateBase, IChatToolInvocationPostExecuteState {
		type: StateKind.WaitingForPostApproval;
		confirm(reason: ConfirmedReason): void;
		contentForModel: IToolResult['content'];
	}

	interface IChatToolInvocationCompleteState extends IChatToolInvocationStateBase, IChatToolInvocationPostExecuteState {
		type: StateKind.Completed;
		postConfirmed: ConfirmedReason | undefined;
		contentForModel: IToolResult['content'];
	}

	interface IChatToolInvocationCancelledState extends IChatToolInvocationStateBase {
		type: StateKind.Cancelled;
		reason: ToolConfirmKind.Denied | ToolConfirmKind.Skipped;
	}

	export type State =
		| IChatToolInvocationWaitingForConfirmationState
		| IChatToolInvocationExecutingState
		| IChatToolWaitingForPostApprovalState
		| IChatToolInvocationCompleteState
		| IChatToolInvocationCancelledState;

	export function executionConfirmedOrDenied(invocation: IChatToolInvocation | IChatToolInvocationSerialized, reader?: IReader): ConfirmedReason | undefined {
		if (invocation.kind === 'toolInvocationSerialized') {
			if (invocation.isConfirmed === undefined || typeof invocation.isConfirmed === 'boolean') {
				return { type: invocation.isConfirmed ? ToolConfirmKind.UserAction : ToolConfirmKind.Denied };
			}
			return invocation.isConfirmed;
		}

		const state = invocation.state.read(reader);
		if (state.type === StateKind.WaitingForConfirmation) {
			return undefined; // don't know yet
		}
		if (state.type === StateKind.Cancelled) {
			return { type: state.reason };
		}

		return state.confirmed;
	}

	export function awaitConfirmation(invocation: IChatToolInvocation, token?: CancellationToken): Promise<ConfirmedReason> {
		const reason = executionConfirmedOrDenied(invocation);
		if (reason) {
			return Promise.resolve(reason);
		}

		const store = new DisposableStore();
		return new Promise<ConfirmedReason>(resolve => {
			if (token) {
				store.add(token.onCancellationRequested(() => {
					resolve({ type: ToolConfirmKind.Denied });
				}));
			}

			store.add(autorun(reader => {
				const reason = executionConfirmedOrDenied(invocation, reader);
				if (reason) {
					store.dispose();
					resolve(reason);
				}
			}));
		}).finally(() => {
			store.dispose();
		});
	}

	function postApprovalConfirmedOrDenied(invocation: IChatToolInvocation, reader?: IReader): ConfirmedReason | undefined {
		const state = invocation.state.read(reader);
		if (state.type === StateKind.Completed) {
			return state.postConfirmed || { type: ToolConfirmKind.ConfirmationNotNeeded };
		}
		if (state.type === StateKind.Cancelled) {
			return { type: state.reason };
		}

		return undefined;
	}

	export function confirmWith(invocation: IChatToolInvocation | undefined, reason: ConfirmedReason) {
		const state = invocation?.state.get();
		if (state?.type === StateKind.WaitingForConfirmation || state?.type === StateKind.WaitingForPostApproval) {
			state.confirm(reason);
			return true;
		}
		return false;
	}

	export function awaitPostConfirmation(invocation: IChatToolInvocation, token?: CancellationToken): Promise<ConfirmedReason> {
		const reason = postApprovalConfirmedOrDenied(invocation);
		if (reason) {
			return Promise.resolve(reason);
		}

		const store = new DisposableStore();
		return new Promise<ConfirmedReason>(resolve => {
			if (token) {
				store.add(token.onCancellationRequested(() => {
					resolve({ type: ToolConfirmKind.Denied });
				}));
			}

			store.add(autorun(reader => {
				const reason = postApprovalConfirmedOrDenied(invocation, reader);
				if (reason) {
					store.dispose();
					resolve(reason);
				}
			}));
		}).finally(() => {
			store.dispose();
		});
	}

	export function resultDetails(invocation: IChatToolInvocation | IChatToolInvocationSerialized, reader?: IReader) {
		if (invocation.kind === 'toolInvocationSerialized') {
			return invocation.resultDetails;
		}

		const state = invocation.state.read(reader);
		if (state.type === StateKind.Completed || state.type === StateKind.WaitingForPostApproval) {
			return state.resultDetails;
		}

		return undefined;
	}

	export function isComplete(invocation: IChatToolInvocation | IChatToolInvocationSerialized, reader?: IReader): boolean {
		if ('isComplete' in invocation) { // serialized
			return true; // always cancelled or complete
		}

		const state = invocation.state.read(reader);
		return state.type === StateKind.Completed || state.type === StateKind.Cancelled;
	}
}


export interface IToolResultOutputDetailsSerialized {
	output: {
		type: 'data';
		mimeType: string;
		base64Data: string;
	};
}

/**
 * This is a IChatToolInvocation that has been serialized, like after window reload, so it is no longer an active tool invocation.
 */
export interface IChatToolInvocationSerialized {
	presentation: IPreparedToolInvocation['presentation'];
	toolSpecificData?: IChatTerminalToolInvocationData | IChatToolInputInvocationData | IChatExtensionsContent | IChatPullRequestContent | IChatTodoListContent;
	invocationMessage: string | IMarkdownString;
	originMessage: string | IMarkdownString | undefined;
	pastTenseMessage: string | IMarkdownString | undefined;
	resultDetails?: Array<URI | Location> | IToolResultInputOutputDetails | IToolResultOutputDetailsSerialized;
	/** boolean used by pre-1.104 versions */
	isConfirmed: ConfirmedReason | boolean | undefined;
	isComplete: boolean;
	toolCallId: string;
	toolId: string;
	source: ToolDataSource;
	readonly fromSubAgent?: boolean;
	generatedTitle?: string;
	kind: 'toolInvocationSerialized';
}

export interface IChatExtensionsContent {
	extensions: string[];
	kind: 'extensions';
}

export interface IChatPullRequestContent {
	uri: URI;
	title: string;
	description: string;
	author: string;
	linkTag: string;
	kind: 'pullRequest';
}

export interface IChatTodoListContent {
	kind: 'todoList';
	sessionId: string;
	todoList: Array<{
		id: string;
		title: string;
		description: string;
		status: 'not-started' | 'in-progress' | 'completed';
	}>;
}

export interface IChatMcpServersStarting {
	readonly kind: 'mcpServersStarting';
	readonly state?: IObservable<IAutostartResult>; // not hydrated when serialized
	didStartServerIds?: string[];
}

export class ChatMcpServersStarting implements IChatMcpServersStarting {
	public readonly kind = 'mcpServersStarting';

	public didStartServerIds?: string[] = [];

	public get isEmpty() {
		const s = this.state.get();
		return !s.working && s.serversRequiringInteraction.length === 0;
	}

	constructor(public readonly state: IObservable<IAutostartResult>) { }

	wait() {
		return new Promise<IAutostartResult>(resolve => {
			autorunSelfDisposable(reader => {
				const s = this.state.read(reader);
				if (!s.working) {
					reader.dispose();
					resolve(s);
				}
			});
		});
	}

	toJSON(): IChatMcpServersStarting {
		return { kind: 'mcpServersStarting', didStartServerIds: this.didStartServerIds };
	}
}

export interface IChatPrepareToolInvocationPart {
	readonly kind: 'prepareToolInvocation';
	readonly toolName: string;
}

export type IChatProgress =
	| IChatMarkdownContent
	| IChatAgentMarkdownContentWithVulnerability
	| IChatTreeData
	| IChatMultiDiffData
	| IChatUsedContext
	| IChatContentReference
	| IChatContentInlineReference
	| IChatCodeCitation
	| IChatProgressMessage
	| IChatTask
	| IChatTaskResult
	| IChatCommandButton
	| IChatWarningMessage
	| IChatTextEdit
	| IChatNotebookEdit
	| IChatMoveMessage
	| IChatResponseCodeblockUriPart
	| IChatConfirmation
	| IChatClearToPreviousToolInvocation
	| IChatToolInvocation
	| IChatToolInvocationSerialized
	| IChatExtensionsContent
	| IChatPullRequestContent
	| IChatUndoStop
	| IChatPrepareToolInvocationPart
	| IChatThinkingPart
	| IChatTaskSerialized
	| IChatElicitationRequest
	| IChatElicitationRequestSerialized
	| IChatMcpServersStarting;

export interface IChatFollowup {
	kind: 'reply';
	message: string;
	agentId: string;
	subCommand?: string;
	title?: string;
	tooltip?: string;
}

export function isChatFollowup(obj: unknown): obj is IChatFollowup {
	return (
		!!obj &&
		(obj as IChatFollowup).kind === 'reply' &&
		typeof (obj as IChatFollowup).message === 'string' &&
		typeof (obj as IChatFollowup).agentId === 'string'
	);
}

export enum ChatAgentVoteDirection {
	Down = 0,
	Up = 1
}

export enum ChatAgentVoteDownReason {
	IncorrectCode = 'incorrectCode',
	DidNotFollowInstructions = 'didNotFollowInstructions',
	IncompleteCode = 'incompleteCode',
	MissingContext = 'missingContext',
	PoorlyWrittenOrFormatted = 'poorlyWrittenOrFormatted',
	RefusedAValidRequest = 'refusedAValidRequest',
	OffensiveOrUnsafe = 'offensiveOrUnsafe',
	Other = 'other',
	WillReportIssue = 'willReportIssue'
}

export interface IChatVoteAction {
	kind: 'vote';
	direction: ChatAgentVoteDirection;
	reason: ChatAgentVoteDownReason | undefined;
}

export enum ChatCopyKind {
	// Keyboard shortcut or context menu
	Action = 1,
	Toolbar = 2
}

export interface IChatCopyAction {
	kind: 'copy';
	codeBlockIndex: number;
	copyKind: ChatCopyKind;
	copiedCharacters: number;
	totalCharacters: number;
	copiedText: string;
	totalLines: number;
	copiedLines: number;
	modelId: string;
	languageId?: string;
}

export interface IChatInsertAction {
	kind: 'insert';
	codeBlockIndex: number;
	totalCharacters: number;
	totalLines: number;
	languageId?: string;
	modelId: string;
	newFile?: boolean;
}

export interface IChatApplyAction {
	kind: 'apply';
	codeBlockIndex: number;
	totalCharacters: number;
	totalLines: number;
	languageId?: string;
	modelId: string;
	newFile?: boolean;
	codeMapper?: string;
	editsProposed: boolean;
}


export interface IChatTerminalAction {
	kind: 'runInTerminal';
	codeBlockIndex: number;
	languageId?: string;
}

export interface IChatCommandAction {
	kind: 'command';
	commandButton: IChatCommandButton;
}

export interface IChatFollowupAction {
	kind: 'followUp';
	followup: IChatFollowup;
}

export interface IChatBugReportAction {
	kind: 'bug';
}

export interface IChatInlineChatCodeAction {
	kind: 'inlineChat';
	action: 'accepted' | 'discarded';
}


export interface IChatEditingSessionAction {
	kind: 'chatEditingSessionAction';
	uri: URI;
	hasRemainingEdits: boolean;
	outcome: 'accepted' | 'rejected' | 'userModified';
}

export interface IChatEditingHunkAction {
	kind: 'chatEditingHunkAction';
	uri: URI;
	lineCount: number;
	linesAdded: number;
	linesRemoved: number;
	outcome: 'accepted' | 'rejected';
	hasRemainingEdits: boolean;
	modeId?: string;
	modelId?: string;
	languageId?: string;
}

export type ChatUserAction = IChatVoteAction | IChatCopyAction | IChatInsertAction | IChatApplyAction | IChatTerminalAction | IChatCommandAction | IChatFollowupAction | IChatBugReportAction | IChatInlineChatCodeAction | IChatEditingSessionAction | IChatEditingHunkAction;

export interface IChatUserActionEvent {
	action: ChatUserAction;
	agentId: string | undefined;
	command: string | undefined;
	sessionResource: URI;
	requestId: string;
	result: IChatAgentResult | undefined;
	modelId?: string | undefined;
	modeId?: string | undefined;
}

export interface IChatDynamicRequest {
	/**
	 * The message that will be displayed in the UI
	 */
	message: string;

	/**
	 * Any extra metadata/context that will go to the provider.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	metadata?: any;
}

export interface IChatCompleteResponse {
	message: string | ReadonlyArray<IChatProgress>;
	result?: IChatAgentResult;
	followups?: IChatFollowup[];
}

export interface IChatSessionStats {
	fileCount: number;
	added: number;
	removed: number;
}

export interface IChatSessionTiming {
	startTime: number;
	endTime?: number;
}

export const enum ResponseModelState {
	Pending,
	Complete,
	Cancelled,
	Failed,
	NeedsInput,
}

export interface IChatDetail {
	sessionResource: URI;
	title: string;
	lastMessageDate: number;
	timing: IChatSessionTiming;
	isActive: boolean;
	stats?: IChatSessionStats;
	lastResponseState: ResponseModelState;
}

export interface IChatProviderInfo {
	id: string;
}

export interface IChatTransferredSessionData {
	sessionId: string;
	location: ChatAgentLocation;
	inputState: IChatModelInputState | undefined;
}

export interface IChatSendRequestResponseState {
	responseCreatedPromise: Promise<IChatResponseModel>;
	responseCompletePromise: Promise<void>;
}

export interface IChatSendRequestData extends IChatSendRequestResponseState {
	agent: IChatAgentData;
	slashCommand?: IChatAgentCommand;
}

export interface IChatEditorLocationData {
	type: ChatAgentLocation.EditorInline;
	id: string;
	document: URI;
	selection: ISelection;
	wholeRange: IRange;
	close: () => void;
	delegateSessionResource: URI | undefined;
}

export interface IChatNotebookLocationData {
	type: ChatAgentLocation.Notebook;
	sessionInputUri: URI;
}

export interface IChatTerminalLocationData {
	type: ChatAgentLocation.Terminal;
	// TBD
}

export type IChatLocationData = IChatEditorLocationData | IChatNotebookLocationData | IChatTerminalLocationData;

export interface IChatSendRequestOptions {
	modeInfo?: IChatRequestModeInfo;
	userSelectedModelId?: string;
	userSelectedTools?: IObservable<UserSelectedTools>;
	location?: ChatAgentLocation;
	locationData?: IChatLocationData;
	parserContext?: IChatParserContext;
	attempt?: number;
	noCommandDetection?: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	acceptedConfirmationData?: any[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	rejectedConfirmationData?: any[];
	attachedContext?: IChatRequestVariableEntry[];

	/** The target agent ID can be specified with this property instead of using @ in 'message' */
	agentId?: string;
	/** agentId, but will not add a @ name to the request */
	agentIdSilent?: string;
	slashCommand?: string;

	/**
	 * The label of the confirmation action that was selected.
	 */
	confirmation?: string;

}

export type IChatModelReference = IReference<IChatModel>;

export const IChatService = createDecorator<IChatService>('IChatService');

export interface IChatService {
	_serviceBrand: undefined;
	transferredSessionData: IChatTransferredSessionData | undefined;

	readonly onDidSubmitRequest: Event<{ readonly chatSessionResource: URI }>;

	/**
	 * An observable containing all live chat models.
	 */
	readonly chatModels: IObservable<Iterable<IChatModel>>;

	isEnabled(location: ChatAgentLocation): boolean;
	hasSessions(): boolean;
	startSession(location: ChatAgentLocation, options?: IChatSessionStartOptions): IChatModelReference;

	/**
	 * Get an active session without holding a reference to it.
	 */
	getSession(sessionResource: URI): IChatModel | undefined;

	/**
	 * Acquire a reference to an active session.
	 */
	getActiveSessionReference(sessionResource: URI): IChatModelReference | undefined;

	getOrRestoreSession(sessionResource: URI): Promise<IChatModelReference | undefined>;
	getPersistedSessionTitle(sessionResource: URI): string | undefined;
	isPersistedSessionEmpty(sessionResource: URI): boolean;
	loadSessionFromContent(data: IExportableChatData | ISerializableChatData | URI): IChatModelReference | undefined;
	loadSessionForResource(resource: URI, location: ChatAgentLocation, token: CancellationToken): Promise<IChatModelReference | undefined>;
	readonly editingSessions: IChatEditingSession[];
	getChatSessionFromInternalUri(sessionResource: URI): IChatSessionContext | undefined;

	/**
	 * Returns whether the request was accepted.`
	 */
	sendRequest(sessionResource: URI, message: string, options?: IChatSendRequestOptions): Promise<IChatSendRequestData | undefined>;

	/**
	 * Sets a custom title for a chat model.
	 */
	setTitle(sessionResource: URI, title: string): void;
	appendProgress(request: IChatRequestModel, progress: IChatProgress): void;
	resendRequest(request: IChatRequestModel, options?: IChatSendRequestOptions): Promise<void>;
	adoptRequest(sessionResource: URI, request: IChatRequestModel): Promise<void>;
	removeRequest(sessionResource: URI, requestId: string): Promise<void>;
	cancelCurrentRequestForSession(sessionResource: URI): void;
	addCompleteRequest(sessionResource: URI, message: IParsedChatRequest | string, variableData: IChatRequestVariableData | undefined, attempt: number | undefined, response: IChatCompleteResponse): void;
	setChatSessionTitle(sessionResource: URI, title: string): void;
	getLocalSessionHistory(): Promise<IChatDetail[]>;
	clearAllHistoryEntries(): Promise<void>;
	removeHistoryEntry(sessionResource: URI): Promise<void>;
	getChatStorageFolder(): URI;
	logChatIndex(): void;
	getLiveSessionItems(): Promise<IChatDetail[]>;
	getHistorySessionItems(): Promise<IChatDetail[]>;
	getMetadataForSession(sessionResource: URI): Promise<IChatDetail | undefined>;

	readonly onDidPerformUserAction: Event<IChatUserActionEvent>;
	notifyUserAction(event: IChatUserActionEvent): void;
	readonly onDidDisposeSession: Event<{ readonly sessionResource: URI[]; readonly reason: 'cleared' }>;

	transferChatSession(transferredSessionData: IChatTransferredSessionData, toWorkspace: URI): void;

	activateDefaultAgent(location: ChatAgentLocation): Promise<void>;

	readonly edits2Enabled: boolean;

	readonly requestInProgressObs: IObservable<boolean>;

	/**
	 * For tests only!
	 */
	setSaveModelsEnabled(enabled: boolean): void;

	/**
	 * For tests only!
	 */
	waitForModelDisposals(): Promise<void>;
}

export interface IChatSessionContext {
	readonly chatSessionType: string;
	readonly chatSessionResource: URI;
	readonly isUntitled: boolean;
}

export const KEYWORD_ACTIVIATION_SETTING_ID = 'accessibility.voice.keywordActivation';

export interface IChatSessionStartOptions {
	canUseTools?: boolean;
	disableBackgroundKeepAlive?: boolean;
}
```

--------------------------------------------------------------------------------

````

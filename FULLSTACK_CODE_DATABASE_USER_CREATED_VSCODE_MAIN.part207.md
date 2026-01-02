---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 207
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 207 of 552)

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

---[FILE: src/vs/editor/common/standaloneStrings.ts]---
Location: vscode-main/src/vs/editor/common/standaloneStrings.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../nls.js';

export namespace AccessibilityHelpNLS {
	export const accessibilityHelpTitle = nls.localize('accessibilityHelpTitle', "Accessibility Help");
	export const openingDocs = nls.localize("openingDocs", "Opening the Accessibility documentation page.");
	export const readonlyDiffEditor = nls.localize("readonlyDiffEditor", "You are in a read-only pane of a diff editor.");
	export const editableDiffEditor = nls.localize("editableDiffEditor", "You are in a pane of a diff editor.");
	export const readonlyEditor = nls.localize("readonlyEditor", "You are in a read-only code editor.");
	export const editableEditor = nls.localize("editableEditor", "You are in a code editor.");
	export const defaultWindowTitleIncludesEditorState = nls.localize("defaultWindowTitleIncludesEditorState", "activeEditorState - such as modified, problems, and more, is included as a part of the window.title setting by default. Disable it with accessibility.windowTitleOptimized.");
	export const defaultWindowTitleExcludingEditorState = nls.localize("defaultWindowTitleExcludingEditorState", "activeEditorState - such as modified, problems, and more, is currently not included as a part of the window.title setting by default. Enable it with accessibility.windowTitleOptimized.");
	export const toolbar = nls.localize("toolbar", "Around the workbench, when the screen reader announces you've landed in a toolbar, use narrow keys to navigate between the toolbar's actions.");
	export const changeConfigToOnMac = nls.localize("changeConfigToOnMac", "Configure the application to be optimized for usage with a Screen Reader (Command+E).");
	export const changeConfigToOnWinLinux = nls.localize("changeConfigToOnWinLinux", "Configure the application to be optimized for usage with a Screen Reader (Control+E).");
	export const auto_on = nls.localize("auto_on", "The application is configured to be optimized for usage with a Screen Reader.");
	export const auto_off = nls.localize("auto_off", "The application is configured to never be optimized for usage with a Screen Reader.");
	export const screenReaderModeEnabled = nls.localize("screenReaderModeEnabled", "Screen Reader Optimized Mode enabled.");
	export const screenReaderModeDisabled = nls.localize("screenReaderModeDisabled", "Screen Reader Optimized Mode disabled.");
	export const tabFocusModeOnMsg = nls.localize("tabFocusModeOnMsg", "Pressing Tab in the current editor will move focus to the next focusable element. Toggle this behavior{0}.", '<keybinding:editor.action.toggleTabFocusMode>');
	export const tabFocusModeOffMsg = nls.localize("tabFocusModeOffMsg", "Pressing Tab in the current editor will insert the tab character. Toggle this behavior{0}.", '<keybinding:editor.action.toggleTabFocusMode>');
	export const stickScroll = nls.localize("stickScrollKb", "Focus Sticky Scroll{0} to focus the currently nested scopes.", '<keybinding:editor.action.focusStickyDebugConsole>');
	export const suggestActions = nls.localize("suggestActionsKb", "Trigger the suggest widget{0} to show possible inline suggestions.", '<keybinding:editor.action.triggerSuggest>');
	export const acceptSuggestAction = nls.localize("acceptSuggestAction", "Accept suggestion{0} to accept the currently selected suggestion.", '<keybinding:acceptSelectedSuggestion>');
	export const toggleSuggestionFocus = nls.localize("toggleSuggestionFocus", "Toggle focus between the suggest widget and the editor{0} and toggle details focus with{1} to learn more about the suggestion.", '<keybinding:focusSuggestion>', '<keybinding:toggleSuggestionFocus>');
	export const codeFolding = nls.localize("codeFolding", "Use code folding to collapse blocks of code and focus on the code you're interested in via the Toggle Folding Command{0}.", '<keybinding:editor.toggleFold>');
	export const intellisense = nls.localize("intellisense", "Use Intellisense to improve coding efficiency and reduce errors. Trigger suggestions{0}.", '<keybinding:editor.action.triggerSuggest>');
	export const showOrFocusHover = nls.localize("showOrFocusHover", "Show or focus the hover{0} to read information about the current symbol.", '<keybinding:editor.action.showHover>');
	export const goToSymbol = nls.localize("goToSymbol", "Go to Symbol{0} to quickly navigate between symbols in the current file.", '<keybinding:workbench.action.gotoSymbol>');
	export const showAccessibilityHelpAction = nls.localize("showAccessibilityHelpAction", "Show Accessibility Help");
	export const listSignalSounds = nls.localize("listSignalSoundsCommand", "Run the command: List Signal Sounds for an overview of all sounds and their current status.");
	export const listAlerts = nls.localize("listAnnouncementsCommand", "Run the command: List Signal Announcements for an overview of announcements and their current status.");
	export const quickChat = nls.localize("quickChatCommand", "Toggle quick chat{0} to open or close a chat session.", '<keybinding:workbench.action.quickchat.toggle>');
	export const startInlineChat = nls.localize("startInlineChatCommand", "Start inline chat{0} to create an in editor chat session.", '<keybinding:inlineChat.start>');
	export const startDebugging = nls.localize('debug.startDebugging', "The Debug: Start Debugging command{0} will start a debug session.", '<keybinding:workbench.action.debug.start>');
	export const setBreakpoint = nls.localize('debugConsole.setBreakpoint', "The Debug: Inline Breakpoint command{0} will set or unset a breakpoint at the current cursor position in the active editor.", '<keybinding:editor.debug.action.toggleInlineBreakpoint>');
	export const addToWatch = nls.localize('debugConsole.addToWatch', "The Debug: Add to Watch command{0} will add the selected text to the watch view.", '<keybinding:editor.debug.action.selectionToWatch>');
	export const debugExecuteSelection = nls.localize('debugConsole.executeSelection', "The Debug: Execute Selection command{0} will execute the selected text in the debug console.", '<keybinding:editor.debug.action.selectionToRepl>');
	export const chatEditorModification = nls.localize('chatEditorModification', "The editor contains pending modifications that have been made by chat.");
	export const chatEditorRequestInProgress = nls.localize('chatEditorRequestInProgress', "The editor is currently waiting for modifications to be made by chat.");
	export const chatEditActions = nls.localize('chatEditing.navigation', 'Navigate between edits in the editor with navigate previous{0} and next{1} and accept{2}, reject{3} or view the diff{4} for the current change. Accept edits across all files{5}.', '<keybinding:chatEditor.action.navigatePrevious>', '<keybinding:chatEditor.action.navigateNext>', '<keybinding:chatEditor.action.acceptHunk>', '<keybinding:chatEditor.action.undoHunk>', '<keybinding:chatEditor.action.toggleDiff>', '<keybinding:chatEditor.action.acceptAllEdits>');
}

export namespace InspectTokensNLS {
	export const inspectTokensAction = nls.localize('inspectTokens', "Developer: Inspect Tokens");
}

export namespace GoToLineNLS {
	export const gotoLineActionLabel = nls.localize('gotoLineActionLabel', "Go to Line/Column...");
	export const gotoOffsetActionLabel = nls.localize('gotoOffsetActionLabel', "Go to Offset...");
}

export namespace QuickHelpNLS {
	export const helpQuickAccessActionLabel = nls.localize('helpQuickAccess', "Show all Quick Access Providers");
}

export namespace QuickCommandNLS {
	export const quickCommandActionLabel = nls.localize('quickCommandActionLabel', "Command Palette");
	export const quickCommandHelp = nls.localize('quickCommandActionHelp', "Show And Run Commands");
}

export namespace QuickOutlineNLS {
	export const quickOutlineActionLabel = nls.localize('quickOutlineActionLabel', "Go to Symbol...");
	export const quickOutlineByCategoryActionLabel = nls.localize('quickOutlineByCategoryActionLabel', "Go to Symbol by Category...");
}

export namespace StandaloneCodeEditorNLS {
	export const editorViewAccessibleLabel = nls.localize('editorViewAccessibleLabel', "Editor content");
}

export namespace ToggleHighContrastNLS {
	export const toggleHighContrast = nls.localize('toggleHighContrast', "Toggle High Contrast Theme");
}

export namespace StandaloneServicesNLS {
	export const bulkEditServiceSummary = nls.localize('bulkEditServiceSummary', "Made {0} edits in {1} files");
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/textModelBracketPairs.ts]---
Location: vscode-main/src/vs/editor/common/textModelBracketPairs.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CallbackIterable } from '../../base/common/arrays.js';
import { Event } from '../../base/common/event.js';
import { IPosition } from './core/position.js';
import { IRange, Range } from './core/range.js';
import { ClosingBracketKind, OpeningBracketKind } from './languages/supports/languageBracketsConfiguration.js';
import { PairAstNode } from './model/bracketPairsTextModelPart/bracketPairsTree/ast.js';

export interface IBracketPairsTextModelPart {
	/**
	 * Is fired when bracket pairs change, either due to a text or a settings change.
	*/
	readonly onDidChange: Event<void>;

	/**
	 * Gets all bracket pairs that intersect the given position.
	 * The result is sorted by the start position.
	 */
	getBracketPairsInRange(range: IRange): CallbackIterable<BracketPairInfo>;

	/**
	 * Gets all bracket pairs that intersect the given position.
	 * The result is sorted by the start position.
	 */
	getBracketPairsInRangeWithMinIndentation(range: IRange): CallbackIterable<BracketPairWithMinIndentationInfo>;

	getBracketsInRange(range: IRange, onlyColorizedBrackets?: boolean): CallbackIterable<BracketInfo>;

	/**
	 * Find the matching bracket of `request` up, counting brackets.
	 * @param request The bracket we're searching for
	 * @param position The position at which to start the search.
	 * @return The range of the matching bracket, or null if the bracket match was not found.
	 */
	findMatchingBracketUp(bracket: string, position: IPosition, maxDuration?: number): Range | null;

	/**
	 * Find the first bracket in the model before `position`.
	 * @param position The position at which to start the search.
	 * @return The info for the first bracket before `position`, or null if there are no more brackets before `positions`.
	 */
	findPrevBracket(position: IPosition): IFoundBracket | null;

	/**
	 * Find the first bracket in the model after `position`.
	 * @param position The position at which to start the search.
	 * @return The info for the first bracket after `position`, or null if there are no more brackets after `positions`.
	 */
	findNextBracket(position: IPosition): IFoundBracket | null;

	/**
	 * Find the enclosing brackets that contain `position`.
	 * @param position The position at which to start the search.
	 */
	findEnclosingBrackets(position: IPosition, maxDuration?: number): [Range, Range] | null;

	/**
	 * Given a `position`, if the position is on top or near a bracket,
	 * find the matching bracket of that bracket and return the ranges of both brackets.
	 * @param position The position at which to look for a bracket.
	 */
	matchBracket(position: IPosition, maxDuration?: number): [Range, Range] | null;
}

export interface IFoundBracket {
	range: Range;
	bracketInfo: OpeningBracketKind | ClosingBracketKind;
}

export class BracketInfo {
	constructor(
		public readonly range: Range,
		/** 0-based level */
		public readonly nestingLevel: number,
		public readonly nestingLevelOfEqualBracketType: number,
		public readonly isInvalid: boolean,
	) { }
}

export class BracketPairInfo {
	constructor(
		public readonly range: Range,
		public readonly openingBracketRange: Range,
		public readonly closingBracketRange: Range | undefined,
		/** 0-based */
		public readonly nestingLevel: number,
		public readonly nestingLevelOfEqualBracketType: number,
		private readonly bracketPairNode: PairAstNode,

	) {
	}

	public get openingBracketInfo(): OpeningBracketKind {
		return this.bracketPairNode.openingBracket.bracketInfo as OpeningBracketKind;
	}

	public get closingBracketInfo(): ClosingBracketKind | undefined {
		return this.bracketPairNode.closingBracket?.bracketInfo as ClosingBracketKind | undefined;
	}
}

export class BracketPairWithMinIndentationInfo extends BracketPairInfo {
	constructor(
		range: Range,
		openingBracketRange: Range,
		closingBracketRange: Range | undefined,
		/**
		 * 0-based
		*/
		nestingLevel: number,
		nestingLevelOfEqualBracketType: number,
		bracketPairNode: PairAstNode,
		/**
		 * -1 if not requested, otherwise the size of the minimum indentation in the bracket pair in terms of visible columns.
		*/
		public readonly minVisibleColumnIndentation: number,
	) {
		super(range, openingBracketRange, closingBracketRange, nestingLevel, nestingLevelOfEqualBracketType, bracketPairNode);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/textModelEditSource.ts]---
Location: vscode-main/src/vs/editor/common/textModelEditSource.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { sumBy } from '../../base/common/arrays.js';
import { prefixedUuid } from '../../base/common/uuid.js';
import { LineEdit } from './core/edits/lineEdit.js';
import { BaseStringEdit } from './core/edits/stringEdit.js';
import { StringText } from './core/text/abstractText.js';
import { TextLength } from './core/text/textLength.js';
import { ProviderId, VersionedExtensionId } from './languages.js';

const privateSymbol = Symbol('TextModelEditSource');

export class TextModelEditSource {
	constructor(
		public readonly metadata: ITextModelEditSourceMetadata,
		_privateCtorGuard: typeof privateSymbol,
	) { }

	public toString(): string {
		return `${this.metadata.source}`;
	}

	public getType(): string {
		const metadata = this.metadata;
		switch (metadata.source) {
			case 'cursor':
				return metadata.kind;
			case 'inlineCompletionAccept':
				return metadata.source + (metadata.$nes ? ':nes' : '');
			case 'unknown':
				return metadata.name || 'unknown';
			default:
				return metadata.source;
		}
	}

	/**
	 * Converts the metadata to a key string.
	 * Only includes properties/values that have `level` many `$` prefixes or less.
	*/
	public toKey(level: number, filter: { [TKey in ITextModelEditSourceMetadataKeys]?: boolean } = {}): string {
		const metadata = this.metadata;
		const keys = Object.entries(metadata).filter(([key, value]) => {
			const filterVal = (filter as Record<string, boolean>)[key];
			if (filterVal !== undefined) {
				return filterVal;
			}

			const prefixCount = (key.match(/\$/g) || []).length;
			return prefixCount <= level && value !== undefined && value !== null && value !== '';
		}).map(([key, value]) => `${key}:${value}`);
		return keys.join('-');
	}

	public get props(): Record<ITextModelEditSourceMetadataKeys, string | undefined> {
		// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
		return this.metadata as any;
	}
}

type TextModelEditSourceT<T> = TextModelEditSource & {
	metadataT: T;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createEditSource<T extends Record<string, any>>(metadata: T): TextModelEditSourceT<T> {
	// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
	return new TextModelEditSource(metadata as any, privateSymbol) as any;
}

export function isAiEdit(source: TextModelEditSource): boolean {
	switch (source.metadata.source) {
		case 'inlineCompletionAccept':
		case 'inlineCompletionPartialAccept':
		case 'inlineChat.applyEdits':
		case 'Chat.applyEdits':
			return true;
	}
	return false;
}

export function isUserEdit(source: TextModelEditSource): boolean {
	switch (source.metadata.source) {
		case 'cursor':
			return source.metadata.kind === 'type';
	}
	return false;
}

export const EditSources = {
	unknown(data: { name?: string | null }) {
		return createEditSource({
			source: 'unknown',
			name: data.name,
		} as const);
	},

	rename: (oldName: string | undefined, newName: string) => createEditSource({ source: 'rename', $$$oldName: oldName, $$$newName: newName } as const),

	chatApplyEdits(data: {
		modelId: string | undefined;
		sessionId: string | undefined;
		requestId: string | undefined;
		languageId: string;
		mode: string | undefined;
		extensionId: VersionedExtensionId | undefined;
		codeBlockSuggestionId: EditSuggestionId | undefined;
	}) {
		return createEditSource({
			source: 'Chat.applyEdits',
			$modelId: avoidPathRedaction(data.modelId),
			$extensionId: data.extensionId?.extensionId,
			$extensionVersion: data.extensionId?.version,
			$$languageId: data.languageId,
			$$sessionId: data.sessionId,
			$$requestId: data.requestId,
			$$mode: data.mode,
			$$codeBlockSuggestionId: data.codeBlockSuggestionId,
		} as const);
	},

	chatUndoEdits: () => createEditSource({ source: 'Chat.undoEdits' } as const),
	chatReset: () => createEditSource({ source: 'Chat.reset' } as const),

	inlineCompletionAccept(data: { nes: boolean; requestUuid: string; languageId: string; providerId?: ProviderId; correlationId: string | undefined }) {
		return createEditSource({
			source: 'inlineCompletionAccept',
			$nes: data.nes,
			...toProperties(data.providerId),
			$$correlationId: data.correlationId,
			$$requestUuid: data.requestUuid,
			$$languageId: data.languageId,
		} as const);
	},

	inlineCompletionPartialAccept(data: { nes: boolean; requestUuid: string; languageId: string; providerId?: ProviderId; correlationId: string | undefined; type: 'word' | 'line' }) {
		return createEditSource({
			source: 'inlineCompletionPartialAccept',
			type: data.type,
			$nes: data.nes,
			...toProperties(data.providerId),
			$$correlationId: data.correlationId,
			$$requestUuid: data.requestUuid,
			$$languageId: data.languageId,
		} as const);
	},

	inlineChatApplyEdit(data: { modelId: string | undefined; requestId: string | undefined; sessionId: string | undefined; languageId: string; extensionId: VersionedExtensionId | undefined }) {
		return createEditSource({
			source: 'inlineChat.applyEdits',
			$modelId: avoidPathRedaction(data.modelId),
			$extensionId: data.extensionId?.extensionId,
			$extensionVersion: data.extensionId?.version,
			$$sessionId: data.sessionId,
			$$requestId: data.requestId,
			$$languageId: data.languageId,
		} as const);
	},

	reloadFromDisk: () => createEditSource({ source: 'reloadFromDisk' } as const),

	cursor(data: { kind: 'compositionType' | 'compositionEnd' | 'type' | 'paste' | 'cut' | 'executeCommands' | 'executeCommand'; detailedSource?: string | null }) {
		return createEditSource({
			source: 'cursor',
			kind: data.kind,
			detailedSource: data.detailedSource,
		} as const);
	},

	setValue: () => createEditSource({ source: 'setValue' } as const),
	eolChange: () => createEditSource({ source: 'eolChange' } as const),
	applyEdits: () => createEditSource({ source: 'applyEdits' } as const),
	snippet: () => createEditSource({ source: 'snippet' } as const),
	suggest: (data: { providerId: ProviderId | undefined }) => createEditSource({ source: 'suggest', ...toProperties(data.providerId) } as const),

	codeAction: (data: { kind: string | undefined; providerId: ProviderId | undefined }) => createEditSource({ source: 'codeAction', $kind: data.kind, ...toProperties(data.providerId) } as const)
};

function toProperties(version: ProviderId | undefined) {
	if (!version) {
		return {};
	}
	return {
		$extensionId: version.extensionId,
		$extensionVersion: version.extensionVersion,
		$providerId: version.providerId,
	};
}

type Values<T> = T[keyof T];
export type ITextModelEditSourceMetadata = Values<{ [TKey in keyof typeof EditSources]: ReturnType<typeof EditSources[TKey]>['metadataT'] }>;
type ITextModelEditSourceMetadataKeys = Values<{ [TKey in keyof typeof EditSources]: keyof ReturnType<typeof EditSources[TKey]>['metadataT'] }>;


function avoidPathRedaction(str: string | undefined): string | undefined {
	if (str === undefined) {
		return undefined;
	}
	// To avoid false-positive file path redaction.
	return str.replaceAll('/', '|');
}


export class EditDeltaInfo {
	public static fromText(text: string): EditDeltaInfo {
		const linesAdded = TextLength.ofText(text).lineCount;
		const charsAdded = text.length;
		return new EditDeltaInfo(linesAdded, 0, charsAdded, 0);
	}

	/** @internal */
	public static fromEdit(edit: BaseStringEdit, originalString: StringText): EditDeltaInfo {
		const lineEdit = LineEdit.fromStringEdit(edit, originalString);
		const linesAdded = sumBy(lineEdit.replacements, r => r.newLines.length);
		const linesRemoved = sumBy(lineEdit.replacements, r => r.lineRange.length);
		const charsAdded = sumBy(edit.replacements, r => r.getNewLength());
		const charsRemoved = sumBy(edit.replacements, r => r.replaceRange.length);
		return new EditDeltaInfo(linesAdded, linesRemoved, charsAdded, charsRemoved);
	}

	public static tryCreate(
		linesAdded: number | undefined,
		linesRemoved: number | undefined,
		charsAdded: number | undefined,
		charsRemoved: number | undefined
	): EditDeltaInfo | undefined {
		if (linesAdded === undefined || linesRemoved === undefined || charsAdded === undefined || charsRemoved === undefined) {
			return undefined;
		}
		return new EditDeltaInfo(linesAdded, linesRemoved, charsAdded, charsRemoved);
	}

	constructor(
		public readonly linesAdded: number,
		public readonly linesRemoved: number,
		public readonly charsAdded: number,
		public readonly charsRemoved: number
	) { }
}


/**
 * This is an opaque serializable type that represents a unique identity for an edit.
 */
export interface EditSuggestionId {
	readonly _brand: 'EditIdentity';
}

export namespace EditSuggestionId {
	/**
	 * Use AiEditTelemetryServiceImpl to create a new id!
	*/
	export function newId(genPrefixedUuid?: (ns: string) => string): EditSuggestionId {
		const id = genPrefixedUuid ? genPrefixedUuid('sgt') : prefixedUuid('sgt');
		return toEditIdentity(id);
	}
}

function toEditIdentity(id: string): EditSuggestionId {
	return id as unknown as EditSuggestionId;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/textModelEvents.ts]---
Location: vscode-main/src/vs/editor/common/textModelEvents.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IPosition } from './core/position.js';
import { IRange, Range } from './core/range.js';
import { Selection } from './core/selection.js';
import { IModelDecoration, InjectedTextOptions } from './model.js';
import { IModelContentChange } from './model/mirrorTextModel.js';
import { AnnotationsUpdate } from './model/tokens/annotations.js';
import { TextModelEditSource } from './textModelEditSource.js';

/**
 * An event describing that the current language associated with a model has changed.
 */
export interface IModelLanguageChangedEvent {
	/**
	 * Previous language
	 */
	readonly oldLanguage: string;
	/**
	 * New language
	 */
	readonly newLanguage: string;

	/**
	 * Source of the call that caused the event.
	 */
	readonly source: string;
}

/**
 * An event describing that the language configuration associated with a model has changed.
 */
export interface IModelLanguageConfigurationChangedEvent {
}

/**
 * An event describing a change in the text of a model.
 */
export interface IModelContentChangedEvent {
	/**
	 * The changes are ordered from the end of the document to the beginning, so they should be safe to apply in sequence.
	 */
	readonly changes: IModelContentChange[];
	/**
	 * The (new) end-of-line character.
	 */
	readonly eol: string;
	/**
	 * The new version id the model has transitioned to.
	 */
	readonly versionId: number;
	/**
	 * Flag that indicates that this event was generated while undoing.
	 */
	readonly isUndoing: boolean;
	/**
	 * Flag that indicates that this event was generated while redoing.
	 */
	readonly isRedoing: boolean;
	/**
	 * Flag that indicates that all decorations were lost with this edit.
	 * The model has been reset to a new value.
	 */
	readonly isFlush: boolean;

	/**
	 * Flag that indicates that this event describes an eol change.
	 */
	readonly isEolChange: boolean;

	/**
	 * Detailed reason information for the change
	 * @internal
	 */
	readonly detailedReasons: TextModelEditSource[];

	/**
	 * The sum of these lengths equals changes.length.
	 * The length of this array must equal the length of detailedReasons.
	*/
	readonly detailedReasonsChangeLengths: number[];
}

export interface ISerializedModelContentChangedEvent {
	/**
	 * The changes are ordered from the end of the document to the beginning, so they should be safe to apply in sequence.
	 */
	readonly changes: IModelContentChange[];
	/**
	 * The (new) end-of-line character.
	 */
	readonly eol: string;
	/**
	 * The new version id the model has transitioned to.
	 */
	readonly versionId: number;
	/**
	 * Flag that indicates that this event was generated while undoing.
	 */
	readonly isUndoing: boolean;
	/**
	 * Flag that indicates that this event was generated while redoing.
	 */
	readonly isRedoing: boolean;
	/**
	 * Flag that indicates that all decorations were lost with this edit.
	 * The model has been reset to a new value.
	 */
	readonly isFlush: boolean;

	/**
	 * Flag that indicates that this event describes an eol change.
	 */
	readonly isEolChange: boolean;

	/**
	 * Detailed reason information for the change
	 * @internal
	 */
	readonly detailedReason: Record<string, unknown> | undefined;
}

/**
 * An event describing that model decorations have changed.
 */
export interface IModelDecorationsChangedEvent {
	readonly affectsMinimap: boolean;
	readonly affectsOverviewRuler: boolean;
	readonly affectsGlyphMargin: boolean;
	readonly affectsLineNumber: boolean;
}

/**
 * An event describing that some ranges of lines have been tokenized (their tokens have changed).
 * @internal
 */
export interface IModelTokensChangedEvent {
	readonly semanticTokensApplied: boolean;
	readonly ranges: {
		/**
		 * The start of the range (inclusive)
		 */
		readonly fromLineNumber: number;
		/**
		 * The end of the range (inclusive)
		 */
		readonly toLineNumber: number;
	}[];
}

/**
 * @internal
 */
export interface IFontTokenOption {
	/**
	 * Font family of the token.
	 */
	readonly fontFamily?: string;
	/**
	 * Font size of the token.
	 */
	readonly fontSize?: string;
	/**
	 * Line height of the token.
	 */
	readonly lineHeight?: number;
}

/**
 * An event describing a token font change event
 * @internal
 */
export interface IModelFontTokensChangedEvent {
	changes: FontTokensUpdate;
}

/**
 * @internal
 */
export type FontTokensUpdate = AnnotationsUpdate<IFontTokenOption | undefined>;

/**
 * @internal
 */
export function serializeFontTokenOptions(): (options: IFontTokenOption) => IFontTokenOption {
	return (annotation: IFontTokenOption) => {
		return {
			fontFamily: annotation.fontFamily ?? '',
			fontSize: annotation.fontSize ?? '',
			lineHeight: annotation.lineHeight ?? 0
		};
	};
}

/**
 * @internal
 */
export function deserializeFontTokenOptions(): (options: IFontTokenOption) => IFontTokenOption {
	return (annotation: IFontTokenOption) => {
		return {
			fontFamily: annotation.fontFamily ? String(annotation.fontFamily) : undefined,
			fontSize: annotation.fontSize ? String(annotation.fontSize) : undefined,
			lineHeight: annotation.lineHeight ? Number(annotation.lineHeight) : undefined
		};
	};
}

export interface IModelOptionsChangedEvent {
	readonly tabSize: boolean;
	readonly indentSize: boolean;
	readonly insertSpaces: boolean;
	readonly trimAutoWhitespace: boolean;
}

/**
 * @internal
 */
export const enum RawContentChangedType {
	Flush = 1,
	LineChanged = 2,
	LinesDeleted = 3,
	LinesInserted = 4,
	EOLChanged = 5
}

/**
 * An event describing that a model has been reset to a new value.
 * @internal
 */
export class ModelRawFlush {
	public readonly changeType = RawContentChangedType.Flush;
}

/**
 * Represents text injected on a line
 * @internal
 */
export class LineInjectedText {
	public static applyInjectedText(lineText: string, injectedTexts: LineInjectedText[] | null): string {
		if (!injectedTexts || injectedTexts.length === 0) {
			return lineText;
		}
		let result = '';
		let lastOriginalOffset = 0;
		for (const injectedText of injectedTexts) {
			result += lineText.substring(lastOriginalOffset, injectedText.column - 1);
			lastOriginalOffset = injectedText.column - 1;
			result += injectedText.options.content;
		}
		result += lineText.substring(lastOriginalOffset);
		return result;
	}

	public static fromDecorations(decorations: IModelDecoration[]): LineInjectedText[] {
		const result: LineInjectedText[] = [];
		for (const decoration of decorations) {
			if (decoration.options.before && decoration.options.before.content.length > 0) {
				result.push(new LineInjectedText(
					decoration.ownerId,
					decoration.range.startLineNumber,
					decoration.range.startColumn,
					decoration.options.before,
					0,
				));
			}
			if (decoration.options.after && decoration.options.after.content.length > 0) {
				result.push(new LineInjectedText(
					decoration.ownerId,
					decoration.range.endLineNumber,
					decoration.range.endColumn,
					decoration.options.after,
					1,
				));
			}
		}
		result.sort((a, b) => {
			if (a.lineNumber === b.lineNumber) {
				if (a.column === b.column) {
					return a.order - b.order;
				}
				return a.column - b.column;
			}
			return a.lineNumber - b.lineNumber;
		});
		return result;
	}

	constructor(
		public readonly ownerId: number,
		public readonly lineNumber: number,
		public readonly column: number,
		public readonly options: InjectedTextOptions,
		public readonly order: number
	) { }

	public withText(text: string): LineInjectedText {
		return new LineInjectedText(this.ownerId, this.lineNumber, this.column, { ...this.options, content: text }, this.order);
	}
}

/**
 * An event describing that a line has changed in a model.
 * @internal
 */
export class ModelRawLineChanged {
	public readonly changeType = RawContentChangedType.LineChanged;
	/**
	 * The line that has changed.
	 */
	public readonly lineNumber: number;
	/**
	 * The new value of the line.
	 */
	public readonly detail: string;
	/**
	 * The injected text on the line.
	 */
	public readonly injectedText: LineInjectedText[] | null;

	constructor(lineNumber: number, detail: string, injectedText: LineInjectedText[] | null) {
		this.lineNumber = lineNumber;
		this.detail = detail;
		this.injectedText = injectedText;
	}
}


/**
 * An event describing that a line height has changed in the model.
 * @internal
 */
export class ModelLineHeightChanged {
	/**
	 * Editor owner ID
	 */
	public readonly ownerId: number;
	/**
	 * The decoration ID that has changed.
	 */
	public readonly decorationId: string;
	/**
	 * The line that has changed.
	 */
	public readonly lineNumber: number;
	/**
	 * The line height on the line.
	 */
	public readonly lineHeight: number | null;

	constructor(ownerId: number, decorationId: string, lineNumber: number, lineHeight: number | null) {
		this.ownerId = ownerId;
		this.decorationId = decorationId;
		this.lineNumber = lineNumber;
		this.lineHeight = lineHeight;
	}
}

/**
 * An event describing that a line height has changed in the model.
 * @internal
 */
export class ModelFontChanged {
	/**
	 * Editor owner ID
	 */
	public readonly ownerId: number;
	/**
	 * The line that has changed.
	 */
	public readonly lineNumber: number;

	constructor(ownerId: number, lineNumber: number) {
		this.ownerId = ownerId;
		this.lineNumber = lineNumber;
	}
}

/**
 * An event describing that line(s) have been deleted in a model.
 * @internal
 */
export class ModelRawLinesDeleted {
	public readonly changeType = RawContentChangedType.LinesDeleted;
	/**
	 * At what line the deletion began (inclusive).
	 */
	public readonly fromLineNumber: number;
	/**
	 * At what line the deletion stopped (inclusive).
	 */
	public readonly toLineNumber: number;

	constructor(fromLineNumber: number, toLineNumber: number) {
		this.fromLineNumber = fromLineNumber;
		this.toLineNumber = toLineNumber;
	}
}

/**
 * An event describing that line(s) have been inserted in a model.
 * @internal
 */
export class ModelRawLinesInserted {
	public readonly changeType = RawContentChangedType.LinesInserted;
	/**
	 * Before what line did the insertion begin
	 */
	public readonly fromLineNumber: number;
	/**
	 * `toLineNumber` - `fromLineNumber` + 1 denotes the number of lines that were inserted
	 */
	public readonly toLineNumber: number;
	/**
	 * The text that was inserted
	 */
	public readonly detail: string[];
	/**
	 * The injected texts for every inserted line.
	 */
	public readonly injectedTexts: (LineInjectedText[] | null)[];

	constructor(fromLineNumber: number, toLineNumber: number, detail: string[], injectedTexts: (LineInjectedText[] | null)[]) {
		this.injectedTexts = injectedTexts;
		this.fromLineNumber = fromLineNumber;
		this.toLineNumber = toLineNumber;
		this.detail = detail;
	}
}

/**
 * An event describing that a model has had its EOL changed.
 * @internal
 */
export class ModelRawEOLChanged {
	public readonly changeType = RawContentChangedType.EOLChanged;
}

/**
 * @internal
 */
export type ModelRawChange = ModelRawFlush | ModelRawLineChanged | ModelRawLinesDeleted | ModelRawLinesInserted | ModelRawEOLChanged;

/**
 * An event describing a change in the text of a model.
 * @internal
 */
export class ModelRawContentChangedEvent {

	public readonly changes: ModelRawChange[];
	/**
	 * The new version id the model has transitioned to.
	 */
	public readonly versionId: number;
	/**
	 * Flag that indicates that this event was generated while undoing.
	 */
	public readonly isUndoing: boolean;
	/**
	 * Flag that indicates that this event was generated while redoing.
	 */
	public readonly isRedoing: boolean;

	public resultingSelection: Selection[] | null;

	constructor(changes: ModelRawChange[], versionId: number, isUndoing: boolean, isRedoing: boolean) {
		this.changes = changes;
		this.versionId = versionId;
		this.isUndoing = isUndoing;
		this.isRedoing = isRedoing;
		this.resultingSelection = null;
	}

	public containsEvent(type: RawContentChangedType): boolean {
		for (let i = 0, len = this.changes.length; i < len; i++) {
			const change = this.changes[i];
			if (change.changeType === type) {
				return true;
			}
		}
		return false;
	}

	public static merge(a: ModelRawContentChangedEvent, b: ModelRawContentChangedEvent): ModelRawContentChangedEvent {
		const changes = ([] as ModelRawChange[]).concat(a.changes).concat(b.changes);
		const versionId = b.versionId;
		const isUndoing = (a.isUndoing || b.isUndoing);
		const isRedoing = (a.isRedoing || b.isRedoing);
		return new ModelRawContentChangedEvent(changes, versionId, isUndoing, isRedoing);
	}
}

/**
 * An event describing a change in injected text.
 * @internal
 */
export class ModelInjectedTextChangedEvent {

	public readonly changes: ModelRawLineChanged[];

	constructor(changes: ModelRawLineChanged[]) {
		this.changes = changes;
	}
}

/**
 * An event describing a change of a line height.
 * @internal
 */
export class ModelLineHeightChangedEvent {

	public readonly changes: ModelLineHeightChanged[];

	constructor(changes: ModelLineHeightChanged[]) {
		this.changes = changes;
	}

	public affects(rangeOrPosition: IRange | IPosition) {
		if (Range.isIRange(rangeOrPosition)) {
			for (const change of this.changes) {
				if (change.lineNumber >= rangeOrPosition.startLineNumber && change.lineNumber <= rangeOrPosition.endLineNumber) {
					return true;
				}
			}
			return false;
		} else {
			for (const change of this.changes) {
				if (change.lineNumber === rangeOrPosition.lineNumber) {
					return true;
				}
			}
			return false;
		}
	}
}

/**
 * An event describing a change in fonts.
 * @internal
 */
export class ModelFontChangedEvent {

	public readonly changes: ModelFontChanged[];

	constructor(changes: ModelFontChanged[]) {
		this.changes = changes;
	}
}

/**
 * @internal
 */
export class InternalModelContentChangeEvent {
	constructor(
		public readonly rawContentChangedEvent: ModelRawContentChangedEvent,
		public readonly contentChangedEvent: IModelContentChangedEvent,
	) { }

	public merge(other: InternalModelContentChangeEvent): InternalModelContentChangeEvent {
		const rawContentChangedEvent = ModelRawContentChangedEvent.merge(this.rawContentChangedEvent, other.rawContentChangedEvent);
		const contentChangedEvent = InternalModelContentChangeEvent._mergeChangeEvents(this.contentChangedEvent, other.contentChangedEvent);
		return new InternalModelContentChangeEvent(rawContentChangedEvent, contentChangedEvent);
	}

	private static _mergeChangeEvents(a: IModelContentChangedEvent, b: IModelContentChangedEvent): IModelContentChangedEvent {
		const changes = ([] as IModelContentChange[]).concat(a.changes).concat(b.changes);
		const eol = b.eol;
		const versionId = b.versionId;
		const isUndoing = (a.isUndoing || b.isUndoing);
		const isRedoing = (a.isRedoing || b.isRedoing);
		const isFlush = (a.isFlush || b.isFlush);
		const isEolChange = a.isEolChange && b.isEolChange; // both must be true to not confuse listeners who skip such edits
		return {
			changes: changes,
			eol: eol,
			isEolChange: isEolChange,
			versionId: versionId,
			isUndoing: isUndoing,
			isRedoing: isRedoing,
			isFlush: isFlush,
			detailedReasons: a.detailedReasons.concat(b.detailedReasons),
			detailedReasonsChangeLengths: a.detailedReasonsChangeLengths.concat(b.detailedReasonsChangeLengths),
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/textModelGuides.ts]---
Location: vscode-main/src/vs/editor/common/textModelGuides.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IPosition } from './core/position.js';

export interface IGuidesTextModelPart {
	/**
	 * @internal
	 */
	getActiveIndentGuide(lineNumber: number, minLineNumber: number, maxLineNumber: number): IActiveIndentGuideInfo;

	/**
	 * @internal
	 */
	getLinesIndentGuides(startLineNumber: number, endLineNumber: number): number[];

	/**
	 * Requests the indent guides for the given range of lines.
	 * `result[i]` will contain the indent guides of the `startLineNumber + i`th line.
	 * @internal
	 */
	getLinesBracketGuides(startLineNumber: number, endLineNumber: number, activePosition: IPosition | null, options: BracketGuideOptions): IndentGuide[][];
}

export interface IActiveIndentGuideInfo {
	startLineNumber: number;
	endLineNumber: number;
	indent: number;
}

export enum HorizontalGuidesState {
	Disabled,
	EnabledForActive,
	Enabled
}

export interface BracketGuideOptions {
	includeInactive: boolean;
	horizontalGuides: HorizontalGuidesState;
	highlightActive: boolean;
}

export class IndentGuide {
	constructor(
		public readonly visibleColumn: number | -1,
		public readonly column: number | -1,
		public readonly className: string,
		/**
		 * If set, this indent guide is a horizontal guide (no vertical part).
		 * It starts at visibleColumn and continues until endColumn.
		*/
		public readonly horizontalLine: IndentGuideHorizontalLine | null,
		/**
		 * If set (!= -1), only show this guide for wrapped lines that don't contain this model column, but are after it.
		*/
		public readonly forWrappedLinesAfterColumn: number | -1,
		public readonly forWrappedLinesBeforeOrAtColumn: number | -1
	) {
		if ((visibleColumn !== -1) === (column !== -1)) {
			throw new Error();
		}
	}
}

export class IndentGuideHorizontalLine {
	constructor(
		public readonly top: boolean,
		public readonly endColumn: number,
	) { }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/tokenizationRegistry.ts]---
Location: vscode-main/src/vs/editor/common/tokenizationRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Color } from '../../base/common/color.js';
import { Emitter, Event } from '../../base/common/event.js';
import { Disposable, IDisposable, toDisposable } from '../../base/common/lifecycle.js';
import { ITokenizationRegistry, ITokenizationSupportChangedEvent, ILazyTokenizationSupport } from './languages.js';
import { ColorId } from './encodedTokenAttributes.js';

export class TokenizationRegistry<TSupport> implements ITokenizationRegistry<TSupport> {

	private readonly _tokenizationSupports = new Map<string, TSupport>();
	private readonly _factories = new Map<string, TokenizationSupportFactoryData<TSupport>>();

	private readonly _onDidChange = new Emitter<ITokenizationSupportChangedEvent>();
	public readonly onDidChange: Event<ITokenizationSupportChangedEvent> = this._onDidChange.event;

	private _colorMap: Color[] | null;

	constructor() {
		this._colorMap = null;
	}

	public handleChange(languageIds: string[]): void {
		this._onDidChange.fire({
			changedLanguages: languageIds,
			changedColorMap: false
		});
	}

	public register(languageId: string, support: TSupport): IDisposable {
		this._tokenizationSupports.set(languageId, support);
		this.handleChange([languageId]);
		return toDisposable(() => {
			if (this._tokenizationSupports.get(languageId) !== support) {
				return;
			}
			this._tokenizationSupports.delete(languageId);
			this.handleChange([languageId]);
		});
	}

	public get(languageId: string): TSupport | null {
		return this._tokenizationSupports.get(languageId) || null;
	}

	public registerFactory(languageId: string, factory: ILazyTokenizationSupport<TSupport>): IDisposable {
		this._factories.get(languageId)?.dispose();
		const myData = new TokenizationSupportFactoryData(this, languageId, factory);
		this._factories.set(languageId, myData);
		return toDisposable(() => {
			const v = this._factories.get(languageId);
			if (!v || v !== myData) {
				return;
			}
			this._factories.delete(languageId);
			v.dispose();
		});
	}

	public async getOrCreate(languageId: string): Promise<TSupport | null> {
		// check first if the support is already set
		const tokenizationSupport = this.get(languageId);
		if (tokenizationSupport) {
			return tokenizationSupport;
		}

		const factory = this._factories.get(languageId);
		if (!factory || factory.isResolved) {
			// no factory or factory.resolve already finished
			return null;
		}

		await factory.resolve();

		return this.get(languageId);
	}

	public isResolved(languageId: string): boolean {
		const tokenizationSupport = this.get(languageId);
		if (tokenizationSupport) {
			return true;
		}

		const factory = this._factories.get(languageId);
		if (!factory || factory.isResolved) {
			return true;
		}

		return false;
	}

	public setColorMap(colorMap: Color[]): void {
		this._colorMap = colorMap;
		this._onDidChange.fire({
			changedLanguages: Array.from(this._tokenizationSupports.keys()),
			changedColorMap: true
		});
	}

	public getColorMap(): Color[] | null {
		return this._colorMap;
	}

	public getDefaultBackground(): Color | null {
		if (this._colorMap && this._colorMap.length > ColorId.DefaultBackground) {
			return this._colorMap[ColorId.DefaultBackground];
		}
		return null;
	}
}

class TokenizationSupportFactoryData<TSupport> extends Disposable {

	private _isDisposed: boolean = false;
	private _resolvePromise: Promise<void> | null = null;
	private _isResolved: boolean = false;

	public get isResolved(): boolean {
		return this._isResolved;
	}

	constructor(
		private readonly _registry: TokenizationRegistry<TSupport>,
		private readonly _languageId: string,
		private readonly _factory: ILazyTokenizationSupport<TSupport>,
	) {
		super();
	}

	public override dispose(): void {
		this._isDisposed = true;
		super.dispose();
	}

	public async resolve(): Promise<void> {
		if (!this._resolvePromise) {
			this._resolvePromise = this._create();
		}
		return this._resolvePromise;
	}

	private async _create(): Promise<void> {
		const value = await this._factory.tokenizationSupport;
		this._isResolved = true;
		if (value && !this._isDisposed) {
			this._register(this._registry.register(this._languageId, value));
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/tokenizationTextModelPart.ts]---
Location: vscode-main/src/vs/editor/common/tokenizationTextModelPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Range } from './core/range.js';
import { StandardTokenType } from './encodedTokenAttributes.js';
import { LineTokens } from './tokens/lineTokens.js';
import { SparseMultilineTokens } from './tokens/sparseMultilineTokens.js';

/**
 * Provides tokenization related functionality of the text model.
*/
export interface ITokenizationTextModelPart {
	readonly hasTokens: boolean;

	/**
	 * Replaces all semantic tokens with the provided `tokens`.
	 * @internal
	 */
	setSemanticTokens(tokens: SparseMultilineTokens[] | null, isComplete: boolean): void;

	/**
	 * Merges the provided semantic tokens into existing semantic tokens.
	 * @internal
	 */
	setPartialSemanticTokens(range: Range, tokens: SparseMultilineTokens[] | null): void;

	/**
	 * @internal
	 */
	hasCompleteSemanticTokens(): boolean;

	/**
	 * @internal
	 */
	hasSomeSemanticTokens(): boolean;

	/**
	 * Flush all tokenization state.
	 * @internal
	 */
	resetTokenization(): void;

	/**
	 * Force tokenization information for `lineNumber` to be accurate.
	 * @internal
	 */
	forceTokenization(lineNumber: number): void;

	/**
	 * If it is cheap, force tokenization information for `lineNumber` to be accurate.
	 * This is based on a heuristic.
	 * @internal
	 */
	tokenizeIfCheap(lineNumber: number): void;

	/**
	 * Check if tokenization information is accurate for `lineNumber`.
	 * @internal
	 */
	hasAccurateTokensForLine(lineNumber: number): boolean;

	/**
	 * Check if calling `forceTokenization` for this `lineNumber` will be cheap (time-wise).
	 * This is based on a heuristic.
	 * @internal
	 */
	isCheapToTokenize(lineNumber: number): boolean;

	/**
	 * Get the tokens for the line `lineNumber`.
	 * The tokens might be inaccurate. Use `forceTokenization` to ensure accurate tokens.
	 * @internal
	 */
	getLineTokens(lineNumber: number): LineTokens;

	/**
	* Returns the standard token type for a character if the character were to be inserted at
	* the given position. If the result cannot be accurate, it returns null.
	* @internal
	*/
	getTokenTypeIfInsertingCharacter(lineNumber: number, column: number, character: string): StandardTokenType;

	/**
	 * Tokens the lines as if they were inserted at [lineNumber, lineNumber).
	 * @internal
	*/
	tokenizeLinesAt(lineNumber: number, lines: string[]): LineTokens[] | null;

	getLanguageId(): string;
	getLanguageIdAtPosition(lineNumber: number, column: number): string;

	setLanguageId(languageId: string, source?: string): void;

	readonly backgroundTokenizationState: BackgroundTokenizationState;
}

export const enum BackgroundTokenizationState {
	InProgress = 1,
	Completed = 2,
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/viewEventHandler.ts]---
Location: vscode-main/src/vs/editor/common/viewEventHandler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../base/common/lifecycle.js';
import * as viewEvents from './viewEvents.js';

export class ViewEventHandler extends Disposable {

	private _shouldRender: boolean;

	constructor() {
		super();
		this._shouldRender = true;
	}

	public shouldRender(): boolean {
		return this._shouldRender;
	}

	public forceShouldRender(): void {
		this._shouldRender = true;
	}

	protected setShouldRender(): void {
		this._shouldRender = true;
	}

	public onDidRender(): void {
		this._shouldRender = false;
	}

	// --- begin event handlers

	public onCompositionStart(e: viewEvents.ViewCompositionStartEvent): boolean {
		return false;
	}
	public onCompositionEnd(e: viewEvents.ViewCompositionEndEvent): boolean {
		return false;
	}
	public onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		return false;
	}
	public onCursorStateChanged(e: viewEvents.ViewCursorStateChangedEvent): boolean {
		return false;
	}
	public onDecorationsChanged(e: viewEvents.ViewDecorationsChangedEvent): boolean {
		return false;
	}
	public onFlushed(e: viewEvents.ViewFlushedEvent): boolean {
		return false;
	}
	public onFocusChanged(e: viewEvents.ViewFocusChangedEvent): boolean {
		return false;
	}
	public onLanguageConfigurationChanged(e: viewEvents.ViewLanguageConfigurationEvent): boolean {
		return false;
	}
	public onLineMappingChanged(e: viewEvents.ViewLineMappingChangedEvent): boolean {
		return false;
	}
	public onLinesChanged(e: viewEvents.ViewLinesChangedEvent): boolean {
		return false;
	}
	public onLinesDeleted(e: viewEvents.ViewLinesDeletedEvent): boolean {
		return false;
	}
	public onLinesInserted(e: viewEvents.ViewLinesInsertedEvent): boolean {
		return false;
	}
	public onRevealRangeRequest(e: viewEvents.ViewRevealRangeRequestEvent): boolean {
		return false;
	}
	public onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean {
		return false;
	}
	public onThemeChanged(e: viewEvents.ViewThemeChangedEvent): boolean {
		return false;
	}
	public onTokensChanged(e: viewEvents.ViewTokensChangedEvent): boolean {
		return false;
	}
	public onTokensColorsChanged(e: viewEvents.ViewTokensColorsChangedEvent): boolean {
		return false;
	}
	public onZonesChanged(e: viewEvents.ViewZonesChangedEvent): boolean {
		return false;
	}

	// --- end event handlers

	public handleEvents(events: viewEvents.ViewEvent[]): void {

		let shouldRender = false;

		for (let i = 0, len = events.length; i < len; i++) {
			const e = events[i];

			switch (e.type) {

				case viewEvents.ViewEventType.ViewCompositionStart:
					if (this.onCompositionStart(e)) {
						shouldRender = true;
					}
					break;

				case viewEvents.ViewEventType.ViewCompositionEnd:
					if (this.onCompositionEnd(e)) {
						shouldRender = true;
					}
					break;

				case viewEvents.ViewEventType.ViewConfigurationChanged:
					if (this.onConfigurationChanged(e)) {
						shouldRender = true;
					}
					break;

				case viewEvents.ViewEventType.ViewCursorStateChanged:
					if (this.onCursorStateChanged(e)) {
						shouldRender = true;
					}
					break;

				case viewEvents.ViewEventType.ViewDecorationsChanged:
					if (this.onDecorationsChanged(e)) {
						shouldRender = true;
					}
					break;

				case viewEvents.ViewEventType.ViewFlushed:
					if (this.onFlushed(e)) {
						shouldRender = true;
					}
					break;

				case viewEvents.ViewEventType.ViewFocusChanged:
					if (this.onFocusChanged(e)) {
						shouldRender = true;
					}
					break;

				case viewEvents.ViewEventType.ViewLanguageConfigurationChanged:
					if (this.onLanguageConfigurationChanged(e)) {
						shouldRender = true;
					}
					break;

				case viewEvents.ViewEventType.ViewLineMappingChanged:
					if (this.onLineMappingChanged(e)) {
						shouldRender = true;
					}
					break;

				case viewEvents.ViewEventType.ViewLinesChanged:
					if (this.onLinesChanged(e)) {
						shouldRender = true;
					}
					break;

				case viewEvents.ViewEventType.ViewLinesDeleted:
					if (this.onLinesDeleted(e)) {
						shouldRender = true;
					}
					break;

				case viewEvents.ViewEventType.ViewLinesInserted:
					if (this.onLinesInserted(e)) {
						shouldRender = true;
					}
					break;

				case viewEvents.ViewEventType.ViewRevealRangeRequest:
					if (this.onRevealRangeRequest(e)) {
						shouldRender = true;
					}
					break;

				case viewEvents.ViewEventType.ViewScrollChanged:
					if (this.onScrollChanged(e)) {
						shouldRender = true;
					}
					break;

				case viewEvents.ViewEventType.ViewTokensChanged:
					if (this.onTokensChanged(e)) {
						shouldRender = true;
					}
					break;

				case viewEvents.ViewEventType.ViewThemeChanged:
					if (this.onThemeChanged(e)) {
						shouldRender = true;
					}
					break;

				case viewEvents.ViewEventType.ViewTokensColorsChanged:
					if (this.onTokensColorsChanged(e)) {
						shouldRender = true;
					}
					break;

				case viewEvents.ViewEventType.ViewZonesChanged:
					if (this.onZonesChanged(e)) {
						shouldRender = true;
					}
					break;

				default:
					console.info('View received unknown event: ');
					console.info(e);
			}
		}

		if (shouldRender) {
			this._shouldRender = true;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/viewEvents.ts]---
Location: vscode-main/src/vs/editor/common/viewEvents.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ScrollEvent } from '../../base/common/scrollable.js';
import { ConfigurationChangedEvent, EditorOption } from './config/editorOptions.js';
import { Range } from './core/range.js';
import { Selection } from './core/selection.js';
import { CursorChangeReason } from './cursorEvents.js';
import { ScrollType } from './editorCommon.js';
import { IModelDecorationsChangedEvent } from './textModelEvents.js';
import { IColorTheme } from '../../platform/theme/common/themeService.js';

export const enum ViewEventType {
	ViewCompositionStart,
	ViewCompositionEnd,
	ViewConfigurationChanged,
	ViewCursorStateChanged,
	ViewDecorationsChanged,
	ViewFlushed,
	ViewFocusChanged,
	ViewLanguageConfigurationChanged,
	ViewLineMappingChanged,
	ViewLinesChanged,
	ViewLinesDeleted,
	ViewLinesInserted,
	ViewRevealRangeRequest,
	ViewScrollChanged,
	ViewThemeChanged,
	ViewTokensChanged,
	ViewTokensColorsChanged,
	ViewZonesChanged,
}

export class ViewCompositionStartEvent {
	public readonly type = ViewEventType.ViewCompositionStart;
	constructor() { }
}

export class ViewCompositionEndEvent {
	public readonly type = ViewEventType.ViewCompositionEnd;
	constructor() { }
}

export class ViewConfigurationChangedEvent {

	public readonly type = ViewEventType.ViewConfigurationChanged;

	public readonly _source: ConfigurationChangedEvent;

	constructor(source: ConfigurationChangedEvent) {
		this._source = source;
	}

	public hasChanged(id: EditorOption): boolean {
		return this._source.hasChanged(id);
	}
}

export class ViewCursorStateChangedEvent {

	public readonly type = ViewEventType.ViewCursorStateChanged;

	constructor(
		public readonly selections: Selection[],
		public readonly modelSelections: Selection[],
		public readonly reason: CursorChangeReason
	) { }
}

export class ViewDecorationsChangedEvent {

	public readonly type = ViewEventType.ViewDecorationsChanged;

	readonly affectsMinimap: boolean;
	readonly affectsOverviewRuler: boolean;
	readonly affectsGlyphMargin: boolean;
	readonly affectsLineNumber: boolean;

	constructor(source: IModelDecorationsChangedEvent | null) {
		if (source) {
			this.affectsMinimap = source.affectsMinimap;
			this.affectsOverviewRuler = source.affectsOverviewRuler;
			this.affectsGlyphMargin = source.affectsGlyphMargin;
			this.affectsLineNumber = source.affectsLineNumber;
		} else {
			this.affectsMinimap = true;
			this.affectsOverviewRuler = true;
			this.affectsGlyphMargin = true;
			this.affectsLineNumber = true;
		}
	}
}

export class ViewFlushedEvent {

	public readonly type = ViewEventType.ViewFlushed;

	constructor() {
		// Nothing to do
	}
}

export class ViewFocusChangedEvent {

	public readonly type = ViewEventType.ViewFocusChanged;

	public readonly isFocused: boolean;

	constructor(isFocused: boolean) {
		this.isFocused = isFocused;
	}
}

export class ViewLanguageConfigurationEvent {

	public readonly type = ViewEventType.ViewLanguageConfigurationChanged;
}

export class ViewLineMappingChangedEvent {

	public readonly type = ViewEventType.ViewLineMappingChanged;

	constructor() {
		// Nothing to do
	}
}

export class ViewLinesChangedEvent {

	public readonly type = ViewEventType.ViewLinesChanged;

	constructor(
		/**
		 * The first line that has changed.
		 */
		public readonly fromLineNumber: number,
		/**
		 * The number of lines that have changed.
		 */
		public readonly count: number,
	) { }
}

export class ViewLinesDeletedEvent {

	public readonly type = ViewEventType.ViewLinesDeleted;

	/**
	 * At what line the deletion began (inclusive).
	 */
	public readonly fromLineNumber: number;
	/**
	 * At what line the deletion stopped (inclusive).
	 */
	public readonly toLineNumber: number;

	constructor(fromLineNumber: number, toLineNumber: number) {
		this.fromLineNumber = fromLineNumber;
		this.toLineNumber = toLineNumber;
	}
}

export class ViewLinesInsertedEvent {

	public readonly type = ViewEventType.ViewLinesInserted;

	/**
	 * Before what line did the insertion begin
	 */
	public readonly fromLineNumber: number;
	/**
	 * `toLineNumber` - `fromLineNumber` + 1 denotes the number of lines that were inserted
	 */
	public readonly toLineNumber: number;

	constructor(fromLineNumber: number, toLineNumber: number) {
		this.fromLineNumber = fromLineNumber;
		this.toLineNumber = toLineNumber;
	}
}

export const enum VerticalRevealType {
	Simple = 0,
	Center = 1,
	CenterIfOutsideViewport = 2,
	Top = 3,
	Bottom = 4,
	NearTop = 5,
	NearTopIfOutsideViewport = 6,
}

export class ViewRevealRangeRequestEvent {

	public readonly type = ViewEventType.ViewRevealRangeRequest;


	constructor(
		/**
		 * Source of the call that caused the event.
		 */
		public readonly source: string | null | undefined,
		/**
		 * Reduce the revealing to a minimum (e.g. avoid scrolling if the bounding box is visible and near the viewport edge).
		 */
		public readonly minimalReveal: boolean,
		/**
		 * Range to be reavealed.
		 */
		public readonly range: Range | null,
		/**
		 * Selections to be revealed.
		 */
		public readonly selections: Selection[] | null,
		/**
		 * The vertical reveal strategy.
		 */
		public readonly verticalType: VerticalRevealType,
		/**
		 * If true: there should be a horizontal & vertical revealing.
		 * If false: there should be just a vertical revealing.
		 */
		public readonly revealHorizontal: boolean,
		/**
		 * The scroll type.
		 */
		public readonly scrollType: ScrollType
	) { }
}

export class ViewScrollChangedEvent {

	public readonly type = ViewEventType.ViewScrollChanged;

	public readonly scrollWidth: number;
	public readonly scrollLeft: number;
	public readonly scrollHeight: number;
	public readonly scrollTop: number;

	public readonly scrollWidthChanged: boolean;
	public readonly scrollLeftChanged: boolean;
	public readonly scrollHeightChanged: boolean;
	public readonly scrollTopChanged: boolean;

	constructor(source: ScrollEvent) {
		this.scrollWidth = source.scrollWidth;
		this.scrollLeft = source.scrollLeft;
		this.scrollHeight = source.scrollHeight;
		this.scrollTop = source.scrollTop;

		this.scrollWidthChanged = source.scrollWidthChanged;
		this.scrollLeftChanged = source.scrollLeftChanged;
		this.scrollHeightChanged = source.scrollHeightChanged;
		this.scrollTopChanged = source.scrollTopChanged;
	}
}

export class ViewThemeChangedEvent {

	public readonly type = ViewEventType.ViewThemeChanged;

	constructor(
		public readonly theme: IColorTheme
	) { }
}

export class ViewTokensChangedEvent {

	public readonly type = ViewEventType.ViewTokensChanged;

	public readonly ranges: {
		/**
		 * Start line number of range
		 */
		readonly fromLineNumber: number;
		/**
		 * End line number of range
		 */
		readonly toLineNumber: number;
	}[];

	constructor(ranges: { fromLineNumber: number; toLineNumber: number }[]) {
		this.ranges = ranges;
	}
}

export class ViewTokensColorsChangedEvent {

	public readonly type = ViewEventType.ViewTokensColorsChanged;

	constructor() {
		// Nothing to do
	}
}

export class ViewZonesChangedEvent {

	public readonly type = ViewEventType.ViewZonesChanged;

	constructor() {
		// Nothing to do
	}
}

export type ViewEvent = (
	ViewCompositionStartEvent
	| ViewCompositionEndEvent
	| ViewConfigurationChangedEvent
	| ViewCursorStateChangedEvent
	| ViewDecorationsChangedEvent
	| ViewFlushedEvent
	| ViewFocusChangedEvent
	| ViewLanguageConfigurationEvent
	| ViewLineMappingChangedEvent
	| ViewLinesChangedEvent
	| ViewLinesDeletedEvent
	| ViewLinesInsertedEvent
	| ViewRevealRangeRequestEvent
	| ViewScrollChangedEvent
	| ViewThemeChangedEvent
	| ViewTokensChangedEvent
	| ViewTokensColorsChangedEvent
	| ViewZonesChangedEvent
);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/viewModel.ts]---
Location: vscode-main/src/vs/editor/common/viewModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as arrays from '../../base/common/arrays.js';
import { IScrollPosition, Scrollable } from '../../base/common/scrollable.js';
import * as strings from '../../base/common/strings.js';
import { ISimpleModel } from './viewModel/screenReaderSimpleModel.js';
import { ICoordinatesConverter } from './coordinatesConverter.js';
import { IPosition, Position } from './core/position.js';
import { Range } from './core/range.js';
import { CursorConfiguration, CursorState, EditOperationType, IColumnSelectData, ICursorSimpleModel, PartialCursorState } from './cursorCommon.js';
import { CursorChangeReason } from './cursorEvents.js';
import { INewScrollPosition, ScrollType } from './editorCommon.js';
import { EditorTheme } from './editorTheme.js';
import { EndOfLinePreference, IGlyphMarginLanesModel, IModelDecorationOptions, ITextModel, TextDirection } from './model.js';
import { ILineBreaksComputer, InjectedText } from './modelLineProjectionData.js';
import { BracketGuideOptions, IActiveIndentGuideInfo, IndentGuide } from './textModelGuides.js';
import { IViewLineTokens } from './tokens/lineTokens.js';
import { ViewEventHandler } from './viewEventHandler.js';
import { VerticalRevealType } from './viewEvents.js';
import { InlineDecoration, SingleLineInlineDecoration } from './viewModel/inlineDecorations.js';

export interface IViewModel extends ICursorSimpleModel, ISimpleModel {

	readonly model: ITextModel;

	readonly coordinatesConverter: ICoordinatesConverter;

	readonly viewLayout: IViewLayout;

	readonly cursorConfig: CursorConfiguration;

	readonly glyphLanes: IGlyphMarginLanesModel;

	addViewEventHandler(eventHandler: ViewEventHandler): void;
	removeViewEventHandler(eventHandler: ViewEventHandler): void;

	/**
	 * Gives a hint that a lot of requests are about to come in for these line numbers.
	 */
	setViewport(startLineNumber: number, endLineNumber: number, centeredLineNumber: number): void;
	visibleLinesStabilized(): void;
	setHasFocus(hasFocus: boolean): void;
	setHasWidgetFocus(hasWidgetFocus: boolean): void;
	onCompositionStart(): void;
	onCompositionEnd(): void;

	getFontSizeAtPosition(position: IPosition): string | null;
	getMinimapDecorationsInRange(range: Range): ViewModelDecoration[];
	getDecorationsInViewport(visibleRange: Range): ViewModelDecoration[];
	getTextDirection(lineNumber: number): TextDirection;
	getViewportViewLineRenderingData(visibleRange: Range, lineNumber: number): ViewLineRenderingData;
	getViewLineRenderingData(lineNumber: number): ViewLineRenderingData;
	getViewLineData(lineNumber: number): ViewLineData;
	getMinimapLinesRenderingData(startLineNumber: number, endLineNumber: number, needed: boolean[]): MinimapLinesRenderingData;
	getCompletelyVisibleViewRange(): Range;
	getCompletelyVisibleViewRangeAtScrollTop(scrollTop: number): Range;

	getHiddenAreas(): Range[];

	getLineCount(): number;
	getLineContent(lineNumber: number): string;
	getLineLength(lineNumber: number): number;
	getActiveIndentGuide(lineNumber: number, minLineNumber: number, maxLineNumber: number): IActiveIndentGuideInfo;
	getLinesIndentGuides(startLineNumber: number, endLineNumber: number): number[];
	getBracketGuidesInRangeByLine(startLineNumber: number, endLineNumber: number, activePosition: IPosition | null, options: BracketGuideOptions): IndentGuide[][];
	getLineMinColumn(lineNumber: number): number;
	getLineMaxColumn(lineNumber: number): number;
	getLineFirstNonWhitespaceColumn(lineNumber: number): number;
	getLineLastNonWhitespaceColumn(lineNumber: number): number;
	getAllOverviewRulerDecorations(theme: EditorTheme): OverviewRulerDecorationsGroup[];
	getValueInRange(range: Range, eol: EndOfLinePreference): string;
	getValueLengthInRange(range: Range, eol: EndOfLinePreference): number;
	modifyPosition(position: Position, offset: number): Position;

	getInjectedTextAt(viewPosition: Position): InjectedText | null;

	deduceModelPositionRelativeToViewPosition(viewAnchorPosition: Position, deltaOffset: number, lineFeedCnt: number): Position;
	getPlainTextToCopy(modelRanges: Range[], emptySelectionClipboard: boolean, forceCRLF: boolean): string | string[];
	getRichTextToCopy(modelRanges: Range[], emptySelectionClipboard: boolean): { html: string; mode: string } | null;

	createLineBreaksComputer(): ILineBreaksComputer;

	//#region cursor
	getPrimaryCursorState(): CursorState;
	getLastAddedCursorIndex(): number;
	getCursorStates(): CursorState[];
	setCursorStates(source: string | null | undefined, reason: CursorChangeReason, states: PartialCursorState[] | null): boolean;
	getCursorColumnSelectData(): IColumnSelectData;
	getCursorAutoClosedCharacters(): Range[];
	setCursorColumnSelectData(columnSelectData: IColumnSelectData): void;
	getPrevEditOperationType(): EditOperationType;
	setPrevEditOperationType(type: EditOperationType): void;
	revealAllCursors(source: string | null | undefined, revealHorizontal: boolean, minimalReveal?: boolean): void;
	revealPrimaryCursor(source: string | null | undefined, revealHorizontal: boolean, minimalReveal?: boolean): void;
	revealTopMostCursor(source: string | null | undefined): void;
	revealBottomMostCursor(source: string | null | undefined): void;
	revealRange(source: string | null | undefined, revealHorizontal: boolean, viewRange: Range, verticalType: VerticalRevealType, scrollType: ScrollType): void;
	//#endregion

	//#region viewLayout
	changeWhitespace(callback: (accessor: IWhitespaceChangeAccessor) => void): void;
	//#endregion

	batchEvents(callback: () => void): void;
}

export interface IViewLayout {

	getScrollable(): Scrollable;

	getScrollWidth(): number;
	getScrollHeight(): number;

	getCurrentScrollLeft(): number;
	getCurrentScrollTop(): number;
	getCurrentViewport(): Viewport;

	getFutureViewport(): Viewport;

	setScrollPosition(position: INewScrollPosition, type: ScrollType): void;
	deltaScrollNow(deltaScrollLeft: number, deltaScrollTop: number): void;

	validateScrollPosition(scrollPosition: INewScrollPosition): IScrollPosition;

	setMaxLineWidth(maxLineWidth: number): void;
	setOverlayWidgetsMinWidth(overlayWidgetsMinWidth: number): void;

	getLinesViewportData(): IPartialViewLinesViewportData;
	getLinesViewportDataAtScrollTop(scrollTop: number): IPartialViewLinesViewportData;
	getWhitespaces(): IEditorWhitespace[];

	isAfterLines(verticalOffset: number): boolean;
	isInTopPadding(verticalOffset: number): boolean;
	isInBottomPadding(verticalOffset: number): boolean;
	getLineNumberAtVerticalOffset(verticalOffset: number): number;
	getVerticalOffsetForLineNumber(lineNumber: number, includeViewZones?: boolean): number;
	getVerticalOffsetAfterLineNumber(lineNumber: number, includeViewZones?: boolean): number;
	getLineHeightForLineNumber(lineNumber: number): number;
	getWhitespaceAtVerticalOffset(verticalOffset: number): IViewWhitespaceViewportData | null;

	/**
	 * Get the layout information for whitespaces currently in the viewport
	 */
	getWhitespaceViewportData(): IViewWhitespaceViewportData[];
}

export interface IEditorWhitespace {
	readonly id: string;
	readonly afterLineNumber: number;
	readonly height: number;
}

/**
 * An accessor that allows for whitespace to be added, removed or changed in bulk.
 */
export interface IWhitespaceChangeAccessor {
	insertWhitespace(afterLineNumber: number, ordinal: number, heightInPx: number, minWidth: number): string;
	changeOneWhitespace(id: string, newAfterLineNumber: number, newHeight: number): void;
	removeWhitespace(id: string): void;
}

export interface ILineHeightChangeAccessor {
	insertOrChangeCustomLineHeight(decorationId: string, startLineNumber: number, endLineNumber: number, lineHeight: number): void;
	removeCustomLineHeight(decorationId: string): void;
}

export interface IPartialViewLinesViewportData {
	/**
	 * Value to be substracted from `scrollTop` (in order to vertical offset numbers < 1MM)
	 */
	readonly bigNumbersDelta: number;
	/**
	 * The first (partially) visible line number.
	 */
	readonly startLineNumber: number;
	/**
	 * The last (partially) visible line number.
	 */
	readonly endLineNumber: number;
	/**
	 * relativeVerticalOffset[i] is the `top` position for line at `i` + `startLineNumber`.
	 */
	readonly relativeVerticalOffset: number[];
	/**
	 * The centered line in the viewport.
	 */
	readonly centeredLineNumber: number;
	/**
	 * The first completely visible line number.
	 */
	readonly completelyVisibleStartLineNumber: number;
	/**
	 * The last completely visible line number.
	 */
	readonly completelyVisibleEndLineNumber: number;

	/**
	 * The height of a line.
	 */
	readonly lineHeight: number;
}

export interface IViewWhitespaceViewportData {
	readonly id: string;
	readonly afterLineNumber: number;
	readonly verticalOffset: number;
	readonly height: number;
}

export class Viewport {
	readonly _viewportBrand: void = undefined;

	readonly top: number;
	readonly left: number;
	readonly width: number;
	readonly height: number;

	constructor(top: number, left: number, width: number, height: number) {
		this.top = top | 0;
		this.left = left | 0;
		this.width = width | 0;
		this.height = height | 0;
	}
}

export class MinimapLinesRenderingData {
	public readonly tabSize: number;
	public readonly data: Array<ViewLineData | null>;

	constructor(
		tabSize: number,
		data: Array<ViewLineData | null>
	) {
		this.tabSize = tabSize;
		this.data = data;
	}
}

export class ViewLineData {
	_viewLineDataBrand: void = undefined;

	/**
	 * The content at this view line.
	 */
	public readonly content: string;
	/**
	 * Does this line continue with a wrapped line?
	 */
	public readonly continuesWithWrappedLine: boolean;
	/**
	 * The minimum allowed column at this view line.
	 */
	public readonly minColumn: number;
	/**
	 * The maximum allowed column at this view line.
	 */
	public readonly maxColumn: number;
	/**
	 * The visible column at the start of the line (after the fauxIndent).
	 */
	public readonly startVisibleColumn: number;
	/**
	 * The tokens at this view line.
	 */
	public readonly tokens: IViewLineTokens;

	/**
	 * Additional inline decorations for this line.
	*/
	public readonly inlineDecorations: readonly SingleLineInlineDecoration[] | null;

	constructor(
		content: string,
		continuesWithWrappedLine: boolean,
		minColumn: number,
		maxColumn: number,
		startVisibleColumn: number,
		tokens: IViewLineTokens,
		inlineDecorations: readonly SingleLineInlineDecoration[] | null
	) {
		this.content = content;
		this.continuesWithWrappedLine = continuesWithWrappedLine;
		this.minColumn = minColumn;
		this.maxColumn = maxColumn;
		this.startVisibleColumn = startVisibleColumn;
		this.tokens = tokens;
		this.inlineDecorations = inlineDecorations;
	}
}

export class ViewLineRenderingData {
	/**
	 * The minimum allowed column at this view line.
	 */
	public readonly minColumn: number;
	/**
	 * The maximum allowed column at this view line.
	 */
	public readonly maxColumn: number;
	/**
	 * The content at this view line.
	 */
	public readonly content: string;
	/**
	 * Does this line continue with a wrapped line?
	 */
	public readonly continuesWithWrappedLine: boolean;
	/**
	 * Describes if `content` contains RTL characters.
	 */
	public readonly containsRTL: boolean;
	/**
	 * Describes if `content` contains non basic ASCII chars.
	 */
	public readonly isBasicASCII: boolean;
	/**
	 * The tokens at this view line.
	 */
	public readonly tokens: IViewLineTokens;
	/**
	 * Inline decorations at this view line.
	 */
	public readonly inlineDecorations: InlineDecoration[];
	/**
	 * The tab size for this view model.
	 */
	public readonly tabSize: number;
	/**
	 * The visible column at the start of the line (after the fauxIndent)
	 */
	public readonly startVisibleColumn: number;
	/**
	 * The direction to use for rendering the line.
	 */
	public readonly textDirection: TextDirection;
	/**
	 * Whether the line has variable fonts
	 */
	public readonly hasVariableFonts: boolean;

	constructor(
		minColumn: number,
		maxColumn: number,
		content: string,
		continuesWithWrappedLine: boolean,
		mightContainRTL: boolean,
		mightContainNonBasicASCII: boolean,
		tokens: IViewLineTokens,
		inlineDecorations: InlineDecoration[],
		tabSize: number,
		startVisibleColumn: number,
		textDirection: TextDirection,
		hasVariableFonts: boolean
	) {
		this.minColumn = minColumn;
		this.maxColumn = maxColumn;
		this.content = content;
		this.continuesWithWrappedLine = continuesWithWrappedLine;

		this.isBasicASCII = ViewLineRenderingData.isBasicASCII(content, mightContainNonBasicASCII);
		this.containsRTL = ViewLineRenderingData.containsRTL(content, this.isBasicASCII, mightContainRTL);

		this.tokens = tokens;
		this.inlineDecorations = inlineDecorations;
		this.tabSize = tabSize;
		this.startVisibleColumn = startVisibleColumn;
		this.textDirection = textDirection;
		this.hasVariableFonts = hasVariableFonts;
	}

	public static isBasicASCII(lineContent: string, mightContainNonBasicASCII: boolean): boolean {
		if (mightContainNonBasicASCII) {
			return strings.isBasicASCII(lineContent);
		}
		return true;
	}

	public static containsRTL(lineContent: string, isBasicASCII: boolean, mightContainRTL: boolean): boolean {
		if (!isBasicASCII && mightContainRTL) {
			return strings.containsRTL(lineContent);
		}
		return false;
	}
}

export class ViewModelDecoration {
	_viewModelDecorationBrand: void = undefined;

	public readonly range: Range;
	public readonly options: IModelDecorationOptions;

	constructor(range: Range, options: IModelDecorationOptions) {
		this.range = range;
		this.options = options;
	}
}

export class OverviewRulerDecorationsGroup {

	constructor(
		public readonly color: string,
		public readonly zIndex: number,
		/**
		 * Decorations are encoded in a number array using the following scheme:
		 *  - 3*i = lane
		 *  - 3*i+1 = startLineNumber
		 *  - 3*i+2 = endLineNumber
		 */
		public readonly data: number[]
	) { }

	public static compareByRenderingProps(a: OverviewRulerDecorationsGroup, b: OverviewRulerDecorationsGroup): number {
		if (a.zIndex === b.zIndex) {
			if (a.color < b.color) {
				return -1;
			}
			if (a.color > b.color) {
				return 1;
			}
			return 0;
		}
		return a.zIndex - b.zIndex;
	}

	public static equals(a: OverviewRulerDecorationsGroup, b: OverviewRulerDecorationsGroup): boolean {
		return (
			a.color === b.color
			&& a.zIndex === b.zIndex
			&& arrays.equals(a.data, b.data)
		);
	}

	public static equalsArr(a: OverviewRulerDecorationsGroup[], b: OverviewRulerDecorationsGroup[]): boolean {
		return arrays.equals(a, b, OverviewRulerDecorationsGroup.equals);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/viewModelEventDispatcher.ts]---
Location: vscode-main/src/vs/editor/common/viewModelEventDispatcher.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ViewEventHandler } from './viewEventHandler.js';
import { ViewEvent } from './viewEvents.js';
import { IContentSizeChangedEvent } from './editorCommon.js';
import { Emitter } from '../../base/common/event.js';
import { Selection } from './core/selection.js';
import { Disposable } from '../../base/common/lifecycle.js';
import { CursorChangeReason } from './cursorEvents.js';
import { ModelLineHeightChangedEvent as OriginalModelLineHeightChangedEvent, ModelFontChangedEvent as OriginalModelFontChangedEvent, IModelContentChangedEvent, IModelDecorationsChangedEvent, IModelLanguageChangedEvent, IModelLanguageConfigurationChangedEvent, IModelOptionsChangedEvent, IModelTokensChangedEvent } from './textModelEvents.js';

export class ViewModelEventDispatcher extends Disposable {

	private readonly _onEvent = this._register(new Emitter<OutgoingViewModelEvent>());
	public readonly onEvent = this._onEvent.event;

	private readonly _eventHandlers: ViewEventHandler[];
	private _viewEventQueue: ViewEvent[] | null;
	private _isConsumingViewEventQueue: boolean;
	private _collector: ViewModelEventsCollector | null;
	private _collectorCnt: number;
	private _outgoingEvents: OutgoingViewModelEvent[];

	constructor() {
		super();
		this._eventHandlers = [];
		this._viewEventQueue = null;
		this._isConsumingViewEventQueue = false;
		this._collector = null;
		this._collectorCnt = 0;
		this._outgoingEvents = [];
	}

	public emitOutgoingEvent(e: OutgoingViewModelEvent): void {
		this._addOutgoingEvent(e);
		this._emitOutgoingEvents();
	}

	private _addOutgoingEvent(e: OutgoingViewModelEvent): void {
		for (let i = 0, len = this._outgoingEvents.length; i < len; i++) {
			const mergeResult = (this._outgoingEvents[i].kind === e.kind ? this._outgoingEvents[i].attemptToMerge(e) : null);
			if (mergeResult) {
				this._outgoingEvents[i] = mergeResult;
				return;
			}
		}
		// not merged
		this._outgoingEvents.push(e);
	}

	private _emitOutgoingEvents(): void {
		while (this._outgoingEvents.length > 0) {
			if (this._collector || this._isConsumingViewEventQueue) {
				// right now collecting or emitting view events, so let's postpone emitting
				return;
			}
			const event = this._outgoingEvents.shift()!;
			if (event.isNoOp()) {
				continue;
			}
			this._onEvent.fire(event);
		}
	}

	public addViewEventHandler(eventHandler: ViewEventHandler): void {
		for (let i = 0, len = this._eventHandlers.length; i < len; i++) {
			if (this._eventHandlers[i] === eventHandler) {
				console.warn('Detected duplicate listener in ViewEventDispatcher', eventHandler);
			}
		}
		this._eventHandlers.push(eventHandler);
	}

	public removeViewEventHandler(eventHandler: ViewEventHandler): void {
		for (let i = 0; i < this._eventHandlers.length; i++) {
			if (this._eventHandlers[i] === eventHandler) {
				this._eventHandlers.splice(i, 1);
				break;
			}
		}
	}

	public beginEmitViewEvents(): ViewModelEventsCollector {
		this._collectorCnt++;
		if (this._collectorCnt === 1) {
			this._collector = new ViewModelEventsCollector();
		}
		return this._collector!;
	}

	public endEmitViewEvents(): void {
		this._collectorCnt--;
		if (this._collectorCnt === 0) {
			const outgoingEvents = this._collector!.outgoingEvents;
			const viewEvents = this._collector!.viewEvents;
			this._collector = null;

			for (const outgoingEvent of outgoingEvents) {
				this._addOutgoingEvent(outgoingEvent);
			}

			if (viewEvents.length > 0) {
				this._emitMany(viewEvents);
			}
		}
		this._emitOutgoingEvents();
	}

	public emitSingleViewEvent(event: ViewEvent): void {
		try {
			const eventsCollector = this.beginEmitViewEvents();
			eventsCollector.emitViewEvent(event);
		} finally {
			this.endEmitViewEvents();
		}
	}

	private _emitMany(events: ViewEvent[]): void {
		if (this._viewEventQueue) {
			this._viewEventQueue = this._viewEventQueue.concat(events);
		} else {
			this._viewEventQueue = events;
		}

		if (!this._isConsumingViewEventQueue) {
			this._consumeViewEventQueue();
		}
	}

	private _consumeViewEventQueue(): void {
		try {
			this._isConsumingViewEventQueue = true;
			this._doConsumeQueue();
		} finally {
			this._isConsumingViewEventQueue = false;
		}
	}

	private _doConsumeQueue(): void {
		while (this._viewEventQueue) {
			// Empty event queue, as events might come in while sending these off
			const events = this._viewEventQueue;
			this._viewEventQueue = null;

			// Use a clone of the event handlers list, as they might remove themselves
			const eventHandlers = this._eventHandlers.slice(0);
			for (const eventHandler of eventHandlers) {
				eventHandler.handleEvents(events);
			}
		}
	}
}

export class ViewModelEventsCollector {

	public readonly viewEvents: ViewEvent[];
	public readonly outgoingEvents: OutgoingViewModelEvent[];

	constructor() {
		this.viewEvents = [];
		this.outgoingEvents = [];
	}

	public emitViewEvent(event: ViewEvent) {
		this.viewEvents.push(event);
	}

	public emitOutgoingEvent(e: OutgoingViewModelEvent): void {
		this.outgoingEvents.push(e);
	}
}

export type OutgoingViewModelEvent = (
	ContentSizeChangedEvent
	| FocusChangedEvent
	| WidgetFocusChangedEvent
	| ScrollChangedEvent
	| ViewZonesChangedEvent
	| HiddenAreasChangedEvent
	| ReadOnlyEditAttemptEvent
	| CursorStateChangedEvent
	| ModelDecorationsChangedEvent
	| ModelLanguageChangedEvent
	| ModelLanguageConfigurationChangedEvent
	| ModelContentChangedEvent
	| ModelOptionsChangedEvent
	| ModelTokensChangedEvent
	| ModelLineHeightChangedEvent
	| ModelFontChangedEvent
);

export const enum OutgoingViewModelEventKind {
	ContentSizeChanged,
	FocusChanged,
	WidgetFocusChanged,
	ScrollChanged,
	ViewZonesChanged,
	HiddenAreasChanged,
	ReadOnlyEditAttempt,
	CursorStateChanged,
	ModelDecorationsChanged,
	ModelLanguageChanged,
	ModelLanguageConfigurationChanged,
	ModelContentChanged,
	ModelOptionsChanged,
	ModelTokensChanged,
	ModelLineHeightChanged,
	ModelFontChangedEvent
}

export class ContentSizeChangedEvent implements IContentSizeChangedEvent {

	public readonly kind = OutgoingViewModelEventKind.ContentSizeChanged;

	private readonly _oldContentWidth: number;
	private readonly _oldContentHeight: number;

	readonly contentWidth: number;
	readonly contentHeight: number;
	readonly contentWidthChanged: boolean;
	readonly contentHeightChanged: boolean;

	constructor(oldContentWidth: number, oldContentHeight: number, contentWidth: number, contentHeight: number) {
		this._oldContentWidth = oldContentWidth;
		this._oldContentHeight = oldContentHeight;
		this.contentWidth = contentWidth;
		this.contentHeight = contentHeight;
		this.contentWidthChanged = (this._oldContentWidth !== this.contentWidth);
		this.contentHeightChanged = (this._oldContentHeight !== this.contentHeight);
	}

	public isNoOp(): boolean {
		return (!this.contentWidthChanged && !this.contentHeightChanged);
	}

	public attemptToMerge(other: OutgoingViewModelEvent): OutgoingViewModelEvent | null {
		if (other.kind !== this.kind) {
			return null;
		}
		return new ContentSizeChangedEvent(this._oldContentWidth, this._oldContentHeight, other.contentWidth, other.contentHeight);
	}
}

export class FocusChangedEvent {

	public readonly kind = OutgoingViewModelEventKind.FocusChanged;

	readonly oldHasFocus: boolean;
	readonly hasFocus: boolean;

	constructor(oldHasFocus: boolean, hasFocus: boolean) {
		this.oldHasFocus = oldHasFocus;
		this.hasFocus = hasFocus;
	}

	public isNoOp(): boolean {
		return (this.oldHasFocus === this.hasFocus);
	}

	public attemptToMerge(other: OutgoingViewModelEvent): OutgoingViewModelEvent | null {
		if (other.kind !== this.kind) {
			return null;
		}
		return new FocusChangedEvent(this.oldHasFocus, other.hasFocus);
	}
}

export class WidgetFocusChangedEvent {

	public readonly kind = OutgoingViewModelEventKind.WidgetFocusChanged;

	readonly oldHasFocus: boolean;
	readonly hasFocus: boolean;

	constructor(oldHasFocus: boolean, hasFocus: boolean) {
		this.oldHasFocus = oldHasFocus;
		this.hasFocus = hasFocus;
	}

	public isNoOp(): boolean {
		return (this.oldHasFocus === this.hasFocus);
	}

	public attemptToMerge(other: OutgoingViewModelEvent): OutgoingViewModelEvent | null {
		if (other.kind !== this.kind) {
			return null;
		}
		return new FocusChangedEvent(this.oldHasFocus, other.hasFocus);
	}
}

export class ScrollChangedEvent {

	public readonly kind = OutgoingViewModelEventKind.ScrollChanged;

	private readonly _oldScrollWidth: number;
	private readonly _oldScrollLeft: number;
	private readonly _oldScrollHeight: number;
	private readonly _oldScrollTop: number;

	public readonly scrollWidth: number;
	public readonly scrollLeft: number;
	public readonly scrollHeight: number;
	public readonly scrollTop: number;

	public readonly scrollWidthChanged: boolean;
	public readonly scrollLeftChanged: boolean;
	public readonly scrollHeightChanged: boolean;
	public readonly scrollTopChanged: boolean;

	constructor(
		oldScrollWidth: number, oldScrollLeft: number, oldScrollHeight: number, oldScrollTop: number,
		scrollWidth: number, scrollLeft: number, scrollHeight: number, scrollTop: number,
	) {
		this._oldScrollWidth = oldScrollWidth;
		this._oldScrollLeft = oldScrollLeft;
		this._oldScrollHeight = oldScrollHeight;
		this._oldScrollTop = oldScrollTop;

		this.scrollWidth = scrollWidth;
		this.scrollLeft = scrollLeft;
		this.scrollHeight = scrollHeight;
		this.scrollTop = scrollTop;

		this.scrollWidthChanged = (this._oldScrollWidth !== this.scrollWidth);
		this.scrollLeftChanged = (this._oldScrollLeft !== this.scrollLeft);
		this.scrollHeightChanged = (this._oldScrollHeight !== this.scrollHeight);
		this.scrollTopChanged = (this._oldScrollTop !== this.scrollTop);
	}

	public isNoOp(): boolean {
		return (!this.scrollWidthChanged && !this.scrollLeftChanged && !this.scrollHeightChanged && !this.scrollTopChanged);
	}

	public attemptToMerge(other: OutgoingViewModelEvent): OutgoingViewModelEvent | null {
		if (other.kind !== this.kind) {
			return null;
		}
		return new ScrollChangedEvent(
			this._oldScrollWidth, this._oldScrollLeft, this._oldScrollHeight, this._oldScrollTop,
			other.scrollWidth, other.scrollLeft, other.scrollHeight, other.scrollTop
		);
	}
}

export class ViewZonesChangedEvent {

	public readonly kind = OutgoingViewModelEventKind.ViewZonesChanged;

	constructor() {
	}

	public isNoOp(): boolean {
		return false;
	}

	public attemptToMerge(other: OutgoingViewModelEvent): OutgoingViewModelEvent | null {
		if (other.kind !== this.kind) {
			return null;
		}
		return this;
	}
}

export class HiddenAreasChangedEvent {

	public readonly kind = OutgoingViewModelEventKind.HiddenAreasChanged;

	constructor() {
	}

	public isNoOp(): boolean {
		return false;
	}

	public attemptToMerge(other: OutgoingViewModelEvent): OutgoingViewModelEvent | null {
		if (other.kind !== this.kind) {
			return null;
		}
		return this;
	}
}

export class CursorStateChangedEvent {

	public readonly kind = OutgoingViewModelEventKind.CursorStateChanged;

	public readonly oldSelections: Selection[] | null;
	public readonly selections: Selection[];
	public readonly oldModelVersionId: number;
	public readonly modelVersionId: number;
	public readonly source: string;
	public readonly reason: CursorChangeReason;
	public readonly reachedMaxCursorCount: boolean;

	constructor(oldSelections: Selection[] | null, selections: Selection[], oldModelVersionId: number, modelVersionId: number, source: string, reason: CursorChangeReason, reachedMaxCursorCount: boolean) {
		this.oldSelections = oldSelections;
		this.selections = selections;
		this.oldModelVersionId = oldModelVersionId;
		this.modelVersionId = modelVersionId;
		this.source = source;
		this.reason = reason;
		this.reachedMaxCursorCount = reachedMaxCursorCount;
	}

	private static _selectionsAreEqual(a: Selection[] | null, b: Selection[] | null): boolean {
		if (!a && !b) {
			return true;
		}
		if (!a || !b) {
			return false;
		}
		const aLen = a.length;
		const bLen = b.length;
		if (aLen !== bLen) {
			return false;
		}
		for (let i = 0; i < aLen; i++) {
			if (!a[i].equalsSelection(b[i])) {
				return false;
			}
		}
		return true;
	}

	public isNoOp(): boolean {
		return (
			CursorStateChangedEvent._selectionsAreEqual(this.oldSelections, this.selections)
			&& this.oldModelVersionId === this.modelVersionId
		);
	}

	public attemptToMerge(other: OutgoingViewModelEvent): OutgoingViewModelEvent | null {
		if (other.kind !== this.kind) {
			return null;
		}
		return new CursorStateChangedEvent(
			this.oldSelections, other.selections, this.oldModelVersionId, other.modelVersionId, other.source, other.reason, this.reachedMaxCursorCount || other.reachedMaxCursorCount
		);
	}
}

export class ReadOnlyEditAttemptEvent {

	public readonly kind = OutgoingViewModelEventKind.ReadOnlyEditAttempt;

	constructor() {
	}

	public isNoOp(): boolean {
		return false;
	}

	public attemptToMerge(other: OutgoingViewModelEvent): OutgoingViewModelEvent | null {
		if (other.kind !== this.kind) {
			return null;
		}
		return this;
	}
}

export class ModelDecorationsChangedEvent {
	public readonly kind = OutgoingViewModelEventKind.ModelDecorationsChanged;

	constructor(
		public readonly event: IModelDecorationsChangedEvent
	) { }

	public isNoOp(): boolean {
		return false;
	}

	public attemptToMerge(other: OutgoingViewModelEvent): OutgoingViewModelEvent | null {
		return null;
	}
}

export class ModelLanguageChangedEvent {
	public readonly kind = OutgoingViewModelEventKind.ModelLanguageChanged;

	constructor(
		public readonly event: IModelLanguageChangedEvent
	) { }

	public isNoOp(): boolean {
		return false;
	}

	public attemptToMerge(other: OutgoingViewModelEvent): OutgoingViewModelEvent | null {
		return null;
	}
}

export class ModelLanguageConfigurationChangedEvent {
	public readonly kind = OutgoingViewModelEventKind.ModelLanguageConfigurationChanged;

	constructor(
		public readonly event: IModelLanguageConfigurationChangedEvent
	) { }

	public isNoOp(): boolean {
		return false;
	}

	public attemptToMerge(other: OutgoingViewModelEvent): OutgoingViewModelEvent | null {
		return null;
	}
}

export class ModelContentChangedEvent {
	public readonly kind = OutgoingViewModelEventKind.ModelContentChanged;

	constructor(
		public readonly event: IModelContentChangedEvent
	) { }

	public isNoOp(): boolean {
		return false;
	}

	public attemptToMerge(other: OutgoingViewModelEvent): OutgoingViewModelEvent | null {
		return null;
	}
}

export class ModelOptionsChangedEvent {
	public readonly kind = OutgoingViewModelEventKind.ModelOptionsChanged;

	constructor(
		public readonly event: IModelOptionsChangedEvent
	) { }

	public isNoOp(): boolean {
		return false;
	}

	public attemptToMerge(other: OutgoingViewModelEvent): OutgoingViewModelEvent | null {
		return null;
	}
}

export class ModelTokensChangedEvent {
	public readonly kind = OutgoingViewModelEventKind.ModelTokensChanged;

	constructor(
		public readonly event: IModelTokensChangedEvent
	) { }

	public isNoOp(): boolean {
		return false;
	}

	public attemptToMerge(other: OutgoingViewModelEvent): OutgoingViewModelEvent | null {
		return null;
	}
}

export class ModelLineHeightChangedEvent {
	public readonly kind = OutgoingViewModelEventKind.ModelLineHeightChanged;

	constructor(
		public readonly event: OriginalModelLineHeightChangedEvent
	) { }

	public isNoOp(): boolean {
		return false;
	}

	public attemptToMerge(other: OutgoingViewModelEvent): OutgoingViewModelEvent | null {
		return null;
	}
}

export class ModelFontChangedEvent {
	public readonly kind = OutgoingViewModelEventKind.ModelFontChangedEvent;

	constructor(
		public readonly event: OriginalModelFontChangedEvent
	) { }

	public isNoOp(): boolean {
		return false;
	}

	public attemptToMerge(other: OutgoingViewModelEvent): OutgoingViewModelEvent | null {
		return null;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/commands/replaceCommand.ts]---
Location: vscode-main/src/vs/editor/common/commands/replaceCommand.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Position } from '../core/position.js';
import { Range } from '../core/range.js';
import { Selection, SelectionDirection } from '../core/selection.js';
import { ICommand, ICursorStateComputerData, IEditOperationBuilder } from '../editorCommon.js';
import { ITextModel } from '../model.js';

export class ReplaceCommand implements ICommand {

	private readonly _range: Range;
	private readonly _text: string;
	public readonly insertsAutoWhitespace: boolean;

	constructor(range: Range, text: string, insertsAutoWhitespace: boolean = false) {
		this._range = range;
		this._text = text;
		this.insertsAutoWhitespace = insertsAutoWhitespace;
	}

	public getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void {
		builder.addTrackedEditOperation(this._range, this._text);
	}

	public computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		const inverseEditOperations = helper.getInverseEditOperations();
		const srcRange = inverseEditOperations[0].range;
		return Selection.fromPositions(srcRange.getEndPosition());
	}
}

export class ReplaceOvertypeCommand implements ICommand {

	private readonly _range: Range;
	private readonly _text: string;
	public readonly insertsAutoWhitespace: boolean;

	constructor(range: Range, text: string, insertsAutoWhitespace: boolean = false) {
		this._range = range;
		this._text = text;
		this.insertsAutoWhitespace = insertsAutoWhitespace;
	}

	public getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void {
		const initialStartPosition = this._range.getStartPosition();
		const initialEndPosition = this._range.getEndPosition();
		const initialEndLineNumber = initialEndPosition.lineNumber;
		const offsetDelta = this._text.length + (this._range.isEmpty() ? 0 : -1);
		let endPosition = addPositiveOffsetToModelPosition(model, initialEndPosition, offsetDelta);
		if (endPosition.lineNumber > initialEndLineNumber) {
			endPosition = new Position(initialEndLineNumber, model.getLineMaxColumn(initialEndLineNumber));
		}
		const replaceRange = Range.fromPositions(initialStartPosition, endPosition);
		builder.addTrackedEditOperation(replaceRange, this._text);
	}

	public computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		const inverseEditOperations = helper.getInverseEditOperations();
		const srcRange = inverseEditOperations[0].range;
		return Selection.fromPositions(srcRange.getEndPosition());
	}
}

export class ReplaceCommandThatSelectsText implements ICommand {

	private readonly _range: Range;
	private readonly _text: string;

	constructor(range: Range, text: string) {
		this._range = range;
		this._text = text;
	}

	public getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void {
		builder.addTrackedEditOperation(this._range, this._text);
	}

	public computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		const inverseEditOperations = helper.getInverseEditOperations();
		const srcRange = inverseEditOperations[0].range;
		return Selection.fromRange(srcRange, SelectionDirection.LTR);
	}
}

export class ReplaceCommandWithoutChangingPosition implements ICommand {

	private readonly _range: Range;
	private readonly _text: string;
	public readonly insertsAutoWhitespace: boolean;

	constructor(range: Range, text: string, insertsAutoWhitespace: boolean = false) {
		this._range = range;
		this._text = text;
		this.insertsAutoWhitespace = insertsAutoWhitespace;
	}

	public getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void {
		builder.addTrackedEditOperation(this._range, this._text);
	}

	public computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		const inverseEditOperations = helper.getInverseEditOperations();
		const srcRange = inverseEditOperations[0].range;
		return Selection.fromPositions(srcRange.getStartPosition());
	}
}

export class ReplaceCommandWithOffsetCursorState implements ICommand {

	private readonly _range: Range;
	private readonly _text: string;
	private readonly _columnDeltaOffset: number;
	private readonly _lineNumberDeltaOffset: number;
	public readonly insertsAutoWhitespace: boolean;

	constructor(range: Range, text: string, lineNumberDeltaOffset: number, columnDeltaOffset: number, insertsAutoWhitespace: boolean = false) {
		this._range = range;
		this._text = text;
		this._columnDeltaOffset = columnDeltaOffset;
		this._lineNumberDeltaOffset = lineNumberDeltaOffset;
		this.insertsAutoWhitespace = insertsAutoWhitespace;
	}

	public getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void {
		builder.addTrackedEditOperation(this._range, this._text);
	}

	public computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		const inverseEditOperations = helper.getInverseEditOperations();
		const srcRange = inverseEditOperations[0].range;
		return Selection.fromPositions(srcRange.getEndPosition().delta(this._lineNumberDeltaOffset, this._columnDeltaOffset));
	}
}

export class ReplaceOvertypeCommandOnCompositionEnd implements ICommand {

	private readonly _range: Range;

	constructor(range: Range) {
		this._range = range;
	}

	public getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void {
		const text = model.getValueInRange(this._range);
		const initialEndPosition = this._range.getEndPosition();
		const initialEndLineNumber = initialEndPosition.lineNumber;
		let endPosition = addPositiveOffsetToModelPosition(model, initialEndPosition, text.length);
		if (endPosition.lineNumber > initialEndLineNumber) {
			endPosition = new Position(initialEndLineNumber, model.getLineMaxColumn(initialEndLineNumber));
		}
		const replaceRange = Range.fromPositions(initialEndPosition, endPosition);
		builder.addTrackedEditOperation(replaceRange, '');
	}

	public computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		const inverseEditOperations = helper.getInverseEditOperations();
		const srcRange = inverseEditOperations[0].range;
		return Selection.fromPositions(srcRange.getEndPosition());
	}
}

export class ReplaceCommandThatPreservesSelection implements ICommand {

	private readonly _range: Range;
	private readonly _text: string;
	private readonly _initialSelection: Selection;
	private readonly _forceMoveMarkers: boolean;
	private _selectionId: string | null;

	constructor(editRange: Range, text: string, initialSelection: Selection, forceMoveMarkers: boolean = false) {
		this._range = editRange;
		this._text = text;
		this._initialSelection = initialSelection;
		this._forceMoveMarkers = forceMoveMarkers;
		this._selectionId = null;
	}

	public getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void {
		builder.addTrackedEditOperation(this._range, this._text, this._forceMoveMarkers);
		this._selectionId = builder.trackSelection(this._initialSelection);
	}

	public computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		return helper.getTrackedSelection(this._selectionId!);
	}
}

function addPositiveOffsetToModelPosition(model: ITextModel, position: Position, offset: number): Position {
	if (offset < 0) {
		throw new Error('Unexpected negative delta');
	}
	const lineCount = model.getLineCount();
	let endPosition = new Position(lineCount, model.getLineMaxColumn(lineCount));
	for (let lineNumber = position.lineNumber; lineNumber <= lineCount; lineNumber++) {
		if (lineNumber === position.lineNumber) {
			const futureOffset = offset - model.getLineMaxColumn(position.lineNumber) + position.column;
			if (futureOffset <= 0) {
				endPosition = new Position(position.lineNumber, position.column + offset);
				break;
			}
			offset = futureOffset;
		} else {
			const futureOffset = offset - model.getLineMaxColumn(lineNumber);
			if (futureOffset <= 0) {
				endPosition = new Position(lineNumber, offset);
				break;
			}
			offset = futureOffset;
		}
	}
	return endPosition;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/commands/shiftCommand.ts]---
Location: vscode-main/src/vs/editor/common/commands/shiftCommand.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../base/common/charCode.js';
import * as strings from '../../../base/common/strings.js';
import { CursorColumns } from '../core/cursorColumns.js';
import { Range } from '../core/range.js';
import { Selection, SelectionDirection } from '../core/selection.js';
import { ICommand, ICursorStateComputerData, IEditOperationBuilder } from '../editorCommon.js';
import { ITextModel } from '../model.js';
import { EditorAutoIndentStrategy } from '../config/editorOptions.js';
import { getEnterAction } from '../languages/enterAction.js';
import { ILanguageConfigurationService } from '../languages/languageConfigurationRegistry.js';

export interface IShiftCommandOpts {
	isUnshift: boolean;
	tabSize: number;
	indentSize: number;
	insertSpaces: boolean;
	useTabStops: boolean;
	autoIndent: EditorAutoIndentStrategy;
}

const repeatCache: { [str: string]: string[] } = Object.create(null);
function cachedStringRepeat(str: string, count: number): string {
	if (count <= 0) {
		return '';
	}
	if (!repeatCache[str]) {
		repeatCache[str] = ['', str];
	}
	const cache = repeatCache[str];
	for (let i = cache.length; i <= count; i++) {
		cache[i] = cache[i - 1] + str;
	}
	return cache[count];
}

export class ShiftCommand implements ICommand {

	public static unshiftIndent(line: string, column: number, tabSize: number, indentSize: number, insertSpaces: boolean): string {
		// Determine the visible column where the content starts
		const contentStartVisibleColumn = CursorColumns.visibleColumnFromColumn(line, column, tabSize);

		if (insertSpaces) {
			const indent = cachedStringRepeat(' ', indentSize);
			const desiredTabStop = CursorColumns.prevIndentTabStop(contentStartVisibleColumn, indentSize);
			const indentCount = desiredTabStop / indentSize; // will be an integer
			return cachedStringRepeat(indent, indentCount);
		} else {
			const indent = '\t';
			const desiredTabStop = CursorColumns.prevRenderTabStop(contentStartVisibleColumn, tabSize);
			const indentCount = desiredTabStop / tabSize; // will be an integer
			return cachedStringRepeat(indent, indentCount);
		}
	}

	public static shiftIndent(line: string, column: number, tabSize: number, indentSize: number, insertSpaces: boolean): string {
		// Determine the visible column where the content starts
		const contentStartVisibleColumn = CursorColumns.visibleColumnFromColumn(line, column, tabSize);

		if (insertSpaces) {
			const indent = cachedStringRepeat(' ', indentSize);
			const desiredTabStop = CursorColumns.nextIndentTabStop(contentStartVisibleColumn, indentSize);
			const indentCount = desiredTabStop / indentSize; // will be an integer
			return cachedStringRepeat(indent, indentCount);
		} else {
			const indent = '\t';
			const desiredTabStop = CursorColumns.nextRenderTabStop(contentStartVisibleColumn, tabSize);
			const indentCount = desiredTabStop / tabSize; // will be an integer
			return cachedStringRepeat(indent, indentCount);
		}
	}

	private readonly _opts: IShiftCommandOpts;
	private readonly _selection: Selection;
	private _selectionId: string | null;
	private _useLastEditRangeForCursorEndPosition: boolean;
	private _selectionStartColumnStaysPut: boolean;

	constructor(
		range: Selection,
		opts: IShiftCommandOpts,
		@ILanguageConfigurationService private readonly _languageConfigurationService: ILanguageConfigurationService
	) {
		this._opts = opts;
		this._selection = range;
		this._selectionId = null;
		this._useLastEditRangeForCursorEndPosition = false;
		this._selectionStartColumnStaysPut = false;
	}

	private _addEditOperation(builder: IEditOperationBuilder, range: Range, text: string) {
		if (this._useLastEditRangeForCursorEndPosition) {
			builder.addTrackedEditOperation(range, text);
		} else {
			builder.addEditOperation(range, text);
		}
	}

	public getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void {
		const startLine = this._selection.startLineNumber;

		let endLine = this._selection.endLineNumber;
		if (this._selection.endColumn === 1 && startLine !== endLine) {
			endLine = endLine - 1;
		}

		const { tabSize, indentSize, insertSpaces } = this._opts;
		const shouldIndentEmptyLines = (startLine === endLine);

		if (this._opts.useTabStops) {
			// if indenting or outdenting on a whitespace only line
			if (this._selection.isEmpty()) {
				if (/^\s*$/.test(model.getLineContent(startLine))) {
					this._useLastEditRangeForCursorEndPosition = true;
				}
			}

			// keep track of previous line's "miss-alignment"
			let previousLineExtraSpaces = 0, extraSpaces = 0;
			for (let lineNumber = startLine; lineNumber <= endLine; lineNumber++, previousLineExtraSpaces = extraSpaces) {
				extraSpaces = 0;
				const lineText = model.getLineContent(lineNumber);
				let indentationEndIndex = strings.firstNonWhitespaceIndex(lineText);

				if (this._opts.isUnshift && (lineText.length === 0 || indentationEndIndex === 0)) {
					// empty line or line with no leading whitespace => nothing to do
					continue;
				}

				if (!shouldIndentEmptyLines && !this._opts.isUnshift && lineText.length === 0) {
					// do not indent empty lines => nothing to do
					continue;
				}

				if (indentationEndIndex === -1) {
					// the entire line is whitespace
					indentationEndIndex = lineText.length;
				}

				if (lineNumber > 1) {
					const contentStartVisibleColumn = CursorColumns.visibleColumnFromColumn(lineText, indentationEndIndex + 1, tabSize);
					if (contentStartVisibleColumn % indentSize !== 0) {
						// The current line is "miss-aligned", so let's see if this is expected...
						// This can only happen when it has trailing commas in the indent
						if (model.tokenization.isCheapToTokenize(lineNumber - 1)) {
							const enterAction = getEnterAction(this._opts.autoIndent, model, new Range(lineNumber - 1, model.getLineMaxColumn(lineNumber - 1), lineNumber - 1, model.getLineMaxColumn(lineNumber - 1)), this._languageConfigurationService);
							if (enterAction) {
								extraSpaces = previousLineExtraSpaces;
								if (enterAction.appendText) {
									for (let j = 0, lenJ = enterAction.appendText.length; j < lenJ && extraSpaces < indentSize; j++) {
										if (enterAction.appendText.charCodeAt(j) === CharCode.Space) {
											extraSpaces++;
										} else {
											break;
										}
									}
								}
								if (enterAction.removeText) {
									extraSpaces = Math.max(0, extraSpaces - enterAction.removeText);
								}

								// Act as if `prefixSpaces` is not part of the indentation
								for (let j = 0; j < extraSpaces; j++) {
									if (indentationEndIndex === 0 || lineText.charCodeAt(indentationEndIndex - 1) !== CharCode.Space) {
										break;
									}
									indentationEndIndex--;
								}
							}
						}
					}
				}


				if (this._opts.isUnshift && indentationEndIndex === 0) {
					// line with no leading whitespace => nothing to do
					continue;
				}

				let desiredIndent: string;
				if (this._opts.isUnshift) {
					desiredIndent = ShiftCommand.unshiftIndent(lineText, indentationEndIndex + 1, tabSize, indentSize, insertSpaces);
				} else {
					desiredIndent = ShiftCommand.shiftIndent(lineText, indentationEndIndex + 1, tabSize, indentSize, insertSpaces);
				}

				this._addEditOperation(builder, new Range(lineNumber, 1, lineNumber, indentationEndIndex + 1), desiredIndent);
				if (lineNumber === startLine && !this._selection.isEmpty()) {
					// Force the startColumn to stay put because we're inserting after it
					this._selectionStartColumnStaysPut = (this._selection.startColumn <= indentationEndIndex + 1);
				}
			}
		} else {

			// if indenting or outdenting on a whitespace only line
			if (!this._opts.isUnshift && this._selection.isEmpty() && model.getLineLength(startLine) === 0) {
				this._useLastEditRangeForCursorEndPosition = true;
			}

			const oneIndent = (insertSpaces ? cachedStringRepeat(' ', indentSize) : '\t');

			for (let lineNumber = startLine; lineNumber <= endLine; lineNumber++) {
				const lineText = model.getLineContent(lineNumber);
				let indentationEndIndex = strings.firstNonWhitespaceIndex(lineText);

				if (this._opts.isUnshift && (lineText.length === 0 || indentationEndIndex === 0)) {
					// empty line or line with no leading whitespace => nothing to do
					continue;
				}

				if (!shouldIndentEmptyLines && !this._opts.isUnshift && lineText.length === 0) {
					// do not indent empty lines => nothing to do
					continue;
				}

				if (indentationEndIndex === -1) {
					// the entire line is whitespace
					indentationEndIndex = lineText.length;
				}

				if (this._opts.isUnshift && indentationEndIndex === 0) {
					// line with no leading whitespace => nothing to do
					continue;
				}

				if (this._opts.isUnshift) {

					indentationEndIndex = Math.min(indentationEndIndex, indentSize);
					for (let i = 0; i < indentationEndIndex; i++) {
						const chr = lineText.charCodeAt(i);
						if (chr === CharCode.Tab) {
							indentationEndIndex = i + 1;
							break;
						}
					}

					this._addEditOperation(builder, new Range(lineNumber, 1, lineNumber, indentationEndIndex + 1), '');
				} else {
					this._addEditOperation(builder, new Range(lineNumber, 1, lineNumber, 1), oneIndent);
					if (lineNumber === startLine && !this._selection.isEmpty()) {
						// Force the startColumn to stay put because we're inserting after it
						this._selectionStartColumnStaysPut = (this._selection.startColumn === 1);
					}
				}
			}
		}

		this._selectionId = builder.trackSelection(this._selection);
	}

	public computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		if (this._useLastEditRangeForCursorEndPosition) {
			const lastOp = helper.getInverseEditOperations()[0];
			return new Selection(lastOp.range.endLineNumber, lastOp.range.endColumn, lastOp.range.endLineNumber, lastOp.range.endColumn);
		}
		const result = helper.getTrackedSelection(this._selectionId!);

		if (this._selectionStartColumnStaysPut) {
			// The selection start should not move
			const initialStartColumn = this._selection.startColumn;
			const resultStartColumn = result.startColumn;
			if (resultStartColumn <= initialStartColumn) {
				return result;
			}

			if (result.getDirection() === SelectionDirection.LTR) {
				return new Selection(result.startLineNumber, initialStartColumn, result.endLineNumber, result.endColumn);
			}
			return new Selection(result.endLineNumber, result.endColumn, result.startLineNumber, initialStartColumn);
		}

		return result;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/commands/surroundSelectionCommand.ts]---
Location: vscode-main/src/vs/editor/common/commands/surroundSelectionCommand.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Range } from '../core/range.js';
import { Position } from '../core/position.js';
import { Selection } from '../core/selection.js';
import { ICommand, ICursorStateComputerData, IEditOperationBuilder } from '../editorCommon.js';
import { ITextModel } from '../model.js';

export class SurroundSelectionCommand implements ICommand {
	private readonly _range: Selection;
	private readonly _charBeforeSelection: string;
	private readonly _charAfterSelection: string;

	constructor(range: Selection, charBeforeSelection: string, charAfterSelection: string) {
		this._range = range;
		this._charBeforeSelection = charBeforeSelection;
		this._charAfterSelection = charAfterSelection;
	}

	public getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void {
		builder.addTrackedEditOperation(new Range(
			this._range.startLineNumber,
			this._range.startColumn,
			this._range.startLineNumber,
			this._range.startColumn
		), this._charBeforeSelection);

		builder.addTrackedEditOperation(new Range(
			this._range.endLineNumber,
			this._range.endColumn,
			this._range.endLineNumber,
			this._range.endColumn
		), this._charAfterSelection || null); // addTrackedEditOperation() ignores us if the text == ''. Causing a chain of errors in computeCursorState()
	}

	public computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		const inverseEditOperations = helper.getInverseEditOperations();
		const firstOperationRange = inverseEditOperations[0].range;
		const secondOperationRange = inverseEditOperations[1].range;

		return new Selection(
			firstOperationRange.endLineNumber,
			firstOperationRange.endColumn,
			secondOperationRange.endLineNumber,
			secondOperationRange.endColumn - this._charAfterSelection.length
		);
	}
}

/**
 * A surround selection command that runs after composition finished.
 */
export class CompositionSurroundSelectionCommand implements ICommand {

	constructor(
		private readonly _position: Position,
		private readonly _text: string,
		private readonly _charAfter: string
	) { }

	public getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void {
		builder.addTrackedEditOperation(new Range(
			this._position.lineNumber,
			this._position.column,
			this._position.lineNumber,
			this._position.column
		), this._text + this._charAfter);
	}

	public computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		const inverseEditOperations = helper.getInverseEditOperations();
		const opRange = inverseEditOperations[0].range;

		return new Selection(
			opRange.endLineNumber,
			opRange.startColumn,
			opRange.endLineNumber,
			opRange.endColumn - this._charAfter.length
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/commands/trimTrailingWhitespaceCommand.ts]---
Location: vscode-main/src/vs/editor/common/commands/trimTrailingWhitespaceCommand.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as strings from '../../../base/common/strings.js';
import { EditOperation, ISingleEditOperation } from '../core/editOperation.js';
import { Position } from '../core/position.js';
import { Range } from '../core/range.js';
import { Selection } from '../core/selection.js';
import { ICommand, ICursorStateComputerData, IEditOperationBuilder } from '../editorCommon.js';
import { StandardTokenType } from '../encodedTokenAttributes.js';
import { ITextModel } from '../model.js';

export class TrimTrailingWhitespaceCommand implements ICommand {

	private readonly _selection: Selection;
	private _selectionId: string | null;
	private readonly _cursors: Position[];
	private readonly _trimInRegexesAndStrings: boolean;

	constructor(selection: Selection, cursors: Position[], trimInRegexesAndStrings: boolean) {
		this._selection = selection;
		this._cursors = cursors;
		this._selectionId = null;
		this._trimInRegexesAndStrings = trimInRegexesAndStrings;
	}

	public getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void {
		const ops = trimTrailingWhitespace(model, this._cursors, this._trimInRegexesAndStrings);
		for (let i = 0, len = ops.length; i < len; i++) {
			const op = ops[i];

			builder.addEditOperation(op.range, op.text);
		}

		this._selectionId = builder.trackSelection(this._selection);
	}

	public computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		return helper.getTrackedSelection(this._selectionId!);
	}
}

/**
 * Generate commands for trimming trailing whitespace on a model and ignore lines on which cursors are sitting.
 */
export function trimTrailingWhitespace(model: ITextModel, cursors: Position[], trimInRegexesAndStrings: boolean): ISingleEditOperation[] {
	// Sort cursors ascending
	cursors.sort((a, b) => {
		if (a.lineNumber === b.lineNumber) {
			return a.column - b.column;
		}
		return a.lineNumber - b.lineNumber;
	});

	// Reduce multiple cursors on the same line and only keep the last one on the line
	for (let i = cursors.length - 2; i >= 0; i--) {
		if (cursors[i].lineNumber === cursors[i + 1].lineNumber) {
			// Remove cursor at `i`
			cursors.splice(i, 1);
		}
	}

	const r: ISingleEditOperation[] = [];
	let rLen = 0;
	let cursorIndex = 0;
	const cursorLen = cursors.length;

	for (let lineNumber = 1, lineCount = model.getLineCount(); lineNumber <= lineCount; lineNumber++) {
		const lineContent = model.getLineContent(lineNumber);
		const maxLineColumn = lineContent.length + 1;
		let minEditColumn = 0;

		if (cursorIndex < cursorLen && cursors[cursorIndex].lineNumber === lineNumber) {
			minEditColumn = cursors[cursorIndex].column;
			cursorIndex++;
			if (minEditColumn === maxLineColumn) {
				// The cursor is at the end of the line => no edits for sure on this line
				continue;
			}
		}

		if (lineContent.length === 0) {
			continue;
		}

		const lastNonWhitespaceIndex = strings.lastNonWhitespaceIndex(lineContent);

		let fromColumn = 0;
		if (lastNonWhitespaceIndex === -1) {
			// Entire line is whitespace
			fromColumn = 1;
		} else if (lastNonWhitespaceIndex !== lineContent.length - 1) {
			// There is trailing whitespace
			fromColumn = lastNonWhitespaceIndex + 2;
		} else {
			// There is no trailing whitespace
			continue;
		}

		if (!trimInRegexesAndStrings) {
			if (!model.tokenization.hasAccurateTokensForLine(lineNumber)) {
				// We don't want to force line tokenization, as that can be expensive, but we also don't want to trim
				// trailing whitespace in lines that are not tokenized yet, as that can be wrong and trim whitespace from
				// lines that the user requested we don't. So we bail out if the tokens are not accurate for this line.
				continue;
			}

			const lineTokens = model.tokenization.getLineTokens(lineNumber);
			const fromColumnType = lineTokens.getStandardTokenType(lineTokens.findTokenIndexAtOffset(fromColumn));

			if (fromColumnType === StandardTokenType.String || fromColumnType === StandardTokenType.RegEx) {
				continue;
			}
		}

		fromColumn = Math.max(minEditColumn, fromColumn);
		r[rLen++] = EditOperation.delete(new Range(
			lineNumber, fromColumn,
			lineNumber, maxLineColumn
		));
	}

	return r;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/config/diffEditor.ts]---
Location: vscode-main/src/vs/editor/common/config/diffEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ValidDiffEditorBaseOptions } from './editorOptions.js';

export const diffEditorDefaultOptions = {
	enableSplitViewResizing: true,
	splitViewDefaultRatio: 0.5,
	renderSideBySide: true,
	renderMarginRevertIcon: true,
	renderGutterMenu: true,
	maxComputationTime: 5000,
	maxFileSize: 50,
	ignoreTrimWhitespace: true,
	renderIndicators: true,
	originalEditable: false,
	diffCodeLens: false,
	renderOverviewRuler: true,
	diffWordWrap: 'inherit',
	diffAlgorithm: 'advanced',
	accessibilityVerbose: false,
	experimental: {
		showMoves: false,
		showEmptyDecorations: true,
		useTrueInlineView: false,
	},
	hideUnchangedRegions: {
		enabled: false,
		contextLineCount: 3,
		minimumLineCount: 3,
		revealLineCount: 20,
	},
	isInEmbeddedEditor: false,
	onlyShowAccessibleDiffViewer: false,
	renderSideBySideInlineBreakpoint: 900,
	useInlineViewWhenSpaceIsLimited: true,
	compactMode: false,
} satisfies ValidDiffEditorBaseOptions;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/config/editorConfiguration.ts]---
Location: vscode-main/src/vs/editor/common/config/editorConfiguration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { ConfigurationChangedEvent, IComputedEditorOptions, IEditorOptions } from './editorOptions.js';
import { IDimension } from '../core/2d/dimension.js';
import { MenuId } from '../../../platform/actions/common/actions.js';

export interface IEditorConfiguration extends IDisposable {
	/**
	 * Is this a simple widget (not a real code editor)?
	 */
	readonly isSimpleWidget: boolean;
	/**
	 * The context menu id for the editor.
	 */
	readonly contextMenuId: MenuId;
	/**
	 * Computed editor options.
	 */
	readonly options: IComputedEditorOptions;
	/**
	 * The `options` have changed (quick event)
	 */
	readonly onDidChangeFast: Event<ConfigurationChangedEvent>;
	/**
	 * The `options` have changed (slow event)
	 */
	readonly onDidChange: Event<ConfigurationChangedEvent>;
	/**
	 * Get the raw options as they were passed in to the editor
	 * and merged with all calls to `updateOptions`.
	 */
	getRawOptions(): IEditorOptions;
	/**
	 * Update the options with new partial options. All previous
	 * options will be kept and only present keys will be overwritten.
	 */
	updateOptions(newOptions: Readonly<IEditorOptions>): void;
	/**
	 * Recompute options with new reference element dimensions.
	 */
	observeContainer(dimension?: IDimension): void;
	/**
	 * Set if the current model is dominated by long lines.
	 */
	setIsDominatedByLongLines(isDominatedByLongLines: boolean): void;
	/**
	 * Set the current model line count.
	 */
	setModelLineCount(modelLineCount: number): void;
	/**
	 * Set the current view model line count.
	 */
	setViewLineCount(viewLineCount: number): void;
	/**
	 * Set reserved height above.
	 */
	setReservedHeight(reservedHeight: number): void;
	/**
	 * Set the number of decoration lanes to be rendered in the glyph margin.
	 */
	setGlyphMarginDecorationLaneCount(decorationLaneCount: number): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/config/editorConfigurationSchema.ts]---
Location: vscode-main/src/vs/editor/common/config/editorConfigurationSchema.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IJSONSchemaSnippet } from '../../../base/common/jsonSchema.js';
import { diffEditorDefaultOptions } from './diffEditor.js';
import { editorOptionsRegistry } from './editorOptions.js';
import { EDITOR_MODEL_DEFAULTS } from '../core/misc/textModelDefaults.js';
import * as nls from '../../../nls.js';
import { ConfigurationScope, Extensions, IConfigurationNode, IConfigurationPropertySchema, IConfigurationRegistry } from '../../../platform/configuration/common/configurationRegistry.js';
import { Registry } from '../../../platform/registry/common/platform.js';

export const editorConfigurationBaseNode = Object.freeze<IConfigurationNode>({
	id: 'editor',
	order: 5,
	type: 'object',
	title: nls.localize('editorConfigurationTitle', "Editor"),
	scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
});

const editorConfiguration: IConfigurationNode = {
	...editorConfigurationBaseNode,
	properties: {
		'editor.tabSize': {
			type: 'number',
			default: EDITOR_MODEL_DEFAULTS.tabSize,
			minimum: 1,
			maximum: 100,
			markdownDescription: nls.localize('tabSize', "The number of spaces a tab is equal to. This setting is overridden based on the file contents when {0} is on.", '`#editor.detectIndentation#`')
		},
		'editor.indentSize': {
			'anyOf': [
				{
					type: 'string',
					enum: ['tabSize']
				},
				{
					type: 'number',
					minimum: 1
				}
			],
			default: 'tabSize',
			markdownDescription: nls.localize('indentSize', "The number of spaces used for indentation or `\"tabSize\"` to use the value from `#editor.tabSize#`. This setting is overridden based on the file contents when `#editor.detectIndentation#` is on.")
		},
		'editor.insertSpaces': {
			type: 'boolean',
			default: EDITOR_MODEL_DEFAULTS.insertSpaces,
			markdownDescription: nls.localize('insertSpaces', "Insert spaces when pressing `Tab`. This setting is overridden based on the file contents when {0} is on.", '`#editor.detectIndentation#`')
		},
		'editor.detectIndentation': {
			type: 'boolean',
			default: EDITOR_MODEL_DEFAULTS.detectIndentation,
			markdownDescription: nls.localize('detectIndentation', "Controls whether {0} and {1} will be automatically detected when a file is opened based on the file contents.", '`#editor.tabSize#`', '`#editor.insertSpaces#`')
		},
		'editor.trimAutoWhitespace': {
			type: 'boolean',
			default: EDITOR_MODEL_DEFAULTS.trimAutoWhitespace,
			description: nls.localize('trimAutoWhitespace', "Remove trailing auto inserted whitespace.")
		},
		'editor.largeFileOptimizations': {
			type: 'boolean',
			default: EDITOR_MODEL_DEFAULTS.largeFileOptimizations,
			description: nls.localize('largeFileOptimizations', "Special handling for large files to disable certain memory intensive features.")
		},
		'editor.wordBasedSuggestions': {
			enum: ['off', 'currentDocument', 'matchingDocuments', 'allDocuments', 'offWithInlineSuggestions'],
			default: 'matchingDocuments',
			enumDescriptions: [
				nls.localize('wordBasedSuggestions.off', 'Turn off Word Based Suggestions.'),
				nls.localize('wordBasedSuggestions.offWithInlineSuggestions', 'Turn off Word Based Suggestions when Inline Suggestions are present.'),
				nls.localize('wordBasedSuggestions.currentDocument', 'Only suggest words from the active document.'),
				nls.localize('wordBasedSuggestions.matchingDocuments', 'Suggest words from all open documents of the same language.'),
				nls.localize('wordBasedSuggestions.allDocuments', 'Suggest words from all open documents.'),
			],
			description: nls.localize('wordBasedSuggestions', "Controls whether completions should be computed based on words in the document and from which documents they are computed."),
			experiment: { mode: 'auto' },
		},
		'editor.semanticHighlighting.enabled': {
			enum: [true, false, 'configuredByTheme'],
			enumDescriptions: [
				nls.localize('semanticHighlighting.true', 'Semantic highlighting enabled for all color themes.'),
				nls.localize('semanticHighlighting.false', 'Semantic highlighting disabled for all color themes.'),
				nls.localize('semanticHighlighting.configuredByTheme', 'Semantic highlighting is configured by the current color theme\'s `semanticHighlighting` setting.')
			],
			default: 'configuredByTheme',
			description: nls.localize('semanticHighlighting.enabled', "Controls whether the semanticHighlighting is shown for the languages that support it.")
		},
		'editor.stablePeek': {
			type: 'boolean',
			default: false,
			markdownDescription: nls.localize('stablePeek', "Keep peek editors open even when double-clicking their content or when hitting `Escape`.")
		},
		'editor.maxTokenizationLineLength': {
			type: 'integer',
			default: 20_000,
			description: nls.localize('maxTokenizationLineLength', "Lines above this length will not be tokenized for performance reasons")
		},
		'editor.experimental.asyncTokenization': {
			type: 'boolean',
			default: true,
			description: nls.localize('editor.experimental.asyncTokenization', "Controls whether the tokenization should happen asynchronously on a web worker."),
			tags: ['experimental'],
		},
		'editor.experimental.asyncTokenizationLogging': {
			type: 'boolean',
			default: false,
			description: nls.localize('editor.experimental.asyncTokenizationLogging', "Controls whether async tokenization should be logged. For debugging only."),
		},
		'editor.experimental.asyncTokenizationVerification': {
			type: 'boolean',
			default: false,
			description: nls.localize('editor.experimental.asyncTokenizationVerification', "Controls whether async tokenization should be verified against legacy background tokenization. Might slow down tokenization. For debugging only."),
			tags: ['experimental'],
		},
		'editor.experimental.treeSitterTelemetry': {
			type: 'boolean',
			default: false,
			markdownDescription: nls.localize('editor.experimental.treeSitterTelemetry', "Controls whether tree sitter parsing should be turned on and telemetry collected. Setting `#editor.experimental.preferTreeSitter#` for specific languages will take precedence."),
			tags: ['experimental'],
			experiment: {
				mode: 'auto'
			}
		},
		'editor.experimental.preferTreeSitter.css': {
			type: 'boolean',
			default: false,
			markdownDescription: nls.localize('editor.experimental.preferTreeSitter.css', "Controls whether tree sitter parsing should be turned on for css. This will take precedence over `#editor.experimental.treeSitterTelemetry#` for css."),
			tags: ['experimental'],
			experiment: {
				mode: 'auto'
			}
		},
		'editor.experimental.preferTreeSitter.typescript': {
			type: 'boolean',
			default: false,
			markdownDescription: nls.localize('editor.experimental.preferTreeSitter.typescript', "Controls whether tree sitter parsing should be turned on for typescript. This will take precedence over `#editor.experimental.treeSitterTelemetry#` for typescript."),
			tags: ['experimental'],
			experiment: {
				mode: 'auto'
			}
		},
		'editor.experimental.preferTreeSitter.ini': {
			type: 'boolean',
			default: false,
			markdownDescription: nls.localize('editor.experimental.preferTreeSitter.ini', "Controls whether tree sitter parsing should be turned on for ini. This will take precedence over `#editor.experimental.treeSitterTelemetry#` for ini."),
			tags: ['experimental'],
			experiment: {
				mode: 'auto'
			}
		},
		'editor.experimental.preferTreeSitter.regex': {
			type: 'boolean',
			default: false,
			markdownDescription: nls.localize('editor.experimental.preferTreeSitter.regex', "Controls whether tree sitter parsing should be turned on for regex. This will take precedence over `#editor.experimental.treeSitterTelemetry#` for regex."),
			tags: ['experimental'],
			experiment: {
				mode: 'auto'
			}
		},
		'editor.language.brackets': {
			type: ['array', 'null'],
			default: null, // We want to distinguish the empty array from not configured.
			description: nls.localize('schema.brackets', 'Defines the bracket symbols that increase or decrease the indentation.'),
			items: {
				type: 'array',
				items: [
					{
						type: 'string',
						description: nls.localize('schema.openBracket', 'The opening bracket character or string sequence.')
					},
					{
						type: 'string',
						description: nls.localize('schema.closeBracket', 'The closing bracket character or string sequence.')
					}
				]
			}
		},
		'editor.language.colorizedBracketPairs': {
			type: ['array', 'null'],
			default: null, // We want to distinguish the empty array from not configured.
			description: nls.localize('schema.colorizedBracketPairs', 'Defines the bracket pairs that are colorized by their nesting level if bracket pair colorization is enabled.'),
			items: {
				type: 'array',
				items: [
					{
						type: 'string',
						description: nls.localize('schema.openBracket', 'The opening bracket character or string sequence.')
					},
					{
						type: 'string',
						description: nls.localize('schema.closeBracket', 'The closing bracket character or string sequence.')
					}
				]
			}
		},
		'diffEditor.maxComputationTime': {
			type: 'number',
			default: diffEditorDefaultOptions.maxComputationTime,
			description: nls.localize('maxComputationTime', "Timeout in milliseconds after which diff computation is cancelled. Use 0 for no timeout.")
		},
		'diffEditor.maxFileSize': {
			type: 'number',
			default: diffEditorDefaultOptions.maxFileSize,
			description: nls.localize('maxFileSize', "Maximum file size in MB for which to compute diffs. Use 0 for no limit.")
		},
		'diffEditor.renderSideBySide': {
			type: 'boolean',
			default: diffEditorDefaultOptions.renderSideBySide,
			description: nls.localize('sideBySide', "Controls whether the diff editor shows the diff side by side or inline.")
		},
		'diffEditor.renderSideBySideInlineBreakpoint': {
			type: 'number',
			default: diffEditorDefaultOptions.renderSideBySideInlineBreakpoint,
			description: nls.localize('renderSideBySideInlineBreakpoint', "If the diff editor width is smaller than this value, the inline view is used.")
		},
		'diffEditor.useInlineViewWhenSpaceIsLimited': {
			type: 'boolean',
			default: diffEditorDefaultOptions.useInlineViewWhenSpaceIsLimited,
			description: nls.localize('useInlineViewWhenSpaceIsLimited', "If enabled and the editor width is too small, the inline view is used.")
		},
		'diffEditor.renderMarginRevertIcon': {
			type: 'boolean',
			default: diffEditorDefaultOptions.renderMarginRevertIcon,
			description: nls.localize('renderMarginRevertIcon', "When enabled, the diff editor shows arrows in its glyph margin to revert changes.")
		},
		'diffEditor.renderGutterMenu': {
			type: 'boolean',
			default: diffEditorDefaultOptions.renderGutterMenu,
			description: nls.localize('renderGutterMenu', "When enabled, the diff editor shows a special gutter for revert and stage actions.")
		},
		'diffEditor.ignoreTrimWhitespace': {
			type: 'boolean',
			default: diffEditorDefaultOptions.ignoreTrimWhitespace,
			description: nls.localize('ignoreTrimWhitespace', "When enabled, the diff editor ignores changes in leading or trailing whitespace.")
		},
		'diffEditor.renderIndicators': {
			type: 'boolean',
			default: diffEditorDefaultOptions.renderIndicators,
			description: nls.localize('renderIndicators', "Controls whether the diff editor shows +/- indicators for added/removed changes.")
		},
		'diffEditor.codeLens': {
			type: 'boolean',
			default: diffEditorDefaultOptions.diffCodeLens,
			description: nls.localize('codeLens', "Controls whether the editor shows CodeLens.")
		},
		'diffEditor.wordWrap': {
			type: 'string',
			enum: ['off', 'on', 'inherit'],
			default: diffEditorDefaultOptions.diffWordWrap,
			markdownEnumDescriptions: [
				nls.localize('wordWrap.off', "Lines will never wrap."),
				nls.localize('wordWrap.on', "Lines will wrap at the viewport width."),
				nls.localize('wordWrap.inherit', "Lines will wrap according to the {0} setting.", '`#editor.wordWrap#`'),
			]
		},
		'diffEditor.diffAlgorithm': {
			type: 'string',
			enum: ['legacy', 'advanced'],
			default: diffEditorDefaultOptions.diffAlgorithm,
			markdownEnumDescriptions: [
				nls.localize('diffAlgorithm.legacy', "Uses the legacy diffing algorithm."),
				nls.localize('diffAlgorithm.advanced', "Uses the advanced diffing algorithm."),
			]
		},
		'diffEditor.hideUnchangedRegions.enabled': {
			type: 'boolean',
			default: diffEditorDefaultOptions.hideUnchangedRegions.enabled,
			markdownDescription: nls.localize('hideUnchangedRegions.enabled', "Controls whether the diff editor shows unchanged regions."),
		},
		'diffEditor.hideUnchangedRegions.revealLineCount': {
			type: 'integer',
			default: diffEditorDefaultOptions.hideUnchangedRegions.revealLineCount,
			markdownDescription: nls.localize('hideUnchangedRegions.revealLineCount', "Controls how many lines are used for unchanged regions."),
			minimum: 1,
		},
		'diffEditor.hideUnchangedRegions.minimumLineCount': {
			type: 'integer',
			default: diffEditorDefaultOptions.hideUnchangedRegions.minimumLineCount,
			markdownDescription: nls.localize('hideUnchangedRegions.minimumLineCount', "Controls how many lines are used as a minimum for unchanged regions."),
			minimum: 1,
		},
		'diffEditor.hideUnchangedRegions.contextLineCount': {
			type: 'integer',
			default: diffEditorDefaultOptions.hideUnchangedRegions.contextLineCount,
			markdownDescription: nls.localize('hideUnchangedRegions.contextLineCount', "Controls how many lines are used as context when comparing unchanged regions."),
			minimum: 1,
		},
		'diffEditor.experimental.showMoves': {
			type: 'boolean',
			default: diffEditorDefaultOptions.experimental.showMoves,
			markdownDescription: nls.localize('showMoves', "Controls whether the diff editor should show detected code moves.")
		},
		'diffEditor.experimental.showEmptyDecorations': {
			type: 'boolean',
			default: diffEditorDefaultOptions.experimental.showEmptyDecorations,
			description: nls.localize('showEmptyDecorations', "Controls whether the diff editor shows empty decorations to see where characters got inserted or deleted."),
		},
		'diffEditor.experimental.useTrueInlineView': {
			type: 'boolean',
			default: diffEditorDefaultOptions.experimental.useTrueInlineView,
			description: nls.localize('useTrueInlineView', "If enabled and the editor uses the inline view, word changes are rendered inline."),
		},
	}
};

function isConfigurationPropertySchema(x: IConfigurationPropertySchema | { [path: string]: IConfigurationPropertySchema }): x is IConfigurationPropertySchema {
	return (typeof x.type !== 'undefined' || typeof x.anyOf !== 'undefined');
}

// Add properties from the Editor Option Registry
for (const editorOption of editorOptionsRegistry) {
	const schema = editorOption.schema;
	if (typeof schema !== 'undefined') {
		if (isConfigurationPropertySchema(schema)) {
			// This is a single schema contribution
			editorConfiguration.properties![`editor.${editorOption.name}`] = schema;
		} else {
			for (const key in schema) {
				if (Object.hasOwnProperty.call(schema, key)) {
					editorConfiguration.properties![key] = schema[key];
				}
			}
		}
	}
}

let cachedEditorConfigurationKeys: { [key: string]: boolean } | null = null;
function getEditorConfigurationKeys(): { [key: string]: boolean } {
	if (cachedEditorConfigurationKeys === null) {
		cachedEditorConfigurationKeys = <{ [key: string]: boolean }>Object.create(null);
		Object.keys(editorConfiguration.properties!).forEach((prop) => {
			cachedEditorConfigurationKeys![prop] = true;
		});
	}
	return cachedEditorConfigurationKeys;
}

export function isEditorConfigurationKey(key: string): boolean {
	const editorConfigurationKeys = getEditorConfigurationKeys();
	return (editorConfigurationKeys[`editor.${key}`] || false);
}

export function isDiffEditorConfigurationKey(key: string): boolean {
	const editorConfigurationKeys = getEditorConfigurationKeys();
	return (editorConfigurationKeys[`diffEditor.${key}`] || false);
}

const configurationRegistry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);
configurationRegistry.registerConfiguration(editorConfiguration);

export async function registerEditorFontConfigurations(getFontSnippets: () => Promise<IJSONSchemaSnippet[]>) {
	const editorKeysWithFont = ['editor.fontFamily'];
	const fontSnippets = await getFontSnippets();
	for (const key of editorKeysWithFont) {
		if (
			editorConfiguration.properties && editorConfiguration.properties[key]
		) {
			editorConfiguration.properties[key].defaultSnippets = fontSnippets;
		}
	}
}
```

--------------------------------------------------------------------------------

````

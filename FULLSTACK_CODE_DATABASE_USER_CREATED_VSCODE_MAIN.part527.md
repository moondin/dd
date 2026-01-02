---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 527
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 527 of 552)

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

---[FILE: src/vs/workbench/services/search/common/searchExtTypes.ts]---
Location: vscode-main/src/vs/workbench/services/search/common/searchExtTypes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { URI } from '../../../../base/common/uri.js';
import { IProgress } from '../../../../platform/progress/common/progress.js';

export class Position {
	constructor(readonly line: number, readonly character: number) { }

	isBefore(other: Position): boolean { return false; }
	isBeforeOrEqual(other: Position): boolean { return false; }
	isAfter(other: Position): boolean { return false; }
	isAfterOrEqual(other: Position): boolean { return false; }
	isEqual(other: Position): boolean { return false; }
	compareTo(other: Position): number { return 0; }
	translate(lineDelta?: number, characterDelta?: number): Position;
	translate(change: { lineDelta?: number; characterDelta?: number }): Position;
	translate(_?: any, _2?: any): Position { return new Position(0, 0); }
	with(line?: number, character?: number): Position;
	with(change: { line?: number; character?: number }): Position;
	with(_: any): Position { return new Position(0, 0); }
}

export class Range {
	readonly start: Position;
	readonly end: Position;

	constructor(startLine: number, startCol: number, endLine: number, endCol: number) {
		this.start = new Position(startLine, startCol);
		this.end = new Position(endLine, endCol);
	}

	isEmpty = false;
	isSingleLine = false;
	contains(positionOrRange: Position | Range): boolean { return false; }
	isEqual(other: Range): boolean { return false; }
	intersection(range: Range): Range | undefined { return undefined; }
	union(other: Range): Range { return new Range(0, 0, 0, 0); }

	with(start?: Position, end?: Position): Range;
	with(change: { start?: Position; end?: Position }): Range;
	with(_: any): Range { return new Range(0, 0, 0, 0); }
}

export type ProviderResult<T> = T | undefined | null | Thenable<T | undefined | null>;

/**
 * A relative pattern is a helper to construct glob patterns that are matched
 * relatively to a base path. The base path can either be an absolute file path
 * or a [workspace folder](#WorkspaceFolder).
 */
export interface RelativePattern {

	/**
	 * A base file path to which this pattern will be matched against relatively. The
	 * file path must be absolute, should not have any trailing path separators and
	 * not include any relative segments (`.` or `..`).
	 */
	baseUri: URI;

	/**
	 * A file glob pattern like `*.{ts,js}` that will be matched on file paths
	 * relative to the base path.
	 *
	 * Example: Given a base of `/home/work/folder` and a file path of `/home/work/folder/index.js`,
	 * the file glob pattern will match on `index.js`.
	 */
	pattern: string;
}

/**
 * A file glob pattern to match file paths against. This can either be a glob pattern string
 * (like `** /*.{ts,js}` without space before / or `*.{ts,js}`) or a [relative pattern](#RelativePattern).
 *
 * Glob patterns can have the following syntax:
 * * `*` to match zero or more characters in a path segment
 * * `?` to match on one character in a path segment
 * * `**` to match any number of path segments, including none
 * * `{}` to group conditions (e.g. `** /*.{ts,js}` without space before / matches all TypeScript and JavaScript files)
 * * `[]` to declare a range of characters to match in a path segment (e.g., `example.[0-9]` to match on `example.0`, `example.1`, …)
 * * `[!...]` to negate a range of characters to match in a path segment (e.g., `example.[!0-9]` to match on `example.a`, `example.b`, but not `example.0`)
 *
 * Note: a backslash (`\`) is not valid within a glob pattern. If you have an existing file
 * path to match against, consider to use the [relative pattern](#RelativePattern) support
 * that takes care of converting any backslash into slash. Otherwise, make sure to convert
 * any backslash to slash when creating the glob pattern.
 */
export type GlobPattern = string | RelativePattern;

/**
 * The parameters of a query for text search.
 */
export interface TextSearchQuery2 {
	/**
	 * The text pattern to search for.
	 */
	pattern: string;

	/**
	 * Whether or not `pattern` should match multiple lines of text.
	 */
	isMultiline?: boolean;

	/**
	 * Whether or not `pattern` should be interpreted as a regular expression.
	 */
	isRegExp?: boolean;

	/**
	 * Whether or not the search should be case-sensitive.
	 */
	isCaseSensitive?: boolean;

	/**
	 * Whether or not to search for whole word matches only.
	 */
	isWordMatch?: boolean;
}


export interface TextSearchProviderFolderOptions {
	/**
	 * The root folder to search within.
	 */
	folder: URI;

	/**
	 * Files that match an `includes` glob pattern should be included in the search.
	 */
	includes: string[];

	/**
	 * Files that match an `excludes` glob pattern should be excluded from the search.
	 */
	excludes: GlobPattern[];

	/**
	 * Whether symlinks should be followed while searching.
	 * For more info, see the setting description for `search.followSymlinks`.
	 */
	followSymlinks: boolean;

	/**
	 * Which file locations we should look for ignore (.gitignore or .ignore) files to respect.
	 */
	useIgnoreFiles: {
		/**
		 * Use ignore files at the current workspace root.
		 */
		local: boolean;
		/**
		 * Use ignore files at the parent directory. If set, `local` in {@link TextSearchProviderFolderOptions.useIgnoreFiles} should also be `true`.
		 */
		parent: boolean;
		/**
		 * Use global ignore files. If set, `local` in {@link TextSearchProviderFolderOptions.useIgnoreFiles} should also be `true`.
		 */
		global: boolean;
	};

	/**
	 * Interpret files using this encoding.
	 * See the vscode setting `"files.encoding"`
	 */
	encoding: string;
}

/**
 * Options that apply to text search.
 */
export interface TextSearchProviderOptions {

	folderOptions: TextSearchProviderFolderOptions[];

	/**
	 * The maximum number of results to be returned.
	 */
	maxResults: number;

	/**
	 * Options to specify the size of the result text preview.
	 */
	previewOptions: {
		/**
		 * The maximum number of lines in the preview.
		 * Only search providers that support multiline search will ever return more than one line in the match.
		 * Defaults to 100.
		 */
		matchLines: number;

		/**
		 * The maximum number of characters included per line.
		 * Defaults to 10000.
		 */
		charsPerLine: number;
	};

	/**
	 * Exclude files larger than `maxFileSize` in bytes.
	 */
	maxFileSize: number | undefined;


	/**
	 * Number of lines of context to include before and after each match.
	 */
	surroundingContext: number;
}


/**
 * Information collected when text search is complete.
 */
export interface TextSearchComplete2 {
	/**
	 * Whether the search hit the limit on the maximum number of search results.
	 * `maxResults` on [`TextSearchOptions`](#TextSearchOptions) specifies the max number of results.
	 * - If exactly that number of matches exist, this should be false.
	 * - If `maxResults` matches are returned and more exist, this should be true.
	 * - If search hits an internal limit which is less than `maxResults`, this should be true.
	 */
	limitHit?: boolean;
}

export interface FileSearchProviderFolderOptions {
	/**
	 * The root folder to search within.
	 */
	folder: URI;

	/**
	 * Files that match an `includes` glob pattern should be included in the search.
	 */
	includes: string[];

	/**
	 * Files that match an `excludes` glob pattern should be excluded from the search.
	 */
	excludes: GlobPattern[];

	/**
	 * Whether symlinks should be followed while searching.
	 * For more info, see the setting description for `search.followSymlinks`.
	 */
	followSymlinks: boolean;

	/**
	 * Which file locations we should look for ignore (.gitignore or .ignore) files to respect.
	 */
	useIgnoreFiles: {
		/**
		 * Use ignore files at the current workspace root.
		 */
		local: boolean;
		/**
		 * Use ignore files at the parent directory. If set, {@link FileSearchProviderOptions.useIgnoreFiles.local} should also be `true`.
		 */
		parent: boolean;
		/**
		 * Use global ignore files. If set, {@link FileSearchProviderOptions.useIgnoreFiles.local} should also be `true`.
		 */
		global: boolean;
	};
}

/**
 * Options that apply to file search.
 */
export interface FileSearchProviderOptions {
	folderOptions: FileSearchProviderFolderOptions[];

	/**
	 * An object with a lifespan that matches the session's lifespan. If the provider chooses to, this object can be used as the key for a cache,
	 * and searches with the same session object can search the same cache. When the token is cancelled, the session is complete and the cache can be cleared.
	 */
	session: unknown;

	/**
	 * The maximum number of results to be returned.
	 */
	maxResults: number;
}

/**
 * The main match information for a {@link TextSearchResult2}.
 */
export class TextSearchMatch2 {
	/**
	 * @param uri The uri for the matching document.
	 * @param ranges The ranges associated with this match.
	 * @param previewText The text that is used to preview the match. The highlighted range in `previewText` is specified in `ranges`.
	 */
	constructor(
		public uri: URI,
		public ranges: { sourceRange: Range; previewRange: Range }[],
		public previewText: string) { }

}

/**
 * The potential context information for a {@link TextSearchResult2}.
 */
export class TextSearchContext2 {
	/**
	 * @param uri The uri for the matching document.
	 * @param text The line of context text.
	 * @param lineNumber The line number of this line of context.
	 */
	constructor(
		public uri: URI,
		public text: string,
		public lineNumber: number) { }
}

/**
/**
 * Keyword suggestion for AI search.
 */
export class AISearchKeyword {
	/**
	 * @param keyword The keyword associated with the search.
	 */
	constructor(public keyword: string) { }
}

/**
 * A result payload for a text search, pertaining to matches within a single file.
 */
export type TextSearchResult2 = TextSearchMatch2 | TextSearchContext2;

/**
 * A result payload for an AI search.
 * This can be a {@link TextSearchMatch2 match} or a {@link AISearchKeyword keyword}.
 * The result can be a match or a keyword.
*/
export type AISearchResult = TextSearchResult2 | AISearchKeyword;

/**
 * A FileSearchProvider provides search results for files in the given folder that match a query string. It can be invoked by quickaccess or other extensions.
 *
 * A FileSearchProvider is the more powerful of two ways to implement file search in VS Code. Use a FileSearchProvider if you wish to search within a folder for
 * all files that match the user's query.
 *
 * The FileSearchProvider will be invoked on every keypress in quickaccess. When `workspace.findFiles` is called, it will be invoked with an empty query string,
 * and in that case, every file in the folder should be returned.
 */
export interface FileSearchProvider2 {
	/**
	 * Provide the set of files that match a certain file path pattern.
	 * @param query The parameters for this query.
	 * @param options A set of options to consider while searching files.
	 * @param progress A progress callback that must be invoked for all results.
	 * @param token A cancellation token.
	 */
	provideFileSearchResults(pattern: string, options: FileSearchProviderOptions, token: CancellationToken): ProviderResult<URI[]>;
}

/**
 * A TextSearchProvider provides search results for text results inside files in the workspace.
 */
export interface TextSearchProvider2 {
	/**
	 * Provide results that match the given text pattern.
	 * @param query The parameters for this query.
	 * @param options A set of options to consider while searching.
	 * @param progress A progress callback that must be invoked for all results.
	 * @param token A cancellation token.
	 */
	provideTextSearchResults(query: TextSearchQuery2, options: TextSearchProviderOptions, progress: IProgress<TextSearchResult2>, token: CancellationToken): ProviderResult<TextSearchComplete2>;
}

/**
 * Information collected when text search is complete.
 */
export interface TextSearchComplete2 {
	/**
	 * Whether the search hit the limit on the maximum number of search results.
	 * `maxResults` on {@linkcode TextSearchOptions} specifies the max number of results.
	 * - If exactly that number of matches exist, this should be false.
	 * - If `maxResults` matches are returned and more exist, this should be true.
	 * - If search hits an internal limit which is less than `maxResults`, this should be true.
	 */
	limitHit?: boolean;

	/**
	 * Additional information regarding the state of the completed search.
	 *
	 * Messages with "Information" style support links in markdown syntax:
	 * - Click to [run a command](command:workbench.action.OpenQuickPick)
	 * - Click to [open a website](https://aka.ms)
	 *
	 * Commands may optionally return { triggerSearch: true } to signal to the editor that the original search should run be again.
	 */
	message?: TextSearchCompleteMessage2[];
}

/**
 * A message regarding a completed search.
 */
export interface TextSearchCompleteMessage2 {
	/**
	 * Markdown text of the message.
	 */
	text: string;
	/**
	 * Whether the source of the message is trusted, command links are disabled for untrusted message sources.
	 * Messaged are untrusted by default.
	 */
	trusted?: boolean;
	/**
	 * The message type, this affects how the message will be rendered.
	 */
	type: TextSearchCompleteMessageType;
}


/**
 * A FileSearchProvider provides search results for files in the given folder that match a query string. It can be invoked by quickaccess or other extensions.
 *
 * A FileSearchProvider is the more powerful of two ways to implement file search in VS Code. Use a FileSearchProvider if you wish to search within a folder for
 * all files that match the user's query.
 *
 * The FileSearchProvider will be invoked on every keypress in quickaccess. When `workspace.findFiles` is called, it will be invoked with an empty query string,
 * and in that case, every file in the folder should be returned.
 */
export interface FileSearchProvider2 {
	/**
	 * Provide the set of files that match a certain file path pattern.
	 * @param query The parameters for this query.
	 * @param options A set of options to consider while searching files.
	 * @param progress A progress callback that must be invoked for all results.
	 * @param token A cancellation token.
	 */
	provideFileSearchResults(pattern: string, options: FileSearchProviderOptions, token: CancellationToken): ProviderResult<URI[]>;
}

/**
 * A TextSearchProvider provides search results for text results inside files in the workspace.
 */
export interface TextSearchProvider2 {
	/**
	 * Provide results that match the given text pattern.
	 * @param query The parameters for this query.
	 * @param options A set of options to consider while searching.
	 * @param progress A progress callback that must be invoked for all results.
	 * @param token A cancellation token.
	 */
	provideTextSearchResults(query: TextSearchQuery2, options: TextSearchProviderOptions, progress: IProgress<TextSearchResult2>, token: CancellationToken): ProviderResult<TextSearchComplete2>;
}

/**
 * Information collected when text search is complete.
 */
export interface TextSearchComplete2 {
	/**
	 * Whether the search hit the limit on the maximum number of search results.
	 * `maxResults` on {@link TextSearchOptions} specifies the max number of results.
	 * - If exactly that number of matches exist, this should be false.
	 * - If `maxResults` matches are returned and more exist, this should be true.
	 * - If search hits an internal limit which is less than `maxResults`, this should be true.
	 */
	limitHit?: boolean;

	/**
	 * Additional information regarding the state of the completed search.
	 *
	 * Messages with "Information" style support links in markdown syntax:
	 * - Click to [run a command](command:workbench.action.OpenQuickPick)
	 * - Click to [open a website](https://aka.ms)
	 *
	 * Commands may optionally return { triggerSearch: true } to signal to the editor that the original search should run be again.
	 */
	message?: TextSearchCompleteMessage2[];
}

/**
 * A message regarding a completed search.
 */
export interface TextSearchCompleteMessage2 {
	/**
	 * Markdown text of the message.
	 */
	text: string;
	/**
	 * Whether the source of the message is trusted, command links are disabled for untrusted message sources.
	 * Messaged are untrusted by default.
	 */
	trusted?: boolean;
	/**
	 * The message type, this affects how the message will be rendered.
	 */
	type: TextSearchCompleteMessageType;
}

/**
 * Options for following search.exclude and files.exclude settings.
 */
export enum ExcludeSettingOptions {
	/*
	 * Don't use any exclude settings.
	 */
	None = 1,
	/*
	 * Use:
	 * - files.exclude setting
	 */
	FilesExclude = 2,
	/*
	 * Use:
	 * - files.exclude setting
	 * - search.exclude setting
	 */
	SearchAndFilesExclude = 3
}

export enum TextSearchCompleteMessageType {
	Information = 1,
	Warning = 2,
}


/**
 * A message regarding a completed search.
 */
export interface TextSearchCompleteMessage {
	/**
	 * Markdown text of the message.
	 */
	text: string;
	/**
	 * Whether the source of the message is trusted, command links are disabled for untrusted message sources.
	 */
	trusted?: boolean;
	/**
	 * The message type, this affects how the message will be rendered.
	 */
	type: TextSearchCompleteMessageType;
}


/**
 * An AITextSearchProvider provides additional AI text search results in the workspace.
 */
export interface AITextSearchProvider {

	/**
	 * The name of the AI searcher. Will be displayed as `{name} Results` in the Search View.
	 */
	readonly name?: string;

	/**
	 * WARNING: VERY EXPERIMENTAL.
	 *
	 * Provide results that match the given text pattern.
	 * @param query The parameter for this query.
	 * @param options A set of options to consider while searching.
	 * @param progress A progress callback that must be invoked for all results.
	 * @param token A cancellation token.
	 */
	provideAITextSearchResults(query: string, options: TextSearchProviderOptions, progress: IProgress<TextSearchResult2>, token: CancellationToken): ProviderResult<TextSearchComplete2>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/common/searchExtTypesInternal.ts]---
Location: vscode-main/src/vs/workbench/services/search/common/searchExtTypesInternal.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { FileSearchProviderFolderOptions, FileSearchProviderOptions, TextSearchProviderFolderOptions, TextSearchProviderOptions } from './searchExtTypes.js';

interface RipgrepSearchOptionsCommon {
	numThreads?: number;
}

export type TextSearchProviderOptionsRipgrep = Omit<Partial<TextSearchProviderOptions>, 'folderOptions'> & {
	folderOptions: TextSearchProviderFolderOptions;
};

export type FileSearchProviderOptionsRipgrep = & {
	folderOptions: FileSearchProviderFolderOptions;
} & FileSearchProviderOptions;

export interface RipgrepTextSearchOptions extends TextSearchProviderOptionsRipgrep, RipgrepSearchOptionsCommon { }

export interface RipgrepFileSearchOptions extends FileSearchProviderOptionsRipgrep, RipgrepSearchOptionsCommon { }
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/common/searchHelpers.ts]---
Location: vscode-main/src/vs/workbench/services/search/common/searchHelpers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Range } from '../../../../editor/common/core/range.js';
import { FindMatch, ITextModel } from '../../../../editor/common/model.js';
import { ITextSearchPreviewOptions, TextSearchMatch, ITextSearchResult, ITextSearchMatch, ITextSearchQuery } from './search.js';

function editorMatchToTextSearchResult(matches: FindMatch[], model: ITextModel, previewOptions?: ITextSearchPreviewOptions): TextSearchMatch {
	const firstLine = matches[0].range.startLineNumber;
	const lastLine = matches[matches.length - 1].range.endLineNumber;

	const lineTexts: string[] = [];
	for (let i = firstLine; i <= lastLine; i++) {
		lineTexts.push(model.getLineContent(i));
	}

	return new TextSearchMatch(
		lineTexts.join('\n') + '\n',
		matches.map(m => new Range(m.range.startLineNumber - 1, m.range.startColumn - 1, m.range.endLineNumber - 1, m.range.endColumn - 1)),
		previewOptions);
}

/**
 * Combine a set of FindMatches into a set of TextSearchResults. They should be grouped by matches that start on the same line that the previous match ends on.
 */
export function editorMatchesToTextSearchResults(matches: FindMatch[], model: ITextModel, previewOptions?: ITextSearchPreviewOptions): TextSearchMatch[] {
	let previousEndLine = -1;
	const groupedMatches: FindMatch[][] = [];
	let currentMatches: FindMatch[] = [];
	matches.forEach((match) => {
		if (match.range.startLineNumber !== previousEndLine) {
			currentMatches = [];
			groupedMatches.push(currentMatches);
		}

		currentMatches.push(match);
		previousEndLine = match.range.endLineNumber;
	});

	return groupedMatches.map(sameLineMatches => {
		return editorMatchToTextSearchResult(sameLineMatches, model, previewOptions);
	});
}

export function getTextSearchMatchWithModelContext(matches: ITextSearchMatch[], model: ITextModel, query: ITextSearchQuery): ITextSearchResult[] {
	const results: ITextSearchResult[] = [];

	let prevLine = -1;
	for (let i = 0; i < matches.length; i++) {
		const { start: matchStartLine, end: matchEndLine } = getMatchStartEnd(matches[i]);
		if (typeof query.surroundingContext === 'number' && query.surroundingContext > 0) {
			const beforeContextStartLine = Math.max(prevLine + 1, matchStartLine - query.surroundingContext);
			for (let b = beforeContextStartLine; b < matchStartLine; b++) {
				results.push({
					text: model.getLineContent(b + 1),
					lineNumber: b + 1
				});
			}
		}

		results.push(matches[i]);

		const nextMatch = matches[i + 1];
		const nextMatchStartLine = nextMatch ? getMatchStartEnd(nextMatch).start : Number.MAX_VALUE;
		if (typeof query.surroundingContext === 'number' && query.surroundingContext > 0) {
			const afterContextToLine = Math.min(nextMatchStartLine - 1, matchEndLine + query.surroundingContext, model.getLineCount() - 1);
			for (let a = matchEndLine + 1; a <= afterContextToLine; a++) {
				results.push({
					text: model.getLineContent(a + 1),
					lineNumber: a + 1
				});
			}
		}

		prevLine = matchEndLine;
	}

	return results;
}

function getMatchStartEnd(match: ITextSearchMatch): { start: number; end: number } {
	const matchRanges = match.rangeLocations.map(e => e.source);
	const matchStartLine = matchRanges[0].startLineNumber;
	const matchEndLine = matchRanges[matchRanges.length - 1].endLineNumber;

	return {
		start: matchStartLine,
		end: matchEndLine
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/common/searchService.ts]---
Location: vscode-main/src/vs/workbench/services/search/common/searchService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as arrays from '../../../../base/common/arrays.js';
import { DeferredPromise, raceCancellationError } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { CancellationError } from '../../../../base/common/errors.js';
import { Disposable, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { ResourceMap, ResourceSet } from '../../../../base/common/map.js';
import { Schemas } from '../../../../base/common/network.js';
import { randomChance } from '../../../../base/common/numbers.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { isNumber } from '../../../../base/common/types.js';
import { URI, URI as uri } from '../../../../base/common/uri.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { EditorResourceAccessor, SideBySideEditor } from '../../../common/editor.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { DEFAULT_MAX_SEARCH_RESULTS, deserializeSearchError, FileMatch, IAITextQuery, ICachedSearchStats, IFileMatch, IFileQuery, IFileSearchStats, IFolderQuery, IProgressMessage, isAIKeyword, ISearchComplete, ISearchEngineStats, ISearchProgressItem, ISearchQuery, ISearchResultProvider, ISearchService, isFileMatch, isProgressMessage, ITextQuery, pathIncludedInQuery, QueryType, SEARCH_RESULT_LANGUAGE_ID, SearchError, SearchErrorCode, SearchProviderType } from './search.js';
import { getTextSearchMatchWithModelContext, editorMatchesToTextSearchResults } from './searchHelpers.js';

export class SearchService extends Disposable implements ISearchService {

	declare readonly _serviceBrand: undefined;

	private readonly fileSearchProviders = new Map<string, ISearchResultProvider>();
	private readonly textSearchProviders = new Map<string, ISearchResultProvider>();
	private readonly aiTextSearchProviders = new Map<string, ISearchResultProvider>();

	private deferredFileSearchesByScheme = new Map<string, DeferredPromise<ISearchResultProvider>>();
	private deferredTextSearchesByScheme = new Map<string, DeferredPromise<ISearchResultProvider>>();
	private deferredAITextSearchesByScheme = new Map<string, DeferredPromise<ISearchResultProvider>>();

	private loggedSchemesMissingProviders = new Set<string>();

	constructor(
		@IModelService private readonly modelService: IModelService,
		@IEditorService private readonly editorService: IEditorService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@ILogService private readonly logService: ILogService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IFileService private readonly fileService: IFileService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
	) {
		super();
	}

	registerSearchResultProvider(scheme: string, type: SearchProviderType, provider: ISearchResultProvider): IDisposable {
		let list: Map<string, ISearchResultProvider>;
		let deferredMap: Map<string, DeferredPromise<ISearchResultProvider>>;
		if (type === SearchProviderType.file) {
			list = this.fileSearchProviders;
			deferredMap = this.deferredFileSearchesByScheme;
		} else if (type === SearchProviderType.text) {
			list = this.textSearchProviders;
			deferredMap = this.deferredTextSearchesByScheme;
		} else if (type === SearchProviderType.aiText) {
			list = this.aiTextSearchProviders;
			deferredMap = this.deferredAITextSearchesByScheme;
		} else {
			throw new Error('Unknown SearchProviderType');
		}

		list.set(scheme, provider);

		if (deferredMap.has(scheme)) {
			deferredMap.get(scheme)!.complete(provider);
			deferredMap.delete(scheme);
		}

		return toDisposable(() => {
			list.delete(scheme);
		});
	}

	async textSearch(query: ITextQuery, token?: CancellationToken, onProgress?: (item: ISearchProgressItem) => void): Promise<ISearchComplete> {
		const results = this.textSearchSplitSyncAsync(query, token, onProgress);
		const openEditorResults = results.syncResults;
		const otherResults = await results.asyncResults;
		return {
			limitHit: otherResults.limitHit || openEditorResults.limitHit,
			results: [...otherResults.results, ...openEditorResults.results],
			messages: [...otherResults.messages, ...openEditorResults.messages]
		};
	}

	async aiTextSearch(query: IAITextQuery, token?: CancellationToken, onProgress?: (item: ISearchProgressItem) => void): Promise<ISearchComplete> {
		const onProviderProgress = (progress: ISearchProgressItem) => {
			// Match
			if (onProgress) { // don't override open editor results
				if (isFileMatch(progress) || isAIKeyword(progress)) {
					onProgress(progress);
				} else {
					onProgress(<IProgressMessage>progress);
				}
			}

			if (isProgressMessage(progress)) {
				this.logService.debug('SearchService#search', progress.message);
			}
		};
		return this.doSearch(query, token, onProviderProgress);
	}

	async getAIName(): Promise<string | undefined> {
		const provider = this.getSearchProvider(QueryType.aiText).get(Schemas.file);
		return await provider?.getAIName();
	}

	textSearchSplitSyncAsync(
		query: ITextQuery,
		token?: CancellationToken | undefined,
		onProgress?: ((result: ISearchProgressItem) => void) | undefined,
		notebookFilesToIgnore?: ResourceSet,
		asyncNotebookFilesToIgnore?: Promise<ResourceSet>
	): {
		syncResults: ISearchComplete;
		asyncResults: Promise<ISearchComplete>;
	} {
		// Get open editor results from dirty/untitled
		const openEditorResults = this.getOpenEditorResults(query);

		if (onProgress) {
			arrays.coalesce([...openEditorResults.results.values()]).filter(e => !(notebookFilesToIgnore && notebookFilesToIgnore.has(e.resource))).forEach(onProgress);
		}

		const syncResults: ISearchComplete = {
			results: arrays.coalesce([...openEditorResults.results.values()]),
			limitHit: openEditorResults.limitHit ?? false,
			messages: []
		};

		const getAsyncResults = async () => {
			const resolvedAsyncNotebookFilesToIgnore = await asyncNotebookFilesToIgnore ?? new ResourceSet();
			const onProviderProgress = (progress: ISearchProgressItem) => {
				if (isFileMatch(progress)) {
					// Match
					if (!openEditorResults.results.has(progress.resource) && !resolvedAsyncNotebookFilesToIgnore.has(progress.resource) && onProgress) { // don't override open editor results
						onProgress(progress);
					}
				} else if (onProgress) {
					// Progress
					onProgress(<IProgressMessage>progress);
				}

				if (isProgressMessage(progress)) {
					this.logService.debug('SearchService#search', progress.message);
				}
			};
			return await this.doSearch(query, token, onProviderProgress);
		};

		return {
			syncResults,
			asyncResults: getAsyncResults()
		};
	}

	fileSearch(query: IFileQuery, token?: CancellationToken): Promise<ISearchComplete> {
		return this.doSearch(query, token);
	}

	schemeHasFileSearchProvider(scheme: string): boolean {
		return this.fileSearchProviders.has(scheme);
	}

	private doSearch(query: ISearchQuery, token?: CancellationToken, onProgress?: (item: ISearchProgressItem) => void): Promise<ISearchComplete> {
		this.logService.trace('SearchService#search', JSON.stringify(query));

		const schemesInQuery = this.getSchemesInQuery(query);

		const providerActivations: Promise<unknown>[] = [Promise.resolve(null)];
		schemesInQuery.forEach(scheme => providerActivations.push(this.extensionService.activateByEvent(`onSearch:${scheme}`)));
		providerActivations.push(this.extensionService.activateByEvent('onSearch:file'));

		const providerPromise = (async () => {
			await Promise.all(providerActivations);
			await this.extensionService.whenInstalledExtensionsRegistered();

			// Cancel faster if search was canceled while waiting for extensions
			if (token && token.isCancellationRequested) {
				return Promise.reject(new CancellationError());
			}

			const progressCallback = (item: ISearchProgressItem) => {
				if (token && token.isCancellationRequested) {
					return;
				}

				onProgress?.(item);
			};

			const exists = await Promise.all(query.folderQueries.map(query => this.fileService.exists(query.folder)));
			query.folderQueries = query.folderQueries.filter((_, i) => exists[i]);

			let completes = await this.searchWithProviders(query, progressCallback, token);
			completes = arrays.coalesce(completes);
			if (!completes.length) {
				return {
					limitHit: false,
					results: [],
					messages: [],
				};
			}

			return {
				limitHit: completes[0] && completes[0].limitHit,
				stats: completes[0].stats,
				messages: arrays.coalesce(completes.flatMap(i => i.messages)).filter(arrays.uniqueFilter(message => message.type + message.text + message.trusted)),
				results: completes.flatMap((c: ISearchComplete) => c.results),
				aiKeywords: completes.flatMap((c: ISearchComplete) => c.aiKeywords).filter(keyword => keyword !== undefined),
			};
		})();

		return token ? raceCancellationError<ISearchComplete>(providerPromise, token) : providerPromise;
	}

	private getSchemesInQuery(query: ISearchQuery): Set<string> {
		const schemes = new Set<string>();
		query.folderQueries?.forEach(fq => schemes.add(fq.folder.scheme));

		query.extraFileResources?.forEach(extraFile => schemes.add(extraFile.scheme));

		return schemes;
	}

	private async waitForProvider(queryType: QueryType, scheme: string): Promise<ISearchResultProvider> {
		const deferredMap: Map<string, DeferredPromise<ISearchResultProvider>> = this.getDeferredTextSearchesByScheme(queryType);

		if (deferredMap.has(scheme)) {
			return deferredMap.get(scheme)!.p;
		} else {
			const deferred = new DeferredPromise<ISearchResultProvider>();
			deferredMap.set(scheme, deferred);
			return deferred.p;
		}
	}

	private getSearchProvider(type: QueryType): Map<string, ISearchResultProvider> {
		switch (type) {
			case QueryType.File:
				return this.fileSearchProviders;
			case QueryType.Text:
				return this.textSearchProviders;
			case QueryType.aiText:
				return this.aiTextSearchProviders;
			default:
				throw new Error(`Unknown query type: ${type}`);
		}
	}

	private getDeferredTextSearchesByScheme(type: QueryType): Map<string, DeferredPromise<ISearchResultProvider>> {
		switch (type) {
			case QueryType.File:
				return this.deferredFileSearchesByScheme;
			case QueryType.Text:
				return this.deferredTextSearchesByScheme;
			case QueryType.aiText:
				return this.deferredAITextSearchesByScheme;
			default:
				throw new Error(`Unknown query type: ${type}`);
		}
	}

	private async searchWithProviders(query: ISearchQuery, onProviderProgress: (progress: ISearchProgressItem) => void, token?: CancellationToken) {
		const e2eSW = StopWatch.create(false);

		const searchPs: Promise<ISearchComplete>[] = [];

		const fqs = this.groupFolderQueriesByScheme(query);
		const someSchemeHasProvider = [...fqs.keys()].some(scheme => {
			return this.getSearchProvider(query.type).has(scheme);
		});

		await Promise.all([...fqs.keys()].map(async scheme => {
			if (query.onlyFileScheme && scheme !== Schemas.file) {
				return;
			}
			const schemeFQs = fqs.get(scheme)!;
			let provider = this.getSearchProvider(query.type).get(scheme);

			if (!provider) {
				if (someSchemeHasProvider) {
					if (!this.loggedSchemesMissingProviders.has(scheme)) {
						this.logService.warn(`No search provider registered for scheme: ${scheme}. Another scheme has a provider, not waiting for ${scheme}`);
						this.loggedSchemesMissingProviders.add(scheme);
					}
					return;
				} else {
					if (!this.loggedSchemesMissingProviders.has(scheme)) {
						this.logService.warn(`No search provider registered for scheme: ${scheme}, waiting`);
						this.loggedSchemesMissingProviders.add(scheme);
					}
					provider = await this.waitForProvider(query.type, scheme);
				}
			}

			const oneSchemeQuery: ISearchQuery = {
				...query,
				...{
					folderQueries: schemeFQs
				}
			};

			const doProviderSearch = () => {
				switch (query.type) {
					case QueryType.File:
						return provider.fileSearch(<IFileQuery>oneSchemeQuery, token);
					case QueryType.Text:
						return provider.textSearch(<ITextQuery>oneSchemeQuery, onProviderProgress, token);
					default:
						return provider.textSearch(<ITextQuery>oneSchemeQuery, onProviderProgress, token);
				}
			};

			searchPs.push(doProviderSearch());
		}));

		return Promise.all(searchPs).then(completes => {
			const endToEndTime = e2eSW.elapsed();
			this.logService.trace(`SearchService#search: ${endToEndTime}ms`);
			completes.forEach(complete => {
				this.sendTelemetry(query, endToEndTime, complete);
			});
			return completes;
		}, err => {
			const endToEndTime = e2eSW.elapsed();
			this.logService.trace(`SearchService#search: ${endToEndTime}ms`);
			const searchError = deserializeSearchError(err);
			this.logService.trace(`SearchService#searchError: ${searchError.message}`);
			this.sendTelemetry(query, endToEndTime, undefined, searchError);

			throw searchError;
		});
	}

	private groupFolderQueriesByScheme(query: ISearchQuery): Map<string, IFolderQuery[]> {
		const queries = new Map<string, IFolderQuery[]>();

		query.folderQueries.forEach(fq => {
			const schemeFQs = queries.get(fq.folder.scheme) || [];
			schemeFQs.push(fq);

			queries.set(fq.folder.scheme, schemeFQs);
		});

		return queries;
	}

	private sendTelemetry(query: ISearchQuery, endToEndTime: number, complete?: ISearchComplete, err?: SearchError): void {
		if (!randomChance(5 / 100)) {
			// Noisy events, only send 5% of them
			return;
		}

		const fileSchemeOnly = query.folderQueries.every(fq => fq.folder.scheme === Schemas.file);
		const otherSchemeOnly = query.folderQueries.every(fq => fq.folder.scheme !== Schemas.file);
		const scheme = fileSchemeOnly ? Schemas.file :
			otherSchemeOnly ? 'other' :
				'mixed';

		if (query.type === QueryType.File && complete && complete.stats) {
			const fileSearchStats = complete.stats as IFileSearchStats;
			if (fileSearchStats.fromCache) {
				const cacheStats: ICachedSearchStats = fileSearchStats.detailStats as ICachedSearchStats;

				type CachedSearchCompleteClassifcation = {
					owner: 'roblourens';
					comment: 'Fired when a file search is completed from previously cached results';
					reason?: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Indicates which extension or UI feature triggered this search' };
					resultCount: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The number of search results' };
					workspaceFolderCount: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The number of folders in the workspace' };
					endToEndTime: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The total search time' };
					sortingTime?: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The amount of time spent sorting results' };
					cacheWasResolved: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Whether the cache was already resolved when the search began' };
					cacheLookupTime: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The amount of time spent looking up the cache to use for the search' };
					cacheFilterTime: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The amount of time spent searching within the cache' };
					cacheEntryCount: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The number of entries in the searched-in cache' };
					scheme: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The uri scheme of the folder searched in' };
				};
				type CachedSearchCompleteEvent = {
					reason?: string;
					resultCount: number;
					workspaceFolderCount: number;
					endToEndTime: number;
					sortingTime?: number;
					cacheWasResolved: boolean;
					cacheLookupTime: number;
					cacheFilterTime: number;
					cacheEntryCount: number;
					scheme: string;
				};
				this.telemetryService.publicLog2<CachedSearchCompleteEvent, CachedSearchCompleteClassifcation>('cachedSearchComplete', {
					reason: query._reason,
					resultCount: fileSearchStats.resultCount,
					workspaceFolderCount: query.folderQueries.length,
					endToEndTime: endToEndTime,
					sortingTime: fileSearchStats.sortingTime,
					cacheWasResolved: cacheStats.cacheWasResolved,
					cacheLookupTime: cacheStats.cacheLookupTime,
					cacheFilterTime: cacheStats.cacheFilterTime,
					cacheEntryCount: cacheStats.cacheEntryCount,
					scheme
				});
			} else {
				const searchEngineStats: ISearchEngineStats = fileSearchStats.detailStats as ISearchEngineStats;

				type SearchCompleteClassification = {
					owner: 'roblourens';
					comment: 'Fired when a file search is completed';
					reason?: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Indicates which extension or UI feature triggered this search' };
					resultCount: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The number of search results' };
					workspaceFolderCount: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The number of folders in the workspace' };
					endToEndTime: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The total search time' };
					sortingTime?: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The amount of time spent sorting results' };
					fileWalkTime: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The amount of time spent walking file system' };
					directoriesWalked: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The number of directories walked' };
					filesWalked: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The number of files walked' };
					cmdTime: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The amount of time spent running the search command' };
					cmdResultCount?: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The number of results returned from the search command' };
					scheme: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The uri scheme of the folder searched in' };
				};
				type SearchCompleteEvent = {
					reason?: string;
					resultCount: number;
					workspaceFolderCount: number;
					endToEndTime: number;
					sortingTime?: number;
					fileWalkTime: number;
					directoriesWalked: number;
					filesWalked: number;
					cmdTime: number;
					cmdResultCount?: number;
					scheme: string;

				};

				this.telemetryService.publicLog2<SearchCompleteEvent, SearchCompleteClassification>('searchComplete', {
					reason: query._reason,
					resultCount: fileSearchStats.resultCount,
					workspaceFolderCount: query.folderQueries.length,
					endToEndTime: endToEndTime,
					sortingTime: fileSearchStats.sortingTime,
					fileWalkTime: searchEngineStats.fileWalkTime,
					directoriesWalked: searchEngineStats.directoriesWalked,
					filesWalked: searchEngineStats.filesWalked,
					cmdTime: searchEngineStats.cmdTime,
					cmdResultCount: searchEngineStats.cmdResultCount,
					scheme
				});
			}
		} else if (query.type === QueryType.Text) {
			let errorType: string | undefined;
			if (err) {
				errorType = err.code === SearchErrorCode.regexParseError ? 'regex' :
					err.code === SearchErrorCode.unknownEncoding ? 'encoding' :
						err.code === SearchErrorCode.globParseError ? 'glob' :
							err.code === SearchErrorCode.invalidLiteral ? 'literal' :
								err.code === SearchErrorCode.other ? 'other' :
									err.code === SearchErrorCode.canceled ? 'canceled' :
										'unknown';
			}

			type TextSearchCompleteClassification = {
				owner: 'roblourens';
				comment: 'Fired when a text search is completed';
				reason?: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Indicates which extension or UI feature triggered this search' };
				workspaceFolderCount: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The number of folders in the workspace' };
				endToEndTime: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The total search time' };
				scheme: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The uri scheme of the folder searched in' };
				error?: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The type of the error, if any' };
			};
			type TextSearchCompleteEvent = {
				reason?: string;
				workspaceFolderCount: number;
				endToEndTime: number;
				scheme: string;
				error?: string;
			};
			this.telemetryService.publicLog2<TextSearchCompleteEvent, TextSearchCompleteClassification>('textSearchComplete', {
				reason: query._reason,
				workspaceFolderCount: query.folderQueries.length,
				endToEndTime: endToEndTime,
				scheme,
				error: errorType,
			});
		}
	}

	private getOpenEditorResults(query: ITextQuery): { results: ResourceMap<IFileMatch | null>; limitHit: boolean } {
		const openEditorResults = new ResourceMap<IFileMatch | null>(uri => this.uriIdentityService.extUri.getComparisonKey(uri));
		let limitHit = false;

		if (query.type === QueryType.Text) {
			const canonicalToOriginalResources = new ResourceMap<URI>();
			for (const editorInput of this.editorService.editors) {
				const canonical = EditorResourceAccessor.getCanonicalUri(editorInput, { supportSideBySide: SideBySideEditor.PRIMARY });
				const original = EditorResourceAccessor.getOriginalUri(editorInput, { supportSideBySide: SideBySideEditor.PRIMARY });

				if (canonical) {
					canonicalToOriginalResources.set(canonical, original ?? canonical);
				}
			}

			const models = this.modelService.getModels();
			models.forEach((model) => {
				const resource = model.uri;
				if (!resource) {
					return;
				}

				if (limitHit) {
					return;
				}

				const originalResource = canonicalToOriginalResources.get(resource);
				if (!originalResource) {
					return;
				}

				// Skip search results
				if (model.getLanguageId() === SEARCH_RESULT_LANGUAGE_ID && !(query.includePattern && query.includePattern['**/*.code-search'])) {
					// TODO: untitled search editors will be excluded from search even when include *.code-search is specified
					return;
				}

				// Block walkthrough, webview, etc.
				if (originalResource.scheme !== Schemas.untitled && !this.fileService.hasProvider(originalResource)) {
					return;
				}

				// Exclude files from the git FileSystemProvider, e.g. to prevent open staged files from showing in search results
				if (originalResource.scheme === 'git') {
					return;
				}

				if (!this.matches(originalResource, query)) {
					return; // respect user filters
				}

				// Use editor API to find matches
				const askMax = (isNumber(query.maxResults) ? query.maxResults : DEFAULT_MAX_SEARCH_RESULTS) + 1;
				let matches = model.findMatches(query.contentPattern.pattern, false, !!query.contentPattern.isRegExp, !!query.contentPattern.isCaseSensitive, query.contentPattern.isWordMatch ? query.contentPattern.wordSeparators! : null, false, askMax);
				if (matches.length) {
					if (askMax && matches.length >= askMax) {
						limitHit = true;
						matches = matches.slice(0, askMax - 1);
					}

					const fileMatch = new FileMatch(originalResource);
					openEditorResults.set(originalResource, fileMatch);

					const textSearchResults = editorMatchesToTextSearchResults(matches, model, query.previewOptions);
					fileMatch.results = getTextSearchMatchWithModelContext(textSearchResults, model, query);
				} else {
					openEditorResults.set(originalResource, null);
				}
			});
		}

		return {
			results: openEditorResults,
			limitHit
		};
	}

	private matches(resource: uri, query: ITextQuery): boolean {
		return pathIncludedInQuery(query, resource.fsPath);
	}

	async clearCache(cacheKey: string): Promise<void> {
		const clearPs = Array.from(this.fileSearchProviders.values())
			.map(provider => provider && provider.clearCache(cacheKey));
		await Promise.all(clearPs);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/common/textSearchManager.ts]---
Location: vscode-main/src/vs/workbench/services/search/common/textSearchManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isThenable } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { Schemas } from '../../../../base/common/network.js';
import * as path from '../../../../base/common/path.js';
import * as resources from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { FolderQuerySearchTree } from './folderQuerySearchTree.js';
import { DEFAULT_MAX_SEARCH_RESULTS, hasSiblingPromiseFn, IAITextQuery, IExtendedExtensionSearchOptions, IFileMatch, IFolderQuery, excludeToGlobPattern, IPatternInfo, ISearchCompleteStats, ITextQuery, ITextSearchContext, ITextSearchMatch, ITextSearchResult, ITextSearchStats, QueryGlobTester, QueryType, resolvePatternsForProvider, ISearchRange, DEFAULT_TEXT_SEARCH_PREVIEW_OPTIONS } from './search.js';
import { TextSearchComplete2, TextSearchMatch2, TextSearchProviderFolderOptions, TextSearchProvider2, TextSearchProviderOptions, TextSearchQuery2, TextSearchResult2, AITextSearchProvider, AISearchResult, AISearchKeyword } from './searchExtTypes.js';

export interface IFileUtils {
	readdir: (resource: URI) => Promise<string[]>;
	toCanonicalName: (encoding: string) => string;
}
interface IAITextQueryProviderPair {
	query: IAITextQuery; provider: AITextSearchProvider;
}

interface ITextQueryProviderPair {
	query: ITextQuery; provider: TextSearchProvider2;
}
interface FolderQueryInfo {
	queryTester: QueryGlobTester;
	folder: URI;
	folderIdx: number;
}

export class TextSearchManager {

	private collector: TextSearchResultsCollector | null = null;

	private isLimitHit = false;
	private resultCount = 0;

	constructor(private queryProviderPair: IAITextQueryProviderPair | ITextQueryProviderPair,
		private fileUtils: IFileUtils,
		private processType: ITextSearchStats['type']) { }

	private get query() {
		return this.queryProviderPair.query;
	}

	search(onProgress: (matches: IFileMatch[]) => void, token: CancellationToken, onKeywordResult?: (keyword: AISearchKeyword) => void): Promise<ISearchCompleteStats> {
		const folderQueries = this.query.folderQueries || [];
		const tokenSource = new CancellationTokenSource(token);

		return new Promise<ISearchCompleteStats>((resolve, reject) => {
			this.collector = new TextSearchResultsCollector(onProgress);

			let isCanceled = false;
			const onResult = (result: TextSearchResult2, folderIdx: number) => {
				if (result instanceof AISearchKeyword) {
					// Already processed by the callback.
					return;
				}
				if (isCanceled) {
					return;
				}

				if (!this.isLimitHit) {
					const resultSize = this.resultSize(result);
					if (result instanceof TextSearchMatch2 && typeof this.query.maxResults === 'number' && this.resultCount + resultSize > this.query.maxResults) {
						this.isLimitHit = true;
						isCanceled = true;
						tokenSource.cancel();

						result = this.trimResultToSize(result, this.query.maxResults - this.resultCount);
					}

					const newResultSize = this.resultSize(result);
					this.resultCount += newResultSize;
					const a = result instanceof TextSearchMatch2;

					if (newResultSize > 0 || !a) {
						this.collector!.add(result, folderIdx);
					}
				}
			};

			// For each root folder
			this.doSearch(folderQueries, onResult, tokenSource.token, onKeywordResult).then(result => {
				tokenSource.dispose();
				this.collector!.flush();

				resolve({
					limitHit: this.isLimitHit || result?.limitHit,
					messages: this.getMessagesFromResults(result),
					stats: {
						type: this.processType
					}
				});
			}, (err: Error) => {
				tokenSource.dispose();
				const errMsg = toErrorMessage(err);
				reject(new Error(errMsg));
			});
		});
	}

	private getMessagesFromResults(result: TextSearchComplete2 | null | undefined) {
		if (!result?.message) { return []; }
		if (Array.isArray(result.message)) { return result.message; }
		return [result.message];
	}

	private resultSize(result: TextSearchResult2): number {
		if (result instanceof TextSearchMatch2) {
			return Array.isArray(result.ranges) ?
				result.ranges.length :
				1;
		}
		else {
			// #104400 context lines shoudn't count towards result count
			return 0;
		}
	}

	private trimResultToSize(result: TextSearchMatch2, size: number): TextSearchMatch2 {
		return new TextSearchMatch2(result.uri, result.ranges.slice(0, size), result.previewText);
	}

	private async doSearch(folderQueries: IFolderQuery<URI>[], onResult: (result: TextSearchResult2, folderIdx: number) => void, token: CancellationToken, onKeywordResult?: (keyword: AISearchKeyword) => void): Promise<TextSearchComplete2 | null | undefined> {
		const folderMappings: FolderQuerySearchTree<FolderQueryInfo> = new FolderQuerySearchTree<FolderQueryInfo>(
			folderQueries,
			(fq, i) => {
				const queryTester = new QueryGlobTester(this.query, fq);
				return { queryTester, folder: fq.folder, folderIdx: i };
			},
			() => true
		);

		const testingPs: Promise<void>[] = [];
		const progress = {
			report: (result: TextSearchResult2 | AISearchResult) => {
				if (result instanceof AISearchKeyword) {
					onKeywordResult?.(result);
				} else {
					if (result.uri === undefined) {
						throw Error('Text search result URI is undefined. Please check provider implementation.');
					}
					const folderQuery = folderMappings.findQueryFragmentAwareSubstr(result.uri)!;
					const hasSibling = folderQuery.folder.scheme === Schemas.file ?
						hasSiblingPromiseFn(() => {
							return this.fileUtils.readdir(resources.dirname(result.uri));
						}) :
						undefined;

					const relativePath = resources.relativePath(folderQuery.folder, result.uri);
					if (relativePath) {
						// This method is only async when the exclude contains sibling clauses
						const included = folderQuery.queryTester.includedInQuery(relativePath, path.basename(relativePath), hasSibling);
						if (isThenable(included)) {
							testingPs.push(
								included.then(isIncluded => {
									if (isIncluded) {
										onResult(result, folderQuery.folderIdx);
									}
								}));
						} else if (included) {
							onResult(result, folderQuery.folderIdx);
						}
					}
				}
			}
		};

		const folderOptions = folderQueries.map(fq => this.getSearchOptionsForFolder(fq));
		const searchOptions: TextSearchProviderOptions = {
			folderOptions,
			maxFileSize: this.query.maxFileSize,
			maxResults: this.query.maxResults ?? DEFAULT_MAX_SEARCH_RESULTS,
			previewOptions: this.query.previewOptions ?? DEFAULT_TEXT_SEARCH_PREVIEW_OPTIONS,
			surroundingContext: this.query.surroundingContext ?? 0,
		};
		if ('usePCRE2' in this.query) {
			(<IExtendedExtensionSearchOptions>searchOptions).usePCRE2 = this.query.usePCRE2;
		}

		let result;
		if (this.queryProviderPair.query.type === QueryType.aiText) {
			result = await (this.queryProviderPair as IAITextQueryProviderPair).provider.provideAITextSearchResults(this.queryProviderPair.query.contentPattern, searchOptions, progress, token);
		} else {
			result = await (this.queryProviderPair as ITextQueryProviderPair).provider.provideTextSearchResults(patternInfoToQuery(this.queryProviderPair.query.contentPattern), searchOptions, progress, token);
		}
		if (testingPs.length) {
			await Promise.all(testingPs);
		}

		return result;
	}

	private getSearchOptionsForFolder(fq: IFolderQuery<URI>): TextSearchProviderFolderOptions {
		const includes = resolvePatternsForProvider(this.query.includePattern, fq.includePattern);

		let excludePattern = fq.excludePattern?.map(e => ({
			folder: e.folder,
			patterns: resolvePatternsForProvider(this.query.excludePattern, e.pattern)
		}));

		if (!excludePattern || excludePattern.length === 0) {
			excludePattern = [{
				folder: undefined,
				patterns: resolvePatternsForProvider(this.query.excludePattern, undefined)
			}];
		}
		const excludes = excludeToGlobPattern(excludePattern);

		const options = {
			folder: URI.from(fq.folder),
			excludes,
			includes,
			useIgnoreFiles: {
				local: !fq.disregardIgnoreFiles,
				parent: !fq.disregardParentIgnoreFiles,
				global: !fq.disregardGlobalIgnoreFiles
			},
			followSymlinks: !fq.ignoreSymlinks,
			encoding: (fq.fileEncoding && this.fileUtils.toCanonicalName(fq.fileEncoding)) ?? '',
		};
		return options;
	}
}

function patternInfoToQuery(patternInfo: IPatternInfo): TextSearchQuery2 {
	return {
		isCaseSensitive: patternInfo.isCaseSensitive || false,
		isRegExp: patternInfo.isRegExp || false,
		isWordMatch: patternInfo.isWordMatch || false,
		isMultiline: patternInfo.isMultiline || false,
		pattern: patternInfo.pattern
	};
}

export class TextSearchResultsCollector {
	private _batchedCollector: BatchedCollector<IFileMatch>;

	private _currentFolderIdx: number = -1;
	private _currentUri: URI | undefined;
	private _currentFileMatch: IFileMatch | null = null;

	constructor(private _onResult: (result: IFileMatch[]) => void) {
		this._batchedCollector = new BatchedCollector<IFileMatch>(512, items => this.sendItems(items));
	}

	add(data: TextSearchResult2, folderIdx: number): void {
		// Collects TextSearchResults into IInternalFileMatches and collates using BatchedCollector.
		// This is efficient for ripgrep which sends results back one file at a time. It wouldn't be efficient for other search
		// providers that send results in random order. We could do this step afterwards instead.
		if (this._currentFileMatch && (this._currentFolderIdx !== folderIdx || !resources.isEqual(this._currentUri, data.uri))) {
			this.pushToCollector();
			this._currentFileMatch = null;
		}

		if (!this._currentFileMatch) {
			this._currentFolderIdx = folderIdx;
			this._currentFileMatch = {
				resource: data.uri,
				results: []
			};
		}

		this._currentFileMatch.results!.push(extensionResultToFrontendResult(data));
	}

	private pushToCollector(): void {
		const size = this._currentFileMatch && this._currentFileMatch.results ?
			this._currentFileMatch.results.length :
			0;
		this._batchedCollector.addItem(this._currentFileMatch!, size);
	}

	flush(): void {
		this.pushToCollector();
		this._batchedCollector.flush();
	}

	private sendItems(items: IFileMatch[]): void {
		this._onResult(items);
	}
}

function extensionResultToFrontendResult(data: TextSearchResult2): ITextSearchResult {
	// Warning: result from RipgrepTextSearchEH has fake Range. Don't depend on any other props beyond these...
	if (data instanceof TextSearchMatch2) {
		return {
			previewText: data.previewText,
			rangeLocations: data.ranges.map(r => ({
				preview: {
					startLineNumber: r.previewRange.start.line,
					startColumn: r.previewRange.start.character,
					endLineNumber: r.previewRange.end.line,
					endColumn: r.previewRange.end.character
				} satisfies ISearchRange,
				source: {
					startLineNumber: r.sourceRange.start.line,
					startColumn: r.sourceRange.start.character,
					endLineNumber: r.sourceRange.end.line,
					endColumn: r.sourceRange.end.character
				} satisfies ISearchRange,
			})),
		} satisfies ITextSearchMatch;
	} else {
		return {
			text: data.text,
			lineNumber: data.lineNumber
		} satisfies ITextSearchContext;
	}
}


/**
 * Collects items that have a size - before the cumulative size of collected items reaches START_BATCH_AFTER_COUNT, the callback is called for every
 * set of items collected.
 * But after that point, the callback is called with batches of maxBatchSize.
 * If the batch isn't filled within some time, the callback is also called.
 */
export class BatchedCollector<T> {
	private static readonly TIMEOUT = 4000;

	// After START_BATCH_AFTER_COUNT items have been collected, stop flushing on timeout
	private static readonly START_BATCH_AFTER_COUNT = 50;

	private totalNumberCompleted = 0;
	private batch: T[] = [];
	private batchSize = 0;
	private timeoutHandle: Timeout | undefined;

	constructor(private maxBatchSize: number, private cb: (items: T[]) => void) {
	}

	addItem(item: T, size: number): void {
		if (!item) {
			return;
		}

		this.addItemToBatch(item, size);
	}

	addItems(items: T[], size: number): void {
		if (!items) {
			return;
		}

		this.addItemsToBatch(items, size);
	}

	private addItemToBatch(item: T, size: number): void {
		this.batch.push(item);
		this.batchSize += size;
		this.onUpdate();
	}

	private addItemsToBatch(item: T[], size: number): void {
		this.batch = this.batch.concat(item);
		this.batchSize += size;
		this.onUpdate();
	}

	private onUpdate(): void {
		if (this.totalNumberCompleted < BatchedCollector.START_BATCH_AFTER_COUNT) {
			// Flush because we aren't batching yet
			this.flush();
		} else if (this.batchSize >= this.maxBatchSize) {
			// Flush because the batch is full
			this.flush();
		} else if (!this.timeoutHandle) {
			// No timeout running, start a timeout to flush
			this.timeoutHandle = setTimeout(() => {
				this.flush();
			}, BatchedCollector.TIMEOUT);
		}
	}

	flush(): void {
		if (this.batchSize) {
			this.totalNumberCompleted += this.batchSize;
			this.cb(this.batch);
			this.batch = [];
			this.batchSize = 0;

			if (this.timeoutHandle) {
				clearTimeout(this.timeoutHandle);
				this.timeoutHandle = undefined;
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/electron-browser/searchService.ts]---
Location: vscode-main/src/vs/workbench/services/search/electron-browser/searchService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ISearchService } from '../common/search.js';
import { SearchService } from '../common/searchService.js';

registerSingleton(ISearchService, SearchService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/node/fileSearch.ts]---
Location: vscode-main/src/vs/workbench/services/search/node/fileSearch.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from '../../../../base/common/path.js';
import { Readable } from 'stream';
import { StringDecoder } from 'string_decoder';
import * as arrays from '../../../../base/common/arrays.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import * as glob from '../../../../base/common/glob.js';
import * as normalization from '../../../../base/common/normalization.js';
import { isEqualOrParent } from '../../../../base/common/extpath.js';
import * as platform from '../../../../base/common/platform.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import * as strings from '../../../../base/common/strings.js';
import * as types from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { Promises } from '../../../../base/node/pfs.js';
import { IFileQuery, IFolderQuery, IProgressMessage, ISearchEngineStats, IRawFileMatch, ISearchEngine, ISearchEngineSuccess, isFilePatternMatch, hasSiblingFn } from '../common/search.js';
import { spawnRipgrepCmd } from './ripgrepFileSearch.js';
import { prepareQuery } from '../../../../base/common/fuzzyScorer.js';

interface IDirectoryEntry extends IRawFileMatch {
	base: string;
	basename: string;
}

interface IDirectoryTree {
	rootEntries: IDirectoryEntry[];
	pathToEntries: { [relativePath: string]: IDirectoryEntry[] };
}

const killCmds = new Set<() => void>();
process.on('exit', () => {
	killCmds.forEach(cmd => cmd());
});

export class FileWalker {
	private config: IFileQuery;
	private filePattern: string;
	private normalizedFilePatternLowercase: string | null = null;
	private includePattern: glob.ParsedExpression | undefined;
	private maxResults: number | null;
	private exists: boolean;
	private maxFilesize: number | null = null;
	private isLimitHit: boolean;
	private resultCount: number;
	private isCanceled = false;
	private fileWalkSW: StopWatch | null = null;
	private directoriesWalked: number;
	private filesWalked: number;
	private errors: string[];
	private cmdSW: StopWatch | null = null;
	private cmdResultCount: number = 0;

	private folderExcludePatterns: Map<string, AbsoluteAndRelativeParsedExpression>;
	private globalExcludePattern: glob.ParsedExpression | undefined;

	private walkedPaths: { [path: string]: boolean };

	constructor(config: IFileQuery) {
		this.config = config;
		this.filePattern = config.filePattern || '';
		this.includePattern = config.includePattern && glob.parse(config.includePattern);
		this.maxResults = config.maxResults || null;
		this.exists = !!config.exists;
		this.walkedPaths = Object.create(null);
		this.resultCount = 0;
		this.isLimitHit = false;
		this.directoriesWalked = 0;
		this.filesWalked = 0;
		this.errors = [];

		if (this.filePattern) {
			this.normalizedFilePatternLowercase = config.shouldGlobMatchFilePattern ? null : prepareQuery(this.filePattern).normalizedLowercase;
		}

		this.globalExcludePattern = config.excludePattern && glob.parse(config.excludePattern);
		this.folderExcludePatterns = new Map<string, AbsoluteAndRelativeParsedExpression>();

		config.folderQueries.forEach(folderQuery => {
			const folderExcludeExpression: glob.IExpression = {}; // todo: consider exclude baseURI

			folderQuery.excludePattern?.forEach(excludePattern => {
				Object.assign(folderExcludeExpression, excludePattern.pattern || {}, this.config.excludePattern || {});
			});

			if (!folderQuery.excludePattern?.length) {
				Object.assign(folderExcludeExpression, this.config.excludePattern || {});
			}

			// Add excludes for other root folders
			const fqPath = folderQuery.folder.fsPath;
			config.folderQueries
				.map(rootFolderQuery => rootFolderQuery.folder.fsPath)
				.filter(rootFolder => rootFolder !== fqPath)
				.forEach(otherRootFolder => {
					// Exclude nested root folders
					if (isEqualOrParent(otherRootFolder, fqPath)) {
						folderExcludeExpression[path.relative(fqPath, otherRootFolder)] = true;
					}
				});

			this.folderExcludePatterns.set(fqPath, new AbsoluteAndRelativeParsedExpression(folderExcludeExpression, fqPath));
		});
	}

	cancel(): void {
		this.isCanceled = true;
		killCmds.forEach(cmd => cmd());
	}

	walk(folderQueries: IFolderQuery[], extraFiles: URI[], numThreads: number | undefined, onResult: (result: IRawFileMatch) => void, onMessage: (message: IProgressMessage) => void, done: (error: Error | null, isLimitHit: boolean) => void): void {
		this.fileWalkSW = StopWatch.create(false);

		// Support that the file pattern is a full path to a file that exists
		if (this.isCanceled) {
			return done(null, this.isLimitHit);
		}

		// For each extra file
		extraFiles.forEach(extraFilePath => {
			const basename = path.basename(extraFilePath.fsPath);
			if (this.globalExcludePattern && this.globalExcludePattern(extraFilePath.fsPath, basename)) {
				return; // excluded
			}

			// File: Check for match on file pattern and include pattern
			this.matchFile(onResult, { relativePath: extraFilePath.fsPath /* no workspace relative path */, searchPath: undefined });
		});

		this.cmdSW = StopWatch.create(false);

		// For each root folder
		this.parallel<IFolderQuery, void>(folderQueries, (folderQuery: IFolderQuery, rootFolderDone: (err: Error | null, result: void) => void) => {
			this.call(this.cmdTraversal, this, folderQuery, numThreads, onResult, onMessage, (err?: Error) => {
				if (err) {
					const errorMessage = toErrorMessage(err);
					console.error(errorMessage);
					this.errors.push(errorMessage);
					rootFolderDone(err, undefined);
				} else {
					rootFolderDone(null, undefined);
				}
			});
		}, (errors, _result) => {
			this.fileWalkSW!.stop();
			const err = errors ? arrays.coalesce(errors)[0] : null;
			done(err, this.isLimitHit);
		});
	}

	private parallel<T, E>(list: T[], fn: (item: T, callback: (err: Error | null, result: E | null) => void) => void, callback: (err: Array<Error | null> | null, result: E[]) => void): void {
		const results = new Array(list.length);
		const errors = new Array<Error | null>(list.length);
		let didErrorOccur = false;
		let doneCount = 0;

		if (list.length === 0) {
			return callback(null, []);
		}

		list.forEach((item, index) => {
			fn(item, (error, result) => {
				if (error) {
					didErrorOccur = true;
					results[index] = null;
					errors[index] = error;
				} else {
					results[index] = result;
					errors[index] = null;
				}

				if (++doneCount === list.length) {
					return callback(didErrorOccur ? errors : null, results);
				}
			});
		});
	}

	private call<F extends Function>(fun: F, that: any, ...args: any[]): void {
		try {
			fun.apply(that, args);
		} catch (e) {
			args[args.length - 1](e);
		}
	}

	private cmdTraversal(folderQuery: IFolderQuery, numThreads: number | undefined, onResult: (result: IRawFileMatch) => void, onMessage: (message: IProgressMessage) => void, cb: (err?: Error) => void): void {
		const rootFolder = folderQuery.folder.fsPath;
		const isMac = platform.isMacintosh;

		const killCmd = () => cmd && cmd.kill();
		killCmds.add(killCmd);

		let done = (err?: Error) => {
			killCmds.delete(killCmd);
			done = () => { };
			cb(err);
		};
		let leftover = '';
		const tree = this.initDirectoryTree();

		const ripgrep = spawnRipgrepCmd(this.config, folderQuery, this.config.includePattern, this.folderExcludePatterns.get(folderQuery.folder.fsPath)!.expression, numThreads);
		const cmd = ripgrep.cmd;
		const noSiblingsClauses = !Object.keys(ripgrep.siblingClauses).length;

		const escapedArgs = ripgrep.rgArgs.args
			.map(arg => arg.match(/^-/) ? arg : `'${arg}'`)
			.join(' ');

		let rgCmd = `${ripgrep.rgDiskPath} ${escapedArgs}\n - cwd: ${ripgrep.cwd}`;
		if (ripgrep.rgArgs.siblingClauses) {
			rgCmd += `\n - Sibling clauses: ${JSON.stringify(ripgrep.rgArgs.siblingClauses)}`;
		}
		onMessage({ message: rgCmd });

		this.cmdResultCount = 0;
		this.collectStdout(cmd, 'utf8', onMessage, (err: Error | null, stdout?: string, last?: boolean) => {
			if (err) {
				done(err);
				return;
			}
			if (this.isLimitHit) {
				done();
				return;
			}

			// Mac: uses NFD unicode form on disk, but we want NFC
			const normalized = leftover + (isMac ? normalization.normalizeNFC(stdout || '') : stdout);
			const relativeFiles = normalized.split('\n');

			if (last) {
				const n = relativeFiles.length;
				relativeFiles[n - 1] = relativeFiles[n - 1].trim();
				if (!relativeFiles[n - 1]) {
					relativeFiles.pop();
				}
			} else {
				leftover = relativeFiles.pop() || '';
			}

			if (relativeFiles.length && relativeFiles[0].indexOf('\n') !== -1) {
				done(new Error('Splitting up files failed'));
				return;
			}

			this.cmdResultCount += relativeFiles.length;

			if (noSiblingsClauses) {
				for (const relativePath of relativeFiles) {
					this.matchFile(onResult, { base: rootFolder, relativePath, searchPath: this.getSearchPath(folderQuery, relativePath) });
					if (this.isLimitHit) {
						killCmd();
						break;
					}
				}
				if (last || this.isLimitHit) {
					done();
				}

				return;
			}

			// TODO: Optimize siblings clauses with ripgrep here.
			this.addDirectoryEntries(folderQuery, tree, rootFolder, relativeFiles, onResult);

			if (last) {
				this.matchDirectoryTree(tree, rootFolder, onResult);
				done();
			}
		});
	}

	/**
	 * Public for testing.
	 */
	spawnFindCmd(folderQuery: IFolderQuery) {
		const excludePattern = this.folderExcludePatterns.get(folderQuery.folder.fsPath)!;
		const basenames = excludePattern.getBasenameTerms();
		const pathTerms = excludePattern.getPathTerms();
		const args = ['-L', '.'];
		if (basenames.length || pathTerms.length) {
			args.push('-not', '(', '(');
			for (const basename of basenames) {
				args.push('-name', basename);
				args.push('-o');
			}
			for (const path of pathTerms) {
				args.push('-path', path);
				args.push('-o');
			}
			args.pop();
			args.push(')', '-prune', ')');
		}
		args.push('-type', 'f');
		return childProcess.spawn('find', args, { cwd: folderQuery.folder.fsPath });
	}

	/**
	 * Public for testing.
	 */
	readStdout(cmd: childProcess.ChildProcess, encoding: BufferEncoding, cb: (err: Error | null, stdout?: string) => void): void {
		let all = '';
		this.collectStdout(cmd, encoding, () => { }, (err: Error | null, stdout?: string, last?: boolean) => {
			if (err) {
				cb(err);
				return;
			}

			all += stdout;
			if (last) {
				cb(null, all);
			}
		});
	}

	private collectStdout(cmd: childProcess.ChildProcess, encoding: BufferEncoding, onMessage: (message: IProgressMessage) => void, cb: (err: Error | null, stdout?: string, last?: boolean) => void): void {
		let onData = (err: Error | null, stdout?: string, last?: boolean) => {
			if (err || last) {
				onData = () => { };

				this.cmdSW?.stop();
			}
			cb(err, stdout, last);
		};

		let gotData = false;
		if (cmd.stdout) {
			// Should be non-null, but #38195
			this.forwardData(cmd.stdout, encoding, onData);
			cmd.stdout.once('data', () => gotData = true);
		} else {
			onMessage({ message: 'stdout is null' });
		}

		let stderr: Buffer[];
		if (cmd.stderr) {
			// Should be non-null, but #38195
			stderr = this.collectData(cmd.stderr);
		} else {
			onMessage({ message: 'stderr is null' });
		}

		cmd.on('error', (err: Error) => {
			onData(err);
		});

		cmd.on('close', (code: number) => {
			// ripgrep returns code=1 when no results are found
			let stderrText: string;
			if (!gotData && (stderrText = this.decodeData(stderr, encoding)) && rgErrorMsgForDisplay(stderrText)) {
				onData(new Error(`command failed with error code ${code}: ${this.decodeData(stderr, encoding)}`));
			} else {
				if (this.exists && code === 0) {
					this.isLimitHit = true;
				}
				onData(null, '', true);
			}
		});
	}

	private forwardData(stream: Readable, encoding: BufferEncoding, cb: (err: Error | null, stdout?: string) => void): StringDecoder {
		const decoder = new StringDecoder(encoding);
		stream.on('data', (data: Buffer) => {
			cb(null, decoder.write(data));
		});
		return decoder;
	}

	private collectData(stream: Readable): Buffer[] {
		const buffers: Buffer[] = [];
		stream.on('data', (data: Buffer) => {
			buffers.push(data);
		});
		return buffers;
	}

	private decodeData(buffers: Buffer[], encoding: BufferEncoding): string {
		const decoder = new StringDecoder(encoding);
		return buffers.map(buffer => decoder.write(buffer)).join('');
	}

	private initDirectoryTree(): IDirectoryTree {
		const tree: IDirectoryTree = {
			rootEntries: [],
			pathToEntries: Object.create(null)
		};
		tree.pathToEntries['.'] = tree.rootEntries;
		return tree;
	}

	private addDirectoryEntries(folderQuery: IFolderQuery, { pathToEntries }: IDirectoryTree, base: string, relativeFiles: string[], onResult: (result: IRawFileMatch) => void) {
		// Support relative paths to files from a root resource (ignores excludes)
		if (relativeFiles.indexOf(this.filePattern) !== -1) {
			this.matchFile(onResult, {
				base,
				relativePath: this.filePattern,
				searchPath: this.getSearchPath(folderQuery, this.filePattern)
			});
		}

		const add = (relativePath: string) => {
			const basename = path.basename(relativePath);
			const dirname = path.dirname(relativePath);
			let entries = pathToEntries[dirname];
			if (!entries) {
				entries = pathToEntries[dirname] = [];
				add(dirname);
			}
			entries.push({
				base,
				relativePath,
				basename,
				searchPath: this.getSearchPath(folderQuery, relativePath),
			});
		};
		relativeFiles.forEach(add);
	}

	private matchDirectoryTree({ rootEntries, pathToEntries }: IDirectoryTree, rootFolder: string, onResult: (result: IRawFileMatch) => void) {
		const self = this;
		const excludePattern = this.folderExcludePatterns.get(rootFolder)!;
		const filePattern = this.filePattern;
		function matchDirectory(entries: IDirectoryEntry[]) {
			self.directoriesWalked++;
			const hasSibling = hasSiblingFn(() => entries.map(entry => entry.basename));
			for (let i = 0, n = entries.length; i < n; i++) {
				const entry = entries[i];
				const { relativePath, basename } = entry;

				// Check exclude pattern
				// If the user searches for the exact file name, we adjust the glob matching
				// to ignore filtering by siblings because the user seems to know what they
				// are searching for and we want to include the result in that case anyway
				if (excludePattern.test(relativePath, basename, filePattern !== basename ? hasSibling : undefined)) {
					continue;
				}

				const sub = pathToEntries[relativePath];
				if (sub) {
					matchDirectory(sub);
				} else {
					self.filesWalked++;
					if (relativePath === filePattern) {
						continue; // ignore file if its path matches with the file pattern because that is already matched above
					}

					self.matchFile(onResult, entry);
				}

				if (self.isLimitHit) {
					break;
				}
			}
		}
		matchDirectory(rootEntries);
	}

	getStats(): ISearchEngineStats {
		return {
			cmdTime: this.cmdSW!.elapsed(),
			fileWalkTime: this.fileWalkSW!.elapsed(),
			directoriesWalked: this.directoriesWalked,
			filesWalked: this.filesWalked,
			cmdResultCount: this.cmdResultCount
		};
	}

	private doWalk(folderQuery: IFolderQuery, relativeParentPath: string, files: string[], onResult: (result: IRawFileMatch) => void, done: (error?: Error) => void): void {
		const rootFolder = folderQuery.folder;

		// Execute tasks on each file in parallel to optimize throughput
		const hasSibling = hasSiblingFn(() => files);
		this.parallel(files, (file: string, clb: (error: Error | null, _?: any) => void): void => {

			// Check canceled
			if (this.isCanceled || this.isLimitHit) {
				return clb(null);
			}

			// Check exclude pattern
			// If the user searches for the exact file name, we adjust the glob matching
			// to ignore filtering by siblings because the user seems to know what they
			// are searching for and we want to include the result in that case anyway
			const currentRelativePath = relativeParentPath ? [relativeParentPath, file].join(path.sep) : file;
			if (this.folderExcludePatterns.get(folderQuery.folder.fsPath)!.test(currentRelativePath, file, this.config.filePattern !== file ? hasSibling : undefined)) {
				return clb(null);
			}

			// Use lstat to detect links
			const currentAbsolutePath = [rootFolder.fsPath, currentRelativePath].join(path.sep);
			fs.lstat(currentAbsolutePath, (error, lstat) => {
				if (error || this.isCanceled || this.isLimitHit) {
					return clb(null);
				}

				// If the path is a link, we must instead use fs.stat() to find out if the
				// link is a directory or not because lstat will always return the stat of
				// the link which is always a file.
				this.statLinkIfNeeded(currentAbsolutePath, lstat, (error, stat) => {
					if (error || this.isCanceled || this.isLimitHit) {
						return clb(null);
					}

					// Directory: Follow directories
					if (stat.isDirectory()) {
						this.directoriesWalked++;

						// to really prevent loops with links we need to resolve the real path of them
						return this.realPathIfNeeded(currentAbsolutePath, lstat, (error, realpath) => {
							if (error || this.isCanceled || this.isLimitHit) {
								return clb(null);
							}

							realpath = realpath || '';
							if (this.walkedPaths[realpath]) {
								return clb(null); // escape when there are cycles (can happen with symlinks)
							}

							this.walkedPaths[realpath] = true; // remember as walked

							// Continue walking
							return Promises.readdir(currentAbsolutePath).then(children => {
								if (this.isCanceled || this.isLimitHit) {
									return clb(null);
								}

								this.doWalk(folderQuery, currentRelativePath, children, onResult, err => clb(err || null));
							}, error => {
								clb(null);
							});
						});
					}

					// File: Check for match on file pattern and include pattern
					else {
						this.filesWalked++;
						if (currentRelativePath === this.filePattern) {
							return clb(null, undefined); // ignore file if its path matches with the file pattern because checkFilePatternRelativeMatch() takes care of those
						}

						if (this.maxFilesize && types.isNumber(stat.size) && stat.size > this.maxFilesize) {
							return clb(null, undefined); // ignore file if max file size is hit
						}

						this.matchFile(onResult, {
							base: rootFolder.fsPath,
							relativePath: currentRelativePath,
							searchPath: this.getSearchPath(folderQuery, currentRelativePath),
						});
					}

					// Unwind
					return clb(null, undefined);
				});
			});
		}, (error: Array<Error | null> | null): void => {
			const filteredErrors = error ? arrays.coalesce(error) : error; // find any error by removing null values first
			return done(filteredErrors && filteredErrors.length > 0 ? filteredErrors[0] : undefined);
		});
	}

	private matchFile(onResult: (result: IRawFileMatch) => void, candidate: IRawFileMatch): void {
		if (this.isFileMatch(candidate) && (!this.includePattern || this.includePattern(candidate.relativePath, path.basename(candidate.relativePath)))) {
			this.resultCount++;

			if (this.exists || (this.maxResults && this.resultCount > this.maxResults)) {
				this.isLimitHit = true;
			}

			if (!this.isLimitHit) {
				onResult(candidate);
			}
		}
	}

	private isFileMatch(candidate: IRawFileMatch): boolean {
		// Check for search pattern
		if (this.filePattern) {
			if (this.filePattern === '*') {
				return true; // support the all-matching wildcard
			}

			if (this.normalizedFilePatternLowercase) {
				return isFilePatternMatch(candidate, this.normalizedFilePatternLowercase);
			} else if (this.filePattern) {
				return isFilePatternMatch(candidate, this.filePattern, false);
			}
		}

		// No patterns means we match all
		return true;
	}

	private statLinkIfNeeded(path: string, lstat: fs.Stats, clb: (error: Error | null, stat: fs.Stats) => void): void {
		if (lstat.isSymbolicLink()) {
			return fs.stat(path, clb); // stat the target the link points to
		}

		return clb(null, lstat); // not a link, so the stat is already ok for us
	}

	private realPathIfNeeded(path: string, lstat: fs.Stats, clb: (error: Error | null, realpath?: string) => void): void {
		if (lstat.isSymbolicLink()) {
			return fs.realpath(path, (error, realpath) => {
				if (error) {
					return clb(error);
				}

				return clb(null, realpath);
			});
		}

		return clb(null, path);
	}

	/**
	 * If we're searching for files in multiple workspace folders, then better prepend the
	 * name of the workspace folder to the path of the file. This way we'll be able to
	 * better filter files that are all on the top of a workspace folder and have all the
	 * same name. A typical example are `package.json` or `README.md` files.
	 */
	private getSearchPath(folderQuery: IFolderQuery, relativePath: string): string {
		if (folderQuery.folderName) {
			return path.join(folderQuery.folderName, relativePath);
		}
		return relativePath;
	}
}

export class Engine implements ISearchEngine<IRawFileMatch> {
	private folderQueries: IFolderQuery[];
	private extraFiles: URI[];
	private walker: FileWalker;
	private numThreads?: number;

	constructor(config: IFileQuery, numThreads?: number) {
		this.folderQueries = config.folderQueries;
		this.extraFiles = config.extraFileResources || [];
		this.numThreads = numThreads;

		this.walker = new FileWalker(config);
	}

	search(onResult: (result: IRawFileMatch) => void, onProgress: (progress: IProgressMessage) => void, done: (error: Error | null, complete: ISearchEngineSuccess) => void): void {
		this.walker.walk(this.folderQueries, this.extraFiles, this.numThreads, onResult, onProgress, (err: Error | null, isLimitHit: boolean) => {
			done(err, {
				limitHit: isLimitHit,
				stats: this.walker.getStats(),
				messages: [],
			});
		});
	}

	cancel(): void {
		this.walker.cancel();
	}
}

/**
 * This class exists to provide one interface on top of two ParsedExpressions, one for absolute expressions and one for relative expressions.
 * The absolute and relative expressions don't "have" to be kept separate, but this keeps us from having to path.join every single
 * file searched, it's only used for a text search with a searchPath
 */
class AbsoluteAndRelativeParsedExpression {
	private absoluteParsedExpr: glob.ParsedExpression | undefined;
	private relativeParsedExpr: glob.ParsedExpression | undefined;

	constructor(public expression: glob.IExpression, private root: string) {
		this.init(expression);
	}

	/**
	 * Split the IExpression into its absolute and relative components, and glob.parse them separately.
	 */
	private init(expr: glob.IExpression): void {
		let absoluteGlobExpr: glob.IExpression | undefined;
		let relativeGlobExpr: glob.IExpression | undefined;
		Object.keys(expr)
			.filter(key => expr[key])
			.forEach(key => {
				if (path.isAbsolute(key)) {
					absoluteGlobExpr = absoluteGlobExpr || glob.getEmptyExpression();
					absoluteGlobExpr[key] = expr[key];
				} else {
					relativeGlobExpr = relativeGlobExpr || glob.getEmptyExpression();
					relativeGlobExpr[key] = expr[key];
				}
			});

		this.absoluteParsedExpr = absoluteGlobExpr && glob.parse(absoluteGlobExpr, { trimForExclusions: true });
		this.relativeParsedExpr = relativeGlobExpr && glob.parse(relativeGlobExpr, { trimForExclusions: true });
	}

	test(_path: string, basename?: string, hasSibling?: (name: string) => boolean | Promise<boolean>): string | Promise<string | null> | undefined | null {
		return (this.relativeParsedExpr && this.relativeParsedExpr(_path, basename, hasSibling)) ||
			(this.absoluteParsedExpr && this.absoluteParsedExpr(path.join(this.root, _path), basename, hasSibling));
	}

	getBasenameTerms(): string[] {
		const basenameTerms: string[] = [];
		if (this.absoluteParsedExpr) {
			basenameTerms.push(...glob.getBasenameTerms(this.absoluteParsedExpr));
		}

		if (this.relativeParsedExpr) {
			basenameTerms.push(...glob.getBasenameTerms(this.relativeParsedExpr));
		}

		return basenameTerms;
	}

	getPathTerms(): string[] {
		const pathTerms: string[] = [];
		if (this.absoluteParsedExpr) {
			pathTerms.push(...glob.getPathTerms(this.absoluteParsedExpr));
		}

		if (this.relativeParsedExpr) {
			pathTerms.push(...glob.getPathTerms(this.relativeParsedExpr));
		}

		return pathTerms;
	}
}

function rgErrorMsgForDisplay(msg: string): string | undefined {
	const lines = msg.trim().split('\n');
	const firstLine = lines[0].trim();

	if (firstLine.startsWith('Error parsing regex')) {
		return firstLine;
	}

	if (firstLine.startsWith('regex parse error')) {
		return strings.uppercaseFirstLetter(lines[lines.length - 1].trim());
	}

	if (firstLine.startsWith('error parsing glob') ||
		firstLine.startsWith('unsupported encoding')) {
		// Uppercase first letter
		return firstLine.charAt(0).toUpperCase() + firstLine.substr(1);
	}

	if (firstLine === `Literal '\\n' not allowed.`) {
		// I won't localize this because none of the Ripgrep error messages are localized
		return `Literal '\\n' currently not supported`;
	}

	if (firstLine.startsWith('Literal ')) {
		// Other unsupported chars
		return firstLine;
	}

	return undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/node/rawSearchService.ts]---
Location: vscode-main/src/vs/workbench/services/search/node/rawSearchService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as arrays from '../../../../base/common/arrays.js';
import { CancelablePromise, createCancelablePromise } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { canceled } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { compareItemsByFuzzyScore, FuzzyScorerCache, IItemAccessor, prepareQuery } from '../../../../base/common/fuzzyScorer.js';
import { revive } from '../../../../base/common/marshalling.js';
import { basename, dirname, join, sep } from '../../../../base/common/path.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { ByteSize } from '../../../../platform/files/common/files.js';
import { DEFAULT_MAX_SEARCH_RESULTS, ICachedSearchStats, IFileQuery, IFileSearchProgressItem, IFileSearchStats, IFolderQuery, IProgressMessage, IRawFileMatch, IRawFileQuery, IRawQuery, IRawSearchService, IRawTextQuery, ISearchEngine, ISearchEngineSuccess, ISerializedFileMatch, ISerializedSearchComplete, ISerializedSearchProgressItem, ISerializedSearchSuccess, isFilePatternMatch, ITextQuery } from '../common/search.js';
import { Engine as FileSearchEngine } from './fileSearch.js';
import { TextSearchEngineAdapter } from './textSearchAdapter.js';

export type IProgressCallback = (p: ISerializedSearchProgressItem) => void;
type IFileProgressCallback = (p: IFileSearchProgressItem) => void;

export class SearchService implements IRawSearchService {

	private static readonly BATCH_SIZE = 512;

	private caches: { [cacheKey: string]: Cache } = Object.create(null);

	constructor(private readonly processType: IFileSearchStats['type'] = 'searchProcess', private readonly getNumThreads?: () => Promise<number | undefined>) { }

	fileSearch(config: IRawFileQuery): Event<ISerializedSearchProgressItem | ISerializedSearchComplete> {
		let promise: CancelablePromise<ISerializedSearchSuccess>;

		const query = reviveQuery(config);
		const emitter = new Emitter<ISerializedSearchProgressItem | ISerializedSearchComplete>({
			onDidAddFirstListener: () => {
				promise = createCancelablePromise(async token => {
					const numThreads = await this.getNumThreads?.();
					return this.doFileSearchWithEngine(FileSearchEngine, query, p => emitter.fire(p), token, SearchService.BATCH_SIZE, numThreads);
				});

				promise.then(
					c => emitter.fire(c),
					err => emitter.fire({ type: 'error', error: { message: err.message, stack: err.stack } }));
			},
			onDidRemoveLastListener: () => {
				promise.cancel();
			}
		});

		return emitter.event;
	}

	textSearch(rawQuery: IRawTextQuery): Event<ISerializedSearchProgressItem | ISerializedSearchComplete> {
		let promise: CancelablePromise<ISerializedSearchComplete>;

		const query = reviveQuery(rawQuery);
		const emitter = new Emitter<ISerializedSearchProgressItem | ISerializedSearchComplete>({
			onDidAddFirstListener: () => {
				promise = createCancelablePromise(token => {
					return this.ripgrepTextSearch(query, p => emitter.fire(p), token);
				});

				promise.then(
					c => emitter.fire(c),
					err => emitter.fire({ type: 'error', error: { message: err.message, stack: err.stack } }));
			},
			onDidRemoveLastListener: () => {
				promise.cancel();
			}
		});

		return emitter.event;
	}

	private async ripgrepTextSearch(config: ITextQuery, progressCallback: IProgressCallback, token: CancellationToken): Promise<ISerializedSearchSuccess> {
		config.maxFileSize = this.getPlatformFileLimits().maxFileSize;
		const numThreads = await this.getNumThreads?.();
		const engine = new TextSearchEngineAdapter(config, numThreads);

		return engine.search(token, progressCallback, progressCallback);
	}

	private getPlatformFileLimits(): { readonly maxFileSize: number } {
		return {
			maxFileSize: 16 * ByteSize.GB
		};
	}

	doFileSearch(config: IFileQuery, numThreads: number | undefined, progressCallback: IProgressCallback, token?: CancellationToken): Promise<ISerializedSearchSuccess> {
		return this.doFileSearchWithEngine(FileSearchEngine, config, progressCallback, token, SearchService.BATCH_SIZE, numThreads);
	}

	doFileSearchWithEngine(EngineClass: { new(config: IFileQuery, numThreads?: number | undefined): ISearchEngine<IRawFileMatch> }, config: IFileQuery, progressCallback: IProgressCallback, token?: CancellationToken, batchSize = SearchService.BATCH_SIZE, threads?: number): Promise<ISerializedSearchSuccess> {
		let resultCount = 0;
		const fileProgressCallback: IFileProgressCallback = progress => {
			if (Array.isArray(progress)) {
				resultCount += progress.length;
				progressCallback(progress.map(m => this.rawMatchToSearchItem(m)));
			} else if ((<IRawFileMatch>progress).relativePath) {
				resultCount++;
				progressCallback(this.rawMatchToSearchItem(<IRawFileMatch>progress));
			} else {
				progressCallback(<IProgressMessage>progress);
			}
		};

		if (config.sortByScore) {
			let sortedSearch = this.trySortedSearchFromCache(config, fileProgressCallback, token);
			if (!sortedSearch) {
				const walkerConfig = config.maxResults ? Object.assign({}, config, { maxResults: null }) : config;
				const engine = new EngineClass(walkerConfig, threads);
				sortedSearch = this.doSortedSearch(engine, config, progressCallback, fileProgressCallback, token);
			}

			return new Promise<ISerializedSearchSuccess>((c, e) => {
				sortedSearch.then(([result, rawMatches]) => {
					const serializedMatches = rawMatches.map(rawMatch => this.rawMatchToSearchItem(rawMatch));
					this.sendProgress(serializedMatches, progressCallback, batchSize);
					c(result);
				}, e);
			});
		}

		const engine = new EngineClass(config, threads);

		return this.doSearch(engine, fileProgressCallback, batchSize, token).then(complete => {
			return {
				limitHit: complete.limitHit,
				type: 'success',
				stats: {
					detailStats: complete.stats,
					type: this.processType,
					fromCache: false,
					resultCount,
					sortingTime: undefined
				},
				messages: []
			};
		});
	}

	private rawMatchToSearchItem(match: IRawFileMatch): ISerializedFileMatch {
		return { path: match.base ? join(match.base, match.relativePath) : match.relativePath };
	}

	private doSortedSearch(engine: ISearchEngine<IRawFileMatch>, config: IFileQuery, progressCallback: IProgressCallback, fileProgressCallback: IFileProgressCallback, token?: CancellationToken): Promise<[ISerializedSearchSuccess, IRawFileMatch[]]> {
		const emitter = new Emitter<IFileSearchProgressItem>();

		let allResultsPromise = createCancelablePromise(token => {
			let results: IRawFileMatch[] = [];

			const innerProgressCallback: IFileProgressCallback = progress => {
				if (Array.isArray(progress)) {
					results = progress;
				} else {
					fileProgressCallback(progress);
					emitter.fire(progress);
				}
			};

			return this.doSearch(engine, innerProgressCallback, -1, token)
				.then<[ISearchEngineSuccess, IRawFileMatch[]]>(result => {
					return [result, results];
				});
		});

		let cache: Cache;
		if (config.cacheKey) {
			cache = this.getOrCreateCache(config.cacheKey);
			const cacheRow: ICacheRow = {
				promise: allResultsPromise,
				event: emitter.event,
				resolved: false
			};
			cache.resultsToSearchCache[config.filePattern || ''] = cacheRow;
			allResultsPromise.then(() => {
				cacheRow.resolved = true;
			}, err => {
				delete cache.resultsToSearchCache[config.filePattern || ''];
			});

			allResultsPromise = this.preventCancellation(allResultsPromise);
		}

		return allResultsPromise.then(([result, results]) => {
			const scorerCache: FuzzyScorerCache = cache ? cache.scorerCache : Object.create(null);
			const sortSW = (typeof config.maxResults !== 'number' || config.maxResults > 0) && StopWatch.create(false);
			return this.sortResults(config, results, scorerCache, token)
				.then<[ISerializedSearchSuccess, IRawFileMatch[]]>(sortedResults => {
					// sortingTime: -1 indicates a "sorted" search that was not sorted, i.e. populating the cache when quickaccess is opened.
					// Contrasting with findFiles which is not sorted and will have sortingTime: undefined
					const sortingTime = sortSW ? sortSW.elapsed() : -1;

					return [{
						type: 'success',
						stats: {
							detailStats: result.stats,
							sortingTime,
							fromCache: false,
							type: this.processType,
							resultCount: sortedResults.length
						},
						messages: result.messages,
						limitHit: result.limitHit || typeof config.maxResults === 'number' && results.length > config.maxResults
					}, sortedResults];
				});
		});
	}

	private getOrCreateCache(cacheKey: string): Cache {
		const existing = this.caches[cacheKey];
		if (existing) {
			return existing;
		}
		return this.caches[cacheKey] = new Cache();
	}

	private trySortedSearchFromCache(config: IFileQuery, progressCallback: IFileProgressCallback, token?: CancellationToken): Promise<[ISerializedSearchSuccess, IRawFileMatch[]]> | undefined {
		const cache = config.cacheKey && this.caches[config.cacheKey];
		if (!cache) {
			return undefined;
		}

		const cached = this.getResultsFromCache(cache, config.filePattern || '', progressCallback, token);
		if (cached) {
			return cached.then(([result, results, cacheStats]) => {
				const sortSW = StopWatch.create(false);
				return this.sortResults(config, results, cache.scorerCache, token)
					.then<[ISerializedSearchSuccess, IRawFileMatch[]]>(sortedResults => {
						const sortingTime = sortSW.elapsed();
						const stats: IFileSearchStats = {
							fromCache: true,
							detailStats: cacheStats,
							type: this.processType,
							resultCount: results.length,
							sortingTime
						};

						return [
							{
								type: 'success',
								limitHit: result.limitHit || typeof config.maxResults === 'number' && results.length > config.maxResults,
								stats,
								messages: [],
							} satisfies ISerializedSearchSuccess,
							sortedResults
						];
					});
			});
		}
		return undefined;
	}

	private sortResults(config: IFileQuery, results: IRawFileMatch[], scorerCache: FuzzyScorerCache, token?: CancellationToken): Promise<IRawFileMatch[]> {
		// we use the same compare function that is used later when showing the results using fuzzy scoring
		// this is very important because we are also limiting the number of results by config.maxResults
		// and as such we want the top items to be included in this result set if the number of items
		// exceeds config.maxResults.
		const query = prepareQuery(config.filePattern || '');
		const compare = (matchA: IRawFileMatch, matchB: IRawFileMatch) => compareItemsByFuzzyScore(matchA, matchB, query, true, FileMatchItemAccessor, scorerCache);

		const maxResults = typeof config.maxResults === 'number' ? config.maxResults : DEFAULT_MAX_SEARCH_RESULTS;
		return arrays.topAsync(results, compare, maxResults, 10000, token);
	}

	private sendProgress(results: ISerializedFileMatch[], progressCb: IProgressCallback, batchSize: number) {
		if (batchSize && batchSize > 0) {
			for (let i = 0; i < results.length; i += batchSize) {
				progressCb(results.slice(i, i + batchSize));
			}
		} else {
			progressCb(results);
		}
	}

	private getResultsFromCache(cache: Cache, searchValue: string, progressCallback: IFileProgressCallback, token?: CancellationToken): Promise<[ISearchEngineSuccess, IRawFileMatch[], ICachedSearchStats]> | null {
		const cacheLookupSW = StopWatch.create(false);

		// Find cache entries by prefix of search value
		const hasPathSep = searchValue.indexOf(sep) >= 0;
		let cachedRow: ICacheRow | undefined;
		for (const previousSearch in cache.resultsToSearchCache) {
			// If we narrow down, we might be able to reuse the cached results
			if (searchValue.startsWith(previousSearch)) {
				if (hasPathSep && previousSearch.indexOf(sep) < 0 && previousSearch !== '') {
					continue; // since a path character widens the search for potential more matches, require it in previous search too
				}

				const row = cache.resultsToSearchCache[previousSearch];
				cachedRow = {
					promise: this.preventCancellation(row.promise),
					event: row.event,
					resolved: row.resolved
				};
				break;
			}
		}

		if (!cachedRow) {
			return null;
		}

		const cacheLookupTime = cacheLookupSW.elapsed();
		const cacheFilterSW = StopWatch.create(false);

		const listener = cachedRow.event(progressCallback);
		if (token) {
			token.onCancellationRequested(() => {
				listener.dispose();
			});
		}

		return cachedRow.promise.then<[ISearchEngineSuccess, IRawFileMatch[], ICachedSearchStats]>(([complete, cachedEntries]) => {
			if (token && token.isCancellationRequested) {
				throw canceled();
			}

			// Pattern match on results
			const results: IRawFileMatch[] = [];
			const normalizedSearchValueLowercase = prepareQuery(searchValue).normalizedLowercase;
			for (const entry of cachedEntries) {

				// Check if this entry is a match for the search value
				if (!isFilePatternMatch(entry, normalizedSearchValueLowercase)) {
					continue;
				}

				results.push(entry);
			}

			return [complete, results, {
				cacheWasResolved: cachedRow.resolved,
				cacheLookupTime,
				cacheFilterTime: cacheFilterSW.elapsed(),
				cacheEntryCount: cachedEntries.length
			}];
		});
	}



	private doSearch(engine: ISearchEngine<IRawFileMatch>, progressCallback: IFileProgressCallback, batchSize: number, token?: CancellationToken): Promise<ISearchEngineSuccess> {
		return new Promise<ISearchEngineSuccess>((c, e) => {
			let batch: IRawFileMatch[] = [];
			token?.onCancellationRequested(() => engine.cancel());

			engine.search((match) => {
				if (match) {
					if (batchSize) {
						batch.push(match);
						if (batchSize > 0 && batch.length >= batchSize) {
							progressCallback(batch);
							batch = [];
						}
					} else {
						progressCallback(match);
					}
				}
			}, (progress) => {
				progressCallback(progress);
			}, (error, complete) => {
				if (batch.length) {
					progressCallback(batch);
				}

				if (error) {
					progressCallback({ message: 'Search finished. Error: ' + error.message });
					e(error);
				} else {
					progressCallback({ message: 'Search finished. Stats: ' + JSON.stringify(complete.stats) });
					c(complete);
				}
			});
		});
	}

	clearCache(cacheKey: string): Promise<void> {
		delete this.caches[cacheKey];
		return Promise.resolve(undefined);
	}

	/**
	 * Return a CancelablePromise which is not actually cancelable
	 * TODO@rob - Is this really needed?
	 */
	private preventCancellation<C>(promise: CancelablePromise<C>): CancelablePromise<C> {
		return new class implements CancelablePromise<C> {
			get [Symbol.toStringTag]() { return this.toString(); }
			cancel() {
				// Do nothing
			}
			then<TResult1 = C, TResult2 = never>(resolve?: ((value: C) => TResult1 | Promise<TResult1>) | undefined | null, reject?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2> {
				return promise.then(resolve, reject);
			}
			catch(reject?: any) {
				return this.then(undefined, reject);
			}
			finally(onFinally: any) {
				return promise.finally(onFinally);
			}
		};
	}
}

interface ICacheRow {
	// TODO@roblou - never actually canceled
	promise: CancelablePromise<[ISearchEngineSuccess, IRawFileMatch[]]>;
	resolved: boolean;
	readonly event: Event<IFileSearchProgressItem>;
}

class Cache {

	resultsToSearchCache: { [searchValue: string]: ICacheRow } = Object.create(null);

	scorerCache: FuzzyScorerCache = Object.create(null);
}

const FileMatchItemAccessor = new class implements IItemAccessor<IRawFileMatch> {

	getItemLabel(match: IRawFileMatch): string {
		return basename(match.relativePath); // e.g. myFile.txt
	}

	getItemDescription(match: IRawFileMatch): string {
		return dirname(match.relativePath); // e.g. some/path/to/file
	}

	getItemPath(match: IRawFileMatch): string {
		return match.relativePath; // e.g. some/path/to/file/myFile.txt
	}
};

function reviveQuery<U extends IRawQuery>(rawQuery: U): U extends IRawTextQuery ? ITextQuery : IFileQuery {
	return {
		// eslint-disable-next-line local/code-no-any-casts
		...<any>rawQuery, // TODO
		...{
			folderQueries: rawQuery.folderQueries && rawQuery.folderQueries.map(reviveFolderQuery),
			extraFileResources: rawQuery.extraFileResources && rawQuery.extraFileResources.map(components => URI.revive(components))
		}
	};
}

function reviveFolderQuery(rawFolderQuery: IFolderQuery<UriComponents>): IFolderQuery<URI> {
	return revive(rawFolderQuery);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/node/ripgrepFileSearch.ts]---
Location: vscode-main/src/vs/workbench/services/search/node/ripgrepFileSearch.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as cp from 'child_process';
import * as path from '../../../../base/common/path.js';
import * as glob from '../../../../base/common/glob.js';
import { normalizeNFD } from '../../../../base/common/normalization.js';
import * as extpath from '../../../../base/common/extpath.js';
import { isMacintosh as isMac } from '../../../../base/common/platform.js';
import * as strings from '../../../../base/common/strings.js';
import { IFileQuery, IFolderQuery } from '../common/search.js';
import { anchorGlob } from './ripgrepSearchUtils.js';
import { rgPath } from '@vscode/ripgrep';

// If @vscode/ripgrep is in an .asar file, then the binary is unpacked.
const rgDiskPath = rgPath.replace(/\bnode_modules\.asar\b/, 'node_modules.asar.unpacked');

export function spawnRipgrepCmd(config: IFileQuery, folderQuery: IFolderQuery, includePattern?: glob.IExpression, excludePattern?: glob.IExpression, numThreads?: number) {
	const rgArgs = getRgArgs(config, folderQuery, includePattern, excludePattern, numThreads);
	const cwd = folderQuery.folder.fsPath;
	return {
		cmd: cp.spawn(rgDiskPath, rgArgs.args, { cwd }),
		rgDiskPath,
		siblingClauses: rgArgs.siblingClauses,
		rgArgs,
		cwd
	};
}

function getRgArgs(config: IFileQuery, folderQuery: IFolderQuery, includePattern?: glob.IExpression, excludePattern?: glob.IExpression, numThreads?: number) {
	const args = ['--files', '--hidden', '--case-sensitive', '--no-require-git'];

	// includePattern can't have siblingClauses
	foldersToIncludeGlobs([folderQuery], includePattern, false).forEach(globArg => {
		const inclusion = anchorGlob(globArg);
		args.push('-g', inclusion);
		if (isMac) {
			const normalized = normalizeNFD(inclusion);
			if (normalized !== inclusion) {
				args.push('-g', normalized);
			}
		}
	});

	const rgGlobs = foldersToRgExcludeGlobs([folderQuery], excludePattern, undefined, false);
	rgGlobs.globArgs.forEach(globArg => {
		const exclusion = `!${anchorGlob(globArg)}`;
		args.push('-g', exclusion);
		if (isMac) {
			const normalized = normalizeNFD(exclusion);
			if (normalized !== exclusion) {
				args.push('-g', normalized);
			}
		}
	});
	if (folderQuery.disregardIgnoreFiles !== false) {
		// Don't use .gitignore or .ignore
		args.push('--no-ignore');
	} else if (folderQuery.disregardParentIgnoreFiles !== false) {
		args.push('--no-ignore-parent');
	}

	// Follow symlinks
	if (!folderQuery.ignoreSymlinks) {
		args.push('--follow');
	}

	if (config.exists) {
		args.push('--quiet');
	}

	if (numThreads) {
		args.push('--threads', `${numThreads}`);
	}

	args.push('--no-config');
	if (folderQuery.disregardGlobalIgnoreFiles) {
		args.push('--no-ignore-global');
	}

	return {
		args,
		siblingClauses: rgGlobs.siblingClauses
	};
}

interface IRgGlobResult {
	globArgs: string[];
	siblingClauses: glob.IExpression;
}

function foldersToRgExcludeGlobs(folderQueries: IFolderQuery[], globalExclude?: glob.IExpression, excludesToSkip?: Set<string>, absoluteGlobs = true): IRgGlobResult {
	const globArgs: string[] = [];
	let siblingClauses: glob.IExpression = {};
	folderQueries.forEach(folderQuery => {
		const totalExcludePattern = Object.assign({}, folderQuery.excludePattern || {}, globalExclude || {});
		const result = globExprsToRgGlobs(totalExcludePattern, absoluteGlobs ? folderQuery.folder.fsPath : undefined, excludesToSkip);
		globArgs.push(...result.globArgs);
		if (result.siblingClauses) {
			siblingClauses = Object.assign(siblingClauses, result.siblingClauses);
		}
	});

	return { globArgs, siblingClauses };
}

function foldersToIncludeGlobs(folderQueries: IFolderQuery[], globalInclude?: glob.IExpression, absoluteGlobs = true): string[] {
	const globArgs: string[] = [];
	folderQueries.forEach(folderQuery => {
		const totalIncludePattern = Object.assign({}, globalInclude || {}, folderQuery.includePattern || {});
		const result = globExprsToRgGlobs(totalIncludePattern, absoluteGlobs ? folderQuery.folder.fsPath : undefined);
		globArgs.push(...result.globArgs);
	});

	return globArgs;
}

function globExprsToRgGlobs(patterns: glob.IExpression, folder?: string, excludesToSkip?: Set<string>): IRgGlobResult {
	const globArgs: string[] = [];
	const siblingClauses: glob.IExpression = {};
	Object.keys(patterns)
		.forEach(key => {
			if (excludesToSkip && excludesToSkip.has(key)) {
				return;
			}

			if (!key) {
				return;
			}

			const value = patterns[key];
			key = trimTrailingSlash(folder ? getAbsoluteGlob(folder, key) : key);

			// glob.ts requires forward slashes, but a UNC path still must start with \\
			// #38165 and #38151
			if (key.startsWith('\\\\')) {
				key = '\\\\' + key.substr(2).replace(/\\/g, '/');
			} else {
				key = key.replace(/\\/g, '/');
			}

			if (typeof value === 'boolean' && value) {
				if (key.startsWith('\\\\')) {
					// Absolute globs UNC paths don't work properly, see #58758
					key += '**';
				}

				globArgs.push(fixDriveC(key));
			} else if (value && value.when) {
				siblingClauses[key] = value;
			}
		});

	return { globArgs, siblingClauses };
}

/**
 * Resolves a glob like "node_modules/**" in "/foo/bar" to "/foo/bar/node_modules/**".
 * Special cases C:/foo paths to write the glob like /foo instead - see https://github.com/BurntSushi/ripgrep/issues/530.
 *
 * Exported for testing
 */
export function getAbsoluteGlob(folder: string, key: string): string {
	return path.isAbsolute(key) ?
		key :
		path.join(folder, key);
}

function trimTrailingSlash(str: string): string {
	str = strings.rtrim(str, '\\');
	return strings.rtrim(str, '/');
}

export function fixDriveC(path: string): string {
	const root = extpath.getRoot(path);
	return root.toLowerCase() === 'c:/' ?
		path.replace(/^c:[/\\]/i, '/') :
		path;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/node/ripgrepSearchProvider.ts]---
Location: vscode-main/src/vs/workbench/services/search/node/ripgrepSearchProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationTokenSource, CancellationToken } from '../../../../base/common/cancellation.js';
import { OutputChannel } from './ripgrepSearchUtils.js';
import { RipgrepTextSearchEngine } from './ripgrepTextSearchEngine.js';
import { TextSearchProvider2, TextSearchComplete2, TextSearchResult2, TextSearchQuery2, TextSearchProviderOptions, } from '../common/searchExtTypes.js';
import { Progress } from '../../../../platform/progress/common/progress.js';
import { Schemas } from '../../../../base/common/network.js';
import type { RipgrepTextSearchOptions } from '../common/searchExtTypesInternal.js';

export class RipgrepSearchProvider implements TextSearchProvider2 {
	private inProgress: Set<CancellationTokenSource> = new Set();

	constructor(private outputChannel: OutputChannel, private getNumThreads: () => Promise<number | undefined>) {
		process.once('exit', () => this.dispose());
	}

	async provideTextSearchResults(query: TextSearchQuery2, options: TextSearchProviderOptions, progress: Progress<TextSearchResult2>, token: CancellationToken): Promise<TextSearchComplete2> {
		const numThreads = await this.getNumThreads();
		const engine = new RipgrepTextSearchEngine(this.outputChannel, numThreads);

		return Promise.all(options.folderOptions.map(folderOption => {

			const extendedOptions: RipgrepTextSearchOptions = {
				folderOptions: folderOption,
				numThreads,
				maxResults: options.maxResults,
				previewOptions: options.previewOptions,
				maxFileSize: options.maxFileSize,
				surroundingContext: options.surroundingContext
			};
			if (folderOption.folder.scheme === Schemas.vscodeUserData) {
				// Ripgrep search engine can only provide file-scheme results, but we want to use it to search some schemes that are backed by the filesystem, but with some other provider as the frontend,
				// case in point vscode-userdata. In these cases we translate the query to a file, and translate the results back to the frontend scheme.
				const translatedOptions = { ...extendedOptions, folder: folderOption.folder.with({ scheme: Schemas.file }) };
				const progressTranslator = new Progress<TextSearchResult2>(data => progress.report({ ...data, uri: data.uri.with({ scheme: folderOption.folder.scheme }) }));
				return this.withToken(token, token => engine.provideTextSearchResultsWithRgOptions(query, translatedOptions, progressTranslator, token));
			} else {
				return this.withToken(token, token => engine.provideTextSearchResultsWithRgOptions(query, extendedOptions, progress, token));
			}
		})).then((e => {
			const complete: TextSearchComplete2 = {
				// todo: get this to actually check
				limitHit: e.some(complete => !!complete && complete.limitHit)
			};
			return complete;
		}));

	}

	private async withToken<T>(token: CancellationToken, fn: (token: CancellationToken) => Promise<T>): Promise<T> {
		const merged = mergedTokenSource(token);
		this.inProgress.add(merged);
		const result = await fn(merged.token);
		this.inProgress.delete(merged);

		return result;
	}

	private dispose() {
		this.inProgress.forEach(engine => engine.cancel());
	}
}

function mergedTokenSource(token: CancellationToken): CancellationTokenSource {
	const tokenSource = new CancellationTokenSource();
	token.onCancellationRequested(() => tokenSource.cancel());

	return tokenSource;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/node/ripgrepSearchUtils.ts]---
Location: vscode-main/src/vs/workbench/services/search/node/ripgrepSearchUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILogService } from '../../../../platform/log/common/log.js';
import { SearchRange } from '../common/search.js';
import * as searchExtTypes from '../common/searchExtTypes.js';

export type Maybe<T> = T | null | undefined;

export function anchorGlob(glob: string): string {
	return glob.startsWith('**') || glob.startsWith('/') ? glob : `/${glob}`;
}

export function rangeToSearchRange(range: searchExtTypes.Range): SearchRange {
	return new SearchRange(range.start.line, range.start.character, range.end.line, range.end.character);
}

export function searchRangeToRange(range: SearchRange): searchExtTypes.Range {
	return new searchExtTypes.Range(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn);
}

export interface IOutputChannel {
	appendLine(msg: string): void;
}

export class OutputChannel implements IOutputChannel {
	constructor(private prefix: string, @ILogService private readonly logService: ILogService) { }

	appendLine(msg: string): void {
		this.logService.debug(`${this.prefix}#search`, msg);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/node/ripgrepTextSearchEngine.ts]---
Location: vscode-main/src/vs/workbench/services/search/node/ripgrepTextSearchEngine.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as cp from 'child_process';
import { EventEmitter } from 'events';
import { StringDecoder } from 'string_decoder';
import { coalesce, mapArrayOrNot } from '../../../../base/common/arrays.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { groupBy } from '../../../../base/common/collections.js';
import { splitGlobAware } from '../../../../base/common/glob.js';
import { createRegExp, escapeRegExpCharacters } from '../../../../base/common/strings.js';
import { URI } from '../../../../base/common/uri.js';
import { Progress } from '../../../../platform/progress/common/progress.js';
import { DEFAULT_MAX_SEARCH_RESULTS, IExtendedExtensionSearchOptions, ITextSearchPreviewOptions, SearchError, SearchErrorCode, serializeSearchError, TextSearchMatch } from '../common/search.js';
import { Range, TextSearchComplete2, TextSearchContext2, TextSearchMatch2, TextSearchProviderOptions, TextSearchQuery2, TextSearchResult2 } from '../common/searchExtTypes.js';
import { AST as ReAST, RegExpParser, RegExpVisitor } from 'vscode-regexpp';
import { rgPath } from '@vscode/ripgrep';
import { anchorGlob, IOutputChannel, Maybe, rangeToSearchRange, searchRangeToRange } from './ripgrepSearchUtils.js';
import type { RipgrepTextSearchOptions } from '../common/searchExtTypesInternal.js';
import { newToOldPreviewOptions } from '../common/searchExtConversionTypes.js';

// If @vscode/ripgrep is in an .asar file, then the binary is unpacked.
const rgDiskPath = rgPath.replace(/\bnode_modules\.asar\b/, 'node_modules.asar.unpacked');

export class RipgrepTextSearchEngine {

	constructor(private outputChannel: IOutputChannel, private readonly _numThreads?: number | undefined) { }

	provideTextSearchResults(query: TextSearchQuery2, options: TextSearchProviderOptions, progress: Progress<TextSearchResult2>, token: CancellationToken): Promise<TextSearchComplete2> {
		return Promise.all(options.folderOptions.map(folderOption => {
			const extendedOptions: RipgrepTextSearchOptions = {
				folderOptions: folderOption,
				numThreads: this._numThreads,
				maxResults: options.maxResults,
				previewOptions: options.previewOptions,
				maxFileSize: options.maxFileSize,
				surroundingContext: options.surroundingContext
			};
			return this.provideTextSearchResultsWithRgOptions(query, extendedOptions, progress, token);
		})).then((e => {
			const complete: TextSearchComplete2 = {
				// todo: get this to actually check
				limitHit: e.some(complete => !!complete && complete.limitHit)
			};
			return complete;
		}));
	}

	provideTextSearchResultsWithRgOptions(query: TextSearchQuery2, options: RipgrepTextSearchOptions, progress: Progress<TextSearchResult2>, token: CancellationToken): Promise<TextSearchComplete2> {
		this.outputChannel.appendLine(`provideTextSearchResults ${query.pattern}, ${JSON.stringify({
			...options,
			...{
				folder: options.folderOptions.folder.toString()
			}
		})}`);

		if (!query.pattern) {
			return Promise.resolve({ limitHit: false });
		}

		return new Promise((resolve, reject) => {
			token.onCancellationRequested(() => cancel());

			const extendedOptions: RipgrepTextSearchOptions = {
				...options,
				numThreads: this._numThreads
			};
			const rgArgs = getRgArgs(query, extendedOptions);

			const cwd = options.folderOptions.folder.fsPath;

			const escapedArgs = rgArgs
				.map(arg => arg.match(/^-/) ? arg : `'${arg}'`)
				.join(' ');
			this.outputChannel.appendLine(`${rgDiskPath} ${escapedArgs}\n - cwd: ${cwd}`);

			let rgProc: Maybe<cp.ChildProcess> = cp.spawn(rgDiskPath, rgArgs, { cwd });
			rgProc.on('error', e => {
				console.error(e);
				this.outputChannel.appendLine('Error: ' + (e && e.message));
				reject(serializeSearchError(new SearchError(e && e.message, SearchErrorCode.rgProcessError)));
			});

			let gotResult = false;
			const ripgrepParser = new RipgrepParser(options.maxResults ?? DEFAULT_MAX_SEARCH_RESULTS, options.folderOptions.folder, newToOldPreviewOptions(options.previewOptions));
			ripgrepParser.on('result', (match: TextSearchResult2) => {
				gotResult = true;
				dataWithoutResult = '';
				progress.report(match);
			});

			let isDone = false;
			const cancel = () => {
				isDone = true;

				rgProc?.kill();

				ripgrepParser?.cancel();
			};

			let limitHit = false;
			ripgrepParser.on('hitLimit', () => {
				limitHit = true;
				cancel();
			});

			let dataWithoutResult = '';
			rgProc.stdout!.on('data', data => {
				ripgrepParser.handleData(data);
				if (!gotResult) {
					dataWithoutResult += data;
				}
			});

			let gotData = false;
			rgProc.stdout!.once('data', () => gotData = true);

			let stderr = '';
			rgProc.stderr!.on('data', data => {
				const message = data.toString();
				this.outputChannel.appendLine(message);

				if (stderr.length + message.length < 1e6) {
					stderr += message;
				}
			});

			rgProc.on('close', () => {
				this.outputChannel.appendLine(gotData ? 'Got data from stdout' : 'No data from stdout');
				this.outputChannel.appendLine(gotResult ? 'Got result from parser' : 'No result from parser');
				if (dataWithoutResult) {
					this.outputChannel.appendLine(`Got data without result: ${dataWithoutResult}`);
				}

				this.outputChannel.appendLine('');

				if (isDone) {
					resolve({ limitHit });
				} else {
					// Trigger last result
					ripgrepParser.flush();
					rgProc = null;
					let searchError: Maybe<SearchError>;
					if (stderr && !gotData && (searchError = rgErrorMsgForDisplay(stderr))) {
						reject(serializeSearchError(new SearchError(searchError.message, searchError.code)));
					} else {
						resolve({ limitHit });
					}
				}
			});
		});
	}
}

/**
 * Read the first line of stderr and return an error for display or undefined, based on a list of
 * allowed properties.
 * Ripgrep produces stderr output which is not from a fatal error, and we only want the search to be
 * "failed" when a fatal error was produced.
 */
function rgErrorMsgForDisplay(msg: string): Maybe<SearchError> {
	const lines = msg.split('\n');
	const firstLine = lines[0].trim();

	if (lines.some(l => l.startsWith('regex parse error'))) {
		return new SearchError(buildRegexParseError(lines), SearchErrorCode.regexParseError);
	}

	const match = firstLine.match(/grep config error: unknown encoding: (.*)/);
	if (match) {
		return new SearchError(`Unknown encoding: ${match[1]}`, SearchErrorCode.unknownEncoding);
	}

	if (firstLine.startsWith('error parsing glob')) {
		// Uppercase first letter
		return new SearchError(firstLine.charAt(0).toUpperCase() + firstLine.substr(1), SearchErrorCode.globParseError);
	}

	if (firstLine.startsWith('the literal')) {
		// Uppercase first letter
		return new SearchError(firstLine.charAt(0).toUpperCase() + firstLine.substr(1), SearchErrorCode.invalidLiteral);
	}

	if (firstLine.startsWith('PCRE2: error compiling pattern')) {
		return new SearchError(firstLine, SearchErrorCode.regexParseError);
	}

	return undefined;
}

function buildRegexParseError(lines: string[]): string {
	const errorMessage: string[] = ['Regex parse error'];
	const pcre2ErrorLine = lines.filter(l => (l.startsWith('PCRE2:')));
	if (pcre2ErrorLine.length >= 1) {
		const pcre2ErrorMessage = pcre2ErrorLine[0].replace('PCRE2:', '');
		if (pcre2ErrorMessage.indexOf(':') !== -1 && pcre2ErrorMessage.split(':').length >= 2) {
			const pcre2ActualErrorMessage = pcre2ErrorMessage.split(':')[1];
			errorMessage.push(':' + pcre2ActualErrorMessage);
		}
	}

	return errorMessage.join('');
}


export class RipgrepParser extends EventEmitter {
	private remainder = '';
	private isDone = false;
	private hitLimit = false;
	private stringDecoder: StringDecoder;

	private numResults = 0;

	constructor(private maxResults: number, private root: URI, private previewOptions: ITextSearchPreviewOptions) {
		super();
		this.stringDecoder = new StringDecoder();
	}

	cancel(): void {
		this.isDone = true;
	}

	flush(): void {
		this.handleDecodedData(this.stringDecoder.end());
	}


	override on(event: 'result', listener: (result: TextSearchResult2) => void): this;
	override on(event: 'hitLimit', listener: () => void): this;
	override on(event: string, listener: (...args: any[]) => void): this {
		super.on(event, listener);
		return this;
	}

	handleData(data: Buffer | string): void {
		if (this.isDone) {
			return;
		}

		const dataStr = typeof data === 'string' ? data : this.stringDecoder.write(data);
		this.handleDecodedData(dataStr);
	}

	private handleDecodedData(decodedData: string): void {
		// check for newline before appending to remainder
		let newlineIdx = decodedData.indexOf('\n');

		// If the previous data chunk didn't end in a newline, prepend it to this chunk
		const dataStr = this.remainder + decodedData;

		if (newlineIdx >= 0) {
			newlineIdx += this.remainder.length;
		} else {
			// Shortcut
			this.remainder = dataStr;
			return;
		}

		let prevIdx = 0;
		while (newlineIdx >= 0) {
			this.handleLine(dataStr.substring(prevIdx, newlineIdx).trim());
			prevIdx = newlineIdx + 1;
			newlineIdx = dataStr.indexOf('\n', prevIdx);
		}

		this.remainder = dataStr.substring(prevIdx);
	}


	private handleLine(outputLine: string): void {
		if (this.isDone || !outputLine) {
			return;
		}

		let parsedLine: IRgMessage;
		try {
			parsedLine = JSON.parse(outputLine);
		} catch (e) {
			throw new Error(`malformed line from rg: ${outputLine}`);
		}

		if (parsedLine.type === 'match') {
			const matchPath = bytesOrTextToString(parsedLine.data.path);
			const uri = URI.joinPath(this.root, matchPath);
			const result = this.createTextSearchMatch(parsedLine.data, uri);
			this.onResult(result);

			if (this.hitLimit) {
				this.cancel();
				this.emit('hitLimit');
			}
		} else if (parsedLine.type === 'context') {
			const contextPath = bytesOrTextToString(parsedLine.data.path);
			const uri = URI.joinPath(this.root, contextPath);
			const result = this.createTextSearchContexts(parsedLine.data, uri);
			result.forEach(r => this.onResult(r));
		}
	}

	private createTextSearchMatch(data: IRgMatch, uri: URI): TextSearchMatch2 {
		const lineNumber = data.line_number - 1;
		const fullText = bytesOrTextToString(data.lines);
		const fullTextBytes = Buffer.from(fullText);

		let prevMatchEnd = 0;
		let prevMatchEndCol = 0;
		let prevMatchEndLine = lineNumber;

		// it looks like certain regexes can match a line, but cause rg to not
		// emit any specific submatches for that line.
		// https://github.com/microsoft/vscode/issues/100569#issuecomment-738496991
		if (data.submatches.length === 0) {
			data.submatches.push(
				fullText.length
					? { start: 0, end: 1, match: { text: fullText[0] } }
					: { start: 0, end: 0, match: { text: '' } }
			);
		}

		const ranges = coalesce(data.submatches.map((match, i) => {
			if (this.hitLimit) {
				return null;
			}

			this.numResults++;
			if (this.numResults >= this.maxResults) {
				// Finish the line, then report the result below
				this.hitLimit = true;
			}

			const matchText = bytesOrTextToString(match.match);

			const inBetweenText = fullTextBytes.slice(prevMatchEnd, match.start).toString();
			const inBetweenStats = getNumLinesAndLastNewlineLength(inBetweenText);
			const startCol = inBetweenStats.numLines > 0 ?
				inBetweenStats.lastLineLength :
				inBetweenStats.lastLineLength + prevMatchEndCol;

			const stats = getNumLinesAndLastNewlineLength(matchText);
			const startLineNumber = inBetweenStats.numLines + prevMatchEndLine;
			const endLineNumber = stats.numLines + startLineNumber;
			const endCol = stats.numLines > 0 ?
				stats.lastLineLength :
				stats.lastLineLength + startCol;

			prevMatchEnd = match.end;
			prevMatchEndCol = endCol;
			prevMatchEndLine = endLineNumber;

			return new Range(startLineNumber, startCol, endLineNumber, endCol);
		}));

		const searchRange = mapArrayOrNot(<Range[]>ranges, rangeToSearchRange);

		const internalResult = new TextSearchMatch(fullText, searchRange, this.previewOptions);
		return new TextSearchMatch2(
			uri,
			internalResult.rangeLocations.map(e => (
				{
					sourceRange: searchRangeToRange(e.source),
					previewRange: searchRangeToRange(e.preview),
				}
			)),
			internalResult.previewText);
	}

	private createTextSearchContexts(data: IRgMatch, uri: URI): TextSearchContext2[] {
		const text = bytesOrTextToString(data.lines);
		const startLine = data.line_number;
		return text
			.replace(/\r?\n$/, '')
			.split('\n')
			.map((line, i) => new TextSearchContext2(uri, line, startLine + i));
	}

	private onResult(match: TextSearchResult2): void {
		this.emit('result', match);
	}
}

function bytesOrTextToString(obj: any): string {
	return obj.bytes ?
		Buffer.from(obj.bytes, 'base64').toString() :
		obj.text;
}

function getNumLinesAndLastNewlineLength(text: string): { numLines: number; lastLineLength: number } {
	const re = /\n/g;
	let numLines = 0;
	let lastNewlineIdx = -1;
	let match: ReturnType<typeof re.exec>;
	while (match = re.exec(text)) {
		numLines++;
		lastNewlineIdx = match.index;
	}

	const lastLineLength = lastNewlineIdx >= 0 ?
		text.length - lastNewlineIdx - 1 :
		text.length;

	return { numLines, lastLineLength };
}

// exported for testing
export function getRgArgs(query: TextSearchQuery2, options: RipgrepTextSearchOptions): string[] {
	const args = ['--hidden', '--no-require-git'];
	args.push(query.isCaseSensitive ? '--case-sensitive' : '--ignore-case');

	const { doubleStarIncludes, otherIncludes } = groupBy(
		options.folderOptions.includes,
		(include: string) => include.startsWith('**') ? 'doubleStarIncludes' : 'otherIncludes');

	if (otherIncludes && otherIncludes.length) {
		const uniqueOthers = new Set<string>();
		otherIncludes.forEach(other => { uniqueOthers.add(other); });

		args.push('-g', '!*');
		uniqueOthers
			.forEach(otherIncude => {
				spreadGlobComponents(otherIncude)
					.map(anchorGlob)
					.forEach(globArg => {
						args.push('-g', globArg);
					});
			});
	}

	if (doubleStarIncludes && doubleStarIncludes.length) {
		doubleStarIncludes.forEach(globArg => {
			args.push('-g', globArg);
		});
	}

	options.folderOptions.excludes.map(e => typeof (e) === 'string' ? e : e.pattern)
		.map(anchorGlob)
		.forEach(rgGlob => args.push('-g', `!${rgGlob}`));

	if (options.maxFileSize) {
		args.push('--max-filesize', options.maxFileSize + '');
	}

	if (options.folderOptions.useIgnoreFiles.local) {
		if (!options.folderOptions.useIgnoreFiles.parent) {
			args.push('--no-ignore-parent');
		}
	} else {
		// Don't use .gitignore or .ignore
		args.push('--no-ignore');
	}

	if (options.folderOptions.followSymlinks) {
		args.push('--follow');
	}

	if (options.folderOptions.encoding && options.folderOptions.encoding !== 'utf8') {
		args.push('--encoding', options.folderOptions.encoding);
	}

	if (options.numThreads) {
		args.push('--threads', `${options.numThreads}`);
	}

	// Ripgrep handles -- as a -- arg separator. Only --.
	// - is ok, --- is ok, --some-flag is also ok. Need to special case.
	if (query.pattern === '--') {
		query.isRegExp = true;
		query.pattern = '\\-\\-';
	}

	if (query.isMultiline && !query.isRegExp) {
		query.pattern = escapeRegExpCharacters(query.pattern);
		query.isRegExp = true;
	}

	if ((<IExtendedExtensionSearchOptions>options).usePCRE2) {
		args.push('--pcre2');
	}

	// Allow $ to match /r/n
	args.push('--crlf');

	if (query.isRegExp) {
		query.pattern = unicodeEscapesToPCRE2(query.pattern);
		args.push('--engine', 'auto');
	}

	let searchPatternAfterDoubleDashes: Maybe<string>;
	if (query.isWordMatch) {
		const regexp = createRegExp(query.pattern, !!query.isRegExp, { wholeWord: query.isWordMatch });
		const regexpStr = regexp.source.replace(/\\\//g, '/'); // RegExp.source arbitrarily returns escaped slashes. Search and destroy.
		args.push('--regexp', regexpStr);
	} else if (query.isRegExp) {
		let fixedRegexpQuery = fixRegexNewline(query.pattern);
		fixedRegexpQuery = fixNewline(fixedRegexpQuery);
		args.push('--regexp', fixedRegexpQuery);
	} else {
		searchPatternAfterDoubleDashes = query.pattern;
		args.push('--fixed-strings');
	}

	args.push('--no-config');
	if (!options.folderOptions.useIgnoreFiles.global) {
		args.push('--no-ignore-global');
	}

	args.push('--json');

	if (query.isMultiline) {
		args.push('--multiline');
	}

	if (options.surroundingContext) {
		args.push('--before-context', options.surroundingContext + '');
		args.push('--after-context', options.surroundingContext + '');
	}

	// Folder to search
	args.push('--');

	if (searchPatternAfterDoubleDashes) {
		// Put the query after --, in case the query starts with a dash
		args.push(searchPatternAfterDoubleDashes);
	}

	args.push('.');

	return args;
}

/**
 * `"foo/*bar/something"` -> `["foo", "foo/*bar", "foo/*bar/something", "foo/*bar/something/**"]`
 */
function spreadGlobComponents(globComponent: string): string[] {
	const globComponentWithBraceExpansion = performBraceExpansionForRipgrep(globComponent);

	return globComponentWithBraceExpansion.flatMap((globArg) => {
		const components = splitGlobAware(globArg, '/');
		return components.map((_, i) => components.slice(0, i + 1).join('/'));
	});

}

export function unicodeEscapesToPCRE2(pattern: string): string {
	// Match \u1234
	const unicodePattern = /((?:[^\\]|^)(?:\\\\)*)\\u([a-z0-9]{4})/gi;

	while (pattern.match(unicodePattern)) {
		pattern = pattern.replace(unicodePattern, `$1\\x{$2}`);
	}

	// Match \u{1234}
	// \u with 5-6 characters will be left alone because \x only takes 4 characters.
	const unicodePatternWithBraces = /((?:[^\\]|^)(?:\\\\)*)\\u\{([a-z0-9]{4})\}/gi;
	while (pattern.match(unicodePatternWithBraces)) {
		pattern = pattern.replace(unicodePatternWithBraces, `$1\\x{$2}`);
	}

	return pattern;
}

export interface IRgMessage {
	type: 'match' | 'context' | string;
	data: IRgMatch;
}

export interface IRgMatch {
	path: IRgBytesOrText;
	lines: IRgBytesOrText;
	line_number: number;
	absolute_offset: number;
	submatches: IRgSubmatch[];
}

export interface IRgSubmatch {
	match: IRgBytesOrText;
	start: number;
	end: number;
}

export type IRgBytesOrText = { bytes: string } | { text: string };

const isLookBehind = (node: ReAST.Node) => node.type === 'Assertion' && node.kind === 'lookbehind';

export function fixRegexNewline(pattern: string): string {
	// we parse the pattern anew each tiem
	let re: ReAST.Pattern;
	try {
		re = new RegExpParser().parsePattern(pattern);
	} catch {
		return pattern;
	}

	let output = '';
	let lastEmittedIndex = 0;
	const replace = (start: number, end: number, text: string) => {
		output += pattern.slice(lastEmittedIndex, start) + text;
		lastEmittedIndex = end;
	};

	const context: ReAST.Node[] = [];
	const visitor = new RegExpVisitor({
		onCharacterEnter(char) {
			if (char.raw !== '\\n') {
				return;
			}

			const parent = context[0];
			if (!parent) {
				// simple char, \n -> \r?\n
				replace(char.start, char.end, '\\r?\\n');
			} else if (context.some(isLookBehind)) {
				// no-op in a lookbehind, see #100569
			} else if (parent.type === 'CharacterClass') {
				if (parent.negate) {
					// negative bracket expr, [^a-z\n] -> (?![a-z]|\r?\n)
					const otherContent = pattern.slice(parent.start + 2, char.start) + pattern.slice(char.end, parent.end - 1);
					if (parent.parent?.type === 'Quantifier') {
						// If quantified, we can't use a negative lookahead in a quantifier.
						// But `.` already doesn't match new lines, so we can just use that
						// (with any other negations) instead.
						replace(parent.start, parent.end, otherContent ? `[^${otherContent}]` : '.');
					} else {
						replace(parent.start, parent.end, '(?!\\r?\\n' + (otherContent ? `|[${otherContent}]` : '') + ')');
					}
				} else {
					// positive bracket expr, [a-z\n] -> (?:[a-z]|\r?\n)
					const otherContent = pattern.slice(parent.start + 1, char.start) + pattern.slice(char.end, parent.end - 1);
					replace(parent.start, parent.end, otherContent === '' ? '\\r?\\n' : `(?:[${otherContent}]|\\r?\\n)`);
				}
			} else if (parent.type === 'Quantifier') {
				replace(char.start, char.end, '(?:\\r?\\n)');
			}
		},
		onQuantifierEnter(node) {
			context.unshift(node);
		},
		onQuantifierLeave() {
			context.shift();
		},
		onCharacterClassRangeEnter(node) {
			context.unshift(node);
		},
		onCharacterClassRangeLeave() {
			context.shift();
		},
		onCharacterClassEnter(node) {
			context.unshift(node);
		},
		onCharacterClassLeave() {
			context.shift();
		},
		onAssertionEnter(node) {
			if (isLookBehind(node)) {
				context.push(node);
			}
		},
		onAssertionLeave(node) {
			if (context[0] === node) {
				context.shift();
			}
		},
	});

	visitor.visit(re);
	output += pattern.slice(lastEmittedIndex);
	return output;
}

export function fixNewline(pattern: string): string {
	return pattern.replace(/\n/g, '\\r?\\n');
}

// brace expansion for ripgrep

/**
 * Split string given first opportunity for brace expansion in the string.
 * - If the brace is prepended by a \ character, then it is escaped.
 * - Does not process escapes that are within the sub-glob.
 * - If two unescaped `{` occur before `}`, then ripgrep will return an error for brace nesting, so don't split on those.
 */
function getEscapeAwareSplitStringForRipgrep(pattern: string): { fixedStart?: string; strInBraces: string; fixedEnd?: string } {
	let inBraces = false;
	let escaped = false;
	let fixedStart = '';
	let strInBraces = '';
	for (let i = 0; i < pattern.length; i++) {
		const char = pattern[i];
		switch (char) {
			case '\\':
				if (escaped) {
					// If we're already escaped, then just leave the escaped slash and the preceeding slash that escapes it.
					// The two escaped slashes will result in a single slash and whatever processes the glob later will properly process the escape
					if (inBraces) {
						strInBraces += '\\' + char;
					} else {
						fixedStart += '\\' + char;
					}
					escaped = false;
				} else {
					escaped = true;
				}
				break;
			case '{':
				if (escaped) {
					// if we escaped this opening bracket, then it is to be taken literally. Remove the `\` because we've acknowleged it and add the `{` to the appropriate string
					if (inBraces) {
						strInBraces += char;
					} else {
						fixedStart += char;
					}
					escaped = false;
				} else {
					if (inBraces) {
						// ripgrep treats this as attempting to do a nested alternate group, which is invalid. Return with pattern including changes from escaped braces.
						return { strInBraces: fixedStart + '{' + strInBraces + '{' + pattern.substring(i + 1) };
					} else {
						inBraces = true;
					}
				}
				break;
			case '}':
				if (escaped) {
					// same as `}`, but for closing bracket
					if (inBraces) {
						strInBraces += char;
					} else {
						fixedStart += char;
					}
					escaped = false;
				} else if (inBraces) {
					// we found an end bracket to a valid opening bracket. Return the appropriate strings.
					return { fixedStart, strInBraces, fixedEnd: pattern.substring(i + 1) };
				} else {
					// if we're not in braces and not escaped, then this is a literal `}` character and we're still adding to fixedStart.
					fixedStart += char;
				}
				break;
			default:
				// similar to the `\\` case, we didn't do anything with the escape, so we should re-insert it into the appropriate string
				// to be consumed later when individual parts of the glob are processed
				if (inBraces) {
					strInBraces += (escaped ? '\\' : '') + char;
				} else {
					fixedStart += (escaped ? '\\' : '') + char;
				}
				escaped = false;
				break;
		}
	}


	// we are haven't hit the last brace, so no splitting should occur. Return with pattern including changes from escaped braces.
	return { strInBraces: fixedStart + (inBraces ? ('{' + strInBraces) : '') };
}

/**
 * Parses out curly braces and returns equivalent globs. Only supports one level of nesting.
 * Exported for testing.
 */
export function performBraceExpansionForRipgrep(pattern: string): string[] {
	const { fixedStart, strInBraces, fixedEnd } = getEscapeAwareSplitStringForRipgrep(pattern);
	if (fixedStart === undefined || fixedEnd === undefined) {
		return [strInBraces];
	}

	let arr = splitGlobAware(strInBraces, ',');

	if (!arr.length) {
		// occurs if the braces are empty.
		arr = [''];
	}

	const ends = performBraceExpansionForRipgrep(fixedEnd);

	return arr.flatMap((elem) => {
		const start = fixedStart + elem;
		return ends.map((end) => {
			return start + end;
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/node/textSearchAdapter.ts]---
Location: vscode-main/src/vs/workbench/services/search/node/textSearchAdapter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import * as pfs from '../../../../base/node/pfs.js';
import { IFileMatch, IProgressMessage, ITextQuery, ITextSearchMatch, ISerializedFileMatch, ISerializedSearchSuccess, resultIsMatch } from '../common/search.js';
import { RipgrepTextSearchEngine } from './ripgrepTextSearchEngine.js';
import { NativeTextSearchManager } from './textSearchManager.js';

export class TextSearchEngineAdapter {

	constructor(private query: ITextQuery, private numThreads?: number) { }

	search(token: CancellationToken, onResult: (matches: ISerializedFileMatch[]) => void, onMessage: (message: IProgressMessage) => void): Promise<ISerializedSearchSuccess> {
		if ((!this.query.folderQueries || !this.query.folderQueries.length) && (!this.query.extraFileResources || !this.query.extraFileResources.length)) {
			return Promise.resolve({
				type: 'success',
				limitHit: false,
				stats: {
					type: 'searchProcess'
				},
				messages: []
			});
		}

		const pretendOutputChannel = {
			appendLine(msg: string) {
				onMessage({ message: msg });
			}
		};
		const textSearchManager = new NativeTextSearchManager(this.query, new RipgrepTextSearchEngine(pretendOutputChannel, this.numThreads), pfs);
		return new Promise((resolve, reject) => {
			return textSearchManager
				.search(
					matches => {
						onResult(matches.map(fileMatchToSerialized));
					},
					token)
				.then(
					c => resolve({ limitHit: c.limitHit ?? false, type: 'success', stats: c.stats, messages: [] }),
					reject);
		});
	}
}

function fileMatchToSerialized(match: IFileMatch): ISerializedFileMatch {
	return {
		path: match.resource && match.resource.fsPath,
		results: match.results,
		numMatches: (match.results || []).reduce((sum, r) => {
			if (resultIsMatch(r)) {
				const m = <ITextSearchMatch>r;
				return sum + m.rangeLocations.length;
			} else {
				return sum + 1;
			}
		}, 0)
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/node/textSearchManager.ts]---
Location: vscode-main/src/vs/workbench/services/search/node/textSearchManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { toCanonicalName } from '../../textfile/common/encoding.js';
import * as pfs from '../../../../base/node/pfs.js';
import { ITextQuery, ITextSearchStats } from '../common/search.js';
import { TextSearchProvider2 } from '../common/searchExtTypes.js';
import { TextSearchManager } from '../common/textSearchManager.js';

export class NativeTextSearchManager extends TextSearchManager {

	constructor(query: ITextQuery, provider: TextSearchProvider2, _pfs: typeof pfs = pfs, processType: ITextSearchStats['type'] = 'searchProcess') {
		super({ query, provider }, {
			readdir: resource => _pfs.Promises.readdir(resource.fsPath),
			toCanonicalName: name => toCanonicalName(name)
		}, processType);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/test/browser/queryBuilder.test.ts]---
Location: vscode-main/src/vs/workbench/services/search/test/browser/queryBuilder.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { IExpression } from '../../../../../base/common/glob.js';
import { join } from '../../../../../base/common/path.js';
import { isWindows } from '../../../../../base/common/platform.js';
import { URI, URI as uri } from '../../../../../base/common/uri.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IWorkspaceContextService, toWorkspaceFolder } from '../../../../../platform/workspace/common/workspace.js';
import { toWorkspaceFolders } from '../../../../../platform/workspaces/common/workspaces.js';
import { ISearchPathsInfo, QueryBuilder } from '../../common/queryBuilder.js';
import { IPathService } from '../../../path/common/pathService.js';
import { IFileQuery, IFolderQuery, IPatternInfo, ITextQuery, QueryType } from '../../common/search.js';
import { TestPathService, TestEnvironmentService } from '../../../../test/browser/workbenchTestServices.js';
import { TestContextService } from '../../../../test/common/workbenchTestServices.js';
import { IEnvironmentService } from '../../../../../platform/environment/common/environment.js';
import { Workspace } from '../../../../../platform/workspace/test/common/testWorkspace.js';
import { extUriBiasedIgnorePathCase } from '../../../../../base/common/resources.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

const DEFAULT_EDITOR_CONFIG = {};
const DEFAULT_USER_CONFIG = { useRipgrep: true, useIgnoreFiles: true, useGlobalIgnoreFiles: true, useParentIgnoreFiles: true };
const DEFAULT_QUERY_PROPS = {};
const DEFAULT_TEXT_QUERY_PROPS = { usePCRE2: false };

suite('QueryBuilder', () => {
	ensureNoDisposablesAreLeakedInTestSuite();
	const PATTERN_INFO: IPatternInfo = { pattern: 'a' };
	const ROOT_1 = fixPath('/foo/root1');
	const ROOT_1_URI = getUri(ROOT_1);
	const ROOT_1_NAMED_FOLDER = toWorkspaceFolder(ROOT_1_URI);
	const WS_CONFIG_PATH = getUri('/bar/test.code-workspace'); // location of the workspace file (not important except that it is a file URI)

	let instantiationService: TestInstantiationService;
	let queryBuilder: QueryBuilder;
	let mockConfigService: TestConfigurationService;
	let mockContextService: TestContextService;
	let mockWorkspace: Workspace;

	setup(() => {
		instantiationService = new TestInstantiationService();

		mockConfigService = new TestConfigurationService();
		mockConfigService.setUserConfiguration('search', DEFAULT_USER_CONFIG);
		mockConfigService.setUserConfiguration('editor', DEFAULT_EDITOR_CONFIG);
		instantiationService.stub(IConfigurationService, mockConfigService);

		mockContextService = new TestContextService();
		mockWorkspace = new Workspace('workspace', [toWorkspaceFolder(ROOT_1_URI)]);
		mockContextService.setWorkspace(mockWorkspace);

		instantiationService.stub(IWorkspaceContextService, mockContextService);
		instantiationService.stub(IEnvironmentService, TestEnvironmentService);
		instantiationService.stub(IPathService, new TestPathService());

		queryBuilder = instantiationService.createInstance(QueryBuilder);
	});

	teardown(() => {
		instantiationService.dispose();
	});

	test('simple text pattern', () => {
		assertEqualTextQueries(
			queryBuilder.text(PATTERN_INFO),
			{
				folderQueries: [],
				contentPattern: PATTERN_INFO,
				type: QueryType.Text
			});
	});

	test('normalize literal newlines', () => {
		assertEqualTextQueries(
			queryBuilder.text({ pattern: 'foo\nbar', isRegExp: true }),
			{
				folderQueries: [],
				contentPattern: {
					pattern: 'foo\\nbar',
					isRegExp: true,
					isMultiline: true
				},
				type: QueryType.Text
			});

		assertEqualTextQueries(
			queryBuilder.text({ pattern: 'foo\nbar', isRegExp: false }),
			{
				folderQueries: [],
				contentPattern: {
					pattern: 'foo\nbar',
					isRegExp: false,
					isMultiline: true
				},
				type: QueryType.Text
			});
	});

	test('splits include pattern when expandPatterns enabled', () => {
		assertEqualQueries(
			queryBuilder.file(
				[ROOT_1_NAMED_FOLDER],
				{ includePattern: '**/foo, **/bar', expandPatterns: true },
			),
			{
				folderQueries: [{
					folder: ROOT_1_URI
				}],
				type: QueryType.File,
				includePattern: {
					'**/foo': true,
					'**/foo/**': true,
					'**/bar': true,
					'**/bar/**': true,
				}
			});
	});

	test('does not split include pattern when expandPatterns disabled', () => {
		assertEqualQueries(
			queryBuilder.file(
				[ROOT_1_NAMED_FOLDER],
				{ includePattern: '**/foo, **/bar' },
			),
			{
				folderQueries: [{
					folder: ROOT_1_URI
				}],
				type: QueryType.File,
				includePattern: {
					'**/foo, **/bar': true
				}
			});
	});

	test('includePattern array', () => {
		assertEqualQueries(
			queryBuilder.file(
				[ROOT_1_NAMED_FOLDER],
				{ includePattern: ['**/foo', '**/bar'] },
			),
			{
				folderQueries: [{
					folder: ROOT_1_URI
				}],
				type: QueryType.File,
				includePattern: {
					'**/foo': true,
					'**/bar': true
				}
			});
	});

	test('includePattern array with expandPatterns', () => {
		assertEqualQueries(
			queryBuilder.file(
				[ROOT_1_NAMED_FOLDER],
				{ includePattern: ['**/foo', '**/bar'], expandPatterns: true },
			),
			{
				folderQueries: [{
					folder: ROOT_1_URI
				}],
				type: QueryType.File,
				includePattern: {
					'**/foo': true,
					'**/foo/**': true,
					'**/bar': true,
					'**/bar/**': true,
				}
			});
	});

	test('folderResources', () => {
		assertEqualTextQueries(
			queryBuilder.text(
				PATTERN_INFO,
				[ROOT_1_URI]
			),
			{
				contentPattern: PATTERN_INFO,
				folderQueries: [{ folder: ROOT_1_URI }],
				type: QueryType.Text
			});
	});

	test('simple exclude setting', () => {
		mockConfigService.setUserConfiguration('search', {
			...DEFAULT_USER_CONFIG,
			exclude: {
				'bar/**': true,
				'foo/**': {
					'when': '$(basename).ts'
				}
			}
		});

		assertEqualTextQueries(
			queryBuilder.text(
				PATTERN_INFO,
				[ROOT_1_URI],
				{
					expandPatterns: true // verify that this doesn't affect patterns from configuration
				}
			),
			{
				contentPattern: PATTERN_INFO,
				folderQueries: [{
					folder: ROOT_1_URI,
					excludePattern: [{
						pattern: {
							'bar/**': true,
							'foo/**': {
								'when': '$(basename).ts'
							}
						}
					}]
				}],
				type: QueryType.Text
			});
	});

	test('simple include', () => {
		assertEqualTextQueries(
			queryBuilder.text(
				PATTERN_INFO,
				[ROOT_1_URI],
				{
					includePattern: 'bar',
					expandPatterns: true
				}
			),
			{
				contentPattern: PATTERN_INFO,
				folderQueries: [{
					folder: ROOT_1_URI
				}],
				includePattern: {
					'**/bar': true,
					'**/bar/**': true
				},
				type: QueryType.Text
			});

		assertEqualTextQueries(
			queryBuilder.text(
				PATTERN_INFO,
				[ROOT_1_URI],
				{
					includePattern: 'bar'
				}
			),
			{
				contentPattern: PATTERN_INFO,
				folderQueries: [{
					folder: ROOT_1_URI
				}],
				includePattern: {
					'bar': true
				},
				type: QueryType.Text
			});
	});

	test('simple include with ./ syntax', () => {

		assertEqualTextQueries(
			queryBuilder.text(
				PATTERN_INFO,
				[ROOT_1_URI],
				{
					includePattern: './bar',
					expandPatterns: true
				}
			),
			{
				contentPattern: PATTERN_INFO,
				folderQueries: [{
					folder: ROOT_1_URI,
					includePattern: {
						'bar': true,
						'bar/**': true
					}
				}],
				type: QueryType.Text
			});

		assertEqualTextQueries(
			queryBuilder.text(
				PATTERN_INFO,
				[ROOT_1_URI],
				{
					includePattern: '.\\bar',
					expandPatterns: true
				}
			),
			{
				contentPattern: PATTERN_INFO,
				folderQueries: [{
					folder: ROOT_1_URI,
					includePattern: {
						'bar': true,
						'bar/**': true
					}
				}],
				type: QueryType.Text
			});
	});

	test('exclude setting and searchPath', () => {
		mockConfigService.setUserConfiguration('search', {
			...DEFAULT_USER_CONFIG,
			exclude: {
				'foo/**/*.js': true,
				'bar/**': {
					'when': '$(basename).ts'
				}
			}
		});

		assertEqualTextQueries(
			queryBuilder.text(
				PATTERN_INFO,
				[ROOT_1_URI],
				{
					includePattern: './foo',
					expandPatterns: true
				}
			),
			{
				contentPattern: PATTERN_INFO,
				folderQueries: [{
					folder: ROOT_1_URI,
					includePattern: {
						'foo': true,
						'foo/**': true
					},
					excludePattern: [{
						pattern: {
							'foo/**/*.js': true,
							'bar/**': {
								'when': '$(basename).ts'
							}
						}
					}]
				}],
				type: QueryType.Text
			});
	});

	test('multiroot exclude settings', () => {
		const ROOT_2 = fixPath('/project/root2');
		const ROOT_2_URI = getUri(ROOT_2);
		const ROOT_3 = fixPath('/project/root3');
		const ROOT_3_URI = getUri(ROOT_3);
		mockWorkspace.folders = toWorkspaceFolders([{ path: ROOT_1_URI.fsPath }, { path: ROOT_2_URI.fsPath }, { path: ROOT_3_URI.fsPath }], WS_CONFIG_PATH, extUriBiasedIgnorePathCase);
		mockWorkspace.configuration = uri.file(fixPath('/config'));

		mockConfigService.setUserConfiguration('search', {
			...DEFAULT_USER_CONFIG,
			exclude: { 'foo/**/*.js': true }
		}, ROOT_1_URI);

		mockConfigService.setUserConfiguration('search', {
			...DEFAULT_USER_CONFIG,
			exclude: { 'bar': true }
		}, ROOT_2_URI);

		// There are 3 roots, the first two have search.exclude settings, test that the correct basic query is returned
		assertEqualTextQueries(
			queryBuilder.text(
				PATTERN_INFO,
				[ROOT_1_URI, ROOT_2_URI, ROOT_3_URI]
			),
			{
				contentPattern: PATTERN_INFO,
				folderQueries: [
					{ folder: ROOT_1_URI, excludePattern: makeExcludePatternFromPatterns('foo/**/*.js') },
					{ folder: ROOT_2_URI, excludePattern: makeExcludePatternFromPatterns('bar') },
					{ folder: ROOT_3_URI }
				],
				type: QueryType.Text
			}
		);

		// Now test that it merges the root excludes when an 'include' is used
		assertEqualTextQueries(
			queryBuilder.text(
				PATTERN_INFO,
				[ROOT_1_URI, ROOT_2_URI, ROOT_3_URI],
				{
					includePattern: './root2/src',
					expandPatterns: true
				}
			),
			{
				contentPattern: PATTERN_INFO,
				folderQueries: [
					{
						folder: ROOT_2_URI,
						includePattern: {
							'src': true,
							'src/**': true
						},
						excludePattern: [{
							pattern: { 'bar': true }
						}],
					}
				],
				type: QueryType.Text
			}
		);
	});

	test('simple exclude input pattern', () => {
		assertEqualTextQueries(
			queryBuilder.text(
				PATTERN_INFO,
				[ROOT_1_URI],
				{
					excludePattern: [{ pattern: 'foo' }],
					expandPatterns: true
				}
			),
			{
				contentPattern: PATTERN_INFO,
				folderQueries: [{
					folder: ROOT_1_URI
				}],
				type: QueryType.Text,
				excludePattern: patternsToIExpression(...globalGlob('foo'))
			});
	});

	test('file pattern trimming', () => {
		const content = 'content';
		assertEqualQueries(
			queryBuilder.file(
				[],
				{ filePattern: ` ${content} ` }
			),
			{
				folderQueries: [],
				filePattern: content,
				type: QueryType.File
			});
	});

	test('exclude ./ syntax', () => {
		assertEqualTextQueries(
			queryBuilder.text(
				PATTERN_INFO,
				[ROOT_1_URI],
				{
					excludePattern: [{ pattern: './bar' }],
					expandPatterns: true
				}
			),
			{
				contentPattern: PATTERN_INFO,
				folderQueries: [{
					folder: ROOT_1_URI,
					excludePattern: makeExcludePatternFromPatterns('bar', 'bar/**'),
				}],
				type: QueryType.Text
			});

		assertEqualTextQueries(
			queryBuilder.text(
				PATTERN_INFO,
				[ROOT_1_URI],
				{
					excludePattern: [{ pattern: './bar/**/*.ts' }],
					expandPatterns: true
				}
			),
			{
				contentPattern: PATTERN_INFO,
				folderQueries: [{
					folder: ROOT_1_URI,
					excludePattern: makeExcludePatternFromPatterns('bar/**/*.ts', 'bar/**/*.ts/**'),
				}],
				type: QueryType.Text
			});

		assertEqualTextQueries(
			queryBuilder.text(
				PATTERN_INFO,
				[ROOT_1_URI],
				{
					excludePattern: [{ pattern: '.\\bar\\**\\*.ts' }],
					expandPatterns: true
				}
			),
			{
				contentPattern: PATTERN_INFO,
				folderQueries: [{
					folder: ROOT_1_URI,
					excludePattern: makeExcludePatternFromPatterns('bar/**/*.ts', 'bar/**/*.ts/**'),
				}],
				type: QueryType.Text
			});
	});

	test('extraFileResources', () => {
		assertEqualTextQueries(
			queryBuilder.text(
				PATTERN_INFO,
				[ROOT_1_URI],
				{ extraFileResources: [getUri('/foo/bar.js')] }
			),
			{
				contentPattern: PATTERN_INFO,
				folderQueries: [{
					folder: ROOT_1_URI
				}],
				extraFileResources: [getUri('/foo/bar.js')],
				type: QueryType.Text
			});

		assertEqualTextQueries(
			queryBuilder.text(
				PATTERN_INFO,
				[ROOT_1_URI],
				{
					extraFileResources: [getUri('/foo/bar.js')],
					excludePattern: [{ pattern: '*.js' }],
					expandPatterns: true
				}
			),
			{
				contentPattern: PATTERN_INFO,
				folderQueries: [{
					folder: ROOT_1_URI
				}],
				excludePattern: patternsToIExpression(...globalGlob('*.js')),
				type: QueryType.Text
			});

		assertEqualTextQueries(
			queryBuilder.text(
				PATTERN_INFO,
				[ROOT_1_URI],
				{
					extraFileResources: [getUri('/foo/bar.js')],
					includePattern: '*.txt',
					expandPatterns: true
				}
			),
			{
				contentPattern: PATTERN_INFO,
				folderQueries: [{
					folder: ROOT_1_URI
				}],
				includePattern: patternsToIExpression(...globalGlob('*.txt')),
				type: QueryType.Text
			});
	});

	suite('parseSearchPaths 1', () => {
		test('simple includes', () => {
			function testSimpleIncludes(includePattern: string, expectedPatterns: string[]): void {
				const result = queryBuilder.parseSearchPaths(includePattern);
				assert.deepStrictEqual(
					{ ...result.pattern },
					patternsToIExpression(...expectedPatterns),
					includePattern);
				assert.strictEqual(result.searchPaths, undefined);
			}

			[
				['a', ['**/a/**', '**/a']],
				['a/b', ['**/a/b', '**/a/b/**']],
				['a/b,  c', ['**/a/b', '**/c', '**/a/b/**', '**/c/**']],
				['a,.txt', ['**/a', '**/a/**', '**/*.txt', '**/*.txt/**']],
				['a,,,b', ['**/a', '**/a/**', '**/b', '**/b/**']],
				['**/a,b/**', ['**/a', '**/a/**', '**/b/**']]
			].forEach(([includePattern, expectedPatterns]) => testSimpleIncludes(<string>includePattern, <string[]>expectedPatterns));
		});

		function testIncludes(includePattern: string, expectedResult: ISearchPathsInfo): void {
			let actual: ISearchPathsInfo;
			try {
				actual = queryBuilder.parseSearchPaths(includePattern);
			} catch (_) {
				actual = { searchPaths: [] };
			}

			assertEqualSearchPathResults(
				actual,
				expectedResult,
				includePattern);
		}

		function testIncludesDataItem([includePattern, expectedResult]: [string, ISearchPathsInfo]): void {
			testIncludes(includePattern, expectedResult);
		}

		test('absolute includes', () => {
			const cases: [string, ISearchPathsInfo][] = [
				[
					fixPath('/foo/bar'),
					{
						searchPaths: [{ searchPath: getUri('/foo/bar') }]
					}
				],
				[
					fixPath('/foo/bar') + ',' + 'a',
					{
						searchPaths: [{ searchPath: getUri('/foo/bar') }],
						pattern: patternsToIExpression(...globalGlob('a'))
					}
				],
				[
					fixPath('/foo/bar') + ',' + fixPath('/1/2'),
					{
						searchPaths: [{ searchPath: getUri('/foo/bar') }, { searchPath: getUri('/1/2') }]
					}
				],
				[
					fixPath('/foo/bar') + ',' + fixPath('/foo/../foo/bar/fooar/..'),
					{
						searchPaths: [{
							searchPath: getUri('/foo/bar')
						}]
					}
				],
				[
					fixPath('/foo/bar/**/*.ts'),
					{
						searchPaths: [{
							searchPath: getUri('/foo/bar'),
							pattern: patternsToIExpression('**/*.ts', '**/*.ts/**')
						}]
					}
				],
				[
					fixPath('/foo/bar/*a/b/c'),
					{
						searchPaths: [{
							searchPath: getUri('/foo/bar'),
							pattern: patternsToIExpression('*a/b/c', '*a/b/c/**')
						}]
					}
				],
				[
					fixPath('/*a/b/c'),
					{
						searchPaths: [{
							searchPath: getUri('/'),
							pattern: patternsToIExpression('*a/b/c', '*a/b/c/**')
						}]
					}
				],
				[
					fixPath('/foo/{b,c}ar'),
					{
						searchPaths: [{
							searchPath: getUri('/foo'),
							pattern: patternsToIExpression('{b,c}ar', '{b,c}ar/**')
						}]
					}
				]
			];
			cases.forEach(testIncludesDataItem);
		});

		test('relative includes w/single root folder', () => {
			const cases: [string, ISearchPathsInfo][] = [
				[
					'./a',
					{
						searchPaths: [{
							searchPath: ROOT_1_URI,
							pattern: patternsToIExpression('a', 'a/**')
						}]
					}
				],
				[
					'./a/',
					{
						searchPaths: [{
							searchPath: ROOT_1_URI,
							pattern: patternsToIExpression('a', 'a/**')
						}]
					}
				],
				[
					'./a/*b/c',
					{
						searchPaths: [{
							searchPath: ROOT_1_URI,
							pattern: patternsToIExpression('a/*b/c', 'a/*b/c/**')
						}]
					}
				],
				[
					'./a/*b/c, ' + fixPath('/project/foo'),
					{
						searchPaths: [
							{
								searchPath: ROOT_1_URI,
								pattern: patternsToIExpression('a/*b/c', 'a/*b/c/**')
							},
							{
								searchPath: getUri('/project/foo')
							}]
					}
				],
				[
					'./a/b/,./c/d',
					{
						searchPaths: [{
							searchPath: ROOT_1_URI,
							pattern: patternsToIExpression('a/b', 'a/b/**', 'c/d', 'c/d/**')
						}]
					}
				],
				[
					'../',
					{
						searchPaths: [{
							searchPath: getUri('/foo')
						}]
					}
				],
				[
					'..',
					{
						searchPaths: [{
							searchPath: getUri('/foo')
						}]
					}
				],
				[
					'..\\bar',
					{
						searchPaths: [{
							searchPath: getUri('/foo/bar')
						}]
					}
				]
			];
			cases.forEach(testIncludesDataItem);
		});

		test('relative includes w/two root folders', () => {
			const ROOT_2 = '/project/root2';
			mockWorkspace.folders = toWorkspaceFolders([{ path: ROOT_1_URI.fsPath }, { path: getUri(ROOT_2).fsPath }], WS_CONFIG_PATH, extUriBiasedIgnorePathCase);
			mockWorkspace.configuration = uri.file(fixPath('config'));

			const cases: [string, ISearchPathsInfo][] = [
				[
					'./root1',
					{
						searchPaths: [{
							searchPath: getUri(ROOT_1)
						}]
					}
				],
				[
					'./root2',
					{
						searchPaths: [{
							searchPath: getUri(ROOT_2),
						}]
					}
				],
				[
					'./root1/a/**/b, ./root2/**/*.txt',
					{
						searchPaths: [
							{
								searchPath: ROOT_1_URI,
								pattern: patternsToIExpression('a/**/b', 'a/**/b/**')
							},
							{
								searchPath: getUri(ROOT_2),
								pattern: patternsToIExpression('**/*.txt', '**/*.txt/**')
							}]
					}
				]
			];
			cases.forEach(testIncludesDataItem);
		});

		test('include ./foldername', () => {
			const ROOT_2 = '/project/root2';
			const ROOT_1_FOLDERNAME = 'foldername';
			mockWorkspace.folders = toWorkspaceFolders([{ path: ROOT_1_URI.fsPath, name: ROOT_1_FOLDERNAME }, { path: getUri(ROOT_2).fsPath }], WS_CONFIG_PATH, extUriBiasedIgnorePathCase);
			mockWorkspace.configuration = uri.file(fixPath('config'));

			const cases: [string, ISearchPathsInfo][] = [
				[
					'./foldername',
					{
						searchPaths: [{
							searchPath: ROOT_1_URI
						}]
					}
				],
				[
					'./foldername/foo',
					{
						searchPaths: [{
							searchPath: ROOT_1_URI,
							pattern: patternsToIExpression('foo', 'foo/**')
						}]
					}
				]
			];
			cases.forEach(testIncludesDataItem);
		});

		test('folder with slash in the name', () => {
			const ROOT_2 = '/project/root2';
			const ROOT_2_URI = getUri(ROOT_2);
			const ROOT_1_FOLDERNAME = 'folder/one';
			const ROOT_2_FOLDERNAME = 'folder/two+'; // And another regex character, #126003
			mockWorkspace.folders = toWorkspaceFolders([{ path: ROOT_1_URI.fsPath, name: ROOT_1_FOLDERNAME }, { path: ROOT_2_URI.fsPath, name: ROOT_2_FOLDERNAME }], WS_CONFIG_PATH, extUriBiasedIgnorePathCase);
			mockWorkspace.configuration = uri.file(fixPath('config'));

			const cases: [string, ISearchPathsInfo][] = [
				[
					'./folder/one',
					{
						searchPaths: [{
							searchPath: ROOT_1_URI
						}]
					}
				],
				[
					'./folder/two+/foo/',
					{
						searchPaths: [{
							searchPath: ROOT_2_URI,
							pattern: patternsToIExpression('foo', 'foo/**')
						}]
					}
				],
				[
					'./folder/onesomethingelse',
					{ searchPaths: [] }
				],
				[
					'./folder/onesomethingelse/foo',
					{ searchPaths: [] }
				],
				[
					'./folder',
					{ searchPaths: [] }
				]
			];
			cases.forEach(testIncludesDataItem);
		});

		test('relative includes w/multiple ambiguous root folders', () => {
			const ROOT_2 = '/project/rootB';
			const ROOT_3 = '/otherproject/rootB';
			mockWorkspace.folders = toWorkspaceFolders([{ path: ROOT_1_URI.fsPath }, { path: getUri(ROOT_2).fsPath }, { path: getUri(ROOT_3).fsPath }], WS_CONFIG_PATH, extUriBiasedIgnorePathCase);
			mockWorkspace.configuration = uri.file(fixPath('/config'));

			const cases: [string, ISearchPathsInfo][] = [
				[
					'',
					{
						searchPaths: undefined
					}
				],
				[
					'./',
					{
						searchPaths: undefined
					}
				],
				[
					'./root1',
					{
						searchPaths: [{
							searchPath: getUri(ROOT_1)
						}]
					}
				],
				[
					'./root1,./',
					{
						searchPaths: [{
							searchPath: getUri(ROOT_1)
						}]
					}
				],
				[
					'./rootB',
					{
						searchPaths: [
							{
								searchPath: getUri(ROOT_2),
							},
							{
								searchPath: getUri(ROOT_3),
							}]
					}
				],
				[
					'./rootB/a/**/b, ./rootB/b/**/*.txt',
					{
						searchPaths: [
							{
								searchPath: getUri(ROOT_2),
								pattern: patternsToIExpression('a/**/b', 'a/**/b/**', 'b/**/*.txt', 'b/**/*.txt/**')
							},
							{
								searchPath: getUri(ROOT_3),
								pattern: patternsToIExpression('a/**/b', 'a/**/b/**', 'b/**/*.txt', 'b/**/*.txt/**')
							}]
					}
				],
				[
					'./root1/**/foo/, bar/',
					{
						pattern: patternsToIExpression('**/bar', '**/bar/**'),
						searchPaths: [
							{
								searchPath: ROOT_1_URI,
								pattern: patternsToIExpression('**/foo', '**/foo/**')
							}]
					}
				]
			];
			cases.forEach(testIncludesDataItem);
		});
	});

	suite('parseSearchPaths 2', () => {

		function testIncludes(includePattern: string, expectedResult: ISearchPathsInfo): void {
			assertEqualSearchPathResults(
				queryBuilder.parseSearchPaths(includePattern),
				expectedResult,
				includePattern);
		}

		function testIncludesDataItem([includePattern, expectedResult]: [string, ISearchPathsInfo]): void {
			testIncludes(includePattern, expectedResult);
		}

		(isWindows ? test.skip : test)('includes with tilde', () => {
			const userHome = URI.file('/');
			const cases: [string, ISearchPathsInfo][] = [
				[
					'~/foo/bar',
					{
						searchPaths: [{ searchPath: getUri(userHome.fsPath, '/foo/bar') }]
					}
				],
				[
					'~/foo/bar, a',
					{
						searchPaths: [{ searchPath: getUri(userHome.fsPath, '/foo/bar') }],
						pattern: patternsToIExpression(...globalGlob('a'))
					}
				],
				[
					fixPath('/foo/~/bar'),
					{
						searchPaths: [{ searchPath: getUri('/foo/~/bar') }]
					}
				],
			];
			cases.forEach(testIncludesDataItem);
		});
	});

	suite('smartCase', () => {
		test('no flags -> no change', () => {
			const query = queryBuilder.text(
				{
					pattern: 'a'
				},
				[]);

			assert(!query.contentPattern.isCaseSensitive);
		});

		test('maintains isCaseSensitive when smartCase not set', () => {
			const query = queryBuilder.text(
				{
					pattern: 'a',
					isCaseSensitive: true
				},
				[]);

			assert(query.contentPattern.isCaseSensitive);
		});

		test('maintains isCaseSensitive when smartCase set', () => {
			const query = queryBuilder.text(
				{
					pattern: 'a',
					isCaseSensitive: true
				},
				[],
				{
					isSmartCase: true
				});

			assert(query.contentPattern.isCaseSensitive);
		});

		test('smartCase determines not case sensitive', () => {
			const query = queryBuilder.text(
				{
					pattern: 'abcd'
				},
				[],
				{
					isSmartCase: true
				});

			assert(!query.contentPattern.isCaseSensitive);
		});

		test('smartCase determines case sensitive', () => {
			const query = queryBuilder.text(
				{
					pattern: 'abCd'
				},
				[],
				{
					isSmartCase: true
				});

			assert(query.contentPattern.isCaseSensitive);
		});

		test('smartCase determines not case sensitive (regex)', () => {
			const query = queryBuilder.text(
				{
					pattern: 'ab\\Sd',
					isRegExp: true
				},
				[],
				{
					isSmartCase: true
				});

			assert(!query.contentPattern.isCaseSensitive);
		});

		test('smartCase determines case sensitive (regex)', () => {
			const query = queryBuilder.text(
				{
					pattern: 'ab[A-Z]d',
					isRegExp: true
				},
				[],
				{
					isSmartCase: true
				});

			assert(query.contentPattern.isCaseSensitive);
		});
	});

	suite('file', () => {
		test('simple file query', () => {
			const cacheKey = 'asdf';
			const query = queryBuilder.file(
				[ROOT_1_NAMED_FOLDER],
				{
					cacheKey,
					sortByScore: true
				},
			);

			assert.strictEqual(query.folderQueries.length, 1);
			assert.strictEqual(query.cacheKey, cacheKey);
			assert(query.sortByScore);
		});
	});

	suite('pattern processing', () => {
		test('text query with comma-separated includes with no workspace', () => {
			const query = queryBuilder.text(
				{ pattern: `` },
				[],
				{
					includePattern: '*.js,*.ts',
					expandPatterns: true
				}
			);
			assert.deepEqual(query.includePattern, {
				'**/*.js/**': true,
				'**/*.js': true,
				'**/*.ts/**': true,
				'**/*.ts': true,
			});
			assert.strictEqual(query.folderQueries.length, 0);
		});
		test('text query with comma-separated includes with workspace', () => {
			const query = queryBuilder.text(
				{ pattern: `` },
				[ROOT_1_URI],
				{
					includePattern: '*.js,*.ts',
					expandPatterns: true
				}
			);
			assert.deepEqual(query.includePattern, {
				'**/*.js/**': true,
				'**/*.js': true,
				'**/*.ts/**': true,
				'**/*.ts': true,
			});
			assert.strictEqual(query.folderQueries.length, 1);
		});
		test('text query with comma-separated excludes globally', () => {
			const query = queryBuilder.text(
				{ pattern: `` },
				[],
				{
					excludePattern: [{ pattern: '*.js,*.ts' }],
					expandPatterns: true
				}
			);
			assert.deepEqual(query.excludePattern, {
				'**/*.js/**': true,
				'**/*.js': true,
				'**/*.ts/**': true,
				'**/*.ts': true,
			});
			assert.strictEqual(query.folderQueries.length, 0);
		});
		test('text query with comma-separated excludes globally in a workspace', () => {
			const query = queryBuilder.text(
				{ pattern: `` },
				[ROOT_1_NAMED_FOLDER.uri],
				{
					excludePattern: [{ pattern: '*.js,*.ts' }],
					expandPatterns: true
				}
			);
			assert.deepEqual(query.excludePattern, {
				'**/*.js/**': true,
				'**/*.js': true,
				'**/*.ts/**': true,
				'**/*.ts': true,
			});
			assert.strictEqual(query.folderQueries.length, 1);
		});
		test.skip('text query with multiple comma-separated excludes', () => {
			// TODO: Fix. Will require `ICommonQueryProps.excludePattern` to support an array.
			const query = queryBuilder.text(
				{ pattern: `` },
				[ROOT_1_NAMED_FOLDER.uri],
				{
					excludePattern: [{ pattern: '*.js,*.ts' }, { pattern: 'foo/*,bar/*' }],
					expandPatterns: true
				}
			);
			assert.deepEqual(query.excludePattern, [
				{

					'**/*.js/**': true,
					'**/*.js': true,
					'**/*.ts/**': true,
					'**/*.ts': true,
				},
				{
					'**/foo/*/**': true,
					'**/foo/*': true,
					'**/bar/*/**': true,
					'**/bar/*': true,
				}
			]);
			assert.strictEqual(query.folderQueries.length, 1);
		});
		test.skip('text query with base URI on exclud', () => {
			// TODO: Fix. Will require `ICommonQueryProps.excludePattern` to support an baseURI.
			const query = queryBuilder.text(
				{ pattern: `` },
				[ROOT_1_NAMED_FOLDER.uri],
				{
					excludePattern: [{ uri: ROOT_1_URI, pattern: '*.js,*.ts' }],
					expandPatterns: true
				}
			);
			// todo: incorporate the base URI into the pattern
			assert.deepEqual(query.excludePattern, {
				uri: ROOT_1_URI,
				pattern: {
					'**/*.js/**': true,
					'**/*.js': true,
					'**/*.ts/**': true,
					'**/*.ts': true,
				}
			});
			assert.strictEqual(query.folderQueries.length, 1);
		});
	});
});
function makeExcludePatternFromPatterns(...patterns: string[]): {
	pattern: IExpression;
}[] | undefined {
	const pattern = patternsToIExpression(...patterns);
	return pattern ? [{ pattern }] : undefined;
}

function assertEqualTextQueries(actual: ITextQuery, expected: ITextQuery): void {
	expected = {
		...DEFAULT_TEXT_QUERY_PROPS,
		...expected
	};

	return assertEqualQueries(actual, expected);
}

export function assertEqualQueries(actual: ITextQuery | IFileQuery, expected: ITextQuery | IFileQuery): void {
	expected = {
		...DEFAULT_QUERY_PROPS,
		...expected
	};

	const folderQueryToCompareObject = (fq: IFolderQuery) => {
		const excludePattern = fq.excludePattern?.map(e => normalizeExpression(e.pattern));
		return {
			path: fq.folder.fsPath,
			excludePattern: excludePattern?.length ? excludePattern : undefined,
			includePattern: normalizeExpression(fq.includePattern),
			fileEncoding: fq.fileEncoding
		};
	};

	// Avoid comparing URI objects, not a good idea
	if (expected.folderQueries) {
		assert.deepStrictEqual(actual.folderQueries.map(folderQueryToCompareObject), expected.folderQueries.map(folderQueryToCompareObject));
		actual.folderQueries = [];
		expected.folderQueries = [];
	}

	if (expected.extraFileResources) {
		assert.deepStrictEqual(actual.extraFileResources!.map(extraFile => extraFile.fsPath), expected.extraFileResources.map(extraFile => extraFile.fsPath));
		delete expected.extraFileResources;
		delete actual.extraFileResources;
	}

	delete actual.usingSearchPaths;
	actual.includePattern = normalizeExpression(actual.includePattern);
	actual.excludePattern = normalizeExpression(actual.excludePattern);
	cleanUndefinedQueryValues(actual);

	assert.deepStrictEqual(actual, expected);
}

export function assertEqualSearchPathResults(actual: ISearchPathsInfo, expected: ISearchPathsInfo, message?: string): void {
	cleanUndefinedQueryValues(actual);
	assert.deepStrictEqual({ ...actual.pattern }, { ...expected.pattern }, message);

	assert.strictEqual(actual.searchPaths && actual.searchPaths.length, expected.searchPaths && expected.searchPaths.length);
	if (actual.searchPaths) {
		actual.searchPaths.forEach((searchPath, i) => {
			const expectedSearchPath = expected.searchPaths![i];
			assert.deepStrictEqual(searchPath.pattern && { ...searchPath.pattern }, expectedSearchPath.pattern);
			assert.strictEqual(searchPath.searchPath.toString(), expectedSearchPath.searchPath.toString());
		});
	}
}

/**
 * Recursively delete all undefined property values from the search query, to make it easier to
 * assert.deepStrictEqual with some expected object.
 */
export function cleanUndefinedQueryValues(q: any): void {
	for (const key in q) {
		if (q[key] === undefined) {
			delete q[key];
		} else if (typeof q[key] === 'object') {
			cleanUndefinedQueryValues(q[key]);
		}
	}

	return q;
}

export function globalGlob(pattern: string): string[] {
	return [
		`**/${pattern}/**`,
		`**/${pattern}`
	];
}

export function patternsToIExpression(...patterns: string[]): IExpression | undefined {
	return patterns.length ?
		patterns.reduce((glob, cur) => { glob[cur] = true; return glob; }, {} as IExpression) :
		undefined;
}

export function getUri(...slashPathParts: string[]): uri {
	return uri.file(fixPath(...slashPathParts));
}

export function fixPath(...slashPathParts: string[]): string {
	if (isWindows && slashPathParts.length && !slashPathParts[0].match(/^c:/i)) {
		slashPathParts.unshift('c:');
	}

	return join(...slashPathParts);
}

export function normalizeExpression(expression: IExpression | undefined): IExpression | undefined {
	if (!expression) {
		return expression;
	}

	const normalized: IExpression = {};
	Object.keys(expression).forEach(key => {
		normalized[key.replace(/\\/g, '/')] = expression[key];
	});

	return normalized;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/search/test/common/folderQuerySearchTree.test.ts]---
Location: vscode-main/src/vs/workbench/services/search/test/common/folderQuerySearchTree.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import assert from 'assert';
import { FolderQuerySearchTree } from '../../common/folderQuerySearchTree.js';
import { IFolderQuery } from '../../common/search.js';

suite('FolderQuerySearchTree', () => {
	ensureNoDisposablesAreLeakedInTestSuite();
	const fq1 = { folder: URI.parse('file:///folder1?query1#fragment1') };
	const fq2 = { folder: URI.parse('file:///folder2?query2#fragment2') };
	const fq3 = { folder: URI.parse('file:///folder3?query3#fragment3') };
	const fq4 = { folder: URI.parse('file:///folder3?query3') };
	const fq5 = { folder: URI.parse('file:///folder3') };

	const folderQueries: IFolderQuery<URI>[] = [
		fq1,
		fq2,
		fq3,
		fq4,
		fq5,
	];

	const getFolderQueryInfo = (fq: IFolderQuery<URI>, i: number) => ({ folder: fq.folder, index: i });

	test('find query fragment aware substr correctly', () => {
		const tree = new FolderQuerySearchTree(folderQueries, getFolderQueryInfo);
		const result = tree.findQueryFragmentAwareSubstr(fq1.folder);
		const result2 = tree.findQueryFragmentAwareSubstr(URI.parse('file:///folder1/foo/bar?query1#fragment1'));
		assert.deepStrictEqual(result, { folder: fq1.folder, index: 0 });
		assert.deepStrictEqual(result2, { folder: fq1.folder, index: 0 });
	});

	test('do not to URIs that do not have queries if the base has query', () => {
		const tree = new FolderQuerySearchTree(folderQueries, getFolderQueryInfo);
		const result = tree.findQueryFragmentAwareSubstr(URI.parse('file:///folder1'));
		const result2 = tree.findQueryFragmentAwareSubstr(URI.parse('file:///folder1?query1'));
		assert.deepStrictEqual(result, undefined);
		assert.deepStrictEqual(result2, undefined);
	});

	test('match correct entry with query/fragment', () => {
		const tree = new FolderQuerySearchTree(folderQueries, getFolderQueryInfo);
		const result = tree.findQueryFragmentAwareSubstr(URI.parse('file:///folder3/file.txt?query3#fragment3'));
		assert.deepStrictEqual(result, { folder: fq3.folder, index: 2 });

		const result2 = tree.findQueryFragmentAwareSubstr(URI.parse('file:///folder3/file.txt?query3'));
		assert.deepStrictEqual(result2, { folder: fq4.folder, index: 3 });

		const result3 = tree.findQueryFragmentAwareSubstr(URI.parse('file:///folder3/file.txt'));
		assert.deepStrictEqual(result3, { folder: fq5.folder, index: 4 });
	});

	test('can find substr of non-query/fragment URIs', () => {
		const tree = new FolderQuerySearchTree(folderQueries, getFolderQueryInfo);
		const result = tree.findQueryFragmentAwareSubstr(fq5.folder);
		const result2 = tree.findQueryFragmentAwareSubstr(URI.parse('file:///folder3/hello/world'));
		assert.deepStrictEqual(result, { folder: fq5.folder, index: 4 });
		assert.deepStrictEqual(result2, { folder: fq5.folder, index: 4 });
	});

	test('iterate over all folderQueryInfo correctly', () => {
		const tree = new FolderQuerySearchTree(folderQueries, getFolderQueryInfo);
		const results: any[] = [];
		tree.forEachFolderQueryInfo(info => results.push(info));
		assert.equal(results.length, 5);
		assert.deepStrictEqual(results, folderQueries.map((fq, i) => getFolderQueryInfo(fq, i)));
	});


	test('`/` as a path', () => {
		const trie = new FolderQuerySearchTree([{ folder: URI.parse('memfs:/?q=1') }], getFolderQueryInfo);

		assert.deepStrictEqual(trie.findQueryFragmentAwareSubstr(URI.parse('memfs:/file.txt?q=1')), { folder: URI.parse('memfs:/?q=1'), index: 0 });
	});
});
```

--------------------------------------------------------------------------------

````

---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 450
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 450 of 552)

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

---[FILE: src/vs/workbench/contrib/searchEditor/browser/searchEditorSerialization.ts]---
Location: vscode-main/src/vs/workbench/contrib/searchEditor/browser/searchEditorSerialization.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { coalesce } from '../../../../base/common/arrays.js';
import { URI } from '../../../../base/common/uri.js';
import './media/searchEditor.css';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { Range } from '../../../../editor/common/core/range.js';
import type { ITextModel } from '../../../../editor/common/model.js';
import { localize } from '../../../../nls.js';
import type { SearchConfiguration } from './constants.js';
import { ITextQuery, SearchSortOrder } from '../../../services/search/common/search.js';
import { ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { ISearchTreeMatch, ISearchTreeFileMatch, ISearchResult, ISearchTreeFolderMatch } from '../../search/browser/searchTreeModel/searchTreeCommon.js';
import { searchMatchComparer } from '../../search/browser/searchCompare.js';
import { ICellMatch, isNotebookFileMatch } from '../../search/browser/notebookSearch/notebookSearchModelBase.js';

// Using \r\n on Windows inserts an extra newline between results.
const lineDelimiter = '\n';

const translateRangeLines =
	(n: number) =>
		(range: Range) =>
			new Range(range.startLineNumber + n, range.startColumn, range.endLineNumber + n, range.endColumn);

const matchToSearchResultFormat = (match: ISearchTreeMatch, longestLineNumber: number): { line: string; ranges: Range[]; lineNumber: string }[] => {
	const getLinePrefix = (i: number) => `${match.range().startLineNumber + i}`;

	const fullMatchLines = match.fullPreviewLines();


	const results: { line: string; ranges: Range[]; lineNumber: string }[] = [];

	fullMatchLines
		.forEach((sourceLine, i) => {
			const lineNumber = getLinePrefix(i);
			const paddingStr = ' '.repeat(longestLineNumber - lineNumber.length);
			const prefix = `  ${paddingStr}${lineNumber}: `;
			const prefixOffset = prefix.length;

			// split instead of replace to avoid creating a new string object
			const line = prefix + (sourceLine.split(/\r?\n?$/, 1)[0] || '');

			const rangeOnThisLine = ({ start, end }: { start?: number; end?: number }) => new Range(1, (start ?? 1) + prefixOffset, 1, (end ?? sourceLine.length + 1) + prefixOffset);

			const matchRange = match.rangeInPreview();
			const matchIsSingleLine = matchRange.startLineNumber === matchRange.endLineNumber;

			let lineRange;
			if (matchIsSingleLine) { lineRange = (rangeOnThisLine({ start: matchRange.startColumn, end: matchRange.endColumn })); }
			else if (i === 0) { lineRange = (rangeOnThisLine({ start: matchRange.startColumn })); }
			else if (i === fullMatchLines.length - 1) { lineRange = (rangeOnThisLine({ end: matchRange.endColumn })); }
			else { lineRange = (rangeOnThisLine({})); }

			results.push({ lineNumber: lineNumber, line, ranges: [lineRange] });
		});

	return results;
};

type SearchResultSerialization = { text: string[]; matchRanges: Range[] };

function fileMatchToSearchResultFormat(fileMatch: ISearchTreeFileMatch, labelFormatter: (x: URI) => string): SearchResultSerialization[] {

	const textSerializations = fileMatch.textMatches().length > 0 ? matchesToSearchResultFormat(fileMatch.resource, fileMatch.textMatches().sort(searchMatchComparer), fileMatch.context, labelFormatter) : undefined;
	const cellSerializations = (isNotebookFileMatch(fileMatch)) ? fileMatch.cellMatches().sort((a, b) => a.cellIndex - b.cellIndex).sort().filter(cellMatch => cellMatch.contentMatches.length > 0).map((cellMatch, index) => cellMatchToSearchResultFormat(cellMatch, labelFormatter, index === 0)) : [];

	return [textSerializations, ...cellSerializations].filter(x => !!x) as SearchResultSerialization[];
}
function matchesToSearchResultFormat(resource: URI, sortedMatches: ISearchTreeMatch[], matchContext: Map<number, string>, labelFormatter: (x: URI) => string, shouldUseHeader = true): SearchResultSerialization {
	const longestLineNumber = sortedMatches[sortedMatches.length - 1].range().endLineNumber.toString().length;

	const text: string[] = shouldUseHeader ? [`${labelFormatter(resource)}:`] : [];
	const matchRanges: Range[] = [];

	const targetLineNumberToOffset: Record<string, number> = {};

	const context: { line: string; lineNumber: number }[] = [];
	matchContext.forEach((line, lineNumber) => context.push({ line, lineNumber }));
	context.sort((a, b) => a.lineNumber - b.lineNumber);

	let lastLine: number | undefined = undefined;

	const seenLines = new Set<string>();
	sortedMatches.forEach(match => {
		matchToSearchResultFormat(match, longestLineNumber).forEach(match => {
			if (!seenLines.has(match.lineNumber)) {
				while (context.length && context[0].lineNumber < +match.lineNumber) {
					const { line, lineNumber } = context.shift()!;
					if (lastLine !== undefined && lineNumber !== lastLine + 1) {
						text.push('');
					}
					text.push(`  ${' '.repeat(longestLineNumber - `${lineNumber}`.length)}${lineNumber}  ${line}`);
					lastLine = lineNumber;
				}

				targetLineNumberToOffset[match.lineNumber] = text.length;
				seenLines.add(match.lineNumber);
				text.push(match.line);
				lastLine = +match.lineNumber;
			}

			matchRanges.push(...match.ranges.map(translateRangeLines(targetLineNumberToOffset[match.lineNumber])));
		});
	});

	while (context.length) {
		const { line, lineNumber } = context.shift()!;
		text.push(`  ${lineNumber}  ${line}`);
	}

	return { text, matchRanges };
}

function cellMatchToSearchResultFormat(cellMatch: ICellMatch, labelFormatter: (x: URI) => string, shouldUseHeader: boolean): SearchResultSerialization {
	return matchesToSearchResultFormat(cellMatch.cell?.uri ?? cellMatch.parent.resource, cellMatch.contentMatches.sort(searchMatchComparer), cellMatch.context, labelFormatter, shouldUseHeader);
}

const contentPatternToSearchConfiguration = (pattern: ITextQuery, includes: string, excludes: string, contextLines: number): SearchConfiguration => {
	return {
		query: pattern.contentPattern.pattern,
		isRegexp: !!pattern.contentPattern.isRegExp,
		isCaseSensitive: !!pattern.contentPattern.isCaseSensitive,
		matchWholeWord: !!pattern.contentPattern.isWordMatch,
		filesToExclude: excludes, filesToInclude: includes,
		showIncludesExcludes: !!(includes || excludes || pattern?.userDisabledExcludesAndIgnoreFiles),
		useExcludeSettingsAndIgnoreFiles: (pattern?.userDisabledExcludesAndIgnoreFiles === undefined ? true : !pattern.userDisabledExcludesAndIgnoreFiles),
		contextLines,
		onlyOpenEditors: !!pattern.onlyOpenEditors,
		notebookSearchConfig: {
			includeMarkupInput: !!pattern.contentPattern.notebookInfo?.isInNotebookMarkdownInput,
			includeMarkupPreview: !!pattern.contentPattern.notebookInfo?.isInNotebookMarkdownPreview,
			includeCodeInput: !!pattern.contentPattern.notebookInfo?.isInNotebookCellInput,
			includeOutput: !!pattern.contentPattern.notebookInfo?.isInNotebookCellOutput,
		}
	};
};

export const serializeSearchConfiguration = (config: Partial<SearchConfiguration>): string => {
	const removeNullFalseAndUndefined = <T>(a: (T | null | false | undefined)[]) => a.filter(a => a !== false && a !== null && a !== undefined) as T[];

	const escapeNewlines = (str: string) => str.replace(/\\/g, '\\\\').replace(/\n/g, '\\n');

	return removeNullFalseAndUndefined([
		`# Query: ${escapeNewlines(config.query ?? '')}`,

		(config.isCaseSensitive || config.matchWholeWord || config.isRegexp || config.useExcludeSettingsAndIgnoreFiles === false)
		&& `# Flags: ${coalesce([
			config.isCaseSensitive && 'CaseSensitive',
			config.matchWholeWord && 'WordMatch',
			config.isRegexp && 'RegExp',
			config.onlyOpenEditors && 'OpenEditors',
			(config.useExcludeSettingsAndIgnoreFiles === false) && 'IgnoreExcludeSettings'
		]).join(' ')}`,
		config.filesToInclude ? `# Including: ${config.filesToInclude}` : undefined,
		config.filesToExclude ? `# Excluding: ${config.filesToExclude}` : undefined,
		config.contextLines ? `# ContextLines: ${config.contextLines}` : undefined,
		''
	]).join(lineDelimiter);
};

export const extractSearchQueryFromModel = (model: ITextModel): SearchConfiguration =>
	extractSearchQueryFromLines(model.getValueInRange(new Range(1, 1, 6, 1)).split(lineDelimiter));

export const defaultSearchConfig = (): SearchConfiguration => ({
	query: '',
	filesToInclude: '',
	filesToExclude: '',
	isRegexp: false,
	isCaseSensitive: false,
	useExcludeSettingsAndIgnoreFiles: true,
	matchWholeWord: false,
	contextLines: 0,
	showIncludesExcludes: false,
	onlyOpenEditors: false,
	notebookSearchConfig: {
		includeMarkupInput: true,
		includeMarkupPreview: false,
		includeCodeInput: true,
		includeOutput: true,
	}
});

export const extractSearchQueryFromLines = (lines: string[]): SearchConfiguration => {

	const query = defaultSearchConfig();

	const unescapeNewlines = (str: string) => {
		let out = '';
		for (let i = 0; i < str.length; i++) {
			if (str[i] === '\\') {
				i++;
				const escaped = str[i];

				if (escaped === 'n') {
					out += '\n';
				}
				else if (escaped === '\\') {
					out += '\\';
				}
				else {
					throw Error(localize('invalidQueryStringError', "All backslashes in Query string must be escaped (\\\\)"));
				}
			} else {
				out += str[i];
			}
		}
		return out;
	};

	const parseYML = /^# ([^:]*): (.*)$/;
	for (const line of lines) {
		const parsed = parseYML.exec(line);
		if (!parsed) { continue; }
		const [, key, value] = parsed;
		switch (key) {
			case 'Query': query.query = unescapeNewlines(value); break;
			case 'Including': query.filesToInclude = value; break;
			case 'Excluding': query.filesToExclude = value; break;
			case 'ContextLines': query.contextLines = +value; break;
			case 'Flags': {
				query.isRegexp = value.indexOf('RegExp') !== -1;
				query.isCaseSensitive = value.indexOf('CaseSensitive') !== -1;
				query.useExcludeSettingsAndIgnoreFiles = value.indexOf('IgnoreExcludeSettings') === -1;
				query.matchWholeWord = value.indexOf('WordMatch') !== -1;
				query.onlyOpenEditors = value.indexOf('OpenEditors') !== -1;
			}
		}
	}

	query.showIncludesExcludes = !!(query.filesToInclude || query.filesToExclude || !query.useExcludeSettingsAndIgnoreFiles);

	return query;
};

export const serializeSearchResultForEditor =
	(searchResult: ISearchResult, rawIncludePattern: string, rawExcludePattern: string, contextLines: number, labelFormatter: (x: URI) => string, sortOrder: SearchSortOrder, limitHit?: boolean): { matchRanges: Range[]; text: string; config: Partial<SearchConfiguration> } => {
		if (!searchResult.query) { throw Error('Internal Error: Expected query, got null'); }
		const config = contentPatternToSearchConfiguration(searchResult.query, rawIncludePattern, rawExcludePattern, contextLines);

		const filecount = searchResult.fileCount() > 1 ? localize('numFiles', "{0} files", searchResult.fileCount()) : localize('oneFile', "1 file");
		const resultcount = searchResult.count() > 1 ? localize('numResults', "{0} results", searchResult.count()) : localize('oneResult', "1 result");

		const info = [
			searchResult.count()
				? `${resultcount} - ${filecount}`
				: localize('noResults', "No Results"),
		];
		if (limitHit) {
			info.push(localize('searchMaxResultsWarning', "The result set only contains a subset of all matches. Be more specific in your search to narrow down the results."));
		}
		info.push('');

		const matchComparer = (a: ISearchTreeFileMatch | ISearchTreeFolderMatch, b: ISearchTreeFileMatch | ISearchTreeFolderMatch) => searchMatchComparer(a, b, sortOrder);

		const allResults =
			flattenSearchResultSerializations(
				searchResult.folderMatches().sort(matchComparer)
					.map(folderMatch => folderMatch.allDownstreamFileMatches().sort(matchComparer)
						.flatMap(fileMatch => fileMatchToSearchResultFormat(fileMatch, labelFormatter))).flat());

		return {
			matchRanges: allResults.matchRanges.map(translateRangeLines(info.length)),
			text: info.concat(allResults.text).join(lineDelimiter),
			config
		};
	};

const flattenSearchResultSerializations = (serializations: SearchResultSerialization[]): SearchResultSerialization => {
	const text: string[] = [];
	const matchRanges: Range[] = [];

	serializations.forEach(serialized => {
		serialized.matchRanges.map(translateRangeLines(text.length)).forEach(range => matchRanges.push(range));
		serialized.text.forEach(line => text.push(line));
		text.push(''); // new line
	});

	return { text, matchRanges };
};

export const parseSavedSearchEditor = async (accessor: ServicesAccessor, resource: URI) => {
	const textFileService = accessor.get(ITextFileService);

	const text = (await textFileService.read(resource)).value;
	return parseSerializedSearchEditor(text);
};

export const parseSerializedSearchEditor = (text: string) => {
	const headerlines = [];
	const bodylines = [];

	let inHeader = true;
	for (const line of text.split(/\r?\n/g)) {
		if (inHeader) {
			headerlines.push(line);
			if (line === '') {
				inHeader = false;
			}
		} else {
			bodylines.push(line);
		}
	}

	return { config: extractSearchQueryFromLines(headerlines), text: bodylines.join('\n') };
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/searchEditor/browser/media/searchEditor.css]---
Location: vscode-main/src/vs/workbench/contrib/searchEditor/browser/media/searchEditor.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.search-editor {
	display: flex;
	flex-direction: column;
}

.search-editor .search-results {
	flex: 1;
}

.search-editor .query-container {
	margin: 0px 12px 12px 19px;
	padding-top: 6px;
}

.search-editor .search-widget .toggle-replace-button {
	position: absolute;
	top: 0;
	left: 0;
	width: 16px;
	height: 100%;
	box-sizing: border-box;
	background-position: center center;
	background-repeat: no-repeat;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
}

.search-editor .search-widget .search-container,
.search-editor .search-widget .replace-container {
	display: flex;
	align-items: center;
}

.search-editor .search-widget .monaco-findInput {
	display: inline-block;
	vertical-align: middle;
	width: 100%;
}

.search-editor .search-widget .monaco-inputbox > .ibwrapper {
	height: 100%;
}

.search-editor .search-widget .monaco-inputbox > .ibwrapper > .mirror,
.search-editor .search-widget .monaco-inputbox > .ibwrapper > textarea.input {
	padding: 3px;
	padding-left: 6px;
}

.search-editor .search-widget .monaco-inputbox > .ibwrapper > .mirror {
	max-height: 134px;
}

/* NOTE: height is also used in searchWidget.ts as a constant*/
.search-editor .search-widget .monaco-inputbox > .ibwrapper > textarea.input {
	overflow: initial;
	height: 26px; /* set initial height before measure */
}

.search-editor .monaco-inputbox > .ibwrapper > textarea.input {
	scrollbar-width: none; /* Firefox: hide scrollbar */
}

.search-editor .monaco-inputbox > .ibwrapper > textarea.input::-webkit-scrollbar {
	display: none;
}

.search-editor .search-widget .context-lines-input {
	margin-left: 5px;
	margin-right: 2px;
	max-width: 50px;
}

.search-editor .search-widget .context-lines-input input[type=number]::-webkit-inner-spin-button {
	/* Hide arrow button that shows in type=number fields */
	-webkit-appearance: none !important;
}

.search-editor .search-widget .replace-container {
	margin-top: 6px;
	position: relative;
	display: inline-flex;
}

.search-editor .search-widget .replace-input {
	position: relative;
	display: flex;
	vertical-align: middle;
	width: auto !important;
	height: 25px;
}

.search-editor .search-widget .replace-input > .controls {
	position: absolute;
	top: 3px;
	right: 2px;
}

.search-editor .search-widget .replace-container.disabled {
	display: none;
}

.search-editor .search-widget .replace-container .monaco-action-bar {
	margin-left: 0;
}

.search-editor .search-widget .replace-container .monaco-action-bar {
	height: 25px;
}

.search-editor .search-widget .replace-container .monaco-action-bar .action-item .codicon {
	background-repeat: no-repeat;
	width: 25px;
	height: 25px;
	margin-right: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.search-editor .includes-excludes {
	min-height: 1em;
	position: relative;
}

.search-editor .includes-excludes .expand {
	position: absolute;
	right: -2px;
	cursor: pointer;
	width: 25px;
	height: 16px;
	z-index: 2; /* Force it above the search results message, which has a negative top margin */
}

.search-editor .includes-excludes .file-types {
	display: none;
}

.search-editor .includes-excludes.expanded .file-types {
	display: inherit;
}

.search-editor .includes-excludes.expanded .file-types:last-child {
	padding-bottom: 10px;
}

.search-editor .includes-excludes.expanded h4 {
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	padding: 4px 0 0;
	margin: 0;
	font-size: 11px;
	font-weight: normal;
}

.search-editor .messages {
	margin-top: -5px;
	cursor: default;
}

.search-editor .message {
	padding-left: 7px;
	padding-right: 22px;
	padding-top: 0px;
}

.search-editor a.prominent {
	text-decoration: underline;
}

.monaco-editor .searchEditorFindMatch {
	box-sizing: border-box;
	background-color: var(--vscode-searchEditor-findMatchBackground);
	border: 1px solid var(--vscode-searchEditor-findMatchBorder);
}

.monaco-editor.hc-black .searchEditorFindMatch,
.monaco-editor.hc-light .searchEditorFindMatch {
	border: 1px dotted var(--vscode-searchEditor-findMatchBorder);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/share/browser/share.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/share/browser/share.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './share.css';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { localize, localize2 } from '../../../../nls.js';
import { Action2, MenuId, MenuRegistry, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { EditorResourceAccessor, SideBySideEditor } from '../../../common/editor.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { Severity } from '../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { WorkspaceFolderCountContext } from '../../../common/contextkeys.js';
import { Extensions, IWorkbenchContributionsRegistry } from '../../../common/contributions.js';
import { ShareProviderCountContext, ShareService } from './shareService.js';
import { IShareService } from '../common/share.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IProgressService, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions } from '../../../../platform/configuration/common/configurationRegistry.js';
import { workbenchConfigurationNodeBase } from '../../../common/configuration.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';

const targetMenus = [
	MenuId.EditorContextShare,
	MenuId.SCMResourceContextShare,
	MenuId.OpenEditorsContextShare,
	MenuId.EditorTitleContextShare,
	MenuId.MenubarShare,
	// MenuId.EditorLineNumberContext, // todo@joyceerhl add share
	MenuId.ExplorerContextShare
];

class ShareWorkbenchContribution extends Disposable {
	private static SHARE_ENABLED_SETTING = 'workbench.experimental.share.enabled';

	private _disposables: DisposableStore | undefined;

	constructor(
		@IShareService private readonly shareService: IShareService,
		@IConfigurationService private readonly configurationService: IConfigurationService
	) {
		super();

		if (this.configurationService.getValue<boolean>(ShareWorkbenchContribution.SHARE_ENABLED_SETTING)) {
			this.registerActions();
		}
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(ShareWorkbenchContribution.SHARE_ENABLED_SETTING)) {
				const settingValue = this.configurationService.getValue<boolean>(ShareWorkbenchContribution.SHARE_ENABLED_SETTING);
				if (settingValue === true && this._disposables === undefined) {
					this.registerActions();
				} else if (settingValue === false && this._disposables !== undefined) {
					this._disposables?.clear();
					this._disposables = undefined;
				}
			}
		}));
	}

	override dispose(): void {
		super.dispose();
		this._disposables?.dispose();
	}

	private registerActions() {
		if (!this._disposables) {
			this._disposables = new DisposableStore();
		}

		this._disposables.add(
			registerAction2(class ShareAction extends Action2 {
				static readonly ID = 'workbench.action.share';
				static readonly LABEL = localize2('share', 'Share...');

				constructor() {
					super({
						id: ShareAction.ID,
						title: ShareAction.LABEL,
						f1: true,
						icon: Codicon.linkExternal,
						precondition: ContextKeyExpr.and(ShareProviderCountContext.notEqualsTo(0), WorkspaceFolderCountContext.notEqualsTo(0)),
						keybinding: {
							weight: KeybindingWeight.WorkbenchContrib,
							primary: KeyMod.Alt | KeyMod.CtrlCmd | KeyCode.KeyS,
						},
						menu: [
							{ id: MenuId.CommandCenter, order: 1000 }
						]
					});
				}

				override async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
					const shareService = accessor.get(IShareService);
					const activeEditor = accessor.get(IEditorService)?.activeEditor;
					const resourceUri = (activeEditor && EditorResourceAccessor.getOriginalUri(activeEditor, { supportSideBySide: SideBySideEditor.PRIMARY }))
						?? accessor.get(IWorkspaceContextService).getWorkspace().folders[0].uri;
					const clipboardService = accessor.get(IClipboardService);
					const dialogService = accessor.get(IDialogService);
					const urlService = accessor.get(IOpenerService);
					const progressService = accessor.get(IProgressService);
					const selection = accessor.get(ICodeEditorService).getActiveCodeEditor()?.getSelection() ?? undefined;

					const result = await progressService.withProgress({
						location: ProgressLocation.Window,
						detail: localize('generating link', 'Generating link...')
					}, async () => shareService.provideShare({ resourceUri, selection }, CancellationToken.None));

					if (result) {
						const uriText = result.toString();
						const isResultText = typeof result === 'string';
						await clipboardService.writeText(uriText);

						dialogService.prompt(
							{
								type: Severity.Info,
								message: isResultText ? localize('shareTextSuccess', 'Copied text to clipboard!') : localize('shareSuccess', 'Copied link to clipboard!'),
								custom: {
									icon: Codicon.check,
									markdownDetails: [{
										markdown: new MarkdownString(`<div aria-label='${uriText}'>${uriText}</div>`, { supportHtml: true }),
										classes: [isResultText ? 'share-dialog-input-text' : 'share-dialog-input-link']
									}]
								},
								cancelButton: localize('close', 'Close'),
								buttons: isResultText ? [] : [{ label: localize('open link', 'Open Link'), run: () => { urlService.open(result, { openExternal: true }); } }]
							}
						);
					}
				}
			})
		);

		const actions = this.shareService.getShareActions();
		for (const menuId of targetMenus) {
			for (const action of actions) {
				// todo@joyceerhl avoid duplicates
				this._disposables.add(MenuRegistry.appendMenuItem(menuId, action));
			}
		}
	}
}

registerSingleton(IShareService, ShareService, InstantiationType.Delayed);
const workbenchContributionsRegistry = Registry.as<IWorkbenchContributionsRegistry>(Extensions.Workbench);
workbenchContributionsRegistry.registerWorkbenchContribution(ShareWorkbenchContribution, LifecyclePhase.Eventually);

Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).registerConfiguration({
	...workbenchConfigurationNodeBase,
	properties: {
		'workbench.experimental.share.enabled': {
			type: 'boolean',
			default: false,
			tags: ['experimental'],
			markdownDescription: localize('experimental.share.enabled', "Controls whether to render the Share action next to the command center when {0} is {1}.", '`#window.commandCenter#`', '`true`'),
			restricted: false,
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/share/browser/share.css]---
Location: vscode-main/src/vs/workbench/contrib/share/browser/share.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

div.share-dialog-input-text,
div.share-dialog-input-link {
	border: 1px solid var(--vscode-input-border, transparent);
	border-radius: 2px;
	color: var(--vscode-input-foreground);
	background-color: var(--vscode-input-background);
	padding: 2px;
	user-select: all;
	line-height: 24px;
}

div.share-dialog-input-link {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/share/browser/shareService.ts]---
Location: vscode-main/src/vs/workbench/contrib/share/browser/shareService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { score } from '../../../../editor/common/languageSelector.js';
import { localize } from '../../../../nls.js';
import { ISubmenuItem, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IQuickInputService, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { ToggleTitleBarConfigAction } from '../../../browser/parts/titlebar/titlebarActions.js';
import { IsCompactTitleBarContext, WorkspaceFolderCountContext } from '../../../common/contextkeys.js';
import { IShareProvider, IShareService, IShareableItem } from '../common/share.js';

export const ShareProviderCountContext = new RawContextKey<number>('shareProviderCount', 0, localize('shareProviderCount', "The number of available share providers"));

type ShareEvent = {
	providerId: string;
};
type ShareClassification = {
	owner: 'joyceerhl'; comment: 'Reporting which share provider is invoked.';
	providerId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The id of the selected share provider.' };
};

export class ShareService implements IShareService {
	readonly _serviceBrand: undefined;

	readonly providerCount: IContextKey<number>;
	private readonly _providers = new Set<IShareProvider>();

	constructor(
		@IContextKeyService private contextKeyService: IContextKeyService,
		@ILabelService private readonly labelService: ILabelService,
		@IQuickInputService private quickInputService: IQuickInputService,
		@ICodeEditorService private readonly codeEditorService: ICodeEditorService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
	) {
		this.providerCount = ShareProviderCountContext.bindTo(this.contextKeyService);
	}

	registerShareProvider(provider: IShareProvider): IDisposable {
		this._providers.add(provider);
		this.providerCount.set(this._providers.size);
		return {
			dispose: () => {
				this._providers.delete(provider);
				this.providerCount.set(this._providers.size);
			}
		};
	}

	getShareActions(): ISubmenuItem[] {
		// todo@joyceerhl return share actions
		return [];
	}

	async provideShare(item: IShareableItem, token: CancellationToken): Promise<URI | string | undefined> {
		const language = this.codeEditorService.getActiveCodeEditor()?.getModel()?.getLanguageId() ?? '';
		const providers = [...this._providers.values()]
			.filter((p) => score(p.selector, item.resourceUri, language, true, undefined, undefined) > 0)
			.sort((a, b) => a.priority - b.priority);

		if (providers.length === 0) {
			return undefined;
		}

		if (providers.length === 1) {
			this.telemetryService.publicLog2<ShareEvent, ShareClassification>('shareService.share', { providerId: providers[0].id });
			return providers[0].provideShare(item, token);
		}

		const items: (IQuickPickItem & { provider: IShareProvider })[] = providers.map((p) => ({ label: p.label, provider: p }));
		const selected = await this.quickInputService.pick(items, { canPickMany: false, placeHolder: localize('type to filter', 'Choose how to share {0}', this.labelService.getUriLabel(item.resourceUri)) }, token);

		if (selected !== undefined) {
			this.telemetryService.publicLog2<ShareEvent, ShareClassification>('shareService.share', { providerId: selected.provider.id });
			return selected.provider.provideShare(item, token);
		}

		return;
	}
}

registerAction2(class ToggleShareControl extends ToggleTitleBarConfigAction {
	constructor() {
		super('workbench.experimental.share.enabled', localize('toggle.share', 'Share'), localize('toggle.shareDescription', "Toggle visibility of the Share action in title bar"), 3, ContextKeyExpr.and(IsCompactTitleBarContext.toNegated(), ContextKeyExpr.has('config.window.commandCenter'), ContextKeyExpr.and(ShareProviderCountContext.notEqualsTo(0), WorkspaceFolderCountContext.notEqualsTo(0))));
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/share/common/share.ts]---
Location: vscode-main/src/vs/workbench/contrib/share/common/share.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { Selection } from '../../../../editor/common/core/selection.js';
import { LanguageSelector } from '../../../../editor/common/languageSelector.js';
import { ISubmenuItem } from '../../../../platform/actions/common/actions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export interface IShareableItem {
	resourceUri: URI;
	selection?: Selection;
}

export interface IShareProvider {
	readonly id: string;
	readonly label: string;
	readonly priority: number;
	readonly selector: LanguageSelector;
	prepareShare?(item: IShareableItem, token: CancellationToken): Thenable<boolean | undefined>;
	provideShare(item: IShareableItem, token: CancellationToken): Thenable<URI | string | undefined>;
}

export const IShareService = createDecorator<IShareService>('shareService');
export interface IShareService {
	_serviceBrand: undefined;

	registerShareProvider(provider: IShareProvider): IDisposable;
	getShareActions(): ISubmenuItem[];
	provideShare(item: IShareableItem, token: CancellationToken): Thenable<URI | string | undefined>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/snippets/browser/snippetCodeActionProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/snippets/browser/snippetCodeActionProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { IRange, Range } from '../../../../editor/common/core/range.js';
import { Selection } from '../../../../editor/common/core/selection.js';
import { CodeAction, CodeActionList, CodeActionProvider, WorkspaceEdit } from '../../../../editor/common/languages.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { ILanguageFeaturesService } from '../../../../editor/common/services/languageFeatures.js';
import { CodeActionKind } from '../../../../editor/contrib/codeAction/common/types.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { ApplyFileSnippetAction } from './commands/fileTemplateSnippets.js';
import { getSurroundableSnippets, SurroundWithSnippetEditorAction } from './commands/surroundWithSnippet.js';
import { Snippet } from './snippetsFile.js';
import { ISnippetsService } from './snippets.js';

class SurroundWithSnippetCodeActionProvider implements CodeActionProvider {

	private static readonly _MAX_CODE_ACTIONS = 4;

	private static readonly _overflowCommandCodeAction: CodeAction = {
		kind: CodeActionKind.SurroundWith.value,
		title: localize('more', "More..."),
		command: {
			id: SurroundWithSnippetEditorAction.options.id,
			title: SurroundWithSnippetEditorAction.options.title.value,
		},
	};

	constructor(@ISnippetsService private readonly _snippetService: ISnippetsService) { }

	async provideCodeActions(model: ITextModel, range: Range | Selection): Promise<CodeActionList | undefined> {

		if (range.isEmpty()) {
			return undefined;
		}

		const position = Selection.isISelection(range) ? range.getPosition() : range.getStartPosition();
		const snippets = await getSurroundableSnippets(this._snippetService, model, position, false);
		if (!snippets.length) {
			return undefined;
		}

		const actions: CodeAction[] = [];
		for (const snippet of snippets) {
			if (actions.length >= SurroundWithSnippetCodeActionProvider._MAX_CODE_ACTIONS) {
				actions.push(SurroundWithSnippetCodeActionProvider._overflowCommandCodeAction);
				break;
			}
			actions.push({
				title: localize('codeAction', "{0}", snippet.name),
				kind: CodeActionKind.SurroundWith.value,
				edit: asWorkspaceEdit(model, range, snippet)
			});
		}

		return {
			actions,
			dispose() { }
		};
	}
}

class FileTemplateCodeActionProvider implements CodeActionProvider {

	private static readonly _MAX_CODE_ACTIONS = 4;

	private static readonly _overflowCommandCodeAction: CodeAction = {
		title: localize('overflow.start.title', 'Start with Snippet'),
		kind: CodeActionKind.SurroundWith.value,
		command: {
			id: ApplyFileSnippetAction.Id,
			title: ''
		}
	};

	readonly providedCodeActionKinds?: readonly string[] = [CodeActionKind.SurroundWith.value];

	constructor(@ISnippetsService private readonly _snippetService: ISnippetsService) { }

	async provideCodeActions(model: ITextModel) {
		if (model.getValueLength() !== 0) {
			return undefined;
		}

		const snippets = await this._snippetService.getSnippets(model.getLanguageId(), { fileTemplateSnippets: true, includeNoPrefixSnippets: true });
		const actions: CodeAction[] = [];
		for (const snippet of snippets) {
			if (actions.length >= FileTemplateCodeActionProvider._MAX_CODE_ACTIONS) {
				actions.push(FileTemplateCodeActionProvider._overflowCommandCodeAction);
				break;
			}
			actions.push({
				title: localize('title', 'Start with: {0}', snippet.name),
				kind: CodeActionKind.SurroundWith.value,
				edit: asWorkspaceEdit(model, model.getFullModelRange(), snippet)
			});
		}
		return {
			actions,
			dispose() { }
		};
	}
}

function asWorkspaceEdit(model: ITextModel, range: IRange, snippet: Snippet): WorkspaceEdit {
	return {
		edits: [{
			versionId: model.getVersionId(),
			resource: model.uri,
			textEdit: {
				range,
				text: snippet.body,
				insertAsSnippet: true,
			}
		}]
	};
}

export class SnippetCodeActions implements IWorkbenchContribution {

	private readonly _store = new DisposableStore();

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
		@IConfigurationService configService: IConfigurationService,
	) {

		const setting = 'editor.snippets.codeActions.enabled';
		const sessionStore = new DisposableStore();
		const update = () => {
			sessionStore.clear();
			if (configService.getValue(setting)) {
				sessionStore.add(languageFeaturesService.codeActionProvider.register('*', instantiationService.createInstance(SurroundWithSnippetCodeActionProvider)));
				sessionStore.add(languageFeaturesService.codeActionProvider.register('*', instantiationService.createInstance(FileTemplateCodeActionProvider)));
			}
		};

		update();
		this._store.add(configService.onDidChangeConfiguration(e => e.affectsConfiguration(setting) && update()));
		this._store.add(sessionStore);
	}

	dispose(): void {
		this._store.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/snippets/browser/snippetCompletionProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/snippets/browser/snippetCompletionProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { compare, compareSubstring } from '../../../../base/common/strings.js';
import { Position } from '../../../../editor/common/core/position.js';
import { IRange, Range } from '../../../../editor/common/core/range.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { CompletionItem, CompletionItemKind, CompletionItemProvider, CompletionList, CompletionItemInsertTextRule, CompletionContext, CompletionTriggerKind, CompletionItemLabel, Command } from '../../../../editor/common/languages.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { SnippetParser } from '../../../../editor/contrib/snippet/browser/snippetParser.js';
import { localize } from '../../../../nls.js';
import { ISnippetsService } from './snippets.js';
import { Snippet, SnippetSource } from './snippetsFile.js';
import { isPatternInWord } from '../../../../base/common/filters.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { ILanguageConfigurationService } from '../../../../editor/common/languages/languageConfigurationRegistry.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { IWordAtPosition } from '../../../../editor/common/core/wordHelper.js';


const markSnippetAsUsed = '_snippet.markAsUsed';

CommandsRegistry.registerCommand(markSnippetAsUsed, (accessor, ...args) => {
	const snippetsService = accessor.get(ISnippetsService);
	const [first] = args;
	if (first instanceof Snippet) {
		snippetsService.updateUsageTimestamp(first);
	}
});

export class SnippetCompletion implements CompletionItem {

	label: CompletionItemLabel;
	detail: string;
	insertText: string;
	documentation?: MarkdownString;
	range: IRange | { insert: IRange; replace: IRange };
	sortText: string;
	kind: CompletionItemKind;
	insertTextRules: CompletionItemInsertTextRule;
	extensionId?: ExtensionIdentifier;
	command?: Command;

	constructor(
		readonly snippet: Snippet,
		range: IRange | { insert: IRange; replace: IRange },
	) {
		this.label = { label: snippet.prefix, description: snippet.name };
		this.detail = localize('detail.snippet', "{0} ({1})", snippet.description || snippet.name, snippet.source);
		this.insertText = snippet.codeSnippet;
		this.extensionId = snippet.extensionId;
		this.range = range;
		this.sortText = `${snippet.snippetSource === SnippetSource.Extension ? 'z' : 'a'}-${snippet.prefix}`;
		this.kind = CompletionItemKind.Snippet;
		this.insertTextRules = CompletionItemInsertTextRule.InsertAsSnippet;
		this.command = { id: markSnippetAsUsed, title: '', arguments: [snippet] };
	}

	resolve(): this {
		this.documentation = new MarkdownString().appendCodeblock('', SnippetParser.asInsertText(this.snippet.codeSnippet));
		return this;
	}

	static compareByLabel(a: SnippetCompletion, b: SnippetCompletion): number {
		return compare(a.label.label, b.label.label);
	}
}

interface ISnippetPosition {
	startColumn: number;
	prefixLow: string;
	isWord: boolean;
}

export class SnippetCompletionProvider implements CompletionItemProvider {

	readonly _debugDisplayName = 'snippetCompletions';

	constructor(
		@ILanguageService private readonly _languageService: ILanguageService,
		@ISnippetsService private readonly _snippets: ISnippetsService,
		@ILanguageConfigurationService private readonly _languageConfigurationService: ILanguageConfigurationService
	) {
		//
	}

	async provideCompletionItems(model: ITextModel, position: Position, context: CompletionContext): Promise<CompletionList> {

		const sw = new StopWatch();

		// compute all snippet anchors: word starts and every non word character
		const line = position.lineNumber;
		const word = model.getWordAtPosition(position) ?? { startColumn: position.column, endColumn: position.column, word: '' };

		const lineContentLow = model.getLineContent(position.lineNumber).toLowerCase();
		const lineContentWithWordLow = lineContentLow.substring(0, word.startColumn + word.word.length - 1);
		const anchors = this._computeSnippetPositions(model, line, word, lineContentWithWordLow);

		// loop over possible snippets and match them against the anchors
		const columnOffset = position.column - 1;
		const triggerCharacterLow = context.triggerCharacter?.toLowerCase() ?? '';
		const languageId = this._getLanguageIdAtPosition(model, position);
		const languageConfig = this._languageConfigurationService.getLanguageConfiguration(languageId);
		const snippets = new Set(await this._snippets.getSnippets(languageId));
		const suggestions: SnippetCompletion[] = [];

		for (const snippet of snippets) {

			if (context.triggerKind === CompletionTriggerKind.TriggerCharacter && !snippet.prefixLow.startsWith(triggerCharacterLow)) {
				// strict -> when having trigger characters they must prefix-match
				continue;
			}

			let candidate: ISnippetPosition | undefined;
			for (const anchor of anchors) {

				if (anchor.prefixLow.match(/^\s/) && !snippet.prefixLow.match(/^\s/)) {
					// only allow whitespace anchor when snippet prefix starts with whitespace too
					continue;
				}

				if (isPatternInWord(anchor.prefixLow, 0, anchor.prefixLow.length, snippet.prefixLow, 0, snippet.prefixLow.length)) {
					candidate = anchor;
					break;
				}
			}

			if (!candidate) {
				continue;
			}

			const pos = candidate.startColumn - 1;

			const prefixRestLen = snippet.prefixLow.length - (columnOffset - pos);
			const endsWithPrefixRest = compareSubstring(lineContentLow, snippet.prefixLow, columnOffset, columnOffset + prefixRestLen, columnOffset - pos);
			const startPosition = position.with(undefined, pos + 1);

			let endColumn = endsWithPrefixRest === 0 ? position.column + prefixRestLen : position.column;

			// First check if there is anything to the right of the cursor
			if (columnOffset < lineContentLow.length) {
				const autoClosingPairs = languageConfig.getAutoClosingPairs();
				const standardAutoClosingPairConditionals = autoClosingPairs.autoClosingPairsCloseSingleChar.get(lineContentLow[columnOffset]);
				// If the character to the right of the cursor is a closing character of an autoclosing pair
				if (standardAutoClosingPairConditionals?.some(p =>
					// and the start position is the opening character of an autoclosing pair
					p.open === lineContentLow[startPosition.column - 1] &&
					// and the snippet prefix contains the opening and closing pair at its edges
					snippet.prefix.startsWith(p.open) &&
					snippet.prefix[snippet.prefix.length - 1] === p.close)
				) {
					// Eat the character that was likely inserted because of auto-closing pairs
					endColumn++;
				}
			}

			const replace = Range.fromPositions({ lineNumber: line, column: candidate.startColumn }, { lineNumber: line, column: endColumn });
			const insert = replace.setEndPosition(line, position.column);

			suggestions.push(new SnippetCompletion(snippet, { replace, insert }));
			snippets.delete(snippet);
		}

		// add remaing snippets when the current prefix ends in whitespace or when line is empty
		// and when not having a trigger character
		if (!triggerCharacterLow && (/\s/.test(lineContentLow[position.column - 2]) /*end in whitespace */ || !lineContentLow /*empty line*/)) {
			for (const snippet of snippets) {
				const insert = Range.fromPositions(position);
				const replace = lineContentLow.indexOf(snippet.prefixLow, columnOffset) === columnOffset ? insert.setEndPosition(position.lineNumber, position.column + snippet.prefixLow.length) : insert;
				suggestions.push(new SnippetCompletion(snippet, { replace, insert }));
			}
		}

		// dismbiguate suggestions with same labels
		this._disambiguateSnippets(suggestions);

		return {
			suggestions,
			duration: sw.elapsed()
		};
	}

	private _disambiguateSnippets(suggestions: SnippetCompletion[]) {
		suggestions.sort(SnippetCompletion.compareByLabel);
		for (let i = 0; i < suggestions.length; i++) {
			const item = suggestions[i];
			let to = i + 1;
			for (; to < suggestions.length && item.label === suggestions[to].label; to++) {
				suggestions[to].label.label = localize('snippetSuggest.longLabel', "{0}, {1}", suggestions[to].label.label, suggestions[to].snippet.name);
			}
			if (to > i + 1) {
				suggestions[i].label.label = localize('snippetSuggest.longLabel', "{0}, {1}", suggestions[i].label.label, suggestions[i].snippet.name);
				i = to;
			}
		}
	}

	resolveCompletionItem(item: CompletionItem): CompletionItem {
		return (item instanceof SnippetCompletion) ? item.resolve() : item;
	}

	private _computeSnippetPositions(model: ITextModel, line: number, word: IWordAtPosition, lineContentWithWordLow: string): ISnippetPosition[] {
		const result: ISnippetPosition[] = [];

		for (let column = 1; column < word.startColumn; column++) {
			const wordInfo = model.getWordAtPosition(new Position(line, column));
			result.push({
				startColumn: column,
				prefixLow: lineContentWithWordLow.substring(column - 1),
				isWord: Boolean(wordInfo)
			});
			if (wordInfo) {
				column = wordInfo.endColumn;

				// the character right after a word is an anchor, always
				result.push({
					startColumn: wordInfo.endColumn,
					prefixLow: lineContentWithWordLow.substring(wordInfo.endColumn - 1),
					isWord: false
				});
			}
		}

		if (word.word.length > 0 || result.length === 0) {
			result.push({
				startColumn: word.startColumn,
				prefixLow: lineContentWithWordLow.substring(word.startColumn - 1),
				isWord: true
			});
		}

		return result;
	}

	private _getLanguageIdAtPosition(model: ITextModel, position: Position): string {
		// validate the `languageId` to ensure this is a user
		// facing language with a name and the chance to have
		// snippets, else fall back to the outer language
		model.tokenization.tokenizeIfCheap(position.lineNumber);
		let languageId = model.getLanguageIdAtPosition(position.lineNumber, position.column);
		if (!this._languageService.getLanguageName(languageId)) {
			languageId = model.getLanguageId();
		}
		return languageId;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/snippets/browser/snippetPicker.ts]---
Location: vscode-main/src/vs/workbench/contrib/snippets/browser/snippetPicker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { ISnippetsService } from './snippets.js';
import { Snippet, SnippetSource } from './snippetsFile.js';
import { IQuickPickItem, IQuickInputService, QuickPickInput } from '../../../../platform/quickinput/common/quickInput.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { Event } from '../../../../base/common/event.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';

export async function pickSnippet(accessor: ServicesAccessor, languageIdOrSnippets: string | Snippet[]): Promise<Snippet | undefined> {

	const snippetService = accessor.get(ISnippetsService);
	const quickInputService = accessor.get(IQuickInputService);

	interface ISnippetPick extends IQuickPickItem {
		snippet: Snippet;
	}

	let snippets: Snippet[];
	if (Array.isArray(languageIdOrSnippets)) {
		snippets = languageIdOrSnippets;
	} else {
		snippets = (await snippetService.getSnippets(languageIdOrSnippets, { includeDisabledSnippets: true, includeNoPrefixSnippets: true }));
	}

	snippets.sort((a, b) => a.snippetSource - b.snippetSource);

	const makeSnippetPicks = () => {
		const result: QuickPickInput<ISnippetPick>[] = [];
		let prevSnippet: Snippet | undefined;
		for (const snippet of snippets) {
			const pick: ISnippetPick = {
				label: snippet.prefix || snippet.name,
				detail: snippet.description || snippet.body,
				snippet
			};
			if (!prevSnippet || prevSnippet.snippetSource !== snippet.snippetSource || prevSnippet.source !== snippet.source) {
				let label = '';
				switch (snippet.snippetSource) {
					case SnippetSource.User:
						label = nls.localize('sep.userSnippet', "User Snippets");
						break;
					case SnippetSource.Extension:
						label = snippet.source;
						break;
					case SnippetSource.Workspace:
						label = nls.localize('sep.workspaceSnippet', "Workspace Snippets");
						break;
				}
				result.push({ type: 'separator', label });
			}

			if (snippet.snippetSource === SnippetSource.Extension) {
				const isEnabled = snippetService.isEnabled(snippet);
				if (isEnabled) {
					pick.buttons = [{
						iconClass: ThemeIcon.asClassName(Codicon.eyeClosed),
						tooltip: nls.localize('disableSnippet', 'Hide from IntelliSense')
					}];
				} else {
					pick.description = nls.localize('isDisabled', "(hidden from IntelliSense)");
					pick.buttons = [{
						iconClass: ThemeIcon.asClassName(Codicon.eye),
						tooltip: nls.localize('enable.snippet', 'Show in IntelliSense')
					}];
				}
			}

			result.push(pick);
			prevSnippet = snippet;
		}
		return result;
	};

	const disposables = new DisposableStore();
	const picker = disposables.add(quickInputService.createQuickPick<ISnippetPick>({ useSeparators: true }));
	picker.placeholder = nls.localize('pick.placeholder', "Select a snippet");
	picker.matchOnDetail = true;
	picker.ignoreFocusOut = false;
	picker.keepScrollPosition = true;
	disposables.add(picker.onDidTriggerItemButton(ctx => {
		const isEnabled = snippetService.isEnabled(ctx.item.snippet);
		snippetService.updateEnablement(ctx.item.snippet, !isEnabled);
		picker.items = makeSnippetPicks();
	}));
	picker.items = makeSnippetPicks();
	if (!picker.items.length) {
		picker.validationMessage = nls.localize('pick.noSnippetAvailable', "No snippet available");
	}
	picker.show();

	// wait for an item to be picked or the picker to become hidden
	await Promise.race([Event.toPromise(picker.onDidAccept), Event.toPromise(picker.onDidHide)]);
	const result = picker.selectedItems[0]?.snippet;
	disposables.dispose();
	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/snippets/browser/snippets.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/snippets/browser/snippets.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IJSONSchema, IJSONSchemaMap } from '../../../../base/common/jsonSchema.js';
import * as nls from '../../../../nls.js';
import { registerAction2 } from '../../../../platform/actions/common/actions.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import * as JSONContributionRegistry from '../../../../platform/jsonschemas/common/jsonContributionRegistry.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContributionsRegistry } from '../../../common/contributions.js';
import { ConfigureSnippetsAction } from './commands/configureSnippets.js';
import { ApplyFileSnippetAction } from './commands/fileTemplateSnippets.js';
import { InsertSnippetAction } from './commands/insertSnippet.js';
import { SurroundWithSnippetEditorAction } from './commands/surroundWithSnippet.js';
import { SnippetCodeActions } from './snippetCodeActionProvider.js';
import { ISnippetsService } from './snippets.js';
import { SnippetsService } from './snippetsService.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { Extensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';

import './tabCompletion.js';
import { editorConfigurationBaseNode } from '../../../../editor/common/config/editorConfigurationSchema.js';

// service
registerSingleton(ISnippetsService, SnippetsService, InstantiationType.Delayed);

// actions
registerAction2(InsertSnippetAction);
CommandsRegistry.registerCommandAlias('editor.action.showSnippets', 'editor.action.insertSnippet');
registerAction2(SurroundWithSnippetEditorAction);
registerAction2(ApplyFileSnippetAction);
registerAction2(ConfigureSnippetsAction);

// workbench contribs
const workbenchContribRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);
workbenchContribRegistry.registerWorkbenchContribution(SnippetCodeActions, LifecyclePhase.Restored);

// config
Registry
	.as<IConfigurationRegistry>(Extensions.Configuration)
	.registerConfiguration({
		...editorConfigurationBaseNode,
		'properties': {
			'editor.snippets.codeActions.enabled': {
				'description': nls.localize('editor.snippets.codeActions.enabled', 'Controls if surround-with-snippets or file template snippets show as Code Actions.'),
				'type': 'boolean',
				'default': true
			}
		}
	});


// schema
const languageScopeSchemaId = 'vscode://schemas/snippets';

const snippetSchemaProperties: IJSONSchemaMap = {
	prefix: {
		description: nls.localize('snippetSchema.json.prefix', 'The prefix to use when selecting the snippet in intellisense'),
		type: ['string', 'array']
	},
	isFileTemplate: {
		description: nls.localize('snippetSchema.json.isFileTemplate', 'The snippet is meant to populate or replace a whole file'),
		type: 'boolean'
	},
	body: {
		markdownDescription: nls.localize('snippetSchema.json.body', 'The snippet content. Use `$1`, `${1:defaultText}` to define cursor positions, use `$0` for the final cursor position. Insert variable values with `${varName}` and `${varName:defaultText}`, e.g. `This is file: $TM_FILENAME`.'),
		type: ['string', 'array'],
		items: {
			type: 'string'
		}
	},
	description: {
		description: nls.localize('snippetSchema.json.description', 'The snippet description.'),
		type: ['string', 'array']
	}
};

const languageScopeSchema: IJSONSchema = {
	id: languageScopeSchemaId,
	allowComments: true,
	allowTrailingCommas: true,
	defaultSnippets: [{
		label: nls.localize('snippetSchema.json.default', "Empty snippet"),
		body: { '${1:snippetName}': { 'prefix': '${2:prefix}', 'body': '${3:snippet}', 'description': '${4:description}' } }
	}],
	type: 'object',
	description: nls.localize('snippetSchema.json', 'User snippet configuration'),
	additionalProperties: {
		type: 'object',
		required: ['body'],
		properties: snippetSchemaProperties,
		additionalProperties: false
	}
};


const globalSchemaId = 'vscode://schemas/global-snippets';
const globalSchema: IJSONSchema = {
	id: globalSchemaId,
	allowComments: true,
	allowTrailingCommas: true,
	defaultSnippets: [{
		label: nls.localize('snippetSchema.json.default', "Empty snippet"),
		body: { '${1:snippetName}': { 'scope': '${2:scope}', 'prefix': '${3:prefix}', 'body': '${4:snippet}', 'description': '${5:description}' } }
	}],
	type: 'object',
	description: nls.localize('snippetSchema.json', 'User snippet configuration'),
	additionalProperties: {
		type: 'object',
		required: ['body'],
		properties: {
			...snippetSchemaProperties,
			scope: {
				description: nls.localize('snippetSchema.json.scope', "A list of language names to which this snippet applies, e.g. 'typescript,javascript'."),
				type: 'string'
			}
		},
		additionalProperties: false
	}
};

const reg = Registry.as<JSONContributionRegistry.IJSONContributionRegistry>(JSONContributionRegistry.Extensions.JSONContribution);
reg.registerSchema(languageScopeSchemaId, languageScopeSchema);
reg.registerSchema(globalSchemaId, globalSchema);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/snippets/browser/snippets.ts]---
Location: vscode-main/src/vs/workbench/contrib/snippets/browser/snippets.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { SnippetFile, Snippet } from './snippetsFile.js';

export const ISnippetsService = createDecorator<ISnippetsService>('snippetService');

export interface ISnippetGetOptions {
	includeDisabledSnippets?: boolean;
	includeNoPrefixSnippets?: boolean;
	noRecencySort?: boolean;
	fileTemplateSnippets?: boolean;
}

export interface ISnippetsService {

	readonly _serviceBrand: undefined;

	getSnippetFiles(): Promise<Iterable<SnippetFile>>;

	isEnabled(snippet: Snippet): boolean;

	updateEnablement(snippet: Snippet, enabled: boolean): void;

	updateUsageTimestamp(snippet: Snippet): void;

	getSnippets(languageId: string | undefined, opt?: ISnippetGetOptions): Promise<Snippet[]>;

	getSnippetsSync(languageId: string, opt?: ISnippetGetOptions): Snippet[];
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/snippets/browser/snippetsFile.ts]---
Location: vscode-main/src/vs/workbench/contrib/snippets/browser/snippetsFile.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { parse as jsonParse, getNodeType } from '../../../../base/common/json.js';
import { localize } from '../../../../nls.js';
import { extname, basename } from '../../../../base/common/path.js';
import { SnippetParser, Variable, Placeholder, Text } from '../../../../editor/contrib/snippet/browser/snippetParser.js';
import { KnownSnippetVariableNames } from '../../../../editor/contrib/snippet/browser/snippetVariables.js';
import { URI } from '../../../../base/common/uri.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { IExtensionResourceLoaderService } from '../../../../platform/extensionResourceLoader/common/extensionResourceLoader.js';
import { relativePath } from '../../../../base/common/resources.js';
import { isObject } from '../../../../base/common/types.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { WindowIdleValue, getActiveWindow } from '../../../../base/browser/dom.js';

class SnippetBodyInsights {

	readonly codeSnippet: string;

	/** The snippet uses bad placeholders which collide with variable names */
	readonly isBogous: boolean;

	/** The snippet has no placeholder of the final placeholder is at the end */
	readonly isTrivial: boolean;

	readonly usesClipboardVariable: boolean;
	readonly usesSelectionVariable: boolean;

	constructor(body: string) {

		// init with defaults
		this.isBogous = false;
		this.isTrivial = false;
		this.usesClipboardVariable = false;
		this.usesSelectionVariable = false;
		this.codeSnippet = body;

		// check snippet...
		const textmateSnippet = new SnippetParser().parse(body, false);

		const placeholders = new Map<string, number>();
		let placeholderMax = 0;
		for (const placeholder of textmateSnippet.placeholders) {
			placeholderMax = Math.max(placeholderMax, placeholder.index);
		}

		// mark snippet as trivial when there is no placeholders or when the only
		// placeholder is the final tabstop and it is at the very end.
		if (textmateSnippet.placeholders.length === 0) {
			this.isTrivial = true;
		} else if (placeholderMax === 0) {
			const last = textmateSnippet.children.at(-1);
			this.isTrivial = last instanceof Placeholder && last.isFinalTabstop;
		}

		const stack = [...textmateSnippet.children];
		while (stack.length > 0) {
			const marker = stack.shift()!;
			if (marker instanceof Variable) {

				if (marker.children.length === 0 && !KnownSnippetVariableNames[marker.name]) {
					// a 'variable' without a default value and not being one of our supported
					// variables is automatically turned into a placeholder. This is to restore
					// a bug we had before. So `${foo}` becomes `${N:foo}`
					const index = placeholders.has(marker.name) ? placeholders.get(marker.name)! : ++placeholderMax;
					placeholders.set(marker.name, index);

					const synthetic = new Placeholder(index).appendChild(new Text(marker.name));
					textmateSnippet.replace(marker, [synthetic]);
					this.isBogous = true;
				}

				switch (marker.name) {
					case 'CLIPBOARD':
						this.usesClipboardVariable = true;
						break;
					case 'SELECTION':
					case 'TM_SELECTED_TEXT':
						this.usesSelectionVariable = true;
						break;
				}

			} else {
				// recurse
				stack.push(...marker.children);
			}
		}

		if (this.isBogous) {
			this.codeSnippet = textmateSnippet.toTextmateString();
		}

	}
}

export class Snippet {

	private readonly _bodyInsights: WindowIdleValue<SnippetBodyInsights>;

	readonly prefixLow: string;

	constructor(
		readonly isFileTemplate: boolean,
		readonly scopes: string[],
		readonly name: string,
		readonly prefix: string,
		readonly description: string,
		readonly body: string,
		readonly source: string,
		readonly snippetSource: SnippetSource,
		readonly snippetIdentifier: string,
		readonly extensionId?: ExtensionIdentifier,
	) {
		this.prefixLow = prefix.toLowerCase();
		this._bodyInsights = new WindowIdleValue(getActiveWindow(), () => new SnippetBodyInsights(this.body));
	}

	get codeSnippet(): string {
		return this._bodyInsights.value.codeSnippet;
	}

	get isBogous(): boolean {
		return this._bodyInsights.value.isBogous;
	}

	get isTrivial(): boolean {
		return this._bodyInsights.value.isTrivial;
	}

	get needsClipboard(): boolean {
		return this._bodyInsights.value.usesClipboardVariable;
	}

	get usesSelection(): boolean {
		return this._bodyInsights.value.usesSelectionVariable;
	}
}


interface JsonSerializedSnippet {
	isFileTemplate?: boolean;
	body: string | string[];
	scope?: string;
	prefix: string | string[] | undefined;
	description: string;
}

function isJsonSerializedSnippet(thing: unknown): thing is JsonSerializedSnippet {
	return isObject(thing) && Boolean((<JsonSerializedSnippet>thing).body);
}

interface JsonSerializedSnippets {
	[name: string]: JsonSerializedSnippet | { [name: string]: JsonSerializedSnippet };
}

export const enum SnippetSource {
	User = 1,
	Workspace = 2,
	Extension = 3,
}

export class SnippetFile {

	readonly data: Snippet[] = [];
	readonly isGlobalSnippets: boolean;
	readonly isUserSnippets: boolean;

	private _loadPromise?: Promise<this>;

	constructor(
		readonly source: SnippetSource,
		readonly location: URI,
		public defaultScopes: string[] | undefined,
		private readonly _extension: IExtensionDescription | undefined,
		private readonly _fileService: IFileService,
		private readonly _extensionResourceLoaderService: IExtensionResourceLoaderService,
	) {
		this.isGlobalSnippets = extname(location.path) === '.code-snippets';
		this.isUserSnippets = !this._extension;
	}

	select(selector: string, bucket: Snippet[]): void {
		if (this.isGlobalSnippets || !this.isUserSnippets) {
			this._scopeSelect(selector, bucket);
		} else {
			this._filepathSelect(selector, bucket);
		}
	}

	private _filepathSelect(selector: string, bucket: Snippet[]): void {
		// for `fooLang.json` files all snippets are accepted
		if (selector + '.json' === basename(this.location.path)) {
			bucket.push(...this.data);
		}
	}

	private _scopeSelect(selector: string, bucket: Snippet[]): void {
		// for `my.code-snippets` files we need to look at each snippet
		for (const snippet of this.data) {
			const len = snippet.scopes.length;
			if (len === 0) {
				// always accept
				bucket.push(snippet);

			} else {
				for (let i = 0; i < len; i++) {
					// match
					if (snippet.scopes[i] === selector) {
						bucket.push(snippet);
						break; // match only once!
					}
				}
			}
		}

		const idx = selector.lastIndexOf('.');
		if (idx >= 0) {
			this._scopeSelect(selector.substring(0, idx), bucket);
		}
	}

	private async _load(): Promise<string> {
		if (this._extension) {
			return this._extensionResourceLoaderService.readExtensionResource(this.location);
		} else {
			const content = await this._fileService.readFile(this.location);
			return content.value.toString();
		}
	}

	load(): Promise<this> {
		if (!this._loadPromise) {
			this._loadPromise = Promise.resolve(this._load()).then(content => {
				const data = <JsonSerializedSnippets>jsonParse(content);
				if (getNodeType(data) === 'object') {
					for (const [name, scopeOrTemplate] of Object.entries(data)) {
						if (isJsonSerializedSnippet(scopeOrTemplate)) {
							this._parseSnippet(name, scopeOrTemplate, this.data);
						} else {
							for (const [name, template] of Object.entries(scopeOrTemplate)) {
								this._parseSnippet(name, template, this.data);
							}
						}
					}
				}
				return this;
			});
		}
		return this._loadPromise;
	}

	reset(): void {
		this._loadPromise = undefined;
		this.data.length = 0;
	}

	private _parseSnippet(name: string, snippet: JsonSerializedSnippet, bucket: Snippet[]): void {

		let { isFileTemplate, prefix, body, description } = snippet;

		if (!prefix) {
			prefix = '';
		}

		if (Array.isArray(body)) {
			body = body.join('\n');
		}
		if (typeof body !== 'string') {
			return;
		}

		if (Array.isArray(description)) {
			description = description.join('\n');
		}

		let scopes: string[];
		if (this.defaultScopes) {
			scopes = this.defaultScopes;
		} else if (typeof snippet.scope === 'string') {
			scopes = snippet.scope.split(',').map(s => s.trim()).filter(Boolean);
		} else {
			scopes = [];
		}

		let source: string;
		if (this._extension) {
			// extension snippet -> show the name of the extension
			source = this._extension.displayName || this._extension.name;

		} else if (this.source === SnippetSource.Workspace) {
			// workspace -> only *.code-snippets files
			source = localize('source.workspaceSnippetGlobal', "Workspace Snippet");
		} else {
			// user -> global (*.code-snippets) and language snippets
			if (this.isGlobalSnippets) {
				source = localize('source.userSnippetGlobal', "Global User Snippet");
			} else {
				source = localize('source.userSnippet', "User Snippet");
			}
		}

		for (const _prefix of Iterable.wrap(prefix)) {
			bucket.push(new Snippet(
				Boolean(isFileTemplate),
				scopes,
				name,
				_prefix,
				description,
				body,
				source,
				this.source,
				this._extension ? `${relativePath(this._extension.extensionLocation, this.location)}/${name}` : `${basename(this.location.path)}/${name}`,
				this._extension?.identifier,
			));
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/snippets/browser/snippetsService.ts]---
Location: vscode-main/src/vs/workbench/contrib/snippets/browser/snippetsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IJSONSchema } from '../../../../base/common/jsonSchema.js';
import { combinedDisposable, IDisposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import * as resources from '../../../../base/common/resources.js';
import { isFalsyOrWhitespace } from '../../../../base/common/strings.js';
import { URI } from '../../../../base/common/uri.js';
import { Position } from '../../../../editor/common/core/position.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { setSnippetSuggestSupport } from '../../../../editor/contrib/suggest/browser/suggest.js';
import { localize } from '../../../../nls.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { FileChangeType, IFileService } from '../../../../platform/files/common/files.js';
import { ILifecycleService, LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IWorkspace, IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { ISnippetGetOptions, ISnippetsService } from './snippets.js';
import { Snippet, SnippetFile, SnippetSource } from './snippetsFile.js';
import { ExtensionsRegistry, IExtensionPointUser } from '../../../services/extensions/common/extensionsRegistry.js';
import { languagesExtPoint } from '../../../services/language/common/languageService.js';
import { SnippetCompletionProvider } from './snippetCompletionProvider.js';
import { IExtensionResourceLoaderService } from '../../../../platform/extensionResourceLoader/common/extensionResourceLoader.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { isStringArray } from '../../../../base/common/types.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { ILanguageConfigurationService } from '../../../../editor/common/languages/languageConfigurationRegistry.js';
import { IUserDataProfileService } from '../../../services/userDataProfile/common/userDataProfile.js';
import { insertInto } from '../../../../base/common/arrays.js';

namespace snippetExt {

	export interface ISnippetsExtensionPoint {
		language: string;
		path: string;
	}

	export interface IValidSnippetsExtensionPoint {
		language: string;
		location: URI;
	}

	export function toValidSnippet(extension: IExtensionPointUser<ISnippetsExtensionPoint[]>, snippet: ISnippetsExtensionPoint, languageService: ILanguageService): IValidSnippetsExtensionPoint | null {

		if (isFalsyOrWhitespace(snippet.path)) {
			extension.collector.error(localize(
				'invalid.path.0',
				"Expected string in `contributes.{0}.path`. Provided value: {1}",
				extension.description.name, String(snippet.path)
			));
			return null;
		}

		if (isFalsyOrWhitespace(snippet.language) && !snippet.path.endsWith('.code-snippets')) {
			extension.collector.error(localize(
				'invalid.language.0',
				"When omitting the language, the value of `contributes.{0}.path` must be a `.code-snippets`-file. Provided value: {1}",
				extension.description.name, String(snippet.path)
			));
			return null;
		}

		if (!isFalsyOrWhitespace(snippet.language) && !languageService.isRegisteredLanguageId(snippet.language)) {
			extension.collector.error(localize(
				'invalid.language',
				"Unknown language in `contributes.{0}.language`. Provided value: {1}",
				extension.description.name, String(snippet.language)
			));
			return null;

		}

		const extensionLocation = extension.description.extensionLocation;
		const snippetLocation = resources.joinPath(extensionLocation, snippet.path);
		if (!resources.isEqualOrParent(snippetLocation, extensionLocation)) {
			extension.collector.error(localize(
				'invalid.path.1',
				"Expected `contributes.{0}.path` ({1}) to be included inside extension's folder ({2}). This might make the extension non-portable.",
				extension.description.name, snippetLocation.path, extensionLocation.path
			));
			return null;
		}

		return {
			language: snippet.language,
			location: snippetLocation
		};
	}

	export const snippetsContribution: IJSONSchema = {
		description: localize('vscode.extension.contributes.snippets', 'Contributes snippets.'),
		type: 'array',
		defaultSnippets: [{ body: [{ language: '', path: '' }] }],
		items: {
			type: 'object',
			defaultSnippets: [{ body: { language: '${1:id}', path: './snippets/${2:id}.json.' } }],
			properties: {
				language: {
					description: localize('vscode.extension.contributes.snippets-language', 'Language identifier for which this snippet is contributed to.'),
					type: 'string'
				},
				path: {
					description: localize('vscode.extension.contributes.snippets-path', 'Path of the snippets file. The path is relative to the extension folder and typically starts with \'./snippets/\'.'),
					type: 'string'
				}
			}
		}
	};

	export const point = ExtensionsRegistry.registerExtensionPoint<snippetExt.ISnippetsExtensionPoint[]>({
		extensionPoint: 'snippets',
		deps: [languagesExtPoint],
		jsonSchema: snippetExt.snippetsContribution
	});
}

function watch(service: IFileService, resource: URI, callback: () => unknown): IDisposable {
	return combinedDisposable(
		service.watch(resource),
		service.onDidFilesChange(e => {
			if (e.affects(resource)) {
				callback();
			}
		})
	);
}

class SnippetEnablement {

	private static _key = 'snippets.ignoredSnippets';

	private readonly _ignored: Set<string>;

	constructor(
		@IStorageService private readonly _storageService: IStorageService,
	) {

		const raw = _storageService.get(SnippetEnablement._key, StorageScope.PROFILE, '');
		let data: string[] | undefined;
		try {
			data = JSON.parse(raw);
		} catch { }

		this._ignored = isStringArray(data) ? new Set(data) : new Set();
	}

	isIgnored(id: string): boolean {
		return this._ignored.has(id);
	}

	updateIgnored(id: string, value: boolean): void {
		let changed = false;
		if (this._ignored.has(id) && !value) {
			this._ignored.delete(id);
			changed = true;
		} else if (!this._ignored.has(id) && value) {
			this._ignored.add(id);
			changed = true;
		}
		if (changed) {
			this._storageService.store(SnippetEnablement._key, JSON.stringify(Array.from(this._ignored)), StorageScope.PROFILE, StorageTarget.USER);
		}
	}
}

class SnippetUsageTimestamps {

	private static _key = 'snippets.usageTimestamps';

	private readonly _usages: Map<string, number>;

	constructor(
		@IStorageService private readonly _storageService: IStorageService,
	) {

		const raw = _storageService.get(SnippetUsageTimestamps._key, StorageScope.PROFILE, '');
		let data: [string, number][] | undefined;
		try {
			data = JSON.parse(raw);
		} catch {
			data = [];
		}

		this._usages = Array.isArray(data) ? new Map(data) : new Map();
	}

	getUsageTimestamp(id: string): number | undefined {
		return this._usages.get(id);
	}

	updateUsageTimestamp(id: string): void {
		// map uses insertion order, we want most recent at the end
		this._usages.delete(id);
		this._usages.set(id, Date.now());

		// persist last 100 item
		const all = [...this._usages].slice(-100);
		this._storageService.store(SnippetUsageTimestamps._key, JSON.stringify(all), StorageScope.PROFILE, StorageTarget.USER);
	}
}

export class SnippetsService implements ISnippetsService {

	declare readonly _serviceBrand: undefined;

	private readonly _disposables = new DisposableStore();
	private readonly _pendingWork: Promise<any>[] = [];
	private readonly _files = new ResourceMap<SnippetFile>();
	private readonly _enablement: SnippetEnablement;
	private readonly _usageTimestamps: SnippetUsageTimestamps;

	constructor(
		@IEnvironmentService private readonly _environmentService: IEnvironmentService,
		@IUserDataProfileService private readonly _userDataProfileService: IUserDataProfileService,
		@IWorkspaceContextService private readonly _contextService: IWorkspaceContextService,
		@ILanguageService private readonly _languageService: ILanguageService,
		@ILogService private readonly _logService: ILogService,
		@IFileService private readonly _fileService: IFileService,
		@ITextFileService private readonly _textfileService: ITextFileService,
		@IExtensionResourceLoaderService private readonly _extensionResourceLoaderService: IExtensionResourceLoaderService,
		@ILifecycleService lifecycleService: ILifecycleService,
		@IInstantiationService instantiationService: IInstantiationService,
		@ILanguageConfigurationService languageConfigurationService: ILanguageConfigurationService,
	) {
		this._pendingWork.push(Promise.resolve(lifecycleService.when(LifecyclePhase.Restored).then(() => {
			this._initExtensionSnippets();
			this._initUserSnippets();
			this._initWorkspaceSnippets();
		})));

		setSnippetSuggestSupport(new SnippetCompletionProvider(this._languageService, this, languageConfigurationService));

		this._enablement = instantiationService.createInstance(SnippetEnablement);
		this._usageTimestamps = instantiationService.createInstance(SnippetUsageTimestamps);
	}

	dispose(): void {
		this._disposables.dispose();
	}

	isEnabled(snippet: Snippet): boolean {
		return !this._enablement.isIgnored(snippet.snippetIdentifier);
	}

	updateEnablement(snippet: Snippet, enabled: boolean): void {
		this._enablement.updateIgnored(snippet.snippetIdentifier, !enabled);
	}

	updateUsageTimestamp(snippet: Snippet): void {
		this._usageTimestamps.updateUsageTimestamp(snippet.snippetIdentifier);
	}

	private _joinSnippets(): Promise<any> {
		const promises = this._pendingWork.slice(0);
		this._pendingWork.length = 0;
		return Promise.all(promises);
	}

	async getSnippetFiles(): Promise<Iterable<SnippetFile>> {
		await this._joinSnippets();
		return this._files.values();
	}

	async getSnippets(languageId: string | undefined, opts?: ISnippetGetOptions): Promise<Snippet[]> {
		await this._joinSnippets();

		const result: Snippet[] = [];
		const promises: Promise<any>[] = [];

		if (languageId) {
			if (this._languageService.isRegisteredLanguageId(languageId)) {
				for (const file of this._files.values()) {
					promises.push(file.load()
						.then(file => file.select(languageId, result))
						.catch(err => this._logService.error(err, file.location.toString()))
					);
				}
			}
		} else {
			for (const file of this._files.values()) {
				promises.push(file.load()
					.then(file => insertInto(result, result.length, file.data))
					.catch(err => this._logService.error(err, file.location.toString()))
				);
			}
		}
		await Promise.all(promises);
		return this._filterAndSortSnippets(result, opts);
	}

	getSnippetsSync(languageId: string, opts?: ISnippetGetOptions): Snippet[] {
		const result: Snippet[] = [];
		if (this._languageService.isRegisteredLanguageId(languageId)) {
			for (const file of this._files.values()) {
				// kick off loading (which is a noop in case it's already loaded)
				// and optimistically collect snippets
				file.load().catch(_err => { /*ignore*/ });
				file.select(languageId, result);
			}
		}
		return this._filterAndSortSnippets(result, opts);
	}

	private _filterAndSortSnippets(snippets: Snippet[], opts?: ISnippetGetOptions): Snippet[] {

		const result: Snippet[] = [];

		for (const snippet of snippets) {
			if (!snippet.prefix && !opts?.includeNoPrefixSnippets) {
				// prefix or no-prefix wanted
				continue;
			}
			if (!this.isEnabled(snippet) && !opts?.includeDisabledSnippets) {
				// enabled or disabled wanted
				continue;
			}
			if (typeof opts?.fileTemplateSnippets === 'boolean' && opts.fileTemplateSnippets !== snippet.isFileTemplate) {
				// isTopLevel requested but mismatching
				continue;
			}
			result.push(snippet);
		}


		return result.sort((a, b) => {
			let result = 0;
			if (!opts?.noRecencySort) {
				const val1 = this._usageTimestamps.getUsageTimestamp(a.snippetIdentifier) ?? -1;
				const val2 = this._usageTimestamps.getUsageTimestamp(b.snippetIdentifier) ?? -1;
				result = val2 - val1;
			}
			if (result === 0) {
				result = this._compareSnippet(a, b);
			}
			return result;
		});
	}

	private _compareSnippet(a: Snippet, b: Snippet): number {
		if (a.snippetSource < b.snippetSource) {
			return -1;
		} else if (a.snippetSource > b.snippetSource) {
			return 1;
		} else if (a.source < b.source) {
			return -1;
		} else if (a.source > b.source) {
			return 1;
		} else if (a.name > b.name) {
			return 1;
		} else if (a.name < b.name) {
			return -1;
		} else {
			return 0;
		}
	}

	// --- loading, watching

	private _initExtensionSnippets(): void {
		snippetExt.point.setHandler(extensions => {

			for (const [key, value] of this._files) {
				if (value.source === SnippetSource.Extension) {
					this._files.delete(key);
				}
			}

			for (const extension of extensions) {
				for (const contribution of extension.value) {
					const validContribution = snippetExt.toValidSnippet(extension, contribution, this._languageService);
					if (!validContribution) {
						continue;
					}

					const file = this._files.get(validContribution.location);
					if (file) {
						if (file.defaultScopes) {
							file.defaultScopes.push(validContribution.language);
						} else {
							file.defaultScopes = [];
						}
					} else {
						const file = new SnippetFile(SnippetSource.Extension, validContribution.location, validContribution.language ? [validContribution.language] : undefined, extension.description, this._fileService, this._extensionResourceLoaderService);
						this._files.set(file.location, file);

						if (this._environmentService.isExtensionDevelopment) {
							file.load().then(file => {
								// warn about bad tabstop/variable usage
								if (file.data.some(snippet => snippet.isBogous)) {
									extension.collector.warn(localize(
										'badVariableUse',
										"One or more snippets from the extension '{0}' very likely confuse snippet-variables and snippet-placeholders (see https://code.visualstudio.com/docs/editor/userdefinedsnippets#_snippet-syntax for more details)",
										extension.description.name
									));
								}
							}, err => {
								// generic error
								extension.collector.warn(localize(
									'badFile',
									"The snippet file \"{0}\" could not be read.",
									file.location.toString()
								));
							});
						}

					}
				}
			}
		});
	}

	private _initWorkspaceSnippets(): void {
		// workspace stuff
		const disposables = new DisposableStore();
		const updateWorkspaceSnippets = () => {
			disposables.clear();
			this._pendingWork.push(this._initWorkspaceFolderSnippets(this._contextService.getWorkspace(), disposables));
		};
		this._disposables.add(disposables);
		this._disposables.add(this._contextService.onDidChangeWorkspaceFolders(updateWorkspaceSnippets));
		this._disposables.add(this._contextService.onDidChangeWorkbenchState(updateWorkspaceSnippets));
		updateWorkspaceSnippets();
	}

	private async _initWorkspaceFolderSnippets(workspace: IWorkspace, bucket: DisposableStore): Promise<any> {
		const promises = workspace.folders.map(async folder => {
			const snippetFolder = folder.toResource('.vscode');
			const value = await this._fileService.exists(snippetFolder);
			if (value) {
				this._initFolderSnippets(SnippetSource.Workspace, snippetFolder, bucket);
			} else {
				// watch
				bucket.add(this._fileService.onDidFilesChange(e => {
					if (e.contains(snippetFolder, FileChangeType.ADDED)) {
						this._initFolderSnippets(SnippetSource.Workspace, snippetFolder, bucket);
					}
				}));
			}
		});
		await Promise.all(promises);
	}

	private async _initUserSnippets(): Promise<any> {
		const disposables = new DisposableStore();
		const updateUserSnippets = async () => {
			disposables.clear();
			const userSnippetsFolder = this._userDataProfileService.currentProfile.snippetsHome;
			await this._fileService.createFolder(userSnippetsFolder);
			await this._initFolderSnippets(SnippetSource.User, userSnippetsFolder, disposables);
		};
		this._disposables.add(disposables);
		this._disposables.add(this._userDataProfileService.onDidChangeCurrentProfile(e => e.join((async () => {
			this._pendingWork.push(updateUserSnippets());
		})())));
		await updateUserSnippets();
	}

	private _initFolderSnippets(source: SnippetSource, folder: URI, bucket: DisposableStore): Promise<any> {
		const disposables = new DisposableStore();
		const addFolderSnippets = async () => {
			disposables.clear();
			if (!await this._fileService.exists(folder)) {
				return;
			}
			try {
				const stat = await this._fileService.resolve(folder);
				for (const entry of stat.children || []) {
					disposables.add(this._addSnippetFile(entry.resource, source));
				}
			} catch (err) {
				this._logService.error(`Failed snippets from folder '${folder.toString()}'`, err);
			}
		};

		bucket.add(this._textfileService.files.onDidSave(e => {
			if (resources.isEqualOrParent(e.model.resource, folder)) {
				addFolderSnippets();
			}
		}));
		bucket.add(watch(this._fileService, folder, addFolderSnippets));
		bucket.add(disposables);
		return addFolderSnippets();
	}

	private _addSnippetFile(uri: URI, source: SnippetSource): IDisposable {
		const ext = resources.extname(uri);
		if (source === SnippetSource.User && ext === '.json') {
			const langName = resources.basename(uri).replace(/\.json/, '');
			this._files.set(uri, new SnippetFile(source, uri, [langName], undefined, this._fileService, this._extensionResourceLoaderService));
		} else if (ext === '.code-snippets') {
			this._files.set(uri, new SnippetFile(source, uri, undefined, undefined, this._fileService, this._extensionResourceLoaderService));
		}
		return {
			dispose: () => this._files.delete(uri)
		};
	}
}


export interface ISimpleModel {
	getLineContent(lineNumber: number): string;
}

export function getNonWhitespacePrefix(model: ISimpleModel, position: Position): string {
	/**
	 * Do not analyze more characters
	 */
	const MAX_PREFIX_LENGTH = 100;

	const line = model.getLineContent(position.lineNumber).substr(0, position.column - 1);

	const minChIndex = Math.max(0, line.length - MAX_PREFIX_LENGTH);
	for (let chIndex = line.length - 1; chIndex >= minChIndex; chIndex--) {
		const ch = line.charAt(chIndex);

		if (/\s/.test(ch)) {
			return line.substr(chIndex + 1);
		}
	}

	if (minChIndex === 0) {
		return line;
	}

	return '';
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/snippets/browser/tabCompletion.ts]---
Location: vscode-main/src/vs/workbench/contrib/snippets/browser/tabCompletion.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode } from '../../../../base/common/keyCodes.js';
import { RawContextKey, IContextKeyService, ContextKeyExpr, IContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ISnippetsService } from './snippets.js';
import { getNonWhitespacePrefix } from './snippetsService.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { IEditorContribution } from '../../../../editor/common/editorCommon.js';
import { Range } from '../../../../editor/common/core/range.js';
import { registerEditorContribution, EditorCommand, registerEditorCommand, EditorContributionInstantiation } from '../../../../editor/browser/editorExtensions.js';
import { SnippetController2 } from '../../../../editor/contrib/snippet/browser/snippetController2.js';
import { showSimpleSuggestions } from '../../../../editor/contrib/suggest/browser/suggest.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { Snippet } from './snippetsFile.js';
import { SnippetCompletion } from './snippetCompletionProvider.js';
import { EditorOption } from '../../../../editor/common/config/editorOptions.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { EditorState, CodeEditorStateFlag } from '../../../../editor/contrib/editorState/browser/editorState.js';
import { ILanguageFeaturesService } from '../../../../editor/common/services/languageFeatures.js';
import { CompletionItemProvider } from '../../../../editor/common/languages.js';

export class TabCompletionController implements IEditorContribution {

	static readonly ID = 'editor.tabCompletionController';

	static readonly ContextKey = new RawContextKey<boolean>('hasSnippetCompletions', undefined);

	static get(editor: ICodeEditor): TabCompletionController | null {
		return editor.getContribution<TabCompletionController>(TabCompletionController.ID);
	}

	private readonly _hasSnippets: IContextKey<boolean>;
	private readonly _configListener: IDisposable;
	private _enabled?: boolean;
	private _selectionListener?: IDisposable;

	private _activeSnippets: Snippet[] = [];
	private _completionProvider?: IDisposable & CompletionItemProvider;

	constructor(
		private readonly _editor: ICodeEditor,
		@ISnippetsService private readonly _snippetService: ISnippetsService,
		@IClipboardService private readonly _clipboardService: IClipboardService,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
		@IContextKeyService contextKeyService: IContextKeyService,
	) {
		this._hasSnippets = TabCompletionController.ContextKey.bindTo(contextKeyService);
		this._configListener = this._editor.onDidChangeConfiguration(e => {
			if (e.hasChanged(EditorOption.tabCompletion)) {
				this._update();
			}
		});
		this._update();
	}

	dispose(): void {
		this._configListener.dispose();
		this._selectionListener?.dispose();
	}

	private _update(): void {
		const enabled = this._editor.getOption(EditorOption.tabCompletion) === 'onlySnippets';
		if (this._enabled !== enabled) {
			this._enabled = enabled;
			if (!this._enabled) {
				this._selectionListener?.dispose();
			} else {
				this._selectionListener = this._editor.onDidChangeCursorSelection(e => this._updateSnippets());
				if (this._editor.getModel()) {
					this._updateSnippets();
				}
			}
		}
	}

	private _updateSnippets(): void {

		// reset first
		this._activeSnippets = [];
		this._completionProvider?.dispose();

		if (!this._editor.hasModel()) {
			return;
		}

		// lots of dance for getting the
		const selection = this._editor.getSelection();
		const model = this._editor.getModel();
		model.tokenization.tokenizeIfCheap(selection.positionLineNumber);
		const id = model.getLanguageIdAtPosition(selection.positionLineNumber, selection.positionColumn);
		const snippets = this._snippetService.getSnippetsSync(id);

		if (!snippets) {
			// nothing for this language
			this._hasSnippets.set(false);
			return;
		}

		if (Range.isEmpty(selection)) {
			// empty selection -> real text (no whitespace) left of cursor
			const prefix = getNonWhitespacePrefix(model, selection.getPosition());
			if (prefix) {
				for (const snippet of snippets) {
					if (prefix.endsWith(snippet.prefix)) {
						this._activeSnippets.push(snippet);
					}
				}
			}

		} else if (!Range.spansMultipleLines(selection) && model.getValueLengthInRange(selection) <= 100) {
			// actual selection -> snippet must be a full match
			const selected = model.getValueInRange(selection);
			if (selected) {
				for (const snippet of snippets) {
					if (selected === snippet.prefix) {
						this._activeSnippets.push(snippet);
					}
				}
			}
		}

		const len = this._activeSnippets.length;
		if (len === 0) {
			this._hasSnippets.set(false);
		} else if (len === 1) {
			this._hasSnippets.set(true);
		} else {
			this._hasSnippets.set(true);
			this._completionProvider = {
				_debugDisplayName: 'tabCompletion',
				dispose: () => {
					registration.dispose();
				},
				provideCompletionItems: (_model, position) => {
					if (_model !== model || !selection.containsPosition(position)) {
						return;
					}
					const suggestions = this._activeSnippets.map(snippet => {
						const range = Range.fromPositions(position.delta(0, -snippet.prefix.length), position);
						return new SnippetCompletion(snippet, range);
					});
					return { suggestions };
				}
			};
			const registration = this._languageFeaturesService.completionProvider.register(
				{ language: model.getLanguageId(), pattern: model.uri.fsPath, scheme: model.uri.scheme },
				this._completionProvider
			);
		}
	}

	async performSnippetCompletions() {
		if (!this._editor.hasModel()) {
			return;
		}

		if (this._activeSnippets.length === 1) {
			// one -> just insert
			const [snippet] = this._activeSnippets;

			// async clipboard access might be required and in that case
			// we need to check if the editor has changed in flight and then
			// bail out (or be smarter than that)
			let clipboardText: string | undefined;
			if (snippet.needsClipboard) {
				const state = new EditorState(this._editor, CodeEditorStateFlag.Value | CodeEditorStateFlag.Position);
				clipboardText = await this._clipboardService.readText();
				if (!state.validate(this._editor)) {
					return;
				}
			}
			SnippetController2.get(this._editor)?.insert(snippet.codeSnippet, {
				overwriteBefore: snippet.prefix.length, overwriteAfter: 0,
				clipboardText
			});

		} else if (this._activeSnippets.length > 1) {
			// two or more -> show IntelliSense box
			if (this._completionProvider) {
				showSimpleSuggestions(this._editor, this._completionProvider);
			}
		}
	}
}

registerEditorContribution(TabCompletionController.ID, TabCompletionController, EditorContributionInstantiation.Eager); // eager because it needs to define a context key

const TabCompletionCommand = EditorCommand.bindToContribution<TabCompletionController>(TabCompletionController.get);

registerEditorCommand(new TabCompletionCommand({
	id: 'insertSnippet',
	precondition: TabCompletionController.ContextKey,
	handler: x => x.performSnippetCompletions(),
	kbOpts: {
		weight: KeybindingWeight.EditorContrib,
		kbExpr: ContextKeyExpr.and(
			EditorContextKeys.editorTextFocus,
			EditorContextKeys.tabDoesNotMoveFocus,
			SnippetController2.InSnippetMode.toNegated()
		),
		primary: KeyCode.Tab
	}
}));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/snippets/browser/commands/abstractSnippetsActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/snippets/browser/commands/abstractSnippetsActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EditorAction2 } from '../../../../../editor/browser/editorExtensions.js';
import { localize2 } from '../../../../../nls.js';
import { Action2, IAction2Options } from '../../../../../platform/actions/common/actions.js';

const defaultOptions = {
	category: localize2('snippets', "Snippets"),
} as const;

export abstract class SnippetsAction extends Action2 {

	constructor(desc: Readonly<IAction2Options>) {
		super({ ...defaultOptions, ...desc });
	}
}

export abstract class SnippetEditorAction extends EditorAction2 {

	constructor(desc: Readonly<IAction2Options>) {
		super({ ...defaultOptions, ...desc });
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/snippets/browser/commands/configureSnippets.ts]---
Location: vscode-main/src/vs/workbench/contrib/snippets/browser/commands/configureSnippets.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isValidBasename } from '../../../../../base/common/extpath.js';
import { extname } from '../../../../../base/common/path.js';
import { basename, joinPath } from '../../../../../base/common/resources.js';
import { URI } from '../../../../../base/common/uri.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { getIconClassesForLanguageId } from '../../../../../editor/common/services/getIconClasses.js';
import * as nls from '../../../../../nls.js';
import { MenuId } from '../../../../../platform/actions/common/actions.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { IQuickInputService, IQuickPickItem, QuickPickInput } from '../../../../../platform/quickinput/common/quickInput.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { SnippetsAction } from './abstractSnippetsActions.js';
import { ISnippetsService } from '../snippets.js';
import { SnippetSource } from '../snippetsFile.js';
import { ITextFileService } from '../../../../services/textfile/common/textfiles.js';
import { IUserDataProfileService } from '../../../../services/userDataProfile/common/userDataProfile.js';

namespace ISnippetPick {
	export function is(thing: object | undefined): thing is ISnippetPick {
		return !!thing && URI.isUri((<ISnippetPick>thing).filepath);
	}
}

interface ISnippetPick extends IQuickPickItem {
	filepath: URI;
	hint?: true;
}

async function computePicks(snippetService: ISnippetsService, userDataProfileService: IUserDataProfileService, languageService: ILanguageService, labelService: ILabelService) {

	const existing: ISnippetPick[] = [];
	const future: ISnippetPick[] = [];

	const seen = new Set<string>();
	const added = new Map<string, { snippet: ISnippetPick; detail: string }>();

	for (const file of await snippetService.getSnippetFiles()) {

		if (file.source === SnippetSource.Extension) {
			// skip extension snippets
			continue;
		}

		if (file.isGlobalSnippets) {

			await file.load();

			// list scopes for global snippets
			const names = new Set<string>();
			let source: string | undefined;

			outer: for (const snippet of file.data) {
				if (!source) {
					source = snippet.source;
				}

				for (const scope of snippet.scopes) {
					const name = languageService.getLanguageName(scope);
					if (name) {
						if (names.size >= 4) {
							names.add(`${name}...`);
							break outer;
						} else {
							names.add(name);
						}
					}
				}
			}

			const snippet: ISnippetPick = {
				label: basename(file.location),
				filepath: file.location,
				description: names.size === 0
					? nls.localize('global.scope', "(global)")
					: nls.localize('global.1', "({0})", [...names].join(', '))
			};
			existing.push(snippet);

			if (!source) {
				continue;
			}

			const detail = nls.localize('detail.label', "({0}) {1}", source, labelService.getUriLabel(file.location, { relative: true }));
			const lastItem = added.get(basename(file.location));
			if (lastItem) {
				snippet.detail = detail;
				lastItem.snippet.detail = lastItem.detail;
			}
			added.set(basename(file.location), { snippet, detail });

		} else {
			// language snippet
			const mode = basename(file.location).replace(/\.json$/, '');
			existing.push({
				label: basename(file.location),
				description: `(${languageService.getLanguageName(mode) ?? mode})`,
				filepath: file.location
			});
			seen.add(mode);
		}
	}

	const dir = userDataProfileService.currentProfile.snippetsHome;
	for (const languageId of languageService.getRegisteredLanguageIds()) {
		const label = languageService.getLanguageName(languageId);
		if (label && !seen.has(languageId)) {
			future.push({
				label: languageId,
				description: `(${label})`,
				filepath: joinPath(dir, `${languageId}.json`),
				hint: true,
				iconClasses: getIconClassesForLanguageId(languageId)
			});
		}
	}

	existing.sort((a, b) => {
		const a_ext = extname(a.filepath.path);
		const b_ext = extname(b.filepath.path);
		if (a_ext === b_ext) {
			return a.label.localeCompare(b.label);
		} else if (a_ext === '.code-snippets') {
			return -1;
		} else {
			return 1;
		}
	});

	future.sort((a, b) => {
		return a.label.localeCompare(b.label);
	});

	return { existing, future };
}

async function createSnippetFile(scope: string, defaultPath: URI, quickInputService: IQuickInputService, fileService: IFileService, textFileService: ITextFileService, opener: IOpenerService) {

	function createSnippetUri(input: string) {
		const filename = extname(input) !== '.code-snippets'
			? `${input}.code-snippets`
			: input;
		return joinPath(defaultPath, filename);
	}

	await fileService.createFolder(defaultPath);

	const input = await quickInputService.input({
		placeHolder: nls.localize('name', "Type snippet file name"),
		async validateInput(input) {
			if (!input) {
				return nls.localize('bad_name1', "Invalid file name");
			}
			if (!isValidBasename(input)) {
				return nls.localize('bad_name2', "'{0}' is not a valid file name", input);
			}
			if (await fileService.exists(createSnippetUri(input))) {
				return nls.localize('bad_name3', "'{0}' already exists", input);
			}
			return undefined;
		}
	});

	if (!input) {
		return undefined;
	}

	const resource = createSnippetUri(input);

	await textFileService.write(resource, [
		'{',
		'\t// Place your ' + scope + ' snippets here. Each snippet is defined under a snippet name and has a scope, prefix, body and ',
		'\t// description. Add comma separated ids of the languages where the snippet is applicable in the scope field. If scope ',
		'\t// is left empty or omitted, the snippet gets applied to all languages. The prefix is what is ',
		'\t// used to trigger the snippet and the body will be expanded and inserted. Possible variables are: ',
		'\t// $1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders. ',
		'\t// Placeholders with the same ids are connected.',
		'\t// Example:',
		'\t// "Print to console": {',
		'\t// \t"scope": "javascript,typescript",',
		'\t// \t"prefix": "log",',
		'\t// \t"body": [',
		'\t// \t\t"console.log(\'$1\');",',
		'\t// \t\t"$2"',
		'\t// \t],',
		'\t// \t"description": "Log output to console"',
		'\t// }',
		'}'
	].join('\n'));

	await opener.open(resource);
	return undefined;
}

async function createLanguageSnippetFile(pick: ISnippetPick, fileService: IFileService, textFileService: ITextFileService) {
	if (await fileService.exists(pick.filepath)) {
		return;
	}
	const contents = [
		'{',
		'\t// Place your snippets for ' + pick.label + ' here. Each snippet is defined under a snippet name and has a prefix, body and ',
		'\t// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:',
		'\t// $1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders. Placeholders with the ',
		'\t// same ids are connected.',
		'\t// Example:',
		'\t// "Print to console": {',
		'\t// \t"prefix": "log",',
		'\t// \t"body": [',
		'\t// \t\t"console.log(\'$1\');",',
		'\t// \t\t"$2"',
		'\t// \t],',
		'\t// \t"description": "Log output to console"',
		'\t// }',
		'}'
	].join('\n');
	await textFileService.write(pick.filepath, contents);
}

export class ConfigureSnippetsAction extends SnippetsAction {
	constructor() {
		super({
			id: 'workbench.action.openSnippets',
			title: nls.localize2('openSnippet.label', "Configure Snippets"),
			shortTitle: {
				...nls.localize2('userSnippets', "Snippets"),
				mnemonicTitle: nls.localize({ key: 'miOpenSnippets', comment: ['&& denotes a mnemonic'] }, "&&Snippets"),
			},
			f1: true,
			menu: [
				{ id: MenuId.MenubarPreferencesMenu, group: '2_configuration', order: 5 },
				{ id: MenuId.GlobalActivity, group: '2_configuration', order: 5 },
			]
		});
	}

	async run(accessor: ServicesAccessor): Promise<any> {

		const snippetService = accessor.get(ISnippetsService);
		const quickInputService = accessor.get(IQuickInputService);
		const opener = accessor.get(IOpenerService);
		const languageService = accessor.get(ILanguageService);
		const userDataProfileService = accessor.get(IUserDataProfileService);
		const workspaceService = accessor.get(IWorkspaceContextService);
		const fileService = accessor.get(IFileService);
		const textFileService = accessor.get(ITextFileService);
		const labelService = accessor.get(ILabelService);

		const picks = await computePicks(snippetService, userDataProfileService, languageService, labelService);
		const existing: QuickPickInput[] = picks.existing;

		type SnippetPick = IQuickPickItem & { uri: URI } & { scope: string };
		const globalSnippetPicks: SnippetPick[] = [{
			scope: nls.localize('new.global_scope', 'global'),
			label: nls.localize('new.global', "New Global Snippets file..."),
			uri: userDataProfileService.currentProfile.snippetsHome
		}];

		const workspaceSnippetPicks: SnippetPick[] = [];
		for (const folder of workspaceService.getWorkspace().folders) {
			workspaceSnippetPicks.push({
				scope: nls.localize('new.workspace_scope', "{0} workspace", folder.name),
				label: nls.localize('new.folder', "New Snippets file for '{0}'...", folder.name),
				uri: folder.toResource('.vscode')
			});
		}

		if (existing.length > 0) {
			existing.unshift({ type: 'separator', label: nls.localize('group.global', "Existing Snippets") });
			existing.push({ type: 'separator', label: nls.localize('new.global.sep', "New Snippets") });
		} else {
			existing.push({ type: 'separator', label: nls.localize('new.global.sep', "New Snippets") });
		}

		const pick = await quickInputService.pick(([] as QuickPickInput[]).concat(existing, globalSnippetPicks, workspaceSnippetPicks, picks.future), {
			placeHolder: nls.localize('openSnippet.pickLanguage', "Select Snippets File or Create Snippets"),
			matchOnDescription: true
		});

		if (globalSnippetPicks.indexOf(pick as SnippetPick) >= 0) {
			return createSnippetFile((pick as SnippetPick).scope, (pick as SnippetPick).uri, quickInputService, fileService, textFileService, opener);
		} else if (workspaceSnippetPicks.indexOf(pick as SnippetPick) >= 0) {
			return createSnippetFile((pick as SnippetPick).scope, (pick as SnippetPick).uri, quickInputService, fileService, textFileService, opener);
		} else if (ISnippetPick.is(pick)) {
			if (pick.hint) {
				await createLanguageSnippetFile(pick, fileService, textFileService);
			}
			return opener.open(pick.filepath);
		}

	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/snippets/browser/commands/fileTemplateSnippets.ts]---
Location: vscode-main/src/vs/workbench/contrib/snippets/browser/commands/fileTemplateSnippets.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { groupBy, isFalsyOrEmpty } from '../../../../../base/common/arrays.js';
import { compare } from '../../../../../base/common/strings.js';
import { getCodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { SnippetController2 } from '../../../../../editor/contrib/snippet/browser/snippetController2.js';
import { localize, localize2 } from '../../../../../nls.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IQuickInputService, IQuickPickItem, IQuickPickSeparator } from '../../../../../platform/quickinput/common/quickInput.js';
import { SnippetsAction } from './abstractSnippetsActions.js';
import { ISnippetsService } from '../snippets.js';
import { Snippet } from '../snippetsFile.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';

export class ApplyFileSnippetAction extends SnippetsAction {

	static readonly Id = 'workbench.action.populateFileFromSnippet';

	constructor() {
		super({
			id: ApplyFileSnippetAction.Id,
			title: localize2('label', "Fill File with Snippet"),
			f1: true,
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const snippetService = accessor.get(ISnippetsService);
		const quickInputService = accessor.get(IQuickInputService);
		const editorService = accessor.get(IEditorService);
		const langService = accessor.get(ILanguageService);

		const editor = getCodeEditor(editorService.activeTextEditorControl);
		if (!editor || !editor.hasModel()) {
			return;
		}

		const snippets = await snippetService.getSnippets(undefined, { fileTemplateSnippets: true, noRecencySort: true, includeNoPrefixSnippets: true });
		if (snippets.length === 0) {
			return;
		}

		const selection = await this._pick(quickInputService, langService, snippets);
		if (!selection) {
			return;
		}

		if (editor.hasModel()) {
			// apply snippet edit -> replaces everything
			SnippetController2.get(editor)?.apply([{
				range: editor.getModel().getFullModelRange(),
				template: selection.snippet.body
			}]);

			// set language if possible
			editor.getModel().setLanguage(langService.createById(selection.langId), ApplyFileSnippetAction.Id);

			editor.focus();
		}
	}

	private async _pick(quickInputService: IQuickInputService, langService: ILanguageService, snippets: Snippet[]) {

		// spread snippet onto each language it supports
		type SnippetAndLanguage = { langId: string; snippet: Snippet };
		const all: SnippetAndLanguage[] = [];
		for (const snippet of snippets) {
			if (isFalsyOrEmpty(snippet.scopes)) {
				all.push({ langId: '', snippet });
			} else {
				for (const langId of snippet.scopes) {
					all.push({ langId, snippet });
				}
			}
		}

		type SnippetAndLanguagePick = IQuickPickItem & { snippet: SnippetAndLanguage };
		const picks: (SnippetAndLanguagePick | IQuickPickSeparator)[] = [];

		const groups = groupBy(all, (a, b) => compare(a.langId, b.langId));

		for (const group of groups) {
			let first = true;
			for (const item of group) {

				if (first) {
					picks.push({
						type: 'separator',
						label: langService.getLanguageName(item.langId) ?? item.langId
					});
					first = false;
				}

				picks.push({
					snippet: item,
					label: item.snippet.prefix || item.snippet.name,
					detail: item.snippet.description
				});
			}
		}

		const pick = await quickInputService.pick(picks, {
			placeHolder: localize('placeholder', 'Select a snippet'),
			matchOnDetail: true,
		});

		return pick?.snippet;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/snippets/browser/commands/insertSnippet.ts]---
Location: vscode-main/src/vs/workbench/contrib/snippets/browser/commands/insertSnippet.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ICodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { EditorContextKeys } from '../../../../../editor/common/editorContextKeys.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { SnippetController2 } from '../../../../../editor/contrib/snippet/browser/snippetController2.js';
import * as nls from '../../../../../nls.js';
import { IClipboardService } from '../../../../../platform/clipboard/common/clipboardService.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { SnippetEditorAction } from './abstractSnippetsActions.js';
import { pickSnippet } from '../snippetPicker.js';
import { ISnippetsService } from '../snippets.js';
import { Snippet, SnippetSource } from '../snippetsFile.js';

class Args {

	static fromUser(arg: any): Args {
		if (!arg || typeof arg !== 'object') {
			return Args._empty;
		}
		let { snippet, name, langId } = arg;
		if (typeof snippet !== 'string') {
			snippet = undefined;
		}
		if (typeof name !== 'string') {
			name = undefined;
		}
		if (typeof langId !== 'string') {
			langId = undefined;
		}
		return new Args(snippet, name, langId);
	}

	private static readonly _empty = new Args(undefined, undefined, undefined);

	private constructor(
		public readonly snippet: string | undefined,
		public readonly name: string | undefined,
		public readonly langId: string | undefined
	) { }
}

export class InsertSnippetAction extends SnippetEditorAction {

	constructor() {
		super({
			id: 'editor.action.insertSnippet',
			title: nls.localize2('snippet.suggestions.label', "Insert Snippet"),
			f1: true,
			precondition: EditorContextKeys.writable,
			metadata: {
				description: `Insert Snippet`,
				args: [{
					name: 'args',
					schema: {
						'type': 'object',
						'properties': {
							'snippet': {
								'type': 'string'
							},
							'langId': {
								'type': 'string',

							},
							'name': {
								'type': 'string'
							}
						},
					}
				}]
			}
		});
	}

	async runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, arg: any) {

		const languageService = accessor.get(ILanguageService);
		const snippetService = accessor.get(ISnippetsService);

		if (!editor.hasModel()) {
			return;
		}

		const clipboardService = accessor.get(IClipboardService);
		const instaService = accessor.get(IInstantiationService);

		const snippet = await new Promise<Snippet | undefined>((resolve, reject) => {

			const { lineNumber, column } = editor.getPosition();
			const { snippet, name, langId } = Args.fromUser(arg);

			if (snippet) {
				return resolve(new Snippet(
					false,
					[],
					'',
					'',
					'',
					snippet,
					'',
					SnippetSource.User,
					`random/${Math.random()}`
				));
			}

			let languageId: string;
			if (langId) {
				if (!languageService.isRegisteredLanguageId(langId)) {
					return resolve(undefined);
				}
				languageId = langId;
			} else {
				editor.getModel().tokenization.tokenizeIfCheap(lineNumber);
				languageId = editor.getModel().getLanguageIdAtPosition(lineNumber, column);

				// validate the `languageId` to ensure this is a user
				// facing language with a name and the chance to have
				// snippets, else fall back to the outer language
				if (!languageService.getLanguageName(languageId)) {
					languageId = editor.getModel().getLanguageId();
				}
			}

			if (name) {
				// take selected snippet
				snippetService.getSnippets(languageId, { includeNoPrefixSnippets: true })
					.then(snippets => snippets.find(snippet => snippet.name === name))
					.then(resolve, reject);

			} else {
				// let user pick a snippet
				resolve(instaService.invokeFunction(pickSnippet, languageId));
			}
		});

		if (!snippet) {
			return;
		}
		let clipboardText: string | undefined;
		if (snippet.needsClipboard) {
			clipboardText = await clipboardService.readText();
		}
		editor.focus();
		SnippetController2.get(editor)?.insert(snippet.codeSnippet, { clipboardText });
		snippetService.updateUsageTimestamp(snippet);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/snippets/browser/commands/surroundWithSnippet.ts]---
Location: vscode-main/src/vs/workbench/contrib/snippets/browser/commands/surroundWithSnippet.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ICodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { EditorContextKeys } from '../../../../../editor/common/editorContextKeys.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { SnippetController2 } from '../../../../../editor/contrib/snippet/browser/snippetController2.js';
import { IClipboardService } from '../../../../../platform/clipboard/common/clipboardService.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { SnippetEditorAction } from './abstractSnippetsActions.js';
import { pickSnippet } from '../snippetPicker.js';
import { Snippet } from '../snippetsFile.js';
import { ISnippetsService } from '../snippets.js';
import { localize2 } from '../../../../../nls.js';

export async function getSurroundableSnippets(snippetsService: ISnippetsService, model: ITextModel, position: Position, includeDisabledSnippets: boolean): Promise<Snippet[]> {

	const { lineNumber, column } = position;
	model.tokenization.tokenizeIfCheap(lineNumber);
	const languageId = model.getLanguageIdAtPosition(lineNumber, column);

	const allSnippets = await snippetsService.getSnippets(languageId, { includeNoPrefixSnippets: true, includeDisabledSnippets });
	return allSnippets.filter(snippet => snippet.usesSelection);
}

export class SurroundWithSnippetEditorAction extends SnippetEditorAction {

	static readonly options = {
		id: 'editor.action.surroundWithSnippet',
		title: localize2('label', "Surround with Snippet...")
	};

	constructor() {
		super({
			...SurroundWithSnippetEditorAction.options,
			precondition: ContextKeyExpr.and(
				EditorContextKeys.writable,
				EditorContextKeys.hasNonEmptySelection
			),
			f1: true,
		});
	}

	async runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor) {
		if (!editor.hasModel()) {
			return;
		}

		const instaService = accessor.get(IInstantiationService);
		const snippetsService = accessor.get(ISnippetsService);
		const clipboardService = accessor.get(IClipboardService);

		const snippets = await getSurroundableSnippets(snippetsService, editor.getModel(), editor.getPosition(), true);
		if (!snippets.length) {
			return;
		}

		const snippet = await instaService.invokeFunction(pickSnippet, snippets);
		if (!snippet) {
			return;
		}

		let clipboardText: string | undefined;
		if (snippet.needsClipboard) {
			clipboardText = await clipboardService.readText();
		}

		editor.focus();
		SnippetController2.get(editor)?.insert(snippet.codeSnippet, { clipboardText });
		snippetsService.updateUsageTimestamp(snippet);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/snippets/test/browser/snippetFile.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/snippets/test/browser/snippetFile.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { SnippetFile, Snippet, SnippetSource } from '../../browser/snippetsFile.js';
import { URI } from '../../../../../base/common/uri.js';
import { SnippetParser } from '../../../../../editor/contrib/snippet/browser/snippetParser.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('Snippets', function () {

	ensureNoDisposablesAreLeakedInTestSuite();

	class TestSnippetFile extends SnippetFile {
		constructor(filepath: URI, snippets: Snippet[]) {
			super(SnippetSource.Extension, filepath, undefined, undefined, undefined!, undefined!);
			this.data.push(...snippets);
		}
	}

	test('SnippetFile#select', () => {
		let file = new TestSnippetFile(URI.file('somepath/foo.code-snippets'), []);
		let bucket: Snippet[] = [];
		file.select('', bucket);
		assert.strictEqual(bucket.length, 0);

		file = new TestSnippetFile(URI.file('somepath/foo.code-snippets'), [
			new Snippet(false, ['foo'], 'FooSnippet1', 'foo', '', 'snippet', 'test', SnippetSource.User, generateUuid()),
			new Snippet(false, ['foo'], 'FooSnippet2', 'foo', '', 'snippet', 'test', SnippetSource.User, generateUuid()),
			new Snippet(false, ['bar'], 'BarSnippet1', 'foo', '', 'snippet', 'test', SnippetSource.User, generateUuid()),
			new Snippet(false, ['bar.comment'], 'BarSnippet2', 'foo', '', 'snippet', 'test', SnippetSource.User, generateUuid()),
			new Snippet(false, ['bar.strings'], 'BarSnippet2', 'foo', '', 'snippet', 'test', SnippetSource.User, generateUuid()),
			new Snippet(false, ['bazz', 'bazz'], 'BazzSnippet1', 'foo', '', 'snippet', 'test', SnippetSource.User, generateUuid()),
		]);

		bucket = [];
		file.select('foo', bucket);
		assert.strictEqual(bucket.length, 2);

		bucket = [];
		file.select('fo', bucket);
		assert.strictEqual(bucket.length, 0);

		bucket = [];
		file.select('bar', bucket);
		assert.strictEqual(bucket.length, 1);

		bucket = [];
		file.select('bar.comment', bucket);
		assert.strictEqual(bucket.length, 2);

		bucket = [];
		file.select('bazz', bucket);
		assert.strictEqual(bucket.length, 1);
	});

	test('SnippetFile#select - any scope', function () {

		const file = new TestSnippetFile(URI.file('somepath/foo.code-snippets'), [
			new Snippet(false, [], 'AnySnippet1', 'foo', '', 'snippet', 'test', SnippetSource.User, generateUuid()),
			new Snippet(false, ['foo'], 'FooSnippet1', 'foo', '', 'snippet', 'test', SnippetSource.User, generateUuid()),
		]);

		const bucket: Snippet[] = [];
		file.select('foo', bucket);
		assert.strictEqual(bucket.length, 2);

	});

	test('Snippet#needsClipboard', function () {

		function assertNeedsClipboard(body: string, expected: boolean): void {
			const snippet = new Snippet(false, ['foo'], 'FooSnippet1', 'foo', '', body, 'test', SnippetSource.User, generateUuid());
			assert.strictEqual(snippet.needsClipboard, expected);

			assert.strictEqual(SnippetParser.guessNeedsClipboard(body), expected);
		}

		assertNeedsClipboard('foo$CLIPBOARD', true);
		assertNeedsClipboard('${CLIPBOARD}', true);
		assertNeedsClipboard('foo${CLIPBOARD}bar', true);
		assertNeedsClipboard('foo$clipboard', false);
		assertNeedsClipboard('foo${clipboard}', false);
		assertNeedsClipboard('baba', false);
	});

	test('Snippet#isTrivial', function () {

		function assertIsTrivial(body: string, expected: boolean): void {
			const snippet = new Snippet(false, ['foo'], 'FooSnippet1', 'foo', '', body, 'test', SnippetSource.User, generateUuid());
			assert.strictEqual(snippet.isTrivial, expected);
		}

		assertIsTrivial('foo', true);
		assertIsTrivial('foo$0', true);
		assertIsTrivial('foo$0bar', false);
		assertIsTrivial('foo$1', false);
		assertIsTrivial('foo$1$0', false);
		assertIsTrivial('${1:foo}', false);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/snippets/test/browser/snippetsRegistry.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/snippets/test/browser/snippetsRegistry.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { getNonWhitespacePrefix } from '../../browser/snippetsService.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('getNonWhitespacePrefix', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function assertGetNonWhitespacePrefix(line: string, column: number, expected: string): void {
		const model = {
			getLineContent: (lineNumber: number) => line
		};
		const actual = getNonWhitespacePrefix(model, new Position(1, column));
		assert.strictEqual(actual, expected);
	}

	test('empty line', () => {
		assertGetNonWhitespacePrefix('', 1, '');
	});

	test('singleWordLine', () => {
		assertGetNonWhitespacePrefix('something', 1, '');
		assertGetNonWhitespacePrefix('something', 2, 's');
		assertGetNonWhitespacePrefix('something', 3, 'so');
		assertGetNonWhitespacePrefix('something', 4, 'som');
		assertGetNonWhitespacePrefix('something', 5, 'some');
		assertGetNonWhitespacePrefix('something', 6, 'somet');
		assertGetNonWhitespacePrefix('something', 7, 'someth');
		assertGetNonWhitespacePrefix('something', 8, 'somethi');
		assertGetNonWhitespacePrefix('something', 9, 'somethin');
		assertGetNonWhitespacePrefix('something', 10, 'something');
	});

	test('two word line', () => {
		assertGetNonWhitespacePrefix('something interesting', 1, '');
		assertGetNonWhitespacePrefix('something interesting', 2, 's');
		assertGetNonWhitespacePrefix('something interesting', 3, 'so');
		assertGetNonWhitespacePrefix('something interesting', 4, 'som');
		assertGetNonWhitespacePrefix('something interesting', 5, 'some');
		assertGetNonWhitespacePrefix('something interesting', 6, 'somet');
		assertGetNonWhitespacePrefix('something interesting', 7, 'someth');
		assertGetNonWhitespacePrefix('something interesting', 8, 'somethi');
		assertGetNonWhitespacePrefix('something interesting', 9, 'somethin');
		assertGetNonWhitespacePrefix('something interesting', 10, 'something');
		assertGetNonWhitespacePrefix('something interesting', 11, '');
		assertGetNonWhitespacePrefix('something interesting', 12, 'i');
		assertGetNonWhitespacePrefix('something interesting', 13, 'in');
		assertGetNonWhitespacePrefix('something interesting', 14, 'int');
		assertGetNonWhitespacePrefix('something interesting', 15, 'inte');
		assertGetNonWhitespacePrefix('something interesting', 16, 'inter');
		assertGetNonWhitespacePrefix('something interesting', 17, 'intere');
		assertGetNonWhitespacePrefix('something interesting', 18, 'interes');
		assertGetNonWhitespacePrefix('something interesting', 19, 'interest');
		assertGetNonWhitespacePrefix('something interesting', 20, 'interesti');
		assertGetNonWhitespacePrefix('something interesting', 21, 'interestin');
		assertGetNonWhitespacePrefix('something interesting', 22, 'interesting');
	});

	test('many separators', () => {
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions?redirectlocale=en-US&redirectslug=JavaScript%2FGuide%2FRegular_Expressions#special-white-space
		// \s matches a single white space character, including space, tab, form feed, line feed.
		// Equivalent to [ \f\n\r\t\v\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff].

		assertGetNonWhitespacePrefix('something interesting', 22, 'interesting');
		assertGetNonWhitespacePrefix('something\tinteresting', 22, 'interesting');
		assertGetNonWhitespacePrefix('something\finteresting', 22, 'interesting');
		assertGetNonWhitespacePrefix('something\vinteresting', 22, 'interesting');
		assertGetNonWhitespacePrefix('something\u00a0interesting', 22, 'interesting');
		assertGetNonWhitespacePrefix('something\u2000interesting', 22, 'interesting');
		assertGetNonWhitespacePrefix('something\u2028interesting', 22, 'interesting');
		assertGetNonWhitespacePrefix('something\u3000interesting', 22, 'interesting');
		assertGetNonWhitespacePrefix('something\ufeffinteresting', 22, 'interesting');

	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/snippets/test/browser/snippetsRewrite.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/snippets/test/browser/snippetsRewrite.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Snippet, SnippetSource } from '../../browser/snippetsFile.js';

suite('SnippetRewrite', function () {

	ensureNoDisposablesAreLeakedInTestSuite();

	function assertRewrite(input: string, expected: string | boolean): void {
		const actual = new Snippet(false, ['foo'], 'foo', 'foo', 'foo', input, 'foo', SnippetSource.User, generateUuid());
		if (typeof expected === 'boolean') {
			assert.strictEqual(actual.codeSnippet, input);
		} else {
			assert.strictEqual(actual.codeSnippet, expected);
		}
	}

	test('bogous variable rewrite', function () {

		assertRewrite('foo', false);
		assertRewrite('hello $1 world$0', false);

		assertRewrite('$foo and $foo', '${1:foo} and ${1:foo}');
		assertRewrite('$1 and $SELECTION and $foo', '$1 and ${SELECTION} and ${2:foo}');


		assertRewrite(
			[
				'for (var ${index} = 0; ${index} < ${array}.length; ${index}++) {',
				'\tvar ${element} = ${array}[${index}];',
				'\t$0',
				'}'
			].join('\n'),
			[
				'for (var ${1:index} = 0; ${1:index} < ${2:array}.length; ${1:index}++) {',
				'\tvar ${3:element} = ${2:array}[${1:index}];',
				'\t$0',
				'\\}'
			].join('\n')
		);
	});

	test('Snippet choices: unable to escape comma and pipe, #31521', function () {
		assertRewrite('console.log(${1|not\\, not, five, 5, 1   23|});', false);
	});

	test('lazy bogous variable rewrite', function () {
		const snippet = new Snippet(false, ['fooLang'], 'foo', 'prefix', 'desc', 'This is ${bogous} because it is a ${var}', 'source', SnippetSource.Extension, generateUuid());
		assert.strictEqual(snippet.body, 'This is ${bogous} because it is a ${var}');
		assert.strictEqual(snippet.codeSnippet, 'This is ${1:bogous} because it is a ${2:var}');
		assert.strictEqual(snippet.isBogous, true);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/snippets/test/browser/snippetsService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/snippets/test/browser/snippetsService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { SnippetCompletion, SnippetCompletionProvider } from '../../browser/snippetCompletionProvider.js';
import { IPosition, Position } from '../../../../../editor/common/core/position.js';
import { createModelServices, instantiateTextModel } from '../../../../../editor/test/common/testTextModel.js';
import { ISnippetsService } from '../../browser/snippets.js';
import { Snippet, SnippetSource } from '../../browser/snippetsFile.js';
import { CompletionContext, CompletionItemLabel, CompletionItemRanges, CompletionTriggerKind } from '../../../../../editor/common/languages.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { TestLanguageConfigurationService } from '../../../../../editor/test/common/modes/testLanguageConfigurationService.js';
import { EditOperation } from '../../../../../editor/common/core/editOperation.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { CompletionModel } from '../../../../../editor/contrib/suggest/browser/completionModel.js';
import { CompletionItem } from '../../../../../editor/contrib/suggest/browser/suggest.js';
import { WordDistance } from '../../../../../editor/contrib/suggest/browser/wordDistance.js';
import { EditorOptions } from '../../../../../editor/common/config/editorOptions.js';

class SimpleSnippetService implements ISnippetsService {
	declare readonly _serviceBrand: undefined;
	constructor(readonly snippets: Snippet[]) { }
	getSnippets() {
		return Promise.resolve(this.getSnippetsSync());
	}
	getSnippetsSync(): Snippet[] {
		return this.snippets;
	}
	getSnippetFiles(): any {
		throw new Error();
	}
	isEnabled(): boolean {
		throw new Error();
	}
	updateEnablement(): void {
		throw new Error();
	}
	updateUsageTimestamp(snippet: Snippet): void {
		throw new Error();
	}
}

suite('SnippetsService', function () {
	const defaultCompletionContext: CompletionContext = { triggerKind: CompletionTriggerKind.Invoke };

	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;
	let languageService: ILanguageService;
	let snippetService: ISnippetsService;

	setup(function () {
		disposables = new DisposableStore();
		instantiationService = createModelServices(disposables);
		languageService = instantiationService.get(ILanguageService);
		disposables.add(languageService.registerLanguage({
			id: 'fooLang',
			extensions: ['.fooLang',]
		}));
		snippetService = new SimpleSnippetService([new Snippet(
			false,
			['fooLang'],
			'barTest',
			'bar',
			'',
			'barCodeSnippet',
			'',
			SnippetSource.User,
			generateUuid()
		), new Snippet(
			false,
			['fooLang'],
			'bazzTest',
			'bazz',
			'',
			'bazzCodeSnippet',
			'',
			SnippetSource.User,
			generateUuid()
		)]);
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	async function asCompletionModel(model: ITextModel, position: IPosition, provider: SnippetCompletionProvider, context: CompletionContext = defaultCompletionContext) {

		const list = await provider.provideCompletionItems(model, Position.lift(position), context);

		const result = new CompletionModel(list.suggestions.map(s => {
			return new CompletionItem(position, s, list, provider);
		}),
			position.column,
			{ characterCountDelta: 0, leadingLineContent: model.getLineContent(position.lineNumber).substring(0, position.column - 1) },
			WordDistance.None, EditorOptions.suggest.defaultValue, EditorOptions.snippetSuggestions.defaultValue, undefined
		);

		return result;
	}

	test('snippet completions - simple', async function () {

		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));
		const model = disposables.add(instantiateTextModel(instantiationService, '', 'fooLang'));

		await provider.provideCompletionItems(model, new Position(1, 1), defaultCompletionContext)!.then(result => {
			assert.strictEqual(result.incomplete, undefined);
			assert.strictEqual(result.suggestions.length, 2);
		});

		const completions = await asCompletionModel(model, new Position(1, 1), provider);
		assert.strictEqual(completions.items.length, 2);
	});

	test('snippet completions - simple 2', async function () {

		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));
		const model = disposables.add(instantiateTextModel(instantiationService, 'hello ', 'fooLang'));

		await provider.provideCompletionItems(model, new Position(1, 6) /* hello| */, defaultCompletionContext)!.then(result => {
			assert.strictEqual(result.incomplete, undefined);
			assert.strictEqual(result.suggestions.length, 0);
		});

		await provider.provideCompletionItems(model, new Position(1, 7) /* hello |*/, defaultCompletionContext)!.then(result => {
			assert.strictEqual(result.incomplete, undefined);
			assert.strictEqual(result.suggestions.length, 2);
		});

		const completions1 = await asCompletionModel(model, new Position(1, 6)/* hello| */, provider);
		assert.strictEqual(completions1.items.length, 0);

		const completions2 = await asCompletionModel(model, new Position(1, 7)/* hello |*/, provider);
		assert.strictEqual(completions2.items.length, 2);
	});

	test('snippet completions - with prefix', async function () {

		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));
		const model = disposables.add(instantiateTextModel(instantiationService, 'bar', 'fooLang'));

		await provider.provideCompletionItems(model, new Position(1, 4), defaultCompletionContext)!.then(result => {
			assert.strictEqual(result.incomplete, undefined);
			assert.strictEqual(result.suggestions.length, 1);
			assert.deepStrictEqual(result.suggestions[0].label, {
				label: 'bar',
				description: 'barTest'
			});
			assert.strictEqual((result.suggestions[0].range as CompletionItemRanges).insert.startColumn, 1);
			assert.strictEqual(result.suggestions[0].insertText, 'barCodeSnippet');
		});

		const completions = await asCompletionModel(model, new Position(1, 4), provider);
		assert.strictEqual(completions.items.length, 1);
		assert.deepStrictEqual(completions.items[0].completion.label, {
			label: 'bar',
			description: 'barTest'
		});
		assert.strictEqual((completions.items[0].completion.range as CompletionItemRanges).insert.startColumn, 1);
		assert.strictEqual(completions.items[0].completion.insertText, 'barCodeSnippet');
	});

	test('snippet completions - with different prefixes', async function () {
		snippetService = new SimpleSnippetService([new Snippet(
			false,
			['fooLang'],
			'barTest',
			'bar',
			'',
			's1',
			'',
			SnippetSource.User,
			generateUuid()
		), new Snippet(
			false,
			['fooLang'],
			'name',
			'bar-bar',
			'',
			's2',
			'',
			SnippetSource.User,
			generateUuid()
		)]);

		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));
		const model = disposables.add(instantiateTextModel(instantiationService, 'bar-bar', 'fooLang'));

		{
			await provider.provideCompletionItems(model, new Position(1, 3), defaultCompletionContext)!.then(result => {
				assert.strictEqual(result.incomplete, undefined);
				assert.strictEqual(result.suggestions.length, 2);
				assert.deepStrictEqual(result.suggestions[0].label, {
					label: 'bar',
					description: 'barTest'
				});
				assert.strictEqual(result.suggestions[0].insertText, 's1');
				assert.strictEqual((result.suggestions[0].range as CompletionItemRanges).insert.startColumn, 1);
				assert.deepStrictEqual(result.suggestions[1].label, {
					label: 'bar-bar',
					description: 'name'
				});
				assert.strictEqual(result.suggestions[1].insertText, 's2');
				assert.strictEqual((result.suggestions[1].range as CompletionItemRanges).insert.startColumn, 1);
			});

			const completions = await asCompletionModel(model, new Position(1, 3), provider);
			assert.strictEqual(completions.items.length, 2);
			assert.deepStrictEqual(completions.items[0].completion.label, {
				label: 'bar',
				description: 'barTest'
			});
			assert.strictEqual(completions.items[0].completion.insertText, 's1');
			assert.strictEqual((completions.items[0].completion.range as CompletionItemRanges).insert.startColumn, 1);
			assert.deepStrictEqual(completions.items[1].completion.label, {
				label: 'bar-bar',
				description: 'name'
			});
			assert.strictEqual(completions.items[1].completion.insertText, 's2');
			assert.strictEqual((completions.items[1].completion.range as CompletionItemRanges).insert.startColumn, 1);
		}

		{
			await provider.provideCompletionItems(model, new Position(1, 5), defaultCompletionContext)!.then(result => {
				assert.strictEqual(result.incomplete, undefined);
				assert.strictEqual(result.suggestions.length, 2);

				const [first, second] = result.suggestions;

				assert.deepStrictEqual(first.label, {
					label: 'bar',
					description: 'barTest'
				});
				assert.strictEqual(first.insertText, 's1');
				assert.strictEqual((first.range as CompletionItemRanges).insert.startColumn, 5);

				assert.deepStrictEqual(second.label, {
					label: 'bar-bar',
					description: 'name'
				});
				assert.strictEqual(second.insertText, 's2');
				assert.strictEqual((second.range as CompletionItemRanges).insert.startColumn, 1);
			});

			const completions = await asCompletionModel(model, new Position(1, 5), provider);
			assert.strictEqual(completions.items.length, 2);

			const [first, second] = completions.items.map(i => i.completion);

			assert.deepStrictEqual(first.label, {
				label: 'bar-bar',
				description: 'name'
			});
			assert.strictEqual(first.insertText, 's2');
			assert.strictEqual((first.range as CompletionItemRanges).insert.startColumn, 1);

			assert.deepStrictEqual(second.label, {
				label: 'bar',
				description: 'barTest'
			});
			assert.strictEqual(second.insertText, 's1');
			assert.strictEqual((second.range as CompletionItemRanges).insert.startColumn, 5);
		}

		{
			await provider.provideCompletionItems(model, new Position(1, 6), defaultCompletionContext)!.then(result => {
				assert.strictEqual(result.incomplete, undefined);
				assert.strictEqual(result.suggestions.length, 2);
				assert.deepStrictEqual(result.suggestions[0].label, {
					label: 'bar',
					description: 'barTest'
				});
				assert.strictEqual(result.suggestions[0].insertText, 's1');
				assert.strictEqual((result.suggestions[0].range as CompletionItemRanges).insert.startColumn, 5);
				assert.deepStrictEqual(result.suggestions[1].label, {
					label: 'bar-bar',
					description: 'name'
				});
				assert.strictEqual(result.suggestions[1].insertText, 's2');
				assert.strictEqual((result.suggestions[1].range as CompletionItemRanges).insert.startColumn, 1);
			});

			const completions = await asCompletionModel(model, new Position(1, 6), provider);
			assert.strictEqual(completions.items.length, 2);
			assert.deepStrictEqual(completions.items[0].completion.label, {
				label: 'bar-bar',
				description: 'name'
			});
			assert.strictEqual(completions.items[0].completion.insertText, 's2');
			assert.strictEqual((completions.items[0].completion.range as CompletionItemRanges).insert.startColumn, 1);
			assert.deepStrictEqual(completions.items[1].completion.label, {
				label: 'bar',
				description: 'barTest'
			});
			assert.strictEqual(completions.items[1].completion.insertText, 's1');
			assert.strictEqual((completions.items[1].completion.range as CompletionItemRanges).insert.startColumn, 5);
		}
	});

	test('Cannot use "<?php" as user snippet prefix anymore, #26275', async function () {
		snippetService = new SimpleSnippetService([new Snippet(
			false,
			['fooLang'],
			'',
			'<?php',
			'',
			'insert me',
			'',
			SnippetSource.User,
			generateUuid()
		)]);

		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));

		let model = instantiateTextModel(instantiationService, '\t<?php', 'fooLang');
		await provider.provideCompletionItems(model, new Position(1, 7), defaultCompletionContext)!.then(result => {
			assert.strictEqual(result.suggestions.length, 1);
		});
		const completions1 = await asCompletionModel(model, new Position(1, 7), provider);
		assert.strictEqual(completions1.items.length, 1);

		model.dispose();
		model = instantiateTextModel(instantiationService, '\t<?', 'fooLang');
		await provider.provideCompletionItems(model, new Position(1, 4), defaultCompletionContext).then(result => {
			assert.strictEqual(result.suggestions.length, 1);
			assert.strictEqual((result.suggestions[0].range as CompletionItemRanges).insert.startColumn, 2);
		});
		const completions2 = await asCompletionModel(model, new Position(1, 4), provider);
		assert.strictEqual(completions2.items.length, 1);
		assert.strictEqual((completions2.items[0].completion.range as CompletionItemRanges).insert.startColumn, 2);

		model.dispose();
		model = instantiateTextModel(instantiationService, 'a<?', 'fooLang');
		await provider.provideCompletionItems(model, new Position(1, 4), defaultCompletionContext)!.then(result => {
			assert.strictEqual(result.suggestions.length, 1);
			assert.strictEqual((result.suggestions[0].range as CompletionItemRanges).insert.startColumn, 2);
		});
		const completions3 = await asCompletionModel(model, new Position(1, 4), provider);
		assert.strictEqual(completions3.items.length, 1);
		assert.strictEqual((completions3.items[0].completion.range as CompletionItemRanges).insert.startColumn, 2);
		model.dispose();
	});

	test('No user snippets in suggestions, when inside the code, #30508', async function () {

		snippetService = new SimpleSnippetService([new Snippet(
			false,
			['fooLang'],
			'',
			'foo',
			'',
			'<foo>$0</foo>',
			'',
			SnippetSource.User,
			generateUuid()
		)]);

		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));

		const model = disposables.add(instantiateTextModel(instantiationService, '<head>\n\t\n>/head>', 'fooLang'));
		await provider.provideCompletionItems(model, new Position(1, 1), defaultCompletionContext)!.then(result => {
			assert.strictEqual(result.suggestions.length, 1);
		});
		const completions = await asCompletionModel(model, new Position(1, 1), provider);
		assert.strictEqual(completions.items.length, 1);


		await provider.provideCompletionItems(model, new Position(2, 2), defaultCompletionContext).then(result => {
			assert.strictEqual(result.suggestions.length, 1);
		});
		const completions2 = await asCompletionModel(model, new Position(2, 2), provider);
		assert.strictEqual(completions2.items.length, 1);

	});

	test('SnippetSuggest - ensure extension snippets come last ', async function () {
		snippetService = new SimpleSnippetService([new Snippet(
			false,
			['fooLang'],
			'second',
			'second',
			'',
			'second',
			'',
			SnippetSource.Extension,
			generateUuid()
		), new Snippet(
			false,
			['fooLang'],
			'first',
			'first',
			'',
			'first',
			'',
			SnippetSource.User,
			generateUuid()
		)]);

		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));

		const model = disposables.add(instantiateTextModel(instantiationService, '', 'fooLang'));
		await provider.provideCompletionItems(model, new Position(1, 1), defaultCompletionContext)!.then(result => {
			assert.strictEqual(result.suggestions.length, 2);
			const [first, second] = result.suggestions;
			assert.deepStrictEqual(first.label, {
				label: 'first',
				description: 'first'
			});
			assert.deepStrictEqual(second.label, {
				label: 'second',
				description: 'second'
			});
		});

		const completions = await asCompletionModel(model, new Position(1, 1), provider);
		assert.strictEqual(completions.items.length, 2);
		const [first, second] = completions.items;
		assert.deepStrictEqual(first.completion.label, {
			label: 'first',
			description: 'first'
		});
		assert.deepStrictEqual(second.completion.label, {
			label: 'second',
			description: 'second'
		});
	});

	test('Dash in snippets prefix broken #53945', async function () {
		snippetService = new SimpleSnippetService([new Snippet(
			false,
			['fooLang'],
			'p-a',
			'p-a',
			'',
			'second',
			'',
			SnippetSource.User,
			generateUuid()
		)]);
		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));

		const model = disposables.add(instantiateTextModel(instantiationService, 'p-', 'fooLang'));

		let result = await provider.provideCompletionItems(model, new Position(1, 2), defaultCompletionContext)!;
		let completions = await asCompletionModel(model, new Position(1, 2), provider);
		assert.strictEqual(result.suggestions.length, 1);
		assert.strictEqual(completions.items.length, 1);

		result = await provider.provideCompletionItems(model, new Position(1, 3), defaultCompletionContext)!;
		completions = await asCompletionModel(model, new Position(1, 3), provider);
		assert.strictEqual(result.suggestions.length, 1);
		assert.strictEqual(completions.items.length, 1);

		result = await provider.provideCompletionItems(model, new Position(1, 3), defaultCompletionContext)!;
		completions = await asCompletionModel(model, new Position(1, 3), provider);
		assert.strictEqual(result.suggestions.length, 1);
		assert.strictEqual(completions.items.length, 1);
	});

	test('No snippets suggestion on long lines beyond character 100 #58807', async function () {
		snippetService = new SimpleSnippetService([new Snippet(
			false,
			['fooLang'],
			'bug',
			'bug',
			'',
			'second',
			'',
			SnippetSource.User,
			generateUuid()
		)]);

		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));

		const model = disposables.add(instantiateTextModel(instantiationService, 'Thisisaverylonglinegoingwithmore100bcharactersandthismakesintellisensebecomea Thisisaverylonglinegoingwithmore100bcharactersandthismakesintellisensebecomea b', 'fooLang'));
		const result = await provider.provideCompletionItems(model, new Position(1, 158), defaultCompletionContext)!;
		const completions = await asCompletionModel(model, new Position(1, 158), provider);

		assert.strictEqual(result.suggestions.length, 1);
		assert.strictEqual(completions.items.length, 1);
	});

	test('Type colon will trigger snippet #60746', async function () {
		snippetService = new SimpleSnippetService([new Snippet(
			false,
			['fooLang'],
			'bug',
			'bug',
			'',
			'second',
			'',
			SnippetSource.User,
			generateUuid()
		)]);

		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));

		const model = disposables.add(instantiateTextModel(instantiationService, ':', 'fooLang'));
		const result = await provider.provideCompletionItems(model, new Position(1, 2), defaultCompletionContext)!;
		assert.strictEqual(result.suggestions.length, 0);

		const completions = await asCompletionModel(model, new Position(1, 2), provider);
		assert.strictEqual(completions.items.length, 0);
	});

	test('substring of prefix can\'t trigger snippet #60737', async function () {
		snippetService = new SimpleSnippetService([new Snippet(
			false,
			['fooLang'],
			'mytemplate',
			'mytemplate',
			'',
			'second',
			'',
			SnippetSource.User,
			generateUuid()
		)]);

		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));

		const model = disposables.add(instantiateTextModel(instantiationService, 'template', 'fooLang'));
		const result = await provider.provideCompletionItems(model, new Position(1, 9), defaultCompletionContext);

		assert.strictEqual(result.suggestions.length, 1);
		assert.deepStrictEqual(result.suggestions[0].label, {
			label: 'mytemplate',
			description: 'mytemplate'
		});

		const completions = await asCompletionModel(model, new Position(1, 9), provider);
		assert.strictEqual(completions.items.length, 0);
	});

	test('No snippets suggestion beyond character 100 if not at end of line #60247', async function () {
		snippetService = new SimpleSnippetService([new Snippet(
			false,
			['fooLang'],
			'bug',
			'bug',
			'',
			'second',
			'',
			SnippetSource.User,
			generateUuid()
		)]);

		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));

		const model = disposables.add(instantiateTextModel(instantiationService, 'Thisisaverylonglinegoingwithmore100bcharactersandthismakesintellisensebecomea Thisisaverylonglinegoingwithmore100bcharactersandthismakesintellisensebecomea b text_after_b', 'fooLang'));

		const result = await provider.provideCompletionItems(model, new Position(1, 158), defaultCompletionContext)!;
		assert.strictEqual(result.suggestions.length, 1);

		const completions = await asCompletionModel(model, new Position(1, 158), provider);
		assert.strictEqual(completions.items.length, 1);
	});

	test('issue #61296: VS code freezes when editing CSS fi`le with emoji', async function () {
		const languageConfigurationService = disposables.add(new TestLanguageConfigurationService());
		disposables.add(languageConfigurationService.register('fooLang', {
			wordPattern: /(#?-?\d*\.\d\w*%?)|(::?[\w-]*(?=[^,{;]*[,{]))|(([@#.!])?[\w\-?]+%?|[@#!.])/g
		}));

		snippetService = new SimpleSnippetService([new Snippet(
			false,
			['fooLang'],
			'bug',
			'-a-bug',
			'',
			'second',
			'',
			SnippetSource.User,
			generateUuid()
		)]);

		const provider = new SnippetCompletionProvider(languageService, snippetService, languageConfigurationService);

		const model = disposables.add(instantiateTextModel(instantiationService, '.🐷-a-b', 'fooLang'));

		const result = await provider.provideCompletionItems(model, new Position(1, 8), defaultCompletionContext)!;
		assert.strictEqual(result.suggestions.length, 1);

		const completions = await asCompletionModel(model, new Position(1, 8), provider);
		assert.strictEqual(completions.items.length, 1);
	});

	test('No snippets shown when triggering completions at whitespace on line that already has text #62335', async function () {
		snippetService = new SimpleSnippetService([new Snippet(
			false,
			['fooLang'],
			'bug',
			'bug',
			'',
			'second',
			'',
			SnippetSource.User,
			generateUuid()
		)]);

		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));

		const model = disposables.add(instantiateTextModel(instantiationService, 'a ', 'fooLang'));

		const result = await provider.provideCompletionItems(model, new Position(1, 3), defaultCompletionContext)!;
		assert.strictEqual(result.suggestions.length, 1);

		const completions = await asCompletionModel(model, new Position(1, 3), provider);
		assert.strictEqual(completions.items.length, 1);
	});

	test('Snippet prefix with special chars and numbers does not work #62906', async function () {
		snippetService = new SimpleSnippetService([new Snippet(
			false,
			['fooLang'],
			'noblockwdelay',
			'<<',
			'',
			'<= #dly"',
			'',
			SnippetSource.User,
			generateUuid()
		), new Snippet(
			false,
			['fooLang'],
			'noblockwdelay',
			'11',
			'',
			'eleven',
			'',
			SnippetSource.User,
			generateUuid()
		)]);

		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));

		let model = instantiateTextModel(instantiationService, ' <', 'fooLang');

		let result = await provider.provideCompletionItems(model, new Position(1, 3), defaultCompletionContext)!;
		assert.strictEqual(result.suggestions.length, 1);
		let [first] = result.suggestions;
		assert.strictEqual((first.range as CompletionItemRanges).insert.startColumn, 2);

		let completions = await asCompletionModel(model, new Position(1, 3), provider);
		assert.strictEqual(completions.items.length, 1);
		assert.strictEqual(completions.items[0].editStart.column, 2);

		model.dispose();
		model = instantiateTextModel(instantiationService, '1', 'fooLang');
		result = await provider.provideCompletionItems(model, new Position(1, 2), defaultCompletionContext)!;
		completions = await asCompletionModel(model, new Position(1, 2), provider);

		assert.strictEqual(result.suggestions.length, 1);
		[first] = result.suggestions;
		assert.strictEqual((first.range as CompletionItemRanges).insert.startColumn, 1);
		assert.strictEqual(completions.items.length, 1);
		assert.strictEqual(completions.items[0].editStart.column, 1);

		model.dispose();
	});

	test('Snippet replace range', async function () {
		snippetService = new SimpleSnippetService([new Snippet(
			false,
			['fooLang'],
			'notWordTest',
			'not word',
			'',
			'not word snippet',
			'',
			SnippetSource.User,
			generateUuid()
		)]);

		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));

		let model = instantiateTextModel(instantiationService, 'not wordFoo bar', 'fooLang');

		let result = await provider.provideCompletionItems(model, new Position(1, 3), defaultCompletionContext)!;
		assert.strictEqual(result.suggestions.length, 1);
		let [first] = result.suggestions;
		assert.strictEqual((first.range as CompletionItemRanges).insert.endColumn, 3);
		assert.strictEqual((first.range as CompletionItemRanges).replace.endColumn, 9);

		let completions = await asCompletionModel(model, new Position(1, 3), provider);
		assert.strictEqual(completions.items.length, 1);
		assert.strictEqual(completions.items[0].editInsertEnd.column, 3);
		assert.strictEqual(completions.items[0].editReplaceEnd.column, 9);

		model.dispose();
		model = instantiateTextModel(instantiationService, 'not woFoo bar', 'fooLang');
		result = await provider.provideCompletionItems(model, new Position(1, 3), defaultCompletionContext)!;

		assert.strictEqual(result.suggestions.length, 1);
		[first] = result.suggestions;
		assert.strictEqual((first.range as CompletionItemRanges).insert.endColumn, 3);
		assert.strictEqual((first.range as CompletionItemRanges).replace.endColumn, 3);

		completions = await asCompletionModel(model, new Position(1, 3), provider);
		assert.strictEqual(completions.items.length, 1);
		assert.strictEqual(completions.items[0].editInsertEnd.column, 3);
		assert.strictEqual(completions.items[0].editReplaceEnd.column, 3);

		model.dispose();
		model = instantiateTextModel(instantiationService, 'not word', 'fooLang');
		result = await provider.provideCompletionItems(model, new Position(1, 1), defaultCompletionContext)!;

		assert.strictEqual(result.suggestions.length, 1);
		[first] = result.suggestions;
		assert.strictEqual((first.range as CompletionItemRanges).insert.endColumn, 1);
		assert.strictEqual((first.range as CompletionItemRanges).replace.endColumn, 9);

		completions = await asCompletionModel(model, new Position(1, 1), provider);
		assert.strictEqual(completions.items.length, 1);
		assert.strictEqual(completions.items[0].editInsertEnd.column, 1);
		assert.strictEqual(completions.items[0].editReplaceEnd.column, 9);

		model.dispose();
	});

	test('Snippet replace-range incorrect #108894', async function () {

		snippetService = new SimpleSnippetService([new Snippet(
			false,
			['fooLang'],
			'eng',
			'eng',
			'',
			'<span></span>',
			'',
			SnippetSource.User,
			generateUuid()
		)]);

		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));

		const model = instantiateTextModel(instantiationService, 'filler e KEEP ng filler', 'fooLang');
		const result = await provider.provideCompletionItems(model, new Position(1, 9), defaultCompletionContext)!;
		const completions = await asCompletionModel(model, new Position(1, 9), provider);

		assert.strictEqual(result.suggestions.length, 1);
		const [first] = result.suggestions;
		assert.strictEqual((first.range as CompletionItemRanges).insert.endColumn, 9);
		assert.strictEqual((first.range as CompletionItemRanges).replace.endColumn, 9);

		assert.strictEqual(completions.items.length, 1);
		assert.strictEqual(completions.items[0].editInsertEnd.column, 9);
		assert.strictEqual(completions.items[0].editReplaceEnd.column, 9);

		model.dispose();
	});

	test('Snippet will replace auto-closing pair if specified in prefix', async function () {
		const languageConfigurationService = disposables.add(new TestLanguageConfigurationService());
		disposables.add(languageConfigurationService.register('fooLang', {
			brackets: [
				['{', '}'],
				['[', ']'],
				['(', ')'],
			]
		}));

		snippetService = new SimpleSnippetService([new Snippet(
			false,
			['fooLang'],
			'PSCustomObject',
			'[PSCustomObject]',
			'',
			'[PSCustomObject] @{ Key = Value }',
			'',
			SnippetSource.User,
			generateUuid()
		)]);

		const provider = new SnippetCompletionProvider(languageService, snippetService, languageConfigurationService);

		const model = instantiateTextModel(instantiationService, '[psc]', 'fooLang');
		const result = await provider.provideCompletionItems(model, new Position(1, 5), defaultCompletionContext)!;
		const completions = await asCompletionModel(model, new Position(1, 5), provider);

		assert.strictEqual(result.suggestions.length, 1);
		const [first] = result.suggestions;
		assert.strictEqual((first.range as CompletionItemRanges).insert.endColumn, 5);
		// This is 6 because it should eat the `]` at the end of the text even if cursor is before it
		assert.strictEqual((first.range as CompletionItemRanges).replace.endColumn, 6);

		assert.strictEqual(completions.items.length, 1);
		assert.strictEqual(completions.items[0].editInsertEnd.column, 5);
		assert.strictEqual(completions.items[0].editReplaceEnd.column, 6);

		model.dispose();
	});

	test('Leading whitespace in snippet prefix #123860', async function () {

		snippetService = new SimpleSnippetService([new Snippet(
			false,
			['fooLang'],
			'cite-name',
			' cite',
			'',
			'~\\cite{$CLIPBOARD}',
			'',
			SnippetSource.User,
			generateUuid()
		)]);

		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));

		const model = instantiateTextModel(instantiationService, ' ci', 'fooLang');
		const result = await provider.provideCompletionItems(model, new Position(1, 4), defaultCompletionContext)!;
		const completions = await asCompletionModel(model, new Position(1, 4), provider);

		assert.strictEqual(result.suggestions.length, 1);
		const [first] = result.suggestions;
		assert.strictEqual((<CompletionItemLabel>first.label).label, ' cite');
		assert.strictEqual((<CompletionItemRanges>first.range).insert.startColumn, 1);

		assert.strictEqual(completions.items.length, 1);
		assert.strictEqual(completions.items[0].textLabel, ' cite');
		assert.strictEqual(completions.items[0].editStart.column, 1);

		model.dispose();
	});

	test('still show suggestions in string when disable string suggestion #136611', async function () {

		snippetService = new SimpleSnippetService([
			new Snippet(false, ['fooLang'], 'aaa', 'aaa', '', 'value', '', SnippetSource.User, generateUuid()),
			new Snippet(false, ['fooLang'], 'bbb', 'bbb', '', 'value', '', SnippetSource.User, generateUuid()),
			// new Snippet(['fooLang'], '\'ccc', '\'ccc', '', 'value', '', SnippetSource.User, generateUuid())
		]);

		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));

		const model = instantiateTextModel(instantiationService, '\'\'', 'fooLang');
		const result = await provider.provideCompletionItems(
			model,
			new Position(1, 2),
			{ triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: '\'' }
		)!;

		assert.strictEqual(result.suggestions.length, 0);
		model.dispose();

	});

	test('still show suggestions in string when disable string suggestion #136611 (part 2)', async function () {

		snippetService = new SimpleSnippetService([
			new Snippet(false, ['fooLang'], 'aaa', 'aaa', '', 'value', '', SnippetSource.User, generateUuid()),
			new Snippet(false, ['fooLang'], 'bbb', 'bbb', '', 'value', '', SnippetSource.User, generateUuid()),
			new Snippet(false, ['fooLang'], '\'ccc', '\'ccc', '', 'value', '', SnippetSource.User, generateUuid())
		]);

		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));

		const model = instantiateTextModel(instantiationService, '\'\'', 'fooLang');

		const result = await provider.provideCompletionItems(
			model,
			new Position(1, 2),
			{ triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: '\'' }
		)!;

		assert.strictEqual(result.suggestions.length, 1);

		const completions = await asCompletionModel(model, new Position(1, 2), provider, { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: '\'' });
		assert.strictEqual(completions.items.length, 1);

		model.dispose();
	});

	test('Snippet suggestions are too eager #138707 (word)', async function () {
		snippetService = new SimpleSnippetService([
			new Snippet(false, ['fooLang'], 'tys', 'tys', '', 'value', '', SnippetSource.User, generateUuid()),
			new Snippet(false, ['fooLang'], 'hell_or_tell', 'hell_or_tell', '', 'value', '', SnippetSource.User, generateUuid()),
			new Snippet(false, ['fooLang'], '^y', '^y', '', 'value', '', SnippetSource.User, generateUuid()),
		]);

		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));
		const model = instantiateTextModel(instantiationService, '\'hellot\'', 'fooLang');

		const result = await provider.provideCompletionItems(
			model,
			new Position(1, 8),
			{ triggerKind: CompletionTriggerKind.Invoke }
		)!;

		assert.strictEqual(result.suggestions.length, 1);
		assert.strictEqual((<SnippetCompletion>result.suggestions[0]).label.label, 'hell_or_tell');

		const completions = await asCompletionModel(model, new Position(1, 8), provider, { triggerKind: CompletionTriggerKind.Invoke });
		assert.strictEqual(completions.items.length, 1);
		assert.strictEqual(completions.items[0].textLabel, 'hell_or_tell');

		model.dispose();
	});

	test('Snippet suggestions are too eager #138707 (no word)', async function () {
		snippetService = new SimpleSnippetService([
			new Snippet(false, ['fooLang'], 'tys', 'tys', '', 'value', '', SnippetSource.User, generateUuid()),
			new Snippet(false, ['fooLang'], 't', 't', '', 'value', '', SnippetSource.User, generateUuid()),
			new Snippet(false, ['fooLang'], '^y', '^y', '', 'value', '', SnippetSource.User, generateUuid()),
		]);

		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));
		const model = instantiateTextModel(instantiationService, ')*&^', 'fooLang');

		const result = await provider.provideCompletionItems(
			model,
			new Position(1, 5),
			{ triggerKind: CompletionTriggerKind.Invoke }
		)!;

		assert.strictEqual(result.suggestions.length, 1);
		assert.strictEqual((<SnippetCompletion>result.suggestions[0]).label.label, '^y');


		const completions = await asCompletionModel(model, new Position(1, 5), provider, { triggerKind: CompletionTriggerKind.Invoke });
		assert.strictEqual(completions.items.length, 1);
		assert.strictEqual(completions.items[0].textLabel, '^y');

		model.dispose();
	});

	test('Snippet suggestions are too eager #138707 (word/word)', async function () {
		snippetService = new SimpleSnippetService([
			new Snippet(false, ['fooLang'], 'async arrow function', 'async arrow function', '', 'value', '', SnippetSource.User, generateUuid()),
			new Snippet(false, ['fooLang'], 'foobarrrrrr', 'foobarrrrrr', '', 'value', '', SnippetSource.User, generateUuid()),
		]);

		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));
		const model = instantiateTextModel(instantiationService, 'foobar', 'fooLang');

		const result = await provider.provideCompletionItems(
			model,
			new Position(1, 7),
			{ triggerKind: CompletionTriggerKind.Invoke }
		)!;

		assert.strictEqual(result.suggestions.length, 1);
		assert.strictEqual((<SnippetCompletion>result.suggestions[0]).label.label, 'foobarrrrrr');

		const completions = await asCompletionModel(model, new Position(1, 7), provider, { triggerKind: CompletionTriggerKind.Invoke });
		assert.strictEqual(completions.items.length, 1);
		assert.strictEqual(completions.items[0].textLabel, 'foobarrrrrr');
		model.dispose();
	});

	test('Strange and useless autosuggestion #region/#endregion PHP #140039', async function () {
		snippetService = new SimpleSnippetService([
			new Snippet(false, ['fooLang'], 'reg', '#region', '', 'value', '', SnippetSource.User, generateUuid()),
		]);


		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));
		const model = instantiateTextModel(instantiationService, 'function abc(w)', 'fooLang');
		const result = await provider.provideCompletionItems(
			model,
			new Position(1, 15),
			{ triggerKind: CompletionTriggerKind.Invoke }
		)!;

		assert.strictEqual(result.suggestions.length, 0);
		model.dispose();
	});

	test.skip('Snippets disappear with . key #145960', async function () {
		snippetService = new SimpleSnippetService([
			new Snippet(false, ['fooLang'], 'div', 'div', '', 'div', '', SnippetSource.User, generateUuid()),
			new Snippet(false, ['fooLang'], 'div.', 'div.', '', 'div.', '', SnippetSource.User, generateUuid()),
			new Snippet(false, ['fooLang'], 'div#', 'div#', '', 'div#', '', SnippetSource.User, generateUuid()),
		]);

		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));
		const model = instantiateTextModel(instantiationService, 'di', 'fooLang');
		const result = await provider.provideCompletionItems(
			model,
			new Position(1, 3),
			{ triggerKind: CompletionTriggerKind.Invoke }
		)!;

		assert.strictEqual(result.suggestions.length, 3);


		model.applyEdits([EditOperation.insert(new Position(1, 3), '.')]);
		assert.strictEqual(model.getValue(), 'di.');
		const result2 = await provider.provideCompletionItems(
			model,
			new Position(1, 4),
			{ triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: '.' }
		)!;

		assert.strictEqual(result2.suggestions.length, 1);
		assert.strictEqual(result2.suggestions[0].insertText, 'div.');

		model.dispose();
	});

	test('Hyphen in snippet prefix de-indents snippet #139016', async function () {
		snippetService = new SimpleSnippetService([
			new Snippet(false, ['fooLang'], 'foo', 'Foo- Bar', '', 'Foo', '', SnippetSource.User, generateUuid()),
		]);
		const model = disposables.add(instantiateTextModel(instantiationService, '    bar', 'fooLang'));
		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));
		const result = await provider.provideCompletionItems(
			model,
			new Position(1, 8),
			{ triggerKind: CompletionTriggerKind.Invoke }
		);

		assert.strictEqual(result.suggestions.length, 1);
		const first = result.suggestions[0];
		assert.strictEqual((<CompletionItemRanges>first.range).insert.startColumn, 5);

		const completions = await asCompletionModel(model, new Position(1, 8), provider);
		assert.strictEqual(completions.items.length, 1);
		assert.strictEqual(completions.items[0].editStart.column, 5);
	});

	test('Autocomplete suggests based on the last letter of a word and it depends on the typing speed #191070', async function () {
		snippetService = new SimpleSnippetService([
			new Snippet(false, ['fooLang'], '/whiletrue', '/whiletrue', '', 'one', '', SnippetSource.User, generateUuid()),
			new Snippet(false, ['fooLang'], '/sc not expanding', '/sc not expanding', '', 'two', '', SnippetSource.User, generateUuid()),
		]);

		const provider = new SnippetCompletionProvider(languageService, snippetService, disposables.add(new TestLanguageConfigurationService()));
		const model = disposables.add(instantiateTextModel(instantiationService, '', 'fooLang'));

		{ // PREFIX: w
			model.setValue('w');
			const result1 = await provider.provideCompletionItems(
				model,
				new Position(1, 2),
				{ triggerKind: CompletionTriggerKind.Invoke }
			);
			assert.strictEqual(result1.suggestions[0].insertText, 'one');
			assert.strictEqual(result1.suggestions.length, 1);
		}

		{ // PREFIX: where
			model.setValue('where');
			const result2 = await provider.provideCompletionItems(
				model,
				new Position(1, 6),
				{ triggerKind: CompletionTriggerKind.Invoke }
			);
			assert.strictEqual(result2.suggestions[0].insertText, 'one'); // /whiletrue matches where (WHilEtRuE)
			assert.strictEqual(result2.suggestions.length, 1);
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/speech/browser/speech.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/speech/browser/speech.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ISpeechService } from '../common/speechService.js';
import { SpeechService } from './speechService.js';

registerSingleton(ISpeechService, SpeechService, InstantiationType.Eager /* Reads Extension Points */);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/speech/browser/speechAccessibilitySignal.ts]---
Location: vscode-main/src/vs/workbench/contrib/speech/browser/speechAccessibilitySignal.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { ISpeechService } from '../common/speechService.js';

export class SpeechAccessibilitySignalContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.speechAccessibilitySignal';

	constructor(
		@IAccessibilitySignalService private readonly _accessibilitySignalService: IAccessibilitySignalService,
		@ISpeechService private readonly _speechService: ISpeechService,
	) {
		super();

		this._register(this._speechService.onDidStartSpeechToTextSession(() => this._accessibilitySignalService.playSignal(AccessibilitySignal.voiceRecordingStarted)));
		this._register(this._speechService.onDidEndSpeechToTextSession(() => this._accessibilitySignalService.playSignal(AccessibilitySignal.voiceRecordingStopped)));
	}
}
```

--------------------------------------------------------------------------------

````

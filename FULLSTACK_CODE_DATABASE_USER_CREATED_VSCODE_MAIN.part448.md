---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 448
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 448 of 552)

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

---[FILE: src/vs/workbench/contrib/search/browser/notebookSearch/notebookSearchModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/notebookSearch/notebookSearchModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { coalesce } from '../../../../../base/common/arrays.js';
import { RunOnceScheduler } from '../../../../../base/common/async.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { FindMatch } from '../../../../../editor/common/model.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { ISearchRange, ITextSearchMatch, resultIsMatch, ITextSearchContext, IPatternInfo, ITextSearchPreviewOptions, IFileMatch } from '../../../../services/search/common/search.js';
import { getTextSearchMatchWithModelContext } from '../../../../services/search/common/searchHelpers.js';
import { FindMatchDecorationModel } from '../../../notebook/browser/contrib/find/findMatchDecorationModel.js';
import { CellFindMatchModel } from '../../../notebook/browser/contrib/find/findModel.js';
import { CellFindMatchWithIndex, CellWebviewFindMatch, ICellViewModel } from '../../../notebook/browser/notebookBrowser.js';
import { NotebookEditorWidget } from '../../../notebook/browser/notebookEditorWidget.js';
import { INotebookEditorService } from '../../../notebook/browser/services/notebookEditorService.js';
import { NotebookCellsChangeType } from '../../../notebook/common/notebookCommon.js';
import { CellSearchModel } from '../../common/cellSearchModel.js';
import { INotebookCellMatchNoModel, isINotebookFileMatchNoModel, rawCellPrefix } from '../../common/searchNotebookHelpers.js';
import { contentMatchesToTextSearchMatches, INotebookCellMatchWithModel, isINotebookCellMatchWithModel, isINotebookFileMatchWithModel, webviewMatchesToTextSearchMatches } from './searchNotebookHelpers.js';
import { ISearchTreeMatch, ISearchTreeFolderMatch, ISearchTreeFolderMatchWorkspaceRoot, MATCH_PREFIX } from '../searchTreeModel/searchTreeCommon.js';
import { IReplaceService } from '../replace.js';
import { FileMatchImpl } from '../searchTreeModel/fileMatch.js';
import { ICellMatch, IMatchInNotebook, INotebookFileInstanceMatch, isIMatchInNotebook } from './notebookSearchModelBase.js';
import { MatchImpl, textSearchResultToMatches } from '../searchTreeModel/match.js';

export class MatchInNotebook extends MatchImpl implements IMatchInNotebook {
	private _webviewIndex: number | undefined;

	constructor(private readonly _cellParent: ICellMatch, _fullPreviewLines: string[], _fullPreviewRange: ISearchRange, _documentRange: ISearchRange, webviewIndex?: number) {
		super(_cellParent.parent, _fullPreviewLines, _fullPreviewRange, _documentRange, false);
		this._id = MATCH_PREFIX + this._parent.resource.toString() + '>' + this._cellParent.cellIndex + (webviewIndex ? '_' + webviewIndex : '') + '_' + this.notebookMatchTypeString() + this._range + this.getMatchString();
		this._webviewIndex = webviewIndex;
	}

	override parent(): INotebookFileInstanceMatch { // visible parent in search tree
		return this._cellParent.parent;
	}

	get cellParent(): ICellMatch {
		return this._cellParent;
	}

	private notebookMatchTypeString(): string {
		return this.isWebviewMatch() ? 'webview' : 'content';
	}

	public isWebviewMatch() {
		return this._webviewIndex !== undefined;
	}

	override get isReadonly(): boolean {
		return super.isReadonly || (!this._cellParent.hasCellViewModel()) || this.isWebviewMatch();
	}

	get cellIndex() {
		return this._cellParent.cellIndex;
	}

	get webviewIndex() {
		return this._webviewIndex;
	}

	get cell() {
		return this._cellParent.cell;
	}
}

export class CellMatch implements ICellMatch {
	private _contentMatches: Map<string, MatchInNotebook>;
	private _webviewMatches: Map<string, MatchInNotebook>;
	private _context: Map<number, string>;

	constructor(
		private readonly _parent: INotebookFileInstanceMatch,
		private _cell: ICellViewModel | undefined,
		private readonly _cellIndex: number,
	) {

		this._contentMatches = new Map<string, MatchInNotebook>();
		this._webviewMatches = new Map<string, MatchInNotebook>();
		this._context = new Map<number, string>();
	}

	public hasCellViewModel() {
		return !(this._cell instanceof CellSearchModel);
	}

	get context(): Map<number, string> {
		return new Map(this._context);
	}

	matches() {
		return [...this._contentMatches.values(), ... this._webviewMatches.values()];
	}

	get contentMatches(): MatchInNotebook[] {
		return Array.from(this._contentMatches.values());
	}

	get webviewMatches(): MatchInNotebook[] {
		return Array.from(this._webviewMatches.values());
	}

	remove(matches: MatchInNotebook | MatchInNotebook[]): void {
		if (!Array.isArray(matches)) {
			matches = [matches];
		}
		for (const match of matches) {
			this._contentMatches.delete(match.id());
			this._webviewMatches.delete(match.id());
		}
	}

	clearAllMatches() {
		this._contentMatches.clear();
		this._webviewMatches.clear();
	}

	addContentMatches(textSearchMatches: ITextSearchMatch[]) {
		const contentMatches = textSearchMatchesToNotebookMatches(textSearchMatches, this);
		contentMatches.forEach((match) => {
			this._contentMatches.set(match.id(), match);
		});
		this.addContext(textSearchMatches);
	}

	public addContext(textSearchMatches: ITextSearchMatch[]) {
		if (!this.cell) {
			// todo: get closed notebook results in search editor
			return;
		}
		this.cell.resolveTextModel().then((textModel) => {
			const textResultsWithContext = getTextSearchMatchWithModelContext(textSearchMatches, textModel, this.parent.parent().query!);
			const contexts = textResultsWithContext.filter((result => !resultIsMatch(result)) as ((a: any) => a is ITextSearchContext));
			contexts.map(context => ({ ...context, lineNumber: context.lineNumber + 1 }))
				.forEach((context) => { this._context.set(context.lineNumber, context.text); });
		});
	}

	addWebviewMatches(textSearchMatches: ITextSearchMatch[]) {
		const webviewMatches = textSearchMatchesToNotebookMatches(textSearchMatches, this);
		webviewMatches.forEach((match) => {
			this._webviewMatches.set(match.id(), match);
		});
		// TODO: add webview results to context
	}


	setCellModel(cell: ICellViewModel) {
		this._cell = cell;
	}

	get parent(): INotebookFileInstanceMatch {
		return this._parent;
	}

	get id(): string {
		return this._cell?.id ?? `${rawCellPrefix}${this.cellIndex}`;
	}

	get cellIndex(): number {
		return this._cellIndex;
	}

	get cell(): ICellViewModel | undefined {
		return this._cell;
	}

}

export class NotebookCompatibleFileMatch extends FileMatchImpl implements INotebookFileInstanceMatch {


	private _notebookEditorWidget: NotebookEditorWidget | null = null;
	private _editorWidgetListener: IDisposable | null = null;
	private _notebookUpdateScheduler: RunOnceScheduler;
	private _lastEditorWidgetIdForUpdate: string | undefined;

	constructor(
		_query: IPatternInfo,
		_previewOptions: ITextSearchPreviewOptions | undefined,
		_maxResults: number | undefined,
		_parent: ISearchTreeFolderMatch,
		rawMatch: IFileMatch,
		_closestRoot: ISearchTreeFolderMatchWorkspaceRoot | null,
		private readonly searchInstanceID: string,
		@IModelService modelService: IModelService,
		@IReplaceService replaceService: IReplaceService,
		@ILabelService labelService: ILabelService,
		@INotebookEditorService private readonly notebookEditorService: INotebookEditorService,
	) {
		super(_query, _previewOptions, _maxResults, _parent, rawMatch, _closestRoot, modelService, replaceService, labelService);
		this._cellMatches = new Map<string, ICellMatch>();
		this._notebookUpdateScheduler = new RunOnceScheduler(this.updateMatchesForEditorWidget.bind(this), 250);
	}
	private _cellMatches: Map<string, ICellMatch>;
	public get cellContext(): Map<string, Map<number, string>> {
		const cellContext = new Map<string, Map<number, string>>();
		this._cellMatches.forEach(cellMatch => {
			cellContext.set(cellMatch.id, cellMatch.context);
		});
		return cellContext;
	}

	getCellMatch(cellID: string): ICellMatch | undefined {
		return this._cellMatches.get(cellID);
	}

	addCellMatch(rawCell: INotebookCellMatchNoModel | INotebookCellMatchWithModel) {
		const cellMatch = new CellMatch(this, isINotebookCellMatchWithModel(rawCell) ? rawCell.cell : undefined, rawCell.index);
		this._cellMatches.set(cellMatch.id, cellMatch);
		this.addWebviewMatchesToCell(cellMatch.id, rawCell.webviewResults);
		this.addContentMatchesToCell(cellMatch.id, rawCell.contentResults);
	}

	addWebviewMatchesToCell(cellID: string, webviewMatches: ITextSearchMatch[]) {
		const cellMatch = this.getCellMatch(cellID);
		if (cellMatch !== undefined) {
			cellMatch.addWebviewMatches(webviewMatches);
		}
	}

	addContentMatchesToCell(cellID: string, contentMatches: ITextSearchMatch[]) {
		const cellMatch = this.getCellMatch(cellID);
		if (cellMatch !== undefined) {
			cellMatch.addContentMatches(contentMatches);
		}
	}

	private revealCellRange(match: MatchInNotebook, outputOffset: number | null) {
		if (!this._notebookEditorWidget || !match.cell) {
			// match cell should never be a CellSearchModel if the notebook is open
			return;
		}
		if (match.webviewIndex !== undefined) {
			const index = this._notebookEditorWidget.getCellIndex(match.cell);
			if (index !== undefined) {
				this._notebookEditorWidget.revealCellOffsetInCenter(match.cell, outputOffset ?? 0);
			}
		} else {
			match.cell.updateEditState(match.cell.getEditState(), 'focusNotebookCell');
			this._notebookEditorWidget.setCellEditorSelection(match.cell, match.range());
			this._notebookEditorWidget.revealRangeInCenterIfOutsideViewportAsync(match.cell, match.range());
		}
	}


	bindNotebookEditorWidget(widget: NotebookEditorWidget) {
		if (this._notebookEditorWidget === widget) {
			return;
		}

		this._notebookEditorWidget = widget;

		this._editorWidgetListener = this._notebookEditorWidget.textModel?.onDidChangeContent((e) => {
			if (!e.rawEvents.some(event => event.kind === NotebookCellsChangeType.ChangeCellContent || event.kind === NotebookCellsChangeType.ModelChange)) {
				return;
			}
			this._notebookUpdateScheduler.schedule();
		}) ?? null;
		this._addNotebookHighlights();
	}

	unbindNotebookEditorWidget(widget?: NotebookEditorWidget) {
		if (widget && this._notebookEditorWidget !== widget) {
			return;
		}

		if (this._notebookEditorWidget) {
			this._notebookUpdateScheduler.cancel();
			this._editorWidgetListener?.dispose();
		}
		this._removeNotebookHighlights();
		this._notebookEditorWidget = null;
	}

	updateNotebookHighlights(): void {
		if (this.parent().showHighlights) {
			this._addNotebookHighlights();
			this.setNotebookFindMatchDecorationsUsingCellMatches(Array.from(this._cellMatches.values()));
		} else {
			this._removeNotebookHighlights();
		}
	}

	private _addNotebookHighlights(): void {
		if (!this._notebookEditorWidget) {
			return;
		}
		this._findMatchDecorationModel?.stopWebviewFind();
		this._findMatchDecorationModel?.dispose();
		this._findMatchDecorationModel = new FindMatchDecorationModel(this._notebookEditorWidget, this.searchInstanceID);
		if (this._selectedMatch instanceof MatchInNotebook) {
			this.highlightCurrentFindMatchDecoration(this._selectedMatch);
		}
	}

	private _removeNotebookHighlights(): void {
		if (this._findMatchDecorationModel) {
			this._findMatchDecorationModel?.stopWebviewFind();
			this._findMatchDecorationModel?.dispose();
			this._findMatchDecorationModel = undefined;
		}
	}

	private updateNotebookMatches(matches: CellFindMatchWithIndex[], modelChange: boolean): void {
		if (!this._notebookEditorWidget) {
			return;
		}

		const oldCellMatches = new Map<string, ICellMatch>(this._cellMatches);
		if (this._notebookEditorWidget.getId() !== this._lastEditorWidgetIdForUpdate) {
			this._cellMatches.clear();
			this._lastEditorWidgetIdForUpdate = this._notebookEditorWidget.getId();
		}
		matches.forEach(match => {
			let existingCell = this._cellMatches.get(match.cell.id);
			if (this._notebookEditorWidget && !existingCell) {
				const index = this._notebookEditorWidget.getCellIndex(match.cell);
				const existingRawCell = oldCellMatches.get(`${rawCellPrefix}${index}`);
				if (existingRawCell) {
					existingRawCell.setCellModel(match.cell);
					existingRawCell.clearAllMatches();
					existingCell = existingRawCell;
				}
			}
			existingCell?.clearAllMatches();
			const cell = existingCell ?? new CellMatch(this, match.cell, match.index);
			cell.addContentMatches(contentMatchesToTextSearchMatches(match.contentMatches, match.cell));
			cell.addWebviewMatches(webviewMatchesToTextSearchMatches(match.webviewMatches));
			this._cellMatches.set(cell.id, cell);

		});

		this._findMatchDecorationModel?.setAllFindMatchesDecorations(matches);
		if (this._selectedMatch instanceof MatchInNotebook) {
			this.highlightCurrentFindMatchDecoration(this._selectedMatch);
		}
		this._onChange.fire({ forceUpdateModel: modelChange });
	}

	private setNotebookFindMatchDecorationsUsingCellMatches(cells: ICellMatch[]): void {
		if (!this._findMatchDecorationModel) {
			return;
		}
		const cellFindMatch = coalesce(cells.map((cell): CellFindMatchModel | undefined => {
			const webviewMatches: CellWebviewFindMatch[] = coalesce(cell.webviewMatches.map((match): CellWebviewFindMatch | undefined => {
				if (!match.webviewIndex) {
					return undefined;
				}
				return {
					index: match.webviewIndex,
				};
			}));
			if (!cell.cell) {
				return undefined;
			}
			const findMatches: FindMatch[] = cell.contentMatches.map(match => {
				return new FindMatch(match.range(), [match.text()]);
			});
			return new CellFindMatchModel(cell.cell, cell.cellIndex, findMatches, webviewMatches);
		}));
		try {
			this._findMatchDecorationModel.setAllFindMatchesDecorations(cellFindMatch);
		} catch (e) {
			// no op, might happen due to bugs related to cell output regex search
		}
	}
	async updateMatchesForEditorWidget(): Promise<void> {
		if (!this._notebookEditorWidget) {
			return;
		}

		this._textMatches = new Map<string, ISearchTreeMatch>();

		const wordSeparators = this._query.isWordMatch && this._query.wordSeparators ? this._query.wordSeparators : null;
		const allMatches = await this._notebookEditorWidget
			.find(this._query.pattern, {
				regex: this._query.isRegExp,
				wholeWord: this._query.isWordMatch,
				caseSensitive: this._query.isCaseSensitive,
				wordSeparators: wordSeparators ?? undefined,
				includeMarkupInput: this._query.notebookInfo?.isInNotebookMarkdownInput,
				includeMarkupPreview: this._query.notebookInfo?.isInNotebookMarkdownPreview,
				includeCodeInput: this._query.notebookInfo?.isInNotebookCellInput,
				includeOutput: this._query.notebookInfo?.isInNotebookCellOutput,
			}, CancellationToken.None, false, true, this.searchInstanceID);

		this.updateNotebookMatches(allMatches, true);
	}

	public async showMatch(match: MatchInNotebook) {
		const offset = await this.highlightCurrentFindMatchDecoration(match);
		this.setSelectedMatch(match);
		this.revealCellRange(match, offset);
	}

	private async highlightCurrentFindMatchDecoration(match: MatchInNotebook): Promise<number | null> {
		if (!this._findMatchDecorationModel || !match.cell) {
			// match cell should never be a CellSearchModel if the notebook is open
			return null;
		}
		if (match.webviewIndex === undefined) {
			return this._findMatchDecorationModel.highlightCurrentFindMatchDecorationInCell(match.cell, match.range());
		} else {
			return this._findMatchDecorationModel.highlightCurrentFindMatchDecorationInWebview(match.cell, match.webviewIndex);
		}
	}


	override matches(): ISearchTreeMatch[] {
		const matches = Array.from(this._cellMatches.values()).flatMap((e) => e.matches());
		return [...super.matches(), ...matches];
	}

	protected override removeMatch(match: ISearchTreeMatch) {

		if (match instanceof MatchInNotebook) {
			match.cellParent.remove(match);
			if (match.cellParent.matches().length === 0) {
				this._cellMatches.delete(match.cellParent.id);
			}

			if (this.isMatchSelected(match)) {
				this.setSelectedMatch(null);
				this._findMatchDecorationModel?.clearCurrentFindMatchDecoration();
			} else {
				this.updateHighlights();
			}

			this.setNotebookFindMatchDecorationsUsingCellMatches(this.cellMatches());
		} else {
			super.removeMatch(match);
		}
	}

	cellMatches(): ICellMatch[] {
		return Array.from(this._cellMatches.values());
	}


	override createMatches(): void {
		const model = this.modelService.getModel(this._resource);
		if (model) {
			// todo: handle better when ai contributed results has model, currently, createMatches does not work for this
			this.bindModel(model);
			this.updateMatchesForModel();
		} else {
			const notebookEditorWidgetBorrow = this.notebookEditorService.retrieveExistingWidgetFromURI(this.resource);

			if (notebookEditorWidgetBorrow?.value) {
				this.bindNotebookEditorWidget(notebookEditorWidgetBorrow.value);
			}
			if (this.rawMatch.results) {
				this.rawMatch.results
					.filter(resultIsMatch)
					.forEach(rawMatch => {
						textSearchResultToMatches(rawMatch, this, false)
							.forEach(m => this.add(m));
					});
			}

			if (isINotebookFileMatchWithModel(this.rawMatch) || isINotebookFileMatchNoModel(this.rawMatch)) {
				this.rawMatch.cellResults?.forEach(cell => this.addCellMatch(cell));
				this.setNotebookFindMatchDecorationsUsingCellMatches(this.cellMatches());
				this._onChange.fire({ forceUpdateModel: true });
			}
			this.addContext(this.rawMatch.results);
		}
	}

	override get hasChildren(): boolean {
		return super.hasChildren || this._cellMatches.size > 0;
	}

	override setSelectedMatch(match: ISearchTreeMatch | null): void {
		if (match) {
			if (!this.isMatchSelected(match) && isIMatchInNotebook(match)) {
				this._selectedMatch = match;
				return;
			}

			if (!this._textMatches.has(match.id())) {
				return;
			}
			if (this.isMatchSelected(match)) {
				return;
			}
		}

		this._selectedMatch = match;
		this.updateHighlights();
	}

	override dispose(): void {
		this.unbindNotebookEditorWidget();
		super.dispose();
	}

}
// text search to notebook matches

export function textSearchMatchesToNotebookMatches(textSearchMatches: ITextSearchMatch[], cell: CellMatch): MatchInNotebook[] {
	const notebookMatches: MatchInNotebook[] = [];
	textSearchMatches.forEach((textSearchMatch) => {
		const previewLines = textSearchMatch.previewText.split('\n');
		textSearchMatch.rangeLocations.map((rangeLocation) => {
			const previewRange: ISearchRange = rangeLocation.preview;
			const match = new MatchInNotebook(cell, previewLines, previewRange, rangeLocation.source, textSearchMatch.webviewIndex);
			notebookMatches.push(match);
		});
	});
	return notebookMatches;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/notebookSearch/notebookSearchModelBase.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/notebookSearch/notebookSearchModelBase.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITextSearchMatch } from '../../../../services/search/common/search.js';
import { ICellViewModel } from '../../../notebook/browser/notebookBrowser.js';
import { NotebookEditorWidget } from '../../../notebook/browser/notebookEditorWidget.js';
import { INotebookCellMatchNoModel } from '../../common/searchNotebookHelpers.js';
import { ISearchTreeFileMatch, ISearchTreeMatch, isSearchTreeFileMatch } from '../searchTreeModel/searchTreeCommon.js';
import { INotebookCellMatchWithModel } from './searchNotebookHelpers.js';

export interface INotebookFileInstanceMatch extends ISearchTreeFileMatch {
	bindNotebookEditorWidget(editor: NotebookEditorWidget): void;
	updateMatchesForEditorWidget(): Promise<void>;
	unbindNotebookEditorWidget(editor: NotebookEditorWidget): void;
	updateNotebookHighlights(): void;
	getCellMatch(cellID: string): ICellMatch | undefined;
	addCellMatch(rawCell: INotebookCellMatchNoModel | INotebookCellMatchWithModel): void;
	showMatch(match: IMatchInNotebook): Promise<void>;
	cellMatches(): ICellMatch[];
}

export function isNotebookFileMatch(obj: any): obj is INotebookFileInstanceMatch {
	return obj &&
		typeof obj.bindNotebookEditorWidget === 'function' &&
		typeof obj.updateMatchesForEditorWidget === 'function' &&
		typeof obj.unbindNotebookEditorWidget === 'function' &&
		typeof obj.updateNotebookHighlights === 'function'
		&& isSearchTreeFileMatch(obj);
}

export interface IMatchInNotebook extends ISearchTreeMatch {
	parent(): INotebookFileInstanceMatch;
	cellParent: ICellMatch;
	isWebviewMatch(): boolean;
	cellIndex: number;
	webviewIndex: number | undefined;
	cell: ICellViewModel | undefined;
}
export function isIMatchInNotebook(obj: any): obj is IMatchInNotebook {
	return typeof obj === 'object' &&
		obj !== null &&
		typeof obj.parent === 'function' &&
		typeof obj.cellParent === 'object' &&
		typeof obj.isWebviewMatch === 'function' &&
		typeof obj.cellIndex === 'number' &&
		(typeof obj.webviewIndex === 'number' || obj.webviewIndex === undefined) &&
		(typeof obj.cell === 'object' || obj.cell === undefined);
}

export interface ICellMatch {
	hasCellViewModel(): boolean;
	context: Map<number, string>;
	matches(): IMatchInNotebook[];
	contentMatches: IMatchInNotebook[];
	webviewMatches: IMatchInNotebook[];
	remove(matches: IMatchInNotebook | IMatchInNotebook[]): void;
	clearAllMatches(): void;
	addContentMatches(textSearchMatches: ITextSearchMatch[]): void;
	addContext(textSearchMatches: ITextSearchMatch[]): void;
	addWebviewMatches(textSearchMatches: ITextSearchMatch[]): void;
	setCellModel(cell: ICellViewModel): void;
	parent: INotebookFileInstanceMatch;
	id: string;
	cellIndex: number;
	cell: ICellViewModel | undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/notebookSearch/notebookSearchService.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/notebookSearch/notebookSearchService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import * as glob from '../../../../../base/common/glob.js';
import { ResourceSet, ResourceMap } from '../../../../../base/common/map.js';
import { URI } from '../../../../../base/common/uri.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { NotebookEditorWidget } from '../../../notebook/browser/notebookEditorWidget.js';
import { INotebookService } from '../../../notebook/common/notebookService.js';
import { INotebookSearchService } from '../../common/notebookSearch.js';
import { INotebookCellMatchWithModel, INotebookFileMatchWithModel, contentMatchesToTextSearchMatches, webviewMatchesToTextSearchMatches } from './searchNotebookHelpers.js';
import { ITextQuery, QueryType, ISearchProgressItem, ISearchComplete, ISearchConfigurationProperties, pathIncludedInQuery, ISearchService, IFolderQuery, DEFAULT_MAX_SEARCH_RESULTS } from '../../../../services/search/common/search.js';
import * as arrays from '../../../../../base/common/arrays.js';
import { isNumber } from '../../../../../base/common/types.js';
import { IEditorResolverService } from '../../../../services/editor/common/editorResolverService.js';
import { INotebookFileMatchNoModel } from '../../common/searchNotebookHelpers.js';
import { INotebookEditorService } from '../../../notebook/browser/services/notebookEditorService.js';
import { NotebookPriorityInfo } from '../../common/search.js';
import { INotebookExclusiveDocumentFilter } from '../../../notebook/common/notebookCommon.js';
import { QueryBuilder } from '../../../../services/search/common/queryBuilder.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';

interface IOpenNotebookSearchResults {
	results: ResourceMap<INotebookFileMatchWithModel | null>;
	limitHit: boolean;
}
interface IClosedNotebookSearchResults {
	results: ResourceMap<INotebookFileMatchNoModel<URI> | null>;
	limitHit: boolean;
}
export class NotebookSearchService implements INotebookSearchService {
	declare readonly _serviceBrand: undefined;
	private queryBuilder: QueryBuilder;
	constructor(
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@INotebookEditorService private readonly notebookEditorService: INotebookEditorService,
		@ILogService private readonly logService: ILogService,
		@INotebookService private readonly notebookService: INotebookService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IEditorResolverService private readonly editorResolverService: IEditorResolverService,
		@ISearchService private readonly searchService: ISearchService,
		@IInstantiationService instantiationService: IInstantiationService
	) {
		this.queryBuilder = instantiationService.createInstance(QueryBuilder);
	}

	notebookSearch(query: ITextQuery, token: CancellationToken | undefined, searchInstanceID: string, onProgress?: (result: ISearchProgressItem) => void): {
		openFilesToScan: ResourceSet;
		completeData: Promise<ISearchComplete>;
		allScannedFiles: Promise<ResourceSet>;
	} {

		if (query.type !== QueryType.Text) {
			return {
				openFilesToScan: new ResourceSet(),
				completeData: Promise.resolve({
					messages: [],
					limitHit: false,
					results: [],
				}),
				allScannedFiles: Promise.resolve(new ResourceSet()),
			};
		}

		const localNotebookWidgets = this.getLocalNotebookWidgets();
		const localNotebookFiles = localNotebookWidgets.map(widget => widget.viewModel!.uri);
		const getAllResults = (): { completeData: Promise<ISearchComplete>; allScannedFiles: Promise<ResourceSet> } => {
			const searchStart = Date.now();

			const localResultPromise = this.getLocalNotebookResults(query, token ?? CancellationToken.None, localNotebookWidgets, searchInstanceID);
			const searchLocalEnd = Date.now();

			const experimentalNotebooksEnabled = this.configurationService.getValue<ISearchConfigurationProperties>('search').experimental?.closedNotebookRichContentResults ?? false;

			let closedResultsPromise: Promise<IClosedNotebookSearchResults | undefined> = Promise.resolve(undefined);
			if (experimentalNotebooksEnabled) {
				closedResultsPromise = this.getClosedNotebookResults(query, new ResourceSet(localNotebookFiles, uri => this.uriIdentityService.extUri.getComparisonKey(uri)), token ?? CancellationToken.None);
			}

			const promise = Promise.all([localResultPromise, closedResultsPromise]);
			return {
				completeData: promise.then((resolvedPromise): ISearchComplete => {
					const openNotebookResult = resolvedPromise[0];
					const closedNotebookResult = resolvedPromise[1];

					const resolved = resolvedPromise.filter((e): e is IOpenNotebookSearchResults | IClosedNotebookSearchResults => !!e);
					const resultArray = [...openNotebookResult.results.values(), ...closedNotebookResult?.results.values() ?? []];
					const results = arrays.coalesce(resultArray);
					if (onProgress) {
						results.forEach(onProgress);
					}
					this.logService.trace(`local notebook search time | ${searchLocalEnd - searchStart}ms`);
					return {
						messages: [],
						limitHit: resolved.reduce((prev, cur) => prev || cur.limitHit, false),
						results,
					};
				}),
				allScannedFiles: promise.then(resolvedPromise => {
					const openNotebookResults = resolvedPromise[0];
					const closedNotebookResults = resolvedPromise[1];
					const results = arrays.coalesce([...openNotebookResults.results.keys(), ...closedNotebookResults?.results.keys() ?? []]);
					return new ResourceSet(results, uri => this.uriIdentityService.extUri.getComparisonKey(uri));
				})
			};
		};
		const promiseResults = getAllResults();
		return {
			openFilesToScan: new ResourceSet(localNotebookFiles),
			completeData: promiseResults.completeData,
			allScannedFiles: promiseResults.allScannedFiles
		};
	}

	private async doesFileExist(includes: string[], folderQueries: IFolderQuery<URI>[], token: CancellationToken): Promise<boolean> {
		const promises: Promise<boolean>[] = includes.map(async includePattern => {
			const query = this.queryBuilder.file(folderQueries.map(e => e.folder), {
				includePattern: includePattern.startsWith('/') ? includePattern : '**/' + includePattern, // todo: find cleaner way to ensure that globs match all appropriate filetypes
				exists: true,
				onlyFileScheme: true,
			});
			return this.searchService.fileSearch(
				query,
				token
			).then((ret) => {
				return !!ret.limitHit;
			});
		});

		return Promise.any(promises);
	}

	private async getClosedNotebookResults(textQuery: ITextQuery, scannedFiles: ResourceSet, token: CancellationToken): Promise<IClosedNotebookSearchResults> {

		const userAssociations = this.editorResolverService.getAllUserAssociations();
		const allPriorityInfo: Map<string, NotebookPriorityInfo[]> = new Map();
		const contributedNotebookTypes = this.notebookService.getContributedNotebookTypes();


		userAssociations.forEach(association => {

			// we gather the editor associations here, but cannot check them until we actually have the files that the glob matches
			// this is because longer patterns take precedence over shorter ones, and even if there is a user association that
			// specifies the exact same glob as a contributed notebook type, there might be another user association that is longer/more specific
			// that still matches the path and should therefore take more precedence.
			if (!association.filenamePattern) {
				return;
			}

			const info: NotebookPriorityInfo = {
				isFromSettings: true,
				filenamePatterns: [association.filenamePattern]
			};

			const existingEntry = allPriorityInfo.get(association.viewType);
			if (existingEntry) {
				allPriorityInfo.set(association.viewType, existingEntry.concat(info));
			} else {
				allPriorityInfo.set(association.viewType, [info]);
			}
		});

		const promises: Promise<{
			results: INotebookFileMatchNoModel<URI>[];
			limitHit: boolean;
		} | undefined>[] = [];

		contributedNotebookTypes.forEach((notebook) => {
			if (notebook.selectors.length > 0) {
				promises.push((async () => {
					const includes = notebook.selectors.map((selector) => {
						const globPattern = (selector as INotebookExclusiveDocumentFilter).include || selector as glob.IRelativePattern | string;
						return globPattern.toString();
					});

					const isInWorkspace = await this.doesFileExist(includes, textQuery.folderQueries, token);
					if (isInWorkspace) {
						const canResolve = await this.notebookService.canResolve(notebook.id);
						if (!canResolve) {
							return undefined;
						}
						const serializer = (await this.notebookService.withNotebookDataProvider(notebook.id)).serializer;
						return await serializer.searchInNotebooks(textQuery, token, allPriorityInfo);
					} else {
						return undefined;
					}
				})());
			}
		});

		const start = Date.now();
		const searchComplete = arrays.coalesce(await Promise.all(promises));
		const results = searchComplete.flatMap(e => e.results);
		let limitHit = searchComplete.some(e => e.limitHit);

		// results are already sorted with high priority first, filter out duplicates.
		const uniqueResults = new ResourceMap<INotebookFileMatchNoModel | null>(uri => this.uriIdentityService.extUri.getComparisonKey(uri));

		let numResults = 0;
		for (const result of results) {
			if (textQuery.maxResults && numResults >= textQuery.maxResults) {
				limitHit = true;
				break;
			}

			if (!scannedFiles.has(result.resource) && !uniqueResults.has(result.resource)) {
				uniqueResults.set(result.resource, result.cellResults.length > 0 ? result : null);
				numResults++;
			}
		}

		const end = Date.now();
		this.logService.trace(`query: ${textQuery.contentPattern.pattern}`);
		this.logService.trace(`closed notebook search time | ${end - start}ms`);

		return {
			results: uniqueResults,
			limitHit
		};
	}

	private async getLocalNotebookResults(query: ITextQuery, token: CancellationToken, widgets: Array<NotebookEditorWidget>, searchID: string): Promise<IOpenNotebookSearchResults> {
		const localResults = new ResourceMap<INotebookFileMatchWithModel | null>(uri => this.uriIdentityService.extUri.getComparisonKey(uri));
		let limitHit = false;

		for (const widget of widgets) {
			if (!widget.hasModel()) {
				continue;
			}
			const askMax = (isNumber(query.maxResults) ? query.maxResults : DEFAULT_MAX_SEARCH_RESULTS) + 1;
			const uri = widget.viewModel!.uri;

			if (!pathIncludedInQuery(query, uri.fsPath)) {
				continue;
			}

			let matches = await widget
				.find(query.contentPattern.pattern, {
					regex: query.contentPattern.isRegExp,
					wholeWord: query.contentPattern.isWordMatch,
					caseSensitive: query.contentPattern.isCaseSensitive,
					includeMarkupInput: query.contentPattern.notebookInfo?.isInNotebookMarkdownInput ?? true,
					includeMarkupPreview: query.contentPattern.notebookInfo?.isInNotebookMarkdownPreview ?? true,
					includeCodeInput: query.contentPattern.notebookInfo?.isInNotebookCellInput ?? true,
					includeOutput: query.contentPattern.notebookInfo?.isInNotebookCellOutput ?? true,
				}, token, false, true, searchID);


			if (matches.length) {
				if (askMax && matches.length >= askMax) {
					limitHit = true;
					matches = matches.slice(0, askMax - 1);
				}
				const cellResults: INotebookCellMatchWithModel[] = matches.map(match => {
					const contentResults = contentMatchesToTextSearchMatches(match.contentMatches, match.cell);
					const webviewResults = webviewMatchesToTextSearchMatches(match.webviewMatches);
					return {
						cell: match.cell,
						index: match.index,
						contentResults: contentResults,
						webviewResults: webviewResults,
					};
				});

				const fileMatch: INotebookFileMatchWithModel = {
					resource: uri, cellResults: cellResults
				};
				localResults.set(uri, fileMatch);
			} else {
				localResults.set(uri, null);
			}
		}

		return {
			results: localResults,
			limitHit
		};
	}


	private getLocalNotebookWidgets(): Array<NotebookEditorWidget> {
		const notebookWidgets = this.notebookEditorService.retrieveAllExistingWidgets();
		return notebookWidgets
			.map(widget => widget.value)
			.filter((val): val is NotebookEditorWidget => !!val && val.hasModel());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/notebookSearch/searchNotebookHelpers.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/notebookSearch/searchNotebookHelpers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FindMatch } from '../../../../../editor/common/model.js';
import { IFileMatch, ITextSearchMatch, TextSearchMatch } from '../../../../services/search/common/search.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { INotebookCellMatchNoModel, INotebookFileMatchNoModel, genericCellMatchesToTextSearchMatches, rawCellPrefix } from '../../common/searchNotebookHelpers.js';
import { CellWebviewFindMatch, ICellViewModel } from '../../../notebook/browser/notebookBrowser.js';
import { URI } from '../../../../../base/common/uri.js';

export type INotebookCellMatch = INotebookCellMatchWithModel | INotebookCellMatchNoModel;
export type INotebookFileMatch = INotebookFileMatchWithModel | INotebookFileMatchNoModel;

export function getIDFromINotebookCellMatch(match: INotebookCellMatch): string {
	if (isINotebookCellMatchWithModel(match)) {
		return match.cell.id;
	} else {
		return `${rawCellPrefix}${match.index}`;
	}
}
export interface INotebookFileMatchWithModel extends IFileMatch {
	cellResults: INotebookCellMatchWithModel[];
}

export interface INotebookCellMatchWithModel extends INotebookCellMatchNoModel<URI> {
	cell: ICellViewModel;
}

export function isINotebookFileMatchWithModel(object: any): object is INotebookFileMatchWithModel {
	return 'cellResults' in object && object.cellResults instanceof Array && object.cellResults.every(isINotebookCellMatchWithModel);
}

export function isINotebookCellMatchWithModel(object: any): object is INotebookCellMatchWithModel {
	return 'cell' in object;
}

export function contentMatchesToTextSearchMatches(contentMatches: FindMatch[], cell: ICellViewModel): ITextSearchMatch[] {
	return genericCellMatchesToTextSearchMatches(
		contentMatches,
		cell.textBuffer
	);
}

export function webviewMatchesToTextSearchMatches(webviewMatches: CellWebviewFindMatch[]): ITextSearchMatch[] {
	return webviewMatches
		.map(rawMatch =>
			(rawMatch.searchPreviewInfo) ?
				new TextSearchMatch(
					rawMatch.searchPreviewInfo.line,
					new Range(0, rawMatch.searchPreviewInfo.range.start, 0, rawMatch.searchPreviewInfo.range.end),
					undefined,
					rawMatch.index) : undefined
		).filter((e): e is TextSearchMatch => !!e);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/quickTextSearch/textSearchQuickAccess.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/quickTextSearch/textSearchQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { CancellationToken, CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { DisposableStore, IDisposable } from '../../../../../base/common/lifecycle.js';
import { ResourceSet } from '../../../../../base/common/map.js';
import { basenameOrAuthority, dirname } from '../../../../../base/common/resources.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { IRange } from '../../../../../editor/common/core/range.js';
import { localize } from '../../../../../nls.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ITextEditorSelection } from '../../../../../platform/editor/common/editor.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { WorkbenchCompressibleAsyncDataTree, getSelectionKeyboardEvent } from '../../../../../platform/list/browser/listService.js';
import { FastAndSlowPicks, IPickerQuickAccessItem, IPickerQuickAccessSeparator, PickerQuickAccessProvider, Picks, TriggerAction } from '../../../../../platform/quickinput/browser/pickerQuickAccess.js';
import { DefaultQuickAccessFilterValue, IQuickAccessProviderRunOptions } from '../../../../../platform/quickinput/common/quickAccess.js';
import { IKeyMods, IQuickPick, IQuickPickItem, QuickInputButtonLocation, QuickInputHideReason } from '../../../../../platform/quickinput/common/quickInput.js';
import { IWorkspaceContextService, IWorkspaceFolder } from '../../../../../platform/workspace/common/workspace.js';
import { IWorkbenchEditorConfiguration } from '../../../../common/editor.js';
import { searchDetailsIcon, searchOpenInFileIcon, searchActivityBarIcon } from '../searchIcons.js';
import { SearchView, getEditorSelectionFromMatch } from '../searchView.js';
import { IWorkbenchSearchConfiguration, getOutOfWorkspaceEditorResources } from '../../common/search.js';
import { ACTIVE_GROUP, IEditorService, SIDE_GROUP } from '../../../../services/editor/common/editorService.js';
import { ITextQueryBuilderOptions, QueryBuilder } from '../../../../services/search/common/queryBuilder.js';
import { IPatternInfo, ISearchComplete, ITextQuery, VIEW_ID } from '../../../../services/search/common/search.js';
import { Event } from '../../../../../base/common/event.js';
import { PickerEditorState } from '../../../../browser/quickaccess.js';
import { IViewsService } from '../../../../services/views/common/viewsService.js';
import { Sequencer } from '../../../../../base/common/async.js';
import { URI } from '../../../../../base/common/uri.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { SearchModelImpl } from '../searchTreeModel/searchModel.js';
import { SearchModelLocation, RenderableMatch, ISearchTreeFileMatch, ISearchTreeMatch, ISearchResult } from '../searchTreeModel/searchTreeCommon.js';
import { searchComparer } from '../searchCompare.js';
import { IMatch } from '../../../../../base/common/filters.js';

export const TEXT_SEARCH_QUICK_ACCESS_PREFIX = '%';

const DEFAULT_TEXT_QUERY_BUILDER_OPTIONS: ITextQueryBuilderOptions = {
	_reason: 'quickAccessSearch',
	disregardIgnoreFiles: false,
	disregardExcludeSettings: false,
	onlyOpenEditors: false,
	expandPatterns: true
};

const MAX_FILES_SHOWN = 30;
const MAX_RESULTS_PER_FILE = 10;
const DEBOUNCE_DELAY = 75;

interface ITextSearchQuickAccessItem extends IPickerQuickAccessItem {
	match?: ISearchTreeMatch;
}
export class TextSearchQuickAccess extends PickerQuickAccessProvider<ITextSearchQuickAccessItem> {

	private editorSequencer: Sequencer;
	private queryBuilder: QueryBuilder;
	private searchModel: SearchModelImpl;
	private currentAsyncSearch: Promise<ISearchComplete> = Promise.resolve({
		results: [],
		messages: []
	});
	private readonly editorViewState: PickerEditorState;

	private _getTextQueryBuilderOptions(charsPerLine: number): ITextQueryBuilderOptions {
		return {
			...DEFAULT_TEXT_QUERY_BUILDER_OPTIONS,
			... {
				extraFileResources: this._instantiationService.invokeFunction(getOutOfWorkspaceEditorResources),
				maxResults: this.configuration.maxResults ?? undefined,
				isSmartCase: this.configuration.smartCase,
			},

			previewOptions: {
				matchLines: 1,
				charsPerLine
			}
		};
	}

	constructor(
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IWorkspaceContextService private readonly _contextService: IWorkspaceContextService,
		@IEditorService private readonly _editorService: IEditorService,
		@ILabelService private readonly _labelService: ILabelService,
		@IViewsService private readonly _viewsService: IViewsService,
		@IConfigurationService private readonly _configurationService: IConfigurationService
	) {
		super(TEXT_SEARCH_QUICK_ACCESS_PREFIX, { canAcceptInBackground: true, shouldSkipTrimPickFilter: true });

		this.queryBuilder = this._instantiationService.createInstance(QueryBuilder);
		this.searchModel = this._register(this._instantiationService.createInstance(SearchModelImpl));
		this.editorViewState = this._register(this._instantiationService.createInstance(PickerEditorState));
		this.searchModel.location = SearchModelLocation.QUICK_ACCESS;
		this.editorSequencer = new Sequencer();
	}

	override dispose(): void {
		this.searchModel.dispose();
		super.dispose();
	}

	override provide(picker: IQuickPick<ITextSearchQuickAccessItem, { useSeparators: true }>, token: CancellationToken, runOptions?: IQuickAccessProviderRunOptions): IDisposable {
		const disposables = new DisposableStore();
		if (TEXT_SEARCH_QUICK_ACCESS_PREFIX.length < picker.value.length) {
			picker.valueSelection = [TEXT_SEARCH_QUICK_ACCESS_PREFIX.length, picker.value.length];
		}
		picker.buttons = [{
			location: QuickInputButtonLocation.Inline,
			iconClass: ThemeIcon.asClassName(Codicon.goToSearch),
			tooltip: localize('goToSearch', "Open in Search View")
		}];
		this.editorViewState.reset();
		disposables.add(picker.onDidTriggerButton(async () => {
			await this.moveToSearchViewlet(undefined);
			picker.hide();
		}));

		const onDidChangeActive = () => {
			const [item] = picker.activeItems;

			if (item?.match) {
				// we must remember our curret view state to be able to restore (will automatically track if there is already stored state)
				this.editorViewState.set();
				const itemMatch = item.match;
				this.editorSequencer.queue(async () => {
					await this.editorViewState.openTransientEditor({
						resource: itemMatch.parent().resource,
						options: { preserveFocus: true, revealIfOpened: true, ignoreError: true, selection: itemMatch.range() }
					});
				});
			}
		};

		disposables.add(Event.debounce(picker.onDidChangeActive, (last, event) => event, DEBOUNCE_DELAY, true)(onDidChangeActive));
		disposables.add(Event.once(picker.onWillHide)(({ reason }) => {
			// Restore view state upon cancellation if we changed it
			// but only when the picker was closed via explicit user
			// gesture and not e.g. when focus was lost because that
			// could mean the user clicked into the editor directly.
			if (reason === QuickInputHideReason.Gesture) {
				this.editorViewState.restore();
			}
		}));

		disposables.add(Event.once(picker.onDidHide)(({ reason }) => {
			this.searchModel.searchResult.toggleHighlights(false);
		}));

		disposables.add(super.provide(picker, token, runOptions));
		disposables.add(picker.onDidAccept(() => this.searchModel.searchResult.toggleHighlights(false)));
		return disposables;
	}

	private get configuration() {
		const editorConfig = this._configurationService.getValue<IWorkbenchEditorConfiguration>().workbench?.editor;
		const searchConfig = this._configurationService.getValue<IWorkbenchSearchConfiguration>().search;

		return {
			openEditorPinned: !editorConfig?.enablePreviewFromQuickOpen || !editorConfig?.enablePreview,
			preserveInput: searchConfig.quickAccess.preserveInput,
			maxResults: searchConfig.maxResults,
			smartCase: searchConfig.smartCase,
			sortOrder: searchConfig.sortOrder,
		};
	}

	get defaultFilterValue(): DefaultQuickAccessFilterValue | undefined {
		if (this.configuration.preserveInput) {
			return DefaultQuickAccessFilterValue.LAST;
		}

		return undefined;
	}

	private doSearch(contentPattern: string, token: CancellationToken): {
		syncResults: ISearchTreeFileMatch[];
		asyncResults: Promise<ISearchTreeFileMatch[]>;
	} | undefined {
		if (contentPattern === '') {
			return undefined;
		}

		const folderResources: IWorkspaceFolder[] = this._contextService.getWorkspace().folders;
		const content: IPatternInfo = {
			pattern: contentPattern,
		};
		this.searchModel.searchResult.toggleHighlights(false);
		const charsPerLine = content.isRegExp ? 10000 : 1000; // from https://github.com/microsoft/vscode/blob/e7ad5651ac26fa00a40aa1e4010e81b92f655569/src/vs/workbench/contrib/search/browser/searchView.ts#L1508

		const query: ITextQuery = this.queryBuilder.text(content, folderResources.map(folder => folder.uri), this._getTextQueryBuilderOptions(charsPerLine));

		const result = this.searchModel.search(query, undefined, token);

		const getAsyncResults = async () => {
			this.currentAsyncSearch = result.asyncResults;
			await result.asyncResults;
			const syncResultURIs = new ResourceSet(result.syncResults.map(e => e.resource));
			return this.searchModel.searchResult.matches(false).filter(e => !syncResultURIs.has(e.resource));
		};
		return {
			syncResults: this.searchModel.searchResult.matches(false),
			asyncResults: getAsyncResults()
		};
	}

	private async moveToSearchViewlet(currentElem: RenderableMatch | undefined) {
		// this function takes this._searchModel and moves it to the search viewlet's search model.
		// then, this._searchModel will construct a new (empty) SearchModel.
		this._viewsService.openView(VIEW_ID, false);
		const viewlet: SearchView | undefined = this._viewsService.getActiveViewWithId(VIEW_ID) as SearchView;
		await viewlet.replaceSearchModel(this.searchModel, this.currentAsyncSearch);

		this.searchModel = this._instantiationService.createInstance(SearchModelImpl);
		this.searchModel.location = SearchModelLocation.QUICK_ACCESS;

		const viewer: WorkbenchCompressibleAsyncDataTree<ISearchResult, RenderableMatch> | undefined = viewlet?.getControl();
		if (currentElem) {
			viewer.setFocus([currentElem], getSelectionKeyboardEvent());
			viewer.setSelection([currentElem], getSelectionKeyboardEvent());
			viewer.reveal(currentElem);
		} else {
			viewlet.searchAndReplaceWidget.focus();
		}
	}


	private _getPicksFromMatches(matches: ISearchTreeFileMatch[], limit: number, firstFile?: URI): (IPickerQuickAccessSeparator | ITextSearchQuickAccessItem)[] {
		matches = matches.sort((a, b) => {
			if (firstFile) {
				if (firstFile === a.resource) {
					return -1;
				} else if (firstFile === b.resource) {
					return 1;
				}
			}
			return searchComparer(a, b, this.configuration.sortOrder);
		});

		const files = matches.length > limit ? matches.slice(0, limit) : matches;
		const picks: Array<ITextSearchQuickAccessItem | IPickerQuickAccessSeparator> = [];

		for (let fileIndex = 0; fileIndex < matches.length; fileIndex++) {
			if (fileIndex === limit) {

				picks.push({
					type: 'separator',
				});

				picks.push({
					label: localize('QuickSearchSeeMoreFiles', "See More Files"),
					iconClass: ThemeIcon.asClassName(searchDetailsIcon),
					accept: async () => {
						await this.moveToSearchViewlet(matches[limit]);
					}
				});
				break;
			}

			const iFileInstanceMatch = files[fileIndex];

			const label = basenameOrAuthority(iFileInstanceMatch.resource);
			const description = this._labelService.getUriLabel(dirname(iFileInstanceMatch.resource), { relative: true });


			picks.push({
				label,
				type: 'separator',
				description,
				buttons: [{
					iconClass: ThemeIcon.asClassName(searchOpenInFileIcon),
					tooltip: localize('QuickSearchOpenInFile', "Open File")
				}],
				trigger: async (): Promise<TriggerAction> => {
					await this.handleAccept(iFileInstanceMatch, {});
					return TriggerAction.CLOSE_PICKER;
				},
			});

			const results: ISearchTreeMatch[] = iFileInstanceMatch.matches() ?? [];
			for (let matchIndex = 0; matchIndex < results.length; matchIndex++) {
				const element = results[matchIndex];

				if (matchIndex === MAX_RESULTS_PER_FILE) {
					picks.push({
						label: localize('QuickSearchMore', "More"),
						iconClass: ThemeIcon.asClassName(searchDetailsIcon),
						accept: async () => {
							await this.moveToSearchViewlet(element);
						}
					});
					break;
				}

				const preview = element.preview();
				const previewText = (preview.before + preview.inside + preview.after).trim().substring(0, 999);
				const match: IMatch[] = [{
					start: preview.before.length,
					end: preview.before.length + preview.inside.length
				}];
				picks.push({
					label: `${previewText}`,
					highlights: {
						label: match
					},
					buttons: [{
						iconClass: ThemeIcon.asClassName(searchActivityBarIcon),
						tooltip: localize('showMore', "Open in Search View"),
					}],
					ariaLabel: `Match at location ${element.range().startLineNumber}:${element.range().startColumn} - ${previewText}`,
					accept: async (keyMods, event) => {
						await this.handleAccept(iFileInstanceMatch, {
							keyMods,
							selection: getEditorSelectionFromMatch(element, this.searchModel),
							preserveFocus: event.inBackground,
							forcePinned: event.inBackground
						});
					},
					trigger: async (): Promise<TriggerAction> => {
						await this.moveToSearchViewlet(element);
						return TriggerAction.CLOSE_PICKER;
					},
					match: element
				});
			}
		}
		return picks;
	}

	private async handleAccept(iFileInstanceMatch: ISearchTreeFileMatch, options: { keyMods?: IKeyMods; selection?: ITextEditorSelection; preserveFocus?: boolean; range?: IRange; forcePinned?: boolean; forceOpenSideBySide?: boolean }): Promise<void> {
		const editorOptions = {
			preserveFocus: options.preserveFocus,
			pinned: options.keyMods?.ctrlCmd || options.forcePinned || this.configuration.openEditorPinned,
			selection: options.selection
		};

		// from https://github.com/microsoft/vscode/blob/f40dabca07a1622b2a0ae3ee741cfc94ab964bef/src/vs/workbench/contrib/search/browser/anythingQuickAccess.ts#L1037
		const targetGroup = options.keyMods?.alt || (this.configuration.openEditorPinned && options.keyMods?.ctrlCmd) || options.forceOpenSideBySide ? SIDE_GROUP : ACTIVE_GROUP;

		await this._editorService.openEditor({
			resource: iFileInstanceMatch.resource,
			options: editorOptions
		}, targetGroup);
	}

	protected _getPicks(contentPattern: string, disposables: DisposableStore, token: CancellationToken): Picks<IQuickPickItem> | Promise<Picks<IQuickPickItem> | FastAndSlowPicks<IQuickPickItem>> | FastAndSlowPicks<IQuickPickItem> | null {

		const searchModelAtTimeOfSearch = this.searchModel;
		if (contentPattern === '') {

			this.searchModel.searchResult.clear();
			return [{
				label: localize('enterSearchTerm', "Enter a term to search for across your files.")
			}];
		}

		const conditionalTokenCts = disposables.add(new CancellationTokenSource());

		disposables.add(token.onCancellationRequested(() => {
			if (searchModelAtTimeOfSearch.location === SearchModelLocation.QUICK_ACCESS) {
				// if the search model has not been imported to the panel, you can cancel
				conditionalTokenCts.cancel();
			}
		}));
		const allMatches = this.doSearch(contentPattern, conditionalTokenCts.token);

		if (!allMatches) {
			return null;
		}
		const matches = allMatches.syncResults;
		const syncResult = this._getPicksFromMatches(matches, MAX_FILES_SHOWN, this._editorService.activeEditor?.resource);
		if (syncResult.length > 0) {
			this.searchModel.searchResult.toggleHighlights(true);
		}

		if (matches.length >= MAX_FILES_SHOWN) {
			return syncResult;
		}

		return {
			picks: syncResult,
			additionalPicks: allMatches.asyncResults
				.then(asyncResults => (asyncResults.length + syncResult.length === 0) ? [{
					label: localize('noAnythingResults', "No matching results")
				}] : this._getPicksFromMatches(asyncResults, MAX_FILES_SHOWN - matches.length))
				.then(picks => {
					if (picks.length > 0) {
						this.searchModel.searchResult.toggleHighlights(true);
					}
					return picks;
				})
		};

	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/searchTreeModel/fileMatch.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/searchTreeModel/fileMatch.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RunOnceScheduler } from '../../../../../base/common/async.js';
import { Lazy } from '../../../../../base/common/lazy.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { themeColorFromId } from '../../../../../base/common/themables.js';
import { URI } from '../../../../../base/common/uri.js';
import { TrackedRangeStickiness, MinimapPosition, ITextModel, FindMatch, IModelDeltaDecoration } from '../../../../../editor/common/model.js';
import { ModelDecorationOptions } from '../../../../../editor/common/model/textModel.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { IFileStatWithPartialMetadata, IFileService } from '../../../../../platform/files/common/files.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { overviewRulerFindMatchForeground, minimapFindMatch } from '../../../../../platform/theme/common/colorRegistry.js';
import { IFileMatch, IPatternInfo, ITextSearchPreviewOptions, resultIsMatch, DEFAULT_MAX_SEARCH_RESULTS, ITextSearchResult, ITextSearchContext } from '../../../../services/search/common/search.js';
import { editorMatchesToTextSearchResults, getTextSearchMatchWithModelContext } from '../../../../services/search/common/searchHelpers.js';
import { FindMatchDecorationModel } from '../../../notebook/browser/contrib/find/findMatchDecorationModel.js';
import { IReplaceService } from '../replace.js';
import { FILE_MATCH_PREFIX, ISearchTreeFileMatch, ISearchTreeFolderMatch, ISearchTreeFolderMatchWorkspaceRoot, ISearchTreeMatch } from './searchTreeCommon.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { textSearchResultToMatches } from './match.js';
import { OverviewRulerLane } from '../../../../../editor/common/standalone/standaloneEnums.js';

export class FileMatchImpl extends Disposable implements ISearchTreeFileMatch {

	private static readonly _CURRENT_FIND_MATCH = ModelDecorationOptions.register({
		description: 'search-current-find-match',
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		zIndex: 13,
		className: 'currentFindMatch',
		inlineClassName: 'currentFindMatchInline',
		overviewRuler: {
			color: themeColorFromId(overviewRulerFindMatchForeground),
			position: OverviewRulerLane.Center
		},
		minimap: {
			color: themeColorFromId(minimapFindMatch),
			position: MinimapPosition.Inline
		}
	});

	private static readonly _FIND_MATCH = ModelDecorationOptions.register({
		description: 'search-find-match',
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		className: 'findMatch',
		inlineClassName: 'findMatchInline',
		overviewRuler: {
			color: themeColorFromId(overviewRulerFindMatchForeground),
			position: OverviewRulerLane.Center
		},
		minimap: {
			color: themeColorFromId(minimapFindMatch),
			position: MinimapPosition.Inline
		}
	});

	private static getDecorationOption(selected: boolean): ModelDecorationOptions {
		return (selected ? FileMatchImpl._CURRENT_FIND_MATCH : FileMatchImpl._FIND_MATCH);
	}

	protected _findMatchDecorationModel: FindMatchDecorationModel | undefined;

	protected _onChange = this._register(new Emitter<{ didRemove?: boolean; forceUpdateModel?: boolean }>());
	readonly onChange: Event<{ didRemove?: boolean; forceUpdateModel?: boolean }> = this._onChange.event;

	private _onDispose = this._register(new Emitter<void>());
	readonly onDispose: Event<void> = this._onDispose.event;

	protected _resource: URI;
	private _fileStat?: IFileStatWithPartialMetadata;
	private _model: ITextModel | null = null;
	private _modelListener: DisposableStore | null = null;
	protected _textMatches: Map<string, ISearchTreeMatch>;

	private _removedTextMatches: Set<string>;
	protected _selectedMatch: ISearchTreeMatch | null = null;
	private _name: Lazy<string>;

	private _updateScheduler: RunOnceScheduler;
	private _modelDecorations: string[] = [];

	private _context: Map<number, string> = new Map();

	public get context(): Map<number, string> {
		return new Map(this._context);
	}
	constructor(
		protected _query: IPatternInfo,
		private _previewOptions: ITextSearchPreviewOptions | undefined,
		private _maxResults: number | undefined,
		private _parent: ISearchTreeFolderMatch,
		protected rawMatch: IFileMatch,
		private _closestRoot: ISearchTreeFolderMatchWorkspaceRoot | null,
		@IModelService protected readonly modelService: IModelService,
		@IReplaceService private readonly replaceService: IReplaceService,
		@ILabelService labelService: ILabelService,
	) {
		super();
		this._resource = this.rawMatch.resource;
		this._textMatches = new Map<string, ISearchTreeMatch>();
		this._removedTextMatches = new Set<string>();
		this._updateScheduler = new RunOnceScheduler(this.updateMatchesForModel.bind(this), 250);
		this._name = new Lazy(() => labelService.getUriBasenameLabel(this.resource));
	}


	get closestRoot(): ISearchTreeFolderMatchWorkspaceRoot | null {
		return this._closestRoot;
	}

	hasReadonlyMatches(): boolean {
		return this.matches().some(m => m.isReadonly);
	}

	createMatches(): void {
		const model = this.modelService.getModel(this._resource);
		if (model) {
			// todo: handle better when ai contributed results has model, currently, createMatches does not work for this
			this.bindModel(model);
			this.updateMatchesForModel();
		} else {

			if (this.rawMatch.results) {
				this.rawMatch.results
					.filter(resultIsMatch)
					.forEach(rawMatch => {
						textSearchResultToMatches(rawMatch, this, false)
							.forEach(m => this.add(m));
					});
			}
		}
	}
	bindModel(model: ITextModel): void {
		this._model = model;
		this._modelListener = new DisposableStore();
		this._modelListener.add(this._model.onDidChangeContent(() => {
			this._updateScheduler.schedule();
		}));
		this._modelListener.add(this._model.onWillDispose(() => this.onModelWillDispose()));
		this.updateHighlights();
	}

	private onModelWillDispose(): void {
		// Update matches because model might have some dirty changes
		this.updateMatchesForModel();
		this.unbindModel();
	}

	private unbindModel(): void {
		if (this._model) {
			this._updateScheduler.cancel();
			this._model.changeDecorations((accessor) => {
				this._modelDecorations = accessor.deltaDecorations(this._modelDecorations, []);
			});
			this._model = null;
			this._modelListener!.dispose();
		}
	}

	protected updateMatchesForModel(): void {
		// this is called from a timeout and might fire
		// after the model has been disposed
		if (!this._model) {
			return;
		}
		this._textMatches = new Map<string, ISearchTreeMatch>();

		const wordSeparators = this._query.isWordMatch && this._query.wordSeparators ? this._query.wordSeparators : null;
		const matches = this._model
			.findMatches(this._query.pattern, this._model.getFullModelRange(), !!this._query.isRegExp, !!this._query.isCaseSensitive, wordSeparators, false, this._maxResults ?? DEFAULT_MAX_SEARCH_RESULTS);

		this.updateMatches(matches, true, this._model, false);
	}



	protected async updatesMatchesForLineAfterReplace(lineNumber: number, modelChange: boolean): Promise<void> {
		if (!this._model) {
			return;
		}
		const range = {
			startLineNumber: lineNumber,
			startColumn: this._model.getLineMinColumn(lineNumber),
			endLineNumber: lineNumber,
			endColumn: this._model.getLineMaxColumn(lineNumber)
		};
		const oldMatches = Array.from(this._textMatches.values()).filter(match => match.range().startLineNumber === lineNumber);
		oldMatches.forEach(match => this._textMatches.delete(match.id()));

		const wordSeparators = this._query.isWordMatch && this._query.wordSeparators ? this._query.wordSeparators : null;
		const matches = this._model.findMatches(this._query.pattern, range, !!this._query.isRegExp, !!this._query.isCaseSensitive, wordSeparators, false, this._maxResults ?? DEFAULT_MAX_SEARCH_RESULTS);
		this.updateMatches(matches, modelChange, this._model, false);
	}



	private updateMatches(matches: FindMatch[], modelChange: boolean, model: ITextModel, isAiContributed: boolean): void {
		const textSearchResults = editorMatchesToTextSearchResults(matches, model, this._previewOptions);
		textSearchResults.forEach(textSearchResult => {
			textSearchResultToMatches(textSearchResult, this, isAiContributed).forEach(match => {
				if (!this._removedTextMatches.has(match.id())) {
					this.add(match);
					if (this.isMatchSelected(match)) {
						this._selectedMatch = match;
					}
				}
			});
		});

		this.addContext(getTextSearchMatchWithModelContext(textSearchResults, model, this.parent().parent().query!));

		this._onChange.fire({ forceUpdateModel: modelChange });
		this.updateHighlights();
	}

	updateHighlights(): void {
		if (!this._model) {
			return;
		}

		this._model.changeDecorations((accessor) => {
			const newDecorations = (
				this.parent().showHighlights
					? this.matches().map((match): IModelDeltaDecoration => ({
						range: match.range(),
						options: FileMatchImpl.getDecorationOption(this.isMatchSelected(match))
					}))
					: []
			);
			this._modelDecorations = accessor.deltaDecorations(this._modelDecorations, newDecorations);
		});
	}

	id(): string {
		return FILE_MATCH_PREFIX + this.resource.toString();
	}

	parent(): ISearchTreeFolderMatch {
		return this._parent;
	}

	get hasChildren(): boolean {
		return this._textMatches.size > 0;
	}

	matches(): ISearchTreeMatch[] {
		return [...this._textMatches.values()];
	}

	textMatches(): ISearchTreeMatch[] {
		return Array.from(this._textMatches.values());
	}

	remove(matches: ISearchTreeMatch | ISearchTreeMatch[]): void {
		if (!Array.isArray(matches)) {
			matches = [matches];
		}

		for (const match of matches) {
			this.removeMatch(match);
			this._removedTextMatches.add(match.id());
		}

		this._onChange.fire({ didRemove: true });
	}

	private replaceQ = Promise.resolve();
	async replace(toReplace: ISearchTreeMatch): Promise<void> {
		return this.replaceQ = this.replaceQ.finally(async () => {
			await this.replaceService.replace(toReplace);
			await this.updatesMatchesForLineAfterReplace(toReplace.range().startLineNumber, false);
		});
	}

	setSelectedMatch(match: ISearchTreeMatch | null): void {
		if (match) {

			if (!this._textMatches.has(match.id())) {
				return;
			}
			if (this.isMatchSelected(match)) {
				return;
			}
		}

		this._selectedMatch = match;
		this.updateHighlights();
	}

	getSelectedMatch(): ISearchTreeMatch | null {
		return this._selectedMatch;
	}

	isMatchSelected(match: ISearchTreeMatch): boolean {
		return !!this._selectedMatch && this._selectedMatch.id() === match.id();
	}

	count(): number {
		return this.matches().length;
	}

	get resource(): URI {
		return this._resource;
	}

	name(): string {
		return this._name.value;
	}

	addContext(results: ITextSearchResult[] | undefined) {
		if (!results) { return; }

		const contexts = results
			.filter((result =>
				!resultIsMatch(result)) as ((a: any) => a is ITextSearchContext));

		return contexts.forEach(context => this._context.set(context.lineNumber, context.text));
	}

	add(match: ISearchTreeMatch, trigger?: boolean) {
		this._textMatches.set(match.id(), match);
		if (trigger) {
			this._onChange.fire({ forceUpdateModel: true });
		}
	}

	protected removeMatch(match: ISearchTreeMatch) {
		this._textMatches.delete(match.id());
		if (this.isMatchSelected(match)) {
			this.setSelectedMatch(null);
			this._findMatchDecorationModel?.clearCurrentFindMatchDecoration();
		} else {
			this.updateHighlights();
		}
	}

	async resolveFileStat(fileService: IFileService): Promise<void> {
		this._fileStat = await fileService.stat(this.resource).catch(() => undefined);
	}

	public get fileStat(): IFileStatWithPartialMetadata | undefined {
		return this._fileStat;
	}

	public set fileStat(stat: IFileStatWithPartialMetadata | undefined) {
		this._fileStat = stat;
	}

	override dispose(): void {
		this.setSelectedMatch(null);
		this.unbindModel();
		this._onDispose.fire();
		super.dispose();
	}

	hasOnlyReadOnlyMatches(): boolean {
		return this.matches().every(match => match.isReadonly);
	}

	// #region strictly notebook methods

	//#endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/searchTreeModel/folderMatch.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/searchTreeModel/folderMatch.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../../base/common/event.js';
import { Lazy } from '../../../../../base/common/lazy.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../../base/common/map.js';
import { TernarySearchTree } from '../../../../../base/common/ternarySearchTree.js';
import { URI } from '../../../../../base/common/uri.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { IReplaceService } from './../replace.js';
import { IFileMatch, IPatternInfo, ITextQuery, ITextSearchPreviewOptions, resultIsMatch } from '../../../../services/search/common/search.js';

import { FileMatchImpl } from './fileMatch.js';
import { IChangeEvent, ISearchTreeFileMatch, ISearchTreeFolderMatch, ISearchTreeFolderMatchWithResource, ISearchTreeFolderMatchNoRoot, ISearchTreeFolderMatchWorkspaceRoot, ISearchModel, ISearchResult, isSearchTreeFolderMatchWorkspaceRoot, ITextSearchHeading, isSearchTreeFolderMatchNoRoot, FOLDER_MATCH_PREFIX, getFileMatches } from './searchTreeCommon.js';
import { NotebookEditorWidget } from '../../../notebook/browser/notebookEditorWidget.js';
import { isINotebookFileMatchNoModel } from '../../common/searchNotebookHelpers.js';
import { NotebookCompatibleFileMatch } from '../notebookSearch/notebookSearchModel.js';
import { isINotebookFileMatchWithModel, getIDFromINotebookCellMatch } from '../notebookSearch/searchNotebookHelpers.js';
import { isNotebookFileMatch } from '../notebookSearch/notebookSearchModelBase.js';
import { textSearchResultToMatches } from './match.js';

export class FolderMatchImpl extends Disposable implements ISearchTreeFolderMatch {

	protected _onChange = this._register(new Emitter<IChangeEvent>());
	readonly onChange: Event<IChangeEvent> = this._onChange.event;

	private _onDispose = this._register(new Emitter<void>());
	readonly onDispose: Event<void> = this._onDispose.event;

	protected _fileMatches: ResourceMap<ISearchTreeFileMatch>;
	protected _folderMatches: ResourceMap<FolderMatchWithResourceImpl>;
	protected _folderMatchesMap: TernarySearchTree<URI, FolderMatchWithResourceImpl>;
	protected _unDisposedFileMatches: ResourceMap<ISearchTreeFileMatch>;
	protected _unDisposedFolderMatches: ResourceMap<FolderMatchWithResourceImpl>;
	private _replacingAll: boolean = false;
	private _name: Lazy<string>;
	private readonly _id: string;

	constructor(
		protected _resource: URI | null,
		_id: string,
		protected _index: number,
		protected _query: ITextQuery,
		private _parent: ITextSearchHeading | FolderMatchImpl,
		private _searchResult: ISearchResult,
		private _closestRoot: ISearchTreeFolderMatchWorkspaceRoot | null,
		@IReplaceService private readonly replaceService: IReplaceService,
		@IInstantiationService protected readonly instantiationService: IInstantiationService,
		@ILabelService labelService: ILabelService,
		@IUriIdentityService protected readonly uriIdentityService: IUriIdentityService
	) {
		super();
		this._fileMatches = new ResourceMap<ISearchTreeFileMatch>();
		this._folderMatches = new ResourceMap<FolderMatchWithResourceImpl>();
		this._folderMatchesMap = TernarySearchTree.forUris<FolderMatchWithResourceImpl>(key => this.uriIdentityService.extUri.ignorePathCasing(key));
		this._unDisposedFileMatches = new ResourceMap<ISearchTreeFileMatch>();
		this._unDisposedFolderMatches = new ResourceMap<FolderMatchWithResourceImpl>();
		this._name = new Lazy(() => this.resource ? labelService.getUriBasenameLabel(this.resource) : '');
		this._id = FOLDER_MATCH_PREFIX + _id;
	}

	get searchModel(): ISearchModel {
		return this._searchResult.searchModel;
	}

	get showHighlights(): boolean {
		return this._parent.showHighlights;
	}

	get closestRoot(): ISearchTreeFolderMatchWorkspaceRoot | null {
		return this._closestRoot;
	}

	set replacingAll(b: boolean) {
		this._replacingAll = b;
	}

	id(): string {
		return this._id;
	}

	get resource(): URI | null {
		return this._resource;
	}

	index(): number {
		return this._index;
	}

	name(): string {
		return this._name.value;
	}

	parent(): ITextSearchHeading | FolderMatchImpl {
		return this._parent;
	}

	isAIContributed(): boolean {
		return false;
	}

	get hasChildren(): boolean {
		return this._fileMatches.size > 0 || this._folderMatches.size > 0;
	}

	bindModel(model: ITextModel): void {
		const fileMatch = this._fileMatches.get(model.uri);

		if (fileMatch) {
			fileMatch.bindModel(model);
		} else {
			const folderMatch = this.getFolderMatch(model.uri);
			const match = folderMatch?.getDownstreamFileMatch(model.uri);
			match?.bindModel(model);
		}
	}

	public createIntermediateFolderMatch(resource: URI, id: string, index: number, query: ITextQuery, baseWorkspaceFolder: ISearchTreeFolderMatchWorkspaceRoot): FolderMatchWithResourceImpl {
		const folderMatch = this._register(this.instantiationService.createInstance(FolderMatchWithResourceImpl, resource, id, index, query, this, this._searchResult, baseWorkspaceFolder));
		this.configureIntermediateMatch(folderMatch);
		this.doAddFolder(folderMatch);
		return folderMatch;
	}

	public configureIntermediateMatch(folderMatch: FolderMatchWithResourceImpl) {
		const disposable = folderMatch.onChange((event) => this.onFolderChange(folderMatch, event));
		this._register(folderMatch.onDispose(() => disposable.dispose()));
	}

	clear(clearingAll = false): void {
		const changed: ISearchTreeFileMatch[] = this.allDownstreamFileMatches();
		this.disposeMatches();
		this._onChange.fire({ elements: changed, removed: true, added: false, clearingAll });
	}

	remove(matches: ISearchTreeFileMatch | ISearchTreeFolderMatchWithResource | (ISearchTreeFileMatch | ISearchTreeFolderMatchWithResource)[]): void {
		if (!Array.isArray(matches)) {
			matches = [matches];
		}
		const allMatches = getFileMatches(matches);
		this.doRemoveFile(allMatches);
	}

	async replace(match: FileMatchImpl): Promise<any> {
		return this.replaceService.replace([match]).then(() => {
			this.doRemoveFile([match], true, true, true);
		});
	}

	replaceAll(): Promise<any> {
		const matches = this.matches();
		return this.batchReplace(matches);
	}

	matches(): (ISearchTreeFileMatch | ISearchTreeFolderMatchWithResource)[] {
		return [...this.fileMatchesIterator(), ...this.folderMatchesIterator()];
	}

	fileMatchesIterator(): IterableIterator<ISearchTreeFileMatch> {
		return this._fileMatches.values();
	}

	folderMatchesIterator(): IterableIterator<ISearchTreeFolderMatchWithResource> {
		return this._folderMatches.values();
	}

	isEmpty(): boolean {
		return (this.fileCount() + this.folderCount()) === 0;
	}

	getDownstreamFileMatch(uri: URI): ISearchTreeFileMatch | null {
		const directChildFileMatch = this._fileMatches.get(uri);
		if (directChildFileMatch) {
			return directChildFileMatch;
		}

		const folderMatch = this.getFolderMatch(uri);
		const match = folderMatch?.getDownstreamFileMatch(uri);
		if (match) {
			return match;
		}

		return null;
	}

	allDownstreamFileMatches(): ISearchTreeFileMatch[] {
		let recursiveChildren: ISearchTreeFileMatch[] = [];
		const iterator = this.folderMatchesIterator();
		for (const elem of iterator) {
			recursiveChildren = recursiveChildren.concat(elem.allDownstreamFileMatches());
		}

		return [...this.fileMatchesIterator(), ...recursiveChildren];
	}

	private fileCount(): number {
		return this._fileMatches.size;
	}

	private folderCount(): number {
		return this._folderMatches.size;
	}

	count(): number {
		return this.fileCount() + this.folderCount();
	}

	recursiveFileCount(): number {
		return this.allDownstreamFileMatches().length;
	}

	recursiveMatchCount(): number {
		return this.allDownstreamFileMatches().reduce<number>((prev, match) => prev + match.count(), 0);
	}

	get query(): ITextQuery | null {
		return this._query;
	}

	doAddFile(fileMatch: ISearchTreeFileMatch): void {
		this._fileMatches.set(fileMatch.resource, fileMatch);
		this._unDisposedFileMatches.delete(fileMatch.resource);
	}

	hasOnlyReadOnlyMatches(): boolean {
		return Array.from(this._fileMatches.values()).every(fm => fm.hasOnlyReadOnlyMatches());
	}

	protected uriHasParent(parent: URI, child: URI) {
		return this.uriIdentityService.extUri.isEqualOrParent(child, parent) && !this.uriIdentityService.extUri.isEqual(child, parent);
	}

	private isInParentChain(folderMatch: FolderMatchWithResourceImpl) {

		let matchItem: FolderMatchImpl | ITextSearchHeading = this;
		while (matchItem instanceof FolderMatchImpl) {
			if (matchItem.id() === folderMatch.id()) {
				return true;
			}
			matchItem = matchItem.parent();
		}
		return false;
	}

	public getFolderMatch(resource: URI): FolderMatchWithResourceImpl | undefined {
		const folderMatch = this._folderMatchesMap.findSubstr(resource);
		return folderMatch;
	}

	doAddFolder(folderMatch: FolderMatchWithResourceImpl) {
		if (this.resource && !this.uriHasParent(this.resource, folderMatch.resource)) {
			throw Error(`${folderMatch.resource} does not belong as a child of ${this.resource}`);
		} else if (this.isInParentChain(folderMatch)) {
			throw Error(`${folderMatch.resource} is a parent of ${this.resource}`);
		}

		this._folderMatches.set(folderMatch.resource, folderMatch);
		this._folderMatchesMap.set(folderMatch.resource, folderMatch);
		this._unDisposedFolderMatches.delete(folderMatch.resource);
	}

	private async batchReplace(matches: (ISearchTreeFileMatch | ISearchTreeFolderMatchWithResource)[]): Promise<any> {
		const allMatches = getFileMatches(matches);

		await this.replaceService.replace(allMatches);
		this.doRemoveFile(allMatches, true, true, true);
	}

	public onFileChange(fileMatch: ISearchTreeFileMatch, removed = false): void {
		let added = false;
		if (!this._fileMatches.has(fileMatch.resource)) {
			this.doAddFile(fileMatch);
			added = true;
		}
		if (fileMatch.count() === 0) {
			this.doRemoveFile([fileMatch], false, false);
			added = false;
			removed = true;
		}
		if (!this._replacingAll) {
			this._onChange.fire({ elements: [fileMatch], added: added, removed: removed });
		}
	}

	public onFolderChange(folderMatch: FolderMatchWithResourceImpl, event: IChangeEvent): void {
		if (!this._folderMatches.has(folderMatch.resource)) {
			this.doAddFolder(folderMatch);
		}
		if (folderMatch.isEmpty()) {
			this._folderMatches.delete(folderMatch.resource);
			folderMatch.dispose();
		}

		this._onChange.fire(event);
	}

	doRemoveFile(fileMatches: ISearchTreeFileMatch[], dispose: boolean = true, trigger: boolean = true, keepReadonly = false): void {

		const removed = [];
		for (const match of fileMatches as ISearchTreeFileMatch[]) {
			if (this._fileMatches.get(match.resource)) {
				if (keepReadonly && match.hasReadonlyMatches()) {
					continue;
				}
				this._fileMatches.delete(match.resource);
				if (dispose) {
					match.dispose();
				} else {
					this._unDisposedFileMatches.set(match.resource, match);
				}
				removed.push(match);
			} else {
				const folder = this.getFolderMatch(match.resource);
				if (folder) {
					folder.doRemoveFile([match], dispose, trigger);
				} else {
					throw Error(`FileMatch ${match.resource} is not located within FolderMatch ${this.resource}`);
				}
			}
		}

		if (trigger) {
			this._onChange.fire({ elements: removed, removed: true });
		}
	}

	async bindNotebookEditorWidget(editor: NotebookEditorWidget, resource: URI) {
		const fileMatch = this._fileMatches.get(resource);
		if (isNotebookFileMatch(fileMatch)) {
			if (fileMatch) {
				fileMatch.bindNotebookEditorWidget(editor);
				await fileMatch.updateMatchesForEditorWidget();
			} else {
				const folderMatches = this.folderMatchesIterator();
				for (const elem of folderMatches) {
					await elem.bindNotebookEditorWidget(editor, resource);
				}
			}
		}
	}

	addFileMatch(raw: IFileMatch[], silent: boolean, searchInstanceID: string): void {
		// when adding a fileMatch that has intermediate directories
		const added: ISearchTreeFileMatch[] = [];
		const updated: ISearchTreeFileMatch[] = [];

		raw.forEach(rawFileMatch => {
			const existingFileMatch = this.getDownstreamFileMatch(rawFileMatch.resource);
			if (existingFileMatch) {

				if (rawFileMatch.results) {
					rawFileMatch
						.results
						.filter(resultIsMatch)
						.forEach(m => {
							textSearchResultToMatches(m, existingFileMatch, false)
								.forEach(m => existingFileMatch.add(m));
						});
				}

				// add cell matches
				if (isINotebookFileMatchWithModel(rawFileMatch) || isINotebookFileMatchNoModel(rawFileMatch)) {
					rawFileMatch.cellResults?.forEach(rawCellMatch => {
						if (isNotebookFileMatch(existingFileMatch)) {
							const existingCellMatch = existingFileMatch.getCellMatch(getIDFromINotebookCellMatch(rawCellMatch));
							if (existingCellMatch) {
								existingCellMatch.addContentMatches(rawCellMatch.contentResults);
								existingCellMatch.addWebviewMatches(rawCellMatch.webviewResults);
							} else {
								existingFileMatch.addCellMatch(rawCellMatch);
							}
						}
					});
				}

				updated.push(existingFileMatch);

				if (rawFileMatch.results && rawFileMatch.results.length > 0) {
					existingFileMatch.addContext(rawFileMatch.results);
				}
			} else {
				if (isSearchTreeFolderMatchWorkspaceRoot(this) || isSearchTreeFolderMatchNoRoot(this)) {
					const fileMatch = this.createAndConfigureFileMatch(rawFileMatch, searchInstanceID);
					added.push(fileMatch);
				}
			}
		});

		const elements = [...added, ...updated];
		if (!silent && elements.length) {
			this._onChange.fire({ elements, added: !!added.length });
		}
	}

	unbindNotebookEditorWidget(editor: NotebookEditorWidget, resource: URI) {
		const fileMatch = this._fileMatches.get(resource);

		if (isNotebookFileMatch(fileMatch)) {
			if (fileMatch) {
				fileMatch.unbindNotebookEditorWidget(editor);
			} else {
				const folderMatches = this.folderMatchesIterator();
				for (const elem of folderMatches) {
					elem.unbindNotebookEditorWidget(editor, resource);
				}
			}
		}

	}

	disposeMatches(): void {
		[...this._fileMatches.values()].forEach((fileMatch: ISearchTreeFileMatch) => fileMatch.dispose());
		[...this._folderMatches.values()].forEach((folderMatch: FolderMatchImpl) => folderMatch.disposeMatches());
		[...this._unDisposedFileMatches.values()].forEach((fileMatch: ISearchTreeFileMatch) => fileMatch.dispose());
		[...this._unDisposedFolderMatches.values()].forEach((folderMatch: FolderMatchImpl) => folderMatch.disposeMatches());
		this._fileMatches.clear();
		this._folderMatches.clear();
		this._unDisposedFileMatches.clear();
		this._unDisposedFolderMatches.clear();
	}

	override dispose(): void {
		this.disposeMatches();
		this._onDispose.fire();
		super.dispose();
	}
}

export class FolderMatchWithResourceImpl extends FolderMatchImpl implements ISearchTreeFolderMatchWithResource {

	protected _normalizedResource: Lazy<URI>;

	constructor(_resource: URI,
		_id: string,
		_index: number,
		_query: ITextQuery,
		_parent: ITextSearchHeading | FolderMatchImpl,
		_searchResult: ISearchResult,
		_closestRoot: ISearchTreeFolderMatchWorkspaceRoot | null,
		@IReplaceService replaceService: IReplaceService,
		@IInstantiationService instantiationService: IInstantiationService,
		@ILabelService labelService: ILabelService,
		@IUriIdentityService uriIdentityService: IUriIdentityService
	) {
		super(_resource, _id, _index, _query, _parent, _searchResult, _closestRoot, replaceService, instantiationService, labelService, uriIdentityService);
		this._normalizedResource = new Lazy(() => this.uriIdentityService.extUri.removeTrailingPathSeparator(this.uriIdentityService.extUri.normalizePath(
			this.resource)));
	}

	override get resource(): URI {
		return this._resource!;
	}

	get normalizedResource(): URI {
		return this._normalizedResource.value;
	}
}

/**
 * FolderMatchWorkspaceRoot => folder for workspace root
 */
export class FolderMatchWorkspaceRootImpl extends FolderMatchWithResourceImpl implements ISearchTreeFolderMatchWorkspaceRoot {
	constructor(_resource: URI, _id: string, _index: number, _query: ITextQuery, _parent: ITextSearchHeading,
		@IReplaceService replaceService: IReplaceService,
		@IInstantiationService instantiationService: IInstantiationService,
		@ILabelService labelService: ILabelService,
		@IUriIdentityService uriIdentityService: IUriIdentityService
	) {
		super(_resource, _id, _index, _query, _parent, _parent.parent(), null, replaceService, instantiationService, labelService, uriIdentityService);
	}

	private normalizedUriParent(uri: URI): URI {
		return this.uriIdentityService.extUri.normalizePath(this.uriIdentityService.extUri.dirname(uri));
	}

	private uriEquals(uri1: URI, ur2: URI): boolean {
		return this.uriIdentityService.extUri.isEqual(uri1, ur2);
	}

	private createFileMatch(query: IPatternInfo, previewOptions: ITextSearchPreviewOptions | undefined, maxResults: number | undefined, parent: FolderMatchImpl, rawFileMatch: IFileMatch, closestRoot: ISearchTreeFolderMatchWorkspaceRoot | null, searchInstanceID: string): FileMatchImpl {
		// TODO: can probably just create FileMatchImpl if we don't expect cell results from the file.
		const fileMatch =
			this.instantiationService.createInstance(
				NotebookCompatibleFileMatch,
				query,
				previewOptions,
				maxResults,
				parent,
				rawFileMatch,
				closestRoot,
				searchInstanceID,
			);
		fileMatch.createMatches();
		parent.doAddFile(fileMatch);
		const disposable = fileMatch.onChange(({ didRemove }) => parent.onFileChange(fileMatch, didRemove));
		this._register(fileMatch.onDispose(() => disposable.dispose()));
		return fileMatch;
	}

	createAndConfigureFileMatch(rawFileMatch: IFileMatch<URI>, searchInstanceID: string): FileMatchImpl {

		if (!this.uriHasParent(this.resource, rawFileMatch.resource)) {
			throw Error(`${rawFileMatch.resource} is not a descendant of ${this.resource}`);
		}

		const fileMatchParentParts: URI[] = [];
		let uri = this.normalizedUriParent(rawFileMatch.resource);

		while (!this.uriEquals(this.normalizedResource, uri)) {
			fileMatchParentParts.unshift(uri);
			const prevUri = uri;
			uri = this.uriIdentityService.extUri.removeTrailingPathSeparator(this.normalizedUriParent(uri));
			if (this.uriEquals(prevUri, uri)) {
				throw Error(`${rawFileMatch.resource} is not correctly configured as a child of ${this.normalizedResource}`);
			}
		}

		const root = this.closestRoot ?? this;
		let parent: FolderMatchWithResourceImpl = this;
		for (let i = 0; i < fileMatchParentParts.length; i++) {
			let folderMatch: FolderMatchWithResourceImpl | undefined = parent.getFolderMatch(fileMatchParentParts[i]);
			if (!folderMatch) {
				folderMatch = parent.createIntermediateFolderMatch(fileMatchParentParts[i], fileMatchParentParts[i].toString(), -1, this._query, root);
			}
			parent = folderMatch;
		}
		const contentPatternToUse = typeof (this._query.contentPattern) === 'string' ? { pattern: this._query.contentPattern } : this._query.contentPattern;
		return this.createFileMatch(contentPatternToUse, this._query.previewOptions, this._query.maxResults, parent, rawFileMatch, root, searchInstanceID);
	}
}

// currently, no support for AI results in out-of-workspace files
export class FolderMatchNoRootImpl extends FolderMatchImpl implements ISearchTreeFolderMatchNoRoot {
	constructor(_id: string, _index: number, _query: ITextQuery, _parent: ITextSearchHeading,
		@IReplaceService replaceService: IReplaceService,
		@IInstantiationService instantiationService: IInstantiationService,
		@ILabelService labelService: ILabelService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,

	) {
		super(null, _id, _index, _query, _parent, _parent.parent(), null, replaceService, instantiationService, labelService, uriIdentityService);
	}

	createAndConfigureFileMatch(rawFileMatch: IFileMatch, searchInstanceID: string): ISearchTreeFileMatch {
		const contentPatternToUse = typeof (this._query.contentPattern) === 'string' ? { pattern: this._query.contentPattern } : this._query.contentPattern;
		// TODO: can probably just create FileMatchImpl if we don't expect cell results from the file.
		const fileMatch = this._register(this.instantiationService.createInstance(
			NotebookCompatibleFileMatch,
			contentPatternToUse,
			this._query.previewOptions,
			this._query.maxResults,
			this, rawFileMatch,
			null,
			searchInstanceID,
		));
		fileMatch.createMatches();
		this.doAddFile(fileMatch);
		const disposable = fileMatch.onChange(({ didRemove }) => this.onFileChange(fileMatch, didRemove));
		this._register(fileMatch.onDispose(() => disposable.dispose()));
		return fileMatch;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/searchTreeModel/match.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/searchTreeModel/match.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { memoize } from '../../../../../base/common/decorators.js';
import { lcut } from '../../../../../base/common/strings.js';
import { ISearchRange, ITextSearchMatch, OneLineRange } from '../../../../services/search/common/search.js';
import { ISearchTreeMatch, ISearchTreeFileMatch, MATCH_PREFIX } from './searchTreeCommon.js';
import { Range } from '../../../../../editor/common/core/range.js';

export function textSearchResultToMatches(rawMatch: ITextSearchMatch, fileMatch: ISearchTreeFileMatch, isAiContributed: boolean): ISearchTreeMatch[] {
	const previewLines = rawMatch.previewText.split('\n');
	return rawMatch.rangeLocations.map((rangeLocation) => {
		const previewRange: ISearchRange = rangeLocation.preview;
		return new MatchImpl(fileMatch, previewLines, previewRange, rangeLocation.source, isAiContributed);
	});
}

export class MatchImpl implements ISearchTreeMatch {

	private static readonly MAX_PREVIEW_CHARS = 250;
	protected _id: string;
	protected _range: Range;
	private _oneLinePreviewText: string;
	private _rangeInPreviewText: ISearchRange;
	// For replace
	private _fullPreviewRange: ISearchRange;

	constructor(protected _parent: ISearchTreeFileMatch, private _fullPreviewLines: string[], _fullPreviewRange: ISearchRange, _documentRange: ISearchRange, private readonly _isReadonly: boolean = false) {
		this._oneLinePreviewText = _fullPreviewLines[_fullPreviewRange.startLineNumber];
		const adjustedEndCol = _fullPreviewRange.startLineNumber === _fullPreviewRange.endLineNumber ?
			_fullPreviewRange.endColumn :
			this._oneLinePreviewText.length;
		this._rangeInPreviewText = new OneLineRange(1, _fullPreviewRange.startColumn + 1, adjustedEndCol + 1);

		this._range = new Range(
			_documentRange.startLineNumber + 1,
			_documentRange.startColumn + 1,
			_documentRange.endLineNumber + 1,
			_documentRange.endColumn + 1);

		this._fullPreviewRange = _fullPreviewRange;

		this._id = MATCH_PREFIX + this._parent.resource.toString() + '>' + this._range + this.getMatchString();
	}

	id(): string {
		return this._id;
	}

	parent(): ISearchTreeFileMatch {
		return this._parent;
	}

	text(): string {
		return this._oneLinePreviewText;
	}

	range(): Range {
		return this._range;
	}

	@memoize
	preview(): { before: string; fullBefore: string; inside: string; after: string } {
		const fullBefore = this._oneLinePreviewText.substring(0, this._rangeInPreviewText.startColumn - 1), before = lcut(fullBefore, 26, '…');

		let inside = this.getMatchString(), after = this._oneLinePreviewText.substring(this._rangeInPreviewText.endColumn - 1);

		let charsRemaining = MatchImpl.MAX_PREVIEW_CHARS - before.length;
		inside = inside.substr(0, charsRemaining);
		charsRemaining -= inside.length;
		after = after.substr(0, charsRemaining);

		return {
			before,
			fullBefore,
			inside,
			after,
		};
	}

	get replaceString(): string {
		const searchModel = this.parent().parent().searchModel;
		if (!searchModel.replacePattern) {
			throw new Error('searchModel.replacePattern must be set before accessing replaceString');
		}

		const fullMatchText = this.fullMatchText();
		let replaceString = searchModel.replacePattern.getReplaceString(fullMatchText, searchModel.preserveCase);
		if (replaceString !== null) {
			return replaceString;
		}

		// Search/find normalize line endings - check whether \r prevents regex from matching
		const fullMatchTextWithoutCR = fullMatchText.replace(/\r\n/g, '\n');
		if (fullMatchTextWithoutCR !== fullMatchText) {
			replaceString = searchModel.replacePattern.getReplaceString(fullMatchTextWithoutCR, searchModel.preserveCase);
			if (replaceString !== null) {
				return replaceString;
			}
		}

		// If match string is not matching then regex pattern has a lookahead expression
		const contextMatchTextWithSurroundingContent = this.fullMatchText(true);
		replaceString = searchModel.replacePattern.getReplaceString(contextMatchTextWithSurroundingContent, searchModel.preserveCase);
		if (replaceString !== null) {
			return replaceString;
		}

		// Search/find normalize line endings, this time in full context
		const contextMatchTextWithoutCR = contextMatchTextWithSurroundingContent.replace(/\r\n/g, '\n');
		if (contextMatchTextWithoutCR !== contextMatchTextWithSurroundingContent) {
			replaceString = searchModel.replacePattern.getReplaceString(contextMatchTextWithoutCR, searchModel.preserveCase);
			if (replaceString !== null) {
				return replaceString;
			}
		}

		// Match string is still not matching. Could be unsupported matches (multi-line).
		return searchModel.replacePattern.pattern;
	}

	fullMatchText(includeSurrounding = false): string {
		let thisMatchPreviewLines: string[];
		if (includeSurrounding) {
			thisMatchPreviewLines = this._fullPreviewLines;
		} else {
			thisMatchPreviewLines = this._fullPreviewLines.slice(this._fullPreviewRange.startLineNumber, this._fullPreviewRange.endLineNumber + 1);
			thisMatchPreviewLines[thisMatchPreviewLines.length - 1] = thisMatchPreviewLines[thisMatchPreviewLines.length - 1].slice(0, this._fullPreviewRange.endColumn);
			thisMatchPreviewLines[0] = thisMatchPreviewLines[0].slice(this._fullPreviewRange.startColumn);
		}

		return thisMatchPreviewLines.join('\n');
	}

	rangeInPreview() {
		// convert to editor's base 1 positions.
		return {
			...this._fullPreviewRange,
			startColumn: this._fullPreviewRange.startColumn + 1,
			endColumn: this._fullPreviewRange.endColumn + 1
		};
	}

	fullPreviewLines(): string[] {
		return this._fullPreviewLines.slice(this._fullPreviewRange.startLineNumber, this._fullPreviewRange.endLineNumber + 1);
	}

	getMatchString(): string {
		return this._oneLinePreviewText.substring(this._rangeInPreviewText.startColumn - 1, this._rangeInPreviewText.endColumn - 1);
	}

	get isReadonly() {
		return this._isReadonly;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/searchTreeModel/rangeDecorations.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/searchTreeModel/rangeDecorations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { ITextModel, TrackedRangeStickiness } from '../../../../../editor/common/model.js';
import { ModelDecorationOptions } from '../../../../../editor/common/model/textModel.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { Range } from '../../../../../editor/common/core/range.js';

/**
 * Can add a range highlight decoration to a model.
 * It will automatically remove it when the model has its decorations changed.
 */

export class RangeHighlightDecorations implements IDisposable {

	private _decorationId: string | null = null;
	private _model: ITextModel | null = null;
	private readonly _modelDisposables = new DisposableStore();

	constructor(
		@IModelService private readonly _modelService: IModelService
	) {
	}

	removeHighlightRange() {
		if (this._model && this._decorationId) {
			const decorationId = this._decorationId;
			this._model.changeDecorations((accessor) => {
				accessor.removeDecoration(decorationId);
			});
		}
		this._decorationId = null;
	}

	highlightRange(resource: URI | ITextModel, range: Range, ownerId: number = 0): void {
		let model: ITextModel | null;
		if (URI.isUri(resource)) {
			model = this._modelService.getModel(resource);
		} else {
			model = resource;
		}

		if (model) {
			this.doHighlightRange(model, range);
		}
	}

	private doHighlightRange(model: ITextModel, range: Range) {
		this.removeHighlightRange();
		model.changeDecorations((accessor) => {
			this._decorationId = accessor.addDecoration(range, RangeHighlightDecorations._RANGE_HIGHLIGHT_DECORATION);
		});
		this.setModel(model);
	}

	private setModel(model: ITextModel) {
		if (this._model !== model) {
			this.clearModelListeners();
			this._model = model;
			this._modelDisposables.add(this._model.onDidChangeDecorations((e) => {
				this.clearModelListeners();
				this.removeHighlightRange();
				this._model = null;
			}));
			this._modelDisposables.add(this._model.onWillDispose(() => {
				this.clearModelListeners();
				this.removeHighlightRange();
				this._model = null;
			}));
		}
	}

	private clearModelListeners() {
		this._modelDisposables.clear();
	}

	dispose() {
		if (this._model) {
			this.removeHighlightRange();
			this._model = null;
		}
		this._modelDisposables.dispose();
	}

	private static readonly _RANGE_HIGHLIGHT_DECORATION = ModelDecorationOptions.register({
		description: 'search-range-highlight',
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		className: 'rangeHighlight',
		isWholeLine: true
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/searchTreeModel/searchModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/searchTreeModel/searchModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { CancellationToken, CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import * as errors from '../../../../../base/common/errors.js';
import { Emitter, Event, PauseableEmitter } from '../../../../../base/common/event.js';
import { Lazy } from '../../../../../base/common/lazy.js';
import { Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import { URI } from '../../../../../base/common/uri.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { INotebookSearchService } from '../../common/notebookSearch.js';
import { ReplacePattern } from '../../../../services/search/common/replace.js';
import { IFileMatch, IPatternInfo, ISearchComplete, ISearchConfigurationProperties, ISearchProgressItem, ISearchService, ITextQuery, ITextSearchStats, QueryType, SearchCompletionExitCode } from '../../../../services/search/common/search.js';
import { IChangeEvent, mergeSearchResultEvents, SearchModelLocation, ISearchModel, ISearchResult, SEARCH_MODEL_PREFIX } from './searchTreeCommon.js';
import { SearchResultImpl } from './searchResult.js';
import { ISearchViewModelWorkbenchService } from './searchViewModelWorkbenchService.js';

export class SearchModelImpl extends Disposable implements ISearchModel {

	private _searchResult: ISearchResult;
	private _searchQuery: ITextQuery | null = null;
	private _replaceActive: boolean = false;
	private _replaceString: string | null = null;
	private _replacePattern: ReplacePattern | null = null;
	private _preserveCase: boolean = false;
	private _startStreamDelay: Promise<void> = Promise.resolve();
	private readonly _resultQueue: IFileMatch[] = [];
	private readonly _aiResultQueue: IFileMatch[] = [];

	private readonly _onReplaceTermChanged: Emitter<void> = this._register(new Emitter<void>());
	readonly onReplaceTermChanged: Event<void> = this._onReplaceTermChanged.event;

	private readonly _onSearchResultChanged = this._register(new PauseableEmitter<IChangeEvent>({
		merge: mergeSearchResultEvents
	}));
	readonly onSearchResultChanged: Event<IChangeEvent> = this._onSearchResultChanged.event;

	private currentCancelTokenSource: CancellationTokenSource | null = null;
	private currentAICancelTokenSource: CancellationTokenSource | null = null;
	private searchCancelledForNewSearch: boolean = false;
	private aiSearchCancelledForNewSearch: boolean = false;
	public location: SearchModelLocation = SearchModelLocation.PANEL;
	private readonly _aiTextResultProviderName: Lazy<Promise<string | undefined>>;

	private readonly _id: string;

	constructor(
		@ISearchService private readonly searchService: ISearchService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ILogService private readonly logService: ILogService,
		@INotebookSearchService private readonly notebookSearchService: INotebookSearchService,
	) {
		super();
		this._searchResult = this.instantiationService.createInstance(SearchResultImpl, this);
		this._register(this._searchResult.onChange((e) => this._onSearchResultChanged.fire(e)));

		this._aiTextResultProviderName = new Lazy(async () => this.searchService.getAIName());
		this._id = SEARCH_MODEL_PREFIX + Date.now().toString();
	}

	id(): string {
		return this._id;
	}

	async getAITextResultProviderName(): Promise<string> {
		const result = await this._aiTextResultProviderName.value;
		if (!result) {
			throw Error('Fetching AI name when no provider present.');
		}
		return result;
	}

	isReplaceActive(): boolean {
		return this._replaceActive;
	}

	set replaceActive(replaceActive: boolean) {
		this._replaceActive = replaceActive;
	}

	get replacePattern(): ReplacePattern | null {
		return this._replacePattern;
	}

	get replaceString(): string {
		return this._replaceString || '';
	}

	set preserveCase(value: boolean) {
		this._preserveCase = value;
	}

	get preserveCase(): boolean {
		return this._preserveCase;
	}

	set replaceString(replaceString: string) {
		this._replaceString = replaceString;
		if (this._searchQuery) {
			this._replacePattern = new ReplacePattern(replaceString, this._searchQuery.contentPattern);
		}
		this._onReplaceTermChanged.fire();
	}

	get searchResult(): ISearchResult {
		return this._searchResult;
	}

	aiSearch(onResult: (result: ISearchProgressItem | undefined) => void): Promise<ISearchComplete> {
		if (this.hasAIResults) {
			// already has matches or pending matches
			throw Error('AI results already exist');
		}
		if (!this._searchQuery) {
			throw Error('No search query');
		}

		const searchInstanceID = Date.now().toString();
		const tokenSource = new CancellationTokenSource();
		this.currentAICancelTokenSource = tokenSource;
		const start = Date.now();
		const asyncAIResults = this.searchService.aiTextSearch(
			{ ...this._searchQuery, contentPattern: this._searchQuery.contentPattern.pattern, type: QueryType.aiText },
			tokenSource.token,
			async (p: ISearchProgressItem) => {
				onResult(p);
				this.onSearchProgress(p, searchInstanceID, false, true);
			}).finally(() => {
				tokenSource.dispose(true);
			}).then(
				value => {
					if (value.results.length === 0) {
						// alert of no results since onProgress won't be called
						onResult(undefined);
					}
					this.onSearchCompleted(value, Date.now() - start, searchInstanceID, true);
					return value;
				},
				e => {
					this.onSearchError(e, Date.now() - start, true);
					throw e;
				});
		return asyncAIResults;
	}

	private doSearch(query: ITextQuery, progressEmitter: Emitter<void>, searchQuery: ITextQuery, searchInstanceID: string, onProgress?: (result: ISearchProgressItem) => void, callerToken?: CancellationToken): {
		asyncResults: Promise<ISearchComplete>;
		syncResults: IFileMatch<URI>[];
	} {
		const asyncGenerateOnProgress = async (p: ISearchProgressItem) => {
			progressEmitter.fire();
			this.onSearchProgress(p, searchInstanceID, false, false);
			onProgress?.(p);
		};

		const syncGenerateOnProgress = (p: ISearchProgressItem) => {
			progressEmitter.fire();
			this.onSearchProgress(p, searchInstanceID, true);
			onProgress?.(p);
		};
		const tokenSource = this.currentCancelTokenSource = new CancellationTokenSource(callerToken);

		const notebookResult = this.notebookSearchService.notebookSearch(query, tokenSource.token, searchInstanceID, asyncGenerateOnProgress);
		const textResult = this.searchService.textSearchSplitSyncAsync(
			searchQuery,
			tokenSource.token, asyncGenerateOnProgress,
			notebookResult.openFilesToScan,
			notebookResult.allScannedFiles,
		);

		const syncResults = textResult.syncResults.results;
		syncResults.forEach(p => { if (p) { syncGenerateOnProgress(p); } });

		const getAsyncResults = async (): Promise<ISearchComplete> => {
			const searchStart = Date.now();

			// resolve async parts of search
			const allClosedEditorResults = await textResult.asyncResults;
			const resolvedNotebookResults = await notebookResult.completeData;
			const searchLength = Date.now() - searchStart;
			const resolvedResult: ISearchComplete = {
				results: [...allClosedEditorResults.results, ...resolvedNotebookResults.results],
				messages: [...allClosedEditorResults.messages, ...resolvedNotebookResults.messages],
				limitHit: allClosedEditorResults.limitHit || resolvedNotebookResults.limitHit,
				exit: allClosedEditorResults.exit,
				stats: allClosedEditorResults.stats,
			};
			this.logService.trace(`whole search time | ${searchLength}ms`);
			return resolvedResult;
		};
		return {
			asyncResults: getAsyncResults()
				.finally(() => tokenSource.dispose(true)),
			syncResults
		};
	}

	get hasAIResults(): boolean {
		return !!(this.searchResult.getCachedSearchComplete(true)) || (!!this.currentAICancelTokenSource && !this.currentAICancelTokenSource.token.isCancellationRequested);
	}

	get hasPlainResults(): boolean {
		return !!(this.searchResult.getCachedSearchComplete(false)) || (!!this.currentCancelTokenSource && !this.currentCancelTokenSource.token.isCancellationRequested);
	}

	search(query: ITextQuery, onProgress?: (result: ISearchProgressItem) => void, callerToken?: CancellationToken): {
		asyncResults: Promise<ISearchComplete>;
		syncResults: IFileMatch<URI>[];
	} {
		this.cancelSearch(true);

		this._searchQuery = query;
		if (!this.searchConfig.searchOnType) {
			this.searchResult.clear();
		}
		const searchInstanceID = Date.now().toString();

		this._searchResult.query = this._searchQuery;

		const progressEmitter = this._register(new Emitter<void>());
		this._replacePattern = new ReplacePattern(this.replaceString, this._searchQuery.contentPattern);

		// In search on type case, delay the streaming of results just a bit, so that we don't flash the only "local results" fast path
		this._startStreamDelay = new Promise(resolve => setTimeout(resolve, this.searchConfig.searchOnType ? 150 : 0));

		const req = this.doSearch(query, progressEmitter, this._searchQuery, searchInstanceID, onProgress, callerToken);
		const asyncResults = req.asyncResults;
		const syncResults = req.syncResults;

		if (onProgress) {
			syncResults.forEach(p => {
				if (p) {
					onProgress(p);
				}
			});
		}

		const start = Date.now();
		let event: IDisposable | undefined;

		const progressEmitterPromise = new Promise(resolve => {
			event = Event.once(progressEmitter.event)(resolve);
			return event;
		});

		Promise.race([asyncResults, progressEmitterPromise]).finally(() => {
			/* __GDPR__
				"searchResultsFirstRender" : {
					"owner": "roblourens",
					"duration" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true }
				}
			*/
			event?.dispose();
			this.telemetryService.publicLog('searchResultsFirstRender', { duration: Date.now() - start });
		});

		try {
			return {
				asyncResults: asyncResults.then(
					value => {
						this.onSearchCompleted(value, Date.now() - start, searchInstanceID, false);
						return value;
					},
					e => {
						this.onSearchError(e, Date.now() - start, false);
						throw e;
					}),
				syncResults
			};
		} finally {
			/* __GDPR__
				"searchResultsFinished" : {
					"owner": "roblourens",
					"duration" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true }
				}
			*/
			this.telemetryService.publicLog('searchResultsFinished', { duration: Date.now() - start });
		}
	}

	private onSearchCompleted(completed: ISearchComplete | undefined, duration: number, searchInstanceID: string, ai: boolean): ISearchComplete | undefined {
		if (!this._searchQuery) {
			throw new Error('onSearchCompleted must be called after a search is started');
		}

		if (ai) {
			this._searchResult.add(this._aiResultQueue, searchInstanceID, true);
			this._aiResultQueue.length = 0;
		} else {
			this._searchResult.add(this._resultQueue, searchInstanceID, false);
			this._resultQueue.length = 0;
		}

		this.searchResult.setCachedSearchComplete(completed, ai);

		const options: IPatternInfo = Object.assign({}, this._searchQuery.contentPattern);
		// eslint-disable-next-line local/code-no-any-casts
		delete (options as any).pattern;

		const stats = completed && completed.stats as ITextSearchStats;

		const fileSchemeOnly = this._searchQuery.folderQueries.every(fq => fq.folder.scheme === Schemas.file);
		const otherSchemeOnly = this._searchQuery.folderQueries.every(fq => fq.folder.scheme !== Schemas.file);
		const scheme = fileSchemeOnly ? Schemas.file :
			otherSchemeOnly ? 'other' :
				'mixed';

		/* __GDPR__
			"searchResultsShown" : {
				"owner": "roblourens",
				"count" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
				"fileCount": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
				"options": { "${inline}": [ "${IPatternInfo}" ] },
				"duration": { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
				"type" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
				"scheme" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
				"searchOnTypeEnabled" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
			}
		*/
		this.telemetryService.publicLog('searchResultsShown', {
			count: this._searchResult.count(),
			fileCount: this._searchResult.fileCount(),
			options,
			duration,
			type: stats && stats.type,
			scheme,
			searchOnTypeEnabled: this.searchConfig.searchOnType
		});
		return completed;
	}

	private onSearchError(e: any, duration: number, ai: boolean): void {
		if (errors.isCancellationError(e)) {
			this.onSearchCompleted(
				(ai ? this.aiSearchCancelledForNewSearch : this.searchCancelledForNewSearch)
					? { exit: SearchCompletionExitCode.NewSearchStarted, results: [], messages: [] }
					: undefined,
				duration, '', ai);
			if (ai) {
				this.aiSearchCancelledForNewSearch = false;
			} else {
				this.searchCancelledForNewSearch = false;
			}
		}
	}

	private onSearchProgress(p: ISearchProgressItem, searchInstanceID: string, sync = true, ai: boolean = false) {
		const targetQueue = ai ? this._aiResultQueue : this._resultQueue;
		if ((<IFileMatch>p).resource) {
			targetQueue.push(<IFileMatch>p);
			if (sync) {
				if (targetQueue.length) {
					this._searchResult.add(targetQueue, searchInstanceID, false, true);
					targetQueue.length = 0;
				}
			} else {
				this._startStreamDelay.then(() => {
					if (targetQueue.length) {
						this._searchResult.add(targetQueue, searchInstanceID, ai, !ai);
						targetQueue.length = 0;
					}
				});
			}

		}
	}

	private get searchConfig() {
		return this.configurationService.getValue<ISearchConfigurationProperties>('search');
	}

	cancelSearch(cancelledForNewSearch = false): boolean {
		if (this.currentCancelTokenSource) {
			this.searchCancelledForNewSearch = cancelledForNewSearch;
			this.currentCancelTokenSource.cancel();
			return true;
		}
		return false;
	}
	cancelAISearch(cancelledForNewSearch = false): boolean {
		if (this.currentAICancelTokenSource) {
			this.aiSearchCancelledForNewSearch = cancelledForNewSearch;
			this.currentAICancelTokenSource.cancel();
			return true;
		}
		return false;
	}
	clearAiSearchResults(): void {
		this._aiResultQueue.length = 0;
		// it's not clear all as we are only clearing the AI results
		this._searchResult.aiTextSearchResult.clear(false);
	}
	override dispose(): void {
		this.cancelSearch();
		this.cancelAISearch();
		this.searchResult.dispose();
		super.dispose();
	}

}


export class SearchViewModelWorkbenchService implements ISearchViewModelWorkbenchService {

	declare readonly _serviceBrand: undefined;
	private _searchModel: SearchModelImpl | null = null;

	constructor(@IInstantiationService private readonly instantiationService: IInstantiationService) {
	}

	get searchModel(): SearchModelImpl {
		if (!this._searchModel) {
			this._searchModel = this.instantiationService.createInstance(SearchModelImpl);
		}
		return this._searchModel;
	}

	set searchModel(searchModel: SearchModelImpl) {
		this._searchModel?.dispose();
		this._searchModel = searchModel;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/searchTreeModel/searchResult.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/searchTreeModel/searchResult.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event, PauseableEmitter } from '../../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IProgress, IProgressStep } from '../../../../../platform/progress/common/progress.js';
import { NotebookEditorWidget } from '../../../notebook/browser/notebookEditorWidget.js';
import { INotebookEditorService } from '../../../notebook/browser/services/notebookEditorService.js';
import { IAITextQuery, IFileMatch, ISearchComplete, ITextQuery, QueryType } from '../../../../services/search/common/search.js';
import { arrayContainsElementOrParent, IChangeEvent, ISearchTreeFileMatch, ISearchTreeFolderMatch, IPlainTextSearchHeading, ISearchModel, ISearchResult, isSearchTreeFileMatch, isSearchTreeFolderMatch, isSearchTreeFolderMatchWithResource, isSearchTreeMatch, isTextSearchHeading, ITextSearchHeading, mergeSearchResultEvents, RenderableMatch, SEARCH_RESULT_PREFIX } from './searchTreeCommon.js';

import { RangeHighlightDecorations } from './rangeDecorations.js';
import { PlainTextSearchHeadingImpl } from './textSearchHeading.js';
import { AITextSearchHeadingImpl } from '../AISearch/aiSearchModel.js';

export class SearchResultImpl extends Disposable implements ISearchResult {

	private _onChange = this._register(new PauseableEmitter<IChangeEvent>({
		merge: mergeSearchResultEvents
	}));
	readonly onChange: Event<IChangeEvent> = this._onChange.event;
	private _onWillChangeModelListener: IDisposable | undefined;
	private _onDidChangeModelListener: IDisposable | undefined;
	private _plainTextSearchResult: PlainTextSearchHeadingImpl;
	private _aiTextSearchResult: AITextSearchHeadingImpl;

	private readonly _id: string;
	constructor(
		public readonly searchModel: ISearchModel,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IModelService private readonly modelService: IModelService,
		@INotebookEditorService private readonly notebookEditorService: INotebookEditorService,
	) {
		super();
		this._plainTextSearchResult = this._register(this.instantiationService.createInstance(PlainTextSearchHeadingImpl, this));
		this._aiTextSearchResult = this._register(this.instantiationService.createInstance(AITextSearchHeadingImpl, this));

		this._register(this._plainTextSearchResult.onChange((e) => this._onChange.fire(e)));
		this._register(this._aiTextSearchResult.onChange((e) => this._onChange.fire(e)));

		this.modelService.getModels().forEach(model => this.onModelAdded(model));
		this._register(this.modelService.onModelAdded(model => this.onModelAdded(model)));

		this._register(this.notebookEditorService.onDidAddNotebookEditor(widget => {
			if (widget instanceof NotebookEditorWidget) {
				this.onDidAddNotebookEditorWidget(<NotebookEditorWidget>widget);
			}
		}));

		this._id = SEARCH_RESULT_PREFIX + Date.now().toString();
	}

	id(): string {
		return this._id;
	}

	get plainTextSearchResult(): IPlainTextSearchHeading {
		return this._plainTextSearchResult;
	}

	get aiTextSearchResult(): ITextSearchHeading {
		return this._aiTextSearchResult;
	}

	get children() {
		return this.textSearchResults;
	}

	get hasChildren(): boolean {
		return true; // should always have a Text Search Result for plain results.
	}
	get textSearchResults(): ITextSearchHeading[] {
		return [this._plainTextSearchResult, this._aiTextSearchResult];
	}

	async batchReplace(elementsToReplace: RenderableMatch[]) {
		try {
			this._onChange.pause();
			await Promise.all(elementsToReplace.map(async (elem) => {
				const parent = elem.parent();

				if ((isSearchTreeFolderMatch(parent) || isSearchTreeFileMatch(parent)) && arrayContainsElementOrParent(parent, elementsToReplace)) {
					// skip any children who have parents in the array
					return;
				}

				if (isSearchTreeFileMatch(elem)) {
					await elem.parent().replace(elem);
				} else if (isSearchTreeMatch(elem)) {
					await elem.parent().replace(elem);
				} else if (isSearchTreeFolderMatch(elem)) {
					await elem.replaceAll();
				}
			}));
		} finally {
			this._onChange.resume();
		}
	}

	batchRemove(elementsToRemove: RenderableMatch[]) {
		// need to check that we aren't trying to remove elements twice
		const removedElems: RenderableMatch[] = [];

		try {
			this._onChange.pause();
			elementsToRemove.forEach((currentElement) => {
				if (!arrayContainsElementOrParent(currentElement, removedElems)) {
					if (isTextSearchHeading(currentElement)) {
						currentElement.hide();
					} else if (!isSearchTreeFolderMatch(currentElement) || isSearchTreeFolderMatchWithResource(currentElement)) {
						if (isSearchTreeFileMatch(currentElement)) {
							currentElement.parent().remove(currentElement);
						} else if (isSearchTreeMatch(currentElement)) {
							currentElement.parent().remove(currentElement);
						} else if (isSearchTreeFolderMatchWithResource(currentElement)) {
							currentElement.parent().remove(currentElement);
						}
						removedElems.push(currentElement);
					}
				}
			}
			);
		} finally {
			this._onChange.resume();
		}
	}

	get isDirty(): boolean {
		return this._aiTextSearchResult.isDirty || this._plainTextSearchResult.isDirty;
	}

	get query(): ITextQuery | null {
		return this._plainTextSearchResult.query;
	}

	set query(query: ITextQuery | null) {
		this._plainTextSearchResult.query = query;
	}

	setAIQueryUsingTextQuery(query?: ITextQuery | null) {
		if (!query) {
			query = this.query;
		}
		this.aiTextSearchResult.query = aiTextQueryFromTextQuery(query);
	}

	private onDidAddNotebookEditorWidget(widget: NotebookEditorWidget): void {

		this._onWillChangeModelListener?.dispose();
		this._onWillChangeModelListener = widget.onWillChangeModel(
			(model) => {
				if (model) {
					this.onNotebookEditorWidgetRemoved(widget, model?.uri);
				}
			}
		);

		this._onDidChangeModelListener?.dispose();
		// listen to view model change as we are searching on both inputs and outputs
		this._onDidChangeModelListener = widget.onDidAttachViewModel(
			() => {
				if (widget.hasModel()) {
					this.onNotebookEditorWidgetAdded(widget, widget.textModel.uri);
				}
			}
		);
	}

	folderMatches(ai: boolean = false): ISearchTreeFolderMatch[] {
		if (ai) {
			return this._aiTextSearchResult.folderMatches();
		}
		return this._plainTextSearchResult.folderMatches();
	}

	private onModelAdded(model: ITextModel): void {
		const folderMatch = this._plainTextSearchResult.findFolderSubstr(model.uri);
		folderMatch?.bindModel(model);
	}

	private async onNotebookEditorWidgetAdded(editor: NotebookEditorWidget, resource: URI): Promise<void> {
		const folderMatch = this._plainTextSearchResult.findFolderSubstr(resource);
		await folderMatch?.bindNotebookEditorWidget(editor, resource);
	}

	private onNotebookEditorWidgetRemoved(editor: NotebookEditorWidget, resource: URI): void {
		const folderMatch = this._plainTextSearchResult.findFolderSubstr(resource);
		folderMatch?.unbindNotebookEditorWidget(editor, resource);
	}


	add(allRaw: IFileMatch[], searchInstanceID: string, ai: boolean, silent: boolean = false): void {
		this._plainTextSearchResult.hidden = false;

		if (ai) {
			this._aiTextSearchResult.add(allRaw, searchInstanceID, silent);
		} else {
			this._plainTextSearchResult.add(allRaw, searchInstanceID, silent);
		}
	}

	clear(): void {
		this._plainTextSearchResult.clear();
		this._aiTextSearchResult.clear();
	}

	remove(matches: ISearchTreeFileMatch | ISearchTreeFolderMatch | (ISearchTreeFileMatch | ISearchTreeFolderMatch)[], ai = false): void {
		if (ai) {
			this._aiTextSearchResult.remove(matches, ai);
		}
		this._plainTextSearchResult.remove(matches, ai);

	}

	replace(match: ISearchTreeFileMatch): Promise<any> {
		return this._plainTextSearchResult.replace(match);
	}

	matches(ai?: boolean): ISearchTreeFileMatch[] {
		if (ai === undefined) {
			return this._plainTextSearchResult.matches().concat(this._aiTextSearchResult.matches());
		} else if (ai === true) {
			return this._aiTextSearchResult.matches();
		}
		return this._plainTextSearchResult.matches();
	}

	isEmpty(): boolean {
		return this._plainTextSearchResult.isEmpty() && this._aiTextSearchResult.isEmpty();
	}

	fileCount(ignoreSemanticSearchResults: boolean = false): number {
		if (ignoreSemanticSearchResults) {
			return this._plainTextSearchResult.fileCount();
		}
		return this._plainTextSearchResult.fileCount() + this._aiTextSearchResult.fileCount();
	}

	count(ignoreSemanticSearchResults: boolean = false): number {
		if (ignoreSemanticSearchResults) {
			return this._plainTextSearchResult.count();
		}
		return this._plainTextSearchResult.count() + this._aiTextSearchResult.count();
	}

	setCachedSearchComplete(cachedSearchComplete: ISearchComplete | undefined, ai: boolean) {
		if (ai) {
			this._aiTextSearchResult.cachedSearchComplete = cachedSearchComplete;
		} else {
			this._plainTextSearchResult.cachedSearchComplete = cachedSearchComplete;
		}
	}

	getCachedSearchComplete(ai: boolean): ISearchComplete | undefined {
		if (ai) {
			return this._aiTextSearchResult.cachedSearchComplete;
		}
		return this._plainTextSearchResult.cachedSearchComplete;
	}

	toggleHighlights(value: boolean, ai: boolean = false): void {
		if (ai) {
			this._aiTextSearchResult.toggleHighlights(value);
		} else {
			this._plainTextSearchResult.toggleHighlights(value);
		}
	}

	getRangeHighlightDecorations(ai: boolean = false): RangeHighlightDecorations {
		if (ai) {
			return this._aiTextSearchResult.rangeHighlightDecorations;
		}
		return this._plainTextSearchResult.rangeHighlightDecorations;
	}

	replaceAll(progress: IProgress<IProgressStep>): Promise<any> {
		return this._plainTextSearchResult.replaceAll(progress);
	}

	override async dispose(): Promise<void> {
		this._aiTextSearchResult?.dispose();
		this._plainTextSearchResult?.dispose();
		this._onWillChangeModelListener?.dispose();
		this._onDidChangeModelListener?.dispose();
		super.dispose();
	}
}

function aiTextQueryFromTextQuery(query: ITextQuery | null): IAITextQuery | null {
	return query === null ? null : { ...query, contentPattern: query.contentPattern.pattern, type: QueryType.aiText };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/searchTreeModel/searchTreeCommon.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/searchTreeModel/searchTreeCommon.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Range } from '../../../../../editor/common/core/range.js';
import { IFileMatch, ISearchComplete, ISearchProgressItem, ISearchRange, ITextQuery, ITextSearchQuery, ITextSearchResult } from '../../../../services/search/common/search.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { URI } from '../../../../../base/common/uri.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { IFileStatWithPartialMetadata, IFileService } from '../../../../../platform/files/common/files.js';
import { IProgress, IProgressStep } from '../../../../../platform/progress/common/progress.js';
import { ReplacePattern } from '../../../../services/search/common/replace.js';
import { NotebookEditorWidget } from '../../../notebook/browser/notebookEditorWidget.js';
import { RangeHighlightDecorations } from './rangeDecorations.js';
import { Event } from '../../../../../base/common/event.js';

export type FileMatchOrMatch = ISearchTreeFileMatch | ISearchTreeMatch;

export type RenderableMatch = ITextSearchHeading | ISearchTreeFolderMatch | ISearchTreeFileMatch | ISearchTreeMatch;
export function arrayContainsElementOrParent(element: RenderableMatch, testArray: RenderableMatch[]): boolean {
	do {
		if (testArray.includes(element)) {
			return true;
		}
	} while (!isSearchResult(element.parent()) && (element = <RenderableMatch>element.parent()));

	return false;
}


export interface IChangeEvent {
	elements: ISearchTreeFileMatch[];
	added?: boolean;
	removed?: boolean;
	clearingAll?: boolean;
}
export enum SearchModelLocation {
	PANEL,
	QUICK_ACCESS
}


export const PLAIN_TEXT_SEARCH__RESULT_ID = 'plainTextSearch';
export const AI_TEXT_SEARCH_RESULT_ID = 'aiTextSearch';

export function createParentList(element: RenderableMatch): RenderableMatch[] {
	const parentArray: RenderableMatch[] = [];
	let currElement: RenderableMatch | ITextSearchHeading = element;

	while (!isTextSearchHeading(currElement)) {
		parentArray.push(currElement);
		currElement = currElement.parent();
	}

	return parentArray;
}

export const SEARCH_MODEL_PREFIX = 'SEARCH_MODEL_';
export const SEARCH_RESULT_PREFIX = 'SEARCH_RESULT_';
export const TEXT_SEARCH_HEADING_PREFIX = 'TEXT_SEARCH_HEADING_';
export const FOLDER_MATCH_PREFIX = 'FOLDER_MATCH_';
export const FILE_MATCH_PREFIX = 'FILE_MATCH_';
export const MATCH_PREFIX = 'MATCH_';

export function mergeSearchResultEvents(events: IChangeEvent[]): IChangeEvent {
	const retEvent: IChangeEvent = {
		elements: [],
		added: false,
		removed: false,
	};
	events.forEach((e) => {
		if (e.added) {
			retEvent.added = true;
		}

		if (e.removed) {
			retEvent.removed = true;
		}

		retEvent.elements = retEvent.elements.concat(e.elements);
	});

	return retEvent;
}

export interface ISearchModel {
	readonly onReplaceTermChanged: Event<void>;
	readonly onSearchResultChanged: Event<IChangeEvent>;
	location: SearchModelLocation;
	id(): string;

	getAITextResultProviderName(): Promise<string>;
	isReplaceActive(): boolean;
	replaceActive: boolean;
	replacePattern: ReplacePattern | null;
	replaceString: string;
	preserveCase: boolean;
	searchResult: ISearchResult;
	aiSearch(onResultReported: (result: ISearchProgressItem | undefined) => void): Promise<ISearchComplete>;
	hasAIResults: boolean;
	hasPlainResults: boolean;
	search(query: ITextQuery, onProgress?: (result: ISearchProgressItem) => void, callerToken?: CancellationToken): {
		asyncResults: Promise<ISearchComplete>;
		syncResults: IFileMatch<URI>[];
	};
	cancelSearch(cancelledForNewSearch?: boolean): boolean;
	cancelAISearch(cancelledForNewSearch?: boolean): boolean;
	clearAiSearchResults(): void;
	dispose(): void;
}


export interface ISearchResult {
	readonly onChange: Event<IChangeEvent>;
	readonly searchModel: ISearchModel;
	readonly plainTextSearchResult: IPlainTextSearchHeading;
	readonly aiTextSearchResult: ITextSearchHeading;
	readonly children: ITextSearchHeading[];
	readonly hasChildren: boolean;
	readonly isDirty: boolean;
	query: ITextQuery | null;

	batchReplace(elementsToReplace: RenderableMatch[]): Promise<void>;
	batchRemove(elementsToRemove: RenderableMatch[]): void;
	folderMatches(ai?: boolean): ISearchTreeFolderMatch[];
	add(allRaw: IFileMatch[], searchInstanceID: string, ai: boolean, silent?: boolean): void;
	clear(): void;
	remove(matches: ISearchTreeFileMatch | ISearchTreeFolderMatch | (ISearchTreeFileMatch | ISearchTreeFolderMatch)[], ai?: boolean): void;
	replace(match: ISearchTreeFileMatch): Promise<any>;
	matches(ai?: boolean): ISearchTreeFileMatch[];
	isEmpty(): boolean;
	fileCount(ignoreSemanticSearchResults?: boolean): number;
	count(ignoreSemanticSearchResults?: boolean): number;
	id(): string;
	setCachedSearchComplete(cachedSearchComplete: ISearchComplete | undefined, ai: boolean): void;
	getCachedSearchComplete(ai: boolean): ISearchComplete | undefined;
	toggleHighlights(value: boolean, ai?: boolean): void;
	getRangeHighlightDecorations(ai?: boolean): RangeHighlightDecorations;
	replaceAll(progress: IProgress<IProgressStep>): Promise<any>;
	setAIQueryUsingTextQuery(query?: ITextQuery | null): void;
	dispose(): void;
}

export interface ITextSearchHeading {
	readonly onChange: Event<IChangeEvent>;
	resource: URI | null;
	hidden: boolean;
	cachedSearchComplete: ISearchComplete | undefined;
	hide(): void;
	readonly isAIContributed: boolean;
	id(): string;
	parent(): ISearchResult;
	readonly hasChildren: boolean;
	name(): string;
	readonly isDirty: boolean;
	getFolderMatch(resource: URI): ISearchTreeFolderMatch | undefined;
	add(allRaw: IFileMatch[], searchInstanceID: string, ai: boolean, silent?: boolean): void;
	remove(matches: ISearchTreeFileMatch | ISearchTreeFolderMatch | (ISearchTreeFileMatch | ISearchTreeFolderMatch)[], ai?: boolean): void;
	groupFilesByFolder(fileMatches: ISearchTreeFileMatch[]): { byFolder: Map<URI, ISearchTreeFileMatch[]>; other: ISearchTreeFileMatch[] };
	isEmpty(): boolean;
	findFolderSubstr(resource: URI): ISearchTreeFolderMatch | undefined;
	query: ITextSearchQuery | null;
	folderMatches(): ISearchTreeFolderMatch[];
	matches(): ISearchTreeFileMatch[];
	showHighlights: boolean;
	toggleHighlights(value: boolean): void;
	rangeHighlightDecorations: RangeHighlightDecorations;
	fileCount(): number;
	count(): number;
	clear(clearAll: boolean): void;
	dispose(): void;
}

export interface IPlainTextSearchHeading extends ITextSearchHeading {
	replace(match: ISearchTreeFileMatch): Promise<any>;
	replaceAll(progress: IProgress<IProgressStep>): Promise<any>;
}

export interface ISearchTreeFolderMatch {
	readonly onChange: Event<IChangeEvent>;
	readonly onDispose: Event<void>;
	id(): string;
	resource: URI | null;
	index(): number;
	name(): string;
	count(): number;
	hasChildren: boolean;
	parent(): ISearchTreeFolderMatch | ITextSearchHeading;
	matches(): (ISearchTreeFileMatch | ISearchTreeFolderMatchWithResource)[];
	allDownstreamFileMatches(): ISearchTreeFileMatch[];
	remove(matches: ISearchTreeFileMatch | ISearchTreeFolderMatchWithResource | (ISearchTreeFileMatch | ISearchTreeFolderMatchWithResource)[]): void;
	addFileMatch(raw: IFileMatch[], silent: boolean, searchInstanceID: string): void;
	isEmpty(): boolean;
	clear(clearingAll?: boolean): void;
	showHighlights: boolean;
	searchModel: ISearchModel;
	query: ITextSearchQuery | null;
	replace(match: ISearchTreeFileMatch): Promise<any>;
	replacingAll: boolean;
	bindModel(model: ITextModel): void;
	getDownstreamFileMatch(uri: URI): ISearchTreeFileMatch | null;
	replaceAll(): Promise<any>;
	recursiveFileCount(): number;
	doRemoveFile(fileMatches: ISearchTreeFileMatch[], dispose?: boolean, trigger?: boolean, keepReadonly?: boolean): void;
	unbindNotebookEditorWidget(editor: NotebookEditorWidget, resource: URI): void;
	bindNotebookEditorWidget(editor: NotebookEditorWidget, resource: URI): Promise<void>;
	unbindNotebookEditorWidget(editor: NotebookEditorWidget, resource: URI): void;
	hasOnlyReadOnlyMatches(): boolean;
	fileMatchesIterator(): IterableIterator<ISearchTreeFileMatch>;
	folderMatchesIterator(): IterableIterator<ISearchTreeFolderMatchWithResource>;
	recursiveFileCount(): number;
	recursiveMatchCount(): number;
	dispose(): void;
	isAIContributed(): boolean;
}

export interface ISearchTreeFolderMatchWithResource extends ISearchTreeFolderMatch {
	resource: URI;
}

export interface ISearchTreeFolderMatchWorkspaceRoot extends ISearchTreeFolderMatchWithResource {
	createAndConfigureFileMatch(rawFileMatch: IFileMatch<URI>, searchInstanceID: string): ISearchTreeFileMatch;
}

export interface ISearchTreeFolderMatchNoRoot extends ISearchTreeFolderMatch {
	createAndConfigureFileMatch(rawFileMatch: IFileMatch<URI>, searchInstanceID: string): ISearchTreeFileMatch;
}

export interface ISearchTreeFileMatch {
	id(): string;
	resource: URI;
	onChange: Event<{
		didRemove?: boolean;
		forceUpdateModel?: boolean;
	}>;
	hasChildren: boolean;
	readonly onDispose: Event<void>;
	name(): string;
	count(): number;
	hasOnlyReadOnlyMatches(): boolean;
	matches(): ISearchTreeMatch[];
	updateHighlights(): void;
	getSelectedMatch(): ISearchTreeMatch | null;
	parent(): ISearchTreeFolderMatch;
	bindModel(model: ITextModel): void;
	hasReadonlyMatches(): boolean;
	addContext(results: ITextSearchResult[] | undefined): void;
	add(match: ISearchTreeMatch, trigger?: boolean): void;
	replace(toReplace: ISearchTreeMatch): Promise<void>;
	remove(matches: ISearchTreeMatch | (ISearchTreeMatch[])): void;
	setSelectedMatch(match: ISearchTreeMatch | null): void;
	fileStat: IFileStatWithPartialMetadata | undefined;
	resolveFileStat(fileService: IFileService): Promise<void>;
	textMatches(): ISearchTreeMatch[];
	readonly context: Map<number, string>;
	readonly closestRoot: ISearchTreeFolderMatchWorkspaceRoot | null;
	isMatchSelected(match: ISearchTreeMatch): boolean;
	dispose(): void;
}

export interface ISearchTreeMatch {
	id(): string;
	parent(): ISearchTreeFileMatch;
	text(): string;
	range(): Range;
	preview(): { before: string; fullBefore: string; inside: string; after: string };
	replaceString: string;
	fullMatchText(includeSurrounding?: boolean): string;
	rangeInPreview(): ISearchRange;
	fullPreviewLines(): string[];
	getMatchString(): string;
	isReadonly: boolean;
}

export function isSearchModel(obj: any): obj is ISearchModel {
	return typeof obj === 'object' &&
		obj !== null &&
		typeof obj.id === 'function' &&
		obj.id().startsWith(SEARCH_MODEL_PREFIX);
}

export function isSearchResult(obj: any): obj is ISearchResult {
	return typeof obj === 'object' &&
		obj !== null &&
		typeof obj.id === 'function' &&
		obj.id().startsWith(SEARCH_RESULT_PREFIX);
}

export function isTextSearchHeading(obj: any): obj is ITextSearchHeading {
	return typeof obj === 'object' &&
		obj !== null &&
		typeof obj.id === 'function' &&
		obj.id().startsWith(TEXT_SEARCH_HEADING_PREFIX);
}

export function isPlainTextSearchHeading(obj: any): obj is IPlainTextSearchHeading {
	return isTextSearchHeading(obj) &&
		// eslint-disable-next-line local/code-no-any-casts
		typeof (<any>obj).replace === 'function' &&
		// eslint-disable-next-line local/code-no-any-casts
		typeof (<any>obj).replaceAll === 'function';
}

export function isSearchTreeFolderMatch(obj: any): obj is ISearchTreeFolderMatch {
	return typeof obj === 'object' &&
		obj !== null &&
		typeof obj.id === 'function' &&
		obj.id().startsWith(FOLDER_MATCH_PREFIX);
}

export function isSearchTreeFolderMatchWithResource(obj: any): obj is ISearchTreeFolderMatchWithResource {
	return isSearchTreeFolderMatch(obj) && obj.resource instanceof URI;
}

export function isSearchTreeFolderMatchWorkspaceRoot(obj: any): obj is ISearchTreeFolderMatchWorkspaceRoot {
	return isSearchTreeFolderMatchWithResource(obj) &&
		// eslint-disable-next-line local/code-no-any-casts
		typeof (<any>obj).createAndConfigureFileMatch === 'function';
}

export function isSearchTreeFolderMatchNoRoot(obj: any): obj is ISearchTreeFolderMatchNoRoot {
	return isSearchTreeFolderMatch(obj) &&
		// eslint-disable-next-line local/code-no-any-casts
		typeof (<any>obj).createAndConfigureFileMatch === 'function';
}

export function isSearchTreeFileMatch(obj: any): obj is ISearchTreeFileMatch {
	return typeof obj === 'object' &&
		obj !== null &&
		typeof obj.id === 'function' &&
		obj.id().startsWith(FILE_MATCH_PREFIX);
}

export function isSearchTreeMatch(obj: any): obj is ISearchTreeMatch {
	return typeof obj === 'object' &&
		obj !== null &&
		typeof obj.id === 'function' &&
		obj.id().startsWith(MATCH_PREFIX);
}

export function isSearchHeader(obj: any): boolean {
	return typeof obj === 'object' &&
		obj !== null &&
		typeof obj.id === 'function' &&
		obj.id().startsWith(TEXT_SEARCH_HEADING_PREFIX);
}

export function getFileMatches(matches: (ISearchTreeFileMatch | ISearchTreeFolderMatchWithResource)[]): ISearchTreeFileMatch[] {

	const folderMatches: ISearchTreeFolderMatchWithResource[] = [];
	const fileMatches: ISearchTreeFileMatch[] = [];
	matches.forEach((e) => {
		if (isSearchTreeFileMatch(e)) {
			fileMatches.push(e);
		} else {
			folderMatches.push(e);
		}
	});

	return fileMatches.concat(folderMatches.map(e => e.allDownstreamFileMatches()).flat());
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/searchTreeModel/searchViewModelWorkbenchService.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/searchTreeModel/searchViewModelWorkbenchService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../../platform/instantiation/common/instantiation.js';
import { ISearchModel } from './searchTreeCommon.js';

export const ISearchViewModelWorkbenchService = createDecorator<ISearchViewModelWorkbenchService>('searchViewModelWorkbenchService');

export interface ISearchViewModelWorkbenchService {
	readonly _serviceBrand: undefined;

	searchModel: ISearchModel;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/searchTreeModel/textSearchHeading.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/searchTreeModel/textSearchHeading.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../../base/common/map.js';
import { TernarySearchTree } from '../../../../../base/common/ternarySearchTree.js';
import { URI } from '../../../../../base/common/uri.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IProgress, IProgressStep } from '../../../../../platform/progress/common/progress.js';
import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { IReplaceService } from '../replace.js';
import { IFileMatch, ISearchComplete, ITextQuery, ITextSearchQuery } from '../../../../services/search/common/search.js';
import { RangeHighlightDecorations } from './rangeDecorations.js';
import { FolderMatchNoRootImpl, FolderMatchWorkspaceRootImpl } from './folderMatch.js';
import { IChangeEvent, ISearchTreeFileMatch, ISearchTreeFolderMatch, ISearchTreeFolderMatchWithResource, ISearchTreeFolderMatchWorkspaceRoot, IPlainTextSearchHeading, ISearchResult, isSearchTreeFileMatch, isSearchTreeFolderMatch, ITextSearchHeading, ISearchTreeMatch, TEXT_SEARCH_HEADING_PREFIX, PLAIN_TEXT_SEARCH__RESULT_ID, ISearchTreeFolderMatchNoRoot } from './searchTreeCommon.js';
import { isNotebookFileMatch } from '../notebookSearch/notebookSearchModelBase.js';


export abstract class TextSearchHeadingImpl<QueryType extends ITextSearchQuery> extends Disposable implements ITextSearchHeading {
	protected _onChange = this._register(new Emitter<IChangeEvent>());
	readonly onChange: Event<IChangeEvent> = this._onChange.event;
	private _isDirty = false;
	private _showHighlights: boolean = false;

	protected _query: QueryType | null = null;
	private _rangeHighlightDecorations: RangeHighlightDecorations;
	private disposePastResults: () => Promise<void> = () => Promise.resolve();

	protected _folderMatches: ISearchTreeFolderMatchWorkspaceRoot[] = [];
	protected _otherFilesMatch: ISearchTreeFolderMatch | null = null;
	protected _folderMatchesMap: TernarySearchTree<URI, ISearchTreeFolderMatchWithResource> = TernarySearchTree.forUris<ISearchTreeFolderMatchWorkspaceRoot>(key => this.uriIdentityService.extUri.ignorePathCasing(key));
	public resource = null;
	public hidden = false;

	public cachedSearchComplete: ISearchComplete | undefined;
	constructor(
		private _allowOtherResults: boolean,
		private _parent: ISearchResult,
		@IInstantiationService protected readonly instantiationService: IInstantiationService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService
	) {
		super();
		this._rangeHighlightDecorations = this.instantiationService.createInstance(RangeHighlightDecorations);

		this._register(this.onChange(e => {
			if (e.removed) {
				this._isDirty = !this.isEmpty();
			}
		}));
	}

	hide() {
		this.hidden = true;
		this.clear();
	}

	parent() {
		return this._parent;
	}

	get hasChildren(): boolean {
		return this._folderMatches.length > 0;
	}

	abstract get isAIContributed(): boolean;
	abstract id(): string;
	abstract name(): string;

	get isDirty(): boolean {
		return this._isDirty;
	}

	public getFolderMatch(resource: URI): ISearchTreeFolderMatch | undefined {
		const folderMatch = this._folderMatchesMap.findSubstr(resource);

		if (!folderMatch && this._allowOtherResults && this._otherFilesMatch) {
			return this._otherFilesMatch;
		}
		return folderMatch;
	}

	add(allRaw: IFileMatch[], searchInstanceID: string, silent: boolean = false): void {
		// Split up raw into a list per folder so we can do a batch add per folder.

		const { byFolder, other } = this.groupFilesByFolder(allRaw);
		byFolder.forEach(raw => {
			if (!raw.length) {
				return;
			}

			// ai results go into the respective folder
			const folderMatch = this.getFolderMatch(raw[0].resource);
			folderMatch?.addFileMatch(raw, silent, searchInstanceID);
		});

		if (!this.isAIContributed) {
			this._otherFilesMatch?.addFileMatch(other, silent, searchInstanceID);
		}
		this.disposePastResults();
	}

	remove(matches: ISearchTreeFileMatch | ISearchTreeFolderMatch | (ISearchTreeFileMatch | ISearchTreeFolderMatch)[], ai = false): void {
		if (!Array.isArray(matches)) {
			matches = [matches];
		}

		matches.forEach(m => {
			if (isSearchTreeFolderMatch(m)) {
				m.clear();
			}
		});

		const fileMatches: ISearchTreeFileMatch[] = matches.filter(m => isSearchTreeFileMatch(m)) as ISearchTreeFileMatch[];

		const { byFolder, other } = this.groupFilesByFolder(fileMatches);
		byFolder.forEach(matches => {
			if (!matches.length) {
				return;
			}

			this.getFolderMatch(matches[0].resource)?.remove(matches);
		});

		if (other.length) {
			this.getFolderMatch(other[0].resource)?.remove(<ISearchTreeFileMatch[]>other);
		}
	}

	groupFilesByFolder<FileMatch extends IFileMatch>(fileMatches: FileMatch[]): { byFolder: ResourceMap<FileMatch[]>; other: FileMatch[] } {
		const rawPerFolder = new ResourceMap<FileMatch[]>();
		const otherFileMatches: FileMatch[] = [];
		this._folderMatches.forEach(fm => rawPerFolder.set(fm.resource, []));

		fileMatches.forEach(rawFileMatch => {
			const folderMatch = this.getFolderMatch(rawFileMatch.resource);
			if (!folderMatch) {
				// foldermatch was previously removed by user or disposed for some reason
				return;
			}

			const resource = folderMatch.resource;
			if (resource) {
				rawPerFolder.get(resource)!.push(rawFileMatch);
			} else {
				otherFileMatches.push(rawFileMatch);
			}
		});

		return {
			byFolder: rawPerFolder,
			other: otherFileMatches
		};
	}
	isEmpty(): boolean {
		return this.folderMatches().every((folderMatch) => folderMatch.isEmpty());
	}

	findFolderSubstr(resource: URI) {
		return this._folderMatchesMap.findSubstr(resource);
	}

	abstract query: QueryType | null;

	protected clearQuery(): void {
		// When updating the query we could change the roots, so keep a reference to them to clean up when we trigger `disposePastResults`
		const oldFolderMatches = this.folderMatches();
		this.disposePastResults = async () => {
			oldFolderMatches.forEach(match => match.clear());
			oldFolderMatches.forEach(match => match.dispose());
			this._isDirty = false;
		};

		this.cachedSearchComplete = undefined;

		this._rangeHighlightDecorations.removeHighlightRange();
		this._folderMatchesMap = TernarySearchTree.forUris<ISearchTreeFolderMatchWithResource>(key => this.uriIdentityService.extUri.ignorePathCasing(key));
	}

	folderMatches(): ISearchTreeFolderMatch[] {
		return this._otherFilesMatch && this._allowOtherResults ?
			[
				...this._folderMatches,
				this._otherFilesMatch,
			] :
			this._folderMatches;
	}

	private disposeMatches(): void {
		this.folderMatches().forEach(folderMatch => folderMatch.dispose());

		this._folderMatches = [];

		this._folderMatchesMap = TernarySearchTree.forUris<ISearchTreeFolderMatchWithResource>(key => this.uriIdentityService.extUri.ignorePathCasing(key));

		this._rangeHighlightDecorations.removeHighlightRange();
	}

	matches(): ISearchTreeFileMatch[] {
		const matches: ISearchTreeFileMatch[][] = [];
		this.folderMatches().forEach(folderMatch => {
			matches.push(folderMatch.allDownstreamFileMatches());
		});

		return (<ISearchTreeFileMatch[]>[]).concat(...matches);
	}

	get showHighlights(): boolean {
		return this._showHighlights;
	}

	toggleHighlights(value: boolean): void {
		if (this._showHighlights === value) {
			return;
		}
		this._showHighlights = value;
		let selectedMatch: ISearchTreeMatch | null = null;
		this.matches().forEach((fileMatch: ISearchTreeFileMatch) => {
			fileMatch.updateHighlights();
			if (isNotebookFileMatch(fileMatch)) {
				fileMatch.updateNotebookHighlights();
			}
			if (!selectedMatch) {
				selectedMatch = fileMatch.getSelectedMatch();
			}
		});
		if (this._showHighlights && selectedMatch) {
			// TS?
			this._rangeHighlightDecorations.highlightRange(
				(<ISearchTreeMatch>selectedMatch).parent().resource,
				(<ISearchTreeMatch>selectedMatch).range()
			);
		} else {
			this._rangeHighlightDecorations.removeHighlightRange();
		}
	}

	get rangeHighlightDecorations(): RangeHighlightDecorations {
		return this._rangeHighlightDecorations;
	}

	fileCount(): number {
		return this.folderMatches().reduce<number>((prev, match) => prev + match.recursiveFileCount(), 0);
	}

	count(): number {
		return this.matches().reduce<number>((prev, match) => prev + match.count(), 0);
	}

	clear(clearAll: boolean = true): void {
		this.cachedSearchComplete = undefined;
		this.folderMatches().forEach((folderMatch) => folderMatch.clear(clearAll));
		this.disposeMatches();
		this._folderMatches = [];
		this._otherFilesMatch = null;
	}

	override async dispose(): Promise<void> {
		this._rangeHighlightDecorations.dispose();
		this.disposeMatches();
		super.dispose();
		await this.disposePastResults();
	}
}

export class PlainTextSearchHeadingImpl extends TextSearchHeadingImpl<ITextQuery> implements IPlainTextSearchHeading {
	constructor(
		parent: ISearchResult,
		@IInstantiationService instantiationService: IInstantiationService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IReplaceService private readonly replaceService: IReplaceService,
	) {
		super(true, parent, instantiationService, uriIdentityService);
	}

	id(): string {
		return TEXT_SEARCH_HEADING_PREFIX + PLAIN_TEXT_SEARCH__RESULT_ID;
	}

	get isAIContributed(): boolean {
		return false;
	}

	replace(match: ISearchTreeFileMatch): Promise<any> {
		return this.getFolderMatch(match.resource)?.replace(match) ?? Promise.resolve();
	}

	override name(): string {
		return 'Text';
	}

	replaceAll(progress: IProgress<IProgressStep>): Promise<any> {
		this.replacingAll = true;

		const promise = this.replaceService.replace(this.matches(), progress);

		return promise.then(() => {
			this.replacingAll = false;
			this.clear();
		}, () => {
			this.replacingAll = false;
		});
	}

	private set replacingAll(running: boolean) {
		this.folderMatches().forEach((folderMatch) => {
			folderMatch.replacingAll = running;
		});
	}

	override get query(): ITextQuery | null {
		return this._query;
	}

	override set query(query: ITextQuery | null) {
		this.clearQuery();

		if (!query) {
			return;
		}

		this._folderMatches = (query && query.folderQueries || [])
			.map(fq => fq.folder)
			.map((resource, index) => <ISearchTreeFolderMatchWorkspaceRoot>this._createBaseFolderMatch(resource, resource.toString(), index, query));

		this._folderMatches.forEach(fm => this._folderMatchesMap.set(fm.resource, fm));

		this._otherFilesMatch = this._createBaseFolderMatch(null, 'otherFiles', this._folderMatches.length + 1, query);

		this._query = query;
	}

	private _createBaseFolderMatch(resource: URI | null, id: string, index: number, query: ITextQuery): ISearchTreeFolderMatch {
		let folderMatch: ISearchTreeFolderMatch;
		if (resource) {
			folderMatch = this._register(this.createWorkspaceRootWithResourceImpl(resource, id, index, query));
		} else {
			folderMatch = this._register(this.createNoRootWorkspaceImpl(id, index, query));
		}
		const disposable = folderMatch.onChange((event) => this._onChange.fire(event));
		this._register(folderMatch.onDispose(() => disposable.dispose()));
		return folderMatch;
	}

	private createWorkspaceRootWithResourceImpl(resource: URI, id: string, index: number, query: ITextQuery,): ISearchTreeFolderMatchWorkspaceRoot {
		return this.instantiationService.createInstance(FolderMatchWorkspaceRootImpl, resource, id, index, query, this);
	}

	private createNoRootWorkspaceImpl(id: string, index: number, query: ITextQuery): ISearchTreeFolderMatchNoRoot {
		return this._register(this.instantiationService.createInstance(FolderMatchNoRootImpl, id, index, query, this));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/common/cacheState.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/common/cacheState.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { defaultGenerator } from '../../../../base/common/idGenerator.js';
import { IFileQuery } from '../../../services/search/common/search.js';
import { equals } from '../../../../base/common/objects.js';

enum LoadingPhase {
	Created = 1,
	Loading = 2,
	Loaded = 3,
	Errored = 4,
	Disposed = 5
}

export class FileQueryCacheState {

	private readonly _cacheKey;
	get cacheKey(): string {
		if (this.loadingPhase === LoadingPhase.Loaded || !this.previousCacheState) {
			return this._cacheKey;
		}

		return this.previousCacheState.cacheKey;
	}

	get isLoaded(): boolean {
		const isLoaded = this.loadingPhase === LoadingPhase.Loaded;

		return isLoaded || !this.previousCacheState ? isLoaded : this.previousCacheState.isLoaded;
	}

	get isUpdating(): boolean {
		const isUpdating = this.loadingPhase === LoadingPhase.Loading;

		return isUpdating || !this.previousCacheState ? isUpdating : this.previousCacheState.isUpdating;
	}

	private readonly query;

	private loadingPhase;
	private loadPromise: Promise<void> | undefined;

	constructor(
		private cacheQuery: (cacheKey: string) => IFileQuery,
		private loadFn: (query: IFileQuery) => Promise<unknown>,
		private disposeFn: (cacheKey: string) => Promise<void>,
		private previousCacheState: FileQueryCacheState | undefined
	) {
		this._cacheKey = defaultGenerator.nextId();
		this.query = this.cacheQuery(this._cacheKey);
		this.loadingPhase = LoadingPhase.Created;
		if (this.previousCacheState) {
			const current = Object.assign({}, this.query, { cacheKey: null });
			const previous = Object.assign({}, this.previousCacheState.query, { cacheKey: null });
			if (!equals(current, previous)) {
				this.previousCacheState.dispose();
				this.previousCacheState = undefined;
			}
		}
	}

	load(): FileQueryCacheState {
		if (this.isUpdating) {
			return this;
		}

		this.loadingPhase = LoadingPhase.Loading;

		this.loadPromise = (async () => {
			try {
				await this.loadFn(this.query);

				this.loadingPhase = LoadingPhase.Loaded;

				if (this.previousCacheState) {
					this.previousCacheState.dispose();
					this.previousCacheState = undefined;
				}
			} catch (error) {
				this.loadingPhase = LoadingPhase.Errored;

				throw error;
			}
		})();

		return this;
	}

	dispose(): void {
		if (this.loadPromise) {
			(async () => {
				try {
					await this.loadPromise;
				} catch (error) {
					// ignore
				}

				this.loadingPhase = LoadingPhase.Disposed;
				this.disposeFn(this._cacheKey);
			})();
		} else {
			this.loadingPhase = LoadingPhase.Disposed;
		}

		if (this.previousCacheState) {
			this.previousCacheState.dispose();
			this.previousCacheState = undefined;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/common/cellSearchModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/common/cellSearchModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { Range } from '../../../../editor/common/core/range.js';
import { DefaultEndOfLine, FindMatch, IReadonlyTextBuffer } from '../../../../editor/common/model.js';
import { PieceTreeTextBufferBuilder } from '../../../../editor/common/model/pieceTreeTextBuffer/pieceTreeTextBufferBuilder.js';
import { SearchParams } from '../../../../editor/common/model/textModelSearch.js';

interface RawOutputFindMatch {
	textBuffer: IReadonlyTextBuffer;
	matches: FindMatch[];
}

export class CellSearchModel extends Disposable {
	private _outputTextBuffers: IReadonlyTextBuffer[] | undefined = undefined;
	constructor(readonly _source: string, private _inputTextBuffer: IReadonlyTextBuffer | undefined, private _outputs: string[]) {
		super();
	}

	private _getFullModelRange(buffer: IReadonlyTextBuffer): Range {
		const lineCount = buffer.getLineCount();
		return new Range(1, 1, lineCount, this._getLineMaxColumn(buffer, lineCount));
	}

	private _getLineMaxColumn(buffer: IReadonlyTextBuffer, lineNumber: number): number {
		if (lineNumber < 1 || lineNumber > buffer.getLineCount()) {
			throw new Error('Illegal value for lineNumber');
		}
		return buffer.getLineLength(lineNumber) + 1;
	}

	get inputTextBuffer(): IReadonlyTextBuffer {
		if (!this._inputTextBuffer) {
			const builder = new PieceTreeTextBufferBuilder();
			builder.acceptChunk(this._source);
			const bufferFactory = builder.finish(true);
			const { textBuffer, disposable } = bufferFactory.create(DefaultEndOfLine.LF);
			this._inputTextBuffer = textBuffer;
			this._register(disposable);
		}

		return this._inputTextBuffer;
	}

	get outputTextBuffers(): IReadonlyTextBuffer[] {
		if (!this._outputTextBuffers) {
			this._outputTextBuffers = this._outputs.map((output) => {
				const builder = new PieceTreeTextBufferBuilder();
				builder.acceptChunk(output);
				const bufferFactory = builder.finish(true);
				const { textBuffer, disposable } = bufferFactory.create(DefaultEndOfLine.LF);
				this._register(disposable);
				return textBuffer;
			});
		}
		return this._outputTextBuffers;
	}

	findInInputs(target: string): FindMatch[] {
		const searchParams = new SearchParams(target, false, false, null);
		const searchData = searchParams.parseSearchRequest();
		if (!searchData) {
			return [];
		}
		const fullInputRange = this._getFullModelRange(this.inputTextBuffer);
		return this.inputTextBuffer.findMatchesLineByLine(fullInputRange, searchData, true, 5000);
	}

	findInOutputs(target: string): RawOutputFindMatch[] {
		const searchParams = new SearchParams(target, false, false, null);
		const searchData = searchParams.parseSearchRequest();
		if (!searchData) {
			return [];
		}
		return this.outputTextBuffers.map(buffer => {
			const matches = buffer.findMatchesLineByLine(
				this._getFullModelRange(buffer),
				searchData,
				true,
				5000
			);
			if (matches.length === 0) {
				return undefined;
			}
			return {
				textBuffer: buffer,
				matches
			};
		}).filter((item): item is RawOutputFindMatch => !!item);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/common/constants.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/common/constants.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';

export const enum SearchCommandIds {
	FindInFilesActionId = 'workbench.action.findInFiles',
	FocusActiveEditorCommandId = 'search.action.focusActiveEditor',
	FocusSearchFromResults = 'search.action.focusSearchFromResults',
	OpenMatch = 'search.action.openResult',
	OpenMatchToSide = 'search.action.openResultToSide',
	RemoveActionId = 'search.action.remove',
	CopyPathCommandId = 'search.action.copyPath',
	CopyMatchCommandId = 'search.action.copyMatch',
	CopyAllCommandId = 'search.action.copyAll',
	OpenInEditorCommandId = 'search.action.openInEditor',
	ClearSearchHistoryCommandId = 'search.action.clearHistory',
	FocusSearchListCommandID = 'search.action.focusSearchList',
	ReplaceActionId = 'search.action.replace',
	ReplaceAllInFileActionId = 'search.action.replaceAllInFile',
	ReplaceAllInFolderActionId = 'search.action.replaceAllInFolder',
	CloseReplaceWidgetActionId = 'closeReplaceInFilesWidget',
	ToggleCaseSensitiveCommandId = 'toggleSearchCaseSensitive',
	ToggleWholeWordCommandId = 'toggleSearchWholeWord',
	ToggleRegexCommandId = 'toggleSearchRegex',
	TogglePreserveCaseId = 'toggleSearchPreserveCase',
	AddCursorsAtSearchResults = 'addCursorsAtSearchResults',
	RevealInSideBarForSearchResults = 'search.action.revealInSideBar',
	ReplaceInFilesActionId = 'workbench.action.replaceInFiles',
	ShowAllSymbolsActionId = 'workbench.action.showAllSymbols',
	QuickTextSearchActionId = 'workbench.action.quickTextSearch',
	CancelSearchActionId = 'search.action.cancel',
	RefreshSearchResultsActionId = 'search.action.refreshSearchResults',
	FocusNextSearchResultActionId = 'search.action.focusNextSearchResult',
	FocusPreviousSearchResultActionId = 'search.action.focusPreviousSearchResult',
	ToggleSearchOnTypeActionId = 'workbench.action.toggleSearchOnType',
	CollapseSearchResultsActionId = 'search.action.collapseSearchResults',
	ExpandSearchResultsActionId = 'search.action.expandSearchResults',
	ExpandRecursivelyCommandId = 'search.action.expandRecursively',
	ClearSearchResultsActionId = 'search.action.clearSearchResults',
	GetSearchResultsActionId = 'search.action.getSearchResults',
	ViewAsTreeActionId = 'search.action.viewAsTree',
	ViewAsListActionId = 'search.action.viewAsList',
	ShowAIResultsActionId = 'search.action.showAIResults',
	HideAIResultsActionId = 'search.action.hideAIResults',
	SearchWithAIActionId = 'search.action.searchWithAI',
	ToggleQueryDetailsActionId = 'workbench.action.search.toggleQueryDetails',
	ExcludeFolderFromSearchId = 'search.action.excludeFromSearch',
	ExcludeFileTypeFromSearchId = 'search.action.excludeFileTypeFromSearch',
	IncludeFileTypeInSearchId = 'search.action.includeFileTypeInSearch',
	FocusNextInputActionId = 'search.focus.nextInputBox',
	FocusPreviousInputActionId = 'search.focus.previousInputBox',
	RestrictSearchToFolderId = 'search.action.restrictSearchToFolder',
	FindInFolderId = 'filesExplorer.findInFolder',
	FindInWorkspaceId = 'filesExplorer.findInWorkspace',
}

export const SearchContext = {
	SearchViewVisibleKey: new RawContextKey<boolean>('searchViewletVisible', true),
	SearchViewFocusedKey: new RawContextKey<boolean>('searchViewletFocus', false),
	SearchResultListFocusedKey: new RawContextKey<boolean>('searchResultListFocused', true),
	InputBoxFocusedKey: new RawContextKey<boolean>('inputBoxFocus', false),
	SearchInputBoxFocusedKey: new RawContextKey<boolean>('searchInputBoxFocus', false),
	ReplaceInputBoxFocusedKey: new RawContextKey<boolean>('replaceInputBoxFocus', false),
	PatternIncludesFocusedKey: new RawContextKey<boolean>('patternIncludesInputBoxFocus', false),
	PatternExcludesFocusedKey: new RawContextKey<boolean>('patternExcludesInputBoxFocus', false),
	ReplaceActiveKey: new RawContextKey<boolean>('replaceActive', false),
	HasSearchResults: new RawContextKey<boolean>('hasSearchResult', false),
	FirstMatchFocusKey: new RawContextKey<boolean>('firstMatchFocus', false),
	FileMatchOrMatchFocusKey: new RawContextKey<boolean>('fileMatchOrMatchFocus', false), // This is actually, Match or File or Folder
	FileMatchOrFolderMatchFocusKey: new RawContextKey<boolean>('fileMatchOrFolderMatchFocus', false),
	FileMatchOrFolderMatchWithResourceFocusKey: new RawContextKey<boolean>('fileMatchOrFolderMatchWithResourceFocus', false), // Excludes "Other files"
	FileFocusKey: new RawContextKey<boolean>('fileMatchFocus', false),
	FolderFocusKey: new RawContextKey<boolean>('folderMatchFocus', false),
	ResourceFolderFocusKey: new RawContextKey<boolean>('folderMatchWithResourceFocus', false),
	IsEditableItemKey: new RawContextKey<boolean>('isEditableItem', true),
	MatchFocusKey: new RawContextKey<boolean>('matchFocus', false),
	SearchResultHeaderFocused: new RawContextKey<boolean>('searchResultHeaderFocused', false),
	ViewHasSearchPatternKey: new RawContextKey<boolean>('viewHasSearchPattern', false),
	ViewHasReplacePatternKey: new RawContextKey<boolean>('viewHasReplacePattern', false),
	ViewHasFilePatternKey: new RawContextKey<boolean>('viewHasFilePattern', false),
	ViewHasSomeCollapsibleKey: new RawContextKey<boolean>('viewHasSomeCollapsibleResult', false),
	InTreeViewKey: new RawContextKey<boolean>('inTreeView', false),
	hasAIResultProvider: new RawContextKey<boolean>('hasAIResultProviderKey', false),
	AIResultsTitle: new RawContextKey<boolean>('aiResultsTitle', false),
	AIResultsRequested: new RawContextKey<boolean>('aiResultsRequested', false),
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/common/notebookSearch.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/common/notebookSearch.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { ResourceSet } from '../../../../base/common/map.js';
import { ITextQuery, ISearchProgressItem, ISearchComplete } from '../../../services/search/common/search.js';

export const INotebookSearchService = createDecorator<INotebookSearchService>('notebookSearchService');

export interface INotebookSearchService {

	readonly _serviceBrand: undefined;

	notebookSearch(query: ITextQuery, token: CancellationToken | undefined, searchInstanceID: string, onProgress?: (result: ISearchProgressItem) => void): {
		openFilesToScan: ResourceSet;
		completeData: Promise<ISearchComplete>;
		allScannedFiles: Promise<ResourceSet>;
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/common/search.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/common/search.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { ISearchConfiguration, ISearchConfigurationProperties } from '../../../services/search/common/search.js';
import { SymbolKind, Location, ProviderResult, SymbolTag } from '../../../../editor/common/languages.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { URI } from '../../../../base/common/uri.js';
import { EditorResourceAccessor, SideBySideEditor } from '../../../common/editor.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IRange, Range } from '../../../../editor/common/core/range.js';
import { isNumber } from '../../../../base/common/types.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { compare } from '../../../../base/common/strings.js';
import { groupBy } from '../../../../base/common/arrays.js';

export interface IWorkspaceSymbol {
	name: string;
	containerName?: string;
	kind: SymbolKind;
	tags?: SymbolTag[];
	location: Location;
}

export interface IWorkspaceSymbolProvider {
	provideWorkspaceSymbols(search: string, token: CancellationToken): ProviderResult<IWorkspaceSymbol[]>;
	resolveWorkspaceSymbol?(item: IWorkspaceSymbol, token: CancellationToken): ProviderResult<IWorkspaceSymbol>;
}

export namespace WorkspaceSymbolProviderRegistry {

	const _supports: IWorkspaceSymbolProvider[] = [];

	export function register(provider: IWorkspaceSymbolProvider): IDisposable {
		let support: IWorkspaceSymbolProvider | undefined = provider;
		if (support) {
			_supports.push(support);
		}

		return {
			dispose() {
				if (support) {
					const idx = _supports.indexOf(support);
					if (idx >= 0) {
						_supports.splice(idx, 1);
						support = undefined;
					}
				}
			}
		};
	}

	export function all(): IWorkspaceSymbolProvider[] {
		return _supports.slice(0);
	}
}

export class WorkspaceSymbolItem {
	constructor(readonly symbol: IWorkspaceSymbol, readonly provider: IWorkspaceSymbolProvider) { }
}

export async function getWorkspaceSymbols(query: string, token: CancellationToken = CancellationToken.None): Promise<WorkspaceSymbolItem[]> {

	const all: WorkspaceSymbolItem[] = [];

	const promises = WorkspaceSymbolProviderRegistry.all().map(async provider => {
		try {
			const value = await provider.provideWorkspaceSymbols(query, token);
			if (!value) {
				return;
			}
			for (const symbol of value) {
				all.push(new WorkspaceSymbolItem(symbol, provider));
			}
		} catch (err) {
			onUnexpectedExternalError(err);
		}
	});

	await Promise.all(promises);

	if (token.isCancellationRequested) {
		return [];
	}

	// de-duplicate entries

	function compareItems(a: WorkspaceSymbolItem, b: WorkspaceSymbolItem): number {
		let res = compare(a.symbol.name, b.symbol.name);
		if (res === 0) {
			res = a.symbol.kind - b.symbol.kind;
		}
		if (res === 0) {
			res = compare(a.symbol.location.uri.toString(), b.symbol.location.uri.toString());
		}
		if (res === 0) {
			if (a.symbol.location.range && b.symbol.location.range) {
				if (!Range.areIntersecting(a.symbol.location.range, b.symbol.location.range)) {
					res = Range.compareRangesUsingStarts(a.symbol.location.range, b.symbol.location.range);
				}
			} else if (a.provider.resolveWorkspaceSymbol && !b.provider.resolveWorkspaceSymbol) {
				res = -1;
			} else if (!a.provider.resolveWorkspaceSymbol && b.provider.resolveWorkspaceSymbol) {
				res = 1;
			}
		}
		if (res === 0) {
			res = compare(a.symbol.containerName ?? '', b.symbol.containerName ?? '');
		}
		return res;
	}

	return groupBy(all, compareItems).map(group => group[0]).flat();
}

export interface IWorkbenchSearchConfigurationProperties extends ISearchConfigurationProperties {
	quickOpen: {
		includeSymbols: boolean;
		includeHistory: boolean;
		history: {
			filterSortOrder: 'default' | 'recency';
		};
	};
}

export interface IWorkbenchSearchConfiguration extends ISearchConfiguration {
	search: IWorkbenchSearchConfigurationProperties;
}

/**
 * Helper to return all opened editors with resources not belonging to the currently opened workspace.
 */
export function getOutOfWorkspaceEditorResources(accessor: ServicesAccessor): URI[] {
	const editorService = accessor.get(IEditorService);
	const contextService = accessor.get(IWorkspaceContextService);
	const fileService = accessor.get(IFileService);

	const resources = editorService.editors
		.map(editor => EditorResourceAccessor.getOriginalUri(editor, { supportSideBySide: SideBySideEditor.PRIMARY }))
		.filter(resource => !!resource && !contextService.isInsideWorkspace(resource) && fileService.hasProvider(resource));

	return resources as URI[];
}

// Supports patterns of <path><#|:|(><line><#|:|,><col?><:?>
const LINE_COLON_PATTERN = /\s?[#:\(](?:line )?(\d*)(?:[#:,](\d*))?\)?:?\s*$/;

export interface IFilterAndRange {
	filter: string;
	range: IRange;
}

export function extractRangeFromFilter(filter: string, unless?: string[]): IFilterAndRange | undefined {
	// Ignore when the unless character not the first character or is before the line colon pattern
	if (!filter || unless?.some(value => {
		const unlessCharPos = filter.indexOf(value);
		return unlessCharPos === 0 || unlessCharPos > 0 && !LINE_COLON_PATTERN.test(filter.substring(unlessCharPos + 1));
	})) {
		return undefined;
	}

	let range: IRange | undefined = undefined;

	// Find Line/Column number from search value using RegExp
	const patternMatch = LINE_COLON_PATTERN.exec(filter);

	if (patternMatch) {
		const startLineNumber = parseInt(patternMatch[1] ?? '', 10);

		// Line Number
		if (isNumber(startLineNumber)) {
			range = {
				startLineNumber: startLineNumber,
				startColumn: 1,
				endLineNumber: startLineNumber,
				endColumn: 1
			};

			// Column Number
			const startColumn = parseInt(patternMatch[2] ?? '', 10);
			if (isNumber(startColumn)) {
				range = {
					startLineNumber: range.startLineNumber,
					startColumn: startColumn,
					endLineNumber: range.endLineNumber,
					endColumn: startColumn
				};
			}
		}

		// User has typed "something:" or "something#" without a line number, in this case treat as start of file
		else if (patternMatch[1] === '') {
			range = {
				startLineNumber: 1,
				startColumn: 1,
				endLineNumber: 1,
				endColumn: 1
			};
		}
	}

	if (patternMatch && range) {
		return {
			filter: filter.substr(0, patternMatch.index), // clear range suffix from search value
			range
		};
	}

	return undefined;
}

export enum SearchUIState {
	Idle,
	Searching,
	SlowSearch
}

export const SearchStateKey = new RawContextKey<SearchUIState>('searchState', SearchUIState.Idle);

export interface NotebookPriorityInfo {
	isFromSettings: boolean;
	filenamePatterns: string[];
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/common/searchHistoryService.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/common/searchHistoryService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { isEmptyObject } from '../../../../base/common/types.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export interface ISearchHistoryService {
	readonly _serviceBrand: undefined;
	readonly onDidClearHistory: Event<void>;
	clearHistory(): void;
	load(): ISearchHistoryValues;
	save(history: ISearchHistoryValues): void;
}

export const ISearchHistoryService = createDecorator<ISearchHistoryService>('searchHistoryService');

export interface ISearchHistoryValues {
	search?: string[];
	replace?: string[];
	include?: string[];
	exclude?: string[];
}

export class SearchHistoryService implements ISearchHistoryService {
	declare readonly _serviceBrand: undefined;

	public static readonly SEARCH_HISTORY_KEY = 'workbench.search.history';

	private readonly _onDidClearHistory = new Emitter<void>();
	readonly onDidClearHistory: Event<void> = this._onDidClearHistory.event;

	constructor(
		@IStorageService private readonly storageService: IStorageService
	) { }

	clearHistory(): void {
		this.storageService.remove(SearchHistoryService.SEARCH_HISTORY_KEY, StorageScope.WORKSPACE);
		this._onDidClearHistory.fire();
	}

	load(): ISearchHistoryValues {
		let result: ISearchHistoryValues | undefined;
		const raw = this.storageService.get(SearchHistoryService.SEARCH_HISTORY_KEY, StorageScope.WORKSPACE);

		if (raw) {
			try {
				result = JSON.parse(raw);
			} catch (e) {
				// Invalid data
			}
		}

		return result || {};
	}

	save(history: ISearchHistoryValues): void {
		if (isEmptyObject(history)) {
			this.storageService.remove(SearchHistoryService.SEARCH_HISTORY_KEY, StorageScope.WORKSPACE);
		} else {
			this.storageService.store(SearchHistoryService.SEARCH_HISTORY_KEY, JSON.stringify(history), StorageScope.WORKSPACE, StorageTarget.USER);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/common/searchNotebookHelpers.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/common/searchNotebookHelpers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { FindMatch, IReadonlyTextBuffer } from '../../../../editor/common/model.js';
import { TextSearchMatch, IFileMatch, ITextSearchMatch } from '../../../services/search/common/search.js';
import { Range } from '../../../../editor/common/core/range.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';

export type IRawClosedNotebookFileMatch = INotebookFileMatchNoModel<UriComponents>;

export interface INotebookFileMatchNoModel<U extends UriComponents = URI> extends IFileMatch<U> {
	cellResults: INotebookCellMatchNoModel<U>[];
}

export interface INotebookCellMatchNoModel<U extends UriComponents = URI> {
	index: number;
	contentResults: ITextSearchMatch<U>[];
	webviewResults: ITextSearchMatch<U>[];
}

export function isINotebookFileMatchNoModel(object: IFileMatch): object is INotebookFileMatchNoModel {
	return 'cellResults' in object;
}

export const rawCellPrefix = 'rawCell#';

export function genericCellMatchesToTextSearchMatches(contentMatches: FindMatch[], buffer: IReadonlyTextBuffer) {
	let previousEndLine = -1;
	const contextGroupings: FindMatch[][] = [];
	let currentContextGrouping: FindMatch[] = [];

	contentMatches.forEach((match) => {
		if (match.range.startLineNumber !== previousEndLine) {
			if (currentContextGrouping.length > 0) {
				contextGroupings.push([...currentContextGrouping]);
				currentContextGrouping = [];
			}
		}

		currentContextGrouping.push(match);
		previousEndLine = match.range.endLineNumber;
	});

	if (currentContextGrouping.length > 0) {
		contextGroupings.push([...currentContextGrouping]);
	}

	const textSearchResults = contextGroupings.map((grouping) => {
		const lineTexts: string[] = [];
		const firstLine = grouping[0].range.startLineNumber;
		const lastLine = grouping[grouping.length - 1].range.endLineNumber;
		for (let i = firstLine; i <= lastLine; i++) {
			lineTexts.push(buffer.getLineContent(i));
		}
		return new TextSearchMatch(
			lineTexts.join('\n') + '\n',
			grouping.map(m => new Range(m.range.startLineNumber - 1, m.range.startColumn - 1, m.range.endLineNumber - 1, m.range.endColumn - 1)),
		);
	});

	return textSearchResults;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/test/browser/mockSearchTree.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/test/browser/mockSearchTree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITreeNavigator } from '../../../../../base/browser/ui/tree/tree.js';
import { Emitter } from '../../../../../base/common/event.js';
import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { RenderableMatch } from '../../browser/searchTreeModel/searchTreeCommon.js';

const someEvent = new Emitter().event;

/**
 * Add stub methods as needed
 */
export class MockObjectTree<T, TRef> implements IDisposable {

	get onDidChangeFocus() { return someEvent; }
	get onDidChangeSelection() { return someEvent; }
	get onDidOpen() { return someEvent; }

	get onMouseClick() { return someEvent; }
	get onMouseDblClick() { return someEvent; }
	get onContextMenu() { return someEvent; }

	get onKeyDown() { return someEvent; }
	get onKeyUp() { return someEvent; }
	get onKeyPress() { return someEvent; }

	get onDidFocus() { return someEvent; }
	get onDidBlur() { return someEvent; }

	get onDidChangeCollapseState() { return someEvent; }
	get onDidChangeRenderNodeCount() { return someEvent; }

	get onDidDispose() { return someEvent; }
	get lastVisibleElement() { return this.elements[this.elements.length - 1]; }

	constructor(private elements: any[]) { }

	domFocus(): void { }

	collapse(location: TRef, recursive: boolean = false): boolean {
		return true;
	}

	expand(location: TRef, recursive: boolean = false): boolean {
		return true;
	}

	navigate(start?: TRef): ITreeNavigator<T> {
		const startIdx = start ? this.elements.indexOf(start) :
			undefined;

		return new ArrayNavigator(this.elements, startIdx);
	}

	getParentElement(elem: RenderableMatch) {
		return elem.parent();
	}

	dispose(): void {
	}
}

class ArrayNavigator<T> implements ITreeNavigator<T> {
	constructor(private elements: T[], private index = 0) { }

	current(): T | null {
		return this.elements[this.index];
	}

	previous(): T | null {
		return this.elements[--this.index];
	}

	first(): T | null {
		this.index = 0;
		return this.elements[this.index];
	}

	last(): T | null {
		this.index = this.elements.length - 1;
		return this.elements[this.index];
	}

	next(): T | null {
		return this.elements[++this.index];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/test/browser/searchActions.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/test/browser/searchActions.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Keybinding } from '../../../../../base/common/keybindings.js';
import { OS } from '../../../../../base/common/platform.js';
import { URI } from '../../../../../base/common/uri.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { USLayoutResolvedKeybinding } from '../../../../../platform/keybinding/common/usLayoutResolvedKeybinding.js';
import { IFileMatch, QueryType } from '../../../../services/search/common/search.js';
import { getElementToFocusAfterRemoved, getLastNodeFromSameType } from '../../browser/searchActionsRemoveReplace.js';
import { SearchModelImpl } from '../../browser/searchTreeModel/searchModel.js';
import { MockObjectTree } from './mockSearchTree.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { INotebookEditorService } from '../../../notebook/browser/services/notebookEditorService.js';
import { createFileUriFromPathFromRoot, stubModelService, stubNotebookEditorService } from './searchTestCommon.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { FolderMatchImpl } from '../../browser/searchTreeModel/folderMatch.js';
import { ISearchTreeFileMatch, ISearchTreeMatch, FileMatchOrMatch } from '../../browser/searchTreeModel/searchTreeCommon.js';
import { NotebookCompatibleFileMatch } from '../../browser/notebookSearch/notebookSearchModel.js';
import { INotebookFileInstanceMatch } from '../../browser/notebookSearch/notebookSearchModelBase.js';
import { MatchImpl } from '../../browser/searchTreeModel/match.js';

suite('Search Actions', () => {

	let instantiationService: TestInstantiationService;
	let counter: number;
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		instantiationService = new TestInstantiationService();
		instantiationService.stub(IModelService, stubModelService(instantiationService, (e) => store.add(e)));
		instantiationService.stub(INotebookEditorService, stubNotebookEditorService(instantiationService, (e) => store.add(e)));
		instantiationService.stub(IKeybindingService, {});
		instantiationService.stub(ILabelService, { getUriBasenameLabel: (uri: URI) => '' });
		instantiationService.stub(IKeybindingService, 'resolveKeybinding', (keybinding: Keybinding) => USLayoutResolvedKeybinding.resolveKeybinding(keybinding, OS));
		instantiationService.stub(IKeybindingService, 'lookupKeybinding', (id: string) => null);
		instantiationService.stub(IKeybindingService, 'lookupKeybinding', (id: string) => null);
		counter = 0;
	});

	teardown(() => {
		instantiationService.dispose();
	});

	test('get next element to focus after removing a match when it has next sibling file', async function () {
		const fileMatch1 = aFileMatch();
		const fileMatch2 = aFileMatch();
		const data = [fileMatch1, aMatch(fileMatch1), aMatch(fileMatch1), fileMatch2, aMatch(fileMatch2), aMatch(fileMatch2)];
		const tree = aTree(data);
		const target = data[2];

		const actual = await getElementToFocusAfterRemoved(tree, target, [target]);
		assert.strictEqual(data[4], actual);
	});

	test('get next element to focus after removing a match when it is the only match', async function () {
		const fileMatch1 = aFileMatch();
		const data = [fileMatch1, aMatch(fileMatch1)];
		const tree = aTree(data);
		const target = data[1];

		const actual = await getElementToFocusAfterRemoved(tree, target, [target]);
		assert.strictEqual(undefined, actual);
	});

	test('get next element to focus after removing a file match when it has next sibling', async function () {
		const fileMatch1 = aFileMatch();
		const fileMatch2 = aFileMatch();
		const fileMatch3 = aFileMatch();
		const data = [fileMatch1, aMatch(fileMatch1), fileMatch2, aMatch(fileMatch2), fileMatch3, aMatch(fileMatch3)];
		const tree = aTree(data);
		const target = data[2];

		const actual = await getElementToFocusAfterRemoved(tree, target, []);
		assert.strictEqual(data[4], actual);
	});

	test('Find last FileMatch in Tree', async function () {
		const fileMatch1 = aFileMatch();
		const fileMatch2 = aFileMatch();
		const fileMatch3 = aFileMatch();
		const data = [fileMatch1, aMatch(fileMatch1), fileMatch2, aMatch(fileMatch2), fileMatch3, aMatch(fileMatch3)];
		const tree = aTree(data);

		const actual = await getLastNodeFromSameType(tree, fileMatch1);
		assert.strictEqual(fileMatch3, actual);
	});

	test('Find last Match in Tree', async function () {
		const fileMatch1 = aFileMatch();
		const fileMatch2 = aFileMatch();
		const fileMatch3 = aFileMatch();
		const data = [fileMatch1, aMatch(fileMatch1), fileMatch2, aMatch(fileMatch2), fileMatch3, aMatch(fileMatch3)];
		const tree = aTree(data);

		const actual = await getLastNodeFromSameType(tree, aMatch(fileMatch1));
		assert.strictEqual(data[5], actual);
	});

	test('get next element to focus after removing a file match when it is only match', async function () {
		const fileMatch1 = aFileMatch();
		const data = [fileMatch1, aMatch(fileMatch1)];
		const tree = aTree(data);
		const target = data[0];
		// const testObject: ReplaceAction = instantiationService.createInstance(ReplaceAction, tree, target, null);

		const actual = await getElementToFocusAfterRemoved(tree, target, []);
		assert.strictEqual(undefined, actual);
	});

	function aFileMatch(): INotebookFileInstanceMatch {
		const uri = URI.file('somepath' + ++counter);
		const rawMatch: IFileMatch = {
			resource: uri,
			results: []
		};

		const searchModel = instantiationService.createInstance(SearchModelImpl);
		store.add(searchModel);
		const folderMatch = instantiationService.createInstance(FolderMatchImpl, URI.file('somepath'), '', 0, {
			type: QueryType.Text, folderQueries: [{ folder: createFileUriFromPathFromRoot() }], contentPattern: {
				pattern: ''
			}
		}, searchModel.searchResult.plainTextSearchResult, searchModel.searchResult, null);
		store.add(folderMatch);
		const fileMatch = instantiationService.createInstance(NotebookCompatibleFileMatch, {
			pattern: ''
		}, undefined, undefined, folderMatch, rawMatch, null, '');
		fileMatch.createMatches();
		store.add(fileMatch);
		return fileMatch;
	}

	function aMatch(fileMatch: ISearchTreeFileMatch): ISearchTreeMatch {
		const line = ++counter;
		const match = new MatchImpl(
			fileMatch,
			['some match'],
			{
				startLineNumber: 0,
				startColumn: 0,
				endLineNumber: 0,
				endColumn: 2
			},
			{
				startLineNumber: line,
				startColumn: 0,
				endLineNumber: line,
				endColumn: 2
			},
			false
		);
		fileMatch.add(match);
		return match;
	}

	function aTree(elements: FileMatchOrMatch[]): any {
		return new MockObjectTree(elements);
	}
});
```

--------------------------------------------------------------------------------

````

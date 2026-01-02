---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 398
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 398 of 552)

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

---[FILE: src/vs/workbench/contrib/files/browser/views/explorerViewer.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/browser/views/explorerViewer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IListAccessibilityProvider } from '../../../../../base/browser/ui/list/listWidget.js';
import * as DOM from '../../../../../base/browser/dom.js';
import * as glob from '../../../../../base/common/glob.js';
import { IListVirtualDelegate, ListDragOverEffectPosition, ListDragOverEffectType } from '../../../../../base/browser/ui/list/list.js';
import { IProgressService, ProgressLocation, } from '../../../../../platform/progress/common/progress.js';
import { INotificationService, Severity } from '../../../../../platform/notification/common/notification.js';
import { IFileService, FileKind, FileOperationError, FileOperationResult, FileChangeType } from '../../../../../platform/files/common/files.js';
import { IWorkbenchLayoutService } from '../../../../services/layout/browser/layoutService.js';
import { isTemporaryWorkspace, IWorkspaceContextService, WorkbenchState } from '../../../../../platform/workspace/common/workspace.js';
import { IDisposable, Disposable, dispose, toDisposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { KeyCode } from '../../../../../base/common/keyCodes.js';
import { IFileLabelOptions, IResourceLabel, ResourceLabels } from '../../../../browser/labels.js';
import { ITreeNode, ITreeFilter, TreeVisibility, IAsyncDataSource, ITreeSorter, ITreeDragAndDrop, ITreeDragOverReaction, TreeDragOverBubble } from '../../../../../base/browser/ui/tree/tree.js';
import { IContextMenuService, IContextViewService } from '../../../../../platform/contextview/browser/contextView.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { IConfigurationChangeEvent, IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ExplorerFindProviderActive, IFilesConfiguration, UndoConfirmLevel } from '../../common/files.js';
import { dirname, joinPath, distinctParents, relativePath } from '../../../../../base/common/resources.js';
import { InputBox, MessageType } from '../../../../../base/browser/ui/inputbox/inputBox.js';
import { localize } from '../../../../../nls.js';
import { createSingleCallFunction } from '../../../../../base/common/functional.js';
import { IKeyboardEvent } from '../../../../../base/browser/keyboardEvent.js';
import { equals, deepClone } from '../../../../../base/common/objects.js';
import * as path from '../../../../../base/common/path.js';
import { ExplorerItem, NewExplorerItem } from '../../common/explorerModel.js';
import { compareFileExtensionsDefault, compareFileNamesDefault, compareFileNamesUpper, compareFileExtensionsUpper, compareFileNamesLower, compareFileExtensionsLower, compareFileNamesUnicode, compareFileExtensionsUnicode } from '../../../../../base/common/comparers.js';
import { CodeDataTransfers, containsDragType } from '../../../../../platform/dnd/browser/dnd.js';
import { fillEditorsDragData } from '../../../../browser/dnd.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IDragAndDropData, DataTransfers } from '../../../../../base/browser/dnd.js';
import { Schemas } from '../../../../../base/common/network.js';
import { NativeDragAndDropData, ExternalElementsDragAndDropData, ElementsDragAndDropData, ListViewTargetSector } from '../../../../../base/browser/ui/list/listView.js';
import { isMacintosh, isWeb } from '../../../../../base/common/platform.js';
import { IDialogService, getFileNamesMessage } from '../../../../../platform/dialogs/common/dialogs.js';
import { IWorkspaceEditingService } from '../../../../services/workspaces/common/workspaceEditing.js';
import { URI } from '../../../../../base/common/uri.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { IWorkspaceFolderCreationData } from '../../../../../platform/workspaces/common/workspaces.js';
import { findValidPasteFileTarget } from '../fileActions.js';
import { FuzzyScore, createMatches } from '../../../../../base/common/filters.js';
import { Emitter, Event, EventMultiplexer } from '../../../../../base/common/event.js';
import { IAsyncDataTreeViewState, IAsyncFindProvider, IAsyncFindResult, IAsyncFindToggles, ITreeCompressionDelegate } from '../../../../../base/browser/ui/tree/asyncDataTree.js';
import { ICompressibleTreeRenderer } from '../../../../../base/browser/ui/tree/objectTree.js';
import { ICompressedTreeNode } from '../../../../../base/browser/ui/tree/compressedObjectTreeModel.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { isNumber } from '../../../../../base/common/types.js';
import { IEditableData } from '../../../../common/views.js';
import { EditorInput } from '../../../../common/editor/editorInput.js';
import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { ResourceFileEdit } from '../../../../../editor/browser/services/bulkEditService.js';
import { IExplorerService } from '../files.js';
import { BrowserFileUpload, ExternalFileImport, getMultipleFilesOverwriteConfirm } from '../fileImportExport.js';
import { toErrorMessage } from '../../../../../base/common/errorMessage.js';
import { WebFileSystemAccess } from '../../../../../platform/files/browser/webFileSystemAccess.js';
import { IgnoreFile } from '../../../../services/search/common/ignoreFile.js';
import { ResourceSet } from '../../../../../base/common/map.js';
import { TernarySearchTree } from '../../../../../base/common/ternarySearchTree.js';
import { defaultCountBadgeStyles, defaultInputBoxStyles } from '../../../../../platform/theme/browser/defaultStyles.js';
import { timeout } from '../../../../../base/common/async.js';
import { IFilesConfigurationService } from '../../../../services/filesConfiguration/common/filesConfigurationService.js';
import { mainWindow } from '../../../../../base/browser/window.js';
import { IExplorerFileContribution, explorerFileContribRegistry } from '../explorerFileContrib.js';
import { WorkbenchCompressibleAsyncDataTree } from '../../../../../platform/list/browser/listService.js';
import { ISearchService, QueryType, getExcludes, ISearchConfiguration, ISearchComplete, IFileQuery } from '../../../../services/search/common/search.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { TreeFindMatchType, TreeFindMode } from '../../../../../base/browser/ui/tree/abstractTree.js';
import { isCancellationError } from '../../../../../base/common/errors.js';
import { IContextKey, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { CountBadge } from '../../../../../base/browser/ui/countBadge/countBadge.js';
import { listFilterMatchHighlight, listFilterMatchHighlightBorder } from '../../../../../platform/theme/common/colorRegistry.js';
import { asCssVariable } from '../../../../../platform/theme/common/colorUtils.js';

export class ExplorerDelegate implements IListVirtualDelegate<ExplorerItem> {

	static readonly ITEM_HEIGHT = 22;

	getHeight(element: ExplorerItem): number {
		return ExplorerDelegate.ITEM_HEIGHT;
	}

	getTemplateId(element: ExplorerItem): string {
		return FilesRenderer.ID;
	}
}

export const explorerRootErrorEmitter = new Emitter<URI>();
export class ExplorerDataSource implements IAsyncDataSource<ExplorerItem | ExplorerItem[], ExplorerItem> {

	constructor(
		private readonly fileFilter: FilesFilter,
		private readonly findProvider: ExplorerFindProvider,
		@IProgressService private readonly progressService: IProgressService,
		@IConfigurationService private readonly configService: IConfigurationService,
		@INotificationService private readonly notificationService: INotificationService,
		@IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService,
		@IFileService private readonly fileService: IFileService,
		@IExplorerService private readonly explorerService: IExplorerService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IFilesConfigurationService private readonly filesConfigService: IFilesConfigurationService
	) { }

	getParent(element: ExplorerItem): ExplorerItem {
		if (element.parent) {
			return element.parent;
		}

		throw new Error('getParent only supported for cached parents');
	}

	hasChildren(element: ExplorerItem | ExplorerItem[]): boolean {
		// don't render nest parents as containing children when all the children are filtered out
		return Array.isArray(element) || element.hasChildren((stat) => this.fileFilter.filter(stat, TreeVisibility.Visible));
	}

	getChildren(element: ExplorerItem | ExplorerItem[]): ExplorerItem[] | Promise<ExplorerItem[]> {
		if (Array.isArray(element)) {
			return element;
		}

		if (this.findProvider.isShowingFilterResults()) {
			return Array.from(element.children.values());
		}

		const hasError = element.error;
		const sortOrder = this.explorerService.sortOrderConfiguration.sortOrder;
		const children = element.fetchChildren(sortOrder);
		if (Array.isArray(children)) {
			// fast path when children are known sync (i.e. nested children)
			return children;
		}
		const promise = children.then(
			children => {
				// Clear previous error decoration on root folder
				if (element instanceof ExplorerItem && element.isRoot && !element.error && hasError && this.contextService.getWorkbenchState() !== WorkbenchState.FOLDER) {
					explorerRootErrorEmitter.fire(element.resource);
				}
				return children;
			}
			, e => {

				if (element instanceof ExplorerItem && element.isRoot) {
					if (this.contextService.getWorkbenchState() === WorkbenchState.FOLDER) {
						// Single folder create a dummy explorer item to show error
						const placeholder = new ExplorerItem(element.resource, this.fileService, this.configService, this.filesConfigService, undefined, undefined, false);
						placeholder.error = e;
						return [placeholder];
					} else {
						explorerRootErrorEmitter.fire(element.resource);
					}
				} else {
					// Do not show error for roots since we already use an explorer decoration to notify user
					this.notificationService.error(e);
				}

				return []; // we could not resolve any children because of an error
			});

		this.progressService.withProgress({
			location: ProgressLocation.Explorer,
			delay: this.layoutService.isRestored() ? 800 : 1500 // reduce progress visibility when still restoring
		}, _progress => promise);

		return promise;
	}
}

export class PhantomExplorerItem extends ExplorerItem {

}

interface FindHighlightLayer {
	childMatches: number;
	isMatch: boolean;
	stats: {
		[statName: string]: FindHighlightLayer;
	};
}

interface IExplorerFindHighlightTree {
	get(item: ExplorerItem): number;
	isMatch(item: ExplorerItem): boolean;
}

class ExplorerFindHighlightTree implements IExplorerFindHighlightTree {

	private readonly _tree = new Map<string, FindHighlightLayer>();
	private readonly _highlightedItems = new Map<string, ExplorerItem>();
	get highlightedItems(): ExplorerItem[] {
		return Array.from(this._highlightedItems.values());
	}

	get(item: ExplorerItem): number {
		const result = this.find(item);
		if (result === undefined) {
			return 0;
		}

		const { treeLayer, relPath } = result;
		this._highlightedItems.set(relPath, item);

		return treeLayer.childMatches;
	}

	private find(item: ExplorerItem): { treeLayer: FindHighlightLayer; relPath: string } | undefined {
		const rootLayer = this._tree.get(item.root.name);
		if (rootLayer === undefined) {
			return undefined;
		}

		const relPath = relativePath(item.root.resource, item.resource);
		if (relPath === undefined || relPath.startsWith('..')) {
			throw new Error('Resource is not a child of the root');
		}

		if (relPath === '') {
			return { treeLayer: rootLayer, relPath };
		}

		let treeLayer = rootLayer;
		for (const segment of relPath.split('/')) {
			if (!treeLayer.stats[segment]) {
				return undefined;
			}

			treeLayer = treeLayer.stats[segment];
		}

		return { treeLayer, relPath };
	}

	add(resource: URI, root: ExplorerItem): void {
		const relPath = relativePath(root.resource, resource);
		if (relPath === undefined || relPath.startsWith('..')) {
			throw new Error('Resource is not a child of the root');
		}

		let rootLayer = this._tree.get(root.name);
		if (!rootLayer) {
			rootLayer = { childMatches: 0, stats: {}, isMatch: false };
			this._tree.set(root.name, rootLayer);
		}
		rootLayer.childMatches++;

		let treeLayer = rootLayer;
		for (const stat of relPath.split('/')) {
			if (!treeLayer.stats[stat]) {
				treeLayer.stats[stat] = { childMatches: 0, stats: {}, isMatch: false };
			}

			treeLayer = treeLayer.stats[stat];
			treeLayer.childMatches++;
		}

		treeLayer.childMatches--; // the last segment is the file itself
		treeLayer.isMatch = true;
	}

	isMatch(item: ExplorerItem): boolean {
		const result = this.find(item);
		if (result === undefined) {
			return false;
		}

		const { treeLayer } = result;
		return treeLayer.isMatch;
	}

	clear(): void {
		this._tree.clear();
	}

}

export class ExplorerFindProvider implements IAsyncFindProvider<ExplorerItem> {

	private sessionId: number = 0;
	private filterSessionStartState: { viewState: IAsyncDataTreeViewState; input: ExplorerItem[] | ExplorerItem; rootsWithProviders: Set<ExplorerItem> } | undefined;
	private highlightSessionStartState: { rootsWithProviders: Set<ExplorerItem> } | undefined;
	private explorerFindActiveContextKey: IContextKey<boolean>;
	private phantomParents = new Set<ExplorerItem>();
	private findHighlightTree = new ExplorerFindHighlightTree();
	get highlightTree(): IExplorerFindHighlightTree {
		return this.findHighlightTree;
	}

	constructor(
		private readonly filesFilter: FilesFilter,
		private readonly treeProvider: () => WorkbenchCompressibleAsyncDataTree<ExplorerItem | ExplorerItem[], ExplorerItem, FuzzyScore>,
		@ISearchService private readonly searchService: ISearchService,
		@IFileService private readonly fileService: IFileService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IFilesConfigurationService private readonly filesConfigService: IFilesConfigurationService,
		@IProgressService private readonly progressService: IProgressService,
		@IExplorerService private readonly explorerService: IExplorerService,
		@IContextKeyService contextKeyService: IContextKeyService
	) {
		this.explorerFindActiveContextKey = ExplorerFindProviderActive.bindTo(contextKeyService);
	}

	isShowingFilterResults(): boolean {
		return !!this.filterSessionStartState;
	}

	isVisible(element: ExplorerItem): boolean {
		if (!this.filterSessionStartState) {
			return true;
		}

		if (this.explorerService.isEditable(element)) {
			return true;
		}

		return this.filterSessionStartState.rootsWithProviders.has(element.root) ? element.isMarkedAsFiltered() : true;
	}

	startSession(): void {
		this.sessionId++;
	}

	async endSession(): Promise<void> {
		// Restore view state
		if (this.filterSessionStartState) {
			await this.endFilterSession();
		}

		if (this.highlightSessionStartState) {
			this.endHighlightSession();
		}
	}

	async find(pattern: string, toggles: IAsyncFindToggles, token: CancellationToken): Promise<IAsyncFindResult<ExplorerItem> | undefined> {
		const promise = this.doFind(pattern, toggles, token);

		return await this.progressService.withProgress({
			location: ProgressLocation.Explorer,
			delay: 750,
		}, _progress => promise);
	}

	async doFind(pattern: string, toggles: IAsyncFindToggles, token: CancellationToken): Promise<IAsyncFindResult<ExplorerItem> | undefined> {
		if (toggles.findMode === TreeFindMode.Highlight) {
			if (this.filterSessionStartState) {
				await this.endFilterSession();
			}

			if (!this.highlightSessionStartState) {
				this.startHighlightSession();
			}

			return await this.doHighlightFind(pattern, toggles.matchType, token);
		}

		if (this.highlightSessionStartState) {
			this.endHighlightSession();
		}

		if (!this.filterSessionStartState) {
			this.startFilterSession();
		}

		return await this.doFilterFind(pattern, toggles.matchType, token);
	}

	// Filter

	private startFilterSession(): void {
		const tree = this.treeProvider();
		const input = tree.getInput();
		if (!input) {
			return;
		}

		const roots = this.explorerService.roots.filter(root => this.searchSupportsScheme(root.resource.scheme));
		this.filterSessionStartState = { viewState: tree.getViewState(), input, rootsWithProviders: new Set(roots) };

		this.explorerFindActiveContextKey.set(true);
	}

	async doFilterFind(pattern: string, matchType: TreeFindMatchType, token: CancellationToken): Promise<IAsyncFindResult<ExplorerItem> | undefined> {
		if (!this.filterSessionStartState) {
			throw new Error('ExplorerFindProvider: no session state');
		}

		const roots = Array.from(this.filterSessionStartState.rootsWithProviders);
		const searchResults = await this.getSearchResults(pattern, roots, matchType, token);

		if (token.isCancellationRequested) {
			return undefined;
		}

		this.clearPhantomElements();
		for (const { explorerRoot, files, directories } of searchResults) {
			this.addWorkspaceFilterResults(explorerRoot, files, directories);
		}

		const tree = this.treeProvider();
		await tree.setInput(this.filterSessionStartState.input);

		const hitMaxResults = searchResults.some(({ hitMaxResults }) => hitMaxResults);
		return {
			isMatch: (item: ExplorerItem) => item.isMarkedAsFiltered(),
			matchCount: searchResults.reduce((acc, { files, directories }) => acc + files.length + directories.length, 0),
			warningMessage: hitMaxResults ? localize('searchMaxResultsWarning', "The result set only contains a subset of all matches. Be more specific in your search to narrow down the results.") : undefined
		};
	}

	private addWorkspaceFilterResults(root: ExplorerItem, files: URI[], directories: URI[]): void {
		const results = [
			...files.map(file => ({ resource: file, isDirectory: false })),
			...directories.map(directory => ({ resource: directory, isDirectory: true }))
		];

		for (const { resource, isDirectory } of results) {
			const element = root.find(resource);
			if (element && element.root === root) {
				// File is already in the model
				element.markItemAndParentsAsFiltered();
				continue;
			}

			// File is not in the model, create phantom items for the file and it's parents
			const phantomElements = this.createPhantomItems(resource, root, isDirectory);
			if (phantomElements.length === 0) {
				throw new Error('Phantom item was not created even though it is not in the model');
			}

			// Store the first ancestor of the file which is already present in the model
			const firstPhantomParent = phantomElements[0].parent!;
			if (!(firstPhantomParent instanceof PhantomExplorerItem)) {
				this.phantomParents.add(firstPhantomParent);
			}

			const phantomFileElement = phantomElements[phantomElements.length - 1];
			phantomFileElement.markItemAndParentsAsFiltered();
		}
	}

	private createPhantomItems(resource: URI, root: ExplorerItem, resourceIsDirectory: boolean): PhantomExplorerItem[] {
		const relativePathToRoot = relativePath(root.resource, resource);
		if (!relativePathToRoot) {
			throw new Error('Resource is not a child of the root');
		}

		const phantomElements: PhantomExplorerItem[] = [];

		let currentItem = root;
		let currentResource = root.resource;
		const pathSegments = relativePathToRoot.split('/');
		for (const stat of pathSegments) {
			currentResource = currentResource.with({ path: `${currentResource.path}/${stat}` });

			let child = currentItem.getChild(stat);
			if (!child) {
				const isDirectory = pathSegments[pathSegments.length - 1] === stat ? resourceIsDirectory : true;
				child = new PhantomExplorerItem(currentResource, this.fileService, this.configurationService, this.filesConfigService, currentItem, isDirectory);
				currentItem.addChild(child);
				phantomElements.push(child as PhantomExplorerItem);
			}

			currentItem = child;
		}

		return phantomElements;
	}

	async endFilterSession(): Promise<void> {
		this.clearPhantomElements();

		this.explorerFindActiveContextKey.set(false);

		// Restore view state
		if (!this.filterSessionStartState) {
			throw new Error('ExplorerFindProvider: no session state to restore');
		}

		const tree = this.treeProvider();
		await tree.setInput(this.filterSessionStartState.input, this.filterSessionStartState.viewState);

		this.filterSessionStartState = undefined;
		this.explorerService.refresh();
	}

	private clearPhantomElements(): void {
		for (const phantomParent of this.phantomParents) {
			// Clear phantom nodes from model
			phantomParent.forgetChildren();
		}
		this.phantomParents.clear();
		this.explorerService.roots.forEach(root => root.unmarkItemAndChildren());
	}

	// Highlight

	private startHighlightSession(): void {
		const roots = this.explorerService.roots.filter(root => this.searchSupportsScheme(root.resource.scheme));
		this.highlightSessionStartState = { rootsWithProviders: new Set(roots) };
	}

	async doHighlightFind(pattern: string, matchType: TreeFindMatchType, token: CancellationToken): Promise<IAsyncFindResult<ExplorerItem> | undefined> {
		if (!this.highlightSessionStartState) {
			throw new Error('ExplorerFindProvider: no highlight session state');
		}

		const roots = Array.from(this.highlightSessionStartState.rootsWithProviders);
		const searchResults = await this.getSearchResults(pattern, roots, matchType, token);

		if (token.isCancellationRequested) {
			return undefined;
		}

		this.clearHighlights();
		for (const { explorerRoot, files, directories } of searchResults) {
			this.addWorkspaceHighlightResults(explorerRoot, files.concat(directories));
		}

		const hitMaxResults = searchResults.some(({ hitMaxResults }) => hitMaxResults);
		return {
			isMatch: (item: ExplorerItem) => this.findHighlightTree.isMatch(item) || (this.findHighlightTree.get(item) > 0 && this.treeProvider().isCollapsed(item)),
			matchCount: searchResults.reduce((acc, { files, directories }) => acc + files.length + directories.length, 0),
			warningMessage: hitMaxResults ? localize('searchMaxResultsWarning', "The result set only contains a subset of all matches. Be more specific in your search to narrow down the results.") : undefined
		};
	}

	private addWorkspaceHighlightResults(root: ExplorerItem, resources: URI[]): void {
		const highlightedDirectories = new Set<ExplorerItem>();
		const storeDirectories = (item: ExplorerItem | undefined) => {
			while (item) {
				highlightedDirectories.add(item);
				item = item.parent;
			}
		};

		for (const resource of resources) {
			const element = root.find(resource);
			if (element && element.root === root) {
				// File is already in the model
				this.findHighlightTree.add(resource, root);
				storeDirectories(element.parent);
				continue;
			}

			const firstParent = findFirstParent(resource, root);
			if (firstParent) {
				this.findHighlightTree.add(resource, root);
				storeDirectories(firstParent.parent);
			}
		}

		const tree = this.treeProvider();
		for (const directory of highlightedDirectories) {
			if (tree.hasNode(directory)) {
				tree.rerender(directory);
			}
		}
	}

	private endHighlightSession(): void {
		this.highlightSessionStartState = undefined;
		this.clearHighlights();
	}

	private clearHighlights(): void {
		const tree = this.treeProvider();
		for (const item of this.findHighlightTree.highlightedItems) {
			if (tree.hasNode(item)) {
				tree.rerender(item);
			}
		}
		this.findHighlightTree.clear();
	}

	// Search

	private searchSupportsScheme(scheme: string): boolean {
		// Limited by the search API
		if (scheme !== Schemas.file && scheme !== Schemas.vscodeRemote) {
			return false;
		}
		return this.searchService.schemeHasFileSearchProvider(scheme);
	}

	private async getSearchResults(pattern: string, roots: ExplorerItem[], matchType: TreeFindMatchType, token: CancellationToken): Promise<{ explorerRoot: ExplorerItem; files: URI[]; directories: URI[]; hitMaxResults: boolean }[]> {
		const patternLowercase = pattern.toLowerCase();
		const isFuzzyMatch = matchType === TreeFindMatchType.Fuzzy;
		return await Promise.all(roots.map((root, index) => this.searchInWorkspace(patternLowercase, root, index, isFuzzyMatch, token)));
	}

	private async searchInWorkspace(patternLowercase: string, root: ExplorerItem, rootIndex: number, isFuzzyMatch: boolean, token: CancellationToken): Promise<{ explorerRoot: ExplorerItem; files: URI[]; directories: URI[]; hitMaxResults: boolean }> {
		const segmentMatchPattern = caseInsensitiveGlobPattern(isFuzzyMatch ? fuzzyMatchingGlobPattern(patternLowercase) : continousMatchingGlobPattern(patternLowercase));

		const searchExcludePattern = getExcludes(this.configurationService.getValue<ISearchConfiguration>({ resource: root.resource })) || {};
		const searchOptions: IFileQuery = {
			folderQueries: [{
				folder: root.resource,
				disregardIgnoreFiles: !this.configurationService.getValue<boolean>('explorer.excludeGitIgnore'),
			}],
			type: QueryType.File,
			shouldGlobMatchFilePattern: true,
			cacheKey: `explorerfindprovider:${root.name}:${rootIndex}:${this.sessionId}`,
			excludePattern: searchExcludePattern,
		};

		let fileResults: ISearchComplete | undefined;
		let folderResults: ISearchComplete | undefined;
		try {
			[fileResults, folderResults] = await Promise.all([
				this.searchService.fileSearch({ ...searchOptions, filePattern: `**/${segmentMatchPattern}`, maxResults: 512 }, token),
				this.searchService.fileSearch({ ...searchOptions, filePattern: `**/${segmentMatchPattern}/**` }, token)
			]);
		} catch (e) {
			if (!isCancellationError(e)) {
				throw e;
			}
		}

		if (!fileResults || !folderResults || token.isCancellationRequested) {
			return { explorerRoot: root, files: [], directories: [], hitMaxResults: false };
		}

		const fileResultResources = fileResults.results.map(result => result.resource);
		const directoryResources = getMatchingDirectoriesFromFiles(folderResults.results.map(result => result.resource), root, segmentMatchPattern);

		const filteredFileResources = fileResultResources.filter(resource => !this.filesFilter.isIgnored(resource, root.resource, false));
		const filteredDirectoryResources = directoryResources.filter(resource => !this.filesFilter.isIgnored(resource, root.resource, true));

		return { explorerRoot: root, files: filteredFileResources, directories: filteredDirectoryResources, hitMaxResults: !!fileResults.limitHit || !!folderResults.limitHit };
	}
}

function getMatchingDirectoriesFromFiles(resources: URI[], root: ExplorerItem, segmentMatchPattern: string): URI[] {
	const uniqueDirectories = new ResourceSet();
	for (const resource of resources) {
		const relativePathToRoot = relativePath(root.resource, resource);
		if (!relativePathToRoot) {
			throw new Error('Resource is not a child of the root');
		}

		let dirResource = root.resource;
		const stats = relativePathToRoot.split('/').slice(0, -1);
		for (const stat of stats) {
			dirResource = dirResource.with({ path: `${dirResource.path}/${stat}` });
			uniqueDirectories.add(dirResource);
		}
	}

	const matchingDirectories: URI[] = [];
	for (const dirResource of uniqueDirectories) {
		const stats = dirResource.path.split('/');
		const dirStat = stats[stats.length - 1];
		if (!dirStat || !glob.match(segmentMatchPattern, dirStat)) {
			continue;
		}

		matchingDirectories.push(dirResource);
	}

	return matchingDirectories;
}

function findFirstParent(resource: URI, root: ExplorerItem): ExplorerItem | undefined {
	const relativePathToRoot = relativePath(root.resource, resource);
	if (!relativePathToRoot) {
		throw new Error('Resource is not a child of the root');
	}

	let currentItem = root;
	let currentResource = root.resource;
	const pathSegments = relativePathToRoot.split('/');
	for (const stat of pathSegments) {
		currentResource = currentResource.with({ path: `${currentResource.path}/${stat}` });
		const child = currentItem.getChild(stat);
		if (!child) {
			return currentItem;
		}

		currentItem = child;
	}

	return undefined;
}

function fuzzyMatchingGlobPattern(pattern: string): string {
	if (!pattern) {
		return '*';
	}
	return '*' + pattern.split('').join('*') + '*';
}

function continousMatchingGlobPattern(pattern: string): string {
	if (!pattern) {
		return '*';
	}
	return '*' + pattern + '*';
}

function caseInsensitiveGlobPattern(pattern: string): string {
	let caseInsensitiveFilePattern = '';
	for (let i = 0; i < pattern.length; i++) {
		const char = pattern[i];
		if (/[a-zA-Z]/.test(char)) {
			caseInsensitiveFilePattern += `[${char.toLowerCase()}${char.toUpperCase()}]`;
		} else {
			caseInsensitiveFilePattern += char;
		}
	}
	return caseInsensitiveFilePattern;
}

export interface ICompressedNavigationController {
	readonly current: ExplorerItem;
	readonly currentId: string;
	readonly items: ExplorerItem[];
	readonly labels: HTMLElement[];
	readonly index: number;
	readonly count: number;
	readonly onDidChange: Event<void>;
	previous(): void;
	next(): void;
	first(): void;
	last(): void;
	setIndex(index: number): void;
	updateCollapsed(collapsed: boolean): void;
}

export class CompressedNavigationController implements ICompressedNavigationController, IDisposable {

	static ID = 0;

	private _index: number;
	private _labels!: HTMLElement[];
	private _updateLabelDisposable: IDisposable;

	get index(): number { return this._index; }
	get count(): number { return this.items.length; }
	get current(): ExplorerItem { return this.items[this._index]; }
	get currentId(): string { return `${this.id}_${this.index}`; }
	get labels(): HTMLElement[] { return this._labels; }

	private _onDidChange = new Emitter<void>();
	readonly onDidChange = this._onDidChange.event;

	constructor(private id: string, readonly items: ExplorerItem[], templateData: IFileTemplateData, private depth: number, private collapsed: boolean) {
		this._index = items.length - 1;

		this.updateLabels(templateData);
		this._updateLabelDisposable = templateData.label.onDidRender(() => this.updateLabels(templateData));
	}

	private updateLabels(templateData: IFileTemplateData): void {
		// eslint-disable-next-line no-restricted-syntax
		this._labels = Array.from(templateData.container.querySelectorAll('.label-name'));
		let parents = '';
		for (let i = 0; i < this.labels.length; i++) {
			const ariaLabel = parents.length ? `${this.items[i].name}, compact, ${parents}` : this.items[i].name;
			this.labels[i].setAttribute('aria-label', ariaLabel);
			this.labels[i].setAttribute('aria-level', `${this.depth + i}`);
			parents = parents.length ? `${this.items[i].name} ${parents}` : this.items[i].name;
		}
		this.updateCollapsed(this.collapsed);

		if (this._index < this.labels.length) {
			this.labels[this._index].classList.add('active');
		}
	}

	previous(): void {
		if (this._index <= 0) {
			return;
		}

		this.setIndex(this._index - 1);
	}

	next(): void {
		if (this._index >= this.items.length - 1) {
			return;
		}

		this.setIndex(this._index + 1);
	}

	first(): void {
		if (this._index === 0) {
			return;
		}

		this.setIndex(0);
	}

	last(): void {
		if (this._index === this.items.length - 1) {
			return;
		}

		this.setIndex(this.items.length - 1);
	}

	setIndex(index: number): void {
		if (index < 0 || index >= this.items.length) {
			return;
		}

		this.labels[this._index].classList.remove('active');
		this._index = index;
		this.labels[this._index].classList.add('active');

		this._onDidChange.fire();
	}

	updateCollapsed(collapsed: boolean): void {
		this.collapsed = collapsed;
		for (let i = 0; i < this.labels.length; i++) {
			this.labels[i].setAttribute('aria-expanded', collapsed ? 'false' : 'true');
		}
	}

	dispose(): void {
		this._onDidChange.dispose();
		this._updateLabelDisposable.dispose();
	}
}

export interface IFileTemplateData {
	readonly templateDisposables: DisposableStore;
	readonly elementDisposables: DisposableStore;
	readonly label: IResourceLabel;
	readonly container: HTMLElement;
	readonly contribs: IExplorerFileContribution[];
	currentContext?: ExplorerItem;
}

export class FilesRenderer implements ICompressibleTreeRenderer<ExplorerItem, FuzzyScore, IFileTemplateData>, IListAccessibilityProvider<ExplorerItem>, IDisposable {
	static readonly ID = 'file';

	private config: IFilesConfiguration;
	private configListener: IDisposable;
	private compressedNavigationControllers = new Map<ExplorerItem, CompressedNavigationController[]>();

	private _onDidChangeActiveDescendant = new EventMultiplexer<void>();
	readonly onDidChangeActiveDescendant = this._onDidChangeActiveDescendant.event;

	constructor(
		container: HTMLElement,
		private labels: ResourceLabels,
		private highlightTree: IExplorerFindHighlightTree,
		private updateWidth: (stat: ExplorerItem) => void,
		@IContextViewService private readonly contextViewService: IContextViewService,
		@IThemeService private readonly themeService: IThemeService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IExplorerService private readonly explorerService: IExplorerService,
		@ILabelService private readonly labelService: ILabelService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		this.config = this.configurationService.getValue<IFilesConfiguration>();

		const updateOffsetStyles = () => {
			const indent = this.configurationService.getValue<number>('workbench.tree.indent');
			const offset = Math.max(22 - indent, 0); // derived via inspection
			container.style.setProperty(`--vscode-explorer-align-offset-margin-left`, `${offset}px`);
		};

		this.configListener = this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('explorer')) {
				this.config = this.configurationService.getValue();
			}
			if (e.affectsConfiguration('workbench.tree.indent')) {
				updateOffsetStyles();
			}
		});

		updateOffsetStyles();
	}

	getWidgetAriaLabel(): string {
		return localize('treeAriaLabel', "Files Explorer");
	}

	get templateId(): string {
		return FilesRenderer.ID;
	}

	renderTemplate(container: HTMLElement): IFileTemplateData {
		const templateDisposables = new DisposableStore();
		const label = templateDisposables.add(this.labels.create(container, { supportHighlights: true }));
		templateDisposables.add(label.onDidRender(() => {
			// schedule this on the next animation frame to avoid rendering reentry
			DOM.scheduleAtNextAnimationFrame(DOM.getWindow(templateData.container), () => {
				try {
					if (templateData.currentContext) {
						this.updateWidth(templateData.currentContext);
					}
				} catch (e) {
					// noop since the element might no longer be in the tree, no update of width necessary
				}
			});
		}));

		const contribs = explorerFileContribRegistry.create(this.instantiationService, container, templateDisposables);
		templateDisposables.add(explorerFileContribRegistry.onDidRegisterDescriptor(d => {
			const contr = d.create(this.instantiationService, container);
			contribs.push(templateDisposables.add(contr));
			contr.setResource(templateData.currentContext?.resource);
		}));

		const templateData: IFileTemplateData = { templateDisposables, elementDisposables: templateDisposables.add(new DisposableStore()), label, container, contribs };
		return templateData;
	}

	renderElement(node: ITreeNode<ExplorerItem, FuzzyScore>, index: number, templateData: IFileTemplateData): void {
		const stat = node.element;
		templateData.currentContext = stat;

		const editableData = this.explorerService.getEditableData(stat);

		templateData.label.element.classList.remove('compressed');

		// File Label
		if (!editableData) {
			templateData.label.element.style.display = 'flex';
			this.renderStat(stat, stat.name, undefined, node.filterData, templateData);
		}

		// Input Box
		else {
			templateData.label.element.style.display = 'none';
			templateData.contribs.forEach(c => c.setResource(undefined));
			templateData.elementDisposables.add(this.renderInputBox(templateData.container, stat, editableData));
		}
	}

	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<ExplorerItem>, FuzzyScore>, index: number, templateData: IFileTemplateData): void {
		const stat = node.element.elements[node.element.elements.length - 1];
		templateData.currentContext = stat;

		const editable = node.element.elements.filter(e => this.explorerService.isEditable(e));
		const editableData = editable.length === 0 ? undefined : this.explorerService.getEditableData(editable[0]);

		// File Label
		if (!editableData) {
			templateData.label.element.classList.add('compressed');
			templateData.label.element.style.display = 'flex';

			const id = `compressed-explorer_${CompressedNavigationController.ID++}`;
			const labels = node.element.elements.map(e => e.name);

			// If there is a fuzzy score, we need to adjust the offset of the score
			// to align with the last stat of the compressed label
			let fuzzyScore = node.filterData;
			if (fuzzyScore && fuzzyScore.length > 2) {
				const filterDataOffset = labels.join('/').length - labels[labels.length - 1].length;
				fuzzyScore = [fuzzyScore[0], fuzzyScore[1] + filterDataOffset, ...fuzzyScore.slice(2)];
			}

			this.renderStat(stat, labels, id, fuzzyScore, templateData);

			const compressedNavigationController = new CompressedNavigationController(id, node.element.elements, templateData, node.depth, node.collapsed);
			templateData.elementDisposables.add(compressedNavigationController);

			const nodeControllers = this.compressedNavigationControllers.get(stat) ?? [];
			this.compressedNavigationControllers.set(stat, [...nodeControllers, compressedNavigationController]);

			// accessibility
			templateData.elementDisposables.add(this._onDidChangeActiveDescendant.add(compressedNavigationController.onDidChange));

			templateData.elementDisposables.add(DOM.addDisposableListener(templateData.container, 'mousedown', e => {
				const result = getIconLabelNameFromHTMLElement(e.target);

				if (result) {
					compressedNavigationController.setIndex(result.index);
				}
			}));

			templateData.elementDisposables.add(toDisposable(() => {
				const nodeControllers = this.compressedNavigationControllers.get(stat) ?? [];
				const renderedIndex = nodeControllers.findIndex(controller => controller === compressedNavigationController);

				if (renderedIndex < 0) {
					throw new Error('Disposing unknown navigation controller');
				}

				if (nodeControllers.length === 1) {
					this.compressedNavigationControllers.delete(stat);
				} else {
					nodeControllers.splice(renderedIndex, 1);
				}
			}));
		}

		// Input Box
		else {
			templateData.label.element.classList.remove('compressed');
			templateData.label.element.style.display = 'none';
			templateData.contribs.forEach(c => c.setResource(undefined));
			templateData.elementDisposables.add(this.renderInputBox(templateData.container, editable[0], editableData));
		}
	}

	private renderStat(stat: ExplorerItem, label: string | string[], domId: string | undefined, filterData: FuzzyScore | undefined, templateData: IFileTemplateData): void {
		templateData.label.element.style.display = 'flex';
		const extraClasses = ['explorer-item'];
		if (this.explorerService.isCut(stat)) {
			extraClasses.push('cut');
		}

		// Offset nested children unless folders have both chevrons and icons, otherwise alignment breaks
		const theme = this.themeService.getFileIconTheme();

		// Hack to always render chevrons for file nests, or else may not be able to identify them.
		// eslint-disable-next-line no-restricted-syntax
		const twistieContainer = templateData.container.parentElement?.parentElement?.querySelector('.monaco-tl-twistie');
		twistieContainer?.classList.toggle('force-twistie', stat.hasNests && theme.hidesExplorerArrows);

		// when explorer arrows are hidden or there are no folder icons, nests get misaligned as they are forced to have arrows and files typically have icons
		// Apply some CSS magic to get things looking as reasonable as possible.
		const themeIsUnhappyWithNesting = theme.hasFileIcons && (theme.hidesExplorerArrows || !theme.hasFolderIcons);
		const realignNestedChildren = stat.nestedParent && themeIsUnhappyWithNesting;
		templateData.contribs.forEach(c => c.setResource(stat.resource));
		templateData.label.setResource({ resource: stat.resource, name: label }, {
			fileKind: stat.isRoot ? FileKind.ROOT_FOLDER : stat.isDirectory ? FileKind.FOLDER : FileKind.FILE,
			extraClasses: realignNestedChildren ? [...extraClasses, 'align-nest-icon-with-parent-icon'] : extraClasses,
			fileDecorations: this.config.explorer.decorations,
			matches: createMatches(filterData),
			separator: this.labelService.getSeparator(stat.resource.scheme, stat.resource.authority),
			domId
		});

		const highlightResults = stat.isDirectory ? this.highlightTree.get(stat) : 0;
		if (highlightResults > 0) {
			const badge = new CountBadge(templateData.label.element.lastElementChild as HTMLElement, {}, { ...defaultCountBadgeStyles, badgeBackground: asCssVariable(listFilterMatchHighlight), badgeBorder: asCssVariable(listFilterMatchHighlightBorder) });
			badge.setCount(highlightResults);
			badge.setTitleFormat(localize('explorerHighlightFolderBadgeTitle', "Directory contains {0} matches", highlightResults));
			templateData.elementDisposables.add(badge);
		}
		templateData.label.element.classList.toggle('highlight-badge', highlightResults > 0);
	}

	private renderInputBox(container: HTMLElement, stat: ExplorerItem, editableData: IEditableData): IDisposable {

		// Use a file label only for the icon next to the input box
		const label = this.labels.create(container);
		const extraClasses = ['explorer-item', 'explorer-item-edited'];
		const fileKind = stat.isRoot ? FileKind.ROOT_FOLDER : stat.isDirectory ? FileKind.FOLDER : FileKind.FILE;

		const theme = this.themeService.getFileIconTheme();
		const themeIsUnhappyWithNesting = theme.hasFileIcons && (theme.hidesExplorerArrows || !theme.hasFolderIcons);
		const realignNestedChildren = stat.nestedParent && themeIsUnhappyWithNesting;

		const labelOptions: IFileLabelOptions = {
			hidePath: true,
			hideLabel: true,
			fileKind,
			extraClasses: realignNestedChildren ? [...extraClasses, 'align-nest-icon-with-parent-icon'] : extraClasses,
		};


		const parent = stat.name ? dirname(stat.resource) : stat.resource;
		const value = stat.name || '';

		label.setFile(joinPath(parent, value || ' '), labelOptions); // Use icon for ' ' if name is empty.

		// hack: hide label
		(label.element.firstElementChild as HTMLElement).style.display = 'none';

		// Input field for name
		const inputBox = new InputBox(label.element, this.contextViewService, {
			validationOptions: {
				validation: (value) => {
					const message = editableData.validationMessage(value);
					if (!message || message.severity !== Severity.Error) {
						return null;
					}

					return {
						content: message.content,
						formatContent: true,
						type: MessageType.ERROR
					};
				}
			},
			ariaLabel: localize('fileInputAriaLabel', "Type file name. Press Enter to confirm or Escape to cancel."),
			inputBoxStyles: defaultInputBoxStyles,
		});

		const lastDot = value.lastIndexOf('.');
		let currentSelectionState = 'prefix';

		inputBox.value = value;
		inputBox.focus();
		inputBox.select({ start: 0, end: lastDot > 0 && !stat.isDirectory ? lastDot : value.length });

		const done = createSingleCallFunction((success: boolean, finishEditing: boolean) => {
			label.element.style.display = 'none';
			const value = inputBox.value;
			dispose(toDispose);
			label.element.remove();
			if (finishEditing) {
				editableData.onFinish(value, success);
			}
		});

		const showInputBoxNotification = () => {
			if (inputBox.isInputValid()) {
				const message = editableData.validationMessage(inputBox.value);
				if (message) {
					inputBox.showMessage({
						content: message.content,
						formatContent: true,
						type: message.severity === Severity.Info ? MessageType.INFO : message.severity === Severity.Warning ? MessageType.WARNING : MessageType.ERROR
					});
				} else {
					inputBox.hideMessage();
				}
			}
		};
		showInputBoxNotification();

		const toDispose = [
			inputBox,
			inputBox.onDidChange(value => {
				label.setFile(joinPath(parent, value || ' '), labelOptions); // update label icon while typing!
			}),
			DOM.addStandardDisposableListener(inputBox.inputElement, DOM.EventType.KEY_DOWN, (e: IKeyboardEvent) => {
				if (e.equals(KeyCode.F2)) {
					const dotIndex = inputBox.value.lastIndexOf('.');
					if (stat.isDirectory || dotIndex === -1) {
						return;
					}
					if (currentSelectionState === 'prefix') {
						currentSelectionState = 'all';
						inputBox.select({ start: 0, end: inputBox.value.length });
					} else if (currentSelectionState === 'all') {
						currentSelectionState = 'suffix';
						inputBox.select({ start: dotIndex + 1, end: inputBox.value.length });
					} else {
						currentSelectionState = 'prefix';
						inputBox.select({ start: 0, end: dotIndex });
					}
				} else if (e.equals(KeyCode.Enter)) {
					if (!inputBox.validate()) {
						done(true, true);
					}
				} else if (e.equals(KeyCode.Escape)) {
					done(false, true);
				}
			}),
			DOM.addStandardDisposableListener(inputBox.inputElement, DOM.EventType.KEY_UP, (e: IKeyboardEvent) => {
				showInputBoxNotification();
			}),
			DOM.addDisposableListener(inputBox.inputElement, DOM.EventType.BLUR, async () => {
				while (true) {
					await timeout(0);

					const ownerDocument = inputBox.inputElement.ownerDocument;
					if (!ownerDocument.hasFocus()) {
						break;
					} if (DOM.isActiveElement(inputBox.inputElement)) {
						return;
					} else if (DOM.isHTMLElement(ownerDocument.activeElement) && DOM.hasParentWithClass(ownerDocument.activeElement, 'context-view')) {
						await Event.toPromise(this.contextMenuService.onDidHideContextMenu);
					} else {
						break;
					}
				}

				done(inputBox.isInputValid(), true);
			}),
			label
		];

		return toDisposable(() => {
			done(false, false);
		});
	}

	disposeElement(element: ITreeNode<ExplorerItem, FuzzyScore>, index: number, templateData: IFileTemplateData): void {
		templateData.currentContext = undefined;
		templateData.elementDisposables.clear();
	}

	disposeCompressedElements(node: ITreeNode<ICompressedTreeNode<ExplorerItem>, FuzzyScore>, index: number, templateData: IFileTemplateData): void {
		templateData.currentContext = undefined;
		templateData.elementDisposables.clear();
	}

	disposeTemplate(templateData: IFileTemplateData): void {
		templateData.templateDisposables.dispose();
	}

	getCompressedNavigationController(stat: ExplorerItem): ICompressedNavigationController[] | undefined {
		return this.compressedNavigationControllers.get(stat);
	}

	// IAccessibilityProvider

	getAriaLabel(element: ExplorerItem): string {
		return element.name;
	}

	getAriaLevel(element: ExplorerItem): number {
		// We need to comput aria level on our own since children of compact folders will otherwise have an incorrect level	#107235
		let depth = 0;
		let parent = element.parent;
		while (parent) {
			parent = parent.parent;
			depth++;
		}

		if (this.contextService.getWorkbenchState() === WorkbenchState.WORKSPACE) {
			depth = depth + 1;
		}

		return depth;
	}

	getActiveDescendantId(stat: ExplorerItem): string | undefined {
		return this.compressedNavigationControllers.get(stat)?.[0]?.currentId ?? undefined;
	}

	dispose(): void {
		this.configListener.dispose();
	}
}

interface CachedParsedExpression {
	original: glob.IExpression;
	parsed: glob.ParsedExpression;
}

/**
 * Respects files.exclude setting in filtering out content from the explorer.
 * Makes sure that visible editors are always shown in the explorer even if they are filtered out by settings.
 */
export class FilesFilter implements ITreeFilter<ExplorerItem, FuzzyScore> {
	private hiddenExpressionPerRoot = new Map<string, CachedParsedExpression>();
	private editorsAffectingFilter = new Set<EditorInput>();
	private _onDidChange = new Emitter<void>();
	private toDispose: IDisposable[] = [];
	// List of ignoreFile resources. Used to detect changes to the ignoreFiles.
	private ignoreFileResourcesPerRoot = new Map<string, ResourceSet>();
	// Ignore tree per root. Similar to `hiddenExpressionPerRoot`
	// Note: URI in the ternary search tree is the URI of the folder containing the ignore file
	// It is not the ignore file itself. This is because of the way the IgnoreFile works and nested paths
	private ignoreTreesPerRoot = new Map<string, TernarySearchTree<URI, IgnoreFile>>();

	constructor(
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IExplorerService private readonly explorerService: IExplorerService,
		@IEditorService private readonly editorService: IEditorService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IFileService private readonly fileService: IFileService
	) {
		this.toDispose.push(this.contextService.onDidChangeWorkspaceFolders(() => this.updateConfiguration()));
		this.toDispose.push(this.configurationService.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration('files.exclude') || e.affectsConfiguration('explorer.excludeGitIgnore')) {
				this.updateConfiguration();
			}
		}));
		this.toDispose.push(this.fileService.onDidFilesChange(e => {
			// Check to see if the update contains any of the ignoreFileResources
			for (const [root, ignoreFileResourceSet] of this.ignoreFileResourcesPerRoot.entries()) {
				ignoreFileResourceSet.forEach(async ignoreResource => {
					if (e.contains(ignoreResource, FileChangeType.UPDATED)) {
						await this.processIgnoreFile(root, ignoreResource, true);
					}
					if (e.contains(ignoreResource, FileChangeType.DELETED)) {
						this.ignoreTreesPerRoot.get(root)?.delete(dirname(ignoreResource));
						ignoreFileResourceSet.delete(ignoreResource);
						this._onDidChange.fire();
					}
				});
			}
		}));
		this.toDispose.push(this.editorService.onDidVisibleEditorsChange(() => {
			const editors = this.editorService.visibleEditors;
			let shouldFire = false;

			for (const e of editors) {
				if (!e.resource) {
					continue;
				}

				const stat = this.explorerService.findClosest(e.resource);
				if (stat?.isExcluded) {
					// A filtered resource suddenly became visible since user opened an editor
					shouldFire = true;
					break;
				}
			}

			for (const e of this.editorsAffectingFilter) {
				if (!editors.includes(e)) {
					// Editor that was affecting filtering is no longer visible
					shouldFire = true;
					break;
				}
			}

			if (shouldFire) {
				this.editorsAffectingFilter.clear();
				this._onDidChange.fire();
			}
		}));
		this.updateConfiguration();
	}

	get onDidChange(): Event<void> {
		return this._onDidChange.event;
	}

	private updateConfiguration(): void {
		let shouldFire = false;
		let updatedGitIgnoreSetting = false;
		this.contextService.getWorkspace().folders.forEach(folder => {
			const configuration = this.configurationService.getValue<IFilesConfiguration>({ resource: folder.uri });
			const excludesConfig: glob.IExpression = configuration?.files?.exclude || Object.create(null);
			const parseIgnoreFile: boolean = configuration.explorer.excludeGitIgnore;

			// If we should be parsing ignoreFiles for this workspace and don't have an ignore tree initialize one
			if (parseIgnoreFile && !this.ignoreTreesPerRoot.has(folder.uri.toString())) {
				updatedGitIgnoreSetting = true;
				this.ignoreFileResourcesPerRoot.set(folder.uri.toString(), new ResourceSet());
				this.ignoreTreesPerRoot.set(folder.uri.toString(), TernarySearchTree.forUris((uri) => this.uriIdentityService.extUri.ignorePathCasing(uri)));
			}

			// If we shouldn't be parsing ignore files but have an ignore tree, clear the ignore tree
			if (!parseIgnoreFile && this.ignoreTreesPerRoot.has(folder.uri.toString())) {
				updatedGitIgnoreSetting = true;
				this.ignoreFileResourcesPerRoot.delete(folder.uri.toString());
				this.ignoreTreesPerRoot.delete(folder.uri.toString());
			}

			if (!shouldFire) {
				const cached = this.hiddenExpressionPerRoot.get(folder.uri.toString());
				shouldFire = !cached || !equals(cached.original, excludesConfig);
			}

			const excludesConfigCopy = deepClone(excludesConfig); // do not keep the config, as it gets mutated under our hoods

			this.hiddenExpressionPerRoot.set(folder.uri.toString(), { original: excludesConfigCopy, parsed: glob.parse(excludesConfigCopy) });
		});

		if (shouldFire || updatedGitIgnoreSetting) {
			this.editorsAffectingFilter.clear();
			this._onDidChange.fire();
		}
	}

	/**
	 * Given a .gitignore file resource, processes the resource and adds it to the ignore tree which hides explorer items
	 * @param root The root folder of the workspace as a string. Used for lookup key for ignore tree and resource list
	 * @param ignoreFileResource The resource of the .gitignore file
	 * @param update Whether or not we're updating an existing ignore file. If true it deletes the old entry
	 */
	private async processIgnoreFile(root: string, ignoreFileResource: URI, update?: boolean) {
		// Get the name of the directory which the ignore file is in
		const dirUri = dirname(ignoreFileResource);
		const ignoreTree = this.ignoreTreesPerRoot.get(root);
		if (!ignoreTree) {
			return;
		}

		// Don't process a directory if we already have it in the tree
		if (!update && ignoreTree.has(dirUri)) {
			return;
		}
		// Maybe we need a cancellation token here in case it's super long?
		const content = await this.fileService.readFile(ignoreFileResource);

		// If it's just an update we update the contents keeping all references the same
		if (update) {
			const ignoreFile = ignoreTree.get(dirUri);
			ignoreFile?.updateContents(content.value.toString());
		} else {
			// Otherwise we create a new ignorefile and add it to the tree
			const ignoreParent = ignoreTree.findSubstr(dirUri);
			const ignoreFile = new IgnoreFile(content.value.toString(), dirUri.path, ignoreParent);
			ignoreTree.set(dirUri, ignoreFile);
			// If we haven't seen this resource before then we need to add it to the list of resources we're tracking
			if (!this.ignoreFileResourcesPerRoot.get(root)?.has(ignoreFileResource)) {
				this.ignoreFileResourcesPerRoot.get(root)?.add(ignoreFileResource);
			}
		}

		// Notify the explorer of the change so we may ignore these files
		this._onDidChange.fire();
	}

	filter(stat: ExplorerItem, parentVisibility: TreeVisibility): boolean {
		// Add newly visited .gitignore files to the ignore tree
		if (stat.name === '.gitignore' && this.ignoreTreesPerRoot.has(stat.root.resource.toString())) {
			this.processIgnoreFile(stat.root.resource.toString(), stat.resource, false);
			return true;
		}

		return this.isVisible(stat, parentVisibility);
	}

	private isVisible(stat: ExplorerItem, parentVisibility: TreeVisibility): boolean {
		stat.isExcluded = false;
		if (parentVisibility === TreeVisibility.Hidden) {
			stat.isExcluded = true;
			return false;
		}
		if (this.explorerService.getEditableData(stat)) {
			return true; // always visible
		}

		// Hide those that match Hidden Patterns
		const cached = this.hiddenExpressionPerRoot.get(stat.root.resource.toString());
		const globMatch = cached?.parsed(path.relative(stat.root.resource.path, stat.resource.path), stat.name, name => !!(stat.parent?.getChild(name)));
		// Small optimization to only run isHiddenResource (traverse gitIgnore) if the globMatch from fileExclude returned nothing
		const isHiddenResource = globMatch ? true : this.isIgnored(stat.resource, stat.root.resource, stat.isDirectory);
		if (isHiddenResource || stat.parent?.isExcluded) {
			stat.isExcluded = true;
			const editors = this.editorService.visibleEditors;
			const editor = editors.find(e => e.resource && this.uriIdentityService.extUri.isEqualOrParent(e.resource, stat.resource));
			if (editor && stat.root === this.explorerService.findClosestRoot(stat.resource)) {
				this.editorsAffectingFilter.add(editor);
				return true; // Show all opened files and their parents
			}

			return false; // hidden through pattern
		}

		return true;
	}

	isIgnored(resource: URI, rootResource: URI, isDirectory: boolean): boolean {
		const ignoreFile = this.ignoreTreesPerRoot.get(rootResource.toString())?.findSubstr(resource);
		const isIncludedInTraversal = ignoreFile?.isPathIncludedInTraversal(resource.path, isDirectory);

		// Doing !undefined returns true and we want it to be false when undefined because that means it's not included in the ignore file
		return isIncludedInTraversal === undefined ? false : !isIncludedInTraversal;
	}

	dispose(): void {
		dispose(this.toDispose);
	}
}

// Explorer Sorter
export class FileSorter implements ITreeSorter<ExplorerItem> {

	constructor(
		@IExplorerService private readonly explorerService: IExplorerService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService
	) { }

	compare(statA: ExplorerItem, statB: ExplorerItem): number {
		// Do not sort roots
		if (statA.isRoot) {
			if (statB.isRoot) {
				const workspaceA = this.contextService.getWorkspaceFolder(statA.resource);
				const workspaceB = this.contextService.getWorkspaceFolder(statB.resource);
				return workspaceA && workspaceB ? (workspaceA.index - workspaceB.index) : -1;
			}

			return -1;
		}

		if (statB.isRoot) {
			return 1;
		}

		const sortOrder = this.explorerService.sortOrderConfiguration.sortOrder;
		const lexicographicOptions = this.explorerService.sortOrderConfiguration.lexicographicOptions;
		const reverse = this.explorerService.sortOrderConfiguration.reverse;
		if (reverse) {
			[statA, statB] = [statB, statA];
		}

		let compareFileNames;
		let compareFileExtensions;
		switch (lexicographicOptions) {
			case 'upper':
				compareFileNames = compareFileNamesUpper;
				compareFileExtensions = compareFileExtensionsUpper;
				break;
			case 'lower':
				compareFileNames = compareFileNamesLower;
				compareFileExtensions = compareFileExtensionsLower;
				break;
			case 'unicode':
				compareFileNames = compareFileNamesUnicode;
				compareFileExtensions = compareFileExtensionsUnicode;
				break;
			default:
				// 'default'
				compareFileNames = compareFileNamesDefault;
				compareFileExtensions = compareFileExtensionsDefault;
		}

		// Sort Directories
		switch (sortOrder) {
			case 'type':
				if (statA.isDirectory && !statB.isDirectory) {
					return -1;
				}

				if (statB.isDirectory && !statA.isDirectory) {
					return 1;
				}

				if (statA.isDirectory && statB.isDirectory) {
					return compareFileNames(statA.name, statB.name);
				}

				break;

			case 'filesFirst':
				if (statA.isDirectory && !statB.isDirectory) {
					return 1;
				}

				if (statB.isDirectory && !statA.isDirectory) {
					return -1;
				}

				break;

			case 'foldersNestsFiles':
				if (statA.isDirectory && !statB.isDirectory) {
					return -1;
				}

				if (statB.isDirectory && !statA.isDirectory) {
					return 1;
				}

				if (statA.hasNests && !statB.hasNests) {
					return -1;
				}

				if (statB.hasNests && !statA.hasNests) {
					return 1;
				}

				break;

			case 'mixed':
				break; // not sorting when "mixed" is on

			default: /* 'default', 'modified' */
				if (statA.isDirectory && !statB.isDirectory) {
					return -1;
				}

				if (statB.isDirectory && !statA.isDirectory) {
					return 1;
				}

				break;
		}

		// Sort Files
		switch (sortOrder) {
			case 'type':
				return compareFileExtensions(statA.name, statB.name);

			case 'modified':
				if (statA.mtime !== statB.mtime) {
					return (statA.mtime && statB.mtime && statA.mtime < statB.mtime) ? 1 : -1;
				}

				return compareFileNames(statA.name, statB.name);

			default: /* 'default', 'mixed', 'filesFirst' */
				return compareFileNames(statA.name, statB.name);
		}
	}
}

export class FileDragAndDrop implements ITreeDragAndDrop<ExplorerItem> {
	private static readonly CONFIRM_DND_SETTING_KEY = 'explorer.confirmDragAndDrop';

	private compressedDragOverElement: HTMLElement | undefined;
	private compressedDropTargetDisposable: IDisposable = Disposable.None;

	private readonly disposables = new DisposableStore();
	private dropEnabled = false;

	constructor(
		private isCollapsed: (item: ExplorerItem) => boolean,
		@IExplorerService private explorerService: IExplorerService,
		@IEditorService private editorService: IEditorService,
		@IDialogService private dialogService: IDialogService,
		@IWorkspaceContextService private contextService: IWorkspaceContextService,
		@IFileService private fileService: IFileService,
		@IConfigurationService private configurationService: IConfigurationService,
		@IInstantiationService private instantiationService: IInstantiationService,
		@IWorkspaceEditingService private workspaceEditingService: IWorkspaceEditingService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService
	) {
		const updateDropEnablement = (e: IConfigurationChangeEvent | undefined) => {
			if (!e || e.affectsConfiguration('explorer.enableDragAndDrop')) {
				this.dropEnabled = this.configurationService.getValue('explorer.enableDragAndDrop');
			}
		};
		updateDropEnablement(undefined);
		this.disposables.add(this.configurationService.onDidChangeConfiguration(e => updateDropEnablement(e)));
	}

	onDragOver(data: IDragAndDropData, target: ExplorerItem | undefined, targetIndex: number | undefined, targetSector: ListViewTargetSector | undefined, originalEvent: DragEvent): boolean | ITreeDragOverReaction {
		if (!this.dropEnabled) {
			return false;
		}

		// Compressed folders
		if (target) {
			const compressedTarget = FileDragAndDrop.getCompressedStatFromDragEvent(target, originalEvent);

			if (compressedTarget) {
				const iconLabelName = getIconLabelNameFromHTMLElement(originalEvent.target);

				if (iconLabelName && iconLabelName.index < iconLabelName.count - 1) {
					const result = this.handleDragOver(data, compressedTarget, targetIndex, targetSector, originalEvent);

					if (result) {
						if (iconLabelName.element !== this.compressedDragOverElement) {
							this.compressedDragOverElement = iconLabelName.element;
							this.compressedDropTargetDisposable.dispose();
							this.compressedDropTargetDisposable = toDisposable(() => {
								iconLabelName.element.classList.remove('drop-target');
								this.compressedDragOverElement = undefined;
							});

							iconLabelName.element.classList.add('drop-target');
						}

						return typeof result === 'boolean' ? result : { ...result, feedback: [] };
					}

					this.compressedDropTargetDisposable.dispose();
					return false;
				}
			}
		}

		this.compressedDropTargetDisposable.dispose();
		return this.handleDragOver(data, target, targetIndex, targetSector, originalEvent);
	}

	private handleDragOver(data: IDragAndDropData, target: ExplorerItem | undefined, targetIndex: number | undefined, targetSector: ListViewTargetSector | undefined, originalEvent: DragEvent): boolean | ITreeDragOverReaction {
		const isCopy = originalEvent && ((originalEvent.ctrlKey && !isMacintosh) || (originalEvent.altKey && isMacintosh));
		const isNative = data instanceof NativeDragAndDropData;
		const effectType = (isNative || isCopy) ? ListDragOverEffectType.Copy : ListDragOverEffectType.Move;
		const effect = { type: effectType, position: ListDragOverEffectPosition.Over };

		// Native DND
		if (isNative) {
			if (!containsDragType(originalEvent, DataTransfers.FILES, CodeDataTransfers.FILES, DataTransfers.RESOURCES)) {
				return false;
			}
		}

		// Other-Tree DND
		else if (data instanceof ExternalElementsDragAndDropData) {
			return false;
		}

		// In-Explorer DND
		else {
			const items = FileDragAndDrop.getStatsFromDragAndDropData(data as ElementsDragAndDropData<ExplorerItem, ExplorerItem[]>);
			const isRootsReorder = items.every(item => item.isRoot);

			if (!target) {
				// Dropping onto the empty area. Do not accept if items dragged are already
				// children of the root unless we are copying the file
				if (!isCopy && items.every(i => !!i.parent && i.parent.isRoot)) {
					return false;
				}

				// root is added after last root folder when hovering on empty background
				if (isRootsReorder) {
					return { accept: true, effect: { type: ListDragOverEffectType.Move, position: ListDragOverEffectPosition.After } };
				}

				return { accept: true, bubble: TreeDragOverBubble.Down, effect, autoExpand: false };
			}

			if (!Array.isArray(items)) {
				return false;
			}

			if (!isCopy && items.every((source) => source.isReadonly)) {
				return false; // Cannot move readonly items unless we copy
			}

			if (items.some((source) => {
				if (source.isRoot) {
					return false; // Root folders are handled seperately
				}

				if (this.uriIdentityService.extUri.isEqual(source.resource, target.resource)) {
					return true; // Can not move anything onto itself excpet for root folders
				}

				if (!isCopy && this.uriIdentityService.extUri.isEqual(dirname(source.resource), target.resource)) {
					return true; // Can not move a file to the same parent unless we copy
				}

				if (this.uriIdentityService.extUri.isEqualOrParent(target.resource, source.resource)) {
					return true; // Can not move a parent folder into one of its children
				}

				return false;
			})) {
				return false;
			}

			// reordering roots
			if (isRootsReorder) {
				if (!target.isRoot) {
					return false;
				}

				let dropEffectPosition: ListDragOverEffectPosition | undefined = undefined;
				switch (targetSector) {
					case ListViewTargetSector.TOP:
					case ListViewTargetSector.CENTER_TOP:
						dropEffectPosition = ListDragOverEffectPosition.Before; break;
					case ListViewTargetSector.CENTER_BOTTOM:
					case ListViewTargetSector.BOTTOM:
						dropEffectPosition = ListDragOverEffectPosition.After; break;
				}
				return { accept: true, effect: { type: ListDragOverEffectType.Move, position: dropEffectPosition } };
			}
		}

		// All (target = model)
		if (!target) {
			return { accept: true, bubble: TreeDragOverBubble.Down, effect };
		}

		// All (target = file/folder)
		else {
			if (target.isDirectory) {
				if (target.isReadonly) {
					return false;
				}

				return { accept: true, bubble: TreeDragOverBubble.Down, effect, autoExpand: true };
			}

			if (this.contextService.getWorkspace().folders.every(folder => folder.uri.toString() !== target.resource.toString())) {
				return { accept: true, bubble: TreeDragOverBubble.Up, effect };
			}
		}

		return false;
	}

	getDragURI(element: ExplorerItem): string | null {
		if (this.explorerService.isEditable(element)) {
			return null;
		}

		return element.resource.toString();
	}

	getDragLabel(elements: ExplorerItem[], originalEvent: DragEvent): string | undefined {
		if (elements.length === 1) {
			const stat = FileDragAndDrop.getCompressedStatFromDragEvent(elements[0], originalEvent);
			return stat.name;
		}

		return String(elements.length);
	}

	onDragStart(data: IDragAndDropData, originalEvent: DragEvent): void {
		const items = FileDragAndDrop.getStatsFromDragAndDropData(data as ElementsDragAndDropData<ExplorerItem, ExplorerItem[]>, originalEvent);
		if (items.length && originalEvent.dataTransfer) {
			// Apply some datatransfer types to allow for dragging the element outside of the application
			this.instantiationService.invokeFunction(accessor => fillEditorsDragData(accessor, items, originalEvent));

			// The only custom data transfer we set from the explorer is a file transfer
			// to be able to DND between multiple code file explorers across windows
			const fileResources = items.filter(s => s.resource.scheme === Schemas.file).map(r => r.resource.fsPath);
			if (fileResources.length) {
				originalEvent.dataTransfer.setData(CodeDataTransfers.FILES, JSON.stringify(fileResources));
			}
		}
	}

	async drop(data: IDragAndDropData, target: ExplorerItem | undefined, targetIndex: number | undefined, targetSector: ListViewTargetSector | undefined, originalEvent: DragEvent): Promise<void> {
		this.compressedDropTargetDisposable.dispose();

		// Find compressed target
		if (target) {
			const compressedTarget = FileDragAndDrop.getCompressedStatFromDragEvent(target, originalEvent);

			if (compressedTarget) {
				target = compressedTarget;
			}
		}

		// Find parent to add to
		if (!target) {
			target = this.explorerService.roots[this.explorerService.roots.length - 1];
			targetSector = ListViewTargetSector.BOTTOM;
		}
		if (!target.isDirectory && target.parent) {
			target = target.parent;
		}
		if (target.isReadonly) {
			return;
		}
		const resolvedTarget = target;
		if (!resolvedTarget) {
			return;
		}

		try {

			// External file DND (Import/Upload file)
			if (data instanceof NativeDragAndDropData) {
				// Use local file import when supported
				if (!isWeb || (isTemporaryWorkspace(this.contextService.getWorkspace()) && WebFileSystemAccess.supported(mainWindow))) {
					const fileImport = this.instantiationService.createInstance(ExternalFileImport);
					await fileImport.import(resolvedTarget, originalEvent, mainWindow);
				}
				// Otherwise fallback to browser based file upload
				else {
					const browserUpload = this.instantiationService.createInstance(BrowserFileUpload);
					await browserUpload.upload(target, originalEvent);
				}
			}

			// In-Explorer DND (Move/Copy file)
			else {
				await this.handleExplorerDrop(data as ElementsDragAndDropData<ExplorerItem, ExplorerItem[]>, resolvedTarget, targetIndex, targetSector, originalEvent);
			}
		} catch (error) {
			this.dialogService.error(toErrorMessage(error));
		}
	}

	private async handleExplorerDrop(data: ElementsDragAndDropData<ExplorerItem, ExplorerItem[]>, target: ExplorerItem, targetIndex: number | undefined, targetSector: ListViewTargetSector | undefined, originalEvent: DragEvent): Promise<void> {
		const elementsData = FileDragAndDrop.getStatsFromDragAndDropData(data);
		const distinctItems = new Map(elementsData.map(element => [element, this.isCollapsed(element)]));

		for (const [item, collapsed] of distinctItems) {
			if (collapsed) {
				const nestedChildren = item.nestedChildren;
				if (nestedChildren) {
					for (const child of nestedChildren) {
						// if parent is collapsed, then the nested children is considered collapsed to operate as a group
						// and skip collapsed state check since they're not in the tree
						distinctItems.set(child, true);
					}
				}
			}
		}

		const items = distinctParents([...distinctItems.keys()], s => s.resource);
		const isCopy = (originalEvent.ctrlKey && !isMacintosh) || (originalEvent.altKey && isMacintosh);

		// Handle confirm setting
		const confirmDragAndDrop = !isCopy && this.configurationService.getValue<boolean>(FileDragAndDrop.CONFIRM_DND_SETTING_KEY);
		if (confirmDragAndDrop) {
			const message = items.length > 1 && items.every(s => s.isRoot) ? localize('confirmRootsMove', "Are you sure you want to change the order of multiple root folders in your workspace?")
				: items.length > 1 ? localize('confirmMultiMove', "Are you sure you want to move the following {0} files into '{1}'?", items.length, target.name)
					: items[0].isRoot ? localize('confirmRootMove', "Are you sure you want to change the order of root folder '{0}' in your workspace?", items[0].name)
						: localize('confirmMove', "Are you sure you want to move '{0}' into '{1}'?", items[0].name, target.name);
			const detail = items.length > 1 && !items.every(s => s.isRoot) ? getFileNamesMessage(items.map(i => i.resource)) : undefined;

			const confirmation = await this.dialogService.confirm({
				message,
				detail,
				checkbox: {
					label: localize('doNotAskAgain', "Do not ask me again")
				},
				primaryButton: localize({ key: 'moveButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Move")
			});

			if (!confirmation.confirmed) {
				return;
			}

			// Check for confirmation checkbox
			if (confirmation.checkboxChecked === true) {
				await this.configurationService.updateValue(FileDragAndDrop.CONFIRM_DND_SETTING_KEY, false);
			}
		}

		await this.doHandleRootDrop(items.filter(s => s.isRoot), target, targetSector);

		const sources = items.filter(s => !s.isRoot);
		if (isCopy) {
			return this.doHandleExplorerDropOnCopy(sources, target);
		}

		return this.doHandleExplorerDropOnMove(sources, target);
	}

	private async doHandleRootDrop(roots: ExplorerItem[], target: ExplorerItem, targetSector: ListViewTargetSector | undefined): Promise<void> {
		if (roots.length === 0) {
			return;
		}

		const folders = this.contextService.getWorkspace().folders;
		let targetIndex: number | undefined;
		const sourceIndices: number[] = [];
		const workspaceCreationData: IWorkspaceFolderCreationData[] = [];
		const rootsToMove: IWorkspaceFolderCreationData[] = [];

		for (let index = 0; index < folders.length; index++) {
			const data = {
				uri: folders[index].uri,
				name: folders[index].name
			};

			// Is current target
			if (target instanceof ExplorerItem && this.uriIdentityService.extUri.isEqual(folders[index].uri, target.resource)) {
				targetIndex = index;
			}

			// Is current source
			for (const root of roots) {
				if (this.uriIdentityService.extUri.isEqual(folders[index].uri, root.resource)) {
					sourceIndices.push(index);
					break;
				}
			}

			if (roots.every(r => r.resource.toString() !== folders[index].uri.toString())) {
				workspaceCreationData.push(data);
			} else {
				rootsToMove.push(data);
			}
		}
		if (targetIndex === undefined) {
			targetIndex = workspaceCreationData.length;
		} else {
			switch (targetSector) {
				case ListViewTargetSector.BOTTOM:
				case ListViewTargetSector.CENTER_BOTTOM:
					targetIndex++;
					break;
			}
			// Adjust target index if source was located before target.
			// The move will cause the index to change
			for (const sourceIndex of sourceIndices) {
				if (sourceIndex < targetIndex) {
					targetIndex--;
				}
			}
		}

		workspaceCreationData.splice(targetIndex, 0, ...rootsToMove);

		return this.workspaceEditingService.updateFolders(0, workspaceCreationData.length, workspaceCreationData);
	}

	private async doHandleExplorerDropOnCopy(sources: ExplorerItem[], target: ExplorerItem): Promise<void> {

		// Reuse duplicate action when user copies
		const explorerConfig = this.configurationService.getValue<IFilesConfiguration>().explorer;
		const resourceFileEdits: ResourceFileEdit[] = [];
		for (const { resource, isDirectory } of sources) {
			const allowOverwrite = explorerConfig.incrementalNaming === 'disabled';
			const newResource = await findValidPasteFileTarget(this.explorerService,
				this.fileService,
				this.dialogService,
				target,
				{ resource, isDirectory, allowOverwrite },
				explorerConfig.incrementalNaming
			);
			if (!newResource) {
				continue;
			}
			const resourceEdit = new ResourceFileEdit(resource, newResource, { copy: true, overwrite: allowOverwrite });
			resourceFileEdits.push(resourceEdit);
		}
		const labelSuffix = getFileOrFolderLabelSuffix(sources);
		await this.explorerService.applyBulkEdit(resourceFileEdits, {
			confirmBeforeUndo: explorerConfig.confirmUndo === UndoConfirmLevel.Default || explorerConfig.confirmUndo === UndoConfirmLevel.Verbose,
			undoLabel: localize('copy', "Copy {0}", labelSuffix),
			progressLabel: localize('copying', "Copying {0}", labelSuffix),
		});

		const editors = resourceFileEdits.filter(edit => {
			const item = edit.newResource ? this.explorerService.findClosest(edit.newResource) : undefined;
			return item && !item.isDirectory;
		}).map(edit => ({ resource: edit.newResource, options: { pinned: true } }));

		await this.editorService.openEditors(editors);
	}

	private async doHandleExplorerDropOnMove(sources: ExplorerItem[], target: ExplorerItem): Promise<void> {

		// Do not allow moving readonly items
		const resourceFileEdits = sources.filter(source => !source.isReadonly).map(source => new ResourceFileEdit(source.resource, joinPath(target.resource, source.name)));
		const labelSuffix = getFileOrFolderLabelSuffix(sources);
		const options = {
			confirmBeforeUndo: this.configurationService.getValue<IFilesConfiguration>().explorer.confirmUndo === UndoConfirmLevel.Verbose,
			undoLabel: localize('move', "Move {0}", labelSuffix),
			progressLabel: localize('moving', "Moving {0}", labelSuffix)
		};

		try {
			await this.explorerService.applyBulkEdit(resourceFileEdits, options);
		} catch (error) {

			// Conflict
			if ((<FileOperationError>error).fileOperationResult === FileOperationResult.FILE_MOVE_CONFLICT) {

				const overwrites: URI[] = [];
				for (const edit of resourceFileEdits) {
					if (edit.newResource && await this.fileService.exists(edit.newResource)) {
						overwrites.push(edit.newResource);
					}
				}

				// Move with overwrite if the user confirms
				const confirm = getMultipleFilesOverwriteConfirm(overwrites);
				const { confirmed } = await this.dialogService.confirm(confirm);
				if (confirmed) {
					await this.explorerService.applyBulkEdit(resourceFileEdits.map(re => new ResourceFileEdit(re.oldResource, re.newResource, { overwrite: true })), options);
				}
			}

			// Any other error: bubble up
			else {
				throw error;
			}
		}
	}

	private static getStatsFromDragAndDropData(data: ElementsDragAndDropData<ExplorerItem, ExplorerItem[]>, dragStartEvent?: DragEvent): ExplorerItem[] {
		if (data.context) {
			return data.context;
		}

		// Detect compressed folder dragging
		if (dragStartEvent && data.elements.length === 1) {
			data.context = [FileDragAndDrop.getCompressedStatFromDragEvent(data.elements[0], dragStartEvent)];
			return data.context;
		}

		return data.elements;
	}

	private static getCompressedStatFromDragEvent(stat: ExplorerItem, dragEvent: DragEvent): ExplorerItem {
		const target = DOM.getWindow(dragEvent).document.elementFromPoint(dragEvent.clientX, dragEvent.clientY);
		const iconLabelName = getIconLabelNameFromHTMLElement(target);

		if (iconLabelName) {
			const { count, index } = iconLabelName;

			let i = count - 1;
			while (i > index && stat.parent) {
				stat = stat.parent;
				i--;
			}

			return stat;
		}

		return stat;
	}

	onDragEnd(): void {
		this.compressedDropTargetDisposable.dispose();
	}

	dispose(): void {
		this.compressedDropTargetDisposable.dispose();
	}
}

function getIconLabelNameFromHTMLElement(target: HTMLElement | EventTarget | Element | null): { element: HTMLElement; count: number; index: number } | null {
	if (!(DOM.isHTMLElement(target))) {
		return null;
	}

	let element: HTMLElement | null = target;

	while (element && !element.classList.contains('monaco-list-row')) {
		if (element.classList.contains('label-name') && element.hasAttribute('data-icon-label-count')) {
			const count = Number(element.getAttribute('data-icon-label-count'));
			const index = Number(element.getAttribute('data-icon-label-index'));

			if (isNumber(count) && isNumber(index)) {
				return { element: element, count, index };
			}
		}

		element = element.parentElement;
	}

	return null;
}

export function isCompressedFolderName(target: HTMLElement | EventTarget | Element | null): boolean {
	return !!getIconLabelNameFromHTMLElement(target);
}

export class ExplorerCompressionDelegate implements ITreeCompressionDelegate<ExplorerItem> {

	isIncompressible(stat: ExplorerItem): boolean {
		return stat.isRoot || !stat.isDirectory || stat instanceof NewExplorerItem || (!stat.parent || stat.parent.isRoot);
	}
}

function getFileOrFolderLabelSuffix(items: ExplorerItem[]): string {
	if (items.length === 1) {
		return items[0].name;
	}

	if (items.every(i => i.isDirectory)) {
		return localize('numberOfFolders', "{0} folders", items.length);
	}
	if (items.every(i => !i.isDirectory)) {
		return localize('numberOfFiles', "{0} files", items.length);
	}

	return `${items.length} files and folders`;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/browser/views/openEditorsView.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/browser/views/openEditorsView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/openeditors.css';
import * as nls from '../../../../../nls.js';
import { RunOnceScheduler } from '../../../../../base/common/async.js';
import { IAction, ActionRunner, WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification } from '../../../../../base/common/actions.js';
import * as dom from '../../../../../base/browser/dom.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IEditorGroupsService, IEditorGroup, GroupsOrder, GroupOrientation } from '../../../../services/editor/common/editorGroupsService.js';
import { IConfigurationService, IConfigurationChangeEvent } from '../../../../../platform/configuration/common/configuration.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { Verbosity, EditorResourceAccessor, SideBySideEditor, IEditorIdentifier, GroupModelChangeKind, preventEditorClose, EditorCloseMethod } from '../../../../common/editor.js';
import { EditorInput } from '../../../../common/editor/editorInput.js';
import { SaveAllInGroupAction, CloseGroupAction } from '../fileActions.js';
import { OpenEditorsFocusedContext, ExplorerFocusedContext, IFilesConfiguration, OpenEditor } from '../../common/files.js';
import { CloseAllEditorsAction, CloseEditorAction, UnpinEditorAction } from '../../../../browser/parts/editor/editorActions.js';
import { IContextKeyService, ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { asCssVariable, badgeBackground, badgeForeground, contrastBorder } from '../../../../../platform/theme/common/colorRegistry.js';
import { WorkbenchList } from '../../../../../platform/list/browser/listService.js';
import { IListVirtualDelegate, IListRenderer, IListContextMenuEvent, IListDragAndDrop, IListDragOverReaction, ListDragOverEffectPosition, ListDragOverEffectType } from '../../../../../base/browser/ui/list/list.js';
import { ResourceLabels, IResourceLabel } from '../../../../browser/labels.js';
import { ActionBar } from '../../../../../base/browser/ui/actionbar/actionbar.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { DisposableMap, IDisposable, dispose } from '../../../../../base/common/lifecycle.js';
import { MenuId, Action2, registerAction2, MenuRegistry } from '../../../../../platform/actions/common/actions.js';
import { OpenEditorsDirtyEditorContext, OpenEditorsGroupContext, OpenEditorsReadonlyEditorContext, SAVE_ALL_LABEL, SAVE_ALL_COMMAND_ID, NEW_UNTITLED_FILE_COMMAND_ID, OpenEditorsSelectedFileOrUntitledContext } from '../fileConstants.js';
import { ResourceContextKey, MultipleEditorGroupsContext } from '../../../../common/contextkeys.js';
import { CodeDataTransfers, containsDragType } from '../../../../../platform/dnd/browser/dnd.js';
import { ResourcesDropHandler, fillEditorsDragData } from '../../../../browser/dnd.js';
import { ViewPane } from '../../../../browser/parts/views/viewPane.js';
import { IViewletViewOptions } from '../../../../browser/parts/views/viewsViewlet.js';
import { IDragAndDropData, DataTransfers } from '../../../../../base/browser/dnd.js';
import { memoize } from '../../../../../base/common/decorators.js';
import { ElementsDragAndDropData, ListViewTargetSector, NativeDragAndDropData } from '../../../../../base/browser/ui/list/listView.js';
import { IWorkingCopyService } from '../../../../services/workingCopy/common/workingCopyService.js';
import { IWorkingCopy, WorkingCopyCapabilities } from '../../../../services/workingCopy/common/workingCopy.js';
import { IFilesConfigurationService } from '../../../../services/filesConfiguration/common/filesConfigurationService.js';
import { IViewDescriptorService } from '../../../../common/views.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { Orientation } from '../../../../../base/browser/ui/splitview/splitview.js';
import { IListAccessibilityProvider } from '../../../../../base/browser/ui/list/listWidget.js';
import { compareFileNamesDefault } from '../../../../../base/common/comparers.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { Schemas } from '../../../../../base/common/network.js';
import { extUriIgnorePathCase } from '../../../../../base/common/resources.js';
import { ILocalizedString } from '../../../../../platform/action/common/action.js';
import { mainWindow } from '../../../../../base/browser/window.js';
import { EditorGroupView } from '../../../../browser/parts/editor/editorGroupView.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { IFileService } from '../../../../../platform/files/common/files.js';

const $ = dom.$;

export class OpenEditorsView extends ViewPane {

	private static readonly DEFAULT_VISIBLE_OPEN_EDITORS = 9;
	private static readonly DEFAULT_MIN_VISIBLE_OPEN_EDITORS = 0;
	static readonly ID = 'workbench.explorer.openEditorsView';
	static readonly NAME: ILocalizedString = nls.localize2({ key: 'openEditors', comment: ['Open is an adjective'] }, "Open Editors");

	private dirtyCountElement!: HTMLElement;
	private listRefreshScheduler: RunOnceScheduler | undefined;
	private structuralRefreshDelay: number;
	private dnd: OpenEditorsDragAndDrop | undefined;
	private list: WorkbenchList<OpenEditor | IEditorGroup> | undefined;
	private listLabels: ResourceLabels | undefined;
	private needsRefresh = false;
	private elements: (OpenEditor | IEditorGroup)[] = [];
	private sortOrder: 'editorOrder' | 'alphabetical' | 'fullPath';
	private blockFocusActiveEditorTracking = false;

	constructor(
		options: IViewletViewOptions,
		@IInstantiationService instantiationService: IInstantiationService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IEditorGroupsService private readonly editorGroupService: IEditorGroupsService,
		@IConfigurationService configurationService: IConfigurationService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IThemeService themeService: IThemeService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IHoverService hoverService: IHoverService,
		@IWorkingCopyService private readonly workingCopyService: IWorkingCopyService,
		@IFilesConfigurationService private readonly filesConfigurationService: IFilesConfigurationService,
		@IOpenerService openerService: IOpenerService,
		@IFileService private readonly fileService: IFileService
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);

		this.structuralRefreshDelay = 0;
		this.sortOrder = configurationService.getValue('explorer.openEditors.sortOrder');

		this.registerUpdateEvents();

		// Also handle configuration updates
		this._register(this.configurationService.onDidChangeConfiguration(e => this.onConfigurationChange(e)));

		// Handle dirty counter
		this._register(this.workingCopyService.onDidChangeDirty(workingCopy => this.updateDirtyIndicator(workingCopy)));
	}

	private registerUpdateEvents(): void {
		const updateWholeList = () => {
			if (!this.isBodyVisible() || !this.list) {
				this.needsRefresh = true;
				return;
			}

			this.listRefreshScheduler?.schedule(this.structuralRefreshDelay);
		};

		const groupDisposables = this._register(new DisposableMap<number>());
		const addGroupListener = (group: IEditorGroup) => {
			const groupModelChangeListener = group.onDidModelChange(e => {
				if (this.listRefreshScheduler?.isScheduled()) {
					return;
				}
				if (!this.isBodyVisible() || !this.list) {
					this.needsRefresh = true;
					return;
				}

				const index = this.getIndex(group, e.editor);
				switch (e.kind) {
					case GroupModelChangeKind.EDITOR_ACTIVE:
						this.focusActiveEditor();
						break;
					case GroupModelChangeKind.GROUP_INDEX:
					case GroupModelChangeKind.GROUP_LABEL:
						if (index >= 0) {
							this.list.splice(index, 1, [group]);
						}
						break;
					case GroupModelChangeKind.EDITOR_DIRTY:
					case GroupModelChangeKind.EDITOR_STICKY:
					case GroupModelChangeKind.EDITOR_CAPABILITIES:
					case GroupModelChangeKind.EDITOR_PIN:
					case GroupModelChangeKind.EDITOR_LABEL:
						this.list.splice(index, 1, [new OpenEditor(e.editor!, group)]);
						this.focusActiveEditor();
						break;
					case GroupModelChangeKind.EDITOR_OPEN:
					case GroupModelChangeKind.EDITOR_MOVE:
					case GroupModelChangeKind.EDITOR_CLOSE:
						updateWholeList();
						break;
				}
			});
			groupDisposables.set(group.id, groupModelChangeListener);
		};

		this.editorGroupService.groups.forEach(g => addGroupListener(g));
		this._register(this.editorGroupService.onDidAddGroup(group => {
			addGroupListener(group);
			updateWholeList();
		}));
		this._register(this.editorGroupService.onDidMoveGroup(() => updateWholeList()));
		this._register(this.editorGroupService.onDidChangeActiveGroup(() => this.focusActiveEditor()));
		this._register(this.editorGroupService.onDidRemoveGroup(group => {
			groupDisposables.deleteAndDispose(group.id);
			updateWholeList();
		}));
	}

	protected override renderHeaderTitle(container: HTMLElement): void {
		super.renderHeaderTitle(container, this.title);

		const count = dom.append(container, $('.open-editors-dirty-count-container'));
		this.dirtyCountElement = dom.append(count, $('.dirty-count.monaco-count-badge.long'));

		this.dirtyCountElement.style.backgroundColor = asCssVariable(badgeBackground);
		this.dirtyCountElement.style.color = asCssVariable(badgeForeground);
		this.dirtyCountElement.style.border = `1px solid ${asCssVariable(contrastBorder)}`;

		this.updateDirtyIndicator();
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);

		container.classList.add('open-editors');
		container.classList.add('show-file-icons');

		const delegate = new OpenEditorsDelegate();

		if (this.list) {
			this.list.dispose();
		}
		if (this.listLabels) {
			this.listLabels.clear();
		}

		this.dnd = new OpenEditorsDragAndDrop(this.sortOrder, this.instantiationService, this.editorGroupService);

		this.listLabels = this.instantiationService.createInstance(ResourceLabels, { onDidChangeVisibility: this.onDidChangeBodyVisibility });
		this.list = this.instantiationService.createInstance(WorkbenchList, 'OpenEditors', container, delegate, [
			new EditorGroupRenderer(this.keybindingService, this.instantiationService),
			new OpenEditorRenderer(this.listLabels, this.instantiationService, this.keybindingService, this.configurationService)
		], {
			identityProvider: { getId: (element: OpenEditor | IEditorGroup) => element instanceof OpenEditor ? element.getId() : element.id.toString() },
			dnd: this.dnd,
			overrideStyles: this.getLocationBasedColors().listOverrideStyles,
			accessibilityProvider: new OpenEditorsAccessibilityProvider()
		}) as WorkbenchList<OpenEditor | IEditorGroup>;
		this._register(this.list);
		this._register(this.listLabels);

		// Register the refresh scheduler
		let labelChangeListeners: IDisposable[] = [];
		this.listRefreshScheduler = this._register(new RunOnceScheduler(() => {
			// No need to refresh the list if it's not rendered
			if (!this.list) {
				return;
			}
			labelChangeListeners = dispose(labelChangeListeners);
			const previousLength = this.list.length;
			const elements = this.getElements();
			this.list.splice(0, this.list.length, elements);
			this.focusActiveEditor();
			if (previousLength !== this.list.length) {
				this.updateSize();
			}
			this.needsRefresh = false;

			if (this.sortOrder === 'alphabetical' || this.sortOrder === 'fullPath') {
				// We need to resort the list if the editor label changed
				elements.forEach(e => {
					if (e instanceof OpenEditor) {
						labelChangeListeners.push(e.editor.onDidChangeLabel(() => this.listRefreshScheduler?.schedule()));
					}
				});
			}
		}, this.structuralRefreshDelay));

		this.updateSize();

		this.handleContextKeys();
		this._register(this.list.onContextMenu(e => this.onListContextMenu(e)));

		// Open when selecting via keyboard
		this._register(this.list.onMouseMiddleClick(e => {
			if (e && e.element instanceof OpenEditor) {
				if (preventEditorClose(e.element.group, e.element.editor, EditorCloseMethod.MOUSE, this.editorGroupService.partOptions)) {
					return;
				}

				e.element.group.closeEditor(e.element.editor, { preserveFocus: true });
			}
		}));
		this._register(this.list.onDidOpen(e => {
			const element = e.element;
			if (!element) {
				return;
			} else if (element instanceof OpenEditor) {
				if (dom.isMouseEvent(e.browserEvent) && e.browserEvent.button === 1) {
					return; // middle click already handled above: closes the editor
				}

				this.withActiveEditorFocusTrackingDisabled(() => {
					this.openEditor(element, { preserveFocus: e.editorOptions.preserveFocus, pinned: e.editorOptions.pinned, sideBySide: e.sideBySide });
				});
			} else {
				this.withActiveEditorFocusTrackingDisabled(() => {
					this.editorGroupService.activateGroup(element);
					if (!e.editorOptions.preserveFocus) {
						element.focus();
					}
				});
			}
		}));

		this.listRefreshScheduler.schedule(0);

		this._register(this.onDidChangeBodyVisibility(visible => {
			if (visible && this.needsRefresh) {
				this.listRefreshScheduler?.schedule(0);
			}
		}));

		const containerModel = this.viewDescriptorService.getViewContainerModel(this.viewDescriptorService.getViewContainerByViewId(this.id)!);
		this._register(containerModel.onDidChangeAllViewDescriptors(() => {
			this.updateSize();
		}));
	}

	private handleContextKeys() {
		if (!this.list) {
			return;
		}

		// Bind context keys
		OpenEditorsFocusedContext.bindTo(this.list.contextKeyService);
		ExplorerFocusedContext.bindTo(this.list.contextKeyService);

		const groupFocusedContext = OpenEditorsGroupContext.bindTo(this.contextKeyService);
		const dirtyEditorFocusedContext = OpenEditorsDirtyEditorContext.bindTo(this.contextKeyService);
		const readonlyEditorFocusedContext = OpenEditorsReadonlyEditorContext.bindTo(this.contextKeyService);
		const openEditorsSelectedFileOrUntitledContext = OpenEditorsSelectedFileOrUntitledContext.bindTo(this.contextKeyService);

		const resourceContext = this.instantiationService.createInstance(ResourceContextKey);
		this._register(resourceContext);

		this._register(this.list.onDidChangeFocus(e => {
			resourceContext.reset();
			groupFocusedContext.reset();
			dirtyEditorFocusedContext.reset();
			readonlyEditorFocusedContext.reset();

			const element = e.elements.length ? e.elements[0] : undefined;
			if (element instanceof OpenEditor) {
				const resource = element.getResource();
				dirtyEditorFocusedContext.set(element.editor.isDirty() && !element.editor.isSaving());
				readonlyEditorFocusedContext.set(!!element.editor.isReadonly());
				resourceContext.set(resource ?? null);
			} else if (element) {
				groupFocusedContext.set(true);
			}
		}));

		this._register(this.list.onDidChangeSelection(e => {
			const selectedAreFileOrUntitled = e.elements.every(e => {
				if (e instanceof OpenEditor) {
					const resource = e.getResource();
					return resource && (resource.scheme === Schemas.untitled || this.fileService.hasProvider(resource));
				}
				return false;
			});
			openEditorsSelectedFileOrUntitledContext.set(selectedAreFileOrUntitled);
		}));
	}

	override focus(): void {
		super.focus();

		this.list?.domFocus();
	}

	protected override layoutBody(height: number, width: number): void {
		super.layoutBody(height, width);
		this.list?.layout(height, width);
	}

	private get showGroups(): boolean {
		return this.editorGroupService.groups.length > 1;
	}

	private getElements(): Array<IEditorGroup | OpenEditor> {
		this.elements = [];
		this.editorGroupService.getGroups(GroupsOrder.GRID_APPEARANCE).forEach(g => {
			if (this.showGroups) {
				this.elements.push(g);
			}
			let editors = g.editors.map(ei => new OpenEditor(ei, g));
			if (this.sortOrder === 'alphabetical') {
				editors = editors.sort((first, second) => compareFileNamesDefault(first.editor.getName(), second.editor.getName()));
			} else if (this.sortOrder === 'fullPath') {
				editors = editors.sort((first, second) => {
					const firstResource = first.editor.resource;
					const secondResource = second.editor.resource;
					//put 'system' editors before everything
					if (firstResource === undefined && secondResource === undefined) {
						return compareFileNamesDefault(first.editor.getName(), second.editor.getName());
					} else if (firstResource === undefined) {
						return -1;
					} else if (secondResource === undefined) {
						return 1;
					} else {
						const firstScheme = firstResource.scheme;
						const secondScheme = secondResource.scheme;
						//put non-file editors before files
						if (firstScheme !== Schemas.file && secondScheme !== Schemas.file) {
							return extUriIgnorePathCase.compare(firstResource, secondResource);
						} else if (firstScheme !== Schemas.file) {
							return -1;
						} else if (secondScheme !== Schemas.file) {
							return 1;
						} else {
							return extUriIgnorePathCase.compare(firstResource, secondResource);
						}
					}
				});
			}
			this.elements.push(...editors);
		});

		return this.elements;
	}

	private getIndex(group: IEditorGroup, editor: EditorInput | undefined | null): number {
		if (!editor) {
			return this.elements.findIndex(e => !(e instanceof OpenEditor) && e.id === group.id);
		}

		return this.elements.findIndex(e => e instanceof OpenEditor && e.editor === editor && e.group.id === group.id);
	}

	private openEditor(element: OpenEditor, options: { preserveFocus?: boolean; pinned?: boolean; sideBySide?: boolean }): void {
		if (element) {
			this.telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: 'workbench.files.openFile', from: 'openEditors' });

			const preserveActivateGroup = options.sideBySide && options.preserveFocus; // needed for https://github.com/microsoft/vscode/issues/42399
			if (!preserveActivateGroup) {
				this.editorGroupService.activateGroup(element.group); // needed for https://github.com/microsoft/vscode/issues/6672
			}
			const targetGroup = options.sideBySide ? this.editorGroupService.sideGroup : element.group;
			targetGroup.openEditor(element.editor, options);
		}
	}

	private onListContextMenu(e: IListContextMenuEvent<OpenEditor | IEditorGroup>): void {
		if (!e.element) {
			return;
		}

		const element = e.element;

		this.contextMenuService.showContextMenu({
			menuId: MenuId.OpenEditorsContext,
			menuActionOptions: { shouldForwardArgs: true, arg: element instanceof OpenEditor ? EditorResourceAccessor.getOriginalUri(element.editor) : {} },
			contextKeyService: this.list?.contextKeyService,
			getAnchor: () => e.anchor,
			getActionsContext: () => element instanceof OpenEditor ? { groupId: element.groupId, editorIndex: element.group.getIndexOfEditor(element.editor) } : { groupId: element.id }
		});
	}

	private withActiveEditorFocusTrackingDisabled(fn: () => void): void {
		this.blockFocusActiveEditorTracking = true;
		try {
			fn();
		} finally {
			this.blockFocusActiveEditorTracking = false;
		}
	}

	private focusActiveEditor(): void {
		if (!this.list || this.blockFocusActiveEditorTracking) {
			return;
		}

		if (this.list.length && this.editorGroupService.activeGroup) {
			const index = this.getIndex(this.editorGroupService.activeGroup, this.editorGroupService.activeGroup.activeEditor);
			if (index >= 0) {
				try {
					this.list.setFocus([index]);
					this.list.setSelection([index]);
					this.list.reveal(index);
				} catch (e) {
					// noop list updated in the meantime
				}
				return;
			}
		}

		this.list.setFocus([]);
		this.list.setSelection([]);
	}

	private onConfigurationChange(event: IConfigurationChangeEvent): void {
		if (event.affectsConfiguration('explorer.openEditors')) {
			this.updateSize();
		}
		// Trigger a 'repaint' when decoration settings change or the sort order changed
		if (event.affectsConfiguration('explorer.decorations') || event.affectsConfiguration('explorer.openEditors.sortOrder')) {
			this.sortOrder = this.configurationService.getValue('explorer.openEditors.sortOrder');
			if (this.dnd) {
				this.dnd.sortOrder = this.sortOrder;
			}
			this.listRefreshScheduler?.schedule();
		}
	}

	private updateSize(): void {
		// Adjust expanded body size
		this.minimumBodySize = this.orientation === Orientation.VERTICAL ? this.getMinExpandedBodySize() : 170;
		this.maximumBodySize = this.orientation === Orientation.VERTICAL ? this.getMaxExpandedBodySize() : Number.POSITIVE_INFINITY;
	}

	private updateDirtyIndicator(workingCopy?: IWorkingCopy): void {
		if (workingCopy) {
			const gotDirty = workingCopy.isDirty();
			if (gotDirty && !(workingCopy.capabilities & WorkingCopyCapabilities.Untitled) && this.filesConfigurationService.hasShortAutoSaveDelay(workingCopy.resource)) {
				return; // do not indicate dirty of working copies that are auto saved after short delay
			}
		}

		const dirty = this.workingCopyService.dirtyCount;
		if (dirty === 0) {
			this.dirtyCountElement.classList.add('hidden');
		} else {
			this.dirtyCountElement.textContent = nls.localize('dirtyCounter', "{0} unsaved", dirty);
			this.dirtyCountElement.classList.remove('hidden');
		}
	}

	private get elementCount(): number {
		return this.editorGroupService.groups.map(g => g.count)
			.reduce((first, second) => first + second, this.showGroups ? this.editorGroupService.groups.length : 0);
	}

	private getMaxExpandedBodySize(): number {
		let minVisibleOpenEditors = this.configurationService.getValue<number>('explorer.openEditors.minVisible');
		// If it's not a number setting it to 0 will result in dynamic resizing.
		if (typeof minVisibleOpenEditors !== 'number') {
			minVisibleOpenEditors = OpenEditorsView.DEFAULT_MIN_VISIBLE_OPEN_EDITORS;
		}
		const containerModel = this.viewDescriptorService.getViewContainerModel(this.viewDescriptorService.getViewContainerByViewId(this.id)!);
		if (containerModel.visibleViewDescriptors.length <= 1) {
			return Number.POSITIVE_INFINITY;
		}

		return (Math.max(this.elementCount, minVisibleOpenEditors)) * OpenEditorsDelegate.ITEM_HEIGHT;
	}

	private getMinExpandedBodySize(): number {
		let visibleOpenEditors = this.configurationService.getValue<number>('explorer.openEditors.visible');
		if (typeof visibleOpenEditors !== 'number') {
			visibleOpenEditors = OpenEditorsView.DEFAULT_VISIBLE_OPEN_EDITORS;
		}

		return this.computeMinExpandedBodySize(visibleOpenEditors);
	}

	private computeMinExpandedBodySize(visibleOpenEditors = OpenEditorsView.DEFAULT_VISIBLE_OPEN_EDITORS): number {
		const itemsToShow = Math.min(Math.max(visibleOpenEditors, 1), this.elementCount);
		return itemsToShow * OpenEditorsDelegate.ITEM_HEIGHT;
	}

	setStructuralRefreshDelay(delay: number): void {
		this.structuralRefreshDelay = delay;
	}

	override getOptimalWidth(): number {
		if (!this.list) {
			return super.getOptimalWidth();
		}

		const parentNode = this.list.getHTMLElement();
		// eslint-disable-next-line no-restricted-syntax
		const childNodes: HTMLElement[] = [].slice.call(parentNode.querySelectorAll('.open-editor > a'));

		return dom.getLargestChildWidth(parentNode, childNodes);
	}
}

interface IOpenEditorTemplateData {
	container: HTMLElement;
	root: IResourceLabel;
	actionBar: ActionBar;
	actionRunner: OpenEditorActionRunner;
}

interface IEditorGroupTemplateData {
	root: HTMLElement;
	name: HTMLSpanElement;
	actionBar: ActionBar;
	editorGroup: IEditorGroup;
}

class OpenEditorActionRunner extends ActionRunner {
	public editor: OpenEditor | undefined;

	override async run(action: IAction): Promise<void> {
		if (!this.editor) {
			return;
		}

		return super.run(action, { groupId: this.editor.groupId, editorIndex: this.editor.group.getIndexOfEditor(this.editor.editor) });
	}
}

class OpenEditorsDelegate implements IListVirtualDelegate<OpenEditor | IEditorGroup> {

	public static readonly ITEM_HEIGHT = 22;

	getHeight(_element: OpenEditor | IEditorGroup): number {
		return OpenEditorsDelegate.ITEM_HEIGHT;
	}

	getTemplateId(element: OpenEditor | IEditorGroup): string {
		if (element instanceof OpenEditor) {
			return OpenEditorRenderer.ID;
		}

		return EditorGroupRenderer.ID;
	}
}

class EditorGroupRenderer implements IListRenderer<IEditorGroup, IEditorGroupTemplateData> {
	static readonly ID = 'editorgroup';

	constructor(
		private keybindingService: IKeybindingService,
		private instantiationService: IInstantiationService,
	) {
		// noop
	}

	get templateId() {
		return EditorGroupRenderer.ID;
	}

	renderTemplate(container: HTMLElement): IEditorGroupTemplateData {
		const editorGroupTemplate: IEditorGroupTemplateData = Object.create(null);
		editorGroupTemplate.root = dom.append(container, $('.editor-group'));
		editorGroupTemplate.name = dom.append(editorGroupTemplate.root, $('span.name'));
		editorGroupTemplate.actionBar = new ActionBar(container);

		const saveAllInGroupAction = this.instantiationService.createInstance(SaveAllInGroupAction, SaveAllInGroupAction.ID, SaveAllInGroupAction.LABEL);
		const saveAllInGroupKey = this.keybindingService.lookupKeybinding(saveAllInGroupAction.id);
		editorGroupTemplate.actionBar.push(saveAllInGroupAction, { icon: true, label: false, keybinding: saveAllInGroupKey ? saveAllInGroupKey.getLabel() : undefined });

		const closeGroupAction = this.instantiationService.createInstance(CloseGroupAction, CloseGroupAction.ID, CloseGroupAction.LABEL);
		const closeGroupActionKey = this.keybindingService.lookupKeybinding(closeGroupAction.id);
		editorGroupTemplate.actionBar.push(closeGroupAction, { icon: true, label: false, keybinding: closeGroupActionKey ? closeGroupActionKey.getLabel() : undefined });

		return editorGroupTemplate;
	}

	renderElement(editorGroup: IEditorGroup, _index: number, templateData: IEditorGroupTemplateData): void {
		templateData.editorGroup = editorGroup;
		templateData.name.textContent = editorGroup.label;
		templateData.actionBar.context = { groupId: editorGroup.id };
	}

	disposeTemplate(templateData: IEditorGroupTemplateData): void {
		templateData.actionBar.dispose();
	}
}

class OpenEditorRenderer implements IListRenderer<OpenEditor, IOpenEditorTemplateData> {
	static readonly ID = 'openeditor';

	private readonly closeEditorAction;
	private readonly unpinEditorAction;

	constructor(
		private labels: ResourceLabels,
		private instantiationService: IInstantiationService,
		private keybindingService: IKeybindingService,
		private configurationService: IConfigurationService
	) {
		this.closeEditorAction = this.instantiationService.createInstance(CloseEditorAction, CloseEditorAction.ID, CloseEditorAction.LABEL);
		this.unpinEditorAction = this.instantiationService.createInstance(UnpinEditorAction, UnpinEditorAction.ID, UnpinEditorAction.LABEL);
		// noop
	}

	get templateId() {
		return OpenEditorRenderer.ID;
	}

	renderTemplate(container: HTMLElement): IOpenEditorTemplateData {
		const editorTemplate: IOpenEditorTemplateData = Object.create(null);
		editorTemplate.container = container;
		editorTemplate.actionRunner = new OpenEditorActionRunner();
		editorTemplate.actionBar = new ActionBar(container, { actionRunner: editorTemplate.actionRunner });
		editorTemplate.root = this.labels.create(container);

		return editorTemplate;
	}

	renderElement(openedEditor: OpenEditor, _index: number, templateData: IOpenEditorTemplateData): void {
		const editor = openedEditor.editor;
		templateData.actionRunner.editor = openedEditor;
		templateData.container.classList.toggle('dirty', editor.isDirty() && !editor.isSaving());
		templateData.container.classList.toggle('sticky', openedEditor.isSticky());
		templateData.root.setResource({
			resource: EditorResourceAccessor.getOriginalUri(editor, { supportSideBySide: SideBySideEditor.BOTH }),
			name: editor.getName(),
			description: editor.getDescription(Verbosity.MEDIUM)
		}, {
			italic: openedEditor.isPreview(),
			extraClasses: ['open-editor'].concat(openedEditor.editor.getLabelExtraClasses()),
			fileDecorations: this.configurationService.getValue<IFilesConfiguration>().explorer.decorations,
			title: editor.getTitle(Verbosity.LONG),
			icon: editor.getIcon()
		});
		const editorAction = openedEditor.isSticky() ? this.unpinEditorAction : this.closeEditorAction;
		if (!templateData.actionBar.hasAction(editorAction)) {
			if (!templateData.actionBar.isEmpty()) {
				templateData.actionBar.clear();
			}
			templateData.actionBar.push(editorAction, { icon: true, label: false, keybinding: this.keybindingService.lookupKeybinding(editorAction.id)?.getLabel() });
		}
	}

	disposeTemplate(templateData: IOpenEditorTemplateData): void {
		templateData.actionBar.dispose();
		templateData.root.dispose();
		templateData.actionRunner.dispose();
	}
}

class OpenEditorsDragAndDrop implements IListDragAndDrop<OpenEditor | IEditorGroup> {

	private _sortOrder: 'editorOrder' | 'alphabetical' | 'fullPath';
	public set sortOrder(value: 'editorOrder' | 'alphabetical' | 'fullPath') {
		this._sortOrder = value;
	}

	constructor(
		sortOrder: 'editorOrder' | 'alphabetical' | 'fullPath',
		private instantiationService: IInstantiationService,
		private editorGroupService: IEditorGroupsService
	) {
		this._sortOrder = sortOrder;
	}

	@memoize private get dropHandler(): ResourcesDropHandler {
		return this.instantiationService.createInstance(ResourcesDropHandler, { allowWorkspaceOpen: false });
	}

	getDragURI(element: OpenEditor | IEditorGroup): string | null {
		if (element instanceof OpenEditor) {
			const resource = element.getResource();
			if (resource) {
				return resource.toString();
			}
		}
		return null;
	}

	getDragLabel?(elements: (OpenEditor | IEditorGroup)[]): string {
		if (elements.length > 1) {
			return String(elements.length);
		}
		const element = elements[0];

		return element instanceof OpenEditor ? element.editor.getName() : element.label;
	}

	onDragStart(data: IDragAndDropData, originalEvent: DragEvent): void {
		const items = (data as ElementsDragAndDropData<OpenEditor | IEditorGroup>).elements;
		const editors: IEditorIdentifier[] = [];
		if (items) {
			for (const item of items) {
				if (item instanceof OpenEditor) {
					editors.push(item);
				}
			}
		}

		if (editors.length) {
			// Apply some datatransfer types to allow for dragging the element outside of the application
			this.instantiationService.invokeFunction(fillEditorsDragData, editors, originalEvent);
		}
	}

	onDragOver(data: IDragAndDropData, _targetElement: OpenEditor | IEditorGroup, _targetIndex: number, targetSector: ListViewTargetSector | undefined, originalEvent: DragEvent): boolean | IListDragOverReaction {
		if (data instanceof NativeDragAndDropData) {
			if (!containsDragType(originalEvent, DataTransfers.FILES, CodeDataTransfers.FILES)) {
				return false;
			}
		}

		if (this._sortOrder !== 'editorOrder') {
			if (data instanceof ElementsDragAndDropData) {
				// No reordering supported when sorted
				return false;
			} else {
				// Allow droping files to open them
				return { accept: true, effect: { type: ListDragOverEffectType.Move }, feedback: [-1] };
			}
		}

		let dropEffectPosition: ListDragOverEffectPosition | undefined = undefined;
		switch (targetSector) {
			case ListViewTargetSector.TOP:
			case ListViewTargetSector.CENTER_TOP:
				dropEffectPosition = (_targetIndex === 0 && _targetElement instanceof EditorGroupView) ? ListDragOverEffectPosition.After : ListDragOverEffectPosition.Before; break;
			case ListViewTargetSector.CENTER_BOTTOM:
			case ListViewTargetSector.BOTTOM:
				dropEffectPosition = ListDragOverEffectPosition.After; break;
		}

		return { accept: true, effect: { type: ListDragOverEffectType.Move, position: dropEffectPosition }, feedback: [_targetIndex] };
	}

	drop(data: IDragAndDropData, targetElement: OpenEditor | IEditorGroup | undefined, _targetIndex: number, targetSector: ListViewTargetSector | undefined, originalEvent: DragEvent): void {
		let group = targetElement instanceof OpenEditor ? targetElement.group : targetElement || this.editorGroupService.groups[this.editorGroupService.count - 1];
		let targetEditorIndex = targetElement instanceof OpenEditor ? targetElement.group.getIndexOfEditor(targetElement.editor) : 0;

		switch (targetSector) {
			case ListViewTargetSector.TOP:
			case ListViewTargetSector.CENTER_TOP:
				if (targetElement instanceof EditorGroupView && group.index !== 0) {
					group = this.editorGroupService.groups[group.index - 1];
					targetEditorIndex = group.count;
				}
				break;
			case ListViewTargetSector.BOTTOM:
			case ListViewTargetSector.CENTER_BOTTOM:
				if (targetElement instanceof OpenEditor) {
					targetEditorIndex++;
				}
				break;
		}

		if (data instanceof ElementsDragAndDropData) {
			for (const oe of data.elements) {
				const sourceEditorIndex = oe.group.getIndexOfEditor(oe.editor);
				if (oe.group === group && sourceEditorIndex < targetEditorIndex) {
					targetEditorIndex--;
				}
				oe.group.moveEditor(oe.editor, group, { index: targetEditorIndex, preserveFocus: true });
				targetEditorIndex++;
			}
			this.editorGroupService.activateGroup(group);
		} else {
			this.dropHandler.handleDrop(originalEvent, mainWindow, () => group, () => group.focus(), { index: targetEditorIndex });
		}
	}

	dispose(): void { }
}

class OpenEditorsAccessibilityProvider implements IListAccessibilityProvider<OpenEditor | IEditorGroup> {

	getWidgetAriaLabel(): string {
		return nls.localize('openEditors', "Open Editors");
	}

	getAriaLabel(element: OpenEditor | IEditorGroup): string | null {
		if (element instanceof OpenEditor) {
			return `${element.editor.getName()}, ${element.editor.getDescription()}`;
		}

		return element.ariaLabel;
	}
}

const toggleEditorGroupLayoutId = 'workbench.action.toggleEditorGroupLayout';
registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.toggleEditorGroupLayout',
			title: nls.localize2('flipLayout', "Toggle Vertical/Horizontal Editor Layout"),
			f1: true,
			keybinding: {
				primary: KeyMod.Shift | KeyMod.Alt | KeyCode.Digit0,
				mac: { primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.Digit0 },
				weight: KeybindingWeight.WorkbenchContrib
			},
			icon: Codicon.editorLayout,
			menu: {
				id: MenuId.ViewTitle,
				group: 'navigation',
				when: ContextKeyExpr.and(ContextKeyExpr.equals('view', OpenEditorsView.ID), MultipleEditorGroupsContext),
				order: 10
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const editorGroupService = accessor.get(IEditorGroupsService);
		const newOrientation = (editorGroupService.orientation === GroupOrientation.VERTICAL) ? GroupOrientation.HORIZONTAL : GroupOrientation.VERTICAL;
		editorGroupService.setGroupOrientation(newOrientation);
		editorGroupService.activeGroup.focus();
	}
});

MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
	group: '5_flip',
	command: {
		id: toggleEditorGroupLayoutId,
		title: {
			...nls.localize2('miToggleEditorLayoutWithoutMnemonic', "Flip Layout"),
			mnemonicTitle: nls.localize({ key: 'miToggleEditorLayout', comment: ['&& denotes a mnemonic'] }, "Flip &&Layout")
		}
	},
	order: 1
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.files.saveAll',
			title: SAVE_ALL_LABEL,
			f1: true,
			icon: Codicon.saveAll,
			menu: {
				id: MenuId.ViewTitle,
				group: 'navigation',
				when: ContextKeyExpr.equals('view', OpenEditorsView.ID),
				order: 20
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const commandService = accessor.get(ICommandService);
		await commandService.executeCommand(SAVE_ALL_COMMAND_ID);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'openEditors.closeAll',
			title: CloseAllEditorsAction.LABEL,
			f1: false,
			icon: Codicon.closeAll,
			menu: {
				id: MenuId.ViewTitle,
				group: 'navigation',
				when: ContextKeyExpr.equals('view', OpenEditorsView.ID),
				order: 30
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const instantiationService = accessor.get(IInstantiationService);

		const closeAll = new CloseAllEditorsAction();
		await instantiationService.invokeFunction(accessor => closeAll.run(accessor));
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'openEditors.newUntitledFile',
			title: nls.localize2('newUntitledFile', "New Untitled Text File"),
			f1: false,
			icon: Codicon.newFile,
			menu: {
				id: MenuId.ViewTitle,
				group: 'navigation',
				when: ContextKeyExpr.equals('view', OpenEditorsView.ID),
				order: 5
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const commandService = accessor.get(ICommandService);
		await commandService.executeCommand(NEW_UNTITLED_FILE_COMMAND_ID);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/browser/views/media/openeditors.css]---
Location: vscode-main/src/vs/workbench/contrib/files/browser/views/media/openeditors.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.pane-header .open-editors-dirty-count-container {
	min-width: fit-content;
	display: flex;
	align-items: center;
}

.pane.horizontal:not(.expanded) .pane-header .open-editors-dirty-count-container > .dirty-count.monaco-count-badge,
.pane-header .open-editors-dirty-count-container > .dirty-count.monaco-count-badge.hidden {
	display: none;
}

.pane-header .open-editors-dirty-count-container > .dirty-count.monaco-count-badge {
	padding: 2px 4px;
	margin-left: 6px;
	min-height: auto;
}

.open-editors .monaco-list .monaco-list-row:hover > .monaco-action-bar,
.open-editors .monaco-list .monaco-list-row.focused > .monaco-action-bar,
.open-editors .monaco-list .monaco-list-row.dirty > .monaco-action-bar,
.open-editors .monaco-list .monaco-list-row.sticky > .monaco-action-bar {
	visibility: visible;
}

.open-editors .monaco-list .monaco-list-row > .monaco-action-bar .action-label {
	display: block;
	padding: 2px;
}

.open-editors .monaco-list .monaco-list-row > .monaco-action-bar .codicon {
	color: inherit;
}

.open-editors .monaco-list .monaco-list-row.dirty:not(:hover) > .monaco-action-bar .codicon-pinned::before {
	/* use `pinned-dirty` icon unicode for sticky-dirty indication */
	content: var(--vscode-icon-pinned-dirty-content);
	font-family: var(--vscode-icon-pinned-dirty-font-family);
}

.open-editors .monaco-list .monaco-list-row.dirty:not(:hover) > .monaco-action-bar .codicon-close::before {
	/* use `circle-filled` icon unicode for dirty indication */
	content: var(--vscode-icon-circle-filled-content);
	font-family: var(--vscode-icon-circle-filled-font-family);
}

.open-editors .monaco-list .monaco-list-row > .monaco-action-bar .action-close-all-files,
.open-editors .monaco-list .monaco-list-row > .monaco-action-bar .save-all {
	width: 23px;
	height: 22px;
}

.open-editors .monaco-list .monaco-list-row > .open-editor {
	flex: 1;
}

.open-editors .monaco-list .monaco-list-row > .editor-group {
	flex: 1;
}

.open-editors .monaco-list .monaco-list-row {
	padding-left: 8px;
	display: flex;
}

.open-editors .monaco-list .monaco-list-row > .monaco-action-bar {
	visibility: hidden;
	display: flex;
	align-items: center;
}

.open-editors .monaco-list .monaco-list-row .editor-group {
	font-size: 11px;
	font-weight: bold;
	text-transform: uppercase;
	cursor: default;
}

/* Bold font style does not go well with CJK fonts */
.composite:lang(zh-Hans) .open-editors .monaco-list .monaco-list-row .editor-group,
.composite:lang(zh-Hant) .open-editors .monaco-list .monaco-list-row .editor-group,
.composite:lang(ja) .open-editors .monaco-list .monaco-list-row .editor-group,
.composite:lang(ko) .open-editors .monaco-list .monaco-list-row .editor-group {
	font-weight: normal;
}

.open-editors .open-editor,
.open-editors .editor-group {
	height: 22px;
	line-height: 22px;
}

.open-editors .open-editor > a,
.open-editors .editor-group {
	text-overflow: ellipsis;
	overflow: hidden;
}

.monaco-workbench.hc-black .open-editors .open-editor,
.monaco-workbench.hc-black .open-editors .editor-group,
.monaco-workbench.hc-light .open-editors .open-editor,
.monaco-workbench.hc-light .open-editors .editor-group {
	line-height: 20px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/common/dirtyFilesIndicator.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/common/dirtyFilesIndicator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { VIEWLET_ID } from './files.js';
import { Disposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { IActivityService, NumberBadge } from '../../../services/activity/common/activity.js';
import { IWorkingCopyService } from '../../../services/workingCopy/common/workingCopyService.js';
import { IWorkingCopy, WorkingCopyCapabilities } from '../../../services/workingCopy/common/workingCopy.js';
import { IFilesConfigurationService } from '../../../services/filesConfiguration/common/filesConfigurationService.js';

export class DirtyFilesIndicator extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.dirtyFilesIndicator';

	private readonly badgeHandle = this._register(new MutableDisposable());

	private lastKnownDirtyCount = 0;

	constructor(
		@IActivityService private readonly activityService: IActivityService,
		@IWorkingCopyService private readonly workingCopyService: IWorkingCopyService,
		@IFilesConfigurationService private readonly filesConfigurationService: IFilesConfigurationService
	) {
		super();

		this.updateActivityBadge();

		this.registerListeners();
	}

	private registerListeners(): void {

		// Working copy dirty indicator
		this._register(this.workingCopyService.onDidChangeDirty(workingCopy => this.onWorkingCopyDidChangeDirty(workingCopy)));
	}

	private onWorkingCopyDidChangeDirty(workingCopy: IWorkingCopy): void {
		const gotDirty = workingCopy.isDirty();
		if (gotDirty && !(workingCopy.capabilities & WorkingCopyCapabilities.Untitled) && this.filesConfigurationService.hasShortAutoSaveDelay(workingCopy.resource)) {
			return; // do not indicate dirty of working copies that are auto saved after short delay
		}

		if (gotDirty || this.lastKnownDirtyCount > 0) {
			this.updateActivityBadge();
		}
	}

	private updateActivityBadge(): void {
		const dirtyCount = this.lastKnownDirtyCount = this.workingCopyService.dirtyCount;

		// Indicate dirty count in badge if any
		if (dirtyCount > 0) {
			this.badgeHandle.value = this.activityService.showViewContainerActivity(
				VIEWLET_ID,
				{
					badge: new NumberBadge(dirtyCount, num => num === 1 ? nls.localize('dirtyFile', "1 unsaved file") : nls.localize('dirtyFiles', "{0} unsaved files", dirtyCount)),
				}
			);
		} else {
			this.badgeHandle.clear();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/common/explorerFileNestingTrie.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/common/explorerFileNestingTrie.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

type FilenameAttributes = {
	// index.test in index.test.json
	basename: string;
	// json in index.test.json
	extname: string;
	// my-folder in my-folder/index.test.json
	dirname: string;
};

/**
 * A sort of double-ended trie, used to efficiently query for matches to "star" patterns, where
 * a given key represents a parent and may contain a capturing group ("*"), which can then be
 * referenced via the token "$(capture)" in associated child patterns.
 *
 * The generated tree will have at most two levels, as subtrees are flattened rather than nested.
 *
 * Example:
 * The config: [
 * [ *.ts , [ $(capture).*.ts ; $(capture).js ] ]
 * [ *.js , [ $(capture).min.js ] ] ]
 * Nests the files: [ a.ts ; a.d.ts ; a.js ; a.min.js ; b.ts ; b.min.js ]
 * As:
 * - a.ts => [ a.d.ts ; a.js ; a.min.js ]
 * - b.ts => [ ]
 * - b.min.ts => [ ]
 */
export class ExplorerFileNestingTrie {
	private root = new PreTrie();

	constructor(config: [string, string[]][]) {
		for (const [parentPattern, childPatterns] of config) {
			for (const childPattern of childPatterns) {
				this.root.add(parentPattern, childPattern);
			}
		}
	}

	toString() {
		return this.root.toString();
	}

	private getAttributes(filename: string, dirname: string): FilenameAttributes {
		const lastDot = filename.lastIndexOf('.');
		if (lastDot < 1) {
			return {
				dirname,
				basename: filename,
				extname: ''
			};
		} else {
			return {
				dirname,
				basename: filename.substring(0, lastDot),
				extname: filename.substring(lastDot + 1)
			};
		}
	}

	nest(files: string[], dirname: string): Map<string, Set<string>> {
		const parentFinder = new PreTrie();

		for (const potentialParent of files) {
			const attributes = this.getAttributes(potentialParent, dirname);
			const children = this.root.get(potentialParent, attributes);
			for (const child of children) {
				parentFinder.add(child, potentialParent);
			}
		}

		const findAllRootAncestors = (file: string, seen: Set<string> = new Set()): string[] => {
			if (seen.has(file)) { return []; }
			seen.add(file);
			const attributes = this.getAttributes(file, dirname);
			const ancestors = parentFinder.get(file, attributes);
			if (ancestors.length === 0) {
				return [file];
			}

			if (ancestors.length === 1 && ancestors[0] === file) {
				return [file];
			}

			return ancestors.flatMap(a => findAllRootAncestors(a, seen));
		};

		const result = new Map<string, Set<string>>();
		for (const file of files) {
			let ancestors = findAllRootAncestors(file);
			if (ancestors.length === 0) { ancestors = [file]; }
			for (const ancestor of ancestors) {
				let existing = result.get(ancestor);
				if (!existing) { result.set(ancestor, existing = new Set()); }
				if (file !== ancestor) {
					existing.add(file);
				}
			}
		}
		return result;
	}
}

/** Export for test only. */
export class PreTrie {
	private value: SufTrie = new SufTrie();

	private map: Map<string, PreTrie> = new Map();

	add(key: string, value: string) {
		if (key === '') {
			this.value.add(key, value);
		} else if (key[0] === '*') {
			this.value.add(key, value);
		} else {
			const head = key[0];
			const rest = key.slice(1);
			let existing = this.map.get(head);
			if (!existing) {
				this.map.set(head, existing = new PreTrie());
			}
			existing.add(rest, value);
		}
	}

	get(key: string, attributes: FilenameAttributes): string[] {
		const results: string[] = [];
		results.push(...this.value.get(key, attributes));

		const head = key[0];
		const rest = key.slice(1);
		const existing = this.map.get(head);
		if (existing) {
			results.push(...existing.get(rest, attributes));
		}

		return results;
	}

	toString(indentation = ''): string {
		const lines = [];
		if (this.value.hasItems) {
			lines.push('* => \n' + this.value.toString(indentation + '  '));
		}
		[...this.map.entries()].map(([key, trie]) =>
			lines.push('^' + key + ' => \n' + trie.toString(indentation + '  ')));
		return lines.map(l => indentation + l).join('\n');
	}
}

/** Export for test only. */
export class SufTrie {
	private star: SubstitutionString[] = [];
	private epsilon: SubstitutionString[] = [];

	private map: Map<string, SufTrie> = new Map();
	hasItems: boolean = false;

	add(key: string, value: string) {
		this.hasItems = true;
		if (key === '*') {
			this.star.push(new SubstitutionString(value));
		} else if (key === '') {
			this.epsilon.push(new SubstitutionString(value));
		} else {
			const tail = key[key.length - 1];
			const rest = key.slice(0, key.length - 1);
			if (tail === '*') {
				throw Error('Unexpected star in SufTrie key: ' + key);
			} else {
				let existing = this.map.get(tail);
				if (!existing) {
					this.map.set(tail, existing = new SufTrie());
				}
				existing.add(rest, value);
			}
		}
	}

	get(key: string, attributes: FilenameAttributes): string[] {
		const results: string[] = [];
		if (key === '') {
			results.push(...this.epsilon.map(ss => ss.substitute(attributes)));
		}
		if (this.star.length) {
			results.push(...this.star.map(ss => ss.substitute(attributes, key)));
		}

		const tail = key[key.length - 1];
		const rest = key.slice(0, key.length - 1);
		const existing = this.map.get(tail);
		if (existing) {
			results.push(...existing.get(rest, attributes));
		}

		return results;
	}

	toString(indentation = ''): string {
		const lines = [];
		if (this.star.length) {
			lines.push('* => ' + this.star.join('; '));
		}

		if (this.epsilon.length) {
			// allow-any-unicode-next-line
			lines.push('ε => ' + this.epsilon.join('; '));
		}

		[...this.map.entries()].map(([key, trie]) =>
			lines.push(key + '$' + ' => \n' + trie.toString(indentation + '  ')));

		return lines.map(l => indentation + l).join('\n');
	}
}

const enum SubstitutionType {
	capture = 'capture',
	basename = 'basename',
	dirname = 'dirname',
	extname = 'extname',
}

const substitutionStringTokenizer = /\$[({](capture|basename|dirname|extname)[)}]/g;

class SubstitutionString {

	private tokens: (string | { capture: SubstitutionType })[] = [];

	constructor(pattern: string) {
		substitutionStringTokenizer.lastIndex = 0;
		let token;
		let lastIndex = 0;
		while (token = substitutionStringTokenizer.exec(pattern)) {
			const prefix = pattern.slice(lastIndex, token.index);
			this.tokens.push(prefix);

			const type = token[1];
			switch (type) {
				case SubstitutionType.basename:
				case SubstitutionType.dirname:
				case SubstitutionType.extname:
				case SubstitutionType.capture:
					this.tokens.push({ capture: type });
					break;
				default: throw Error('unknown substitution type: ' + type);
			}
			lastIndex = token.index + token[0].length;
		}

		if (lastIndex !== pattern.length) {
			const suffix = pattern.slice(lastIndex, pattern.length);
			this.tokens.push(suffix);
		}
	}

	substitute(attributes: FilenameAttributes, capture?: string): string {
		return this.tokens.map(t => {
			if (typeof t === 'string') { return t; }
			switch (t.capture) {
				case SubstitutionType.basename: return attributes.basename;
				case SubstitutionType.dirname: return attributes.dirname;
				case SubstitutionType.extname: return attributes.extname;
				case SubstitutionType.capture: return capture || '';
			}
		}).join('');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/common/explorerModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/common/explorerModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { isEqual } from '../../../../base/common/extpath.js';
import { posix } from '../../../../base/common/path.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { IFileStat, IFileService, FileSystemProviderCapabilities } from '../../../../platform/files/common/files.js';
import { rtrim, startsWithIgnoreCase, equalsIgnoreCase } from '../../../../base/common/strings.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IDisposable, dispose } from '../../../../base/common/lifecycle.js';
import { memoize } from '../../../../base/common/decorators.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { joinPath, isEqualOrParent, basenameOrAuthority } from '../../../../base/common/resources.js';
import { IFilesConfiguration, SortOrder } from './files.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { ExplorerFileNestingTrie } from './explorerFileNestingTrie.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { IFilesConfigurationService } from '../../../services/filesConfiguration/common/filesConfigurationService.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';

export class ExplorerModel implements IDisposable {

	private _roots!: ExplorerItem[];
	private _listener: IDisposable;
	private readonly _onDidChangeRoots = new Emitter<void>();

	constructor(
		private readonly contextService: IWorkspaceContextService,
		private readonly uriIdentityService: IUriIdentityService,
		fileService: IFileService,
		configService: IConfigurationService,
		filesConfigService: IFilesConfigurationService,
	) {
		const setRoots = () => this._roots = this.contextService.getWorkspace().folders
			.map(folder => new ExplorerItem(folder.uri, fileService, configService, filesConfigService, undefined, true, false, false, false, folder.name));
		setRoots();

		this._listener = this.contextService.onDidChangeWorkspaceFolders(() => {
			setRoots();
			this._onDidChangeRoots.fire();
		});
	}

	get roots(): ExplorerItem[] {
		return this._roots;
	}

	get onDidChangeRoots(): Event<void> {
		return this._onDidChangeRoots.event;
	}

	/**
	 * Returns an array of child stat from this stat that matches with the provided path.
	 * Starts matching from the first root.
	 * Will return empty array in case the FileStat does not exist.
	 */
	findAll(resource: URI): ExplorerItem[] {
		return coalesce(this.roots.map(root => root.find(resource)));
	}

	/**
	 * Returns a FileStat that matches the passed resource.
	 * In case multiple FileStat are matching the resource (same folder opened multiple times) returns the FileStat that has the closest root.
	 * Will return undefined in case the FileStat does not exist.
	 */
	findClosest(resource: URI): ExplorerItem | null {
		const folder = this.contextService.getWorkspaceFolder(resource);
		if (folder) {
			const root = this.roots.find(r => this.uriIdentityService.extUri.isEqual(r.resource, folder.uri));
			if (root) {
				return root.find(resource);
			}
		}

		return null;
	}

	dispose(): void {
		dispose(this._listener);
	}
}

export class ExplorerItem {
	_isDirectoryResolved: boolean; // used in tests
	public error: Error | undefined = undefined;
	private _isExcluded = false;

	public nestedParent: ExplorerItem | undefined;
	public nestedChildren: ExplorerItem[] | undefined;

	constructor(
		public resource: URI,
		private readonly fileService: IFileService,
		private readonly configService: IConfigurationService,
		private readonly filesConfigService: IFilesConfigurationService,
		private _parent: ExplorerItem | undefined,
		private _isDirectory?: boolean,
		private _isSymbolicLink?: boolean,
		private _readonly?: boolean,
		private _locked?: boolean,
		private _name: string = basenameOrAuthority(resource),
		private _mtime?: number,
		private _unknown = false
	) {
		this._isDirectoryResolved = false;
	}

	get isExcluded(): boolean {
		if (this._isExcluded) {
			return true;
		}
		if (!this._parent) {
			return false;
		}

		return this._parent.isExcluded;
	}

	set isExcluded(value: boolean) {
		this._isExcluded = value;
	}

	hasChildren(filter: (stat: ExplorerItem) => boolean): boolean {
		if (this.hasNests) {
			return this.nestedChildren?.some(c => filter(c)) ?? false;
		} else {
			return this.isDirectory;
		}
	}

	get hasNests() {
		return !!(this.nestedChildren?.length);
	}

	get isDirectoryResolved(): boolean {
		return this._isDirectoryResolved;
	}

	get isSymbolicLink(): boolean {
		return !!this._isSymbolicLink;
	}

	get isDirectory(): boolean {
		return !!this._isDirectory;
	}

	get isReadonly(): boolean | IMarkdownString {
		return this.filesConfigService.isReadonly(this.resource, { resource: this.resource, name: this.name, readonly: this._readonly, locked: this._locked });
	}

	get mtime(): number | undefined {
		return this._mtime;
	}

	get name(): string {
		return this._name;
	}

	get isUnknown(): boolean {
		return this._unknown;
	}

	get parent(): ExplorerItem | undefined {
		return this._parent;
	}

	get root(): ExplorerItem {
		if (!this._parent) {
			return this;
		}

		return this._parent.root;
	}

	@memoize get children(): Map<string, ExplorerItem> {
		return new Map<string, ExplorerItem>();
	}

	private updateName(value: string): void {
		// Re-add to parent since the parent has a name map to children and the name might have changed
		this._parent?.removeChild(this);
		this._name = value;
		this._parent?.addChild(this);
	}

	getId(): string {
		let id = this.root.resource.toString() + '::' + this.resource.toString();

		if (this.isMarkedAsFiltered()) {
			id += '::findFilterResult';
		}

		return id;
	}

	toString(): string {
		return `ExplorerItem: ${this.name}`;
	}

	get isRoot(): boolean {
		return this === this.root;
	}

	static create(fileService: IFileService, configService: IConfigurationService, filesConfigService: IFilesConfigurationService, raw: IFileStat, parent: ExplorerItem | undefined, resolveTo?: readonly URI[]): ExplorerItem {
		const stat = new ExplorerItem(raw.resource, fileService, configService, filesConfigService, parent, raw.isDirectory, raw.isSymbolicLink, raw.readonly, raw.locked, raw.name, raw.mtime, !raw.isFile && !raw.isDirectory);

		// Recursively add children if present
		if (stat.isDirectory) {

			// isDirectoryResolved is a very important indicator in the stat model that tells if the folder was fully resolved
			// the folder is fully resolved if either it has a list of children or the client requested this by using the resolveTo
			// array of resource path to resolve.
			stat._isDirectoryResolved = !!raw.children || (!!resolveTo && resolveTo.some((r) => {
				return isEqualOrParent(r, stat.resource);
			}));

			// Recurse into children
			if (raw.children) {
				for (let i = 0, len = raw.children.length; i < len; i++) {
					const child = ExplorerItem.create(fileService, configService, filesConfigService, raw.children[i], stat, resolveTo);
					stat.addChild(child);
				}
			}
		}

		return stat;
	}

	/**
	 * Merges the stat which was resolved from the disk with the local stat by copying over properties
	 * and children. The merge will only consider resolved stat elements to avoid overwriting data which
	 * exists locally.
	 */
	static mergeLocalWithDisk(disk: ExplorerItem, local: ExplorerItem): void {
		if (disk.resource.toString() !== local.resource.toString()) {
			return; // Merging only supported for stats with the same resource
		}

		// Stop merging when a folder is not resolved to avoid loosing local data
		const mergingDirectories = disk.isDirectory || local.isDirectory;
		if (mergingDirectories && local._isDirectoryResolved && !disk._isDirectoryResolved) {
			return;
		}

		// Properties
		local.resource = disk.resource;
		if (!local.isRoot) {
			local.updateName(disk.name);
		}
		local._isDirectory = disk.isDirectory;
		local._mtime = disk.mtime;
		local._isDirectoryResolved = disk._isDirectoryResolved;
		local._isSymbolicLink = disk.isSymbolicLink;
		local.error = disk.error;

		// Merge Children if resolved
		if (mergingDirectories && disk._isDirectoryResolved) {

			// Map resource => stat
			const oldLocalChildren = new ResourceMap<ExplorerItem>();
			local.children.forEach(child => {
				oldLocalChildren.set(child.resource, child);
			});

			// Clear current children
			local.children.clear();

			// Merge received children
			disk.children.forEach(diskChild => {
				const formerLocalChild = oldLocalChildren.get(diskChild.resource);
				// Existing child: merge
				if (formerLocalChild) {
					ExplorerItem.mergeLocalWithDisk(diskChild, formerLocalChild);
					local.addChild(formerLocalChild);
					oldLocalChildren.delete(diskChild.resource);
				}

				// New child: add
				else {
					local.addChild(diskChild);
				}
			});

			oldLocalChildren.forEach(oldChild => {
				if (oldChild instanceof NewExplorerItem) {
					local.addChild(oldChild);
				}
			});
		}
	}

	/**
	 * Adds a child element to this folder.
	 */
	addChild(child: ExplorerItem): void {
		// Inherit some parent properties to child
		child._parent = this;
		child.updateResource(false);
		this.children.set(this.getPlatformAwareName(child.name), child);
	}

	getChild(name: string): ExplorerItem | undefined {
		return this.children.get(this.getPlatformAwareName(name));
	}

	fetchChildren(sortOrder: SortOrder): ExplorerItem[] | Promise<ExplorerItem[]> {
		const nestingConfig = this.configService.getValue<IFilesConfiguration>({ resource: this.root.resource }).explorer.fileNesting;

		// fast path when the children can be resolved sync
		if (nestingConfig.enabled && this.nestedChildren) {
			return this.nestedChildren;
		}

		return (async () => {
			if (!this._isDirectoryResolved) {
				// Resolve metadata only when the mtime is needed since this can be expensive
				// Mtime is only used when the sort order is 'modified'
				const resolveMetadata = sortOrder === SortOrder.Modified;
				this.error = undefined;
				try {
					const stat = await this.fileService.resolve(this.resource, { resolveSingleChildDescendants: true, resolveMetadata });
					const resolved = ExplorerItem.create(this.fileService, this.configService, this.filesConfigService, stat, this);
					ExplorerItem.mergeLocalWithDisk(resolved, this);
				} catch (e) {
					this.error = e;
					throw e;
				}
				this._isDirectoryResolved = true;
			}

			const items: ExplorerItem[] = [];
			if (nestingConfig.enabled) {
				const fileChildren: [string, ExplorerItem][] = [];
				const dirChildren: [string, ExplorerItem][] = [];
				for (const child of this.children.entries()) {
					child[1].nestedParent = undefined;
					if (child[1].isDirectory) {
						dirChildren.push(child);
					} else {
						fileChildren.push(child);
					}
				}

				const nested = this.fileNester.nest(
					fileChildren.map(([name]) => name),
					this.getPlatformAwareName(this.name));

				for (const [fileEntryName, fileEntryItem] of fileChildren) {
					const nestedItems = nested.get(fileEntryName);
					if (nestedItems !== undefined) {
						fileEntryItem.nestedChildren = [];
						for (const name of nestedItems.keys()) {
							const child = assertReturnsDefined(this.children.get(name));
							fileEntryItem.nestedChildren.push(child);
							child.nestedParent = fileEntryItem;
						}
						items.push(fileEntryItem);
					} else {
						fileEntryItem.nestedChildren = undefined;
					}
				}

				for (const [_, dirEntryItem] of dirChildren.values()) {
					items.push(dirEntryItem);
				}
			} else {
				this.children.forEach(child => {
					items.push(child);
				});
			}
			return items;
		})();
	}

	private _fileNester: ExplorerFileNestingTrie | undefined;
	private get fileNester(): ExplorerFileNestingTrie {
		if (!this.root._fileNester) {
			const nestingConfig = this.configService.getValue<IFilesConfiguration>({ resource: this.root.resource }).explorer.fileNesting;
			const patterns = Object.entries(nestingConfig.patterns)
				.filter(entry =>
					typeof (entry[0]) === 'string' && typeof (entry[1]) === 'string' && entry[0] && entry[1])
				.map(([parentPattern, childrenPatterns]) =>
					[
						this.getPlatformAwareName(parentPattern.trim()),
						childrenPatterns.split(',').map(p => this.getPlatformAwareName(p.trim().replace(/\u200b/g, '').trim()))
							.filter(p => p !== '')
					] as [string, string[]]);

			this.root._fileNester = new ExplorerFileNestingTrie(patterns);
		}
		return this.root._fileNester;
	}

	/**
	 * Removes a child element from this folder.
	 */
	removeChild(child: ExplorerItem): void {
		this.nestedChildren = undefined;
		this.children.delete(this.getPlatformAwareName(child.name));
	}

	forgetChildren(): void {
		this.children.clear();
		this.nestedChildren = undefined;
		this._isDirectoryResolved = false;
		this._fileNester = undefined;
	}

	private getPlatformAwareName(name: string): string {
		return this.fileService.hasCapability(this.resource, FileSystemProviderCapabilities.PathCaseSensitive) ? name : name.toLowerCase();
	}

	/**
	 * Moves this element under a new parent element.
	 */
	move(newParent: ExplorerItem): void {
		this.nestedParent?.removeChild(this);
		this._parent?.removeChild(this);
		newParent.removeChild(this); // make sure to remove any previous version of the file if any
		newParent.addChild(this);
		this.updateResource(true);
	}

	private updateResource(recursive: boolean): void {
		if (this._parent) {
			this.resource = joinPath(this._parent.resource, this.name);
		}

		if (recursive) {
			if (this.isDirectory) {
				this.children.forEach(child => {
					child.updateResource(true);
				});
			}
		}
	}

	/**
	 * Tells this stat that it was renamed. This requires changes to all children of this stat (if any)
	 * so that the path property can be updated properly.
	 */
	rename(renamedStat: { name: string; mtime?: number }): void {

		// Merge a subset of Properties that can change on rename
		this.updateName(renamedStat.name);
		this._mtime = renamedStat.mtime;

		// Update Paths including children
		this.updateResource(true);
	}

	/**
	 * Returns a child stat from this stat that matches with the provided path.
	 * Will return "null" in case the child does not exist.
	 */
	find(resource: URI): ExplorerItem | null {
		// Return if path found
		// For performance reasons try to do the comparison as fast as possible
		const ignoreCase = !this.fileService.hasCapability(resource, FileSystemProviderCapabilities.PathCaseSensitive);
		if (resource && this.resource.scheme === resource.scheme && equalsIgnoreCase(this.resource.authority, resource.authority) &&
			(ignoreCase ? startsWithIgnoreCase(resource.path, this.resource.path) : resource.path.startsWith(this.resource.path))) {
			return this.findByPath(rtrim(resource.path, posix.sep), this.resource.path.length, ignoreCase);
		}

		return null; //Unable to find
	}

	private findByPath(path: string, index: number, ignoreCase: boolean): ExplorerItem | null {
		if (isEqual(rtrim(this.resource.path, posix.sep), path, ignoreCase)) {
			return this;
		}

		if (this.isDirectory) {
			// Ignore separtor to more easily deduct the next name to search
			while (index < path.length && path[index] === posix.sep) {
				index++;
			}

			let indexOfNextSep = path.indexOf(posix.sep, index);
			if (indexOfNextSep === -1) {
				// If there is no separator take the remainder of the path
				indexOfNextSep = path.length;
			}
			// The name to search is between two separators
			const name = path.substring(index, indexOfNextSep);

			const child = this.children.get(this.getPlatformAwareName(name));

			if (child) {
				// We found a child with the given name, search inside it
				return child.findByPath(path, indexOfNextSep, ignoreCase);
			}
		}

		return null;
	}

	// Find
	private markedAsFindResult = false;
	isMarkedAsFiltered(): boolean {
		return this.markedAsFindResult;
	}

	markItemAndParentsAsFiltered(): void {
		this.markedAsFindResult = true;
		this.parent?.markItemAndParentsAsFiltered();
	}

	unmarkItemAndChildren(): void {
		this.markedAsFindResult = false;
		this.children.forEach(child => child.unmarkItemAndChildren());
	}
}

export class NewExplorerItem extends ExplorerItem {
	constructor(fileService: IFileService, configService: IConfigurationService, filesConfigService: IFilesConfigurationService, parent: ExplorerItem, isDirectory: boolean) {
		super(URI.file(''), fileService, configService, filesConfigService, parent, isDirectory);
		this._isDirectoryResolved = true;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/common/files.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/common/files.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { IEditorOptions } from '../../../../editor/common/config/editorOptions.js';
import { IWorkbenchEditorConfiguration, IEditorIdentifier, EditorResourceAccessor, SideBySideEditor } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IFilesConfiguration as PlatformIFilesConfiguration, FileChangeType, IFileService } from '../../../../platform/files/common/files.js';
import { ContextKeyExpr, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { ITextModelContentProvider } from '../../../../editor/common/services/resolverService.js';
import { Disposable, DisposableStore, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ILanguageService, ILanguageSelection } from '../../../../editor/common/languages/language.js';
import { ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { InputFocusedContextKey } from '../../../../platform/contextkey/common/contextkeys.js';
import { IEditorGroup } from '../../../services/editor/common/editorGroupsService.js';
import { Event } from '../../../../base/common/event.js';
import { ITextEditorOptions } from '../../../../platform/editor/common/editor.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { localize } from '../../../../nls.js';
import { IExpression } from '../../../../base/common/glob.js';

/**
 * Explorer viewlet id.
 */
export const VIEWLET_ID = 'workbench.view.explorer';

/**
 * Explorer file view id.
 */
export const VIEW_ID = 'workbench.explorer.fileView';

/**
 * Context Keys to use with keybindings for the Explorer and Open Editors view
 */
export const ExplorerViewletVisibleContext = new RawContextKey<boolean>('explorerViewletVisible', true, { type: 'boolean', description: localize('explorerViewletVisible', "True when the EXPLORER viewlet is visible.") });
export const FoldersViewVisibleContext = new RawContextKey<boolean>('foldersViewVisible', true, { type: 'boolean', description: localize('foldersViewVisible', "True when the FOLDERS view (the file tree within the explorer view container) is visible.") });
export const ExplorerFolderContext = new RawContextKey<boolean>('explorerResourceIsFolder', false, { type: 'boolean', description: localize('explorerResourceIsFolder', "True when the focused item in the EXPLORER is a folder.") });
export const ExplorerResourceReadonlyContext = new RawContextKey<boolean>('explorerResourceReadonly', false, { type: 'boolean', description: localize('explorerResourceReadonly', "True when the focused item in the EXPLORER is read-only.") });
export const ExplorerResourceWritableContext = ExplorerResourceReadonlyContext.toNegated();
export const ExplorerResourceParentReadOnlyContext = new RawContextKey<boolean>('explorerResourceParentReadonly', false, { type: 'boolean', description: localize('explorerResourceParentReadonly', "True when the focused item in the EXPLORER's parent is read-only.") });

/**
 * Comma separated list of editor ids that can be used for the selected explorer resource.
 */
export const ExplorerResourceAvailableEditorIdsContext = new RawContextKey<string>('explorerResourceAvailableEditorIds', '');
export const ExplorerRootContext = new RawContextKey<boolean>('explorerResourceIsRoot', false, { type: 'boolean', description: localize('explorerResourceIsRoot', "True when the focused item in the EXPLORER is a root folder.") });
export const ExplorerResourceCut = new RawContextKey<boolean>('explorerResourceCut', false, { type: 'boolean', description: localize('explorerResourceCut', "True when an item in the EXPLORER has been cut for cut and paste.") });
export const ExplorerResourceMoveableToTrash = new RawContextKey<boolean>('explorerResourceMoveableToTrash', false, { type: 'boolean', description: localize('explorerResourceMoveableToTrash', "True when the focused item in the EXPLORER can be moved to trash.") });
export const FilesExplorerFocusedContext = new RawContextKey<boolean>('filesExplorerFocus', true, { type: 'boolean', description: localize('filesExplorerFocus', "True when the focus is inside the EXPLORER view.") });
export const OpenEditorsFocusedContext = new RawContextKey<boolean>('openEditorsFocus', true, { type: 'boolean', description: localize('openEditorsFocus', "True when the focus is inside the OPEN EDITORS view.") });
export const ExplorerFocusedContext = new RawContextKey<boolean>('explorerViewletFocus', true, { type: 'boolean', description: localize('explorerViewletFocus', "True when the focus is inside the EXPLORER viewlet.") });
export const ExplorerFindProviderActive = new RawContextKey<boolean>('explorerFindProviderActive', false, { type: 'boolean', description: localize('explorerFindProviderActive', "True when the explorer tree is using the explorer find provider.") });

// compressed nodes
export const ExplorerCompressedFocusContext = new RawContextKey<boolean>('explorerViewletCompressedFocus', true, { type: 'boolean', description: localize('explorerViewletCompressedFocus', "True when the focused item in the EXPLORER view is a compact item.") });
export const ExplorerCompressedFirstFocusContext = new RawContextKey<boolean>('explorerViewletCompressedFirstFocus', true, { type: 'boolean', description: localize('explorerViewletCompressedFirstFocus', "True when the focus is inside a compact item's first part in the EXPLORER view.") });
export const ExplorerCompressedLastFocusContext = new RawContextKey<boolean>('explorerViewletCompressedLastFocus', true, { type: 'boolean', description: localize('explorerViewletCompressedLastFocus', "True when the focus is inside a compact item's last part in the EXPLORER view.") });

export const ViewHasSomeCollapsibleRootItemContext = new RawContextKey<boolean>('viewHasSomeCollapsibleItem', false, { type: 'boolean', description: localize('viewHasSomeCollapsibleItem', "True when a workspace in the EXPLORER view has some collapsible root child.") });

export const FilesExplorerFocusCondition = ContextKeyExpr.and(FoldersViewVisibleContext, FilesExplorerFocusedContext, ContextKeyExpr.not(InputFocusedContextKey));
export const ExplorerFocusCondition = ContextKeyExpr.and(FoldersViewVisibleContext, ExplorerFocusedContext, ContextKeyExpr.not(InputFocusedContextKey));

/**
 * Text file editor id.
 */
export const TEXT_FILE_EDITOR_ID = 'workbench.editors.files.textFileEditor';

/**
 * File editor input id.
 */
export const FILE_EDITOR_INPUT_ID = 'workbench.editors.files.fileEditorInput';

/**
 * Binary file editor id.
 */
export const BINARY_FILE_EDITOR_ID = 'workbench.editors.files.binaryFileEditor';

/**
 * Language identifier for binary files opened as text.
 */
export const BINARY_TEXT_FILE_MODE = 'code-text-binary';

export interface IFilesConfiguration extends PlatformIFilesConfiguration, IWorkbenchEditorConfiguration {
	explorer: {
		openEditors: {
			visible: number;
			sortOrder: 'editorOrder' | 'alphabetical' | 'fullPath';
		};
		autoReveal: boolean | 'focusNoScroll';
		autoRevealExclude: IExpression;
		enableDragAndDrop: boolean;
		confirmDelete: boolean;
		enableUndo: boolean;
		confirmUndo: UndoConfirmLevel;
		expandSingleFolderWorkspaces: boolean;
		sortOrder: SortOrder;
		sortOrderLexicographicOptions: LexicographicOptions;
		sortOrderReverse: boolean;
		decorations: {
			colors: boolean;
			badges: boolean;
		};
		incrementalNaming: 'simple' | 'smart' | 'disabled';
		excludeGitIgnore: boolean;
		fileNesting: {
			enabled: boolean;
			expand: boolean;
			patterns: { [parent: string]: string };
		};
		autoOpenDroppedFile: boolean;
	};
	editor: IEditorOptions;
}

export interface IFileResource {
	resource: URI;
	isDirectory?: boolean;
}

export const enum SortOrder {
	Default = 'default',
	Mixed = 'mixed',
	FilesFirst = 'filesFirst',
	Type = 'type',
	Modified = 'modified',
	FoldersNestsFiles = 'foldersNestsFiles',
}

export const enum UndoConfirmLevel {
	Verbose = 'verbose',
	Default = 'default',
	Light = 'light',
}

export const enum LexicographicOptions {
	Default = 'default',
	Upper = 'upper',
	Lower = 'lower',
	Unicode = 'unicode',
}

export interface ISortOrderConfiguration {
	sortOrder: SortOrder;
	lexicographicOptions: LexicographicOptions;
	reverse: boolean;
}

export class TextFileContentProvider extends Disposable implements ITextModelContentProvider {
	private readonly fileWatcherDisposable = this._register(new MutableDisposable());

	constructor(
		@ITextFileService private readonly textFileService: ITextFileService,
		@IFileService private readonly fileService: IFileService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IModelService private readonly modelService: IModelService
	) {
		super();
	}

	static async open(resource: URI, scheme: string, label: string, editorService: IEditorService, options?: ITextEditorOptions): Promise<void> {
		await editorService.openEditor({
			original: { resource: TextFileContentProvider.resourceToTextFile(scheme, resource) },
			modified: { resource },
			label,
			options
		});
	}

	private static resourceToTextFile(scheme: string, resource: URI): URI {
		return resource.with({ scheme, query: JSON.stringify({ scheme: resource.scheme, query: resource.query }) });
	}

	private static textFileToResource(resource: URI): URI {
		const { scheme, query } = JSON.parse(resource.query);

		return resource.with({ scheme, query });
	}

	async provideTextContent(resource: URI): Promise<ITextModel | null> {
		if (!resource.query) {
			// We require the URI to use the `query` to transport the original scheme and query
			// as done by `resourceToTextFile`
			return null;
		}

		const savedFileResource = TextFileContentProvider.textFileToResource(resource);

		// Make sure our text file is resolved up to date
		const codeEditorModel = await this.resolveEditorModel(resource);

		// Make sure to keep contents up to date when it changes
		if (!this.fileWatcherDisposable.value) {
			const disposables = new DisposableStore();
			this.fileWatcherDisposable.value = disposables;
			disposables.add(this.fileService.onDidFilesChange(changes => {
				if (changes.contains(savedFileResource, FileChangeType.UPDATED)) {
					this.resolveEditorModel(resource, false /* do not create if missing */); // update model when resource changes
				}
			}));

			if (codeEditorModel) {
				disposables.add(Event.once(codeEditorModel.onWillDispose)(() => this.fileWatcherDisposable.clear()));
			}
		}

		return codeEditorModel;
	}

	private resolveEditorModel(resource: URI, createAsNeeded?: true): Promise<ITextModel>;
	private resolveEditorModel(resource: URI, createAsNeeded?: boolean): Promise<ITextModel | null>;
	private async resolveEditorModel(resource: URI, createAsNeeded: boolean = true): Promise<ITextModel | null> {
		const savedFileResource = TextFileContentProvider.textFileToResource(resource);

		const content = await this.textFileService.readStream(savedFileResource);

		let codeEditorModel = this.modelService.getModel(resource);
		if (codeEditorModel) {
			this.modelService.updateModel(codeEditorModel, content.value);
		} else if (createAsNeeded) {
			const textFileModel = this.modelService.getModel(savedFileResource);

			let languageSelector: ILanguageSelection;
			if (textFileModel) {
				languageSelector = this.languageService.createById(textFileModel.getLanguageId());
			} else {
				languageSelector = this.languageService.createByFilepathOrFirstLine(savedFileResource);
			}

			codeEditorModel = this.modelService.createModel(content.value, languageSelector, resource);
		}

		return codeEditorModel;
	}
}

export class OpenEditor implements IEditorIdentifier {

	private id: number;
	private static COUNTER = 0;

	constructor(private _editor: EditorInput, private _group: IEditorGroup) {
		this.id = OpenEditor.COUNTER++;
	}

	get editor() {
		return this._editor;
	}

	get group() {
		return this._group;
	}

	get groupId() {
		return this._group.id;
	}

	getId(): string {
		return `openeditor:${this.groupId}:${this.id}`;
	}

	isPreview(): boolean {
		return !this._group.isPinned(this.editor);
	}

	isSticky(): boolean {
		return this._group.isSticky(this.editor);
	}

	getResource(): URI | undefined {
		return EditorResourceAccessor.getOriginalUri(this.editor, { supportSideBySide: SideBySideEditor.PRIMARY });
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/electron-browser/fileActions.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/electron-browser/fileActions.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { URI } from '../../../../base/common/uri.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { isWindows, isMacintosh } from '../../../../base/common/platform.js';
import { Schemas } from '../../../../base/common/network.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { KeyMod, KeyCode, KeyChord } from '../../../../base/common/keyCodes.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { getMultiSelectedResources, IExplorerService } from '../browser/files.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { revealResourcesInOS } from './fileCommands.js';
import { MenuRegistry, MenuId } from '../../../../platform/actions/common/actions.js';
import { ResourceContextKey } from '../../../common/contextkeys.js';
import { appendToCommandPalette, appendEditorTitleContextMenuItem } from '../browser/fileActions.contribution.js';
import { SideBySideEditor, EditorResourceAccessor } from '../../../common/editor.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { IListService } from '../../../../platform/list/browser/listService.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';

const REVEAL_IN_OS_COMMAND_ID = 'revealFileInOS';
const REVEAL_IN_OS_LABEL = isWindows ? nls.localize2('revealInWindows', "Reveal in File Explorer") : isMacintosh ? nls.localize2('revealInMac', "Reveal in Finder") : nls.localize2('openContainer', "Open Containing Folder");
const REVEAL_IN_OS_WHEN_CONTEXT = ContextKeyExpr.or(ResourceContextKey.Scheme.isEqualTo(Schemas.file), ResourceContextKey.Scheme.isEqualTo(Schemas.vscodeUserData));

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: REVEAL_IN_OS_COMMAND_ID,
	weight: KeybindingWeight.WorkbenchContrib,
	when: EditorContextKeys.focus.toNegated(),
	primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyR,
	win: {
		primary: KeyMod.Shift | KeyMod.Alt | KeyCode.KeyR
	},
	handler: (accessor: ServicesAccessor, resource: URI | object) => {
		const resources = getMultiSelectedResources(resource, accessor.get(IListService), accessor.get(IEditorService), accessor.get(IEditorGroupsService), accessor.get(IExplorerService));
		revealResourcesInOS(resources, accessor.get(INativeHostService), accessor.get(IWorkspaceContextService));
	}
});

const REVEAL_ACTIVE_FILE_IN_OS_COMMAND_ID = 'workbench.action.files.revealActiveFileInWindows';

KeybindingsRegistry.registerCommandAndKeybindingRule({
	weight: KeybindingWeight.WorkbenchContrib,
	when: undefined,
	primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.KeyR),
	id: REVEAL_ACTIVE_FILE_IN_OS_COMMAND_ID,
	handler: (accessor: ServicesAccessor) => {
		const editorService = accessor.get(IEditorService);
		const activeInput = editorService.activeEditor;
		const resource = EditorResourceAccessor.getOriginalUri(activeInput, { filterByScheme: Schemas.file, supportSideBySide: SideBySideEditor.PRIMARY });
		const resources = resource ? [resource] : [];
		revealResourcesInOS(resources, accessor.get(INativeHostService), accessor.get(IWorkspaceContextService));
	}
});

appendEditorTitleContextMenuItem(REVEAL_IN_OS_COMMAND_ID, REVEAL_IN_OS_LABEL.value, REVEAL_IN_OS_WHEN_CONTEXT, '2_files', false, 0);

// Menu registration - open editors

const revealInOsCommand = {
	id: REVEAL_IN_OS_COMMAND_ID,
	title: REVEAL_IN_OS_LABEL.value
};
MenuRegistry.appendMenuItem(MenuId.OpenEditorsContext, {
	group: 'navigation',
	order: 20,
	command: revealInOsCommand,
	when: REVEAL_IN_OS_WHEN_CONTEXT
});
MenuRegistry.appendMenuItem(MenuId.OpenEditorsContextShare, {
	title: nls.localize('miShare', "Share"),
	submenu: MenuId.MenubarShare,
	group: 'share',
	order: 3,
});

// Menu registration - explorer

MenuRegistry.appendMenuItem(MenuId.ExplorerContext, {
	group: 'navigation',
	order: 20,
	command: revealInOsCommand,
	when: REVEAL_IN_OS_WHEN_CONTEXT
});

// Command Palette

const category = nls.localize2('filesCategory', "File");
appendToCommandPalette({
	id: REVEAL_IN_OS_COMMAND_ID,
	title: REVEAL_IN_OS_LABEL,
	category: category
}, REVEAL_IN_OS_WHEN_CONTEXT);

// Menu registration - chat attachments context

MenuRegistry.appendMenuItem(MenuId.ChatAttachmentsContext, {
	group: 'navigation',
	order: 20,
	command: revealInOsCommand,
	when: REVEAL_IN_OS_WHEN_CONTEXT
});

// Menu registration - chat inline anchor

MenuRegistry.appendMenuItem(MenuId.ChatInlineResourceAnchorContext, {
	group: 'navigation',
	order: 20,
	command: revealInOsCommand,
	when: REVEAL_IN_OS_WHEN_CONTEXT
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/electron-browser/fileCommands.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/electron-browser/fileCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { sequence } from '../../../../base/common/async.js';
import { Schemas } from '../../../../base/common/network.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';

// Commands

export function revealResourcesInOS(resources: URI[], nativeHostService: INativeHostService, workspaceContextService: IWorkspaceContextService): void {
	if (resources.length) {
		sequence(resources.map(r => async () => {
			if (r.scheme === Schemas.file || r.scheme === Schemas.vscodeUserData) {
				nativeHostService.showItemInFolder(r.with({ scheme: Schemas.file }).fsPath);
			}
		}));
	} else if (workspaceContextService.getWorkspace().folders.length) {
		const uri = workspaceContextService.getWorkspace().folders[0].uri;
		if (uri.scheme === Schemas.file) {
			nativeHostService.showItemInFolder(uri.fsPath);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/test/browser/editorAutoSave.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/test/browser/editorAutoSave.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Event } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite, toResource } from '../../../../../base/test/common/utils.js';
import { IAccessibilitySignalService } from '../../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { UriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentityService.js';
import { TestWorkspace } from '../../../../../platform/workspace/test/common/testWorkspace.js';
import { EditorAutoSave } from '../../../../browser/parts/editor/editorAutoSave.js';
import { DEFAULT_EDITOR_ASSOCIATION } from '../../../../common/editor.js';
import { EditorService } from '../../../../services/editor/browser/editorService.js';
import { IEditorGroupsService } from '../../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { IFilesConfigurationService } from '../../../../services/filesConfiguration/common/filesConfigurationService.js';
import { TextFileEditorModelManager } from '../../../../services/textfile/common/textFileEditorModelManager.js';
import { ITextFileEditorModel } from '../../../../services/textfile/common/textfiles.js';
import { createEditorPart, registerTestFileEditor, TestEnvironmentService, TestFilesConfigurationService, TestServiceAccessor, TestTextResourceConfigurationService, workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { TestContextService, TestFileService, TestMarkerService } from '../../../../test/common/workbenchTestServices.js';

suite('EditorAutoSave', () => {

	const disposables = new DisposableStore();

	setup(() => {
		disposables.add(registerTestFileEditor());
	});

	teardown(() => {
		disposables.clear();
	});

	async function createEditorAutoSave(autoSaveConfig: object): Promise<TestServiceAccessor> {
		const instantiationService = workbenchInstantiationService(undefined, disposables);

		const configurationService = new TestConfigurationService();
		configurationService.setUserConfiguration('files', autoSaveConfig);
		instantiationService.stub(IConfigurationService, configurationService);
		// eslint-disable-next-line local/code-no-any-casts
		instantiationService.stub(IAccessibilitySignalService, {
			playSignal: async () => { },
			isSoundEnabled(signal: unknown) { return false; },
		} as any);
		instantiationService.stub(IFilesConfigurationService, disposables.add(new TestFilesConfigurationService(
			<IContextKeyService>instantiationService.createInstance(MockContextKeyService),
			configurationService,
			new TestContextService(TestWorkspace),
			TestEnvironmentService,
			disposables.add(new UriIdentityService(disposables.add(new TestFileService()))),
			disposables.add(new TestFileService()),
			new TestMarkerService(),
			new TestTextResourceConfigurationService(configurationService)
		)));

		const part = await createEditorPart(instantiationService, disposables);
		instantiationService.stub(IEditorGroupsService, part);

		const editorService: EditorService = disposables.add(instantiationService.createInstance(EditorService, undefined));
		instantiationService.stub(IEditorService, editorService);

		const accessor = instantiationService.createInstance(TestServiceAccessor);
		disposables.add((<TextFileEditorModelManager>accessor.textFileService.files));

		disposables.add(instantiationService.createInstance(EditorAutoSave));

		return accessor;
	}

	test('editor auto saves after short delay if configured', async function () {
		const accessor = await createEditorAutoSave({ autoSave: 'afterDelay', autoSaveDelay: 1 });

		const resource = toResource.call(this, '/path/index.txt');

		const model: ITextFileEditorModel = disposables.add(await accessor.textFileService.files.resolve(resource));
		model.textEditorModel?.setValue('Super Good');

		assert.ok(model.isDirty());

		await awaitModelSaved(model);

		assert.strictEqual(model.isDirty(), false);
	});

	test('editor auto saves on focus change if configured', async function () {
		const accessor = await createEditorAutoSave({ autoSave: 'onFocusChange' });

		const resource = toResource.call(this, '/path/index.txt');
		await accessor.editorService.openEditor({ resource, options: { override: DEFAULT_EDITOR_ASSOCIATION.id } });

		const model: ITextFileEditorModel = disposables.add(await accessor.textFileService.files.resolve(resource));
		model.textEditorModel?.setValue('Super Good');

		assert.ok(model.isDirty());

		const editorPane = await accessor.editorService.openEditor({ resource: toResource.call(this, '/path/index_other.txt') });

		await awaitModelSaved(model);

		assert.strictEqual(model.isDirty(), false);

		await editorPane?.group.closeAllEditors();
	});

	function awaitModelSaved(model: ITextFileEditorModel): Promise<void> {
		return Event.toPromise(Event.once(model.onDidChangeDirty));
	}

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/test/browser/explorerFileNestingTrie.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/test/browser/explorerFileNestingTrie.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { PreTrie, ExplorerFileNestingTrie, SufTrie } from '../../common/explorerFileNestingTrie.js';
import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

const fakeFilenameAttributes = { dirname: 'mydir', basename: '', extname: '' };

suite('SufTrie', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('exactMatches', () => {
		const t = new SufTrie();
		t.add('.npmrc', 'MyKey');
		assert.deepStrictEqual(t.get('.npmrc', fakeFilenameAttributes), ['MyKey']);
		assert.deepStrictEqual(t.get('.npmrcs', fakeFilenameAttributes), []);
		assert.deepStrictEqual(t.get('a.npmrc', fakeFilenameAttributes), []);
	});

	test('starMatches', () => {
		const t = new SufTrie();
		t.add('*.npmrc', 'MyKey');
		assert.deepStrictEqual(t.get('.npmrc', fakeFilenameAttributes), ['MyKey']);
		assert.deepStrictEqual(t.get('npmrc', fakeFilenameAttributes), []);
		assert.deepStrictEqual(t.get('.npmrcs', fakeFilenameAttributes), []);
		assert.deepStrictEqual(t.get('a.npmrc', fakeFilenameAttributes), ['MyKey']);
		assert.deepStrictEqual(t.get('a.b.c.d.npmrc', fakeFilenameAttributes), ['MyKey']);
	});

	test('starSubstitutes', () => {
		const t = new SufTrie();
		t.add('*.npmrc', '${capture}.json');
		assert.deepStrictEqual(t.get('.npmrc', fakeFilenameAttributes), ['.json']);
		assert.deepStrictEqual(t.get('npmrc', fakeFilenameAttributes), []);
		assert.deepStrictEqual(t.get('.npmrcs', fakeFilenameAttributes), []);
		assert.deepStrictEqual(t.get('a.npmrc', fakeFilenameAttributes), ['a.json']);
		assert.deepStrictEqual(t.get('a.b.c.d.npmrc', fakeFilenameAttributes), ['a.b.c.d.json']);
	});

	test('multiMatches', () => {
		const t = new SufTrie();
		t.add('*.npmrc', 'Key1');
		t.add('*.json', 'Key2');
		t.add('*d.npmrc', 'Key3');
		assert.deepStrictEqual(t.get('.npmrc', fakeFilenameAttributes), ['Key1']);
		assert.deepStrictEqual(t.get('npmrc', fakeFilenameAttributes), []);
		assert.deepStrictEqual(t.get('.npmrcs', fakeFilenameAttributes), []);
		assert.deepStrictEqual(t.get('.json', fakeFilenameAttributes), ['Key2']);
		assert.deepStrictEqual(t.get('a.json', fakeFilenameAttributes), ['Key2']);
		assert.deepStrictEqual(t.get('a.npmrc', fakeFilenameAttributes), ['Key1']);
		assert.deepStrictEqual(t.get('a.b.c.d.npmrc', fakeFilenameAttributes), ['Key1', 'Key3']);
	});

	test('multiSubstitutes', () => {
		const t = new SufTrie();
		t.add('*.npmrc', 'Key1.${capture}.js');
		t.add('*.json', 'Key2.${capture}.js');
		t.add('*d.npmrc', 'Key3.${capture}.js');
		assert.deepStrictEqual(t.get('.npmrc', fakeFilenameAttributes), ['Key1..js']);
		assert.deepStrictEqual(t.get('npmrc', fakeFilenameAttributes), []);
		assert.deepStrictEqual(t.get('.npmrcs', fakeFilenameAttributes), []);
		assert.deepStrictEqual(t.get('.json', fakeFilenameAttributes), ['Key2..js']);
		assert.deepStrictEqual(t.get('a.json', fakeFilenameAttributes), ['Key2.a.js']);
		assert.deepStrictEqual(t.get('a.npmrc', fakeFilenameAttributes), ['Key1.a.js']);
		assert.deepStrictEqual(t.get('a.b.cd.npmrc', fakeFilenameAttributes), ['Key1.a.b.cd.js', 'Key3.a.b.c.js']);
		assert.deepStrictEqual(t.get('a.b.c.d.npmrc', fakeFilenameAttributes), ['Key1.a.b.c.d.js', 'Key3.a.b.c..js']);
	});
});

suite('PreTrie', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('exactMatches', () => {
		const t = new PreTrie();
		t.add('.npmrc', 'MyKey');
		assert.deepStrictEqual(t.get('.npmrc', fakeFilenameAttributes), ['MyKey']);
		assert.deepStrictEqual(t.get('.npmrcs', fakeFilenameAttributes), []);
		assert.deepStrictEqual(t.get('a.npmrc', fakeFilenameAttributes), []);
	});

	test('starMatches', () => {
		const t = new PreTrie();
		t.add('*.npmrc', 'MyKey');
		assert.deepStrictEqual(t.get('.npmrc', fakeFilenameAttributes), ['MyKey']);
		assert.deepStrictEqual(t.get('npmrc', fakeFilenameAttributes), []);
		assert.deepStrictEqual(t.get('.npmrcs', fakeFilenameAttributes), []);
		assert.deepStrictEqual(t.get('a.npmrc', fakeFilenameAttributes), ['MyKey']);
		assert.deepStrictEqual(t.get('a.b.c.d.npmrc', fakeFilenameAttributes), ['MyKey']);
	});

	test('starSubstitutes', () => {
		const t = new PreTrie();
		t.add('*.npmrc', '${capture}.json');
		assert.deepStrictEqual(t.get('.npmrc', fakeFilenameAttributes), ['.json']);
		assert.deepStrictEqual(t.get('npmrc', fakeFilenameAttributes), []);
		assert.deepStrictEqual(t.get('.npmrcs', fakeFilenameAttributes), []);
		assert.deepStrictEqual(t.get('a.npmrc', fakeFilenameAttributes), ['a.json']);
		assert.deepStrictEqual(t.get('a.b.c.d.npmrc', fakeFilenameAttributes), ['a.b.c.d.json']);
	});

	test('multiMatches', () => {
		const t = new PreTrie();
		t.add('*.npmrc', 'Key1');
		t.add('*.json', 'Key2');
		t.add('*d.npmrc', 'Key3');
		assert.deepStrictEqual(t.get('.npmrc', fakeFilenameAttributes), ['Key1']);
		assert.deepStrictEqual(t.get('npmrc', fakeFilenameAttributes), []);
		assert.deepStrictEqual(t.get('.npmrcs', fakeFilenameAttributes), []);
		assert.deepStrictEqual(t.get('.json', fakeFilenameAttributes), ['Key2']);
		assert.deepStrictEqual(t.get('a.json', fakeFilenameAttributes), ['Key2']);
		assert.deepStrictEqual(t.get('a.npmrc', fakeFilenameAttributes), ['Key1']);
		assert.deepStrictEqual(t.get('a.b.c.d.npmrc', fakeFilenameAttributes), ['Key1', 'Key3']);
	});

	test('multiSubstitutes', () => {
		const t = new PreTrie();
		t.add('*.npmrc', 'Key1.${capture}.js');
		t.add('*.json', 'Key2.${capture}.js');
		t.add('*d.npmrc', 'Key3.${capture}.js');
		assert.deepStrictEqual(t.get('.npmrc', fakeFilenameAttributes), ['Key1..js']);
		assert.deepStrictEqual(t.get('npmrc', fakeFilenameAttributes), []);
		assert.deepStrictEqual(t.get('.npmrcs', fakeFilenameAttributes), []);
		assert.deepStrictEqual(t.get('.json', fakeFilenameAttributes), ['Key2..js']);
		assert.deepStrictEqual(t.get('a.json', fakeFilenameAttributes), ['Key2.a.js']);
		assert.deepStrictEqual(t.get('a.npmrc', fakeFilenameAttributes), ['Key1.a.js']);
		assert.deepStrictEqual(t.get('a.b.cd.npmrc', fakeFilenameAttributes), ['Key1.a.b.cd.js', 'Key3.a.b.c.js']);
		assert.deepStrictEqual(t.get('a.b.c.d.npmrc', fakeFilenameAttributes), ['Key1.a.b.c.d.js', 'Key3.a.b.c..js']);
	});


	test('emptyMatches', () => {
		const t = new PreTrie();
		t.add('package*json', 'package');
		assert.deepStrictEqual(t.get('package.json', fakeFilenameAttributes), ['package']);
		assert.deepStrictEqual(t.get('packagejson', fakeFilenameAttributes), ['package']);
		assert.deepStrictEqual(t.get('package-lock.json', fakeFilenameAttributes), ['package']);
	});
});

suite('StarTrie', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	const assertMapEquals = (actual: Map<string, Set<string>>, expected: Record<string, string[]>) => {
		const actualStr = [...actual.entries()].map(e => `${e[0]} => [${[...e[1].keys()].join()}]`);
		const expectedStr = Object.entries(expected).map(e => `${e[0]}: [${[e[1]].join()}]`);
		const bigMsg = actualStr + '===' + expectedStr;
		assert.strictEqual(actual.size, Object.keys(expected).length, bigMsg);
		for (const parent of actual.keys()) {
			const act = actual.get(parent)!;
			const exp = expected[parent];
			const str = [...act.keys()].join() + '===' + exp.join();
			const msg = bigMsg + '\n' + str;
			assert(act.size === exp.length, msg);
			for (const child of exp) {
				assert(act.has(child), msg);
			}
		}
	};

	test('does added extension nesting', () => {
		const t = new ExplorerFileNestingTrie([
			['*', ['${capture}.*']],
		]);
		const nesting = t.nest([
			'file',
			'file.json',
			'boop.test',
			'boop.test1',
			'boop.test.1',
			'beep',
			'beep.test1',
			'beep.boop.test1',
			'beep.boop.test2',
			'beep.boop.a',
		], 'mydir');
		assertMapEquals(nesting, {
			'file': ['file.json'],
			'boop.test': ['boop.test.1'],
			'boop.test1': [],
			'beep': ['beep.test1', 'beep.boop.test1', 'beep.boop.test2', 'beep.boop.a']
		});
	});

	test('does ext specific nesting', () => {
		const t = new ExplorerFileNestingTrie([
			['*.ts', ['${capture}.js']],
			['*.js', ['${capture}.map']],
		]);
		const nesting = t.nest([
			'a.ts',
			'a.js',
			'a.jss',
			'ab.js',
			'b.js',
			'b.map',
			'c.ts',
			'c.js',
			'c.map',
			'd.ts',
			'd.map',
		], 'mydir');
		assertMapEquals(nesting, {
			'a.ts': ['a.js'],
			'ab.js': [],
			'a.jss': [],
			'b.js': ['b.map'],
			'c.ts': ['c.js', 'c.map'],
			'd.ts': [],
			'd.map': [],
		});
	});

	test('handles loops', () => {
		const t = new ExplorerFileNestingTrie([
			['*.a', ['${capture}.b', '${capture}.c']],
			['*.b', ['${capture}.a']],
			['*.c', ['${capture}.d']],

			['*.aa', ['${capture}.bb']],
			['*.bb', ['${capture}.cc', '${capture}.dd']],
			['*.cc', ['${capture}.aa']],
			['*.dd', ['${capture}.ee']],
		]);
		const nesting = t.nest([
			'.a', '.b', '.c', '.d',
			'a.a', 'a.b', 'a.d',
			'a.aa', 'a.bb', 'a.cc',
			'b.aa', 'b.bb',
			'c.bb', 'c.cc',
			'd.aa', 'd.cc',
			'e.aa', 'e.bb', 'e.dd', 'e.ee',
			'f.aa', 'f.bb', 'f.cc', 'f.dd', 'f.ee',
		], 'mydir');

		assertMapEquals(nesting, {
			'.a': [], '.b': [], '.c': [], '.d': [],
			'a.a': [], 'a.b': [], 'a.d': [],
			'a.aa': [], 'a.bb': [], 'a.cc': [],
			'b.aa': ['b.bb'],
			'c.bb': ['c.cc'],
			'd.cc': ['d.aa'],
			'e.aa': ['e.bb', 'e.dd', 'e.ee'],
			'f.aa': [], 'f.bb': [], 'f.cc': [], 'f.dd': [], 'f.ee': []
		});
	});

	test('does general bidirectional suffix matching', () => {
		const t = new ExplorerFileNestingTrie([
			['*-vsdoc.js', ['${capture}.js']],
			['*.js', ['${capture}-vscdoc.js']],
		]);

		const nesting = t.nest([
			'a-vsdoc.js',
			'a.js',
			'b.js',
			'b-vscdoc.js',
		], 'mydir');

		assertMapEquals(nesting, {
			'a-vsdoc.js': ['a.js'],
			'b.js': ['b-vscdoc.js'],
		});
	});

	test('does general bidirectional prefix matching', () => {
		const t = new ExplorerFileNestingTrie([
			['vsdoc-*.js', ['${capture}.js']],
			['*.js', ['vscdoc-${capture}.js']],
		]);

		const nesting = t.nest([
			'vsdoc-a.js',
			'a.js',
			'b.js',
			'vscdoc-b.js',
		], 'mydir');

		assertMapEquals(nesting, {
			'vsdoc-a.js': ['a.js'],
			'b.js': ['vscdoc-b.js'],
		});
	});

	test('does general bidirectional general matching', () => {
		const t = new ExplorerFileNestingTrie([
			['foo-*-bar.js', ['${capture}.js']],
			['*.js', ['bib-${capture}-bap.js']],
		]);

		const nesting = t.nest([
			'foo-a-bar.js',
			'a.js',
			'b.js',
			'bib-b-bap.js',
		], 'mydir');

		assertMapEquals(nesting, {
			'foo-a-bar.js': ['a.js'],
			'b.js': ['bib-b-bap.js'],
		});
	});

	test('does extension specific path segment matching', () => {
		const t = new ExplorerFileNestingTrie([
			['*.js', ['${capture}.*.js']],
		]);

		const nesting = t.nest([
			'foo.js',
			'foo.test.js',
			'fooTest.js',
			'bar.js.js',
		], 'mydir');

		assertMapEquals(nesting, {
			'foo.js': ['foo.test.js'],
			'fooTest.js': [],
			'bar.js.js': [],
		});
	});

	test('does exact match nesting', () => {
		const t = new ExplorerFileNestingTrie([
			['package.json', ['.npmrc', 'npm-shrinkwrap.json', 'yarn.lock', '.yarnclean', '.yarnignore', '.yarn-integrity', '.yarnrc']],
			['bower.json', ['.bowerrc']],
		]);

		const nesting = t.nest([
			'package.json',
			'.npmrc', 'npm-shrinkwrap.json', 'yarn.lock',
			'.bowerrc',
		], 'mydir');

		assertMapEquals(nesting, {
			'package.json': [
				'.npmrc', 'npm-shrinkwrap.json', 'yarn.lock'],
			'.bowerrc': [],
		});
	});

	test('eslint test', () => {
		const t = new ExplorerFileNestingTrie([
			['.eslintrc*', ['.eslint*']],
		]);

		const nesting1 = t.nest([
			'.eslintrc.json',
			'.eslintignore',
		], 'mydir');

		assertMapEquals(nesting1, {
			'.eslintrc.json': ['.eslintignore'],
		});

		const nesting2 = t.nest([
			'.eslintrc',
			'.eslintignore',
		], 'mydir');

		assertMapEquals(nesting2, {
			'.eslintrc': ['.eslintignore'],
		});
	});

	test('basename expansion', () => {
		const t = new ExplorerFileNestingTrie([
			['*-vsdoc.js', ['${basename}.doc']],
		]);

		const nesting1 = t.nest([
			'boop-vsdoc.js',
			'boop-vsdoc.doc',
			'boop.doc',
		], 'mydir');

		assertMapEquals(nesting1, {
			'boop-vsdoc.js': ['boop-vsdoc.doc'],
			'boop.doc': [],
		});
	});

	test('extname expansion', () => {
		const t = new ExplorerFileNestingTrie([
			['*-vsdoc.js', ['${extname}.doc']],
		]);

		const nesting1 = t.nest([
			'boop-vsdoc.js',
			'js.doc',
			'boop.doc',
		], 'mydir');

		assertMapEquals(nesting1, {
			'boop-vsdoc.js': ['js.doc'],
			'boop.doc': [],
		});
	});

	test('added segment matcher', () => {
		const t = new ExplorerFileNestingTrie([
			['*', ['${basename}.*.${extname}']],
		]);

		const nesting1 = t.nest([
			'some.file',
			'some.html.file',
			'some.html.nested.file',
			'other.file',
			'some.thing',
			'some.thing.else',
		], 'mydir');

		assertMapEquals(nesting1, {
			'some.file': ['some.html.file', 'some.html.nested.file'],
			'other.file': [],
			'some.thing': [],
			'some.thing.else': [],
		});
	});

	test('added segment matcher (old format)', () => {
		const t = new ExplorerFileNestingTrie([
			['*', ['$(basename).*.$(extname)']],
		]);

		const nesting1 = t.nest([
			'some.file',
			'some.html.file',
			'some.html.nested.file',
			'other.file',
			'some.thing',
			'some.thing.else',
		], 'mydir');

		assertMapEquals(nesting1, {
			'some.file': ['some.html.file', 'some.html.nested.file'],
			'other.file': [],
			'some.thing': [],
			'some.thing.else': [],
		});
	});

	test('dirname matching', () => {
		const t = new ExplorerFileNestingTrie([
			['index.ts', ['${dirname}.ts']],
		]);

		const nesting1 = t.nest([
			'otherFile.ts',
			'MyComponent.ts',
			'index.ts',
		], 'MyComponent');

		assertMapEquals(nesting1, {
			'index.ts': ['MyComponent.ts'],
			'otherFile.ts': [],
		});
	});

	test.skip('is fast', () => {
		const bigNester = new ExplorerFileNestingTrie([
			['*', ['${capture}.*']],
			['*.js', ['${capture}.*.js', '${capture}.map']],
			['*.jsx', ['${capture}.js']],
			['*.ts', ['${capture}.js', '${capture}.*.ts']],
			['*.tsx', ['${capture}.js']],
			['*.css', ['${capture}.*.css', '${capture}.map']],
			['*.html', ['${capture}.*.html']],
			['*.htm', ['${capture}.*.htm']],
			['*.less', ['${capture}.*.less', '${capture}.css']],
			['*.scss', ['${capture}.*.scss', '${capture}.css']],
			['*.sass', ['${capture}.css']],
			['*.styl', ['${capture}.css']],
			['*.coffee', ['${capture}.*.coffee', '${capture}.js']],
			['*.iced', ['${capture}.*.iced', '${capture}.js']],
			['*.config', ['${capture}.*.config']],
			['*.cs', ['${capture}.*.cs', '${capture}.cs.d.ts']],
			['*.vb', ['${capture}.*.vb']],
			['*.json', ['${capture}.*.json']],
			['*.md', ['${capture}.html']],
			['*.mdown', ['${capture}.html']],
			['*.markdown', ['${capture}.html']],
			['*.mdwn', ['${capture}.html']],
			['*.svg', ['${capture}.svgz']],
			['*.a', ['${capture}.b']],
			['*.b', ['${capture}.a']],
			['*.resx', ['${capture}.designer.cs']],
			['package.json', ['.npmrc', 'npm-shrinkwrap.json', 'yarn.lock', '.yarnclean', '.yarnignore', '.yarn-integrity', '.yarnrc']],
			['bower.json', ['.bowerrc']],
			['*-vsdoc.js', ['${capture}.js']],
			['*.tt', ['${capture}.*']]
		]);

		const bigFiles = Array.from({ length: 50000 / 6 }).map((_, i) => [
			'file' + i + '.js',
			'file' + i + '.map',
			'file' + i + '.css',
			'file' + i + '.ts',
			'file' + i + '.d.ts',
			'file' + i + '.jsx',
		]).flat();

		const start = performance.now();
		// const _bigResult =
		bigNester.nest(bigFiles, 'mydir');
		const end = performance.now();
		assert(end - start < 1000, 'too slow...' + (end - start));
		// console.log(bigResult)
	});
});
```

--------------------------------------------------------------------------------

````

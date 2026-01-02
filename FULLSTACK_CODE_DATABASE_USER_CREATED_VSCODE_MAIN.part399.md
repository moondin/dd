---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 399
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 399 of 552)

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

---[FILE: src/vs/workbench/contrib/files/test/browser/explorerFindProvider.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/test/browser/explorerFindProvider.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IIdentityProvider, IKeyboardNavigationLabelProvider, IListVirtualDelegate } from '../../../../../base/browser/ui/list/list.js';
import { IListAccessibilityProvider } from '../../../../../base/browser/ui/list/listWidget.js';
import { TreeFindMatchType, TreeFindMode } from '../../../../../base/browser/ui/tree/abstractTree.js';
import { ITreeCompressionDelegate } from '../../../../../base/browser/ui/tree/asyncDataTree.js';
import { ICompressedTreeNode } from '../../../../../base/browser/ui/tree/compressedObjectTreeModel.js';
import { ICompressibleTreeRenderer } from '../../../../../base/browser/ui/tree/objectTree.js';
import { IAsyncDataSource, ITreeFilter, ITreeNode, TreeFilterResult } from '../../../../../base/browser/ui/tree/tree.js';
import { CancellationToken, CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { FuzzyScore } from '../../../../../base/common/filters.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { basename } from '../../../../../base/common/resources.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IWorkbenchCompressibleAsyncDataTreeOptions, WorkbenchCompressibleAsyncDataTree } from '../../../../../platform/list/browser/listService.js';
import { IFileMatch, IFileQuery, ISearchComplete, ISearchService } from '../../../../services/search/common/search.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { NullFilesConfigurationService, TestFileService } from '../../../../test/common/workbenchTestServices.js';
import { IExplorerService } from '../../browser/files.js';
import { ExplorerFindProvider, FilesFilter } from '../../browser/views/explorerViewer.js';
import { ExplorerItem } from '../../common/explorerModel.js';

function find(element: ExplorerItem, id: string): ExplorerItem | undefined {
	if (element.name === id) {
		return element;
	}

	if (!element.children) {
		return undefined;
	}

	for (const child of element.children.values()) {
		const result = find(child, id);

		if (result) {
			return result;
		}
	}

	return undefined;
}

class Renderer implements ICompressibleTreeRenderer<ExplorerItem, FuzzyScore, HTMLElement> {
	readonly templateId = 'default';
	renderTemplate(container: HTMLElement): HTMLElement {
		return container;
	}
	renderElement(element: ITreeNode<ExplorerItem, FuzzyScore>, index: number, templateData: HTMLElement): void {
		templateData.textContent = element.element.name;
	}
	disposeTemplate(templateData: HTMLElement): void {
		// noop
	}
	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<ExplorerItem>, FuzzyScore>, index: number, templateData: HTMLElement): void {
		const result: string[] = [];

		for (const element of node.element.elements) {
			result.push(element.name);
		}

		templateData.textContent = result.join('/');
	}
}

class IdentityProvider implements IIdentityProvider<ExplorerItem> {
	getId(element: ExplorerItem) {
		return {
			toString: () => { return element.name; }
		};
	}
}

class VirtualDelegate implements IListVirtualDelegate<ExplorerItem> {
	getHeight() { return 20; }
	getTemplateId(element: ExplorerItem): string { return 'default'; }
}

class DataSource implements IAsyncDataSource<ExplorerItem, ExplorerItem> {
	hasChildren(element: ExplorerItem): boolean {
		return !!element.children && element.children.size > 0;
	}
	getChildren(element: ExplorerItem): Promise<ExplorerItem[]> {
		return Promise.resolve(Array.from(element.children.values()) || []);
	}
	getParent(element: ExplorerItem): ExplorerItem {
		return element.parent!;
	}

}

class AccessibilityProvider implements IListAccessibilityProvider<ExplorerItem> {
	getWidgetAriaLabel(): string {
		return '';
	}
	getAriaLabel(stat: ExplorerItem): string {
		return stat.name;
	}
}

class KeyboardNavigationLabelProvider implements IKeyboardNavigationLabelProvider<ExplorerItem> {
	getKeyboardNavigationLabel(stat: ExplorerItem): string {
		return stat.name;
	}
	getCompressedNodeKeyboardNavigationLabel(stats: ExplorerItem[]): string {
		return stats.map(stat => stat.name).join('/');
	}
}

class CompressionDelegate implements ITreeCompressionDelegate<ExplorerItem> {
	constructor(private dataSource: DataSource) { }
	isIncompressible(element: ExplorerItem): boolean {
		return !this.dataSource.hasChildren(element);
	}
}

class TestFilesFilter implements ITreeFilter<ExplorerItem> {
	filter(): TreeFilterResult<void> { return true; }
	isIgnored(): boolean { return false; }
	dispose() { }
}

suite('Find Provider - ExplorerView', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	const fileService = new TestFileService();
	const configService = new TestConfigurationService();

	function createStat(this: any, path: string, isFolder: boolean): ExplorerItem {
		return new ExplorerItem(URI.from({ scheme: 'file', path }), fileService, configService, NullFilesConfigurationService, undefined, isFolder);
	}

	let root: ExplorerItem;

	let instantiationService: TestInstantiationService;

	const searchMappings = new Map<string, URI[]>([
		['bb', [URI.file('/root/b/bb/bbb.txt'), URI.file('/root/a/ab/abb.txt'), URI.file('/root/b/bb/bba.txt')]],
	]);

	setup(() => {
		root = createStat.call(this, '/root', true);
		const a = createStat.call(this, '/root/a', true);
		const aa = createStat.call(this, '/root/a/aa', true);
		const ab = createStat.call(this, '/root/a/ab', true);
		const aba = createStat.call(this, '/root/a/ab/aba.txt', false);
		const abb = createStat.call(this, '/root/a/ab/abb.txt', false);
		const b = createStat.call(this, '/root/b', true);
		const ba = createStat.call(this, '/root/b/ba', true);
		const baa = createStat.call(this, '/root/b/ba/baa.txt', false);
		const bab = createStat.call(this, '/root/b/ba/bab.txt', false);
		const bb = createStat.call(this, '/root/b/bb', true);

		root.addChild(a);
		a.addChild(aa);
		a.addChild(ab);
		ab.addChild(aba);
		ab.addChild(abb);
		root.addChild(b);
		b.addChild(ba);
		ba.addChild(baa);
		ba.addChild(bab);
		b.addChild(bb);

		instantiationService = workbenchInstantiationService(undefined, disposables);
		instantiationService.stub(IExplorerService, {
			roots: [root],
			refresh: () => Promise.resolve(),
			findClosest: (resource: URI) => {
				return find(root, basename(resource)) ?? null;
			},
		});
		instantiationService.stub(ISearchService, {
			fileSearch(query: IFileQuery, token?: CancellationToken): Promise<ISearchComplete> {
				const filePattern = query.filePattern?.replace(/\//g, '')
					.replace(/\*/g, '')
					.replace(/\[/g, '')
					.replace(/\]/g, '')
					.replace(/[A-Z]/g, '') ?? '';
				const fileMatches: IFileMatch[] = (searchMappings.get(filePattern) ?? []).map(u => ({ resource: u }));
				return Promise.resolve({ results: fileMatches, messages: [] });
			},
			schemeHasFileSearchProvider(): boolean {
				return true;
			}
		});
	});

	test('find provider', async function () {
		const disposables = new DisposableStore();

		// Tree Stuff
		const container = document.createElement('div');

		const dataSource = new DataSource();
		const compressionDelegate = new CompressionDelegate(dataSource);
		const keyboardNavigationLabelProvider = new KeyboardNavigationLabelProvider();
		const accessibilityProvider = new AccessibilityProvider();
		const filter = instantiationService.createInstance(TestFilesFilter) as unknown as FilesFilter;

		const options: IWorkbenchCompressibleAsyncDataTreeOptions<ExplorerItem, FuzzyScore> = { identityProvider: new IdentityProvider(), keyboardNavigationLabelProvider, accessibilityProvider };
		const tree = disposables.add(instantiationService.createInstance(WorkbenchCompressibleAsyncDataTree<ExplorerItem | ExplorerItem[], ExplorerItem, FuzzyScore>, 'test', container, new VirtualDelegate(), compressionDelegate, [new Renderer()], dataSource, options));
		tree.layout(200);

		await tree.setInput(root);

		const findProvider = instantiationService.createInstance(ExplorerFindProvider, filter, () => tree);

		findProvider.startSession();

		assert.strictEqual(find(root, 'abb.txt') !== undefined, true);
		assert.strictEqual(find(root, 'bba.txt') !== undefined, false);
		assert.strictEqual(find(root, 'bbb.txt') !== undefined, false);

		assert.strictEqual(find(root, 'abb.txt')?.isMarkedAsFiltered(), false);
		assert.strictEqual(find(root, 'a')?.isMarkedAsFiltered(), false);
		assert.strictEqual(find(root, 'ab')?.isMarkedAsFiltered(), false);

		await findProvider.find('bb', { matchType: TreeFindMatchType.Contiguous, findMode: TreeFindMode.Filter }, new CancellationTokenSource().token);

		assert.strictEqual(find(root, 'abb.txt') !== undefined, true);
		assert.strictEqual(find(root, 'bba.txt') !== undefined, true);
		assert.strictEqual(find(root, 'bbb.txt') !== undefined, true);

		assert.strictEqual(find(root, 'abb.txt')?.isMarkedAsFiltered(), true);
		assert.strictEqual(find(root, 'bba.txt')?.isMarkedAsFiltered(), true);
		assert.strictEqual(find(root, 'bbb.txt')?.isMarkedAsFiltered(), true);

		assert.strictEqual(find(root, 'a')?.isMarkedAsFiltered(), true);
		assert.strictEqual(find(root, 'ab')?.isMarkedAsFiltered(), true);
		assert.strictEqual(find(root, 'b')?.isMarkedAsFiltered(), true);
		assert.strictEqual(find(root, 'bb')?.isMarkedAsFiltered(), true);

		assert.strictEqual(find(root, 'aa')?.isMarkedAsFiltered(), false);
		assert.strictEqual(find(root, 'ba')?.isMarkedAsFiltered(), false);
		assert.strictEqual(find(root, 'aba.txt')?.isMarkedAsFiltered(), false);

		await findProvider.endSession();

		assert.strictEqual(find(root, 'abb.txt') !== undefined, true);
		assert.strictEqual(find(root, 'baa.txt') !== undefined, true);
		assert.strictEqual(find(root, 'baa.txt') !== undefined, true);
		assert.strictEqual(find(root, 'bba.txt') !== undefined, false);
		assert.strictEqual(find(root, 'bbb.txt') !== undefined, false);

		assert.strictEqual(find(root, 'a')?.isMarkedAsFiltered(), false);
		assert.strictEqual(find(root, 'ab')?.isMarkedAsFiltered(), false);
		assert.strictEqual(find(root, 'b')?.isMarkedAsFiltered(), false);
		assert.strictEqual(find(root, 'bb')?.isMarkedAsFiltered(), false);

		disposables.dispose();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/test/browser/explorerModel.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/test/browser/explorerModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { join } from '../../../../../base/common/path.js';
import { isLinux, isWindows, OS } from '../../../../../base/common/platform.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite, toResource } from '../../../../../base/test/common/utils.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestPathService } from '../../../../test/browser/workbenchTestServices.js';
import { NullFilesConfigurationService, TestFileService } from '../../../../test/common/workbenchTestServices.js';
import { validateFileName } from '../../browser/fileActions.js';
import { ExplorerItem } from '../../common/explorerModel.js';


suite('Files - View Model', function () {

	const fileService = new TestFileService();
	const configService = new TestConfigurationService();

	function createStat(this: any, path: string, name: string, isFolder: boolean, hasChildren: boolean, size: number, mtime: number): ExplorerItem {
		return new ExplorerItem(toResource.call(this, path), fileService, configService, NullFilesConfigurationService, undefined, isFolder, false, false, false, name, mtime);
	}

	const pathService = new TestPathService();

	test('Properties', function () {
		const d = new Date().getTime();
		let s = createStat.call(this, '/path/to/stat', 'sName', true, true, 8096, d);

		assert.strictEqual(s.isDirectoryResolved, false);
		assert.strictEqual(s.resource.fsPath, toResource.call(this, '/path/to/stat').fsPath);
		assert.strictEqual(s.name, 'sName');
		assert.strictEqual(s.isDirectory, true);
		assert.strictEqual(s.mtime, new Date(d).getTime());

		s = createStat.call(this, '/path/to/stat', 'sName', false, false, 8096, d);
	});

	test('Add and Remove Child, check for hasChild', function () {
		const d = new Date().getTime();
		const s = createStat.call(this, '/path/to/stat', 'sName', true, false, 8096, d);

		const child1 = createStat.call(this, '/path/to/stat/foo', 'foo', true, false, 8096, d);
		const child4 = createStat.call(this, '/otherpath/to/other/otherbar.html', 'otherbar.html', false, false, 8096, d);

		s.addChild(child1);

		assert(!!s.getChild(child1.name));

		s.removeChild(child1);
		s.addChild(child1);
		assert(!!s.getChild(child1.name));

		s.removeChild(child1);
		assert(!s.getChild(child1.name));

		// Assert that adding a child updates its path properly
		s.addChild(child4);
		assert.strictEqual(child4.resource.fsPath, toResource.call(this, '/path/to/stat/' + child4.name).fsPath);
	});

	test('Move', function () {
		const d = new Date().getTime();

		const s1 = createStat.call(this, '/', '/', true, false, 8096, d);
		const s2 = createStat.call(this, '/path', 'path', true, false, 8096, d);
		const s3 = createStat.call(this, '/path/to', 'to', true, false, 8096, d);
		const s4 = createStat.call(this, '/path/to/stat', 'stat', false, false, 8096, d);

		s1.addChild(s2);
		s2.addChild(s3);
		s3.addChild(s4);

		s4.move(s1);

		// Assert the new path of the moved element
		assert.strictEqual(s4.resource.fsPath, toResource.call(this, '/' + s4.name).fsPath);

		// Move a subtree with children
		const leaf = createStat.call(this, '/leaf', 'leaf', true, false, 8096, d);
		const leafC1 = createStat.call(this, '/leaf/folder', 'folder', true, false, 8096, d);
		const leafCC2 = createStat.call(this, '/leaf/folder/index.html', 'index.html', true, false, 8096, d);

		leaf.addChild(leafC1);
		leafC1.addChild(leafCC2);
		s1.addChild(leaf);

		leafC1.move(s3);
		assert.strictEqual(leafC1.resource.fsPath, URI.file(s3.resource.fsPath + '/' + leafC1.name).fsPath);
		assert.strictEqual(leafCC2.resource.fsPath, URI.file(leafC1.resource.fsPath + '/' + leafCC2.name).fsPath);
	});

	test('Rename', function () {
		const d = new Date().getTime();

		const s1 = createStat.call(this, '/', '/', true, false, 8096, d);
		const s2 = createStat.call(this, '/path', 'path', true, false, 8096, d);
		const s3 = createStat.call(this, '/path/to', 'to', true, false, 8096, d);
		const s4 = createStat.call(this, '/path/to/stat', 'stat', true, false, 8096, d);

		s1.addChild(s2);
		s2.addChild(s3);
		s3.addChild(s4);

		assert.strictEqual(s1.getChild(s2.name), s2);
		const s2renamed = createStat.call(this, '/otherpath', 'otherpath', true, true, 8096, d);
		s2.rename(s2renamed);
		assert.strictEqual(s1.getChild(s2.name), s2);

		// Verify the paths have changed including children
		assert.strictEqual(s2.name, s2renamed.name);
		assert.strictEqual(s2.resource.fsPath, s2renamed.resource.fsPath);
		assert.strictEqual(s3.resource.fsPath, toResource.call(this, '/otherpath/to').fsPath);
		assert.strictEqual(s4.resource.fsPath, toResource.call(this, '/otherpath/to/stat').fsPath);

		const s4renamed = createStat.call(this, '/otherpath/to/statother.js', 'statother.js', true, false, 8096, d);
		s4.rename(s4renamed);
		assert.strictEqual(s3.getChild(s4.name), s4);
		assert.strictEqual(s4.name, s4renamed.name);
		assert.strictEqual(s4.resource.fsPath, s4renamed.resource.fsPath);
	});

	test('Find', function () {
		const d = new Date().getTime();

		const s1 = createStat.call(this, '/', '/', true, false, 8096, d);
		const s2 = createStat.call(this, '/path', 'path', true, false, 8096, d);
		const s3 = createStat.call(this, '/path/to', 'to', true, false, 8096, d);
		const s4 = createStat.call(this, '/path/to/stat', 'stat', true, false, 8096, d);
		const s4Upper = createStat.call(this, '/path/to/STAT', 'stat', true, false, 8096, d);

		const child1 = createStat.call(this, '/path/to/stat/foo', 'foo', true, false, 8096, d);
		const child2 = createStat.call(this, '/path/to/stat/foo/bar.html', 'bar.html', false, false, 8096, d);

		s1.addChild(s2);
		s2.addChild(s3);
		s3.addChild(s4);
		s4.addChild(child1);
		child1.addChild(child2);

		assert.strictEqual(s1.find(child2.resource), child2);
		assert.strictEqual(s1.find(child1.resource), child1);
		assert.strictEqual(s1.find(s4.resource), s4);
		assert.strictEqual(s1.find(s3.resource), s3);
		assert.strictEqual(s1.find(s2.resource), s2);

		if (isLinux) {
			assert.ok(!s1.find(s4Upper.resource));
		} else {
			assert.strictEqual(s1.find(s4Upper.resource), s4);
		}

		assert.strictEqual(s1.find(toResource.call(this, 'foobar')), null);

		assert.strictEqual(s1.find(toResource.call(this, '/')), s1);
	});

	test('Find with mixed case', function () {
		const d = new Date().getTime();

		const s1 = createStat.call(this, '/', '/', true, false, 8096, d);
		const s2 = createStat.call(this, '/path', 'path', true, false, 8096, d);
		const s3 = createStat.call(this, '/path/to', 'to', true, false, 8096, d);
		const s4 = createStat.call(this, '/path/to/stat', 'stat', true, false, 8096, d);

		const child1 = createStat.call(this, '/path/to/stat/foo', 'foo', true, false, 8096, d);
		const child2 = createStat.call(this, '/path/to/stat/foo/bar.html', 'bar.html', false, false, 8096, d);

		s1.addChild(s2);
		s2.addChild(s3);
		s3.addChild(s4);
		s4.addChild(child1);
		child1.addChild(child2);

		if (isLinux) { // linux is case sensitive
			assert.ok(!s1.find(toResource.call(this, '/path/to/stat/Foo')));
			assert.ok(!s1.find(toResource.call(this, '/Path/to/stat/foo/bar.html')));
		} else {
			assert.ok(s1.find(toResource.call(this, '/path/to/stat/Foo')));
			assert.ok(s1.find(toResource.call(this, '/Path/to/stat/foo/bar.html')));
		}
	});

	test('Validate File Name (For Create)', function () {
		const d = new Date().getTime();
		const s = createStat.call(this, '/path/to/stat', 'sName', true, true, 8096, d);
		const sChild = createStat.call(this, '/path/to/stat/alles.klar', 'alles.klar', true, true, 8096, d);
		s.addChild(sChild);

		assert(validateFileName(pathService, s, null!, OS) !== null);
		assert(validateFileName(pathService, s, '', OS) !== null);
		assert(validateFileName(pathService, s, '  ', OS) !== null);
		assert(validateFileName(pathService, s, 'Read Me', OS) === null, 'name containing space');

		if (isWindows) {
			assert(validateFileName(pathService, s, 'foo:bar', OS) !== null);
			assert(validateFileName(pathService, s, 'foo*bar', OS) !== null);
			assert(validateFileName(pathService, s, 'foo?bar', OS) !== null);
			assert(validateFileName(pathService, s, 'foo<bar', OS) !== null);
			assert(validateFileName(pathService, s, 'foo>bar', OS) !== null);
			assert(validateFileName(pathService, s, 'foo|bar', OS) !== null);
		}
		assert(validateFileName(pathService, s, 'alles.klar', OS) === null);
		assert(validateFileName(pathService, s, '.foo', OS) === null);
		assert(validateFileName(pathService, s, 'foo.bar', OS) === null);
		assert(validateFileName(pathService, s, 'foo', OS) === null);
	});

	test('Validate File Name (For Rename)', function () {
		const d = new Date().getTime();
		const s = createStat.call(this, '/path/to/stat', 'sName', true, true, 8096, d);
		const sChild = createStat.call(this, '/path/to/stat/alles.klar', 'alles.klar', true, true, 8096, d);
		s.addChild(sChild);

		assert(validateFileName(pathService, s, 'alles.klar', OS) === null);

		assert(validateFileName(pathService, s, 'Alles.klar', OS) === null);
		assert(validateFileName(pathService, s, 'Alles.Klar', OS) === null);

		assert(validateFileName(pathService, s, '.foo', OS) === null);
		assert(validateFileName(pathService, s, 'foo.bar', OS) === null);
		assert(validateFileName(pathService, s, 'foo', OS) === null);
	});

	test('Validate Multi-Path File Names', function () {
		const d = new Date().getTime();
		const wsFolder = createStat.call(this, '/', 'workspaceFolder', true, false, 8096, d);

		assert(validateFileName(pathService, wsFolder, 'foo/bar', OS) === null);
		assert(validateFileName(pathService, wsFolder, 'foo\\bar', OS) === null);
		assert(validateFileName(pathService, wsFolder, 'all/slashes/are/same', OS) === null);
		assert(validateFileName(pathService, wsFolder, 'theres/one/different\\slash', OS) === null);
		assert(validateFileName(pathService, wsFolder, '/slashAtBeginning', OS) !== null);

		// attempting to add a child to a deeply nested file
		const s1 = createStat.call(this, '/path', 'path', true, false, 8096, d);
		const s2 = createStat.call(this, '/path/to', 'to', true, false, 8096, d);
		const s3 = createStat.call(this, '/path/to/stat', 'stat', true, false, 8096, d);
		wsFolder.addChild(s1);
		s1.addChild(s2);
		s2.addChild(s3);
		const fileDeeplyNested = createStat.call(this, '/path/to/stat/fileNested', 'fileNested', false, false, 8096, d);
		s3.addChild(fileDeeplyNested);
		assert(validateFileName(pathService, wsFolder, '/path/to/stat/fileNested/aChild', OS) !== null);

		// detect if path already exists
		assert(validateFileName(pathService, wsFolder, '/path/to/stat/fileNested', OS) !== null);
		assert(validateFileName(pathService, wsFolder, '/path/to/stat/', OS) !== null);
	});

	test('Merge Local with Disk', function () {
		const merge1 = new ExplorerItem(URI.file(join('C:\\', '/path/to')), fileService, configService, NullFilesConfigurationService, undefined, true, false, false, false, 'to', Date.now());
		const merge2 = new ExplorerItem(URI.file(join('C:\\', '/path/to')), fileService, configService, NullFilesConfigurationService, undefined, true, false, false, false, 'to', Date.now());

		// Merge Properties
		ExplorerItem.mergeLocalWithDisk(merge2, merge1);
		assert.strictEqual(merge1.mtime, merge2.mtime);

		// Merge Child when isDirectoryResolved=false is a no-op
		merge2.addChild(new ExplorerItem(URI.file(join('C:\\', '/path/to/foo.html')), fileService, configService, NullFilesConfigurationService, undefined, true, false, false, false, 'foo.html', Date.now()));
		ExplorerItem.mergeLocalWithDisk(merge2, merge1);

		// Merge Child with isDirectoryResolved=true
		const child = new ExplorerItem(URI.file(join('C:\\', '/path/to/foo.html')), fileService, configService, NullFilesConfigurationService, undefined, true, false, false, false, 'foo.html', Date.now());
		merge2.removeChild(child);
		merge2.addChild(child);
		merge2._isDirectoryResolved = true;
		ExplorerItem.mergeLocalWithDisk(merge2, merge1);
		assert.strictEqual(merge1.getChild('foo.html')!.name, 'foo.html');
		assert.deepStrictEqual(merge1.getChild('foo.html')!.parent, merge1, 'Check parent');

		// Verify that merge does not replace existing children, but updates properties in that case
		const existingChild = merge1.getChild('foo.html');
		ExplorerItem.mergeLocalWithDisk(merge2, merge1);
		assert.ok(existingChild === merge1.getChild(existingChild!.name));
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/test/browser/explorerView.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/test/browser/explorerView.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Emitter } from '../../../../../base/common/event.js';
import { ensureNoDisposablesAreLeakedInTestSuite, toResource } from '../../../../../base/test/common/utils.js';
import { ExplorerItem } from '../../common/explorerModel.js';
import { getContext } from '../../browser/views/explorerView.js';
import { listInvalidItemForeground } from '../../../../../platform/theme/common/colorRegistry.js';
import { CompressedNavigationController } from '../../browser/views/explorerViewer.js';
import * as dom from '../../../../../base/browser/dom.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { provideDecorations } from '../../browser/views/explorerDecorationsProvider.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { NullFilesConfigurationService, TestFileService } from '../../../../test/common/workbenchTestServices.js';

suite('Files - ExplorerView', () => {

	const $ = dom.$;

	const ds = ensureNoDisposablesAreLeakedInTestSuite();

	const fileService = new TestFileService();
	const configService = new TestConfigurationService();


	function createStat(this: any, path: string, name: string, isFolder: boolean, hasChildren: boolean, size: number, mtime: number, isSymLink = false, isUnknown = false): ExplorerItem {
		return new ExplorerItem(toResource.call(this, path), fileService, configService, NullFilesConfigurationService, undefined, isFolder, isSymLink, false, false, name, mtime, isUnknown);
	}

	test('getContext', async function () {
		const d = new Date().getTime();
		const s1 = createStat.call(this, '/', '/', true, false, 8096, d);
		const s2 = createStat.call(this, '/path', 'path', true, false, 8096, d);
		const s3 = createStat.call(this, '/path/to', 'to', true, false, 8096, d);
		const s4 = createStat.call(this, '/path/to/stat', 'stat', false, false, 8096, d);
		const noNavigationController = { getCompressedNavigationController: (stat: ExplorerItem) => undefined };

		assert.deepStrictEqual(getContext([s1], [s2, s3, s4], true, noNavigationController), [s2, s3, s4]);
		assert.deepStrictEqual(getContext([s1], [s1, s3, s4], true, noNavigationController), [s1, s3, s4]);
		assert.deepStrictEqual(getContext([s1], [s3, s1, s4], false, noNavigationController), [s1]);
		assert.deepStrictEqual(getContext([], [s3, s1, s4], false, noNavigationController), []);
		assert.deepStrictEqual(getContext([], [s3, s1, s4], true, noNavigationController), [s3, s1, s4]);
	});

	test('decoration provider', async function () {
		const d = new Date().getTime();
		const s1 = createStat.call(this, '/path', 'path', true, false, 8096, d);
		s1.error = new Error('A test error');
		const s2 = createStat.call(this, '/path/to', 'to', true, false, 8096, d, true);
		const s3 = createStat.call(this, '/path/to/stat', 'stat', false, false, 8096, d);
		assert.strictEqual(provideDecorations(s3), undefined);
		assert.deepStrictEqual(provideDecorations(s2), {
			tooltip: 'Symbolic Link',
			letter: '\u2937'
		});
		assert.deepStrictEqual(provideDecorations(s1), {
			tooltip: 'Unable to resolve workspace folder (A test error)',
			letter: '!',
			color: listInvalidItemForeground
		});

		const unknown = createStat.call(this, '/path/to/stat', 'stat', false, false, 8096, d, false, true);
		assert.deepStrictEqual(provideDecorations(unknown), {
			tooltip: 'Unknown File Type',
			letter: '?'
		});
	});

	test('compressed navigation controller', async function () {
		const container = $('.file');
		const label = $('.label');
		const labelName1 = $('.label-name');
		const labelName2 = $('.label-name');
		const labelName3 = $('.label-name');
		const d = new Date().getTime();
		const s1 = createStat.call(this, '/path', 'path', true, false, 8096, d);
		const s2 = createStat.call(this, '/path/to', 'to', true, false, 8096, d);
		const s3 = createStat.call(this, '/path/to/stat', 'stat', false, false, 8096, d);

		dom.append(container, label);
		dom.append(label, labelName1);
		dom.append(label, labelName2);
		dom.append(label, labelName3);
		const emitter = new Emitter<void>();

		const navigationController = new CompressedNavigationController('id', [s1, s2, s3], {
			container,
			templateDisposables: ds.add(new DisposableStore()),
			elementDisposables: ds.add(new DisposableStore()),
			contribs: [],
			// eslint-disable-next-line local/code-no-any-casts
			label: <any>{
				container: label,
				onDidRender: emitter.event
			},
		}, 1, false);

		ds.add(navigationController);

		assert.strictEqual(navigationController.count, 3);
		assert.strictEqual(navigationController.index, 2);
		assert.strictEqual(navigationController.current, s3);
		navigationController.next();
		assert.strictEqual(navigationController.current, s3);
		navigationController.previous();
		assert.strictEqual(navigationController.current, s2);
		navigationController.previous();
		assert.strictEqual(navigationController.current, s1);
		navigationController.previous();
		assert.strictEqual(navigationController.current, s1);
		navigationController.last();
		assert.strictEqual(navigationController.current, s3);
		navigationController.first();
		assert.strictEqual(navigationController.current, s1);
		navigationController.setIndex(1);
		assert.strictEqual(navigationController.current, s2);
		navigationController.setIndex(44);
		assert.strictEqual(navigationController.current, s2);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/test/browser/fileActions.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/test/browser/fileActions.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { incrementFileName } from '../../browser/fileActions.js';

suite('Files - Increment file name simple', () => {

	test('Increment file name without any version', function () {
		const name = 'test.js';
		const result = incrementFileName(name, false, 'simple');
		assert.strictEqual(result, 'test copy.js');
	});

	test('Increment file name with suffix version', function () {
		const name = 'test copy.js';
		const result = incrementFileName(name, false, 'simple');
		assert.strictEqual(result, 'test copy 2.js');
	});

	test('Increment file name with suffix version with leading zeros', function () {
		const name = 'test copy 005.js';
		const result = incrementFileName(name, false, 'simple');
		assert.strictEqual(result, 'test copy 6.js');
	});

	test('Increment file name with suffix version, too big number', function () {
		const name = 'test copy 9007199254740992.js';
		const result = incrementFileName(name, false, 'simple');
		assert.strictEqual(result, 'test copy 9007199254740992 copy.js');
	});

	test('Increment file name with just version in name', function () {
		const name = 'copy.js';
		const result = incrementFileName(name, false, 'simple');
		assert.strictEqual(result, 'copy copy.js');
	});

	test('Increment file name with just version in name, v2', function () {
		const name = 'copy 2.js';
		const result = incrementFileName(name, false, 'simple');
		assert.strictEqual(result, 'copy 2 copy.js');
	});

	test('Increment file name without any extension or version', function () {
		const name = 'test';
		const result = incrementFileName(name, false, 'simple');
		assert.strictEqual(result, 'test copy');
	});

	test('Increment file name without any extension or version, trailing dot', function () {
		const name = 'test.';
		const result = incrementFileName(name, false, 'simple');
		assert.strictEqual(result, 'test copy.');
	});

	test('Increment file name without any extension or version, leading dot', function () {
		const name = '.test';
		const result = incrementFileName(name, false, 'simple');
		assert.strictEqual(result, '.test copy');
	});

	test('Increment file name without any extension or version, leading dot v2', function () {
		const name = '..test';
		const result = incrementFileName(name, false, 'simple');
		assert.strictEqual(result, '. copy.test');
	});

	test('Increment file name without any extension but with suffix version', function () {
		const name = 'test copy 5';
		const result = incrementFileName(name, false, 'simple');
		assert.strictEqual(result, 'test copy 6');
	});

	test('Increment folder name without any version', function () {
		const name = 'test';
		const result = incrementFileName(name, true, 'simple');
		assert.strictEqual(result, 'test copy');
	});

	test('Increment folder name with suffix version', function () {
		const name = 'test copy';
		const result = incrementFileName(name, true, 'simple');
		assert.strictEqual(result, 'test copy 2');
	});

	test('Increment folder name with suffix version, leading zeros', function () {
		const name = 'test copy 005';
		const result = incrementFileName(name, true, 'simple');
		assert.strictEqual(result, 'test copy 6');
	});

	test('Increment folder name with suffix version, too big number', function () {
		const name = 'test copy 9007199254740992';
		const result = incrementFileName(name, true, 'simple');
		assert.strictEqual(result, 'test copy 9007199254740992 copy');
	});

	test('Increment folder name with just version in name', function () {
		const name = 'copy';
		const result = incrementFileName(name, true, 'simple');
		assert.strictEqual(result, 'copy copy');
	});

	test('Increment folder name with just version in name, v2', function () {
		const name = 'copy 2';
		const result = incrementFileName(name, true, 'simple');
		assert.strictEqual(result, 'copy 2 copy');
	});

	test('Increment folder name "with extension" but without any version', function () {
		const name = 'test.js';
		const result = incrementFileName(name, true, 'simple');
		assert.strictEqual(result, 'test.js copy');
	});

	test('Increment folder name "with extension" and with suffix version', function () {
		const name = 'test.js copy 5';
		const result = incrementFileName(name, true, 'simple');
		assert.strictEqual(result, 'test.js copy 6');
	});

	test('Increment file/folder name with suffix version, special case 1', function () {
		const name = 'test copy 0';
		const result = incrementFileName(name, true, 'simple');
		assert.strictEqual(result, 'test copy');
	});

	test('Increment file/folder name with suffix version, special case 2', function () {
		const name = 'test copy 1';
		const result = incrementFileName(name, true, 'simple');
		assert.strictEqual(result, 'test copy 2');
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});

suite('Files - Increment file name smart', () => {

	test('Increment file name without any version', function () {
		const name = 'test.js';
		const result = incrementFileName(name, false, 'smart');
		assert.strictEqual(result, 'test.1.js');
	});

	test('Increment folder name without any version', function () {
		const name = 'test';
		const result = incrementFileName(name, true, 'smart');
		assert.strictEqual(result, 'test.1');
	});

	test('Increment file name with suffix version', function () {
		const name = 'test.1.js';
		const result = incrementFileName(name, false, 'smart');
		assert.strictEqual(result, 'test.2.js');
	});

	test('Increment file name with suffix version with trailing zeros', function () {
		const name = 'test.001.js';
		const result = incrementFileName(name, false, 'smart');
		assert.strictEqual(result, 'test.002.js');
	});

	test('Increment file name with suffix version with trailing zeros, changing length', function () {
		const name = 'test.009.js';
		const result = incrementFileName(name, false, 'smart');
		assert.strictEqual(result, 'test.010.js');
	});

	test('Increment file name with suffix version with `-` as separator', function () {
		const name = 'test-1.js';
		const result = incrementFileName(name, false, 'smart');
		assert.strictEqual(result, 'test-2.js');
	});

	test('Increment file name with suffix version with `-` as separator, trailing zeros', function () {
		const name = 'test-001.js';
		const result = incrementFileName(name, false, 'smart');
		assert.strictEqual(result, 'test-002.js');
	});

	test('Increment file name with suffix version with `-` as separator, trailing zeros, changnig length', function () {
		const name = 'test-099.js';
		const result = incrementFileName(name, false, 'smart');
		assert.strictEqual(result, 'test-100.js');
	});

	test('Increment file name with suffix version with `_` as separator', function () {
		const name = 'test_1.js';
		const result = incrementFileName(name, false, 'smart');
		assert.strictEqual(result, 'test_2.js');
	});

	test('Increment folder name with suffix version', function () {
		const name = 'test.1';
		const result = incrementFileName(name, true, 'smart');
		assert.strictEqual(result, 'test.2');
	});

	test('Increment folder name with suffix version, trailing zeros', function () {
		const name = 'test.001';
		const result = incrementFileName(name, true, 'smart');
		assert.strictEqual(result, 'test.002');
	});

	test('Increment folder name with suffix version with `-` as separator', function () {
		const name = 'test-1';
		const result = incrementFileName(name, true, 'smart');
		assert.strictEqual(result, 'test-2');
	});

	test('Increment folder name with suffix version with `_` as separator', function () {
		const name = 'test_1';
		const result = incrementFileName(name, true, 'smart');
		assert.strictEqual(result, 'test_2');
	});

	test('Increment file name with suffix version, too big number', function () {
		const name = 'test.9007199254740992.js';
		const result = incrementFileName(name, false, 'smart');
		assert.strictEqual(result, 'test.9007199254740992.1.js');
	});

	test('Increment folder name with suffix version, too big number', function () {
		const name = 'test.9007199254740992';
		const result = incrementFileName(name, true, 'smart');
		assert.strictEqual(result, 'test.9007199254740992.1');
	});

	test('Increment file name with prefix version', function () {
		const name = '1.test.js';
		const result = incrementFileName(name, false, 'smart');
		assert.strictEqual(result, '2.test.js');
	});

	test('Increment file name with just version in name', function () {
		const name = '1.js';
		const result = incrementFileName(name, false, 'smart');
		assert.strictEqual(result, '2.js');
	});

	test('Increment file name with just version in name, too big number', function () {
		const name = '9007199254740992.js';
		const result = incrementFileName(name, false, 'smart');
		assert.strictEqual(result, '9007199254740992.1.js');
	});

	test('Increment file name with prefix version, trailing zeros', function () {
		const name = '001.test.js';
		const result = incrementFileName(name, false, 'smart');
		assert.strictEqual(result, '002.test.js');
	});

	test('Increment file name with prefix version with `-` as separator', function () {
		const name = '1-test.js';
		const result = incrementFileName(name, false, 'smart');
		assert.strictEqual(result, '2-test.js');
	});

	test('Increment file name with prefix version with `_` as separator', function () {
		const name = '1_test.js';
		const result = incrementFileName(name, false, 'smart');
		assert.strictEqual(result, '2_test.js');
	});

	test('Increment file name with prefix version, too big number', function () {
		const name = '9007199254740992.test.js';
		const result = incrementFileName(name, false, 'smart');
		assert.strictEqual(result, '9007199254740992.test.1.js');
	});

	test('Increment file name with just version and no extension', function () {
		const name = '001004';
		const result = incrementFileName(name, false, 'smart');
		assert.strictEqual(result, '001005');
	});

	test('Increment file name with just version and no extension, too big number', function () {
		const name = '9007199254740992';
		const result = incrementFileName(name, false, 'smart');
		assert.strictEqual(result, '9007199254740992.1');
	});

	test('Increment file name with no extension and no version', function () {
		const name = 'file';
		const result = incrementFileName(name, false, 'smart');
		assert.strictEqual(result, 'file1');
	});

	test('Increment file name with no extension', function () {
		const name = 'file1';
		const result = incrementFileName(name, false, 'smart');
		assert.strictEqual(result, 'file2');
	});

	test('Increment file name with no extension, too big number', function () {
		const name = 'file9007199254740992';
		const result = incrementFileName(name, false, 'smart');
		assert.strictEqual(result, 'file9007199254740992.1');
	});

	test('Increment folder name with prefix version', function () {
		const name = '1.test';
		const result = incrementFileName(name, true, 'smart');
		assert.strictEqual(result, '2.test');
	});

	test('Increment folder name with prefix version, too big number', function () {
		const name = '9007199254740992.test';
		const result = incrementFileName(name, true, 'smart');
		assert.strictEqual(result, '9007199254740992.test.1');
	});

	test('Increment folder name with prefix version, trailing zeros', function () {
		const name = '001.test';
		const result = incrementFileName(name, true, 'smart');
		assert.strictEqual(result, '002.test');
	});

	test('Increment folder name with prefix version  with `-` as separator', function () {
		const name = '1-test';
		const result = incrementFileName(name, true, 'smart');
		assert.strictEqual(result, '2-test');
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/test/browser/fileEditorInput.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/test/browser/fileEditorInput.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite, toResource } from '../../../../../base/test/common/utils.js';
import { FileEditorInput } from '../../browser/editors/fileEditorInput.js';
import { workbenchInstantiationService, TestServiceAccessor, getLastResolvedFileStat } from '../../../../test/browser/workbenchTestServices.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IEditorFactoryRegistry, Verbosity, EditorExtensions, EditorInputCapabilities } from '../../../../common/editor.js';
import { EncodingMode, TextFileOperationError, TextFileOperationResult } from '../../../../services/textfile/common/textfiles.js';
import { FileOperationResult, NotModifiedSinceFileOperationError, TooLargeFileOperationError } from '../../../../../platform/files/common/files.js';
import { TextFileEditorModel } from '../../../../services/textfile/common/textFileEditorModel.js';
import { timeout } from '../../../../../base/common/async.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../../editor/common/languages/modesRegistry.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { BinaryEditorModel } from '../../../../common/editor/binaryEditorModel.js';
import { IResourceEditorInput } from '../../../../../platform/editor/common/editor.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { FileEditorInputSerializer } from '../../browser/editors/fileEditorHandler.js';
import { InMemoryFileSystemProvider } from '../../../../../platform/files/common/inMemoryFilesystemProvider.js';
import { TextEditorService } from '../../../../services/textfile/common/textEditorService.js';

suite('Files - FileEditorInput', () => {

	const disposables = new DisposableStore();
	let instantiationService: IInstantiationService;
	let accessor: TestServiceAccessor;

	function createFileInput(resource: URI, preferredResource?: URI, preferredLanguageId?: string, preferredName?: string, preferredDescription?: string, preferredContents?: string): FileEditorInput {
		return disposables.add(instantiationService.createInstance(FileEditorInput, resource, preferredResource, preferredName, preferredDescription, undefined, preferredLanguageId, preferredContents));
	}

	class TestTextEditorService extends TextEditorService {
		override createTextEditor(input: IResourceEditorInput) {
			return createFileInput(input.resource);
		}

		override async resolveTextEditor(input: IResourceEditorInput) {
			return createFileInput(input.resource);
		}
	}

	setup(() => {
		instantiationService = workbenchInstantiationService({
			textEditorService: instantiationService => instantiationService.createInstance(TestTextEditorService)
		}, disposables);

		accessor = instantiationService.createInstance(TestServiceAccessor);
	});

	teardown(() => {
		disposables.clear();
	});

	test('Basics', async function () {
		let input = createFileInput(toResource.call(this, '/foo/bar/file.js'));
		const otherInput = createFileInput(toResource.call(this, 'foo/bar/otherfile.js'));
		const otherInputSame = createFileInput(toResource.call(this, 'foo/bar/file.js'));

		assert(input.matches(input));
		assert(input.matches(otherInputSame));
		assert(!input.matches(otherInput));
		assert.ok(input.getName());
		assert.ok(input.getDescription());
		assert.ok(input.getTitle(Verbosity.SHORT));

		assert.ok(!input.hasCapability(EditorInputCapabilities.Untitled));
		assert.ok(!input.hasCapability(EditorInputCapabilities.Readonly));
		assert.ok(!input.isReadonly());
		assert.ok(!input.hasCapability(EditorInputCapabilities.Singleton));
		assert.ok(!input.hasCapability(EditorInputCapabilities.RequiresTrust));

		const untypedInput = input.toUntyped({ preserveViewState: 0 });
		assert.strictEqual(untypedInput.resource.toString(), input.resource.toString());

		assert.strictEqual('file.js', input.getName());

		assert.strictEqual(toResource.call(this, '/foo/bar/file.js').fsPath, input.resource.fsPath);
		assert(input.resource instanceof URI);

		input = createFileInput(toResource.call(this, '/foo/bar.html'));

		const inputToResolve: FileEditorInput = createFileInput(toResource.call(this, '/foo/bar/file.js'));
		const sameOtherInput: FileEditorInput = createFileInput(toResource.call(this, '/foo/bar/file.js'));

		let resolved = await inputToResolve.resolve();
		assert.ok(inputToResolve.isResolved());

		const resolvedModelA = resolved;
		resolved = await inputToResolve.resolve();
		assert(resolvedModelA === resolved); // OK: Resolved Model cached globally per input

		try {
			DisposableStore.DISABLE_DISPOSED_WARNING = true; // prevent unwanted warning output from occurring

			const otherResolved = await sameOtherInput.resolve();
			assert(otherResolved === resolvedModelA); // OK: Resolved Model cached globally per input
			inputToResolve.dispose();

			resolved = await inputToResolve.resolve();
			assert(resolvedModelA === resolved); // Model is still the same because we had 2 clients
			inputToResolve.dispose();
			sameOtherInput.dispose();
			resolvedModelA.dispose();

			resolved = await inputToResolve.resolve();
			assert(resolvedModelA !== resolved); // Different instance, because input got disposed

			const stat = getLastResolvedFileStat(resolved);
			resolved = await inputToResolve.resolve();
			await timeout(0);
			assert(stat !== getLastResolvedFileStat(resolved)); // Different stat, because resolve always goes to the server for refresh
		} finally {
			DisposableStore.DISABLE_DISPOSED_WARNING = false;
		}
	});

	test('reports as untitled without supported file scheme', async function () {
		const input = createFileInput(toResource.call(this, '/foo/bar/file.js').with({ scheme: 'someTestingScheme' }));

		assert.ok(input.hasCapability(EditorInputCapabilities.Untitled));
		assert.ok(!input.hasCapability(EditorInputCapabilities.Readonly));
		assert.ok(!input.isReadonly());
	});

	test('reports as readonly with readonly file scheme', async function () {
		const inMemoryFilesystemProvider = disposables.add(new InMemoryFileSystemProvider());
		inMemoryFilesystemProvider.setReadOnly(true);

		disposables.add(accessor.fileService.registerProvider('someTestingReadonlyScheme', inMemoryFilesystemProvider));
		const input = createFileInput(toResource.call(this, '/foo/bar/file.js').with({ scheme: 'someTestingReadonlyScheme' }));

		assert.ok(!input.hasCapability(EditorInputCapabilities.Untitled));
		assert.ok(input.hasCapability(EditorInputCapabilities.Readonly));
		assert.ok(input.isReadonly());
	});

	test('preferred resource', function () {
		const resource = toResource.call(this, '/foo/bar/updatefile.js');
		const preferredResource = toResource.call(this, '/foo/bar/UPDATEFILE.js');

		const inputWithoutPreferredResource = createFileInput(resource);
		assert.strictEqual(inputWithoutPreferredResource.resource.toString(), resource.toString());
		assert.strictEqual(inputWithoutPreferredResource.preferredResource.toString(), resource.toString());

		const inputWithPreferredResource = createFileInput(resource, preferredResource);

		assert.strictEqual(inputWithPreferredResource.resource.toString(), resource.toString());
		assert.strictEqual(inputWithPreferredResource.preferredResource.toString(), preferredResource.toString());

		let didChangeLabel = false;
		disposables.add(inputWithPreferredResource.onDidChangeLabel(e => {
			didChangeLabel = true;
		}));

		assert.strictEqual(inputWithPreferredResource.getName(), 'UPDATEFILE.js');

		const otherPreferredResource = toResource.call(this, '/FOO/BAR/updateFILE.js');
		inputWithPreferredResource.setPreferredResource(otherPreferredResource);

		assert.strictEqual(inputWithPreferredResource.resource.toString(), resource.toString());
		assert.strictEqual(inputWithPreferredResource.preferredResource.toString(), otherPreferredResource.toString());
		assert.strictEqual(inputWithPreferredResource.getName(), 'updateFILE.js');
		assert.strictEqual(didChangeLabel, true);
	});

	test('preferred language', async function () {
		const languageId = 'file-input-test';
		disposables.add(accessor.languageService.registerLanguage({
			id: languageId,
		}));

		const input = createFileInput(toResource.call(this, '/foo/bar/file.js'), undefined, languageId);
		assert.strictEqual(input.getPreferredLanguageId(), languageId);

		const model = disposables.add(await input.resolve() as TextFileEditorModel);
		assert.strictEqual(model.textEditorModel!.getLanguageId(), languageId);

		input.setLanguageId('text');
		assert.strictEqual(input.getPreferredLanguageId(), 'text');
		assert.strictEqual(model.textEditorModel!.getLanguageId(), PLAINTEXT_LANGUAGE_ID);

		const input2 = createFileInput(toResource.call(this, '/foo/bar/file.js'));
		input2.setPreferredLanguageId(languageId);

		const model2 = disposables.add(await input2.resolve() as TextFileEditorModel);
		assert.strictEqual(model2.textEditorModel!.getLanguageId(), languageId);
	});

	test('preferred contents', async function () {
		const input = createFileInput(toResource.call(this, '/foo/bar/file.js'), undefined, undefined, undefined, undefined, 'My contents');

		const model = disposables.add(await input.resolve() as TextFileEditorModel);
		assert.strictEqual(model.textEditorModel!.getValue(), 'My contents');
		assert.strictEqual(input.isDirty(), true);

		const untypedInput = input.toUntyped({ preserveViewState: 0 });
		assert.strictEqual(untypedInput.contents, 'My contents');

		const untypedInputWithoutContents = input.toUntyped();
		assert.strictEqual(untypedInputWithoutContents.contents, undefined);

		input.setPreferredContents('Other contents');
		await input.resolve();
		assert.strictEqual(model.textEditorModel!.getValue(), 'Other contents');

		model.textEditorModel?.setValue('Changed contents');
		await input.resolve();
		assert.strictEqual(model.textEditorModel!.getValue(), 'Changed contents'); // preferred contents only used once

		const input2 = createFileInput(toResource.call(this, '/foo/bar/file.js'));
		input2.setPreferredContents('My contents');

		const model2 = await input2.resolve() as TextFileEditorModel;
		assert.strictEqual(model2.textEditorModel!.getValue(), 'My contents');
		assert.strictEqual(input2.isDirty(), true);
	});

	test('matches', function () {
		const input1 = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'));
		const input2 = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'));
		const input3 = createFileInput(toResource.call(this, '/foo/bar/other.js'));
		const input2Upper = createFileInput(toResource.call(this, '/foo/bar/UPDATEFILE.js'));

		assert.strictEqual(input1.matches(input1), true);
		assert.strictEqual(input1.matches(input2), true);
		assert.strictEqual(input1.matches(input3), false);

		assert.strictEqual(input1.matches(input2Upper), false);
	});

	test('getEncoding/setEncoding', async function () {
		const input = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'));

		await input.setEncoding('utf16', EncodingMode.Encode);
		assert.strictEqual(input.getEncoding(), 'utf16');

		const resolved = disposables.add(await input.resolve() as TextFileEditorModel);
		assert.strictEqual(input.getEncoding(), resolved.getEncoding());
	});

	test('save', async function () {
		const input = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'));

		const resolved = disposables.add(await input.resolve() as TextFileEditorModel);
		resolved.textEditorModel!.setValue('changed');
		assert.ok(input.isDirty());
		assert.ok(input.isModified());

		await input.save(0);
		assert.ok(!input.isDirty());
		assert.ok(!input.isModified());
	});

	test('revert', async function () {
		const input = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'));

		const resolved = disposables.add(await input.resolve() as TextFileEditorModel);
		resolved.textEditorModel!.setValue('changed');
		assert.ok(input.isDirty());
		assert.ok(input.isModified());

		await input.revert(0);
		assert.ok(!input.isDirty());
		assert.ok(!input.isModified());

		input.dispose();
		assert.ok(input.isDisposed());
	});

	test('resolve handles binary files', async function () {
		const input = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'));

		accessor.textFileService.setReadStreamErrorOnce(new TextFileOperationError('error', TextFileOperationResult.FILE_IS_BINARY));

		const resolved = disposables.add(await input.resolve());
		assert.ok(resolved);
	});

	test('resolve throws for too large files', async function () {
		const input = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'));

		let e: Error | undefined = undefined;
		accessor.textFileService.setReadStreamErrorOnce(new TooLargeFileOperationError('error', FileOperationResult.FILE_TOO_LARGE, 1000));
		try {
			await input.resolve();
		} catch (error) {
			e = error;
		}
		assert.ok(e);
	});

	test('attaches to model when created and reports dirty', async function () {
		const input = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'));

		let listenerCount = 0;
		disposables.add(input.onDidChangeDirty(() => {
			listenerCount++;
		}));

		// instead of going through file input resolve method
		// we resolve the model directly through the service
		const model = disposables.add(await accessor.textFileService.files.resolve(input.resource));
		model.textEditorModel?.setValue('hello world');

		assert.strictEqual(listenerCount, 1);
		assert.ok(input.isDirty());
	});

	test('force open text/binary', async function () {
		const input = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'));
		input.setForceOpenAsBinary();

		let resolved = disposables.add(await input.resolve());
		assert.ok(resolved instanceof BinaryEditorModel);

		input.setForceOpenAsText();

		resolved = disposables.add(await input.resolve());
		assert.ok(resolved instanceof TextFileEditorModel);
	});

	test('file editor serializer', async function () {
		instantiationService.invokeFunction(accessor => Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).start(accessor));

		const input = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'));

		disposables.add(Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer('workbench.editors.files.fileEditorInput', FileEditorInputSerializer));

		const editorSerializer = Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).getEditorSerializer(input.typeId);
		if (!editorSerializer) {
			assert.fail('File Editor Input Serializer missing');
		}

		assert.strictEqual(editorSerializer.canSerialize(input), true);

		const inputSerialized = editorSerializer.serialize(input);
		if (!inputSerialized) {
			assert.fail('Unexpected serialized file input');
		}

		const inputDeserialized = editorSerializer.deserialize(instantiationService, inputSerialized);
		assert.strictEqual(inputDeserialized ? input.matches(inputDeserialized) : false, true);

		const preferredResource = toResource.call(this, '/foo/bar/UPDATEfile.js');
		const inputWithPreferredResource = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'), preferredResource);

		const inputWithPreferredResourceSerialized = editorSerializer.serialize(inputWithPreferredResource);
		if (!inputWithPreferredResourceSerialized) {
			assert.fail('Unexpected serialized file input');
		}

		const inputWithPreferredResourceDeserialized = editorSerializer.deserialize(instantiationService, inputWithPreferredResourceSerialized) as FileEditorInput;
		assert.strictEqual(inputWithPreferredResource.resource.toString(), inputWithPreferredResourceDeserialized.resource.toString());
		assert.strictEqual(inputWithPreferredResource.preferredResource.toString(), inputWithPreferredResourceDeserialized.preferredResource.toString());
	});

	test('preferred name/description', async function () {

		// Works with custom file input
		const customFileInput = createFileInput(toResource.call(this, '/foo/bar/updatefile.js').with({ scheme: 'test-custom' }), undefined, undefined, 'My Name', 'My Description');

		let didChangeLabelCounter = 0;
		disposables.add(customFileInput.onDidChangeLabel(() => {
			didChangeLabelCounter++;
		}));

		assert.strictEqual(customFileInput.getName(), 'My Name');
		assert.strictEqual(customFileInput.getDescription(), 'My Description');

		customFileInput.setPreferredName('My Name 2');
		customFileInput.setPreferredDescription('My Description 2');

		assert.strictEqual(customFileInput.getName(), 'My Name 2');
		assert.strictEqual(customFileInput.getDescription(), 'My Description 2');

		assert.strictEqual(didChangeLabelCounter, 2);

		customFileInput.dispose();

		// Disallowed with local file input
		const fileInput = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'), undefined, undefined, 'My Name', 'My Description');

		didChangeLabelCounter = 0;
		disposables.add(fileInput.onDidChangeLabel(() => {
			didChangeLabelCounter++;
		}));

		assert.notStrictEqual(fileInput.getName(), 'My Name');
		assert.notStrictEqual(fileInput.getDescription(), 'My Description');

		fileInput.setPreferredName('My Name 2');
		fileInput.setPreferredDescription('My Description 2');

		assert.notStrictEqual(fileInput.getName(), 'My Name 2');
		assert.notStrictEqual(fileInput.getDescription(), 'My Description 2');

		assert.strictEqual(didChangeLabelCounter, 0);
	});

	test('reports readonly changes', async function () {
		const input = createFileInput(toResource.call(this, '/foo/bar/updatefile.js'));

		let listenerCount = 0;
		disposables.add(input.onDidChangeCapabilities(() => {
			listenerCount++;
		}));

		const model = disposables.add(await accessor.textFileService.files.resolve(input.resource));

		assert.strictEqual(model.isReadonly(), false);
		assert.strictEqual(input.hasCapability(EditorInputCapabilities.Readonly), false);
		assert.strictEqual(input.isReadonly(), false);

		const stat = await accessor.fileService.resolve(input.resource, { resolveMetadata: true });

		try {
			accessor.fileService.readShouldThrowError = new NotModifiedSinceFileOperationError('file not modified since', { ...stat, readonly: true });
			await input.resolve();
		} finally {
			accessor.fileService.readShouldThrowError = undefined;
		}

		assert.strictEqual(!!model.isReadonly(), true);
		assert.strictEqual(input.hasCapability(EditorInputCapabilities.Readonly), true);
		assert.strictEqual(!!input.isReadonly(), true);
		assert.strictEqual(listenerCount, 1);

		try {
			accessor.fileService.readShouldThrowError = new NotModifiedSinceFileOperationError('file not modified since', { ...stat, readonly: false });
			await input.resolve();
		} finally {
			accessor.fileService.readShouldThrowError = undefined;
		}

		assert.strictEqual(model.isReadonly(), false);
		assert.strictEqual(input.hasCapability(EditorInputCapabilities.Readonly), false);
		assert.strictEqual(input.isReadonly(), false);
		assert.strictEqual(listenerCount, 2);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/test/browser/fileOnDiskProvider.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/test/browser/fileOnDiskProvider.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { workbenchInstantiationService, TestServiceAccessor } from '../../../../test/browser/workbenchTestServices.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { TextFileContentProvider } from '../../common/files.js';
import { snapshotToString } from '../../../../services/textfile/common/textfiles.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('Files - FileOnDiskContentProvider', () => {

	const disposables = new DisposableStore();
	let instantiationService: IInstantiationService;
	let accessor: TestServiceAccessor;

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables);
		accessor = instantiationService.createInstance(TestServiceAccessor);
	});

	teardown(() => {
		disposables.clear();
	});

	test('provideTextContent', async () => {
		const provider = disposables.add(instantiationService.createInstance(TextFileContentProvider));
		const uri = URI.parse('testFileOnDiskContentProvider://foo');

		const content = await provider.provideTextContent(uri.with({ scheme: 'conflictResolution', query: JSON.stringify({ scheme: uri.scheme }) }));

		assert.ok(content);
		assert.strictEqual(snapshotToString(content.createSnapshot()), 'Hello Html');
		assert.strictEqual(accessor.fileService.getLastReadFileUri().scheme, uri.scheme);
		assert.strictEqual(accessor.fileService.getLastReadFileUri().path, uri.path);

		content.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/test/browser/textFileEditorTracker.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/test/browser/textFileEditorTracker.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { timeout } from '../../../../../base/common/async.js';
import { Event } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { isEqual } from '../../../../../base/common/resources.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite, toResource } from '../../../../../base/test/common/utils.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { FileChangesEvent, FileChangeType, FileOperationError, FileOperationResult } from '../../../../../platform/files/common/files.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { UriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentityService.js';
import { TestWorkspace } from '../../../../../platform/workspace/test/common/testWorkspace.js';
import { DEFAULT_EDITOR_ASSOCIATION } from '../../../../common/editor.js';
import { EditorService } from '../../../../services/editor/browser/editorService.js';
import { IEditorGroupsService } from '../../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { IFilesConfigurationService } from '../../../../services/filesConfiguration/common/filesConfigurationService.js';
import { TextFileEditorModelManager } from '../../../../services/textfile/common/textFileEditorModelManager.js';
import { IResolvedTextFileEditorModel, ITextFileService, snapshotToString } from '../../../../services/textfile/common/textfiles.js';
import { UntitledTextEditorInput } from '../../../../services/untitled/common/untitledTextEditorInput.js';
import { createEditorPart, registerTestFileEditor, registerTestResourceEditor, TestEnvironmentService, TestFilesConfigurationService, TestServiceAccessor, TestTextResourceConfigurationService, workbenchInstantiationService, workbenchTeardown } from '../../../../test/browser/workbenchTestServices.js';
import { TestContextService, TestFileService, TestMarkerService } from '../../../../test/common/workbenchTestServices.js';
import { TextFileEditorTracker } from '../../browser/editors/textFileEditorTracker.js';
import { FILE_EDITOR_INPUT_ID } from '../../common/files.js';

suite('Files - TextFileEditorTracker', () => {

	const disposables = new DisposableStore();

	class TestTextFileEditorTracker extends TextFileEditorTracker {

		protected override getDirtyTextFileTrackerDelay(): number {
			return 5; // encapsulated in a method for tests to override
		}
	}

	setup(() => {
		disposables.add(registerTestFileEditor());
		disposables.add(registerTestResourceEditor());
	});

	teardown(() => {
		disposables.clear();
	});

	async function createTracker(autoSaveEnabled = false): Promise<{ accessor: TestServiceAccessor; cleanup: () => Promise<void> }> {
		const instantiationService = workbenchInstantiationService(undefined, disposables);

		const configurationService = new TestConfigurationService();
		if (autoSaveEnabled) {
			configurationService.setUserConfiguration('files', { autoSave: 'afterDelay', autoSaveDelay: 1 });
		} else {
			configurationService.setUserConfiguration('files', { autoSave: 'off', autoSaveDelay: 1 });
		}

		instantiationService.stub(IConfigurationService, configurationService);

		const fileService = disposables.add(new TestFileService());

		instantiationService.stub(IFilesConfigurationService, disposables.add(new TestFilesConfigurationService(
			<IContextKeyService>instantiationService.createInstance(MockContextKeyService),
			configurationService,
			new TestContextService(TestWorkspace),
			TestEnvironmentService,
			disposables.add(new UriIdentityService(fileService)),
			fileService,
			new TestMarkerService(),
			new TestTextResourceConfigurationService(configurationService)
		)));

		const part = await createEditorPart(instantiationService, disposables);
		instantiationService.stub(IEditorGroupsService, part);

		const editorService: EditorService = disposables.add(instantiationService.createInstance(EditorService, undefined));
		disposables.add(editorService);
		instantiationService.stub(IEditorService, editorService);

		const accessor = instantiationService.createInstance(TestServiceAccessor);
		disposables.add((<TextFileEditorModelManager>accessor.textFileService.files));

		disposables.add(instantiationService.createInstance(TestTextFileEditorTracker));

		const cleanup = async () => {
			await workbenchTeardown(instantiationService);
			part.dispose();
		};

		return { accessor, cleanup };
	}

	test('file change event updates model', async function () {
		const { accessor, cleanup } = await createTracker();

		const resource = toResource.call(this, '/path/index.txt');

		const model = await accessor.textFileService.files.resolve(resource) as IResolvedTextFileEditorModel;
		disposables.add(model);

		model.textEditorModel.setValue('Super Good');
		assert.strictEqual(snapshotToString(model.createSnapshot()!), 'Super Good');

		await model.save();

		// change event (watcher)
		accessor.fileService.fireFileChanges(new FileChangesEvent([{ resource, type: FileChangeType.UPDATED }], false));

		await timeout(0); // due to event updating model async

		assert.strictEqual(snapshotToString(model.createSnapshot()!), 'Hello Html');

		await cleanup();
	});

	test('dirty text file model opens as editor', async function () {
		const resource = toResource.call(this, '/path/index.txt');

		await testDirtyTextFileModelOpensEditorDependingOnAutoSaveSetting(resource, false, false);
	});

	test('dirty text file model does not open as editor if autosave is ON', async function () {
		const resource = toResource.call(this, '/path/index.txt');

		await testDirtyTextFileModelOpensEditorDependingOnAutoSaveSetting(resource, true, false);
	});

	test('dirty text file model opens as editor when save fails', async function () {
		const resource = toResource.call(this, '/path/index.txt');

		await testDirtyTextFileModelOpensEditorDependingOnAutoSaveSetting(resource, false, true);
	});

	test('dirty text file model opens as editor when save fails if autosave is ON', async function () {
		const resource = toResource.call(this, '/path/index.txt');

		await testDirtyTextFileModelOpensEditorDependingOnAutoSaveSetting(resource, true, true);
	});

	async function testDirtyTextFileModelOpensEditorDependingOnAutoSaveSetting(resource: URI, autoSave: boolean, error: boolean): Promise<void> {
		const { accessor, cleanup } = await createTracker(autoSave);

		assert.ok(!accessor.editorService.isOpened({ resource, typeId: FILE_EDITOR_INPUT_ID, editorId: DEFAULT_EDITOR_ASSOCIATION.id }));

		if (error) {
			accessor.textFileService.setWriteErrorOnce(new FileOperationError('fail to write', FileOperationResult.FILE_OTHER_ERROR));
		}

		const model = await accessor.textFileService.files.resolve(resource) as IResolvedTextFileEditorModel;
		disposables.add(model);

		model.textEditorModel.setValue('Super Good');

		if (autoSave) {
			await model.save();
			await timeout(10);
			if (error) {
				assert.ok(accessor.editorService.isOpened({ resource, typeId: FILE_EDITOR_INPUT_ID, editorId: DEFAULT_EDITOR_ASSOCIATION.id }));
			} else {
				assert.ok(!accessor.editorService.isOpened({ resource, typeId: FILE_EDITOR_INPUT_ID, editorId: DEFAULT_EDITOR_ASSOCIATION.id }));
			}
		} else {
			await awaitEditorOpening(accessor.editorService);
			assert.ok(accessor.editorService.isOpened({ resource, typeId: FILE_EDITOR_INPUT_ID, editorId: DEFAULT_EDITOR_ASSOCIATION.id }));
		}

		await cleanup();
	}

	test('dirty untitled text file model opens as editor', function () {
		return testUntitledEditor(false);
	});

	test('dirty untitled text file model opens as editor - autosave ON', function () {
		return testUntitledEditor(true);
	});

	async function testUntitledEditor(autoSaveEnabled: boolean): Promise<void> {
		const { accessor, cleanup } = await createTracker(autoSaveEnabled);

		const untitledTextEditor = await accessor.textEditorService.resolveTextEditor({ resource: undefined, forceUntitled: true }) as UntitledTextEditorInput;
		const model = disposables.add(await untitledTextEditor.resolve());

		assert.ok(!accessor.editorService.isOpened(untitledTextEditor));

		model.textEditorModel?.setValue('Super Good');

		await awaitEditorOpening(accessor.editorService);
		assert.ok(accessor.editorService.isOpened(untitledTextEditor));

		await cleanup();
	}

	function awaitEditorOpening(editorService: IEditorService): Promise<void> {
		return Event.toPromise(Event.once(editorService.onDidActiveEditorChange));
	}

	test('non-dirty files reload on window focus', async function () {
		const { accessor, cleanup } = await createTracker();

		const resource = toResource.call(this, '/path/index.txt');

		await accessor.editorService.openEditor(await accessor.textEditorService.resolveTextEditor({ resource, options: { override: DEFAULT_EDITOR_ASSOCIATION.id } }));

		accessor.hostService.setFocus(false);
		accessor.hostService.setFocus(true);

		await awaitModelResolveEvent(accessor.textFileService, resource);

		await cleanup();
	});

	function awaitModelResolveEvent(textFileService: ITextFileService, resource: URI): Promise<void> {
		return new Promise(resolve => {
			const listener = textFileService.files.onDidResolve(e => {
				if (isEqual(e.model.resource, resource)) {
					listener.dispose();
					resolve();
				}
			});
		});
	}

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/folding/browser/folding.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/folding/browser/folding.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { FoldingController } from '../../../../editor/contrib/folding/browser/folding.js';
import * as nls from '../../../../nls.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContributionsRegistry, IWorkbenchContribution } from '../../../common/contributions.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions } from '../../../../platform/configuration/common/configurationRegistry.js';
import { editorConfigurationBaseNode } from '../../../../editor/common/config/editorConfigurationSchema.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { FoldingRangeProvider } from '../../../../editor/common/languages.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';

class DefaultFoldingRangeProvider extends Disposable implements IWorkbenchContribution {

	static readonly configName = 'editor.defaultFoldingRangeProvider';

	static extensionIds: (string | null)[] = [];
	static extensionItemLabels: string[] = [];
	static extensionDescriptions: string[] = [];

	constructor(
		@IExtensionService private readonly _extensionService: IExtensionService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
	) {
		super();
		this._store.add(this._extensionService.onDidChangeExtensions(this._updateConfigValues, this));
		this._store.add(FoldingController.setFoldingRangeProviderSelector(this._selectFoldingRangeProvider.bind(this)));

		this._updateConfigValues();
	}

	private async _updateConfigValues(): Promise<void> {
		await this._extensionService.whenInstalledExtensionsRegistered();

		DefaultFoldingRangeProvider.extensionIds.length = 0;
		DefaultFoldingRangeProvider.extensionItemLabels.length = 0;
		DefaultFoldingRangeProvider.extensionDescriptions.length = 0;

		DefaultFoldingRangeProvider.extensionIds.push(null);
		DefaultFoldingRangeProvider.extensionItemLabels.push(nls.localize('null', 'All'));
		DefaultFoldingRangeProvider.extensionDescriptions.push(nls.localize('nullFormatterDescription', "All active folding range providers"));

		const languageExtensions: IExtensionDescription[] = [];
		const otherExtensions: IExtensionDescription[] = [];

		for (const extension of this._extensionService.extensions) {
			if (extension.main || extension.browser) {
				if (extension.categories?.find(cat => cat === 'Programming Languages')) {
					languageExtensions.push(extension);
				} else {
					otherExtensions.push(extension);
				}
			}
		}

		const sorter = (a: IExtensionDescription, b: IExtensionDescription) => a.name.localeCompare(b.name);

		for (const extension of languageExtensions.sort(sorter)) {
			DefaultFoldingRangeProvider.extensionIds.push(extension.identifier.value);
			DefaultFoldingRangeProvider.extensionItemLabels.push(extension.displayName ?? '');
			DefaultFoldingRangeProvider.extensionDescriptions.push(extension.description ?? '');
		}
		for (const extension of otherExtensions.sort(sorter)) {
			DefaultFoldingRangeProvider.extensionIds.push(extension.identifier.value);
			DefaultFoldingRangeProvider.extensionItemLabels.push(extension.displayName ?? '');
			DefaultFoldingRangeProvider.extensionDescriptions.push(extension.description ?? '');
		}
	}

	private _selectFoldingRangeProvider(providers: FoldingRangeProvider[], document: ITextModel): FoldingRangeProvider[] | undefined {
		const value = this._configurationService.getValue<string>(DefaultFoldingRangeProvider.configName, { overrideIdentifier: document.getLanguageId() });
		if (value) {
			return providers.filter(p => p.id === value);
		}
		return undefined;
	}
}

Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).registerConfiguration({
	...editorConfigurationBaseNode,
	properties: {
		[DefaultFoldingRangeProvider.configName]: {
			description: nls.localize('formatter.default', "Defines a default folding range provider that takes precedence over all other folding range providers. Must be the identifier of an extension contributing a folding range provider."),
			type: ['string', 'null'],
			default: null,
			enum: DefaultFoldingRangeProvider.extensionIds,
			enumItemLabels: DefaultFoldingRangeProvider.extensionItemLabels,
			markdownEnumDescriptions: DefaultFoldingRangeProvider.extensionDescriptions
		}
	}
});

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(
	DefaultFoldingRangeProvider,
	LifecyclePhase.Restored
);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/format/browser/format.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/format/browser/format.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './formatActionsMultiple.js';
import './formatActionsNone.js';
import './formatModified.js';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/format/browser/formatActionsMultiple.ts]---
Location: vscode-main/src/vs/workbench/contrib/format/browser/formatActionsMultiple.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getCodeEditor, ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { EditorAction, registerEditorAction } from '../../../../editor/browser/editorExtensions.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { DocumentFormattingEditProvider, DocumentRangeFormattingEditProvider } from '../../../../editor/common/languages.js';
import * as nls from '../../../../nls.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { IQuickInputService, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { formatDocumentRangesWithProvider, formatDocumentWithProvider, getRealAndSyntheticDocumentFormattersOrdered, FormattingConflicts, FormattingMode, FormattingKind } from '../../../../editor/contrib/format/browser/format.js';
import { Range } from '../../../../editor/common/core/range.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions } from '../../../../platform/configuration/common/configurationRegistry.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContributionsRegistry, IWorkbenchContribution } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { IExtensionService, toExtension } from '../../../services/extensions/common/extensions.js';
import { Disposable, DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { INotificationService, NotificationPriority, Severity } from '../../../../platform/notification/common/notification.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { IWorkbenchExtensionEnablementService } from '../../../services/extensionManagement/common/extensionManagement.js';
import { editorConfigurationBaseNode } from '../../../../editor/common/config/editorConfigurationSchema.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { ILanguageFeaturesService } from '../../../../editor/common/services/languageFeatures.js';
import { ILanguageStatusService } from '../../../services/languageStatus/common/languageStatusService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { generateUuid } from '../../../../base/common/uuid.js';

type FormattingEditProvider = DocumentFormattingEditProvider | DocumentRangeFormattingEditProvider;

export class DefaultFormatter extends Disposable implements IWorkbenchContribution {

	static readonly configName = 'editor.defaultFormatter';

	static extensionIds: (string | null)[] = [];
	static extensionItemLabels: string[] = [];
	static extensionDescriptions: string[] = [];

	private readonly _languageStatusStore = this._store.add(new DisposableStore());

	constructor(
		@IExtensionService private readonly _extensionService: IExtensionService,
		@IWorkbenchExtensionEnablementService private readonly _extensionEnablementService: IWorkbenchExtensionEnablementService,
		@IConfigurationService private readonly _configService: IConfigurationService,
		@INotificationService private readonly _notificationService: INotificationService,
		@IDialogService private readonly _dialogService: IDialogService,
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
		@ILanguageService private readonly _languageService: ILanguageService,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
		@ILanguageStatusService private readonly _languageStatusService: ILanguageStatusService,
		@IEditorService private readonly _editorService: IEditorService,
	) {
		super();
		this._store.add(this._extensionService.onDidChangeExtensions(this._updateConfigValues, this));
		this._store.add(FormattingConflicts.setFormatterSelector((formatter, document, mode, kind) => this._selectFormatter(formatter, document, mode, kind)));
		this._store.add(_editorService.onDidActiveEditorChange(this._updateStatus, this));
		this._store.add(_languageFeaturesService.documentFormattingEditProvider.onDidChange(this._updateStatus, this));
		this._store.add(_languageFeaturesService.documentRangeFormattingEditProvider.onDidChange(this._updateStatus, this));
		this._store.add(_languageFeaturesService.documentFormattingEditProvider.onDidChange(this._updateConfigValues, this));
		this._store.add(_languageFeaturesService.documentRangeFormattingEditProvider.onDidChange(this._updateConfigValues, this));
		this._store.add(_configService.onDidChangeConfiguration(e => e.affectsConfiguration(DefaultFormatter.configName) && this._updateStatus()));
		this._updateConfigValues();
	}

	private async _updateConfigValues(): Promise<void> {
		await this._extensionService.whenInstalledExtensionsRegistered();
		let extensions = [...this._extensionService.extensions];

		// Get all formatter providers to identify which extensions actually contribute formatters
		const documentFormatters = this._languageFeaturesService.documentFormattingEditProvider.allNoModel();
		const rangeFormatters = this._languageFeaturesService.documentRangeFormattingEditProvider.allNoModel();
		const formatterExtensionIds = new Set<string>();

		for (const formatter of documentFormatters) {
			if (formatter.extensionId) {
				formatterExtensionIds.add(ExtensionIdentifier.toKey(formatter.extensionId));
			}
		}
		for (const formatter of rangeFormatters) {
			if (formatter.extensionId) {
				formatterExtensionIds.add(ExtensionIdentifier.toKey(formatter.extensionId));
			}
		}

		extensions = extensions.sort((a, b) => {
			// Ultimate boost: extensions that actually contribute formatters
			const contributesFormatterA = formatterExtensionIds.has(ExtensionIdentifier.toKey(a.identifier));
			const contributesFormatterB = formatterExtensionIds.has(ExtensionIdentifier.toKey(b.identifier));

			if (contributesFormatterA && !contributesFormatterB) {
				return -1;
			} else if (!contributesFormatterA && contributesFormatterB) {
				return 1;
			}

			// Secondary boost: category-based sorting
			const boostA = a.categories?.find(cat => cat === 'Formatters' || cat === 'Programming Languages');
			const boostB = b.categories?.find(cat => cat === 'Formatters' || cat === 'Programming Languages');

			if (boostA && !boostB) {
				return -1;
			} else if (!boostA && boostB) {
				return 1;
			} else {
				return a.name.localeCompare(b.name);
			}
		});

		DefaultFormatter.extensionIds.length = 0;
		DefaultFormatter.extensionItemLabels.length = 0;
		DefaultFormatter.extensionDescriptions.length = 0;

		DefaultFormatter.extensionIds.push(null);
		DefaultFormatter.extensionItemLabels.push(nls.localize('null', 'None'));
		DefaultFormatter.extensionDescriptions.push(nls.localize('nullFormatterDescription', "None"));

		for (const extension of extensions) {
			if (extension.main || extension.browser) {
				DefaultFormatter.extensionIds.push(extension.identifier.value);
				DefaultFormatter.extensionItemLabels.push(extension.displayName ?? '');
				DefaultFormatter.extensionDescriptions.push(extension.description ?? '');
			}
		}
	}

	static _maybeQuotes(s: string): string {
		return s.match(/\s/) ? `'${s}'` : s;
	}

	private async _analyzeFormatter<T extends FormattingEditProvider>(kind: FormattingKind, formatter: T[], document: ITextModel): Promise<T | string> {
		const defaultFormatterId = this._configService.getValue<string>(DefaultFormatter.configName, {
			resource: document.uri,
			overrideIdentifier: document.getLanguageId()
		});

		if (defaultFormatterId) {
			// good -> formatter configured
			const defaultFormatter = formatter.find(formatter => ExtensionIdentifier.equals(formatter.extensionId, defaultFormatterId));
			if (defaultFormatter) {
				// formatter available
				return defaultFormatter;
			}

			// bad -> formatter gone
			const extension = await this._extensionService.getExtension(defaultFormatterId);
			if (extension && this._extensionEnablementService.isEnabled(toExtension(extension))) {
				// formatter does not target this file
				const langName = this._languageService.getLanguageName(document.getLanguageId()) || document.getLanguageId();
				const detail = kind === FormattingKind.File
					? nls.localize('miss.1', "Extension '{0}' is configured as formatter but it cannot format '{1}'-files", extension.displayName || extension.name, langName)
					: nls.localize('miss.2', "Extension '{0}' is configured as formatter but it can only format '{1}'-files as a whole, not selections or parts of it.", extension.displayName || extension.name, langName);
				return detail;
			}

		} else if (formatter.length === 1) {
			// ok -> nothing configured but only one formatter available
			return formatter[0];
		}

		const langName = this._languageService.getLanguageName(document.getLanguageId()) || document.getLanguageId();
		const message = !defaultFormatterId
			? nls.localize('config.needed', "There are multiple formatters for '{0}' files. One of them should be configured as default formatter.", DefaultFormatter._maybeQuotes(langName))
			: nls.localize('config.bad', "Extension '{0}' is configured as formatter but not available. Select a different default formatter to continue.", defaultFormatterId);

		return message;
	}

	private async _selectFormatter<T extends FormattingEditProvider>(formatter: T[], document: ITextModel, mode: FormattingMode, kind: FormattingKind): Promise<T | undefined> {
		const formatterOrMessage = await this._analyzeFormatter(kind, formatter, document);
		if (typeof formatterOrMessage !== 'string') {
			return formatterOrMessage;
		}

		if (mode !== FormattingMode.Silent) {
			// running from a user action -> show modal dialog so that users configure
			// a default formatter
			const { confirmed } = await this._dialogService.confirm({
				message: nls.localize('miss', "Configure Default Formatter"),
				detail: formatterOrMessage,
				primaryButton: nls.localize({ key: 'do.config', comment: ['&& denotes a mnemonic'] }, "&&Configure...")
			});
			if (confirmed) {
				return this._pickAndPersistDefaultFormatter(formatter, document);
			}
		} else {
			// no user action -> show a silent notification and proceed
			this._notificationService.prompt(
				Severity.Info,
				formatterOrMessage,
				[{ label: nls.localize('do.config.notification', "Configure..."), run: () => this._pickAndPersistDefaultFormatter(formatter, document) }],
				{ priority: NotificationPriority.SILENT }
			);
		}
		return undefined;
	}

	private async _pickAndPersistDefaultFormatter<T extends FormattingEditProvider>(formatter: T[], document: ITextModel): Promise<T | undefined> {
		const picks = formatter.map((formatter, index): IIndexedPick => {
			return {
				index,
				label: formatter.displayName || (formatter.extensionId ? formatter.extensionId.value : '?'),
				description: formatter.extensionId && formatter.extensionId.value
			};
		});
		const langName = this._languageService.getLanguageName(document.getLanguageId()) || document.getLanguageId();
		const pick = await this._quickInputService.pick(picks, { placeHolder: nls.localize('select', "Select a default formatter for '{0}' files", DefaultFormatter._maybeQuotes(langName)) });
		if (!pick || !formatter[pick.index].extensionId) {
			return undefined;
		}
		this._configService.updateValue(DefaultFormatter.configName, formatter[pick.index].extensionId!.value, {
			resource: document.uri,
			overrideIdentifier: document.getLanguageId()
		});
		return formatter[pick.index];
	}

	// --- status item

	private _updateStatus() {
		this._languageStatusStore.clear();

		const editor = getCodeEditor(this._editorService.activeTextEditorControl);
		if (!editor || !editor.hasModel()) {
			return;
		}


		const document = editor.getModel();
		const formatter = getRealAndSyntheticDocumentFormattersOrdered(this._languageFeaturesService.documentFormattingEditProvider, this._languageFeaturesService.documentRangeFormattingEditProvider, document);

		if (formatter.length === 0) {
			return;
		}

		const cts = new CancellationTokenSource();
		this._languageStatusStore.add(toDisposable(() => cts.dispose(true)));

		this._analyzeFormatter(FormattingKind.File, formatter, document).then(result => {
			if (cts.token.isCancellationRequested) {
				return;
			}
			if (typeof result !== 'string') {
				return;
			}
			const command = { id: `formatter/configure/dfl/${generateUuid()}`, title: nls.localize('do.config.command', "Configure...") };
			this._languageStatusStore.add(CommandsRegistry.registerCommand(command.id, () => this._pickAndPersistDefaultFormatter(formatter, document)));
			this._languageStatusStore.add(this._languageStatusService.addStatus({
				id: 'formatter.conflict',
				name: nls.localize('summary', "Formatter Conflicts"),
				selector: { language: document.getLanguageId(), pattern: document.uri.fsPath },
				severity: Severity.Error,
				label: nls.localize('formatter', "Formatting"),
				detail: result,
				busy: false,
				source: '',
				command,
				accessibilityInfo: undefined
			}));
		});
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(
	DefaultFormatter,
	LifecyclePhase.Restored
);

Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).registerConfiguration({
	...editorConfigurationBaseNode,
	properties: {
		[DefaultFormatter.configName]: {
			description: nls.localize('formatter.default', "Defines a default formatter which takes precedence over all other formatter settings. Must be the identifier of an extension contributing a formatter."),
			type: ['string', 'null'],
			default: null,
			enum: DefaultFormatter.extensionIds,
			enumItemLabels: DefaultFormatter.extensionItemLabels,
			markdownEnumDescriptions: DefaultFormatter.extensionDescriptions
		}
	}
});

interface IIndexedPick extends IQuickPickItem {
	index: number;
}


async function showFormatterPick(accessor: ServicesAccessor, model: ITextModel, formatters: FormattingEditProvider[]): Promise<number | undefined> {
	const quickPickService = accessor.get(IQuickInputService);
	const configService = accessor.get(IConfigurationService);
	const languageService = accessor.get(ILanguageService);

	const overrides = { resource: model.uri, overrideIdentifier: model.getLanguageId() };
	const defaultFormatter = configService.getValue<string>(DefaultFormatter.configName, overrides);

	let defaultFormatterPick: IIndexedPick | undefined;

	const picks = formatters.map((provider, index) => {
		const isDefault = ExtensionIdentifier.equals(provider.extensionId, defaultFormatter);
		const pick: IIndexedPick = {
			index,
			label: provider.displayName || '',
			description: isDefault ? nls.localize('def', "(default)") : undefined,
		};

		if (isDefault) {
			// autofocus default pick
			defaultFormatterPick = pick;
		}

		return pick;
	});

	const configurePick: IQuickPickItem = {
		label: nls.localize('config', "Configure Default Formatter...")
	};

	const pick = await quickPickService.pick([...picks, { type: 'separator' }, configurePick],
		{
			placeHolder: nls.localize('format.placeHolder', "Select a formatter"),
			activeItem: defaultFormatterPick
		}
	);
	if (!pick) {
		// dismissed
		return undefined;

	} else if (pick === configurePick) {
		// config default
		const langName = languageService.getLanguageName(model.getLanguageId()) || model.getLanguageId();
		const pick = await quickPickService.pick(picks, { placeHolder: nls.localize('select', "Select a default formatter for '{0}' files", DefaultFormatter._maybeQuotes(langName)) });
		if (pick && formatters[pick.index].extensionId) {
			configService.updateValue(DefaultFormatter.configName, formatters[pick.index].extensionId!.value, overrides);
		}
		return undefined;

	} else {
		// picked one
		return (<IIndexedPick>pick).index;
	}

}

registerEditorAction(class FormatDocumentMultipleAction extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.formatDocument.multiple',
			label: nls.localize('formatDocument.label.multiple', "Format Document With..."),
			alias: 'Format Document...',
			precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasMultipleDocumentFormattingProvider),
			contextMenuOpts: {
				group: '1_modification',
				order: 1.3
			}
		});
	}

	async run(accessor: ServicesAccessor, editor: ICodeEditor, args: unknown): Promise<void> {
		if (!editor.hasModel()) {
			return;
		}
		const instaService = accessor.get(IInstantiationService);
		const languageFeaturesService = accessor.get(ILanguageFeaturesService);
		const model = editor.getModel();
		const provider = getRealAndSyntheticDocumentFormattersOrdered(languageFeaturesService.documentFormattingEditProvider, languageFeaturesService.documentRangeFormattingEditProvider, model);
		const pick = await instaService.invokeFunction(showFormatterPick, model, provider);
		if (typeof pick === 'number') {
			await instaService.invokeFunction(formatDocumentWithProvider, provider[pick], editor, FormattingMode.Explicit, CancellationToken.None);
		}
	}
});

registerEditorAction(class FormatSelectionMultipleAction extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.formatSelection.multiple',
			label: nls.localize('formatSelection.label.multiple', "Format Selection With..."),
			alias: 'Format Code...',
			precondition: ContextKeyExpr.and(ContextKeyExpr.and(EditorContextKeys.writable), EditorContextKeys.hasMultipleDocumentSelectionFormattingProvider),
			contextMenuOpts: {
				when: ContextKeyExpr.and(EditorContextKeys.hasNonEmptySelection),
				group: '1_modification',
				order: 1.31
			}
		});
	}

	async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		if (!editor.hasModel()) {
			return;
		}
		const instaService = accessor.get(IInstantiationService);
		const languageFeaturesService = accessor.get(ILanguageFeaturesService);

		const model = editor.getModel();
		let range: Range = editor.getSelection();
		if (range.isEmpty()) {
			range = new Range(range.startLineNumber, 1, range.startLineNumber, model.getLineMaxColumn(range.startLineNumber));
		}

		const provider = languageFeaturesService.documentRangeFormattingEditProvider.ordered(model);
		const pick = await instaService.invokeFunction(showFormatterPick, model, provider);
		if (typeof pick === 'number') {
			await instaService.invokeFunction(formatDocumentRangesWithProvider, provider[pick], editor, range, CancellationToken.None, true);
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/format/browser/formatActionsNone.ts]---
Location: vscode-main/src/vs/workbench/contrib/format/browser/formatActionsNone.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { EditorAction, registerEditorAction, ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import * as nls from '../../../../nls.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IExtensionsWorkbenchService } from '../../extensions/common/extensions.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { ILanguageFeaturesService } from '../../../../editor/common/services/languageFeatures.js';

registerEditorAction(class FormatDocumentMultipleAction extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.formatDocument.none',
			label: nls.localize2('formatDocument.label.multiple', "Format Document"),
			precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasDocumentFormattingProvider.toNegated()),
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.Shift | KeyMod.Alt | KeyCode.KeyF,
				linux: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyI },
				weight: KeybindingWeight.EditorContrib,
			}
		});
	}

	async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		if (!editor.hasModel()) {
			return;
		}

		const commandService = accessor.get(ICommandService);
		const extensionsWorkbenchService = accessor.get(IExtensionsWorkbenchService);
		const notificationService = accessor.get(INotificationService);
		const dialogService = accessor.get(IDialogService);
		const languageFeaturesService = accessor.get(ILanguageFeaturesService);

		const model = editor.getModel();
		const formatterCount = languageFeaturesService.documentFormattingEditProvider.all(model).length;

		if (formatterCount > 1) {
			return commandService.executeCommand('editor.action.formatDocument.multiple');
		} else if (formatterCount === 1) {
			return commandService.executeCommand('editor.action.formatDocument');
		} else if (model.isTooLargeForSyncing()) {
			notificationService.warn(nls.localize('too.large', "This file cannot be formatted because it is too large"));
		} else {
			const langName = model.getLanguageId();
			const message = nls.localize('no.provider', "There is no formatter for '{0}' files installed.", langName);
			const { confirmed } = await dialogService.confirm({
				message,
				primaryButton: nls.localize({ key: 'install.formatter', comment: ['&& denotes a mnemonic'] }, "&&Install Formatter...")
			});
			if (confirmed) {
				extensionsWorkbenchService.openSearch(`category:formatters ${langName}`);
			}
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/format/browser/formatModified.ts]---
Location: vscode-main/src/vs/workbench/contrib/format/browser/formatModified.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isNonEmptyArray } from '../../../../base/common/arrays.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { EditorAction, registerEditorAction, ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { Range } from '../../../../editor/common/core/range.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { ITextModel, shouldSynchronizeModel } from '../../../../editor/common/model.js';
import { IEditorWorkerService } from '../../../../editor/common/services/editorWorker.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { formatDocumentRangesWithSelectedProvider, FormattingMode } from '../../../../editor/contrib/format/browser/format.js';
import * as nls from '../../../../nls.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { Progress } from '../../../../platform/progress/common/progress.js';
import { IQuickDiffService } from '../../scm/common/quickDiff.js';
import { getOriginalResource } from '../../scm/common/quickDiffService.js';

registerEditorAction(class FormatModifiedAction extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.formatChanges',
			label: nls.localize2('formatChanges', "Format Modified Lines"),
			precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasDocumentSelectionFormattingProvider),
		});
	}

	async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const instaService = accessor.get(IInstantiationService);

		if (!editor.hasModel()) {
			return;
		}

		const ranges = await instaService.invokeFunction(getModifiedRanges, editor.getModel());
		if (isNonEmptyArray(ranges)) {
			return instaService.invokeFunction(
				formatDocumentRangesWithSelectedProvider, editor, ranges,
				FormattingMode.Explicit, Progress.None, CancellationToken.None,
				true
			);
		}
	}
});

export async function getModifiedRanges(accessor: ServicesAccessor, modified: ITextModel): Promise<Range[] | undefined | null> {
	const quickDiffService = accessor.get(IQuickDiffService);
	const workerService = accessor.get(IEditorWorkerService);
	const modelService = accessor.get(ITextModelService);

	const original = await getOriginalResource(quickDiffService, modified.uri, modified.getLanguageId(), shouldSynchronizeModel(modified));
	if (!original) {
		return null; // let undefined signify no changes, null represents no source control (there's probably a better way, but I can't think of one rn)
	}

	const ranges: Range[] = [];
	const ref = await modelService.createModelReference(original);
	try {
		if (!workerService.canComputeDirtyDiff(original, modified.uri)) {
			return undefined;
		}
		const changes = await workerService.computeDirtyDiff(original, modified.uri, false);
		if (!isNonEmptyArray(changes)) {
			return undefined;
		}
		for (const change of changes) {
			ranges.push(modified.validateRange(new Range(
				change.modifiedStartLineNumber, 1,
				change.modifiedEndLineNumber || change.modifiedStartLineNumber /*endLineNumber is 0 when things got deleted*/, Number.MAX_SAFE_INTEGER)
			));
		}
	} finally {
		ref.dispose();
	}

	return ranges;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/inlayHints/browser/inlayHintsAccessibilty.ts]---
Location: vscode-main/src/vs/workbench/contrib/inlayHints/browser/inlayHintsAccessibilty.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { EditorAction2, EditorContributionInstantiation, registerEditorContribution } from '../../../../editor/browser/editorExtensions.js';
import { IEditorContribution } from '../../../../editor/common/editorCommon.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { InlayHintItem, asCommandLink } from '../../../../editor/contrib/inlayHints/browser/inlayHints.js';
import { InlayHintsController } from '../../../../editor/contrib/inlayHints/browser/inlayHintsController.js';
import { localize, localize2 } from '../../../../nls.js';
import { registerAction2 } from '../../../../platform/actions/common/actions.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { Link } from '../../../../platform/opener/browser/link.js';


export class InlayHintsAccessibility implements IEditorContribution {

	static readonly IsReading = new RawContextKey<boolean>('isReadingLineWithInlayHints', false, { type: 'boolean', description: localize('isReadingLineWithInlayHints', "Whether the current line and its inlay hints are currently focused") });

	static readonly ID: string = 'editor.contrib.InlayHintsAccessibility';

	static get(editor: ICodeEditor): InlayHintsAccessibility | undefined {
		return editor.getContribution<InlayHintsAccessibility>(InlayHintsAccessibility.ID) ?? undefined;
	}

	private readonly _ariaElement: HTMLSpanElement;
	private readonly _ctxIsReading: IContextKey<boolean>;

	private readonly _sessionDispoosables = new DisposableStore();

	constructor(
		private readonly _editor: ICodeEditor,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IAccessibilitySignalService private readonly _accessibilitySignalService: IAccessibilitySignalService,
		@IInstantiationService private readonly _instaService: IInstantiationService,
	) {
		this._ariaElement = document.createElement('span');
		this._ariaElement.style.position = 'fixed';
		this._ariaElement.className = 'inlayhint-accessibility-element';
		this._ariaElement.tabIndex = 0;
		this._ariaElement.setAttribute('aria-description', localize('description', "Code with Inlay Hint Information"));

		this._ctxIsReading = InlayHintsAccessibility.IsReading.bindTo(contextKeyService);
	}

	dispose(): void {
		this._sessionDispoosables.dispose();
		this._ctxIsReading.reset();
		this._ariaElement.remove();
	}

	private _reset(): void {
		dom.clearNode(this._ariaElement);
		this._sessionDispoosables.clear();
		this._ctxIsReading.reset();
	}

	private async _read(line: number, hints: InlayHintItem[]) {

		this._sessionDispoosables.clear();

		if (!this._ariaElement.isConnected) {
			this._editor.getDomNode()?.appendChild(this._ariaElement);
		}

		if (!this._editor.hasModel() || !this._ariaElement.isConnected) {
			this._ctxIsReading.set(false);
			return;
		}

		const cts = new CancellationTokenSource();
		this._sessionDispoosables.add(cts);

		for (const hint of hints) {
			await hint.resolve(cts.token);
		}

		if (cts.token.isCancellationRequested) {
			return;
		}
		const model = this._editor.getModel();
		// const text = this._editor.getModel().getLineContent(line);
		const newChildren: (string | HTMLElement)[] = [];

		let start = 0;
		let tooLongToRead = false;

		for (const item of hints) {

			// text
			const part = model.getValueInRange({ startLineNumber: line, startColumn: start + 1, endLineNumber: line, endColumn: item.hint.position.column });
			if (part.length > 0) {
				newChildren.push(part);
				start = item.hint.position.column - 1;
			}

			// check length
			if (start > 750) {
				newChildren.push('…');
				tooLongToRead = true;
				break;
			}

			// hint
			const em = document.createElement('em');
			const { label } = item.hint;
			if (typeof label === 'string') {
				em.innerText = label;
			} else {
				for (const part of label) {
					if (part.command) {
						const link = this._instaService.createInstance(Link, em,
							{ href: asCommandLink(part.command), label: part.label, title: part.command.title },
							undefined
						);
						this._sessionDispoosables.add(link);

					} else {
						em.innerText += part.label;
					}
				}
			}
			newChildren.push(em);
		}

		// trailing text
		if (!tooLongToRead) {
			newChildren.push(model.getValueInRange({ startLineNumber: line, startColumn: start + 1, endLineNumber: line, endColumn: Number.MAX_SAFE_INTEGER }));
		}

		dom.reset(this._ariaElement, ...newChildren);
		this._ariaElement.focus();
		this._ctxIsReading.set(true);

		// reset on blur
		this._sessionDispoosables.add(dom.addDisposableListener(this._ariaElement, 'focusout', () => {
			this._reset();
		}));
	}



	startInlayHintsReading(): void {
		if (!this._editor.hasModel()) {
			return;
		}
		const line = this._editor.getPosition().lineNumber;
		const hints = InlayHintsController.get(this._editor)?.getInlayHintsForLine(line);
		if (!hints || hints.length === 0) {
			this._accessibilitySignalService.playSignal(AccessibilitySignal.noInlayHints);
		} else {
			this._read(line, hints);
		}
	}

	stopInlayHintsReading(): void {
		this._reset();
		this._editor.focus();
	}
}


registerAction2(class StartReadHints extends EditorAction2 {

	constructor() {
		super({
			id: 'inlayHints.startReadingLineWithHint',
			title: localize2('read.title', "Read Line with Inlay Hints"),
			precondition: EditorContextKeys.hasInlayHintsProvider,
			f1: true
		});
	}

	runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor) {
		const ctrl = InlayHintsAccessibility.get(editor);
		ctrl?.startInlayHintsReading();
	}
});

registerAction2(class StopReadHints extends EditorAction2 {

	constructor() {
		super({
			id: 'inlayHints.stopReadingLineWithHint',
			title: localize2('stop.title', "Stop Inlay Hints Reading"),
			precondition: InlayHintsAccessibility.IsReading,
			f1: true,
			keybinding: {
				weight: KeybindingWeight.EditorContrib,
				primary: KeyCode.Escape
			}
		});
	}

	runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor) {
		const ctrl = InlayHintsAccessibility.get(editor);
		ctrl?.stopInlayHintsReading();
	}
});

registerEditorContribution(InlayHintsAccessibility.ID, InlayHintsAccessibility, EditorContributionInstantiation.Lazy);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/inlineChat/browser/inlineChat.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/inlineChat/browser/inlineChat.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EditorContributionInstantiation, registerEditorContribution } from '../../../../editor/browser/editorExtensions.js';
import { IMenuItem, MenuRegistry, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { InlineChatController, InlineChatController1, InlineChatController2 } from './inlineChatController.js';
import * as InlineChatActions from './inlineChatActions.js';
import { CTX_INLINE_CHAT_EDITING, CTX_INLINE_CHAT_V1_ENABLED, CTX_INLINE_CHAT_REQUEST_IN_PROGRESS, INLINE_CHAT_ID, MENU_INLINE_CHAT_WIDGET_STATUS } from '../common/inlineChat.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { InlineChatNotebookContribution } from './inlineChatNotebook.js';
import { IWorkbenchContributionsRegistry, registerWorkbenchContribution2, Extensions as WorkbenchExtensions, WorkbenchPhase } from '../../../common/contributions.js';
import { InlineChatAccessibleView } from './inlineChatAccessibleView.js';
import { IInlineChatSessionService } from './inlineChatSessionService.js';
import { InlineChatEnabler, InlineChatEscapeToolContribution, InlineChatSessionServiceImpl } from './inlineChatSessionServiceImpl.js';
import { AccessibleViewRegistry } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { CancelAction, ChatSubmitAction } from '../../chat/browser/actions/chatExecuteActions.js';
import { localize } from '../../../../nls.js';
import { ChatContextKeys } from '../../chat/common/chatContextKeys.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { InlineChatAccessibilityHelp } from './inlineChatAccessibilityHelp.js';

registerEditorContribution(InlineChatController2.ID, InlineChatController2, EditorContributionInstantiation.Eager); // EAGER because of notebook dispose/create of editors
registerEditorContribution(INLINE_CHAT_ID, InlineChatController1, EditorContributionInstantiation.Eager); // EAGER because of notebook dispose/create of editors
registerEditorContribution(InlineChatController.ID, InlineChatController, EditorContributionInstantiation.Eager); // EAGER because of notebook dispose/create of editors

registerAction2(InlineChatActions.KeepSessionAction2);
registerAction2(InlineChatActions.UndoAndCloseSessionAction2);

// --- browser

registerSingleton(IInlineChatSessionService, InlineChatSessionServiceImpl, InstantiationType.Delayed);

// --- MENU special ---

const editActionMenuItem: IMenuItem = {
	group: '0_main',
	order: 0,
	command: {
		id: ChatSubmitAction.ID,
		title: localize('send.edit', "Edit Code"),
	},
	when: ContextKeyExpr.and(
		ChatContextKeys.inputHasText,
		CTX_INLINE_CHAT_REQUEST_IN_PROGRESS.toNegated(),
		CTX_INLINE_CHAT_EDITING,
		CTX_INLINE_CHAT_V1_ENABLED
	),
};

const generateActionMenuItem: IMenuItem = {
	group: '0_main',
	order: 0,
	command: {
		id: ChatSubmitAction.ID,
		title: localize('send.generate', "Generate"),
	},
	when: ContextKeyExpr.and(
		ChatContextKeys.inputHasText,
		CTX_INLINE_CHAT_REQUEST_IN_PROGRESS.toNegated(),
		CTX_INLINE_CHAT_EDITING.toNegated(),
		CTX_INLINE_CHAT_V1_ENABLED
	),
};

MenuRegistry.appendMenuItem(MENU_INLINE_CHAT_WIDGET_STATUS, editActionMenuItem);
MenuRegistry.appendMenuItem(MENU_INLINE_CHAT_WIDGET_STATUS, generateActionMenuItem);

const cancelActionMenuItem: IMenuItem = {
	group: '0_main',
	order: 0,
	command: {
		id: CancelAction.ID,
		title: localize('cancel', "Cancel Request"),
		shortTitle: localize('cancelShort', "Cancel"),
	},
	when: ContextKeyExpr.and(
		CTX_INLINE_CHAT_REQUEST_IN_PROGRESS,
	),
};

MenuRegistry.appendMenuItem(MENU_INLINE_CHAT_WIDGET_STATUS, cancelActionMenuItem);

// --- actions ---

registerAction2(InlineChatActions.StartSessionAction);
registerAction2(InlineChatActions.CloseAction);
registerAction2(InlineChatActions.ConfigureInlineChatAction);
registerAction2(InlineChatActions.UnstashSessionAction);
registerAction2(InlineChatActions.DiscardHunkAction);
registerAction2(InlineChatActions.RerunAction);
registerAction2(InlineChatActions.MoveToNextHunk);
registerAction2(InlineChatActions.MoveToPreviousHunk);

registerAction2(InlineChatActions.ArrowOutUpAction);
registerAction2(InlineChatActions.ArrowOutDownAction);
registerAction2(InlineChatActions.FocusInlineChat);
registerAction2(InlineChatActions.ViewInChatAction);

registerAction2(InlineChatActions.ToggleDiffForChange);
registerAction2(InlineChatActions.AcceptChanges);

const workbenchContributionsRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);
workbenchContributionsRegistry.registerWorkbenchContribution(InlineChatNotebookContribution, LifecyclePhase.Restored);

registerWorkbenchContribution2(InlineChatEnabler.Id, InlineChatEnabler, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(InlineChatEscapeToolContribution.Id, InlineChatEscapeToolContribution, WorkbenchPhase.AfterRestored);
AccessibleViewRegistry.register(new InlineChatAccessibleView());
AccessibleViewRegistry.register(new InlineChatAccessibilityHelp());
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/inlineChat/browser/inlineChatAccessibilityHelp.ts]---
Location: vscode-main/src/vs/workbench/contrib/inlineChat/browser/inlineChatAccessibilityHelp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { AccessibleViewType } from '../../../../platform/accessibility/browser/accessibleView.js';
import { IAccessibleViewImplementation } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { getChatAccessibilityHelpProvider } from '../../chat/browser/actions/chatAccessibilityHelp.js';
import { ChatContextKeys } from '../../chat/common/chatContextKeys.js';
import { CTX_INLINE_CHAT_RESPONSE_FOCUSED } from '../common/inlineChat.js';

export class InlineChatAccessibilityHelp implements IAccessibleViewImplementation {
	readonly priority = 106;
	readonly name = 'inlineChat';
	readonly type = AccessibleViewType.Help;
	readonly when = ContextKeyExpr.or(CTX_INLINE_CHAT_RESPONSE_FOCUSED, ChatContextKeys.inputHasFocus);
	getProvider(accessor: ServicesAccessor) {
		const codeEditor = accessor.get(ICodeEditorService).getActiveCodeEditor() || accessor.get(ICodeEditorService).getFocusedCodeEditor();
		if (!codeEditor) {
			return;
		}
		return getChatAccessibilityHelpProvider(accessor, codeEditor, 'inlineChat');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/inlineChat/browser/inlineChatAccessibleView.ts]---
Location: vscode-main/src/vs/workbench/contrib/inlineChat/browser/inlineChatAccessibleView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InlineChatController } from './inlineChatController.js';
import { CTX_INLINE_CHAT_FOCUSED, CTX_INLINE_CHAT_RESPONSE_FOCUSED } from '../common/inlineChat.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { AccessibleViewProviderId, AccessibleViewType, AccessibleContentProvider } from '../../../../platform/accessibility/browser/accessibleView.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IAccessibleViewImplementation } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { renderAsPlaintext } from '../../../../base/browser/markdownRenderer.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';

export class InlineChatAccessibleView implements IAccessibleViewImplementation {
	readonly priority = 100;
	readonly name = 'inlineChat';
	readonly when = ContextKeyExpr.or(CTX_INLINE_CHAT_FOCUSED, CTX_INLINE_CHAT_RESPONSE_FOCUSED);
	readonly type = AccessibleViewType.View;
	getProvider(accessor: ServicesAccessor) {
		const codeEditorService = accessor.get(ICodeEditorService);

		const editor = (codeEditorService.getActiveCodeEditor() || codeEditorService.getFocusedCodeEditor());
		if (!editor) {
			return;
		}
		const controller = InlineChatController.get(editor);
		if (!controller) {
			return;
		}
		const responseContent = controller.widget.responseContent;
		if (!responseContent) {
			return;
		}
		return new AccessibleContentProvider(
			AccessibleViewProviderId.InlineChat,
			{ type: AccessibleViewType.View },
			() => renderAsPlaintext(new MarkdownString(responseContent), { includeCodeBlocksFences: true }),
			() => controller.focus(),
			AccessibilityVerbositySettingId.InlineChat
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/inlineChat/browser/inlineChatActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/inlineChat/browser/inlineChatActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { ICodeEditor, isCodeEditor, isDiffEditor } from '../../../../editor/browser/editorBrowser.js';
import { EditorAction2 } from '../../../../editor/browser/editorExtensions.js';
import { EmbeddedDiffEditorWidget } from '../../../../editor/browser/widget/diffEditor/embeddedDiffEditorWidget.js';
import { EmbeddedCodeEditorWidget } from '../../../../editor/browser/widget/codeEditor/embeddedCodeEditorWidget.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { InlineChatController, InlineChatController1, InlineChatController2, InlineChatRunOptions } from './inlineChatController.js';
import { ACTION_ACCEPT_CHANGES, CTX_INLINE_CHAT_HAS_STASHED_SESSION, CTX_INLINE_CHAT_FOCUSED, CTX_INLINE_CHAT_INNER_CURSOR_FIRST, CTX_INLINE_CHAT_INNER_CURSOR_LAST, CTX_INLINE_CHAT_VISIBLE, CTX_INLINE_CHAT_OUTER_CURSOR_POSITION, MENU_INLINE_CHAT_WIDGET_STATUS, CTX_INLINE_CHAT_REQUEST_IN_PROGRESS, CTX_INLINE_CHAT_RESPONSE_TYPE, InlineChatResponseType, ACTION_REGENERATE_RESPONSE, ACTION_VIEW_IN_CHAT, ACTION_TOGGLE_DIFF, CTX_INLINE_CHAT_CHANGE_HAS_DIFF, CTX_INLINE_CHAT_CHANGE_SHOWS_DIFF, MENU_INLINE_CHAT_ZONE, ACTION_DISCARD_CHANGES, CTX_INLINE_CHAT_POSSIBLE, ACTION_START, MENU_INLINE_CHAT_SIDE, CTX_INLINE_CHAT_V2_ENABLED, CTX_INLINE_CHAT_V1_ENABLED } from '../common/inlineChat.js';
import { ctxHasEditorModification, ctxHasRequestInProgress } from '../../chat/browser/chatEditing/chatEditingEditorContextKeys.js';
import { localize, localize2 } from '../../../../nls.js';
import { Action2, IAction2Options, MenuId } from '../../../../platform/actions/common/actions.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { CONTEXT_ACCESSIBILITY_MODE_ENABLED } from '../../../../platform/accessibility/common/accessibility.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { IPreferencesService } from '../../../services/preferences/common/preferences.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IChatService } from '../../chat/common/chatService.js';
import { ChatContextKeys } from '../../chat/common/chatContextKeys.js';
import { HunkInformation } from './inlineChatSession.js';
import { IChatWidgetService } from '../../chat/browser/chat.js';


CommandsRegistry.registerCommandAlias('interactiveEditor.start', 'inlineChat.start');
CommandsRegistry.registerCommandAlias('interactive.acceptChanges', ACTION_ACCEPT_CHANGES);


export const START_INLINE_CHAT = registerIcon('start-inline-chat', Codicon.sparkle, localize('startInlineChat', 'Icon which spawns the inline chat from the editor toolbar.'));

// some gymnastics to enable hold for speech without moving the StartSessionAction into the electron-layer

export interface IHoldForSpeech {
	(accessor: ServicesAccessor, controller: InlineChatController, source: Action2): void;
}
let _holdForSpeech: IHoldForSpeech | undefined = undefined;
export function setHoldForSpeech(holdForSpeech: IHoldForSpeech) {
	_holdForSpeech = holdForSpeech;
}

const inlineChatContextKey = ContextKeyExpr.and(
	ContextKeyExpr.or(CTX_INLINE_CHAT_V1_ENABLED, CTX_INLINE_CHAT_V2_ENABLED),
	CTX_INLINE_CHAT_POSSIBLE,
	EditorContextKeys.writable,
	EditorContextKeys.editorSimpleInput.negate()
);

export class StartSessionAction extends Action2 {

	constructor() {
		super({
			id: ACTION_START,
			title: localize2('run', 'Open Inline Chat'),
			category: AbstractInline1ChatAction.category,
			f1: true,
			precondition: inlineChatContextKey,
			keybinding: {
				when: EditorContextKeys.focus,
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.KeyI
			},
			icon: START_INLINE_CHAT,
			menu: [{
				id: MenuId.EditorContext,
				group: '1_chat',
				order: 3,
				when: inlineChatContextKey
			}, {
				id: MenuId.ChatTitleBarMenu,
				group: 'a_open',
				order: 3,
			}]
		});
	}
	override run(accessor: ServicesAccessor, ...args: unknown[]): any {

		const codeEditorService = accessor.get(ICodeEditorService);
		const editor = codeEditorService.getActiveCodeEditor();
		if (!editor || editor.isSimpleWidget) {
			// well, at least we tried...
			return;
		}


		// precondition does hold
		return editor.invokeWithinContext((editorAccessor) => {
			const kbService = editorAccessor.get(IContextKeyService);
			const logService = editorAccessor.get(ILogService);
			const enabled = kbService.contextMatchesRules(this.desc.precondition ?? undefined);
			if (!enabled) {
				logService.debug(`[EditorAction2] NOT running command because its precondition is FALSE`, this.desc.id, this.desc.precondition?.serialize());
				return;
			}
			return this._runEditorCommand(editorAccessor, editor, ...args);
		});
	}

	private async _runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, ...args: unknown[]) {

		const ctrl = InlineChatController.get(editor);
		if (!ctrl) {
			return;
		}

		if (_holdForSpeech) {
			accessor.get(IInstantiationService).invokeFunction(_holdForSpeech, ctrl, this);
		}

		let options: InlineChatRunOptions | undefined;
		const arg = args[0];
		if (arg && InlineChatRunOptions.isInlineChatRunOptions(arg)) {
			options = arg;
		}
		const task = InlineChatController.get(editor)?.run({ ...options });
		if (options?.blockOnResponse) {
			await task;
		}
	}
}

export class FocusInlineChat extends EditorAction2 {

	constructor() {
		super({
			id: 'inlineChat.focus',
			title: localize2('focus', "Focus Input"),
			f1: true,
			category: AbstractInline1ChatAction.category,
			precondition: ContextKeyExpr.and(EditorContextKeys.editorTextFocus, CTX_INLINE_CHAT_VISIBLE, CTX_INLINE_CHAT_FOCUSED.negate(), CONTEXT_ACCESSIBILITY_MODE_ENABLED.negate()),
			keybinding: [{
				weight: KeybindingWeight.EditorCore + 10, // win against core_command
				when: ContextKeyExpr.and(CTX_INLINE_CHAT_OUTER_CURSOR_POSITION.isEqualTo('above'), EditorContextKeys.isEmbeddedDiffEditor.negate()),
				primary: KeyMod.CtrlCmd | KeyCode.DownArrow,
			}, {
				weight: KeybindingWeight.EditorCore + 10, // win against core_command
				when: ContextKeyExpr.and(CTX_INLINE_CHAT_OUTER_CURSOR_POSITION.isEqualTo('below'), EditorContextKeys.isEmbeddedDiffEditor.negate()),
				primary: KeyMod.CtrlCmd | KeyCode.UpArrow,
			}]
		});
	}

	override runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor, ..._args: unknown[]) {
		InlineChatController.get(editor)?.focus();
	}
}

//#region --- VERSION 1

export class UnstashSessionAction extends EditorAction2 {
	constructor() {
		super({
			id: 'inlineChat.unstash',
			title: localize2('unstash', "Resume Last Dismissed Inline Chat"),
			category: AbstractInline1ChatAction.category,
			precondition: ContextKeyExpr.and(CTX_INLINE_CHAT_HAS_STASHED_SESSION, EditorContextKeys.writable),
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.KeyZ,
			}
		});
	}

	override async runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor, ..._args: unknown[]) {
		const ctrl = InlineChatController1.get(editor);
		if (ctrl) {
			const session = ctrl.unstashLastSession();
			if (session) {
				ctrl.run({
					existingSession: session,
				});
			}
		}
	}
}

export abstract class AbstractInline1ChatAction extends EditorAction2 {

	static readonly category = localize2('cat', "Inline Chat");

	constructor(desc: IAction2Options) {

		const massageMenu = (menu: IAction2Options['menu'] | undefined) => {
			if (Array.isArray(menu)) {
				for (const entry of menu) {
					entry.when = ContextKeyExpr.and(CTX_INLINE_CHAT_V1_ENABLED, entry.when);
				}
			} else if (menu) {
				menu.when = ContextKeyExpr.and(CTX_INLINE_CHAT_V1_ENABLED, menu.when);
			}
		};
		if (Array.isArray(desc.menu)) {
			massageMenu(desc.menu);
		} else {
			massageMenu(desc.menu);
		}

		super({
			...desc,
			category: AbstractInline1ChatAction.category,
			precondition: ContextKeyExpr.and(CTX_INLINE_CHAT_V1_ENABLED, desc.precondition)
		});
	}

	override runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, ..._args: unknown[]) {
		const editorService = accessor.get(IEditorService);
		const logService = accessor.get(ILogService);

		let ctrl = InlineChatController1.get(editor);
		if (!ctrl) {
			const { activeTextEditorControl } = editorService;
			if (isCodeEditor(activeTextEditorControl)) {
				editor = activeTextEditorControl;
			} else if (isDiffEditor(activeTextEditorControl)) {
				editor = activeTextEditorControl.getModifiedEditor();
			}
			ctrl = InlineChatController1.get(editor);
		}

		if (!ctrl) {
			logService.warn('[IE] NO controller found for action', this.desc.id, editor.getModel()?.uri);
			return;
		}

		if (editor instanceof EmbeddedCodeEditorWidget) {
			editor = editor.getParentEditor();
		}
		if (!ctrl) {
			for (const diffEditor of accessor.get(ICodeEditorService).listDiffEditors()) {
				if (diffEditor.getOriginalEditor() === editor || diffEditor.getModifiedEditor() === editor) {
					if (diffEditor instanceof EmbeddedDiffEditorWidget) {
						this.runEditorCommand(accessor, diffEditor.getParentEditor(), ..._args);
					}
				}
			}
			return;
		}
		this.runInlineChatCommand(accessor, ctrl, editor, ..._args);
	}

	abstract runInlineChatCommand(accessor: ServicesAccessor, ctrl: InlineChatController1, editor: ICodeEditor, ...args: unknown[]): void;
}

export class ArrowOutUpAction extends AbstractInline1ChatAction {
	constructor() {
		super({
			id: 'inlineChat.arrowOutUp',
			title: localize('arrowUp', 'Cursor Up'),
			precondition: ContextKeyExpr.and(CTX_INLINE_CHAT_FOCUSED, CTX_INLINE_CHAT_INNER_CURSOR_FIRST, EditorContextKeys.isEmbeddedDiffEditor.negate(), CONTEXT_ACCESSIBILITY_MODE_ENABLED.negate()),
			keybinding: {
				weight: KeybindingWeight.EditorCore,
				primary: KeyMod.CtrlCmd | KeyCode.UpArrow
			}
		});
	}

	runInlineChatCommand(_accessor: ServicesAccessor, ctrl: InlineChatController1, _editor: ICodeEditor, ..._args: unknown[]): void {
		ctrl.arrowOut(true);
	}
}

export class ArrowOutDownAction extends AbstractInline1ChatAction {
	constructor() {
		super({
			id: 'inlineChat.arrowOutDown',
			title: localize('arrowDown', 'Cursor Down'),
			precondition: ContextKeyExpr.and(CTX_INLINE_CHAT_FOCUSED, CTX_INLINE_CHAT_INNER_CURSOR_LAST, EditorContextKeys.isEmbeddedDiffEditor.negate(), CONTEXT_ACCESSIBILITY_MODE_ENABLED.negate()),
			keybinding: {
				weight: KeybindingWeight.EditorCore,
				primary: KeyMod.CtrlCmd | KeyCode.DownArrow
			}
		});
	}

	runInlineChatCommand(_accessor: ServicesAccessor, ctrl: InlineChatController1, _editor: ICodeEditor, ..._args: unknown[]): void {
		ctrl.arrowOut(false);
	}
}

export class AcceptChanges extends AbstractInline1ChatAction {

	constructor() {
		super({
			id: ACTION_ACCEPT_CHANGES,
			title: localize2('apply1', "Accept Changes"),
			shortTitle: localize('apply2', 'Accept'),
			icon: Codicon.check,
			f1: true,
			precondition: ContextKeyExpr.and(CTX_INLINE_CHAT_VISIBLE),
			keybinding: [{
				weight: KeybindingWeight.WorkbenchContrib + 10,
				primary: KeyMod.CtrlCmd | KeyCode.Enter,
			}],
			menu: [{
				id: MENU_INLINE_CHAT_WIDGET_STATUS,
				group: '0_main',
				order: 1,
				when: ContextKeyExpr.and(
					ChatContextKeys.inputHasText.toNegated(),
					CTX_INLINE_CHAT_REQUEST_IN_PROGRESS.toNegated(),
					CTX_INLINE_CHAT_RESPONSE_TYPE.isEqualTo(InlineChatResponseType.MessagesAndEdits)
				),
			}, {
				id: MENU_INLINE_CHAT_ZONE,
				group: 'navigation',
				order: 1,
			}]
		});
	}

	override async runInlineChatCommand(_accessor: ServicesAccessor, ctrl: InlineChatController1, _editor: ICodeEditor, hunk?: HunkInformation | any): Promise<void> {
		ctrl.acceptHunk(hunk);
	}
}

export class DiscardHunkAction extends AbstractInline1ChatAction {

	constructor() {
		super({
			id: ACTION_DISCARD_CHANGES,
			title: localize('discard', 'Discard'),
			icon: Codicon.chromeClose,
			precondition: CTX_INLINE_CHAT_VISIBLE,
			menu: [{
				id: MENU_INLINE_CHAT_ZONE,
				group: 'navigation',
				order: 2
			}],
			keybinding: {
				weight: KeybindingWeight.EditorContrib,
				primary: KeyCode.Escape,
				when: CTX_INLINE_CHAT_RESPONSE_TYPE.isEqualTo(InlineChatResponseType.MessagesAndEdits)
			}
		});
	}

	async runInlineChatCommand(_accessor: ServicesAccessor, ctrl: InlineChatController1, _editor: ICodeEditor, hunk?: HunkInformation | any): Promise<void> {
		return ctrl.discardHunk(hunk);
	}
}

export class RerunAction extends AbstractInline1ChatAction {
	constructor() {
		super({
			id: ACTION_REGENERATE_RESPONSE,
			title: localize2('chat.rerun.label', "Rerun Request"),
			shortTitle: localize('rerun', 'Rerun'),
			f1: false,
			icon: Codicon.refresh,
			precondition: CTX_INLINE_CHAT_VISIBLE,
			menu: {
				id: MENU_INLINE_CHAT_WIDGET_STATUS,
				group: '0_main',
				order: 5,
				when: ContextKeyExpr.and(
					ChatContextKeys.inputHasText.toNegated(),
					CTX_INLINE_CHAT_REQUEST_IN_PROGRESS.negate(),
					CTX_INLINE_CHAT_RESPONSE_TYPE.notEqualsTo(InlineChatResponseType.None)
				)
			},
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.KeyR
			}
		});
	}

	override async runInlineChatCommand(accessor: ServicesAccessor, ctrl: InlineChatController1, _editor: ICodeEditor, ..._args: unknown[]): Promise<void> {
		const chatService = accessor.get(IChatService);
		const chatWidgetService = accessor.get(IChatWidgetService);
		const model = ctrl.chatWidget.viewModel?.model;
		if (!model) {
			return;
		}

		const lastRequest = model.getRequests().at(-1);
		if (lastRequest) {
			const widget = chatWidgetService.getWidgetBySessionResource(model.sessionResource);
			await chatService.resendRequest(lastRequest, {
				noCommandDetection: false,
				attempt: lastRequest.attempt + 1,
				location: ctrl.chatWidget.location,
				userSelectedModelId: widget?.input.currentLanguageModel
			});
		}
	}
}

export class CloseAction extends AbstractInline1ChatAction {

	constructor() {
		super({
			id: 'inlineChat.close',
			title: localize('close', 'Close'),
			icon: Codicon.close,
			precondition: CTX_INLINE_CHAT_VISIBLE,
			keybinding: {
				weight: KeybindingWeight.EditorContrib + 1,
				primary: KeyCode.Escape,
			},
			menu: [{
				id: MENU_INLINE_CHAT_WIDGET_STATUS,
				group: '0_main',
				order: 1,
				when: CTX_INLINE_CHAT_REQUEST_IN_PROGRESS.negate()
			}, {
				id: MENU_INLINE_CHAT_SIDE,
				group: 'navigation',
				when: CTX_INLINE_CHAT_RESPONSE_TYPE.isEqualTo(InlineChatResponseType.None)
			}]
		});
	}

	async runInlineChatCommand(_accessor: ServicesAccessor, ctrl: InlineChatController1, _editor: ICodeEditor, ..._args: unknown[]): Promise<void> {
		ctrl.cancelSession();
	}
}

export class ConfigureInlineChatAction extends AbstractInline1ChatAction {
	constructor() {
		super({
			id: 'inlineChat.configure',
			title: localize2('configure', 'Configure Inline Chat'),
			icon: Codicon.settingsGear,
			precondition: CTX_INLINE_CHAT_VISIBLE,
			f1: true,
			menu: {
				id: MENU_INLINE_CHAT_WIDGET_STATUS,
				group: 'zzz',
				order: 5
			}
		});
	}

	async runInlineChatCommand(accessor: ServicesAccessor, ctrl: InlineChatController1, _editor: ICodeEditor, ..._args: unknown[]): Promise<void> {
		accessor.get(IPreferencesService).openSettings({ query: 'inlineChat' });
	}
}

export class MoveToNextHunk extends AbstractInline1ChatAction {

	constructor() {
		super({
			id: 'inlineChat.moveToNextHunk',
			title: localize2('moveToNextHunk', 'Move to Next Change'),
			precondition: CTX_INLINE_CHAT_VISIBLE,
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyCode.F7
			}
		});
	}

	override runInlineChatCommand(accessor: ServicesAccessor, ctrl: InlineChatController1, editor: ICodeEditor, ...args: unknown[]): void {
		ctrl.moveHunk(true);
	}
}

export class MoveToPreviousHunk extends AbstractInline1ChatAction {

	constructor() {
		super({
			id: 'inlineChat.moveToPreviousHunk',
			title: localize2('moveToPreviousHunk', 'Move to Previous Change'),
			f1: true,
			precondition: CTX_INLINE_CHAT_VISIBLE,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.Shift | KeyCode.F7
			}
		});
	}

	override runInlineChatCommand(accessor: ServicesAccessor, ctrl: InlineChatController1, editor: ICodeEditor, ...args: unknown[]): void {
		ctrl.moveHunk(false);
	}
}

export class ViewInChatAction extends AbstractInline1ChatAction {
	constructor() {
		super({
			id: ACTION_VIEW_IN_CHAT,
			title: localize('viewInChat', 'View in Chat'),
			icon: Codicon.chatSparkle,
			precondition: CTX_INLINE_CHAT_VISIBLE,
			menu: [{
				id: MENU_INLINE_CHAT_WIDGET_STATUS,
				group: 'more',
				order: 1,
				when: CTX_INLINE_CHAT_RESPONSE_TYPE.notEqualsTo(InlineChatResponseType.Messages)
			}, {
				id: MENU_INLINE_CHAT_WIDGET_STATUS,
				group: '0_main',
				order: 1,
				when: ContextKeyExpr.and(
					ChatContextKeys.inputHasText.toNegated(),
					CTX_INLINE_CHAT_RESPONSE_TYPE.isEqualTo(InlineChatResponseType.Messages),
					CTX_INLINE_CHAT_REQUEST_IN_PROGRESS.negate()
				)
			}],
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.DownArrow,
				when: ChatContextKeys.inChatInput
			}
		});
	}
	override runInlineChatCommand(_accessor: ServicesAccessor, ctrl: InlineChatController1, _editor: ICodeEditor, ..._args: unknown[]) {
		return ctrl.viewInChat();
	}
}

export class ToggleDiffForChange extends AbstractInline1ChatAction {

	constructor() {
		super({
			id: ACTION_TOGGLE_DIFF,
			precondition: ContextKeyExpr.and(CTX_INLINE_CHAT_VISIBLE, CTX_INLINE_CHAT_CHANGE_HAS_DIFF),
			title: localize2('showChanges', 'Toggle Changes'),
			icon: Codicon.diffSingle,
			toggled: {
				condition: CTX_INLINE_CHAT_CHANGE_SHOWS_DIFF,
			},
			menu: [{
				id: MENU_INLINE_CHAT_WIDGET_STATUS,
				group: 'zzz',
				order: 1,
			}, {
				id: MENU_INLINE_CHAT_ZONE,
				group: 'navigation',
				when: CTX_INLINE_CHAT_CHANGE_HAS_DIFF,
				order: 2
			}]
		});
	}

	override runInlineChatCommand(_accessor: ServicesAccessor, ctrl: InlineChatController1, _editor: ICodeEditor, hunkInfo: HunkInformation | any): void {
		ctrl.toggleDiff(hunkInfo);
	}
}

//#endregion


//#region --- VERSION 2
abstract class AbstractInline2ChatAction extends EditorAction2 {

	static readonly category = localize2('cat', "Inline Chat");

	constructor(desc: IAction2Options) {
		const massageMenu = (menu: IAction2Options['menu'] | undefined) => {
			if (Array.isArray(menu)) {
				for (const entry of menu) {
					entry.when = ContextKeyExpr.and(CTX_INLINE_CHAT_V2_ENABLED, entry.when);
				}
			} else if (menu) {
				menu.when = ContextKeyExpr.and(CTX_INLINE_CHAT_V2_ENABLED, menu.when);
			}
		};
		if (Array.isArray(desc.menu)) {
			massageMenu(desc.menu);
		} else {
			massageMenu(desc.menu);
		}

		super({
			...desc,
			category: AbstractInline2ChatAction.category,
			precondition: ContextKeyExpr.and(CTX_INLINE_CHAT_V2_ENABLED, desc.precondition)
		});
	}

	override runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, ..._args: unknown[]) {
		const editorService = accessor.get(IEditorService);
		const logService = accessor.get(ILogService);

		let ctrl = InlineChatController2.get(editor);
		if (!ctrl) {
			const { activeTextEditorControl } = editorService;
			if (isCodeEditor(activeTextEditorControl)) {
				editor = activeTextEditorControl;
			} else if (isDiffEditor(activeTextEditorControl)) {
				editor = activeTextEditorControl.getModifiedEditor();
			}
			ctrl = InlineChatController2.get(editor);
		}

		if (!ctrl) {
			logService.warn('[IE] NO controller found for action', this.desc.id, editor.getModel()?.uri);
			return;
		}

		if (editor instanceof EmbeddedCodeEditorWidget) {
			editor = editor.getParentEditor();
		}
		if (!ctrl) {
			for (const diffEditor of accessor.get(ICodeEditorService).listDiffEditors()) {
				if (diffEditor.getOriginalEditor() === editor || diffEditor.getModifiedEditor() === editor) {
					if (diffEditor instanceof EmbeddedDiffEditorWidget) {
						this.runEditorCommand(accessor, diffEditor.getParentEditor(), ..._args);
					}
				}
			}
			return;
		}
		this.runInlineChatCommand(accessor, ctrl, editor, ..._args);
	}

	abstract runInlineChatCommand(accessor: ServicesAccessor, ctrl: InlineChatController2, editor: ICodeEditor, ...args: unknown[]): void;
}

class KeepOrUndoSessionAction extends AbstractInline2ChatAction {

	constructor(private readonly _keep: boolean, desc: IAction2Options) {
		super(desc);
	}

	override async runInlineChatCommand(_accessor: ServicesAccessor, ctrl: InlineChatController2, editor: ICodeEditor, ..._args: unknown[]): Promise<void> {
		if (this._keep) {
			await ctrl.acceptSession();
		} else {
			await ctrl.rejectSession();
		}
		if (editor.hasModel()) {
			editor.setSelection(editor.getSelection().collapseToStart());
		}
	}
}

export class KeepSessionAction2 extends KeepOrUndoSessionAction {
	constructor() {
		super(true, {
			id: 'inlineChat2.keep',
			title: localize2('Keep', "Keep"),
			f1: true,
			icon: Codicon.check,
			precondition: ContextKeyExpr.and(
				CTX_INLINE_CHAT_VISIBLE,
				ctxHasRequestInProgress.negate(),
				ctxHasEditorModification,
			),
			keybinding: [{
				when: ContextKeyExpr.and(ChatContextKeys.inputHasFocus, ChatContextKeys.inputHasText.negate()),
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyCode.Enter
			}, {
				weight: KeybindingWeight.WorkbenchContrib + 10,
				primary: KeyMod.CtrlCmd | KeyCode.Enter
			}],
			menu: [{
				id: MenuId.ChatEditorInlineExecute,
				group: 'navigation',
				order: 4,
				when: ContextKeyExpr.and(
					ctxHasRequestInProgress.negate(),
					ctxHasEditorModification,
					ChatContextKeys.inputHasText.toNegated()
				),
			}]
		});
	}
}


export class UndoAndCloseSessionAction2 extends KeepOrUndoSessionAction {

	constructor() {
		super(false, {
			id: 'inlineChat2.close',
			title: localize2('close2', "Close"),
			f1: true,
			icon: Codicon.close,
			precondition: CTX_INLINE_CHAT_VISIBLE,
			keybinding: [{
				when: ContextKeyExpr.or(
					ContextKeyExpr.and(EditorContextKeys.focus, ctxHasEditorModification.negate()),
					ChatContextKeys.inputHasFocus,
				),
				weight: KeybindingWeight.WorkbenchContrib + 1,
				primary: KeyCode.Escape,
			}],
			menu: [{
				id: MenuId.ChatEditorInlineExecute,
				group: 'navigation',
				order: 100
			}]
		});
	}
}
```

--------------------------------------------------------------------------------

````

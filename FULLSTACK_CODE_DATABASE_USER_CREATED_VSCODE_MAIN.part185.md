---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 185
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 185 of 552)

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

---[FILE: src/vs/base/test/browser/ui/tree/asyncDataTree.test.ts]---
Location: vscode-main/src/vs/base/test/browser/ui/tree/asyncDataTree.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable no-restricted-syntax */

import assert from 'assert';
import { IIdentityProvider, IListVirtualDelegate } from '../../../../browser/ui/list/list.js';
import { AsyncDataTree, CompressibleAsyncDataTree, ITreeCompressionDelegate } from '../../../../browser/ui/tree/asyncDataTree.js';
import { ICompressedTreeNode } from '../../../../browser/ui/tree/compressedObjectTreeModel.js';
import { ICompressibleTreeRenderer } from '../../../../browser/ui/tree/objectTree.js';
import { IAsyncDataSource, ITreeNode } from '../../../../browser/ui/tree/tree.js';
import { timeout } from '../../../../common/async.js';
import { Iterable } from '../../../../common/iterator.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../common/utils.js';
import { runWithFakedTimers } from '../../../common/timeTravelScheduler.js';

interface Element {
	id: string;
	suffix?: string;
	children?: Element[];
}

function find(element: Element, id: string): Element | undefined {
	if (element.id === id) {
		return element;
	}

	if (!element.children) {
		return undefined;
	}

	for (const child of element.children) {
		const result = find(child, id);

		if (result) {
			return result;
		}
	}

	return undefined;
}

class Renderer implements ICompressibleTreeRenderer<Element, void, HTMLElement> {
	readonly templateId = 'default';
	renderTemplate(container: HTMLElement): HTMLElement {
		return container;
	}
	renderElement(element: ITreeNode<Element, void>, index: number, templateData: HTMLElement): void {
		templateData.textContent = element.element.id + (element.element.suffix || '');
	}
	disposeTemplate(templateData: HTMLElement): void {
		// noop
	}
	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<Element>, void>, index: number, templateData: HTMLElement): void {
		const result: string[] = [];

		for (const element of node.element.elements) {
			result.push(element.id + (element.suffix || ''));
		}

		templateData.textContent = result.join('/');
	}
}

class IdentityProvider implements IIdentityProvider<Element> {
	getId(element: Element) {
		return element.id;
	}
}

class VirtualDelegate implements IListVirtualDelegate<Element> {
	getHeight() { return 20; }
	getTemplateId(element: Element): string { return 'default'; }
}

class DataSource implements IAsyncDataSource<Element, Element> {
	hasChildren(element: Element): boolean {
		return !!element.children && element.children.length > 0;
	}
	getChildren(element: Element): Promise<Element[]> {
		return Promise.resolve(element.children || []);
	}
}

class Model {

	constructor(readonly root: Element) { }

	get(id: string): Element {
		const result = find(this.root, id);

		if (!result) {
			throw new Error('element not found');
		}

		return result;
	}
}

suite('AsyncDataTree', function () {

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	test('Collapse state should be preserved across refresh calls', async () => {
		const container = document.createElement('div');

		const model = new Model({
			id: 'root',
			children: [{
				id: 'a'
			}]
		});

		const tree = store.add(new AsyncDataTree<Element, Element>('test', container, new VirtualDelegate(), [new Renderer()], new DataSource(), { identityProvider: new IdentityProvider() }));
		tree.layout(200);
		assert.strictEqual(container.querySelectorAll('.monaco-list-row').length, 0);

		await tree.setInput(model.root);
		assert.strictEqual(container.querySelectorAll('.monaco-list-row').length, 1);
		const twistie = container.querySelector('.monaco-list-row:first-child .monaco-tl-twistie') as HTMLElement;
		assert(!twistie.classList.contains('collapsible'));
		assert(!twistie.classList.contains('collapsed'));

		model.get('a').children = [
			{ id: 'aa' },
			{ id: 'ab' },
			{ id: 'ac' }
		];

		await tree.updateChildren(model.root);
		assert.strictEqual(container.querySelectorAll('.monaco-list-row').length, 1);

		await tree.expand(model.get('a'));
		assert.strictEqual(container.querySelectorAll('.monaco-list-row').length, 4);

		model.get('a').children = [];
		await tree.updateChildren(model.root);
		assert.strictEqual(container.querySelectorAll('.monaco-list-row').length, 1);
	});

	test('issue #68648', async () => {
		const container = document.createElement('div');

		const getChildrenCalls: string[] = [];
		const dataSource = new class implements IAsyncDataSource<Element, Element> {
			hasChildren(element: Element): boolean {
				return !!element.children && element.children.length > 0;
			}
			getChildren(element: Element): Promise<Element[]> {
				getChildrenCalls.push(element.id);
				return Promise.resolve(element.children || []);
			}
		};

		const model = new Model({
			id: 'root',
			children: [{
				id: 'a'
			}]
		});

		const tree = store.add(new AsyncDataTree<Element, Element>('test', container, new VirtualDelegate(), [new Renderer()], dataSource, { identityProvider: new IdentityProvider() }));
		tree.layout(200);

		await tree.setInput(model.root);
		assert.deepStrictEqual(getChildrenCalls, ['root']);

		let twistie = container.querySelector('.monaco-list-row:first-child .monaco-tl-twistie') as HTMLElement;
		assert(!twistie.classList.contains('collapsible'));
		assert(!twistie.classList.contains('collapsed'));
		assert(tree.getNode().children[0].collapsed);

		model.get('a').children = [{ id: 'aa' }, { id: 'ab' }, { id: 'ac' }];
		await tree.updateChildren(model.root);

		assert.deepStrictEqual(getChildrenCalls, ['root', 'root']);
		twistie = container.querySelector('.monaco-list-row:first-child .monaco-tl-twistie') as HTMLElement;
		assert(twistie.classList.contains('collapsible'));
		assert(twistie.classList.contains('collapsed'));
		assert(tree.getNode().children[0].collapsed);

		model.get('a').children = [];
		await tree.updateChildren(model.root);

		assert.deepStrictEqual(getChildrenCalls, ['root', 'root', 'root']);
		twistie = container.querySelector('.monaco-list-row:first-child .monaco-tl-twistie') as HTMLElement;
		assert(!twistie.classList.contains('collapsible'));
		assert(!twistie.classList.contains('collapsed'));
		assert(tree.getNode().children[0].collapsed);

		model.get('a').children = [{ id: 'aa' }, { id: 'ab' }, { id: 'ac' }];
		await tree.updateChildren(model.root);

		assert.deepStrictEqual(getChildrenCalls, ['root', 'root', 'root', 'root']);
		twistie = container.querySelector('.monaco-list-row:first-child .monaco-tl-twistie') as HTMLElement;
		assert(twistie.classList.contains('collapsible'));
		assert(twistie.classList.contains('collapsed'));
		assert(tree.getNode().children[0].collapsed);
	});

	test('issue #67722 - once resolved, refreshed collapsed nodes should only get children when expanded', async () => {
		const container = document.createElement('div');

		const getChildrenCalls: string[] = [];
		const dataSource = new class implements IAsyncDataSource<Element, Element> {
			hasChildren(element: Element): boolean {
				return !!element.children && element.children.length > 0;
			}
			getChildren(element: Element): Promise<Element[]> {
				getChildrenCalls.push(element.id);
				return Promise.resolve(element.children || []);
			}
		};

		const model = new Model({
			id: 'root',
			children: [{
				id: 'a', children: [{ id: 'aa' }, { id: 'ab' }, { id: 'ac' }]
			}]
		});

		const tree = store.add(new AsyncDataTree<Element, Element>('test', container, new VirtualDelegate(), [new Renderer()], dataSource, { identityProvider: new IdentityProvider() }));
		tree.layout(200);

		await tree.setInput(model.root);
		assert(tree.getNode(model.get('a')).collapsed);
		assert.deepStrictEqual(getChildrenCalls, ['root']);

		await tree.expand(model.get('a'));
		assert(!tree.getNode(model.get('a')).collapsed);
		assert.deepStrictEqual(getChildrenCalls, ['root', 'a']);

		tree.collapse(model.get('a'));
		assert(tree.getNode(model.get('a')).collapsed);
		assert.deepStrictEqual(getChildrenCalls, ['root', 'a']);

		await tree.updateChildren();
		assert(tree.getNode(model.get('a')).collapsed);
		assert.deepStrictEqual(getChildrenCalls, ['root', 'a', 'root'], 'a should not be refreshed, since it\' collapsed');
	});

	test('resolved collapsed nodes which lose children should lose twistie as well', async () => {
		const container = document.createElement('div');

		const model = new Model({
			id: 'root',
			children: [{
				id: 'a', children: [{ id: 'aa' }, { id: 'ab' }, { id: 'ac' }]
			}]
		});

		const tree = store.add(new AsyncDataTree<Element, Element>('test', container, new VirtualDelegate(), [new Renderer()], new DataSource(), { identityProvider: new IdentityProvider() }));
		tree.layout(200);

		await tree.setInput(model.root);
		await tree.expand(model.get('a'));

		let twistie = container.querySelector('.monaco-list-row:first-child .monaco-tl-twistie') as HTMLElement;
		assert(twistie.classList.contains('collapsible'));
		assert(!twistie.classList.contains('collapsed'));
		assert(!tree.getNode(model.get('a')).collapsed);

		tree.collapse(model.get('a'));
		model.get('a').children = [];
		await tree.updateChildren(model.root);

		twistie = container.querySelector('.monaco-list-row:first-child .monaco-tl-twistie') as HTMLElement;
		assert(!twistie.classList.contains('collapsible'));
		assert(!twistie.classList.contains('collapsed'));
		assert(tree.getNode(model.get('a')).collapsed);
	});

	test('issue #192422 - resolved collapsed nodes with changed children don\'t show old children', async () => {
		const container = document.createElement('div');
		let hasGottenAChildren = false;
		const dataSource = new class implements IAsyncDataSource<Element, Element> {
			hasChildren(element: Element): boolean {
				return !!element.children && element.children.length > 0;
			}
			async getChildren(element: Element): Promise<Element[]> {
				if (element.id === 'a') {
					if (!hasGottenAChildren) {
						hasGottenAChildren = true;
					} else {
						return [{ id: 'c' }];
					}
				}
				return element.children || [];
			}
		};

		const model = new Model({
			id: 'root',
			children: [{
				id: 'a', children: [{ id: 'b' }]
			}]
		});

		const tree = store.add(new AsyncDataTree<Element, Element>('test', container, new VirtualDelegate(), [new Renderer()], dataSource, { identityProvider: new IdentityProvider() }));
		tree.layout(200);

		await tree.setInput(model.root);
		const a = model.get('a');
		const aNode = tree.getNode(a);
		assert(aNode.collapsed);
		await tree.expand(a);
		assert(!aNode.collapsed);
		assert.equal(aNode.children.length, 1);
		assert.equal(aNode.children[0].element.id, 'b');
		const bChild = container.querySelector('.monaco-list-row:nth-child(2)');
		assert.equal(bChild?.textContent, 'b');
		tree.collapse(a);
		assert(aNode.collapsed);

		await tree.updateChildren(a);
		const aUpdated1 = model.get('a');
		const aNodeUpdated1 = tree.getNode(a);
		assert(aNodeUpdated1.collapsed);
		assert.equal(aNodeUpdated1.children.length, 0);
		let didCheckNoChildren = false;
		const event = tree.onDidChangeCollapseState(e => {
			const child = container.querySelector('.monaco-list-row:nth-child(2)');
			assert.equal(child, null);
			didCheckNoChildren = true;
		});
		await tree.expand(aUpdated1);
		event.dispose();
		assert(didCheckNoChildren);

		const aNodeUpdated2 = tree.getNode(a);
		assert(!aNodeUpdated2.collapsed);
		assert.equal(aNodeUpdated2.children.length, 1);
		assert.equal(aNodeUpdated2.children[0].element.id, 'c');
		const child = container.querySelector('.monaco-list-row:nth-child(2)');
		assert.equal(child?.textContent, 'c');
	});

	test('issue #192422 - resolved collapsed nodes with unchanged children immediately show children', async () => {
		const container = document.createElement('div');
		const dataSource = new class implements IAsyncDataSource<Element, Element> {
			hasChildren(element: Element): boolean {
				return !!element.children && element.children.length > 0;
			}
			async getChildren(element: Element): Promise<Element[]> {
				return element.children || [];
			}
		};

		const model = new Model({
			id: 'root',
			children: [{
				id: 'a', children: [{ id: 'b' }]
			}]
		});

		const tree = store.add(new AsyncDataTree<Element, Element>('test', container, new VirtualDelegate(), [new Renderer()], dataSource, { identityProvider: new IdentityProvider() }));
		tree.layout(200);

		await tree.setInput(model.root);
		const a = model.get('a');
		const aNode = tree.getNode(a);
		assert(aNode.collapsed);
		await tree.expand(a);
		assert(!aNode.collapsed);
		assert.equal(aNode.children.length, 1);
		assert.equal(aNode.children[0].element.id, 'b');
		const bChild = container.querySelector('.monaco-list-row:nth-child(2)');
		assert.equal(bChild?.textContent, 'b');
		tree.collapse(a);
		assert(aNode.collapsed);

		const aUpdated1 = model.get('a');
		const aNodeUpdated1 = tree.getNode(a);
		assert(aNodeUpdated1.collapsed);
		assert.equal(aNodeUpdated1.children.length, 1);
		let didCheckSameChildren = false;
		const event = tree.onDidChangeCollapseState(e => {
			const child = container.querySelector('.monaco-list-row:nth-child(2)');
			assert.equal(child?.textContent, 'b');
			didCheckSameChildren = true;
		});
		await tree.expand(aUpdated1);
		event.dispose();
		assert(didCheckSameChildren);

		const aNodeUpdated2 = tree.getNode(a);
		assert(!aNodeUpdated2.collapsed);
		assert.equal(aNodeUpdated2.children.length, 1);
		assert.equal(aNodeUpdated2.children[0].element.id, 'b');
		const child = container.querySelector('.monaco-list-row:nth-child(2)');
		assert.equal(child?.textContent, 'b');
	});

	test('support default collapse state per element', async () => {
		const container = document.createElement('div');

		const getChildrenCalls: string[] = [];
		const dataSource = new class implements IAsyncDataSource<Element, Element> {
			hasChildren(element: Element): boolean {
				return !!element.children && element.children.length > 0;
			}
			getChildren(element: Element): Promise<Element[]> {
				getChildrenCalls.push(element.id);
				return Promise.resolve(element.children || []);
			}
		};

		const model = new Model({
			id: 'root',
			children: [{
				id: 'a', children: [{ id: 'aa' }, { id: 'ab' }, { id: 'ac' }]
			}]
		});

		const tree = store.add(new AsyncDataTree<Element, Element>('test', container, new VirtualDelegate(), [new Renderer()], dataSource, {
			collapseByDefault: el => el.id !== 'a'
		}));
		tree.layout(200);

		await tree.setInput(model.root);
		assert(!tree.getNode(model.get('a')).collapsed);
		assert.deepStrictEqual(getChildrenCalls, ['root', 'a']);
	});

	test('issue #80098 - concurrent refresh and expand', async () => {
		const container = document.createElement('div');

		const calls: Function[] = [];
		const dataSource = new class implements IAsyncDataSource<Element, Element> {
			hasChildren(element: Element): boolean {
				return !!element.children && element.children.length > 0;
			}
			getChildren(element: Element): Promise<Element[]> {
				return new Promise(c => calls.push(() => c(element.children || [])));
			}
		};

		const model = new Model({
			id: 'root',
			children: [{
				id: 'a', children: [{
					id: 'aa'
				}]
			}]
		});

		const tree = store.add(new AsyncDataTree<Element, Element>('test', container, new VirtualDelegate(), [new Renderer()], dataSource, { identityProvider: new IdentityProvider() }));
		tree.layout(200);

		const pSetInput = tree.setInput(model.root);
		calls.pop()!(); // resolve getChildren(root)
		await pSetInput;

		const pUpdateChildrenA = tree.updateChildren(model.get('a'));
		const pExpandA = tree.expand(model.get('a'));
		assert.strictEqual(calls.length, 1, 'expand(a) still hasn\'t called getChildren(a)');

		calls.pop()!();
		assert.strictEqual(calls.length, 0, 'no pending getChildren calls');

		await pUpdateChildrenA;
		assert.strictEqual(calls.length, 0, 'expand(a) should not have forced a second refresh');

		const result = await pExpandA;
		assert.strictEqual(result, true, 'expand(a) should be done');
	});

	test('issue #80098 - first expand should call getChildren', async () => {
		return runWithFakedTimers({ useFakeTimers: true }, async () => {
			const container = document.createElement('div');

			const calls: Function[] = [];
			const dataSource = new class implements IAsyncDataSource<Element, Element> {
				hasChildren(element: Element): boolean {
					return !!element.children && element.children.length > 0;
				}
				getChildren(element: Element): Promise<Element[]> {
					return new Promise(c => calls.push(() => c(element.children || [])));
				}
			};

			const model = new Model({
				id: 'root',
				children: [{
					id: 'a', children: [{
						id: 'aa'
					}]
				}]
			});

			const tree = store.add(new AsyncDataTree<Element, Element>('test', container, new VirtualDelegate(), [new Renderer()], dataSource, { identityProvider: new IdentityProvider() }));
			tree.layout(200);

			const pSetInput = tree.setInput(model.root);
			calls.pop()!(); // resolve getChildren(root)
			await pSetInput;

			const pExpandA = tree.expand(model.get('a'));
			assert.strictEqual(calls.length, 1, 'expand(a) should\'ve called getChildren(a)');

			let race = await Promise.race([pExpandA.then(() => 'expand'), timeout(1).then(() => 'timeout')]);
			assert.strictEqual(race, 'timeout', 'expand(a) should not be yet done');

			calls.pop()!();
			assert.strictEqual(calls.length, 0, 'no pending getChildren calls');

			race = await Promise.race([pExpandA.then(() => 'expand'), timeout(1).then(() => 'timeout')]);
			assert.strictEqual(race, 'expand', 'expand(a) should now be done');
		});
	});

	test('issue #78388 - tree should react to hasChildren toggles', async () => {
		const container = document.createElement('div');
		const model = new Model({
			id: 'root',
			children: [{
				id: 'a'
			}]
		});

		const tree = store.add(new AsyncDataTree<Element, Element>('test', container, new VirtualDelegate(), [new Renderer()], new DataSource(), { identityProvider: new IdentityProvider() }));
		tree.layout(200);

		await tree.setInput(model.root);
		assert.strictEqual(container.querySelectorAll('.monaco-list-row').length, 1);

		let twistie = container.querySelector('.monaco-list-row:first-child .monaco-tl-twistie') as HTMLElement;
		assert(!twistie.classList.contains('collapsible'));
		assert(!twistie.classList.contains('collapsed'));

		model.get('a').children = [{ id: 'aa' }];
		await tree.updateChildren(model.get('a'), false);
		assert.strictEqual(container.querySelectorAll('.monaco-list-row').length, 1);
		twistie = container.querySelector('.monaco-list-row:first-child .monaco-tl-twistie') as HTMLElement;
		assert(twistie.classList.contains('collapsible'));
		assert(twistie.classList.contains('collapsed'));

		model.get('a').children = [];
		await tree.updateChildren(model.get('a'), false);
		assert.strictEqual(container.querySelectorAll('.monaco-list-row').length, 1);
		twistie = container.querySelector('.monaco-list-row:first-child .monaco-tl-twistie') as HTMLElement;
		assert(!twistie.classList.contains('collapsible'));
		assert(!twistie.classList.contains('collapsed'));
	});

	test('issues #84569, #82629 - rerender', async () => {
		const container = document.createElement('div');
		const model = new Model({
			id: 'root',
			children: [{
				id: 'a',
				children: [{
					id: 'b',
					suffix: '1'
				}]
			}]
		});

		const tree = store.add(new AsyncDataTree<Element, Element>('test', container, new VirtualDelegate(), [new Renderer()], new DataSource(), { identityProvider: new IdentityProvider() }));
		tree.layout(200);

		await tree.setInput(model.root);
		await tree.expand(model.get('a'));
		assert.deepStrictEqual(Array.from(container.querySelectorAll('.monaco-list-row')).map(e => e.textContent), ['a', 'b1']);

		const a = model.get('a');
		const b = model.get('b');
		a.children?.splice(0, 1, { id: 'b', suffix: '2' });

		await Promise.all([
			tree.updateChildren(a, true, true),
			tree.updateChildren(b, true, true)
		]);

		assert.deepStrictEqual(Array.from(container.querySelectorAll('.monaco-list-row')).map(e => e.textContent), ['a', 'b2']);
	});

	test('issue #199264 - dispose during render', async () => {
		const container = document.createElement('div');
		const model1 = new Model({
			id: 'root',
			children: [{
				id: 'a', children: [{ id: 'aa' }, { id: 'ab' }, { id: 'ac' }]
			}]
		});
		const model2 = new Model({
			id: 'root',
			children: [{
				id: 'a', children: [{ id: 'aa' }, { id: 'ab' }, { id: 'ac' }]
			}]
		});

		const tree = store.add(new AsyncDataTree<Element, Element>('test', container, new VirtualDelegate(), [new Renderer()], new DataSource(), { identityProvider: new IdentityProvider() }));
		tree.layout(200);

		await tree.setInput(model1.root);
		const input = tree.setInput(model2.root);
		tree.dispose();
		await input;
		assert.strictEqual(container.innerHTML, '');
	});

	test('issue #121567', async () => {
		const container = document.createElement('div');

		const calls: Element[] = [];
		const dataSource = new class implements IAsyncDataSource<Element, Element> {
			hasChildren(element: Element): boolean {
				return !!element.children && element.children.length > 0;
			}
			async getChildren(element: Element) {
				calls.push(element);
				return element.children ?? Iterable.empty();
			}
		};

		const model = new Model({
			id: 'root',
			children: [{
				id: 'a', children: [{
					id: 'aa'
				}]
			}]
		});
		const a = model.get('a');

		const tree = store.add(new AsyncDataTree<Element, Element>('test', container, new VirtualDelegate(), [new Renderer()], dataSource, { identityProvider: new IdentityProvider() }));
		tree.layout(200);

		await tree.setInput(model.root);
		assert.strictEqual(calls.length, 1, 'There should be a single getChildren call for the root');
		assert(tree.isCollapsible(a), 'a is collapsible');
		assert(tree.isCollapsed(a), 'a is collapsed');

		await tree.updateChildren(a, false);
		assert.strictEqual(calls.length, 1, 'There should be no changes to the calls list, since a was collapsed');
		assert(tree.isCollapsible(a), 'a is collapsible');
		assert(tree.isCollapsed(a), 'a is collapsed');

		const children = a.children;
		a.children = [];
		await tree.updateChildren(a, false);
		assert.strictEqual(calls.length, 1, 'There should still be no changes to the calls list, since a was collapsed');
		assert(!tree.isCollapsible(a), 'a is no longer collapsible');
		assert(tree.isCollapsed(a), 'a is collapsed');

		a.children = children;
		await tree.updateChildren(a, false);
		assert.strictEqual(calls.length, 1, 'There should still be no changes to the calls list, since a was collapsed');
		assert(tree.isCollapsible(a), 'a is collapsible again');
		assert(tree.isCollapsed(a), 'a is collapsed');

		await tree.expand(a);
		assert.strictEqual(calls.length, 2, 'Finally, there should be a getChildren call for a');
		assert(tree.isCollapsible(a), 'a is still collapsible');
		assert(!tree.isCollapsed(a), 'a is expanded');
	});

	test('issue #199441', async () => {
		const container = document.createElement('div');

		const dataSource = new class implements IAsyncDataSource<Element, Element> {
			hasChildren(element: Element): boolean {
				return !!element.children && element.children.length > 0;
			}
			async getChildren(element: Element) {
				return element.children ?? Iterable.empty();
			}
		};

		const compressionDelegate = new class implements ITreeCompressionDelegate<Element> {
			isIncompressible(element: Element): boolean {
				return !dataSource.hasChildren(element);
			}
		};

		const model = new Model({
			id: 'root',
			children: [{
				id: 'a', children: [{
					id: 'b',
					children: [{ id: 'b.txt' }]
				}]
			}]
		});

		const collapseByDefault = (element: Element) => false;

		const tree = store.add(new CompressibleAsyncDataTree<Element, Element>('test', container, new VirtualDelegate(), compressionDelegate, [new Renderer()], dataSource, { identityProvider: new IdentityProvider(), collapseByDefault }));
		tree.layout(200);

		await tree.setInput(model.root);
		assert.deepStrictEqual(Array.from(container.querySelectorAll('.monaco-list-row')).map(e => e.textContent), ['a/b', 'b.txt']);

		model.get('a').children!.push({
			id: 'c',
			children: [{ id: 'c.txt' }]
		});

		await tree.updateChildren(model.root, true);
		assert.deepStrictEqual(Array.from(container.querySelectorAll('.monaco-list-row')).map(e => e.textContent), ['a', 'b', 'b.txt', 'c', 'c.txt']);
	});

	test('Tree Navigation: AsyncDataTree', async () => {
		const container = document.createElement('div');

		const model = new Model({
			id: 'root',
			children: [{
				id: 'a', children: [{
					id: 'aa', children: [{ id: 'aa.txt' }]
				}, {
					id: 'ab', children: [{ id: 'ab.txt' }]
				}]
			}, {
				id: 'b', children: [{
					id: 'ba', children: [{ id: 'ba.txt' }]
				}, {
					id: 'bb', children: [{ id: 'bb.txt' }]
				}]
			}, {
				id: 'c', children: [{
					id: 'ca', children: [{ id: 'ca.txt' }]
				}, {
					id: 'cb', children: [{ id: 'cb.txt' }]
				}]
			}]
		});

		const tree = store.add(new AsyncDataTree<Element, Element>('test', container, new VirtualDelegate(), [new Renderer()], new DataSource(), { identityProvider: new IdentityProvider() }));
		tree.layout(200);

		await tree.setInput(model.root);
		assert.deepStrictEqual(Array.from(container.querySelectorAll('.monaco-list-row')).map(e => e.textContent), ['a', 'b', 'c']);

		assert.strictEqual(tree.navigate().current(), null);
		assert.strictEqual(tree.navigate().first()?.id, 'a');
		assert.strictEqual(tree.navigate().last()?.id, 'c');

		assert.strictEqual(tree.navigate(model.get('b')).previous()?.id, 'a');
		assert.strictEqual(tree.navigate(model.get('b')).next()?.id, 'c');

		await tree.expand(model.get('a'));
		await tree.expand(model.get('aa'));
		await tree.expand(model.get('ab'));

		await tree.expand(model.get('b'));
		await tree.expand(model.get('ba'));
		await tree.expand(model.get('bb'));

		await tree.expand(model.get('c'));
		await tree.expand(model.get('ca'));
		await tree.expand(model.get('cb'));

		// Only the first 10 elements are rendered (total height is 200px, each element is 20px)
		assert.deepStrictEqual(Array.from(container.querySelectorAll('.monaco-list-row')).map(e => e.textContent), ['a', 'aa', 'aa.txt', 'ab', 'ab.txt', 'b', 'ba', 'ba.txt', 'bb', 'bb.txt']);

		assert.strictEqual(tree.navigate().first()?.id, 'a');
		assert.strictEqual(tree.navigate().last()?.id, 'cb.txt');

		assert.strictEqual(tree.navigate(model.get('b')).previous()?.id, 'ab.txt');
		assert.strictEqual(tree.navigate(model.get('b')).next()?.id, 'ba');

		assert.strictEqual(tree.navigate(model.get('ab.txt')).previous()?.id, 'ab');
		assert.strictEqual(tree.navigate(model.get('ab.txt')).next()?.id, 'b');

		assert.strictEqual(tree.navigate(model.get('bb.txt')).next()?.id, 'c');

		tree.collapse(model.get('b'), false);
		assert.deepStrictEqual(Array.from(container.querySelectorAll('.monaco-list-row')).map(e => e.textContent), ['a', 'aa', 'aa.txt', 'ab', 'ab.txt', 'b', 'c', 'ca', 'ca.txt', 'cb']);

		assert.strictEqual(tree.navigate(model.get('b')).next()?.id, 'c');
	});

	test('Test Navigation: CompressibleAsyncDataTree', async () => {
		const container = document.createElement('div');

		const dataSource = new class implements IAsyncDataSource<Element, Element> {
			hasChildren(element: Element): boolean {
				return !!element.children && element.children.length > 0;
			}
			async getChildren(element: Element) {
				return element.children ?? Iterable.empty();
			}
		};

		const compressionDelegate = new class implements ITreeCompressionDelegate<Element> {
			isIncompressible(element: Element): boolean {
				return !dataSource.hasChildren(element);
			}
		};

		const model = new Model({
			id: 'root',
			children: [
				{
					id: 'a', children: [{ id: 'aa', children: [{ id: 'aa.txt' }] }]
				}, {
					id: 'b', children: [{ id: 'ba', children: [{ id: 'ba.txt' }] }]
				}, {
					id: 'c', children: [{
						id: 'ca', children: [{ id: 'ca.txt' }]
					}, {
						id: 'cb', children: [{ id: 'cb.txt' }]
					}]
				}
			]
		});

		const tree = store.add(new CompressibleAsyncDataTree<Element, Element>('test', container, new VirtualDelegate(), compressionDelegate, [new Renderer()], dataSource, { identityProvider: new IdentityProvider() }));
		tree.layout(200);

		await tree.setInput(model.root);
		assert.deepStrictEqual(Array.from(container.querySelectorAll('.monaco-list-row')).map(e => e.textContent), ['a', 'b', 'c']);

		assert.strictEqual(tree.navigate().current(), null);
		assert.strictEqual(tree.navigate().first()?.id, 'a');
		assert.strictEqual(tree.navigate().last()?.id, 'c');

		assert.strictEqual(tree.navigate(model.get('b')).previous()?.id, 'a');
		assert.strictEqual(tree.navigate(model.get('b')).next()?.id, 'c');

		await tree.expand(model.get('a'));
		await tree.expand(model.get('aa'));

		await tree.expand(model.get('b'));
		await tree.expand(model.get('ba'));

		await tree.expand(model.get('c'));
		await tree.expand(model.get('ca'));
		await tree.expand(model.get('cb'));

		// Only the first 10 elements are rendered (total height is 200px, each element is 20px)
		assert.deepStrictEqual(Array.from(container.querySelectorAll('.monaco-list-row')).map(e => e.textContent), ['a/aa', 'aa.txt', 'b/ba', 'ba.txt', 'c', 'ca', 'ca.txt', 'cb', 'cb.txt']);

		assert.strictEqual(tree.navigate().first()?.id, 'aa');
		assert.strictEqual(tree.navigate().last()?.id, 'cb.txt');

		assert.strictEqual(tree.navigate(model.get('b')).previous()?.id, 'aa.txt');
		assert.strictEqual(tree.navigate(model.get('ba')).previous()?.id, 'aa.txt');

		assert.strictEqual(tree.navigate(model.get('b')).next()?.id, 'ba.txt');
		assert.strictEqual(tree.navigate(model.get('ba')).next()?.id, 'ba.txt');

		assert.strictEqual(tree.navigate(model.get('aa.txt')).previous()?.id, 'aa');
		assert.strictEqual(tree.navigate(model.get('aa.txt')).next()?.id, 'ba');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/ui/tree/compressedObjectTreeModel.test.ts]---
Location: vscode-main/src/vs/base/test/browser/ui/tree/compressedObjectTreeModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { compress, CompressedObjectTreeModel, decompress, ICompressedTreeElement, ICompressedTreeNode } from '../../../../browser/ui/tree/compressedObjectTreeModel.js';
import { IObjectTreeModelSetChildrenOptions } from '../../../../browser/ui/tree/objectTreeModel.js';
import { ITreeModel, ITreeNode } from '../../../../browser/ui/tree/tree.js';
import { Iterable } from '../../../../common/iterator.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../common/utils.js';
import { IDisposable } from '../../../../common/lifecycle.js';

interface IResolvedCompressedTreeElement<T> extends ICompressedTreeElement<T> {
	readonly element: T;
	readonly children?: ICompressedTreeElement<T>[];
}

function resolve<T>(treeElement: ICompressedTreeElement<T>): IResolvedCompressedTreeElement<T> {
	const result: any = { element: treeElement.element };
	const children = Array.from(Iterable.from(treeElement.children), resolve);

	if (treeElement.incompressible) {
		result.incompressible = true;
	}

	if (children.length > 0) {
		result.children = children;
	}

	return result;
}

suite('CompressedObjectTree', function () {

	ensureNoDisposablesAreLeakedInTestSuite();

	suite('compress & decompress', function () {

		test('small', function () {
			const decompressed: ICompressedTreeElement<number> = { element: 1 };
			const compressed: IResolvedCompressedTreeElement<ICompressedTreeNode<number>> =
				{ element: { elements: [1], incompressible: false } };

			assert.deepStrictEqual(resolve(compress(decompressed)), compressed);
			assert.deepStrictEqual(resolve(decompress(compressed)), decompressed);
		});

		test('no compression', function () {
			const decompressed: ICompressedTreeElement<number> = {
				element: 1, children: [
					{ element: 11 },
					{ element: 12 },
					{ element: 13 }
				]
			};

			const compressed: IResolvedCompressedTreeElement<ICompressedTreeNode<number>> = {
				element: { elements: [1], incompressible: false },
				children: [
					{ element: { elements: [11], incompressible: false } },
					{ element: { elements: [12], incompressible: false } },
					{ element: { elements: [13], incompressible: false } }
				]
			};

			assert.deepStrictEqual(resolve(compress(decompressed)), compressed);
			assert.deepStrictEqual(resolve(decompress(compressed)), decompressed);
		});

		test('single hierarchy', function () {
			const decompressed: ICompressedTreeElement<number> = {
				element: 1, children: [
					{
						element: 11, children: [
							{
								element: 111, children: [
									{ element: 1111 }
								]
							}
						]
					}
				]
			};

			const compressed: IResolvedCompressedTreeElement<ICompressedTreeNode<number>> = {
				element: { elements: [1, 11, 111, 1111], incompressible: false }
			};

			assert.deepStrictEqual(resolve(compress(decompressed)), compressed);
			assert.deepStrictEqual(resolve(decompress(compressed)), decompressed);
		});

		test('deep compression', function () {
			const decompressed: ICompressedTreeElement<number> = {
				element: 1, children: [
					{
						element: 11, children: [
							{
								element: 111, children: [
									{ element: 1111 },
									{ element: 1112 },
									{ element: 1113 },
									{ element: 1114 },
								]
							}
						]
					}
				]
			};

			const compressed: IResolvedCompressedTreeElement<ICompressedTreeNode<number>> = {
				element: { elements: [1, 11, 111], incompressible: false },
				children: [
					{ element: { elements: [1111], incompressible: false } },
					{ element: { elements: [1112], incompressible: false } },
					{ element: { elements: [1113], incompressible: false } },
					{ element: { elements: [1114], incompressible: false } },
				]
			};

			assert.deepStrictEqual(resolve(compress(decompressed)), compressed);
			assert.deepStrictEqual(resolve(decompress(compressed)), decompressed);
		});

		test('double deep compression', function () {
			const decompressed: ICompressedTreeElement<number> = {
				element: 1, children: [
					{
						element: 11, children: [
							{
								element: 111, children: [
									{ element: 1112 },
									{ element: 1113 },
								]
							}
						]
					},
					{
						element: 12, children: [
							{
								element: 121, children: [
									{ element: 1212 },
									{ element: 1213 },
								]
							}
						]
					}
				]
			};

			const compressed: IResolvedCompressedTreeElement<ICompressedTreeNode<number>> = {
				element: { elements: [1], incompressible: false },
				children: [
					{
						element: { elements: [11, 111], incompressible: false },
						children: [
							{ element: { elements: [1112], incompressible: false } },
							{ element: { elements: [1113], incompressible: false } },
						]
					},
					{
						element: { elements: [12, 121], incompressible: false },
						children: [
							{ element: { elements: [1212], incompressible: false } },
							{ element: { elements: [1213], incompressible: false } },
						]
					}
				]
			};

			assert.deepStrictEqual(resolve(compress(decompressed)), compressed);
			assert.deepStrictEqual(resolve(decompress(compressed)), decompressed);
		});

		test('incompressible leaf', function () {
			const decompressed: ICompressedTreeElement<number> = {
				element: 1, children: [
					{
						element: 11, children: [
							{
								element: 111, children: [
									{ element: 1111, incompressible: true }
								]
							}
						]
					}
				]
			};

			const compressed: IResolvedCompressedTreeElement<ICompressedTreeNode<number>> = {
				element: { elements: [1, 11, 111], incompressible: false },
				children: [
					{ element: { elements: [1111], incompressible: true } }
				]
			};

			assert.deepStrictEqual(resolve(compress(decompressed)), compressed);
			assert.deepStrictEqual(resolve(decompress(compressed)), decompressed);
		});

		test('incompressible branch', function () {
			const decompressed: ICompressedTreeElement<number> = {
				element: 1, children: [
					{
						element: 11, children: [
							{
								element: 111, incompressible: true, children: [
									{ element: 1111 }
								]
							}
						]
					}
				]
			};

			const compressed: IResolvedCompressedTreeElement<ICompressedTreeNode<number>> = {
				element: { elements: [1, 11], incompressible: false },
				children: [
					{ element: { elements: [111, 1111], incompressible: true } }
				]
			};

			assert.deepStrictEqual(resolve(compress(decompressed)), compressed);
			assert.deepStrictEqual(resolve(decompress(compressed)), decompressed);
		});

		test('incompressible chain', function () {
			const decompressed: ICompressedTreeElement<number> = {
				element: 1, children: [
					{
						element: 11, children: [
							{
								element: 111, incompressible: true, children: [
									{ element: 1111, incompressible: true }
								]
							}
						]
					}
				]
			};

			const compressed: IResolvedCompressedTreeElement<ICompressedTreeNode<number>> = {
				element: { elements: [1, 11], incompressible: false },
				children: [
					{
						element: { elements: [111], incompressible: true },
						children: [
							{ element: { elements: [1111], incompressible: true } }
						]
					}
				]
			};

			assert.deepStrictEqual(resolve(compress(decompressed)), compressed);
			assert.deepStrictEqual(resolve(decompress(compressed)), decompressed);
		});

		test('incompressible tree', function () {
			const decompressed: ICompressedTreeElement<number> = {
				element: 1, children: [
					{
						element: 11, incompressible: true, children: [
							{
								element: 111, incompressible: true, children: [
									{ element: 1111, incompressible: true }
								]
							}
						]
					}
				]
			};

			const compressed: IResolvedCompressedTreeElement<ICompressedTreeNode<number>> = {
				element: { elements: [1], incompressible: false },
				children: [
					{
						element: { elements: [11], incompressible: true },
						children: [
							{
								element: { elements: [111], incompressible: true },
								children: [
									{ element: { elements: [1111], incompressible: true } }
								]
							}
						]
					}
				]
			};

			assert.deepStrictEqual(resolve(compress(decompressed)), compressed);
			assert.deepStrictEqual(resolve(decompress(compressed)), decompressed);
		});
	});

	function bindListToModel<T>(list: ITreeNode<T>[], model: ITreeModel<T, any, any>): IDisposable {
		return model.onDidSpliceRenderedNodes(({ start, deleteCount, elements }) => {
			list.splice(start, deleteCount, ...elements);
		});
	}

	function toArray<T>(list: ITreeNode<ICompressedTreeNode<T>>[]): T[][] {
		return list.map(i => i.element.elements);
	}

	suite('CompressedObjectTreeModel', function () {

		/**
		 * Calls that test function twice, once with an empty options and
		 * once with `diffIdentityProvider`.
		 */
		function withSmartSplice(fn: (options: IObjectTreeModelSetChildrenOptions<number, any>) => void) {
			fn({});
			fn({ diffIdentityProvider: { getId: n => String(n) } });
		}


		test('ctor', () => {
			const model = new CompressedObjectTreeModel<number>('test');
			assert(model);
			assert.strictEqual(model.size, 0);
		});

		test('flat', () => withSmartSplice(options => {
			const list: ITreeNode<ICompressedTreeNode<number>>[] = [];
			const model = new CompressedObjectTreeModel<number>('test');
			const disposable = bindListToModel(list, model);

			model.setChildren(null, [
				{ element: 0 },
				{ element: 1 },
				{ element: 2 }
			], options);

			assert.deepStrictEqual(toArray(list), [[0], [1], [2]]);
			assert.strictEqual(model.size, 3);

			model.setChildren(null, [
				{ element: 3 },
				{ element: 4 },
				{ element: 5 },
			], options);

			assert.deepStrictEqual(toArray(list), [[3], [4], [5]]);
			assert.strictEqual(model.size, 3);

			model.setChildren(null, [], options);
			assert.deepStrictEqual(toArray(list), []);
			assert.strictEqual(model.size, 0);

			disposable.dispose();
		}));

		test('nested', () => withSmartSplice(options => {
			const list: ITreeNode<ICompressedTreeNode<number>>[] = [];
			const model = new CompressedObjectTreeModel<number>('test');
			const disposable = bindListToModel(list, model);

			model.setChildren(null, [
				{
					element: 0, children: [
						{ element: 10 },
						{ element: 11 },
						{ element: 12 },
					]
				},
				{ element: 1 },
				{ element: 2 }
			], options);

			assert.deepStrictEqual(toArray(list), [[0], [10], [11], [12], [1], [2]]);
			assert.strictEqual(model.size, 6);

			model.setChildren(12, [
				{ element: 120 },
				{ element: 121 }
			], options);

			assert.deepStrictEqual(toArray(list), [[0], [10], [11], [12], [120], [121], [1], [2]]);
			assert.strictEqual(model.size, 8);

			model.setChildren(0, [], options);
			assert.deepStrictEqual(toArray(list), [[0], [1], [2]]);
			assert.strictEqual(model.size, 3);

			model.setChildren(null, [], options);
			assert.deepStrictEqual(toArray(list), []);
			assert.strictEqual(model.size, 0);

			disposable.dispose();
		}));

		test('compressed', () => withSmartSplice(options => {
			const list: ITreeNode<ICompressedTreeNode<number>>[] = [];
			const model = new CompressedObjectTreeModel<number>('test');
			const disposable = bindListToModel(list, model);

			model.setChildren(null, [
				{
					element: 1, children: [{
						element: 11, children: [{
							element: 111, children: [
								{ element: 1111 },
								{ element: 1112 },
								{ element: 1113 },
							]
						}]
					}]
				}
			], options);

			assert.deepStrictEqual(toArray(list), [[1, 11, 111], [1111], [1112], [1113]]);
			assert.strictEqual(model.size, 6);

			model.setChildren(11, [
				{ element: 111 },
				{ element: 112 },
				{ element: 113 },
			], options);

			assert.deepStrictEqual(toArray(list), [[1, 11], [111], [112], [113]]);
			assert.strictEqual(model.size, 5);

			model.setChildren(113, [
				{ element: 1131 }
			], options);

			assert.deepStrictEqual(toArray(list), [[1, 11], [111], [112], [113, 1131]]);
			assert.strictEqual(model.size, 6);

			model.setChildren(1131, [
				{ element: 1132 }
			], options);

			assert.deepStrictEqual(toArray(list), [[1, 11], [111], [112], [113, 1131, 1132]]);
			assert.strictEqual(model.size, 7);

			model.setChildren(1131, [
				{ element: 1132 },
				{ element: 1133 },
			], options);

			assert.deepStrictEqual(toArray(list), [[1, 11], [111], [112], [113, 1131], [1132], [1133]]);
			assert.strictEqual(model.size, 8);

			disposable.dispose();
		}));
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/ui/tree/dataTree.test.ts]---
Location: vscode-main/src/vs/base/test/browser/ui/tree/dataTree.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IIdentityProvider, IListVirtualDelegate } from '../../../../browser/ui/list/list.js';
import { DataTree } from '../../../../browser/ui/tree/dataTree.js';
import { IDataSource, ITreeNode, ITreeRenderer } from '../../../../browser/ui/tree/tree.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../common/utils.js';

interface E {
	value: number;
	children?: E[];
}

suite('DataTree', function () {
	let tree: DataTree<E, E>;

	const root: E = {
		value: -1,
		children: [
			{ value: 0, children: [{ value: 10 }, { value: 11 }, { value: 12 }] },
			{ value: 1 },
			{ value: 2 },
		]
	};

	const empty: E = {
		value: -1,
		children: []
	};

	teardown(() => tree.dispose());

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		const container = document.createElement('div');
		container.style.width = '200px';
		container.style.height = '200px';

		const delegate = new class implements IListVirtualDelegate<E> {
			getHeight() { return 20; }
			getTemplateId(): string { return 'default'; }
		};

		const renderer = new class implements ITreeRenderer<E, void, HTMLElement> {
			readonly templateId = 'default';
			renderTemplate(container: HTMLElement): HTMLElement {
				return container;
			}
			renderElement(element: ITreeNode<E, void>, index: number, templateData: HTMLElement): void {
				templateData.textContent = `${element.element.value}`;
			}
			disposeTemplate(): void { }
		};

		const dataSource = new class implements IDataSource<E, E> {
			getChildren(element: E): E[] {
				return element.children || [];
			}
		};

		const identityProvider = new class implements IIdentityProvider<E> {
			getId(element: E): { toString(): string } {
				return `${element.value}`;
			}
		};

		tree = new DataTree<E, E>('test', container, delegate, [renderer], dataSource, { identityProvider });
		tree.layout(200);
	});

	test('view state is lost implicitly', () => {
		tree.setInput(root);

		let navigator = tree.navigate();
		assert.strictEqual(navigator.next()!.value, 0);
		assert.strictEqual(navigator.next()!.value, 10);
		assert.strictEqual(navigator.next()!.value, 11);
		assert.strictEqual(navigator.next()!.value, 12);
		assert.strictEqual(navigator.next()!.value, 1);
		assert.strictEqual(navigator.next()!.value, 2);
		assert.strictEqual(navigator.next()!, null);

		tree.collapse(root.children![0]);
		navigator = tree.navigate();
		assert.strictEqual(navigator.next()!.value, 0);
		assert.strictEqual(navigator.next()!.value, 1);
		assert.strictEqual(navigator.next()!.value, 2);
		assert.strictEqual(navigator.next()!, null);

		tree.setSelection([root.children![1]]);
		tree.setFocus([root.children![2]]);

		tree.setInput(empty);
		tree.setInput(root);
		navigator = tree.navigate();
		assert.strictEqual(navigator.next()!.value, 0);
		assert.strictEqual(navigator.next()!.value, 10);
		assert.strictEqual(navigator.next()!.value, 11);
		assert.strictEqual(navigator.next()!.value, 12);
		assert.strictEqual(navigator.next()!.value, 1);
		assert.strictEqual(navigator.next()!.value, 2);
		assert.strictEqual(navigator.next()!, null);

		assert.deepStrictEqual(tree.getSelection(), []);
		assert.deepStrictEqual(tree.getFocus(), []);
	});

	test('view state can be preserved', () => {
		tree.setInput(root);

		let navigator = tree.navigate();
		assert.strictEqual(navigator.next()!.value, 0);
		assert.strictEqual(navigator.next()!.value, 10);
		assert.strictEqual(navigator.next()!.value, 11);
		assert.strictEqual(navigator.next()!.value, 12);
		assert.strictEqual(navigator.next()!.value, 1);
		assert.strictEqual(navigator.next()!.value, 2);
		assert.strictEqual(navigator.next()!, null);

		tree.collapse(root.children![0]);
		navigator = tree.navigate();
		assert.strictEqual(navigator.next()!.value, 0);
		assert.strictEqual(navigator.next()!.value, 1);
		assert.strictEqual(navigator.next()!.value, 2);
		assert.strictEqual(navigator.next()!, null);

		tree.setSelection([root.children![1]]);
		tree.setFocus([root.children![2]]);

		const viewState = tree.getViewState();

		tree.setInput(empty);
		tree.setInput(root, viewState);
		navigator = tree.navigate();
		assert.strictEqual(navigator.next()!.value, 0);
		assert.strictEqual(navigator.next()!.value, 1);
		assert.strictEqual(navigator.next()!.value, 2);
		assert.strictEqual(navigator.next()!, null);

		assert.deepStrictEqual(tree.getSelection(), [root.children![1]]);
		assert.deepStrictEqual(tree.getFocus(), [root.children![2]]);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/ui/tree/indexTreeModel.test.ts]---
Location: vscode-main/src/vs/base/test/browser/ui/tree/indexTreeModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IIndexTreeModelSpliceOptions, IIndexTreeNode, IndexTreeModel } from '../../../../browser/ui/tree/indexTreeModel.js';
import { ITreeElement, ITreeFilter, ITreeNode, TreeVisibility } from '../../../../browser/ui/tree/tree.js';
import { timeout } from '../../../../common/async.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../common/utils.js';
import { DisposableStore, IDisposable } from '../../../../common/lifecycle.js';

function bindListToModel<T>(list: ITreeNode<T>[], model: IndexTreeModel<T>): IDisposable {
	return model.onDidSpliceRenderedNodes(({ start, deleteCount, elements }) => {
		list.splice(start, deleteCount, ...elements);
	});
}

function toArray<T>(list: ITreeNode<T>[]): T[] {
	return list.map(i => i.element);
}


function toElements<T>(node: ITreeNode<T>): any {
	return node.children?.length ? { e: node.element, children: node.children.map(toElements) } : node.element;
}

const diffIdentityProvider = { getId: (n: number) => String(n) };

/**
 * Calls that test function twice, once with an empty options and
 * once with `diffIdentityProvider`.
 */
function withSmartSplice(fn: (options: IIndexTreeModelSpliceOptions<number, any>) => void) {
	fn({});
	fn({ diffIdentityProvider });
}

suite('IndexTreeModel', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const disposables = new DisposableStore();
	teardown(() => {
		disposables.clear();
	});

	test('ctor', () => {
		const list: ITreeNode<number>[] = [];
		const model = new IndexTreeModel<number>('test', -1);
		assert(model);
		assert.strictEqual(list.length, 0);
	});

	test('insert', () => withSmartSplice(options => {
		const list: ITreeNode<number>[] = [];
		const model = new IndexTreeModel<number>('test', -1);
		const disposable = bindListToModel(list, model);

		model.splice([0], 0, [
			{ element: 0 },
			{ element: 1 },
			{ element: 2 }
		], options);

		assert.deepStrictEqual(list.length, 3);
		assert.deepStrictEqual(list[0].element, 0);
		assert.deepStrictEqual(list[0].collapsed, false);
		assert.deepStrictEqual(list[0].depth, 1);
		assert.deepStrictEqual(list[1].element, 1);
		assert.deepStrictEqual(list[1].collapsed, false);
		assert.deepStrictEqual(list[1].depth, 1);
		assert.deepStrictEqual(list[2].element, 2);
		assert.deepStrictEqual(list[2].collapsed, false);
		assert.deepStrictEqual(list[2].depth, 1);

		disposable.dispose();
	}));

	test('deep insert', () => withSmartSplice(options => {
		const list: ITreeNode<number>[] = [];
		const model = new IndexTreeModel<number>('test', -1);
		const disposable = bindListToModel(list, model);

		model.splice([0], 0, [
			{
				element: 0, children: [
					{ element: 10 },
					{ element: 11 },
					{ element: 12 },
				]
			},
			{ element: 1 },
			{ element: 2 }
		]);

		assert.deepStrictEqual(list.length, 6);
		assert.deepStrictEqual(list[0].element, 0);
		assert.deepStrictEqual(list[0].collapsed, false);
		assert.deepStrictEqual(list[0].depth, 1);
		assert.deepStrictEqual(list[1].element, 10);
		assert.deepStrictEqual(list[1].collapsed, false);
		assert.deepStrictEqual(list[1].depth, 2);
		assert.deepStrictEqual(list[2].element, 11);
		assert.deepStrictEqual(list[2].collapsed, false);
		assert.deepStrictEqual(list[2].depth, 2);
		assert.deepStrictEqual(list[3].element, 12);
		assert.deepStrictEqual(list[3].collapsed, false);
		assert.deepStrictEqual(list[3].depth, 2);
		assert.deepStrictEqual(list[4].element, 1);
		assert.deepStrictEqual(list[4].collapsed, false);
		assert.deepStrictEqual(list[4].depth, 1);
		assert.deepStrictEqual(list[5].element, 2);
		assert.deepStrictEqual(list[5].collapsed, false);
		assert.deepStrictEqual(list[5].depth, 1);

		disposable.dispose();
	}));

	test('deep insert collapsed', () => withSmartSplice(options => {
		const list: ITreeNode<number>[] = [];
		const model = new IndexTreeModel<number>('test', -1);
		const disposable = bindListToModel(list, model);

		model.splice([0], 0, [
			{
				element: 0, collapsed: true, children: [
					{ element: 10 },
					{ element: 11 },
					{ element: 12 },
				]
			},
			{ element: 1 },
			{ element: 2 }
		], options);

		assert.deepStrictEqual(list.length, 3);
		assert.deepStrictEqual(list[0].element, 0);
		assert.deepStrictEqual(list[0].collapsed, true);
		assert.deepStrictEqual(list[0].depth, 1);
		assert.deepStrictEqual(list[1].element, 1);
		assert.deepStrictEqual(list[1].collapsed, false);
		assert.deepStrictEqual(list[1].depth, 1);
		assert.deepStrictEqual(list[2].element, 2);
		assert.deepStrictEqual(list[2].collapsed, false);
		assert.deepStrictEqual(list[2].depth, 1);

		disposable.dispose();
	}));

	test('delete', () => withSmartSplice(options => {
		const list: ITreeNode<number>[] = [];
		const model = new IndexTreeModel<number>('test', -1);
		const disposable = bindListToModel(list, model);

		model.splice([0], 0, [
			{ element: 0 },
			{ element: 1 },
			{ element: 2 }
		], options);

		assert.deepStrictEqual(list.length, 3);

		model.splice([1], 1, undefined, options);
		assert.deepStrictEqual(list.length, 2);
		assert.deepStrictEqual(list[0].element, 0);
		assert.deepStrictEqual(list[0].collapsed, false);
		assert.deepStrictEqual(list[0].depth, 1);
		assert.deepStrictEqual(list[1].element, 2);
		assert.deepStrictEqual(list[1].collapsed, false);
		assert.deepStrictEqual(list[1].depth, 1);

		model.splice([0], 2, undefined, options);
		assert.deepStrictEqual(list.length, 0);

		disposable.dispose();
	}));

	test('nested delete', () => withSmartSplice(options => {
		const list: ITreeNode<number>[] = [];
		const model = new IndexTreeModel<number>('test', -1);
		const disposable = bindListToModel(list, model);

		model.splice([0], 0, [
			{
				element: 0, children: [
					{ element: 10 },
					{ element: 11 },
					{ element: 12 },
				]
			},
			{ element: 1 },
			{ element: 2 }
		], options);

		assert.deepStrictEqual(list.length, 6);

		model.splice([1], 2, undefined, options);
		assert.deepStrictEqual(list.length, 4);
		assert.deepStrictEqual(list[0].element, 0);
		assert.deepStrictEqual(list[0].collapsed, false);
		assert.deepStrictEqual(list[0].depth, 1);
		assert.deepStrictEqual(list[1].element, 10);
		assert.deepStrictEqual(list[1].collapsed, false);
		assert.deepStrictEqual(list[1].depth, 2);
		assert.deepStrictEqual(list[2].element, 11);
		assert.deepStrictEqual(list[2].collapsed, false);
		assert.deepStrictEqual(list[2].depth, 2);
		assert.deepStrictEqual(list[3].element, 12);
		assert.deepStrictEqual(list[3].collapsed, false);
		assert.deepStrictEqual(list[3].depth, 2);

		disposable.dispose();
	}));

	test('deep delete', () => withSmartSplice(options => {
		const list: ITreeNode<number>[] = [];
		const model = new IndexTreeModel<number>('test', -1);
		const disposable = bindListToModel(list, model);

		model.splice([0], 0, [
			{
				element: 0, children: [
					{ element: 10 },
					{ element: 11 },
					{ element: 12 },
				]
			},
			{ element: 1 },
			{ element: 2 }
		], options);

		assert.deepStrictEqual(list.length, 6);

		model.splice([0], 1, undefined, options);
		assert.deepStrictEqual(list.length, 2);
		assert.deepStrictEqual(list[0].element, 1);
		assert.deepStrictEqual(list[0].collapsed, false);
		assert.deepStrictEqual(list[0].depth, 1);
		assert.deepStrictEqual(list[1].element, 2);
		assert.deepStrictEqual(list[1].collapsed, false);
		assert.deepStrictEqual(list[1].depth, 1);

		disposable.dispose();
	}));

	test('smart splice deep', () => {
		const list: ITreeNode<number>[] = [];
		const model = new IndexTreeModel<number>('test', -1);
		const disposable = bindListToModel(list, model);

		model.splice([0], 0, [
			{ element: 0 },
			{ element: 1 },
			{ element: 2 },
			{ element: 3 },
		], { diffIdentityProvider });

		assert.deepStrictEqual(list.filter(l => l.depth === 1).map(toElements), [
			0,
			1,
			2,
			3,
		]);

		model.splice([0], 3, [
			{ element: -0.5 },
			{ element: 0, children: [{ element: 0.1 }] },
			{ element: 1 },
			{ element: 2, children: [{ element: 2.1 }, { element: 2.2, children: [{ element: 2.21 }] }] },
		], { diffIdentityProvider, diffDepth: Infinity });

		assert.deepStrictEqual(list.filter(l => l.depth === 1).map(toElements), [
			-0.5,
			{ e: 0, children: [0.1] },
			1,
			{ e: 2, children: [2.1, { e: 2.2, children: [2.21] }] },
			3,
		]);

		disposable.dispose();
	});

	test('hidden delete', () => withSmartSplice(options => {
		const list: ITreeNode<number>[] = [];
		const model = new IndexTreeModel<number>('test', -1);
		const disposable = bindListToModel(list, model);

		model.splice([0], 0, [
			{
				element: 0, collapsed: true, children: [
					{ element: 10 },
					{ element: 11 },
					{ element: 12 },
				]
			},
			{ element: 1 },
			{ element: 2 }
		], options);

		assert.deepStrictEqual(list.length, 3);

		model.splice([0, 1], 1, undefined, options);
		assert.deepStrictEqual(list.length, 3);

		model.splice([0, 0], 2, undefined, options);
		assert.deepStrictEqual(list.length, 3);

		disposable.dispose();
	}));

	test('collapse', () => withSmartSplice(options => {
		const list: ITreeNode<number>[] = [];
		const model = new IndexTreeModel<number>('test', -1);
		const disposable = bindListToModel(list, model);

		model.splice([0], 0, [
			{
				element: 0, children: [
					{ element: 10 },
					{ element: 11 },
					{ element: 12 },
				]
			},
			{ element: 1 },
			{ element: 2 }
		], options);

		assert.deepStrictEqual(list.length, 6);

		model.setCollapsed([0], true);
		assert.deepStrictEqual(list.length, 3);
		assert.deepStrictEqual(list[0].element, 0);
		assert.deepStrictEqual(list[0].collapsed, true);
		assert.deepStrictEqual(list[0].depth, 1);
		assert.deepStrictEqual(list[1].element, 1);
		assert.deepStrictEqual(list[1].collapsed, false);
		assert.deepStrictEqual(list[1].depth, 1);
		assert.deepStrictEqual(list[2].element, 2);
		assert.deepStrictEqual(list[2].collapsed, false);
		assert.deepStrictEqual(list[2].depth, 1);

		disposable.dispose();
	}));

	test('expand', () => withSmartSplice(options => {
		const list: ITreeNode<number>[] = [];
		const model = new IndexTreeModel<number>('test', -1);
		const disposable = bindListToModel(list, model);

		model.splice([0], 0, [
			{
				element: 0, collapsed: true, children: [
					{ element: 10 },
					{ element: 11 },
					{ element: 12 },
				]
			},
			{ element: 1 },
			{ element: 2 }
		], options);

		assert.deepStrictEqual(list.length, 3);

		model.expandTo([0, 1]);
		assert.deepStrictEqual(list.length, 6);
		assert.deepStrictEqual(list[0].element, 0);
		assert.deepStrictEqual(list[0].collapsed, false);
		assert.deepStrictEqual(list[0].depth, 1);
		assert.deepStrictEqual(list[1].element, 10);
		assert.deepStrictEqual(list[1].collapsed, false);
		assert.deepStrictEqual(list[1].depth, 2);
		assert.deepStrictEqual(list[2].element, 11);
		assert.deepStrictEqual(list[2].collapsed, false);
		assert.deepStrictEqual(list[2].depth, 2);
		assert.deepStrictEqual(list[3].element, 12);
		assert.deepStrictEqual(list[3].collapsed, false);
		assert.deepStrictEqual(list[3].depth, 2);
		assert.deepStrictEqual(list[4].element, 1);
		assert.deepStrictEqual(list[4].collapsed, false);
		assert.deepStrictEqual(list[4].depth, 1);
		assert.deepStrictEqual(list[5].element, 2);
		assert.deepStrictEqual(list[5].collapsed, false);
		assert.deepStrictEqual(list[5].depth, 1);

		disposable.dispose();
	}));

	test('smart diff consistency', () => {
		const times = 500;
		const minEdits = 1;
		const maxEdits = 10;
		const maxInserts = 5;

		for (let i = 0; i < times; i++) {
			const list: ITreeNode<number>[] = [];
			const options = { diffIdentityProvider: { getId: (n: number) => String(n) } };
			const model = new IndexTreeModel<number>('test', -1);
			const disposable = bindListToModel(list, model);

			const changes = [];
			const expected: number[] = [];
			let elementCounter = 0;

			for (let edits = Math.random() * (maxEdits - minEdits) + minEdits; edits > 0; edits--) {
				const spliceIndex = Math.floor(Math.random() * list.length);
				const deleteCount = Math.ceil(Math.random() * (list.length - spliceIndex));
				const insertCount = Math.floor(Math.random() * maxInserts + 1);

				const inserts: ITreeElement<number>[] = [];
				for (let i = 0; i < insertCount; i++) {
					const element = elementCounter++;
					inserts.push({ element, children: [] });
				}

				// move existing items
				if (Math.random() < 0.5) {
					const elements = list.slice(spliceIndex, spliceIndex + Math.floor(deleteCount / 2));
					inserts.push(...elements.map(({ element }) => ({ element, children: [] })));
				}

				model.splice([spliceIndex], deleteCount, inserts, options);
				expected.splice(spliceIndex, deleteCount, ...inserts.map(i => i.element));

				const listElements = list.map(l => l.element);
				changes.push(`splice(${spliceIndex}, ${deleteCount}, [${inserts.map(e => e.element).join(', ')}]) -> ${listElements.join(', ')}`);

				assert.deepStrictEqual(expected, listElements, `Expected ${listElements.join(', ')} to equal ${expected.join(', ')}. Steps:\n\n${changes.join('\n')}`);
			}

			disposable.dispose();
		}
	});

	test('collapse should recursively adjust visible count', () => {
		const list: ITreeNode<number>[] = [];
		const model = new IndexTreeModel<number>('test', -1);
		const disposable = bindListToModel(list, model);

		model.splice([0], 0, [
			{
				element: 1, children: [
					{
						element: 11, children: [
							{ element: 111 }
						]
					}
				]
			},
			{
				element: 2, children: [
					{ element: 21 }
				]
			}
		]);

		assert.deepStrictEqual(list.length, 5);
		assert.deepStrictEqual(toArray(list), [1, 11, 111, 2, 21]);

		model.setCollapsed([0, 0], true);
		assert.deepStrictEqual(list.length, 4);
		assert.deepStrictEqual(toArray(list), [1, 11, 2, 21]);

		model.setCollapsed([1], true);
		assert.deepStrictEqual(list.length, 3);
		assert.deepStrictEqual(toArray(list), [1, 11, 2]);

		disposable.dispose();
	});

	test('setCollapsible', () => {
		const list: ITreeNode<number>[] = [];
		const model = new IndexTreeModel<number>('test', -1);
		const disposable = bindListToModel(list, model);

		model.splice([0], 0, [
			{
				element: 0, children: [
					{ element: 10 }
				]
			}
		]);

		assert.deepStrictEqual(list.length, 2);

		model.setCollapsible([0], false);
		assert.deepStrictEqual(list.length, 2);
		assert.deepStrictEqual(list[0].element, 0);
		assert.deepStrictEqual(list[0].collapsible, false);
		assert.deepStrictEqual(list[0].collapsed, false);
		assert.deepStrictEqual(list[1].element, 10);
		assert.deepStrictEqual(list[1].collapsible, false);
		assert.deepStrictEqual(list[1].collapsed, false);

		assert.deepStrictEqual(model.setCollapsed([0], true), false);
		assert.deepStrictEqual(list[0].element, 0);
		assert.deepStrictEqual(list[0].collapsible, false);
		assert.deepStrictEqual(list[0].collapsed, false);
		assert.deepStrictEqual(list[1].element, 10);
		assert.deepStrictEqual(list[1].collapsible, false);
		assert.deepStrictEqual(list[1].collapsed, false);

		assert.deepStrictEqual(model.setCollapsed([0], false), false);
		assert.deepStrictEqual(list[0].element, 0);
		assert.deepStrictEqual(list[0].collapsible, false);
		assert.deepStrictEqual(list[0].collapsed, false);
		assert.deepStrictEqual(list[1].element, 10);
		assert.deepStrictEqual(list[1].collapsible, false);
		assert.deepStrictEqual(list[1].collapsed, false);

		model.setCollapsible([0], true);
		assert.deepStrictEqual(list.length, 2);
		assert.deepStrictEqual(list[0].element, 0);
		assert.deepStrictEqual(list[0].collapsible, true);
		assert.deepStrictEqual(list[0].collapsed, false);
		assert.deepStrictEqual(list[1].element, 10);
		assert.deepStrictEqual(list[1].collapsible, false);
		assert.deepStrictEqual(list[1].collapsed, false);

		assert.deepStrictEqual(model.setCollapsed([0], true), true);
		assert.deepStrictEqual(list.length, 1);
		assert.deepStrictEqual(list[0].element, 0);
		assert.deepStrictEqual(list[0].collapsible, true);
		assert.deepStrictEqual(list[0].collapsed, true);

		assert.deepStrictEqual(model.setCollapsed([0], false), true);
		assert.deepStrictEqual(list[0].element, 0);
		assert.deepStrictEqual(list[0].collapsible, true);
		assert.deepStrictEqual(list[0].collapsed, false);
		assert.deepStrictEqual(list[1].element, 10);
		assert.deepStrictEqual(list[1].collapsible, false);
		assert.deepStrictEqual(list[1].collapsed, false);

		disposable.dispose();
	});

	test('simple filter', () => {
		const list: ITreeNode<number>[] = [];
		const filter = new class implements ITreeFilter<number> {
			filter(element: number): TreeVisibility {
				return element % 2 === 0 ? TreeVisibility.Visible : TreeVisibility.Hidden;
			}
		};

		const model = new IndexTreeModel<number>('test', -1, { filter });
		const disposable = bindListToModel(list, model);

		model.splice([0], 0, [
			{
				element: 0, children: [
					{ element: 1 },
					{ element: 2 },
					{ element: 3 },
					{ element: 4 },
					{ element: 5 },
					{ element: 6 },
					{ element: 7 }
				]
			}
		]);

		assert.deepStrictEqual(list.length, 4);
		assert.deepStrictEqual(toArray(list), [0, 2, 4, 6]);

		model.setCollapsed([0], true);
		assert.deepStrictEqual(toArray(list), [0]);

		model.setCollapsed([0], false);
		assert.deepStrictEqual(toArray(list), [0, 2, 4, 6]);

		disposable.dispose();
	});

	test('recursive filter on initial model', () => {
		const list: ITreeNode<number>[] = [];
		const filter = new class implements ITreeFilter<number> {
			filter(element: number): TreeVisibility {
				return element === 0 ? TreeVisibility.Recurse : TreeVisibility.Hidden;
			}
		};

		const model = new IndexTreeModel<number>('test', -1, { filter });
		const disposable = bindListToModel(list, model);

		model.splice([0], 0, [
			{
				element: 0, children: [
					{ element: 1 },
					{ element: 2 }
				]
			}
		]);

		assert.deepStrictEqual(toArray(list), []);

		disposable.dispose();
	});

	test('refilter', () => {
		const list: ITreeNode<number>[] = [];
		let shouldFilter = false;
		const filter = new class implements ITreeFilter<number> {
			filter(element: number): TreeVisibility {
				return (!shouldFilter || element % 2 === 0) ? TreeVisibility.Visible : TreeVisibility.Hidden;
			}
		};

		const model = new IndexTreeModel<number>('test', -1, { filter });
		const disposable = bindListToModel(list, model);

		model.splice([0], 0, [
			{
				element: 0, children: [
					{ element: 1 },
					{ element: 2 },
					{ element: 3 },
					{ element: 4 },
					{ element: 5 },
					{ element: 6 },
					{ element: 7 }
				]
			},
		]);

		assert.deepStrictEqual(toArray(list), [0, 1, 2, 3, 4, 5, 6, 7]);

		model.refilter();
		assert.deepStrictEqual(toArray(list), [0, 1, 2, 3, 4, 5, 6, 7]);

		shouldFilter = true;
		model.refilter();
		assert.deepStrictEqual(toArray(list), [0, 2, 4, 6]);

		shouldFilter = false;
		model.refilter();
		assert.deepStrictEqual(toArray(list), [0, 1, 2, 3, 4, 5, 6, 7]);

		disposable.dispose();
	});

	test('recursive filter', () => {
		const list: ITreeNode<string>[] = [];
		let query = new RegExp('');
		const filter = new class implements ITreeFilter<string> {
			filter(element: string): TreeVisibility {
				return query.test(element) ? TreeVisibility.Visible : TreeVisibility.Recurse;
			}
		};

		const model = new IndexTreeModel<string>('test', 'root', { filter });
		const disposable = bindListToModel(list, model);

		model.splice([0], 0, [
			{
				element: 'vscode', children: [
					{ element: '.build' },
					{ element: 'git' },
					{
						element: 'github', children: [
							{ element: 'calendar.yml' },
							{ element: 'endgame' },
							{ element: 'build.js' },
						]
					},
					{
						element: 'build', children: [
							{ element: 'lib' },
							{ element: 'gulpfile.js' }
						]
					}
				]
			},
		]);

		assert.deepStrictEqual(list.length, 10);

		query = /build/;
		model.refilter();
		assert.deepStrictEqual(toArray(list), ['vscode', '.build', 'github', 'build.js', 'build']);

		model.setCollapsed([0], true);
		assert.deepStrictEqual(toArray(list), ['vscode']);

		model.setCollapsed([0], false);
		assert.deepStrictEqual(toArray(list), ['vscode', '.build', 'github', 'build.js', 'build']);

		disposable.dispose();
	});

	test('recursive filter updates when children change (#133272)', async () => {
		const list: ITreeNode<string>[] = [];
		let query = '';
		const filter = new class implements ITreeFilter<string> {
			filter(element: string): TreeVisibility {
				return element.includes(query) ? TreeVisibility.Visible : TreeVisibility.Recurse;
			}
		};

		const model = new IndexTreeModel<string>('test', 'root', { filter });
		const disposable = bindListToModel(list, model);

		model.splice([0], 0, [
			{
				element: 'a',
				children: [
					{ element: 'b' },
				],
			},
		]);

		assert.deepStrictEqual(toArray(list), ['a', 'b']);
		query = 'visible';
		model.refilter();
		assert.deepStrictEqual(toArray(list), []);

		model.splice([0, 0, 0], 0, [
			{
				element: 'visible', children: []
			},
		]);

		await timeout(0); // wait for refilter microtask

		assert.deepStrictEqual(toArray(list), ['a', 'b', 'visible']);

		disposable.dispose();
	});

	test('recursive filter with collapse', () => {
		const list: ITreeNode<string>[] = [];
		let query = new RegExp('');
		const filter = new class implements ITreeFilter<string> {
			filter(element: string): TreeVisibility {
				return query.test(element) ? TreeVisibility.Visible : TreeVisibility.Recurse;
			}
		};

		const model = new IndexTreeModel<string>('test', 'root', { filter });
		const disposable = bindListToModel(list, model);

		model.splice([0], 0, [
			{
				element: 'vscode', children: [
					{ element: '.build' },
					{ element: 'git' },
					{
						element: 'github', children: [
							{ element: 'calendar.yml' },
							{ element: 'endgame' },
							{ element: 'build.js' },
						]
					},
					{
						element: 'build', children: [
							{ element: 'lib' },
							{ element: 'gulpfile.js' }
						]
					}
				]
			},
		]);

		assert.deepStrictEqual(list.length, 10);

		query = /gulp/;
		model.refilter();
		assert.deepStrictEqual(toArray(list), ['vscode', 'build', 'gulpfile.js']);

		model.setCollapsed([0, 3], true);
		assert.deepStrictEqual(toArray(list), ['vscode', 'build']);

		model.setCollapsed([0], true);
		assert.deepStrictEqual(toArray(list), ['vscode']);

		disposable.dispose();
	});

	test('recursive filter while collapsed', () => {
		const list: ITreeNode<string>[] = [];
		let query = new RegExp('');
		const filter = new class implements ITreeFilter<string> {
			filter(element: string): TreeVisibility {
				return query.test(element) ? TreeVisibility.Visible : TreeVisibility.Recurse;
			}
		};

		const model = new IndexTreeModel<string>('test', 'root', { filter });
		const disposable = bindListToModel(list, model);

		model.splice([0], 0, [
			{
				element: 'vscode', collapsed: true, children: [
					{ element: '.build' },
					{ element: 'git' },
					{
						element: 'github', children: [
							{ element: 'calendar.yml' },
							{ element: 'endgame' },
							{ element: 'build.js' },
						]
					},
					{
						element: 'build', children: [
							{ element: 'lib' },
							{ element: 'gulpfile.js' }
						]
					}
				]
			},
		]);

		assert.deepStrictEqual(toArray(list), ['vscode']);

		query = /gulp/;
		model.refilter();
		assert.deepStrictEqual(toArray(list), ['vscode']);

		model.setCollapsed([0], false);
		assert.deepStrictEqual(toArray(list), ['vscode', 'build', 'gulpfile.js']);

		model.setCollapsed([0], true);
		assert.deepStrictEqual(toArray(list), ['vscode']);

		query = new RegExp('');
		model.refilter();
		assert.deepStrictEqual(toArray(list), ['vscode']);

		model.setCollapsed([0], false);
		assert.deepStrictEqual(list.length, 10);

		disposable.dispose();
	});

	suite('getNodeLocation', () => {

		test('simple', () => {
			const list: IIndexTreeNode<number>[] = [];
			const model = new IndexTreeModel<number>('test', -1);
			const disposable = bindListToModel(list, model);

			model.splice([0], 0, [
				{
					element: 0, children: [
						{ element: 10 },
						{ element: 11 },
						{ element: 12 },
					]
				},
				{ element: 1 },
				{ element: 2 }
			]);

			assert.deepStrictEqual(model.getNodeLocation(list[0]), [0]);
			assert.deepStrictEqual(model.getNodeLocation(list[1]), [0, 0]);
			assert.deepStrictEqual(model.getNodeLocation(list[2]), [0, 1]);
			assert.deepStrictEqual(model.getNodeLocation(list[3]), [0, 2]);
			assert.deepStrictEqual(model.getNodeLocation(list[4]), [1]);
			assert.deepStrictEqual(model.getNodeLocation(list[5]), [2]);

			disposable.dispose();
		});

		test('with filter', () => {
			const list: IIndexTreeNode<number>[] = [];
			const filter = new class implements ITreeFilter<number> {
				filter(element: number): TreeVisibility {
					return element % 2 === 0 ? TreeVisibility.Visible : TreeVisibility.Hidden;
				}
			};

			const model = new IndexTreeModel<number>('test', -1, { filter });
			const disposable = bindListToModel(list, model);

			model.splice([0], 0, [
				{
					element: 0, children: [
						{ element: 1 },
						{ element: 2 },
						{ element: 3 },
						{ element: 4 },
						{ element: 5 },
						{ element: 6 },
						{ element: 7 }
					]
				}
			]);

			assert.deepStrictEqual(model.getNodeLocation(list[0]), [0]);
			assert.deepStrictEqual(model.getNodeLocation(list[1]), [0, 1]);
			assert.deepStrictEqual(model.getNodeLocation(list[2]), [0, 3]);
			assert.deepStrictEqual(model.getNodeLocation(list[3]), [0, 5]);

			disposable.dispose();
		});
	});

	test('refilter with filtered out nodes', () => {
		const list: ITreeNode<string>[] = [];
		let query = new RegExp('');
		const filter = new class implements ITreeFilter<string> {
			filter(element: string): boolean {
				return query.test(element);
			}
		};

		const model = new IndexTreeModel<string>('test', 'root', { filter });
		const disposable = bindListToModel(list, model);

		model.splice([0], 0, [
			{ element: 'silver' },
			{ element: 'gold' },
			{ element: 'platinum' }
		]);

		assert.deepStrictEqual(toArray(list), ['silver', 'gold', 'platinum']);

		query = /platinum/;
		model.refilter();
		assert.deepStrictEqual(toArray(list), ['platinum']);

		model.splice([0], Number.POSITIVE_INFINITY, [
			{ element: 'silver' },
			{ element: 'gold' },
			{ element: 'platinum' }
		]);
		assert.deepStrictEqual(toArray(list), ['platinum']);

		model.refilter();
		assert.deepStrictEqual(toArray(list), ['platinum']);

		disposable.dispose();
	});

	test('explicit hidden nodes should have renderNodeCount == 0, issue #83211', () => {
		const list: ITreeNode<string>[] = [];
		let query = new RegExp('');
		const filter = new class implements ITreeFilter<string> {
			filter(element: string): boolean {
				return query.test(element);
			}
		};

		const model = new IndexTreeModel<string>('test', 'root', { filter });
		const disposable = bindListToModel(list, model);

		model.splice([0], 0, [
			{ element: 'a', children: [{ element: 'aa' }] },
			{ element: 'b', children: [{ element: 'bb' }] }
		]);

		assert.deepStrictEqual(toArray(list), ['a', 'aa', 'b', 'bb']);
		assert.deepStrictEqual(model.getListIndex([0]), 0);
		assert.deepStrictEqual(model.getListIndex([0, 0]), 1);
		assert.deepStrictEqual(model.getListIndex([1]), 2);
		assert.deepStrictEqual(model.getListIndex([1, 0]), 3);

		query = /b/;
		model.refilter();
		assert.deepStrictEqual(toArray(list), ['b', 'bb']);
		assert.deepStrictEqual(model.getListIndex([0]), -1);
		assert.deepStrictEqual(model.getListIndex([0, 0]), -1);
		assert.deepStrictEqual(model.getListIndex([1]), 0);
		assert.deepStrictEqual(model.getListIndex([1, 0]), 1);

		disposable.dispose();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/ui/tree/objectTree.test.ts]---
Location: vscode-main/src/vs/base/test/browser/ui/tree/objectTree.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable no-restricted-syntax */

import assert from 'assert';
import { IIdentityProvider, IListVirtualDelegate } from '../../../../browser/ui/list/list.js';
import { ICompressedTreeNode } from '../../../../browser/ui/tree/compressedObjectTreeModel.js';
import { CompressibleObjectTree, ICompressibleTreeRenderer, ObjectTree } from '../../../../browser/ui/tree/objectTree.js';
import { ITreeNode, ITreeRenderer } from '../../../../browser/ui/tree/tree.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../common/utils.js';

function getRowsTextContent(container: HTMLElement): string[] {
	const rows = [...container.querySelectorAll('.monaco-list-row')];
	rows.sort((a, b) => parseInt(a.getAttribute('data-index')!) - parseInt(b.getAttribute('data-index')!));
	return rows.map(row => row.querySelector('.monaco-tl-contents')!.textContent!);
}

suite('ObjectTree', function () {

	suite('TreeNavigator', function () {
		let tree: ObjectTree<number>;
		let filter = (_: number) => true;

		teardown(() => {
			tree.dispose();
			filter = (_: number) => true;
		});

		ensureNoDisposablesAreLeakedInTestSuite();

		setup(() => {
			const container = document.createElement('div');
			container.style.width = '200px';
			container.style.height = '200px';

			const delegate = new class implements IListVirtualDelegate<number> {
				getHeight() { return 20; }
				getTemplateId(): string { return 'default'; }
			};

			const renderer = new class implements ITreeRenderer<number, void, HTMLElement> {
				readonly templateId = 'default';
				renderTemplate(container: HTMLElement): HTMLElement {
					return container;
				}
				renderElement(element: ITreeNode<number, void>, index: number, templateData: HTMLElement): void {
					templateData.textContent = `${element.element}`;
				}
				disposeTemplate(): void { }
			};

			tree = new ObjectTree<number>('test', container, delegate, [renderer], { filter: { filter: (el) => filter(el) } });
			tree.layout(200);
		});

		test('should be able to navigate', () => {
			tree.setChildren(null, [
				{
					element: 0, children: [
						{ element: 10 },
						{ element: 11 },
						{ element: 12 },
					]
				},
				{ element: 1 },
				{ element: 2 }
			]);

			const navigator = tree.navigate();

			assert.strictEqual(navigator.current(), null);
			assert.strictEqual(navigator.next(), 0);
			assert.strictEqual(navigator.current(), 0);
			assert.strictEqual(navigator.next(), 10);
			assert.strictEqual(navigator.current(), 10);
			assert.strictEqual(navigator.next(), 11);
			assert.strictEqual(navigator.current(), 11);
			assert.strictEqual(navigator.next(), 12);
			assert.strictEqual(navigator.current(), 12);
			assert.strictEqual(navigator.next(), 1);
			assert.strictEqual(navigator.current(), 1);
			assert.strictEqual(navigator.next(), 2);
			assert.strictEqual(navigator.current(), 2);
			assert.strictEqual(navigator.previous(), 1);
			assert.strictEqual(navigator.current(), 1);
			assert.strictEqual(navigator.previous(), 12);
			assert.strictEqual(navigator.previous(), 11);
			assert.strictEqual(navigator.previous(), 10);
			assert.strictEqual(navigator.previous(), 0);
			assert.strictEqual(navigator.previous(), null);
			assert.strictEqual(navigator.next(), 0);
			assert.strictEqual(navigator.next(), 10);
			assert.strictEqual(navigator.first(), 0);
			assert.strictEqual(navigator.last(), 2);
		});

		test('should skip collapsed nodes', () => {
			tree.setChildren(null, [
				{
					element: 0, collapsed: true, children: [
						{ element: 10 },
						{ element: 11 },
						{ element: 12 },
					]
				},
				{ element: 1 },
				{ element: 2 }
			]);

			const navigator = tree.navigate();

			assert.strictEqual(navigator.current(), null);
			assert.strictEqual(navigator.next(), 0);
			assert.strictEqual(navigator.next(), 1);
			assert.strictEqual(navigator.next(), 2);
			assert.strictEqual(navigator.next(), null);
			assert.strictEqual(navigator.previous(), 2);
			assert.strictEqual(navigator.previous(), 1);
			assert.strictEqual(navigator.previous(), 0);
			assert.strictEqual(navigator.previous(), null);
			assert.strictEqual(navigator.next(), 0);
			assert.strictEqual(navigator.first(), 0);
			assert.strictEqual(navigator.last(), 2);
		});

		test('should skip filtered elements', () => {
			filter = el => el % 2 === 0;

			tree.setChildren(null, [
				{
					element: 0, children: [
						{ element: 10 },
						{ element: 11 },
						{ element: 12 },
					]
				},
				{ element: 1 },
				{ element: 2 }
			]);

			const navigator = tree.navigate();

			assert.strictEqual(navigator.current(), null);
			assert.strictEqual(navigator.next(), 0);
			assert.strictEqual(navigator.next(), 10);
			assert.strictEqual(navigator.next(), 12);
			assert.strictEqual(navigator.next(), 2);
			assert.strictEqual(navigator.next(), null);
			assert.strictEqual(navigator.previous(), 2);
			assert.strictEqual(navigator.previous(), 12);
			assert.strictEqual(navigator.previous(), 10);
			assert.strictEqual(navigator.previous(), 0);
			assert.strictEqual(navigator.previous(), null);
			assert.strictEqual(navigator.next(), 0);
			assert.strictEqual(navigator.next(), 10);
			assert.strictEqual(navigator.first(), 0);
			assert.strictEqual(navigator.last(), 2);
		});

		test('should be able to start from node', () => {
			tree.setChildren(null, [
				{
					element: 0, children: [
						{ element: 10 },
						{ element: 11 },
						{ element: 12 },
					]
				},
				{ element: 1 },
				{ element: 2 }
			]);

			const navigator = tree.navigate(1);

			assert.strictEqual(navigator.current(), 1);
			assert.strictEqual(navigator.next(), 2);
			assert.strictEqual(navigator.current(), 2);
			assert.strictEqual(navigator.previous(), 1);
			assert.strictEqual(navigator.current(), 1);
			assert.strictEqual(navigator.previous(), 12);
			assert.strictEqual(navigator.previous(), 11);
			assert.strictEqual(navigator.previous(), 10);
			assert.strictEqual(navigator.previous(), 0);
			assert.strictEqual(navigator.previous(), null);
			assert.strictEqual(navigator.next(), 0);
			assert.strictEqual(navigator.next(), 10);
			assert.strictEqual(navigator.first(), 0);
			assert.strictEqual(navigator.last(), 2);
		});
	});

	class Delegate implements IListVirtualDelegate<number> {
		getHeight() { return 20; }
		getTemplateId(): string { return 'default'; }
	}

	class Renderer implements ITreeRenderer<number, void, HTMLElement> {
		readonly templateId = 'default';
		renderTemplate(container: HTMLElement): HTMLElement {
			return container;
		}
		renderElement(element: ITreeNode<number, void>, index: number, templateData: HTMLElement): void {
			templateData.textContent = `${element.element}`;
		}
		disposeTemplate(): void { }
	}

	class IdentityProvider implements IIdentityProvider<number> {
		getId(element: number): { toString(): string } {
			return `${element % 100}`;
		}
	}

	test('traits are preserved according to string identity', function () {
		const container = document.createElement('div');
		container.style.width = '200px';
		container.style.height = '200px';

		const delegate = new Delegate();
		const renderer = new Renderer();
		const identityProvider = new IdentityProvider();

		const tree = new ObjectTree<number>('test', container, delegate, [renderer], { identityProvider });
		tree.layout(200);

		tree.setChildren(null, [{ element: 0 }, { element: 1 }, { element: 2 }, { element: 3 }]);
		tree.setFocus([1]);
		assert.deepStrictEqual(tree.getFocus(), [1]);

		tree.setChildren(null, [{ element: 100 }, { element: 101 }, { element: 102 }, { element: 103 }]);
		assert.deepStrictEqual(tree.getFocus(), [101]);
	});
});

suite('CompressibleObjectTree', function () {

	class Delegate implements IListVirtualDelegate<number> {
		getHeight() { return 20; }
		getTemplateId(): string { return 'default'; }
	}

	class Renderer implements ICompressibleTreeRenderer<number, void, HTMLElement> {
		readonly templateId = 'default';
		renderTemplate(container: HTMLElement): HTMLElement {
			return container;
		}
		renderElement(node: ITreeNode<number, void>, _: number, templateData: HTMLElement): void {
			templateData.textContent = `${node.element}`;
		}
		renderCompressedElements(node: ITreeNode<ICompressedTreeNode<number>, void>, _: number, templateData: HTMLElement): void {
			templateData.textContent = `${node.element.elements.join('/')}`;
		}
		disposeTemplate(): void { }
	}

	const ds = ensureNoDisposablesAreLeakedInTestSuite();

	test('empty', function () {
		const container = document.createElement('div');
		container.style.width = '200px';
		container.style.height = '200px';

		const tree = ds.add(new CompressibleObjectTree<number>('test', container, new Delegate(), [new Renderer()]));
		tree.layout(200);

		assert.strictEqual(getRowsTextContent(container).length, 0);
	});

	test('simple', function () {
		const container = document.createElement('div');
		container.style.width = '200px';
		container.style.height = '200px';

		const tree = ds.add(new CompressibleObjectTree<number>('test', container, new Delegate(), [new Renderer()]));
		tree.layout(200);

		tree.setChildren(null, [
			{
				element: 0, children: [
					{ element: 10 },
					{ element: 11 },
					{ element: 12 },
				]
			},
			{ element: 1 },
			{ element: 2 }
		]);

		assert.deepStrictEqual(getRowsTextContent(container), ['0', '10', '11', '12', '1', '2']);
	});

	test('compressed', () => {
		const container = document.createElement('div');
		container.style.width = '200px';
		container.style.height = '200px';

		const tree = ds.add(new CompressibleObjectTree<number>('test', container, new Delegate(), [new Renderer()]));
		tree.layout(200);

		tree.setChildren(null, [
			{
				element: 1, children: [{
					element: 11, children: [{
						element: 111, children: [
							{ element: 1111 },
							{ element: 1112 },
							{ element: 1113 },
						]
					}]
				}]
			}
		]);

		assert.deepStrictEqual(getRowsTextContent(container), ['1/11/111', '1111', '1112', '1113']);

		tree.setChildren(11, [
			{ element: 111 },
			{ element: 112 },
			{ element: 113 },
		]);

		assert.deepStrictEqual(getRowsTextContent(container), ['1/11', '111', '112', '113']);

		tree.setChildren(113, [
			{ element: 1131 }
		]);

		assert.deepStrictEqual(getRowsTextContent(container), ['1/11', '111', '112', '113/1131']);

		tree.setChildren(1131, [
			{ element: 1132 }
		]);

		assert.deepStrictEqual(getRowsTextContent(container), ['1/11', '111', '112', '113/1131/1132']);

		tree.setChildren(1131, [
			{ element: 1132 },
			{ element: 1133 },
		]);

		assert.deepStrictEqual(getRowsTextContent(container), ['1/11', '111', '112', '113/1131', '1132', '1133']);
	});

	test('enableCompression', () => {
		const container = document.createElement('div');
		container.style.width = '200px';
		container.style.height = '200px';

		const tree = ds.add(new CompressibleObjectTree<number>('test', container, new Delegate(), [new Renderer()]));
		tree.layout(200);

		tree.setChildren(null, [
			{
				element: 1, children: [{
					element: 11, children: [{
						element: 111, children: [
							{ element: 1111 },
							{ element: 1112 },
							{ element: 1113 },
						]
					}]
				}]
			}
		]);

		assert.deepStrictEqual(getRowsTextContent(container), ['1/11/111', '1111', '1112', '1113']);

		tree.updateOptions({ compressionEnabled: false });
		assert.deepStrictEqual(getRowsTextContent(container), ['1', '11', '111', '1111', '1112', '1113']);

		tree.updateOptions({ compressionEnabled: true });
		assert.deepStrictEqual(getRowsTextContent(container), ['1/11/111', '1111', '1112', '1113']);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/ui/tree/objectTreeModel.test.ts]---
Location: vscode-main/src/vs/base/test/browser/ui/tree/objectTreeModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ObjectTreeModel } from '../../../../browser/ui/tree/objectTreeModel.js';
import { ITreeFilter, ITreeModel, ITreeNode, ObjectTreeElementCollapseState, TreeVisibility } from '../../../../browser/ui/tree/tree.js';
import { timeout } from '../../../../common/async.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../common/utils.js';
import { IDisposable } from '../../../../common/lifecycle.js';

function bindListToModel<T>(list: ITreeNode<T>[], model: ITreeModel<T, any, any>): IDisposable {
	return model.onDidSpliceRenderedNodes(({ start, deleteCount, elements }) => {
		list.splice(start, deleteCount, ...elements);
	});
}

function toArray<T>(list: ITreeNode<T>[]): T[] {
	return list.map(i => i.element);
}

suite('ObjectTreeModel', function () {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('ctor', () => {
		const list: ITreeNode<number>[] = [];
		const model = new ObjectTreeModel<number>('test');
		const disposable = bindListToModel(list, model);

		assert(model);
		assert.strictEqual(list.length, 0);
		assert.strictEqual(model.size, 0);

		disposable.dispose();
	});

	test('flat', () => {
		const list: ITreeNode<number>[] = [];
		const model = new ObjectTreeModel<number>('test');
		const disposable = bindListToModel(list, model);

		model.setChildren(null, [
			{ element: 0 },
			{ element: 1 },
			{ element: 2 }
		]);

		assert.deepStrictEqual(toArray(list), [0, 1, 2]);
		assert.strictEqual(model.size, 3);

		model.setChildren(null, [
			{ element: 3 },
			{ element: 4 },
			{ element: 5 },
		]);

		assert.deepStrictEqual(toArray(list), [3, 4, 5]);
		assert.strictEqual(model.size, 3);

		model.setChildren(null);
		assert.deepStrictEqual(toArray(list), []);
		assert.strictEqual(model.size, 0);

		disposable.dispose();
	});

	test('nested', () => {
		const list: ITreeNode<number>[] = [];
		const model = new ObjectTreeModel<number>('test');
		const disposable = bindListToModel(list, model);

		model.setChildren(null, [
			{
				element: 0, children: [
					{ element: 10 },
					{ element: 11 },
					{ element: 12 },
				]
			},
			{ element: 1 },
			{ element: 2 }
		]);

		assert.deepStrictEqual(toArray(list), [0, 10, 11, 12, 1, 2]);
		assert.strictEqual(model.size, 6);

		model.setChildren(12, [
			{ element: 120 },
			{ element: 121 }
		]);

		assert.deepStrictEqual(toArray(list), [0, 10, 11, 12, 120, 121, 1, 2]);
		assert.strictEqual(model.size, 8);

		model.setChildren(0);
		assert.deepStrictEqual(toArray(list), [0, 1, 2]);
		assert.strictEqual(model.size, 3);

		model.setChildren(null);
		assert.deepStrictEqual(toArray(list), []);
		assert.strictEqual(model.size, 0);

		disposable.dispose();
	});

	test('setChildren on collapsed node', () => {
		const list: ITreeNode<number>[] = [];
		const model = new ObjectTreeModel<number>('test');
		const disposable = bindListToModel(list, model);

		model.setChildren(null, [
			{ element: 0, collapsed: true }
		]);

		assert.deepStrictEqual(toArray(list), [0]);

		model.setChildren(0, [
			{ element: 1 },
			{ element: 2 }
		]);

		assert.deepStrictEqual(toArray(list), [0]);

		model.setCollapsed(0, false);
		assert.deepStrictEqual(toArray(list), [0, 1, 2]);

		disposable.dispose();
	});

	test('setChildren on expanded, unrevealed node', () => {
		const list: ITreeNode<number>[] = [];
		const model = new ObjectTreeModel<number>('test');
		const disposable = bindListToModel(list, model);

		model.setChildren(null, [
			{
				element: 1, collapsed: true, children: [
					{ element: 11, collapsed: false }
				]
			},
			{ element: 2 }
		]);

		assert.deepStrictEqual(toArray(list), [1, 2]);

		model.setChildren(11, [
			{ element: 111 },
			{ element: 112 }
		]);

		assert.deepStrictEqual(toArray(list), [1, 2]);

		model.setCollapsed(1, false);
		assert.deepStrictEqual(toArray(list), [1, 11, 111, 112, 2]);

		disposable.dispose();
	});

	test('collapse state is preserved with strict identity', () => {
		const list: ITreeNode<string>[] = [];
		const model = new ObjectTreeModel<string>('test', { collapseByDefault: true });
		const data = [{ element: 'father', children: [{ element: 'child' }] }];
		const disposable = bindListToModel(list, model);

		model.setChildren(null, data);
		assert.deepStrictEqual(toArray(list), ['father']);

		model.setCollapsed('father', false);
		assert.deepStrictEqual(toArray(list), ['father', 'child']);

		model.setChildren(null, data);
		assert.deepStrictEqual(toArray(list), ['father', 'child']);

		const data2 = [{ element: 'father', children: [{ element: 'child' }] }, { element: 'uncle' }];
		model.setChildren(null, data2);
		assert.deepStrictEqual(toArray(list), ['father', 'child', 'uncle']);

		model.setChildren(null, [{ element: 'uncle' }]);
		assert.deepStrictEqual(toArray(list), ['uncle']);

		model.setChildren(null, data2);
		assert.deepStrictEqual(toArray(list), ['father', 'uncle']);

		model.setChildren(null, data);
		assert.deepStrictEqual(toArray(list), ['father']);

		disposable.dispose();
	});

	test('collapse state can be optionally preserved with strict identity', () => {
		const list: ITreeNode<string>[] = [];
		const model = new ObjectTreeModel<string>('test', { collapseByDefault: true });
		const data = [{ element: 'father', collapsed: ObjectTreeElementCollapseState.PreserveOrExpanded, children: [{ element: 'child' }] }];
		const disposable = bindListToModel(list, model);

		model.setChildren(null, data);
		assert.deepStrictEqual(toArray(list), ['father', 'child']);

		model.setCollapsed('father', true);
		assert.deepStrictEqual(toArray(list), ['father']);

		model.setChildren(null, data);
		assert.deepStrictEqual(toArray(list), ['father']);

		model.setCollapsed('father', false);
		assert.deepStrictEqual(toArray(list), ['father', 'child']);

		model.setChildren(null, data);
		assert.deepStrictEqual(toArray(list), ['father', 'child']);

		disposable.dispose();
	});

	test('sorter', () => {
		const compare: (a: string, b: string) => number = (a, b) => a < b ? -1 : 1;

		const list: ITreeNode<string>[] = [];
		const model = new ObjectTreeModel<string>('test', { sorter: { compare(a, b) { return compare(a, b); } } });
		const data = [
			{ element: 'cars', children: [{ element: 'sedan' }, { element: 'convertible' }, { element: 'compact' }] },
			{ element: 'airplanes', children: [{ element: 'passenger' }, { element: 'jet' }] },
			{ element: 'bicycles', children: [{ element: 'dutch' }, { element: 'mountain' }, { element: 'electric' }] },
		];
		const disposable = bindListToModel(list, model);

		model.setChildren(null, data);
		assert.deepStrictEqual(toArray(list), ['airplanes', 'jet', 'passenger', 'bicycles', 'dutch', 'electric', 'mountain', 'cars', 'compact', 'convertible', 'sedan']);

		disposable.dispose();
	});

	test('resort', () => {
		let compare: (a: string, b: string) => number = () => 0;

		const list: ITreeNode<string>[] = [];
		const model = new ObjectTreeModel<string>('test', { sorter: { compare(a, b) { return compare(a, b); } } });
		const data = [
			{ element: 'cars', children: [{ element: 'sedan' }, { element: 'convertible' }, { element: 'compact' }] },
			{ element: 'airplanes', children: [{ element: 'passenger' }, { element: 'jet' }] },
			{ element: 'bicycles', children: [{ element: 'dutch' }, { element: 'mountain' }, { element: 'electric' }] },
		];
		const disposable = bindListToModel(list, model);

		model.setChildren(null, data);
		assert.deepStrictEqual(toArray(list), ['cars', 'sedan', 'convertible', 'compact', 'airplanes', 'passenger', 'jet', 'bicycles', 'dutch', 'mountain', 'electric']);

		// lexicographical
		compare = (a, b) => a < b ? -1 : 1;

		// non-recursive
		model.resort(null, false);
		assert.deepStrictEqual(toArray(list), ['airplanes', 'passenger', 'jet', 'bicycles', 'dutch', 'mountain', 'electric', 'cars', 'sedan', 'convertible', 'compact']);

		// recursive
		model.resort();
		assert.deepStrictEqual(toArray(list), ['airplanes', 'jet', 'passenger', 'bicycles', 'dutch', 'electric', 'mountain', 'cars', 'compact', 'convertible', 'sedan']);

		// reverse
		compare = (a, b) => a < b ? 1 : -1;

		// scoped
		model.resort('cars');
		assert.deepStrictEqual(toArray(list), ['airplanes', 'jet', 'passenger', 'bicycles', 'dutch', 'electric', 'mountain', 'cars', 'sedan', 'convertible', 'compact']);

		// recursive
		model.resort();
		assert.deepStrictEqual(toArray(list), ['cars', 'sedan', 'convertible', 'compact', 'bicycles', 'mountain', 'electric', 'dutch', 'airplanes', 'passenger', 'jet']);

		disposable.dispose();
	});

	test('expandTo', () => {
		const list: ITreeNode<number>[] = [];
		const model = new ObjectTreeModel<number>('test', { collapseByDefault: true });
		const disposable = bindListToModel(list, model);

		model.setChildren(null, [
			{
				element: 0, children: [
					{ element: 10, children: [{ element: 100, children: [{ element: 1000 }] }] },
					{ element: 11 },
					{ element: 12 },
				]
			},
			{ element: 1 },
			{ element: 2 }
		]);

		assert.deepStrictEqual(toArray(list), [0, 1, 2]);
		model.expandTo(1000);
		assert.deepStrictEqual(toArray(list), [0, 10, 100, 1000, 11, 12, 1, 2]);

		disposable.dispose();
	});

	test('issue #95641', async () => {
		const list: ITreeNode<string>[] = [];
		let fn = (_: string) => true;
		const filter = new class implements ITreeFilter<string> {
			filter(element: string, parentVisibility: TreeVisibility): TreeVisibility {
				if (element === 'file') {
					return TreeVisibility.Recurse;
				}

				return fn(element) ? TreeVisibility.Visible : parentVisibility;
			}
		};
		const model = new ObjectTreeModel<string>('test', { filter });
		const disposable = bindListToModel(list, model);

		model.setChildren(null, [{ element: 'file', children: [{ element: 'hello' }] }]);
		assert.deepStrictEqual(toArray(list), ['file', 'hello']);

		fn = (el: string) => el === 'world';
		model.refilter();
		assert.deepStrictEqual(toArray(list), []);

		model.setChildren('file', [{ element: 'world' }]);
		await timeout(0); // wait for refilter microtask
		assert.deepStrictEqual(toArray(list), ['file', 'world']);

		model.setChildren('file', [{ element: 'hello' }]);
		await timeout(0); // wait for refilter microtask
		assert.deepStrictEqual(toArray(list), []);

		model.setChildren('file', [{ element: 'world' }]);
		await timeout(0); // wait for refilter microtask
		assert.deepStrictEqual(toArray(list), ['file', 'world']);

		disposable.dispose();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/arrays.test.ts]---
Location: vscode-main/src/vs/base/test/common/arrays.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import * as arrays from '../../common/arrays.js';
import * as arraysFind from '../../common/arraysFind.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('Arrays', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('removeFastWithoutKeepingOrder', () => {
		const array = [1, 4, 5, 7, 55, 59, 60, 61, 64, 69];
		arrays.removeFastWithoutKeepingOrder(array, 1);
		assert.deepStrictEqual(array, [1, 69, 5, 7, 55, 59, 60, 61, 64]);

		arrays.removeFastWithoutKeepingOrder(array, 0);
		assert.deepStrictEqual(array, [64, 69, 5, 7, 55, 59, 60, 61]);

		arrays.removeFastWithoutKeepingOrder(array, 7);
		assert.deepStrictEqual(array, [64, 69, 5, 7, 55, 59, 60]);
	});

	test('findFirst', () => {
		const array = [1, 4, 5, 7, 55, 59, 60, 61, 64, 69];

		let idx = arraysFind.findFirstIdxMonotonousOrArrLen(array, e => e >= 0);
		assert.strictEqual(array[idx], 1);

		idx = arraysFind.findFirstIdxMonotonousOrArrLen(array, e => e > 1);
		assert.strictEqual(array[idx], 4);

		idx = arraysFind.findFirstIdxMonotonousOrArrLen(array, e => e >= 8);
		assert.strictEqual(array[idx], 55);

		idx = arraysFind.findFirstIdxMonotonousOrArrLen(array, e => e >= 61);
		assert.strictEqual(array[idx], 61);

		idx = arraysFind.findFirstIdxMonotonousOrArrLen(array, e => e >= 69);
		assert.strictEqual(array[idx], 69);

		idx = arraysFind.findFirstIdxMonotonousOrArrLen(array, e => e >= 70);
		assert.strictEqual(idx, array.length);

		idx = arraysFind.findFirstIdxMonotonousOrArrLen([], e => e >= 0);
		assert.strictEqual(array[idx], 1);
	});

	test('quickSelect', () => {

		function assertMedian(expexted: number, data: number[], nth: number = Math.floor(data.length / 2)) {
			const compare = (a: number, b: number) => a - b;
			const actual1 = arrays.quickSelect(nth, data, compare);
			assert.strictEqual(actual1, expexted);

			const actual2 = data.slice().sort(compare)[nth];
			assert.strictEqual(actual2, expexted);
		}

		assertMedian(5, [9, 1, 0, 2, 3, 4, 6, 8, 7, 10, 5]);
		assertMedian(8, [9, 1, 0, 2, 3, 4, 6, 8, 7, 10, 5], 8);
		assertMedian(8, [13, 4, 8]);
		assertMedian(4, [13, 4, 8, 4, 4]);
		assertMedian(13, [13, 4, 8], 2);
	});

	test('sortedDiff', () => {
		function compare(a: number, b: number): number {
			return a - b;
		}

		let d = arrays.sortedDiff([1, 2, 4], [], compare);
		assert.deepStrictEqual(d, [
			{ start: 0, deleteCount: 3, toInsert: [] }
		]);

		d = arrays.sortedDiff([], [1, 2, 4], compare);
		assert.deepStrictEqual(d, [
			{ start: 0, deleteCount: 0, toInsert: [1, 2, 4] }
		]);

		d = arrays.sortedDiff([1, 2, 4], [1, 2, 4], compare);
		assert.deepStrictEqual(d, []);

		d = arrays.sortedDiff([1, 2, 4], [2, 3, 4, 5], compare);
		assert.deepStrictEqual(d, [
			{ start: 0, deleteCount: 1, toInsert: [] },
			{ start: 2, deleteCount: 0, toInsert: [3] },
			{ start: 3, deleteCount: 0, toInsert: [5] },
		]);

		d = arrays.sortedDiff([2, 3, 4, 5], [1, 2, 4], compare);
		assert.deepStrictEqual(d, [
			{ start: 0, deleteCount: 0, toInsert: [1] },
			{ start: 1, deleteCount: 1, toInsert: [] },
			{ start: 3, deleteCount: 1, toInsert: [] },
		]);

		d = arrays.sortedDiff([1, 3, 5, 7], [5, 9, 11], compare);
		assert.deepStrictEqual(d, [
			{ start: 0, deleteCount: 2, toInsert: [] },
			{ start: 3, deleteCount: 1, toInsert: [9, 11] }
		]);

		d = arrays.sortedDiff([1, 3, 7], [5, 9, 11], compare);
		assert.deepStrictEqual(d, [
			{ start: 0, deleteCount: 3, toInsert: [5, 9, 11] }
		]);
	});

	test('delta sorted arrays', function () {
		function compare(a: number, b: number): number {
			return a - b;
		}

		let d = arrays.delta([1, 2, 4], [], compare);
		assert.deepStrictEqual(d.removed, [1, 2, 4]);
		assert.deepStrictEqual(d.added, []);

		d = arrays.delta([], [1, 2, 4], compare);
		assert.deepStrictEqual(d.removed, []);
		assert.deepStrictEqual(d.added, [1, 2, 4]);

		d = arrays.delta([1, 2, 4], [1, 2, 4], compare);
		assert.deepStrictEqual(d.removed, []);
		assert.deepStrictEqual(d.added, []);

		d = arrays.delta([1, 2, 4], [2, 3, 4, 5], compare);
		assert.deepStrictEqual(d.removed, [1]);
		assert.deepStrictEqual(d.added, [3, 5]);

		d = arrays.delta([2, 3, 4, 5], [1, 2, 4], compare);
		assert.deepStrictEqual(d.removed, [3, 5]);
		assert.deepStrictEqual(d.added, [1]);

		d = arrays.delta([1, 3, 5, 7], [5, 9, 11], compare);
		assert.deepStrictEqual(d.removed, [1, 3, 7]);
		assert.deepStrictEqual(d.added, [9, 11]);

		d = arrays.delta([1, 3, 7], [5, 9, 11], compare);
		assert.deepStrictEqual(d.removed, [1, 3, 7]);
		assert.deepStrictEqual(d.added, [5, 9, 11]);
	});

	test('binarySearch', () => {
		function compare(a: number, b: number): number {
			return a - b;
		}
		const array = [1, 4, 5, 7, 55, 59, 60, 61, 64, 69];

		assert.strictEqual(arrays.binarySearch(array, 1, compare), 0);
		assert.strictEqual(arrays.binarySearch(array, 5, compare), 2);

		// insertion point
		assert.strictEqual(arrays.binarySearch(array, 0, compare), ~0);
		assert.strictEqual(arrays.binarySearch(array, 6, compare), ~3);
		assert.strictEqual(arrays.binarySearch(array, 70, compare), ~10);
	});

	test('binarySearch2', () => {
		function compareTo(key: number) {
			return (index: number) => {
				return array[index] - key;
			};
		}
		const array = [1, 4, 5, 7, 55, 59, 60, 61, 64, 69];

		assert.strictEqual(arrays.binarySearch2(10, compareTo(1)), 0);
		assert.strictEqual(arrays.binarySearch2(10, compareTo(5)), 2);

		// insertion point
		assert.strictEqual(arrays.binarySearch2(10, compareTo(0)), ~0);
		assert.strictEqual(arrays.binarySearch2(10, compareTo(6)), ~3);
		assert.strictEqual(arrays.binarySearch2(10, compareTo(70)), ~10);
		assert.strictEqual(arrays.binarySearch2(2, compareTo(5)), ~2);
	});

	test('distinct', () => {
		function compare(a: string): string {
			return a;
		}

		assert.deepStrictEqual(arrays.distinct(['32', '4', '5'], compare), ['32', '4', '5']);
		assert.deepStrictEqual(arrays.distinct(['32', '4', '5', '4'], compare), ['32', '4', '5']);
		assert.deepStrictEqual(arrays.distinct(['32', 'constructor', '5', '1'], compare), ['32', 'constructor', '5', '1']);
		assert.deepStrictEqual(arrays.distinct(['32', 'constructor', 'proto', 'proto', 'constructor'], compare), ['32', 'constructor', 'proto']);
		assert.deepStrictEqual(arrays.distinct(['32', '4', '5', '32', '4', '5', '32', '4', '5', '5'], compare), ['32', '4', '5']);
	});

	test('top', () => {
		const cmp = (a: number, b: number) => {
			assert.strictEqual(typeof a, 'number', 'typeof a');
			assert.strictEqual(typeof b, 'number', 'typeof b');
			return a - b;
		};

		assert.deepStrictEqual(arrays.top([], cmp, 1), []);
		assert.deepStrictEqual(arrays.top([1], cmp, 0), []);
		assert.deepStrictEqual(arrays.top([1, 2], cmp, 1), [1]);
		assert.deepStrictEqual(arrays.top([2, 1], cmp, 1), [1]);
		assert.deepStrictEqual(arrays.top([1, 3, 2], cmp, 2), [1, 2]);
		assert.deepStrictEqual(arrays.top([3, 2, 1], cmp, 3), [1, 2, 3]);
		assert.deepStrictEqual(arrays.top([4, 6, 2, 7, 8, 3, 5, 1], cmp, 3), [1, 2, 3]);
	});

	test('topAsync', async () => {
		const cmp = (a: number, b: number) => {
			assert.strictEqual(typeof a, 'number', 'typeof a');
			assert.strictEqual(typeof b, 'number', 'typeof b');
			return a - b;
		};

		await testTopAsync(cmp, 1);
		return testTopAsync(cmp, 2);
	});

	async function testTopAsync(cmp: any, m: number) {
		{
			const result = await arrays.topAsync([], cmp, 1, m);
			assert.deepStrictEqual(result, []);
		}
		{
			const result = await arrays.topAsync([1], cmp, 0, m);
			assert.deepStrictEqual(result, []);
		}
		{
			const result = await arrays.topAsync([1, 2], cmp, 1, m);
			assert.deepStrictEqual(result, [1]);
		}
		{
			const result = await arrays.topAsync([2, 1], cmp, 1, m);
			assert.deepStrictEqual(result, [1]);
		}
		{
			const result = await arrays.topAsync([1, 3, 2], cmp, 2, m);
			assert.deepStrictEqual(result, [1, 2]);
		}
		{
			const result = await arrays.topAsync([3, 2, 1], cmp, 3, m);
			assert.deepStrictEqual(result, [1, 2, 3]);
		}
		{
			const result = await arrays.topAsync([4, 6, 2, 7, 8, 3, 5, 1], cmp, 3, m);
			assert.deepStrictEqual(result, [1, 2, 3]);
		}
	}

	test('coalesce', () => {
		const a: Array<number | null> = arrays.coalesce([null, 1, null, 2, 3]);
		assert.strictEqual(a.length, 3);
		assert.strictEqual(a[0], 1);
		assert.strictEqual(a[1], 2);
		assert.strictEqual(a[2], 3);

		arrays.coalesce([null, 1, null, undefined, undefined, 2, 3]);
		assert.strictEqual(a.length, 3);
		assert.strictEqual(a[0], 1);
		assert.strictEqual(a[1], 2);
		assert.strictEqual(a[2], 3);

		let b: number[] = [];
		b[10] = 1;
		b[20] = 2;
		b[30] = 3;
		b = arrays.coalesce(b);
		assert.strictEqual(b.length, 3);
		assert.strictEqual(b[0], 1);
		assert.strictEqual(b[1], 2);
		assert.strictEqual(b[2], 3);

		let sparse: number[] = [];
		sparse[0] = 1;
		sparse[1] = 1;
		sparse[17] = 1;
		sparse[1000] = 1;
		sparse[1001] = 1;

		assert.strictEqual(sparse.length, 1002);

		sparse = arrays.coalesce(sparse);
		assert.strictEqual(sparse.length, 5);
	});

	test('coalesce - inplace', function () {
		let a: Array<number | null> = [null, 1, null, 2, 3];
		arrays.coalesceInPlace(a);
		assert.strictEqual(a.length, 3);
		assert.strictEqual(a[0], 1);
		assert.strictEqual(a[1], 2);
		assert.strictEqual(a[2], 3);

		a = [null, 1, null, undefined!, undefined!, 2, 3];
		arrays.coalesceInPlace(a);
		assert.strictEqual(a.length, 3);
		assert.strictEqual(a[0], 1);
		assert.strictEqual(a[1], 2);
		assert.strictEqual(a[2], 3);

		const b: number[] = [];
		b[10] = 1;
		b[20] = 2;
		b[30] = 3;
		arrays.coalesceInPlace(b);
		assert.strictEqual(b.length, 3);
		assert.strictEqual(b[0], 1);
		assert.strictEqual(b[1], 2);
		assert.strictEqual(b[2], 3);

		const sparse: number[] = [];
		sparse[0] = 1;
		sparse[1] = 1;
		sparse[17] = 1;
		sparse[1000] = 1;
		sparse[1001] = 1;

		assert.strictEqual(sparse.length, 1002);

		arrays.coalesceInPlace(sparse);
		assert.strictEqual(sparse.length, 5);
	});

	test('insert, remove', function () {
		const array: string[] = [];
		const remove = arrays.insert(array, 'foo');
		assert.strictEqual(array[0], 'foo');

		remove();
		assert.strictEqual(array.length, 0);
	});

	test('splice', function () {
		// negative start index, absolute value greater than the length
		let array = [1, 2, 3, 4, 5];
		arrays.splice(array, -6, 3, [6, 7]);
		assert.strictEqual(array.length, 4);
		assert.strictEqual(array[0], 6);
		assert.strictEqual(array[1], 7);
		assert.strictEqual(array[2], 4);
		assert.strictEqual(array[3], 5);

		// negative start index, absolute value less than the length
		array = [1, 2, 3, 4, 5];
		arrays.splice(array, -3, 3, [6, 7]);
		assert.strictEqual(array.length, 4);
		assert.strictEqual(array[0], 1);
		assert.strictEqual(array[1], 2);
		assert.strictEqual(array[2], 6);
		assert.strictEqual(array[3], 7);

		// Start index less than the length
		array = [1, 2, 3, 4, 5];
		arrays.splice(array, 3, 3, [6, 7]);
		assert.strictEqual(array.length, 5);
		assert.strictEqual(array[0], 1);
		assert.strictEqual(array[1], 2);
		assert.strictEqual(array[2], 3);
		assert.strictEqual(array[3], 6);
		assert.strictEqual(array[4], 7);

		// Start index greater than the length
		array = [1, 2, 3, 4, 5];
		arrays.splice(array, 6, 3, [6, 7]);
		assert.strictEqual(array.length, 7);
		assert.strictEqual(array[0], 1);
		assert.strictEqual(array[1], 2);
		assert.strictEqual(array[2], 3);
		assert.strictEqual(array[3], 4);
		assert.strictEqual(array[4], 5);
		assert.strictEqual(array[5], 6);
		assert.strictEqual(array[6], 7);
	});

	test('findMaxBy', () => {
		const array = [{ v: 3 }, { v: 5 }, { v: 2 }, { v: 2 }, { v: 2 }, { v: 5 }];

		assert.strictEqual(
			array.indexOf(arraysFind.findFirstMax(array, arrays.compareBy(v => v.v, arrays.numberComparator))!),
			1
		);
	});

	test('findLastMaxBy', () => {
		const array = [{ v: 3 }, { v: 5 }, { v: 2 }, { v: 2 }, { v: 2 }, { v: 5 }];

		assert.strictEqual(
			array.indexOf(arraysFind.findLastMax(array, arrays.compareBy(v => v.v, arrays.numberComparator))!),
			5
		);
	});

	test('findMinBy', () => {
		const array = [{ v: 3 }, { v: 5 }, { v: 2 }, { v: 2 }, { v: 2 }, { v: 5 }];

		assert.strictEqual(
			array.indexOf(arraysFind.findFirstMin(array, arrays.compareBy(v => v.v, arrays.numberComparator))!),
			2
		);
	});



	suite('ArrayQueue', () => {
		suite('takeWhile/takeFromEndWhile', () => {
			test('TakeWhile 1', () => {
				const queue1 = new arrays.ArrayQueue([9, 8, 1, 7, 6]);
				assert.deepStrictEqual(queue1.takeWhile(x => x > 5), [9, 8]);
				assert.deepStrictEqual(queue1.takeWhile(x => x < 7), [1]);
				assert.deepStrictEqual(queue1.takeWhile(x => true), [7, 6]);
			});

			test('TakeFromEndWhile 1', () => {
				const queue1 = new arrays.ArrayQueue([9, 8, 1, 7, 6]);
				assert.deepStrictEqual(queue1.takeFromEndWhile(x => x > 5), [7, 6]);
				assert.deepStrictEqual(queue1.takeFromEndWhile(x => x < 2), [1]);
				assert.deepStrictEqual(queue1.takeFromEndWhile(x => true), [9, 8]);
			});
		});

		suite('takeWhile/takeFromEndWhile monotonous', () => {
			function testMonotonous(array: number[], predicate: (a: number) => boolean) {
				function normalize(arr: number[]): number[] | null {
					if (arr.length === 0) {
						return null;
					}
					return arr;
				}

				const negatedPredicate = (a: number) => !predicate(a);

				{
					const queue1 = new arrays.ArrayQueue(array);
					assert.deepStrictEqual(queue1.takeWhile(predicate), normalize(array.filter(predicate)));
					assert.deepStrictEqual(queue1.length, array.length - array.filter(predicate).length);
					assert.deepStrictEqual(queue1.takeWhile(() => true), normalize(array.filter(negatedPredicate)));
				}
				{
					const queue3 = new arrays.ArrayQueue(array);
					assert.deepStrictEqual(queue3.takeFromEndWhile(negatedPredicate), normalize(array.filter(negatedPredicate)));
					assert.deepStrictEqual(queue3.length, array.length - array.filter(negatedPredicate).length);
					assert.deepStrictEqual(queue3.takeFromEndWhile(() => true), normalize(array.filter(predicate)));
				}
			}

			const array = [1, 1, 1, 2, 5, 5, 7, 8, 8];

			test('TakeWhile 1', () => testMonotonous(array, value => value <= 1));
			test('TakeWhile 2', () => testMonotonous(array, value => value < 5));
			test('TakeWhile 3', () => testMonotonous(array, value => value <= 5));
			test('TakeWhile 4', () => testMonotonous(array, value => true));
			test('TakeWhile 5', () => testMonotonous(array, value => false));

			const array2 = [1, 1, 1, 2, 5, 5, 7, 8, 8, 9, 9, 9, 9, 10, 10];

			test('TakeWhile 6', () => testMonotonous(array2, value => value < 10));
			test('TakeWhile 7', () => testMonotonous(array2, value => value < 7));
			test('TakeWhile 8', () => testMonotonous(array2, value => value < 5));

			test('TakeWhile Empty', () => testMonotonous([], value => value <= 5));
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/arraysFind.test.ts]---
Location: vscode-main/src/vs/base/test/common/arraysFind.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { MonotonousArray, findFirstMonotonous, findLastMonotonous } from '../../common/arraysFind.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('Arrays', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('findLastMonotonous', () => {
		const array = [1, 4, 5, 7, 55, 59, 60, 61, 64, 69];

		const result = findLastMonotonous(array, n => n <= 60);
		assert.strictEqual(result, 60);

		const result2 = findLastMonotonous(array, n => n <= 62);
		assert.strictEqual(result2, 61);

		const result3 = findLastMonotonous(array, n => n <= 1);
		assert.strictEqual(result3, 1);

		const result4 = findLastMonotonous(array, n => n <= 70);
		assert.strictEqual(result4, 69);

		const result5 = findLastMonotonous(array, n => n <= 0);
		assert.strictEqual(result5, undefined);
	});

	test('findFirstMonotonous', () => {
		const array = [1, 4, 5, 7, 55, 59, 60, 61, 64, 69];

		const result = findFirstMonotonous(array, n => n >= 60);
		assert.strictEqual(result, 60);

		const result2 = findFirstMonotonous(array, n => n >= 62);
		assert.strictEqual(result2, 64);

		const result3 = findFirstMonotonous(array, n => n >= 1);
		assert.strictEqual(result3, 1);

		const result4 = findFirstMonotonous(array, n => n >= 70);
		assert.strictEqual(result4, undefined);

		const result5 = findFirstMonotonous(array, n => n >= 0);
		assert.strictEqual(result5, 1);
	});

	test('MonotonousArray', () => {
		const arr = new MonotonousArray([1, 4, 5, 7, 55, 59, 60, 61, 64, 69]);
		assert.strictEqual(arr.findLastMonotonous(n => n <= 0), undefined);
		assert.strictEqual(arr.findLastMonotonous(n => n <= 0), undefined);
		assert.strictEqual(arr.findLastMonotonous(n => n <= 5), 5);
		assert.strictEqual(arr.findLastMonotonous(n => n <= 6), 5);
		assert.strictEqual(arr.findLastMonotonous(n => n <= 55), 55);
		assert.strictEqual(arr.findLastMonotonous(n => n <= 60), 60);
		assert.strictEqual(arr.findLastMonotonous(n => n <= 80), 69);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/assert.test.ts]---
Location: vscode-main/src/vs/base/test/common/assert.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ok, assert as commonAssert } from '../../common/assert.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';
import { CancellationError, ReadonlyError } from '../../common/errors.js';

suite('Assert', () => {
	test('ok', () => {
		assert.throws(function () {
			ok(false);
		});

		assert.throws(function () {
			ok(null);
		});

		assert.throws(function () {
			ok();
		});

		assert.throws(function () {
			ok(null, 'Foo Bar');
		}, function (e: Error) {
			return e.message.indexOf('Foo Bar') >= 0;
		});

		ok(true);
		ok('foo');
		ok({});
		ok(5);
	});

	suite('throws a provided error object', () => {
		test('generic error', () => {
			const originalError = new Error('Oh no!');

			try {
				commonAssert(
					false,
					originalError,
				);
			} catch (thrownError) {
				assert.strictEqual(
					thrownError,
					originalError,
					'Must throw the provided error instance.',
				);

				assert.strictEqual(
					thrownError.message,
					'Oh no!',
					'Must throw the provided error instance.',
				);
			}
		});

		test('cancellation error', () => {
			const originalError = new CancellationError();

			try {
				commonAssert(
					false,
					originalError,
				);
			} catch (thrownError) {
				assert.strictEqual(
					thrownError,
					originalError,
					'Must throw the provided error instance.',
				);
			}
		});

		test('readonly error', () => {
			const originalError = new ReadonlyError('World');

			try {
				commonAssert(
					false,
					originalError,
				);
			} catch (thrownError) {
				assert.strictEqual(
					thrownError,
					originalError,
					'Must throw the provided error instance.',
				);

				assert.strictEqual(
					thrownError.message,
					'World is read-only and cannot be changed',
					'Must throw the provided error instance.',
				);
			}
		});
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/assertHeap.ts]---
Location: vscode-main/src/vs/base/test/common/assertHeap.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


declare const __analyzeSnapshotInTests: (currentTest: string, classes: readonly string[]) => Promise<({ done: Promise<number[]>; file: string })>;

let currentTest: Mocha.Test | undefined;

const snapshotsToAssert: ({ counts: Promise<number[]>; file: string; test: string; opts: ISnapshotAssertOptions })[] = [];

setup(function () {
	currentTest = this.currentTest;
});

suiteTeardown(async () => {
	await Promise.all(snapshotsToAssert.map(async snap => {
		const counts = await snap.counts;

		const asserts = Object.entries(snap.opts.classes);
		if (asserts.length !== counts.length) {
			throw new Error(`expected class counts to equal assertions length for ${snap.test}`);
		}

		for (const [i, [name, doAssert]] of asserts.entries()) {
			try {
				doAssert(counts[i]);
			} catch (e) {
				throw new Error(`Unexpected number of ${name} instances (${counts[i]}) after "${snap.test}":\n\n${e.message}\n\nSnapshot saved at: ${snap.file}`);
			}
		}
	}));

	snapshotsToAssert.length = 0;
});

export interface ISnapshotAssertOptions {
	classes: Record<string, (count: number) => void>;
}

const snapshotMinTime = 20_000;

/**
 * Takes a heap snapshot, and asserts the state of classes in memory. This
 * works in Node and the Electron sandbox, but is a no-op in the browser.
 * Snapshots are process asynchronously and will report failures at the end of
 * the suite.
 *
 * This method should be used sparingly (e.g. once at the end of a suite to
 * ensure nothing leaked before), as gathering a heap snapshot is fairly
 * slow, at least until V8 11.5.130 (https://v8.dev/blog/speeding-up-v8-heap-snapshots).
 *
 * Takes options containing a mapping of class names, and assertion functions
 * to run on the number of retained instances of that class. For example:
 *
 * ```ts
 * assertSnapshot({
 *	classes: {
 *		ShouldNeverLeak: count => assert.strictEqual(count, 0),
 *		SomeSingleton: count => assert(count <= 1),
 *	}
 *});
 * ```
 */
export async function assertHeap(opts: ISnapshotAssertOptions) {
	if (!currentTest) {
		throw new Error('assertSnapshot can only be used when a test is running');
	}

	// snapshotting can take a moment, ensure the test timeout is decently long
	// so it doesn't immediately fail.
	if (currentTest.timeout() < snapshotMinTime) {
		currentTest.timeout(snapshotMinTime);
	}

	if (typeof __analyzeSnapshotInTests === 'undefined') {
		return; // running in browser, no-op
	}

	const { done, file } = await __analyzeSnapshotInTests(currentTest.fullTitle(), Object.keys(opts.classes));
	snapshotsToAssert.push({ counts: done, file, test: currentTest.fullTitle(), opts });
}
```

--------------------------------------------------------------------------------

````

---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 183
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 183 of 552)

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

---[FILE: src/vs/base/parts/storage/test/node/storage.integrationTest.ts]---
Location: vscode-main/src/vs/base/parts/storage/test/node/storage.integrationTest.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import { deepStrictEqual, ok, strictEqual } from 'assert';
import { tmpdir } from 'os';
import { timeout } from '../../../../common/async.js';
import { Emitter, Event } from '../../../../common/event.js';
import { join } from '../../../../common/path.js';
import { isWindows } from '../../../../common/platform.js';
import { URI } from '../../../../common/uri.js';
import { generateUuid } from '../../../../common/uuid.js';
import { Promises } from '../../../../node/pfs.js';
import { isStorageItemsChangeEvent, IStorageDatabase, IStorageItemsChangeEvent, Storage } from '../../common/storage.js';
import { ISQLiteStorageDatabaseOptions, SQLiteStorageDatabase } from '../../node/storage.js';
import { runWithFakedTimers } from '../../../../test/common/timeTravelScheduler.js';
import { flakySuite, getRandomTestPath } from '../../../../test/node/testUtils.js';

flakySuite('Storage Library', function () {

	let testDir: string;

	setup(function () {
		testDir = getRandomTestPath(tmpdir(), 'vsctests', 'storagelibrary');

		return fs.promises.mkdir(testDir, { recursive: true });
	});

	teardown(function () {
		return Promises.rm(testDir);
	});

	test('objects', () => {
		return runWithFakedTimers({}, async function () {
			const storage = new Storage(new SQLiteStorageDatabase(join(testDir, 'storage.db')));

			await storage.init();

			ok(!storage.getObject('foo'));
			const uri = URI.file('path/to/folder');
			storage.set('foo', { 'bar': uri });
			deepStrictEqual(storage.getObject('foo'), { 'bar': uri });

			await storage.close();
		});
	});

	test('basics', () => {
		return runWithFakedTimers({}, async function () {
			const storage = new Storage(new SQLiteStorageDatabase(join(testDir, 'storage.db')));

			await storage.init();

			// Empty fallbacks
			strictEqual(storage.get('foo', 'bar'), 'bar');
			strictEqual(storage.getNumber('foo', 55), 55);
			strictEqual(storage.getBoolean('foo', true), true);
			deepStrictEqual(storage.getObject('foo', { 'bar': 'baz' }), { 'bar': 'baz' });

			let changes = new Set<string>();
			storage.onDidChangeStorage(e => {
				changes.add(e.key);
			});

			await storage.whenFlushed(); // returns immediately when no pending updates

			// Simple updates
			const set1Promise = storage.set('bar', 'foo');
			const set2Promise = storage.set('barNumber', 55);
			const set3Promise = storage.set('barBoolean', true);
			const set4Promise = storage.set('barObject', { 'bar': 'baz' });

			let flushPromiseResolved = false;
			storage.whenFlushed().then(() => flushPromiseResolved = true);

			strictEqual(storage.get('bar'), 'foo');
			strictEqual(storage.getNumber('barNumber'), 55);
			strictEqual(storage.getBoolean('barBoolean'), true);
			deepStrictEqual(storage.getObject('barObject'), { 'bar': 'baz' });

			strictEqual(changes.size, 4);
			ok(changes.has('bar'));
			ok(changes.has('barNumber'));
			ok(changes.has('barBoolean'));
			ok(changes.has('barObject'));

			let setPromiseResolved = false;
			await Promise.all([set1Promise, set2Promise, set3Promise, set4Promise]).then(() => setPromiseResolved = true);
			strictEqual(setPromiseResolved, true);
			strictEqual(flushPromiseResolved, true);

			changes = new Set<string>();

			// Does not trigger events for same update values
			storage.set('bar', 'foo');
			storage.set('barNumber', 55);
			storage.set('barBoolean', true);
			storage.set('barObject', { 'bar': 'baz' });
			strictEqual(changes.size, 0);

			// Simple deletes
			const delete1Promise = storage.delete('bar');
			const delete2Promise = storage.delete('barNumber');
			const delete3Promise = storage.delete('barBoolean');
			const delete4Promise = storage.delete('barObject');

			ok(!storage.get('bar'));
			ok(!storage.getNumber('barNumber'));
			ok(!storage.getBoolean('barBoolean'));
			ok(!storage.getObject('barObject'));

			strictEqual(changes.size, 4);
			ok(changes.has('bar'));
			ok(changes.has('barNumber'));
			ok(changes.has('barBoolean'));
			ok(changes.has('barObject'));

			changes = new Set<string>();

			// Does not trigger events for same delete values
			storage.delete('bar');
			storage.delete('barNumber');
			storage.delete('barBoolean');
			storage.delete('barObject');
			strictEqual(changes.size, 0);

			let deletePromiseResolved = false;
			await Promise.all([delete1Promise, delete2Promise, delete3Promise, delete4Promise]).then(() => deletePromiseResolved = true);
			strictEqual(deletePromiseResolved, true);

			await storage.close();
			await storage.close(); // it is ok to call this multiple times
		});
	});

	test('external changes', () => {
		return runWithFakedTimers({}, async function () {
			class TestSQLiteStorageDatabase extends SQLiteStorageDatabase {
				private readonly _onDidChangeItemsExternal = new Emitter<IStorageItemsChangeEvent>();
				override get onDidChangeItemsExternal(): Event<IStorageItemsChangeEvent> { return this._onDidChangeItemsExternal.event; }

				fireDidChangeItemsExternal(event: IStorageItemsChangeEvent): void {
					this._onDidChangeItemsExternal.fire(event);
				}
			}

			const database = new TestSQLiteStorageDatabase(join(testDir, 'storage.db'));
			const storage = new Storage(database);

			const changes = new Set<string>();
			storage.onDidChangeStorage(e => {
				changes.add(e.key);
			});

			await storage.init();

			await storage.set('foo', 'bar');
			ok(changes.has('foo'));
			changes.clear();

			// Nothing happens if changing to same value
			const changed = new Map<string, string>();
			changed.set('foo', 'bar');
			database.fireDidChangeItemsExternal({ changed });
			strictEqual(changes.size, 0);

			// Change is accepted if valid
			changed.set('foo', 'bar1');
			database.fireDidChangeItemsExternal({ changed });
			ok(changes.has('foo'));
			strictEqual(storage.get('foo'), 'bar1');
			changes.clear();

			// Delete is accepted
			const deleted = new Set<string>(['foo']);
			database.fireDidChangeItemsExternal({ deleted });
			ok(changes.has('foo'));
			strictEqual(storage.get('foo', undefined), undefined);
			changes.clear();

			// Nothing happens if changing to same value
			database.fireDidChangeItemsExternal({ deleted });
			strictEqual(changes.size, 0);

			strictEqual(isStorageItemsChangeEvent({ changed }), true);
			strictEqual(isStorageItemsChangeEvent({ deleted }), true);
			strictEqual(isStorageItemsChangeEvent({ changed, deleted }), true);
			strictEqual(isStorageItemsChangeEvent(undefined), false);
			strictEqual(isStorageItemsChangeEvent({ changed: 'yes', deleted: false }), false);

			await storage.close();
		});
	});

	test('close flushes data', async () => {
		let storage = new Storage(new SQLiteStorageDatabase(join(testDir, 'storage.db')));
		await storage.init();

		const set1Promise = storage.set('foo', 'bar');
		const set2Promise = storage.set('bar', 'foo');

		let flushPromiseResolved = false;
		storage.whenFlushed().then(() => flushPromiseResolved = true);

		strictEqual(storage.get('foo'), 'bar');
		strictEqual(storage.get('bar'), 'foo');

		let setPromiseResolved = false;
		Promise.all([set1Promise, set2Promise]).then(() => setPromiseResolved = true);

		await storage.close();

		strictEqual(setPromiseResolved, true);
		strictEqual(flushPromiseResolved, true);

		storage = new Storage(new SQLiteStorageDatabase(join(testDir, 'storage.db')));
		await storage.init();

		strictEqual(storage.get('foo'), 'bar');
		strictEqual(storage.get('bar'), 'foo');

		await storage.close();

		storage = new Storage(new SQLiteStorageDatabase(join(testDir, 'storage.db')));
		await storage.init();

		const delete1Promise = storage.delete('foo');
		const delete2Promise = storage.delete('bar');

		ok(!storage.get('foo'));
		ok(!storage.get('bar'));

		let deletePromiseResolved = false;
		Promise.all([delete1Promise, delete2Promise]).then(() => deletePromiseResolved = true);

		await storage.close();

		strictEqual(deletePromiseResolved, true);

		storage = new Storage(new SQLiteStorageDatabase(join(testDir, 'storage.db')));
		await storage.init();

		ok(!storage.get('foo'));
		ok(!storage.get('bar'));

		await storage.close();
	});

	test('explicit flush', async () => {
		const storage = new Storage(new SQLiteStorageDatabase(join(testDir, 'storage.db')));
		await storage.init();

		storage.set('foo', 'bar');
		storage.set('bar', 'foo');

		let flushPromiseResolved = false;
		storage.whenFlushed().then(() => flushPromiseResolved = true);

		strictEqual(flushPromiseResolved, false);

		await storage.flush(0);

		strictEqual(flushPromiseResolved, true);

		await storage.close();
	});

	test('conflicting updates', () => {
		return runWithFakedTimers({}, async function () {
			const storage = new Storage(new SQLiteStorageDatabase(join(testDir, 'storage.db')));
			await storage.init();

			let changes = new Set<string>();
			storage.onDidChangeStorage(e => {
				changes.add(e.key);
			});

			const set1Promise = storage.set('foo', 'bar1');
			const set2Promise = storage.set('foo', 'bar2');
			const set3Promise = storage.set('foo', 'bar3');

			let flushPromiseResolved = false;
			storage.whenFlushed().then(() => flushPromiseResolved = true);

			strictEqual(storage.get('foo'), 'bar3');
			strictEqual(changes.size, 1);
			ok(changes.has('foo'));

			let setPromiseResolved = false;
			await Promise.all([set1Promise, set2Promise, set3Promise]).then(() => setPromiseResolved = true);
			ok(setPromiseResolved);
			ok(flushPromiseResolved);

			changes = new Set<string>();

			const set4Promise = storage.set('bar', 'foo');
			const delete1Promise = storage.delete('bar');

			ok(!storage.get('bar'));

			strictEqual(changes.size, 1);
			ok(changes.has('bar'));

			let setAndDeletePromiseResolved = false;
			await Promise.all([set4Promise, delete1Promise]).then(() => setAndDeletePromiseResolved = true);
			ok(setAndDeletePromiseResolved);

			await storage.close();
		});
	});

	test('corrupt DB recovers', async () => {
		return runWithFakedTimers({}, async function () {
			const storageFile = join(testDir, 'storage.db');

			let storage = new Storage(new SQLiteStorageDatabase(storageFile));
			await storage.init();

			await storage.set('bar', 'foo');

			await Promises.writeFile(storageFile, 'This is a broken DB');

			await storage.set('foo', 'bar');

			strictEqual(storage.get('bar'), 'foo');
			strictEqual(storage.get('foo'), 'bar');

			await storage.close();

			storage = new Storage(new SQLiteStorageDatabase(storageFile));
			await storage.init();

			strictEqual(storage.get('bar'), 'foo');
			strictEqual(storage.get('foo'), 'bar');

			await storage.close();
		});
	});
});

flakySuite('SQLite Storage Library', function () {

	function toSet(elements: string[]): Set<string> {
		const set = new Set<string>();
		elements.forEach(element => set.add(element));

		return set;
	}

	let testdir: string;

	setup(function () {
		testdir = getRandomTestPath(tmpdir(), 'vsctests', 'storagelibrary');

		return fs.promises.mkdir(testdir, { recursive: true });
	});

	teardown(function () {
		return Promises.rm(testdir);
	});

	async function testDBBasics(path: string, logError?: (error: Error | string) => void) {
		let options!: ISQLiteStorageDatabaseOptions;
		if (logError) {
			options = {
				logging: {
					logError
				}
			};
		}

		const storage = new SQLiteStorageDatabase(path, options);

		const items = new Map<string, string>();
		items.set('foo', 'bar');
		items.set('some/foo/path', 'some/bar/path');
		items.set(JSON.stringify({ foo: 'bar' }), JSON.stringify({ bar: 'foo' }));

		let storedItems = await storage.getItems();
		strictEqual(storedItems.size, 0);

		await storage.updateItems({ insert: items });

		storedItems = await storage.getItems();
		strictEqual(storedItems.size, items.size);
		strictEqual(storedItems.get('foo'), 'bar');
		strictEqual(storedItems.get('some/foo/path'), 'some/bar/path');
		strictEqual(storedItems.get(JSON.stringify({ foo: 'bar' })), JSON.stringify({ bar: 'foo' }));

		await storage.updateItems({ delete: toSet(['foo']) });
		storedItems = await storage.getItems();
		strictEqual(storedItems.size, items.size - 1);
		ok(!storedItems.has('foo'));
		strictEqual(storedItems.get('some/foo/path'), 'some/bar/path');
		strictEqual(storedItems.get(JSON.stringify({ foo: 'bar' })), JSON.stringify({ bar: 'foo' }));

		await storage.updateItems({ insert: items });
		storedItems = await storage.getItems();
		strictEqual(storedItems.size, items.size);
		strictEqual(storedItems.get('foo'), 'bar');
		strictEqual(storedItems.get('some/foo/path'), 'some/bar/path');
		strictEqual(storedItems.get(JSON.stringify({ foo: 'bar' })), JSON.stringify({ bar: 'foo' }));

		const itemsChange = new Map<string, string>();
		itemsChange.set('foo', 'otherbar');
		await storage.updateItems({ insert: itemsChange });

		storedItems = await storage.getItems();
		strictEqual(storedItems.get('foo'), 'otherbar');

		await storage.updateItems({ delete: toSet(['foo', 'bar', 'some/foo/path', JSON.stringify({ foo: 'bar' })]) });
		storedItems = await storage.getItems();
		strictEqual(storedItems.size, 0);

		await storage.updateItems({ insert: items, delete: toSet(['foo', 'some/foo/path', 'other']) });
		storedItems = await storage.getItems();
		strictEqual(storedItems.size, 1);
		strictEqual(storedItems.get(JSON.stringify({ foo: 'bar' })), JSON.stringify({ bar: 'foo' }));

		await storage.updateItems({ delete: toSet([JSON.stringify({ foo: 'bar' })]) });
		storedItems = await storage.getItems();
		strictEqual(storedItems.size, 0);

		let recoveryCalled = false;
		await storage.close(() => {
			recoveryCalled = true;

			return new Map();
		});

		strictEqual(recoveryCalled, false);
	}

	test('basics', async () => {
		await testDBBasics(join(testdir, 'storage.db'));
	});

	test('basics (open multiple times)', async () => {
		await testDBBasics(join(testdir, 'storage.db'));
		await testDBBasics(join(testdir, 'storage.db'));
	});

	test('basics (corrupt DB falls back to empty DB)', async () => {
		const corruptDBPath = join(testdir, 'broken.db');
		await Promises.writeFile(corruptDBPath, 'This is a broken DB');

		let expectedError: Error | string | undefined = undefined;
		await testDBBasics(corruptDBPath, error => {
			expectedError = error;
		});

		ok(expectedError);
	});

	test('basics (corrupt DB restores from previous backup)', async () => {
		const storagePath = join(testdir, 'storage.db');
		let storage = new SQLiteStorageDatabase(storagePath);

		const items = new Map<string, string>();
		items.set('foo', 'bar');
		items.set('some/foo/path', 'some/bar/path');
		items.set(JSON.stringify({ foo: 'bar' }), JSON.stringify({ bar: 'foo' }));

		await storage.updateItems({ insert: items });
		await storage.close();

		await Promises.writeFile(storagePath, 'This is now a broken DB');

		storage = new SQLiteStorageDatabase(storagePath);

		const storedItems = await storage.getItems();
		strictEqual(storedItems.size, items.size);
		strictEqual(storedItems.get('foo'), 'bar');
		strictEqual(storedItems.get('some/foo/path'), 'some/bar/path');
		strictEqual(storedItems.get(JSON.stringify({ foo: 'bar' })), JSON.stringify({ bar: 'foo' }));

		let recoveryCalled = false;
		await storage.close(() => {
			recoveryCalled = true;

			return new Map();
		});

		strictEqual(recoveryCalled, false);
	});

	test('basics (corrupt DB falls back to empty DB if backup is corrupt)', async () => {
		const storagePath = join(testdir, 'storage.db');
		let storage = new SQLiteStorageDatabase(storagePath);

		const items = new Map<string, string>();
		items.set('foo', 'bar');
		items.set('some/foo/path', 'some/bar/path');
		items.set(JSON.stringify({ foo: 'bar' }), JSON.stringify({ bar: 'foo' }));

		await storage.updateItems({ insert: items });
		await storage.close();

		await Promises.writeFile(storagePath, 'This is now a broken DB');
		await Promises.writeFile(`${storagePath}.backup`, 'This is now also a broken DB');

		storage = new SQLiteStorageDatabase(storagePath);

		const storedItems = await storage.getItems();
		strictEqual(storedItems.size, 0);

		await testDBBasics(storagePath);
	});

	(isWindows ? test.skip /* Windows will fail to write to open DB due to locking */ : test)('basics (DB that becomes corrupt during runtime stores all state from cache on close)', async () => {
		const storagePath = join(testdir, 'storage.db');
		let storage = new SQLiteStorageDatabase(storagePath);

		const items = new Map<string, string>();
		items.set('foo', 'bar');
		items.set('some/foo/path', 'some/bar/path');
		items.set(JSON.stringify({ foo: 'bar' }), JSON.stringify({ bar: 'foo' }));

		await storage.updateItems({ insert: items });
		await storage.close();

		const backupPath = `${storagePath}.backup`;
		strictEqual(await Promises.exists(backupPath), true);

		storage = new SQLiteStorageDatabase(storagePath);
		await storage.getItems();

		await Promises.writeFile(storagePath, 'This is now a broken DB');

		// we still need to trigger a check to the DB so that we get to know that
		// the DB is corrupt. We have no extra code on shutdown that checks for the
		// health of the DB. This is an optimization to not perform too many tasks
		// on shutdown.
		await storage.checkIntegrity(true).then(null, error => { } /* error is expected here but we do not want to fail */);

		await fs.promises.unlink(backupPath); // also test that the recovery DB is backed up properly

		let recoveryCalled = false;
		await storage.close(() => {
			recoveryCalled = true;

			return items;
		});

		strictEqual(recoveryCalled, true);
		strictEqual(await Promises.exists(backupPath), true);

		storage = new SQLiteStorageDatabase(storagePath);

		const storedItems = await storage.getItems();
		strictEqual(storedItems.size, items.size);
		strictEqual(storedItems.get('foo'), 'bar');
		strictEqual(storedItems.get('some/foo/path'), 'some/bar/path');
		strictEqual(storedItems.get(JSON.stringify({ foo: 'bar' })), JSON.stringify({ bar: 'foo' }));

		recoveryCalled = false;
		await storage.close(() => {
			recoveryCalled = true;

			return new Map();
		});

		strictEqual(recoveryCalled, false);
	});

	test('real world example', async function () {
		let storage = new SQLiteStorageDatabase(join(testdir, 'storage.db'));

		const items1 = new Map<string, string>();
		items1.set('colorthemedata', '{"id":"vs vscode-theme-defaults-themes-light_plus-json","label":"Light+ (default light)","settingsId":"Default Light+","selector":"vs.vscode-theme-defaults-themes-light_plus-json","themeTokenColors":[{"settings":{"foreground":"#000000ff","background":"#ffffffff"}},{"scope":["meta.embedded","source.groovy.embedded"],"settings":{"foreground":"#000000ff"}},{"scope":"emphasis","settings":{"fontStyle":"italic"}},{"scope":"strong","settings":{"fontStyle":"bold"}},{"scope":"meta.diff.header","settings":{"foreground":"#000080"}},{"scope":"comment","settings":{"foreground":"#008000"}},{"scope":"constant.language","settings":{"foreground":"#0000ff"}},{"scope":["constant.numeric"],"settings":{"foreground":"#098658"}},{"scope":"constant.regexp","settings":{"foreground":"#811f3f"}},{"name":"css tags in selectors, xml tags","scope":"entity.name.tag","settings":{"foreground":"#800000"}},{"scope":"entity.name.selector","settings":{"foreground":"#800000"}},{"scope":"entity.other.attribute-name","settings":{"foreground":"#ff0000"}},{"scope":["entity.other.attribute-name.class.css","entity.other.attribute-name.class.mixin.css","entity.other.attribute-name.id.css","entity.other.attribute-name.parent-selector.css","entity.other.attribute-name.pseudo-class.css","entity.other.attribute-name.pseudo-element.css","source.css.less entity.other.attribute-name.id","entity.other.attribute-name.attribute.scss","entity.other.attribute-name.scss"],"settings":{"foreground":"#800000"}},{"scope":"invalid","settings":{"foreground":"#cd3131"}},{"scope":"markup.underline","settings":{"fontStyle":"underline"}},{"scope":"markup.bold","settings":{"fontStyle":"bold","foreground":"#000080"}},{"scope":"markup.heading","settings":{"fontStyle":"bold","foreground":"#800000"}},{"scope":"markup.italic","settings":{"fontStyle":"italic"}},{"scope":"markup.inserted","settings":{"foreground":"#098658"}},{"scope":"markup.deleted","settings":{"foreground":"#a31515"}},{"scope":"markup.changed","settings":{"foreground":"#0451a5"}},{"scope":["punctuation.definition.quote.begin.markdown","punctuation.definition.list.begin.markdown"],"settings":{"foreground":"#0451a5"}},{"scope":"markup.inline.raw","settings":{"foreground":"#800000"}},{"name":"brackets of XML/HTML tags","scope":"punctuation.definition.tag","settings":{"foreground":"#800000"}},{"scope":"meta.preprocessor","settings":{"foreground":"#0000ff"}},{"scope":"meta.preprocessor.string","settings":{"foreground":"#a31515"}},{"scope":"meta.preprocessor.numeric","settings":{"foreground":"#098658"}},{"scope":"meta.structure.dictionary.key.python","settings":{"foreground":"#0451a5"}},{"scope":"storage","settings":{"foreground":"#0000ff"}},{"scope":"storage.type","settings":{"foreground":"#0000ff"}},{"scope":"storage.modifier","settings":{"foreground":"#0000ff"}},{"scope":"string","settings":{"foreground":"#a31515"}},{"scope":["string.comment.buffered.block.pug","string.quoted.pug","string.interpolated.pug","string.unquoted.plain.in.yaml","string.unquoted.plain.out.yaml","string.unquoted.block.yaml","string.quoted.single.yaml","string.quoted.double.xml","string.quoted.single.xml","string.unquoted.cdata.xml","string.quoted.double.html","string.quoted.single.html","string.unquoted.html","string.quoted.single.handlebars","string.quoted.double.handlebars"],"settings":{"foreground":"#0000ff"}},{"scope":"string.regexp","settings":{"foreground":"#811f3f"}},{"name":"String interpolation","scope":["punctuation.definition.template-expression.begin","punctuation.definition.template-expression.end","punctuation.section.embedded"],"settings":{"foreground":"#0000ff"}},{"name":"Reset JavaScript string interpolation expression","scope":["meta.template.expression"],"settings":{"foreground":"#000000"}},{"scope":["support.constant.property-value","support.constant.font-name","support.constant.media-type","support.constant.media","constant.other.color.rgb-value","constant.other.rgb-value","support.constant.color"],"settings":{"foreground":"#0451a5"}},{"scope":["support.type.vendored.property-name","support.type.property-name","variable.css","variable.scss","variable.other.less","source.coffee.embedded"],"settings":{"foreground":"#ff0000"}},{"scope":["support.type.property-name.json"],"settings":{"foreground":"#0451a5"}},{"scope":"keyword","settings":{"foreground":"#0000ff"}},{"scope":"keyword.control","settings":{"foreground":"#0000ff"}},{"scope":"keyword.operator","settings":{"foreground":"#000000"}},{"scope":["keyword.operator.new","keyword.operator.expression","keyword.operator.cast","keyword.operator.sizeof","keyword.operator.instanceof","keyword.operator.logical.python"],"settings":{"foreground":"#0000ff"}},{"scope":"keyword.other.unit","settings":{"foreground":"#098658"}},{"scope":["punctuation.section.embedded.begin.php","punctuation.section.embedded.end.php"],"settings":{"foreground":"#800000"}},{"scope":"support.function.git-rebase","settings":{"foreground":"#0451a5"}},{"scope":"constant.sha.git-rebase","settings":{"foreground":"#098658"}},{"name":"coloring of the Java import and package identifiers","scope":["storage.modifier.import.java","variable.language.wildcard.java","storage.modifier.package.java"],"settings":{"foreground":"#000000"}},{"name":"this.self","scope":"variable.language","settings":{"foreground":"#0000ff"}},{"name":"Function declarations","scope":["entity.name.function","support.function","support.constant.handlebars"],"settings":{"foreground":"#795E26"}},{"name":"Types declaration and references","scope":["meta.return-type","support.class","support.type","entity.name.type","entity.name.class","storage.type.numeric.go","storage.type.byte.go","storage.type.boolean.go","storage.type.string.go","storage.type.uintptr.go","storage.type.error.go","storage.type.rune.go","storage.type.cs","storage.type.generic.cs","storage.type.modifier.cs","storage.type.variable.cs","storage.type.annotation.java","storage.type.generic.java","storage.type.java","storage.type.object.array.java","storage.type.primitive.array.java","storage.type.primitive.java","storage.type.token.java","storage.type.groovy","storage.type.annotation.groovy","storage.type.parameters.groovy","storage.type.generic.groovy","storage.type.object.array.groovy","storage.type.primitive.array.groovy","storage.type.primitive.groovy"],"settings":{"foreground":"#267f99"}},{"name":"Types declaration and references, TS grammar specific","scope":["meta.type.cast.expr","meta.type.new.expr","support.constant.math","support.constant.dom","support.constant.json","entity.other.inherited-class"],"settings":{"foreground":"#267f99"}},{"name":"Control flow keywords","scope":"keyword.control","settings":{"foreground":"#AF00DB"}},{"name":"Variable and parameter name","scope":["variable","meta.definition.variable.name","support.variable","entity.name.variable"],"settings":{"foreground":"#001080"}},{"name":"Object keys, TS grammar specific","scope":["meta.object-literal.key"],"settings":{"foreground":"#001080"}},{"name":"CSS property value","scope":["support.constant.property-value","support.constant.font-name","support.constant.media-type","support.constant.media","constant.other.color.rgb-value","constant.other.rgb-value","support.constant.color"],"settings":{"foreground":"#0451a5"}},{"name":"Regular expression groups","scope":["punctuation.definition.group.regexp","punctuation.definition.group.assertion.regexp","punctuation.definition.character-class.regexp","punctuation.character.set.begin.regexp","punctuation.character.set.end.regexp","keyword.operator.negation.regexp","support.other.parenthesis.regexp"],"settings":{"foreground":"#d16969"}},{"scope":["constant.character.character-class.regexp","constant.other.character-class.set.regexp","constant.other.character-class.regexp","constant.character.set.regexp"],"settings":{"foreground":"#811f3f"}},{"scope":"keyword.operator.quantifier.regexp","settings":{"foreground":"#000000"}},{"scope":["keyword.operator.or.regexp","keyword.control.anchor.regexp"],"settings":{"foreground":"#ff0000"}},{"scope":"constant.character","settings":{"foreground":"#0000ff"}},{"scope":"constant.character.escape","settings":{"foreground":"#ff0000"}},{"scope":"token.info-token","settings":{"foreground":"#316bcd"}},{"scope":"token.warn-token","settings":{"foreground":"#cd9731"}},{"scope":"token.error-token","settings":{"foreground":"#cd3131"}},{"scope":"token.debug-token","settings":{"foreground":"#800080"}}],"extensionData":{"extensionId":"vscode.theme-defaults","extensionPublisher":"vscode","extensionName":"theme-defaults","extensionIsBuiltin":true},"colorMap":{"editor.background":"#ffffff","editor.foreground":"#000000","editor.inactiveSelectionBackground":"#e5ebf1","editorIndentGuide.background":"#d3d3d3","editorIndentGuide.activeBackground":"#939393","editor.selectionHighlightBackground":"#add6ff4d","editorSuggestWidget.background":"#f3f3f3","activityBarBadge.background":"#007acc","sideBarTitle.foreground":"#6f6f6f","list.hoverBackground":"#e8e8e8","input.placeholderForeground":"#767676","settings.textInputBorder":"#cecece","settings.numberInputBorder":"#cecece"}}');
		items1.set('commandpalette.mru.cache', '{"usesLRU":true,"entries":[{"key":"revealFileInOS","value":3},{"key":"extension.openInGitHub","value":4},{"key":"workbench.extensions.action.openExtensionsFolder","value":11},{"key":"workbench.action.showRuntimeExtensions","value":14},{"key":"workbench.action.toggleTabsVisibility","value":15},{"key":"extension.liveServerPreview.open","value":16},{"key":"workbench.action.openIssueReporter","value":18},{"key":"workbench.action.openProcessExplorer","value":19},{"key":"workbench.action.toggleSharedProcess","value":20},{"key":"workbench.action.configureLocale","value":21},{"key":"workbench.action.appPerf","value":22},{"key":"workbench.action.reportPerformanceIssueUsingReporter","value":23},{"key":"workbench.action.openGlobalKeybindings","value":25},{"key":"workbench.action.output.toggleOutput","value":27},{"key":"extension.sayHello","value":29}]}');
		items1.set('cpp.1.lastsessiondate', 'Fri Oct 05 2018');
		items1.set('debug.actionswidgetposition', '0.6880952380952381');

		const items2 = new Map<string, string>();
		items2.set('workbench.editors.files.textfileeditor', '{"textEditorViewState":[["file:///Users/dummy/Documents/ticino-playground/play.htm",{"0":{"cursorState":[{"inSelectionMode":false,"selectionStart":{"lineNumber":6,"column":16},"position":{"lineNumber":6,"column":16}}],"viewState":{"scrollLeft":0,"firstPosition":{"lineNumber":1,"column":1},"firstPositionDeltaTop":0},"contributionsState":{"editor.contrib.folding":{},"editor.contrib.wordHighlighter":false}}}],["file:///Users/dummy/Documents/ticino-playground/nakefile.js",{"0":{"cursorState":[{"inSelectionMode":false,"selectionStart":{"lineNumber":7,"column":81},"position":{"lineNumber":7,"column":81}}],"viewState":{"scrollLeft":0,"firstPosition":{"lineNumber":1,"column":1},"firstPositionDeltaTop":20},"contributionsState":{"editor.contrib.folding":{},"editor.contrib.wordHighlighter":false}}}],["file:///Users/dummy/Desktop/vscode2/.gitattributes",{"0":{"cursorState":[{"inSelectionMode":false,"selectionStart":{"lineNumber":9,"column":12},"position":{"lineNumber":9,"column":12}}],"viewState":{"scrollLeft":0,"firstPosition":{"lineNumber":1,"column":1},"firstPositionDeltaTop":20},"contributionsState":{"editor.contrib.folding":{},"editor.contrib.wordHighlighter":false}}}],["file:///Users/dummy/Desktop/vscode2/src/vs/workbench/contrib/search/browser/openAnythingHandler.ts",{"0":{"cursorState":[{"inSelectionMode":false,"selectionStart":{"lineNumber":1,"column":1},"position":{"lineNumber":1,"column":1}}],"viewState":{"scrollLeft":0,"firstPosition":{"lineNumber":1,"column":1},"firstPositionDeltaTop":0},"contributionsState":{"editor.contrib.folding":{},"editor.contrib.wordHighlighter":false}}}]]}');

		const items3 = new Map<string, string>();
		items3.set('nps/iscandidate', 'false');
		items3.set('telemetry.instanceid', 'd52bfcd4-4be6-476b-a38f-d44c717c41d6');
		items3.set('workbench.activity.pinnedviewlets', '[{"id":"workbench.view.explorer","pinned":true,"order":0,"visible":true},{"id":"workbench.view.search","pinned":true,"order":1,"visible":true},{"id":"workbench.view.scm","pinned":true,"order":2,"visible":true},{"id":"workbench.view.debug","pinned":true,"order":3,"visible":true},{"id":"workbench.view.extensions","pinned":true,"order":4,"visible":true},{"id":"workbench.view.extension.gitlens","pinned":true,"order":7,"visible":true},{"id":"workbench.view.extension.test","pinned":false,"visible":false}]');
		items3.set('workbench.panel.height', '419');
		items3.set('very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.very.long.key.', 'is long');

		let storedItems = await storage.getItems();
		strictEqual(storedItems.size, 0);

		await Promise.all([
			await storage.updateItems({ insert: items1 }),
			await storage.updateItems({ insert: items2 }),
			await storage.updateItems({ insert: items3 })
		]);

		strictEqual(await storage.checkIntegrity(true), 'ok');
		strictEqual(await storage.checkIntegrity(false), 'ok');

		storedItems = await storage.getItems();
		strictEqual(storedItems.size, items1.size + items2.size + items3.size);

		const items1Keys: string[] = [];
		items1.forEach((value, key) => {
			items1Keys.push(key);
			strictEqual(storedItems.get(key), value);
		});

		const items2Keys: string[] = [];
		items2.forEach((value, key) => {
			items2Keys.push(key);
			strictEqual(storedItems.get(key), value);
		});

		const items3Keys: string[] = [];
		items3.forEach((value, key) => {
			items3Keys.push(key);
			strictEqual(storedItems.get(key), value);
		});

		await Promise.all([
			await storage.updateItems({ delete: toSet(items1Keys) }),
			await storage.updateItems({ delete: toSet(items2Keys) }),
			await storage.updateItems({ delete: toSet(items3Keys) })
		]);

		storedItems = await storage.getItems();
		strictEqual(storedItems.size, 0);

		await Promise.all([
			await storage.updateItems({ insert: items1 }),
			await storage.getItems(),
			await storage.updateItems({ insert: items2 }),
			await storage.getItems(),
			await storage.updateItems({ insert: items3 }),
			await storage.getItems(),
		]);

		storedItems = await storage.getItems();
		strictEqual(storedItems.size, items1.size + items2.size + items3.size);

		await storage.close();

		storage = new SQLiteStorageDatabase(join(testdir, 'storage.db'));

		storedItems = await storage.getItems();
		strictEqual(storedItems.size, items1.size + items2.size + items3.size);

		await storage.close();
	});

	test('very large item value', async function () {
		const storage = new SQLiteStorageDatabase(join(testdir, 'storage.db'));

		let randomData = createLargeRandomData(); // 3.6MB

		await storage.updateItems({ insert: randomData.items });

		let storedItems = await storage.getItems();
		strictEqual(randomData.items.get('colorthemedata'), storedItems.get('colorthemedata'));
		strictEqual(randomData.items.get('commandpalette.mru.cache'), storedItems.get('commandpalette.mru.cache'));
		strictEqual(randomData.items.get('super.large.string'), storedItems.get('super.large.string'));

		randomData = createLargeRandomData();

		await storage.updateItems({ insert: randomData.items });

		storedItems = await storage.getItems();
		strictEqual(randomData.items.get('colorthemedata'), storedItems.get('colorthemedata'));
		strictEqual(randomData.items.get('commandpalette.mru.cache'), storedItems.get('commandpalette.mru.cache'));
		strictEqual(randomData.items.get('super.large.string'), storedItems.get('super.large.string'));

		const toDelete = new Set<string>();
		toDelete.add('super.large.string');
		await storage.updateItems({ delete: toDelete });

		storedItems = await storage.getItems();
		strictEqual(randomData.items.get('colorthemedata'), storedItems.get('colorthemedata'));
		strictEqual(randomData.items.get('commandpalette.mru.cache'), storedItems.get('commandpalette.mru.cache'));
		ok(!storedItems.get('super.large.string'));

		await storage.close();
	});

	test('multiple concurrent writes execute in sequence', async () => {
		return runWithFakedTimers({}, async () => {
			class TestStorage extends Storage {
				getStorage(): IStorageDatabase {
					return this.database;
				}
			}

			const storage = new TestStorage(new SQLiteStorageDatabase(join(testdir, 'storage.db')));

			await storage.init();

			storage.set('foo', 'bar');
			storage.set('some/foo/path', 'some/bar/path');

			await timeout(2);

			storage.set('foo1', 'bar');
			storage.set('some/foo1/path', 'some/bar/path');

			await timeout(2);

			storage.set('foo2', 'bar');
			storage.set('some/foo2/path', 'some/bar/path');

			await timeout(2);

			storage.delete('foo1');
			storage.delete('some/foo1/path');

			await timeout(2);

			storage.delete('foo4');
			storage.delete('some/foo4/path');

			await timeout(5);

			storage.set('foo3', 'bar');
			await storage.set('some/foo3/path', 'some/bar/path');

			const items = await storage.getStorage().getItems();
			strictEqual(items.get('foo'), 'bar');
			strictEqual(items.get('some/foo/path'), 'some/bar/path');
			strictEqual(items.has('foo1'), false);
			strictEqual(items.has('some/foo1/path'), false);
			strictEqual(items.get('foo2'), 'bar');
			strictEqual(items.get('some/foo2/path'), 'some/bar/path');
			strictEqual(items.get('foo3'), 'bar');
			strictEqual(items.get('some/foo3/path'), 'some/bar/path');

			await storage.close();
		});
	});

	test('lots of INSERT & DELETE (below inline max)', async () => {
		const storage = new SQLiteStorageDatabase(join(testdir, 'storage.db'));

		const { items, keys } = createManyRandomData(200);

		await storage.updateItems({ insert: items });

		let storedItems = await storage.getItems();
		strictEqual(storedItems.size, items.size);

		await storage.updateItems({ delete: keys });

		storedItems = await storage.getItems();
		strictEqual(storedItems.size, 0);

		await storage.close();
	});

	test('lots of INSERT & DELETE (above inline max)', async () => {
		const storage = new SQLiteStorageDatabase(join(testdir, 'storage.db'));

		const { items, keys } = createManyRandomData();

		await storage.updateItems({ insert: items });

		let storedItems = await storage.getItems();
		strictEqual(storedItems.size, items.size);

		await storage.updateItems({ delete: keys });

		storedItems = await storage.getItems();
		strictEqual(storedItems.size, 0);

		await storage.close();
	});

	test('invalid path does not hang', async () => {
		const storage = new SQLiteStorageDatabase(join(testdir, 'nonexist', 'storage.db'));

		let error;
		try {
			await storage.getItems();
			await storage.close();
		} catch (e) {
			error = e;
		}

		ok(error);
	});

	test('optimize', async () => {
		const dbPath = join(testdir, 'storage.db');
		let storage = new SQLiteStorageDatabase(dbPath);

		const { items, keys } = createManyRandomData(400, true);

		await storage.updateItems({ insert: items });

		let storedItems = await storage.getItems();
		strictEqual(storedItems.size, items.size);

		await storage.optimize();
		await storage.close();

		const sizeBeforeDeleteAndOptimize = (await fs.promises.stat(dbPath)).size;

		storage = new SQLiteStorageDatabase(dbPath);

		storedItems = await storage.getItems();
		strictEqual(storedItems.size, items.size);

		await storage.updateItems({ delete: keys });

		storedItems = await storage.getItems();
		strictEqual(storedItems.size, 0);

		await storage.optimize();
		await storage.close();

		storage = new SQLiteStorageDatabase(dbPath);

		storedItems = await storage.getItems();
		strictEqual(storedItems.size, 0);

		await storage.close();

		const sizeAfterDeleteAndOptimize = (await fs.promises.stat(dbPath)).size;

		strictEqual(sizeAfterDeleteAndOptimize < sizeBeforeDeleteAndOptimize, true);
	});

	function createManyRandomData(length = 400, includeVeryLarge = false) {
		const items = new Map<string, string>();
		const keys = new Set<string>();

		for (let i = 0; i < length; i++) {
			const uuid = generateUuid();
			const key = `key: ${uuid}`;

			items.set(key, `value: ${uuid}`);
			keys.add(key);
		}

		if (includeVeryLarge) {
			const largeData = createLargeRandomData();
			for (const [key, value] of largeData.items) {
				items.set(key, value);
				keys.add(key);
			}
		}

		return { items, keys };
	}

	function createLargeRandomData() {
		const items = new Map<string, string>();
		items.set('colorthemedata', '{"id":"vs vscode-theme-defaults-themes-light_plus-json","label":"Light+ (default light)","settingsId":"Default Light+","selector":"vs.vscode-theme-defaults-themes-light_plus-json","themeTokenColors":[{"settings":{"foreground":"#000000ff","background":"#ffffffff"}},{"scope":["meta.embedded","source.groovy.embedded"],"settings":{"foreground":"#000000ff"}},{"scope":"emphasis","settings":{"fontStyle":"italic"}},{"scope":"strong","settings":{"fontStyle":"bold"}},{"scope":"meta.diff.header","settings":{"foreground":"#000080"}},{"scope":"comment","settings":{"foreground":"#008000"}},{"scope":"constant.language","settings":{"foreground":"#0000ff"}},{"scope":["constant.numeric"],"settings":{"foreground":"#098658"}},{"scope":"constant.regexp","settings":{"foreground":"#811f3f"}},{"name":"css tags in selectors, xml tags","scope":"entity.name.tag","settings":{"foreground":"#800000"}},{"scope":"entity.name.selector","settings":{"foreground":"#800000"}},{"scope":"entity.other.attribute-name","settings":{"foreground":"#ff0000"}},{"scope":["entity.other.attribute-name.class.css","entity.other.attribute-name.class.mixin.css","entity.other.attribute-name.id.css","entity.other.attribute-name.parent-selector.css","entity.other.attribute-name.pseudo-class.css","entity.other.attribute-name.pseudo-element.css","source.css.less entity.other.attribute-name.id","entity.other.attribute-name.attribute.scss","entity.other.attribute-name.scss"],"settings":{"foreground":"#800000"}},{"scope":"invalid","settings":{"foreground":"#cd3131"}},{"scope":"markup.underline","settings":{"fontStyle":"underline"}},{"scope":"markup.bold","settings":{"fontStyle":"bold","foreground":"#000080"}},{"scope":"markup.heading","settings":{"fontStyle":"bold","foreground":"#800000"}},{"scope":"markup.italic","settings":{"fontStyle":"italic"}},{"scope":"markup.inserted","settings":{"foreground":"#098658"}},{"scope":"markup.deleted","settings":{"foreground":"#a31515"}},{"scope":"markup.changed","settings":{"foreground":"#0451a5"}},{"scope":["punctuation.definition.quote.begin.markdown","punctuation.definition.list.begin.markdown"],"settings":{"foreground":"#0451a5"}},{"scope":"markup.inline.raw","settings":{"foreground":"#800000"}},{"name":"brackets of XML/HTML tags","scope":"punctuation.definition.tag","settings":{"foreground":"#800000"}},{"scope":"meta.preprocessor","settings":{"foreground":"#0000ff"}},{"scope":"meta.preprocessor.string","settings":{"foreground":"#a31515"}},{"scope":"meta.preprocessor.numeric","settings":{"foreground":"#098658"}},{"scope":"meta.structure.dictionary.key.python","settings":{"foreground":"#0451a5"}},{"scope":"storage","settings":{"foreground":"#0000ff"}},{"scope":"storage.type","settings":{"foreground":"#0000ff"}},{"scope":"storage.modifier","settings":{"foreground":"#0000ff"}},{"scope":"string","settings":{"foreground":"#a31515"}},{"scope":["string.comment.buffered.block.pug","string.quoted.pug","string.interpolated.pug","string.unquoted.plain.in.yaml","string.unquoted.plain.out.yaml","string.unquoted.block.yaml","string.quoted.single.yaml","string.quoted.double.xml","string.quoted.single.xml","string.unquoted.cdata.xml","string.quoted.double.html","string.quoted.single.html","string.unquoted.html","string.quoted.single.handlebars","string.quoted.double.handlebars"],"settings":{"foreground":"#0000ff"}},{"scope":"string.regexp","settings":{"foreground":"#811f3f"}},{"name":"String interpolation","scope":["punctuation.definition.template-expression.begin","punctuation.definition.template-expression.end","punctuation.section.embedded"],"settings":{"foreground":"#0000ff"}},{"name":"Reset JavaScript string interpolation expression","scope":["meta.template.expression"],"settings":{"foreground":"#000000"}},{"scope":["support.constant.property-value","support.constant.font-name","support.constant.media-type","support.constant.media","constant.other.color.rgb-value","constant.other.rgb-value","support.constant.color"],"settings":{"foreground":"#0451a5"}},{"scope":["support.type.vendored.property-name","support.type.property-name","variable.css","variable.scss","variable.other.less","source.coffee.embedded"],"settings":{"foreground":"#ff0000"}},{"scope":["support.type.property-name.json"],"settings":{"foreground":"#0451a5"}},{"scope":"keyword","settings":{"foreground":"#0000ff"}},{"scope":"keyword.control","settings":{"foreground":"#0000ff"}},{"scope":"keyword.operator","settings":{"foreground":"#000000"}},{"scope":["keyword.operator.new","keyword.operator.expression","keyword.operator.cast","keyword.operator.sizeof","keyword.operator.instanceof","keyword.operator.logical.python"],"settings":{"foreground":"#0000ff"}},{"scope":"keyword.other.unit","settings":{"foreground":"#098658"}},{"scope":["punctuation.section.embedded.begin.php","punctuation.section.embedded.end.php"],"settings":{"foreground":"#800000"}},{"scope":"support.function.git-rebase","settings":{"foreground":"#0451a5"}},{"scope":"constant.sha.git-rebase","settings":{"foreground":"#098658"}},{"name":"coloring of the Java import and package identifiers","scope":["storage.modifier.import.java","variable.language.wildcard.java","storage.modifier.package.java"],"settings":{"foreground":"#000000"}},{"name":"this.self","scope":"variable.language","settings":{"foreground":"#0000ff"}},{"name":"Function declarations","scope":["entity.name.function","support.function","support.constant.handlebars"],"settings":{"foreground":"#795E26"}},{"name":"Types declaration and references","scope":["meta.return-type","support.class","support.type","entity.name.type","entity.name.class","storage.type.numeric.go","storage.type.byte.go","storage.type.boolean.go","storage.type.string.go","storage.type.uintptr.go","storage.type.error.go","storage.type.rune.go","storage.type.cs","storage.type.generic.cs","storage.type.modifier.cs","storage.type.variable.cs","storage.type.annotation.java","storage.type.generic.java","storage.type.java","storage.type.object.array.java","storage.type.primitive.array.java","storage.type.primitive.java","storage.type.token.java","storage.type.groovy","storage.type.annotation.groovy","storage.type.parameters.groovy","storage.type.generic.groovy","storage.type.object.array.groovy","storage.type.primitive.array.groovy","storage.type.primitive.groovy"],"settings":{"foreground":"#267f99"}},{"name":"Types declaration and references, TS grammar specific","scope":["meta.type.cast.expr","meta.type.new.expr","support.constant.math","support.constant.dom","support.constant.json","entity.other.inherited-class"],"settings":{"foreground":"#267f99"}},{"name":"Control flow keywords","scope":"keyword.control","settings":{"foreground":"#AF00DB"}},{"name":"Variable and parameter name","scope":["variable","meta.definition.variable.name","support.variable","entity.name.variable"],"settings":{"foreground":"#001080"}},{"name":"Object keys, TS grammar specific","scope":["meta.object-literal.key"],"settings":{"foreground":"#001080"}},{"name":"CSS property value","scope":["support.constant.property-value","support.constant.font-name","support.constant.media-type","support.constant.media","constant.other.color.rgb-value","constant.other.rgb-value","support.constant.color"],"settings":{"foreground":"#0451a5"}},{"name":"Regular expression groups","scope":["punctuation.definition.group.regexp","punctuation.definition.group.assertion.regexp","punctuation.definition.character-class.regexp","punctuation.character.set.begin.regexp","punctuation.character.set.end.regexp","keyword.operator.negation.regexp","support.other.parenthesis.regexp"],"settings":{"foreground":"#d16969"}},{"scope":["constant.character.character-class.regexp","constant.other.character-class.set.regexp","constant.other.character-class.regexp","constant.character.set.regexp"],"settings":{"foreground":"#811f3f"}},{"scope":"keyword.operator.quantifier.regexp","settings":{"foreground":"#000000"}},{"scope":["keyword.operator.or.regexp","keyword.control.anchor.regexp"],"settings":{"foreground":"#ff0000"}},{"scope":"constant.character","settings":{"foreground":"#0000ff"}},{"scope":"constant.character.escape","settings":{"foreground":"#ff0000"}},{"scope":"token.info-token","settings":{"foreground":"#316bcd"}},{"scope":"token.warn-token","settings":{"foreground":"#cd9731"}},{"scope":"token.error-token","settings":{"foreground":"#cd3131"}},{"scope":"token.debug-token","settings":{"foreground":"#800080"}}],"extensionData":{"extensionId":"vscode.theme-defaults","extensionPublisher":"vscode","extensionName":"theme-defaults","extensionIsBuiltin":true},"colorMap":{"editor.background":"#ffffff","editor.foreground":"#000000","editor.inactiveSelectionBackground":"#e5ebf1","editorIndentGuide.background":"#d3d3d3","editorIndentGuide.activeBackground":"#939393","editor.selectionHighlightBackground":"#add6ff4d","editorSuggestWidget.background":"#f3f3f3","activityBarBadge.background":"#007acc","sideBarTitle.foreground":"#6f6f6f","list.hoverBackground":"#e8e8e8","input.placeholderForeground":"#767676","settings.textInputBorder":"#cecece","settings.numberInputBorder":"#cecece"}}');
		items.set('commandpalette.mru.cache', '{"usesLRU":true,"entries":[{"key":"revealFileInOS","value":3},{"key":"extension.openInGitHub","value":4},{"key":"workbench.extensions.action.openExtensionsFolder","value":11},{"key":"workbench.action.showRuntimeExtensions","value":14},{"key":"workbench.action.toggleTabsVisibility","value":15},{"key":"extension.liveServerPreview.open","value":16},{"key":"workbench.action.openIssueReporter","value":18},{"key":"workbench.action.openProcessExplorer","value":19},{"key":"workbench.action.toggleSharedProcess","value":20},{"key":"workbench.action.configureLocale","value":21},{"key":"workbench.action.appPerf","value":22},{"key":"workbench.action.reportPerformanceIssueUsingReporter","value":23},{"key":"workbench.action.openGlobalKeybindings","value":25},{"key":"workbench.action.output.toggleOutput","value":27},{"key":"extension.sayHello","value":29}]}');

		const uuid = generateUuid();
		const value: string[] = [];
		for (let i = 0; i < 100000; i++) {
			value.push(uuid);
		}

		items.set('super.large.string', value.join()); // 3.6MB

		return { items, uuid, value };
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/actionbar.test.ts]---
Location: vscode-main/src/vs/base/test/browser/actionbar.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ActionBar, prepareActions } from '../../browser/ui/actionbar/actionbar.js';
import { Action, Separator } from '../../common/actions.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../common/utils.js';
import { createToggleActionViewItemProvider, ToggleActionViewItem, unthemedToggleStyles } from '../../browser/ui/toggle/toggle.js';
import { ActionViewItem } from '../../browser/ui/actionbar/actionViewItems.js';

suite('Actionbar', () => {

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	test('prepareActions()', function () {
		const a1 = new Separator();
		const a2 = new Separator();
		const a3 = store.add(new Action('a3'));
		const a4 = new Separator();
		const a5 = new Separator();
		const a6 = store.add(new Action('a6'));
		const a7 = new Separator();

		const actions = prepareActions([a1, a2, a3, a4, a5, a6, a7]);
		assert.strictEqual(actions.length, 3); // duplicate separators get removed
		assert(actions[0] === a3);
		assert(actions[1] === a5);
		assert(actions[2] === a6);
	});

	test('hasAction()', function () {
		const container = document.createElement('div');
		const actionbar = store.add(new ActionBar(container));

		const a1 = store.add(new Action('a1'));
		const a2 = store.add(new Action('a2'));

		actionbar.push(a1);
		assert.strictEqual(actionbar.hasAction(a1), true);
		assert.strictEqual(actionbar.hasAction(a2), false);

		actionbar.pull(0);
		assert.strictEqual(actionbar.hasAction(a1), false);

		actionbar.push(a1, { index: 1 });
		actionbar.push(a2, { index: 0 });
		assert.strictEqual(actionbar.hasAction(a1), true);
		assert.strictEqual(actionbar.hasAction(a2), true);

		actionbar.pull(0);
		assert.strictEqual(actionbar.hasAction(a1), true);
		assert.strictEqual(actionbar.hasAction(a2), false);

		actionbar.pull(0);
		assert.strictEqual(actionbar.hasAction(a1), false);
		assert.strictEqual(actionbar.hasAction(a2), false);

		actionbar.push(a1);
		assert.strictEqual(actionbar.hasAction(a1), true);
		actionbar.clear();
		assert.strictEqual(actionbar.hasAction(a1), false);
	});

	suite('ToggleActionViewItemProvider', () => {

		test('renders toggle for actions with checked state', function () {
			const container = document.createElement('div');
			const provider = createToggleActionViewItemProvider(unthemedToggleStyles);
			const actionbar = store.add(new ActionBar(container, {
				actionViewItemProvider: provider
			}));

			const toggleAction = store.add(new Action('toggle', 'Toggle', undefined, true, undefined));
			toggleAction.checked = true;

			actionbar.push(toggleAction);

			// Verify that the action was rendered as a toggle
			assert.strictEqual(actionbar.viewItems.length, 1);
			assert(actionbar.viewItems[0] instanceof ToggleActionViewItem, 'Action with checked state should render as ToggleActionViewItem');
		});

		test('renders button for actions without checked state', function () {
			const container = document.createElement('div');
			const provider = createToggleActionViewItemProvider(unthemedToggleStyles);
			const actionbar = store.add(new ActionBar(container, {
				actionViewItemProvider: provider
			}));

			const buttonAction = store.add(new Action('button', 'Button'));

			actionbar.push(buttonAction);

			// Verify that the action was rendered as a regular button (ActionViewItem)
			assert.strictEqual(actionbar.viewItems.length, 1);
			assert(actionbar.viewItems[0] instanceof ActionViewItem, 'Action without checked state should render as ActionViewItem');
			assert(!(actionbar.viewItems[0] instanceof ToggleActionViewItem), 'Action without checked state should not render as ToggleActionViewItem');
		});

		test('handles mixed actions (toggles and buttons)', function () {
			const container = document.createElement('div');
			const provider = createToggleActionViewItemProvider(unthemedToggleStyles);
			const actionbar = store.add(new ActionBar(container, {
				actionViewItemProvider: provider
			}));

			const toggleAction = store.add(new Action('toggle', 'Toggle'));
			toggleAction.checked = false;
			const buttonAction = store.add(new Action('button', 'Button'));

			actionbar.push([toggleAction, buttonAction]);

			// Verify that we have both types of items
			assert.strictEqual(actionbar.viewItems.length, 2);
			assert(actionbar.viewItems[0] instanceof ToggleActionViewItem, 'First action should be a toggle');
			assert(actionbar.viewItems[1] instanceof ActionViewItem, 'Second action should be a button');
			assert(!(actionbar.viewItems[1] instanceof ToggleActionViewItem), 'Second action should not be a toggle');
		});

		test('toggle state changes when action checked changes', function () {
			const container = document.createElement('div');
			const provider = createToggleActionViewItemProvider(unthemedToggleStyles);
			const actionbar = store.add(new ActionBar(container, {
				actionViewItemProvider: provider
			}));

			const toggleAction = store.add(new Action('toggle', 'Toggle'));
			toggleAction.checked = false;

			actionbar.push(toggleAction);

			// Verify the toggle view item was created
			const toggleViewItem = actionbar.viewItems[0] as ToggleActionViewItem;
			assert(toggleViewItem instanceof ToggleActionViewItem, 'Toggle view item should exist');

			// Change the action's checked state
			toggleAction.checked = true;
			// The view item should reflect the updated checked state
			assert.strictEqual(toggleAction.checked, true, 'Toggle action should update checked state');
		});

		test('quick input button with toggle property creates action with checked state', async function () {
			const { quickInputButtonToAction } = await import('../../../platform/quickinput/browser/quickInputUtils.js');

			// Create a button with toggle property
			const toggleButton = {
				iconClass: 'test-icon',
				tooltip: 'Toggle Button',
				toggle: { checked: true }
			};

			const action = quickInputButtonToAction(toggleButton, 'test-id', () => { });

			// Verify the action has checked property set
			assert.strictEqual(action.checked, true, 'Action should have checked property set to true');

			// Create a button without toggle property
			const regularButton = {
				iconClass: 'test-icon',
				tooltip: 'Regular Button'
			};

			const regularAction = quickInputButtonToAction(regularButton, 'test-id-2', () => { });

			// Verify the action doesn't have checked property
			assert.strictEqual(regularAction.checked, undefined, 'Regular action should not have checked property');
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/browser.test.ts]---
Location: vscode-main/src/vs/base/test/browser/browser.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { isMacintosh, isWindows } from '../../common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../common/utils.js';

suite('Browsers', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('all', () => {
		assert(!(isWindows && isMacintosh));
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/comparers.test.ts]---
Location: vscode-main/src/vs/base/test/browser/comparers.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import {
	compareFileExtensions, compareFileExtensionsDefault, compareFileExtensionsLower, compareFileExtensionsUnicode, compareFileExtensionsUpper, compareFileNames, compareFileNamesDefault, compareFileNamesLower, compareFileNamesUnicode, compareFileNamesUpper
} from '../../common/comparers.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../common/utils.js';

const compareLocale = (a: string, b: string) => a.localeCompare(b);
const compareLocaleNumeric = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true });

suite('Comparers', () => {

	test('compareFileNames', () => {

		//
		// Comparisons with the same results as compareFileNamesDefault
		//

		// name-only comparisons
		assert(compareFileNames(null, null) === 0, 'null should be equal');
		assert(compareFileNames(null, 'abc') < 0, 'null should be come before real values');
		assert(compareFileNames('', '') === 0, 'empty should be equal');
		assert(compareFileNames('abc', 'abc') === 0, 'equal names should be equal');
		assert(compareFileNames('z', 'A') > 0, 'z comes after A');
		assert(compareFileNames('Z', 'a') > 0, 'Z comes after a');

		// name plus extension comparisons
		assert(compareFileNames('bbb.aaa', 'aaa.bbb') > 0, 'compares the whole name all at once by locale');
		assert(compareFileNames('aggregate.go', 'aggregate_repo.go') > 0, 'compares the whole name all at once by locale');

		// dotfile comparisons
		assert(compareFileNames('.abc', '.abc') === 0, 'equal dotfile names should be equal');
		assert(compareFileNames('.env.', '.gitattributes') < 0, 'filenames starting with dots and with extensions should still sort properly');
		assert(compareFileNames('.env', '.aaa.env') > 0, 'dotfiles sort alphabetically when they contain multiple dots');
		assert(compareFileNames('.env', '.env.aaa') < 0, 'dotfiles with the same root sort shortest first');
		assert(compareFileNames('.aaa_env', '.aaa.env') < 0, 'an underscore in a dotfile name will sort before a dot');

		// dotfile vs non-dotfile comparisons
		assert(compareFileNames(null, '.abc') < 0, 'null should come before dotfiles');
		assert(compareFileNames('.env', 'aaa') < 0, 'dotfiles come before filenames without extensions');
		assert(compareFileNames('.env', 'aaa.env') < 0, 'dotfiles come before filenames with extensions');
		assert(compareFileNames('.md', 'A.MD') < 0, 'dotfiles sort before uppercase files');
		assert(compareFileNames('.MD', 'a.md') < 0, 'dotfiles sort before lowercase files');

		// numeric comparisons
		assert(compareFileNames('1', '1') === 0, 'numerically equal full names should be equal');
		assert(compareFileNames('abc1.txt', 'abc1.txt') === 0, 'equal filenames with numbers should be equal');
		assert(compareFileNames('abc1.txt', 'abc2.txt') < 0, 'filenames with numbers should be in numerical order, not alphabetical order');
		assert(compareFileNames('abc2.txt', 'abc10.txt') < 0, 'filenames with numbers should be in numerical order even when they are multiple digits long');
		assert(compareFileNames('abc02.txt', 'abc010.txt') < 0, 'filenames with numbers that have leading zeros sort numerically');
		assert(compareFileNames('abc1.10.txt', 'abc1.2.txt') > 0, 'numbers with dots between them are treated as two separate numbers, not one decimal number');
		assert(compareFileNames('a.ext1', 'b.Ext1') < 0, 'if names are different and extensions with numbers are equal except for case, filenames are sorted in name order');
		assert.deepStrictEqual(['a10.txt', 'A2.txt', 'A100.txt', 'a20.txt'].sort(compareFileNames), ['A2.txt', 'a10.txt', 'a20.txt', 'A100.txt'], 'filenames with number and case differences compare numerically');

		//
		// Comparisons with different results than compareFileNamesDefault
		//

		// name-only comparisons
		assert(compareFileNames('a', 'A') !== compareLocale('a', 'A'), 'the same letter sorts in unicode order, not by locale');
		assert(compareFileNames('â', 'Â') !== compareLocale('â', 'Â'), 'the same accented letter sorts in unicode order, not by locale');
		assert.notDeepStrictEqual(['artichoke', 'Artichoke', 'art', 'Art'].sort(compareFileNames), ['artichoke', 'Artichoke', 'art', 'Art'].sort(compareLocale), 'words with the same root and different cases do not sort in locale order');
		assert.notDeepStrictEqual(['email', 'Email', 'émail', 'Émail'].sort(compareFileNames), ['email', 'Email', 'émail', 'Émail'].sort(compareLocale), 'the same base characters with different case or accents do not sort in locale order');

		// numeric comparisons
		assert(compareFileNames('abc02.txt', 'abc002.txt') > 0, 'filenames with equivalent numbers and leading zeros sort in unicode order');
		assert(compareFileNames('abc.txt1', 'abc.txt01') > 0, 'same name plus extensions with equal numbers sort in unicode order');
		assert(compareFileNames('art01', 'Art01') !== 'art01'.localeCompare('Art01', undefined, { numeric: true }),
			'a numerically equivalent word of a different case does not compare numerically based on locale');
		assert(compareFileNames('a.ext1', 'a.Ext1') > 0, 'if names are equal and extensions with numbers are equal except for case, filenames are sorted in full filename unicode order');

	});

	test('compareFileExtensions', () => {

		//
		// Comparisons with the same results as compareFileExtensionsDefault
		//

		// name-only comparisons
		assert(compareFileExtensions(null, null) === 0, 'null should be equal');
		assert(compareFileExtensions(null, 'abc') < 0, 'null should come before real files without extension');
		assert(compareFileExtensions('', '') === 0, 'empty should be equal');
		assert(compareFileExtensions('abc', 'abc') === 0, 'equal names should be equal');
		assert(compareFileExtensions('z', 'A') > 0, 'z comes after A');
		assert(compareFileExtensions('Z', 'a') > 0, 'Z comes after a');

		// name plus extension comparisons
		assert(compareFileExtensions('file.ext', 'file.ext') === 0, 'equal full names should be equal');
		assert(compareFileExtensions('a.ext', 'b.ext') < 0, 'if equal extensions, filenames should be compared');
		assert(compareFileExtensions('file.aaa', 'file.bbb') < 0, 'files with equal names should be compared by extensions');
		assert(compareFileExtensions('bbb.aaa', 'aaa.bbb') < 0, 'files should be compared by extensions even if filenames compare differently');

		// dotfile comparisons
		assert(compareFileExtensions('.abc', '.abc') === 0, 'equal dotfiles should be equal');
		assert(compareFileExtensions('.md', '.Gitattributes') > 0, 'dotfiles sort alphabetically regardless of case');

		// dotfile vs non-dotfile comparisons
		assert(compareFileExtensions(null, '.abc') < 0, 'null should come before dotfiles');
		assert(compareFileExtensions('.env', 'aaa.env') < 0, 'if equal extensions, filenames should be compared, empty filename should come before others');
		assert(compareFileExtensions('.MD', 'a.md') < 0, 'if extensions differ in case, files sort by extension in unicode order');

		// numeric comparisons
		assert(compareFileExtensions('1', '1') === 0, 'numerically equal full names should be equal');
		assert(compareFileExtensions('abc1.txt', 'abc1.txt') === 0, 'equal filenames with numbers should be equal');
		assert(compareFileExtensions('abc1.txt', 'abc2.txt') < 0, 'filenames with numbers should be in numerical order, not alphabetical order');
		assert(compareFileExtensions('abc2.txt', 'abc10.txt') < 0, 'filenames with numbers should be in numerical order even when they are multiple digits long');
		assert(compareFileExtensions('abc02.txt', 'abc010.txt') < 0, 'filenames with numbers that have leading zeros sort numerically');
		assert(compareFileExtensions('abc1.10.txt', 'abc1.2.txt') > 0, 'numbers with dots between them are treated as two separate numbers, not one decimal number');
		assert(compareFileExtensions('abc2.txt2', 'abc1.txt10') < 0, 'extensions with numbers should be in numerical order, not alphabetical order');
		assert(compareFileExtensions('txt.abc1', 'txt.abc1') === 0, 'equal extensions with numbers should be equal');
		assert(compareFileExtensions('txt.abc1', 'txt.abc2') < 0, 'extensions with numbers should be in numerical order, not alphabetical order');
		assert(compareFileExtensions('txt.abc2', 'txt.abc10') < 0, 'extensions with numbers should be in numerical order even when they are multiple digits long');
		assert(compareFileExtensions('a.ext1', 'b.ext1') < 0, 'if equal extensions with numbers, names should be compared');
		assert.deepStrictEqual(['a10.txt', 'A2.txt', 'A100.txt', 'a20.txt'].sort(compareFileExtensions), ['A2.txt', 'a10.txt', 'a20.txt', 'A100.txt'], 'filenames with number and case differences compare numerically');

		//
		// Comparisons with different results from compareFileExtensionsDefault
		//

		// name-only comparisions
		assert(compareFileExtensions('a', 'A') !== compareLocale('a', 'A'), 'the same letter of different case does not sort by locale');
		assert(compareFileExtensions('â', 'Â') !== compareLocale('â', 'Â'), 'the same accented letter of different case does not sort by locale');
		assert.notDeepStrictEqual(['artichoke', 'Artichoke', 'art', 'Art'].sort(compareFileExtensions), ['artichoke', 'Artichoke', 'art', 'Art'].sort(compareLocale), 'words with the same root and different cases do not sort in locale order');
		assert.notDeepStrictEqual(['email', 'Email', 'émail', 'Émail'].sort(compareFileExtensions), ['email', 'Email', 'émail', 'Émail'].sort((a, b) => a.localeCompare(b)), 'the same base characters with different case or accents do not sort in locale order');

		// name plus extension comparisons
		assert(compareFileExtensions('a.MD', 'a.md') < 0, 'case differences in extensions sort in unicode order');
		assert(compareFileExtensions('a.md', 'A.md') > 0, 'case differences in names sort in unicode order');
		assert(compareFileExtensions('a.md', 'b.MD') > 0, 'when extensions are the same except for case, the files sort by extension');
		assert(compareFileExtensions('aggregate.go', 'aggregate_repo.go') < 0, 'when extensions are equal, names sort in dictionary order');

		// dotfile comparisons
		assert(compareFileExtensions('.env', '.aaa.env') < 0, 'a dotfile with an extension is treated as a name plus an extension - equal extensions');
		assert(compareFileExtensions('.env', '.env.aaa') > 0, 'a dotfile with an extension is treated as a name plus an extension - unequal extensions');

		// dotfile vs non-dotfile comparisons
		assert(compareFileExtensions('.env', 'aaa') > 0, 'filenames without extensions come before dotfiles');
		assert(compareFileExtensions('.md', 'A.MD') > 0, 'a file with an uppercase extension sorts before a dotfile of the same lowercase extension');

		// numeric comparisons
		assert(compareFileExtensions('abc.txt01', 'abc.txt1') < 0, 'extensions with equal numbers sort in unicode order');
		assert(compareFileExtensions('art01', 'Art01') !== compareLocaleNumeric('art01', 'Art01'), 'a numerically equivalent word of a different case does not compare by locale');
		assert(compareFileExtensions('abc02.txt', 'abc002.txt') > 0, 'filenames with equivalent numbers and leading zeros sort in unicode order');
		assert(compareFileExtensions('txt.abc01', 'txt.abc1') < 0, 'extensions with equivalent numbers sort in unicode order');
		assert(compareFileExtensions('a.ext1', 'b.Ext1') > 0, 'if names are different and extensions with numbers are equal except for case, filenames are sorted in extension unicode order');
		assert(compareFileExtensions('a.ext1', 'a.Ext1') > 0, 'if names are equal and extensions with numbers are equal except for case, filenames are sorted in extension unicode order');

	});

	test('compareFileNamesDefault', () => {

		//
		// Comparisons with the same results as compareFileNames
		//

		// name-only comparisons
		assert(compareFileNamesDefault(null, null) === 0, 'null should be equal');
		assert(compareFileNamesDefault(null, 'abc') < 0, 'null should be come before real values');
		assert(compareFileNamesDefault('', '') === 0, 'empty should be equal');
		assert(compareFileNamesDefault('abc', 'abc') === 0, 'equal names should be equal');
		assert(compareFileNamesDefault('z', 'A') > 0, 'z comes after A');
		assert(compareFileNamesDefault('Z', 'a') > 0, 'Z comes after a');

		// name plus extension comparisons
		assert(compareFileNamesDefault('file.ext', 'file.ext') === 0, 'equal full names should be equal');
		assert(compareFileNamesDefault('a.ext', 'b.ext') < 0, 'if equal extensions, filenames should be compared');
		assert(compareFileNamesDefault('file.aaa', 'file.bbb') < 0, 'files with equal names should be compared by extensions');
		assert(compareFileNamesDefault('bbb.aaa', 'aaa.bbb') > 0, 'files should be compared by names even if extensions compare differently');
		assert(compareFileNamesDefault('aggregate.go', 'aggregate_repo.go') > 0, 'compares the whole filename in locale order');

		// dotfile comparisons
		assert(compareFileNamesDefault('.abc', '.abc') === 0, 'equal dotfile names should be equal');
		assert(compareFileNamesDefault('.env.', '.gitattributes') < 0, 'filenames starting with dots and with extensions should still sort properly');
		assert(compareFileNamesDefault('.env', '.aaa.env') > 0, 'dotfiles sort alphabetically when they contain multiple dots');
		assert(compareFileNamesDefault('.env', '.env.aaa') < 0, 'dotfiles with the same root sort shortest first');
		assert(compareFileNamesDefault('.aaa_env', '.aaa.env') < 0, 'an underscore in a dotfile name will sort before a dot');

		// dotfile vs non-dotfile comparisons
		assert(compareFileNamesDefault(null, '.abc') < 0, 'null should come before dotfiles');
		assert(compareFileNamesDefault('.env', 'aaa') < 0, 'dotfiles come before filenames without extensions');
		assert(compareFileNamesDefault('.env', 'aaa.env') < 0, 'dotfiles come before filenames with extensions');
		assert(compareFileNamesDefault('.md', 'A.MD') < 0, 'dotfiles sort before uppercase files');
		assert(compareFileNamesDefault('.MD', 'a.md') < 0, 'dotfiles sort before lowercase files');

		// numeric comparisons
		assert(compareFileNamesDefault('1', '1') === 0, 'numerically equal full names should be equal');
		assert(compareFileNamesDefault('abc1.txt', 'abc1.txt') === 0, 'equal filenames with numbers should be equal');
		assert(compareFileNamesDefault('abc1.txt', 'abc2.txt') < 0, 'filenames with numbers should be in numerical order, not alphabetical order');
		assert(compareFileNamesDefault('abc2.txt', 'abc10.txt') < 0, 'filenames with numbers should be in numerical order even when they are multiple digits long');
		assert(compareFileNamesDefault('abc02.txt', 'abc010.txt') < 0, 'filenames with numbers that have leading zeros sort numerically');
		assert(compareFileNamesDefault('abc1.10.txt', 'abc1.2.txt') > 0, 'numbers with dots between them are treated as two separate numbers, not one decimal number');
		assert(compareFileNamesDefault('a.ext1', 'b.Ext1') < 0, 'if names are different and extensions with numbers are equal except for case, filenames are compared by full filename');
		assert.deepStrictEqual(['a10.txt', 'A2.txt', 'A100.txt', 'a20.txt'].sort(compareFileNamesDefault), ['A2.txt', 'a10.txt', 'a20.txt', 'A100.txt'], 'filenames with number and case differences compare numerically');

		//
		// Comparisons with different results than compareFileNames
		//

		// name-only comparisons
		assert(compareFileNamesDefault('a', 'A') === compareLocale('a', 'A'), 'the same letter sorts by locale');
		assert(compareFileNamesDefault('â', 'Â') === compareLocale('â', 'Â'), 'the same accented letter sorts by locale');
		assert.deepStrictEqual(['email', 'Email', 'émail', 'Émail'].sort(compareFileNamesDefault), ['email', 'Email', 'émail', 'Émail'].sort(compareLocale), 'the same base characters with different case or accents sort in locale order');

		// numeric comparisons
		assert(compareFileNamesDefault('abc02.txt', 'abc002.txt') < 0, 'filenames with equivalent numbers and leading zeros sort shortest number first');
		assert(compareFileNamesDefault('abc.txt1', 'abc.txt01') < 0, 'same name plus extensions with equal numbers sort shortest number first');
		assert(compareFileNamesDefault('art01', 'Art01') === compareLocaleNumeric('art01', 'Art01'), 'a numerically equivalent word of a different case compares numerically based on locale');
		assert(compareFileNamesDefault('a.ext1', 'a.Ext1') === compareLocale('ext1', 'Ext1'), 'if names are equal and extensions with numbers are equal except for case, filenames are sorted in extension locale order');
	});

	test('compareFileExtensionsDefault', () => {

		//
		// Comparisons with the same result as compareFileExtensions
		//

		// name-only comparisons
		assert(compareFileExtensionsDefault(null, null) === 0, 'null should be equal');
		assert(compareFileExtensionsDefault(null, 'abc') < 0, 'null should come before real files without extensions');
		assert(compareFileExtensionsDefault('', '') === 0, 'empty should be equal');
		assert(compareFileExtensionsDefault('abc', 'abc') === 0, 'equal names should be equal');
		assert(compareFileExtensionsDefault('z', 'A') > 0, 'z comes after A');
		assert(compareFileExtensionsDefault('Z', 'a') > 0, 'Z comes after a');

		// name plus extension comparisons
		assert(compareFileExtensionsDefault('file.ext', 'file.ext') === 0, 'equal full filenames should be equal');
		assert(compareFileExtensionsDefault('a.ext', 'b.ext') < 0, 'if equal extensions, filenames should be compared');
		assert(compareFileExtensionsDefault('file.aaa', 'file.bbb') < 0, 'files with equal names should be compared by extensions');
		assert(compareFileExtensionsDefault('bbb.aaa', 'aaa.bbb') < 0, 'files should be compared by extension first');

		// dotfile comparisons
		assert(compareFileExtensionsDefault('.abc', '.abc') === 0, 'equal dotfiles should be equal');
		assert(compareFileExtensionsDefault('.md', '.Gitattributes') > 0, 'dotfiles sort alphabetically regardless of case');

		// dotfile vs non-dotfile comparisons
		assert(compareFileExtensionsDefault(null, '.abc') < 0, 'null should come before dotfiles');
		assert(compareFileExtensionsDefault('.env', 'aaa.env') < 0, 'dotfiles come before filenames with extensions');
		assert(compareFileExtensionsDefault('.MD', 'a.md') < 0, 'dotfiles sort before lowercase files');

		// numeric comparisons
		assert(compareFileExtensionsDefault('1', '1') === 0, 'numerically equal full names should be equal');
		assert(compareFileExtensionsDefault('abc1.txt', 'abc1.txt') === 0, 'equal filenames with numbers should be equal');
		assert(compareFileExtensionsDefault('abc1.txt', 'abc2.txt') < 0, 'filenames with numbers should be in numerical order, not alphabetical order');
		assert(compareFileExtensionsDefault('abc2.txt', 'abc10.txt') < 0, 'filenames with numbers should be in numerical order');
		assert(compareFileExtensionsDefault('abc02.txt', 'abc010.txt') < 0, 'filenames with numbers that have leading zeros sort numerically');
		assert(compareFileExtensionsDefault('abc1.10.txt', 'abc1.2.txt') > 0, 'numbers with dots between them are treated as two separate numbers, not one decimal number');
		assert(compareFileExtensionsDefault('abc2.txt2', 'abc1.txt10') < 0, 'extensions with numbers should be in numerical order, not alphabetical order');
		assert(compareFileExtensionsDefault('txt.abc1', 'txt.abc1') === 0, 'equal extensions with numbers should be equal');
		assert(compareFileExtensionsDefault('txt.abc1', 'txt.abc2') < 0, 'extensions with numbers should be in numerical order, not alphabetical order');
		assert(compareFileExtensionsDefault('txt.abc2', 'txt.abc10') < 0, 'extensions with numbers should be in numerical order even when they are multiple digits long');
		assert(compareFileExtensionsDefault('a.ext1', 'b.ext1') < 0, 'if equal extensions with numbers, full filenames should be compared');
		assert.deepStrictEqual(['a10.txt', 'A2.txt', 'A100.txt', 'a20.txt'].sort(compareFileExtensionsDefault), ['A2.txt', 'a10.txt', 'a20.txt', 'A100.txt'], 'filenames with number and case differences compare numerically');

		//
		// Comparisons with different results than compareFileExtensions
		//

		// name-only comparisons
		assert(compareFileExtensionsDefault('a', 'A') === compareLocale('a', 'A'), 'the same letter of different case sorts by locale');
		assert(compareFileExtensionsDefault('â', 'Â') === compareLocale('â', 'Â'), 'the same accented letter of different case sorts by locale');
		assert.deepStrictEqual(['email', 'Email', 'émail', 'Émail'].sort(compareFileExtensionsDefault), ['email', 'Email', 'émail', 'Émail'].sort((a, b) => a.localeCompare(b)), 'the same base characters with different case or accents sort in locale order');

		// name plus extension comparisons
		assert(compareFileExtensionsDefault('a.MD', 'a.md') === compareLocale('MD', 'md'), 'case differences in extensions sort by locale');
		assert(compareFileExtensionsDefault('a.md', 'A.md') === compareLocale('a', 'A'), 'case differences in names sort by locale');
		assert(compareFileExtensionsDefault('a.md', 'b.MD') < 0, 'when extensions are the same except for case, the files sort by name');
		assert(compareFileExtensionsDefault('aggregate.go', 'aggregate_repo.go') > 0, 'names with the same extension sort in full filename locale order');

		// dotfile comparisons
		assert(compareFileExtensionsDefault('.env', '.aaa.env') > 0, 'dotfiles sort alphabetically when they contain multiple dots');
		assert(compareFileExtensionsDefault('.env', '.env.aaa') < 0, 'dotfiles with the same root sort shortest first');

		// dotfile vs non-dotfile comparisons
		assert(compareFileExtensionsDefault('.env', 'aaa') < 0, 'dotfiles come before filenames without extensions');
		assert(compareFileExtensionsDefault('.md', 'A.MD') < 0, 'dotfiles sort before uppercase files');

		// numeric comparisons
		assert(compareFileExtensionsDefault('abc.txt01', 'abc.txt1') > 0, 'extensions with equal numbers should be in shortest-first order');
		assert(compareFileExtensionsDefault('art01', 'Art01') === compareLocaleNumeric('art01', 'Art01'), 'a numerically equivalent word of a different case compares numerically based on locale');
		assert(compareFileExtensionsDefault('abc02.txt', 'abc002.txt') < 0, 'filenames with equivalent numbers and leading zeros sort shortest string first');
		assert(compareFileExtensionsDefault('txt.abc01', 'txt.abc1') > 0, 'extensions with equivalent numbers sort shortest extension first');
		assert(compareFileExtensionsDefault('a.ext1', 'b.Ext1') < 0, 'if extensions with numbers are equal except for case, full filenames should be compared');
		assert(compareFileExtensionsDefault('a.ext1', 'a.Ext1') === compareLocale('a.ext1', 'a.Ext1'), 'if extensions with numbers are equal except for case, full filenames are compared in locale order');

	});

	test('compareFileNamesUpper', () => {

		//
		// Comparisons with the same results as compareFileNamesDefault
		//

		// name-only comparisons
		assert(compareFileNamesUpper(null, null) === 0, 'null should be equal');
		assert(compareFileNamesUpper(null, 'abc') < 0, 'null should be come before real values');
		assert(compareFileNamesUpper('', '') === 0, 'empty should be equal');
		assert(compareFileNamesUpper('abc', 'abc') === 0, 'equal names should be equal');
		assert(compareFileNamesUpper('z', 'A') > 0, 'z comes after A');

		// name plus extension comparisons
		assert(compareFileNamesUpper('file.ext', 'file.ext') === 0, 'equal full names should be equal');
		assert(compareFileNamesUpper('a.ext', 'b.ext') < 0, 'if equal extensions, filenames should be compared');
		assert(compareFileNamesUpper('file.aaa', 'file.bbb') < 0, 'files with equal names should be compared by extensions');
		assert(compareFileNamesUpper('bbb.aaa', 'aaa.bbb') > 0, 'files should be compared by names even if extensions compare differently');
		assert(compareFileNamesUpper('aggregate.go', 'aggregate_repo.go') > 0, 'compares the full filename in locale order');

		// dotfile comparisons
		assert(compareFileNamesUpper('.abc', '.abc') === 0, 'equal dotfile names should be equal');
		assert(compareFileNamesUpper('.env.', '.gitattributes') < 0, 'filenames starting with dots and with extensions should still sort properly');
		assert(compareFileNamesUpper('.env', '.aaa.env') > 0, 'dotfiles sort alphabetically when they contain multiple dots');
		assert(compareFileNamesUpper('.env', '.env.aaa') < 0, 'dotfiles with the same root sort shortest first');
		assert(compareFileNamesUpper('.aaa_env', '.aaa.env') < 0, 'an underscore in a dotfile name will sort before a dot');

		// dotfile vs non-dotfile comparisons
		assert(compareFileNamesUpper(null, '.abc') < 0, 'null should come before dotfiles');
		assert(compareFileNamesUpper('.env', 'aaa') < 0, 'dotfiles come before filenames without extensions');
		assert(compareFileNamesUpper('.env', 'aaa.env') < 0, 'dotfiles come before filenames with extensions');
		assert(compareFileNamesUpper('.md', 'A.MD') < 0, 'dotfiles sort before uppercase files');
		assert(compareFileNamesUpper('.MD', 'a.md') < 0, 'dotfiles sort before lowercase files');

		// numeric comparisons
		assert(compareFileNamesUpper('1', '1') === 0, 'numerically equal full names should be equal');
		assert(compareFileNamesUpper('abc1.txt', 'abc1.txt') === 0, 'equal filenames with numbers should be equal');
		assert(compareFileNamesUpper('abc1.txt', 'abc2.txt') < 0, 'filenames with numbers should be in numerical order, not alphabetical order');
		assert(compareFileNamesUpper('abc2.txt', 'abc10.txt') < 0, 'filenames with numbers should be in numerical order even when they are multiple digits long');
		assert(compareFileNamesUpper('abc02.txt', 'abc010.txt') < 0, 'filenames with numbers that have leading zeros sort numerically');
		assert(compareFileNamesUpper('abc1.10.txt', 'abc1.2.txt') > 0, 'numbers with dots between them are treated as two separate numbers, not one decimal number');
		assert(compareFileNamesUpper('abc02.txt', 'abc002.txt') < 0, 'filenames with equivalent numbers and leading zeros sort shortest number first');
		assert(compareFileNamesUpper('abc.txt1', 'abc.txt01') < 0, 'same name plus extensions with equal numbers sort shortest number first');
		assert(compareFileNamesUpper('a.ext1', 'b.Ext1') < 0, 'different names with the equal extensions except for case are sorted by full filename');
		assert(compareFileNamesUpper('a.ext1', 'a.Ext1') === compareLocale('a.ext1', 'a.Ext1'), 'same names with equal and extensions except for case are sorted in full filename locale order');

		//
		// Comparisons with different results than compareFileNamesDefault
		//

		// name-only comparisons
		assert(compareFileNamesUpper('Z', 'a') < 0, 'Z comes before a');
		assert(compareFileNamesUpper('a', 'A') > 0, 'the same letter sorts uppercase first');
		assert(compareFileNamesUpper('â', 'Â') > 0, 'the same accented letter sorts uppercase first');
		assert.deepStrictEqual(['artichoke', 'Artichoke', 'art', 'Art'].sort(compareFileNamesUpper), ['Art', 'Artichoke', 'art', 'artichoke'], 'names with the same root and different cases sort uppercase first');
		assert.deepStrictEqual(['email', 'Email', 'émail', 'Émail'].sort(compareFileNamesUpper), ['Email', 'Émail', 'email', 'émail'], 'the same base characters with different case or accents sort uppercase first');

		// numeric comparisons
		assert(compareFileNamesUpper('art01', 'Art01') > 0, 'a numerically equivalent name of a different case compares uppercase first');
		assert.deepStrictEqual(['a10.txt', 'A2.txt', 'A100.txt', 'a20.txt'].sort(compareFileNamesUpper), ['A2.txt', 'A100.txt', 'a10.txt', 'a20.txt'], 'filenames with number and case differences group by case then compare by number');

	});

	test('compareFileExtensionsUpper', () => {

		//
		// Comparisons with the same result as compareFileExtensionsDefault
		//

		// name-only comparisons
		assert(compareFileExtensionsUpper(null, null) === 0, 'null should be equal');
		assert(compareFileExtensionsUpper(null, 'abc') < 0, 'null should come before real files without extensions');
		assert(compareFileExtensionsUpper('', '') === 0, 'empty should be equal');
		assert(compareFileExtensionsUpper('abc', 'abc') === 0, 'equal names should be equal');
		assert(compareFileExtensionsUpper('z', 'A') > 0, 'z comes after A');

		// name plus extension comparisons
		assert(compareFileExtensionsUpper('file.ext', 'file.ext') === 0, 'equal full filenames should be equal');
		assert(compareFileExtensionsUpper('a.ext', 'b.ext') < 0, 'if equal extensions, filenames should be compared');
		assert(compareFileExtensionsUpper('file.aaa', 'file.bbb') < 0, 'files with equal names should be compared by extensions');
		assert(compareFileExtensionsUpper('bbb.aaa', 'aaa.bbb') < 0, 'files should be compared by extension first');
		assert(compareFileExtensionsUpper('a.md', 'b.MD') < 0, 'when extensions are the same except for case, the files sort by name');
		assert(compareFileExtensionsUpper('a.MD', 'a.md') === compareLocale('MD', 'md'), 'case differences in extensions sort by locale');
		assert(compareFileExtensionsUpper('aggregate.go', 'aggregate_repo.go') > 0, 'when extensions are equal, compares the full filename');

		// dotfile comparisons
		assert(compareFileExtensionsUpper('.abc', '.abc') === 0, 'equal dotfiles should be equal');
		assert(compareFileExtensionsUpper('.md', '.Gitattributes') > 0, 'dotfiles sort alphabetically regardless of case');
		assert(compareFileExtensionsUpper('.env', '.aaa.env') > 0, 'dotfiles sort alphabetically when they contain multiple dots');
		assert(compareFileExtensionsUpper('.env', '.env.aaa') < 0, 'dotfiles with the same root sort shortest first');

		// dotfile vs non-dotfile comparisons
		assert(compareFileExtensionsUpper(null, '.abc') < 0, 'null should come before dotfiles');
		assert(compareFileExtensionsUpper('.env', 'aaa.env') < 0, 'dotfiles come before filenames with extensions');
		assert(compareFileExtensionsUpper('.MD', 'a.md') < 0, 'dotfiles sort before lowercase files');
		assert(compareFileExtensionsUpper('.env', 'aaa') < 0, 'dotfiles come before filenames without extensions');
		assert(compareFileExtensionsUpper('.md', 'A.MD') < 0, 'dotfiles sort before uppercase files');

		// numeric comparisons
		assert(compareFileExtensionsUpper('1', '1') === 0, 'numerically equal full names should be equal');
		assert(compareFileExtensionsUpper('abc1.txt', 'abc1.txt') === 0, 'equal filenames with numbers should be equal');
		assert(compareFileExtensionsUpper('abc1.txt', 'abc2.txt') < 0, 'filenames with numbers should be in numerical order, not alphabetical order');
		assert(compareFileExtensionsUpper('abc2.txt', 'abc10.txt') < 0, 'filenames with numbers should be in numerical order');
		assert(compareFileExtensionsUpper('abc02.txt', 'abc010.txt') < 0, 'filenames with numbers that have leading zeros sort numerically');
		assert(compareFileExtensionsUpper('abc1.10.txt', 'abc1.2.txt') > 0, 'numbers with dots between them are treated as two separate numbers, not one decimal number');
		assert(compareFileExtensionsUpper('abc2.txt2', 'abc1.txt10') < 0, 'extensions with numbers should be in numerical order, not alphabetical order');
		assert(compareFileExtensionsUpper('txt.abc1', 'txt.abc1') === 0, 'equal extensions with numbers should be equal');
		assert(compareFileExtensionsUpper('txt.abc1', 'txt.abc2') < 0, 'extensions with numbers should be in numerical order, not alphabetical order');
		assert(compareFileExtensionsUpper('txt.abc2', 'txt.abc10') < 0, 'extensions with numbers should be in numerical order even when they are multiple digits long');
		assert(compareFileExtensionsUpper('a.ext1', 'b.ext1') < 0, 'if equal extensions with numbers, full filenames should be compared');
		assert(compareFileExtensionsUpper('abc.txt01', 'abc.txt1') > 0, 'extensions with equal numbers should be in shortest-first order');
		assert(compareFileExtensionsUpper('abc02.txt', 'abc002.txt') < 0, 'filenames with equivalent numbers and leading zeros sort shortest string first');
		assert(compareFileExtensionsUpper('txt.abc01', 'txt.abc1') > 0, 'extensions with equivalent numbers sort shortest extension first');
		assert(compareFileExtensionsUpper('a.ext1', 'b.Ext1') < 0, 'different names and extensions that are equal except for case are sorted in full filename order');
		assert(compareFileExtensionsUpper('a.ext1', 'a.Ext1') === compareLocale('a.ext1', 'b.Ext1'), 'same names and extensions that are equal except for case are sorted in full filename locale order');

		//
		// Comparisons with different results than compareFileExtensionsDefault
		//

		// name-only comparisons
		assert(compareFileExtensionsUpper('Z', 'a') < 0, 'Z comes before a');
		assert(compareFileExtensionsUpper('a', 'A') > 0, 'the same letter sorts uppercase first');
		assert(compareFileExtensionsUpper('â', 'Â') > 0, 'the same accented letter sorts uppercase first');
		assert.deepStrictEqual(['artichoke', 'Artichoke', 'art', 'Art'].sort(compareFileExtensionsUpper), ['Art', 'Artichoke', 'art', 'artichoke'], 'names with the same root and different cases sort uppercase names first');
		assert.deepStrictEqual(['email', 'Email', 'émail', 'Émail'].sort(compareFileExtensionsUpper), ['Email', 'Émail', 'email', 'émail'], 'the same base characters with different case or accents sort uppercase names first');

		// name plus extension comparisons
		assert(compareFileExtensionsUpper('a.md', 'A.md') > 0, 'case differences in names sort uppercase first');
		assert(compareFileExtensionsUpper('art01', 'Art01') > 0, 'a numerically equivalent word of a different case sorts uppercase first');
		assert.deepStrictEqual(['a10.txt', 'A2.txt', 'A100.txt', 'a20.txt'].sort(compareFileExtensionsUpper), ['A2.txt', 'A100.txt', 'a10.txt', 'a20.txt',], 'filenames with number and case differences group by case then sort by number');

	});

	test('compareFileNamesLower', () => {

		//
		// Comparisons with the same results as compareFileNamesDefault
		//

		// name-only comparisons
		assert(compareFileNamesLower(null, null) === 0, 'null should be equal');
		assert(compareFileNamesLower(null, 'abc') < 0, 'null should be come before real values');
		assert(compareFileNamesLower('', '') === 0, 'empty should be equal');
		assert(compareFileNamesLower('abc', 'abc') === 0, 'equal names should be equal');
		assert(compareFileNamesLower('Z', 'a') > 0, 'Z comes after a');

		// name plus extension comparisons
		assert(compareFileNamesLower('file.ext', 'file.ext') === 0, 'equal full names should be equal');
		assert(compareFileNamesLower('a.ext', 'b.ext') < 0, 'if equal extensions, filenames should be compared');
		assert(compareFileNamesLower('file.aaa', 'file.bbb') < 0, 'files with equal names should be compared by extensions');
		assert(compareFileNamesLower('bbb.aaa', 'aaa.bbb') > 0, 'files should be compared by names even if extensions compare differently');
		assert(compareFileNamesLower('aggregate.go', 'aggregate_repo.go') > 0, 'compares full filenames');

		// dotfile comparisons
		assert(compareFileNamesLower('.abc', '.abc') === 0, 'equal dotfile names should be equal');
		assert(compareFileNamesLower('.env.', '.gitattributes') < 0, 'filenames starting with dots and with extensions should still sort properly');
		assert(compareFileNamesLower('.env', '.aaa.env') > 0, 'dotfiles sort alphabetically when they contain multiple dots');
		assert(compareFileNamesLower('.env', '.env.aaa') < 0, 'dotfiles with the same root sort shortest first');
		assert(compareFileNamesLower('.aaa_env', '.aaa.env') < 0, 'an underscore in a dotfile name will sort before a dot');

		// dotfile vs non-dotfile comparisons
		assert(compareFileNamesLower(null, '.abc') < 0, 'null should come before dotfiles');
		assert(compareFileNamesLower('.env', 'aaa') < 0, 'dotfiles come before filenames without extensions');
		assert(compareFileNamesLower('.env', 'aaa.env') < 0, 'dotfiles come before filenames with extensions');
		assert(compareFileNamesLower('.md', 'A.MD') < 0, 'dotfiles sort before uppercase files');
		assert(compareFileNamesLower('.MD', 'a.md') < 0, 'dotfiles sort before lowercase files');

		// numeric comparisons
		assert(compareFileNamesLower('1', '1') === 0, 'numerically equal full names should be equal');
		assert(compareFileNamesLower('abc1.txt', 'abc1.txt') === 0, 'equal filenames with numbers should be equal');
		assert(compareFileNamesLower('abc1.txt', 'abc2.txt') < 0, 'filenames with numbers should be in numerical order, not alphabetical order');
		assert(compareFileNamesLower('abc2.txt', 'abc10.txt') < 0, 'filenames with numbers should be in numerical order even when they are multiple digits long');
		assert(compareFileNamesLower('abc02.txt', 'abc010.txt') < 0, 'filenames with numbers that have leading zeros sort numerically');
		assert(compareFileNamesLower('abc1.10.txt', 'abc1.2.txt') > 0, 'numbers with dots between them are treated as two separate numbers, not one decimal number');
		assert(compareFileNamesLower('abc02.txt', 'abc002.txt') < 0, 'filenames with equivalent numbers and leading zeros sort shortest number first');
		assert(compareFileNamesLower('abc.txt1', 'abc.txt01') < 0, 'same name plus extensions with equal numbers sort shortest number first');
		assert(compareFileNamesLower('a.ext1', 'b.Ext1') < 0, 'different names and extensions that are equal except for case are sorted in full filename order');
		assert(compareFileNamesLower('a.ext1', 'a.Ext1') === compareLocale('a.ext1', 'b.Ext1'), 'same names and extensions that are equal except for case are sorted in full filename locale order');

		//
		// Comparisons with different results than compareFileNamesDefault
		//

		// name-only comparisons
		assert(compareFileNamesLower('z', 'A') < 0, 'z comes before A');
		assert(compareFileNamesLower('a', 'A') < 0, 'the same letter sorts lowercase first');
		assert(compareFileNamesLower('â', 'Â') < 0, 'the same accented letter sorts lowercase first');
		assert.deepStrictEqual(['artichoke', 'Artichoke', 'art', 'Art'].sort(compareFileNamesLower), ['art', 'artichoke', 'Art', 'Artichoke'], 'names with the same root and different cases sort lowercase first');
		assert.deepStrictEqual(['email', 'Email', 'émail', 'Émail'].sort(compareFileNamesLower), ['email', 'émail', 'Email', 'Émail'], 'the same base characters with different case or accents sort lowercase first');

		// numeric comparisons
		assert(compareFileNamesLower('art01', 'Art01') < 0, 'a numerically equivalent name of a different case compares lowercase first');
		assert.deepStrictEqual(['a10.txt', 'A2.txt', 'A100.txt', 'a20.txt'].sort(compareFileNamesLower), ['a10.txt', 'a20.txt', 'A2.txt', 'A100.txt'], 'filenames with number and case differences group by case then compare by number');

	});

	test('compareFileExtensionsLower', () => {

		//
		// Comparisons with the same result as compareFileExtensionsDefault
		//

		// name-only comparisons
		assert(compareFileExtensionsLower(null, null) === 0, 'null should be equal');
		assert(compareFileExtensionsLower(null, 'abc') < 0, 'null should come before real files without extensions');
		assert(compareFileExtensionsLower('', '') === 0, 'empty should be equal');
		assert(compareFileExtensionsLower('abc', 'abc') === 0, 'equal names should be equal');
		assert(compareFileExtensionsLower('Z', 'a') > 0, 'Z comes after a');

		// name plus extension comparisons
		assert(compareFileExtensionsLower('file.ext', 'file.ext') === 0, 'equal full filenames should be equal');
		assert(compareFileExtensionsLower('a.ext', 'b.ext') < 0, 'if equal extensions, filenames should be compared');
		assert(compareFileExtensionsLower('file.aaa', 'file.bbb') < 0, 'files with equal names should be compared by extensions');
		assert(compareFileExtensionsLower('bbb.aaa', 'aaa.bbb') < 0, 'files should be compared by extension first');
		assert(compareFileExtensionsLower('a.md', 'b.MD') < 0, 'when extensions are the same except for case, the files sort by name');
		assert(compareFileExtensionsLower('a.MD', 'a.md') === compareLocale('MD', 'md'), 'case differences in extensions sort by locale');

		// dotfile comparisons
		assert(compareFileExtensionsLower('.abc', '.abc') === 0, 'equal dotfiles should be equal');
		assert(compareFileExtensionsLower('.md', '.Gitattributes') > 0, 'dotfiles sort alphabetically regardless of case');
		assert(compareFileExtensionsLower('.env', '.aaa.env') > 0, 'dotfiles sort alphabetically when they contain multiple dots');
		assert(compareFileExtensionsLower('.env', '.env.aaa') < 0, 'dotfiles with the same root sort shortest first');

		// dotfile vs non-dotfile comparisons
		assert(compareFileExtensionsLower(null, '.abc') < 0, 'null should come before dotfiles');
		assert(compareFileExtensionsLower('.env', 'aaa.env') < 0, 'dotfiles come before filenames with extensions');
		assert(compareFileExtensionsLower('.MD', 'a.md') < 0, 'dotfiles sort before lowercase files');
		assert(compareFileExtensionsLower('.env', 'aaa') < 0, 'dotfiles come before filenames without extensions');
		assert(compareFileExtensionsLower('.md', 'A.MD') < 0, 'dotfiles sort before uppercase files');

		// numeric comparisons
		assert(compareFileExtensionsLower('1', '1') === 0, 'numerically equal full names should be equal');
		assert(compareFileExtensionsLower('abc1.txt', 'abc1.txt') === 0, 'equal filenames with numbers should be equal');
		assert(compareFileExtensionsLower('abc1.txt', 'abc2.txt') < 0, 'filenames with numbers should be in numerical order, not alphabetical order');
		assert(compareFileExtensionsLower('abc2.txt', 'abc10.txt') < 0, 'filenames with numbers should be in numerical order');
		assert(compareFileExtensionsLower('abc02.txt', 'abc010.txt') < 0, 'filenames with numbers that have leading zeros sort numerically');
		assert(compareFileExtensionsLower('abc1.10.txt', 'abc1.2.txt') > 0, 'numbers with dots between them are treated as two separate numbers, not one decimal number');
		assert(compareFileExtensionsLower('abc2.txt2', 'abc1.txt10') < 0, 'extensions with numbers should be in numerical order, not alphabetical order');
		assert(compareFileExtensionsLower('txt.abc1', 'txt.abc1') === 0, 'equal extensions with numbers should be equal');
		assert(compareFileExtensionsLower('txt.abc1', 'txt.abc2') < 0, 'extensions with numbers should be in numerical order, not alphabetical order');
		assert(compareFileExtensionsLower('txt.abc2', 'txt.abc10') < 0, 'extensions with numbers should be in numerical order even when they are multiple digits long');
		assert(compareFileExtensionsLower('a.ext1', 'b.ext1') < 0, 'if equal extensions with numbers, full filenames should be compared');
		assert(compareFileExtensionsLower('abc.txt01', 'abc.txt1') > 0, 'extensions with equal numbers should be in shortest-first order');
		assert(compareFileExtensionsLower('abc02.txt', 'abc002.txt') < 0, 'filenames with equivalent numbers and leading zeros sort shortest string first');
		assert(compareFileExtensionsLower('txt.abc01', 'txt.abc1') > 0, 'extensions with equivalent numbers sort shortest extension first');
		assert(compareFileExtensionsLower('a.ext1', 'b.Ext1') < 0, 'if extensions with numbers are equal except for case, full filenames should be compared');
		assert(compareFileExtensionsLower('a.ext1', 'a.Ext1') === compareLocale('a.ext1', 'a.Ext1'), 'if extensions with numbers are equal except for case, filenames are sorted in locale order');

		//
		// Comparisons with different results than compareFileExtensionsDefault
		//

		// name-only comparisons
		assert(compareFileExtensionsLower('z', 'A') < 0, 'z comes before A');
		assert(compareFileExtensionsLower('a', 'A') < 0, 'the same letter sorts lowercase first');
		assert(compareFileExtensionsLower('â', 'Â') < 0, 'the same accented letter sorts lowercase first');
		assert.deepStrictEqual(['artichoke', 'Artichoke', 'art', 'Art'].sort(compareFileExtensionsLower), ['art', 'artichoke', 'Art', 'Artichoke'], 'names with the same root and different cases sort lowercase names first');
		assert.deepStrictEqual(['email', 'Email', 'émail', 'Émail'].sort(compareFileExtensionsLower), ['email', 'émail', 'Email', 'Émail'], 'the same base characters with different case or accents sort lowercase names first');

		// name plus extension comparisons
		assert(compareFileExtensionsLower('a.md', 'A.md') < 0, 'case differences in names sort lowercase first');
		assert(compareFileExtensionsLower('art01', 'Art01') < 0, 'a numerically equivalent word of a different case sorts lowercase first');
		assert.deepStrictEqual(['a10.txt', 'A2.txt', 'A100.txt', 'a20.txt'].sort(compareFileExtensionsLower), ['a10.txt', 'a20.txt', 'A2.txt', 'A100.txt'], 'filenames with number and case differences group by case then sort by number');
		assert(compareFileExtensionsLower('aggregate.go', 'aggregate_repo.go') > 0, 'when extensions are equal, compares full filenames');

	});

	test('compareFileNamesUnicode', () => {

		//
		// Comparisons with the same results as compareFileNamesDefault
		//

		// name-only comparisons
		assert(compareFileNamesUnicode(null, null) === 0, 'null should be equal');
		assert(compareFileNamesUnicode(null, 'abc') < 0, 'null should be come before real values');
		assert(compareFileNamesUnicode('', '') === 0, 'empty should be equal');
		assert(compareFileNamesUnicode('abc', 'abc') === 0, 'equal names should be equal');
		assert(compareFileNamesUnicode('z', 'A') > 0, 'z comes after A');

		// name plus extension comparisons
		assert(compareFileNamesUnicode('file.ext', 'file.ext') === 0, 'equal full names should be equal');
		assert(compareFileNamesUnicode('a.ext', 'b.ext') < 0, 'if equal extensions, filenames should be compared');
		assert(compareFileNamesUnicode('file.aaa', 'file.bbb') < 0, 'files with equal names should be compared by extensions');
		assert(compareFileNamesUnicode('bbb.aaa', 'aaa.bbb') > 0, 'files should be compared by names even if extensions compare differently');

		// dotfile comparisons
		assert(compareFileNamesUnicode('.abc', '.abc') === 0, 'equal dotfile names should be equal');
		assert(compareFileNamesUnicode('.env.', '.gitattributes') < 0, 'filenames starting with dots and with extensions should still sort properly');
		assert(compareFileNamesUnicode('.env', '.aaa.env') > 0, 'dotfiles sort alphabetically when they contain multiple dots');
		assert(compareFileNamesUnicode('.env', '.env.aaa') < 0, 'dotfiles with the same root sort shortest first');

		// dotfile vs non-dotfile comparisons
		assert(compareFileNamesUnicode(null, '.abc') < 0, 'null should come before dotfiles');
		assert(compareFileNamesUnicode('.env', 'aaa') < 0, 'dotfiles come before filenames without extensions');
		assert(compareFileNamesUnicode('.env', 'aaa.env') < 0, 'dotfiles come before filenames with extensions');
		assert(compareFileNamesUnicode('.md', 'A.MD') < 0, 'dotfiles sort before uppercase files');
		assert(compareFileNamesUnicode('.MD', 'a.md') < 0, 'dotfiles sort before lowercase files');

		// numeric comparisons
		assert(compareFileNamesUnicode('1', '1') === 0, 'numerically equal full names should be equal');
		assert(compareFileNamesUnicode('abc1.txt', 'abc1.txt') === 0, 'equal filenames with numbers should be equal');
		assert(compareFileNamesUnicode('abc1.txt', 'abc2.txt') < 0, 'filenames with numbers should be in numerical order, not alphabetical order');
		assert(compareFileNamesUnicode('a.ext1', 'b.Ext1') < 0, 'if names are different and extensions with numbers are equal except for case, filenames are sorted by unicode full filename');
		assert(compareFileNamesUnicode('a.ext1', 'a.Ext1') > 0, 'if names are equal and extensions with numbers are equal except for case, filenames are sorted by unicode full filename');

		//
		// Comparisons with different results than compareFileNamesDefault
		//

		// name-only comparisons
		assert(compareFileNamesUnicode('Z', 'a') < 0, 'Z comes before a');
		assert(compareFileNamesUnicode('a', 'A') > 0, 'the same letter sorts uppercase first');
		assert(compareFileNamesUnicode('â', 'Â') > 0, 'the same accented letter sorts uppercase first');
		assert.deepStrictEqual(['artichoke', 'Artichoke', 'art', 'Art'].sort(compareFileNamesUnicode), ['Art', 'Artichoke', 'art', 'artichoke'], 'names with the same root and different cases sort uppercase first');
		assert.deepStrictEqual(['email', 'Email', 'émail', 'Émail'].sort(compareFileNamesUnicode), ['Email', 'email', 'Émail', 'émail'], 'the same base characters with different case or accents sort in unicode order');

		// name plus extension comparisons
		assert(compareFileNamesUnicode('aggregate.go', 'aggregate_repo.go') < 0, 'compares the whole name in unicode order, but dot comes before underscore');

		// dotfile comparisons
		assert(compareFileNamesUnicode('.aaa_env', '.aaa.env') > 0, 'an underscore in a dotfile name will sort after a dot');

		// numeric comparisons
		assert(compareFileNamesUnicode('abc2.txt', 'abc10.txt') > 0, 'filenames with numbers should be in unicode order even when they are multiple digits long');
		assert(compareFileNamesUnicode('abc02.txt', 'abc010.txt') > 0, 'filenames with numbers that have leading zeros sort in unicode order');
		assert(compareFileNamesUnicode('abc1.10.txt', 'abc1.2.txt') < 0, 'numbers with dots between them are sorted in unicode order');
		assert(compareFileNamesUnicode('abc02.txt', 'abc002.txt') > 0, 'filenames with equivalent numbers and leading zeros sort in unicode order');
		assert(compareFileNamesUnicode('abc.txt1', 'abc.txt01') > 0, 'same name plus extensions with equal numbers sort in unicode order');
		assert(compareFileNamesUnicode('art01', 'Art01') > 0, 'a numerically equivalent name of a different case compares uppercase first');
		assert.deepStrictEqual(['a10.txt', 'A2.txt', 'A100.txt', 'a20.txt'].sort(compareFileNamesUnicode), ['A100.txt', 'A2.txt', 'a10.txt', 'a20.txt'], 'filenames with number and case differences sort in unicode order');

	});

	test('compareFileExtensionsUnicode', () => {

		//
		// Comparisons with the same result as compareFileExtensionsDefault
		//

		// name-only comparisons
		assert(compareFileExtensionsUnicode(null, null) === 0, 'null should be equal');
		assert(compareFileExtensionsUnicode(null, 'abc') < 0, 'null should come before real files without extensions');
		assert(compareFileExtensionsUnicode('', '') === 0, 'empty should be equal');
		assert(compareFileExtensionsUnicode('abc', 'abc') === 0, 'equal names should be equal');
		assert(compareFileExtensionsUnicode('z', 'A') > 0, 'z comes after A');

		// name plus extension comparisons
		assert(compareFileExtensionsUnicode('file.ext', 'file.ext') === 0, 'equal full filenames should be equal');
		assert(compareFileExtensionsUnicode('a.ext', 'b.ext') < 0, 'if equal extensions, filenames should be compared');
		assert(compareFileExtensionsUnicode('file.aaa', 'file.bbb') < 0, 'files with equal names should be compared by extensions');
		assert(compareFileExtensionsUnicode('bbb.aaa', 'aaa.bbb') < 0, 'files should be compared by extension first');
		assert(compareFileExtensionsUnicode('a.md', 'b.MD') < 0, 'when extensions are the same except for case, the files sort by name');
		assert(compareFileExtensionsUnicode('a.MD', 'a.md') < 0, 'case differences in extensions sort in unicode order');

		// dotfile comparisons
		assert(compareFileExtensionsUnicode('.abc', '.abc') === 0, 'equal dotfiles should be equal');
		assert(compareFileExtensionsUnicode('.md', '.Gitattributes') > 0, 'dotfiles sort alphabetically regardless of case');
		assert(compareFileExtensionsUnicode('.env', '.aaa.env') > 0, 'dotfiles sort alphabetically when they contain multiple dots');
		assert(compareFileExtensionsUnicode('.env', '.env.aaa') < 0, 'dotfiles with the same root sort shortest first');

		// dotfile vs non-dotfile comparisons
		assert(compareFileExtensionsUnicode(null, '.abc') < 0, 'null should come before dotfiles');
		assert(compareFileExtensionsUnicode('.env', 'aaa.env') < 0, 'dotfiles come before filenames with extensions');
		assert(compareFileExtensionsUnicode('.MD', 'a.md') < 0, 'dotfiles sort before lowercase files');
		assert(compareFileExtensionsUnicode('.env', 'aaa') < 0, 'dotfiles come before filenames without extensions');
		assert(compareFileExtensionsUnicode('.md', 'A.MD') < 0, 'dotfiles sort before uppercase files');

		// numeric comparisons
		assert(compareFileExtensionsUnicode('1', '1') === 0, 'numerically equal full names should be equal');
		assert(compareFileExtensionsUnicode('abc1.txt', 'abc1.txt') === 0, 'equal filenames with numbers should be equal');
		assert(compareFileExtensionsUnicode('abc1.txt', 'abc2.txt') < 0, 'filenames with numbers should be in numerical order, not alphabetical order');
		assert(compareFileExtensionsUnicode('txt.abc1', 'txt.abc1') === 0, 'equal extensions with numbers should be equal');
		assert(compareFileExtensionsUnicode('txt.abc1', 'txt.abc2') < 0, 'extensions with numbers should be in numerical order, not alphabetical order');
		assert(compareFileExtensionsUnicode('a.ext1', 'b.ext1') < 0, 'if equal extensions with numbers, full filenames should be compared');

		//
		// Comparisons with different results than compareFileExtensionsDefault
		//

		// name-only comparisons
		assert(compareFileExtensionsUnicode('Z', 'a') < 0, 'Z comes before a');
		assert(compareFileExtensionsUnicode('a', 'A') > 0, 'the same letter sorts uppercase first');
		assert(compareFileExtensionsUnicode('â', 'Â') > 0, 'the same accented letter sorts uppercase first');
		assert.deepStrictEqual(['artichoke', 'Artichoke', 'art', 'Art'].sort(compareFileExtensionsUnicode), ['Art', 'Artichoke', 'art', 'artichoke'], 'names with the same root and different cases sort uppercase names first');
		assert.deepStrictEqual(['email', 'Email', 'émail', 'Émail'].sort(compareFileExtensionsUnicode), ['Email', 'email', 'Émail', 'émail'], 'the same base characters with different case or accents sort in unicode order');

		// name plus extension comparisons
		assert(compareFileExtensionsUnicode('a.MD', 'a.md') < 0, 'case differences in extensions sort by uppercase extension first');
		assert(compareFileExtensionsUnicode('a.md', 'A.md') > 0, 'case differences in names sort uppercase first');
		assert(compareFileExtensionsUnicode('art01', 'Art01') > 0, 'a numerically equivalent name of a different case sorts uppercase first');
		assert.deepStrictEqual(['a10.txt', 'A2.txt', 'A100.txt', 'a20.txt'].sort(compareFileExtensionsUnicode), ['A100.txt', 'A2.txt', 'a10.txt', 'a20.txt'], 'filenames with number and case differences sort in unicode order');
		assert(compareFileExtensionsUnicode('aggregate.go', 'aggregate_repo.go') < 0, 'when extensions are equal, compares full filenames in unicode order');

		// numeric comparisons
		assert(compareFileExtensionsUnicode('abc2.txt', 'abc10.txt') > 0, 'filenames with numbers should be in unicode order');
		assert(compareFileExtensionsUnicode('abc02.txt', 'abc010.txt') > 0, 'filenames with numbers that have leading zeros sort in unicode order');
		assert(compareFileExtensionsUnicode('abc1.10.txt', 'abc1.2.txt') < 0, 'numbers with dots between them sort in unicode order');
		assert(compareFileExtensionsUnicode('abc2.txt2', 'abc1.txt10') > 0, 'extensions with numbers should be in unicode order');
		assert(compareFileExtensionsUnicode('txt.abc2', 'txt.abc10') > 0, 'extensions with numbers should be in unicode order even when they are multiple digits long');
		assert(compareFileExtensionsUnicode('abc.txt01', 'abc.txt1') < 0, 'extensions with equal numbers should be in unicode order');
		assert(compareFileExtensionsUnicode('abc02.txt', 'abc002.txt') > 0, 'filenames with equivalent numbers and leading zeros sort in unicode order');
		assert(compareFileExtensionsUnicode('txt.abc01', 'txt.abc1') < 0, 'extensions with equivalent numbers sort in unicode order');
		assert(compareFileExtensionsUnicode('a.ext1', 'b.Ext1') < 0, 'if extensions with numbers are equal except for case, unicode full filenames should be compared');
		assert(compareFileExtensionsUnicode('a.ext1', 'a.Ext1') > 0, 'if extensions with numbers are equal except for case, unicode full filenames should be compared');
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/dom.test.ts]---
Location: vscode-main/src/vs/base/test/browser/dom.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { $, h, trackAttributes, copyAttributes, disposableWindowInterval, getWindows, getWindowsCount, getWindowId, getWindowById, hasWindow, getWindow, getDocument, isHTMLElement, SafeTriangle } from '../../browser/dom.js';
import { asCssValueWithDefault } from '../../../base/browser/cssValue.js';
import { ensureCodeWindow, isAuxiliaryWindow, mainWindow } from '../../browser/window.js';
import { DeferredPromise, timeout } from '../../common/async.js';
import { runWithFakedTimers } from '../common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../common/utils.js';

suite('dom', () => {
	test('hasClass', () => {

		const element = document.createElement('div');
		element.className = 'foobar boo far';

		assert(element.classList.contains('foobar'));
		assert(element.classList.contains('boo'));
		assert(element.classList.contains('far'));
		assert(!element.classList.contains('bar'));
		assert(!element.classList.contains('foo'));
		assert(!element.classList.contains(''));
	});

	test('removeClass', () => {

		let element = document.createElement('div');
		element.className = 'foobar boo far';

		element.classList.remove('boo');
		assert(element.classList.contains('far'));
		assert(!element.classList.contains('boo'));
		assert(element.classList.contains('foobar'));
		assert.strictEqual(element.className, 'foobar far');

		element = document.createElement('div');
		element.className = 'foobar boo far';

		element.classList.remove('far');
		assert(!element.classList.contains('far'));
		assert(element.classList.contains('boo'));
		assert(element.classList.contains('foobar'));
		assert.strictEqual(element.className, 'foobar boo');

		element.classList.remove('boo');
		assert(!element.classList.contains('far'));
		assert(!element.classList.contains('boo'));
		assert(element.classList.contains('foobar'));
		assert.strictEqual(element.className, 'foobar');

		element.classList.remove('foobar');
		assert(!element.classList.contains('far'));
		assert(!element.classList.contains('boo'));
		assert(!element.classList.contains('foobar'));
		assert.strictEqual(element.className, '');
	});

	test('removeClass should consider hyphens', function () {
		const element = document.createElement('div');

		element.classList.add('foo-bar');
		element.classList.add('bar');

		assert(element.classList.contains('foo-bar'));
		assert(element.classList.contains('bar'));

		element.classList.remove('bar');
		assert(element.classList.contains('foo-bar'));
		assert(!element.classList.contains('bar'));

		element.classList.remove('foo-bar');
		assert(!element.classList.contains('foo-bar'));
		assert(!element.classList.contains('bar'));
	});

	suite('$', () => {
		test('should build simple nodes', () => {
			const div = $('div');
			assert(div);
			assert(isHTMLElement(div));
			assert.strictEqual(div.tagName, 'DIV');
			assert(!div.firstChild);
		});

		test('should build nodes with id', () => {
			const div = $('div#foo');
			assert(div);
			assert(isHTMLElement(div));
			assert.strictEqual(div.tagName, 'DIV');
			assert.strictEqual(div.id, 'foo');
		});

		test('should build nodes with class-name', () => {
			const div = $('div.foo');
			assert(div);
			assert(isHTMLElement(div));
			assert.strictEqual(div.tagName, 'DIV');
			assert.strictEqual(div.className, 'foo');
		});

		test('should build nodes with attributes', () => {
			let div = $('div', { class: 'test' });
			assert.strictEqual(div.className, 'test');

			div = $('div', undefined);
			assert.strictEqual(div.className, '');
		});

		test('should build nodes with children', () => {
			let div = $('div', undefined, $('span', { id: 'demospan' }));
			const firstChild = div.firstChild as HTMLElement;
			assert.strictEqual(firstChild.tagName, 'SPAN');
			assert.strictEqual(firstChild.id, 'demospan');

			div = $('div', undefined, 'hello');

			assert.strictEqual(div.firstChild && div.firstChild.textContent, 'hello');
		});

		test('should build nodes with text children', () => {
			const div = $('div', undefined, 'foobar');
			const firstChild = div.firstChild as HTMLElement;
			assert.strictEqual(firstChild.tagName, undefined);
			assert.strictEqual(firstChild.textContent, 'foobar');
		});
	});

	suite('h', () => {
		test('should build simple nodes', () => {
			const div = h('div');
			assert(isHTMLElement(div.root));
			assert.strictEqual(div.root.tagName, 'DIV');

			const span = h('span');
			assert(isHTMLElement(span.root));
			assert.strictEqual(span.root.tagName, 'SPAN');

			const img = h('img');
			assert(isHTMLElement(img.root));
			assert.strictEqual(img.root.tagName, 'IMG');
		});

		test('should handle ids and classes', () => {
			const divId = h('div#myid');
			assert.strictEqual(divId.root.tagName, 'DIV');
			assert.strictEqual(divId.root.id, 'myid');

			const divClass = h('div.a');
			assert.strictEqual(divClass.root.tagName, 'DIV');
			assert.strictEqual(divClass.root.classList.length, 1);
			assert(divClass.root.classList.contains('a'));

			const divClasses = h('div.a.b.c');
			assert.strictEqual(divClasses.root.tagName, 'DIV');
			assert.strictEqual(divClasses.root.classList.length, 3);
			assert(divClasses.root.classList.contains('a'));
			assert(divClasses.root.classList.contains('b'));
			assert(divClasses.root.classList.contains('c'));

			const divAll = h('div#myid.a.b.c');
			assert.strictEqual(divAll.root.tagName, 'DIV');
			assert.strictEqual(divAll.root.id, 'myid');
			assert.strictEqual(divAll.root.classList.length, 3);
			assert(divAll.root.classList.contains('a'));
			assert(divAll.root.classList.contains('b'));
			assert(divAll.root.classList.contains('c'));

			const spanId = h('span#myid');
			assert.strictEqual(spanId.root.tagName, 'SPAN');
			assert.strictEqual(spanId.root.id, 'myid');

			const spanClass = h('span.a');
			assert.strictEqual(spanClass.root.tagName, 'SPAN');
			assert.strictEqual(spanClass.root.classList.length, 1);
			assert(spanClass.root.classList.contains('a'));

			const spanClasses = h('span.a.b.c');
			assert.strictEqual(spanClasses.root.tagName, 'SPAN');
			assert.strictEqual(spanClasses.root.classList.length, 3);
			assert(spanClasses.root.classList.contains('a'));
			assert(spanClasses.root.classList.contains('b'));
			assert(spanClasses.root.classList.contains('c'));

			const spanAll = h('span#myid.a.b.c');
			assert.strictEqual(spanAll.root.tagName, 'SPAN');
			assert.strictEqual(spanAll.root.id, 'myid');
			assert.strictEqual(spanAll.root.classList.length, 3);
			assert(spanAll.root.classList.contains('a'));
			assert(spanAll.root.classList.contains('b'));
			assert(spanAll.root.classList.contains('c'));
		});

		test('should implicitly handle ids and classes', () => {
			const divId = h('#myid');
			assert.strictEqual(divId.root.tagName, 'DIV');
			assert.strictEqual(divId.root.id, 'myid');

			const divClass = h('.a');
			assert.strictEqual(divClass.root.tagName, 'DIV');
			assert.strictEqual(divClass.root.classList.length, 1);
			assert(divClass.root.classList.contains('a'));

			const divClasses = h('.a.b.c');
			assert.strictEqual(divClasses.root.tagName, 'DIV');
			assert.strictEqual(divClasses.root.classList.length, 3);
			assert(divClasses.root.classList.contains('a'));
			assert(divClasses.root.classList.contains('b'));
			assert(divClasses.root.classList.contains('c'));

			const divAll = h('#myid.a.b.c');
			assert.strictEqual(divAll.root.tagName, 'DIV');
			assert.strictEqual(divAll.root.id, 'myid');
			assert.strictEqual(divAll.root.classList.length, 3);
			assert(divAll.root.classList.contains('a'));
			assert(divAll.root.classList.contains('b'));
			assert(divAll.root.classList.contains('c'));
		});

		test('should handle @ identifiers', () => {
			const implicit = h('@el');
			assert.strictEqual(implicit.root, implicit.el);
			assert.strictEqual(implicit.el.tagName, 'DIV');

			const explicit = h('div@el');
			assert.strictEqual(explicit.root, explicit.el);
			assert.strictEqual(explicit.el.tagName, 'DIV');

			const implicitId = h('#myid@el');
			assert.strictEqual(implicitId.root, implicitId.el);
			assert.strictEqual(implicitId.el.tagName, 'DIV');
			assert.strictEqual(implicitId.root.id, 'myid');

			const explicitId = h('div#myid@el');
			assert.strictEqual(explicitId.root, explicitId.el);
			assert.strictEqual(explicitId.el.tagName, 'DIV');
			assert.strictEqual(explicitId.root.id, 'myid');

			const implicitClass = h('.a@el');
			assert.strictEqual(implicitClass.root, implicitClass.el);
			assert.strictEqual(implicitClass.el.tagName, 'DIV');
			assert.strictEqual(implicitClass.root.classList.length, 1);
			assert(implicitClass.root.classList.contains('a'));

			const explicitClass = h('div.a@el');
			assert.strictEqual(explicitClass.root, explicitClass.el);
			assert.strictEqual(explicitClass.el.tagName, 'DIV');
			assert.strictEqual(explicitClass.root.classList.length, 1);
			assert(explicitClass.root.classList.contains('a'));
		});
	});

	test('should recurse', () => {
		const result = h('div.code-view', [
			h('div.title@title'),
			h('div.container', [
				h('div.gutter@gutterDiv'),
				h('span@editor'),
			]),
		]);

		assert.strictEqual(result.root.tagName, 'DIV');
		assert.strictEqual(result.root.className, 'code-view');
		assert.strictEqual(result.root.childElementCount, 2);
		assert.strictEqual(result.root.firstElementChild, result.title);
		assert.strictEqual(result.title.tagName, 'DIV');
		assert.strictEqual(result.title.className, 'title');
		assert.strictEqual(result.title.childElementCount, 0);
		assert.strictEqual(result.gutterDiv.tagName, 'DIV');
		assert.strictEqual(result.gutterDiv.className, 'gutter');
		assert.strictEqual(result.gutterDiv.childElementCount, 0);
		assert.strictEqual(result.editor.tagName, 'SPAN');
		assert.strictEqual(result.editor.className, '');
		assert.strictEqual(result.editor.childElementCount, 0);
	});

	test('cssValueWithDefault', () => {
		assert.strictEqual(asCssValueWithDefault('red', 'blue'), 'red');
		assert.strictEqual(asCssValueWithDefault(undefined, 'blue'), 'blue');
		assert.strictEqual(asCssValueWithDefault('var(--my-var)', 'blue'), 'var(--my-var, blue)');
		assert.strictEqual(asCssValueWithDefault('var(--my-var, red)', 'blue'), 'var(--my-var, red)');
		assert.strictEqual(asCssValueWithDefault('var(--my-var, var(--my-var2))', 'blue'), 'var(--my-var, var(--my-var2, blue))');
	});

	test('copyAttributes', () => {
		const elementSource = document.createElement('div');
		elementSource.setAttribute('foo', 'bar');
		elementSource.setAttribute('bar', 'foo');

		const elementTarget = document.createElement('div');
		copyAttributes(elementSource, elementTarget);

		assert.strictEqual(elementTarget.getAttribute('foo'), 'bar');
		assert.strictEqual(elementTarget.getAttribute('bar'), 'foo');
	});

	test('trackAttributes (unfiltered)', async () => {
		return runWithFakedTimers({ useFakeTimers: true }, async () => {
			const elementSource = document.createElement('div');
			const elementTarget = document.createElement('div');

			const disposable = trackAttributes(elementSource, elementTarget);

			elementSource.setAttribute('foo', 'bar');
			elementSource.setAttribute('bar', 'foo');

			await timeout(1);

			assert.strictEqual(elementTarget.getAttribute('foo'), 'bar');
			assert.strictEqual(elementTarget.getAttribute('bar'), 'foo');

			disposable.dispose();
		});
	});

	test('trackAttributes (filtered)', async () => {
		return runWithFakedTimers({ useFakeTimers: true }, async () => {
			const elementSource = document.createElement('div');
			const elementTarget = document.createElement('div');

			const disposable = trackAttributes(elementSource, elementTarget, ['foo']);

			elementSource.setAttribute('foo', 'bar');
			elementSource.setAttribute('bar', 'foo');

			await timeout(1);

			assert.strictEqual(elementTarget.getAttribute('foo'), 'bar');
			assert.strictEqual(elementTarget.getAttribute('bar'), null);

			disposable.dispose();
		});
	});

	test('window utilities', () => {
		const windows = Array.from(getWindows());
		assert.strictEqual(windows.length, 1);
		assert.strictEqual(getWindowsCount(), 1);
		const windowId = getWindowId(mainWindow);
		assert.ok(typeof windowId === 'number');
		assert.strictEqual(getWindowById(windowId)?.window, mainWindow);
		assert.strictEqual(getWindowById(undefined, true).window, mainWindow);
		assert.strictEqual(hasWindow(windowId), true);
		assert.strictEqual(isAuxiliaryWindow(mainWindow), false);
		ensureCodeWindow(mainWindow, 1);
		assert.ok(typeof mainWindow.vscodeWindowId === 'number');

		const div = document.createElement('div');
		assert.strictEqual(getWindow(div), mainWindow);
		assert.strictEqual(getDocument(div), mainWindow.document);

		const event = document.createEvent('MouseEvent');
		assert.strictEqual(getWindow(event), mainWindow);
		assert.strictEqual(getDocument(event), mainWindow.document);
	});

	suite('disposableWindowInterval', () => {
		test('basics', async () => {
			let count = 0;
			const promise = new DeferredPromise<void>();
			const interval = disposableWindowInterval(mainWindow, () => {
				count++;
				if (count === 3) {
					promise.complete(undefined);
					return true;
				} else {
					return false;
				}
			}, 0, 10);

			await promise.p;
			assert.strictEqual(count, 3);
			interval.dispose();
		});

		test('iterations', async () => {
			let count = 0;
			const interval = disposableWindowInterval(mainWindow, () => {
				count++;

				return false;
			}, 0, 0);

			await timeout(5);
			assert.strictEqual(count, 0);
			interval.dispose();
		});

		test('dispose', async () => {
			let count = 0;
			const interval = disposableWindowInterval(mainWindow, () => {
				count++;

				return false;
			}, 0, 10);

			interval.dispose();
			await timeout(5);
			assert.strictEqual(count, 0);
		});
	});

	suite('SafeTriangle', () => {
		const fakeElement = (left: number, right: number, top: number, bottom: number): HTMLElement => {
			return { getBoundingClientRect: () => ({ left, right, top, bottom }) } as HTMLElement;
		};

		test('works', () => {
			const safeTriangle = new SafeTriangle(0, 0, fakeElement(10, 20, 10, 20));

			assert.strictEqual(safeTriangle.contains(5, 5), true); // in triangle region
			assert.strictEqual(safeTriangle.contains(15, 5), false);
			assert.strictEqual(safeTriangle.contains(25, 5), false);

			assert.strictEqual(safeTriangle.contains(5, 15), false);
			assert.strictEqual(safeTriangle.contains(15, 15), true);
			assert.strictEqual(safeTriangle.contains(25, 15), false);

			assert.strictEqual(safeTriangle.contains(5, 25), false);
			assert.strictEqual(safeTriangle.contains(15, 25), false);
			assert.strictEqual(safeTriangle.contains(25, 25), false);
		});

		test('other dirations', () => {
			const a = new SafeTriangle(30, 30, fakeElement(10, 20, 10, 20));
			assert.strictEqual(a.contains(25, 25), true);

			const b = new SafeTriangle(0, 30, fakeElement(10, 20, 10, 20));
			assert.strictEqual(b.contains(5, 25), true);

			const c = new SafeTriangle(30, 0, fakeElement(10, 20, 10, 20));
			assert.strictEqual(c.contains(25, 5), true);
		});
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/domSanitize.test.ts]---
Location: vscode-main/src/vs/base/test/browser/domSanitize.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { sanitizeHtml } from '../../browser/domSanitize.js';
import { Schemas } from '../../common/network.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../common/utils.js';

suite('DomSanitize', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('removes unsupported tags by default', () => {
		const html = '<div>safe<script>alert(1)</script>content</div>';
		const result = sanitizeHtml(html);
		const str = result.toString();

		assert.ok(str.includes('<div>'));
		assert.ok(str.includes('safe'));
		assert.ok(str.includes('content'));
		assert.ok(!str.includes('<script>'));
		assert.ok(!str.includes('alert(1)'));
	});

	test('removes unsupported attributes by default', () => {
		const html = '<div onclick="alert(1)" title="safe">content</div>';
		const result = sanitizeHtml(html);
		const str = result.toString();

		assert.ok(str.includes('<div title="safe">'));
		assert.ok(!str.includes('onclick'));
		assert.ok(!str.includes('alert(1)'));
	});

	test('allows custom tags via config', () => {
		{
			const html = '<div>removed</div><custom-tag>hello</custom-tag>';
			const result = sanitizeHtml(html, {
				allowedTags: { override: ['custom-tag'] }
			});
			assert.strictEqual(result.toString(), 'removed<custom-tag>hello</custom-tag>');
		}
		{
			const html = '<div>kept</div><augmented-tag>world</augmented-tag>';
			const result = sanitizeHtml(html, {
				allowedTags: { augment: ['augmented-tag'] }
			});
			assert.strictEqual(result.toString(), '<div>kept</div><augmented-tag>world</augmented-tag>');
		}
	});

	test('allows custom attributes via config', () => {
		const html = '<div custom-attr="value">content</div>';
		const result = sanitizeHtml(html, {
			allowedAttributes: { override: ['custom-attr'] }
		});
		const str = result.toString();

		assert.ok(str.includes('custom-attr="value"'));
	});

	test('Attributes in config should be case insensitive', () => {
		const html = '<div Custom-Attr="value">content</div>';

		{
			const result = sanitizeHtml(html, {
				allowedAttributes: { override: ['custom-attr'] }
			});
			assert.ok(result.toString().includes('custom-attr="value"'));
		}
		{
			const result = sanitizeHtml(html, {
				allowedAttributes: { override: ['CUSTOM-ATTR'] }
			});
			assert.ok(result.toString().includes('custom-attr="value"'));
		}
	});

	test('removes unsupported protocols for href by default', () => {
		const html = '<a href="javascript:alert(1)">bad link</a>';
		const result = sanitizeHtml(html);
		const str = result.toString();

		assert.ok(str.includes('<a>bad link</a>'));
		assert.ok(!str.includes('javascript:'));
	});

	test('removes unsupported protocols for src by default', () => {
		const html = '<img alt="text" src="javascript:alert(1)">';
		const result = sanitizeHtml(html);
		const str = result.toString();

		assert.ok(str.includes('<img alt="text">'));
		assert.ok(!str.includes('javascript:'));
	});

	test('allows safe protocols for href', () => {
		const html = '<a href="https://example.com">safe link</a>';
		const result = sanitizeHtml(html);

		assert.ok(result.toString().includes('href="https://example.com"'));
	});

	test('allows fragment links', () => {
		const html = '<a href="#section">fragment link</a>';
		const result = sanitizeHtml(html);
		const str = result.toString();

		assert.ok(str.includes('href="#section"'));
	});

	test('removes data images by default', () => {
		const html = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==">';
		const result = sanitizeHtml(html);
		const str = result.toString();

		assert.ok(str.includes('<img>'));
		assert.ok(!str.includes('src="data:'));
	});

	test('allows data images when enabled', () => {
		const html = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==">';
		const result = sanitizeHtml(html, {
			allowedMediaProtocols: { override: [Schemas.data] }
		});

		assert.ok(result.toString().includes('src="data:image/png;base64,'));
	});

	test('Removes relative paths for img src by default', () => {
		const html = '<img src="path/img.png">';
		const result = sanitizeHtml(html);
		assert.strictEqual(result.toString(), '<img>');
	});

	test('Can allow relative paths for image', () => {
		const html = '<img src="path/img.png">';
		const result = sanitizeHtml(html, {
			allowRelativeMediaPaths: true,
		});
		assert.strictEqual(result.toString(), '<img src="path/img.png">');
	});

	test('Supports dynamic attribute sanitization', () => {
		const html = '<div title="a" other="1">text1</div><div title="b" other="2">text2</div>';
		const result = sanitizeHtml(html, {
			allowedAttributes: {
				override: [
					{
						attributeName: 'title',
						shouldKeep: (_el, data) => {
							return data.attrValue.includes('b');
						}
					}
				]
			}
		});
		assert.strictEqual(result.toString(), '<div>text1</div><div title="b">text2</div>');
	});

	test('Supports changing attributes in dynamic sanitization', () => {
		const html = '<div title="abc" other="1">text1</div><div title="xyz" other="2">text2</div>';
		const result = sanitizeHtml(html, {
			allowedAttributes: {
				override: [
					{
						attributeName: 'title',
						shouldKeep: (_el, data) => {
							if (data.attrValue === 'abc') {
								return false;
							}
							return data.attrValue + data.attrValue;
						}
					}
				]
			}
		});
		// xyz title should be preserved and doubled
		assert.strictEqual(result.toString(), '<div>text1</div><div title="xyzxyz">text2</div>');
	});

	test('Attr name should clear previously set dynamic sanitizer', () => {
		const html = '<div title="abc" other="1">text1</div><div title="xyz" other="2">text2</div>';
		const result = sanitizeHtml(html, {
			allowedAttributes: {
				override: [
					{
						attributeName: 'title',
						shouldKeep: () => false
					},
					'title' // Should allow everything since it comes after custom rule
				]
			}
		});
		assert.strictEqual(result.toString(), '<div title="abc">text1</div><div title="xyz">text2</div>');
	});

	suite('replaceWithPlaintext', () => {

		test('replaces unsupported tags with plaintext representation', () => {
			const html = '<div>safe<script>alert(1)</script>content</div>';
			const result = sanitizeHtml(html, {
				replaceWithPlaintext: true
			});
			const str = result.toString();
			assert.strictEqual(str, `<div>safe&lt;script&gt;alert(1)&lt;/script&gt;content</div>`);
		});

		test('handles self-closing tags correctly', () => {
			const html = '<div><input type="text"><custom-input /></div>';
			const result = sanitizeHtml(html, {
				replaceWithPlaintext: true
			});
			assert.strictEqual(result.toString(), '<div>&lt;input type="text"&gt;&lt;custom-input&gt;&lt;/custom-input&gt;</div>');
		});

		test('handles tags with attributes', () => {
			const html = '<div><unknown-tag class="test" id="myid">content</unknown-tag></div>';
			const result = sanitizeHtml(html, {
				replaceWithPlaintext: true
			});
			assert.strictEqual(result.toString(), '<div>&lt;unknown-tag class="test" id="myid"&gt;content&lt;/unknown-tag&gt;</div>');
		});

		test('handles nested unsupported tags', () => {
			const html = '<div><outer><inner>nested</inner></outer></div>';
			const result = sanitizeHtml(html, {
				replaceWithPlaintext: true
			});
			assert.strictEqual(result.toString(), '<div>&lt;outer&gt;&lt;inner&gt;nested&lt;/inner&gt;&lt;/outer&gt;</div>');
		});

		test('handles comments correctly', () => {
			const html = '<div><!-- this is a comment -->content</div>';
			const result = sanitizeHtml(html, {
				replaceWithPlaintext: true
			});
			assert.strictEqual(result.toString(), '<div>&lt;!-- this is a comment --&gt;content</div>');
		});

		test('handles empty tags', () => {
			const html = '<div><empty></empty></div>';
			const result = sanitizeHtml(html, {
				replaceWithPlaintext: true
			});
			assert.strictEqual(result.toString(), '<div>&lt;empty&gt;&lt;/empty&gt;</div>');
		});

		test('works with custom allowed tags configuration', () => {
			const html = '<div><custom>allowed</custom><forbidden>not allowed</forbidden></div>';
			const result = sanitizeHtml(html, {
				replaceWithPlaintext: true,
				allowedTags: { augment: ['custom'] }
			});
			assert.strictEqual(result.toString(), '<div><custom>allowed</custom>&lt;forbidden&gt;not allowed&lt;/forbidden&gt;</div>');
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/formattedTextRenderer.test.ts]---
Location: vscode-main/src/vs/base/test/browser/formattedTextRenderer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { renderFormattedText, renderText } from '../../browser/formattedTextRenderer.js';
import { DisposableStore } from '../../common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../common/utils.js';
import { $ } from '../../browser/dom.js';

suite('FormattedTextRenderer', () => {
	const store = new DisposableStore();

	setup(() => {
		store.clear();
	});

	teardown(() => {
		store.clear();
	});

	test('render simple element', () => {
		const result: HTMLElement = renderText('testing');

		assert.strictEqual(result.nodeType, document.ELEMENT_NODE);
		assert.strictEqual(result.textContent, 'testing');
		assert.strictEqual(result.tagName, 'DIV');
	});

	test('render element with target', () => {
		const target = $('div.testClass');
		const result = renderText('testing', {}, target);
		assert.strictEqual(result.nodeType, document.ELEMENT_NODE);
		assert.strictEqual(result, target);
		assert.strictEqual(result.className, 'testClass');
	});

	test('simple formatting', () => {
		let result: HTMLElement = renderFormattedText('**bold**');
		assert.strictEqual(result.children.length, 1);
		assert.strictEqual(result.firstChild!.textContent, 'bold');
		assert.strictEqual((<HTMLElement>result.firstChild).tagName, 'B');
		assert.strictEqual(result.innerHTML, '<b>bold</b>');

		result = renderFormattedText('__italics__');
		assert.strictEqual(result.innerHTML, '<i>italics</i>');

		result = renderFormattedText('``code``');
		assert.strictEqual(result.innerHTML, '``code``');

		result = renderFormattedText('``code``', { renderCodeSegments: true });
		assert.strictEqual(result.innerHTML, '<code>code</code>');

		result = renderFormattedText('this string has **bold**, __italics__, and ``code``!!', { renderCodeSegments: true });
		assert.strictEqual(result.innerHTML, 'this string has <b>bold</b>, <i>italics</i>, and <code>code</code>!!');
	});

	test('no formatting', () => {
		const result: HTMLElement = renderFormattedText('this is just a string');
		assert.strictEqual(result.innerHTML, 'this is just a string');
	});

	test('preserve newlines', () => {
		const result: HTMLElement = renderFormattedText('line one\nline two');
		assert.strictEqual(result.innerHTML, 'line one<br>line two');
	});

	test('action', () => {
		let callbackCalled = false;
		const result: HTMLElement = renderFormattedText('[[action]]', {
			actionHandler: {
				callback(content) {
					assert.strictEqual(content, '0');
					callbackCalled = true;
				},
				disposables: store
			}
		});
		assert.strictEqual(result.innerHTML, '<a>action</a>');

		const event: MouseEvent = document.createEvent('MouseEvent');
		event.initEvent('click', true, true);
		result.firstChild!.dispatchEvent(event);
		assert.strictEqual(callbackCalled, true);
	});

	test('fancy action', () => {
		let callbackCalled = false;
		const result: HTMLElement = renderFormattedText('__**[[action]]**__', {
			actionHandler: {
				callback(content) {
					assert.strictEqual(content, '0');
					callbackCalled = true;
				},
				disposables: store
			}
		});
		assert.strictEqual(result.innerHTML, '<i><b><a>action</a></b></i>');

		const event: MouseEvent = document.createEvent('MouseEvent');
		event.initEvent('click', true, true);
		result.firstChild!.firstChild!.firstChild!.dispatchEvent(event);
		assert.strictEqual(callbackCalled, true);
	});

	test('fancier action', () => {
		let callbackCalled = false;
		const result: HTMLElement = renderFormattedText('``__**[[action]]**__``', {
			renderCodeSegments: true,
			actionHandler: {
				callback(content) {
					assert.strictEqual(content, '0');
					callbackCalled = true;
				},
				disposables: store
			}
		});
		assert.strictEqual(result.innerHTML, '<code><i><b><a>action</a></b></i></code>');

		const event: MouseEvent = document.createEvent('MouseEvent');
		event.initEvent('click', true, true);
		result.firstChild!.firstChild!.firstChild!.firstChild!.dispatchEvent(event);
		assert.strictEqual(callbackCalled, true);
	});

	test('escaped formatting', () => {
		const result: HTMLElement = renderFormattedText('\\*\\*bold\\*\\*');
		assert.strictEqual(result.children.length, 0);
		assert.strictEqual(result.innerHTML, '**bold**');
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/hash.test.ts]---
Location: vscode-main/src/vs/base/test/browser/hash.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { hash, hashAsync, StringSHA1 } from '../../common/hash.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../common/utils.js';

suite('Hash', () => {
	test('string', () => {
		assert.strictEqual(hash('hello'), hash('hello'));
		assert.notStrictEqual(hash('hello'), hash('world'));
		assert.notStrictEqual(hash('hello'), hash('olleh'));
		assert.notStrictEqual(hash('hello'), hash('Hello'));
		assert.notStrictEqual(hash('hello'), hash('Hello '));
		assert.notStrictEqual(hash('h'), hash('H'));
		assert.notStrictEqual(hash('-'), hash('_'));
	});

	test('number', () => {
		assert.strictEqual(hash(1), hash(1));
		assert.notStrictEqual(hash(0), hash(1));
		assert.notStrictEqual(hash(1), hash(-1));
		assert.notStrictEqual(hash(0x12345678), hash(0x123456789));
	});

	test('boolean', () => {
		assert.strictEqual(hash(true), hash(true));
		assert.notStrictEqual(hash(true), hash(false));
	});

	test('array', () => {
		assert.strictEqual(hash([1, 2, 3]), hash([1, 2, 3]));
		assert.strictEqual(hash(['foo', 'bar']), hash(['foo', 'bar']));
		assert.strictEqual(hash([]), hash([]));
		assert.strictEqual(hash([]), hash(new Array()));
		assert.notStrictEqual(hash(['foo', 'bar']), hash(['bar', 'foo']));
		assert.notStrictEqual(hash(['foo', 'bar']), hash(['bar', 'foo', null]));
		assert.notStrictEqual(hash(['foo', 'bar', null]), hash(['bar', 'foo', null]));
		assert.notStrictEqual(hash(['foo', 'bar']), hash(['bar', 'foo', undefined]));
		assert.notStrictEqual(hash(['foo', 'bar', undefined]), hash(['bar', 'foo', undefined]));
		assert.notStrictEqual(hash(['foo', 'bar', null]), hash(['foo', 'bar', undefined]));
	});

	test('object', () => {
		assert.strictEqual(hash({}), hash({}));
		assert.strictEqual(hash({}), hash(Object.create(null)));
		assert.strictEqual(hash({ 'foo': 'bar' }), hash({ 'foo': 'bar' }));
		assert.strictEqual(hash({ 'foo': 'bar', 'foo2': undefined }), hash({ 'foo2': undefined, 'foo': 'bar' }));
		assert.notStrictEqual(hash({ 'foo': 'bar' }), hash({ 'foo': 'bar2' }));
		assert.notStrictEqual(hash({}), hash([]));
	});

	test('array - unexpected collision', function () {
		const a = hash([undefined, undefined, undefined, undefined, undefined]);
		const b = hash([undefined, undefined, 'HHHHHH', [{ line: 0, character: 0 }, { line: 0, character: 0 }], undefined]);
		assert.notStrictEqual(a, b);
	});

	test('all different', () => {
		const candidates: any[] = [
			null, undefined, {}, [], 0, false, true, '', ' ', [null], [undefined], [undefined, undefined], { '': undefined }, { [' ']: undefined },
			'ab', 'ba', ['ab']
		];
		const hashes: number[] = candidates.map(hash);
		for (let i = 0; i < hashes.length; i++) {
			assert.strictEqual(hashes[i], hash(candidates[i])); // verify that repeated invocation returns the same hash
			for (let k = i + 1; k < hashes.length; k++) {
				assert.notStrictEqual(hashes[i], hashes[k], `Same hash ${hashes[i]} for ${JSON.stringify(candidates[i])} and ${JSON.stringify(candidates[k])}`);
			}
		}
	});


	async function checkSHA1(str: string, expected: string) {

		// Test with StringSHA1
		const hash = new StringSHA1();
		hash.update(str);
		let actual = hash.digest();
		assert.strictEqual(actual, expected);

		// Test with crypto.subtle
		actual = await hashAsync(str);
		assert.strictEqual(actual, expected);
	}

	test('sha1-1', () => {
		return checkSHA1('\udd56', '9bdb77276c1852e1fb067820472812fcf6084024');
	});

	test('sha1-2', () => {
		return checkSHA1('\udb52', '9bdb77276c1852e1fb067820472812fcf6084024');
	});

	test('sha1-3', () => {
		return checkSHA1('\uda02ꑍ', '9b483a471f22fe7e09d83f221871a987244bbd3f');
	});

	test('sha1-4', () => {
		return checkSHA1('hello', 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/highlightedLabel.test.ts]---
Location: vscode-main/src/vs/base/test/browser/highlightedLabel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { HighlightedLabel } from '../../browser/ui/highlightedlabel/highlightedLabel.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../common/utils.js';

suite('HighlightedLabel', () => {
	let label: HighlightedLabel;

	setup(() => {
		label = new HighlightedLabel(document.createElement('div'));
	});

	test('empty label', function () {
		assert.strictEqual(label.element.innerHTML, '');
	});

	test('no decorations', function () {
		label.set('hello');
		assert.strictEqual(label.element.innerHTML, 'hello');
	});

	test('escape html', function () {
		label.set('hel<lo');
		assert.strictEqual(label.element.innerHTML, 'hel&lt;lo');
	});

	test('everything highlighted', function () {
		label.set('hello', [{ start: 0, end: 5 }]);
		assert.strictEqual(label.element.innerHTML, '<span class="highlight">hello</span>');
	});

	test('beginning highlighted', function () {
		label.set('hellothere', [{ start: 0, end: 5 }]);
		assert.strictEqual(label.element.innerHTML, '<span class="highlight">hello</span>there');
	});

	test('ending highlighted', function () {
		label.set('goodbye', [{ start: 4, end: 7 }]);
		assert.strictEqual(label.element.innerHTML, 'good<span class="highlight">bye</span>');
	});

	test('middle highlighted', function () {
		label.set('foobarfoo', [{ start: 3, end: 6 }]);
		assert.strictEqual(label.element.innerHTML, 'foo<span class="highlight">bar</span>foo');
	});

	test('escapeNewLines', () => {

		let highlights = [{ start: 0, end: 5 }, { start: 7, end: 9 }, { start: 11, end: 12 }];// before,after,after
		let escaped = HighlightedLabel.escapeNewLines('ACTION\r\n_TYPE2', highlights);
		assert.strictEqual(escaped, 'ACTION\u23CE_TYPE2');
		assert.deepStrictEqual(highlights, [{ start: 0, end: 5 }, { start: 6, end: 8 }, { start: 10, end: 11 }]);

		highlights = [{ start: 5, end: 9 }, { start: 11, end: 12 }];//overlap,after
		escaped = HighlightedLabel.escapeNewLines('ACTION\r\n_TYPE2', highlights);
		assert.strictEqual(escaped, 'ACTION\u23CE_TYPE2');
		assert.deepStrictEqual(highlights, [{ start: 5, end: 8 }, { start: 10, end: 11 }]);
	});

	teardown(() => {
		label.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/iconLabels.test.ts]---
Location: vscode-main/src/vs/base/test/browser/iconLabels.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { isHTMLElement } from '../../browser/dom.js';
import { renderLabelWithIcons } from '../../browser/ui/iconLabel/iconLabels.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../common/utils.js';

suite('renderLabelWithIcons', () => {

	test('no icons', () => {
		const result = renderLabelWithIcons(' hello World .');

		assert.strictEqual(elementsToString(result), ' hello World .');
	});

	test('icons only', () => {
		const result = renderLabelWithIcons('$(alert)');

		assert.strictEqual(elementsToString(result), '<span class="codicon codicon-alert"></span>');
	});

	test('icon and non-icon strings', () => {
		const result = renderLabelWithIcons(` $(alert) Unresponsive`);

		assert.strictEqual(elementsToString(result), ' <span class="codicon codicon-alert"></span> Unresponsive');
	});

	test('multiple icons', () => {
		const result = renderLabelWithIcons('$(check)$(error)');

		assert.strictEqual(elementsToString(result), '<span class="codicon codicon-check"></span><span class="codicon codicon-error"></span>');
	});

	test('escaped icons', () => {
		const result = renderLabelWithIcons('\\$(escaped)');

		assert.strictEqual(elementsToString(result), '$(escaped)');
	});

	test('icon with animation', () => {
		const result = renderLabelWithIcons('$(zip~anim)');

		assert.strictEqual(elementsToString(result), '<span class="codicon codicon-zip codicon-modifier-anim"></span>');
	});

	const elementsToString = (elements: Array<HTMLElement | string>): string => {
		return elements
			.map(elem => isHTMLElement(elem) ? elem.outerHTML : elem)
			.reduce((a, b) => a + b, '');
	};

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/browser/indexedDB.test.ts]---
Location: vscode-main/src/vs/base/test/browser/indexedDB.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { IndexedDB } from '../../browser/indexedDB.js';
import { flakySuite } from '../common/testUtils.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../common/utils.js';

flakySuite('IndexedDB', () => {

	let indexedDB: IndexedDB;

	setup(async () => {
		indexedDB = await IndexedDB.create('vscode-indexeddb-test', 1, ['test-store']);
		await indexedDB.runInTransaction('test-store', 'readwrite', store => store.clear());
	});

	teardown(() => {
		indexedDB?.close();
	});

	test('runInTransaction', async () => {
		await indexedDB.runInTransaction('test-store', 'readwrite', store => store.add('hello1', 'key1'));
		const value = await indexedDB.runInTransaction('test-store', 'readonly', store => store.get('key1'));
		assert.deepStrictEqual(value, 'hello1');
	});

	test('getKeyValues', async () => {
		await indexedDB.runInTransaction('test-store', 'readwrite', store => {
			const requests: IDBRequest[] = [];
			requests.push(store.add('hello1', 'key1'));
			requests.push(store.add('hello2', 'key2'));
			requests.push(store.add(true, 'key3'));

			return requests;
		});
		function isValid(value: unknown): value is string {
			return typeof value === 'string';
		}
		const keyValues = await indexedDB.getKeyValues('test-store', isValid);
		assert.strictEqual(keyValues.size, 2);
		assert.strictEqual(keyValues.get('key1'), 'hello1');
		assert.strictEqual(keyValues.get('key2'), 'hello2');
	});

	test('hasPendingTransactions', async () => {
		const promise = indexedDB.runInTransaction('test-store', 'readwrite', store => store.add('hello2', 'key2'));
		assert.deepStrictEqual(indexedDB.hasPendingTransactions(), true);
		await promise;
		assert.deepStrictEqual(indexedDB.hasPendingTransactions(), false);
	});

	test('close', async () => {
		const promise = indexedDB.runInTransaction('test-store', 'readwrite', store => store.add('hello3', 'key3'));
		indexedDB.close();
		assert.deepStrictEqual(indexedDB.hasPendingTransactions(), false);
		try {
			await promise;
			assert.fail('Transaction should be aborted');
		} catch (error) { }
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

````

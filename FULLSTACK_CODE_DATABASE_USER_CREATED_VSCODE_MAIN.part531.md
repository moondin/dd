---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 531
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 531 of 552)

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

---[FILE: src/vs/workbench/services/textfile/test/browser/textFileEditorModel.test.ts]---
Location: vscode-main/src/vs/workbench/services/textfile/test/browser/textFileEditorModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { TextFileEditorModel } from '../../common/textFileEditorModel.js';
import { EncodingMode, TextFileEditorModelState, snapshotToString, isTextFileEditorModel, ITextFileEditorModelSaveEvent } from '../../common/textfiles.js';
import { createFileEditorInput, workbenchInstantiationService, TestServiceAccessor, TestReadonlyTextFileEditorModel, getLastResolvedFileStat } from '../../../../test/browser/workbenchTestServices.js';
import { assertThrowsAsync, ensureNoDisposablesAreLeakedInTestSuite, toResource } from '../../../../../base/test/common/utils.js';
import { TextFileEditorModelManager } from '../../common/textFileEditorModelManager.js';
import { FileOperationResult, FileOperationError, NotModifiedSinceFileOperationError } from '../../../../../platform/files/common/files.js';
import { DeferredPromise, timeout } from '../../../../../base/common/async.js';
import { assertReturnsDefined } from '../../../../../base/common/types.js';
import { createTextBufferFactory } from '../../../../../editor/common/model/textModel.js';
import { DisposableStore, toDisposable } from '../../../../../base/common/lifecycle.js';
import { SaveReason, SaveSourceRegistry } from '../../../../common/editor.js';
import { isEqual } from '../../../../../base/common/resources.js';
import { UTF16be } from '../../common/encoding.js';
import { isWeb } from '../../../../../base/common/platform.js';
import { URI } from '../../../../../base/common/uri.js';

suite('Files - TextFileEditorModel', () => {

	function getLastModifiedTime(model: TextFileEditorModel): number {
		const stat = getLastResolvedFileStat(model);

		return stat ? stat.mtime : -1;
	}

	const disposables = new DisposableStore();
	let instantiationService: IInstantiationService;
	let accessor: TestServiceAccessor;
	let content: string;

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables);
		accessor = instantiationService.createInstance(TestServiceAccessor);
		content = accessor.fileService.getContent();
		disposables.add(<TextFileEditorModelManager>accessor.textFileService.files);
		disposables.add(toDisposable(() => accessor.fileService.setContent(content)));
	});

	teardown(async () => {
		for (const textFileEditorModel of accessor.textFileService.files.models) {
			textFileEditorModel.dispose();
		}

		disposables.clear();
	});

	test('basic events', async function () {
		const model = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));
		accessor.workingCopyService.testUnregisterWorkingCopy(model); // causes issues with subsequent resolves otherwise

		let onDidResolveCounter = 0;
		disposables.add(model.onDidResolve(() => onDidResolveCounter++));

		await model.resolve();

		assert.strictEqual(onDidResolveCounter, 1);

		let onDidChangeContentCounter = 0;
		disposables.add(model.onDidChangeContent(() => onDidChangeContentCounter++));

		let onDidChangeDirtyCounter = 0;
		disposables.add(model.onDidChangeDirty(() => onDidChangeDirtyCounter++));

		model.updateTextEditorModel(createTextBufferFactory('bar'));

		assert.strictEqual(onDidChangeContentCounter, 1);
		assert.strictEqual(onDidChangeDirtyCounter, 1);

		model.updateTextEditorModel(createTextBufferFactory('foo'));

		assert.strictEqual(onDidChangeContentCounter, 2);
		assert.strictEqual(onDidChangeDirtyCounter, 1);

		await model.revert();

		assert.strictEqual(onDidChangeDirtyCounter, 2);
	});

	test('isTextFileEditorModel', async function () {
		const model: TextFileEditorModel = instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined);

		assert.strictEqual(isTextFileEditorModel(model), true);

		model.dispose();
	});

	test('save', async function () {
		const model: TextFileEditorModel = instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined);

		await model.resolve();

		assert.strictEqual(accessor.workingCopyService.dirtyCount, 0);

		let savedEvent: ITextFileEditorModelSaveEvent | undefined = undefined;
		disposables.add(model.onDidSave(e => savedEvent = e));

		await model.save();
		assert.ok(!savedEvent);

		model.updateTextEditorModel(createTextBufferFactory('bar'));
		assert.ok(getLastModifiedTime(model) <= Date.now());
		assert.ok(model.hasState(TextFileEditorModelState.DIRTY));
		assert.ok(model.isModified());

		assert.strictEqual(accessor.workingCopyService.dirtyCount, 1);
		assert.strictEqual(accessor.workingCopyService.isDirty(model.resource, model.typeId), true);

		let workingCopyEvent = false;
		disposables.add(accessor.workingCopyService.onDidChangeDirty(e => {
			if (e.resource.toString() === model.resource.toString()) {
				workingCopyEvent = true;
			}
		}));

		const source = SaveSourceRegistry.registerSource('testSource', 'Hello Save');
		const pendingSave = model.save({ reason: SaveReason.AUTO, source });
		assert.ok(model.hasState(TextFileEditorModelState.PENDING_SAVE));

		await Promise.all([pendingSave, model.joinState(TextFileEditorModelState.PENDING_SAVE)]);

		assert.ok(model.hasState(TextFileEditorModelState.SAVED));
		assert.ok(!model.isDirty());
		assert.ok(!model.isModified());
		assert.ok(savedEvent);
		assert.ok((savedEvent as ITextFileEditorModelSaveEvent).stat);
		assert.strictEqual((savedEvent as ITextFileEditorModelSaveEvent).reason, SaveReason.AUTO);
		assert.strictEqual((savedEvent as ITextFileEditorModelSaveEvent).source, source);
		assert.ok(workingCopyEvent);

		assert.strictEqual(accessor.workingCopyService.dirtyCount, 0);
		assert.strictEqual(accessor.workingCopyService.isDirty(model.resource, model.typeId), false);

		savedEvent = undefined;

		await model.save({ force: true });
		assert.ok(savedEvent);

		model.dispose();
		assert.ok(!accessor.modelService.getModel(model.resource));
	});

	test('save - touching also emits saved event', async function () {
		const model: TextFileEditorModel = instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined);

		await model.resolve();

		let savedEvent = false;
		disposables.add(model.onDidSave(() => savedEvent = true));

		let workingCopyEvent = false;
		disposables.add(accessor.workingCopyService.onDidChangeDirty(e => {
			if (e.resource.toString() === model.resource.toString()) {
				workingCopyEvent = true;
			}
		}));

		await model.save({ force: true });

		assert.ok(savedEvent);
		assert.ok(!workingCopyEvent);

		model.dispose();
		assert.ok(!accessor.modelService.getModel(model.resource));
	});

	test('save - touching with error turns model dirty', async function () {
		const model: TextFileEditorModel = instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined);

		await model.resolve();

		let saveErrorEvent = false;
		disposables.add(model.onDidSaveError(() => saveErrorEvent = true));

		let savedEvent = false;
		disposables.add(model.onDidSave(() => savedEvent = true));

		accessor.fileService.writeShouldThrowError = new Error('failed to write');
		try {
			await model.save({ force: true });

			assert.ok(model.hasState(TextFileEditorModelState.ERROR));
			assert.ok(model.isDirty());
			assert.ok(model.isModified());
			assert.ok(saveErrorEvent);

			assert.strictEqual(accessor.workingCopyService.dirtyCount, 1);
			assert.strictEqual(accessor.workingCopyService.isDirty(model.resource, model.typeId), true);
		} finally {
			accessor.fileService.writeShouldThrowError = undefined;
		}

		await model.save({ force: true });

		assert.ok(savedEvent);
		assert.strictEqual(model.isDirty(), false);

		model.dispose();
		assert.ok(!accessor.modelService.getModel(model.resource));
	});

	test('save - returns false when save fails', async function () {
		const model: TextFileEditorModel = instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined);

		await model.resolve();

		accessor.fileService.writeShouldThrowError = new Error('failed to write');
		try {
			const res = await model.save({ force: true });
			assert.strictEqual(res, false);
		} finally {
			accessor.fileService.writeShouldThrowError = undefined;
		}

		const res = await model.save({ force: true });
		assert.strictEqual(res, true);

		model.dispose();
		assert.ok(!accessor.modelService.getModel(model.resource));
	});

	test('save error (generic)', async function () {
		const model: TextFileEditorModel = instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined);

		await model.resolve();

		model.updateTextEditorModel(createTextBufferFactory('bar'));

		let saveErrorEvent = false;
		disposables.add(model.onDidSaveError(() => saveErrorEvent = true));

		accessor.fileService.writeShouldThrowError = new Error('failed to write');
		try {
			const pendingSave = model.save();
			assert.ok(model.hasState(TextFileEditorModelState.PENDING_SAVE));

			await pendingSave;

			assert.ok(model.hasState(TextFileEditorModelState.ERROR));
			assert.ok(model.isDirty());
			assert.ok(model.isModified());
			assert.ok(saveErrorEvent);

			assert.strictEqual(accessor.workingCopyService.dirtyCount, 1);
			assert.strictEqual(accessor.workingCopyService.isDirty(model.resource, model.typeId), true);

			model.dispose();
		} finally {
			accessor.fileService.writeShouldThrowError = undefined;
		}
	});

	test('save error (conflict)', async function () {
		const model: TextFileEditorModel = instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined);

		await model.resolve();

		model.updateTextEditorModel(createTextBufferFactory('bar'));

		let saveErrorEvent = false;
		disposables.add(model.onDidSaveError(() => saveErrorEvent = true));

		accessor.fileService.writeShouldThrowError = new FileOperationError('save conflict', FileOperationResult.FILE_MODIFIED_SINCE);
		try {
			const pendingSave = model.save();
			assert.ok(model.hasState(TextFileEditorModelState.PENDING_SAVE));

			await pendingSave;

			assert.ok(model.hasState(TextFileEditorModelState.CONFLICT));
			assert.ok(model.isDirty());
			assert.ok(model.isModified());
			assert.ok(saveErrorEvent);

			assert.strictEqual(accessor.workingCopyService.dirtyCount, 1);
			assert.strictEqual(accessor.workingCopyService.isDirty(model.resource, model.typeId), true);

			model.dispose();
		} finally {
			accessor.fileService.writeShouldThrowError = undefined;
		}
	});

	test('setEncoding - encode', async function () {
		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));

		let encodingEvent = false;
		disposables.add(model.onDidChangeEncoding(() => encodingEvent = true));

		await model.setEncoding('utf8', EncodingMode.Encode); // no-op
		assert.strictEqual(getLastModifiedTime(model), -1);

		assert.ok(!encodingEvent);

		await model.setEncoding('utf16', EncodingMode.Encode);

		assert.ok(encodingEvent);

		assert.ok(getLastModifiedTime(model) <= Date.now()); // indicates model was saved due to encoding change
	});

	test('setEncoding - decode', async function () {
		let model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));
		accessor.workingCopyService.testUnregisterWorkingCopy(model); // causes issues with subsequent resolves otherwise

		await model.setEncoding('utf16', EncodingMode.Decode);

		// we have to get the model again from working copy service
		// because `setEncoding` will resolve it again through the
		// text file service which is outside our scope
		model = accessor.workingCopyService.get(model) as TextFileEditorModel;

		assert.ok(model.isResolved()); // model got resolved due to decoding
	});

	test('setEncoding - decode dirty file throws', async function () {
		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));
		accessor.workingCopyService.testUnregisterWorkingCopy(model); // causes issues with subsequent resolves otherwise

		await model.resolve();

		model.updateTextEditorModel(createTextBufferFactory('bar'));
		assert.strictEqual(model.isDirty(), true);

		assertThrowsAsync(() => model.setEncoding('utf16', EncodingMode.Decode));
	});

	test('encoding updates with language based configuration', async function () {
		const languageId = 'text-file-model-test';
		disposables.add(accessor.languageService.registerLanguage({
			id: languageId,
		}));

		accessor.testConfigurationService.setOverrideIdentifiers('files.encoding', [languageId]);

		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));
		accessor.workingCopyService.testUnregisterWorkingCopy(model); // causes issues with subsequent resolves otherwise

		await model.resolve();

		const deferredPromise = new DeferredPromise<TextFileEditorModel>();

		// We use this listener as a way to figure out that the working
		// copy was resolved again as part of the language change
		disposables.add(accessor.workingCopyService.onDidRegister(e => {
			if (isEqual(e.resource, model.resource)) {
				deferredPromise.complete(model as TextFileEditorModel);
			}
		}));

		accessor.testConfigurationService.setUserConfiguration('files.encoding', UTF16be);

		model.setLanguageId(languageId);

		await deferredPromise.p; // this asserts that the model was reloaded due to the language change
	});

	test('create with language', async function () {
		const languageId = 'text-file-model-test';
		disposables.add(accessor.languageService.registerLanguage({
			id: languageId,
		}));

		const model: TextFileEditorModel = instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', languageId);

		await model.resolve();

		assert.strictEqual(model.textEditorModel!.getLanguageId(), languageId);

		model.dispose();
		assert.ok(!accessor.modelService.getModel(model.resource));
	});

	test('disposes when underlying model is destroyed', async function () {
		const model: TextFileEditorModel = instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined);

		await model.resolve();

		model.textEditorModel!.dispose();
		assert.ok(model.isDisposed());
	});

	test('Resolve does not trigger save', async function () {
		const model = instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index.txt'), 'utf8', undefined);
		assert.ok(model.hasState(TextFileEditorModelState.SAVED));

		disposables.add(model.onDidSave(() => assert.fail()));
		disposables.add(model.onDidChangeDirty(() => assert.fail()));

		await model.resolve();
		assert.ok(model.isResolved());
		model.dispose();
		assert.ok(!accessor.modelService.getModel(model.resource));
	});

	test('Resolve returns dirty model as long as model is dirty', async function () {
		const model = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));

		await model.resolve();
		model.updateTextEditorModel(createTextBufferFactory('foo'));
		assert.ok(model.isDirty());
		assert.ok(model.hasState(TextFileEditorModelState.DIRTY));

		await model.resolve();
		assert.ok(model.isDirty());
	});

	test('Resolve with contents', async function () {
		const model: TextFileEditorModel = instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined);

		await model.resolve({ contents: createTextBufferFactory('Hello World') });

		assert.strictEqual(model.textEditorModel?.getValue(), 'Hello World');
		assert.strictEqual(model.isDirty(), true);

		await model.resolve({ contents: createTextBufferFactory('Hello Changes') });

		assert.strictEqual(model.textEditorModel?.getValue(), 'Hello Changes');
		assert.strictEqual(model.isDirty(), true);

		// verify that we do not mark the model as saved when undoing once because
		// we never really had a saved state
		await model.textEditorModel.undo();
		assert.ok(model.isDirty());

		model.dispose();
		assert.ok(!accessor.modelService.getModel(model.resource));
	});

	test('Revert', async function () {
		let eventCounter = 0;

		let model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));

		disposables.add(model.onDidRevert(() => eventCounter++));

		let workingCopyEvent = false;
		disposables.add(accessor.workingCopyService.onDidChangeDirty(e => {
			if (e.resource.toString() === model.resource.toString()) {
				workingCopyEvent = true;
			}
		}));

		await model.resolve();
		model.updateTextEditorModel(createTextBufferFactory('foo'));
		assert.ok(model.isDirty());
		assert.ok(model.isModified());

		assert.strictEqual(accessor.workingCopyService.dirtyCount, 1);
		assert.strictEqual(accessor.workingCopyService.isDirty(model.resource, model.typeId), true);

		accessor.workingCopyService.testUnregisterWorkingCopy(model); // causes issues with subsequent resolves otherwise

		await model.revert();

		// we have to get the model again from working copy service
		// because `setEncoding` will resolve it again through the
		// text file service which is outside our scope
		model = accessor.workingCopyService.get(model) as TextFileEditorModel;

		assert.strictEqual(model.isDirty(), false);
		assert.strictEqual(model.isModified(), false);
		assert.strictEqual(eventCounter, 1);

		assert.ok(workingCopyEvent);
		assert.strictEqual(accessor.workingCopyService.dirtyCount, 0);
		assert.strictEqual(accessor.workingCopyService.isDirty(model.resource, model.typeId), false);
	});

	test('Revert (soft)', async function () {
		let eventCounter = 0;

		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));

		disposables.add(model.onDidRevert(() => eventCounter++));

		let workingCopyEvent = false;
		disposables.add(accessor.workingCopyService.onDidChangeDirty(e => {
			if (e.resource.toString() === model.resource.toString()) {
				workingCopyEvent = true;
			}
		}));

		await model.resolve();
		model.updateTextEditorModel(createTextBufferFactory('foo'));
		assert.ok(model.isDirty());
		assert.ok(model.isModified());

		assert.strictEqual(accessor.workingCopyService.dirtyCount, 1);
		assert.strictEqual(accessor.workingCopyService.isDirty(model.resource, model.typeId), true);

		await model.revert({ soft: true });
		assert.strictEqual(model.isDirty(), false);
		assert.strictEqual(model.isModified(), false);
		assert.strictEqual(model.textEditorModel.getValue(), 'foo');
		assert.strictEqual(eventCounter, 1);

		assert.ok(workingCopyEvent);
		assert.strictEqual(accessor.workingCopyService.dirtyCount, 0);
		assert.strictEqual(accessor.workingCopyService.isDirty(model.resource, model.typeId), false);
	});

	test('Undo to saved state turns model non-dirty', async function () {
		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));
		await model.resolve();
		model.updateTextEditorModel(createTextBufferFactory('Hello Text'));
		assert.ok(model.isDirty());

		await model.textEditorModel.undo();
		assert.ok(!model.isDirty());
	});

	test('Resolve and undo turns model dirty', async function () {
		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));
		await model.resolve();
		accessor.fileService.setContent('Hello Change');

		await model.resolve();
		await model.textEditorModel!.undo();
		assert.ok(model.isDirty());

		assert.strictEqual(accessor.workingCopyService.dirtyCount, 1);
		assert.strictEqual(accessor.workingCopyService.isDirty(model.resource, model.typeId), true);
	});

	test('Update Dirty', async function () {
		let eventCounter = 0;

		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));

		model.setDirty(true);
		assert.ok(!model.isDirty()); // needs to be resolved

		await model.resolve();
		model.updateTextEditorModel(createTextBufferFactory('foo'));
		assert.ok(model.isDirty());

		await model.revert({ soft: true });
		assert.strictEqual(model.isDirty(), false);

		disposables.add(model.onDidChangeDirty(() => eventCounter++));

		let workingCopyEvent = false;
		disposables.add(accessor.workingCopyService.onDidChangeDirty(e => {
			if (e.resource.toString() === model.resource.toString()) {
				workingCopyEvent = true;
			}
		}));

		model.setDirty(true);
		assert.ok(model.isDirty());
		assert.strictEqual(eventCounter, 1);
		assert.ok(workingCopyEvent);

		model.setDirty(false);
		assert.strictEqual(model.isDirty(), false);
		assert.strictEqual(eventCounter, 2);
	});

	test('No Dirty or saving for readonly models', async function () {
		let workingCopyEvent = false;
		disposables.add(accessor.workingCopyService.onDidChangeDirty(e => {
			if (e.resource.toString() === model.resource.toString()) {
				workingCopyEvent = true;
			}
		}));

		const model = disposables.add(instantiationService.createInstance(TestReadonlyTextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));

		let saveEvent = false;
		disposables.add(model.onDidSave(() => {
			saveEvent = true;
		}));

		await model.resolve();
		model.updateTextEditorModel(createTextBufferFactory('foo'));
		assert.ok(!model.isDirty());

		await model.save({ force: true });
		assert.strictEqual(saveEvent, false);

		await model.revert({ soft: true });
		assert.ok(!model.isDirty());

		assert.ok(!workingCopyEvent);
	});

	test('File not modified error is handled gracefully', async function () {
		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));

		await model.resolve();

		const mtime = getLastModifiedTime(model);
		accessor.textFileService.setReadStreamErrorOnce(new FileOperationError('error', FileOperationResult.FILE_NOT_MODIFIED_SINCE));

		await model.resolve();

		assert.ok(model);
		assert.strictEqual(getLastModifiedTime(model), mtime);
	});

	test('stat.readonly and stat.locked can change when decreased mtime is ignored', async function () {
		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));

		await model.resolve();

		const stat = assertReturnsDefined(getLastResolvedFileStat(model));
		accessor.textFileService.setReadStreamErrorOnce(new NotModifiedSinceFileOperationError('error', { ...stat, mtime: stat.mtime - 1, readonly: !stat.readonly, locked: !stat.locked }));

		await model.resolve();

		assert.ok(model);
		assert.strictEqual(getLastModifiedTime(model), stat.mtime, 'mtime should not decrease');
		assert.notStrictEqual(getLastResolvedFileStat(model)?.readonly, stat.readonly, 'readonly should have changed despite simultaneous attempt to decrease mtime');
		assert.notStrictEqual(getLastResolvedFileStat(model)?.locked, stat.locked, 'locked should have changed despite simultaneous attempt to decrease mtime');
	});

	test('Resolve error is handled gracefully if model already exists', async function () {
		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));

		await model.resolve();
		accessor.textFileService.setReadStreamErrorOnce(new FileOperationError('error', FileOperationResult.FILE_NOT_FOUND));

		await model.resolve();
		assert.ok(model);
	});

	test('save() and isDirty() - proper with check for mtimes', async function () {
		const input1 = disposables.add(createFileEditorInput(instantiationService, toResource.call(this, '/path/index_async2.txt')));
		const input2 = disposables.add(createFileEditorInput(instantiationService, toResource.call(this, '/path/index_async.txt')));

		const model1 = disposables.add(await input1.resolve() as TextFileEditorModel);
		const model2 = disposables.add(await input2.resolve() as TextFileEditorModel);

		model1.updateTextEditorModel(createTextBufferFactory('foo'));

		const m1Mtime = assertReturnsDefined(getLastResolvedFileStat(model1)).mtime;
		const m2Mtime = assertReturnsDefined(getLastResolvedFileStat(model2)).mtime;
		assert.ok(m1Mtime > 0);
		assert.ok(m2Mtime > 0);

		assert.ok(accessor.textFileService.isDirty(toResource.call(this, '/path/index_async2.txt')));
		assert.ok(!accessor.textFileService.isDirty(toResource.call(this, '/path/index_async.txt')));

		model2.updateTextEditorModel(createTextBufferFactory('foo'));
		assert.ok(accessor.textFileService.isDirty(toResource.call(this, '/path/index_async.txt')));

		await timeout(10);
		await accessor.textFileService.save(toResource.call(this, '/path/index_async.txt'));
		await accessor.textFileService.save(toResource.call(this, '/path/index_async2.txt'));
		assert.ok(!accessor.textFileService.isDirty(toResource.call(this, '/path/index_async.txt')));
		assert.ok(!accessor.textFileService.isDirty(toResource.call(this, '/path/index_async2.txt')));

		if (isWeb) {
			// web tests does not ensure timeouts are respected at all, so we cannot
			// really assert the mtime to be different, only that it is equal or greater.
			// https://github.com/microsoft/vscode/issues/161886
			assert.ok(assertReturnsDefined(getLastResolvedFileStat(model1)).mtime >= m1Mtime);
			assert.ok(assertReturnsDefined(getLastResolvedFileStat(model2)).mtime >= m2Mtime);
		} else {
			// on desktop we want to assert this condition more strictly though
			assert.ok(assertReturnsDefined(getLastResolvedFileStat(model1)).mtime > m1Mtime);
			assert.ok(assertReturnsDefined(getLastResolvedFileStat(model2)).mtime > m2Mtime);
		}
	});

	test('Save Participant', async function () {
		let eventCounter = 0;
		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));

		disposables.add(model.onDidSave(() => {
			assert.strictEqual(snapshotToString(model.createSnapshot()!), eventCounter === 1 ? 'bar' : 'foobar');
			assert.ok(!model.isDirty());
			eventCounter++;
		}));

		const participant = accessor.textFileService.files.addSaveParticipant({
			participate: async model => {
				assert.ok(model.isDirty());
				(model as TextFileEditorModel).updateTextEditorModel(createTextBufferFactory('bar'));
				assert.ok(model.isDirty());
				eventCounter++;
			}
		});

		await model.resolve();
		model.updateTextEditorModel(createTextBufferFactory('foo'));
		assert.ok(model.isDirty());

		await model.save();
		assert.strictEqual(eventCounter, 2);

		participant.dispose();
		model.updateTextEditorModel(createTextBufferFactory('foobar'));
		assert.ok(model.isDirty());

		await model.save();
		assert.strictEqual(eventCounter, 3);
	});

	test('Save Participant - skip', async function () {
		let eventCounter = 0;
		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));

		disposables.add(accessor.textFileService.files.addSaveParticipant({
			participate: async () => {
				eventCounter++;
			}
		}));

		await model.resolve();
		model.updateTextEditorModel(createTextBufferFactory('foo'));

		await model.save({ skipSaveParticipants: true });
		assert.strictEqual(eventCounter, 0);
	});

	test('Save Participant, async participant', async function () {
		let eventCounter = 0;
		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));

		disposables.add(model.onDidSave(() => {
			assert.ok(!model.isDirty());
			eventCounter++;
		}));

		disposables.add(accessor.textFileService.files.addSaveParticipant({
			participate: model => {
				assert.ok(model.isDirty());
				(model as TextFileEditorModel).updateTextEditorModel(createTextBufferFactory('bar'));
				assert.ok(model.isDirty());
				eventCounter++;

				return timeout(10);
			}
		}));

		await model.resolve();
		model.updateTextEditorModel(createTextBufferFactory('foo'));

		const now = Date.now();
		await model.save();
		assert.strictEqual(eventCounter, 2);
		assert.ok(Date.now() - now >= 10);
	});

	test('Save Participant, bad participant', async function () {
		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));

		disposables.add(accessor.textFileService.files.addSaveParticipant({
			participate: async () => {
				new Error('boom');
			}
		}));

		await model.resolve();
		model.updateTextEditorModel(createTextBufferFactory('foo'));

		await model.save();
	});

	test('Save Participant, participant cancelled when saved again', async function () {
		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));

		const participations: boolean[] = [];

		disposables.add(accessor.textFileService.files.addSaveParticipant({
			participate: async (model, context, progress, token) => {
				await timeout(10);

				if (!token.isCancellationRequested) {
					participations.push(true);
				}
			}
		}));

		await model.resolve();

		model.updateTextEditorModel(createTextBufferFactory('foo'));
		const p1 = model.save();

		model.updateTextEditorModel(createTextBufferFactory('foo 1'));
		const p2 = model.save();

		model.updateTextEditorModel(createTextBufferFactory('foo 2'));
		const p3 = model.save();

		model.updateTextEditorModel(createTextBufferFactory('foo 3'));
		const p4 = model.save();

		await Promise.all([p1, p2, p3, p4]);
		assert.strictEqual(participations.length, 1);
	});

	test('Save Participant, calling save from within is unsupported but does not explode (sync save, no model change)', async function () {
		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));

		await testSaveFromSaveParticipant(model, false, false, false);
	});

	test('Save Participant, calling save from within is unsupported but does not explode (async save, no model change)', async function () {
		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));

		await testSaveFromSaveParticipant(model, true, false, false);
	});

	test('Save Participant, calling save from within is unsupported but does not explode (sync save, model change)', async function () {
		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));

		await testSaveFromSaveParticipant(model, false, true, false);
	});

	test('Save Participant, calling save from within is unsupported but does not explode (async save, model change)', async function () {
		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));

		await testSaveFromSaveParticipant(model, true, true, false);
	});

	test('Save Participant, calling save from within is unsupported but does not explode (force)', async function () {
		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));

		await testSaveFromSaveParticipant(model, false, false, true);
	});

	async function testSaveFromSaveParticipant(model: TextFileEditorModel, async: boolean, modelChange: boolean, force: boolean): Promise<void> {

		disposables.add(accessor.textFileService.files.addSaveParticipant({
			participate: async () => {
				if (async) {
					await timeout(10);
				}

				if (modelChange) {
					model.updateTextEditorModel(createTextBufferFactory('bar'));

					const newSavePromise = model.save(force ? { force } : undefined);

					// assert that this is not the same promise as the outer one
					assert.notStrictEqual(savePromise, newSavePromise);

					await newSavePromise;
				} else {
					const newSavePromise = model.save(force ? { force } : undefined);

					// assert that this is the same promise as the outer one
					assert.strictEqual(savePromise, newSavePromise);

					await savePromise;
				}
			}
		}));

		await model.resolve();
		model.updateTextEditorModel(createTextBufferFactory('foo'));

		const savePromise = model.save(force ? { force } : undefined);
		await savePromise;
	}

	test('Save Participant carries context', async function () {
		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/index_async.txt'), 'utf8', undefined));

		const from = URI.file('testFrom');
		let e: Error | undefined = undefined;
		disposables.add(accessor.textFileService.files.addSaveParticipant({
			participate: async (wc, context) => {
				try {
					assert.strictEqual(context.reason, SaveReason.EXPLICIT);
					assert.strictEqual(context.savedFrom?.toString(), from.toString());
				} catch (error) {
					e = error;
				}
			}
		}));

		await model.resolve();
		model.updateTextEditorModel(createTextBufferFactory('foo'));

		await model.save({ force: true, from });

		if (e) {
			throw e;
		}
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/textfile/test/browser/textFileEditorModelManager.test.ts]---
Location: vscode-main/src/vs/workbench/services/textfile/test/browser/textFileEditorModelManager.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { workbenchInstantiationService, TestServiceAccessor, ITestTextFileEditorModelManager } from '../../../../test/browser/workbenchTestServices.js';
import { TextFileEditorModel } from '../../common/textFileEditorModel.js';
import { FileChangesEvent, FileChangeType, FileOperationError, FileOperationResult } from '../../../../../platform/files/common/files.js';
import { ensureNoDisposablesAreLeakedInTestSuite, toResource } from '../../../../../base/test/common/utils.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../../editor/common/languages/modesRegistry.js';
import { ITextFileEditorModel } from '../../common/textfiles.js';
import { createTextBufferFactory } from '../../../../../editor/common/model/textModel.js';
import { timeout } from '../../../../../base/common/async.js';
import { DisposableStore, toDisposable } from '../../../../../base/common/lifecycle.js';

suite('Files - TextFileEditorModelManager', () => {

	const disposables = new DisposableStore();
	let instantiationService: IInstantiationService;
	let accessor: TestServiceAccessor;

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables);
		accessor = instantiationService.createInstance(TestServiceAccessor);
		disposables.add(toDisposable(() => accessor.textFileService.files as ITestTextFileEditorModelManager));
	});

	teardown(() => {
		disposables.clear();
	});

	test('add, remove, clear, get, getAll', function () {
		const manager = accessor.textFileService.files as ITestTextFileEditorModelManager;

		const model1: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/random1.txt'), 'utf8', undefined));
		const model2: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/random2.txt'), 'utf8', undefined));
		const model3: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/random3.txt'), 'utf8', undefined));

		manager.add(URI.file('/test.html'), model1);
		manager.add(URI.file('/some/other.html'), model2);
		manager.add(URI.file('/some/this.txt'), model3);

		const fileUpper = URI.file('/TEST.html');

		assert(!manager.get(URI.file('foo')));
		assert.strictEqual(manager.get(URI.file('/test.html')), model1);

		assert.ok(!manager.get(fileUpper));

		let results = manager.models;
		assert.strictEqual(3, results.length);

		let result = manager.get(URI.file('/yes'));
		assert.ok(!result);

		result = manager.get(URI.file('/some/other.txt'));
		assert.ok(!result);

		result = manager.get(URI.file('/some/other.html'));
		assert.ok(result);

		result = manager.get(fileUpper);
		assert.ok(!result);

		manager.remove(URI.file(''));

		results = manager.models;
		assert.strictEqual(3, results.length);

		manager.remove(URI.file('/some/other.html'));
		results = manager.models;
		assert.strictEqual(2, results.length);

		manager.remove(fileUpper);
		results = manager.models;
		assert.strictEqual(2, results.length);

		manager.dispose();
		results = manager.models;
		assert.strictEqual(0, results.length);
	});

	test('resolve', async () => {
		const manager = accessor.textFileService.files as ITestTextFileEditorModelManager;
		const resource = URI.file('/test.html');
		const encoding = 'utf8';

		const events: ITextFileEditorModel[] = [];
		disposables.add(manager.onDidCreate(model => {
			events.push(model);
		}));

		const modelPromise = manager.resolve(resource, { encoding });
		assert.ok(manager.get(resource)); // model known even before resolved()

		const model1 = await modelPromise;
		assert.ok(model1);
		assert.strictEqual(model1.getEncoding(), encoding);
		assert.strictEqual(manager.get(resource), model1);

		const model2 = await manager.resolve(resource, { encoding });
		assert.strictEqual(model2, model1);
		model1.dispose();

		const model3 = await manager.resolve(resource, { encoding });
		assert.notStrictEqual(model3, model2);
		assert.strictEqual(manager.get(resource), model3);
		model3.dispose();

		assert.strictEqual(events.length, 2);
		assert.strictEqual(events[0].resource.toString(), model1.resource.toString());
		assert.strictEqual(events[1].resource.toString(), model2.resource.toString());
	});

	test('resolve (async)', async () => {
		const manager = accessor.textFileService.files as ITestTextFileEditorModelManager;
		const resource = URI.file('/path/index.txt');

		disposables.add(await manager.resolve(resource));

		let didResolve = false;
		const onDidResolve = new Promise<void>(resolve => {
			disposables.add(manager.onDidResolve(({ model }) => {
				if (model.resource.toString() === resource.toString()) {
					didResolve = true;
					resolve();
				}
			}));
		});

		manager.resolve(resource, { reload: { async: true } });

		await onDidResolve;

		assert.strictEqual(didResolve, true);
	});

	test('resolve (sync)', async () => {
		const manager = accessor.textFileService.files as ITestTextFileEditorModelManager;
		const resource = URI.file('/path/index.txt');

		disposables.add(await manager.resolve(resource));

		let didResolve = false;
		disposables.add(manager.onDidResolve(({ model }) => {
			if (model.resource.toString() === resource.toString()) {
				didResolve = true;
			}
		}));

		await manager.resolve(resource, { reload: { async: false } });
		assert.strictEqual(didResolve, true);
	});

	test('resolve (sync) - model disposed when error and first call to resolve', async () => {
		const manager = accessor.textFileService.files as ITestTextFileEditorModelManager;
		const resource = URI.file('/path/index.txt');

		accessor.textFileService.setReadStreamErrorOnce(new FileOperationError('fail', FileOperationResult.FILE_OTHER_ERROR));

		let error: Error | undefined = undefined;
		try {
			disposables.add(await manager.resolve(resource));
		} catch (e) {
			error = e;
		}

		assert.ok(error);
		assert.strictEqual(manager.models.length, 0);
	});

	test('resolve (sync) - model not disposed when error and model existed before', async () => {
		const manager = accessor.textFileService.files as ITestTextFileEditorModelManager;
		const resource = URI.file('/path/index.txt');

		disposables.add(await manager.resolve(resource));

		accessor.textFileService.setReadStreamErrorOnce(new FileOperationError('fail', FileOperationResult.FILE_OTHER_ERROR));

		let error: Error | undefined = undefined;
		try {
			disposables.add(await manager.resolve(resource, { reload: { async: false } }));
		} catch (e) {
			error = e;
		}

		assert.ok(error);
		assert.strictEqual(manager.models.length, 1);
	});

	test('resolve with initial contents', async () => {
		const manager = accessor.textFileService.files as ITestTextFileEditorModelManager;
		const resource = URI.file('/test.html');

		const model = disposables.add(await manager.resolve(resource, { contents: createTextBufferFactory('Hello World') }));
		assert.strictEqual(model.textEditorModel?.getValue(), 'Hello World');
		assert.strictEqual(model.isDirty(), true);

		disposables.add(await manager.resolve(resource, { contents: createTextBufferFactory('More Changes') }));
		assert.strictEqual(model.textEditorModel?.getValue(), 'More Changes');
		assert.strictEqual(model.isDirty(), true);
	});

	test('multiple resolves execute in sequence', async () => {
		const manager = accessor.textFileService.files as ITestTextFileEditorModelManager;
		const resource = URI.file('/test.html');

		let resolvedModel: unknown;

		const contents: string[] = [];
		disposables.add(manager.onDidResolve(e => {
			if (e.model.resource.toString() === resource.toString()) {
				resolvedModel = disposables.add(e.model as TextFileEditorModel);
				contents.push(e.model.textEditorModel!.getValue());
			}
		}));

		await Promise.all([
			manager.resolve(resource),
			manager.resolve(resource, { contents: createTextBufferFactory('Hello World') }),
			manager.resolve(resource, { reload: { async: false } }),
			manager.resolve(resource, { contents: createTextBufferFactory('More Changes') })
		]);

		assert.ok(resolvedModel instanceof TextFileEditorModel);

		assert.strictEqual(resolvedModel.textEditorModel?.getValue(), 'More Changes');
		assert.strictEqual(resolvedModel.isDirty(), true);

		assert.strictEqual(contents[0], 'Hello Html');
		assert.strictEqual(contents[1], 'Hello World');
		assert.strictEqual(contents[2], 'More Changes');
	});

	test('removed from cache when model disposed', function () {
		const manager = accessor.textFileService.files as ITestTextFileEditorModelManager;

		const model1: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/random1.txt'), 'utf8', undefined));
		const model2: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/random2.txt'), 'utf8', undefined));
		const model3: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/random3.txt'), 'utf8', undefined));

		manager.add(URI.file('/test.html'), model1);
		manager.add(URI.file('/some/other.html'), model2);
		manager.add(URI.file('/some/this.txt'), model3);

		assert.strictEqual(manager.get(URI.file('/test.html')), model1);

		model1.dispose();
		assert(!manager.get(URI.file('/test.html')));
	});

	test('events', async function () {
		const manager = accessor.textFileService.files as ITestTextFileEditorModelManager;

		const resource1 = toResource.call(this, '/path/index.txt');
		const resource2 = toResource.call(this, '/path/other.txt');

		let resolvedCounter = 0;
		let removedCounter = 0;
		let gotDirtyCounter = 0;
		let gotNonDirtyCounter = 0;
		let revertedCounter = 0;
		let savedCounter = 0;
		let encodingCounter = 0;

		disposables.add(manager.onDidResolve(({ model }) => {
			if (model.resource.toString() === resource1.toString()) {
				resolvedCounter++;
			}
		}));

		disposables.add(manager.onDidRemove(resource => {
			if (resource.toString() === resource1.toString() || resource.toString() === resource2.toString()) {
				removedCounter++;
			}
		}));

		disposables.add(manager.onDidChangeDirty(model => {
			if (model.resource.toString() === resource1.toString()) {
				if (model.isDirty()) {
					gotDirtyCounter++;
				} else {
					gotNonDirtyCounter++;
				}
			}
		}));

		disposables.add(manager.onDidRevert(model => {
			if (model.resource.toString() === resource1.toString()) {
				revertedCounter++;
			}
		}));

		disposables.add(manager.onDidSave(({ model }) => {
			if (model.resource.toString() === resource1.toString()) {
				savedCounter++;
			}
		}));

		disposables.add(manager.onDidChangeEncoding(model => {
			if (model.resource.toString() === resource1.toString()) {
				encodingCounter++;
			}
		}));

		const model1 = await manager.resolve(resource1, { encoding: 'utf8' });
		assert.strictEqual(resolvedCounter, 1);

		accessor.fileService.fireFileChanges(new FileChangesEvent([{ resource: resource1, type: FileChangeType.DELETED }], false));
		accessor.fileService.fireFileChanges(new FileChangesEvent([{ resource: resource1, type: FileChangeType.ADDED }], false));

		const model2 = await manager.resolve(resource2, { encoding: 'utf8' });
		assert.strictEqual(resolvedCounter, 2);

		(model1 as TextFileEditorModel).updateTextEditorModel(createTextBufferFactory('changed'));
		model1.updatePreferredEncoding('utf16');

		await model1.revert();
		(model1 as TextFileEditorModel).updateTextEditorModel(createTextBufferFactory('changed again'));

		await model1.save();
		model1.dispose();
		model2.dispose();

		await model1.revert();
		assert.strictEqual(removedCounter, 2);
		assert.strictEqual(gotDirtyCounter, 2);
		assert.strictEqual(gotNonDirtyCounter, 2);
		assert.strictEqual(revertedCounter, 1);
		assert.strictEqual(savedCounter, 1);
		assert.strictEqual(encodingCounter, 2);

		model1.dispose();
		model2.dispose();
		assert.ok(!accessor.modelService.getModel(resource1));
		assert.ok(!accessor.modelService.getModel(resource2));
	});

	test('disposing model takes it out of the manager', async function () {
		const manager = accessor.textFileService.files as ITestTextFileEditorModelManager;

		const resource = toResource.call(this, '/path/index_something.txt');

		const model = await manager.resolve(resource, { encoding: 'utf8' });
		model.dispose();
		assert.ok(!manager.get(resource));
		assert.ok(!accessor.modelService.getModel(model.resource));
	});

	test('canDispose with dirty model', async function () {
		const manager = accessor.textFileService.files as ITestTextFileEditorModelManager;

		const resource = toResource.call(this, '/path/index_something.txt');

		const model = disposables.add(await manager.resolve(resource, { encoding: 'utf8' }));
		(model as TextFileEditorModel).updateTextEditorModel(createTextBufferFactory('make dirty'));

		const canDisposePromise = manager.canDispose(model as TextFileEditorModel);
		assert.ok(canDisposePromise instanceof Promise);

		let canDispose = false;
		(async () => {
			canDispose = await canDisposePromise;
		})();

		assert.strictEqual(canDispose, false);
		model.revert({ soft: true });

		await timeout(0);

		assert.strictEqual(canDispose, true);

		const canDispose2 = manager.canDispose(model as TextFileEditorModel);
		assert.strictEqual(canDispose2, true);
	});

	test('language', async function () {

		const languageId = 'text-file-model-manager-test';
		disposables.add(accessor.languageService.registerLanguage({
			id: languageId,
		}));

		const manager = accessor.textFileService.files as ITestTextFileEditorModelManager;

		const resource: URI = toResource.call(this, '/path/index_something.txt');

		let model = disposables.add(await manager.resolve(resource, { languageId: languageId }));
		assert.strictEqual(model.textEditorModel!.getLanguageId(), languageId);

		model = await manager.resolve(resource, { languageId: 'text' });
		assert.strictEqual(model.textEditorModel!.getLanguageId(), PLAINTEXT_LANGUAGE_ID);
	});

	test('file change events trigger reload (on a resolved model)', async () => {
		const manager = accessor.textFileService.files as ITestTextFileEditorModelManager;
		const resource = URI.file('/path/index.txt');

		disposables.add(await manager.resolve(resource));

		let didResolve = false;
		const onDidResolve = new Promise<void>(resolve => {
			disposables.add(manager.onDidResolve(({ model }) => {
				if (model.resource.toString() === resource.toString()) {
					didResolve = true;
					resolve();
				}
			}));
		});

		accessor.fileService.fireFileChanges(new FileChangesEvent([{ resource, type: FileChangeType.UPDATED }], false));

		await onDidResolve;
		assert.strictEqual(didResolve, true);
	});

	test('file change events trigger reload (after a model is resolved: https://github.com/microsoft/vscode/issues/132765)', async () => {
		const manager = accessor.textFileService.files as ITestTextFileEditorModelManager;
		const resource = URI.file('/path/index.txt');

		manager.resolve(resource);

		let didResolve = false;
		let resolvedCounter = 0;
		const onDidResolve = new Promise<void>(resolve => {
			disposables.add(manager.onDidResolve(({ model }) => {
				disposables.add(model);
				if (model.resource.toString() === resource.toString()) {
					resolvedCounter++;
					if (resolvedCounter === 2) {
						didResolve = true;
						resolve();
					}
				}
			}));
		});

		accessor.fileService.fireFileChanges(new FileChangesEvent([{ resource, type: FileChangeType.UPDATED }], false));

		await onDidResolve;
		assert.strictEqual(didResolve, true);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/textfile/test/browser/textFileService.test.ts]---
Location: vscode-main/src/vs/workbench/services/textfile/test/browser/textFileService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { workbenchInstantiationService, TestServiceAccessor, ITestTextFileEditorModelManager } from '../../../../test/browser/workbenchTestServices.js';
import { ensureNoDisposablesAreLeakedInTestSuite, toResource } from '../../../../../base/test/common/utils.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { TextFileEditorModel } from '../../common/textFileEditorModel.js';
import { FileOperation } from '../../../../../platform/files/common/files.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { EncodingMode } from '../../common/textfiles.js';

suite('Files - TextFileService', () => {

	const disposables = new DisposableStore();
	let instantiationService: IInstantiationService;
	let accessor: TestServiceAccessor;

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables);
		accessor = instantiationService.createInstance(TestServiceAccessor);
		disposables.add(<ITestTextFileEditorModelManager>accessor.textFileService.files);
	});

	teardown(() => {
		disposables.clear();
	});

	test('isDirty/getDirty - files and untitled', async function () {
		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/file.txt'), 'utf8', undefined));
		(<ITestTextFileEditorModelManager>accessor.textFileService.files).add(model.resource, model);

		await model.resolve();

		assert.ok(!accessor.textFileService.isDirty(model.resource));
		model.textEditorModel!.setValue('foo');

		assert.ok(accessor.textFileService.isDirty(model.resource));

		const untitled = disposables.add(await accessor.textFileService.untitled.resolve());

		assert.ok(!accessor.textFileService.isDirty(untitled.resource));
		untitled.textEditorModel?.setValue('changed');

		assert.ok(accessor.textFileService.isDirty(untitled.resource));
	});

	test('save - file', async function () {
		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/file.txt'), 'utf8', undefined));
		(<ITestTextFileEditorModelManager>accessor.textFileService.files).add(model.resource, model);

		await model.resolve();
		model.textEditorModel!.setValue('foo');
		assert.ok(accessor.textFileService.isDirty(model.resource));

		const res = await accessor.textFileService.save(model.resource);
		assert.strictEqual(res?.toString(), model.resource.toString());
		assert.ok(!accessor.textFileService.isDirty(model.resource));
	});

	test('saveAll - file', async function () {
		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/file.txt'), 'utf8', undefined));
		(<ITestTextFileEditorModelManager>accessor.textFileService.files).add(model.resource, model);

		await model.resolve();
		model.textEditorModel!.setValue('foo');
		assert.ok(accessor.textFileService.isDirty(model.resource));

		const res = await accessor.textFileService.save(model.resource);
		assert.strictEqual(res?.toString(), model.resource.toString());
		assert.ok(!accessor.textFileService.isDirty(model.resource));
	});

	test('saveAs - file', async function () {
		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/file.txt'), 'utf8', undefined));
		(<ITestTextFileEditorModelManager>accessor.textFileService.files).add(model.resource, model);
		accessor.fileDialogService.setPickFileToSave(model.resource);

		await model.resolve();
		model.textEditorModel!.setValue('foo');
		assert.ok(accessor.textFileService.isDirty(model.resource));

		const res = await accessor.textFileService.saveAs(model.resource);
		assert.strictEqual(res!.toString(), model.resource.toString());
		assert.ok(!accessor.textFileService.isDirty(model.resource));
	});

	test('revert - file', async function () {
		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/file.txt'), 'utf8', undefined));
		(<ITestTextFileEditorModelManager>accessor.textFileService.files).add(model.resource, model);
		accessor.fileDialogService.setPickFileToSave(model.resource);

		await model.resolve();
		model.textEditorModel!.setValue('foo');
		assert.ok(accessor.textFileService.isDirty(model.resource));

		await accessor.textFileService.revert(model.resource);
		assert.ok(!accessor.textFileService.isDirty(model.resource));
	});

	test('create does not overwrite existing model', async function () {
		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/file.txt'), 'utf8', undefined));
		(<ITestTextFileEditorModelManager>accessor.textFileService.files).add(model.resource, model);

		await model.resolve();
		model.textEditorModel!.setValue('foo');
		assert.ok(accessor.textFileService.isDirty(model.resource));

		let eventCounter = 0;

		disposables.add(accessor.workingCopyFileService.addFileOperationParticipant({
			participate: async files => {
				assert.strictEqual(files[0].target.toString(), model.resource.toString());
				eventCounter++;
			}
		}));

		disposables.add(accessor.workingCopyFileService.onDidRunWorkingCopyFileOperation(e => {
			assert.strictEqual(e.operation, FileOperation.CREATE);
			assert.strictEqual(e.files[0].target.toString(), model.resource.toString());
			eventCounter++;
		}));

		await accessor.textFileService.create([{ resource: model.resource, value: 'Foo' }]);
		assert.ok(!accessor.textFileService.isDirty(model.resource));

		assert.strictEqual(eventCounter, 2);
	});

	test('Filename Suggestion - Suggest prefix only when there are no relevant extensions', () => {
		disposables.add(accessor.languageService.registerLanguage({
			id: 'plumbus0',
			extensions: ['.one', '.two']
		}));

		const suggested = accessor.textFileService.suggestFilename('shleem', 'Untitled-1');
		assert.strictEqual(suggested, 'Untitled-1');
	});

	test('Filename Suggestion - Suggest prefix with first extension', () => {
		disposables.add(accessor.languageService.registerLanguage({
			id: 'plumbus1',
			extensions: ['.shleem', '.gazorpazorp'],
			filenames: ['plumbus']
		}));

		const suggested = accessor.textFileService.suggestFilename('plumbus1', 'Untitled-1');
		assert.strictEqual(suggested, 'Untitled-1.shleem');
	});

	test('Filename Suggestion - Preserve extension if it matchers', () => {
		disposables.add(accessor.languageService.registerLanguage({
			id: 'plumbus2',
			extensions: ['.shleem', '.gazorpazorp'],
		}));

		const suggested = accessor.textFileService.suggestFilename('plumbus2', 'Untitled-1.gazorpazorp');
		assert.strictEqual(suggested, 'Untitled-1.gazorpazorp');
	});

	test('Filename Suggestion - Rewrite extension according to language', () => {
		disposables.add(accessor.languageService.registerLanguage({
			id: 'plumbus2',
			extensions: ['.shleem', '.gazorpazorp'],
		}));

		const suggested = accessor.textFileService.suggestFilename('plumbus2', 'Untitled-1.foobar');
		assert.strictEqual(suggested, 'Untitled-1.shleem');
	});

	test('Filename Suggestion - Suggest filename if there are no extensions', () => {
		disposables.add(accessor.languageService.registerLanguage({
			id: 'plumbus2',
			filenames: ['plumbus', 'shleem', 'gazorpazorp']
		}));

		const suggested = accessor.textFileService.suggestFilename('plumbus2', 'Untitled-1');
		assert.strictEqual(suggested, 'plumbus');
	});

	test('Filename Suggestion - Preserve filename if it matches', () => {
		disposables.add(accessor.languageService.registerLanguage({
			id: 'plumbus2',
			filenames: ['plumbus', 'shleem', 'gazorpazorp']
		}));

		const suggested = accessor.textFileService.suggestFilename('plumbus2', 'gazorpazorp');
		assert.strictEqual(suggested, 'gazorpazorp');
	});

	test('Filename Suggestion - Rewrites filename according to language', () => {
		disposables.add(accessor.languageService.registerLanguage({
			id: 'plumbus2',
			filenames: ['plumbus', 'shleem', 'gazorpazorp']
		}));

		const suggested = accessor.textFileService.suggestFilename('plumbus2', 'foobar');
		assert.strictEqual(suggested, 'plumbus');
	});

	test('getEncoding() - files and untitled', async function () {
		const model: TextFileEditorModel = disposables.add(instantiationService.createInstance(TextFileEditorModel, toResource.call(this, '/path/file.txt'), 'utf8', undefined));
		(<ITestTextFileEditorModelManager>accessor.textFileService.files).add(model.resource, model);

		await model.resolve();

		assert.strictEqual(accessor.textFileService.getEncoding(model.resource), 'utf8');
		await model.setEncoding('utf16', EncodingMode.Encode);
		assert.strictEqual(accessor.textFileService.getEncoding(model.resource), 'utf16');

		const untitled = disposables.add(await accessor.textFileService.untitled.resolve());

		assert.strictEqual(accessor.textFileService.getEncoding(untitled.resource), 'utf8');
		await untitled.setEncoding('utf16');
		assert.strictEqual(accessor.textFileService.getEncoding(untitled.resource), 'utf16');
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/textfile/test/common/textFileService.io.test.ts]---
Location: vscode-main/src/vs/workbench/services/textfile/test/common/textFileService.io.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ITextFileService, snapshotToString, TextFileOperationError, TextFileOperationResult, stringToSnapshot } from '../../common/textfiles.js';
import { URI } from '../../../../../base/common/uri.js';
import { join, basename } from '../../../../../base/common/path.js';
import { UTF16le, UTF8_with_bom, UTF16be, UTF8, UTF16le_BOM, UTF16be_BOM, UTF8_BOM } from '../../common/encoding.js';
import { bufferToStream, VSBuffer } from '../../../../../base/common/buffer.js';
import { createTextModel } from '../../../../../editor/test/common/testTextModel.js';
import { ITextSnapshot, DefaultEndOfLine } from '../../../../../editor/common/model.js';
import { isWindows } from '../../../../../base/common/platform.js';
import { createTextBufferFactoryFromStream } from '../../../../../editor/common/model/textModel.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';

export interface Params {
	setup(): Promise<{
		service: ITextFileService;
		testDir: string;
	}>;
	teardown(): Promise<void>;

	exists(fsPath: string): Promise<boolean>;
	stat(fsPath: string): Promise<{ size: number }>;
	readFile(fsPath: string): Promise<VSBuffer | Buffer>;
	readFile(fsPath: string, encoding: string): Promise<string>;
	readFile(fsPath: string, encoding?: string): Promise<VSBuffer | Buffer | string>;
	detectEncodingByBOM(fsPath: string): Promise<typeof UTF16be | typeof UTF16le | typeof UTF8_with_bom | null>;
}

/**
 * Allows us to reuse test suite across different environments.
 *
 * It introduces a bit of complexity with setup and teardown, however
 * it helps us to ensure that tests are added for all environments at once,
 * hence helps us catch bugs better.
 */
export default function createSuite(params: Params) {
	let service: ITextFileService;
	let testDir = '';
	const { exists, stat, readFile, detectEncodingByBOM } = params;
	const disposables = new DisposableStore();

	setup(async () => {
		const result = await params.setup();
		service = result.service;
		testDir = result.testDir;
	});

	teardown(async () => {
		await params.teardown();
		disposables.clear();
	});

	test('create - no encoding - content empty', async () => {
		const resource = URI.file(join(testDir, 'small_new.txt'));

		await service.create([{ resource }]);

		const res = await readFile(resource.fsPath);
		assert.strictEqual(res.byteLength, 0 /* no BOM */);
	});

	test('create - no encoding - content provided (string)', async () => {
		const resource = URI.file(join(testDir, 'small_new.txt'));

		await service.create([{ resource, value: 'Hello World' }]);

		const res = await readFile(resource.fsPath);
		assert.strictEqual(res.toString(), 'Hello World');
		assert.strictEqual(res.byteLength, 'Hello World'.length);
	});

	test('create - no encoding - content provided (snapshot)', async () => {
		const resource = URI.file(join(testDir, 'small_new.txt'));

		await service.create([{ resource, value: stringToSnapshot('Hello World') }]);

		const res = await readFile(resource.fsPath);
		assert.strictEqual(res.toString(), 'Hello World');
		assert.strictEqual(res.byteLength, 'Hello World'.length);
	});

	test('create - UTF 16 LE - no content', async () => {
		const resource = URI.file(join(testDir, 'small_new.utf16le'));

		await service.create([{ resource }]);

		assert.strictEqual(await exists(resource.fsPath), true);

		const detectedEncoding = await detectEncodingByBOM(resource.fsPath);
		assert.strictEqual(detectedEncoding, UTF16le);

		const res = await readFile(resource.fsPath);
		assert.strictEqual(res.byteLength, UTF16le_BOM.length);
	});

	test('create - UTF 16 LE - content provided', async () => {
		const resource = URI.file(join(testDir, 'small_new.utf16le'));

		await service.create([{ resource, value: 'Hello World' }]);

		assert.strictEqual(await exists(resource.fsPath), true);

		const detectedEncoding = await detectEncodingByBOM(resource.fsPath);
		assert.strictEqual(detectedEncoding, UTF16le);

		const res = await readFile(resource.fsPath);
		assert.strictEqual(res.byteLength, 'Hello World'.length * 2 /* UTF16 2bytes per char */ + UTF16le_BOM.length);
	});

	test('create - UTF 16 BE - no content', async () => {
		const resource = URI.file(join(testDir, 'small_new.utf16be'));

		await service.create([{ resource }]);

		assert.strictEqual(await exists(resource.fsPath), true);

		const detectedEncoding = await detectEncodingByBOM(resource.fsPath);
		assert.strictEqual(detectedEncoding, UTF16be);

		const res = await readFile(resource.fsPath);
		assert.strictEqual(res.byteLength, UTF16le_BOM.length);
	});

	test('create - UTF 16 BE - content provided', async () => {
		const resource = URI.file(join(testDir, 'small_new.utf16be'));

		await service.create([{ resource, value: 'Hello World' }]);

		assert.strictEqual(await exists(resource.fsPath), true);

		const detectedEncoding = await detectEncodingByBOM(resource.fsPath);
		assert.strictEqual(detectedEncoding, UTF16be);

		const res = await readFile(resource.fsPath);
		assert.strictEqual(res.byteLength, 'Hello World'.length * 2 /* UTF16 2bytes per char */ + UTF16be_BOM.length);
	});

	test('create - UTF 8 BOM - no content', async () => {
		const resource = URI.file(join(testDir, 'small_new.utf8bom'));

		await service.create([{ resource }]);

		assert.strictEqual(await exists(resource.fsPath), true);

		const detectedEncoding = await detectEncodingByBOM(resource.fsPath);
		assert.strictEqual(detectedEncoding, UTF8_with_bom);

		const res = await readFile(resource.fsPath);
		assert.strictEqual(res.byteLength, UTF8_BOM.length);
	});

	test('create - UTF 8 BOM - content provided', async () => {
		const resource = URI.file(join(testDir, 'small_new.utf8bom'));

		await service.create([{ resource, value: 'Hello World' }]);

		assert.strictEqual(await exists(resource.fsPath), true);

		const detectedEncoding = await detectEncodingByBOM(resource.fsPath);
		assert.strictEqual(detectedEncoding, UTF8_with_bom);

		const res = await readFile(resource.fsPath);
		assert.strictEqual(res.byteLength, 'Hello World'.length + UTF8_BOM.length);
	});

	function createTextModelSnapshot(text: string, preserveBOM?: boolean): ITextSnapshot {
		const textModel = disposables.add(createTextModel(text));
		const snapshot = textModel.createSnapshot(preserveBOM);

		return snapshot;
	}

	test('create - UTF 8 BOM - empty content - snapshot', async () => {
		const resource = URI.file(join(testDir, 'small_new.utf8bom'));

		await service.create([{ resource, value: createTextModelSnapshot('') }]);

		assert.strictEqual(await exists(resource.fsPath), true);

		const detectedEncoding = await detectEncodingByBOM(resource.fsPath);
		assert.strictEqual(detectedEncoding, UTF8_with_bom);

		const res = await readFile(resource.fsPath);
		assert.strictEqual(res.byteLength, UTF8_BOM.length);
	});

	test('create - UTF 8 BOM - content provided - snapshot', async () => {
		const resource = URI.file(join(testDir, 'small_new.utf8bom'));

		await service.create([{ resource, value: createTextModelSnapshot('Hello World') }]);

		assert.strictEqual(await exists(resource.fsPath), true);

		const detectedEncoding = await detectEncodingByBOM(resource.fsPath);
		assert.strictEqual(detectedEncoding, UTF8_with_bom);

		const res = await readFile(resource.fsPath);
		assert.strictEqual(res.byteLength, 'Hello World'.length + UTF8_BOM.length);
	});

	test('write - use encoding (UTF 16 BE) - small content as string', async () => {
		await testEncoding(URI.file(join(testDir, 'small.txt')), UTF16be, 'Hello\nWorld', 'Hello\nWorld');
	});

	test('write - use encoding (UTF 16 BE) - small content as snapshot', async () => {
		await testEncoding(URI.file(join(testDir, 'small.txt')), UTF16be, createTextModelSnapshot('Hello\nWorld'), 'Hello\nWorld');
	});

	test('write - use encoding (UTF 16 BE) - large content as string', async () => {
		await testEncoding(URI.file(join(testDir, 'lorem.txt')), UTF16be, 'Hello\nWorld', 'Hello\nWorld');
	});

	test('write - use encoding (UTF 16 BE) - large content as snapshot', async () => {
		await testEncoding(URI.file(join(testDir, 'lorem.txt')), UTF16be, createTextModelSnapshot('Hello\nWorld'), 'Hello\nWorld');
	});

	async function testEncoding(resource: URI, encoding: string, content: string | ITextSnapshot, expectedContent: string) {
		await service.write(resource, content, { encoding });

		const detectedEncoding = await detectEncodingByBOM(resource.fsPath);
		assert.strictEqual(detectedEncoding, encoding);

		const resolved = await service.readStream(resource);
		assert.strictEqual(resolved.encoding, encoding);

		const textBuffer = disposables.add(resolved.value.create(isWindows ? DefaultEndOfLine.CRLF : DefaultEndOfLine.LF).textBuffer);
		assert.strictEqual(snapshotToString(textBuffer.createSnapshot(false)), expectedContent);
	}

	test('write - use encoding (cp1252)', async () => {
		const filePath = join(testDir, 'some_cp1252.txt');
		const contents = await readFile(filePath, 'utf8');
		const eol = /\r\n/.test(contents) ? '\r\n' : '\n';
		await testEncodingKeepsData(URI.file(filePath), 'cp1252', ['ObjectCount = LoadObjects("Öffentlicher Ordner");', '', 'Private = "Persönliche Information"', ''].join(eol));
	});

	test('write - use encoding (shiftjis)', async () => {
		await testEncodingKeepsData(URI.file(join(testDir, 'some_shiftjis.txt')), 'shiftjis', '中文abc');
	});

	test('write - use encoding (gbk)', async () => {
		await testEncodingKeepsData(URI.file(join(testDir, 'some_gbk.txt')), 'gbk', '中国abc');
	});

	test('write - use encoding (cyrillic)', async () => {
		await testEncodingKeepsData(URI.file(join(testDir, 'some_cyrillic.txt')), 'cp866', 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя');
	});

	test('write - use encoding (big5)', async () => {
		await testEncodingKeepsData(URI.file(join(testDir, 'some_big5.txt')), 'cp950', '中文abc');
	});

	async function testEncodingKeepsData(resource: URI, encoding: string, expected: string) {
		let resolved = await service.readStream(resource, { encoding });
		const textBuffer = disposables.add(resolved.value.create(isWindows ? DefaultEndOfLine.CRLF : DefaultEndOfLine.LF).textBuffer);
		const content = snapshotToString(textBuffer.createSnapshot(false));
		assert.strictEqual(content, expected);

		await service.write(resource, content, { encoding });

		resolved = await service.readStream(resource, { encoding });
		const textBuffer2 = disposables.add(resolved.value.create(DefaultEndOfLine.CRLF).textBuffer);
		assert.strictEqual(snapshotToString(textBuffer2.createSnapshot(false)), content);

		await service.write(resource, createTextModelSnapshot(content), { encoding });

		resolved = await service.readStream(resource, { encoding });
		const textBuffer3 = disposables.add(resolved.value.create(DefaultEndOfLine.CRLF).textBuffer);
		assert.strictEqual(snapshotToString(textBuffer3.createSnapshot(false)), content);
	}

	test('write - no encoding - content as string', async () => {
		const resource = URI.file(join(testDir, 'small.txt'));

		const content = (await readFile(resource.fsPath)).toString();

		await service.write(resource, content);

		const resolved = await service.readStream(resource);
		assert.strictEqual(resolved.value.getFirstLineText(999999), content);
	});

	test('write - no encoding - content as snapshot', async () => {
		const resource = URI.file(join(testDir, 'small.txt'));

		const content = (await readFile(resource.fsPath)).toString();

		await service.write(resource, createTextModelSnapshot(content));

		const resolved = await service.readStream(resource);
		assert.strictEqual(resolved.value.getFirstLineText(999999), content);
	});

	test('write - encoding preserved (UTF 16 LE) - content as string', async () => {
		const resource = URI.file(join(testDir, 'some_utf16le.css'));

		const resolved = await service.readStream(resource);
		assert.strictEqual(resolved.encoding, UTF16le);

		await testEncoding(URI.file(join(testDir, 'some_utf16le.css')), UTF16le, 'Hello\nWorld', 'Hello\nWorld');
	});

	test('write - encoding preserved (UTF 16 LE) - content as snapshot', async () => {
		const resource = URI.file(join(testDir, 'some_utf16le.css'));

		const resolved = await service.readStream(resource);
		assert.strictEqual(resolved.encoding, UTF16le);

		await testEncoding(URI.file(join(testDir, 'some_utf16le.css')), UTF16le, createTextModelSnapshot('Hello\nWorld'), 'Hello\nWorld');
	});

	test('write - UTF8 variations - content as string', async () => {
		const resource = URI.file(join(testDir, 'index.html'));

		let detectedEncoding = await detectEncodingByBOM(resource.fsPath);
		assert.strictEqual(detectedEncoding, null);

		const content = (await readFile(resource.fsPath)).toString() + 'updates';
		await service.write(resource, content, { encoding: UTF8_with_bom });

		detectedEncoding = await detectEncodingByBOM(resource.fsPath);
		assert.strictEqual(detectedEncoding, UTF8_with_bom);

		// ensure BOM preserved if enforced
		await service.write(resource, content, { encoding: UTF8_with_bom });
		detectedEncoding = await detectEncodingByBOM(resource.fsPath);
		assert.strictEqual(detectedEncoding, UTF8_with_bom);

		// allow to remove BOM
		await service.write(resource, content, { encoding: UTF8 });
		detectedEncoding = await detectEncodingByBOM(resource.fsPath);
		assert.strictEqual(detectedEncoding, null);

		// BOM does not come back
		await service.write(resource, content, { encoding: UTF8 });
		detectedEncoding = await detectEncodingByBOM(resource.fsPath);
		assert.strictEqual(detectedEncoding, null);
	});

	test('write - UTF8 variations - content as snapshot', async () => {
		const resource = URI.file(join(testDir, 'index.html'));

		let detectedEncoding = await detectEncodingByBOM(resource.fsPath);
		assert.strictEqual(detectedEncoding, null);

		const model = disposables.add(createTextModel((await readFile(resource.fsPath)).toString() + 'updates'));
		await service.write(resource, model.createSnapshot(), { encoding: UTF8_with_bom });

		detectedEncoding = await detectEncodingByBOM(resource.fsPath);
		assert.strictEqual(detectedEncoding, UTF8_with_bom);

		// ensure BOM preserved if enforced
		await service.write(resource, model.createSnapshot(), { encoding: UTF8_with_bom });
		detectedEncoding = await detectEncodingByBOM(resource.fsPath);
		assert.strictEqual(detectedEncoding, UTF8_with_bom);

		// allow to remove BOM
		await service.write(resource, model.createSnapshot(), { encoding: UTF8 });
		detectedEncoding = await detectEncodingByBOM(resource.fsPath);
		assert.strictEqual(detectedEncoding, null);

		// BOM does not come back
		await service.write(resource, model.createSnapshot(), { encoding: UTF8 });
		detectedEncoding = await detectEncodingByBOM(resource.fsPath);
		assert.strictEqual(detectedEncoding, null);
	});

	test('write - preserve UTF8 BOM - content as string', async () => {
		const resource = URI.file(join(testDir, 'some_utf8_bom.txt'));

		let detectedEncoding = await detectEncodingByBOM(resource.fsPath);
		assert.strictEqual(detectedEncoding, UTF8_with_bom);

		await service.write(resource, 'Hello World', { encoding: detectedEncoding });
		detectedEncoding = await detectEncodingByBOM(resource.fsPath);
		assert.strictEqual(detectedEncoding, UTF8_with_bom);
	});

	test('write - ensure BOM in empty file - content as string', async () => {
		const resource = URI.file(join(testDir, 'small.txt'));

		await service.write(resource, '', { encoding: UTF8_with_bom });

		const detectedEncoding = await detectEncodingByBOM(resource.fsPath);
		assert.strictEqual(detectedEncoding, UTF8_with_bom);
	});

	test('write - ensure BOM in empty file - content as snapshot', async () => {
		const resource = URI.file(join(testDir, 'small.txt'));

		await service.write(resource, createTextModelSnapshot(''), { encoding: UTF8_with_bom });

		const detectedEncoding = await detectEncodingByBOM(resource.fsPath);
		assert.strictEqual(detectedEncoding, UTF8_with_bom);
	});

	test('readStream - small text', async () => {
		const resource = URI.file(join(testDir, 'small.txt'));

		await testReadStream(resource);
	});

	test('readStream - large text', async () => {
		const resource = URI.file(join(testDir, 'lorem.txt'));

		await testReadStream(resource);
	});

	async function testReadStream(resource: URI): Promise<void> {
		const result = await service.readStream(resource);

		assert.strictEqual(result.name, basename(resource.fsPath));
		assert.strictEqual(result.size, (await stat(resource.fsPath)).size);

		const content = (await readFile(resource.fsPath)).toString();
		const textBuffer = disposables.add(result.value.create(DefaultEndOfLine.LF).textBuffer);
		assert.strictEqual(
			snapshotToString(textBuffer.createSnapshot(false)),
			snapshotToString(createTextModelSnapshot(content, false)));
	}

	test('read - small text', async () => {
		const resource = URI.file(join(testDir, 'small.txt'));

		await testRead(resource);
	});

	test('read - large text', async () => {
		const resource = URI.file(join(testDir, 'lorem.txt'));

		await testRead(resource);
	});

	async function testRead(resource: URI): Promise<void> {
		const result = await service.read(resource);

		assert.strictEqual(result.name, basename(resource.fsPath));
		assert.strictEqual(result.size, (await stat(resource.fsPath)).size);
		assert.strictEqual(result.value, (await readFile(resource.fsPath)).toString());
	}

	test('readStream - encoding picked up (CP1252)', async () => {
		const resource = URI.file(join(testDir, 'some_small_cp1252.txt'));
		const encoding = 'windows1252';

		const result = await service.readStream(resource, { encoding });
		assert.strictEqual(result.encoding, encoding);
		assert.strictEqual(result.value.getFirstLineText(999999), 'Private = "Persönlicheß Information"');
	});

	test('read - encoding picked up (CP1252)', async () => {
		const resource = URI.file(join(testDir, 'some_small_cp1252.txt'));
		const encoding = 'windows1252';

		const result = await service.read(resource, { encoding });
		assert.strictEqual(result.encoding, encoding);
		assert.strictEqual(result.value, 'Private = "Persönlicheß Information"');
	});

	test('read - encoding picked up (binary)', async () => {
		const resource = URI.file(join(testDir, 'some_small_cp1252.txt'));
		const encoding = 'binary';

		const result = await service.read(resource, { encoding });
		assert.strictEqual(result.encoding, encoding);
		assert.strictEqual(result.value, 'Private = "Persönlicheß Information"');
	});

	test('read - encoding picked up (base64)', async () => {
		const resource = URI.file(join(testDir, 'some_small_cp1252.txt'));
		const encoding = 'base64';

		const result = await service.read(resource, { encoding });
		assert.strictEqual(result.encoding, encoding);
		assert.strictEqual(result.value, btoa('Private = "Persönlicheß Information"'));
	});

	test('readStream - user overrides BOM', async () => {
		const resource = URI.file(join(testDir, 'some_utf16le.css'));

		const result = await service.readStream(resource, { encoding: 'windows1252' });
		assert.strictEqual(result.encoding, 'windows1252');
	});

	test('readStream - BOM removed', async () => {
		const resource = URI.file(join(testDir, 'some_utf8_bom.txt'));

		const result = await service.readStream(resource);
		assert.strictEqual(result.value.getFirstLineText(999999), 'This is some UTF 8 with BOM file.');
	});

	test('readStream - invalid encoding', async () => {
		const resource = URI.file(join(testDir, 'index.html'));

		const result = await service.readStream(resource, { encoding: 'superduper' });
		assert.strictEqual(result.encoding, 'utf8');
	});

	test('readStream - encoding override', async () => {
		const resource = URI.file(join(testDir, 'some.utf16le'));

		const result = await service.readStream(resource, { encoding: 'windows1252' });
		assert.strictEqual(result.encoding, 'utf16le');
		assert.strictEqual(result.value.getFirstLineText(999999), 'This is some UTF 16 with BOM file.');
	});

	test('readStream - large Big5', async () => {
		await testLargeEncoding('big5', '中文abc');
	});

	test('readStream - large CP1252', async () => {
		await testLargeEncoding('cp1252', 'öäüß');
	});

	test('readStream - large Cyrillic', async () => {
		await testLargeEncoding('cp866', 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя');
	});

	test('readStream - large GBK', async () => {
		await testLargeEncoding('gbk', '中国abc');
	});

	test('readStream - large ShiftJIS', async () => {
		await testLargeEncoding('shiftjis', '中文abc');
	});

	test('readStream - large UTF8 BOM', async () => {
		await testLargeEncoding('utf8bom', 'öäüß');
	});

	test('readStream - large UTF16 LE', async () => {
		await testLargeEncoding('utf16le', 'öäüß');
	});

	test('readStream - large UTF16 BE', async () => {
		await testLargeEncoding('utf16be', 'öäüß');
	});

	async function testLargeEncoding(encoding: string, needle: string): Promise<void> {
		const resource = URI.file(join(testDir, `lorem_${encoding}.txt`));

		// Verify via `ITextFileService.readStream`
		const result = await service.readStream(resource, { encoding });
		assert.strictEqual(result.encoding, encoding);

		const textBuffer = disposables.add(result.value.create(DefaultEndOfLine.LF).textBuffer);
		let contents = snapshotToString(textBuffer.createSnapshot(false));

		assert.strictEqual(contents.indexOf(needle), 0);
		assert.ok(contents.indexOf(needle, 10) > 0);

		// Verify via `ITextFileService.getDecodedTextFactory`
		const rawFile = await params.readFile(resource.fsPath);
		let rawFileVSBuffer: VSBuffer;
		if (rawFile instanceof VSBuffer) {
			rawFileVSBuffer = rawFile;
		} else {
			rawFileVSBuffer = VSBuffer.wrap(rawFile);
		}

		const factory = await createTextBufferFactoryFromStream(await service.getDecodedStream(resource, bufferToStream(rawFileVSBuffer), { encoding }));

		const textBuffer2 = disposables.add(factory.create(DefaultEndOfLine.LF).textBuffer);
		contents = snapshotToString(textBuffer2.createSnapshot(false));

		assert.strictEqual(contents.indexOf(needle), 0);
		assert.ok(contents.indexOf(needle, 10) > 0);
	}

	test('readStream - UTF16 LE (no BOM)', async () => {
		const resource = URI.file(join(testDir, 'utf16_le_nobom.txt'));

		const result = await service.readStream(resource);
		assert.strictEqual(result.encoding, 'utf16le');
	});

	test('readStream - UTF16 BE (no BOM)', async () => {
		const resource = URI.file(join(testDir, 'utf16_be_nobom.txt'));

		const result = await service.readStream(resource);
		assert.strictEqual(result.encoding, 'utf16be');
	});

	test('readStream - autoguessEncoding', async () => {
		const resource = URI.file(join(testDir, 'some_cp1252.txt'));

		const result = await service.readStream(resource, { autoGuessEncoding: true });
		assert.strictEqual(result.encoding, 'windows1252');
	});

	test('readStream - autoguessEncoding (candidateGuessEncodings)', async () => {
		// This file is determined to be Windows-1252 unless candidateDetectEncoding is set.
		const resource = URI.file(join(testDir, 'some.shiftjis.1.txt'));

		const result = await service.readStream(resource, { autoGuessEncoding: true, candidateGuessEncodings: ['utf-8', 'shiftjis', 'euc-jp'] });
		assert.strictEqual(result.encoding, 'shiftjis');
	});

	test('readStream - autoguessEncoding (candidateGuessEncodings is Empty)', async () => {
		const resource = URI.file(join(testDir, 'some_cp1252.txt'));

		const result = await service.readStream(resource, { autoGuessEncoding: true, candidateGuessEncodings: [] });
		assert.strictEqual(result.encoding, 'windows1252');
	});

	test('readStream - FILE_IS_BINARY', async () => {
		const resource = URI.file(join(testDir, 'binary.txt'));

		let error: TextFileOperationError | undefined = undefined;
		try {
			await service.readStream(resource, { acceptTextOnly: true });
		} catch (err) {
			error = err;
		}

		assert.ok(error);
		assert.strictEqual(error.textFileOperationResult, TextFileOperationResult.FILE_IS_BINARY);

		const result = await service.readStream(URI.file(join(testDir, 'small.txt')), { acceptTextOnly: true });
		assert.strictEqual(result.name, 'small.txt');
	});

	test('read - FILE_IS_BINARY', async () => {
		const resource = URI.file(join(testDir, 'binary.txt'));

		let error: TextFileOperationError | undefined = undefined;
		try {
			await service.read(resource, { acceptTextOnly: true });
		} catch (err) {
			error = err;
		}

		assert.ok(error);
		assert.strictEqual(error.textFileOperationResult, TextFileOperationResult.FILE_IS_BINARY);

		const result = await service.read(URI.file(join(testDir, 'small.txt')), { acceptTextOnly: true });
		assert.strictEqual(result.name, 'small.txt');
	});
}
```

--------------------------------------------------------------------------------

````

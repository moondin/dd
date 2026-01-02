---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 366
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 366 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/test/browser/chatEditingCheckpointTimeline.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/chatEditingCheckpointTimeline.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../../base/common/map.js';
import { transaction } from '../../../../../base/common/observable.js';
import { URI } from '../../../../../base/common/uri.js';
import { upcastPartial } from '../../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { SyncDescriptor } from '../../../../../platform/instantiation/common/descriptors.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { INotebookService } from '../../../notebook/common/notebookService.js';
import { ChatEditingCheckpointTimelineImpl, IChatEditingTimelineFsDelegate } from '../../browser/chatEditing/chatEditingCheckpointTimelineImpl.js';
import { FileOperation, FileOperationType } from '../../browser/chatEditing/chatEditingOperations.js';
import { IModifiedEntryTelemetryInfo } from '../../common/chatEditingService.js';

suite('ChatEditingCheckpointTimeline', function () {

	const store = new DisposableStore();
	let timeline: ChatEditingCheckpointTimelineImpl;
	let fileContents: ResourceMap<string>;
	let fileDelegate: IChatEditingTimelineFsDelegate;

	const DEFAULT_TELEMETRY_INFO: IModifiedEntryTelemetryInfo = upcastPartial({
		agentId: 'testAgent',
		command: undefined,
		sessionResource: URI.parse('chat://test-session'),
		requestId: 'test-request',
		result: undefined,
		modelId: undefined,
		modeId: undefined,
		applyCodeBlockSuggestionId: undefined,
		feature: undefined,
	});

	function createTextEditOperation(uri: URI, requestId: string, epoch: number, edits: { range: Range; text: string }[]): FileOperation {
		return upcastPartial<FileOperation>({
			type: FileOperationType.TextEdit,
			uri,
			requestId,
			epoch,
			edits
		});
	}

	function createFileCreateOperation(uri: URI, requestId: string, epoch: number, initialContent: string): FileOperation {
		return upcastPartial<FileOperation>({
			type: FileOperationType.Create,
			uri,
			requestId,
			epoch,
			initialContent
		});
	}

	function createFileDeleteOperation(uri: URI, requestId: string, epoch: number, finalContent: string): FileOperation {
		return upcastPartial<FileOperation>({
			type: FileOperationType.Delete,
			uri,
			requestId,
			epoch,
			finalContent
		});
	}

	function createFileRenameOperation(oldUri: URI, newUri: URI, requestId: string, epoch: number): FileOperation {
		return upcastPartial<FileOperation>({
			type: FileOperationType.Rename,
			uri: newUri,
			requestId,
			epoch,
			oldUri,
			newUri
		});
	}

	setup(function () {
		fileContents = new ResourceMap<string>();

		fileDelegate = {
			createFile: async (uri: URI, initialContent: string) => {
				fileContents.set(uri, initialContent);
			},
			deleteFile: async (uri: URI) => {
				fileContents.delete(uri);
			},
			renameFile: async (fromUri: URI, toUri: URI) => {
				const content = fileContents.get(fromUri);
				if (content !== undefined) {
					fileContents.set(toUri, content);
					fileContents.delete(fromUri);
				}
			},
			setContents: async (uri: URI, content: string) => {
				fileContents.set(uri, content);
			}
		};

		const collection = new ServiceCollection();
		collection.set(INotebookService, new SyncDescriptor(TestNotebookService));
		const insta = store.add(workbenchInstantiationService(undefined, store).createChild(collection));

		timeline = insta.createInstance(ChatEditingCheckpointTimelineImpl, URI.parse('chat://test-session'), fileDelegate);
	});

	teardown(() => {
		store.clear();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('creates initial checkpoint on construction', function () {
		const checkpoints = timeline.getStateForPersistence().checkpoints;
		assert.strictEqual(checkpoints.length, 1);
		assert.strictEqual(checkpoints[0].requestId, undefined);
		assert.strictEqual(checkpoints[0].label, 'Initial State');
	});

	test('canUndo and canRedo are initially false', function () {
		assert.strictEqual(timeline.canUndo.get(), false);
		assert.strictEqual(timeline.canRedo.get(), false);
	});

	test('createCheckpoint increments epoch and creates checkpoint', function () {
		const initialEpoch = timeline.getStateForPersistence().epochCounter;

		timeline.createCheckpoint('req1', 'stop1', 'Checkpoint 1');

		const state = timeline.getStateForPersistence();
		assert.strictEqual(state.checkpoints.length, 2); // Initial + new checkpoint
		assert.strictEqual(state.checkpoints[1].requestId, 'req1');
		assert.strictEqual(state.checkpoints[1].undoStopId, 'stop1');
		assert.strictEqual(state.checkpoints[1].label, 'Checkpoint 1');
		assert.strictEqual(state.epochCounter, initialEpoch + 1);
	});

	test('createCheckpoint does not create duplicate checkpoints', function () {
		timeline.createCheckpoint('req1', 'stop1', 'Checkpoint 1');
		timeline.createCheckpoint('req1', 'stop1', 'Checkpoint 1 Duplicate');

		const checkpoints = timeline.getStateForPersistence().checkpoints;
		assert.strictEqual(checkpoints.length, 2); // Only initial + first checkpoint
		assert.strictEqual(checkpoints[1].label, 'Checkpoint 1'); // Original label preserved
	});

	test('incrementEpoch increases epoch counter', function () {
		const initialEpoch = timeline.getStateForPersistence().epochCounter;

		const epoch1 = timeline.incrementEpoch();
		const epoch2 = timeline.incrementEpoch();

		assert.strictEqual(epoch1, initialEpoch);
		assert.strictEqual(epoch2, initialEpoch + 1);
		assert.strictEqual(timeline.getStateForPersistence().epochCounter, initialEpoch + 2);
	});

	test('recordFileBaseline stores baseline', function () {
		const uri = URI.parse('file:///test.txt');
		const baseline = upcastPartial({
			uri,
			requestId: 'req1',
			content: 'initial content',
			epoch: 1,
			telemetryInfo: DEFAULT_TELEMETRY_INFO
		});

		timeline.recordFileBaseline(baseline);

		assert.strictEqual(timeline.hasFileBaseline(uri, 'req1'), true);
		assert.strictEqual(timeline.hasFileBaseline(uri, 'req2'), false);
	});

	test('recordFileOperation stores operation', function () {
		const uri = URI.parse('file:///test.txt');
		const operation = createTextEditOperation(
			uri,
			'req1',
			timeline.incrementEpoch(),
			[{ range: new Range(1, 1, 1, 1), text: 'hello' }]
		);

		timeline.recordFileOperation(operation);

		const state = timeline.getStateForPersistence();
		assert.strictEqual(state.operations.length, 1);
		assert.strictEqual(state.operations[0].type, FileOperationType.TextEdit);
		assert.strictEqual(state.operations[0].requestId, 'req1');
	});

	test('basic undo/redo with text edits', async function () {
		const uri = URI.parse('file:///test.txt');

		// Record baseline
		timeline.recordFileBaseline(upcastPartial({
			uri,
			requestId: 'req1',
			content: 'hello',
			epoch: timeline.incrementEpoch(),
			telemetryInfo: DEFAULT_TELEMETRY_INFO
		}));

		// Create checkpoint before edit - marks state with baseline
		timeline.createCheckpoint('req1', undefined, 'Start of Request');

		// Record edit at a new epoch
		const editEpoch = timeline.incrementEpoch();
		timeline.recordFileOperation(createTextEditOperation(
			uri,
			'req1',
			editEpoch,
			[{ range: new Range(1, 1, 1, 6), text: 'goodbye' }]
		));

		// Create checkpoint after edit - marks state with edit applied
		timeline.createCheckpoint('req1', 'stop1', 'After Edit');

		// canUndo and canRedo are based on checkpoint positions, not delegate state
		// We have: Initial, Start of Request, After Edit
		// Current epoch is after 'After Edit', so we can undo but not redo
		assert.strictEqual(timeline.canUndo.get(), true);
		assert.strictEqual(timeline.canRedo.get(), false);

		// Undo (goes to start of request)
		await timeline.undoToLastCheckpoint();

		// After undoing to start of request, we can't undo within this request anymore
		// but we can redo to the 'stop1' checkpoint
		assert.strictEqual(timeline.canUndo.get(), false); // No more undo stops in req1 before this
		assert.strictEqual(timeline.canRedo.get(), true); // Can redo to 'stop1'

		// Redo
		await timeline.redoToNextCheckpoint();

		// After redo to 'stop1', we can undo again
		assert.strictEqual(timeline.canUndo.get(), true);
		// canRedo might still be true if currentEpoch is less than the max epoch
		// This is because checkpoints are created with incrementEpoch, so there are epochs after them
	});

	test('file creation and deletion operations', async function () {
		const uri = URI.parse('file:///new.txt');

		// Create file
		const createEpoch = timeline.incrementEpoch();

		// Record baseline for the created file
		timeline.recordFileBaseline(upcastPartial({
			uri,
			requestId: 'req1',
			content: 'new file content',
			epoch: createEpoch,
			telemetryInfo: DEFAULT_TELEMETRY_INFO
		}));

		timeline.recordFileOperation(createFileCreateOperation(
			uri,
			'req1',
			createEpoch,
			'new file content'
		));

		// Checkpoint marks state after file creation
		timeline.createCheckpoint('req1', 'created', 'File Created');

		// Navigate to initial to sync delegate, then to created
		await timeline.navigateToCheckpoint(timeline.getStateForPersistence().checkpoints[0].checkpointId);
		assert.strictEqual(fileContents.has(uri), false);

		// Navigate to created checkpoint
		await timeline.navigateToCheckpoint(timeline.getCheckpointIdForRequest('req1', 'created')!);
		assert.strictEqual(fileContents.get(uri), 'new file content');

		// Delete file
		const deleteEpoch = timeline.incrementEpoch();
		timeline.recordFileOperation(createFileDeleteOperation(
			uri,
			'req1',
			deleteEpoch,
			'new file content'
		));

		timeline.createCheckpoint('req1', 'deleted', 'File Deleted');

		// Navigate back to initial, then to deleted to properly apply operations
		await timeline.navigateToCheckpoint(timeline.getStateForPersistence().checkpoints[0].checkpointId);
		await timeline.navigateToCheckpoint(timeline.getCheckpointIdForRequest('req1', 'deleted')!);
		assert.strictEqual(fileContents.has(uri), false);

		// Undo deletion - goes back to 'created' checkpoint
		await timeline.undoToLastCheckpoint();
		assert.strictEqual(fileContents.get(uri), 'new file content');

		// Undo creation - goes back to initial state
		await timeline.undoToLastCheckpoint();
		assert.strictEqual(fileContents.has(uri), false);
	});

	test('file rename operations', async function () {
		const oldUri = URI.parse('file:///old.txt');
		const newUri = URI.parse('file:///new.txt');

		// Create initial file
		const createEpoch = timeline.incrementEpoch();

		// Record baseline for the created file
		timeline.recordFileBaseline(upcastPartial({
			uri: oldUri,
			requestId: 'req1',
			content: 'content',
			epoch: createEpoch,
			telemetryInfo: DEFAULT_TELEMETRY_INFO
		}));

		timeline.recordFileOperation(createFileCreateOperation(
			oldUri,
			'req1',
			createEpoch,
			'content'
		));

		timeline.createCheckpoint('req1', 'created', 'File Created');

		// Navigate to initial, then to created to apply create operation
		await timeline.navigateToCheckpoint(timeline.getStateForPersistence().checkpoints[0].checkpointId);
		await timeline.navigateToCheckpoint(timeline.getCheckpointIdForRequest('req1', 'created')!);
		assert.strictEqual(fileContents.get(oldUri), 'content');

		// Rename file
		const renameEpoch = timeline.incrementEpoch();
		timeline.recordFileOperation(createFileRenameOperation(
			oldUri,
			newUri,
			'req1',
			renameEpoch
		));

		timeline.createCheckpoint('req1', 'renamed', 'File Renamed');

		// Navigate back to initial, then to renamed to properly apply operations
		await timeline.navigateToCheckpoint(timeline.getStateForPersistence().checkpoints[0].checkpointId);
		await timeline.navigateToCheckpoint(timeline.getCheckpointIdForRequest('req1', 'renamed')!);
		assert.strictEqual(fileContents.has(oldUri), false);
		assert.strictEqual(fileContents.get(newUri), 'content');

		// Undo rename - goes back to 'created' checkpoint
		await timeline.undoToLastCheckpoint();
		assert.strictEqual(fileContents.get(oldUri), 'content');
		assert.strictEqual(fileContents.has(newUri), false);
	});

	test('multiple sequential edits to same file', async function () {
		const uri = URI.parse('file:///test.txt');

		// Record baseline
		timeline.recordFileBaseline(upcastPartial({
			uri,
			requestId: 'req1',
			content: 'line1\nline2\nline3',
			epoch: timeline.incrementEpoch(),
			telemetryInfo: DEFAULT_TELEMETRY_INFO
		}));

		timeline.createCheckpoint('req1', undefined, 'Start');

		// First edit
		timeline.recordFileOperation(createTextEditOperation(
			uri,
			'req1',
			timeline.incrementEpoch(),
			[{ range: new Range(1, 1, 1, 6), text: 'LINE1' }]
		));

		timeline.createCheckpoint('req1', 'edit1', 'Edit 1');

		// Second edit
		timeline.recordFileOperation(createTextEditOperation(
			uri,
			'req1',
			timeline.incrementEpoch(),
			[{ range: new Range(2, 1, 2, 6), text: 'LINE2' }]
		));

		timeline.createCheckpoint('req1', 'edit2', 'Edit 2');

		// Navigate to first edit
		await timeline.navigateToCheckpoint(timeline.getCheckpointIdForRequest('req1', 'edit1')!);
		assert.strictEqual(fileContents.get(uri), 'LINE1\nline2\nline3');

		// Navigate to second edit
		await timeline.navigateToCheckpoint(timeline.getCheckpointIdForRequest('req1', 'edit2')!);
		assert.strictEqual(fileContents.get(uri), 'LINE1\nLINE2\nline3');

		// Navigate back to start
		await timeline.navigateToCheckpoint(timeline.getCheckpointIdForRequest('req1', undefined)!);
		assert.strictEqual(fileContents.get(uri), 'line1\nline2\nline3');
	});

	test('getCheckpointIdForRequest returns correct checkpoint', function () {
		timeline.createCheckpoint('req1', undefined, 'Start of req1');
		timeline.createCheckpoint('req1', 'stop1', 'Stop 1');
		timeline.createCheckpoint('req2', undefined, 'Start of req2');

		const req1Start = timeline.getCheckpointIdForRequest('req1', undefined);
		const req1Stop = timeline.getCheckpointIdForRequest('req1', 'stop1');
		const req2Start = timeline.getCheckpointIdForRequest('req2', undefined);

		assert.ok(req1Start);
		assert.ok(req1Stop);
		assert.ok(req2Start);
		assert.notStrictEqual(req1Start, req1Stop);
		assert.notStrictEqual(req1Start, req2Start);
	});

	test('getCheckpointIdForRequest returns undefined for non-existent checkpoint', function () {
		const checkpoint = timeline.getCheckpointIdForRequest('nonexistent', 'stop1');
		assert.strictEqual(checkpoint, undefined);
	});

	test('requestDisablement tracks disabled requests', async function () {
		const uri = URI.parse('file:///test.txt');

		timeline.createCheckpoint('req1', undefined, 'Start req1');
		timeline.recordFileOperation(createFileCreateOperation(uri, 'req1', timeline.incrementEpoch(), 'a'));

		timeline.createCheckpoint('req1', 'stop1', 'Stop req1');
		timeline.recordFileOperation(createTextEditOperation(uri, 'req1', timeline.incrementEpoch(), [{ range: new Range(1, 1, 1, 2), text: 'b' }]));

		timeline.createCheckpoint('req2', undefined, 'Start req2');
		timeline.recordFileOperation(createTextEditOperation(uri, 'req2', timeline.incrementEpoch(), [{ range: new Range(1, 1, 1, 2), text: 'c' }]));

		// Undo sequence:
		assert.deepStrictEqual(timeline.requestDisablement.get(), []);

		await timeline.undoToLastCheckpoint();
		assert.strictEqual(fileContents.get(uri), 'b');
		assert.deepStrictEqual(timeline.requestDisablement.get(), [
			{ requestId: 'req2', afterUndoStop: undefined },
		]);

		await timeline.undoToLastCheckpoint();
		assert.strictEqual(fileContents.get(uri), 'a');
		assert.deepStrictEqual(timeline.requestDisablement.get(), [
			{ requestId: 'req2', afterUndoStop: undefined },
			{ requestId: 'req1', afterUndoStop: 'stop1' },
		]);

		await timeline.undoToLastCheckpoint();
		assert.strictEqual(fileContents.get(uri), undefined);
		assert.deepStrictEqual(timeline.requestDisablement.get(), [
			{ requestId: 'req2', afterUndoStop: undefined },
			{ requestId: 'req1', afterUndoStop: undefined },
		]);

		// Redo sequence:
		await timeline.redoToNextCheckpoint();
		assert.strictEqual(fileContents.get(uri), 'a');
		assert.deepStrictEqual(timeline.requestDisablement.get(), [
			{ requestId: 'req2', afterUndoStop: undefined },
			{ requestId: 'req1', afterUndoStop: 'stop1' },
		]);

		await timeline.redoToNextCheckpoint();
		assert.strictEqual(fileContents.get(uri), 'b');
		assert.deepStrictEqual(timeline.requestDisablement.get(), [
			{ requestId: 'req2', afterUndoStop: undefined },
		]);

		await timeline.redoToNextCheckpoint();
		assert.strictEqual(fileContents.get(uri), 'c');
	});

	test('persistence - save and restore state', function () {
		const uri = URI.parse('file:///test.txt');

		// Setup some state
		timeline.recordFileBaseline(upcastPartial({
			uri,
			requestId: 'req1',
			content: 'initial',
			epoch: timeline.incrementEpoch(),
			telemetryInfo: DEFAULT_TELEMETRY_INFO
		}));

		timeline.createCheckpoint('req1', undefined, 'Start');

		timeline.recordFileOperation(createTextEditOperation(
			uri,
			'req1',
			timeline.incrementEpoch(),
			[{ range: new Range(1, 1, 1, 8), text: 'modified' }]
		));

		timeline.createCheckpoint('req1', 'stop1', 'Edit Complete');

		// Save state
		const savedState = timeline.getStateForPersistence();

		// Create new timeline and restore
		const collection = new ServiceCollection();
		collection.set(INotebookService, new SyncDescriptor(TestNotebookService));
		const insta = store.add(workbenchInstantiationService(undefined, store).createChild(collection));

		const newTimeline = insta.createInstance(
			ChatEditingCheckpointTimelineImpl,
			URI.parse('chat://test-session-2'),
			fileDelegate
		);

		transaction(tx => {
			newTimeline.restoreFromState(savedState, tx);
		});

		// Verify state was restored
		const restoredState = newTimeline.getStateForPersistence();
		assert.strictEqual(restoredState.checkpoints.length, savedState.checkpoints.length);
		assert.strictEqual(restoredState.operations.length, savedState.operations.length);
		assert.strictEqual(restoredState.currentEpoch, savedState.currentEpoch);
		assert.strictEqual(restoredState.epochCounter, savedState.epochCounter);
	});

	test('navigating between multiple requests', async function () {
		const uri1 = URI.parse('file:///file1.txt');
		const uri2 = URI.parse('file:///file2.txt');

		// Request 1 - create file
		timeline.createCheckpoint('req1', undefined, 'Start req1');

		const create1Epoch = timeline.incrementEpoch();
		timeline.recordFileBaseline(upcastPartial({
			uri: uri1,
			requestId: 'req1',
			content: 'file1 modified',
			epoch: create1Epoch,
			telemetryInfo: DEFAULT_TELEMETRY_INFO
		}));

		timeline.recordFileOperation(createFileCreateOperation(
			uri1,
			'req1',
			create1Epoch,
			'file1 modified'
		));

		timeline.createCheckpoint('req1', 'stop1', 'Req1 complete');

		// Request 2 - create another file
		timeline.createCheckpoint('req2', undefined, 'Start req2');

		const create2Epoch = timeline.incrementEpoch();
		timeline.recordFileBaseline(upcastPartial({
			uri: uri2,
			requestId: 'req2',
			content: 'file2 modified',
			epoch: create2Epoch,
			telemetryInfo: DEFAULT_TELEMETRY_INFO
		}));

		timeline.recordFileOperation(createFileCreateOperation(
			uri2,
			'req2',
			create2Epoch,
			'file2 modified'
		));

		timeline.createCheckpoint('req2', 'stop1', 'Req2 complete');

		// Navigate to initial, then to req1 completion to apply its operations
		await timeline.navigateToCheckpoint(timeline.getStateForPersistence().checkpoints[0].checkpointId);
		await timeline.navigateToCheckpoint(timeline.getCheckpointIdForRequest('req1', 'stop1')!);
		assert.strictEqual(fileContents.get(uri1), 'file1 modified');
		assert.strictEqual(fileContents.has(uri2), false); // req2 hasn't happened yet

		// Navigate to req2 completion
		await timeline.navigateToCheckpoint(timeline.getCheckpointIdForRequest('req2', 'stop1')!);
		assert.strictEqual(fileContents.get(uri1), 'file1 modified');
		assert.strictEqual(fileContents.get(uri2), 'file2 modified');

		// Navigate back to initial state by getting the first checkpoint
		const initialCheckpoint = timeline.getStateForPersistence().checkpoints[0];
		await timeline.navigateToCheckpoint(initialCheckpoint.checkpointId);
		assert.strictEqual(fileContents.has(uri1), false);
		assert.strictEqual(fileContents.has(uri2), false);
	});

	test('getContentURIAtStop returns snapshot URI', function () {
		const fileUri = URI.parse('file:///test.txt');
		const snapshotUri = timeline.getContentURIAtStop('req1', fileUri, 'stop1');

		assert.ok(snapshotUri);
		assert.notStrictEqual(snapshotUri.toString(), fileUri.toString());
		assert.ok(snapshotUri.toString().includes('req1'));
	});

	test('undoing entire request when appropriate', async function () {
		const uri = URI.parse('file:///test.txt');

		// Create initial baseline and checkpoint
		timeline.recordFileBaseline(upcastPartial({
			uri,
			requestId: 'req1',
			content: 'initial',
			epoch: timeline.incrementEpoch(),
			telemetryInfo: DEFAULT_TELEMETRY_INFO
		}));

		timeline.createCheckpoint('req1', undefined, 'Start req1');

		// Single edit with checkpoint
		timeline.recordFileOperation(createTextEditOperation(
			uri,
			'req1',
			timeline.incrementEpoch(),
			[{ range: new Range(1, 1, 1, 8), text: 'modified' }]
		));

		timeline.createCheckpoint('req1', 'stop1', 'Edit complete');

		// Should be able to undo
		assert.strictEqual(timeline.canUndo.get(), true);

		// Undo should go back to start of request, not just previous checkpoint
		await timeline.undoToLastCheckpoint();

		// Verify we're at the start of req1, which has epoch 2 (0 = initial, 1 = baseline, 2 = start checkpoint)
		const state = timeline.getStateForPersistence();
		assert.strictEqual(state.currentEpoch, 2); // Should be at the "Start req1" checkpoint epoch
	});

	test('operations use incrementing epochs', function () {
		const uri = URI.parse('file:///test.txt');

		const epoch1 = timeline.incrementEpoch();
		timeline.recordFileOperation(createTextEditOperation(
			uri,
			'req1',
			epoch1,
			[{ range: new Range(1, 1, 1, 1), text: 'edit1' }]
		));

		const epoch2 = timeline.incrementEpoch();
		timeline.recordFileOperation(createTextEditOperation(
			uri,
			'req1',
			epoch2,
			[{ range: new Range(2, 1, 2, 1), text: 'edit2' }]
		));

		// Both operations should be recorded
		const operations = timeline.getStateForPersistence().operations;
		assert.strictEqual(operations.length, 2);
		assert.strictEqual(operations[0].epoch, epoch1);
		assert.strictEqual(operations[1].epoch, epoch2);
	});

	test('navigateToCheckpoint throws error for invalid checkpoint ID', async function () {
		let errorThrown = false;
		try {
			await timeline.navigateToCheckpoint('invalid-checkpoint-id');
		} catch (error) {
			errorThrown = true;
			assert.ok(error instanceof Error);
			assert.ok((error as Error).message.includes('not found'));
		}
		assert.ok(errorThrown, 'Expected error to be thrown');
	});

	test('navigateToCheckpoint does nothing when already at target epoch', async function () {
		const uri = URI.parse('file:///test.txt');

		// Record baseline and operation
		timeline.recordFileBaseline(upcastPartial({
			uri,
			requestId: 'req1',
			content: 'initial',
			epoch: timeline.incrementEpoch(),
			telemetryInfo: DEFAULT_TELEMETRY_INFO
		}));

		const createEpoch = timeline.incrementEpoch();
		timeline.recordFileOperation(createTextEditOperation(
			uri,
			'req1',
			createEpoch,
			[{ range: new Range(1, 1, 1, 8), text: 'modified' }]
		));

		timeline.createCheckpoint('req1', 'stop1', 'Checkpoint');

		// Navigate to checkpoint
		const checkpointId = timeline.getCheckpointIdForRequest('req1', 'stop1')!;
		await timeline.navigateToCheckpoint(checkpointId);

		// Navigate again to same checkpoint - should be a no-op
		const stateBefore = timeline.getStateForPersistence();
		await timeline.navigateToCheckpoint(checkpointId);
		const stateAfter = timeline.getStateForPersistence();

		assert.strictEqual(stateBefore.currentEpoch, stateAfter.currentEpoch);
	});

	test('recording operation after undo truncates future history', async function () {
		const uri = URI.parse('file:///test.txt');

		// Setup initial operations
		timeline.recordFileBaseline(upcastPartial({
			uri,
			requestId: 'req1',
			content: 'initial',
			epoch: timeline.incrementEpoch(),
			telemetryInfo: DEFAULT_TELEMETRY_INFO
		}));

		timeline.createCheckpoint('req1', undefined, 'Start');

		timeline.recordFileOperation(createTextEditOperation(
			uri,
			'req1',
			timeline.incrementEpoch(),
			[{ range: new Range(1, 1, 1, 8), text: 'edit1' }]
		));

		timeline.createCheckpoint('req1', 'stop1', 'Edit 1');

		timeline.recordFileOperation(createTextEditOperation(
			uri,
			'req1',
			timeline.incrementEpoch(),
			[{ range: new Range(1, 1, 1, 6), text: 'edit2' }]
		));

		timeline.createCheckpoint('req1', 'stop2', 'Edit 2');

		const stateWithTwoEdits = timeline.getStateForPersistence();
		assert.strictEqual(stateWithTwoEdits.operations.length, 2);

		// Undo to stop1
		await timeline.navigateToCheckpoint(timeline.getCheckpointIdForRequest('req1', 'stop1')!);

		// Record new operation - this should truncate the second edit
		timeline.recordFileOperation(createTextEditOperation(
			uri,
			'req1',
			timeline.incrementEpoch(),
			[{ range: new Range(1, 1, 1, 6), text: 'edit3' }]
		));

		const stateAfterNewEdit = timeline.getStateForPersistence();
		assert.strictEqual(stateAfterNewEdit.operations.length, 2);
		assert.strictEqual(stateAfterNewEdit.operations[1].type, FileOperationType.TextEdit);
		// The second operation should be the new edit3, not edit2
	});

	test('redo after recording new operation should work', async function () {
		const uri = URI.parse('file:///test.txt');

		timeline.recordFileBaseline(upcastPartial({
			uri,
			requestId: 'req1',
			content: 'initial',
			epoch: timeline.incrementEpoch(),
			telemetryInfo: DEFAULT_TELEMETRY_INFO
		}));

		timeline.createCheckpoint('req1', undefined, 'Start');

		timeline.recordFileOperation(createTextEditOperation(
			uri,
			'req1',
			timeline.incrementEpoch(),
			[{ range: new Range(1, 1, 1, 8), text: 'edit1' }]
		));

		timeline.createCheckpoint('req1', 'stop1', 'Edit 1');

		// Undo
		await timeline.undoToLastCheckpoint();
		assert.strictEqual(timeline.canRedo.get(), true);

		// Redo
		await timeline.redoToNextCheckpoint();

		// After redo, canRedo depends on whether we're at the latest epoch
		// Since we created a checkpoint after the operation, currentEpoch is ahead
		// of the checkpoint epoch, so canRedo may still be true
		assert.strictEqual(timeline.canUndo.get(), true);
	});

	test('redo when there is no checkpoint after operation', async function () {
		const uri = URI.parse('file:///test.txt');

		timeline.recordFileBaseline(upcastPartial({
			uri,
			requestId: 'req1',
			content: 'initial',
			epoch: timeline.incrementEpoch(),
			telemetryInfo: DEFAULT_TELEMETRY_INFO
		}));

		timeline.createCheckpoint('req1', undefined, 'Start');

		// Record operation but don't create checkpoint after it
		timeline.recordFileOperation(createTextEditOperation(
			uri,
			'req1',
			timeline.incrementEpoch(),
			[{ range: new Range(1, 1, 1, 8), text: 'edit1' }]
		));

		// Undo to start
		const startCheckpoint = timeline.getCheckpointIdForRequest('req1', undefined)!;
		await timeline.navigateToCheckpoint(startCheckpoint);

		// Should be able to redo even without a checkpoint after the operation
		assert.strictEqual(timeline.canRedo.get(), true);

		await timeline.redoToNextCheckpoint();
		// After redo, we should be at the operation's epoch + 1
		const state = timeline.getStateForPersistence();
		assert.ok(state.currentEpoch > 1);
	});

	test('getContentAtStop returns empty for non-existent file', async function () {
		const uri = URI.parse('file:///nonexistent.txt');
		const content = await timeline.getContentAtStop('req1', uri, 'stop1');

		assert.strictEqual(content, '');
	});

	test('getContentAtStop with epoch-based stopId', async function () {
		const uri = URI.parse('file:///test.txt');

		timeline.recordFileBaseline(upcastPartial({
			uri,
			requestId: 'req1',
			content: 'initial',
			epoch: timeline.incrementEpoch(),
			telemetryInfo: DEFAULT_TELEMETRY_INFO
		}));

		const editEpoch = timeline.incrementEpoch();
		timeline.recordFileOperation(createTextEditOperation(
			uri,
			'req1',
			editEpoch,
			[{ range: new Range(1, 1, 1, 8), text: 'modified' }]
		));

		// Use epoch-based stop ID
		const content = await timeline.getContentAtStop('req1', uri, `__epoch_${editEpoch + 1}`);

		assert.ok(content);
		assert.strictEqual(content, 'modified');
	});

	test('hasFileBaseline correctly reports baseline existence', function () {
		const uri = URI.parse('file:///test.txt');

		assert.strictEqual(timeline.hasFileBaseline(uri, 'req1'), false);

		timeline.recordFileBaseline(upcastPartial({
			uri,
			requestId: 'req1',
			content: 'initial',
			epoch: timeline.incrementEpoch(),
			telemetryInfo: DEFAULT_TELEMETRY_INFO
		}));

		assert.strictEqual(timeline.hasFileBaseline(uri, 'req1'), true);
		assert.strictEqual(timeline.hasFileBaseline(uri, 'req2'), false);
	});

	test('hasFileBaseline returns true for files with create operations', function () {
		const uri = URI.parse('file:///created.txt');

		// Initially, no baseline
		assert.strictEqual(timeline.hasFileBaseline(uri, 'req1'), false);

		// Record a create operation without recording an explicit baseline
		timeline.recordFileOperation(createFileCreateOperation(
			uri,
			'req1',
			timeline.incrementEpoch(),
			'created content'
		));

		// hasFileBaseline should now return true because of the create operation
		assert.strictEqual(timeline.hasFileBaseline(uri, 'req1'), true);
		assert.strictEqual(timeline.hasFileBaseline(uri, 'req2'), false);
	});

	test('hasFileBaseline distinguishes between different request IDs for create operations', function () {
		const uri = URI.parse('file:///created.txt');

		// Record a create operation for req1
		timeline.recordFileOperation(createFileCreateOperation(
			uri,
			'req1',
			timeline.incrementEpoch(),
			'content from req1'
		));

		// hasFileBaseline should only return true for req1
		assert.strictEqual(timeline.hasFileBaseline(uri, 'req1'), true);
		assert.strictEqual(timeline.hasFileBaseline(uri, 'req2'), false);
		assert.strictEqual(timeline.hasFileBaseline(uri, 'req3'), false);
	});

	test('hasFileBaseline returns true when both baseline and create operation exist', function () {
		const uri = URI.parse('file:///test.txt');

		// Record both a baseline and a create operation
		timeline.recordFileBaseline(upcastPartial({
			uri,
			requestId: 'req1',
			content: 'baseline content',
			epoch: timeline.incrementEpoch(),
			telemetryInfo: DEFAULT_TELEMETRY_INFO
		}));

		timeline.recordFileOperation(createFileCreateOperation(
			uri,
			'req1',
			timeline.incrementEpoch(),
			'created content'
		));

		// Should return true (checking either source)
		assert.strictEqual(timeline.hasFileBaseline(uri, 'req1'), true);
	});

	test('hasFileBaseline with create operation followed by edit', function () {
		const uri = URI.parse('file:///created-and-edited.txt');

		// Record a create operation
		timeline.recordFileOperation(createFileCreateOperation(
			uri,
			'req1',
			timeline.incrementEpoch(),
			'initial content'
		));

		// hasFileBaseline should return true
		assert.strictEqual(timeline.hasFileBaseline(uri, 'req1'), true);

		// Record an edit operation on the created file
		timeline.recordFileOperation(createTextEditOperation(
			uri,
			'req1',
			timeline.incrementEpoch(),
			[{ range: new Range(1, 1, 1, 16), text: 'edited content' }]
		));

		// hasFileBaseline should still return true
		assert.strictEqual(timeline.hasFileBaseline(uri, 'req1'), true);
	});

	test('multiple text edits to same file are properly replayed', async function () {
		const uri = URI.parse('file:///test.txt');

		timeline.recordFileBaseline(upcastPartial({
			uri,
			requestId: 'req1',
			content: 'line1\nline2\nline3',
			epoch: timeline.incrementEpoch(),
			telemetryInfo: DEFAULT_TELEMETRY_INFO
		}));

		timeline.createCheckpoint('req1', undefined, 'Start');

		// First edit - uppercase line 1
		timeline.recordFileOperation(createTextEditOperation(
			uri,
			'req1',
			timeline.incrementEpoch(),
			[{ range: new Range(1, 1, 1, 6), text: 'LINE1' }]
		));

		// Second edit - uppercase line 2
		timeline.recordFileOperation(createTextEditOperation(
			uri,
			'req1',
			timeline.incrementEpoch(),
			[{ range: new Range(2, 1, 2, 6), text: 'LINE2' }]
		));

		// Third edit - uppercase line 3
		timeline.recordFileOperation(createTextEditOperation(
			uri,
			'req1',
			timeline.incrementEpoch(),
			[{ range: new Range(3, 1, 3, 6), text: 'LINE3' }]
		));

		timeline.createCheckpoint('req1', 'all-edits', 'All edits');

		// Navigate to see all edits applied
		const initialCheckpoint = timeline.getStateForPersistence().checkpoints[0];
		await timeline.navigateToCheckpoint(initialCheckpoint.checkpointId);
		await timeline.navigateToCheckpoint(timeline.getCheckpointIdForRequest('req1', 'all-edits')!);

		assert.strictEqual(fileContents.get(uri), 'LINE1\nLINE2\nLINE3');
	});

	test('checkpoint with same requestId and undoStopId is not duplicated', function () {
		timeline.createCheckpoint('req1', 'stop1', 'First');
		timeline.createCheckpoint('req1', 'stop1', 'Second'); // Should be ignored

		const checkpoints = timeline.getStateForPersistence().checkpoints;
		const req1Stop1Checkpoints = checkpoints.filter(c => c.requestId === 'req1' && c.undoStopId === 'stop1');

		assert.strictEqual(req1Stop1Checkpoints.length, 1);
		assert.strictEqual(req1Stop1Checkpoints[0].label, 'First');
	});

	test('finding baseline after file rename operation', async function () {
		const oldUri = URI.parse('file:///old.txt');
		const newUri = URI.parse('file:///new.txt');

		// Create baseline for old URI
		timeline.recordFileBaseline(upcastPartial({
			uri: oldUri,
			requestId: 'req1',
			content: 'initial content',
			epoch: timeline.incrementEpoch(),
			telemetryInfo: DEFAULT_TELEMETRY_INFO
		}));

		// Edit the file before rename (replace entire content)
		timeline.recordFileOperation(createTextEditOperation(
			oldUri,
			'req1',
			timeline.incrementEpoch(),
			[{ range: new Range(1, 1, 1, 16), text: 'modified content' }]
		));

		// Rename operation
		timeline.recordFileOperation(createFileRenameOperation(
			oldUri,
			newUri,
			'req1',
			timeline.incrementEpoch()
		));

		timeline.createCheckpoint('req1', 'renamed', 'After rename');

		// Get content at the renamed URI - should find the baseline through rename chain
		const content = await timeline.getContentAtStop('req1', newUri, 'renamed');
		assert.strictEqual(content, 'modified content');
	});

	test('baseline lookup across different request IDs', async function () {
		const uri = URI.parse('file:///test.txt');

		// First request baseline
		timeline.recordFileBaseline(upcastPartial({
			uri,
			requestId: 'req1',
			content: 'req1 content',
			epoch: timeline.incrementEpoch(),
			telemetryInfo: DEFAULT_TELEMETRY_INFO
		}));

		timeline.recordFileOperation(createTextEditOperation(
			uri,
			'req1',
			timeline.incrementEpoch(),
			[{ range: new Range(1, 1, 1, 13), text: 'req1 modified' }]
		));

		// Second request baseline
		timeline.recordFileBaseline(upcastPartial({
			uri,
			requestId: 'req2',
			content: 'req2 content',
			epoch: timeline.incrementEpoch(),
			telemetryInfo: DEFAULT_TELEMETRY_INFO
		}));

		timeline.recordFileOperation(createTextEditOperation(
			uri,
			'req2',
			timeline.incrementEpoch(),
			[{ range: new Range(1, 1, 1, 13), text: 'req2 modified' }]
		));

		timeline.createCheckpoint('req2', 'stop1', 'Req2 checkpoint');

		// Getting content should use req2 baseline
		const content = await timeline.getContentAtStop('req2', uri, 'stop1');
		assert.strictEqual(content, 'req2 modified');
	});

	test('getContentAtStop with file that does not exist in operations', async function () {
		const uri = URI.parse('file:///test.txt');

		timeline.recordFileBaseline(upcastPartial({
			uri,
			requestId: 'req1',
			content: 'content',
			epoch: timeline.incrementEpoch(),
			telemetryInfo: DEFAULT_TELEMETRY_INFO
		}));

		timeline.createCheckpoint('req1', 'stop1', 'Checkpoint');

		// Try to get content for a different URI that doesn't have any operations
		const differentUri = URI.parse('file:///different.txt');
		const content = await timeline.getContentAtStop('req1', differentUri, 'stop1');

		assert.strictEqual(content, '');
	});

	test('undoToLastCheckpoint when canUndo is false does nothing', async function () {
		// At initial state, canUndo should be false
		assert.strictEqual(timeline.canUndo.get(), false);

		const stateBefore = timeline.getStateForPersistence();
		await timeline.undoToLastCheckpoint();
		const stateAfter = timeline.getStateForPersistence();

		// Should not have changed
		assert.strictEqual(stateBefore.currentEpoch, stateAfter.currentEpoch);
	});

	test('redoToNextCheckpoint when canRedo is false does nothing', async function () {
		// At initial state with no future operations, canRedo should be false
		assert.strictEqual(timeline.canRedo.get(), false);

		const stateBefore = timeline.getStateForPersistence();
		await timeline.redoToNextCheckpoint();
		const stateAfter = timeline.getStateForPersistence();

		// Should not have changed
		assert.strictEqual(stateBefore.currentEpoch, stateAfter.currentEpoch);
	});

	test('orphaned operations and checkpoints are removed after undo and new changes', async function () {
		const uri = URI.parse('file:///test.txt');

		// Create the file first
		const createEpoch = timeline.incrementEpoch();

		timeline.recordFileOperation(createFileCreateOperation(
			uri,
			'req1',
			createEpoch,
			'initial content'
		));

		timeline.createCheckpoint('req1', undefined, 'Start req1');

		// First set of changes
		timeline.recordFileOperation(createTextEditOperation(
			uri,
			'req1',
			timeline.incrementEpoch(),
			[{ range: new Range(1, 1, 1, 16), text: 'first edit' }]
		));

		timeline.createCheckpoint('req1', 'stop1', 'First Edit');

		timeline.recordFileOperation(createTextEditOperation(
			uri,
			'req1',
			timeline.incrementEpoch(),
			[{ range: new Range(1, 1, 1, 11), text: 'second edit' }]
		));

		timeline.createCheckpoint('req1', 'stop2', 'Second Edit');

		// Verify we have 3 operations (create + 2 edits) and 4 checkpoints (initial, start, stop1, stop2)
		let state = timeline.getStateForPersistence();
		assert.strictEqual(state.operations.length, 3);
		assert.strictEqual(state.checkpoints.length, 4);

		// Undo to stop1 (before second edit)
		await timeline.navigateToCheckpoint(timeline.getCheckpointIdForRequest('req1', 'stop1')!);

		// Record a new operation - this should truncate the "second edit" operation
		// and remove the stop2 checkpoint
		timeline.recordFileOperation(createTextEditOperation(
			uri,
			'req1',
			timeline.incrementEpoch(),
			[{ range: new Range(1, 1, 1, 11), text: 'replacement edit' }]
		));

		timeline.createCheckpoint('req1', 'stop2-new', 'Replacement Edit');

		// Verify the orphaned operation and checkpoint are gone
		state = timeline.getStateForPersistence();
		assert.strictEqual(state.operations.length, 3, 'Should still have 3 operations (create + first + replacement)');
		assert.strictEqual(state.checkpoints.length, 4, 'Should have 4 checkpoints (initial, start, stop1, stop2-new)');

		// Verify the third operation is the replacement, not the original second edit
		const thirdOp = state.operations[2];
		assert.strictEqual(thirdOp.type, FileOperationType.TextEdit);
		if (thirdOp.type === FileOperationType.TextEdit) {
			assert.strictEqual(thirdOp.edits[0].text, 'replacement edit');
		}

		// Verify the stop2-new checkpoint exists, not stop2
		const stop2NewCheckpoint = timeline.getCheckpointIdForRequest('req1', 'stop2-new');
		const stop2OldCheckpoint = timeline.getCheckpointIdForRequest('req1', 'stop2');
		assert.ok(stop2NewCheckpoint, 'New checkpoint should exist');
		assert.strictEqual(stop2OldCheckpoint, undefined, 'Old orphaned checkpoint should be removed');

		// Now navigate through the entire timeline to verify consistency
		const initialCheckpoint = state.checkpoints[0];
		const startCheckpoint = timeline.getCheckpointIdForRequest('req1', undefined)!;
		const stop1Checkpoint = timeline.getCheckpointIdForRequest('req1', 'stop1')!;
		const stop2NewCheckpointId = timeline.getCheckpointIdForRequest('req1', 'stop2-new')!;

		// Navigate to initial to clear everything
		await timeline.navigateToCheckpoint(initialCheckpoint.checkpointId);
		assert.strictEqual(fileContents.has(uri), false);

		// Navigate to start - file should be created
		await timeline.navigateToCheckpoint(startCheckpoint);
		assert.strictEqual(fileContents.get(uri), 'initial content');

		// Navigate to stop1 - first edit should be applied
		await timeline.navigateToCheckpoint(stop1Checkpoint);
		assert.strictEqual(fileContents.get(uri), 'first edit');

		// Navigate to stop2-new - replacement edit should be applied, NOT the orphaned "second edit"
		await timeline.navigateToCheckpoint(stop2NewCheckpointId);
		assert.strictEqual(fileContents.get(uri), 'replacement edit');

		// Navigate back to start
		await timeline.navigateToCheckpoint(startCheckpoint);
		assert.strictEqual(fileContents.get(uri), 'initial content');

		// Navigate forward through all checkpoints again to ensure redo works correctly
		await timeline.navigateToCheckpoint(stop1Checkpoint);
		assert.strictEqual(fileContents.get(uri), 'first edit');

		await timeline.navigateToCheckpoint(stop2NewCheckpointId);
		assert.strictEqual(fileContents.get(uri), 'replacement edit', 'Orphaned edit should never reappear');

		// Go back to initial and forward again to thoroughly test
		await timeline.navigateToCheckpoint(initialCheckpoint.checkpointId);
		await timeline.navigateToCheckpoint(stop2NewCheckpointId);
		assert.strictEqual(fileContents.get(uri), 'replacement edit', 'Content should still be correct after full timeline traversal');
	});
});

// Mock notebook service for tests that don't need notebook functionality
class TestNotebookService {
	getNotebookTextModel() { return undefined; }
	hasSupportedNotebooks() { return false; }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/chatEditingModifiedNotebookEntry.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/chatEditingModifiedNotebookEntry.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { adjustCellDiffAndOriginalModelBasedOnCellAddDelete, adjustCellDiffAndOriginalModelBasedOnCellMovements, adjustCellDiffForKeepingADeletedCell, adjustCellDiffForKeepingAnInsertedCell, adjustCellDiffForRevertingADeletedCell, adjustCellDiffForRevertingAnInsertedCell } from '../../browser/chatEditing/notebook/helpers.js';
import { ICellDiffInfo } from '../../browser/chatEditing/notebook/notebookCellChanges.js';
import { nullDocumentDiff } from '../../../../../editor/common/diff/documentDiffProvider.js';
import { ObservablePromise, observableValue } from '../../../../../base/common/observable.js';
import { CellEditType, CellKind, ICell, ICellEditOperation, NotebookCellsChangeType } from '../../../notebook/common/notebookCommon.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { URI } from '../../../../../base/common/uri.js';
import { hash } from '../../../../../base/common/hash.js';
import { generateUuid } from '../../../../../base/common/uuid.js';

suite('ChatEditingModifiedNotebookEntry', function () {
	suite('Keep Inserted Cell', function () {

		const keep = () => Promise.resolve(true);
		const undo = () => Promise.resolve(true);
		const diff = observableValue('cell1', nullDocumentDiff);
		const appliedEdits: ICellEditOperation[] = [];
		setup(() => {
			appliedEdits.length = 0;
		});
		ensureNoDisposablesAreLeakedInTestSuite();
		function createModifiedModel(id: string): ObservablePromise<ITextModel> {
			// eslint-disable-next-line local/code-no-any-casts
			return `Modified:${id}` as any;

		}
		function createOriginalModel(id: string): ObservablePromise<ITextModel> {
			// eslint-disable-next-line local/code-no-any-casts
			return `Original:${id}` as any;

		}
		function applyEdits(edits: ICellEditOperation[]): boolean {
			appliedEdits.push(...edits);
			return true;
		}

		function createModifiedCellDiffInfo(modifiedCellIndex: number, originalCellIndex: number): ICellDiffInfo {
			return {
				diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel(`InsertedOriginal:${originalCellIndex}`), originalCellIndex,
				modifiedCellIndex, modifiedModel: createModifiedModel(`InsertedModified:${modifiedCellIndex}`),
			};
		}
		test('Keep first inserted', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('New0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('0'),
				},
			];

			const result = adjustCellDiffForKeepingAnInsertedCell(0,
				// eslint-disable-next-line local/code-no-any-casts
				cellsDiffInfo, {} as any,
				applyEdits, createModifiedCellDiffInfo);

			assert.deepStrictEqual(appliedEdits, [
				{ editType: CellEditType.Replace, index: 0, cells: [{}], count: 0 },
			]);
			assert.deepStrictEqual(result, [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel(`InsertedOriginal:0`), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel(`InsertedModified:0`),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 1,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('0'),
				},
			]);
		});
		test('Keep first inserted with multiple cells', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('New0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('2'), originalCellIndex: 2,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('2'),
				},
			];

			const result = adjustCellDiffForKeepingAnInsertedCell(0,
				// eslint-disable-next-line local/code-no-any-casts
				cellsDiffInfo, {} as any,
				applyEdits, createModifiedCellDiffInfo);

			assert.deepStrictEqual(appliedEdits, [
				{ editType: CellEditType.Replace, index: 0, cells: [{}], count: 0 },
			]);
			assert.deepStrictEqual(result, [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('InsertedOriginal:0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('InsertedModified:0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 1,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('1'), originalCellIndex: 2,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('2'), originalCellIndex: 3,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('2'),
				},
			]);
		});
		test('Keep second inserted with multiple cells', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('New0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('2'), originalCellIndex: 2,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('2'),
				},
			];

			const result = adjustCellDiffForKeepingAnInsertedCell(2,
				// eslint-disable-next-line local/code-no-any-casts
				cellsDiffInfo, {} as any,
				applyEdits, createModifiedCellDiffInfo);

			assert.deepStrictEqual(appliedEdits, [
				{ editType: CellEditType.Replace, index: 2, cells: [{}], count: 0 },
			]);
			assert.deepStrictEqual(result, [
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('New0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('InsertedOriginal:2'), originalCellIndex: 2,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('InsertedModified:2'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('2'), originalCellIndex: 3,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('2'),
				},
			]);
		});
	});

	suite('Revert Inserted Cell', function () {

		const keep = () => Promise.resolve(true);
		const undo = () => Promise.resolve(true);
		const diff = observableValue('cell1', nullDocumentDiff);
		const appliedEdits: ICellEditOperation[] = [];
		setup(() => {
			appliedEdits.length = 0;
		});
		ensureNoDisposablesAreLeakedInTestSuite();
		function createModifiedModel(id: string): ObservablePromise<ITextModel> {
			// eslint-disable-next-line local/code-no-any-casts
			return `Modified:${id}` as any;

		}
		function createOriginalModel(id: string): ObservablePromise<ITextModel> {
			// eslint-disable-next-line local/code-no-any-casts
			return `Original:${id}` as any;

		}
		function applyEdits(edits: ICellEditOperation[]): boolean {
			appliedEdits.push(...edits);
			return true;
		}

		test('Delete first inserted', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('New0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('0'),
				},
			];

			const result = adjustCellDiffForRevertingAnInsertedCell(0,
				cellsDiffInfo,
				applyEdits);

			assert.deepStrictEqual(appliedEdits, [
				{ editType: CellEditType.Replace, index: 0, cells: [], count: 1 },
			]);
			assert.deepStrictEqual(result, [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
			]);
		});
		test('Delete first inserted with multiple cells', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('New0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('2'), originalCellIndex: 2,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('2'),
				},
			];

			const result = adjustCellDiffForRevertingAnInsertedCell(0,
				cellsDiffInfo,
				applyEdits);

			assert.deepStrictEqual(appliedEdits, [
				{ editType: CellEditType.Replace, index: 0, cells: [], count: 1 },
			]);
			assert.deepStrictEqual(result, [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('2'), originalCellIndex: 2,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('2'),
				},
			]);
		});
		test('Delete second inserted with multiple cells', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('New0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('2'), originalCellIndex: 2,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('2'),
				},
			];

			const result = adjustCellDiffForRevertingAnInsertedCell(2,
				cellsDiffInfo,
				applyEdits);

			assert.deepStrictEqual(appliedEdits, [
				{ editType: CellEditType.Replace, index: 2, cells: [], count: 1 },
			]);
			assert.deepStrictEqual(result, [
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('New0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('2'), originalCellIndex: 2,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('2'),
				},
			]);
		});
		test('Delete second inserted with multiple cells (subsequent inserts)', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('New0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('3'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('2'), originalCellIndex: 2,
					modifiedCellIndex: 4, modifiedModel: createModifiedModel('4'),
				},
			];

			const result = adjustCellDiffForRevertingAnInsertedCell(2,
				cellsDiffInfo,
				applyEdits);

			assert.deepStrictEqual(appliedEdits, [
				{ editType: CellEditType.Replace, index: 2, cells: [], count: 1 },
			]);
			assert.deepStrictEqual(result, [
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('New0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('3'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('2'), originalCellIndex: 2,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('4'),
				},
			]);
		});
	});

	suite('Keep Deleted Cell', function () {

		const keep = () => Promise.resolve(true);
		const undo = () => Promise.resolve(true);
		const diff = observableValue('cell1', nullDocumentDiff);
		const appliedEdits: ICellEditOperation[] = [];
		setup(() => {
			appliedEdits.length = 0;
		});
		ensureNoDisposablesAreLeakedInTestSuite();
		function createModifiedModel(id: string): ObservablePromise<ITextModel> {
			// eslint-disable-next-line local/code-no-any-casts
			return `Modified:${id}` as any;

		}
		function createOriginalModel(id: string): ObservablePromise<ITextModel> {
			// eslint-disable-next-line local/code-no-any-casts
			return `Original:${id}` as any;

		}
		function applyEdits(edits: ICellEditOperation[]): boolean {
			appliedEdits.push(...edits);
			return true;
		}

		test('Keep first deleted cell', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('New0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('2'), originalCellIndex: 2,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('0'),
				},
			];

			const result = adjustCellDiffForKeepingADeletedCell(0,
				cellsDiffInfo,
				applyEdits);

			assert.deepStrictEqual(appliedEdits, [
				{ editType: CellEditType.Replace, index: 0, cells: [], count: 1 },
			]);
			assert.deepStrictEqual(result, [
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('1'), originalCellIndex: 0,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('New0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('2'), originalCellIndex: 1,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('0'),
				},
			]);
		});
		test('Keep second deleted cell', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('New0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('2'), originalCellIndex: 2,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('0'),
				},
			];

			const result = adjustCellDiffForKeepingADeletedCell(1,
				cellsDiffInfo,
				applyEdits);

			assert.deepStrictEqual(appliedEdits, [
				{ editType: CellEditType.Replace, index: 1, cells: [], count: 1 },
			]);
			assert.deepStrictEqual(result, [
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('New0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('2'), originalCellIndex: 1,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('0'),
				},
			]);
		});

		test('Keep first deleted with multiple cells', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('New0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('2'), originalCellIndex: 2,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('2'),
				},
			];

			const result = adjustCellDiffForKeepingADeletedCell(1,
				cellsDiffInfo,
				applyEdits);

			assert.deepStrictEqual(appliedEdits, [
				{ editType: CellEditType.Replace, index: 1, cells: [], count: 1 },
			]);
			assert.deepStrictEqual(result, [
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('New0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('2'), originalCellIndex: 1,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('2'),
				},
			]);
		});
	});

	suite('Revert Deleted Cell', function () {

		const keep = () => Promise.resolve(true);
		const undo = () => Promise.resolve(true);
		const diff = observableValue('cell1', nullDocumentDiff);
		const appliedEdits: ICellEditOperation[] = [];
		setup(() => {
			appliedEdits.length = 0;
		});
		ensureNoDisposablesAreLeakedInTestSuite();
		function createModifiedModel(id: string): ObservablePromise<ITextModel> {
			// eslint-disable-next-line local/code-no-any-casts
			return `Modified:${id}` as any;

		}
		function createOriginalModel(id: string): ObservablePromise<ITextModel> {
			// eslint-disable-next-line local/code-no-any-casts
			return `Original:${id}` as any;

		}
		function applyEdits(edits: ICellEditOperation[]): boolean {
			appliedEdits.push(...edits);
			return true;
		}
		function createModifiedCellDiffInfo(modifiedCellIndex: number, originalCellIndex: number): ICellDiffInfo {
			return {
				diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel(`InsertedOriginal:${originalCellIndex}`), originalCellIndex,
				modifiedCellIndex, modifiedModel: createModifiedModel(`InsertedModified:${modifiedCellIndex}`),
			};
		}

		test('Revert first deleted cell', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('New0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('2'), originalCellIndex: 2,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('0'),
				},
			];

			const result = adjustCellDiffForRevertingADeletedCell(0,
				cellsDiffInfo,
				// eslint-disable-next-line local/code-no-any-casts
				{} as any,
				applyEdits,
				createModifiedCellDiffInfo);

			assert.deepStrictEqual(appliedEdits, [
				{ editType: CellEditType.Replace, index: 0, cells: [{}], count: 0 },
			]);
			assert.deepStrictEqual(result, [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('InsertedOriginal:0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('InsertedModified:0'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('New0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('2'), originalCellIndex: 2,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('0'),
				},
			]);
		});
		test('Revert second deleted cell', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('New0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('2'), originalCellIndex: 2,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('0'),
				},
			];

			const result = adjustCellDiffForRevertingADeletedCell(1,
				cellsDiffInfo,
				// eslint-disable-next-line local/code-no-any-casts
				{} as any,
				applyEdits,
				createModifiedCellDiffInfo);

			assert.deepStrictEqual(appliedEdits, [
				{ editType: CellEditType.Replace, index: 0, cells: [{}], count: 0 },
			]);
			assert.deepStrictEqual(result, [
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('InsertedOriginal:1'), originalCellIndex: 1,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('InsertedModified:0'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('New0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('2'), originalCellIndex: 2,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('0'),
				},
			]);
		});

		test('Revert first deleted with multiple cells', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('New0'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('New1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('2'), originalCellIndex: 2,
					modifiedCellIndex: 4, modifiedModel: createModifiedModel('2'),
				},
			];

			const result = adjustCellDiffForRevertingADeletedCell(1,
				cellsDiffInfo,
				// eslint-disable-next-line local/code-no-any-casts
				{} as any,
				applyEdits,
				createModifiedCellDiffInfo);

			assert.deepStrictEqual(appliedEdits, [
				{ editType: CellEditType.Replace, index: 3, cells: [{}], count: 0 },
			]);
			assert.deepStrictEqual(result, [
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('New0'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('New1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('InsertedOriginal:1'), originalCellIndex: 1,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('InsertedModified:3'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 4, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('2'), originalCellIndex: 2,
					modifiedCellIndex: 5, modifiedModel: createModifiedModel('2'),
				},
			]);
		});
	});

	suite('Cell Addition', function () {

		const keep = () => Promise.resolve(true);
		const undo = () => Promise.resolve(true);
		const diff = observableValue('cell1', nullDocumentDiff);
		const appliedEdits: ICellEditOperation[] = [];
		setup(() => {
			appliedEdits.length = 0;
		});
		ensureNoDisposablesAreLeakedInTestSuite();
		function createModifiedModel(id: string): ObservablePromise<ITextModel> {
			// eslint-disable-next-line local/code-no-any-casts
			return `Modified:${id}` as any;

		}
		function createOriginalModel(id: string): ObservablePromise<ITextModel> {
			// eslint-disable-next-line local/code-no-any-casts
			return `Original:${id}` as any;

		}
		function applyEdits(edits: ICellEditOperation[]): boolean {
			appliedEdits.push(...edits);
			return true;
		}

		function createICell(cellKind: CellKind, source: string): ICell {
			const handle = hash(generateUuid());
			// eslint-disable-next-line local/code-no-any-casts
			return {
				uri: URI.parse(`file:///path/${handle}`),
				handle,
				cellKind,
				language: cellKind === CellKind.Markup ? 'markdown' : 'python',
				outputs: [],
				metadata: {},
				getHashValue: () => {
					return hash(`${handle}=>${cellKind}=>${source}`);
				},
				getValue: () => {
					return source;
				},
				internalMetadata: {},
			} as any;
		}
		function createModifiedCellDiffInfo(modifiedCellIndex: number, originalCellIndex: number): ICellDiffInfo {
			return {
				diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel(`InsertedOriginal:${originalCellIndex}`), originalCellIndex,
				modifiedCellIndex, modifiedModel: createModifiedModel(`InsertedModified:${modifiedCellIndex}`),
			};
		}
		test('Insert a new cell into an unchanged notebook', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('1'),
				},
			];

			const cell = createICell(CellKind.Code, 'print("Hello World")');
			const result = adjustCellDiffAndOriginalModelBasedOnCellAddDelete([0, 0, [cell]],
				cellsDiffInfo, 3, 2, applyEdits, createModifiedCellDiffInfo);
			assert.deepStrictEqual(appliedEdits, [
				{
					editType: CellEditType.Replace,
					index: 0,
					cells: [{
						cellKind: CellKind.Code,
						language: 'python',
						outputs: [],
						mime: undefined,
						metadata: {},
						internalMetadata: {},
						source: cell.getValue(),
					}], count: 0
				}
			]);
			assert.deepStrictEqual(result, [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel(`InsertedOriginal:0`), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel(`InsertedModified:0`),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 1,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 2,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('1'),
				},
			]);
		});
		test('Insert a new cell into a notebook with 3 cells deleted', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('2'), originalCellIndex: 2,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('3'), originalCellIndex: 3,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('New1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('4'), originalCellIndex: 4,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('4'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('5'), originalCellIndex: 5,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('5'),
				},
				{
					diff, keep, undo, type: 'modified', originalModel: createOriginalModel('6'), originalCellIndex: 6,
					modifiedCellIndex: 4, modifiedModel: createModifiedModel('6'),
				},
			];
			const cell = createICell(CellKind.Code, 'print("Hello World")');
			const result = adjustCellDiffAndOriginalModelBasedOnCellAddDelete([2, 0, [cell]],
				cellsDiffInfo, 6, 7, applyEdits, createModifiedCellDiffInfo);

			assert.deepStrictEqual(appliedEdits, [
				{
					editType: CellEditType.Replace,
					index: 4,
					cells: [{
						cellKind: CellKind.Code,
						language: 'python',
						outputs: [],
						mime: undefined,
						metadata: {},
						internalMetadata: {},
						source: cell.getValue(),
					}], count: 0
				}
			]);

			assert.deepStrictEqual(result, [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('2'), originalCellIndex: 2,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('3'), originalCellIndex: 3,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('New1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('InsertedOriginal:4'), originalCellIndex: 4,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('InsertedModified:2'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('4'), originalCellIndex: 5,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('4'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('5'), originalCellIndex: 6,
					modifiedCellIndex: 4, modifiedModel: createModifiedModel('5'),
				},
				{
					diff, keep, undo, type: 'modified', originalModel: createOriginalModel('6'), originalCellIndex: 7,
					modifiedCellIndex: 5, modifiedModel: createModifiedModel('6'),
				},
			]);
		});
		test('Insert 2 new cells into an notebook with 3 cells deleted', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('2'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('3'), originalCellIndex: 2,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('4'), originalCellIndex: 3,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('New1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('5'), originalCellIndex: 4,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('5'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 5,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('1'),
				},
			];
			const cell1 = createICell(CellKind.Code, 'print("Hello World")');
			const cell2 = createICell(CellKind.Code, 'print("Foo Bar")');
			const result = adjustCellDiffAndOriginalModelBasedOnCellAddDelete([2, 0, [cell1, cell2]],
				cellsDiffInfo, 4, 6, applyEdits, createModifiedCellDiffInfo);

			assert.deepStrictEqual(appliedEdits, [
				{
					editType: CellEditType.Replace,
					index: 4,
					cells: [{
						cellKind: CellKind.Code,
						language: 'python',
						outputs: [],
						mime: undefined,
						metadata: {},
						internalMetadata: {},
						source: cell1.getValue(),
					}, {
						cellKind: CellKind.Code,
						language: 'python',
						outputs: [],
						mime: undefined,
						metadata: {},
						internalMetadata: {},
						source: cell2.getValue(),
					}], count: 0
				}
			]);

			assert.deepStrictEqual(result, [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('2'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('3'), originalCellIndex: 2,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('4'), originalCellIndex: 3,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('New1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel(`InsertedOriginal:4`), originalCellIndex: 4,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel(`InsertedModified:2`),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel(`InsertedOriginal:5`), originalCellIndex: 5,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel(`InsertedModified:3`),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('5'), originalCellIndex: 6,
					modifiedCellIndex: 4, modifiedModel: createModifiedModel('5'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 7,
					modifiedCellIndex: 5, modifiedModel: createModifiedModel('1'),
				},
			]);
		});
		test('Delete a cell from an unchanged notebook', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('1'),
				},
			];

			const result = adjustCellDiffAndOriginalModelBasedOnCellAddDelete([0, 1, []],
				cellsDiffInfo, 2, 2, applyEdits, createModifiedCellDiffInfo);

			assert.deepStrictEqual(appliedEdits, [
				{
					editType: CellEditType.Replace,
					index: 0,
					cells: [], count: 1
				}
			]);

			assert.deepStrictEqual(result, [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('1'),
				},
			]);
		});
		test('Delete last cell from an unchanged notebook', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('1'),
				},
			];

			const result = adjustCellDiffAndOriginalModelBasedOnCellAddDelete([1, 1, []],
				cellsDiffInfo, 2, 2, applyEdits, createModifiedCellDiffInfo);
			assert.deepStrictEqual(appliedEdits, [
				{
					editType: CellEditType.Replace,
					index: 1,
					cells: [], count: 1
				}
			]);

			assert.deepStrictEqual(result, [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
			]);
		});
		test('Delete the first cell, then insert a new cell at the top', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('1'),
				},
			];

			const cell1 = createICell(CellKind.Code, 'print("Hello World")');
			const result = adjustCellDiffAndOriginalModelBasedOnCellAddDelete([0, 0, [cell1]],
				cellsDiffInfo, 2, 2, applyEdits, createModifiedCellDiffInfo);

			assert.deepStrictEqual(appliedEdits, [
				{
					editType: CellEditType.Replace,
					index: 1,
					cells: [{
						cellKind: CellKind.Code,
						language: 'python',
						outputs: [],
						mime: undefined,
						metadata: {},
						internalMetadata: {},
						source: cell1.getValue(),
					}], count: 0
				}
			]);

			assert.deepStrictEqual(result, [
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('InsertedOriginal:1'), originalCellIndex: 1,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('InsertedModified:0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 2,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('1'),
				},
			]);
		});
		test('Delete a new cell from a notebook with 3 cells deleted', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('2'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('3'), originalCellIndex: 2,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('4'), originalCellIndex: 3,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('New1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('5'), originalCellIndex: 4,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('5'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 5,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('1'),
				},
			];

			const result = adjustCellDiffAndOriginalModelBasedOnCellAddDelete([1, 1, [
				// createICell(CellKind.Code, 'print("Hello World")')
			]],
				cellsDiffInfo, 4, 6, applyEdits, createModifiedCellDiffInfo);

			assert.deepStrictEqual(appliedEdits, [
			]);

			assert.deepStrictEqual(result, [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('2'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('3'), originalCellIndex: 2,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('4'), originalCellIndex: 3,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('5'), originalCellIndex: 4,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('5'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 5,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('1'),
				},
			]);
		});
		test('Delete 2 cells from a notebook with 3 cells deleted', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('2'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('3'), originalCellIndex: 2,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('4'), originalCellIndex: 3,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('New1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('5'), originalCellIndex: 4,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('5'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 5,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('1'),
				},
			];

			const result = adjustCellDiffAndOriginalModelBasedOnCellAddDelete([1, 2, [
			]],
				cellsDiffInfo, 4, 6, applyEdits, createModifiedCellDiffInfo);

			assert.deepStrictEqual(appliedEdits, [
				{
					editType: CellEditType.Replace,
					index: 4,
					cells: [], count: 1
				}
			]);

			assert.deepStrictEqual(result, [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('2'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('3'), originalCellIndex: 2,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('4'), originalCellIndex: 3,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 4,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('1'),
				},
			]);
		});
		test('Delete 3 cells from a notebook with 3 cells deleted', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'modified', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('2'), originalCellIndex: 2,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('3'), originalCellIndex: 3,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('4'), originalCellIndex: 4,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('New1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('5'), originalCellIndex: 5,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('5'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('6'), originalCellIndex: 6,
					modifiedCellIndex: 4, modifiedModel: createModifiedModel('6'),
				},
			];

			const result = adjustCellDiffAndOriginalModelBasedOnCellAddDelete([1, 3, [
			]],
				cellsDiffInfo, 5, 7, applyEdits, createModifiedCellDiffInfo);

			assert.deepStrictEqual(appliedEdits, [
				{
					editType: CellEditType.Replace,
					index: 1,
					cells: [], count: 1
				},
				{
					editType: CellEditType.Replace,
					index: 5,
					cells: [], count: 1
				}
			]);

			assert.deepStrictEqual(result, [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('2'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('3'), originalCellIndex: 2,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('4'), originalCellIndex: 3,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('6'), originalCellIndex: 4,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('6'),
				},
			]);
		});

		test('Insert 1 cell at the bottom via chat, then user creats a new cell just below that', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('New1'),
				},
			];
			const cell1 = createICell(CellKind.Code, 'print("Hello World")');
			const result = adjustCellDiffAndOriginalModelBasedOnCellAddDelete([2, 0, [cell1]],
				cellsDiffInfo, 3, 1, applyEdits, createModifiedCellDiffInfo);

			assert.deepStrictEqual(appliedEdits, [
				{
					editType: CellEditType.Replace,
					index: 1,
					cells: [{
						cellKind: CellKind.Code,
						language: 'python',
						outputs: [],
						mime: undefined,
						metadata: {},
						internalMetadata: {},
						source: cell1.getValue(),
					}], count: 0
				}
			]);

			assert.deepStrictEqual(result, [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('New1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('InsertedOriginal:1'), originalCellIndex: 1,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('InsertedModified:2'),
				},
			]);
		});
		test('Insert 1 cell at the bottom via chat, then user creats anew cells above the previous new cell', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('New1'),
				},
			];
			const cell1 = createICell(CellKind.Code, 'print("Hello World")');
			const result = adjustCellDiffAndOriginalModelBasedOnCellAddDelete([2, 0, [cell1]],
				cellsDiffInfo, 3, 2, applyEdits, createModifiedCellDiffInfo);

			assert.deepStrictEqual(appliedEdits, [
				{
					editType: CellEditType.Replace,
					index: 2,
					cells: [{
						cellKind: CellKind.Code,
						language: 'python',
						outputs: [],
						mime: undefined,
						metadata: {},
						internalMetadata: {},
						source: cell1.getValue(),
					}], count: 0
				}
			]);

			assert.deepStrictEqual(result, [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('InsertedOriginal:2'), originalCellIndex: 2,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('InsertedModified:2'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('New1'),
				},
			]);
		});
		test('Insert 1 cell at the bottom via chat, then user inserts a new cells below the  previous new cell', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('New1'),
				},
			];
			const cell1 = createICell(CellKind.Code, 'print("Hello World")');
			const result = adjustCellDiffAndOriginalModelBasedOnCellAddDelete([3, 0, [cell1]],
				cellsDiffInfo, 3, 2, applyEdits, createModifiedCellDiffInfo);

			assert.deepStrictEqual(appliedEdits, [
				{
					editType: CellEditType.Replace,
					index: 2,
					cells: [{
						cellKind: CellKind.Code,
						language: 'python',
						outputs: [],
						mime: undefined,
						metadata: {},
						internalMetadata: {},
						source: cell1.getValue(),
					}], count: 0
				}
			]);

			assert.deepStrictEqual(result, [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('New1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('InsertedOriginal:2'), originalCellIndex: 2,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('InsertedModified:3'),
				},
			]);
		});
	});

	suite('Cell Movements', function () {

		const keep = () => Promise.resolve(true);
		const undo = () => Promise.resolve(true);
		const diff = observableValue('cell1', nullDocumentDiff);

		ensureNoDisposablesAreLeakedInTestSuite();
		function createModifiedModel(id: string): ObservablePromise<ITextModel> {
			// eslint-disable-next-line local/code-no-any-casts
			return `Modified:${id}` as any;

		}
		function createOriginalModel(id: string): ObservablePromise<ITextModel> {
			// eslint-disable-next-line local/code-no-any-casts
			return `Original:${id}` as any;

		}
		test('Swap first two inserted cells in a previously empty notebook', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('1'),
				}
			];
			const result = adjustCellDiffAndOriginalModelBasedOnCellMovements({
				cells: [], kind: NotebookCellsChangeType.Move,
				index: 0, length: 1, newIdx: 1
			}, cellsDiffInfo);

			assert.ok(result);
			assert.strictEqual(result[1].length, 0);
			assert.deepStrictEqual(result[0], [
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('0'),
				},
			]);
		});
		test('Swap first two inserted cells in a notebook that had 2 cells', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('2'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('3'),
				}
			];
			const result = adjustCellDiffAndOriginalModelBasedOnCellMovements({
				cells: [], kind: NotebookCellsChangeType.Move,
				index: 0, length: 1, newIdx: 1
			}, cellsDiffInfo);

			assert.ok(result);
			assert.strictEqual(result[1].length, 0);
			assert.deepStrictEqual(result[0], [
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('2'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('3'),
				}
			]);
		});
		test('Move first inserted cell to the very bottom of notebook that had 2 cells', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('2'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('3'),
				}
			];
			const result = adjustCellDiffAndOriginalModelBasedOnCellMovements({
				cells: [], kind: NotebookCellsChangeType.Move,
				index: 0, length: 1, newIdx: 3
			}, cellsDiffInfo);

			assert.ok(result);
			assert.strictEqual(result[1].length, 0);
			assert.deepStrictEqual(result[0], [
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('2'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('3'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('0'),
				},
			]);
		});
		test('Move last cell to top of notebook after 2 cells were inserted', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('2'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('3'),
				}
			];
			const result = adjustCellDiffAndOriginalModelBasedOnCellMovements({
				cells: [], kind: NotebookCellsChangeType.Move,
				index: 3, length: 1, newIdx: 0
			}, cellsDiffInfo);

			assert.ok(result);
			assert.deepStrictEqual(result[1], [
				{
					editType: CellEditType.Move,
					index: 1,
					length: 1,
					newIdx: 0
				}
			]);
			assert.deepStrictEqual(result[0], [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('3'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 1,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('2'),
				},
			]);
		});

		test('Move second inserted cell to the very bottom of notebook that had 2 cells', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('2'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('3'),
				}
			];
			const result = adjustCellDiffAndOriginalModelBasedOnCellMovements({
				cells: [], kind: NotebookCellsChangeType.Move,
				index: 1, length: 1, newIdx: 3
			}, cellsDiffInfo);

			assert.ok(result);
			assert.strictEqual(result[1].length, 0);
			assert.deepStrictEqual(result[0], [
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('2'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('3'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('1'),
				},
			]);
		});
		test('Move second inserted cell to the second last position of notebook that had 2 cells', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('2'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('3'),
				}
			];
			const result = adjustCellDiffAndOriginalModelBasedOnCellMovements({
				cells: [], kind: NotebookCellsChangeType.Move,
				index: 1, length: 1, newIdx: 2
			}, cellsDiffInfo);

			assert.ok(result);
			assert.strictEqual(result[1].length, 0);
			assert.deepStrictEqual(result[0], [
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('2'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('3'),
				}
			]);
		});
		test('Move first cell to the last position of notebook that had 3 cells deleted from the middle', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('2'), originalCellIndex: 2,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('3'), originalCellIndex: 3,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('4'), originalCellIndex: 4,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('5'), originalCellIndex: 5,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('2'),
				},
			];
			const result = adjustCellDiffAndOriginalModelBasedOnCellMovements({
				cells: [], kind: NotebookCellsChangeType.Move,
				index: 0, length: 1, newIdx: 2
			}, cellsDiffInfo);

			assert.ok(result);
			assert.deepStrictEqual(result[1], [
				{
					editType: CellEditType.Move,
					index: 0,
					length: 1,
					newIdx: 5
				}
			]);
			assert.deepStrictEqual(result[0], [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('2'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('3'), originalCellIndex: 2,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('4'), originalCellIndex: 3,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('5'), originalCellIndex: 4,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('2'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 5,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('0'),
				},
			]);
		});
		test('Move second cell to the last position of notebook that had 3 cells deleted from the middle', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('2'), originalCellIndex: 2,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('3'), originalCellIndex: 3,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('4'), originalCellIndex: 4,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('5'), originalCellIndex: 5,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('2'),
				},
			];
			const result = adjustCellDiffAndOriginalModelBasedOnCellMovements({
				cells: [], kind: NotebookCellsChangeType.Move,
				index: 1, length: 1, newIdx: 2
			}, cellsDiffInfo);

			assert.ok(result);
			assert.deepStrictEqual(result[1], [
				{
					editType: CellEditType.Move,
					index: 1,
					length: 1,
					newIdx: 5
				}
			]);
			assert.deepStrictEqual(result[0], [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('2'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('3'), originalCellIndex: 2,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('4'), originalCellIndex: 3,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('5'), originalCellIndex: 4,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('2'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 5,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('1'),
				},
			]);
		});

		test('Move second cell to the last position of notebook that had 3 cells deleted from middle and 1 inserted in the middle', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('2'), originalCellIndex: 2,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('3'), originalCellIndex: 3,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('4'), originalCellIndex: 4,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('New1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('5'), originalCellIndex: 5,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('5'),
				},
			];
			const result = adjustCellDiffAndOriginalModelBasedOnCellMovements({
				cells: [], kind: NotebookCellsChangeType.Move,
				index: 1, length: 1, newIdx: 3
			}, cellsDiffInfo);

			assert.ok(result);
			assert.deepStrictEqual(result[1], [
				{
					editType: CellEditType.Move,
					index: 1,
					length: 1,
					newIdx: 5
				}
			]);
			assert.deepStrictEqual(result[0], [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('2'), originalCellIndex: 1,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('3'), originalCellIndex: 2,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('4'), originalCellIndex: 3,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('New1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('5'), originalCellIndex: 4,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('5'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 5,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('1'),
				},
			]);
		});
		test('Move last cell to the second position of notebook that had 3 cells deleted from middle and 1 inserted in the middle', async function () {
			const cellsDiffInfo: ICellDiffInfo[] = [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 1,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('2'), originalCellIndex: 2,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('3'), originalCellIndex: 3,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('4'), originalCellIndex: 4,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('New1'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('5'), originalCellIndex: 5,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('5'),
				},
			];
			const result = adjustCellDiffAndOriginalModelBasedOnCellMovements({
				cells: [], kind: NotebookCellsChangeType.Move,
				index: 3, length: 1, newIdx: 1
			}, cellsDiffInfo);

			assert.ok(result);
			assert.deepStrictEqual(result[1], [
				{
					editType: CellEditType.Move,
					index: 5,
					length: 1,
					newIdx: 1
				}
			]);
			assert.deepStrictEqual(result[0], [
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('0'), originalCellIndex: 0,
					modifiedCellIndex: 0, modifiedModel: createModifiedModel('0'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('5'), originalCellIndex: 1,
					modifiedCellIndex: 1, modifiedModel: createModifiedModel('5'),
				},
				{
					diff, keep, undo, type: 'unchanged', originalModel: createOriginalModel('1'), originalCellIndex: 2,
					modifiedCellIndex: 2, modifiedModel: createModifiedModel('1'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('2'), originalCellIndex: 3,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('3'), originalCellIndex: 4,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'delete', originalModel: createOriginalModel('4'), originalCellIndex: 5,
					modifiedCellIndex: undefined, modifiedModel: createModifiedModel('null'),
				},
				{
					diff, keep, undo, type: 'insert', originalModel: createOriginalModel('null'), originalCellIndex: undefined,
					modifiedCellIndex: 3, modifiedModel: createModifiedModel('New1'),
				},
			]);
		});
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/chatEditingService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/chatEditingService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Disposable, DisposableStore, IDisposable } from '../../../../../base/common/lifecycle.js';
import { waitForState } from '../../../../../base/common/observable.js';
import { isEqual } from '../../../../../base/common/resources.js';
import { assertType } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { runWithFakedTimers } from '../../../../../base/test/common/timeTravelScheduler.js';
import { assertThrowsAsync, ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { EditOperation } from '../../../../../editor/common/core/editOperation.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { TextEdit } from '../../../../../editor/common/languages.js';
import { IEditorWorkerService } from '../../../../../editor/common/services/editorWorker.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { SyncDescriptor } from '../../../../../platform/instantiation/common/descriptors.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { IWorkbenchAssignmentService } from '../../../../services/assignment/common/assignmentService.js';
import { NullWorkbenchAssignmentService } from '../../../../services/assignment/test/common/nullAssignmentService.js';
import { nullExtensionDescription } from '../../../../services/extensions/common/extensions.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { TestWorkerService } from '../../../inlineChat/test/browser/testWorkerService.js';
import { IMcpService } from '../../../mcp/common/mcpTypes.js';
import { TestMcpService } from '../../../mcp/test/common/testMcpService.js';
import { IMultiDiffSourceResolver, IMultiDiffSourceResolverService } from '../../../multiDiffEditor/browser/multiDiffSourceResolverService.js';
import { NotebookTextModel } from '../../../notebook/common/model/notebookTextModel.js';
import { INotebookService } from '../../../notebook/common/notebookService.js';
import { ChatEditingService } from '../../browser/chatEditing/chatEditingServiceImpl.js';
import { ChatSessionsService } from '../../browser/chatSessions.contribution.js';
import { ChatAgentService, IChatAgentData, IChatAgentImplementation, IChatAgentService } from '../../common/chatAgents.js';
import { ChatEditingSessionState, IChatEditingService, IChatEditingSession, ModifiedFileEntryState } from '../../common/chatEditingService.js';
import { ChatModel } from '../../common/chatModel.js';
import { IChatService } from '../../common/chatService.js';
import { ChatService } from '../../common/chatServiceImpl.js';
import { IChatSessionsService } from '../../common/chatSessionsService.js';
import { IChatSlashCommandService } from '../../common/chatSlashCommands.js';
import { ChatTransferService, IChatTransferService } from '../../common/chatTransferService.js';
import { IChatVariablesService } from '../../common/chatVariables.js';
import { ChatAgentLocation, ChatModeKind } from '../../common/constants.js';
import { ILanguageModelsService } from '../../common/languageModels.js';
import { NullLanguageModelsService } from '../common/languageModels.js';
import { MockChatVariablesService } from '../common/mockChatVariables.js';

function getAgentData(id: string): IChatAgentData {
	return {
		name: id,
		id: id,
		extensionId: nullExtensionDescription.identifier,
		extensionVersion: undefined,
		extensionPublisherId: '',
		publisherDisplayName: '',
		extensionDisplayName: '',
		locations: [ChatAgentLocation.Chat],
		modes: [ChatModeKind.Ask],
		metadata: {},
		slashCommands: [],
		disambiguation: [],
	};
}

suite('ChatEditingService', function () {

	const store = new DisposableStore();
	let editingService: ChatEditingService;
	let chatService: IChatService;
	let textModelService: ITextModelService;

	setup(function () {
		const collection = new ServiceCollection();
		collection.set(IWorkbenchAssignmentService, new NullWorkbenchAssignmentService());
		collection.set(IChatAgentService, new SyncDescriptor(ChatAgentService));
		collection.set(IChatVariablesService, new MockChatVariablesService());
		collection.set(IChatSlashCommandService, new class extends mock<IChatSlashCommandService>() { });
		collection.set(IChatTransferService, new SyncDescriptor(ChatTransferService));
		collection.set(IChatSessionsService, new SyncDescriptor(ChatSessionsService));
		collection.set(IChatEditingService, new SyncDescriptor(ChatEditingService));
		collection.set(IEditorWorkerService, new SyncDescriptor(TestWorkerService));
		collection.set(IChatService, new SyncDescriptor(ChatService));
		collection.set(IMcpService, new TestMcpService());
		collection.set(ILanguageModelsService, new SyncDescriptor(NullLanguageModelsService));
		collection.set(IMultiDiffSourceResolverService, new class extends mock<IMultiDiffSourceResolverService>() {
			override registerResolver(_resolver: IMultiDiffSourceResolver): IDisposable {
				return Disposable.None;
			}
		});
		collection.set(INotebookService, new class extends mock<INotebookService>() {
			override getNotebookTextModel(_uri: URI): NotebookTextModel | undefined {
				return undefined;
			}
			override hasSupportedNotebooks(_resource: URI): boolean {
				return false;
			}
		});
		const insta = store.add(store.add(workbenchInstantiationService(undefined, store)).createChild(collection));
		store.add(insta.get(IEditorWorkerService) as TestWorkerService);
		const value = insta.get(IChatEditingService);
		assert.ok(value instanceof ChatEditingService);
		editingService = value;

		chatService = insta.get(IChatService);

		store.add(insta.get(IChatSessionsService) as ChatSessionsService); // Needs to be disposed in between test runs to clear extensionPoint contribution
		store.add(chatService as ChatService);
		chatService.setSaveModelsEnabled(false);

		const chatAgentService = insta.get(IChatAgentService);

		const agent: IChatAgentImplementation = {
			async invoke(request, progress, history, token) {
				return {};
			},
		};
		store.add(chatAgentService.registerAgent('testAgent', { ...getAgentData('testAgent'), isDefault: true }));
		store.add(chatAgentService.registerAgentImplementation('testAgent', agent));

		textModelService = insta.get(ITextModelService);

		const modelService = insta.get(IModelService);

		store.add(textModelService.registerTextModelContentProvider('test', {
			async provideTextContent(resource) {
				return store.add(modelService.createModel(resource.path.repeat(10), null, resource, false));
			},
		}));
	});

	teardown(async () => {
		store.clear();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('create session', async function () {
		assert.ok(editingService);

		const modelRef = chatService.startSession(ChatAgentLocation.EditorInline);
		const model = modelRef.object as ChatModel;
		const session = editingService.createEditingSession(model, true);

		assert.strictEqual(session.chatSessionResource.toString(), model.sessionResource.toString());
		assert.strictEqual(session.isGlobalEditingSession, true);

		await assertThrowsAsync(async () => {
			// DUPE not allowed
			editingService.createEditingSession(model);
		});

		session.dispose();
		modelRef.dispose();
	});

	test('create session, file entry & isCurrentlyBeingModifiedBy', async function () {
		assert.ok(editingService);

		const uri = URI.from({ scheme: 'test', path: 'HelloWorld' });

		const modelRef = store.add(chatService.startSession(ChatAgentLocation.Chat));
		const model = modelRef.object as ChatModel;
		const session = model.editingSession;
		if (!session) {
			assert.fail('session not created');
		}

		const chatRequest = model?.addRequest({ text: '', parts: [] }, { variables: [] }, 0);
		assertType(chatRequest.response);
		chatRequest.response.updateContent({ kind: 'textEdit', uri, edits: [], done: false });
		chatRequest.response.updateContent({ kind: 'textEdit', uri, edits: [{ range: new Range(1, 1, 1, 1), text: 'FarBoo\n' }], done: false });
		chatRequest.response.updateContent({ kind: 'textEdit', uri, edits: [], done: true });

		const entry = await waitForState(session.entries.map(value => value.find(a => isEqual(a.modifiedURI, uri))));

		assert.ok(isEqual(entry.modifiedURI, uri));

		await waitForState(entry.isCurrentlyBeingModifiedBy.map(value => value === chatRequest.response));
		assert.ok(entry.isCurrentlyBeingModifiedBy.get()?.responseModel === chatRequest.response);

		const unset = waitForState(entry.isCurrentlyBeingModifiedBy.map(res => res === undefined));

		chatRequest.response.complete();

		await unset;

		await entry.reject();
	});

	async function idleAfterEdit(session: IChatEditingSession, model: ChatModel, uri: URI, edits: TextEdit[]) {
		const isStreaming = waitForState(session.state.map(s => s === ChatEditingSessionState.StreamingEdits), Boolean);

		const chatRequest = model.addRequest({ text: '', parts: [] }, { variables: [] }, 0);
		assertType(chatRequest.response);

		chatRequest.response.updateContent({ kind: 'textEdit', uri, edits, done: true });

		const entry = await waitForState(session.entries.map(value => value.find(a => isEqual(a.modifiedURI, uri))));

		assert.ok(isEqual(entry.modifiedURI, uri));

		chatRequest.response.complete();

		await isStreaming;

		const isIdle = waitForState(session.state.map(s => s === ChatEditingSessionState.Idle), Boolean);
		await isIdle;

		return entry;
	}

	test('mirror typing outside -> accept', async function () {
		return runWithFakedTimers({}, async () => {
			assert.ok(editingService);

			const uri = URI.from({ scheme: 'test', path: 'abc\n' });

			const modelRef = store.add(chatService.startSession(ChatAgentLocation.Chat));
			const model = modelRef.object as ChatModel;
			const session = model.editingSession;
			assertType(session, 'session not created');

			const entry = await idleAfterEdit(session, model, uri, [{ range: new Range(1, 1, 1, 1), text: 'FarBoo\n' }]);
			const original = store.add(await textModelService.createModelReference(entry.originalURI)).object.textEditorModel;
			const modified = store.add(await textModelService.createModelReference(entry.modifiedURI)).object.textEditorModel;

			assert.strictEqual(entry.state.get(), ModifiedFileEntryState.Modified);

			assert.strictEqual(original.getValue(), 'abc\n'.repeat(10));
			assert.strictEqual(modified.getValue(), 'FarBoo\n' + 'abc\n'.repeat(10));

			modified.pushEditOperations(null, [EditOperation.insert(new Position(3, 1), 'USER_TYPE\n')], () => null);

			assert.ok(modified.getValue().includes('USER_TYPE'));
			assert.ok(original.getValue().includes('USER_TYPE'));

			await entry.accept();
			assert.strictEqual(modified.getValue(), original.getValue());
			assert.strictEqual(entry.state.get(), ModifiedFileEntryState.Accepted);

			assert.ok(modified.getValue().includes('FarBoo'));
			assert.ok(original.getValue().includes('FarBoo'));
		});
	});

	test('mirror typing outside -> reject', async function () {
		return runWithFakedTimers({}, async () => {
			assert.ok(editingService);

			const uri = URI.from({ scheme: 'test', path: 'abc\n' });

			const modelRef = store.add(chatService.startSession(ChatAgentLocation.Chat));
			const model = modelRef.object as ChatModel;
			const session = model.editingSession;
			assertType(session, 'session not created');

			const entry = await idleAfterEdit(session, model, uri, [{ range: new Range(1, 1, 1, 1), text: 'FarBoo\n' }]);
			const original = store.add(await textModelService.createModelReference(entry.originalURI)).object.textEditorModel;
			const modified = store.add(await textModelService.createModelReference(entry.modifiedURI)).object.textEditorModel;

			assert.strictEqual(entry.state.get(), ModifiedFileEntryState.Modified);

			assert.strictEqual(original.getValue(), 'abc\n'.repeat(10));
			assert.strictEqual(modified.getValue(), 'FarBoo\n' + 'abc\n'.repeat(10));

			modified.pushEditOperations(null, [EditOperation.insert(new Position(3, 1), 'USER_TYPE\n')], () => null);

			assert.ok(modified.getValue().includes('USER_TYPE'));
			assert.ok(original.getValue().includes('USER_TYPE'));

			await entry.reject();
			assert.strictEqual(modified.getValue(), original.getValue());
			assert.strictEqual(entry.state.get(), ModifiedFileEntryState.Rejected);

			assert.ok(!modified.getValue().includes('FarBoo'));
			assert.ok(!original.getValue().includes('FarBoo'));
		});
	});

	test('NO mirror typing inside -> accept', async function () {
		return runWithFakedTimers({}, async () => {
			assert.ok(editingService);

			const uri = URI.from({ scheme: 'test', path: 'abc\n' });

			const modelRef = store.add(chatService.startSession(ChatAgentLocation.Chat));
			const model = modelRef.object as ChatModel;
			const session = model.editingSession;
			assertType(session, 'session not created');

			const entry = await idleAfterEdit(session, model, uri, [{ range: new Range(1, 1, 1, 1), text: 'FarBoo\n' }]);
			const original = store.add(await textModelService.createModelReference(entry.originalURI)).object.textEditorModel;
			const modified = store.add(await textModelService.createModelReference(entry.modifiedURI)).object.textEditorModel;

			assert.strictEqual(entry.state.get(), ModifiedFileEntryState.Modified);

			assert.strictEqual(original.getValue(), 'abc\n'.repeat(10));
			assert.strictEqual(modified.getValue(), 'FarBoo\n' + 'abc\n'.repeat(10));

			modified.pushEditOperations(null, [EditOperation.replace(new Range(1, 2, 1, 7), 'ooBar')], () => null);

			assert.ok(modified.getValue().includes('FooBar'));
			assert.ok(!original.getValue().includes('FooBar')); // typed in the AI edits, DO NOT transpose

			await entry.accept();
			assert.strictEqual(modified.getValue(), original.getValue());
			assert.strictEqual(entry.state.get(), ModifiedFileEntryState.Accepted);

			assert.ok(modified.getValue().includes('FooBar'));
			assert.ok(original.getValue().includes('FooBar'));
		});
	});

	test('ChatEditingService merges text edits it shouldn\'t merge, #272679', async function () {
		return runWithFakedTimers({}, async () => {
			assert.ok(editingService);

			const uri = URI.from({ scheme: 'test', path: 'abc' });

			const modified = store.add(await textModelService.createModelReference(uri)).object.textEditorModel;

			const modelRef = store.add(chatService.startSession(ChatAgentLocation.Chat));
			const model = modelRef.object as ChatModel;
			const session = model.editingSession;
			assertType(session, 'session not created');

			modified.setValue('');
			await idleAfterEdit(session, model, uri, [{ range: new Range(1, 1, 1, 1), text: 'a' }, { range: new Range(1, 1, 1, 1), text: 'b' }]);
			assert.strictEqual(modified.getValue(), 'ab');

			modified.setValue('');
			await idleAfterEdit(session, model, uri, [{ range: new Range(1, 1, 1, 1), text: 'a' }]);
			await idleAfterEdit(session, model, uri, [{ range: new Range(1, 1, 1, 1), text: 'b' }]);
			assert.strictEqual(modified.getValue(), 'ba');
		});
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/chatEditingSessionStorage.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/chatEditingSessionStorage.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { ResourceMap } from '../../../../../base/common/map.js';
import { cloneAndChange } from '../../../../../base/common/objects.js';
import { URI } from '../../../../../base/common/uri.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { FileService } from '../../../../../platform/files/common/fileService.js';
import { InMemoryFileSystemProvider } from '../../../../../platform/files/common/inMemoryFilesystemProvider.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { TestEnvironmentService } from '../../../../test/browser/workbenchTestServices.js';
import { ChatEditingSessionStorage, IChatEditingSessionStop, StoredSessionState } from '../../browser/chatEditing/chatEditingSessionStorage.js';
import { ChatEditingSnapshotTextModelContentProvider } from '../../browser/chatEditing/chatEditingTextModelContentProviders.js';
import { ISnapshotEntry, ModifiedFileEntryState } from '../../common/chatEditingService.js';

suite('ChatEditingSessionStorage', () => {
	const ds = ensureNoDisposablesAreLeakedInTestSuite();
	const sessionResource = URI.parse('chat://test-session');
	let fs: FileService;
	let storage: TestChatEditingSessionStorage;

	class TestChatEditingSessionStorage extends ChatEditingSessionStorage {
		public get storageLocation() {
			return super._getStorageLocation();
		}
	}

	setup(() => {
		fs = ds.add(new FileService(new NullLogService()));
		ds.add(fs.registerProvider(TestEnvironmentService.workspaceStorageHome.scheme, ds.add(new InMemoryFileSystemProvider())));

		storage = new TestChatEditingSessionStorage(
			sessionResource,
			fs,
			TestEnvironmentService,
			new NullLogService(),
			// eslint-disable-next-line local/code-no-any-casts
			{ getWorkspace: () => ({ id: 'workspaceId' }) } as any,
		);
	});

	function makeStop(requestId: string | undefined, before: string, after: string): IChatEditingSessionStop {
		const stopId = generateUuid();
		const resource = URI.file('/foo.js');
		return {
			stopId,
			entries: new ResourceMap([
				[resource, { resource, languageId: 'javascript', snapshotUri: ChatEditingSnapshotTextModelContentProvider.getSnapshotFileURI(sessionResource, requestId, stopId, resource.path), original: `contents${before}}`, current: `contents${after}`, state: ModifiedFileEntryState.Modified, telemetryInfo: { agentId: 'agentId', command: 'cmd', requestId: generateUuid(), result: undefined, sessionResource: sessionResource, modelId: undefined, modeId: undefined, applyCodeBlockSuggestionId: undefined, feature: undefined } } satisfies ISnapshotEntry],
			]),
		};
	}

	function generateState(): StoredSessionState {
		const initialFileContents = new ResourceMap<string>();
		for (let i = 0; i < 10; i++) { initialFileContents.set(URI.file(`/foo${i}.js`), `fileContents${Math.floor(i / 2)}`); }

		return {
			initialFileContents,
			recentSnapshot: makeStop(undefined, 'd', 'e'),
			timeline: undefined,
		};
	}

	test('state is empty initially', async () => {
		const s = await storage.restoreState();
		assert.strictEqual(s, undefined);
	});

	test('round trips state', async () => {
		const original = generateState();
		await storage.storeState(original);

		const changer = (x: any) => {
			return URI.isUri(x) ? x.toString() : x instanceof Map ? cloneAndChange([...x.values()], changer) : undefined;
		};

		const restored = await storage.restoreState();
		assert.deepStrictEqual(cloneAndChange(restored, changer), cloneAndChange(original, changer));
	});

	test('clears state', async () => {
		await storage.storeState(generateState());
		await storage.clearState();
		const s = await storage.restoreState();
		assert.strictEqual(s, undefined);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/chatMarkdownRenderer.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/chatMarkdownRenderer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { assertSnapshot } from '../../../../../base/test/common/snapshot.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ChatContentMarkdownRenderer } from '../../browser/chatContentMarkdownRenderer.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';

suite('ChatMarkdownRenderer', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let testRenderer: ChatContentMarkdownRenderer;
	setup(() => {
		const instantiationService = store.add(workbenchInstantiationService(undefined, store));
		testRenderer = instantiationService.createInstance(ChatContentMarkdownRenderer);
	});

	test('simple', async () => {
		const md = new MarkdownString('a');
		const result = store.add(testRenderer.render(md));
		await assertSnapshot(result.element.textContent);
	});

	test('supportHtml with one-line markdown', async () => {
		const md = new MarkdownString('**hello**');
		md.supportHtml = true;
		const result = store.add(testRenderer.render(md));
		await assertSnapshot(result.element.outerHTML);

		const md2 = new MarkdownString('1. [_hello_](https://example.com) test **text**');
		md2.supportHtml = true;
		const result2 = store.add(testRenderer.render(md2));
		await assertSnapshot(result2.element.outerHTML);
	});

	test('invalid HTML', async () => {
		const md = new MarkdownString('1<canvas>2<details>3</details></canvas>4');
		md.supportHtml = true;
		const result = store.add(testRenderer.render(md));
		await assertSnapshot(result.element.outerHTML);
	});

	test('invalid HTML with attributes', async () => {
		const md = new MarkdownString('1<details id="id1" style="display: none">2<details id="my id 2">3</details></details>4');
		md.supportHtml = true;
		const result = store.add(testRenderer.render(md));
		await assertSnapshot(result.element.outerHTML);
	});

	test('valid HTML', async () => {
		const md = new MarkdownString(`
<h1>heading</h1>
<ul>
	<li>1</li>
	<li><b>hi</b></li>
</ul>
<pre><code>code here</code></pre>`);
		md.supportHtml = true;
		const result = store.add(testRenderer.render(md));
		await assertSnapshot(result.element.outerHTML);
	});

	test('mixed valid and invalid HTML', async () => {
		const md = new MarkdownString(`
<h1>heading</h1>
<details>
<ul>
	<li><span><details><i>1</i></details></span></li>
	<li><b>hi</b></li>
</ul>
</details>
<pre><canvas>canvas here</canvas></pre><details></details>`);
		md.supportHtml = true;
		const result = store.add(testRenderer.render(md));
		await assertSnapshot(result.element.outerHTML);
	});

	test('self-closing elements', async () => {
		{
			const md = new MarkdownString('<area><hr><br><input type="text" value="test">');
			md.supportHtml = true;
			const result = store.add(testRenderer.render(md));
			await assertSnapshot(result.element.outerHTML);
		}
		{
			const md = new MarkdownString('<area><hr><br><input type="checkbox">');
			md.supportHtml = true;
			const result = store.add(testRenderer.render(md));
			await assertSnapshot(result.element.outerHTML);
		}
	});

	test('html comments', async () => {
		const md = new MarkdownString('<!-- comment1 <div></div> --><div>content</div><!-- comment2 -->');
		md.supportHtml = true;
		const result = store.add(testRenderer.render(md));
		await assertSnapshot(result.element.outerHTML);
	});

	test('CDATA', async () => {
		const md = new MarkdownString('<![CDATA[<div>content</div>]]>');
		md.supportHtml = true;
		const result = store.add(testRenderer.render(md));
		await assertSnapshot(result.element.outerHTML);
	});

	test('remote images are disallowed', async () => {
		const md = new MarkdownString('<img src="http://disallowed.com/image.jpg">');
		md.supportHtml = true;
		const result = store.add(testRenderer.render(md));
		await assertSnapshot(result.element.outerHTML);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/chatModelsViewModel.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/chatModelsViewModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { DisposableStore, IDisposable } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ILanguageModelChatMetadata, ILanguageModelChatMetadataAndIdentifier, ILanguageModelChatProvider, ILanguageModelChatSelector, ILanguageModelsService, IUserFriendlyLanguageModel } from '../../common/languageModels.js';
import { ChatModelGroup, ChatModelsViewModel, IModelItemEntry, IVendorItemEntry, isVendorEntry, isGroupEntry, IGroupItemEntry } from '../../browser/chatManagement/chatModelsViewModel.js';
import { IChatEntitlementService, ChatEntitlement } from '../../../../services/chat/common/chatEntitlementService.js';
import { IObservable, observableValue } from '../../../../../base/common/observable.js';
import { ExtensionIdentifier } from '../../../../../platform/extensions/common/extensions.js';

class MockLanguageModelsService implements ILanguageModelsService {
	_serviceBrand: undefined;

	private vendors: IUserFriendlyLanguageModel[] = [];
	private models = new Map<string, ILanguageModelChatMetadata>();
	private modelsByVendor = new Map<string, string[]>();

	private readonly _onDidChangeLanguageModels = new Emitter<string>();
	readonly onDidChangeLanguageModels = this._onDidChangeLanguageModels.event;

	addVendor(vendor: IUserFriendlyLanguageModel): void {
		this.vendors.push(vendor);
		this.modelsByVendor.set(vendor.vendor, []);
	}

	addModel(vendorId: string, identifier: string, metadata: ILanguageModelChatMetadata): void {
		this.models.set(identifier, metadata);
		const models = this.modelsByVendor.get(vendorId) || [];
		models.push(identifier);
		this.modelsByVendor.set(vendorId, models);
	}

	registerLanguageModelProvider(vendor: string, provider: ILanguageModelChatProvider): IDisposable {
		throw new Error('Method not implemented.');
	}

	updateModelPickerPreference(modelIdentifier: string, showInModelPicker: boolean): void {
		const metadata = this.models.get(modelIdentifier);
		if (metadata) {
			this.models.set(modelIdentifier, { ...metadata, isUserSelectable: showInModelPicker });
		}
	}

	getVendors(): IUserFriendlyLanguageModel[] {
		return this.vendors;
	}

	getLanguageModelIds(): string[] {
		return Array.from(this.models.keys());
	}

	lookupLanguageModel(identifier: string): ILanguageModelChatMetadata | undefined {
		return this.models.get(identifier);
	}

	getLanguageModels(): ILanguageModelChatMetadataAndIdentifier[] {
		const result: ILanguageModelChatMetadataAndIdentifier[] = [];
		for (const [identifier, metadata] of this.models.entries()) {
			result.push({ identifier, metadata });
		}
		return result;
	}

	setContributedSessionModels(): void {
	}

	clearContributedSessionModels(): void {
	}

	async selectLanguageModels(selector: ILanguageModelChatSelector, allowHidden?: boolean): Promise<string[]> {
		if (selector.vendor) {
			return this.modelsByVendor.get(selector.vendor) || [];
		}
		return Array.from(this.models.keys());
	}

	sendChatRequest(): Promise<any> {
		throw new Error('Method not implemented.');
	}

	computeTokenLength(): Promise<number> {
		throw new Error('Method not implemented.');
	}
}

class MockChatEntitlementService implements IChatEntitlementService {
	_serviceBrand: undefined;

	private readonly _onDidChangeEntitlement = new Emitter<void>();
	readonly onDidChangeEntitlement = this._onDidChangeEntitlement.event;

	readonly entitlement = ChatEntitlement.Unknown;
	readonly entitlementObs: IObservable<ChatEntitlement> = observableValue('entitlement', ChatEntitlement.Unknown);

	readonly organisations: string[] | undefined = undefined;
	readonly isInternal = false;
	readonly sku: string | undefined = undefined;

	readonly onDidChangeQuotaExceeded = Event.None;
	readonly onDidChangeQuotaRemaining = Event.None;

	readonly quotas = {
		chat: {
			total: 100,
			remaining: 100,
			percentRemaining: 100,
			overageEnabled: false,
			overageCount: 0,
			unlimited: false
		},
		completions: {
			total: 100,
			remaining: 100,
			percentRemaining: 100,
			overageEnabled: false,
			overageCount: 0,
			unlimited: false
		}
	};

	readonly onDidChangeSentiment = Event.None;
	readonly sentiment: any = { installed: true, hidden: false, disabled: false };
	readonly sentimentObs: IObservable<any> = observableValue('sentiment', { installed: true, hidden: false, disabled: false });

	readonly onDidChangeAnonymous = Event.None;
	readonly anonymous = false;
	readonly anonymousObs: IObservable<boolean> = observableValue('anonymous', false);

	fireEntitlementChange(): void {
		this._onDidChangeEntitlement.fire();
	}

	async update(): Promise<void> {
		// Not needed for tests
	}
}

suite('ChatModelsViewModel', () => {
	let store: DisposableStore;
	let languageModelsService: MockLanguageModelsService;
	let chatEntitlementService: MockChatEntitlementService;
	let viewModel: ChatModelsViewModel;

	setup(async () => {
		store = new DisposableStore();
		languageModelsService = new MockLanguageModelsService();
		chatEntitlementService = new MockChatEntitlementService();

		// Setup test data
		languageModelsService.addVendor({
			vendor: 'copilot',
			displayName: 'GitHub Copilot',
			managementCommand: undefined,
			when: undefined
		});

		languageModelsService.addVendor({
			vendor: 'openai',
			displayName: 'OpenAI',
			managementCommand: undefined,
			when: undefined
		});

		languageModelsService.addModel('copilot', 'copilot-gpt-4', {
			extension: new ExtensionIdentifier('github.copilot'),
			id: 'gpt-4',
			name: 'GPT-4',
			family: 'gpt-4',
			version: '1.0',
			vendor: 'copilot',
			maxInputTokens: 8192,
			maxOutputTokens: 4096,
			modelPickerCategory: { label: 'Copilot', order: 1 },
			isUserSelectable: true,
			capabilities: {
				toolCalling: true,
				vision: true,
				agentMode: false
			}
		});

		languageModelsService.addModel('copilot', 'copilot-gpt-4o', {
			extension: new ExtensionIdentifier('github.copilot'),
			id: 'gpt-4o',
			name: 'GPT-4o',
			family: 'gpt-4',
			version: '1.0',
			vendor: 'copilot',
			maxInputTokens: 8192,
			maxOutputTokens: 4096,
			modelPickerCategory: { label: 'Copilot', order: 1 },
			isUserSelectable: true,
			capabilities: {
				toolCalling: true,
				vision: true,
				agentMode: true
			}
		});

		languageModelsService.addModel('openai', 'openai-gpt-3.5', {
			extension: new ExtensionIdentifier('openai.api'),
			id: 'gpt-3.5-turbo',
			name: 'GPT-3.5 Turbo',
			family: 'gpt-3.5',
			version: '1.0',
			vendor: 'openai',
			maxInputTokens: 4096,
			maxOutputTokens: 2048,
			modelPickerCategory: { label: 'OpenAI', order: 2 },
			isUserSelectable: true,
			capabilities: {
				toolCalling: true,
				vision: false,
				agentMode: false
			}
		});

		languageModelsService.addModel('openai', 'openai-gpt-4-vision', {
			extension: new ExtensionIdentifier('openai.api'),
			id: 'gpt-4-vision',
			name: 'GPT-4 Vision',
			family: 'gpt-4',
			version: '1.0',
			vendor: 'openai',
			maxInputTokens: 8192,
			maxOutputTokens: 4096,
			modelPickerCategory: { label: 'OpenAI', order: 2 },
			isUserSelectable: false,
			capabilities: {
				toolCalling: false,
				vision: true,
				agentMode: false
			}
		});

		viewModel = store.add(new ChatModelsViewModel(
			languageModelsService,
			chatEntitlementService
		));

		await viewModel.refresh();
	});

	teardown(() => {
		store.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('should fetch all models without filters', () => {
		const results = viewModel.filter('');

		// Should have 2 vendor entries and 4 model entries (grouped by vendor)
		assert.strictEqual(results.length, 6);

		const vendors = results.filter(isVendorEntry);
		assert.strictEqual(vendors.length, 2);

		const models = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r)) as IModelItemEntry[];
		assert.strictEqual(models.length, 4);
	});

	test('should filter by provider name', () => {
		const results = viewModel.filter('@provider:copilot');

		const models = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r)) as IModelItemEntry[];
		assert.strictEqual(models.length, 2);
		assert.ok(models.every(m => m.modelEntry.vendor === 'copilot'));
	});

	test('should filter by provider display name', () => {
		const results = viewModel.filter('@provider:OpenAI');

		const models = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r)) as IModelItemEntry[];
		assert.strictEqual(models.length, 2);
		assert.ok(models.every(m => m.modelEntry.vendor === 'openai'));
	});

	test('should filter by multiple providers with OR logic', () => {
		const results = viewModel.filter('@provider:copilot @provider:openai');

		const models = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r)) as IModelItemEntry[];
		assert.strictEqual(models.length, 4);
	});

	test('should filter by single capability - tools', () => {
		const results = viewModel.filter('@capability:tools');

		const models = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r)) as IModelItemEntry[];
		assert.strictEqual(models.length, 3);
		assert.ok(models.every(m => m.modelEntry.metadata.capabilities?.toolCalling === true));
	});

	test('should filter by single capability - vision', () => {
		const results = viewModel.filter('@capability:vision');

		const models = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r)) as IModelItemEntry[];
		assert.strictEqual(models.length, 3);
		assert.ok(models.every(m => m.modelEntry.metadata.capabilities?.vision === true));
	});

	test('should filter by single capability - agent', () => {
		const results = viewModel.filter('@capability:agent');

		const models = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r)) as IModelItemEntry[];
		assert.strictEqual(models.length, 1);
		assert.strictEqual(models[0].modelEntry.metadata.id, 'gpt-4o');
	});

	test('should filter by multiple capabilities with AND logic', () => {
		const results = viewModel.filter('@capability:tools @capability:vision');

		const models = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r)) as IModelItemEntry[];
		// Should only return models that have BOTH tools and vision
		assert.strictEqual(models.length, 2);
		assert.ok(models.every(m =>
			m.modelEntry.metadata.capabilities?.toolCalling === true &&
			m.modelEntry.metadata.capabilities?.vision === true
		));
	});

	test('should filter by three capabilities with AND logic', () => {
		const results = viewModel.filter('@capability:tools @capability:vision @capability:agent');

		const models = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r)) as IModelItemEntry[];
		// Should only return gpt-4o which has all three
		assert.strictEqual(models.length, 1);
		assert.strictEqual(models[0].modelEntry.metadata.id, 'gpt-4o');
	});

	test('should return no results when filtering by incompatible capabilities', () => {
		const results = viewModel.filter('@capability:vision @capability:agent');

		const models = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r)) as IModelItemEntry[];
		// Only gpt-4o has both vision and agent, but gpt-4-vision doesn't have agent
		assert.strictEqual(models.length, 1);
		assert.strictEqual(models[0].modelEntry.metadata.id, 'gpt-4o');
	});

	test('should filter by visibility - visible:true', () => {
		const results = viewModel.filter('@visible:true');

		const models = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r)) as IModelItemEntry[];
		assert.strictEqual(models.length, 3);
		assert.ok(models.every(m => m.modelEntry.metadata.isUserSelectable === true));
	});

	test('should filter by visibility - visible:false', () => {
		const results = viewModel.filter('@visible:false');

		const models = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r)) as IModelItemEntry[];
		assert.strictEqual(models.length, 1);
		assert.strictEqual(models[0].modelEntry.metadata.isUserSelectable, false);
	});

	test('should combine provider and capability filters', () => {
		const results = viewModel.filter('@provider:copilot @capability:vision');

		const models = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r)) as IModelItemEntry[];
		assert.strictEqual(models.length, 2);
		assert.ok(models.every(m =>
			m.modelEntry.vendor === 'copilot' &&
			m.modelEntry.metadata.capabilities?.vision === true
		));
	});

	test('should combine provider, capability, and visibility filters', () => {
		const results = viewModel.filter('@provider:openai @capability:vision @visible:false');

		const models = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r)) as IModelItemEntry[];
		assert.strictEqual(models.length, 1);
		assert.strictEqual(models[0].modelEntry.metadata.id, 'gpt-4-vision');
	});

	test('should filter by text matching model name', () => {
		const results = viewModel.filter('GPT-4o');

		const models = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r)) as IModelItemEntry[];
		assert.strictEqual(models.length, 1);
		assert.strictEqual(models[0].modelEntry.metadata.name, 'GPT-4o');
		assert.ok(models[0].modelNameMatches);
	});

	test('should filter by text matching model id', () => {
		const results = viewModel.filter('copilot-gpt-4o');

		const models = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r)) as IModelItemEntry[];
		assert.strictEqual(models.length, 1);
		assert.strictEqual(models[0].modelEntry.identifier, 'copilot-gpt-4o');
		assert.ok(models[0].modelIdMatches);
	});

	test('should filter by text matching vendor name', () => {
		const results = viewModel.filter('GitHub');

		const models = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r)) as IModelItemEntry[];
		assert.strictEqual(models.length, 2);
		assert.ok(models.every(m => m.modelEntry.vendorDisplayName === 'GitHub Copilot'));
	});

	test('should combine text search with capability filter', () => {
		const results = viewModel.filter('@capability:tools GPT');

		const models = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r)) as IModelItemEntry[];
		// Should match all models with tools capability and 'GPT' in name
		assert.strictEqual(models.length, 3);
		assert.ok(models.every(m => m.modelEntry.metadata.capabilities?.toolCalling === true));
	});

	test('should handle empty search value', () => {
		const results = viewModel.filter('');

		// Should return all models grouped by vendor
		assert.ok(results.length > 0);
	});

	test('should handle search value with only whitespace', () => {
		const results = viewModel.filter('   ');

		// Should return all models grouped by vendor
		assert.ok(results.length > 0);
	});

	test('should match capability text in free text search', () => {
		const results = viewModel.filter('vision');

		const models = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r)) as IModelItemEntry[];
		// Should match models that have vision capability or "vision" in their name
		assert.ok(models.length > 0);
		assert.ok(models.every(m =>
			m.modelEntry.metadata.capabilities?.vision === true ||
			m.modelEntry.metadata.name.toLowerCase().includes('vision')
		));
	});

	test('should toggle vendor collapsed state', () => {
		const vendorEntry = viewModel.viewModelEntries.find(r => isVendorEntry(r) && r.vendorEntry.vendor === 'copilot') as IVendorItemEntry;
		viewModel.toggleCollapsed(vendorEntry);

		const results = viewModel.filter('');
		const copilotVendor = results.find(r => isVendorEntry(r) && (r as IVendorItemEntry).vendorEntry.vendor === 'copilot') as IVendorItemEntry;

		assert.ok(copilotVendor);
		assert.strictEqual(copilotVendor.collapsed, true);

		// Models should not be shown when vendor is collapsed
		const copilotModelsAfterCollapse = results.filter(r =>
			!isVendorEntry(r) && (r as IModelItemEntry).modelEntry.vendor === 'copilot'
		);
		assert.strictEqual(copilotModelsAfterCollapse.length, 0);

		// Toggle back
		viewModel.toggleCollapsed(vendorEntry);
		const resultsAfterExpand = viewModel.filter('');
		const copilotModelsAfterExpand = resultsAfterExpand.filter(r =>
			!isVendorEntry(r) && (r as IModelItemEntry).modelEntry.vendor === 'copilot'
		);
		assert.strictEqual(copilotModelsAfterExpand.length, 2);
	});

	test('should fire onDidChangeModelEntries when entitlement changes', async () => {
		let fired = false;
		store.add(viewModel.onDidChange(() => {
			fired = true;
		}));

		chatEntitlementService.fireEntitlementChange();

		// Wait a bit for async resolve
		await new Promise(resolve => setTimeout(resolve, 10));

		assert.strictEqual(fired, true);
	});

	test('should handle quoted search strings', () => {
		// When a search string is fully quoted (starts and ends with quotes),
		// the completeMatch flag is set to true, which currently skips all matching
		// This test verifies the quotes are processed without errors
		const results = viewModel.filter('"GPT"');

		// The function should complete without error
		// Note: complete match logic (both quotes) currently doesn't perform matching
		assert.ok(Array.isArray(results));
	});

	test('should remove filter keywords from text search', () => {
		const results = viewModel.filter('@provider:copilot @capability:vision GPT');

		const models = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r)) as IModelItemEntry[];
		// Should only search 'GPT' in model names, not the filter keywords
		assert.strictEqual(models.length, 2);
		assert.ok(models.every(m => m.modelEntry.vendor === 'copilot'));
	});

	test('should handle case-insensitive capability matching', () => {
		const results1 = viewModel.filter('@capability:TOOLS');
		const results2 = viewModel.filter('@capability:tools');
		const results3 = viewModel.filter('@capability:Tools');

		const models1 = results1.filter(r => !isVendorEntry(r));
		const models2 = results2.filter(r => !isVendorEntry(r));
		const models3 = results3.filter(r => !isVendorEntry(r));

		assert.strictEqual(models1.length, models2.length);
		assert.strictEqual(models2.length, models3.length);
	});

	test('should support toolcalling alias for tools capability', () => {
		const resultsTools = viewModel.filter('@capability:tools');
		const resultsToolCalling = viewModel.filter('@capability:toolcalling');

		const modelsTools = resultsTools.filter(r => !isVendorEntry(r));
		const modelsToolCalling = resultsToolCalling.filter(r => !isVendorEntry(r));

		assert.strictEqual(modelsTools.length, modelsToolCalling.length);
	});

	test('should support agentmode alias for agent capability', () => {
		const resultsAgent = viewModel.filter('@capability:agent');
		const resultsAgentMode = viewModel.filter('@capability:agentmode');

		const modelsAgent = resultsAgent.filter(r => !isVendorEntry(r));
		const modelsAgentMode = resultsAgentMode.filter(r => !isVendorEntry(r));

		assert.strictEqual(modelsAgent.length, modelsAgentMode.length);
	});

	test('should include matched capabilities in results', () => {
		const results = viewModel.filter('@capability:tools @capability:vision');

		const models = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r)) as IModelItemEntry[];
		assert.ok(models.length > 0);

		for (const model of models) {
			assert.ok(model.capabilityMatches);
			assert.ok(model.capabilityMatches.length > 0);
			// Should include both toolCalling and vision
			assert.ok(model.capabilityMatches.some(c => c === 'toolCalling' || c === 'vision'));
		}
	});

	// Helper function to create a single vendor test environment
	function createSingleVendorViewModel(store: DisposableStore, chatEntitlementService: IChatEntitlementService, includeSecondModel: boolean = true): { service: MockLanguageModelsService; viewModel: ChatModelsViewModel } {
		const service = new MockLanguageModelsService();
		service.addVendor({
			vendor: 'copilot',
			displayName: 'GitHub Copilot',
			managementCommand: undefined,
			when: undefined
		});

		service.addModel('copilot', 'copilot-gpt-4', {
			extension: new ExtensionIdentifier('github.copilot'),
			id: 'gpt-4',
			name: 'GPT-4',
			family: 'gpt-4',
			version: '1.0',
			vendor: 'copilot',
			maxInputTokens: 8192,
			maxOutputTokens: 4096,
			modelPickerCategory: { label: 'Copilot', order: 1 },
			isUserSelectable: true,
			capabilities: {
				toolCalling: true,
				vision: true,
				agentMode: false
			}
		});

		if (includeSecondModel) {
			service.addModel('copilot', 'copilot-gpt-4o', {
				extension: new ExtensionIdentifier('github.copilot'),
				id: 'gpt-4o',
				name: 'GPT-4o',
				family: 'gpt-4',
				version: '1.0',
				vendor: 'copilot',
				maxInputTokens: 8192,
				maxOutputTokens: 4096,
				modelPickerCategory: { label: 'Copilot', order: 1 },
				isUserSelectable: true,
				capabilities: {
					toolCalling: true,
					vision: true,
					agentMode: true
				}
			});
		}

		const viewModel = store.add(new ChatModelsViewModel(service, chatEntitlementService));
		return { service, viewModel };
	}

	test('should not show vendor header when only one vendor exists', async () => {
		const { viewModel: singleVendorViewModel } = createSingleVendorViewModel(store, chatEntitlementService);
		await singleVendorViewModel.refresh();

		const results = singleVendorViewModel.filter('');

		// Should have only model entries, no vendor entry
		const vendors = results.filter(isVendorEntry);
		assert.strictEqual(vendors.length, 0, 'Should not show vendor header when only one vendor exists');

		const models = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r)) as IModelItemEntry[];
		assert.strictEqual(models.length, 2, 'Should show all models');
		assert.ok(models.every(m => m.modelEntry.vendor === 'copilot'));
	});

	test('should show vendor headers when multiple vendors exist', () => {
		// This is the existing behavior test
		const results = viewModel.filter('');

		// Should have 2 vendor entries and 4 model entries (grouped by vendor)
		const vendors = results.filter(isVendorEntry);
		assert.strictEqual(vendors.length, 2, 'Should show vendor headers when multiple vendors exist');

		const models = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r)) as IModelItemEntry[];
		assert.strictEqual(models.length, 4);
	});

	test('should filter single vendor models by capability', async () => {
		const { viewModel: singleVendorViewModel } = createSingleVendorViewModel(store, chatEntitlementService);
		await singleVendorViewModel.refresh();

		const results = singleVendorViewModel.filter('@capability:agent');

		// Should not show vendor header
		const vendors = results.filter(isVendorEntry);
		assert.strictEqual(vendors.length, 0, 'Should not show vendor header');

		// Should only show the model with agent capability
		const models = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r)) as IModelItemEntry[];
		assert.strictEqual(models.length, 1);
		assert.strictEqual(models[0].modelEntry.metadata.id, 'gpt-4o');
	});

	test('should always place copilot vendor at the top', () => {
		const results = viewModel.filter('');

		const vendors = results.filter(isVendorEntry) as IVendorItemEntry[];
		assert.ok(vendors.length >= 2);

		// First vendor should always be copilot
		assert.strictEqual(vendors[0].vendorEntry.vendor, 'copilot');
	});

	test('should maintain copilot at top with multiple vendors', async () => {
		// Add more vendors to ensure sorting works correctly
		languageModelsService.addVendor({
			vendor: 'anthropic',
			displayName: 'Anthropic',
			managementCommand: undefined,
			when: undefined
		});

		languageModelsService.addModel('anthropic', 'anthropic-claude', {
			extension: new ExtensionIdentifier('anthropic.api'),
			id: 'claude-3',
			name: 'Claude 3',
			family: 'claude',
			version: '1.0',
			vendor: 'anthropic',
			maxInputTokens: 100000,
			maxOutputTokens: 4096,
			modelPickerCategory: { label: 'Anthropic', order: 3 },
			isUserSelectable: true,
			capabilities: {
				toolCalling: true,
				vision: false,
				agentMode: false
			}
		});

		languageModelsService.addVendor({
			vendor: 'azure',
			displayName: 'Azure OpenAI',
			managementCommand: undefined,
			when: undefined
		});

		languageModelsService.addModel('azure', 'azure-gpt-4', {
			extension: new ExtensionIdentifier('microsoft.azure'),
			id: 'azure-gpt-4',
			name: 'Azure GPT-4',
			family: 'gpt-4',
			version: '1.0',
			vendor: 'azure',
			maxInputTokens: 8192,
			maxOutputTokens: 4096,
			modelPickerCategory: { label: 'Azure', order: 4 },
			isUserSelectable: true,
			capabilities: {
				toolCalling: true,
				vision: false,
				agentMode: false
			}
		});

		await viewModel.refresh();

		const results = viewModel.filter('');
		const vendors = results.filter(isVendorEntry) as IVendorItemEntry[];

		// Should have 4 vendors: copilot, openai, anthropic, azure
		assert.strictEqual(vendors.length, 4);

		// First vendor should always be copilot
		assert.strictEqual(vendors[0].vendorEntry.vendor, 'copilot');

		// Other vendors should be alphabetically sorted: anthropic, azure, openai
		assert.strictEqual(vendors[1].vendorEntry.vendor, 'anthropic');
		assert.strictEqual(vendors[2].vendorEntry.vendor, 'azure');
		assert.strictEqual(vendors[3].vendorEntry.vendor, 'openai');
	});

	test('should keep copilot at top even with text search', () => {
		// Even when searching, if results include multiple vendors, copilot should be first
		const results = viewModel.filter('GPT');

		const vendors = results.filter(isVendorEntry) as IVendorItemEntry[];

		if (vendors.length > 1) {
			// If multiple vendors match, copilot should be first
			const copilotVendor = vendors.find(v => v.vendorEntry.vendor === 'copilot');
			if (copilotVendor) {
				assert.strictEqual(vendors[0].vendorEntry.vendor, 'copilot');
			}
		}
	});

	test('should keep copilot at top when filtering by capability', () => {
		const results = viewModel.filter('@capability:tools');

		const vendors = results.filter(isVendorEntry) as IVendorItemEntry[];

		// Both copilot and openai have models with tools capability
		if (vendors.length > 1) {
			assert.strictEqual(vendors[0].vendorEntry.vendor, 'copilot');
		}
	});

	test('should show vendor headers when filtered', () => {
		const results = viewModel.filter('GPT');
		const vendors = results.filter(isVendorEntry);
		assert.ok(vendors.length > 0);
	});

	test('should not show vendor headers when filtered if only one vendor exists', async () => {
		const { viewModel: singleVendorViewModel } = createSingleVendorViewModel(store, chatEntitlementService);
		await singleVendorViewModel.refresh();

		const results = singleVendorViewModel.filter('GPT');
		const vendors = results.filter(isVendorEntry);
		assert.strictEqual(vendors.length, 0);
	});

	test('should group by visibility', () => {
		viewModel.groupBy = ChatModelGroup.Visibility;
		const results = viewModel.filter('');

		const groups = results.filter(isGroupEntry) as IGroupItemEntry[];
		assert.strictEqual(groups.length, 2);
		assert.strictEqual(groups[0].group, 'visible');
		assert.strictEqual(groups[1].group, 'hidden');

		const visibleModels = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r) && r.modelEntry.metadata.isUserSelectable) as IModelItemEntry[];
		const hiddenModels = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r) && !r.modelEntry.metadata.isUserSelectable) as IModelItemEntry[];

		assert.strictEqual(visibleModels.length, 3);
		assert.strictEqual(hiddenModels.length, 1);
	});

	test('should fire onDidChangeGrouping when grouping changes', () => {
		let fired = false;
		store.add(viewModel.onDidChangeGrouping(() => {
			fired = true;
		}));

		viewModel.groupBy = ChatModelGroup.Visibility;
		assert.strictEqual(fired, true);
	});

	test('should reset collapsed state when grouping changes', () => {
		const vendorEntry = viewModel.viewModelEntries.find(r => isVendorEntry(r) && r.vendorEntry.vendor === 'copilot') as IVendorItemEntry;
		viewModel.toggleCollapsed(vendorEntry);

		viewModel.groupBy = ChatModelGroup.Visibility;

		const results = viewModel.filter('');
		const groups = results.filter(isGroupEntry) as IGroupItemEntry[];
		assert.ok(groups.every(v => !v.collapsed));
	});

	test('should sort models within visibility groups', async () => {
		languageModelsService.addVendor({
			vendor: 'anthropic',
			displayName: 'Anthropic',
			managementCommand: undefined,
			when: undefined
		});

		languageModelsService.addModel('anthropic', 'anthropic-claude', {
			extension: new ExtensionIdentifier('anthropic.api'),
			id: 'claude-3',
			name: 'Claude 3',
			family: 'claude',
			version: '1.0',
			vendor: 'anthropic',
			maxInputTokens: 100000,
			maxOutputTokens: 4096,
			modelPickerCategory: { label: 'Anthropic', order: 3 },
			isUserSelectable: true,
			capabilities: {
				toolCalling: true,
				vision: false,
				agentMode: false
			}
		});

		await viewModel.refresh();

		viewModel.groupBy = ChatModelGroup.Visibility;
		const results = viewModel.filter('');

		const visibleModels = results.filter(r => !isVendorEntry(r) && !isGroupEntry(r) && r.modelEntry.metadata.isUserSelectable) as IModelItemEntry[];

		assert.strictEqual(visibleModels.length, 4);
		assert.strictEqual(visibleModels[0].modelEntry.metadata.name, 'GPT-4');
		assert.strictEqual(visibleModels[0].modelEntry.vendor, 'copilot');

		assert.strictEqual(visibleModels[1].modelEntry.metadata.name, 'GPT-4o');
		assert.strictEqual(visibleModels[1].modelEntry.vendor, 'copilot');

		assert.strictEqual(visibleModels[2].modelEntry.metadata.name, 'Claude 3');
		assert.strictEqual(visibleModels[2].modelEntry.vendor, 'anthropic');

		assert.strictEqual(visibleModels[3].modelEntry.metadata.name, 'GPT-3.5 Turbo');
		assert.strictEqual(visibleModels[3].modelEntry.vendor, 'openai');
	});

	test('should not resort models when visibility is toggled', async () => {
		viewModel.groupBy = ChatModelGroup.Visibility;

		// Initial state:
		// Visible: GPT-4, GPT-4o, GPT-3.5 Turbo
		// Hidden: GPT-4 Vision

		// Toggle GPT-4 Vision to visible
		const hiddenModel = viewModel.viewModelEntries.find(r => !isVendorEntry(r) && !isGroupEntry(r) && r.modelEntry.identifier === 'openai-gpt-4-vision') as IModelItemEntry;
		assert.ok(hiddenModel);
		const initialIndex = viewModel.viewModelEntries.indexOf(hiddenModel);

		viewModel.toggleVisibility(hiddenModel);

		// Verify it is still at the same index
		const newIndex = viewModel.viewModelEntries.indexOf(hiddenModel);
		assert.strictEqual(newIndex, initialIndex);

		// Verify metadata is updated
		assert.strictEqual(hiddenModel.modelEntry.metadata.isUserSelectable, true);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/browser/chatSelectedTools.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/browser/chatSelectedTools.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { ContextKeyService } from '../../../../../platform/contextkey/browser/contextKeyService.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { LanguageModelToolsService } from '../../browser/languageModelToolsService.js';
import { IChatService } from '../../common/chatService.js';
import { ILanguageModelToolsService, IToolData, ToolDataSource, ToolSet } from '../../common/languageModelToolsService.js';
import { MockChatService } from '../common/mockChatService.js';
import { ChatSelectedTools } from '../../browser/chatSelectedTools.js';
import { constObservable } from '../../../../../base/common/observable.js';
import { Iterable } from '../../../../../base/common/iterator.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { runWithFakedTimers } from '../../../../../base/test/common/timeTravelScheduler.js';
import { timeout } from '../../../../../base/common/async.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { URI } from '../../../../../base/common/uri.js';
import { ChatMode } from '../../common/chatModes.js';

suite('ChatSelectedTools', () => {

	let store: DisposableStore;

	let toolsService: ILanguageModelToolsService;
	let selectedTools: ChatSelectedTools;

	setup(() => {

		store = new DisposableStore();

		const instaService = workbenchInstantiationService({
			contextKeyService: () => store.add(new ContextKeyService(new TestConfigurationService)),
		}, store);
		instaService.stub(IChatService, new MockChatService());
		instaService.stub(ILanguageModelToolsService, instaService.createInstance(LanguageModelToolsService));

		store.add(instaService);
		toolsService = instaService.get(ILanguageModelToolsService);
		selectedTools = store.add(instaService.createInstance(ChatSelectedTools, constObservable(ChatMode.Agent)));
	});

	teardown(function () {
		store.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	const mcpSource: ToolDataSource = { type: 'mcp', label: 'MCP', collectionId: '', definitionId: '', instructions: '', serverLabel: '' };
	test('Can\'t enable/disable MCP tools directly #18161', () => {

		return runWithFakedTimers({}, async () => {

			const toolData1: IToolData = {
				id: 'testTool1',
				modelDescription: 'Test Tool 1',
				displayName: 'Test Tool 1',
				canBeReferencedInPrompt: true,
				toolReferenceName: 't1',
				source: mcpSource,
			};

			const toolData2: IToolData = {
				id: 'testTool2',
				modelDescription: 'Test Tool 2',
				displayName: 'Test Tool 2',
				source: mcpSource,
				canBeReferencedInPrompt: true,
				toolReferenceName: 't2',
			};

			const toolData3: IToolData = {
				id: 'testTool3',
				modelDescription: 'Test Tool 3',
				displayName: 'Test Tool 3',
				source: mcpSource,
				canBeReferencedInPrompt: true,
				toolReferenceName: 't3',
			};

			const toolset = toolsService.createToolSet(
				mcpSource,
				'mcp', 'mcp'
			);

			store.add(toolsService.registerToolData(toolData1));
			store.add(toolsService.registerToolData(toolData2));
			store.add(toolsService.registerToolData(toolData3));

			store.add(toolset);
			store.add(toolset.addTool(toolData1));
			store.add(toolset.addTool(toolData2));
			store.add(toolset.addTool(toolData3));

			assert.strictEqual(Iterable.length(toolsService.getTools()), 3);

			const size = Iterable.length(toolset.getTools());
			assert.strictEqual(size, 3);

			await timeout(1000); // UGLY the tools service updates its state sync but emits the event async (750ms) delay. This affects the observable that depends on the event

			assert.strictEqual(selectedTools.entriesMap.get().size, 7); // 1 toolset (+3 vscode, execute, read toolsets), 3 tools

			const toSet = new Map<IToolData | ToolSet, boolean>([[toolData1, true], [toolData2, false], [toolData3, false], [toolset, false]]);
			selectedTools.set(toSet, false);

			const userSelectedTools = selectedTools.userSelectedTools.get();
			assert.strictEqual(Object.keys(userSelectedTools).length, 3); // 3 tools

			assert.strictEqual(userSelectedTools[toolData1.id], true);
			assert.strictEqual(userSelectedTools[toolData2.id], false);
			assert.strictEqual(userSelectedTools[toolData3.id], false);
		});
	});

	test('Can still enable/disable user toolsets #251640', () => {
		return runWithFakedTimers({}, async () => {
			const toolData1: IToolData = {
				id: 'testTool1',
				modelDescription: 'Test Tool 1',
				displayName: 'Test Tool 1',
				canBeReferencedInPrompt: true,
				toolReferenceName: 't1',
				source: ToolDataSource.Internal,
			};

			const toolData2: IToolData = {
				id: 'testTool2',
				modelDescription: 'Test Tool 2',
				displayName: 'Test Tool 2',
				source: mcpSource,
				canBeReferencedInPrompt: true,
				toolReferenceName: 't2',
			};

			const toolData3: IToolData = {
				id: 'testTool3',
				modelDescription: 'Test Tool 3',
				displayName: 'Test Tool 3',
				source: ToolDataSource.Internal,
				canBeReferencedInPrompt: true,
				toolReferenceName: 't3',
			};

			const toolset = toolsService.createToolSet(
				{ type: 'user', label: 'User Toolset', file: URI.file('/userToolset.json') },
				'userToolset', 'userToolset'
			);

			store.add(toolsService.registerToolData(toolData1));
			store.add(toolsService.registerToolData(toolData2));
			store.add(toolsService.registerToolData(toolData3));

			store.add(toolset);
			store.add(toolset.addTool(toolData1));
			store.add(toolset.addTool(toolData2));
			store.add(toolset.addTool(toolData3));

			assert.strictEqual(Iterable.length(toolsService.getTools()), 3);

			const size = Iterable.length(toolset.getTools());
			assert.strictEqual(size, 3);

			await timeout(1000); // UGLY the tools service updates its state sync but emits the event async (750ms) delay. This affects the observable that depends on the event

			assert.strictEqual(selectedTools.entriesMap.get().size, 7); // 1 toolset (+3 vscode, execute, read toolsets), 3 tools

			// Toolset is checked, tools 2 and 3 are unchecked
			const toSet = new Map<IToolData | ToolSet, boolean>([[toolData1, true], [toolData2, false], [toolData3, false], [toolset, true]]);
			selectedTools.set(toSet, false);

			const userSelectedTools = selectedTools.userSelectedTools.get();
			assert.strictEqual(Object.keys(userSelectedTools).length, 3); // 3 tools

			// User toolset is enabled - all tools are enabled
			assert.strictEqual(userSelectedTools[toolData1.id], true);
			assert.strictEqual(userSelectedTools[toolData2.id], true);
			assert.strictEqual(userSelectedTools[toolData3.id], true);
		});
	});
});
```

--------------------------------------------------------------------------------

````

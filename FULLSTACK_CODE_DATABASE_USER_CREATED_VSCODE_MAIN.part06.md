---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:25Z
part: 6
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 6 of 552)

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

---[FILE: .vscode/extensions/vscode-selfhost-test-provider/src/extension.ts]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-test-provider/src/extension.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { randomBytes } from 'crypto';
import { tmpdir } from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import { V8CoverageFile } from './coverageProvider';
import { FailingDeepStrictEqualAssertFixer } from './failingDeepStrictEqualAssertFixer';
import { FailureTracker } from './failureTracker';
import { registerSnapshotUpdate } from './snapshot';
import { scanTestOutput } from './testOutputScanner';
import {
	TestCase,
	TestFile,
	clearFileDiagnostics,
	guessWorkspaceFolder,
	itemData,
} from './testTree';
import { BrowserTestRunner, PlatformTestRunner, VSCodeTestRunner } from './vscodeTestRunner';
import { ImportGraph } from './importGraph';

const TEST_FILE_PATTERN = 'src/vs/**/*.{test,integrationTest}.ts';

const getWorkspaceFolderForTestFile = (uri: vscode.Uri) =>
	(uri.path.endsWith('.test.ts') || uri.path.endsWith('.integrationTest.ts')) &&
		uri.path.includes('/src/vs/')
		? vscode.workspace.getWorkspaceFolder(uri)
		: undefined;

const browserArgs: [name: string, arg: string][] = [
	['Chrome', 'chromium'],
	['Firefox', 'firefox'],
	['Webkit', 'webkit'],
];

type FileChangeEvent = { uri: vscode.Uri; removed: boolean };

export async function activate(context: vscode.ExtensionContext) {
	const ctrl = vscode.tests.createTestController('selfhost-test-controller', 'VS Code Tests');
	const fileChangedEmitter = new vscode.EventEmitter<FileChangeEvent>();

	context.subscriptions.push(vscode.tests.registerTestFollowupProvider({
		async provideFollowup(_result, test, taskIndex, messageIndex, _token) {
			return [{
				title: '$(sparkle) Fix',
				command: 'github.copilot.tests.fixTestFailure',
				arguments: [{ source: 'peekFollowup', test, message: test.taskStates[taskIndex].messages[messageIndex] }]
			}];
		},
	}));

	let initialWatchPromise: Promise<vscode.Disposable> | undefined;
	const resolveHandler = async (test?: vscode.TestItem) => {
		if (!test) {
			if (!initialWatchPromise) {
				initialWatchPromise = startWatchingWorkspace(ctrl, fileChangedEmitter);
				context.subscriptions.push(await initialWatchPromise);
			} else {
				await initialWatchPromise;
			}
			return;
		}

		const data = itemData.get(test);
		if (data instanceof TestFile) {
			// No need to watch this, updates will be triggered on file changes
			// either by the text document or file watcher.
			await data.updateFromDisk(ctrl, test);
		}
	};

	ctrl.resolveHandler = resolveHandler;

	guessWorkspaceFolder().then(folder => {
		if (!folder) {
			return;
		}

		const graph = new ImportGraph(
			folder.uri, async () => {
				await resolveHandler();
				return [...ctrl.items].map(([, item]) => item);
			}, uri => ctrl.items.get(uri.toString().toLowerCase()));
		ctrl.relatedCodeProvider = graph;

		if (context.storageUri) {
			context.subscriptions.push(new FailureTracker(context.storageUri.fsPath, folder.uri.fsPath));
		}

		context.subscriptions.push(fileChangedEmitter.event(e => graph.didChange(e.uri, e.removed)));
	});

	const createRunHandler = (
		runnerCtor: { new(folder: vscode.WorkspaceFolder): VSCodeTestRunner },
		kind: vscode.TestRunProfileKind,
		args: string[] = []
	) => {
		const doTestRun = async (
			req: vscode.TestRunRequest,
			cancellationToken: vscode.CancellationToken
		) => {
			const folder = await guessWorkspaceFolder();
			if (!folder) {
				return;
			}

			const runner = new runnerCtor(folder);
			const map = await getPendingTestMap(ctrl, req.include ?? gatherTestItems(ctrl.items));
			const task = ctrl.createTestRun(req);
			for (const test of map.values()) {
				task.enqueued(test);
			}

			let coverageDir: string | undefined;
			let currentArgs = args;
			if (kind === vscode.TestRunProfileKind.Coverage) {
				// todo: browser runs currently don't support per-test coverage
				if (args.includes('--browser')) {
					coverageDir = path.join(
						tmpdir(),
						`vscode-test-coverage-${randomBytes(8).toString('hex')}`
					);
					currentArgs = [
						...currentArgs,
						'--coverage',
						'--coveragePath',
						coverageDir,
						'--coverageFormats',
						'json',
					];
				} else {
					currentArgs = [...currentArgs, '--per-test-coverage'];
				}
			}

			return await scanTestOutput(
				map,
				task,
				kind === vscode.TestRunProfileKind.Debug
					? await runner.debug(task, currentArgs, req.include)
					: await runner.run(currentArgs, req.include),
				coverageDir,
				cancellationToken
			);
		};

		return async (req: vscode.TestRunRequest, cancellationToken: vscode.CancellationToken) => {
			if (!req.continuous) {
				return doTestRun(req, cancellationToken);
			}

			const queuedFiles = new Set<string>();
			let debounced: NodeJS.Timeout | undefined;

			const listener = fileChangedEmitter.event(({ uri, removed }) => {
				clearTimeout(debounced);

				if (req.include && !req.include.some(i => i.uri?.toString() === uri.toString())) {
					return;
				}

				if (removed) {
					queuedFiles.delete(uri.toString());
				} else {
					queuedFiles.add(uri.toString());
				}

				debounced = setTimeout(() => {
					const include =
						req.include?.filter(t => t.uri && queuedFiles.has(t.uri?.toString())) ??
						[...queuedFiles]
							.map(f => getOrCreateFile(ctrl, vscode.Uri.parse(f)))
							.filter((f): f is vscode.TestItem => !!f);
					queuedFiles.clear();

					doTestRun(
						new vscode.TestRunRequest(include, req.exclude, req.profile, true),
						cancellationToken
					);
				}, 1000);
			});

			cancellationToken.onCancellationRequested(() => {
				clearTimeout(debounced);
				listener.dispose();
			});
		};
	};

	ctrl.createRunProfile(
		'Run in Electron',
		vscode.TestRunProfileKind.Run,
		createRunHandler(PlatformTestRunner, vscode.TestRunProfileKind.Run),
		true,
		undefined,
		true
	);

	ctrl.createRunProfile(
		'Debug in Electron',
		vscode.TestRunProfileKind.Debug,
		createRunHandler(PlatformTestRunner, vscode.TestRunProfileKind.Debug),
		true,
		undefined,
		true
	);

	const coverage = ctrl.createRunProfile(
		'Coverage in Electron',
		vscode.TestRunProfileKind.Coverage,
		createRunHandler(PlatformTestRunner, vscode.TestRunProfileKind.Coverage),
		true,
		undefined,
		true
	);

	coverage.loadDetailedCoverage = async (_run, coverage) => coverage instanceof V8CoverageFile ? coverage.details : [];
	coverage.loadDetailedCoverageForTest = async (_run, coverage, test) => coverage instanceof V8CoverageFile ? coverage.testDetails(test) : [];

	for (const [name, arg] of browserArgs) {
		const cfg = ctrl.createRunProfile(
			`Run in ${name}`,
			vscode.TestRunProfileKind.Run,
			createRunHandler(BrowserTestRunner, vscode.TestRunProfileKind.Run, [' --browser', arg]),
			undefined,
			undefined,
			true
		);

		cfg.configureHandler = () => vscode.window.showInformationMessage(`Configuring ${name}`);

		ctrl.createRunProfile(
			`Debug in ${name}`,
			vscode.TestRunProfileKind.Debug,
			createRunHandler(BrowserTestRunner, vscode.TestRunProfileKind.Debug, [
				'--browser',
				arg,
				'--debug-browser',
			]),
			undefined,
			undefined,
			true
		);
	}

	function updateNodeForDocument(e: vscode.TextDocument) {
		const node = getOrCreateFile(ctrl, e.uri);
		const data = node && itemData.get(node);
		if (data instanceof TestFile) {
			data.updateFromContents(ctrl, e.getText(), node!);
		}
	}

	for (const document of vscode.workspace.textDocuments) {
		updateNodeForDocument(document);
	}

	context.subscriptions.push(
		ctrl,
		fileChangedEmitter.event(({ uri, removed }) => {
			if (!removed) {
				const node = getOrCreateFile(ctrl, uri);
				if (node) {
					ctrl.invalidateTestResults();
				}
			}
		}),
		vscode.workspace.onDidOpenTextDocument(updateNodeForDocument),
		vscode.workspace.onDidChangeTextDocument(e => updateNodeForDocument(e.document)),
		registerSnapshotUpdate(ctrl),
		new FailingDeepStrictEqualAssertFixer()
	);
}

export function deactivate() {
	// no-op
}

function getOrCreateFile(
	controller: vscode.TestController,
	uri: vscode.Uri
): vscode.TestItem | undefined {
	const folder = getWorkspaceFolderForTestFile(uri);
	if (!folder) {
		return undefined;
	}

	const data = new TestFile(uri, folder);
	const existing = controller.items.get(data.getId());
	if (existing) {
		return existing;
	}

	const file = controller.createTestItem(data.getId(), data.getLabel(), uri);
	controller.items.add(file);
	file.canResolveChildren = true;
	itemData.set(file, data);

	return file;
}

function gatherTestItems(collection: vscode.TestItemCollection) {
	const items: vscode.TestItem[] = [];
	collection.forEach(item => items.push(item));
	return items;
}

async function startWatchingWorkspace(
	controller: vscode.TestController,
	fileChangedEmitter: vscode.EventEmitter<FileChangeEvent>
) {
	const workspaceFolder = await guessWorkspaceFolder();
	if (!workspaceFolder) {
		return new vscode.Disposable(() => undefined);
	}

	const pattern = new vscode.RelativePattern(workspaceFolder, TEST_FILE_PATTERN);
	const watcher = vscode.workspace.createFileSystemWatcher(pattern);

	watcher.onDidCreate(uri => {
		getOrCreateFile(controller, uri);
		fileChangedEmitter.fire({ removed: false, uri });
	});
	watcher.onDidChange(uri => fileChangedEmitter.fire({ removed: false, uri }));
	watcher.onDidDelete(uri => {
		fileChangedEmitter.fire({ removed: true, uri });
		clearFileDiagnostics(uri);
		controller.items.delete(uri.toString());
	});

	for (const file of await vscode.workspace.findFiles(pattern)) {
		getOrCreateFile(controller, file);
	}

	return watcher;
}

async function getPendingTestMap(ctrl: vscode.TestController, tests: Iterable<vscode.TestItem>) {
	const queue = [tests];
	const titleMap = new Map<string, vscode.TestItem>();
	while (queue.length) {
		for (const item of queue.pop()!) {
			const data = itemData.get(item);
			if (data instanceof TestFile) {
				if (!data.hasBeenRead) {
					await data.updateFromDisk(ctrl, item);
				}
				queue.push(gatherTestItems(item.children));
			} else if (data instanceof TestCase) {
				titleMap.set(data.fullName, item);
			} else {
				queue.push(gatherTestItems(item.children));
			}
		}
	}

	return titleMap;
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-test-provider/src/failingDeepStrictEqualAssertFixer.ts]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-test-provider/src/failingDeepStrictEqualAssertFixer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as ts from 'typescript';
import {
	commands,
	Disposable,
	languages,
	Position,
	Range,
	TestMessage,
	TestResultSnapshot,
	TestRunResult,
	tests,
	TextDocument,
	Uri,
	workspace,
	WorkspaceEdit,
} from 'vscode';
import { memoizeLast } from './memoize';
import { getTestMessageMetadata } from './metadata';

const enum Constants {
	FixCommandId = 'selfhost-test.fix-test',
}

export class FailingDeepStrictEqualAssertFixer {
	private disposables: Disposable[] = [];

	constructor() {
		this.disposables.push(
			commands.registerCommand(Constants.FixCommandId, async (uri: Uri, position: Position) => {
				const document = await workspace.openTextDocument(uri);

				const failingAssertion = detectFailingDeepStrictEqualAssertion(document, position);
				if (!failingAssertion) {
					return;
				}

				const expectedValueNode = failingAssertion.assertion.expectedValue;
				if (!expectedValueNode) {
					return;
				}

				const start = document.positionAt(expectedValueNode.getStart());
				const end = document.positionAt(expectedValueNode.getEnd());

				const edit = new WorkspaceEdit();
				edit.replace(uri, new Range(start, end), formatJsonValue(failingAssertion.actualJSONValue));
				await workspace.applyEdit(edit);
			})
		);

		this.disposables.push(
			languages.registerCodeActionsProvider('typescript', {
				provideCodeActions: (document, range) => {
					const failingAssertion = detectFailingDeepStrictEqualAssertion(document, range.start);
					if (!failingAssertion) {
						return undefined;
					}

					return [
						{
							title: 'Fix Expected Value',
							command: Constants.FixCommandId,
							arguments: [document.uri, range.start],
						},
					];
				},
			})
		);
	}

	dispose() {
		for (const d of this.disposables) {
			d.dispose();
		}
	}
}

const identifierLikeRe = /^[$a-z_][a-z0-9_$]*$/i;

const tsPrinter = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

const formatJsonValue = (value: unknown) => {
	if (typeof value !== 'object') {
		return JSON.stringify(value, undefined, '\t');
	}

	const src = ts.createSourceFile('', `(${JSON.stringify(value, undefined, '\t')})`, ts.ScriptTarget.ES5, true);
	const outerExpression = src.statements[0] as ts.ExpressionStatement;
	const parenExpression = outerExpression.expression as ts.ParenthesizedExpression;

	const unquoted = ts.transform(parenExpression, [
		context => (node: ts.Node) => {
			const visitor = (node: ts.Node): ts.Node =>
				ts.isPropertyAssignment(node) &&
					ts.isStringLiteralLike(node.name) &&
					identifierLikeRe.test(node.name.text)
					? ts.factory.createPropertyAssignment(
						ts.factory.createIdentifier(node.name.text),
						ts.visitNode(node.initializer, visitor) as ts.Expression
					)
					: ts.isStringLiteralLike(node) && node.text === '[undefined]'
						? ts.factory.createIdentifier('undefined')
						: ts.visitEachChild(node, visitor, context);

			return ts.visitNode(node, visitor);
		},
	]);

	return tsPrinter.printNode(ts.EmitHint.Expression, unquoted.transformed[0], src);
};

/** Parses the source file, memoizing the last document so cursor moves are efficient */
const parseSourceFile = memoizeLast((text: string) =>
	ts.createSourceFile('', text, ts.ScriptTarget.ES5, true)
);

const assertionFailureMessageRe = /^Expected values to be strictly (deep-)?equal:/;

/** Gets information about the failing assertion at the poisition, if any. */
function detectFailingDeepStrictEqualAssertion(
	document: TextDocument,
	position: Position
): { assertion: StrictEqualAssertion; actualJSONValue: unknown } | undefined {
	const sf = parseSourceFile(document.getText());
	const offset = document.offsetAt(position);
	const assertion = StrictEqualAssertion.atPosition(sf, offset);
	if (!assertion) {
		return undefined;
	}

	const startLine = document.positionAt(assertion.offsetStart).line;
	const messages = getAllTestStatusMessagesAt(document.uri, startLine);
	const strictDeepEqualMessage = messages.find(m =>
		assertionFailureMessageRe.test(typeof m.message === 'string' ? m.message : m.message.value)
	);

	if (!strictDeepEqualMessage) {
		return undefined;
	}

	const metadata = getTestMessageMetadata(strictDeepEqualMessage);
	if (!metadata) {
		return undefined;
	}

	return {
		assertion: assertion,
		actualJSONValue: metadata.actualValue,
	};
}

class StrictEqualAssertion {
	/**
	 * Extracts the assertion at the current node, if it is one.
	 */
	public static fromNode(node: ts.Node): StrictEqualAssertion | undefined {
		if (!ts.isCallExpression(node)) {
			return undefined;
		}

		const expr = node.expression.getText();
		if (expr !== 'assert.deepStrictEqual' && expr !== 'assert.strictEqual') {
			return undefined;
		}

		return new StrictEqualAssertion(node);
	}

	/**
	 * Gets the equals assertion at the given offset in the file.
	 */
	public static atPosition(sf: ts.SourceFile, offset: number): StrictEqualAssertion | undefined {
		let node = findNodeAt(sf, offset);

		while (node.parent) {
			const obj = StrictEqualAssertion.fromNode(node);
			if (obj) {
				return obj;
			}
			node = node.parent;
		}

		return undefined;
	}

	constructor(private readonly expression: ts.CallExpression) { }

	/** Gets the expected value */
	public get expectedValue(): ts.Expression | undefined {
		return this.expression.arguments[1];
	}

	/** Gets the position of the assertion expression. */
	public get offsetStart(): number {
		return this.expression.getStart();
	}
}

function findNodeAt(parent: ts.Node, offset: number): ts.Node {
	for (const child of parent.getChildren()) {
		if (child.getStart() <= offset && offset <= child.getEnd()) {
			return findNodeAt(child, offset);
		}
	}
	return parent;
}

function getAllTestStatusMessagesAt(uri: Uri, lineNumber: number): TestMessage[] {
	if (tests.testResults.length === 0) {
		return [];
	}

	const run = tests.testResults[0];
	const snapshots = getTestResultsWithUri(run, uri);
	const result: TestMessage[] = [];

	for (const snapshot of snapshots) {
		for (const m of snapshot.taskStates[0].messages) {
			if (
				m.location &&
				m.location.range.start.line <= lineNumber &&
				lineNumber <= m.location.range.end.line
			) {
				result.push(m);
			}
		}
	}

	return result;
}

function getTestResultsWithUri(testRun: TestRunResult, uri: Uri): TestResultSnapshot[] {
	const results: TestResultSnapshot[] = [];

	const walk = (r: TestResultSnapshot) => {
		for (const c of r.children) {
			walk(c);
		}
		if (r.uri?.toString() === uri.toString()) {
			results.push(r);
		}
	};

	for (const r of testRun.results) {
		walk(r);
	}

	return results;
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-test-provider/src/failureTracker.ts]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-test-provider/src/failureTracker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { spawn } from 'child_process';
import { existsSync, mkdirSync, renameSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import * as vscode from 'vscode';

interface IGitState {
	commitId: string;
	tracked: string;
	untracked: Record<string, string>;
}

interface ITrackedRemediation {
	snapshot: vscode.TestResultSnapshot;
	failing: IGitState;
	passing: IGitState;
}

const MAX_FAILURES = 10;

export class FailureTracker {
	private readonly disposables: vscode.Disposable[] = [];
	private readonly lastFailed = new Map<
		string,
		{ snapshot: vscode.TestResultSnapshot; failing: IGitState }
	>();

	private readonly logFile: string;
	private logs?: ITrackedRemediation[];

	constructor(storageLocation: string, private readonly rootDir: string) {
		this.logFile = join(storageLocation, '.build/vscode-test-failures.json');
		mkdirSync(dirname(this.logFile), { recursive: true });

		const oldLogFile = join(rootDir, '.build/vscode-test-failures.json');
		if (existsSync(oldLogFile)) {
			try {
				renameSync(oldLogFile, this.logFile);
			} catch {
				// ignore
			}
		}

		this.disposables.push(
			vscode.commands.registerCommand('selfhost-test-provider.openFailureLog', async () => {
				const doc = await vscode.workspace.openTextDocument(this.logFile);
				await vscode.window.showTextDocument(doc);
			})
		);

		this.disposables.push(
			vscode.tests.onDidChangeTestResults(() => {
				const last = vscode.tests.testResults[0];
				if (!last) {
					return;
				}

				let gitState: Promise<IGitState> | undefined;
				const getGitState = () => gitState ?? (gitState = this.captureGitState());

				const queue = [last.results];
				for (let i = 0; i < queue.length; i++) {
					for (const snapshot of queue[i]) {
						// only interested in states of leaf tests
						if (snapshot.children.length) {
							queue.push(snapshot.children);
							continue;
						}

						const key = `${snapshot.uri}/${snapshot.id}`;
						const prev = this.lastFailed.get(key);
						if (snapshot.taskStates.some(s => s.state === vscode.TestResultState.Failed)) {
							// unset the parent to avoid a circular JSON structure:
							getGitState().then(s =>
								this.lastFailed.set(key, {
									snapshot: { ...snapshot, parent: undefined },
									failing: s,
								})
							);
						} else if (prev) {
							this.lastFailed.delete(key);
							getGitState().then(s => this.append({ ...prev, passing: s }));
						}
					}
				}
			})
		);
	}

	private async append(log: ITrackedRemediation) {
		if (!this.logs) {
			try {
				this.logs = JSON.parse(await readFile(this.logFile, 'utf-8'));
			} catch {
				this.logs = [];
			}
		}

		const logs = this.logs!;
		logs.push(log);
		if (logs.length > MAX_FAILURES) {
			logs.splice(0, logs.length - MAX_FAILURES);
		}

		await writeFile(this.logFile, JSON.stringify(logs, undefined, 2));
	}

	private async captureGitState() {
		const [commitId, tracked, untracked] = await Promise.all([
			this.exec('git', ['rev-parse', 'HEAD']),
			this.exec('git', ['diff', 'HEAD']),
			this.exec('git', ['ls-files', '--others', '--exclude-standard']).then(async output => {
				const mapping: Record<string, string> = {};
				await Promise.all(
					output
						.trim()
						.split('\n')
						.map(async f => {
							mapping[f] = await readFile(join(this.rootDir, f), 'utf-8');
						})
				);
				return mapping;
			}),
		]);
		return { commitId, tracked, untracked };
	}

	public dispose() {
		this.disposables.forEach(d => d.dispose());
	}

	private exec(command: string, args: string[]): Promise<string> {
		return new Promise((resolve, reject) => {
			const child = spawn(command, args, { stdio: 'pipe', cwd: this.rootDir });
			let output = '';
			child.stdout.setEncoding('utf-8').on('data', b => (output += b));
			child.stderr.setEncoding('utf-8').on('data', b => (output += b));
			child.on('error', reject);
			child.on('exit', code =>
				code === 0
					? resolve(output)
					: reject(new Error(`Failed with error code ${code}\n${output}`))
			);
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-test-provider/src/importGraph.ts]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-test-provider/src/importGraph.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { join } from 'path';
import * as vscode from 'vscode';
import { bulkhead } from 'cockatiel';
import { promises as fs } from 'fs';

const maxInt32 = 2 ** 31 - 1;

// limit concurrency to avoid overwhelming the filesystem during discovery
const discoverLimiter = bulkhead(8, Infinity);

// Max import distance when listing related code to improve relevancy.
const defaultMaxDistance = 3;

/**
 * Maintains a graph of imports in the codebase. This works lazily resolving
 * imports and re-parsing files only on request.
 *
 * This is a rough, file-level graph derived from simple regex matching on
 * source files to avoid having to parse the AST of every file in the codebase,
 * which is possible but more intensive. (See: all the years of work from the
 * TS language server.)
 *
 * A more advanced implementation could use references from the language server.
 */
export class ImportGraph implements vscode.TestRelatedCodeProvider {
	private graph = new Map<string, FileNode>();

	constructor(
		private readonly root: vscode.Uri,
		private readonly discoverWorkspaceTests: () => Thenable<vscode.TestItem[]>,
		private readonly getTestNodeForDoc: (uri: vscode.Uri) => vscode.TestItem | undefined,
	) { }

	/** @inheritdoc */
	public async provideRelatedCode(test: vscode.TestItem, token: vscode.CancellationToken): Promise<vscode.Location[]> {
		// this is kind of a stub for this implementation. Naive following imports
		// isn't that useful for finding a test's related code.
		const node = await this.discoverOutwards(test.uri, new Set(), defaultMaxDistance, token);
		if (!node) {
			return [];
		}

		const imports = new Set<string>();
		const queue = [{ distance: 0, next: node.imports }];
		while (queue.length) {
			const { distance, next } = queue.shift()!;
			for (const imp of next) {
				if (imports.has(imp.path)) {
					continue;
				}

				imports.add(imp.path);
				if (distance < defaultMaxDistance) {
					queue.push({ next: imp.imports, distance: distance + 1 });
				}
			}
		}

		return [...imports].map(importPath =>
			new vscode.Location(
				vscode.Uri.file(join(this.root.fsPath, 'src', `${importPath}.ts`)),
				new vscode.Range(0, 0, maxInt32, 0),
			),
		);
	}

	/** @inheritdoc */
	public async provideRelatedTests(document: vscode.TextDocument, _position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.TestItem[]> {
		// Expand all known tests to ensure imports of this file are realized.
		const rootTests = await this.discoverWorkspaceTests();
		const seen = new Set<string>();
		await Promise.all(rootTests.map(v => v.uri && this.discoverOutwards(v.uri, seen, defaultMaxDistance, token)));

		const node = this.getNode(document.uri);
		if (!node) {
			return [];
		}

		const tests: vscode.TestItem[] = [];
		const queue: { next: FileNode; distance: number }[] = [{ next: node, distance: 0 }];
		const visited = new Set<FileNode>();
		let maxDistance = Infinity;

		while (queue.length) {
			const { next, distance } = queue.shift()!;
			if (visited.has(next)) {
				continue;
			}

			visited.add(next);
			const testForDoc = this.getTestNodeForDoc(next.uri);
			if (testForDoc) {
				tests.push(testForDoc);
				// only look for tests half again as far away as the closest test to keep things relevant
				if (!Number.isFinite(maxDistance)) {
					maxDistance = distance * 3 / 2;
				}
			}

			if (distance < maxDistance) {
				for (const importedByNode of next.importedBy) {
					queue.push({ next: importedByNode, distance: distance + 1 });
				}
			}
		}

		return tests;
	}

	public didChange(uri: vscode.Uri, deleted: boolean) {
		const rel = this.uriToImportPath(uri);
		const node = rel && this.graph.get(rel);
		if (!node) {
			return;
		}

		if (deleted) {
			this.graph.delete(rel);
			for (const imp of node.imports) {
				imp.importedBy.delete(node);
			}
		} else {
			node.isSynced = false;
		}
	}

	private getNode(uri: vscode.Uri | undefined): FileNode | undefined {
		const rel = this.uriToImportPath(uri);
		return rel ? this.graph.get(rel) : undefined;
	}

	/** Discover all nodes that import the file */
	private async discoverOutwards(uri: vscode.Uri | undefined, seen: Set<string>, maxDistance: number, token: vscode.CancellationToken): Promise<FileNode | undefined> {
		const rel = this.uriToImportPath(uri);
		if (!rel) {
			return undefined;
		}

		let node = this.graph.get(rel);
		if (!node) {
			node = new FileNode(uri!, rel);
			this.graph.set(rel, node);
		}

		await this.discoverOutwardsInner(node, seen, maxDistance, token);
		return node;
	}

	private async discoverOutwardsInner(node: FileNode, seen: Set<string>, maxDistance: number, token: vscode.CancellationToken) {
		if (seen.has(node.path) || maxDistance === 0) {
			return;
		}

		seen.add(node.path);
		if (node.isSynced === false) {
			await this.syncNode(node);
		} else if (node.isSynced instanceof Promise) {
			await node.isSynced;
		}

		if (token.isCancellationRequested) {
			return;
		}
		await Promise.all([...node.imports].map(i => this.discoverOutwardsInner(i, seen, maxDistance - 1, token)));
	}

	private async syncNode(node: FileNode) {
		node.isSynced = discoverLimiter.execute(async () => {
			const doc = vscode.workspace.textDocuments.find(d => d.uri.toString() === node.uri.toString());

			let text: string;
			if (doc) {
				text = doc.getText();
			} else {
				try {
					text = await fs.readFile(node.uri.fsPath, 'utf8');
				} catch {
					text = '';
				}
			}

			for (const imp of node.imports) {
				imp.importedBy.delete(node);
			}
			node.imports.clear();

			for (const [, importPath] of text.matchAll(IMPORT_RE)) {
				let imp = this.graph.get(importPath);
				if (!imp) {
					imp = new FileNode(this.importPathToUri(importPath), importPath);
					this.graph.set(importPath, imp);
				}

				imp.importedBy.add(node);
				node.imports.add(imp);
			}

			node.isSynced = true;
		});

		await node.isSynced;
	}

	private uriToImportPath(uri: vscode.Uri | undefined) {
		if (!uri) {
			return undefined;
		}

		const relativePath = vscode.workspace.asRelativePath(uri).replaceAll('\\', '/');
		if (!relativePath.startsWith('src/vs/') || !relativePath.endsWith('.ts')) {
			return undefined;
		}

		return relativePath.slice('src/'.length, -'.ts'.length);
	}

	private importPathToUri(importPath: string) {
		return vscode.Uri.file(join(this.root.fsPath, 'src', `${importPath}.ts`));
	}
}

const IMPORT_RE = /import .*? from ["'](vs\/[^"']+)/g;

class FileNode {
	public imports = new Set<FileNode>();
	public importedBy = new Set<FileNode>();
	public isSynced: boolean | Promise<void> = false;

	// Path is the *import path* starting with `vs/`
	constructor(
		public readonly uri: vscode.Uri,
		public readonly path: string,
	) { }
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-test-provider/src/memoize.ts]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-test-provider/src/memoize.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const memoizeLast = <A, T>(fn: (args: A) => T): ((args: A) => T) => {
	let last: { arg: A; result: T } | undefined;
	return arg => {
		if (last && last.arg === arg) {
			return last.result;
		}

		const result = fn(arg);
		last = { arg, result };
		return result;
	};
};
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-test-provider/src/metadata.ts]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-test-provider/src/metadata.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { TestMessage } from 'vscode';

export interface TestMessageMetadata {
	expectedValue: unknown;
	actualValue: unknown;
}

const cache = new Array<{ id: string; metadata: TestMessageMetadata }>();

let id = 0;

function getId(): string {
	return `msg:${id++}:`;
}

const regexp = /msg:\d+:/;

export function attachTestMessageMetadata(
	message: TestMessage,
	metadata: TestMessageMetadata
): void {
	const existingMetadata = getTestMessageMetadata(message);
	if (existingMetadata) {
		Object.assign(existingMetadata, metadata);
		return;
	}

	const id = getId();

	if (typeof message.message === 'string') {
		message.message = `${message.message}\n${id}`;
	} else {
		message.message.appendText(`\n${id}`);
	}

	cache.push({ id, metadata });
	while (cache.length > 100) {
		cache.shift();
	}
}

export function getTestMessageMetadata(message: TestMessage): TestMessageMetadata | undefined {
	let value: string;
	if (typeof message.message === 'string') {
		value = message.message;
	} else {
		value = message.message.value;
	}

	const result = regexp.exec(value);
	if (!result) {
		return undefined;
	}

	const id = result[0];
	return cache.find(c => c.id === id)?.metadata;
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-test-provider/src/snapshot.ts]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-test-provider/src/snapshot.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { promises as fs } from 'fs';
import * as vscode from 'vscode';

export const snapshotComment = '\n\n// Snapshot file: ';

export const registerSnapshotUpdate = (ctrl: vscode.TestController) =>
	vscode.commands.registerCommand('selfhost-test-provider.updateSnapshot', async args => {
		const message: vscode.TestMessage = args.message;
		const index = message.expectedOutput?.indexOf(snapshotComment);
		if (!message.expectedOutput || !message.actualOutput || !index || index === -1) {
			vscode.window.showErrorMessage('Could not find snapshot comment in message');
			return;
		}

		const file = message.expectedOutput.slice(index + snapshotComment.length);
		await fs.writeFile(file, message.actualOutput);
		ctrl.invalidateTestResults(args.test);
	});
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-test-provider/src/sourceUtils.ts]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-test-provider/src/sourceUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as ts from 'typescript';
import * as vscode from 'vscode';
import { TestCase, TestConstruct, TestSuite, VSCodeTest } from './testTree';

const suiteNames = new Set(['suite', 'flakySuite']);
const testNames = new Set(['test']);

export const enum Action {
	Skip,
	Recurse,
}

export const extractTestFromNode = (src: ts.SourceFile, node: ts.Node, parent: VSCodeTest) => {
	if (!ts.isCallExpression(node)) {
		return Action.Recurse;
	}

	const asSuite = identifyCall(node.expression, suiteNames);
	const asTest = identifyCall(node.expression, testNames);
	const either = asSuite || asTest;
	if (either === IdentifiedCall.Skipped) {
		return Action.Skip;
	}
	if (either === IdentifiedCall.Nothing) {
		return Action.Recurse;
	}

	const name = node.arguments[0];
	const func = node.arguments[1];
	if (!name || !ts.isStringLiteralLike(name) || !func) {
		return Action.Recurse;
	}

	const start = src.getLineAndCharacterOfPosition(name.pos);
	const end = src.getLineAndCharacterOfPosition(func.end);
	const range = new vscode.Range(
		new vscode.Position(start.line, start.character),
		new vscode.Position(end.line, end.character)
	);

	const cparent = parent instanceof TestConstruct ? parent : undefined;

	// we know this is either a suite or a test because we checked for skipped/nothing above

	if (asTest) {
		return new TestCase(name.text, range, cparent);
	}

	if (asSuite) {
		return new TestSuite(name.text, range, cparent);
	}

	throw new Error('unreachable');
};

const enum IdentifiedCall {
	Nothing,
	Skipped,
	IsThing,
}

const identifyCall = (lhs: ts.Node, needles: ReadonlySet<string>): IdentifiedCall => {
	if (ts.isIdentifier(lhs)) {
		return needles.has(lhs.escapedText || lhs.text) ? IdentifiedCall.IsThing : IdentifiedCall.Nothing;
	}

	if (isPropertyCall(lhs) && lhs.name.text === 'skip') {
		return needles.has(lhs.expression.text) ? IdentifiedCall.Skipped : IdentifiedCall.Nothing;
	}

	if (ts.isParenthesizedExpression(lhs) && ts.isConditionalExpression(lhs.expression)) {
		return Math.max(identifyCall(lhs.expression.whenTrue, needles), identifyCall(lhs.expression.whenFalse, needles));
	}

	return IdentifiedCall.Nothing;
};

const isPropertyCall = (
	lhs: ts.Node
): lhs is ts.PropertyAccessExpression & { expression: ts.Identifier; name: ts.Identifier } =>
	ts.isPropertyAccessExpression(lhs) &&
	ts.isIdentifier(lhs.expression) &&
	ts.isIdentifier(lhs.name);
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-test-provider/src/stackTraceParser.ts]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-test-provider/src/stackTraceParser.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Copied from https://github.com/microsoft/vscode-js-debug/blob/1d104b5184736677ab5cc280c70bbd227403850c/src/common/stackTraceParser.ts#L18

// Either match lines like
// "    at fulfilled (/Users/roblou/code/testapp-node2/out/app.js:5:58)"
// or
// "    at /Users/roblou/code/testapp-node2/out/app.js:60:23"
// and replace the path in them
const re1 = /^(\W*at .*\()(.*):(\d+):(\d+)(\))$/;
const re2 = /^(\W*at )(.*):(\d+):(\d+)$/;

const getLabelRe = /^\W*at (.*) \($/;

/**
 * Parses a textual stack trace.
 */
export class StackTraceParser {
    /** Gets whether the stacktrace has any locations in it. */
    public static isStackLike(str: string) {
        return re1.test(str) || re2.test(str);
    }
    constructor(private readonly stack: string) { }

    /** Iterates over segments of text and locations in the stack. */
    *[Symbol.iterator]() {
        for (const line of this.stack.split('\n')) {
            const match = re1.exec(line) || re2.exec(line);
            if (!match) {
                yield line + '\n';
                continue;
            }

            const [, prefix, url, lineNo, columnNo, suffix] = match;
            if (prefix) {
                yield prefix;
            }

            yield new StackTraceLocation(getLabelRe.exec(prefix)?.[1], url, Number(lineNo), Number(columnNo));

            if (suffix) {
                yield suffix;
            }

            yield '\n';
        }
    }
}

export class StackTraceLocation {
    constructor(
        public readonly label: string | undefined,
        public readonly path: string,
        public readonly lineBase1: number,
        public readonly columnBase1: number,
    ) { }
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-test-provider/src/streamSplitter.ts]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-test-provider/src/streamSplitter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// DO NOT EDIT DIRECTLY: copied from src/vs/base/node/nodeStreams.ts

import { Transform } from 'stream';

/**
 * A Transform stream that splits the input on the "splitter" substring.
 * The resulting chunks will contain (and trail with) the splitter match.
 * The last chunk when the stream ends will be emitted even if a splitter
 * is not encountered.
 */
export class StreamSplitter extends Transform {
	private buffer: Buffer | undefined;
	private readonly splitter: number;
	private readonly spitterLen: number;

	constructor(splitter: string | number | Buffer) {
		super();
		if (typeof splitter === 'number') {
			this.splitter = splitter;
			this.spitterLen = 1;
		} else {
			throw new Error('not implemented here');
		}
	}

	override _transform(
		chunk: Buffer,
		_encoding: string,
		callback: (error?: Error | null, data?: any) => void
	): void {
		if (!this.buffer) {
			this.buffer = chunk;
		} else {
			this.buffer = Buffer.concat([this.buffer, chunk]);
		}

		let offset = 0;
		while (offset < this.buffer.length) {
			const index = this.buffer.indexOf(this.splitter, offset);
			if (index === -1) {
				break;
			}

			this.push(this.buffer.slice(offset, index + this.spitterLen));
			offset = index + this.spitterLen;
		}

		this.buffer = offset === this.buffer.length ? undefined : this.buffer.slice(offset);
		callback();
	}

	override _flush(callback: (error?: Error | null, data?: any) => void): void {
		if (this.buffer) {
			this.push(this.buffer);
		}

		callback();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-test-provider/src/testOutputScanner.ts]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-test-provider/src/testOutputScanner.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
	decodedMappings,
	GREATEST_LOWER_BOUND,
	LEAST_UPPER_BOUND,
	originalPositionFor,
	TraceMap,
} from '@jridgewell/trace-mapping';
import * as styles from 'ansi-styles';
import { ChildProcessWithoutNullStreams } from 'child_process';
import * as vscode from 'vscode';
import { istanbulCoverageContext, PerTestCoverageTracker } from './coverageProvider';
import { attachTestMessageMetadata } from './metadata';
import { snapshotComment } from './snapshot';
import { StackTraceLocation, StackTraceParser } from './stackTraceParser';
import { StreamSplitter } from './streamSplitter';
import { getContentFromFilesystem } from './testTree';
import { IScriptCoverage } from './v8CoverageWrangling';

export const enum MochaEvent {
	Start = 'start',
	TestStart = 'testStart',
	Pass = 'pass',
	Fail = 'fail',
	End = 'end',

	// custom events:
	CoverageInit = 'coverageInit',
	CoverageIncrement = 'coverageIncrement',
}

export interface IStartEvent {
	total: number;
}

export interface ITestStartEvent {
	title: string;
	fullTitle: string;
	file: string;
	currentRetry: number;
	speed: string;
}

export interface IPassEvent extends ITestStartEvent {
	duration: number;
}

export interface IFailEvent extends IPassEvent {
	err: string;
	stack: string | null;
	expected?: string;
	actual?: string;
	expectedJSON?: unknown;
	actualJSON?: unknown;
	snapshotPath?: string;
}

export interface IEndEvent {
	suites: number;
	tests: number;
	passes: number;
	pending: number;
	failures: number;
	start: string /* ISO date */;
	end: string /* ISO date */;
}

export interface ITestCoverageCoverage {
	file: string;
	fullTitle: string;
	coverage: { result: IScriptCoverage[] };
}

export type MochaEventTuple =
	| [MochaEvent.Start, IStartEvent]
	| [MochaEvent.TestStart, ITestStartEvent]
	| [MochaEvent.Pass, IPassEvent]
	| [MochaEvent.Fail, IFailEvent]
	| [MochaEvent.End, IEndEvent]
	| [MochaEvent.CoverageInit, { result: IScriptCoverage[] }]
	| [MochaEvent.CoverageIncrement, ITestCoverageCoverage];

const LF = '\n'.charCodeAt(0);

export class TestOutputScanner implements vscode.Disposable {
	protected mochaEventEmitter = new vscode.EventEmitter<MochaEventTuple>();
	protected outputEventEmitter = new vscode.EventEmitter<string>();
	protected onExitEmitter = new vscode.EventEmitter<string | undefined>();

	/**
	 * Fired when a mocha event comes in.
	 */
	public readonly onMochaEvent = this.mochaEventEmitter.event;

	/**
	 * Fired when other output from the process comes in.
	 */
	public readonly onOtherOutput = this.outputEventEmitter.event;

	/**
	 * Fired when the process encounters an error, or exits.
	 */
	public readonly onRunnerExit = this.onExitEmitter.event;

	constructor(private readonly process: ChildProcessWithoutNullStreams, private args?: string[]) {
		process.stdout.pipe(new StreamSplitter(LF)).on('data', this.processData);
		process.stderr.pipe(new StreamSplitter(LF)).on('data', this.processData);
		process.on('error', e => this.onExitEmitter.fire(e.message));
		process.on('exit', code =>
			this.onExitEmitter.fire(code ? `Test process exited with code ${code}` : undefined)
		);
	}

	/**
	 * @override
	 */
	public dispose() {
		try {
			this.process.kill();
		} catch {
			// ignored
		}
	}

	protected readonly processData = (data: string | Buffer) => {
		if (this.args) {
			this.outputEventEmitter.fire(`./scripts/test ${this.args.join(' ')}`);
			this.args = undefined;
		}

		data = data.toString();

		try {
			const parsed = JSON.parse(data.trim()) as unknown;
			if (parsed instanceof Array && parsed.length === 2 && typeof parsed[0] === 'string') {
				this.mochaEventEmitter.fire(parsed as MochaEventTuple);
			} else {
				this.outputEventEmitter.fire(data);
			}
		} catch {
			this.outputEventEmitter.fire(data);
		}
	};
}

type QueuedOutput = string | [string, vscode.Location | undefined, vscode.TestItem | undefined];

export async function scanTestOutput(
	tests: Map<string, vscode.TestItem>,
	task: vscode.TestRun,
	scanner: TestOutputScanner,
	coverageDir: string | undefined,
	cancellation: vscode.CancellationToken
): Promise<void> {
	const exitBlockers: Set<Promise<unknown>> = new Set();
	const skippedTests = new Set(tests.values());
	const store = new SourceMapStore();
	let outputQueue = Promise.resolve();
	const enqueueOutput = (fn: QueuedOutput | (() => Promise<QueuedOutput>)) => {
		exitBlockers.delete(outputQueue);
		outputQueue = outputQueue.finally(async () => {
			const r = typeof fn === 'function' ? await fn() : fn;
			typeof r === 'string' ? task.appendOutput(r) : task.appendOutput(...r);
		});
		exitBlockers.add(outputQueue);
		return outputQueue;
	};
	const enqueueExitBlocker = <T>(prom: Promise<T>): Promise<T> => {
		exitBlockers.add(prom);
		prom.finally(() => exitBlockers.delete(prom));
		return prom;
	};

	let perTestCoverage: PerTestCoverageTracker | undefined;
	let lastTest: vscode.TestItem | undefined;
	let ranAnyTest = false;

	try {
		if (cancellation.isCancellationRequested) {
			return;
		}

		await new Promise<void>(resolve => {
			cancellation.onCancellationRequested(() => {
				resolve();
			});

			let currentTest: vscode.TestItem | undefined;

			scanner.onRunnerExit(err => {
				if (err) {
					enqueueOutput(err + crlf);
				}
				resolve();
			});

			scanner.onOtherOutput(str => {
				const match = spdlogRe.exec(str);
				if (!match) {
					enqueueOutput(str + crlf);
					return;
				}

				const logLocation = store.getSourceLocation(match[2], Number(match[3]) - 1);
				const logContents = replaceAllLocations(store, match[1]);
				const test = currentTest;

				enqueueOutput(() =>
					Promise.all([logLocation, logContents]).then(([location, contents]) => [
						contents + crlf,
						location,
						test,
					])
				);
			});

			scanner.onMochaEvent(evt => {
				switch (evt[0]) {
					case MochaEvent.Start:
						break; // no-op
					case MochaEvent.TestStart:
						currentTest = tests.get(evt[1].fullTitle);
						if (!currentTest) {
							console.warn(`Could not find test ${evt[1].fullTitle}`);
							return;
						}
						skippedTests.delete(currentTest);
						task.started(currentTest);
						ranAnyTest = true;
						break;
					case MochaEvent.Pass:
						{
							const title = evt[1].fullTitle;
							const tcase = tests.get(title);
							enqueueOutput(` ${styles.green.open}√${styles.green.close} ${title}\r\n`);
							if (tcase) {
								lastTest = tcase;
								task.passed(tcase, evt[1].duration);
							}
						}
						break;
					case MochaEvent.Fail:
						{
							const {
								err,
								stack,
								duration,
								expected,
								expectedJSON,
								actual,
								actualJSON,
								snapshotPath,
								fullTitle: id,
							} = evt[1];
							let tcase = tests.get(id);
							// report failures on hook to the last-seen test, or first test if none run yet
							if (!tcase && (id.includes('hook for') || id.includes('hook in'))) {
								tcase = lastTest ?? tests.values().next().value;
							}

							enqueueOutput(`${styles.red.open} x ${id}${styles.red.close}\r\n`);
							const rawErr = stack || err;
							const locationsReplaced = replaceAllLocations(store, forceCRLF(rawErr));
							if (rawErr) {
								enqueueOutput(async () => [await locationsReplaced, undefined, tcase]);
							}

							if (!tcase) {
								return;
							}

							const hasDiff =
								actual !== undefined &&
								expected !== undefined &&
								(expected !== '[undefined]' || actual !== '[undefined]');
							const testFirstLine =
								tcase.range &&
								new vscode.Location(
									tcase.uri!,
									new vscode.Range(
										tcase.range.start,
										new vscode.Position(tcase.range.start.line, 100)
									)
								);

							enqueueExitBlocker(
								(async () => {
									const stackInfo = await deriveStackLocations(store, rawErr, tcase!);
									let message: vscode.TestMessage;

									if (hasDiff) {
										message = new vscode.TestMessage(tryMakeMarkdown(err));
										message.actualOutput = outputToString(actual);
										message.expectedOutput = outputToString(expected);
										if (snapshotPath) {
											message.contextValue = 'isSelfhostSnapshotMessage';
											message.expectedOutput += snapshotComment + snapshotPath;
										}

										attachTestMessageMetadata(message, {
											expectedValue: expectedJSON,
											actualValue: actualJSON,
										});
									} else {
										message = new vscode.TestMessage(
											stack ? await sourcemapStack(store, stack) : await locationsReplaced
										);
									}

									message.location = stackInfo.primary ?? testFirstLine;
									message.stackTrace = stackInfo.stack;
									task.failed(tcase!, message, duration);
								})()
							);
						}
						break;
					case MochaEvent.End:
						// no-op, we wait until the process exits to ensure coverage is written out
						break;
					case MochaEvent.CoverageInit:
						perTestCoverage ??= new PerTestCoverageTracker(store);
						for (const result of evt[1].result) {
							perTestCoverage.add(result);
						}
						break;
					case MochaEvent.CoverageIncrement: {
						const { fullTitle, coverage } = evt[1];
						const tcase = tests.get(fullTitle);
						if (tcase) {
							perTestCoverage ??= new PerTestCoverageTracker(store);
							for (const result of coverage.result) {
								perTestCoverage.add(result, tcase);
							}
						}
						break;
					}
				}
			});
		});

		if (perTestCoverage) {
			enqueueExitBlocker(perTestCoverage.report(task));
		}

		await Promise.all([...exitBlockers]);

		if (coverageDir) {
			try {
				await istanbulCoverageContext.apply(task, coverageDir, {
					mapFileUri: uri => store.getSourceFile(uri.toString()),
					mapLocation: (uri, position) =>
						store.getSourceLocation(uri.toString(), position.line, position.character),
				});
			} catch (e) {
				const msg = `Error loading coverage:\n\n${e}\n`;
				task.appendOutput(msg.replace(/\n/g, crlf));
			}
		}

		// no tests? Possible crash, show output:
		if (!ranAnyTest) {
			await vscode.commands.executeCommand('testing.showMostRecentOutput');
		}
	} catch (e) {
		task.appendOutput((e as Error).stack || (e as Error).message);
	} finally {
		scanner.dispose();
		for (const test of skippedTests) {
			task.skipped(test);
		}
		task.end();
	}
}

const spdlogRe = /"(.+)", source: (file:\/\/\/.*?)+ \(([0-9]+)\)/;
const crlf = '\r\n';

const forceCRLF = (str: string) => str.replace(/(?<!\r)\n/gm, '\r\n');

const sourcemapStack = async (store: SourceMapStore, str: string) => {
	locationRe.lastIndex = 0;

	const replacements = await Promise.all(
		[...str.matchAll(locationRe)].map(async match => {
			const location = await deriveSourceLocation(store, match);
			if (!location) {
				return;
			}
			return {
				from: match[0],
				to: location?.uri.with({
					fragment: `L${location.range.start.line + 1}:${location.range.start.character + 1}`,
				}),
			};
		})
	);

	for (const replacement of replacements) {
		if (replacement) {
			str = str.replace(replacement.from, replacement.to.toString(true));
		}
	}

	return str;
};

const outputToString = (output: unknown) =>
	typeof output === 'object' ? JSON.stringify(output, null, 2) : String(output);

const tryMakeMarkdown = (message: string) => {
	const lines = message.split('\n');
	const start = lines.findIndex(l => l.includes('+ actual'));
	if (start === -1) {
		return message;
	}

	lines.splice(start, 1, '```diff');
	lines.push('```');
	return new vscode.MarkdownString(lines.join('\n'));
};

const inlineSourcemapRe = /^\/\/# sourceMappingURL=data:application\/json;base64,(.+)/m;
const sourceMapBiases = [GREATEST_LOWER_BOUND, LEAST_UPPER_BOUND] as const;

export const enum SearchStrategy {
	FirstBefore = -1,
	FirstAfter = 1,
}

export type SourceLocationMapper = (line: number, col: number, strategy: SearchStrategy) => vscode.Location | undefined;

export class SourceMapStore {
	private readonly cache = new Map</* file uri */ string, Promise<TraceMap | undefined>>();

	async getSourceLocationMapper(fileUri: string): Promise<SourceLocationMapper> {
		const sourceMap = await this.loadSourceMap(fileUri);
		return (line, col, strategy) => {
			if (!sourceMap) {
				return undefined;
			}

			// 1. Look for the ideal position on this line if it exists
			const idealPosition = originalPositionFor(sourceMap, { column: col, line: line + 1, bias: SearchStrategy.FirstAfter ? GREATEST_LOWER_BOUND : LEAST_UPPER_BOUND });
			if (idealPosition.line !== null && idealPosition.column !== null && idealPosition.source !== null) {
				return new vscode.Location(
					this.completeSourceMapUrl(sourceMap, idealPosition.source),
					new vscode.Position(idealPosition.line - 1, idealPosition.column)
				);
			}

			// Otherwise get the first/last valid mapping on another line.
			const decoded = decodedMappings(sourceMap);
			const enum MapField {
				COLUMN = 0,
				SOURCES_INDEX = 1,
				SOURCE_LINE = 2,
				SOURCE_COLUMN = 3,
			}

			do {
				line += strategy;
				const segments = decoded[line];
				if (!segments?.length) {
					continue;
				}

				const index = strategy === SearchStrategy.FirstBefore
					? findLastIndex(segments, s => s.length !== 1)
					: segments.findIndex(s => s.length !== 1);
				const segment = segments[index];

				if (!segment || segment.length === 1) {
					continue;
				}

				return new vscode.Location(
					this.completeSourceMapUrl(sourceMap, sourceMap.sources[segment[MapField.SOURCES_INDEX]]!),
					new vscode.Position(segment[MapField.SOURCE_LINE] - 1, segment[MapField.SOURCE_COLUMN])
				);
			} while (strategy === SearchStrategy.FirstBefore ? line > 0 : line < decoded.length);

			return undefined;
		};
	}

	/** Gets an original location from a base 0 line and column */
	async getSourceLocation(fileUri: string, line: number, col = 0) {
		const sourceMap = await this.loadSourceMap(fileUri);
		if (!sourceMap) {
			return undefined;
		}

		let smLine = line + 1;

		// if the range is after the end of mappings, adjust it to the last mapped line
		const decoded = decodedMappings(sourceMap);
		if (decoded.length <= line) {
			smLine = decoded.length; // base 1, no -1 needed
			col = Number.MAX_SAFE_INTEGER;
		}

		for (const bias of sourceMapBiases) {
			const position = originalPositionFor(sourceMap, { column: col, line: smLine, bias });
			if (position.line !== null && position.column !== null && position.source !== null) {
				return new vscode.Location(
					this.completeSourceMapUrl(sourceMap, position.source),
					new vscode.Position(position.line - 1, position.column)
				);
			}
		}

		return undefined;
	}

	async getSourceFile(compiledUri: string) {
		const sourceMap = await this.loadSourceMap(compiledUri);
		if (!sourceMap) {
			return undefined;
		}

		if (sourceMap.sources[0]) {
			return this.completeSourceMapUrl(sourceMap, sourceMap.sources[0]);
		}

		for (const bias of sourceMapBiases) {
			const position = originalPositionFor(sourceMap, { column: 0, line: 1, bias });
			if (position.source !== null) {
				return this.completeSourceMapUrl(sourceMap, position.source);
			}
		}

		return undefined;
	}

	private completeSourceMapUrl(sm: TraceMap, source: string) {
		if (sm.sourceRoot) {
			try {
				return vscode.Uri.parse(new URL(source, sm.sourceRoot).toString());
			} catch {
				// ignored
			}
		}

		return vscode.Uri.parse(source);
	}

	private loadSourceMap(fileUri: string) {
		const existing = this.cache.get(fileUri);
		if (existing) {
			return existing;
		}

		const promise = (async () => {
			try {
				const contents = await getContentFromFilesystem(vscode.Uri.parse(fileUri));
				const sourcemapMatch = inlineSourcemapRe.exec(contents);
				if (!sourcemapMatch) {
					return;
				}

				const decoded = Buffer.from(sourcemapMatch[1], 'base64').toString();
				return new TraceMap(decoded, fileUri);
			} catch (e) {
				console.warn(`Error parsing sourcemap for ${fileUri}: ${(e as Error).stack}`);
				return;
			}
		})();

		this.cache.set(fileUri, promise);
		return promise;
	}
}

const locationRe = /(file:\/{3}.+):([0-9]+):([0-9]+)/g;

async function replaceAllLocations(store: SourceMapStore, str: string) {
	const output: (string | Promise<string>)[] = [];
	let lastIndex = 0;

	for (const match of str.matchAll(locationRe)) {
		const locationPromise = deriveSourceLocation(store, match);
		const startIndex = match.index || 0;
		const endIndex = startIndex + match[0].length;

		if (startIndex > lastIndex) {
			output.push(str.substring(lastIndex, startIndex));
		}

		output.push(
			locationPromise.then(location =>
				location
					? `${location.uri}:${location.range.start.line + 1}:${location.range.start.character + 1}`
					: match[0]
			)
		);

		lastIndex = endIndex;
	}

	// Preserve the remaining string after the last match
	if (lastIndex < str.length) {
		output.push(str.substring(lastIndex));
	}

	const values = await Promise.all(output);
	return values.join('');
}

async function deriveStackLocations(
	store: SourceMapStore,
	stack: string,
	tcase: vscode.TestItem
) {
	locationRe.lastIndex = 0;

	const locationsRaw = [...new StackTraceParser(stack)].filter(t => t instanceof StackTraceLocation);
	const locationsMapped = await Promise.all(locationsRaw.map(async location => {
		const mapped = location.path.startsWith('file:') ? await store.getSourceLocation(location.path, location.lineBase1 - 1, location.columnBase1 - 1) : undefined;
		const stack = new vscode.TestMessageStackFrame(location.label || '<anonymous>', mapped?.uri, mapped?.range.start || new vscode.Position(location.lineBase1 - 1, location.columnBase1 - 1));
		return { location: mapped, stack };
	}));

	let best: undefined | { location: vscode.Location; score: number };
	for (const { location } of locationsMapped) {
		if (!location) {
			continue;
		}
		let score = 0;
		if (tcase.uri && tcase.uri.toString() === location.uri.toString()) {
			score = 1;
			if (tcase.range && tcase.range.contains(location?.range)) {
				score = 2;
			}
		}
		if (!best || score > best.score) {
			best = { location, score };
		}
	}

	return { stack: locationsMapped.map(s => s.stack), primary: best?.location };
}

async function deriveSourceLocation(store: SourceMapStore, parts: RegExpMatchArray) {
	const [, fileUri, line, col] = parts;
	return store.getSourceLocation(fileUri, Number(line) - 1, Number(col));
}

function findLastIndex<T>(arr: T[], predicate: (value: T) => boolean) {
	for (let i = arr.length - 1; i >= 0; i--) {
		if (predicate(arr[i])) {
			return i;
		}
	}

	return -1;
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-test-provider/src/testTree.ts]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-test-provider/src/testTree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { join, relative } from 'path';
import * as ts from 'typescript';
import { TextDecoder } from 'util';
import * as vscode from 'vscode';
import { Action, extractTestFromNode } from './sourceUtils';

const textDecoder = new TextDecoder('utf-8');
const diagnosticCollection = vscode.languages.createDiagnosticCollection('selfhostTestProvider');

type ContentGetter = (uri: vscode.Uri) => Promise<string>;

export const itemData = new WeakMap<vscode.TestItem, VSCodeTest>();

export const clearFileDiagnostics = (uri: vscode.Uri) => diagnosticCollection.delete(uri);

/**
 * Tries to guess which workspace folder VS Code is in.
 */
export const guessWorkspaceFolder = async () => {
	if (!vscode.workspace.workspaceFolders) {
		return undefined;
	}

	if (vscode.workspace.workspaceFolders.length < 2) {
		return vscode.workspace.workspaceFolders[0];
	}

	for (const folder of vscode.workspace.workspaceFolders) {
		try {
			await vscode.workspace.fs.stat(vscode.Uri.joinPath(folder.uri, 'src/vs/loader.js'));
			return folder;
		} catch {
			// ignored
		}
	}

	return undefined;
};

export const getContentFromFilesystem: ContentGetter = async uri => {
	try {
		const rawContent = await vscode.workspace.fs.readFile(uri);
		return textDecoder.decode(rawContent);
	} catch (e) {
		console.warn(`Error providing tests for ${uri.fsPath}`, e);
		return '';
	}
};

export class TestFile {
	public hasBeenRead = false;

	constructor(
		public readonly uri: vscode.Uri,
		public readonly workspaceFolder: vscode.WorkspaceFolder
	) {}

	public getId() {
		return this.uri.toString().toLowerCase();
	}

	public getLabel() {
		return relative(join(this.workspaceFolder.uri.fsPath, 'src'), this.uri.fsPath);
	}

	public async updateFromDisk(controller: vscode.TestController, item: vscode.TestItem) {
		try {
			const content = await getContentFromFilesystem(item.uri!);
			item.error = undefined;
			this.updateFromContents(controller, content, item);
		} catch (e) {
			item.error = (e as Error).stack;
		}
	}

	/**
	 * Refreshes all tests in this file, `sourceReader` provided by the root.
	 */
	public updateFromContents(
		controller: vscode.TestController,
		content: string,
		file: vscode.TestItem
	) {
		try {
			const diagnostics: vscode.Diagnostic[] = [];
			const ast = ts.createSourceFile(
				this.uri.path.split('/').pop()!,
				content,
				ts.ScriptTarget.ESNext,
				false,
				ts.ScriptKind.TS
			);

			const parents: { item: vscode.TestItem; children: vscode.TestItem[] }[] = [
				{ item: file, children: [] },
			];
			const traverse = (node: ts.Node) => {
				const parent = parents[parents.length - 1];
				const childData = extractTestFromNode(ast, node, itemData.get(parent.item)!);
				if (childData === Action.Skip) {
					return;
				}

				if (childData === Action.Recurse) {
					ts.forEachChild(node, traverse);
					return;
				}

				const id = `${file.uri}/${childData.fullName}`.toLowerCase();

				// Skip duplicated tests. They won't run correctly with the way
				// mocha reports them, and will error if we try to insert them.
				const existing = parent.children.find(c => c.id === id);
				if (existing) {
					const diagnostic = new vscode.Diagnostic(
						childData.range,
						'Duplicate tests cannot be run individually and will not be reported correctly by the test framework. Please rename them.',
						vscode.DiagnosticSeverity.Warning
					);

					diagnostic.relatedInformation = [
						new vscode.DiagnosticRelatedInformation(
							new vscode.Location(existing.uri!, existing.range!),
							'First declared here'
						),
					];

					diagnostics.push(diagnostic);
					return;
				}

				const item = controller.createTestItem(id, childData.name, file.uri);
				itemData.set(item, childData);
				item.range = childData.range;
				parent.children.push(item);

				if (childData instanceof TestSuite) {
					parents.push({ item: item, children: [] });
					ts.forEachChild(node, traverse);
					item.children.replace(parents.pop()!.children);
				}
			};

			ts.forEachChild(ast, traverse);
			file.error = undefined;
			file.children.replace(parents[0].children);
			diagnosticCollection.set(this.uri, diagnostics.length ? diagnostics : undefined);
			this.hasBeenRead = true;
		} catch (e) {
			file.error = String((e as Error).stack || (e as Error).message);
		}
	}
}

export abstract class TestConstruct {
	public fullName: string;

	constructor(
		public readonly name: string,
		public readonly range: vscode.Range,
		parent?: TestConstruct
	) {
		this.fullName = parent ? `${parent.fullName} ${name}` : name;
	}
}

export class TestSuite extends TestConstruct {}

export class TestCase extends TestConstruct {}

export type VSCodeTest = TestFile | TestSuite | TestCase;
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-test-provider/src/v8CoverageWrangling.test.ts]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-test-provider/src/v8CoverageWrangling.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { RangeCoverageTracker } from './v8CoverageWrangling';

suite('v8CoverageWrangling', () => {
	suite('RangeCoverageTracker', () => {
		test('covers new range', () => {
			const rt = new RangeCoverageTracker();
			rt.cover(5, 10);
			assert.deepStrictEqual([...rt], [{ start: 5, end: 10, covered: true }]);
		});

		test('non overlapping ranges', () => {
			const rt = new RangeCoverageTracker();
			rt.cover(5, 10);
			rt.cover(15, 20);
			rt.cover(12, 13);
			assert.deepStrictEqual(
				[...rt],
				[
					{ start: 5, end: 10, covered: true },
					{ start: 12, end: 13, covered: true },
					{ start: 15, end: 20, covered: true },
				]
			);
		});

		test('covers exact', () => {
			const rt = new RangeCoverageTracker();
			rt.uncovered(5, 10);
			rt.cover(5, 10);
			assert.deepStrictEqual([...rt], [{ start: 5, end: 10, covered: true }]);
		});

		test('overlap at start', () => {
			const rt = new RangeCoverageTracker();
			rt.uncovered(5, 10);
			rt.cover(2, 7);
			assert.deepStrictEqual(
				[...rt],
				[
					{ start: 2, end: 7, covered: true },
					{ start: 7, end: 10, covered: false },
				]
			);
		});

		test('overlap at end', () => {
			const rt = new RangeCoverageTracker();
			rt.cover(5, 10);
			rt.uncovered(2, 7);
			assert.deepStrictEqual(
				[...rt],
				[
					{ start: 2, end: 5, covered: false },
					{ start: 5, end: 10, covered: true },
				]
			);
		});

		test('inner contained', () => {
			const rt = new RangeCoverageTracker();
			rt.cover(5, 10);
			rt.uncovered(2, 12);
			assert.deepStrictEqual(
				[...rt],
				[
					{ start: 2, end: 5, covered: false },
					{ start: 5, end: 10, covered: true },
					{ start: 10, end: 12, covered: false },
				]
			);
		});

		test('outer contained', () => {
			const rt = new RangeCoverageTracker();
			rt.uncovered(5, 10);
			rt.cover(7, 9);
			assert.deepStrictEqual(
				[...rt],
				[
					{ start: 5, end: 7, covered: false },
					{ start: 7, end: 9, covered: true },
					{ start: 9, end: 10, covered: false },
				]
			);
		});

		test('boundary touching', () => {
			const rt = new RangeCoverageTracker();
			rt.uncovered(5, 10);
			rt.cover(10, 15);
			rt.uncovered(15, 20);
			assert.deepStrictEqual(
				[...rt],
				[
					{ start: 5, end: 10, covered: false },
					{ start: 10, end: 15, covered: true },
					{ start: 15, end: 20, covered: false },
				]
			);
		});

		suite('initializeBlock', () => {
			test('simple tree', () => {
				const rt = RangeCoverageTracker.initializeBlocks([
					{
						functionName: 'outer',
						isBlockCoverage: true,
						ranges: [
							{ count: 1, startOffset: 5, endOffset: 30 },
							{ count: 1, startOffset: 8, endOffset: 10 },
							{ count: 0, startOffset: 15, endOffset: 20 },
						],
					},
				]);

				assert.deepStrictEqual(
					[...rt],
					[
						{ start: 5, end: 15, covered: true },
						{ start: 15, end: 20, covered: false },
						{ start: 20, end: 30, covered: true },
					]
				);
			});

			test('separate branches', () => {
				const rt = RangeCoverageTracker.initializeBlocks([
					{
						functionName: 'outer',
						isBlockCoverage: true,
						ranges: [
							{ count: 1, startOffset: 5, endOffset: 8 },
							{ count: 1, startOffset: 10, endOffset: 12 },
							{ count: 0, startOffset: 15, endOffset: 20 },
						],
					},
				]);

				assert.deepStrictEqual(
					[...rt],
					[
						{ start: 5, end: 8, covered: true },
						{ start: 10, end: 12, covered: true },
						{ start: 15, end: 20, covered: false },
					]
				);
			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-test-provider/src/v8CoverageWrangling.ts]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-test-provider/src/v8CoverageWrangling.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface ICoverageRange {
	start: number;
	end: number;
	covered: boolean;
}

export interface IV8FunctionCoverage {
	functionName: string;
	isBlockCoverage: boolean;
	ranges: IV8CoverageRange[];
}

export interface IV8CoverageRange {
	startOffset: number;
	endOffset: number;
	count: number;
}

/** V8 Script coverage data */
export interface IScriptCoverage {
	scriptId: string;
	url: string;
	// Script source added by the runner the first time the script is emitted.
	source?: string;
	functions: IV8FunctionCoverage[];
}

export class RangeCoverageTracker implements Iterable<ICoverageRange> {
	/**
	 * A noncontiguous, non-overlapping, ordered set of ranges and whether
	 * that range has been covered.
	 */
	private ranges: readonly ICoverageRange[] = [];

	/**
	 * Adds a coverage tracker initialized for a function with {@link isBlockCoverage} set to true.
	 */
	public static initializeBlocks(fns: IV8FunctionCoverage[]) {
		const rt = new RangeCoverageTracker();

		let start = 0;
		const stack: IV8CoverageRange[] = [];

		// note: comes pre-sorted from V8
		for (const { ranges } of fns) {
			for (const range of ranges) {
				while (stack.length && stack[stack.length - 1].endOffset < range.startOffset) {
					const last = stack.pop()!;
					rt.setCovered(start, last.endOffset, last.count > 0);
					start = last.endOffset;
				}

				if (range.startOffset > start && stack.length) {
					rt.setCovered(start, range.startOffset, !!stack[stack.length - 1].count);
				}

				start = range.startOffset;
				stack.push(range);
			}
		}

		while (stack.length) {
			const last = stack.pop()!;
			rt.setCovered(start, last.endOffset, last.count > 0);
			start = last.endOffset;
		}

		return rt;
	}

	/** Makes a copy of the range tracker. */
	public clone() {
		const rt = new RangeCoverageTracker();
		rt.ranges = this.ranges.slice();
		return rt;
	}

	/** Marks a range covered */
	public cover(start: number, end: number) {
		this.setCovered(start, end, true);
	}

	/** Marks a range as uncovered */
	public uncovered(start: number, end: number) {
		this.setCovered(start, end, false);
	}

	/** Iterates over coverage ranges */
	[Symbol.iterator]() {
		return this.ranges[Symbol.iterator]();
	}

	/**
	 * Marks the given character range as being covered or uncovered.
	 *
	 * todo@connor4312: this is a hot path is could probably be optimized to
	 * avoid rebuilding the array. Maybe with a nice tree structure?
	 */
	public setCovered(start: number, end: number, covered: boolean) {
		const newRanges: ICoverageRange[] = [];
		let i = 0;
		for (; i < this.ranges.length && this.ranges[i].end <= start; i++) {
			newRanges.push(this.ranges[i]);
		}

		const push = (range: ICoverageRange) => {
			const last = newRanges.length && newRanges[newRanges.length - 1];
			if (last && last.end === range.start && last.covered === range.covered) {
				last.end = range.end;
			} else {
				newRanges.push(range);
			}
		};

		push({ start, end, covered });

		for (; i < this.ranges.length; i++) {
			const range = this.ranges[i];
			const last = newRanges[newRanges.length - 1];

			if (range.start === last.start && range.end === last.end) {
				// ranges are equal:
				last.covered ||= range.covered;
			} else if (range.end < last.start || range.start > last.end) {
				// ranges don't overlap
				push(range);
			} else if (range.start < last.start && range.end > last.end) {
				// range contains last:
				newRanges.pop();
				push({ start: range.start, end: last.start, covered: range.covered });
				push({ start: last.start, end: last.end, covered: range.covered || last.covered });
				push({ start: last.end, end: range.end, covered: range.covered });
			} else if (range.start >= last.start && range.end <= last.end) {
				// last contains range:
				newRanges.pop();
				push({ start: last.start, end: range.start, covered: last.covered });
				push({ start: range.start, end: range.end, covered: range.covered || last.covered });
				push({ start: range.end, end: last.end, covered: last.covered });
			} else if (range.start < last.start && range.end <= last.end) {
				// range overlaps start of last:
				newRanges.pop();
				push({ start: range.start, end: last.start, covered: range.covered });
				push({ start: last.start, end: range.end, covered: range.covered || last.covered });
				push({ start: range.end, end: last.end, covered: last.covered });
			} else if (range.start >= last.start && range.end > last.end) {
				// range overlaps end of last:
				newRanges.pop();
				push({ start: last.start, end: range.start, covered: last.covered });
				push({ start: range.start, end: last.end, covered: range.covered || last.covered });
				push({ start: last.end, end: range.end, covered: range.covered });
			} else {
				throw new Error('unreachable');
			}
		}

		this.ranges = newRanges;
	}
}

export class OffsetToPosition {
	/** Line numbers to byte offsets. */
	public readonly lines: number[] = [];

	public readonly totalLength: number;

	constructor(source: string) {
		this.lines.push(0);
		for (let i = source.indexOf('\n'); i !== -1; i = source.indexOf('\n', i + 1)) {
			this.lines.push(i + 1);
		}
		this.totalLength = source.length;
	}

	public getLineLength(lineNumber: number): number {
		return (
			(lineNumber < this.lines.length - 1 ? this.lines[lineNumber + 1] - 1 : this.totalLength) -
			this.lines[lineNumber]
		);
	}

	/**
	 * Gets the line the offset appears on.
	 */
	public getLineOfOffset(offset: number): number {
		let low = 0;
		let high = this.lines.length;
		while (low < high) {
			const mid = Math.floor((low + high) / 2);
			if (this.lines[mid] > offset) {
				high = mid;
			} else {
				low = mid + 1;
			}
		}

		return low - 1;
	}

	/**
	 * Converts from a file offset to a base 0 line/column .
	 */
	public toLineColumn(offset: number): { line: number; column: number } {
		const line = this.getLineOfOffset(offset);
		return { line: line, column: offset - this.lines[line] };
	}
}
```

--------------------------------------------------------------------------------

---[FILE: .vscode/extensions/vscode-selfhost-test-provider/src/vscodeTestRunner.ts]---
Location: vscode-main/.vscode/extensions/vscode-selfhost-test-provider/src/vscodeTestRunner.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import { AddressInfo, createServer } from 'net';
import * as path from 'path';
import * as vscode from 'vscode';
import { TestOutputScanner } from './testOutputScanner';
import { TestCase, TestFile, TestSuite, itemData } from './testTree';

/**
 * From MDN
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
 */
const escapeRe = (s: string) => s.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');

const TEST_ELECTRON_SCRIPT_PATH = 'test/unit/electron/index.js';
const TEST_BROWSER_SCRIPT_PATH = 'test/unit/browser/index.js';

const ATTACH_CONFIG_NAME = 'Attach to VS Code';
const DEBUG_TYPE = 'pwa-chrome';

export abstract class VSCodeTestRunner {
	constructor(protected readonly repoLocation: vscode.WorkspaceFolder) { }

	public async run(baseArgs: ReadonlyArray<string>, filter?: ReadonlyArray<vscode.TestItem>) {
		const args = this.prepareArguments(baseArgs, filter);
		const cp = spawn(await this.binaryPath(), args, {
			cwd: this.repoLocation.uri.fsPath,
			stdio: 'pipe',
			env: this.getEnvironment(),
		});

		return new TestOutputScanner(cp, args);
	}

	public async debug(testRun: vscode.TestRun, baseArgs: ReadonlyArray<string>, filter?: ReadonlyArray<vscode.TestItem>) {
		const port = await this.findOpenPort();
		const baseConfiguration = vscode.workspace
			.getConfiguration('launch', this.repoLocation)
			.get<vscode.DebugConfiguration[]>('configurations', [])
			.find(c => c.name === ATTACH_CONFIG_NAME);

		if (!baseConfiguration) {
			throw new Error(`Could not find launch configuration ${ATTACH_CONFIG_NAME}`);
		}

		const server = this.createWaitServer();
		const args = [
			...this.prepareArguments(baseArgs, filter),
			`--remote-debugging-port=${port}`,
			// for breakpoint freeze: https://github.com/microsoft/vscode/issues/122225#issuecomment-885377304
			'--js-flags="--regexp_interpret_all"',
			// for general runtime freezes: https://github.com/microsoft/vscode/issues/127861#issuecomment-904144910
			'--disable-features=CalculateNativeWinOcclusion',
			'--timeout=0',
			`--waitServer=${server.port}`,
		];

		const cp = spawn(await this.binaryPath(), args, {
			cwd: this.repoLocation.uri.fsPath,
			stdio: 'pipe',
			env: this.getEnvironment(port),
		});

		// Register a descriptor factory that signals the server when any
		// breakpoint set requests on the debugee have been completed.
		const factory = vscode.debug.registerDebugAdapterTrackerFactory(DEBUG_TYPE, {
			createDebugAdapterTracker(session) {
				if (!session.parentSession || session.parentSession !== rootSession) {
					return;
				}

				let initRequestId: number | undefined;

				return {
					onDidSendMessage(message) {
						if (message.type === 'response' && message.request_seq === initRequestId) {
							server.ready();
						}
					},
					onWillReceiveMessage(message) {
						if (initRequestId !== undefined) {
							return;
						}

						if (message.command === 'launch' || message.command === 'attach') {
							initRequestId = message.seq;
						}
					},
				};
			},
		});

		vscode.debug.startDebugging(this.repoLocation, { ...baseConfiguration, port }, { testRun });

		let exited = false;
		let rootSession: vscode.DebugSession | undefined;
		cp.once('exit', () => {
			exited = true;
			server.dispose();
			listener.dispose();
			factory.dispose();

			if (rootSession) {
				vscode.debug.stopDebugging(rootSession);
			}
		});

		const listener = vscode.debug.onDidStartDebugSession(s => {
			if (s.name === ATTACH_CONFIG_NAME && !rootSession) {
				if (exited) {
					vscode.debug.stopDebugging(rootSession);
				} else {
					rootSession = s;
				}
			}
		});

		return new TestOutputScanner(cp, args);
	}

	private findOpenPort(): Promise<number> {
		return new Promise((resolve, reject) => {
			const server = createServer();
			server.listen(0, () => {
				const address = server.address() as AddressInfo;
				const port = address.port;
				server.close(() => {
					resolve(port);
				});
			});
			server.on('error', (error: Error) => {
				reject(error);
			});
		});
	}

	protected getEnvironment(_remoteDebugPort?: number): NodeJS.ProcessEnv {
		return {
			...process.env,
			ELECTRON_RUN_AS_NODE: undefined,
			ELECTRON_ENABLE_LOGGING: '1',
		};
	}

	private prepareArguments(
		baseArgs: ReadonlyArray<string>,
		filter?: ReadonlyArray<vscode.TestItem>
	) {
		const args = [...this.getDefaultArgs(), ...baseArgs, '--reporter', 'full-json-stream'];
		if (!filter) {
			return args;
		}

		const grepRe: string[] = [];
		const runPaths = new Set<string>();
		const addTestFileRunPath = (data: TestFile) =>
			runPaths.add(
				path.relative(data.workspaceFolder.uri.fsPath, data.uri.fsPath).replace(/\\/g, '/')
			);

		const itemDatas = filter.map(f => itemData.get(f));
		/** If true, we have to be careful with greps, as a grep for one test file affects the run of the other test file. */
		const hasBothTestCaseOrTestSuiteAndTestFileFilters =
			itemDatas.some(d => (d instanceof TestCase) || (d instanceof TestSuite)) &&
			itemDatas.some(d => d instanceof TestFile);

		function addTestCaseOrSuite(data: TestCase | TestSuite, test: vscode.TestItem): void {
			grepRe.push(escapeRe(data.fullName) + (data instanceof TestCase ? '$' : ' '));
			for (let p = test.parent; p; p = p.parent) {
				const parentData = itemData.get(p);
				if (parentData instanceof TestFile) {
					addTestFileRunPath(parentData);
				}
			}
		}

		for (const test of filter) {
			const data = itemData.get(test);
			if (data instanceof TestCase || data instanceof TestSuite) {
				addTestCaseOrSuite(data, test);
			} else if (data instanceof TestFile) {
				if (!hasBothTestCaseOrTestSuiteAndTestFileFilters) {
					addTestFileRunPath(data);
				} else {
					// We add all the items individually so they get their own grep expressions.
					for (const [_id, nestedTest] of test.children) {
						const childData = itemData.get(nestedTest);
						if (childData instanceof TestCase || childData instanceof TestSuite) {
							addTestCaseOrSuite(childData, nestedTest);
						} else {
							console.error('Unexpected test item in test file', nestedTest.id, nestedTest.label);
						}
					}
				}
			}
		}

		if (grepRe.length) {
			args.push('--grep', `/^(${grepRe.join('|')})/`);
		}

		if (runPaths.size) {
			args.push(...[...runPaths].flatMap(p => ['--run', p]));
		}

		return args;
	}

	protected abstract getDefaultArgs(): string[];

	protected abstract binaryPath(): Promise<string>;

	protected async readProductJson() {
		const projectJson = await fs.readFile(
			path.join(this.repoLocation.uri.fsPath, 'product.json'),
			'utf-8'
		);
		try {
			return JSON.parse(projectJson);
		} catch (e) {
			throw new Error(`Error parsing product.json: ${(e as Error).message}`);
		}
	}

	private createWaitServer() {
		const onReady = new vscode.EventEmitter<void>();
		let ready = false;

		const server = createServer(socket => {
			if (ready) {
				socket.end();
			} else {
				onReady.event(() => socket.end());
			}
		});

		server.listen(0);

		return {
			port: (server.address() as AddressInfo).port,
			ready: () => {
				ready = true;
				onReady.fire();
			},
			dispose: () => {
				server.close();
			},
		};
	}
}

export class BrowserTestRunner extends VSCodeTestRunner {
	/** @override */
	protected binaryPath(): Promise<string> {
		return Promise.resolve(process.execPath);
	}

	/** @override */
	protected override getEnvironment(remoteDebugPort?: number) {
		return {
			...super.getEnvironment(remoteDebugPort),
			PLAYWRIGHT_CHROMIUM_DEBUG_PORT: remoteDebugPort ? String(remoteDebugPort) : undefined,
			ELECTRON_RUN_AS_NODE: '1',
		};
	}

	/** @override */
	protected getDefaultArgs() {
		return [TEST_BROWSER_SCRIPT_PATH];
	}
}

export class WindowsTestRunner extends VSCodeTestRunner {
	/** @override */
	protected async binaryPath() {
		const { nameShort } = await this.readProductJson();
		return path.join(this.repoLocation.uri.fsPath, `.build/electron/${nameShort}.exe`);
	}

	/** @override */
	protected getDefaultArgs() {
		return [TEST_ELECTRON_SCRIPT_PATH];
	}
}

export class PosixTestRunner extends VSCodeTestRunner {
	/** @override */
	protected async binaryPath() {
		const { applicationName } = await this.readProductJson();
		return path.join(this.repoLocation.uri.fsPath, `.build/electron/${applicationName}`);
	}

	/** @override */
	protected getDefaultArgs() {
		return [TEST_ELECTRON_SCRIPT_PATH];
	}
}

export class DarwinTestRunner extends PosixTestRunner {
	/** @override */
	protected override getDefaultArgs() {
		return [
			TEST_ELECTRON_SCRIPT_PATH,
			'--no-sandbox'
		];
	}

	/** @override */
	protected override async binaryPath() {
		const { nameLong } = await this.readProductJson();
		return path.join(
			this.repoLocation.uri.fsPath,
			`.build/electron/${nameLong}.app/Contents/MacOS/Electron`
		);
	}
}

export const PlatformTestRunner =
	process.platform === 'win32'
		? WindowsTestRunner
		: process.platform === 'darwin'
			? DarwinTestRunner
			: PosixTestRunner;
```

--------------------------------------------------------------------------------

---[FILE: .vscode/notebooks/api.github-issues]---
Location: vscode-main/.vscode/notebooks/api.github-issues

```text
[
  {
    "kind": 1,
    "language": "markdown",
    "value": "#### Config"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$REPO=repo:microsoft/vscode\n$MILESTONE=milestone:\"October 2025\""
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "### Finalization"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$REPO $MILESTONE label:api-finalization"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "### Proposals"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$REPO $MILESTONE is:open label:api-proposal sort:created-asc"
  }
]
```

--------------------------------------------------------------------------------

---[FILE: .vscode/notebooks/endgame.github-issues]---
Location: vscode-main/.vscode/notebooks/endgame.github-issues

```text
[
  {
    "kind": 1,
    "language": "markdown",
    "value": "#### Macros"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$MILESTONE=milestone:\"November 2025\""
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# Preparation"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Open Pull Requests on the Milestone"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MILESTONE is:pr is:open"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Unverified Older Insiders-Released Issues"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft -$MILESTONE is:issue is:closed reason:completed label:bug label:insiders-released -label:verified -label:*duplicate -label:*as-designed -label:z-author-verified -label:on-testplan -label:error-telemetry"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Unverified Older Insiders-Released Feature Requests"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft -$MILESTONE is:issue is:closed reason:completed label:feature-request label:insiders-released -label:on-testplan -label:verified -label:*duplicate -label:error-telemetry"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Open Issues on the Milestone"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MILESTONE is:issue is:open -label:iteration-plan -label:endgame-plan -label:testplan-item"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Feature Requests Missing Labels"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MILESTONE is:issue is:closed reason:completed label:feature-request -label:verification-needed -label:on-testplan -label:verified -label:*duplicate"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Open Test Plan Items without milestone"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MILESTONE is:issue is:open label:testplan-item no:milestone"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# Testing"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Test Plan Items"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft is:issue is:open label:testplan-item"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Verification Needed"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MILESTONE is:issue is:closed reason:completed label:verification-needed -label:verified -label:on-testplan"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# Verification"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Verifiable Fixes"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MILESTONE is:issue is:closed reason:completed sort:updated-asc label:bug -label:verified -label:on-testplan -label:*duplicate -label:duplicate -label:invalid -label:*as-designed -label:error-telemetry -label:verification-steps-needed -label:z-author-verified -label:unreleased -label:*not-reproducible -label:*out-of-scope"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Verifiable Fixes Missing Steps"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MILESTONE is:issue is:closed reason:completed sort:updated-asc label:bug label:verification-steps-needed -label:verified -label:on-testplan -label:*duplicate -label:duplicate -label:invalid -label:*as-designed -label:error-telemetry -label:z-author-verified -label:unreleased -label:*not-reproducible"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Unreleased Fixes"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MILESTONE is:issue is:closed reason:completed sort:updated-asc label:bug -label:verified -label:on-testplan -label:*duplicate -label:duplicate -label:invalid -label:*as-designed -label:error-telemetry -label:verification-steps-needed -label:z-author-verified label:unreleased -label:*not-reproducible"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## All Unverified Fixes"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MILESTONE is:issue is:closed reason:completed sort:updated-asc label:bug -label:verified -label:on-testplan -label:*duplicate -label:duplicate -label:invalid -label:*as-designed -label:error-telemetry -label:z-author-verified -label:*not-reproducible"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# Candidates"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MILESTONE is:issue is:open label:candidate"
  }
]
```

--------------------------------------------------------------------------------

---[FILE: .vscode/notebooks/grooming-delta.github-issues]---
Location: vscode-main/.vscode/notebooks/grooming-delta.github-issues

```text
[
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Config"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$since=2021-10-01"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode\n\nQuery exceeds the maximum result. Run the query manually: `is:issue is:open closed:>2021-10-01`"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "//repo:microsoft/vscode is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "//repo:microsoft/vscode is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-remote-release"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-remote-release is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-remote-release is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# monaco-editor"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/monaco-editor is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/monaco-editor is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-docs"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-docs is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-docs is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-js-debug"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-js-debug is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-js-debug is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# language-server-protocol"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/language-server-protocol is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/language-server-protocol is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-eslint"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-eslint is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-eslint is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-css-languageservice"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-css-languageservice is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-css-languageservice is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-test"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-test is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-test is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-pull-request-github"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-pull-request-github is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-test is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-chrome-debug-core"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-chrome-debug-core is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-chrome-debug-core is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-debugadapter-node"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-debugadapter-node is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-debugadapter-node is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-emmet-helper"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-emmet-helper is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-emmet-helper is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-extension-vscode\n\nDeprecated"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-extension-vscode is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-extension-vscode is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-extension-samples"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-extension-samples is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-extension-samples is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-filewatcher-windows"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-filewatcher-windows is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-filewatcher-windows is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-generator-code"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-generator-code is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-generator-code is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-html-languageservice"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-html-languageservice is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-html-languageservice is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-json-languageservice"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-json-languageservice is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-json-languageservice is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-languageserver-node"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-languageserver-node is:issue closed:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": ""
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-languageserver-node is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-loader"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-loader is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-loader is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-mono-debug"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-mono-debug is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-mono-debug is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-node-debug"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-node-debug is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-node-debug is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-node-debug2"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-node-debug2 is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-node-debug2 is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-recipes"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-recipes is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-recipes is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-textmate"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-textmate is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-textmate is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-themes"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-themes is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-themes is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-vsce"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-vsce is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-vsce is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-website"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-website is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-website is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-windows-process-tree"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-windows-process-tree is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-windows-process-tree is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# debug-adapter-protocol"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/debug-adapter-protocol is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/debug-adapter-protocol is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# inno-updater"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/inno-updater is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/inno-updater is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# monaco-languages"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/monaco-languages is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/monaco-languages is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# monaco-typescript"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/monaco-typescript is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/monaco-typescript is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# monaco-css"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/monaco-css is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/monaco-css is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# monaco-json"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/monaco-json is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/monaco-json is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# monaco-html"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/monaco-html is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/monaco-html is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# monaco-editor-webpack-plugin"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/monaco-editor-webpack-plugin is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/monaco-editor-webpack-plugin is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# node-jsonc-parser"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/node-jsonc-parser is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/node-jsonc-parser is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-jupyter"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-jupyter is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-jupyter is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-python"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-python is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-python is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-livepreview"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-livepreview is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-livepreview is:issue created:>$since"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": ""
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode-test"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-test is:issue closed:>$since"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-test is:issue created:>$since"
  }
]
```

--------------------------------------------------------------------------------

---[FILE: .vscode/notebooks/grooming.github-issues]---
Location: vscode-main/.vscode/notebooks/grooming.github-issues

```text
[
  {
    "kind": 1,
    "language": "markdown",
    "value": "#### Config"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "// list of repos we work in\r\n$repos=repo:microsoft/lsprotocol repo:microsoft/monaco-editor repo:microsoft/vscode repo:microsoft/vscode-anycode repo:microsoft/vscode-autopep8 repo:microsoft/vscode-black-formatter repo:microsoft/vscode-copilot repo:microsoft/vscode-copilot-release repo:microsoft/vscode-dev repo:microsoft/vscode-dev-chrome-launcher repo:microsoft/vscode-emmet-helper repo:microsoft/vscode-extension-telemetry repo:microsoft/vscode-flake8 repo:microsoft/vscode-github-issue-notebooks repo:microsoft/vscode-hexeditor repo:microsoft/vscode-internalbacklog repo:microsoft/vscode-isort repo:microsoft/vscode-js-debug repo:microsoft/vscode-jupyter repo:microsoft/vscode-jupyter-internal repo:microsoft/vscode-l10n repo:microsoft/vscode-livepreview repo:microsoft/vscode-markdown-languageservice repo:microsoft/vscode-markdown-tm-grammar repo:microsoft/vscode-mypy repo:microsoft/vscode-pull-request-github repo:microsoft/vscode-pylint repo:microsoft/vscode-python repo:microsoft/vscode-python-debugger repo:microsoft/vscode-python-tools-extension-template repo:microsoft/vscode-references-view repo:microsoft/vscode-remote-release repo:microsoft/vscode-remote-repositories-github repo:microsoft/vscode-remote-tunnels repo:microsoft/vscode-remotehub repo:microsoft/vscode-settings-sync-server repo:microsoft/vscode-unpkg repo:microsoft/vscode-vsce\r\n\r\n$assignee=@me\r\n"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "#### Missing Type label\r\n"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$repos assignee:$assignee is:open type:issue -label:bug -label:\"info-needed\" -label:feature-request -label:under-discussion -label:debt -label:plan-item -label:upstream -label:polish -label:testplan-item -label:error-telemetry -label:engineering -label:endgame-plan\r\n"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "#### Missing Area Label\r\n\r\nFeature area labels are light or strong blue (`1d76db` or `c5def5`) and they denote a specific feature or feature area, like `editor-clipboard` or `file-explorer`\r\n"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode assignee:$assignee is:open type:issue -label:\"info-needed\" -label:api -label:api-finalization -label:api-proposal -label:authentication -label:bisect-ext -label:bracket-pair-colorization -label:bracket-pair-guides -label:breadcrumbs -label:callhierarchy -label:chrome-devtools -label:cloud-changes -label:code-lens -label:command-center -label:comments -label:config -label:containers -label:context-keys -label:continue-working-on -label:css-less-scss -label:custom-editors -label:debug -label:debug-disassembly -label:dialogs -label:diff-editor -label:dropdown -label:editor-api -label:editor-autoclosing -label:editor-autoindent -label:editor-bracket-matching -label:editor-clipboard -label:editor-code-actions -label:editor-color-picker -label:editor-columnselect -label:editor-commands -label:editor-comments -label:editor-contrib -label:editor-core -label:editor-drag-and-drop -label:editor-error-widget -label:editor-find -label:editor-folding -label:editor-highlight -label:editor-hover -label:editor-indent-detection -label:editor-indent-guides -label:editor-input -label:editor-input-IME -label:editor-insets -label:editor-minimap -label:editor-multicursor -label:editor-parameter-hints -label:editor-render-whitespace -label:editor-rendering -label:editor-widgets -label:editor-RTL -label:editor-scrollbar -label:editor-sorting -label:editor-sticky-scroll -label:editor-symbols -label:editor-synced-region -label:editor-textbuffer -label:editor-theming -label:editor-wordnav -label:editor-wrapping -label:emmet -label:emmet-parse -label:error-list -label:extension-activation -label:extension-host -label:extension-prerelease -label:extension-recommendations -label:extensions -label:extensions-development -label:file-decorations -label:file-encoding -label:file-explorer -label:file-glob -label:file-io -label:file-nesting -label:file-watcher -label:font-rendering -label:formatting -label:getting-started -label:ghost-text -label:git -label:github -label:github-repositories -label:gpu -label:grammar -label:grid-widget -label:html -label:icon-brand -label:icons-product -label:image-preview -label:inlay-hints -label:inline-completions -label:install-update -label:intellisense-config -label:interactive-playground -label:interactive-window -label:issue-bot -label:issue-reporter -label:javascript -label:json -label:keybindings -label:keybindings-editor -label:keyboard-layout -label:chat -label:l10n-platform -label:label-provider -label:languages-basic -label:languages-diagnostics -label:languages-guessing -label:layout -label:lcd-text-rendering -label:list-widget -label:live-preview -label:log -label:markdown -label:marketplace -label:menus -label:merge-conflict -label:merge-editor -label:merge-editor-workbench -label:monaco-editor -label:native-file-dialog -label:network -label:notebook -label:notebook-accessibility -label:notebook-api -label:notebook-cell-editor -label:notebook-celltoolbar -label:notebook-clipboard -label:notebook-commands -label:notebook-debugging -label:notebook-diff -label:notebook-dnd -label:notebook-execution -label:notebook-find -label:notebook-folding -label:notebook-getting-started -label:notebook-globaltoolbar -label:notebook-ipynb -label:notebook-kernel -label:notebook-kernel-picker -label:notebook-language -label:notebook-layout -label:notebook-markdown -label:notebook-output -label:notebook-perf -label:notebook-remote -label:notebook-serialization -label:notebook-statusbar -label:notebook-toc-outline -label:notebook-undo-redo -label:notebook-variables -label:notebook-workbench-integration -label:notebook-workflow -label:notebook-sticky-scroll -label:notebook-format -label:notebook-code-actions -label:open-editors -label:opener -label:outline -label:output -label:packaging -label:perf -label:perf-bloat -label:perf-startup -label:php -label:portable-mode -label:proxy -label:quick-open -label:quick-pick -label:references-viewlet -label:release-notes -label:remote -label:remote-connection -label:remote-explorer -label:remote-tunnel -label:rename -label:runCommands -label:sandbox -label:sash-widget -label:scm -label:screencast-mode -label:search -label:search-api -label:search-editor -label:search-replace -label:semantic-tokens -label:server -label:settings-editor -label:settings-sync -label:settings-sync-server -label:shared-process -label:simple-file-dialog -label:smart-select -label:snap -label:snippets -label:splitview-widget -label:ssh -label:suggest -label:table-widget -label:tasks -label:telemetry -label:terminal -label:terminal-accessibility -label:terminal-conpty -label:terminal-editors -label:terminal-external -label:terminal-find -label:terminal-input -label:terminal-layout -label:terminal-links -label:terminal-local-echo -label:terminal-persistence -label:terminal-process -label:terminal-profiles -label:terminal-quick-fix -label:terminal-rendering -label:terminal-shell-bash -label:terminal-shell-cmd -label:terminal-shell-fish -label:terminal-shell-git-bash -label:terminal-shell-integration -label:terminal-shell-pwsh -label:terminal-shell-zsh -label:terminal-sticky-scroll -label:terminal-tabs -label:testing -label:themes -label:timeline -label:timeline-git -label:timeline-local-history -label:titlebar -label:tokenization -label:touch/pointer -label:trackpad/scroll -label:tree-views -label:tree-widget -label:typescript -label:undo-redo -label:unicode-highlight -label:uri -label:user-profiles -label:ux -label:variable-resolving -label:VIM -label:virtual-workspaces -label:vscode-website -label:vscode.dev -label:web -label:webview -label:webview-views -label:workbench-actions -label:workbench-banner -label:workbench-cli -label:workbench-diagnostics -label:workbench-dnd -label:workbench-editor-grid -label:workbench-editor-groups -label:workbench-editor-resolver -label:workbench-editors -label:workbench-electron -label:workbench-fonts -label:workbench-history -label:workbench-hot-exit -label:workbench-hover -label:workbench-launch -label:workbench-link -label:workbench-multiroot -label:workbench-notifications -label:workbench-os-integration -label:workbench-rapid-render -label:workbench-run-as-admin -label:workbench-state -label:workbench-status -label:workbench-tabs -label:workbench-touchbar -label:workbench-untitled-editors -label:workbench-views -label:workbench-welcome -label:workbench-window -label:workbench-workspace -label:workbench-zen -label:workspace-edit -label:workspace-symbols -label:workspace-trust -label:zoom -label:inline-chat -label:panel-chat -label:quick-chat -label:tasks -label:error-list -label:winget -label:tree-views -label:freeze-slow-crash-leak -label:engineering -label:cross-file-editing -label:microsoft-authentication -label:github-authentication -label:lm-access -label:secret-storage"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "### Missing Milestone\r\n"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$repos assignee:$assignee is:open type:issue no:milestone -label:info-needed -label:triage-needed -label:confirmation-pending -label:under-discussion\r\n"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "#### Not Actionable\r\n"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$repos assignee:$assignee is:open label:\"info-needed\"\r\n"
  }
]
```

--------------------------------------------------------------------------------

---[FILE: .vscode/notebooks/inbox.github-issues]---
Location: vscode-main/.vscode/notebooks/inbox.github-issues

```text
[
  {
    "kind": 1,
    "language": "markdown",
    "value": "## tl;dr: Triage Inbox\n\nAll inbox issues but not those that need more information. These issues need to be triaged, e.g assigned to a user or ask for more information"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$inbox -label:\"info-needed\" sort:created-desc"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode label:triage-needed is:open"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "##### `Config`: defines the inbox query"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$inbox=repo:microsoft/vscode is:open no:assignee -label:feature-request -label:testplan-item -label:plan-item "
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Inbox tracking and Issue triage"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "New issues or pull requests submitted by the community are initially triaged by an [automatic classification bot](https://github.com/microsoft/vscode-github-triage-actions/tree/master/classifier-deep). Issues that the bot does not correctly triage are then triaged by a team member. The team rotates the inbox tracker on a weekly basis.\n\nA [mirror](https://github.com/JacksonKearl/testissues/issues) of the VS Code issue stream is available with details about how the bot classifies issues, including feature-area classifications and confidence ratings. Per-category confidence thresholds and feature-area ownership data is maintained in [.github/classifier.json](https://github.com/microsoft/vscode/blob/main/.github/classifier.json). \n\n💡 The bot is being run through a GitHub action that runs every 30 minutes. Give the bot the opportunity to classify an issue before doing it manually.\n\n### Inbox Tracking\n\nThe inbox tracker is responsible for the [global inbox](https://github.com/microsoft/vscode/issues?utf8=%E2%9C%93&q=is%3Aopen+no%3Aassignee+-label%3Afeature-request+-label%3Atestplan-item+-label%3Aplan-item) containing all **open issues and pull requests** that\n- are neither **feature requests** nor **test plan items** nor **plan items** and\n- have **no owner assignment**.\n\nThe **inbox tracker** may perform any step described in our [issue triaging documentation](https://github.com/microsoft/vscode/wiki/Issues-Triaging) but its main responsibility is to route issues to the actual feature area owner.\n\nFeature area owners track the **feature area inbox** containing all **open issues and pull requests** that\n- are personally assigned to them and are not assigned to any milestone\n- are labeled with their feature area label and are not assigned to any milestone.\nThis secondary triage may involve any of the steps described in our [issue triaging documentation](https://github.com/microsoft/vscode/wiki/Issues-Triaging) and results in a fully triaged or closed issue.\n\nThe [github triage extension](https://github.com/microsoft/vscode-github-triage-extension) can be used to assist with triaging — it provides a \"Command Palette\"-style list of triaging actions like assignment, labeling, and triggers for various bot actions."
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## All Inbox Items\n\nAll issues that have no assignee and that have neither **feature requests** nor **test plan items** nor **plan items**."
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$inbox"
  }
]
```

--------------------------------------------------------------------------------

---[FILE: .vscode/notebooks/my-endgame.github-issues]---
Location: vscode-main/.vscode/notebooks/my-endgame.github-issues

```text
[
  {
    "kind": 1,
    "language": "markdown",
    "value": "#### Macros"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$MILESTONE=milestone:\"November 2025\"\n\n$MINE=assignee:@me"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$NOT_TEAM_MEMBERS=-author:aeschli -author:alexdima -author:alexr00 -author:AmandaSilver -author:bamurtaugh -author:bpasero -author:chrmarti -author:Chuxel -author:claudiaregio -author:connor4312 -author:dbaeumer -author:deepak1556 -author:devinvalenciano -author:digitarald -author:DonJayamanne -author:egamma -author:fiveisprime -author:ntrogh -author:hediet -author:isidorn -author:joaomoreno -author:jrieken -author:kieferrm -author:lramos15 -author:lszomoru -author:meganrogge -author:misolori -author:mjbvz -author:rebornix -author:roblourens -author:rzhao271 -author:sandy081 -author:sbatten -author:stevencl -author:TylerLeonhardt -author:Tyriar -author:weinand -author:amunger -author:karthiknadig -author:eleanorjboyd -author:Yoyokrazy  -author:ulugbekna -author:aiday-mar -author:bhavyaus -author:justschen -author:benibenj -author:luabud -author:anthonykim1 -author:joshspicer -author:osortega -author:hawkticehurst -author:pierceboggan -author:benvillalobos -author:dileepyavan -author:dineshc-msft -author:dmitrivMS -author:eli-w-king -author:jo-oikawa -author:jruales -author:jytjyt05 -author:kycutler -author:mrleemurray -author:pwang347 -author:vijayupadya -author:bryanchen-d -author:cwebster-99"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# Preparation"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Open Pull Requests on the Milestone"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MILESTONE $MINE is:pr is:open"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Open Issues on the Milestone"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MILESTONE $MINE is:issue is:open -label:iteration-plan -label:endgame-plan -label:testplan-item"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Feature Requests Missing Labels"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MILESTONE $MINE is:issue is:closed reason:completed label:feature-request -label:verification-needed -label:on-testplan -label:verified -label:*duplicate"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Test Plan Items"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MILESTONE $MINE is:issue is:open author:@me label:testplan-item"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Verification Needed"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MILESTONE $MINE is:issue is:closed reason:completed label:feature-request label:verification-needed -label:verified -label:on-testplan"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# Testing"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Test Plan Items"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MINE is:issue is:open label:testplan-item"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Verification Needed"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MILESTONE -$MINE is:issue is:closed reason:completed -assignee:@me -label:verified -label:z-author-verified label:feature-request label:verification-needed -label:verification-steps-needed -label:unreleased -label:on-testplan"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# Fixing"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Open Issues"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MILESTONE $MINE is:issue is:open -label:endgame-plan -label:testplan-item -label:iteration-plan"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Open Bugs"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MILESTONE $MINE is:issue is:open label:bug"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# Verification"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## My Issues (verification-steps-needed)"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MILESTONE $MINE is:issue label:bug label:verification-steps-needed"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## My Issues (verification-found)"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MILESTONE $MINE is:issue label:bug label:verification-found"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Issues filed by me"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MILESTONE -$MINE is:issue is:closed reason:completed author:@me sort:updated-asc label:bug -label:unreleased -label:verified -label:z-author-verified -label:on-testplan -label:*duplicate -label:duplicate -label:invalid -label:*as-designed -label:error-telemetry -label:verification-steps-needed -label:triage-needed -label:verification-found -label:*not-reproducible"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Issues filed from outside team"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MILESTONE -$MINE is:issue is:closed reason:completed sort:updated-asc label:bug -label:unreleased -label:verified -label:z-author-verified -label:on-testplan -label:*duplicate -label:duplicate -label:invalid -label:*as-designed -label:*out-of-scope -label:error-telemetry -label:verification-steps-needed -label:verification-found $NOT_TEAM_MEMBERS"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Issues filed by others"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MILESTONE -$MINE is:issue is:closed reason:completed -author:@me sort:updated-asc label:bug -label:unreleased -label:verified -label:z-author-verified -label:on-testplan -label:*duplicate -label:duplicate -label:invalid -label:*as-designed -label:error-telemetry -label:verification-steps-needed -label:verification-found -label:*not-reproducible -label:*out-of-scope"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Test steps needed from others"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MILESTONE -$MINE is:issue label:bug label:verification-steps-needed -label:verified"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# Release Notes"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "org:microsoft $MILESTONE $MINE is:issue is:closed reason:completed label:feature-request -label:on-release-notes\r\norg:microsoft $MILESTONE $MINE is:issue is:closed reason:completed label:engineering -label:on-release-notes\r\norg:microsoft $MILESTONE $MINE is:issue is:closed reason:completed label:plan-item -label:on-release-notes"
  }
]
```

--------------------------------------------------------------------------------

---[FILE: .vscode/notebooks/my-work.github-issues]---
Location: vscode-main/.vscode/notebooks/my-work.github-issues

```text
[
  {
    "kind": 1,
    "language": "markdown",
    "value": "##### `Config`: This should be changed every month/milestone"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "// list of repos we work in\n$REPOS=repo:microsoft/lsprotocol repo:microsoft/monaco-editor repo:microsoft/vscode repo:microsoft/vscode-anycode repo:microsoft/vscode-autopep8 repo:microsoft/vscode-black-formatter repo:microsoft/vscode-copilot repo:microsoft/vscode-copilot-release repo:microsoft/vscode-dev repo:microsoft/vscode-dev-chrome-launcher repo:microsoft/vscode-emmet-helper repo:microsoft/vscode-extension-telemetry repo:microsoft/vscode-flake8 repo:microsoft/vscode-github-issue-notebooks repo:microsoft/vscode-hexeditor repo:microsoft/vscode-internalbacklog repo:microsoft/vscode-isort repo:microsoft/vscode-js-debug repo:microsoft/vscode-jupyter repo:microsoft/vscode-jupyter-internal repo:microsoft/vscode-l10n repo:microsoft/vscode-livepreview repo:microsoft/vscode-markdown-languageservice repo:microsoft/vscode-markdown-tm-grammar repo:microsoft/vscode-mypy repo:microsoft/vscode-pull-request-github repo:microsoft/vscode-pylint repo:microsoft/vscode-python repo:microsoft/vscode-python-debugger repo:microsoft/vscode-python-tools-extension-template repo:microsoft/vscode-references-view repo:microsoft/vscode-remote-release repo:microsoft/vscode-remote-repositories-github repo:microsoft/vscode-remote-tunnels repo:microsoft/vscode-remotehub repo:microsoft/vscode-settings-sync-server repo:microsoft/vscode-unpkg repo:microsoft/vscode-vsce repo:microsoft/vscode-copilot-issues repo:microsoft/vscode-extension-samples\n\n// current milestone name\n$MILESTONE=milestone:\"October 2025\"\n"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Milestone Work"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$REPOS $MILESTONE assignee:@me is:open\n"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Bugs, Debt, Features..."
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "#### My Bugs"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$REPOS assignee:@me is:open label:bug\n"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "#### Debt & Engineering"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$REPOS assignee:@me is:open label:debt,engineering\n"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "#### Performance 🐌 🔜 🏎"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$REPOS assignee:@me is:open label:perf,perf-startup,perf-bloat,freeze-slow-crash-leak\n"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "#### Feature Requests"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$REPOS assignee:@me is:open label:feature-request milestone:Backlog sort:reactions-+1-desc\n"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$REPOS assignee:@me is:open milestone:\"Backlog Candidates\"\n"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "### Personal Inbox"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "#### Triage Needed"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$REPOS is:open assignee:@me label:triage-needed\n"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "\n#### Missing Type label"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$REPOS assignee:@me is:open type:issue -label:bug -label:\"info-needed\" -label:feature-request -label:under-discussion -label:debt -label:plan-item -label:upstream -label:polish -label:testplan-item -label:error-telemetry -label:engineering\n"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "#### Missing Area Label\n\nFeature area labels are light or strong blue (`1d76db` or `c5def5`) and they denote a specific feature or feature area, like `editor-clipboard` or `file-explorer`"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode assignee:@me is:open type:issue -label:\"info-needed\" -label:api -label:api-finalization -label:api-proposal -label:authentication -label:bisect-ext -label:bracket-pair-colorization -label:bracket-pair-guides -label:breadcrumbs -label:callhierarchy -label:chrome-devtools -label:code-lens -label:command-center -label:comments -label:config -label:context-keys -label:custom-editors -label:debug -label:debug-console -label:debug-disassembly -label:dialogs -label:diff-editor -label:dropdown -label:editor-api -label:editor-autoclosing -label:editor-autoindent -label:editor-bracket-matching -label:editor-clipboard -label:editor-code-actions -label:editor-color-picker -label:editor-columnselect -label:editor-commands -label:editor-comments -label:editor-contrib -label:editor-core -label:editor-drag-and-drop -label:editor-error-widget -label:editor-find -label:editor-folding -label:editor-highlight -label:editor-hover -label:editor-indent-detection -label:editor-indent-guides -label:editor-input -label:editor-input-IME -label:editor-insets -label:editor-minimap -label:editor-multicursor -label:editor-parameter-hints -label:editor-render-whitespace -label:editor-rendering -label:editor-RTL -label:editor-scrollbar -label:editor-sorting -label:editor-sticky-scroll -label:editor-sticky-scroll-decorations -label:editor-symbols -label:editor-synced-region -label:editor-textbuffer -label:editor-theming -label:editor-wordnav -label:editor-wrapping -label:emmet-parse -label:extension-activation -label:extension-host -label:extension-prerelease -label:extension-recommendations -label:extension-signature -label:extensions -label:extensions-development -label:file-decorations -label:file-encoding -label:file-explorer -label:file-glob -label:file-io -label:file-nesting -label:file-watcher -label:font-rendering -label:formatting -label:getting-started -label:ghost-text -label:git -label:github -label:github-repositories -label:gpu -label:grammar -label:grid-widget -label:icon-brand -label:icons-product -label:icons-widget -label:inlay-hints -label:inline-chat -label:inline-completions -label:install-update -label:intellisense-config -label:interactive-playground -label:interactive-window -label:javascript -label:json -label:json-sorting -label:keybindings -label:keybindings-editor -label:keyboard-layout -label:L10N -label:l10n-platform -label:label-provider -label:languages-basic -label:languages-diagnostics -label:languages-guessing -label:layout -label:lcd-text-rendering -label:list-widget -label:live-preview -label:log -label:markdown -label:marketplace -label:menus -label:merge-conflict -label:merge-editor -label:merge-editor-workbench -label:monaco-editor -label:multi-monitor -label:native-file-dialog -label:network -label:notebook -label:notebook-accessibility -label:notebook-api -label:notebook-cell-editor -label:notebook-celltoolbar -label:notebook-clipboard -label:notebook-code-actions -label:notebook-commands -label:notebook-debugging -label:notebook-diff -label:notebook-dnd -label:notebook-execution -label:notebook-find -label:notebook-folding -label:notebook-format -label:notebook-getting-started -label:notebook-globaltoolbar -label:notebook-ipynb -label:notebook-kernel -label:notebook-kernel-picker -label:notebook-language -label:notebook-layout -label:notebook-markdown -label:notebook-output -label:notebook-perf -label:notebook-remote -label:notebook-serialization -label:notebook-statusbar -label:notebook-sticky-scroll -label:notebook-toc-outline -label:notebook-undo-redo -label:notebook-variables -label:notebook-workbench-integration -label:notebook-workflow -label:open-editors -label:opener -label:outline -label:output -label:packaging -label:panel-chat -label:perf -label:perf-bloat -label:perf-startup -label:php -label:portable-mode -label:proxy -label:quick-open -label:quick-pick -label:quickpick-chat -label:references-viewlet -label:release-notes -label:remote -label:remote-connection -label:remote-desktop -label:remote-explorer -label:remote-tunnel -label:rename -label:runCommands -label:sandbox -label:sash-widget -label:scm -label:screencast-mode -label:search -label:search-api -label:search-editor -label:search-replace -label:semantic-tokens -label:server -label:settings-editor -label:settings-search -label:settings-sync -label:settings-sync-server -label:shared-process -label:simple-file-dialog -label:smart-select -label:snap -label:snippets -label:splitview-widget -label:ssh -label:suggest -label:system-context-menu -label:table-widget -label:tasks -label:telemetry -label:terminal -label:terminal-accessibility -label:terminal-conpty -label:terminal-editors -label:terminal-external -label:terminal-find -label:terminal-input -label:terminal-layout -label:terminal-links -label:terminal-local-echo -label:terminal-persistence -label:terminal-process -label:terminal-profiles -label:terminal-quick-fix -label:terminal-rendering -label:terminal-shell-bash -label:terminal-shell-cmd -label:terminal-shell-fish -label:terminal-shell-git-bash -label:terminal-shell-integration -label:terminal-shell-pwsh -label:terminal-shell-zsh -label:terminal-tabs -label:testing -label:themes -label:timeline -label:timeline-git -label:timeline-local-history -label:titlebar -label:tokenization -label:touch/pointer -label:trackpad/scroll -label:tree-views -label:tree-widget -label:typescript -label:unc -label:undo-redo -label:unicode-highlight -label:uri -label:user-profiles -label:ux -label:variable-resolving -label:VIM -label:virtual-documents -label:virtual-workspaces -label:vscode-website -label:vscode.dev -label:web -label:webview -label:webview-views -label:workbench-actions -label:workbench-auxwindow -label:workbench-banner -label:workbench-cli -label:workbench-diagnostics -label:workbench-dnd -label:workbench-editor-grid -label:workbench-editor-groups -label:workbench-editor-resolver -label:workbench-editors -label:workbench-electron -label:workbench-fonts -label:workbench-history -label:workbench-hot-exit -label:workbench-hover -label:workbench-launch -label:workbench-link -label:workbench-multiroot -label:workbench-notifications -label:workbench-os-integration -label:workbench-rapid-render -label:workbench-run-as-admin -label:workbench-state -label:workbench-status -label:workbench-tabs -label:workbench-touchbar -label:workbench-untitled-editors -label:workbench-views -label:workbench-voice -label:workbench-welcome -label:workbench-window -label:workbench-workspace -label:workbench-zen -label:workspace-edit -label:workspace-symbols -label:workspace-trust -label:zoom -label:error-list -label:winget -label:cross-file-editing -label:editor-refactor-preview"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "### Missing Milestone"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$REPOS assignee:@me is:open type:issue no:milestone -label:info-needed -label:triage-needed\n"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "#### Not Actionable"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$REPOS assignee:@me is:open label:\"info-needed\"\n"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "### Pull Requests"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "✅ Approved"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$REPOS author:@me is:open is:pr review:approved\n"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "⌛ Pending Approval"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$REPOS author:@me is:open is:pr review:required\n"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "⚠️ Changes Requested"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$REPOS author:@me is:open is:pr review:changes_requested\n"
  }
]
```

--------------------------------------------------------------------------------

---[FILE: .vscode/notebooks/papercuts.github-issues]---
Location: vscode-main/.vscode/notebooks/papercuts.github-issues

```text
[
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Papercuts\n\nThis notebook serves as an ongoing collection of papercut issues that we encounter while dogfooding. With that in mind only promote issues that really turn you off, e.g. issues that make you want to stop using VS Code or its extensions. To mark an issue (bug, feature-request, etc.) as papercut add the labels: `papercut :drop_of_blood:`",
    "editable": true
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## All Papercuts\n\nThese are all papercut issues that we encounter while dogfooding vscode or extensions that we author.",
    "editable": true
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode is:open -label:notebook label:\"papercut :drop_of_blood:\"",
    "editable": true
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "## Native Notebook",
    "editable": true
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode is:open label:notebook label:\"papercut :drop_of_blood:\"",
    "editable": true
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "### My Papercuts",
    "editable": true
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode is:open assignee:@me label:\"papercut :drop_of_blood:\"",
    "editable": true
  }
]
```

--------------------------------------------------------------------------------

---[FILE: .vscode/notebooks/verification.github-issues]---
Location: vscode-main/.vscode/notebooks/verification.github-issues

```text
[
  {
    "kind": 1,
    "language": "markdown",
    "value": "### Bug Verification Queries\n\nBefore shipping we want to verify _all_ bugs. That means when a bug is fixed we check that the fix actually works. It's always best to start with bugs that you have filed and the proceed with bugs that have been filed from users outside the development team. "
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "#### Config: update list of `repos` and the `milestone`"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$repos=repo:microsoft/lsprotocol repo:microsoft/monaco-editor repo:microsoft/vscode repo:microsoft/vscode-anycode repo:microsoft/vscode-autopep8 repo:microsoft/vscode-black-formatter repo:microsoft/vscode-copilot repo:microsoft/vscode-copilot-release repo:microsoft/vscode-dev repo:microsoft/vscode-dev-chrome-launcher repo:microsoft/vscode-emmet-helper repo:microsoft/vscode-extension-telemetry repo:microsoft/vscode-flake8 repo:microsoft/vscode-github-issue-notebooks repo:microsoft/vscode-hexeditor repo:microsoft/vscode-internalbacklog repo:microsoft/vscode-isort repo:microsoft/vscode-js-debug repo:microsoft/vscode-jupyter repo:microsoft/vscode-jupyter-internal repo:microsoft/vscode-l10n repo:microsoft/vscode-livepreview repo:microsoft/vscode-markdown-languageservice repo:microsoft/vscode-markdown-tm-grammar repo:microsoft/vscode-mypy repo:microsoft/vscode-pull-request-github repo:microsoft/vscode-pylint repo:microsoft/vscode-python repo:microsoft/vscode-python-debugger repo:microsoft/vscode-python-tools-extension-template repo:microsoft/vscode-references-view repo:microsoft/vscode-remote-release repo:microsoft/vscode-remote-repositories-github repo:microsoft/vscode-remote-tunnels repo:microsoft/vscode-remotehub repo:microsoft/vscode-settings-sync-server repo:microsoft/vscode-unpkg repo:microsoft/vscode-vsce\n$milestone=milestone:\"October 2025\"\n$closedRecently=closed:>2023-09-29"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "### Bugs You Filed"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$repos $milestone is:closed reason:completed -assignee:@me label:bug -label:verified -label:*duplicate author:@me"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "### Bugs From Outside"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$repos $milestone is:closed reason:completed -assignee:@me label:bug -label:verified -label:*duplicate -author:@me -assignee:@me label:bug -label:verified -author:@me -author:aeschli -author:alexdima -author:alexr00 -author:bpasero -author:chrisdias -author:chrmarti -author:connor4312 -author:dbaeumer -author:deepak1556 -author:eamodio -author:egamma -author:gregvanl -author:isidorn -author:JacksonKearl -author:joaomoreno -author:jrieken -author:lramos15 -author:lszomoru -author:meganrogge -author:misolori -author:mjbvz -author:rebornix -author:RMacfarlane -author:roblourens -author:sana-ajani -author:sandy081 -author:sbatten -author:Tyriar -author:weinand -author:rzhao271 -author:kieferrm -author:TylerLeonhardt -author:bamurtaugh -author:hediet -author:joyceerhl -author:rchiodo"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "### All"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$repos $milestone is:closed reason:completed -assignee:@me label:bug -label:verified -label:*duplicate"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "### Issues recently closed via PR without a milestone"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$repos is:closed linked:pr $closedRecently no:milestone -label:verified -label:*duplicate"
  }
]
```

--------------------------------------------------------------------------------

---[FILE: .vscode/notebooks/vscode-dev.github-issues]---
Location: vscode-main/.vscode/notebooks/vscode-dev.github-issues

```text
[
  {
    "kind": 2,
    "language": "github-issues",
    "value": "$milestone=milestone:\"October 2025\""
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# vscode.dev repo"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-dev $milestone is:open"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-dev milestone:\"Backlog\" is:open"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# VS Code repo"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode label:vscode.dev is:open"
  },
  {
    "kind": 1,
    "language": "markdown",
    "value": "# GitHub Repositories repos"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-remote-repositories-github $milestone is:open"
  },
  {
    "kind": 2,
    "language": "github-issues",
    "value": "repo:microsoft/vscode-remotehub $milestone is:open"
  }
]
```

--------------------------------------------------------------------------------

````

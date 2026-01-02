---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 370
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 370 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/test/common/promptSyntax/testUtils/mockFilesystem.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/promptSyntax/testUtils/mockFilesystem.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { mockFiles, MockFilesystem } from './mockFilesystem.js';
import { URI } from '../../../../../../../base/common/uri.js';
import { Schemas } from '../../../../../../../base/common/network.js';
import { assertDefined } from '../../../../../../../base/common/types.js';
import { FileService } from '../../../../../../../platform/files/common/fileService.js';
import { ILogService, NullLogService } from '../../../../../../../platform/log/common/log.js';
import { IFileService, IFileStat } from '../../../../../../../platform/files/common/files.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../../base/test/common/utils.js';
import { InMemoryFileSystemProvider } from '../../../../../../../platform/files/common/inMemoryFilesystemProvider.js';
import { TestInstantiationService } from '../../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';

/**
 * Base attribute for an expected filesystem node (a file or a folder).
 */
interface IExpectedFilesystemNode extends Pick<
	IFileStat,
	'resource' | 'name' | 'isFile' | 'isDirectory' | 'isSymbolicLink'
> { }

/**
 * Represents an expected `file` info.
 */
interface IExpectedFile extends IExpectedFilesystemNode {
	/**
	 * Expected file contents.
	 */
	contents: string;
}

/**
 * Represents an expected `folder` info.
 */
interface IExpectedFolder extends IExpectedFilesystemNode {
	/**
	 * Expected folder children.
	 */
	children: (IExpectedFolder | IExpectedFile)[];
}

/**
 * Validates that file at {@link filePath} has expected attributes.
 */
async function validateFile(
	filePath: string,
	expectedFile: IExpectedFile,
	fileService: IFileService,
) {
	let readFile: IFileStat | undefined;
	try {
		readFile = await fileService.resolve(URI.file(filePath));
	} catch (error) {
		throw new Error(`Failed to read file '${filePath}': ${error}.`);
	}

	assert.strictEqual(
		readFile.name,
		expectedFile.name,
		`File '${filePath}' must have correct 'name'.`,
	);

	assert.deepStrictEqual(
		readFile.resource,
		expectedFile.resource,
		`File '${filePath}' must have correct 'URI'.`,
	);

	assert.strictEqual(
		readFile.isFile,
		expectedFile.isFile,
		`File '${filePath}' must have correct 'isFile' value.`,
	);

	assert.strictEqual(
		readFile.isDirectory,
		expectedFile.isDirectory,
		`File '${filePath}' must have correct 'isDirectory' value.`,
	);

	assert.strictEqual(
		readFile.isSymbolicLink,
		expectedFile.isSymbolicLink,
		`File '${filePath}' must have correct 'isSymbolicLink' value.`,
	);

	assert.strictEqual(
		readFile.children,
		undefined,
		`File '${filePath}' must not have children.`,
	);

	const fileContents = await fileService.readFile(readFile.resource);
	assert.strictEqual(
		fileContents.value.toString(),
		expectedFile.contents,
		`File '${expectedFile.resource.fsPath}' must have correct contents.`,
	);
}

/**
 * Validates that folder at {@link folderPath} has expected attributes.
 */
async function validateFolder(
	folderPath: string,
	expectedFolder: IExpectedFolder,
	fileService: IFileService,
): Promise<void> {
	let readFolder: IFileStat | undefined;
	try {
		readFolder = await fileService.resolve(URI.file(folderPath));
	} catch (error) {
		throw new Error(`Failed to read folder '${folderPath}': ${error}.`);
	}

	assert.strictEqual(
		readFolder.name,
		expectedFolder.name,
		`Folder '${folderPath}' must have correct 'name'.`,
	);

	assert.deepStrictEqual(
		readFolder.resource,
		expectedFolder.resource,
		`Folder '${folderPath}' must have correct 'URI'.`,
	);

	assert.strictEqual(
		readFolder.isFile,
		expectedFolder.isFile,
		`Folder '${folderPath}' must have correct 'isFile' value.`,
	);

	assert.strictEqual(
		readFolder.isDirectory,
		expectedFolder.isDirectory,
		`Folder '${folderPath}' must have correct 'isDirectory' value.`,
	);

	assert.strictEqual(
		readFolder.isSymbolicLink,
		expectedFolder.isSymbolicLink,
		`Folder '${folderPath}' must have correct 'isSymbolicLink' value.`,
	);

	assertDefined(
		readFolder.children,
		`Folder '${folderPath}' must have children.`,
	);

	assert.strictEqual(
		readFolder.children.length,
		expectedFolder.children.length,
		`Folder '${folderPath}' must have correct number of children.`,
	);

	for (const expectedChild of expectedFolder.children) {
		const childPath = URI.joinPath(expectedFolder.resource, expectedChild.name).fsPath;

		if ('children' in expectedChild) {
			await validateFolder(
				childPath,
				expectedChild,
				fileService,
			);

			continue;
		}

		await validateFile(
			childPath,
			expectedChild,
			fileService,
		);
	}
}

suite('MockFilesystem', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let fileService: IFileService;
	setup(async () => {
		instantiationService = disposables.add(new TestInstantiationService());
		instantiationService.stub(ILogService, new NullLogService());

		fileService = disposables.add(instantiationService.createInstance(FileService));
		const fileSystemProvider = disposables.add(new InMemoryFileSystemProvider());
		disposables.add(fileService.registerProvider(Schemas.file, fileSystemProvider));

		instantiationService.stub(IFileService, fileService);
	});

	test('mocks file structure using new simplified format', async () => {
		const mockFilesystem = instantiationService.createInstance(MockFilesystem, [
			{
				path: '/root/folder/file.txt',
				contents: ['contents']
			},
			{
				path: '/root/folder/Subfolder/test.ts',
				contents: ['other contents']
			},
			{
				path: '/root/folder/Subfolder/file.test.ts',
				contents: ['hello test']
			},
			{
				path: '/root/folder/Subfolder/.file-2.TEST.ts',
				contents: ['test hello']
			}
		]);

		await mockFilesystem.mock();

		/**
		 * Validate files and folders next.
		 */

		await validateFolder(
			'/root/folder',
			{
				resource: URI.file('/root/folder'),
				name: 'folder',
				isFile: false,
				isDirectory: true,
				isSymbolicLink: false,
				children: [
					{
						resource: URI.file('/root/folder/file.txt'),
						name: 'file.txt',
						isFile: true,
						isDirectory: false,
						isSymbolicLink: false,
						contents: 'contents',
					},
					{
						resource: URI.file('/root/folder/Subfolder'),
						name: 'Subfolder',
						isFile: false,
						isDirectory: true,
						isSymbolicLink: false,
						children: [
							{
								resource: URI.file('/root/folder/Subfolder/test.ts'),
								name: 'test.ts',
								isFile: true,
								isDirectory: false,
								isSymbolicLink: false,
								contents: 'other contents',
							},
							{
								resource: URI.file('/root/folder/Subfolder/file.test.ts'),
								name: 'file.test.ts',
								isFile: true,
								isDirectory: false,
								isSymbolicLink: false,
								contents: 'hello test',
							},
							{
								resource: URI.file('/root/folder/Subfolder/.file-2.TEST.ts'),
								name: '.file-2.TEST.ts',
								isFile: true,
								isDirectory: false,
								isSymbolicLink: false,
								contents: 'test hello',
							},
						],
					}
				],
			},
			fileService,
		);
	});

	test('can be created using static factory method', async () => {
		await mockFiles(fileService, [
			{
				path: '/simple/test.txt',
				contents: ['line 1', 'line 2', 'line 3']
			}
		]);

		await validateFile(
			'/simple/test.txt',
			{
				resource: URI.file('/simple/test.txt'),
				name: 'test.txt',
				isFile: true,
				isDirectory: false,
				isSymbolicLink: false,
				contents: 'line 1\nline 2\nline 3',
			},
			fileService,
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/promptSyntax/testUtils/mockFilesystem.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/promptSyntax/testUtils/mockFilesystem.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../../../../base/common/uri.js';
import { VSBuffer } from '../../../../../../../base/common/buffer.js';
import { IFileService } from '../../../../../../../platform/files/common/files.js';
import { dirname } from '../../../../../../../base/common/resources.js';

/**
 * Represents a generic file system node.
 */
interface IMockFilesystemNode {
	name: string;
}

/**
 * Represents a `file` node.
 */
export interface IMockFile extends IMockFilesystemNode {
	contents: string | readonly string[];
}

/**
 * Represents a `folder` node.
 */
export interface IMockFolder extends IMockFilesystemNode {
	children: (IMockFolder | IMockFile)[];
}


/**
 * Represents a file entry for simplified initialization.
 */
export interface IMockFileEntry {
	path: string;
	contents: string[];
}

/**
 * Creates mock filesystem from provided file entries.
 * @param fileService File service instance
 * @param files Array of file entries with path and contents
 */
export function mockFiles(fileService: IFileService, files: IMockFileEntry[], parentFolder?: URI): Promise<void> {
	return new MockFilesystem(files, fileService).mock(parentFolder);
}

/**
 * Utility to recursively creates provided filesystem structure.
 */
export class MockFilesystem {

	private createdFiles: URI[] = [];
	private createdFolders: URI[] = [];
	private createdRootFolders: URI[] = [];

	constructor(
		private readonly input: IMockFolder[] | IMockFileEntry[],
		@IFileService private readonly fileService: IFileService,
	) { }



	/**
	 * Starts the mock process.
	 */
	public async mock(parentFolder?: URI): Promise<void> {
		// Check if input is the new simplified format
		if (this.input.length > 0 && 'path' in this.input[0]) {
			return this.mockFromFileEntries(this.input as IMockFileEntry[]);
		}

		// Use the old format
		return this.mockFromFolders(this.input as IMockFolder[], parentFolder);
	}

	/**
	 * Mock using the new simplified file entry format.
	 */
	private async mockFromFileEntries(fileEntries: IMockFileEntry[]): Promise<void> {
		// Create all files and their parent directories
		for (const fileEntry of fileEntries) {
			const fileUri = URI.file(fileEntry.path);

			// Ensure parent directories exist
			await this.ensureParentDirectories(dirname(fileUri));

			// Create the file
			const contents = fileEntry.contents.join('\n');
			await this.fileService.writeFile(fileUri, VSBuffer.fromString(contents));

			this.createdFiles.push(fileUri);
		}
	}

	/**
	 * Mock using the old nested folder format.
	 */
	private async mockFromFolders(folders: IMockFolder[], parentFolder?: URI): Promise<void> {
		const result = await Promise.all(folders.map((folder) => this.mockFolder(folder, parentFolder)));
		this.createdRootFolders.push(...result);
	}

	public async delete(): Promise<void> {
		// Delete files created by the new format
		for (const fileUri of this.createdFiles) {
			if (await this.fileService.exists(fileUri)) {
				await this.fileService.del(fileUri, { useTrash: false });
			}
		}

		for (const folderUri of this.createdFolders.reverse()) { // reverse to delete children first
			if (await this.fileService.exists(folderUri)) {
				await this.fileService.del(folderUri, { recursive: true, useTrash: false });
			}
		}

		// Delete root folders created by the old format
		for (const folder of this.createdRootFolders) {
			await this.fileService.del(folder, { recursive: true, useTrash: false });
		}
	}

	/**
	 * The internal implementation of the filesystem mocking process for the old format.
	 */
	private async mockFolder(folder: IMockFolder, parentFolder?: URI): Promise<URI> {
		const folderUri = parentFolder
			? URI.joinPath(parentFolder, folder.name)
			: URI.file(folder.name);

		if (!(await this.fileService.exists(folderUri))) {
			try {
				await this.fileService.createFolder(folderUri);
			} catch (error) {
				throw new Error(`Failed to create folder '${folderUri.fsPath}': ${error}.`);
			}
		}

		const resolvedChildren: URI[] = [];
		for (const child of folder.children) {
			const childUri = URI.joinPath(folderUri, child.name);
			// create child file
			if ('contents' in child) {
				const contents: string = (typeof child.contents === 'string')
					? child.contents
					: child.contents.join('\n');

				await this.fileService.writeFile(childUri, VSBuffer.fromString(contents));

				resolvedChildren.push(childUri);

				continue;
			}

			// recursively create child filesystem structure
			resolvedChildren.push(await this.mockFolder(child, folderUri));
		}

		return folderUri;
	}

	/**
	 * Ensures that all parent directories of the given file URI exist.
	 */
	private async ensureParentDirectories(dirUri: URI): Promise<void> {
		if (!await this.fileService.exists(dirUri)) {
			if (dirUri.path === '/') {
				try {
					await this.fileService.createFolder(dirUri);
					this.createdFolders.push(dirUri);
				} catch (error) {
					throw new Error(`Failed to create directory '${dirUri.toString()}': ${error}.`);
				}
			} else {
				await this.ensureParentDirectories(dirname(dirUri));
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/promptSyntax/utils/mock.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/promptSyntax/utils/mock.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { mockObject, mockService } from './mock.js';
import { typeCheck } from '../../../../../../../base/common/types.js';
import { randomBoolean } from '../../../../../../../base/test/common/testUtils.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../../base/test/common/utils.js';

suite('mockService', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('mockObject', () => {
		test('overrides properties and functions', () => {
			interface ITestObject {
				foo: string;
				bar: string;
				readonly baz: number;
				someMethod(arg: boolean): string;
				anotherMethod(arg: number): boolean;
			}

			const mock = mockObject<ITestObject>({
				bar: 'oh hi!',
				baz: 42,
				anotherMethod(arg: number): boolean {
					return isNaN(arg);
				},
			});

			typeCheck<ITestObject>(mock);

			assert.strictEqual(
				mock.bar,
				'oh hi!',
				'bar should be overriden',
			);

			assert.strictEqual(
				mock.baz,
				42,
				'baz should be overriden',
			);

			assert(
				!(mock.anotherMethod(490274)),
				'Must execute overriden method correctly 1.',
			);

			assert(
				mock.anotherMethod(NaN),
				'Must execute overriden method correctly 2.',
			);

			assert.throws(() => {
				// property is not overriden so must throw
				// eslint-disable-next-line local/code-no-unused-expressions
				mock.foo;
			});

			assert.throws(() => {
				// function is not overriden so must throw
				mock.someMethod(randomBoolean());
			});
		});

		test('immutability of the overrides object', () => {
			interface ITestObject {
				foo: string;
				bar: string;
				readonly baz: number;
				someMethod(arg: boolean): string;
				anotherMethod(arg: number): boolean;
			}

			const overrides: Partial<ITestObject> = {
				baz: 4,
			};
			const mock = mockObject<ITestObject>(overrides);
			typeCheck<ITestObject>(mock);

			assert.strictEqual(
				mock.baz,
				4,
				'baz should be overridden',
			);

			// overrides object must be immutable
			assert.throws(() => {
				overrides.foo = 'test';
			});

			assert.throws(() => {
				overrides.someMethod = (arg: boolean): string => {
					return `${arg}__${arg}`;
				};
			});
		});
	});

	suite('mockService', () => {
		test('overrides properties and functions', () => {
			interface ITestService {
				readonly _serviceBrand: undefined;
				prop1: string;
				id: string;
				readonly counter: number;
				method1(arg: boolean): string;
				testMethod2(arg: number): boolean;
			}

			const mock = mockService<ITestService>({
				id: 'ciao!',
				counter: 74,
				testMethod2(arg: number): boolean {
					return !isNaN(arg);
				},
			});

			typeCheck<ITestService>(mock);

			assert.strictEqual(
				mock.id,
				'ciao!',
				'id should be overridden',
			);

			assert.strictEqual(
				mock.counter,
				74,
				'counter should be overridden',
			);

			assert(
				mock.testMethod2(74368),
				'Must execute overridden method correctly 1.',
			);

			assert(
				!(mock.testMethod2(NaN)),
				'Must execute overridden method correctly 2.',
			);

			assert.throws(() => {
				// property is not overridden so must throw
				// eslint-disable-next-line local/code-no-unused-expressions
				mock.prop1;
			});

			assert.throws(() => {
				// function is not overridden so must throw
				mock.method1(randomBoolean());
			});
		});

		test('immutability of the overrides object', () => {
			interface ITestService {
				readonly _serviceBrand: undefined;
				foo: string;
				bar: string;
				readonly baz: boolean;
				someMethod(arg: boolean): string;
				anotherMethod(arg: number): boolean;
			}

			const overrides: Partial<ITestService> = {
				baz: false,
			};
			const mock = mockService<ITestService>(overrides);
			typeCheck<ITestService>(mock);

			assert.strictEqual(
				mock.baz,
				false,
				'baz should be overridden',
			);

			// overrides object must be immutable
			assert.throws(() => {
				overrides.foo = 'test';
			});

			assert.throws(() => {
				overrides.someMethod = (arg: boolean): string => {
					return `${arg}__${arg}`;
				};
			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/promptSyntax/utils/mock.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/promptSyntax/utils/mock.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { assert } from '../../../../../../../base/common/assert.js';
import { isOneOf } from '../../../../../../../base/common/types.js';



/**
 * Mocks an `TObject` with the provided `overrides`.
 *
 * If you need to mock an `Service`, please use {@link mockService}
 * instead which provides better type safety guarantees for the case.
 *
 * @throws Reading non-overridden property or function on `TObject` throws an error.
 */
export function mockObject<TObject extends object>(
	overrides: Partial<TObject>,
): TObject {
	// ensure that the overrides object cannot be modified afterward
	overrides = Object.freeze(overrides);

	const keys: (keyof Partial<TObject>)[] = [];
	for (const key in overrides) {
		if (Object.hasOwn(overrides, key)) {
			keys.push(key);
		}
	}

	const mocked: object = new Proxy(
		{},
		{
			get: <T extends keyof TObject>(
				_target: TObject,
				key: string | number | Symbol,
			): TObject[T] => {
				assert(
					isOneOf(key, keys),
					`The '${key}' is not mocked.`,
				);

				// note! it's ok to type assert here, because of the explicit runtime
				//       assertion  above
				return overrides[key as T] as TObject[T];
			},
		});

	// note! it's ok to type assert here, because of the runtime checks in
	//       the `Proxy` getter
	return mocked as TObject;
}

/**
 * Type for any service.
 */
type TAnyService = {
	readonly _serviceBrand: undefined;
};

/**
 * Mocks provided service with the provided `overrides`.
 * Same as more generic {@link mockObject} utility, but with
 * the service constraint on the `TService` type.
 *
 * @throws Reading non-overridden property or function
 * 		   on `TService` throws an error.
 */
export function mockService<TService extends TAnyService>(
	overrides: Partial<TService>,
): TService {
	return mockObject(overrides);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/promptSyntax/utils/promptFilesLocator.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/promptSyntax/utils/promptFilesLocator.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken } from '../../../../../../../base/common/cancellation.js';
import { match } from '../../../../../../../base/common/glob.js';
import { Schemas } from '../../../../../../../base/common/network.js';
import { basename, relativePath } from '../../../../../../../base/common/resources.js';
import { URI } from '../../../../../../../base/common/uri.js';
import { mock } from '../../../../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../../base/test/common/utils.js';
import { IConfigurationOverrides, IConfigurationService } from '../../../../../../../platform/configuration/common/configuration.js';
import { IFileService } from '../../../../../../../platform/files/common/files.js';
import { FileService } from '../../../../../../../platform/files/common/fileService.js';
import { InMemoryFileSystemProvider } from '../../../../../../../platform/files/common/inMemoryFilesystemProvider.js';
import { TestInstantiationService } from '../../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ILogService, NullLogService } from '../../../../../../../platform/log/common/log.js';
import { IWorkspace, IWorkspaceContextService, IWorkspaceFolder } from '../../../../../../../platform/workspace/common/workspace.js';
import { IWorkbenchEnvironmentService } from '../../../../../../services/environment/common/environmentService.js';
import { IFileMatch, IFileQuery, ISearchService } from '../../../../../../services/search/common/search.js';
import { IUserDataProfileService } from '../../../../../../services/userDataProfile/common/userDataProfile.js';
import { PromptsConfig } from '../../../../common/promptSyntax/config/config.js';
import { PromptsType } from '../../../../common/promptSyntax/promptTypes.js';
import { isValidGlob, PromptFilesLocator } from '../../../../common/promptSyntax/utils/promptFilesLocator.js';
import { IMockFolder, MockFilesystem } from '../testUtils/mockFilesystem.js';
import { mockService } from './mock.js';
import { TestUserDataProfileService } from '../../../../../../test/common/workbenchTestServices.js';
import { PromptsStorage } from '../../../../common/promptSyntax/service/promptsService.js';
import { runWithFakedTimers } from '../../../../../../../base/test/common/timeTravelScheduler.js';

/**
 * Mocked instance of {@link IConfigurationService}.
 */
function mockConfigService<T>(value: T): IConfigurationService {
	return mockService<IConfigurationService>({
		getValue(key?: string | IConfigurationOverrides) {
			assert(
				typeof key === 'string',
				`Expected string configuration key, got '${typeof key}'.`,
			);
			if ('explorer.excludeGitIgnore' === key) {
				return false;
			}

			assert(
				[PromptsConfig.PROMPT_LOCATIONS_KEY, PromptsConfig.INSTRUCTIONS_LOCATION_KEY, PromptsConfig.MODE_LOCATION_KEY].includes(key),
				`Unsupported configuration key '${key}'.`,
			);

			return value;
		},
	});
}

/**
 * Mocked instance of {@link IWorkspaceContextService}.
 */
function mockWorkspaceService(folders: IWorkspaceFolder[]): IWorkspaceContextService {
	return mockService<IWorkspaceContextService>({
		getWorkspace(): IWorkspace {
			return new class extends mock<IWorkspace>() {
				override folders = folders;
			};
		},
		getWorkspaceFolder(): IWorkspaceFolder | null {
			return null;
		}

	});
}

function testT(name: string, fn: () => Promise<void>): Mocha.Test {
	return test(name, () => runWithFakedTimers({ useFakeTimers: true }, fn));
}

suite('PromptFilesLocator', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	// if (isWindows) {
	// 	return;
	// }

	let instantiationService: TestInstantiationService;
	setup(async () => {
		instantiationService = disposables.add(new TestInstantiationService());
		instantiationService.stub(ILogService, new NullLogService());

		const fileService = disposables.add(instantiationService.createInstance(FileService));
		const fileSystemProvider = disposables.add(new InMemoryFileSystemProvider());
		disposables.add(fileService.registerProvider(Schemas.file, fileSystemProvider));

		instantiationService.stub(IFileService, fileService);
	});

	/**
	 * Create a new instance of {@link PromptFilesLocator} with provided mocked
	 * values for configuration and workspace services.
	 */
	const createPromptsLocator = async (configValue: unknown, workspaceFolderPaths: string[], filesystem: IMockFolder[]) => {

		const mockFs = instantiationService.createInstance(MockFilesystem, filesystem);
		await mockFs.mock();

		instantiationService.stub(IConfigurationService, mockConfigService(configValue));

		const workspaceFolders = workspaceFolderPaths.map((path, index) => {
			const uri = URI.file(path);

			return new class extends mock<IWorkspaceFolder>() {
				override uri = uri;
				override name = basename(uri);
				override index = index;
			};
		});
		instantiationService.stub(IWorkspaceContextService, mockWorkspaceService(workspaceFolders));
		instantiationService.stub(IWorkbenchEnvironmentService, {} as IWorkbenchEnvironmentService);
		instantiationService.stub(IUserDataProfileService, new TestUserDataProfileService());
		instantiationService.stub(ISearchService, {
			async fileSearch(query: IFileQuery) {
				// mock the search service
				const fs = instantiationService.get(IFileService);
				const findFilesInLocation = async (location: URI, results: URI[] = []) => {
					try {
						const resolve = await fs.resolve(location);
						if (resolve.isFile) {
							results.push(resolve.resource);
						} else if (resolve.isDirectory && resolve.children) {
							for (const child of resolve.children) {
								await findFilesInLocation(child.resource, results);
							}
						}
					} catch (error) {
					}
					return results;
				};
				const results: IFileMatch[] = [];
				for (const folderQuery of query.folderQueries) {
					const allFiles = await findFilesInLocation(folderQuery.folder);
					for (const resource of allFiles) {
						const pathInFolder = relativePath(folderQuery.folder, resource) ?? '';
						if (query.filePattern === undefined || match(query.filePattern, pathInFolder)) {
							results.push({ resource });
						}
					}

				}
				return { results, messages: [] };
			}
		});

		const locator = instantiationService.createInstance(PromptFilesLocator);

		return {
			async listFiles(type: PromptsType, storage: PromptsStorage, token: CancellationToken): Promise<readonly URI[]> {
				return locator.listFiles(type, storage, token);
			},
			getConfigBasedSourceFolders(type: PromptsType): readonly URI[] {
				return locator.getConfigBasedSourceFolders(type);
			},
			async disposeAsync(): Promise<void> {
				await mockFs.delete();
			}
		};
	};

	suite('empty workspace', () => {
		const EMPTY_WORKSPACE: string[] = [];

		suite('empty filesystem', () => {
			testT('no config value', async () => {
				const locator = await createPromptsLocator(undefined, EMPTY_WORKSPACE, []);

				assertOutcome(
					await locator.listFiles(PromptsType.prompt, PromptsStorage.local, CancellationToken.None),
					[],
					'No prompts must be found.',
				);
				await locator.disposeAsync();
			});

			testT('object config value', async () => {
				const locator = await createPromptsLocator({
					'/Users/legomushroom/repos/prompts/': true,
					'/tmp/prompts/': false,
				}, EMPTY_WORKSPACE, []);

				assertOutcome(
					await locator.listFiles(PromptsType.prompt, PromptsStorage.local, CancellationToken.None),
					[],
					'No prompts must be found.',
				);
				await locator.disposeAsync();
			});

			testT('array config value', async () => {
				const locator = await createPromptsLocator([
					'relative/path/to/prompts/',
					'/abs/path',
				], EMPTY_WORKSPACE, []);

				assertOutcome(
					await locator.listFiles(PromptsType.prompt, PromptsStorage.local, CancellationToken.None),
					[],
					'No prompts must be found.',
				);
				await locator.disposeAsync();
			});

			testT('null config value', async () => {
				const locator = await createPromptsLocator(null, EMPTY_WORKSPACE, []);

				assertOutcome(
					await locator.listFiles(PromptsType.prompt, PromptsStorage.local, CancellationToken.None),
					[],
					'No prompts must be found.',
				);
				await locator.disposeAsync();
			});

			testT('string config value', async () => {
				const locator = await createPromptsLocator('/etc/hosts/prompts', EMPTY_WORKSPACE, []);

				assertOutcome(
					await locator.listFiles(PromptsType.prompt, PromptsStorage.local, CancellationToken.None),
					[],
					'No prompts must be found.',
				);
				await locator.disposeAsync();
			});
		});

		suite('non-empty filesystem', () => {
			testT('core logic', async () => {
				const locator = await createPromptsLocator(
					{
						'/Users/legomushroom/repos/prompts': true,
						'/tmp/prompts/': true,
						'/absolute/path/prompts': false,
						'.copilot/prompts': true,
					},
					EMPTY_WORKSPACE,
					[
						{
							name: '/Users/legomushroom/repos/prompts',
							children: [
								{
									name: 'test.prompt.md',
									contents: 'Hello, World!',
								},
								{
									name: 'refactor-tests.prompt.md',
									contents: 'some file content goes here',
								},
							],
						},
						{
							name: '/tmp/prompts',
							children: [
								{
									name: 'translate.to-rust.prompt.md',
									contents: 'some more random file contents',
								},
							],
						},
						{
							name: '/absolute/path/prompts',
							children: [
								{
									name: 'some-prompt-file.prompt.md',
									contents: 'hey hey hey',
								},
							],
						},
					]);

				assertOutcome(
					await locator.listFiles(PromptsType.prompt, PromptsStorage.local, CancellationToken.None),
					[
						'/Users/legomushroom/repos/prompts/test.prompt.md',
						'/Users/legomushroom/repos/prompts/refactor-tests.prompt.md',
						'/tmp/prompts/translate.to-rust.prompt.md'
					],
					'Must find correct prompts.',
				);
				await locator.disposeAsync();
			});

			suite('absolute', () => {
				testT('wild card', async () => {
					const settings = [
						'/Users/legomushroom/repos/vscode/**',
						'/Users/legomushroom/repos/vscode/**/*.prompt.md',
						'/Users/legomushroom/repos/vscode/**/*.md',
						'/Users/legomushroom/repos/vscode/**/*',
						'/Users/legomushroom/repos/vscode/deps/**',
						'/Users/legomushroom/repos/vscode/deps/**/*.prompt.md',
						'/Users/legomushroom/repos/vscode/deps/**/*',
						'/Users/legomushroom/repos/vscode/deps/**/*.md',
						'/Users/legomushroom/repos/vscode/**/text/**',
						'/Users/legomushroom/repos/vscode/**/text/**/*',
						'/Users/legomushroom/repos/vscode/**/text/**/*.md',
						'/Users/legomushroom/repos/vscode/**/text/**/*.prompt.md',
						'/Users/legomushroom/repos/vscode/deps/text/**',
						'/Users/legomushroom/repos/vscode/deps/text/**/*',
						'/Users/legomushroom/repos/vscode/deps/text/**/*.md',
						'/Users/legomushroom/repos/vscode/deps/text/**/*.prompt.md',
					];

					for (const setting of settings) {
						const locator = await createPromptsLocator(
							{ [setting]: true },
							EMPTY_WORKSPACE,
							[
								{
									name: '/Users/legomushroom/repos/vscode',
									children: [
										{
											name: 'deps/text',
											children: [
												{
													name: 'my.prompt.md',
													contents: 'oh hi, bot!',
												},
												{
													name: 'nested',
													children: [
														{
															name: 'specific.prompt.md',
															contents: 'oh hi, bot!',
														},
														{
															name: 'unspecific1.prompt.md',
															contents: 'oh hi, robot!',
														},
														{
															name: 'unspecific2.prompt.md',
															contents: 'oh hi, rabot!',
														},
														{
															name: 'readme.md',
															contents: 'non prompt file',
														},
													],
												}
											],
										},
									],
								},
							],
						);

						assertOutcome(
							await locator.listFiles(PromptsType.prompt, PromptsStorage.local, CancellationToken.None),
							[
								'/Users/legomushroom/repos/vscode/deps/text/my.prompt.md',
								'/Users/legomushroom/repos/vscode/deps/text/nested/specific.prompt.md',
								'/Users/legomushroom/repos/vscode/deps/text/nested/unspecific1.prompt.md',
								'/Users/legomushroom/repos/vscode/deps/text/nested/unspecific2.prompt.md',
							],
							'Must find correct prompts.',
						);
						await locator.disposeAsync();
					}
				});

				testT(`specific`, async () => {
					const testSettings = [
						[
							'/Users/legomushroom/repos/vscode/**/*specific*',
						],
						[
							'/Users/legomushroom/repos/vscode/**/*specific*.prompt.md',
						],
						[
							'/Users/legomushroom/repos/vscode/**/*specific*.md',
						],
						[
							'/Users/legomushroom/repos/vscode/**/specific*',
							'/Users/legomushroom/repos/vscode/**/unspecific1.prompt.md',
							'/Users/legomushroom/repos/vscode/**/unspecific2.prompt.md',
						],
						[
							'/Users/legomushroom/repos/vscode/**/specific.prompt.md',
							'/Users/legomushroom/repos/vscode/**/unspecific*.prompt.md',
						],
						[
							'/Users/legomushroom/repos/vscode/**/nested/specific.prompt.md',
							'/Users/legomushroom/repos/vscode/**/nested/unspecific*.prompt.md',
						],
						[
							'/Users/legomushroom/repos/vscode/**/nested/*specific*',
						],
						[
							'/Users/legomushroom/repos/vscode/**/*spec*.prompt.md',
						],
						[
							'/Users/legomushroom/repos/vscode/**/*spec*',
						],
						[
							'/Users/legomushroom/repos/vscode/**/*spec*.md',
						],
						[
							'/Users/legomushroom/repos/vscode/**/deps/**/*spec*.md',
						],
						[
							'/Users/legomushroom/repos/vscode/**/text/**/*spec*.md',
						],
						[
							'/Users/legomushroom/repos/vscode/deps/text/nested/*spec*',
						],
						[
							'/Users/legomushroom/repos/vscode/deps/text/nested/*specific*',
						],
						[
							'/Users/legomushroom/repos/vscode/deps/**/*specific*',
						],
						[
							'/Users/legomushroom/repos/vscode/deps/**/specific*',
							'/Users/legomushroom/repos/vscode/deps/**/unspecific*.prompt.md',
						],
						[
							'/Users/legomushroom/repos/vscode/deps/**/specific*.md',
							'/Users/legomushroom/repos/vscode/deps/**/unspecific*.md',
						],
						[
							'/Users/legomushroom/repos/vscode/deps/**/specific.prompt.md',
							'/Users/legomushroom/repos/vscode/deps/**/unspecific1.prompt.md',
							'/Users/legomushroom/repos/vscode/deps/**/unspecific2.prompt.md',
						],
						[
							'/Users/legomushroom/repos/vscode/deps/**/specific.prompt.md',
							'/Users/legomushroom/repos/vscode/deps/**/unspecific1*.md',
							'/Users/legomushroom/repos/vscode/deps/**/unspecific2*.md',
						],
						[
							'/Users/legomushroom/repos/vscode/deps/text/**/*specific*',
						],
						[
							'/Users/legomushroom/repos/vscode/deps/text/**/specific*',
							'/Users/legomushroom/repos/vscode/deps/text/**/unspecific*.prompt.md',
						],
						[
							'/Users/legomushroom/repos/vscode/deps/text/**/specific*.md',
							'/Users/legomushroom/repos/vscode/deps/text/**/unspecific*.md',
						],
						[
							'/Users/legomushroom/repos/vscode/deps/text/**/specific.prompt.md',
							'/Users/legomushroom/repos/vscode/deps/text/**/unspecific1.prompt.md',
							'/Users/legomushroom/repos/vscode/deps/text/**/unspecific2.prompt.md',
						],
						[
							'/Users/legomushroom/repos/vscode/deps/text/**/specific.prompt.md',
							'/Users/legomushroom/repos/vscode/deps/text/**/unspecific1*.md',
							'/Users/legomushroom/repos/vscode/deps/text/**/unspecific2*.md',
						],
					];

					for (const settings of testSettings) {
						const vscodeSettings: Record<string, boolean> = {};
						for (const setting of settings) {
							vscodeSettings[setting] = true;
						}

						const locator = await createPromptsLocator(
							vscodeSettings,
							EMPTY_WORKSPACE,
							[
								{
									name: '/Users/legomushroom/repos/vscode',
									children: [
										{
											name: 'deps/text',
											children: [
												{
													name: 'my.prompt.md',
													contents: 'oh hi, bot!',
												},
												{
													name: 'nested',
													children: [
														{
															name: 'default.prompt.md',
															contents: 'oh hi, bot!',
														},
														{
															name: 'specific.prompt.md',
															contents: 'oh hi, bot!',
														},
														{
															name: 'unspecific1.prompt.md',
															contents: 'oh hi, robot!',
														},
														{
															name: 'unspecific2.prompt.md',
															contents: 'oh hi, rawbot!',
														},
														{
															name: 'readme.md',
															contents: 'non prompt file',
														},
													],
												}
											],
										},
									],
								},
							],
						);

						assertOutcome(
							await locator.listFiles(PromptsType.prompt, PromptsStorage.local, CancellationToken.None),
							[
								'/Users/legomushroom/repos/vscode/deps/text/nested/specific.prompt.md',
								'/Users/legomushroom/repos/vscode/deps/text/nested/unspecific1.prompt.md',
								'/Users/legomushroom/repos/vscode/deps/text/nested/unspecific2.prompt.md',
							],
							'Must find correct prompts.',
						);
						await locator.disposeAsync();
					}
				});
			});
		});
	});

	suite('single-root workspace', () => {
		suite('glob pattern', () => {
			suite('relative', () => {
				testT('wild card', async () => {
					const testSettings = [
						'**',
						'**/*.prompt.md',
						'**/*.md',
						'**/*',
						'deps/**',
						'deps/**/*.prompt.md',
						'deps/**/*',
						'deps/**/*.md',
						'**/text/**',
						'**/text/**/*',
						'**/text/**/*.md',
						'**/text/**/*.prompt.md',
						'deps/text/**',
						'deps/text/**/*',
						'deps/text/**/*.md',
						'deps/text/**/*.prompt.md',
					];

					for (const setting of testSettings) {
						const locator = await createPromptsLocator(
							{ [setting]: true },
							['/Users/legomushroom/repos/vscode'],
							[
								{
									name: '/Users/legomushroom/repos/vscode',
									children: [
										{
											name: 'deps/text',
											children: [
												{
													name: 'my.prompt.md',
													contents: 'oh hi, bot!',
												},
												{
													name: 'nested',
													children: [
														{
															name: 'specific.prompt.md',
															contents: 'oh hi, bot!',
														},
														{
															name: 'unspecific1.prompt.md',
															contents: 'oh hi, robot!',
														},
														{
															name: 'unspecific2.prompt.md',
															contents: 'oh hi, rabot!',
														},
														{
															name: 'readme.md',
															contents: 'non prompt file',
														},
													],
												}
											],
										},
									],
								},
							],
						);

						assertOutcome(
							await locator.listFiles(PromptsType.prompt, PromptsStorage.local, CancellationToken.None),
							[
								'/Users/legomushroom/repos/vscode/deps/text/my.prompt.md',
								'/Users/legomushroom/repos/vscode/deps/text/nested/specific.prompt.md',
								'/Users/legomushroom/repos/vscode/deps/text/nested/unspecific1.prompt.md',
								'/Users/legomushroom/repos/vscode/deps/text/nested/unspecific2.prompt.md',
							],
							'Must find correct prompts.',
						);
						await locator.disposeAsync();

					}
				});

				testT(`specific`, async () => {
					const testSettings = [
						[
							'**/*specific*',
						],
						[
							'**/*specific*.prompt.md',
						],
						[
							'**/*specific*.md',
						],
						[
							'**/specific*',
							'**/unspecific1.prompt.md',
							'**/unspecific2.prompt.md',
						],
						[
							'**/specific.prompt.md',
							'**/unspecific*.prompt.md',
						],
						[
							'**/nested/specific.prompt.md',
							'**/nested/unspecific*.prompt.md',
						],
						[
							'**/nested/*specific*',
						],
						[
							'**/*spec*.prompt.md',
						],
						[
							'**/*spec*',
						],
						[
							'**/*spec*.md',
						],
						[
							'**/deps/**/*spec*.md',
						],
						[
							'**/text/**/*spec*.md',
						],
						[
							'deps/text/nested/*spec*',
						],
						[
							'deps/text/nested/*specific*',
						],
						[
							'deps/**/*specific*',
						],
						[
							'deps/**/specific*',
							'deps/**/unspecific*.prompt.md',
						],
						[
							'deps/**/specific*.md',
							'deps/**/unspecific*.md',
						],
						[
							'deps/**/specific.prompt.md',
							'deps/**/unspecific1.prompt.md',
							'deps/**/unspecific2.prompt.md',
						],
						[
							'deps/**/specific.prompt.md',
							'deps/**/unspecific1*.md',
							'deps/**/unspecific2*.md',
						],
						[
							'deps/text/**/*specific*',
						],
						[
							'deps/text/**/specific*',
							'deps/text/**/unspecific*.prompt.md',
						],
						[
							'deps/text/**/specific*.md',
							'deps/text/**/unspecific*.md',
						],
						[
							'deps/text/**/specific.prompt.md',
							'deps/text/**/unspecific1.prompt.md',
							'deps/text/**/unspecific2.prompt.md',
						],
						[
							'deps/text/**/specific.prompt.md',
							'deps/text/**/unspecific1*.md',
							'deps/text/**/unspecific2*.md',
						],
					];

					for (const settings of testSettings) {
						const vscodeSettings: Record<string, boolean> = {};
						for (const setting of settings) {
							vscodeSettings[setting] = true;
						}

						const locator = await createPromptsLocator(
							vscodeSettings,
							['/Users/legomushroom/repos/vscode'],
							[
								{
									name: '/Users/legomushroom/repos/vscode',
									children: [
										{
											name: 'deps/text',
											children: [
												{
													name: 'my.prompt.md',
													contents: 'oh hi, bot!',
												},
												{
													name: 'nested',
													children: [
														{
															name: 'default.prompt.md',
															contents: 'oh hi, bot!',
														},
														{
															name: 'specific.prompt.md',
															contents: 'oh hi, bot!',
														},
														{
															name: 'unspecific1.prompt.md',
															contents: 'oh hi, robot!',
														},
														{
															name: 'unspecific2.prompt.md',
															contents: 'oh hi, rawbot!',
														},
														{
															name: 'readme.md',
															contents: 'non prompt file',
														},
													],
												}
											],
										},
									],
								},
							],
						);

						assertOutcome(
							await locator.listFiles(PromptsType.prompt, PromptsStorage.local, CancellationToken.None),
							[
								'/Users/legomushroom/repos/vscode/deps/text/nested/specific.prompt.md',
								'/Users/legomushroom/repos/vscode/deps/text/nested/unspecific1.prompt.md',
								'/Users/legomushroom/repos/vscode/deps/text/nested/unspecific2.prompt.md',
							],
							'Must find correct prompts.',
						);
						await locator.disposeAsync();
					}
				});
			});

			suite('absolute', () => {
				testT('wild card', async () => {
					const settings = [
						'/Users/legomushroom/repos/vscode/**',
						'/Users/legomushroom/repos/vscode/**/*.prompt.md',
						'/Users/legomushroom/repos/vscode/**/*.md',
						'/Users/legomushroom/repos/vscode/**/*',
						'/Users/legomushroom/repos/vscode/deps/**',
						'/Users/legomushroom/repos/vscode/deps/**/*.prompt.md',
						'/Users/legomushroom/repos/vscode/deps/**/*',
						'/Users/legomushroom/repos/vscode/deps/**/*.md',
						'/Users/legomushroom/repos/vscode/**/text/**',
						'/Users/legomushroom/repos/vscode/**/text/**/*',
						'/Users/legomushroom/repos/vscode/**/text/**/*.md',
						'/Users/legomushroom/repos/vscode/**/text/**/*.prompt.md',
						'/Users/legomushroom/repos/vscode/deps/text/**',
						'/Users/legomushroom/repos/vscode/deps/text/**/*',
						'/Users/legomushroom/repos/vscode/deps/text/**/*.md',
						'/Users/legomushroom/repos/vscode/deps/text/**/*.prompt.md',
					];

					for (const setting of settings) {

						const locator = await createPromptsLocator(
							{ [setting]: true },
							['/Users/legomushroom/repos/vscode'],
							[
								{
									name: '/Users/legomushroom/repos/vscode',
									children: [
										{
											name: 'deps/text',
											children: [
												{
													name: 'my.prompt.md',
													contents: 'oh hi, bot!',
												},
												{
													name: 'nested',
													children: [
														{
															name: 'specific.prompt.md',
															contents: 'oh hi, bot!',
														},
														{
															name: 'unspecific1.prompt.md',
															contents: 'oh hi, robot!',
														},
														{
															name: 'unspecific2.prompt.md',
															contents: 'oh hi, rabot!',
														},
														{
															name: 'readme.md',
															contents: 'non prompt file',
														},
													],
												}
											],
										},
									],
								},
							],
						);

						assertOutcome(
							await locator.listFiles(PromptsType.prompt, PromptsStorage.local, CancellationToken.None),
							[
								'/Users/legomushroom/repos/vscode/deps/text/my.prompt.md',
								'/Users/legomushroom/repos/vscode/deps/text/nested/specific.prompt.md',
								'/Users/legomushroom/repos/vscode/deps/text/nested/unspecific1.prompt.md',
								'/Users/legomushroom/repos/vscode/deps/text/nested/unspecific2.prompt.md',
							],
							'Must find correct prompts.',
						);
						await locator.disposeAsync();

					}
				});

				testT(`specific`, async () => {
					const testSettings = [
						[
							'/Users/legomushroom/repos/vscode/**/*specific*',
						],
						[
							'/Users/legomushroom/repos/vscode/**/*specific*.prompt.md',
						],
						[
							'/Users/legomushroom/repos/vscode/**/*specific*.md',
						],
						[
							'/Users/legomushroom/repos/vscode/**/specific*',
							'/Users/legomushroom/repos/vscode/**/unspecific1.prompt.md',
							'/Users/legomushroom/repos/vscode/**/unspecific2.prompt.md',
						],
						[
							'/Users/legomushroom/repos/vscode/**/specific.prompt.md',
							'/Users/legomushroom/repos/vscode/**/unspecific*.prompt.md',
						],
						[
							'/Users/legomushroom/repos/vscode/**/nested/specific.prompt.md',
							'/Users/legomushroom/repos/vscode/**/nested/unspecific*.prompt.md',
						],
						[
							'/Users/legomushroom/repos/vscode/**/nested/*specific*',
						],
						[
							'/Users/legomushroom/repos/vscode/**/*spec*.prompt.md',
						],
						[
							'/Users/legomushroom/repos/vscode/**/*spec*',
						],
						[
							'/Users/legomushroom/repos/vscode/**/*spec*.md',
						],
						[
							'/Users/legomushroom/repos/vscode/**/deps/**/*spec*.md',
						],
						[
							'/Users/legomushroom/repos/vscode/**/text/**/*spec*.md',
						],
						[
							'/Users/legomushroom/repos/vscode/deps/text/nested/*spec*',
						],
						[
							'/Users/legomushroom/repos/vscode/deps/text/nested/*specific*',
						],
						[
							'/Users/legomushroom/repos/vscode/deps/**/*specific*',
						],
						[
							'/Users/legomushroom/repos/vscode/deps/**/specific*',
							'/Users/legomushroom/repos/vscode/deps/**/unspecific*.prompt.md',
						],
						[
							'/Users/legomushroom/repos/vscode/deps/**/specific*.md',
							'/Users/legomushroom/repos/vscode/deps/**/unspecific*.md',
						],
						[
							'/Users/legomushroom/repos/vscode/deps/**/specific.prompt.md',
							'/Users/legomushroom/repos/vscode/deps/**/unspecific1.prompt.md',
							'/Users/legomushroom/repos/vscode/deps/**/unspecific2.prompt.md',
						],
						[
							'/Users/legomushroom/repos/vscode/deps/**/specific.prompt.md',
							'/Users/legomushroom/repos/vscode/deps/**/unspecific1*.md',
							'/Users/legomushroom/repos/vscode/deps/**/unspecific2*.md',
						],
						[
							'/Users/legomushroom/repos/vscode/deps/text/**/*specific*',
						],
						[
							'/Users/legomushroom/repos/vscode/deps/text/**/specific*',
							'/Users/legomushroom/repos/vscode/deps/text/**/unspecific*.prompt.md',
						],
						[
							'/Users/legomushroom/repos/vscode/deps/text/**/specific*.md',
							'/Users/legomushroom/repos/vscode/deps/text/**/unspecific*.md',
						],
						[
							'/Users/legomushroom/repos/vscode/deps/text/**/specific.prompt.md',
							'/Users/legomushroom/repos/vscode/deps/text/**/unspecific1.prompt.md',
							'/Users/legomushroom/repos/vscode/deps/text/**/unspecific2.prompt.md',
						],
						[
							'/Users/legomushroom/repos/vscode/deps/text/**/specific.prompt.md',
							'/Users/legomushroom/repos/vscode/deps/text/**/unspecific1*.md',
							'/Users/legomushroom/repos/vscode/deps/text/**/unspecific2*.md',
						],
					];

					for (const settings of testSettings) {
						const vscodeSettings: Record<string, boolean> = {};
						for (const setting of settings) {
							vscodeSettings[setting] = true;
						}

						const locator = await createPromptsLocator(
							vscodeSettings,
							['/Users/legomushroom/repos/vscode'],
							[
								{
									name: '/Users/legomushroom/repos/vscode',
									children: [
										{
											name: 'deps/text',
											children: [
												{
													name: 'my.prompt.md',
													contents: 'oh hi, bot!',
												},
												{
													name: 'nested',
													children: [
														{
															name: 'default.prompt.md',
															contents: 'oh hi, bot!',
														},
														{
															name: 'specific.prompt.md',
															contents: 'oh hi, bot!',
														},
														{
															name: 'unspecific1.prompt.md',
															contents: 'oh hi, robot!',
														},
														{
															name: 'unspecific2.prompt.md',
															contents: 'oh hi, rawbot!',
														},
														{
															name: 'readme.md',
															contents: 'non prompt file',
														},
													],
												}
											],
										},
									],
								},
							],
						);

						assertOutcome(
							await locator.listFiles(PromptsType.prompt, PromptsStorage.local, CancellationToken.None),
							[
								'/Users/legomushroom/repos/vscode/deps/text/nested/specific.prompt.md',
								'/Users/legomushroom/repos/vscode/deps/text/nested/unspecific1.prompt.md',
								'/Users/legomushroom/repos/vscode/deps/text/nested/unspecific2.prompt.md',
							],
							'Must find correct prompts.',
						);
						await locator.disposeAsync();

					}
				});
			});
		});
	});

	testT('core logic', async () => {
		const locator = await createPromptsLocator(
			{
				'/Users/legomushroom/repos/prompts': true,
				'/tmp/prompts/': true,
				'/absolute/path/prompts': false,
				'.copilot/prompts': true,
			},
			[
				'/Users/legomushroom/repos/vscode',
			],
			[
				{
					name: '/Users/legomushroom/repos/prompts',
					children: [
						{
							name: 'test.prompt.md',
							contents: 'Hello, World!',
						},
						{
							name: 'refactor-tests.prompt.md',
							contents: 'some file content goes here',
						},
					],
				},
				{
					name: '/tmp/prompts',
					children: [
						{
							name: 'translate.to-rust.prompt.md',
							contents: 'some more random file contents',
						},
					],
				},
				{
					name: '/absolute/path/prompts',
					children: [
						{
							name: 'some-prompt-file.prompt.md',
							contents: 'hey hey hey',
						},
					],
				},
				{
					name: '/Users/legomushroom/repos/vscode',
					children: [
						{
							name: '.copilot/prompts',
							children: [
								{
									name: 'default.prompt.md',
									contents: 'oh hi, robot!',
								},
							],
						},
						{
							name: '.github/prompts',
							children: [
								{
									name: 'my.prompt.md',
									contents: 'oh hi, bot!',
								},
							],
						},
					],
				},
			]);

		assertOutcome(
			await locator.listFiles(PromptsType.prompt, PromptsStorage.local, CancellationToken.None),
			[
				'/Users/legomushroom/repos/vscode/.github/prompts/my.prompt.md',
				'/Users/legomushroom/repos/prompts/test.prompt.md',
				'/Users/legomushroom/repos/prompts/refactor-tests.prompt.md',
				'/tmp/prompts/translate.to-rust.prompt.md',
				'/Users/legomushroom/repos/vscode/.copilot/prompts/default.prompt.md',
			],
			'Must find correct prompts.',
		);
		await locator.disposeAsync();
	});

	testT('with disabled `.github/prompts` location', async () => {
		const locator = await createPromptsLocator(
			{
				'/Users/legomushroom/repos/prompts': true,
				'/tmp/prompts/': true,
				'/absolute/path/prompts': false,
				'.copilot/prompts': true,
				'.github/prompts': false,
			},
			[
				'/Users/legomushroom/repos/vscode',
			],
			[
				{
					name: '/Users/legomushroom/repos/prompts',
					children: [
						{
							name: 'test.prompt.md',
							contents: 'Hello, World!',
						},
						{
							name: 'refactor-tests.prompt.md',
							contents: 'some file content goes here',
						},
					],
				},
				{
					name: '/tmp/prompts',
					children: [
						{
							name: 'translate.to-rust.prompt.md',
							contents: 'some more random file contents',
						},
					],
				},
				{
					name: '/absolute/path/prompts',
					children: [
						{
							name: 'some-prompt-file.prompt.md',
							contents: 'hey hey hey',
						},
					],
				},
				{
					name: '/Users/legomushroom/repos/vscode',
					children: [
						{
							name: '.copilot/prompts',
							children: [
								{
									name: 'default.prompt.md',
									contents: 'oh hi, robot!',
								},
							],
						},
						{
							name: '.github/prompts',
							children: [
								{
									name: 'my.prompt.md',
									contents: 'oh hi, bot!',
								},
								{
									name: 'your.prompt.md',
									contents: 'oh hi, bot!',
								},
							],
						},
					],
				},
			]);

		assertOutcome(
			await locator.listFiles(PromptsType.prompt, PromptsStorage.local, CancellationToken.None),
			[
				'/Users/legomushroom/repos/prompts/test.prompt.md',
				'/Users/legomushroom/repos/prompts/refactor-tests.prompt.md',
				'/tmp/prompts/translate.to-rust.prompt.md',
				'/Users/legomushroom/repos/vscode/.copilot/prompts/default.prompt.md',
			],
			'Must find correct prompts.',
		);
		await locator.disposeAsync();
	});

	suite('multi-root workspace', () => {
		suite('core logic', () => {
			testT('without top-level `.github` folder', async () => {
				const locator = await createPromptsLocator(
					{
						'/Users/legomushroom/repos/prompts': true,
						'/tmp/prompts/': true,
						'/absolute/path/prompts': false,
						'.copilot/prompts': false,
					},
					[
						'/Users/legomushroom/repos/vscode',
						'/Users/legomushroom/repos/node',
					],
					[
						{
							name: '/Users/legomushroom/repos/prompts',
							children: [
								{
									name: 'test.prompt.md',
									contents: 'Hello, World!',
								},
								{
									name: 'refactor-tests.prompt.md',
									contents: 'some file content goes here',
								},
							],
						},
						{
							name: '/tmp/prompts',
							children: [
								{
									name: 'translate.to-rust.prompt.md',
									contents: 'some more random file contents',
								},
							],
						},
						{
							name: '/absolute/path/prompts',
							children: [
								{
									name: 'some-prompt-file.prompt.md',
									contents: 'hey hey hey',
								},
							],
						},
						{
							name: '/Users/legomushroom/repos/vscode',
							children: [
								{
									name: '.copilot/prompts',
									children: [
										{
											name: 'prompt1.prompt.md',
											contents: 'oh hi, robot!',
										},
									],
								},
								{
									name: '.github/prompts',
									children: [
										{
											name: 'default.prompt.md',
											contents: 'oh hi, bot!',
										},
									],
								},
							],
						},
						{
							name: '/Users/legomushroom/repos/node',
							children: [
								{
									name: '.copilot/prompts',
									children: [
										{
											name: 'prompt5.prompt.md',
											contents: 'oh hi, robot!',
										},
									],
								},
								{
									name: '.github/prompts',
									children: [
										{
											name: 'refactor-static-classes.prompt.md',
											contents: 'file contents',
										},
									],
								},
							],
						},
						// note! this folder is not part of the workspace, so prompt files are `ignored`
						{
							name: '/Users/legomushroom/repos/.github/prompts',
							children: [
								{
									name: 'prompt-name.prompt.md',
									contents: 'oh hi, robot!',
								},
								{
									name: 'name-of-the-prompt.prompt.md',
									contents: 'oh hi, raw bot!',
								},
							],
						},
					]);

				assertOutcome(
					await locator.listFiles(PromptsType.prompt, PromptsStorage.local, CancellationToken.None),
					[
						'/Users/legomushroom/repos/vscode/.github/prompts/default.prompt.md',
						'/Users/legomushroom/repos/node/.github/prompts/refactor-static-classes.prompt.md',
						'/Users/legomushroom/repos/prompts/test.prompt.md',
						'/Users/legomushroom/repos/prompts/refactor-tests.prompt.md',
						'/tmp/prompts/translate.to-rust.prompt.md',
					],
					'Must find correct prompts.',
				);
				await locator.disposeAsync();
			});

			testT('with top-level `.github` folder', async () => {
				const locator = await createPromptsLocator(
					{
						'/Users/legomushroom/repos/prompts': true,
						'/tmp/prompts/': true,
						'/absolute/path/prompts': false,
						'.copilot/prompts': false,
					},
					[
						'/Users/legomushroom/repos/vscode',
						'/Users/legomushroom/repos/node',
						'/var/shared/prompts',
					],
					[
						{
							name: '/Users/legomushroom/repos/prompts',
							children: [
								{
									name: 'test.prompt.md',
									contents: 'Hello, World!',
								},
								{
									name: 'refactor-tests.prompt.md',
									contents: 'some file content goes here',
								},
							],
						},
						{
							name: '/tmp/prompts',
							children: [
								{
									name: 'translate.to-rust.prompt.md',
									contents: 'some more random file contents',
								},
							],
						},
						{
							name: '/absolute/path/prompts',
							children: [
								{
									name: 'some-prompt-file.prompt.md',
									contents: 'hey hey hey',
								},
							],
						},
						{
							name: '/Users/legomushroom/repos/vscode',
							children: [
								{
									name: '.copilot/prompts',
									children: [
										{
											name: 'prompt1.prompt.md',
											contents: 'oh hi, robot!',
										},
									],
								},
								{
									name: '.github/prompts',
									children: [
										{
											name: 'default.prompt.md',
											contents: 'oh hi, bot!',
										},
									],
								},
							],
						},
						{
							name: '/Users/legomushroom/repos/node',
							children: [
								{
									name: '.copilot/prompts',
									children: [
										{
											name: 'prompt5.prompt.md',
											contents: 'oh hi, robot!',
										},
									],
								},
								{
									name: '.github/prompts',
									children: [
										{
											name: 'refactor-static-classes.prompt.md',
											contents: 'file contents',
										},
									],
								},
							],
						},
						// note! this folder is part of the workspace, so prompt files are `included`
						{
							name: '/var/shared/prompts/.github/prompts',
							children: [
								{
									name: 'prompt-name.prompt.md',
									contents: 'oh hi, robot!',
								},
								{
									name: 'name-of-the-prompt.prompt.md',
									contents: 'oh hi, raw bot!',
								},
							],
						},
					]);

				assertOutcome(
					await locator.listFiles(PromptsType.prompt, PromptsStorage.local, CancellationToken.None),
					[
						'/Users/legomushroom/repos/vscode/.github/prompts/default.prompt.md',
						'/Users/legomushroom/repos/node/.github/prompts/refactor-static-classes.prompt.md',
						'/var/shared/prompts/.github/prompts/prompt-name.prompt.md',
						'/var/shared/prompts/.github/prompts/name-of-the-prompt.prompt.md',
						'/Users/legomushroom/repos/prompts/test.prompt.md',
						'/Users/legomushroom/repos/prompts/refactor-tests.prompt.md',
						'/tmp/prompts/translate.to-rust.prompt.md',
					],
					'Must find correct prompts.',
				);
				await locator.disposeAsync();
			});

			testT('with disabled `.github/prompts` location', async () => {
				const locator = await createPromptsLocator(
					{
						'/Users/legomushroom/repos/prompts': true,
						'/tmp/prompts/': true,
						'/absolute/path/prompts': false,
						'.copilot/prompts': false,
						'.github/prompts': false,
					},
					[
						'/Users/legomushroom/repos/vscode',
						'/Users/legomushroom/repos/node',
						'/var/shared/prompts',
					],
					[
						{
							name: '/Users/legomushroom/repos/prompts',
							children: [
								{
									name: 'test.prompt.md',
									contents: 'Hello, World!',
								},
								{
									name: 'refactor-tests.prompt.md',
									contents: 'some file content goes here',
								},
							],
						},
						{
							name: '/tmp/prompts',
							children: [
								{
									name: 'translate.to-rust.prompt.md',
									contents: 'some more random file contents',
								},
							],
						},
						{
							name: '/absolute/path/prompts',
							children: [
								{
									name: 'some-prompt-file.prompt.md',
									contents: 'hey hey hey',
								},
							],
						},
						{
							name: '/Users/legomushroom/repos/vscode',
							children: [
								{
									name: '.copilot/prompts',
									children: [
										{
											name: 'prompt1.prompt.md',
											contents: 'oh hi, robot!',
										},
									],
								},
								{
									name: '.github/prompts',
									children: [
										{
											name: 'default.prompt.md',
											contents: 'oh hi, bot!',
										},
									],
								},
							],
						},
						{
							name: '/Users/legomushroom/repos/node',
							children: [
								{
									name: '.copilot/prompts',
									children: [
										{
											name: 'prompt5.prompt.md',
											contents: 'oh hi, robot!',
										},
									],
								},
								{
									name: '.github/prompts',
									children: [
										{
											name: 'refactor-static-classes.prompt.md',
											contents: 'file contents',
										},
									],
								},
							],
						},
						// note! this folder is part of the workspace, so prompt files are `included`
						{
							name: '/var/shared/prompts/.github/prompts',
							children: [
								{
									name: 'prompt-name.prompt.md',
									contents: 'oh hi, robot!',
								},
								{
									name: 'name-of-the-prompt.prompt.md',
									contents: 'oh hi, raw bot!',
								},
							],
						},
					]);

				assertOutcome(
					await locator.listFiles(PromptsType.prompt, PromptsStorage.local, CancellationToken.None),
					[
						'/Users/legomushroom/repos/prompts/test.prompt.md',
						'/Users/legomushroom/repos/prompts/refactor-tests.prompt.md',
						'/tmp/prompts/translate.to-rust.prompt.md',
					],
					'Must find correct prompts.',
				);
				await locator.disposeAsync();
			});

			testT('mixed', async () => {
				const locator = await createPromptsLocator(
					{
						'/Users/legomushroom/repos/**/*test*': true,
						'.copilot/prompts': false,
						'.github/prompts': true,
						'/absolute/path/prompts/some-prompt-file.prompt.md': true,
					},
					[
						'/Users/legomushroom/repos/vscode',
						'/Users/legomushroom/repos/node',
						'/var/shared/prompts',
					],
					[
						{
							name: '/Users/legomushroom/repos/prompts',
							children: [
								{
									name: 'test.prompt.md',
									contents: 'Hello, World!',
								},
								{
									name: 'refactor-tests.prompt.md',
									contents: 'some file content goes here',
								},
								{
									name: 'elf.prompt.md',
									contents: 'haalo!',
								},
							],
						},
						{
							name: '/tmp/prompts',
							children: [
								{
									name: 'translate.to-rust.prompt.md',
									contents: 'some more random file contents',
								},
							],
						},
						{
							name: '/absolute/path/prompts',
							children: [
								{
									name: 'some-prompt-file.prompt.md',
									contents: 'hey hey hey',
								},
							],
						},
						{
							name: '/Users/legomushroom/repos/vscode',
							children: [
								{
									name: '.copilot/prompts',
									children: [
										{
											name: 'prompt1.prompt.md',
											contents: 'oh hi, robot!',
										},
									],
								},
								{
									name: '.github/prompts',
									children: [
										{
											name: 'default.prompt.md',
											contents: 'oh hi, bot!',
										},
									],
								},
							],
						},
						{
							name: '/Users/legomushroom/repos/node',
							children: [
								{
									name: '.copilot/prompts',
									children: [
										{
											name: 'prompt5.prompt.md',
											contents: 'oh hi, robot!',
										},
									],
								},
								{
									name: '.github/prompts',
									children: [
										{
											name: 'refactor-static-classes.prompt.md',
											contents: 'file contents',
										},
									],
								},
							],
						},
						// note! this folder is part of the workspace, so prompt files are `included`
						{
							name: '/var/shared/prompts/.github/prompts',
							children: [
								{
									name: 'prompt-name.prompt.md',
									contents: 'oh hi, robot!',
								},
								{
									name: 'name-of-the-prompt.prompt.md',
									contents: 'oh hi, raw bot!',
								},
							],
						},
					]);

				assertOutcome(
					await locator.listFiles(PromptsType.prompt, PromptsStorage.local, CancellationToken.None),
					[
						// all of these are due to the `.github/prompts` setting
						'/Users/legomushroom/repos/vscode/.github/prompts/default.prompt.md',
						'/Users/legomushroom/repos/node/.github/prompts/refactor-static-classes.prompt.md',
						'/var/shared/prompts/.github/prompts/prompt-name.prompt.md',
						'/var/shared/prompts/.github/prompts/name-of-the-prompt.prompt.md',
						// all of these are due to the `/Users/legomushroom/repos/**/*test*` setting
						'/Users/legomushroom/repos/prompts/test.prompt.md',
						'/Users/legomushroom/repos/prompts/refactor-tests.prompt.md',
						// this one is due to the specific `/absolute/path/prompts/some-prompt-file.prompt.md` setting
						'/absolute/path/prompts/some-prompt-file.prompt.md',
					],
					'Must find correct prompts.',
				);
				await locator.disposeAsync();
			});
		});

		suite('glob pattern', () => {
			suite('relative', () => {
				testT('wild card', async () => {
					const testSettings = [
						'**',
						'**/*.prompt.md',
						'**/*.md',
						'**/*',
						'gen*/**',
						'gen*/**/*.prompt.md',
						'gen*/**/*',
						'gen*/**/*.md',
						'**/gen*/**',
						'**/gen*/**/*',
						'**/gen*/**/*.md',
						'**/gen*/**/*.prompt.md',
						'{generic,general,gen}/**',
						'{generic,general,gen}/**/*.prompt.md',
						'{generic,general,gen}/**/*',
						'{generic,general,gen}/**/*.md',
						'**/{generic,general,gen}/**',
						'**/{generic,general,gen}/**/*',
						'**/{generic,general,gen}/**/*.md',
						'**/{generic,general,gen}/**/*.prompt.md',
					];

					for (const setting of testSettings) {

						const locator = await createPromptsLocator(
							{ [setting]: true },
							[
								'/Users/legomushroom/repos/vscode',
								'/Users/legomushroom/repos/prompts',
							],
							[
								{
									name: '/Users/legomushroom/repos/vscode',
									children: [
										{
											name: 'gen/text',
											children: [
												{
													name: 'my.prompt.md',
													contents: 'oh hi, bot!',
												},
												{
													name: 'nested',
													children: [
														{
															name: 'specific.prompt.md',
															contents: 'oh hi, bot!',
														},
														{
															name: 'unspecific1.prompt.md',
															contents: 'oh hi, robot!',
														},
														{
															name: 'unspecific2.prompt.md',
															contents: 'oh hi, rabot!',
														},
														{
															name: 'readme.md',
															contents: 'non prompt file',
														},
													],
												}
											],
										},
									],
								},
								{
									name: '/Users/legomushroom/repos/prompts',
									children: [
										{
											name: 'general',
											children: [
												{
													name: 'common.prompt.md',
													contents: 'oh hi, bot!',
												},
												{
													name: 'uncommon-10.prompt.md',
													contents: 'oh hi, robot!',
												},
												{
													name: 'license.md',
													contents: 'non prompt file',
												},
											],
										}
									],
								},
							],
						);

						assertOutcome(
							await locator.listFiles(PromptsType.prompt, PromptsStorage.local, CancellationToken.None),
							[
								'/Users/legomushroom/repos/vscode/gen/text/my.prompt.md',
								'/Users/legomushroom/repos/vscode/gen/text/nested/specific.prompt.md',
								'/Users/legomushroom/repos/vscode/gen/text/nested/unspecific1.prompt.md',
								'/Users/legomushroom/repos/vscode/gen/text/nested/unspecific2.prompt.md',
								// -
								'/Users/legomushroom/repos/prompts/general/common.prompt.md',
								'/Users/legomushroom/repos/prompts/general/uncommon-10.prompt.md',
							],
							'Must find correct prompts.',
						);
						await locator.disposeAsync();

					}
				});

				testT(`specific`, async () => {
					const testSettings = [
						[
							'**/my.prompt.md',
							'**/*specific*',
							'**/*common*',
						],
						[
							'**/my.prompt.md',
							'**/*specific*.prompt.md',
							'**/*common*.prompt.md',
						],
						[
							'**/my*.md',
							'**/*specific*.md',
							'**/*common*.md',
						],
						[
							'**/my*.md',
							'**/specific*',
							'**/unspecific*',
							'**/common*',
							'**/uncommon*',
						],
						[
							'**/my.prompt.md',
							'**/specific.prompt.md',
							'**/unspecific1.prompt.md',
							'**/unspecific2.prompt.md',
							'**/common.prompt.md',
							'**/uncommon-10.prompt.md',
						],
						[
							'gen*/**/my.prompt.md',
							'gen*/**/*specific*',
							'gen*/**/*common*',
						],
						[
							'gen*/**/my.prompt.md',
							'gen*/**/*specific*.prompt.md',
							'gen*/**/*common*.prompt.md',
						],
						[
							'gen*/**/my*.md',
							'gen*/**/*specific*.md',
							'gen*/**/*common*.md',
						],
						[
							'gen*/**/my*.md',
							'gen*/**/specific*',
							'gen*/**/unspecific*',
							'gen*/**/common*',
							'gen*/**/uncommon*',
						],
						[
							'gen*/**/my.prompt.md',
							'gen*/**/specific.prompt.md',
							'gen*/**/unspecific1.prompt.md',
							'gen*/**/unspecific2.prompt.md',
							'gen*/**/common.prompt.md',
							'gen*/**/uncommon-10.prompt.md',
						],
						[
							'gen/text/my.prompt.md',
							'gen/text/nested/specific.prompt.md',
							'gen/text/nested/unspecific1.prompt.md',
							'gen/text/nested/unspecific2.prompt.md',
							'general/common.prompt.md',
							'general/uncommon-10.prompt.md',
						],
						[
							'gen/text/my.prompt.md',
							'gen/text/nested/*specific*',
							'general/*common*',
						],
						[
							'gen/text/my.prompt.md',
							'gen/text/**/specific.prompt.md',
							'gen/text/**/unspecific1.prompt.md',
							'gen/text/**/unspecific2.prompt.md',
							'general/*',
						],
						[
							'{gen,general}/**/my.prompt.md',
							'{gen,general}/**/*specific*',
							'{gen,general}/**/*common*',
						],
						[
							'{gen,general}/**/my.prompt.md',
							'{gen,general}/**/*specific*.prompt.md',
							'{gen,general}/**/*common*.prompt.md',
						],
						[
							'{gen,general}/**/my*.md',
							'{gen,general}/**/*specific*.md',
							'{gen,general}/**/*common*.md',
						],
						[
							'{gen,general}/**/my*.md',
							'{gen,general}/**/specific*',
							'{gen,general}/**/unspecific*',
							'{gen,general}/**/common*',
							'{gen,general}/**/uncommon*',
						],
						[
							'{gen,general}/**/my.prompt.md',
							'{gen,general}/**/specific.prompt.md',
							'{gen,general}/**/unspecific1.prompt.md',
							'{gen,general}/**/unspecific2.prompt.md',
							'{gen,general}/**/common.prompt.md',
							'{gen,general}/**/uncommon-10.prompt.md',
						],
					];

					for (const settings of testSettings) {
						const vscodeSettings: Record<string, boolean> = {};
						for (const setting of settings) {
							vscodeSettings[setting] = true;
						}

						const locator = await createPromptsLocator(
							vscodeSettings,
							[
								'/Users/legomushroom/repos/vscode',
								'/Users/legomushroom/repos/prompts',
							],
							[
								{
									name: '/Users/legomushroom/repos/vscode',
									children: [
										{
											name: 'gen/text',
											children: [
												{
													name: 'my.prompt.md',
													contents: 'oh hi, bot!',
												},
												{
													name: 'nested',
													children: [
														{
															name: 'specific.prompt.md',
															contents: 'oh hi, bot!',
														},
														{
															name: 'unspecific1.prompt.md',
															contents: 'oh hi, robot!',
														},
														{
															name: 'unspecific2.prompt.md',
															contents: 'oh hi, rabot!',
														},
														{
															name: 'readme.md',
															contents: 'non prompt file',
														},
													],
												}
											],
										},
									],
								},
								{
									name: '/Users/legomushroom/repos/prompts',
									children: [
										{
											name: 'general',
											children: [
												{
													name: 'common.prompt.md',
													contents: 'oh hi, bot!',
												},
												{
													name: 'uncommon-10.prompt.md',
													contents: 'oh hi, robot!',
												},
												{
													name: 'license.md',
													contents: 'non prompt file',
												},
											],
										}
									],
								},
							],
						);

						assertOutcome(
							await locator.listFiles(PromptsType.prompt, PromptsStorage.local, CancellationToken.None),
							[
								'/Users/legomushroom/repos/vscode/gen/text/my.prompt.md',
								'/Users/legomushroom/repos/vscode/gen/text/nested/specific.prompt.md',
								'/Users/legomushroom/repos/vscode/gen/text/nested/unspecific1.prompt.md',
								'/Users/legomushroom/repos/vscode/gen/text/nested/unspecific2.prompt.md',
								// -
								'/Users/legomushroom/repos/prompts/general/common.prompt.md',
								'/Users/legomushroom/repos/prompts/general/uncommon-10.prompt.md',
							],
							'Must find correct prompts.',
						);
						await locator.disposeAsync();

					}
				});
			});

			suite('absolute', () => {
				testT('wild card', async () => {
					const testSettings = [
						'/Users/legomushroom/repos/**',
						'/Users/legomushroom/repos/**/*.prompt.md',
						'/Users/legomushroom/repos/**/*.md',
						'/Users/legomushroom/repos/**/*',
						'/Users/legomushroom/repos/**/gen*/**',
						'/Users/legomushroom/repos/**/gen*/**/*.prompt.md',
						'/Users/legomushroom/repos/**/gen*/**/*',
						'/Users/legomushroom/repos/**/gen*/**/*.md',
						'/Users/legomushroom/repos/**/gen*/**',
						'/Users/legomushroom/repos/**/gen*/**/*',
						'/Users/legomushroom/repos/**/gen*/**/*.md',
						'/Users/legomushroom/repos/**/gen*/**/*.prompt.md',
						'/Users/legomushroom/repos/{vscode,prompts}/**',
						'/Users/legomushroom/repos/{vscode,prompts}/**/*.prompt.md',
						'/Users/legomushroom/repos/{vscode,prompts}/**/*.md',
						'/Users/legomushroom/repos/{vscode,prompts}/**/*',
						'/Users/legomushroom/repos/{vscode,prompts}/**/gen*/**',
						'/Users/legomushroom/repos/{vscode,prompts}/**/gen*/**/*.prompt.md',
						'/Users/legomushroom/repos/{vscode,prompts}/**/gen*/**/*',
						'/Users/legomushroom/repos/{vscode,prompts}/**/gen*/**/*.md',
						'/Users/legomushroom/repos/{vscode,prompts}/**/gen*/**',
						'/Users/legomushroom/repos/{vscode,prompts}/**/gen*/**/*',
						'/Users/legomushroom/repos/{vscode,prompts}/**/gen*/**/*.md',
						'/Users/legomushroom/repos/{vscode,prompts}/**/gen*/**/*.prompt.md',
						'/Users/legomushroom/repos/{vscode,prompts}/**/{general,gen}/**',
						'/Users/legomushroom/repos/{vscode,prompts}/**/{general,gen}/**/*.prompt.md',
						'/Users/legomushroom/repos/{vscode,prompts}/**/{general,gen}/**/*',
						'/Users/legomushroom/repos/{vscode,prompts}/**/{general,gen}/**/*.md',
						'/Users/legomushroom/repos/{vscode,prompts}/**/{general,gen}/**',
						'/Users/legomushroom/repos/{vscode,prompts}/**/{general,gen}/**/*',
						'/Users/legomushroom/repos/{vscode,prompts}/**/{general,gen}/**/*.md',
						'/Users/legomushroom/repos/{vscode,prompts}/**/{general,gen}/**/*.prompt.md',
					];

					for (const setting of testSettings) {
						const locator = await createPromptsLocator(
							{ [setting]: true },
							[
								'/Users/legomushroom/repos/vscode',
								'/Users/legomushroom/repos/prompts',
							],
							[
								{
									name: '/Users/legomushroom/repos/vscode',
									children: [
										{
											name: 'gen/text',
											children: [
												{
													name: 'my.prompt.md',
													contents: 'oh hi, bot!',
												},
												{
													name: 'nested',
													children: [
														{
															name: 'specific.prompt.md',
															contents: 'oh hi, bot!',
														},
														{
															name: 'unspecific1.prompt.md',
															contents: 'oh hi, robot!',
														},
														{
															name: 'unspecific2.prompt.md',
															contents: 'oh hi, rabot!',
														},
														{
															name: 'readme.md',
															contents: 'non prompt file',
														},
													],
												}
											],
										},
									],
								},
								{
									name: '/Users/legomushroom/repos/prompts',
									children: [
										{
											name: 'general',
											children: [
												{
													name: 'common.prompt.md',
													contents: 'oh hi, bot!',
												},
												{
													name: 'uncommon-10.prompt.md',
													contents: 'oh hi, robot!',
												},
												{
													name: 'license.md',
													contents: 'non prompt file',
												},
											],
										}
									],
								},
							],
						);

						assertOutcome(
							await locator.listFiles(PromptsType.prompt, PromptsStorage.local, CancellationToken.None),
							[
								'/Users/legomushroom/repos/vscode/gen/text/my.prompt.md',
								'/Users/legomushroom/repos/vscode/gen/text/nested/specific.prompt.md',
								'/Users/legomushroom/repos/vscode/gen/text/nested/unspecific1.prompt.md',
								'/Users/legomushroom/repos/vscode/gen/text/nested/unspecific2.prompt.md',
								// -
								'/Users/legomushroom/repos/prompts/general/common.prompt.md',
								'/Users/legomushroom/repos/prompts/general/uncommon-10.prompt.md',
							],
							'Must find correct prompts.',
						);
						await locator.disposeAsync();

					}
				});

				testT(`specific`, async () => {
					const testSettings = [
						[
							'/Users/legomushroom/repos/**/my.prompt.md',
							'/Users/legomushroom/repos/**/*specific*',
							'/Users/legomushroom/repos/**/*common*',
						],
						[
							'/Users/legomushroom/repos/**/my.prompt.md',
							'/Users/legomushroom/repos/**/*specific*.prompt.md',
							'/Users/legomushroom/repos/**/*common*.prompt.md',
						],
						[
							'/Users/legomushroom/repos/**/my*.md',
							'/Users/legomushroom/repos/**/*specific*.md',
							'/Users/legomushroom/repos/**/*common*.md',
						],
						[
							'/Users/legomushroom/repos/**/my*.md',
							'/Users/legomushroom/repos/**/specific*',
							'/Users/legomushroom/repos/**/unspecific*',
							'/Users/legomushroom/repos/**/common*',
							'/Users/legomushroom/repos/**/uncommon*',
						],
						[
							'/Users/legomushroom/repos/**/my.prompt.md',
							'/Users/legomushroom/repos/**/specific.prompt.md',
							'/Users/legomushroom/repos/**/unspecific1.prompt.md',
							'/Users/legomushroom/repos/**/unspecific2.prompt.md',
							'/Users/legomushroom/repos/**/common.prompt.md',
							'/Users/legomushroom/repos/**/uncommon-10.prompt.md',
						],
						[
							'/Users/legomushroom/repos/**/gen*/**/my.prompt.md',
							'/Users/legomushroom/repos/**/gen*/**/*specific*',
							'/Users/legomushroom/repos/**/gen*/**/*common*',
						],
						[
							'/Users/legomushroom/repos/**/gen*/**/my.prompt.md',
							'/Users/legomushroom/repos/**/gen*/**/*specific*.prompt.md',
							'/Users/legomushroom/repos/**/gen*/**/*common*.prompt.md',
						],
						[
							'/Users/legomushroom/repos/**/gen*/**/my*.md',
							'/Users/legomushroom/repos/**/gen*/**/*specific*.md',
							'/Users/legomushroom/repos/**/gen*/**/*common*.md',
						],
						[
							'/Users/legomushroom/repos/**/gen*/**/my*.md',
							'/Users/legomushroom/repos/**/gen*/**/specific*',
							'/Users/legomushroom/repos/**/gen*/**/unspecific*',
							'/Users/legomushroom/repos/**/gen*/**/common*',
							'/Users/legomushroom/repos/**/gen*/**/uncommon*',
						],
						[
							'/Users/legomushroom/repos/**/gen*/**/my.prompt.md',
							'/Users/legomushroom/repos/**/gen*/**/specific.prompt.md',
							'/Users/legomushroom/repos/**/gen*/**/unspecific1.prompt.md',
							'/Users/legomushroom/repos/**/gen*/**/unspecific2.prompt.md',
							'/Users/legomushroom/repos/**/gen*/**/common.prompt.md',
							'/Users/legomushroom/repos/**/gen*/**/uncommon-10.prompt.md',
						],
						[
							'/Users/legomushroom/repos/vscode/gen/text/my.prompt.md',
							'/Users/legomushroom/repos/vscode/gen/text/nested/specific.prompt.md',
							'/Users/legomushroom/repos/vscode/gen/text/nested/unspecific1.prompt.md',
							'/Users/legomushroom/repos/vscode/gen/text/nested/unspecific2.prompt.md',
							'/Users/legomushroom/repos/prompts/general/common.prompt.md',
							'/Users/legomushroom/repos/prompts/general/uncommon-10.prompt.md',
						],
						[
							'/Users/legomushroom/repos/vscode/gen/text/my.prompt.md',
							'/Users/legomushroom/repos/vscode/gen/text/nested/*specific*',
							'/Users/legomushroom/repos/prompts/general/*common*',
						],
						[
							'/Users/legomushroom/repos/vscode/gen/text/my.prompt.md',
							'/Users/legomushroom/repos/vscode/gen/text/**/specific.prompt.md',
							'/Users/legomushroom/repos/vscode/gen/text/**/unspecific1.prompt.md',
							'/Users/legomushroom/repos/vscode/gen/text/**/unspecific2.prompt.md',
							'/Users/legomushroom/repos/prompts/general/*',
						],
						[
							'/Users/legomushroom/repos/**/{gen,general}/**/my.prompt.md',
							'/Users/legomushroom/repos/**/{gen,general}/**/*specific*',
							'/Users/legomushroom/repos/**/{gen,general}/**/*common*',
						],
						[
							'/Users/legomushroom/repos/**/{gen,general}/**/my.prompt.md',
							'/Users/legomushroom/repos/**/{gen,general}/**/*specific*.prompt.md',
							'/Users/legomushroom/repos/**/{gen,general}/**/*common*.prompt.md',
						],
						[
							'/Users/legomushroom/repos/**/{gen,general}/**/my*.md',
							'/Users/legomushroom/repos/**/{gen,general}/**/*specific*.md',
							'/Users/legomushroom/repos/**/{gen,general}/**/*common*.md',
						],
						[
							'/Users/legomushroom/repos/**/{gen,general}/**/my*.md',
							'/Users/legomushroom/repos/**/{gen,general}/**/specific*',
							'/Users/legomushroom/repos/**/{gen,general}/**/unspecific*',
							'/Users/legomushroom/repos/**/{gen,general}/**/common*',
							'/Users/legomushroom/repos/**/{gen,general}/**/uncommon*',
						],
						[
							'/Users/legomushroom/repos/**/{gen,general}/**/my.prompt.md',
							'/Users/legomushroom/repos/**/{gen,general}/**/specific.prompt.md',
							'/Users/legomushroom/repos/**/{gen,general}/**/unspecific1.prompt.md',
							'/Users/legomushroom/repos/**/{gen,general}/**/unspecific2.prompt.md',
							'/Users/legomushroom/repos/**/{gen,general}/**/common.prompt.md',
							'/Users/legomushroom/repos/**/{gen,general}/**/uncommon-10.prompt.md',
						],
						[
							'/Users/legomushroom/repos/{prompts,vscode,copilot}/{gen,general}/**/my.prompt.md',
							'/Users/legomushroom/repos/{prompts,vscode,copilot}/{gen,general}/**/*specific*',
							'/Users/legomushroom/repos/{prompts,vscode,copilot}/{gen,general}/**/*common*',
						],
						[
							'/Users/legomushroom/repos/{prompts,vscode,copilot}/{gen,general}/**/my.prompt.md',
							'/Users/legomushroom/repos/{prompts,vscode,copilot}/{gen,general}/**/*specific*.prompt.md',
							'/Users/legomushroom/repos/{prompts,vscode,copilot}/{gen,general}/**/*common*.prompt.md',
						],
						[
							'/Users/legomushroom/repos/{prompts,vscode,copilot}/{gen,general}/**/my*.md',
							'/Users/legomushroom/repos/{prompts,vscode,copilot}/{gen,general}/**/*specific*.md',
							'/Users/legomushroom/repos/{prompts,vscode,copilot}/{gen,general}/**/*common*.md',
						],
						[
							'/Users/legomushroom/repos/{prompts,vscode,copilot}/{gen,general}/**/my*.md',
							'/Users/legomushroom/repos/{prompts,vscode,copilot}/{gen,general}/**/specific*',
							'/Users/legomushroom/repos/{prompts,vscode,copilot}/{gen,general}/**/unspecific*',
							'/Users/legomushroom/repos/{prompts,vscode,copilot}/{gen,general}/**/common*',
							'/Users/legomushroom/repos/{prompts,vscode,copilot}/{gen,general}/**/uncommon*',
						],
						[
							'/Users/legomushroom/repos/{prompts,vscode,copilot}/{gen,general}/**/my.prompt.md',
							'/Users/legomushroom/repos/{prompts,vscode,copilot}/{gen,general}/**/specific.prompt.md',
							'/Users/legomushroom/repos/{prompts,vscode,copilot}/{gen,general}/**/unspecific1.prompt.md',
							'/Users/legomushroom/repos/{prompts,vscode,copilot}/{gen,general}/**/unspecific2.prompt.md',
							'/Users/legomushroom/repos/{prompts,vscode,copilot}/{gen,general}/**/common.prompt.md',
							'/Users/legomushroom/repos/{prompts,vscode,copilot}/{gen,general}/**/uncommon-10.prompt.md',
						],
					];

					for (const settings of testSettings) {
						const vscodeSettings: Record<string, boolean> = {};
						for (const setting of settings) {
							vscodeSettings[setting] = true;
						}

						const locator = await createPromptsLocator(
							vscodeSettings,
							[
								'/Users/legomushroom/repos/vscode',
								'/Users/legomushroom/repos/prompts',
							],
							[
								{
									name: '/Users/legomushroom/repos/vscode',
									children: [
										{
											name: 'gen/text',
											children: [
												{
													name: 'my.prompt.md',
													contents: 'oh hi, bot!',
												},
												{
													name: 'nested',
													children: [
														{
															name: 'specific.prompt.md',
															contents: 'oh hi, bot!',
														},
														{
															name: 'unspecific1.prompt.md',
															contents: 'oh hi, robot!',
														},
														{
															name: 'unspecific2.prompt.md',
															contents: 'oh hi, rabot!',
														},
														{
															name: 'readme.md',
															contents: 'non prompt file',
														},
													],
												}
											],
										},
									],
								},
								{
									name: '/Users/legomushroom/repos/prompts',
									children: [
										{
											name: 'general',
											children: [
												{
													name: 'common.prompt.md',
													contents: 'oh hi, bot!',
												},
												{
													name: 'uncommon-10.prompt.md',
													contents: 'oh hi, robot!',
												},
												{
													name: 'license.md',
													contents: 'non prompt file',
												},
											],
										}
									],
								},
							],
						);

						assertOutcome(
							await locator.listFiles(PromptsType.prompt, PromptsStorage.local, CancellationToken.None),
							[
								'/Users/legomushroom/repos/vscode/gen/text/my.prompt.md',
								'/Users/legomushroom/repos/vscode/gen/text/nested/specific.prompt.md',
								'/Users/legomushroom/repos/vscode/gen/text/nested/unspecific1.prompt.md',
								'/Users/legomushroom/repos/vscode/gen/text/nested/unspecific2.prompt.md',
								// -
								'/Users/legomushroom/repos/prompts/general/common.prompt.md',
								'/Users/legomushroom/repos/prompts/general/uncommon-10.prompt.md',
							],
							'Must find correct prompts.',
						);
						await locator.disposeAsync();

					}
				});
			});
		});
	});

	suite('isValidGlob', () => {
		testT('valid patterns', async () => {
			const globs = [
				'**',
				'\*',
				'\**',
				'**/*',
				'**/*.prompt.md',
				'/Users/legomushroom/**/*.prompt.md',
				'/Users/legomushroom/*.prompt.md',
				'/Users/legomushroom/*',
				'/Users/legomushroom/repos/{repo1,test}',
				'/Users/legomushroom/repos/{repo1,test}/**',
				'/Users/legomushroom/repos/{repo1,test}/*',
				'/Users/legomushroom/**/{repo1,test}/**',
				'/Users/legomushroom/**/{repo1,test}',
				'/Users/legomushroom/**/{repo1,test}/*',
				'/Users/legomushroom/**/repo[1,2,3]',
				'/Users/legomushroom/**/repo[1,2,3]/**',
				'/Users/legomushroom/**/repo[1,2,3]/*',
				'/Users/legomushroom/**/repo[1,2,3]/**/*.prompt.md',
				'repo[1,2,3]/**/*.prompt.md',
				'repo[[1,2,3]/**/*.prompt.md',
				'{repo1,test}/*.prompt.md',
				'{repo1,test}/*',
				'/{repo1,test}/*',
				'/{repo1,test}}/*',
			];

			for (const glob of globs) {
				assert(
					(isValidGlob(glob) === true),
					`'${glob}' must be a 'valid' glob pattern.`,
				);
			}
		});

		testT('invalid patterns', async () => {
			const globs = [
				'.',
				'\\*',
				'\\?',
				'\\*\\?\\*',
				'repo[1,2,3',
				'repo1,2,3]',
				'repo\\[1,2,3]',
				'repo[1,2,3\\]',
				'repo\\[1,2,3\\]',
				'{repo1,repo2',
				'repo1,repo2}',
				'\\{repo1,repo2}',
				'{repo1,repo2\\}',
				'\\{repo1,repo2\\}',
				'/Users/legomushroom/repos',
				'/Users/legomushroom/repo[1,2,3',
				'/Users/legomushroom/repo1,2,3]',
				'/Users/legomushroom/repo\\[1,2,3]',
				'/Users/legomushroom/repo[1,2,3\\]',
				'/Users/legomushroom/repo\\[1,2,3\\]',
				'/Users/legomushroom/{repo1,repo2',
				'/Users/legomushroom/repo1,repo2}',
				'/Users/legomushroom/\\{repo1,repo2}',
				'/Users/legomushroom/{repo1,repo2\\}',
				'/Users/legomushroom/\\{repo1,repo2\\}',
			];

			for (const glob of globs) {
				assert(
					(isValidGlob(glob) === false),
					`'${glob}' must be an 'invalid' glob pattern.`,
				);
			}
		});
	});

	suite('getConfigBasedSourceFolders', () => {
		testT('gets unambiguous list of folders', async () => {
			const locator = await createPromptsLocator(
				{
					'.github/prompts': true,
					'/Users/**/repos/**': true,
					'gen/text/**': true,
					'gen/text/nested/*.prompt.md': true,
					'general/*': true,
					'/Users/legomushroom/repos/vscode/my-prompts': true,
					'/Users/legomushroom/repos/vscode/your-prompts/*.md': true,
					'/Users/legomushroom/repos/prompts/shared-prompts/*': true,
				},
				[
					'/Users/legomushroom/repos/vscode',
					'/Users/legomushroom/repos/prompts',
				],
				[],
			);

			assertOutcome(
				locator.getConfigBasedSourceFolders(PromptsType.prompt),
				[
					'/Users/legomushroom/repos/vscode/.github/prompts',
					'/Users/legomushroom/repos/prompts/.github/prompts',
					'/Users/legomushroom/repos/vscode/gen/text/nested',
					'/Users/legomushroom/repos/prompts/gen/text/nested',
					'/Users/legomushroom/repos/vscode/general',
					'/Users/legomushroom/repos/prompts/general',
					'/Users/legomushroom/repos/vscode/my-prompts',
					'/Users/legomushroom/repos/vscode/your-prompts',
					'/Users/legomushroom/repos/prompts/shared-prompts',
				],
				'Must find correct prompts.',
			);
			await locator.disposeAsync();
		});
	});
});

function assertOutcome(actual: readonly URI[], expected: string[], message: string) {
	assert.deepStrictEqual(actual.map((uri) => uri.path), expected, message);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/tools/manageTodoListTool.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/tools/manageTodoListTool.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { createManageTodoListToolData } from '../../../common/tools/manageTodoListTool.js';
import { IToolData } from '../../../common/languageModelToolsService.js';

suite('ManageTodoListTool Description Field Setting', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	function getSchemaProperties(toolData: IToolData): { properties: any; required: string[] } {
		assert.ok(toolData.inputSchema);
		// eslint-disable-next-line local/code-no-any-casts
		const schema = toolData.inputSchema as any;
		const properties = schema?.properties?.todoList?.items?.properties;
		const required = schema?.properties?.todoList?.items?.required;

		assert.ok(properties, 'Schema properties should be defined');
		assert.ok(required, 'Schema required fields should be defined');

		return { properties, required };
	}

	test('createManageTodoListToolData should include description field when enabled', () => {
		const toolData = createManageTodoListToolData(false, true);
		const { properties, required } = getSchemaProperties(toolData);

		assert.strictEqual('description' in properties, true);
		assert.strictEqual(required.includes('description'), true);
		assert.deepStrictEqual(required, ['id', 'title', 'description', 'status']);
	});

	test('createManageTodoListToolData should exclude description field when disabled', () => {
		const toolData = createManageTodoListToolData(false, false);
		const { properties, required } = getSchemaProperties(toolData);

		assert.strictEqual('description' in properties, false);
		assert.strictEqual(required.includes('description'), false);
		assert.deepStrictEqual(required, ['id', 'title', 'status']);
	});

	test('createManageTodoListToolData should use default value for includeDescription', () => {
		const toolDataDefault = createManageTodoListToolData(false);
		const { properties, required } = getSchemaProperties(toolDataDefault);

		// Default should be true (includes description)
		assert.strictEqual('description' in properties, true);
		assert.strictEqual(required.includes('description'), true);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/Annotations_extractVulnerabilitiesFromText_multiline.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/Annotations_extractVulnerabilitiesFromText_multiline.0.snap

```text
[
  {
    kind: "markdownContent",
    content: {
      value: "some code\nover\nmultiple lines <vscode_annotation details='%5B%7B%22title%22%3A%22title%22%2C%22description%22%3A%22vuln%22%7D%5D'>content with vuln\nand\nnewlines</vscode_annotation>more code\nwith newline",
      isTrusted: false,
      supportThemeIcons: false,
      supportHtml: false,
      baseUri: undefined
    }
  }
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/Annotations_extractVulnerabilitiesFromText_multiline.1.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/Annotations_extractVulnerabilitiesFromText_multiline.1.snap

```text
{
  newText: "some code\nover\nmultiple lines content with vuln\nand\nnewlinesmore code\nwith newline",
  vulnerabilities: [
    {
      title: "title",
      description: "vuln",
      range: {
        startLineNumber: 3,
        startColumn: 16,
        endLineNumber: 5,
        endColumn: 9
      }
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/Annotations_extractVulnerabilitiesFromText_multiple_vulns.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/Annotations_extractVulnerabilitiesFromText_multiple_vulns.0.snap

```text
[
  {
    kind: "markdownContent",
    content: {
      value: "some code\nover\nmultiple lines <vscode_annotation details='%5B%7B%22title%22%3A%22title%22%2C%22description%22%3A%22vuln%22%7D%5D'>content with vuln\nand\nnewlines</vscode_annotation>more code\nwith newline<vscode_annotation details='%5B%7B%22title%22%3A%22title%22%2C%22description%22%3A%22vuln%22%7D%5D'>content with vuln\nand\nnewlines</vscode_annotation>",
      isTrusted: false,
      supportThemeIcons: false,
      supportHtml: false,
      baseUri: undefined
    }
  }
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/Annotations_extractVulnerabilitiesFromText_multiple_vulns.1.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/Annotations_extractVulnerabilitiesFromText_multiple_vulns.1.snap

```text
{
  newText: "some code\nover\nmultiple lines content with vuln\nand\nnewlinesmore code\nwith newlinecontent with vuln\nand\nnewlines",
  vulnerabilities: [
    {
      title: "title",
      description: "vuln",
      range: {
        startLineNumber: 3,
        startColumn: 16,
        endLineNumber: 5,
        endColumn: 9
      }
    },
    {
      title: "title",
      description: "vuln",
      range: {
        startLineNumber: 6,
        startColumn: 13,
        endLineNumber: 8,
        endColumn: 9
      }
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/Annotations_extractVulnerabilitiesFromText_single_line.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/Annotations_extractVulnerabilitiesFromText_single_line.0.snap

```text
[
  {
    kind: "markdownContent",
    content: {
      value: "some code <vscode_annotation details='%5B%7B%22title%22%3A%22title%22%2C%22description%22%3A%22vuln%22%7D%5D'>content with vuln</vscode_annotation> after",
      isTrusted: false,
      supportThemeIcons: false,
      supportHtml: false,
      baseUri: undefined
    }
  }
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/Annotations_extractVulnerabilitiesFromText_single_line.1.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/Annotations_extractVulnerabilitiesFromText_single_line.1.snap

```text
{
  newText: "some code content with vuln after",
  vulnerabilities: [
    {
      title: "title",
      description: "vuln",
      range: {
        startLineNumber: 1,
        startColumn: 11,
        endLineNumber: 1,
        endColumn: 28
      }
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_agents_and_tools_and_multiline.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_agents_and_tools_and_multiline.0.snap

```text
{
  parts: [
    {
      range: {
        start: 0,
        endExclusive: 6
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 7
      },
      agent: {
        id: "agent",
        name: "agent",
        extensionId: {
          value: "nullExtensionDescription",
          _lower: "nullextensiondescription"
        },
        extensionVersion: undefined,
        publisherDisplayName: "",
        extensionDisplayName: "",
        extensionPublisherId: "",
        locations: [ "panel" ],
        modes: [ "ask" ],
        metadata: {  },
        slashCommands: [
          {
            name: "subCommand",
            description: ""
          }
        ],
        disambiguation: [  ]
      },
      kind: "agent"
    },
    {
      range: {
        start: 6,
        endExclusive: 7
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 7,
        endLineNumber: 1,
        endColumn: 8
      },
      text: " ",
      kind: "text"
    },
    {
      range: {
        start: 7,
        endExclusive: 18
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 8,
        endLineNumber: 1,
        endColumn: 19
      },
      command: {
        name: "subCommand",
        description: ""
      },
      kind: "subcommand"
    },
    {
      range: {
        start: 18,
        endExclusive: 35
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 19,
        endLineNumber: 2,
        endColumn: 16
      },
      text: " \nPlease do with ",
      kind: "text"
    },
    {
      range: {
        start: 35,
        endExclusive: 45
      },
      editorRange: {
        startLineNumber: 2,
        startColumn: 16,
        endLineNumber: 2,
        endColumn: 26
      },
      toolName: "selection",
      toolId: "get_selection",
      displayName: "",
      icon: undefined,
      kind: "tool"
    },
    {
      range: {
        start: 45,
        endExclusive: 50
      },
      editorRange: {
        startLineNumber: 2,
        startColumn: 26,
        endLineNumber: 3,
        endColumn: 5
      },
      text: "\nand ",
      kind: "text"
    },
    {
      range: {
        start: 50,
        endExclusive: 63
      },
      editorRange: {
        startLineNumber: 3,
        startColumn: 5,
        endLineNumber: 3,
        endColumn: 18
      },
      toolName: "debugConsole",
      toolId: "get_debugConsole",
      displayName: "",
      icon: undefined,
      kind: "tool"
    }
  ],
  text: "@agent /subCommand \nPlease do with #selection\nand #debugConsole"
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_agents_and_tools_and_multiline__part2.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_agents_and_tools_and_multiline__part2.0.snap

```text
{
  parts: [
    {
      range: {
        start: 0,
        endExclusive: 6
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 7
      },
      agent: {
        id: "agent",
        name: "agent",
        extensionId: {
          value: "nullExtensionDescription",
          _lower: "nullextensiondescription"
        },
        extensionVersion: undefined,
        publisherDisplayName: "",
        extensionDisplayName: "",
        extensionPublisherId: "",
        locations: [ "panel" ],
        modes: [ "ask" ],
        metadata: {  },
        slashCommands: [
          {
            name: "subCommand",
            description: ""
          }
        ],
        disambiguation: [  ]
      },
      kind: "agent"
    },
    {
      range: {
        start: 6,
        endExclusive: 35
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 7,
        endLineNumber: 2,
        endColumn: 21
      },
      text: " Please \ndo /subCommand with ",
      kind: "text"
    },
    {
      range: {
        start: 35,
        endExclusive: 45
      },
      editorRange: {
        startLineNumber: 2,
        startColumn: 21,
        endLineNumber: 2,
        endColumn: 31
      },
      toolName: "selection",
      toolId: "get_selection",
      displayName: "",
      icon: undefined,
      kind: "tool"
    },
    {
      range: {
        start: 45,
        endExclusive: 50
      },
      editorRange: {
        startLineNumber: 2,
        startColumn: 31,
        endLineNumber: 3,
        endColumn: 5
      },
      text: "\nand ",
      kind: "text"
    },
    {
      range: {
        start: 50,
        endExclusive: 63
      },
      editorRange: {
        startLineNumber: 3,
        startColumn: 5,
        endLineNumber: 3,
        endColumn: 18
      },
      toolName: "debugConsole",
      toolId: "get_debugConsole",
      displayName: "",
      icon: undefined,
      kind: "tool"
    }
  ],
  text: "@agent Please \ndo /subCommand with #selection\nand #debugConsole"
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_agents__subCommand.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_agents__subCommand.0.snap

```text
{
  parts: [
    {
      range: {
        start: 0,
        endExclusive: 6
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 7
      },
      agent: {
        id: "agent",
        name: "agent",
        extensionId: {
          value: "nullExtensionDescription",
          _lower: "nullextensiondescription"
        },
        extensionVersion: undefined,
        publisherDisplayName: "",
        extensionDisplayName: "",
        extensionPublisherId: "",
        locations: [ "panel" ],
        modes: [ "ask" ],
        metadata: {  },
        slashCommands: [
          {
            name: "subCommand",
            description: ""
          }
        ],
        disambiguation: [  ]
      },
      kind: "agent"
    },
    {
      range: {
        start: 6,
        endExclusive: 7
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 7,
        endLineNumber: 1,
        endColumn: 8
      },
      text: " ",
      kind: "text"
    },
    {
      range: {
        start: 7,
        endExclusive: 18
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 8,
        endLineNumber: 1,
        endColumn: 19
      },
      command: {
        name: "subCommand",
        description: ""
      },
      kind: "subcommand"
    },
    {
      range: {
        start: 18,
        endExclusive: 35
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 19,
        endLineNumber: 1,
        endColumn: 36
      },
      text: " Please do thanks",
      kind: "text"
    }
  ],
  text: "@agent /subCommand Please do thanks"
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_agent_and_subcommand_after_newline.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_agent_and_subcommand_after_newline.0.snap

```text
{
  parts: [
    {
      range: {
        start: 0,
        endExclusive: 5
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 2,
        endColumn: 1
      },
      text: "    \n",
      kind: "text"
    },
    {
      range: {
        start: 5,
        endExclusive: 11
      },
      editorRange: {
        startLineNumber: 2,
        startColumn: 1,
        endLineNumber: 2,
        endColumn: 7
      },
      agent: {
        id: "agent",
        name: "agent",
        extensionId: {
          value: "nullExtensionDescription",
          _lower: "nullextensiondescription"
        },
        extensionVersion: undefined,
        publisherDisplayName: "",
        extensionDisplayName: "",
        extensionPublisherId: "",
        locations: [ "panel" ],
        modes: [ "ask" ],
        metadata: {  },
        slashCommands: [
          {
            name: "subCommand",
            description: ""
          }
        ],
        disambiguation: [  ]
      },
      kind: "agent"
    },
    {
      range: {
        start: 11,
        endExclusive: 12
      },
      editorRange: {
        startLineNumber: 2,
        startColumn: 7,
        endLineNumber: 3,
        endColumn: 1
      },
      text: "\n",
      kind: "text"
    },
    {
      range: {
        start: 12,
        endExclusive: 23
      },
      editorRange: {
        startLineNumber: 3,
        startColumn: 1,
        endLineNumber: 3,
        endColumn: 12
      },
      command: {
        name: "subCommand",
        description: ""
      },
      kind: "subcommand"
    },
    {
      range: {
        start: 23,
        endExclusive: 30
      },
      editorRange: {
        startLineNumber: 3,
        startColumn: 12,
        endLineNumber: 3,
        endColumn: 19
      },
      text: " Thanks",
      kind: "text"
    }
  ],
  text: "    \n@agent\n/subCommand Thanks"
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_agent_and_subcommand_with_leading_whitespace.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_agent_and_subcommand_with_leading_whitespace.0.snap

```text
{
  parts: [
    {
      range: {
        start: 0,
        endExclusive: 10
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 2,
        endColumn: 5
      },
      text: "    \r\n\t   ",
      kind: "text"
    },
    {
      range: {
        start: 10,
        endExclusive: 16
      },
      editorRange: {
        startLineNumber: 2,
        startColumn: 5,
        endLineNumber: 2,
        endColumn: 11
      },
      agent: {
        id: "agent",
        name: "agent",
        extensionId: {
          value: "nullExtensionDescription",
          _lower: "nullextensiondescription"
        },
        extensionVersion: undefined,
        publisherDisplayName: "",
        extensionDisplayName: "",
        extensionPublisherId: "",
        locations: [ "panel" ],
        modes: [ "ask" ],
        metadata: {  },
        slashCommands: [
          {
            name: "subCommand",
            description: ""
          }
        ],
        disambiguation: [  ]
      },
      kind: "agent"
    },
    {
      range: {
        start: 16,
        endExclusive: 23
      },
      editorRange: {
        startLineNumber: 2,
        startColumn: 11,
        endLineNumber: 3,
        endColumn: 5
      },
      text: " \r\n\t   ",
      kind: "text"
    },
    {
      range: {
        start: 23,
        endExclusive: 34
      },
      editorRange: {
        startLineNumber: 3,
        startColumn: 5,
        endLineNumber: 3,
        endColumn: 16
      },
      command: {
        name: "subCommand",
        description: ""
      },
      kind: "subcommand"
    },
    {
      range: {
        start: 34,
        endExclusive: 41
      },
      editorRange: {
        startLineNumber: 3,
        startColumn: 16,
        endLineNumber: 3,
        endColumn: 23
      },
      text: " Thanks",
      kind: "text"
    }
  ],
  text: "    \r\n\t   @agent \r\n\t   /subCommand Thanks"
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_agent_but_edit_mode.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_agent_but_edit_mode.0.snap

```text
{
  parts: [
    {
      range: {
        start: 0,
        endExclusive: 12
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 13
      },
      text: "@agent hello",
      kind: "text"
    }
  ],
  text: "@agent hello"
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_agent_not_first.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_agent_not_first.0.snap

```text
{
  parts: [
    {
      range: {
        start: 0,
        endExclusive: 16
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 17
      },
      text: "Hello Mr. @agent",
      kind: "text"
    }
  ],
  text: "Hello Mr. @agent"
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_agent_with_question_mark.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_agent_with_question_mark.0.snap

```text
{
  parts: [
    {
      range: {
        start: 0,
        endExclusive: 6
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 7
      },
      agent: {
        id: "agent",
        name: "agent",
        extensionId: {
          value: "nullExtensionDescription",
          _lower: "nullextensiondescription"
        },
        extensionVersion: undefined,
        publisherDisplayName: "",
        extensionDisplayName: "",
        extensionPublisherId: "",
        locations: [ "panel" ],
        modes: [ "ask" ],
        metadata: {  },
        slashCommands: [
          {
            name: "subCommand",
            description: ""
          }
        ],
        disambiguation: [  ]
      },
      kind: "agent"
    },
    {
      range: {
        start: 6,
        endExclusive: 21
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 7,
        endLineNumber: 1,
        endColumn: 22
      },
      text: "? Are you there",
      kind: "text"
    }
  ],
  text: "@agent? Are you there"
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_agent_with_subcommand_after_text.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_agent_with_subcommand_after_text.0.snap

```text
{
  parts: [
    {
      range: {
        start: 0,
        endExclusive: 6
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 7
      },
      agent: {
        id: "agent",
        name: "agent",
        extensionId: {
          value: "nullExtensionDescription",
          _lower: "nullextensiondescription"
        },
        extensionVersion: undefined,
        publisherDisplayName: "",
        extensionDisplayName: "",
        extensionPublisherId: "",
        locations: [ "panel" ],
        modes: [ "ask" ],
        metadata: {  },
        slashCommands: [
          {
            name: "subCommand",
            description: ""
          }
        ],
        disambiguation: [  ]
      },
      kind: "agent"
    },
    {
      range: {
        start: 6,
        endExclusive: 35
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 7,
        endLineNumber: 1,
        endColumn: 36
      },
      text: " Please do /subCommand thanks",
      kind: "text"
    }
  ],
  text: "@agent Please do /subCommand thanks"
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_invalid_slash_command.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_invalid_slash_command.0.snap

```text
{
  parts: [
    {
      range: {
        start: 0,
        endExclusive: 13
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 14
      },
      text: "/explain this",
      kind: "text"
    }
  ],
  text: "/explain this"
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_multiple_slash_commands.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_multiple_slash_commands.0.snap

```text
{
  parts: [
    {
      range: {
        start: 0,
        endExclusive: 4
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 5
      },
      slashCommand: { command: "fix" },
      kind: "slash"
    },
    {
      range: {
        start: 4,
        endExclusive: 9
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 5,
        endLineNumber: 1,
        endColumn: 10
      },
      text: " /fix",
      kind: "text"
    }
  ],
  text: "/fix /fix"
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_plain_text.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_plain_text.0.snap

```text
{
  parts: [
    {
      range: {
        start: 0,
        endExclusive: 4
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 5
      },
      text: "test",
      kind: "text"
    }
  ],
  text: "test"
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_plain_text_with_newlines.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_plain_text_with_newlines.0.snap

```text
{
  parts: [
    {
      range: {
        start: 0,
        endExclusive: 21
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 3,
        endColumn: 7
      },
      text: "line 1\nline 2\r\nline 3",
      kind: "text"
    }
  ],
  text: "line 1\nline 2\r\nline 3"
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_prompt_slash_command.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_prompt_slash_command.0.snap

```text
{
  parts: [
    {
      range: {
        start: 0,
        endExclusive: 4
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 5
      },
      text: "    ",
      kind: "text"
    },
    {
      range: {
        start: 4,
        endExclusive: 11
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 5,
        endLineNumber: 1,
        endColumn: 12
      },
      name: "prompt",
      kind: "prompt"
    }
  ],
  text: "    /prompt"
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_prompt_slash_command_after_slash.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_prompt_slash_command_after_slash.0.snap

```text
{
  parts: [
    {
      range: {
        start: 0,
        endExclusive: 41
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 42
      },
      text: "/ route and the request of /search-option",
      kind: "text"
    }
  ],
  text: "/ route and the request of /search-option"
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_prompt_slash_command_after_text.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_prompt_slash_command_after_text.0.snap

```text
{
  parts: [
    {
      range: {
        start: 0,
        endExclusive: 52
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 53
      },
      text: "handle the / route and the request of /search-option",
      kind: "text"
    }
  ],
  text: "handle the / route and the request of /search-option"
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_prompt_slash_command_with_numbers.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_prompt_slash_command_with_numbers.0.snap

```text
{
  parts: [
    {
      range: {
        start: 0,
        endExclusive: 11
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 12
      },
      name: "001-sample",
      kind: "prompt"
    },
    {
      range: {
        start: 11,
        endExclusive: 26
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 12,
        endLineNumber: 1,
        endColumn: 27
      },
      text: " this is a test",
      kind: "text"
    }
  ],
  text: "/001-sample this is a test"
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_slash_command.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_slash_command.0.snap

```text
{
  parts: [
    {
      range: {
        start: 0,
        endExclusive: 4
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 5
      },
      slashCommand: { command: "fix" },
      kind: "slash"
    },
    {
      range: {
        start: 4,
        endExclusive: 9
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 5,
        endLineNumber: 1,
        endColumn: 10
      },
      text: " this",
      kind: "text"
    }
  ],
  text: "/fix this"
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_slash_command_after_whitespace.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_slash_command_after_whitespace.0.snap

```text
{
  parts: [
    {
      range: {
        start: 0,
        endExclusive: 4
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 5
      },
      text: "    ",
      kind: "text"
    },
    {
      range: {
        start: 4,
        endExclusive: 8
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 5,
        endLineNumber: 1,
        endColumn: 9
      },
      slashCommand: { command: "fix" },
      kind: "slash"
    }
  ],
  text: "    /fix"
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_slash_command_not_first.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_slash_command_not_first.0.snap

```text
{
  parts: [
    {
      range: {
        start: 0,
        endExclusive: 10
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 11
      },
      text: "Hello /fix",
      kind: "text"
    }
  ],
  text: "Hello /fix"
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_slash_in_text.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatRequestParser_slash_in_text.0.snap

```text
{
  parts: [
    {
      range: {
        start: 0,
        endExclusive: 65
      },
      editorRange: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 66
      },
      text: "can we add a new file for an Express router to handle the / route",
      kind: "text"
    }
  ],
  text: "can we add a new file for an Express router to handle the / route"
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatService_can_deserialize.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatService_can_deserialize.0.snap

```text
{
  responderUsername: "",
  responderAvatarIconUri: undefined,
  initialLocation: "panel",
  requests: [
    {
      requestId: undefined,
      message: {
        text: "@ChatProviderWithUsedContext test request",
        parts: [
          {
            range: {
              start: 0,
              endExclusive: 28
            },
            editorRange: {
              startLineNumber: 1,
              startColumn: 1,
              endLineNumber: 1,
              endColumn: 29
            },
            agent: {
              name: "ChatProviderWithUsedContext",
              id: "ChatProviderWithUsedContext",
              extensionId: {
                value: "nullExtensionDescription",
                _lower: "nullextensiondescription"
              },
              extensionPublisherId: "",
              publisherDisplayName: "",
              extensionDisplayName: "",
              locations: [ "panel" ],
              modes: [ "ask" ],
              metadata: {  },
              slashCommands: [  ],
              disambiguation: [  ]
            },
            kind: "agent"
          },
          {
            range: {
              start: 28,
              endExclusive: 41
            },
            editorRange: {
              startLineNumber: 1,
              startColumn: 29,
              endLineNumber: 1,
              endColumn: 42
            },
            text: " test request",
            kind: "text"
          }
        ]
      },
      variableData: { variables: [  ] },
      response: [  ],
      shouldBeRemovedOnSend: undefined,
      agent: {
        name: "ChatProviderWithUsedContext",
        id: "ChatProviderWithUsedContext",
        extensionId: {
          value: "nullExtensionDescription",
          _lower: "nullextensiondescription"
        },
        extensionPublisherId: "",
        publisherDisplayName: "",
        extensionDisplayName: "",
        locations: [ "panel" ],
        modes: [ "ask" ],
        metadata: {  },
        slashCommands: [  ],
        disambiguation: [  ]
      },
      timestamp: undefined,
      confirmation: undefined,
      editedFileEvents: undefined,
      modelId: undefined,
      responseId: undefined,
      result: { metadata: { metadataKey: "value" } },
      responseMarkdownInfo: undefined,
      followups: undefined,
      modelState: {
        value: 1,
        completedAt: undefined
      },
      vote: undefined,
      voteDownReason: undefined,
      slashCommand: undefined,
      usedContext: {
        documents: [
          {
            uri: URI(file:///test/path/to/file),
            version: 3,
            ranges: [
              {
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: 2,
                endColumn: 2
              }
            ]
          }
        ],
        kind: "usedContext"
      },
      contentReferences: [  ],
      codeCitations: [  ],
      timeSpentWaiting: 0
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatService_can_deserialize_with_response.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatService_can_deserialize_with_response.0.snap

```text
{
  responderUsername: "",
  responderAvatarIconUri: undefined,
  initialLocation: "panel",
  requests: [
    {
      requestId: undefined,
      message: {
        text: "@ChatProviderWithUsedContext test request",
        parts: [
          {
            range: {
              start: 0,
              endExclusive: 28
            },
            editorRange: {
              startLineNumber: 1,
              startColumn: 1,
              endLineNumber: 1,
              endColumn: 29
            },
            agent: {
              name: "ChatProviderWithUsedContext",
              id: "ChatProviderWithUsedContext",
              extensionId: {
                value: "nullExtensionDescription",
                _lower: "nullextensiondescription"
              },
              extensionPublisherId: "",
              publisherDisplayName: "",
              extensionDisplayName: "",
              locations: [ "panel" ],
              modes: [ "ask" ],
              metadata: {  },
              slashCommands: [  ],
              disambiguation: [  ]
            },
            kind: "agent"
          },
          {
            range: {
              start: 28,
              endExclusive: 41
            },
            editorRange: {
              startLineNumber: 1,
              startColumn: 29,
              endLineNumber: 1,
              endColumn: 42
            },
            text: " test request",
            kind: "text"
          }
        ]
      },
      variableData: { variables: [  ] },
      response: [  ],
      shouldBeRemovedOnSend: undefined,
      agent: {
        name: "ChatProviderWithUsedContext",
        id: "ChatProviderWithUsedContext",
        extensionId: {
          value: "nullExtensionDescription",
          _lower: "nullextensiondescription"
        },
        extensionPublisherId: "",
        publisherDisplayName: "",
        extensionDisplayName: "",
        locations: [ "panel" ],
        modes: [ "ask" ],
        metadata: {  },
        slashCommands: [  ],
        disambiguation: [  ]
      },
      timestamp: undefined,
      confirmation: undefined,
      editedFileEvents: undefined,
      modelId: undefined,
      responseId: undefined,
      result: { errorDetails: { message: "No activated agent with id \"ChatProviderWithUsedContext\"" } },
      responseMarkdownInfo: undefined,
      followups: undefined,
      modelState: {
        value: 3,
        completedAt: undefined
      },
      vote: undefined,
      voteDownReason: undefined,
      slashCommand: undefined,
      usedContext: undefined,
      contentReferences: [  ],
      codeCitations: [  ],
      timeSpentWaiting: 0
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatService_can_serialize.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatService_can_serialize.0.snap

```text
{
  responderUsername: "",
  responderAvatarIconUri: undefined,
  initialLocation: "panel",
  requests: [  ]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatService_can_serialize.1.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatService_can_serialize.1.snap

```text
{
  responderUsername: "",
  responderAvatarIconUri: undefined,
  initialLocation: "panel",
  requests: [
    {
      requestId: undefined,
      message: {
        parts: [
          {
            range: {
              start: 0,
              endExclusive: 28
            },
            editorRange: {
              startLineNumber: 1,
              startColumn: 1,
              endLineNumber: 1,
              endColumn: 29
            },
            agent: {
              name: "ChatProviderWithUsedContext",
              id: "ChatProviderWithUsedContext",
              extensionId: {
                value: "nullExtensionDescription",
                _lower: "nullextensiondescription"
              },
              extensionVersion: undefined,
              extensionPublisherId: "",
              publisherDisplayName: "",
              extensionDisplayName: "",
              locations: [ "panel" ],
              modes: [ "ask" ],
              metadata: {  },
              slashCommands: [  ],
              disambiguation: [  ]
            },
            kind: "agent"
          },
          {
            range: {
              start: 28,
              endExclusive: 41
            },
            editorRange: {
              startLineNumber: 1,
              startColumn: 29,
              endLineNumber: 1,
              endColumn: 42
            },
            text: " test request",
            kind: "text"
          }
        ],
        text: "@ChatProviderWithUsedContext test request"
      },
      variableData: { variables: [  ] },
      response: [  ],
      shouldBeRemovedOnSend: undefined,
      agent: {
        name: "ChatProviderWithUsedContext",
        id: "ChatProviderWithUsedContext",
        extensionId: {
          value: "nullExtensionDescription",
          _lower: "nullextensiondescription"
        },
        extensionVersion: undefined,
        extensionPublisherId: "",
        publisherDisplayName: "",
        extensionDisplayName: "",
        locations: [ "panel" ],
        modes: [ "ask" ],
        metadata: {  },
        slashCommands: [  ],
        disambiguation: [  ]
      },
      timestamp: undefined,
      confirmation: undefined,
      editedFileEvents: undefined,
      modelId: undefined,
      responseId: undefined,
      result: { metadata: { metadataKey: "value" } },
      responseMarkdownInfo: undefined,
      followups: [
        {
          kind: "reply",
          message: "Something else",
          agentId: "",
          tooltip: "a tooltip"
        }
      ],
      modelState: {
        value: 1,
        completedAt: undefined
      },
      vote: undefined,
      voteDownReason: undefined,
      slashCommand: undefined,
      usedContext: {
        documents: [
          {
            uri: URI(file:///test/path/to/file),
            version: 3,
            ranges: [
              {
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: 2,
                endColumn: 2
              }
            ]
          }
        ],
        kind: "usedContext"
      },
      contentReferences: [  ],
      codeCitations: [  ],
      timeSpentWaiting: 0
    },
    {
      requestId: undefined,
      message: {
        parts: [
          {
            range: {
              start: 0,
              endExclusive: 14
            },
            editorRange: {
              startLineNumber: 1,
              startColumn: 1,
              endLineNumber: 1,
              endColumn: 15
            },
            text: "test request 2",
            kind: "text"
          }
        ],
        text: "test request 2"
      },
      variableData: { variables: [  ] },
      response: [  ],
      shouldBeRemovedOnSend: undefined,
      agent: {
        name: "testAgent",
        id: "testAgent",
        extensionId: {
          value: "nullExtensionDescription",
          _lower: "nullextensiondescription"
        },
        extensionVersion: undefined,
        extensionPublisherId: "",
        publisherDisplayName: "",
        extensionDisplayName: "",
        locations: [ "panel" ],
        modes: [ "ask" ],
        metadata: {  },
        slashCommands: [  ],
        disambiguation: [  ],
        isDefault: true
      },
      timestamp: undefined,
      confirmation: undefined,
      editedFileEvents: undefined,
      modelId: undefined,
      responseId: undefined,
      result: {  },
      responseMarkdownInfo: undefined,
      followups: [  ],
      modelState: {
        value: 1,
        completedAt: undefined
      },
      vote: undefined,
      voteDownReason: undefined,
      slashCommand: undefined,
      usedContext: undefined,
      contentReferences: [  ],
      codeCitations: [  ],
      timeSpentWaiting: 0
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatService_sendRequest_fails.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/ChatService_sendRequest_fails.0.snap

```text
{
  responderUsername: "",
  responderAvatarIconUri: undefined,
  initialLocation: "panel",
  requests: [
    {
      requestId: undefined,
      message: {
        parts: [
          {
            range: {
              start: 0,
              endExclusive: 28
            },
            editorRange: {
              startLineNumber: 1,
              startColumn: 1,
              endLineNumber: 1,
              endColumn: 29
            },
            agent: {
              name: "ChatProviderWithUsedContext",
              id: "ChatProviderWithUsedContext",
              extensionId: {
                value: "nullExtensionDescription",
                _lower: "nullextensiondescription"
              },
              extensionVersion: undefined,
              extensionPublisherId: "",
              publisherDisplayName: "",
              extensionDisplayName: "",
              locations: [ "panel" ],
              modes: [ "ask" ],
              metadata: {  },
              slashCommands: [  ],
              disambiguation: [  ]
            },
            kind: "agent"
          },
          {
            range: {
              start: 28,
              endExclusive: 41
            },
            editorRange: {
              startLineNumber: 1,
              startColumn: 29,
              endLineNumber: 1,
              endColumn: 42
            },
            text: " test request",
            kind: "text"
          }
        ],
        text: "@ChatProviderWithUsedContext test request"
      },
      variableData: { variables: [  ] },
      response: [  ],
      shouldBeRemovedOnSend: undefined,
      agent: {
        name: "ChatProviderWithUsedContext",
        id: "ChatProviderWithUsedContext",
        extensionId: {
          value: "nullExtensionDescription",
          _lower: "nullextensiondescription"
        },
        extensionVersion: undefined,
        extensionPublisherId: "",
        publisherDisplayName: "",
        extensionDisplayName: "",
        locations: [ "panel" ],
        modes: [ "ask" ],
        metadata: {  },
        slashCommands: [  ],
        disambiguation: [  ]
      },
      timestamp: undefined,
      confirmation: undefined,
      editedFileEvents: undefined,
      modelId: undefined,
      responseId: undefined,
      result: { errorDetails: { message: "No activated agent with id \"ChatProviderWithUsedContext\"" } },
      responseMarkdownInfo: undefined,
      followups: undefined,
      modelState: {
        value: 3,
        completedAt: undefined
      },
      vote: undefined,
      voteDownReason: undefined,
      slashCommand: undefined,
      usedContext: undefined,
      contentReferences: [  ],
      codeCitations: [  ],
      timeSpentWaiting: 0
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/Response_async_content.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/Response_async_content.0.snap

```text
[
  {
    resolvedContent: {  },
    content: "text",
    kind: "asyncContent"
  },
  {
    resolvedContent: {  },
    content: "text2",
    kind: "asyncContent"
  }
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/Response_async_content.1.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/Response_async_content.1.snap

```text
[
  {
    content: {
      value: "resolved",
      isTrusted: false,
      supportThemeIcons: false,
      supportHtml: false
    },
    kind: "markdownContent"
  },
  {
    kind: "treeData",
    treeData: {
      label: "label",
      uri: {
        scheme: "https",
        authority: "microsoft.com",
        path: "/",
        query: "",
        fragment: "",
        _formatted: null,
        _fsPath: null
      }
    }
  }
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/Response_content__markdown.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/Response_content__markdown.0.snap

```text
[
  {
    content: {
      value: "textmarkdown",
      isTrusted: { enabledCommands: [  ] },
      supportThemeIcons: false,
      supportHtml: false
    },
    kind: "markdownContent"
  }
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/Response_inline_reference.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/Response_inline_reference.0.snap

```text
[
  {
    content: {
      value: "text before ",
      isTrusted: false,
      supportThemeIcons: false,
      supportHtml: false,
      supportAlertSyntax: false
    },
    kind: "markdownContent"
  },
  {
    inlineReference: URI(https://microsoft.com/),
    kind: "inlineReference"
  },
  {
    content: {
      value: " text after",
      isTrusted: false,
      supportThemeIcons: false,
      supportHtml: false,
      supportAlertSyntax: false
    },
    kind: "markdownContent"
  }
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/Response_markdown__content.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/Response_markdown__content.0.snap

```text
[
  {
    content: {
      value: "markdowntext",
      isTrusted: false,
      supportThemeIcons: false,
      supportHtml: false
    },
    kind: "markdownContent"
  }
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/Response_markdown__markdown.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/Response_markdown__markdown.0.snap

```text
[
  {
    content: {
      value: "markdown1markdown2",
      isTrusted: { enabledCommands: [  ] },
      supportThemeIcons: false,
      supportHtml: false
    },
    kind: "markdownContent"
  }
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/Response_mergeable_markdown.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/Response_mergeable_markdown.0.snap

```text
[
  {
    content: {
      value: "markdown1markdown2",
      isTrusted: false,
      supportThemeIcons: false,
      supportHtml: false,
      baseUri: undefined
    },
    kind: "markdownContent"
  }
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/__snapshots__/Response_not_mergeable_markdown.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/__snapshots__/Response_not_mergeable_markdown.0.snap

```text
[
  {
    content: {
      value: "markdown1",
      isTrusted: false,
      supportThemeIcons: false,
      supportHtml: true,
      supportAlertSyntax: false
    },
    kind: "markdownContent"
  },
  {
    content: {
      value: "markdown2",
      isTrusted: false,
      supportThemeIcons: false,
      supportHtml: false,
      supportAlertSyntax: false
    },
    kind: "markdownContent"
  }
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/electron-browser/fetchPageTool.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/electron-browser/fetchPageTool.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { VSBuffer } from '../../../../../base/common/buffer.js';
import { URI } from '../../../../../base/common/uri.js';
import { ResourceMap } from '../../../../../base/common/map.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IFileContent, IReadFileOptions } from '../../../../../platform/files/common/files.js';
import { IWebContentExtractorService, WebContentExtractResult } from '../../../../../platform/webContentExtractor/common/webContentExtractor.js';
import { FetchWebPageTool } from '../../electron-browser/tools/fetchPageTool.js';
import { TestFileService } from '../../../../test/common/workbenchTestServices.js';
import { MockTrustedDomainService } from '../../../url/test/browser/mockTrustedDomainService.js';
import { InternalFetchWebPageToolId } from '../../common/tools/tools.js';
import { MockChatService } from '../common/mockChatService.js';
import { upcastDeepPartial } from '../../../../../base/test/common/mock.js';
import { IChatService } from '../../common/chatService.js';

class TestWebContentExtractorService implements IWebContentExtractorService {
	_serviceBrand: undefined;

	constructor(private uriToContentMap: ResourceMap<string>) { }

	async extract(uris: URI[]): Promise<WebContentExtractResult[]> {
		return uris.map(uri => {
			const content = this.uriToContentMap.get(uri);
			if (content === undefined) {
				throw new Error(`No content configured for URI: ${uri.toString()}`);
			}
			return { status: 'ok', result: content };
		});
	}
}

class ExtendedTestFileService extends TestFileService {
	constructor(private uriToContentMap: ResourceMap<string | VSBuffer>) {
		super();
	}

	override async readFile(resource: URI, options?: IReadFileOptions | undefined): Promise<IFileContent> {
		const content = this.uriToContentMap.get(resource);
		if (content === undefined) {
			throw new Error(`File not found: ${resource.toString()}`);
		}

		const buffer = typeof content === 'string' ? VSBuffer.fromString(content) : content;
		return {
			resource,
			value: buffer,
			name: '',
			size: buffer.byteLength,
			etag: '',
			mtime: 0,
			ctime: 0,
			readonly: false,
			locked: false
		};
	}

	override async stat(resource: URI) {
		// Check if the resource exists in our map
		if (!this.uriToContentMap.has(resource)) {
			throw new Error(`File not found: ${resource.toString()}`);
		}

		return super.stat(resource);
	}
}

suite('FetchWebPageTool', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('should handle http/https via web content extractor and other schemes via file service', async () => {
		const webContentMap = new ResourceMap<string>([
			[URI.parse('https://example.com'), 'HTTPS content'],
			[URI.parse('http://example.com'), 'HTTP content']
		]);

		const fileContentMap = new ResourceMap<string | VSBuffer>([
			[URI.parse('test://static/resource/50'), 'MCP resource content'],
			[URI.parse('mcp-resource://746573742D736572766572/custom/hello/world.txt'), 'Custom MCP content']
		]);

		const tool = new FetchWebPageTool(
			new TestWebContentExtractorService(webContentMap),
			new ExtendedTestFileService(fileContentMap),
			new MockTrustedDomainService(),
			new MockChatService(),
		);

		const testUrls = [
			'https://example.com',
			'http://example.com',
			'test://static/resource/50',
			'mcp-resource://746573742D736572766572/custom/hello/world.txt',
			'file:///path/to/nonexistent',
			'ftp://example.com',
			'invalid-url'
		];

		const result = await tool.invoke(
			{ callId: 'test-call-1', toolId: 'fetch-page', parameters: { urls: testUrls }, context: undefined },
			() => Promise.resolve(0),
			{ report: () => { } },
			CancellationToken.None
		);

		// Should have 7 results (one for each input URL)
		assert.strictEqual(result.content.length, 7, 'Should have result for each input URL');

		// HTTP and HTTPS URLs should have their content from web extractor
		assert.strictEqual(result.content[0].value, 'HTTPS content', 'HTTPS URL should return content');
		assert.strictEqual(result.content[1].value, 'HTTP content', 'HTTP URL should return content');

		// MCP resources should have their content from file service
		assert.strictEqual(result.content[2].value, 'MCP resource content', 'test:// URL should return content from file service');
		assert.strictEqual(result.content[3].value, 'Custom MCP content', 'mcp-resource:// URL should return content from file service');

		// Nonexistent file should be marked as invalid
		assert.strictEqual(result.content[4].value, 'Invalid URL', 'Nonexistent file should be invalid');

		// Unsupported scheme (ftp) should be marked as invalid since file service can't handle it
		assert.strictEqual(result.content[5].value, 'Invalid URL', 'ftp:// URL should be invalid');

		// Invalid URL should be marked as invalid
		assert.strictEqual(result.content[6].value, 'Invalid URL', 'Invalid URL should be invalid');

		// All successfully fetched URLs should be in toolResultDetails
		assert.strictEqual(Array.isArray(result.toolResultDetails) ? result.toolResultDetails.length : 0, 4, 'Should have 4 valid URLs in toolResultDetails');
	});

	test('should handle empty and undefined URLs', async () => {
		const tool = new FetchWebPageTool(
			new TestWebContentExtractorService(new ResourceMap<string>()),
			new ExtendedTestFileService(new ResourceMap<string | VSBuffer>()),
			new MockTrustedDomainService([]),
			new MockChatService(),
		);

		// Test empty array
		const emptyResult = await tool.invoke(
			{ callId: 'test-call-2', toolId: 'fetch-page', parameters: { urls: [] }, context: undefined },
			() => Promise.resolve(0),
			{ report: () => { } },
			CancellationToken.None
		);
		assert.strictEqual(emptyResult.content.length, 1, 'Empty array should return single message');
		assert.strictEqual(emptyResult.content[0].value, 'No valid URLs provided.', 'Should indicate no valid URLs');

		// Test undefined
		const undefinedResult = await tool.invoke(
			{ callId: 'test-call-3', toolId: 'fetch-page', parameters: {}, context: undefined },
			() => Promise.resolve(0),
			{ report: () => { } },
			CancellationToken.None
		);
		assert.strictEqual(undefinedResult.content.length, 1, 'Undefined URLs should return single message');
		assert.strictEqual(undefinedResult.content[0].value, 'No valid URLs provided.', 'Should indicate no valid URLs');

		// Test array with invalid URLs
		const invalidResult = await tool.invoke(
			{ callId: 'test-call-4', toolId: 'fetch-page', parameters: { urls: ['', ' ', 'invalid-scheme-that-fileservice-cannot-handle://test'] }, context: undefined },
			() => Promise.resolve(0),
			{ report: () => { } },
			CancellationToken.None
		);
		assert.strictEqual(invalidResult.content.length, 3, 'Should have result for each invalid URL');
		assert.strictEqual(invalidResult.content[0].value, 'Invalid URL', 'Empty string should be invalid');
		assert.strictEqual(invalidResult.content[1].value, 'Invalid URL', 'Space-only string should be invalid');
		assert.strictEqual(invalidResult.content[2].value, 'Invalid URL', 'Unhandleable scheme should be invalid');
	});

	test('should provide correct past tense messages for mixed valid/invalid URLs', async () => {
		const webContentMap = new ResourceMap<string>([
			[URI.parse('https://valid.com'), 'Valid content']
		]);

		const fileContentMap = new ResourceMap<string | VSBuffer>([
			[URI.parse('test://valid/resource'), 'Valid MCP content']
		]);

		const tool = new FetchWebPageTool(
			new TestWebContentExtractorService(webContentMap),
			new ExtendedTestFileService(fileContentMap),
			new MockTrustedDomainService(),
			new MockChatService(),
		);

		const preparation = await tool.prepareToolInvocation(
			{ parameters: { urls: ['https://valid.com', 'test://valid/resource', 'invalid://invalid'] } },
			CancellationToken.None
		);

		assert.ok(preparation, 'Should return prepared invocation');
		assert.ok(preparation.pastTenseMessage, 'Should have past tense message');
		const messageText = typeof preparation.pastTenseMessage === 'string' ? preparation.pastTenseMessage : preparation.pastTenseMessage!.value;
		assert.ok(messageText.includes('Fetched'), 'Should mention fetched resources');
		assert.ok(messageText.includes('invalid://invalid'), 'Should mention invalid URL');
	});

	test('should approve when all URLs were mentioned in chat', async () => {
		const webContentMap = new ResourceMap<string>([
			[URI.parse('https://valid.com'), 'Valid content']
		]);

		const fileContentMap = new ResourceMap<string | VSBuffer>([
			[URI.parse('test://valid/resource'), 'Valid MCP content']
		]);

		const tool = new FetchWebPageTool(
			new TestWebContentExtractorService(webContentMap),
			new ExtendedTestFileService(fileContentMap),
			new MockTrustedDomainService(),
			upcastDeepPartial<IChatService>({
				getSession: () => {
					return {
						getRequests: () => [{
							message: {
								text: 'fetch https://example.com'
							}
						}],
					};
				},
			}),
		);

		const preparation1 = await tool.prepareToolInvocation(
			{ parameters: { urls: ['https://example.com'] }, chatSessionId: 'a' },
			CancellationToken.None
		);

		assert.ok(preparation1, 'Should return prepared invocation');
		assert.strictEqual(preparation1.confirmationMessages?.title, undefined);

		const preparation2 = await tool.prepareToolInvocation(
			{ parameters: { urls: ['https://other.com'] }, chatSessionId: 'a' },
			CancellationToken.None
		);

		assert.ok(preparation2, 'Should return prepared invocation');
		assert.ok(preparation2.confirmationMessages?.title);
	});

	test('should return message for binary files indicating they are not supported', async () => {
		// Create binary content (a simple PNG-like header with null bytes)
		const binaryContent = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D]);
		const binaryBuffer = VSBuffer.wrap(binaryContent);

		const fileContentMap = new ResourceMap<string | VSBuffer>([
			[URI.parse('file:///path/to/binary.dat'), binaryBuffer],
			[URI.parse('file:///path/to/text.txt'), 'This is text content']
		]);

		const tool = new FetchWebPageTool(
			new TestWebContentExtractorService(new ResourceMap<string>()),
			new ExtendedTestFileService(fileContentMap),
			new MockTrustedDomainService(),
			new MockChatService(),
		);

		const result = await tool.invoke(
			{
				callId: 'test-call-binary',
				toolId: 'fetch-page',
				parameters: { urls: ['file:///path/to/binary.dat', 'file:///path/to/text.txt'] },
				context: undefined
			},
			() => Promise.resolve(0),
			{ report: () => { } },
			CancellationToken.None
		);

		// Should have 2 results
		assert.strictEqual(result.content.length, 2, 'Should have 2 results');

		// First result should be a text part with binary not supported message
		assert.strictEqual(result.content[0].kind, 'text', 'Binary file should return text part');
		if (result.content[0].kind === 'text') {
			assert.strictEqual(result.content[0].value, 'Binary files are not supported at the moment.', 'Should return not supported message');
		}

		// Second result should be a text part for the text file
		assert.strictEqual(result.content[1].kind, 'text', 'Text file should return text part');
		if (result.content[1].kind === 'text') {
			assert.strictEqual(result.content[1].value, 'This is text content', 'Should return text content');
		}

		// Both files should be in toolResultDetails since they were successfully fetched
		assert.strictEqual(Array.isArray(result.toolResultDetails) ? result.toolResultDetails.length : 0, 2, 'Should have 2 valid URLs in toolResultDetails');
	});

	test('PNG files are now supported as image data parts (regression test)', async () => {
		// This test ensures that PNG files that previously returned "not supported"
		// messages now return proper image data parts
		const binaryContent = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D]);
		const binaryBuffer = VSBuffer.wrap(binaryContent);

		const fileContentMap = new ResourceMap<string | VSBuffer>([
			[URI.parse('file:///path/to/image.png'), binaryBuffer]
		]);

		const tool = new FetchWebPageTool(
			new TestWebContentExtractorService(new ResourceMap<string>()),
			new ExtendedTestFileService(fileContentMap),
			new MockTrustedDomainService(),
			new MockChatService(),
		);

		const result = await tool.invoke(
			{
				callId: 'test-png-support',
				toolId: 'fetch-page',
				parameters: { urls: ['file:///path/to/image.png'] },
				context: undefined
			},
			() => Promise.resolve(0),
			{ report: () => { } },
			CancellationToken.None
		);

		// Should have 1 result
		assert.strictEqual(result.content.length, 1, 'Should have 1 result');

		// PNG file should now be returned as a data part, not a "not supported" message
		assert.strictEqual(result.content[0].kind, 'data', 'PNG file should return data part');
		if (result.content[0].kind === 'data') {
			assert.strictEqual(result.content[0].value.mimeType, 'image/png', 'Should have PNG MIME type');
			assert.strictEqual(result.content[0].value.data, binaryBuffer, 'Should have correct binary data');
		}
	});

	test('should correctly distinguish between binary and text content', async () => {
		// Create content that might be ambiguous
		const jsonData = '{"name": "test", "value": 123}';
		// Create definitely binary data - some random bytes with null bytes that don't follow UTF-16 pattern
		const realBinaryData = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x00, 0x00, 0x00, 0x0D, 0xFF, 0x00, 0xAB]); // More clearly binary

		const fileContentMap = new ResourceMap<string | VSBuffer>([
			[URI.parse('file:///data.json'), jsonData], // Should be detected as text
			[URI.parse('file:///binary.dat'), VSBuffer.wrap(realBinaryData)] // Should be detected as binary
		]);

		const tool = new FetchWebPageTool(
			new TestWebContentExtractorService(new ResourceMap<string>()),
			new ExtendedTestFileService(fileContentMap),
			new MockTrustedDomainService(),
			new MockChatService(),
		);

		const result = await tool.invoke(
			{
				callId: 'test-distinguish',
				toolId: 'fetch-page',
				parameters: { urls: ['file:///data.json', 'file:///binary.dat'] },
				context: undefined
			},
			() => Promise.resolve(0),
			{ report: () => { } },
			CancellationToken.None
		);

		// JSON should be returned as text
		assert.strictEqual(result.content[0].kind, 'text', 'JSON should be detected as text');
		if (result.content[0].kind === 'text') {
			assert.strictEqual(result.content[0].value, jsonData, 'Should return JSON as text');
		}

		// Binary data should be returned as not supported message
		assert.strictEqual(result.content[1].kind, 'text', 'Binary content should return text part with message');
		if (result.content[1].kind === 'text') {
			assert.strictEqual(result.content[1].value, 'Binary files are not supported at the moment.', 'Should return not supported message');
		}
	});

	test('Supported image files are returned as data parts', async () => {
		// Test data for different supported image formats
		const pngData = VSBuffer.fromString('fake PNG data');
		const jpegData = VSBuffer.fromString('fake JPEG data');
		const gifData = VSBuffer.fromString('fake GIF data');
		const webpData = VSBuffer.fromString('fake WebP data');
		const bmpData = VSBuffer.fromString('fake BMP data');

		const fileContentMap = new ResourceMap<string | VSBuffer>();
		fileContentMap.set(URI.parse('file:///image.png'), pngData);
		fileContentMap.set(URI.parse('file:///photo.jpg'), jpegData);
		fileContentMap.set(URI.parse('file:///animation.gif'), gifData);
		fileContentMap.set(URI.parse('file:///modern.webp'), webpData);
		fileContentMap.set(URI.parse('file:///bitmap.bmp'), bmpData);

		const tool = new FetchWebPageTool(
			new TestWebContentExtractorService(new ResourceMap<string>()),
			new ExtendedTestFileService(fileContentMap),
			new MockTrustedDomainService(),
			new MockChatService(),
		);

		const result = await tool.invoke(
			{
				callId: 'test-images',
				toolId: 'fetch-page',
				parameters: { urls: ['file:///image.png', 'file:///photo.jpg', 'file:///animation.gif', 'file:///modern.webp', 'file:///bitmap.bmp'] },
				context: undefined
			},
			() => Promise.resolve(0),
			{ report: () => { } },
			CancellationToken.None
		);

		// All images should be returned as data parts
		assert.strictEqual(result.content.length, 5, 'Should have 5 results');

		// Check PNG
		assert.strictEqual(result.content[0].kind, 'data', 'PNG should be data part');
		if (result.content[0].kind === 'data') {
			assert.strictEqual(result.content[0].value.mimeType, 'image/png', 'PNG should have correct MIME type');
			assert.strictEqual(result.content[0].value.data, pngData, 'PNG should have correct data');
		}

		// Check JPEG
		assert.strictEqual(result.content[1].kind, 'data', 'JPEG should be data part');
		if (result.content[1].kind === 'data') {
			assert.strictEqual(result.content[1].value.mimeType, 'image/jpeg', 'JPEG should have correct MIME type');
			assert.strictEqual(result.content[1].value.data, jpegData, 'JPEG should have correct data');
		}

		// Check GIF
		assert.strictEqual(result.content[2].kind, 'data', 'GIF should be data part');
		if (result.content[2].kind === 'data') {
			assert.strictEqual(result.content[2].value.mimeType, 'image/gif', 'GIF should have correct MIME type');
			assert.strictEqual(result.content[2].value.data, gifData, 'GIF should have correct data');
		}

		// Check WebP
		assert.strictEqual(result.content[3].kind, 'data', 'WebP should be data part');
		if (result.content[3].kind === 'data') {
			assert.strictEqual(result.content[3].value.mimeType, 'image/webp', 'WebP should have correct MIME type');
			assert.strictEqual(result.content[3].value.data, webpData, 'WebP should have correct data');
		}

		// Check BMP
		assert.strictEqual(result.content[4].kind, 'data', 'BMP should be data part');
		if (result.content[4].kind === 'data') {
			assert.strictEqual(result.content[4].value.mimeType, 'image/bmp', 'BMP should have correct MIME type');
			assert.strictEqual(result.content[4].value.data, bmpData, 'BMP should have correct data');
		}
	});

	test('Mixed image and text files work correctly', async () => {
		const textData = 'This is some text content';
		const imageData = VSBuffer.fromString('fake image data');

		const fileContentMap = new ResourceMap<string | VSBuffer>();
		fileContentMap.set(URI.parse('file:///text.txt'), textData);
		fileContentMap.set(URI.parse('file:///image.png'), imageData);

		const tool = new FetchWebPageTool(
			new TestWebContentExtractorService(new ResourceMap<string>()),
			new ExtendedTestFileService(fileContentMap),
			new MockTrustedDomainService(),
			new MockChatService(),
		);

		const result = await tool.invoke(
			{
				callId: 'test-mixed',
				toolId: 'fetch-page',
				parameters: { urls: ['file:///text.txt', 'file:///image.png'] },
				context: undefined
			},
			() => Promise.resolve(0),
			{ report: () => { } },
			CancellationToken.None
		);

		// Text should be returned as text part
		assert.strictEqual(result.content[0].kind, 'text', 'Text file should be text part');
		if (result.content[0].kind === 'text') {
			assert.strictEqual(result.content[0].value, textData, 'Text should have correct content');
		}

		// Image should be returned as data part
		assert.strictEqual(result.content[1].kind, 'data', 'Image file should be data part');
		if (result.content[1].kind === 'data') {
			assert.strictEqual(result.content[1].value.mimeType, 'image/png', 'Image should have correct MIME type');
			assert.strictEqual(result.content[1].value.data, imageData, 'Image should have correct data');
		}
	});

	test('Case insensitive image extensions work', async () => {
		const imageData = VSBuffer.fromString('fake image data');

		const fileContentMap = new ResourceMap<string | VSBuffer>();
		fileContentMap.set(URI.parse('file:///image.PNG'), imageData);
		fileContentMap.set(URI.parse('file:///photo.JPEG'), imageData);

		const tool = new FetchWebPageTool(
			new TestWebContentExtractorService(new ResourceMap<string>()),
			new ExtendedTestFileService(fileContentMap),
			new MockTrustedDomainService(),
			new MockChatService(),
		);

		const result = await tool.invoke(
			{
				callId: 'test-case',
				toolId: 'fetch-page',
				parameters: { urls: ['file:///image.PNG', 'file:///photo.JPEG'] },
				context: undefined
			},
			() => Promise.resolve(0),
			{ report: () => { } },
			CancellationToken.None
		);

		// Both should be returned as data parts despite uppercase extensions
		assert.strictEqual(result.content[0].kind, 'data', 'PNG with uppercase extension should be data part');
		if (result.content[0].kind === 'data') {
			assert.strictEqual(result.content[0].value.mimeType, 'image/png', 'Should have correct MIME type');
		}

		assert.strictEqual(result.content[1].kind, 'data', 'JPEG with uppercase extension should be data part');
		if (result.content[1].kind === 'data') {
			assert.strictEqual(result.content[1].value.mimeType, 'image/jpeg', 'Should have correct MIME type');
		}
	});

	// Comprehensive tests for toolResultDetails
	suite('toolResultDetails', () => {
		test('should include only successfully fetched URIs in correct order', async () => {
			const webContentMap = new ResourceMap<string>([
				[URI.parse('https://success1.com'), 'Content 1'],
				[URI.parse('https://success2.com'), 'Content 2']
			]);

			const fileContentMap = new ResourceMap<string | VSBuffer>([
				[URI.parse('file:///success.txt'), 'File content'],
				[URI.parse('mcp-resource://server/file.txt'), 'MCP content']
			]);

			const tool = new FetchWebPageTool(
				new TestWebContentExtractorService(webContentMap),
				new ExtendedTestFileService(fileContentMap),
				new MockTrustedDomainService(),
				new MockChatService(),
			);

			const testUrls = [
				'https://success1.com',       // index 0 - should be in toolResultDetails
				'invalid-url',                // index 1 - should NOT be in toolResultDetails
				'file:///success.txt',        // index 2 - should be in toolResultDetails
				'https://success2.com',       // index 3 - should be in toolResultDetails
				'file:///nonexistent.txt',    // index 4 - should NOT be in toolResultDetails
				'mcp-resource://server/file.txt' // index 5 - should be in toolResultDetails
			];

			const result = await tool.invoke(
				{ callId: 'test-details', toolId: 'fetch-page', parameters: { urls: testUrls }, context: undefined },
				() => Promise.resolve(0),
				{ report: () => { } },
				CancellationToken.None
			);

			// Verify toolResultDetails contains exactly the successful URIs
			assert.ok(Array.isArray(result.toolResultDetails), 'toolResultDetails should be an array');
			assert.strictEqual(result.toolResultDetails.length, 4, 'Should have 4 successful URIs');

			// Check that all entries are URI objects
			const uriDetails = result.toolResultDetails as URI[];
			assert.ok(uriDetails.every(uri => uri instanceof URI), 'All toolResultDetails entries should be URI objects');

			// Check specific URIs are included (web URIs first, then successful file URIs)
			const expectedUris = [
				'https://success1.com/',
				'https://success2.com/',
				'file:///success.txt',
				'mcp-resource://server/file.txt'
			];

			const actualUriStrings = uriDetails.map(uri => uri.toString());
			assert.deepStrictEqual(actualUriStrings.sort(), expectedUris.sort(), 'Should contain exactly the expected successful URIs');

			// Verify content array matches input order (including failures)
			assert.strictEqual(result.content.length, 6, 'Content should have result for each input URL');
			assert.strictEqual(result.content[0].value, 'Content 1', 'First web URI content');
			assert.strictEqual(result.content[1].value, 'Invalid URL', 'Invalid URL marked as invalid');
			assert.strictEqual(result.content[2].value, 'File content', 'File URI content');
			assert.strictEqual(result.content[3].value, 'Content 2', 'Second web URI content');
			assert.strictEqual(result.content[4].value, 'Invalid URL', 'Nonexistent file marked as invalid');
			assert.strictEqual(result.content[5].value, 'MCP content', 'MCP resource content');
		});

		test('should exclude failed web requests from toolResultDetails', async () => {
			// Set up web content extractor that will throw for some URIs
			const webContentMap = new ResourceMap<string>([
				[URI.parse('https://success.com'), 'Success content']
				// https://failure.com not in map - will throw error
			]);

			const tool = new FetchWebPageTool(
				new TestWebContentExtractorService(webContentMap),
				new ExtendedTestFileService(new ResourceMap<string | VSBuffer>()),
				new MockTrustedDomainService([]),
				new MockChatService(),
			);

			const testUrls = [
				'https://success.com',  // Should succeed
				'https://failure.com'   // Should fail (not in content map)
			];

			try {
				await tool.invoke(
					{ callId: 'test-web-failure', toolId: 'fetch-page', parameters: { urls: testUrls }, context: undefined },
					() => Promise.resolve(0),
					{ report: () => { } },
					CancellationToken.None
				);

				// If the web extractor throws, it should be handled gracefully
				// But in this test setup, the TestWebContentExtractorService throws for missing content
				assert.fail('Expected test web content extractor to throw for missing URI');
			} catch (error) {
				// This is expected behavior with the current test setup
				// The TestWebContentExtractorService throws when content is not found
				assert.ok(error.message.includes('No content configured for URI'), 'Should throw for unconfigured URI');
			}
		});

		test('should exclude failed file reads from toolResultDetails', async () => {
			const fileContentMap = new ResourceMap<string | VSBuffer>([
				[URI.parse('file:///existing.txt'), 'File exists']
				// file:///missing.txt not in map - will throw error
			]);

			const tool = new FetchWebPageTool(
				new TestWebContentExtractorService(new ResourceMap<string>()),
				new ExtendedTestFileService(fileContentMap),
				new MockTrustedDomainService(),
				new MockChatService(),
			);

			const testUrls = [
				'file:///existing.txt',  // Should succeed
				'file:///missing.txt'    // Should fail (not in file map)
			];

			const result = await tool.invoke(
				{ callId: 'test-file-failure', toolId: 'fetch-page', parameters: { urls: testUrls }, context: undefined },
				() => Promise.resolve(0),
				{ report: () => { } },
				CancellationToken.None
			);

			// Verify only successful file URI is in toolResultDetails
			assert.ok(Array.isArray(result.toolResultDetails), 'toolResultDetails should be an array');
			assert.strictEqual(result.toolResultDetails.length, 1, 'Should have only 1 successful URI');

			const uriDetails = result.toolResultDetails as URI[];
			assert.strictEqual(uriDetails[0].toString(), 'file:///existing.txt', 'Should contain only the successful file URI');

			// Verify content reflects both attempts
			assert.strictEqual(result.content.length, 2, 'Should have results for both input URLs');
			assert.strictEqual(result.content[0].value, 'File exists', 'First file should have content');
			assert.strictEqual(result.content[1].value, 'Invalid URL', 'Second file should be marked invalid');
		});

		test('should handle mixed success and failure scenarios', async () => {
			const webContentMap = new ResourceMap<string>([
				[URI.parse('https://web-success.com'), 'Web success']
			]);

			const fileContentMap = new ResourceMap<string | VSBuffer>([
				[URI.parse('file:///file-success.txt'), 'File success'],
				[URI.parse('mcp-resource://good/file.txt'), VSBuffer.fromString('MCP binary content')]
			]);

			const tool = new FetchWebPageTool(
				new TestWebContentExtractorService(webContentMap),
				new ExtendedTestFileService(fileContentMap),
				new MockTrustedDomainService(),
				new MockChatService(),
			);

			const testUrls = [
				'invalid-scheme://bad',      // Invalid URI
				'https://web-success.com',   // Web success
				'file:///file-missing.txt',  // File failure
				'file:///file-success.txt',  // File success
				'completely-invalid-url',    // Invalid URL format
				'mcp-resource://good/file.txt' // MCP success
			];

			const result = await tool.invoke(
				{ callId: 'test-mixed', toolId: 'fetch-page', parameters: { urls: testUrls }, context: undefined },
				() => Promise.resolve(0),
				{ report: () => { } },
				CancellationToken.None
			);

			// Should have 3 successful URIs: web-success, file-success, mcp-success
			assert.ok(Array.isArray(result.toolResultDetails), 'toolResultDetails should be an array');
			assert.strictEqual((result.toolResultDetails as URI[]).length, 3, 'Should have 3 successful URIs');

			const uriDetails = result.toolResultDetails as URI[];
			const actualUriStrings = uriDetails.map(uri => uri.toString());
			const expectedSuccessful = [
				'https://web-success.com/',
				'file:///file-success.txt',
				'mcp-resource://good/file.txt'
			];

			assert.deepStrictEqual(actualUriStrings.sort(), expectedSuccessful.sort(), 'Should contain exactly the successful URIs');

			// Verify content array reflects all inputs in original order
			assert.strictEqual(result.content.length, 6, 'Should have results for all input URLs');
			assert.strictEqual(result.content[0].value, 'Invalid URL', 'Invalid scheme marked as invalid');
			assert.strictEqual(result.content[1].value, 'Web success', 'Web success content');
			assert.strictEqual(result.content[2].value, 'Invalid URL', 'Missing file marked as invalid');
			assert.strictEqual(result.content[3].value, 'File success', 'File success content');
			assert.strictEqual(result.content[4].value, 'Invalid URL', 'Invalid URL marked as invalid');
			assert.strictEqual(result.content[5].value, 'MCP binary content', 'MCP success content');
		});

		test('should return empty toolResultDetails when all requests fail', async () => {
			const tool = new FetchWebPageTool(
				new TestWebContentExtractorService(new ResourceMap<string>()), // Empty - all web requests fail
				new ExtendedTestFileService(new ResourceMap<string | VSBuffer>()), // Empty - all file ,
				new MockTrustedDomainService([]),
				new MockChatService(),
			);

			const testUrls = [
				'https://nonexistent.com',
				'file:///missing.txt',
				'invalid-url',
				'bad://scheme'
			];

			try {
				const result = await tool.invoke(
					{ callId: 'test-all-fail', toolId: 'fetch-page', parameters: { urls: testUrls }, context: undefined },
					() => Promise.resolve(0),
					{ report: () => { } },
					CancellationToken.None
				);

				// If web extractor doesn't throw, check the results
				assert.ok(Array.isArray(result.toolResultDetails), 'toolResultDetails should be an array');
				assert.strictEqual((result.toolResultDetails as URI[]).length, 0, 'Should have no successful URIs');
				assert.strictEqual(result.content.length, 4, 'Should have results for all input URLs');
				assert.ok(result.content.every(content => content.value === 'Invalid URL'), 'All content should be marked as invalid');
			} catch (error) {
				// Expected with TestWebContentExtractorService when no content is configured
				assert.ok(error.message.includes('No content configured for URI'), 'Should throw for unconfigured URI');
			}
		});

		test('should handle empty URL array', async () => {
			const tool = new FetchWebPageTool(
				new TestWebContentExtractorService(new ResourceMap<string>()),
				new ExtendedTestFileService(new ResourceMap<string | VSBuffer>()),
				new MockTrustedDomainService([]),
				new MockChatService(),
			);

			const result = await tool.invoke(
				{ callId: 'test-empty', toolId: 'fetch-page', parameters: { urls: [] }, context: undefined },
				() => Promise.resolve(0),
				{ report: () => { } },
				CancellationToken.None
			);

			assert.strictEqual(result.content.length, 1, 'Should have one content item for empty URLs');
			assert.strictEqual(result.content[0].value, 'No valid URLs provided.', 'Should indicate no valid URLs');
			assert.ok(!result.toolResultDetails, 'toolResultDetails should not be present for empty URLs');
		});

		test('should handle image files in toolResultDetails', async () => {
			const imageBuffer = VSBuffer.fromString('fake-png-data');
			const fileContentMap = new ResourceMap<string | VSBuffer>([
				[URI.parse('file:///image.png'), imageBuffer],
				[URI.parse('file:///document.txt'), 'Text content']
			]);

			const tool = new FetchWebPageTool(
				new TestWebContentExtractorService(new ResourceMap<string>()),
				new ExtendedTestFileService(fileContentMap),
				new MockTrustedDomainService(),
				new MockChatService(),
			);

			const result = await tool.invoke(
				{ callId: 'test-images', toolId: 'fetch-page', parameters: { urls: ['file:///image.png', 'file:///document.txt'] }, context: undefined },
				() => Promise.resolve(0),
				{ report: () => { } },
				CancellationToken.None
			);

			// Both files should be successful and in toolResultDetails
			assert.ok(Array.isArray(result.toolResultDetails), 'toolResultDetails should be an array');
			assert.strictEqual((result.toolResultDetails as URI[]).length, 2, 'Should have 2 successful file URIs');

			const uriDetails = result.toolResultDetails as URI[];
			assert.strictEqual(uriDetails[0].toString(), 'file:///image.png', 'Should include image file');
			assert.strictEqual(uriDetails[1].toString(), 'file:///document.txt', 'Should include text file');

			// Check content types
			assert.strictEqual(result.content[0].kind, 'data', 'Image should be data part');
			assert.strictEqual(result.content[1].kind, 'text', 'Text file should be text part');
		});

		test('confirmResults is false when all web contents are errors or redirects', async () => {
			const webContentMap = new ResourceMap<string>();

			const tool = new FetchWebPageTool(
				new class extends TestWebContentExtractorService {
					constructor() {
						super(webContentMap);
					}
					override async extract(uris: URI[]): Promise<WebContentExtractResult[]> {
						return uris.map(() => ({ status: 'error', error: 'Failed to fetch' }));
					}
				}(),
				new ExtendedTestFileService(new ResourceMap<string | VSBuffer>()),
				new MockTrustedDomainService(),
				new MockChatService(),
			);

			const result = await tool.invoke(
				{ callId: 'test-call', toolId: 'fetch-page', parameters: { urls: ['https://example.com'] }, context: undefined },
				() => Promise.resolve(0),
				{ report: () => { } },
				CancellationToken.None
			);

			assert.strictEqual(result.confirmResults, false, 'confirmResults should be false when all results are errors');
		});

		test('confirmResults is false when all web contents are redirects', async () => {
			const webContentMap = new ResourceMap<string>();

			const tool = new FetchWebPageTool(
				new class extends TestWebContentExtractorService {
					constructor() {
						super(webContentMap);
					}
					override async extract(uris: URI[]): Promise<WebContentExtractResult[]> {
						return uris.map(() => ({ status: 'redirect', toURI: URI.parse('https://redirected.com') }));
					}
				}(),
				new ExtendedTestFileService(new ResourceMap<string | VSBuffer>()),
				new MockTrustedDomainService(),
				new MockChatService(),
			);

			const result = await tool.invoke(
				{ callId: 'test-call', toolId: 'fetch-page', parameters: { urls: ['https://example.com'] }, context: undefined },
				() => Promise.resolve(0),
				{ report: () => { } },
				CancellationToken.None
			);

			assert.strictEqual(result.confirmResults, false, 'confirmResults should be false when all results are redirects');
		});

		test('confirmResults is undefined when at least one web content succeeds', async () => {
			const webContentMap = new ResourceMap<string>([
				[URI.parse('https://success.com'), 'Success content']
			]);

			const tool = new FetchWebPageTool(
				new class extends TestWebContentExtractorService {
					constructor() {
						super(webContentMap);
					}
					override async extract(uris: URI[]): Promise<WebContentExtractResult[]> {
						return [
							{ status: 'ok', result: 'Success content' },
							{ status: 'error', error: 'Failed' }
						];
					}
				}(),
				new ExtendedTestFileService(new ResourceMap<string | VSBuffer>()),
				new MockTrustedDomainService(),
				new MockChatService(),
			);

			const result = await tool.invoke(
				{ callId: 'test-call', toolId: 'fetch-page', parameters: { urls: ['https://success.com', 'https://error.com'] }, context: undefined },
				() => Promise.resolve(0),
				{ report: () => { } },
				CancellationToken.None
			);

			assert.strictEqual(result.confirmResults, undefined, 'confirmResults should be undefined when at least one result succeeds');
		});

		test('redirect result provides correct message with new URL', async () => {
			const redirectURI = URI.parse('https://redirected.com/page');
			const tool = new FetchWebPageTool(
				new class extends TestWebContentExtractorService {
					constructor() {
						super(new ResourceMap<string>());
					}
					override async extract(uris: URI[]): Promise<WebContentExtractResult[]> {
						return [{ status: 'redirect', toURI: redirectURI }];
					}
				}(),
				new ExtendedTestFileService(new ResourceMap<string | VSBuffer>()),
				new MockTrustedDomainService(),
				new MockChatService(),
			);

			const result = await tool.invoke(
				{ callId: 'test-call', toolId: 'fetch-page', parameters: { urls: ['https://example.com'] }, context: undefined },
				() => Promise.resolve(0),
				{ report: () => { } },
				CancellationToken.None
			);

			assert.strictEqual(result.content.length, 1);
			assert.strictEqual(result.content[0].kind, 'text');
			if (result.content[0].kind === 'text') {
				assert.ok(result.content[0].value.includes(redirectURI.toString(true)), 'Redirect message should include target URL');
				assert.ok(result.content[0].value.includes(InternalFetchWebPageToolId), 'Redirect message should suggest using tool again');
			}
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/electron-browser/voiceChatActions.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/electron-browser/voiceChatActions.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { parseNextChatResponseChunk } from '../../electron-browser/actions/voiceChatActions.js';

suite('VoiceChatActions', function () {

	function assertChunk(text: string, expected: string | undefined, offset: number): { chunk: string | undefined; offset: number } {
		const res = parseNextChatResponseChunk(text, offset);
		assert.strictEqual(res.chunk, expected);

		return res;
	}

	test('parseNextChatResponseChunk', function () {

		// Simple, no offset
		assertChunk('Hello World', undefined, 0);
		assertChunk('Hello World.', undefined, 0);
		assertChunk('Hello World. ', 'Hello World.', 0);
		assertChunk('Hello World? ', 'Hello World?', 0);
		assertChunk('Hello World! ', 'Hello World!', 0);
		assertChunk('Hello World: ', 'Hello World:', 0);

		// Ensure chunks are parsed from the end, no offset
		assertChunk('Hello World. How is your day? And more...', 'Hello World. How is your day?', 0);

		// Ensure chunks are parsed from the end, with offset
		let offset = assertChunk('Hello World. How is your ', 'Hello World.', 0).offset;
		offset = assertChunk('Hello World. How is your day? And more...', 'How is your day?', offset).offset;
		offset = assertChunk('Hello World. How is your day? And more to come! ', 'And more to come!', offset).offset;
		assertChunk('Hello World. How is your day? And more to come! ', undefined, offset);

		// Sparted by newlines
		offset = assertChunk('Hello World.\nHow is your', 'Hello World.', 0).offset;
		assertChunk('Hello World.\nHow is your day?\n', 'How is your day?', offset);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/codeActions/browser/codeActions.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/codeActions/browser/codeActions.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Extensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { CodeActionsContribution, editorConfiguration, notebookEditorConfiguration } from './codeActionsContribution.js';

Registry.as<IConfigurationRegistry>(Extensions.Configuration)
	.registerConfiguration(editorConfiguration);

Registry.as<IConfigurationRegistry>(Extensions.Configuration)
	.registerConfiguration(notebookEditorConfiguration);

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench)
	.registerWorkbenchContribution(CodeActionsContribution, LifecyclePhase.Eventually);
```

--------------------------------------------------------------------------------

````

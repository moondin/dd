---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 261
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 261 of 552)

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

---[FILE: src/vs/platform/backup/test/electron-main/backupMainService.test.ts]---
Location: vscode-main/src/vs/platform/backup/test/electron-main/backupMainService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { createHash } from 'crypto';
import * as fs from 'fs';
import * as os from 'os';
import { Schemas } from '../../../../base/common/network.js';
import * as path from '../../../../base/common/path.js';
import * as platform from '../../../../base/common/platform.js';
import { isEqual } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { Promises } from '../../../../base/node/pfs.js';
import { flakySuite, getRandomTestPath } from '../../../../base/test/node/testUtils.js';
import { BackupMainService } from '../../electron-main/backupMainService.js';
import { ISerializedBackupWorkspaces, ISerializedWorkspaceBackupInfo } from '../../node/backup.js';
import { TestConfigurationService } from '../../../configuration/test/common/testConfigurationService.js';
import { EnvironmentMainService } from '../../../environment/electron-main/environmentMainService.js';
import { OPTIONS, parseArgs } from '../../../environment/node/argv.js';
import { HotExitConfiguration } from '../../../files/common/files.js';
import { ConsoleMainLogger } from '../../../log/common/log.js';
import product from '../../../product/common/product.js';
import { IFolderBackupInfo, isFolderBackupInfo, IWorkspaceBackupInfo } from '../../common/backup.js';
import { IWorkspaceIdentifier } from '../../../workspace/common/workspace.js';
import { InMemoryTestStateMainService } from '../../../test/electron-main/workbenchTestServices.js';
import { LogService } from '../../../log/common/logService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

flakySuite('BackupMainService', () => {

	function assertEqualFolderInfos(actual: IFolderBackupInfo[], expected: IFolderBackupInfo[]) {
		const withUriAsString = (f: IFolderBackupInfo) => ({ folderUri: f.folderUri.toString(), remoteAuthority: f.remoteAuthority });
		assert.deepStrictEqual(actual.map(withUriAsString), expected.map(withUriAsString));
	}

	function toWorkspace(path: string): IWorkspaceIdentifier {
		return {
			id: createHash('md5').update(sanitizePath(path)).digest('hex'), // CodeQL [SM04514] Using MD5 to convert a file path to a fixed length
			configPath: URI.file(path)
		};
	}

	function toWorkspaceBackupInfo(path: string, remoteAuthority?: string): IWorkspaceBackupInfo {
		return {
			workspace: {
				id: createHash('md5').update(sanitizePath(path)).digest('hex'), // CodeQL [SM04514] Using MD5 to convert a file path to a fixed length
				configPath: URI.file(path)
			},
			remoteAuthority
		};
	}

	function toFolderBackupInfo(uri: URI, remoteAuthority?: string): IFolderBackupInfo {
		return { folderUri: uri, remoteAuthority };
	}

	function toSerializedWorkspace(ws: IWorkspaceIdentifier): ISerializedWorkspaceBackupInfo {
		return {
			id: ws.id,
			configURIPath: ws.configPath.toString()
		};
	}

	function ensureFolderExists(uri: URI): Promise<void> {
		if (!fs.existsSync(uri.fsPath)) {
			fs.mkdirSync(uri.fsPath);
		}

		const backupFolder = service.toBackupPath(uri);
		return createBackupFolder(backupFolder);
	}

	async function ensureWorkspaceExists(workspace: IWorkspaceIdentifier): Promise<IWorkspaceIdentifier> {
		if (!fs.existsSync(workspace.configPath.fsPath)) {
			await Promises.writeFile(workspace.configPath.fsPath, 'Hello');
		}

		const backupFolder = service.toBackupPath(workspace.id);
		await createBackupFolder(backupFolder);

		return workspace;
	}

	async function createBackupFolder(backupFolder: string): Promise<void> {
		if (!fs.existsSync(backupFolder)) {
			fs.mkdirSync(backupFolder);
			fs.mkdirSync(path.join(backupFolder, Schemas.file));
			await Promises.writeFile(path.join(backupFolder, Schemas.file, 'foo.txt'), 'Hello');
		}
	}

	function readWorkspacesMetadata(): ISerializedBackupWorkspaces {
		return stateMainService.getItem('backupWorkspaces') as ISerializedBackupWorkspaces;
	}

	function writeWorkspacesMetadata(data: string): void {
		if (!data) {
			stateMainService.removeItem('backupWorkspaces');
		} else {
			stateMainService.setItem('backupWorkspaces', JSON.parse(data));
		}
	}

	function sanitizePath(p: string): string {
		return platform.isLinux ? p : p.toLowerCase();
	}

	const fooFile = URI.file(platform.isWindows ? 'C:\\foo' : '/foo');
	const barFile = URI.file(platform.isWindows ? 'C:\\bar' : '/bar');

	let service: BackupMainService & {
		toBackupPath(arg: URI | string): string;
		testGetFolderHash(folder: IFolderBackupInfo): string;
		testGetWorkspaceBackups(): IWorkspaceBackupInfo[];
		testGetFolderBackups(): IFolderBackupInfo[];
	};
	let configService: TestConfigurationService;
	let stateMainService: InMemoryTestStateMainService;

	let environmentService: EnvironmentMainService;
	let testDir: string;
	let backupHome: string;
	let existingTestFolder1: URI;

	setup(async () => {
		testDir = getRandomTestPath(os.tmpdir(), 'vsctests', 'backupmainservice');
		backupHome = path.join(testDir, 'Backups');
		existingTestFolder1 = URI.file(path.join(testDir, 'folder1'));

		environmentService = new EnvironmentMainService(parseArgs(process.argv, OPTIONS), { _serviceBrand: undefined, ...product });

		await fs.promises.mkdir(backupHome, { recursive: true });

		configService = new TestConfigurationService();
		stateMainService = new InMemoryTestStateMainService();

		service = new class TestBackupMainService extends BackupMainService {
			constructor() {
				super(environmentService, configService, new LogService(new ConsoleMainLogger()), stateMainService);

				this.backupHome = backupHome;
			}

			toBackupPath(arg: URI | string): string {
				const id = arg instanceof URI ? super.getFolderHash({ folderUri: arg }) : arg;
				return path.join(this.backupHome, id);
			}

			testGetFolderHash(folder: IFolderBackupInfo): string {
				return super.getFolderHash(folder);
			}

			testGetWorkspaceBackups(): IWorkspaceBackupInfo[] {
				return super.getWorkspaceBackups();
			}

			testGetFolderBackups(): IFolderBackupInfo[] {
				return super.getFolderBackups();
			}
		};

		return service.initialize();
	});

	teardown(() => {
		return Promises.rm(testDir);
	});

	test('service validates backup workspaces on startup and cleans up (folder workspaces)', async function () {

		// 1) backup workspace path does not exist
		service.registerFolderBackup(toFolderBackupInfo(fooFile));
		service.registerFolderBackup(toFolderBackupInfo(barFile));
		await service.initialize();
		assertEqualFolderInfos(service.testGetFolderBackups(), []);

		// 2) backup workspace path exists with empty contents within
		fs.mkdirSync(service.toBackupPath(fooFile));
		fs.mkdirSync(service.toBackupPath(barFile));
		service.registerFolderBackup(toFolderBackupInfo(fooFile));
		service.registerFolderBackup(toFolderBackupInfo(barFile));
		await service.initialize();
		assertEqualFolderInfos(service.testGetFolderBackups(), []);
		assert.ok(!fs.existsSync(service.toBackupPath(fooFile)));
		assert.ok(!fs.existsSync(service.toBackupPath(barFile)));

		// 3) backup workspace path exists with empty folders within
		fs.mkdirSync(service.toBackupPath(fooFile));
		fs.mkdirSync(service.toBackupPath(barFile));
		fs.mkdirSync(path.join(service.toBackupPath(fooFile), Schemas.file));
		fs.mkdirSync(path.join(service.toBackupPath(barFile), Schemas.untitled));
		service.registerFolderBackup(toFolderBackupInfo(fooFile));
		service.registerFolderBackup(toFolderBackupInfo(barFile));
		await service.initialize();
		assertEqualFolderInfos(service.testGetFolderBackups(), []);
		assert.ok(!fs.existsSync(service.toBackupPath(fooFile)));
		assert.ok(!fs.existsSync(service.toBackupPath(barFile)));

		// 4) backup workspace path points to a workspace that no longer exists
		// so it should convert the backup worspace to an empty workspace backup
		const fileBackups = path.join(service.toBackupPath(fooFile), Schemas.file);
		fs.mkdirSync(service.toBackupPath(fooFile));
		fs.mkdirSync(service.toBackupPath(barFile));
		fs.mkdirSync(fileBackups);
		service.registerFolderBackup(toFolderBackupInfo(fooFile));
		assert.strictEqual(service.testGetFolderBackups().length, 1);
		assert.strictEqual(service.getEmptyWindowBackups().length, 0);
		fs.writeFileSync(path.join(fileBackups, 'backup.txt'), '');
		await service.initialize();
		assert.strictEqual(service.testGetFolderBackups().length, 0);
		assert.strictEqual(service.getEmptyWindowBackups().length, 1);
	});

	test('service validates backup workspaces on startup and cleans up (root workspaces)', async function () {

		// 1) backup workspace path does not exist
		service.registerWorkspaceBackup(toWorkspaceBackupInfo(fooFile.fsPath));
		service.registerWorkspaceBackup(toWorkspaceBackupInfo(barFile.fsPath));
		await service.initialize();
		assert.deepStrictEqual(service.testGetWorkspaceBackups(), []);

		// 2) backup workspace path exists with empty contents within
		fs.mkdirSync(service.toBackupPath(fooFile));
		fs.mkdirSync(service.toBackupPath(barFile));
		service.registerWorkspaceBackup(toWorkspaceBackupInfo(fooFile.fsPath));
		service.registerWorkspaceBackup(toWorkspaceBackupInfo(barFile.fsPath));
		await service.initialize();
		assert.deepStrictEqual(service.testGetWorkspaceBackups(), []);
		assert.ok(!fs.existsSync(service.toBackupPath(fooFile)));
		assert.ok(!fs.existsSync(service.toBackupPath(barFile)));

		// 3) backup workspace path exists with empty folders within
		fs.mkdirSync(service.toBackupPath(fooFile));
		fs.mkdirSync(service.toBackupPath(barFile));
		fs.mkdirSync(path.join(service.toBackupPath(fooFile), Schemas.file));
		fs.mkdirSync(path.join(service.toBackupPath(barFile), Schemas.untitled));
		service.registerWorkspaceBackup(toWorkspaceBackupInfo(fooFile.fsPath));
		service.registerWorkspaceBackup(toWorkspaceBackupInfo(barFile.fsPath));
		await service.initialize();
		assert.deepStrictEqual(service.testGetWorkspaceBackups(), []);
		assert.ok(!fs.existsSync(service.toBackupPath(fooFile)));
		assert.ok(!fs.existsSync(service.toBackupPath(barFile)));

		// 4) backup workspace path points to a workspace that no longer exists
		// so it should convert the backup worspace to an empty workspace backup
		const fileBackups = path.join(service.toBackupPath(fooFile), Schemas.file);
		fs.mkdirSync(service.toBackupPath(fooFile));
		fs.mkdirSync(service.toBackupPath(barFile));
		fs.mkdirSync(fileBackups);
		service.registerWorkspaceBackup(toWorkspaceBackupInfo(fooFile.fsPath));
		assert.strictEqual(service.testGetWorkspaceBackups().length, 1);
		assert.strictEqual(service.getEmptyWindowBackups().length, 0);
		fs.writeFileSync(path.join(fileBackups, 'backup.txt'), '');
		await service.initialize();
		assert.strictEqual(service.testGetWorkspaceBackups().length, 0);
		assert.strictEqual(service.getEmptyWindowBackups().length, 1);
	});

	test('service supports to migrate backup data from another location', async () => {
		const backupPathToMigrate = service.toBackupPath(fooFile);
		fs.mkdirSync(backupPathToMigrate);
		fs.writeFileSync(path.join(backupPathToMigrate, 'backup.txt'), 'Some Data');
		service.registerFolderBackup(toFolderBackupInfo(URI.file(backupPathToMigrate)));

		const workspaceBackupPath = await service.registerWorkspaceBackup(toWorkspaceBackupInfo(barFile.fsPath), backupPathToMigrate);

		assert.ok(fs.existsSync(workspaceBackupPath));
		assert.ok(fs.existsSync(path.join(workspaceBackupPath, 'backup.txt')));
		assert.ok(!fs.existsSync(backupPathToMigrate));

		const emptyBackups = service.getEmptyWindowBackups();
		assert.strictEqual(0, emptyBackups.length);
	});

	test('service backup migration makes sure to preserve existing backups', async () => {
		const backupPathToMigrate = service.toBackupPath(fooFile);
		fs.mkdirSync(backupPathToMigrate);
		fs.writeFileSync(path.join(backupPathToMigrate, 'backup.txt'), 'Some Data');
		service.registerFolderBackup(toFolderBackupInfo(URI.file(backupPathToMigrate)));

		const backupPathToPreserve = service.toBackupPath(barFile);
		fs.mkdirSync(backupPathToPreserve);
		fs.writeFileSync(path.join(backupPathToPreserve, 'backup.txt'), 'Some Data');
		service.registerFolderBackup(toFolderBackupInfo(URI.file(backupPathToPreserve)));

		const workspaceBackupPath = await service.registerWorkspaceBackup(toWorkspaceBackupInfo(barFile.fsPath), backupPathToMigrate);

		assert.ok(fs.existsSync(workspaceBackupPath));
		assert.ok(fs.existsSync(path.join(workspaceBackupPath, 'backup.txt')));
		assert.ok(!fs.existsSync(backupPathToMigrate));

		const emptyBackups = service.getEmptyWindowBackups();
		assert.strictEqual(1, emptyBackups.length);
		assert.strictEqual(1, fs.readdirSync(path.join(backupHome, emptyBackups[0].backupFolder)).length);
	});

	suite('loadSync', () => {
		test('getFolderBackupPaths() should return [] when workspaces.json doesn\'t exist', () => {
			assertEqualFolderInfos(service.testGetFolderBackups(), []);
		});

		test('getFolderBackupPaths() should return [] when folders in workspaces.json is absent', async () => {
			writeWorkspacesMetadata('{}');
			await service.initialize();
			assertEqualFolderInfos(service.testGetFolderBackups(), []);
		});

		test('getFolderBackupPaths() should return [] when folders in workspaces.json is not a string array', async () => {
			writeWorkspacesMetadata('{"folders":{}}');
			await service.initialize();
			assertEqualFolderInfos(service.testGetFolderBackups(), []);
			writeWorkspacesMetadata('{"folders":{"foo": ["bar"]}}');
			await service.initialize();
			assertEqualFolderInfos(service.testGetFolderBackups(), []);
			writeWorkspacesMetadata('{"folders":{"foo": []}}');
			await service.initialize();
			assertEqualFolderInfos(service.testGetFolderBackups(), []);
			writeWorkspacesMetadata('{"folders":{"foo": "bar"}}');
			await service.initialize();
			assertEqualFolderInfos(service.testGetFolderBackups(), []);
			writeWorkspacesMetadata('{"folders":"foo"}');
			await service.initialize();
			assertEqualFolderInfos(service.testGetFolderBackups(), []);
			writeWorkspacesMetadata('{"folders":1}');
			await service.initialize();
			assertEqualFolderInfos(service.testGetFolderBackups(), []);
		});

		test('getFolderBackupPaths() should return [] when files.hotExit = "onExitAndWindowClose"', async () => {
			const fi = toFolderBackupInfo(URI.file(fooFile.fsPath.toUpperCase()));
			service.registerFolderBackup(fi);
			assertEqualFolderInfos(service.testGetFolderBackups(), [fi]);
			configService.setUserConfiguration('files.hotExit', HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE);
			await service.initialize();
			assertEqualFolderInfos(service.testGetFolderBackups(), []);
		});

		test('getWorkspaceBackups() should return [] when workspaces.json doesn\'t exist', () => {
			assert.deepStrictEqual(service.testGetWorkspaceBackups(), []);
		});

		test('getWorkspaceBackups() should return [] when folderWorkspaces in workspaces.json is absent', async () => {
			writeWorkspacesMetadata('{}');
			await service.initialize();
			assert.deepStrictEqual(service.testGetWorkspaceBackups(), []);
		});

		test('getWorkspaceBackups() should return [] when rootWorkspaces in workspaces.json is not a object array', async () => {
			writeWorkspacesMetadata('{"rootWorkspaces":{}}');
			await service.initialize();
			assert.deepStrictEqual(service.testGetWorkspaceBackups(), []);
			writeWorkspacesMetadata('{"rootWorkspaces":{"foo": ["bar"]}}');
			await service.initialize();
			assert.deepStrictEqual(service.testGetWorkspaceBackups(), []);
			writeWorkspacesMetadata('{"rootWorkspaces":{"foo": []}}');
			await service.initialize();
			assert.deepStrictEqual(service.testGetWorkspaceBackups(), []);
			writeWorkspacesMetadata('{"rootWorkspaces":{"foo": "bar"}}');
			await service.initialize();
			assert.deepStrictEqual(service.testGetWorkspaceBackups(), []);
			writeWorkspacesMetadata('{"rootWorkspaces":"foo"}');
			await service.initialize();
			assert.deepStrictEqual(service.testGetWorkspaceBackups(), []);
			writeWorkspacesMetadata('{"rootWorkspaces":1}');
			await service.initialize();
			assert.deepStrictEqual(service.testGetWorkspaceBackups(), []);
		});

		test('getWorkspaceBackups() should return [] when workspaces in workspaces.json is not a object array', async () => {
			writeWorkspacesMetadata('{"workspaces":{}}');
			await service.initialize();
			assert.deepStrictEqual(service.testGetWorkspaceBackups(), []);
			writeWorkspacesMetadata('{"workspaces":{"foo": ["bar"]}}');
			await service.initialize();
			assert.deepStrictEqual(service.testGetWorkspaceBackups(), []);
			writeWorkspacesMetadata('{"workspaces":{"foo": []}}');
			await service.initialize();
			assert.deepStrictEqual(service.testGetWorkspaceBackups(), []);
			writeWorkspacesMetadata('{"workspaces":{"foo": "bar"}}');
			await service.initialize();
			assert.deepStrictEqual(service.testGetWorkspaceBackups(), []);
			writeWorkspacesMetadata('{"workspaces":"foo"}');
			await service.initialize();
			assert.deepStrictEqual(service.testGetWorkspaceBackups(), []);
			writeWorkspacesMetadata('{"workspaces":1}');
			await service.initialize();
			assert.deepStrictEqual(service.testGetWorkspaceBackups(), []);
		});

		test('getWorkspaceBackups() should return [] when files.hotExit = "onExitAndWindowClose"', async () => {
			const upperFooPath = fooFile.fsPath.toUpperCase();
			service.registerWorkspaceBackup(toWorkspaceBackupInfo(upperFooPath));
			assert.strictEqual(service.testGetWorkspaceBackups().length, 1);
			assert.deepStrictEqual(service.testGetWorkspaceBackups().map(r => r.workspace.configPath.toString()), [URI.file(upperFooPath).toString()]);
			configService.setUserConfiguration('files.hotExit', HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE);
			await service.initialize();
			assert.deepStrictEqual(service.testGetWorkspaceBackups(), []);
		});

		test('getEmptyWorkspaceBackupPaths() should return [] when workspaces.json doesn\'t exist', () => {
			assert.deepStrictEqual(service.getEmptyWindowBackups(), []);
		});

		test('getEmptyWorkspaceBackupPaths() should return [] when folderWorkspaces in workspaces.json is absent', async () => {
			writeWorkspacesMetadata('{}');
			await service.initialize();
			assert.deepStrictEqual(service.getEmptyWindowBackups(), []);
		});

		test('getEmptyWorkspaceBackupPaths() should return [] when folderWorkspaces in workspaces.json is not a string array', async function () {
			writeWorkspacesMetadata('{"emptyWorkspaces":{}}');
			await service.initialize();
			assert.deepStrictEqual(service.getEmptyWindowBackups(), []);
			writeWorkspacesMetadata('{"emptyWorkspaces":{"foo": ["bar"]}}');
			await service.initialize();
			assert.deepStrictEqual(service.getEmptyWindowBackups(), []);
			writeWorkspacesMetadata('{"emptyWorkspaces":{"foo": []}}');
			await service.initialize();
			assert.deepStrictEqual(service.getEmptyWindowBackups(), []);
			writeWorkspacesMetadata('{"emptyWorkspaces":{"foo": "bar"}}');
			await service.initialize();
			assert.deepStrictEqual(service.getEmptyWindowBackups(), []);
			writeWorkspacesMetadata('{"emptyWorkspaces":"foo"}');
			await service.initialize();
			assert.deepStrictEqual(service.getEmptyWindowBackups(), []);
			writeWorkspacesMetadata('{"emptyWorkspaces":1}');
			await service.initialize();
			assert.deepStrictEqual(service.getEmptyWindowBackups(), []);
		});
	});

	suite('dedupeFolderWorkspaces', () => {
		test('should ignore duplicates (folder workspace)', async () => {

			await ensureFolderExists(existingTestFolder1);

			const workspacesJson: ISerializedBackupWorkspaces = {
				workspaces: [],
				folders: [{ folderUri: existingTestFolder1.toString() }, { folderUri: existingTestFolder1.toString() }],
				emptyWindows: []
			};
			writeWorkspacesMetadata(JSON.stringify(workspacesJson));
			await service.initialize();

			const json = readWorkspacesMetadata();
			assert.deepStrictEqual(json.folders, [{ folderUri: existingTestFolder1.toString() }]);
		});

		test('should ignore duplicates on Windows and Mac (folder workspace)', async () => {

			await ensureFolderExists(existingTestFolder1);

			const workspacesJson: ISerializedBackupWorkspaces = {
				workspaces: [],
				folders: [{ folderUri: existingTestFolder1.toString() }, { folderUri: existingTestFolder1.toString().toLowerCase() }],
				emptyWindows: []
			};
			writeWorkspacesMetadata(JSON.stringify(workspacesJson));
			await service.initialize();
			const json = readWorkspacesMetadata();
			assert.deepStrictEqual(json.folders, [{ folderUri: existingTestFolder1.toString() }]);
		});

		test('should ignore duplicates on Windows and Mac (root workspace)', async () => {
			const workspacePath = path.join(testDir, 'Foo.code-workspace');
			const workspacePath1 = path.join(testDir, 'FOO.code-workspace');
			const workspacePath2 = path.join(testDir, 'foo.code-workspace');

			const workspace1 = await ensureWorkspaceExists(toWorkspace(workspacePath));
			const workspace2 = await ensureWorkspaceExists(toWorkspace(workspacePath1));
			const workspace3 = await ensureWorkspaceExists(toWorkspace(workspacePath2));

			const workspacesJson: ISerializedBackupWorkspaces = {
				workspaces: [workspace1, workspace2, workspace3].map(toSerializedWorkspace),
				folders: [],
				emptyWindows: []
			};
			writeWorkspacesMetadata(JSON.stringify(workspacesJson));
			await service.initialize();

			const json = readWorkspacesMetadata();
			assert.strictEqual(json.workspaces.length, platform.isLinux ? 3 : 1);
			if (platform.isLinux) {
				assert.deepStrictEqual(json.workspaces.map(r => r.configURIPath), [URI.file(workspacePath).toString(), URI.file(workspacePath1).toString(), URI.file(workspacePath2).toString()]);
			} else {
				assert.deepStrictEqual(json.workspaces.map(r => r.configURIPath), [URI.file(workspacePath).toString()], 'should return the first duplicated entry');
			}
		});
	});

	suite('registerWindowForBackups', () => {
		test('should persist paths to workspaces.json (folder workspace)', async () => {
			service.registerFolderBackup(toFolderBackupInfo(fooFile));
			service.registerFolderBackup(toFolderBackupInfo(barFile));
			assertEqualFolderInfos(service.testGetFolderBackups(), [toFolderBackupInfo(fooFile), toFolderBackupInfo(barFile)]);

			const json = readWorkspacesMetadata();
			assert.deepStrictEqual(json.folders, [{ folderUri: fooFile.toString() }, { folderUri: barFile.toString() }]);
		});

		test('should persist paths to workspaces.json (root workspace)', async () => {
			const ws1 = toWorkspaceBackupInfo(fooFile.fsPath);
			service.registerWorkspaceBackup(ws1);
			const ws2 = toWorkspaceBackupInfo(barFile.fsPath);
			service.registerWorkspaceBackup(ws2);

			assert.deepStrictEqual(service.testGetWorkspaceBackups().map(b => b.workspace.configPath.toString()), [fooFile.toString(), barFile.toString()]);
			assert.strictEqual(ws1.workspace.id, service.testGetWorkspaceBackups()[0].workspace.id);
			assert.strictEqual(ws2.workspace.id, service.testGetWorkspaceBackups()[1].workspace.id);

			const json = readWorkspacesMetadata();
			assert.deepStrictEqual(json.workspaces.map(b => b.configURIPath), [fooFile.toString(), barFile.toString()]);
			assert.strictEqual(ws1.workspace.id, json.workspaces[0].id);
			assert.strictEqual(ws2.workspace.id, json.workspaces[1].id);
		});
	});

	test('should always store the workspace path in workspaces.json using the case given, regardless of whether the file system is case-sensitive (folder workspace)', async () => {
		service.registerFolderBackup(toFolderBackupInfo(URI.file(fooFile.fsPath.toUpperCase())));
		assertEqualFolderInfos(service.testGetFolderBackups(), [toFolderBackupInfo(URI.file(fooFile.fsPath.toUpperCase()))]);

		const json = readWorkspacesMetadata();
		assert.deepStrictEqual(json.folders, [{ folderUri: URI.file(fooFile.fsPath.toUpperCase()).toString() }]);
	});

	test('should always store the workspace path in workspaces.json using the case given, regardless of whether the file system is case-sensitive (root workspace)', async () => {
		const upperFooPath = fooFile.fsPath.toUpperCase();
		service.registerWorkspaceBackup(toWorkspaceBackupInfo(upperFooPath));
		assert.deepStrictEqual(service.testGetWorkspaceBackups().map(b => b.workspace.configPath.toString()), [URI.file(upperFooPath).toString()]);

		const json = readWorkspacesMetadata();
		assert.deepStrictEqual(json.workspaces.map(b => b.configURIPath), [URI.file(upperFooPath).toString()]);
	});

	suite('getWorkspaceHash', () => {
		(platform.isLinux ? test.skip : test)('should ignore case on Windows and Mac', () => {
			const assertFolderHash = (uri1: URI, uri2: URI) => {
				assert.strictEqual(service.testGetFolderHash(toFolderBackupInfo(uri1)), service.testGetFolderHash(toFolderBackupInfo(uri2)));
			};

			if (platform.isMacintosh) {
				assertFolderHash(URI.file('/foo'), URI.file('/FOO'));
			}

			if (platform.isWindows) {
				assertFolderHash(URI.file('c:\\foo'), URI.file('C:\\FOO'));
			}
		});
	});

	suite('mixed path casing', () => {
		test('should handle case insensitive paths properly (registerWindowForBackupsSync) (folder workspace)', () => {
			service.registerFolderBackup(toFolderBackupInfo(fooFile));
			service.registerFolderBackup(toFolderBackupInfo(URI.file(fooFile.fsPath.toUpperCase())));

			if (platform.isLinux) {
				assert.strictEqual(service.testGetFolderBackups().length, 2);
			} else {
				assert.strictEqual(service.testGetFolderBackups().length, 1);
			}
		});

		test('should handle case insensitive paths properly (registerWindowForBackupsSync) (root workspace)', () => {
			service.registerWorkspaceBackup(toWorkspaceBackupInfo(fooFile.fsPath));
			service.registerWorkspaceBackup(toWorkspaceBackupInfo(fooFile.fsPath.toUpperCase()));

			if (platform.isLinux) {
				assert.strictEqual(service.testGetWorkspaceBackups().length, 2);
			} else {
				assert.strictEqual(service.testGetWorkspaceBackups().length, 1);
			}
		});
	});

	suite('getDirtyWorkspaces', () => {
		test('should report if a workspace or folder has backups', async () => {
			const folderBackupPath = service.registerFolderBackup(toFolderBackupInfo(fooFile));

			const backupWorkspaceInfo = toWorkspaceBackupInfo(fooFile.fsPath);
			const workspaceBackupPath = service.registerWorkspaceBackup(backupWorkspaceInfo);

			assert.strictEqual(((await service.getDirtyWorkspaces()).length), 0);

			try {
				await fs.promises.mkdir(path.join(folderBackupPath, Schemas.file), { recursive: true });
				await fs.promises.mkdir(path.join(workspaceBackupPath, Schemas.untitled), { recursive: true });
			} catch {
				// ignore - folder might exist already
			}

			assert.strictEqual(((await service.getDirtyWorkspaces()).length), 0);

			fs.writeFileSync(path.join(folderBackupPath, Schemas.file, '594a4a9d82a277a899d4713a5b08f504'), '');
			fs.writeFileSync(path.join(workspaceBackupPath, Schemas.untitled, '594a4a9d82a277a899d4713a5b08f504'), '');

			const dirtyWorkspaces = await service.getDirtyWorkspaces();
			assert.strictEqual(dirtyWorkspaces.length, 2);

			let found = 0;
			for (const dirtyWorkpspace of dirtyWorkspaces) {
				if (isFolderBackupInfo(dirtyWorkpspace)) {
					if (isEqual(fooFile, dirtyWorkpspace.folderUri)) {
						found++;
					}
				} else {
					if (isEqual(backupWorkspaceInfo.workspace.configPath, dirtyWorkpspace.workspace.configPath)) {
						found++;
					}
				}
			}

			assert.strictEqual(found, 2);
		});
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/browserElements/common/browserElements.ts]---
Location: vscode-main/src/vs/platform/browserElements/common/browserElements.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IRectangle } from '../../window/common/window.js';

export const INativeBrowserElementsService = createDecorator<INativeBrowserElementsService>('nativeBrowserElementsService');

export interface IElementData {
	readonly outerHTML: string;
	readonly computedStyle: string;
	readonly bounds: IRectangle;
}

export enum BrowserType {
	SimpleBrowser = 'simpleBrowser',
	LiveServer = 'liveServer',
}


export interface INativeBrowserElementsService {

	readonly _serviceBrand: undefined;

	// Properties
	readonly windowId: number;

	getElementData(rect: IRectangle, token: CancellationToken, browserType: BrowserType, cancellationId?: number): Promise<IElementData | undefined>;

	startDebugSession(token: CancellationToken, browserType: BrowserType, cancelAndDetachId?: number): Promise<void>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/browserElements/common/nativeBrowserElementsService.ts]---
Location: vscode-main/src/vs/platform/browserElements/common/nativeBrowserElementsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ProxyChannel } from '../../../base/parts/ipc/common/ipc.js';
import { IMainProcessService } from '../../ipc/common/mainProcessService.js';
import { INativeBrowserElementsService } from './browserElements.js';

// @ts-ignore: interface is implemented via proxy
export class NativeBrowserElementsService implements INativeBrowserElementsService {

	declare readonly _serviceBrand: undefined;

	constructor(
		readonly windowId: number,
		@IMainProcessService mainProcessService: IMainProcessService
	) {
		return ProxyChannel.toService<INativeBrowserElementsService>(mainProcessService.getChannel('browserElements'), {
			context: windowId,
			properties: (() => {
				const properties = new Map<string, unknown>();
				properties.set('windowId', windowId);

				return properties;
			})()
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/browserElements/electron-main/nativeBrowserElementsMainService.ts]---
Location: vscode-main/src/vs/platform/browserElements/electron-main/nativeBrowserElementsMainService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BrowserType, IElementData, INativeBrowserElementsService } from '../common/browserElements.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { IRectangle } from '../../window/common/window.js';
import { BrowserWindow, webContents } from 'electron';
import { IAuxiliaryWindow } from '../../auxiliaryWindow/electron-main/auxiliaryWindow.js';
import { ICodeWindow } from '../../window/electron-main/window.js';
import { IAuxiliaryWindowsMainService } from '../../auxiliaryWindow/electron-main/auxiliaryWindows.js';
import { IWindowsMainService } from '../../windows/electron-main/windows.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { AddFirstParameterToFunctions } from '../../../base/common/types.js';

export const INativeBrowserElementsMainService = createDecorator<INativeBrowserElementsMainService>('browserElementsMainService');
export interface INativeBrowserElementsMainService extends AddFirstParameterToFunctions<INativeBrowserElementsService, Promise<unknown> /* only methods, not events */, number | undefined /* window ID */> { }

interface NodeDataResponse {
	outerHTML: string;
	computedStyle: string;
	bounds: IRectangle;
}

export class NativeBrowserElementsMainService extends Disposable implements INativeBrowserElementsMainService {
	_serviceBrand: undefined;

	currentLocalAddress: string | undefined;

	constructor(
		@IWindowsMainService private readonly windowsMainService: IWindowsMainService,
		@IAuxiliaryWindowsMainService private readonly auxiliaryWindowsMainService: IAuxiliaryWindowsMainService,

	) {
		super();
	}

	get windowId(): never { throw new Error('Not implemented in electron-main'); }

	async findWebviewTarget(debuggers: Electron.Debugger, windowId: number, browserType: BrowserType): Promise<string | undefined> {
		const { targetInfos } = await debuggers.sendCommand('Target.getTargets');
		let target: typeof targetInfos[number] | undefined = undefined;
		const matchingTarget = targetInfos.find((targetInfo: { url: string }) => {
			try {
				const url = new URL(targetInfo.url);
				if (browserType === BrowserType.LiveServer) {
					return url.searchParams.get('id') && url.searchParams.get('extensionId') === 'ms-vscode.live-server';
				} else if (browserType === BrowserType.SimpleBrowser) {
					return url.searchParams.get('parentId') === windowId.toString() && url.searchParams.get('extensionId') === 'vscode.simple-browser';
				}
				return false;
			} catch (err) {
				return false;
			}
		});

		// search for webview via search parameters
		if (matchingTarget) {
			let resultId: string | undefined;
			let url: URL | undefined;
			try {
				url = new URL(matchingTarget.url);
				resultId = url.searchParams.get('id')!;
			} catch (e) {
				return undefined;
			}

			target = targetInfos.find((targetInfo: { url: string }) => {
				try {
					const url = new URL(targetInfo.url);
					const isLiveServer = browserType === BrowserType.LiveServer && url.searchParams.get('serverWindowId') === resultId;
					const isSimpleBrowser = browserType === BrowserType.SimpleBrowser && url.searchParams.get('id') === resultId && url.searchParams.has('vscodeBrowserReqId');
					if (isLiveServer || isSimpleBrowser) {
						this.currentLocalAddress = url.origin;
						return true;
					}
					return false;
				} catch (e) {
					return false;
				}
			});

			if (target) {
				return target.targetId;
			}
		}

		// fallback: search for webview without parameters based on current origin
		target = targetInfos.find((targetInfo: { url: string }) => {
			try {
				const url = new URL(targetInfo.url);
				return (this.currentLocalAddress === url.origin);
			} catch (e) {
				return false;
			}
		});

		if (!target) {
			return undefined;
		}

		return target.targetId;
	}

	async waitForWebviewTargets(debuggers: Electron.Debugger, windowId: number, browserType: BrowserType): Promise<string | undefined> {
		const start = Date.now();
		const timeout = 10000;

		while (Date.now() - start < timeout) {
			const targetId = await this.findWebviewTarget(debuggers, windowId, browserType);
			if (targetId) {
				return targetId;
			}

			// Wait for a short period before checking again
			await new Promise(resolve => setTimeout(resolve, 500));
		}

		debuggers.detach();
		return undefined;
	}

	async startDebugSession(windowId: number | undefined, token: CancellationToken, browserType: BrowserType, cancelAndDetachId?: number): Promise<void> {
		const window = this.windowById(windowId);
		if (!window?.win) {
			return undefined;
		}

		// Find the simple browser webview
		const allWebContents = webContents.getAllWebContents();
		const simpleBrowserWebview = allWebContents.find(webContent => webContent.id === window.id);

		if (!simpleBrowserWebview) {
			return undefined;
		}

		const debuggers = simpleBrowserWebview.debugger;
		if (!debuggers.isAttached()) {
			debuggers.attach();
		}

		try {
			const matchingTargetId = await this.waitForWebviewTargets(debuggers, windowId!, browserType);
			if (!matchingTargetId) {
				if (debuggers.isAttached()) {
					debuggers.detach();
				}
				throw new Error('No target found');
			}

		} catch (e) {
			if (debuggers.isAttached()) {
				debuggers.detach();
			}
			throw new Error('No target found');
		}

		window.win.webContents.on('ipc-message', async (event, channel, closedCancelAndDetachId) => {
			if (channel === `vscode:cancelCurrentSession${cancelAndDetachId}`) {
				if (cancelAndDetachId !== closedCancelAndDetachId) {
					return;
				}
				if (debuggers.isAttached()) {
					debuggers.detach();
				}
				if (window.win) {
					window.win.webContents.removeAllListeners('ipc-message');
				}
			}
		});
	}

	async finishOverlay(debuggers: Electron.Debugger, sessionId: string | undefined): Promise<void> {
		if (debuggers.isAttached() && sessionId) {
			await debuggers.sendCommand('Overlay.setInspectMode', {
				mode: 'none',
				highlightConfig: {
					showInfo: false,
					showStyles: false
				}
			}, sessionId);
			await debuggers.sendCommand('Overlay.hideHighlight', {}, sessionId);
			await debuggers.sendCommand('Overlay.disable', {}, sessionId);
			debuggers.detach();
		}
	}

	async getElementData(windowId: number | undefined, rect: IRectangle, token: CancellationToken, browserType: BrowserType, cancellationId?: number): Promise<IElementData | undefined> {
		const window = this.windowById(windowId);
		if (!window?.win) {
			return undefined;
		}

		// Find the simple browser webview
		const allWebContents = webContents.getAllWebContents();
		const simpleBrowserWebview = allWebContents.find(webContent => webContent.id === window.id);

		if (!simpleBrowserWebview) {
			return undefined;
		}

		const debuggers = simpleBrowserWebview.debugger;
		if (!debuggers.isAttached()) {
			debuggers.attach();
		}

		let targetSessionId: string | undefined = undefined;
		try {
			const targetId = await this.findWebviewTarget(debuggers, windowId!, browserType);
			const { sessionId } = await debuggers.sendCommand('Target.attachToTarget', {
				targetId: targetId,
				flatten: true,
			});

			targetSessionId = sessionId;

			await debuggers.sendCommand('DOM.enable', {}, sessionId);
			await debuggers.sendCommand('CSS.enable', {}, sessionId);
			await debuggers.sendCommand('Overlay.enable', {}, sessionId);
			await debuggers.sendCommand('Debugger.enable', {}, sessionId);
			await debuggers.sendCommand('Runtime.enable', {}, sessionId);

			await debuggers.sendCommand('Runtime.evaluate', {
				expression: `(function() {
							const style = document.createElement('style');
							style.id = '__pseudoBlocker__';
							style.textContent = '*::before, *::after { pointer-events: none !important; }';
							document.head.appendChild(style);
						})();`,
			}, sessionId);

			// slightly changed default CDP debugger inspect colors
			await debuggers.sendCommand('Overlay.setInspectMode', {
				mode: 'searchForNode',
				highlightConfig: {
					showInfo: true,
					showRulers: false,
					showStyles: true,
					showAccessibilityInfo: true,
					showExtensionLines: false,
					contrastAlgorithm: 'aa',
					contentColor: { r: 173, g: 216, b: 255, a: 0.8 },
					paddingColor: { r: 150, g: 200, b: 255, a: 0.5 },
					borderColor: { r: 120, g: 180, b: 255, a: 0.7 },
					marginColor: { r: 200, g: 220, b: 255, a: 0.4 },
					eventTargetColor: { r: 130, g: 160, b: 255, a: 0.8 },
					shapeColor: { r: 130, g: 160, b: 255, a: 0.8 },
					shapeMarginColor: { r: 130, g: 160, b: 255, a: 0.5 },
					gridHighlightConfig: {
						rowGapColor: { r: 140, g: 190, b: 255, a: 0.3 },
						rowHatchColor: { r: 140, g: 190, b: 255, a: 0.7 },
						columnGapColor: { r: 140, g: 190, b: 255, a: 0.3 },
						columnHatchColor: { r: 140, g: 190, b: 255, a: 0.7 },
						rowLineColor: { r: 120, g: 180, b: 255 },
						columnLineColor: { r: 120, g: 180, b: 255 },
						rowLineDash: true,
						columnLineDash: true
					},
					flexContainerHighlightConfig: {
						containerBorder: {
							color: { r: 120, g: 180, b: 255 },
							pattern: 'solid'
						},
						itemSeparator: {
							color: { r: 140, g: 190, b: 255 },
							pattern: 'solid'
						},
						lineSeparator: {
							color: { r: 140, g: 190, b: 255 },
							pattern: 'solid'
						},
						mainDistributedSpace: {
							hatchColor: { r: 140, g: 190, b: 255, a: 0.7 },
							fillColor: { r: 140, g: 190, b: 255, a: 0.4 }
						},
						crossDistributedSpace: {
							hatchColor: { r: 140, g: 190, b: 255, a: 0.7 },
							fillColor: { r: 140, g: 190, b: 255, a: 0.4 }
						},
						rowGapSpace: {
							hatchColor: { r: 140, g: 190, b: 255, a: 0.7 },
							fillColor: { r: 140, g: 190, b: 255, a: 0.4 }
						},
						columnGapSpace: {
							hatchColor: { r: 140, g: 190, b: 255, a: 0.7 },
							fillColor: { r: 140, g: 190, b: 255, a: 0.4 }
						}
					},
					flexItemHighlightConfig: {
						baseSizeBox: {
							hatchColor: { r: 130, g: 170, b: 255, a: 0.6 }
						},
						baseSizeBorder: {
							color: { r: 120, g: 180, b: 255 },
							pattern: 'solid'
						},
						flexibilityArrow: {
							color: { r: 130, g: 190, b: 255 }
						}
					},
				},
			}, sessionId);
		} catch (e) {
			debuggers.detach();
			throw new Error('No target found', e);
		}

		if (!targetSessionId) {
			debuggers.detach();
			throw new Error('No target session id found');
		}

		const nodeData = await this.getNodeData(targetSessionId, debuggers, window.win, cancellationId);
		await this.finishOverlay(debuggers, targetSessionId);

		const zoomFactor = simpleBrowserWebview.getZoomFactor();
		const absoluteBounds = {
			x: rect.x + nodeData.bounds.x,
			y: rect.y + nodeData.bounds.y,
			width: nodeData.bounds.width,
			height: nodeData.bounds.height
		};

		const clippedBounds = {
			x: Math.max(absoluteBounds.x, rect.x),
			y: Math.max(absoluteBounds.y, rect.y),
			width: Math.max(0, Math.min(absoluteBounds.x + absoluteBounds.width, rect.x + rect.width) - Math.max(absoluteBounds.x, rect.x)),
			height: Math.max(0, Math.min(absoluteBounds.y + absoluteBounds.height, rect.y + rect.height) - Math.max(absoluteBounds.y, rect.y))
		};

		const scaledBounds = {
			x: clippedBounds.x * zoomFactor,
			y: clippedBounds.y * zoomFactor,
			width: clippedBounds.width * zoomFactor,
			height: clippedBounds.height * zoomFactor
		};

		return { outerHTML: nodeData.outerHTML, computedStyle: nodeData.computedStyle, bounds: scaledBounds };
	}

	async getNodeData(sessionId: string, debuggers: Electron.Debugger, window: BrowserWindow, cancellationId?: number): Promise<NodeDataResponse> {
		return new Promise((resolve, reject) => {
			const onMessage = async (event: Electron.Event, method: string, params: { backendNodeId: number }) => {
				if (method === 'Overlay.inspectNodeRequested') {
					debuggers.off('message', onMessage);
					await debuggers.sendCommand('Runtime.evaluate', {
						expression: `(() => {
										const style = document.getElementById('__pseudoBlocker__');
										if (style) style.remove();
									})();`,
					}, sessionId);

					const backendNodeId = params?.backendNodeId;
					if (!backendNodeId) {
						throw new Error('Missing backendNodeId in inspectNodeRequested event');
					}

					try {
						await debuggers.sendCommand('DOM.getDocument', {}, sessionId);
						const { nodeIds } = await debuggers.sendCommand('DOM.pushNodesByBackendIdsToFrontend', { backendNodeIds: [backendNodeId] }, sessionId);
						if (!nodeIds || nodeIds.length === 0) {
							throw new Error('Failed to get node IDs.');
						}
						const nodeId = nodeIds[0];

						const { model } = await debuggers.sendCommand('DOM.getBoxModel', { nodeId }, sessionId);
						if (!model) {
							throw new Error('Failed to get box model.');
						}

						const content = model.content;
						const margin = model.margin;
						const x = Math.min(margin[0], content[0]);
						const y = Math.min(margin[1], content[1]) + 32.4; // 32.4 is height of the title bar
						const width = Math.max(margin[2] - margin[0], content[2] - content[0]);
						const height = Math.max(margin[5] - margin[1], content[5] - content[1]);

						const matched = await debuggers.sendCommand('CSS.getMatchedStylesForNode', { nodeId }, sessionId);
						if (!matched) {
							throw new Error('Failed to get matched css.');
						}

						const formatted = this.formatMatchedStyles(matched);
						const { outerHTML } = await debuggers.sendCommand('DOM.getOuterHTML', { nodeId }, sessionId);
						if (!outerHTML) {
							throw new Error('Failed to get outerHTML.');
						}

						resolve({
							outerHTML,
							computedStyle: formatted,
							bounds: { x, y, width, height }
						});
					} catch (err) {
						debuggers.off('message', onMessage);
						debuggers.detach();
						reject(err);
					}
				}
			};

			window.webContents.on('ipc-message', async (event, channel, closedCancellationId) => {
				if (channel === `vscode:cancelElementSelection${cancellationId}`) {
					if (cancellationId !== closedCancellationId) {
						return;
					}
					debuggers.off('message', onMessage);
					await this.finishOverlay(debuggers, sessionId);
					window.webContents.removeAllListeners('ipc-message');
				}
			});

			debuggers.on('message', onMessage);
		});
	}

	formatMatchedStyles(matched: { inlineStyle?: { cssProperties?: Array<{ name: string; value: string }> }; matchedCSSRules?: Array<{ rule: { selectorList: { selectors: Array<{ text: string }> }; origin: string; style: { cssProperties: Array<{ name: string; value: string }> } } }>; inherited?: Array<{ matchedCSSRules?: Array<{ rule: { selectorList: { selectors: Array<{ text: string }> }; origin: string; style: { cssProperties: Array<{ name: string; value: string }> } } }> }> }): string {
		const lines: string[] = [];

		// inline
		if (matched.inlineStyle?.cssProperties?.length) {
			lines.push('/* Inline style */');
			lines.push('element {');
			for (const prop of matched.inlineStyle.cssProperties) {
				if (prop.name && prop.value) {
					lines.push(`  ${prop.name}: ${prop.value};`);
				}
			}
			lines.push('}\n');
		}

		// matched
		if (matched.matchedCSSRules?.length) {
			for (const ruleEntry of matched.matchedCSSRules) {
				const rule = ruleEntry.rule;
				const selectors = rule.selectorList.selectors.map(s => s.text).join(', ');
				lines.push(`/* Matched Rule from ${rule.origin} */`);
				lines.push(`${selectors} {`);
				for (const prop of rule.style.cssProperties) {
					if (prop.name && prop.value) {
						lines.push(`  ${prop.name}: ${prop.value};`);
					}
				}
				lines.push('}\n');
			}
		}

		// inherited rules
		if (matched.inherited?.length) {
			let level = 1;
			for (const inherited of matched.inherited) {
				const rules = inherited.matchedCSSRules || [];
				for (const ruleEntry of rules) {
					const rule = ruleEntry.rule;
					const selectors = rule.selectorList.selectors.map(s => s.text).join(', ');
					lines.push(`/* Inherited from ancestor level ${level} (${rule.origin}) */`);
					lines.push(`${selectors} {`);
					for (const prop of rule.style.cssProperties) {
						if (prop.name && prop.value) {
							lines.push(`  ${prop.name}: ${prop.value};`);
						}
					}
					lines.push('}\n');
				}
				level++;
			}
		}

		return '\n' + lines.join('\n');
	}

	private windowById(windowId: number | undefined, fallbackCodeWindowId?: number): ICodeWindow | IAuxiliaryWindow | undefined {
		return this.codeWindowById(windowId) ?? this.auxiliaryWindowById(windowId) ?? this.codeWindowById(fallbackCodeWindowId);
	}

	private codeWindowById(windowId: number | undefined): ICodeWindow | undefined {
		if (typeof windowId !== 'number') {
			return undefined;
		}

		return this.windowsMainService.getWindowById(windowId);
	}

	private auxiliaryWindowById(windowId: number | undefined): IAuxiliaryWindow | undefined {
		if (typeof windowId !== 'number') {
			return undefined;
		}

		const contents = webContents.fromId(windowId);
		if (!contents) {
			return undefined;
		}

		return this.auxiliaryWindowsMainService.getWindowByWebContents(contents);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/checksum/common/checksumService.ts]---
Location: vscode-main/src/vs/platform/checksum/common/checksumService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IChecksumService = createDecorator<IChecksumService>('checksumService');

export interface IChecksumService {

	readonly _serviceBrand: undefined;

	/**
	 * Computes the checksum of the contents of the resource.
	 */
	checksum(resource: URI): Promise<string>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/checksum/node/checksumService.ts]---
Location: vscode-main/src/vs/platform/checksum/node/checksumService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createHash } from 'crypto';
import { listenStream } from '../../../base/common/stream.js';
import { URI } from '../../../base/common/uri.js';
import { IChecksumService } from '../common/checksumService.js';
import { IFileService } from '../../files/common/files.js';

export class ChecksumService implements IChecksumService {

	declare readonly _serviceBrand: undefined;

	constructor(@IFileService private readonly fileService: IFileService) { }

	async checksum(resource: URI): Promise<string> {
		const stream = (await this.fileService.readFileStream(resource)).value;
		return new Promise<string>((resolve, reject) => {
			const hash = createHash('sha256');

			listenStream(stream, {
				onData: data => hash.update(data.buffer),
				onError: error => reject(error),
				onEnd: () => resolve(hash.digest('base64').replace(/=+$/, ''))
			});
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/checksum/test/node/checksumService.test.ts]---
Location: vscode-main/src/vs/platform/checksum/test/node/checksumService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { FileAccess, Schemas } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ChecksumService } from '../../node/checksumService.js';
import { IFileService } from '../../../files/common/files.js';
import { FileService } from '../../../files/common/fileService.js';
import { DiskFileSystemProvider } from '../../../files/node/diskFileSystemProvider.js';
import { NullLogService } from '../../../log/common/log.js';

suite('Checksum Service', () => {

	let diskFileSystemProvider: DiskFileSystemProvider;
	let fileService: IFileService;

	setup(() => {
		const logService = new NullLogService();
		fileService = new FileService(logService);

		diskFileSystemProvider = new DiskFileSystemProvider(logService);
		fileService.registerProvider(Schemas.file, diskFileSystemProvider);
	});

	teardown(() => {
		diskFileSystemProvider.dispose();
		fileService.dispose();
	});

	test('checksum', async () => {
		const checksumService = new ChecksumService(fileService);

		const checksum = await checksumService.checksum(URI.file(FileAccess.asFileUri('vs/platform/checksum/test/node/fixtures/lorem.txt').fsPath));
		assert.ok(checksum === 'd/9bMU0ydNCmc/hg8ItWeiLT/ePnf7gyPRQVGpd6tRI' || checksum === 'eJeeTIS0dzi8MZY+nHhjPBVtNbmGqxfVvgEOB4sqVIc'); // depends on line endings git config
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

````

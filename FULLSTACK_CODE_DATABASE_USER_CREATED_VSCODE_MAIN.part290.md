---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 290
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 290 of 552)

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

---[FILE: src/vs/platform/userData/test/browser/fileUserDataProvider.test.ts]---
Location: vscode-main/src/vs/platform/userData/test/browser/fileUserDataProvider.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { dirname, isEqual, joinPath } from '../../../../base/common/resources.js';
import { ReadableStreamEvents } from '../../../../base/common/stream.js';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IEnvironmentService } from '../../../environment/common/environment.js';
import { AbstractNativeEnvironmentService } from '../../../environment/common/environmentService.js';
import { FileService } from '../../../files/common/fileService.js';
import { FileChangeType, FileSystemProviderCapabilities, FileType, IFileChange, IFileOpenOptions, IFileReadStreamOptions, IFileService, IFileSystemProviderWithFileReadStreamCapability, IFileSystemProviderWithFileReadWriteCapability, IFileSystemProviderWithOpenReadWriteCloseCapability, IStat } from '../../../files/common/files.js';
import { InMemoryFileSystemProvider } from '../../../files/common/inMemoryFilesystemProvider.js';
import { NullLogService } from '../../../log/common/log.js';
import product from '../../../product/common/product.js';
import { UriIdentityService } from '../../../uriIdentity/common/uriIdentityService.js';
import { FileUserDataProvider } from '../../common/fileUserDataProvider.js';
import { IUserDataProfilesService, UserDataProfilesService } from '../../../userDataProfile/common/userDataProfile.js';

const ROOT = URI.file('tests').with({ scheme: 'vscode-tests' });

class TestEnvironmentService extends AbstractNativeEnvironmentService {
	constructor(private readonly _appSettingsHome: URI) {
		super(Object.create(null), Object.create(null), { _serviceBrand: undefined, ...product });
	}
	override get userRoamingDataHome() { return this._appSettingsHome.with({ scheme: Schemas.vscodeUserData }); }
	override get cacheHome() { return this.userRoamingDataHome; }
}

suite('FileUserDataProvider', () => {

	let testObject: IFileService;
	let userDataHomeOnDisk: URI;
	let backupWorkspaceHomeOnDisk: URI;
	let environmentService: IEnvironmentService;
	let userDataProfilesService: IUserDataProfilesService;
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();
	let fileUserDataProvider: FileUserDataProvider;

	setup(async () => {
		const logService = new NullLogService();
		testObject = disposables.add(new FileService(logService));
		const fileSystemProvider = disposables.add(new InMemoryFileSystemProvider());
		disposables.add(testObject.registerProvider(ROOT.scheme, fileSystemProvider));

		userDataHomeOnDisk = joinPath(ROOT, 'User');
		const backupHome = joinPath(ROOT, 'Backups');
		backupWorkspaceHomeOnDisk = joinPath(backupHome, 'workspaceId');
		await testObject.createFolder(userDataHomeOnDisk);
		await testObject.createFolder(backupWorkspaceHomeOnDisk);

		environmentService = new TestEnvironmentService(userDataHomeOnDisk);
		const uriIdentityService = disposables.add(new UriIdentityService(testObject));
		userDataProfilesService = disposables.add(new UserDataProfilesService(environmentService, testObject, uriIdentityService, logService));

		fileUserDataProvider = disposables.add(new FileUserDataProvider(ROOT.scheme, fileSystemProvider, Schemas.vscodeUserData, userDataProfilesService, uriIdentityService, logService));
		disposables.add(fileUserDataProvider);
		disposables.add(testObject.registerProvider(Schemas.vscodeUserData, fileUserDataProvider));
	});

	test('exists return false when file does not exist', async () => {
		const exists = await testObject.exists(userDataProfilesService.defaultProfile.settingsResource);
		assert.strictEqual(exists, false);
	});

	test('read file throws error if not exist', async () => {
		try {
			await testObject.readFile(userDataProfilesService.defaultProfile.settingsResource);
			assert.fail('Should fail since file does not exist');
		} catch (e) { }
	});

	test('read existing file', async () => {
		await testObject.writeFile(joinPath(userDataHomeOnDisk, 'settings.json'), VSBuffer.fromString('{}'));
		const result = await testObject.readFile(userDataProfilesService.defaultProfile.settingsResource);
		assert.strictEqual(result.value.toString(), '{}');
	});

	test('create file', async () => {
		const resource = userDataProfilesService.defaultProfile.settingsResource;
		const actual1 = await testObject.createFile(resource, VSBuffer.fromString('{}'));
		assert.strictEqual(actual1.resource.toString(), resource.toString());
		const actual2 = await testObject.readFile(joinPath(userDataHomeOnDisk, 'settings.json'));
		assert.strictEqual(actual2.value.toString(), '{}');
	});

	test('write file creates the file if not exist', async () => {
		const resource = userDataProfilesService.defaultProfile.settingsResource;
		const actual1 = await testObject.writeFile(resource, VSBuffer.fromString('{}'));
		assert.strictEqual(actual1.resource.toString(), resource.toString());
		const actual2 = await testObject.readFile(joinPath(userDataHomeOnDisk, 'settings.json'));
		assert.strictEqual(actual2.value.toString(), '{}');
	});

	test('write to existing file', async () => {
		const resource = userDataProfilesService.defaultProfile.settingsResource;
		await testObject.writeFile(joinPath(userDataHomeOnDisk, 'settings.json'), VSBuffer.fromString('{}'));
		const actual1 = await testObject.writeFile(resource, VSBuffer.fromString('{a:1}'));
		assert.strictEqual(actual1.resource.toString(), resource.toString());
		const actual2 = await testObject.readFile(joinPath(userDataHomeOnDisk, 'settings.json'));
		assert.strictEqual(actual2.value.toString(), '{a:1}');
	});

	test('delete file', async () => {
		await testObject.writeFile(joinPath(userDataHomeOnDisk, 'settings.json'), VSBuffer.fromString(''));
		await testObject.del(userDataProfilesService.defaultProfile.settingsResource);
		const result = await testObject.exists(joinPath(userDataHomeOnDisk, 'settings.json'));
		assert.strictEqual(false, result);
	});

	test('resolve file', async () => {
		await testObject.writeFile(joinPath(userDataHomeOnDisk, 'settings.json'), VSBuffer.fromString(''));
		const result = await testObject.resolve(userDataProfilesService.defaultProfile.settingsResource);
		assert.ok(!result.isDirectory);
		assert.ok(result.children === undefined);
	});

	test('exists return false for folder that does not exist', async () => {
		const exists = await testObject.exists(userDataProfilesService.defaultProfile.snippetsHome);
		assert.strictEqual(exists, false);
	});

	test('exists return true for folder that exists', async () => {
		await testObject.createFolder(joinPath(userDataHomeOnDisk, 'snippets'));
		const exists = await testObject.exists(userDataProfilesService.defaultProfile.snippetsHome);
		assert.strictEqual(exists, true);
	});

	test('read file throws error for folder', async () => {
		await testObject.createFolder(joinPath(userDataHomeOnDisk, 'snippets'));
		try {
			await testObject.readFile(userDataProfilesService.defaultProfile.snippetsHome);
			assert.fail('Should fail since read file is not supported for folders');
		} catch (e) { }
	});

	test('read file under folder', async () => {
		await testObject.createFolder(joinPath(userDataHomeOnDisk, 'snippets'));
		await testObject.writeFile(joinPath(userDataHomeOnDisk, 'snippets', 'settings.json'), VSBuffer.fromString('{}'));
		const resource = joinPath(userDataProfilesService.defaultProfile.snippetsHome, 'settings.json');
		const actual = await testObject.readFile(resource);
		assert.strictEqual(actual.resource.toString(), resource.toString());
		assert.strictEqual(actual.value.toString(), '{}');
	});

	test('read file under sub folder', async () => {
		await testObject.createFolder(joinPath(userDataHomeOnDisk, 'snippets', 'java'));
		await testObject.writeFile(joinPath(userDataHomeOnDisk, 'snippets', 'java', 'settings.json'), VSBuffer.fromString('{}'));
		const resource = joinPath(userDataProfilesService.defaultProfile.snippetsHome, 'java/settings.json');
		const actual = await testObject.readFile(resource);
		assert.strictEqual(actual.resource.toString(), resource.toString());
		assert.strictEqual(actual.value.toString(), '{}');
	});

	test('create file under folder that exists', async () => {
		await testObject.createFolder(joinPath(userDataHomeOnDisk, 'snippets'));
		const resource = joinPath(userDataProfilesService.defaultProfile.snippetsHome, 'settings.json');
		const actual1 = await testObject.createFile(resource, VSBuffer.fromString('{}'));
		assert.strictEqual(actual1.resource.toString(), resource.toString());
		const actual2 = await testObject.readFile(joinPath(userDataHomeOnDisk, 'snippets', 'settings.json'));
		assert.strictEqual(actual2.value.toString(), '{}');
	});

	test('create file under folder that does not exist', async () => {
		const resource = joinPath(userDataProfilesService.defaultProfile.snippetsHome, 'settings.json');
		const actual1 = await testObject.createFile(resource, VSBuffer.fromString('{}'));
		assert.strictEqual(actual1.resource.toString(), resource.toString());
		const actual2 = await testObject.readFile(joinPath(userDataHomeOnDisk, 'snippets', 'settings.json'));
		assert.strictEqual(actual2.value.toString(), '{}');
	});

	test('write to not existing file under container that exists', async () => {
		await testObject.createFolder(joinPath(userDataHomeOnDisk, 'snippets'));
		const resource = joinPath(userDataProfilesService.defaultProfile.snippetsHome, 'settings.json');
		const actual1 = await testObject.writeFile(resource, VSBuffer.fromString('{}'));
		assert.strictEqual(actual1.resource.toString(), resource.toString());
		const actual = await testObject.readFile(joinPath(userDataHomeOnDisk, 'snippets', 'settings.json'));
		assert.strictEqual(actual.value.toString(), '{}');
	});

	test('write to not existing file under container that does not exists', async () => {
		const resource = joinPath(userDataProfilesService.defaultProfile.snippetsHome, 'settings.json');
		const actual1 = await testObject.writeFile(resource, VSBuffer.fromString('{}'));
		assert.strictEqual(actual1.resource.toString(), resource.toString());
		const actual = await testObject.readFile(joinPath(userDataHomeOnDisk, 'snippets', 'settings.json'));
		assert.strictEqual(actual.value.toString(), '{}');
	});

	test('write to existing file under container', async () => {
		await testObject.createFolder(joinPath(userDataHomeOnDisk, 'snippets'));
		await testObject.writeFile(joinPath(userDataHomeOnDisk, 'snippets', 'settings.json'), VSBuffer.fromString('{}'));
		const resource = joinPath(userDataProfilesService.defaultProfile.snippetsHome, 'settings.json');
		const actual1 = await testObject.writeFile(resource, VSBuffer.fromString('{a:1}'));
		assert.strictEqual(actual1.resource.toString(), resource.toString());
		const actual = await testObject.readFile(joinPath(userDataHomeOnDisk, 'snippets', 'settings.json'));
		assert.strictEqual(actual.value.toString(), '{a:1}');
	});

	test('write file under sub container', async () => {
		const resource = joinPath(userDataProfilesService.defaultProfile.snippetsHome, 'java/settings.json');
		const actual1 = await testObject.writeFile(resource, VSBuffer.fromString('{}'));
		assert.strictEqual(actual1.resource.toString(), resource.toString());
		const actual = await testObject.readFile(joinPath(userDataHomeOnDisk, 'snippets', 'java', 'settings.json'));
		assert.strictEqual(actual.value.toString(), '{}');
	});

	test('delete throws error for folder that does not exist', async () => {
		try {
			await testObject.del(userDataProfilesService.defaultProfile.snippetsHome);
			assert.fail('Should fail the folder does not exist');
		} catch (e) { }
	});

	test('delete not existing file under container that exists', async () => {
		await testObject.createFolder(joinPath(userDataHomeOnDisk, 'snippets'));
		try {
			await testObject.del(joinPath(userDataProfilesService.defaultProfile.snippetsHome, 'settings.json'));
			assert.fail('Should fail since file does not exist');
		} catch (e) { }
	});

	test('delete not existing file under container that does not exists', async () => {
		try {
			await testObject.del(joinPath(userDataProfilesService.defaultProfile.snippetsHome, 'settings.json'));
			assert.fail('Should fail since file does not exist');
		} catch (e) { }
	});

	test('delete existing file under folder', async () => {
		await testObject.createFolder(joinPath(userDataHomeOnDisk, 'snippets'));
		await testObject.writeFile(joinPath(userDataHomeOnDisk, 'snippets', 'settings.json'), VSBuffer.fromString('{}'));
		await testObject.del(joinPath(userDataProfilesService.defaultProfile.snippetsHome, 'settings.json'));
		const exists = await testObject.exists(joinPath(userDataHomeOnDisk, 'snippets', 'settings.json'));
		assert.strictEqual(exists, false);
	});

	test('resolve folder', async () => {
		await testObject.createFolder(joinPath(userDataHomeOnDisk, 'snippets'));
		await testObject.writeFile(joinPath(userDataHomeOnDisk, 'snippets', 'settings.json'), VSBuffer.fromString('{}'));
		const result = await testObject.resolve(userDataProfilesService.defaultProfile.snippetsHome);
		assert.ok(result.isDirectory);
		assert.ok(result.children !== undefined);
		assert.strictEqual(result.children.length, 1);
		assert.strictEqual(result.children[0].resource.toString(), joinPath(userDataProfilesService.defaultProfile.snippetsHome, 'settings.json').toString());
	});

	test('read backup file', async () => {
		await testObject.writeFile(joinPath(backupWorkspaceHomeOnDisk, 'backup.json'), VSBuffer.fromString('{}'));
		const result = await testObject.readFile(joinPath(backupWorkspaceHomeOnDisk.with({ scheme: environmentService.userRoamingDataHome.scheme }), `backup.json`));
		assert.strictEqual(result.value.toString(), '{}');
	});

	test('create backup file', async () => {
		await testObject.createFile(joinPath(backupWorkspaceHomeOnDisk.with({ scheme: environmentService.userRoamingDataHome.scheme }), `backup.json`), VSBuffer.fromString('{}'));
		const result = await testObject.readFile(joinPath(backupWorkspaceHomeOnDisk, 'backup.json'));
		assert.strictEqual(result.value.toString(), '{}');
	});

	test('write backup file', async () => {
		await testObject.writeFile(joinPath(backupWorkspaceHomeOnDisk, 'backup.json'), VSBuffer.fromString('{}'));
		await testObject.writeFile(joinPath(backupWorkspaceHomeOnDisk.with({ scheme: environmentService.userRoamingDataHome.scheme }), `backup.json`), VSBuffer.fromString('{a:1}'));
		const result = await testObject.readFile(joinPath(backupWorkspaceHomeOnDisk, 'backup.json'));
		assert.strictEqual(result.value.toString(), '{a:1}');
	});

	test('resolve backups folder', async () => {
		await testObject.writeFile(joinPath(backupWorkspaceHomeOnDisk, 'backup.json'), VSBuffer.fromString('{}'));
		const result = await testObject.resolve(backupWorkspaceHomeOnDisk.with({ scheme: environmentService.userRoamingDataHome.scheme }));
		assert.ok(result.isDirectory);
		assert.ok(result.children !== undefined);
		assert.strictEqual(result.children.length, 1);
		assert.strictEqual(result.children[0].resource.toString(), joinPath(backupWorkspaceHomeOnDisk.with({ scheme: environmentService.userRoamingDataHome.scheme }), `backup.json`).toString());
	});
});

class TestFileSystemProvider implements IFileSystemProviderWithFileReadWriteCapability, IFileSystemProviderWithOpenReadWriteCloseCapability, IFileSystemProviderWithFileReadStreamCapability {

	constructor(readonly onDidChangeFile: Event<readonly IFileChange[]>) { }


	readonly capabilities: FileSystemProviderCapabilities = FileSystemProviderCapabilities.FileReadWrite;

	readonly onDidChangeCapabilities: Event<void> = Event.None;

	watch(): IDisposable { return Disposable.None; }

	stat(): Promise<IStat> { throw new Error('Not Supported'); }

	mkdir(resource: URI): Promise<void> { throw new Error('Not Supported'); }

	rename(): Promise<void> { throw new Error('Not Supported'); }

	readFile(resource: URI): Promise<Uint8Array> { throw new Error('Not Supported'); }

	readdir(resource: URI): Promise<[string, FileType][]> { throw new Error('Not Supported'); }

	writeFile(): Promise<void> { throw new Error('Not Supported'); }

	delete(): Promise<void> { throw new Error('Not Supported'); }
	open(resource: URI, opts: IFileOpenOptions): Promise<number> { throw new Error('Not Supported'); }
	close(fd: number): Promise<void> { throw new Error('Not Supported'); }
	read(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> { throw new Error('Not Supported'); }
	write(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> { throw new Error('Not Supported'); }

	readFileStream(resource: URI, opts: IFileReadStreamOptions, token: CancellationToken): ReadableStreamEvents<Uint8Array> { throw new Error('Method not implemented.'); }
}

suite('FileUserDataProvider - Watching', () => {

	let testObject: FileUserDataProvider;
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();
	const rootFileResource = joinPath(ROOT, 'User');
	const rootUserDataResource = rootFileResource.with({ scheme: Schemas.vscodeUserData });

	let fileEventEmitter: Emitter<readonly IFileChange[]>;

	setup(() => {
		const logService = new NullLogService();
		const fileService = disposables.add(new FileService(logService));
		const environmentService = new TestEnvironmentService(rootFileResource);
		const uriIdentityService = disposables.add(new UriIdentityService(fileService));
		const userDataProfilesService = disposables.add(new UserDataProfilesService(environmentService, fileService, uriIdentityService, logService));

		fileEventEmitter = disposables.add(new Emitter<readonly IFileChange[]>());
		testObject = disposables.add(new FileUserDataProvider(rootFileResource.scheme, new TestFileSystemProvider(fileEventEmitter.event), Schemas.vscodeUserData, userDataProfilesService, uriIdentityService, new NullLogService()));
	});

	test('file added change event', done => {
		disposables.add(testObject.watch(rootUserDataResource, { excludes: [], recursive: false }));
		const expected = joinPath(rootUserDataResource, 'settings.json');
		const target = joinPath(rootFileResource, 'settings.json');
		disposables.add(testObject.onDidChangeFile(e => {
			if (isEqual(e[0].resource, expected) && e[0].type === FileChangeType.ADDED) {
				done();
			}
		}));
		fileEventEmitter.fire([{
			resource: target,
			type: FileChangeType.ADDED
		}]);
	});

	test('file updated change event', done => {
		disposables.add(testObject.watch(rootUserDataResource, { excludes: [], recursive: false }));
		const expected = joinPath(rootUserDataResource, 'settings.json');
		const target = joinPath(rootFileResource, 'settings.json');
		disposables.add(testObject.onDidChangeFile(e => {
			if (isEqual(e[0].resource, expected) && e[0].type === FileChangeType.UPDATED) {
				done();
			}
		}));
		fileEventEmitter.fire([{
			resource: target,
			type: FileChangeType.UPDATED
		}]);
	});

	test('file deleted change event', done => {
		disposables.add(testObject.watch(rootUserDataResource, { excludes: [], recursive: false }));
		const expected = joinPath(rootUserDataResource, 'settings.json');
		const target = joinPath(rootFileResource, 'settings.json');
		disposables.add(testObject.onDidChangeFile(e => {
			if (isEqual(e[0].resource, expected) && e[0].type === FileChangeType.DELETED) {
				done();
			}
		}));
		fileEventEmitter.fire([{
			resource: target,
			type: FileChangeType.DELETED
		}]);
	});

	test('file under folder created change event', done => {
		disposables.add(testObject.watch(rootUserDataResource, { excludes: [], recursive: false }));
		const expected = joinPath(rootUserDataResource, 'snippets', 'settings.json');
		const target = joinPath(rootFileResource, 'snippets', 'settings.json');
		disposables.add(testObject.onDidChangeFile(e => {
			if (isEqual(e[0].resource, expected) && e[0].type === FileChangeType.ADDED) {
				done();
			}
		}));
		fileEventEmitter.fire([{
			resource: target,
			type: FileChangeType.ADDED
		}]);
	});

	test('file under folder updated change event', done => {
		disposables.add(testObject.watch(rootUserDataResource, { excludes: [], recursive: false }));
		const expected = joinPath(rootUserDataResource, 'snippets', 'settings.json');
		const target = joinPath(rootFileResource, 'snippets', 'settings.json');
		disposables.add(testObject.onDidChangeFile(e => {
			if (isEqual(e[0].resource, expected) && e[0].type === FileChangeType.UPDATED) {
				done();
			}
		}));
		fileEventEmitter.fire([{
			resource: target,
			type: FileChangeType.UPDATED
		}]);
	});

	test('file under folder deleted change event', done => {
		disposables.add(testObject.watch(rootUserDataResource, { excludes: [], recursive: false }));
		const expected = joinPath(rootUserDataResource, 'snippets', 'settings.json');
		const target = joinPath(rootFileResource, 'snippets', 'settings.json');
		disposables.add(testObject.onDidChangeFile(e => {
			if (isEqual(e[0].resource, expected) && e[0].type === FileChangeType.DELETED) {
				done();
			}
		}));
		fileEventEmitter.fire([{
			resource: target,
			type: FileChangeType.DELETED
		}]);
	});

	test('event is not triggered if not watched', async () => {
		const target = joinPath(rootFileResource, 'settings.json');
		let triggered = false;
		disposables.add(testObject.onDidChangeFile(() => triggered = true));
		fileEventEmitter.fire([{
			resource: target,
			type: FileChangeType.DELETED
		}]);
		if (triggered) {
			assert.fail('event should not be triggered');
		}
	});

	test('event is not triggered if not watched 2', async () => {
		disposables.add(testObject.watch(rootUserDataResource, { excludes: [], recursive: false }));
		const target = joinPath(dirname(rootFileResource), 'settings.json');
		let triggered = false;
		disposables.add(testObject.onDidChangeFile(() => triggered = true));
		fileEventEmitter.fire([{
			resource: target,
			type: FileChangeType.DELETED
		}]);
		if (triggered) {
			assert.fail('event should not be triggered');
		}
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataProfile/browser/userDataProfile.ts]---
Location: vscode-main/src/vs/platform/userDataProfile/browser/userDataProfile.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BroadcastDataChannel } from '../../../base/browser/broadcast.js';
import { revive } from '../../../base/common/marshalling.js';
import { UriDto } from '../../../base/common/uri.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { IFileService } from '../../files/common/files.js';
import { ILogService } from '../../log/common/log.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { DidChangeProfilesEvent, IUserDataProfile, IUserDataProfilesService, reviveProfile, StoredProfileAssociations, StoredUserDataProfile, UserDataProfilesService } from '../common/userDataProfile.js';

type BroadcastedProfileChanges = UriDto<Omit<DidChangeProfilesEvent, 'all'>>;

export class BrowserUserDataProfilesService extends UserDataProfilesService implements IUserDataProfilesService {

	private readonly changesBroadcastChannel: BroadcastDataChannel<BroadcastedProfileChanges>;

	constructor(
		@IEnvironmentService environmentService: IEnvironmentService,
		@IFileService fileService: IFileService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@ILogService logService: ILogService,
	) {
		super(environmentService, fileService, uriIdentityService, logService);
		this.changesBroadcastChannel = this._register(new BroadcastDataChannel<BroadcastedProfileChanges>(`${UserDataProfilesService.PROFILES_KEY}.changes`));
		this._register(this.changesBroadcastChannel.onDidReceiveData(changes => {
			try {
				this._profilesObject = undefined;
				const added = changes.added.map(p => reviveProfile(p, this.profilesHome.scheme));
				const removed = changes.removed.map(p => reviveProfile(p, this.profilesHome.scheme));
				const updated = changes.updated.map(p => reviveProfile(p, this.profilesHome.scheme));

				this.updateTransientProfiles(
					added.filter(a => a.isTransient),
					removed.filter(a => a.isTransient),
					updated.filter(a => a.isTransient)
				);

				this._onDidChangeProfiles.fire({
					added,
					removed,
					updated,
					all: this.profiles
				});
			} catch (error) {/* ignore */ }
		}));
	}

	private updateTransientProfiles(added: IUserDataProfile[], removed: IUserDataProfile[], updated: IUserDataProfile[]): void {
		if (added.length) {
			this.transientProfilesObject.profiles.push(...added);
		}
		if (removed.length || updated.length) {
			const allTransientProfiles = this.transientProfilesObject.profiles;
			this.transientProfilesObject.profiles = [];
			for (const profile of allTransientProfiles) {
				if (removed.some(p => profile.id === p.id)) {
					continue;
				}
				this.transientProfilesObject.profiles.push(updated.find(p => profile.id === p.id) ?? profile);
			}
		}
	}

	protected override getStoredProfiles(): StoredUserDataProfile[] {
		try {
			const value = localStorage.getItem(UserDataProfilesService.PROFILES_KEY);
			if (value) {
				return revive(JSON.parse(value));
			}
		} catch (error) {
			/* ignore */
			this.logService.error(error);
		}
		return [];
	}

	protected override triggerProfilesChanges(added: IUserDataProfile[], removed: IUserDataProfile[], updated: IUserDataProfile[]) {
		super.triggerProfilesChanges(added, removed, updated);
		this.changesBroadcastChannel.postData({ added, removed, updated });
	}

	protected override saveStoredProfiles(storedProfiles: StoredUserDataProfile[]): void {
		localStorage.setItem(UserDataProfilesService.PROFILES_KEY, JSON.stringify(storedProfiles));
	}

	protected override getStoredProfileAssociations(): StoredProfileAssociations {
		try {
			const value = localStorage.getItem(UserDataProfilesService.PROFILE_ASSOCIATIONS_KEY);
			if (value) {
				return JSON.parse(value);
			}
		} catch (error) {
			/* ignore */
			this.logService.error(error);
		}
		return {};
	}

	protected override saveStoredProfileAssociations(storedProfileAssociations: StoredProfileAssociations): void {
		localStorage.setItem(UserDataProfilesService.PROFILE_ASSOCIATIONS_KEY, JSON.stringify(storedProfileAssociations));
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataProfile/common/userDataProfile.ts]---
Location: vscode-main/src/vs/platform/userDataProfile/common/userDataProfile.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { hash } from '../../../base/common/hash.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { basename, joinPath } from '../../../base/common/resources.js';
import { URI, UriDto } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { FileOperationResult, IFileService, toFileOperationResult } from '../../files/common/files.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';
import { IAnyWorkspaceIdentifier, isSingleFolderWorkspaceIdentifier, isWorkspaceIdentifier } from '../../workspace/common/workspace.js';
import { IStringDictionary } from '../../../base/common/collections.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { Promises } from '../../../base/common/async.js';
import { generateUuid } from '../../../base/common/uuid.js';
import { escapeRegExpCharacters } from '../../../base/common/strings.js';
import { isString, Mutable } from '../../../base/common/types.js';

export const enum ProfileResourceType {
	Settings = 'settings',
	Keybindings = 'keybindings',
	Snippets = 'snippets',
	Prompts = 'prompts',
	Tasks = 'tasks',
	Extensions = 'extensions',
	GlobalState = 'globalState',
	Mcp = 'mcp',
}

/**
 * Flags to indicate whether to use the default profile or not.
 */
export type UseDefaultProfileFlags = { [key in ProfileResourceType]?: boolean };
export type ProfileResourceTypeFlags = UseDefaultProfileFlags;

export interface IUserDataProfile {
	readonly id: string;
	readonly isDefault: boolean;
	readonly name: string;
	readonly icon?: string;
	readonly location: URI;
	readonly globalStorageHome: URI;
	readonly settingsResource: URI;
	readonly keybindingsResource: URI;
	readonly tasksResource: URI;
	readonly snippetsHome: URI;
	readonly promptsHome: URI;
	readonly extensionsResource: URI;
	readonly mcpResource: URI;
	readonly cacheHome: URI;
	readonly useDefaultFlags?: UseDefaultProfileFlags;
	readonly isTransient?: boolean;
	readonly workspaces?: readonly URI[];
}

export function isUserDataProfile(thing: unknown): thing is IUserDataProfile {
	const candidate = thing as IUserDataProfile | undefined;

	return !!(candidate && typeof candidate === 'object'
		&& typeof candidate.id === 'string'
		&& typeof candidate.isDefault === 'boolean'
		&& typeof candidate.name === 'string'
		&& URI.isUri(candidate.location)
		&& URI.isUri(candidate.globalStorageHome)
		&& URI.isUri(candidate.settingsResource)
		&& URI.isUri(candidate.keybindingsResource)
		&& URI.isUri(candidate.tasksResource)
		&& URI.isUri(candidate.snippetsHome)
		&& URI.isUri(candidate.promptsHome)
		&& URI.isUri(candidate.extensionsResource)
		&& URI.isUri(candidate.mcpResource)
	);
}

export type DidChangeProfilesEvent = { readonly added: readonly IUserDataProfile[]; readonly removed: readonly IUserDataProfile[]; readonly updated: readonly IUserDataProfile[]; readonly all: readonly IUserDataProfile[] };

export type WillCreateProfileEvent = {
	profile: IUserDataProfile;
	join(promise: Promise<void>): void;
};

export type WillRemoveProfileEvent = {
	profile: IUserDataProfile;
	join(promise: Promise<void>): void;
};

export interface IUserDataProfileOptions {
	readonly icon?: string;
	readonly useDefaultFlags?: UseDefaultProfileFlags;
	readonly transient?: boolean;
	readonly workspaces?: readonly URI[];
}

export interface IUserDataProfileUpdateOptions extends Omit<IUserDataProfileOptions, 'icon'> {
	readonly name?: string;
	readonly icon?: string | null;
}

export const IUserDataProfilesService = createDecorator<IUserDataProfilesService>('IUserDataProfilesService');
export interface IUserDataProfilesService {
	readonly _serviceBrand: undefined;

	readonly profilesHome: URI;
	readonly defaultProfile: IUserDataProfile;

	readonly onDidChangeProfiles: Event<DidChangeProfilesEvent>;
	readonly profiles: readonly IUserDataProfile[];

	readonly onDidResetWorkspaces: Event<void>;

	createNamedProfile(name: string, options?: IUserDataProfileOptions, workspaceIdentifier?: IAnyWorkspaceIdentifier): Promise<IUserDataProfile>;
	createTransientProfile(workspaceIdentifier?: IAnyWorkspaceIdentifier): Promise<IUserDataProfile>;
	createProfile(id: string, name: string, options?: IUserDataProfileOptions, workspaceIdentifier?: IAnyWorkspaceIdentifier): Promise<IUserDataProfile>;
	updateProfile(profile: IUserDataProfile, options?: IUserDataProfileUpdateOptions,): Promise<IUserDataProfile>;
	removeProfile(profile: IUserDataProfile): Promise<void>;

	setProfileForWorkspace(workspaceIdentifier: IAnyWorkspaceIdentifier, profile: IUserDataProfile): Promise<void>;
	resetWorkspaces(): Promise<void>;

	cleanUp(): Promise<void>;
	cleanUpTransientProfiles(): Promise<void>;
}

export function reviveProfile(profile: UriDto<IUserDataProfile>, scheme: string): IUserDataProfile {
	return {
		id: profile.id,
		isDefault: profile.isDefault,
		name: profile.name,
		icon: profile.icon,
		location: URI.revive(profile.location).with({ scheme }),
		globalStorageHome: URI.revive(profile.globalStorageHome).with({ scheme }),
		settingsResource: URI.revive(profile.settingsResource).with({ scheme }),
		keybindingsResource: URI.revive(profile.keybindingsResource).with({ scheme }),
		tasksResource: URI.revive(profile.tasksResource).with({ scheme }),
		snippetsHome: URI.revive(profile.snippetsHome).with({ scheme }),
		promptsHome: URI.revive(profile.promptsHome).with({ scheme }),
		extensionsResource: URI.revive(profile.extensionsResource).with({ scheme }),
		mcpResource: URI.revive(profile.mcpResource).with({ scheme }),
		cacheHome: URI.revive(profile.cacheHome).with({ scheme }),
		useDefaultFlags: profile.useDefaultFlags,
		isTransient: profile.isTransient,
		workspaces: profile.workspaces?.map(w => URI.revive(w)),
	};
}

export function toUserDataProfile(id: string, name: string, location: URI, profilesCacheHome: URI, options?: IUserDataProfileOptions, defaultProfile?: IUserDataProfile): IUserDataProfile {
	return {
		id,
		name,
		location,
		isDefault: false,
		icon: options?.icon,
		globalStorageHome: defaultProfile && options?.useDefaultFlags?.globalState ? defaultProfile.globalStorageHome : joinPath(location, 'globalStorage'),
		settingsResource: defaultProfile && options?.useDefaultFlags?.settings ? defaultProfile.settingsResource : joinPath(location, 'settings.json'),
		keybindingsResource: defaultProfile && options?.useDefaultFlags?.keybindings ? defaultProfile.keybindingsResource : joinPath(location, 'keybindings.json'),
		tasksResource: defaultProfile && options?.useDefaultFlags?.tasks ? defaultProfile.tasksResource : joinPath(location, 'tasks.json'),
		snippetsHome: defaultProfile && options?.useDefaultFlags?.snippets ? defaultProfile.snippetsHome : joinPath(location, 'snippets'),
		promptsHome: defaultProfile && options?.useDefaultFlags?.prompts ? defaultProfile.promptsHome : joinPath(location, 'prompts'),
		extensionsResource: defaultProfile && options?.useDefaultFlags?.extensions ? defaultProfile.extensionsResource : joinPath(location, 'extensions.json'),
		mcpResource: defaultProfile && options?.useDefaultFlags?.mcp ? defaultProfile.mcpResource : joinPath(location, 'mcp.json'),
		cacheHome: joinPath(profilesCacheHome, id),
		useDefaultFlags: options?.useDefaultFlags,
		isTransient: options?.transient,
		workspaces: options?.workspaces,
	};
}

export type UserDataProfilesObject = {
	profiles: IUserDataProfile[];
	emptyWindows: Map<string, IUserDataProfile>;
};

export type StoredUserDataProfile = {
	name: string;
	location: URI;
	icon?: string;
	useDefaultFlags?: UseDefaultProfileFlags;
};

export type StoredProfileAssociations = {
	workspaces?: IStringDictionary<string>;
	emptyWindows?: IStringDictionary<string>;
};

export class UserDataProfilesService extends Disposable implements IUserDataProfilesService {

	protected static readonly PROFILES_KEY = 'userDataProfiles';
	protected static readonly PROFILE_ASSOCIATIONS_KEY = 'profileAssociations';

	readonly _serviceBrand: undefined;

	readonly profilesHome: URI;
	private readonly profilesCacheHome: URI;

	get defaultProfile(): IUserDataProfile { return this.profiles[0]; }
	get profiles(): IUserDataProfile[] { return [...this.profilesObject.profiles, ...this.transientProfilesObject.profiles]; }

	protected readonly _onDidChangeProfiles = this._register(new Emitter<DidChangeProfilesEvent>());
	readonly onDidChangeProfiles = this._onDidChangeProfiles.event;

	protected readonly _onWillCreateProfile = this._register(new Emitter<WillCreateProfileEvent>());
	readonly onWillCreateProfile = this._onWillCreateProfile.event;

	protected readonly _onWillRemoveProfile = this._register(new Emitter<WillRemoveProfileEvent>());
	readonly onWillRemoveProfile = this._onWillRemoveProfile.event;

	private readonly _onDidResetWorkspaces = this._register(new Emitter<void>());
	readonly onDidResetWorkspaces = this._onDidResetWorkspaces.event;

	private profileCreationPromises = new Map<string, Promise<IUserDataProfile>>();

	protected readonly transientProfilesObject: UserDataProfilesObject = {
		profiles: [],
		emptyWindows: new Map()
	};

	constructor(
		@IEnvironmentService protected readonly environmentService: IEnvironmentService,
		@IFileService protected readonly fileService: IFileService,
		@IUriIdentityService protected readonly uriIdentityService: IUriIdentityService,
		@ILogService protected readonly logService: ILogService
	) {
		super();
		this.profilesHome = joinPath(this.environmentService.userRoamingDataHome, 'profiles');
		this.profilesCacheHome = joinPath(this.environmentService.cacheHome, 'CachedProfilesData');
	}

	init(): void {
		this._profilesObject = undefined;
	}

	protected _profilesObject: UserDataProfilesObject | undefined;
	protected get profilesObject(): UserDataProfilesObject {
		if (!this._profilesObject) {
			const defaultProfile = this.createDefaultProfile();
			const profiles: Array<Mutable<IUserDataProfile>> = [defaultProfile];
			try {
				for (const storedProfile of this.getStoredProfiles()) {
					if (!storedProfile.name || !isString(storedProfile.name) || !storedProfile.location) {
						this.logService.warn('Skipping the invalid stored profile', storedProfile.location || storedProfile.name);
						continue;
					}
					profiles.push(toUserDataProfile(basename(storedProfile.location), storedProfile.name, storedProfile.location, this.profilesCacheHome, { icon: storedProfile.icon, useDefaultFlags: storedProfile.useDefaultFlags }, defaultProfile));
				}
			} catch (error) {
				this.logService.error(error);
			}
			const emptyWindows = new Map<string, IUserDataProfile>();
			if (profiles.length) {
				try {
					const profileAssociaitions = this.getStoredProfileAssociations();
					if (profileAssociaitions.workspaces) {
						for (const [workspacePath, profileId] of Object.entries(profileAssociaitions.workspaces)) {
							const workspace = URI.parse(workspacePath);
							const profile = profiles.find(p => p.id === profileId);
							if (profile) {
								const workspaces = profile.workspaces ? profile.workspaces.slice(0) : [];
								workspaces.push(workspace);
								profile.workspaces = workspaces;
							}
						}
					}
					if (profileAssociaitions.emptyWindows) {
						for (const [windowId, profileId] of Object.entries(profileAssociaitions.emptyWindows)) {
							const profile = profiles.find(p => p.id === profileId);
							if (profile) {
								emptyWindows.set(windowId, profile);
							}
						}
					}
				} catch (error) {
					this.logService.error(error);
				}
			}
			this._profilesObject = { profiles, emptyWindows };
		}
		return this._profilesObject;
	}

	private createDefaultProfile() {
		const defaultProfile = toUserDataProfile('__default__profile__', localize('defaultProfile', "Default"), this.environmentService.userRoamingDataHome, this.profilesCacheHome);
		return { ...defaultProfile, extensionsResource: this.getDefaultProfileExtensionsLocation() ?? defaultProfile.extensionsResource, isDefault: true };
	}

	async createTransientProfile(workspaceIdentifier?: IAnyWorkspaceIdentifier): Promise<IUserDataProfile> {
		const namePrefix = `Temp`;
		const nameRegEx = new RegExp(`${escapeRegExpCharacters(namePrefix)}\\s(\\d+)`);
		let nameIndex = 0;
		for (const profile of this.profiles) {
			const matches = nameRegEx.exec(profile.name);
			const index = matches ? parseInt(matches[1]) : 0;
			nameIndex = index > nameIndex ? index : nameIndex;
		}
		const name = `${namePrefix} ${nameIndex + 1}`;
		return this.createProfile(hash(generateUuid()).toString(16), name, { transient: true }, workspaceIdentifier);
	}

	async createNamedProfile(name: string, options?: IUserDataProfileOptions, workspaceIdentifier?: IAnyWorkspaceIdentifier): Promise<IUserDataProfile> {
		return this.createProfile(hash(generateUuid()).toString(16), name, options, workspaceIdentifier);
	}

	async createProfile(id: string, name: string, options?: IUserDataProfileOptions, workspaceIdentifier?: IAnyWorkspaceIdentifier): Promise<IUserDataProfile> {
		const profile = await this.doCreateProfile(id, name, options, workspaceIdentifier);

		return profile;
	}

	private async doCreateProfile(id: string, name: string, options?: IUserDataProfileOptions, workspaceIdentifier?: IAnyWorkspaceIdentifier): Promise<IUserDataProfile> {
		if (!isString(name) || !name) {
			throw new Error('Name of the profile is mandatory and must be of type `string`');
		}

		let profileCreationPromise = this.profileCreationPromises.get(name);
		if (!profileCreationPromise) {
			profileCreationPromise = (async () => {
				try {
					const existing = this.profiles.find(p => p.id === id || (!p.isTransient && !options?.transient && p.name === name));
					if (existing) {
						throw new Error(`Profile with ${name} name already exists`);
					}

					const workspace = workspaceIdentifier ? this.getWorkspace(workspaceIdentifier) : undefined;
					if (URI.isUri(workspace)) {
						options = { ...options, workspaces: [workspace] };
					}
					const profile = toUserDataProfile(id, name, joinPath(this.profilesHome, id), this.profilesCacheHome, options, this.defaultProfile);
					await this.fileService.createFolder(profile.location);

					const joiners: Promise<void>[] = [];
					this._onWillCreateProfile.fire({
						profile,
						join(promise) {
							joiners.push(promise);
						}
					});
					await Promises.settled(joiners);

					if (workspace && !URI.isUri(workspace)) {
						this.updateEmptyWindowAssociation(workspace, profile, !!profile.isTransient);
					}
					this.updateProfiles([profile], [], []);
					return profile;
				} finally {
					this.profileCreationPromises.delete(name);
				}
			})();
			this.profileCreationPromises.set(name, profileCreationPromise);
		}
		return profileCreationPromise;
	}

	async updateProfile(profile: IUserDataProfile, options: IUserDataProfileUpdateOptions): Promise<IUserDataProfile> {
		const profilesToUpdate: IUserDataProfile[] = [];
		for (const existing of this.profiles) {
			let profileToUpdate: Mutable<IUserDataProfile> | undefined;

			if (profile.id === existing.id) {
				if (!existing.isDefault) {
					profileToUpdate = toUserDataProfile(existing.id, options.name ?? existing.name, existing.location, this.profilesCacheHome, {
						icon: options.icon === null ? undefined : options.icon ?? existing.icon,
						transient: options.transient ?? existing.isTransient,
						useDefaultFlags: options.useDefaultFlags ?? existing.useDefaultFlags,
						workspaces: options.workspaces ?? existing.workspaces,
					}, this.defaultProfile);
				} else if (options.workspaces) {
					profileToUpdate = existing;
					profileToUpdate.workspaces = options.workspaces;
				}
			}

			else if (options.workspaces) {
				const workspaces = existing.workspaces?.filter(w1 => !options.workspaces?.some(w2 => this.uriIdentityService.extUri.isEqual(w1, w2)));
				if (existing.workspaces?.length !== workspaces?.length) {
					profileToUpdate = existing;
					profileToUpdate.workspaces = workspaces;
				}
			}

			if (profileToUpdate) {
				profilesToUpdate.push(profileToUpdate);
			}
		}

		if (!profilesToUpdate.length) {
			if (profile.isDefault) {
				throw new Error('Cannot update default profile');
			}
			throw new Error(`Profile '${profile.name}' does not exist`);
		}

		this.updateProfiles([], [], profilesToUpdate);

		const updatedProfile = this.profiles.find(p => p.id === profile.id);
		if (!updatedProfile) {
			throw new Error(`Profile '${profile.name}' was not updated`);
		}

		return updatedProfile;
	}

	async removeProfile(profileToRemove: IUserDataProfile): Promise<void> {
		if (profileToRemove.isDefault) {
			throw new Error('Cannot remove default profile');
		}
		const profile = this.profiles.find(p => p.id === profileToRemove.id);
		if (!profile) {
			throw new Error(`Profile '${profileToRemove.name}' does not exist`);
		}

		const joiners: Promise<void>[] = [];
		this._onWillRemoveProfile.fire({
			profile,
			join(promise) {
				joiners.push(promise);
			}
		});

		try {
			await Promise.allSettled(joiners);
		} catch (error) {
			this.logService.error(error);
		}

		this.updateProfiles([], [profile], []);

		try {
			await this.fileService.del(profile.cacheHome, { recursive: true });
		} catch (error) {
			if (toFileOperationResult(error) !== FileOperationResult.FILE_NOT_FOUND) {
				this.logService.error(error);
			}
		}
	}

	async setProfileForWorkspace(workspaceIdentifier: IAnyWorkspaceIdentifier, profileToSet: IUserDataProfile): Promise<void> {
		const profile = this.profiles.find(p => p.id === profileToSet.id);
		if (!profile) {
			throw new Error(`Profile '${profileToSet.name}' does not exist`);
		}

		const workspace = this.getWorkspace(workspaceIdentifier);
		if (URI.isUri(workspace)) {
			const workspaces = profile.workspaces ? [...profile.workspaces] : [];
			if (!workspaces.some(w => this.uriIdentityService.extUri.isEqual(w, workspace))) {
				workspaces.push(workspace);
				await this.updateProfile(profile, { workspaces });
			}
		} else {
			this.updateEmptyWindowAssociation(workspace, profile, false);
			this.updateStoredProfiles(this.profiles);
		}
	}

	unsetWorkspace(workspaceIdentifier: IAnyWorkspaceIdentifier, transient: boolean = false): void {
		const workspace = this.getWorkspace(workspaceIdentifier);
		if (URI.isUri(workspace)) {
			const currentlyAssociatedProfile = this.getProfileForWorkspace(workspaceIdentifier);
			if (currentlyAssociatedProfile) {
				this.updateProfile(currentlyAssociatedProfile, { workspaces: currentlyAssociatedProfile.workspaces?.filter(w => !this.uriIdentityService.extUri.isEqual(w, workspace)) });
			}
		} else {
			this.updateEmptyWindowAssociation(workspace, undefined, transient);
			this.updateStoredProfiles(this.profiles);
		}
	}

	async resetWorkspaces(): Promise<void> {
		this.transientProfilesObject.emptyWindows.clear();
		this.profilesObject.emptyWindows.clear();
		for (const profile of this.profiles) {
			(<Mutable<IUserDataProfile>>profile).workspaces = undefined;
		}
		this.updateProfiles([], [], this.profiles);
		this._onDidResetWorkspaces.fire();
	}

	async cleanUp(): Promise<void> {
		if (await this.fileService.exists(this.profilesHome)) {
			const stat = await this.fileService.resolve(this.profilesHome);
			await Promise.all((stat.children || [])
				.filter(child => child.isDirectory && this.profiles.every(p => !this.uriIdentityService.extUri.isEqual(p.location, child.resource)))
				.map(child => this.fileService.del(child.resource, { recursive: true })));
		}
	}

	async cleanUpTransientProfiles(): Promise<void> {
		const unAssociatedTransientProfiles = this.transientProfilesObject.profiles.filter(p => !this.isProfileAssociatedToWorkspace(p));
		await Promise.allSettled(unAssociatedTransientProfiles.map(p => this.removeProfile(p)));
	}

	getProfileForWorkspace(workspaceIdentifier: IAnyWorkspaceIdentifier): IUserDataProfile | undefined {
		const workspace = this.getWorkspace(workspaceIdentifier);
		return URI.isUri(workspace)
			? this.profiles.find(p => p.workspaces?.some(w => this.uriIdentityService.extUri.isEqual(w, workspace)))
			: (this.profilesObject.emptyWindows.get(workspace) ?? this.transientProfilesObject.emptyWindows.get(workspace));
	}

	protected getWorkspace(workspaceIdentifier: IAnyWorkspaceIdentifier): URI | string {
		if (isSingleFolderWorkspaceIdentifier(workspaceIdentifier)) {
			return workspaceIdentifier.uri;
		}
		if (isWorkspaceIdentifier(workspaceIdentifier)) {
			return workspaceIdentifier.configPath;
		}
		return workspaceIdentifier.id;
	}

	private isProfileAssociatedToWorkspace(profile: IUserDataProfile): boolean {
		if (profile.workspaces?.length) {
			return true;
		}
		if ([...this.profilesObject.emptyWindows.values()].some(windowProfile => this.uriIdentityService.extUri.isEqual(windowProfile.location, profile.location))) {
			return true;
		}
		if ([...this.transientProfilesObject.emptyWindows.values()].some(windowProfile => this.uriIdentityService.extUri.isEqual(windowProfile.location, profile.location))) {
			return true;
		}
		return false;
	}

	private updateProfiles(added: IUserDataProfile[], removed: IUserDataProfile[], updated: IUserDataProfile[]): void {
		const allProfiles: Mutable<IUserDataProfile>[] = [...this.profiles, ...added];

		const transientProfiles = this.transientProfilesObject.profiles;
		this.transientProfilesObject.profiles = [];

		const profiles: IUserDataProfile[] = [];

		for (let profile of allProfiles) {
			// removed
			if (removed.some(p => profile.id === p.id)) {
				for (const windowId of [...this.profilesObject.emptyWindows.keys()]) {
					if (profile.id === this.profilesObject.emptyWindows.get(windowId)?.id) {
						this.profilesObject.emptyWindows.delete(windowId);
					}
				}
				continue;
			}

			if (!profile.isDefault) {
				profile = updated.find(p => profile.id === p.id) ?? profile;
				const transientProfile = transientProfiles.find(p => profile.id === p.id);
				if (profile.isTransient) {
					this.transientProfilesObject.profiles.push(profile);
				} else {
					if (transientProfile) {
						// Move the empty window associations from the transient profile to the persisted profile
						for (const [windowId, p] of this.transientProfilesObject.emptyWindows.entries()) {
							if (profile.id === p.id) {
								this.transientProfilesObject.emptyWindows.delete(windowId);
								this.profilesObject.emptyWindows.set(windowId, profile);
								break;
							}
						}
					}
				}
			}

			if (profile.workspaces?.length === 0) {
				profile.workspaces = undefined;
			}

			profiles.push(profile);
		}

		this.updateStoredProfiles(profiles);
		this.triggerProfilesChanges(added, removed, updated);
	}

	protected triggerProfilesChanges(added: IUserDataProfile[], removed: IUserDataProfile[], updated: IUserDataProfile[]) {
		this._onDidChangeProfiles.fire({ added, removed, updated, all: this.profiles });
	}

	private updateEmptyWindowAssociation(windowId: string, newProfile: IUserDataProfile | undefined, transient: boolean): void {
		// Force transient if the new profile to associate is transient
		transient = newProfile?.isTransient ? true : transient;

		if (transient) {
			if (newProfile) {
				this.transientProfilesObject.emptyWindows.set(windowId, newProfile);
			} else {
				this.transientProfilesObject.emptyWindows.delete(windowId);
			}
		}

		else {
			// Unset the transiet association if any
			this.transientProfilesObject.emptyWindows.delete(windowId);
			if (newProfile) {
				this.profilesObject.emptyWindows.set(windowId, newProfile);
			} else {
				this.profilesObject.emptyWindows.delete(windowId);
			}
		}
	}

	private updateStoredProfiles(profiles: IUserDataProfile[]): void {
		const storedProfiles: StoredUserDataProfile[] = [];
		const workspaces: IStringDictionary<string> = {};
		const emptyWindows: IStringDictionary<string> = {};

		for (const profile of profiles) {
			if (profile.isTransient) {
				continue;
			}
			if (!profile.isDefault) {
				storedProfiles.push({ location: profile.location, name: profile.name, icon: profile.icon, useDefaultFlags: profile.useDefaultFlags });
			}
			if (profile.workspaces) {
				for (const workspace of profile.workspaces) {
					workspaces[workspace.toString()] = profile.id;
				}
			}
		}

		for (const [windowId, profile] of this.profilesObject.emptyWindows.entries()) {
			emptyWindows[windowId.toString()] = profile.id;
		}

		this.saveStoredProfileAssociations({ workspaces, emptyWindows });
		this.saveStoredProfiles(storedProfiles);
		this._profilesObject = undefined;
	}

	protected getStoredProfiles(): StoredUserDataProfile[] { return []; }
	protected saveStoredProfiles(storedProfiles: StoredUserDataProfile[]): void { throw new Error('not implemented'); }

	protected getStoredProfileAssociations(): StoredProfileAssociations { return {}; }
	protected saveStoredProfileAssociations(storedProfileAssociations: StoredProfileAssociations): void { throw new Error('not implemented'); }
	protected getDefaultProfileExtensionsLocation(): URI | undefined { return undefined; }
}

export class InMemoryUserDataProfilesService extends UserDataProfilesService {
	private storedProfiles: StoredUserDataProfile[] = [];
	protected override getStoredProfiles(): StoredUserDataProfile[] { return this.storedProfiles; }
	protected override saveStoredProfiles(storedProfiles: StoredUserDataProfile[]): void { this.storedProfiles = storedProfiles; }

	private storedProfileAssociations: StoredProfileAssociations = {};
	protected override getStoredProfileAssociations(): StoredProfileAssociations { return this.storedProfileAssociations; }
	protected override saveStoredProfileAssociations(storedProfileAssociations: StoredProfileAssociations): void { this.storedProfileAssociations = storedProfileAssociations; }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataProfile/common/userDataProfileIpc.ts]---
Location: vscode-main/src/vs/platform/userDataProfile/common/userDataProfileIpc.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { IChannel, IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { URI, UriDto } from '../../../base/common/uri.js';
import { DidChangeProfilesEvent, IUserDataProfile, IUserDataProfileOptions, IUserDataProfilesService, IUserDataProfileUpdateOptions, reviveProfile } from './userDataProfile.js';
import { IAnyWorkspaceIdentifier } from '../../workspace/common/workspace.js';
import { IURITransformer, transformIncomingURIs, transformOutgoingURIs } from '../../../base/common/uriIpc.js';

export class RemoteUserDataProfilesServiceChannel implements IServerChannel {

	constructor(
		private readonly service: IUserDataProfilesService,
		private readonly getUriTransformer: (requestContext: any) => IURITransformer
	) { }

	listen(context: any, event: string): Event<any> {
		const uriTransformer = this.getUriTransformer(context);
		switch (event) {
			case 'onDidChangeProfiles': return Event.map<DidChangeProfilesEvent, DidChangeProfilesEvent>(this.service.onDidChangeProfiles, e => {
				return {
					all: e.all.map(p => transformOutgoingURIs({ ...p }, uriTransformer)),
					added: e.added.map(p => transformOutgoingURIs({ ...p }, uriTransformer)),
					removed: e.removed.map(p => transformOutgoingURIs({ ...p }, uriTransformer)),
					updated: e.updated.map(p => transformOutgoingURIs({ ...p }, uriTransformer))
				};
			});
		}
		throw new Error(`Invalid listen ${event}`);
	}

	async call(context: any, command: string, args?: any): Promise<any> {
		const uriTransformer = this.getUriTransformer(context);
		switch (command) {
			case 'createProfile': {
				const profile = await this.service.createProfile(args[0], args[1], args[2]);
				return transformOutgoingURIs({ ...profile }, uriTransformer);
			}
			case 'updateProfile': {
				let profile = reviveProfile(transformIncomingURIs(args[0], uriTransformer), this.service.profilesHome.scheme);
				profile = await this.service.updateProfile(profile, args[1]);
				return transformOutgoingURIs({ ...profile }, uriTransformer);
			}
			case 'removeProfile': {
				const profile = reviveProfile(transformIncomingURIs(args[0], uriTransformer), this.service.profilesHome.scheme);
				return this.service.removeProfile(profile);
			}
		}
		throw new Error(`Invalid call ${command}`);
	}
}

export class UserDataProfilesService extends Disposable implements IUserDataProfilesService {

	readonly _serviceBrand: undefined;

	get defaultProfile(): IUserDataProfile { return this.profiles[0]; }
	private _profiles: IUserDataProfile[] = [];
	get profiles(): IUserDataProfile[] { return this._profiles; }

	private readonly _onDidChangeProfiles = this._register(new Emitter<DidChangeProfilesEvent>());
	readonly onDidChangeProfiles = this._onDidChangeProfiles.event;

	readonly onDidResetWorkspaces: Event<void>;

	constructor(
		profiles: readonly UriDto<IUserDataProfile>[],
		readonly profilesHome: URI,
		private readonly channel: IChannel,
	) {
		super();
		this._profiles = profiles.map(profile => reviveProfile(profile, this.profilesHome.scheme));
		this._register(this.channel.listen<DidChangeProfilesEvent>('onDidChangeProfiles')(e => {
			const added = e.added.map(profile => reviveProfile(profile, this.profilesHome.scheme));
			const removed = e.removed.map(profile => reviveProfile(profile, this.profilesHome.scheme));
			const updated = e.updated.map(profile => reviveProfile(profile, this.profilesHome.scheme));
			this._profiles = e.all.map(profile => reviveProfile(profile, this.profilesHome.scheme));
			this._onDidChangeProfiles.fire({ added, removed, updated, all: this.profiles });
		}));
		this.onDidResetWorkspaces = this.channel.listen<void>('onDidResetWorkspaces');
	}

	async createNamedProfile(name: string, options?: IUserDataProfileOptions, workspaceIdentifier?: IAnyWorkspaceIdentifier): Promise<IUserDataProfile> {
		const result = await this.channel.call<UriDto<IUserDataProfile>>('createNamedProfile', [name, options, workspaceIdentifier]);
		return reviveProfile(result, this.profilesHome.scheme);
	}

	async createProfile(id: string, name: string, options?: IUserDataProfileOptions, workspaceIdentifier?: IAnyWorkspaceIdentifier): Promise<IUserDataProfile> {
		const result = await this.channel.call<UriDto<IUserDataProfile>>('createProfile', [id, name, options, workspaceIdentifier]);
		return reviveProfile(result, this.profilesHome.scheme);
	}

	async createTransientProfile(workspaceIdentifier?: IAnyWorkspaceIdentifier): Promise<IUserDataProfile> {
		const result = await this.channel.call<UriDto<IUserDataProfile>>('createTransientProfile', [workspaceIdentifier]);
		return reviveProfile(result, this.profilesHome.scheme);
	}

	async setProfileForWorkspace(workspaceIdentifier: IAnyWorkspaceIdentifier, profile: IUserDataProfile): Promise<void> {
		await this.channel.call<UriDto<IUserDataProfile>>('setProfileForWorkspace', [workspaceIdentifier, profile]);
	}

	removeProfile(profile: IUserDataProfile): Promise<void> {
		return this.channel.call('removeProfile', [profile]);
	}

	async updateProfile(profile: IUserDataProfile, updateOptions: IUserDataProfileUpdateOptions): Promise<IUserDataProfile> {
		const result = await this.channel.call<UriDto<IUserDataProfile>>('updateProfile', [profile, updateOptions]);
		return reviveProfile(result, this.profilesHome.scheme);
	}

	resetWorkspaces(): Promise<void> {
		return this.channel.call('resetWorkspaces');
	}

	cleanUp(): Promise<void> {
		return this.channel.call('cleanUp');
	}

	cleanUpTransientProfiles(): Promise<void> {
		return this.channel.call('cleanUpTransientProfiles');
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataProfile/common/userDataProfileStorageService.ts]---
Location: vscode-main/src/vs/platform/userDataProfile/common/userDataProfileStorageService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableMap, MutableDisposable, isDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { IStorage, IStorageDatabase, Storage } from '../../../base/parts/storage/common/storage.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { AbstractStorageService, IStorageService, IStorageValueChangeEvent, StorageScope, StorageTarget, isProfileUsingDefaultStorage } from '../../storage/common/storage.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { IRemoteService } from '../../ipc/common/services.js';
import { ILogService } from '../../log/common/log.js';
import { ApplicationStorageDatabaseClient, ProfileStorageDatabaseClient } from '../../storage/common/storageIpc.js';
import { IUserDataProfile, IUserDataProfilesService, reviveProfile } from './userDataProfile.js';

export interface IProfileStorageValueChanges {
	readonly profile: IUserDataProfile;
	readonly changes: IStorageValueChangeEvent[];
}

export interface IProfileStorageChanges {
	readonly targetChanges: IUserDataProfile[];
	readonly valueChanges: IProfileStorageValueChanges[];
}

export interface IStorageValue {
	readonly value: string | undefined;
	readonly target: StorageTarget;
}

export const IUserDataProfileStorageService = createDecorator<IUserDataProfileStorageService>('IUserDataProfileStorageService');
export interface IUserDataProfileStorageService {
	readonly _serviceBrand: undefined;

	/**
	 * Emitted whenever data is updated or deleted in a profile storage or target of a profile storage entry changes
	 */
	readonly onDidChange: Event<IProfileStorageChanges>;

	/**
	 * Return the requested profile storage data
	 * @param profile The profile from which the data has to be read from
	 */
	readStorageData(profile: IUserDataProfile): Promise<Map<string, IStorageValue>>;

	/**
	 * Update the given profile storage data in the profile storage
	 * @param profile The profile to which the data has to be written to
	 * @param data Data that has to be updated
	 * @param target Storage target of the data
	 */
	updateStorageData(profile: IUserDataProfile, data: Map<string, string | undefined | null>, target: StorageTarget): Promise<void>;

	/**
	 * Calls a function with a storage service scoped to given profile.
	 */
	withProfileScopedStorageService<T>(profile: IUserDataProfile, fn: (storageService: IStorageService) => Promise<T>): Promise<T>;
}

export abstract class AbstractUserDataProfileStorageService extends Disposable implements IUserDataProfileStorageService {

	_serviceBrand: undefined;

	readonly abstract onDidChange: Event<IProfileStorageChanges>;

	private readonly storageServicesMap: DisposableMap<string, StorageService> | undefined;

	constructor(
		persistStorages: boolean,
		@IStorageService protected readonly storageService: IStorageService
	) {
		super();
		if (persistStorages) {
			this.storageServicesMap = this._register(new DisposableMap<string, StorageService>());
		}
	}

	async readStorageData(profile: IUserDataProfile): Promise<Map<string, IStorageValue>> {
		return this.withProfileScopedStorageService(profile, async storageService => this.getItems(storageService));
	}

	async updateStorageData(profile: IUserDataProfile, data: Map<string, string | undefined | null>, target: StorageTarget): Promise<void> {
		return this.withProfileScopedStorageService(profile, async storageService => this.writeItems(storageService, data, target));
	}

	async withProfileScopedStorageService<T>(profile: IUserDataProfile, fn: (storageService: IStorageService) => Promise<T>): Promise<T> {
		if (this.storageService.hasScope(profile)) {
			return fn(this.storageService);
		}

		let storageService = this.storageServicesMap?.get(profile.id);
		if (!storageService) {
			storageService = new StorageService(this.createStorageDatabase(profile));
			this.storageServicesMap?.set(profile.id, storageService);

			try {
				await storageService.initialize();
			} catch (error) {
				if (this.storageServicesMap?.has(profile.id)) {
					this.storageServicesMap.deleteAndDispose(profile.id);
				} else {
					storageService.dispose();
				}
				throw error;
			}
		}
		try {
			const result = await fn(storageService);
			await storageService.flush();
			return result;
		} finally {
			if (!this.storageServicesMap?.has(profile.id)) {
				storageService.dispose();
			}
		}
	}

	private getItems(storageService: IStorageService): Map<string, IStorageValue> {
		const result = new Map<string, IStorageValue>();
		const populate = (target: StorageTarget) => {
			for (const key of storageService.keys(StorageScope.PROFILE, target)) {
				result.set(key, { value: storageService.get(key, StorageScope.PROFILE), target });
			}
		};
		populate(StorageTarget.USER);
		populate(StorageTarget.MACHINE);
		return result;
	}

	private writeItems(storageService: IStorageService, items: Map<string, string | undefined | null>, target: StorageTarget): void {
		storageService.storeAll(Array.from(items.entries()).map(([key, value]) => ({ key, value, scope: StorageScope.PROFILE, target })), true);
	}

	protected abstract createStorageDatabase(profile: IUserDataProfile): Promise<IStorageDatabase>;
}

export class RemoteUserDataProfileStorageService extends AbstractUserDataProfileStorageService implements IUserDataProfileStorageService {

	private readonly _onDidChange: Emitter<IProfileStorageChanges>;
	readonly onDidChange: Event<IProfileStorageChanges>;

	constructor(
		persistStorages: boolean,
		private readonly remoteService: IRemoteService,
		userDataProfilesService: IUserDataProfilesService,
		storageService: IStorageService,
		logService: ILogService,
	) {
		super(persistStorages, storageService);

		const channel = remoteService.getChannel('profileStorageListener');
		const disposable = this._register(new MutableDisposable());
		this._onDidChange = this._register(new Emitter<IProfileStorageChanges>({
			// Start listening to profile storage changes only when someone is listening
			onWillAddFirstListener: () => {
				disposable.value = channel.listen<IProfileStorageChanges>('onDidChange')(e => {
					logService.trace('profile storage changes', e);
					this._onDidChange.fire({
						targetChanges: e.targetChanges.map(profile => reviveProfile(profile, userDataProfilesService.profilesHome.scheme)),
						valueChanges: e.valueChanges.map(e => ({ ...e, profile: reviveProfile(e.profile, userDataProfilesService.profilesHome.scheme) }))
					});
				});
			},
			// Stop listening to profile storage changes when no one is listening
			onDidRemoveLastListener: () => disposable.value = undefined
		}));
		this.onDidChange = this._onDidChange.event;
	}

	protected async createStorageDatabase(profile: IUserDataProfile): Promise<IStorageDatabase> {
		const storageChannel = this.remoteService.getChannel('storage');
		return isProfileUsingDefaultStorage(profile) ? new ApplicationStorageDatabaseClient(storageChannel) : new ProfileStorageDatabaseClient(storageChannel, profile);
	}
}

class StorageService extends AbstractStorageService {

	private profileStorage: IStorage | undefined;

	constructor(private readonly profileStorageDatabase: Promise<IStorageDatabase>) {
		super({ flushInterval: 100 });
	}

	protected async doInitialize(): Promise<void> {
		const profileStorageDatabase = await this.profileStorageDatabase;
		const profileStorage = new Storage(profileStorageDatabase);
		this._register(profileStorage.onDidChangeStorage(e => {
			this.emitDidChangeValue(StorageScope.PROFILE, e);
		}));
		this._register(toDisposable(() => {
			profileStorage.close();
			profileStorage.dispose();
			if (isDisposable(profileStorageDatabase)) {
				profileStorageDatabase.dispose();
			}
		}));
		this.profileStorage = profileStorage;
		return this.profileStorage.init();
	}

	protected getStorage(scope: StorageScope): IStorage | undefined {
		return scope === StorageScope.PROFILE ? this.profileStorage : undefined;
	}

	protected getLogDetails(): string | undefined { return undefined; }
	protected async switchToProfile(): Promise<void> { }
	protected async switchToWorkspace(): Promise<void> { }
	hasScope() { return false; }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataProfile/electron-browser/userDataProfileStorageService.ts]---
Location: vscode-main/src/vs/platform/userDataProfile/electron-browser/userDataProfileStorageService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IUserDataProfileStorageService, RemoteUserDataProfileStorageService } from '../common/userDataProfileStorageService.js';
import { InstantiationType, registerSingleton } from '../../instantiation/common/extensions.js';
import { IStorageService } from '../../storage/common/storage.js';
import { ILogService } from '../../log/common/log.js';
import { IUserDataProfilesService } from '../common/userDataProfile.js';
import { IMainProcessService } from '../../ipc/common/mainProcessService.js';

export class NativeUserDataProfileStorageService extends RemoteUserDataProfileStorageService {

	constructor(
		@IMainProcessService mainProcessService: IMainProcessService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IStorageService storageService: IStorageService,
		@ILogService logService: ILogService,
	) {
		super(false, mainProcessService, userDataProfilesService, storageService, logService);
	}
}

registerSingleton(IUserDataProfileStorageService, NativeUserDataProfileStorageService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataProfile/electron-main/userDataProfile.ts]---
Location: vscode-main/src/vs/platform/userDataProfile/electron-main/userDataProfile.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { INativeEnvironmentService } from '../../environment/common/environment.js';
import { IFileService } from '../../files/common/files.js';
import { refineServiceDecorator } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { IUserDataProfilesService, WillCreateProfileEvent, WillRemoveProfileEvent, IUserDataProfile } from '../common/userDataProfile.js';
import { UserDataProfilesService } from '../node/userDataProfile.js';
import { IAnyWorkspaceIdentifier, IEmptyWorkspaceIdentifier } from '../../workspace/common/workspace.js';
import { IStateService } from '../../state/node/state.js';

export const IUserDataProfilesMainService = refineServiceDecorator<IUserDataProfilesService, IUserDataProfilesMainService>(IUserDataProfilesService);
export interface IUserDataProfilesMainService extends IUserDataProfilesService {
	getProfileForWorkspace(workspaceIdentifier: IAnyWorkspaceIdentifier): IUserDataProfile | undefined;
	unsetWorkspace(workspaceIdentifier: IAnyWorkspaceIdentifier, transient?: boolean): void;
	getAssociatedEmptyWindows(): IEmptyWorkspaceIdentifier[];
	readonly onWillCreateProfile: Event<WillCreateProfileEvent>;
	readonly onWillRemoveProfile: Event<WillRemoveProfileEvent>;
}

export class UserDataProfilesMainService extends UserDataProfilesService implements IUserDataProfilesMainService {

	constructor(
		@IStateService stateService: IStateService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@INativeEnvironmentService environmentService: INativeEnvironmentService,
		@IFileService fileService: IFileService,
		@ILogService logService: ILogService,
	) {
		super(stateService, uriIdentityService, environmentService, fileService, logService);
	}

	getAssociatedEmptyWindows(): IEmptyWorkspaceIdentifier[] {
		const emptyWindows: IEmptyWorkspaceIdentifier[] = [];
		for (const id of this.profilesObject.emptyWindows.keys()) {
			emptyWindows.push({ id });
		}
		return emptyWindows;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataProfile/electron-main/userDataProfilesHandler.ts]---
Location: vscode-main/src/vs/platform/userDataProfile/electron-main/userDataProfilesHandler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../base/common/lifecycle.js';
import { ILifecycleMainService, } from '../../lifecycle/electron-main/lifecycleMainService.js';
import { ICodeWindow, LoadReason } from '../../window/electron-main/window.js';
import { IUserDataProfilesMainService } from './userDataProfile.js';
import { IAnyWorkspaceIdentifier, toWorkspaceIdentifier } from '../../workspace/common/workspace.js';
import { RunOnceScheduler } from '../../../base/common/async.js';
import { IWindowsMainService } from '../../windows/electron-main/windows.js';

export class UserDataProfilesHandler extends Disposable {

	constructor(
		@ILifecycleMainService lifecycleMainService: ILifecycleMainService,
		@IUserDataProfilesMainService private readonly userDataProfilesService: IUserDataProfilesMainService,
		@IWindowsMainService private readonly windowsMainService: IWindowsMainService,
	) {
		super();
		this._register(lifecycleMainService.onWillLoadWindow(e => {
			if (e.reason === LoadReason.LOAD) {
				this.unsetProfileForWorkspace(e.window);
			}
		}));
		this._register(lifecycleMainService.onBeforeCloseWindow(window => this.unsetProfileForWorkspace(window)));
		this._register(new RunOnceScheduler(() => this.cleanUpEmptyWindowAssociations(), 30 * 1000 /* after 30s */)).schedule();
	}

	private async unsetProfileForWorkspace(window: ICodeWindow): Promise<void> {
		const workspace = this.getWorkspace(window);
		const profile = this.userDataProfilesService.getProfileForWorkspace(workspace);
		if (profile?.isTransient) {
			this.userDataProfilesService.unsetWorkspace(workspace, profile.isTransient);
			if (profile.isTransient) {
				await this.userDataProfilesService.cleanUpTransientProfiles();
			}
		}
	}

	private getWorkspace(window: ICodeWindow): IAnyWorkspaceIdentifier {
		return window.openedWorkspace ?? toWorkspaceIdentifier(window.backupPath, window.isExtensionDevelopmentHost);
	}

	private cleanUpEmptyWindowAssociations(): void {
		const associatedEmptyWindows = this.userDataProfilesService.getAssociatedEmptyWindows();
		if (associatedEmptyWindows.length === 0) {
			return;
		}
		const openedWorkspaces = this.windowsMainService.getWindows().map(window => this.getWorkspace(window));
		for (const associatedEmptyWindow of associatedEmptyWindows) {
			if (openedWorkspaces.some(openedWorkspace => openedWorkspace.id === associatedEmptyWindow.id)) {
				continue;
			}
			this.userDataProfilesService.unsetWorkspace(associatedEmptyWindow, false);
		}
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataProfile/electron-main/userDataProfileStorageIpc.ts]---
Location: vscode-main/src/vs/platform/userDataProfile/electron-main/userDataProfileStorageIpc.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable, MutableDisposable } from '../../../base/common/lifecycle.js';
import { IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { ILogService } from '../../log/common/log.js';
import { IProfileStorageChanges, IProfileStorageValueChanges } from '../common/userDataProfileStorageService.js';
import { loadKeyTargets, StorageScope, TARGET_KEY } from '../../storage/common/storage.js';
import { IBaseSerializableStorageRequest } from '../../storage/common/storageIpc.js';
import { IStorageMain } from '../../storage/electron-main/storageMain.js';
import { IStorageMainService } from '../../storage/electron-main/storageMainService.js';
import { IUserDataProfile, IUserDataProfilesService } from '../common/userDataProfile.js';

export class ProfileStorageChangesListenerChannel extends Disposable implements IServerChannel {

	private readonly _onDidChange: Emitter<IProfileStorageChanges>;

	constructor(
		private readonly storageMainService: IStorageMainService,
		private readonly userDataProfilesService: IUserDataProfilesService,
		private readonly logService: ILogService
	) {
		super();
		const disposable = this._register(new MutableDisposable<IDisposable>());
		this._onDidChange = this._register(new Emitter<IProfileStorageChanges>(
			{
				// Start listening to profile storage changes only when someone is listening
				onWillAddFirstListener: () => disposable.value = this.registerStorageChangeListeners(),
				// Stop listening to profile storage changes when no one is listening
				onDidRemoveLastListener: () => disposable.value = undefined
			}
		));
	}

	private registerStorageChangeListeners(): IDisposable {
		this.logService.debug('ProfileStorageChangesListenerChannel#registerStorageChangeListeners');
		const disposables = new DisposableStore();
		disposables.add(Event.debounce(this.storageMainService.applicationStorage.onDidChangeStorage, (keys: string[] | undefined, e) => {
			if (keys) {
				keys.push(e.key);
			} else {
				keys = [e.key];
			}
			return keys;
		}, 100)(keys => this.onDidChangeApplicationStorage(keys)));
		disposables.add(Event.debounce(this.storageMainService.onDidChangeProfileStorage, (changes: Map<string, { profile: IUserDataProfile; keys: string[]; storage: IStorageMain }> | undefined, e) => {
			if (!changes) {
				changes = new Map<string, { profile: IUserDataProfile; keys: string[]; storage: IStorageMain }>();
			}
			let profileChanges = changes.get(e.profile.id);
			if (!profileChanges) {
				changes.set(e.profile.id, profileChanges = { profile: e.profile, keys: [], storage: e.storage });
			}
			profileChanges.keys.push(e.key);
			return changes;
		}, 100)(keys => this.onDidChangeProfileStorage(keys)));
		return disposables;
	}

	private onDidChangeApplicationStorage(keys: string[]): void {
		const targetChangedProfiles: IUserDataProfile[] = keys.includes(TARGET_KEY) ? [this.userDataProfilesService.defaultProfile] : [];
		const profileStorageValueChanges: IProfileStorageValueChanges[] = [];
		keys = keys.filter(key => key !== TARGET_KEY);
		if (keys.length) {
			const keyTargets = loadKeyTargets(this.storageMainService.applicationStorage.storage);
			profileStorageValueChanges.push({ profile: this.userDataProfilesService.defaultProfile, changes: keys.map(key => ({ key, scope: StorageScope.PROFILE, target: keyTargets[key] })) });
		}
		this.triggerEvents(targetChangedProfiles, profileStorageValueChanges);
	}

	private onDidChangeProfileStorage(changes: Map<string, { profile: IUserDataProfile; keys: string[]; storage: IStorageMain }>): void {
		const targetChangedProfiles: IUserDataProfile[] = [];
		const profileStorageValueChanges = new Map<string, IProfileStorageValueChanges>();
		for (const [profileId, profileChanges] of changes.entries()) {
			if (profileChanges.keys.includes(TARGET_KEY)) {
				targetChangedProfiles.push(profileChanges.profile);
			}
			const keys = profileChanges.keys.filter(key => key !== TARGET_KEY);
			if (keys.length) {
				const keyTargets = loadKeyTargets(profileChanges.storage.storage);
				profileStorageValueChanges.set(profileId, { profile: profileChanges.profile, changes: keys.map(key => ({ key, scope: StorageScope.PROFILE, target: keyTargets[key] })) });
			}
		}
		this.triggerEvents(targetChangedProfiles, [...profileStorageValueChanges.values()]);
	}

	private triggerEvents(targetChanges: IUserDataProfile[], valueChanges: IProfileStorageValueChanges[]): void {
		if (targetChanges.length || valueChanges.length) {
			this._onDidChange.fire({ valueChanges, targetChanges });
		}
	}

	listen(_: unknown, event: string, arg: IBaseSerializableStorageRequest): Event<any> {
		switch (event) {
			case 'onDidChange': return this._onDidChange.event;
		}
		throw new Error(`[ProfileStorageChangesListenerChannel] Event not found: ${event}`);
	}

	async call(_: unknown, command: string): Promise<any> {
		throw new Error(`Call not found: ${command}`);
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataProfile/node/userDataProfile.ts]---
Location: vscode-main/src/vs/platform/userDataProfile/node/userDataProfile.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI, UriDto } from '../../../base/common/uri.js';
import { INativeEnvironmentService } from '../../environment/common/environment.js';
import { IFileService } from '../../files/common/files.js';
import { ILogService } from '../../log/common/log.js';
import { IStateReadService, IStateService } from '../../state/node/state.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { IUserDataProfilesService, UserDataProfilesService as BaseUserDataProfilesService, StoredUserDataProfile, StoredProfileAssociations } from '../common/userDataProfile.js';
import { isString } from '../../../base/common/types.js';
import { SaveStrategy, StateService } from '../../state/node/stateService.js';

type StoredUserDataProfileState = StoredUserDataProfile & { location: URI | string };

export class UserDataProfilesReadonlyService extends BaseUserDataProfilesService implements IUserDataProfilesService {

	constructor(
		@IStateReadService private readonly stateReadonlyService: IStateReadService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@INativeEnvironmentService private readonly nativeEnvironmentService: INativeEnvironmentService,
		@IFileService fileService: IFileService,
		@ILogService logService: ILogService,
	) {
		super(nativeEnvironmentService, fileService, uriIdentityService, logService);
	}

	protected override getStoredProfiles(): StoredUserDataProfile[] {
		const storedProfilesState = this.stateReadonlyService.getItem<UriDto<StoredUserDataProfileState>[]>(UserDataProfilesReadonlyService.PROFILES_KEY, []);
		return storedProfilesState.map(p => ({ ...p, location: isString(p.location) ? this.uriIdentityService.extUri.joinPath(this.profilesHome, p.location) : URI.revive(p.location) }));
	}

	protected override getStoredProfileAssociations(): StoredProfileAssociations {
		return this.stateReadonlyService.getItem<StoredProfileAssociations>(UserDataProfilesReadonlyService.PROFILE_ASSOCIATIONS_KEY, {});
	}

	protected override getDefaultProfileExtensionsLocation(): URI {
		return this.uriIdentityService.extUri.joinPath(URI.file(this.nativeEnvironmentService.extensionsPath).with({ scheme: this.profilesHome.scheme }), 'extensions.json');
	}

}

export class UserDataProfilesService extends UserDataProfilesReadonlyService implements IUserDataProfilesService {

	constructor(
		@IStateService protected readonly stateService: IStateService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@INativeEnvironmentService environmentService: INativeEnvironmentService,
		@IFileService fileService: IFileService,
		@ILogService logService: ILogService,
	) {
		super(stateService, uriIdentityService, environmentService, fileService, logService);
	}

	protected override saveStoredProfiles(storedProfiles: StoredUserDataProfile[]): void {
		if (storedProfiles.length) {
			this.stateService.setItem(UserDataProfilesService.PROFILES_KEY, storedProfiles.map(profile => ({ ...profile, location: this.uriIdentityService.extUri.basename(profile.location) })));
		} else {
			this.stateService.removeItem(UserDataProfilesService.PROFILES_KEY);
		}
	}

	protected override saveStoredProfileAssociations(storedProfileAssociations: StoredProfileAssociations): void {
		if (storedProfileAssociations.emptyWindows || storedProfileAssociations.workspaces) {
			this.stateService.setItem(UserDataProfilesService.PROFILE_ASSOCIATIONS_KEY, storedProfileAssociations);
		} else {
			this.stateService.removeItem(UserDataProfilesService.PROFILE_ASSOCIATIONS_KEY);
		}
	}
}

export class ServerUserDataProfilesService extends UserDataProfilesService implements IUserDataProfilesService {

	constructor(
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@INativeEnvironmentService environmentService: INativeEnvironmentService,
		@IFileService fileService: IFileService,
		@ILogService logService: ILogService,
	) {
		super(new StateService(SaveStrategy.IMMEDIATE, environmentService, logService, fileService), uriIdentityService, environmentService, fileService, logService);
	}

	override async init(): Promise<void> {
		await (this.stateService as StateService).init();
		return super.init();
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataProfile/node/userDataProfileStorageService.ts]---
Location: vscode-main/src/vs/platform/userDataProfile/node/userDataProfileStorageService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStorageService } from '../../storage/common/storage.js';
import { ILogService } from '../../log/common/log.js';
import { IUserDataProfilesService } from '../common/userDataProfile.js';
import { IMainProcessService } from '../../ipc/common/mainProcessService.js';
import { RemoteUserDataProfileStorageService } from '../common/userDataProfileStorageService.js';

export class SharedProcessUserDataProfileStorageService extends RemoteUserDataProfileStorageService {

	constructor(
		@IMainProcessService mainProcessService: IMainProcessService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IStorageService storageService: IStorageService,
		@ILogService logService: ILogService,
	) {
		super(true, mainProcessService, userDataProfilesService, storageService, logService);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataProfile/test/common/userDataProfileService.test.ts]---
Location: vscode-main/src/vs/platform/userDataProfile/test/common/userDataProfileService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { FileService } from '../../../files/common/fileService.js';
import { NullLogService } from '../../../log/common/log.js';
import { Schemas } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import { joinPath } from '../../../../base/common/resources.js';
import { InMemoryFileSystemProvider } from '../../../files/common/inMemoryFilesystemProvider.js';
import { AbstractNativeEnvironmentService } from '../../../environment/common/environmentService.js';
import product from '../../../product/common/product.js';
import { InMemoryUserDataProfilesService, UserDataProfilesService } from '../../common/userDataProfile.js';
import { UriIdentityService } from '../../../uriIdentity/common/uriIdentityService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { Event } from '../../../../base/common/event.js';

const ROOT = URI.file('tests').with({ scheme: 'vscode-tests' });

class TestEnvironmentService extends AbstractNativeEnvironmentService {
	constructor(private readonly _appSettingsHome: URI) {
		super(Object.create(null), Object.create(null), { _serviceBrand: undefined, ...product });
	}
	override get userRoamingDataHome() { return this._appSettingsHome.with({ scheme: Schemas.vscodeUserData }); }
	override get cacheHome() { return this.userRoamingDataHome; }
}

suite('UserDataProfileService (Common)', () => {

	const disposables = ensureNoDisposablesAreLeakedInTestSuite();
	let testObject: UserDataProfilesService;
	let environmentService: TestEnvironmentService;

	setup(async () => {
		const logService = new NullLogService();
		const fileService = disposables.add(new FileService(logService));
		const fileSystemProvider = disposables.add(new InMemoryFileSystemProvider());
		disposables.add(fileService.registerProvider(ROOT.scheme, fileSystemProvider));
		disposables.add(fileService.registerProvider(Schemas.vscodeUserData, fileSystemProvider));

		environmentService = new TestEnvironmentService(joinPath(ROOT, 'User'));
		testObject = disposables.add(new InMemoryUserDataProfilesService(environmentService, fileService, disposables.add(new UriIdentityService(fileService)), logService));
	});


	test('default profile', () => {
		assert.strictEqual(testObject.defaultProfile.isDefault, true);
		assert.strictEqual(testObject.defaultProfile.useDefaultFlags, undefined);
		assert.strictEqual(testObject.defaultProfile.location.toString(), environmentService.userRoamingDataHome.toString());
		assert.strictEqual(testObject.defaultProfile.globalStorageHome.toString(), joinPath(environmentService.userRoamingDataHome, 'globalStorage').toString());
		assert.strictEqual(testObject.defaultProfile.keybindingsResource.toString(), joinPath(environmentService.userRoamingDataHome, 'keybindings.json').toString());
		assert.strictEqual(testObject.defaultProfile.settingsResource.toString(), joinPath(environmentService.userRoamingDataHome, 'settings.json').toString());
		assert.strictEqual(testObject.defaultProfile.snippetsHome.toString(), joinPath(environmentService.userRoamingDataHome, 'snippets').toString());
		assert.strictEqual(testObject.defaultProfile.tasksResource.toString(), joinPath(environmentService.userRoamingDataHome, 'tasks.json').toString());
		assert.strictEqual(testObject.defaultProfile.extensionsResource.toString(), joinPath(environmentService.userRoamingDataHome, 'extensions.json').toString());
	});

	test('profiles always include default profile', () => {
		assert.deepStrictEqual(testObject.profiles.length, 1);
		assert.deepStrictEqual(testObject.profiles[0].isDefault, true);
	});

	test('create profile with id', async () => {
		const profile = await testObject.createProfile('id', 'name');
		assert.deepStrictEqual(testObject.profiles.length, 2);
		assert.deepStrictEqual(profile.id, 'id');
		assert.deepStrictEqual(profile.name, 'name');
		assert.deepStrictEqual(!!profile.isTransient, false);
		assert.deepStrictEqual(testObject.profiles[1].id, profile.id);
		assert.deepStrictEqual(testObject.profiles[1].name, profile.name);
	});

	test('create profile with id, name and transient', async () => {
		const profile = await testObject.createProfile('id', 'name', { transient: true });
		assert.deepStrictEqual(testObject.profiles.length, 2);
		assert.deepStrictEqual(profile.id, 'id');
		assert.deepStrictEqual(profile.name, 'name');
		assert.deepStrictEqual(!!profile.isTransient, true);
		assert.deepStrictEqual(testObject.profiles[1].id, profile.id);
	});

	test('create transient profiles', async () => {
		const profile1 = await testObject.createTransientProfile();
		const profile2 = await testObject.createTransientProfile();
		const profile3 = await testObject.createTransientProfile();
		const profile4 = await testObject.createProfile('id', 'name', { transient: true });

		assert.deepStrictEqual(testObject.profiles.length, 5);
		assert.deepStrictEqual(profile1.name, 'Temp 1');
		assert.deepStrictEqual(profile1.isTransient, true);
		assert.deepStrictEqual(testObject.profiles[1].id, profile1.id);
		assert.deepStrictEqual(profile2.name, 'Temp 2');
		assert.deepStrictEqual(profile2.isTransient, true);
		assert.deepStrictEqual(testObject.profiles[2].id, profile2.id);
		assert.deepStrictEqual(profile3.name, 'Temp 3');
		assert.deepStrictEqual(profile3.isTransient, true);
		assert.deepStrictEqual(testObject.profiles[3].id, profile3.id);
		assert.deepStrictEqual(profile4.name, 'name');
		assert.deepStrictEqual(profile4.isTransient, true);
		assert.deepStrictEqual(testObject.profiles[4].id, profile4.id);
	});

	test('create transient profile when a normal profile with Temp is already created', async () => {
		await testObject.createNamedProfile('Temp 1');
		const profile1 = await testObject.createTransientProfile();

		assert.deepStrictEqual(profile1.name, 'Temp 2');
		assert.deepStrictEqual(profile1.isTransient, true);
	});

	test('profiles include default profile with extension resource defined when transiet prrofile is created', async () => {
		await testObject.createTransientProfile();

		assert.deepStrictEqual(testObject.profiles.length, 2);
		assert.deepStrictEqual(testObject.profiles[0].isDefault, true);
	});

	test('profiles include default profile with extension resource undefined when transiet prrofile is removed', async () => {
		const profile = await testObject.createTransientProfile();
		await testObject.removeProfile(profile);

		assert.deepStrictEqual(testObject.profiles.length, 1);
		assert.deepStrictEqual(testObject.profiles[0].isDefault, true);
	});

	test('update named profile', async () => {
		const profile = await testObject.createNamedProfile('name');
		await testObject.updateProfile(profile, { name: 'name changed' });

		assert.deepStrictEqual(testObject.profiles.length, 2);
		assert.deepStrictEqual(testObject.profiles[1].name, 'name changed');
		assert.deepStrictEqual(!!testObject.profiles[1].isTransient, false);
		assert.deepStrictEqual(testObject.profiles[1].id, profile.id);
	});

	test('persist transient profile', async () => {
		const profile = await testObject.createTransientProfile();
		await testObject.updateProfile(profile, { name: 'saved', transient: false });

		assert.deepStrictEqual(testObject.profiles.length, 2);
		assert.deepStrictEqual(testObject.profiles[1].name, 'saved');
		assert.deepStrictEqual(!!testObject.profiles[1].isTransient, false);
		assert.deepStrictEqual(testObject.profiles[1].id, profile.id);
	});

	test('persist transient profile (2)', async () => {
		const profile = await testObject.createProfile('id', 'name', { transient: true });
		await testObject.updateProfile(profile, { name: 'saved', transient: false });

		assert.deepStrictEqual(testObject.profiles.length, 2);
		assert.deepStrictEqual(testObject.profiles[1].name, 'saved');
		assert.deepStrictEqual(!!testObject.profiles[1].isTransient, false);
		assert.deepStrictEqual(testObject.profiles[1].id, profile.id);
	});

	test('save transient profile', async () => {
		const profile = await testObject.createTransientProfile();
		await testObject.updateProfile(profile, { name: 'saved' });

		assert.deepStrictEqual(testObject.profiles.length, 2);
		assert.deepStrictEqual(testObject.profiles[1].name, 'saved');
		assert.deepStrictEqual(!!testObject.profiles[1].isTransient, true);
		assert.deepStrictEqual(testObject.profiles[1].id, profile.id);
	});

	test('profile using default profile for settings', async () => {
		const profile = await testObject.createNamedProfile('name', { useDefaultFlags: { settings: true } });

		assert.strictEqual(profile.isDefault, false);
		assert.deepStrictEqual(profile.useDefaultFlags, { settings: true });
		assert.strictEqual(profile.settingsResource.toString(), testObject.defaultProfile.settingsResource.toString());
	});

	test('profile using default profile for keybindings', async () => {
		const profile = await testObject.createNamedProfile('name', { useDefaultFlags: { keybindings: true } });

		assert.strictEqual(profile.isDefault, false);
		assert.deepStrictEqual(profile.useDefaultFlags, { keybindings: true });
		assert.strictEqual(profile.keybindingsResource.toString(), testObject.defaultProfile.keybindingsResource.toString());
	});

	test('profile using default profile for snippets', async () => {
		const profile = await testObject.createNamedProfile('name', { useDefaultFlags: { snippets: true } });

		assert.strictEqual(profile.isDefault, false);
		assert.deepStrictEqual(profile.useDefaultFlags, { snippets: true });
		assert.strictEqual(profile.snippetsHome.toString(), testObject.defaultProfile.snippetsHome.toString());
	});

	test('profile using default profile for tasks', async () => {
		const profile = await testObject.createNamedProfile('name', { useDefaultFlags: { tasks: true } });

		assert.strictEqual(profile.isDefault, false);
		assert.deepStrictEqual(profile.useDefaultFlags, { tasks: true });
		assert.strictEqual(profile.tasksResource.toString(), testObject.defaultProfile.tasksResource.toString());
	});

	test('profile using default profile for global state', async () => {
		const profile = await testObject.createNamedProfile('name', { useDefaultFlags: { globalState: true } });

		assert.strictEqual(profile.isDefault, false);
		assert.deepStrictEqual(profile.useDefaultFlags, { globalState: true });
		assert.strictEqual(profile.globalStorageHome.toString(), testObject.defaultProfile.globalStorageHome.toString());
	});

	test('profile using default profile for extensions', async () => {
		const profile = await testObject.createNamedProfile('name', { useDefaultFlags: { extensions: true } });

		assert.strictEqual(profile.isDefault, false);
		assert.deepStrictEqual(profile.useDefaultFlags, { extensions: true });
		assert.strictEqual(profile.extensionsResource.toString(), testObject.defaultProfile.extensionsResource.toString());
	});

	test('update profile using default profile for keybindings', async () => {
		let profile = await testObject.createNamedProfile('name');
		profile = await testObject.updateProfile(profile, { useDefaultFlags: { keybindings: true } });

		assert.strictEqual(profile.isDefault, false);
		assert.deepStrictEqual(profile.useDefaultFlags, { keybindings: true });
		assert.strictEqual(profile.keybindingsResource.toString(), testObject.defaultProfile.keybindingsResource.toString());
	});

	test('create profile with a workspace associates it to the profile', async () => {
		const workspace = URI.file('/workspace1');
		const profile = await testObject.createProfile('id', 'name', {}, { id: workspace.path, uri: workspace });
		assert.deepStrictEqual(profile.workspaces?.length, 1);
		assert.deepStrictEqual(profile.workspaces?.[0].toString(), workspace.toString());
	});

	test('associate workspace to a profile should update workspaces', async () => {
		const profile = await testObject.createProfile('id', 'name', {});
		const workspace = URI.file('/workspace1');

		const promise = Event.toPromise(testObject.onDidChangeProfiles);
		await testObject.setProfileForWorkspace({ id: workspace.path, uri: workspace }, profile);

		const actual = await promise;
		assert.deepStrictEqual(actual.added.length, 0);
		assert.deepStrictEqual(actual.removed.length, 0);
		assert.deepStrictEqual(actual.updated.length, 1);

		assert.deepStrictEqual(actual.updated[0].id, profile.id);
		assert.deepStrictEqual(actual.updated[0].workspaces?.length, 1);
		assert.deepStrictEqual(actual.updated[0].workspaces[0].toString(), workspace.toString());
	});

	test('associate same workspace to a profile should not duplicate', async () => {
		const workspace = URI.file('/workspace1');
		const profile = await testObject.createProfile('id', 'name', { workspaces: [workspace] });

		await testObject.setProfileForWorkspace({ id: workspace.path, uri: workspace }, profile);

		assert.deepStrictEqual(testObject.profiles[1].workspaces?.length, 1);
		assert.deepStrictEqual(testObject.profiles[1].workspaces[0].toString(), workspace.toString());
	});

	test('associate workspace to another profile should update workspaces', async () => {
		const workspace = URI.file('/workspace1');
		const profile1 = await testObject.createProfile('id', 'name', {}, { id: workspace.path, uri: workspace });
		const profile2 = await testObject.createProfile('id1', 'name1');

		const promise = Event.toPromise(testObject.onDidChangeProfiles);
		await testObject.setProfileForWorkspace({ id: workspace.path, uri: workspace }, profile2);

		const actual = await promise;
		assert.deepStrictEqual(actual.added.length, 0);
		assert.deepStrictEqual(actual.removed.length, 0);
		assert.deepStrictEqual(actual.updated.length, 2);

		assert.deepStrictEqual(actual.updated[0].id, profile1.id);
		assert.deepStrictEqual(actual.updated[0].workspaces, undefined);

		assert.deepStrictEqual(actual.updated[1].id, profile2.id);
		assert.deepStrictEqual(actual.updated[1].workspaces?.length, 1);
		assert.deepStrictEqual(actual.updated[1].workspaces[0].toString(), workspace.toString());
	});

	test('unassociate workspace to a profile should update workspaces', async () => {
		const workspace = URI.file('/workspace1');
		const profile = await testObject.createProfile('id', 'name', {}, { id: workspace.path, uri: workspace });

		const promise = Event.toPromise(testObject.onDidChangeProfiles);
		testObject.unsetWorkspace({ id: workspace.path, uri: workspace });

		const actual = await promise;
		assert.deepStrictEqual(actual.added.length, 0);
		assert.deepStrictEqual(actual.removed.length, 0);
		assert.deepStrictEqual(actual.updated.length, 1);

		assert.deepStrictEqual(actual.updated[0].id, profile.id);
		assert.deepStrictEqual(actual.updated[0].workspaces, undefined);
	});

	test('update profile workspaces - add workspace', async () => {
		let profile = await testObject.createNamedProfile('name');
		const workspace = URI.file('/workspace1');
		profile = await testObject.updateProfile(profile, { workspaces: [workspace] });

		assert.deepStrictEqual(profile.workspaces?.length, 1);
		assert.deepStrictEqual(profile.workspaces[0].toString(), workspace.toString());
	});

	test('update profile workspaces - remove workspace', async () => {
		let profile = await testObject.createNamedProfile('name');
		const workspace = URI.file('/workspace1');
		profile = await testObject.updateProfile(profile, { workspaces: [workspace] });
		profile = await testObject.updateProfile(profile, { workspaces: [] });

		assert.deepStrictEqual(profile.workspaces, undefined);
	});

	test('update profile workspaces - replace workspace', async () => {
		let profile = await testObject.createNamedProfile('name');
		profile = await testObject.updateProfile(profile, { workspaces: [URI.file('/workspace1')] });

		const workspace = URI.file('/workspace2');
		profile = await testObject.updateProfile(profile, { workspaces: [workspace] });

		assert.deepStrictEqual(profile.workspaces?.length, 1);
		assert.deepStrictEqual(profile.workspaces[0].toString(), workspace.toString());
	});

	test('update default profile workspaces - add workspace', async () => {
		const workspace = URI.file('/workspace1');
		await testObject.updateProfile(testObject.defaultProfile, { workspaces: [workspace] });

		assert.deepStrictEqual(testObject.profiles.length, 1);
		assert.deepStrictEqual(testObject.profiles[0], testObject.defaultProfile);
		assert.deepStrictEqual(testObject.defaultProfile.isDefault, true);
		assert.deepStrictEqual(testObject.defaultProfile.workspaces?.length, 1);
		assert.deepStrictEqual(testObject.defaultProfile.workspaces[0].toString(), workspace.toString());
	});

	test('can create transient and persistent profiles with same name', async () => {
		const profile1 = await testObject.createNamedProfile('name', { transient: true });
		const profile2 = await testObject.createNamedProfile('name', { transient: true });
		const profile3 = await testObject.createNamedProfile('name');

		assert.deepStrictEqual(profile1.name, 'name');
		assert.deepStrictEqual(!!profile1.isTransient, true);
		assert.deepStrictEqual(profile2.name, 'name');
		assert.deepStrictEqual(!!profile2.isTransient, true);
		assert.deepStrictEqual(profile3.name, 'name');
		assert.deepStrictEqual(!!profile3.isTransient, false);
		assert.deepStrictEqual(testObject.profiles.length, 4);
		assert.deepStrictEqual(testObject.profiles[1].id, profile3.id);
		assert.deepStrictEqual(testObject.profiles[2].id, profile1.id);
		assert.deepStrictEqual(testObject.profiles[3].id, profile2.id);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataProfile/test/common/userDataProfileStorageService.test.ts]---
Location: vscode-main/src/vs/platform/userDataProfile/test/common/userDataProfileStorageService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Emitter, Event } from '../../../../base/common/event.js';
import { URI } from '../../../../base/common/uri.js';
import { InMemoryStorageDatabase, IStorageItemsChangeEvent, IUpdateRequest, Storage } from '../../../../base/parts/storage/common/storage.js';
import { AbstractUserDataProfileStorageService, IUserDataProfileStorageService } from '../../common/userDataProfileStorageService.js';
import { InMemoryStorageService, loadKeyTargets, StorageTarget, TARGET_KEY } from '../../../storage/common/storage.js';
import { IUserDataProfile, toUserDataProfile } from '../../common/userDataProfile.js';
import { runWithFakedTimers } from '../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

class TestStorageDatabase extends InMemoryStorageDatabase {

	private readonly _onDidChangeItemsExternal = new Emitter<IStorageItemsChangeEvent>();
	override readonly onDidChangeItemsExternal = this._onDidChangeItemsExternal.event;

	override async updateItems(request: IUpdateRequest): Promise<void> {
		await super.updateItems(request);
		if (request.insert || request.delete) {
			this._onDidChangeItemsExternal.fire({ changed: request.insert, deleted: request.delete });
		}
	}
}

export class TestUserDataProfileStorageService extends AbstractUserDataProfileStorageService implements IUserDataProfileStorageService {

	readonly onDidChange = Event.None;
	private databases = new Map<string, InMemoryStorageDatabase>();

	protected async createStorageDatabase(profile: IUserDataProfile): Promise<InMemoryStorageDatabase> {
		let database = this.databases.get(profile.id);
		if (!database) {
			this.databases.set(profile.id, database = new TestStorageDatabase());
		}
		return database;
	}

	setupStorageDatabase(profile: IUserDataProfile): Promise<InMemoryStorageDatabase> {
		return this.createStorageDatabase(profile);
	}

}

suite('ProfileStorageService', () => {

	const disposables = ensureNoDisposablesAreLeakedInTestSuite();
	const profile = toUserDataProfile('test', 'test', URI.file('foo'), URI.file('cache'));
	let testObject: TestUserDataProfileStorageService;
	let storage: Storage;

	setup(async () => {
		testObject = disposables.add(new TestUserDataProfileStorageService(false, disposables.add(new InMemoryStorageService())));
		storage = disposables.add(new Storage(await testObject.setupStorageDatabase(profile)));
		await storage.init();
	});


	test('read empty storage', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const actual = await testObject.readStorageData(profile);

		assert.strictEqual(actual.size, 0);
	}));

	test('read storage with data', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		storage.set('foo', 'bar');
		storage.set(TARGET_KEY, JSON.stringify({ foo: StorageTarget.USER }));
		await storage.flush();

		const actual = await testObject.readStorageData(profile);

		assert.strictEqual(actual.size, 1);
		assert.deepStrictEqual(actual.get('foo'), { 'value': 'bar', 'target': StorageTarget.USER });
	}));

	test('write in empty storage', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const data = new Map<string, string>();
		data.set('foo', 'bar');
		await testObject.updateStorageData(profile, data, StorageTarget.USER);

		assert.strictEqual(storage.items.size, 2);
		assert.deepStrictEqual(loadKeyTargets(storage), { foo: StorageTarget.USER });
		assert.strictEqual(storage.get('foo'), 'bar');
	}));

	test('write in storage with data', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		storage.set('foo', 'bar');
		storage.set(TARGET_KEY, JSON.stringify({ foo: StorageTarget.USER }));
		await storage.flush();

		const data = new Map<string, string>();
		data.set('abc', 'xyz');
		await testObject.updateStorageData(profile, data, StorageTarget.MACHINE);

		assert.strictEqual(storage.items.size, 3);
		assert.deepStrictEqual(loadKeyTargets(storage), { foo: StorageTarget.USER, abc: StorageTarget.MACHINE });
		assert.strictEqual(storage.get('foo'), 'bar');
		assert.strictEqual(storage.get('abc'), 'xyz');
	}));

	test('write in storage with data (insert, update, remove)', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		storage.set('foo', 'bar');
		storage.set('abc', 'xyz');
		storage.set(TARGET_KEY, JSON.stringify({ foo: StorageTarget.USER, abc: StorageTarget.MACHINE }));
		await storage.flush();

		const data = new Map<string, string | undefined>();
		data.set('foo', undefined);
		data.set('abc', 'def');
		data.set('var', 'const');
		await testObject.updateStorageData(profile, data, StorageTarget.USER);

		assert.strictEqual(storage.items.size, 3);
		assert.deepStrictEqual(loadKeyTargets(storage), { abc: StorageTarget.USER, var: StorageTarget.USER });
		assert.strictEqual(storage.get('abc'), 'def');
		assert.strictEqual(storage.get('var'), 'const');
	}));

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataProfile/test/electron-main/userDataProfileMainService.test.ts]---
Location: vscode-main/src/vs/platform/userDataProfile/test/electron-main/userDataProfileMainService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { FileService } from '../../../files/common/fileService.js';
import { NullLogService } from '../../../log/common/log.js';
import { Schemas } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import { joinPath } from '../../../../base/common/resources.js';
import { InMemoryFileSystemProvider } from '../../../files/common/inMemoryFilesystemProvider.js';
import { AbstractNativeEnvironmentService } from '../../../environment/common/environmentService.js';
import product from '../../../product/common/product.js';
import { UserDataProfilesMainService } from '../../electron-main/userDataProfile.js';
import { SaveStrategy, StateService } from '../../../state/node/stateService.js';
import { UriIdentityService } from '../../../uriIdentity/common/uriIdentityService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

const ROOT = URI.file('tests').with({ scheme: 'vscode-tests' });

class TestEnvironmentService extends AbstractNativeEnvironmentService {
	constructor(private readonly _appSettingsHome: URI) {
		super(Object.create(null), Object.create(null), { _serviceBrand: undefined, ...product });
	}
	override get userRoamingDataHome() { return this._appSettingsHome.with({ scheme: Schemas.vscodeUserData }); }
	override get extensionsPath() { return joinPath(this.userRoamingDataHome, 'extensions.json').path; }
	override get stateResource() { return joinPath(this.userRoamingDataHome, 'state.json'); }
	override get cacheHome() { return joinPath(this.userRoamingDataHome, 'cache'); }
}

suite('UserDataProfileMainService', () => {

	const disposables = ensureNoDisposablesAreLeakedInTestSuite();
	let testObject: UserDataProfilesMainService;
	let environmentService: TestEnvironmentService, stateService: StateService;

	setup(async () => {
		const logService = new NullLogService();
		const fileService = disposables.add(new FileService(logService));
		const fileSystemProvider = disposables.add(new InMemoryFileSystemProvider());
		disposables.add(fileService.registerProvider(Schemas.vscodeUserData, fileSystemProvider));

		environmentService = new TestEnvironmentService(joinPath(ROOT, 'User'));
		stateService = disposables.add(new StateService(SaveStrategy.DELAYED, environmentService, logService, fileService));

		testObject = disposables.add(new UserDataProfilesMainService(stateService, disposables.add(new UriIdentityService(fileService)), environmentService, fileService, logService));
		await stateService.init();
	});

	test('default profile', () => {
		assert.strictEqual(testObject.defaultProfile.isDefault, true);
	});

	test('profiles always include default profile', () => {
		assert.deepStrictEqual(testObject.profiles.length, 1);
		assert.deepStrictEqual(testObject.profiles[0].isDefault, true);
	});

	test('default profile when there are profiles', async () => {
		await testObject.createNamedProfile('test');
		assert.strictEqual(testObject.defaultProfile.isDefault, true);
	});

	test('default profile when profiles are removed', async () => {
		const profile = await testObject.createNamedProfile('test');
		await testObject.removeProfile(profile);
		assert.strictEqual(testObject.defaultProfile.isDefault, true);
	});

	test('when no profile is set', async () => {
		await testObject.createNamedProfile('profile1');

		assert.equal(testObject.getProfileForWorkspace({ id: 'id' }), undefined);
		assert.equal(testObject.getProfileForWorkspace({ id: 'id', configPath: environmentService.userRoamingDataHome }), undefined);
		assert.equal(testObject.getProfileForWorkspace({ id: 'id', uri: environmentService.userRoamingDataHome }), undefined);
	});

	test('set profile to a workspace', async () => {
		const workspace = { id: 'id', configPath: environmentService.userRoamingDataHome };
		const profile = await testObject.createNamedProfile('profile1');

		testObject.setProfileForWorkspace(workspace, profile);

		assert.strictEqual(testObject.getProfileForWorkspace(workspace)?.id, profile.id);
	});

	test('set profile to a folder', async () => {
		const workspace = { id: 'id', uri: environmentService.userRoamingDataHome };
		const profile = await testObject.createNamedProfile('profile1');

		testObject.setProfileForWorkspace(workspace, profile);

		assert.strictEqual(testObject.getProfileForWorkspace(workspace)?.id, profile.id);
	});

	test('set profile to a window', async () => {
		const workspace = { id: 'id' };
		const profile = await testObject.createNamedProfile('profile1');

		testObject.setProfileForWorkspace(workspace, profile);

		assert.strictEqual(testObject.getProfileForWorkspace(workspace)?.id, profile.id);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/abstractJsonSynchronizer.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/abstractJsonSynchronizer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { URI } from '../../../base/common/uri.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { IFileService } from '../../files/common/files.js';
import { IStorageService } from '../../storage/common/storage.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { IUserDataProfile } from '../../userDataProfile/common/userDataProfile.js';
import { AbstractFileSynchroniser, IAcceptResult, IFileResourcePreview, IMergeResult } from './abstractSynchronizer.js';
import { Change, IRemoteUserData, IUserDataSyncLocalStoreService, IUserDataSyncConfiguration, IUserDataSynchroniser, IUserDataSyncLogService, IUserDataSyncEnablementService, IUserDataSyncStoreService, USER_DATA_SYNC_SCHEME, SyncResource } from './userDataSync.js';

export interface IJsonResourcePreview extends IFileResourcePreview {
	previewResult: IMergeResult;
}

export abstract class AbstractJsonSynchronizer extends AbstractFileSynchroniser implements IUserDataSynchroniser {

	protected readonly version: number = 1;
	private readonly previewResource: URI;
	private readonly baseResource: URI;
	private readonly localResource: URI;
	private readonly remoteResource: URI;
	private readonly acceptedResource: URI;

	constructor(
		fileResource: URI,
		syncResourceMetadata: { syncResource: SyncResource; profile: IUserDataProfile },
		collection: string | undefined,
		previewFileName: string,
		@IFileService fileService: IFileService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@IStorageService storageService: IStorageService,
		@IUserDataSyncStoreService userDataSyncStoreService: IUserDataSyncStoreService,
		@IUserDataSyncLocalStoreService userDataSyncLocalStoreService: IUserDataSyncLocalStoreService,
		@IUserDataSyncEnablementService userDataSyncEnablementService: IUserDataSyncEnablementService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IUserDataSyncLogService logService: IUserDataSyncLogService,
		@IConfigurationService configurationService: IConfigurationService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
	) {
		super(fileResource, syncResourceMetadata, collection, fileService, environmentService, storageService, userDataSyncStoreService, userDataSyncLocalStoreService, userDataSyncEnablementService, telemetryService, logService, configurationService, uriIdentityService);

		this.previewResource = this.extUri.joinPath(this.syncPreviewFolder, previewFileName);
		this.baseResource = this.previewResource.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' });
		this.localResource = this.previewResource.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' });
		this.remoteResource = this.previewResource.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' });
		this.acceptedResource = this.previewResource.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' });
	}

	protected abstract getContentFromSyncContent(syncContent: string): string | null;
	protected abstract toSyncContent(content: string | null): object;

	protected async generateSyncPreview(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, isRemoteDataFromCurrentMachine: boolean, userDataSyncConfiguration: IUserDataSyncConfiguration): Promise<IJsonResourcePreview[]> {
		const remoteContent = remoteUserData.syncData ? this.getContentFromSyncContent(remoteUserData.syncData.content) : null;

		// Use remote data as last sync data if last sync data does not exist and remote data is from same machine
		lastSyncUserData = lastSyncUserData === null && isRemoteDataFromCurrentMachine ? remoteUserData : lastSyncUserData;
		const lastSyncContent: string | null = lastSyncUserData?.syncData ? this.getContentFromSyncContent(lastSyncUserData.syncData.content) : null;

		// Get file content last to get the latest
		const fileContent = await this.getLocalFileContent();

		let content: string | null = null;
		let hasLocalChanged: boolean = false;
		let hasRemoteChanged: boolean = false;
		let hasConflicts: boolean = false;

		if (remoteUserData.syncData) {
			const localContent = fileContent ? fileContent.value.toString() : null;
			if (!lastSyncContent // First time sync
				|| lastSyncContent !== localContent // Local has forwarded
				|| lastSyncContent !== remoteContent // Remote has forwarded
			) {
				this.logService.trace(`${this.syncResourceLogLabel}: Merging remote ${this.syncResource.syncResource} with local ${this.syncResource.syncResource}...`);
				const result = this.merge(localContent, remoteContent, lastSyncContent);
				content = result.content;
				hasConflicts = result.hasConflicts;
				hasLocalChanged = result.hasLocalChanged;
				hasRemoteChanged = result.hasRemoteChanged;
			}
		}

		// First time syncing to remote
		else if (fileContent) {
			this.logService.trace(`${this.syncResourceLogLabel}: Remote ${this.syncResource.syncResource} does not exist. Synchronizing ${this.syncResource.syncResource} for the first time.`);
			content = fileContent.value.toString();
			hasRemoteChanged = true;
		}

		const previewResult: IMergeResult = {
			content: hasConflicts ? lastSyncContent : content,
			localChange: hasLocalChanged ? fileContent ? Change.Modified : Change.Added : Change.None,
			remoteChange: hasRemoteChanged ? Change.Modified : Change.None,
			hasConflicts
		};

		const localContent = fileContent ? fileContent.value.toString() : null;
		return [{
			fileContent,

			baseResource: this.baseResource,
			baseContent: lastSyncContent,

			localResource: this.localResource,
			localContent,
			localChange: previewResult.localChange,

			remoteResource: this.remoteResource,
			remoteContent,
			remoteChange: previewResult.remoteChange,

			previewResource: this.previewResource,
			previewResult,
			acceptedResource: this.acceptedResource,
		}];
	}

	protected async hasRemoteChanged(lastSyncUserData: IRemoteUserData): Promise<boolean> {
		const lastSyncContent: string | null = lastSyncUserData?.syncData ? this.getContentFromSyncContent(lastSyncUserData.syncData.content) : null;
		if (lastSyncContent === null) {
			return true;
		}

		const fileContent = await this.getLocalFileContent();
		const localContent = fileContent ? fileContent.value.toString() : null;
		const result = this.merge(localContent, lastSyncContent, lastSyncContent);
		return result.hasLocalChanged || result.hasRemoteChanged;
	}

	protected async getMergeResult(resourcePreview: IJsonResourcePreview, token: CancellationToken): Promise<IMergeResult> {
		return resourcePreview.previewResult;
	}

	protected async getAcceptResult(resourcePreview: IJsonResourcePreview, resource: URI, content: string | null | undefined, token: CancellationToken): Promise<IAcceptResult> {
		/* Accept local resource */
		if (this.extUri.isEqual(resource, this.localResource)) {
			return {
				content: resourcePreview.fileContent ? resourcePreview.fileContent.value.toString() : null,
				localChange: Change.None,
				remoteChange: Change.Modified,
			};
		}

		/* Accept remote resource */
		if (this.extUri.isEqual(resource, this.remoteResource)) {
			return {
				content: resourcePreview.remoteContent,
				localChange: Change.Modified,
				remoteChange: Change.None,
			};
		}

		/* Accept preview resource */
		if (this.extUri.isEqual(resource, this.previewResource)) {
			if (content === undefined) {
				return {
					content: resourcePreview.previewResult.content,
					localChange: resourcePreview.previewResult.localChange,
					remoteChange: resourcePreview.previewResult.remoteChange,
				};
			} else {
				return {
					content,
					localChange: Change.Modified,
					remoteChange: Change.Modified,
				};
			}
		}

		throw new Error(`Invalid Resource: ${resource.toString()}`);
	}

	protected async applyResult(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, resourcePreviews: [IJsonResourcePreview, IAcceptResult][], force: boolean): Promise<void> {
		const { fileContent } = resourcePreviews[0][0];
		const { content, localChange, remoteChange } = resourcePreviews[0][1];

		if (localChange === Change.None && remoteChange === Change.None) {
			this.logService.info(`${this.syncResourceLogLabel}: No changes found during synchronizing ${this.syncResource.syncResource}.`);
		}

		if (localChange !== Change.None) {
			this.logService.trace(`${this.syncResourceLogLabel}: Updating local ${this.syncResource.syncResource}...`);
			if (fileContent) {
				await this.backupLocal(JSON.stringify(this.toSyncContent(fileContent.value.toString())));
			}
			if (content) {
				await this.updateLocalFileContent(content, fileContent, force);
			} else {
				await this.deleteLocalFile();
			}
			this.logService.info(`${this.syncResourceLogLabel}: Updated local ${this.syncResource.syncResource}`);
		}

		if (remoteChange !== Change.None) {
			this.logService.trace(`${this.syncResourceLogLabel}: Updating remote ${this.syncResource.syncResource}...`);
			const remoteContents = JSON.stringify(this.toSyncContent(content));
			remoteUserData = await this.updateRemoteUserData(remoteContents, force ? null : remoteUserData.ref);
			this.logService.info(`${this.syncResourceLogLabel}: Updated remote ${this.syncResource.syncResource}`);
		}

		// Delete the preview
		try {
			await this.fileService.del(this.previewResource);
		} catch (e) { /* ignore */ }

		if (lastSyncUserData?.ref !== remoteUserData.ref) {
			this.logService.trace(`${this.syncResourceLogLabel}: Updating last synchronized ${this.syncResource.syncResource}...`);
			await this.updateLastSyncUserData(remoteUserData);
			this.logService.info(`${this.syncResourceLogLabel}: Updated last synchronized ${this.syncResource.syncResource}`);
		}
	}

	async hasLocalData(): Promise<boolean> {
		return this.fileService.exists(this.file);
	}

	async resolveContent(uri: URI): Promise<string | null> {
		if (this.extUri.isEqual(this.remoteResource, uri)
			|| this.extUri.isEqual(this.baseResource, uri)
			|| this.extUri.isEqual(this.localResource, uri)
			|| this.extUri.isEqual(this.acceptedResource, uri)
		) {
			return this.resolvePreviewContent(uri);
		}
		return null;
	}

	private merge(originalLocalContent: string | null, originalRemoteContent: string | null, baseContent: string | null): {
		content: string | null;
		hasLocalChanged: boolean;
		hasRemoteChanged: boolean;
		hasConflicts: boolean;
	} {

		/* no changes */
		if (originalLocalContent === null && originalRemoteContent === null && baseContent === null) {
			return { content: null, hasLocalChanged: false, hasRemoteChanged: false, hasConflicts: false };
		}

		/* no changes */
		if (originalLocalContent === originalRemoteContent) {
			return { content: null, hasLocalChanged: false, hasRemoteChanged: false, hasConflicts: false };
		}

		const localForwarded = baseContent !== originalLocalContent;
		const remoteForwarded = baseContent !== originalRemoteContent;

		/* no changes */
		if (!localForwarded && !remoteForwarded) {
			return { content: null, hasLocalChanged: false, hasRemoteChanged: false, hasConflicts: false };
		}

		/* local has changed and remote has not */
		if (localForwarded && !remoteForwarded) {
			return { content: originalLocalContent, hasRemoteChanged: true, hasLocalChanged: false, hasConflicts: false };
		}

		/* remote has changed and local has not */
		if (remoteForwarded && !localForwarded) {
			return { content: originalRemoteContent, hasLocalChanged: true, hasRemoteChanged: false, hasConflicts: false };
		}

		return { content: originalLocalContent, hasLocalChanged: true, hasRemoteChanged: true, hasConflicts: true };
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/abstractSynchronizer.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/abstractSynchronizer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { equals } from '../../../base/common/arrays.js';
import { CancelablePromise, createCancelablePromise, ThrottledDelayer } from '../../../base/common/async.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { IStringDictionary } from '../../../base/common/collections.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { parse, ParseError } from '../../../base/common/json.js';
import { FormattingOptions } from '../../../base/common/jsonFormatter.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { IExtUri } from '../../../base/common/resources.js';
import { uppercaseFirstLetter } from '../../../base/common/strings.js';
import { isString, isUndefined } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { IHeaders } from '../../../base/parts/request/common/request.js';
import { localize } from '../../../nls.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { FileChangesEvent, FileOperationError, FileOperationResult, IFileContent, IFileService, toFileOperationResult } from '../../files/common/files.js';
import { ILogService } from '../../log/common/log.js';
import { getServiceMachineId } from '../../externalServices/common/serviceMachineId.js';
import { IStorageService, StorageScope, StorageTarget } from '../../storage/common/storage.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import {
	Change, getLastSyncResourceUri, IRemoteUserData, IResourcePreview as IBaseResourcePreview, ISyncData,
	IUserDataSyncResourcePreview as IBaseSyncResourcePreview, IUserData, IUserDataSyncResourceInitializer, IUserDataSyncLocalStoreService,
	IUserDataSyncConfiguration, IUserDataSynchroniser, IUserDataSyncLogService, IUserDataSyncEnablementService, IUserDataSyncStoreService,
	IUserDataSyncUtilService, MergeState, PREVIEW_DIR_NAME, SyncResource, SyncStatus, UserDataSyncError, UserDataSyncErrorCode,
	USER_DATA_SYNC_CONFIGURATION_SCOPE, USER_DATA_SYNC_SCHEME, getPathSegments, IUserDataSyncResourceConflicts,
	IUserDataSyncResource, IUserDataSyncResourcePreview,
	NON_EXISTING_RESOURCE_REF,
} from './userDataSync.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';

export function isRemoteUserData(thing: any): thing is IRemoteUserData {
	if (thing
		&& (thing.ref !== undefined && typeof thing.ref === 'string' && thing.ref !== '')
		&& (thing.syncData !== undefined && (thing.syncData === null || isSyncData(thing.syncData)))) {
		return true;
	}

	return false;
}

export function isSyncData(thing: any): thing is ISyncData {
	if (thing
		&& (thing.version !== undefined && typeof thing.version === 'number')
		&& (thing.content !== undefined && typeof thing.content === 'string')) {

		// backward compatibility
		if (Object.keys(thing).length === 2) {
			return true;
		}

		if (Object.keys(thing).length === 3
			&& (thing.machineId !== undefined && typeof thing.machineId === 'string')) {
			return true;
		}
	}

	return false;
}

export function getSyncResourceLogLabel(syncResource: SyncResource, profile: IUserDataProfile): string {
	return `${uppercaseFirstLetter(syncResource)}${profile.isDefault ? '' : ` (${profile.name})`}`;
}

export interface IResourcePreview {

	readonly baseResource: URI;
	readonly baseContent: string | null;

	readonly remoteResource: URI;
	readonly remoteContent: string | null;
	readonly remoteChange: Change;

	readonly localResource: URI;
	readonly localContent: string | null;
	readonly localChange: Change;

	readonly previewResource: URI;
	readonly acceptedResource: URI;
}

export interface IAcceptResult {
	readonly content: string | null;
	readonly localChange: Change;
	readonly remoteChange: Change;
}

export interface IMergeResult extends IAcceptResult {
	readonly hasConflicts: boolean;
}

interface IEditableResourcePreview extends IBaseResourcePreview, IResourcePreview {
	localChange: Change;
	remoteChange: Change;
	mergeState: MergeState;
	acceptResult?: IAcceptResult;
}

export interface ISyncResourcePreview extends IBaseSyncResourcePreview {
	readonly remoteUserData: IRemoteUserData;
	readonly lastSyncUserData: IRemoteUserData | null;
	readonly resourcePreviews: IEditableResourcePreview[];
}

interface ILastSyncUserDataState {
	readonly ref: string;
	readonly version: string | undefined;
	[key: string]: any;
}

export const enum SyncStrategy {
	Preview = 'preview', // Merge the local and remote data without applying.
	Merge = 'merge', // Merge the local and remote data and apply.
	PullOrPush = 'pull-push', // Pull the remote data or push the local data.
}

export abstract class AbstractSynchroniser extends Disposable implements IUserDataSynchroniser {

	private syncPreviewPromise: CancelablePromise<ISyncResourcePreview> | null = null;

	protected readonly syncFolder: URI;
	protected readonly syncPreviewFolder: URI;
	protected readonly extUri: IExtUri;
	protected readonly currentMachineIdPromise: Promise<string>;

	private _status: SyncStatus = SyncStatus.Idle;
	get status(): SyncStatus { return this._status; }
	private _onDidChangStatus: Emitter<SyncStatus> = this._register(new Emitter<SyncStatus>());
	readonly onDidChangeStatus: Event<SyncStatus> = this._onDidChangStatus.event;

	private _conflicts: IBaseResourcePreview[] = [];
	get conflicts(): IUserDataSyncResourceConflicts { return { ...this.syncResource, conflicts: this._conflicts }; }
	private _onDidChangeConflicts = this._register(new Emitter<IUserDataSyncResourceConflicts>());
	readonly onDidChangeConflicts = this._onDidChangeConflicts.event;

	private readonly localChangeTriggerThrottler = this._register(new ThrottledDelayer<void>(50));
	private readonly _onDidChangeLocal: Emitter<void> = this._register(new Emitter<void>());
	readonly onDidChangeLocal: Event<void> = this._onDidChangeLocal.event;

	protected readonly lastSyncResource: URI;
	private readonly lastSyncUserDataStateKey: string;
	private hasSyncResourceStateVersionChanged: boolean = false;
	protected readonly syncResourceLogLabel: string;

	protected syncHeaders: IHeaders = {};

	readonly resource: SyncResource;

	constructor(
		readonly syncResource: IUserDataSyncResource,
		readonly collection: string | undefined,
		@IFileService protected readonly fileService: IFileService,
		@IEnvironmentService protected readonly environmentService: IEnvironmentService,
		@IStorageService protected readonly storageService: IStorageService,
		@IUserDataSyncStoreService protected readonly userDataSyncStoreService: IUserDataSyncStoreService,
		@IUserDataSyncLocalStoreService protected readonly userDataSyncLocalStoreService: IUserDataSyncLocalStoreService,
		@IUserDataSyncEnablementService protected readonly userDataSyncEnablementService: IUserDataSyncEnablementService,
		@ITelemetryService protected readonly telemetryService: ITelemetryService,
		@IUserDataSyncLogService protected readonly logService: IUserDataSyncLogService,
		@IConfigurationService protected readonly configurationService: IConfigurationService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
	) {
		super();
		this.lastSyncUserDataStateKey = `${collection ? `${collection}.` : ''}${syncResource.syncResource}.lastSyncUserData`;
		this.resource = syncResource.syncResource;
		this.syncResourceLogLabel = getSyncResourceLogLabel(syncResource.syncResource, syncResource.profile);
		this.extUri = uriIdentityService.extUri;
		this.syncFolder = this.extUri.joinPath(environmentService.userDataSyncHome, ...getPathSegments(syncResource.profile.isDefault ? undefined : syncResource.profile.id, syncResource.syncResource));
		this.syncPreviewFolder = this.extUri.joinPath(this.syncFolder, PREVIEW_DIR_NAME);
		this.lastSyncResource = getLastSyncResourceUri(syncResource.profile.isDefault ? undefined : syncResource.profile.id, syncResource.syncResource, environmentService, this.extUri);
		this.currentMachineIdPromise = getServiceMachineId(environmentService, fileService, storageService);
	}

	protected triggerLocalChange(): void {
		this.localChangeTriggerThrottler.trigger(() => this.doTriggerLocalChange());
	}

	protected async doTriggerLocalChange(): Promise<void> {

		// Sync again if current status is in conflicts
		if (this.status === SyncStatus.HasConflicts) {
			this.logService.info(`${this.syncResourceLogLabel}: In conflicts state and local change detected. Syncing again...`);
			const preview = await this.syncPreviewPromise!;
			this.syncPreviewPromise = null;
			const status = await this.performSync(preview.remoteUserData, preview.lastSyncUserData, SyncStrategy.Merge, this.getUserDataSyncConfiguration());
			this.setStatus(status);
		}

		// Check if local change causes remote change
		else {
			this.logService.trace(`${this.syncResourceLogLabel}: Checking for local changes...`);
			const lastSyncUserData = await this.getLastSyncUserData();
			const hasRemoteChanged = lastSyncUserData ? await this.hasRemoteChanged(lastSyncUserData) : true;
			if (hasRemoteChanged) {
				this._onDidChangeLocal.fire();
			}
		}
	}

	protected setStatus(status: SyncStatus): void {
		if (this._status !== status) {
			this._status = status;
			this._onDidChangStatus.fire(status);
		}
	}

	async sync(refOrUserData: string | IUserData | null, preview: boolean = false, userDataSyncConfiguration: IUserDataSyncConfiguration = this.getUserDataSyncConfiguration(), headers: IHeaders = {}): Promise<IUserDataSyncResourcePreview | null> {
		try {
			this.syncHeaders = { ...headers };

			if (this.status === SyncStatus.HasConflicts) {
				this.logService.info(`${this.syncResourceLogLabel}: Skipped synchronizing ${this.resource.toLowerCase()} as there are conflicts.`);
				return this.syncPreviewPromise;
			}

			if (this.status === SyncStatus.Syncing) {
				this.logService.info(`${this.syncResourceLogLabel}: Skipped synchronizing ${this.resource.toLowerCase()} as it is running already.`);
				return this.syncPreviewPromise;
			}

			this.logService.trace(`${this.syncResourceLogLabel}: Started synchronizing ${this.resource.toLowerCase()}...`);
			this.setStatus(SyncStatus.Syncing);

			let status: SyncStatus = SyncStatus.Idle;
			try {
				const lastSyncUserData = await this.getLastSyncUserData();
				const remoteUserData = await this.getLatestRemoteUserData(refOrUserData, lastSyncUserData);
				status = await this.performSync(remoteUserData, lastSyncUserData, preview ? SyncStrategy.Preview : SyncStrategy.Merge, userDataSyncConfiguration);
				if (status === SyncStatus.HasConflicts) {
					this.logService.info(`${this.syncResourceLogLabel}: Detected conflicts while synchronizing ${this.resource.toLowerCase()}.`);
				} else if (status === SyncStatus.Idle) {
					this.logService.trace(`${this.syncResourceLogLabel}: Finished synchronizing ${this.resource.toLowerCase()}.`);
				}
				return this.syncPreviewPromise || null;
			} finally {
				this.setStatus(status);
			}
		} finally {
			this.syncHeaders = {};
		}
	}

	async apply(force: boolean, headers: IHeaders = {}): Promise<ISyncResourcePreview | null> {
		try {
			this.syncHeaders = { ...headers };

			const status = await this.doApply(force);
			this.setStatus(status);

			return this.syncPreviewPromise;
		} finally {
			this.syncHeaders = {};
		}
	}

	async replace(content: string): Promise<boolean> {
		const syncData = this.parseSyncData(content);
		if (!syncData) {
			return false;
		}

		await this.stop();

		try {
			this.logService.trace(`${this.syncResourceLogLabel}: Started resetting ${this.resource.toLowerCase()}...`);
			this.setStatus(SyncStatus.Syncing);
			const lastSyncUserData = await this.getLastSyncUserData();
			const remoteUserData = await this.getLatestRemoteUserData(null, lastSyncUserData);
			const isRemoteDataFromCurrentMachine = await this.isRemoteDataFromCurrentMachine(remoteUserData);

			/* use replace sync data */
			const resourcePreviewResults = await this.generateSyncPreview({ ref: remoteUserData.ref, syncData }, lastSyncUserData, isRemoteDataFromCurrentMachine, this.getUserDataSyncConfiguration(), CancellationToken.None);

			const resourcePreviews: [IResourcePreview, IAcceptResult][] = [];
			for (const resourcePreviewResult of resourcePreviewResults) {
				/* Accept remote resource */
				const acceptResult: IAcceptResult = await this.getAcceptResult(resourcePreviewResult, resourcePreviewResult.remoteResource, undefined, CancellationToken.None);
				/* compute remote change */
				const { remoteChange } = await this.getAcceptResult(resourcePreviewResult, resourcePreviewResult.previewResource, resourcePreviewResult.remoteContent, CancellationToken.None);
				resourcePreviews.push([resourcePreviewResult, { ...acceptResult, remoteChange: remoteChange !== Change.None ? remoteChange : Change.Modified }]);
			}

			await this.applyResult(remoteUserData, lastSyncUserData, resourcePreviews, false);
			this.logService.info(`${this.syncResourceLogLabel}: Finished resetting ${this.resource.toLowerCase()}.`);
		} finally {
			this.setStatus(SyncStatus.Idle);
		}

		return true;
	}

	private async isRemoteDataFromCurrentMachine(remoteUserData: IRemoteUserData): Promise<boolean> {
		const machineId = await this.currentMachineIdPromise;
		return !!remoteUserData.syncData?.machineId && remoteUserData.syncData.machineId === machineId;
	}

	protected async getLatestRemoteUserData(refOrLatestData: string | IUserData | null, lastSyncUserData: IRemoteUserData | null): Promise<IRemoteUserData> {
		if (refOrLatestData === null) {
			return { ref: NON_EXISTING_RESOURCE_REF, syncData: null };
		}

		if (!isString(refOrLatestData)) {
			return this.toRemoteUserData(refOrLatestData);
		}

		// Last time synced resource and latest resource on server are same
		if (lastSyncUserData?.ref === refOrLatestData) {
			return lastSyncUserData;
		}

		return this.getRemoteUserData(lastSyncUserData);
	}

	private async performSync(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, strategy: SyncStrategy, userDataSyncConfiguration: IUserDataSyncConfiguration): Promise<SyncStatus> {
		if (remoteUserData.syncData && remoteUserData.syncData.version > this.version) {
			throw new UserDataSyncError(localize({ key: 'incompatible', comment: ['This is an error while syncing a resource that its local version is not compatible with its remote version.'] }, "Cannot sync {0} as its local version {1} is not compatible with its remote version {2}", this.resource, this.version, remoteUserData.syncData.version), UserDataSyncErrorCode.IncompatibleLocalContent, this.resource);
		}

		try {
			return await this.doSync(remoteUserData, lastSyncUserData, strategy, userDataSyncConfiguration);
		} catch (e) {
			if (e instanceof UserDataSyncError) {
				switch (e.code) {

					case UserDataSyncErrorCode.LocalPreconditionFailed:
						// Rejected as there is a new local version. Syncing again...
						this.logService.info(`${this.syncResourceLogLabel}: Failed to synchronize ${this.syncResourceLogLabel} as there is a new local version available. Synchronizing again...`);
						return this.performSync(remoteUserData, lastSyncUserData, strategy, userDataSyncConfiguration);

					case UserDataSyncErrorCode.Conflict:
					case UserDataSyncErrorCode.PreconditionFailed:
						// Rejected as there is a new remote version. Syncing again...
						this.logService.info(`${this.syncResourceLogLabel}: Failed to synchronize as there is a new remote version available. Synchronizing again...`);

						// Avoid cache and get latest remote user data - https://github.com/microsoft/vscode/issues/90624
						remoteUserData = await this.getRemoteUserData(null);

						// Get the latest last sync user data. Because multiple parallel syncs (in Web) could share same last sync data
						// and one of them successfully updated remote and last sync state.
						lastSyncUserData = await this.getLastSyncUserData();

						return this.performSync(remoteUserData, lastSyncUserData, SyncStrategy.Merge, userDataSyncConfiguration);
				}
			}
			throw e;
		}
	}

	protected async doSync(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, strategy: SyncStrategy, userDataSyncConfiguration: IUserDataSyncConfiguration): Promise<SyncStatus> {
		try {

			const isRemoteDataFromCurrentMachine = await this.isRemoteDataFromCurrentMachine(remoteUserData);
			const acceptRemote = !isRemoteDataFromCurrentMachine && lastSyncUserData === null && this.getStoredLastSyncUserDataStateContent() !== undefined;
			const merge = strategy === SyncStrategy.Preview || (strategy === SyncStrategy.Merge && !acceptRemote);
			const apply = strategy === SyncStrategy.Merge || strategy === SyncStrategy.PullOrPush;

			// generate or use existing preview
			if (!this.syncPreviewPromise) {
				this.syncPreviewPromise = createCancelablePromise(token => this.doGenerateSyncResourcePreview(remoteUserData, lastSyncUserData, isRemoteDataFromCurrentMachine, merge, userDataSyncConfiguration, token));
			}

			let preview = await this.syncPreviewPromise;

			if (strategy === SyncStrategy.Merge && acceptRemote) {
				this.logService.info(`${this.syncResourceLogLabel}: Accepting remote because it was synced before and the last sync data is not available.`);
				for (const resourcePreview of preview.resourcePreviews) {
					preview = (await this.accept(resourcePreview.remoteResource)) || preview;
				}
			}

			else if (strategy === SyncStrategy.PullOrPush) {
				for (const resourcePreview of preview.resourcePreviews) {
					if (resourcePreview.mergeState === MergeState.Accepted) {
						continue;
					}
					if (remoteUserData.ref === lastSyncUserData?.ref || isRemoteDataFromCurrentMachine) {
						preview = (await this.accept(resourcePreview.localResource)) ?? preview;
					} else {
						preview = (await this.accept(resourcePreview.remoteResource)) ?? preview;
					}
				}
			}

			this.updateConflicts(preview.resourcePreviews);
			if (preview.resourcePreviews.some(({ mergeState }) => mergeState === MergeState.Conflict)) {
				return SyncStatus.HasConflicts;
			}

			if (apply) {
				return await this.doApply(false);
			}

			return SyncStatus.Syncing;

		} catch (error) {

			// reset preview on error
			this.syncPreviewPromise = null;

			throw error;
		}
	}

	async accept(resource: URI, content?: string | null): Promise<ISyncResourcePreview | null> {
		await this.updateSyncResourcePreview(resource, async (resourcePreview) => {
			const acceptResult = await this.getAcceptResult(resourcePreview, resource, content, CancellationToken.None);
			resourcePreview.acceptResult = acceptResult;
			resourcePreview.mergeState = MergeState.Accepted;
			resourcePreview.localChange = acceptResult.localChange;
			resourcePreview.remoteChange = acceptResult.remoteChange;
			return resourcePreview;
		});
		return this.syncPreviewPromise;
	}

	async discard(resource: URI): Promise<ISyncResourcePreview | null> {
		await this.updateSyncResourcePreview(resource, async (resourcePreview) => {
			const mergeResult = await this.getMergeResult(resourcePreview, CancellationToken.None);
			await this.fileService.writeFile(resourcePreview.previewResource, VSBuffer.fromString(mergeResult.content || ''));
			resourcePreview.acceptResult = undefined;
			resourcePreview.mergeState = MergeState.Preview;
			resourcePreview.localChange = mergeResult.localChange;
			resourcePreview.remoteChange = mergeResult.remoteChange;
			return resourcePreview;
		});
		return this.syncPreviewPromise;
	}

	private async updateSyncResourcePreview(resource: URI, updateResourcePreview: (resourcePreview: IEditableResourcePreview) => Promise<IEditableResourcePreview>): Promise<void> {
		if (!this.syncPreviewPromise) {
			return;
		}

		let preview = await this.syncPreviewPromise;
		const index = preview.resourcePreviews.findIndex(({ localResource, remoteResource, previewResource }) =>
			this.extUri.isEqual(localResource, resource) || this.extUri.isEqual(remoteResource, resource) || this.extUri.isEqual(previewResource, resource));
		if (index === -1) {
			return;
		}

		this.syncPreviewPromise = createCancelablePromise(async token => {
			const resourcePreviews = [...preview.resourcePreviews];
			resourcePreviews[index] = await updateResourcePreview(resourcePreviews[index]);
			return {
				...preview,
				resourcePreviews
			};
		});

		preview = await this.syncPreviewPromise;
		this.updateConflicts(preview.resourcePreviews);
		if (preview.resourcePreviews.some(({ mergeState }) => mergeState === MergeState.Conflict)) {
			this.setStatus(SyncStatus.HasConflicts);
		} else {
			this.setStatus(SyncStatus.Syncing);
		}
	}

	private async doApply(force: boolean): Promise<SyncStatus> {
		if (!this.syncPreviewPromise) {
			return SyncStatus.Idle;
		}

		const preview = await this.syncPreviewPromise;

		// check for conflicts
		if (preview.resourcePreviews.some(({ mergeState }) => mergeState === MergeState.Conflict)) {
			return SyncStatus.HasConflicts;
		}

		// check if all are accepted
		if (preview.resourcePreviews.some(({ mergeState }) => mergeState !== MergeState.Accepted)) {
			return SyncStatus.Syncing;
		}

		// apply preview
		await this.applyResult(preview.remoteUserData, preview.lastSyncUserData, preview.resourcePreviews.map(resourcePreview => ([resourcePreview, resourcePreview.acceptResult!])), force);

		// reset preview
		this.syncPreviewPromise = null;

		// reset preview folder
		await this.clearPreviewFolder();

		return SyncStatus.Idle;
	}

	private async clearPreviewFolder(): Promise<void> {
		try {
			await this.fileService.del(this.syncPreviewFolder, { recursive: true });
		} catch (error) { /* Ignore */ }
	}

	private updateConflicts(resourcePreviews: IEditableResourcePreview[]): void {
		const conflicts = resourcePreviews.filter(({ mergeState }) => mergeState === MergeState.Conflict);
		if (!equals(this._conflicts, conflicts, (a, b) => this.extUri.isEqual(a.previewResource, b.previewResource))) {
			this._conflicts = conflicts;
			this._onDidChangeConflicts.fire(this.conflicts);
		}
	}

	async hasPreviouslySynced(): Promise<boolean> {
		const lastSyncData = await this.getLastSyncUserData();
		return !!lastSyncData && lastSyncData.syncData !== null /* `null` sync data implies resource is not synced */;
	}

	protected async resolvePreviewContent(uri: URI): Promise<string | null> {
		const syncPreview = this.syncPreviewPromise ? await this.syncPreviewPromise : null;
		if (syncPreview) {
			for (const resourcePreview of syncPreview.resourcePreviews) {
				if (this.extUri.isEqual(resourcePreview.acceptedResource, uri)) {
					return resourcePreview.acceptResult ? resourcePreview.acceptResult.content : null;
				}
				if (this.extUri.isEqual(resourcePreview.remoteResource, uri)) {
					return resourcePreview.remoteContent;
				}
				if (this.extUri.isEqual(resourcePreview.localResource, uri)) {
					return resourcePreview.localContent;
				}
				if (this.extUri.isEqual(resourcePreview.baseResource, uri)) {
					return resourcePreview.baseContent;
				}
			}
		}
		return null;
	}

	async resetLocal(): Promise<void> {
		this.storageService.remove(this.lastSyncUserDataStateKey, StorageScope.APPLICATION);
		try {
			await this.fileService.del(this.lastSyncResource);
		} catch (error) {
			if (toFileOperationResult(error) !== FileOperationResult.FILE_NOT_FOUND) {
				this.logService.error(error);
			}
		}
	}

	private async doGenerateSyncResourcePreview(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, isRemoteDataFromCurrentMachine: boolean, merge: boolean, userDataSyncConfiguration: IUserDataSyncConfiguration, token: CancellationToken): Promise<ISyncResourcePreview> {
		const resourcePreviewResults = await this.generateSyncPreview(remoteUserData, lastSyncUserData, isRemoteDataFromCurrentMachine, userDataSyncConfiguration, token);

		const resourcePreviews: IEditableResourcePreview[] = [];
		for (const resourcePreviewResult of resourcePreviewResults) {
			const acceptedResource = resourcePreviewResult.previewResource.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' });

			/* No change -> Accept */
			if (resourcePreviewResult.localChange === Change.None && resourcePreviewResult.remoteChange === Change.None) {
				resourcePreviews.push({
					...resourcePreviewResult,
					acceptedResource,
					acceptResult: { content: null, localChange: Change.None, remoteChange: Change.None },
					mergeState: MergeState.Accepted
				});
			}

			/* Changed -> Apply ? (Merge ? Conflict | Accept) : Preview */
			else {
				/* Merge */
				const mergeResult = merge ? await this.getMergeResult(resourcePreviewResult, token) : undefined;
				if (token.isCancellationRequested) {
					break;
				}
				await this.fileService.writeFile(resourcePreviewResult.previewResource, VSBuffer.fromString(mergeResult?.content || ''));

				/* Conflict | Accept */
				const acceptResult = mergeResult && !mergeResult.hasConflicts
					/* Accept if merged and there are no conflicts */
					? await this.getAcceptResult(resourcePreviewResult, resourcePreviewResult.previewResource, undefined, token)
					: undefined;

				resourcePreviews.push({
					...resourcePreviewResult,
					acceptResult,
					mergeState: mergeResult?.hasConflicts ? MergeState.Conflict : acceptResult ? MergeState.Accepted : MergeState.Preview,
					localChange: acceptResult ? acceptResult.localChange : mergeResult ? mergeResult.localChange : resourcePreviewResult.localChange,
					remoteChange: acceptResult ? acceptResult.remoteChange : mergeResult ? mergeResult.remoteChange : resourcePreviewResult.remoteChange
				});
			}
		}

		return { syncResource: this.resource, profile: this.syncResource.profile, remoteUserData, lastSyncUserData, resourcePreviews, isLastSyncFromCurrentMachine: isRemoteDataFromCurrentMachine };
	}

	async getLastSyncUserData(): Promise<IRemoteUserData | null> {
		const storedLastSyncUserDataStateContent = this.getStoredLastSyncUserDataStateContent();

		// Last Sync Data state does not exist
		if (!storedLastSyncUserDataStateContent) {
			this.logService.info(`${this.syncResourceLogLabel}: Last sync data state does not exist.`);
			return null;
		}

		const lastSyncUserDataState: ILastSyncUserDataState = JSON.parse(storedLastSyncUserDataStateContent);
		const resourceSyncStateVersion = this.userDataSyncEnablementService.getResourceSyncStateVersion(this.resource);
		this.hasSyncResourceStateVersionChanged = !!lastSyncUserDataState.version && !!resourceSyncStateVersion && lastSyncUserDataState.version !== resourceSyncStateVersion;
		if (this.hasSyncResourceStateVersionChanged) {
			this.logService.info(`${this.syncResourceLogLabel}: Reset last sync state because last sync state version ${lastSyncUserDataState.version} is not compatible with current sync state version ${resourceSyncStateVersion}.`);
			await this.resetLocal();
			return null;
		}

		let syncData: ISyncData | null | undefined = undefined;

		// Get Last Sync Data from Local
		let retrial = 1;
		while (syncData === undefined && retrial++ < 6 /* Retry 5 times */) {
			try {
				const lastSyncStoredRemoteUserData = await this.readLastSyncStoredRemoteUserData();
				if (lastSyncStoredRemoteUserData) {
					if (lastSyncStoredRemoteUserData.ref === lastSyncUserDataState.ref) {
						syncData = lastSyncStoredRemoteUserData.syncData;
					} else {
						this.logService.info(`${this.syncResourceLogLabel}: Last sync data stored locally is not same as the last sync state.`);
					}
				}
				break;
			} catch (error) {
				if (error instanceof FileOperationError && error.fileOperationResult === FileOperationResult.FILE_NOT_FOUND) {
					this.logService.info(`${this.syncResourceLogLabel}: Last sync resource does not exist locally.`);
					break;
				} else if (error instanceof UserDataSyncError) {
					throw error;
				} else {
					// log and retry
					this.logService.error(error, retrial);
				}
			}
		}

		// Get Last Sync Data from Remote
		if (syncData === undefined) {
			try {
				const content = await this.userDataSyncStoreService.resolveResourceContent(this.resource, lastSyncUserDataState.ref, this.collection, this.syncHeaders);
				syncData = content === null ? null : this.parseSyncData(content);
				await this.writeLastSyncStoredRemoteUserData({ ref: lastSyncUserDataState.ref, syncData });
			} catch (error) {
				if (error instanceof UserDataSyncError && error.code === UserDataSyncErrorCode.NotFound) {
					this.logService.info(`${this.syncResourceLogLabel}: Last sync resource does not exist remotely.`);
				} else {
					throw error;
				}
			}
		}

		// Last Sync Data Not Found
		if (syncData === undefined) {
			return null;
		}

		return {
			...lastSyncUserDataState,
			syncData,
		};
	}

	protected async updateLastSyncUserData(lastSyncRemoteUserData: IRemoteUserData, additionalProps: IStringDictionary<any> = {}): Promise<void> {
		if (additionalProps['ref'] || additionalProps['version']) {
			throw new Error('Cannot have core properties as additional');
		}

		const version = this.userDataSyncEnablementService.getResourceSyncStateVersion(this.resource);
		const lastSyncUserDataState: ILastSyncUserDataState = {
			ref: lastSyncRemoteUserData.ref,
			version,
			...additionalProps
		};

		this.storageService.store(this.lastSyncUserDataStateKey, JSON.stringify(lastSyncUserDataState), StorageScope.APPLICATION, StorageTarget.MACHINE);
		await this.writeLastSyncStoredRemoteUserData(lastSyncRemoteUserData);
	}

	private getStoredLastSyncUserDataStateContent(): string | undefined {
		return this.storageService.get(this.lastSyncUserDataStateKey, StorageScope.APPLICATION);
	}

	private async readLastSyncStoredRemoteUserData(): Promise<IRemoteUserData | undefined> {
		const content = (await this.fileService.readFile(this.lastSyncResource)).value.toString();
		try {
			const lastSyncStoredRemoteUserData = content ? JSON.parse(content) : undefined;
			if (isRemoteUserData(lastSyncStoredRemoteUserData)) {
				return lastSyncStoredRemoteUserData;
			}
		} catch (e) {
			this.logService.error(e);
		}
		return undefined;
	}

	private async writeLastSyncStoredRemoteUserData(lastSyncRemoteUserData: IRemoteUserData): Promise<void> {
		await this.fileService.writeFile(this.lastSyncResource, VSBuffer.fromString(JSON.stringify(lastSyncRemoteUserData)));
	}

	async getRemoteUserData(lastSyncData: IRemoteUserData | null): Promise<IRemoteUserData> {
		const userData = await this.getUserData(lastSyncData);
		return this.toRemoteUserData(userData);
	}

	private toRemoteUserData({ ref, content }: IUserData): IRemoteUserData {
		let syncData: ISyncData | null = null;
		if (content !== null) {
			syncData = this.parseSyncData(content);
		}
		return { ref, syncData };
	}

	protected parseSyncData(content: string): ISyncData {
		try {
			const syncData: ISyncData = JSON.parse(content);
			if (isSyncData(syncData)) {
				return syncData;
			}
		} catch (error) {
			this.logService.error(error);
		}
		throw new UserDataSyncError(localize('incompatible sync data', "Cannot parse sync data as it is not compatible with the current version."), UserDataSyncErrorCode.IncompatibleRemoteContent, this.resource);
	}

	private async getUserData(lastSyncData: IRemoteUserData | null): Promise<IUserData> {
		const lastSyncUserData: IUserData | null = lastSyncData ? { ref: lastSyncData.ref, content: lastSyncData.syncData ? JSON.stringify(lastSyncData.syncData) : null } : null;
		return this.userDataSyncStoreService.readResource(this.resource, lastSyncUserData, this.collection, this.syncHeaders);
	}

	protected async updateRemoteUserData(content: string, ref: string | null): Promise<IRemoteUserData> {
		const machineId = await this.currentMachineIdPromise;
		const syncData: ISyncData = { version: this.version, machineId, content };
		try {
			ref = await this.userDataSyncStoreService.writeResource(this.resource, JSON.stringify(syncData), ref, this.collection, this.syncHeaders);
			return { ref, syncData };
		} catch (error) {
			if (error instanceof UserDataSyncError && error.code === UserDataSyncErrorCode.TooLarge) {
				error = new UserDataSyncError(error.message, error.code, this.resource);
			}
			throw error;
		}
	}

	protected async backupLocal(content: string): Promise<void> {
		const syncData: ISyncData = { version: this.version, content };
		return this.userDataSyncLocalStoreService.writeResource(this.resource, JSON.stringify(syncData), new Date(), this.syncResource.profile.isDefault ? undefined : this.syncResource.profile.id);
	}

	async stop(): Promise<void> {
		if (this.status === SyncStatus.Idle) {
			return;
		}

		this.logService.trace(`${this.syncResourceLogLabel}: Stopping synchronizing ${this.resource.toLowerCase()}.`);
		if (this.syncPreviewPromise) {
			this.syncPreviewPromise.cancel();
			this.syncPreviewPromise = null;
		}

		this.updateConflicts([]);
		await this.clearPreviewFolder();

		this.setStatus(SyncStatus.Idle);
		this.logService.info(`${this.syncResourceLogLabel}: Stopped synchronizing ${this.resource.toLowerCase()}.`);
	}

	private getUserDataSyncConfiguration(): IUserDataSyncConfiguration {
		return this.configurationService.getValue(USER_DATA_SYNC_CONFIGURATION_SCOPE);
	}

	protected abstract readonly version: number;
	protected abstract generateSyncPreview(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, isRemoteDataFromCurrentMachine: boolean, userDataSyncConfiguration: IUserDataSyncConfiguration, token: CancellationToken): Promise<IResourcePreview[]>;
	protected abstract getMergeResult(resourcePreview: IResourcePreview, token: CancellationToken): Promise<IMergeResult>;
	protected abstract getAcceptResult(resourcePreview: IResourcePreview, resource: URI, content: string | null | undefined, token: CancellationToken): Promise<IAcceptResult>;
	protected abstract applyResult(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, result: [IResourcePreview, IAcceptResult][], force: boolean): Promise<void>;
	protected abstract hasRemoteChanged(lastSyncUserData: IRemoteUserData): Promise<boolean>;

	abstract hasLocalData(): Promise<boolean>;
	abstract resolveContent(uri: URI): Promise<string | null>;
}

export interface IFileResourcePreview extends IResourcePreview {
	readonly fileContent: IFileContent | null;
}

export abstract class AbstractFileSynchroniser extends AbstractSynchroniser {

	constructor(
		protected readonly file: URI,
		syncResource: IUserDataSyncResource,
		collection: string | undefined,
		@IFileService fileService: IFileService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@IStorageService storageService: IStorageService,
		@IUserDataSyncStoreService userDataSyncStoreService: IUserDataSyncStoreService,
		@IUserDataSyncLocalStoreService userDataSyncLocalStoreService: IUserDataSyncLocalStoreService,
		@IUserDataSyncEnablementService userDataSyncEnablementService: IUserDataSyncEnablementService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IUserDataSyncLogService logService: IUserDataSyncLogService,
		@IConfigurationService configurationService: IConfigurationService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
	) {
		super(syncResource, collection, fileService, environmentService, storageService, userDataSyncStoreService, userDataSyncLocalStoreService, userDataSyncEnablementService, telemetryService, logService, configurationService, uriIdentityService);
		this._register(this.fileService.watch(this.extUri.dirname(file)));
		this._register(this.fileService.onDidFilesChange(e => this.onFileChanges(e)));
	}

	protected async getLocalFileContent(): Promise<IFileContent | null> {
		try {
			return await this.fileService.readFile(this.file);
		} catch (error) {
			return null;
		}
	}

	protected async updateLocalFileContent(newContent: string, oldContent: IFileContent | null, force: boolean): Promise<void> {
		try {
			if (oldContent) {
				// file exists already
				await this.fileService.writeFile(this.file, VSBuffer.fromString(newContent), force ? undefined : oldContent);
			} else {
				// file does not exist
				await this.fileService.createFile(this.file, VSBuffer.fromString(newContent), { overwrite: force });
			}
		} catch (e) {
			if ((e instanceof FileOperationError && e.fileOperationResult === FileOperationResult.FILE_NOT_FOUND) ||
				(e instanceof FileOperationError && e.fileOperationResult === FileOperationResult.FILE_MODIFIED_SINCE)) {
				throw new UserDataSyncError(e.message, UserDataSyncErrorCode.LocalPreconditionFailed);
			} else {
				throw e;
			}
		}
	}

	protected async deleteLocalFile(): Promise<void> {
		try {
			await this.fileService.del(this.file);
		} catch (e) {
			if (!(e instanceof FileOperationError && e.fileOperationResult === FileOperationResult.FILE_NOT_FOUND)) {
				throw e;
			}
		}
	}

	private onFileChanges(e: FileChangesEvent): void {
		if (!e.contains(this.file)) {
			return;
		}
		this.triggerLocalChange();
	}

}

export abstract class AbstractJsonFileSynchroniser extends AbstractFileSynchroniser {

	constructor(
		file: URI,
		syncResource: IUserDataSyncResource,
		collection: string | undefined,
		@IFileService fileService: IFileService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@IStorageService storageService: IStorageService,
		@IUserDataSyncStoreService userDataSyncStoreService: IUserDataSyncStoreService,
		@IUserDataSyncLocalStoreService userDataSyncLocalStoreService: IUserDataSyncLocalStoreService,
		@IUserDataSyncEnablementService userDataSyncEnablementService: IUserDataSyncEnablementService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IUserDataSyncLogService logService: IUserDataSyncLogService,
		@IUserDataSyncUtilService protected readonly userDataSyncUtilService: IUserDataSyncUtilService,
		@IConfigurationService configurationService: IConfigurationService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
	) {
		super(file, syncResource, collection, fileService, environmentService, storageService, userDataSyncStoreService, userDataSyncLocalStoreService, userDataSyncEnablementService, telemetryService, logService, configurationService, uriIdentityService);
	}

	protected hasErrors(content: string, isArray: boolean): boolean {
		const parseErrors: ParseError[] = [];
		const result = parse(content, parseErrors, { allowEmptyContent: true, allowTrailingComma: true });
		return parseErrors.length > 0 || (!isUndefined(result) && isArray !== Array.isArray(result));
	}

	private _formattingOptions: Promise<FormattingOptions> | undefined = undefined;
	protected getFormattingOptions(): Promise<FormattingOptions> {
		if (!this._formattingOptions) {
			this._formattingOptions = this.userDataSyncUtilService.resolveFormattingOptions(this.file);
		}
		return this._formattingOptions;
	}

}

export abstract class AbstractInitializer implements IUserDataSyncResourceInitializer {

	protected readonly extUri: IExtUri;
	private readonly lastSyncResource: URI;

	constructor(
		readonly resource: SyncResource,
		@IUserDataProfilesService protected readonly userDataProfilesService: IUserDataProfilesService,
		@IEnvironmentService protected readonly environmentService: IEnvironmentService,
		@ILogService protected readonly logService: ILogService,
		@IFileService protected readonly fileService: IFileService,
		@IStorageService protected readonly storageService: IStorageService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
	) {
		this.extUri = uriIdentityService.extUri;
		this.lastSyncResource = getLastSyncResourceUri(undefined, this.resource, environmentService, this.extUri);
	}

	async initialize({ ref, content }: IUserData): Promise<void> {
		if (!content) {
			this.logService.info('Remote content does not exist.', this.resource);
			return;
		}

		const syncData = this.parseSyncData(content);
		if (!syncData) {
			return;
		}

		try {
			await this.doInitialize({ ref, syncData });
		} catch (error) {
			this.logService.error(error);
		}
	}

	private parseSyncData(content: string): ISyncData | undefined {
		try {
			const syncData: ISyncData = JSON.parse(content);
			if (isSyncData(syncData)) {
				return syncData;
			}
		} catch (error) {
			this.logService.error(error);
		}
		this.logService.info('Cannot parse sync data as it is not compatible with the current version.', this.resource);
		return undefined;
	}

	protected async updateLastSyncUserData(lastSyncRemoteUserData: IRemoteUserData, additionalProps: IStringDictionary<any> = {}): Promise<void> {
		if (additionalProps['ref'] || additionalProps['version']) {
			throw new Error('Cannot have core properties as additional');
		}

		const lastSyncUserDataState: ILastSyncUserDataState = {
			ref: lastSyncRemoteUserData.ref,
			version: undefined,
			...additionalProps
		};

		this.storageService.store(`${this.resource}.lastSyncUserData`, JSON.stringify(lastSyncUserDataState), StorageScope.APPLICATION, StorageTarget.MACHINE);
		await this.fileService.writeFile(this.lastSyncResource, VSBuffer.fromString(JSON.stringify(lastSyncRemoteUserData)));
	}

	protected abstract doInitialize(remoteUserData: IRemoteUserData): Promise<void>;

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/content.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/content.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { JSONPath } from '../../../base/common/json.js';
import { setProperty } from '../../../base/common/jsonEdit.js';
import { FormattingOptions } from '../../../base/common/jsonFormatter.js';


export function edit(content: string, originalPath: JSONPath, value: unknown, formattingOptions: FormattingOptions): string {
	const edit = setProperty(content, originalPath, value, formattingOptions)[0];
	if (edit) {
		content = content.substring(0, edit.offset) + edit.content + content.substring(edit.offset + edit.length);
	}
	return content;
}

export function getLineStartOffset(content: string, eol: string, atOffset: number): number {
	let lineStartingOffset = atOffset;
	while (lineStartingOffset >= 0) {
		if (content.charAt(lineStartingOffset) === eol.charAt(eol.length - 1)) {
			if (eol.length === 1) {
				return lineStartingOffset + 1;
			}
		}
		lineStartingOffset--;
		if (eol.length === 2) {
			if (lineStartingOffset >= 0 && content.charAt(lineStartingOffset) === eol.charAt(0)) {
				return lineStartingOffset + 2;
			}
		}
	}
	return 0;
}

export function getLineEndOffset(content: string, eol: string, atOffset: number): number {
	let lineEndOffset = atOffset;
	while (lineEndOffset >= 0) {
		if (content.charAt(lineEndOffset) === eol.charAt(eol.length - 1)) {
			if (eol.length === 1) {
				return lineEndOffset;
			}
		}
		lineEndOffset++;
		if (eol.length === 2) {
			if (lineEndOffset >= 0 && content.charAt(lineEndOffset) === eol.charAt(1)) {
				return lineEndOffset;
			}
		}
	}
	return content.length - 1;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/extensionsMerge.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/extensionsMerge.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStringDictionary } from '../../../base/common/collections.js';
import { deepClone, equals } from '../../../base/common/objects.js';
import * as semver from '../../../base/common/semver/semver.js';
import { assertReturnsDefined } from '../../../base/common/types.js';
import { IExtensionIdentifier } from '../../extensions/common/extensions.js';
import { ILocalSyncExtension, IRemoteSyncExtension, ISyncExtension } from './userDataSync.js';

export interface IMergeResult {
	readonly local: { added: ISyncExtension[]; removed: IExtensionIdentifier[]; updated: ISyncExtension[] };
	readonly remote: { added: ISyncExtension[]; removed: ISyncExtension[]; updated: ISyncExtension[]; all: ISyncExtension[] } | null;
}

export function merge(localExtensions: ILocalSyncExtension[], remoteExtensions: IRemoteSyncExtension[] | null, lastSyncExtensions: IRemoteSyncExtension[] | null, skippedExtensions: ISyncExtension[], ignoredExtensions: string[], lastSyncBuiltinExtensions: IExtensionIdentifier[] | null): IMergeResult {
	const added: ISyncExtension[] = [];
	const removed: IExtensionIdentifier[] = [];
	const updated: ISyncExtension[] = [];

	if (!remoteExtensions) {
		const remote = localExtensions.filter(({ identifier }) => ignoredExtensions.every(id => id.toLowerCase() !== identifier.id.toLowerCase()));
		return {
			local: {
				added,
				removed,
				updated,
			},
			remote: remote.length > 0 ? {
				added: remote,
				updated: [],
				removed: [],
				all: remote
			} : null
		};
	}

	localExtensions = localExtensions.map(massageIncomingExtension) as ILocalSyncExtension[];
	remoteExtensions = remoteExtensions.map(massageIncomingExtension);
	lastSyncExtensions = lastSyncExtensions ? lastSyncExtensions.map(massageIncomingExtension) : null;

	const uuids: Map<string, string> = new Map<string, string>();
	const addUUID = (identifier: IExtensionIdentifier) => { if (identifier.uuid) { uuids.set(identifier.id.toLowerCase(), identifier.uuid); } };
	localExtensions.forEach(({ identifier }) => addUUID(identifier));
	remoteExtensions.forEach(({ identifier }) => addUUID(identifier));
	lastSyncExtensions?.forEach(({ identifier }) => addUUID(identifier));
	skippedExtensions?.forEach(({ identifier }) => addUUID(identifier));
	lastSyncBuiltinExtensions?.forEach(identifier => addUUID(identifier));

	const getKey = (extension: ISyncExtension): string => {
		const uuid = extension.identifier.uuid || uuids.get(extension.identifier.id.toLowerCase());
		return uuid ? `uuid:${uuid}` : `id:${extension.identifier.id.toLowerCase()}`;
	};
	const addExtensionToMap = (map: Map<string, ISyncExtension>, extension: ISyncExtension) => {
		map.set(getKey(extension), extension);
		return map;
	};
	const localExtensionsMap: Map<string, ISyncExtension> = localExtensions.reduce(addExtensionToMap, new Map<string, ISyncExtension>());
	const remoteExtensionsMap = remoteExtensions.reduce(addExtensionToMap, new Map<string, ISyncExtension>());
	const newRemoteExtensionsMap = remoteExtensions.reduce((map: Map<string, ISyncExtension>, extension: ISyncExtension) => addExtensionToMap(map, deepClone(extension)), new Map<string, ISyncExtension>());
	const lastSyncExtensionsMap = lastSyncExtensions ? lastSyncExtensions.reduce(addExtensionToMap, new Map<string, ISyncExtension>()) : null;
	const skippedExtensionsMap = skippedExtensions.reduce(addExtensionToMap, new Map<string, ISyncExtension>());
	const ignoredExtensionsSet = ignoredExtensions.reduce((set, id) => {
		const uuid = uuids.get(id.toLowerCase());
		return set.add(uuid ? `uuid:${uuid}` : `id:${id.toLowerCase()}`);
	}, new Set<string>());
	const lastSyncBuiltinExtensionsSet = lastSyncBuiltinExtensions ? lastSyncBuiltinExtensions.reduce((set, { id, uuid }) => {
		uuid = uuid ?? uuids.get(id.toLowerCase());
		return set.add(uuid ? `uuid:${uuid}` : `id:${id.toLowerCase()}`);
	}, new Set<string>()) : null;

	const localToRemote = compare(localExtensionsMap, remoteExtensionsMap, ignoredExtensionsSet, false);
	if (localToRemote.added.size > 0 || localToRemote.removed.size > 0 || localToRemote.updated.size > 0) {

		const baseToLocal = compare(lastSyncExtensionsMap, localExtensionsMap, ignoredExtensionsSet, false);
		const baseToRemote = compare(lastSyncExtensionsMap, remoteExtensionsMap, ignoredExtensionsSet, true);

		const merge = (key: string, localExtension: ISyncExtension, remoteExtension: ISyncExtension, preferred: ISyncExtension): ISyncExtension => {
			let pinned: boolean | undefined, version: string | undefined, preRelease: boolean | undefined;
			if (localExtension.installed) {
				pinned = preferred.pinned;
				preRelease = preferred.preRelease;
				if (pinned) {
					version = preferred.version;
				}
			} else {
				pinned = remoteExtension.pinned;
				preRelease = remoteExtension.preRelease;
				if (pinned) {
					version = remoteExtension.version;
				}
			}
			if (pinned === undefined /* from older client*/) {
				pinned = localExtension.pinned;
				if (pinned) {
					version = localExtension.version;
				}
			}
			if (preRelease === undefined /* from older client*/) {
				preRelease = localExtension.preRelease;
			}
			return {
				...preferred,
				installed: localExtension.installed || remoteExtension.installed,
				pinned,
				preRelease,
				version: version ?? (remoteExtension.version && (!localExtension.installed || semver.gt(remoteExtension.version, localExtension.version)) ? remoteExtension.version : localExtension.version),
				state: mergeExtensionState(localExtension, remoteExtension, lastSyncExtensionsMap?.get(key)),
			};
		};

		// Remotely removed extension => exist in base and does not in remote
		for (const key of baseToRemote.removed.values()) {
			const localExtension = localExtensionsMap.get(key);
			if (!localExtension) {
				continue;
			}

			const baseExtension = assertReturnsDefined(lastSyncExtensionsMap?.get(key));
			const wasAnInstalledExtensionDuringLastSync = lastSyncBuiltinExtensionsSet && !lastSyncBuiltinExtensionsSet.has(key) && baseExtension.installed;
			if (localExtension.installed && wasAnInstalledExtensionDuringLastSync /* It is an installed extension now and during last sync */) {
				// Installed extension is removed from remote. Remove it from local.
				removed.push(localExtension.identifier);
			} else {
				// Add to remote: It is a builtin extenision or got installed after last sync
				newRemoteExtensionsMap.set(key, localExtension);
			}

		}

		// Remotely added extension => does not exist in base and exist in remote
		for (const key of baseToRemote.added.values()) {
			const remoteExtension = assertReturnsDefined(remoteExtensionsMap.get(key));
			const localExtension = localExtensionsMap.get(key);

			// Also exist in local
			if (localExtension) {
				// Is different from local to remote
				if (localToRemote.updated.has(key)) {
					const mergedExtension = merge(key, localExtension, remoteExtension, remoteExtension);
					// Update locally only when the extension has changes in properties other than installed poperty
					if (!areSame(localExtension, remoteExtension, false, false)) {
						updated.push(massageOutgoingExtension(mergedExtension, key));
					}
					newRemoteExtensionsMap.set(key, mergedExtension);
				}
			} else {
				// Add only if the extension is an installed extension
				if (remoteExtension.installed) {
					added.push(massageOutgoingExtension(remoteExtension, key));
				}
			}
		}

		// Remotely updated extension => exist in base and remote
		for (const key of baseToRemote.updated.values()) {
			const remoteExtension = assertReturnsDefined(remoteExtensionsMap.get(key));
			const baseExtension = assertReturnsDefined(lastSyncExtensionsMap?.get(key));
			const localExtension = localExtensionsMap.get(key);

			// Also exist in local
			if (localExtension) {
				const wasAnInstalledExtensionDuringLastSync = lastSyncBuiltinExtensionsSet && !lastSyncBuiltinExtensionsSet.has(key) && baseExtension.installed;
				if (wasAnInstalledExtensionDuringLastSync && localExtension.installed && !remoteExtension.installed) {
					// Remove it locally if it is installed locally and not remotely
					removed.push(localExtension.identifier);
				} else {
					// Update in local always
					const mergedExtension = merge(key, localExtension, remoteExtension, remoteExtension);
					updated.push(massageOutgoingExtension(mergedExtension, key));
					newRemoteExtensionsMap.set(key, mergedExtension);
				}
			}
			// Add it locally if does not exist locally and installed remotely
			else if (remoteExtension.installed) {
				added.push(massageOutgoingExtension(remoteExtension, key));
			}

		}

		// Locally added extension => does not exist in base and exist in local
		for (const key of baseToLocal.added.values()) {
			// If added in remote (already handled)
			if (baseToRemote.added.has(key)) {
				continue;
			}
			newRemoteExtensionsMap.set(key, assertReturnsDefined(localExtensionsMap.get(key)));
		}

		// Locally updated extension => exist in base and local
		for (const key of baseToLocal.updated.values()) {
			// If removed in remote (already handled)
			if (baseToRemote.removed.has(key)) {
				continue;
			}
			// If updated in remote (already handled)
			if (baseToRemote.updated.has(key)) {
				continue;
			}
			const localExtension = assertReturnsDefined(localExtensionsMap.get(key));
			const remoteExtension = assertReturnsDefined(remoteExtensionsMap.get(key));
			// Update remotely
			newRemoteExtensionsMap.set(key, merge(key, localExtension, remoteExtension, localExtension));
		}

		// Locally removed extensions => exist in base and does not exist in local
		for (const key of baseToLocal.removed.values()) {
			// If updated in remote (already handled)
			if (baseToRemote.updated.has(key)) {
				continue;
			}
			// If removed in remote (already handled)
			if (baseToRemote.removed.has(key)) {
				continue;
			}
			// Skipped
			if (skippedExtensionsMap.has(key)) {
				continue;
			}
			// Skip if it is a builtin extension
			if (!assertReturnsDefined(remoteExtensionsMap.get(key)).installed) {
				continue;
			}
			// Skip if last sync builtin extensions set is not available
			if (!lastSyncBuiltinExtensionsSet) {
				continue;
			}
			// Skip if it was a builtin extension during last sync
			if (lastSyncBuiltinExtensionsSet.has(key) || !assertReturnsDefined(lastSyncExtensionsMap?.get(key)).installed) {
				continue;
			}
			newRemoteExtensionsMap.delete(key);
		}
	}

	const remote: ISyncExtension[] = [];
	const remoteChanges = compare(remoteExtensionsMap, newRemoteExtensionsMap, new Set<string>(), true);
	const hasRemoteChanges = remoteChanges.added.size > 0 || remoteChanges.updated.size > 0 || remoteChanges.removed.size > 0;
	if (hasRemoteChanges) {
		newRemoteExtensionsMap.forEach((value, key) => remote.push(massageOutgoingExtension(value, key)));
	}

	return {
		local: { added, removed, updated },
		remote: hasRemoteChanges ? {
			added: [...remoteChanges.added].map(id => newRemoteExtensionsMap.get(id)!),
			updated: [...remoteChanges.updated].map(id => newRemoteExtensionsMap.get(id)!),
			removed: [...remoteChanges.removed].map(id => remoteExtensionsMap.get(id)!),
			all: remote
		} : null
	};
}

function compare(from: Map<string, ISyncExtension> | null, to: Map<string, ISyncExtension>, ignoredExtensions: Set<string>, checkVersionProperty: boolean): { added: Set<string>; removed: Set<string>; updated: Set<string> } {
	const fromKeys = from ? [...from.keys()].filter(key => !ignoredExtensions.has(key)) : [];
	const toKeys = [...to.keys()].filter(key => !ignoredExtensions.has(key));
	const added = toKeys.filter(key => !fromKeys.includes(key)).reduce((r, key) => { r.add(key); return r; }, new Set<string>());
	const removed = fromKeys.filter(key => !toKeys.includes(key)).reduce((r, key) => { r.add(key); return r; }, new Set<string>());
	const updated: Set<string> = new Set<string>();

	for (const key of fromKeys) {
		if (removed.has(key)) {
			continue;
		}
		const fromExtension = from!.get(key)!;
		const toExtension = to.get(key);
		if (!toExtension || !areSame(fromExtension, toExtension, checkVersionProperty, true)) {
			updated.add(key);
		}
	}

	return { added, removed, updated };
}

function areSame(fromExtension: ISyncExtension, toExtension: ISyncExtension, checkVersionProperty: boolean, checkInstalledProperty: boolean): boolean {
	if (fromExtension.disabled !== toExtension.disabled) {
		/* extension enablement changed */
		return false;
	}

	if (!!fromExtension.isApplicationScoped !== !!toExtension.isApplicationScoped) {
		/* extension application scope has changed */
		return false;
	}

	if (checkInstalledProperty && fromExtension.installed !== toExtension.installed) {
		/* extension installed property changed */
		return false;
	}

	if (fromExtension.installed && toExtension.installed) {

		if (fromExtension.preRelease !== toExtension.preRelease) {
			/* installed extension's pre-release version changed */
			return false;
		}

		if (fromExtension.pinned !== toExtension.pinned) {
			/* installed extension's pinning changed */
			return false;
		}

		if (toExtension.pinned && fromExtension.version !== toExtension.version) {
			/* installed extension's pinned version changed */
			return false;
		}
	}

	if (!isSameExtensionState(fromExtension.state, toExtension.state)) {
		/* extension state changed */
		return false;
	}

	if ((checkVersionProperty && fromExtension.version !== toExtension.version)) {
		/* extension version changed */
		return false;
	}

	return true;
}

function mergeExtensionState(localExtension: ISyncExtension, remoteExtension: ISyncExtension, lastSyncExtension: ISyncExtension | undefined): IStringDictionary<any> | undefined {
	const localState = localExtension.state;
	const remoteState = remoteExtension.state;
	const baseState = lastSyncExtension?.state;

	// If remote extension has no version, use local state
	if (!remoteExtension.version) {
		return localState;
	}

	// If local state exists and local extension is latest then use local state
	if (localState && semver.gt(localExtension.version, remoteExtension.version)) {
		return localState;
	}
	// If remote state exists and remote extension is latest, use remote state
	if (remoteState && semver.gt(remoteExtension.version, localExtension.version)) {
		return remoteState;
	}


	/* Remote and local are on same version */

	// If local state is not yet set, use remote state
	if (!localState) {
		return remoteState;
	}
	// If remote state is not yet set, use local state
	if (!remoteState) {
		return localState;
	}

	const mergedState: IStringDictionary<any> = deepClone(localState);
	const baseToRemote = baseState ? compareExtensionState(baseState, remoteState) : { added: Object.keys(remoteState).reduce((r, k) => { r.add(k); return r; }, new Set<string>()), removed: new Set<string>(), updated: new Set<string>() };
	const baseToLocal = baseState ? compareExtensionState(baseState, localState) : { added: Object.keys(localState).reduce((r, k) => { r.add(k); return r; }, new Set<string>()), removed: new Set<string>(), updated: new Set<string>() };
	// Added/Updated in remote
	for (const key of [...baseToRemote.added.values(), ...baseToRemote.updated.values()]) {
		mergedState[key] = remoteState[key];
	}
	// Removed in remote
	for (const key of baseToRemote.removed.values()) {
		// Not updated in local
		if (!baseToLocal.updated.has(key)) {
			delete mergedState[key];
		}
	}
	return mergedState;
}

function compareExtensionState(from: IStringDictionary<any>, to: IStringDictionary<any>): { added: Set<string>; removed: Set<string>; updated: Set<string> } {
	const fromKeys = Object.keys(from);
	const toKeys = Object.keys(to);
	const added = toKeys.filter(key => !fromKeys.includes(key)).reduce((r, key) => { r.add(key); return r; }, new Set<string>());
	const removed = fromKeys.filter(key => !toKeys.includes(key)).reduce((r, key) => { r.add(key); return r; }, new Set<string>());
	const updated: Set<string> = new Set<string>();

	for (const key of fromKeys) {
		if (removed.has(key)) {
			continue;
		}
		const value1 = from[key];
		const value2 = to[key];
		if (!equals(value1, value2)) {
			updated.add(key);
		}
	}

	return { added, removed, updated };
}

function isSameExtensionState(a: IStringDictionary<any> = {}, b: IStringDictionary<any> = {}): boolean {
	const { added, removed, updated } = compareExtensionState(a, b);
	return added.size === 0 && removed.size === 0 && updated.size === 0;
}

// massage incoming extension - add optional properties
function massageIncomingExtension(extension: ISyncExtension): ISyncExtension {
	return { ...extension, ...{ disabled: !!extension.disabled, installed: !!extension.installed } };
}

// massage outgoing extension - remove optional properties
function massageOutgoingExtension(extension: ISyncExtension, key: string): ISyncExtension {
	const massagedExtension: ISyncExtension = {
		...extension,
		identifier: {
			id: extension.identifier.id,
			uuid: key.startsWith('uuid:') ? key.substring('uuid:'.length) : undefined
		},
		/* set following always so that to differentiate with older clients */
		preRelease: !!extension.preRelease,
		pinned: !!extension.pinned,
	};
	if (!extension.disabled) {
		delete massagedExtension.disabled;
	}
	if (!extension.installed) {
		delete massagedExtension.installed;
	}
	if (!extension.state) {
		delete massagedExtension.state;
	}
	if (!extension.isApplicationScoped) {
		delete massagedExtension.isApplicationScoped;
	}
	return massagedExtension;
}
```

--------------------------------------------------------------------------------

````

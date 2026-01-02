---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 464
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 464 of 552)

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

---[FILE: src/vs/workbench/contrib/terminal/test/browser/terminalProfileService.integrationTest.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/terminalProfileService.integrationTest.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual } from 'assert';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Emitter } from '../../../../../base/common/event.js';
import { isLinux, isWindows, OperatingSystem } from '../../../../../base/common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ConfigurationTarget, IConfigurationService, type IConfigurationChangeEvent } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IPickOptions, IQuickInputService, Omit, QuickPickInput } from '../../../../../platform/quickinput/common/quickInput.js';
import { IRemoteAgentEnvironment } from '../../../../../platform/remote/common/remoteAgentEnvironment.js';
import { IExtensionTerminalProfile, ITerminalBackend, ITerminalProfile } from '../../../../../platform/terminal/common/terminal.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { TestThemeService } from '../../../../../platform/theme/test/common/testThemeService.js';
import { ITerminalInstanceService } from '../../browser/terminal.js';
import { IProfileQuickPickItem, TerminalProfileQuickpick } from '../../browser/terminalProfileQuickpick.js';
import { TerminalProfileService } from '../../browser/terminalProfileService.js';
import { ITerminalConfiguration, ITerminalProfileService } from '../../common/terminal.js';
import { ITerminalContributionService } from '../../common/terminalExtensionPoints.js';
import { IWorkbenchEnvironmentService } from '../../../../services/environment/common/environmentService.js';
import { IExtensionService } from '../../../../services/extensions/common/extensions.js';
import { IRemoteAgentService } from '../../../../services/remote/common/remoteAgentService.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { TestExtensionService } from '../../../../test/common/workbenchTestServices.js';
import type { SingleOrMany } from '../../../../../base/common/types.js';

class TestTerminalProfileService extends TerminalProfileService implements Partial<ITerminalProfileService> {
	hasRefreshedProfiles: Promise<void> | undefined;
	override refreshAvailableProfiles(): void {
		this.hasRefreshedProfiles = this._refreshAvailableProfilesNow();
	}
	refreshAndAwaitAvailableProfiles(): Promise<void> {
		this.refreshAvailableProfiles();
		if (!this.hasRefreshedProfiles) {
			throw new Error('has not refreshed profiles yet');
		}
		return this.hasRefreshedProfiles;
	}
}

class MockTerminalProfileService implements Partial<ITerminalProfileService> {
	hasRefreshedProfiles: Promise<void> | undefined;
	_defaultProfileName: string | undefined;
	availableProfiles?: ITerminalProfile[] | undefined = [];
	contributedProfiles?: IExtensionTerminalProfile[] | undefined = [];
	async getPlatformKey(): Promise<string> {
		return 'linux';
	}
	getDefaultProfileName(): string | undefined {
		return this._defaultProfileName;
	}
	setProfiles(profiles: ITerminalProfile[], contributed: IExtensionTerminalProfile[]): void {
		this.availableProfiles = profiles;
		this.contributedProfiles = contributed;
	}
	setDefaultProfileName(name: string): void {
		this._defaultProfileName = name;
	}
}


class MockQuickInputService implements Partial<IQuickInputService> {
	_pick: IProfileQuickPickItem = powershellPick;
	pick(picks: QuickPickInput<IProfileQuickPickItem>[] | Promise<QuickPickInput<IProfileQuickPickItem>[]>, options?: IPickOptions<IProfileQuickPickItem> & { canPickMany: true }, token?: CancellationToken): Promise<IProfileQuickPickItem[] | undefined>;
	pick(picks: QuickPickInput<IProfileQuickPickItem>[] | Promise<QuickPickInput<IProfileQuickPickItem>[]>, options?: IPickOptions<IProfileQuickPickItem> & { canPickMany: false }, token?: CancellationToken): Promise<IProfileQuickPickItem | undefined>;
	pick(picks: QuickPickInput<IProfileQuickPickItem>[] | Promise<QuickPickInput<IProfileQuickPickItem>[]>, options?: Omit<IPickOptions<IProfileQuickPickItem>, 'canPickMany'>, token?: CancellationToken): Promise<IProfileQuickPickItem | undefined>;
	async pick(picks: any, options?: any, token?: any): Promise<SingleOrMany<IProfileQuickPickItem> | undefined> {
		Promise.resolve(picks);
		return this._pick;
	}

	setPick(pick: IProfileQuickPickItem) {
		this._pick = pick;
	}
}

class TestTerminalProfileQuickpick extends TerminalProfileQuickpick {

}

class TestTerminalExtensionService extends TestExtensionService {
	readonly _onDidChangeExtensions = new Emitter<void>();
}

class TestTerminalContributionService implements ITerminalContributionService {
	_serviceBrand: undefined;
	terminalProfiles: readonly IExtensionTerminalProfile[] = [];
	terminalCompletionProviders: readonly import('../../common/terminalExtensionPoints.js').IExtensionTerminalCompletionProvider[] = [];
	private _onDidChangeTerminalCompletionProviders = new Emitter<void>();
	readonly onDidChangeTerminalCompletionProviders = this._onDidChangeTerminalCompletionProviders.event;
	setProfiles(profiles: IExtensionTerminalProfile[]): void {
		this.terminalProfiles = profiles;
	}
}

class TestTerminalInstanceService implements Partial<ITerminalInstanceService> {
	private _profiles: Map<string, ITerminalProfile[]> = new Map();
	private _hasReturnedNone = true;
	async getBackend(remoteAuthority: string | undefined): Promise<ITerminalBackend> {
		return {
			getProfiles: async () => {
				if (this._hasReturnedNone) {
					return this._profiles.get(remoteAuthority ?? '') || [];
				} else {
					this._hasReturnedNone = true;
					return [];
				}
			}
		} satisfies Partial<ITerminalBackend> as unknown as ITerminalBackend;
	}
	setProfiles(remoteAuthority: string | undefined, profiles: ITerminalProfile[]) {
		this._profiles.set(remoteAuthority ?? '', profiles);
	}
	setReturnNone() {
		this._hasReturnedNone = false;
	}
}

class TestRemoteAgentService implements Partial<IRemoteAgentService> {
	private _os: OperatingSystem | undefined;
	setEnvironment(os: OperatingSystem) {
		this._os = os;
	}
	async getEnvironment(): Promise<IRemoteAgentEnvironment | null> {
		return { os: this._os } satisfies Partial<IRemoteAgentEnvironment> as unknown as IRemoteAgentEnvironment;
	}
}

const defaultTerminalConfig: Partial<ITerminalConfiguration> = { profiles: { windows: {}, linux: {}, osx: {} } };
let powershellProfile = {
	profileName: 'PowerShell',
	path: 'C:\\Powershell.exe',
	isDefault: true,
	icon: Codicon.terminalPowershell
};
let jsdebugProfile = {
	extensionIdentifier: 'ms-vscode.js-debug-nightly',
	icon: 'debug',
	id: 'extension.js-debug.debugTerminal',
	title: 'JavaScript Debug Terminal'
};
const powershellPick = { label: 'Powershell', profile: powershellProfile, profileName: powershellProfile.profileName };
const jsdebugPick = { label: 'Javascript Debug Terminal', profile: jsdebugProfile, profileName: jsdebugProfile.title };

suite('TerminalProfileService', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let configurationService: TestConfigurationService;
	let terminalInstanceService: TestTerminalInstanceService;
	let terminalProfileService: TestTerminalProfileService;
	let remoteAgentService: TestRemoteAgentService;
	let extensionService: TestTerminalExtensionService;
	let instantiationService: TestInstantiationService;

	setup(async () => {
		configurationService = new TestConfigurationService({
			files: {},
			terminal: {
				integrated: defaultTerminalConfig
			}
		});
		instantiationService = workbenchInstantiationService({
			configurationService: () => configurationService
		}, store);
		remoteAgentService = new TestRemoteAgentService();
		terminalInstanceService = new TestTerminalInstanceService();
		extensionService = new TestTerminalExtensionService();

		const themeService = new TestThemeService();
		const terminalContributionService = new TestTerminalContributionService();

		instantiationService.stub(IExtensionService, extensionService);
		instantiationService.stub(IConfigurationService, configurationService);
		instantiationService.stub(IRemoteAgentService, remoteAgentService);
		instantiationService.stub(ITerminalContributionService, terminalContributionService);
		instantiationService.stub(ITerminalInstanceService, terminalInstanceService);
		instantiationService.stub(IWorkbenchEnvironmentService, { remoteAuthority: undefined });
		instantiationService.stub(IThemeService, themeService);

		terminalProfileService = store.add(instantiationService.createInstance(TestTerminalProfileService));

		//reset as these properties are changed in each test
		powershellProfile = {
			profileName: 'PowerShell',
			path: 'C:\\Powershell.exe',
			isDefault: true,
			icon: Codicon.terminalPowershell
		};
		jsdebugProfile = {
			extensionIdentifier: 'ms-vscode.js-debug-nightly',
			icon: 'debug',
			id: 'extension.js-debug.debugTerminal',
			title: 'JavaScript Debug Terminal'
		};

		terminalInstanceService.setProfiles(undefined, [powershellProfile]);
		terminalInstanceService.setProfiles('fakeremote', []);
		terminalContributionService.setProfiles([jsdebugProfile]);
		if (isWindows) {
			remoteAgentService.setEnvironment(OperatingSystem.Windows);
		} else if (isLinux) {
			remoteAgentService.setEnvironment(OperatingSystem.Linux);
		} else {
			remoteAgentService.setEnvironment(OperatingSystem.Macintosh);
		}
		configurationService.setUserConfiguration('terminal', { integrated: defaultTerminalConfig });
	});

	suite('Contributed Profiles', () => {
		test('should filter out contributed profiles set to null (Linux)', async () => {
			remoteAgentService.setEnvironment(OperatingSystem.Linux);
			await configurationService.setUserConfiguration('terminal', {
				integrated: {
					profiles: {
						linux: {
							'JavaScript Debug Terminal': null
						}
					}
				}
			});
			configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true, source: ConfigurationTarget.USER } satisfies Partial<IConfigurationChangeEvent> as unknown as IConfigurationChangeEvent);
			await terminalProfileService.refreshAndAwaitAvailableProfiles();
			deepStrictEqual(terminalProfileService.availableProfiles, [powershellProfile]);
			deepStrictEqual(terminalProfileService.contributedProfiles, []);
		});
		test('should filter out contributed profiles set to null (Windows)', async () => {
			remoteAgentService.setEnvironment(OperatingSystem.Windows);
			await configurationService.setUserConfiguration('terminal', {
				integrated: {
					profiles: {
						windows: {
							'JavaScript Debug Terminal': null
						}
					}
				}
			});
			configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true, source: ConfigurationTarget.USER } satisfies Partial<IConfigurationChangeEvent> as unknown as IConfigurationChangeEvent);
			await terminalProfileService.refreshAndAwaitAvailableProfiles();
			deepStrictEqual(terminalProfileService.availableProfiles, [powershellProfile]);
			deepStrictEqual(terminalProfileService.contributedProfiles, []);
		});
		test('should filter out contributed profiles set to null (macOS)', async () => {
			remoteAgentService.setEnvironment(OperatingSystem.Macintosh);
			await configurationService.setUserConfiguration('terminal', {
				integrated: {
					profiles: {
						osx: {
							'JavaScript Debug Terminal': null
						}
					}
				}
			});
			configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true, source: ConfigurationTarget.USER } satisfies Partial<IConfigurationChangeEvent> as unknown as IConfigurationChangeEvent);
			await terminalProfileService.refreshAndAwaitAvailableProfiles();
			deepStrictEqual(terminalProfileService.availableProfiles, [powershellProfile]);
			deepStrictEqual(terminalProfileService.contributedProfiles, []);
		});
		test('should include contributed profiles', async () => {
			await terminalProfileService.refreshAndAwaitAvailableProfiles();
			deepStrictEqual(terminalProfileService.availableProfiles, [powershellProfile]);
			deepStrictEqual(terminalProfileService.contributedProfiles, [jsdebugProfile]);
		});
	});

	test('should get profiles from remoteTerminalService when there is a remote authority', async () => {
		instantiationService.stub(IWorkbenchEnvironmentService, { remoteAuthority: 'fakeremote' });
		terminalProfileService = store.add(instantiationService.createInstance(TestTerminalProfileService));
		await terminalProfileService.hasRefreshedProfiles;
		deepStrictEqual(terminalProfileService.availableProfiles, []);
		deepStrictEqual(terminalProfileService.contributedProfiles, [jsdebugProfile]);
		terminalInstanceService.setProfiles('fakeremote', [powershellProfile]);
		await terminalProfileService.refreshAndAwaitAvailableProfiles();
		deepStrictEqual(terminalProfileService.availableProfiles, [powershellProfile]);
		deepStrictEqual(terminalProfileService.contributedProfiles, [jsdebugProfile]);
	});

	test('should fire onDidChangeAvailableProfiles only when available profiles have changed via user config', async () => {
		powershellProfile.icon = Codicon.lightBulb;
		let calls: ITerminalProfile[][] = [];
		store.add(terminalProfileService.onDidChangeAvailableProfiles(e => calls.push(e)));
		await configurationService.setUserConfiguration('terminal', {
			integrated: {
				profiles: {
					windows: powershellProfile,
					linux: powershellProfile,
					osx: powershellProfile
				}
			}
		});
		await terminalProfileService.hasRefreshedProfiles;
		deepStrictEqual(calls, [
			[powershellProfile]
		]);
		deepStrictEqual(terminalProfileService.availableProfiles, [powershellProfile]);
		deepStrictEqual(terminalProfileService.contributedProfiles, [jsdebugProfile]);
		calls = [];
		await terminalProfileService.refreshAndAwaitAvailableProfiles();
		deepStrictEqual(calls, []);
	});

	test('should fire onDidChangeAvailableProfiles when available or contributed profiles have changed via remote/localTerminalService', async () => {
		powershellProfile.isDefault = false;
		terminalInstanceService.setProfiles(undefined, [powershellProfile]);
		const calls: ITerminalProfile[][] = [];
		store.add(terminalProfileService.onDidChangeAvailableProfiles(e => calls.push(e)));
		await terminalProfileService.hasRefreshedProfiles;
		deepStrictEqual(calls, [
			[powershellProfile]
		]);
		deepStrictEqual(terminalProfileService.availableProfiles, [powershellProfile]);
		deepStrictEqual(terminalProfileService.contributedProfiles, [jsdebugProfile]);
	});

	test('should call refreshAvailableProfiles _onDidChangeExtensions', async () => {
		extensionService._onDidChangeExtensions.fire();
		const calls: ITerminalProfile[][] = [];
		store.add(terminalProfileService.onDidChangeAvailableProfiles(e => calls.push(e)));
		await terminalProfileService.hasRefreshedProfiles;
		deepStrictEqual(calls, [
			[powershellProfile]
		]);
		deepStrictEqual(terminalProfileService.availableProfiles, [powershellProfile]);
		deepStrictEqual(terminalProfileService.contributedProfiles, [jsdebugProfile]);
	});
	suite('Profiles Quickpick', () => {
		let quickInputService: MockQuickInputService;
		let mockTerminalProfileService: MockTerminalProfileService;
		let terminalProfileQuickpick: TestTerminalProfileQuickpick;
		setup(async () => {
			quickInputService = new MockQuickInputService();
			mockTerminalProfileService = new MockTerminalProfileService();
			instantiationService.stub(IQuickInputService, quickInputService);
			instantiationService.stub(ITerminalProfileService, mockTerminalProfileService);
			terminalProfileQuickpick = instantiationService.createInstance(TestTerminalProfileQuickpick);
		});
		test('setDefault', async () => {
			powershellProfile.isDefault = false;
			mockTerminalProfileService.setProfiles([powershellProfile], [jsdebugProfile]);
			mockTerminalProfileService.setDefaultProfileName(jsdebugProfile.title);
			const result = await terminalProfileQuickpick.showAndGetResult('setDefault');
			deepStrictEqual(result, powershellProfile.profileName);
		});
		test('setDefault to contributed', async () => {
			mockTerminalProfileService.setDefaultProfileName(powershellProfile.profileName);
			quickInputService.setPick(jsdebugPick);
			const result = await terminalProfileQuickpick.showAndGetResult('setDefault');
			const expected = {
				config: {
					extensionIdentifier: jsdebugProfile.extensionIdentifier,
					id: jsdebugProfile.id,
					options: { color: undefined, icon: 'debug' },
					title: jsdebugProfile.title,
				},
				keyMods: undefined
			};
			deepStrictEqual(result, expected);
		});

		test('createInstance', async () => {
			mockTerminalProfileService.setDefaultProfileName(powershellProfile.profileName);
			const pick = { ...powershellPick, keyMods: { alt: true, ctrlCmd: false } };
			quickInputService.setPick(pick);
			const result = await terminalProfileQuickpick.showAndGetResult('createInstance');
			deepStrictEqual(result, { config: powershellProfile, keyMods: { alt: true, ctrlCmd: false } });
		});

		test('createInstance with contributed', async () => {
			const pick = { ...jsdebugPick, keyMods: { alt: true, ctrlCmd: false } };
			quickInputService.setPick(pick);
			const result = await terminalProfileQuickpick.showAndGetResult('createInstance');
			const expected = {
				config: {
					extensionIdentifier: jsdebugProfile.extensionIdentifier,
					id: jsdebugProfile.id,
					options: { color: undefined, icon: 'debug' },
					title: jsdebugProfile.title,
				},
				keyMods: { alt: true, ctrlCmd: false }
			};
			deepStrictEqual(result, expected);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/browser/terminalService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/terminalService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { fail } from 'assert';
import { Emitter } from '../../../../../base/common/event.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { TestDialogService } from '../../../../../platform/dialogs/test/common/testDialogService.js';
import { TerminalLocation } from '../../../../../platform/terminal/common/terminal.js';
import { ITerminalInstance, ITerminalInstanceService, ITerminalService } from '../../browser/terminal.js';
import { TerminalService } from '../../browser/terminalService.js';
import { TERMINAL_CONFIG_SECTION } from '../../common/terminal.js';
import { IRemoteAgentService } from '../../../../services/remote/common/remoteAgentService.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import type { IConfigurationChangeEvent } from '../../../../../platform/configuration/common/configuration.js';

suite('Workbench - TerminalService', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let terminalService: TerminalService;
	let configurationService: TestConfigurationService;
	let dialogService: TestDialogService;

	setup(async () => {
		dialogService = new TestDialogService();
		configurationService = new TestConfigurationService({
			files: {},
			terminal: {
				integrated: {
					confirmOnKill: 'never'
				}
			}
		});

		const instantiationService = workbenchInstantiationService({
			configurationService: () => configurationService,
		}, store);
		instantiationService.stub(IDialogService, dialogService);
		instantiationService.stub(ITerminalInstanceService, 'getBackend', undefined);
		instantiationService.stub(ITerminalInstanceService, 'getRegisteredBackends', []);
		instantiationService.stub(IRemoteAgentService, 'getConnection', null);

		terminalService = store.add(instantiationService.createInstance(TerminalService));
		instantiationService.stub(ITerminalService, terminalService);
	});

	suite('safeDisposeTerminal', () => {
		let onExitEmitter: Emitter<number | undefined>;

		setup(() => {
			onExitEmitter = store.add(new Emitter<number | undefined>());
		});

		test('should not show prompt when confirmOnKill is never', async () => {
			await setConfirmOnKill(configurationService, 'never');
			await terminalService.safeDisposeTerminal({
				target: TerminalLocation.Editor,
				hasChildProcesses: true,
				onExit: onExitEmitter.event,
				dispose: () => onExitEmitter.fire(undefined)
			} satisfies Partial<ITerminalInstance> as unknown as ITerminalInstance);
			await terminalService.safeDisposeTerminal({
				target: TerminalLocation.Panel,
				hasChildProcesses: true,
				onExit: onExitEmitter.event,
				dispose: () => onExitEmitter.fire(undefined)
			} satisfies Partial<ITerminalInstance> as unknown as ITerminalInstance);
		});
		test('should not show prompt when any terminal editor is closed (handled by editor itself)', async () => {
			await setConfirmOnKill(configurationService, 'editor');
			terminalService.safeDisposeTerminal({
				target: TerminalLocation.Editor,
				hasChildProcesses: true,
				onExit: onExitEmitter.event,
				dispose: () => onExitEmitter.fire(undefined)
			} satisfies Partial<ITerminalInstance> as unknown as ITerminalInstance);
			await setConfirmOnKill(configurationService, 'always');
			terminalService.safeDisposeTerminal({
				target: TerminalLocation.Editor,
				hasChildProcesses: true,
				onExit: onExitEmitter.event,
				dispose: () => onExitEmitter.fire(undefined)
			} satisfies Partial<ITerminalInstance> as unknown as ITerminalInstance);
		});
		test('should not show prompt when confirmOnKill is editor and panel terminal is closed', async () => {
			await setConfirmOnKill(configurationService, 'editor');
			terminalService.safeDisposeTerminal({
				target: TerminalLocation.Panel,
				hasChildProcesses: true,
				onExit: onExitEmitter.event,
				dispose: () => onExitEmitter.fire(undefined)
			} satisfies Partial<ITerminalInstance> as unknown as ITerminalInstance);
		});
		test('should show prompt when confirmOnKill is panel and panel terminal is closed', async () => {
			await setConfirmOnKill(configurationService, 'panel');
			// No child process cases
			dialogService.setConfirmResult({ confirmed: false });
			terminalService.safeDisposeTerminal({
				target: TerminalLocation.Panel,
				hasChildProcesses: false,
				onExit: onExitEmitter.event,
				dispose: () => onExitEmitter.fire(undefined)
			} satisfies Partial<ITerminalInstance> as unknown as ITerminalInstance);
			dialogService.setConfirmResult({ confirmed: true });
			terminalService.safeDisposeTerminal({
				target: TerminalLocation.Panel,
				hasChildProcesses: false,
				onExit: onExitEmitter.event,
				dispose: () => onExitEmitter.fire(undefined)
			} satisfies Partial<ITerminalInstance> as unknown as ITerminalInstance);
			// Child process cases
			dialogService.setConfirmResult({ confirmed: false });
			await terminalService.safeDisposeTerminal({
				target: TerminalLocation.Panel,
				hasChildProcesses: true,
				dispose: () => fail()
			} satisfies Partial<ITerminalInstance> as unknown as ITerminalInstance);
			dialogService.setConfirmResult({ confirmed: true });
			terminalService.safeDisposeTerminal({
				target: TerminalLocation.Panel,
				hasChildProcesses: true,
				onExit: onExitEmitter.event,
				dispose: () => onExitEmitter.fire(undefined)
			} satisfies Partial<ITerminalInstance> as unknown as ITerminalInstance);
		});
		test('should show prompt when confirmOnKill is always and panel terminal is closed', async () => {
			await setConfirmOnKill(configurationService, 'always');
			// No child process cases
			dialogService.setConfirmResult({ confirmed: false });
			terminalService.safeDisposeTerminal({
				target: TerminalLocation.Panel,
				hasChildProcesses: false,
				onExit: onExitEmitter.event,
				dispose: () => onExitEmitter.fire(undefined)
			} satisfies Partial<ITerminalInstance> as unknown as ITerminalInstance);
			dialogService.setConfirmResult({ confirmed: true });
			terminalService.safeDisposeTerminal({
				target: TerminalLocation.Panel,
				hasChildProcesses: false,
				onExit: onExitEmitter.event,
				dispose: () => onExitEmitter.fire(undefined)
			} satisfies Partial<ITerminalInstance> as unknown as ITerminalInstance);
			// Child process cases
			dialogService.setConfirmResult({ confirmed: false });
			await terminalService.safeDisposeTerminal({
				target: TerminalLocation.Panel,
				hasChildProcesses: true,
				dispose: () => fail()
			} satisfies Partial<ITerminalInstance> as unknown as ITerminalInstance);
			dialogService.setConfirmResult({ confirmed: true });
			terminalService.safeDisposeTerminal({
				target: TerminalLocation.Panel,
				hasChildProcesses: true,
				onExit: onExitEmitter.event,
				dispose: () => onExitEmitter.fire(undefined)
			} satisfies Partial<ITerminalInstance> as unknown as ITerminalInstance);
		});
	});
});

async function setConfirmOnKill(configurationService: TestConfigurationService, value: 'never' | 'always' | 'panel' | 'editor') {
	await configurationService.setUserConfiguration(TERMINAL_CONFIG_SECTION, { confirmOnKill: value });
	configurationService.onDidChangeConfigurationEmitter.fire({
		affectsConfiguration: () => true,
		affectedKeys: ['terminal.integrated.confirmOnKill']
	} as unknown as IConfigurationChangeEvent);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/browser/terminalStatusList.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/terminalStatusList.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual, strictEqual } from 'assert';
import { Codicon } from '../../../../../base/common/codicons.js';
import Severity from '../../../../../base/common/severity.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { spinningLoading } from '../../../../../platform/theme/common/iconRegistry.js';
import { TerminalStatusList } from '../../browser/terminalStatusList.js';
import { ITerminalStatus } from '../../common/terminal.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';

function statusesEqual(list: TerminalStatusList, expected: [string, Severity][]) {
	deepStrictEqual(list.statuses.map(e => [e.id, e.severity]), expected);
}

suite('Workbench - TerminalStatusList', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();
	let list: TerminalStatusList;

	setup(() => {
		const instantiationService = workbenchInstantiationService(undefined, store);
		list = store.add(instantiationService.createInstance(TerminalStatusList));
	});

	test('primary', () => {
		strictEqual(list.primary?.id, undefined);
		list.add({ id: 'info1', severity: Severity.Info });
		strictEqual(list.primary?.id, 'info1');
		list.add({ id: 'warning1', severity: Severity.Warning });
		strictEqual(list.primary?.id, 'warning1');
		list.add({ id: 'info2', severity: Severity.Info });
		strictEqual(list.primary?.id, 'warning1');
		list.add({ id: 'warning2', severity: Severity.Warning });
		strictEqual(list.primary?.id, 'warning2');
		list.add({ id: 'info3', severity: Severity.Info });
		strictEqual(list.primary?.id, 'warning2');
		list.add({ id: 'error1', severity: Severity.Error });
		strictEqual(list.primary?.id, 'error1');
		list.add({ id: 'warning3', severity: Severity.Warning });
		strictEqual(list.primary?.id, 'error1');
		list.add({ id: 'error2', severity: Severity.Error });
		strictEqual(list.primary?.id, 'error2');
		list.remove('error1');
		strictEqual(list.primary?.id, 'error2');
		list.remove('error2');
		strictEqual(list.primary?.id, 'warning3');
	});

	test('statuses', () => {
		strictEqual(list.statuses.length, 0);
		list.add({ id: 'info', severity: Severity.Info });
		list.add({ id: 'warning', severity: Severity.Warning });
		list.add({ id: 'error', severity: Severity.Error });
		strictEqual(list.statuses.length, 3);
		statusesEqual(list, [
			['info', Severity.Info],
			['warning', Severity.Warning],
			['error', Severity.Error],
		]);
		list.remove('info');
		list.remove('warning');
		list.remove('error');
		strictEqual(list.statuses.length, 0);
	});

	test('onDidAddStatus', async () => {
		const result = await new Promise<ITerminalStatus>(r => {
			store.add(list.onDidAddStatus(r));
			list.add({ id: 'test', severity: Severity.Info });
		});
		deepStrictEqual(result, { id: 'test', severity: Severity.Info });
	});

	test('onDidRemoveStatus', async () => {
		const result = await new Promise<ITerminalStatus>(r => {
			store.add(list.onDidRemoveStatus(r));
			list.add({ id: 'test', severity: Severity.Info });
			list.remove('test');
		});
		deepStrictEqual(result, { id: 'test', severity: Severity.Info });
	});

	test('onDidChangePrimaryStatus', async () => {
		const result = await new Promise<ITerminalStatus | undefined>(r => {
			store.add(list.onDidChangePrimaryStatus(r));
			list.add({ id: 'test', severity: Severity.Info });
		});
		deepStrictEqual(result, { id: 'test', severity: Severity.Info });
	});

	test('primary is not updated to status without an icon', async () => {
		list.add({ id: 'test', severity: Severity.Info, icon: Codicon.check });
		list.add({ id: 'warning', severity: Severity.Warning });
		deepStrictEqual(list.primary, { id: 'test', severity: Severity.Info, icon: Codicon.check });
	});

	test('add', () => {
		statusesEqual(list, []);
		list.add({ id: 'info', severity: Severity.Info });
		statusesEqual(list, [
			['info', Severity.Info]
		]);
		list.add({ id: 'warning', severity: Severity.Warning });
		statusesEqual(list, [
			['info', Severity.Info],
			['warning', Severity.Warning]
		]);
		list.add({ id: 'error', severity: Severity.Error });
		statusesEqual(list, [
			['info', Severity.Info],
			['warning', Severity.Warning],
			['error', Severity.Error]
		]);
	});

	test('add should remove animation', () => {
		statusesEqual(list, []);
		list.add({ id: 'info', severity: Severity.Info, icon: spinningLoading });
		statusesEqual(list, [
			['info', Severity.Info]
		]);
		strictEqual(list.statuses[0].icon!.id, Codicon.play.id, 'loading~spin should be converted to play');
		list.add({ id: 'warning', severity: Severity.Warning, icon: ThemeIcon.modify(Codicon.zap, 'spin') });
		statusesEqual(list, [
			['info', Severity.Info],
			['warning', Severity.Warning]
		]);
		strictEqual(list.statuses[1].icon!.id, Codicon.zap.id, 'zap~spin should have animation removed only');
	});

	test('add should fire onDidRemoveStatus if same status id with a different object reference was added', () => {
		const eventCalls: string[] = [];
		store.add(list.onDidAddStatus(() => eventCalls.push('add')));
		store.add(list.onDidRemoveStatus(() => eventCalls.push('remove')));
		list.add({ id: 'test', severity: Severity.Info });
		list.add({ id: 'test', severity: Severity.Info });
		deepStrictEqual(eventCalls, [
			'add',
			'remove',
			'add'
		]);
	});

	test('remove', () => {
		list.add({ id: 'info', severity: Severity.Info });
		list.add({ id: 'warning', severity: Severity.Warning });
		list.add({ id: 'error', severity: Severity.Error });
		statusesEqual(list, [
			['info', Severity.Info],
			['warning', Severity.Warning],
			['error', Severity.Error]
		]);
		list.remove('warning');
		statusesEqual(list, [
			['info', Severity.Info],
			['error', Severity.Error]
		]);
		list.remove('info');
		statusesEqual(list, [
			['error', Severity.Error]
		]);
		list.remove('error');
		statusesEqual(list, []);
	});

	test('toggle', () => {
		const status = { id: 'info', severity: Severity.Info };
		list.toggle(status, true);
		statusesEqual(list, [
			['info', Severity.Info]
		]);
		list.toggle(status, false);
		statusesEqual(list, []);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/browser/terminalUri.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/terminalUri.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual, strictEqual } from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { getInstanceFromResource, getTerminalResourcesFromDragEvent, getTerminalUri, IPartialDragEvent } from '../../browser/terminalUri.js';

function fakeDragEvent(data: string): IPartialDragEvent {
	return {
		dataTransfer: {
			getData: () => {
				return data;
			}
		}
	};
}

suite('terminalUri', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('getTerminalResourcesFromDragEvent', () => {
		test('should give undefined when no terminal resources is in event', () => {
			deepStrictEqual(
				getTerminalResourcesFromDragEvent(fakeDragEvent(''))?.map(e => e.toString()),
				undefined
			);
		});
		test('should give undefined when an empty terminal resources array is in event', () => {
			deepStrictEqual(
				getTerminalResourcesFromDragEvent(fakeDragEvent('[]'))?.map(e => e.toString()),
				undefined
			);
		});
		test('should return terminal resource when event contains one', () => {
			deepStrictEqual(
				getTerminalResourcesFromDragEvent(fakeDragEvent('["vscode-terminal:/1626874386474/3"]'))?.map(e => e.toString()),
				['vscode-terminal:/1626874386474/3']
			);
		});
		test('should return multiple terminal resources when event contains multiple', () => {
			deepStrictEqual(
				getTerminalResourcesFromDragEvent(fakeDragEvent('["vscode-terminal:/foo/1","vscode-terminal:/bar/2"]'))?.map(e => e.toString()),
				['vscode-terminal:/foo/1', 'vscode-terminal:/bar/2']
			);
		});
	});
	suite('getInstanceFromResource', () => {
		test('should return undefined if there is no match', () => {
			strictEqual(
				getInstanceFromResource([
					{ resource: getTerminalUri('workspace', 2, 'title') }
				], getTerminalUri('workspace', 1, 'title')),
				undefined
			);
		});
		test('should return a result if there is a match', () => {
			const instance = { resource: getTerminalUri('workspace', 2, 'title') };
			strictEqual(
				getInstanceFromResource([
					{ resource: getTerminalUri('workspace', 1, 'title') },
					instance,
					{ resource: getTerminalUri('workspace', 3, 'title') }
				], getTerminalUri('workspace', 2, 'title')),
				instance
			);
		});
		test('should ignore the fragment', () => {
			const instance = { resource: getTerminalUri('workspace', 2, 'title') };
			strictEqual(
				getInstanceFromResource([
					{ resource: getTerminalUri('workspace', 1, 'title') },
					instance,
					{ resource: getTerminalUri('workspace', 3, 'title') }
				], getTerminalUri('workspace', 2, 'does not match!')),
				instance
			);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/browser/capabilities/commandDetectionCapability.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/capabilities/commandDetectionCapability.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Terminal } from '@xterm/xterm';
import { deepStrictEqual, ok } from 'assert';
import { importAMDNodeModule } from '../../../../../../amdX.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { ITerminalCommand } from '../../../../../../platform/terminal/common/capabilities/capabilities.js';
import { CommandDetectionCapability } from '../../../../../../platform/terminal/common/capabilities/commandDetectionCapability.js';
import { writeP } from '../../../browser/terminalTestHelpers.js';
import { workbenchInstantiationService } from '../../../../../test/browser/workbenchTestServices.js';

type TestTerminalCommandMatch = Pick<ITerminalCommand, 'command' | 'cwd' | 'exitCode'> & { marker: { line: number } };

class TestCommandDetectionCapability extends CommandDetectionCapability {
	clearCommands() {
		this._commands.length = 0;
	}
}

suite('CommandDetectionCapability', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let xterm: Terminal;
	let capability: TestCommandDetectionCapability;
	let addEvents: ITerminalCommand[];

	function assertCommands(expectedCommands: TestTerminalCommandMatch[]) {
		deepStrictEqual(capability.commands.map(e => e.command), expectedCommands.map(e => e.command));
		deepStrictEqual(capability.commands.map(e => e.cwd), expectedCommands.map(e => e.cwd));
		deepStrictEqual(capability.commands.map(e => e.exitCode), expectedCommands.map(e => e.exitCode));
		deepStrictEqual(capability.commands.map(e => e.marker?.line), expectedCommands.map(e => e.marker?.line));
		// Ensure timestamps are set and were captured recently
		for (const command of capability.commands) {
			ok(Math.abs(Date.now() - command.timestamp) < 2000);
			ok(command.id, 'Expected command to have an assigned id');
		}
		deepStrictEqual(addEvents, capability.commands);
		// Clear the commands to avoid re-asserting past commands
		addEvents.length = 0;
		capability.clearCommands();
	}

	async function printStandardCommand(prompt: string, command: string, output: string, cwd: string | undefined, exitCode: number) {
		if (cwd !== undefined) {
			capability.setCwd(cwd);
		}
		capability.handlePromptStart();
		await writeP(xterm, `\r${prompt}`);
		capability.handleCommandStart();
		await writeP(xterm, command);
		capability.handleCommandExecuted();
		await writeP(xterm, `\r\n${output}\r\n`);
		capability.handleCommandFinished(exitCode);
	}

	async function printCommandStart(prompt: string) {
		capability.handlePromptStart();
		await writeP(xterm, `\r${prompt}`);
		capability.handleCommandStart();
	}


	setup(async () => {
		const TerminalCtor = (await importAMDNodeModule<typeof import('@xterm/xterm')>('@xterm/xterm', 'lib/xterm.js')).Terminal;

		xterm = store.add(new TerminalCtor({ allowProposedApi: true, cols: 80 }));
		const instantiationService = workbenchInstantiationService(undefined, store);
		capability = store.add(instantiationService.createInstance(TestCommandDetectionCapability, xterm));
		addEvents = [];
		store.add(capability.onCommandFinished(e => addEvents.push(e)));
		assertCommands([]);
	});

	test('should not add commands when no capability methods are triggered', async () => {
		await writeP(xterm, 'foo\r\nbar\r\n');
		assertCommands([]);
		await writeP(xterm, 'baz\r\n');
		assertCommands([]);
	});

	test('should add commands for expected capability method calls', async () => {
		await printStandardCommand('$ ', 'echo foo', 'foo', undefined, 0);
		await printCommandStart('$ ');
		assertCommands([{
			command: 'echo foo',
			exitCode: 0,
			cwd: undefined,
			marker: { line: 0 }
		}]);
	});

	test('should trim the command when command executed appears on the following line', async () => {
		await printStandardCommand('$ ', 'echo foo\r\n', 'foo', undefined, 0);
		await printCommandStart('$ ');
		assertCommands([{
			command: 'echo foo',
			exitCode: 0,
			cwd: undefined,
			marker: { line: 0 }
		}]);
	});

	suite('cwd', () => {
		test('should add cwd to commands when it\'s set', async () => {
			await printStandardCommand('$ ', 'echo foo', 'foo', '/home', 0);
			await printStandardCommand('$ ', 'echo bar', 'bar', '/home/second', 0);
			await printCommandStart('$ ');
			assertCommands([
				{ command: 'echo foo', exitCode: 0, cwd: '/home', marker: { line: 0 } },
				{ command: 'echo bar', exitCode: 0, cwd: '/home/second', marker: { line: 2 } }
			]);
		});
		test('should add old cwd to commands if no cwd sequence is output', async () => {
			await printStandardCommand('$ ', 'echo foo', 'foo', '/home', 0);
			await printStandardCommand('$ ', 'echo bar', 'bar', undefined, 0);
			await printCommandStart('$ ');
			assertCommands([
				{ command: 'echo foo', exitCode: 0, cwd: '/home', marker: { line: 0 } },
				{ command: 'echo bar', exitCode: 0, cwd: '/home', marker: { line: 2 } }
			]);
		});
		test('should use an undefined cwd if it\'s not set initially', async () => {
			await printStandardCommand('$ ', 'echo foo', 'foo', undefined, 0);
			await printStandardCommand('$ ', 'echo bar', 'bar', '/home', 0);
			await printCommandStart('$ ');
			assertCommands([
				{ command: 'echo foo', exitCode: 0, cwd: undefined, marker: { line: 0 } },
				{ command: 'echo bar', exitCode: 0, cwd: '/home', marker: { line: 2 } }
			]);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/browser/capabilities/partialCommandDetectionCapability.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/capabilities/partialCommandDetectionCapability.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IMarker, Terminal } from '@xterm/xterm';
import { deepEqual, deepStrictEqual } from 'assert';
import { importAMDNodeModule } from '../../../../../../amdX.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { PartialCommandDetectionCapability } from '../../../../../../platform/terminal/common/capabilities/partialCommandDetectionCapability.js';
import { writeP } from '../../../browser/terminalTestHelpers.js';
import { Emitter } from '../../../../../../base/common/event.js';

suite('PartialCommandDetectionCapability', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let xterm: Terminal;
	let capability: PartialCommandDetectionCapability;
	let addEvents: IMarker[];
	let onDidExecuteTextEmitter: Emitter<void>;

	function assertCommands(expectedLines: number[]) {
		deepStrictEqual(capability.commands.map(e => e.line), expectedLines);
		deepStrictEqual(addEvents.map(e => e.line), expectedLines);
	}

	setup(async () => {
		const TerminalCtor = (await importAMDNodeModule<typeof import('@xterm/xterm')>('@xterm/xterm', 'lib/xterm.js')).Terminal;

		xterm = store.add(new TerminalCtor({ allowProposedApi: true, cols: 80 }) as Terminal);
		onDidExecuteTextEmitter = store.add(new Emitter<void>());
		capability = store.add(new PartialCommandDetectionCapability(xterm, onDidExecuteTextEmitter.event));
		addEvents = [];
		store.add(capability.onCommandFinished(e => addEvents.push(e)));
	});

	test('should not add commands when the cursor position is too close to the left side', async () => {
		assertCommands([]);
		xterm.input('\x0d');
		await writeP(xterm, '\r\n');
		assertCommands([]);
		await writeP(xterm, 'a');
		xterm.input('\x0d');
		await writeP(xterm, '\r\n');
		assertCommands([]);
	});

	test('should add commands when the cursor position is not too close to the left side', async () => {
		assertCommands([]);
		await writeP(xterm, 'ab');
		xterm.input('\x0d');
		await writeP(xterm, '\r\n\r\n');
		assertCommands([0]);
		await writeP(xterm, 'cd');
		xterm.input('\x0d');
		await writeP(xterm, '\r\n');
		assertCommands([0, 2]);
	});

	test('onDidExecuteText should cause onDidCommandFinished to fire', async () => {
		await writeP(xterm, 'cd');
		onDidExecuteTextEmitter.fire();
		await writeP(xterm, 'pwd');
		onDidExecuteTextEmitter.fire();
		deepEqual(addEvents.length, 2);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/browser/capabilities/terminalCapabilityStore.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/capabilities/terminalCapabilityStore.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual, strictEqual } from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { TerminalCapability, type ICommandDetectionCapability, type ICwdDetectionCapability, type INaiveCwdDetectionCapability, type ITerminalCapabilityStore } from '../../../../../../platform/terminal/common/capabilities/capabilities.js';
import { TerminalCapabilityStore, TerminalCapabilityStoreMultiplexer } from '../../../../../../platform/terminal/common/capabilities/terminalCapabilityStore.js';

suite('TerminalCapabilityStore', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let capabilityStore: TerminalCapabilityStore;
	let addEvents: TerminalCapability[];
	let removeEvents: TerminalCapability[];

	setup(() => {
		capabilityStore = store.add(new TerminalCapabilityStore());
		store.add(capabilityStore.onDidAddCapability(e => addEvents.push(e.id)));
		store.add(capabilityStore.onDidRemoveCapability(e => removeEvents.push(e.id)));
		addEvents = [];
		removeEvents = [];
	});

	test('should fire events when capabilities are added', () => {
		assertEvents(addEvents, []);
		capabilityStore.add(TerminalCapability.CwdDetection, {} as unknown as ICwdDetectionCapability);
		assertEvents(addEvents, [TerminalCapability.CwdDetection]);
	});
	test('should fire events when capabilities are removed', async () => {
		assertEvents(removeEvents, []);
		capabilityStore.add(TerminalCapability.CwdDetection, {} as unknown as ICwdDetectionCapability);
		assertEvents(removeEvents, []);
		capabilityStore.remove(TerminalCapability.CwdDetection);
		assertEvents(removeEvents, [TerminalCapability.CwdDetection]);
	});
	test('has should return whether a capability is present', () => {
		deepStrictEqual(capabilityStore.has(TerminalCapability.CwdDetection), false);
		capabilityStore.add(TerminalCapability.CwdDetection, {} as unknown as ICwdDetectionCapability);
		deepStrictEqual(capabilityStore.has(TerminalCapability.CwdDetection), true);
		capabilityStore.remove(TerminalCapability.CwdDetection);
		deepStrictEqual(capabilityStore.has(TerminalCapability.CwdDetection), false);
	});
	test('items should reflect current state', () => {
		deepStrictEqual(Array.from(capabilityStore.items), []);
		capabilityStore.add(TerminalCapability.CwdDetection, {} as unknown as ICwdDetectionCapability);
		deepStrictEqual(Array.from(capabilityStore.items), [TerminalCapability.CwdDetection]);
		capabilityStore.add(TerminalCapability.NaiveCwdDetection, {} as unknown as INaiveCwdDetectionCapability);
		deepStrictEqual(Array.from(capabilityStore.items), [TerminalCapability.CwdDetection, TerminalCapability.NaiveCwdDetection]);
		capabilityStore.remove(TerminalCapability.CwdDetection);
		deepStrictEqual(Array.from(capabilityStore.items), [TerminalCapability.NaiveCwdDetection]);
	});
	test('ensure events are memoized', () => {
		for (const getEvent of getDerivedEventGetters(capabilityStore)) {
			strictEqual(getEvent(), getEvent());
		}
	});
	test('ensure events are cleaned up', () => {
		for (const getEvent of getDerivedEventGetters(capabilityStore)) {
			store.add(getEvent()(() => { }));
		}
	});
});

suite('TerminalCapabilityStoreMultiplexer', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let multiplexer: TerminalCapabilityStoreMultiplexer;
	let store1: TerminalCapabilityStore;
	let store2: TerminalCapabilityStore;
	let addEvents: TerminalCapability[];
	let removeEvents: TerminalCapability[];

	setup(() => {
		multiplexer = store.add(new TerminalCapabilityStoreMultiplexer());
		store.add(multiplexer.onDidAddCapability(e => addEvents.push(e.id)));
		store.add(multiplexer.onDidRemoveCapability(e => removeEvents.push(e.id)));
		store1 = store.add(new TerminalCapabilityStore());
		store2 = store.add(new TerminalCapabilityStore());
		addEvents = [];
		removeEvents = [];
	});

	test('should fire events when capabilities are enabled', async () => {
		assertEvents(addEvents, []);
		multiplexer.add(store1);
		multiplexer.add(store2);
		store1.add(TerminalCapability.CwdDetection, {} as unknown as ICwdDetectionCapability);
		assertEvents(addEvents, [TerminalCapability.CwdDetection]);
		store2.add(TerminalCapability.NaiveCwdDetection, {} as unknown as INaiveCwdDetectionCapability);
		assertEvents(addEvents, [TerminalCapability.NaiveCwdDetection]);
	});
	test('should fire events when capabilities are disabled', async () => {
		assertEvents(removeEvents, []);
		multiplexer.add(store1);
		multiplexer.add(store2);
		store1.add(TerminalCapability.CwdDetection, {} as unknown as ICwdDetectionCapability);
		store2.add(TerminalCapability.NaiveCwdDetection, {} as unknown as INaiveCwdDetectionCapability);
		assertEvents(removeEvents, []);
		store1.remove(TerminalCapability.CwdDetection);
		assertEvents(removeEvents, [TerminalCapability.CwdDetection]);
		store2.remove(TerminalCapability.NaiveCwdDetection);
		assertEvents(removeEvents, [TerminalCapability.NaiveCwdDetection]);
	});
	test('should fire events when stores are added', async () => {
		assertEvents(addEvents, []);
		store1.add(TerminalCapability.CwdDetection, {} as unknown as ICwdDetectionCapability);
		assertEvents(addEvents, []);
		store2.add(TerminalCapability.NaiveCwdDetection, {} as unknown as INaiveCwdDetectionCapability);
		multiplexer.add(store1);
		multiplexer.add(store2);
		assertEvents(addEvents, [TerminalCapability.CwdDetection, TerminalCapability.NaiveCwdDetection]);
	});
	test('items should return items from all stores', () => {
		deepStrictEqual(Array.from(multiplexer.items).sort(), [].sort());
		multiplexer.add(store1);
		multiplexer.add(store2);
		store1.add(TerminalCapability.CwdDetection, {} as unknown as ICwdDetectionCapability);
		deepStrictEqual(Array.from(multiplexer.items).sort(), [TerminalCapability.CwdDetection].sort());
		store1.add(TerminalCapability.CommandDetection, {} as unknown as ICommandDetectionCapability);
		store2.add(TerminalCapability.NaiveCwdDetection, {} as unknown as INaiveCwdDetectionCapability);
		deepStrictEqual(Array.from(multiplexer.items).sort(), [TerminalCapability.CwdDetection, TerminalCapability.CommandDetection, TerminalCapability.NaiveCwdDetection].sort());
		store2.remove(TerminalCapability.NaiveCwdDetection);
		deepStrictEqual(Array.from(multiplexer.items).sort(), [TerminalCapability.CwdDetection, TerminalCapability.CommandDetection].sort());
	});
	test('has should return whether a capability is present', () => {
		deepStrictEqual(multiplexer.has(TerminalCapability.CwdDetection), false);
		multiplexer.add(store1);
		store1.add(TerminalCapability.CwdDetection, {} as unknown as ICwdDetectionCapability);
		deepStrictEqual(multiplexer.has(TerminalCapability.CwdDetection), true);
		store1.remove(TerminalCapability.CwdDetection);
		deepStrictEqual(multiplexer.has(TerminalCapability.CwdDetection), false);
	});
	test('ensure events are memoized', () => {
		for (const getEvent of getDerivedEventGetters(multiplexer)) {
			strictEqual(getEvent(), getEvent());
		}
	});
	test('ensure events are cleaned up', () => {
		for (const getEvent of getDerivedEventGetters(multiplexer)) {
			store.add(getEvent()(() => { }));
		}
	});
});

function assertEvents(actual: TerminalCapability[], expected: TerminalCapability[]) {
	deepStrictEqual(actual, expected);
	actual.length = 0;
}

function getDerivedEventGetters(capabilityStore: ITerminalCapabilityStore) {
	return [
		() => capabilityStore.onDidChangeCapabilities,
		() => capabilityStore.onDidAddCommandDetectionCapability,
		() => capabilityStore.onDidRemoveCommandDetectionCapability,
		() => capabilityStore.onDidAddCwdDetectionCapability,
		() => capabilityStore.onDidRemoveCwdDetectionCapability,
	];
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/browser/xterm/decorationAddon.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/xterm/decorationAddon.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IDecoration, IDecorationOptions, Terminal as RawXtermTerminal } from '@xterm/xterm';
import { notEqual, strictEqual, throws } from 'assert';
import { importAMDNodeModule } from '../../../../../../amdX.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { ITerminalCommand, TerminalCapability } from '../../../../../../platform/terminal/common/capabilities/capabilities.js';
import { CommandDetectionCapability } from '../../../../../../platform/terminal/common/capabilities/commandDetectionCapability.js';
import { TerminalCapabilityStore } from '../../../../../../platform/terminal/common/capabilities/terminalCapabilityStore.js';
import { DecorationAddon } from '../../../browser/xterm/decorationAddon.js';
import { workbenchInstantiationService } from '../../../../../test/browser/workbenchTestServices.js';

suite('DecorationAddon', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let decorationAddon: DecorationAddon;
	let xterm: RawXtermTerminal;

	setup(async () => {
		const TerminalCtor = (await importAMDNodeModule<typeof import('@xterm/xterm')>('@xterm/xterm', 'lib/xterm.js')).Terminal;
		class TestTerminal extends TerminalCtor {
			override registerDecoration(decorationOptions: IDecorationOptions): IDecoration | undefined {
				if (decorationOptions.marker.isDisposed) {
					return undefined;
				}
				const element = document.createElement('div');
				return { marker: decorationOptions.marker, element, onDispose: () => { }, isDisposed: false, dispose: () => { }, onRender: (element: HTMLElement) => { return element; } } as unknown as IDecoration;
			}
		}

		const instantiationService = workbenchInstantiationService({
			configurationService: () => new TestConfigurationService({
				files: {},
				workbench: {
					hover: { delay: 5 },
				},
				terminal: {
					integrated: {
						shellIntegration: {
							decorationsEnabled: 'both'
						}
					}
				}
			})
		}, store);
		xterm = store.add(new TestTerminal({
			allowProposedApi: true,
			cols: 80,
			rows: 30
		}));
		const capabilities = store.add(new TerminalCapabilityStore());
		capabilities.add(TerminalCapability.CommandDetection, store.add(instantiationService.createInstance(CommandDetectionCapability, xterm)));
		decorationAddon = store.add(instantiationService.createInstance(DecorationAddon, undefined, capabilities));
		xterm.loadAddon(decorationAddon);
	});

	suite('registerDecoration', () => {
		test('should throw when command has no marker', async () => {
			throws(() => decorationAddon.registerCommandDecoration({ command: 'cd src', timestamp: Date.now(), hasOutput: () => false } as ITerminalCommand));
		});
		test('should return undefined when marker has been disposed of', async () => {
			const marker = xterm.registerMarker(1);
			marker?.dispose();
			strictEqual(decorationAddon.registerCommandDecoration({ command: 'cd src', marker, timestamp: Date.now(), hasOutput: () => false } as ITerminalCommand), undefined);
		});
		test('should return decoration when marker has not been disposed of', async () => {
			const marker = xterm.registerMarker(2);
			notEqual(decorationAddon.registerCommandDecoration({ command: 'cd src', marker, timestamp: Date.now(), hasOutput: () => false } as ITerminalCommand), undefined);
		});
		test('should return decoration with mark properties', async () => {
			const marker = xterm.registerMarker(2);
			notEqual(decorationAddon.registerCommandDecoration(undefined, undefined, { marker }), undefined);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/browser/xterm/lineDataEventAddon.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/xterm/lineDataEventAddon.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Terminal } from '@xterm/xterm';
import { deepStrictEqual } from 'assert';
import { importAMDNodeModule } from '../../../../../../amdX.js';
import { OperatingSystem } from '../../../../../../base/common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { writeP } from '../../../browser/terminalTestHelpers.js';
import { LineDataEventAddon } from '../../../browser/xterm/lineDataEventAddon.js';

suite('LineDataEventAddon', () => {
	let xterm: Terminal;
	let lineDataEventAddon: LineDataEventAddon;

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	suite('onLineData', () => {
		let events: string[];

		setup(async () => {
			const TerminalCtor = (await importAMDNodeModule<typeof import('@xterm/xterm')>('@xterm/xterm', 'lib/xterm.js')).Terminal;
			xterm = store.add(new TerminalCtor({ allowProposedApi: true, cols: 4 }));
			lineDataEventAddon = store.add(new LineDataEventAddon());
			xterm.loadAddon(lineDataEventAddon);

			events = [];
			store.add(lineDataEventAddon.onLineData(e => events.push(e)));
		});

		test('should fire when a non-wrapped line ends with a line feed', async () => {
			await writeP(xterm, 'foo');
			deepStrictEqual(events, []);
			await writeP(xterm, '\n\r');
			deepStrictEqual(events, ['foo']);
			await writeP(xterm, 'bar');
			deepStrictEqual(events, ['foo']);
			await writeP(xterm, '\n');
			deepStrictEqual(events, ['foo', 'bar']);
		});

		test('should not fire soft wrapped lines', async () => {
			await writeP(xterm, 'foo.');
			deepStrictEqual(events, []);
			await writeP(xterm, 'bar.');
			deepStrictEqual(events, []);
			await writeP(xterm, 'baz.');
			deepStrictEqual(events, []);
		});

		test('should fire when a wrapped line ends with a line feed', async () => {
			await writeP(xterm, 'foo.bar.baz.');
			deepStrictEqual(events, []);
			await writeP(xterm, '\n\r');
			deepStrictEqual(events, ['foo.bar.baz.']);
		});

		test('should not fire on cursor move when the backing process is not on Windows', async () => {
			await writeP(xterm, 'foo.\x1b[H');
			deepStrictEqual(events, []);
		});

		test('should fire on cursor move when the backing process is on Windows', async () => {
			lineDataEventAddon.setOperatingSystem(OperatingSystem.Windows);
			await writeP(xterm, 'foo\x1b[H');
			deepStrictEqual(events, ['foo']);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/browser/xterm/promptTypeDetectionCapability.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/xterm/promptTypeDetectionCapability.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { strictEqual } from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { PromptTypeDetectionCapability } from '../../../../../../platform/terminal/common/capabilities/promptTypeDetectionCapability.js';
import { TerminalCapability } from '../../../../../../platform/terminal/common/capabilities/capabilities.js';

suite('PromptTypeDetectionCapability', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	test('should have correct capability type', () => {
		const capability = store.add(new PromptTypeDetectionCapability());
		strictEqual(capability.type, TerminalCapability.PromptTypeDetection);
	});

	test('should initialize with undefined prompt type', () => {
		const capability = store.add(new PromptTypeDetectionCapability());
		strictEqual(capability.promptType, undefined);
	});

	test('should set and get prompt type', () => {
		const capability = store.add(new PromptTypeDetectionCapability());

		capability.setPromptType('p10k');
		strictEqual(capability.promptType, 'p10k');

		capability.setPromptType('posh-git');
		strictEqual(capability.promptType, 'posh-git');
	});

	test('should fire event when prompt type changes', () => {
		const capability = store.add(new PromptTypeDetectionCapability());
		let eventFiredCount = 0;
		let lastEventValue: string | undefined;

		const disposable = capability.onPromptTypeChanged(value => {
			eventFiredCount++;
			lastEventValue = value;
		});
		store.add(disposable);

		capability.setPromptType('starship');
		strictEqual(eventFiredCount, 1);
		strictEqual(lastEventValue, 'starship');

		capability.setPromptType('oh-my-zsh');
		strictEqual(eventFiredCount, 2);
		strictEqual(lastEventValue, 'oh-my-zsh');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/browser/xterm/shellIntegrationAddon.integrationTest.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/xterm/shellIntegrationAddon.integrationTest.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Terminal } from '@xterm/xterm';
import { deepStrictEqual, fail, strictEqual } from 'assert';
import { importAMDNodeModule } from '../../../../../../amdX.js';
import { getActiveDocument } from '../../../../../../base/browser/dom.js';
import { timeout } from '../../../../../../base/common/async.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { NullLogService } from '../../../../../../platform/log/common/log.js';
import { TerminalCapability, type ICommandDetectionCapability } from '../../../../../../platform/terminal/common/capabilities/capabilities.js';
import type { TerminalCapabilityStore } from '../../../../../../platform/terminal/common/capabilities/terminalCapabilityStore.js';
import { ShellIntegrationAddon } from '../../../../../../platform/terminal/common/xterm/shellIntegrationAddon.js';
import { workbenchInstantiationService, type TestTerminalConfigurationService } from '../../../../../test/browser/workbenchTestServices.js';
import { ITerminalConfigurationService } from '../../../../terminal/browser/terminal.js';

import { NullTelemetryService } from '../../../../../../platform/telemetry/common/telemetryUtils.js';
import { events as rich_windows11_pwsh7_echo_3_times } from './recordings/rich/windows11_pwsh7_echo_3_times.js';
import { events as rich_windows11_pwsh7_ls_one_time } from './recordings/rich/windows11_pwsh7_ls_one_time.js';
import { events as rich_windows11_pwsh7_type_foo } from './recordings/rich/windows11_pwsh7_type_foo.js';
import { events as rich_windows11_pwsh7_type_foo_left_twice } from './recordings/rich/windows11_pwsh7_type_foo_left_twice.js';
import { events as rich_macos_zsh_omz_echo_3_times } from './recordings/rich/macos_zsh_omz_echo_3_times.js';
import { events as rich_macos_zsh_omz_ls_one_time } from './recordings/rich/macos_zsh_omz_ls_one_time.js';
import { events as basic_macos_zsh_p10k_ls_one_time } from './recordings/basic/macos_zsh_p10k_ls_one_time.js';
import type { ITerminalConfiguration } from '../../../common/terminal.js';

// These are test cases recorded with the `Developer: Record Terminal Session` command. Once that is
// run, a terminal is created and the test case is manually executed. After nothing happens for a
// few seconds the test case will be put into the clipboard.
//
// They aim to guarantee the complex interactions within command detection result in a particular
// outcome.
//
// Some things to be aware of when recording tests:
// - Pwsh on non-Windows can add a bunch of spammy cursor reports (`CSI x;y R`)
// - It's best to record pwsh on Windows
// - It's best to record other shells on non-Windows
// - Turn off builtinCompletions to simplify the recording
// - Capitalization matters in the recorded events
type RecordedTestCase = {
	/**
	 * The test case name.
	 */
	name: string;
	/**
	 * A set of events that will play or be awaited for in order.
	 */
	events: RecordedSessionEvent[];
	/**
	 * Any assertions to perform after the events have been played and validated.
	 */
	finalAssertions: (commandDetection: ICommandDetectionCapability | undefined) => void;
};
const recordedTestCases: RecordedTestCase[] = [
	{
		name: 'rich_windows11_pwsh7_echo_3_times',
		events: rich_windows11_pwsh7_echo_3_times as unknown as RecordedSessionEvent[],
		finalAssertions: (commandDetection: ICommandDetectionCapability | undefined) => {
			assertCommandDetectionState(commandDetection, ['echo a', 'echo b', 'echo c'], '|');
		}
	},
	{
		name: 'rich_windows11_pwsh7_ls_one_time',
		events: rich_windows11_pwsh7_ls_one_time as unknown as RecordedSessionEvent[],
		finalAssertions: (commandDetection: ICommandDetectionCapability | undefined) => {
			assertCommandDetectionState(commandDetection, ['ls'], '|');
		}
	},
	{
		name: 'rich_windows11_pwsh7_type_foo',
		events: rich_windows11_pwsh7_type_foo as unknown as RecordedSessionEvent[],
		finalAssertions: (commandDetection: ICommandDetectionCapability | undefined) => {
			assertCommandDetectionState(commandDetection, [], 'foo|');
		}
	},
	{
		name: 'rich_windows11_pwsh7_type_foo_left_twice',
		events: rich_windows11_pwsh7_type_foo_left_twice as unknown as RecordedSessionEvent[],
		finalAssertions: (commandDetection: ICommandDetectionCapability | undefined) => {
			assertCommandDetectionState(commandDetection, [], 'f|oo');
		}
	},
	{
		name: 'rich_macos_zsh_omz_echo_3_times',
		events: rich_macos_zsh_omz_echo_3_times as unknown as RecordedSessionEvent[],
		finalAssertions: (commandDetection: ICommandDetectionCapability | undefined) => {
			assertCommandDetectionState(commandDetection, ['echo a', 'echo b', 'echo c'], '|');
		}
	},
	{
		name: 'rich_macos_zsh_omz_ls_one_time',
		events: rich_macos_zsh_omz_ls_one_time as unknown as RecordedSessionEvent[],
		finalAssertions: (commandDetection: ICommandDetectionCapability | undefined) => {
			assertCommandDetectionState(commandDetection, ['ls'], '|');
		}
	},
	{
		name: 'basic_macos_zsh_p10k_ls_one_time',
		events: basic_macos_zsh_p10k_ls_one_time as unknown as RecordedSessionEvent[],
		finalAssertions: (commandDetection: ICommandDetectionCapability | undefined) => {
			// Prompt input model doesn't work for p10k yet
			// Assert a single command has completed
			deepStrictEqual(commandDetection!.commands.map(e => e.command), ['']);
		}
	},
];
function assertCommandDetectionState(commandDetection: ICommandDetectionCapability | undefined, commands: string[], promptInput: string) {
	if (!commandDetection) {
		fail('Command detection must be set');
	}
	deepStrictEqual(commandDetection!.commands.map(e => e.command), commands);
	strictEqual(commandDetection!.promptInputModel.getCombinedString(), promptInput);
}

type RecordedSessionEvent = (
	IRecordedSessionTerminalEvent |
	IRecordedSessionCommandEvent |
	IRecordedSessionResizeEvent
);

interface IRecordedSessionTerminalEvent {
	type: 'output' | 'input' | 'sendText' | 'promptInputChange';
	data: string;
}

interface IRecordedSessionCommandEvent {
	type: 'command';
	id: string;
}

interface IRecordedSessionResizeEvent {
	type: 'resize';
	cols: number;
	rows: number;
}

suite('Terminal Contrib Shell Integration Recordings', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let xterm: Terminal;
	let capabilities: TerminalCapabilityStore;

	setup(async () => {
		const terminalConfig = {
			integrated: {
			}
		};
		const instantiationService = workbenchInstantiationService({
			configurationService: () => new TestConfigurationService({
				files: { autoSave: false },
				terminal: terminalConfig,
				editor: { fontSize: 14, fontFamily: 'Arial', lineHeight: 12, fontWeight: 'bold' }
			})
		}, store);
		const terminalConfigurationService = instantiationService.get(ITerminalConfigurationService) as TestTerminalConfigurationService;
		terminalConfigurationService.setConfig(terminalConfig as unknown as Partial<ITerminalConfiguration>);
		const shellIntegrationAddon = store.add(new ShellIntegrationAddon('', true, undefined, NullTelemetryService, new NullLogService));
		const TerminalCtor = (await importAMDNodeModule<typeof import('@xterm/xterm')>('@xterm/xterm', 'lib/xterm.js')).Terminal;
		xterm = store.add(new TerminalCtor({ allowProposedApi: true }));
		capabilities = shellIntegrationAddon.capabilities;
		const testContainer = document.createElement('div');
		getActiveDocument().body.append(testContainer);

		xterm.open(testContainer);
		xterm.loadAddon(shellIntegrationAddon);
		xterm.focus();
	});

	for (const testCase of recordedTestCases) {
		test(testCase.name, async () => {
			for (const [i, event] of testCase.events.entries()) {
				// DEBUG: Uncomment to see the events as they are played
				// console.log(
				// 	event.type,
				// 	event.type === 'command'
				// 		? event.id
				// 		: event.type === 'resize'
				// 			? `${event.cols}x${event.rows}`
				// 			: (event.data.length > 50 ? event.data.slice(0, 50) + '...' : event.data).replaceAll('\x1b', '\\x1b').replace(/(\n|\r).+$/, '...')
				// );
				// console.log('promptInputModel', capabilities.get(TerminalCapability.CommandDetection)?.promptInputModel.getCombinedString());
				switch (event.type) {
					case 'resize': {
						xterm.resize(event.cols, event.rows);
						break;
					}
					case 'output': {
						const promises: Promise<unknown>[] = [];
						if (event.data.includes('\x1b]633;B')) {
							// If the output contains the command start sequence, allow time for the prompt to get
							// adjusted.
							promises.push(new Promise<void>(r => {
								const commandDetection = capabilities.get(TerminalCapability.CommandDetection)!;
								if (commandDetection) {
									const d = commandDetection.onCommandStarted(() => {
										d.dispose();
										r();
									});
								}
							}));
						}
						promises.push(new Promise<void>(r => xterm.write(event.data, () => r())));
						await Promise.all(promises);
						break;
					}
					case 'input': {
						xterm.input(event.data, true);
						break;
					}
					case 'promptInputChange': {
						// Ignore this event if it's followed by another promptInputChange as that
						// means this one isn't important and could cause a race condition in the
						// test
						if (testCase.events.length > i + 1 && testCase.events[i + 1].type === 'promptInputChange') {
							continue;
						}
						const promptInputModel = capabilities.get(TerminalCapability.CommandDetection)?.promptInputModel;
						if (promptInputModel && promptInputModel.getCombinedString() !== event.data) {
							await Promise.race([
								await timeout(1000).then(() => { throw new Error(`Prompt input change timed out current="${promptInputModel.getCombinedString()}", expected="${event.data}"`); }),
								await new Promise<void>(r => {
									const d = promptInputModel.onDidChangeInput(() => {
										if (promptInputModel.getCombinedString() === event.data) {
											d.dispose();
											r();
										}
									});
								})
							]);
						}
						break;
					}
				}
			}
			testCase.finalAssertions(capabilities.get(TerminalCapability.CommandDetection));
		});
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/browser/xterm/shellIntegrationAddon.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/xterm/shellIntegrationAddon.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Terminal } from '@xterm/xterm';
import { deepEqual, deepStrictEqual, strictEqual } from 'assert';
import * as sinon from 'sinon';
import { importAMDNodeModule } from '../../../../../../amdX.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { NullLogService } from '../../../../../../platform/log/common/log.js';
import { ITerminalCapabilityStore, TerminalCapability } from '../../../../../../platform/terminal/common/capabilities/capabilities.js';
import { deserializeVSCodeOscMessage, serializeVSCodeOscMessage, parseKeyValueAssignment, parseMarkSequence, ShellIntegrationAddon } from '../../../../../../platform/terminal/common/xterm/shellIntegrationAddon.js';
import { writeP } from '../../../browser/terminalTestHelpers.js';

class TestShellIntegrationAddon extends ShellIntegrationAddon {
	getCommandDetectionMock(terminal: Terminal): sinon.SinonMock {
		const capability = super._createOrGetCommandDetection(terminal);
		this.capabilities.add(TerminalCapability.CommandDetection, capability);
		return sinon.mock(capability);
	}
	getCwdDectionMock(): sinon.SinonMock {
		const capability = super._createOrGetCwdDetection();
		this.capabilities.add(TerminalCapability.CwdDetection, capability);
		return sinon.mock(capability);
	}
}

suite('ShellIntegrationAddon', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let xterm: Terminal;
	let shellIntegrationAddon: TestShellIntegrationAddon;
	let capabilities: ITerminalCapabilityStore;

	setup(async () => {
		const TerminalCtor = (await importAMDNodeModule<typeof import('@xterm/xterm')>('@xterm/xterm', 'lib/xterm.js')).Terminal;
		xterm = store.add(new TerminalCtor({ allowProposedApi: true, cols: 80, rows: 30 }));
		shellIntegrationAddon = store.add(new TestShellIntegrationAddon('', true, undefined, undefined, new NullLogService()));
		xterm.loadAddon(shellIntegrationAddon);
		capabilities = shellIntegrationAddon.capabilities;
	});

	suite('cwd detection', () => {
		test('should activate capability on the cwd sequence (OSC 633 ; P ; Cwd=<cwd> ST)', async () => {
			strictEqual(capabilities.has(TerminalCapability.CwdDetection), false);
			await writeP(xterm, 'foo');
			strictEqual(capabilities.has(TerminalCapability.CwdDetection), false);
			await writeP(xterm, '\x1b]633;P;Cwd=/foo\x07');
			strictEqual(capabilities.has(TerminalCapability.CwdDetection), true);
		});

		test('should pass cwd sequence to the capability', async () => {
			const mock = shellIntegrationAddon.getCwdDectionMock();
			mock.expects('updateCwd').once().withExactArgs('/foo');
			await writeP(xterm, '\x1b]633;P;Cwd=/foo\x07');
			mock.verify();
		});

		test('detect ITerm sequence: `OSC 1337 ; CurrentDir=<Cwd> ST`', async () => {
			type TestCase = [title: string, input: string, expected: string];
			const cases: TestCase[] = [
				['root', '/', '/'],
				['non-root', '/some/path', '/some/path'],
			];
			for (const x of cases) {
				const [title, input, expected] = x;
				const mock = shellIntegrationAddon.getCwdDectionMock();
				mock.expects('updateCwd').once().withExactArgs(expected).named(title);
				await writeP(xterm, `\x1b]1337;CurrentDir=${input}\x07`);
				mock.verify();
			}
		});

		suite('detect `SetCwd` sequence: `OSC 7; scheme://cwd ST`', () => {
			test('should accept well-formatted URLs', async () => {
				type TestCase = [title: string, input: string, expected: string];
				const cases: TestCase[] = [
					// Different hostname values:
					['empty hostname, pointing root', 'file:///', '/'],
					['empty hostname', 'file:///test-root/local', '/test-root/local'],
					['non-empty hostname', 'file://some-hostname/test-root/local', '/test-root/local'],
					// URL-encoded chars:
					['URL-encoded value (1)', 'file:///test-root/%6c%6f%63%61%6c', '/test-root/local'],
					['URL-encoded value (2)', 'file:///test-root/local%22', '/test-root/local"'],
					['URL-encoded value (3)', 'file:///test-root/local"', '/test-root/local"'],
				];
				for (const x of cases) {
					const [title, input, expected] = x;
					const mock = shellIntegrationAddon.getCwdDectionMock();
					mock.expects('updateCwd').once().withExactArgs(expected).named(title);
					await writeP(xterm, `\x1b]7;${input}\x07`);
					mock.verify();
				}
			});

			test('should ignore ill-formatted URLs', async () => {
				type TestCase = [title: string, input: string];
				const cases: TestCase[] = [
					// Different hostname values:
					['no hostname, pointing root', 'file://'],
					// Non-`file` scheme values:
					['no scheme (1)', '/test-root'],
					['no scheme (2)', '//test-root'],
					['no scheme (3)', '///test-root'],
					['no scheme (4)', ':///test-root'],
					['http', 'http:///test-root'],
					['ftp', 'ftp:///test-root'],
					['ssh', 'ssh:///test-root'],
				];

				for (const x of cases) {
					const [title, input] = x;
					const mock = shellIntegrationAddon.getCwdDectionMock();
					mock.expects('updateCwd').never().named(title);
					await writeP(xterm, `\x1b]7;${input}\x07`);
					mock.verify();
				}
			});
		});

		test('detect `SetWindowsFrindlyCwd` sequence: `OSC 9 ; 9 ; <cwd> ST`', async () => {
			type TestCase = [title: string, input: string, expected: string];
			const cases: TestCase[] = [
				['root', '/', '/'],
				['non-root', '/some/path', '/some/path'],
			];
			for (const x of cases) {
				const [title, input, expected] = x;
				const mock = shellIntegrationAddon.getCwdDectionMock();
				mock.expects('updateCwd').once().withExactArgs(expected).named(title);
				await writeP(xterm, `\x1b]9;9;${input}\x07`);
				mock.verify();
			}
		});
	});

	suite('command tracking', () => {
		test('should activate capability on the prompt start sequence (OSC 633 ; A ST)', async () => {
			strictEqual(capabilities.has(TerminalCapability.CommandDetection), false);
			await writeP(xterm, 'foo');
			strictEqual(capabilities.has(TerminalCapability.CommandDetection), false);
			await writeP(xterm, '\x1b]633;A\x07');
			strictEqual(capabilities.has(TerminalCapability.CommandDetection), true);
		});
		test('should pass prompt start sequence to the capability', async () => {
			const mock = shellIntegrationAddon.getCommandDetectionMock(xterm);
			mock.expects('handlePromptStart').once().withExactArgs();
			await writeP(xterm, '\x1b]633;A\x07');
			mock.verify();
		});
		test('should activate capability on the command start sequence (OSC 633 ; B ST)', async () => {
			strictEqual(capabilities.has(TerminalCapability.CommandDetection), false);
			await writeP(xterm, 'foo');
			strictEqual(capabilities.has(TerminalCapability.CommandDetection), false);
			await writeP(xterm, '\x1b]633;B\x07');
			strictEqual(capabilities.has(TerminalCapability.CommandDetection), true);
		});
		test('should pass command start sequence to the capability', async () => {
			const mock = shellIntegrationAddon.getCommandDetectionMock(xterm);
			mock.expects('handleCommandStart').once().withExactArgs();
			await writeP(xterm, '\x1b]633;B\x07');
			mock.verify();
		});
		test('should activate capability on the command executed sequence (OSC 633 ; C ST)', async () => {
			strictEqual(capabilities.has(TerminalCapability.CommandDetection), false);
			await writeP(xterm, 'foo');
			strictEqual(capabilities.has(TerminalCapability.CommandDetection), false);
			await writeP(xterm, '\x1b]633;C\x07');
			strictEqual(capabilities.has(TerminalCapability.CommandDetection), true);
		});
		test('should pass command executed sequence to the capability', async () => {
			const mock = shellIntegrationAddon.getCommandDetectionMock(xterm);
			mock.expects('handleCommandExecuted').once().withExactArgs();
			await writeP(xterm, '\x1b]633;C\x07');
			mock.verify();
		});
		test('should activate capability on the command finished sequence (OSC 633 ; D ; <ExitCode> ST)', async () => {
			strictEqual(capabilities.has(TerminalCapability.CommandDetection), false);
			await writeP(xterm, 'foo');
			strictEqual(capabilities.has(TerminalCapability.CommandDetection), false);
			await writeP(xterm, '\x1b]633;D;7\x07');
			strictEqual(capabilities.has(TerminalCapability.CommandDetection), true);
		});
		test('should pass command finished sequence to the capability', async () => {
			const mock = shellIntegrationAddon.getCommandDetectionMock(xterm);
			mock.expects('handleCommandFinished').once().withExactArgs(7);
			await writeP(xterm, '\x1b]633;D;7\x07');
			mock.verify();
		});
		test('should pass command line sequence to the capability', async () => {
			const mock = shellIntegrationAddon.getCommandDetectionMock(xterm);
			mock.expects('setCommandLine').once().withExactArgs('', false);
			await writeP(xterm, '\x1b]633;E\x07');
			mock.verify();

			const mock2 = shellIntegrationAddon.getCommandDetectionMock(xterm);
			mock2.expects('setCommandLine').twice().withExactArgs('cmd', false);
			await writeP(xterm, '\x1b]633;E;cmd\x07');
			await writeP(xterm, '\x1b]633;E;cmd;invalid-nonce\x07');
			mock2.verify();
		});
		test('should not activate capability on the cwd sequence (OSC 633 ; P=Cwd=<cwd> ST)', async () => {
			strictEqual(capabilities.has(TerminalCapability.CommandDetection), false);
			await writeP(xterm, 'foo');
			strictEqual(capabilities.has(TerminalCapability.CommandDetection), false);
			await writeP(xterm, '\x1b]633;P;Cwd=/foo\x07');
			strictEqual(capabilities.has(TerminalCapability.CommandDetection), false);
		});
		test('should pass cwd sequence to the capability if it\'s initialized', async () => {
			const mock = shellIntegrationAddon.getCommandDetectionMock(xterm);
			mock.expects('setCwd').once().withExactArgs('/foo');
			await writeP(xterm, '\x1b]633;P;Cwd=/foo\x07');
			mock.verify();
		});
	});
	suite('BufferMarkCapability', () => {
		test('SetMark', async () => {
			strictEqual(capabilities.has(TerminalCapability.BufferMarkDetection), false);
			await writeP(xterm, 'foo');
			strictEqual(capabilities.has(TerminalCapability.BufferMarkDetection), false);
			await writeP(xterm, '\x1b]633;SetMark;\x07');
			strictEqual(capabilities.has(TerminalCapability.BufferMarkDetection), true);
		});
		test('SetMark - ID', async () => {
			strictEqual(capabilities.has(TerminalCapability.BufferMarkDetection), false);
			await writeP(xterm, 'foo');
			strictEqual(capabilities.has(TerminalCapability.BufferMarkDetection), false);
			await writeP(xterm, '\x1b]633;SetMark;1;\x07');
			strictEqual(capabilities.has(TerminalCapability.BufferMarkDetection), true);
		});
		test('SetMark - hidden', async () => {
			strictEqual(capabilities.has(TerminalCapability.BufferMarkDetection), false);
			await writeP(xterm, 'foo');
			strictEqual(capabilities.has(TerminalCapability.BufferMarkDetection), false);
			await writeP(xterm, '\x1b]633;SetMark;;Hidden\x07');
			strictEqual(capabilities.has(TerminalCapability.BufferMarkDetection), true);
		});
		test('SetMark - hidden & ID', async () => {
			strictEqual(capabilities.has(TerminalCapability.BufferMarkDetection), false);
			await writeP(xterm, 'foo');
			strictEqual(capabilities.has(TerminalCapability.BufferMarkDetection), false);
			await writeP(xterm, '\x1b]633;SetMark;1;Hidden\x07');
			strictEqual(capabilities.has(TerminalCapability.BufferMarkDetection), true);
		});
		suite('parseMarkSequence', () => {
			test('basic', async () => {
				deepEqual(parseMarkSequence(['', '']), { id: undefined, hidden: false });
			});
			test('ID', async () => {
				deepEqual(parseMarkSequence(['Id=3', '']), { id: '3', hidden: false });
			});
			test('hidden', async () => {
				deepEqual(parseMarkSequence(['', 'Hidden']), { id: undefined, hidden: true });
			});
			test('ID + hidden', async () => {
				deepEqual(parseMarkSequence(['Id=4555', 'Hidden']), { id: '4555', hidden: true });
			});
		});
	});

	suite('deserializeMessage', () => {
		// A single literal backslash, in order to avoid confusion about whether we are escaping test data or testing escapes.
		const Backslash = '\\' as const;
		const Newline = '\n' as const;
		const Semicolon = ';' as const;

		type TestCase = [title: string, input: string, expected: string];
		const cases: TestCase[] = [
			['empty', '', ''],
			['basic', 'value', 'value'],
			['space', 'some thing', 'some thing'],
			['escaped backslash', `${Backslash}${Backslash}`, Backslash],
			['non-initial escaped backslash', `foo${Backslash}${Backslash}`, `foo${Backslash}`],
			['two escaped backslashes', `${Backslash}${Backslash}${Backslash}${Backslash}`, `${Backslash}${Backslash}`],
			['escaped backslash amidst text', `Hello${Backslash}${Backslash}there`, `Hello${Backslash}there`],
			['backslash escaped literally and as hex', `${Backslash}${Backslash} is same as ${Backslash}x5c`, `${Backslash} is same as ${Backslash}`],
			['escaped semicolon', `${Backslash}x3b`, Semicolon],
			['non-initial escaped semicolon', `foo${Backslash}x3b`, `foo${Semicolon}`],
			['escaped semicolon (upper hex)', `${Backslash}x3B`, Semicolon],
			['escaped backslash followed by literal "x3b" is not a semicolon', `${Backslash}${Backslash}x3b`, `${Backslash}x3b`],
			['non-initial escaped backslash followed by literal "x3b" is not a semicolon', `foo${Backslash}${Backslash}x3b`, `foo${Backslash}x3b`],
			['escaped backslash followed by escaped semicolon', `${Backslash}${Backslash}${Backslash}x3b`, `${Backslash}${Semicolon}`],
			['escaped semicolon amidst text', `some${Backslash}x3bthing`, `some${Semicolon}thing`],
			['escaped newline', `${Backslash}x0a`, Newline],
			['non-initial escaped newline', `foo${Backslash}x0a`, `foo${Newline}`],
			['escaped newline (upper hex)', `${Backslash}x0A`, Newline],
			['escaped backslash followed by literal "x0a" is not a newline', `${Backslash}${Backslash}x0a`, `${Backslash}x0a`],
			['non-initial escaped backslash followed by literal "x0a" is not a newline', `foo${Backslash}${Backslash}x0a`, `foo${Backslash}x0a`],
			['PS1 simple', '[\\u@\\h \\W]\\$', '[\\u@\\h \\W]\\$'],
			['PS1 VSC SI', `${Backslash}x1b]633;A${Backslash}x07\\[${Backslash}x1b]0;\\u@\\h:\\w\\a\\]${Backslash}x1b]633;B${Backslash}x07`, '\x1b]633;A\x07\\[\x1b]0;\\u@\\h:\\w\\a\\]\x1b]633;B\x07']
		];

		cases.forEach(([title, input, expected]) => {
			test(title, () => strictEqual(deserializeVSCodeOscMessage(input), expected));
		});
	});

	suite('serializeVSCodeOscMessage', () => {
		// A single literal backslash, in order to avoid confusion about whether we are escaping test data or testing escapes.
		const Backslash = '\\' as const;
		const Newline = '\n' as const;
		const Semicolon = ';' as const;

		type TestCase = [title: string, input: string, expected: string];
		const cases: TestCase[] = [
			['empty', '', ''],
			['basic', 'value', 'value'],
			['space', 'some thing', `some${Backslash}x20thing`],
			['backslash', Backslash, `${Backslash}${Backslash}`],
			['non-initial backslash', `foo${Backslash}`, `foo${Backslash}${Backslash}`],
			['two backslashes', `${Backslash}${Backslash}`, `${Backslash}${Backslash}${Backslash}${Backslash}`],
			['backslash amidst text', `Hello${Backslash}there`, `Hello${Backslash}${Backslash}there`],
			['semicolon', Semicolon, `${Backslash}x3b`],
			['non-initial semicolon', `foo${Semicolon}`, `foo${Backslash}x3b`],
			['semicolon amidst text', `some${Semicolon}thing`, `some${Backslash}x3bthing`],
			['newline', Newline, `${Backslash}x0a`],
			['non-initial newline', `foo${Newline}`, `foo${Backslash}x0a`],
			['newline amidst text', `some${Newline}thing`, `some${Backslash}x0athing`],
			['tab character', '\t', `${Backslash}x09`],
			['carriage return', '\r', `${Backslash}x0d`],
			['null character', '\x00', `${Backslash}x00`],
			['space character (0x20)', ' ', `${Backslash}x20`],
			['character above 0x20', '!', '!'],
			['multiple special chars', `hello${Newline}world${Semicolon}test${Backslash}end`, `hello${Backslash}x0aworld${Backslash}x3btest${Backslash}${Backslash}end`],
			['PS1 with escape sequences', `\x1b]633;A\x07\\[\x1b]0;\\u@\\h:\\w\\a\\]\x1b]633;B\x07`, `${Backslash}x1b]633${Backslash}x3bA${Backslash}x07${Backslash}${Backslash}[${Backslash}x1b]0${Backslash}x3b${Backslash}${Backslash}u@${Backslash}${Backslash}h:${Backslash}${Backslash}w${Backslash}${Backslash}a${Backslash}${Backslash}]${Backslash}x1b]633${Backslash}x3bB${Backslash}x07`]
		];

		cases.forEach(([title, input, expected]) => {
			test(title, () => strictEqual(serializeVSCodeOscMessage(input), expected));
		});
	});

	test('parseKeyValueAssignment', () => {
		type TestCase = [title: string, input: string, expected: [key: string, value: string | undefined]];
		const cases: TestCase[] = [
			['empty', '', ['', undefined]],
			['no "=" sign', 'some-text', ['some-text', undefined]],
			['empty value', 'key=', ['key', '']],
			['empty key', '=value', ['', 'value']],
			['normal', 'key=value', ['key', 'value']],
			['multiple "=" signs (1)', 'key==value', ['key', '=value']],
			['multiple "=" signs (2)', 'key=value===true', ['key', 'value===true']],
			['just a "="', '=', ['', '']],
			['just a "=="', '==', ['', '=']],
		];

		cases.forEach(x => {
			const [title, input, [key, value]] = x;
			deepStrictEqual(parseKeyValueAssignment(input), { key, value }, title);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/browser/xterm/xtermTerminal.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/xterm/xtermTerminal.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { WebglAddon } from '@xterm/addon-webgl';
import type { IEvent, Terminal } from '@xterm/xterm';
import { deepStrictEqual, strictEqual } from 'assert';
import { importAMDNodeModule } from '../../../../../../amdX.js';
import { Color, RGBA } from '../../../../../../base/common/color.js';
import { Emitter } from '../../../../../../base/common/event.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { IEditorOptions } from '../../../../../../editor/common/config/editorOptions.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { TerminalCapabilityStore } from '../../../../../../platform/terminal/common/capabilities/terminalCapabilityStore.js';
import { IThemeService } from '../../../../../../platform/theme/common/themeService.js';
import { TestColorTheme, TestThemeService } from '../../../../../../platform/theme/test/common/testThemeService.js';
import { PANEL_BACKGROUND, SIDE_BAR_BACKGROUND } from '../../../../../common/theme.js';
import { IViewDescriptor, IViewDescriptorService, ViewContainerLocation } from '../../../../../common/views.js';
import { XtermTerminal } from '../../../browser/xterm/xtermTerminal.js';
import { ITerminalConfiguration, TERMINAL_VIEW_ID } from '../../../common/terminal.js';
import { registerColors, TERMINAL_BACKGROUND_COLOR, TERMINAL_CURSOR_BACKGROUND_COLOR, TERMINAL_CURSOR_FOREGROUND_COLOR, TERMINAL_FOREGROUND_COLOR, TERMINAL_INACTIVE_SELECTION_BACKGROUND_COLOR, TERMINAL_SELECTION_BACKGROUND_COLOR, TERMINAL_SELECTION_FOREGROUND_COLOR } from '../../../common/terminalColorRegistry.js';
import { workbenchInstantiationService } from '../../../../../test/browser/workbenchTestServices.js';
import { IXtermAddonNameToCtor, XtermAddonImporter } from '../../../browser/xterm/xtermAddonImporter.js';

registerColors();

class TestWebglAddon implements WebglAddon {
	static shouldThrow = false;
	static isEnabled = false;
	readonly onChangeTextureAtlas = new Emitter().event as IEvent<HTMLCanvasElement>;
	readonly onAddTextureAtlasCanvas = new Emitter().event as IEvent<HTMLCanvasElement>;
	readonly onRemoveTextureAtlasCanvas = new Emitter().event as IEvent<HTMLCanvasElement, void>;
	readonly onContextLoss = new Emitter().event as IEvent<void>;
	constructor(preserveDrawingBuffer?: boolean) {
	}
	activate() {
		TestWebglAddon.isEnabled = !TestWebglAddon.shouldThrow;
		if (TestWebglAddon.shouldThrow) {
			throw new Error('Test webgl set to throw');
		}
	}
	dispose() {
		TestWebglAddon.isEnabled = false;
	}
	clearTextureAtlas() { }
}

class TestXtermAddonImporter extends XtermAddonImporter {
	override async importAddon<T extends keyof IXtermAddonNameToCtor>(name: T): Promise<IXtermAddonNameToCtor[T]> {
		if (name === 'webgl') {
			return TestWebglAddon as unknown as IXtermAddonNameToCtor[T];
		}
		return super.importAddon(name);
	}
}

export class TestViewDescriptorService implements Partial<IViewDescriptorService> {
	private _location = ViewContainerLocation.Panel;
	private _onDidChangeLocation = new Emitter<{ views: IViewDescriptor[]; from: ViewContainerLocation; to: ViewContainerLocation }>();
	onDidChangeLocation = this._onDidChangeLocation.event;
	getViewLocationById(id: string) {
		return this._location;
	}
	moveTerminalToLocation(to: ViewContainerLocation) {
		const oldLocation = this._location;
		this._location = to;
		this._onDidChangeLocation.fire({
			views: [
				{ id: TERMINAL_VIEW_ID } as unknown as IViewDescriptor
			],
			from: oldLocation,
			to
		});
	}
}

const defaultTerminalConfig: Partial<ITerminalConfiguration> = {
	fontFamily: 'monospace',
	fontWeight: 'normal',
	fontWeightBold: 'normal',
	gpuAcceleration: 'off',
	scrollback: 10,
	fastScrollSensitivity: 2,
	mouseWheelScrollSensitivity: 1,
	unicodeVersion: '6'
};

suite('XtermTerminal', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let configurationService: TestConfigurationService;
	let themeService: TestThemeService;
	let xterm: XtermTerminal;
	let XTermBaseCtor: typeof Terminal;

	function write(data: string): Promise<void> {
		return new Promise<void>((resolve) => {
			xterm.write(data, resolve);
		});
	}

	setup(async () => {
		configurationService = new TestConfigurationService({
			editor: {
				fastScrollSensitivity: 2,
				mouseWheelScrollSensitivity: 1
			} as Partial<IEditorOptions>,
			files: {},
			terminal: {
				integrated: defaultTerminalConfig
			}
		});

		instantiationService = workbenchInstantiationService({
			configurationService: () => configurationService
		}, store);
		themeService = instantiationService.get(IThemeService) as TestThemeService;

		XTermBaseCtor = (await importAMDNodeModule<typeof import('@xterm/xterm')>('@xterm/xterm', 'lib/xterm.js')).Terminal;

		const capabilityStore = store.add(new TerminalCapabilityStore());
		xterm = store.add(instantiationService.createInstance(XtermTerminal, undefined, XTermBaseCtor, {
			cols: 80,
			rows: 30,
			xtermColorProvider: { getBackgroundColor: () => undefined },
			capabilities: capabilityStore,
			disableShellIntegrationReporting: true,
			xtermAddonImporter: new TestXtermAddonImporter(),
		}, undefined));

		TestWebglAddon.shouldThrow = false;
		TestWebglAddon.isEnabled = false;
	});

	test('should use fallback dimensions of 80x30', () => {
		strictEqual(xterm.raw.cols, 80);
		strictEqual(xterm.raw.rows, 30);
	});

	suite('getContentsAsText', () => {
		test('should return all buffer contents when no markers provided', async () => {
			await write('line 1\r\nline 2\r\nline 3\r\nline 4\r\nline 5');

			const result = xterm.getContentsAsText();
			strictEqual(result.startsWith('line 1\nline 2\nline 3\nline 4\nline 5'), true, 'Should include the content plus empty lines up to buffer length');
			const lines = result.split('\n');
			strictEqual(lines.length, xterm.raw.buffer.active.length, 'Should end with empty lines (total buffer size is 30 rows)');
		});

		test('should return contents from start marker to end', async () => {
			await write('line 1\r\n');
			const startMarker = xterm.raw.registerMarker(0)!;
			await write('line 2\r\nline 3\r\nline 4\r\nline 5');

			const result = xterm.getContentsAsText(startMarker);
			strictEqual(result.startsWith('line 2\nline 3\nline 4\nline 5'), true, 'Should start with line 2 and include empty lines');
		});

		test('should return contents from start to end marker', async () => {
			await write('line 1\r\n');
			const startMarker = xterm.raw.registerMarker(0)!;
			await write('line 2\r\nline 3\r\n');
			const endMarker = xterm.raw.registerMarker(0)!;
			await write('line 4\r\nline 5');

			const result = xterm.getContentsAsText(startMarker, endMarker);
			strictEqual(result, 'line 2\nline 3\nline 4');
		});

		test('should return single line when start and end markers are the same', async () => {
			await write('line 1\r\nline 2\r\n');
			const marker = xterm.raw.registerMarker(0)!;
			await write('line 3\r\nline 4\r\nline 5');

			const result = xterm.getContentsAsText(marker, marker);
			strictEqual(result, 'line 3');
		});

		test('should return empty string when start marker is beyond end marker', async () => {
			await write('line 1\r\n');
			const endMarker = xterm.raw.registerMarker(0)!;
			await write('line 2\r\nline 3\r\n');
			const startMarker = xterm.raw.registerMarker(0)!;
			await write('line 4\r\nline 5');

			const result = xterm.getContentsAsText(startMarker, endMarker);
			strictEqual(result, '');
		});

		test('should handle empty buffer', async () => {
			const result = xterm.getContentsAsText();
			const lines = result.split('\n');
			strictEqual(lines.length, xterm.raw.buffer.active.length, 'Empty terminal should have empty lines equal to buffer length');
			strictEqual(lines.every(line => line === ''), true, 'All lines should be empty');
		});

		test('should handle mixed content with spaces and special characters', async () => {
			await write('hello world\r\n  indented line\r\nline with $pecial chars!@#\r\n\r\nempty line above');

			const result = xterm.getContentsAsText();
			strictEqual(result.startsWith('hello world\n  indented line\nline with $pecial chars!@#\n\nempty line above'), true, 'Should handle spaces and special characters correctly');
		});

		test('should throw error when startMarker is disposed (line === -1)', async () => {
			await write('line 1\r\n');
			const disposedMarker = xterm.raw.registerMarker(0)!;
			await write('line 2\r\nline 3\r\nline 4\r\nline 5');

			disposedMarker.dispose();

			try {
				xterm.getContentsAsText(disposedMarker);
				throw new Error('Expected error was not thrown');
			} catch (error: any) {
				strictEqual(error.message, 'Cannot get contents of a disposed startMarker');
			}
		});

		test('should throw error when endMarker is disposed (line === -1)', async () => {
			await write('line 1\r\n');
			const startMarker = xterm.raw.registerMarker(0)!;
			await write('line 2\r\n');
			const disposedEndMarker = xterm.raw.registerMarker(0)!;
			await write('line 3\r\nline 4\r\nline 5');

			disposedEndMarker.dispose();

			try {
				xterm.getContentsAsText(startMarker, disposedEndMarker);
				throw new Error('Expected error was not thrown');
			} catch (error: any) {
				strictEqual(error.message, 'Cannot get contents of a disposed endMarker');
			}
		});

		test('should handle markers at buffer boundaries', async () => {
			const startMarker = xterm.raw.registerMarker(0)!;
			await write('line 1\r\nline 2\r\nline 3\r\nline 4\r\n');
			const endMarker = xterm.raw.registerMarker(0)!;
			await write('line 5');

			const result = xterm.getContentsAsText(startMarker, endMarker);
			strictEqual(result, 'line 1\nline 2\nline 3\nline 4\nline 5', 'Should handle markers at buffer boundaries correctly');
		});

		test('should handle terminal escape sequences properly', async () => {
			await write('\x1b[31mred text\x1b[0m\r\n\x1b[32mgreen text\x1b[0m');

			const result = xterm.getContentsAsText();
			strictEqual(result.startsWith('red text\ngreen text'), true, 'ANSI escape sequences should be filtered out, but there will be trailing empty lines');
		});
	});

	suite('getBufferReverseIterator', () => {
		test('should get text properly within scrollback limit', async () => {
			const text = 'line 1\r\nline 2\r\nline 3\r\nline 4\r\nline 5';
			await write(text);

			const result = [...xterm.getBufferReverseIterator()].reverse().join('\r\n');
			strictEqual(text, result, 'Should equal original text');
		});
		test('should get text properly when exceed scrollback limit', async () => {
			// max buffer lines(40) = rows(30) + scrollback(10)
			const text = 'line 1\r\nline 2\r\nline 3\r\nline 4\r\nline 5\r\n'.repeat(8).trim();
			await write(text);
			await write('\r\nline more');

			const result = [...xterm.getBufferReverseIterator()].reverse().join('\r\n');
			const expect = text.slice(8) + '\r\nline more';
			strictEqual(expect, result, 'Should equal original text without line 1');
		});
	});

	suite('theme', () => {
		test('should apply correct background color based on getBackgroundColor', () => {
			themeService.setTheme(new TestColorTheme({
				[PANEL_BACKGROUND]: '#ff0000',
				[SIDE_BAR_BACKGROUND]: '#00ff00'
			}));
			xterm = store.add(instantiationService.createInstance(XtermTerminal, undefined, XTermBaseCtor, {
				cols: 80,
				rows: 30,
				xtermAddonImporter: new TestXtermAddonImporter(),
				xtermColorProvider: { getBackgroundColor: () => new Color(new RGBA(255, 0, 0)) },
				capabilities: store.add(new TerminalCapabilityStore()),
				disableShellIntegrationReporting: true,
			}, undefined));
			strictEqual(xterm.raw.options.theme?.background, '#ff0000');
		});
		test('should react to and apply theme changes', () => {
			themeService.setTheme(new TestColorTheme({
				[TERMINAL_BACKGROUND_COLOR]: '#000100',
				[TERMINAL_FOREGROUND_COLOR]: '#000200',
				[TERMINAL_CURSOR_FOREGROUND_COLOR]: '#000300',
				[TERMINAL_CURSOR_BACKGROUND_COLOR]: '#000400',
				[TERMINAL_SELECTION_BACKGROUND_COLOR]: '#000500',
				[TERMINAL_INACTIVE_SELECTION_BACKGROUND_COLOR]: '#000600',
				[TERMINAL_SELECTION_FOREGROUND_COLOR]: undefined,
				'terminal.ansiBlack': '#010000',
				'terminal.ansiRed': '#020000',
				'terminal.ansiGreen': '#030000',
				'terminal.ansiYellow': '#040000',
				'terminal.ansiBlue': '#050000',
				'terminal.ansiMagenta': '#060000',
				'terminal.ansiCyan': '#070000',
				'terminal.ansiWhite': '#080000',
				'terminal.ansiBrightBlack': '#090000',
				'terminal.ansiBrightRed': '#100000',
				'terminal.ansiBrightGreen': '#110000',
				'terminal.ansiBrightYellow': '#120000',
				'terminal.ansiBrightBlue': '#130000',
				'terminal.ansiBrightMagenta': '#140000',
				'terminal.ansiBrightCyan': '#150000',
				'terminal.ansiBrightWhite': '#160000',
			}));
			xterm = store.add(instantiationService.createInstance(XtermTerminal, undefined, XTermBaseCtor, {
				cols: 80,
				rows: 30,
				xtermAddonImporter: new TestXtermAddonImporter(),
				xtermColorProvider: { getBackgroundColor: () => undefined },
				capabilities: store.add(new TerminalCapabilityStore()),
				disableShellIntegrationReporting: true
			}, undefined));
			deepStrictEqual(xterm.raw.options.theme, {
				background: undefined,
				foreground: '#000200',
				cursor: '#000300',
				cursorAccent: '#000400',
				selectionBackground: '#000500',
				selectionInactiveBackground: '#000600',
				selectionForeground: undefined,
				overviewRulerBorder: undefined,
				scrollbarSliderActiveBackground: undefined,
				scrollbarSliderBackground: undefined,
				scrollbarSliderHoverBackground: undefined,
				black: '#010000',
				green: '#030000',
				red: '#020000',
				yellow: '#040000',
				blue: '#050000',
				magenta: '#060000',
				cyan: '#070000',
				white: '#080000',
				brightBlack: '#090000',
				brightRed: '#100000',
				brightGreen: '#110000',
				brightYellow: '#120000',
				brightBlue: '#130000',
				brightMagenta: '#140000',
				brightCyan: '#150000',
				brightWhite: '#160000',
			});
			themeService.setTheme(new TestColorTheme({
				[TERMINAL_BACKGROUND_COLOR]: '#00010f',
				[TERMINAL_FOREGROUND_COLOR]: '#00020f',
				[TERMINAL_CURSOR_FOREGROUND_COLOR]: '#00030f',
				[TERMINAL_CURSOR_BACKGROUND_COLOR]: '#00040f',
				[TERMINAL_SELECTION_BACKGROUND_COLOR]: '#00050f',
				[TERMINAL_INACTIVE_SELECTION_BACKGROUND_COLOR]: '#00060f',
				[TERMINAL_SELECTION_FOREGROUND_COLOR]: '#00070f',
				'terminal.ansiBlack': '#01000f',
				'terminal.ansiRed': '#02000f',
				'terminal.ansiGreen': '#03000f',
				'terminal.ansiYellow': '#04000f',
				'terminal.ansiBlue': '#05000f',
				'terminal.ansiMagenta': '#06000f',
				'terminal.ansiCyan': '#07000f',
				'terminal.ansiWhite': '#08000f',
				'terminal.ansiBrightBlack': '#09000f',
				'terminal.ansiBrightRed': '#10000f',
				'terminal.ansiBrightGreen': '#11000f',
				'terminal.ansiBrightYellow': '#12000f',
				'terminal.ansiBrightBlue': '#13000f',
				'terminal.ansiBrightMagenta': '#14000f',
				'terminal.ansiBrightCyan': '#15000f',
				'terminal.ansiBrightWhite': '#16000f',
			}));
			deepStrictEqual(xterm.raw.options.theme, {
				background: undefined,
				foreground: '#00020f',
				cursor: '#00030f',
				cursorAccent: '#00040f',
				selectionBackground: '#00050f',
				selectionInactiveBackground: '#00060f',
				selectionForeground: '#00070f',
				overviewRulerBorder: undefined,
				scrollbarSliderActiveBackground: undefined,
				scrollbarSliderBackground: undefined,
				scrollbarSliderHoverBackground: undefined,
				black: '#01000f',
				green: '#03000f',
				red: '#02000f',
				yellow: '#04000f',
				blue: '#05000f',
				magenta: '#06000f',
				cyan: '#07000f',
				white: '#08000f',
				brightBlack: '#09000f',
				brightRed: '#10000f',
				brightGreen: '#11000f',
				brightYellow: '#12000f',
				brightBlue: '#13000f',
				brightMagenta: '#14000f',
				brightCyan: '#15000f',
				brightWhite: '#16000f',
			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/browser/xterm/recordings/basic/macos_zsh_p10k_ls_one_time.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/xterm/recordings/basic/macos_zsh_p10k_ls_one_time.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/* eslint-disable */

// macOS 15.5
// zsh 5.9
// powerlevel10k 8fa10f4
// Steps:
// - Open terminal
// - Type ls
// - Press enter
export const events = [
	{
		"type": "resize",
		"cols": 107,
		"rows": 24
	},
	{
		"type": "output",
		"data": "\u001b[1m\u001b[7m%\u001b[27m\u001b[1m\u001b[0m                                                                                                          \r \r"
	},
	{
		"type": "output",
		"data": "\r\u001b[0m\u001b[27m\u001b[24m\u001b[J\u001b[0m\u001b[38;5;238m\u001b[49m\u001b[39m\u001b]133;A\u0007\r\n\u001b[A\u001b[38;5;238m╭─\u001b[0m\u001b[38;5;238m\u001b[48;5;234m\u001b[38;5;31m \u001b[1m\u001b[38;5;31m\u001b[48;5;234m\u001b[38;5;39m~\u001b[0m\u001b[38;5;39m\u001b[48;5;234m\u001b[48;5;234m\u001b[38;5;31m/playground/\u001b[1m\u001b[38;5;31m\u001b[48;5;234m\u001b[38;5;39mtest1\u001b[0m\u001b[38;5;39m\u001b[48;5;234m\u001b[48;5;234m\u001b[38;5;31m\u001b[0m\u001b[38;5;31m\u001b[48;5;234m\u001b[48;5;234m\u001b[38;5;31m \u001b[0m\u001b[38;5;31m\u001b[48;5;234m\u001b[49m\u001b[38;5;234m▓▒░\u001b[0m\u001b[38;5;234m\u001b[49m\u001b[39m                                                              \u001b[0m\u001b[49m\u001b[38;5;234m░▒▓\u001b[0m\u001b[38;5;234m\u001b[48;5;234m\u001b[38;5;70m \u001b[0m\u001b[38;5;70m\u001b[48;5;234m\u001b[48;5;234m\u001b[38;5;70m✔\u001b[0m\u001b[38;5;70m\u001b[48;5;234m\u001b[48;5;234m\u001b[38;5;70m \u001b[0m\u001b[38;5;70m\u001b[48;5;234m\u001b[48;5;234m\u001b[38;5;70m\u001b[0m\u001b[38;5;70m\u001b[48;5;234m\u001b[48;5;234m\u001b[38;5;66m\u001b[38;5;242m│\u001b[0m\u001b[38;5;242m\u001b[48;5;234m\u001b[48;5;234m\u001b[38;5;66m 07:26:58\u001b[0m\u001b[38;5;66m\u001b[48;5;234m\u001b[48;5;234m\u001b[38;5;66m\u001b[0m\u001b[38;5;66m\u001b[48;5;234m\u001b[48;5;234m\u001b[38;5;66m \u001b[0m\u001b[38;5;66m\u001b[48;5;234m\u001b[49m\u001b[39m\u001b[38;5;238m─╮\r\n\u001b[38;5;238m╰─\u001b[0m\u001b[38;5;238m\u001b[49m\u001b[39m\u001b[0m\u001b[49m\u001b[39m \u001b[0m\u001b[49m\u001b[39m\u001b]133;B\u0007\u001b[K\u001b[101C\u001b[0m\u001b[49m\u001b[39m\u001b[38;5;238m─╯\u001b[39m\u001b[103D\u001b[?2004h"
	},
	{
		"type": "promptInputChange",
		"data": "|"
	},
	{
		"type": "promptInputChange",
		"data": "|                                                                                                     ─╯"
	},
	{
		"type": "promptInputChange",
		"data": "|                                                                                                     ─╯"
	},
	{
		"type": "input",
		"data": "l"
	},
	{
		"type": "output",
		"data": "l"
	},
	{
		"type": "promptInputChange",
		"data": "l|                                                                                                    ─╯"
	},
	{
		"type": "input",
		"data": "s"
	},
	{
		"type": "output",
		"data": "\bls"
	},
	{
		"type": "promptInputChange",
		"data": "ls|                                                                                                   ─╯"
	},
	{
		"type": "input",
		"data": "\r"
	},
	{
		"type": "output",
		"data": "\u001b[?25l\u001b[?2004l\r\r\u001b[A\u001b[0m\u001b[27m\u001b[24m\u001b[J\u001b]133;A\u0007\u001b[0m\u001b[49m\u001b[27m\u001b[24m\u001b[38;5;76m❯\u001b[0m\u001b[38;5;76m\u001b[49m\u001b[39m\u001b[27m\u001b[24m \u001b]133;B\u0007ls\u001b[K\u001b[?25h\r\r\n\u001b]133;C;\u0007"
	},
	{
		"type": "promptInputChange",
		"data": "ls                                                                                                   ─╯"
	},
	{
		"type": "output",
		"data": "test\r\n\u001b[1m\u001b[7m%\u001b[27m\u001b[1m\u001b[0m                                                                                                          \r \r"
	},
	{
		"type": "output",
		"data": "\u001b]133;D;0\u0007"
	},
	{
		"type": "output",
		"data": "\r\u001b[0m\u001b[27m\u001b[24m\u001b[J\u001b[0m\u001b[38;5;238m\u001b[49m\u001b[39m\u001b]133;A\u0007\r\n\r\n\u001b[A\u001b[38;5;238m╭─\u001b[0m\u001b[38;5;238m\u001b[48;5;234m\u001b[38;5;31m \u001b[1m\u001b[38;5;31m\u001b[48;5;234m\u001b[38;5;39m~\u001b[0m\u001b[38;5;39m\u001b[48;5;234m\u001b[48;5;234m\u001b[38;5;31m/playground/\u001b[1m\u001b[38;5;31m\u001b[48;5;234m\u001b[38;5;39mtest1\u001b[0m\u001b[38;5;39m\u001b[48;5;234m\u001b[48;5;234m\u001b[38;5;31m\u001b[0m\u001b[38;5;31m\u001b[48;5;234m\u001b[48;5;234m\u001b[38;5;31m \u001b[0m\u001b[38;5;31m\u001b[48;5;234m\u001b[49m\u001b[38;5;234m▓▒░\u001b[0m\u001b[38;5;234m\u001b[49m\u001b[39m                                                              \u001b[0m\u001b[49m\u001b[38;5;234m░▒▓\u001b[0m\u001b[38;5;234m\u001b[48;5;234m\u001b[38;5;70m \u001b[0m\u001b[38;5;70m\u001b[48;5;234m\u001b[48;5;234m\u001b[38;5;70m✔\u001b[0m\u001b[38;5;70m\u001b[48;5;234m\u001b[48;5;234m\u001b[38;5;70m \u001b[0m\u001b[38;5;70m\u001b[48;5;234m\u001b[48;5;234m\u001b[38;5;70m\u001b[0m\u001b[38;5;70m\u001b[48;5;234m\u001b[48;5;234m\u001b[38;5;66m\u001b[38;5;242m│\u001b[0m\u001b[38;5;242m\u001b[48;5;234m\u001b[48;5;234m\u001b[38;5;66m 07:27:00\u001b[0m\u001b[38;5;66m\u001b[48;5;234m\u001b[48;5;234m\u001b[38;5;66m\u001b[0m\u001b[38;5;66m\u001b[48;5;234m\u001b[48;5;234m\u001b[38;5;66m \u001b[0m\u001b[38;5;66m\u001b[48;5;234m\u001b[49m\u001b[39m\u001b[38;5;238m─╮\r\n\u001b[38;5;238m╰─\u001b[0m\u001b[38;5;238m\u001b[49m\u001b[39m\u001b[0m\u001b[49m\u001b[39m \u001b[0m\u001b[49m\u001b[39m\u001b]133;"
	},
	{
		"type": "output",
		"data": "B\u0007\u001b[K\u001b[101C\u001b[0m\u001b[49m\u001b[39m\u001b[38;5;238m─╯\u001b[39m\u001b[103D\u001b[?2004h"
	},
	{
		"type": "promptInputChange",
		"data": "|"
	},
	{
		"type": "promptInputChange",
		"data": "|                                                                                                     ─╯"
	}
];
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/browser/xterm/recordings/rich/macos_zsh_omz_echo_3_times.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/xterm/recordings/rich/macos_zsh_omz_echo_3_times.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/* eslint-disable */

// macOS 15.5
// zsh 5.9
// oh-my-zsh fa396ad
// Steps:
// - Open terminal
// - Type echo a
// - Press enter
// - Type echo b
// - Press enter
// - Type echo c
// - Press enter
export const events = [
	{
		"type": "resize",
		"cols": 107,
		"rows": 24
	},
	{
		"type": "output",
		"data": "\u001b]633;P;ContinuationPrompt=%_> \u0007\u001b]633;P;PromptType=p10k\u0007\u001b]633;P;HasRichCommandDetection=True\u0007\u001b[1m\u001b[7m%\u001b[27m\u001b[1m\u001b[0m                                                                                                          \r \r"
	},
	{
		"type": "output",
		"data": "\u001b]633;D\u0007"
	},
	{
		"type": "output",
		"data": ""
	},
	{
		"type": "output",
		"data": "\u001b]633;P;Cwd=/Users/tyriar/playground/test1\u0007\u001b]633;EnvSingleStart;0;448d50d0-70fe-4ab5-842e-132f3b1c159a;\u0007\u001b]633;EnvSingleEnd;448d50d0-70fe-4ab5-842e-132f3b1c159a;\u0007\r\u001b[0m\u001b[27m\u001b[24m\u001b[J\u001b]633;A\u0007tyriar@Mac test1 % \u001b]633;B\u0007\u001b[K\u001b[?2004h"
	},
	{
		"type": "promptInputChange",
		"data": "|"
	},
	{
		"type": "input",
		"data": "e"
	},
	{
		"type": "output",
		"data": "e"
	},
	{
		"type": "promptInputChange",
		"data": "e|"
	},
	{
		"type": "input",
		"data": "c"
	},
	{
		"type": "output",
		"data": "\bec"
	},
	{
		"type": "promptInputChange",
		"data": "ec|"
	},
	{
		"type": "input",
		"data": "h"
	},
	{
		"type": "output",
		"data": "h"
	},
	{
		"type": "promptInputChange",
		"data": "ech|"
	},
	{
		"type": "input",
		"data": "o"
	},
	{
		"type": "output",
		"data": "o"
	},
	{
		"type": "promptInputChange",
		"data": "echo|"
	},
	{
		"type": "input",
		"data": " "
	},
	{
		"type": "output",
		"data": " "
	},
	{
		"type": "promptInputChange",
		"data": "echo |"
	},
	{
		"type": "input",
		"data": "a"
	},
	{
		"type": "output",
		"data": "a"
	},
	{
		"type": "promptInputChange",
		"data": "echo a|"
	},
	{
		"type": "input",
		"data": "\r"
	},
	{
		"type": "output",
		"data": "\u001b[?2004l\r\r\n\u001b]633;E;echo a;448d50d0-70fe-4ab5-842e-132f3b1c159a\u0007"
	},
	{
		"type": "output",
		"data": "\u001b]633;C\u0007"
	},
	{
		"type": "output",
		"data": "a\r\n\u001b[1m\u001b[7m%\u001b[27m\u001b[1m\u001b[0m                                                                                                          \r \r"
	},
	{
		"type": "output",
		"data": "\u001b]633;D;0\u0007"
	},
	{
		"type": "output",
		"data": ""
	},
	{
		"type": "promptInputChange",
		"data": "echo a"
	},
	{
		"type": "output",
		"data": "\u001b]633;P;Cwd=/Users/tyriar/playground/test1\u0007\u001b]633;EnvSingleStart;0;448d50d0-70fe-4ab5-842e-132f3b1c159a;\u0007\u001b]633;EnvSingleEnd;448d50d0-70fe-4ab5-842e-132f3b1c159a;\u0007\r\u001b[0m\u001b[27m\u001b[24m\u001b[J\u001b]633;A\u0007tyriar@Mac test1 % \u001b]633;B\u0007\u001b[K\u001b[?2004h"
	},
	{
		"type": "promptInputChange",
		"data": "|"
	},
	{
		"type": "input",
		"data": "e"
	},
	{
		"type": "output",
		"data": "e"
	},
	{
		"type": "promptInputChange",
		"data": "e|"
	},
	{
		"type": "input",
		"data": "c"
	},
	{
		"type": "output",
		"data": "\bec"
	},
	{
		"type": "promptInputChange",
		"data": "ec|"
	},
	{
		"type": "input",
		"data": "h"
	},
	{
		"type": "output",
		"data": "h"
	},
	{
		"type": "promptInputChange",
		"data": "ech|"
	},
	{
		"type": "input",
		"data": "o"
	},
	{
		"type": "output",
		"data": "o"
	},
	{
		"type": "promptInputChange",
		"data": "echo|"
	},
	{
		"type": "input",
		"data": " "
	},
	{
		"type": "output",
		"data": " "
	},
	{
		"type": "promptInputChange",
		"data": "echo |"
	},
	{
		"type": "input",
		"data": "b"
	},
	{
		"type": "output",
		"data": "b"
	},
	{
		"type": "promptInputChange",
		"data": "echo b|"
	},
	{
		"type": "input",
		"data": "\r"
	},
	{
		"type": "output",
		"data": "\u001b[?2004l\r\r\n\u001b]633;E;echo b;448d50d0-70fe-4ab5-842e-132f3b1c159a\u0007"
	},
	{
		"type": "output",
		"data": "\u001b]633;C\u0007"
	},
	{
		"type": "output",
		"data": "b\r\n\u001b[1m\u001b[7m%\u001b[27m\u001b[1m\u001b[0m                                                                                                          \r \r"
	},
	{
		"type": "output",
		"data": "\u001b]633;D;0\u0007"
	},
	{
		"type": "output",
		"data": ""
	},
	{
		"type": "promptInputChange",
		"data": "echo b"
	},
	{
		"type": "output",
		"data": "\u001b]633;P;Cwd=/Users/tyriar/playground/test1\u0007\u001b]633;EnvSingleStart;0;448d50d0-70fe-4ab5-842e-132f3b1c159a;\u0007\u001b]633;EnvSingleEnd;448d50d0-70fe-4ab5-842e-132f3b1c159a;\u0007\r\u001b[0m\u001b[27m\u001b[24m\u001b[J\u001b]633;A\u0007tyriar@Mac test1 % \u001b]633;B\u0007\u001b[K\u001b[?2004h"
	},
	{
		"type": "promptInputChange",
		"data": "|"
	},
	{
		"type": "input",
		"data": "e"
	},
	{
		"type": "output",
		"data": "e"
	},
	{
		"type": "promptInputChange",
		"data": "e|"
	},
	{
		"type": "input",
		"data": "c"
	},
	{
		"type": "output",
		"data": "\bec"
	},
	{
		"type": "promptInputChange",
		"data": "ec|"
	},
	{
		"type": "input",
		"data": "h"
	},
	{
		"type": "output",
		"data": "h"
	},
	{
		"type": "promptInputChange",
		"data": "ech|"
	},
	{
		"type": "input",
		"data": "o"
	},
	{
		"type": "output",
		"data": "o"
	},
	{
		"type": "promptInputChange",
		"data": "echo|"
	},
	{
		"type": "input",
		"data": " "
	},
	{
		"type": "output",
		"data": " "
	},
	{
		"type": "promptInputChange",
		"data": "echo |"
	},
	{
		"type": "input",
		"data": "c"
	},
	{
		"type": "output",
		"data": "c"
	},
	{
		"type": "promptInputChange",
		"data": "echo c|"
	},
	{
		"type": "input",
		"data": "\r"
	},
	{
		"type": "output",
		"data": "\u001b[?2004l\r\r\n"
	},
	{
		"type": "output",
		"data": "\u001b]633;E;echo c;448d50d0-70fe-4ab5-842e-132f3b1c159a\u0007"
	},
	{
		"type": "output",
		"data": "\u001b]633;C\u0007"
	},
	{
		"type": "output",
		"data": "c\r\n\u001b[1m\u001b[7m%\u001b[27m\u001b[1m\u001b[0m                                                                                                          \r \r"
	},
	{
		"type": "output",
		"data": "\u001b]633;D;0\u0007"
	},
	{
		"type": "output",
		"data": ""
	},
	{
		"type": "promptInputChange",
		"data": "echo c"
	},
	{
		"type": "output",
		"data": "\u001b]633;P;Cwd=/Users/tyriar/playground/test1\u0007\u001b]633;EnvSingleStart;0;448d50d0-70fe-4ab5-842e-132f3b1c159a;\u0007\u001b]633;EnvSingleEnd;448d50d0-70fe-4ab5-842e-132f3b1c159a;\u0007\r\u001b[0m\u001b[27m\u001b[24m\u001b[J\u001b]633;A\u0007tyriar@Mac test1 % \u001b]633;B\u0007\u001b[K\u001b[?2004h"
	},
	{
		"type": "promptInputChange",
		"data": "|"
	}
];
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/browser/xterm/recordings/rich/macos_zsh_omz_ls_one_time.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/xterm/recordings/rich/macos_zsh_omz_ls_one_time.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/* eslint-disable */

// macOS 15.5
// zsh 5.9
// oh-my-zsh fa396ad
// Steps:
// - Open terminal
// - Type ls
// - Press enter
export const events = [
	{
		"type": "resize",
		"cols": 137,
		"rows": 24
	},
	{
		"type": "output",
		"data": "\u001b]633;P;ContinuationPrompt=%_> \u0007\u001b]633;P;PromptType=p10k\u0007\u001b]633;P;HasRichCommandDetection=True\u0007\u001b[1m\u001b[7m%\u001b[27m\u001b[1m\u001b[0m                                                                                                                                        \r \r"
	},
	{
		"type": "output",
		"data": "\u001b]633;D\u0007"
	},
	{
		"type": "output",
		"data": ""
	},
	{
		"type": "output",
		"data": "\u001b]633;P;Cwd=/Users/tyriar/playground/test1\u0007\u001b]633;EnvSingleStart;0;f249ba4c-3c40-4fdb-b658-ef7141d0d883;\u0007\u001b]633;EnvSingleEnd;f249ba4c-3c40-4fdb-b658-ef7141d0d883;\u0007\r\u001b[0m\u001b[27m\u001b[24m\u001b[J\u001b]633;A\u0007tyriar@Mac test1 % \u001b]633;B\u0007\u001b[K\u001b[?2004h"
	},
	{
		"type": "promptInputChange",
		"data": "|"
	},
	{
		"type": "input",
		"data": "l"
	},
	{
		"type": "output",
		"data": "l"
	},
	{
		"type": "promptInputChange",
		"data": "l|"
	},
	{
		"type": "input",
		"data": "s"
	},
	{
		"type": "output",
		"data": "\bls"
	},
	{
		"type": "promptInputChange",
		"data": "ls|"
	},
	{
		"type": "input",
		"data": "\r"
	},
	{
		"type": "output",
		"data": "\u001b[?2004l\r\r\n\u001b]633;E;ls;f249ba4c-3c40-4fdb-b658-ef7141d0d883\u0007"
	},
	{
		"type": "output",
		"data": "\u001b]633;C\u0007"
	},
	{
		"type": "output",
		"data": ""
	},
	{
		"type": "promptInputChange",
		"data": "ls"
	},
	{
		"type": "output",
		"data": "test\r\n\u001b[1m\u001b[7m%\u001b[27m\u001b[1m\u001b[0m                                                                                                                                        \r \r"
	},
	{
		"type": "output",
		"data": "\u001b]633;D;0\u0007"
	},
	{
		"type": "output",
		"data": ""
	},
	{
		"type": "output",
		"data": "\u001b]633;P;Cwd=/Users/tyriar/playground/test1\u0007\u001b]633;EnvSingleStart;0;f249ba4c-3c40-4fdb-b658-ef7141d0d883;\u0007\u001b]633;EnvSingleEnd;f249ba4c-3c40-4fdb-b658-ef7141d0d883;\u0007\r\u001b[0m\u001b[27m\u001b[24m\u001b[J\u001b]633;A\u0007tyriar@Mac test1 % \u001b]633;B\u0007\u001b[K\u001b[?2004h"
	},
	{
		"type": "promptInputChange",
		"data": "|"
	}
];
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/browser/xterm/recordings/rich/windows11_pwsh7_echo_3_times.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/xterm/recordings/rich/windows11_pwsh7_echo_3_times.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/* eslint-disable */

// Windows 24H2
// PowerShell 7.5.2
// Steps:
// - Open terminal
// - Type echo a
// - Press enter
// - Type echo b
// - Press enter
// - Type echo c
// - Press enter
export const events = [
	{
		"type": "resize",
		"cols": 167,
		"rows": 22
	},
	{
		"type": "output",
		"data": "\u001b[?9001h\u001b[?1004h\u001b[?25l\u001b[2J\u001b[m\u001b[H\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\u001b[H\u001b]0;C:\\Program Files\\WindowsApps\\Microsoft.PowerShell_7.5.2.0_x64__8wekyb3d8bbwe\\pwsh.exe\u0007\u001b[?25h"
	},
	{
		"type": "input",
		"data": "\u001b[I"
	},
	{
		"type": "output",
		"data": "\u001b[?25l\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\u001b[H\u001b[?25h"
	},
	{
		"type": "output",
		"data": "\u001b]633;P;PromptType=posh-git\u0007\u001b]633;P;HasRichCommandDetection=True\u0007"
	},
	{
		"type": "output",
		"data": "\u001b]633;P;ContinuationPrompt=>> \u0007\u001b]633;P;IsWindows=True\u0007"
	},
	{
		"type": "output",
		"data": "\u001b]0;C:\\Program Files\\WindowsApps\\Microsoft.PowerShell_7.5.2.0_x64__8wekyb3d8bbwe\\pwsh.exe \u0007\u001b]0;xterm.js [master] - PowerShell 7.5 (45808)\u0007\u001b]633;A\u0007\u001b]633;P;Cwd=C:\\x5cGithub\\x5cTyriar\\x5cxterm.js\u0007\u001b]633;EnvJson;{\"PATH\":\"C:\\x5c\\x5cProgram Files\\x5c\\x5cWindowsApps\\x5c\\x5cMicrosoft.PowerShell_7.5.2.0_x64__8wekyb3d8bbwe\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5coh-my-posh\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cPython312\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cPython312\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cMicrosoft SDKs\\x5c\\x5cAzure\\x5c\\x5cCLI2\\x5c\\x5cwbin\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cEclipse Adoptium\\x5c\\x5cjdk-8.0.345.1-hotspot\\x5c\\x5cbin\\x3bC:\\x5c\\x5cWINDOWS\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5csystem32\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWbem\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWindowsPowerShell\\x5c\\x5cv1.0\\x5c\\x5c\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cOpenSSH\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cNVIDIA Corporation\\x5c\\x5cPhysX\\x5c\\x5cCommon\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGit LFS\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cnu\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cstarship\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5csystem32\\x3bC:\\x5c\\x5cWINDOWS\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWbem\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWindowsPowerShell\\x5c\\x5cv1.0\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cNVIDIA Corporation\\x5c\\x5cNVIDIA NvDLISR\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGitHub CLI\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cWindows Kits\\x5c\\x5c10\\x5c\\x5cWindows Performance Toolkit\\x5c\\x5c\\x3bC:\\x5c\\x5cProgramData\\x5c\\x5cchocolatey\\x5c\\x5cbin\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cdotnet\\x5c\\x5c\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cOpenSSH\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGnuPG\\x5c\\x5cbin\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cGpg4win\\x5c\\x5c..\\x5c\\x5cGnuPG\\x5c\\x5cbin\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cnodejs\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGit\\x5c\\x5ccmd\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython312\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython312\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5coh-my-posh\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5c.cargo\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cRoaming\\x5c\\x5cPython\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython310\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython310\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWindowsApps\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5coh-my-posh\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5coh-my-posh\\x5c\\x5cthemes\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5c.vscode-cli\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWindowsApps\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cJetBrains\\x5c\\x5cToolbox\\x5c\\x5cscripts\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cnvs\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cMicrosoft Visual Studio\\x5c\\x5c2017\\x5c\\x5cBuildTools\\x5c\\x5cMSBuild\\x5c\\x5c15.0\\x5c\\x5cBin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWinGet\\x5c\\x5cPackages\\x5c\\x5cBurntSushi.ripgrep.MSVC_Microsoft.Winget.Source_8wekyb3d8bbwe\\x5c\\x5cripgrep-13.0.0-x86_64-pc-windows-msvc\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWinGet\\x5c\\x5cPackages\\x5c\\x5cSchniz.fnm_Microsoft.Winget.Source_8wekyb3d8bbwe\\x3bc:\\x5c\\x5cusers\\x5c\\x5cdaniel\\x5c\\x5c.local\\x5c\\x5cbin\\x3bC:\\x5c\\x5cTools\\x5c\\x5cHandle\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cMicrosoft VS Code Insiders\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cJulia-1.11.1\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cMicrosoft VS Code\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPackages\\x5c\\x5cPythonSoftwareFoundation.Python.3.9_qbz5n2kfra8p0\\x5c\\x5cLocalCache\\x5c\\x5clocal-packages\\x5c\\x5cPython39\\x5c\\x5cScripts\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cWindsurf\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5ccursor\\x5c\\x5cresources\\x5c\\x5capp\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cRoaming\\x5c\\x5cnpm\\x3bc:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5c.vscode-oss-dev\\x5c\\x5cUser\\x5c\\x5cglobalStorage\\x5c\\x5cgithub.copilot-chat\\x5c\\x5cdebugCommand\"};d970493f-becd-4c84-a4e9-8d7017bac9af\u0007C:\\Github\\Tyriar\\xterm.js \u001b[93m[\u001b[92mmaster ↑2\u001b[93m]\u001b[m> \u001b]633;P;Prompt=C:\\x5cGithub\\x5cTyriar\\x5cxterm.js \\x1b[93m[\\x1b[39m\\x1b[92mmaster\\x1b[39m\\x1b[92m ↑2\\x1b[39m\\x1b[93m]\\x1b[39m> \u0007\u001b]633;B\u0007"
	},
	{
		"type": "promptInputChange",
		"data": "|"
	},
	{
		"type": "commandDetection.onCommandStarted"
	},
	{
		"type": "command",
		"id": "_setContext"
	},
	{
		"type": "input",
		"data": "e"
	},
	{
		"type": "output",
		"data": "\u001b[?25l"
	},
	{
		"type": "output",
		"data": "\u001b[93me\u001b[97m\u001b[2m\u001b[3mcho b\u001b[1;41H\u001b[?25h"
	},
	{
		"type": "promptInputChange",
		"data": "e|cho b"
	},
	{
		"type": "promptInputChange",
		"data": "e|[cho b]"
	},
	{
		"type": "input",
		"data": "c"
	},
	{
		"type": "output",
		"data": "\u001b[m\u001b[?25l"
	},
	{
		"type": "output",
		"data": "\u001b[93m\bec\u001b[97m\u001b[2m\u001b[3mho b\u001b[1;42H\u001b[?25h"
	},
	{
		"type": "promptInputChange",
		"data": "ec|[ho b]"
	},
	{
		"type": "input",
		"data": "h"
	},
	{
		"type": "input",
		"data": "o"
	},
	{
		"type": "output",
		"data": "\u001b[m\u001b[?25l"
	},
	{
		"type": "output",
		"data": "\u001b[93m\u001b[1;40Hecho\u001b[97m\u001b[2m\u001b[3m b\u001b[1;44H\u001b[?25h"
	},
	{
		"type": "promptInputChange",
		"data": "echo|[ b]"
	},
	{
		"type": "input",
		"data": " "
	},
	{
		"type": "output",
		"data": "\u001b[m\u001b[?25l\u001b[93m\u001b[1;40Hecho \u001b[97m\u001b[2m\u001b[3mb\b\u001b[?25h"
	},
	{
		"type": "promptInputChange",
		"data": "echo |[b]"
	},
	{
		"type": "input",
		"data": "a"
	},
	{
		"type": "output",
		"data": "\u001b[m\u001b[?25l"
	},
	{
		"type": "output",
		"data": "\u001b[93m\u001b[1;40Hecho \u001b[37ma\u001b[97m\u001b[2m\u001b[3mbc\u001b[1;46H\u001b[?25h"
	},
	{
		"type": "promptInputChange",
		"data": "echo a|[bc]"
	},
	{
		"type": "sendText",
		"data": "\u001b[24~e"
	},
	{
		"type": "output",
		"data": "\u001b[m\u001b]633;Completions;0;5;5;[]\u0007"
	},
	{
		"type": "input",
		"data": "\r"
	},
	{
		"type": "output",
		"data": "\u001b[K"
	},
	{
		"type": "promptInputChange",
		"data": "echo a|"
	},
	{
		"type": "output",
		"data": "\r\n\u001b]633;E;echo a;d970493f-becd-4c84-a4e9-8d7017bac9af\u0007"
	},
	{
		"type": "output",
		"data": "\u001b]633;C\u0007"
	},
	{
		"type": "output",
		"data": ""
	},
	{
		"type": "promptInputChange",
		"data": "echo a|[]"
	},
	{
		"type": "promptInputChange",
		"data": "echo a"
	},
	{
		"type": "commandDetection.onCommandExecuted",
		"commandLine": "echo a"
	},
	{
		"type": "commandDetection.onCommandExecuted",
		"commandLine": "echo a"
	},
	{
		"type": "output",
		"data": "a\r\n"
	},
	{
		"type": "output",
		"data": ""
	},
	{
		"type": "output",
		"data": "\u001b]633;D;0\u0007"
	},
	{
		"type": "output",
		"data": "\u001b]633;A\u0007\u001b]633;P;Cwd=C:\\x5cGithub\\x5cTyriar\\x5cxterm.js\u0007\u001b]633;EnvJson;{\"PATH\":\"C:\\x5c\\x5cProgram Files\\x5c\\x5cWindowsApps\\x5c\\x5cMicrosoft.PowerShell_7.5.2.0_x64__8wekyb3d8bbwe\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5coh-my-posh\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cPython312\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cPython312\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cMicrosoft SDKs\\x5c\\x5cAzure\\x5c\\x5cCLI2\\x5c\\x5cwbin\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cEclipse Adoptium\\x5c\\x5cjdk-8.0.345.1-hotspot\\x5c\\x5cbin\\x3bC:\\x5c\\x5cWINDOWS\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5csystem32\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWbem\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWindowsPowerShell\\x5c\\x5cv1.0\\x5c\\x5c\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cOpenSSH\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cNVIDIA Corporation\\x5c\\x5cPhysX\\x5c\\x5cCommon\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGit LFS\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cnu\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cstarship\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5csystem32\\x3bC:\\x5c\\x5cWINDOWS\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWbem\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWindowsPowerShell\\x5c\\x5cv1.0\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cNVIDIA Corporation\\x5c\\x5cNVIDIA NvDLISR\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGitHub CLI\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cWindows Kits\\x5c\\x5c10\\x5c\\x5cWindows Performance Toolkit\\x5c\\x5c\\x3bC:\\x5c\\x5cProgramData\\x5c\\x5cchocolatey\\x5c\\x5cbin\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cdotnet\\x5c\\x5c\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cOpenSSH\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGnuPG\\x5c\\x5cbin\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cGpg4win\\x5c\\x5c..\\x5c\\x5cGnuPG\\x5c\\x5cbin\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cnodejs\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGit\\x5c\\x5ccmd\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython312\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython312\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5coh-my-posh\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5c.cargo\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cRoaming\\x5c\\x5cPython\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython310\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython310\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWindowsApps\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5coh-my-posh\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5coh-my-posh\\x5c\\x5cthemes\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5c.vscode-cli\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWindowsApps\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cJetBrains\\x5c\\x5cToolbox\\x5c\\x5cscripts\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cnvs\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cMicrosoft Visual Studio\\x5c\\x5c2017\\x5c\\x5cBuildTools\\x5c\\x5cMSBuild\\x5c\\x5c15.0\\x5c\\x5cBin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWinGet\\x5c\\x5cPackages\\x5c\\x5cBurntSushi.ripgrep.MSVC_Microsoft.Winget.Source_8wekyb3d8bbwe\\x5c\\x5cripgrep-13.0.0-x86_64-pc-windows-msvc\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWinGet\\x5c\\x5cPackages\\x5c\\x5cSchniz.fnm_Microsoft.Winget.Source_8wekyb3d8bbwe\\x3bc:\\x5c\\x5cusers\\x5c\\x5cdaniel\\x5c\\x5c.local\\x5c\\x5cbin\\x3bC:\\x5c\\x5cTools\\x5c\\x5cHandle\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cMicrosoft VS Code Insiders\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cJulia-1.11.1\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cMicrosoft VS Code\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPackages\\x5c\\x5cPythonSoftwareFoundation.Python.3.9_qbz5n2kfra8p0\\x5c\\x5cLocalCache\\x5c\\x5clocal-packages\\x5c\\x5cPython39\\x5c\\x5cScripts\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cWindsurf\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5ccursor\\x5c\\x5cresources\\x5c\\x5capp\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cRoaming\\x5c\\x5cnpm\\x3bc:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5c.vscode-oss-dev\\x5c\\x5cUser\\x5c\\x5cglobalStorage\\x5c\\x5cgithub.copilot-chat\\x5c\\x5cdebugCommand\"};d970493f-becd-4c84-a4e9-8d7017bac9af\u0007C:\\Github\\Tyriar\\xterm.js \u001b[93m[\u001b[92mmaster ↑2\u001b[93m]\u001b[m> \u001b]633;P;Prompt=C:\\x5cGithub\\x5cTyriar\\x5cxterm.js \\x1b[93m[\\x1b[39m\\x1b[92mmaster\\x1b[39m\\x1b[92m ↑2\\x1b[39m\\x1b[93m]\\x1b[39m> \u0007\u001b]633;B\u0007"
	},
	{
		"type": "commandDetection.onCommandFinished",
		"commandLine": "echo a"
	},
	{
		"type": "promptInputChange",
		"data": "|"
	},
	{
		"type": "commandDetection.onCommandStarted"
	},
	{
		"type": "input",
		"data": "e"
	},
	{
		"type": "output",
		"data": "\u001b[?25l"
	},
	{
		"type": "output",
		"data": "\u001b[93me\u001b[97m\u001b[2m\u001b[3mcho a\u001b[3;41H\u001b[?25h"
	},
	{
		"type": "promptInputChange",
		"data": "e|cho a"
	},
	{
		"type": "promptInputChange",
		"data": "e|[cho a]"
	},
	{
		"type": "input",
		"data": "c"
	},
	{
		"type": "output",
		"data": "\u001b[m\u001b[?25l"
	},
	{
		"type": "output",
		"data": "\u001b[93m\bec\u001b[97m\u001b[2m\u001b[3mho a\u001b[3;42H\u001b[?25h"
	},
	{
		"type": "promptInputChange",
		"data": "ec|[ho a]"
	},
	{
		"type": "input",
		"data": "h"
	},
	{
		"type": "output",
		"data": "\u001b[m\u001b[?25l"
	},
	{
		"type": "output",
		"data": "\u001b[93m\u001b[3;40Hech\u001b[97m\u001b[2m\u001b[3mo a\u001b[3;43H\u001b[?25h"
	},
	{
		"type": "promptInputChange",
		"data": "ech|[o a]"
	},
	{
		"type": "input",
		"data": "o"
	},
	{
		"type": "output",
		"data": "\u001b[?25l\u001b[m\u001b[93m\u001b[3;40Hecho\u001b[97m\u001b[2m\u001b[3m a\u001b[3;44H\u001b[?25h"
	},
	{
		"type": "promptInputChange",
		"data": "echo|[ a]"
	},
	{
		"type": "input",
		"data": " "
	},
	{
		"type": "output",
		"data": "\u001b[m\u001b[?25l\u001b[93m\u001b[3;40Hecho \u001b[97m\u001b[2m\u001b[3ma\b\u001b[?25h"
	},
	{
		"type": "promptInputChange",
		"data": "echo |[a]"
	},
	{
		"type": "input",
		"data": "b"
	},
	{
		"type": "output",
		"data": "\u001b[m\u001b[?25l\u001b[93m\u001b[3;40Hecho \u001b[37mb\u001b[97m\u001b[2m\u001b[3mar\u001b[3;46H\u001b[?25h"
	},
	{
		"type": "promptInputChange",
		"data": "echo b|[ar]"
	},
	{
		"type": "sendText",
		"data": "\u001b[24~e"
	},
	{
		"type": "output",
		"data": "\u001b[m\u001b]633;Completions;0;5;5;[]\u0007"
	},
	{
		"type": "input",
		"data": "\r"
	},
	{
		"type": "output",
		"data": "\u001b[K\r\n\u001b]633;E;echo b;d970493f-becd-4c84-a4e9-8d7017bac9af\u0007"
	},
	{
		"type": "promptInputChange",
		"data": "echo b"
	},
	{
		"type": "promptInputChange",
		"data": "echo b|[]"
	},
	{
		"type": "output",
		"data": "\u001b]633;C\u0007"
	},
	{
		"type": "output",
		"data": "b\r\n"
	},
	{
		"type": "sendText",
		"data": "\u001b[24~e"
	},
	{
		"type": "promptInputChange",
		"data": "echo b"
	},
	{
		"type": "commandDetection.onCommandExecuted",
		"commandLine": "echo b"
	},
	{
		"type": "commandDetection.onCommandExecuted",
		"commandLine": "echo b"
	},
	{
		"type": "output",
		"data": ""
	},
	{
		"type": "output",
		"data": "\u001b]633;D;0\u0007"
	},
	{
		"type": "output",
		"data": "\u001b]633;A\u0007\u001b]633;P;Cwd=C:\\x5cGithub\\x5cTyriar\\x5cxterm.js\u0007\u001b]633;EnvJson;{\"PATH\":\"C:\\x5c\\x5cProgram Files\\x5c\\x5cWindowsApps\\x5c\\x5cMicrosoft.PowerShell_7.5.2.0_x64__8wekyb3d8bbwe\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5coh-my-posh\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cPython312\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cPython312\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cMicrosoft SDKs\\x5c\\x5cAzure\\x5c\\x5cCLI2\\x5c\\x5cwbin\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cEclipse Adoptium\\x5c\\x5cjdk-8.0.345.1-hotspot\\x5c\\x5cbin\\x3bC:\\x5c\\x5cWINDOWS\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5csystem32\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWbem\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWindowsPowerShell\\x5c\\x5cv1.0\\x5c\\x5c\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cOpenSSH\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cNVIDIA Corporation\\x5c\\x5cPhysX\\x5c\\x5cCommon\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGit LFS\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cnu\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cstarship\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5csystem32\\x3bC:\\x5c\\x5cWINDOWS\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWbem\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWindowsPowerShell\\x5c\\x5cv1.0\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cNVIDIA Corporation\\x5c\\x5cNVIDIA NvDLISR\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGitHub CLI\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cWindows Kits\\x5c\\x5c10\\x5c\\x5cWindows Performance Toolkit\\x5c\\x5c\\x3bC:\\x5c\\x5cProgramData\\x5c\\x5cchocolatey\\x5c\\x5cbin\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cdotnet\\x5c\\x5c\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cOpenSSH\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGnuPG\\x5c\\x5cbin\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cGpg4win\\x5c\\x5c..\\x5c\\x5cGnuPG\\x5c\\x5cbin\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cnodejs\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGit\\x5c\\x5ccmd\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython312\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython312\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5coh-my-posh\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5c.cargo\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cRoaming\\x5c\\x5cPython\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython310\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython310\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWindowsApps\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5coh-my-posh\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5coh-my-posh\\x5c\\x5cthemes\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5c.vscode-cli\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWindowsApps\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cJetBrains\\x5c\\x5cToolbox\\x5c\\x5cscripts\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cnvs\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cMicrosoft Visual Studio\\x5c\\x5c2017\\x5c\\x5cBuildTools\\x5c\\x5cMSBuild\\x5c\\x5c15.0\\x5c\\x5cBin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWinGet\\x5c\\x5cPackages\\x5c\\x5cBurntSushi.ripgrep.MSVC_Microsoft.Winget.Source_8wekyb3d8bbwe\\x5c\\x5cripgrep-13.0.0-x86_64-pc-windows-msvc\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWinGet\\x5c\\x5cPackages\\x5c\\x5cSchniz.fnm_Microsoft.Winget.Source_8wekyb3d8bbwe\\x3bc:\\x5c\\x5cusers\\x5c\\x5cdaniel\\x5c\\x5c.local\\x5c\\x5cbin\\x3bC:\\x5c\\x5cTools\\x5c\\x5cHandle\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cMicrosoft VS Code Insiders\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cJulia-1.11.1\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cMicrosoft VS Code\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPackages\\x5c\\x5cPythonSoftwareFoundation.Python.3.9_qbz5n2kfra8p0\\x5c\\x5cLocalCache\\x5c\\x5clocal-packages\\x5c\\x5cPython39\\x5c\\x5cScripts\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cWindsurf\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5ccursor\\x5c\\x5cresources\\x5c\\x5capp\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cRoaming\\x5c\\x5cnpm\\x3bc:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5c.vscode-oss-dev\\x5c\\x5cUser\\x5c\\x5cglobalStorage\\x5c\\x5cgithub.copilot-chat\\x5c\\x5cdebugCommand\"};d970493f-becd-4c84-a4e9-8d7017bac9af\u0007C:\\Github\\Tyriar\\xterm.js \u001b[93m[\u001b[92mmaster ↑2\u001b[93m]\u001b[m> \u001b]633;P;Prompt=C:\\x5cGithub\\x5cTyriar\\x5cxterm.js \\x1b[93m[\\x1b[39m\\x1b[92mmaster\\x1b[39m\\x1b[92m ↑2\\x1b[39m\\x1b[93m]\\x1b[39m> \u0007\u001b]633;B\u0007\u001b]633;Completions\u0007"
	},
	{
		"type": "commandDetection.onCommandFinished",
		"commandLine": "echo b"
	},
	{
		"type": "promptInputChange",
		"data": "|"
	},
	{
		"type": "commandDetection.onCommandStarted"
	},
	{
		"type": "input",
		"data": "e"
	},
	{
		"type": "output",
		"data": "\u001b[?25l"
	},
	{
		"type": "output",
		"data": "\u001b[93me\u001b[97m\u001b[2m\u001b[3mcho b\u001b[5;41H\u001b[?25h"
	},
	{
		"type": "promptInputChange",
		"data": "e|cho b"
	},
	{
		"type": "promptInputChange",
		"data": "e|[cho b]"
	},
	{
		"type": "input",
		"data": "c"
	},
	{
		"type": "output",
		"data": "\u001b[m\u001b[?25l"
	},
	{
		"type": "output",
		"data": "\u001b[93m\bec\u001b[97m\u001b[2m\u001b[3mho b\u001b[5;42H\u001b[?25h"
	},
	{
		"type": "promptInputChange",
		"data": "ec|[ho b]"
	},
	{
		"type": "input",
		"data": "h"
	},
	{
		"type": "output",
		"data": "\u001b[m\u001b[?25l"
	},
	{
		"type": "output",
		"data": "\u001b[93m\u001b[5;40Hech\u001b[97m\u001b[2m\u001b[3mo b\u001b[5;43H\u001b[?25h"
	},
	{
		"type": "promptInputChange",
		"data": "ech|[o b]"
	},
	{
		"type": "input",
		"data": "o"
	},
	{
		"type": "output",
		"data": "\u001b[m\u001b[?25l"
	},
	{
		"type": "output",
		"data": "\u001b[93m\u001b[5;40Hecho\u001b[97m\u001b[2m\u001b[3m b\u001b[5;44H\u001b[?25h"
	},
	{
		"type": "promptInputChange",
		"data": "echo|[ b]"
	},
	{
		"type": "input",
		"data": " "
	},
	{
		"type": "output",
		"data": "\u001b[m\u001b[?25l"
	},
	{
		"type": "output",
		"data": "\u001b[93m\u001b[5;40Hecho \u001b[97m\u001b[2m\u001b[3mb\b\u001b[?25h"
	},
	{
		"type": "promptInputChange",
		"data": "echo |[b]"
	},
	{
		"type": "input",
		"data": "c"
	},
	{
		"type": "output",
		"data": "\u001b[m\u001b[?25l"
	},
	{
		"type": "output",
		"data": "\u001b[93m\u001b[5;40Hecho \u001b[37mc\u001b[?25h"
	},
	{
		"type": "promptInputChange",
		"data": "echo c|"
	},
	{
		"type": "sendText",
		"data": "\u001b[24~e"
	},
	{
		"type": "output",
		"data": "\u001b[m\u001b]633;Completions;0;5;5;[]\u0007"
	},
	{
		"type": "input",
		"data": "\r"
	},
	{
		"type": "output",
		"data": "\r\n\u001b]633;E;echo c;d970493f-becd-4c84-a4e9-8d7017bac9af\u0007"
	},
	{
		"type": "promptInputChange",
		"data": "echo c|[]"
	},
	{
		"type": "output",
		"data": "\u001b]633;C\u0007"
	},
	{
		"type": "output",
		"data": ""
	},
	{
		"type": "promptInputChange",
		"data": "echo c"
	},
	{
		"type": "commandDetection.onCommandExecuted",
		"commandLine": "echo c"
	},
	{
		"type": "commandDetection.onCommandExecuted",
		"commandLine": "echo c"
	},
	{
		"type": "output",
		"data": "c\r\n"
	},
	{
		"type": "output",
		"data": ""
	},
	{
		"type": "output",
		"data": "\u001b]633;D;0\u0007"
	},
	{
		"type": "output",
		"data": "\u001b]633;A\u0007\u001b]633;P;Cwd=C:\\x5cGithub\\x5cTyriar\\x5cxterm.js\u0007\u001b]633;EnvJson;{\"PATH\":\"C:\\x5c\\x5cProgram Files\\x5c\\x5cWindowsApps\\x5c\\x5cMicrosoft.PowerShell_7.5.2.0_x64__8wekyb3d8bbwe\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5coh-my-posh\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cPython312\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cPython312\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cMicrosoft SDKs\\x5c\\x5cAzure\\x5c\\x5cCLI2\\x5c\\x5cwbin\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cEclipse Adoptium\\x5c\\x5cjdk-8.0.345.1-hotspot\\x5c\\x5cbin\\x3bC:\\x5c\\x5cWINDOWS\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5csystem32\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWbem\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWindowsPowerShell\\x5c\\x5cv1.0\\x5c\\x5c\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cOpenSSH\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cNVIDIA Corporation\\x5c\\x5cPhysX\\x5c\\x5cCommon\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGit LFS\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cnu\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cstarship\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5csystem32\\x3bC:\\x5c\\x5cWINDOWS\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWbem\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWindowsPowerShell\\x5c\\x5cv1.0\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cNVIDIA Corporation\\x5c\\x5cNVIDIA NvDLISR\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGitHub CLI\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cWindows Kits\\x5c\\x5c10\\x5c\\x5cWindows Performance Toolkit\\x5c\\x5c\\x3bC:\\x5c\\x5cProgramData\\x5c\\x5cchocolatey\\x5c\\x5cbin\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cdotnet\\x5c\\x5c\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cOpenSSH\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGnuPG\\x5c\\x5cbin\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cGpg4win\\x5c\\x5c..\\x5c\\x5cGnuPG\\x5c\\x5cbin\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cnodejs\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGit\\x5c\\x5ccmd\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython312\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython312\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5coh-my-posh\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5c.cargo\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cRoaming\\x5c\\x5cPython\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython310\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython310\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWindowsApps\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5coh-my-posh\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5coh-my-posh\\x5c\\x5cthemes\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5c.vscode-cli\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWindowsApps\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cJetBrains\\x5c\\x5cToolbox\\x5c\\x5cscripts\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cnvs\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cMicrosoft Visual Studio\\x5c\\x5c2017\\x5c\\x5cBuildTools\\x5c\\x5cMSBuild\\x5c\\x5c15.0\\x5c\\x5cBin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWinGet\\x5c\\x5cPackages\\x5c\\x5cBurntSushi.ripgrep.MSVC_Microsoft.Winget.Source_8wekyb3d8bbwe\\x5c\\x5cripgrep-13.0.0-x86_64-pc-windows-msvc\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWinGet\\x5c\\x5cPackages\\x5c\\x5cSchniz.fnm_Microsoft.Winget.Source_8wekyb3d8bbwe\\x3bc:\\x5c\\x5cusers\\x5c\\x5cdaniel\\x5c\\x5c.local\\x5c\\x5cbin\\x3bC:\\x5c\\x5cTools\\x5c\\x5cHandle\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cMicrosoft VS Code Insiders\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cJulia-1.11.1\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cMicrosoft VS Code\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPackages\\x5c\\x5cPythonSoftwareFoundation.Python.3.9_qbz5n2kfra8p0\\x5c\\x5cLocalCache\\x5c\\x5clocal-packages\\x5c\\x5cPython39\\x5c\\x5cScripts\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cWindsurf\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5ccursor\\x5c\\x5cresources\\x5c\\x5capp\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cRoaming\\x5c\\x5cnpm\\x3bc:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5c.vscode-oss-dev\\x5c\\x5cUser\\x5c\\x5cglobalStorage\\x5c\\x5cgithub.copilot-chat\\x5c\\x5cdebugCommand\"};d970493f-becd-4c84-a4e9-8d7017bac9af\u0007C:\\Github\\Tyriar\\xterm.js \u001b[93m[\u001b[92mmaster ↑2\u001b[93m]\u001b[m> \u001b]633;P;Prompt=C:\\x5cGithub\\x5cTyriar\\x5cxterm.js \\x1b[93m[\\x1b[39m\\x1b[92mmaster\\x1b[39m\\x1b[92m ↑2\\x1b[39m\\x1b[93m]\\x1b[39m> \u0007\u001b]633;B\u0007"
	},
	{
		"type": "commandDetection.onCommandFinished",
		"commandLine": "echo c"
	},
	{
		"type": "promptInputChange",
		"data": "|"
	},
	{
		"type": "commandDetection.onCommandStarted"
	}
];
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/browser/xterm/recordings/rich/windows11_pwsh7_ls_one_time.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/xterm/recordings/rich/windows11_pwsh7_ls_one_time.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/* eslint-disable */

// Windows 24H2
// PowerShell 7.5.2
// Steps:
// - Open terminal
// - Type ls
// - Press enter
export const events = [
	{
		"type": "resize",
		"cols": 193,
		"rows": 22
	},
	{
		"type": "output",
		"data": "\u001b[?9001h\u001b[?1004h\u001b[?25l\u001b[2J\u001b[m\u001b[H\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\u001b[H\u001b]0;C:\\Program Files\\WindowsApps\\Microsoft.PowerShell_7.5.2.0_x64__8wekyb3d8bbwe\\pwsh.exe\u0007\u001b[?25h"
	},
	{
		"type": "input",
		"data": "\u001b[I"
	},
	{
		"type": "output",
		"data": "\u001b[?25l\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\u001b[H\u001b[?25h"
	},
	{
		"type": "output",
		"data": "\u001b]633;P;PromptType=posh-git\u0007\u001b]633;P;HasRichCommandDetection=True\u0007"
	},
	{
		"type": "command",
		"id": "_setContext"
	},
	{
		"type": "output",
		"data": "\u001b]633;P;ContinuationPrompt=>> \u0007\u001b]633;P;IsWindows=True\u0007"
	},
	{
		"type": "output",
		"data": "\u001b]0;C:\\Program Files\\WindowsApps\\Microsoft.PowerShell_7.5.2.0_x64__8wekyb3d8bbwe\\pwsh.exe \u0007"
	},
	{
		"type": "output",
		"data": "\u001b]0;xterm.js [master] - PowerShell 7.5 (41208)\u0007\u001b]633;A\u0007\u001b]633;P;Cwd=C:\\x5cGithub\\x5cTyriar\\x5cxterm.js\u0007\u001b]633;EnvJson;{\"PATH\":\"C:\\x5c\\x5cProgram Files\\x5c\\x5cWindowsApps\\x5c\\x5cMicrosoft.PowerShell_7.5.2.0_x64__8wekyb3d8bbwe\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5coh-my-posh\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cPython312\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cPython312\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cMicrosoft SDKs\\x5c\\x5cAzure\\x5c\\x5cCLI2\\x5c\\x5cwbin\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cEclipse Adoptium\\x5c\\x5cjdk-8.0.345.1-hotspot\\x5c\\x5cbin\\x3bC:\\x5c\\x5cWINDOWS\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5csystem32\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWbem\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWindowsPowerShell\\x5c\\x5cv1.0\\x5c\\x5c\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cOpenSSH\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cNVIDIA Corporation\\x5c\\x5cPhysX\\x5c\\x5cCommon\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGit LFS\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cnu\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cstarship\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5csystem32\\x3bC:\\x5c\\x5cWINDOWS\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWbem\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWindowsPowerShell\\x5c\\x5cv1.0\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cNVIDIA Corporation\\x5c\\x5cNVIDIA NvDLISR\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGitHub CLI\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cWindows Kits\\x5c\\x5c10\\x5c\\x5cWindows Performance Toolkit\\x5c\\x5c\\x3bC:\\x5c\\x5cProgramData\\x5c\\x5cchocolatey\\x5c\\x5cbin\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cdotnet\\x5c\\x5c\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cOpenSSH\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGnuPG\\x5c\\x5cbin\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cGpg4win\\x5c\\x5c..\\x5c\\x5cGnuPG\\x5c\\x5cbin\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cnodejs\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGit\\x5c\\x5ccmd\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython312\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython312\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5coh-my-posh\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5c.cargo\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cRoaming\\x5c\\x5cPython\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython310\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython310\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWindowsApps\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5coh-my-posh\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5coh-my-posh\\x5c\\x5cthemes\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5c.vscode-cli\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWindowsApps\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cJetBrains\\x5c\\x5cToolbox\\x5c\\x5cscripts\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cnvs\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cMicrosoft Visual Studio\\x5c\\x5c2017\\x5c\\x5cBuildTools\\x5c\\x5cMSBuild\\x5c\\x5c15.0\\x5c\\x5cBin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWinGet\\x5c\\x5cPackages\\x5c\\x5cBurntSushi.ripgrep.MSVC_Microsoft.Winget.Source_8wekyb3d8bbwe\\x5c\\x5cripgrep-13.0.0-x86_64-pc-windows-msvc\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWinGet\\x5c\\x5cPackages\\x5c\\x5cSchniz.fnm_Microsoft.Winget.Source_8wekyb3d8bbwe\\x3bc:\\x5c\\x5cusers\\x5c\\x5cdaniel\\x5c\\x5c.local\\x5c\\x5cbin\\x3bC:\\x5c\\x5cTools\\x5c\\x5cHandle\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cMicrosoft VS Code Insiders\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cJulia-1.11.1\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cMicrosoft VS Code\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPackages\\x5c\\x5cPythonSoftwareFoundation.Python.3.9_qbz5n2kfra8p0\\x5c\\x5cLocalCache\\x5c\\x5clocal-packages\\x5c\\x5cPython39\\x5c\\x5cScripts\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cWindsurf\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5ccursor\\x5c\\x5cresources\\x5c\\x5capp\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cRoaming\\x5c\\x5cnpm\\x3bc:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5c.vscode-oss-dev\\x5c\\x5cUser\\x5c\\x5cglobalStorage\\x5c\\x5cgithub.copilot-chat\\x5c\\x5cdebugCommand\"};0af95031-b24c-434e-8c6d-540ab6a9dd37\u0007C:\\Github\\Tyriar\\xterm.js \u001b[93m[\u001b[92mmaster ↑2\u001b[93m]\u001b[m> \u001b]633;P;Prompt=C:\\x5cGithub\\x5cTyriar\\x5cxterm.js \\x1b[93m[\\x1b[39m\\x1b[92mmaster\\x1b[39m\\x1b[92m ↑2\\x1b[39m\\x1b[93m]\\x1b[39m> \u0007\u001b]633;B\u0007"
	},
	{
		"type": "promptInputChange",
		"data": "|"
	},
	{
		"type": "input",
		"data": "l"
	},
	{
		"type": "output",
		"data": "\u001b[?25l"
	},
	{
		"type": "output",
		"data": "\u001b[93ml\u001b[97m\u001b[2m\u001b[3ms\b\u001b[?25h"
	},
	{
		"type": "promptInputChange",
		"data": "l|s"
	},
	{
		"type": "promptInputChange",
		"data": "l|[s]"
	},
	{
		"type": "input",
		"data": "s"
	},
	{
		"type": "output",
		"data": "\u001b[m\u001b[?25l"
	},
	{
		"type": "output",
		"data": "\u001b[93m\bls\u001b[97m\u001b[2m\u001b[3m; echo hello\u001b[1;42H\u001b[?25h"
	},
	{
		"type": "promptInputChange",
		"data": "ls|[; echo hello]"
	},
	{
		"type": "input",
		"data": "\r"
	},
	{
		"type": "output",
		"data": "\u001b[m\u001b[K\r\n\u001b]633;E;ls;0af95031-b24c-434e-8c6d-540ab6a9dd37\u0007"
	},
	{
		"type": "promptInputChange",
		"data": "ls"
	},
	{
		"type": "promptInputChange",
		"data": "ls|"
	},
	{
		"type": "output",
		"data": "\u001b]633;C\u0007"
	},
	{
		"type": "output",
		"data": ""
	},
	{
		"type": "promptInputChange",
		"data": "ls"
	},
	{
		"type": "output",
		"data": "\r\n"
	},
	{
		"type": "output",
		"data": "\u001b[?25l    Directory: C:\\Github\\Tyriar\\xterm.js\u001b[32m\u001b[1m\u001b[5;1HMode                 LastWriteTime\u001b[m \u001b[32m\u001b[1m\u001b[3m        Length\u001b[23m Name\r\n----   \u001b[m \u001b[32m\u001b[1m             -------------\u001b[m \u001b[32m\u001b[1m        ------\u001b[m \u001b[32m\u001b[1m----\u001b[m\r\nd----          29/08/2024  7:52 AM\u001b[16X\u001b[44m\u001b[1m\u001b[16C.devcontainer\u001b[m\r\nd----          21/07/2025  7:23 AM\u001b[16X\u001b[44m\u001b[1m\u001b[16C.github\u001b[m\r\nd----          25/03/2025 11:49 AM\u001b[16X\u001b[44m\u001b[1m\u001b[16C.venv2\u001b[m\r\nd----          21/07/2025  7:13 AM\u001b[16X\u001b[44m\u001b[1m\u001b[16C.vscode\u001b[m\r\nd----          21/06/2025 10:54 AM\u001b[16X\u001b[44m\u001b[1m\u001b[16Caddons\u001b[m\r\nd----          21/06/2025 10:54 AM\u001b[16X\u001b[44m\u001b[1m\u001b[16Cbin\u001b[m\r\nd----          21/06/2025 10:54 AM\u001b[16X\u001b[44m\u001b[1m\u001b[16Ccss\u001b[m\r\nd----          21/06/2025 10:54 AM\u001b[16X\u001b[44m\u001b[1m\u001b[16Cdemo\u001b[m\r\nd----           8/12/2021  4:36 AM\u001b[16X\u001b[44m\u001b[1m\u001b[16Cfixtures\u001b[m\r\nd----          21/06/2025 10:54 AM\u001b[16X\u001b[44m\u001b[1m\u001b[16Cheadless\u001b[m\r\nd----          21/06/2025 10:54 AM\u001b[16X\u001b[44m\u001b[1m\u001b[16Cimages\u001b[m\r\nd----          18/02/2025  7:49 AM\u001b[16X\u001b[44m\u001b[1m\u001b[16Clib\u001b[m\r\nd----          14/03/2025 10:35 AM\u001b[16X\u001b[44m\u001b[1m\u001b[16Cnode_modules\u001b[m\r\nd----          18/02/2025  7:49 AM\u001b[16X\u001b[44m\u001b[1m\u001b[16Cout\u001b[m\r\nd----          18/02/2025  7:49 AM\u001b[16X\u001b[44m\u001b[1m\u001b[16Cout-esbuild\u001b[m\r\nd----          18/02/2025  7:49 AM\u001b[16X\u001b[44m\u001b[1m\u001b[16Cout-esbuild-test\r\u001b[?25h\u001b[m\nd----          18/02/2025  7:49 AM\u001b[44m\u001b[1m\u001b[16Cout-test\u001b[m\u001b[K\r\nd----          21/06/2025 10:54 AM\u001b[44m\u001b[1m\u001b[16Csrc\u001b[m\u001b[K\r\nd----          29/08/2024  7:52 AM\u001b[44m\u001b[1m\u001b[16Ctest\u001b[m\u001b[K\r\nd----          21/06/2025 10:54 AM\u001b[44m\u001b[1m\u001b[16Ctypings\u001b[m\u001b[K\r"
	},
	{
		"type": "output",
		"data": "\n-a---           8/12/2021  4:36 AM            248 .editorconfig\r"
	},
	{
		"type": "output",
		"data": "\n-a---          21/06/2025 10:54 AM           8424 .eslintrc.json\r\n-a---          29/08/2024  7:52 AM           2298 .eslintrc.json.typings\r\n-a---           8/12/2021  4:36 AM             13 .gitattributes\r\n-a---          21/06/2025 10:54 AM            360 .gitignore\r\n-a---           1/07/2024  7:08 AM              0 .gitmodules\r\n-a---           8/12/2021  4:36 AM            369 .mailmap\r\n-a---           8/12/2021  4:36 AM             17 .mocha.env\r\n-a---          29/11/2022  9:37 AM             91 .mocharc.yml\r\n-a---          21/06/2025 10:54 AM            686 .npmignore\r\n-a---           8/12/2021  4:36 AM             18 .npmrc\r\n-a---          29/08/2024  7:52 AM              4 .nvmrc\r\n-a---           8/12/2021  4:36 AM           3358 CODE_OF_CONDUCT.md\r\n-a---          21/06/2025 10:54 AM           4525 CONTRIBUTING.md\r\n-a---           8/12/2021  4:36 AM           1282 LICENSE\r"
	},
	{
		"type": "output",
		"data": "\n-a---          21/06/2025 10:55 AM           4439 package.json\r\n-a---          21/06/2025 10:54 AM          22466 README.md\r\n-a---          21/06/2025 10:54 AM            734 tsconfig.all.json\r\n-a---          21/06/2025 10:54 AM           1400 \u001b[32m\u001b[1mwebpack.config.headless.js\u001b[m\u001b[K\r\n-a---          21/06/2025 10:54 AM           1348 \u001b[32m\u001b[1mwebpack.config.js\u001b[m\u001b[K\r\n-a---          21/06/2025 10:55 AM         216246 yarn.lock\r\n"
	},
	{
		"type": "output",
		"data": "\n"
	},
	{
		"type": "output",
		"data": ""
	},
	{
		"type": "output",
		"data": "\u001b]633;D;0\u0007"
	},
	{
		"type": "output",
		"data": "\u001b]633;A\u0007\u001b]633;P;Cwd=C:\\x5cGithub\\x5cTyriar\\x5cxterm.js\u0007\u001b]633;EnvJson;{\"PATH\":\"C:\\x5c\\x5cProgram Files\\x5c\\x5cWindowsApps\\x5c\\x5cMicrosoft.PowerShell_7.5.2.0_x64__8wekyb3d8bbwe\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5coh-my-posh\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cPython312\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cPython312\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cMicrosoft SDKs\\x5c\\x5cAzure\\x5c\\x5cCLI2\\x5c\\x5cwbin\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cEclipse Adoptium\\x5c\\x5cjdk-8.0.345.1-hotspot\\x5c\\x5cbin\\x3bC:\\x5c\\x5cWINDOWS\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5csystem32\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWbem\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWindowsPowerShell\\x5c\\x5cv1.0\\x5c\\x5c\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cOpenSSH\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cNVIDIA Corporation\\x5c\\x5cPhysX\\x5c\\x5cCommon\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGit LFS\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cnu\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cstarship\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5csystem32\\x3bC:\\x5c\\x5cWINDOWS\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWbem\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWindowsPowerShell\\x5c\\x5cv1.0\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cNVIDIA Corporation\\x5c\\x5cNVIDIA NvDLISR\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGitHub CLI\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cWindows Kits\\x5c\\x5c10\\x5c\\x5cWindows Performance Toolkit\\x5c\\x5c\\x3bC:\\x5c\\x5cProgramData\\x5c\\x5cchocolatey\\x5c\\x5cbin\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cdotnet\\x5c\\x5c\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cOpenSSH\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGnuPG\\x5c\\x5cbin\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cGpg4win\\x5c\\x5c..\\x5c\\x5cGnuPG\\x5c\\x5cbin\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cnodejs\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGit\\x5c\\x5ccmd\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython312\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython312\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5coh-my-posh\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5c.cargo\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cRoaming\\x5c\\x5cPython\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython310\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython310\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWindowsApps\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5coh-my-posh\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5coh-my-posh\\x5c\\x5cthemes\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5c.vscode-cli\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWindowsApps\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cJetBrains\\x5c\\x5cToolbox\\x5c\\x5cscripts\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cnvs\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cMicrosoft Visual Studio\\x5c\\x5c2017\\x5c\\x5cBuildTools\\x5c\\x5cMSBuild\\x5c\\x5c15.0\\x5c\\x5cBin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWinGet\\x5c\\x5cPackages\\x5c\\x5cBurntSushi.ripgrep.MSVC_Microsoft.Winget.Source_8wekyb3d8bbwe\\x5c\\x5cripgrep-13.0.0-x86_64-pc-windows-msvc\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWinGet\\x5c\\x5cPackages\\x5c\\x5cSchniz.fnm_Microsoft.Winget.Source_8wekyb3d8bbwe\\x3bc:\\x5c\\x5cusers\\x5c\\x5cdaniel\\x5c\\x5c.local\\x5c\\x5cbin\\x3bC:\\x5c\\x5cTools\\x5c\\x5cHandle\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cMicrosoft VS Code Insiders\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cJulia-1.11.1\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cMicrosoft VS Code\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPackages\\x5c\\x5cPythonSoftwareFoundation.Python.3.9_qbz5n2kfra8p0\\x5c\\x5cLocalCache\\x5c\\x5clocal-packages\\x5c\\x5cPython39\\x5c\\x5cScripts\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cWindsurf\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5ccursor\\x5c\\x5cresources\\x5c\\x5capp\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cRoaming\\x5c\\x5cnpm\\x3bc:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5c.vscode-oss-dev\\x5c\\x5cUser\\x5c\\x5cglobalStorage\\x5c\\x5cgithub.copilot-chat\\x5c\\x5cdebugCommand\"};0af95031-b24c-434e-8c6d-540ab6a9dd37\u0007C:\\Github\\Tyriar\\xterm.js \u001b[93m[\u001b[92mmaster ↑2\u001b[93m]\u001b[m> \u001b]633;P;Prompt=C:\\x5cGithub\\x5cTyriar\\x5cxterm.js \\x1b[93m[\\x1b[39m\\x1b[92mmaster\\x1b[39m\\x1b[92m ↑2\\x1b[39m\\x1b[93m]\\x1b[39m> \u0007\u001b]633;B\u0007"
	},
	{
		"type": "promptInputChange",
		"data": "|"
	}
];
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/browser/xterm/recordings/rich/windows11_pwsh7_type_foo.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/xterm/recordings/rich/windows11_pwsh7_type_foo.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/* eslint-disable */

// Windows 24H2
// PowerShell 7.5.2
// Steps:
// - Open terminal
// - Type foo
export const events = [
	{
		"type": "resize",
		"cols": 167,
		"rows": 22
	},
	{
		"type": "output",
		"data": "\u001b[?9001h\u001b[?1004h"
	},
	{
		"type": "input",
		"data": "\u001b[I"
	},
	{
		"type": "output",
		"data": "\u001b[?25l\u001b[2J\u001b[m\u001b[H\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\u001b[H\u001b]0;C:\\Program Files\\WindowsApps\\Microsoft.PowerShell_7.5.2.0_x64__8wekyb3d8bbwe\\pwsh.exe\u0007\u001b[?25h"
	},
	{
		"type": "output",
		"data": "\u001b[?25l\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\u001b[H\u001b[?25h"
	},
	{
		"type": "output",
		"data": "\u001b]633;P;PromptType=posh-git\u0007\u001b]633;P;HasRichCommandDetection=True\u0007"
	},
	{
		"type": "output",
		"data": "\u001b]633;P;ContinuationPrompt=>> \u0007\u001b]633;P;IsWindows=True\u0007"
	},
	{
		"type": "command",
		"id": "_setContext"
	},
	{
		"type": "output",
		"data": "\u001b]0;C:\\Program Files\\WindowsApps\\Microsoft.PowerShell_7.5.2.0_x64__8wekyb3d8bbwe\\pwsh.exe \u0007\u001b]0;xterm.js [master] - PowerShell 7.5 (24772)\u0007\u001b]633;A\u0007\u001b]633;P;Cwd=C:\\x5cGithub\\x5cTyriar\\x5cxterm.js\u0007\u001b]633;EnvJson;{\"PATH\":\"C:\\x5c\\x5cProgram Files\\x5c\\x5cWindowsApps\\x5c\\x5cMicrosoft.PowerShell_7.5.2.0_x64__8wekyb3d8bbwe\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5coh-my-posh\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cPython312\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cPython312\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cMicrosoft SDKs\\x5c\\x5cAzure\\x5c\\x5cCLI2\\x5c\\x5cwbin\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cEclipse Adoptium\\x5c\\x5cjdk-8.0.345.1-hotspot\\x5c\\x5cbin\\x3bC:\\x5c\\x5cWINDOWS\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5csystem32\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWbem\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWindowsPowerShell\\x5c\\x5cv1.0\\x5c\\x5c\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cOpenSSH\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cNVIDIA Corporation\\x5c\\x5cPhysX\\x5c\\x5cCommon\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGit LFS\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cnu\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cstarship\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5csystem32\\x3bC:\\x5c\\x5cWINDOWS\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWbem\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWindowsPowerShell\\x5c\\x5cv1.0\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cNVIDIA Corporation\\x5c\\x5cNVIDIA NvDLISR\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGitHub CLI\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cWindows Kits\\x5c\\x5c10\\x5c\\x5cWindows Performance Toolkit\\x5c\\x5c\\x3bC:\\x5c\\x5cProgramData\\x5c\\x5cchocolatey\\x5c\\x5cbin\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cdotnet\\x5c\\x5c\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cOpenSSH\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGnuPG\\x5c\\x5cbin\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cGpg4win\\x5c\\x5c..\\x5c\\x5cGnuPG\\x5c\\x5cbin\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cnodejs\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGit\\x5c\\x5ccmd\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython312\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython312\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5coh-my-posh\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5c.cargo\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cRoaming\\x5c\\x5cPython\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython310\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython310\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWindowsApps\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5coh-my-posh\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5coh-my-posh\\x5c\\x5cthemes\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5c.vscode-cli\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWindowsApps\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cJetBrains\\x5c\\x5cToolbox\\x5c\\x5cscripts\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cnvs\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cMicrosoft Visual Studio\\x5c\\x5c2017\\x5c\\x5cBuildTools\\x5c\\x5cMSBuild\\x5c\\x5c15.0\\x5c\\x5cBin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWinGet\\x5c\\x5cPackages\\x5c\\x5cBurntSushi.ripgrep.MSVC_Microsoft.Winget.Source_8wekyb3d8bbwe\\x5c\\x5cripgrep-13.0.0-x86_64-pc-windows-msvc\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWinGet\\x5c\\x5cPackages\\x5c\\x5cSchniz.fnm_Microsoft.Winget.Source_8wekyb3d8bbwe\\x3bc:\\x5c\\x5cusers\\x5c\\x5cdaniel\\x5c\\x5c.local\\x5c\\x5cbin\\x3bC:\\x5c\\x5cTools\\x5c\\x5cHandle\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cMicrosoft VS Code Insiders\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cJulia-1.11.1\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cMicrosoft VS Code\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPackages\\x5c\\x5cPythonSoftwareFoundation.Python.3.9_qbz5n2kfra8p0\\x5c\\x5cLocalCache\\x5c\\x5clocal-packages\\x5c\\x5cPython39\\x5c\\x5cScripts\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cWindsurf\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5ccursor\\x5c\\x5cresources\\x5c\\x5capp\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cRoaming\\x5c\\x5cnpm\\x3bc:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5c.vscode-oss-dev\\x5c\\x5cUser\\x5c\\x5cglobalStorage\\x5c\\x5cgithub.copilot-chat\\x5c\\x5cdebugCommand\"};4638516d-26e2-4016-9298-62b0ddca0bd6\u0007C:\\Github\\Tyriar\\xterm.js \u001b[93m[\u001b[92mmaster ↑2\u001b[93m]\u001b[m> \u001b]633;P;Prompt=C:\\x5cGithub\\x5cTyriar\\x5cxterm.js \\x1b[93m[\\x1b[39m\\x1b[92mmaster\\x1b[39m\\x1b[92m ↑2\\x1b[39m\\x1b[93m]\\x1b[39m> \u0007\u001b]633;B\u0007"
	},
	{
		"type": "promptInputChange",
		"data": "|"
	},
	{
		"type": "commandDetection.onCommandStarted"
	},
	{
		"type": "input",
		"data": "f"
	},
	{
		"type": "output",
		"data": "\u001b[?25l"
	},
	{
		"type": "output",
		"data": "\u001b[93mf\u001b[97m\u001b[2m\u001b[3mor ($i=40; $i -le 101; $i++) { $branch = \"origin/release/1.$i\"; if (git rev-parse --verify $branch 2>$null) { $count = git rev-list --count --first-parent $branch \"^main\" 2>$null; if ($count) { Write-Host \"release/1.$i : $count first-parent commits\" } else { Write-Host \"release/1.$i : 0 first-parent commits\" } } else { Write-Host \"release/1.$i : branch not found\" } }\u001b[1;41H\u001b[?25h"
	},
	{
		"type": "promptInputChange",
		"data": "f|or ($i=40; $i -le 101; $i++) { $branch = \"origin/release/1.$i\"; if (git rev-parse --verify $branch 2>$null) { $count = git rev-list --count --first-parent $branch \"^main\" 2>$null; if ($count) { Write-Host \"release/1.$i : $count first-parent commits\" } else { Write-Host \"release/1.$i : 0 first-parent commits\" } } else { Write-Host \"release/1.$i : branch not found\" } }"
	},
	{
		"type": "promptInputChange",
		"data": "f|[or ($i=40; $i -le 101; $i++) { $branch = \"origin/release/1.$i\"; if (git rev-parse --verify $branch 2>$null) { $count = git rev-list --count --first-parent $branch \"^main\" 2>$null; if ($count) { Write-Host \"release/1.$i : $count first-parent commits\" } else { Write-Host \"release/1.$i : 0 first-parent commits\" } } else { Write-Host \"release/1.$i : branch not found\" } }]"
	},
	{
		"type": "input",
		"data": "o"
	},
	{
		"type": "output",
		"data": "\u001b[m\u001b[?25l"
	},
	{
		"type": "output",
		"data": "\u001b[93m\bfo\u001b[97m\u001b[2m\u001b[3mr ($i=40; $i -le 101; $i++) { $branch = \"origin/release/1.$i\"; if (git rev-parse --verify $branch 2>$null) { $count = git rev-list --count --first-parent $branch \"^main\" 2>$null; if ($count) { Write-Host \"release/1.$i : $count first-parent commits\" } else { Write-Host \"release/1.$i : 0 first-parent commits\" } } else { Write-Host \"release/1.$i : branch not found\" } }\u001b[1;42H\u001b[?25h"
	},
	{
		"type": "promptInputChange",
		"data": "fo|[r ($i=40; $i -le 101; $i++) { $branch = \"origin/release/1.$i\"; if (git rev-parse --verify $branch 2>$null) { $count = git rev-list --count --first-parent $branch \"^main\" 2>$null; if ($count) { Write-Host \"release/1.$i : $count first-parent commits\" } else { Write-Host \"release/1.$i : 0 first-parent commits\" } } else { Write-Host \"release/1.$i : branch not found\" } }]"
	},
	{
		"type": "input",
		"data": "o"
	},
	{
		"type": "output",
		"data": "\u001b[m\u001b[?25l"
	},
	{
		"type": "output",
		"data": "\u001b[93m\u001b[1;40Hfoo                                                                                                                             \u001b[m                                                                                                                                                                       \r\n\u001b[75X\u001b[1;43H\u001b[?25h"
	},
	{
		"type": "promptInputChange",
		"data": "foo|"
	}
]
```

--------------------------------------------------------------------------------

````

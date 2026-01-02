---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 271
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 271 of 552)

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

---[FILE: src/vs/platform/extensions/common/extensionValidator.ts]---
Location: vscode-main/src/vs/platform/extensions/common/extensionValidator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isEqualOrParent, joinPath } from '../../../base/common/resources.js';
import Severity from '../../../base/common/severity.js';
import { URI } from '../../../base/common/uri.js';
import * as nls from '../../../nls.js';
import * as semver from '../../../base/common/semver/semver.js';
import { IExtensionManifest, parseApiProposals } from './extensions.js';
import { allApiProposals } from './extensionsApiProposals.js';

export interface IParsedVersion {
	hasCaret: boolean;
	hasGreaterEquals: boolean;
	majorBase: number;
	majorMustEqual: boolean;
	minorBase: number;
	minorMustEqual: boolean;
	patchBase: number;
	patchMustEqual: boolean;
	preRelease: string | null;
}

export interface INormalizedVersion {
	majorBase: number;
	majorMustEqual: boolean;
	minorBase: number;
	minorMustEqual: boolean;
	patchBase: number;
	patchMustEqual: boolean;
	notBefore: number; /* milliseconds timestamp, or 0 */
	isMinimum: boolean;
}

const VERSION_REGEXP = /^(\^|>=)?((\d+)|x)\.((\d+)|x)\.((\d+)|x)(\-.*)?$/;
const NOT_BEFORE_REGEXP = /^-(\d{4})(\d{2})(\d{2})$/;

export function isValidVersionStr(version: string): boolean {
	version = version.trim();
	return (version === '*' || VERSION_REGEXP.test(version));
}

export function parseVersion(version: string): IParsedVersion | null {
	if (!isValidVersionStr(version)) {
		return null;
	}

	version = version.trim();

	if (version === '*') {
		return {
			hasCaret: false,
			hasGreaterEquals: false,
			majorBase: 0,
			majorMustEqual: false,
			minorBase: 0,
			minorMustEqual: false,
			patchBase: 0,
			patchMustEqual: false,
			preRelease: null
		};
	}

	const m = version.match(VERSION_REGEXP);
	if (!m) {
		return null;
	}
	return {
		hasCaret: m[1] === '^',
		hasGreaterEquals: m[1] === '>=',
		majorBase: m[2] === 'x' ? 0 : parseInt(m[2], 10),
		majorMustEqual: (m[2] === 'x' ? false : true),
		minorBase: m[4] === 'x' ? 0 : parseInt(m[4], 10),
		minorMustEqual: (m[4] === 'x' ? false : true),
		patchBase: m[6] === 'x' ? 0 : parseInt(m[6], 10),
		patchMustEqual: (m[6] === 'x' ? false : true),
		preRelease: m[8] || null
	};
}

export function normalizeVersion(version: IParsedVersion | null): INormalizedVersion | null {
	if (!version) {
		return null;
	}

	const majorBase = version.majorBase;
	const majorMustEqual = version.majorMustEqual;
	const minorBase = version.minorBase;
	let minorMustEqual = version.minorMustEqual;
	const patchBase = version.patchBase;
	let patchMustEqual = version.patchMustEqual;

	if (version.hasCaret) {
		if (majorBase === 0) {
			patchMustEqual = false;
		} else {
			minorMustEqual = false;
			patchMustEqual = false;
		}
	}

	let notBefore = 0;
	if (version.preRelease) {
		const match = NOT_BEFORE_REGEXP.exec(version.preRelease);
		if (match) {
			const [, year, month, day] = match;
			notBefore = Date.UTC(Number(year), Number(month) - 1, Number(day));
		}
	}

	return {
		majorBase: majorBase,
		majorMustEqual: majorMustEqual,
		minorBase: minorBase,
		minorMustEqual: minorMustEqual,
		patchBase: patchBase,
		patchMustEqual: patchMustEqual,
		isMinimum: version.hasGreaterEquals,
		notBefore,
	};
}

export function isValidVersion(_inputVersion: string | INormalizedVersion, _inputDate: ProductDate, _desiredVersion: string | INormalizedVersion): boolean {
	let version: INormalizedVersion | null;
	if (typeof _inputVersion === 'string') {
		version = normalizeVersion(parseVersion(_inputVersion));
	} else {
		version = _inputVersion;
	}

	let productTs: number | undefined;
	if (_inputDate instanceof Date) {
		productTs = _inputDate.getTime();
	} else if (typeof _inputDate === 'string') {
		productTs = new Date(_inputDate).getTime();
	}

	let desiredVersion: INormalizedVersion | null;
	if (typeof _desiredVersion === 'string') {
		desiredVersion = normalizeVersion(parseVersion(_desiredVersion));
	} else {
		desiredVersion = _desiredVersion;
	}

	if (!version || !desiredVersion) {
		return false;
	}

	const majorBase = version.majorBase;
	const minorBase = version.minorBase;
	const patchBase = version.patchBase;

	let desiredMajorBase = desiredVersion.majorBase;
	let desiredMinorBase = desiredVersion.minorBase;
	let desiredPatchBase = desiredVersion.patchBase;
	const desiredNotBefore = desiredVersion.notBefore;

	let majorMustEqual = desiredVersion.majorMustEqual;
	let minorMustEqual = desiredVersion.minorMustEqual;
	let patchMustEqual = desiredVersion.patchMustEqual;

	if (desiredVersion.isMinimum) {
		if (majorBase > desiredMajorBase) {
			return true;
		}

		if (majorBase < desiredMajorBase) {
			return false;
		}

		if (minorBase > desiredMinorBase) {
			return true;
		}

		if (minorBase < desiredMinorBase) {
			return false;
		}

		if (productTs && productTs < desiredNotBefore) {
			return false;
		}

		return patchBase >= desiredPatchBase;
	}

	// Anything < 1.0.0 is compatible with >= 1.0.0, except exact matches
	if (majorBase === 1 && desiredMajorBase === 0 && (!majorMustEqual || !minorMustEqual || !patchMustEqual)) {
		desiredMajorBase = 1;
		desiredMinorBase = 0;
		desiredPatchBase = 0;
		majorMustEqual = true;
		minorMustEqual = false;
		patchMustEqual = false;
	}

	if (majorBase < desiredMajorBase) {
		// smaller major version
		return false;
	}

	if (majorBase > desiredMajorBase) {
		// higher major version
		return (!majorMustEqual);
	}

	// at this point, majorBase are equal

	if (minorBase < desiredMinorBase) {
		// smaller minor version
		return false;
	}

	if (minorBase > desiredMinorBase) {
		// higher minor version
		return (!minorMustEqual);
	}

	// at this point, minorBase are equal

	if (patchBase < desiredPatchBase) {
		// smaller patch version
		return false;
	}

	if (patchBase > desiredPatchBase) {
		// higher patch version
		return (!patchMustEqual);
	}

	// at this point, patchBase are equal

	if (productTs && productTs < desiredNotBefore) {
		return false;
	}

	return true;
}

type ProductDate = string | Date | undefined;

export function validateExtensionManifest(productVersion: string, productDate: ProductDate, extensionLocation: URI, extensionManifest: IExtensionManifest, extensionIsBuiltin: boolean, validateApiVersion: boolean): readonly [Severity, string][] {
	const validations: [Severity, string][] = [];
	if (typeof extensionManifest.publisher !== 'undefined' && typeof extensionManifest.publisher !== 'string') {
		validations.push([Severity.Error, nls.localize('extensionDescription.publisher', "property publisher must be of type `string`.")]);
		return validations;
	}
	if (typeof extensionManifest.name !== 'string') {
		validations.push([Severity.Error, nls.localize('extensionDescription.name', "property `{0}` is mandatory and must be of type `string`", 'name')]);
		return validations;
	}
	if (typeof extensionManifest.version !== 'string') {
		validations.push([Severity.Error, nls.localize('extensionDescription.version', "property `{0}` is mandatory and must be of type `string`", 'version')]);
		return validations;
	}
	if (!extensionManifest.engines) {
		validations.push([Severity.Error, nls.localize('extensionDescription.engines', "property `{0}` is mandatory and must be of type `object`", 'engines')]);
		return validations;
	}
	if (typeof extensionManifest.engines.vscode !== 'string') {
		validations.push([Severity.Error, nls.localize('extensionDescription.engines.vscode', "property `{0}` is mandatory and must be of type `string`", 'engines.vscode')]);
		return validations;
	}
	if (typeof extensionManifest.extensionDependencies !== 'undefined') {
		if (!isStringArray(extensionManifest.extensionDependencies)) {
			validations.push([Severity.Error, nls.localize('extensionDescription.extensionDependencies', "property `{0}` can be omitted or must be of type `string[]`", 'extensionDependencies')]);
			return validations;
		}
	}
	if (typeof extensionManifest.activationEvents !== 'undefined') {
		if (!isStringArray(extensionManifest.activationEvents)) {
			validations.push([Severity.Error, nls.localize('extensionDescription.activationEvents1', "property `{0}` can be omitted or must be of type `string[]`", 'activationEvents')]);
			return validations;
		}
		if (typeof extensionManifest.main === 'undefined' && typeof extensionManifest.browser === 'undefined') {
			validations.push([Severity.Error, nls.localize('extensionDescription.activationEvents2', "property `{0}` should be omitted if the extension doesn't have a `{1}` or `{2}` property.", 'activationEvents', 'main', 'browser')]);
			return validations;
		}
	}
	if (typeof extensionManifest.extensionKind !== 'undefined') {
		if (typeof extensionManifest.main === 'undefined') {
			validations.push([Severity.Warning, nls.localize('extensionDescription.extensionKind', "property `{0}` can be defined only if property `main` is also defined.", 'extensionKind')]);
			// not a failure case
		}
	}
	if (typeof extensionManifest.main !== 'undefined') {
		if (typeof extensionManifest.main !== 'string') {
			validations.push([Severity.Error, nls.localize('extensionDescription.main1', "property `{0}` can be omitted or must be of type `string`", 'main')]);
			return validations;
		} else {
			const mainLocation = joinPath(extensionLocation, extensionManifest.main);
			if (!isEqualOrParent(mainLocation, extensionLocation)) {
				validations.push([Severity.Warning, nls.localize('extensionDescription.main2', "Expected `main` ({0}) to be included inside extension's folder ({1}). This might make the extension non-portable.", mainLocation.path, extensionLocation.path)]);
				// not a failure case
			}
		}
	}
	if (typeof extensionManifest.browser !== 'undefined') {
		if (typeof extensionManifest.browser !== 'string') {
			validations.push([Severity.Error, nls.localize('extensionDescription.browser1', "property `{0}` can be omitted or must be of type `string`", 'browser')]);
			return validations;
		} else {
			const browserLocation = joinPath(extensionLocation, extensionManifest.browser);
			if (!isEqualOrParent(browserLocation, extensionLocation)) {
				validations.push([Severity.Warning, nls.localize('extensionDescription.browser2', "Expected `browser` ({0}) to be included inside extension's folder ({1}). This might make the extension non-portable.", browserLocation.path, extensionLocation.path)]);
				// not a failure case
			}
		}
	}

	if (!semver.valid(extensionManifest.version)) {
		validations.push([Severity.Error, nls.localize('notSemver', "Extension version is not semver compatible.")]);
		return validations;
	}

	const notices: string[] = [];
	const validExtensionVersion = isValidExtensionVersion(productVersion, productDate, extensionManifest, extensionIsBuiltin, notices);
	if (!validExtensionVersion) {
		for (const notice of notices) {
			validations.push([Severity.Error, notice]);
		}
	}

	if (validateApiVersion && extensionManifest.enabledApiProposals?.length) {
		const incompatibleNotices: string[] = [];
		if (!areApiProposalsCompatible([...extensionManifest.enabledApiProposals], incompatibleNotices)) {
			for (const notice of incompatibleNotices) {
				validations.push([Severity.Error, notice]);
			}
		}
	}

	return validations;
}

export function isValidExtensionVersion(productVersion: string, productDate: ProductDate, extensionManifest: IExtensionManifest, extensionIsBuiltin: boolean, notices: string[]): boolean {

	if (extensionIsBuiltin || (typeof extensionManifest.main === 'undefined' && typeof extensionManifest.browser === 'undefined')) {
		// No version check for builtin or declarative extensions
		return true;
	}

	return isVersionValid(productVersion, productDate, extensionManifest.engines.vscode, notices);
}

export function isEngineValid(engine: string, version: string, date: ProductDate): boolean {
	// TODO@joao: discuss with alex '*' doesn't seem to be a valid engine version
	return engine === '*' || isVersionValid(version, date, engine);
}

export function areApiProposalsCompatible(apiProposals: string[]): boolean;
export function areApiProposalsCompatible(apiProposals: string[], notices: string[]): boolean;
export function areApiProposalsCompatible(apiProposals: string[], productApiProposals: Readonly<{ [proposalName: string]: Readonly<{ proposal: string; version?: number }> }>): boolean;
export function areApiProposalsCompatible(apiProposals: string[], arg1?: string[] | Readonly<{ [proposalName: string]: Readonly<{ proposal: string; version?: number }> }>): boolean {
	if (apiProposals.length === 0) {
		return true;
	}
	const notices: string[] | undefined = Array.isArray(arg1) ? arg1 : undefined;
	const productApiProposals: Readonly<{ [proposalName: string]: Readonly<{ proposal: string; version?: number }> }> = (Array.isArray(arg1) ? undefined : arg1) ?? allApiProposals;
	const incompatibleProposals: string[] = [];
	const parsedProposals = parseApiProposals(apiProposals);
	for (const { proposalName, version } of parsedProposals) {
		if (!version) {
			continue;
		}
		const existingProposal = productApiProposals[proposalName];
		if (existingProposal?.version !== version) {
			incompatibleProposals.push(proposalName);
		}
	}
	if (incompatibleProposals.length) {
		if (notices) {
			if (incompatibleProposals.length === 1) {
				notices.push(nls.localize('apiProposalMismatch1', "This extension is using the API proposal '{0}' that is not compatible with the current version of VS Code.", incompatibleProposals[0]));
			} else {
				notices.push(nls.localize('apiProposalMismatch2', "This extension is using the API proposals {0} and '{1}' that are not compatible with the current version of VS Code.",
					incompatibleProposals.slice(0, incompatibleProposals.length - 1).map(p => `'${p}'`).join(', '),
					incompatibleProposals[incompatibleProposals.length - 1]));
			}
		}
		return false;
	}
	return true;
}

function isVersionValid(currentVersion: string, date: ProductDate, requestedVersion: string, notices: string[] = []): boolean {

	const desiredVersion = normalizeVersion(parseVersion(requestedVersion));
	if (!desiredVersion) {
		notices.push(nls.localize('versionSyntax', "Could not parse `engines.vscode` value {0}. Please use, for example: ^1.22.0, ^1.22.x, etc.", requestedVersion));
		return false;
	}

	// enforce that a breaking API version is specified.
	// for 0.X.Y, that means up to 0.X must be specified
	// otherwise for Z.X.Y, that means Z must be specified
	if (desiredVersion.majorBase === 0) {
		// force that major and minor must be specific
		if (!desiredVersion.majorMustEqual || !desiredVersion.minorMustEqual) {
			notices.push(nls.localize('versionSpecificity1', "Version specified in `engines.vscode` ({0}) is not specific enough. For vscode versions before 1.0.0, please define at a minimum the major and minor desired version. E.g. ^0.10.0, 0.10.x, 0.11.0, etc.", requestedVersion));
			return false;
		}
	} else {
		// force that major must be specific
		if (!desiredVersion.majorMustEqual) {
			notices.push(nls.localize('versionSpecificity2', "Version specified in `engines.vscode` ({0}) is not specific enough. For vscode versions after 1.0.0, please define at a minimum the major desired version. E.g. ^1.10.0, 1.10.x, 1.x.x, 2.x.x, etc.", requestedVersion));
			return false;
		}
	}

	if (!isValidVersion(currentVersion, date, desiredVersion)) {
		notices.push(nls.localize('versionMismatch', "Extension is not compatible with Code {0}. Extension requires: {1}.", currentVersion, requestedVersion));
		return false;
	}

	return true;
}

function isStringArray(arr: readonly string[]): boolean {
	if (!Array.isArray(arr)) {
		return false;
	}
	for (let i = 0, len = arr.length; i < len; i++) {
		if (typeof arr[i] !== 'string') {
			return false;
		}
	}
	return true;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensions/electron-main/extensionHostStarter.ts]---
Location: vscode-main/src/vs/platform/extensions/electron-main/extensionHostStarter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Promises } from '../../../base/common/async.js';
import { canceled } from '../../../base/common/errors.js';
import { Event } from '../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../base/common/lifecycle.js';
import { IExtensionHostProcessOptions, IExtensionHostStarter } from '../common/extensionHostStarter.js';
import { ILifecycleMainService } from '../../lifecycle/electron-main/lifecycleMainService.js';
import { ILogService } from '../../log/common/log.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { WindowUtilityProcess } from '../../utilityProcess/electron-main/utilityProcess.js';
import { IWindowsMainService } from '../../windows/electron-main/windows.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';

export class ExtensionHostStarter extends Disposable implements IDisposable, IExtensionHostStarter {

	readonly _serviceBrand: undefined;

	private static _lastId: number = 0;

	private readonly _extHosts = new Map<string, WindowUtilityProcess>();
	private _shutdown = false;

	constructor(
		@ILogService private readonly _logService: ILogService,
		@ILifecycleMainService private readonly _lifecycleMainService: ILifecycleMainService,
		@IWindowsMainService private readonly _windowsMainService: IWindowsMainService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
	) {
		super();

		// On shutdown: gracefully await extension host shutdowns
		this._register(this._lifecycleMainService.onWillShutdown(e => {
			this._shutdown = true;
			e.join('extHostStarter', this._waitForAllExit(6000));
		}));
	}

	override dispose(): void {
		// Intentionally not killing the extension host processes
		super.dispose();
	}

	private _getExtHost(id: string): WindowUtilityProcess {
		const extHostProcess = this._extHosts.get(id);
		if (!extHostProcess) {
			throw new Error(`Unknown extension host!`);
		}
		return extHostProcess;
	}

	onDynamicStdout(id: string): Event<string> {
		return this._getExtHost(id).onStdout;
	}

	onDynamicStderr(id: string): Event<string> {
		return this._getExtHost(id).onStderr;
	}

	onDynamicMessage(id: string): Event<unknown> {
		return this._getExtHost(id).onMessage;
	}

	onDynamicExit(id: string): Event<{ code: number; signal: string }> {
		return this._getExtHost(id).onExit;
	}

	async createExtensionHost(): Promise<{ id: string }> {
		if (this._shutdown) {
			throw canceled();
		}
		const id = String(++ExtensionHostStarter._lastId);
		const extHost = new WindowUtilityProcess(this._logService, this._windowsMainService, this._telemetryService, this._lifecycleMainService);
		this._extHosts.set(id, extHost);
		const disposable = extHost.onExit(({ pid, code, signal }) => {
			disposable.dispose();
			this._logService.info(`Extension host with pid ${pid} exited with code: ${code}, signal: ${signal}.`);
			setTimeout(() => {
				extHost.dispose();
				this._extHosts.delete(id);
			});

			// See https://github.com/microsoft/vscode/issues/194477
			// We have observed that sometimes the process sends an exit
			// event, but does not really exit and is stuck in an endless
			// loop. In these cases we kill the process forcefully after
			// a certain timeout.
			setTimeout(() => {
				try {
					process.kill(pid, 0); // will throw if the process doesn't exist anymore.
					this._logService.error(`Extension host with pid ${pid} still exists, forcefully killing it...`);
					process.kill(pid);
				} catch (er) {
					// ignore, as the process is already gone
				}
			}, 1000);
		});
		return { id };
	}

	async start(id: string, opts: IExtensionHostProcessOptions): Promise<{ pid: number | undefined }> {
		if (this._shutdown) {
			throw canceled();
		}
		const extHost = this._getExtHost(id);
		const args = ['--skipWorkspaceStorageLock'];
		if (this._configurationService.getValue<boolean>('extensions.supportNodeGlobalNavigator')) {
			args.push('--supportGlobalNavigator');
		}
		extHost.start({
			...opts,
			type: 'extensionHost',
			name: 'extension-host',
			entryPoint: 'vs/workbench/api/node/extensionHostProcess',
			args,
			execArgv: opts.execArgv,
			allowLoadingUnsignedLibraries: true,
			respondToAuthRequestsFromMainProcess: true,
			correlationId: id
		});
		const pid = await Event.toPromise(extHost.onSpawn);
		return { pid };
	}

	async enableInspectPort(id: string): Promise<boolean> {
		if (this._shutdown) {
			throw canceled();
		}
		const extHostProcess = this._extHosts.get(id);
		if (!extHostProcess) {
			return false;
		}
		return extHostProcess.enableInspectPort();
	}

	async kill(id: string): Promise<void> {
		if (this._shutdown) {
			throw canceled();
		}
		const extHostProcess = this._extHosts.get(id);
		if (!extHostProcess) {
			// already gone!
			return;
		}
		extHostProcess.kill();
	}

	async _killAllNow(): Promise<void> {
		for (const [, extHost] of this._extHosts) {
			extHost.kill();
		}
	}

	async _waitForAllExit(maxWaitTimeMs: number): Promise<void> {
		const exitPromises: Promise<void>[] = [];
		for (const [, extHost] of this._extHosts) {
			exitPromises.push(extHost.waitForExit(maxWaitTimeMs));
		}
		return Promises.settled(exitPromises).then(() => { });
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensions/test/common/extensions.test.ts]---
Location: vscode-main/src/vs/platform/extensions/test/common/extensions.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { parseEnabledApiProposalNames } from '../../common/extensions.js';

suite('Parsing Enabled Api Proposals', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('parsingEnabledApiProposals', () => {
		assert.deepStrictEqual(['activeComment', 'commentsDraftState'], parseEnabledApiProposalNames(['activeComment', 'commentsDraftState']));
		assert.deepStrictEqual(['activeComment', 'commentsDraftState'], parseEnabledApiProposalNames(['activeComment', 'commentsDraftState@1']));
		assert.deepStrictEqual(['activeComment', 'commentsDraftState'], parseEnabledApiProposalNames(['activeComment', 'commentsDraftState@']));
		assert.deepStrictEqual(['activeComment', 'commentsDraftState'], parseEnabledApiProposalNames(['activeComment', 'commentsDraftState@randomstring']));
		assert.deepStrictEqual(['activeComment', 'commentsDraftState'], parseEnabledApiProposalNames(['activeComment', 'commentsDraftState@1234']));
		assert.deepStrictEqual(['activeComment', 'commentsDraftState'], parseEnabledApiProposalNames(['activeComment', 'commentsDraftState@1234_random']));
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensions/test/common/extensionValidator.test.ts]---
Location: vscode-main/src/vs/platform/extensions/test/common/extensionValidator.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IExtensionManifest } from '../../common/extensions.js';
import { areApiProposalsCompatible, INormalizedVersion, IParsedVersion, isValidExtensionVersion, isValidVersion, isValidVersionStr, normalizeVersion, parseVersion } from '../../common/extensionValidator.js';

suite('Extension Version Validator', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const productVersion = '2021-05-11T21:54:30.577Z';

	test('isValidVersionStr', () => {
		assert.strictEqual(isValidVersionStr('0.10.0-dev'), true);
		assert.strictEqual(isValidVersionStr('0.10.0'), true);
		assert.strictEqual(isValidVersionStr('0.10.1'), true);
		assert.strictEqual(isValidVersionStr('0.10.100'), true);
		assert.strictEqual(isValidVersionStr('0.11.0'), true);

		assert.strictEqual(isValidVersionStr('x.x.x'), true);
		assert.strictEqual(isValidVersionStr('0.x.x'), true);
		assert.strictEqual(isValidVersionStr('0.10.0'), true);
		assert.strictEqual(isValidVersionStr('0.10.x'), true);
		assert.strictEqual(isValidVersionStr('^0.10.0'), true);
		assert.strictEqual(isValidVersionStr('*'), true);

		assert.strictEqual(isValidVersionStr('0.x.x.x'), false);
		assert.strictEqual(isValidVersionStr('0.10'), false);
		assert.strictEqual(isValidVersionStr('0.10.'), false);
	});

	test('parseVersion', () => {
		function assertParseVersion(version: string, hasCaret: boolean, hasGreaterEquals: boolean, majorBase: number, majorMustEqual: boolean, minorBase: number, minorMustEqual: boolean, patchBase: number, patchMustEqual: boolean, preRelease: string | null): void {
			const actual = parseVersion(version);
			const expected: IParsedVersion = { hasCaret, hasGreaterEquals, majorBase, majorMustEqual, minorBase, minorMustEqual, patchBase, patchMustEqual, preRelease };

			assert.deepStrictEqual(actual, expected, 'parseVersion for ' + version);
		}

		assertParseVersion('0.10.0-dev', false, false, 0, true, 10, true, 0, true, '-dev');
		assertParseVersion('0.10.0', false, false, 0, true, 10, true, 0, true, null);
		assertParseVersion('0.10.1', false, false, 0, true, 10, true, 1, true, null);
		assertParseVersion('0.10.100', false, false, 0, true, 10, true, 100, true, null);
		assertParseVersion('0.11.0', false, false, 0, true, 11, true, 0, true, null);

		assertParseVersion('x.x.x', false, false, 0, false, 0, false, 0, false, null);
		assertParseVersion('0.x.x', false, false, 0, true, 0, false, 0, false, null);
		assertParseVersion('0.10.x', false, false, 0, true, 10, true, 0, false, null);
		assertParseVersion('^0.10.0', true, false, 0, true, 10, true, 0, true, null);
		assertParseVersion('^0.10.2', true, false, 0, true, 10, true, 2, true, null);
		assertParseVersion('^1.10.2', true, false, 1, true, 10, true, 2, true, null);
		assertParseVersion('*', false, false, 0, false, 0, false, 0, false, null);

		assertParseVersion('>=0.0.1', false, true, 0, true, 0, true, 1, true, null);
		assertParseVersion('>=2.4.3', false, true, 2, true, 4, true, 3, true, null);
	});

	test('normalizeVersion', () => {
		function assertNormalizeVersion(version: string, majorBase: number, majorMustEqual: boolean, minorBase: number, minorMustEqual: boolean, patchBase: number, patchMustEqual: boolean, isMinimum: boolean, notBefore = 0): void {
			const actual = normalizeVersion(parseVersion(version));
			const expected: INormalizedVersion = { majorBase, majorMustEqual, minorBase, minorMustEqual, patchBase, patchMustEqual, isMinimum, notBefore };
			assert.deepStrictEqual(actual, expected, 'parseVersion for ' + version);
		}

		assertNormalizeVersion('0.10.0-dev', 0, true, 10, true, 0, true, false, 0);
		assertNormalizeVersion('0.10.0-222222222', 0, true, 10, true, 0, true, false, 0);
		assertNormalizeVersion('0.10.0-20210511', 0, true, 10, true, 0, true, false, new Date('2021-05-11T00:00:00Z').getTime());

		assertNormalizeVersion('0.10.0', 0, true, 10, true, 0, true, false);
		assertNormalizeVersion('0.10.1', 0, true, 10, true, 1, true, false);
		assertNormalizeVersion('0.10.100', 0, true, 10, true, 100, true, false);
		assertNormalizeVersion('0.11.0', 0, true, 11, true, 0, true, false);

		assertNormalizeVersion('x.x.x', 0, false, 0, false, 0, false, false);
		assertNormalizeVersion('0.x.x', 0, true, 0, false, 0, false, false);
		assertNormalizeVersion('0.10.x', 0, true, 10, true, 0, false, false);
		assertNormalizeVersion('^0.10.0', 0, true, 10, true, 0, false, false);
		assertNormalizeVersion('^0.10.2', 0, true, 10, true, 2, false, false);
		assertNormalizeVersion('^1.10.2', 1, true, 10, false, 2, false, false);
		assertNormalizeVersion('*', 0, false, 0, false, 0, false, false);

		assertNormalizeVersion('>=0.0.1', 0, true, 0, true, 1, true, true);
		assertNormalizeVersion('>=2.4.3', 2, true, 4, true, 3, true, true);
		assertNormalizeVersion('>=2.4.3', 2, true, 4, true, 3, true, true);
	});

	test('isValidVersion', () => {
		function testIsValidVersion(version: string, desiredVersion: string, expectedResult: boolean): void {
			const actual = isValidVersion(version, productVersion, desiredVersion);
			assert.strictEqual(actual, expectedResult, 'extension - vscode: ' + version + ', desiredVersion: ' + desiredVersion + ' should be ' + expectedResult);
		}

		testIsValidVersion('0.10.0-dev', 'x.x.x', true);
		testIsValidVersion('0.10.0-dev', '0.x.x', true);
		testIsValidVersion('0.10.0-dev', '0.10.0', true);
		testIsValidVersion('0.10.0-dev', '0.10.2', false);
		testIsValidVersion('0.10.0-dev', '^0.10.2', false);
		testIsValidVersion('0.10.0-dev', '0.10.x', true);
		testIsValidVersion('0.10.0-dev', '^0.10.0', true);
		testIsValidVersion('0.10.0-dev', '*', true);
		testIsValidVersion('0.10.0-dev', '>=0.0.1', true);
		testIsValidVersion('0.10.0-dev', '>=0.0.10', true);
		testIsValidVersion('0.10.0-dev', '>=0.10.0', true);
		testIsValidVersion('0.10.0-dev', '>=0.10.1', false);
		testIsValidVersion('0.10.0-dev', '>=1.0.0', false);

		testIsValidVersion('0.10.0', 'x.x.x', true);
		testIsValidVersion('0.10.0', '0.x.x', true);
		testIsValidVersion('0.10.0', '0.10.0', true);
		testIsValidVersion('0.10.0', '0.10.2', false);
		testIsValidVersion('0.10.0', '^0.10.2', false);
		testIsValidVersion('0.10.0', '0.10.x', true);
		testIsValidVersion('0.10.0', '^0.10.0', true);
		testIsValidVersion('0.10.0', '*', true);

		testIsValidVersion('0.10.1', 'x.x.x', true);
		testIsValidVersion('0.10.1', '0.x.x', true);
		testIsValidVersion('0.10.1', '0.10.0', false);
		testIsValidVersion('0.10.1', '0.10.2', false);
		testIsValidVersion('0.10.1', '^0.10.2', false);
		testIsValidVersion('0.10.1', '0.10.x', true);
		testIsValidVersion('0.10.1', '^0.10.0', true);
		testIsValidVersion('0.10.1', '*', true);

		testIsValidVersion('0.10.100', 'x.x.x', true);
		testIsValidVersion('0.10.100', '0.x.x', true);
		testIsValidVersion('0.10.100', '0.10.0', false);
		testIsValidVersion('0.10.100', '0.10.2', false);
		testIsValidVersion('0.10.100', '^0.10.2', true);
		testIsValidVersion('0.10.100', '0.10.x', true);
		testIsValidVersion('0.10.100', '^0.10.0', true);
		testIsValidVersion('0.10.100', '*', true);

		testIsValidVersion('0.11.0', 'x.x.x', true);
		testIsValidVersion('0.11.0', '0.x.x', true);
		testIsValidVersion('0.11.0', '0.10.0', false);
		testIsValidVersion('0.11.0', '0.10.2', false);
		testIsValidVersion('0.11.0', '^0.10.2', false);
		testIsValidVersion('0.11.0', '0.10.x', false);
		testIsValidVersion('0.11.0', '^0.10.0', false);
		testIsValidVersion('0.11.0', '*', true);

		// Anything < 1.0.0 is compatible

		testIsValidVersion('1.0.0', 'x.x.x', true);
		testIsValidVersion('1.0.0', '0.x.x', true);
		testIsValidVersion('1.0.0', '0.10.0', false);
		testIsValidVersion('1.0.0', '0.10.2', false);
		testIsValidVersion('1.0.0', '^0.10.2', true);
		testIsValidVersion('1.0.0', '0.10.x', true);
		testIsValidVersion('1.0.0', '^0.10.0', true);
		testIsValidVersion('1.0.0', '1.0.0', true);
		testIsValidVersion('1.0.0', '^1.0.0', true);
		testIsValidVersion('1.0.0', '^2.0.0', false);
		testIsValidVersion('1.0.0', '*', true);
		testIsValidVersion('1.0.0', '>=0.0.1', true);
		testIsValidVersion('1.0.0', '>=0.0.10', true);
		testIsValidVersion('1.0.0', '>=0.10.0', true);
		testIsValidVersion('1.0.0', '>=0.10.1', true);
		testIsValidVersion('1.0.0', '>=1.0.0', true);
		testIsValidVersion('1.0.0', '>=1.1.0', false);
		testIsValidVersion('1.0.0', '>=1.0.1', false);
		testIsValidVersion('1.0.0', '>=2.0.0', false);

		testIsValidVersion('1.0.100', 'x.x.x', true);
		testIsValidVersion('1.0.100', '0.x.x', true);
		testIsValidVersion('1.0.100', '0.10.0', false);
		testIsValidVersion('1.0.100', '0.10.2', false);
		testIsValidVersion('1.0.100', '^0.10.2', true);
		testIsValidVersion('1.0.100', '0.10.x', true);
		testIsValidVersion('1.0.100', '^0.10.0', true);
		testIsValidVersion('1.0.100', '1.0.0', false);
		testIsValidVersion('1.0.100', '^1.0.0', true);
		testIsValidVersion('1.0.100', '^1.0.1', true);
		testIsValidVersion('1.0.100', '^2.0.0', false);
		testIsValidVersion('1.0.100', '*', true);

		testIsValidVersion('1.100.0', 'x.x.x', true);
		testIsValidVersion('1.100.0', '0.x.x', true);
		testIsValidVersion('1.100.0', '0.10.0', false);
		testIsValidVersion('1.100.0', '0.10.2', false);
		testIsValidVersion('1.100.0', '^0.10.2', true);
		testIsValidVersion('1.100.0', '0.10.x', true);
		testIsValidVersion('1.100.0', '^0.10.0', true);
		testIsValidVersion('1.100.0', '1.0.0', false);
		testIsValidVersion('1.100.0', '^1.0.0', true);
		testIsValidVersion('1.100.0', '^1.1.0', true);
		testIsValidVersion('1.100.0', '^1.100.0', true);
		testIsValidVersion('1.100.0', '^2.0.0', false);
		testIsValidVersion('1.100.0', '*', true);
		testIsValidVersion('1.100.0', '>=1.99.0', true);
		testIsValidVersion('1.100.0', '>=1.100.0', true);
		testIsValidVersion('1.100.0', '>=1.101.0', false);

		testIsValidVersion('2.0.0', 'x.x.x', true);
		testIsValidVersion('2.0.0', '0.x.x', false);
		testIsValidVersion('2.0.0', '0.10.0', false);
		testIsValidVersion('2.0.0', '0.10.2', false);
		testIsValidVersion('2.0.0', '^0.10.2', false);
		testIsValidVersion('2.0.0', '0.10.x', false);
		testIsValidVersion('2.0.0', '^0.10.0', false);
		testIsValidVersion('2.0.0', '1.0.0', false);
		testIsValidVersion('2.0.0', '^1.0.0', false);
		testIsValidVersion('2.0.0', '^1.1.0', false);
		testIsValidVersion('2.0.0', '^1.100.0', false);
		testIsValidVersion('2.0.0', '^2.0.0', true);
		testIsValidVersion('2.0.0', '*', true);
	});

	test('isValidExtensionVersion', () => {

		function testExtensionVersion(version: string, desiredVersion: string, isBuiltin: boolean, hasMain: boolean, expectedResult: boolean): void {
			const manifest: IExtensionManifest = {
				name: 'test',
				publisher: 'test',
				version: '0.0.0',
				engines: {
					vscode: desiredVersion
				},
				main: hasMain ? 'something' : undefined
			};
			const reasons: string[] = [];
			const actual = isValidExtensionVersion(version, productVersion, manifest, isBuiltin, reasons);

			assert.strictEqual(actual, expectedResult, 'version: ' + version + ', desiredVersion: ' + desiredVersion + ', desc: ' + JSON.stringify(manifest) + ', reasons: ' + JSON.stringify(reasons));
		}

		function testIsInvalidExtensionVersion(version: string, desiredVersion: string, isBuiltin: boolean, hasMain: boolean): void {
			testExtensionVersion(version, desiredVersion, isBuiltin, hasMain, false);
		}

		function testIsValidExtensionVersion(version: string, desiredVersion: string, isBuiltin: boolean, hasMain: boolean): void {
			testExtensionVersion(version, desiredVersion, isBuiltin, hasMain, true);
		}

		function testIsValidVersion(version: string, desiredVersion: string, expectedResult: boolean): void {
			testExtensionVersion(version, desiredVersion, false, true, expectedResult);
		}

		// builtin are allowed to use * or x.x.x
		testIsValidExtensionVersion('0.10.0-dev', '*', true, true);
		testIsValidExtensionVersion('0.10.0-dev', 'x.x.x', true, true);
		testIsValidExtensionVersion('0.10.0-dev', '0.x.x', true, true);
		testIsValidExtensionVersion('0.10.0-dev', '0.10.x', true, true);
		testIsValidExtensionVersion('1.10.0-dev', '1.x.x', true, true);
		testIsValidExtensionVersion('1.10.0-dev', '1.10.x', true, true);
		testIsValidExtensionVersion('0.10.0-dev', '*', true, false);
		testIsValidExtensionVersion('0.10.0-dev', 'x.x.x', true, false);
		testIsValidExtensionVersion('0.10.0-dev', '0.x.x', true, false);
		testIsValidExtensionVersion('0.10.0-dev', '0.10.x', true, false);
		testIsValidExtensionVersion('1.10.0-dev', '1.x.x', true, false);
		testIsValidExtensionVersion('1.10.0-dev', '1.10.x', true, false);

		// normal extensions are allowed to use * or x.x.x only if they have no main
		testIsInvalidExtensionVersion('0.10.0-dev', '*', false, true);
		testIsInvalidExtensionVersion('0.10.0-dev', 'x.x.x', false, true);
		testIsInvalidExtensionVersion('0.10.0-dev', '0.x.x', false, true);
		testIsValidExtensionVersion('0.10.0-dev', '0.10.x', false, true);
		testIsValidExtensionVersion('1.10.0-dev', '1.x.x', false, true);
		testIsValidExtensionVersion('1.10.0-dev', '1.10.x', false, true);
		testIsValidExtensionVersion('0.10.0-dev', '*', false, false);
		testIsValidExtensionVersion('0.10.0-dev', 'x.x.x', false, false);
		testIsValidExtensionVersion('0.10.0-dev', '0.x.x', false, false);
		testIsValidExtensionVersion('0.10.0-dev', '0.10.x', false, false);
		testIsValidExtensionVersion('1.10.0-dev', '1.x.x', false, false);
		testIsValidExtensionVersion('1.10.0-dev', '1.10.x', false, false);

		// extensions without "main" get no version check
		testIsValidExtensionVersion('0.10.0-dev', '>=0.9.1-pre.1', false, false);
		testIsValidExtensionVersion('0.10.0-dev', '*', false, false);
		testIsValidExtensionVersion('0.10.0-dev', 'x.x.x', false, false);
		testIsValidExtensionVersion('0.10.0-dev', '0.x.x', false, false);
		testIsValidExtensionVersion('0.10.0-dev', '0.10.x', false, false);
		testIsValidExtensionVersion('1.10.0-dev', '1.x.x', false, false);
		testIsValidExtensionVersion('1.10.0-dev', '1.10.x', false, false);
		testIsValidExtensionVersion('0.10.0-dev', '*', false, false);
		testIsValidExtensionVersion('0.10.0-dev', 'x.x.x', false, false);
		testIsValidExtensionVersion('0.10.0-dev', '0.x.x', false, false);
		testIsValidExtensionVersion('0.10.0-dev', '0.10.x', false, false);
		testIsValidExtensionVersion('1.10.0-dev', '1.x.x', false, false);
		testIsValidExtensionVersion('1.10.0-dev', '1.10.x', false, false);

		// normal extensions with code
		testIsValidVersion('0.10.0-dev', 'x.x.x', false); // fails due to lack of specificity
		testIsValidVersion('0.10.0-dev', '0.x.x', false); // fails due to lack of specificity
		testIsValidVersion('0.10.0-dev', '0.10.0', true);
		testIsValidVersion('0.10.0-dev', '0.10.2', false);
		testIsValidVersion('0.10.0-dev', '^0.10.2', false);
		testIsValidVersion('0.10.0-dev', '0.10.x', true);
		testIsValidVersion('0.10.0-dev', '^0.10.0', true);
		testIsValidVersion('0.10.0-dev', '*', false); // fails due to lack of specificity

		testIsValidVersion('0.10.0', 'x.x.x', false); // fails due to lack of specificity
		testIsValidVersion('0.10.0', '0.x.x', false); // fails due to lack of specificity
		testIsValidVersion('0.10.0', '0.10.0', true);
		testIsValidVersion('0.10.0', '0.10.2', false);
		testIsValidVersion('0.10.0', '^0.10.2', false);
		testIsValidVersion('0.10.0', '0.10.x', true);
		testIsValidVersion('0.10.0', '^0.10.0', true);
		testIsValidVersion('0.10.0', '*', false); // fails due to lack of specificity

		testIsValidVersion('0.10.1', 'x.x.x', false); // fails due to lack of specificity
		testIsValidVersion('0.10.1', '0.x.x', false); // fails due to lack of specificity
		testIsValidVersion('0.10.1', '0.10.0', false);
		testIsValidVersion('0.10.1', '0.10.2', false);
		testIsValidVersion('0.10.1', '^0.10.2', false);
		testIsValidVersion('0.10.1', '0.10.x', true);
		testIsValidVersion('0.10.1', '^0.10.0', true);
		testIsValidVersion('0.10.1', '*', false); // fails due to lack of specificity

		testIsValidVersion('0.10.100', 'x.x.x', false); // fails due to lack of specificity
		testIsValidVersion('0.10.100', '0.x.x', false); // fails due to lack of specificity
		testIsValidVersion('0.10.100', '0.10.0', false);
		testIsValidVersion('0.10.100', '0.10.2', false);
		testIsValidVersion('0.10.100', '^0.10.2', true);
		testIsValidVersion('0.10.100', '0.10.x', true);
		testIsValidVersion('0.10.100', '^0.10.0', true);
		testIsValidVersion('0.10.100', '*', false); // fails due to lack of specificity

		testIsValidVersion('0.11.0', 'x.x.x', false); // fails due to lack of specificity
		testIsValidVersion('0.11.0', '0.x.x', false); // fails due to lack of specificity
		testIsValidVersion('0.11.0', '0.10.0', false);
		testIsValidVersion('0.11.0', '0.10.2', false);
		testIsValidVersion('0.11.0', '^0.10.2', false);
		testIsValidVersion('0.11.0', '0.10.x', false);
		testIsValidVersion('0.11.0', '^0.10.0', false);
		testIsValidVersion('0.11.0', '*', false); // fails due to lack of specificity

		testIsValidVersion('1.0.0', 'x.x.x', false); // fails due to lack of specificity
		testIsValidVersion('1.0.0', '0.x.x', false); // fails due to lack of specificity
		testIsValidVersion('1.0.0', '0.10.0', false);
		testIsValidVersion('1.0.0', '0.10.2', false);
		testIsValidVersion('1.0.0', '^0.10.2', true);
		testIsValidVersion('1.0.0', '0.10.x', true);
		testIsValidVersion('1.0.0', '^0.10.0', true);
		testIsValidVersion('1.0.0', '*', false); // fails due to lack of specificity

		testIsValidVersion('1.10.0', 'x.x.x', false); // fails due to lack of specificity
		testIsValidVersion('1.10.0', '1.x.x', true);
		testIsValidVersion('1.10.0', '1.10.0', true);
		testIsValidVersion('1.10.0', '1.10.2', false);
		testIsValidVersion('1.10.0', '^1.10.2', false);
		testIsValidVersion('1.10.0', '1.10.x', true);
		testIsValidVersion('1.10.0', '^1.10.0', true);
		testIsValidVersion('1.10.0', '*', false); // fails due to lack of specificity


		// Anything < 1.0.0 is compatible

		testIsValidVersion('1.0.0', 'x.x.x', false); // fails due to lack of specificity
		testIsValidVersion('1.0.0', '0.x.x', false); // fails due to lack of specificity
		testIsValidVersion('1.0.0', '0.10.0', false);
		testIsValidVersion('1.0.0', '0.10.2', false);
		testIsValidVersion('1.0.0', '^0.10.2', true);
		testIsValidVersion('1.0.0', '0.10.x', true);
		testIsValidVersion('1.0.0', '^0.10.0', true);
		testIsValidVersion('1.0.0', '1.0.0', true);
		testIsValidVersion('1.0.0', '^1.0.0', true);
		testIsValidVersion('1.0.0', '^2.0.0', false);
		testIsValidVersion('1.0.0', '*', false); // fails due to lack of specificity

		testIsValidVersion('1.0.100', 'x.x.x', false); // fails due to lack of specificity
		testIsValidVersion('1.0.100', '0.x.x', false); // fails due to lack of specificity
		testIsValidVersion('1.0.100', '0.10.0', false);
		testIsValidVersion('1.0.100', '0.10.2', false);
		testIsValidVersion('1.0.100', '^0.10.2', true);
		testIsValidVersion('1.0.100', '0.10.x', true);
		testIsValidVersion('1.0.100', '^0.10.0', true);
		testIsValidVersion('1.0.100', '1.0.0', false);
		testIsValidVersion('1.0.100', '^1.0.0', true);
		testIsValidVersion('1.0.100', '^1.0.1', true);
		testIsValidVersion('1.0.100', '^2.0.0', false);
		testIsValidVersion('1.0.100', '*', false); // fails due to lack of specificity

		testIsValidVersion('1.100.0', 'x.x.x', false); // fails due to lack of specificity
		testIsValidVersion('1.100.0', '0.x.x', false); // fails due to lack of specificity
		testIsValidVersion('1.100.0', '0.10.0', false);
		testIsValidVersion('1.100.0', '0.10.2', false);
		testIsValidVersion('1.100.0', '^0.10.2', true);
		testIsValidVersion('1.100.0', '0.10.x', true);
		testIsValidVersion('1.100.0', '^0.10.0', true);
		testIsValidVersion('1.100.0', '1.0.0', false);
		testIsValidVersion('1.100.0', '^1.0.0', true);
		testIsValidVersion('1.100.0', '^1.1.0', true);
		testIsValidVersion('1.100.0', '^1.100.0', true);
		testIsValidVersion('1.100.0', '^2.0.0', false);
		testIsValidVersion('1.100.0', '*', false); // fails due to lack of specificity

		testIsValidVersion('2.0.0', 'x.x.x', false); // fails due to lack of specificity
		testIsValidVersion('2.0.0', '0.x.x', false); // fails due to lack of specificity
		testIsValidVersion('2.0.0', '0.10.0', false);
		testIsValidVersion('2.0.0', '0.10.2', false);
		testIsValidVersion('2.0.0', '^0.10.2', false);
		testIsValidVersion('2.0.0', '0.10.x', false);
		testIsValidVersion('2.0.0', '^0.10.0', false);
		testIsValidVersion('2.0.0', '1.0.0', false);
		testIsValidVersion('2.0.0', '^1.0.0', false);
		testIsValidVersion('2.0.0', '^1.1.0', false);
		testIsValidVersion('2.0.0', '^1.100.0', false);
		testIsValidVersion('2.0.0', '^2.0.0', true);
		testIsValidVersion('2.0.0', '*', false); // fails due to lack of specificity

		// date tags
		testIsValidVersion('1.10.0', '^1.10.0-20210511', true); // current date
		testIsValidVersion('1.10.0', '^1.10.0-20210510', true); // before date
		testIsValidVersion('1.10.0', '^1.10.0-20210512', false); // future date
		testIsValidVersion('1.10.1', '^1.10.0-20200101', true); // before date, but ahead version
		testIsValidVersion('1.11.0', '^1.10.0-20200101', true);
	});

	test('isValidExtensionVersion checks browser only extensions', () => {
		const manifest = {
			name: 'test',
			publisher: 'test',
			version: '0.0.0',
			engines: {
				vscode: '^1.45.0'
			},
			browser: 'something'
		};
		assert.strictEqual(isValidExtensionVersion('1.44.0', undefined, manifest, false, []), false);
	});

	test('areApiProposalsCompatible', () => {
		assert.strictEqual(areApiProposalsCompatible([]), true);
		assert.strictEqual(areApiProposalsCompatible([], ['hello']), true);
		assert.strictEqual(areApiProposalsCompatible([], {}), true);
		assert.strictEqual(areApiProposalsCompatible(['proposal1'], {}), true);
		assert.strictEqual(areApiProposalsCompatible(['proposal1'], { 'proposal1': { proposal: '' } }), true);
		assert.strictEqual(areApiProposalsCompatible(['proposal1'], { 'proposal1': { proposal: '', version: 1 } }), true);
		assert.strictEqual(areApiProposalsCompatible(['proposal1@1'], { 'proposal1': { proposal: '', version: 1 } }), true);
		assert.strictEqual(areApiProposalsCompatible(['proposal1'], { 'proposal2': { proposal: '' } }), true);
		assert.strictEqual(areApiProposalsCompatible(['proposal1', 'proposal2'], {}), true);
		assert.strictEqual(areApiProposalsCompatible(['proposal1', 'proposal2'], { 'proposal1': { proposal: '' } }), true);

		assert.strictEqual(areApiProposalsCompatible(['proposal2@1'], { 'proposal1': { proposal: '' } }), false);
		assert.strictEqual(areApiProposalsCompatible(['proposal1@1'], { 'proposal1': { proposal: '', version: 2 } }), false);
		assert.strictEqual(areApiProposalsCompatible(['proposal1@1'], { 'proposal1': { proposal: '' } }), false);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/externalServices/common/marketplace.ts]---
Location: vscode-main/src/vs/platform/externalServices/common/marketplace.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IHeaders } from '../../../base/parts/request/common/request.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { getServiceMachineId } from './serviceMachineId.js';
import { IFileService } from '../../files/common/files.js';
import { IProductService } from '../../product/common/productService.js';
import { IStorageService } from '../../storage/common/storage.js';
import { ITelemetryService, TelemetryLevel } from '../../telemetry/common/telemetry.js';
import { getTelemetryLevel, supportsTelemetry } from '../../telemetry/common/telemetryUtils.js';

export async function resolveMarketplaceHeaders(version: string,
	productService: IProductService,
	environmentService: IEnvironmentService,
	configurationService: IConfigurationService,
	fileService: IFileService,
	storageService: IStorageService | undefined,
	telemetryService: ITelemetryService): Promise<IHeaders> {

	const headers: IHeaders = {
		'X-Market-Client-Id': `VSCode ${version}`,
		'User-Agent': `VSCode ${version} (${productService.nameShort})`
	};

	if (supportsTelemetry(productService, environmentService) && getTelemetryLevel(configurationService) === TelemetryLevel.USAGE) {
		const serviceMachineId = await getServiceMachineId(environmentService, fileService, storageService);
		headers['X-Market-User-Id'] = serviceMachineId;
		// Send machineId as VSCode-SessionId so we can correlate telemetry events across different services
		// machineId can be undefined sometimes (eg: when launching from CLI), so send serviceMachineId instead otherwise
		// Marketplace will reject the request if there is no VSCode-SessionId header
		headers['VSCode-SessionId'] = telemetryService.machineId || serviceMachineId;
	}

	return headers;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/externalServices/common/serviceMachineId.ts]---
Location: vscode-main/src/vs/platform/externalServices/common/serviceMachineId.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../base/common/buffer.js';
import { generateUuid, isUUID } from '../../../base/common/uuid.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { IFileService } from '../../files/common/files.js';
import { IStorageService, StorageScope, StorageTarget } from '../../storage/common/storage.js';

export async function getServiceMachineId(environmentService: IEnvironmentService, fileService: IFileService, storageService: IStorageService | undefined): Promise<string> {
	let uuid: string | null = storageService ? storageService.get('storage.serviceMachineId', StorageScope.APPLICATION) || null : null;
	if (uuid) {
		return uuid;
	}
	try {
		const contents = await fileService.readFile(environmentService.serviceMachineIdResource);
		const value = contents.value.toString();
		uuid = isUUID(value) ? value : null;
	} catch (e) {
		uuid = null;
	}

	if (!uuid) {
		uuid = generateUuid();
		try {
			await fileService.writeFile(environmentService.serviceMachineIdResource, VSBuffer.fromString(uuid));
		} catch (error) {
			//noop
		}
	}

	storageService?.store('storage.serviceMachineId', uuid, StorageScope.APPLICATION, StorageTarget.MACHINE);

	return uuid;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/externalTerminal/common/externalTerminal.ts]---
Location: vscode-main/src/vs/platform/externalTerminal/common/externalTerminal.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ITerminalEnvironment } from '../../terminal/common/terminal.js';

export const IExternalTerminalService = createDecorator<IExternalTerminalService>('externalTerminal');

export interface IExternalTerminalSettings {
	linuxExec?: string;
	osxExec?: string;
	windowsExec?: string;
}

export interface ITerminalForPlatform {
	windows: string;
	linux: string;
	osx: string;
}

export interface IExternalTerminalService {
	readonly _serviceBrand: undefined;
	openTerminal(configuration: IExternalTerminalSettings, cwd: string | undefined): Promise<void>;
	runInTerminal(title: string, cwd: string, args: string[], env: ITerminalEnvironment, settings: IExternalTerminalSettings): Promise<number | undefined>;
	getDefaultTerminalForPlatforms(): Promise<ITerminalForPlatform>;
}

export interface IExternalTerminalConfiguration {
	terminal: {
		explorerKind: 'integrated' | 'external' | 'both';
		external: IExternalTerminalSettings;
	};
}

export const DEFAULT_TERMINAL_OSX = 'Terminal.app';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/externalTerminal/electron-browser/externalTerminalService.ts]---
Location: vscode-main/src/vs/platform/externalTerminal/electron-browser/externalTerminalService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IExternalTerminalService as ICommonExternalTerminalService } from '../common/externalTerminal.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { registerMainProcessRemoteService } from '../../ipc/electron-browser/services.js';

export const IExternalTerminalService = createDecorator<IExternalTerminalService>('externalTerminal');

export interface IExternalTerminalService extends ICommonExternalTerminalService {
	readonly _serviceBrand: undefined;
}

registerMainProcessRemoteService(IExternalTerminalService, 'externalTerminal');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/externalTerminal/electron-main/externalTerminal.ts]---
Location: vscode-main/src/vs/platform/externalTerminal/electron-main/externalTerminal.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IExternalTerminalService } from '../common/externalTerminal.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IExternalTerminalMainService = createDecorator<IExternalTerminalMainService>('externalTerminal');

export interface IExternalTerminalMainService extends IExternalTerminalService {
	readonly _serviceBrand: undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/externalTerminal/node/externalTerminalService.ts]---
Location: vscode-main/src/vs/platform/externalTerminal/node/externalTerminalService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as cp from 'child_process';
import { memoize } from '../../../base/common/decorators.js';
import { FileAccess } from '../../../base/common/network.js';
import * as path from '../../../base/common/path.js';
import * as env from '../../../base/common/platform.js';
import { sanitizeProcessEnvironment } from '../../../base/common/processes.js';
import * as pfs from '../../../base/node/pfs.js';
import * as processes from '../../../base/node/processes.js';
import * as nls from '../../../nls.js';
import { DEFAULT_TERMINAL_OSX, IExternalTerminalService, IExternalTerminalSettings, ITerminalForPlatform } from '../common/externalTerminal.js';
import { ITerminalEnvironment } from '../../terminal/common/terminal.js';

const TERMINAL_TITLE = nls.localize('console.title', "VS Code Console");

abstract class ExternalTerminalService {
	public _serviceBrand: undefined;

	async getDefaultTerminalForPlatforms(): Promise<ITerminalForPlatform> {
		return {
			windows: WindowsExternalTerminalService.getDefaultTerminalWindows(),
			linux: await LinuxExternalTerminalService.getDefaultTerminalLinuxReady(),
			osx: 'xterm'
		};
	}
}

export class WindowsExternalTerminalService extends ExternalTerminalService implements IExternalTerminalService {
	private static readonly CMD = 'cmd.exe';
	private static _DEFAULT_TERMINAL_WINDOWS: string;

	public openTerminal(configuration: IExternalTerminalSettings, cwd?: string): Promise<void> {
		return this.spawnTerminal(cp, configuration, processes.getWindowsShell(), cwd);
	}

	public spawnTerminal(spawner: typeof cp, configuration: IExternalTerminalSettings, command: string, cwd?: string): Promise<void> {
		const exec = configuration.windowsExec || WindowsExternalTerminalService.getDefaultTerminalWindows();

		// Make the drive letter uppercase on Windows (see #9448)
		if (cwd && cwd[1] === ':') {
			cwd = cwd[0].toUpperCase() + cwd.substr(1);
		}

		// cmder ignores the environment cwd and instead opts to always open in %USERPROFILE%
		// unless otherwise specified
		const basename = path.basename(exec, '.exe').toLowerCase();
		if (basename === 'cmder') {
			spawner.spawn(exec, cwd ? [cwd] : undefined);
			return Promise.resolve(undefined);
		}

		const cmdArgs = ['/c', 'start', '/wait'];
		if (exec.indexOf(' ') >= 0) {
			// The "" argument is the window title. Without this, exec doesn't work when the path
			// contains spaces. #6590
			// Title is Execution Path. #220129
			cmdArgs.push(exec);
		}
		cmdArgs.push(exec);
		// Add starting directory parameter for Windows Terminal (see #90734)
		if (basename === 'wt') {
			cmdArgs.push('-d .');
		}

		return new Promise<void>((c, e) => {
			const env = getSanitizedEnvironment(process);
			const child = spawner.spawn(command, cmdArgs, { cwd, env, detached: true });
			child.on('error', e);
			child.on('exit', () => c());
		});
	}

	public async runInTerminal(title: string, dir: string, args: string[], envVars: ITerminalEnvironment, settings: IExternalTerminalSettings): Promise<number | undefined> {
		const exec = settings.windowsExec || WindowsExternalTerminalService.getDefaultTerminalWindows();
		const wt = await WindowsExternalTerminalService.getWtExePath();

		return new Promise<number | undefined>((resolve, reject) => {

			const title = `"${dir} - ${TERMINAL_TITLE}"`;
			const command = `"${args.join('" "')}" & pause`; // use '|' to only pause on non-zero exit code

			// merge environment variables into a copy of the process.env
			const env = Object.assign({}, getSanitizedEnvironment(process), envVars);

			// delete environment variables that have a null value
			Object.keys(env).filter(v => env[v] === null).forEach(key => delete env[key]);

			const options = {
				cwd: dir,
				env: env,
				windowsVerbatimArguments: true
			};

			let spawnExec: string;
			let cmdArgs: string[];

			if (path.basename(exec, '.exe') === 'wt') {
				// Handle Windows Terminal specially; -d to set the cwd and run a cmd.exe instance
				// inside it
				spawnExec = exec;
				cmdArgs = ['-d', '.', WindowsExternalTerminalService.CMD, '/c', command];
			} else if (wt) {
				// prefer to use the window terminal to spawn if it's available instead
				// of start, since that allows ctrl+c handling (#81322)
				spawnExec = wt;
				cmdArgs = ['-d', '.', exec, '/c', command];
			} else {
				spawnExec = WindowsExternalTerminalService.CMD;
				cmdArgs = ['/c', 'start', title, '/wait', exec, '/c', `"${command}"`];
			}

			const cmd = cp.spawn(spawnExec, cmdArgs, options);

			cmd.on('error', err => {
				reject(improveError(err));
			});

			resolve(undefined);
		});
	}

	public static getDefaultTerminalWindows(): string {
		if (!WindowsExternalTerminalService._DEFAULT_TERMINAL_WINDOWS) {
			const isWoW64 = !!process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432');
			WindowsExternalTerminalService._DEFAULT_TERMINAL_WINDOWS = `${process.env.windir ? process.env.windir : 'C:\\Windows'}\\${isWoW64 ? 'Sysnative' : 'System32'}\\cmd.exe`;
		}
		return WindowsExternalTerminalService._DEFAULT_TERMINAL_WINDOWS;
	}

	@memoize
	private static async getWtExePath() {
		try {
			return await processes.findExecutable('wt');
		} catch {
			return undefined;
		}
	}
}

export class MacExternalTerminalService extends ExternalTerminalService implements IExternalTerminalService {
	private static readonly OSASCRIPT = '/usr/bin/osascript';	// osascript is the AppleScript interpreter on OS X

	public openTerminal(configuration: IExternalTerminalSettings, cwd?: string): Promise<void> {
		return this.spawnTerminal(cp, configuration, cwd);
	}

	public runInTerminal(title: string, dir: string, args: string[], envVars: ITerminalEnvironment, settings: IExternalTerminalSettings): Promise<number | undefined> {

		const terminalApp = settings.osxExec || DEFAULT_TERMINAL_OSX;

		return new Promise<number | undefined>((resolve, reject) => {

			if (terminalApp === DEFAULT_TERMINAL_OSX || terminalApp === 'iTerm.app') {

				// On OS X we launch an AppleScript that creates (or reuses) a Terminal window
				// and then launches the program inside that window.

				const script = terminalApp === DEFAULT_TERMINAL_OSX ? 'TerminalHelper' : 'iTermHelper';
				const scriptpath = FileAccess.asFileUri(`vs/workbench/contrib/externalTerminal/node/${script}.scpt`).fsPath;

				const osaArgs = [
					scriptpath,
					'-t', title || TERMINAL_TITLE,
					'-w', dir,
				];

				for (const a of args) {
					osaArgs.push('-a');
					osaArgs.push(a);
				}

				if (envVars) {
					// merge environment variables into a copy of the process.env
					const env = Object.assign({}, getSanitizedEnvironment(process), envVars);

					for (const key in env) {
						const value = env[key];
						if (value === null) {
							osaArgs.push('-u');
							osaArgs.push(key);
						} else {
							osaArgs.push('-e');
							osaArgs.push(`${key}=${value}`);
						}
					}
				}

				let stderr = '';
				const osa = cp.spawn(MacExternalTerminalService.OSASCRIPT, osaArgs);
				osa.on('error', err => {
					reject(improveError(err));
				});
				osa.stderr.on('data', (data) => {
					stderr += data.toString();
				});
				osa.on('exit', (code: number) => {
					if (code === 0) {	// OK
						resolve(undefined);
					} else {
						if (stderr) {
							const lines = stderr.split('\n', 1);
							reject(new Error(lines[0]));
						} else {
							reject(new Error(nls.localize('mac.terminal.script.failed', "Script '{0}' failed with exit code {1}", script, code)));
						}
					}
				});
			} else {
				reject(new Error(nls.localize('mac.terminal.type.not.supported', "'{0}' not supported", terminalApp)));
			}
		});
	}

	spawnTerminal(spawner: typeof cp, configuration: IExternalTerminalSettings, cwd?: string): Promise<void> {
		const terminalApp = configuration.osxExec || DEFAULT_TERMINAL_OSX;

		return new Promise<void>((c, e) => {
			const args = ['-a', terminalApp];
			if (cwd) {
				args.push(cwd);
			}
			const env = getSanitizedEnvironment(process);
			const child = spawner.spawn('/usr/bin/open', args, { cwd, env });
			child.on('error', e);
			child.on('exit', () => c());
		});
	}
}

export class LinuxExternalTerminalService extends ExternalTerminalService implements IExternalTerminalService {

	private static readonly WAIT_MESSAGE = nls.localize('press.any.key', "Press any key to continue...");

	public openTerminal(configuration: IExternalTerminalSettings, cwd?: string): Promise<void> {
		return this.spawnTerminal(cp, configuration, cwd);
	}

	public runInTerminal(title: string, dir: string, args: string[], envVars: ITerminalEnvironment, settings: IExternalTerminalSettings): Promise<number | undefined> {

		const execPromise = settings.linuxExec ? Promise.resolve(settings.linuxExec) : LinuxExternalTerminalService.getDefaultTerminalLinuxReady();

		return new Promise<number | undefined>((resolve, reject) => {

			const termArgs: string[] = [];
			//termArgs.push('--title');
			//termArgs.push(`"${TERMINAL_TITLE}"`);
			execPromise.then(exec => {
				if (exec.indexOf('gnome-terminal') >= 0) {
					termArgs.push('-x');
				} else {
					termArgs.push('-e');
				}
				termArgs.push('bash');
				termArgs.push('-c');

				const bashCommand = `${quote(args)}; echo; read -p "${LinuxExternalTerminalService.WAIT_MESSAGE}" -n1;`;
				termArgs.push(`''${bashCommand}''`);	// wrapping argument in two sets of ' because node is so "friendly" that it removes one set...


				// merge environment variables into a copy of the process.env
				const env = Object.assign({}, getSanitizedEnvironment(process), envVars);

				// delete environment variables that have a null value
				Object.keys(env).filter(v => env[v] === null).forEach(key => delete env[key]);

				const options = {
					cwd: dir,
					env: env
				};

				let stderr = '';
				const cmd = cp.spawn(exec, termArgs, options);
				cmd.on('error', err => {
					reject(improveError(err));
				});
				cmd.stderr.on('data', (data) => {
					stderr += data.toString();
				});
				cmd.on('exit', (code: number) => {
					if (code === 0) {	// OK
						resolve(undefined);
					} else {
						if (stderr) {
							const lines = stderr.split('\n', 1);
							reject(new Error(lines[0]));
						} else {
							reject(new Error(nls.localize('linux.term.failed', "'{0}' failed with exit code {1}", exec, code)));
						}
					}
				});
			});
		});
	}

	private static _DEFAULT_TERMINAL_LINUX_READY: Promise<string>;

	public static async getDefaultTerminalLinuxReady(): Promise<string> {
		if (!LinuxExternalTerminalService._DEFAULT_TERMINAL_LINUX_READY) {
			if (!env.isLinux) {
				LinuxExternalTerminalService._DEFAULT_TERMINAL_LINUX_READY = Promise.resolve('xterm');
			} else {
				const isDebian = await pfs.Promises.exists('/etc/debian_version');
				LinuxExternalTerminalService._DEFAULT_TERMINAL_LINUX_READY = new Promise<string>(r => {
					if (isDebian) {
						r('x-terminal-emulator');
					} else if (process.env.DESKTOP_SESSION === 'gnome' || process.env.DESKTOP_SESSION === 'gnome-classic') {
						r('gnome-terminal');
					} else if (process.env.DESKTOP_SESSION === 'kde-plasma') {
						r('konsole');
					} else if (process.env.COLORTERM) {
						r(process.env.COLORTERM);
					} else if (process.env.TERM) {
						r(process.env.TERM);
					} else {
						r('xterm');
					}
				});
			}
		}
		return LinuxExternalTerminalService._DEFAULT_TERMINAL_LINUX_READY;
	}

	spawnTerminal(spawner: typeof cp, configuration: IExternalTerminalSettings, cwd?: string): Promise<void> {
		const execPromise = configuration.linuxExec ? Promise.resolve(configuration.linuxExec) : LinuxExternalTerminalService.getDefaultTerminalLinuxReady();

		return new Promise<void>((c, e) => {
			execPromise.then(exec => {
				const env = getSanitizedEnvironment(process);
				const child = spawner.spawn(exec, [], { cwd, env });
				child.on('error', e);
				child.on('exit', () => c());
			});
		});
	}
}

function getSanitizedEnvironment(process: NodeJS.Process) {
	const env = { ...process.env };
	sanitizeProcessEnvironment(env);
	return env;
}

/**
 * tries to turn OS errors into more meaningful error messages
 */
function improveError(err: Error & { errno?: string; path?: string }): Error {
	if (err.errno === 'ENOENT' && err.path) {
		return new Error(nls.localize('ext.term.app.not.found', "can't find terminal application '{0}'", err.path));
	}
	return err;
}

/**
 * Quote args if necessary and combine into a space separated string.
 */
function quote(args: string[]): string {
	let r = '';
	for (const a of args) {
		if (a.indexOf(' ') >= 0) {
			r += '"' + a + '"';
		} else {
			r += a;
		}
		r += ' ';
	}
	return r;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/externalTerminal/test/node/externalTerminalService.test.ts]---
Location: vscode-main/src/vs/platform/externalTerminal/test/node/externalTerminalService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual, strictEqual } from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { DEFAULT_TERMINAL_OSX, IExternalTerminalConfiguration } from '../../common/externalTerminal.js';
import { LinuxExternalTerminalService, MacExternalTerminalService, WindowsExternalTerminalService } from '../../node/externalTerminalService.js';

const mockConfig = Object.freeze<IExternalTerminalConfiguration>({
	terminal: {
		explorerKind: 'external',
		external: {
			windowsExec: 'testWindowsShell',
			osxExec: 'testOSXShell',
			linuxExec: 'testLinuxShell'
		}
	}
});

suite('ExternalTerminalService', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test(`WinTerminalService - uses terminal from configuration`, done => {
		const testShell = 'cmd';
		const testCwd = 'path/to/workspace';
		const mockSpawner: any = {
			spawn: (command: any, args: any, opts: any) => {
				strictEqual(command, testShell, 'shell should equal expected');
				strictEqual(args[args.length - 1], mockConfig.terminal.external.windowsExec);
				strictEqual(opts.cwd, testCwd);
				done();
				return {
					on: (evt: any) => evt
				};
			}
		};
		const testService = new WindowsExternalTerminalService();
		testService.spawnTerminal(
			mockSpawner,
			mockConfig.terminal.external,
			testShell,
			testCwd
		);
	});

	test(`WinTerminalService - uses default terminal when configuration.terminal.external.windowsExec is undefined`, done => {
		const testShell = 'cmd';
		const testCwd = 'path/to/workspace';
		const mockSpawner: any = {
			spawn: (command: any, args: any, opts: any) => {
				strictEqual(args[args.length - 1], WindowsExternalTerminalService.getDefaultTerminalWindows());
				done();
				return {
					on: (evt: any) => evt
				};
			}
		};
		mockConfig.terminal.external.windowsExec = undefined;
		const testService = new WindowsExternalTerminalService();
		testService.spawnTerminal(
			mockSpawner,
			mockConfig.terminal.external,
			testShell,
			testCwd
		);
	});

	test(`WinTerminalService - cwd is correct regardless of case`, done => {
		const testShell = 'cmd';
		const testCwd = 'c:/foo';
		const mockSpawner: any = {
			spawn: (command: any, args: any, opts: any) => {
				strictEqual(opts.cwd, 'C:/foo', 'cwd should be uppercase regardless of the case that\'s passed in');
				done();
				return {
					on: (evt: any) => evt
				};
			}
		};
		const testService = new WindowsExternalTerminalService();
		testService.spawnTerminal(
			mockSpawner,
			mockConfig.terminal.external,
			testShell,
			testCwd
		);
	});

	test(`WinTerminalService - cmder should be spawned differently`, done => {
		const testShell = 'cmd';
		const testCwd = 'c:/foo';
		const mockSpawner: any = {
			spawn: (command: any, args: any, opts: any) => {
				deepStrictEqual(args, ['C:/foo']);
				strictEqual(opts, undefined);
				done();
				return { on: (evt: any) => evt };
			}
		};
		const testService = new WindowsExternalTerminalService();
		testService.spawnTerminal(
			mockSpawner,
			{ windowsExec: 'cmder' },
			testShell,
			testCwd
		);
	});

	test(`WinTerminalService - windows terminal should open workspace directory`, done => {
		const testShell = 'wt';
		const testCwd = 'c:/foo';
		const mockSpawner: any = {
			spawn: (command: any, args: any, opts: any) => {
				strictEqual(opts.cwd, 'C:/foo');
				done();
				return { on: (evt: any) => evt };
			}
		};
		const testService = new WindowsExternalTerminalService();
		testService.spawnTerminal(
			mockSpawner,
			mockConfig.terminal.external,
			testShell,
			testCwd
		);
	});

	test(`MacTerminalService - uses terminal from configuration`, done => {
		const testCwd = 'path/to/workspace';
		const mockSpawner: any = {
			spawn: (command: any, args: any, opts: any) => {
				strictEqual(args[1], mockConfig.terminal.external.osxExec);
				done();
				return {
					on: (evt: any) => evt
				};
			}
		};
		const testService = new MacExternalTerminalService();
		testService.spawnTerminal(
			mockSpawner,
			mockConfig.terminal.external,
			testCwd
		);
	});

	test(`MacTerminalService - uses default terminal when configuration.terminal.external.osxExec is undefined`, done => {
		const testCwd = 'path/to/workspace';
		const mockSpawner: any = {
			spawn: (command: any, args: any, opts: any) => {
				strictEqual(args[1], DEFAULT_TERMINAL_OSX);
				done();
				return {
					on: (evt: any) => evt
				};
			}
		};
		const testService = new MacExternalTerminalService();
		testService.spawnTerminal(
			mockSpawner,
			{ osxExec: undefined },
			testCwd
		);
	});

	test(`LinuxTerminalService - uses terminal from configuration`, done => {
		const testCwd = 'path/to/workspace';
		const mockSpawner: any = {
			spawn: (command: any, args: any, opts: any) => {
				strictEqual(command, mockConfig.terminal.external.linuxExec);
				strictEqual(opts.cwd, testCwd);
				done();
				return {
					on: (evt: any) => evt
				};
			}
		};
		const testService = new LinuxExternalTerminalService();
		testService.spawnTerminal(
			mockSpawner,
			mockConfig.terminal.external,
			testCwd
		);
	});

	test(`LinuxTerminalService - uses default terminal when configuration.terminal.external.linuxExec is undefined`, done => {
		LinuxExternalTerminalService.getDefaultTerminalLinuxReady().then(defaultTerminalLinux => {
			const testCwd = 'path/to/workspace';
			const mockSpawner: any = {
				spawn: (command: any, args: any, opts: any) => {
					strictEqual(command, defaultTerminalLinux);
					done();
					return {
						on: (evt: any) => evt
					};
				}
			};
			mockConfig.terminal.external.linuxExec = undefined;
			const testService = new LinuxExternalTerminalService();
			testService.spawnTerminal(
				mockSpawner,
				mockConfig.terminal.external,
				testCwd
			);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/browser/htmlFileSystemProvider.ts]---
Location: vscode-main/src/vs/platform/files/browser/htmlFileSystemProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../nls.js';
import { URI } from '../../../base/common/uri.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import { basename, extname, normalize } from '../../../base/common/path.js';
import { isLinux } from '../../../base/common/platform.js';
import { extUri, extUriIgnorePathCase, joinPath } from '../../../base/common/resources.js';
import { newWriteableStream, ReadableStreamEvents } from '../../../base/common/stream.js';
import { createFileSystemProviderError, IFileDeleteOptions, IFileOverwriteOptions, IFileReadStreamOptions, FileSystemProviderCapabilities, FileSystemProviderError, FileSystemProviderErrorCode, FileType, IFileWriteOptions, IFileSystemProviderWithFileReadStreamCapability, IFileSystemProviderWithFileReadWriteCapability, IStat, IWatchOptions, IFileChange, FileChangeType } from '../common/files.js';
import { FileSystemObserverRecord, WebFileSystemAccess, WebFileSystemObserver } from './webFileSystemAccess.js';
import { IndexedDB } from '../../../base/browser/indexedDB.js';
import { ILogService, LogLevel } from '../../log/common/log.js';

export class HTMLFileSystemProvider extends Disposable implements IFileSystemProviderWithFileReadWriteCapability, IFileSystemProviderWithFileReadStreamCapability {

	//#region Events (unsupported)

	readonly onDidChangeCapabilities = Event.None;

	//#endregion

	//#region File Capabilities

	private extUri = isLinux ? extUri : extUriIgnorePathCase;

	private _capabilities: FileSystemProviderCapabilities | undefined;
	get capabilities(): FileSystemProviderCapabilities {
		if (!this._capabilities) {
			this._capabilities =
				FileSystemProviderCapabilities.FileReadWrite |
				FileSystemProviderCapabilities.FileReadStream;

			if (isLinux) {
				this._capabilities |= FileSystemProviderCapabilities.PathCaseSensitive;
			}
		}

		return this._capabilities;
	}

	//#endregion


	constructor(
		private indexedDB: IndexedDB | undefined,
		private readonly store: string,
		private logService: ILogService
	) {
		super();
	}

	//#region File Metadata Resolving

	async stat(resource: URI): Promise<IStat> {
		try {
			const handle = await this.getHandle(resource);
			if (!handle) {
				throw this.createFileSystemProviderError(resource, 'No such file or directory, stat', FileSystemProviderErrorCode.FileNotFound);
			}

			if (WebFileSystemAccess.isFileSystemFileHandle(handle)) {
				const file = await handle.getFile();

				return {
					type: FileType.File,
					mtime: file.lastModified,
					ctime: 0,
					size: file.size
				};
			}

			return {
				type: FileType.Directory,
				mtime: 0,
				ctime: 0,
				size: 0
			};
		} catch (error) {
			throw this.toFileSystemProviderError(error);
		}
	}

	async readdir(resource: URI): Promise<[string, FileType][]> {
		try {
			const handle = await this.getDirectoryHandle(resource);
			if (!handle) {
				throw this.createFileSystemProviderError(resource, 'No such file or directory, readdir', FileSystemProviderErrorCode.FileNotFound);
			}

			const result: [string, FileType][] = [];

			for await (const [name, child] of handle) {
				result.push([name, WebFileSystemAccess.isFileSystemFileHandle(child) ? FileType.File : FileType.Directory]);
			}

			return result;
		} catch (error) {
			throw this.toFileSystemProviderError(error);
		}
	}

	//#endregion

	//#region File Reading/Writing

	readFileStream(resource: URI, opts: IFileReadStreamOptions, token: CancellationToken): ReadableStreamEvents<Uint8Array> {
		const stream = newWriteableStream<Uint8Array>(data => VSBuffer.concat(data.map(data => VSBuffer.wrap(data))).buffer, {
			// Set a highWaterMark to prevent the stream
			// for file upload to produce large buffers
			// in-memory
			highWaterMark: 10
		});

		(async () => {
			try {
				const handle = await this.getFileHandle(resource);
				if (!handle) {
					throw this.createFileSystemProviderError(resource, 'No such file or directory, readFile', FileSystemProviderErrorCode.FileNotFound);
				}

				const file = await handle.getFile();

				// Partial file: implemented simply via `readFile`
				if (typeof opts.length === 'number' || typeof opts.position === 'number') {
					let buffer = new Uint8Array(await file.arrayBuffer());

					if (typeof opts?.position === 'number') {
						buffer = buffer.slice(opts.position);
					}

					if (typeof opts?.length === 'number') {
						buffer = buffer.slice(0, opts.length);
					}

					stream.end(buffer);
				}

				// Entire file
				else {
					const reader: ReadableStreamDefaultReader<Uint8Array> = file.stream().getReader();

					let res = await reader.read();
					while (!res.done) {
						if (token.isCancellationRequested) {
							break;
						}

						// Write buffer into stream but make sure to wait
						// in case the `highWaterMark` is reached
						await stream.write(res.value);

						if (token.isCancellationRequested) {
							break;
						}

						res = await reader.read();
					}
					stream.end(undefined);
				}
			} catch (error) {
				stream.error(this.toFileSystemProviderError(error));
				stream.end();
			}
		})();

		return stream;
	}

	async readFile(resource: URI): Promise<Uint8Array> {
		try {
			const handle = await this.getFileHandle(resource);
			if (!handle) {
				throw this.createFileSystemProviderError(resource, 'No such file or directory, readFile', FileSystemProviderErrorCode.FileNotFound);
			}

			const file = await handle.getFile();

			return new Uint8Array(await file.arrayBuffer());
		} catch (error) {
			throw this.toFileSystemProviderError(error);
		}
	}

	async writeFile(resource: URI, content: Uint8Array, opts: IFileWriteOptions): Promise<void> {
		try {
			let handle = await this.getFileHandle(resource);

			// Validate target unless { create: true, overwrite: true }
			if (!opts.create || !opts.overwrite) {
				if (handle) {
					if (!opts.overwrite) {
						throw this.createFileSystemProviderError(resource, 'File already exists, writeFile', FileSystemProviderErrorCode.FileExists);
					}
				} else {
					if (!opts.create) {
						throw this.createFileSystemProviderError(resource, 'No such file, writeFile', FileSystemProviderErrorCode.FileNotFound);
					}
				}
			}

			// Create target as needed
			if (!handle) {
				const parent = await this.getDirectoryHandle(this.extUri.dirname(resource));
				if (!parent) {
					throw this.createFileSystemProviderError(resource, 'No such parent directory, writeFile', FileSystemProviderErrorCode.FileNotFound);
				}

				handle = await parent.getFileHandle(this.extUri.basename(resource), { create: true });
				if (!handle) {
					throw this.createFileSystemProviderError(resource, 'Unable to create file , writeFile', FileSystemProviderErrorCode.Unknown);
				}
			}

			// Write to target overwriting any existing contents
			const writable = await handle.createWritable();
			await writable.write(content as Uint8Array<ArrayBuffer>);
			await writable.close();
		} catch (error) {
			throw this.toFileSystemProviderError(error);
		}
	}

	//#endregion

	//#region Move/Copy/Delete/Create Folder

	async mkdir(resource: URI): Promise<void> {
		try {
			const parent = await this.getDirectoryHandle(this.extUri.dirname(resource));
			if (!parent) {
				throw this.createFileSystemProviderError(resource, 'No such parent directory, mkdir', FileSystemProviderErrorCode.FileNotFound);
			}

			await parent.getDirectoryHandle(this.extUri.basename(resource), { create: true });
		} catch (error) {
			throw this.toFileSystemProviderError(error);
		}
	}

	async delete(resource: URI, opts: IFileDeleteOptions): Promise<void> {
		try {
			const parent = await this.getDirectoryHandle(this.extUri.dirname(resource));
			if (!parent) {
				throw this.createFileSystemProviderError(resource, 'No such parent directory, delete', FileSystemProviderErrorCode.FileNotFound);
			}

			return parent.removeEntry(this.extUri.basename(resource), { recursive: opts.recursive });
		} catch (error) {
			throw this.toFileSystemProviderError(error);
		}
	}

	async rename(from: URI, to: URI, opts: IFileOverwriteOptions): Promise<void> {
		try {
			if (this.extUri.isEqual(from, to)) {
				return; // no-op if the paths are the same
			}

			// Implement file rename by write + delete
			const fileHandle = await this.getFileHandle(from);
			if (fileHandle) {
				const file = await fileHandle.getFile();
				const contents = new Uint8Array(await file.arrayBuffer());

				await this.writeFile(to, contents, { create: true, overwrite: opts.overwrite, unlock: false, atomic: false });
				await this.delete(from, { recursive: false, useTrash: false, atomic: false });
			}

			// File API does not support any real rename otherwise
			else {
				throw this.createFileSystemProviderError(from, localize('fileSystemRenameError', "Rename is only supported for files."), FileSystemProviderErrorCode.Unavailable);
			}
		} catch (error) {
			throw this.toFileSystemProviderError(error);
		}
	}

	//#endregion

	//#region File Watching (unsupported)

	private readonly _onDidChangeFileEmitter = this._register(new Emitter<readonly IFileChange[]>());
	readonly onDidChangeFile = this._onDidChangeFileEmitter.event;

	watch(resource: URI, opts: IWatchOptions): IDisposable {
		const disposables = new DisposableStore();

		this.doWatch(resource, opts, disposables).catch(error => this.logService.error(`[File Watcher ('FileSystemObserver')] Error: ${error} (${resource})`));

		return disposables;
	}

	private async doWatch(resource: URI, opts: IWatchOptions, disposables: DisposableStore): Promise<void> {
		if (!WebFileSystemObserver.supported(globalThis)) {
			return;
		}

		const handle = await this.getHandle(resource);
		if (!handle || disposables.isDisposed) {
			return;
		}

		// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
		const observer = new (globalThis as any).FileSystemObserver((records: FileSystemObserverRecord[]) => {
			if (disposables.isDisposed) {
				return;
			}

			const events: IFileChange[] = [];
			for (const record of records) {
				if (this.logService.getLevel() === LogLevel.Trace) {
					this.logService.trace(`[File Watcher ('FileSystemObserver')] [${record.type}] ${joinPath(resource, ...record.relativePathComponents)}`);
				}

				switch (record.type) {
					case 'appeared':
						events.push({ resource: joinPath(resource, ...record.relativePathComponents), type: FileChangeType.ADDED });
						break;
					case 'disappeared':
						events.push({ resource: joinPath(resource, ...record.relativePathComponents), type: FileChangeType.DELETED });
						break;
					case 'modified':
						events.push({ resource: joinPath(resource, ...record.relativePathComponents), type: FileChangeType.UPDATED });
						break;
					case 'errored':
						this.logService.trace(`[File Watcher ('FileSystemObserver')] errored, disposing observer (${resource})`);
						disposables.dispose();
				}
			}

			if (events.length) {
				this._onDidChangeFileEmitter.fire(events);
			}
		});

		try {
			await observer.observe(handle, opts.recursive ? { recursive: true } : undefined);
		} finally {
			if (disposables.isDisposed) {
				observer.disconnect();
			} else {
				disposables.add(toDisposable(() => observer.disconnect()));
			}
		}
	}

	//#endregion

	//#region File/Directoy Handle Registry

	private readonly _files = new Map<string, FileSystemFileHandle>();
	private readonly _directories = new Map<string, FileSystemDirectoryHandle>();

	registerFileHandle(handle: FileSystemFileHandle): Promise<URI> {
		return this.registerHandle(handle, this._files);
	}

	registerDirectoryHandle(handle: FileSystemDirectoryHandle): Promise<URI> {
		return this.registerHandle(handle, this._directories);
	}

	get directories(): Iterable<FileSystemDirectoryHandle> {
		return this._directories.values();
	}

	private async registerHandle(handle: FileSystemHandle, map: Map<string, FileSystemHandle>): Promise<URI> {
		let handleId = `/${handle.name}`;

		// Compute a valid handle ID in case this exists already
		if (map.has(handleId) && !await map.get(handleId)?.isSameEntry(handle)) {
			const fileExt = extname(handle.name);
			const fileName = basename(handle.name, fileExt);

			let handleIdCounter = 1;
			do {
				handleId = `/${fileName}-${handleIdCounter++}${fileExt}`;
			} while (map.has(handleId) && !await map.get(handleId)?.isSameEntry(handle));
		}

		map.set(handleId, handle);

		// Remember in IndexDB for future lookup
		try {
			await this.indexedDB?.runInTransaction(this.store, 'readwrite', objectStore => objectStore.put(handle, handleId));
		} catch (error) {
			this.logService.error(error);
		}

		return URI.from({ scheme: Schemas.file, path: handleId });
	}

	async getHandle(resource: URI): Promise<FileSystemHandle | undefined> {

		// First: try to find a well known handle first
		let handle = await this.doGetHandle(resource);

		// Second: walk up parent directories and resolve handle if possible
		if (!handle) {
			const parent = await this.getDirectoryHandle(this.extUri.dirname(resource));
			if (parent) {
				const name = extUri.basename(resource);
				try {
					handle = await parent.getFileHandle(name);
				} catch (error) {
					try {
						handle = await parent.getDirectoryHandle(name);
					} catch (error) {
						// Ignore
					}
				}
			}
		}

		return handle;
	}

	private async getFileHandle(resource: URI): Promise<FileSystemFileHandle | undefined> {
		const handle = await this.doGetHandle(resource);
		if (handle instanceof FileSystemFileHandle) {
			return handle;
		}

		const parent = await this.getDirectoryHandle(this.extUri.dirname(resource));

		try {
			return await parent?.getFileHandle(extUri.basename(resource));
		} catch (error) {
			return undefined; // guard against possible DOMException
		}
	}

	private async getDirectoryHandle(resource: URI): Promise<FileSystemDirectoryHandle | undefined> {
		const handle = await this.doGetHandle(resource);
		if (handle instanceof FileSystemDirectoryHandle) {
			return handle;
		}

		const parentUri = this.extUri.dirname(resource);
		if (this.extUri.isEqual(parentUri, resource)) {
			return undefined; // return when root is reached to prevent infinite recursion
		}

		const parent = await this.getDirectoryHandle(parentUri);

		try {
			return await parent?.getDirectoryHandle(extUri.basename(resource));
		} catch (error) {
			return undefined; // guard against possible DOMException
		}
	}

	private async doGetHandle(resource: URI): Promise<FileSystemHandle | undefined> {

		// We store file system handles with the `handle.name`
		// and as such require the resource to be on the root
		if (this.extUri.dirname(resource).path !== '/') {
			return undefined;
		}

		const handleId = resource.path.replace(/\/$/, ''); // remove potential slash from the end of the path

		// First: check if we have a known handle stored in memory
		const inMemoryHandle = this._files.get(handleId) ?? this._directories.get(handleId);
		if (inMemoryHandle) {
			return inMemoryHandle;
		}

		// Second: check if we have a persisted handle in IndexedDB
		const persistedHandle = await this.indexedDB?.runInTransaction(this.store, 'readonly', store => store.get(handleId));
		if (WebFileSystemAccess.isFileSystemHandle(persistedHandle)) {
			let hasPermissions = await persistedHandle.queryPermission() === 'granted';
			try {
				if (!hasPermissions) {
					hasPermissions = await persistedHandle.requestPermission() === 'granted';
				}
			} catch (error) {
				this.logService.error(error); // this can fail with a DOMException
			}

			if (hasPermissions) {
				if (WebFileSystemAccess.isFileSystemFileHandle(persistedHandle)) {
					this._files.set(handleId, persistedHandle);
				} else if (WebFileSystemAccess.isFileSystemDirectoryHandle(persistedHandle)) {
					this._directories.set(handleId, persistedHandle);
				}

				return persistedHandle;
			}
		}

		// Third: fail with an error
		throw this.createFileSystemProviderError(resource, 'No file system handle registered', FileSystemProviderErrorCode.Unavailable);
	}

	//#endregion

	private toFileSystemProviderError(error: Error): FileSystemProviderError {
		if (error instanceof FileSystemProviderError) {
			return error; // avoid double conversion
		}

		let code = FileSystemProviderErrorCode.Unknown;
		if (error.name === 'NotAllowedError') {
			error = new Error(localize('fileSystemNotAllowedError', "Insufficient permissions. Please retry and allow the operation."));
			code = FileSystemProviderErrorCode.Unavailable;
		}

		return createFileSystemProviderError(error, code);
	}

	private createFileSystemProviderError(resource: URI, msg: string, code: FileSystemProviderErrorCode): FileSystemProviderError {
		return createFileSystemProviderError(new Error(`${msg} (${normalize(resource.path)})`), code);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/browser/indexedDBFileSystemProvider.ts]---
Location: vscode-main/src/vs/platform/files/browser/indexedDBFileSystemProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Throttler } from '../../../base/common/async.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../base/common/lifecycle.js';
import { ExtUri } from '../../../base/common/resources.js';
import { isString } from '../../../base/common/types.js';
import { URI, UriDto } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { createFileSystemProviderError, FileChangeType, IFileDeleteOptions, IFileOverwriteOptions, FileSystemProviderCapabilities, FileSystemProviderErrorCode, FileType, IFileWriteOptions, IFileChange, IFileSystemProviderWithFileReadWriteCapability, IStat, IWatchOptions } from '../common/files.js';
import { IndexedDB } from '../../../base/browser/indexedDB.js';
import { BroadcastDataChannel } from '../../../base/browser/broadcast.js';

// Standard FS Errors (expected to be thrown in production when invalid FS operations are requested)
const ERR_FILE_NOT_FOUND = createFileSystemProviderError(localize('fileNotExists', "File does not exist"), FileSystemProviderErrorCode.FileNotFound);
const ERR_FILE_IS_DIR = createFileSystemProviderError(localize('fileIsDirectory', "File is Directory"), FileSystemProviderErrorCode.FileIsADirectory);
const ERR_FILE_NOT_DIR = createFileSystemProviderError(localize('fileNotDirectory', "File is not a directory"), FileSystemProviderErrorCode.FileNotADirectory);
const ERR_DIR_NOT_EMPTY = createFileSystemProviderError(localize('dirIsNotEmpty', "Directory is not empty"), FileSystemProviderErrorCode.Unknown);
const ERR_FILE_EXCEEDS_STORAGE_QUOTA = createFileSystemProviderError(localize('fileExceedsStorageQuota', "File exceeds available storage quota"), FileSystemProviderErrorCode.FileExceedsStorageQuota);

// Arbitrary Internal Errors
const ERR_UNKNOWN_INTERNAL = (message: string) => createFileSystemProviderError(localize('internal', "Internal error occurred in IndexedDB File System Provider. ({0})", message), FileSystemProviderErrorCode.Unknown);

type DirEntry = [string, FileType];

type IndexedDBFileSystemEntry =
	| {
		path: string;
		type: FileType.Directory;
		children: Map<string, IndexedDBFileSystemNode>;
	}
	| {
		path: string;
		type: FileType.File;
		size: number | undefined;
	};

class IndexedDBFileSystemNode {
	public type: FileType;

	constructor(private entry: IndexedDBFileSystemEntry) {
		this.type = entry.type;
	}

	read(path: string): IndexedDBFileSystemEntry | undefined {
		return this.doRead(path.split('/').filter(p => p.length));
	}

	private doRead(pathParts: string[]): IndexedDBFileSystemEntry | undefined {
		if (pathParts.length === 0) { return this.entry; }
		if (this.entry.type !== FileType.Directory) {
			throw ERR_UNKNOWN_INTERNAL('Internal error reading from IndexedDBFSNode -- expected directory at ' + this.entry.path);
		}
		const next = this.entry.children.get(pathParts[0]);

		if (!next) { return undefined; }
		return next.doRead(pathParts.slice(1));
	}

	delete(path: string): void {
		const toDelete = path.split('/').filter(p => p.length);
		if (toDelete.length === 0) {
			if (this.entry.type !== FileType.Directory) {
				throw ERR_UNKNOWN_INTERNAL(`Internal error deleting from IndexedDBFSNode. Expected root entry to be directory`);
			}
			this.entry.children.clear();
		} else {
			return this.doDelete(toDelete, path);
		}
	}

	private doDelete(pathParts: string[], originalPath: string): void {
		if (pathParts.length === 0) {
			throw ERR_UNKNOWN_INTERNAL(`Internal error deleting from IndexedDBFSNode -- got no deletion path parts (encountered while deleting ${originalPath})`);
		}
		else if (this.entry.type !== FileType.Directory) {
			throw ERR_UNKNOWN_INTERNAL('Internal error deleting from IndexedDBFSNode -- expected directory at ' + this.entry.path);
		}
		else if (pathParts.length === 1) {
			this.entry.children.delete(pathParts[0]);
		}
		else {
			const next = this.entry.children.get(pathParts[0]);
			if (!next) {
				throw ERR_UNKNOWN_INTERNAL('Internal error deleting from IndexedDBFSNode -- expected entry at ' + this.entry.path + '/' + next);
			}
			next.doDelete(pathParts.slice(1), originalPath);
		}
	}

	add(path: string, entry: { type: 'file'; size?: number } | { type: 'dir' }) {
		this.doAdd(path.split('/').filter(p => p.length), entry, path);
	}

	private doAdd(pathParts: string[], entry: { type: 'file'; size?: number } | { type: 'dir' }, originalPath: string) {
		if (pathParts.length === 0) {
			throw ERR_UNKNOWN_INTERNAL(`Internal error creating IndexedDBFSNode -- adding empty path (encountered while adding ${originalPath})`);
		}
		else if (this.entry.type !== FileType.Directory) {
			throw ERR_UNKNOWN_INTERNAL(`Internal error creating IndexedDBFSNode -- parent is not a directory (encountered while adding ${originalPath})`);
		}
		else if (pathParts.length === 1) {
			const next = pathParts[0];
			const existing = this.entry.children.get(next);
			if (entry.type === 'dir') {
				if (existing?.entry.type === FileType.File) {
					throw ERR_UNKNOWN_INTERNAL(`Internal error creating IndexedDBFSNode -- overwriting file with directory: ${this.entry.path}/${next} (encountered while adding ${originalPath})`);
				}
				this.entry.children.set(next, existing ?? new IndexedDBFileSystemNode({
					type: FileType.Directory,
					path: this.entry.path + '/' + next,
					children: new Map(),
				}));
			} else {
				if (existing?.entry.type === FileType.Directory) {
					throw ERR_UNKNOWN_INTERNAL(`Internal error creating IndexedDBFSNode -- overwriting directory with file: ${this.entry.path}/${next} (encountered while adding ${originalPath})`);
				}
				this.entry.children.set(next, new IndexedDBFileSystemNode({
					type: FileType.File,
					path: this.entry.path + '/' + next,
					size: entry.size,
				}));
			}
		}
		else if (pathParts.length > 1) {
			const next = pathParts[0];
			let childNode = this.entry.children.get(next);
			if (!childNode) {
				childNode = new IndexedDBFileSystemNode({
					children: new Map(),
					path: this.entry.path + '/' + next,
					type: FileType.Directory
				});
				this.entry.children.set(next, childNode);
			}
			else if (childNode.type === FileType.File) {
				throw ERR_UNKNOWN_INTERNAL(`Internal error creating IndexedDBFSNode -- overwriting file entry with directory: ${this.entry.path}/${next} (encountered while adding ${originalPath})`);
			}
			childNode.doAdd(pathParts.slice(1), entry, originalPath);
		}
	}

	print(indentation = '') {
		console.log(indentation + this.entry.path);
		if (this.entry.type === FileType.Directory) {
			this.entry.children.forEach(child => child.print(indentation + ' '));
		}
	}
}

export class IndexedDBFileSystemProvider extends Disposable implements IFileSystemProviderWithFileReadWriteCapability {

	readonly capabilities: FileSystemProviderCapabilities =
		FileSystemProviderCapabilities.FileReadWrite
		| FileSystemProviderCapabilities.PathCaseSensitive;
	readonly onDidChangeCapabilities: Event<void> = Event.None;

	private readonly extUri = new ExtUri(() => false) /* Case Sensitive */;

	private readonly changesBroadcastChannel: BroadcastDataChannel<UriDto<IFileChange>[]> | undefined;
	private readonly _onDidChangeFile = this._register(new Emitter<readonly IFileChange[]>());
	readonly onDidChangeFile: Event<readonly IFileChange[]> = this._onDidChangeFile.event;

	private readonly mtimes = new Map<string, number>();

	private cachedFiletree: Promise<IndexedDBFileSystemNode> | undefined;
	private writeManyThrottler: Throttler;

	constructor(readonly scheme: string, private indexedDB: IndexedDB, private readonly store: string, watchCrossWindowChanges: boolean) {
		super();
		this.writeManyThrottler = new Throttler();

		if (watchCrossWindowChanges) {
			this.changesBroadcastChannel = this._register(new BroadcastDataChannel<UriDto<IFileChange>[]>(`vscode.indexedDB.${scheme}.changes`));
			this._register(this.changesBroadcastChannel.onDidReceiveData(changes => {
				this._onDidChangeFile.fire(changes.map(c => ({ type: c.type, resource: URI.revive(c.resource) })));
			}));
		}
	}

	watch(resource: URI, opts: IWatchOptions): IDisposable {
		return Disposable.None;
	}

	async mkdir(resource: URI): Promise<void> {
		try {
			const resourceStat = await this.stat(resource);
			if (resourceStat.type === FileType.File) {
				throw ERR_FILE_NOT_DIR;
			}
		} catch (error) { /* Ignore */ }
		(await this.getFiletree()).add(resource.path, { type: 'dir' });
	}

	async stat(resource: URI): Promise<IStat> {
		const entry = (await this.getFiletree()).read(resource.path);

		if (entry?.type === FileType.File) {
			return {
				type: FileType.File,
				ctime: 0,
				mtime: this.mtimes.get(resource.toString()) || 0,
				size: entry.size ?? (await this.readFile(resource)).byteLength
			};
		}

		if (entry?.type === FileType.Directory) {
			return {
				type: FileType.Directory,
				ctime: 0,
				mtime: 0,
				size: 0
			};
		}

		throw ERR_FILE_NOT_FOUND;
	}

	async readdir(resource: URI): Promise<DirEntry[]> {
		const entry = (await this.getFiletree()).read(resource.path);
		if (!entry) {
			// Dirs aren't saved to disk, so empty dirs will be lost on reload.
			// Thus we have two options for what happens when you try to read a dir and nothing is found:
			// - Throw FileSystemProviderErrorCode.FileNotFound
			// - Return []
			// We choose to return [] as creating a dir then reading it (even after reload) should not throw an error.
			return [];
		}
		if (entry.type !== FileType.Directory) {
			throw ERR_FILE_NOT_DIR;
		}
		else {
			return [...entry.children.entries()].map(([name, node]) => [name, node.type]);
		}
	}

	async readFile(resource: URI): Promise<Uint8Array> {
		const result = await this.indexedDB.runInTransaction(this.store, 'readonly', objectStore => objectStore.get(resource.path));
		if (result === undefined) {
			throw ERR_FILE_NOT_FOUND;
		}
		const buffer = result instanceof Uint8Array ? result : isString(result) ? VSBuffer.fromString(result).buffer : undefined;
		if (buffer === undefined) {
			throw ERR_UNKNOWN_INTERNAL(`IndexedDB entry at "${resource.path}" in unexpected format`);
		}

		// update cache
		const fileTree = await this.getFiletree();
		fileTree.add(resource.path, { type: 'file', size: buffer.byteLength });

		return buffer;
	}

	async writeFile(resource: URI, content: Uint8Array, opts: IFileWriteOptions): Promise<void> {
		const existing = await this.stat(resource).catch(() => undefined);
		if (existing?.type === FileType.Directory) {
			throw ERR_FILE_IS_DIR;
		}
		await this.bulkWrite([[resource, content]]);
	}

	async rename(from: URI, to: URI, opts: IFileOverwriteOptions): Promise<void> {
		const fileTree = await this.getFiletree();
		const fromEntry = fileTree.read(from.path);
		if (!fromEntry) {
			throw ERR_FILE_NOT_FOUND;
		}

		const toEntry = fileTree.read(to.path);
		if (toEntry) {
			if (!opts.overwrite) {
				throw createFileSystemProviderError('file exists already', FileSystemProviderErrorCode.FileExists);
			}
			if (toEntry.type !== fromEntry.type) {
				throw createFileSystemProviderError('Cannot rename files with different types', FileSystemProviderErrorCode.Unknown);
			}
			// delete the target file if exists
			await this.delete(to, { recursive: true, useTrash: false, atomic: false });
		}

		const toTargetResource = (path: string): URI => this.extUri.joinPath(to, this.extUri.relativePath(from, from.with({ path })) || '');

		const sourceEntries = await this.tree(from);
		const sourceFiles: DirEntry[] = [];
		for (const sourceEntry of sourceEntries) {
			if (sourceEntry[1] === FileType.File) {
				sourceFiles.push(sourceEntry);
			} else if (sourceEntry[1] === FileType.Directory) {
				// add directories to the tree
				fileTree.add(toTargetResource(sourceEntry[0]).path, { type: 'dir' });
			}
		}

		if (sourceFiles.length) {
			const targetFiles: [URI, Uint8Array][] = [];
			const sourceFilesContents = await this.indexedDB.runInTransaction(this.store, 'readonly', objectStore => sourceFiles.map(([path]) => objectStore.get(path)));
			for (let index = 0; index < sourceFiles.length; index++) {
				const content = sourceFilesContents[index] instanceof Uint8Array ? sourceFilesContents[index] : isString(sourceFilesContents[index]) ? VSBuffer.fromString(sourceFilesContents[index]).buffer : undefined;
				if (content) {
					targetFiles.push([toTargetResource(sourceFiles[index][0]), content]);
				}
			}
			await this.bulkWrite(targetFiles);
		}

		await this.delete(from, { recursive: true, useTrash: false, atomic: false });
	}

	async delete(resource: URI, opts: IFileDeleteOptions): Promise<void> {
		let stat: IStat;
		try {
			stat = await this.stat(resource);
		} catch (e) {
			if (e.code === FileSystemProviderErrorCode.FileNotFound) {
				return;
			}
			throw e;
		}

		let toDelete: string[];
		if (opts.recursive) {
			const tree = await this.tree(resource);
			toDelete = tree.map(([path]) => path);
		} else {
			if (stat.type === FileType.Directory && (await this.readdir(resource)).length) {
				throw ERR_DIR_NOT_EMPTY;
			}
			toDelete = [resource.path];
		}
		await this.deleteKeys(toDelete);
		(await this.getFiletree()).delete(resource.path);
		toDelete.forEach(key => this.mtimes.delete(key));
		this.triggerChanges(toDelete.map(path => ({ resource: resource.with({ path }), type: FileChangeType.DELETED })));
	}

	private async tree(resource: URI): Promise<DirEntry[]> {
		const stat = await this.stat(resource);
		const allEntries: DirEntry[] = [[resource.path, stat.type]];
		if (stat.type === FileType.Directory) {
			const dirEntries = await this.readdir(resource);
			for (const [key, type] of dirEntries) {
				const childResource = this.extUri.joinPath(resource, key);
				allEntries.push([childResource.path, type]);
				if (type === FileType.Directory) {
					const childEntries = await this.tree(childResource);
					allEntries.push(...childEntries);
				}
			}
		}
		return allEntries;
	}

	private triggerChanges(changes: IFileChange[]): void {
		if (changes.length) {
			this._onDidChangeFile.fire(changes);

			this.changesBroadcastChannel?.postData(changes);
		}
	}

	private getFiletree(): Promise<IndexedDBFileSystemNode> {
		if (!this.cachedFiletree) {
			this.cachedFiletree = (async () => {
				const rootNode = new IndexedDBFileSystemNode({
					children: new Map(),
					path: '',
					type: FileType.Directory
				});
				const result = await this.indexedDB.runInTransaction(this.store, 'readonly', objectStore => objectStore.getAllKeys());
				const keys = result.map(key => key.toString());
				keys.forEach(key => rootNode.add(key, { type: 'file' }));
				return rootNode;
			})();
		}
		return this.cachedFiletree;
	}

	private async bulkWrite(files: [URI, Uint8Array][]): Promise<void> {
		files.forEach(([resource, content]) => this.fileWriteBatch.push({ content, resource }));
		await this.writeManyThrottler.queue(() => this.writeMany());

		const fileTree = await this.getFiletree();
		for (const [resource, content] of files) {
			fileTree.add(resource.path, { type: 'file', size: content.byteLength });
			this.mtimes.set(resource.toString(), Date.now());
		}

		this.triggerChanges(files.map(([resource]) => ({ resource, type: FileChangeType.UPDATED })));
	}

	private fileWriteBatch: { resource: URI; content: Uint8Array }[] = [];
	private async writeMany() {
		if (this.fileWriteBatch.length) {
			const fileBatch = this.fileWriteBatch.splice(0, this.fileWriteBatch.length);
			try {
				await this.indexedDB.runInTransaction(this.store, 'readwrite', objectStore => fileBatch.map(entry => {
					return objectStore.put(entry.content, entry.resource.path);
				}));
			} catch (ex) {
				if (ex instanceof DOMException && ex.name === 'QuotaExceededError') {
					throw ERR_FILE_EXCEEDS_STORAGE_QUOTA;
				}

				throw ex;
			}
		}
	}

	private async deleteKeys(keys: string[]): Promise<void> {
		if (keys.length) {
			await this.indexedDB.runInTransaction(this.store, 'readwrite', objectStore => keys.map(key => objectStore.delete(key)));
		}
	}

	async reset(): Promise<void> {
		await this.indexedDB.runInTransaction(this.store, 'readwrite', objectStore => objectStore.clear());
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/browser/webFileSystemAccess.ts]---
Location: vscode-main/src/vs/platform/files/browser/webFileSystemAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Typings for the https://wicg.github.io/file-system-access
 *
 * Use `supported(window)` to find out if the browser supports this kind of API.
 */
export namespace WebFileSystemAccess {

	export function supported(obj: typeof globalThis): boolean {
		if (typeof (obj as typeof globalThis & { showDirectoryPicker?: unknown })?.showDirectoryPicker === 'function') {
			return true;
		}

		return false;
	}

	export function isFileSystemHandle(handle: unknown): handle is FileSystemHandle {
		const candidate = handle as FileSystemHandle | undefined;
		if (!candidate) {
			return false;
		}

		return typeof candidate.kind === 'string' && typeof candidate.queryPermission === 'function' && typeof candidate.requestPermission === 'function';
	}

	export function isFileSystemFileHandle(handle: FileSystemHandle): handle is FileSystemFileHandle {
		return handle.kind === 'file';
	}

	export function isFileSystemDirectoryHandle(handle: FileSystemHandle): handle is FileSystemDirectoryHandle {
		return handle.kind === 'directory';
	}
}

export namespace WebFileSystemObserver {

	export function supported(obj: typeof globalThis): boolean {
		return typeof (obj as typeof globalThis & { FileSystemObserver?: unknown })?.FileSystemObserver === 'function';
	}
}

export interface FileSystemObserver {
	new(callback: (records: FileSystemObserverRecord[], observer: FileSystemObserver) => void): FileSystemObserver;

	observe(handle: FileSystemHandle): Promise<void>;
	observe(handle: FileSystemDirectoryHandle, options?: { recursive: boolean }): Promise<void>;

	unobserve(handle: FileSystemHandle): void;
	disconnect(): void;
}

export interface FileSystemObserverRecord {

	/**
	 * The handle passed to the `FileSystemObserver.observe()` function
	 */
	readonly root: FileSystemHandle;

	/**
	 * The handle affected by the file system change
	 */
	readonly changedHandle: FileSystemHandle;

	/**
	 * The path of the `changedHandle` relative to the `root`
	 */
	readonly relativePathComponents: string[];

	/**
	 * "appeared": The file or directory was created or got moved into the root.
	 * "disappeared": The file or directory was deleted or got moved out of the root.
	 * "modified": The file or directory was modified.
	 * "moved": The file or directory was moved within the root.
	 * "unknown": This indicates that zero or more events were missed. Developers should poll the watched directory in response to this.
	 * "errored": The observation is no longer valid. In this case, you may want to stop observing the file system.
	 */
	readonly type: 'appeared' | 'disappeared' | 'modified' | 'moved' | 'unknown' | 'errored';

	/**
	 * The former location of a moved handle. Available only when the type is "moved".
	 */
	readonly relativePathMovedFrom?: string[];
}

export declare class FileSystemObserver {

	constructor(callback: (records: FileSystemObserverRecord[], observer: FileSystemObserver) => void);

	observe(handle: FileSystemHandle, options?: { recursive: boolean }): Promise<void>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/common/diskFileSystemProvider.ts]---
Location: vscode-main/src/vs/platform/files/common/diskFileSystemProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { insert } from '../../../base/common/arrays.js';
import { ThrottledDelayer } from '../../../base/common/async.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { Emitter } from '../../../base/common/event.js';
import { removeTrailingPathSeparator } from '../../../base/common/extpath.js';
import { Disposable, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { normalize } from '../../../base/common/path.js';
import { URI } from '../../../base/common/uri.js';
import { IFileChange, IFileSystemProvider, IWatchOptions } from './files.js';
import { AbstractNonRecursiveWatcherClient, AbstractUniversalWatcherClient, ILogMessage, INonRecursiveWatchRequest, IRecursiveWatcherOptions, isRecursiveWatchRequest, IUniversalWatchRequest, reviveFileChanges } from './watcher.js';
import { ILogService, LogLevel } from '../../log/common/log.js';

export interface IDiskFileSystemProviderOptions {
	watcher?: {

		/**
		 * Extra options for the recursive file watching.
		 */
		recursive?: IRecursiveWatcherOptions;

		/**
		 * Forces all file watch requests to run through a
		 * single universal file watcher, both recursive
		 * and non-recursively.
		 *
		 * Enabling this option might cause some overhead,
		 * specifically the universal file watcher will run
		 * in a separate process given its complexity. Only
		 * enable it when you understand the consequences.
		 */
		forceUniversal?: boolean;
	};
}

export abstract class AbstractDiskFileSystemProvider extends Disposable implements
	Pick<IFileSystemProvider, 'watch'>,
	Pick<IFileSystemProvider, 'onDidChangeFile'>,
	Pick<IFileSystemProvider, 'onDidWatchError'> {

	constructor(
		protected readonly logService: ILogService,
		private readonly options?: IDiskFileSystemProviderOptions
	) {
		super();
	}

	protected readonly _onDidChangeFile = this._register(new Emitter<readonly IFileChange[]>());
	readonly onDidChangeFile = this._onDidChangeFile.event;

	protected readonly _onDidWatchError = this._register(new Emitter<string>());
	readonly onDidWatchError = this._onDidWatchError.event;

	watch(resource: URI, opts: IWatchOptions): IDisposable {
		if (opts.recursive || this.options?.watcher?.forceUniversal) {
			return this.watchUniversal(resource, opts);
		}

		return this.watchNonRecursive(resource, opts);
	}

	private getRefreshWatchersDelay(count: number): number {
		if (count > 200) {
			// If there are many requests to refresh, start to throttle
			// the refresh to reduce pressure. We see potentially thousands
			// of requests coming in on startup repeatedly so we take it easy.
			return 500;
		}

		// By default, use a short delay to keep watchers updating fast but still
		// with a delay so that we can efficiently deduplicate requests or reuse
		// existing watchers.
		return 0;
	}

	//#region File Watching (universal)

	private universalWatcher: AbstractUniversalWatcherClient | undefined;

	private readonly universalWatchRequests: IUniversalWatchRequest[] = [];
	private readonly universalWatchRequestDelayer = this._register(new ThrottledDelayer<void>(this.getRefreshWatchersDelay(this.universalWatchRequests.length)));

	private watchUniversal(resource: URI, opts: IWatchOptions): IDisposable {
		const request = this.toWatchRequest(resource, opts);
		const remove = insert(this.universalWatchRequests, request);

		// Trigger update
		this.refreshUniversalWatchers();

		return toDisposable(() => {

			// Remove from list of paths to watch universally
			remove();

			// Trigger update
			this.refreshUniversalWatchers();
		});
	}

	private toWatchRequest(resource: URI, opts: IWatchOptions): IUniversalWatchRequest {
		const request: IUniversalWatchRequest = {
			path: this.toWatchPath(resource),
			excludes: opts.excludes,
			includes: opts.includes,
			recursive: opts.recursive,
			filter: opts.filter,
			correlationId: opts.correlationId
		};

		if (isRecursiveWatchRequest(request)) {

			// Adjust for polling
			const usePolling = this.options?.watcher?.recursive?.usePolling;
			if (usePolling === true) {
				request.pollingInterval = this.options?.watcher?.recursive?.pollingInterval ?? 5000;
			} else if (Array.isArray(usePolling)) {
				if (usePolling.includes(request.path)) {
					request.pollingInterval = this.options?.watcher?.recursive?.pollingInterval ?? 5000;
				}
			}
		}

		return request;
	}

	private refreshUniversalWatchers(): void {
		this.universalWatchRequestDelayer.trigger(() => {
			return this.doRefreshUniversalWatchers();
		}, this.getRefreshWatchersDelay(this.universalWatchRequests.length)).catch(error => onUnexpectedError(error));
	}

	private doRefreshUniversalWatchers(): Promise<void> {

		// Create watcher if this is the first time
		if (!this.universalWatcher) {
			this.universalWatcher = this._register(this.createUniversalWatcher(
				changes => this._onDidChangeFile.fire(reviveFileChanges(changes)),
				msg => this.onWatcherLogMessage(msg),
				this.logService.getLevel() === LogLevel.Trace
			));

			// Apply log levels dynamically
			this._register(this.logService.onDidChangeLogLevel(() => {
				this.universalWatcher?.setVerboseLogging(this.logService.getLevel() === LogLevel.Trace);
			}));
		}

		// Ask to watch the provided paths
		return this.universalWatcher.watch(this.universalWatchRequests);
	}

	protected abstract createUniversalWatcher(
		onChange: (changes: IFileChange[]) => void,
		onLogMessage: (msg: ILogMessage) => void,
		verboseLogging: boolean
	): AbstractUniversalWatcherClient;

	//#endregion

	//#region File Watching (non-recursive)

	private nonRecursiveWatcher: AbstractNonRecursiveWatcherClient | undefined;

	private readonly nonRecursiveWatchRequests: INonRecursiveWatchRequest[] = [];
	private readonly nonRecursiveWatchRequestDelayer = this._register(new ThrottledDelayer<void>(this.getRefreshWatchersDelay(this.nonRecursiveWatchRequests.length)));

	private watchNonRecursive(resource: URI, opts: IWatchOptions): IDisposable {

		// Add to list of paths to watch non-recursively
		const request: INonRecursiveWatchRequest = {
			path: this.toWatchPath(resource),
			excludes: opts.excludes,
			includes: opts.includes,
			recursive: false,
			filter: opts.filter,
			correlationId: opts.correlationId
		};
		const remove = insert(this.nonRecursiveWatchRequests, request);

		// Trigger update
		this.refreshNonRecursiveWatchers();

		return toDisposable(() => {

			// Remove from list of paths to watch non-recursively
			remove();

			// Trigger update
			this.refreshNonRecursiveWatchers();
		});
	}

	private refreshNonRecursiveWatchers(): void {
		this.nonRecursiveWatchRequestDelayer.trigger(() => {
			return this.doRefreshNonRecursiveWatchers();
		}, this.getRefreshWatchersDelay(this.nonRecursiveWatchRequests.length)).catch(error => onUnexpectedError(error));
	}

	private doRefreshNonRecursiveWatchers(): Promise<void> {

		// Create watcher if this is the first time
		if (!this.nonRecursiveWatcher) {
			this.nonRecursiveWatcher = this._register(this.createNonRecursiveWatcher(
				changes => this._onDidChangeFile.fire(reviveFileChanges(changes)),
				msg => this.onWatcherLogMessage(msg),
				this.logService.getLevel() === LogLevel.Trace
			));

			// Apply log levels dynamically
			this._register(this.logService.onDidChangeLogLevel(() => {
				this.nonRecursiveWatcher?.setVerboseLogging(this.logService.getLevel() === LogLevel.Trace);
			}));
		}

		// Ask to watch the provided paths
		return this.nonRecursiveWatcher.watch(this.nonRecursiveWatchRequests);
	}

	protected abstract createNonRecursiveWatcher(
		onChange: (changes: IFileChange[]) => void,
		onLogMessage: (msg: ILogMessage) => void,
		verboseLogging: boolean
	): AbstractNonRecursiveWatcherClient;

	//#endregion

	private onWatcherLogMessage(msg: ILogMessage): void {
		if (msg.type === 'error') {
			this._onDidWatchError.fire(msg.message);
		}

		this.logWatcherMessage(msg);
	}

	protected logWatcherMessage(msg: ILogMessage): void {
		this.logService[msg.type](msg.message);
	}

	protected toFilePath(resource: URI): string {
		return normalize(resource.fsPath);
	}

	private toWatchPath(resource: URI): string {
		const filePath = this.toFilePath(resource);

		// Ensure to have any trailing path separators removed, otherwise
		// we may believe the path is not "real" and will convert every
		// event back to this form, which is not warranted.
		// See also https://github.com/microsoft/vscode/issues/210517
		return removeTrailingPathSeparator(filePath);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/common/diskFileSystemProviderClient.ts]---
Location: vscode-main/src/vs/platform/files/common/diskFileSystemProviderClient.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { toErrorMessage } from '../../../base/common/errorMessage.js';
import { canceled } from '../../../base/common/errors.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { newWriteableStream, ReadableStreamEventPayload, ReadableStreamEvents } from '../../../base/common/stream.js';
import { URI } from '../../../base/common/uri.js';
import { generateUuid } from '../../../base/common/uuid.js';
import { IChannel } from '../../../base/parts/ipc/common/ipc.js';
import { createFileSystemProviderError, IFileAtomicReadOptions, IFileDeleteOptions, IFileOpenOptions, IFileOverwriteOptions, IFileReadStreamOptions, FileSystemProviderCapabilities, FileSystemProviderErrorCode, FileType, IFileWriteOptions, IFileChange, IFileSystemProviderWithFileAtomicReadCapability, IFileSystemProviderWithFileCloneCapability, IFileSystemProviderWithFileFolderCopyCapability, IFileSystemProviderWithFileReadStreamCapability, IFileSystemProviderWithFileReadWriteCapability, IFileSystemProviderWithOpenReadWriteCloseCapability, IStat, IWatchOptions, IFileSystemProviderError } from './files.js';
import { reviveFileChanges } from './watcher.js';

export const LOCAL_FILE_SYSTEM_CHANNEL_NAME = 'localFilesystem';

/**
 * An implementation of a local disk file system provider
 * that is backed by a `IChannel` and thus implemented via
 * IPC on a different process.
 */
export class DiskFileSystemProviderClient extends Disposable implements
	IFileSystemProviderWithFileReadWriteCapability,
	IFileSystemProviderWithOpenReadWriteCloseCapability,
	IFileSystemProviderWithFileReadStreamCapability,
	IFileSystemProviderWithFileFolderCopyCapability,
	IFileSystemProviderWithFileAtomicReadCapability,
	IFileSystemProviderWithFileCloneCapability {

	constructor(
		private readonly channel: IChannel,
		private readonly extraCapabilities: { trash?: boolean; pathCaseSensitive?: boolean }
	) {
		super();

		this.registerFileChangeListeners();
	}

	//#region File Capabilities

	readonly onDidChangeCapabilities: Event<void> = Event.None;

	private _capabilities: FileSystemProviderCapabilities | undefined;
	get capabilities(): FileSystemProviderCapabilities {
		if (!this._capabilities) {
			this._capabilities =
				FileSystemProviderCapabilities.FileReadWrite |
				FileSystemProviderCapabilities.FileOpenReadWriteClose |
				FileSystemProviderCapabilities.FileReadStream |
				FileSystemProviderCapabilities.FileFolderCopy |
				FileSystemProviderCapabilities.FileWriteUnlock |
				FileSystemProviderCapabilities.FileAtomicRead |
				FileSystemProviderCapabilities.FileAtomicWrite |
				FileSystemProviderCapabilities.FileAtomicDelete |
				FileSystemProviderCapabilities.FileClone |
				FileSystemProviderCapabilities.FileRealpath;

			if (this.extraCapabilities.pathCaseSensitive) {
				this._capabilities |= FileSystemProviderCapabilities.PathCaseSensitive;
			}

			if (this.extraCapabilities.trash) {
				this._capabilities |= FileSystemProviderCapabilities.Trash;
			}
		}

		return this._capabilities;
	}

	//#endregion

	//#region File Metadata Resolving

	stat(resource: URI): Promise<IStat> {
		return this.channel.call('stat', [resource]);
	}

	realpath(resource: URI): Promise<string> {
		return this.channel.call('realpath', [resource]);
	}

	readdir(resource: URI): Promise<[string, FileType][]> {
		return this.channel.call('readdir', [resource]);
	}

	//#endregion

	//#region File Reading/Writing

	async readFile(resource: URI, opts?: IFileAtomicReadOptions): Promise<Uint8Array> {
		const { buffer } = await this.channel.call('readFile', [resource, opts]) as VSBuffer;

		return buffer;
	}

	readFileStream(resource: URI, opts: IFileReadStreamOptions, token: CancellationToken): ReadableStreamEvents<Uint8Array> {
		const stream = newWriteableStream<Uint8Array>(data => VSBuffer.concat(data.map(data => VSBuffer.wrap(data))).buffer);
		const disposables = new DisposableStore();

		// Reading as file stream goes through an event to the remote side
		disposables.add(this.channel.listen<ReadableStreamEventPayload<VSBuffer>>('readFileStream', [resource, opts])(dataOrErrorOrEnd => {

			// data
			if (dataOrErrorOrEnd instanceof VSBuffer) {
				stream.write(dataOrErrorOrEnd.buffer);
			}

			// end or error
			else {
				if (dataOrErrorOrEnd === 'end') {
					stream.end();
				} else {
					let error: Error;

					// Take Error as is if type matches
					if (dataOrErrorOrEnd instanceof Error) {
						error = dataOrErrorOrEnd;
					}

					// Otherwise, try to deserialize into an error.
					// Since we communicate via IPC, we cannot be sure
					// that Error objects are properly serialized.
					else {
						const errorCandidate = dataOrErrorOrEnd as IFileSystemProviderError;

						error = createFileSystemProviderError(errorCandidate.message ?? toErrorMessage(errorCandidate), errorCandidate.code ?? FileSystemProviderErrorCode.Unknown);
					}

					stream.error(error);
					stream.end();
				}

				// Signal to the remote side that we no longer listen
				disposables.dispose();
			}
		}));

		// Support cancellation
		disposables.add(token.onCancellationRequested(() => {

			// Ensure to end the stream properly with an error
			// to indicate the cancellation.
			stream.error(canceled());
			stream.end();

			// Ensure to dispose the listener upon cancellation. This will
			// bubble through the remote side as event and allows to stop
			// reading the file.
			disposables.dispose();
		}));

		return stream;
	}

	writeFile(resource: URI, content: Uint8Array, opts: IFileWriteOptions): Promise<void> {
		return this.channel.call('writeFile', [resource, VSBuffer.wrap(content), opts]);
	}

	open(resource: URI, opts: IFileOpenOptions): Promise<number> {
		return this.channel.call('open', [resource, opts]);
	}

	close(fd: number): Promise<void> {
		return this.channel.call('close', [fd]);
	}

	async read(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> {
		const [bytes, bytesRead]: [VSBuffer, number] = await this.channel.call('read', [fd, pos, length]);

		// copy back the data that was written into the buffer on the remote
		// side. we need to do this because buffers are not referenced by
		// pointer, but only by value and as such cannot be directly written
		// to from the other process.
		data.set(bytes.buffer.slice(0, bytesRead), offset);

		return bytesRead;
	}

	write(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> {
		return this.channel.call('write', [fd, pos, VSBuffer.wrap(data), offset, length]);
	}

	//#endregion

	//#region Move/Copy/Delete/Create Folder

	mkdir(resource: URI): Promise<void> {
		return this.channel.call('mkdir', [resource]);
	}

	delete(resource: URI, opts: IFileDeleteOptions): Promise<void> {
		return this.channel.call('delete', [resource, opts]);
	}

	rename(resource: URI, target: URI, opts: IFileOverwriteOptions): Promise<void> {
		return this.channel.call('rename', [resource, target, opts]);
	}

	copy(resource: URI, target: URI, opts: IFileOverwriteOptions): Promise<void> {
		return this.channel.call('copy', [resource, target, opts]);
	}

	//#endregion

	//#region Clone File

	cloneFile(resource: URI, target: URI): Promise<void> {
		return this.channel.call('cloneFile', [resource, target]);
	}

	//#endregion

	//#region File Watching

	private readonly _onDidChange = this._register(new Emitter<readonly IFileChange[]>());
	readonly onDidChangeFile = this._onDidChange.event;

	private readonly _onDidWatchError = this._register(new Emitter<string>());
	readonly onDidWatchError = this._onDidWatchError.event;

	// The contract for file watching via remote is to identify us
	// via a unique but readonly session ID. Since the remote is
	// managing potentially many watchers from different clients,
	// this helps the server to properly partition events to the right
	// clients.
	private readonly sessionId = generateUuid();

	private registerFileChangeListeners(): void {

		// The contract for file changes is that there is one listener
		// for both events and errors from the watcher. So we need to
		// unwrap the event from the remote and emit through the proper
		// emitter.
		this._register(this.channel.listen<IFileChange[] | string>('fileChange', [this.sessionId])(eventsOrError => {
			if (Array.isArray(eventsOrError)) {
				const events = eventsOrError;
				this._onDidChange.fire(reviveFileChanges(events));
			} else {
				const error = eventsOrError;
				this._onDidWatchError.fire(error);
			}
		}));
	}

	watch(resource: URI, opts: IWatchOptions): IDisposable {

		// Generate a request UUID to correlate the watcher
		// back to us when we ask to dispose the watcher later.
		const req = generateUuid();

		this.channel.call('watch', [this.sessionId, req, resource, opts]);

		return toDisposable(() => this.channel.call('unwatch', [this.sessionId, req]));
	}

	//#endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/files/common/files.ts]---
Location: vscode-main/src/vs/platform/files/common/files.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer, VSBufferReadable, VSBufferReadableStream } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Event } from '../../../base/common/event.js';
import { IExpression, IRelativePattern } from '../../../base/common/glob.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { TernarySearchTree } from '../../../base/common/ternarySearchTree.js';
import { sep } from '../../../base/common/path.js';
import { ReadableStreamEvents } from '../../../base/common/stream.js';
import { startsWithIgnoreCase } from '../../../base/common/strings.js';
import { isNumber } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { isWeb } from '../../../base/common/platform.js';
import { Schemas } from '../../../base/common/network.js';
import { IMarkdownString } from '../../../base/common/htmlContent.js';
import { Lazy } from '../../../base/common/lazy.js';

//#region file service & providers

export const IFileService = createDecorator<IFileService>('fileService');

export interface IFileService {

	readonly _serviceBrand: undefined;

	/**
	 * An event that is fired when a file system provider is added or removed
	 */
	readonly onDidChangeFileSystemProviderRegistrations: Event<IFileSystemProviderRegistrationEvent>;

	/**
	 * An event that is fired when a registered file system provider changes its capabilities.
	 */
	readonly onDidChangeFileSystemProviderCapabilities: Event<IFileSystemProviderCapabilitiesChangeEvent>;

	/**
	 * An event that is fired when a file system provider is about to be activated. Listeners
	 * can join this event with a long running promise to help in the activation process.
	 */
	readonly onWillActivateFileSystemProvider: Event<IFileSystemProviderActivationEvent>;

	/**
	 * Registers a file system provider for a certain scheme.
	 */
	registerProvider(scheme: string, provider: IFileSystemProvider): IDisposable;

	/**
	 * Returns a file system provider for a certain scheme.
	 */
	getProvider(scheme: string): IFileSystemProvider | undefined;

	/**
	 * Tries to activate a provider with the given scheme.
	 */
	activateProvider(scheme: string): Promise<void>;

	/**
	 * Checks if this file service can handle the given resource by
	 * first activating any extension that wants to be activated
	 * on the provided resource scheme to include extensions that
	 * contribute file system providers for the given resource.
	 */
	canHandleResource(resource: URI): Promise<boolean>;

	/**
	 * Checks if the file service has a registered provider for the
	 * provided resource.
	 *
	 * Note: this does NOT account for contributed providers from
	 * extensions that have not been activated yet. To include those,
	 * consider to call `await fileService.canHandleResource(resource)`.
	 */
	hasProvider(resource: URI): boolean;

	/**
	 * Checks if the provider for the provided resource has the provided file system capability.
	 */
	hasCapability(resource: URI, capability: FileSystemProviderCapabilities): boolean;

	/**
	 * List the schemes and capabilities for registered file system providers
	 */
	listCapabilities(): Iterable<{ scheme: string; capabilities: FileSystemProviderCapabilities }>;

	/**
	 * Allows to listen for file changes. The event will fire for every file within the opened workspace
	 * (if any) as well as all files that have been watched explicitly using the #watch() API.
	 */
	readonly onDidFilesChange: Event<FileChangesEvent>;

	/**
	 * An event that is fired upon successful completion of a certain file operation.
	 */
	readonly onDidRunOperation: Event<FileOperationEvent>;

	/**
	 * Resolve the properties of a file/folder identified by the resource. For a folder, children
	 * information is resolved as well depending on the provided options. Use `stat()` method if
	 * you do not need children information.
	 *
	 * If the optional parameter "resolveTo" is specified in options, the stat service is asked
	 * to provide a stat object that should contain the full graph of folders up to all of the
	 * target resources.
	 *
	 * If the optional parameter "resolveSingleChildDescendants" is specified in options,
	 * the stat service is asked to automatically resolve child folders that only
	 * contain a single element.
	 *
	 * If the optional parameter "resolveMetadata" is specified in options,
	 * the stat will contain metadata information such as size, mtime and etag.
	 */
	resolve(resource: URI, options: IResolveMetadataFileOptions): Promise<IFileStatWithMetadata>;
	resolve(resource: URI, options?: IResolveFileOptions): Promise<IFileStat>;

	/**
	 * Same as `resolve()` but supports resolving multiple resources in parallel.
	 *
	 * If one of the resolve targets fails to resolve returns a fake `IFileStat` instead of
	 * making the whole call fail.
	 */
	resolveAll(toResolve: { resource: URI; options: IResolveMetadataFileOptions }[]): Promise<IFileStatResult[]>;
	resolveAll(toResolve: { resource: URI; options?: IResolveFileOptions }[]): Promise<IFileStatResult[]>;

	/**
	 * Same as `resolve()` but without resolving the children of a folder if the
	 * resource is pointing to a folder.
	 */
	stat(resource: URI): Promise<IFileStatWithPartialMetadata>;

	/**
	 * Attempts to resolve the real path of the provided resource. The real path can be
	 * different from the resource path for example when it is a symlink.
	 *
	 * Will return `undefined` if the real path cannot be resolved.
	 */
	realpath(resource: URI): Promise<URI | undefined>;

	/**
	 * Finds out if a file/folder identified by the resource exists.
	 */
	exists(resource: URI): Promise<boolean>;

	/**
	 * Read the contents of the provided resource unbuffered.
	 */
	readFile(resource: URI, options?: IReadFileOptions, token?: CancellationToken): Promise<IFileContent>;

	/**
	 * Read the contents of the provided resource buffered as stream.
	 */
	readFileStream(resource: URI, options?: IReadFileStreamOptions, token?: CancellationToken): Promise<IFileStreamContent>;

	/**
	 * Updates the content replacing its previous value.
	 *
	 * Emits a `FileOperation.WRITE` file operation event when successful.
	 */
	writeFile(resource: URI, bufferOrReadableOrStream: VSBuffer | VSBufferReadable | VSBufferReadableStream, options?: IWriteFileOptions): Promise<IFileStatWithMetadata>;

	/**
	 * Moves the file/folder to a new path identified by the resource.
	 *
	 * The optional parameter overwrite can be set to replace an existing file at the location.
	 *
	 * Emits a `FileOperation.MOVE` file operation event when successful.
	 */
	move(source: URI, target: URI, overwrite?: boolean): Promise<IFileStatWithMetadata>;

	/**
	 * Find out if a move operation is possible given the arguments. No changes on disk will
	 * be performed. Returns an Error if the operation cannot be done.
	 */
	canMove(source: URI, target: URI, overwrite?: boolean): Promise<Error | true>;

	/**
	 * Copies the file/folder to a path identified by the resource. A folder is copied
	 * recursively.
	 *
	 * Emits a `FileOperation.COPY` file operation event when successful.
	 */
	copy(source: URI, target: URI, overwrite?: boolean): Promise<IFileStatWithMetadata>;

	/**
	 * Find out if a copy operation is possible given the arguments. No changes on disk will
	 * be performed. Returns an Error if the operation cannot be done.
	 */
	canCopy(source: URI, target: URI, overwrite?: boolean): Promise<Error | true>;

	/**
	 * Clones a file to a path identified by the resource. Folders are not supported.
	 *
	 * If the target path exists, it will be overwritten.
	 */
	cloneFile(source: URI, target: URI): Promise<void>;

	/**
	 * Creates a new file with the given path and optional contents. The returned promise
	 * will have the stat model object as a result.
	 *
	 * The optional parameter content can be used as value to fill into the new file.
	 *
	 * Emits a `FileOperation.CREATE` file operation event when successful.
	 */
	createFile(resource: URI, bufferOrReadableOrStream?: VSBuffer | VSBufferReadable | VSBufferReadableStream, options?: ICreateFileOptions): Promise<IFileStatWithMetadata>;

	/**
	 * Find out if a file create operation is possible given the arguments. No changes on disk will
	 * be performed. Returns an Error if the operation cannot be done.
	 */
	canCreateFile(resource: URI, options?: ICreateFileOptions): Promise<Error | true>;

	/**
	 * Creates a new folder with the given path. The returned promise
	 * will have the stat model object as a result.
	 *
	 * Emits a `FileOperation.CREATE` file operation event when successful.
	 */
	createFolder(resource: URI): Promise<IFileStatWithMetadata>;

	/**
	 * Deletes the provided file. The optional useTrash parameter allows to
	 * move the file to trash. The optional recursive parameter allows to delete
	 * non-empty folders recursively.
	 *
	 * Emits a `FileOperation.DELETE` file operation event when successful.
	 */
	del(resource: URI, options?: Partial<IFileDeleteOptions>): Promise<void>;

	/**
	 * Find out if a delete operation is possible given the arguments. No changes on disk will
	 * be performed. Returns an Error if the operation cannot be done.
	 */
	canDelete(resource: URI, options?: Partial<IFileDeleteOptions>): Promise<Error | true>;

	/**
	 * An event that signals an error when watching for file changes.
	 */
	readonly onDidWatchError: Event<Error>;

	/**
	 * Allows to start a watcher that reports file/folder change events on the provided resource.
	 *
	 * The watcher runs correlated and thus, file events will be reported on the returned
	 * `IFileSystemWatcher` and not on the generic `IFileService.onDidFilesChange` event.
	 *
	 * Note: only non-recursive file watching supports event correlation for now.
	 */
	createWatcher(resource: URI, options: IWatchOptionsWithoutCorrelation & { recursive: false }): IFileSystemWatcher;

	/**
	 * Allows to start a watcher that reports file/folder change events on the provided resource.
	 *
	 * The watcher runs uncorrelated and thus will report all events from `IFileService.onDidFilesChange`.
	 * This means, most listeners in the application will receive your events. It is encouraged to
	 * use correlated watchers (via `IWatchOptionsWithCorrelation`) to limit events to your listener.
	*/
	watch(resource: URI, options?: IWatchOptionsWithoutCorrelation): IDisposable;

	/**
	 * Frees up any resources occupied by this service.
	 */
	dispose(): void;
}

export interface IFileOverwriteOptions {

	/**
	 * Set to `true` to overwrite a file if it exists. Will
	 * throw an error otherwise if the file does exist.
	 */
	readonly overwrite: boolean;
}

export interface IFileUnlockOptions {

	/**
	 * Set to `true` to try to remove any write locks the file might
	 * have. A file that is write locked will throw an error for any
	 * attempt to write to unless `unlock: true` is provided.
	 */
	readonly unlock: boolean;
}

export interface IFileAtomicReadOptions {

	/**
	 * The optional `atomic` flag can be used to make sure
	 * the `readFile` method is not running in parallel with
	 * any `write` operations in the same process.
	 *
	 * Typically you should not need to use this flag but if
	 * for example you are quickly reading a file right after
	 * a file event occurred and the file changes a lot, there
	 * is a chance that a read returns an empty or partial file
	 * because a pending write has not finished yet.
	 *
	 * Note: this does not prevent the file from being written
	 * to from a different process. If you need such atomic
	 * operations, you better use a real database as storage.
	 */
	readonly atomic: boolean;
}

export interface IFileAtomicOptions {

	/**
	 * The postfix is used to create a temporary file based
	 * on the original resource. The resulting temporary
	 * file will be in the same folder as the resource and
	 * have `postfix` appended to the resource name.
	 *
	 * Example: given a file resource `file:///some/path/foo.txt`
	 * and a postfix `.vsctmp`, the temporary file will be
	 * created as `file:///some/path/foo.txt.vsctmp`.
	 */
	readonly postfix: string;
}

export interface IFileAtomicWriteOptions {

	/**
	 * The optional `atomic` flag can be used to make sure
	 * the `writeFile` method updates the target file atomically
	 * by first writing to a temporary file in the same folder
	 * and then renaming it over the target.
	 */
	readonly atomic: IFileAtomicOptions | false;
}

export interface IFileAtomicDeleteOptions {

	/**
	 * The optional `atomic` flag can be used to make sure
	 * the `delete` method deletes the target atomically by
	 * first renaming it to a temporary resource in the same
	 * folder and then deleting it.
	 */
	readonly atomic: IFileAtomicOptions | false;
}

export interface IFileReadLimits {

	/**
	 * If the file exceeds the given size, an error of kind
	 * `FILE_TOO_LARGE` will be thrown.
	 */
	size?: number;
}

export interface IFileReadStreamOptions {

	/**
	 * Is an integer specifying where to begin reading from in the file. If position is undefined,
	 * data will be read from the current file position.
	 */
	readonly position?: number;

	/**
	 * Is an integer specifying how many bytes to read from the file. By default, all bytes
	 * will be read.
	 */
	readonly length?: number;

	/**
	 * If provided, the size of the file will be checked against the limits
	 * and an error will be thrown if any limit is exceeded.
	 */
	readonly limits?: IFileReadLimits;
}

export interface IFileWriteOptions extends IFileOverwriteOptions, IFileUnlockOptions, IFileAtomicWriteOptions {

	/**
	 * Set to `true` to create a file when it does not exist. Will
	 * throw an error otherwise if the file does not exist.
	 */
	readonly create: boolean;
}

export type IFileOpenOptions = IFileOpenForReadOptions | IFileOpenForWriteOptions;

export function isFileOpenForWriteOptions(options: IFileOpenOptions): options is IFileOpenForWriteOptions {
	return options.create === true;
}

export interface IFileOpenForReadOptions {

	/**
	 * A hint that the file should be opened for reading only.
	 */
	readonly create: false;
}

export interface IFileOpenForWriteOptions extends IFileUnlockOptions {

	/**
	 * A hint that the file should be opened for reading and writing.
	 */
	readonly create: true;
}

export interface IFileDeleteOptions {

	/**
	 * Set to `true` to recursively delete any children of the file. This
	 * only applies to folders and can lead to an error unless provided
	 * if the folder is not empty.
	 */
	readonly recursive: boolean;

	/**
	 * Set to `true` to attempt to move the file to trash
	 * instead of deleting it permanently from disk.
	 *
	 * This option maybe not be supported on all providers.
	 */
	readonly useTrash: boolean;

	/**
	 * The optional `atomic` flag can be used to make sure
	 * the `delete` method deletes the target atomically by
	 * first renaming it to a temporary resource in the same
	 * folder and then deleting it.
	 *
	 * This option maybe not be supported on all providers.
	 */
	readonly atomic: IFileAtomicOptions | false;
}

export enum FileType {

	/**
	 * File is unknown (neither file, directory nor symbolic link).
	 */
	Unknown = 0,

	/**
	 * File is a normal file.
	 */
	File = 1,

	/**
	 * File is a directory.
	 */
	Directory = 2,

	/**
	 * File is a symbolic link.
	 *
	 * Note: even when the file is a symbolic link, you can test for
	 * `FileType.File` and `FileType.Directory` to know the type of
	 * the target the link points to.
	 */
	SymbolicLink = 64
}

export enum FilePermission {

	/**
	 * File is readonly. Components like editors should not
	 * offer to edit the contents.
	 */
	Readonly = 1,

	/**
	 * File is locked. Components like editors should offer
	 * to edit the contents and ask the user upon saving to
	 * remove the lock.
	 */
	Locked = 2
}

export interface IStat {

	/**
	 * The file type.
	 */
	readonly type: FileType;

	/**
	 * The last modification date represented as millis from unix epoch.
	 */
	readonly mtime: number;

	/**
	 * The creation date represented as millis from unix epoch.
	 */
	readonly ctime: number;

	/**
	 * The size of the file in bytes.
	 */
	readonly size: number;

	/**
	 * The file permissions.
	 */
	readonly permissions?: FilePermission;
}

export interface IWatchOptionsWithoutCorrelation {

	/**
	 * Set to `true` to watch for changes recursively in a folder
	 * and all of its children.
	 */
	recursive: boolean;

	/**
	 * A set of glob patterns or paths to exclude from watching.
	 * Paths can be relative or absolute and when relative are
	 * resolved against the watched folder. Glob patterns are
	 * always matched relative to the watched folder.
	 */
	excludes: string[];

	/**
	 * An optional set of glob patterns or paths to include for
	 * watching. If not provided, all paths are considered for
	 * events.
	 * Paths can be relative or absolute and when relative are
	 * resolved against the watched folder. Glob patterns are
	 * always matched relative to the watched folder.
	 */
	includes?: Array<string | IRelativePattern>;

	/**
	 * If provided, allows to filter the events that the watcher should consider
	 * for emitting. If not provided, all events are emitted.
	 *
	 * For example, to emit added and updated events, set to:
	 * `FileChangeFilter.ADDED | FileChangeFilter.UPDATED`.
	 */
	filter?: FileChangeFilter;
}

export interface IWatchOptions extends IWatchOptionsWithoutCorrelation {

	/**
	 * If provided, file change events from the watcher that
	 * are a result of this watch request will carry the same
	 * id.
	 */
	readonly correlationId?: number;
}

export const enum FileChangeFilter {
	UPDATED = 1 << 1,
	ADDED = 1 << 2,
	DELETED = 1 << 3
}

export interface IWatchOptionsWithCorrelation extends IWatchOptions {
	readonly correlationId: number;
}

export interface IFileSystemWatcher extends IDisposable {

	/**
	 * An event which fires on file/folder change only for changes
	 * that correlate to the watch request with matching correlation
	 * identifier.
	 */
	readonly onDidChange: Event<FileChangesEvent>;
}

export function isFileSystemWatcher(thing: unknown): thing is IFileSystemWatcher {
	const candidate = thing as IFileSystemWatcher | undefined;

	return !!candidate && typeof candidate.onDidChange === 'function';
}

export const enum FileSystemProviderCapabilities {

	/**
	 * No capabilities.
	 */
	None = 0,

	/**
	 * Provider supports unbuffered read/write.
	 */
	FileReadWrite = 1 << 1,

	/**
	 * Provider supports open/read/write/close low level file operations.
	 */
	FileOpenReadWriteClose = 1 << 2,

	/**
	 * Provider supports stream based reading.
	 */
	FileReadStream = 1 << 4,

	/**
	 * Provider supports copy operation.
	 */
	FileFolderCopy = 1 << 3,

	/**
	 * Provider is path case sensitive.
	 */
	PathCaseSensitive = 1 << 10,

	/**
	 * All files of the provider are readonly.
	 */
	Readonly = 1 << 11,

	/**
	 * Provider supports to delete via trash.
	 */
	Trash = 1 << 12,

	/**
	 * Provider support to unlock files for writing.
	 */
	FileWriteUnlock = 1 << 13,

	/**
	 * Provider support to read files atomically. This implies the
	 * provider provides the `FileReadWrite` capability too.
	 */
	FileAtomicRead = 1 << 14,

	/**
	 * Provider support to write files atomically. This implies the
	 * provider provides the `FileReadWrite` capability too.
	 */
	FileAtomicWrite = 1 << 15,

	/**
	 * Provider support to delete atomically.
	 */
	FileAtomicDelete = 1 << 16,

	/**
	 * Provider support to clone files atomically.
	 */
	FileClone = 1 << 17,

	/**
	 * Provider support to resolve real paths.
	 */
	FileRealpath = 1 << 18
}

export interface IFileSystemProvider {

	readonly capabilities: FileSystemProviderCapabilities;
	readonly onDidChangeCapabilities: Event<void>;

	readonly onDidChangeFile: Event<readonly IFileChange[]>;
	readonly onDidWatchError?: Event<string>;
	watch(resource: URI, opts: IWatchOptions): IDisposable;

	stat(resource: URI): Promise<IStat>;
	mkdir(resource: URI): Promise<void>;
	readdir(resource: URI): Promise<[string, FileType][]>;
	delete(resource: URI, opts: IFileDeleteOptions): Promise<void>;

	rename(from: URI, to: URI, opts: IFileOverwriteOptions): Promise<void>;
	copy?(from: URI, to: URI, opts: IFileOverwriteOptions): Promise<void>;

	readFile?(resource: URI): Promise<Uint8Array>;
	writeFile?(resource: URI, content: Uint8Array, opts: IFileWriteOptions): Promise<void>;

	readFileStream?(resource: URI, opts: IFileReadStreamOptions, token: CancellationToken): ReadableStreamEvents<Uint8Array>;

	open?(resource: URI, opts: IFileOpenOptions): Promise<number>;
	close?(fd: number): Promise<void>;
	read?(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number>;
	write?(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number>;

	cloneFile?(from: URI, to: URI): Promise<void>;
}

export interface IFileSystemProviderWithFileReadWriteCapability extends IFileSystemProvider {
	readFile(resource: URI): Promise<Uint8Array>;
	writeFile(resource: URI, content: Uint8Array, opts: IFileWriteOptions): Promise<void>;
}

export function hasReadWriteCapability(provider: IFileSystemProvider): provider is IFileSystemProviderWithFileReadWriteCapability {
	return !!(provider.capabilities & FileSystemProviderCapabilities.FileReadWrite);
}

export interface IFileSystemProviderWithFileFolderCopyCapability extends IFileSystemProvider {
	copy(from: URI, to: URI, opts: IFileOverwriteOptions): Promise<void>;
}

export function hasFileFolderCopyCapability(provider: IFileSystemProvider): provider is IFileSystemProviderWithFileFolderCopyCapability {
	return !!(provider.capabilities & FileSystemProviderCapabilities.FileFolderCopy);
}

export interface IFileSystemProviderWithFileCloneCapability extends IFileSystemProvider {
	cloneFile(from: URI, to: URI): Promise<void>;
}

export function hasFileCloneCapability(provider: IFileSystemProvider): provider is IFileSystemProviderWithFileCloneCapability {
	return !!(provider.capabilities & FileSystemProviderCapabilities.FileClone);
}

export interface IFileSystemProviderWithFileRealpathCapability extends IFileSystemProvider {
	realpath(resource: URI): Promise<string>;
}

export function hasFileRealpathCapability(provider: IFileSystemProvider): provider is IFileSystemProviderWithFileRealpathCapability {
	return !!(provider.capabilities & FileSystemProviderCapabilities.FileRealpath);
}

export interface IFileSystemProviderWithOpenReadWriteCloseCapability extends IFileSystemProvider {
	open(resource: URI, opts: IFileOpenOptions): Promise<number>;
	close(fd: number): Promise<void>;
	read(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number>;
	write(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number>;
}

export function hasOpenReadWriteCloseCapability(provider: IFileSystemProvider): provider is IFileSystemProviderWithOpenReadWriteCloseCapability {
	return !!(provider.capabilities & FileSystemProviderCapabilities.FileOpenReadWriteClose);
}

export interface IFileSystemProviderWithFileReadStreamCapability extends IFileSystemProvider {
	readFileStream(resource: URI, opts: IFileReadStreamOptions, token: CancellationToken): ReadableStreamEvents<Uint8Array>;
}

export function hasFileReadStreamCapability(provider: IFileSystemProvider): provider is IFileSystemProviderWithFileReadStreamCapability {
	return !!(provider.capabilities & FileSystemProviderCapabilities.FileReadStream);
}

export interface IFileSystemProviderWithFileAtomicReadCapability extends IFileSystemProvider {
	readFile(resource: URI, opts?: IFileAtomicReadOptions): Promise<Uint8Array>;
	enforceAtomicReadFile?(resource: URI): boolean;
}

export function hasFileAtomicReadCapability(provider: IFileSystemProvider): provider is IFileSystemProviderWithFileAtomicReadCapability {
	if (!hasReadWriteCapability(provider)) {
		return false; // we require the `FileReadWrite` capability too
	}

	return !!(provider.capabilities & FileSystemProviderCapabilities.FileAtomicRead);
}

export interface IFileSystemProviderWithFileAtomicWriteCapability extends IFileSystemProvider {
	writeFile(resource: URI, contents: Uint8Array, opts?: IFileAtomicWriteOptions): Promise<void>;
	enforceAtomicWriteFile?(resource: URI): IFileAtomicOptions | false;
}

export function hasFileAtomicWriteCapability(provider: IFileSystemProvider): provider is IFileSystemProviderWithFileAtomicWriteCapability {
	if (!hasReadWriteCapability(provider)) {
		return false; // we require the `FileReadWrite` capability too
	}

	return !!(provider.capabilities & FileSystemProviderCapabilities.FileAtomicWrite);
}

export interface IFileSystemProviderWithFileAtomicDeleteCapability extends IFileSystemProvider {
	delete(resource: URI, opts: IFileAtomicDeleteOptions): Promise<void>;
	enforceAtomicDelete?(resource: URI): IFileAtomicOptions | false;
}

export function hasFileAtomicDeleteCapability(provider: IFileSystemProvider): provider is IFileSystemProviderWithFileAtomicDeleteCapability {
	return !!(provider.capabilities & FileSystemProviderCapabilities.FileAtomicDelete);
}

export interface IFileSystemProviderWithReadonlyCapability extends IFileSystemProvider {

	readonly capabilities: FileSystemProviderCapabilities.Readonly & FileSystemProviderCapabilities;

	/**
	 * An optional message to show in the UI to explain why the file system is readonly.
	 */
	readonly readOnlyMessage?: IMarkdownString;
}

export function hasReadonlyCapability(provider: IFileSystemProvider): provider is IFileSystemProviderWithReadonlyCapability {
	return !!(provider.capabilities & FileSystemProviderCapabilities.Readonly);
}

export enum FileSystemProviderErrorCode {
	FileExists = 'EntryExists',
	FileNotFound = 'EntryNotFound',
	FileNotADirectory = 'EntryNotADirectory',
	FileIsADirectory = 'EntryIsADirectory',
	FileExceedsStorageQuota = 'EntryExceedsStorageQuota',
	FileTooLarge = 'EntryTooLarge',
	FileWriteLocked = 'EntryWriteLocked',
	NoPermissions = 'NoPermissions',
	Unavailable = 'Unavailable',
	Unknown = 'Unknown'
}

export interface IFileSystemProviderError extends Error {
	readonly name: string;
	readonly code: FileSystemProviderErrorCode;
}

export class FileSystemProviderError extends Error implements IFileSystemProviderError {

	static create(error: Error | string, code: FileSystemProviderErrorCode): FileSystemProviderError {
		const providerError = new FileSystemProviderError(error.toString(), code);
		markAsFileSystemProviderError(providerError, code);

		return providerError;
	}

	private constructor(message: string, readonly code: FileSystemProviderErrorCode) {
		super(message);
	}
}

export function createFileSystemProviderError(error: Error | string, code: FileSystemProviderErrorCode): FileSystemProviderError {
	return FileSystemProviderError.create(error, code);
}

export function ensureFileSystemProviderError(error?: Error): Error {
	if (!error) {
		return createFileSystemProviderError(localize('unknownError', "Unknown Error"), FileSystemProviderErrorCode.Unknown); // https://github.com/microsoft/vscode/issues/72798
	}

	return error;
}

export function markAsFileSystemProviderError(error: Error, code: FileSystemProviderErrorCode): Error {
	error.name = code ? `${code} (FileSystemError)` : `FileSystemError`;

	return error;
}

export function toFileSystemProviderErrorCode(error: Error | undefined | null): FileSystemProviderErrorCode {

	// Guard against abuse
	if (!error) {
		return FileSystemProviderErrorCode.Unknown;
	}

	// FileSystemProviderError comes with the code
	if (error instanceof FileSystemProviderError) {
		return error.code;
	}

	// Any other error, check for name match by assuming that the error
	// went through the markAsFileSystemProviderError() method
	const match = /^(.+) \(FileSystemError\)$/.exec(error.name);
	if (!match) {
		return FileSystemProviderErrorCode.Unknown;
	}

	switch (match[1]) {
		case FileSystemProviderErrorCode.FileExists: return FileSystemProviderErrorCode.FileExists;
		case FileSystemProviderErrorCode.FileIsADirectory: return FileSystemProviderErrorCode.FileIsADirectory;
		case FileSystemProviderErrorCode.FileNotADirectory: return FileSystemProviderErrorCode.FileNotADirectory;
		case FileSystemProviderErrorCode.FileNotFound: return FileSystemProviderErrorCode.FileNotFound;
		case FileSystemProviderErrorCode.FileTooLarge: return FileSystemProviderErrorCode.FileTooLarge;
		case FileSystemProviderErrorCode.FileWriteLocked: return FileSystemProviderErrorCode.FileWriteLocked;
		case FileSystemProviderErrorCode.NoPermissions: return FileSystemProviderErrorCode.NoPermissions;
		case FileSystemProviderErrorCode.Unavailable: return FileSystemProviderErrorCode.Unavailable;
	}

	return FileSystemProviderErrorCode.Unknown;
}

export function toFileOperationResult(error: Error): FileOperationResult {

	// FileSystemProviderError comes with the result already
	if (error instanceof FileOperationError) {
		return error.fileOperationResult;
	}

	// Otherwise try to find from code
	switch (toFileSystemProviderErrorCode(error)) {
		case FileSystemProviderErrorCode.FileNotFound:
			return FileOperationResult.FILE_NOT_FOUND;
		case FileSystemProviderErrorCode.FileIsADirectory:
			return FileOperationResult.FILE_IS_DIRECTORY;
		case FileSystemProviderErrorCode.FileNotADirectory:
			return FileOperationResult.FILE_NOT_DIRECTORY;
		case FileSystemProviderErrorCode.FileWriteLocked:
			return FileOperationResult.FILE_WRITE_LOCKED;
		case FileSystemProviderErrorCode.NoPermissions:
			return FileOperationResult.FILE_PERMISSION_DENIED;
		case FileSystemProviderErrorCode.FileExists:
			return FileOperationResult.FILE_MOVE_CONFLICT;
		case FileSystemProviderErrorCode.FileTooLarge:
			return FileOperationResult.FILE_TOO_LARGE;
		default:
			return FileOperationResult.FILE_OTHER_ERROR;
	}
}

export interface IFileSystemProviderRegistrationEvent {
	readonly added: boolean;
	readonly scheme: string;
	readonly provider?: IFileSystemProvider;
}

export interface IFileSystemProviderCapabilitiesChangeEvent {
	readonly provider: IFileSystemProvider;
	readonly scheme: string;
}

export interface IFileSystemProviderActivationEvent {
	readonly scheme: string;
	join(promise: Promise<void>): void;
}

export const enum FileOperation {
	CREATE,
	DELETE,
	MOVE,
	COPY,
	WRITE
}

export interface IFileOperationEvent {

	readonly resource: URI;
	readonly operation: FileOperation;

	isOperation(operation: FileOperation.DELETE | FileOperation.WRITE): boolean;
	isOperation(operation: FileOperation.CREATE | FileOperation.MOVE | FileOperation.COPY): this is IFileOperationEventWithMetadata;
}

export interface IFileOperationEventWithMetadata extends IFileOperationEvent {
	readonly target: IFileStatWithMetadata;
}

export class FileOperationEvent implements IFileOperationEvent {

	constructor(resource: URI, operation: FileOperation.DELETE | FileOperation.WRITE);
	constructor(resource: URI, operation: FileOperation.CREATE | FileOperation.MOVE | FileOperation.COPY, target: IFileStatWithMetadata);
	constructor(readonly resource: URI, readonly operation: FileOperation, readonly target?: IFileStatWithMetadata) { }

	isOperation(operation: FileOperation.DELETE | FileOperation.WRITE): boolean;
	isOperation(operation: FileOperation.CREATE | FileOperation.MOVE | FileOperation.COPY): this is IFileOperationEventWithMetadata;
	isOperation(operation: FileOperation): boolean {
		return this.operation === operation;
	}
}

/**
 * Possible changes that can occur to a file.
 */
export const enum FileChangeType {
	UPDATED,
	ADDED,
	DELETED
}

/**
 * Identifies a single change in a file.
 */
export interface IFileChange {

	/**
	 * The type of change that occurred to the file.
	 */
	type: FileChangeType;

	/**
	 * The unified resource identifier of the file that changed.
	 */
	readonly resource: URI;

	/**
	 * If provided when starting the file watcher, the correlation
	 * identifier will match the original file watching request as
	 * a way to identify the original component that is interested
	 * in the change.
	 */
	readonly cId?: number;
}

export class FileChangesEvent {

	private static readonly MIXED_CORRELATION = null;

	private readonly correlationId: number | undefined | typeof FileChangesEvent.MIXED_CORRELATION = undefined;

	constructor(changes: readonly IFileChange[], private readonly ignorePathCasing: boolean) {
		for (const change of changes) {

			// Split by type
			switch (change.type) {
				case FileChangeType.ADDED:
					this.rawAdded.push(change.resource);
					break;
				case FileChangeType.UPDATED:
					this.rawUpdated.push(change.resource);
					break;
				case FileChangeType.DELETED:
					this.rawDeleted.push(change.resource);
					break;
			}

			// Figure out events correlation
			if (this.correlationId !== FileChangesEvent.MIXED_CORRELATION) {
				if (typeof change.cId === 'number') {
					if (this.correlationId === undefined) {
						this.correlationId = change.cId; 							// correlation not yet set, just take it
					} else if (this.correlationId !== change.cId) {
						this.correlationId = FileChangesEvent.MIXED_CORRELATION;	// correlation mismatch, we have mixed correlation
					}
				} else {
					if (this.correlationId !== undefined) {
						this.correlationId = FileChangesEvent.MIXED_CORRELATION;	// correlation mismatch, we have mixed correlation
					}
				}
			}
		}
	}

	private readonly added = new Lazy(() => {
		const added = TernarySearchTree.forUris<boolean>(() => this.ignorePathCasing);
		added.fill(this.rawAdded.map(resource => [resource, true]));

		return added;
	});

	private readonly updated = new Lazy(() => {
		const updated = TernarySearchTree.forUris<boolean>(() => this.ignorePathCasing);
		updated.fill(this.rawUpdated.map(resource => [resource, true]));

		return updated;
	});

	private readonly deleted = new Lazy(() => {
		const deleted = TernarySearchTree.forUris<boolean>(() => this.ignorePathCasing);
		deleted.fill(this.rawDeleted.map(resource => [resource, true]));

		return deleted;
	});

	/**
	 * Find out if the file change events match the provided resource.
	 *
	 * Note: when passing `FileChangeType.DELETED`, we consider a match
	 * also when the parent of the resource got deleted.
	 */
	contains(resource: URI, ...types: FileChangeType[]): boolean {
		return this.doContains(resource, { includeChildren: false }, ...types);
	}

	/**
	 * Find out if the file change events either match the provided
	 * resource, or contain a child of this resource.
	 */
	affects(resource: URI, ...types: FileChangeType[]): boolean {
		return this.doContains(resource, { includeChildren: true }, ...types);
	}

	private doContains(resource: URI, options: { includeChildren: boolean }, ...types: FileChangeType[]): boolean {
		if (!resource) {
			return false;
		}

		const hasTypesFilter = types.length > 0;

		// Added
		if (!hasTypesFilter || types.includes(FileChangeType.ADDED)) {
			if (this.added.value.get(resource)) {
				return true;
			}

			if (options.includeChildren && this.added.value.findSuperstr(resource)) {
				return true;
			}
		}

		// Updated
		if (!hasTypesFilter || types.includes(FileChangeType.UPDATED)) {
			if (this.updated.value.get(resource)) {
				return true;
			}

			if (options.includeChildren && this.updated.value.findSuperstr(resource)) {
				return true;
			}
		}

		// Deleted
		if (!hasTypesFilter || types.includes(FileChangeType.DELETED)) {
			if (this.deleted.value.findSubstr(resource) /* deleted also considers parent folders */) {
				return true;
			}

			if (options.includeChildren && this.deleted.value.findSuperstr(resource)) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Returns if this event contains added files.
	 */
	gotAdded(): boolean {
		return this.rawAdded.length > 0;
	}

	/**
	 * Returns if this event contains deleted files.
	 */
	gotDeleted(): boolean {
		return this.rawDeleted.length > 0;
	}

	/**
	 * Returns if this event contains updated files.
	 */
	gotUpdated(): boolean {
		return this.rawUpdated.length > 0;
	}

	/**
	 * Returns if this event contains changes that correlate to the
	 * provided `correlationId`.
	 *
	 * File change event correlation is an advanced watch feature that
	 * allows to  identify from which watch request the events originate
	 * from. This correlation allows to route events specifically
	 * only to the requestor and not emit them to all listeners.
	 */
	correlates(correlationId: number): boolean {
		return this.correlationId === correlationId;
	}

	/**
	 * Figure out if the event contains changes that correlate to one
	 * correlation identifier.
	 *
	 * File change event correlation is an advanced watch feature that
	 * allows to  identify from which watch request the events originate
	 * from. This correlation allows to route events specifically
	 * only to the requestor and not emit them to all listeners.
	 */
	hasCorrelation(): boolean {
		return typeof this.correlationId === 'number';
	}

	/**
	 * @deprecated use the `contains` or `affects` method to efficiently find
	 * out if the event relates to a given resource. these methods ensure:
	 * - that there is no expensive lookup needed (by using a `TernarySearchTree`)
	 * - correctly handles `FileChangeType.DELETED` events
	 */
	readonly rawAdded: URI[] = [];

	/**
	* @deprecated use the `contains` or `affects` method to efficiently find
	* out if the event relates to a given resource. these methods ensure:
	* - that there is no expensive lookup needed (by using a `TernarySearchTree`)
	* - correctly handles `FileChangeType.DELETED` events
	*/
	readonly rawUpdated: URI[] = [];

	/**
	* @deprecated use the `contains` or `affects` method to efficiently find
	* out if the event relates to a given resource. these methods ensure:
	* - that there is no expensive lookup needed (by using a `TernarySearchTree`)
	* - correctly handles `FileChangeType.DELETED` events
	*/
	readonly rawDeleted: URI[] = [];
}

export function isParent(path: string, candidate: string, ignoreCase?: boolean): boolean {
	if (!path || !candidate || path === candidate) {
		return false;
	}

	if (candidate.length > path.length) {
		return false;
	}

	if (candidate.charAt(candidate.length - 1) !== sep) {
		candidate += sep;
	}

	if (ignoreCase) {
		return startsWithIgnoreCase(path, candidate);
	}

	return path.indexOf(candidate) === 0;
}

export interface IBaseFileStat {

	/**
	 * The unified resource identifier of this file or folder.
	 */
	readonly resource: URI;

	/**
	 * The name which is the last segment
	 * of the {{path}}.
	 */
	readonly name: string;

	/**
	 * The size of the file.
	 *
	 * The value may or may not be resolved as
	 * it is optional.
	 */
	readonly size?: number;

	/**
	 * The last modification date represented as millis from unix epoch.
	 *
	 * The value may or may not be resolved as
	 * it is optional.
	 */
	readonly mtime?: number;

	/**
	 * The creation date represented as millis from unix epoch.
	 *
	 * The value may or may not be resolved as
	 * it is optional.
	 */
	readonly ctime?: number;

	/**
	 * A unique identifier that represents the
	 * current state of the file or directory.
	 *
	 * The value may or may not be resolved as
	 * it is optional.
	 */
	readonly etag?: string;

	/**
	 * File is readonly. Components like editors should not
	 * offer to edit the contents.
	 */
	readonly readonly?: boolean;

	/**
	 * File is locked. Components like editors should offer
	 * to edit the contents and ask the user upon saving to
	 * remove the lock.
	 */
	readonly locked?: boolean;
}

export interface IBaseFileStatWithMetadata extends Required<IBaseFileStat> { }

/**
 * A file resource with meta information and resolved children if any.
 */
export interface IFileStat extends IBaseFileStat {

	/**
	 * The resource is a file.
	 */
	readonly isFile: boolean;

	/**
	 * The resource is a directory.
	 */
	readonly isDirectory: boolean;

	/**
	 * The resource is a symbolic link. Note: even when the
	 * file is a symbolic link, you can test for `FileType.File`
	 * and `FileType.Directory` to know the type of the target
	 * the link points to.
	 */
	readonly isSymbolicLink: boolean;

	/**
	 * The children of the file stat or undefined if none.
	 */
	children: IFileStat[] | undefined;
}

export interface IFileStatWithMetadata extends IFileStat, IBaseFileStatWithMetadata {
	readonly mtime: number;
	readonly ctime: number;
	readonly etag: string;
	readonly size: number;
	readonly readonly: boolean;
	readonly locked: boolean;
	readonly children: IFileStatWithMetadata[] | undefined;
}

export interface IFileStatResult {
	readonly stat?: IFileStat;
	readonly success: boolean;
}

export interface IFileStatResultWithMetadata extends IFileStatResult {
	readonly stat?: IFileStatWithMetadata;
}

export interface IFileStatWithPartialMetadata extends Omit<IFileStatWithMetadata, 'children'> { }

export interface IFileContent extends IBaseFileStatWithMetadata {

	/**
	 * The content of a file as buffer.
	 */
	readonly value: VSBuffer;
}

export interface IFileStreamContent extends IBaseFileStatWithMetadata {

	/**
	 * The content of a file as stream.
	 */
	readonly value: VSBufferReadableStream;
}

export interface IBaseReadFileOptions extends IFileReadStreamOptions {

	/**
	 * The optional etag parameter allows to return early from resolving the resource if
	 * the contents on disk match the etag. This prevents accumulated reading of resources
	 * that have been read already with the same etag.
	 * It is the task of the caller to makes sure to handle this error case from the promise.
	 */
	readonly etag?: string;
}

export interface IReadFileStreamOptions extends IBaseReadFileOptions { }

export interface IReadFileOptions extends IBaseReadFileOptions {

	/**
	 * The optional `atomic` flag can be used to make sure
	 * the `readFile` method is not running in parallel with
	 * any `write` operations in the same process.
	 *
	 * Typically you should not need to use this flag but if
	 * for example you are quickly reading a file right after
	 * a file event occurred and the file changes a lot, there
	 * is a chance that a read returns an empty or partial file
	 * because a pending write has not finished yet.
	 *
	 * Note: this does not prevent the file from being written
	 * to from a different process. If you need such atomic
	 * operations, you better use a real database as storage.
	 */
	readonly atomic?: boolean;
}

export interface IWriteFileOptions {

	/**
	 * The last known modification time of the file. This can be used to prevent dirty writes.
	 */
	readonly mtime?: number;

	/**
	 * The etag of the file. This can be used to prevent dirty writes.
	 */
	readonly etag?: string;

	/**
	 * Whether to attempt to unlock a file before writing.
	 */
	readonly unlock?: boolean;

	/**
	 * The optional `atomic` flag can be used to make sure
	 * the `writeFile` method updates the target file atomically
	 * by first writing to a temporary file in the same folder
	 * and then renaming it over the target.
	 */
	readonly atomic?: IFileAtomicOptions | false;
}

export interface IResolveFileOptions {

	/**
	 * Automatically continue resolving children of a directory until the provided resources
	 * are found.
	 */
	readonly resolveTo?: readonly URI[];

	/**
	 * Automatically continue resolving children of a directory if the number of children is 1.
	 */
	readonly resolveSingleChildDescendants?: boolean;

	/**
	 * Will resolve mtime, ctime, size and etag of files if enabled. This can have a negative impact
	 * on performance and thus should only be used when these values are required.
	 */
	readonly resolveMetadata?: boolean;
}

export interface IResolveMetadataFileOptions extends IResolveFileOptions {
	readonly resolveMetadata: true;
}

export interface ICreateFileOptions {

	/**
	 * Overwrite the file to create if it already exists on disk. Otherwise
	 * an error will be thrown (FILE_MODIFIED_SINCE).
	 */
	readonly overwrite?: boolean;
}

export class FileOperationError extends Error {
	constructor(
		message: string,
		readonly fileOperationResult: FileOperationResult,
		readonly options?: IReadFileOptions | IWriteFileOptions | ICreateFileOptions
	) {
		super(message);
	}
}

export class TooLargeFileOperationError extends FileOperationError {
	constructor(
		message: string,
		override readonly fileOperationResult: FileOperationResult.FILE_TOO_LARGE,
		readonly size: number,
		options?: IReadFileOptions
	) {
		super(message, fileOperationResult, options);
	}
}

export class NotModifiedSinceFileOperationError extends FileOperationError {

	constructor(
		message: string,
		readonly stat: IFileStatWithMetadata,
		options?: IReadFileOptions
	) {
		super(message, FileOperationResult.FILE_NOT_MODIFIED_SINCE, options);
	}
}

export const enum FileOperationResult {
	FILE_IS_DIRECTORY,
	FILE_NOT_FOUND,
	FILE_NOT_MODIFIED_SINCE,
	FILE_MODIFIED_SINCE,
	FILE_MOVE_CONFLICT,
	FILE_WRITE_LOCKED,
	FILE_PERMISSION_DENIED,
	FILE_TOO_LARGE,
	FILE_INVALID_PATH,
	FILE_NOT_DIRECTORY,
	FILE_OTHER_ERROR
}

//#endregion

//#region Settings

export const AutoSaveConfiguration = {
	OFF: 'off',
	AFTER_DELAY: 'afterDelay',
	ON_FOCUS_CHANGE: 'onFocusChange',
	ON_WINDOW_CHANGE: 'onWindowChange'
};

export const HotExitConfiguration = {
	OFF: 'off',
	ON_EXIT: 'onExit',
	ON_EXIT_AND_WINDOW_CLOSE: 'onExitAndWindowClose'
};

export const FILES_ASSOCIATIONS_CONFIG = 'files.associations';
export const FILES_EXCLUDE_CONFIG = 'files.exclude';
export const FILES_READONLY_INCLUDE_CONFIG = 'files.readonlyInclude';
export const FILES_READONLY_EXCLUDE_CONFIG = 'files.readonlyExclude';
export const FILES_READONLY_FROM_PERMISSIONS_CONFIG = 'files.readonlyFromPermissions';

export interface IGlobPatterns {
	[filepattern: string]: boolean;
}

export interface IFilesConfiguration {
	files?: IFilesConfigurationNode;
}

export interface IFilesConfigurationNode {
	associations: { [filepattern: string]: string };
	exclude: IExpression;
	watcherExclude: IGlobPatterns;
	watcherInclude: string[];
	encoding: string;
	autoGuessEncoding: boolean;
	candidateGuessEncodings: string[];
	defaultLanguage: string;
	trimTrailingWhitespace: boolean;
	autoSave: string;
	autoSaveDelay: number;
	autoSaveWorkspaceFilesOnly: boolean;
	autoSaveWhenNoErrors: boolean;
	eol: string;
	enableTrash: boolean;
	hotExit: string;
	saveConflictResolution: 'askUser' | 'overwriteFileOnDisk';
	readonlyInclude: IGlobPatterns;
	readonlyExclude: IGlobPatterns;
	readonlyFromPermissions: boolean;
}

//#endregion

//#region Utilities

export enum FileKind {
	FILE,
	FOLDER,
	ROOT_FOLDER
}

/**
 * A hint to disable etag checking for reading/writing.
 */
export const ETAG_DISABLED = '';

export function etag(stat: { mtime: number; size: number }): string;
export function etag(stat: { mtime: number | undefined; size: number | undefined }): string | undefined;
export function etag(stat: { mtime: number | undefined; size: number | undefined }): string | undefined {
	if (typeof stat.size !== 'number' || typeof stat.mtime !== 'number') {
		return undefined;
	}

	return stat.mtime.toString(29) + stat.size.toString(31);
}

export async function whenProviderRegistered(file: URI, fileService: IFileService): Promise<void> {
	if (fileService.hasProvider(URI.from({ scheme: file.scheme }))) {
		return;
	}

	return new Promise(resolve => {
		const disposable = fileService.onDidChangeFileSystemProviderRegistrations(e => {
			if (e.scheme === file.scheme && e.added) {
				disposable.dispose();
				resolve();
			}
		});
	});
}

/**
 * Helper to format a raw byte size into a human readable label.
 */
export class ByteSize {

	static readonly KB = 1024;
	static readonly MB = ByteSize.KB * ByteSize.KB;
	static readonly GB = ByteSize.MB * ByteSize.KB;
	static readonly TB = ByteSize.GB * ByteSize.KB;

	static formatSize(size: number): string {
		if (!isNumber(size)) {
			size = 0;
		}

		if (size < ByteSize.KB) {
			return localize('sizeB', "{0}B", size.toFixed(0));
		}

		if (size < ByteSize.MB) {
			return localize('sizeKB', "{0}KB", (size / ByteSize.KB).toFixed(2));
		}

		if (size < ByteSize.GB) {
			return localize('sizeMB', "{0}MB", (size / ByteSize.MB).toFixed(2));
		}

		if (size < ByteSize.TB) {
			return localize('sizeGB', "{0}GB", (size / ByteSize.GB).toFixed(2));
		}

		return localize('sizeTB', "{0}TB", (size / ByteSize.TB).toFixed(2));
	}
}

// File limits

export function getLargeFileConfirmationLimit(remoteAuthority?: string): number;
export function getLargeFileConfirmationLimit(uri?: URI): number;
export function getLargeFileConfirmationLimit(arg?: string | URI): number {
	const isRemote = typeof arg === 'string' || arg?.scheme === Schemas.vscodeRemote;
	const isLocal = typeof arg !== 'string' && arg?.scheme === Schemas.file;

	if (isLocal) {
		// Local almost has no limit in file size
		return 1024 * ByteSize.MB;
	}

	if (isRemote) {
		// With a remote, pick a low limit to avoid
		// potentially costly file transfers
		return 10 * ByteSize.MB;
	}

	if (isWeb) {
		// Web: we cannot know for sure if a cost
		// is associated with the file transfer
		// so we pick a reasonably small limit
		return 50 * ByteSize.MB;
	}

	// Local desktop: almost no limit in file size
	return 1024 * ByteSize.MB;
}

//#endregion
```

--------------------------------------------------------------------------------

````

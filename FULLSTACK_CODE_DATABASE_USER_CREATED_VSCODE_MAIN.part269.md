---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 269
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 269 of 552)

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

---[FILE: src/vs/platform/extensionManagement/common/extensionsScannerService.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/common/extensionsScannerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { coalesce } from '../../../base/common/arrays.js';
import { ThrottledDelayer } from '../../../base/common/async.js';
import * as objects from '../../../base/common/objects.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { getErrorMessage } from '../../../base/common/errors.js';
import { getNodeType, parse, ParseError } from '../../../base/common/json.js';
import { getParseErrorMessage } from '../../../base/common/jsonErrorMessages.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { FileAccess, Schemas } from '../../../base/common/network.js';
import * as path from '../../../base/common/path.js';
import * as platform from '../../../base/common/platform.js';
import { basename, isEqual, joinPath } from '../../../base/common/resources.js';
import * as semver from '../../../base/common/semver/semver.js';
import Severity from '../../../base/common/severity.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { IProductVersion, Metadata } from './extensionManagement.js';
import { areSameExtensions, computeTargetPlatform, getExtensionId, getGalleryExtensionId } from './extensionManagementUtil.js';
import { ExtensionType, ExtensionIdentifier, IExtensionManifest, TargetPlatform, IExtensionIdentifier, IRelaxedExtensionManifest, UNDEFINED_PUBLISHER, IExtensionDescription, BUILTIN_MANIFEST_CACHE_FILE, USER_MANIFEST_CACHE_FILE, ExtensionIdentifierMap, parseEnabledApiProposalNames } from '../../extensions/common/extensions.js';
import { validateExtensionManifest } from '../../extensions/common/extensionValidator.js';
import { FileOperationResult, IFileService, toFileOperationResult } from '../../files/common/files.js';
import { createDecorator, IInstantiationService } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';
import { IProductService } from '../../product/common/productService.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { revive } from '../../../base/common/marshalling.js';
import { ExtensionsProfileScanningError, ExtensionsProfileScanningErrorCode, IExtensionsProfileScannerService, IProfileExtensionsScanOptions, IScannedProfileExtension } from './extensionsProfileScannerService.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { localizeManifest } from './extensionNls.js';

export type ManifestMetadata = Partial<{
	targetPlatform: TargetPlatform;
	installedTimestamp: number;
	size: number;
}>;

export type IScannedExtensionManifest = IRelaxedExtensionManifest & { __metadata?: ManifestMetadata };

interface IRelaxedScannedExtension {
	type: ExtensionType;
	isBuiltin: boolean;
	identifier: IExtensionIdentifier;
	manifest: IRelaxedExtensionManifest;
	location: URI;
	targetPlatform: TargetPlatform;
	publisherDisplayName?: string;
	metadata: Metadata | undefined;
	isValid: boolean;
	validations: readonly [Severity, string][];
	preRelease: boolean;
}

export type IScannedExtension = Readonly<IRelaxedScannedExtension> & { manifest: IExtensionManifest };

export interface Translations {
	[id: string]: string;
}

export namespace Translations {
	export function equals(a: Translations, b: Translations): boolean {
		if (a === b) {
			return true;
		}
		const aKeys = Object.keys(a);
		const bKeys: Set<string> = new Set<string>();
		for (const key of Object.keys(b)) {
			bKeys.add(key);
		}
		if (aKeys.length !== bKeys.size) {
			return false;
		}

		for (const key of aKeys) {
			if (a[key] !== b[key]) {
				return false;
			}
			bKeys.delete(key);
		}
		return bKeys.size === 0;
	}
}

interface MessageBag {
	[key: string]: string | { message: string; comment: string[] };
}

interface TranslationBundle {
	contents: {
		package: MessageBag;
	};
}

interface LocalizedMessages {
	values: MessageBag | undefined;
	default: URI | null;
}

interface IBuiltInExtensionControl {
	[name: string]: 'marketplace' | 'disabled' | string;
}

export type SystemExtensionsScanOptions = {
	readonly checkControlFile?: boolean;
	readonly language?: string;
};

export type UserExtensionsScanOptions = {
	readonly profileLocation: URI;
	readonly includeInvalid?: boolean;
	readonly language?: string;
	readonly useCache?: boolean;
	readonly productVersion?: IProductVersion;
};

export type ScanOptions = {
	readonly includeInvalid?: boolean;
	readonly language?: string;
};

export const IExtensionsScannerService = createDecorator<IExtensionsScannerService>('IExtensionsScannerService');
export interface IExtensionsScannerService {
	readonly _serviceBrand: undefined;

	readonly systemExtensionsLocation: URI;
	readonly userExtensionsLocation: URI;
	readonly onDidChangeCache: Event<ExtensionType>;

	scanAllExtensions(systemScanOptions: SystemExtensionsScanOptions, userScanOptions: UserExtensionsScanOptions): Promise<IScannedExtension[]>;
	scanSystemExtensions(scanOptions: SystemExtensionsScanOptions): Promise<IScannedExtension[]>;
	scanUserExtensions(scanOptions: UserExtensionsScanOptions): Promise<IScannedExtension[]>;
	scanAllUserExtensions(): Promise<IScannedExtension[]>;

	scanExtensionsUnderDevelopment(existingExtensions: IScannedExtension[], scanOptions: ScanOptions): Promise<IScannedExtension[]>;
	scanExistingExtension(extensionLocation: URI, extensionType: ExtensionType, scanOptions: ScanOptions): Promise<IScannedExtension | null>;
	scanMultipleExtensions(extensionLocations: URI[], extensionType: ExtensionType, scanOptions: ScanOptions): Promise<IScannedExtension[]>;
	scanOneOrMultipleExtensions(extensionLocation: URI, extensionType: ExtensionType, scanOptions: ScanOptions): Promise<IScannedExtension[]>;

	updateManifestMetadata(extensionLocation: URI, metadata: ManifestMetadata): Promise<void>;
	initializeDefaultProfileExtensions(): Promise<void>;
}

export abstract class AbstractExtensionsScannerService extends Disposable implements IExtensionsScannerService {

	readonly _serviceBrand: undefined;

	protected abstract getTranslations(language: string): Promise<Translations>;

	private readonly _onDidChangeCache = this._register(new Emitter<ExtensionType>());
	readonly onDidChangeCache = this._onDidChangeCache.event;

	private readonly systemExtensionsCachedScanner: CachedExtensionsScanner;
	private readonly userExtensionsCachedScanner: CachedExtensionsScanner;
	private readonly extensionsScanner: ExtensionsScanner;

	constructor(
		readonly systemExtensionsLocation: URI,
		readonly userExtensionsLocation: URI,
		private readonly extensionsControlLocation: URI,
		currentProfile: IUserDataProfile,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IExtensionsProfileScannerService protected readonly extensionsProfileScannerService: IExtensionsProfileScannerService,
		@IFileService protected readonly fileService: IFileService,
		@ILogService protected readonly logService: ILogService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@IProductService private readonly productService: IProductService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();

		this.systemExtensionsCachedScanner = this._register(this.instantiationService.createInstance(CachedExtensionsScanner, currentProfile));
		this.userExtensionsCachedScanner = this._register(this.instantiationService.createInstance(CachedExtensionsScanner, currentProfile));
		this.extensionsScanner = this._register(this.instantiationService.createInstance(ExtensionsScanner));

		this._register(this.systemExtensionsCachedScanner.onDidChangeCache(() => this._onDidChangeCache.fire(ExtensionType.System)));
		this._register(this.userExtensionsCachedScanner.onDidChangeCache(() => this._onDidChangeCache.fire(ExtensionType.User)));
	}

	private _targetPlatformPromise: Promise<TargetPlatform> | undefined;
	private getTargetPlatform(): Promise<TargetPlatform> {
		if (!this._targetPlatformPromise) {
			this._targetPlatformPromise = computeTargetPlatform(this.fileService, this.logService);
		}
		return this._targetPlatformPromise;
	}

	async scanAllExtensions(systemScanOptions: SystemExtensionsScanOptions, userScanOptions: UserExtensionsScanOptions): Promise<IScannedExtension[]> {
		const [system, user] = await Promise.all([
			this.scanSystemExtensions(systemScanOptions),
			this.scanUserExtensions(userScanOptions),
		]);
		return this.dedupExtensions(system, user, [], await this.getTargetPlatform(), true);
	}

	async scanSystemExtensions(scanOptions: SystemExtensionsScanOptions): Promise<IScannedExtension[]> {
		const promises: Promise<IRelaxedScannedExtension[]>[] = [];
		promises.push(this.scanDefaultSystemExtensions(scanOptions.language));
		promises.push(this.scanDevSystemExtensions(scanOptions.language, !!scanOptions.checkControlFile));
		const [defaultSystemExtensions, devSystemExtensions] = await Promise.all(promises);
		return this.applyScanOptions([...defaultSystemExtensions, ...devSystemExtensions], ExtensionType.System, { pickLatest: false });
	}

	async scanUserExtensions(scanOptions: UserExtensionsScanOptions): Promise<IScannedExtension[]> {
		this.logService.trace('Started scanning user extensions', scanOptions.profileLocation);
		const profileScanOptions: IProfileExtensionsScanOptions | undefined = this.uriIdentityService.extUri.isEqual(scanOptions.profileLocation, this.userDataProfilesService.defaultProfile.extensionsResource) ? { bailOutWhenFileNotFound: true } : undefined;
		const extensionsScannerInput = await this.createExtensionScannerInput(scanOptions.profileLocation, true, ExtensionType.User, scanOptions.language, true, profileScanOptions, scanOptions.productVersion ?? this.getProductVersion());
		const extensionsScanner = scanOptions.useCache && !extensionsScannerInput.devMode ? this.userExtensionsCachedScanner : this.extensionsScanner;
		let extensions: IRelaxedScannedExtension[];
		try {
			extensions = await extensionsScanner.scanExtensions(extensionsScannerInput);
		} catch (error) {
			if (error instanceof ExtensionsProfileScanningError && error.code === ExtensionsProfileScanningErrorCode.ERROR_PROFILE_NOT_FOUND) {
				await this.doInitializeDefaultProfileExtensions();
				extensions = await extensionsScanner.scanExtensions(extensionsScannerInput);
			} else {
				throw error;
			}
		}
		extensions = await this.applyScanOptions(extensions, ExtensionType.User, { includeInvalid: scanOptions.includeInvalid, pickLatest: true });
		this.logService.trace('Scanned user extensions:', extensions.length);
		return extensions;
	}

	async scanAllUserExtensions(scanOptions: { includeAllVersions?: boolean; includeInvalid: boolean } = { includeInvalid: true, includeAllVersions: true }): Promise<IScannedExtension[]> {
		const extensionsScannerInput = await this.createExtensionScannerInput(this.userExtensionsLocation, false, ExtensionType.User, undefined, true, undefined, this.getProductVersion());
		const extensions = await this.extensionsScanner.scanExtensions(extensionsScannerInput);
		return this.applyScanOptions(extensions, ExtensionType.User, { includeAllVersions: scanOptions.includeAllVersions, includeInvalid: scanOptions.includeInvalid });
	}

	async scanExtensionsUnderDevelopment(existingExtensions: IScannedExtension[], scanOptions: ScanOptions): Promise<IScannedExtension[]> {
		if (this.environmentService.isExtensionDevelopment && this.environmentService.extensionDevelopmentLocationURI) {
			const extensions = (await Promise.all(this.environmentService.extensionDevelopmentLocationURI.filter(extLoc => extLoc.scheme === Schemas.file)
				.map(async extensionDevelopmentLocationURI => {
					const input = await this.createExtensionScannerInput(extensionDevelopmentLocationURI, false, ExtensionType.User, scanOptions.language, false /* do not validate */, undefined, this.getProductVersion());
					const extensions = await this.extensionsScanner.scanOneOrMultipleExtensions(input);
					return extensions.map(extension => {
						// Override the extension type from the existing extensions
						extension.type = existingExtensions.find(e => areSameExtensions(e.identifier, extension.identifier))?.type ?? extension.type;
						// Validate the extension
						return this.extensionsScanner.validate(extension, input);
					});
				})))
				.flat();
			return this.applyScanOptions(extensions, 'development', { includeInvalid: scanOptions.includeInvalid, pickLatest: true });
		}
		return [];
	}

	async scanExistingExtension(extensionLocation: URI, extensionType: ExtensionType, scanOptions: ScanOptions): Promise<IScannedExtension | null> {
		const extensionsScannerInput = await this.createExtensionScannerInput(extensionLocation, false, extensionType, scanOptions.language, true, undefined, this.getProductVersion());
		const extension = await this.extensionsScanner.scanExtension(extensionsScannerInput);
		if (!extension) {
			return null;
		}
		if (!scanOptions.includeInvalid && !extension.isValid) {
			return null;
		}
		return extension;
	}

	async scanOneOrMultipleExtensions(extensionLocation: URI, extensionType: ExtensionType, scanOptions: ScanOptions): Promise<IScannedExtension[]> {
		const extensionsScannerInput = await this.createExtensionScannerInput(extensionLocation, false, extensionType, scanOptions.language, true, undefined, this.getProductVersion());
		const extensions = await this.extensionsScanner.scanOneOrMultipleExtensions(extensionsScannerInput);
		return this.applyScanOptions(extensions, extensionType, { includeInvalid: scanOptions.includeInvalid, pickLatest: true });
	}

	async scanMultipleExtensions(extensionLocations: URI[], extensionType: ExtensionType, scanOptions: ScanOptions): Promise<IScannedExtension[]> {
		const extensions: IRelaxedScannedExtension[] = [];
		await Promise.all(extensionLocations.map(async extensionLocation => {
			const scannedExtensions = await this.scanOneOrMultipleExtensions(extensionLocation, extensionType, scanOptions);
			extensions.push(...scannedExtensions);
		}));
		return this.applyScanOptions(extensions, extensionType, { includeInvalid: scanOptions.includeInvalid, pickLatest: true });
	}

	async updateManifestMetadata(extensionLocation: URI, metaData: ManifestMetadata): Promise<void> {
		const manifestLocation = joinPath(extensionLocation, 'package.json');
		const content = (await this.fileService.readFile(manifestLocation)).value.toString();
		const manifest: IScannedExtensionManifest = JSON.parse(content);
		manifest.__metadata = { ...manifest.__metadata, ...metaData };

		await this.fileService.writeFile(joinPath(extensionLocation, 'package.json'), VSBuffer.fromString(JSON.stringify(manifest, null, '\t')));
	}

	async initializeDefaultProfileExtensions(): Promise<void> {
		try {
			await this.extensionsProfileScannerService.scanProfileExtensions(this.userDataProfilesService.defaultProfile.extensionsResource, { bailOutWhenFileNotFound: true });
		} catch (error) {
			if (error instanceof ExtensionsProfileScanningError && error.code === ExtensionsProfileScanningErrorCode.ERROR_PROFILE_NOT_FOUND) {
				await this.doInitializeDefaultProfileExtensions();
			} else {
				throw error;
			}
		}
	}

	private initializeDefaultProfileExtensionsPromise: Promise<void> | undefined = undefined;
	private async doInitializeDefaultProfileExtensions(): Promise<void> {
		if (!this.initializeDefaultProfileExtensionsPromise) {
			this.initializeDefaultProfileExtensionsPromise = (async () => {
				try {
					this.logService.info('Started initializing default profile extensions in extensions installation folder.', this.userExtensionsLocation.toString());
					const userExtensions = await this.scanAllUserExtensions({ includeInvalid: true });
					if (userExtensions.length) {
						await this.extensionsProfileScannerService.addExtensionsToProfile(userExtensions.map(e => [e, e.metadata]), this.userDataProfilesService.defaultProfile.extensionsResource);
					} else {
						try {
							await this.fileService.createFile(this.userDataProfilesService.defaultProfile.extensionsResource, VSBuffer.fromString(JSON.stringify([])));
						} catch (error) {
							if (toFileOperationResult(error) !== FileOperationResult.FILE_NOT_FOUND) {
								this.logService.warn('Failed to create default profile extensions manifest in extensions installation folder.', this.userExtensionsLocation.toString(), getErrorMessage(error));
							}
						}
					}
					this.logService.info('Completed initializing default profile extensions in extensions installation folder.', this.userExtensionsLocation.toString());
				} catch (error) {
					this.logService.error(error);
				} finally {
					this.initializeDefaultProfileExtensionsPromise = undefined;
				}
			})();
		}
		return this.initializeDefaultProfileExtensionsPromise;
	}

	private async applyScanOptions(extensions: IRelaxedScannedExtension[], type: ExtensionType | 'development', scanOptions: { includeAllVersions?: boolean; includeInvalid?: boolean; pickLatest?: boolean } = {}): Promise<IRelaxedScannedExtension[]> {
		if (!scanOptions.includeAllVersions) {
			extensions = this.dedupExtensions(type === ExtensionType.System ? extensions : undefined, type === ExtensionType.User ? extensions : undefined, type === 'development' ? extensions : undefined, await this.getTargetPlatform(), !!scanOptions.pickLatest);
		}
		if (!scanOptions.includeInvalid) {
			extensions = extensions.filter(extension => extension.isValid);
		}
		return extensions.sort((a, b) => {
			const aLastSegment = path.basename(a.location.fsPath);
			const bLastSegment = path.basename(b.location.fsPath);
			if (aLastSegment < bLastSegment) {
				return -1;
			}
			if (aLastSegment > bLastSegment) {
				return 1;
			}
			return 0;
		});
	}

	private dedupExtensions(system: IScannedExtension[] | undefined, user: IScannedExtension[] | undefined, development: IScannedExtension[] | undefined, targetPlatform: TargetPlatform, pickLatest: boolean): IScannedExtension[] {
		const pick = (existing: IScannedExtension, extension: IScannedExtension, isDevelopment: boolean): boolean => {
			if (!isDevelopment) {
				if (existing.metadata?.isApplicationScoped && !extension.metadata?.isApplicationScoped) {
					return false;
				}
				if (!existing.metadata?.isApplicationScoped && extension.metadata?.isApplicationScoped) {
					return true;
				}
			}
			if (existing.isValid && !extension.isValid) {
				return false;
			}
			if (existing.isValid === extension.isValid) {
				if (pickLatest && semver.gt(existing.manifest.version, extension.manifest.version)) {
					this.logService.debug(`Skipping extension ${extension.location.path} with lower version ${extension.manifest.version} in favour of ${existing.location.path} with version ${existing.manifest.version}`);
					return false;
				}
				if (semver.eq(existing.manifest.version, extension.manifest.version)) {
					if (existing.type === ExtensionType.System) {
						this.logService.debug(`Skipping extension ${extension.location.path} in favour of system extension ${existing.location.path} with same version`);
						return false;
					}
					if (existing.targetPlatform === targetPlatform) {
						this.logService.debug(`Skipping extension ${extension.location.path} from different target platform ${extension.targetPlatform}`);
						return false;
					}
				}
			}
			if (isDevelopment) {
				this.logService.warn(`Overwriting user extension ${existing.location.path} with ${extension.location.path}.`);
			} else {
				this.logService.debug(`Overwriting user extension ${existing.location.path} with ${extension.location.path}.`);
			}
			return true;
		};
		const result = new ExtensionIdentifierMap<IScannedExtension>();
		system?.forEach((extension) => {
			const existing = result.get(extension.identifier.id);
			if (!existing || pick(existing, extension, false)) {
				result.set(extension.identifier.id, extension);
			}
		});
		user?.forEach((extension) => {
			const existing = result.get(extension.identifier.id);
			if (!existing && system && extension.type === ExtensionType.System) {
				this.logService.debug(`Skipping obsolete system extension ${extension.location.path}.`);
				return;
			}
			if (!existing || pick(existing, extension, false)) {
				result.set(extension.identifier.id, extension);
			}
		});
		development?.forEach(extension => {
			const existing = result.get(extension.identifier.id);
			if (!existing || pick(existing, extension, true)) {
				result.set(extension.identifier.id, extension);
			}
			result.set(extension.identifier.id, extension);
		});
		return [...result.values()];
	}

	private async scanDefaultSystemExtensions(language: string | undefined): Promise<IRelaxedScannedExtension[]> {
		this.logService.trace('Started scanning system extensions');
		const extensionsScannerInput = await this.createExtensionScannerInput(this.systemExtensionsLocation, false, ExtensionType.System, language, true, undefined, this.getProductVersion());
		const extensionsScanner = extensionsScannerInput.devMode ? this.extensionsScanner : this.systemExtensionsCachedScanner;
		const result = await extensionsScanner.scanExtensions(extensionsScannerInput);
		this.logService.trace('Scanned system extensions:', result.length);
		return result;
	}

	private async scanDevSystemExtensions(language: string | undefined, checkControlFile: boolean): Promise<IRelaxedScannedExtension[]> {
		const devSystemExtensionsList = this.environmentService.isBuilt ? [] : this.productService.builtInExtensions;
		if (!devSystemExtensionsList?.length) {
			return [];
		}

		this.logService.trace('Started scanning dev system extensions');
		const builtinExtensionControl = checkControlFile ? await this.getBuiltInExtensionControl() : {};
		const devSystemExtensionsLocations: URI[] = [];
		const devSystemExtensionsLocation = URI.file(path.normalize(path.join(FileAccess.asFileUri('').fsPath, '..', '.build', 'builtInExtensions')));
		for (const extension of devSystemExtensionsList) {
			const controlState = builtinExtensionControl[extension.name] || 'marketplace';
			switch (controlState) {
				case 'disabled':
					break;
				case 'marketplace':
					devSystemExtensionsLocations.push(joinPath(devSystemExtensionsLocation, extension.name));
					break;
				default:
					devSystemExtensionsLocations.push(URI.file(controlState));
					break;
			}
		}
		const result = await Promise.all(devSystemExtensionsLocations.map(async location => this.extensionsScanner.scanExtension((await this.createExtensionScannerInput(location, false, ExtensionType.System, language, true, undefined, this.getProductVersion())))));
		this.logService.trace('Scanned dev system extensions:', result.length);
		return coalesce(result);
	}

	private async getBuiltInExtensionControl(): Promise<IBuiltInExtensionControl> {
		try {
			const content = await this.fileService.readFile(this.extensionsControlLocation);
			return JSON.parse(content.value.toString());
		} catch (error) {
			return {};
		}
	}

	private async createExtensionScannerInput(location: URI, profile: boolean, type: ExtensionType, language: string | undefined, validate: boolean, profileScanOptions: IProfileExtensionsScanOptions | undefined, productVersion: IProductVersion): Promise<ExtensionScannerInput> {
		const translations = await this.getTranslations(language ?? platform.language);
		const mtime = await this.getMtime(location);
		const applicationExtensionsLocation = profile && !this.uriIdentityService.extUri.isEqual(location, this.userDataProfilesService.defaultProfile.extensionsResource) ? this.userDataProfilesService.defaultProfile.extensionsResource : undefined;
		const applicationExtensionsLocationMtime = applicationExtensionsLocation ? await this.getMtime(applicationExtensionsLocation) : undefined;
		return new ExtensionScannerInput(
			location,
			mtime,
			applicationExtensionsLocation,
			applicationExtensionsLocationMtime,
			profile,
			profileScanOptions,
			type,
			validate,
			productVersion.version,
			productVersion.date,
			this.productService.commit,
			!this.environmentService.isBuilt,
			language,
			translations,
		);
	}

	private async getMtime(location: URI): Promise<number | undefined> {
		try {
			const stat = await this.fileService.stat(location);
			if (typeof stat.mtime === 'number') {
				return stat.mtime;
			}
		} catch (err) {
			// That's ok...
		}
		return undefined;
	}

	private getProductVersion(): IProductVersion {
		return {
			version: this.productService.version,
			date: this.productService.date,
		};
	}

}

export class ExtensionScannerInput {

	constructor(
		public readonly location: URI,
		public readonly mtime: number | undefined,
		public readonly applicationExtensionslocation: URI | undefined,
		public readonly applicationExtensionslocationMtime: number | undefined,
		public readonly profile: boolean,
		public readonly profileScanOptions: IProfileExtensionsScanOptions | undefined,
		public readonly type: ExtensionType,
		public readonly validate: boolean,
		public readonly productVersion: string,
		public readonly productDate: string | undefined,
		public readonly productCommit: string | undefined,
		public readonly devMode: boolean,
		public readonly language: string | undefined,
		public readonly translations: Translations
	) {
		// Keep empty!! (JSON.parse)
	}

	public static createNlsConfiguration(input: ExtensionScannerInput): NlsConfiguration {
		return {
			language: input.language,
			pseudo: input.language === 'pseudo',
			devMode: input.devMode,
			translations: input.translations
		};
	}

	public static equals(a: ExtensionScannerInput, b: ExtensionScannerInput): boolean {
		return (
			isEqual(a.location, b.location)
			&& a.mtime === b.mtime
			&& isEqual(a.applicationExtensionslocation, b.applicationExtensionslocation)
			&& a.applicationExtensionslocationMtime === b.applicationExtensionslocationMtime
			&& a.profile === b.profile
			&& objects.equals(a.profileScanOptions, b.profileScanOptions)
			&& a.type === b.type
			&& a.validate === b.validate
			&& a.productVersion === b.productVersion
			&& a.productDate === b.productDate
			&& a.productCommit === b.productCommit
			&& a.devMode === b.devMode
			&& a.language === b.language
			&& Translations.equals(a.translations, b.translations)
		);
	}
}

type NlsConfiguration = {
	language: string | undefined;
	pseudo: boolean;
	devMode: boolean;
	translations: Translations;
};

class ExtensionsScanner extends Disposable {

	private readonly extensionsEnabledWithApiProposalVersion: string[];

	constructor(
		@IExtensionsProfileScannerService protected readonly extensionsProfileScannerService: IExtensionsProfileScannerService,
		@IUriIdentityService protected readonly uriIdentityService: IUriIdentityService,
		@IFileService protected readonly fileService: IFileService,
		@IProductService productService: IProductService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@ILogService protected readonly logService: ILogService
	) {
		super();
		this.extensionsEnabledWithApiProposalVersion = productService.extensionsEnabledWithApiProposalVersion?.map(id => id.toLowerCase()) ?? [];
	}

	async scanExtensions(input: ExtensionScannerInput): Promise<IRelaxedScannedExtension[]> {
		return input.profile
			? this.scanExtensionsFromProfile(input)
			: this.scanExtensionsFromLocation(input);
	}

	private async scanExtensionsFromLocation(input: ExtensionScannerInput): Promise<IRelaxedScannedExtension[]> {
		const stat = await this.fileService.resolve(input.location);
		if (!stat.children?.length) {
			return [];
		}
		const extensions = await Promise.all<IRelaxedScannedExtension | null>(
			stat.children.map(async c => {
				if (!c.isDirectory) {
					return null;
				}
				// Do not consider user extension folder starting with `.`
				if (input.type === ExtensionType.User && basename(c.resource).indexOf('.') === 0) {
					return null;
				}
				const extensionScannerInput = new ExtensionScannerInput(c.resource, input.mtime, input.applicationExtensionslocation, input.applicationExtensionslocationMtime, input.profile, input.profileScanOptions, input.type, input.validate, input.productVersion, input.productDate, input.productCommit, input.devMode, input.language, input.translations);
				return this.scanExtension(extensionScannerInput);
			}));
		return coalesce(extensions)
			// Sort: Make sure extensions are in the same order always. Helps cache invalidation even if the order changes.
			.sort((a, b) => a.location.path < b.location.path ? -1 : 1);
	}

	private async scanExtensionsFromProfile(input: ExtensionScannerInput): Promise<IRelaxedScannedExtension[]> {
		let profileExtensions = await this.scanExtensionsFromProfileResource(input.location, () => true, input);
		if (input.applicationExtensionslocation && !this.uriIdentityService.extUri.isEqual(input.location, input.applicationExtensionslocation)) {
			profileExtensions = profileExtensions.filter(e => !e.metadata?.isApplicationScoped);
			const applicationExtensions = await this.scanExtensionsFromProfileResource(input.applicationExtensionslocation, (e) => !!e.metadata?.isBuiltin || !!e.metadata?.isApplicationScoped, input);
			profileExtensions.push(...applicationExtensions);
		}
		return profileExtensions;
	}

	private async scanExtensionsFromProfileResource(profileResource: URI, filter: (extensionInfo: IScannedProfileExtension) => boolean, input: ExtensionScannerInput): Promise<IRelaxedScannedExtension[]> {
		const scannedProfileExtensions = await this.extensionsProfileScannerService.scanProfileExtensions(profileResource, input.profileScanOptions);
		if (!scannedProfileExtensions.length) {
			return [];
		}
		const extensions = await Promise.all<IRelaxedScannedExtension | null>(
			scannedProfileExtensions.map(async extensionInfo => {
				if (filter(extensionInfo)) {
					const extensionScannerInput = new ExtensionScannerInput(extensionInfo.location, input.mtime, input.applicationExtensionslocation, input.applicationExtensionslocationMtime, input.profile, input.profileScanOptions, input.type, input.validate, input.productVersion, input.productDate, input.productCommit, input.devMode, input.language, input.translations);
					return this.scanExtension(extensionScannerInput, extensionInfo);
				}
				return null;
			}));
		return coalesce(extensions);
	}

	async scanOneOrMultipleExtensions(input: ExtensionScannerInput): Promise<IRelaxedScannedExtension[]> {
		try {
			if (await this.fileService.exists(joinPath(input.location, 'package.json'))) {
				const extension = await this.scanExtension(input);
				return extension ? [extension] : [];
			} else {
				return await this.scanExtensions(input);
			}
		} catch (error) {
			this.logService.error(`Error scanning extensions at ${input.location.path}:`, getErrorMessage(error));
			return [];
		}
	}

	async scanExtension(input: ExtensionScannerInput): Promise<IRelaxedScannedExtension | null>;
	async scanExtension(input: ExtensionScannerInput, scannedProfileExtension: IScannedProfileExtension): Promise<IRelaxedScannedExtension>;
	async scanExtension(input: ExtensionScannerInput, scannedProfileExtension?: IScannedProfileExtension): Promise<IRelaxedScannedExtension | null> {
		const validations: [Severity, string][] = [];
		let isValid = true;
		let manifest: IScannedExtensionManifest;
		try {
			manifest = await this.scanExtensionManifest(input.location);
		} catch (e) {
			if (scannedProfileExtension) {
				validations.push([Severity.Error, getErrorMessage(e)]);
				isValid = false;
				const [publisher, name] = scannedProfileExtension.identifier.id.split('.');
				manifest = {
					name,
					publisher,
					version: scannedProfileExtension.version,
					engines: { vscode: '' }
				};
			} else {
				if (input.type !== ExtensionType.System) {
					this.logService.error(e);
				}
				return null;
			}
		}

		// allow publisher to be undefined to make the initial extension authoring experience smoother
		if (!manifest.publisher) {
			manifest.publisher = UNDEFINED_PUBLISHER;
		}

		let metadata: Metadata | undefined;
		if (scannedProfileExtension) {
			metadata = {
				...scannedProfileExtension.metadata,
				size: manifest.__metadata?.size,
			};
		} else if (manifest.__metadata) {
			metadata = {
				installedTimestamp: manifest.__metadata.installedTimestamp,
				size: manifest.__metadata.size,
				targetPlatform: manifest.__metadata.targetPlatform,
			};
		}

		delete manifest.__metadata;
		const id = getGalleryExtensionId(manifest.publisher, manifest.name);
		const identifier = metadata?.id ? { id, uuid: metadata.id } : { id };
		const type = metadata?.isSystem ? ExtensionType.System : input.type;
		const isBuiltin = type === ExtensionType.System || !!metadata?.isBuiltin;
		try {
			manifest = await this.translateManifest(input.location, manifest, ExtensionScannerInput.createNlsConfiguration(input));
		} catch (error) {
			this.logService.warn('Failed to translate manifest', getErrorMessage(error));
		}
		let extension: IRelaxedScannedExtension = {
			type,
			identifier,
			manifest,
			location: input.location,
			isBuiltin,
			targetPlatform: metadata?.targetPlatform ?? TargetPlatform.UNDEFINED,
			publisherDisplayName: metadata?.publisherDisplayName,
			metadata,
			isValid,
			validations,
			preRelease: !!metadata?.preRelease,
		};
		if (input.validate) {
			extension = this.validate(extension, input);
		}
		if (manifest.enabledApiProposals && (!this.environmentService.isBuilt || this.extensionsEnabledWithApiProposalVersion.includes(id.toLowerCase()))) {
			manifest.originalEnabledApiProposals = manifest.enabledApiProposals;
			manifest.enabledApiProposals = parseEnabledApiProposalNames([...manifest.enabledApiProposals]);
		}
		return extension;
	}

	validate(extension: IRelaxedScannedExtension, input: ExtensionScannerInput): IRelaxedScannedExtension {
		let isValid = extension.isValid;
		const validateApiVersion = this.environmentService.isBuilt && this.extensionsEnabledWithApiProposalVersion.includes(extension.identifier.id.toLowerCase());
		const validations = validateExtensionManifest(input.productVersion, input.productDate, input.location, extension.manifest, extension.isBuiltin, validateApiVersion);
		for (const [severity, message] of validations) {
			if (severity === Severity.Error) {
				isValid = false;
				this.logService.error(this.formatMessage(input.location, message));
			}
		}
		extension.isValid = isValid;
		extension.validations = [...extension.validations, ...validations];
		return extension;
	}

	private async scanExtensionManifest(extensionLocation: URI): Promise<IScannedExtensionManifest> {
		const manifestLocation = joinPath(extensionLocation, 'package.json');
		let content;
		try {
			content = (await this.fileService.readFile(manifestLocation)).value.toString();
		} catch (error) {
			if (toFileOperationResult(error) !== FileOperationResult.FILE_NOT_FOUND) {
				this.logService.error(this.formatMessage(extensionLocation, localize('fileReadFail', "Cannot read file {0}: {1}.", manifestLocation.path, error.message)));
			}
			throw error;
		}
		let manifest: IScannedExtensionManifest;
		try {
			manifest = JSON.parse(content);
		} catch (err) {
			// invalid JSON, let's get good errors
			const errors: ParseError[] = [];
			parse(content, errors);
			for (const e of errors) {
				this.logService.error(this.formatMessage(extensionLocation, localize('jsonParseFail', "Failed to parse {0}: [{1}, {2}] {3}.", manifestLocation.path, e.offset, e.length, getParseErrorMessage(e.error))));
			}
			throw err;
		}
		if (getNodeType(manifest) !== 'object') {
			const errorMessage = this.formatMessage(extensionLocation, localize('jsonParseInvalidType', "Invalid manifest file {0}: Not a JSON object.", manifestLocation.path));
			this.logService.error(errorMessage);
			throw new Error(errorMessage);
		}
		return manifest;
	}

	private async translateManifest(extensionLocation: URI, extensionManifest: IExtensionManifest, nlsConfiguration: NlsConfiguration): Promise<IExtensionManifest> {
		const localizedMessages = await this.getLocalizedMessages(extensionLocation, extensionManifest, nlsConfiguration);
		if (localizedMessages) {
			try {
				const errors: ParseError[] = [];
				// resolveOriginalMessageBundle returns null if localizedMessages.default === undefined;
				const defaults = await this.resolveOriginalMessageBundle(localizedMessages.default, errors);
				if (errors.length > 0) {
					errors.forEach((error) => {
						this.logService.error(this.formatMessage(extensionLocation, localize('jsonsParseReportErrors', "Failed to parse {0}: {1}.", localizedMessages.default?.path, getParseErrorMessage(error.error))));
					});
					return extensionManifest;
				} else if (getNodeType(localizedMessages) !== 'object') {
					this.logService.error(this.formatMessage(extensionLocation, localize('jsonInvalidFormat', "Invalid format {0}: JSON object expected.", localizedMessages.default?.path)));
					return extensionManifest;
				}
				const localized = localizedMessages.values || Object.create(null);
				return localizeManifest(this.logService, extensionManifest, localized, defaults);
			} catch (error) {
				/*Ignore Error*/
			}
		}
		return extensionManifest;
	}

	private async getLocalizedMessages(extensionLocation: URI, extensionManifest: IExtensionManifest, nlsConfiguration: NlsConfiguration): Promise<LocalizedMessages | undefined> {
		const defaultPackageNLS = joinPath(extensionLocation, 'package.nls.json');
		const reportErrors = (localized: URI | null, errors: ParseError[]): void => {
			errors.forEach((error) => {
				this.logService.error(this.formatMessage(extensionLocation, localize('jsonsParseReportErrors', "Failed to parse {0}: {1}.", localized?.path, getParseErrorMessage(error.error))));
			});
		};
		const reportInvalidFormat = (localized: URI | null): void => {
			this.logService.error(this.formatMessage(extensionLocation, localize('jsonInvalidFormat', "Invalid format {0}: JSON object expected.", localized?.path)));
		};

		const translationId = `${extensionManifest.publisher}.${extensionManifest.name}`;
		const translationPath = nlsConfiguration.translations[translationId];

		if (translationPath) {
			try {
				const translationResource = URI.file(translationPath);
				const content = (await this.fileService.readFile(translationResource)).value.toString();
				const errors: ParseError[] = [];
				const translationBundle: TranslationBundle = parse(content, errors);
				if (errors.length > 0) {
					reportErrors(translationResource, errors);
					return { values: undefined, default: defaultPackageNLS };
				} else if (getNodeType(translationBundle) !== 'object') {
					reportInvalidFormat(translationResource);
					return { values: undefined, default: defaultPackageNLS };
				} else {
					const values = translationBundle.contents ? translationBundle.contents.package : undefined;
					return { values: values, default: defaultPackageNLS };
				}
			} catch (error) {
				return { values: undefined, default: defaultPackageNLS };
			}
		} else {
			const exists = await this.fileService.exists(defaultPackageNLS);
			if (!exists) {
				return undefined;
			}
			let messageBundle;
			try {
				messageBundle = await this.findMessageBundles(extensionLocation, nlsConfiguration);
			} catch (error) {
				return undefined;
			}
			if (!messageBundle.localized) {
				return { values: undefined, default: messageBundle.original };
			}
			try {
				const messageBundleContent = (await this.fileService.readFile(messageBundle.localized)).value.toString();
				const errors: ParseError[] = [];
				const messages: MessageBag = parse(messageBundleContent, errors);
				if (errors.length > 0) {
					reportErrors(messageBundle.localized, errors);
					return { values: undefined, default: messageBundle.original };
				} else if (getNodeType(messages) !== 'object') {
					reportInvalidFormat(messageBundle.localized);
					return { values: undefined, default: messageBundle.original };
				}
				return { values: messages, default: messageBundle.original };
			} catch (error) {
				return { values: undefined, default: messageBundle.original };
			}
		}
	}

	/**
	 * Parses original message bundle, returns null if the original message bundle is null.
	 */
	private async resolveOriginalMessageBundle(originalMessageBundle: URI | null, errors: ParseError[]): Promise<{ [key: string]: string } | undefined> {
		if (originalMessageBundle) {
			try {
				const originalBundleContent = (await this.fileService.readFile(originalMessageBundle)).value.toString();
				return parse(originalBundleContent, errors);
			} catch (error) {
				/* Ignore Error */
			}
		}
		return;
	}

	/**
	 * Finds localized message bundle and the original (unlocalized) one.
	 * If the localized file is not present, returns null for the original and marks original as localized.
	 */
	private findMessageBundles(extensionLocation: URI, nlsConfiguration: NlsConfiguration): Promise<{ localized: URI; original: URI | null }> {
		return new Promise<{ localized: URI; original: URI | null }>((c, e) => {
			const loop = (locale: string): void => {
				const toCheck = joinPath(extensionLocation, `package.nls.${locale}.json`);
				this.fileService.exists(toCheck).then(exists => {
					if (exists) {
						c({ localized: toCheck, original: joinPath(extensionLocation, 'package.nls.json') });
					}
					const index = locale.lastIndexOf('-');
					if (index === -1) {
						c({ localized: joinPath(extensionLocation, 'package.nls.json'), original: null });
					} else {
						locale = locale.substring(0, index);
						loop(locale);
					}
				});
			};
			if (nlsConfiguration.devMode || nlsConfiguration.pseudo || !nlsConfiguration.language) {
				return c({ localized: joinPath(extensionLocation, 'package.nls.json'), original: null });
			}
			loop(nlsConfiguration.language);
		});
	}

	private formatMessage(extensionLocation: URI, message: string): string {
		return `[${extensionLocation.path}]: ${message}`;
	}

}

interface IExtensionCacheData {
	input: ExtensionScannerInput;
	result: IRelaxedScannedExtension[];
}

class CachedExtensionsScanner extends ExtensionsScanner {

	private input: ExtensionScannerInput | undefined;
	private readonly cacheValidatorThrottler: ThrottledDelayer<void> = this._register(new ThrottledDelayer(3000));

	private readonly _onDidChangeCache = this._register(new Emitter<void>());
	readonly onDidChangeCache = this._onDidChangeCache.event;

	constructor(
		private readonly currentProfile: IUserDataProfile,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IExtensionsProfileScannerService extensionsProfileScannerService: IExtensionsProfileScannerService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IFileService fileService: IFileService,
		@IProductService productService: IProductService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@ILogService logService: ILogService
	) {
		super(extensionsProfileScannerService, uriIdentityService, fileService, productService, environmentService, logService);
	}

	override async scanExtensions(input: ExtensionScannerInput): Promise<IRelaxedScannedExtension[]> {
		const cacheFile = this.getCacheFile(input);
		const cacheContents = await this.readExtensionCache(cacheFile);
		this.input = input;
		if (cacheContents && cacheContents.input && ExtensionScannerInput.equals(cacheContents.input, this.input)) {
			this.logService.debug('Using cached extensions scan result', input.type === ExtensionType.System ? 'system' : 'user', input.location.toString());
			this.cacheValidatorThrottler.trigger(() => this.validateCache());
			return cacheContents.result.map((extension) => {
				// revive URI object
				extension.location = URI.revive(extension.location);
				return extension;
			});
		}
		const result = await super.scanExtensions(input);
		await this.writeExtensionCache(cacheFile, { input, result });
		return result;
	}

	private async readExtensionCache(cacheFile: URI): Promise<IExtensionCacheData | null> {
		try {
			const cacheRawContents = await this.fileService.readFile(cacheFile);
			const extensionCacheData: IExtensionCacheData = JSON.parse(cacheRawContents.value.toString());
			return { result: extensionCacheData.result, input: revive(extensionCacheData.input) };
		} catch (error) {
			if (toFileOperationResult(error) !== FileOperationResult.FILE_NOT_FOUND) {
				this.logService.debug('Error while reading the extension cache file:', cacheFile.path, getErrorMessage(error));
			}
		}
		return null;
	}

	private async writeExtensionCache(cacheFile: URI, cacheContents: IExtensionCacheData): Promise<void> {
		try {
			await this.fileService.writeFile(cacheFile, VSBuffer.fromString(JSON.stringify(cacheContents)));
		} catch (error) {
			this.logService.debug('Error while writing the extension cache file:', cacheFile.path, getErrorMessage(error));
		}
	}

	private async validateCache(): Promise<void> {
		if (!this.input) {
			// Input has been unset by the time we get here, so skip validation
			return;
		}

		const cacheFile = this.getCacheFile(this.input);
		const cacheContents = await this.readExtensionCache(cacheFile);
		if (!cacheContents) {
			// Cache has been deleted by someone else, which is perfectly fine...
			return;
		}

		const actual = cacheContents.result;
		const expected = JSON.parse(JSON.stringify(await super.scanExtensions(this.input)));
		if (objects.equals(expected, actual)) {
			// Cache is valid and running with it is perfectly fine...
			return;
		}

		try {
			this.logService.info('Invalidating Cache', actual, expected);
			// Cache is invalid, delete it
			await this.fileService.del(cacheFile);
			this._onDidChangeCache.fire();
		} catch (error) {
			this.logService.error(error);
		}
	}

	private getCacheFile(input: ExtensionScannerInput): URI {
		const profile = this.getProfile(input);
		return this.uriIdentityService.extUri.joinPath(profile.cacheHome, input.type === ExtensionType.System ? BUILTIN_MANIFEST_CACHE_FILE : USER_MANIFEST_CACHE_FILE);
	}

	private getProfile(input: ExtensionScannerInput): IUserDataProfile {
		if (input.type === ExtensionType.System) {
			return this.userDataProfilesService.defaultProfile;
		}
		if (!input.profile) {
			return this.userDataProfilesService.defaultProfile;
		}
		if (this.uriIdentityService.extUri.isEqual(input.location, this.currentProfile.extensionsResource)) {
			return this.currentProfile;
		}
		return this.userDataProfilesService.profiles.find(p => this.uriIdentityService.extUri.isEqual(input.location, p.extensionsResource)) ?? this.currentProfile;
	}

}

export function toExtensionDescription(extension: IScannedExtension, isUnderDevelopment: boolean): IExtensionDescription {
	const id = getExtensionId(extension.manifest.publisher, extension.manifest.name);
	return {
		id,
		identifier: new ExtensionIdentifier(id),
		isBuiltin: extension.type === ExtensionType.System,
		isUserBuiltin: extension.type === ExtensionType.User && extension.isBuiltin,
		isUnderDevelopment,
		extensionLocation: extension.location,
		uuid: extension.identifier.uuid,
		targetPlatform: extension.targetPlatform,
		publisherDisplayName: extension.publisherDisplayName,
		preRelease: extension.preRelease,
		...extension.manifest,
	};
}

export class NativeExtensionsScannerService extends AbstractExtensionsScannerService implements IExtensionsScannerService {

	private readonly translationsPromise: Promise<Translations>;

	constructor(
		systemExtensionsLocation: URI,
		userExtensionsLocation: URI,
		userHome: URI,
		currentProfile: IUserDataProfile,
		userDataProfilesService: IUserDataProfilesService,
		extensionsProfileScannerService: IExtensionsProfileScannerService,
		fileService: IFileService,
		logService: ILogService,
		environmentService: IEnvironmentService,
		productService: IProductService,
		uriIdentityService: IUriIdentityService,
		instantiationService: IInstantiationService,
	) {
		super(
			systemExtensionsLocation,
			userExtensionsLocation,
			joinPath(userHome, '.vscode-oss-dev', 'extensions', 'control.json'),
			currentProfile,
			userDataProfilesService, extensionsProfileScannerService, fileService, logService, environmentService, productService, uriIdentityService, instantiationService);
		this.translationsPromise = (async () => {
			if (platform.translationsConfigFile) {
				try {
					const content = await this.fileService.readFile(URI.file(platform.translationsConfigFile));
					return JSON.parse(content.value.toString());
				} catch (err) { /* Ignore Error */ }
			}
			return Object.create(null);
		})();
	}

	protected getTranslations(language: string): Promise<Translations> {
		return this.translationsPromise;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/common/extensionStorage.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/common/extensionStorage.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../instantiation/common/instantiation.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { IProfileStorageValueChangeEvent, IStorageService, StorageScope, StorageTarget } from '../../storage/common/storage.js';
import { adoptToGalleryExtensionId, areSameExtensions, getExtensionId } from './extensionManagementUtil.js';
import { IProductService } from '../../product/common/productService.js';
import { distinct } from '../../../base/common/arrays.js';
import { ILogService } from '../../log/common/log.js';
import { IExtension } from '../../extensions/common/extensions.js';
import { isString } from '../../../base/common/types.js';
import { IStringDictionary } from '../../../base/common/collections.js';
import { IExtensionManagementService, IGalleryExtension } from './extensionManagement.js';

export interface IExtensionIdWithVersion {
	id: string;
	version: string;
}

export const IExtensionStorageService = createDecorator<IExtensionStorageService>('IExtensionStorageService');

export interface IExtensionStorageService {
	readonly _serviceBrand: undefined;

	getExtensionState(extension: IExtension | IGalleryExtension | string, global: boolean): IStringDictionary<unknown> | undefined;
	getExtensionStateRaw(extension: IExtension | IGalleryExtension | string, global: boolean): string | undefined;
	setExtensionState(extension: IExtension | IGalleryExtension | string, state: object | undefined, global: boolean): void;

	readonly onDidChangeExtensionStorageToSync: Event<void>;
	setKeysForSync(extensionIdWithVersion: IExtensionIdWithVersion, keys: string[]): void;
	getKeysForSync(extensionIdWithVersion: IExtensionIdWithVersion): string[] | undefined;

	addToMigrationList(from: string, to: string): void;
	getSourceExtensionToMigrate(target: string): string | undefined;
}

const EXTENSION_KEYS_ID_VERSION_REGEX = /^extensionKeys\/([^.]+\..+)@(\d+\.\d+\.\d+(-.*)?)$/;

export class ExtensionStorageService extends Disposable implements IExtensionStorageService {

	readonly _serviceBrand: undefined;

	private static LARGE_STATE_WARNING_THRESHOLD = 512 * 1024;

	private static toKey(extension: IExtensionIdWithVersion): string {
		return `extensionKeys/${adoptToGalleryExtensionId(extension.id)}@${extension.version}`;
	}

	private static fromKey(key: string): IExtensionIdWithVersion | undefined {
		const matches = EXTENSION_KEYS_ID_VERSION_REGEX.exec(key);
		if (matches && matches[1]) {
			return { id: matches[1], version: matches[2] };
		}
		return undefined;
	}

	/* TODO @sandy081: This has to be done across all profiles */
	static async removeOutdatedExtensionVersions(extensionManagementService: IExtensionManagementService, storageService: IStorageService): Promise<void> {
		const extensions = await extensionManagementService.getInstalled();
		const extensionVersionsToRemove: string[] = [];
		for (const [id, versions] of ExtensionStorageService.readAllExtensionsWithKeysForSync(storageService)) {
			const extensionVersion = extensions.find(e => areSameExtensions(e.identifier, { id }))?.manifest.version;
			for (const version of versions) {
				if (extensionVersion !== version) {
					extensionVersionsToRemove.push(ExtensionStorageService.toKey({ id, version }));
				}
			}
		}
		for (const key of extensionVersionsToRemove) {
			storageService.remove(key, StorageScope.PROFILE);
		}
	}

	private static readAllExtensionsWithKeysForSync(storageService: IStorageService): Map<string, string[]> {
		const extensionsWithKeysForSync = new Map<string, string[]>();
		const keys = storageService.keys(StorageScope.PROFILE, StorageTarget.MACHINE);
		for (const key of keys) {
			const extensionIdWithVersion = ExtensionStorageService.fromKey(key);
			if (extensionIdWithVersion) {
				let versions = extensionsWithKeysForSync.get(extensionIdWithVersion.id.toLowerCase());
				if (!versions) {
					extensionsWithKeysForSync.set(extensionIdWithVersion.id.toLowerCase(), versions = []);
				}
				versions.push(extensionIdWithVersion.version);
			}
		}
		return extensionsWithKeysForSync;
	}

	private readonly _onDidChangeExtensionStorageToSync = this._register(new Emitter<void>());
	readonly onDidChangeExtensionStorageToSync = this._onDidChangeExtensionStorageToSync.event;

	private readonly extensionsWithKeysForSync: Map<string, string[]>;

	constructor(
		@IStorageService private readonly storageService: IStorageService,
		@IProductService private readonly productService: IProductService,
		@ILogService private readonly logService: ILogService,
	) {
		super();
		this.extensionsWithKeysForSync = ExtensionStorageService.readAllExtensionsWithKeysForSync(storageService);
		this._register(this.storageService.onDidChangeValue(StorageScope.PROFILE, undefined, this._store)(e => this.onDidChangeStorageValue(e)));
	}

	private onDidChangeStorageValue(e: IProfileStorageValueChangeEvent): void {

		// State of extension with keys for sync has changed
		if (this.extensionsWithKeysForSync.has(e.key.toLowerCase())) {
			this._onDidChangeExtensionStorageToSync.fire();
			return;
		}

		// Keys for sync of an extension has changed
		const extensionIdWithVersion = ExtensionStorageService.fromKey(e.key);
		if (extensionIdWithVersion) {
			if (this.storageService.get(e.key, StorageScope.PROFILE) === undefined) {
				this.extensionsWithKeysForSync.delete(extensionIdWithVersion.id.toLowerCase());
			} else {
				let versions = this.extensionsWithKeysForSync.get(extensionIdWithVersion.id.toLowerCase());
				if (!versions) {
					this.extensionsWithKeysForSync.set(extensionIdWithVersion.id.toLowerCase(), versions = []);
				}
				versions.push(extensionIdWithVersion.version);
				this._onDidChangeExtensionStorageToSync.fire();
			}
			return;
		}
	}

	private getExtensionId(extension: IExtension | IGalleryExtension | string): string {
		if (isString(extension)) {
			return extension;
		}
		const publisher = (extension as IExtension).manifest ? (extension as IExtension).manifest.publisher : (extension as IGalleryExtension).publisher;
		const name = (extension as IExtension).manifest ? (extension as IExtension).manifest.name : (extension as IGalleryExtension).name;
		return getExtensionId(publisher, name);
	}

	getExtensionState(extension: IExtension | IGalleryExtension | string, global: boolean): IStringDictionary<unknown> | undefined {
		const extensionId = this.getExtensionId(extension);
		const jsonValue = this.getExtensionStateRaw(extension, global);
		if (jsonValue) {
			try {
				return JSON.parse(jsonValue);
			} catch (error) {
				// Do not fail this call but log it for diagnostics
				// https://github.com/microsoft/vscode/issues/132777
				this.logService.error(`[mainThreadStorage] unexpected error parsing storage contents (extensionId: ${extensionId}, global: ${global}): ${error}`);
			}
		}

		return undefined;
	}

	getExtensionStateRaw(extension: IExtension | IGalleryExtension | string, global: boolean): string | undefined {
		const extensionId = this.getExtensionId(extension);
		const rawState = this.storageService.get(extensionId, global ? StorageScope.PROFILE : StorageScope.WORKSPACE);

		if (rawState && rawState?.length > ExtensionStorageService.LARGE_STATE_WARNING_THRESHOLD) {
			this.logService.warn(`[mainThreadStorage] large extension state detected (extensionId: ${extensionId}, global: ${global}): ${rawState.length / 1024}kb. Consider to use 'storageUri' or 'globalStorageUri' to store this data on disk instead.`);
		}

		return rawState;
	}

	setExtensionState(extension: IExtension | IGalleryExtension | string, state: IStringDictionary<unknown> | undefined, global: boolean): void {
		const extensionId = this.getExtensionId(extension);
		if (state === undefined) {
			this.storageService.remove(extensionId, global ? StorageScope.PROFILE : StorageScope.WORKSPACE);
		} else {
			this.storageService.store(extensionId, JSON.stringify(state), global ? StorageScope.PROFILE : StorageScope.WORKSPACE, StorageTarget.MACHINE /* Extension state is synced separately through extensions */);
		}
	}

	setKeysForSync(extensionIdWithVersion: IExtensionIdWithVersion, keys: string[]): void {
		this.storageService.store(ExtensionStorageService.toKey(extensionIdWithVersion), JSON.stringify(keys), StorageScope.PROFILE, StorageTarget.MACHINE);
	}

	getKeysForSync(extensionIdWithVersion: IExtensionIdWithVersion): string[] | undefined {
		const extensionKeysForSyncFromProduct = this.productService.extensionSyncedKeys?.[extensionIdWithVersion.id.toLowerCase()];
		const extensionKeysForSyncFromStorageValue = this.storageService.get(ExtensionStorageService.toKey(extensionIdWithVersion), StorageScope.PROFILE);
		const extensionKeysForSyncFromStorage = extensionKeysForSyncFromStorageValue ? JSON.parse(extensionKeysForSyncFromStorageValue) : undefined;

		return extensionKeysForSyncFromStorage && extensionKeysForSyncFromProduct
			? distinct([...extensionKeysForSyncFromStorage, ...extensionKeysForSyncFromProduct])
			: (extensionKeysForSyncFromStorage || extensionKeysForSyncFromProduct);
	}

	addToMigrationList(from: string, to: string): void {
		if (from !== to) {
			// remove the duplicates
			const migrationList: [string, string][] = this.migrationList.filter(entry => !entry.includes(from) && !entry.includes(to));
			migrationList.push([from, to]);
			this.migrationList = migrationList;
		}
	}

	getSourceExtensionToMigrate(toExtensionId: string): string | undefined {
		const entry = this.migrationList.find(([, to]) => toExtensionId === to);
		return entry ? entry[0] : undefined;
	}

	private get migrationList(): [string, string][] {
		const value = this.storageService.get('extensionStorage.migrationList', StorageScope.APPLICATION, '[]');
		try {
			const migrationList = JSON.parse(value);
			if (Array.isArray(migrationList)) {
				return migrationList;
			}
		} catch (error) { /* ignore */ }
		return [];
	}

	private set migrationList(migrationList: [string, string][]) {
		if (migrationList.length) {
			this.storageService.store('extensionStorage.migrationList', JSON.stringify(migrationList), StorageScope.APPLICATION, StorageTarget.MACHINE);
		} else {
			this.storageService.remove('extensionStorage.migrationList', StorageScope.APPLICATION);
		}
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/common/extensionTipsService.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/common/extensionTipsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isNonEmptyArray } from '../../../base/common/arrays.js';
import { Disposable, MutableDisposable } from '../../../base/common/lifecycle.js';
import { IConfigBasedExtensionTip as IRawConfigBasedExtensionTip } from '../../../base/common/product.js';
import { joinPath } from '../../../base/common/resources.js';
import { URI } from '../../../base/common/uri.js';
import { IConfigBasedExtensionTip, IExecutableBasedExtensionTip, IExtensionManagementService, IExtensionTipsService, ILocalExtension } from './extensionManagement.js';
import { IFileService } from '../../files/common/files.js';
import { IProductService } from '../../product/common/productService.js';
import { disposableTimeout } from '../../../base/common/async.js';
import { IStringDictionary } from '../../../base/common/collections.js';
import { Event } from '../../../base/common/event.js';
import { join } from '../../../base/common/path.js';
import { isWindows } from '../../../base/common/platform.js';
import { env } from '../../../base/common/process.js';
import { areSameExtensions } from './extensionManagementUtil.js';
import { IExtensionRecommendationNotificationService, RecommendationsNotificationResult, RecommendationSource } from '../../extensionRecommendations/common/extensionRecommendations.js';
import { ExtensionType } from '../../extensions/common/extensions.js';
import { IStorageService, StorageScope, StorageTarget } from '../../storage/common/storage.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';

//#region Base Extension Tips Service

export class ExtensionTipsService extends Disposable implements IExtensionTipsService {

	_serviceBrand: undefined;

	private readonly allConfigBasedTips: Map<string, IRawConfigBasedExtensionTip> = new Map<string, IRawConfigBasedExtensionTip>();

	constructor(
		@IFileService protected readonly fileService: IFileService,
		@IProductService private readonly productService: IProductService,
	) {
		super();
		if (this.productService.configBasedExtensionTips) {
			Object.entries(this.productService.configBasedExtensionTips).forEach(([, value]) => this.allConfigBasedTips.set(value.configPath, value));
		}
	}

	getConfigBasedTips(folder: URI): Promise<IConfigBasedExtensionTip[]> {
		return this.getValidConfigBasedTips(folder);
	}

	async getImportantExecutableBasedTips(): Promise<IExecutableBasedExtensionTip[]> {
		return [];
	}

	async getOtherExecutableBasedTips(): Promise<IExecutableBasedExtensionTip[]> {
		return [];
	}

	private async getValidConfigBasedTips(folder: URI): Promise<IConfigBasedExtensionTip[]> {
		const result: IConfigBasedExtensionTip[] = [];
		for (const [configPath, tip] of this.allConfigBasedTips) {
			if (tip.configScheme && tip.configScheme !== folder.scheme) {
				continue;
			}
			try {
				const content = (await this.fileService.readFile(joinPath(folder, configPath))).value.toString();
				for (const [key, value] of Object.entries(tip.recommendations)) {
					if (!value.contentPattern || new RegExp(value.contentPattern, 'mig').test(content)) {
						result.push({
							extensionId: key,
							extensionName: value.name,
							configName: tip.configName,
							important: !!value.important,
							isExtensionPack: !!value.isExtensionPack,
							whenNotInstalled: value.whenNotInstalled
						});
					}
				}
			} catch (error) { /* Ignore */ }
		}
		return result;
	}
}

//#endregion

//#region Native Extension Tips Service (enables unit testing having it here in "common")

type ExeExtensionRecommendationsClassification = {
	owner: 'sandy081';
	comment: 'Information about executable based extension recommendation';
	extensionId: { classification: 'PublicNonPersonalData'; purpose: 'FeatureInsight'; comment: 'id of the recommended extension' };
	exeName: { classification: 'PublicNonPersonalData'; purpose: 'FeatureInsight'; comment: 'name of the executable for which extension is being recommended' };
};

type IExeBasedExtensionTips = {
	readonly exeFriendlyName: string;
	readonly windowsPath?: string;
	readonly recommendations: { extensionId: string; extensionName: string; isExtensionPack: boolean; whenNotInstalled?: string[] }[];
};

const promptedExecutableTipsStorageKey = 'extensionTips/promptedExecutableTips';
const lastPromptedMediumImpExeTimeStorageKey = 'extensionTips/lastPromptedMediumImpExeTime';

export abstract class AbstractNativeExtensionTipsService extends ExtensionTipsService {

	private readonly highImportanceExecutableTips: Map<string, IExeBasedExtensionTips> = new Map<string, IExeBasedExtensionTips>();
	private readonly mediumImportanceExecutableTips: Map<string, IExeBasedExtensionTips> = new Map<string, IExeBasedExtensionTips>();
	private readonly allOtherExecutableTips: Map<string, IExeBasedExtensionTips> = new Map<string, IExeBasedExtensionTips>();

	private highImportanceTipsByExe = new Map<string, IExecutableBasedExtensionTip[]>();
	private mediumImportanceTipsByExe = new Map<string, IExecutableBasedExtensionTip[]>();

	constructor(
		private readonly userHome: URI,
		private readonly windowEvents: {
			readonly onDidOpenMainWindow: Event<unknown>;
			readonly onDidFocusMainWindow: Event<unknown>;
		},
		private readonly telemetryService: ITelemetryService,
		private readonly extensionManagementService: IExtensionManagementService,
		private readonly storageService: IStorageService,
		private readonly extensionRecommendationNotificationService: IExtensionRecommendationNotificationService,
		fileService: IFileService,
		productService: IProductService
	) {
		super(fileService, productService);
		if (productService.exeBasedExtensionTips) {
			Object.entries(productService.exeBasedExtensionTips).forEach(([key, exeBasedExtensionTip]) => {
				const highImportanceRecommendations: { extensionId: string; extensionName: string; isExtensionPack: boolean }[] = [];
				const mediumImportanceRecommendations: { extensionId: string; extensionName: string; isExtensionPack: boolean }[] = [];
				const otherRecommendations: { extensionId: string; extensionName: string; isExtensionPack: boolean }[] = [];
				Object.entries(exeBasedExtensionTip.recommendations).forEach(([extensionId, value]) => {
					if (value.important) {
						if (exeBasedExtensionTip.important) {
							highImportanceRecommendations.push({ extensionId, extensionName: value.name, isExtensionPack: !!value.isExtensionPack });
						} else {
							mediumImportanceRecommendations.push({ extensionId, extensionName: value.name, isExtensionPack: !!value.isExtensionPack });
						}
					} else {
						otherRecommendations.push({ extensionId, extensionName: value.name, isExtensionPack: !!value.isExtensionPack });
					}
				});
				if (highImportanceRecommendations.length) {
					this.highImportanceExecutableTips.set(key, { exeFriendlyName: exeBasedExtensionTip.friendlyName, windowsPath: exeBasedExtensionTip.windowsPath, recommendations: highImportanceRecommendations });
				}
				if (mediumImportanceRecommendations.length) {
					this.mediumImportanceExecutableTips.set(key, { exeFriendlyName: exeBasedExtensionTip.friendlyName, windowsPath: exeBasedExtensionTip.windowsPath, recommendations: mediumImportanceRecommendations });
				}
				if (otherRecommendations.length) {
					this.allOtherExecutableTips.set(key, { exeFriendlyName: exeBasedExtensionTip.friendlyName, windowsPath: exeBasedExtensionTip.windowsPath, recommendations: otherRecommendations });
				}
			});
		}

		/*
			3s has come out to be the good number to fetch and prompt important exe based recommendations
			Also fetch important exe based recommendations for reporting telemetry
		*/
		disposableTimeout(async () => {
			await this.collectTips();
			this.promptHighImportanceExeBasedTip();
			this.promptMediumImportanceExeBasedTip();
		}, 3000, this._store);
	}

	override async getImportantExecutableBasedTips(): Promise<IExecutableBasedExtensionTip[]> {
		const highImportanceExeTips = await this.getValidExecutableBasedExtensionTips(this.highImportanceExecutableTips);
		const mediumImportanceExeTips = await this.getValidExecutableBasedExtensionTips(this.mediumImportanceExecutableTips);
		return [...highImportanceExeTips, ...mediumImportanceExeTips];
	}

	override getOtherExecutableBasedTips(): Promise<IExecutableBasedExtensionTip[]> {
		return this.getValidExecutableBasedExtensionTips(this.allOtherExecutableTips);
	}

	private async collectTips(): Promise<void> {
		const highImportanceExeTips = await this.getValidExecutableBasedExtensionTips(this.highImportanceExecutableTips);
		const mediumImportanceExeTips = await this.getValidExecutableBasedExtensionTips(this.mediumImportanceExecutableTips);
		const local = await this.extensionManagementService.getInstalled();

		this.highImportanceTipsByExe = this.groupImportantTipsByExe(highImportanceExeTips, local);
		this.mediumImportanceTipsByExe = this.groupImportantTipsByExe(mediumImportanceExeTips, local);
	}

	private groupImportantTipsByExe(importantExeBasedTips: IExecutableBasedExtensionTip[], local: ILocalExtension[]): Map<string, IExecutableBasedExtensionTip[]> {
		const importantExeBasedRecommendations = new Map<string, IExecutableBasedExtensionTip>();
		importantExeBasedTips.forEach(tip => importantExeBasedRecommendations.set(tip.extensionId.toLowerCase(), tip));

		const { installed, uninstalled: recommendations } = this.groupByInstalled([...importantExeBasedRecommendations.keys()], local);

		/* Log installed and uninstalled exe based recommendations */
		for (const extensionId of installed) {
			const tip = importantExeBasedRecommendations.get(extensionId);
			if (tip) {
				this.telemetryService.publicLog2<{ exeName: string; extensionId: string }, ExeExtensionRecommendationsClassification>('exeExtensionRecommendations:alreadyInstalled', { extensionId, exeName: tip.exeName });
			}
		}
		for (const extensionId of recommendations) {
			const tip = importantExeBasedRecommendations.get(extensionId);
			if (tip) {
				this.telemetryService.publicLog2<{ exeName: string; extensionId: string }, ExeExtensionRecommendationsClassification>('exeExtensionRecommendations:notInstalled', { extensionId, exeName: tip.exeName });
			}
		}

		const promptedExecutableTips = this.getPromptedExecutableTips();
		const tipsByExe = new Map<string, IExecutableBasedExtensionTip[]>();
		for (const extensionId of recommendations) {
			const tip = importantExeBasedRecommendations.get(extensionId);
			if (tip && (!promptedExecutableTips[tip.exeName] || !promptedExecutableTips[tip.exeName].includes(tip.extensionId))) {
				let tips = tipsByExe.get(tip.exeName);
				if (!tips) {
					tips = [];
					tipsByExe.set(tip.exeName, tips);
				}
				tips.push(tip);
			}
		}

		return tipsByExe;
	}

	/**
	 * High importance tips are prompted once per restart session
	 */
	private promptHighImportanceExeBasedTip(): void {
		if (this.highImportanceTipsByExe.size === 0) {
			return;
		}

		const [exeName, tips] = [...this.highImportanceTipsByExe.entries()][0];
		this.promptExeRecommendations(tips)
			.then(result => {
				switch (result) {
					case RecommendationsNotificationResult.Accepted:
						this.addToRecommendedExecutables(tips[0].exeName, tips);
						break;
					case RecommendationsNotificationResult.Ignored:
						this.highImportanceTipsByExe.delete(exeName);
						break;
					case RecommendationsNotificationResult.IncompatibleWindow: {
						// Recommended in incompatible window. Schedule the prompt after active window change
						const onActiveWindowChange = Event.once(Event.latch(Event.any(this.windowEvents.onDidOpenMainWindow, this.windowEvents.onDidFocusMainWindow)));
						this._register(onActiveWindowChange(() => this.promptHighImportanceExeBasedTip()));
						break;
					}
					case RecommendationsNotificationResult.TooMany: {
						// Too many notifications. Schedule the prompt after one hour
						const disposable = this._register(new MutableDisposable());
						disposable.value = disposableTimeout(() => { disposable.dispose(); this.promptHighImportanceExeBasedTip(); }, 60 * 60 * 1000 /* 1 hour */);
						break;
					}
				}
			});
	}

	/**
	 * Medium importance tips are prompted once per 7 days
	 */
	private promptMediumImportanceExeBasedTip(): void {
		if (this.mediumImportanceTipsByExe.size === 0) {
			return;
		}

		const lastPromptedMediumExeTime = this.getLastPromptedMediumExeTime();
		const timeSinceLastPrompt = Date.now() - lastPromptedMediumExeTime;
		const promptInterval = 7 * 24 * 60 * 60 * 1000; // 7 Days
		if (timeSinceLastPrompt < promptInterval) {
			// Wait until interval and prompt
			const disposable = this._register(new MutableDisposable());
			disposable.value = disposableTimeout(() => { disposable.dispose(); this.promptMediumImportanceExeBasedTip(); }, promptInterval - timeSinceLastPrompt);
			return;
		}

		const [exeName, tips] = [...this.mediumImportanceTipsByExe.entries()][0];
		this.promptExeRecommendations(tips)
			.then(result => {
				switch (result) {
					case RecommendationsNotificationResult.Accepted: {
						// Accepted: Update the last prompted time and caches.
						this.updateLastPromptedMediumExeTime(Date.now());
						this.mediumImportanceTipsByExe.delete(exeName);
						this.addToRecommendedExecutables(tips[0].exeName, tips);

						// Schedule the next recommendation for next internval
						const disposable1 = this._register(new MutableDisposable());
						disposable1.value = disposableTimeout(() => { disposable1.dispose(); this.promptMediumImportanceExeBasedTip(); }, promptInterval);
						break;
					}
					case RecommendationsNotificationResult.Ignored:
						// Ignored: Remove from the cache and prompt next recommendation
						this.mediumImportanceTipsByExe.delete(exeName);
						this.promptMediumImportanceExeBasedTip();
						break;

					case RecommendationsNotificationResult.IncompatibleWindow: {
						// Recommended in incompatible window. Schedule the prompt after active window change
						const onActiveWindowChange = Event.once(Event.latch(Event.any(this.windowEvents.onDidOpenMainWindow, this.windowEvents.onDidFocusMainWindow)));
						this._register(onActiveWindowChange(() => this.promptMediumImportanceExeBasedTip()));
						break;
					}
					case RecommendationsNotificationResult.TooMany: {
						// Too many notifications. Schedule the prompt after one hour
						const disposable2 = this._register(new MutableDisposable());
						disposable2.value = disposableTimeout(() => { disposable2.dispose(); this.promptMediumImportanceExeBasedTip(); }, 60 * 60 * 1000 /* 1 hour */);
						break;
					}
				}
			});
	}

	private async promptExeRecommendations(tips: IExecutableBasedExtensionTip[]): Promise<RecommendationsNotificationResult> {
		const installed = await this.extensionManagementService.getInstalled(ExtensionType.User);
		const extensions = tips
			.filter(tip => !tip.whenNotInstalled || tip.whenNotInstalled.every(id => installed.every(local => !areSameExtensions(local.identifier, { id }))))
			.map(({ extensionId }) => extensionId.toLowerCase());
		return this.extensionRecommendationNotificationService.promptImportantExtensionsInstallNotification({ extensions, source: RecommendationSource.EXE, name: tips[0].exeFriendlyName, searchValue: `@exe:"${tips[0].exeName}"` });
	}

	private getLastPromptedMediumExeTime(): number {
		let value = this.storageService.getNumber(lastPromptedMediumImpExeTimeStorageKey, StorageScope.APPLICATION);
		if (!value) {
			value = Date.now();
			this.updateLastPromptedMediumExeTime(value);
		}
		return value;
	}

	private updateLastPromptedMediumExeTime(value: number): void {
		this.storageService.store(lastPromptedMediumImpExeTimeStorageKey, value, StorageScope.APPLICATION, StorageTarget.MACHINE);
	}

	private getPromptedExecutableTips(): IStringDictionary<string[]> {
		return JSON.parse(this.storageService.get(promptedExecutableTipsStorageKey, StorageScope.APPLICATION, '{}'));
	}

	private addToRecommendedExecutables(exeName: string, tips: IExecutableBasedExtensionTip[]) {
		const promptedExecutableTips = this.getPromptedExecutableTips();
		promptedExecutableTips[exeName] = tips.map(({ extensionId }) => extensionId.toLowerCase());
		this.storageService.store(promptedExecutableTipsStorageKey, JSON.stringify(promptedExecutableTips), StorageScope.APPLICATION, StorageTarget.USER);
	}

	private groupByInstalled(recommendationsToSuggest: string[], local: ILocalExtension[]): { installed: string[]; uninstalled: string[] } {
		const installed: string[] = [], uninstalled: string[] = [];
		const installedExtensionsIds = local.reduce((result, i) => { result.add(i.identifier.id.toLowerCase()); return result; }, new Set<string>());
		recommendationsToSuggest.forEach(id => {
			if (installedExtensionsIds.has(id.toLowerCase())) {
				installed.push(id);
			} else {
				uninstalled.push(id);
			}
		});
		return { installed, uninstalled };
	}

	private async getValidExecutableBasedExtensionTips(executableTips: Map<string, IExeBasedExtensionTips>): Promise<IExecutableBasedExtensionTip[]> {
		const result: IExecutableBasedExtensionTip[] = [];

		const checkedExecutables: Map<string, boolean> = new Map<string, boolean>();
		for (const exeName of executableTips.keys()) {
			const extensionTip = executableTips.get(exeName);
			if (!extensionTip || !isNonEmptyArray(extensionTip.recommendations)) {
				continue;
			}

			const exePaths: string[] = [];
			if (isWindows) {
				if (extensionTip.windowsPath) {
					exePaths.push(extensionTip.windowsPath.replace('%USERPROFILE%', () => env['USERPROFILE']!)
						.replace('%ProgramFiles(x86)%', () => env['ProgramFiles(x86)']!)
						.replace('%ProgramFiles%', () => env['ProgramFiles']!)
						.replace('%APPDATA%', () => env['APPDATA']!)
						.replace('%WINDIR%', () => env['WINDIR']!));
				}
			} else {
				exePaths.push(join('/usr/local/bin', exeName));
				exePaths.push(join('/usr/bin', exeName));
				exePaths.push(join(this.userHome.fsPath, exeName));
			}

			for (const exePath of exePaths) {
				let exists = checkedExecutables.get(exePath);
				if (exists === undefined) {
					exists = await this.fileService.exists(URI.file(exePath));
					checkedExecutables.set(exePath, exists);
				}
				if (exists) {
					for (const { extensionId, extensionName, isExtensionPack, whenNotInstalled } of extensionTip.recommendations) {
						result.push({
							extensionId,
							extensionName,
							isExtensionPack,
							exeName,
							exeFriendlyName: extensionTip.exeFriendlyName,
							windowsPath: extensionTip.windowsPath,
							whenNotInstalled: whenNotInstalled
						});
					}
				}
			}
		}

		return result;
	}
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/common/implicitActivationEvents.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/common/implicitActivationEvents.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStringDictionary } from '../../../base/common/collections.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../extensions/common/extensions.js';

export interface IActivationEventsGenerator<T> {
	(contributions: readonly T[]): Iterable<string>;
}

export class ImplicitActivationEventsImpl {

	private readonly _generators = new Map<string, IActivationEventsGenerator<unknown>>();
	private readonly _cache = new WeakMap<IExtensionDescription, string[]>();

	public register<T>(extensionPointName: string, generator: IActivationEventsGenerator<T>): void {
		this._generators.set(extensionPointName, generator as IActivationEventsGenerator<unknown>);
	}

	/**
	 * This can run correctly only on the renderer process because that is the only place
	 * where all extension points and all implicit activation events generators are known.
	 */
	public readActivationEvents(extensionDescription: IExtensionDescription): string[] {
		if (!this._cache.has(extensionDescription)) {
			this._cache.set(extensionDescription, this._readActivationEvents(extensionDescription));
		}
		return this._cache.get(extensionDescription)!;
	}

	/**
	 * This can run correctly only on the renderer process because that is the only place
	 * where all extension points and all implicit activation events generators are known.
	 */
	public createActivationEventsMap(extensionDescriptions: IExtensionDescription[]): { [extensionId: string]: string[] } {
		const result: { [extensionId: string]: string[] } = Object.create(null);
		for (const extensionDescription of extensionDescriptions) {
			const activationEvents = this.readActivationEvents(extensionDescription);
			if (activationEvents.length > 0) {
				result[ExtensionIdentifier.toKey(extensionDescription.identifier)] = activationEvents;
			}
		}
		return result;
	}

	private _readActivationEvents(desc: IExtensionDescription): string[] {
		if (typeof desc.main === 'undefined' && typeof desc.browser === 'undefined') {
			return [];
		}

		const activationEvents: string[] = (Array.isArray(desc.activationEvents) ? desc.activationEvents.slice(0) : []);

		for (let i = 0; i < activationEvents.length; i++) {
			// TODO@joao: there's no easy way to contribute this
			if (activationEvents[i] === 'onUri') {
				activationEvents[i] = `onUri:${ExtensionIdentifier.toKey(desc.identifier)}`;
			}
		}

		if (!desc.contributes) {
			// no implicit activation events
			return activationEvents;
		}

		for (const extPointName in desc.contributes) {
			const generator = this._generators.get(extPointName);
			if (!generator) {
				// There's no generator for this extension point
				continue;
			}
			const contrib = (desc.contributes as IStringDictionary<unknown>)[extPointName];
			const contribArr = Array.isArray(contrib) ? contrib : [contrib];
			try {
				activationEvents.push(...generator(contribArr));
			} catch (err) {
				onUnexpectedError(err);
			}
		}

		return activationEvents;
	}
}

export const ImplicitActivationEvents: ImplicitActivationEventsImpl = new ImplicitActivationEventsImpl();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/common/unsupportedExtensionsMigration.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/common/unsupportedExtensionsMigration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { EXTENSION_INSTALL_SKIP_PUBLISHER_TRUST_CONTEXT, IExtensionGalleryService, IExtensionManagementService, IGlobalExtensionEnablementService, InstallOperation } from './extensionManagement.js';
import { areSameExtensions, getExtensionId } from './extensionManagementUtil.js';
import { IExtensionStorageService } from './extensionStorage.js';
import { ExtensionType } from '../../extensions/common/extensions.js';
import { ILogService } from '../../log/common/log.js';
import * as semver from '../../../base/common/semver/semver.js';

/**
 * Migrates the installed unsupported nightly extension to a supported pre-release extension. It includes following:
 * 	- Uninstall the Unsupported extension
 * 	- Install (with optional storage migration) the Pre-release extension only if
 * 		- the extension is not installed
 * 		- or it is a release version and the unsupported extension is enabled.
 */
export async function migrateUnsupportedExtensions(extensionManagementService: IExtensionManagementService, galleryService: IExtensionGalleryService, extensionStorageService: IExtensionStorageService, extensionEnablementService: IGlobalExtensionEnablementService, logService: ILogService): Promise<void> {
	try {
		const extensionsControlManifest = await extensionManagementService.getExtensionsControlManifest();
		if (!extensionsControlManifest.deprecated) {
			return;
		}
		const installed = await extensionManagementService.getInstalled(ExtensionType.User);
		for (const [unsupportedExtensionId, deprecated] of Object.entries(extensionsControlManifest.deprecated)) {
			if (!deprecated?.extension) {
				continue;
			}
			const { id: preReleaseExtensionId, autoMigrate, preRelease } = deprecated.extension;
			if (!autoMigrate) {
				continue;
			}
			const unsupportedExtension = installed.find(i => areSameExtensions(i.identifier, { id: unsupportedExtensionId }));
			// Unsupported Extension is not installed
			if (!unsupportedExtension) {
				continue;
			}

			const gallery = (await galleryService.getExtensions([{ id: preReleaseExtensionId, preRelease }], { targetPlatform: await extensionManagementService.getTargetPlatform(), compatible: true }, CancellationToken.None))[0];
			if (!gallery) {
				logService.info(`Skipping migrating '${unsupportedExtension.identifier.id}' extension because, the comaptible target '${preReleaseExtensionId}' extension is not found`);
				continue;
			}

			try {
				logService.info(`Migrating '${unsupportedExtension.identifier.id}' extension to '${preReleaseExtensionId}' extension...`);

				const isUnsupportedExtensionEnabled = !extensionEnablementService.getDisabledExtensions().some(e => areSameExtensions(e, unsupportedExtension.identifier));
				await extensionManagementService.uninstall(unsupportedExtension);
				logService.info(`Uninstalled the unsupported extension '${unsupportedExtension.identifier.id}'`);

				let preReleaseExtension = installed.find(i => areSameExtensions(i.identifier, { id: preReleaseExtensionId }));
				if (!preReleaseExtension || (!preReleaseExtension.isPreReleaseVersion && isUnsupportedExtensionEnabled)) {
					preReleaseExtension = await extensionManagementService.installFromGallery(gallery, { installPreReleaseVersion: true, isMachineScoped: unsupportedExtension.isMachineScoped, operation: InstallOperation.Migrate, context: { [EXTENSION_INSTALL_SKIP_PUBLISHER_TRUST_CONTEXT]: true } });
					logService.info(`Installed the pre-release extension '${preReleaseExtension.identifier.id}'`);
					if (!isUnsupportedExtensionEnabled) {
						await extensionEnablementService.disableExtension(preReleaseExtension.identifier);
						logService.info(`Disabled the pre-release extension '${preReleaseExtension.identifier.id}' because the unsupported extension '${unsupportedExtension.identifier.id}' is disabled`);
					}
					if (autoMigrate.storage) {
						extensionStorageService.addToMigrationList(getExtensionId(unsupportedExtension.manifest.publisher, unsupportedExtension.manifest.name), getExtensionId(preReleaseExtension.manifest.publisher, preReleaseExtension.manifest.name));
						logService.info(`Added pre-release extension to the storage migration list`);
					}
				}
				logService.info(`Migrated '${unsupportedExtension.identifier.id}' extension to '${preReleaseExtensionId}' extension.`);
			} catch (error) {
				logService.error(error);
			}
		}

		if (extensionsControlManifest.autoUpdate) {
			for (const [extensionId, version] of Object.entries(extensionsControlManifest.autoUpdate)) {
				try {
					const extensionToAutoUpdate = installed.find(i => areSameExtensions(i.identifier, { id: extensionId }) && semver.lte(i.manifest.version, version));
					if (!extensionToAutoUpdate) {
						continue;
					}

					const gallery = (await galleryService.getExtensions([{ id: extensionId, preRelease: extensionToAutoUpdate.preRelease }], { targetPlatform: await extensionManagementService.getTargetPlatform(), compatible: true }, CancellationToken.None))[0];
					if (!gallery) {
						logService.info(`Skipping updating '${extensionToAutoUpdate.identifier.id}' extension because, the compatible target '${extensionId}' extension is not found`);
						continue;
					}

					await extensionManagementService.installFromGallery(gallery, { installPreReleaseVersion: extensionToAutoUpdate.preRelease, isMachineScoped: extensionToAutoUpdate.isMachineScoped, operation: InstallOperation.Update, context: { [EXTENSION_INSTALL_SKIP_PUBLISHER_TRUST_CONTEXT]: true } });
					logService.info(`Autoupdated '${extensionToAutoUpdate.identifier.id}' extension to '${gallery.version}' extension.`);
				} catch (error) {
					logService.error(error);
				}
			}
		}

	} catch (error) {
		logService.error(error);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/electron-browser/extensionsProfileScannerService.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/electron-browser/extensionsProfileScannerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILogService } from '../../log/common/log.js';
import { IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { AbstractExtensionsProfileScannerService, IExtensionsProfileScannerService } from '../common/extensionsProfileScannerService.js';
import { IFileService } from '../../files/common/files.js';
import { INativeEnvironmentService } from '../../environment/common/environment.js';
import { URI } from '../../../base/common/uri.js';
import { InstantiationType, registerSingleton } from '../../instantiation/common/extensions.js';

export class ExtensionsProfileScannerService extends AbstractExtensionsProfileScannerService {
	constructor(
		@INativeEnvironmentService environmentService: INativeEnvironmentService,
		@IFileService fileService: IFileService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@ILogService logService: ILogService,
	) {
		super(URI.file(environmentService.extensionsPath), fileService, userDataProfilesService, uriIdentityService, logService);
	}
}

registerSingleton(IExtensionsProfileScannerService, ExtensionsProfileScannerService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/node/extensionDownloader.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/node/extensionDownloader.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Promises } from '../../../base/common/async.js';
import { getErrorMessage } from '../../../base/common/errors.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import { joinPath } from '../../../base/common/resources.js';
import * as semver from '../../../base/common/semver/semver.js';
import { URI } from '../../../base/common/uri.js';
import { generateUuid } from '../../../base/common/uuid.js';
import { Promises as FSPromises } from '../../../base/node/pfs.js';
import { buffer, CorruptZipMessage } from '../../../base/node/zip.js';
import { INativeEnvironmentService } from '../../environment/common/environment.js';
import { toExtensionManagementError } from '../common/abstractExtensionManagementService.js';
import { ExtensionManagementError, ExtensionManagementErrorCode, ExtensionSignatureVerificationCode, IExtensionGalleryService, IGalleryExtension, InstallOperation } from '../common/extensionManagement.js';
import { ExtensionKey, groupByExtension } from '../common/extensionManagementUtil.js';
import { fromExtractError } from './extensionManagementUtil.js';
import { IExtensionSignatureVerificationService } from './extensionSignatureVerificationService.js';
import { TargetPlatform } from '../../extensions/common/extensions.js';
import { FileOperationResult, IFileService, IFileStatWithMetadata, toFileOperationResult } from '../../files/common/files.js';
import { ILogService } from '../../log/common/log.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';

type RetryDownloadClassification = {
	owner: 'sandy081';
	comment: 'Event reporting the retry of downloading';
	extensionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Extension Id' };
	attempts: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; isMeasurement: true; comment: 'Number of Attempts' };
};
type RetryDownloadEvent = {
	extensionId: string;
	attempts: number;
};

export class ExtensionsDownloader extends Disposable {

	private static readonly SignatureArchiveExtension = '.sigzip';

	readonly extensionsDownloadDir: URI;
	private readonly extensionsTrashDir: URI;
	private readonly cache: number;
	private readonly cleanUpPromise: Promise<void>;

	constructor(
		@INativeEnvironmentService environmentService: INativeEnvironmentService,
		@IFileService private readonly fileService: IFileService,
		@IExtensionGalleryService private readonly extensionGalleryService: IExtensionGalleryService,
		@IExtensionSignatureVerificationService private readonly extensionSignatureVerificationService: IExtensionSignatureVerificationService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@ILogService private readonly logService: ILogService,
	) {
		super();
		this.extensionsDownloadDir = environmentService.extensionsDownloadLocation;
		this.extensionsTrashDir = uriIdentityService.extUri.joinPath(environmentService.extensionsDownloadLocation, `.trash`);
		this.cache = 20; // Cache 20 downloaded VSIX files
		this.cleanUpPromise = this.cleanUp();
	}

	async download(extension: IGalleryExtension, operation: InstallOperation, verifySignature: boolean, clientTargetPlatform?: TargetPlatform): Promise<{ readonly location: URI; readonly verificationStatus: ExtensionSignatureVerificationCode | undefined }> {
		await this.cleanUpPromise;

		const location = await this.downloadVSIX(extension, operation);

		if (!verifySignature) {
			return { location, verificationStatus: undefined };
		}

		if (!extension.isSigned) {
			return { location, verificationStatus: ExtensionSignatureVerificationCode.NotSigned };
		}

		let signatureArchiveLocation;
		try {
			signatureArchiveLocation = await this.downloadSignatureArchive(extension);
			const verificationStatus = (await this.extensionSignatureVerificationService.verify(extension.identifier.id, extension.version, location.fsPath, signatureArchiveLocation.fsPath, clientTargetPlatform))?.code;
			if (verificationStatus === ExtensionSignatureVerificationCode.PackageIsInvalidZip || verificationStatus === ExtensionSignatureVerificationCode.SignatureArchiveIsInvalidZip) {
				try {
					// Delete the downloaded vsix if VSIX or signature archive is invalid
					await this.delete(location);
				} catch (error) {
					this.logService.error(error);
				}
				throw new ExtensionManagementError(CorruptZipMessage, ExtensionManagementErrorCode.CorruptZip);
			}
			return { location, verificationStatus };
		} catch (error) {
			try {
				// Delete the downloaded VSIX if signature archive download fails
				await this.delete(location);
			} catch (error) {
				this.logService.error(error);
			}
			throw error;
		} finally {
			if (signatureArchiveLocation) {
				try {
					// Delete signature archive always
					await this.delete(signatureArchiveLocation);
				} catch (error) {
					this.logService.error(error);
				}
			}
		}
	}

	private async downloadVSIX(extension: IGalleryExtension, operation: InstallOperation): Promise<URI> {
		try {
			const location = joinPath(this.extensionsDownloadDir, this.getName(extension));
			const attempts = await this.doDownload(extension, 'vsix', async () => {
				await this.downloadFile(extension, location, location => this.extensionGalleryService.download(extension, location, operation));
				try {
					await this.validate(location.fsPath, 'extension/package.json');
				} catch (error) {
					try {
						await this.fileService.del(location);
					} catch (e) {
						this.logService.warn(`Error while deleting: ${location.path}`, getErrorMessage(e));
					}
					throw error;
				}
			}, 2);

			if (attempts > 1) {
				this.telemetryService.publicLog2<RetryDownloadEvent, RetryDownloadClassification>('extensiongallery:downloadvsix:retry', {
					extensionId: extension.identifier.id,
					attempts
				});
			}

			return location;
		} catch (e) {
			throw toExtensionManagementError(e, ExtensionManagementErrorCode.Download);
		}
	}

	private async downloadSignatureArchive(extension: IGalleryExtension): Promise<URI> {
		try {
			const location = joinPath(this.extensionsDownloadDir, `${this.getName(extension)}${ExtensionsDownloader.SignatureArchiveExtension}`);
			const attempts = await this.doDownload(extension, 'sigzip', async () => {
				await this.extensionGalleryService.downloadSignatureArchive(extension, location);
				try {
					await this.validate(location.fsPath, '.signature.p7s');
				} catch (error) {
					try {
						await this.fileService.del(location);
					} catch (e) {
						this.logService.warn(`Error while deleting: ${location.path}`, getErrorMessage(e));
					}
					throw error;
				}
			}, 2);

			if (attempts > 1) {
				this.telemetryService.publicLog2<RetryDownloadEvent, RetryDownloadClassification>('extensiongallery:downloadsigzip:retry', {
					extensionId: extension.identifier.id,
					attempts
				});
			}

			return location;
		} catch (e) {
			throw toExtensionManagementError(e, ExtensionManagementErrorCode.DownloadSignature);
		}
	}

	private async downloadFile(extension: IGalleryExtension, location: URI, downloadFn: (location: URI) => Promise<void>): Promise<void> {
		// Do not download if exists
		if (await this.fileService.exists(location)) {
			return;
		}

		// Download directly if locaiton is not file scheme
		if (location.scheme !== Schemas.file) {
			await downloadFn(location);
			return;
		}

		// Download to temporary location first only if file does not exist
		const tempLocation = joinPath(this.extensionsDownloadDir, `.${generateUuid()}`);
		try {
			await downloadFn(tempLocation);
		} catch (error) {
			try {
				await this.fileService.del(tempLocation);
			} catch (e) { /* ignore */ }
			throw error;
		}

		try {
			// Rename temp location to original
			await FSPromises.rename(tempLocation.fsPath, location.fsPath, 2 * 60 * 1000 /* Retry for 2 minutes */);
		} catch (error) {
			try { await this.fileService.del(tempLocation); } catch (e) { /* ignore */ }
			let exists = false;
			try { exists = await this.fileService.exists(location); } catch (e) { /* ignore */ }
			if (exists) {
				this.logService.info(`Rename failed because the file was downloaded by another source. So ignoring renaming.`, extension.identifier.id, location.path);
			} else {
				this.logService.info(`Rename failed because of ${getErrorMessage(error)}. Deleted the file from downloaded location`, tempLocation.path);
				throw error;
			}
		}
	}

	private async doDownload(extension: IGalleryExtension, name: string, downloadFn: () => Promise<void>, retries: number): Promise<number> {
		let attempts = 1;
		while (true) {
			try {
				await downloadFn();
				return attempts;
			} catch (e) {
				if (attempts++ > retries) {
					throw e;
				}
				this.logService.warn(`Failed downloading ${name}. ${getErrorMessage(e)}. Retry again...`, extension.identifier.id);
			}
		}
	}

	protected async validate(zipPath: string, filePath: string): Promise<void> {
		try {
			await buffer(zipPath, filePath);
		} catch (e) {
			throw fromExtractError(e);
		}
	}

	async delete(location: URI): Promise<void> {
		await this.cleanUpPromise;
		const trashRelativePath = this.uriIdentityService.extUri.relativePath(this.extensionsDownloadDir, location);
		if (trashRelativePath) {
			await this.fileService.move(location, this.uriIdentityService.extUri.joinPath(this.extensionsTrashDir, trashRelativePath), true);
		} else {
			await this.fileService.del(location);
		}
	}

	private async cleanUp(): Promise<void> {
		try {
			if (!(await this.fileService.exists(this.extensionsDownloadDir))) {
				this.logService.trace('Extension VSIX downloads cache dir does not exist');
				return;
			}

			try {
				await this.fileService.del(this.extensionsTrashDir, { recursive: true });
			} catch (error) {
				if (toFileOperationResult(error) !== FileOperationResult.FILE_NOT_FOUND) {
					this.logService.error(error);
				}
			}

			const folderStat = await this.fileService.resolve(this.extensionsDownloadDir, { resolveMetadata: true });
			if (folderStat.children) {
				const toDelete: URI[] = [];
				const vsixs: [ExtensionKey, IFileStatWithMetadata][] = [];
				const signatureArchives: URI[] = [];

				for (const stat of folderStat.children) {
					if (stat.name.endsWith(ExtensionsDownloader.SignatureArchiveExtension)) {
						signatureArchives.push(stat.resource);
					} else {
						const extension = ExtensionKey.parse(stat.name);
						if (extension) {
							vsixs.push([extension, stat]);
						}
					}
				}

				const byExtension = groupByExtension(vsixs, ([extension]) => extension);
				const distinct: IFileStatWithMetadata[] = [];
				for (const p of byExtension) {
					p.sort((a, b) => semver.rcompare(a[0].version, b[0].version));
					toDelete.push(...p.slice(1).map(e => e[1].resource)); // Delete outdated extensions
					distinct.push(p[0][1]);
				}
				distinct.sort((a, b) => a.mtime - b.mtime); // sort by modified time
				toDelete.push(...distinct.slice(0, Math.max(0, distinct.length - this.cache)).map(s => s.resource)); // Retain minimum cacheSize and delete the rest
				toDelete.push(...signatureArchives); // Delete all signature archives

				await Promises.settled(toDelete.map(resource => {
					this.logService.trace('Deleting from cache', resource.path);
					return this.fileService.del(resource);
				}));
			}
		} catch (e) {
			this.logService.error(e);
		}
	}

	private getName(extension: IGalleryExtension): string {
		return ExtensionKey.create(extension).toString().toLowerCase();
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/node/extensionLifecycle.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/node/extensionLifecycle.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ChildProcess, fork } from 'child_process';
import { Limiter } from '../../../base/common/async.js';
import { toErrorMessage } from '../../../base/common/errorMessage.js';
import { Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import { join } from '../../../base/common/path.js';
import { Promises } from '../../../base/node/pfs.js';
import { ILocalExtension } from '../common/extensionManagement.js';
import { ILogService } from '../../log/common/log.js';
import { IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';

export class ExtensionsLifecycle extends Disposable {

	private processesLimiter: Limiter<void> = new Limiter(5); // Run max 5 processes in parallel

	constructor(
		@IUserDataProfilesService private userDataProfilesService: IUserDataProfilesService,
		@ILogService private readonly logService: ILogService
	) {
		super();
	}

	async postUninstall(extension: ILocalExtension): Promise<void> {
		const script = this.parseScript(extension, 'uninstall');
		if (script) {
			this.logService.info(extension.identifier.id, extension.manifest.version, `Running post uninstall script`);
			await this.processesLimiter.queue(async () => {
				try {
					await this.runLifecycleHook(script.script, 'uninstall', script.args, true, extension);
					this.logService.info(`Finished running post uninstall script`, extension.identifier.id, extension.manifest.version);
				} catch (error) {
					this.logService.error('Failed to run post uninstall script', extension.identifier.id, extension.manifest.version);
					this.logService.error(error);
				}
			});
		}
		try {
			await Promises.rm(this.getExtensionStoragePath(extension));
		} catch (error) {
			this.logService.error('Error while removing extension storage path', extension.identifier.id);
			this.logService.error(error);
		}
	}

	private parseScript(extension: ILocalExtension, type: string): { script: string; args: string[] } | null {
		const scriptKey = `vscode:${type}`;
		if (extension.location.scheme === Schemas.file && extension.manifest && extension.manifest['scripts'] && typeof extension.manifest['scripts'][scriptKey] === 'string') {
			const script = (extension.manifest['scripts'][scriptKey]).split(' ');
			if (script.length < 2 || script[0] !== 'node' || !script[1]) {
				this.logService.warn(extension.identifier.id, extension.manifest.version, `${scriptKey} should be a node script`);
				return null;
			}
			return { script: join(extension.location.fsPath, script[1]), args: script.slice(2) || [] };
		}
		return null;
	}

	private runLifecycleHook(lifecycleHook: string, lifecycleType: string, args: string[], timeout: boolean, extension: ILocalExtension): Promise<void> {
		return new Promise<void>((c, e) => {

			const extensionLifecycleProcess = this.start(lifecycleHook, lifecycleType, args, extension);
			let timeoutHandler: Timeout | null;

			const onexit = (error?: string) => {
				if (timeoutHandler) {
					clearTimeout(timeoutHandler);
					timeoutHandler = null;
				}
				if (error) {
					e(error);
				} else {
					c(undefined);
				}
			};

			// on error
			extensionLifecycleProcess.on('error', (err) => {
				onexit(toErrorMessage(err) || 'Unknown');
			});

			// on exit
			extensionLifecycleProcess.on('exit', (code: number, signal: string) => {
				onexit(code ? `post-${lifecycleType} process exited with code ${code}` : undefined);
			});

			if (timeout) {
				// timeout: kill process after waiting for 5s
				timeoutHandler = setTimeout(() => {
					timeoutHandler = null;
					extensionLifecycleProcess.kill();
					e('timed out');
				}, 5000);
			}
		});
	}

	private start(uninstallHook: string, lifecycleType: string, args: string[], extension: ILocalExtension): ChildProcess {
		const opts = {
			silent: true,
			execArgv: undefined
		};
		const extensionUninstallProcess = fork(uninstallHook, [`--type=extension-post-${lifecycleType}`, ...args], opts);

		// Catch all output coming from the process
		type Output = { data: string; format: string[] };
		extensionUninstallProcess.stdout!.setEncoding('utf8');
		extensionUninstallProcess.stderr!.setEncoding('utf8');

		const onStdout = Event.fromNodeEventEmitter<string>(extensionUninstallProcess.stdout!, 'data');
		const onStderr = Event.fromNodeEventEmitter<string>(extensionUninstallProcess.stderr!, 'data');

		// Log output
		this._register(onStdout(data => this.logService.info(extension.identifier.id, extension.manifest.version, `post-${lifecycleType}`, data)));
		this._register(onStderr(data => this.logService.error(extension.identifier.id, extension.manifest.version, `post-${lifecycleType}`, data)));

		const onOutput = Event.any(
			Event.map(onStdout, o => ({ data: `%c${o}`, format: [''] }), this._store),
			Event.map(onStderr, o => ({ data: `%c${o}`, format: ['color: red'] }), this._store)
		);
		// Debounce all output, so we can render it in the Chrome console as a group
		const onDebouncedOutput = Event.debounce<Output>(onOutput, (r, o) => {
			return r
				? { data: r.data + o.data, format: [...r.format, ...o.format] }
				: { data: o.data, format: o.format };
		}, 100, undefined, undefined, undefined, this._store);

		// Print out output
		onDebouncedOutput(data => {
			console.group(extension.identifier.id);
			console.log(data.data, ...data.format);
			console.groupEnd();
		});

		return extensionUninstallProcess;
	}

	private getExtensionStoragePath(extension: ILocalExtension): string {
		return join(this.userDataProfilesService.defaultProfile.globalStorageHome.fsPath, extension.identifier.id.toLowerCase());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/node/extensionManagementService.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/node/extensionManagementService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import { Promises, Queue } from '../../../base/common/async.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { IStringDictionary } from '../../../base/common/collections.js';
import { CancellationError, getErrorMessage } from '../../../base/common/errors.js';
import { Emitter } from '../../../base/common/event.js';
import { hash } from '../../../base/common/hash.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { ResourceMap, ResourceSet } from '../../../base/common/map.js';
import { Schemas } from '../../../base/common/network.js';
import * as path from '../../../base/common/path.js';
import { joinPath } from '../../../base/common/resources.js';
import * as semver from '../../../base/common/semver/semver.js';
import { isBoolean, isDefined, isUndefined } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { generateUuid } from '../../../base/common/uuid.js';
import * as pfs from '../../../base/node/pfs.js';
import { extract, IFile, zip } from '../../../base/node/zip.js';
import * as nls from '../../../nls.js';
import { IDownloadService } from '../../download/common/download.js';
import { INativeEnvironmentService } from '../../environment/common/environment.js';
import { AbstractExtensionManagementService, AbstractExtensionTask, IInstallExtensionTask, InstallExtensionTaskOptions, IUninstallExtensionTask, toExtensionManagementError, UninstallExtensionTaskOptions } from '../common/abstractExtensionManagementService.js';
import {
	ExtensionManagementError, ExtensionManagementErrorCode, IExtensionGalleryService, IExtensionIdentifier, IExtensionManagementService, IGalleryExtension, ILocalExtension, InstallOperation,
	Metadata, InstallOptions,
	IProductVersion,
	EXTENSION_INSTALL_CLIENT_TARGET_PLATFORM_CONTEXT,
	ExtensionSignatureVerificationCode,
	computeSize,
	IAllowedExtensionsService,
	VerifyExtensionSignatureConfigKey,
	shouldRequireRepositorySignatureFor,
} from '../common/extensionManagement.js';
import { areSameExtensions, computeTargetPlatform, ExtensionKey, getGalleryExtensionId, groupByExtension } from '../common/extensionManagementUtil.js';
import { IExtensionsProfileScannerService, IScannedProfileExtension } from '../common/extensionsProfileScannerService.js';
import { IExtensionsScannerService, IScannedExtension, ManifestMetadata, UserExtensionsScanOptions } from '../common/extensionsScannerService.js';
import { ExtensionsDownloader } from './extensionDownloader.js';
import { ExtensionsLifecycle } from './extensionLifecycle.js';
import { fromExtractError, getManifest } from './extensionManagementUtil.js';
import { ExtensionsManifestCache } from './extensionsManifestCache.js';
import { DidChangeProfileExtensionsEvent, ExtensionsWatcher } from './extensionsWatcher.js';
import { ExtensionType, IExtension, IExtensionManifest, TargetPlatform } from '../../extensions/common/extensions.js';
import { isEngineValid } from '../../extensions/common/extensionValidator.js';
import { FileChangesEvent, FileChangeType, FileOperationResult, IFileService, IFileStat, toFileOperationResult } from '../../files/common/files.js';
import { IInstantiationService, refineServiceDecorator } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';
import { IProductService } from '../../product/common/productService.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IExtensionGalleryManifestService } from '../common/extensionGalleryManifest.js';

export const INativeServerExtensionManagementService = refineServiceDecorator<IExtensionManagementService, INativeServerExtensionManagementService>(IExtensionManagementService);
export interface INativeServerExtensionManagementService extends IExtensionManagementService {
	readonly _serviceBrand: undefined;
	scanAllUserInstalledExtensions(): Promise<ILocalExtension[]>;
	scanInstalledExtensionAtLocation(location: URI): Promise<ILocalExtension | null>;
	deleteExtensions(...extensions: IExtension[]): Promise<void>;
}

type ExtractExtensionResult = { readonly local: ILocalExtension; readonly verificationStatus?: ExtensionSignatureVerificationCode };

const DELETED_FOLDER_POSTFIX = '.vsctmp';

export class ExtensionManagementService extends AbstractExtensionManagementService implements INativeServerExtensionManagementService {

	private readonly extensionsScanner: ExtensionsScanner;
	private readonly manifestCache: ExtensionsManifestCache;
	private readonly extensionsDownloader: ExtensionsDownloader;

	private readonly extractingGalleryExtensions = new Map<string, Promise<ExtractExtensionResult>>();

	constructor(
		@IExtensionGalleryService galleryService: IExtensionGalleryService,
		@ITelemetryService telemetryService: ITelemetryService,
		@ILogService logService: ILogService,
		@INativeEnvironmentService private readonly environmentService: INativeEnvironmentService,
		@IExtensionsScannerService private readonly extensionsScannerService: IExtensionsScannerService,
		@IExtensionsProfileScannerService private readonly extensionsProfileScannerService: IExtensionsProfileScannerService,
		@IDownloadService private downloadService: IDownloadService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IFileService private readonly fileService: IFileService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IExtensionGalleryManifestService protected readonly extensionGalleryManifestService: IExtensionGalleryManifestService,
		@IProductService productService: IProductService,
		@IAllowedExtensionsService allowedExtensionsService: IAllowedExtensionsService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService
	) {
		super(galleryService, telemetryService, uriIdentityService, logService, productService, allowedExtensionsService, userDataProfilesService);
		const extensionLifecycle = this._register(instantiationService.createInstance(ExtensionsLifecycle));
		this.extensionsScanner = this._register(instantiationService.createInstance(ExtensionsScanner, extension => extensionLifecycle.postUninstall(extension)));
		this.manifestCache = this._register(new ExtensionsManifestCache(userDataProfilesService, fileService, uriIdentityService, this, this.logService));
		this.extensionsDownloader = this._register(instantiationService.createInstance(ExtensionsDownloader));

		const extensionsWatcher = this._register(new ExtensionsWatcher(this, this.extensionsScannerService, userDataProfilesService, extensionsProfileScannerService, uriIdentityService, fileService, logService));
		this._register(extensionsWatcher.onDidChangeExtensionsByAnotherSource(e => this.onDidChangeExtensionsFromAnotherSource(e)));
		this.watchForExtensionsNotInstalledBySystem();
	}

	private _targetPlatformPromise: Promise<TargetPlatform> | undefined;
	getTargetPlatform(): Promise<TargetPlatform> {
		if (!this._targetPlatformPromise) {
			this._targetPlatformPromise = computeTargetPlatform(this.fileService, this.logService);
		}
		return this._targetPlatformPromise;
	}

	async zip(extension: ILocalExtension): Promise<URI> {
		this.logService.trace('ExtensionManagementService#zip', extension.identifier.id);
		const files = await this.collectFiles(extension);
		const location = await zip(joinPath(this.extensionsDownloader.extensionsDownloadDir, generateUuid()).fsPath, files);
		return URI.file(location);
	}

	async getManifest(vsix: URI): Promise<IExtensionManifest> {
		const { location, cleanup } = await this.downloadVsix(vsix);
		const zipPath = path.resolve(location.fsPath);
		try {
			return await getManifest(zipPath);
		} finally {
			await cleanup();
		}
	}

	getInstalled(type?: ExtensionType, profileLocation: URI = this.userDataProfilesService.defaultProfile.extensionsResource, productVersion: IProductVersion = { version: this.productService.version, date: this.productService.date }, language?: string): Promise<ILocalExtension[]> {
		return this.extensionsScanner.scanExtensions(type ?? null, profileLocation, productVersion, language);
	}

	scanAllUserInstalledExtensions(): Promise<ILocalExtension[]> {
		return this.extensionsScanner.scanAllUserExtensions();
	}

	scanInstalledExtensionAtLocation(location: URI): Promise<ILocalExtension | null> {
		return this.extensionsScanner.scanUserExtensionAtLocation(location);
	}

	async install(vsix: URI, options: InstallOptions = {}): Promise<ILocalExtension> {
		this.logService.trace('ExtensionManagementService#install', vsix.toString());

		const { location, cleanup } = await this.downloadVsix(vsix);

		try {
			const manifest = await getManifest(path.resolve(location.fsPath));
			const extensionId = getGalleryExtensionId(manifest.publisher, manifest.name);
			if (manifest.engines && manifest.engines.vscode && !isEngineValid(manifest.engines.vscode, this.productService.version, this.productService.date)) {
				throw new Error(nls.localize('incompatible', "Unable to install extension '{0}' as it is not compatible with VS Code '{1}'.", extensionId, this.productService.version));
			}

			const allowedToInstall = this.allowedExtensionsService.isAllowed({ id: extensionId, version: manifest.version, publisherDisplayName: undefined });
			if (allowedToInstall !== true) {
				throw new Error(nls.localize('notAllowed', "This extension cannot be installed because {0}", allowedToInstall.value));
			}

			const results = await this.installExtensions([{ manifest, extension: location, options }]);
			const result = results.find(({ identifier }) => areSameExtensions(identifier, { id: extensionId }));
			if (result?.local) {
				return result.local;
			}
			if (result?.error) {
				throw result.error;
			}
			throw toExtensionManagementError(new Error(`Unknown error while installing extension ${extensionId}`));
		} finally {
			await cleanup();
		}
	}

	async installFromLocation(location: URI, profileLocation: URI): Promise<ILocalExtension> {
		this.logService.trace('ExtensionManagementService#installFromLocation', location.toString());
		const local = await this.extensionsScanner.scanUserExtensionAtLocation(location);
		if (!local || !local.manifest.name || !local.manifest.version) {
			throw new Error(`Cannot find a valid extension from the location ${location.toString()}`);
		}
		await this.addExtensionsToProfile([[local, { source: 'resource' }]], profileLocation);
		this.logService.info('Successfully installed extension', local.identifier.id, profileLocation.toString());
		return local;
	}

	async installExtensionsFromProfile(extensions: IExtensionIdentifier[], fromProfileLocation: URI, toProfileLocation: URI): Promise<ILocalExtension[]> {
		this.logService.trace('ExtensionManagementService#installExtensionsFromProfile', extensions, fromProfileLocation.toString(), toProfileLocation.toString());
		const extensionsToInstall = (await this.getInstalled(ExtensionType.User, fromProfileLocation)).filter(e => extensions.some(id => areSameExtensions(id, e.identifier)));
		if (extensionsToInstall.length) {
			const metadata = await Promise.all(extensionsToInstall.map(e => this.extensionsScanner.scanMetadata(e, fromProfileLocation)));
			await this.addExtensionsToProfile(extensionsToInstall.map((e, index) => [e, metadata[index]]), toProfileLocation);
			this.logService.info('Successfully installed extensions', extensionsToInstall.map(e => e.identifier.id), toProfileLocation.toString());
		}
		return extensionsToInstall;
	}

	async updateMetadata(local: ILocalExtension, metadata: Partial<Metadata>, profileLocation: URI): Promise<ILocalExtension> {
		this.logService.trace('ExtensionManagementService#updateMetadata', local.identifier.id);
		if (metadata.isPreReleaseVersion) {
			metadata.preRelease = true;
			metadata.hasPreReleaseVersion = true;
		}
		// unset if false
		if (metadata.isMachineScoped === false) {
			metadata.isMachineScoped = undefined;
		}
		if (metadata.isBuiltin === false) {
			metadata.isBuiltin = undefined;
		}
		if (metadata.pinned === false) {
			metadata.pinned = undefined;
		}
		local = await this.extensionsScanner.updateMetadata(local, metadata, profileLocation);
		this.manifestCache.invalidate(profileLocation);
		this._onDidUpdateExtensionMetadata.fire({ local, profileLocation });
		return local;
	}

	protected deleteExtension(extension: ILocalExtension): Promise<void> {
		return this.extensionsScanner.deleteExtension(extension, 'remove');
	}

	protected copyExtension(extension: ILocalExtension, fromProfileLocation: URI, toProfileLocation: URI, metadata: Partial<Metadata>): Promise<ILocalExtension> {
		return this.extensionsScanner.copyExtension(extension, fromProfileLocation, toProfileLocation, metadata);
	}

	protected moveExtension(extension: ILocalExtension, fromProfileLocation: URI, toProfileLocation: URI, metadata: Partial<Metadata>): Promise<ILocalExtension> {
		return this.extensionsScanner.moveExtension(extension, fromProfileLocation, toProfileLocation, metadata);
	}

	protected removeExtension(extension: ILocalExtension, fromProfileLocation: URI): Promise<void> {
		return this.extensionsScanner.removeExtension(extension.identifier, fromProfileLocation);
	}

	copyExtensions(fromProfileLocation: URI, toProfileLocation: URI): Promise<void> {
		return this.extensionsScanner.copyExtensions(fromProfileLocation, toProfileLocation, { version: this.productService.version, date: this.productService.date });
	}

	deleteExtensions(...extensions: IExtension[]): Promise<void> {
		return this.extensionsScanner.setExtensionsForRemoval(...extensions);
	}

	async cleanUp(): Promise<void> {
		this.logService.trace('ExtensionManagementService#cleanUp');
		try {
			await this.extensionsScanner.cleanUp();
		} catch (error) {
			this.logService.error(error);
		}
	}

	async download(extension: IGalleryExtension, operation: InstallOperation, donotVerifySignature: boolean): Promise<URI> {
		const { location } = await this.downloadExtension(extension, operation, !donotVerifySignature);
		return location;
	}

	private async downloadVsix(vsix: URI): Promise<{ location: URI; cleanup: () => Promise<void> }> {
		if (vsix.scheme === Schemas.file) {
			return { location: vsix, async cleanup() { } };
		}
		this.logService.trace('Downloading extension from', vsix.toString());
		const location = joinPath(this.extensionsDownloader.extensionsDownloadDir, generateUuid());
		await this.downloadService.download(vsix, location);
		this.logService.info('Downloaded extension to', location.toString());
		const cleanup = async () => {
			try {
				await this.fileService.del(location);
			} catch (error) {
				this.logService.error(error);
			}
		};
		return { location, cleanup };
	}

	protected getCurrentExtensionsManifestLocation(): URI {
		return this.userDataProfilesService.defaultProfile.extensionsResource;
	}

	protected createInstallExtensionTask(manifest: IExtensionManifest, extension: URI | IGalleryExtension, options: InstallExtensionTaskOptions): IInstallExtensionTask {
		const extensionKey = extension instanceof URI ? new ExtensionKey({ id: getGalleryExtensionId(manifest.publisher, manifest.name) }, manifest.version) : ExtensionKey.create(extension);
		return this.instantiationService.createInstance(InstallExtensionInProfileTask, extensionKey, manifest, extension, options, (operation, token) => {
			if (extension instanceof URI) {
				return this.extractVSIX(extensionKey, extension, options, token);
			}
			let promise = this.extractingGalleryExtensions.get(extensionKey.toString());
			if (!promise) {
				this.extractingGalleryExtensions.set(extensionKey.toString(), promise = this.downloadAndExtractGalleryExtension(extensionKey, extension, operation, options, token));
				promise.finally(() => this.extractingGalleryExtensions.delete(extensionKey.toString()));
			}
			return promise;
		}, this.extensionsScanner);
	}

	protected createUninstallExtensionTask(extension: ILocalExtension, options: UninstallExtensionTaskOptions): IUninstallExtensionTask {
		return new UninstallExtensionInProfileTask(extension, options, this.extensionsProfileScannerService);
	}

	private async downloadAndExtractGalleryExtension(extensionKey: ExtensionKey, gallery: IGalleryExtension, operation: InstallOperation, options: InstallExtensionTaskOptions, token: CancellationToken): Promise<ExtractExtensionResult> {
		const { verificationStatus, location } = await this.downloadExtension(gallery, operation, !options.donotVerifySignature, options.context?.[EXTENSION_INSTALL_CLIENT_TARGET_PLATFORM_CONTEXT] as TargetPlatform | undefined);
		try {

			if (token.isCancellationRequested) {
				throw new CancellationError();
			}

			// validate manifest
			const manifest = await getManifest(location.fsPath);
			if (!new ExtensionKey(gallery.identifier, gallery.version).equals(new ExtensionKey({ id: getGalleryExtensionId(manifest.publisher, manifest.name) }, manifest.version))) {
				throw new ExtensionManagementError(nls.localize('invalidManifest', "Cannot install '{0}' extension because of manifest mismatch with Marketplace", gallery.identifier.id), ExtensionManagementErrorCode.Invalid);
			}

			const local = await this.extensionsScanner.extractUserExtension(
				extensionKey,
				location.fsPath,
				false,
				token);

			if (verificationStatus !== ExtensionSignatureVerificationCode.Success && this.environmentService.isBuilt) {
				try {
					await this.extensionsDownloader.delete(location);
				} catch (e) {
					/* Ignore */
					this.logService.warn(`Error while deleting the downloaded file`, location.toString(), getErrorMessage(e));
				}
			}

			return { local, verificationStatus };
		} catch (error) {
			try {
				await this.extensionsDownloader.delete(location);
			} catch (e) {
				/* Ignore */
				this.logService.warn(`Error while deleting the downloaded file`, location.toString(), getErrorMessage(e));
			}
			throw toExtensionManagementError(error);
		}
	}

	private async downloadExtension(extension: IGalleryExtension, operation: InstallOperation, verifySignature: boolean, clientTargetPlatform?: TargetPlatform): Promise<{ readonly location: URI; readonly verificationStatus: ExtensionSignatureVerificationCode | undefined }> {
		if (verifySignature) {
			const value = this.configurationService.getValue(VerifyExtensionSignatureConfigKey);
			verifySignature = isBoolean(value) ? value : true;
		}
		const { location, verificationStatus } = await this.extensionsDownloader.download(extension, operation, verifySignature, clientTargetPlatform);
		const shouldRequireSignature = shouldRequireRepositorySignatureFor(extension.private, await this.extensionGalleryManifestService.getExtensionGalleryManifest());

		if (
			verificationStatus !== ExtensionSignatureVerificationCode.Success
			&& !(verificationStatus === ExtensionSignatureVerificationCode.NotSigned && !shouldRequireSignature)
			&& verifySignature
			&& this.environmentService.isBuilt
			&& (await this.getTargetPlatform()) !== TargetPlatform.LINUX_ARMHF
		) {
			try {
				await this.extensionsDownloader.delete(location);
			} catch (e) {
				/* Ignore */
				this.logService.warn(`Error while deleting the downloaded file`, location.toString(), getErrorMessage(e));
			}

			if (!verificationStatus) {
				throw new ExtensionManagementError(nls.localize('signature verification not executed', "Signature verification was not executed."), ExtensionManagementErrorCode.SignatureVerificationInternal);
			}

			switch (verificationStatus) {
				case ExtensionSignatureVerificationCode.PackageIntegrityCheckFailed:
				case ExtensionSignatureVerificationCode.SignatureIsInvalid:
				case ExtensionSignatureVerificationCode.SignatureManifestIsInvalid:
				case ExtensionSignatureVerificationCode.SignatureIntegrityCheckFailed:
				case ExtensionSignatureVerificationCode.EntryIsMissing:
				case ExtensionSignatureVerificationCode.EntryIsTampered:
				case ExtensionSignatureVerificationCode.Untrusted:
				case ExtensionSignatureVerificationCode.CertificateRevoked:
				case ExtensionSignatureVerificationCode.SignatureIsNotValid:
				case ExtensionSignatureVerificationCode.SignatureArchiveHasTooManyEntries:
				case ExtensionSignatureVerificationCode.NotSigned:
					throw new ExtensionManagementError(nls.localize('signature verification failed', "Signature verification failed with '{0}' error.", verificationStatus), ExtensionManagementErrorCode.SignatureVerificationFailed);
			}

			throw new ExtensionManagementError(nls.localize('signature verification failed', "Signature verification failed with '{0}' error.", verificationStatus), ExtensionManagementErrorCode.SignatureVerificationInternal);
		}

		return { location, verificationStatus };
	}

	private async extractVSIX(extensionKey: ExtensionKey, location: URI, options: InstallExtensionTaskOptions, token: CancellationToken): Promise<ExtractExtensionResult> {
		const local = await this.extensionsScanner.extractUserExtension(
			extensionKey,
			path.resolve(location.fsPath),
			isBoolean(options.keepExisting) ? !options.keepExisting : true,
			token);
		return { local };
	}

	private async collectFiles(extension: ILocalExtension): Promise<IFile[]> {

		const collectFilesFromDirectory = async (dir: string): Promise<string[]> => {
			let entries = await pfs.Promises.readdir(dir);
			entries = entries.map(e => path.join(dir, e));
			const stats = await Promise.all(entries.map(e => fs.promises.stat(e)));
			let promise: Promise<string[]> = Promise.resolve([]);
			stats.forEach((stat, index) => {
				const entry = entries[index];
				if (stat.isFile()) {
					promise = promise.then(result => ([...result, entry]));
				}
				if (stat.isDirectory()) {
					promise = promise
						.then(result => collectFilesFromDirectory(entry)
							.then(files => ([...result, ...files])));
				}
			});
			return promise;
		};

		const files = await collectFilesFromDirectory(extension.location.fsPath);
		return files.map(f => ({ path: `extension/${path.relative(extension.location.fsPath, f)}`, localPath: f }));
	}

	private async onDidChangeExtensionsFromAnotherSource({ added, removed }: DidChangeProfileExtensionsEvent): Promise<void> {
		if (removed) {
			const removedExtensions = added && this.uriIdentityService.extUri.isEqual(removed.profileLocation, added.profileLocation)
				? removed.extensions.filter(e => added.extensions.every(identifier => !areSameExtensions(identifier, e)))
				: removed.extensions;
			for (const identifier of removedExtensions) {
				this.logService.info('Extensions removed from another source', identifier.id, removed.profileLocation.toString());
				this._onDidUninstallExtension.fire({ identifier, profileLocation: removed.profileLocation });
			}
		}
		if (added) {
			const extensions = await this.getInstalled(ExtensionType.User, added.profileLocation);
			const addedExtensions = extensions.filter(e => added.extensions.some(identifier => areSameExtensions(identifier, e.identifier)));
			this._onDidInstallExtensions.fire(addedExtensions.map(local => {
				this.logService.info('Extensions added from another source', local.identifier.id, added.profileLocation.toString());
				return { identifier: local.identifier, local, profileLocation: added.profileLocation, operation: InstallOperation.None };
			}));
		}
	}

	private readonly knownDirectories = new ResourceSet();
	private async watchForExtensionsNotInstalledBySystem(): Promise<void> {
		this._register(this.extensionsScanner.onExtract(resource => this.knownDirectories.add(resource)));
		const stat = await this.fileService.resolve(this.extensionsScannerService.userExtensionsLocation);
		for (const childStat of stat.children ?? []) {
			if (childStat.isDirectory) {
				this.knownDirectories.add(childStat.resource);
			}
		}
		this._register(this.fileService.watch(this.extensionsScannerService.userExtensionsLocation));
		this._register(this.fileService.onDidFilesChange(e => this.onDidFilesChange(e)));
	}

	private async onDidFilesChange(e: FileChangesEvent): Promise<void> {
		if (!e.affects(this.extensionsScannerService.userExtensionsLocation, FileChangeType.ADDED)) {
			return;
		}

		const added: ILocalExtension[] = [];
		for (const resource of e.rawAdded) {
			// Check if this is a known directory
			if (this.knownDirectories.has(resource)) {
				continue;
			}

			// Is not immediate child of extensions resource
			if (!this.uriIdentityService.extUri.isEqual(this.uriIdentityService.extUri.dirname(resource), this.extensionsScannerService.userExtensionsLocation)) {
				continue;
			}

			// .obsolete file changed
			if (this.uriIdentityService.extUri.isEqual(resource, this.uriIdentityService.extUri.joinPath(this.extensionsScannerService.userExtensionsLocation, '.obsolete'))) {
				continue;
			}

			// Ignore changes to files starting with `.`
			if (this.uriIdentityService.extUri.basename(resource).startsWith('.')) {
				continue;
			}

			// Ignore changes to the deleted folder
			if (this.uriIdentityService.extUri.basename(resource).endsWith(DELETED_FOLDER_POSTFIX)) {
				continue;
			}

			try {
				// Check if this is a directory
				if (!(await this.fileService.stat(resource)).isDirectory) {
					continue;
				}
			} catch (error) {
				if (toFileOperationResult(error) !== FileOperationResult.FILE_NOT_FOUND) {
					this.logService.error(error);
				}
				continue;
			}

			// Check if this is an extension added by another source
			// Extension added by another source will not have installed timestamp
			const extension = await this.extensionsScanner.scanUserExtensionAtLocation(resource);
			if (extension && extension.installedTimestamp === undefined) {
				this.knownDirectories.add(resource);
				added.push(extension);
			}
		}

		if (added.length) {
			await this.addExtensionsToProfile(added.map(e => [e, undefined]), this.userDataProfilesService.defaultProfile.extensionsResource);
			this.logService.info('Added extensions to default profile from external source', added.map(e => e.identifier.id));
		}
	}

	private async addExtensionsToProfile(extensions: [ILocalExtension, Metadata | undefined][], profileLocation: URI): Promise<void> {
		const localExtensions = extensions.map(e => e[0]);
		await this.extensionsScanner.unsetExtensionsForRemoval(...localExtensions.map(extension => ExtensionKey.create(extension)));
		await this.extensionsProfileScannerService.addExtensionsToProfile(extensions, profileLocation);
		this._onDidInstallExtensions.fire(localExtensions.map(local => ({ local, identifier: local.identifier, operation: InstallOperation.None, profileLocation })));
	}
}

type UpdateMetadataErrorClassification = {
	owner: 'sandy081';
	comment: 'Update metadata error';
	extensionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'extension identifier' };
	code?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'error code' };
	isProfile?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Is writing into profile' };
};
type UpdateMetadataErrorEvent = {
	extensionId: string;
	code?: string;
	isProfile?: boolean;
};

export class ExtensionsScanner extends Disposable {

	private readonly obsoletedResource: URI;
	private readonly obsoleteFileLimiter: Queue<IStringDictionary<boolean>>;

	private readonly _onExtract = this._register(new Emitter<URI>());
	readonly onExtract = this._onExtract.event;

	private scanAllExtensionPromise = new ResourceMap<Promise<IScannedExtension[]>>();
	private scanUserExtensionsPromise = new ResourceMap<Promise<IScannedExtension[]>>();

	constructor(
		private readonly beforeRemovingExtension: (e: ILocalExtension) => Promise<void>,
		@IFileService private readonly fileService: IFileService,
		@IExtensionsScannerService private readonly extensionsScannerService: IExtensionsScannerService,
		@IExtensionsProfileScannerService private readonly extensionsProfileScannerService: IExtensionsProfileScannerService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@ILogService private readonly logService: ILogService,
	) {
		super();
		this.obsoletedResource = joinPath(this.extensionsScannerService.userExtensionsLocation, '.obsolete');
		this.obsoleteFileLimiter = new Queue();
	}

	async cleanUp(): Promise<void> {
		await this.removeTemporarilyDeletedFolders();
		await this.deleteExtensionsMarkedForRemoval();
		//TODO: Remove this initiialization after coupe of releases
		await this.initializeExtensionSize();
	}

	async scanExtensions(type: ExtensionType | null, profileLocation: URI, productVersion: IProductVersion, language?: string): Promise<ILocalExtension[]> {
		try {
			const cacheKey: URI = profileLocation.with({ query: language });
			const userScanOptions: UserExtensionsScanOptions = { includeInvalid: true, profileLocation, productVersion, language };
			let scannedExtensions: IScannedExtension[] = [];
			if (type === null || type === ExtensionType.System) {
				let scanAllExtensionsPromise = this.scanAllExtensionPromise.get(cacheKey);
				if (!scanAllExtensionsPromise) {
					scanAllExtensionsPromise = this.extensionsScannerService.scanAllExtensions({ language }, userScanOptions)
						.finally(() => this.scanAllExtensionPromise.delete(cacheKey));
					this.scanAllExtensionPromise.set(cacheKey, scanAllExtensionsPromise);
				}
				scannedExtensions.push(...await scanAllExtensionsPromise);
			} else if (type === ExtensionType.User) {
				let scanUserExtensionsPromise = this.scanUserExtensionsPromise.get(cacheKey);
				if (!scanUserExtensionsPromise) {
					scanUserExtensionsPromise = this.extensionsScannerService.scanUserExtensions(userScanOptions)
						.finally(() => this.scanUserExtensionsPromise.delete(cacheKey));
					this.scanUserExtensionsPromise.set(cacheKey, scanUserExtensionsPromise);
				}
				scannedExtensions.push(...await scanUserExtensionsPromise);
			}
			scannedExtensions = type !== null ? scannedExtensions.filter(r => r.type === type) : scannedExtensions;
			return await Promise.all(scannedExtensions.map(extension => this.toLocalExtension(extension)));
		} catch (error) {
			throw toExtensionManagementError(error, ExtensionManagementErrorCode.Scanning);
		}
	}

	async scanAllUserExtensions(): Promise<ILocalExtension[]> {
		try {
			const scannedExtensions = await this.extensionsScannerService.scanAllUserExtensions();
			return await Promise.all(scannedExtensions.map(extension => this.toLocalExtension(extension)));
		} catch (error) {
			throw toExtensionManagementError(error, ExtensionManagementErrorCode.Scanning);
		}
	}

	async scanUserExtensionAtLocation(location: URI): Promise<ILocalExtension | null> {
		try {
			const scannedExtension = await this.extensionsScannerService.scanExistingExtension(location, ExtensionType.User, { includeInvalid: true });
			if (scannedExtension) {
				return await this.toLocalExtension(scannedExtension);
			}
		} catch (error) {
			this.logService.error(error);
		}
		return null;
	}

	async extractUserExtension(extensionKey: ExtensionKey, zipPath: string, removeIfExists: boolean, token: CancellationToken): Promise<ILocalExtension> {
		const folderName = extensionKey.toString();
		const tempLocation = URI.file(path.join(this.extensionsScannerService.userExtensionsLocation.fsPath, `.${generateUuid()}`));
		const extensionLocation = URI.file(path.join(this.extensionsScannerService.userExtensionsLocation.fsPath, folderName));

		if (await this.fileService.exists(extensionLocation)) {
			if (!removeIfExists) {
				try {
					return await this.scanLocalExtension(extensionLocation, ExtensionType.User);
				} catch (error) {
					this.logService.warn(`Error while scanning the existing extension at ${extensionLocation.path}. Deleting the existing extension and extracting it.`, getErrorMessage(error));
				}
			}

			try {
				await this.deleteExtensionFromLocation(extensionKey.id, extensionLocation, 'removeExisting');
			} catch (error) {
				throw new ExtensionManagementError(nls.localize('errorDeleting', "Unable to delete the existing folder '{0}' while installing the extension '{1}'. Please delete the folder manually and try again", extensionLocation.fsPath, extensionKey.id), ExtensionManagementErrorCode.Delete);
			}
		}

		try {
			if (token.isCancellationRequested) {
				throw new CancellationError();
			}

			// Extract
			try {
				this.logService.trace(`Started extracting the extension from ${zipPath} to ${extensionLocation.fsPath}`);
				await extract(zipPath, tempLocation.fsPath, { sourcePath: 'extension', overwrite: true }, token);
				this.logService.info(`Extracted extension to ${extensionLocation}:`, extensionKey.id);
			} catch (e) {
				throw fromExtractError(e);
			}

			const metadata: ManifestMetadata = { installedTimestamp: Date.now(), targetPlatform: extensionKey.targetPlatform };
			try {
				metadata.size = await computeSize(tempLocation, this.fileService);
			} catch (error) {
				// Log & ignore
				this.logService.warn(`Error while getting the size of the extracted extension : ${tempLocation.fsPath}`, getErrorMessage(error));
			}

			try {
				await this.extensionsScannerService.updateManifestMetadata(tempLocation, metadata);
			} catch (error) {
				this.telemetryService.publicLog2<UpdateMetadataErrorEvent, UpdateMetadataErrorClassification>('extension:extract', { extensionId: extensionKey.id, code: `${toFileOperationResult(error)}` });
				throw toExtensionManagementError(error, ExtensionManagementErrorCode.UpdateMetadata);
			}

			if (token.isCancellationRequested) {
				throw new CancellationError();
			}

			// Rename
			try {
				this.logService.trace(`Started renaming the extension from ${tempLocation.fsPath} to ${extensionLocation.fsPath}`);
				await this.rename(tempLocation.fsPath, extensionLocation.fsPath);
				this.logService.info('Renamed to', extensionLocation.fsPath);
			} catch (error) {
				if (error.code === 'ENOTEMPTY') {
					this.logService.info(`Rename failed because extension was installed by another source. So ignoring renaming.`, extensionKey.id);
					try { await this.fileService.del(tempLocation, { recursive: true }); } catch (e) { /* ignore */ }
				} else {
					this.logService.info(`Rename failed because of ${getErrorMessage(error)}. Deleted from extracted location`, tempLocation);
					throw error;
				}
			}

			this._onExtract.fire(extensionLocation);

		} catch (error) {
			try { await this.fileService.del(tempLocation, { recursive: true }); } catch (e) { /* ignore */ }
			throw error;
		}

		return this.scanLocalExtension(extensionLocation, ExtensionType.User);
	}

	async scanMetadata(local: ILocalExtension, profileLocation: URI): Promise<Metadata | undefined> {
		const extension = await this.getScannedExtension(local, profileLocation);
		return extension?.metadata;
	}

	private async getScannedExtension(local: ILocalExtension, profileLocation: URI): Promise<IScannedProfileExtension | undefined> {
		const extensions = await this.extensionsProfileScannerService.scanProfileExtensions(profileLocation);
		return extensions.find(e => areSameExtensions(e.identifier, local.identifier));
	}

	async updateMetadata(local: ILocalExtension, metadata: Partial<Metadata>, profileLocation: URI): Promise<ILocalExtension> {
		try {
			await this.extensionsProfileScannerService.updateMetadata([[local, metadata]], profileLocation);
		} catch (error) {
			this.telemetryService.publicLog2<UpdateMetadataErrorEvent, UpdateMetadataErrorClassification>('extension:extract', { extensionId: local.identifier.id, code: `${toFileOperationResult(error)}`, isProfile: !!profileLocation });
			throw toExtensionManagementError(error, ExtensionManagementErrorCode.UpdateMetadata);
		}
		return this.scanLocalExtension(local.location, local.type, profileLocation);
	}

	async setExtensionsForRemoval(...extensions: IExtension[]): Promise<void> {
		const extensionsToRemove = [];
		for (const extension of extensions) {
			if (await this.fileService.exists(extension.location)) {
				extensionsToRemove.push(extension);
			}
		}
		const extensionKeys: ExtensionKey[] = extensionsToRemove.map(e => ExtensionKey.create(e));
		await this.withRemovedExtensions(removedExtensions =>
			extensionKeys.forEach(extensionKey => {
				removedExtensions[extensionKey.toString()] = true;
				this.logService.info('Marked extension as removed', extensionKey.toString());
			}));
	}

	async unsetExtensionsForRemoval(...extensionKeys: ExtensionKey[]): Promise<boolean[]> {
		try {
			const results: boolean[] = [];
			await this.withRemovedExtensions(removedExtensions =>
				extensionKeys.forEach(extensionKey => {
					if (removedExtensions[extensionKey.toString()]) {
						results.push(true);
						delete removedExtensions[extensionKey.toString()];
					} else {
						results.push(false);
					}
				}));
			return results;
		} catch (error) {
			throw toExtensionManagementError(error, ExtensionManagementErrorCode.UnsetRemoved);
		}
	}

	async deleteExtension(extension: ILocalExtension | IScannedExtension, type: string): Promise<void> {
		if (this.uriIdentityService.extUri.isEqualOrParent(extension.location, this.extensionsScannerService.userExtensionsLocation)) {
			await this.deleteExtensionFromLocation(extension.identifier.id, extension.location, type);
			await this.unsetExtensionsForRemoval(ExtensionKey.create(extension));
		}
	}

	async copyExtension(extension: ILocalExtension, fromProfileLocation: URI, toProfileLocation: URI, metadata: Partial<Metadata>): Promise<ILocalExtension> {
		const source = await this.getScannedExtension(extension, fromProfileLocation);
		const target = await this.getScannedExtension(extension, toProfileLocation);
		metadata = { ...source?.metadata, ...metadata };

		if (target) {
			if (this.uriIdentityService.extUri.isEqual(target.location, extension.location)) {
				await this.extensionsProfileScannerService.updateMetadata([[extension, { ...target.metadata, ...metadata }]], toProfileLocation);
			} else {
				const targetExtension = await this.scanLocalExtension(target.location, extension.type, toProfileLocation);
				await this.extensionsProfileScannerService.removeExtensionsFromProfile([targetExtension.identifier], toProfileLocation);
				await this.extensionsProfileScannerService.addExtensionsToProfile([[extension, { ...target.metadata, ...metadata }]], toProfileLocation);
			}
		} else {
			await this.extensionsProfileScannerService.addExtensionsToProfile([[extension, metadata]], toProfileLocation);
		}

		return this.scanLocalExtension(extension.location, extension.type, toProfileLocation);
	}

	async moveExtension(extension: ILocalExtension, fromProfileLocation: URI, toProfileLocation: URI, metadata: Partial<Metadata>): Promise<ILocalExtension> {
		const source = await this.getScannedExtension(extension, fromProfileLocation);
		const target = await this.getScannedExtension(extension, toProfileLocation);
		metadata = { ...source?.metadata, ...metadata };

		if (target) {
			if (this.uriIdentityService.extUri.isEqual(target.location, extension.location)) {
				await this.extensionsProfileScannerService.updateMetadata([[extension, { ...target.metadata, ...metadata }]], toProfileLocation);
			} else {
				const targetExtension = await this.scanLocalExtension(target.location, extension.type, toProfileLocation);
				await this.removeExtension(targetExtension.identifier, toProfileLocation);
				await this.extensionsProfileScannerService.addExtensionsToProfile([[extension, { ...target.metadata, ...metadata }]], toProfileLocation);
			}
		} else {
			await this.extensionsProfileScannerService.addExtensionsToProfile([[extension, metadata]], toProfileLocation);
			if (source) {
				await this.removeExtension(source.identifier, fromProfileLocation);
			}
		}

		return this.scanLocalExtension(extension.location, extension.type, toProfileLocation);
	}

	async removeExtension(identifier: IExtensionIdentifier, fromProfileLocation: URI): Promise<void> {
		await this.extensionsProfileScannerService.removeExtensionsFromProfile([identifier], fromProfileLocation);
	}

	async copyExtensions(fromProfileLocation: URI, toProfileLocation: URI, productVersion: IProductVersion): Promise<void> {
		const fromExtensions = await this.scanExtensions(ExtensionType.User, fromProfileLocation, productVersion);
		const extensions: [ILocalExtension, Metadata | undefined][] = await Promise.all(fromExtensions
			.filter(e => !e.isApplicationScoped) /* remove application scoped extensions */
			.map(async e => ([e, await this.scanMetadata(e, fromProfileLocation)])));
		await this.extensionsProfileScannerService.addExtensionsToProfile(extensions, toProfileLocation);
	}

	private async deleteExtensionFromLocation(id: string, location: URI, type: string): Promise<void> {
		this.logService.trace(`Deleting ${type} extension from disk`, id, location.fsPath);
		const renamedLocation = this.uriIdentityService.extUri.joinPath(this.uriIdentityService.extUri.dirname(location), `${this.uriIdentityService.extUri.basename(location)}.${hash(generateUuid()).toString(16)}${DELETED_FOLDER_POSTFIX}`);
		await this.rename(location.fsPath, renamedLocation.fsPath);
		await this.fileService.del(renamedLocation, { recursive: true });
		this.logService.info(`Deleted ${type} extension from disk`, id, location.fsPath);
	}

	private withRemovedExtensions(updateFn?: (removed: IStringDictionary<boolean>) => void): Promise<IStringDictionary<boolean>> {
		return this.obsoleteFileLimiter.queue(async () => {
			let raw: string | undefined;
			try {
				const content = await this.fileService.readFile(this.obsoletedResource, 'utf8');
				raw = content.value.toString();
			} catch (error) {
				if (toFileOperationResult(error) !== FileOperationResult.FILE_NOT_FOUND) {
					throw error;
				}
			}

			let removed = {};
			if (raw) {
				try {
					removed = JSON.parse(raw);
				} catch (e) { /* ignore */ }
			}

			if (updateFn) {
				updateFn(removed);
				if (Object.keys(removed).length) {
					await this.fileService.writeFile(this.obsoletedResource, VSBuffer.fromString(JSON.stringify(removed)));
				} else {
					try {
						await this.fileService.del(this.obsoletedResource);
					} catch (error) {
						if (toFileOperationResult(error) !== FileOperationResult.FILE_NOT_FOUND) {
							throw error;
						}
					}
				}
			}

			return removed;
		});
	}

	private async rename(extractPath: string, renamePath: string): Promise<void> {
		try {
			await pfs.Promises.rename(extractPath, renamePath, 2 * 60 * 1000 /* Retry for 2 minutes */);
		} catch (error) {
			throw toExtensionManagementError(error, ExtensionManagementErrorCode.Rename);
		}
	}

	async scanLocalExtension(location: URI, type: ExtensionType, profileLocation?: URI): Promise<ILocalExtension> {
		try {
			if (profileLocation) {
				const scannedExtensions = await this.extensionsScannerService.scanUserExtensions({ profileLocation });
				const scannedExtension = scannedExtensions.find(e => this.uriIdentityService.extUri.isEqual(e.location, location));
				if (scannedExtension) {
					return await this.toLocalExtension(scannedExtension);
				}
			} else {
				const scannedExtension = await this.extensionsScannerService.scanExistingExtension(location, type, { includeInvalid: true });
				if (scannedExtension) {
					return await this.toLocalExtension(scannedExtension);
				}
			}
			throw new ExtensionManagementError(nls.localize('cannot read', "Cannot read the extension from {0}", location.path), ExtensionManagementErrorCode.ScanningExtension);
		} catch (error) {
			throw toExtensionManagementError(error, ExtensionManagementErrorCode.ScanningExtension);
		}
	}

	private async toLocalExtension(extension: IScannedExtension): Promise<ILocalExtension> {
		let stat: IFileStat | undefined;
		try {
			stat = await this.fileService.resolve(extension.location);
		} catch (error) {/* ignore */ }

		let readmeUrl: URI | undefined;
		let changelogUrl: URI | undefined;
		if (stat?.children) {
			readmeUrl = stat.children.find(({ name }) => /^readme(\.txt|\.md|)$/i.test(name))?.resource;
			changelogUrl = stat.children.find(({ name }) => /^changelog(\.txt|\.md|)$/i.test(name))?.resource;
		}
		return {
			identifier: extension.identifier,
			type: extension.type,
			isBuiltin: extension.isBuiltin || !!extension.metadata?.isBuiltin,
			location: extension.location,
			manifest: extension.manifest,
			targetPlatform: extension.targetPlatform,
			validations: extension.validations,
			isValid: extension.isValid,
			readmeUrl,
			changelogUrl,
			publisherDisplayName: extension.metadata?.publisherDisplayName,
			publisherId: extension.metadata?.publisherId || null,
			isApplicationScoped: !!extension.metadata?.isApplicationScoped,
			isMachineScoped: !!extension.metadata?.isMachineScoped,
			isPreReleaseVersion: !!extension.metadata?.isPreReleaseVersion,
			hasPreReleaseVersion: !!extension.metadata?.hasPreReleaseVersion,
			preRelease: extension.preRelease,
			installedTimestamp: extension.metadata?.installedTimestamp,
			updated: !!extension.metadata?.updated,
			pinned: !!extension.metadata?.pinned,
			private: !!extension.metadata?.private,
			isWorkspaceScoped: false,
			source: extension.metadata?.source ?? (extension.identifier.uuid ? 'gallery' : 'vsix'),
			size: extension.metadata?.size ?? 0,
		};
	}

	private async initializeExtensionSize(): Promise<void> {
		const extensions = await this.extensionsScannerService.scanAllUserExtensions();
		await Promise.all(extensions.map(async extension => {
			// set size if not set before
			if (isDefined(extension.metadata?.installedTimestamp) && isUndefined(extension.metadata?.size)) {
				const size = await computeSize(extension.location, this.fileService);
				await this.extensionsScannerService.updateManifestMetadata(extension.location, { size });
			}
		}));
	}

	private async deleteExtensionsMarkedForRemoval(): Promise<void> {
		let removed: IStringDictionary<boolean>;
		try {
			removed = await this.withRemovedExtensions();
		} catch (error) {
			throw toExtensionManagementError(error, ExtensionManagementErrorCode.ReadRemoved);
		}

		if (Object.keys(removed).length === 0) {
			this.logService.debug(`No extensions are marked as removed.`);
			return;
		}

		this.logService.debug(`Deleting extensions marked as removed:`, Object.keys(removed));

		const extensions = await this.scanAllUserExtensions();
		const installed: Set<string> = new Set<string>();
		for (const e of extensions) {
			if (!removed[ExtensionKey.create(e).toString()]) {
				installed.add(e.identifier.id.toLowerCase());
			}
		}

		try {
			// running post uninstall tasks for extensions that are not installed anymore
			const byExtension = groupByExtension(extensions, e => e.identifier);
			await Promises.settled(byExtension.map(async e => {
				const latest = e.sort((a, b) => semver.rcompare(a.manifest.version, b.manifest.version))[0];
				if (!installed.has(latest.identifier.id.toLowerCase())) {
					await this.beforeRemovingExtension(latest);
				}
			}));
		} catch (error) {
			this.logService.error(error);
		}

		const toRemove = extensions.filter(e => e.installedTimestamp /* Installed by System */ && removed[ExtensionKey.create(e).toString()]);
		await Promise.allSettled(toRemove.map(e => this.deleteExtension(e, 'marked for removal')));
	}

	private async removeTemporarilyDeletedFolders(): Promise<void> {
		this.logService.trace('ExtensionManagementService#removeTempDeleteFolders');

		let stat;
		try {
			stat = await this.fileService.resolve(this.extensionsScannerService.userExtensionsLocation);
		} catch (error) {
			if (toFileOperationResult(error) !== FileOperationResult.FILE_NOT_FOUND) {
				this.logService.error(error);
			}
			return;
		}

		if (!stat?.children) {
			return;
		}

		try {
			await Promise.allSettled(stat.children.map(async child => {
				if (!child.isDirectory || !child.name.endsWith(DELETED_FOLDER_POSTFIX)) {
					return;
				}
				this.logService.trace('Deleting the temporarily deleted folder', child.resource.toString());
				try {
					await this.fileService.del(child.resource, { recursive: true });
					this.logService.trace('Deleted the temporarily deleted folder', child.resource.toString());
				} catch (error) {
					if (toFileOperationResult(error) !== FileOperationResult.FILE_NOT_FOUND) {
						this.logService.error(error);
					}
				}
			}));
		} catch (error) { /* ignore */ }
	}

}

class InstallExtensionInProfileTask extends AbstractExtensionTask<ILocalExtension> implements IInstallExtensionTask {

	private _operation = InstallOperation.Install;
	get operation() { return this.options.operation ?? this._operation; }

	private _verificationStatus: ExtensionSignatureVerificationCode | undefined;
	get verificationStatus() { return this._verificationStatus; }

	readonly identifier: IExtensionIdentifier;

	constructor(
		private readonly extensionKey: ExtensionKey,
		readonly manifest: IExtensionManifest,
		readonly source: IGalleryExtension | URI,
		readonly options: InstallExtensionTaskOptions,
		private readonly extractExtensionFn: (operation: InstallOperation, token: CancellationToken) => Promise<ExtractExtensionResult>,
		private readonly extensionsScanner: ExtensionsScanner,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IExtensionGalleryService private readonly galleryService: IExtensionGalleryService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IExtensionsScannerService private readonly extensionsScannerService: IExtensionsScannerService,
		@IExtensionsProfileScannerService private readonly extensionsProfileScannerService: IExtensionsProfileScannerService,
		@ILogService private readonly logService: ILogService,
	) {
		super();
		this.identifier = this.extensionKey.identifier;
	}

	protected async doRun(token: CancellationToken): Promise<ILocalExtension> {
		const installed = await this.extensionsScanner.scanExtensions(ExtensionType.User, this.options.profileLocation, this.options.productVersion);
		const existingExtension = installed.find(i => areSameExtensions(i.identifier, this.identifier));
		if (existingExtension) {
			this._operation = InstallOperation.Update;
		}

		const metadata: Metadata = {
			isApplicationScoped: this.options.isApplicationScoped || existingExtension?.isApplicationScoped,
			isMachineScoped: this.options.isMachineScoped || existingExtension?.isMachineScoped,
			isBuiltin: this.options.isBuiltin || existingExtension?.isBuiltin,
			isSystem: existingExtension?.type === ExtensionType.System ? true : undefined,
			installedTimestamp: Date.now(),
			pinned: this.options.installGivenVersion ? true : (this.options.pinned ?? existingExtension?.pinned),
			source: this.source instanceof URI ? 'vsix' : 'gallery',
		};

		let local: ILocalExtension | undefined;

		// VSIX
		if (this.source instanceof URI) {
			if (existingExtension) {
				if (this.extensionKey.equals(new ExtensionKey(existingExtension.identifier, existingExtension.manifest.version))) {
					try {
						await this.extensionsScanner.deleteExtension(existingExtension, 'existing');
					} catch (e) {
						throw new Error(nls.localize('restartCode', "Please restart VS Code before reinstalling {0}.", this.manifest.displayName || this.manifest.name));
					}
				}
			}
			// Remove the extension with same version if it is already uninstalled.
			// Installing a VSIX extension shall replace the existing extension always.
			const existingWithSameVersion = await this.unsetIfRemoved(this.extensionKey);
			if (existingWithSameVersion) {
				try {
					await this.extensionsScanner.deleteExtension(existingWithSameVersion, 'existing');
				} catch (e) {
					throw new Error(nls.localize('restartCode', "Please restart VS Code before reinstalling {0}.", this.manifest.displayName || this.manifest.name));
				}
			}

		}

		// Gallery
		else {
			metadata.id = this.source.identifier.uuid;
			metadata.publisherId = this.source.publisherId;
			metadata.publisherDisplayName = this.source.publisherDisplayName;
			metadata.targetPlatform = this.source.properties.targetPlatform;
			metadata.updated = !!existingExtension;
			metadata.private = this.source.private;
			metadata.isPreReleaseVersion = this.source.properties.isPreReleaseVersion;
			metadata.hasPreReleaseVersion = existingExtension?.hasPreReleaseVersion || this.source.properties.isPreReleaseVersion;
			metadata.preRelease = isBoolean(this.options.preRelease)
				? this.options.preRelease
				: this.options.installPreReleaseVersion || this.source.properties.isPreReleaseVersion || existingExtension?.preRelease;

			if (existingExtension && existingExtension.type !== ExtensionType.System && existingExtension.manifest.version === this.source.version) {
				return this.extensionsScanner.updateMetadata(existingExtension, metadata, this.options.profileLocation);
			}

			// Unset if the extension is uninstalled and return the unset extension.
			local = await this.unsetIfRemoved(this.extensionKey);
		}

		if (token.isCancellationRequested) {
			throw toExtensionManagementError(new CancellationError());
		}

		if (!local) {
			const result = await this.extractExtensionFn(this.operation, token);
			local = result.local;
			this._verificationStatus = result.verificationStatus;
		}

		if (this.uriIdentityService.extUri.isEqual(this.userDataProfilesService.defaultProfile.extensionsResource, this.options.profileLocation)) {
			try {
				await this.extensionsScannerService.initializeDefaultProfileExtensions();
			} catch (error) {
				throw toExtensionManagementError(error, ExtensionManagementErrorCode.IntializeDefaultProfile);
			}
		}

		if (token.isCancellationRequested) {
			throw toExtensionManagementError(new CancellationError());
		}

		try {
			await this.extensionsProfileScannerService.addExtensionsToProfile([[local, metadata]], this.options.profileLocation, !local.isValid);
		} catch (error) {
			throw toExtensionManagementError(error, ExtensionManagementErrorCode.AddToProfile);
		}

		const result = await this.extensionsScanner.scanLocalExtension(local.location, ExtensionType.User, this.options.profileLocation);
		if (!result) {
			throw new ExtensionManagementError('Cannot find the installed extension', ExtensionManagementErrorCode.InstalledExtensionNotFound);
		}

		if (this.source instanceof URI) {
			this.updateMetadata(local, token);
		}

		return result;
	}

	private async unsetIfRemoved(extensionKey: ExtensionKey): Promise<ILocalExtension | undefined> {
		// If the same version of extension is marked as removed, remove it from there and return the local.
		const [removed] = await this.extensionsScanner.unsetExtensionsForRemoval(extensionKey);
		if (removed) {
			this.logService.info('Removed the extension from removed list:', extensionKey.id);
			const userExtensions = await this.extensionsScanner.scanAllUserExtensions();
			return userExtensions.find(i => ExtensionKey.create(i).equals(extensionKey));
		}
		return undefined;
	}

	private async updateMetadata(extension: ILocalExtension, token: CancellationToken): Promise<void> {
		try {
			let [galleryExtension] = await this.galleryService.getExtensions([{ id: extension.identifier.id, version: extension.manifest.version }], token);
			if (!galleryExtension) {
				[galleryExtension] = await this.galleryService.getExtensions([{ id: extension.identifier.id }], token);
			}
			if (galleryExtension) {
				const metadata = {
					id: galleryExtension.identifier.uuid,
					publisherDisplayName: galleryExtension.publisherDisplayName,
					publisherId: galleryExtension.publisherId,
					isPreReleaseVersion: galleryExtension.properties.isPreReleaseVersion,
					hasPreReleaseVersion: extension.hasPreReleaseVersion || galleryExtension.properties.isPreReleaseVersion,
					preRelease: galleryExtension.properties.isPreReleaseVersion || this.options.installPreReleaseVersion
				};
				await this.extensionsScanner.updateMetadata(extension, metadata, this.options.profileLocation);
			}
		} catch (error) {
			/* Ignore Error */
		}
	}
}

class UninstallExtensionInProfileTask extends AbstractExtensionTask<void> implements IUninstallExtensionTask {

	constructor(
		readonly extension: ILocalExtension,
		readonly options: UninstallExtensionTaskOptions,
		private readonly extensionsProfileScannerService: IExtensionsProfileScannerService,
	) {
		super();
	}

	protected doRun(token: CancellationToken): Promise<void> {
		return this.extensionsProfileScannerService.removeExtensionsFromProfile([this.extension.identifier], this.options.profileLocation);
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/node/extensionManagementUtil.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/node/extensionManagementUtil.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { buffer, ExtractError } from '../../../base/node/zip.js';
import { localize } from '../../../nls.js';
import { toExtensionManagementError } from '../common/abstractExtensionManagementService.js';
import { ExtensionManagementError, ExtensionManagementErrorCode } from '../common/extensionManagement.js';
import { IExtensionManifest } from '../../extensions/common/extensions.js';

export function fromExtractError(e: Error): ExtensionManagementError {
	let errorCode = ExtensionManagementErrorCode.Extract;
	if (e instanceof ExtractError) {
		if (e.type === 'CorruptZip') {
			errorCode = ExtensionManagementErrorCode.CorruptZip;
		} else if (e.type === 'Incomplete') {
			errorCode = ExtensionManagementErrorCode.IncompleteZip;
		}
	}
	return toExtensionManagementError(e, errorCode);
}

export async function getManifest(vsixPath: string): Promise<IExtensionManifest> {
	let data;
	try {
		data = await buffer(vsixPath, 'extension/package.json');
	} catch (e) {
		throw fromExtractError(e);
	}

	try {
		return JSON.parse(data.toString('utf8'));
	} catch (err) {
		throw new ExtensionManagementError(localize('invalidManifest', "VSIX invalid: package.json is not a JSON file."), ExtensionManagementErrorCode.Invalid);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/node/extensionSignatureVerificationService.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/node/extensionSignatureVerificationService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getErrorMessage } from '../../../base/common/errors.js';
import { isDefined } from '../../../base/common/types.js';
import { TargetPlatform } from '../../extensions/common/extensions.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ILogService, LogLevel } from '../../log/common/log.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { ExtensionSignatureVerificationCode } from '../common/extensionManagement.js';

export const IExtensionSignatureVerificationService = createDecorator<IExtensionSignatureVerificationService>('IExtensionSignatureVerificationService');

export interface IExtensionSignatureVerificationResult {
	readonly code: ExtensionSignatureVerificationCode;
}

/**
 * A service for verifying signed extensions.
 */
export interface IExtensionSignatureVerificationService {
	readonly _serviceBrand: undefined;

	/**
	 * Verifies an extension file (.vsix) against a signature archive file.
	 * @param extensionId The extension identifier.
	 * @param version The extension version.
	 * @param vsixFilePath The extension file path.
	 * @param signatureArchiveFilePath The signature archive file path.
	 * @returns returns the verification result or undefined if the verification was not executed.
	 */
	verify(extensionId: string, version: string, vsixFilePath: string, signatureArchiveFilePath: string, clientTargetPlatform?: TargetPlatform): Promise<IExtensionSignatureVerificationResult | undefined>;
}

declare namespace vsceSign {
	export function verify(vsixFilePath: string, signatureArchiveFilePath: string, verbose: boolean): Promise<ExtensionSignatureVerificationResult>;
}

/**
 * Extension signature verification result
 */
export interface ExtensionSignatureVerificationResult {
	readonly code: ExtensionSignatureVerificationCode;
	readonly didExecute: boolean;
	readonly internalCode?: number;
	readonly output?: string;
}

export class ExtensionSignatureVerificationService implements IExtensionSignatureVerificationService {
	declare readonly _serviceBrand: undefined;

	private moduleLoadingPromise: Promise<typeof vsceSign> | undefined;

	constructor(
		@ILogService private readonly logService: ILogService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
	) { }

	private vsceSign(): Promise<typeof vsceSign> {
		if (!this.moduleLoadingPromise) {
			this.moduleLoadingPromise = this.resolveVsceSign();
		}

		return this.moduleLoadingPromise;
	}

	private async resolveVsceSign(): Promise<typeof vsceSign> {
		const mod = '@vscode/vsce-sign';
		return import(mod);
	}

	public async verify(extensionId: string, version: string, vsixFilePath: string, signatureArchiveFilePath: string, clientTargetPlatform?: TargetPlatform): Promise<IExtensionSignatureVerificationResult | undefined> {
		let module: typeof vsceSign;

		try {
			module = await this.vsceSign();
		} catch (error) {
			this.logService.error('Could not load vsce-sign module', getErrorMessage(error));
			this.logService.info(`Extension signature verification is not done: ${extensionId}`);
			return undefined;
		}

		const startTime = new Date().getTime();
		let result: ExtensionSignatureVerificationResult;

		try {
			this.logService.trace(`Verifying extension signature for ${extensionId}...`);
			result = await module.verify(vsixFilePath, signatureArchiveFilePath, this.logService.getLevel() === LogLevel.Trace);
		} catch (e) {
			result = {
				code: ExtensionSignatureVerificationCode.UnknownError,
				didExecute: false,
				output: getErrorMessage(e)
			};
		}

		const duration = new Date().getTime() - startTime;

		this.logService.info(`Extension signature verification result for ${extensionId}: ${result.code}. ${isDefined(result.internalCode) ? `Internal Code: ${result.internalCode}. ` : ''}Executed: ${result.didExecute}. Duration: ${duration}ms.`);
		this.logService.trace(`Extension signature verification output for ${extensionId}:\n${result.output}`);

		type ExtensionSignatureVerificationClassification = {
			owner: 'sandy081';
			comment: 'Extension signature verification event';
			extensionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'extension identifier' };
			extensionVersion: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'extension version' };
			code: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'result code of the verification' };
			internalCode?: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; 'isMeasurement': true; comment: 'internal code of the verification' };
			duration: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; 'isMeasurement': true; comment: 'amount of time taken to verify the signature' };
			didExecute: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'whether the verification was executed' };
			clientTargetPlatform?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'target platform of the client' };
		};
		type ExtensionSignatureVerificationEvent = {
			extensionId: string;
			extensionVersion: string;
			code: string;
			internalCode?: number;
			duration: number;
			didExecute: boolean;
			clientTargetPlatform?: string;
		};
		this.telemetryService.publicLog2<ExtensionSignatureVerificationEvent, ExtensionSignatureVerificationClassification>('extensionsignature:verification', {
			extensionId,
			extensionVersion: version,
			code: result.code,
			internalCode: result.internalCode,
			duration,
			didExecute: result.didExecute,
			clientTargetPlatform,
		});

		return { code: result.code };
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/node/extensionsManifestCache.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/node/extensionsManifestCache.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { DidUninstallExtensionEvent, IExtensionManagementService, InstallExtensionResult } from '../common/extensionManagement.js';
import { USER_MANIFEST_CACHE_FILE } from '../../extensions/common/extensions.js';
import { FileOperationResult, IFileService, toFileOperationResult } from '../../files/common/files.js';
import { ILogService } from '../../log/common/log.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';

export class ExtensionsManifestCache extends Disposable {

	constructor(
		private readonly userDataProfilesService: IUserDataProfilesService,
		private readonly fileService: IFileService,
		private readonly uriIdentityService: IUriIdentityService,
		extensionsManagementService: IExtensionManagementService,
		private readonly logService: ILogService,
	) {
		super();
		this._register(extensionsManagementService.onDidInstallExtensions(e => this.onDidInstallExtensions(e)));
		this._register(extensionsManagementService.onDidUninstallExtension(e => this.onDidUnInstallExtension(e)));
	}

	private onDidInstallExtensions(results: readonly InstallExtensionResult[]): void {
		for (const r of results) {
			if (r.local) {
				this.invalidate(r.profileLocation);
			}
		}
	}

	private onDidUnInstallExtension(e: DidUninstallExtensionEvent): void {
		if (!e.error) {
			this.invalidate(e.profileLocation);
		}
	}

	async invalidate(extensionsManifestLocation: URI | undefined): Promise<void> {
		if (extensionsManifestLocation) {
			for (const profile of this.userDataProfilesService.profiles) {
				if (this.uriIdentityService.extUri.isEqual(profile.extensionsResource, extensionsManifestLocation)) {
					await this.deleteUserCacheFile(profile);
				}
			}
		} else {
			await this.deleteUserCacheFile(this.userDataProfilesService.defaultProfile);
		}
	}

	private async deleteUserCacheFile(profile: IUserDataProfile): Promise<void> {
		try {
			await this.fileService.del(this.uriIdentityService.extUri.joinPath(profile.cacheHome, USER_MANIFEST_CACHE_FILE));
		} catch (error) {
			if (toFileOperationResult(error) !== FileOperationResult.FILE_NOT_FOUND) {
				this.logService.error(error);
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/node/extensionsProfileScannerService.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/node/extensionsProfileScannerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILogService } from '../../log/common/log.js';
import { IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { AbstractExtensionsProfileScannerService } from '../common/extensionsProfileScannerService.js';
import { IFileService } from '../../files/common/files.js';
import { INativeEnvironmentService } from '../../environment/common/environment.js';
import { URI } from '../../../base/common/uri.js';

export class ExtensionsProfileScannerService extends AbstractExtensionsProfileScannerService {
	constructor(
		@INativeEnvironmentService environmentService: INativeEnvironmentService,
		@IFileService fileService: IFileService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@ILogService logService: ILogService,
	) {
		super(URI.file(environmentService.extensionsPath), fileService, userDataProfilesService, uriIdentityService, logService);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/node/extensionsScannerService.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/node/extensionsScannerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';
import { INativeEnvironmentService } from '../../environment/common/environment.js';
import { IExtensionsProfileScannerService } from '../common/extensionsProfileScannerService.js';
import { IExtensionsScannerService, NativeExtensionsScannerService, } from '../common/extensionsScannerService.js';
import { IFileService } from '../../files/common/files.js';
import { IInstantiationService } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';
import { IProductService } from '../../product/common/productService.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';

export class ExtensionsScannerService extends NativeExtensionsScannerService implements IExtensionsScannerService {

	constructor(
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IExtensionsProfileScannerService extensionsProfileScannerService: IExtensionsProfileScannerService,
		@IFileService fileService: IFileService,
		@ILogService logService: ILogService,
		@INativeEnvironmentService environmentService: INativeEnvironmentService,
		@IProductService productService: IProductService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super(
			URI.file(environmentService.builtinExtensionsPath),
			URI.file(environmentService.extensionsPath),
			environmentService.userHome,
			userDataProfilesService.defaultProfile,
			userDataProfilesService, extensionsProfileScannerService, fileService, logService, environmentService, productService, uriIdentityService, instantiationService);
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/node/extensionsWatcher.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/node/extensionsWatcher.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getErrorMessage } from '../../../base/common/errors.js';
import { Emitter } from '../../../base/common/event.js';
import { combinedDisposable, Disposable, DisposableMap } from '../../../base/common/lifecycle.js';
import { ResourceSet } from '../../../base/common/map.js';
import { URI } from '../../../base/common/uri.js';
import { getIdAndVersion } from '../common/extensionManagementUtil.js';
import { DidAddProfileExtensionsEvent, DidRemoveProfileExtensionsEvent, IExtensionsProfileScannerService, ProfileExtensionsEvent } from '../common/extensionsProfileScannerService.js';
import { IExtensionsScannerService } from '../common/extensionsScannerService.js';
import { INativeServerExtensionManagementService } from './extensionManagementService.js';
import { ExtensionIdentifier, IExtension, IExtensionIdentifier } from '../../extensions/common/extensions.js';
import { FileChangesEvent, FileChangeType, IFileService } from '../../files/common/files.js';
import { ILogService } from '../../log/common/log.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';

export interface DidChangeProfileExtensionsEvent {
	readonly added?: { readonly extensions: readonly IExtensionIdentifier[]; readonly profileLocation: URI };
	readonly removed?: { readonly extensions: readonly IExtensionIdentifier[]; readonly profileLocation: URI };
}

export class ExtensionsWatcher extends Disposable {

	private readonly _onDidChangeExtensionsByAnotherSource = this._register(new Emitter<DidChangeProfileExtensionsEvent>());
	readonly onDidChangeExtensionsByAnotherSource = this._onDidChangeExtensionsByAnotherSource.event;

	private readonly allExtensions = new Map<string, ResourceSet>;
	private readonly extensionsProfileWatchDisposables = this._register(new DisposableMap<string>());

	constructor(
		private readonly extensionManagementService: INativeServerExtensionManagementService,
		private readonly extensionsScannerService: IExtensionsScannerService,
		private readonly userDataProfilesService: IUserDataProfilesService,
		private readonly extensionsProfileScannerService: IExtensionsProfileScannerService,
		private readonly uriIdentityService: IUriIdentityService,
		private readonly fileService: IFileService,
		private readonly logService: ILogService,
	) {
		super();
		this.initialize().then(null, error => logService.error('Error while initializing Extensions Watcher', getErrorMessage(error)));
	}

	private async initialize(): Promise<void> {
		await this.extensionsScannerService.initializeDefaultProfileExtensions();
		await this.onDidChangeProfiles(this.userDataProfilesService.profiles);
		this.registerListeners();
		await this.deleteExtensionsNotInProfiles();
	}

	private registerListeners(): void {
		this._register(this.userDataProfilesService.onDidChangeProfiles(e => this.onDidChangeProfiles(e.added)));
		this._register(this.extensionsProfileScannerService.onAddExtensions(e => this.onAddExtensions(e)));
		this._register(this.extensionsProfileScannerService.onDidAddExtensions(e => this.onDidAddExtensions(e)));
		this._register(this.extensionsProfileScannerService.onRemoveExtensions(e => this.onRemoveExtensions(e)));
		this._register(this.extensionsProfileScannerService.onDidRemoveExtensions(e => this.onDidRemoveExtensions(e)));
		this._register(this.fileService.onDidFilesChange(e => this.onDidFilesChange(e)));
	}

	private async onDidChangeProfiles(added: readonly IUserDataProfile[]): Promise<void> {
		try {
			if (added.length) {
				await Promise.all(added.map(profile => {
					this.extensionsProfileWatchDisposables.set(profile.id, combinedDisposable(
						this.fileService.watch(this.uriIdentityService.extUri.dirname(profile.extensionsResource)),
						// Also listen to the resource incase the resource is a symlink - https://github.com/microsoft/vscode/issues/118134
						this.fileService.watch(profile.extensionsResource)
					));
					return this.populateExtensionsFromProfile(profile.extensionsResource);
				}));
			}
		} catch (error) {
			this.logService.error(error);
			throw error;
		}
	}

	private async onAddExtensions(e: ProfileExtensionsEvent): Promise<void> {
		for (const extension of e.extensions) {
			this.addExtensionWithKey(this.getKey(extension.identifier, extension.version), e.profileLocation);
		}
	}

	private async onDidAddExtensions(e: DidAddProfileExtensionsEvent): Promise<void> {
		for (const extension of e.extensions) {
			const key = this.getKey(extension.identifier, extension.version);
			if (e.error) {
				this.removeExtensionWithKey(key, e.profileLocation);
			} else {
				this.addExtensionWithKey(key, e.profileLocation);
			}
		}
	}

	private async onRemoveExtensions(e: ProfileExtensionsEvent): Promise<void> {
		for (const extension of e.extensions) {
			this.removeExtensionWithKey(this.getKey(extension.identifier, extension.version), e.profileLocation);
		}
	}

	private async onDidRemoveExtensions(e: DidRemoveProfileExtensionsEvent): Promise<void> {
		const extensionsToDelete: IExtension[] = [];
		const promises: Promise<void>[] = [];
		for (const extension of e.extensions) {
			const key = this.getKey(extension.identifier, extension.version);
			if (e.error) {
				this.addExtensionWithKey(key, e.profileLocation);
			} else {
				this.removeExtensionWithKey(key, e.profileLocation);
				if (!this.allExtensions.has(key)) {
					this.logService.debug('Extension is removed from all profiles', extension.identifier.id, extension.version);
					promises.push(this.extensionManagementService.scanInstalledExtensionAtLocation(extension.location)
						.then(result => {
							if (result) {
								extensionsToDelete.push(result);
							} else {
								this.logService.info('Extension not found at the location', extension.location.toString());
							}
						}, error => this.logService.error(error)));
				}
			}
		}
		try {
			await Promise.all(promises);
			if (extensionsToDelete.length) {
				await this.deleteExtensionsNotInProfiles(extensionsToDelete);
			}
		} catch (error) {
			this.logService.error(error);
		}
	}

	private onDidFilesChange(e: FileChangesEvent): void {
		for (const profile of this.userDataProfilesService.profiles) {
			if (e.contains(profile.extensionsResource, FileChangeType.UPDATED, FileChangeType.ADDED)) {
				this.onDidExtensionsProfileChange(profile.extensionsResource);
			}
		}
	}

	private async onDidExtensionsProfileChange(profileLocation: URI): Promise<void> {
		const added: IExtensionIdentifier[] = [], removed: IExtensionIdentifier[] = [];
		const extensions = await this.extensionsProfileScannerService.scanProfileExtensions(profileLocation);
		const extensionKeys = new Set<string>();
		const cached = new Set<string>();
		for (const [key, profiles] of this.allExtensions) {
			if (profiles.has(profileLocation)) {
				cached.add(key);
			}
		}
		for (const extension of extensions) {
			const key = this.getKey(extension.identifier, extension.version);
			extensionKeys.add(key);
			if (!cached.has(key)) {
				added.push(extension.identifier);
				this.addExtensionWithKey(key, profileLocation);
			}
		}
		for (const key of cached) {
			if (!extensionKeys.has(key)) {
				const extension = this.fromKey(key);
				if (extension) {
					removed.push(extension.identifier);
					this.removeExtensionWithKey(key, profileLocation);
				}
			}
		}
		if (added.length || removed.length) {
			this._onDidChangeExtensionsByAnotherSource.fire({ added: added.length ? { extensions: added, profileLocation } : undefined, removed: removed.length ? { extensions: removed, profileLocation } : undefined });
		}
	}

	private async populateExtensionsFromProfile(extensionsProfileLocation: URI): Promise<void> {
		const extensions = await this.extensionsProfileScannerService.scanProfileExtensions(extensionsProfileLocation);
		for (const extension of extensions) {
			this.addExtensionWithKey(this.getKey(extension.identifier, extension.version), extensionsProfileLocation);
		}
	}

	private async deleteExtensionsNotInProfiles(toDelete?: IExtension[]): Promise<void> {
		if (!toDelete) {
			const installed = await this.extensionManagementService.scanAllUserInstalledExtensions();
			toDelete = installed.filter(installedExtension => !this.allExtensions.has(this.getKey(installedExtension.identifier, installedExtension.manifest.version)));
		}
		if (toDelete.length) {
			await this.extensionManagementService.deleteExtensions(...toDelete);
		}
	}

	private addExtensionWithKey(key: string, extensionsProfileLocation: URI): void {
		let profiles = this.allExtensions.get(key);
		if (!profiles) {
			this.allExtensions.set(key, profiles = new ResourceSet((uri) => this.uriIdentityService.extUri.getComparisonKey(uri)));
		}
		profiles.add(extensionsProfileLocation);
	}

	private removeExtensionWithKey(key: string, profileLocation: URI): void {
		const profiles = this.allExtensions.get(key);
		if (profiles) {
			profiles.delete(profileLocation);
		}
		if (!profiles?.size) {
			this.allExtensions.delete(key);
		}
	}

	private getKey(identifier: IExtensionIdentifier, version: string): string {
		return `${ExtensionIdentifier.toKey(identifier.id)}@${version}`;
	}

	private fromKey(key: string): { identifier: IExtensionIdentifier; version: string } | undefined {
		const [id, version] = getIdAndVersion(key);
		return version ? { identifier: { id }, version } : undefined;
	}

}
```

--------------------------------------------------------------------------------

````

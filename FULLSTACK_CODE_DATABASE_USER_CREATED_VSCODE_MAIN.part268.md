---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 268
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 268 of 552)

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

---[FILE: src/vs/platform/extensionManagement/common/extensionGalleryService.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/common/extensionGalleryService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { distinct } from '../../../base/common/arrays.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import * as semver from '../../../base/common/semver/semver.js';
import { IStringDictionary } from '../../../base/common/collections.js';
import { CancellationError, getErrorMessage, isCancellationError } from '../../../base/common/errors.js';
import { IPager } from '../../../base/common/paging.js';
import { isWeb, platform } from '../../../base/common/platform.js';
import { arch } from '../../../base/common/process.js';
import { isBoolean, isNumber, isString } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { IHeaders, IRequestContext, IRequestOptions, isOfflineError } from '../../../base/parts/request/common/request.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { getTargetPlatform, IExtensionGalleryService, IExtensionIdentifier, IExtensionInfo, IGalleryExtension, IGalleryExtensionAsset, IGalleryExtensionAssets, IGalleryExtensionVersion, InstallOperation, IQueryOptions, IExtensionsControlManifest, isNotWebExtensionInWebTargetPlatform, isTargetPlatformCompatible, ITranslation, SortOrder, StatisticType, toTargetPlatform, WEB_EXTENSION_TAG, IExtensionQueryOptions, IDeprecationInfo, ISearchPrefferedResults, ExtensionGalleryError, ExtensionGalleryErrorCode, IProductVersion, IAllowedExtensionsService, EXTENSION_IDENTIFIER_REGEX, SortBy, FilterType, MaliciousExtensionInfo, ExtensionRequestsTimeoutConfigKey } from './extensionManagement.js';
import { adoptToGalleryExtensionId, areSameExtensions, getGalleryExtensionId, getGalleryExtensionTelemetryData } from './extensionManagementUtil.js';
import { IExtensionManifest, TargetPlatform } from '../../extensions/common/extensions.js';
import { areApiProposalsCompatible, isEngineValid } from '../../extensions/common/extensionValidator.js';
import { IFileService } from '../../files/common/files.js';
import { ILogService } from '../../log/common/log.js';
import { IProductService } from '../../product/common/productService.js';
import { asJson, asTextOrError, IRequestService, isClientError, isServerError, isSuccess } from '../../request/common/request.js';
import { resolveMarketplaceHeaders } from '../../externalServices/common/marketplace.js';
import { IStorageService } from '../../storage/common/storage.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { StopWatch } from '../../../base/common/stopwatch.js';
import { format2 } from '../../../base/common/strings.js';
import { ExtensionGalleryResourceType, Flag, getExtensionGalleryManifestResourceUri, IExtensionGalleryManifest, IExtensionGalleryManifestService, ExtensionGalleryManifestStatus } from './extensionGalleryManifest.js';
import { TelemetryTrustedValue } from '../../telemetry/common/telemetryUtils.js';

const CURRENT_TARGET_PLATFORM = isWeb ? TargetPlatform.WEB : getTargetPlatform(platform, arch);
const SEARCH_ACTIVITY_HEADER_NAME = 'X-Market-Search-Activity-Id';
const ACTIVITY_HEADER_NAME = 'Activityid';
const SERVER_HEADER_NAME = 'Server';
const END_END_ID_HEADER_NAME = 'X-Vss-E2eid';

interface IRawGalleryExtensionFile {
	readonly assetType: string;
	readonly source: string;
}

interface IRawGalleryExtensionProperty {
	readonly key: string;
	readonly value: string;
}

export interface IRawGalleryExtensionVersion {
	readonly version: string;
	readonly lastUpdated: string;
	readonly assetUri: string;
	readonly fallbackAssetUri: string;
	readonly files: IRawGalleryExtensionFile[];
	readonly properties?: IRawGalleryExtensionProperty[];
	readonly targetPlatform?: string;
}

interface IRawGalleryExtensionStatistics {
	readonly statisticName: string;
	readonly value: number;
}

interface IRawGalleryExtensionPublisher {
	readonly displayName: string;
	readonly publisherId: string;
	readonly publisherName: string;
	readonly domain?: string | null;
	readonly isDomainVerified?: boolean;
	readonly linkType?: string;
}

interface IRawGalleryExtension {
	readonly extensionId: string;
	readonly extensionName: string;
	readonly displayName: string;
	readonly shortDescription?: string;
	readonly publisher: IRawGalleryExtensionPublisher;
	readonly versions: IRawGalleryExtensionVersion[];
	readonly statistics: IRawGalleryExtensionStatistics[];
	readonly tags: string[] | undefined;
	readonly releaseDate: string;
	readonly publishedDate: string;
	readonly lastUpdated: string;
	readonly categories: string[] | undefined;
	readonly flags: string;
	readonly linkType?: string;
	readonly ratingLinkType?: string;
}

interface IRawGalleryExtensionsResult {
	readonly galleryExtensions: IRawGalleryExtension[];
	readonly total: number;
	readonly context?: IStringDictionary<string>;
}

interface IRawGalleryQueryResult {
	readonly results: {
		readonly extensions: IRawGalleryExtension[];
		readonly resultMetadata: {
			readonly metadataType: string;
			readonly metadataItems: {
				readonly name: string;
				readonly count: number;
			}[];
		}[];
	}[];
}

const AssetType = {
	Icon: 'Microsoft.VisualStudio.Services.Icons.Default',
	Details: 'Microsoft.VisualStudio.Services.Content.Details',
	Changelog: 'Microsoft.VisualStudio.Services.Content.Changelog',
	Manifest: 'Microsoft.VisualStudio.Code.Manifest',
	VSIX: 'Microsoft.VisualStudio.Services.VSIXPackage',
	License: 'Microsoft.VisualStudio.Services.Content.License',
	Repository: 'Microsoft.VisualStudio.Services.Links.Source',
	Signature: 'Microsoft.VisualStudio.Services.VsixSignature'
};

const PropertyType = {
	Dependency: 'Microsoft.VisualStudio.Code.ExtensionDependencies',
	ExtensionPack: 'Microsoft.VisualStudio.Code.ExtensionPack',
	Engine: 'Microsoft.VisualStudio.Code.Engine',
	PreRelease: 'Microsoft.VisualStudio.Code.PreRelease',
	EnabledApiProposals: 'Microsoft.VisualStudio.Code.EnabledApiProposals',
	LocalizedLanguages: 'Microsoft.VisualStudio.Code.LocalizedLanguages',
	WebExtension: 'Microsoft.VisualStudio.Code.WebExtension',
	SponsorLink: 'Microsoft.VisualStudio.Code.SponsorLink',
	SupportLink: 'Microsoft.VisualStudio.Services.Links.Support',
	ExecutesCode: 'Microsoft.VisualStudio.Code.ExecutesCode',
	Private: 'PrivateMarketplace',
};

interface ICriterium {
	readonly filterType: FilterType;
	readonly value?: string;
}

const DefaultPageSize = 10;

interface IQueryState {
	readonly pageNumber: number;
	readonly pageSize: number;
	readonly sortBy: SortBy;
	readonly sortOrder: SortOrder;
	readonly flags: Flag[];
	readonly criteria: ICriterium[];
	readonly assetTypes: string[];
	readonly source?: string;
}

const DefaultQueryState: IQueryState = {
	pageNumber: 1,
	pageSize: DefaultPageSize,
	sortBy: SortBy.NoneOrRelevance,
	sortOrder: SortOrder.Default,
	flags: [],
	criteria: [],
	assetTypes: []
};

type GalleryServiceQueryClassification = {
	owner: 'sandy081';
	comment: 'Information about Marketplace query and its response';
	readonly filterTypes: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Filter types used in the query.' };
	readonly flags: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Flags passed in the query.' };
	readonly sortBy: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'sorted by option passed in the query' };
	readonly sortOrder: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'sort order option passed in the query' };
	readonly pageNumber: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'requested page number in the query' };
	readonly duration: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; 'isMeasurement': true; comment: 'amount of time taken by the query request' };
	readonly success: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'whether the query request is success or not' };
	readonly requestBodySize: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'size of the request body' };
	readonly responseBodySize?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'size of the response body' };
	readonly statusCode?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'status code of the response' };
	readonly errorCode?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'error code of the response' };
	readonly count?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'total number of extensions matching the query' };
	readonly source?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'source that requested this query, eg., recommendations, viewlet' };
	readonly searchTextLength?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'length of the search text in the query' };
	readonly server?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'server that handled the query' };
	readonly endToEndId?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'end to end operation id' };
	readonly activityId?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'activity id' };
};

type QueryTelemetryData = {
	readonly filterTypes: string[];
	readonly flags: string[];
	readonly sortBy: string;
	readonly sortOrder: string;
	readonly pageNumber: string;
	readonly source?: string;
	readonly searchTextLength?: number;
};

type GalleryServiceQueryEvent = QueryTelemetryData & {
	readonly duration: number;
	readonly success: boolean;
	readonly requestBodySize: string;
	readonly responseBodySize?: string;
	readonly statusCode?: string;
	readonly errorCode?: string;
	readonly count?: string;
	readonly server?: TelemetryTrustedValue<string>;
	readonly endToEndId?: TelemetryTrustedValue<string>;
	readonly activityId?: TelemetryTrustedValue<string>;
};

type GalleryServiceAdditionalQueryClassification = {
	owner: 'sandy081';
	comment: 'Response information about the additional query to the Marketplace for fetching all versions to get release version';
	readonly duration: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; 'isMeasurement': true; comment: 'Amount of time taken by the additional query' };
	readonly count: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Total number of extensions returned by this additional query' };
};

type GalleryServiceAdditionalQueryEvent = {
	readonly duration: number;
	readonly count: number;
};

type ExtensionsCriteria = {
	readonly productVersion: IProductVersion;
	readonly targetPlatform: TargetPlatform;
	readonly compatible: boolean;
	readonly includePreRelease: boolean | (IExtensionIdentifier & { includePreRelease: boolean })[];
	readonly versions?: (IExtensionIdentifier & { version: string })[];
	readonly isQueryForReleaseVersionFromPreReleaseVersion?: boolean;
};

const enum VersionKind {
	Release,
	Prerelease,
	Latest
}

type ExtensionVersionCriteria = {
	readonly productVersion: IProductVersion;
	readonly targetPlatform: TargetPlatform;
	readonly compatible: boolean;
	readonly version: VersionKind | string;
};

class Query {

	constructor(private state = DefaultQueryState) { }

	get pageNumber(): number { return this.state.pageNumber; }
	get pageSize(): number { return this.state.pageSize; }
	get sortBy(): SortBy { return this.state.sortBy; }
	get sortOrder(): number { return this.state.sortOrder; }
	get flags(): Flag[] { return this.state.flags; }
	get criteria(): ICriterium[] { return this.state.criteria; }
	get assetTypes(): string[] { return this.state.assetTypes; }
	get source(): string | undefined { return this.state.source; }
	get searchText(): string {
		const criterium = this.state.criteria.filter(criterium => criterium.filterType === FilterType.SearchText)[0];
		return criterium && criterium.value ? criterium.value : '';
	}


	withPage(pageNumber: number, pageSize: number = this.state.pageSize): Query {
		return new Query({ ...this.state, pageNumber, pageSize });
	}

	withFilter(filterType: FilterType, ...values: string[]): Query {
		const criteria = [
			...this.state.criteria,
			...values.length ? values.map(value => ({ filterType, value })) : [{ filterType }]
		];

		return new Query({ ...this.state, criteria });
	}

	withSortBy(sortBy: SortBy): Query {
		return new Query({ ...this.state, sortBy });
	}

	withSortOrder(sortOrder: SortOrder): Query {
		return new Query({ ...this.state, sortOrder });
	}

	withFlags(...flags: Flag[]): Query {
		return new Query({ ...this.state, flags: distinct(flags) });
	}

	withAssetTypes(...assetTypes: string[]): Query {
		return new Query({ ...this.state, assetTypes });
	}

	withSource(source: string): Query {
		return new Query({ ...this.state, source });
	}
}

function getStatistic(statistics: IRawGalleryExtensionStatistics[], name: string): number {
	const result = (statistics || []).filter(s => s.statisticName === name)[0];
	return result ? result.value : 0;
}

function getCoreTranslationAssets(version: IRawGalleryExtensionVersion): [string, IGalleryExtensionAsset][] {
	const coreTranslationAssetPrefix = 'Microsoft.VisualStudio.Code.Translation.';
	const result = version.files.filter(f => f.assetType.indexOf(coreTranslationAssetPrefix) === 0);
	return result.reduce<[string, IGalleryExtensionAsset][]>((result, file) => {
		const asset = getVersionAsset(version, file.assetType);
		if (asset) {
			result.push([file.assetType.substring(coreTranslationAssetPrefix.length), asset]);
		}
		return result;
	}, []);
}

function getRepositoryAsset(version: IRawGalleryExtensionVersion): IGalleryExtensionAsset | null {
	if (version.properties) {
		const results = version.properties.filter(p => p.key === AssetType.Repository);
		const gitRegExp = new RegExp('((git|ssh|http(s)?)|(git@[\\w.]+))(:(//)?)([\\w.@:/\\-~]+)(.git)(/)?');

		const uri = results.filter(r => gitRegExp.test(r.value))[0];
		return uri ? { uri: uri.value, fallbackUri: uri.value } : null;
	}
	return getVersionAsset(version, AssetType.Repository);
}

function getDownloadAsset(version: IRawGalleryExtensionVersion): IGalleryExtensionAsset {
	return {
		// always use fallbackAssetUri for download asset to hit the Marketplace API so that downloads are counted
		uri: `${version.fallbackAssetUri}/${AssetType.VSIX}?redirect=true${version.targetPlatform ? `&targetPlatform=${version.targetPlatform}` : ''}`,
		fallbackUri: `${version.fallbackAssetUri}/${AssetType.VSIX}${version.targetPlatform ? `?targetPlatform=${version.targetPlatform}` : ''}`
	};
}

function getVersionAsset(version: IRawGalleryExtensionVersion, type: string): IGalleryExtensionAsset | null {
	const result = version.files.filter(f => f.assetType === type)[0];
	return result ? {
		uri: `${version.assetUri}/${type}${version.targetPlatform ? `?targetPlatform=${version.targetPlatform}` : ''}`,
		fallbackUri: `${version.fallbackAssetUri}/${type}${version.targetPlatform ? `?targetPlatform=${version.targetPlatform}` : ''}`
	} : null;
}

function getExtensions(version: IRawGalleryExtensionVersion, property: string): string[] {
	const values = version.properties ? version.properties.filter(p => p.key === property) : [];
	const value = values.length > 0 && values[0].value;
	return value ? value.split(',').map(v => adoptToGalleryExtensionId(v)) : [];
}

function getEngine(version: IRawGalleryExtensionVersion): string {
	const values = version.properties ? version.properties.filter(p => p.key === PropertyType.Engine) : [];
	return (values.length > 0 && values[0].value) || '';
}

function isPreReleaseVersion(version: IRawGalleryExtensionVersion): boolean {
	const values = version.properties ? version.properties.filter(p => p.key === PropertyType.PreRelease) : [];
	return values.length > 0 && values[0].value === 'true';
}

function hasPreReleaseForExtension(id: string, productService: IProductService): boolean | undefined {
	return productService.extensionProperties?.[id.toLowerCase()]?.hasPrereleaseVersion;
}

function getExcludeVersionRangeForExtension(id: string, productService: IProductService): string | undefined {
	return productService.extensionProperties?.[id.toLowerCase()]?.excludeVersionRange;
}

function isPrivateExtension(version: IRawGalleryExtensionVersion): boolean {
	const values = version.properties ? version.properties.filter(p => p.key === PropertyType.Private) : [];
	return values.length > 0 && values[0].value === 'true';
}

function executesCode(version: IRawGalleryExtensionVersion): boolean | undefined {
	const values = version.properties ? version.properties.filter(p => p.key === PropertyType.ExecutesCode) : [];
	return values.length > 0 ? values[0].value === 'true' : undefined;
}

function getEnabledApiProposals(version: IRawGalleryExtensionVersion): string[] {
	const values = version.properties ? version.properties.filter(p => p.key === PropertyType.EnabledApiProposals) : [];
	const value = (values.length > 0 && values[0].value) || '';
	return value ? value.split(',') : [];
}

function getLocalizedLanguages(version: IRawGalleryExtensionVersion): string[] {
	const values = version.properties ? version.properties.filter(p => p.key === PropertyType.LocalizedLanguages) : [];
	const value = (values.length > 0 && values[0].value) || '';
	return value ? value.split(',') : [];
}

function getSponsorLink(version: IRawGalleryExtensionVersion): string | undefined {
	return version.properties?.find(p => p.key === PropertyType.SponsorLink)?.value;
}

function getSupportLink(version: IRawGalleryExtensionVersion): string | undefined {
	return version.properties?.find(p => p.key === PropertyType.SupportLink)?.value;
}

function getIsPreview(flags: string): boolean {
	return flags.indexOf('preview') !== -1;
}

function getTargetPlatformForExtensionVersion(version: IRawGalleryExtensionVersion): TargetPlatform {
	return version.targetPlatform ? toTargetPlatform(version.targetPlatform) : TargetPlatform.UNDEFINED;
}

function getAllTargetPlatforms(rawGalleryExtension: IRawGalleryExtension): TargetPlatform[] {
	const allTargetPlatforms = distinct(rawGalleryExtension.versions.map(getTargetPlatformForExtensionVersion));

	// Is a web extension only if it has WEB_EXTENSION_TAG
	const isWebExtension = !!rawGalleryExtension.tags?.includes(WEB_EXTENSION_TAG);

	// Include Web Target Platform only if it is a web extension
	const webTargetPlatformIndex = allTargetPlatforms.indexOf(TargetPlatform.WEB);
	if (isWebExtension) {
		if (webTargetPlatformIndex === -1) {
			// Web extension but does not has web target platform -> add it
			allTargetPlatforms.push(TargetPlatform.WEB);
		}
	} else {
		if (webTargetPlatformIndex !== -1) {
			// Not a web extension but has web target platform -> remove it
			allTargetPlatforms.splice(webTargetPlatformIndex, 1);
		}
	}

	return allTargetPlatforms;
}

export function sortExtensionVersions(versions: IRawGalleryExtensionVersion[], preferredTargetPlatform: TargetPlatform): IRawGalleryExtensionVersion[] {
	/* It is expected that versions from Marketplace are sorted by version. So we are just sorting by preferred targetPlatform */
	for (let index = 0; index < versions.length; index++) {
		const version = versions[index];
		if (version.version === versions[index - 1]?.version) {
			let insertionIndex = index;
			const versionTargetPlatform = getTargetPlatformForExtensionVersion(version);
			/* put it at the beginning */
			if (versionTargetPlatform === preferredTargetPlatform) {
				while (insertionIndex > 0 && versions[insertionIndex - 1].version === version.version) { insertionIndex--; }
			}
			if (insertionIndex !== index) {
				versions.splice(index, 1);
				versions.splice(insertionIndex, 0, version);
			}
		}
	}
	return versions;
}

export function filterLatestExtensionVersionsForTargetPlatform(versions: IRawGalleryExtensionVersion[], targetPlatform: TargetPlatform, allTargetPlatforms: TargetPlatform[]): IRawGalleryExtensionVersion[] {
	const latestVersions: IRawGalleryExtensionVersion[] = [];

	let preReleaseVersionIndex: number = -1;
	let releaseVersionIndex: number = -1;
	for (const version of versions) {
		const versionTargetPlatform = getTargetPlatformForExtensionVersion(version);
		const isCompatibleWithTargetPlatform = isTargetPlatformCompatible(versionTargetPlatform, allTargetPlatforms, targetPlatform);

		// Always include versions that are NOT compatible with the target platform
		if (!isCompatibleWithTargetPlatform) {
			latestVersions.push(version);
			continue;
		}

		// For compatible versions, only include the first (latest) of each type
		// Prefer specific target platform matches over undefined/universal platforms
		if (isPreReleaseVersion(version)) {
			if (preReleaseVersionIndex === -1) {
				preReleaseVersionIndex = latestVersions.length;
				latestVersions.push(version);
			} else if (versionTargetPlatform === targetPlatform) {
				latestVersions[preReleaseVersionIndex] = version;
			}
		} else {
			if (releaseVersionIndex === -1) {
				releaseVersionIndex = latestVersions.length;
				latestVersions.push(version);
			} else if (versionTargetPlatform === targetPlatform) {
				latestVersions[releaseVersionIndex] = version;
			}
		}
	}

	return latestVersions;
}

function setTelemetry(extension: IGalleryExtension, index: number, querySource?: string): void {
	/* __GDPR__FRAGMENT__
	"GalleryExtensionTelemetryData2" : {
		"index" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
		"querySource": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
		"queryActivityId": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	}
	*/
	extension.telemetryData = { index, querySource, queryActivityId: extension.queryContext?.[SEARCH_ACTIVITY_HEADER_NAME] };
}

function toExtension(galleryExtension: IRawGalleryExtension, version: IRawGalleryExtensionVersion, allTargetPlatforms: TargetPlatform[], extensionGalleryManifest: IExtensionGalleryManifest, productService: IProductService, queryContext?: IStringDictionary<unknown>): IGalleryExtension {
	const latestVersion = galleryExtension.versions[0];
	const assets: IGalleryExtensionAssets = {
		manifest: getVersionAsset(version, AssetType.Manifest),
		readme: getVersionAsset(version, AssetType.Details),
		changelog: getVersionAsset(version, AssetType.Changelog),
		license: getVersionAsset(version, AssetType.License),
		repository: getRepositoryAsset(version),
		download: getDownloadAsset(version),
		icon: getVersionAsset(version, AssetType.Icon),
		signature: getVersionAsset(version, AssetType.Signature),
		coreTranslations: getCoreTranslationAssets(version)
	};

	const detailsViewUri = getExtensionGalleryManifestResourceUri(extensionGalleryManifest, galleryExtension.linkType ?? ExtensionGalleryResourceType.ExtensionDetailsViewUri);
	const publisherViewUri = getExtensionGalleryManifestResourceUri(extensionGalleryManifest, galleryExtension.publisher.linkType ?? ExtensionGalleryResourceType.PublisherViewUri);
	const ratingViewUri = getExtensionGalleryManifestResourceUri(extensionGalleryManifest, galleryExtension.ratingLinkType ?? ExtensionGalleryResourceType.ExtensionRatingViewUri);
	const id = getGalleryExtensionId(galleryExtension.publisher.publisherName, galleryExtension.extensionName);

	return {
		type: 'gallery',
		identifier: {
			id,
			uuid: galleryExtension.extensionId
		},
		name: galleryExtension.extensionName,
		version: version.version,
		displayName: galleryExtension.displayName,
		publisherId: galleryExtension.publisher.publisherId,
		publisher: galleryExtension.publisher.publisherName,
		publisherDisplayName: galleryExtension.publisher.displayName,
		publisherDomain: galleryExtension.publisher.domain ? { link: galleryExtension.publisher.domain, verified: !!galleryExtension.publisher.isDomainVerified } : undefined,
		publisherSponsorLink: getSponsorLink(latestVersion),
		description: galleryExtension.shortDescription ?? '',
		installCount: getStatistic(galleryExtension.statistics, 'install'),
		rating: getStatistic(galleryExtension.statistics, 'averagerating'),
		ratingCount: getStatistic(galleryExtension.statistics, 'ratingcount'),
		categories: galleryExtension.categories || [],
		tags: galleryExtension.tags || [],
		releaseDate: Date.parse(galleryExtension.releaseDate),
		lastUpdated: Date.parse(galleryExtension.lastUpdated),
		allTargetPlatforms,
		assets,
		properties: {
			dependencies: getExtensions(version, PropertyType.Dependency),
			extensionPack: getExtensions(version, PropertyType.ExtensionPack),
			engine: getEngine(version),
			enabledApiProposals: getEnabledApiProposals(version),
			localizedLanguages: getLocalizedLanguages(version),
			targetPlatform: getTargetPlatformForExtensionVersion(version),
			isPreReleaseVersion: isPreReleaseVersion(version),
			executesCode: executesCode(version)
		},
		hasPreReleaseVersion: hasPreReleaseForExtension(id, productService) ?? isPreReleaseVersion(latestVersion),
		hasReleaseVersion: true,
		private: isPrivateExtension(latestVersion),
		preview: getIsPreview(galleryExtension.flags),
		isSigned: !!assets.signature,
		queryContext,
		supportLink: getSupportLink(latestVersion),
		detailsLink: detailsViewUri ? format2(detailsViewUri, { publisher: galleryExtension.publisher.publisherName, name: galleryExtension.extensionName }) : undefined,
		publisherLink: publisherViewUri ? format2(publisherViewUri, { publisher: galleryExtension.publisher.publisherName }) : undefined,
		ratingLink: ratingViewUri ? format2(ratingViewUri, { publisher: galleryExtension.publisher.publisherName, name: galleryExtension.extensionName }) : undefined,
	};
}

interface IRawExtensionsControlManifest {
	malicious: string[];
	learnMoreLinks?: IStringDictionary<string>;
	migrateToPreRelease?: IStringDictionary<{
		id: string;
		displayName: string;
		migrateStorage?: boolean;
		engine?: string;
	}>;
	deprecated?: IStringDictionary<boolean | {
		disallowInstall?: boolean;
		extension?: {
			id: string;
			displayName: string;
		};
		settings?: string[];
		additionalInfo?: string;
	}>;
	search?: ISearchPrefferedResults[];
	autoUpdate?: IStringDictionary<string>;
}

export abstract class AbstractExtensionGalleryService implements IExtensionGalleryService {

	declare readonly _serviceBrand: undefined;

	private readonly extensionsControlUrl: string | undefined;
	private readonly unpkgResourceApi: string | undefined;

	private readonly commonHeadersPromise: Promise<IHeaders>;
	private readonly extensionsEnabledWithApiProposalVersion: string[];

	constructor(
		storageService: IStorageService | undefined,
		@IRequestService private readonly requestService: IRequestService,
		@ILogService private readonly logService: ILogService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IFileService private readonly fileService: IFileService,
		@IProductService private readonly productService: IProductService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IAllowedExtensionsService private readonly allowedExtensionsService: IAllowedExtensionsService,
		@IExtensionGalleryManifestService private readonly extensionGalleryManifestService: IExtensionGalleryManifestService,
	) {
		this.extensionsControlUrl = productService.extensionsGallery?.controlUrl;
		this.unpkgResourceApi = productService.extensionsGallery?.extensionUrlTemplate;
		this.extensionsEnabledWithApiProposalVersion = productService.extensionsEnabledWithApiProposalVersion?.map(id => id.toLowerCase()) ?? [];
		this.commonHeadersPromise = resolveMarketplaceHeaders(
			productService.version,
			productService,
			this.environmentService,
			this.configurationService,
			this.fileService,
			storageService,
			this.telemetryService);
	}

	isEnabled(): boolean {
		return this.extensionGalleryManifestService.extensionGalleryManifestStatus === ExtensionGalleryManifestStatus.Available;
	}

	getExtensions(extensionInfos: ReadonlyArray<IExtensionInfo>, token: CancellationToken): Promise<IGalleryExtension[]>;
	getExtensions(extensionInfos: ReadonlyArray<IExtensionInfo>, options: IExtensionQueryOptions, token: CancellationToken): Promise<IGalleryExtension[]>;
	async getExtensions(extensionInfos: ReadonlyArray<IExtensionInfo>, arg1: CancellationToken | IExtensionQueryOptions, arg2?: CancellationToken): Promise<IGalleryExtension[]> {
		const extensionGalleryManifest = await this.extensionGalleryManifestService.getExtensionGalleryManifest();
		if (!extensionGalleryManifest) {
			throw new Error('No extension gallery service configured.');
		}

		const options = CancellationToken.isCancellationToken(arg1) ? {} : arg1 as IExtensionQueryOptions;
		const token = CancellationToken.isCancellationToken(arg1) ? arg1 : arg2 as CancellationToken;

		const resourceApi = this.getResourceApi(extensionGalleryManifest);
		const result = resourceApi
			? await this.getExtensionsUsingResourceApi(extensionInfos, options, resourceApi, extensionGalleryManifest, token)
			: await this.getExtensionsUsingQueryApi(extensionInfos, options, extensionGalleryManifest, token);

		const uuids = result.map(r => r.identifier.uuid);
		const extensionInfosByName: IExtensionInfo[] = [];
		for (const e of extensionInfos) {
			if (e.uuid && !uuids.includes(e.uuid)) {
				extensionInfosByName.push({ ...e, uuid: undefined });
			}
		}

		if (extensionInfosByName.length) {
			// report telemetry data for additional query
			this.telemetryService.publicLog2<
				{ count: number },
				{
					owner: 'sandy081';
					comment: 'Report the query to the Marketplace for fetching extensions by name';
					readonly count: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Number of extensions to fetch' };
				}>('galleryService:additionalQueryByName', {
					count: extensionInfosByName.length
				});

			const extensions = await this.getExtensionsUsingQueryApi(extensionInfosByName, options, extensionGalleryManifest, token);
			result.push(...extensions);
		}

		return result;
	}

	private getResourceApi(extensionGalleryManifest: IExtensionGalleryManifest): { uri: string; fallback?: string } | undefined {
		const latestVersionResource = getExtensionGalleryManifestResourceUri(extensionGalleryManifest, ExtensionGalleryResourceType.ExtensionLatestVersionUri);
		if (latestVersionResource) {
			return {
				uri: latestVersionResource,
				fallback: this.unpkgResourceApi
			};
		}
		return undefined;
	}

	private async getExtensionsUsingQueryApi(extensionInfos: ReadonlyArray<IExtensionInfo>, options: IExtensionQueryOptions, extensionGalleryManifest: IExtensionGalleryManifest, token: CancellationToken): Promise<IGalleryExtension[]> {
		const names: string[] = [],
			ids: string[] = [],
			includePreRelease: (IExtensionIdentifier & { includePreRelease: boolean })[] = [],
			versions: (IExtensionIdentifier & { version: string })[] = [];
		let isQueryForReleaseVersionFromPreReleaseVersion = true;

		for (const extensionInfo of extensionInfos) {
			if (extensionInfo.uuid) {
				ids.push(extensionInfo.uuid);
			} else {
				names.push(extensionInfo.id);
			}
			if (extensionInfo.version) {
				versions.push({ id: extensionInfo.id, uuid: extensionInfo.uuid, version: extensionInfo.version });
			} else {
				includePreRelease.push({ id: extensionInfo.id, uuid: extensionInfo.uuid, includePreRelease: !!extensionInfo.preRelease });
			}
			isQueryForReleaseVersionFromPreReleaseVersion = isQueryForReleaseVersionFromPreReleaseVersion && (!!extensionInfo.hasPreRelease && !extensionInfo.preRelease);
		}

		if (!ids.length && !names.length) {
			return [];
		}

		let query = new Query().withPage(1, extensionInfos.length);
		if (ids.length) {
			query = query.withFilter(FilterType.ExtensionId, ...ids);
		}
		if (names.length) {
			query = query.withFilter(FilterType.ExtensionName, ...names);
		}
		if (options.queryAllVersions) {
			query = query.withFlags(...query.flags, Flag.IncludeVersions);
		}
		if (options.source) {
			query = query.withSource(options.source);
		}

		const { extensions } = await this.queryGalleryExtensions(
			query,
			{
				targetPlatform: options.targetPlatform ?? CURRENT_TARGET_PLATFORM,
				includePreRelease,
				versions,
				compatible: !!options.compatible,
				productVersion: options.productVersion ?? { version: this.productService.version, date: this.productService.date },
				isQueryForReleaseVersionFromPreReleaseVersion
			},
			extensionGalleryManifest,
			token);

		if (options.source) {
			extensions.forEach((e, index) => setTelemetry(e, index, options.source));
		}

		return extensions;
	}

	private async getExtensionsUsingResourceApi(extensionInfos: ReadonlyArray<IExtensionInfo>, options: IExtensionQueryOptions, resourceApi: { uri: string; fallback?: string }, extensionGalleryManifest: IExtensionGalleryManifest, token: CancellationToken): Promise<IGalleryExtension[]> {

		const result: IGalleryExtension[] = [];
		const toQuery: IExtensionInfo[] = [];
		const toFetchLatest: IExtensionInfo[] = [];

		for (const extensionInfo of extensionInfos) {
			if (!EXTENSION_IDENTIFIER_REGEX.test(extensionInfo.id)) {
				continue;
			}
			if (extensionInfo.version) {
				toQuery.push(extensionInfo);
			} else {
				toFetchLatest.push(extensionInfo);
			}
		}

		await Promise.all(toFetchLatest.map(async extensionInfo => {
			let galleryExtension: IGalleryExtension | string;
			try {
				galleryExtension = await this.getLatestGalleryExtension(extensionInfo, options, resourceApi, extensionGalleryManifest, token);
				if (isString(galleryExtension)) {
					// fallback to query
					this.telemetryService.publicLog2<
						{
							extension: string;
							preRelease: boolean;
							compatible: boolean;
							errorCode: string;
						},
						{
							owner: 'sandy081';
							comment: 'Report the fallback to the Marketplace query for fetching extensions';
							extension: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Extension id' };
							preRelease: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Get pre-release version' };
							compatible: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Get compatible version' };
							errorCode: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Error code or reason' };
						}>('galleryService:fallbacktoquery', {
							extension: extensionInfo.id,
							preRelease: !!extensionInfo.preRelease,
							compatible: !!options.compatible,
							errorCode: galleryExtension
						});
					toQuery.push(extensionInfo);
				} else {
					result.push(galleryExtension);
				}
			} catch (error) {
				if (error instanceof ExtensionGalleryError) {
					switch (error.code) {
						case ExtensionGalleryErrorCode.Offline:
						case ExtensionGalleryErrorCode.Cancelled:
						case ExtensionGalleryErrorCode.Timeout:
							throw error;
					}
				}

				// fallback to query
				this.logService.error(`Error while getting the latest version for the extension ${extensionInfo.id}.`, getErrorMessage(error));
				this.telemetryService.publicLog2<
					{
						extension: string;
						preRelease: boolean;
						compatible: boolean;
						errorCode: string;
					},
					{
						owner: 'sandy081';
						comment: 'Report the fallback to the Marketplace query for fetching extensions';
						extension: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Extension id' };
						preRelease: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Get pre-release version' };
						compatible: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Get compatible version' };
						errorCode: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Error code' };
					}>('galleryService:fallbacktoquery', {
						extension: extensionInfo.id,
						preRelease: !!extensionInfo.preRelease,
						compatible: !!options.compatible,
						errorCode: error instanceof ExtensionGalleryError ? error.code : 'Unknown'
					});
				toQuery.push(extensionInfo);
			}

		}));

		if (toQuery.length) {
			const extensions = await this.getExtensionsUsingQueryApi(toQuery, options, extensionGalleryManifest, token);
			result.push(...extensions);
		}

		return result;
	}

	private async getLatestGalleryExtension(extensionInfo: IExtensionInfo, options: IExtensionQueryOptions, resourceApi: { uri: string; fallback?: string }, extensionGalleryManifest: IExtensionGalleryManifest, token: CancellationToken): Promise<IGalleryExtension | string> {
		const rawGalleryExtension = await this.getLatestRawGalleryExtensionWithFallback(extensionInfo, resourceApi, token);

		if (!rawGalleryExtension) {
			return 'NOT_FOUND';
		}

		const targetPlatform = options.targetPlatform ?? CURRENT_TARGET_PLATFORM;
		const allTargetPlatforms = getAllTargetPlatforms(rawGalleryExtension);
		const rawGalleryExtensionVersion = await this.getValidRawGalleryExtensionVersion(
			rawGalleryExtension,
			filterLatestExtensionVersionsForTargetPlatform(rawGalleryExtension.versions, targetPlatform, allTargetPlatforms),
			{
				targetPlatform,
				compatible: !!options.compatible,
				productVersion: options.productVersion ?? {
					version: this.productService.version,
					date: this.productService.date
				},
				version: extensionInfo.preRelease ? VersionKind.Latest : VersionKind.Release
			}, allTargetPlatforms);

		if (rawGalleryExtensionVersion) {
			return toExtension(rawGalleryExtension, rawGalleryExtensionVersion, allTargetPlatforms, extensionGalleryManifest, this.productService);
		}

		return 'NOT_COMPATIBLE';
	}

	async getCompatibleExtension(extension: IGalleryExtension, includePreRelease: boolean, targetPlatform: TargetPlatform, productVersion: IProductVersion = { version: this.productService.version, date: this.productService.date }): Promise<IGalleryExtension | null> {
		if (isNotWebExtensionInWebTargetPlatform(extension.allTargetPlatforms, targetPlatform)) {
			return null;
		}
		if (await this.isExtensionCompatible(extension, includePreRelease, targetPlatform)) {
			return extension;
		}
		if (this.allowedExtensionsService.isAllowed({ id: extension.identifier.id, publisherDisplayName: extension.publisherDisplayName }) !== true) {
			return null;
		}
		const result = await this.getExtensions([{
			...extension.identifier,
			preRelease: includePreRelease,
			hasPreRelease: extension.hasPreReleaseVersion,
		}], {
			compatible: true,
			productVersion,
			queryAllVersions: true,
			targetPlatform,
		}, CancellationToken.None);

		return result[0] ?? null;
	}

	async isExtensionCompatible(extension: IGalleryExtension, includePreRelease: boolean, targetPlatform: TargetPlatform, productVersion: IProductVersion = { version: this.productService.version, date: this.productService.date }): Promise<boolean> {
		return this.isValidVersion(
			{
				id: extension.identifier.id,
				version: extension.version,
				isPreReleaseVersion: extension.properties.isPreReleaseVersion,
				targetPlatform: extension.properties.targetPlatform,
				manifestAsset: extension.assets.manifest,
				engine: extension.properties.engine,
				enabledApiProposals: extension.properties.enabledApiProposals
			},
			{
				targetPlatform,
				compatible: true,
				productVersion,
				version: includePreRelease ? VersionKind.Latest : VersionKind.Release
			},
			extension.publisherDisplayName,
			extension.allTargetPlatforms
		);
	}

	private async isValidVersion(
		extension: { id: string; version: string; isPreReleaseVersion: boolean; targetPlatform: TargetPlatform; manifestAsset: IGalleryExtensionAsset | null; engine: string | undefined; enabledApiProposals: string[] | undefined },
		{ targetPlatform, compatible, productVersion, version }: Omit<ExtensionVersionCriteria, 'targetPlatform'> & { targetPlatform: TargetPlatform | undefined },
		publisherDisplayName: string,
		allTargetPlatforms: TargetPlatform[]
	): Promise<boolean> {

		const hasPreRelease = hasPreReleaseForExtension(extension.id, this.productService);
		const excludeVersionRange = getExcludeVersionRangeForExtension(extension.id, this.productService);

		if (extension.isPreReleaseVersion && hasPreRelease === false /* Skip if hasPreRelease is not defined for this extension */) {
			return false;
		}

		if (excludeVersionRange && semver.satisfies(extension.version, excludeVersionRange)) {
			return false;
		}

		// Specific version
		if (isString(version)) {
			if (extension.version !== version) {
				return false;
			}
		}

		// Prerelease or release version kind
		else if (version === VersionKind.Release || version === VersionKind.Prerelease) {
			if (extension.isPreReleaseVersion !== (version === VersionKind.Prerelease)) {
				return false;
			}
		}

		if (targetPlatform && !isTargetPlatformCompatible(extension.targetPlatform, allTargetPlatforms, targetPlatform)) {
			return false;
		}

		if (compatible) {
			if (this.allowedExtensionsService.isAllowed({ id: extension.id, publisherDisplayName, version: extension.version, prerelease: extension.isPreReleaseVersion, targetPlatform: extension.targetPlatform }) !== true) {
				return false;
			}

			if (!this.areApiProposalsCompatible(extension.id, extension.enabledApiProposals)) {
				return false;
			}

			if (!(await this.isEngineValid(extension.id, extension.version, extension.engine, extension.manifestAsset, productVersion))) {
				return false;
			}
		}

		return true;
	}

	private areApiProposalsCompatible(extensionId: string, enabledApiProposals: string[] | undefined): boolean {
		if (!enabledApiProposals) {
			return true;
		}
		if (!this.extensionsEnabledWithApiProposalVersion.includes(extensionId.toLowerCase())) {
			return true;
		}
		return areApiProposalsCompatible(enabledApiProposals);
	}

	private async isEngineValid(extensionId: string, version: string, engine: string | undefined, manifestAsset: IGalleryExtensionAsset | null, productVersion: IProductVersion): Promise<boolean> {
		if (!engine) {
			if (!manifestAsset) {
				this.logService.error(`Missing engine and manifest asset for the extension ${extensionId} with version ${version}`);
				return false;
			}
			try {
				type GalleryServiceEngineFallbackClassification = {
					owner: 'sandy081';
					comment: 'Fallback request when engine is not found in properties of an extension version';
					extension: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'extension name' };
					extensionVersion: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'version' };
				};
				type GalleryServiceEngineFallbackEvent = {
					extension: string;
					extensionVersion: string;
				};
				this.telemetryService.publicLog2<GalleryServiceEngineFallbackEvent, GalleryServiceEngineFallbackClassification>('galleryService:engineFallback', { extension: extensionId, extensionVersion: version });

				const headers = { 'Accept-Encoding': 'gzip' };
				const context = await this.getAsset(extensionId, manifestAsset, AssetType.Manifest, version, { headers });
				const manifest = await asJson<IExtensionManifest>(context);
				if (!manifest) {
					this.logService.error(`Manifest was not found for the extension ${extensionId} with version ${version}`);
					return false;
				}
				engine = manifest.engines.vscode;
			} catch (error) {
				this.logService.error(`Error while getting the engine for the version ${version}.`, getErrorMessage(error));
				return false;
			}
		}

		return isEngineValid(engine, productVersion.version, productVersion.date);
	}

	async query(options: IQueryOptions, token: CancellationToken): Promise<IPager<IGalleryExtension>> {
		const extensionGalleryManifest = await this.extensionGalleryManifestService.getExtensionGalleryManifest();

		if (!extensionGalleryManifest) {
			throw new Error('No extension gallery service configured.');
		}

		let text = options.text || '';
		const pageSize = options.pageSize ?? 50;

		let query = new Query()
			.withPage(1, pageSize);

		if (text) {
			// Use category filter instead of "category:themes"
			text = text.replace(/\bcategory:("([^"]*)"|([^"]\S*))(\s+|\b|$)/g, (_, quotedCategory, category) => {
				query = query.withFilter(FilterType.Category, category || quotedCategory);
				return '';
			});

			// Use tag filter instead of "tag:debuggers"
			text = text.replace(/\btag:("([^"]*)"|([^"]\S*))(\s+|\b|$)/g, (_, quotedTag, tag) => {
				query = query.withFilter(FilterType.Tag, tag || quotedTag);
				return '';
			});

			// Use featured filter
			text = text.replace(/\bfeatured(\s+|\b|$)/g, () => {
				query = query.withFilter(FilterType.Featured);
				return '';
			});

			text = text.trim();

			if (text) {
				text = text.length < 200 ? text : text.substring(0, 200);
				query = query.withFilter(FilterType.SearchText, text);
			}

			if (extensionGalleryManifest.capabilities.extensionQuery.sorting?.some(c => c.name === SortBy.NoneOrRelevance)) {
				query = query.withSortBy(SortBy.NoneOrRelevance);
			}
		} else {
			if (extensionGalleryManifest.capabilities.extensionQuery.sorting?.some(c => c.name === SortBy.InstallCount)) {
				query = query.withSortBy(SortBy.InstallCount);
			}
		}

		if (options.sortBy && extensionGalleryManifest.capabilities.extensionQuery.sorting?.some(c => c.name === options.sortBy)) {
			query = query.withSortBy(options.sortBy);
		}

		if (typeof options.sortOrder === 'number') {
			query = query.withSortOrder(options.sortOrder);
		}

		if (options.source) {
			query = query.withSource(options.source);
		}

		const runQuery = async (query: Query, token: CancellationToken) => {
			const { extensions, total } = await this.queryGalleryExtensions(query, { targetPlatform: CURRENT_TARGET_PLATFORM, compatible: false, includePreRelease: !!options.includePreRelease, productVersion: options.productVersion ?? { version: this.productService.version, date: this.productService.date } }, extensionGalleryManifest, token);
			extensions.forEach((e, index) => setTelemetry(e, ((query.pageNumber - 1) * query.pageSize) + index, options.source));
			return { extensions, total };
		};
		const { extensions, total } = await runQuery(query, token);
		const getPage = async (pageIndex: number, ct: CancellationToken) => {
			if (ct.isCancellationRequested) {
				throw new CancellationError();
			}
			const { extensions } = await runQuery(query.withPage(pageIndex + 1), ct);
			return extensions;
		};

		return { firstPage: extensions, total, pageSize: query.pageSize, getPage };
	}

	private async queryGalleryExtensions(query: Query, criteria: ExtensionsCriteria, extensionGalleryManifest: IExtensionGalleryManifest, token: CancellationToken): Promise<{ extensions: IGalleryExtension[]; total: number }> {
		const flags = query.flags;

		/**
		 * If both version flags (IncludeLatestVersionOnly and IncludeVersions) are included, then only include latest versions (IncludeLatestVersionOnly) flag.
		 */
		if (query.flags.includes(Flag.IncludeLatestVersionOnly) && query.flags.includes(Flag.IncludeVersions)) {
			query = query.withFlags(...query.flags.filter(flag => flag !== Flag.IncludeVersions));
		}

		/**
		 * If version flags (IncludeLatestVersionOnly and IncludeVersions) are not included, default is to query for latest versions (IncludeLatestVersionOnly).
		 */
		if (!query.flags.includes(Flag.IncludeLatestVersionOnly) && !query.flags.includes(Flag.IncludeVersions)) {
			query = query.withFlags(...query.flags, Flag.IncludeLatestVersionOnly);
		}

		/**
		 * If versions criteria exist or every requested extension is for release version and has a pre-release version, then remove latest flags and add all versions flag.
		 */
		if (criteria.versions?.length || criteria.isQueryForReleaseVersionFromPreReleaseVersion) {
			query = query.withFlags(...query.flags.filter(flag => flag !== Flag.IncludeLatestVersionOnly), Flag.IncludeVersions);
		}

		/**
		 * Add necessary extension flags
		 */
		query = query.withFlags(...query.flags, Flag.IncludeAssetUri, Flag.IncludeCategoryAndTags, Flag.IncludeFiles, Flag.IncludeStatistics, Flag.IncludeVersionProperties);
		const { galleryExtensions: rawGalleryExtensions, total, context } = await this.queryRawGalleryExtensions(query, extensionGalleryManifest, token);

		const hasAllVersions: boolean = !query.flags.includes(Flag.IncludeLatestVersionOnly);
		if (hasAllVersions) {
			const extensions: IGalleryExtension[] = [];
			for (const rawGalleryExtension of rawGalleryExtensions) {
				const allTargetPlatforms = getAllTargetPlatforms(rawGalleryExtension);
				const extensionIdentifier = { id: getGalleryExtensionId(rawGalleryExtension.publisher.publisherName, rawGalleryExtension.extensionName), uuid: rawGalleryExtension.extensionId };
				const includePreRelease = isBoolean(criteria.includePreRelease) ? criteria.includePreRelease : !!criteria.includePreRelease.find(extensionIdentifierWithPreRelease => areSameExtensions(extensionIdentifierWithPreRelease, extensionIdentifier))?.includePreRelease;
				const rawGalleryExtensionVersion = await this.getValidRawGalleryExtensionVersion(
					rawGalleryExtension,
					rawGalleryExtension.versions,
					{
						compatible: criteria.compatible,
						targetPlatform: criteria.targetPlatform,
						productVersion: criteria.productVersion,
						version: criteria.versions?.find(extensionIdentifierWithVersion => areSameExtensions(extensionIdentifierWithVersion, extensionIdentifier))?.version
							?? (includePreRelease ? VersionKind.Latest : VersionKind.Release)
					},
					allTargetPlatforms
				);
				if (rawGalleryExtensionVersion) {
					extensions.push(toExtension(rawGalleryExtension, rawGalleryExtensionVersion, allTargetPlatforms, extensionGalleryManifest, this.productService, context));
				}
			}
			return { extensions, total };
		}

		const result: [number, IGalleryExtension][] = [];
		const needAllVersions = new Map<string, number>();
		for (let index = 0; index < rawGalleryExtensions.length; index++) {
			const rawGalleryExtension = rawGalleryExtensions[index];
			const extensionIdentifier = { id: getGalleryExtensionId(rawGalleryExtension.publisher.publisherName, rawGalleryExtension.extensionName), uuid: rawGalleryExtension.extensionId };
			const includePreRelease = isBoolean(criteria.includePreRelease) ? criteria.includePreRelease : !!criteria.includePreRelease.find(extensionIdentifierWithPreRelease => areSameExtensions(extensionIdentifierWithPreRelease, extensionIdentifier))?.includePreRelease;
			const allTargetPlatforms = getAllTargetPlatforms(rawGalleryExtension);
			if (criteria.compatible) {
				// Skip looking for all versions if requested for a web-compatible extension and it is not a web extension.
				if (isNotWebExtensionInWebTargetPlatform(allTargetPlatforms, criteria.targetPlatform)) {
					continue;
				}
				// Skip looking for all versions if the extension is not allowed.
				if (this.allowedExtensionsService.isAllowed({ id: extensionIdentifier.id, publisherDisplayName: rawGalleryExtension.publisher.displayName }) !== true) {
					continue;
				}
			}
			const rawGalleryExtensionVersion = await this.getValidRawGalleryExtensionVersion(
				rawGalleryExtension,
				rawGalleryExtension.versions,
				{
					compatible: criteria.compatible,
					targetPlatform: criteria.targetPlatform,
					productVersion: criteria.productVersion,
					version: criteria.versions?.find(extensionIdentifierWithVersion => areSameExtensions(extensionIdentifierWithVersion, extensionIdentifier))?.version
						?? (includePreRelease ? VersionKind.Latest : VersionKind.Release)
				},
				allTargetPlatforms
			);
			const extension = rawGalleryExtensionVersion ? toExtension(rawGalleryExtension, rawGalleryExtensionVersion, allTargetPlatforms, extensionGalleryManifest, this.productService, context) : null;
			if (!extension
				/** Need all versions if the extension is a pre-release version but
				 * 		- the query is to look for a release version or
				 * 		- the extension has no release version
				 * Get all versions to get or check the release version
				*/
				|| (extension.properties.isPreReleaseVersion && (!includePreRelease || !extension.hasReleaseVersion))
				/**
				 * Need all versions if the extension is a release version with a different target platform than requested and also has a pre-release version
				 * Because, this is a platform specific extension and can have a newer release version supporting this platform.
				 * See https://github.com/microsoft/vscode/issues/139628
				*/
				|| (!extension.properties.isPreReleaseVersion && extension.properties.targetPlatform !== criteria.targetPlatform && extension.hasPreReleaseVersion)
			) {
				needAllVersions.set(rawGalleryExtension.extensionId, index);
			} else {
				result.push([index, extension]);
			}
		}

		if (needAllVersions.size) {
			const stopWatch = new StopWatch();
			const query = new Query()
				.withFlags(...flags.filter(flag => flag !== Flag.IncludeLatestVersionOnly), Flag.IncludeVersions)
				.withPage(1, needAllVersions.size)
				.withFilter(FilterType.ExtensionId, ...needAllVersions.keys());
			const { extensions } = await this.queryGalleryExtensions(query, criteria, extensionGalleryManifest, token);
			this.telemetryService.publicLog2<GalleryServiceAdditionalQueryEvent, GalleryServiceAdditionalQueryClassification>('galleryService:additionalQuery', {
				duration: stopWatch.elapsed(),
				count: needAllVersions.size
			});
			for (const extension of extensions) {
				const index = needAllVersions.get(extension.identifier.uuid)!;
				result.push([index, extension]);
			}
		}

		return { extensions: result.sort((a, b) => a[0] - b[0]).map(([, extension]) => extension), total };
	}

	private async getValidRawGalleryExtensionVersion(rawGalleryExtension: IRawGalleryExtension, versions: IRawGalleryExtensionVersion[], criteria: ExtensionVersionCriteria, allTargetPlatforms: TargetPlatform[]): Promise<IRawGalleryExtensionVersion | null> {
		const extensionIdentifier = { id: getGalleryExtensionId(rawGalleryExtension.publisher.publisherName, rawGalleryExtension.extensionName), uuid: rawGalleryExtension.extensionId };
		const rawGalleryExtensionVersions = sortExtensionVersions(versions, criteria.targetPlatform);

		if (criteria.compatible && isNotWebExtensionInWebTargetPlatform(allTargetPlatforms, criteria.targetPlatform)) {
			return null;
		}

		const version = isString(criteria.version) ? criteria.version : undefined;

		for (let index = 0; index < rawGalleryExtensionVersions.length; index++) {
			const rawGalleryExtensionVersion = rawGalleryExtensionVersions[index];
			if (await this.isValidVersion(
				{
					id: extensionIdentifier.id,
					version: rawGalleryExtensionVersion.version,
					isPreReleaseVersion: isPreReleaseVersion(rawGalleryExtensionVersion),
					targetPlatform: getTargetPlatformForExtensionVersion(rawGalleryExtensionVersion),
					engine: getEngine(rawGalleryExtensionVersion),
					manifestAsset: getVersionAsset(rawGalleryExtensionVersion, AssetType.Manifest),
					enabledApiProposals: getEnabledApiProposals(rawGalleryExtensionVersion)
				},
				criteria,
				rawGalleryExtension.publisher.displayName,
				allTargetPlatforms)
			) {
				return rawGalleryExtensionVersion;
			}
			if (version && rawGalleryExtensionVersion.version === version) {
				return null;
			}
		}

		if (version || criteria.compatible) {
			return null;
		}

		/**
		 * Fallback: Return the latest version
		 * This can happen when the extension does not have a release version or does not have a version compatible with the given target platform.
		 */
		return rawGalleryExtension.versions[0];
	}

	private async queryRawGalleryExtensions(query: Query, extensionGalleryManifest: IExtensionGalleryManifest, token: CancellationToken): Promise<IRawGalleryExtensionsResult> {
		const extensionsQueryApi = getExtensionGalleryManifestResourceUri(extensionGalleryManifest, ExtensionGalleryResourceType.ExtensionQueryService);

		if (!extensionsQueryApi) {
			throw new Error('No extension gallery query service configured.');
		}

		query = query
			/* Always exclude non validated extensions */
			.withFlags(...query.flags, Flag.ExcludeNonValidated)
			.withFilter(FilterType.Target, 'Microsoft.VisualStudio.Code');

		const unpublishedFlag = extensionGalleryManifest.capabilities.extensionQuery.flags?.find(f => f.name === Flag.Unpublished);
		/* Always exclude unpublished extensions */
		if (unpublishedFlag) {
			query = query.withFilter(FilterType.ExcludeWithFlags, String(unpublishedFlag.value));
		}

		const data = JSON.stringify({
			filters: [
				{
					criteria: query.criteria.reduce<{ filterType: number; value?: string }[]>((criteria, c) => {
						const criterium = extensionGalleryManifest.capabilities.extensionQuery.filtering?.find(f => f.name === c.filterType);
						if (criterium) {
							criteria.push({
								filterType: criterium.value,
								value: c.value,
							});
						}
						return criteria;
					}, []),
					pageNumber: query.pageNumber,
					pageSize: query.pageSize,
					sortBy: extensionGalleryManifest.capabilities.extensionQuery.sorting?.find(s => s.name === query.sortBy)?.value,
					sortOrder: query.sortOrder,
				}
			],
			assetTypes: query.assetTypes,
			flags: query.flags.reduce<number>((flags, flag) => {
				const flagValue = extensionGalleryManifest.capabilities.extensionQuery.flags?.find(f => f.name === flag);
				if (flagValue) {
					flags |= flagValue.value;
				}
				return flags;
			}, 0)
		});

		const commonHeaders = await this.commonHeadersPromise;
		const headers = {
			...commonHeaders,
			'Content-Type': 'application/json',
			'Accept': 'application/json;api-version=3.0-preview.1',
			'Accept-Encoding': 'gzip',
			'Content-Length': String(data.length),
		};

		const stopWatch = new StopWatch();
		let context: IRequestContext | undefined, errorCode: ExtensionGalleryErrorCode | undefined, total: number = 0;

		try {
			context = await this.requestService.request({
				type: 'POST',
				url: extensionsQueryApi,
				data,
				headers
			}, token);

			if (context.res.statusCode && context.res.statusCode >= 400 && context.res.statusCode < 500) {
				return { galleryExtensions: [], total };
			}

			const result = await asJson<IRawGalleryQueryResult>(context);
			if (result) {
				const r = result.results[0];
				const galleryExtensions = r.extensions;
				const resultCount = r.resultMetadata && r.resultMetadata.filter(m => m.metadataType === 'ResultCount')[0];
				total = resultCount && resultCount.metadataItems.filter(i => i.name === 'TotalCount')[0].count || 0;

				return {
					galleryExtensions,
					total,
					context: context.res.headers['activityid'] ? {
						[SEARCH_ACTIVITY_HEADER_NAME]: context.res.headers['activityid']
					} : {}
				};
			}
			return { galleryExtensions: [], total };

		} catch (e) {
			if (isCancellationError(e)) {
				errorCode = ExtensionGalleryErrorCode.Cancelled;
				throw e;
			} else {
				const errorMessage = getErrorMessage(e);
				errorCode = isOfflineError(e)
					? ExtensionGalleryErrorCode.Offline
					: errorMessage.startsWith('XHR timeout')
						? ExtensionGalleryErrorCode.Timeout
						: ExtensionGalleryErrorCode.Failed;
				throw new ExtensionGalleryError(errorMessage, errorCode);
			}
		} finally {
			this.telemetryService.publicLog2<GalleryServiceQueryEvent, GalleryServiceQueryClassification>('galleryService:query', {
				filterTypes: query.criteria.map(criterium => criterium.filterType),
				flags: query.flags,
				sortBy: query.sortBy,
				sortOrder: String(query.sortOrder),
				pageNumber: String(query.pageNumber),
				source: query.source,
				searchTextLength: query.searchText.length,
				requestBodySize: String(data.length),
				duration: stopWatch.elapsed(),
				success: !!context && isSuccess(context),
				responseBodySize: context?.res.headers['Content-Length'],
				statusCode: context ? String(context.res.statusCode) : undefined,
				errorCode,
				count: String(total),
				server: this.getHeaderValue(context?.res.headers, SERVER_HEADER_NAME),
				activityId: this.getHeaderValue(context?.res.headers, ACTIVITY_HEADER_NAME),
				endToEndId: this.getHeaderValue(context?.res.headers, END_END_ID_HEADER_NAME),
			});
		}
	}

	private getHeaderValue(headers: IHeaders | undefined, name: string): TelemetryTrustedValue<string> | undefined {
		const headerValue = headers?.[name.toLowerCase()];
		const value = Array.isArray(headerValue) ? headerValue[0] : headerValue;
		return value ? new TelemetryTrustedValue(value) : undefined;
	}

	private async getLatestRawGalleryExtensionWithFallback(extensionInfo: IExtensionInfo, resourceApi: { uri: string; fallback?: string }, token: CancellationToken): Promise<IRawGalleryExtension | null> {
		const [publisher, name] = extensionInfo.id.split('.');
		let errorCode: string | undefined;
		try {
			const uri = URI.parse(format2(resourceApi.uri, { publisher, name }));
			return await this.getLatestRawGalleryExtension(extensionInfo.id, uri, token);
		} catch (error) {
			if (error instanceof ExtensionGalleryError) {
				errorCode = error.code;
				switch (error.code) {
					case ExtensionGalleryErrorCode.Offline:
					case ExtensionGalleryErrorCode.Cancelled:
					case ExtensionGalleryErrorCode.Timeout:
					case ExtensionGalleryErrorCode.ClientError:
						throw error;
				}
			} else {
				errorCode = 'Unknown';
			}
			if (!resourceApi.fallback) {
				throw error;
			}
		} finally {
			this.telemetryService.publicLog2<
				{
					extension: string;
					errorCode?: string;
				},
				{
					owner: 'sandy081';
					comment: 'Report fetching latest version of an extension';
					extension: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The identifier of the extension' };
					errorCode?: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The error code in case of error' };
				}
			>('galleryService:getmarketplacelatest', {
				extension: extensionInfo.id,
				errorCode,
			});
		}

		this.logService.error(`Error while getting the latest version for the extension ${extensionInfo.id} from ${resourceApi.uri}. Trying the fallback ${resourceApi.fallback}`, errorCode);
		try {
			const uri = URI.parse(format2(resourceApi.fallback, { publisher, name }));
			return await this.getLatestRawGalleryExtension(extensionInfo.id, uri, token);
		} catch (error) {
			errorCode = error instanceof ExtensionGalleryError ? error.code : 'Unknown';
			throw error;
		} finally {
			this.telemetryService.publicLog2<
				{
					extension: string;
					errorCode?: string;
				},
				{
					owner: 'sandy081';
					comment: 'Report the fallback to the unpkg service for getting latest extension';
					extension: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Extension id' };
					errorCode?: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The error code in case of error' };
				}>('galleryService:fallbacktounpkg', {
					extension: extensionInfo.id,
					errorCode,
				});
		}
	}

	private async getLatestRawGalleryExtension(extension: string, uri: URI, token: CancellationToken): Promise<IRawGalleryExtension | null> {
		let context;
		let errorCode: string | undefined;
		const stopWatch = new StopWatch();

		try {
			const commonHeaders = await this.commonHeadersPromise;
			const headers = {
				...commonHeaders,
				'Content-Type': 'application/json',
				'Accept': 'application/json;api-version=7.2-preview',
				'Accept-Encoding': 'gzip',
			};

			context = await this.requestService.request({
				type: 'GET',
				url: uri.toString(true),
				headers,
				timeout: this.getRequestTimeout()
			}, token);

			if (context.res.statusCode === 404) {
				errorCode = 'NotFound';
				return null;
			}

			if (context.res.statusCode && context.res.statusCode !== 200) {
				throw new Error('Unexpected HTTP response: ' + context.res.statusCode);
			}

			const result = await asJson<IRawGalleryExtension>(context);
			if (!result) {
				errorCode = 'NoData';
			}
			return result;
		}

		catch (error) {
			let galleryErrorCode: ExtensionGalleryErrorCode;
			if (isCancellationError(error)) {
				galleryErrorCode = ExtensionGalleryErrorCode.Cancelled;
			} else if (isOfflineError(error)) {
				galleryErrorCode = ExtensionGalleryErrorCode.Offline;
			} else if (getErrorMessage(error).startsWith('XHR timeout')) {
				galleryErrorCode = ExtensionGalleryErrorCode.Timeout;
			} else if (context && isClientError(context)) {
				galleryErrorCode = ExtensionGalleryErrorCode.ClientError;
			} else if (context && isServerError(context)) {
				galleryErrorCode = ExtensionGalleryErrorCode.ServerError;
			} else {
				galleryErrorCode = ExtensionGalleryErrorCode.Failed;
			}
			errorCode = galleryErrorCode;
			throw new ExtensionGalleryError(error, galleryErrorCode);
		}

		finally {
			type GalleryServiceGetLatestEventClassification = {
				owner: 'sandy081';
				comment: 'Report the query to the Marketplace for fetching latest version of an extension';
				host: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The host of the end point' };
				extension: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The identifier of the extension' };
				duration: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; isMeasurement: true; comment: 'Duration in ms for the query' };
				errorCode?: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The error code in case of error' };
				statusCode?: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The status code in case of error' };
				server?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The server of the end point' };
				activityId?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The activity ID of the request' };
				endToEndId?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The end-to-end ID of the request' };
			};
			type GalleryServiceGetLatestEvent = {
				extension: string;
				host: string;
				duration: number;
				errorCode?: string;
				statusCode?: string;
				server?: TelemetryTrustedValue<string>;
				activityId?: TelemetryTrustedValue<string>;
				endToEndId?: TelemetryTrustedValue<string>;
			};
			this.telemetryService.publicLog2<GalleryServiceGetLatestEvent, GalleryServiceGetLatestEventClassification>('galleryService:getLatest', {
				extension,
				host: uri.authority,
				duration: stopWatch.elapsed(),
				errorCode,
				statusCode: context?.res.statusCode && context?.res.statusCode !== 200 ? `${context.res.statusCode}` : undefined,
				server: this.getHeaderValue(context?.res.headers, SERVER_HEADER_NAME),
				activityId: this.getHeaderValue(context?.res.headers, ACTIVITY_HEADER_NAME),
				endToEndId: this.getHeaderValue(context?.res.headers, END_END_ID_HEADER_NAME),
			});
		}
	}

	async reportStatistic(publisher: string, name: string, version: string, type: StatisticType): Promise<void> {
		const manifest = await this.extensionGalleryManifestService.getExtensionGalleryManifest();
		if (!manifest) {
			return undefined;
		}

		let url: string;

		if (isWeb) {
			const resource = getExtensionGalleryManifestResourceUri(manifest, ExtensionGalleryResourceType.WebExtensionStatisticsUri);
			if (!resource) {
				return;
			}
			url = format2(resource, { publisher, name, version, statTypeValue: type === StatisticType.Install ? '1' : '3' });
		} else {
			const resource = getExtensionGalleryManifestResourceUri(manifest, ExtensionGalleryResourceType.ExtensionStatisticsUri);
			if (!resource) {
				return;
			}
			url = format2(resource, { publisher, name, version, statTypeName: type });
		}

		const Accept = isWeb ? 'api-version=6.1-preview.1' : '*/*;api-version=4.0-preview.1';
		const commonHeaders = await this.commonHeadersPromise;
		const headers = { ...commonHeaders, Accept };
		try {
			await this.requestService.request({
				type: 'POST',
				url,
				headers
			}, CancellationToken.None);
		} catch (error) { /* Ignore */ }
	}

	async download(extension: IGalleryExtension, location: URI, operation: InstallOperation): Promise<void> {
		this.logService.trace('ExtensionGalleryService#download', extension.identifier.id);
		const data = getGalleryExtensionTelemetryData(extension);
		const startTime = new Date().getTime();

		const operationParam = operation === InstallOperation.Install ? 'install' : operation === InstallOperation.Update ? 'update' : '';
		const downloadAsset = operationParam ? {
			uri: `${extension.assets.download.uri}${URI.parse(extension.assets.download.uri).query ? '&' : '?'}${operationParam}=true`,
			fallbackUri: `${extension.assets.download.fallbackUri}${URI.parse(extension.assets.download.fallbackUri).query ? '&' : '?'}${operationParam}=true`
		} : extension.assets.download;

		const activityId = extension.queryContext?.[SEARCH_ACTIVITY_HEADER_NAME];
		const headers: IHeaders | undefined = activityId && typeof activityId === 'string' ? { [SEARCH_ACTIVITY_HEADER_NAME]: activityId } : undefined;
		const context = await this.getAsset(extension.identifier.id, downloadAsset, AssetType.VSIX, extension.version, headers ? { headers } : undefined);

		try {
			await this.fileService.writeFile(location, context.stream);
		} catch (error) {
			try {
				await this.fileService.del(location);
			} catch (e) {
				/* ignore */
				this.logService.warn(`Error while deleting the file ${location.toString()}`, getErrorMessage(e));
			}
			throw new ExtensionGalleryError(getErrorMessage(error), ExtensionGalleryErrorCode.DownloadFailedWriting);
		}

		/* __GDPR__
			"galleryService:downloadVSIX" : {
				"owner": "sandy081",
				"duration": { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
				"${include}": [
					"${GalleryExtensionTelemetryData}"
				]
			}
		*/
		this.telemetryService.publicLog('galleryService:downloadVSIX', { ...data, duration: new Date().getTime() - startTime });
	}

	async downloadSignatureArchive(extension: IGalleryExtension, location: URI): Promise<void> {
		if (!extension.assets.signature) {
			throw new Error('No signature asset found');
		}

		this.logService.trace('ExtensionGalleryService#downloadSignatureArchive', extension.identifier.id);

		const context = await this.getAsset(extension.identifier.id, extension.assets.signature, AssetType.Signature, extension.version);
		try {
			await this.fileService.writeFile(location, context.stream);
		} catch (error) {
			try {
				await this.fileService.del(location);
			} catch (e) {
				/* ignore */
				this.logService.warn(`Error while deleting the file ${location.toString()}`, getErrorMessage(e));
			}
			throw new ExtensionGalleryError(getErrorMessage(error), ExtensionGalleryErrorCode.DownloadFailedWriting);
		}

	}

	async getReadme(extension: IGalleryExtension, token: CancellationToken): Promise<string> {
		if (extension.assets.readme) {
			const context = await this.getAsset(extension.identifier.id, extension.assets.readme, AssetType.Details, extension.version, {}, token);
			const content = await asTextOrError(context);
			return content || '';
		}
		return '';
	}

	async getManifest(extension: IGalleryExtension, token: CancellationToken): Promise<IExtensionManifest | null> {
		if (extension.assets.manifest) {
			const context = await this.getAsset(extension.identifier.id, extension.assets.manifest, AssetType.Manifest, extension.version, {}, token);
			const text = await asTextOrError(context);
			return text ? JSON.parse(text) : null;
		}
		return null;
	}

	async getCoreTranslation(extension: IGalleryExtension, languageId: string): Promise<ITranslation | null> {
		const asset = extension.assets.coreTranslations.filter(t => t[0] === languageId.toUpperCase())[0];
		if (asset) {
			const context = await this.getAsset(extension.identifier.id, asset[1], asset[0], extension.version);
			const text = await asTextOrError(context);
			return text ? JSON.parse(text) : null;
		}
		return null;
	}

	async getChangelog(extension: IGalleryExtension, token: CancellationToken): Promise<string> {
		if (extension.assets.changelog) {
			const context = await this.getAsset(extension.identifier.id, extension.assets.changelog, AssetType.Changelog, extension.version, {}, token);
			const content = await asTextOrError(context);
			return content || '';
		}
		return '';
	}

	async getAllVersions(extensionIdentifier: IExtensionIdentifier): Promise<IGalleryExtensionVersion[]> {
		return this.getVersions(extensionIdentifier);
	}

	async getAllCompatibleVersions(extensionIdentifier: IExtensionIdentifier, includePreRelease: boolean, targetPlatform: TargetPlatform): Promise<IGalleryExtensionVersion[]> {
		return this.getVersions(extensionIdentifier, { version: includePreRelease ? VersionKind.Latest : VersionKind.Release, targetPlatform });
	}

	private async getVersions(extensionIdentifier: IExtensionIdentifier, onlyCompatible?: { version: VersionKind; targetPlatform: TargetPlatform }): Promise<IGalleryExtensionVersion[]> {
		const extensionGalleryManifest = await this.extensionGalleryManifestService.getExtensionGalleryManifest();
		if (!extensionGalleryManifest) {
			throw new Error('No extension gallery service configured.');
		}

		let query = new Query()
			.withFlags(Flag.IncludeVersions, Flag.IncludeCategoryAndTags, Flag.IncludeFiles, Flag.IncludeVersionProperties)
			.withPage(1, 1);

		if (extensionIdentifier.uuid) {
			query = query.withFilter(FilterType.ExtensionId, extensionIdentifier.uuid);
		} else {
			query = query.withFilter(FilterType.ExtensionName, extensionIdentifier.id);
		}

		const { galleryExtensions } = await this.queryRawGalleryExtensions(query, extensionGalleryManifest, CancellationToken.None);
		if (!galleryExtensions.length) {
			return [];
		}

		const allTargetPlatforms = getAllTargetPlatforms(galleryExtensions[0]);
		if (onlyCompatible && isNotWebExtensionInWebTargetPlatform(allTargetPlatforms, onlyCompatible.targetPlatform)) {
			return [];
		}

		const versions: IRawGalleryExtensionVersion[] = [];
		const productVersion = { version: this.productService.version, date: this.productService.date };
		await Promise.all(galleryExtensions[0].versions.map(async (version) => {
			try {
				if (
					(await this.isValidVersion(
						{
							id: extensionIdentifier.id,
							version: version.version,
							isPreReleaseVersion: isPreReleaseVersion(version),
							targetPlatform: getTargetPlatformForExtensionVersion(version),
							engine: getEngine(version),
							manifestAsset: getVersionAsset(version, AssetType.Manifest),
							enabledApiProposals: getEnabledApiProposals(version)
						},
						{
							compatible: !!onlyCompatible,
							productVersion,
							targetPlatform: onlyCompatible?.targetPlatform,
							version: onlyCompatible?.version ?? version.version
						},
						galleryExtensions[0].publisher.displayName,
						allTargetPlatforms))
				) {
					versions.push(version);
				}
			} catch (error) { /* Ignore error and skip version */ }
		}));

		const result: IGalleryExtensionVersion[] = [];
		const seen = new Map<string, number>();
		for (const version of sortExtensionVersions(versions, onlyCompatible?.targetPlatform ?? CURRENT_TARGET_PLATFORM)) {
			const index = seen.get(version.version);
			const existing = index !== undefined ? result[index] : undefined;
			const targetPlatform = getTargetPlatformForExtensionVersion(version);
			if (!existing) {
				seen.set(version.version, result.length);
				result.push({ version: version.version, date: version.lastUpdated, isPreReleaseVersion: isPreReleaseVersion(version), targetPlatforms: [targetPlatform] });
			} else {
				existing.targetPlatforms.push(targetPlatform);
			}
		}

		return result;
	}

	private async getAsset(extension: string, asset: IGalleryExtensionAsset, assetType: string, extensionVersion: string, options: IRequestOptions = {}, token: CancellationToken = CancellationToken.None): Promise<IRequestContext> {
		const commonHeaders = await this.commonHeadersPromise;
		const baseOptions = { type: 'GET' };
		const headers = { ...commonHeaders, ...(options.headers || {}) };
		options = { ...options, ...baseOptions, headers };

		const url = asset.uri;
		const fallbackUrl = asset.fallbackUri;
		const firstOptions = { ...options, url, timeout: this.getRequestTimeout() };

		let context;
		try {
			context = await this.requestService.request(firstOptions, token);
			if (context.res.statusCode === 200) {
				return context;
			}
			const message = await asTextOrError(context);
			throw new Error(`Expected 200, got back ${context.res.statusCode} instead.\n\n${message}`);
		} catch (err) {
			if (isCancellationError(err)) {
				throw err;
			}

			const message = getErrorMessage(err);
			type GalleryServiceCDNFallbackClassification = {
				owner: 'sandy081';
				comment: 'Fallback request information when the primary asset request to CDN fails';
				extension: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'extension name' };
				assetType: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'asset that failed' };
				message: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'error message' };
				extensionVersion: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'version' };
				readonly server?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'server that handled the query' };
				readonly endToEndId?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'end to end operation id' };
				readonly activityId?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'activity id' };
			};
			type GalleryServiceCDNFallbackEvent = {
				extension: string;
				assetType: string;
				message: string;
				extensionVersion: string;
				server?: TelemetryTrustedValue<string>;
				endToEndId?: TelemetryTrustedValue<string>;
				activityId?: TelemetryTrustedValue<string>;
			};
			this.telemetryService.publicLog2<GalleryServiceCDNFallbackEvent, GalleryServiceCDNFallbackClassification>('galleryService:cdnFallback', {
				extension,
				assetType,
				message,
				extensionVersion,
				server: this.getHeaderValue(context?.res.headers, SERVER_HEADER_NAME),
				activityId: this.getHeaderValue(context?.res.headers, ACTIVITY_HEADER_NAME),
				endToEndId: this.getHeaderValue(context?.res.headers, END_END_ID_HEADER_NAME),
			});

			const fallbackOptions = { ...options, url: fallbackUrl, timeout: this.getRequestTimeout() };
			return this.requestService.request(fallbackOptions, token);
		}
	}

	async getExtensionsControlManifest(): Promise<IExtensionsControlManifest> {
		const manifest = await this.extensionGalleryManifestService.getExtensionGalleryManifest();
		if (!manifest) {
			throw new Error('No extension gallery service configured.');
		}


		if (!this.extensionsControlUrl) {
			return { malicious: [], deprecated: {}, search: [], autoUpdate: {} };
		}

		const context = await this.requestService.request({
			type: 'GET',
			url: this.extensionsControlUrl,
			timeout: this.getRequestTimeout()
		}, CancellationToken.None);

		if (context.res.statusCode !== 200) {
			throw new Error('Could not get extensions report.');
		}

		const result = await asJson<IRawExtensionsControlManifest>(context);
		const malicious: Array<MaliciousExtensionInfo> = [];
		const deprecated: IStringDictionary<IDeprecationInfo> = {};
		const search: ISearchPrefferedResults[] = [];
		const autoUpdate: IStringDictionary<string> = result?.autoUpdate ?? {};
		if (result) {
			for (const id of result.malicious) {
				if (!isString(id)) {
					continue;
				}
				const publisherOrExtension = EXTENSION_IDENTIFIER_REGEX.test(id) ? { id } : id;
				malicious.push({ extensionOrPublisher: publisherOrExtension, learnMoreLink: result.learnMoreLinks?.[id] });
			}
			if (result.migrateToPreRelease) {
				for (const [unsupportedPreReleaseExtensionId, preReleaseExtensionInfo] of Object.entries(result.migrateToPreRelease)) {
					if (!preReleaseExtensionInfo.engine || isEngineValid(preReleaseExtensionInfo.engine, this.productService.version, this.productService.date)) {
						deprecated[unsupportedPreReleaseExtensionId.toLowerCase()] = {
							disallowInstall: true,
							extension: {
								id: preReleaseExtensionInfo.id,
								displayName: preReleaseExtensionInfo.displayName,
								autoMigrate: { storage: !!preReleaseExtensionInfo.migrateStorage },
								preRelease: true
							}
						};
					}
				}
			}
			if (result.deprecated) {
				for (const [deprecatedExtensionId, deprecationInfo] of Object.entries(result.deprecated)) {
					if (deprecationInfo) {
						deprecated[deprecatedExtensionId.toLowerCase()] = isBoolean(deprecationInfo) ? {} : deprecationInfo;
					}
				}
			}
			if (result.search) {
				for (const s of result.search) {
					search.push(s);
				}
			}
		}

		return { malicious, deprecated, search, autoUpdate };
	}

	private getRequestTimeout(): number {
		const configuredTimeout = this.configurationService.getValue<number>(ExtensionRequestsTimeoutConfigKey);
		return isNumber(configuredTimeout) && configuredTimeout >= 0 ? configuredTimeout : 60_000;
	}

}

export class ExtensionGalleryService extends AbstractExtensionGalleryService {

	constructor(
		@IStorageService storageService: IStorageService,
		@IRequestService requestService: IRequestService,
		@ILogService logService: ILogService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IFileService fileService: IFileService,
		@IProductService productService: IProductService,
		@IConfigurationService configurationService: IConfigurationService,
		@IAllowedExtensionsService allowedExtensionsService: IAllowedExtensionsService,
		@IExtensionGalleryManifestService extensionGalleryManifestService: IExtensionGalleryManifestService,
	) {
		super(storageService, requestService, logService, environmentService, telemetryService, fileService, productService, configurationService, allowedExtensionsService, extensionGalleryManifestService);
	}
}

export class ExtensionGalleryServiceWithNoStorageService extends AbstractExtensionGalleryService {

	constructor(
		@IRequestService requestService: IRequestService,
		@ILogService logService: ILogService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IFileService fileService: IFileService,
		@IProductService productService: IProductService,
		@IConfigurationService configurationService: IConfigurationService,
		@IAllowedExtensionsService allowedExtensionsService: IAllowedExtensionsService,
		@IExtensionGalleryManifestService extensionGalleryManifestService: IExtensionGalleryManifestService,
	) {
		super(undefined, requestService, logService, environmentService, telemetryService, fileService, productService, configurationService, allowedExtensionsService, extensionGalleryManifestService);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/common/extensionManagement.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/common/extensionManagement.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { IStringDictionary } from '../../../base/common/collections.js';
import { Event } from '../../../base/common/event.js';
import { IMarkdownString } from '../../../base/common/htmlContent.js';
import { IPager } from '../../../base/common/paging.js';
import { Platform } from '../../../base/common/platform.js';
import { PolicyCategory } from '../../../base/common/policy.js';
import { URI } from '../../../base/common/uri.js';
import { localize, localize2 } from '../../../nls.js';
import { ConfigurationScope, Extensions, IConfigurationRegistry } from '../../configuration/common/configurationRegistry.js';
import { ExtensionType, IExtension, IExtensionManifest, TargetPlatform } from '../../extensions/common/extensions.js';
import { FileOperationError, FileOperationResult, IFileService, IFileStat } from '../../files/common/files.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { Registry } from '../../registry/common/platform.js';
import { IExtensionGalleryManifest } from './extensionGalleryManifest.js';

export const EXTENSION_IDENTIFIER_PATTERN = '^([a-z0-9A-Z][a-z0-9-A-Z]*)\\.([a-z0-9A-Z][a-z0-9-A-Z]*)$';
export const EXTENSION_IDENTIFIER_REGEX = new RegExp(EXTENSION_IDENTIFIER_PATTERN);
export const WEB_EXTENSION_TAG = '__web_extension';
export const EXTENSION_INSTALL_SKIP_WALKTHROUGH_CONTEXT = 'skipWalkthrough';
export const EXTENSION_INSTALL_SKIP_PUBLISHER_TRUST_CONTEXT = 'skipPublisherTrust';
export const EXTENSION_INSTALL_SOURCE_CONTEXT = 'extensionInstallSource';
export const EXTENSION_INSTALL_DEP_PACK_CONTEXT = 'dependecyOrPackExtensionInstall';
export const EXTENSION_INSTALL_CLIENT_TARGET_PLATFORM_CONTEXT = 'clientTargetPlatform';

export const enum ExtensionInstallSource {
	COMMAND = 'command',
	SETTINGS_SYNC = 'settingsSync',
}

export interface IProductVersion {
	readonly version: string;
	readonly date?: string;
}

export function TargetPlatformToString(targetPlatform: TargetPlatform) {
	switch (targetPlatform) {
		case TargetPlatform.WIN32_X64: return 'Windows 64 bit';
		case TargetPlatform.WIN32_ARM64: return 'Windows ARM';

		case TargetPlatform.LINUX_X64: return 'Linux 64 bit';
		case TargetPlatform.LINUX_ARM64: return 'Linux ARM 64';
		case TargetPlatform.LINUX_ARMHF: return 'Linux ARM';

		case TargetPlatform.ALPINE_X64: return 'Alpine Linux 64 bit';
		case TargetPlatform.ALPINE_ARM64: return 'Alpine ARM 64';

		case TargetPlatform.DARWIN_X64: return 'Mac';
		case TargetPlatform.DARWIN_ARM64: return 'Mac Silicon';

		case TargetPlatform.WEB: return 'Web';

		case TargetPlatform.UNIVERSAL: return TargetPlatform.UNIVERSAL;
		case TargetPlatform.UNKNOWN: return TargetPlatform.UNKNOWN;
		case TargetPlatform.UNDEFINED: return TargetPlatform.UNDEFINED;
	}
}

export function toTargetPlatform(targetPlatform: string): TargetPlatform {
	switch (targetPlatform) {
		case TargetPlatform.WIN32_X64: return TargetPlatform.WIN32_X64;
		case TargetPlatform.WIN32_ARM64: return TargetPlatform.WIN32_ARM64;

		case TargetPlatform.LINUX_X64: return TargetPlatform.LINUX_X64;
		case TargetPlatform.LINUX_ARM64: return TargetPlatform.LINUX_ARM64;
		case TargetPlatform.LINUX_ARMHF: return TargetPlatform.LINUX_ARMHF;

		case TargetPlatform.ALPINE_X64: return TargetPlatform.ALPINE_X64;
		case TargetPlatform.ALPINE_ARM64: return TargetPlatform.ALPINE_ARM64;

		case TargetPlatform.DARWIN_X64: return TargetPlatform.DARWIN_X64;
		case TargetPlatform.DARWIN_ARM64: return TargetPlatform.DARWIN_ARM64;

		case TargetPlatform.WEB: return TargetPlatform.WEB;

		case TargetPlatform.UNIVERSAL: return TargetPlatform.UNIVERSAL;
		default: return TargetPlatform.UNKNOWN;
	}
}

export function getTargetPlatform(platform: Platform | 'alpine', arch: string | undefined): TargetPlatform {
	switch (platform) {
		case Platform.Windows:
			if (arch === 'x64') {
				return TargetPlatform.WIN32_X64;
			}
			if (arch === 'arm64') {
				return TargetPlatform.WIN32_ARM64;
			}
			return TargetPlatform.UNKNOWN;

		case Platform.Linux:
			if (arch === 'x64') {
				return TargetPlatform.LINUX_X64;
			}
			if (arch === 'arm64') {
				return TargetPlatform.LINUX_ARM64;
			}
			if (arch === 'arm') {
				return TargetPlatform.LINUX_ARMHF;
			}
			return TargetPlatform.UNKNOWN;

		case 'alpine':
			if (arch === 'x64') {
				return TargetPlatform.ALPINE_X64;
			}
			if (arch === 'arm64') {
				return TargetPlatform.ALPINE_ARM64;
			}
			return TargetPlatform.UNKNOWN;

		case Platform.Mac:
			if (arch === 'x64') {
				return TargetPlatform.DARWIN_X64;
			}
			if (arch === 'arm64') {
				return TargetPlatform.DARWIN_ARM64;
			}
			return TargetPlatform.UNKNOWN;

		case Platform.Web: return TargetPlatform.WEB;
	}
}

export function isNotWebExtensionInWebTargetPlatform(allTargetPlatforms: TargetPlatform[], productTargetPlatform: TargetPlatform): boolean {
	// Not a web extension in web target platform
	return productTargetPlatform === TargetPlatform.WEB && !allTargetPlatforms.includes(TargetPlatform.WEB);
}

export function isTargetPlatformCompatible(extensionTargetPlatform: TargetPlatform, allTargetPlatforms: TargetPlatform[], productTargetPlatform: TargetPlatform): boolean {
	// Not compatible when extension is not a web extension in web target platform
	if (isNotWebExtensionInWebTargetPlatform(allTargetPlatforms, productTargetPlatform)) {
		return false;
	}

	// Compatible when extension target platform is not defined
	if (extensionTargetPlatform === TargetPlatform.UNDEFINED) {
		return true;
	}

	// Compatible when extension target platform is universal
	if (extensionTargetPlatform === TargetPlatform.UNIVERSAL) {
		return true;
	}

	// Not compatible when extension target platform is unknown
	if (extensionTargetPlatform === TargetPlatform.UNKNOWN) {
		return false;
	}

	// Compatible when extension and product target platforms matches
	if (extensionTargetPlatform === productTargetPlatform) {
		return true;
	}

	return false;
}

export interface IGalleryExtensionProperties {
	dependencies?: string[];
	extensionPack?: string[];
	engine?: string;
	enabledApiProposals?: string[];
	localizedLanguages?: string[];
	targetPlatform: TargetPlatform;
	isPreReleaseVersion: boolean;
	executesCode?: boolean;
}

export interface IGalleryExtensionAsset {
	uri: string;
	fallbackUri: string;
}

export interface IGalleryExtensionAssets {
	manifest: IGalleryExtensionAsset | null;
	readme: IGalleryExtensionAsset | null;
	changelog: IGalleryExtensionAsset | null;
	license: IGalleryExtensionAsset | null;
	repository: IGalleryExtensionAsset | null;
	download: IGalleryExtensionAsset;
	icon: IGalleryExtensionAsset | null;
	signature: IGalleryExtensionAsset | null;
	coreTranslations: [string, IGalleryExtensionAsset][];
}

export function isIExtensionIdentifier(obj: unknown): obj is IExtensionIdentifier {
	const thing = obj as IExtensionIdentifier | undefined;
	return !!thing
		&& typeof thing === 'object'
		&& typeof thing.id === 'string'
		&& (!thing.uuid || typeof thing.uuid === 'string');
}

export interface IExtensionIdentifier {
	id: string;
	uuid?: string;
}

export interface IGalleryExtensionIdentifier extends IExtensionIdentifier {
	uuid: string;
}

export interface IGalleryExtensionVersion {
	version: string;
	date: string;
	isPreReleaseVersion: boolean;
	targetPlatforms: TargetPlatform[];
}

export interface IGalleryExtension {
	type: 'gallery';
	name: string;
	identifier: IGalleryExtensionIdentifier;
	version: string;
	displayName: string;
	publisherId: string;
	publisher: string;
	publisherDisplayName: string;
	publisherDomain?: { link: string; verified: boolean };
	publisherLink?: string;
	publisherSponsorLink?: string;
	description: string;
	installCount: number;
	rating: number;
	ratingCount: number;
	categories: readonly string[];
	tags: readonly string[];
	releaseDate: number;
	lastUpdated: number;
	preview: boolean;
	private: boolean;
	hasPreReleaseVersion: boolean;
	hasReleaseVersion: boolean;
	isSigned: boolean;
	allTargetPlatforms: TargetPlatform[];
	assets: IGalleryExtensionAssets;
	properties: IGalleryExtensionProperties;
	detailsLink?: string;
	ratingLink?: string;
	supportLink?: string;
	telemetryData?: IStringDictionary<unknown>;
	queryContext?: IStringDictionary<unknown>;
}

export type InstallSource = 'gallery' | 'vsix' | 'resource';

export interface IGalleryMetadata {
	id: string;
	publisherId: string;
	private: boolean;
	publisherDisplayName: string;
	isPreReleaseVersion: boolean;
	targetPlatform?: TargetPlatform;
}

export type Metadata = Partial<IGalleryMetadata & {
	isApplicationScoped: boolean;
	isMachineScoped: boolean;
	isBuiltin: boolean;
	isSystem: boolean;
	updated: boolean;
	preRelease: boolean;
	hasPreReleaseVersion: boolean;
	installedTimestamp: number;
	pinned: boolean;
	source: InstallSource;
	size: number;
}>;

export interface ILocalExtension extends IExtension {
	isWorkspaceScoped: boolean;
	isMachineScoped: boolean;
	isApplicationScoped: boolean;
	publisherId: string | null;
	installedTimestamp?: number;
	isPreReleaseVersion: boolean;
	hasPreReleaseVersion: boolean;
	private: boolean;
	preRelease: boolean;
	updated: boolean;
	pinned: boolean;
	source: InstallSource;
	size: number;
}

export const enum SortBy {
	NoneOrRelevance = 'NoneOrRelevance',
	LastUpdatedDate = 'LastUpdatedDate',
	Title = 'Title',
	PublisherName = 'PublisherName',
	InstallCount = 'InstallCount',
	PublishedDate = 'PublishedDate',
	AverageRating = 'AverageRating',
	WeightedRating = 'WeightedRating'
}

export const enum SortOrder {
	Default = 0,
	Ascending = 1,
	Descending = 2
}

export const enum FilterType {
	Category = 'Category',
	ExtensionId = 'ExtensionId',
	ExtensionName = 'ExtensionName',
	ExcludeWithFlags = 'ExcludeWithFlags',
	Featured = 'Featured',
	SearchText = 'SearchText',
	Tag = 'Tag',
	Target = 'Target',
}

export interface IQueryOptions {
	text?: string;
	exclude?: string[];
	pageSize?: number;
	sortBy?: SortBy;
	sortOrder?: SortOrder;
	source?: string;
	includePreRelease?: boolean;
	productVersion?: IProductVersion;
}

export const enum StatisticType {
	Install = 'install',
	Uninstall = 'uninstall'
}

export interface IDeprecationInfo {
	readonly disallowInstall?: boolean;
	readonly extension?: {
		readonly id: string;
		readonly displayName: string;
		readonly autoMigrate?: { readonly storage: boolean };
		readonly preRelease?: boolean;
	};
	readonly settings?: readonly string[];
	readonly additionalInfo?: string;
}

export interface ISearchPrefferedResults {
	readonly query?: string;
	readonly preferredResults?: string[];
}

export type MaliciousExtensionInfo = {
	readonly extensionOrPublisher: IExtensionIdentifier | string;
	readonly learnMoreLink?: string;
};

export interface IExtensionsControlManifest {
	readonly malicious: ReadonlyArray<MaliciousExtensionInfo>;
	readonly deprecated: IStringDictionary<IDeprecationInfo>;
	readonly search: ISearchPrefferedResults[];
	readonly autoUpdate?: IStringDictionary<string>;
}

export const enum InstallOperation {
	None = 1,
	Install,
	Update,
	Migrate,
}

export interface ITranslation {
	contents: { [key: string]: {} };
}

export interface IExtensionInfo extends IExtensionIdentifier {
	version?: string;
	preRelease?: boolean;
	hasPreRelease?: boolean;
}

export interface IExtensionQueryOptions {
	targetPlatform?: TargetPlatform;
	productVersion?: IProductVersion;
	compatible?: boolean;
	queryAllVersions?: boolean;
	source?: string;
}

export interface IExtensionGalleryCapabilities {
	readonly query: {
		readonly sortBy: readonly SortBy[];
		readonly filters: readonly FilterType[];
	};
	readonly allRepositorySigned: boolean;
}

export const IExtensionGalleryService = createDecorator<IExtensionGalleryService>('extensionGalleryService');

/**
 * Service to interact with the Visual Studio Code Marketplace to get extensions.
 * @throws Error if the Marketplace is not enabled or not reachable.
 */
export interface IExtensionGalleryService {
	readonly _serviceBrand: undefined;
	isEnabled(): boolean;
	query(options: IQueryOptions, token: CancellationToken): Promise<IPager<IGalleryExtension>>;
	getExtensions(extensionInfos: ReadonlyArray<IExtensionInfo>, token: CancellationToken): Promise<IGalleryExtension[]>;
	getExtensions(extensionInfos: ReadonlyArray<IExtensionInfo>, options: IExtensionQueryOptions, token: CancellationToken): Promise<IGalleryExtension[]>;
	isExtensionCompatible(extension: IGalleryExtension, includePreRelease: boolean, targetPlatform: TargetPlatform, productVersion?: IProductVersion): Promise<boolean>;
	getCompatibleExtension(extension: IGalleryExtension, includePreRelease: boolean, targetPlatform: TargetPlatform, productVersion?: IProductVersion): Promise<IGalleryExtension | null>;
	getAllCompatibleVersions(extensionIdentifier: IExtensionIdentifier, includePreRelease: boolean, targetPlatform: TargetPlatform): Promise<IGalleryExtensionVersion[]>;
	getAllVersions(extensionIdentifier: IExtensionIdentifier): Promise<IGalleryExtensionVersion[]>;
	download(extension: IGalleryExtension, location: URI, operation: InstallOperation): Promise<void>;
	downloadSignatureArchive(extension: IGalleryExtension, location: URI): Promise<void>;
	reportStatistic(publisher: string, name: string, version: string, type: StatisticType): Promise<void>;
	getReadme(extension: IGalleryExtension, token: CancellationToken): Promise<string>;
	getManifest(extension: IGalleryExtension, token: CancellationToken): Promise<IExtensionManifest | null>;
	getChangelog(extension: IGalleryExtension, token: CancellationToken): Promise<string>;
	getCoreTranslation(extension: IGalleryExtension, languageId: string): Promise<ITranslation | null>;
	getExtensionsControlManifest(): Promise<IExtensionsControlManifest>;
}

export interface InstallExtensionEvent {
	readonly identifier: IExtensionIdentifier;
	readonly source: URI | IGalleryExtension;
	readonly profileLocation: URI;
	readonly applicationScoped?: boolean;
	readonly workspaceScoped?: boolean;
}

export interface InstallExtensionResult {
	readonly identifier: IExtensionIdentifier;
	readonly operation: InstallOperation;
	readonly source?: URI | IGalleryExtension;
	readonly local?: ILocalExtension;
	readonly error?: Error;
	readonly context?: IStringDictionary<unknown>;
	readonly profileLocation: URI;
	readonly applicationScoped?: boolean;
	readonly workspaceScoped?: boolean;
}

export interface UninstallExtensionEvent {
	readonly identifier: IExtensionIdentifier;
	readonly profileLocation: URI;
	readonly applicationScoped?: boolean;
	readonly workspaceScoped?: boolean;
}

export interface DidUninstallExtensionEvent {
	readonly identifier: IExtensionIdentifier;
	readonly error?: string;
	readonly profileLocation: URI;
	readonly applicationScoped?: boolean;
	readonly workspaceScoped?: boolean;
}

export interface DidUpdateExtensionMetadata {
	readonly profileLocation: URI;
	readonly local: ILocalExtension;
}

export const enum ExtensionGalleryErrorCode {
	Timeout = 'Timeout',
	Cancelled = 'Cancelled',
	ClientError = 'ClientError',
	ServerError = 'ServerError',
	Failed = 'Failed',
	DownloadFailedWriting = 'DownloadFailedWriting',
	Offline = 'Offline',
}

export class ExtensionGalleryError extends Error {
	constructor(message: string, readonly code: ExtensionGalleryErrorCode) {
		super(message);
		this.name = code;
	}
}

export const enum ExtensionManagementErrorCode {
	NotFound = 'NotFound',
	Unsupported = 'Unsupported',
	Deprecated = 'Deprecated',
	Malicious = 'Malicious',
	Incompatible = 'Incompatible',
	IncompatibleApi = 'IncompatibleApi',
	IncompatibleTargetPlatform = 'IncompatibleTargetPlatform',
	ReleaseVersionNotFound = 'ReleaseVersionNotFound',
	Invalid = 'Invalid',
	Download = 'Download',
	DownloadSignature = 'DownloadSignature',
	DownloadFailedWriting = ExtensionGalleryErrorCode.DownloadFailedWriting,
	UpdateMetadata = 'UpdateMetadata',
	Extract = 'Extract',
	Scanning = 'Scanning',
	ScanningExtension = 'ScanningExtension',
	ReadRemoved = 'ReadRemoved',
	UnsetRemoved = 'UnsetRemoved',
	Delete = 'Delete',
	Rename = 'Rename',
	IntializeDefaultProfile = 'IntializeDefaultProfile',
	AddToProfile = 'AddToProfile',
	InstalledExtensionNotFound = 'InstalledExtensionNotFound',
	PostInstall = 'PostInstall',
	CorruptZip = 'CorruptZip',
	IncompleteZip = 'IncompleteZip',
	PackageNotSigned = 'PackageNotSigned',
	SignatureVerificationInternal = 'SignatureVerificationInternal',
	SignatureVerificationFailed = 'SignatureVerificationFailed',
	NotAllowed = 'NotAllowed',
	Gallery = 'Gallery',
	Cancelled = 'Cancelled',
	Unknown = 'Unknown',
	Internal = 'Internal',
}

export enum ExtensionSignatureVerificationCode {
	'NotSigned' = 'NotSigned',
	'Success' = 'Success',
	'RequiredArgumentMissing' = 'RequiredArgumentMissing', // A required argument is missing.
	'InvalidArgument' = 'InvalidArgument', // An argument is invalid.
	'PackageIsUnreadable' = 'PackageIsUnreadable', // The extension package is unreadable.
	'UnhandledException' = 'UnhandledException', // An unhandled exception occurred.
	'SignatureManifestIsMissing' = 'SignatureManifestIsMissing', // The extension is missing a signature manifest file (.signature.manifest).
	'SignatureManifestIsUnreadable' = 'SignatureManifestIsUnreadable', // The signature manifest is unreadable.
	'SignatureIsMissing' = 'SignatureIsMissing', // The extension is missing a signature file (.signature.p7s).
	'SignatureIsUnreadable' = 'SignatureIsUnreadable', // The signature is unreadable.
	'CertificateIsUnreadable' = 'CertificateIsUnreadable', // The certificate is unreadable.
	'SignatureArchiveIsUnreadable' = 'SignatureArchiveIsUnreadable',
	'FileAlreadyExists' = 'FileAlreadyExists', // The output file already exists.
	'SignatureArchiveIsInvalidZip' = 'SignatureArchiveIsInvalidZip',
	'SignatureArchiveHasSameSignatureFile' = 'SignatureArchiveHasSameSignatureFile', // The signature archive has the same signature file.
	'PackageIntegrityCheckFailed' = 'PackageIntegrityCheckFailed', // The package integrity check failed.
	'SignatureIsInvalid' = 'SignatureIsInvalid', // The extension has an invalid signature file (.signature.p7s).
	'SignatureManifestIsInvalid' = 'SignatureManifestIsInvalid', // The extension has an invalid signature manifest file (.signature.manifest).
	'SignatureIntegrityCheckFailed' = 'SignatureIntegrityCheckFailed', // The extension's signature integrity check failed.  Extension integrity is suspect.
	'EntryIsMissing' = 'EntryIsMissing', // An entry referenced in the signature manifest was not found in the extension.
	'EntryIsTampered' = 'EntryIsTampered', // The integrity check for an entry referenced in the signature manifest failed.
	'Untrusted' = 'Untrusted', // An X.509 certificate in the extension signature is untrusted.
	'CertificateRevoked' = 'CertificateRevoked', // An X.509 certificate in the extension signature has been revoked.
	'SignatureIsNotValid' = 'SignatureIsNotValid', // The extension signature is invalid.
	'UnknownError' = 'UnknownError', // An unknown error occurred.
	'PackageIsInvalidZip' = 'PackageIsInvalidZip', // The extension package is not valid ZIP format.
	'SignatureArchiveHasTooManyEntries' = 'SignatureArchiveHasTooManyEntries', // The signature archive has too many entries.
}

export class ExtensionManagementError extends Error {
	constructor(message: string, readonly code: ExtensionManagementErrorCode) {
		super(message);
		this.name = code;
	}
}

export interface InstallExtensionSummary {
	failed: {
		id: string;
		installOptions: InstallOptions;
	}[];
}

export type InstallOptions = {
	isBuiltin?: boolean;
	isWorkspaceScoped?: boolean;
	isMachineScoped?: boolean;
	isApplicationScoped?: boolean;
	pinned?: boolean;
	donotIncludePackAndDependencies?: boolean;
	installGivenVersion?: boolean;
	preRelease?: boolean;
	installPreReleaseVersion?: boolean;
	donotVerifySignature?: boolean;
	operation?: InstallOperation;
	profileLocation?: URI;
	productVersion?: IProductVersion;
	keepExisting?: boolean;
	downloadExtensionsLocally?: boolean;
	/**
	 * Context passed through to InstallExtensionResult
	 */
	context?: IStringDictionary<unknown>;
};

export type UninstallOptions = {
	readonly profileLocation?: URI;
	readonly donotIncludePack?: boolean;
	readonly donotCheckDependents?: boolean;
	readonly versionOnly?: boolean;
	readonly remove?: boolean;
};

export interface IExtensionManagementParticipant {
	postInstall(local: ILocalExtension, source: URI | IGalleryExtension, options: InstallOptions, token: CancellationToken): Promise<void>;
	postUninstall(local: ILocalExtension, options: UninstallOptions, token: CancellationToken): Promise<void>;
}

export type InstallExtensionInfo = { readonly extension: IGalleryExtension; readonly options: InstallOptions };
export type UninstallExtensionInfo = { readonly extension: ILocalExtension; readonly options?: UninstallOptions };

export const IExtensionManagementService = createDecorator<IExtensionManagementService>('extensionManagementService');
export interface IExtensionManagementService {
	readonly _serviceBrand: undefined;

	readonly preferPreReleases: boolean;

	onInstallExtension: Event<InstallExtensionEvent>;
	onDidInstallExtensions: Event<readonly InstallExtensionResult[]>;
	onUninstallExtension: Event<UninstallExtensionEvent>;
	onDidUninstallExtension: Event<DidUninstallExtensionEvent>;
	onDidUpdateExtensionMetadata: Event<DidUpdateExtensionMetadata>;

	zip(extension: ILocalExtension): Promise<URI>;
	getManifest(vsix: URI): Promise<IExtensionManifest>;
	install(vsix: URI, options?: InstallOptions): Promise<ILocalExtension>;
	canInstall(extension: IGalleryExtension): Promise<true | IMarkdownString>;
	installFromGallery(extension: IGalleryExtension, options?: InstallOptions): Promise<ILocalExtension>;
	installGalleryExtensions(extensions: InstallExtensionInfo[]): Promise<InstallExtensionResult[]>;
	installFromLocation(location: URI, profileLocation: URI): Promise<ILocalExtension>;
	installExtensionsFromProfile(extensions: IExtensionIdentifier[], fromProfileLocation: URI, toProfileLocation: URI): Promise<ILocalExtension[]>;
	uninstall(extension: ILocalExtension, options?: UninstallOptions): Promise<void>;
	uninstallExtensions(extensions: UninstallExtensionInfo[]): Promise<void>;
	toggleApplicationScope(extension: ILocalExtension, fromProfileLocation: URI): Promise<ILocalExtension>;
	getInstalled(type?: ExtensionType, profileLocation?: URI, productVersion?: IProductVersion, language?: string): Promise<ILocalExtension[]>;
	getExtensionsControlManifest(): Promise<IExtensionsControlManifest>;
	copyExtensions(fromProfileLocation: URI, toProfileLocation: URI): Promise<void>;
	updateMetadata(local: ILocalExtension, metadata: Partial<Metadata>, profileLocation: URI): Promise<ILocalExtension>;
	resetPinnedStateForAllUserExtensions(pinned: boolean): Promise<void>;

	download(extension: IGalleryExtension, operation: InstallOperation, donotVerifySignature: boolean): Promise<URI>;

	registerParticipant(pariticipant: IExtensionManagementParticipant): void;
	getTargetPlatform(): Promise<TargetPlatform>;

	cleanUp(): Promise<void>;
}

export const DISABLED_EXTENSIONS_STORAGE_PATH = 'extensionsIdentifiers/disabled';
export const ENABLED_EXTENSIONS_STORAGE_PATH = 'extensionsIdentifiers/enabled';
export const IGlobalExtensionEnablementService = createDecorator<IGlobalExtensionEnablementService>('IGlobalExtensionEnablementService');

export interface IGlobalExtensionEnablementService {
	readonly _serviceBrand: undefined;
	readonly onDidChangeEnablement: Event<{ readonly extensions: IExtensionIdentifier[]; readonly source?: string }>;

	getDisabledExtensions(): IExtensionIdentifier[];
	enableExtension(extension: IExtensionIdentifier, source?: string): Promise<boolean>;
	disableExtension(extension: IExtensionIdentifier, source?: string): Promise<boolean>;

}

export type IConfigBasedExtensionTip = {
	readonly extensionId: string;
	readonly extensionName: string;
	readonly isExtensionPack: boolean;
	readonly configName: string;
	readonly important: boolean;
	readonly whenNotInstalled?: string[];
};

export type IExecutableBasedExtensionTip = {
	readonly extensionId: string;
	readonly extensionName: string;
	readonly isExtensionPack: boolean;
	readonly exeName: string;
	readonly exeFriendlyName: string;
	readonly windowsPath?: string;
	readonly whenNotInstalled?: string[];
};

export const IExtensionTipsService = createDecorator<IExtensionTipsService>('IExtensionTipsService');
export interface IExtensionTipsService {
	readonly _serviceBrand: undefined;

	getConfigBasedTips(folder: URI): Promise<IConfigBasedExtensionTip[]>;
	getImportantExecutableBasedTips(): Promise<IExecutableBasedExtensionTip[]>;
	getOtherExecutableBasedTips(): Promise<IExecutableBasedExtensionTip[]>;
}

export type AllowedExtensionsConfigValueType = IStringDictionary<boolean | string | string[]>;

export const IAllowedExtensionsService = createDecorator<IAllowedExtensionsService>('IAllowedExtensionsService');
export interface IAllowedExtensionsService {
	readonly _serviceBrand: undefined;

	readonly allowedExtensionsConfigValue: AllowedExtensionsConfigValueType | undefined;
	readonly onDidChangeAllowedExtensionsConfigValue: Event<void>;

	isAllowed(extension: IGalleryExtension | IExtension): true | IMarkdownString;
	isAllowed(extension: { id: string; publisherDisplayName: string | undefined; version?: string; prerelease?: boolean; targetPlatform?: TargetPlatform }): true | IMarkdownString;
}

export async function computeSize(location: URI, fileService: IFileService): Promise<number> {
	let stat: IFileStat;
	try {
		stat = await fileService.resolve(location);
	} catch (e) {
		if ((<FileOperationError>e).fileOperationResult === FileOperationResult.FILE_NOT_FOUND) {
			return 0;
		}
		throw e;
	}
	if (stat.children) {
		const sizes = await Promise.all(stat.children.map(c => computeSize(c.resource, fileService)));
		return sizes.reduce((r, s) => r + s, 0);
	}
	return stat.size ?? 0;
}

export const ExtensionsLocalizedLabel = localize2('extensions', "Extensions");
export const PreferencesLocalizedLabel = localize2('preferences', 'Preferences');
export const AllowedExtensionsConfigKey = 'extensions.allowed';
export const VerifyExtensionSignatureConfigKey = 'extensions.verifySignature';
export const ExtensionRequestsTimeoutConfigKey = 'extensions.requestTimeout';

Registry.as<IConfigurationRegistry>(Extensions.Configuration)
	.registerConfiguration({
		id: 'extensions',
		order: 30,
		title: localize('extensionsConfigurationTitle', "Extensions"),
		type: 'object',
		properties: {
			[AllowedExtensionsConfigKey]: {
				// Note: Type is set only to object because to support policies generation during build time, where single type is expected.
				type: 'object',
				markdownDescription: localize('extensions.allowed', "Specify a list of extensions that are allowed to use. This helps maintain a secure and consistent development environment by restricting the use of unauthorized extensions. For more information on how to configure this setting, please visit the [Configure Allowed Extensions](https://code.visualstudio.com/docs/setup/enterprise#_configure-allowed-extensions) section."),
				default: '*',
				defaultSnippets: [{
					body: {},
					description: localize('extensions.allowed.none', "No extensions are allowed."),
				}, {
					body: {
						'*': true
					},
					description: localize('extensions.allowed.all', "All extensions are allowed."),
				}],
				scope: ConfigurationScope.APPLICATION,
				policy: {
					name: 'AllowedExtensions',
					category: PolicyCategory.Extensions,
					minimumVersion: '1.96',
					localization: {
						description: {
							key: 'extensions.allowed.policy',
							value: localize('extensions.allowed.policy', "Specify a list of extensions that are allowed to use. This helps maintain a secure and consistent development environment by restricting the use of unauthorized extensions. More information: https://code.visualstudio.com/docs/setup/enterprise#_configure-allowed-extensions"),
						}
					}
				},
				additionalProperties: false,
				patternProperties: {
					'([a-z0-9A-Z][a-z0-9-A-Z]*)\\.([a-z0-9A-Z][a-z0-9-A-Z]*)$': {
						anyOf: [
							{
								type: ['boolean', 'string'],
								enum: [true, false, 'stable'],
								description: localize('extensions.allow.description', "Allow or disallow the extension."),
								enumDescriptions: [
									localize('extensions.allowed.enable.desc', "Extension is allowed."),
									localize('extensions.allowed.disable.desc', "Extension is not allowed."),
									localize('extensions.allowed.disable.stable.desc', "Allow only stable versions of the extension."),
								],
							},
							{
								type: 'array',
								items: {
									type: 'string',
								},
								description: localize('extensions.allow.version.description', "Allow or disallow specific versions of the extension. To specifcy a platform specific version, use the format `platform@1.2.3`, e.g. `win32-x64@1.2.3`. Supported platforms are `win32-x64`, `win32-arm64`, `linux-x64`, `linux-arm64`, `linux-armhf`, `alpine-x64`, `alpine-arm64`, `darwin-x64`, `darwin-arm64`"),
							},
						]
					},
					'([a-z0-9A-Z][a-z0-9-A-Z]*)$': {
						type: ['boolean', 'string'],
						enum: [true, false, 'stable'],
						description: localize('extension.publisher.allow.description', "Allow or disallow all extensions from the publisher."),
						enumDescriptions: [
							localize('extensions.publisher.allowed.enable.desc', "All extensions from the publisher are allowed."),
							localize('extensions.publisher.allowed.disable.desc', "All extensions from the publisher are not allowed."),
							localize('extensions.publisher.allowed.disable.stable.desc', "Allow only stable versions of the extensions from the publisher."),
						],
					},
					'\\*': {
						type: 'boolean',
						enum: [true, false],
						description: localize('extensions.allow.all.description', "Allow or disallow all extensions."),
						enumDescriptions: [
							localize('extensions.allow.all.enable', "Allow all extensions."),
							localize('extensions.allow.all.disable', "Disallow all extensions.")
						],
					}
				}
			}
		}
	});

export function shouldRequireRepositorySignatureFor(isPrivate: boolean, galleryManifest: IExtensionGalleryManifest | null): boolean {
	if (isPrivate) {
		return galleryManifest?.capabilities.signing?.allPrivateRepositorySigned === true;
	}
	return galleryManifest?.capabilities.signing?.allPublicRepositorySigned === true;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/common/extensionManagementCLI.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/common/extensionManagementCLI.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { getErrorMessage, isCancellationError } from '../../../base/common/errors.js';
import { Schemas } from '../../../base/common/network.js';
import { basename } from '../../../base/common/resources.js';
import { gt } from '../../../base/common/semver/semver.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { EXTENSION_IDENTIFIER_REGEX, IExtensionGalleryService, IExtensionInfo, IExtensionManagementService, IGalleryExtension, ILocalExtension, InstallOptions, InstallExtensionInfo, InstallOperation } from './extensionManagement.js';
import { areSameExtensions, getExtensionId, getGalleryExtensionId, getIdAndVersion } from './extensionManagementUtil.js';
import { ExtensionType, EXTENSION_CATEGORIES, IExtensionManifest } from '../../extensions/common/extensions.js';
import { ILogger } from '../../log/common/log.js';


const notFound = (id: string) => localize('notFound', "Extension '{0}' not found.", id);
const useId = localize('useId', "Make sure you use the full extension ID, including the publisher, e.g.: {0}", 'ms-dotnettools.csharp');

type InstallVSIXInfo = { vsix: URI; installOptions: InstallOptions };
type InstallGalleryExtensionInfo = { id: string; version?: string; installOptions: InstallOptions };

export class ExtensionManagementCLI {

	constructor(
		protected readonly logger: ILogger,
		@IExtensionManagementService private readonly extensionManagementService: IExtensionManagementService,
		@IExtensionGalleryService private readonly extensionGalleryService: IExtensionGalleryService,
	) { }

	protected get location(): string | undefined {
		return undefined;
	}

	public async listExtensions(showVersions: boolean, category?: string, profileLocation?: URI): Promise<void> {
		let extensions = await this.extensionManagementService.getInstalled(ExtensionType.User, profileLocation);
		const categories = EXTENSION_CATEGORIES.map(c => c.toLowerCase());
		if (category && category !== '') {
			if (categories.indexOf(category.toLowerCase()) < 0) {
				this.logger.info('Invalid category please enter a valid category. To list valid categories run --category without a category specified');
				return;
			}
			extensions = extensions.filter(e => {
				if (e.manifest.categories) {
					const lowerCaseCategories: string[] = e.manifest.categories.map(c => c.toLowerCase());
					return lowerCaseCategories.indexOf(category.toLowerCase()) > -1;
				}
				return false;
			});
		} else if (category === '') {
			this.logger.info('Possible Categories: ');
			categories.forEach(category => {
				this.logger.info(category);
			});
			return;
		}
		if (this.location) {
			this.logger.info(localize('listFromLocation', "Extensions installed on {0}:", this.location));
		}

		extensions = extensions.sort((e1, e2) => e1.identifier.id.localeCompare(e2.identifier.id));
		let lastId: string | undefined = undefined;
		for (const extension of extensions) {
			if (lastId !== extension.identifier.id) {
				lastId = extension.identifier.id;
				this.logger.info(showVersions ? `${lastId}@${extension.manifest.version}` : lastId);
			}
		}
	}

	public async installExtensions(extensions: (string | URI)[], builtinExtensions: (string | URI)[], installOptions: InstallOptions, force: boolean): Promise<void> {
		const failed: string[] = [];

		try {
			if (extensions.length) {
				this.logger.info(this.location ? localize('installingExtensionsOnLocation', "Installing extensions on {0}...", this.location) : localize('installingExtensions', "Installing extensions..."));
			}

			const installVSIXInfos: InstallVSIXInfo[] = [];
			const installExtensionInfos: InstallGalleryExtensionInfo[] = [];
			const addInstallExtensionInfo = (id: string, version: string | undefined, isBuiltin: boolean) => {
				installExtensionInfos.push({ id, version: version !== 'prerelease' ? version : undefined, installOptions: { ...installOptions, isBuiltin, installPreReleaseVersion: version === 'prerelease' || installOptions.installPreReleaseVersion } });
			};
			for (const extension of extensions) {
				if (extension instanceof URI) {
					installVSIXInfos.push({ vsix: extension, installOptions });
				} else {
					const [id, version] = getIdAndVersion(extension);
					addInstallExtensionInfo(id, version, false);
				}
			}
			for (const extension of builtinExtensions) {
				if (extension instanceof URI) {
					installVSIXInfos.push({ vsix: extension, installOptions: { ...installOptions, isBuiltin: true, donotIncludePackAndDependencies: true } });
				} else {
					const [id, version] = getIdAndVersion(extension);
					addInstallExtensionInfo(id, version, true);
				}
			}

			const installed = await this.extensionManagementService.getInstalled(undefined, installOptions.profileLocation);

			if (installVSIXInfos.length) {
				await Promise.all(installVSIXInfos.map(async ({ vsix, installOptions }) => {
					try {
						await this.installVSIX(vsix, installOptions, force, installed);
					} catch (err) {
						this.logger.error(err);
						failed.push(vsix.toString());
					}
				}));
			}

			if (installExtensionInfos.length) {
				const failedGalleryExtensions = await this.installGalleryExtensions(installExtensionInfos, installed, force);
				failed.push(...failedGalleryExtensions);
			}
		} catch (error) {
			this.logger.error(localize('error while installing extensions', "Error while installing extensions: {0}", getErrorMessage(error)));
			throw error;
		}

		if (failed.length) {
			throw new Error(localize('installation failed', "Failed Installing Extensions: {0}", failed.join(', ')));
		}
	}

	public async updateExtensions(profileLocation?: URI): Promise<void> {
		const installedExtensions = await this.extensionManagementService.getInstalled(ExtensionType.User, profileLocation);

		const installedExtensionsQuery: IExtensionInfo[] = [];
		for (const extension of installedExtensions) {
			if (!!extension.identifier.uuid) { // No need to check new version for an unpublished extension
				installedExtensionsQuery.push({ ...extension.identifier, preRelease: extension.preRelease });
			}
		}

		this.logger.trace(localize({ key: 'updateExtensionsQuery', comment: ['Placeholder is for the count of extensions'] }, "Fetching latest versions for {0} extensions", installedExtensionsQuery.length));
		const availableVersions = await this.extensionGalleryService.getExtensions(installedExtensionsQuery, { compatible: true }, CancellationToken.None);

		const extensionsToUpdate: InstallExtensionInfo[] = [];
		for (const newVersion of availableVersions) {
			for (const oldVersion of installedExtensions) {
				if (areSameExtensions(oldVersion.identifier, newVersion.identifier) && gt(newVersion.version, oldVersion.manifest.version)) {
					extensionsToUpdate.push({
						extension: newVersion,
						options: { operation: InstallOperation.Update, installPreReleaseVersion: oldVersion.preRelease, profileLocation, isApplicationScoped: oldVersion.isApplicationScoped }
					});
				}
			}
		}

		if (!extensionsToUpdate.length) {
			this.logger.info(localize('updateExtensionsNoExtensions', "No extension to update"));
			return;
		}

		this.logger.info(localize('updateExtensionsNewVersionsAvailable', "Updating extensions: {0}", extensionsToUpdate.map(ext => ext.extension.identifier.id).join(', ')));
		const installationResult = await this.extensionManagementService.installGalleryExtensions(extensionsToUpdate);

		for (const extensionResult of installationResult) {
			if (extensionResult.error) {
				this.logger.error(localize('errorUpdatingExtension', "Error while updating extension {0}: {1}", extensionResult.identifier.id, getErrorMessage(extensionResult.error)));
			} else {
				this.logger.info(localize('successUpdate', "Extension '{0}' v{1} was successfully updated.", extensionResult.identifier.id, extensionResult.local?.manifest.version));
			}
		}
	}

	private async installGalleryExtensions(installExtensionInfos: InstallGalleryExtensionInfo[], installed: ILocalExtension[], force: boolean): Promise<string[]> {
		installExtensionInfos = installExtensionInfos.filter(installExtensionInfo => {
			const { id, version, installOptions } = installExtensionInfo;
			const installedExtension = installed.find(i => areSameExtensions(i.identifier, { id }));
			if (installedExtension) {
				if (!force && (!version || (version === 'prerelease' && installedExtension.preRelease))) {
					this.logger.info(localize('alreadyInstalled-checkAndUpdate', "Extension '{0}' v{1} is already installed. Use '--force' option to update to latest version or provide '@<version>' to install a specific version, for example: '{2}@1.2.3'.", id, installedExtension.manifest.version, id));
					return false;
				}
				if (version && installedExtension.manifest.version === version) {
					this.logger.info(localize('alreadyInstalled', "Extension '{0}' is already installed.", `${id}@${version}`));
					return false;
				}
				if (installedExtension.preRelease && version !== 'prerelease') {
					installOptions.preRelease = false;
				}
			}
			return true;
		});

		if (!installExtensionInfos.length) {
			return [];
		}

		const failed: string[] = [];
		const extensionsToInstall: InstallExtensionInfo[] = [];
		const galleryExtensions = await this.getGalleryExtensions(installExtensionInfos);
		await Promise.all(installExtensionInfos.map(async ({ id, version, installOptions }) => {
			const gallery = galleryExtensions.get(id.toLowerCase());
			if (!gallery) {
				this.logger.error(`${notFound(version ? `${id}@${version}` : id)}\n${useId}`);
				failed.push(id);
				return;
			}
			try {
				const manifest = await this.extensionGalleryService.getManifest(gallery, CancellationToken.None);
				if (manifest && !this.validateExtensionKind(manifest)) {
					return;
				}
			} catch (err) {
				this.logger.error(err.message || err.stack || err);
				failed.push(id);
				return;
			}
			const installedExtension = installed.find(e => areSameExtensions(e.identifier, gallery.identifier));
			if (installedExtension) {
				if (gallery.version === installedExtension.manifest.version) {
					this.logger.info(localize('alreadyInstalled', "Extension '{0}' is already installed.", version ? `${id}@${version}` : id));
					return;
				}
				this.logger.info(localize('updateMessage', "Updating the extension '{0}' to the version {1}", id, gallery.version));
			}
			if (installOptions.isBuiltin) {
				this.logger.info(version ? localize('installing builtin with version', "Installing builtin extension '{0}' v{1}...", id, version) : localize('installing builtin ', "Installing builtin extension '{0}'...", id));
			} else {
				this.logger.info(version ? localize('installing with version', "Installing extension '{0}' v{1}...", id, version) : localize('installing', "Installing extension '{0}'...", id));
			}
			extensionsToInstall.push({
				extension: gallery,
				options: { ...installOptions, installGivenVersion: !!version, isApplicationScoped: installOptions.isApplicationScoped || installedExtension?.isApplicationScoped },
			});
		}));

		if (extensionsToInstall.length) {
			const installationResult = await this.extensionManagementService.installGalleryExtensions(extensionsToInstall);
			for (const extensionResult of installationResult) {
				if (extensionResult.error) {
					this.logger.error(localize('errorInstallingExtension', "Error while installing extension {0}: {1}", extensionResult.identifier.id, getErrorMessage(extensionResult.error)));
					failed.push(extensionResult.identifier.id);
				} else {
					this.logger.info(localize('successInstall', "Extension '{0}' v{1} was successfully installed.", extensionResult.identifier.id, extensionResult.local?.manifest.version));
				}
			}
		}

		return failed;
	}

	private async installVSIX(vsix: URI, installOptions: InstallOptions, force: boolean, installedExtensions: ILocalExtension[]): Promise<void> {

		const manifest = await this.extensionManagementService.getManifest(vsix);
		if (!manifest) {
			throw new Error('Invalid vsix');
		}

		const valid = await this.validateVSIX(manifest, force, installOptions.profileLocation, installedExtensions);
		if (valid) {
			try {
				await this.extensionManagementService.install(vsix, { ...installOptions, installGivenVersion: true });
				this.logger.info(localize('successVsixInstall', "Extension '{0}' was successfully installed.", basename(vsix)));
			} catch (error) {
				if (isCancellationError(error)) {
					this.logger.info(localize('cancelVsixInstall', "Cancelled installing extension '{0}'.", basename(vsix)));
				} else {
					throw error;
				}
			}
		}
	}

	private async getGalleryExtensions(extensions: InstallGalleryExtensionInfo[]): Promise<Map<string, IGalleryExtension>> {
		const galleryExtensions = new Map<string, IGalleryExtension>();
		const preRelease = extensions.some(e => e.installOptions.installPreReleaseVersion);
		const targetPlatform = await this.extensionManagementService.getTargetPlatform();
		const extensionInfos: IExtensionInfo[] = [];
		for (const extension of extensions) {
			if (EXTENSION_IDENTIFIER_REGEX.test(extension.id)) {
				extensionInfos.push({ ...extension, preRelease });
			}
		}
		if (extensionInfos.length) {
			const result = await this.extensionGalleryService.getExtensions(extensionInfos, { targetPlatform }, CancellationToken.None);
			for (const extension of result) {
				galleryExtensions.set(extension.identifier.id.toLowerCase(), extension);
			}
		}
		return galleryExtensions;
	}

	protected validateExtensionKind(_manifest: IExtensionManifest): boolean {
		return true;
	}

	private async validateVSIX(manifest: IExtensionManifest, force: boolean, profileLocation: URI | undefined, installedExtensions: ILocalExtension[]): Promise<boolean> {
		if (!force) {
			const extensionIdentifier = { id: getGalleryExtensionId(manifest.publisher, manifest.name) };
			const newer = installedExtensions.find(local => areSameExtensions(extensionIdentifier, local.identifier) && gt(local.manifest.version, manifest.version));
			if (newer) {
				this.logger.info(localize('forceDowngrade', "A newer version of extension '{0}' v{1} is already installed. Use '--force' option to downgrade to older version.", newer.identifier.id, newer.manifest.version, manifest.version));
				return false;
			}
		}

		return this.validateExtensionKind(manifest);
	}

	public async uninstallExtensions(extensions: (string | URI)[], force: boolean, profileLocation?: URI): Promise<void> {
		const getId = async (extensionDescription: string | URI): Promise<string> => {
			if (extensionDescription instanceof URI) {
				const manifest = await this.extensionManagementService.getManifest(extensionDescription);
				return getExtensionId(manifest.publisher, manifest.name);
			}
			return extensionDescription;
		};

		const uninstalledExtensions: ILocalExtension[] = [];
		for (const extension of extensions) {
			const id = await getId(extension);
			const installed = await this.extensionManagementService.getInstalled(undefined, profileLocation);
			const extensionsToUninstall = installed.filter(e => areSameExtensions(e.identifier, { id }));
			if (!extensionsToUninstall.length) {
				throw new Error(`${this.notInstalled(id)}\n${useId}`);
			}
			if (extensionsToUninstall.some(e => e.type === ExtensionType.System)) {
				this.logger.info(localize('builtin', "Extension '{0}' is a Built-in extension and cannot be uninstalled", id));
				return;
			}
			if (!force && extensionsToUninstall.some(e => e.isBuiltin)) {
				this.logger.info(localize('forceUninstall', "Extension '{0}' is marked as a Built-in extension by user. Please use '--force' option to uninstall it.", id));
				return;
			}
			this.logger.info(localize('uninstalling', "Uninstalling {0}...", id));
			for (const extensionToUninstall of extensionsToUninstall) {
				await this.extensionManagementService.uninstall(extensionToUninstall, { profileLocation });
				uninstalledExtensions.push(extensionToUninstall);
			}

			if (this.location) {
				this.logger.info(localize('successUninstallFromLocation', "Extension '{0}' was successfully uninstalled from {1}!", id, this.location));
			} else {
				this.logger.info(localize('successUninstall', "Extension '{0}' was successfully uninstalled!", id));
			}

		}
	}

	public async locateExtension(extensions: string[]): Promise<void> {
		const installed = await this.extensionManagementService.getInstalled();
		extensions.forEach(e => {
			installed.forEach(i => {
				if (i.identifier.id === e) {
					if (i.location.scheme === Schemas.file) {
						this.logger.info(i.location.fsPath);
						return;
					}
				}
			});
		});
	}

	private notInstalled(id: string) {
		return this.location ? localize('notInstalleddOnLocation', "Extension '{0}' is not installed on {1}.", id, this.location) : localize('notInstalled', "Extension '{0}' is not installed.", id);
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/common/extensionManagementIpc.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/common/extensionManagementIpc.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { cloneAndChange } from '../../../base/common/objects.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { DefaultURITransformer, IURITransformer, transformAndReviveIncomingURIs } from '../../../base/common/uriIpc.js';
import { IChannel, IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import {
	IExtensionIdentifier, IExtensionTipsService, IGalleryExtension, ILocalExtension, IExtensionsControlManifest, InstallOptions,
	UninstallOptions, Metadata, IExtensionManagementService, DidUninstallExtensionEvent, InstallExtensionEvent, InstallExtensionResult,
	UninstallExtensionEvent, InstallOperation, InstallExtensionInfo, IProductVersion, DidUpdateExtensionMetadata, UninstallExtensionInfo,
	IAllowedExtensionsService
} from './extensionManagement.js';
import { ExtensionType, IExtensionManifest, TargetPlatform } from '../../extensions/common/extensions.js';
import { IProductService } from '../../product/common/productService.js';
import { CommontExtensionManagementService } from './abstractExtensionManagementService.js';
import { language } from '../../../base/common/platform.js';
import { RemoteAgentConnectionContext } from '../../remote/common/remoteAgentEnvironment.js';

function transformIncomingURI(uri: UriComponents, transformer: IURITransformer | null): URI;
function transformIncomingURI(uri: UriComponents | undefined, transformer: IURITransformer | null): URI | undefined;
function transformIncomingURI(uri: UriComponents | undefined, transformer: IURITransformer | null): URI | undefined {
	return uri ? URI.revive(transformer ? transformer.transformIncoming(uri) : uri) : undefined;
}

function transformOutgoingURI(uri: URI, transformer: IURITransformer | null): URI {
	return transformer ? transformer.transformOutgoingURI(uri) : uri;
}

function transformIncomingExtension(extension: ILocalExtension, transformer: IURITransformer | null): ILocalExtension {
	transformer = transformer ? transformer : DefaultURITransformer;
	const manifest = extension.manifest;
	const transformed = transformAndReviveIncomingURIs({ ...extension, ...{ manifest: undefined } }, transformer);
	return { ...transformed, ...{ manifest } };
}

function transformIncomingOptions<O extends { profileLocation?: UriComponents }>(options: O | undefined, transformer: IURITransformer | null): O | undefined {
	return options?.profileLocation ? transformAndReviveIncomingURIs(options, transformer ?? DefaultURITransformer) : options;
}

function transformOutgoingExtension(extension: ILocalExtension, transformer: IURITransformer | null): ILocalExtension {
	return transformer ? cloneAndChange(extension, value => value instanceof URI ? transformer.transformOutgoingURI(value) : undefined) : extension;
}

export class ExtensionManagementChannel<TContext = RemoteAgentConnectionContext | string> implements IServerChannel<TContext> {

	readonly onInstallExtension: Event<InstallExtensionEvent>;
	readonly onDidInstallExtensions: Event<readonly InstallExtensionResult[]>;
	readonly onUninstallExtension: Event<UninstallExtensionEvent>;
	readonly onDidUninstallExtension: Event<DidUninstallExtensionEvent>;
	readonly onDidUpdateExtensionMetadata: Event<DidUpdateExtensionMetadata>;

	constructor(private service: IExtensionManagementService, private getUriTransformer: (requestContext: TContext) => IURITransformer | null) {
		this.onInstallExtension = Event.buffer(service.onInstallExtension, true);
		this.onDidInstallExtensions = Event.buffer(service.onDidInstallExtensions, true);
		this.onUninstallExtension = Event.buffer(service.onUninstallExtension, true);
		this.onDidUninstallExtension = Event.buffer(service.onDidUninstallExtension, true);
		this.onDidUpdateExtensionMetadata = Event.buffer(service.onDidUpdateExtensionMetadata, true);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	listen(context: any, event: string): Event<any> {
		const uriTransformer = this.getUriTransformer(context);
		switch (event) {
			case 'onInstallExtension': {
				return Event.map<InstallExtensionEvent, InstallExtensionEvent>(this.onInstallExtension, e => {
					return {
						...e,
						profileLocation: e.profileLocation ? transformOutgoingURI(e.profileLocation, uriTransformer) : e.profileLocation
					};
				});
			}
			case 'onDidInstallExtensions': {
				return Event.map<readonly InstallExtensionResult[], readonly InstallExtensionResult[]>(this.onDidInstallExtensions, results =>
					results.map(i => ({
						...i,
						local: i.local ? transformOutgoingExtension(i.local, uriTransformer) : i.local,
						profileLocation: i.profileLocation ? transformOutgoingURI(i.profileLocation, uriTransformer) : i.profileLocation
					})));
			}
			case 'onUninstallExtension': {
				return Event.map<UninstallExtensionEvent, UninstallExtensionEvent>(this.onUninstallExtension, e => {
					return {
						...e,
						profileLocation: e.profileLocation ? transformOutgoingURI(e.profileLocation, uriTransformer) : e.profileLocation
					};
				});
			}
			case 'onDidUninstallExtension': {
				return Event.map<DidUninstallExtensionEvent, DidUninstallExtensionEvent>(this.onDidUninstallExtension, e => {
					return {
						...e,
						profileLocation: e.profileLocation ? transformOutgoingURI(e.profileLocation, uriTransformer) : e.profileLocation
					};
				});
			}
			case 'onDidUpdateExtensionMetadata': {
				return Event.map<DidUpdateExtensionMetadata, DidUpdateExtensionMetadata>(this.onDidUpdateExtensionMetadata, e => {
					return {
						local: transformOutgoingExtension(e.local, uriTransformer),
						profileLocation: transformOutgoingURI(e.profileLocation, uriTransformer)
					};
				});
			}
		}

		throw new Error('Invalid listen');
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async call(context: any, command: string, args?: any): Promise<any> {
		const uriTransformer: IURITransformer | null = this.getUriTransformer(context);
		switch (command) {
			case 'zip': {
				const extension = transformIncomingExtension(args[0], uriTransformer);
				const uri = await this.service.zip(extension);
				return transformOutgoingURI(uri, uriTransformer);
			}
			case 'install': {
				return this.service.install(transformIncomingURI(args[0], uriTransformer), transformIncomingOptions(args[1], uriTransformer));
			}
			case 'installFromLocation': {
				return this.service.installFromLocation(transformIncomingURI(args[0], uriTransformer), transformIncomingURI(args[1], uriTransformer));
			}
			case 'installExtensionsFromProfile': {
				return this.service.installExtensionsFromProfile(args[0], transformIncomingURI(args[1], uriTransformer), transformIncomingURI(args[2], uriTransformer));
			}
			case 'getManifest': {
				return this.service.getManifest(transformIncomingURI(args[0], uriTransformer));
			}
			case 'getTargetPlatform': {
				return this.service.getTargetPlatform();
			}
			case 'installFromGallery': {
				return this.service.installFromGallery(args[0], transformIncomingOptions(args[1], uriTransformer));
			}
			case 'installGalleryExtensions': {
				const arg: InstallExtensionInfo[] = args[0];
				return this.service.installGalleryExtensions(arg.map(({ extension, options }) => ({ extension, options: transformIncomingOptions(options, uriTransformer) ?? {} })));
			}
			case 'uninstall': {
				return this.service.uninstall(transformIncomingExtension(args[0], uriTransformer), transformIncomingOptions(args[1], uriTransformer));
			}
			case 'uninstallExtensions': {
				const arg: UninstallExtensionInfo[] = args[0];
				return this.service.uninstallExtensions(arg.map(({ extension, options }) => ({ extension: transformIncomingExtension(extension, uriTransformer), options: transformIncomingOptions(options, uriTransformer) })));
			}
			case 'getInstalled': {
				const extensions = await this.service.getInstalled(args[0], transformIncomingURI(args[1], uriTransformer), args[2], args[3]);
				return extensions.map(e => transformOutgoingExtension(e, uriTransformer));
			}
			case 'toggleApplicationScope': {
				const extension = await this.service.toggleApplicationScope(transformIncomingExtension(args[0], uriTransformer), transformIncomingURI(args[1], uriTransformer));
				return transformOutgoingExtension(extension, uriTransformer);
			}
			case 'copyExtensions': {
				return this.service.copyExtensions(transformIncomingURI(args[0], uriTransformer), transformIncomingURI(args[1], uriTransformer));
			}
			case 'updateMetadata': {
				const e = await this.service.updateMetadata(transformIncomingExtension(args[0], uriTransformer), args[1], transformIncomingURI(args[2], uriTransformer));
				return transformOutgoingExtension(e, uriTransformer);
			}
			case 'resetPinnedStateForAllUserExtensions': {
				return this.service.resetPinnedStateForAllUserExtensions(args[0]);
			}
			case 'getExtensionsControlManifest': {
				return this.service.getExtensionsControlManifest();
			}
			case 'download': {
				return this.service.download(args[0], args[1], args[2]);
			}
			case 'cleanUp': {
				return this.service.cleanUp();
			}
		}

		throw new Error('Invalid call');
	}
}

export interface ExtensionEventResult {
	readonly profileLocation: URI;
	readonly local?: ILocalExtension;
	readonly applicationScoped?: boolean;
}

export class ExtensionManagementChannelClient extends CommontExtensionManagementService implements IExtensionManagementService {

	declare readonly _serviceBrand: undefined;

	protected readonly _onInstallExtension = this._register(new Emitter<InstallExtensionEvent>());
	get onInstallExtension() { return this._onInstallExtension.event; }

	protected readonly _onDidInstallExtensions = this._register(new Emitter<readonly InstallExtensionResult[]>());
	get onDidInstallExtensions() { return this._onDidInstallExtensions.event; }

	protected readonly _onUninstallExtension = this._register(new Emitter<UninstallExtensionEvent>());
	get onUninstallExtension() { return this._onUninstallExtension.event; }

	protected readonly _onDidUninstallExtension = this._register(new Emitter<DidUninstallExtensionEvent>());
	get onDidUninstallExtension() { return this._onDidUninstallExtension.event; }

	protected readonly _onDidUpdateExtensionMetadata = this._register(new Emitter<DidUpdateExtensionMetadata>());
	get onDidUpdateExtensionMetadata() { return this._onDidUpdateExtensionMetadata.event; }

	constructor(
		private readonly channel: IChannel,
		productService: IProductService,
		allowedExtensionsService: IAllowedExtensionsService,
	) {
		super(productService, allowedExtensionsService);
		this._register(this.channel.listen<InstallExtensionEvent>('onInstallExtension')(e => this.onInstallExtensionEvent({ ...e, source: this.isUriComponents(e.source) ? URI.revive(e.source) : e.source, profileLocation: URI.revive(e.profileLocation) })));
		this._register(this.channel.listen<readonly InstallExtensionResult[]>('onDidInstallExtensions')(results => this.onDidInstallExtensionsEvent(results.map(e => ({ ...e, local: e.local ? transformIncomingExtension(e.local, null) : e.local, source: this.isUriComponents(e.source) ? URI.revive(e.source) : e.source, profileLocation: URI.revive(e.profileLocation) })))));
		this._register(this.channel.listen<UninstallExtensionEvent>('onUninstallExtension')(e => this.onUninstallExtensionEvent({ ...e, profileLocation: URI.revive(e.profileLocation) })));
		this._register(this.channel.listen<DidUninstallExtensionEvent>('onDidUninstallExtension')(e => this.onDidUninstallExtensionEvent({ ...e, profileLocation: URI.revive(e.profileLocation) })));
		this._register(this.channel.listen<DidUpdateExtensionMetadata>('onDidUpdateExtensionMetadata')(e => this.onDidUpdateExtensionMetadataEvent({ profileLocation: URI.revive(e.profileLocation), local: transformIncomingExtension(e.local, null) })));
	}

	protected onInstallExtensionEvent(event: InstallExtensionEvent): void {
		this._onInstallExtension.fire(event);
	}

	protected onDidInstallExtensionsEvent(results: readonly InstallExtensionResult[]): void {
		this._onDidInstallExtensions.fire(results);
	}

	protected onUninstallExtensionEvent(event: UninstallExtensionEvent): void {
		this._onUninstallExtension.fire(event);
	}

	protected onDidUninstallExtensionEvent(event: DidUninstallExtensionEvent): void {
		this._onDidUninstallExtension.fire(event);
	}

	protected onDidUpdateExtensionMetadataEvent(event: DidUpdateExtensionMetadata): void {
		this._onDidUpdateExtensionMetadata.fire(event);
	}

	private isUriComponents(obj: unknown): obj is UriComponents {
		if (!obj) {
			return false;
		}
		const thing = obj as UriComponents | undefined;
		return typeof thing?.path === 'string' &&
			typeof thing?.scheme === 'string';
	}

	protected _targetPlatformPromise: Promise<TargetPlatform> | undefined;
	getTargetPlatform(): Promise<TargetPlatform> {
		if (!this._targetPlatformPromise) {
			this._targetPlatformPromise = this.channel.call<TargetPlatform>('getTargetPlatform');
		}
		return this._targetPlatformPromise;
	}

	zip(extension: ILocalExtension): Promise<URI> {
		return Promise.resolve(this.channel.call<UriComponents>('zip', [extension]).then(result => URI.revive(result)));
	}

	install(vsix: URI, options?: InstallOptions): Promise<ILocalExtension> {
		return Promise.resolve(this.channel.call<ILocalExtension>('install', [vsix, options])).then(local => transformIncomingExtension(local, null));
	}

	installFromLocation(location: URI, profileLocation: URI): Promise<ILocalExtension> {
		return Promise.resolve(this.channel.call<ILocalExtension>('installFromLocation', [location, profileLocation])).then(local => transformIncomingExtension(local, null));
	}

	async installExtensionsFromProfile(extensions: IExtensionIdentifier[], fromProfileLocation: URI, toProfileLocation: URI): Promise<ILocalExtension[]> {
		const result = await this.channel.call<ILocalExtension[]>('installExtensionsFromProfile', [extensions, fromProfileLocation, toProfileLocation]);
		return result.map(local => transformIncomingExtension(local, null));
	}

	getManifest(vsix: URI): Promise<IExtensionManifest> {
		return Promise.resolve(this.channel.call<IExtensionManifest>('getManifest', [vsix]));
	}

	installFromGallery(extension: IGalleryExtension, installOptions?: InstallOptions): Promise<ILocalExtension> {
		return Promise.resolve(this.channel.call<ILocalExtension>('installFromGallery', [extension, installOptions])).then(local => transformIncomingExtension(local, null));
	}

	async installGalleryExtensions(extensions: InstallExtensionInfo[]): Promise<InstallExtensionResult[]> {
		const results = await this.channel.call<InstallExtensionResult[]>('installGalleryExtensions', [extensions]);
		return results.map(e => ({ ...e, local: e.local ? transformIncomingExtension(e.local, null) : e.local, source: this.isUriComponents(e.source) ? URI.revive(e.source) : e.source, profileLocation: URI.revive(e.profileLocation) }));
	}

	uninstall(extension: ILocalExtension, options?: UninstallOptions): Promise<void> {
		if (extension.isWorkspaceScoped) {
			throw new Error('Cannot uninstall a workspace extension');
		}
		return Promise.resolve(this.channel.call<void>('uninstall', [extension, options]));
	}

	uninstallExtensions(extensions: UninstallExtensionInfo[]): Promise<void> {
		if (extensions.some(e => e.extension.isWorkspaceScoped)) {
			throw new Error('Cannot uninstall a workspace extension');
		}
		return Promise.resolve(this.channel.call<void>('uninstallExtensions', [extensions]));

	}

	getInstalled(type: ExtensionType | null = null, extensionsProfileResource?: URI, productVersion?: IProductVersion): Promise<ILocalExtension[]> {
		return Promise.resolve(this.channel.call<ILocalExtension[]>('getInstalled', [type, extensionsProfileResource, productVersion, language]))
			.then(extensions => extensions.map(extension => transformIncomingExtension(extension, null)));
	}

	updateMetadata(local: ILocalExtension, metadata: Partial<Metadata>, extensionsProfileResource?: URI): Promise<ILocalExtension> {
		return Promise.resolve(this.channel.call<ILocalExtension>('updateMetadata', [local, metadata, extensionsProfileResource]))
			.then(extension => transformIncomingExtension(extension, null));
	}

	resetPinnedStateForAllUserExtensions(pinned: boolean): Promise<void> {
		return this.channel.call<void>('resetPinnedStateForAllUserExtensions', [pinned]);
	}

	toggleApplicationScope(local: ILocalExtension, fromProfileLocation: URI): Promise<ILocalExtension> {
		return this.channel.call<ILocalExtension>('toggleApplicationScope', [local, fromProfileLocation])
			.then(extension => transformIncomingExtension(extension, null));
	}

	copyExtensions(fromProfileLocation: URI, toProfileLocation: URI): Promise<void> {
		return this.channel.call<void>('copyExtensions', [fromProfileLocation, toProfileLocation]);
	}

	getExtensionsControlManifest(): Promise<IExtensionsControlManifest> {
		return Promise.resolve(this.channel.call<IExtensionsControlManifest>('getExtensionsControlManifest'));
	}

	async download(extension: IGalleryExtension, operation: InstallOperation, donotVerifySignature: boolean): Promise<URI> {
		const result = await this.channel.call<UriComponents>('download', [extension, operation, donotVerifySignature]);
		return URI.revive(result);
	}

	async cleanUp(): Promise<void> {
		return this.channel.call('cleanUp');
	}

	registerParticipant() { throw new Error('Not Supported'); }
}

export class ExtensionTipsChannel implements IServerChannel {

	constructor(private service: IExtensionTipsService) {
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	listen(context: any, event: string): Event<any> {
		throw new Error('Invalid listen');
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	call(context: any, command: string, args?: any): Promise<any> {
		switch (command) {
			case 'getConfigBasedTips': return this.service.getConfigBasedTips(URI.revive(args[0]));
			case 'getImportantExecutableBasedTips': return this.service.getImportantExecutableBasedTips();
			case 'getOtherExecutableBasedTips': return this.service.getOtherExecutableBasedTips();
		}

		throw new Error('Invalid call');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/common/extensionManagementUtil.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/common/extensionManagementUtil.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { compareIgnoreCase } from '../../../base/common/strings.js';
import { IExtensionIdentifier, IGalleryExtension, ILocalExtension, MaliciousExtensionInfo, getTargetPlatform } from './extensionManagement.js';
import { ExtensionIdentifier, IExtension, TargetPlatform, UNDEFINED_PUBLISHER } from '../../extensions/common/extensions.js';
import { IFileService } from '../../files/common/files.js';
import { isLinux, platform } from '../../../base/common/platform.js';
import { URI } from '../../../base/common/uri.js';
import { getErrorMessage } from '../../../base/common/errors.js';
import { ILogService } from '../../log/common/log.js';
import { arch } from '../../../base/common/process.js';
import { TelemetryTrustedValue } from '../../telemetry/common/telemetryUtils.js';
import { isString } from '../../../base/common/types.js';

export function areSameExtensions(a: IExtensionIdentifier, b: IExtensionIdentifier): boolean {
	if (a.uuid && b.uuid) {
		return a.uuid === b.uuid;
	}
	if (a.id === b.id) {
		return true;
	}
	return compareIgnoreCase(a.id, b.id) === 0;
}

const ExtensionKeyRegex = /^([^.]+\..+)-(\d+\.\d+\.\d+)(-(.+))?$/;

export class ExtensionKey {

	static create(extension: IExtension | IGalleryExtension): ExtensionKey {
		const version = (extension as IExtension).manifest ? (extension as IExtension).manifest.version : (extension as IGalleryExtension).version;
		const targetPlatform = (extension as IExtension).manifest ? (extension as IExtension).targetPlatform : (extension as IGalleryExtension).properties.targetPlatform;
		return new ExtensionKey(extension.identifier, version, targetPlatform);
	}

	static parse(key: string): ExtensionKey | null {
		const matches = ExtensionKeyRegex.exec(key);
		return matches && matches[1] && matches[2] ? new ExtensionKey({ id: matches[1] }, matches[2], matches[4] as TargetPlatform || undefined) : null;
	}

	readonly id: string;

	constructor(
		readonly identifier: IExtensionIdentifier,
		readonly version: string,
		readonly targetPlatform: TargetPlatform = TargetPlatform.UNDEFINED,
	) {
		this.id = identifier.id;
	}

	toString(): string {
		return `${this.id}-${this.version}${this.targetPlatform !== TargetPlatform.UNDEFINED ? `-${this.targetPlatform}` : ''}`;
	}

	equals(o: unknown): boolean {
		if (!(o instanceof ExtensionKey)) {
			return false;
		}
		return areSameExtensions(this, o) && this.version === o.version && this.targetPlatform === o.targetPlatform;
	}
}

const EXTENSION_IDENTIFIER_WITH_VERSION_REGEX = /^([^.]+\..+)@((prerelease)|(\d+\.\d+\.\d+(-.*)?))$/;
export function getIdAndVersion(id: string): [string, string | undefined] {
	const matches = EXTENSION_IDENTIFIER_WITH_VERSION_REGEX.exec(id);
	if (matches && matches[1]) {
		return [adoptToGalleryExtensionId(matches[1]), matches[2]];
	}
	return [adoptToGalleryExtensionId(id), undefined];
}

export function getExtensionId(publisher: string, name: string): string {
	return `${publisher}.${name}`;
}

export function adoptToGalleryExtensionId(id: string): string {
	return id.toLowerCase();
}

export function getGalleryExtensionId(publisher: string | undefined, name: string): string {
	return adoptToGalleryExtensionId(getExtensionId(publisher ?? UNDEFINED_PUBLISHER, name));
}

export function groupByExtension<T>(extensions: T[], getExtensionIdentifier: (t: T) => IExtensionIdentifier): T[][] {
	const byExtension: T[][] = [];
	const findGroup = (extension: T) => {
		for (const group of byExtension) {
			if (group.some(e => areSameExtensions(getExtensionIdentifier(e), getExtensionIdentifier(extension)))) {
				return group;
			}
		}
		return null;
	};
	for (const extension of extensions) {
		const group = findGroup(extension);
		if (group) {
			group.push(extension);
		} else {
			byExtension.push([extension]);
		}
	}
	return byExtension;
}

export function getLocalExtensionTelemetryData(extension: ILocalExtension) {
	return {
		id: extension.identifier.id,
		name: extension.manifest.name,
		galleryId: null,
		publisherId: extension.publisherId,
		publisherName: extension.manifest.publisher,
		publisherDisplayName: extension.publisherDisplayName,
		dependencies: extension.manifest.extensionDependencies && extension.manifest.extensionDependencies.length > 0
	};
}


/* __GDPR__FRAGMENT__
	"GalleryExtensionTelemetryData" : {
		"id" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
		"name": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
		"extensionVersion": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
		"galleryId": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
		"publisherId": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
		"publisherName": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
		"publisherDisplayName": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
		"isPreReleaseVersion": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
		"dependencies": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
		"isSigned": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
		"${include}": [
			"${GalleryExtensionTelemetryData2}"
		]
	}
*/
export function getGalleryExtensionTelemetryData(extension: IGalleryExtension) {
	return {
		id: new TelemetryTrustedValue(extension.identifier.id),
		name: new TelemetryTrustedValue(extension.name),
		extensionVersion: extension.version,
		galleryId: extension.identifier.uuid,
		publisherId: extension.publisherId,
		publisherName: extension.publisher,
		publisherDisplayName: extension.publisherDisplayName,
		isPreReleaseVersion: extension.properties.isPreReleaseVersion,
		dependencies: !!(extension.properties.dependencies && extension.properties.dependencies.length > 0),
		isSigned: extension.isSigned,
		...extension.telemetryData
	};
}

export const BetterMergeId = new ExtensionIdentifier('pprice.better-merge');

export function getExtensionDependencies(installedExtensions: ReadonlyArray<IExtension>, extension: IExtension): IExtension[] {
	const dependencies: IExtension[] = [];
	const extensions = extension.manifest.extensionDependencies?.slice(0) ?? [];

	while (extensions.length) {
		const id = extensions.shift();

		if (id && dependencies.every(e => !areSameExtensions(e.identifier, { id }))) {
			const ext = installedExtensions.filter(e => areSameExtensions(e.identifier, { id }));
			if (ext.length === 1) {
				dependencies.push(ext[0]);
				extensions.push(...ext[0].manifest.extensionDependencies?.slice(0) ?? []);
			}
		}
	}

	return dependencies;
}

async function isAlpineLinux(fileService: IFileService, logService: ILogService): Promise<boolean> {
	if (!isLinux) {
		return false;
	}
	let content: string | undefined;
	try {
		const fileContent = await fileService.readFile(URI.file('/etc/os-release'));
		content = fileContent.value.toString();
	} catch (error) {
		try {
			const fileContent = await fileService.readFile(URI.file('/usr/lib/os-release'));
			content = fileContent.value.toString();
		} catch (error) {
			/* Ignore */
			logService.debug(`Error while getting the os-release file.`, getErrorMessage(error));
		}
	}
	return !!content && (content.match(/^ID=([^\u001b\r\n]*)/m) || [])[1] === 'alpine';
}

export async function computeTargetPlatform(fileService: IFileService, logService: ILogService): Promise<TargetPlatform> {
	const alpineLinux = await isAlpineLinux(fileService, logService);
	const targetPlatform = getTargetPlatform(alpineLinux ? 'alpine' : platform, arch);
	logService.debug('ComputeTargetPlatform:', targetPlatform);
	return targetPlatform;
}

export function isMalicious(identifier: IExtensionIdentifier, malicious: ReadonlyArray<MaliciousExtensionInfo>): boolean {
	return findMatchingMaliciousEntry(identifier, malicious) !== undefined;
}

export function findMatchingMaliciousEntry(identifier: IExtensionIdentifier, malicious: ReadonlyArray<MaliciousExtensionInfo>): MaliciousExtensionInfo | undefined {
	return malicious.find(({ extensionOrPublisher }) => {
		if (isString(extensionOrPublisher)) {
			return compareIgnoreCase(identifier.id.split('.')[0], extensionOrPublisher) === 0;
		}
		return areSameExtensions(identifier, extensionOrPublisher);
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/common/extensionNls.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/common/extensionNls.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isObject, isString } from '../../../base/common/types.js';
import { ILocalizedString } from '../../action/common/action.js';
import { IExtensionManifest } from '../../extensions/common/extensions.js';
import { localize } from '../../../nls.js';
import { ILogger } from '../../log/common/log.js';

export interface ITranslations {
	[key: string]: string | { message: string; comment: string[] } | undefined;
}

export function localizeManifest(logger: ILogger, extensionManifest: IExtensionManifest, translations: ITranslations, fallbackTranslations?: ITranslations): IExtensionManifest {
	try {
		replaceNLStrings(logger, extensionManifest, translations, fallbackTranslations);
	} catch (error) {
		logger.error(error?.message ?? error);
		/*Ignore Error*/
	}
	return extensionManifest;
}

/**
 * This routine makes the following assumptions:
 * The root element is an object literal
 */
function replaceNLStrings(logger: ILogger, extensionManifest: IExtensionManifest, messages: ITranslations, originalMessages?: ITranslations): void {
	const processEntry = (obj: Record<string, unknown>, key: string | number, command?: boolean) => {
		const value = obj[key];
		if (isString(value)) {
			const str = value;
			const length = str.length;
			if (length > 1 && str[0] === '%' && str[length - 1] === '%') {
				const messageKey = str.substr(1, length - 2);
				let translated = messages[messageKey];
				// If the messages come from a language pack they might miss some keys
				// Fill them from the original messages.
				if (translated === undefined && originalMessages) {
					translated = originalMessages[messageKey];
				}
				const message: string | undefined = typeof translated === 'string' ? translated : translated?.message;

				// This branch returns ILocalizedString's instead of Strings so that the Command Palette can contain both the localized and the original value.
				const original = originalMessages?.[messageKey];
				const originalMessage: string | undefined = typeof original === 'string' ? original : original?.message;

				if (!message) {
					if (!originalMessage) {
						logger.warn(`[${extensionManifest.name}]: ${localize('missingNLSKey', "Couldn't find message for key {0}.", messageKey)}`);
					}
					return;
				}

				if (
					// if we are translating the title or category of a command
					command && (key === 'title' || key === 'category') &&
					// and the original value is not the same as the translated value
					originalMessage && originalMessage !== message
				) {
					const localizedString: ILocalizedString = {
						value: message,
						original: originalMessage
					};
					obj[key] = localizedString;
				} else {
					obj[key] = message;
				}
			}
		} else if (isObject(value)) {
			for (const k in value) {
				if (value.hasOwnProperty(k)) {
					k === 'commands' ? processEntry(value as Record<string, unknown>, k, true) : processEntry(value as Record<string, unknown>, k, command);
				}
			}
		} else if (Array.isArray(value)) {
			for (let i = 0; i < (value as Array<unknown>).length; i++) {
				processEntry(value, i, command);
			}
		}
	};

	for (const key in extensionManifest) {
		if (extensionManifest.hasOwnProperty(key)) {
			processEntry(extensionManifest, key);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/common/extensionsProfileScannerService.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/common/extensionsProfileScannerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Queue } from '../../../base/common/async.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { ResourceMap } from '../../../base/common/map.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { Metadata, isIExtensionIdentifier } from './extensionManagement.js';
import { areSameExtensions } from './extensionManagementUtil.js';
import { IExtension, IExtensionIdentifier } from '../../extensions/common/extensions.js';
import { FileOperationResult, IFileService, toFileOperationResult } from '../../files/common/files.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';
import { IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { Mutable, isObject, isString, isUndefined } from '../../../base/common/types.js';
import { getErrorMessage } from '../../../base/common/errors.js';

interface IStoredProfileExtension {
	identifier: IExtensionIdentifier;
	location: UriComponents | string;
	relativeLocation: string | undefined;
	version: string;
	metadata?: Metadata;
}

export const enum ExtensionsProfileScanningErrorCode {

	/**
	 * Error when trying to scan extensions from a profile that does not exist.
	 */
	ERROR_PROFILE_NOT_FOUND = 'ERROR_PROFILE_NOT_FOUND',

	/**
	 * Error when profile file is invalid.
	 */
	ERROR_INVALID_CONTENT = 'ERROR_INVALID_CONTENT',

}

export class ExtensionsProfileScanningError extends Error {
	constructor(message: string, public code: ExtensionsProfileScanningErrorCode) {
		super(message);
	}
}

export interface IScannedProfileExtension {
	readonly identifier: IExtensionIdentifier;
	readonly version: string;
	readonly location: URI;
	readonly metadata?: Metadata;
}

export interface ProfileExtensionsEvent {
	readonly extensions: readonly IScannedProfileExtension[];
	readonly profileLocation: URI;
}

export interface DidAddProfileExtensionsEvent extends ProfileExtensionsEvent {
	readonly error?: Error;
}

export interface DidRemoveProfileExtensionsEvent extends ProfileExtensionsEvent {
	readonly error?: Error;
}

export interface IProfileExtensionsScanOptions {
	readonly bailOutWhenFileNotFound?: boolean;
}

export const IExtensionsProfileScannerService = createDecorator<IExtensionsProfileScannerService>('IExtensionsProfileScannerService');
export interface IExtensionsProfileScannerService {
	readonly _serviceBrand: undefined;

	readonly onAddExtensions: Event<ProfileExtensionsEvent>;
	readonly onDidAddExtensions: Event<DidAddProfileExtensionsEvent>;
	readonly onRemoveExtensions: Event<ProfileExtensionsEvent>;
	readonly onDidRemoveExtensions: Event<DidRemoveProfileExtensionsEvent>;

	scanProfileExtensions(profileLocation: URI, options?: IProfileExtensionsScanOptions): Promise<IScannedProfileExtension[]>;
	addExtensionsToProfile(extensions: [IExtension, Metadata | undefined][], profileLocation: URI, keepExistingVersions?: boolean): Promise<IScannedProfileExtension[]>;
	updateMetadata(extensions: [IExtension, Metadata | undefined][], profileLocation: URI): Promise<IScannedProfileExtension[]>;
	removeExtensionsFromProfile(extensions: IExtensionIdentifier[], profileLocation: URI): Promise<void>;
}

export abstract class AbstractExtensionsProfileScannerService extends Disposable implements IExtensionsProfileScannerService {
	readonly _serviceBrand: undefined;

	private readonly _onAddExtensions = this._register(new Emitter<ProfileExtensionsEvent>());
	readonly onAddExtensions = this._onAddExtensions.event;

	private readonly _onDidAddExtensions = this._register(new Emitter<DidAddProfileExtensionsEvent>());
	readonly onDidAddExtensions = this._onDidAddExtensions.event;

	private readonly _onRemoveExtensions = this._register(new Emitter<ProfileExtensionsEvent>());
	readonly onRemoveExtensions = this._onRemoveExtensions.event;

	private readonly _onDidRemoveExtensions = this._register(new Emitter<DidRemoveProfileExtensionsEvent>());
	readonly onDidRemoveExtensions = this._onDidRemoveExtensions.event;

	private readonly resourcesAccessQueueMap = new ResourceMap<Queue<IScannedProfileExtension[]>>();

	constructor(
		private readonly extensionsLocation: URI,
		@IFileService private readonly fileService: IFileService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@ILogService private readonly logService: ILogService,
	) {
		super();
	}

	scanProfileExtensions(profileLocation: URI, options?: IProfileExtensionsScanOptions): Promise<IScannedProfileExtension[]> {
		return this.withProfileExtensions(profileLocation, undefined, options);
	}

	async addExtensionsToProfile(extensions: [IExtension, Metadata | undefined][], profileLocation: URI, keepExistingVersions?: boolean): Promise<IScannedProfileExtension[]> {
		const extensionsToRemove: IScannedProfileExtension[] = [];
		const extensionsToAdd: IScannedProfileExtension[] = [];
		try {
			await this.withProfileExtensions(profileLocation, existingExtensions => {
				const result: IScannedProfileExtension[] = [];
				if (keepExistingVersions) {
					result.push(...existingExtensions);
				} else {
					for (const existing of existingExtensions) {
						if (extensions.some(([e]) => areSameExtensions(e.identifier, existing.identifier) && e.manifest.version !== existing.version)) {
							// Remove the existing extension with different version
							extensionsToRemove.push(existing);
						} else {
							result.push(existing);
						}
					}
				}
				for (const [extension, metadata] of extensions) {
					const index = result.findIndex(e => areSameExtensions(e.identifier, extension.identifier) && e.version === extension.manifest.version);
					const extensionToAdd = { identifier: extension.identifier, version: extension.manifest.version, location: extension.location, metadata };
					if (index === -1) {
						extensionsToAdd.push(extensionToAdd);
						result.push(extensionToAdd);
					} else {
						result.splice(index, 1, extensionToAdd);
					}
				}
				if (extensionsToAdd.length) {
					this._onAddExtensions.fire({ extensions: extensionsToAdd, profileLocation });
				}
				if (extensionsToRemove.length) {
					this._onRemoveExtensions.fire({ extensions: extensionsToRemove, profileLocation });
				}
				return result;
			});
			if (extensionsToAdd.length) {
				this._onDidAddExtensions.fire({ extensions: extensionsToAdd, profileLocation });
			}
			if (extensionsToRemove.length) {
				this._onDidRemoveExtensions.fire({ extensions: extensionsToRemove, profileLocation });
			}
			return extensionsToAdd;
		} catch (error) {
			if (extensionsToAdd.length) {
				this._onDidAddExtensions.fire({ extensions: extensionsToAdd, error, profileLocation });
			}
			if (extensionsToRemove.length) {
				this._onDidRemoveExtensions.fire({ extensions: extensionsToRemove, error, profileLocation });
			}
			throw error;
		}
	}

	async updateMetadata(extensions: [IExtension, Metadata][], profileLocation: URI): Promise<IScannedProfileExtension[]> {
		const updatedExtensions: IScannedProfileExtension[] = [];
		await this.withProfileExtensions(profileLocation, profileExtensions => {
			const result: IScannedProfileExtension[] = [];
			for (const profileExtension of profileExtensions) {
				const extension = extensions.find(([e]) => areSameExtensions({ id: e.identifier.id }, { id: profileExtension.identifier.id }) && e.manifest.version === profileExtension.version);
				if (extension) {
					profileExtension.metadata = { ...profileExtension.metadata, ...extension[1] };
					updatedExtensions.push(profileExtension);
					result.push(profileExtension);
				} else {
					result.push(profileExtension);
				}
			}
			return result;
		});
		return updatedExtensions;
	}

	async removeExtensionsFromProfile(extensions: IExtensionIdentifier[], profileLocation: URI): Promise<void> {
		const extensionsToRemove: IScannedProfileExtension[] = [];
		try {
			await this.withProfileExtensions(profileLocation, profileExtensions => {
				const result: IScannedProfileExtension[] = [];
				for (const e of profileExtensions) {
					if (extensions.some(extension => areSameExtensions(e.identifier, extension))) {
						extensionsToRemove.push(e);
					} else {
						result.push(e);
					}
				}
				if (extensionsToRemove.length) {
					this._onRemoveExtensions.fire({ extensions: extensionsToRemove, profileLocation });
				}
				return result;
			});
			if (extensionsToRemove.length) {
				this._onDidRemoveExtensions.fire({ extensions: extensionsToRemove, profileLocation });
			}
		} catch (error) {
			if (extensionsToRemove.length) {
				this._onDidRemoveExtensions.fire({ extensions: extensionsToRemove, error, profileLocation });
			}
			throw error;
		}
	}

	private async withProfileExtensions(file: URI, updateFn?: (extensions: Mutable<IScannedProfileExtension>[]) => IScannedProfileExtension[], options?: IProfileExtensionsScanOptions): Promise<IScannedProfileExtension[]> {
		return this.getResourceAccessQueue(file).queue(async () => {
			let extensions: IScannedProfileExtension[] = [];

			// Read
			let storedProfileExtensions: IStoredProfileExtension[] | undefined;
			try {
				const content = await this.fileService.readFile(file);
				storedProfileExtensions = JSON.parse(content.value.toString().trim() || '[]');
			} catch (error) {
				if (toFileOperationResult(error) !== FileOperationResult.FILE_NOT_FOUND) {
					throw error;
				}
				// migrate from old location, remove this after couple of releases
				if (this.uriIdentityService.extUri.isEqual(file, this.userDataProfilesService.defaultProfile.extensionsResource)) {
					storedProfileExtensions = await this.migrateFromOldDefaultProfileExtensionsLocation();
				}
				if (!storedProfileExtensions && options?.bailOutWhenFileNotFound) {
					throw new ExtensionsProfileScanningError(getErrorMessage(error), ExtensionsProfileScanningErrorCode.ERROR_PROFILE_NOT_FOUND);
				}
			}
			if (storedProfileExtensions) {
				if (!Array.isArray(storedProfileExtensions)) {
					this.throwInvalidConentError(file);
				}
				// TODO @sandy081: Remove this migration after couple of releases
				let migrate = false;
				for (const e of storedProfileExtensions) {
					if (!isStoredProfileExtension(e)) {
						this.throwInvalidConentError(file);
					}
					let location: URI;
					if (isString(e.relativeLocation) && e.relativeLocation) {
						// Extension in new format. No migration needed.
						location = this.resolveExtensionLocation(e.relativeLocation);
					} else if (isString(e.location)) {
						this.logService.warn(`Extensions profile: Ignoring extension with invalid location: ${e.location}`);
						continue;
					} else {
						location = URI.revive(e.location);
						const relativePath = this.toRelativePath(location);
						if (relativePath) {
							// Extension in old format. Migrate to new format.
							migrate = true;
							e.relativeLocation = relativePath;
						}
					}
					if (isUndefined(e.metadata?.hasPreReleaseVersion) && e.metadata?.preRelease) {
						migrate = true;
						e.metadata.hasPreReleaseVersion = true;
					}
					const uuid = e.metadata?.id ?? e.identifier.uuid;
					extensions.push({
						identifier: uuid ? { id: e.identifier.id, uuid } : { id: e.identifier.id },
						location,
						version: e.version,
						metadata: e.metadata,
					});
				}
				if (migrate) {
					await this.fileService.writeFile(file, VSBuffer.fromString(JSON.stringify(storedProfileExtensions)));
				}
			}

			// Update
			if (updateFn) {
				extensions = updateFn(extensions);
				const storedProfileExtensions: IStoredProfileExtension[] = extensions.map(e => ({
					identifier: e.identifier,
					version: e.version,
					// retain old format so that old clients can read it
					location: e.location.toJSON(),
					relativeLocation: this.toRelativePath(e.location),
					metadata: e.metadata
				}));
				await this.fileService.writeFile(file, VSBuffer.fromString(JSON.stringify(storedProfileExtensions)));
			}

			return extensions;
		});
	}

	private throwInvalidConentError(file: URI): void {
		throw new ExtensionsProfileScanningError(`Invalid extensions content in ${file.toString()}`, ExtensionsProfileScanningErrorCode.ERROR_INVALID_CONTENT);
	}

	private toRelativePath(extensionLocation: URI): string | undefined {
		return this.uriIdentityService.extUri.isEqual(this.uriIdentityService.extUri.dirname(extensionLocation), this.extensionsLocation)
			? this.uriIdentityService.extUri.basename(extensionLocation)
			: undefined;
	}

	private resolveExtensionLocation(path: string): URI {
		return this.uriIdentityService.extUri.joinPath(this.extensionsLocation, path);
	}

	private _migrationPromise: Promise<IStoredProfileExtension[] | undefined> | undefined;
	private async migrateFromOldDefaultProfileExtensionsLocation(): Promise<IStoredProfileExtension[] | undefined> {
		if (!this._migrationPromise) {
			this._migrationPromise = (async () => {
				const oldDefaultProfileExtensionsLocation = this.uriIdentityService.extUri.joinPath(this.userDataProfilesService.defaultProfile.location, 'extensions.json');
				const oldDefaultProfileExtensionsInitLocation = this.uriIdentityService.extUri.joinPath(this.extensionsLocation, '.init-default-profile-extensions');
				let content: string;
				try {
					content = (await this.fileService.readFile(oldDefaultProfileExtensionsLocation)).value.toString();
				} catch (error) {
					if (toFileOperationResult(error) === FileOperationResult.FILE_NOT_FOUND) {
						return undefined;
					}
					throw error;
				}

				this.logService.info('Migrating extensions from old default profile location', oldDefaultProfileExtensionsLocation.toString());
				let storedProfileExtensions: IStoredProfileExtension[] | undefined;
				try {
					const parsedData = JSON.parse(content);
					if (Array.isArray(parsedData) && parsedData.every(candidate => isStoredProfileExtension(candidate))) {
						storedProfileExtensions = parsedData;
					} else {
						this.logService.warn('Skipping migrating from old default profile locaiton: Found invalid data', parsedData);
					}
				} catch (error) {
					/* Ignore */
					this.logService.error(error);
				}

				if (storedProfileExtensions) {
					try {
						await this.fileService.createFile(this.userDataProfilesService.defaultProfile.extensionsResource, VSBuffer.fromString(JSON.stringify(storedProfileExtensions)), { overwrite: false });
						this.logService.info('Migrated extensions from old default profile location to new location', oldDefaultProfileExtensionsLocation.toString(), this.userDataProfilesService.defaultProfile.extensionsResource.toString());
					} catch (error) {
						if (toFileOperationResult(error) === FileOperationResult.FILE_MODIFIED_SINCE) {
							this.logService.info('Migration from old default profile location to new location is done by another window', oldDefaultProfileExtensionsLocation.toString(), this.userDataProfilesService.defaultProfile.extensionsResource.toString());
						} else {
							throw error;
						}
					}
				}

				try {
					await this.fileService.del(oldDefaultProfileExtensionsLocation);
				} catch (error) {
					if (toFileOperationResult(error) !== FileOperationResult.FILE_NOT_FOUND) {
						this.logService.error(error);
					}
				}

				try {
					await this.fileService.del(oldDefaultProfileExtensionsInitLocation);
				} catch (error) {
					if (toFileOperationResult(error) !== FileOperationResult.FILE_NOT_FOUND) {
						this.logService.error(error);
					}
				}

				return storedProfileExtensions;
			})();
		}
		return this._migrationPromise;
	}

	private getResourceAccessQueue(file: URI): Queue<IScannedProfileExtension[]> {
		let resourceQueue = this.resourcesAccessQueueMap.get(file);
		if (!resourceQueue) {
			resourceQueue = new Queue<IScannedProfileExtension[]>();
			this.resourcesAccessQueueMap.set(file, resourceQueue);
		}
		return resourceQueue;
	}
}

function isStoredProfileExtension(obj: unknown): obj is IStoredProfileExtension {
	const candidate = obj as IStoredProfileExtension | undefined;
	return isObject(candidate)
		&& isIExtensionIdentifier(candidate.identifier)
		&& (isUriComponents(candidate.location) || (isString(candidate.location) && !!candidate.location))
		&& (isUndefined(candidate.relativeLocation) || isString(candidate.relativeLocation))
		&& !!candidate.version
		&& isString(candidate.version);
}

function isUriComponents(obj: unknown): obj is UriComponents {
	if (!obj) {
		return false;
	}
	const thing = obj as UriComponents | undefined;
	return typeof thing?.path === 'string' &&
		typeof thing?.scheme === 'string';
}
```

--------------------------------------------------------------------------------

````

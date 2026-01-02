---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 293
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 293 of 552)

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

---[FILE: src/vs/platform/userDataSync/common/userDataSyncStoreService.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/userDataSyncStoreService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancelablePromise, createCancelablePromise, timeout } from '../../../base/common/async.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { getErrorMessage, isCancellationError } from '../../../base/common/errors.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, DisposableStore, toDisposable } from '../../../base/common/lifecycle.js';
import { Mimes } from '../../../base/common/mime.js';
import { isWeb } from '../../../base/common/platform.js';
import { ConfigurationSyncStore } from '../../../base/common/product.js';
import { joinPath, relativePath } from '../../../base/common/resources.js';
import { isObject, isString } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { generateUuid } from '../../../base/common/uuid.js';
import { IHeaders, IRequestContext, IRequestOptions } from '../../../base/parts/request/common/request.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { IFileService } from '../../files/common/files.js';
import { IProductService } from '../../product/common/productService.js';
import { asJson, asText, asTextOrError, hasNoContent, IRequestService, isSuccess, isSuccess as isSuccessContext } from '../../request/common/request.js';
import { getServiceMachineId } from '../../externalServices/common/serviceMachineId.js';
import { IStorageService, StorageScope, StorageTarget } from '../../storage/common/storage.js';
import { HEADER_EXECUTION_ID, HEADER_OPERATION_ID, IAuthenticationProvider, IResourceRefHandle, IUserData, IUserDataManifest, IUserDataSyncLatestData, IUserDataSyncLogService, IUserDataSyncStore, IUserDataSyncStoreManagementService, IUserDataSyncStoreService, ServerResource, SYNC_SERVICE_URL_TYPE, UserDataSyncErrorCode, UserDataSyncStoreError, UserDataSyncStoreType } from './userDataSync.js';
import { VSBufferReadableStream } from '../../../base/common/buffer.js';
import { IStringDictionary } from '../../../base/common/collections.js';

type IDownloadLatestDataType = {
	resources?: {
		[resourceId: string]: [IUserData];
	};
	collections?: {
		[collectionId: string]: {
			resources?: {
				[resourceId: string]: [IUserData];
			} | undefined;
		};
	};
};

const CONFIGURATION_SYNC_STORE_KEY = 'configurationSync.store';
const SYNC_PREVIOUS_STORE = 'sync.previous.store';
const DONOT_MAKE_REQUESTS_UNTIL_KEY = 'sync.donot-make-requests-until';
const USER_SESSION_ID_KEY = 'sync.user-session-id';
const MACHINE_SESSION_ID_KEY = 'sync.machine-session-id';
const REQUEST_SESSION_LIMIT = 100;
const REQUEST_SESSION_INTERVAL = 1000 * 60 * 5; /* 5 minutes */

type UserDataSyncStore = IUserDataSyncStore & { defaultType: UserDataSyncStoreType };

export abstract class AbstractUserDataSyncStoreManagementService extends Disposable implements IUserDataSyncStoreManagementService {

	_serviceBrand: undefined;

	private readonly _onDidChangeUserDataSyncStore = this._register(new Emitter<void>());
	readonly onDidChangeUserDataSyncStore = this._onDidChangeUserDataSyncStore.event;
	private _userDataSyncStore: UserDataSyncStore | undefined;
	get userDataSyncStore(): UserDataSyncStore | undefined { return this._userDataSyncStore; }

	protected get userDataSyncStoreType(): UserDataSyncStoreType | undefined {
		return this.storageService.get(SYNC_SERVICE_URL_TYPE, StorageScope.APPLICATION) as UserDataSyncStoreType;
	}
	protected set userDataSyncStoreType(type: UserDataSyncStoreType | undefined) {
		this.storageService.store(SYNC_SERVICE_URL_TYPE, type, StorageScope.APPLICATION, isWeb ? StorageTarget.USER /* sync in web */ : StorageTarget.MACHINE);
	}

	constructor(
		@IProductService protected readonly productService: IProductService,
		@IConfigurationService protected readonly configurationService: IConfigurationService,
		@IStorageService protected readonly storageService: IStorageService,
	) {
		super();
		this.updateUserDataSyncStore();
		const disposable = this._register(new DisposableStore());
		this._register(Event.filter(storageService.onDidChangeValue(StorageScope.APPLICATION, SYNC_SERVICE_URL_TYPE, disposable), () => this.userDataSyncStoreType !== this.userDataSyncStore?.type, disposable)(() => this.updateUserDataSyncStore()));
	}

	protected updateUserDataSyncStore(): void {
		this._userDataSyncStore = this.toUserDataSyncStore(this.productService[CONFIGURATION_SYNC_STORE_KEY]);
		this._onDidChangeUserDataSyncStore.fire();
	}

	protected toUserDataSyncStore(configurationSyncStore: ConfigurationSyncStore & { web?: ConfigurationSyncStore } | undefined): UserDataSyncStore | undefined {
		if (!configurationSyncStore) {
			return undefined;
		}
		// Check for web overrides for backward compatibility while reading previous store
		configurationSyncStore = isWeb && configurationSyncStore.web ? { ...configurationSyncStore, ...configurationSyncStore.web } : configurationSyncStore;
		if (isString(configurationSyncStore.url)
			&& isObject(configurationSyncStore.authenticationProviders)
			&& Object.keys(configurationSyncStore.authenticationProviders).every(authenticationProviderId => Array.isArray(configurationSyncStore.authenticationProviders[authenticationProviderId].scopes))
		) {
			const syncStore = configurationSyncStore as ConfigurationSyncStore;
			const canSwitch = !!syncStore.canSwitch;
			const defaultType: UserDataSyncStoreType = syncStore.url === syncStore.insidersUrl ? 'insiders' : 'stable';
			const type: UserDataSyncStoreType = (canSwitch ? this.userDataSyncStoreType : undefined) || defaultType;
			const url = type === 'insiders' ? syncStore.insidersUrl
				: type === 'stable' ? syncStore.stableUrl
					: syncStore.url;
			return {
				url: URI.parse(url),
				type,
				defaultType,
				defaultUrl: URI.parse(syncStore.url),
				stableUrl: URI.parse(syncStore.stableUrl),
				insidersUrl: URI.parse(syncStore.insidersUrl),
				canSwitch,
				authenticationProviders: Object.keys(syncStore.authenticationProviders).reduce<IAuthenticationProvider[]>((result, id) => {
					result.push({ id, scopes: syncStore.authenticationProviders[id].scopes });
					return result;
				}, [])
			};
		}
		return undefined;
	}

	abstract switch(type: UserDataSyncStoreType): Promise<void>;
	abstract getPreviousUserDataSyncStore(): Promise<IUserDataSyncStore | undefined>;

}

export class UserDataSyncStoreManagementService extends AbstractUserDataSyncStoreManagementService implements IUserDataSyncStoreManagementService {

	private readonly previousConfigurationSyncStore: ConfigurationSyncStore | undefined;

	constructor(
		@IProductService productService: IProductService,
		@IConfigurationService configurationService: IConfigurationService,
		@IStorageService storageService: IStorageService,
	) {
		super(productService, configurationService, storageService);

		const previousConfigurationSyncStore = this.storageService.get(SYNC_PREVIOUS_STORE, StorageScope.APPLICATION);
		if (previousConfigurationSyncStore) {
			this.previousConfigurationSyncStore = JSON.parse(previousConfigurationSyncStore);
		}

		const syncStore = this.productService[CONFIGURATION_SYNC_STORE_KEY];
		if (syncStore) {
			this.storageService.store(SYNC_PREVIOUS_STORE, JSON.stringify(syncStore), StorageScope.APPLICATION, StorageTarget.MACHINE);
		} else {
			this.storageService.remove(SYNC_PREVIOUS_STORE, StorageScope.APPLICATION);
		}
	}

	async switch(type: UserDataSyncStoreType): Promise<void> {
		if (type !== this.userDataSyncStoreType) {
			this.userDataSyncStoreType = type;
			this.updateUserDataSyncStore();
		}
	}

	async getPreviousUserDataSyncStore(): Promise<IUserDataSyncStore | undefined> {
		return this.toUserDataSyncStore(this.previousConfigurationSyncStore);
	}
}

export class UserDataSyncStoreClient extends Disposable {

	private userDataSyncStoreUrl: URI | undefined;

	private authToken: { token: string; type: string } | undefined;
	private readonly commonHeadersPromise: Promise<IHeaders>;
	private readonly session: RequestsSession;

	private _onTokenFailed = this._register(new Emitter<UserDataSyncErrorCode>());
	readonly onTokenFailed = this._onTokenFailed.event;

	private _onTokenSucceed: Emitter<void> = this._register(new Emitter<void>());
	readonly onTokenSucceed: Event<void> = this._onTokenSucceed.event;

	private _donotMakeRequestsUntil: Date | undefined = undefined;
	get donotMakeRequestsUntil() { return this._donotMakeRequestsUntil; }
	private _onDidChangeDonotMakeRequestsUntil = this._register(new Emitter<void>());
	readonly onDidChangeDonotMakeRequestsUntil = this._onDidChangeDonotMakeRequestsUntil.event;

	constructor(
		userDataSyncStoreUrl: URI | undefined,
		@IProductService productService: IProductService,
		@IRequestService private readonly requestService: IRequestService,
		@IUserDataSyncLogService private readonly logService: IUserDataSyncLogService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@IFileService fileService: IFileService,
		@IStorageService private readonly storageService: IStorageService,
	) {
		super();
		this.updateUserDataSyncStoreUrl(userDataSyncStoreUrl);
		this.commonHeadersPromise = getServiceMachineId(environmentService, fileService, storageService)
			.then(uuid => {
				const headers: IHeaders = {
					'X-Client-Name': `${productService.applicationName}${isWeb ? '-web' : ''}`,
					'X-Client-Version': productService.version,
				};
				if (productService.commit) {
					headers['X-Client-Commit'] = productService.commit;
				}
				return headers;
			});

		/* A requests session that limits requests per sessions */
		this.session = new RequestsSession(REQUEST_SESSION_LIMIT, REQUEST_SESSION_INTERVAL, this.requestService, this.logService);
		this.initDonotMakeRequestsUntil();
		this._register(toDisposable(() => {
			if (this.resetDonotMakeRequestsUntilPromise) {
				this.resetDonotMakeRequestsUntilPromise.cancel();
				this.resetDonotMakeRequestsUntilPromise = undefined;
			}
		}));
	}

	setAuthToken(token: string, type: string): void {
		this.authToken = { token, type };
	}

	protected updateUserDataSyncStoreUrl(userDataSyncStoreUrl: URI | undefined): void {
		this.userDataSyncStoreUrl = userDataSyncStoreUrl ? joinPath(userDataSyncStoreUrl, 'v1') : undefined;
	}

	private initDonotMakeRequestsUntil(): void {
		const donotMakeRequestsUntil = this.storageService.getNumber(DONOT_MAKE_REQUESTS_UNTIL_KEY, StorageScope.APPLICATION);
		if (donotMakeRequestsUntil && Date.now() < donotMakeRequestsUntil) {
			this.setDonotMakeRequestsUntil(new Date(donotMakeRequestsUntil));
		}
	}

	private resetDonotMakeRequestsUntilPromise: CancelablePromise<void> | undefined = undefined;
	private setDonotMakeRequestsUntil(donotMakeRequestsUntil: Date | undefined): void {
		if (this._donotMakeRequestsUntil?.getTime() !== donotMakeRequestsUntil?.getTime()) {
			this._donotMakeRequestsUntil = donotMakeRequestsUntil;

			if (this.resetDonotMakeRequestsUntilPromise) {
				this.resetDonotMakeRequestsUntilPromise.cancel();
				this.resetDonotMakeRequestsUntilPromise = undefined;
			}

			if (this._donotMakeRequestsUntil) {
				this.storageService.store(DONOT_MAKE_REQUESTS_UNTIL_KEY, this._donotMakeRequestsUntil.getTime(), StorageScope.APPLICATION, StorageTarget.MACHINE);
				this.resetDonotMakeRequestsUntilPromise = createCancelablePromise(token => timeout(this._donotMakeRequestsUntil!.getTime() - Date.now(), token).then(() => this.setDonotMakeRequestsUntil(undefined)));
				this.resetDonotMakeRequestsUntilPromise.then(null, e => null /* ignore error */);
			} else {
				this.storageService.remove(DONOT_MAKE_REQUESTS_UNTIL_KEY, StorageScope.APPLICATION);
			}

			this._onDidChangeDonotMakeRequestsUntil.fire();
		}
	}

	// #region Collection

	async getAllCollections(headers: IHeaders = {}): Promise<string[]> {
		if (!this.userDataSyncStoreUrl) {
			throw new Error('No settings sync store url configured.');
		}

		const url = joinPath(this.userDataSyncStoreUrl, 'collection').toString();
		headers = { ...headers };
		headers['Content-Type'] = 'application/json';

		const context = await this.request(url, { type: 'GET', headers }, [], CancellationToken.None);

		return (await asJson<{ id: string }[]>(context))?.map(({ id }) => id) || [];
	}

	async createCollection(headers: IHeaders = {}): Promise<string> {
		if (!this.userDataSyncStoreUrl) {
			throw new Error('No settings sync store url configured.');
		}

		const url = joinPath(this.userDataSyncStoreUrl, 'collection').toString();
		headers = { ...headers };
		headers['Content-Type'] = Mimes.text;

		const context = await this.request(url, { type: 'POST', headers }, [], CancellationToken.None);
		const collectionId = await asTextOrError(context);
		if (!collectionId) {
			throw new UserDataSyncStoreError('Server did not return the collection id', url, UserDataSyncErrorCode.NoCollection, context.res.statusCode, context.res.headers[HEADER_OPERATION_ID]);
		}
		return collectionId;
	}

	async deleteCollection(collection?: string, headers: IHeaders = {}): Promise<void> {
		if (!this.userDataSyncStoreUrl) {
			throw new Error('No settings sync store url configured.');
		}

		const url = collection ? joinPath(this.userDataSyncStoreUrl, 'collection', collection).toString() : joinPath(this.userDataSyncStoreUrl, 'collection').toString();
		headers = { ...headers };

		await this.request(url, { type: 'DELETE', headers }, [], CancellationToken.None);
	}

	// #endregion

	// #region Resource

	async getAllResourceRefs(resource: ServerResource, collection?: string): Promise<IResourceRefHandle[]> {
		if (!this.userDataSyncStoreUrl) {
			throw new Error('No settings sync store url configured.');
		}

		const uri = this.getResourceUrl(this.userDataSyncStoreUrl, collection, resource);
		const headers: IHeaders = {};

		const context = await this.request(uri.toString(), { type: 'GET', headers }, [], CancellationToken.None);

		const result = await asJson<{ url: string; created: number }[]>(context) || [];
		return result.map(({ url, created }) => ({ ref: relativePath(uri, uri.with({ path: url }))!, created: created * 1000 /* Server returns in seconds */ }));
	}

	async resolveResourceContent(resource: ServerResource, ref: string, collection?: string, headers: IHeaders = {}): Promise<string | null> {
		if (!this.userDataSyncStoreUrl) {
			throw new Error('No settings sync store url configured.');
		}

		const url = joinPath(this.getResourceUrl(this.userDataSyncStoreUrl, collection, resource), ref).toString();
		headers = { ...headers };
		headers['Cache-Control'] = 'no-cache';

		const context = await this.request(url, { type: 'GET', headers }, [], CancellationToken.None);
		const content = await asTextOrError(context);
		return content;
	}

	async deleteResource(resource: ServerResource, ref: string | null, collection?: string): Promise<void> {
		if (!this.userDataSyncStoreUrl) {
			throw new Error('No settings sync store url configured.');
		}

		const url = ref !== null ? joinPath(this.getResourceUrl(this.userDataSyncStoreUrl, collection, resource), ref).toString() : this.getResourceUrl(this.userDataSyncStoreUrl, collection, resource).toString();
		const headers: IHeaders = {};

		await this.request(url, { type: 'DELETE', headers }, [], CancellationToken.None);
	}

	async deleteResources(): Promise<void> {
		if (!this.userDataSyncStoreUrl) {
			throw new Error('No settings sync store url configured.');
		}

		const url = joinPath(this.userDataSyncStoreUrl, 'resource').toString();
		const headers: IHeaders = { 'Content-Type': Mimes.text };

		await this.request(url, { type: 'DELETE', headers }, [], CancellationToken.None);
	}

	async readResource(resource: ServerResource, oldValue: IUserData | null, collection?: string, headers: IHeaders = {}): Promise<IUserData> {
		if (!this.userDataSyncStoreUrl) {
			throw new Error('No settings sync store url configured.');
		}

		const url = joinPath(this.getResourceUrl(this.userDataSyncStoreUrl, collection, resource), 'latest').toString();
		headers = { ...headers };
		// Disable caching as they are cached by synchronisers
		headers['Cache-Control'] = 'no-cache';
		if (oldValue) {
			headers['If-None-Match'] = oldValue.ref;
		}

		const context = await this.request(url, { type: 'GET', headers }, [304], CancellationToken.None);

		let userData: IUserData | null = null;
		if (context.res.statusCode === 304) {
			userData = oldValue;
		}

		if (userData === null) {
			const ref = context.res.headers['etag'];
			if (!ref) {
				throw new UserDataSyncStoreError('Server did not return the ref', url, UserDataSyncErrorCode.NoRef, context.res.statusCode, context.res.headers[HEADER_OPERATION_ID]);
			}

			const content = await asTextOrError(context);
			if (!content && context.res.statusCode === 304) {
				throw new UserDataSyncStoreError('Empty response', url, UserDataSyncErrorCode.EmptyResponse, context.res.statusCode, context.res.headers[HEADER_OPERATION_ID]);
			}

			userData = { ref, content };
		}

		return userData;
	}

	async writeResource(resource: ServerResource, data: string, ref: string | null, collection?: string, headers: IHeaders = {}): Promise<string> {
		if (!this.userDataSyncStoreUrl) {
			throw new Error('No settings sync store url configured.');
		}

		const url = this.getResourceUrl(this.userDataSyncStoreUrl, collection, resource).toString();
		headers = { ...headers };
		headers['Content-Type'] = Mimes.text;
		if (ref) {
			headers['If-Match'] = ref;
		}

		const context = await this.request(url, { type: 'POST', data, headers }, [], CancellationToken.None);

		const newRef = context.res.headers['etag'];
		if (!newRef) {
			throw new UserDataSyncStoreError('Server did not return the ref', url, UserDataSyncErrorCode.NoRef, context.res.statusCode, context.res.headers[HEADER_OPERATION_ID]);
		}
		return newRef;
	}

	// #endregion

	async manifest(oldValue: IUserDataManifest | null, headers: IHeaders = {}): Promise<IUserDataManifest | null> {
		if (!this.userDataSyncStoreUrl) {
			throw new Error('No settings sync store url configured.');
		}

		const url = joinPath(this.userDataSyncStoreUrl, 'manifest').toString();
		headers = { ...headers };
		headers['Content-Type'] = 'application/json';
		if (oldValue) {
			headers['If-None-Match'] = oldValue.ref;
		}

		const context = await this.request(url, { type: 'GET', headers }, [304], CancellationToken.None);

		let manifest: IUserDataManifest | null = null;
		if (context.res.statusCode === 304) {
			manifest = oldValue;
		}

		if (!manifest) {
			const ref = context.res.headers['etag'];
			if (!ref) {
				throw new UserDataSyncStoreError('Server did not return the ref', url, UserDataSyncErrorCode.NoRef, context.res.statusCode, context.res.headers[HEADER_OPERATION_ID]);
			}

			const content = await asTextOrError(context);
			if (!content && context.res.statusCode === 304) {
				throw new UserDataSyncStoreError('Empty response', url, UserDataSyncErrorCode.EmptyResponse, context.res.statusCode, context.res.headers[HEADER_OPERATION_ID]);
			}

			if (content) {
				manifest = { ...JSON.parse(content), ref };
			}
		}

		const currentSessionId = this.storageService.get(USER_SESSION_ID_KEY, StorageScope.APPLICATION);

		if (currentSessionId && manifest && currentSessionId !== manifest.session) {
			// Server session is different from client session so clear cached session.
			this.clearSession();
		}

		if (manifest === null && currentSessionId) {
			// server session is cleared so clear cached session.
			this.clearSession();
		}

		if (manifest) {
			// update session
			this.storageService.store(USER_SESSION_ID_KEY, manifest.session, StorageScope.APPLICATION, StorageTarget.MACHINE);
		}

		return manifest;
	}

	async clear(): Promise<void> {
		if (!this.userDataSyncStoreUrl) {
			throw new Error('No settings sync store url configured.');
		}

		await this.deleteCollection();
		await this.deleteResources();

		// clear cached session.
		this.clearSession();
	}

	async getLatestData(headers: IHeaders = {}): Promise<IUserDataSyncLatestData | null> {
		if (!this.userDataSyncStoreUrl) {
			throw new Error('No settings sync store url configured.');
		}

		const url = joinPath(this.userDataSyncStoreUrl, 'download', 'latest').toString();

		headers = { ...headers };
		headers['Content-Type'] = 'application/json';
		const context = await this.request(url, { type: 'GET', headers }, [], CancellationToken.None);

		if (!isSuccess(context)) {
			throw new UserDataSyncStoreError('Server returned ' + context.res.statusCode, url, UserDataSyncErrorCode.EmptyResponse, context.res.statusCode, context.res.headers[HEADER_OPERATION_ID]);
		}

		const serverData = await asJson<IDownloadLatestDataType>(context);
		if (!serverData) {
			return null;
		}

		const result: IUserDataSyncLatestData = {};
		if (serverData.resources) {
			result.resources = {};
			for (const resource in serverData.resources) {
				const [resourceData] = serverData.resources[resource];
				result.resources[resource] = {
					content: resourceData.content,
					ref: resourceData.ref
				};
			}
		}

		if (serverData.collections) {
			result.collections = {};
			for (const collection in serverData.collections) {
				const resources: IStringDictionary<IUserData> = {};
				result.collections[collection] = { resources };
				for (const resource in serverData.collections[collection].resources) {
					const [resourceData] = serverData.collections[collection].resources[resource];
					resources[resource] = {
						content: resourceData.content,
						ref: resourceData.ref
					};
				}
			}
		}

		return result;
	}

	async getActivityData(): Promise<VSBufferReadableStream> {
		if (!this.userDataSyncStoreUrl) {
			throw new Error('No settings sync store url configured.');
		}

		const url = joinPath(this.userDataSyncStoreUrl, 'download').toString();
		const headers: IHeaders = {};

		const context = await this.request(url, { type: 'GET', headers }, [], CancellationToken.None);

		if (!isSuccess(context)) {
			throw new UserDataSyncStoreError('Server returned ' + context.res.statusCode, url, UserDataSyncErrorCode.EmptyResponse, context.res.statusCode, context.res.headers[HEADER_OPERATION_ID]);
		}

		if (hasNoContent(context)) {
			throw new UserDataSyncStoreError('Empty response', url, UserDataSyncErrorCode.EmptyResponse, context.res.statusCode, context.res.headers[HEADER_OPERATION_ID]);
		}

		return context.stream;
	}

	private getResourceUrl(userDataSyncStoreUrl: URI, collection: string | undefined, resource: ServerResource): URI {
		return collection ? joinPath(userDataSyncStoreUrl, 'collection', collection, 'resource', resource) : joinPath(userDataSyncStoreUrl, 'resource', resource);
	}

	private clearSession(): void {
		this.storageService.remove(USER_SESSION_ID_KEY, StorageScope.APPLICATION);
		this.storageService.remove(MACHINE_SESSION_ID_KEY, StorageScope.APPLICATION);
	}

	private async request(url: string, options: IRequestOptions, successCodes: number[], token: CancellationToken): Promise<IRequestContext> {
		if (!this.authToken) {
			throw new UserDataSyncStoreError('No Auth Token Available', url, UserDataSyncErrorCode.Unauthorized, undefined, undefined);
		}

		if (this._donotMakeRequestsUntil && Date.now() < this._donotMakeRequestsUntil.getTime()) {
			throw new UserDataSyncStoreError(`${options.type} request '${url}' failed because of too many requests (429).`, url, UserDataSyncErrorCode.TooManyRequestsAndRetryAfter, undefined, undefined);
		}
		this.setDonotMakeRequestsUntil(undefined);

		const commonHeaders = await this.commonHeadersPromise;
		options.headers = {
			...(options.headers || {}),
			...commonHeaders,
			'X-Account-Type': this.authToken.type,
			'authorization': `Bearer ${this.authToken.token}`,
		};

		// Add session headers
		this.addSessionHeaders(options.headers);

		this.logService.trace('Sending request to server', { url, type: options.type, headers: { ...options.headers, ...{ authorization: undefined } } });

		let context;
		try {
			context = await this.session.request(url, options, token);
		} catch (e) {
			if (!(e instanceof UserDataSyncStoreError)) {
				let code = UserDataSyncErrorCode.RequestFailed;
				const errorMessage = getErrorMessage(e).toLowerCase();

				// Request timed out
				if (errorMessage.includes('xhr timeout')) {
					code = UserDataSyncErrorCode.RequestTimeout;
				}

				// Request protocol not supported
				else if (errorMessage.includes('protocol') && errorMessage.includes('not supported')) {
					code = UserDataSyncErrorCode.RequestProtocolNotSupported;
				}

				// Request path not escaped
				else if (errorMessage.includes('request path contains unescaped characters')) {
					code = UserDataSyncErrorCode.RequestPathNotEscaped;
				}

				// Request header not an object
				else if (errorMessage.includes('headers must be an object')) {
					code = UserDataSyncErrorCode.RequestHeadersNotObject;
				}

				// Request canceled
				else if (isCancellationError(e)) {
					code = UserDataSyncErrorCode.RequestCanceled;
				}

				e = new UserDataSyncStoreError(`Connection refused for the request '${url}'.`, url, code, undefined, undefined);
			}
			this.logService.info('Request failed', url);
			throw e;
		}

		const operationId = context.res.headers[HEADER_OPERATION_ID];
		const requestInfo = { url, status: context.res.statusCode, 'execution-id': options.headers[HEADER_EXECUTION_ID], 'operation-id': operationId };
		const isSuccess = isSuccessContext(context) || (context.res.statusCode && successCodes.includes(context.res.statusCode));
		let failureMessage = '';
		if (isSuccess) {
			this.logService.trace('Request succeeded', requestInfo);
		} else {
			failureMessage = await asText(context) || '';
			this.logService.info('Request failed', requestInfo, failureMessage);
		}

		if (context.res.statusCode === 401 || context.res.statusCode === 403) {
			this.authToken = undefined;
			if (context.res.statusCode === 401) {
				this._onTokenFailed.fire(UserDataSyncErrorCode.Unauthorized);
				throw new UserDataSyncStoreError(`${options.type} request '${url}' failed because of Unauthorized (401).`, url, UserDataSyncErrorCode.Unauthorized, context.res.statusCode, operationId);
			}
			if (context.res.statusCode === 403) {
				this._onTokenFailed.fire(UserDataSyncErrorCode.Forbidden);
				throw new UserDataSyncStoreError(`${options.type} request '${url}' failed because the access is forbidden (403).`, url, UserDataSyncErrorCode.Forbidden, context.res.statusCode, operationId);
			}
		}

		this._onTokenSucceed.fire();

		if (context.res.statusCode === 404) {
			throw new UserDataSyncStoreError(`${options.type} request '${url}' failed because the requested resource is not found (404).`, url, UserDataSyncErrorCode.NotFound, context.res.statusCode, operationId);
		}

		if (context.res.statusCode === 405) {
			throw new UserDataSyncStoreError(`${options.type} request '${url}' failed because the requested endpoint is not found (405). ${failureMessage}`, url, UserDataSyncErrorCode.MethodNotFound, context.res.statusCode, operationId);
		}

		if (context.res.statusCode === 409) {
			throw new UserDataSyncStoreError(`${options.type} request '${url}' failed because of Conflict (409). There is new data for this resource. Make the request again with latest data.`, url, UserDataSyncErrorCode.Conflict, context.res.statusCode, operationId);
		}

		if (context.res.statusCode === 410) {
			throw new UserDataSyncStoreError(`${options.type} request '${url}' failed because the requested resource is not longer available (410).`, url, UserDataSyncErrorCode.Gone, context.res.statusCode, operationId);
		}

		if (context.res.statusCode === 412) {
			throw new UserDataSyncStoreError(`${options.type} request '${url}' failed because of Precondition Failed (412). There is new data for this resource. Make the request again with latest data.`, url, UserDataSyncErrorCode.PreconditionFailed, context.res.statusCode, operationId);
		}

		if (context.res.statusCode === 413) {
			throw new UserDataSyncStoreError(`${options.type} request '${url}' failed because of too large payload (413).`, url, UserDataSyncErrorCode.TooLarge, context.res.statusCode, operationId);
		}

		if (context.res.statusCode === 426) {
			throw new UserDataSyncStoreError(`${options.type} request '${url}' failed with status Upgrade Required (426). Please upgrade the client and try again.`, url, UserDataSyncErrorCode.UpgradeRequired, context.res.statusCode, operationId);
		}

		if (context.res.statusCode === 429) {
			const retryAfter = context.res.headers['retry-after'];
			if (retryAfter) {
				this.setDonotMakeRequestsUntil(new Date(Date.now() + (parseInt(retryAfter) * 1000)));
				throw new UserDataSyncStoreError(`${options.type} request '${url}' failed because of too many requests (429).`, url, UserDataSyncErrorCode.TooManyRequestsAndRetryAfter, context.res.statusCode, operationId);
			} else {
				throw new UserDataSyncStoreError(`${options.type} request '${url}' failed because of too many requests (429).`, url, UserDataSyncErrorCode.TooManyRequests, context.res.statusCode, operationId);
			}
		}

		if (!isSuccess) {
			throw new UserDataSyncStoreError('Server returned ' + context.res.statusCode, url, UserDataSyncErrorCode.Unknown, context.res.statusCode, operationId);
		}

		return context;
	}

	private addSessionHeaders(headers: IHeaders): void {
		let machineSessionId = this.storageService.get(MACHINE_SESSION_ID_KEY, StorageScope.APPLICATION);
		if (machineSessionId === undefined) {
			machineSessionId = generateUuid();
			this.storageService.store(MACHINE_SESSION_ID_KEY, machineSessionId, StorageScope.APPLICATION, StorageTarget.MACHINE);
		}
		headers['X-Machine-Session-Id'] = machineSessionId;

		const userSessionId = this.storageService.get(USER_SESSION_ID_KEY, StorageScope.APPLICATION);
		if (userSessionId !== undefined) {
			headers['X-User-Session-Id'] = userSessionId;
		}
	}

}

export class UserDataSyncStoreService extends UserDataSyncStoreClient implements IUserDataSyncStoreService {

	_serviceBrand: undefined;

	constructor(
		@IUserDataSyncStoreManagementService userDataSyncStoreManagementService: IUserDataSyncStoreManagementService,
		@IProductService productService: IProductService,
		@IRequestService requestService: IRequestService,
		@IUserDataSyncLogService logService: IUserDataSyncLogService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@IFileService fileService: IFileService,
		@IStorageService storageService: IStorageService,
	) {
		super(userDataSyncStoreManagementService.userDataSyncStore?.url, productService, requestService, logService, environmentService, fileService, storageService);
		this._register(userDataSyncStoreManagementService.onDidChangeUserDataSyncStore(() => this.updateUserDataSyncStoreUrl(userDataSyncStoreManagementService.userDataSyncStore?.url)));
	}

}

export class RequestsSession {

	private requests: string[] = [];
	private startTime: Date | undefined = undefined;

	constructor(
		private readonly limit: number,
		private readonly interval: number, /* in ms */
		private readonly requestService: IRequestService,
		private readonly logService: IUserDataSyncLogService,
	) { }

	request(url: string, options: IRequestOptions, token: CancellationToken): Promise<IRequestContext> {
		if (this.isExpired()) {
			this.reset();
		}

		options.url = url;

		if (this.requests.length >= this.limit) {
			this.logService.info('Too many requests', ...this.requests);
			throw new UserDataSyncStoreError(`Too many requests. Only ${this.limit} requests allowed in ${this.interval / (1000 * 60)} minutes.`, url, UserDataSyncErrorCode.LocalTooManyRequests, undefined, undefined);
		}

		this.startTime = this.startTime || new Date();
		this.requests.push(url);

		return this.requestService.request(options, token);
	}

	private isExpired(): boolean {
		return this.startTime !== undefined && new Date().getTime() - this.startTime.getTime() > this.interval;
	}

	private reset(): void {
		this.requests = [];
		this.startTime = undefined;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/promptsSync/promptsMerge.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/promptsSync/promptsMerge.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStringDictionary } from '../../../../base/common/collections.js';

export interface IMergeResult {
	local: {
		added: IStringDictionary<string>;
		updated: IStringDictionary<string>;
		removed: string[];
	};
	remote: {
		added: IStringDictionary<string>;
		updated: IStringDictionary<string>;
		removed: string[];
	};
	conflicts: string[];
}

export function merge(local: IStringDictionary<string>, remote: IStringDictionary<string> | null, base: IStringDictionary<string> | null): IMergeResult {
	const localAdded: IStringDictionary<string> = {};
	const localUpdated: IStringDictionary<string> = {};
	const localRemoved: Set<string> = new Set<string>();

	if (!remote) {
		return {
			local: { added: localAdded, updated: localUpdated, removed: [...localRemoved.values()] },
			remote: { added: local, updated: {}, removed: [] },
			conflicts: []
		};
	}

	const localToRemote = compare(local, remote);
	if (localToRemote.added.size === 0 && localToRemote.removed.size === 0 && localToRemote.updated.size === 0) {
		// No changes found between local and remote.
		return {
			local: { added: localAdded, updated: localUpdated, removed: [...localRemoved.values()] },
			remote: { added: {}, updated: {}, removed: [] },
			conflicts: []
		};
	}

	const baseToLocal = compare(base, local);
	const baseToRemote = compare(base, remote);

	const remoteAdded: IStringDictionary<string> = {};
	const remoteUpdated: IStringDictionary<string> = {};
	const remoteRemoved: Set<string> = new Set<string>();

	const conflicts: Set<string> = new Set<string>();

	// Removed prompts in Local
	for (const key of baseToLocal.removed.values()) {
		// Conflict - Got updated in remote.
		if (baseToRemote.updated.has(key)) {
			// Add to local
			localAdded[key] = remote[key];
		}
		// Remove it in remote
		else {
			remoteRemoved.add(key);
		}
	}

	// Removed prompts in Remote
	for (const key of baseToRemote.removed.values()) {
		if (conflicts.has(key)) {
			continue;
		}
		// Conflict - Got updated in local
		if (baseToLocal.updated.has(key)) {
			conflicts.add(key);
		}
		// Also remove in Local
		else {
			localRemoved.add(key);
		}
	}

	// Updated prompts in Local
	for (const key of baseToLocal.updated.values()) {
		if (conflicts.has(key)) {
			continue;
		}
		// Got updated in remote
		if (baseToRemote.updated.has(key)) {
			// Has different value
			if (localToRemote.updated.has(key)) {
				conflicts.add(key);
			}
		} else {
			remoteUpdated[key] = local[key];
		}
	}

	// Updated prompts in Remote
	for (const key of baseToRemote.updated.values()) {
		if (conflicts.has(key)) {
			continue;
		}
		// Got updated in local
		if (baseToLocal.updated.has(key)) {
			// Has different value
			if (localToRemote.updated.has(key)) {
				conflicts.add(key);
			}
		} else if (local[key] !== undefined) {
			localUpdated[key] = remote[key];
		}
	}

	// Added prompts in Local
	for (const key of baseToLocal.added.values()) {
		if (conflicts.has(key)) {
			continue;
		}
		// Got added in remote
		if (baseToRemote.added.has(key)) {
			// Has different value
			if (localToRemote.updated.has(key)) {
				conflicts.add(key);
			}
		} else {
			remoteAdded[key] = local[key];
		}
	}

	// Added prompts in remote
	for (const key of baseToRemote.added.values()) {
		if (conflicts.has(key)) {
			continue;
		}
		// Got added in local
		if (baseToLocal.added.has(key)) {
			// Has different value
			if (localToRemote.updated.has(key)) {
				conflicts.add(key);
			}
		} else {
			localAdded[key] = remote[key];
		}
	}

	return {
		local: { added: localAdded, removed: [...localRemoved.values()], updated: localUpdated },
		remote: { added: remoteAdded, removed: [...remoteRemoved.values()], updated: remoteUpdated },
		conflicts: [...conflicts.values()],
	};
}

function compare(from: IStringDictionary<string> | null, to: IStringDictionary<string> | null): { added: Set<string>; removed: Set<string>; updated: Set<string> } {
	const fromKeys = from ? Object.keys(from) : [];
	const toKeys = to ? Object.keys(to) : [];
	const added = toKeys.filter(key => !fromKeys.includes(key)).reduce((r, key) => { r.add(key); return r; }, new Set<string>());
	const removed = fromKeys.filter(key => !toKeys.includes(key)).reduce((r, key) => { r.add(key); return r; }, new Set<string>());
	const updated: Set<string> = new Set<string>();

	for (const key of fromKeys) {
		if (removed.has(key)) {
			continue;
		}
		const fromPrompt = from![key];
		const toPrompt = to![key];
		if (fromPrompt !== toPrompt) {
			updated.add(key);
		}
	}

	return { added, removed, updated };
}

export function areSame(a: IStringDictionary<string>, b: IStringDictionary<string>): boolean {
	const { added, removed, updated } = compare(a, b);
	return added.size === 0 && removed.size === 0 && updated.size === 0;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/promptsSync/promptsSync.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/promptsSync/promptsSync.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { Event } from '../../../../base/common/event.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { deepClone } from '../../../../base/common/objects.js';
import { IStorageService } from '../../../storage/common/storage.js';
import { ITelemetryService } from '../../../telemetry/common/telemetry.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IUriIdentityService } from '../../../uriIdentity/common/uriIdentity.js';
import { IEnvironmentService } from '../../../environment/common/environment.js';

import { IUserDataProfile } from '../../../userDataProfile/common/userDataProfile.js';
import { IConfigurationService } from '../../../configuration/common/configuration.js';
import { areSame, IMergeResult as IPromptsMergeResult, merge } from './promptsMerge.js';
import { AbstractSynchroniser, IAcceptResult, IFileResourcePreview, IMergeResult } from '../abstractSynchronizer.js';
import { FileOperationError, FileOperationResult, IFileContent, IFileService, IFileStat } from '../../../files/common/files.js';
import { Change, IRemoteUserData, ISyncData, IUserDataSyncLocalStoreService, IUserDataSynchroniser, IUserDataSyncLogService, IUserDataSyncEnablementService, IUserDataSyncStoreService, SyncResource, USER_DATA_SYNC_SCHEME } from '../userDataSync.js';

interface IPromptsResourcePreview extends IFileResourcePreview {
	previewResult: IMergeResult;
}

interface IPromptsAcceptedResourcePreview extends IFileResourcePreview {
	acceptResult: IAcceptResult;
}

export function parsePrompts(syncData: ISyncData): IStringDictionary<string> {
	return JSON.parse(syncData.content);
}

/**
 * Synchronizer class for the "user" prompt files.
 * Adopted from {@link SnippetsSynchroniser}.
 */
export class PromptsSynchronizer extends AbstractSynchroniser implements IUserDataSynchroniser {

	protected readonly version: number = 1;
	private readonly promptsFolder: URI;

	constructor(
		profile: IUserDataProfile,
		collection: string | undefined,
		@IEnvironmentService environmentService: IEnvironmentService,
		@IFileService fileService: IFileService,
		@IStorageService storageService: IStorageService,
		@IUserDataSyncStoreService userDataSyncStoreService: IUserDataSyncStoreService,
		@IUserDataSyncLocalStoreService userDataSyncLocalStoreService: IUserDataSyncLocalStoreService,
		@IUserDataSyncLogService logService: IUserDataSyncLogService,
		@IConfigurationService configurationService: IConfigurationService,
		@IUserDataSyncEnablementService userDataSyncEnablementService: IUserDataSyncEnablementService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
	) {
		const syncResource = { syncResource: SyncResource.Prompts, profile };
		super(
			syncResource,
			collection,
			fileService,
			environmentService,
			storageService,
			userDataSyncStoreService,
			userDataSyncLocalStoreService,
			userDataSyncEnablementService,
			telemetryService,
			logService,
			configurationService,
			uriIdentityService,
		);

		this.promptsFolder = profile.promptsHome;
		this._register(this.fileService.watch(environmentService.userRoamingDataHome));
		this._register(this.fileService.watch(this.promptsFolder));
		this._register(Event.filter(this.fileService.onDidFilesChange, e => e.affects(this.promptsFolder))(() => this.triggerLocalChange()));
	}

	protected async generateSyncPreview(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, isRemoteDataFromCurrentMachine: boolean): Promise<IPromptsResourcePreview[]> {
		const local = await this.getPromptsFileContents();
		const localPrompts = this.toPromptContents(local);
		const remotePrompts: IStringDictionary<string> | null = remoteUserData.syncData ? this.parsePrompts(remoteUserData.syncData) : null;

		// Use remote data as last sync data if last sync data does not exist and remote data is from same machine
		lastSyncUserData = lastSyncUserData === null && isRemoteDataFromCurrentMachine ? remoteUserData : lastSyncUserData;
		const lastSyncPrompts: IStringDictionary<string> | null = lastSyncUserData && lastSyncUserData.syncData ? this.parsePrompts(lastSyncUserData.syncData) : null;

		if (remotePrompts) {
			this.logService.trace(`${this.syncResourceLogLabel}: Merging remote prompts with local prompts...`);
		} else {
			this.logService.trace(`${this.syncResourceLogLabel}: Remote prompts does not exist. Synchronizing prompts for the first time.`);
		}

		const mergeResult = merge(localPrompts, remotePrompts, lastSyncPrompts);
		return this.getResourcePreviews(mergeResult, local, remotePrompts || {}, lastSyncPrompts || {});
	}

	protected async hasRemoteChanged(lastSyncUserData: IRemoteUserData): Promise<boolean> {
		const lastSync: IStringDictionary<string> | null = lastSyncUserData.syncData ? this.parsePrompts(lastSyncUserData.syncData) : null;
		if (lastSync === null) {
			return true;
		}
		const local = await this.getPromptsFileContents();
		const localPrompts = this.toPromptContents(local);
		const mergeResult = merge(localPrompts, lastSync, lastSync);
		return Object.keys(mergeResult.remote.added).length > 0 || Object.keys(mergeResult.remote.updated).length > 0 || mergeResult.remote.removed.length > 0 || mergeResult.conflicts.length > 0;
	}

	protected async getMergeResult(resourcePreview: IPromptsResourcePreview, token: CancellationToken): Promise<IMergeResult> {
		return resourcePreview.previewResult;
	}

	protected async getAcceptResult(resourcePreview: IPromptsResourcePreview, resource: URI, content: string | null | undefined, token: CancellationToken): Promise<IAcceptResult> {

		/* Accept local resource */
		if (this.extUri.isEqualOrParent(resource, this.syncPreviewFolder.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' }))) {
			return {
				content: resourcePreview.fileContent ? resourcePreview.fileContent.value.toString() : null,
				localChange: Change.None,
				remoteChange: resourcePreview.fileContent
					? resourcePreview.remoteContent !== null ? Change.Modified : Change.Added
					: Change.Deleted
			};
		}

		/* Accept remote resource */
		if (this.extUri.isEqualOrParent(resource, this.syncPreviewFolder.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' }))) {
			return {
				content: resourcePreview.remoteContent,
				localChange: resourcePreview.remoteContent !== null
					? resourcePreview.fileContent ? Change.Modified : Change.Added
					: Change.Deleted,
				remoteChange: Change.None,
			};
		}

		/* Accept preview resource */
		if (this.extUri.isEqualOrParent(resource, this.syncPreviewFolder)) {
			if (content === undefined) {
				return {
					content: resourcePreview.previewResult.content,
					localChange: resourcePreview.previewResult.localChange,
					remoteChange: resourcePreview.previewResult.remoteChange,
				};
			} else {
				return {
					content,
					localChange: content === null
						? resourcePreview.fileContent !== null ? Change.Deleted : Change.None
						: Change.Modified,
					remoteChange: content === null
						? resourcePreview.remoteContent !== null ? Change.Deleted : Change.None
						: Change.Modified
				};
			}
		}

		throw new Error(`Invalid Resource: ${resource.toString()}`);
	}

	protected async applyResult(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, resourcePreviews: [IPromptsResourcePreview, IAcceptResult][], force: boolean): Promise<void> {
		const accptedResourcePreviews: IPromptsAcceptedResourcePreview[] = resourcePreviews.map(([resourcePreview, acceptResult]) => ({ ...resourcePreview, acceptResult }));
		if (accptedResourcePreviews.every(({ localChange, remoteChange }) => localChange === Change.None && remoteChange === Change.None)) {
			this.logService.info(`${this.syncResourceLogLabel}: No changes found during synchronizing prompts.`);
		}

		if (accptedResourcePreviews.some(({ localChange }) => localChange !== Change.None)) {
			// back up all prompts
			await this.updateLocalBackup(accptedResourcePreviews);
			await this.updateLocalPrompts(accptedResourcePreviews, force);
		}

		if (accptedResourcePreviews.some(({ remoteChange }) => remoteChange !== Change.None)) {
			remoteUserData = await this.updateRemotePrompts(accptedResourcePreviews, remoteUserData, force);
		}

		if (lastSyncUserData?.ref !== remoteUserData.ref) {
			// update last sync
			this.logService.trace(`${this.syncResourceLogLabel}: Updating last synchronized prompts...`);
			await this.updateLastSyncUserData(remoteUserData);
			this.logService.info(`${this.syncResourceLogLabel}: Updated last synchronized prompts`);
		}

		for (const { previewResource } of accptedResourcePreviews) {
			// Delete the preview
			try {
				await this.fileService.del(previewResource);
			} catch (e) { /* ignore */ }
		}

	}

	private getResourcePreviews(
		mergeResult: IPromptsMergeResult,
		localFileContent: IStringDictionary<IFileContent>,
		remote: IStringDictionary<string>,
		base: IStringDictionary<string>,
	): IPromptsResourcePreview[] {
		const resourcePreviews: Map<string, IPromptsResourcePreview> = new Map<string, IPromptsResourcePreview>();

		/* Prompts added remotely -> add locally */
		for (const key of Object.keys(mergeResult.local.added)) {
			const previewResult: IMergeResult = {
				content: mergeResult.local.added[key],
				hasConflicts: false,
				localChange: Change.Added,
				remoteChange: Change.None,
			};
			resourcePreviews.set(key, {
				baseResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' }),
				baseContent: null,
				fileContent: null,
				localResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' }),
				localContent: null,
				remoteResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' }),
				remoteContent: remote[key],
				previewResource: this.extUri.joinPath(this.syncPreviewFolder, key),
				previewResult,
				localChange: previewResult.localChange,
				remoteChange: previewResult.remoteChange,
				acceptedResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' })
			});
		}

		/* Prompts updated remotely -> update locally */
		for (const key of Object.keys(mergeResult.local.updated)) {
			const previewResult: IMergeResult = {
				content: mergeResult.local.updated[key],
				hasConflicts: false,
				localChange: Change.Modified,
				remoteChange: Change.None,
			};
			const localContent = localFileContent[key] ? localFileContent[key].value.toString() : null;
			resourcePreviews.set(key, {
				baseResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' }),
				baseContent: base[key] ?? null,
				localResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' }),
				fileContent: localFileContent[key],
				localContent,
				remoteResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' }),
				remoteContent: remote[key],
				previewResource: this.extUri.joinPath(this.syncPreviewFolder, key),
				previewResult,
				localChange: previewResult.localChange,
				remoteChange: previewResult.remoteChange,
				acceptedResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' })
			});
		}

		/* Prompts removed remotely -> remove locally */
		for (const key of mergeResult.local.removed) {
			const previewResult: IMergeResult = {
				content: null,
				hasConflicts: false,
				localChange: Change.Deleted,
				remoteChange: Change.None,
			};
			const localContent = localFileContent[key] ? localFileContent[key].value.toString() : null;
			resourcePreviews.set(key, {
				baseResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' }),
				baseContent: base[key] ?? null,
				localResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' }),
				fileContent: localFileContent[key],
				localContent,
				remoteResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' }),
				remoteContent: null,
				previewResource: this.extUri.joinPath(this.syncPreviewFolder, key),
				previewResult,
				localChange: previewResult.localChange,
				remoteChange: previewResult.remoteChange,
				acceptedResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' })
			});
		}

		/* Prompts added locally -> add remotely */
		for (const key of Object.keys(mergeResult.remote.added)) {
			const previewResult: IMergeResult = {
				content: mergeResult.remote.added[key],
				hasConflicts: false,
				localChange: Change.None,
				remoteChange: Change.Added,
			};
			const localContent = localFileContent[key] ? localFileContent[key].value.toString() : null;
			resourcePreviews.set(key, {
				baseResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' }),
				baseContent: base[key] ?? null,
				localResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' }),
				fileContent: localFileContent[key],
				localContent,
				remoteResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' }),
				remoteContent: null,
				previewResource: this.extUri.joinPath(this.syncPreviewFolder, key),
				previewResult,
				localChange: previewResult.localChange,
				remoteChange: previewResult.remoteChange,
				acceptedResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' })
			});
		}

		/* Prompts updated locally -> update remotely */
		for (const key of Object.keys(mergeResult.remote.updated)) {
			const previewResult: IMergeResult = {
				content: mergeResult.remote.updated[key],
				hasConflicts: false,
				localChange: Change.None,
				remoteChange: Change.Modified,
			};
			const localContent = localFileContent[key] ? localFileContent[key].value.toString() : null;
			resourcePreviews.set(key, {
				baseResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' }),
				baseContent: base[key] ?? null,
				localResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' }),
				fileContent: localFileContent[key],
				localContent,
				remoteResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' }),
				remoteContent: remote[key],
				previewResource: this.extUri.joinPath(this.syncPreviewFolder, key),
				previewResult,
				localChange: previewResult.localChange,
				remoteChange: previewResult.remoteChange,
				acceptedResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' })
			});
		}

		/* Prompts removed locally -> remove remotely */
		for (const key of mergeResult.remote.removed) {
			const previewResult: IMergeResult = {
				content: null,
				hasConflicts: false,
				localChange: Change.None,
				remoteChange: Change.Deleted,
			};
			resourcePreviews.set(key, {
				baseResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' }),
				baseContent: base[key] ?? null,
				localResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' }),
				fileContent: null,
				localContent: null,
				remoteResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' }),
				remoteContent: remote[key],
				previewResource: this.extUri.joinPath(this.syncPreviewFolder, key),
				previewResult,
				localChange: previewResult.localChange,
				remoteChange: previewResult.remoteChange,
				acceptedResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' })
			});
		}

		/* Prompts with conflicts */
		for (const key of mergeResult.conflicts) {
			const previewResult: IMergeResult = {
				content: base[key] ?? null,
				hasConflicts: true,
				localChange: localFileContent[key] ? Change.Modified : Change.Added,
				remoteChange: remote[key] ? Change.Modified : Change.Added
			};
			const localContent = localFileContent[key] ? localFileContent[key].value.toString() : null;
			resourcePreviews.set(key, {
				baseResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' }),
				baseContent: base[key] ?? null,
				localResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' }),
				fileContent: localFileContent[key] || null,
				localContent,
				remoteResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' }),
				remoteContent: remote[key] || null,
				previewResource: this.extUri.joinPath(this.syncPreviewFolder, key),
				previewResult,
				localChange: previewResult.localChange,
				remoteChange: previewResult.remoteChange,
				acceptedResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' })
			});
		}

		/* Unmodified Prompts */
		for (const key of Object.keys(localFileContent)) {
			if (!resourcePreviews.has(key)) {
				const previewResult: IMergeResult = {
					content: localFileContent[key] ? localFileContent[key].value.toString() : null,
					hasConflicts: false,
					localChange: Change.None,
					remoteChange: Change.None
				};
				const localContent = localFileContent[key] ? localFileContent[key].value.toString() : null;
				resourcePreviews.set(key, {
					baseResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' }),
					baseContent: base[key] ?? null,
					localResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' }),
					fileContent: localFileContent[key] || null,
					localContent,
					remoteResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' }),
					remoteContent: remote[key] || null,
					previewResource: this.extUri.joinPath(this.syncPreviewFolder, key),
					previewResult,
					localChange: previewResult.localChange,
					remoteChange: previewResult.remoteChange,
					acceptedResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' })
				});
			}
		}

		return [...resourcePreviews.values()];
	}

	override async resolveContent(uri: URI): Promise<string | null> {
		if (this.extUri.isEqualOrParent(uri, this.syncPreviewFolder.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' }))
			|| this.extUri.isEqualOrParent(uri, this.syncPreviewFolder.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' }))
			|| this.extUri.isEqualOrParent(uri, this.syncPreviewFolder.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' }))
			|| this.extUri.isEqualOrParent(uri, this.syncPreviewFolder.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' }))) {
			return this.resolvePreviewContent(uri);
		}
		return null;
	}

	async hasLocalData(): Promise<boolean> {
		try {
			const local = await this.getPromptsFileContents();
			if (Object.keys(local).length) {
				return true;
			}
		} catch (error) {
			/* ignore error */
		}
		return false;
	}

	private async updateLocalBackup(resourcePreviews: IFileResourcePreview[]): Promise<void> {
		const local: IStringDictionary<IFileContent> = {};
		for (const resourcePreview of resourcePreviews) {
			if (resourcePreview.fileContent) {
				local[this.extUri.basename(resourcePreview.localResource)] = resourcePreview.fileContent;
			}
		}
		await this.backupLocal(JSON.stringify(this.toPromptContents(local)));
	}

	private async updateLocalPrompts(resourcePreviews: IPromptsAcceptedResourcePreview[], force: boolean): Promise<void> {
		for (const { fileContent, acceptResult, localResource, remoteResource, localChange } of resourcePreviews) {
			if (localChange !== Change.None) {
				const key = remoteResource ? this.extUri.basename(remoteResource) : this.extUri.basename(localResource);
				const resource = this.extUri.joinPath(this.promptsFolder, key);

				// Removed
				if (localChange === Change.Deleted) {
					this.logService.trace(`${this.syncResourceLogLabel}: Deleting prompt...`, this.extUri.basename(resource));
					await this.fileService.del(resource);
					this.logService.info(`${this.syncResourceLogLabel}: Deleted prompt`, this.extUri.basename(resource));
				}

				// Added
				else if (localChange === Change.Added) {
					this.logService.trace(`${this.syncResourceLogLabel}: Creating prompt...`, this.extUri.basename(resource));
					await this.fileService.createFile(resource, VSBuffer.fromString(acceptResult.content!), { overwrite: force });
					this.logService.info(`${this.syncResourceLogLabel}: Created prompt`, this.extUri.basename(resource));
				}

				// Updated
				else {
					this.logService.trace(`${this.syncResourceLogLabel}: Updating prompt...`, this.extUri.basename(resource));
					await this.fileService.writeFile(resource, VSBuffer.fromString(acceptResult.content!), force ? undefined : fileContent!);
					this.logService.info(`${this.syncResourceLogLabel}: Updated prompt`, this.extUri.basename(resource));
				}
			}
		}
	}

	private async updateRemotePrompts(resourcePreviews: IPromptsAcceptedResourcePreview[], remoteUserData: IRemoteUserData, forcePush: boolean): Promise<IRemoteUserData> {
		const currentPrompts: IStringDictionary<string> = remoteUserData.syncData ? this.parsePrompts(remoteUserData.syncData) : {};
		const newPrompts: IStringDictionary<string> = deepClone(currentPrompts);

		for (const { acceptResult, localResource, remoteResource, remoteChange } of resourcePreviews) {
			if (remoteChange !== Change.None) {
				const key = localResource ? this.extUri.basename(localResource) : this.extUri.basename(remoteResource);
				if (remoteChange === Change.Deleted) {
					delete newPrompts[key];
				} else {
					newPrompts[key] = acceptResult.content!;
				}
			}
		}

		if (!areSame(currentPrompts, newPrompts)) {
			// update remote
			this.logService.trace(`${this.syncResourceLogLabel}: Updating remote prompts...`);
			remoteUserData = await this.updateRemoteUserData(JSON.stringify(newPrompts), forcePush ? null : remoteUserData.ref);
			this.logService.info(`${this.syncResourceLogLabel}: Updated remote prompts`);
		}
		return remoteUserData;
	}

	private parsePrompts(syncData: ISyncData): IStringDictionary<string> {
		return parsePrompts(syncData);
	}

	private toPromptContents(fileContents: IStringDictionary<IFileContent>): IStringDictionary<string> {
		const prompts: IStringDictionary<string> = {};
		for (const key of Object.keys(fileContents)) {
			prompts[key] = fileContents[key].value.toString();
		}
		return prompts;
	}

	private async getPromptsFileContents(): Promise<IStringDictionary<IFileContent>> {
		const prompts: IStringDictionary<IFileContent> = {};
		let stat: IFileStat;
		try {
			stat = await this.fileService.resolve(this.promptsFolder);
		} catch (e) {
			// No prompts
			if (e instanceof FileOperationError && e.fileOperationResult === FileOperationResult.FILE_NOT_FOUND) {
				return prompts;
			} else {
				throw e;
			}
		}
		for (const entry of stat.children || []) {
			const resource = entry.resource;
			const path = resource.path;
			if (['.prompt.md', '.instructions.md', '.chatmode.md', '.agent.md'].some(ext => path.endsWith(ext))) {
				const key = this.extUri.relativePath(this.promptsFolder, resource)!;
				const content = await this.fileService.readFile(resource);
				prompts[key] = content;
			}
		}

		return prompts;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/node/userDataAutoSyncService.ts]---
Location: vscode-main/src/vs/platform/userDataSync/node/userDataAutoSyncService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
//
import { Event } from '../../../base/common/event.js';
import { INativeHostService } from '../../native/common/native.js';
import { IProductService } from '../../product/common/productService.js';
import { IStorageService } from '../../storage/common/storage.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { UserDataAutoSyncService as BaseUserDataAutoSyncService } from '../common/userDataAutoSyncService.js';
import { IUserDataSyncEnablementService, IUserDataSyncLogService, IUserDataSyncService, IUserDataSyncStoreManagementService, IUserDataSyncStoreService } from '../common/userDataSync.js';
import { IUserDataSyncAccountService } from '../common/userDataSyncAccount.js';
import { IUserDataSyncMachinesService } from '../common/userDataSyncMachines.js';

export class UserDataAutoSyncService extends BaseUserDataAutoSyncService {

	constructor(
		@IProductService productService: IProductService,
		@IUserDataSyncStoreManagementService userDataSyncStoreManagementService: IUserDataSyncStoreManagementService,
		@IUserDataSyncStoreService userDataSyncStoreService: IUserDataSyncStoreService,
		@IUserDataSyncEnablementService userDataSyncEnablementService: IUserDataSyncEnablementService,
		@IUserDataSyncService userDataSyncService: IUserDataSyncService,
		@INativeHostService nativeHostService: INativeHostService,
		@IUserDataSyncLogService logService: IUserDataSyncLogService,
		@IUserDataSyncAccountService authTokenService: IUserDataSyncAccountService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IUserDataSyncMachinesService userDataSyncMachinesService: IUserDataSyncMachinesService,
		@IStorageService storageService: IStorageService,
	) {
		super(productService, userDataSyncStoreManagementService, userDataSyncStoreService, userDataSyncEnablementService, userDataSyncService, logService, authTokenService, telemetryService, userDataSyncMachinesService, storageService);

		this._register(Event.debounce<string, string[]>(Event.any<string>(
			Event.map(nativeHostService.onDidFocusMainWindow, () => 'windowFocus'),
			Event.map(nativeHostService.onDidOpenMainWindow, () => 'windowOpen'),
		), (last, source) => last ? [...last, source] : [source], 1000)(sources => this.triggerSync(sources, { skipIfSyncedRecently: true })));
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/test/common/extensionsMerge.test.ts]---
Location: vscode-main/src/vs/platform/userDataSync/test/common/extensionsMerge.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { merge } from '../../common/extensionsMerge.js';
import { ILocalSyncExtension, ISyncExtension } from '../../common/userDataSync.js';

suite('ExtensionsMerge', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('merge returns local extension if remote does not exist', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aLocalSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aLocalSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];

		const actual = merge(localExtensions, null, null, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, localExtensions);
	});

	test('merge returns local extension if remote does not exist with ignored extensions', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aLocalSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aLocalSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];
		const expected = [
			localExtensions[1],
			localExtensions[2],
		];

		const actual = merge(localExtensions, null, null, [], ['a'], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, expected);
	});

	test('merge returns local extension if remote does not exist with ignored extensions (ignore case)', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aLocalSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aLocalSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];
		const expected = [
			localExtensions[1],
			localExtensions[2],
		];

		const actual = merge(localExtensions, null, null, [], ['A'], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, expected);
	});

	test('merge returns local extension if remote does not exist with skipped extensions', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aLocalSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aLocalSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];
		const skippedExtension = [
			aSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
		];
		const expected = [...localExtensions];

		const actual = merge(localExtensions, null, null, skippedExtension, [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, expected);
	});

	test('merge returns local extension if remote does not exist with skipped and ignored extensions', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aLocalSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aLocalSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];
		const skippedExtension = [
			aSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
		];
		const expected = [localExtensions[1], localExtensions[2]];

		const actual = merge(localExtensions, null, null, skippedExtension, ['a'], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, expected);
	});

	test('merge local and remote extensions when there is no base', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aLocalSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const remoteExtensions = [
			aSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];
		const expected = [
			anExpectedSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			anExpectedSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
			anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			anExpectedSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, null, [], [], []);

		assert.deepStrictEqual(actual.local.added, [
			anExpectedSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			anExpectedSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		]);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, expected);
	});

	test('merge local and remote extensions when there is no base and with ignored extensions', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aLocalSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const remoteExtensions = [
			aSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];
		const expected = [
			anExpectedSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			anExpectedSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
			anExpectedSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, null, [], ['a'], []);

		assert.deepStrictEqual(actual.local.added, [
			anExpectedSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			anExpectedSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		]);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, expected);
	});

	test('merge local and remote extensions when remote is moved forwarded', () => {
		const baseExtensions = [
			aSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aLocalSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const remoteExtensions = [
			aSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, [
			anExpectedSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			anExpectedSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		]);
		assert.deepStrictEqual(actual.local.removed, [{ id: 'a', uuid: 'a' }, { id: 'd', uuid: 'd' }]);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.strictEqual(actual.remote, null);
	});

	test('merge local and remote extensions when remote is moved forwarded with disabled extension', () => {
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aRemoteSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aLocalSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aRemoteSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
			aRemoteSyncExtension({ identifier: { id: 'd', uuid: 'd' }, disabled: true }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, [
			anExpectedSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			anExpectedSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		]);
		assert.deepStrictEqual(actual.local.removed, [{ id: 'a', uuid: 'a' }]);
		assert.deepStrictEqual(actual.local.updated, [anExpectedSyncExtension({ identifier: { id: 'd', uuid: 'd' }, disabled: true })]);
		assert.strictEqual(actual.remote, null);
	});

	test('merge local and remote extensions when remote moved forwarded with ignored extensions', () => {
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aRemoteSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aLocalSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aRemoteSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, [], ['a'], []);

		assert.deepStrictEqual(actual.local.added, [
			anExpectedSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			anExpectedSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		]);
		assert.deepStrictEqual(actual.local.removed, [{ id: 'd', uuid: 'd' }]);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.strictEqual(actual.remote, null);
	});

	test('merge local and remote extensions when remote is moved forwarded with skipped extensions', () => {
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aRemoteSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const skippedExtensions = [
			aSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aRemoteSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, skippedExtensions, [], []);

		assert.deepStrictEqual(actual.local.added, [
			anExpectedSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			anExpectedSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		]);
		assert.deepStrictEqual(actual.local.removed, [{ id: 'd', uuid: 'd' }]);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.strictEqual(actual.remote, null);
	});

	test('merge local and remote extensions when remote is moved forwarded with skipped and ignored extensions', () => {
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aRemoteSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const skippedExtensions = [
			aSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aRemoteSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, skippedExtensions, ['b'], []);

		assert.deepStrictEqual(actual.local.added, [anExpectedSyncExtension({ identifier: { id: 'c', uuid: 'c' } })]);
		assert.deepStrictEqual(actual.local.removed, [{ id: 'd', uuid: 'd' }]);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.strictEqual(actual.remote, null);
	});

	test('merge local and remote extensions when local is moved forwarded', () => {
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aRemoteSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aLocalSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aRemoteSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const expected = [
			anExpectedSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			anExpectedSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, expected);
	});

	test('merge local and remote extensions when local is moved forwarded with disabled extensions', () => {
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aRemoteSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, disabled: true }),
			aLocalSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aLocalSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aRemoteSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const expected = [
			anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, disabled: true }),
			anExpectedSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			anExpectedSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, expected);
	});

	test('merge local and remote extensions when local is moved forwarded with ignored settings', () => {
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aRemoteSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aLocalSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aRemoteSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, [], ['b'], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, [
			anExpectedSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		]);
	});

	test('merge local and remote extensions when local is moved forwarded with skipped extensions', () => {
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aRemoteSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const skippedExtensions = [
			aSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aLocalSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aRemoteSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const expected = [
			anExpectedSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
			anExpectedSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			anExpectedSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, skippedExtensions, [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, expected);
	});

	test('merge local and remote extensions when local is moved forwarded with skipped and ignored extensions', () => {
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aRemoteSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const skippedExtensions = [
			aSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aLocalSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aRemoteSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const expected = [
			anExpectedSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
			anExpectedSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, skippedExtensions, ['c'], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, expected);
	});

	test('merge local and remote extensions when both moved forwarded', () => {
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aRemoteSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aLocalSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aLocalSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
			aRemoteSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aRemoteSyncExtension({ identifier: { id: 'e', uuid: 'e' } }),
		];
		const expected = [
			anExpectedSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			anExpectedSyncExtension({ identifier: { id: 'e', uuid: 'e' } }),
			anExpectedSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, [anExpectedSyncExtension({ identifier: { id: 'e', uuid: 'e' } })]);
		assert.deepStrictEqual(actual.local.removed, [{ id: 'a', uuid: 'a' }]);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, expected);
	});

	test('merge local and remote extensions when both moved forwarded with ignored extensions', () => {
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aRemoteSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aLocalSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aLocalSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
			aRemoteSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aRemoteSyncExtension({ identifier: { id: 'e', uuid: 'e' } }),
		];
		const expected = [
			anExpectedSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			anExpectedSyncExtension({ identifier: { id: 'e', uuid: 'e' } }),
			anExpectedSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, [], ['a', 'e'], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, expected);
	});

	test('merge local and remote extensions when both moved forwarded with skipped extensions', () => {
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aRemoteSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const skippedExtensions = [
			aSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aLocalSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
			aRemoteSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aRemoteSyncExtension({ identifier: { id: 'e', uuid: 'e' } }),
		];
		const expected = [
			anExpectedSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			anExpectedSyncExtension({ identifier: { id: 'e', uuid: 'e' } }),
			anExpectedSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, skippedExtensions, [], []);

		assert.deepStrictEqual(actual.local.added, [anExpectedSyncExtension({ identifier: { id: 'e', uuid: 'e' } })]);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, expected);
	});

	test('merge local and remote extensions when both moved forwarded with skipped and ignoredextensions', () => {
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aRemoteSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const skippedExtensions = [
			aSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aLocalSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
			aRemoteSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aRemoteSyncExtension({ identifier: { id: 'e', uuid: 'e' } }),
		];
		const expected = [
			anExpectedSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			anExpectedSyncExtension({ identifier: { id: 'e', uuid: 'e' } }),
			anExpectedSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, skippedExtensions, ['e'], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, expected);
	});

	test('merge when remote extension has no uuid and different extension id case', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aLocalSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			aLocalSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'A' } }),
			aRemoteSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
		];
		const expected = [
			anExpectedSyncExtension({ identifier: { id: 'A', uuid: 'a' } }),
			anExpectedSyncExtension({ identifier: { id: 'd', uuid: 'd' } }),
			anExpectedSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			anExpectedSyncExtension({ identifier: { id: 'c', uuid: 'c' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, null, [], [], []);

		assert.deepStrictEqual(actual.local.added, [anExpectedSyncExtension({ identifier: { id: 'd', uuid: 'd' } })]);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, expected);
	});

	test('merge when remote extension is not an installed extension', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aRemoteSyncExtension({ identifier: { id: 'b', uuid: 'b' }, installed: false }),
		];

		const actual = merge(localExtensions, remoteExtensions, null, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge when remote extension is not an installed extension but is an installed extension locally', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, installed: false }),
		];
		const expected = [
			anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, null, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, expected);
	});

	test('merge when an extension is not an installed extension remotely and does not exist locally', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, installed: false }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, installed: false }),
			aRemoteSyncExtension({ identifier: { id: 'b', uuid: 'b' }, installed: false }),
		];

		const actual = merge(localExtensions, remoteExtensions, remoteExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge when an extension is an installed extension remotely but not locally and updated locally', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, disabled: true }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];
		const expected = [
			anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, disabled: true }),
		];

		const actual = merge(localExtensions, remoteExtensions, remoteExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, expected);
	});

	test('merge when an extension is an installed extension remotely but not locally and updated remotely', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, disabled: true }),
		];

		const actual = merge(localExtensions, remoteExtensions, localExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, [
			anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, disabled: true }),
		]);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge not installed extensions', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, installed: false }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'b', uuid: 'b' }, installed: false }),
		];
		const expected: ISyncExtension[] = [
			anExpectedBuiltinSyncExtension({ identifier: { id: 'b', uuid: 'b' } }),
			anExpectedBuiltinSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, null, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, expected);
	});

	test('merge: remote extension with prerelease is added', () => {
		const localExtensions: ILocalSyncExtension[] = [];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, preRelease: true }),
		];

		const actual = merge(localExtensions, remoteExtensions, null, [], [], []);

		assert.deepStrictEqual(actual.local.added, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, preRelease: true })]);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge: local extension with prerelease is added', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, preRelease: true }),
		];
		const remoteExtensions: ILocalSyncExtension[] = [];

		const actual = merge(localExtensions, remoteExtensions, null, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, preRelease: true })]);
	});

	test('merge: remote extension with prerelease is added when local extension without prerelease is added', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, preRelease: true }),
		];

		const actual = merge(localExtensions, remoteExtensions, null, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, preRelease: true })]);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge: remote extension without prerelease is added when local extension with prerelease is added', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, preRelease: true }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, null, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' } })]);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge: remote extension is changed to prerelease', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, preRelease: true }),
		];

		const actual = merge(localExtensions, remoteExtensions, localExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, preRelease: true })]);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge: remote extension is changed to release', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, preRelease: true }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, localExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' } })]);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge: local extension is changed to prerelease', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, preRelease: true }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, remoteExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, preRelease: true })]);
	});

	test('merge: local extension is changed to release', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, preRelease: true }),
		];

		const actual = merge(localExtensions, remoteExtensions, remoteExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, [aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } })]);
	});

	test('merge: local extension not an installed extension - remote preRelease property is taken precedence when there are no updates', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, installed: false }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, preRelease: true }),
		];

		const actual = merge(localExtensions, remoteExtensions, remoteExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge: local extension not an installed extension - remote preRelease property is taken precedence when there are updates locally', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, installed: false, disabled: true }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, preRelease: true }),
		];

		const actual = merge(localExtensions, remoteExtensions, remoteExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, preRelease: true, disabled: true })]);
	});

	test('merge: local extension not an installed extension - remote preRelease property is taken precedence when there are updates remotely', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, installed: false }),
		];
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, preRelease: true }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, preRelease: true, disabled: true }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, preRelease: true, disabled: true })]);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge: local extension not an installed extension - remote version is taken precedence when there are no updates', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, installed: false }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '1.1.0' }),
		];

		const actual = merge(localExtensions, remoteExtensions, remoteExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge: local extension not an installed extension - remote version is taken precedence when there are updates locally', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, installed: false, disabled: true }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '1.1.0' }),
		];

		const actual = merge(localExtensions, remoteExtensions, remoteExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '1.1.0', disabled: true })]);
	});

	test('merge: local extension not an installed extension - remote version property is taken precedence when there are updates remotely', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, installed: false }),
		];
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '1.1.0' }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '1.1.0', disabled: true }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '1.1.0', disabled: true })]);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge: base has builtin extension, local does not have extension, remote has extension installed', () => {
		const localExtensions: ILocalSyncExtension[] = [];
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '1.1.0', installed: false }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '1.1.0' }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '1.1.0' })]);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge: base has installed extension, local has installed extension, remote has extension builtin', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, installed: false }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, [{ id: 'a', uuid: 'a' }]);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge: base has installed extension, local has builtin extension, remote does not has extension', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, installed: false }),
		];
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];
		const remoteExtensions: ILocalSyncExtension[] = [];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, [anExpectedBuiltinSyncExtension({ identifier: { id: 'a', uuid: 'a' } })]);
	});

	test('merge: base has builtin extension, local has installed extension, remote has builtin extension with updated state', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, installed: false }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, installed: false, state: { 'a': 1 } }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, [], [], [{ id: 'a', uuid: 'a' }]);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, state: { 'a': 1 } })]);
		assert.deepStrictEqual(actual.remote?.all, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, state: { 'a': 1 } })]);
	});

	test('merge: base has installed extension, last time synced as builtin extension, local has installed extension, remote has builtin extension with updated state', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, installed: false, state: { 'a': 1 } }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, [], [], [{ id: 'a', uuid: 'a' }]);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, state: { 'a': 1 } })]);
		assert.deepStrictEqual(actual.remote?.all, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, state: { 'a': 1 } })]);
	});

	test('merge: base has builtin extension, local does not have extension, remote has builtin extension', () => {
		const localExtensions: ILocalSyncExtension[] = [];
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '1.1.0', installed: false }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '1.1.0', installed: false }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge: base has installed extension, last synced as builtin, local does not have extension, remote has installed extension', () => {
		const localExtensions: ILocalSyncExtension[] = [];
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '1.1.0' }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '1.1.0' }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, [], [], [{ id: 'a', uuid: 'a' }]);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge: base has builtin extension, last synced as builtin, local does not have extension, remote has installed extension', () => {
		const localExtensions: ILocalSyncExtension[] = [];
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '1.1.0', installed: false }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '1.1.0' }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, [], [], [{ id: 'a', uuid: 'a' }]);

		assert.deepStrictEqual(actual.local.added, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '1.1.0' })]);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge: remote extension with pinned is added', () => {
		const localExtensions: ILocalSyncExtension[] = [];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, pinned: true }),
		];

		const actual = merge(localExtensions, remoteExtensions, null, [], [], []);

		assert.deepStrictEqual(actual.local.added, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, pinned: true })]);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge: local extension with pinned is added', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, pinned: true }),
		];
		const remoteExtensions: ILocalSyncExtension[] = [];

		const actual = merge(localExtensions, remoteExtensions, null, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, pinned: true })]);
	});

	test('merge: remote extension with pinned is added when local extension without pinned is added', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, pinned: true }),
		];

		const actual = merge(localExtensions, remoteExtensions, null, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, pinned: true })]);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge: remote extension without pinned is added when local extension with pinned is added', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, pinned: true }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, null, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' } })]);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge: remote extension is changed to pinned', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, pinned: true }),
		];

		const actual = merge(localExtensions, remoteExtensions, localExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, pinned: true })]);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge: remote extension is changed to unpinned', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, pinned: true }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, localExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' } })]);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge: local extension is changed to pinned', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, pinned: true }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, remoteExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, pinned: true })]);
	});

	test('merge: local extension is changed to unpinned', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, pinned: true }),
		];

		const actual = merge(localExtensions, remoteExtensions, remoteExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, [aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } })]);
	});

	test('merge: local extension not an installed extension - remote pinned property is taken precedence when there are no updates', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, installed: false }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, pinned: true }),
		];

		const actual = merge(localExtensions, remoteExtensions, remoteExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge: local extension not an installed extension - remote pinned property is taken precedence when there are updates locally', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, installed: false, disabled: true }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, pinned: true }),
		];

		const actual = merge(localExtensions, remoteExtensions, remoteExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, pinned: true, disabled: true })]);
	});

	test('merge: local extension not an installed extension - remote pinned property is taken precedence when there are updates remotely', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, installed: false }),
		];
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, pinned: true }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, pinned: true, disabled: true }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, pinned: true, disabled: true })]);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge: local extension is changed to pinned and version changed', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '0.0.1', pinned: true }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, remoteExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '0.0.1', pinned: true })]);
	});

	test('merge: local extension is changed to unpinned and version changed', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '0.0.1', pinned: true }),
		];

		const actual = merge(localExtensions, remoteExtensions, remoteExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' } })]);
	});

	test('merge: remote extension is changed to pinned and version changed', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '0.0.1', pinned: true }),
		];

		const actual = merge(localExtensions, remoteExtensions, localExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '0.0.1', pinned: true })]);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge: local extension is changed to pinned and version changed and remote extension is channged to pinned with different version', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '0.0.1', pinned: true }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '0.0.2', pinned: true }),
		];
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '0.0.2', pinned: true })]);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge: remote extension is changed to unpinned and version changed', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '0.0.1', pinned: true }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, localExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' } })]);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge: local extension is changed to unpinned and version changed and remote extension is channged to unpinned with different version', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '0.0.1' }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, version: '0.0.2' }),
		];
		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, pinned: true }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('sync adding local application scoped extension', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, isApplicationScoped: true }),
		];

		const actual = merge(localExtensions, null, null, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, localExtensions);
	});

	test('sync merging local extension with isApplicationScoped property and remote does not has isApplicationScoped property', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, isApplicationScoped: false }),
		];

		const baseExtensions = [
			aSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];

		const actual = merge(localExtensions, baseExtensions, baseExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' } })]);
	});

	test('sync merging when applicaiton scope is changed locally', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, isApplicationScoped: true }),
		];

		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, isApplicationScoped: false }),
		];

		const actual = merge(localExtensions, baseExtensions, baseExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote?.all, localExtensions);
	});

	test('sync merging when applicaiton scope is changed remotely', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' }, isApplicationScoped: false }),
		];

		const baseExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, isApplicationScoped: false }),
		];

		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' }, isApplicationScoped: true }),
		];

		const actual = merge(localExtensions, remoteExtensions, baseExtensions, [], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, [anExpectedSyncExtension({ identifier: { id: 'a', uuid: 'a' }, isApplicationScoped: true })]);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge does not remove remote extension when skipped extension has uuid but remote does not has', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aRemoteSyncExtension({ identifier: { id: 'b' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, remoteExtensions, [aRemoteSyncExtension({ identifier: { id: 'b', uuid: 'b' } })], [], []);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote, null);
	});

	test('merge does not remove remote extension when last sync builtin extension has uuid but remote does not has', () => {
		const localExtensions = [
			aLocalSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
		];
		const remoteExtensions = [
			aRemoteSyncExtension({ identifier: { id: 'a', uuid: 'a' } }),
			aRemoteSyncExtension({ identifier: { id: 'b' } }),
		];

		const actual = merge(localExtensions, remoteExtensions, remoteExtensions, [], [], [{ id: 'b', uuid: 'b' }]);

		assert.deepStrictEqual(actual.local.added, []);
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.local.updated, []);
		assert.deepStrictEqual(actual.remote, null);
	});

	function anExpectedSyncExtension(extension: Partial<ISyncExtension>): ISyncExtension {
		return {
			identifier: { id: 'a', uuid: 'a' },
			version: '1.0.0',
			pinned: false,
			preRelease: false,
			installed: true,
			...extension
		};
	}

	function anExpectedBuiltinSyncExtension(extension: Partial<ISyncExtension>): ISyncExtension {
		return {
			identifier: { id: 'a', uuid: 'a' },
			version: '1.0.0',
			pinned: false,
			preRelease: false,
			...extension
		};
	}

	function aLocalSyncExtension(extension: Partial<ILocalSyncExtension>): ILocalSyncExtension {
		return {
			identifier: { id: 'a', uuid: 'a' },
			version: '1.0.0',
			pinned: false,
			preRelease: false,
			installed: true,
			...extension
		};
	}

	function aRemoteSyncExtension(extension: Partial<ILocalSyncExtension>): ILocalSyncExtension {
		return {
			identifier: { id: 'a', uuid: 'a' },
			version: '1.0.0',
			pinned: false,
			preRelease: false,
			installed: true,
			...extension
		};
	}

	function aSyncExtension(extension: Partial<ISyncExtension>): ISyncExtension {
		return {
			identifier: { id: 'a', uuid: 'a' },
			version: '1.0.0',
			installed: true,
			...extension
		};
	}

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/test/common/globalStateMerge.test.ts]---
Location: vscode-main/src/vs/platform/userDataSync/test/common/globalStateMerge.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { NullLogService } from '../../../log/common/log.js';
import { merge } from '../../common/globalStateMerge.js';

suite('GlobalStateMerge', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('merge when local and remote are same with one value and local is not synced yet', async () => {
		const local = { 'a': { version: 1, value: 'a' } };
		const remote = { 'a': { version: 1, value: 'a' } };

		const actual = merge(local, remote, null, { machine: [], unregistered: [] }, new NullLogService());

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.remote.all, null);
	});

	test('merge when local and remote are same with multiple entries and local is not synced yet', async () => {
		const local = { 'a': { version: 1, value: 'a' }, 'b': { version: 1, value: 'b' } };
		const remote = { 'a': { version: 1, value: 'a' }, 'b': { version: 1, value: 'b' } };

		const actual = merge(local, remote, null, { machine: [], unregistered: [] }, new NullLogService());

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.remote.all, null);
	});

	test('merge when local and remote are same with multiple entries in different order and local is not synced yet', async () => {
		const local = { 'a': { version: 1, value: 'a' }, 'b': { version: 1, value: 'b' } };
		const remote = { 'b': { version: 1, value: 'b' }, 'a': { version: 1, value: 'a' } };

		const actual = merge(local, remote, null, { machine: [], unregistered: [] }, new NullLogService());

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.remote.all, null);
	});

	test('merge when local and remote are same with different base content', async () => {
		const local = { 'a': { version: 1, value: 'a' }, 'b': { version: 1, value: 'b' } };
		const remote = { 'b': { version: 1, value: 'b' }, 'a': { version: 1, value: 'a' } };
		const base = { 'b': { version: 1, value: 'a' } };

		const actual = merge(local, remote, base, { machine: [], unregistered: [] }, new NullLogService());

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.remote.all, null);
	});

	test('merge when a new entry is added to remote and local has not synced yet', async () => {
		const local = { 'a': { version: 1, value: 'a' } };
		const remote = { 'b': { version: 1, value: 'b' }, 'a': { version: 1, value: 'a' } };

		const actual = merge(local, remote, null, { machine: [], unregistered: [] }, new NullLogService());

		assert.deepStrictEqual(actual.local.added, { 'b': { version: 1, value: 'b' } });
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.remote.all, null);
	});

	test('merge when multiple new entries are added to remote and local is not synced yet', async () => {
		const local = {};
		const remote = { 'b': { version: 1, value: 'b' }, 'a': { version: 1, value: 'a' } };

		const actual = merge(local, remote, null, { machine: [], unregistered: [] }, new NullLogService());

		assert.deepStrictEqual(actual.local.added, { 'b': { version: 1, value: 'b' }, 'a': { version: 1, value: 'a' } });
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.remote.all, null);
	});

	test('merge when new entry is added to remote from base and local has not changed', async () => {
		const local = { 'a': { version: 1, value: 'a' } };
		const remote = { 'b': { version: 1, value: 'b' }, 'a': { version: 1, value: 'a' } };

		const actual = merge(local, remote, local, { machine: [], unregistered: [] }, new NullLogService());

		assert.deepStrictEqual(actual.local.added, { 'b': { version: 1, value: 'b' } });
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.remote.all, null);
	});

	test('merge when an entry is removed from remote from base and local has not changed', async () => {
		const local = { 'b': { version: 1, value: 'b' }, 'a': { version: 1, value: 'a' } };
		const remote = { 'a': { version: 1, value: 'a' } };

		const actual = merge(local, remote, local, { machine: [], unregistered: [] }, new NullLogService());

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, ['b']);
		assert.deepStrictEqual(actual.remote.all, null);
	});

	test('merge when all entries are removed from base and local has not changed', async () => {
		const local = { 'b': { version: 1, value: 'b' }, 'a': { version: 1, value: 'a' } };
		const remote = {};

		const actual = merge(local, remote, local, { machine: [], unregistered: [] }, new NullLogService());

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, ['b', 'a']);
		assert.deepStrictEqual(actual.remote.all, null);
	});

	test('merge when an entry is updated in remote from base and local has not changed', async () => {
		const local = { 'a': { version: 1, value: 'a' } };
		const remote = { 'a': { version: 1, value: 'b' } };

		const actual = merge(local, remote, local, { machine: [], unregistered: [] }, new NullLogService());

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, { 'a': { version: 1, value: 'b' } });
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.remote.all, null);
	});

	test('merge when remote has moved forwarded with multiple changes and local stays with base', async () => {
		const local = { 'a': { version: 1, value: 'a' }, 'b': { version: 1, value: 'b' } };
		const remote = { 'a': { version: 1, value: 'd' }, 'c': { version: 1, value: 'c' } };

		const actual = merge(local, remote, local, { machine: [], unregistered: [] }, new NullLogService());

		assert.deepStrictEqual(actual.local.added, { 'c': { version: 1, value: 'c' } });
		assert.deepStrictEqual(actual.local.updated, { 'a': { version: 1, value: 'd' } });
		assert.deepStrictEqual(actual.local.removed, ['b']);
		assert.deepStrictEqual(actual.remote.all, null);
	});

	test('merge when new entries are added to local and local is not synced yet', async () => {
		const local = { 'a': { version: 1, value: 'a' }, 'b': { version: 1, value: 'b' } };
		const remote = { 'a': { version: 1, value: 'a' } };

		const actual = merge(local, remote, null, { machine: [], unregistered: [] }, new NullLogService());

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.remote.all, local);
	});

	test('merge when multiple new entries are added to local from base and remote is not changed', async () => {
		const local = { 'a': { version: 1, value: 'a' }, 'b': { version: 1, value: 'b' }, 'c': { version: 1, value: 'c' } };
		const remote = { 'a': { version: 1, value: 'a' } };

		const actual = merge(local, remote, remote, { machine: [], unregistered: [] }, new NullLogService());

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.remote.all, local);
	});

	test('merge when an entry is removed from local from base and remote has not changed', async () => {
		const local = { 'a': { version: 1, value: 'a' } };
		const remote = { 'a': { version: 1, value: 'a' }, 'b': { version: 1, value: 'b' } };

		const actual = merge(local, remote, remote, { machine: [], unregistered: [] }, new NullLogService());

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.remote.all, local);
	});

	test('merge when an entry is updated in local from base and remote has not changed', async () => {
		const local = { 'a': { version: 1, value: 'b' } };
		const remote = { 'a': { version: 1, value: 'a' } };

		const actual = merge(local, remote, remote, { machine: [], unregistered: [] }, new NullLogService());

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.remote.all, local);
	});

	test('merge when local has moved forwarded with multiple changes and remote stays with base', async () => {
		const local = { 'a': { version: 1, value: 'd' }, 'b': { version: 1, value: 'b' } };
		const remote = { 'a': { version: 1, value: 'a' }, 'c': { version: 1, value: 'c' } };

		const actual = merge(local, remote, remote, { machine: [], unregistered: [] }, new NullLogService());

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.remote.all, local);
	});

	test('merge when local and remote with one entry but different value and local is not synced yet', async () => {
		const local = { 'a': { version: 1, value: 'a' } };
		const remote = { 'a': { version: 1, value: 'b' } };

		const actual = merge(local, remote, null, { machine: [], unregistered: [] }, new NullLogService());

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, { 'a': { version: 1, value: 'b' } });
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.remote.all, null);
	});

	test('merge when the entry is removed in remote but updated in local and a new entry is added in remote', async () => {
		const base = { 'a': { version: 1, value: 'a' }, 'b': { version: 1, value: 'b' } };
		const local = { 'a': { version: 1, value: 'a' }, 'b': { version: 1, value: 'd' } };
		const remote = { 'a': { version: 1, value: 'a' }, 'c': { version: 1, value: 'c' } };

		const actual = merge(local, remote, base, { machine: [], unregistered: [] }, new NullLogService());

		assert.deepStrictEqual(actual.local.added, { 'c': { version: 1, value: 'c' } });
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.remote.all, { 'a': { version: 1, value: 'a' }, 'c': { version: 1, value: 'c' }, 'b': { version: 1, value: 'd' } });
	});

	test('merge with single entry and local is empty', async () => {
		const base = { 'a': { version: 1, value: 'a' } };
		const local = {};
		const remote = { 'a': { version: 1, value: 'b' } };

		const actual = merge(local, remote, base, { machine: [], unregistered: [] }, new NullLogService());

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.remote.all, local);
	});

	test('merge when local and remote has moved forward with conflicts', async () => {
		const base = { 'a': { version: 1, value: 'a' } };
		const local = { 'a': { version: 1, value: 'd' } };
		const remote = { 'a': { version: 1, value: 'b' } };

		const actual = merge(local, remote, base, { machine: [], unregistered: [] }, new NullLogService());

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.remote.all, local);
	});

	test('merge when a new entry is added to remote but scoped to machine locally and local is not synced yet', async () => {
		const local = { 'a': { version: 1, value: 'a' } };
		const remote = { 'b': { version: 1, value: 'b' }, 'a': { version: 1, value: 'a' } };

		const actual = merge(local, remote, null, { machine: ['b'], unregistered: [] }, new NullLogService());

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.remote.all, null);
	});

	test('merge when an entry is updated to remote but scoped to machine locally', async () => {
		const local = { 'a': { version: 1, value: 'a' } };
		const remote = { 'a': { version: 1, value: 'b' } };

		const actual = merge(local, remote, local, { machine: ['a'], unregistered: [] }, new NullLogService());

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.remote.all, null);
	});

	test('merge when a local value is removed and scoped to machine locally', async () => {
		const base = { 'a': { version: 1, value: 'a' }, 'b': { version: 1, value: 'b' } };
		const local = { 'a': { version: 1, value: 'a' } };
		const remote = { 'b': { version: 1, value: 'b' }, 'a': { version: 1, value: 'a' } };

		const actual = merge(local, remote, base, { machine: ['b'], unregistered: [] }, new NullLogService());

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.remote.all, local);
	});

	test('merge when local moved forwared by changing a key to machine scope', async () => {
		const base = { 'a': { version: 1, value: 'a' }, 'b': { version: 1, value: 'b' } };
		const remote = { 'a': { version: 1, value: 'a' }, 'b': { version: 1, value: 'b' } };
		const local = { 'a': { version: 1, value: 'a' } };

		const actual = merge(local, remote, base, { machine: ['b'], unregistered: [] }, new NullLogService());

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.remote.all, local);
	});

	test('merge should not remove remote keys if not registered', async () => {
		const local = { 'a': { version: 1, value: 'a' }, 'b': { version: 1, value: 'b' } };
		const base = { 'a': { version: 1, value: 'a' }, 'c': { version: 1, value: 'c' } };
		const remote = { 'a': { version: 1, value: 'a' }, 'c': { version: 1, value: 'c' } };

		const actual = merge(local, remote, base, { machine: [], unregistered: ['c'] }, new NullLogService());

		assert.deepStrictEqual(actual.local.added, {});
		assert.deepStrictEqual(actual.local.updated, {});
		assert.deepStrictEqual(actual.local.removed, []);
		assert.deepStrictEqual(actual.remote.all, { 'a': { version: 1, value: 'a' }, 'b': { version: 1, value: 'b' }, 'c': { version: 1, value: 'c' } });
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/test/common/globalStateSync.test.ts]---
Location: vscode-main/src/vs/platform/userDataSync/test/common/globalStateSync.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { runWithFakedTimers } from '../../../../base/test/common/timeTravelScheduler.js';
import { IEnvironmentService } from '../../../environment/common/environment.js';
import { IFileService } from '../../../files/common/files.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../storage/common/storage.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../../userDataProfile/common/userDataProfile.js';
import { GlobalStateSynchroniser } from '../../common/globalStateSync.js';
import { IGlobalState, ISyncData, IUserDataSyncStoreService, SyncResource, SyncStatus } from '../../common/userDataSync.js';
import { IUserDataProfileStorageService } from '../../../userDataProfile/common/userDataProfileStorageService.js';
import { UserDataSyncClient, UserDataSyncTestServer } from './userDataSyncClient.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';


suite('GlobalStateSync', () => {

	const server = new UserDataSyncTestServer();
	let testClient: UserDataSyncClient;
	let client2: UserDataSyncClient;

	let testObject: GlobalStateSynchroniser;

	teardown(async () => {
		await testClient.instantiationService.get(IUserDataSyncStoreService).clear();
	});

	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	setup(async () => {
		testClient = disposableStore.add(new UserDataSyncClient(server));
		await testClient.setUp(true);
		testObject = testClient.getSynchronizer(SyncResource.GlobalState) as GlobalStateSynchroniser;

		client2 = disposableStore.add(new UserDataSyncClient(server));
		await client2.setUp(true);
	});

	test('when global state does not exist', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		assert.deepStrictEqual(await testObject.getLastSyncUserData(), null);
		let manifest = await testClient.getLatestRef(SyncResource.GlobalState);
		server.reset();
		await testObject.sync(manifest);

		assert.deepStrictEqual(server.requests, []);

		const lastSyncUserData = await testObject.getLastSyncUserData();
		const remoteUserData = await testObject.getRemoteUserData(null);
		assert.deepStrictEqual(lastSyncUserData!.ref, remoteUserData.ref);
		assert.deepStrictEqual(lastSyncUserData!.syncData, remoteUserData.syncData);
		assert.strictEqual(lastSyncUserData!.syncData, null);

		manifest = await testClient.getLatestRef(SyncResource.GlobalState);
		server.reset();
		await testObject.sync(manifest);
		assert.deepStrictEqual(server.requests, []);

		manifest = await testClient.getLatestRef(SyncResource.GlobalState);
		server.reset();
		await testObject.sync(manifest);
		assert.deepStrictEqual(server.requests, []);
	}));

	test('when global state is created after first sync', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		await testObject.sync(await testClient.getLatestRef(SyncResource.GlobalState));
		updateUserStorage('a', 'value1', testClient);

		let lastSyncUserData = await testObject.getLastSyncUserData();
		const manifest = await testClient.getLatestRef(SyncResource.GlobalState);
		server.reset();
		await testObject.sync(manifest);

		assert.deepStrictEqual(server.requests, [
			{ type: 'POST', url: `${server.url}/v1/resource/${testObject.resource}`, headers: { 'If-Match': lastSyncUserData?.ref } },
		]);

		lastSyncUserData = await testObject.getLastSyncUserData();
		const remoteUserData = await testObject.getRemoteUserData(null);
		assert.deepStrictEqual(lastSyncUserData!.ref, remoteUserData.ref);
		assert.deepStrictEqual(lastSyncUserData!.syncData, remoteUserData.syncData);
		assert.deepStrictEqual(JSON.parse(lastSyncUserData!.syncData!.content).storage, { 'a': { version: 1, value: 'value1' } });
	}));

	test('first time sync - outgoing to server (no state)', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		updateUserStorage('a', 'value1', testClient);
		updateMachineStorage('b', 'value1', testClient);
		await updateLocale(testClient);

		await testObject.sync(await testClient.getLatestRef(SyncResource.GlobalState));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseGlobalState(content);
		assert.deepStrictEqual(actual.storage, { 'globalState.argv.locale': { version: 1, value: 'en' }, 'a': { version: 1, value: 'value1' } });
	}));

	test('first time sync - incoming from server (no state)', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		updateUserStorage('a', 'value1', client2);
		await updateLocale(client2);
		await client2.sync();

		await testObject.sync(await testClient.getLatestRef(SyncResource.GlobalState));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		assert.strictEqual(readStorage('a', testClient), 'value1');
		assert.strictEqual(await readLocale(testClient), 'en');
	}));

	test('first time sync when storage exists', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		updateUserStorage('a', 'value1', client2);
		await client2.sync();

		updateUserStorage('b', 'value2', testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.GlobalState));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		assert.strictEqual(readStorage('a', testClient), 'value1');
		assert.strictEqual(readStorage('b', testClient), 'value2');

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseGlobalState(content);
		assert.deepStrictEqual(actual.storage, { 'a': { version: 1, value: 'value1' }, 'b': { version: 1, value: 'value2' } });
	}));

	test('first time sync when storage exists - has conflicts', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		updateUserStorage('a', 'value1', client2);
		await client2.sync();

		updateUserStorage('a', 'value2', client2);
		await testObject.sync(await testClient.getLatestRef(SyncResource.GlobalState));

		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		assert.strictEqual(readStorage('a', testClient), 'value1');

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseGlobalState(content);
		assert.deepStrictEqual(actual.storage, { 'a': { version: 1, value: 'value1' } });
	}));

	test('sync adding a storage value', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		updateUserStorage('a', 'value1', testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.GlobalState));

		updateUserStorage('b', 'value2', testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.GlobalState));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		assert.strictEqual(readStorage('a', testClient), 'value1');
		assert.strictEqual(readStorage('b', testClient), 'value2');

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseGlobalState(content);
		assert.deepStrictEqual(actual.storage, { 'a': { version: 1, value: 'value1' }, 'b': { version: 1, value: 'value2' } });
	}));

	test('sync updating a storage value', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		updateUserStorage('a', 'value1', testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.GlobalState));

		updateUserStorage('a', 'value2', testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.GlobalState));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		assert.strictEqual(readStorage('a', testClient), 'value2');

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseGlobalState(content);
		assert.deepStrictEqual(actual.storage, { 'a': { version: 1, value: 'value2' } });
	}));

	test('sync removing a storage value', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		updateUserStorage('a', 'value1', testClient);
		updateUserStorage('b', 'value2', testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.GlobalState));

		removeStorage('b', testClient);
		await testObject.sync(await testClient.getLatestRef(SyncResource.GlobalState));
		assert.strictEqual(testObject.status, SyncStatus.Idle);
		assert.deepStrictEqual(testObject.conflicts.conflicts, []);

		assert.strictEqual(readStorage('a', testClient), 'value1');
		assert.strictEqual(readStorage('b', testClient), undefined);

		const { content } = await testClient.read(testObject.resource);
		assert.ok(content !== null);
		const actual = parseGlobalState(content);
		assert.deepStrictEqual(actual.storage, { 'a': { version: 1, value: 'value1' } });
	}));

	test('sync profile state', () => runWithFakedTimers<void>({ useFakeTimers: true }, async () => {
		const client2 = disposableStore.add(new UserDataSyncClient(server));
		await client2.setUp(true);
		const profile = await client2.instantiationService.get(IUserDataProfilesService).createNamedProfile('profile1');
		await updateLocale(client2);
		await updateUserStorageForProfile('a', 'value1', profile, testClient);
		await client2.sync();

		await testClient.sync();

		const syncedProfile = testClient.instantiationService.get(IUserDataProfilesService).profiles.find(p => p.id === profile.id)!;
		const profileStorage = await testClient.instantiationService.get(IUserDataProfileStorageService).readStorageData(syncedProfile);
		assert.strictEqual(profileStorage.get('a')?.value, 'value1');
		assert.strictEqual(await readLocale(testClient), 'en');

		const { content } = await testClient.read(testObject.resource, '1');
		assert.ok(content !== null);
		const actual = parseGlobalState(content);
		assert.deepStrictEqual(actual.storage, { 'a': { version: 1, value: 'value1' } });
	}));

	function parseGlobalState(content: string): IGlobalState {
		const syncData: ISyncData = JSON.parse(content);
		return JSON.parse(syncData.content);
	}

	async function updateLocale(client: UserDataSyncClient): Promise<void> {
		const fileService = client.instantiationService.get(IFileService);
		const environmentService = client.instantiationService.get(IEnvironmentService);
		await fileService.writeFile(environmentService.argvResource, VSBuffer.fromString(JSON.stringify({ 'locale': 'en' })));
	}

	function updateUserStorage(key: string, value: string, client: UserDataSyncClient, profile?: IUserDataProfile): void {
		const storageService = client.instantiationService.get(IStorageService);
		storageService.store(key, value, StorageScope.PROFILE, StorageTarget.USER);
	}

	async function updateUserStorageForProfile(key: string, value: string, profile: IUserDataProfile, client: UserDataSyncClient): Promise<void> {
		const storageService = client.instantiationService.get(IUserDataProfileStorageService);
		const data = new Map<string, string>();
		data.set(key, value);
		await storageService.updateStorageData(profile, data, StorageTarget.USER);
	}

	function updateMachineStorage(key: string, value: string, client: UserDataSyncClient): void {
		const storageService = client.instantiationService.get(IStorageService);
		storageService.store(key, value, StorageScope.PROFILE, StorageTarget.MACHINE);
	}

	function removeStorage(key: string, client: UserDataSyncClient): void {
		const storageService = client.instantiationService.get(IStorageService);
		storageService.remove(key, StorageScope.PROFILE);
	}

	function readStorage(key: string, client: UserDataSyncClient): string | undefined {
		const storageService = client.instantiationService.get(IStorageService);
		return storageService.get(key, StorageScope.PROFILE);
	}

	async function readLocale(client: UserDataSyncClient): Promise<string | undefined> {
		const fileService = client.instantiationService.get(IFileService);
		const environmentService = client.instantiationService.get(IEnvironmentService);
		const content = await fileService.readFile(environmentService.argvResource);
		return JSON.parse(content.value.toString()).locale;
	}

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/test/common/keybindingsMerge.test.ts]---
Location: vscode-main/src/vs/platform/userDataSync/test/common/keybindingsMerge.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { merge } from '../../common/keybindingsMerge.js';
import { TestUserDataSyncUtilService } from './userDataSyncClient.js';

suite('KeybindingsMerge - No Conflicts', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('merge when local and remote are same with one entry', async () => {
		const localContent = stringify([{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' }]);
		const remoteContent = stringify([{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' }]);
		const actual = await mergeKeybindings(localContent, remoteContent, null);
		assert.ok(!actual.hasChanges);
		assert.ok(!actual.hasConflicts);
		assert.strictEqual(actual.mergeContent, localContent);
	});

	test('merge when local and remote are same with similar when contexts', async () => {
		const localContent = stringify([{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' }]);
		const remoteContent = stringify([{ key: 'alt+c', command: 'a', when: '!editorReadonly && editorTextFocus' }]);
		const actual = await mergeKeybindings(localContent, remoteContent, null);
		assert.ok(!actual.hasChanges);
		assert.ok(!actual.hasConflicts);
		assert.strictEqual(actual.mergeContent, localContent);
	});

	test('merge when local and remote has entries in different order', async () => {
		const localContent = stringify([
			{ key: 'alt+d', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+a', command: 'a', when: 'editorTextFocus' }
		]);
		const remoteContent = stringify([
			{ key: 'alt+a', command: 'a', when: 'editorTextFocus' },
			{ key: 'alt+d', command: 'a', when: 'editorTextFocus && !editorReadonly' }
		]);
		const actual = await mergeKeybindings(localContent, remoteContent, null);
		assert.ok(!actual.hasChanges);
		assert.ok(!actual.hasConflicts);
		assert.strictEqual(actual.mergeContent, localContent);
	});

	test('merge when local and remote are same with multiple entries', async () => {
		const localContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: '-a' },
			{ key: 'cmd+c', command: 'b', args: { text: '`' } }
		]);
		const remoteContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: '-a' },
			{ key: 'cmd+c', command: 'b', args: { text: '`' } }
		]);
		const actual = await mergeKeybindings(localContent, remoteContent, null);
		assert.ok(!actual.hasChanges);
		assert.ok(!actual.hasConflicts);
		assert.strictEqual(actual.mergeContent, localContent);
	});

	test('merge when local and remote are same with different base content', async () => {
		const localContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: '-a' },
			{ key: 'cmd+c', command: 'b', args: { text: '`' } }
		]);
		const baseContent = stringify([
			{ key: 'ctrl+c', command: 'e' },
			{ key: 'shift+d', command: 'd', args: { text: '`' } }
		]);
		const remoteContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: '-a' },
			{ key: 'cmd+c', command: 'b', args: { text: '`' } }
		]);
		const actual = await mergeKeybindings(localContent, remoteContent, baseContent);
		assert.ok(!actual.hasChanges);
		assert.ok(!actual.hasConflicts);
		assert.strictEqual(actual.mergeContent, localContent);
	});

	test('merge when local and remote are same with multiple entries in different order', async () => {
		const localContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: '-a' },
			{ key: 'cmd+c', command: 'b', args: { text: '`' } }
		]);
		const remoteContent = stringify([
			{ key: 'cmd+c', command: 'b', args: { text: '`' } },
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: '-a' },
		]);
		const actual = await mergeKeybindings(localContent, remoteContent, null);
		assert.ok(!actual.hasChanges);
		assert.ok(!actual.hasConflicts);
		assert.strictEqual(actual.mergeContent, localContent);
	});

	test('merge when local and remote are same when remove entry is in different order', async () => {
		const localContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: '-a' },
			{ key: 'cmd+c', command: 'b', args: { text: '`' } }
		]);
		const remoteContent = stringify([
			{ key: 'alt+d', command: '-a' },
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'cmd+c', command: 'b', args: { text: '`' } },
		]);
		const actual = await mergeKeybindings(localContent, remoteContent, null);
		assert.ok(!actual.hasChanges);
		assert.ok(!actual.hasConflicts);
		assert.strictEqual(actual.mergeContent, localContent);
	});

	test('merge when a new entry is added to remote', async () => {
		const localContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: '-a' },
		]);
		const remoteContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: '-a' },
			{ key: 'cmd+c', command: 'b', args: { text: '`' } },
		]);
		const actual = await mergeKeybindings(localContent, remoteContent, null);
		assert.ok(actual.hasChanges);
		assert.ok(!actual.hasConflicts);
		assert.strictEqual(actual.mergeContent, remoteContent);
	});

	test('merge when multiple new entries are added to remote', async () => {
		const localContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: '-a' },
		]);
		const remoteContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: '-a' },
			{ key: 'cmd+c', command: 'b', args: { text: '`' } },
			{ key: 'cmd+d', command: 'c' },
		]);
		const actual = await mergeKeybindings(localContent, remoteContent, null);
		assert.ok(actual.hasChanges);
		assert.ok(!actual.hasConflicts);
		assert.strictEqual(actual.mergeContent, remoteContent);
	});

	test('merge when multiple new entries are added to remote from base and local has not changed', async () => {
		const localContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: '-a' },
		]);
		const remoteContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: '-a' },
			{ key: 'cmd+c', command: 'b', args: { text: '`' } },
			{ key: 'cmd+d', command: 'c' },
		]);
		const actual = await mergeKeybindings(localContent, remoteContent, localContent);
		assert.ok(actual.hasChanges);
		assert.ok(!actual.hasConflicts);
		assert.strictEqual(actual.mergeContent, remoteContent);
	});

	test('merge when an entry is removed from remote from base and local has not changed', async () => {
		const localContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: '-a' },
			{ key: 'cmd+c', command: 'b', args: { text: '`' } },
		]);
		const remoteContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: '-a' },
		]);
		const actual = await mergeKeybindings(localContent, remoteContent, localContent);
		assert.ok(actual.hasChanges);
		assert.ok(!actual.hasConflicts);
		assert.strictEqual(actual.mergeContent, remoteContent);
	});

	test('merge when an entry (same command) is removed from remote from base and local has not changed', async () => {
		const localContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: '-a' },
		]);
		const remoteContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
		]);
		const actual = await mergeKeybindings(localContent, remoteContent, localContent);
		assert.ok(actual.hasChanges);
		assert.ok(!actual.hasConflicts);
		assert.strictEqual(actual.mergeContent, remoteContent);
	});

	test('merge when an entry is updated in remote from base and local has not changed', async () => {
		const localContent = stringify([
			{ key: 'alt+d', command: 'a', when: 'editorTextFocus && !editorReadonly' },
		]);
		const remoteContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
		]);
		const actual = await mergeKeybindings(localContent, remoteContent, localContent);
		assert.ok(actual.hasChanges);
		assert.ok(!actual.hasConflicts);
		assert.strictEqual(actual.mergeContent, remoteContent);
	});

	test('merge when a command with multiple entries is updated from remote from base and local has not changed', async () => {
		const localContent = stringify([
			{ key: 'shift+c', command: 'c' },
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: 'b' },
			{ key: 'cmd+c', command: 'a' },
		]);
		const remoteContent = stringify([
			{ key: 'shift+c', command: 'c' },
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: 'b' },
			{ key: 'cmd+d', command: 'a' },
		]);
		const actual = await mergeKeybindings(localContent, remoteContent, localContent);
		assert.ok(actual.hasChanges);
		assert.ok(!actual.hasConflicts);
		assert.strictEqual(actual.mergeContent, remoteContent);
	});

	test('merge when remote has moved forwareded with multiple changes and local stays with base', async () => {
		const localContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'cmd+c', command: 'b', args: { text: '`' } },
			{ key: 'alt+d', command: '-a' },
			{ key: 'cmd+e', command: 'd' },
			{ key: 'cmd+d', command: 'c', when: 'context1' },
		]);
		const remoteContent = stringify([
			{ key: 'alt+d', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'cmd+e', command: 'd' },
			{ key: 'alt+d', command: '-a' },
			{ key: 'alt+f', command: 'f' },
			{ key: 'alt+d', command: '-f' },
			{ key: 'cmd+d', command: 'c', when: 'context1' },
			{ key: 'cmd+c', command: '-c' },
		]);
		const actual = await mergeKeybindings(localContent, remoteContent, localContent);
		assert.ok(actual.hasChanges);
		assert.ok(!actual.hasConflicts);
		assert.strictEqual(actual.mergeContent, remoteContent);
	});

	test('merge when a new entry is added to local', async () => {
		const localContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: '-a' },
			{ key: 'cmd+c', command: 'b', args: { text: '`' } },
		]);
		const remoteContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: '-a' },
		]);
		const actual = await mergeKeybindings(localContent, remoteContent, null);
		assert.ok(actual.hasChanges);
		assert.ok(!actual.hasConflicts);
		assert.strictEqual(actual.mergeContent, localContent);
	});

	test('merge when multiple new entries are added to local', async () => {
		const localContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: '-a' },
			{ key: 'cmd+c', command: 'b', args: { text: '`' } },
			{ key: 'cmd+d', command: 'c' },
		]);
		const remoteContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: '-a' },
		]);
		const actual = await mergeKeybindings(localContent, remoteContent, null);
		assert.ok(actual.hasChanges);
		assert.ok(!actual.hasConflicts);
		assert.strictEqual(actual.mergeContent, localContent);
	});

	test('merge when multiple new entries are added to local from base and remote is not changed', async () => {
		const localContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: '-a' },
			{ key: 'cmd+c', command: 'b', args: { text: '`' } },
			{ key: 'cmd+d', command: 'c' },
		]);
		const remoteContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: '-a' },
		]);
		const actual = await mergeKeybindings(localContent, remoteContent, remoteContent);
		assert.ok(actual.hasChanges);
		assert.ok(!actual.hasConflicts);
		assert.strictEqual(actual.mergeContent, localContent);
	});

	test('merge when an entry is removed from local from base and remote has not changed', async () => {
		const localContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: '-a' },
		]);
		const remoteContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: '-a' },
			{ key: 'cmd+c', command: 'b', args: { text: '`' } },
		]);
		const actual = await mergeKeybindings(localContent, remoteContent, remoteContent);
		assert.ok(actual.hasChanges);
		assert.ok(!actual.hasConflicts);
		assert.strictEqual(actual.mergeContent, localContent);
	});

	test('merge when an entry (with same command) is removed from local from base and remote has not changed', async () => {
		const localContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
		]);
		const remoteContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: '-a' },
		]);
		const actual = await mergeKeybindings(localContent, remoteContent, remoteContent);
		assert.ok(actual.hasChanges);
		assert.ok(!actual.hasConflicts);
		assert.strictEqual(actual.mergeContent, localContent);
	});

	test('merge when an entry is updated in local from base and remote has not changed', async () => {
		const localContent = stringify([
			{ key: 'alt+d', command: 'a', when: 'editorTextFocus' },
		]);
		const remoteContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
		]);
		const actual = await mergeKeybindings(localContent, remoteContent, remoteContent);
		assert.ok(actual.hasChanges);
		assert.ok(!actual.hasConflicts);
		assert.strictEqual(actual.mergeContent, localContent);
	});

	test('merge when a command with multiple entries is updated from local from base and remote has not changed', async () => {
		const localContent = stringify([
			{ key: 'shift+c', command: 'c' },
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: 'b' },
			{ key: 'cmd+c', command: 'a' },
		]);
		const remoteContent = stringify([
			{ key: 'shift+c', command: 'c' },
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+d', command: 'b' },
			{ key: 'cmd+d', command: 'a' },
		]);
		const actual = await mergeKeybindings(localContent, remoteContent, remoteContent);
		assert.ok(actual.hasChanges);
		assert.ok(!actual.hasConflicts);
		assert.strictEqual(actual.mergeContent, localContent);
	});

	test('merge when local has moved forwareded with multiple changes and remote stays with base', async () => {
		const localContent = stringify([
			{ key: 'alt+d', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'cmd+e', command: 'd' },
			{ key: 'alt+d', command: '-a' },
			{ key: 'alt+f', command: 'f' },
			{ key: 'alt+d', command: '-f' },
			{ key: 'cmd+d', command: 'c', when: 'context1' },
			{ key: 'cmd+c', command: '-c' },
		]);
		const remoteContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'cmd+c', command: 'b', args: { text: '`' } },
			{ key: 'alt+d', command: '-a' },
			{ key: 'cmd+e', command: 'd' },
			{ key: 'cmd+d', command: 'c', when: 'context1' },
		]);
		const expected = stringify([
			{ key: 'alt+d', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'cmd+e', command: 'd' },
			{ key: 'alt+d', command: '-a' },
			{ key: 'alt+f', command: 'f' },
			{ key: 'alt+d', command: '-f' },
			{ key: 'cmd+d', command: 'c', when: 'context1' },
			{ key: 'cmd+c', command: '-c' },
		]);
		const actual = await mergeKeybindings(localContent, remoteContent, remoteContent);
		assert.ok(actual.hasChanges);
		assert.ok(!actual.hasConflicts);
		assert.strictEqual(actual.mergeContent, expected);
	});

	test('merge when local and remote has moved forwareded with conflicts', async () => {
		const baseContent = stringify([
			{ key: 'alt+d', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'ctrl+c', command: '-a' },
			{ key: 'cmd+e', command: 'd' },
			{ key: 'alt+a', command: 'f' },
			{ key: 'alt+d', command: '-f' },
			{ key: 'cmd+d', command: 'c', when: 'context1' },
			{ key: 'cmd+c', command: '-c' },
		]);
		const localContent = stringify([
			{ key: 'alt+d', command: '-f' },
			{ key: 'cmd+e', command: 'd' },
			{ key: 'cmd+c', command: '-c' },
			{ key: 'cmd+d', command: 'c', when: 'context1' },
			{ key: 'alt+a', command: 'f' },
			{ key: 'alt+e', command: 'e' },
		]);
		const remoteContent = stringify([
			{ key: 'alt+a', command: 'f' },
			{ key: 'cmd+c', command: '-c' },
			{ key: 'cmd+d', command: 'd' },
			{ key: 'alt+d', command: '-f' },
			{ key: 'alt+c', command: 'c', when: 'context1' },
			{ key: 'alt+g', command: 'g', when: 'context2' },
		]);
		const expected = stringify([
			{ key: 'alt+d', command: '-f' },
			{ key: 'cmd+d', command: 'd' },
			{ key: 'cmd+c', command: '-c' },
			{ key: 'alt+c', command: 'c', when: 'context1' },
			{ key: 'alt+a', command: 'f' },
			{ key: 'alt+e', command: 'e' },
			{ key: 'alt+g', command: 'g', when: 'context2' },
		]);
		const actual = await mergeKeybindings(localContent, remoteContent, baseContent);
		assert.ok(actual.hasChanges);
		assert.ok(!actual.hasConflicts);
		assert.strictEqual(actual.mergeContent, expected);
	});

	test('merge when local and remote with one entry but different value', async () => {
		const localContent = stringify([{ key: 'alt+d', command: 'a', when: 'editorTextFocus && !editorReadonly' }]);
		const remoteContent = stringify([{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' }]);
		const actual = await mergeKeybindings(localContent, remoteContent, null);
		assert.ok(actual.hasChanges);
		assert.ok(actual.hasConflicts);
		assert.strictEqual(actual.mergeContent,
			`[
	{
		"key": "alt+d",
		"command": "a",
		"when": "editorTextFocus && !editorReadonly"
	}
]`);
	});

	test('merge when local and remote with different keybinding', async () => {
		const localContent = stringify([
			{ key: 'alt+d', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+a', command: '-a', when: 'editorTextFocus && !editorReadonly' }
		]);
		const remoteContent = stringify([
			{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+a', command: '-a', when: 'editorTextFocus && !editorReadonly' }
		]);
		const actual = await mergeKeybindings(localContent, remoteContent, null);
		assert.ok(actual.hasChanges);
		assert.ok(actual.hasConflicts);
		assert.strictEqual(actual.mergeContent,
			`[
	{
		"key": "alt+d",
		"command": "a",
		"when": "editorTextFocus && !editorReadonly"
	},
	{
		"key": "alt+a",
		"command": "-a",
		"when": "editorTextFocus && !editorReadonly"
	}
]`);
	});

	test('merge when the entry is removed in local but updated in remote', async () => {
		const baseContent = stringify([{ key: 'alt+d', command: 'a', when: 'editorTextFocus && !editorReadonly' }]);
		const localContent = stringify([]);
		const remoteContent = stringify([{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' }]);
		const actual = await mergeKeybindings(localContent, remoteContent, baseContent);
		assert.ok(actual.hasChanges);
		assert.ok(actual.hasConflicts);
		assert.strictEqual(actual.mergeContent,
			`[]`);
	});

	test('merge when the entry is removed in local but updated in remote and a new entry is added in local', async () => {
		const baseContent = stringify([{ key: 'alt+d', command: 'a', when: 'editorTextFocus && !editorReadonly' }]);
		const localContent = stringify([{ key: 'alt+b', command: 'b' }]);
		const remoteContent = stringify([{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' }]);
		const actual = await mergeKeybindings(localContent, remoteContent, baseContent);
		assert.ok(actual.hasChanges);
		assert.ok(actual.hasConflicts);
		assert.strictEqual(actual.mergeContent,
			`[
	{
		"key": "alt+b",
		"command": "b"
	}
]`);
	});

	test('merge when the entry is removed in remote but updated in local', async () => {
		const baseContent = stringify([{ key: 'alt+d', command: 'a', when: 'editorTextFocus && !editorReadonly' }]);
		const localContent = stringify([{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' }]);
		const remoteContent = stringify([]);
		const actual = await mergeKeybindings(localContent, remoteContent, baseContent);
		assert.ok(actual.hasChanges);
		assert.ok(actual.hasConflicts);
		assert.strictEqual(actual.mergeContent,
			`[
	{
		"key": "alt+c",
		"command": "a",
		"when": "editorTextFocus && !editorReadonly"
	}
]`);
	});

	test('merge when the entry is removed in remote but updated in local and a new entry is added in remote', async () => {
		const baseContent = stringify([{ key: 'alt+d', command: 'a', when: 'editorTextFocus && !editorReadonly' }]);
		const localContent = stringify([{ key: 'alt+c', command: 'a', when: 'editorTextFocus && !editorReadonly' }]);
		const remoteContent = stringify([{ key: 'alt+b', command: 'b' }]);
		const actual = await mergeKeybindings(localContent, remoteContent, baseContent);
		assert.ok(actual.hasChanges);
		assert.ok(actual.hasConflicts);
		assert.strictEqual(actual.mergeContent,
			`[
	{
		"key": "alt+c",
		"command": "a",
		"when": "editorTextFocus && !editorReadonly"
	},
	{
		"key": "alt+b",
		"command": "b"
	}
]`);
	});

	test('merge when local and remote has moved forwareded with conflicts (2)', async () => {
		const baseContent = stringify([
			{ key: 'alt+d', command: 'a', when: 'editorTextFocus && !editorReadonly' },
			{ key: 'alt+c', command: '-a' },
			{ key: 'cmd+e', command: 'd' },
			{ key: 'alt+a', command: 'f' },
			{ key: 'alt+d', command: '-f' },
			{ key: 'cmd+d', command: 'c', when: 'context1' },
			{ key: 'cmd+c', command: '-c' },
		]);
		const localContent = stringify([
			{ key: 'alt+d', command: '-f' },
			{ key: 'cmd+e', command: 'd' },
			{ key: 'cmd+c', command: '-c' },
			{ key: 'cmd+d', command: 'c', when: 'context1' },
			{ key: 'alt+a', command: 'f' },
			{ key: 'alt+e', command: 'e' },
		]);
		const remoteContent = stringify([
			{ key: 'alt+a', command: 'f' },
			{ key: 'cmd+c', command: '-c' },
			{ key: 'cmd+d', command: 'd' },
			{ key: 'alt+d', command: '-f' },
			{ key: 'alt+c', command: 'c', when: 'context1' },
			{ key: 'alt+g', command: 'g', when: 'context2' },
		]);
		const actual = await mergeKeybindings(localContent, remoteContent, baseContent);
		assert.ok(actual.hasChanges);
		assert.ok(actual.hasConflicts);
		assert.strictEqual(actual.mergeContent,
			`[
	{
		"key": "alt+d",
		"command": "-f"
	},
	{
		"key": "cmd+d",
		"command": "d"
	},
	{
		"key": "cmd+c",
		"command": "-c"
	},
	{
		"key": "cmd+d",
		"command": "c",
		"when": "context1"
	},
	{
		"key": "alt+a",
		"command": "f"
	},
	{
		"key": "alt+e",
		"command": "e"
	},
	{
		"key": "alt+g",
		"command": "g",
		"when": "context2"
	}
]`);
	});

});

async function mergeKeybindings(localContent: string, remoteContent: string, baseContent: string | null) {
	const userDataSyncUtilService = new TestUserDataSyncUtilService();
	const formattingOptions = await userDataSyncUtilService.resolveFormattingOptions();
	return merge(localContent, remoteContent, baseContent, formattingOptions, userDataSyncUtilService);
}

function stringify(value: any): string {
	return JSON.stringify(value, null, '\t');
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/test/common/keybindingsSync.test.ts]---
Location: vscode-main/src/vs/platform/userDataSync/test/common/keybindingsSync.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IFileService } from '../../../files/common/files.js';
import { ILogService } from '../../../log/common/log.js';
import { IUserDataProfilesService } from '../../../userDataProfile/common/userDataProfile.js';
import { getKeybindingsContentFromSyncContent, KeybindingsSynchroniser } from '../../common/keybindingsSync.js';
import { IUserDataSyncStoreService, SyncResource, UserDataSyncError, UserDataSyncErrorCode } from '../../common/userDataSync.js';
import { UserDataSyncClient, UserDataSyncTestServer } from './userDataSyncClient.js';

suite('KeybindingsSync', () => {

	const server = new UserDataSyncTestServer();
	let client: UserDataSyncClient;

	let testObject: KeybindingsSynchroniser;

	teardown(async () => {
		await client.instantiationService.get(IUserDataSyncStoreService).clear();
	});

	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	setup(async () => {
		client = disposableStore.add(new UserDataSyncClient(server));
		await client.setUp(true);
		testObject = client.getSynchronizer(SyncResource.Keybindings) as KeybindingsSynchroniser;
	});


	test('when keybindings file does not exist', async () => {
		const fileService = client.instantiationService.get(IFileService);
		const keybindingsResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.keybindingsResource;

		assert.deepStrictEqual(await testObject.getLastSyncUserData(), null);
		let manifest = await client.getLatestRef(SyncResource.Keybindings);
		server.reset();
		await testObject.sync(manifest);

		assert.deepStrictEqual(server.requests, []);
		assert.ok(!await fileService.exists(keybindingsResource));

		const lastSyncUserData = await testObject.getLastSyncUserData();
		const remoteUserData = await testObject.getRemoteUserData(null);
		assert.deepStrictEqual(lastSyncUserData!.ref, remoteUserData.ref);
		assert.deepStrictEqual(lastSyncUserData!.syncData, remoteUserData.syncData);
		assert.strictEqual(lastSyncUserData!.syncData, null);

		manifest = await client.getLatestRef(SyncResource.Keybindings);
		server.reset();
		await testObject.sync(manifest);
		assert.deepStrictEqual(server.requests, []);

		manifest = await client.getLatestRef(SyncResource.Keybindings);
		server.reset();
		await testObject.sync(manifest);
		assert.deepStrictEqual(server.requests, []);
	});

	test('when keybindings file is empty and remote has no changes', async () => {
		const fileService = client.instantiationService.get(IFileService);
		const keybindingsResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.keybindingsResource;
		await fileService.writeFile(keybindingsResource, VSBuffer.fromString(''));

		await testObject.sync(await client.getLatestRef(SyncResource.Keybindings));

		const lastSyncUserData = await testObject.getLastSyncUserData();
		const remoteUserData = await testObject.getRemoteUserData(null);
		assert.strictEqual(getKeybindingsContentFromSyncContent(lastSyncUserData!.syncData!.content, true, client.instantiationService.get(ILogService)), '[]');
		assert.strictEqual(getKeybindingsContentFromSyncContent(remoteUserData.syncData!.content, true, client.instantiationService.get(ILogService)), '[]');
		assert.strictEqual((await fileService.readFile(keybindingsResource)).value.toString(), '');
	});

	test('when keybindings file is empty and remote has changes', async () => {
		const client2 = disposableStore.add(new UserDataSyncClient(server));
		await client2.setUp(true);
		const content = JSON.stringify([
			{
				'key': 'shift+cmd+w',
				'command': 'workbench.action.closeAllEditors',
			}
		]);
		await client2.instantiationService.get(IFileService).writeFile(client2.instantiationService.get(IUserDataProfilesService).defaultProfile.keybindingsResource, VSBuffer.fromString(content));
		await client2.sync();

		const fileService = client.instantiationService.get(IFileService);
		const keybindingsResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.keybindingsResource;
		await fileService.writeFile(keybindingsResource, VSBuffer.fromString(''));

		await testObject.sync(await client.getLatestRef(SyncResource.Keybindings));

		const lastSyncUserData = await testObject.getLastSyncUserData();
		const remoteUserData = await testObject.getRemoteUserData(null);
		assert.strictEqual(getKeybindingsContentFromSyncContent(lastSyncUserData!.syncData!.content, true, client.instantiationService.get(ILogService)), content);
		assert.strictEqual(getKeybindingsContentFromSyncContent(remoteUserData.syncData!.content, true, client.instantiationService.get(ILogService)), content);
		assert.strictEqual((await fileService.readFile(keybindingsResource)).value.toString(), content);
	});

	test('when keybindings file is empty with comment and remote has no changes', async () => {
		const fileService = client.instantiationService.get(IFileService);
		const keybindingsResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.keybindingsResource;
		const expectedContent = '// Empty Keybindings';
		await fileService.writeFile(keybindingsResource, VSBuffer.fromString(expectedContent));

		await testObject.sync(await client.getLatestRef(SyncResource.Keybindings));

		const lastSyncUserData = await testObject.getLastSyncUserData();
		const remoteUserData = await testObject.getRemoteUserData(null);
		assert.strictEqual(getKeybindingsContentFromSyncContent(lastSyncUserData!.syncData!.content, true, client.instantiationService.get(ILogService)), expectedContent);
		assert.strictEqual(getKeybindingsContentFromSyncContent(remoteUserData.syncData!.content, true, client.instantiationService.get(ILogService)), expectedContent);
		assert.strictEqual((await fileService.readFile(keybindingsResource)).value.toString(), expectedContent);
	});

	test('when keybindings file is empty and remote has keybindings', async () => {
		const client2 = disposableStore.add(new UserDataSyncClient(server));
		await client2.setUp(true);
		const content = JSON.stringify([
			{
				'key': 'shift+cmd+w',
				'command': 'workbench.action.closeAllEditors',
			}
		]);
		await client2.instantiationService.get(IFileService).writeFile(client2.instantiationService.get(IUserDataProfilesService).defaultProfile.keybindingsResource, VSBuffer.fromString(content));
		await client2.sync();

		const fileService = client.instantiationService.get(IFileService);
		const keybindingsResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.keybindingsResource;
		await fileService.writeFile(keybindingsResource, VSBuffer.fromString('// Empty Keybindings'));

		await testObject.sync(await client.getLatestRef(SyncResource.Keybindings));

		const lastSyncUserData = await testObject.getLastSyncUserData();
		const remoteUserData = await testObject.getRemoteUserData(null);
		assert.strictEqual(getKeybindingsContentFromSyncContent(lastSyncUserData!.syncData!.content, true, client.instantiationService.get(ILogService)), content);
		assert.strictEqual(getKeybindingsContentFromSyncContent(remoteUserData.syncData!.content, true, client.instantiationService.get(ILogService)), content);
		assert.strictEqual((await fileService.readFile(keybindingsResource)).value.toString(), content);
	});

	test('when keybindings file is empty and remote has empty array', async () => {
		const client2 = disposableStore.add(new UserDataSyncClient(server));
		await client2.setUp(true);
		const content =
			`// Place your key bindings in this file to override the defaults
[
]`;
		await client2.instantiationService.get(IFileService).writeFile(client2.instantiationService.get(IUserDataProfilesService).defaultProfile.keybindingsResource, VSBuffer.fromString(content));
		await client2.sync();

		const fileService = client.instantiationService.get(IFileService);
		const keybindingsResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.keybindingsResource;
		const expectedLocalContent = '// Empty Keybindings';
		await fileService.writeFile(keybindingsResource, VSBuffer.fromString(expectedLocalContent));

		await testObject.sync(await client.getLatestRef(SyncResource.Keybindings));

		const lastSyncUserData = await testObject.getLastSyncUserData();
		const remoteUserData = await testObject.getRemoteUserData(null);
		assert.strictEqual(getKeybindingsContentFromSyncContent(lastSyncUserData!.syncData!.content, true, client.instantiationService.get(ILogService)), content);
		assert.strictEqual(getKeybindingsContentFromSyncContent(remoteUserData.syncData!.content, true, client.instantiationService.get(ILogService)), content);
		assert.strictEqual((await fileService.readFile(keybindingsResource)).value.toString(), expectedLocalContent);
	});

	test('when keybindings file is created after first sync', async () => {
		const fileService = client.instantiationService.get(IFileService);
		const keybindingsResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.keybindingsResource;
		await testObject.sync(await client.getLatestRef(SyncResource.Keybindings));
		await fileService.createFile(keybindingsResource, VSBuffer.fromString('[]'));

		let lastSyncUserData = await testObject.getLastSyncUserData();
		const manifest = await client.getLatestRef(SyncResource.Keybindings);
		server.reset();
		await testObject.sync(manifest);

		assert.deepStrictEqual(server.requests, [
			{ type: 'POST', url: `${server.url}/v1/resource/${testObject.resource}`, headers: { 'If-Match': lastSyncUserData?.ref } },
		]);

		lastSyncUserData = await testObject.getLastSyncUserData();
		const remoteUserData = await testObject.getRemoteUserData(null);
		assert.deepStrictEqual(lastSyncUserData!.ref, remoteUserData.ref);
		assert.deepStrictEqual(lastSyncUserData!.syncData, remoteUserData.syncData);
		assert.strictEqual(getKeybindingsContentFromSyncContent(lastSyncUserData!.syncData!.content, true, client.instantiationService.get(ILogService)), '[]');
	});

	test('test apply remote when keybindings file does not exist', async () => {
		const fileService = client.instantiationService.get(IFileService);
		const keybindingsResource = client.instantiationService.get(IUserDataProfilesService).defaultProfile.keybindingsResource;
		if (await fileService.exists(keybindingsResource)) {
			await fileService.del(keybindingsResource);
		}

		const preview = await testObject.sync(await client.getLatestRef(SyncResource.Keybindings), true);

		server.reset();
		const content = await testObject.resolveContent(preview!.resourcePreviews[0].remoteResource);
		await testObject.accept(preview!.resourcePreviews[0].remoteResource, content);
		await testObject.apply(false);
		assert.deepStrictEqual(server.requests, []);
	});

	test('sync throws invalid content error - content is an object', async () => {
		await client.instantiationService.get(IFileService).writeFile(client.instantiationService.get(IUserDataProfilesService).defaultProfile.keybindingsResource, VSBuffer.fromString('{}'));
		try {
			await testObject.sync(await client.getLatestRef(SyncResource.Keybindings));
			assert.fail('should fail with invalid content error');
		} catch (e) {
			assert.ok(e instanceof UserDataSyncError);
			assert.deepStrictEqual((<UserDataSyncError>e).code, UserDataSyncErrorCode.LocalInvalidContent);
		}
	});

	test('sync profile keybindings', async () => {
		const client2 = disposableStore.add(new UserDataSyncClient(server));
		await client2.setUp(true);
		const profile = await client2.instantiationService.get(IUserDataProfilesService).createNamedProfile('profile1');
		await client2.instantiationService.get(IFileService).writeFile(profile.keybindingsResource, VSBuffer.fromString(JSON.stringify([
			{
				'key': 'shift+cmd+w',
				'command': 'workbench.action.closeAllEditors',
			}
		])));
		await client2.sync();

		await client.sync();

		const syncedProfile = client.instantiationService.get(IUserDataProfilesService).profiles.find(p => p.id === profile.id)!;
		const content = (await client.instantiationService.get(IFileService).readFile(syncedProfile.keybindingsResource)).value.toString();
		assert.deepStrictEqual(JSON.parse(content), [
			{
				'key': 'shift+cmd+w',
				'command': 'workbench.action.closeAllEditors',
			}
		]);
	});

});
```

--------------------------------------------------------------------------------

````

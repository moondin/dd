---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 64
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 64 of 552)

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

---[FILE: extensions/microsoft-authentication/src/common/test/scopeData.test.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/common/test/scopeData.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { ScopeData } from '../scopeData';
import { Uri } from 'vscode';

suite('ScopeData', () => {
	test('should include default scopes if not present', () => {
		const scopeData = new ScopeData(['custom_scope']);
		assert.deepStrictEqual(scopeData.allScopes, ['custom_scope']);
	});

	test('should not duplicate default scopes if already present', () => {
		const scopeData = new ScopeData(['custom_scope', 'openid', 'email', 'profile', 'offline_access']);
		assert.deepStrictEqual(scopeData.allScopes, ['custom_scope', 'email', 'offline_access', 'openid', 'profile']);
	});

	test('should sort the scopes alphabetically', () => {
		const scopeData = new ScopeData(['custom_scope', 'profile', 'email', 'openid', 'offline_access']);
		assert.deepStrictEqual(scopeData.allScopes, ['custom_scope', 'email', 'offline_access', 'openid', 'profile']);
	});

	test('should create a space-separated string of all scopes', () => {
		const scopeData = new ScopeData(['custom_scope', 'openid', 'email', 'offline_access', 'profile']);
		assert.strictEqual(scopeData.scopeStr, 'custom_scope email offline_access openid profile');
	});

	test('should add TACK ON scope if all scopes are OIDC scopes', () => {
		const scopeData = new ScopeData(['openid', 'email', 'offline_access', 'profile']);
		assert.deepStrictEqual(scopeData.scopesToSend, ['email', 'offline_access', 'openid', 'profile', 'User.Read']);
	});

	test('should filter out internal VS Code scopes for scopesToSend', () => {
		const scopeData = new ScopeData(['custom_scope', 'VSCODE_CLIENT_ID:some_id']);
		assert.deepStrictEqual(scopeData.scopesToSend, ['custom_scope']);
	});

	test('should use the default client ID if no VSCODE_CLIENT_ID scope is present', () => {
		const scopeData = new ScopeData(['custom_scope']);
		assert.strictEqual(scopeData.clientId, 'aebc6443-996d-45c2-90f0-388ff96faa56');
	});

	test('should use the VSCODE_CLIENT_ID scope if present', () => {
		const scopeData = new ScopeData(['custom_scope', 'VSCODE_CLIENT_ID:some_id']);
		assert.strictEqual(scopeData.clientId, 'some_id');
	});

	test('should use the default tenant ID if no VSCODE_TENANT scope is present', () => {
		const scopeData = new ScopeData(['custom_scope']);
		assert.strictEqual(scopeData.tenant, 'organizations');
	});

	test('should use the VSCODE_TENANT scope if present', () => {
		const scopeData = new ScopeData(['custom_scope', 'VSCODE_TENANT:some_tenant']);
		assert.strictEqual(scopeData.tenant, 'some_tenant');
	});

	test('should have tenantId be undefined if no VSCODE_TENANT scope is present', () => {
		const scopeData = new ScopeData(['custom_scope']);
		assert.strictEqual(scopeData.tenantId, undefined);
	});

	test('should have tenantId be undefined if typical tenant values are present', () => {
		for (const element of ['common', 'organizations', 'consumers']) {
			const scopeData = new ScopeData(['custom_scope', `VSCODE_TENANT:${element}`]);
			assert.strictEqual(scopeData.tenantId, undefined);
		}
	});

	test('should have tenantId be the value of VSCODE_TENANT scope if set to a specific value', () => {
		const scopeData = new ScopeData(['custom_scope', 'VSCODE_TENANT:some_guid']);
		assert.strictEqual(scopeData.tenantId, 'some_guid');
	});

	test('should not return claims', () => {
		const scopeData = new ScopeData(['custom_scope']);
		assert.strictEqual(scopeData.claims, undefined);
	});

	test('should return claims', () => {
		const scopeData = new ScopeData(['custom_scope'], 'test');
		assert.strictEqual(scopeData.claims, 'test');
	});

	test('should extract tenant from authorization server URL path', () => {
		const authorizationServer = Uri.parse('https://login.microsoftonline.com/tenant123/oauth2/v2.0');
		const scopeData = new ScopeData(['custom_scope'], undefined, authorizationServer);
		assert.strictEqual(scopeData.tenant, 'tenant123');
	});

	test('should fallback to default tenant if authorization server URL has no path segments', () => {
		const authorizationServer = Uri.parse('https://login.microsoftonline.com');
		const scopeData = new ScopeData(['custom_scope'], undefined, authorizationServer);
		assert.strictEqual(scopeData.tenant, 'organizations');
	});

	test('should prioritize authorization server URL over VSCODE_TENANT scope', () => {
		const authorizationServer = Uri.parse('https://login.microsoftonline.com/url_tenant/oauth2/v2.0');
		const scopeData = new ScopeData(['custom_scope', 'VSCODE_TENANT:scope_tenant'], undefined, authorizationServer);
		assert.strictEqual(scopeData.tenant, 'url_tenant');
	});

	test('should extract tenant from v1.0 authorization server URL path', () => {
		const authorizationServer = Uri.parse('https://login.microsoftonline.com/tenant123');
		const scopeData = new ScopeData(['custom_scope'], undefined, authorizationServer);
		assert.strictEqual(scopeData.tenant, 'tenant123');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/node/authProvider.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/node/authProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { AccountInfo, AuthenticationResult, AuthError, ClientAuthError, ClientAuthErrorCodes, ServerError } from '@azure/msal-node';
import { AuthenticationChallenge, AuthenticationConstraint, AuthenticationGetSessionOptions, AuthenticationProvider, AuthenticationProviderAuthenticationSessionsChangeEvent, AuthenticationProviderSessionOptions, AuthenticationSession, AuthenticationSessionAccountInformation, CancellationError, env, EventEmitter, ExtensionContext, ExtensionKind, l10n, LogOutputChannel, Uri, window } from 'vscode';
import { Environment } from '@azure/ms-rest-azure-env';
import { CachedPublicClientApplicationManager } from './publicClientCache';
import { UriEventHandler } from '../UriEventHandler';
import { ICachedPublicClientApplication, ICachedPublicClientApplicationManager } from '../common/publicClientCache';
import { MicrosoftAccountType, MicrosoftAuthenticationTelemetryReporter } from '../common/telemetryReporter';
import { ScopeData } from '../common/scopeData';
import { EventBufferer } from '../common/event';
import { BetterTokenStorage } from '../betterSecretStorage';
import { ExtensionHost, getMsalFlows } from './flows';
import { base64Decode } from './buffer';
import { Config } from '../common/config';
import { isSupportedClient } from '../common/env';

const MSA_TID = '9188040d-6c67-4c5b-b112-36a304b66dad';
const MSA_PASSTHRU_TID = 'f8cdef31-a31e-4b4a-93e4-5f571e91255a';

/**
 * Interface for sessions stored from the old authentication flow.
 * Used for migration purposes when upgrading to MSAL.
 * TODO: Remove this after one or two releases.
 */
export interface IStoredSession {
	id: string;
	refreshToken: string;
	scope: string; // Scopes are alphabetized and joined with a space
	account: {
		label: string;
		id: string;
	};
	endpoint: string | undefined;
}

export class MsalAuthProvider implements AuthenticationProvider {

	private readonly _disposables: { dispose(): void }[];
	private readonly _eventBufferer = new EventBufferer();

	/**
	 * Event to signal a change in authentication sessions for this provider.
	 */
	private readonly _onDidChangeSessionsEmitter = new EventEmitter<AuthenticationProviderAuthenticationSessionsChangeEvent>();

	/**
	 * Event to signal a change in authentication sessions for this provider.
	 *
	 * NOTE: This event is handled differently in the Microsoft auth provider than "typical" auth providers. Normally,
	 * this event would fire when the provider's sessions change... which are tied to a specific list of scopes. However,
	 * since Microsoft identity doesn't care too much about scopes (you can mint a new token from an existing token),
	 * we just fire this event whenever the account list changes... so essentially there is one session per account.
	 *
	 * This is not quite how the API should be used... but this event really is just for signaling that the account list
	 * has changed.
	 */
	onDidChangeSessions = this._onDidChangeSessionsEmitter.event;

	private constructor(
		private readonly _context: ExtensionContext,
		private readonly _telemetryReporter: MicrosoftAuthenticationTelemetryReporter,
		private readonly _logger: LogOutputChannel,
		private readonly _uriHandler: UriEventHandler,
		private readonly _publicClientManager: ICachedPublicClientApplicationManager,
		private readonly _env: Environment = Environment.AzureCloud
	) {
		this._disposables = _context.subscriptions;
		const accountChangeEvent = this._eventBufferer.wrapEvent(
			this._publicClientManager.onDidAccountsChange,
			(last, newEvent) => {
				if (!last) {
					return newEvent;
				}
				const mergedEvent = {
					added: [...(last.added ?? []), ...(newEvent.added ?? [])],
					deleted: [...(last.deleted ?? []), ...(newEvent.deleted ?? [])],
					changed: [...(last.changed ?? []), ...(newEvent.changed ?? [])]
				};

				const dedupedEvent = {
					added: Array.from(new Map(mergedEvent.added.map(item => [item.username, item])).values()),
					deleted: Array.from(new Map(mergedEvent.deleted.map(item => [item.username, item])).values()),
					changed: Array.from(new Map(mergedEvent.changed.map(item => [item.username, item])).values())
				};

				return dedupedEvent;
			},
			{ added: new Array<AccountInfo>(), deleted: new Array<AccountInfo>(), changed: new Array<AccountInfo>() }
		)(e => this._handleAccountChange(e));
		this._disposables.push(
			this._onDidChangeSessionsEmitter,
			accountChangeEvent
		);
	}

	static async create(
		context: ExtensionContext,
		telemetryReporter: MicrosoftAuthenticationTelemetryReporter,
		logger: LogOutputChannel,
		uriHandler: UriEventHandler,
		env: Environment = Environment.AzureCloud
	): Promise<MsalAuthProvider> {
		const publicClientManager = await CachedPublicClientApplicationManager.create(context.secrets, logger, telemetryReporter, env);
		context.subscriptions.push(publicClientManager);
		const authProvider = new MsalAuthProvider(context, telemetryReporter, logger, uriHandler, publicClientManager, env);
		await authProvider.initialize();
		return authProvider;
	}

	/**
	 * Migrate sessions from the old secret storage to MSAL.
	 * TODO: MSAL Migration. Remove this when we remove the old flow.
	 */
	private async _migrateSessions() {
		const betterSecretStorage = new BetterTokenStorage<IStoredSession>('microsoft.login.keylist', this._context);
		const sessions = await betterSecretStorage.getAll(item => {
			item.endpoint ||= Environment.AzureCloud.activeDirectoryEndpointUrl;
			return item.endpoint === this._env.activeDirectoryEndpointUrl;
		});
		this._context.globalState.update('msalMigration', true);

		const clientTenantMap = new Map<string, { clientId: string; tenant: string; refreshTokens: string[] }>();

		for (const session of sessions) {
			const scopeData = new ScopeData(session.scope.split(' '));
			const key = `${scopeData.clientId}:${scopeData.tenant}`;
			if (!clientTenantMap.has(key)) {
				clientTenantMap.set(key, { clientId: scopeData.clientId, tenant: scopeData.tenant, refreshTokens: [] });
			}
			clientTenantMap.get(key)!.refreshTokens.push(session.refreshToken);
		}

		for (const { clientId, tenant, refreshTokens } of clientTenantMap.values()) {
			await this._publicClientManager.getOrCreate(clientId, { refreshTokensToMigrate: refreshTokens, tenant });
		}
	}

	private async initialize(): Promise<void> {
		if (!this._context.globalState.get('msalMigration', false)) {
			await this._migrateSessions();
		}

		// Send telemetry for existing accounts
		for (const cachedPca of this._publicClientManager.getAll()) {
			for (const account of cachedPca.accounts) {
				const tid = account.tenantId;
				const type = tid === MSA_TID || tid === MSA_PASSTHRU_TID ? MicrosoftAccountType.MSA : MicrosoftAccountType.AAD;
				this._telemetryReporter.sendAccountEvent([], type);
			}
		}
	}

	/**
	 * See {@link onDidChangeSessions} for more information on how this is used.
	 * @param param0 Event that contains the added and removed accounts
	 */
	private _handleAccountChange({ added, changed, deleted }: { added: AccountInfo[]; changed: AccountInfo[]; deleted: AccountInfo[] }) {
		this._logger.debug(`[_handleAccountChange] added: ${added.length}, changed: ${changed.length}, deleted: ${deleted.length}`);
		this._onDidChangeSessionsEmitter.fire({
			added: added.map(this.sessionFromAccountInfo),
			changed: changed.map(this.sessionFromAccountInfo),
			removed: deleted.map(this.sessionFromAccountInfo)
		});
	}

	//#region AuthenticationProvider methods

	async getSessions(scopes: string[] | undefined, options: AuthenticationGetSessionOptions = {}): Promise<AuthenticationSession[]> {
		const askingForAll = scopes === undefined;
		const scopeData = new ScopeData(scopes, undefined, options?.authorizationServer);
		// Do NOT use `scopes` beyond this place in the code. Use `scopeData` instead.
		this._logger.info('[getSessions]', askingForAll ? '[all]' : `[${scopeData.scopeStr}]`, 'starting');

		// This branch only gets called by Core for sign out purposes and initial population of the account menu. Since we are
		// living in a world where a "session" from Core's perspective is an account, we return 1 session per account.
		// See the large comment on `onDidChangeSessions` for more information.
		if (askingForAll) {
			const allSessionsForAccounts = new Map<string, AuthenticationSession>();
			for (const cachedPca of this._publicClientManager.getAll()) {
				for (const account of cachedPca.accounts) {
					if (allSessionsForAccounts.has(account.homeAccountId)) {
						continue;
					}
					allSessionsForAccounts.set(account.homeAccountId, this.sessionFromAccountInfo(account));
				}
			}
			const allSessions = Array.from(allSessionsForAccounts.values());
			this._logger.info('[getSessions] [all]', `returned ${allSessions.length} session(s)`);
			return allSessions;
		}

		const cachedPca = await this._publicClientManager.getOrCreate(scopeData.clientId);
		const sessions = await this.getAllSessionsForPca(cachedPca, scopeData, options?.account);
		this._logger.info(`[getSessions] [${scopeData.scopeStr}] returned ${sessions.length} session(s)`);
		return sessions;

	}

	async createSession(scopes: readonly string[], options: AuthenticationProviderSessionOptions): Promise<AuthenticationSession> {
		const scopeData = new ScopeData(scopes, undefined, options.authorizationServer);
		// Do NOT use `scopes` beyond this place in the code. Use `scopeData` instead.

		this._logger.info('[createSession]', `[${scopeData.scopeStr}]`, 'starting');
		const cachedPca = await this._publicClientManager.getOrCreate(scopeData.clientId);

		// Used for showing a friendlier message to the user when the explicitly cancel a flow.
		let userCancelled: boolean | undefined;
		const yes = l10n.t('Yes');
		const no = l10n.t('No');
		const promptToContinue = async (mode: string) => {
			if (userCancelled === undefined) {
				// We haven't had a failure yet so wait to prompt
				return;
			}
			const message = userCancelled
				? l10n.t('Having trouble logging in? Would you like to try a different way? ({0})', mode)
				: l10n.t('You have not yet finished authorizing this extension to use your Microsoft Account. Would you like to try a different way? ({0})', mode);
			const result = await window.showWarningMessage(message, yes, no);
			if (result !== yes) {
				throw new CancellationError();
			}
		};

		const callbackUri = await env.asExternalUri(Uri.parse(`${env.uriScheme}://vscode.microsoft-authentication`));
		const flows = getMsalFlows({
			extensionHost: this._context.extension.extensionKind === ExtensionKind.UI ? ExtensionHost.Local : ExtensionHost.Remote,
			supportedClient: isSupportedClient(callbackUri),
			isBrokerSupported: cachedPca.isBrokerAvailable
		});

		const authority = new URL(scopeData.tenant, this._env.activeDirectoryEndpointUrl).toString();
		let lastError: Error | undefined;
		for (const flow of flows) {
			if (flow !== flows[0]) {
				try {
					await promptToContinue(flow.label);
				} finally {
					this._telemetryReporter.sendLoginFailedEvent();
				}
			}
			try {
				const result = await flow.trigger({
					cachedPca,
					authority,
					scopes: scopeData.scopesToSend,
					loginHint: options.account?.label,
					windowHandle: window.nativeHandle ? Buffer.from(window.nativeHandle) : undefined,
					logger: this._logger,
					uriHandler: this._uriHandler,
					callbackUri
				});

				const session = this.sessionFromAuthenticationResult(result, scopeData.originalScopes);
				this._telemetryReporter.sendLoginEvent(session.scopes);
				this._logger.info('[createSession]', `[${scopeData.scopeStr}]`, 'returned session');
				return session;
			} catch (e) {
				lastError = e;
				if (e instanceof ServerError || (e as ClientAuthError)?.errorCode === ClientAuthErrorCodes.userCanceled) {
					this._telemetryReporter.sendLoginFailedEvent();
					throw e;
				}
				// Continue to next flow
				if (e instanceof CancellationError) {
					userCancelled = true;
				}
			}
		}

		this._telemetryReporter.sendLoginFailedEvent();
		throw lastError ?? new Error('No auth flow succeeded');
	}

	async removeSession(sessionId: string): Promise<void> {
		this._logger.info('[removeSession]', sessionId, 'starting');
		const promises = new Array<Promise<void>>();
		for (const cachedPca of this._publicClientManager.getAll()) {
			const accounts = cachedPca.accounts;
			for (const account of accounts) {
				if (account.homeAccountId === sessionId) {
					this._telemetryReporter.sendLogoutEvent();
					promises.push(cachedPca.removeAccount(account));
					this._logger.info(`[removeSession] [${sessionId}] [${cachedPca.clientId}] removing session...`);
				}
			}
		}
		if (!promises.length) {
			this._logger.info('[removeSession]', sessionId, 'session not found');
			return;
		}
		const results = await Promise.allSettled(promises);
		for (const result of results) {
			if (result.status === 'rejected') {
				this._telemetryReporter.sendLogoutFailedEvent();
				this._logger.error('[removeSession]', sessionId, 'error removing session', result.reason);
			}
		}

		this._logger.info('[removeSession]', sessionId, `attempted to remove ${promises.length} sessions`);
	}

	async getSessionsFromChallenges(constraint: AuthenticationConstraint, options: AuthenticationProviderSessionOptions): Promise<readonly AuthenticationSession[]> {
		this._logger.info('[getSessionsFromChallenges]', 'starting with', constraint.challenges.length, 'challenges');

		// Use scopes from challenges if provided, otherwise use fallback scopes
		const scopes = this.extractScopesFromChallenges(constraint.challenges) ?? constraint.fallbackScopes;
		if (!scopes || scopes.length === 0) {
			throw new Error('No scopes found in authentication challenges or fallback scopes');
		}
		const claims = this.extractClaimsFromChallenges(constraint.challenges);
		if (!claims) {
			throw new Error('No claims found in authentication challenges');
		}
		const scopeData = new ScopeData(scopes, claims, options?.authorizationServer);
		this._logger.info('[getSessionsFromChallenges]', `[${scopeData.scopeStr}]`, 'with claims:', scopeData.claims);

		const cachedPca = await this._publicClientManager.getOrCreate(scopeData.clientId);
		const sessions = await this.getAllSessionsForPca(cachedPca, scopeData, options?.account);

		this._logger.info('[getSessionsFromChallenges]', 'returning', sessions.length, 'sessions');
		return sessions;
	}

	async createSessionFromChallenges(constraint: AuthenticationConstraint, options: AuthenticationProviderSessionOptions): Promise<AuthenticationSession> {
		this._logger.info('[createSessionFromChallenges]', 'starting with', constraint.challenges.length, 'challenges');

		// Use scopes from challenges if provided, otherwise use fallback scopes
		const scopes = this.extractScopesFromChallenges(constraint.challenges) ?? constraint.fallbackScopes;
		if (!scopes || scopes.length === 0) {
			throw new Error('No scopes found in authentication challenges or fallback scopes');
		}
		const claims = this.extractClaimsFromChallenges(constraint.challenges);

		// Use scopes if available, otherwise fall back to default scopes
		const effectiveScopes = scopes.length > 0 ? scopes : ['https://graph.microsoft.com/User.Read'];

		const scopeData = new ScopeData(effectiveScopes, claims, options.authorizationServer);
		this._logger.info('[createSessionFromChallenges]', `[${scopeData.scopeStr}]`, 'starting with claims:', claims);

		const cachedPca = await this._publicClientManager.getOrCreate(scopeData.clientId);

		// Used for showing a friendlier message to the user when the explicitly cancel a flow.
		let userCancelled: boolean | undefined;
		const yes = l10n.t('Yes');
		const no = l10n.t('No');
		const promptToContinue = async (mode: string) => {
			if (userCancelled === undefined) {
				// We haven't had a failure yet so wait to prompt
				return;
			}
			const message = userCancelled
				? l10n.t('Having trouble logging in? Would you like to try a different way? ({0})', mode)
				: l10n.t('You have not yet finished authorizing this extension to use your Microsoft Account. Would you like to try a different way? ({0})', mode);
			const result = await window.showWarningMessage(message, yes, no);
			if (result !== yes) {
				throw new CancellationError();
			}
		};

		const callbackUri = await env.asExternalUri(Uri.parse(`${env.uriScheme}://vscode.microsoft-authentication`));
		const flows = getMsalFlows({
			extensionHost: this._context.extension.extensionKind === ExtensionKind.UI ? ExtensionHost.Local : ExtensionHost.Remote,
			isBrokerSupported: cachedPca.isBrokerAvailable,
			supportedClient: isSupportedClient(callbackUri)
		});

		const authority = new URL(scopeData.tenant, this._env.activeDirectoryEndpointUrl).toString();
		let lastError: Error | undefined;
		for (const flow of flows) {
			if (flow !== flows[0]) {
				try {
					await promptToContinue(flow.label);
				} finally {
					this._telemetryReporter.sendLoginFailedEvent();
				}
			}
			try {
				// Create the authentication request with claims if provided
				const authRequest = {
					cachedPca,
					authority,
					scopes: scopeData.scopesToSend,
					loginHint: options.account?.label,
					windowHandle: window.nativeHandle ? Buffer.from(window.nativeHandle) : undefined,
					logger: this._logger,
					uriHandler: this._uriHandler,
					claims: scopeData.claims,
					callbackUri
				};

				const result = await flow.trigger(authRequest);

				const session = this.sessionFromAuthenticationResult(result, scopeData.originalScopes);
				this._telemetryReporter.sendLoginEvent(session.scopes);
				this._logger.info('[createSessionFromChallenges]', `[${scopeData.scopeStr}]`, 'returned session');
				return session;
			} catch (e) {
				lastError = e as Error;
				if (e instanceof ClientAuthError && e.errorCode === ClientAuthErrorCodes.userCanceled) {
					this._logger.info('[createSessionFromChallenges]', `[${scopeData.scopeStr}]`, 'user cancelled');
					userCancelled = true;
					continue;
				}
				this._logger.error('[createSessionFromChallenges]', `[${scopeData.scopeStr}]`, 'error', e);
				throw e;
			}
		}

		this._telemetryReporter.sendLoginFailedEvent();
		throw lastError ?? new Error('No auth flow succeeded');
	}

	private extractScopesFromChallenges(challenges: readonly AuthenticationChallenge[]): string[] | undefined {
		for (const challenge of challenges) {
			if (challenge.scheme.toLowerCase() === 'bearer' && challenge.params.scope) {
				return challenge.params.scope.split(' ');
			}
		}
		return undefined;
	}

	private extractClaimsFromChallenges(challenges: readonly AuthenticationChallenge[]): string | undefined {
		for (const challenge of challenges) {
			if (challenge.scheme.toLowerCase() === 'bearer' && challenge.params.claims) {
				try {
					return base64Decode(challenge.params.claims);
				} catch (e) {
					this._logger.warn('[extractClaimsFromChallenges]', 'failed to decode claims... checking if it is already JSON', e);
					try {
						JSON.parse(challenge.params.claims);
						return challenge.params.claims;
					} catch (e) {
						this._logger.error('[extractClaimsFromChallenges]', 'failed to parse claims as JSON... returning undefined', e);
					}
				}
			}
		}
		return undefined;
	}

	//#endregion

	private async getAllSessionsForPca(
		cachedPca: ICachedPublicClientApplication,
		scopeData: ScopeData,
		accountFilter?: AuthenticationSessionAccountInformation
	): Promise<AuthenticationSession[]> {
		let filteredAccounts = accountFilter
			? cachedPca.accounts.filter(a => a.homeAccountId === accountFilter.id)
			: cachedPca.accounts;

		// Group accounts by homeAccountId
		const accountGroups = new Map<string, AccountInfo[]>();
		for (const account of filteredAccounts) {
			const existing = accountGroups.get(account.homeAccountId) || [];
			existing.push(account);
			accountGroups.set(account.homeAccountId, existing);
		}

		// Filter to one account per homeAccountId
		filteredAccounts = Array.from(accountGroups.values()).map(accounts => {
			if (accounts.length === 1) {
				return accounts[0];
			}

			// If we have a specific tenant to target, prefer that one
			if (scopeData.tenantId) {
				const matchingTenant = accounts.find(a => a.tenantId === scopeData.tenantId);
				if (matchingTenant) {
					return matchingTenant;
				}
			}

			// Otherwise prefer the home tenant
			return accounts.find(a => a.tenantId === a.idTokenClaims?.tid) || accounts[0];
		});

		const authority = new URL(scopeData.tenant, this._env.activeDirectoryEndpointUrl).toString();
		const sessions: AuthenticationSession[] = [];
		return this._eventBufferer.bufferEventsAsync(async () => {
			for (const account of filteredAccounts) {
				try {
					let forceRefresh: true | undefined;
					if (scopeData.tenantId) {
						// If the tenants do not match, then we need to skip the cache
						// to get a new token for the new tenant
						if (account.tenantId !== scopeData.tenantId) {
							forceRefresh = true;
						}
					} else {
						// If we are requesting the home tenant and we don't yet have
						// a token for the home tenant, we need to skip the cache
						// to get a new token for the home tenant
						if (account.tenantId !== account.idTokenClaims?.tid) {
							forceRefresh = true;
						}
					}
					// When claims are present, force refresh to ensure we get a token that satisfies the claims
					let claims: string | undefined;
					if (scopeData.claims) {
						forceRefresh = true;
						claims = scopeData.claims;
					}
					let redirectUri: string | undefined;
					// If we have the broker available and are on macOS, we HAVE to include the redirect URI or MSAL will throw an error.
					// HOWEVER, if we are _not_ using the broker, we MUST NOT include the redirect URI or MSAL will throw an error.
					if (cachedPca.isBrokerAvailable && process.platform === 'darwin') {
						redirectUri = Config.macOSBrokerRedirectUri;
					}
					const result = await cachedPca.acquireTokenSilent({
						account,
						authority,
						scopes: scopeData.scopesToSend,
						claims,
						redirectUri,
						forceRefresh
					});
					sessions.push(this.sessionFromAuthenticationResult(result, scopeData.originalScopes));
				} catch (e) {
					// If we can't get a token silently, the account is probably in a bad state so we should skip it
					// MSAL will log this already, so we don't need to log it again
					if (e instanceof AuthError) {
						this._telemetryReporter.sendTelemetryClientAuthErrorEvent(e);
					} else {
						this._telemetryReporter.sendTelemetryErrorEvent(e);
					}
					this._logger.info(`[getAllSessionsForPca] [${scopeData.scopeStr}] [${account.username}] failed to acquire token silently, skipping account`, JSON.stringify(e));
					continue;
				}
			}
			return sessions;
		});
	}

	private sessionFromAuthenticationResult(result: AuthenticationResult, scopes: readonly string[]): AuthenticationSession & { idToken: string } {
		return {
			accessToken: result.accessToken,
			idToken: result.idToken,
			id: result.account?.homeAccountId ?? result.uniqueId,
			account: {
				id: result.account?.homeAccountId ?? result.uniqueId,
				label: result.account?.username.toLowerCase() ?? 'Unknown',
			},
			scopes
		};
	}

	private sessionFromAccountInfo(account: AccountInfo): AuthenticationSession {
		return {
			accessToken: '1234',
			id: account.homeAccountId,
			scopes: [],
			account: {
				id: account.homeAccountId,
				label: account.username.toLowerCase(),
			},
			idToken: account.idToken,
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/node/authServer.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/node/authServer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as http from 'http';
import { URL } from 'url';
import * as fs from 'fs';
import * as path from 'path';
import { randomBytes } from 'crypto';

function sendFile(res: http.ServerResponse, filepath: string) {
	fs.readFile(filepath, (err, body) => {
		if (err) {
			console.error(err);
			res.writeHead(404);
			res.end();
		} else {
			res.writeHead(200, {
				'content-length': body.length,
			});
			res.end(body);
		}
	});
}

interface IOAuthResult {
	code: string;
	state: string;
}

interface ILoopbackServer {
	/**
	 * If undefined, the server is not started yet.
	 */
	port: number | undefined;

	/**
	 * The nonce used
	 */
	nonce: string;

	/**
	 * The state parameter used in the OAuth flow.
	 */
	state: string | undefined;

	/**
	 * Starts the server.
	 * @returns The port to listen on.
	 * @throws If the server fails to start.
	 * @throws If the server is already started.
	 */
	start(): Promise<number>;
	/**
	 * Stops the server.
	 * @throws If the server is not started.
	 * @throws If the server fails to stop.
	 */
	stop(): Promise<void>;
	/**
	 * Returns a promise that resolves to the result of the OAuth flow.
	 */
	waitForOAuthResponse(): Promise<IOAuthResult>;
}

export class LoopbackAuthServer implements ILoopbackServer {
	private readonly _server: http.Server;
	private readonly _resultPromise: Promise<IOAuthResult>;
	private _startingRedirect: URL;

	public nonce = randomBytes(16).toString('base64');
	public port: number | undefined;

	public set state(state: string | undefined) {
		if (state) {
			this._startingRedirect.searchParams.set('state', state);
		} else {
			this._startingRedirect.searchParams.delete('state');
		}
	}
	public get state(): string | undefined {
		return this._startingRedirect.searchParams.get('state') ?? undefined;
	}

	constructor(serveRoot: string, startingRedirect: string) {
		if (!serveRoot) {
			throw new Error('serveRoot must be defined');
		}
		if (!startingRedirect) {
			throw new Error('startingRedirect must be defined');
		}
		this._startingRedirect = new URL(startingRedirect);
		let deferred: { resolve: (result: IOAuthResult) => void; reject: (reason: any) => void };
		this._resultPromise = new Promise<IOAuthResult>((resolve, reject) => deferred = { resolve, reject });

		this._server = http.createServer((req, res) => {
			const reqUrl = new URL(req.url!, `http://${req.headers.host}`);
			switch (reqUrl.pathname) {
				case '/signin': {
					const receivedNonce = (reqUrl.searchParams.get('nonce') ?? '').replace(/ /g, '+');
					if (receivedNonce !== this.nonce) {
						res.writeHead(302, { location: `/?error=${encodeURIComponent('Nonce does not match.')}` });
						res.end();
					}
					res.writeHead(302, { location: this._startingRedirect.toString() });
					res.end();
					break;
				}
				case '/callback': {
					const code = reqUrl.searchParams.get('code') ?? undefined;
					const state = reqUrl.searchParams.get('state') ?? undefined;
					const nonce = (reqUrl.searchParams.get('nonce') ?? '').replace(/ /g, '+');
					const error = reqUrl.searchParams.get('error') ?? undefined;
					if (error) {
						res.writeHead(302, { location: `/?error=${reqUrl.searchParams.get('error_description')}` });
						res.end();
						deferred.reject(new Error(error));
						break;
					}
					if (!code || !state || !nonce) {
						res.writeHead(400);
						res.end();
						break;
					}
					if (this.state !== state) {
						res.writeHead(302, { location: `/?error=${encodeURIComponent('State does not match.')}` });
						res.end();
						deferred.reject(new Error('State does not match.'));
						break;
					}
					if (this.nonce !== nonce) {
						res.writeHead(302, { location: `/?error=${encodeURIComponent('Nonce does not match.')}` });
						res.end();
						deferred.reject(new Error('Nonce does not match.'));
						break;
					}
					deferred.resolve({ code, state });
					res.writeHead(302, { location: '/' });
					res.end();
					break;
				}
				// Serve the static files
				case '/':
					sendFile(res, path.join(serveRoot, 'index.html'));
					break;
				default:
					// substring to get rid of leading '/'
					sendFile(res, path.join(serveRoot, reqUrl.pathname.substring(1)));
					break;
			}
		});
	}

	public start(): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			if (this._server.listening) {
				throw new Error('Server is already started');
			}
			const portTimeout = setTimeout(() => {
				reject(new Error('Timeout waiting for port'));
			}, 5000);
			this._server.on('listening', () => {
				const address = this._server.address();
				if (typeof address === 'string') {
					this.port = parseInt(address);
				} else if (address instanceof Object) {
					this.port = address.port;
				} else {
					throw new Error('Unable to determine port');
				}

				clearTimeout(portTimeout);

				// set state which will be used to redirect back to vscode
				this.state = `http://127.0.0.1:${this.port}/callback?nonce=${encodeURIComponent(this.nonce)}`;

				resolve(this.port);
			});
			this._server.on('error', err => {
				reject(new Error(`Error listening to server: ${err}`));
			});
			this._server.on('close', () => {
				reject(new Error('Closed'));
			});
			this._server.listen(0, '127.0.0.1');
		});
	}

	public stop(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			if (!this._server.listening) {
				throw new Error('Server is not started');
			}
			this._server.close((err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	public waitForOAuthResponse(): Promise<IOAuthResult> {
		return this._resultPromise;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/node/buffer.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/node/buffer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function base64Encode(text: string): string {
	return Buffer.from(text, 'binary').toString('base64');
}

export function base64Decode(text: string): string {
	return Buffer.from(text, 'base64').toString('utf8');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/node/cachedPublicClientApplication.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/node/cachedPublicClientApplication.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { PublicClientApplication, AccountInfo, SilentFlowRequest, AuthenticationResult, InteractiveRequest, LogLevel, RefreshTokenRequest, BrokerOptions, DeviceCodeRequest } from '@azure/msal-node';
import { NativeBrokerPlugin } from '@azure/msal-node-extensions';
import { Disposable, SecretStorage, LogOutputChannel, window, ProgressLocation, l10n, EventEmitter, workspace, env, Uri, UIKind } from 'vscode';
import { DeferredPromise, raceCancellationAndTimeoutError } from '../common/async';
import { SecretStorageCachePlugin } from '../common/cachePlugin';
import { MsalLoggerOptions } from '../common/loggerOptions';
import { ICachedPublicClientApplication } from '../common/publicClientCache';
import { IAccountAccess } from '../common/accountAccess';
import { MicrosoftAuthenticationTelemetryReporter } from '../common/telemetryReporter';

export class CachedPublicClientApplication implements ICachedPublicClientApplication {
	// Core properties
	private _pca: PublicClientApplication;
	private _accounts: AccountInfo[] = [];
	private _sequencer = new Sequencer();
	private readonly _disposable: Disposable;

	// Cache properties
	private readonly _secretStorageCachePlugin: SecretStorageCachePlugin;

	// Broker properties
	readonly isBrokerAvailable: boolean = false;

	//#region Events

	private readonly _onDidAccountsChangeEmitter = new EventEmitter<{ added: AccountInfo[]; changed: AccountInfo[]; deleted: AccountInfo[] }>;
	readonly onDidAccountsChange = this._onDidAccountsChangeEmitter.event;

	private readonly _onDidRemoveLastAccountEmitter = new EventEmitter<void>();
	readonly onDidRemoveLastAccount = this._onDidRemoveLastAccountEmitter.event;

	//#endregion

	private constructor(
		private readonly _clientId: string,
		private readonly _secretStorage: SecretStorage,
		private readonly _accountAccess: IAccountAccess,
		private readonly _logger: LogOutputChannel,
		telemetryReporter: MicrosoftAuthenticationTelemetryReporter
	) {
		this._secretStorageCachePlugin = new SecretStorageCachePlugin(
			this._secretStorage,
			// Include the prefix as a differentiator to other secrets
			`pca:${this._clientId}`
		);

		const loggerOptions = new MsalLoggerOptions(_logger, telemetryReporter);
		let broker: BrokerOptions | undefined;
		if (env.uiKind === UIKind.Web) {
			this._logger.info(`[${this._clientId}] Native Broker is not available in web UI`);
		} else if (workspace.getConfiguration('microsoft-authentication').get<'msal' | 'msal-no-broker'>('implementation') === 'msal-no-broker') {
			this._logger.info(`[${this._clientId}] Native Broker disabled via settings`);
		} else {
			const nativeBrokerPlugin = new NativeBrokerPlugin();
			this.isBrokerAvailable = nativeBrokerPlugin.isBrokerAvailable;
			this._logger.info(`[${this._clientId}] Native Broker enabled: ${this.isBrokerAvailable}`);
			if (this.isBrokerAvailable) {
				broker = { nativeBrokerPlugin };
			}
		}
		this._pca = new PublicClientApplication({
			auth: { clientId: _clientId },
			system: {
				loggerOptions: {
					correlationId: _clientId,
					loggerCallback: (level, message, containsPii) => loggerOptions.loggerCallback(level, message, containsPii),
					logLevel: LogLevel.Trace,
					// Enable PII logging since it will only go to the output channel
					piiLoggingEnabled: true
				}
			},
			broker,
			cache: { cachePlugin: this._secretStorageCachePlugin }
		});
		this._disposable = Disposable.from(
			this._registerOnSecretStorageChanged(),
			this._onDidAccountsChangeEmitter,
			this._onDidRemoveLastAccountEmitter,
			this._secretStorageCachePlugin
		);
	}

	get accounts(): AccountInfo[] { return this._accounts; }
	get clientId(): string { return this._clientId; }

	static async create(
		clientId: string,
		secretStorage: SecretStorage,
		accountAccess: IAccountAccess,
		logger: LogOutputChannel,
		telemetryReporter: MicrosoftAuthenticationTelemetryReporter
	): Promise<CachedPublicClientApplication> {
		const app = new CachedPublicClientApplication(clientId, secretStorage, accountAccess, logger, telemetryReporter);
		await app.initialize();
		return app;
	}

	private async initialize(): Promise<void> {
		await this._sequencer.queue(() => this._update());
	}

	dispose(): void {
		this._disposable.dispose();
	}

	async acquireTokenSilent(request: SilentFlowRequest): Promise<AuthenticationResult> {
		this._logger.debug(`[acquireTokenSilent] [${this._clientId}] [${request.authority}] [${request.scopes.join(' ')}] [${request.account.username}] starting...`);
		let result = await this._sequencer.queue(() => this._pca.acquireTokenSilent(request));
		this._logger.debug(`[acquireTokenSilent] [${this._clientId}] [${request.authority}] [${request.scopes.join(' ')}] [${request.account.username}] got result`);
		// Check expiration of id token and if it's 5min before expiration, force a refresh.
		// this is what MSAL does for access tokens already so we're just adding it for id tokens since we care about those.
		// NOTE: Once we stop depending on id tokens for some things we can remove all of this.
		const idTokenExpirationInSecs = (result.idTokenClaims as { exp?: number }).exp;
		if (idTokenExpirationInSecs) {
			const fiveMinutesBefore = new Date(
				(idTokenExpirationInSecs - 5 * 60) // subtract 5 minutes
				* 1000 // convert to milliseconds
			);
			if (fiveMinutesBefore < new Date()) {
				this._logger.debug(`[acquireTokenSilent] [${this._clientId}] [${request.authority}] [${request.scopes.join(' ')}] [${request.account.username}] id token is expired or about to expire. Forcing refresh...`);
				const newRequest = this.isBrokerAvailable
					// HACK: Broker doesn't support forceRefresh so we need to pass in claims which will force a refresh
					? { ...request, claims: request.claims ?? '{ "id_token": {}}' }
					: { ...request, forceRefresh: true };
				result = await this._sequencer.queue(() => this._pca.acquireTokenSilent(newRequest));
				this._logger.debug(`[acquireTokenSilent] [${this._clientId}] [${request.authority}] [${request.scopes.join(' ')}] [${request.account.username}] got forced result`);
			}
			const newIdTokenExpirationInSecs = (result.idTokenClaims as { exp?: number }).exp;
			if (newIdTokenExpirationInSecs) {
				const fiveMinutesBefore = new Date(
					(newIdTokenExpirationInSecs - 5 * 60) // subtract 5 minutes
					* 1000 // convert to milliseconds
				);
				if (fiveMinutesBefore < new Date()) {
					this._logger.error(`[acquireTokenSilent] [${this._clientId}] [${request.authority}] [${request.scopes.join(' ')}] [${request.account.username}] id token is still expired.`);

					// HACK: Only for the Broker we try one more time with different claims to force a refresh. Why? We've seen the Broker caching tokens by the claims requested, thus
					// there has been a situation where both tokens are expired.
					if (this.isBrokerAvailable) {
						this._logger.error(`[acquireTokenSilent] [${this._clientId}] [${request.authority}] [${request.scopes.join(' ')}] [${request.account.username}] forcing refresh with different claims...`);
						const newRequest = { ...request, claims: request.claims ?? '{ "access_token": {}}' };
						result = await this._sequencer.queue(() => this._pca.acquireTokenSilent(newRequest));
						this._logger.debug(`[acquireTokenSilent] [${this._clientId}] [${request.authority}] [${request.scopes.join(' ')}] [${request.account.username}] got forced result with different claims`);
						const newIdTokenExpirationInSecs = (result.idTokenClaims as { exp?: number }).exp;
						if (newIdTokenExpirationInSecs) {
							const fiveMinutesBefore = new Date(
								(newIdTokenExpirationInSecs - 5 * 60) // subtract 5 minutes
								* 1000 // convert to milliseconds
							);
							if (fiveMinutesBefore < new Date()) {
								this._logger.error(`[acquireTokenSilent] [${this._clientId}] [${request.authority}] [${request.scopes.join(' ')}] [${request.account.username}] id token is still expired.`);
							}
						}
					}
				}
			}
		}

		if (!result.account) {
			this._logger.error(`[acquireTokenSilent] [${this._clientId}] [${request.authority}] [${request.scopes.join(' ')}] [${request.account.username}] no account found in result`);
		} else if (!result.fromCache && this._verifyIfUsingBroker(result)) {
			this._logger.debug(`[acquireTokenSilent] [${this._clientId}] [${request.authority}] [${request.scopes.join(' ')}] [${request.account.username}] firing event due to change`);
			this._onDidAccountsChangeEmitter.fire({ added: [], changed: [result.account], deleted: [] });
		}
		return result;
	}

	async acquireTokenInteractive(request: InteractiveRequest): Promise<AuthenticationResult> {
		this._logger.debug(`[acquireTokenInteractive] [${this._clientId}] [${request.authority}] [${request.scopes?.join(' ')}] loopbackClientOverride: ${request.loopbackClient ? 'true' : 'false'}`);
		return await window.withProgress(
			{
				location: ProgressLocation.Notification,
				cancellable: true,
				title: l10n.t('Signing in to Microsoft...')
			},
			(_process, token) => this._sequencer.queue(async () => {
				try {
					const result = await raceCancellationAndTimeoutError(
						this._pca.acquireTokenInteractive(request),
						token,
						1000 * 60 * 5
					);
					if (this.isBrokerAvailable) {
						await this._accountAccess.setAllowedAccess(result.account!, true);
					}
					// Force an update so that the account cache is updated.
					// TODO:@TylerLeonhardt The problem is, we use the sequencer for
					// change events but we _don't_ use it for the accounts cache.
					// We should probably use it for the accounts cache as well.
					await this._update();
					return result;
				} catch (error) {
					this._logger.error(`[acquireTokenInteractive] [${this._clientId}] [${request.authority}] [${request.scopes?.join(' ')}] error: ${error}`);
					throw error;
				}
			})
		);
	}

	/**
	 * Allows for passing in a refresh token to get a new access token. This is the migration scenario.
	 * TODO: MSAL Migration. Remove this when we remove the old flow.
	 * @param request a {@link RefreshTokenRequest} object that contains the refresh token and other parameters.
	 * @returns an {@link AuthenticationResult} object that contains the result of the token acquisition operation.
	 */
	async acquireTokenByRefreshToken(request: RefreshTokenRequest): Promise<AuthenticationResult | null> {
		this._logger.debug(`[acquireTokenByRefreshToken] [${this._clientId}] [${request.authority}] [${request.scopes.join(' ')}]`);
		const result = await this._sequencer.queue(async () => {
			const result = await this._pca.acquireTokenByRefreshToken(request);
			// Force an update so that the account cache is updated.
			// TODO:@TylerLeonhardt The problem is, we use the sequencer for
			// change events but we _don't_ use it for the accounts cache.
			// We should probably use it for the accounts cache as well.
			await this._update();
			return result;
		});
		if (result) {
			// this._setupRefresh(result);
			if (this.isBrokerAvailable && result.account) {
				await this._accountAccess.setAllowedAccess(result.account, true);
			}
		}
		return result;
	}

	async acquireTokenByDeviceCode(request: Omit<DeviceCodeRequest, 'deviceCodeCallback'>): Promise<AuthenticationResult | null> {
		this._logger.debug(`[acquireTokenByDeviceCode] [${this._clientId}] [${request.authority}] [${request.scopes.join(' ')}]`);
		const result = await this._sequencer.queue(async () => {
			const deferredPromise = new DeferredPromise<AuthenticationResult | null>();
			const result = await Promise.race([
				this._pca.acquireTokenByDeviceCode({
					...request,
					deviceCodeCallback: (response) => void this._deviceCodeCallback(response, deferredPromise)
				}),
				deferredPromise.p
			]);
			await deferredPromise.complete(result);
			// Force an update so that the account cache is updated.
			// TODO:@TylerLeonhardt The problem is, we use the sequencer for
			// change events but we _don't_ use it for the accounts cache.
			// We should probably use it for the accounts cache as well.
			await this._update();
			return result;
		});
		if (result) {
			if (this.isBrokerAvailable && result.account) {
				await this._accountAccess.setAllowedAccess(result.account, true);
			}
		}
		return result;
	}

	private async _deviceCodeCallback(
		// MSAL doesn't expose this type...
		response: Parameters<DeviceCodeRequest['deviceCodeCallback']>[0],
		deferredPromise: DeferredPromise<AuthenticationResult | null>
	): Promise<void> {
		const button = l10n.t('Copy & Continue to Microsoft');
		const modalResult = await window.showInformationMessage(
			l10n.t({ message: 'Your Code: {0}', args: [response.userCode], comment: ['The {0} will be a code, e.g. 123-456'] }),
			{
				modal: true,
				detail: l10n.t('To finish authenticating, navigate to Microsoft and paste in the above one-time code.')
			}, button);

		if (modalResult !== button) {
			this._logger.debug(`[deviceCodeCallback] [${this._clientId}] User cancelled the device code flow.`);
			deferredPromise.cancel();
			return;
		}

		await env.clipboard.writeText(response.userCode);
		await env.openExternal(Uri.parse(response.verificationUri));
		await window.withProgress<void>({
			location: ProgressLocation.Notification,
			cancellable: true,
			title: l10n.t({
				message: 'Open [{0}]({0}) in a new tab and paste your one-time code: {1}',
				args: [response.verificationUri, response.userCode],
				comment: [
					'The [{0}]({0}) will be a url and the {1} will be a code, e.g. 123456',
					'{Locked="[{0}]({0})"}'
				]
			})
		}, async (_, token) => {
			const disposable = token.onCancellationRequested(() => {
				this._logger.debug(`[deviceCodeCallback] [${this._clientId}] Device code flow cancelled by user.`);
				deferredPromise.cancel();
			});
			try {
				await deferredPromise.p;
				this._logger.debug(`[deviceCodeCallback] [${this._clientId}] Device code flow completed successfully.`);
			} catch (error) {
				// Ignore errors here, they are handled at a higher scope
			} finally {
				disposable.dispose();
			}
		});
	}

	removeAccount(account: AccountInfo): Promise<void> {
		if (this.isBrokerAvailable) {
			return this._accountAccess.setAllowedAccess(account, false);
		}
		return this._sequencer.queue(() => this._pca.getTokenCache().removeAccount(account));
	}

	private _registerOnSecretStorageChanged() {
		if (this.isBrokerAvailable) {
			return this._accountAccess.onDidAccountAccessChange(() => this._sequencer.queue(() => this._update()));
		}
		return this._secretStorageCachePlugin.onDidChange(() => this._sequencer.queue(() => this._update()));
	}

	private _lastSeen = new Map<string, number>();
	private _verifyIfUsingBroker(result: AuthenticationResult): boolean {
		// If we're not brokering, we don't need to verify the date
		// the cache check will be sufficient
		if (!result.fromNativeBroker) {
			return true;
		}
		// The nativeAccountId is what the broker uses to differenciate all
		// types of accounts. Even if the "account" is a duplicate of another because
		// it's actaully a guest account in another tenant.
		let key = result.account!.nativeAccountId;
		if (!key) {
			this._logger.error(`[verifyIfUsingBroker] [${this._clientId}] [${result.account!.username}] no nativeAccountId found. Using homeAccountId instead.`);
			key = result.account!.homeAccountId;
		}
		const lastSeen = this._lastSeen.get(key);
		const lastTimeAuthed = result.account!.idTokenClaims!.iat!;
		if (!lastSeen) {
			this._lastSeen.set(key, lastTimeAuthed);
			return true;
		}
		if (lastSeen === lastTimeAuthed) {
			return false;
		}
		this._lastSeen.set(key, lastTimeAuthed);
		return true;
	}

	private async _update() {
		const before = this._accounts;
		this._logger.debug(`[update] [${this._clientId}] CachedPublicClientApplication update before: ${before.length}`);
		// Clear in-memory cache so we know we're getting account data from the SecretStorage
		this._pca.clearCache();
		let after = await this._pca.getAllAccounts();
		if (this.isBrokerAvailable) {
			after = after.filter(a => this._accountAccess.isAllowedAccess(a));
		}
		this._accounts = after;
		this._logger.debug(`[update] [${this._clientId}] CachedPublicClientApplication update after: ${after.length}`);

		const beforeSet = new Set(before.map(b => b.homeAccountId));
		const afterSet = new Set(after.map(a => a.homeAccountId));

		const added = after.filter(a => !beforeSet.has(a.homeAccountId));
		const deleted = before.filter(b => !afterSet.has(b.homeAccountId));
		if (added.length > 0 || deleted.length > 0) {
			this._onDidAccountsChangeEmitter.fire({ added, changed: [], deleted });
			this._logger.debug(`[update] [${this._clientId}] CachedPublicClientApplication accounts changed. added: ${added.length}, deleted: ${deleted.length}`);
			if (!after.length) {
				this._logger.debug(`[update] [${this._clientId}] CachedPublicClientApplication final account deleted. Firing event.`);
				this._onDidRemoveLastAccountEmitter.fire();
			}
		}
		this._logger.debug(`[update] [${this._clientId}] CachedPublicClientApplication update complete`);
	}
}

export class Sequencer {

	private current: Promise<unknown> = Promise.resolve(null);

	queue<T>(promiseTask: () => Promise<T>): Promise<T> {
		return this.current = this.current.then(() => promiseTask(), () => promiseTask());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/node/fetch.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/node/fetch.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

let _fetch: typeof fetch;
try {
	_fetch = require('electron').net.fetch;
} catch {
	_fetch = fetch;
}
export default _fetch;
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/node/flows.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/node/flows.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AuthenticationResult } from '@azure/msal-node';
import { Uri, LogOutputChannel, env } from 'vscode';
import { ICachedPublicClientApplication } from '../common/publicClientCache';
import { UriHandlerLoopbackClient } from '../common/loopbackClientAndOpener';
import { UriEventHandler } from '../UriEventHandler';
import { loopbackTemplate } from './loopbackTemplate';
import { Config } from '../common/config';

const DEFAULT_REDIRECT_URI = 'https://vscode.dev/redirect';

export const enum ExtensionHost {
	Remote,
	Local
}

interface IMsalFlowOptions {
	supportsRemoteExtensionHost: boolean;
	supportsUnsupportedClient: boolean;
	supportsBroker: boolean;
}

interface IMsalFlowTriggerOptions {
	cachedPca: ICachedPublicClientApplication;
	authority: string;
	scopes: string[];
	callbackUri: Uri;
	loginHint?: string;
	windowHandle?: Buffer;
	logger: LogOutputChannel;
	uriHandler: UriEventHandler;
	claims?: string;
}

interface IMsalFlow {
	readonly label: string;
	readonly options: IMsalFlowOptions;
	trigger(options: IMsalFlowTriggerOptions): Promise<AuthenticationResult>;
}

class DefaultLoopbackFlow implements IMsalFlow {
	label = 'default';
	options: IMsalFlowOptions = {
		supportsRemoteExtensionHost: false,
		supportsUnsupportedClient: true,
		supportsBroker: true
	};

	async trigger({ cachedPca, authority, scopes, claims, loginHint, windowHandle, logger }: IMsalFlowTriggerOptions): Promise<AuthenticationResult> {
		logger.info('Trying default msal flow...');
		let redirectUri: string | undefined;
		if (cachedPca.isBrokerAvailable && process.platform === 'darwin') {
			redirectUri = Config.macOSBrokerRedirectUri;
		}
		return await cachedPca.acquireTokenInteractive({
			openBrowser: async (url: string) => { await env.openExternal(Uri.parse(url)); },
			scopes,
			authority,
			successTemplate: loopbackTemplate,
			errorTemplate: loopbackTemplate,
			loginHint,
			prompt: loginHint ? undefined : 'select_account',
			windowHandle,
			claims,
			redirectUri
		});
	}
}

class UrlHandlerFlow implements IMsalFlow {
	label = 'protocol handler';
	options: IMsalFlowOptions = {
		supportsRemoteExtensionHost: true,
		supportsUnsupportedClient: false,
		supportsBroker: false
	};

	async trigger({ cachedPca, authority, scopes, claims, loginHint, windowHandle, logger, uriHandler, callbackUri }: IMsalFlowTriggerOptions): Promise<AuthenticationResult> {
		logger.info('Trying protocol handler flow...');
		const loopbackClient = new UriHandlerLoopbackClient(uriHandler, DEFAULT_REDIRECT_URI, callbackUri, logger);
		let redirectUri: string | undefined;
		if (cachedPca.isBrokerAvailable && process.platform === 'darwin') {
			redirectUri = Config.macOSBrokerRedirectUri;
		}
		return await cachedPca.acquireTokenInteractive({
			openBrowser: (url: string) => loopbackClient.openBrowser(url),
			scopes,
			authority,
			loopbackClient,
			loginHint,
			prompt: loginHint ? undefined : 'select_account',
			windowHandle,
			claims,
			redirectUri
		});
	}
}

class DeviceCodeFlow implements IMsalFlow {
	label = 'device code';
	options: IMsalFlowOptions = {
		supportsRemoteExtensionHost: true,
		supportsUnsupportedClient: true,
		supportsBroker: false
	};

	async trigger({ cachedPca, authority, scopes, claims, logger }: IMsalFlowTriggerOptions): Promise<AuthenticationResult> {
		logger.info('Trying device code flow...');
		const result = await cachedPca.acquireTokenByDeviceCode({ scopes, authority, claims });
		if (!result) {
			throw new Error('Device code flow did not return a result');
		}
		return result;
	}
}

const allFlows: IMsalFlow[] = [
	new DefaultLoopbackFlow(),
	new UrlHandlerFlow(),
	new DeviceCodeFlow()
];

export interface IMsalFlowQuery {
	extensionHost: ExtensionHost;
	supportedClient: boolean;
	isBrokerSupported: boolean;
}

export function getMsalFlows(query: IMsalFlowQuery): IMsalFlow[] {
	const flows = [];
	for (const flow of allFlows) {
		let useFlow: boolean = true;
		if (query.extensionHost === ExtensionHost.Remote) {
			useFlow &&= flow.options.supportsRemoteExtensionHost;
		}
		useFlow &&= flow.options.supportsBroker || !query.isBrokerSupported;
		useFlow &&= flow.options.supportsUnsupportedClient || query.supportedClient;
		if (useFlow) {
			flows.push(flow);
		}
	}
	return flows;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/node/loopbackTemplate.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/node/loopbackTemplate.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export const loopbackTemplate = `
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8" />
	<title>Microsoft Account - Sign In</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<style>
		html {
			height: 100%;
		}

		body {
			box-sizing: border-box;
			min-height: 100%;
			margin: 0;
			padding: 15px 30px;
			display: flex;
			flex-direction: column;
			color: white;
			font-family: "Segoe UI","Helvetica Neue","Helvetica",Arial,sans-serif;
			background-color: #2C2C32;
		}

		.branding {
			background-image: url('data:image/png;base64,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');
			background-size: 24px;
			background-repeat: no-repeat;
			background-position: left center;
			padding-left: 36px;
			font-size: 20px;
			letter-spacing: -0.04rem;
			font-weight: 400;
			color: white;
			text-decoration: none;
		}

		.message-container {
			flex-grow: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0 30px;
		}

		.message {
			font-weight: 300;
			font-size: 1.4rem;
		}

		body.error .message {
			display: none;
		}

		body.error .error-message {
			display: block;
		}

		.error-message {
			display: none;
			max-width: 800px;
			font-weight: 300;
			font-size: 1.3rem;
		}

		.error-text {
			color: salmon;
			font-size: 1rem;
		}

		@font-face {
			font-family: 'Segoe UI';
			src: url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.eot"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.eot?#iefix") format("embedded-opentype");
			src: local("Segoe UI Light"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.woff2") format("woff2"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.woff") format("woff"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.ttf") format("truetype"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.svg#web") format("svg");
			font-weight: 200
		}

		@font-face {
			font-family: 'Segoe UI';
			src: url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.eot"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.eot?#iefix") format("embedded-opentype");
			src: local("Segoe UI Semilight"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.woff2") format("woff2"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.woff") format("woff"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.ttf") format("truetype"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.svg#web") format("svg");
			font-weight: 300
		}

		@font-face {
			font-family: 'Segoe UI';
			src: url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.eot"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.eot?#iefix") format("embedded-opentype");
			src: local("Segoe UI"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.woff2") format("woff"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.woff") format("woff"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.ttf") format("truetype"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.svg#web") format("svg");
			font-weight: 400
		}

		@font-face {
			font-family: 'Segoe UI';
			src: url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.eot"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.eot?#iefix") format("embedded-opentype");
			src: local("Segoe UI Semibold"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.woff2") format("woff"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.woff") format("woff"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.ttf") format("truetype"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.svg#web") format("svg");
			font-weight: 600
		}

		@font-face {
			font-family: 'Segoe UI';
			src: url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.eot"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.eot?#iefix") format("embedded-opentype");
			src: local("Segoe UI Bold"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.woff2") format("woff"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.woff") format("woff"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.ttf") format("truetype"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.svg#web") format("svg");
			font-weight: 700
		}
	</style>
</head>

<body>
	<a class="branding" href="https://code.visualstudio.com/">
		Visual Studio Code
	</a>
	<div class="message-container">
		<div class="message">
			You are signed in now and can close this page.
		</div>
		<div class="error-message">
			An error occurred while signing in:
			<div class="error-text"></div>
		</div>
	</div>
	<script>
		var search = new URLSearchParams(window.location.search);
		var error = search.get('error');
		if (error) {
			const description = search.get('error_description');
			document.querySelector('.error-text')
				.textContent = error + ' - ' + description;
			document.querySelector('body')
				.classList.add('error');
		}
	</script>
</body>

</html>
`;
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/node/publicClientCache.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/node/publicClientCache.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AccountInfo } from '@azure/msal-node';
import { SecretStorage, LogOutputChannel, Disposable, EventEmitter, Memento, Event } from 'vscode';
import { ICachedPublicClientApplication, ICachedPublicClientApplicationManager } from '../common/publicClientCache';
import { CachedPublicClientApplication } from './cachedPublicClientApplication';
import { IAccountAccess, ScopedAccountAccess } from '../common/accountAccess';
import { MicrosoftAuthenticationTelemetryReporter } from '../common/telemetryReporter';
import { Environment } from '@azure/ms-rest-azure-env';
import { Config } from '../common/config';
import { DEFAULT_REDIRECT_URI } from '../common/env';

export interface IPublicClientApplicationInfo {
	clientId: string;
	authority: string;
}

export class CachedPublicClientApplicationManager implements ICachedPublicClientApplicationManager {
	// The key is the clientId
	private readonly _pcas = new Map<string, ICachedPublicClientApplication>();
	private readonly _pcaDisposables = new Map<string, Disposable>();

	private _disposable: Disposable;

	private readonly _onDidAccountsChangeEmitter = new EventEmitter<{ added: AccountInfo[]; changed: AccountInfo[]; deleted: AccountInfo[] }>();
	readonly onDidAccountsChange = this._onDidAccountsChangeEmitter.event;

	private constructor(
		private readonly _env: Environment,
		private readonly _pcasSecretStorage: IPublicClientApplicationSecretStorage,
		private readonly _accountAccess: IAccountAccess,
		private readonly _secretStorage: SecretStorage,
		private readonly _logger: LogOutputChannel,
		private readonly _telemetryReporter: MicrosoftAuthenticationTelemetryReporter,
		disposables: Disposable[]
	) {
		this._disposable = Disposable.from(
			...disposables,
			this._registerSecretStorageHandler(),
			this._onDidAccountsChangeEmitter
		);
	}

	static async create(
		secretStorage: SecretStorage,
		logger: LogOutputChannel,
		telemetryReporter: MicrosoftAuthenticationTelemetryReporter,
		env: Environment
	): Promise<CachedPublicClientApplicationManager> {
		const pcasSecretStorage = await PublicClientApplicationsSecretStorage.create(secretStorage, env.name);
		// TODO: Remove the migrations in a version
		const migrations = await pcasSecretStorage.getOldValue();
		const accountAccess = await ScopedAccountAccess.create(secretStorage, env.name, logger, migrations);
		const manager = new CachedPublicClientApplicationManager(env, pcasSecretStorage, accountAccess, secretStorage, logger, telemetryReporter, [pcasSecretStorage, accountAccess]);
		await manager.initialize();
		return manager;
	}

	private _registerSecretStorageHandler() {
		return this._pcasSecretStorage.onDidChange(() => this._handleSecretStorageChange());
	}

	private async initialize() {
		this._logger.debug('[initialize] Initializing PublicClientApplicationManager');
		let clientIds: string[] | undefined;
		try {
			clientIds = await this._pcasSecretStorage.get();
		} catch (e) {
			// data is corrupted
			this._logger.error('[initialize] Error initializing PublicClientApplicationManager:', e);
			await this._pcasSecretStorage.delete();
		}
		if (!clientIds) {
			return;
		}

		const promises = new Array<Promise<ICachedPublicClientApplication>>();
		for (const clientId of clientIds) {
			try {
				// Load the PCA in memory
				promises.push(this._doCreatePublicClientApplication(clientId));
			} catch (e) {
				this._logger.error('[initialize] Error intitializing PCA:', clientId);
			}
		}

		const results = await Promise.allSettled(promises);
		let pcasChanged = false;
		for (const result of results) {
			if (result.status === 'rejected') {
				this._logger.error('[initialize] Error getting PCA:', result.reason);
			} else {
				if (!result.value.accounts.length) {
					pcasChanged = true;
					const clientId = result.value.clientId;
					this._pcaDisposables.get(clientId)?.dispose();
					this._pcaDisposables.delete(clientId);
					this._pcas.delete(clientId);
					this._logger.debug(`[initialize] [${clientId}] PCA disposed because it's empty.`);
				}
			}
		}
		if (pcasChanged) {
			await this._storePublicClientApplications();
		}
		this._logger.debug('[initialize] PublicClientApplicationManager initialized');
	}

	dispose() {
		this._disposable.dispose();
		Disposable.from(...this._pcaDisposables.values()).dispose();
	}

	async getOrCreate(clientId: string, migrate?: { refreshTokensToMigrate?: string[]; tenant: string }): Promise<ICachedPublicClientApplication> {
		let pca = this._pcas.get(clientId);
		if (pca) {
			this._logger.debug(`[getOrCreate] [${clientId}] PublicClientApplicationManager cache hit`);
		} else {
			this._logger.debug(`[getOrCreate] [${clientId}] PublicClientApplicationManager cache miss, creating new PCA...`);
			pca = await this._doCreatePublicClientApplication(clientId);
			await this._storePublicClientApplications();
			this._logger.debug(`[getOrCreate] [${clientId}] PCA created.`);
		}

		// TODO: MSAL Migration. Remove this when we remove the old flow.
		if (migrate?.refreshTokensToMigrate?.length) {
			this._logger.debug(`[getOrCreate] [${clientId}] Migrating refresh tokens to PCA...`);
			const authority = new URL(migrate.tenant, this._env.activeDirectoryEndpointUrl).toString();
			let redirectUri = DEFAULT_REDIRECT_URI;
			if (pca.isBrokerAvailable && process.platform === 'darwin') {
				redirectUri = Config.macOSBrokerRedirectUri;
			}
			for (const refreshToken of migrate.refreshTokensToMigrate) {
				try {
					// Use the refresh token to acquire a result. This will cache the refresh token for future operations.
					// The scopes don't matter here since we can create any token from the refresh token.
					const result = await pca.acquireTokenByRefreshToken({
						refreshToken,
						forceCache: true,
						scopes: [],
						authority,
						redirectUri
					});
					if (result?.account) {
						this._logger.debug(`[getOrCreate] [${clientId}] Refresh token migrated to PCA.`);
					}
				} catch (e) {
					this._logger.error(`[getOrCreate] [${clientId}] Error migrating refresh token:`, e);
				}
			}
		}
		return pca;
	}

	private async _doCreatePublicClientApplication(clientId: string): Promise<ICachedPublicClientApplication> {
		const pca = await CachedPublicClientApplication.create(clientId, this._secretStorage, this._accountAccess, this._logger, this._telemetryReporter);
		this._pcas.set(clientId, pca);
		const disposable = Disposable.from(
			pca,
			pca.onDidAccountsChange(e => this._onDidAccountsChangeEmitter.fire(e)),
			pca.onDidRemoveLastAccount(() => {
				// The PCA has no more accounts, so we can dispose it so we're not keeping it
				// around forever.
				disposable.dispose();
				this._pcaDisposables.delete(clientId);
				this._pcas.delete(clientId);
				this._logger.debug(`[_doCreatePublicClientApplication] [${clientId}] PCA disposed. Firing off storing of PCAs...`);
				void this._storePublicClientApplications();
			})
		);
		this._pcaDisposables.set(clientId, disposable);
		// Fire for the initial state and only if accounts exist
		if (pca.accounts.length > 0) {
			this._onDidAccountsChangeEmitter.fire({ added: pca.accounts, changed: [], deleted: [] });
		}
		return pca;
	}

	getAll(): ICachedPublicClientApplication[] {
		return Array.from(this._pcas.values());
	}

	private async _handleSecretStorageChange() {
		this._logger.debug(`[_handleSecretStorageChange] Handling PCAs secret storage change...`);
		let result: string[] | undefined;
		try {
			result = await this._pcasSecretStorage.get();
		} catch (_e) {
			// The data in secret storage has been corrupted somehow so
			// we store what we have in this window
			await this._storePublicClientApplications();
			return;
		}
		if (!result) {
			this._logger.debug(`[_handleSecretStorageChange] PCAs deleted in secret storage. Disposing all...`);
			Disposable.from(...this._pcaDisposables.values()).dispose();
			this._pcas.clear();
			this._pcaDisposables.clear();
			this._logger.debug(`[_handleSecretStorageChange] Finished PCAs secret storage change.`);
			return;
		}

		const pcaKeysFromStorage = new Set(result);
		// Handle the deleted ones
		for (const pcaKey of this._pcas.keys()) {
			if (!pcaKeysFromStorage.delete(pcaKey)) {
				this._logger.debug(`[_handleSecretStorageChange] PCA was deleted in another window: ${pcaKey}`);
			}
		}

		// Handle the new ones
		for (const clientId of pcaKeysFromStorage) {
			try {
				this._logger.debug(`[_handleSecretStorageChange] [${clientId}] Creating new PCA that was created in another window...`);
				await this._doCreatePublicClientApplication(clientId);
				this._logger.debug(`[_handleSecretStorageChange] [${clientId}] PCA created.`);
			} catch (_e) {
				// This really shouldn't happen, but should we do something about this?
				this._logger.error(`Failed to create new PublicClientApplication: ${clientId}`);
				continue;
			}
		}

		this._logger.debug('[_handleSecretStorageChange] Finished handling PCAs secret storage change.');
	}

	private _storePublicClientApplications() {
		return this._pcasSecretStorage.store(Array.from(this._pcas.keys()));
	}
}

interface IPublicClientApplicationSecretStorage {
	get(): Promise<string[] | undefined>;
	getOldValue(): Promise<{ clientId: string; authority: string }[] | undefined>;
	store(value: string[]): Thenable<void>;
	delete(): Thenable<void>;
	onDidChange: Event<void>;
}

class PublicClientApplicationsSecretStorage implements IPublicClientApplicationSecretStorage, Disposable {
	private _disposable: Disposable;

	private readonly _onDidChangeEmitter = new EventEmitter<void>;
	readonly onDidChange: Event<void> = this._onDidChangeEmitter.event;

	private readonly _oldKey: string;
	private readonly _key: string;

	private constructor(
		private readonly _secretStorage: SecretStorage,
		private readonly _cloudName: string
	) {
		this._oldKey = `publicClientApplications-${this._cloudName}`;
		this._key = `publicClients-${this._cloudName}`;

		this._disposable = Disposable.from(
			this._onDidChangeEmitter,
			this._secretStorage.onDidChange(e => {
				if (e.key === this._key) {
					this._onDidChangeEmitter.fire();
				}
			})
		);
	}

	static async create(secretStorage: SecretStorage, cloudName: string): Promise<PublicClientApplicationsSecretStorage> {
		const storage = new PublicClientApplicationsSecretStorage(secretStorage, cloudName);
		await storage.initialize();
		return storage;
	}

	/**
	 * Runs the migration.
	 * TODO: Remove this after a version.
	 */
	private async initialize() {
		const oldValue = await this.getOldValue();
		if (!oldValue) {
			return;
		}
		const newValue = await this.get() ?? [];
		for (const { clientId } of oldValue) {
			if (!newValue.includes(clientId)) {
				newValue.push(clientId);
			}
		}
		await this.store(newValue);
	}

	async get(): Promise<string[] | undefined> {
		const value = await this._secretStorage.get(this._key);
		if (!value) {
			return undefined;
		}
		return JSON.parse(value);
	}

	/**
	 * Old representation of data that included the authority. This should be removed in a version or 2.
	 * @returns An array of objects with clientId and authority
	 */
	async getOldValue(): Promise<{ clientId: string; authority: string }[] | undefined> {
		const value = await this._secretStorage.get(this._oldKey);
		if (!value) {
			return undefined;
		}
		const result: { clientId: string; authority: string }[] = [];
		for (const stringifiedObj of JSON.parse(value)) {
			const obj = JSON.parse(stringifiedObj);
			if (obj.clientId && obj.authority) {
				result.push(obj);
			}
		}
		return result;
	}

	store(value: string[]): Thenable<void> {
		return this._secretStorage.store(this._key, JSON.stringify(value));
	}

	delete(): Thenable<void> {
		return this._secretStorage.delete(this._key);
	}

	dispose() {
		this._disposable.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/node/test/flows.test.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/node/test/flows.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { getMsalFlows, ExtensionHost, IMsalFlowQuery } from '../flows';

suite('getMsalFlows', () => {
	test('should return all flows for local extension host with supported client and no broker', () => {
		const query: IMsalFlowQuery = {
			extensionHost: ExtensionHost.Local,
			supportedClient: true,
			isBrokerSupported: false
		};
		const flows = getMsalFlows(query);
		assert.strictEqual(flows.length, 3);
		assert.strictEqual(flows[0].label, 'default');
		assert.strictEqual(flows[1].label, 'protocol handler');
		assert.strictEqual(flows[2].label, 'device code');
	});

	test('should return only default flow for local extension host with supported client and broker', () => {
		const query: IMsalFlowQuery = {
			extensionHost: ExtensionHost.Local,
			supportedClient: true,
			isBrokerSupported: true
		};
		const flows = getMsalFlows(query);
		assert.strictEqual(flows.length, 1);
		assert.strictEqual(flows[0].label, 'default');
	});

	test('should return protocol handler and device code flows for remote extension host with supported client and no broker', () => {
		const query: IMsalFlowQuery = {
			extensionHost: ExtensionHost.Remote,
			supportedClient: true,
			isBrokerSupported: false
		};
		const flows = getMsalFlows(query);
		assert.strictEqual(flows.length, 2);
		assert.strictEqual(flows[0].label, 'protocol handler');
		assert.strictEqual(flows[1].label, 'device code');
	});

	test('should return only default and device code flows for local extension host with unsupported client and no broker', () => {
		const query: IMsalFlowQuery = {
			extensionHost: ExtensionHost.Local,
			supportedClient: false,
			isBrokerSupported: false
		};
		const flows = getMsalFlows(query);
		assert.strictEqual(flows.length, 2);
		assert.strictEqual(flows[0].label, 'default');
		assert.strictEqual(flows[1].label, 'device code');
	});

	test('should return only device code flow for remote extension host with unsupported client and no broker', () => {
		const query: IMsalFlowQuery = {
			extensionHost: ExtensionHost.Remote,
			supportedClient: false,
			isBrokerSupported: false
		};
		const flows = getMsalFlows(query);
		assert.strictEqual(flows.length, 1);
		assert.strictEqual(flows[0].label, 'device code');
	});

	test('should return default flow for local extension host with unsupported client and broker', () => {
		const query: IMsalFlowQuery = {
			extensionHost: ExtensionHost.Local,
			supportedClient: false,
			isBrokerSupported: true
		};
		const flows = getMsalFlows(query);
		assert.strictEqual(flows.length, 1);
		assert.strictEqual(flows[0].label, 'default');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/notebook-renderers/.gitignore]---
Location: vscode-main/extensions/notebook-renderers/.gitignore

```text
renderer-out
```

--------------------------------------------------------------------------------

---[FILE: extensions/notebook-renderers/.npmrc]---
Location: vscode-main/extensions/notebook-renderers/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/notebook-renderers/.vscodeignore]---
Location: vscode-main/extensions/notebook-renderers/.vscodeignore

```text
src/**
notebook/**
tsconfig.json
.gitignore
esbuild.*
src/**
```

--------------------------------------------------------------------------------

---[FILE: extensions/notebook-renderers/esbuild.mjs]---
Location: vscode-main/extensions/notebook-renderers/esbuild.mjs

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import path from 'path';
import { run } from '../esbuild-webview-common.mjs';

const srcDir = path.join(import.meta.dirname, 'src');
const outDir = path.join(import.meta.dirname, 'renderer-out');

run({
	entryPoints: [
		path.join(srcDir, 'index.ts'),
	],
	srcDir,
	outdir: outDir,
}, process.argv);
```

--------------------------------------------------------------------------------

---[FILE: extensions/notebook-renderers/package-lock.json]---
Location: vscode-main/extensions/notebook-renderers/package-lock.json

```json
{
	"name": "builtin-notebook-renderers",
	"version": "1.0.0",
	"lockfileVersion": 3,
	"requires": true,
	"packages": {
		"": {
			"name": "builtin-notebook-renderers",
			"version": "1.0.0",
			"license": "MIT",
			"devDependencies": {
				"@types/jsdom": "^21.1.0",
				"@types/node": "^22.18.10",
				"@types/vscode-notebook-renderer": "^1.60.0",
				"jsdom": "^21.1.1"
			},
			"engines": {
				"vscode": "^1.57.0"
			}
		},
		"node_modules/@tootallnate/once": {
			"version": "2.0.0",
			"resolved": "https://registry.npmjs.org/@tootallnate/once/-/once-2.0.0.tgz",
			"integrity": "sha512-XCuKFP5PS55gnMVu3dty8KPatLqUoy/ZYzDzAGCQ8JNFCkLXzmI7vNHCR+XpbZaMWQK/vQubr7PkYq8g470J/A==",
			"dev": true,
			"engines": {
				"node": ">= 10"
			}
		},
		"node_modules/@types/jsdom": {
			"version": "21.1.0",
			"resolved": "https://registry.npmjs.org/@types/jsdom/-/jsdom-21.1.0.tgz",
			"integrity": "sha512-leWreJOdnuIxq9Y70tBVm/bvTuh31DSlF/r4l7Cfi4uhVQqLHD0Q4v301GMisEMwwbMgF7ZKxuZ+Jbd4NcdmRw==",
			"dev": true,
			"dependencies": {
				"@types/node": "*",
				"@types/tough-cookie": "*",
				"parse5": "^7.0.0"
			}
		},
		"node_modules/@types/node": {
			"version": "22.18.10",
			"resolved": "https://registry.npmjs.org/@types/node/-/node-22.18.10.tgz",
			"integrity": "sha512-anNG/V/Efn/YZY4pRzbACnKxNKoBng2VTFydVu8RRs5hQjikP8CQfaeAV59VFSCzKNp90mXiVXW2QzV56rwMrg==",
			"dev": true,
			"license": "MIT",
			"dependencies": {
				"undici-types": "~6.21.0"
			}
		},
		"node_modules/@types/tough-cookie": {
			"version": "4.0.2",
			"resolved": "https://registry.npmjs.org/@types/tough-cookie/-/tough-cookie-4.0.2.tgz",
			"integrity": "sha512-Q5vtl1W5ue16D+nIaW8JWebSSraJVlK+EthKn7e7UcD4KWsaSJ8BqGPXNaPghgtcn/fhvrN17Tv8ksUsQpiplw==",
			"dev": true
		},
		"node_modules/@types/vscode-notebook-renderer": {
			"version": "1.60.0",
			"resolved": "https://registry.npmjs.org/@types/vscode-notebook-renderer/-/vscode-notebook-renderer-1.60.0.tgz",
			"integrity": "sha512-u7TD2uuEZTVuitx0iijOJdKI0JLiQP6PsSBSRy2XmHXUOXcp5p1S56NrjOEDoF+PIHd3NL3eO6KTRSf5nukDqQ==",
			"dev": true
		},
		"node_modules/abab": {
			"version": "2.0.6",
			"resolved": "https://registry.npmjs.org/abab/-/abab-2.0.6.tgz",
			"integrity": "sha512-j2afSsaIENvHZN2B8GOpF566vZ5WVk5opAiMTvWgaQT8DkbOqsTfvNAvHoRGU2zzP8cPoqys+xHTRDWW8L+/BA==",
			"deprecated": "Use your platform's native atob() and btoa() methods instead",
			"dev": true
		},
		"node_modules/acorn": {
			"version": "8.8.2",
			"resolved": "https://registry.npmjs.org/acorn/-/acorn-8.8.2.tgz",
			"integrity": "sha512-xjIYgE8HBrkpd/sJqOGNspf8uHG+NOHGOw6a/Urj8taM2EXfdNAH2oFcPeIFfsv3+kz/mJrS5VuMqbNLjCa2vw==",
			"dev": true,
			"bin": {
				"acorn": "bin/acorn"
			},
			"engines": {
				"node": ">=0.4.0"
			}
		},
		"node_modules/acorn-globals": {
			"version": "7.0.1",
			"resolved": "https://registry.npmjs.org/acorn-globals/-/acorn-globals-7.0.1.tgz",
			"integrity": "sha512-umOSDSDrfHbTNPuNpC2NSnnA3LUrqpevPb4T9jRx4MagXNS0rs+gwiTcAvqCRmsD6utzsrzNt+ebm00SNWiC3Q==",
			"dev": true,
			"dependencies": {
				"acorn": "^8.1.0",
				"acorn-walk": "^8.0.2"
			}
		},
		"node_modules/acorn-walk": {
			"version": "8.2.0",
			"resolved": "https://registry.npmjs.org/acorn-walk/-/acorn-walk-8.2.0.tgz",
			"integrity": "sha512-k+iyHEuPgSw6SbuDpGQM+06HQUa04DZ3o+F6CSzXMvvI5KMvnaEqXe+YVe555R9nn6GPt404fos4wcgpw12SDA==",
			"dev": true,
			"engines": {
				"node": ">=0.4.0"
			}
		},
		"node_modules/agent-base": {
			"version": "6.0.2",
			"resolved": "https://registry.npmjs.org/agent-base/-/agent-base-6.0.2.tgz",
			"integrity": "sha512-RZNwNclF7+MS/8bDg70amg32dyeZGZxiDuQmZxKLAlQjr3jGyLx+4Kkk58UO7D2QdgFIQCovuSuZESne6RG6XQ==",
			"dev": true,
			"dependencies": {
				"debug": "4"
			},
			"engines": {
				"node": ">= 6.0.0"
			}
		},
		"node_modules/asynckit": {
			"version": "0.4.0",
			"resolved": "https://registry.npmjs.org/asynckit/-/asynckit-0.4.0.tgz",
			"integrity": "sha512-Oei9OH4tRh0YqU3GxhX79dM/mwVgvbZJaSNaRk+bshkj0S5cfHcgYakreBjrHwatXKbz+IoIdYLxrKim2MjW0Q==",
			"dev": true
		},
		"node_modules/call-bind-apply-helpers": {
			"version": "1.0.2",
			"resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.2.tgz",
			"integrity": "sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==",
			"dev": true,
			"license": "MIT",
			"dependencies": {
				"es-errors": "^1.3.0",
				"function-bind": "^1.1.2"
			},
			"engines": {
				"node": ">= 0.4"
			}
		},
		"node_modules/combined-stream": {
			"version": "1.0.8",
			"resolved": "https://registry.npmjs.org/combined-stream/-/combined-stream-1.0.8.tgz",
			"integrity": "sha512-FQN4MRfuJeHf7cBbBMJFXhKSDq+2kAArBlmRBvcvFE5BB1HZKXtSFASDhdlz9zOYwxh8lDdnvmMOe/+5cdoEdg==",
			"dev": true,
			"dependencies": {
				"delayed-stream": "~1.0.0"
			},
			"engines": {
				"node": ">= 0.8"
			}
		},
		"node_modules/cssstyle": {
			"version": "3.0.0",
			"resolved": "https://registry.npmjs.org/cssstyle/-/cssstyle-3.0.0.tgz",
			"integrity": "sha512-N4u2ABATi3Qplzf0hWbVCdjenim8F3ojEXpBDF5hBpjzW182MjNGLqfmQ0SkSPeQ+V86ZXgeH8aXj6kayd4jgg==",
			"dev": true,
			"dependencies": {
				"rrweb-cssom": "^0.6.0"
			},
			"engines": {
				"node": ">=14"
			}
		},
		"node_modules/data-urls": {
			"version": "4.0.0",
			"resolved": "https://registry.npmjs.org/data-urls/-/data-urls-4.0.0.tgz",
			"integrity": "sha512-/mMTei/JXPqvFqQtfyTowxmJVwr2PVAeCcDxyFf6LhoOu/09TX2OX3kb2wzi4DMXcfj4OItwDOnhl5oziPnT6g==",
			"dev": true,
			"dependencies": {
				"abab": "^2.0.6",
				"whatwg-mimetype": "^3.0.0",
				"whatwg-url": "^12.0.0"
			},
			"engines": {
				"node": ">=14"
			}
		},
		"node_modules/debug": {
			"version": "4.3.4",
			"resolved": "https://registry.npmjs.org/debug/-/debug-4.3.4.tgz",
			"integrity": "sha512-PRWFHuSU3eDtQJPvnNY7Jcket1j0t5OuOsFzPPzsekD52Zl8qUfFIPEiswXqIvHWGVHOgX+7G/vCNNhehwxfkQ==",
			"dev": true,
			"dependencies": {
				"ms": "2.1.2"
			},
			"engines": {
				"node": ">=6.0"
			},
			"peerDependenciesMeta": {
				"supports-color": {
					"optional": true
				}
			}
		},
		"node_modules/decimal.js": {
			"version": "10.4.3",
			"resolved": "https://registry.npmjs.org/decimal.js/-/decimal.js-10.4.3.tgz",
			"integrity": "sha512-VBBaLc1MgL5XpzgIP7ny5Z6Nx3UrRkIViUkPUdtl9aya5amy3De1gsUUSB1g3+3sExYNjCAsAznmukyxCb1GRA==",
			"dev": true
		},
		"node_modules/deep-is": {
			"version": "0.1.4",
			"resolved": "https://registry.npmjs.org/deep-is/-/deep-is-0.1.4.tgz",
			"integrity": "sha512-oIPzksmTg4/MriiaYGO+okXDT7ztn/w3Eptv/+gSIdMdKsJo0u4CfYNFJPy+4SKMuCqGw2wxnA+URMg3t8a/bQ==",
			"dev": true
		},
		"node_modules/delayed-stream": {
			"version": "1.0.0",
			"resolved": "https://registry.npmjs.org/delayed-stream/-/delayed-stream-1.0.0.tgz",
			"integrity": "sha512-ZySD7Nf91aLB0RxL4KGrKHBXl7Eds1DAmEdcoVawXnLD7SDhpNgtuII2aAkg7a7QS41jxPSZ17p4VdGnMHk3MQ==",
			"dev": true,
			"engines": {
				"node": ">=0.4.0"
			}
		},
		"node_modules/domexception": {
			"version": "4.0.0",
			"resolved": "https://registry.npmjs.org/domexception/-/domexception-4.0.0.tgz",
			"integrity": "sha512-A2is4PLG+eeSfoTMA95/s4pvAoSo2mKtiM5jlHkAVewmiO8ISFTFKZjH7UAM1Atli/OT/7JHOrJRJiMKUZKYBw==",
			"deprecated": "Use your platform's native DOMException instead",
			"dev": true,
			"dependencies": {
				"webidl-conversions": "^7.0.0"
			},
			"engines": {
				"node": ">=12"
			}
		},
		"node_modules/dunder-proto": {
			"version": "1.0.1",
			"resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",
			"integrity": "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==",
			"dev": true,
			"license": "MIT",
			"dependencies": {
				"call-bind-apply-helpers": "^1.0.1",
				"es-errors": "^1.3.0",
				"gopd": "^1.2.0"
			},
			"engines": {
				"node": ">= 0.4"
			}
		},
		"node_modules/entities": {
			"version": "4.4.0",
			"resolved": "https://registry.npmjs.org/entities/-/entities-4.4.0.tgz",
			"integrity": "sha512-oYp7156SP8LkeGD0GF85ad1X9Ai79WtRsZ2gxJqtBuzH+98YUV6jkHEKlZkMbcrjJjIVJNIDP/3WL9wQkoPbWA==",
			"dev": true,
			"engines": {
				"node": ">=0.12"
			},
			"funding": {
				"url": "https://github.com/fb55/entities?sponsor=1"
			}
		},
		"node_modules/es-define-property": {
			"version": "1.0.1",
			"resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",
			"integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",
			"dev": true,
			"license": "MIT",
			"engines": {
				"node": ">= 0.4"
			}
		},
		"node_modules/es-errors": {
			"version": "1.3.0",
			"resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
			"integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
			"dev": true,
			"license": "MIT",
			"engines": {
				"node": ">= 0.4"
			}
		},
		"node_modules/es-object-atoms": {
			"version": "1.1.1",
			"resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.1.tgz",
			"integrity": "sha512-FGgH2h8zKNim9ljj7dankFPcICIK9Cp5bm+c2gQSYePhpaG5+esrLODihIorn+Pe6FGJzWhXQotPv73jTaldXA==",
			"dev": true,
			"license": "MIT",
			"dependencies": {
				"es-errors": "^1.3.0"
			},
			"engines": {
				"node": ">= 0.4"
			}
		},
		"node_modules/es-set-tostringtag": {
			"version": "2.1.0",
			"resolved": "https://registry.npmjs.org/es-set-tostringtag/-/es-set-tostringtag-2.1.0.tgz",
			"integrity": "sha512-j6vWzfrGVfyXxge+O0x5sh6cvxAog0a/4Rdd2K36zCMV5eJ+/+tOAngRO8cODMNWbVRdVlmGZQL2YS3yR8bIUA==",
			"dev": true,
			"license": "MIT",
			"dependencies": {
				"es-errors": "^1.3.0",
				"get-intrinsic": "^1.2.6",
				"has-tostringtag": "^1.0.2",
				"hasown": "^2.0.2"
			},
			"engines": {
				"node": ">= 0.4"
			}
		},
		"node_modules/escodegen": {
			"version": "2.0.0",
			"resolved": "https://registry.npmjs.org/escodegen/-/escodegen-2.0.0.tgz",
			"integrity": "sha512-mmHKys/C8BFUGI+MAWNcSYoORYLMdPzjrknd2Vc+bUsjN5bXcr8EhrNB+UTqfL1y3I9c4fw2ihgtMPQLBRiQxw==",
			"dev": true,
			"dependencies": {
				"esprima": "^4.0.1",
				"estraverse": "^5.2.0",
				"esutils": "^2.0.2",
				"optionator": "^0.8.1"
			},
			"bin": {
				"escodegen": "bin/escodegen.js",
				"esgenerate": "bin/esgenerate.js"
			},
			"engines": {
				"node": ">=6.0"
			},
			"optionalDependencies": {
				"source-map": "~0.6.1"
			}
		},
		"node_modules/esprima": {
			"version": "4.0.1",
			"resolved": "https://registry.npmjs.org/esprima/-/esprima-4.0.1.tgz",
			"integrity": "sha512-eGuFFw7Upda+g4p+QHvnW0RyTX/SVeJBDM/gCtMARO0cLuT2HcEKnTPvhjV6aGeqrCB/sbNop0Kszm0jsaWU4A==",
			"dev": true,
			"bin": {
				"esparse": "bin/esparse.js",
				"esvalidate": "bin/esvalidate.js"
			},
			"engines": {
				"node": ">=4"
			}
		},
		"node_modules/estraverse": {
			"version": "5.3.0",
			"resolved": "https://registry.npmjs.org/estraverse/-/estraverse-5.3.0.tgz",
			"integrity": "sha512-MMdARuVEQziNTeJD8DgMqmhwR11BRQ/cBP+pLtYdSTnf3MIO8fFeiINEbX36ZdNlfU/7A9f3gUw49B3oQsvwBA==",
			"dev": true,
			"engines": {
				"node": ">=4.0"
			}
		},
		"node_modules/esutils": {
			"version": "2.0.3",
			"resolved": "https://registry.npmjs.org/esutils/-/esutils-2.0.3.tgz",
			"integrity": "sha512-kVscqXk4OCp68SZ0dkgEKVi6/8ij300KBWTJq32P/dYeWTSwK41WyTxalN1eRmA5Z9UU/LX9D7FWSmV9SAYx6g==",
			"dev": true,
			"engines": {
				"node": ">=0.10.0"
			}
		},
		"node_modules/fast-levenshtein": {
			"version": "2.0.6",
			"resolved": "https://registry.npmjs.org/fast-levenshtein/-/fast-levenshtein-2.0.6.tgz",
			"integrity": "sha512-DCXu6Ifhqcks7TZKY3Hxp3y6qphY5SJZmrWMDrKcERSOXWQdMhU9Ig/PYrzyw/ul9jOIyh0N4M0tbC5hodg8dw==",
			"dev": true
		},
		"node_modules/form-data": {
			"version": "4.0.5",
			"resolved": "https://registry.npmjs.org/form-data/-/form-data-4.0.5.tgz",
			"integrity": "sha512-8RipRLol37bNs2bhoV67fiTEvdTrbMUYcFTiy3+wuuOnUog2QBHCZWXDRijWQfAkhBj2Uf5UnVaiWwA5vdd82w==",
			"dev": true,
			"license": "MIT",
			"dependencies": {
				"asynckit": "^0.4.0",
				"combined-stream": "^1.0.8",
				"es-set-tostringtag": "^2.1.0",
				"hasown": "^2.0.2",
				"mime-types": "^2.1.12"
			},
			"engines": {
				"node": ">= 6"
			}
		},
		"node_modules/function-bind": {
			"version": "1.1.2",
			"resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
			"integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
			"dev": true,
			"license": "MIT",
			"funding": {
				"url": "https://github.com/sponsors/ljharb"
			}
		},
		"node_modules/get-intrinsic": {
			"version": "1.3.0",
			"resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.3.0.tgz",
			"integrity": "sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==",
			"dev": true,
			"license": "MIT",
			"dependencies": {
				"call-bind-apply-helpers": "^1.0.2",
				"es-define-property": "^1.0.1",
				"es-errors": "^1.3.0",
				"es-object-atoms": "^1.1.1",
				"function-bind": "^1.1.2",
				"get-proto": "^1.0.1",
				"gopd": "^1.2.0",
				"has-symbols": "^1.1.0",
				"hasown": "^2.0.2",
				"math-intrinsics": "^1.1.0"
			},
			"engines": {
				"node": ">= 0.4"
			},
			"funding": {
				"url": "https://github.com/sponsors/ljharb"
			}
		},
		"node_modules/get-proto": {
			"version": "1.0.1",
			"resolved": "https://registry.npmjs.org/get-proto/-/get-proto-1.0.1.tgz",
			"integrity": "sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==",
			"dev": true,
			"license": "MIT",
			"dependencies": {
				"dunder-proto": "^1.0.1",
				"es-object-atoms": "^1.0.0"
			},
			"engines": {
				"node": ">= 0.4"
			}
		},
		"node_modules/gopd": {
			"version": "1.2.0",
			"resolved": "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz",
			"integrity": "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==",
			"dev": true,
			"license": "MIT",
			"engines": {
				"node": ">= 0.4"
			},
			"funding": {
				"url": "https://github.com/sponsors/ljharb"
			}
		},
		"node_modules/has-symbols": {
			"version": "1.1.0",
			"resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.1.0.tgz",
			"integrity": "sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==",
			"dev": true,
			"license": "MIT",
			"engines": {
				"node": ">= 0.4"
			},
			"funding": {
				"url": "https://github.com/sponsors/ljharb"
			}
		},
		"node_modules/has-tostringtag": {
			"version": "1.0.2",
			"resolved": "https://registry.npmjs.org/has-tostringtag/-/has-tostringtag-1.0.2.tgz",
			"integrity": "sha512-NqADB8VjPFLM2V0VvHUewwwsw0ZWBaIdgo+ieHtK3hasLz4qeCRjYcqfB6AQrBggRKppKF8L52/VqdVsO47Dlw==",
			"dev": true,
			"license": "MIT",
			"dependencies": {
				"has-symbols": "^1.0.3"
			},
			"engines": {
				"node": ">= 0.4"
			},
			"funding": {
				"url": "https://github.com/sponsors/ljharb"
			}
		},
		"node_modules/hasown": {
			"version": "2.0.2",
			"resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.2.tgz",
			"integrity": "sha512-0hJU9SCPvmMzIBdZFqNPXWa6dqh7WdH0cII9y+CyS8rG3nL48Bclra9HmKhVVUHyPWNH5Y7xDwAB7bfgSjkUMQ==",
			"dev": true,
			"license": "MIT",
			"dependencies": {
				"function-bind": "^1.1.2"
			},
			"engines": {
				"node": ">= 0.4"
			}
		},
		"node_modules/html-encoding-sniffer": {
			"version": "3.0.0",
			"resolved": "https://registry.npmjs.org/html-encoding-sniffer/-/html-encoding-sniffer-3.0.0.tgz",
			"integrity": "sha512-oWv4T4yJ52iKrufjnyZPkrN0CH3QnrUqdB6In1g5Fe1mia8GmF36gnfNySxoZtxD5+NmYw1EElVXiBk93UeskA==",
			"dev": true,
			"dependencies": {
				"whatwg-encoding": "^2.0.0"
			},
			"engines": {
				"node": ">=12"
			}
		},
		"node_modules/http-proxy-agent": {
			"version": "5.0.0",
			"resolved": "https://registry.npmjs.org/http-proxy-agent/-/http-proxy-agent-5.0.0.tgz",
			"integrity": "sha512-n2hY8YdoRE1i7r6M0w9DIw5GgZN0G25P8zLCRQ8rjXtTU3vsNFBI/vWK/UIeE6g5MUUz6avwAPXmL6Fy9D/90w==",
			"dev": true,
			"dependencies": {
				"@tootallnate/once": "2",
				"agent-base": "6",
				"debug": "4"
			},
			"engines": {
				"node": ">= 6"
			}
		},
		"node_modules/https-proxy-agent": {
			"version": "5.0.1",
			"resolved": "https://registry.npmjs.org/https-proxy-agent/-/https-proxy-agent-5.0.1.tgz",
			"integrity": "sha512-dFcAjpTQFgoLMzC2VwU+C/CbS7uRL0lWmxDITmqm7C+7F0Odmj6s9l6alZc6AELXhrnggM2CeWSXHGOdX2YtwA==",
			"dev": true,
			"dependencies": {
				"agent-base": "6",
				"debug": "4"
			},
			"engines": {
				"node": ">= 6"
			}
		},
		"node_modules/iconv-lite": {
			"version": "0.6.3",
			"resolved": "https://registry.npmjs.org/iconv-lite/-/iconv-lite-0.6.3.tgz",
			"integrity": "sha512-4fCk79wshMdzMp2rH06qWrJE4iolqLhCUH+OiuIgU++RB0+94NlDL81atO7GX55uUKueo0txHNtvEyI6D7WdMw==",
			"dev": true,
			"dependencies": {
				"safer-buffer": ">= 2.1.2 < 3.0.0"
			},
			"engines": {
				"node": ">=0.10.0"
			}
		},
		"node_modules/is-potential-custom-element-name": {
			"version": "1.0.1",
			"resolved": "https://registry.npmjs.org/is-potential-custom-element-name/-/is-potential-custom-element-name-1.0.1.tgz",
			"integrity": "sha512-bCYeRA2rVibKZd+s2625gGnGF/t7DSqDs4dP7CrLA1m7jKWz6pps0LpYLJN8Q64HtmPKJ1hrN3nzPNKFEKOUiQ==",
			"dev": true
		},
		"node_modules/jsdom": {
			"version": "21.1.1",
			"resolved": "https://registry.npmjs.org/jsdom/-/jsdom-21.1.1.tgz",
			"integrity": "sha512-Jjgdmw48RKcdAIQyUD1UdBh2ecH7VqwaXPN3ehoZN6MqgVbMn+lRm1aAT1AsdJRAJpwfa4IpwgzySn61h2qu3w==",
			"dev": true,
			"dependencies": {
				"abab": "^2.0.6",
				"acorn": "^8.8.2",
				"acorn-globals": "^7.0.0",
				"cssstyle": "^3.0.0",
				"data-urls": "^4.0.0",
				"decimal.js": "^10.4.3",
				"domexception": "^4.0.0",
				"escodegen": "^2.0.0",
				"form-data": "^4.0.0",
				"html-encoding-sniffer": "^3.0.0",
				"http-proxy-agent": "^5.0.0",
				"https-proxy-agent": "^5.0.1",
				"is-potential-custom-element-name": "^1.0.1",
				"nwsapi": "^2.2.2",
				"parse5": "^7.1.2",
				"rrweb-cssom": "^0.6.0",
				"saxes": "^6.0.0",
				"symbol-tree": "^3.2.4",
				"tough-cookie": "^4.1.2",
				"w3c-xmlserializer": "^4.0.0",
				"webidl-conversions": "^7.0.0",
				"whatwg-encoding": "^2.0.0",
				"whatwg-mimetype": "^3.0.0",
				"whatwg-url": "^12.0.1",
				"ws": "^8.13.0",
				"xml-name-validator": "^4.0.0"
			},
			"engines": {
				"node": ">=14"
			},
			"peerDependencies": {
				"canvas": "^2.5.0"
			},
			"peerDependenciesMeta": {
				"canvas": {
					"optional": true
				}
			}
		},
		"node_modules/levn": {
			"version": "0.3.0",
			"resolved": "https://registry.npmjs.org/levn/-/levn-0.3.0.tgz",
			"integrity": "sha512-0OO4y2iOHix2W6ujICbKIaEQXvFQHue65vUG3pb5EUomzPI90z9hsA1VsO/dbIIpC53J8gxM9Q4Oho0jrCM/yA==",
			"dev": true,
			"dependencies": {
				"prelude-ls": "~1.1.2",
				"type-check": "~0.3.2"
			},
			"engines": {
				"node": ">= 0.8.0"
			}
		},
		"node_modules/math-intrinsics": {
			"version": "1.1.0",
			"resolved": "https://registry.npmjs.org/math-intrinsics/-/math-intrinsics-1.1.0.tgz",
			"integrity": "sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==",
			"dev": true,
			"license": "MIT",
			"engines": {
				"node": ">= 0.4"
			}
		},
		"node_modules/mime-db": {
			"version": "1.52.0",
			"resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz",
			"integrity": "sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==",
			"dev": true,
			"engines": {
				"node": ">= 0.6"
			}
		},
		"node_modules/mime-types": {
			"version": "2.1.35",
			"resolved": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.35.tgz",
			"integrity": "sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==",
			"dev": true,
			"dependencies": {
				"mime-db": "1.52.0"
			},
			"engines": {
				"node": ">= 0.6"
			}
		},
		"node_modules/ms": {
			"version": "2.1.2",
			"resolved": "https://registry.npmjs.org/ms/-/ms-2.1.2.tgz",
			"integrity": "sha512-sGkPx+VjMtmA6MX27oA4FBFELFCZZ4S4XqeGOXCv68tT+jb3vk/RyaKWP0PTKyWtmLSM0b+adUTEvbs1PEaH2w==",
			"dev": true
		},
		"node_modules/nwsapi": {
			"version": "2.2.2",
			"resolved": "https://registry.npmjs.org/nwsapi/-/nwsapi-2.2.2.tgz",
			"integrity": "sha512-90yv+6538zuvUMnN+zCr8LuV6bPFdq50304114vJYJ8RDyK8D5O9Phpbd6SZWgI7PwzmmfN1upeOJlvybDSgCw==",
			"dev": true
		},
		"node_modules/optionator": {
			"version": "0.8.3",
			"resolved": "https://registry.npmjs.org/optionator/-/optionator-0.8.3.tgz",
			"integrity": "sha512-+IW9pACdk3XWmmTXG8m3upGUJst5XRGzxMRjXzAuJ1XnIFNvfhjjIuYkDvysnPQ7qzqVzLt78BCruntqRhWQbA==",
			"dev": true,
			"dependencies": {
				"deep-is": "~0.1.3",
				"fast-levenshtein": "~2.0.6",
				"levn": "~0.3.0",
				"prelude-ls": "~1.1.2",
				"type-check": "~0.3.2",
				"word-wrap": "~1.2.3"
			},
			"engines": {
				"node": ">= 0.8.0"
			}
		},
		"node_modules/parse5": {
			"version": "7.1.2",
			"resolved": "https://registry.npmjs.org/parse5/-/parse5-7.1.2.tgz",
			"integrity": "sha512-Czj1WaSVpaoj0wbhMzLmWD69anp2WH7FXMB9n1Sy8/ZFF9jolSQVMu1Ij5WIyGmcBmhk7EOndpO4mIpihVqAXw==",
			"dev": true,
			"dependencies": {
				"entities": "^4.4.0"
			},
			"funding": {
				"url": "https://github.com/inikulin/parse5?sponsor=1"
			}
		},
		"node_modules/prelude-ls": {
			"version": "1.1.2",
			"resolved": "https://registry.npmjs.org/prelude-ls/-/prelude-ls-1.1.2.tgz",
			"integrity": "sha512-ESF23V4SKG6lVSGZgYNpbsiaAkdab6ZgOxe52p7+Kid3W3u3bxR4Vfd/o21dmN7jSt0IwgZ4v5MUd26FEtXE9w==",
			"dev": true,
			"engines": {
				"node": ">= 0.8.0"
			}
		},
		"node_modules/psl": {
			"version": "1.9.0",
			"resolved": "https://registry.npmjs.org/psl/-/psl-1.9.0.tgz",
			"integrity": "sha512-E/ZsdU4HLs/68gYzgGTkMicWTLPdAftJLfJFlLUAAKZGkStNU72sZjT66SnMDVOfOWY/YAoiD7Jxa9iHvngcag==",
			"dev": true
		},
		"node_modules/punycode": {
			"version": "2.3.0",
			"resolved": "https://registry.npmjs.org/punycode/-/punycode-2.3.0.tgz",
			"integrity": "sha512-rRV+zQD8tVFys26lAGR9WUuS4iUAngJScM+ZRSKtvl5tKeZ2t5bvdNFdNHBW9FWR4guGHlgmsZ1G7BSm2wTbuA==",
			"dev": true,
			"engines": {
				"node": ">=6"
			}
		},
		"node_modules/querystringify": {
			"version": "2.2.0",
			"resolved": "https://registry.npmjs.org/querystringify/-/querystringify-2.2.0.tgz",
			"integrity": "sha512-FIqgj2EUvTa7R50u0rGsyTftzjYmv/a3hO345bZNrqabNqjtgiDMgmo4mkUjd+nzU5oF3dClKqFIPUKybUyqoQ==",
			"dev": true
		},
		"node_modules/requires-port": {
			"version": "1.0.0",
			"resolved": "https://registry.npmjs.org/requires-port/-/requires-port-1.0.0.tgz",
			"integrity": "sha512-KigOCHcocU3XODJxsu8i/j8T9tzT4adHiecwORRQ0ZZFcp7ahwXuRU1m+yuO90C5ZUyGeGfocHDI14M3L3yDAQ==",
			"dev": true
		},
		"node_modules/rrweb-cssom": {
			"version": "0.6.0",
			"resolved": "https://registry.npmjs.org/rrweb-cssom/-/rrweb-cssom-0.6.0.tgz",
			"integrity": "sha512-APM0Gt1KoXBz0iIkkdB/kfvGOwC4UuJFeG/c+yV7wSc7q96cG/kJ0HiYCnzivD9SB53cLV1MlHFNfOuPaadYSw==",
			"dev": true
		},
		"node_modules/safer-buffer": {
			"version": "2.1.2",
			"resolved": "https://registry.npmjs.org/safer-buffer/-/safer-buffer-2.1.2.tgz",
			"integrity": "sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==",
			"dev": true
		},
		"node_modules/saxes": {
			"version": "6.0.0",
			"resolved": "https://registry.npmjs.org/saxes/-/saxes-6.0.0.tgz",
			"integrity": "sha512-xAg7SOnEhrm5zI3puOOKyy1OMcMlIJZYNJY7xLBwSze0UjhPLnWfj2GF2EpT0jmzaJKIWKHLsaSSajf35bcYnA==",
			"dev": true,
			"dependencies": {
				"xmlchars": "^2.2.0"
			},
			"engines": {
				"node": ">=v12.22.7"
			}
		},
		"node_modules/source-map": {
			"version": "0.6.1",
			"resolved": "https://registry.npmjs.org/source-map/-/source-map-0.6.1.tgz",
			"integrity": "sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==",
			"dev": true,
			"optional": true,
			"engines": {
				"node": ">=0.10.0"
			}
		},
		"node_modules/symbol-tree": {
			"version": "3.2.4",
			"resolved": "https://registry.npmjs.org/symbol-tree/-/symbol-tree-3.2.4.tgz",
			"integrity": "sha512-9QNk5KwDF+Bvz+PyObkmSYjI5ksVUYtjW7AU22r2NKcfLJcXp96hkDWU3+XndOsUb+AQ9QhfzfCT2O+CNWT5Tw==",
			"dev": true
		},
		"node_modules/tough-cookie": {
			"version": "4.1.3",
			"resolved": "https://registry.npmjs.org/tough-cookie/-/tough-cookie-4.1.3.tgz",
			"integrity": "sha512-aX/y5pVRkfRnfmuX+OdbSdXvPe6ieKX/G2s7e98f4poJHnqH3281gDPm/metm6E/WRamfx7WC4HUqkWHfQHprw==",
			"dev": true,
			"dependencies": {
				"psl": "^1.1.33",
				"punycode": "^2.1.1",
				"universalify": "^0.2.0",
				"url-parse": "^1.5.3"
			},
			"engines": {
				"node": ">=6"
			}
		},
		"node_modules/tr46": {
			"version": "4.1.1",
			"resolved": "https://registry.npmjs.org/tr46/-/tr46-4.1.1.tgz",
			"integrity": "sha512-2lv/66T7e5yNyhAAC4NaKe5nVavzuGJQVVtRYLyQ2OI8tsJ61PMLlelehb0wi2Hx6+hT/OJUWZcw8MjlSRnxvw==",
			"dev": true,
			"dependencies": {
				"punycode": "^2.3.0"
			},
			"engines": {
				"node": ">=14"
			}
		},
		"node_modules/type-check": {
			"version": "0.3.2",
			"resolved": "https://registry.npmjs.org/type-check/-/type-check-0.3.2.tgz",
			"integrity": "sha512-ZCmOJdvOWDBYJlzAoFkC+Q0+bUyEOS1ltgp1MGU03fqHG+dbi9tBFU2Rd9QKiDZFAYrhPh2JUf7rZRIuHRKtOg==",
			"dev": true,
			"dependencies": {
				"prelude-ls": "~1.1.2"
			},
			"engines": {
				"node": ">= 0.8.0"
			}
		},
		"node_modules/undici-types": {
			"version": "6.21.0",
			"resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.21.0.tgz",
			"integrity": "sha512-iwDZqg0QAGrg9Rav5H4n0M64c3mkR59cJ6wQp+7C4nI0gsmExaedaYLNO44eT4AtBBwjbTiGPMlt2Md0T9H9JQ==",
			"dev": true,
			"license": "MIT"
		},
		"node_modules/universalify": {
			"version": "0.2.0",
			"resolved": "https://registry.npmjs.org/universalify/-/universalify-0.2.0.tgz",
			"integrity": "sha512-CJ1QgKmNg3CwvAv/kOFmtnEN05f0D/cn9QntgNOQlQF9dgvVTHj3t+8JPdjqawCHk7V/KA+fbUqzZ9XWhcqPUg==",
			"dev": true,
			"engines": {
				"node": ">= 4.0.0"
			}
		},
		"node_modules/url-parse": {
			"version": "1.5.10",
			"resolved": "https://registry.npmjs.org/url-parse/-/url-parse-1.5.10.tgz",
			"integrity": "sha512-WypcfiRhfeUP9vvF0j6rw0J3hrWrw6iZv3+22h6iRMJ/8z1Tj6XfLP4DsUix5MhMPnXpiHDoKyoZ/bdCkwBCiQ==",
			"dev": true,
			"dependencies": {
				"querystringify": "^2.1.1",
				"requires-port": "^1.0.0"
			}
		},
		"node_modules/w3c-xmlserializer": {
			"version": "4.0.0",
			"resolved": "https://registry.npmjs.org/w3c-xmlserializer/-/w3c-xmlserializer-4.0.0.tgz",
			"integrity": "sha512-d+BFHzbiCx6zGfz0HyQ6Rg69w9k19nviJspaj4yNscGjrHu94sVP+aRm75yEbCh+r2/yR+7q6hux9LVtbuTGBw==",
			"dev": true,
			"dependencies": {
				"xml-name-validator": "^4.0.0"
			},
			"engines": {
				"node": ">=14"
			}
		},
		"node_modules/webidl-conversions": {
			"version": "7.0.0",
			"resolved": "https://registry.npmjs.org/webidl-conversions/-/webidl-conversions-7.0.0.tgz",
			"integrity": "sha512-VwddBukDzu71offAQR975unBIGqfKZpM+8ZX6ySk8nYhVoo5CYaZyzt3YBvYtRtO+aoGlqxPg/B87NGVZ/fu6g==",
			"dev": true,
			"engines": {
				"node": ">=12"
			}
		},
		"node_modules/whatwg-encoding": {
			"version": "2.0.0",
			"resolved": "https://registry.npmjs.org/whatwg-encoding/-/whatwg-encoding-2.0.0.tgz",
			"integrity": "sha512-p41ogyeMUrw3jWclHWTQg1k05DSVXPLcVxRTYsXUk+ZooOCZLcoYgPZ/HL/D/N+uQPOtcp1me1WhBEaX02mhWg==",
			"dev": true,
			"dependencies": {
				"iconv-lite": "0.6.3"
			},
			"engines": {
				"node": ">=12"
			}
		},
		"node_modules/whatwg-mimetype": {
			"version": "3.0.0",
			"resolved": "https://registry.npmjs.org/whatwg-mimetype/-/whatwg-mimetype-3.0.0.tgz",
			"integrity": "sha512-nt+N2dzIutVRxARx1nghPKGv1xHikU7HKdfafKkLNLindmPU/ch3U31NOCGGA/dmPcmb1VlofO0vnKAcsm0o/Q==",
			"dev": true,
			"engines": {
				"node": ">=12"
			}
		},
		"node_modules/whatwg-url": {
			"version": "12.0.1",
			"resolved": "https://registry.npmjs.org/whatwg-url/-/whatwg-url-12.0.1.tgz",
			"integrity": "sha512-Ed/LrqB8EPlGxjS+TrsXcpUond1mhccS3pchLhzSgPCnTimUCKj3IZE75pAs5m6heB2U2TMerKFUXheyHY+VDQ==",
			"dev": true,
			"dependencies": {
				"tr46": "^4.1.1",
				"webidl-conversions": "^7.0.0"
			},
			"engines": {
				"node": ">=14"
			}
		},
		"node_modules/word-wrap": {
			"version": "1.2.4",
			"resolved": "https://registry.npmjs.org/word-wrap/-/word-wrap-1.2.4.tgz",
			"integrity": "sha512-2V81OA4ugVo5pRo46hAoD2ivUJx8jXmWXfUkY4KFNw0hEptvN0QfH3K4nHiwzGeKl5rFKedV48QVoqYavy4YpA==",
			"dev": true,
			"engines": {
				"node": ">=0.10.0"
			}
		},
		"node_modules/ws": {
			"version": "8.17.1",
			"resolved": "https://registry.npmjs.org/ws/-/ws-8.17.1.tgz",
			"integrity": "sha512-6XQFvXTkbfUOZOKKILFG1PDK2NDQs4azKQl26T0YS5CxqWLgXajbPZ+h4gZekJyRqFU8pvnbAbbs/3TgRPy+GQ==",
			"dev": true,
			"engines": {
				"node": ">=10.0.0"
			},
			"peerDependencies": {
				"bufferutil": "^4.0.1",
				"utf-8-validate": ">=5.0.2"
			},
			"peerDependenciesMeta": {
				"bufferutil": {
					"optional": true
				},
				"utf-8-validate": {
					"optional": true
				}
			}
		},
		"node_modules/xml-name-validator": {
			"version": "4.0.0",
			"resolved": "https://registry.npmjs.org/xml-name-validator/-/xml-name-validator-4.0.0.tgz",
			"integrity": "sha512-ICP2e+jsHvAj2E2lIHxa5tjXRlKDJo4IdvPvCXbXQGdzSfmSpNVyIKMvoZHjDY9DP0zV17iI85o90vRFXNccRw==",
			"dev": true,
			"engines": {
				"node": ">=12"
			}
		},
		"node_modules/xmlchars": {
			"version": "2.2.0",
			"resolved": "https://registry.npmjs.org/xmlchars/-/xmlchars-2.2.0.tgz",
			"integrity": "sha512-JZnDKK8B0RCDw84FNdDAIpZK+JuJw+s7Lz8nksI7SIuU3UXJJslUthsi+uWBUYOwPFwW7W7PRLRfUKpxjtjFCw==",
			"dev": true
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/notebook-renderers/package.json]---
Location: vscode-main/extensions/notebook-renderers/package.json

```json
{
	"name": "builtin-notebook-renderers",
	"displayName": "%displayName%",
	"description": "%description%",
	"publisher": "vscode",
	"version": "1.0.0",
	"license": "MIT",
	"icon": "media/icon.png",
	"engines": {
		"vscode": "^1.57.0"
	},
	"capabilities": {
		"virtualWorkspaces": true,
		"untrustedWorkspaces": {
			"supported": true
		}
	},
	"contributes": {
		"notebookRenderer": [
			{
				"id": "vscode.builtin-renderer",
				"entrypoint": "./renderer-out/index.js",
				"displayName": "VS Code Builtin Notebook Output Renderer",
				"requiresMessaging": "never",
				"mimeTypes": [
					"image/gif",
					"image/png",
					"image/jpeg",
					"image/git",
					"image/svg+xml",
					"text/html",
					"application/javascript",
					"application/vnd.code.notebook.error",
					"application/vnd.code.notebook.stdout",
					"application/x.notebook.stdout",
					"application/x.notebook.stream",
					"application/vnd.code.notebook.stderr",
					"application/x.notebook.stderr",
					"text/plain"
				]
			}
		]
	},
	"scripts": {
		"compile": "npx gulp compile-extension:notebook-renderers && npm run build-notebook",
		"watch": "npx gulp compile-watch:notebook-renderers",
		"build-notebook": "node ./esbuild.mjs"
	},
	"devDependencies": {
		"@types/jsdom": "^21.1.0",
		"@types/node": "^22.18.10",
		"@types/vscode-notebook-renderer": "^1.60.0",
		"jsdom": "^21.1.1"
	},
	"repository": {
		"type": "git",
		"url": "https://github.com/microsoft/vscode.git"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/notebook-renderers/package.nls.json]---
Location: vscode-main/extensions/notebook-renderers/package.nls.json

```json
{
	"displayName": "Builtin Notebook Output Renderers",
	"description": "Provides basic output renderers for notebooks"
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/notebook-renderers/README.md]---
Location: vscode-main/extensions/notebook-renderers/README.md

```markdown
# Builtin Notebook Output Renderers for Visual Studio Code

**Notice:** This extension is bundled with Visual Studio Code. It can be disabled but not uninstalled.

## Features

This extension provides the following notebook renderers for VS Code:

- Image renderer for png, jpeg and gif
```

--------------------------------------------------------------------------------

---[FILE: extensions/notebook-renderers/tsconfig.json]---
Location: vscode-main/extensions/notebook-renderers/tsconfig.json

```json
{
	"extends": "../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"lib": [
			"es2024",
			"dom"
		],
		"types": [
			"node"
		],
		"typeRoots": [
			"./node_modules/@types"
		]
	},
	"include": [
		"src/**/*",
		"../../src/vscode-dts/vscode.d.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/notebook-renderers/src/ansi.ts]---
Location: vscode-main/extensions/notebook-renderers/src/ansi.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RGBA, Color } from './color';
import { ansiColorIdentifiers } from './colorMap';
import { LinkOptions, linkify } from './linkify';


export function handleANSIOutput(text: string, linkOptions: LinkOptions): HTMLSpanElement {

	const root: HTMLSpanElement = document.createElement('span');
	const textLength: number = text.length;

	let styleNames: string[] = [];
	let customFgColor: RGBA | string | undefined;
	let customBgColor: RGBA | string | undefined;
	let customUnderlineColor: RGBA | string | undefined;
	let colorsInverted: boolean = false;
	let currentPos: number = 0;
	let buffer: string = '';

	while (currentPos < textLength) {

		let sequenceFound: boolean = false;

		// Potentially an ANSI escape sequence.
		// See https://www.asciitable.com/ansi-escape-sequences.php & https://en.wikipedia.org/wiki/ANSI_escape_code
		if (text.charCodeAt(currentPos) === 27 && text.charAt(currentPos + 1) === '[') {

			const startPos: number = currentPos;
			currentPos += 2; // Ignore 'Esc[' as it's in every sequence.

			let ansiSequence: string = '';

			while (currentPos < textLength) {
				const char: string = text.charAt(currentPos);
				ansiSequence += char;

				currentPos++;

				// Look for a known sequence terminating character.
				if (char.match(/^[ABCDHIJKfhmpsu]$/)) {
					sequenceFound = true;
					break;
				}

			}

			if (sequenceFound) {

				// Flush buffer with previous styles.
				appendStylizedStringToContainer(root, buffer, linkOptions, styleNames, customFgColor, customBgColor, customUnderlineColor);

				buffer = '';

				/*
				 * Certain ranges that are matched here do not contain real graphics rendition sequences. For
				 * the sake of having a simpler expression, they have been included anyway.
				 */
				if (ansiSequence.match(/^(?:[34][0-8]|9[0-7]|10[0-7]|[0-9]|2[1-5,7-9]|[34]9|5[8,9]|1[0-9])(?:;[349][0-7]|10[0-7]|[013]|[245]|[34]9)?(?:;[012]?[0-9]?[0-9])*;?m$/)) {

					const styleCodes: number[] = ansiSequence.slice(0, -1) // Remove final 'm' character.
						.split(';')										   // Separate style codes.
						.filter(elem => elem !== '')			           // Filter empty elems as '34;m' -> ['34', ''].
						.map(elem => parseInt(elem, 10));		           // Convert to numbers.

					if (styleCodes[0] === 38 || styleCodes[0] === 48 || styleCodes[0] === 58) {
						// Advanced color code - can't be combined with formatting codes like simple colors can
						// Ignores invalid colors and additional info beyond what is necessary
						const colorType = (styleCodes[0] === 38) ? 'foreground' : ((styleCodes[0] === 48) ? 'background' : 'underline');

						if (styleCodes[1] === 5) {
							set8BitColor(styleCodes, colorType);
						} else if (styleCodes[1] === 2) {
							set24BitColor(styleCodes, colorType);
						}
					} else {
						setBasicFormatters(styleCodes);
					}

				} else {
					// Unsupported sequence so simply hide it.
				}

			} else {
				currentPos = startPos;
			}
		}

		if (sequenceFound === false) {
			buffer += text.charAt(currentPos);
			currentPos++;
		}
	}

	// Flush remaining text buffer if not empty.
	if (buffer) {
		appendStylizedStringToContainer(root, buffer, linkOptions, styleNames, customFgColor, customBgColor, customUnderlineColor);
	}

	return root;

	/**
	 * Change the foreground or background color by clearing the current color
	 * and adding the new one.
	 * @param colorType If `'foreground'`, will change the foreground color, if
	 * 	`'background'`, will change the background color, and if `'underline'`
	 * will set the underline color.
	 * @param color Color to change to. If `undefined` or not provided,
	 * will clear current color without adding a new one.
	 */
	function changeColor(colorType: 'foreground' | 'background' | 'underline', color?: RGBA | string | undefined): void {
		if (colorType === 'foreground') {
			customFgColor = color;
		} else if (colorType === 'background') {
			customBgColor = color;
		} else if (colorType === 'underline') {
			customUnderlineColor = color;
		}
		styleNames = styleNames.filter(style => style !== `code-${colorType}-colored`);
		if (color !== undefined) {
			styleNames.push(`code-${colorType}-colored`);
		}
	}

	/**
	 * Swap foreground and background colors.  Used for color inversion.  Caller should check
	 * [] flag to make sure it is appropriate to turn ON or OFF (if it is already inverted don't call
	 */
	function reverseForegroundAndBackgroundColors(): void {
		const oldFgColor: RGBA | string | undefined = customFgColor;
		changeColor('foreground', customBgColor);
		changeColor('background', oldFgColor);
	}

	/**
	 * Calculate and set basic ANSI formatting. Supports ON/OFF of bold, italic, underline,
	 * double underline,  crossed-out/strikethrough, overline, dim, blink, rapid blink,
	 * reverse/invert video, hidden, superscript, subscript and alternate font codes,
	 * clearing/resetting of foreground, background and underline colors,
	 * setting normal foreground and background colors, and bright foreground and
	 * background colors. Not to be used for codes containing advanced colors.
	 * Will ignore invalid codes.
	 * @param styleCodes Array of ANSI basic styling numbers, which will be
	 * applied in order. New colors and backgrounds clear old ones; new formatting
	 * does not.
	 * @see {@link https://en.wikipedia.org/wiki/ANSI_escape_code#SGR }
	 */
	function setBasicFormatters(styleCodes: number[]): void {
		for (const code of styleCodes) {
			switch (code) {
				case 0: {  // reset (everything)
					styleNames = [];
					customFgColor = undefined;
					customBgColor = undefined;
					break;
				}
				case 1: { // bold
					styleNames = styleNames.filter(style => style !== `code-bold`);
					styleNames.push('code-bold');
					break;
				}
				case 2: { // dim
					styleNames = styleNames.filter(style => style !== `code-dim`);
					styleNames.push('code-dim');
					break;
				}
				case 3: { // italic
					styleNames = styleNames.filter(style => style !== `code-italic`);
					styleNames.push('code-italic');
					break;
				}
				case 4: { // underline
					styleNames = styleNames.filter(style => (style !== `code-underline` && style !== `code-double-underline`));
					styleNames.push('code-underline');
					break;
				}
				case 5: { // blink
					styleNames = styleNames.filter(style => style !== `code-blink`);
					styleNames.push('code-blink');
					break;
				}
				case 6: { // rapid blink
					styleNames = styleNames.filter(style => style !== `code-rapid-blink`);
					styleNames.push('code-rapid-blink');
					break;
				}
				case 7: { // invert foreground and background
					if (!colorsInverted) {
						colorsInverted = true;
						reverseForegroundAndBackgroundColors();
					}
					break;
				}
				case 8: { // hidden
					styleNames = styleNames.filter(style => style !== `code-hidden`);
					styleNames.push('code-hidden');
					break;
				}
				case 9: { // strike-through/crossed-out
					styleNames = styleNames.filter(style => style !== `code-strike-through`);
					styleNames.push('code-strike-through');
					break;
				}
				case 10: { // normal default font
					styleNames = styleNames.filter(style => !style.startsWith('code-font'));
					break;
				}
				case 11: case 12: case 13: case 14: case 15: case 16: case 17: case 18: case 19: case 20: { // font codes (and 20 is 'blackletter' font code)
					styleNames = styleNames.filter(style => !style.startsWith('code-font'));
					styleNames.push(`code-font-${code - 10}`);
					break;
				}
				case 21: { // double underline
					styleNames = styleNames.filter(style => (style !== `code-underline` && style !== `code-double-underline`));
					styleNames.push('code-double-underline');
					break;
				}
				case 22: { // normal intensity (bold off and dim off)
					styleNames = styleNames.filter(style => (style !== `code-bold` && style !== `code-dim`));
					break;
				}
				case 23: { // Neither italic or blackletter (font 10)
					styleNames = styleNames.filter(style => (style !== `code-italic` && style !== `code-font-10`));
					break;
				}
				case 24: { // not underlined (Neither singly nor doubly underlined)
					styleNames = styleNames.filter(style => (style !== `code-underline` && style !== `code-double-underline`));
					break;
				}
				case 25: { // not blinking
					styleNames = styleNames.filter(style => (style !== `code-blink` && style !== `code-rapid-blink`));
					break;
				}
				case 27: { // not reversed/inverted
					if (colorsInverted) {
						colorsInverted = false;
						reverseForegroundAndBackgroundColors();
					}
					break;
				}
				case 28: { // not hidden (reveal)
					styleNames = styleNames.filter(style => style !== `code-hidden`);
					break;
				}
				case 29: { // not crossed-out
					styleNames = styleNames.filter(style => style !== `code-strike-through`);
					break;
				}
				case 53: { // overlined
					styleNames = styleNames.filter(style => style !== `code-overline`);
					styleNames.push('code-overline');
					break;
				}
				case 55: { // not overlined
					styleNames = styleNames.filter(style => style !== `code-overline`);
					break;
				}
				case 39: {  // default foreground color
					changeColor('foreground', undefined);
					break;
				}
				case 49: {  // default background color
					changeColor('background', undefined);
					break;
				}
				case 59: {  // default underline color
					changeColor('underline', undefined);
					break;
				}
				case 73: { // superscript
					styleNames = styleNames.filter(style => (style !== `code-superscript` && style !== `code-subscript`));
					styleNames.push('code-superscript');
					break;
				}
				case 74: { // subscript
					styleNames = styleNames.filter(style => (style !== `code-superscript` && style !== `code-subscript`));
					styleNames.push('code-subscript');
					break;
				}
				case 75: { // neither superscript or subscript
					styleNames = styleNames.filter(style => (style !== `code-superscript` && style !== `code-subscript`));
					break;
				}
				default: {
					setBasicColor(code);
					break;
				}
			}
		}
	}

	/**
	 * Calculate and set styling for complicated 24-bit ANSI color codes.
	 * @param styleCodes Full list of integer codes that make up the full ANSI
	 * sequence, including the two defining codes and the three RGB codes.
	 * @param colorType If `'foreground'`, will set foreground color, if
	 * `'background'`, will set background color, and if it is `'underline'`
	 * will set the underline color.
	 * @see {@link https://en.wikipedia.org/wiki/ANSI_escape_code#24-bit }
	 */
	function set24BitColor(styleCodes: number[], colorType: 'foreground' | 'background' | 'underline'): void {
		if (styleCodes.length >= 5 &&
			styleCodes[2] >= 0 && styleCodes[2] <= 255 &&
			styleCodes[3] >= 0 && styleCodes[3] <= 255 &&
			styleCodes[4] >= 0 && styleCodes[4] <= 255) {
			const customColor = new RGBA(styleCodes[2], styleCodes[3], styleCodes[4]);
			changeColor(colorType, customColor);
		}
	}

	/**
	 * Calculate and set styling for advanced 8-bit ANSI color codes.
	 * @param styleCodes Full list of integer codes that make up the ANSI
	 * sequence, including the two defining codes and the one color code.
	 * @param colorType If `'foreground'`, will set foreground color, if
	 * `'background'`, will set background color and if it is `'underline'`
	 * will set the underline color.
	 * @see {@link https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit }
	 */
	function set8BitColor(styleCodes: number[], colorType: 'foreground' | 'background' | 'underline'): void {
		let colorNumber = styleCodes[2];
		const color = calcANSI8bitColor(colorNumber);

		if (color) {
			changeColor(colorType, color);
		} else if (colorNumber >= 0 && colorNumber <= 15) {
			if (colorType === 'underline') {
				// for underline colors we just decode the 0-15 color number to theme color, set and return
				changeColor(colorType, ansiColorIdentifiers[colorNumber].colorValue);
				return;
			}
			// Need to map to one of the four basic color ranges (30-37, 90-97, 40-47, 100-107)
			colorNumber += 30;
			if (colorNumber >= 38) {
				// Bright colors
				colorNumber += 52;
			}
			if (colorType === 'background') {
				colorNumber += 10;
			}
			setBasicColor(colorNumber);
		}
	}

	/**
	 * Calculate and set styling for basic bright and dark ANSI color codes. Uses
	 * theme colors if available. Automatically distinguishes between foreground
	 * and background colors; does not support color-clearing codes 39 and 49.
	 * @param styleCode Integer color code on one of the following ranges:
	 * [30-37, 90-97, 40-47, 100-107]. If not on one of these ranges, will do
	 * nothing.
	 */
	function setBasicColor(styleCode: number): void {
		// const theme = themeService.getColorTheme();
		let colorType: 'foreground' | 'background' | undefined;
		let colorIndex: number | undefined;

		if (styleCode >= 30 && styleCode <= 37) {
			colorIndex = styleCode - 30;
			colorType = 'foreground';
		} else if (styleCode >= 90 && styleCode <= 97) {
			colorIndex = (styleCode - 90) + 8; // High-intensity (bright)
			colorType = 'foreground';
		} else if (styleCode >= 40 && styleCode <= 47) {
			colorIndex = styleCode - 40;
			colorType = 'background';
		} else if (styleCode >= 100 && styleCode <= 107) {
			colorIndex = (styleCode - 100) + 8; // High-intensity (bright)
			colorType = 'background';
		}

		if (colorIndex !== undefined && colorType) {
			changeColor(colorType, ansiColorIdentifiers[colorIndex]?.colorValue);
		}
	}
}

function appendStylizedStringToContainer(
	root: HTMLElement,
	stringContent: string,
	linkOptions: LinkOptions,
	cssClasses: string[],
	customTextColor?: RGBA | string,
	customBackgroundColor?: RGBA | string,
	customUnderlineColor?: RGBA | string
): void {
	if (!root || !stringContent) {
		return;
	}

	let container = document.createElement('span');

	if (container.childElementCount === 0) {
		// plain text
		container = linkify(stringContent, linkOptions, true);
	}

	container.className = cssClasses.join(' ');
	if (customTextColor) {
		container.style.color = typeof customTextColor === 'string' ? customTextColor : Color.Format.CSS.formatRGB(new Color(customTextColor));
	}
	if (customBackgroundColor) {
		container.style.backgroundColor = typeof customBackgroundColor === 'string' ? customBackgroundColor : Color.Format.CSS.formatRGB(new Color(customBackgroundColor));
	}
	if (customUnderlineColor) {
		container.style.textDecorationColor = typeof customUnderlineColor === 'string' ? customUnderlineColor : Color.Format.CSS.formatRGB(new Color(customUnderlineColor));
	}
	root.appendChild(container);
}

/**
 * Calculate the color from the color set defined in the ANSI 8-bit standard.
 * Standard and high intensity colors are not defined in the standard as specific
 * colors, so these and invalid colors return `undefined`.
 * @see {@link https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit } for info.
 * @param colorNumber The number (ranging from 16 to 255) referring to the color
 * desired.
 */
export function calcANSI8bitColor(colorNumber: number): RGBA | undefined {
	if (colorNumber % 1 !== 0) {
		// Should be integer
		return;
	} if (colorNumber >= 16 && colorNumber <= 231) {
		// Converts to one of 216 RGB colors
		colorNumber -= 16;

		let blue: number = colorNumber % 6;
		colorNumber = (colorNumber - blue) / 6;
		let green: number = colorNumber % 6;
		colorNumber = (colorNumber - green) / 6;
		let red: number = colorNumber;

		// red, green, blue now range on [0, 5], need to map to [0,255]
		const convFactor: number = 255 / 5;
		blue = Math.round(blue * convFactor);
		green = Math.round(green * convFactor);
		red = Math.round(red * convFactor);

		return new RGBA(red, green, blue);
	} else if (colorNumber >= 232 && colorNumber <= 255) {
		// Converts to a grayscale value
		colorNumber -= 232;
		const colorLevel: number = Math.round(colorNumber / 23 * 255);
		return new RGBA(colorLevel, colorLevel, colorLevel);
	} else {
		return;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/notebook-renderers/src/color.ts]---
Location: vscode-main/extensions/notebook-renderers/src/color.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const enum CharCode {
	Null = 0,
	/**
	 * The `\b` character.
	 */
	Backspace = 8,
	/**
	 * The `\t` character.
	 */
	Tab = 9,
	/**
	 * The `\n` character.
	 */
	LineFeed = 10,
	/**
	 * The `\r` character.
	 */
	CarriageReturn = 13,
	Space = 32,
	/**
	 * The `!` character.
	 */
	ExclamationMark = 33,
	/**
	 * The `"` character.
	 */
	DoubleQuote = 34,
	/**
	 * The `#` character.
	 */
	Hash = 35,
	/**
	 * The `$` character.
	 */
	DollarSign = 36,
	/**
	 * The `%` character.
	 */
	PercentSign = 37,
	/**
	 * The `&` character.
	 */
	Ampersand = 38,
	/**
	 * The `'` character.
	 */
	SingleQuote = 39,
	/**
	 * The `(` character.
	 */
	OpenParen = 40,
	/**
	 * The `)` character.
	 */
	CloseParen = 41,
	/**
	 * The `*` character.
	 */
	Asterisk = 42,
	/**
	 * The `+` character.
	 */
	Plus = 43,
	/**
	 * The `,` character.
	 */
	Comma = 44,
	/**
	 * The `-` character.
	 */
	Dash = 45,
	/**
	 * The `.` character.
	 */
	Period = 46,
	/**
	 * The `/` character.
	 */
	Slash = 47,

	Digit0 = 48,
	Digit1 = 49,
	Digit2 = 50,
	Digit3 = 51,
	Digit4 = 52,
	Digit5 = 53,
	Digit6 = 54,
	Digit7 = 55,
	Digit8 = 56,
	Digit9 = 57,

	/**
	 * The `:` character.
	 */
	Colon = 58,
	/**
	 * The `;` character.
	 */
	Semicolon = 59,
	/**
	 * The `<` character.
	 */
	LessThan = 60,
	/**
	 * The `=` character.
	 */
	Equals = 61,
	/**
	 * The `>` character.
	 */
	GreaterThan = 62,
	/**
	 * The `?` character.
	 */
	QuestionMark = 63,
	/**
	 * The `@` character.
	 */
	AtSign = 64,

	A = 65,
	B = 66,
	C = 67,
	D = 68,
	E = 69,
	F = 70,
	G = 71,
	H = 72,
	I = 73,
	J = 74,
	K = 75,
	L = 76,
	M = 77,
	N = 78,
	O = 79,
	P = 80,
	Q = 81,
	R = 82,
	S = 83,
	T = 84,
	U = 85,
	V = 86,
	W = 87,
	X = 88,
	Y = 89,
	Z = 90,

	/**
	 * The `[` character.
	 */
	OpenSquareBracket = 91,
	/**
	 * The `\` character.
	 */
	Backslash = 92,
	/**
	 * The `]` character.
	 */
	CloseSquareBracket = 93,
	/**
	 * The `^` character.
	 */
	Caret = 94,
	/**
	 * The `_` character.
	 */
	Underline = 95,
	/**
	 * The ``(`)`` character.
	 */
	BackTick = 96,

	a = 97,
	b = 98,
	c = 99,
	d = 100,
	e = 101,
	f = 102,
	g = 103,
	h = 104,
	i = 105,
	j = 106,
	k = 107,
	l = 108,
	m = 109,
	n = 110,
	o = 111,
	p = 112,
	q = 113,
	r = 114,
	s = 115,
	t = 116,
	u = 117,
	v = 118,
	w = 119,
	x = 120,
	y = 121,
	z = 122,

	/**
	 * The `{` character.
	 */
	OpenCurlyBrace = 123,
	/**
	 * The `|` character.
	 */
	Pipe = 124,
	/**
	 * The `}` character.
	 */
	CloseCurlyBrace = 125,
	/**
	 * The `~` character.
	 */
	Tilde = 126,

	U_Combining_Grave_Accent = 0x0300,								//	U+0300	Combining Grave Accent
	U_Combining_Acute_Accent = 0x0301,								//	U+0301	Combining Acute Accent
	U_Combining_Circumflex_Accent = 0x0302,							//	U+0302	Combining Circumflex Accent
	U_Combining_Tilde = 0x0303,										//	U+0303	Combining Tilde
	U_Combining_Macron = 0x0304,									//	U+0304	Combining Macron
	U_Combining_Overline = 0x0305,									//	U+0305	Combining Overline
	U_Combining_Breve = 0x0306,										//	U+0306	Combining Breve
	U_Combining_Dot_Above = 0x0307,									//	U+0307	Combining Dot Above
	U_Combining_Diaeresis = 0x0308,									//	U+0308	Combining Diaeresis
	U_Combining_Hook_Above = 0x0309,								//	U+0309	Combining Hook Above
	U_Combining_Ring_Above = 0x030A,								//	U+030A	Combining Ring Above
	U_Combining_Double_Acute_Accent = 0x030B,						//	U+030B	Combining Double Acute Accent
	U_Combining_Caron = 0x030C,										//	U+030C	Combining Caron
	U_Combining_Vertical_Line_Above = 0x030D,						//	U+030D	Combining Vertical Line Above
	U_Combining_Double_Vertical_Line_Above = 0x030E,				//	U+030E	Combining Double Vertical Line Above
	U_Combining_Double_Grave_Accent = 0x030F,						//	U+030F	Combining Double Grave Accent
	U_Combining_Candrabindu = 0x0310,								//	U+0310	Combining Candrabindu
	U_Combining_Inverted_Breve = 0x0311,							//	U+0311	Combining Inverted Breve
	U_Combining_Turned_Comma_Above = 0x0312,						//	U+0312	Combining Turned Comma Above
	U_Combining_Comma_Above = 0x0313,								//	U+0313	Combining Comma Above
	U_Combining_Reversed_Comma_Above = 0x0314,						//	U+0314	Combining Reversed Comma Above
	U_Combining_Comma_Above_Right = 0x0315,							//	U+0315	Combining Comma Above Right
	U_Combining_Grave_Accent_Below = 0x0316,						//	U+0316	Combining Grave Accent Below
	U_Combining_Acute_Accent_Below = 0x0317,						//	U+0317	Combining Acute Accent Below
	U_Combining_Left_Tack_Below = 0x0318,							//	U+0318	Combining Left Tack Below
	U_Combining_Right_Tack_Below = 0x0319,							//	U+0319	Combining Right Tack Below
	U_Combining_Left_Angle_Above = 0x031A,							//	U+031A	Combining Left Angle Above
	U_Combining_Horn = 0x031B,										//	U+031B	Combining Horn
	U_Combining_Left_Half_Ring_Below = 0x031C,						//	U+031C	Combining Left Half Ring Below
	U_Combining_Up_Tack_Below = 0x031D,								//	U+031D	Combining Up Tack Below
	U_Combining_Down_Tack_Below = 0x031E,							//	U+031E	Combining Down Tack Below
	U_Combining_Plus_Sign_Below = 0x031F,							//	U+031F	Combining Plus Sign Below
	U_Combining_Minus_Sign_Below = 0x0320,							//	U+0320	Combining Minus Sign Below
	U_Combining_Palatalized_Hook_Below = 0x0321,					//	U+0321	Combining Palatalized Hook Below
	U_Combining_Retroflex_Hook_Below = 0x0322,						//	U+0322	Combining Retroflex Hook Below
	U_Combining_Dot_Below = 0x0323,									//	U+0323	Combining Dot Below
	U_Combining_Diaeresis_Below = 0x0324,							//	U+0324	Combining Diaeresis Below
	U_Combining_Ring_Below = 0x0325,								//	U+0325	Combining Ring Below
	U_Combining_Comma_Below = 0x0326,								//	U+0326	Combining Comma Below
	U_Combining_Cedilla = 0x0327,									//	U+0327	Combining Cedilla
	U_Combining_Ogonek = 0x0328,									//	U+0328	Combining Ogonek
	U_Combining_Vertical_Line_Below = 0x0329,						//	U+0329	Combining Vertical Line Below
	U_Combining_Bridge_Below = 0x032A,								//	U+032A	Combining Bridge Below
	U_Combining_Inverted_Double_Arch_Below = 0x032B,				//	U+032B	Combining Inverted Double Arch Below
	U_Combining_Caron_Below = 0x032C,								//	U+032C	Combining Caron Below
	U_Combining_Circumflex_Accent_Below = 0x032D,					//	U+032D	Combining Circumflex Accent Below
	U_Combining_Breve_Below = 0x032E,								//	U+032E	Combining Breve Below
	U_Combining_Inverted_Breve_Below = 0x032F,						//	U+032F	Combining Inverted Breve Below
	U_Combining_Tilde_Below = 0x0330,								//	U+0330	Combining Tilde Below
	U_Combining_Macron_Below = 0x0331,								//	U+0331	Combining Macron Below
	U_Combining_Low_Line = 0x0332,									//	U+0332	Combining Low Line
	U_Combining_Double_Low_Line = 0x0333,							//	U+0333	Combining Double Low Line
	U_Combining_Tilde_Overlay = 0x0334,								//	U+0334	Combining Tilde Overlay
	U_Combining_Short_Stroke_Overlay = 0x0335,						//	U+0335	Combining Short Stroke Overlay
	U_Combining_Long_Stroke_Overlay = 0x0336,						//	U+0336	Combining Long Stroke Overlay
	U_Combining_Short_Solidus_Overlay = 0x0337,						//	U+0337	Combining Short Solidus Overlay
	U_Combining_Long_Solidus_Overlay = 0x0338,						//	U+0338	Combining Long Solidus Overlay
	U_Combining_Right_Half_Ring_Below = 0x0339,						//	U+0339	Combining Right Half Ring Below
	U_Combining_Inverted_Bridge_Below = 0x033A,						//	U+033A	Combining Inverted Bridge Below
	U_Combining_Square_Below = 0x033B,								//	U+033B	Combining Square Below
	U_Combining_Seagull_Below = 0x033C,								//	U+033C	Combining Seagull Below
	U_Combining_X_Above = 0x033D,									//	U+033D	Combining X Above
	U_Combining_Vertical_Tilde = 0x033E,							//	U+033E	Combining Vertical Tilde
	U_Combining_Double_Overline = 0x033F,							//	U+033F	Combining Double Overline
	U_Combining_Grave_Tone_Mark = 0x0340,							//	U+0340	Combining Grave Tone Mark
	U_Combining_Acute_Tone_Mark = 0x0341,							//	U+0341	Combining Acute Tone Mark
	U_Combining_Greek_Perispomeni = 0x0342,							//	U+0342	Combining Greek Perispomeni
	U_Combining_Greek_Koronis = 0x0343,								//	U+0343	Combining Greek Koronis
	U_Combining_Greek_Dialytika_Tonos = 0x0344,						//	U+0344	Combining Greek Dialytika Tonos
	U_Combining_Greek_Ypogegrammeni = 0x0345,						//	U+0345	Combining Greek Ypogegrammeni
	U_Combining_Bridge_Above = 0x0346,								//	U+0346	Combining Bridge Above
	U_Combining_Equals_Sign_Below = 0x0347,							//	U+0347	Combining Equals Sign Below
	U_Combining_Double_Vertical_Line_Below = 0x0348,				//	U+0348	Combining Double Vertical Line Below
	U_Combining_Left_Angle_Below = 0x0349,							//	U+0349	Combining Left Angle Below
	U_Combining_Not_Tilde_Above = 0x034A,							//	U+034A	Combining Not Tilde Above
	U_Combining_Homothetic_Above = 0x034B,							//	U+034B	Combining Homothetic Above
	U_Combining_Almost_Equal_To_Above = 0x034C,						//	U+034C	Combining Almost Equal To Above
	U_Combining_Left_Right_Arrow_Below = 0x034D,					//	U+034D	Combining Left Right Arrow Below
	U_Combining_Upwards_Arrow_Below = 0x034E,						//	U+034E	Combining Upwards Arrow Below
	U_Combining_Grapheme_Joiner = 0x034F,							//	U+034F	Combining Grapheme Joiner
	U_Combining_Right_Arrowhead_Above = 0x0350,						//	U+0350	Combining Right Arrowhead Above
	U_Combining_Left_Half_Ring_Above = 0x0351,						//	U+0351	Combining Left Half Ring Above
	U_Combining_Fermata = 0x0352,									//	U+0352	Combining Fermata
	U_Combining_X_Below = 0x0353,									//	U+0353	Combining X Below
	U_Combining_Left_Arrowhead_Below = 0x0354,						//	U+0354	Combining Left Arrowhead Below
	U_Combining_Right_Arrowhead_Below = 0x0355,						//	U+0355	Combining Right Arrowhead Below
	U_Combining_Right_Arrowhead_And_Up_Arrowhead_Below = 0x0356,	//	U+0356	Combining Right Arrowhead And Up Arrowhead Below
	U_Combining_Right_Half_Ring_Above = 0x0357,						//	U+0357	Combining Right Half Ring Above
	U_Combining_Dot_Above_Right = 0x0358,							//	U+0358	Combining Dot Above Right
	U_Combining_Asterisk_Below = 0x0359,							//	U+0359	Combining Asterisk Below
	U_Combining_Double_Ring_Below = 0x035A,							//	U+035A	Combining Double Ring Below
	U_Combining_Zigzag_Above = 0x035B,								//	U+035B	Combining Zigzag Above
	U_Combining_Double_Breve_Below = 0x035C,						//	U+035C	Combining Double Breve Below
	U_Combining_Double_Breve = 0x035D,								//	U+035D	Combining Double Breve
	U_Combining_Double_Macron = 0x035E,								//	U+035E	Combining Double Macron
	U_Combining_Double_Macron_Below = 0x035F,						//	U+035F	Combining Double Macron Below
	U_Combining_Double_Tilde = 0x0360,								//	U+0360	Combining Double Tilde
	U_Combining_Double_Inverted_Breve = 0x0361,						//	U+0361	Combining Double Inverted Breve
	U_Combining_Double_Rightwards_Arrow_Below = 0x0362,				//	U+0362	Combining Double Rightwards Arrow Below
	U_Combining_Latin_Small_Letter_A = 0x0363, 						//	U+0363	Combining Latin Small Letter A
	U_Combining_Latin_Small_Letter_E = 0x0364, 						//	U+0364	Combining Latin Small Letter E
	U_Combining_Latin_Small_Letter_I = 0x0365, 						//	U+0365	Combining Latin Small Letter I
	U_Combining_Latin_Small_Letter_O = 0x0366, 						//	U+0366	Combining Latin Small Letter O
	U_Combining_Latin_Small_Letter_U = 0x0367, 						//	U+0367	Combining Latin Small Letter U
	U_Combining_Latin_Small_Letter_C = 0x0368, 						//	U+0368	Combining Latin Small Letter C
	U_Combining_Latin_Small_Letter_D = 0x0369, 						//	U+0369	Combining Latin Small Letter D
	U_Combining_Latin_Small_Letter_H = 0x036A, 						//	U+036A	Combining Latin Small Letter H
	U_Combining_Latin_Small_Letter_M = 0x036B, 						//	U+036B	Combining Latin Small Letter M
	U_Combining_Latin_Small_Letter_R = 0x036C, 						//	U+036C	Combining Latin Small Letter R
	U_Combining_Latin_Small_Letter_T = 0x036D, 						//	U+036D	Combining Latin Small Letter T
	U_Combining_Latin_Small_Letter_V = 0x036E, 						//	U+036E	Combining Latin Small Letter V
	U_Combining_Latin_Small_Letter_X = 0x036F, 						//	U+036F	Combining Latin Small Letter X

	/**
	 * Unicode Character 'LINE SEPARATOR' (U+2028)
	 * http://www.fileformat.info/info/unicode/char/2028/index.htm
	 */
	LINE_SEPARATOR = 0x2028,
	/**
	 * Unicode Character 'PARAGRAPH SEPARATOR' (U+2029)
	 * http://www.fileformat.info/info/unicode/char/2029/index.htm
	 */
	PARAGRAPH_SEPARATOR = 0x2029,
	/**
	 * Unicode Character 'NEXT LINE' (U+0085)
	 * http://www.fileformat.info/info/unicode/char/0085/index.htm
	 */
	NEXT_LINE = 0x0085,

	// http://www.fileformat.info/info/unicode/category/Sk/list.htm
	U_CIRCUMFLEX = 0x005E,									// U+005E	CIRCUMFLEX
	U_GRAVE_ACCENT = 0x0060,								// U+0060	GRAVE ACCENT
	U_DIAERESIS = 0x00A8,									// U+00A8	DIAERESIS
	U_MACRON = 0x00AF,										// U+00AF	MACRON
	U_ACUTE_ACCENT = 0x00B4,								// U+00B4	ACUTE ACCENT
	U_CEDILLA = 0x00B8,										// U+00B8	CEDILLA
	U_MODIFIER_LETTER_LEFT_ARROWHEAD = 0x02C2,				// U+02C2	MODIFIER LETTER LEFT ARROWHEAD
	U_MODIFIER_LETTER_RIGHT_ARROWHEAD = 0x02C3,				// U+02C3	MODIFIER LETTER RIGHT ARROWHEAD
	U_MODIFIER_LETTER_UP_ARROWHEAD = 0x02C4,				// U+02C4	MODIFIER LETTER UP ARROWHEAD
	U_MODIFIER_LETTER_DOWN_ARROWHEAD = 0x02C5,				// U+02C5	MODIFIER LETTER DOWN ARROWHEAD
	U_MODIFIER_LETTER_CENTRED_RIGHT_HALF_RING = 0x02D2,		// U+02D2	MODIFIER LETTER CENTRED RIGHT HALF RING
	U_MODIFIER_LETTER_CENTRED_LEFT_HALF_RING = 0x02D3,		// U+02D3	MODIFIER LETTER CENTRED LEFT HALF RING
	U_MODIFIER_LETTER_UP_TACK = 0x02D4,						// U+02D4	MODIFIER LETTER UP TACK
	U_MODIFIER_LETTER_DOWN_TACK = 0x02D5,					// U+02D5	MODIFIER LETTER DOWN TACK
	U_MODIFIER_LETTER_PLUS_SIGN = 0x02D6,					// U+02D6	MODIFIER LETTER PLUS SIGN
	U_MODIFIER_LETTER_MINUS_SIGN = 0x02D7,					// U+02D7	MODIFIER LETTER MINUS SIGN
	U_BREVE = 0x02D8,										// U+02D8	BREVE
	U_DOT_ABOVE = 0x02D9,									// U+02D9	DOT ABOVE
	U_RING_ABOVE = 0x02DA,									// U+02DA	RING ABOVE
	U_OGONEK = 0x02DB,										// U+02DB	OGONEK
	U_SMALL_TILDE = 0x02DC,									// U+02DC	SMALL TILDE
	U_DOUBLE_ACUTE_ACCENT = 0x02DD,							// U+02DD	DOUBLE ACUTE ACCENT
	U_MODIFIER_LETTER_RHOTIC_HOOK = 0x02DE,					// U+02DE	MODIFIER LETTER RHOTIC HOOK
	U_MODIFIER_LETTER_CROSS_ACCENT = 0x02DF,				// U+02DF	MODIFIER LETTER CROSS ACCENT
	U_MODIFIER_LETTER_EXTRA_HIGH_TONE_BAR = 0x02E5,			// U+02E5	MODIFIER LETTER EXTRA-HIGH TONE BAR
	U_MODIFIER_LETTER_HIGH_TONE_BAR = 0x02E6,				// U+02E6	MODIFIER LETTER HIGH TONE BAR
	U_MODIFIER_LETTER_MID_TONE_BAR = 0x02E7,				// U+02E7	MODIFIER LETTER MID TONE BAR
	U_MODIFIER_LETTER_LOW_TONE_BAR = 0x02E8,				// U+02E8	MODIFIER LETTER LOW TONE BAR
	U_MODIFIER_LETTER_EXTRA_LOW_TONE_BAR = 0x02E9,			// U+02E9	MODIFIER LETTER EXTRA-LOW TONE BAR
	U_MODIFIER_LETTER_YIN_DEPARTING_TONE_MARK = 0x02EA,		// U+02EA	MODIFIER LETTER YIN DEPARTING TONE MARK
	U_MODIFIER_LETTER_YANG_DEPARTING_TONE_MARK = 0x02EB,	// U+02EB	MODIFIER LETTER YANG DEPARTING TONE MARK
	U_MODIFIER_LETTER_UNASPIRATED = 0x02ED,					// U+02ED	MODIFIER LETTER UNASPIRATED
	U_MODIFIER_LETTER_LOW_DOWN_ARROWHEAD = 0x02EF,			// U+02EF	MODIFIER LETTER LOW DOWN ARROWHEAD
	U_MODIFIER_LETTER_LOW_UP_ARROWHEAD = 0x02F0,			// U+02F0	MODIFIER LETTER LOW UP ARROWHEAD
	U_MODIFIER_LETTER_LOW_LEFT_ARROWHEAD = 0x02F1,			// U+02F1	MODIFIER LETTER LOW LEFT ARROWHEAD
	U_MODIFIER_LETTER_LOW_RIGHT_ARROWHEAD = 0x02F2,			// U+02F2	MODIFIER LETTER LOW RIGHT ARROWHEAD
	U_MODIFIER_LETTER_LOW_RING = 0x02F3,					// U+02F3	MODIFIER LETTER LOW RING
	U_MODIFIER_LETTER_MIDDLE_GRAVE_ACCENT = 0x02F4,			// U+02F4	MODIFIER LETTER MIDDLE GRAVE ACCENT
	U_MODIFIER_LETTER_MIDDLE_DOUBLE_GRAVE_ACCENT = 0x02F5,	// U+02F5	MODIFIER LETTER MIDDLE DOUBLE GRAVE ACCENT
	U_MODIFIER_LETTER_MIDDLE_DOUBLE_ACUTE_ACCENT = 0x02F6,	// U+02F6	MODIFIER LETTER MIDDLE DOUBLE ACUTE ACCENT
	U_MODIFIER_LETTER_LOW_TILDE = 0x02F7,					// U+02F7	MODIFIER LETTER LOW TILDE
	U_MODIFIER_LETTER_RAISED_COLON = 0x02F8,				// U+02F8	MODIFIER LETTER RAISED COLON
	U_MODIFIER_LETTER_BEGIN_HIGH_TONE = 0x02F9,				// U+02F9	MODIFIER LETTER BEGIN HIGH TONE
	U_MODIFIER_LETTER_END_HIGH_TONE = 0x02FA,				// U+02FA	MODIFIER LETTER END HIGH TONE
	U_MODIFIER_LETTER_BEGIN_LOW_TONE = 0x02FB,				// U+02FB	MODIFIER LETTER BEGIN LOW TONE
	U_MODIFIER_LETTER_END_LOW_TONE = 0x02FC,				// U+02FC	MODIFIER LETTER END LOW TONE
	U_MODIFIER_LETTER_SHELF = 0x02FD,						// U+02FD	MODIFIER LETTER SHELF
	U_MODIFIER_LETTER_OPEN_SHELF = 0x02FE,					// U+02FE	MODIFIER LETTER OPEN SHELF
	U_MODIFIER_LETTER_LOW_LEFT_ARROW = 0x02FF,				// U+02FF	MODIFIER LETTER LOW LEFT ARROW
	U_GREEK_LOWER_NUMERAL_SIGN = 0x0375,					// U+0375	GREEK LOWER NUMERAL SIGN
	U_GREEK_TONOS = 0x0384,									// U+0384	GREEK TONOS
	U_GREEK_DIALYTIKA_TONOS = 0x0385,						// U+0385	GREEK DIALYTIKA TONOS
	U_GREEK_KORONIS = 0x1FBD,								// U+1FBD	GREEK KORONIS
	U_GREEK_PSILI = 0x1FBF,									// U+1FBF	GREEK PSILI
	U_GREEK_PERISPOMENI = 0x1FC0,							// U+1FC0	GREEK PERISPOMENI
	U_GREEK_DIALYTIKA_AND_PERISPOMENI = 0x1FC1,				// U+1FC1	GREEK DIALYTIKA AND PERISPOMENI
	U_GREEK_PSILI_AND_VARIA = 0x1FCD,						// U+1FCD	GREEK PSILI AND VARIA
	U_GREEK_PSILI_AND_OXIA = 0x1FCE,						// U+1FCE	GREEK PSILI AND OXIA
	U_GREEK_PSILI_AND_PERISPOMENI = 0x1FCF,					// U+1FCF	GREEK PSILI AND PERISPOMENI
	U_GREEK_DASIA_AND_VARIA = 0x1FDD,						// U+1FDD	GREEK DASIA AND VARIA
	U_GREEK_DASIA_AND_OXIA = 0x1FDE,						// U+1FDE	GREEK DASIA AND OXIA
	U_GREEK_DASIA_AND_PERISPOMENI = 0x1FDF,					// U+1FDF	GREEK DASIA AND PERISPOMENI
	U_GREEK_DIALYTIKA_AND_VARIA = 0x1FED,					// U+1FED	GREEK DIALYTIKA AND VARIA
	U_GREEK_DIALYTIKA_AND_OXIA = 0x1FEE,					// U+1FEE	GREEK DIALYTIKA AND OXIA
	U_GREEK_VARIA = 0x1FEF,									// U+1FEF	GREEK VARIA
	U_GREEK_OXIA = 0x1FFD,									// U+1FFD	GREEK OXIA
	U_GREEK_DASIA = 0x1FFE,									// U+1FFE	GREEK DASIA

	U_IDEOGRAPHIC_FULL_STOP = 0x3002,						// U+3002	IDEOGRAPHIC FULL STOP
	U_LEFT_CORNER_BRACKET = 0x300C,							// U+300C	LEFT CORNER BRACKET
	U_RIGHT_CORNER_BRACKET = 0x300D,						// U+300D	RIGHT CORNER BRACKET
	U_LEFT_BLACK_LENTICULAR_BRACKET = 0x3010,				// U+3010	LEFT BLACK LENTICULAR BRACKET
	U_RIGHT_BLACK_LENTICULAR_BRACKET = 0x3011,				// U+3011	RIGHT BLACK LENTICULAR BRACKET


	U_OVERLINE = 0x203E, // Unicode Character 'OVERLINE'

	/**
	 * UTF-8 BOM
	 * Unicode Character 'ZERO WIDTH NO-BREAK SPACE' (U+FEFF)
	 * http://www.fileformat.info/info/unicode/char/feff/index.htm
	 */
	UTF8_BOM = 65279,

	U_FULLWIDTH_SEMICOLON = 0xFF1B,							// U+FF1B	FULLWIDTH SEMICOLON
	U_FULLWIDTH_COMMA = 0xFF0C,								// U+FF0C	FULLWIDTH COMMA
}

function roundFloat(number: number, decimalPoints: number): number {
	const decimal = Math.pow(10, decimalPoints);
	return Math.round(number * decimal) / decimal;
}

export class RGBA {
	_rgbaBrand: void = undefined;

	/**
	 * Red: integer in [0-255]
	 */
	readonly r: number;

	/**
	 * Green: integer in [0-255]
	 */
	readonly g: number;

	/**
	 * Blue: integer in [0-255]
	 */
	readonly b: number;

	/**
	 * Alpha: float in [0-1]
	 */
	readonly a: number;

	constructor(r: number, g: number, b: number, a: number = 1) {
		this.r = Math.min(255, Math.max(0, r)) | 0;
		this.g = Math.min(255, Math.max(0, g)) | 0;
		this.b = Math.min(255, Math.max(0, b)) | 0;
		this.a = roundFloat(Math.max(Math.min(1, a), 0), 3);
	}

	static equals(a: RGBA, b: RGBA): boolean {
		return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
	}
}

export class HSLA {

	_hslaBrand: void = undefined;

	/**
	 * Hue: integer in [0, 360]
	 */
	readonly h: number;

	/**
	 * Saturation: float in [0, 1]
	 */
	readonly s: number;

	/**
	 * Luminosity: float in [0, 1]
	 */
	readonly l: number;

	/**
	 * Alpha: float in [0, 1]
	 */
	readonly a: number;

	constructor(h: number, s: number, l: number, a: number) {
		this.h = Math.max(Math.min(360, h), 0) | 0;
		this.s = roundFloat(Math.max(Math.min(1, s), 0), 3);
		this.l = roundFloat(Math.max(Math.min(1, l), 0), 3);
		this.a = roundFloat(Math.max(Math.min(1, a), 0), 3);
	}

	static equals(a: HSLA, b: HSLA): boolean {
		return a.h === b.h && a.s === b.s && a.l === b.l && a.a === b.a;
	}

	/**
	 * Converts an RGB color value to HSL. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes r, g, and b are contained in the set [0, 255] and
	 * returns h in the set [0, 360], s, and l in the set [0, 1].
	 */
	static fromRGBA(rgba: RGBA): HSLA {
		const r = rgba.r / 255;
		const g = rgba.g / 255;
		const b = rgba.b / 255;
		const a = rgba.a;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h = 0;
		let s = 0;
		const l = (min + max) / 2;
		const chroma = max - min;

		if (chroma > 0) {
			s = Math.min((l <= 0.5 ? chroma / (2 * l) : chroma / (2 - (2 * l))), 1);

			switch (max) {
				case r: h = (g - b) / chroma + (g < b ? 6 : 0); break;
				case g: h = (b - r) / chroma + 2; break;
				case b: h = (r - g) / chroma + 4; break;
			}

			h *= 60;
			h = Math.round(h);
		}
		return new HSLA(h, s, l, a);
	}

	private static _hue2rgb(p: number, q: number, t: number): number {
		if (t < 0) {
			t += 1;
		}
		if (t > 1) {
			t -= 1;
		}
		if (t < 1 / 6) {
			return p + (q - p) * 6 * t;
		}
		if (t < 1 / 2) {
			return q;
		}
		if (t < 2 / 3) {
			return p + (q - p) * (2 / 3 - t) * 6;
		}
		return p;
	}

	/**
	 * Converts an HSL color value to RGB. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes h in the set [0, 360] s, and l are contained in the set [0, 1] and
	 * returns r, g, and b in the set [0, 255].
	 */
	static toRGBA(hsla: HSLA): RGBA {
		const h = hsla.h / 360;
		const { s, l, a } = hsla;
		let r: number, g: number, b: number;

		if (s === 0) {
			r = g = b = l; // achromatic
		} else {
			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;
			r = HSLA._hue2rgb(p, q, h + 1 / 3);
			g = HSLA._hue2rgb(p, q, h);
			b = HSLA._hue2rgb(p, q, h - 1 / 3);
		}

		return new RGBA(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a);
	}
}

export class HSVA {

	_hsvaBrand: void = undefined;

	/**
	 * Hue: integer in [0, 360]
	 */
	readonly h: number;

	/**
	 * Saturation: float in [0, 1]
	 */
	readonly s: number;

	/**
	 * Value: float in [0, 1]
	 */
	readonly v: number;

	/**
	 * Alpha: float in [0, 1]
	 */
	readonly a: number;

	constructor(h: number, s: number, v: number, a: number) {
		this.h = Math.max(Math.min(360, h), 0) | 0;
		this.s = roundFloat(Math.max(Math.min(1, s), 0), 3);
		this.v = roundFloat(Math.max(Math.min(1, v), 0), 3);
		this.a = roundFloat(Math.max(Math.min(1, a), 0), 3);
	}

	static equals(a: HSVA, b: HSVA): boolean {
		return a.h === b.h && a.s === b.s && a.v === b.v && a.a === b.a;
	}

	// from http://www.rapidtables.com/convert/color/rgb-to-hsv.htm
	static fromRGBA(rgba: RGBA): HSVA {
		const r = rgba.r / 255;
		const g = rgba.g / 255;
		const b = rgba.b / 255;
		const cmax = Math.max(r, g, b);
		const cmin = Math.min(r, g, b);
		const delta = cmax - cmin;
		const s = cmax === 0 ? 0 : (delta / cmax);
		let m: number;

		if (delta === 0) {
			m = 0;
		} else if (cmax === r) {
			m = ((((g - b) / delta) % 6) + 6) % 6;
		} else if (cmax === g) {
			m = ((b - r) / delta) + 2;
		} else {
			m = ((r - g) / delta) + 4;
		}

		return new HSVA(Math.round(m * 60), s, cmax, rgba.a);
	}

	// from http://www.rapidtables.com/convert/color/hsv-to-rgb.htm
	static toRGBA(hsva: HSVA): RGBA {
		const { h, s, v, a } = hsva;
		const c = v * s;
		const x = c * (1 - Math.abs((h / 60) % 2 - 1));
		const m = v - c;
		let [r, g, b] = [0, 0, 0];

		if (h < 60) {
			r = c;
			g = x;
		} else if (h < 120) {
			r = x;
			g = c;
		} else if (h < 180) {
			g = c;
			b = x;
		} else if (h < 240) {
			g = x;
			b = c;
		} else if (h < 300) {
			r = x;
			b = c;
		} else if (h <= 360) {
			r = c;
			b = x;
		}

		r = Math.round((r + m) * 255);
		g = Math.round((g + m) * 255);
		b = Math.round((b + m) * 255);

		return new RGBA(r, g, b, a);
	}
}

export class Color {

	static fromHex(hex: string): Color {
		return Color.Format.CSS.parseHex(hex) || Color.red;
	}

	readonly rgba: RGBA;
	private _hsla?: HSLA;
	get hsla(): HSLA {
		if (this._hsla) {
			return this._hsla;
		} else {
			return HSLA.fromRGBA(this.rgba);
		}
	}

	private _hsva?: HSVA;
	get hsva(): HSVA {
		if (this._hsva) {
			return this._hsva;
		}
		return HSVA.fromRGBA(this.rgba);
	}

	constructor(arg: RGBA | HSLA | HSVA) {
		if (!arg) {
			throw new Error('Color needs a value');
		} else if (arg instanceof RGBA) {
			this.rgba = arg;
		} else if (arg instanceof HSLA) {
			this._hsla = arg;
			this.rgba = HSLA.toRGBA(arg);
		} else if (arg instanceof HSVA) {
			this._hsva = arg;
			this.rgba = HSVA.toRGBA(arg);
		} else {
			throw new Error('Invalid color ctor argument');
		}
	}

	equals(other: Color | null): boolean {
		return !!other && RGBA.equals(this.rgba, other.rgba) && HSLA.equals(this.hsla, other.hsla) && HSVA.equals(this.hsva, other.hsva);
	}

	/**
	 * http://www.w3.org/TR/WCAG20/#relativeluminancedef
	 * Returns the number in the set [0, 1]. O => Darkest Black. 1 => Lightest white.
	 */
	getRelativeLuminance(): number {
		const R = Color._relativeLuminanceForComponent(this.rgba.r);
		const G = Color._relativeLuminanceForComponent(this.rgba.g);
		const B = Color._relativeLuminanceForComponent(this.rgba.b);
		const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;

		return roundFloat(luminance, 4);
	}

	private static _relativeLuminanceForComponent(color: number): number {
		const c = color / 255;
		return (c <= 0.03928) ? c / 12.92 : Math.pow(((c + 0.055) / 1.055), 2.4);
	}

	/**
	 * http://www.w3.org/TR/WCAG20/#contrast-ratiodef
	 * Returns the contrast ration number in the set [1, 21].
	 */
	getContrastRatio(another: Color): number {
		const lum1 = this.getRelativeLuminance();
		const lum2 = another.getRelativeLuminance();
		return lum1 > lum2 ? (lum1 + 0.05) / (lum2 + 0.05) : (lum2 + 0.05) / (lum1 + 0.05);
	}

	/**
	 *	http://24ways.org/2010/calculating-color-contrast
	 *  Return 'true' if darker color otherwise 'false'
	 */
	isDarker(): boolean {
		const yiq = (this.rgba.r * 299 + this.rgba.g * 587 + this.rgba.b * 114) / 1000;
		return yiq < 128;
	}

	/**
	 *	http://24ways.org/2010/calculating-color-contrast
	 *  Return 'true' if lighter color otherwise 'false'
	 */
	isLighter(): boolean {
		const yiq = (this.rgba.r * 299 + this.rgba.g * 587 + this.rgba.b * 114) / 1000;
		return yiq >= 128;
	}

	isLighterThan(another: Color): boolean {
		const lum1 = this.getRelativeLuminance();
		const lum2 = another.getRelativeLuminance();
		return lum1 > lum2;
	}

	isDarkerThan(another: Color): boolean {
		const lum1 = this.getRelativeLuminance();
		const lum2 = another.getRelativeLuminance();
		return lum1 < lum2;
	}

	lighten(factor: number): Color {
		return new Color(new HSLA(this.hsla.h, this.hsla.s, this.hsla.l + this.hsla.l * factor, this.hsla.a));
	}

	darken(factor: number): Color {
		return new Color(new HSLA(this.hsla.h, this.hsla.s, this.hsla.l - this.hsla.l * factor, this.hsla.a));
	}

	transparent(factor: number): Color {
		const { r, g, b, a } = this.rgba;
		return new Color(new RGBA(r, g, b, a * factor));
	}

	isTransparent(): boolean {
		return this.rgba.a === 0;
	}

	isOpaque(): boolean {
		return this.rgba.a === 1;
	}

	opposite(): Color {
		return new Color(new RGBA(255 - this.rgba.r, 255 - this.rgba.g, 255 - this.rgba.b, this.rgba.a));
	}

	blend(c: Color): Color {
		const rgba = c.rgba;

		// Convert to 0..1 opacity
		const thisA = this.rgba.a;
		const colorA = rgba.a;

		const a = thisA + colorA * (1 - thisA);
		if (a < 1e-6) {
			return Color.transparent;
		}

		const r = this.rgba.r * thisA / a + rgba.r * colorA * (1 - thisA) / a;
		const g = this.rgba.g * thisA / a + rgba.g * colorA * (1 - thisA) / a;
		const b = this.rgba.b * thisA / a + rgba.b * colorA * (1 - thisA) / a;

		return new Color(new RGBA(r, g, b, a));
	}

	makeOpaque(opaqueBackground: Color): Color {
		if (this.isOpaque() || opaqueBackground.rgba.a !== 1) {
			// only allow to blend onto a non-opaque color onto a opaque color
			return this;
		}

		const { r, g, b, a } = this.rgba;

		// https://stackoverflow.com/questions/12228548/finding-equivalent-color-with-opacity
		return new Color(new RGBA(
			opaqueBackground.rgba.r - a * (opaqueBackground.rgba.r - r),
			opaqueBackground.rgba.g - a * (opaqueBackground.rgba.g - g),
			opaqueBackground.rgba.b - a * (opaqueBackground.rgba.b - b),
			1
		));
	}

	flatten(...backgrounds: Color[]): Color {
		const background = backgrounds.reduceRight((accumulator, color) => {
			return Color._flatten(color, accumulator);
		});
		return Color._flatten(this, background);
	}

	private static _flatten(foreground: Color, background: Color) {
		const backgroundAlpha = 1 - foreground.rgba.a;
		return new Color(new RGBA(
			backgroundAlpha * background.rgba.r + foreground.rgba.a * foreground.rgba.r,
			backgroundAlpha * background.rgba.g + foreground.rgba.a * foreground.rgba.g,
			backgroundAlpha * background.rgba.b + foreground.rgba.a * foreground.rgba.b
		));
	}

	private _toString?: string;
	toString(): string {
		this._toString ??= Color.Format.CSS.format(this);
		return this._toString;
	}

	static getLighterColor(of: Color, relative: Color, factor?: number): Color {
		if (of.isLighterThan(relative)) {
			return of;
		}
		factor = factor ? factor : 0.5;
		const lum1 = of.getRelativeLuminance();
		const lum2 = relative.getRelativeLuminance();
		factor = factor * (lum2 - lum1) / lum2;
		return of.lighten(factor);
	}

	static getDarkerColor(of: Color, relative: Color, factor?: number): Color {
		if (of.isDarkerThan(relative)) {
			return of;
		}
		factor = factor ? factor : 0.5;
		const lum1 = of.getRelativeLuminance();
		const lum2 = relative.getRelativeLuminance();
		factor = factor * (lum1 - lum2) / lum1;
		return of.darken(factor);
	}

	static readonly white = new Color(new RGBA(255, 255, 255, 1));
	static readonly black = new Color(new RGBA(0, 0, 0, 1));
	static readonly red = new Color(new RGBA(255, 0, 0, 1));
	static readonly blue = new Color(new RGBA(0, 0, 255, 1));
	static readonly green = new Color(new RGBA(0, 255, 0, 1));
	static readonly cyan = new Color(new RGBA(0, 255, 255, 1));
	static readonly lightgrey = new Color(new RGBA(211, 211, 211, 1));
	static readonly transparent = new Color(new RGBA(0, 0, 0, 0));
}

export namespace Color {
	export namespace Format {
		export namespace CSS {

			export function formatRGB(color: Color): string {
				if (color.rgba.a === 1) {
					return `rgb(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b})`;
				}

				return Color.Format.CSS.formatRGBA(color);
			}

			export function formatRGBA(color: Color): string {
				return `rgba(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b}, ${+(color.rgba.a).toFixed(2)})`;
			}

			export function formatHSL(color: Color): string {
				if (color.hsla.a === 1) {
					return `hsl(${color.hsla.h}, ${(color.hsla.s * 100).toFixed(2)}%, ${(color.hsla.l * 100).toFixed(2)}%)`;
				}

				return Color.Format.CSS.formatHSLA(color);
			}

			export function formatHSLA(color: Color): string {
				return `hsla(${color.hsla.h}, ${(color.hsla.s * 100).toFixed(2)}%, ${(color.hsla.l * 100).toFixed(2)}%, ${color.hsla.a.toFixed(2)})`;
			}

			function _toTwoDigitHex(n: number): string {
				const r = n.toString(16);
				return r.length !== 2 ? '0' + r : r;
			}

			/**
			 * Formats the color as #RRGGBB
			 */
			export function formatHex(color: Color): string {
				return `#${_toTwoDigitHex(color.rgba.r)}${_toTwoDigitHex(color.rgba.g)}${_toTwoDigitHex(color.rgba.b)}`;
			}

			/**
			 * Formats the color as #RRGGBBAA
			 * If 'compact' is set, colors without transparancy will be printed as #RRGGBB
			 */
			export function formatHexA(color: Color, compact = false): string {
				if (compact && color.rgba.a === 1) {
					return Color.Format.CSS.formatHex(color);
				}

				return `#${_toTwoDigitHex(color.rgba.r)}${_toTwoDigitHex(color.rgba.g)}${_toTwoDigitHex(color.rgba.b)}${_toTwoDigitHex(Math.round(color.rgba.a * 255))}`;
			}

			/**
			 * The default format will use HEX if opaque and RGBA otherwise.
			 */
			export function format(color: Color): string {
				if (color.isOpaque()) {
					return Color.Format.CSS.formatHex(color);
				}

				return Color.Format.CSS.formatRGBA(color);
			}

			/**
			 * Converts an Hex color value to a Color.
			 * returns r, g, and b are contained in the set [0, 255]
			 * @param hex string (#RGB, #RGBA, #RRGGBB or #RRGGBBAA).
			 */
			export function parseHex(hex: string): Color | null {
				const length = hex.length;

				if (length === 0) {
					// Invalid color
					return null;
				}

				if (hex.charCodeAt(0) !== CharCode.Hash) {
					// Does not begin with a #
					return null;
				}

				if (length === 7) {
					// #RRGGBB format
					const r = 16 * _parseHexDigit(hex.charCodeAt(1)) + _parseHexDigit(hex.charCodeAt(2));
					const g = 16 * _parseHexDigit(hex.charCodeAt(3)) + _parseHexDigit(hex.charCodeAt(4));
					const b = 16 * _parseHexDigit(hex.charCodeAt(5)) + _parseHexDigit(hex.charCodeAt(6));
					return new Color(new RGBA(r, g, b, 1));
				}

				if (length === 9) {
					// #RRGGBBAA format
					const r = 16 * _parseHexDigit(hex.charCodeAt(1)) + _parseHexDigit(hex.charCodeAt(2));
					const g = 16 * _parseHexDigit(hex.charCodeAt(3)) + _parseHexDigit(hex.charCodeAt(4));
					const b = 16 * _parseHexDigit(hex.charCodeAt(5)) + _parseHexDigit(hex.charCodeAt(6));
					const a = 16 * _parseHexDigit(hex.charCodeAt(7)) + _parseHexDigit(hex.charCodeAt(8));
					return new Color(new RGBA(r, g, b, a / 255));
				}

				if (length === 4) {
					// #RGB format
					const r = _parseHexDigit(hex.charCodeAt(1));
					const g = _parseHexDigit(hex.charCodeAt(2));
					const b = _parseHexDigit(hex.charCodeAt(3));
					return new Color(new RGBA(16 * r + r, 16 * g + g, 16 * b + b));
				}

				if (length === 5) {
					// #RGBA format
					const r = _parseHexDigit(hex.charCodeAt(1));
					const g = _parseHexDigit(hex.charCodeAt(2));
					const b = _parseHexDigit(hex.charCodeAt(3));
					const a = _parseHexDigit(hex.charCodeAt(4));
					return new Color(new RGBA(16 * r + r, 16 * g + g, 16 * b + b, (16 * a + a) / 255));
				}

				// Invalid color
				return null;
			}

			function _parseHexDigit(charCode: CharCode): number {
				switch (charCode) {
					case CharCode.Digit0: return 0;
					case CharCode.Digit1: return 1;
					case CharCode.Digit2: return 2;
					case CharCode.Digit3: return 3;
					case CharCode.Digit4: return 4;
					case CharCode.Digit5: return 5;
					case CharCode.Digit6: return 6;
					case CharCode.Digit7: return 7;
					case CharCode.Digit8: return 8;
					case CharCode.Digit9: return 9;
					case CharCode.a: return 10;
					case CharCode.A: return 10;
					case CharCode.b: return 11;
					case CharCode.B: return 11;
					case CharCode.c: return 12;
					case CharCode.C: return 12;
					case CharCode.d: return 13;
					case CharCode.D: return 13;
					case CharCode.e: return 14;
					case CharCode.E: return 14;
					case CharCode.f: return 15;
					case CharCode.F: return 15;
				}
				return 0;
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/notebook-renderers/src/colorMap.ts]---
Location: vscode-main/extensions/notebook-renderers/src/colorMap.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const ansiColorIdentifiers: { colorName: string; colorValue: string }[] = [];
export const ansiColorMap: { [key: string]: { index: number } } = {
	'terminal.ansiBlack': {
		index: 0,
	},
	'terminal.ansiRed': {
		index: 1,
	},
	'terminal.ansiGreen': {
		index: 2,
	},
	'terminal.ansiYellow': {
		index: 3,
	},
	'terminal.ansiBlue': {
		index: 4,
	},
	'terminal.ansiMagenta': {
		index: 5,
	},
	'terminal.ansiCyan': {
		index: 6,
	},
	'terminal.ansiWhite': {
		index: 7,
	},
	'terminal.ansiBrightBlack': {
		index: 8,
	},
	'terminal.ansiBrightRed': {
		index: 9,
	},
	'terminal.ansiBrightGreen': {
		index: 10,
	},
	'terminal.ansiBrightYellow': {
		index: 11,
	},
	'terminal.ansiBrightBlue': {
		index: 12,
	},
	'terminal.ansiBrightMagenta': {
		index: 13,
	},
	'terminal.ansiBrightCyan': {
		index: 14,
	},
	'terminal.ansiBrightWhite': {
		index: 15,
	}
};

for (const id in ansiColorMap) {
	const entry = ansiColorMap[id];
	const colorName = id.substring(13);
	ansiColorIdentifiers[entry.index] = { colorName, colorValue: 'var(--vscode-' + id.replace('.', '-') + ')' };
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/notebook-renderers/src/htmlHelper.ts]---
Location: vscode-main/extensions/notebook-renderers/src/htmlHelper.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const ttPolicy = (typeof window !== 'undefined') ?
	(window as Window & { trustedTypes?: any }).trustedTypes?.createPolicy('notebookRenderer', {
		createHTML: (value: string) => value,
		createScript: (value: string) => value,
	}) : undefined;
```

--------------------------------------------------------------------------------

````

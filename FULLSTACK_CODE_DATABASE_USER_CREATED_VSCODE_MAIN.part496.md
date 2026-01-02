---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 496
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 496 of 552)

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

---[FILE: src/vs/workbench/services/authentication/browser/authenticationQueryService.ts]---
Location: vscode-main/src/vs/workbench/services/authentication/browser/authenticationQueryService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { AuthenticationSessionAccount, IAuthenticationService, IAuthenticationExtensionsService, INTERNAL_AUTH_PROVIDER_PREFIX } from '../common/authentication.js';
import {
	IAuthenticationQueryService,
	IProviderQuery,
	IAccountQuery,
	IAccountExtensionQuery,
	IAccountMcpServerQuery,
	IAccountExtensionsQuery,
	IAccountMcpServersQuery,
	IAccountEntitiesQuery,
	IProviderExtensionQuery,
	IProviderMcpServerQuery,
	IExtensionQuery,
	IMcpServerQuery,
	IActiveEntities,
	IAuthenticationUsageStats,
	IBaseQuery
} from '../common/authenticationQuery.js';
import { IAuthenticationUsageService } from './authenticationUsageService.js';
import { IAuthenticationMcpUsageService } from './authenticationMcpUsageService.js';
import { IAuthenticationAccessService } from './authenticationAccessService.js';
import { IAuthenticationMcpAccessService } from './authenticationMcpAccessService.js';
import { IAuthenticationMcpService } from './authenticationMcpService.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';

/**
 * Base implementation for query interfaces
 */
abstract class BaseQuery implements IBaseQuery {
	constructor(
		public readonly providerId: string,
		protected readonly queryService: AuthenticationQueryService
	) { }
}

/**
 * Implementation of account-extension query operations
 */
class AccountExtensionQuery extends BaseQuery implements IAccountExtensionQuery {
	constructor(
		providerId: string,
		public readonly accountName: string,
		public readonly extensionId: string,
		queryService: AuthenticationQueryService
	) {
		super(providerId, queryService);
	}

	isAccessAllowed(): boolean | undefined {
		return this.queryService.authenticationAccessService.isAccessAllowed(this.providerId, this.accountName, this.extensionId);
	}

	setAccessAllowed(allowed: boolean, extensionName?: string): void {
		this.queryService.authenticationAccessService.updateAllowedExtensions(
			this.providerId,
			this.accountName,
			[{ id: this.extensionId, name: extensionName || this.extensionId, allowed }]
		);
	}

	addUsage(scopes: readonly string[], extensionName: string): void {
		this.queryService.authenticationUsageService.addAccountUsage(
			this.providerId,
			this.accountName,
			scopes,
			this.extensionId,
			extensionName
		);
	}

	getUsage(): {
		readonly extensionId: string;
		readonly extensionName: string;
		readonly scopes: readonly string[];
		readonly lastUsed: number;
	}[] {
		const allUsages = this.queryService.authenticationUsageService.readAccountUsages(this.providerId, this.accountName);
		return allUsages
			.filter(usage => usage.extensionId === ExtensionIdentifier.toKey(this.extensionId))
			.map(usage => ({
				extensionId: usage.extensionId,
				extensionName: usage.extensionName,
				scopes: usage.scopes || [],
				lastUsed: usage.lastUsed
			}));
	}

	removeUsage(): void {
		// Get current usages, filter out this extension, and store the rest
		const allUsages = this.queryService.authenticationUsageService.readAccountUsages(this.providerId, this.accountName);
		const filteredUsages = allUsages.filter(usage => usage.extensionId !== this.extensionId);

		// Clear all usages and re-add the filtered ones
		this.queryService.authenticationUsageService.removeAccountUsage(this.providerId, this.accountName);
		for (const usage of filteredUsages) {
			this.queryService.authenticationUsageService.addAccountUsage(
				this.providerId,
				this.accountName,
				usage.scopes || [],
				usage.extensionId,
				usage.extensionName
			);
		}
	}

	setAsPreferred(): void {
		this.queryService.authenticationExtensionsService.updateAccountPreference(
			this.extensionId,
			this.providerId,
			{ label: this.accountName, id: this.accountName }
		);
	}

	isPreferred(): boolean {
		const preferredAccount = this.queryService.authenticationExtensionsService.getAccountPreference(this.extensionId, this.providerId);
		return preferredAccount === this.accountName;
	}

	isTrusted(): boolean {
		const allowedExtensions = this.queryService.authenticationAccessService.readAllowedExtensions(this.providerId, this.accountName);
		const extension = allowedExtensions.find(ext => ext.id === this.extensionId);
		return extension?.trusted === true;
	}
}

/**
 * Implementation of account-MCP server query operations
 */
class AccountMcpServerQuery extends BaseQuery implements IAccountMcpServerQuery {
	constructor(
		providerId: string,
		public readonly accountName: string,
		public readonly mcpServerId: string,
		queryService: AuthenticationQueryService
	) {
		super(providerId, queryService);
	}

	isAccessAllowed(): boolean | undefined {
		return this.queryService.authenticationMcpAccessService.isAccessAllowed(this.providerId, this.accountName, this.mcpServerId);
	}

	setAccessAllowed(allowed: boolean, mcpServerName?: string): void {
		this.queryService.authenticationMcpAccessService.updateAllowedMcpServers(
			this.providerId,
			this.accountName,
			[{ id: this.mcpServerId, name: mcpServerName || this.mcpServerId, allowed }]
		);
	}

	addUsage(scopes: readonly string[], mcpServerName: string): void {
		this.queryService.authenticationMcpUsageService.addAccountUsage(
			this.providerId,
			this.accountName,
			scopes,
			this.mcpServerId,
			mcpServerName
		);
	}

	getUsage(): {
		readonly mcpServerId: string;
		readonly mcpServerName: string;
		readonly scopes: readonly string[];
		readonly lastUsed: number;
	}[] {
		const allUsages = this.queryService.authenticationMcpUsageService.readAccountUsages(this.providerId, this.accountName);
		return allUsages
			.filter(usage => usage.mcpServerId === this.mcpServerId)
			.map(usage => ({
				mcpServerId: usage.mcpServerId,
				mcpServerName: usage.mcpServerName,
				scopes: usage.scopes || [],
				lastUsed: usage.lastUsed
			}));
	}

	removeUsage(): void {
		// Get current usages, filter out this MCP server, and store the rest
		const allUsages = this.queryService.authenticationMcpUsageService.readAccountUsages(this.providerId, this.accountName);
		const filteredUsages = allUsages.filter(usage => usage.mcpServerId !== this.mcpServerId);

		// Clear all usages and re-add the filtered ones
		this.queryService.authenticationMcpUsageService.removeAccountUsage(this.providerId, this.accountName);
		for (const usage of filteredUsages) {
			this.queryService.authenticationMcpUsageService.addAccountUsage(
				this.providerId,
				this.accountName,
				usage.scopes || [],
				usage.mcpServerId,
				usage.mcpServerName
			);
		}
	}

	setAsPreferred(): void {
		this.queryService.authenticationMcpService.updateAccountPreference(
			this.mcpServerId,
			this.providerId,
			{ label: this.accountName, id: this.accountName }
		);
	}

	isPreferred(): boolean {
		const preferredAccount = this.queryService.authenticationMcpService.getAccountPreference(this.mcpServerId, this.providerId);
		return preferredAccount === this.accountName;
	}

	isTrusted(): boolean {
		const allowedMcpServers = this.queryService.authenticationMcpAccessService.readAllowedMcpServers(this.providerId, this.accountName);
		const mcpServer = allowedMcpServers.find(server => server.id === this.mcpServerId);
		return mcpServer?.trusted === true;
	}
}

/**
 * Implementation of account-extensions query operations
 */
class AccountExtensionsQuery extends BaseQuery implements IAccountExtensionsQuery {
	constructor(
		providerId: string,
		public readonly accountName: string,
		queryService: AuthenticationQueryService
	) {
		super(providerId, queryService);
	}

	getAllowedExtensions(): { id: string; name: string; allowed?: boolean; lastUsed?: number; trusted?: boolean }[] {
		const allowedExtensions = this.queryService.authenticationAccessService.readAllowedExtensions(this.providerId, this.accountName);
		const usages = this.queryService.authenticationUsageService.readAccountUsages(this.providerId, this.accountName);

		return allowedExtensions
			.filter(ext => ext.allowed !== false)
			.map(ext => {
				// Find the most recent usage for this extension
				const extensionUsages = usages.filter(usage => usage.extensionId === ext.id);
				const lastUsed = extensionUsages.length > 0 ? Math.max(...extensionUsages.map(u => u.lastUsed)) : undefined;

				// Check if trusted through the extension query
				const extensionQuery = new AccountExtensionQuery(this.providerId, this.accountName, ext.id, this.queryService);
				const trusted = extensionQuery.isTrusted();

				return {
					id: ext.id,
					name: ext.name,
					allowed: ext.allowed,
					lastUsed,
					trusted
				};
			});
	}

	allowAccess(extensionIds: string[]): void {
		const extensionsToAllow = extensionIds.map(id => ({ id, name: id, allowed: true }));
		this.queryService.authenticationAccessService.updateAllowedExtensions(this.providerId, this.accountName, extensionsToAllow);
	}

	removeAccess(extensionIds: string[]): void {
		const extensionsToRemove = extensionIds.map(id => ({ id, name: id, allowed: false }));
		this.queryService.authenticationAccessService.updateAllowedExtensions(this.providerId, this.accountName, extensionsToRemove);
	}

	forEach(callback: (extensionQuery: IAccountExtensionQuery) => void): void {
		const usages = this.queryService.authenticationUsageService.readAccountUsages(this.providerId, this.accountName);
		const allowedExtensions = this.queryService.authenticationAccessService.readAllowedExtensions(this.providerId, this.accountName);

		// Combine extensions from both usage and access data
		const extensionIds = new Set<string>();
		usages.forEach(usage => extensionIds.add(usage.extensionId));
		allowedExtensions.forEach(ext => extensionIds.add(ext.id));

		for (const extensionId of extensionIds) {
			const extensionQuery = new AccountExtensionQuery(this.providerId, this.accountName, extensionId, this.queryService);
			callback(extensionQuery);
		}
	}
}

/**
 * Implementation of account-MCP servers query operations
 */
class AccountMcpServersQuery extends BaseQuery implements IAccountMcpServersQuery {
	constructor(
		providerId: string,
		public readonly accountName: string,
		queryService: AuthenticationQueryService
	) {
		super(providerId, queryService);
	}

	getAllowedMcpServers(): { id: string; name: string; allowed?: boolean; lastUsed?: number; trusted?: boolean }[] {
		return this.queryService.authenticationMcpAccessService.readAllowedMcpServers(this.providerId, this.accountName)
			.filter(server => server.allowed !== false);
	}

	allowAccess(mcpServerIds: string[]): void {
		const mcpServersToAllow = mcpServerIds.map(id => ({ id, name: id, allowed: true }));
		this.queryService.authenticationMcpAccessService.updateAllowedMcpServers(this.providerId, this.accountName, mcpServersToAllow);
	}

	removeAccess(mcpServerIds: string[]): void {
		const mcpServersToRemove = mcpServerIds.map(id => ({ id, name: id, allowed: false }));
		this.queryService.authenticationMcpAccessService.updateAllowedMcpServers(this.providerId, this.accountName, mcpServersToRemove);
	}

	forEach(callback: (mcpServerQuery: IAccountMcpServerQuery) => void): void {
		const usages = this.queryService.authenticationMcpUsageService.readAccountUsages(this.providerId, this.accountName);
		const allowedMcpServers = this.queryService.authenticationMcpAccessService.readAllowedMcpServers(this.providerId, this.accountName);

		// Combine MCP servers from both usage and access data
		const mcpServerIds = new Set<string>();
		usages.forEach(usage => mcpServerIds.add(usage.mcpServerId));
		allowedMcpServers.forEach(server => mcpServerIds.add(server.id));

		for (const mcpServerId of mcpServerIds) {
			const mcpServerQuery = new AccountMcpServerQuery(this.providerId, this.accountName, mcpServerId, this.queryService);
			callback(mcpServerQuery);
		}
	}
}

/**
 * Implementation of account-entities query operations for type-agnostic operations
 */
class AccountEntitiesQuery extends BaseQuery implements IAccountEntitiesQuery {
	constructor(
		providerId: string,
		public readonly accountName: string,
		queryService: AuthenticationQueryService
	) {
		super(providerId, queryService);
	}

	hasAnyUsage(): boolean {
		// Check extension usage
		const extensionUsages = this.queryService.authenticationUsageService.readAccountUsages(this.providerId, this.accountName);
		if (extensionUsages.length > 0) {
			return true;
		}

		// Check MCP server usage
		const mcpUsages = this.queryService.authenticationMcpUsageService.readAccountUsages(this.providerId, this.accountName);
		if (mcpUsages.length > 0) {
			return true;
		}

		// Check extension access
		const allowedExtensions = this.queryService.authenticationAccessService.readAllowedExtensions(this.providerId, this.accountName);
		if (allowedExtensions.some(ext => ext.allowed !== false)) {
			return true;
		}

		// Check MCP server access
		const allowedMcpServers = this.queryService.authenticationMcpAccessService.readAllowedMcpServers(this.providerId, this.accountName);
		if (allowedMcpServers.some(server => server.allowed !== false)) {
			return true;
		}

		return false;
	}

	getEntityCount(): { extensions: number; mcpServers: number; total: number } {
		// Use the same logic as getAllEntities to count all entities with usage or access
		const extensionUsages = this.queryService.authenticationUsageService.readAccountUsages(this.providerId, this.accountName);
		const allowedExtensions = this.queryService.authenticationAccessService.readAllowedExtensions(this.providerId, this.accountName).filter(ext => ext.allowed);
		const extensionIds = new Set<string>();
		extensionUsages.forEach(usage => extensionIds.add(usage.extensionId));
		allowedExtensions.forEach(ext => extensionIds.add(ext.id));

		const mcpUsages = this.queryService.authenticationMcpUsageService.readAccountUsages(this.providerId, this.accountName);
		const allowedMcpServers = this.queryService.authenticationMcpAccessService.readAllowedMcpServers(this.providerId, this.accountName).filter(server => server.allowed);
		const mcpServerIds = new Set<string>();
		mcpUsages.forEach(usage => mcpServerIds.add(usage.mcpServerId));
		allowedMcpServers.forEach(server => mcpServerIds.add(server.id));

		const extensionCount = extensionIds.size;
		const mcpServerCount = mcpServerIds.size;

		return {
			extensions: extensionCount,
			mcpServers: mcpServerCount,
			total: extensionCount + mcpServerCount
		};
	}

	removeAllAccess(): void {
		// Remove all extension access
		const extensionsQuery = new AccountExtensionsQuery(this.providerId, this.accountName, this.queryService);
		const extensions = extensionsQuery.getAllowedExtensions();
		const extensionIds = extensions.map(ext => ext.id);
		if (extensionIds.length > 0) {
			extensionsQuery.removeAccess(extensionIds);
		}

		// Remove all MCP server access
		const mcpServersQuery = new AccountMcpServersQuery(this.providerId, this.accountName, this.queryService);
		const mcpServers = mcpServersQuery.getAllowedMcpServers();
		const mcpServerIds = mcpServers.map(server => server.id);
		if (mcpServerIds.length > 0) {
			mcpServersQuery.removeAccess(mcpServerIds);
		}
	}

	forEach(callback: (entityId: string, entityType: 'extension' | 'mcpServer') => void): void {
		// Iterate over extensions
		const extensionsQuery = new AccountExtensionsQuery(this.providerId, this.accountName, this.queryService);
		extensionsQuery.forEach(extensionQuery => {
			callback(extensionQuery.extensionId, 'extension');
		});

		// Iterate over MCP servers
		const mcpServersQuery = new AccountMcpServersQuery(this.providerId, this.accountName, this.queryService);
		mcpServersQuery.forEach(mcpServerQuery => {
			callback(mcpServerQuery.mcpServerId, 'mcpServer');
		});
	}
}

/**
 * Implementation of account query operations
 */
class AccountQuery extends BaseQuery implements IAccountQuery {
	constructor(
		providerId: string,
		public readonly accountName: string,
		queryService: AuthenticationQueryService
	) {
		super(providerId, queryService);
	}

	extension(extensionId: string): IAccountExtensionQuery {
		return new AccountExtensionQuery(this.providerId, this.accountName, extensionId, this.queryService);
	}

	mcpServer(mcpServerId: string): IAccountMcpServerQuery {
		return new AccountMcpServerQuery(this.providerId, this.accountName, mcpServerId, this.queryService);
	}

	extensions(): IAccountExtensionsQuery {
		return new AccountExtensionsQuery(this.providerId, this.accountName, this.queryService);
	}

	mcpServers(): IAccountMcpServersQuery {
		return new AccountMcpServersQuery(this.providerId, this.accountName, this.queryService);
	}

	entities(): IAccountEntitiesQuery {
		return new AccountEntitiesQuery(this.providerId, this.accountName, this.queryService);
	}

	remove(): void {
		// Remove all extension access and usage data
		this.queryService.authenticationAccessService.removeAllowedExtensions(this.providerId, this.accountName);
		this.queryService.authenticationUsageService.removeAccountUsage(this.providerId, this.accountName);

		// Remove all MCP server access and usage data
		this.queryService.authenticationMcpAccessService.removeAllowedMcpServers(this.providerId, this.accountName);
		this.queryService.authenticationMcpUsageService.removeAccountUsage(this.providerId, this.accountName);
	}
}

/**
 * Implementation of provider-extension query operations
 */
class ProviderExtensionQuery extends BaseQuery implements IProviderExtensionQuery {
	constructor(
		providerId: string,
		public readonly extensionId: string,
		queryService: AuthenticationQueryService
	) {
		super(providerId, queryService);
	}

	getPreferredAccount(): string | undefined {
		return this.queryService.authenticationExtensionsService.getAccountPreference(this.extensionId, this.providerId);
	}

	setPreferredAccount(account: AuthenticationSessionAccount): void {
		this.queryService.authenticationExtensionsService.updateAccountPreference(this.extensionId, this.providerId, account);
	}

	removeAccountPreference(): void {
		this.queryService.authenticationExtensionsService.removeAccountPreference(this.extensionId, this.providerId);
	}
}

/**
 * Implementation of provider-MCP server query operations
 */
class ProviderMcpServerQuery extends BaseQuery implements IProviderMcpServerQuery {
	constructor(
		providerId: string,
		public readonly mcpServerId: string,
		queryService: AuthenticationQueryService
	) {
		super(providerId, queryService);
	}

	async getLastUsedAccount(): Promise<string | undefined> {
		try {
			const accounts = await this.queryService.authenticationService.getAccounts(this.providerId);
			let lastUsedAccount: string | undefined;
			let lastUsedTime = 0;

			for (const account of accounts) {
				const usages = this.queryService.authenticationMcpUsageService.readAccountUsages(this.providerId, account.label);
				const mcpServerUsages = usages.filter(usage => usage.mcpServerId === this.mcpServerId);

				for (const usage of mcpServerUsages) {
					if (usage.lastUsed > lastUsedTime) {
						lastUsedTime = usage.lastUsed;
						lastUsedAccount = account.label;
					}
				}
			}

			return lastUsedAccount;
		} catch {
			return undefined;
		}
	}

	getPreferredAccount(): string | undefined {
		return this.queryService.authenticationMcpService.getAccountPreference(this.mcpServerId, this.providerId);
	}

	setPreferredAccount(account: AuthenticationSessionAccount): void {
		this.queryService.authenticationMcpService.updateAccountPreference(this.mcpServerId, this.providerId, account);
	}

	removeAccountPreference(): void {
		this.queryService.authenticationMcpService.removeAccountPreference(this.mcpServerId, this.providerId);
	}

	async getUsedAccounts(): Promise<string[]> {
		try {
			const accounts = await this.queryService.authenticationService.getAccounts(this.providerId);
			const usedAccounts: string[] = [];

			for (const account of accounts) {
				const usages = this.queryService.authenticationMcpUsageService.readAccountUsages(this.providerId, account.label);
				if (usages.some(usage => usage.mcpServerId === this.mcpServerId)) {
					usedAccounts.push(account.label);
				}
			}

			return usedAccounts;
		} catch {
			return [];
		}
	}
}

/**
 * Implementation of provider query operations
 */
class ProviderQuery extends BaseQuery implements IProviderQuery {
	constructor(
		providerId: string,
		queryService: AuthenticationQueryService
	) {
		super(providerId, queryService);
	}

	account(accountName: string): IAccountQuery {
		return new AccountQuery(this.providerId, accountName, this.queryService);
	}

	extension(extensionId: string): IProviderExtensionQuery {
		return new ProviderExtensionQuery(this.providerId, extensionId, this.queryService);
	}

	mcpServer(mcpServerId: string): IProviderMcpServerQuery {
		return new ProviderMcpServerQuery(this.providerId, mcpServerId, this.queryService);
	}

	async getActiveEntities(): Promise<IActiveEntities> {
		const extensions: string[] = [];
		const mcpServers: string[] = [];

		try {
			const accounts = await this.queryService.authenticationService.getAccounts(this.providerId);

			for (const account of accounts) {
				// Get extension usages
				const extensionUsages = this.queryService.authenticationUsageService.readAccountUsages(this.providerId, account.label);
				for (const usage of extensionUsages) {
					if (!extensions.includes(usage.extensionId)) {
						extensions.push(usage.extensionId);
					}
				}

				// Get MCP server usages
				const mcpUsages = this.queryService.authenticationMcpUsageService.readAccountUsages(this.providerId, account.label);
				for (const usage of mcpUsages) {
					if (!mcpServers.includes(usage.mcpServerId)) {
						mcpServers.push(usage.mcpServerId);
					}
				}
			}
		} catch {
			// Return empty arrays if there's an error
		}

		return { extensions, mcpServers };
	}

	async getAccountNames(): Promise<string[]> {
		try {
			const accounts = await this.queryService.authenticationService.getAccounts(this.providerId);
			return accounts.map(account => account.label);
		} catch {
			return [];
		}
	}

	async getUsageStats(): Promise<IAuthenticationUsageStats> {
		const recentActivity: { accountName: string; lastUsed: number; usageCount: number }[] = [];
		let totalSessions = 0;
		let totalAccounts = 0;

		try {
			const accounts = await this.queryService.authenticationService.getAccounts(this.providerId);
			totalAccounts = accounts.length;

			for (const account of accounts) {
				const extensionUsages = this.queryService.authenticationUsageService.readAccountUsages(this.providerId, account.label);
				const mcpUsages = this.queryService.authenticationMcpUsageService.readAccountUsages(this.providerId, account.label);

				const allUsages = [...extensionUsages, ...mcpUsages];
				const usageCount = allUsages.length;
				const lastUsed = Math.max(...allUsages.map(u => u.lastUsed), 0);

				if (usageCount > 0) {
					recentActivity.push({ accountName: account.label, lastUsed, usageCount });
				}
			}

			// Sort by most recent activity
			recentActivity.sort((a, b) => b.lastUsed - a.lastUsed);

			// Count total sessions (approximate)
			totalSessions = recentActivity.reduce((sum, activity) => sum + activity.usageCount, 0);
		} catch {
			// Return default stats if there's an error
		}

		return { totalSessions, totalAccounts, recentActivity };
	}

	async forEachAccount(callback: (accountQuery: IAccountQuery) => void): Promise<void> {
		try {
			const accounts = await this.queryService.authenticationService.getAccounts(this.providerId);
			for (const account of accounts) {
				const accountQuery = new AccountQuery(this.providerId, account.label, this.queryService);
				callback(accountQuery);
			}
		} catch {
			// Silently handle errors in enumeration
		}
	}
}

/**
 * Implementation of extension query operations (cross-provider)
 */
class ExtensionQuery implements IExtensionQuery {
	constructor(
		public readonly extensionId: string,
		private readonly queryService: AuthenticationQueryService
	) { }

	async getProvidersWithAccess(includeInternal?: boolean): Promise<string[]> {
		const providersWithAccess: string[] = [];
		const providerIds = this.queryService.authenticationService.getProviderIds();

		for (const providerId of providerIds) {
			// Skip internal providers unless explicitly requested
			if (!includeInternal && providerId.startsWith(INTERNAL_AUTH_PROVIDER_PREFIX)) {
				continue;
			}

			try {
				const accounts = await this.queryService.authenticationService.getAccounts(providerId);
				const hasAccess = accounts.some(account => {
					const accessAllowed = this.queryService.authenticationAccessService.isAccessAllowed(providerId, account.label, this.extensionId);
					return accessAllowed === true;
				});

				if (hasAccess) {
					providersWithAccess.push(providerId);
				}
			} catch {
				// Skip providers that error
			}
		}

		return providersWithAccess;
	}

	getAllAccountPreferences(includeInternal?: boolean): Map<string, string> {
		const preferences = new Map<string, string>();
		const providerIds = this.queryService.authenticationService.getProviderIds();

		for (const providerId of providerIds) {
			// Skip internal providers unless explicitly requested
			if (!includeInternal && providerId.startsWith(INTERNAL_AUTH_PROVIDER_PREFIX)) {
				continue;
			}

			const preferredAccount = this.queryService.authenticationExtensionsService.getAccountPreference(this.extensionId, providerId);
			if (preferredAccount) {
				preferences.set(providerId, preferredAccount);
			}
		}

		return preferences;
	}

	provider(providerId: string): IProviderExtensionQuery {
		return new ProviderExtensionQuery(providerId, this.extensionId, this.queryService);
	}
}

/**
 * Implementation of MCP server query operations (cross-provider)
 */
class McpServerQuery implements IMcpServerQuery {
	constructor(
		public readonly mcpServerId: string,
		private readonly queryService: AuthenticationQueryService
	) { }

	async getProvidersWithAccess(includeInternal?: boolean): Promise<string[]> {
		const providersWithAccess: string[] = [];
		const providerIds = this.queryService.authenticationService.getProviderIds();

		for (const providerId of providerIds) {
			// Skip internal providers unless explicitly requested
			if (!includeInternal && providerId.startsWith(INTERNAL_AUTH_PROVIDER_PREFIX)) {
				continue;
			}

			try {
				const accounts = await this.queryService.authenticationService.getAccounts(providerId);
				const hasAccess = accounts.some(account => {
					const accessAllowed = this.queryService.authenticationMcpAccessService.isAccessAllowed(providerId, account.label, this.mcpServerId);
					return accessAllowed === true;
				});

				if (hasAccess) {
					providersWithAccess.push(providerId);
				}
			} catch {
				// Skip providers that error
			}
		}

		return providersWithAccess;
	}

	getAllAccountPreferences(includeInternal?: boolean): Map<string, string> {
		const preferences = new Map<string, string>();
		const providerIds = this.queryService.authenticationService.getProviderIds();

		for (const providerId of providerIds) {
			// Skip internal providers unless explicitly requested
			if (!includeInternal && providerId.startsWith(INTERNAL_AUTH_PROVIDER_PREFIX)) {
				continue;
			}

			const preferredAccount = this.queryService.authenticationMcpService.getAccountPreference(this.mcpServerId, providerId);
			if (preferredAccount) {
				preferences.set(providerId, preferredAccount);
			}
		}

		return preferences;
	}

	provider(providerId: string): IProviderMcpServerQuery {
		return new ProviderMcpServerQuery(providerId, this.mcpServerId, this.queryService);
	}
}

/**
 * Main implementation of the authentication query service
 */
export class AuthenticationQueryService extends Disposable implements IAuthenticationQueryService {
	declare readonly _serviceBrand: undefined;

	private readonly _onDidChangePreferences = this._register(new Emitter<{
		readonly providerId: string;
		readonly entityType: 'extension' | 'mcpServer';
		readonly entityIds: string[];
	}>());
	readonly onDidChangePreferences = this._onDidChangePreferences.event;

	private readonly _onDidChangeAccess = this._register(new Emitter<{
		readonly providerId: string;
		readonly accountName: string;
	}>());
	readonly onDidChangeAccess = this._onDidChangeAccess.event;

	constructor(
		@IAuthenticationService public readonly authenticationService: IAuthenticationService,
		@IAuthenticationUsageService public readonly authenticationUsageService: IAuthenticationUsageService,
		@IAuthenticationMcpUsageService public readonly authenticationMcpUsageService: IAuthenticationMcpUsageService,
		@IAuthenticationAccessService public readonly authenticationAccessService: IAuthenticationAccessService,
		@IAuthenticationMcpAccessService public readonly authenticationMcpAccessService: IAuthenticationMcpAccessService,
		@IAuthenticationExtensionsService public readonly authenticationExtensionsService: IAuthenticationExtensionsService,
		@IAuthenticationMcpService public readonly authenticationMcpService: IAuthenticationMcpService,
		@ILogService public readonly logService: ILogService
	) {
		super();

		// Forward events from underlying services
		this._register(this.authenticationExtensionsService.onDidChangeAccountPreference(e => {
			this._onDidChangePreferences.fire({
				providerId: e.providerId,
				entityType: 'extension',
				entityIds: e.extensionIds
			});
		}));

		this._register(this.authenticationMcpService.onDidChangeAccountPreference(e => {
			this._onDidChangePreferences.fire({
				providerId: e.providerId,
				entityType: 'mcpServer',
				entityIds: e.mcpServerIds
			});
		}));

		this._register(this.authenticationAccessService.onDidChangeExtensionSessionAccess(e => {
			this._onDidChangeAccess.fire({
				providerId: e.providerId,
				accountName: e.accountName
			});
		}));

		this._register(this.authenticationMcpAccessService.onDidChangeMcpSessionAccess(e => {
			this._onDidChangeAccess.fire({
				providerId: e.providerId,
				accountName: e.accountName
			});
		}));
	}

	provider(providerId: string): IProviderQuery {
		return new ProviderQuery(providerId, this);
	}

	extension(extensionId: string): IExtensionQuery {
		return new ExtensionQuery(extensionId, this);
	}

	mcpServer(mcpServerId: string): IMcpServerQuery {
		return new McpServerQuery(mcpServerId, this);
	}

	getProviderIds(includeInternal?: boolean): string[] {
		return this.authenticationService.getProviderIds().filter(providerId => {
			// Filter out internal providers unless explicitly included
			return includeInternal || !providerId.startsWith(INTERNAL_AUTH_PROVIDER_PREFIX);
		});
	}

	async clearAllData(confirmation: 'CLEAR_ALL_AUTH_DATA', includeInternal: boolean = true): Promise<void> {
		if (confirmation !== 'CLEAR_ALL_AUTH_DATA') {
			throw new Error('Must provide confirmation string to clear all authentication data');
		}

		const providerIds = this.getProviderIds(includeInternal);

		for (const providerId of providerIds) {
			try {
				const accounts = await this.authenticationService.getAccounts(providerId);

				for (const account of accounts) {
					// Clear extension data
					this.authenticationAccessService.removeAllowedExtensions(providerId, account.label);
					this.authenticationUsageService.removeAccountUsage(providerId, account.label);

					// Clear MCP server data
					this.authenticationMcpAccessService.removeAllowedMcpServers(providerId, account.label);
					this.authenticationMcpUsageService.removeAccountUsage(providerId, account.label);
				}
			} catch (error) {
				this.logService.error(`Error clearing data for provider ${providerId}:`, error);
			}
		}

		this.logService.info('All authentication data cleared');
	}
}

registerSingleton(IAuthenticationQueryService, AuthenticationQueryService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/authentication/browser/authenticationService.ts]---
Location: vscode-main/src/vs/workbench/services/authentication/browser/authenticationService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, DisposableMap, DisposableStore, IDisposable, isDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { equalsIgnoreCase, isFalsyOrWhitespace } from '../../../../base/common/strings.js';
import { isString } from '../../../../base/common/types.js';
import { localize } from '../../../../nls.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { ISecretStorageService } from '../../../../platform/secrets/common/secrets.js';
import { IAuthenticationAccessService } from './authenticationAccessService.js';
import { AuthenticationProviderInformation, AuthenticationSession, AuthenticationSessionAccount, AuthenticationSessionsChangeEvent, IAuthenticationCreateSessionOptions, IAuthenticationGetSessionsOptions, IAuthenticationProvider, IAuthenticationProviderHostDelegate, IAuthenticationService, IAuthenticationWwwAuthenticateRequest, isAuthenticationWwwAuthenticateRequest } from '../common/authentication.js';
import { IBrowserWorkbenchEnvironmentService } from '../../environment/browser/environmentService.js';
import { ActivationKind, IExtensionService } from '../../extensions/common/extensions.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';
import { ExtensionsRegistry } from '../../extensions/common/extensionsRegistry.js';
import { match } from '../../../../base/common/glob.js';
import { URI } from '../../../../base/common/uri.js';
import { IAuthorizationProtectedResourceMetadata, IAuthorizationServerMetadata, parseWWWAuthenticateHeader } from '../../../../base/common/oauth.js';
import { raceCancellation, raceTimeout } from '../../../../base/common/async.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';

export function getAuthenticationProviderActivationEvent(id: string): string { return `onAuthenticationRequest:${id}`; }

// TODO: pull this out into its own service
export type AuthenticationSessionInfo = { readonly id: string; readonly accessToken: string; readonly providerId: string; readonly canSignOut?: boolean };
export async function getCurrentAuthenticationSessionInfo(
	secretStorageService: ISecretStorageService,
	productService: IProductService
): Promise<AuthenticationSessionInfo | undefined> {
	const authenticationSessionValue = await secretStorageService.get(`${productService.urlProtocol}.loginAccount`);
	if (authenticationSessionValue) {
		try {
			const authenticationSessionInfo: AuthenticationSessionInfo = JSON.parse(authenticationSessionValue);
			if (authenticationSessionInfo
				&& isString(authenticationSessionInfo.id)
				&& isString(authenticationSessionInfo.accessToken)
				&& isString(authenticationSessionInfo.providerId)
			) {
				return authenticationSessionInfo;
			}
		} catch (e) {
			// This is a best effort operation.
			console.error(`Failed parsing current auth session value: ${e}`);
		}
	}
	return undefined;
}

const authenticationDefinitionSchema: IJSONSchema = {
	type: 'object',
	additionalProperties: false,
	properties: {
		id: {
			type: 'string',
			description: localize('authentication.id', 'The id of the authentication provider.')
		},
		label: {
			type: 'string',
			description: localize('authentication.label', 'The human readable name of the authentication provider.'),
		},
		authorizationServerGlobs: {
			type: 'array',
			items: {
				type: 'string',
				description: localize('authentication.authorizationServerGlobs', 'A list of globs that match the authorization servers that this provider supports.'),
			},
			description: localize('authentication.authorizationServerGlobsDescription', 'A list of globs that match the authorization servers that this provider supports.')
		}
	}
};

const authenticationExtPoint = ExtensionsRegistry.registerExtensionPoint<AuthenticationProviderInformation[]>({
	extensionPoint: 'authentication',
	jsonSchema: {
		description: localize({ key: 'authenticationExtensionPoint', comment: [`'Contributes' means adds here`] }, 'Contributes authentication'),
		type: 'array',
		items: authenticationDefinitionSchema
	},
	activationEventsGenerator: function* (authenticationProviders) {
		for (const authenticationProvider of authenticationProviders) {
			if (authenticationProvider.id) {
				yield `onAuthenticationRequest:${authenticationProvider.id}`;
			}
		}
	}
});

export class AuthenticationService extends Disposable implements IAuthenticationService {
	declare readonly _serviceBrand: undefined;

	private _onDidRegisterAuthenticationProvider: Emitter<AuthenticationProviderInformation> = this._register(new Emitter<AuthenticationProviderInformation>());
	readonly onDidRegisterAuthenticationProvider: Event<AuthenticationProviderInformation> = this._onDidRegisterAuthenticationProvider.event;

	private _onDidUnregisterAuthenticationProvider: Emitter<AuthenticationProviderInformation> = this._register(new Emitter<AuthenticationProviderInformation>());
	readonly onDidUnregisterAuthenticationProvider: Event<AuthenticationProviderInformation> = this._onDidUnregisterAuthenticationProvider.event;

	private _onDidChangeSessions: Emitter<{ providerId: string; label: string; event: AuthenticationSessionsChangeEvent }> = this._register(new Emitter<{ providerId: string; label: string; event: AuthenticationSessionsChangeEvent }>());
	readonly onDidChangeSessions: Event<{ providerId: string; label: string; event: AuthenticationSessionsChangeEvent }> = this._onDidChangeSessions.event;

	private _onDidChangeDeclaredProviders: Emitter<void> = this._register(new Emitter<void>());
	readonly onDidChangeDeclaredProviders: Event<void> = this._onDidChangeDeclaredProviders.event;

	private _authenticationProviders: Map<string, IAuthenticationProvider> = new Map<string, IAuthenticationProvider>();
	private _authenticationProviderDisposables: DisposableMap<string, IDisposable> = this._register(new DisposableMap<string, IDisposable>());
	private _dynamicAuthenticationProviderIds = new Set<string>();

	private readonly _delegates: IAuthenticationProviderHostDelegate[] = [];

	private _disposedSource = new CancellationTokenSource();

	constructor(
		@IExtensionService private readonly _extensionService: IExtensionService,
		@IAuthenticationAccessService authenticationAccessService: IAuthenticationAccessService,
		@IBrowserWorkbenchEnvironmentService private readonly _environmentService: IBrowserWorkbenchEnvironmentService,
		@ILogService private readonly _logService: ILogService
	) {
		super();
		this._register(toDisposable(() => this._disposedSource.dispose(true)));
		this._register(authenticationAccessService.onDidChangeExtensionSessionAccess(e => {
			// The access has changed, not the actual session itself but extensions depend on this event firing
			// when they have gained access to an account so this fires that event.
			this._onDidChangeSessions.fire({
				providerId: e.providerId,
				label: e.accountName,
				event: {
					added: [],
					changed: [],
					removed: []
				}
			});
		}));

		this._registerEnvContributedAuthenticationProviders();
		this._registerAuthenticationExtensionPointHandler();
	}

	private _declaredProviders: AuthenticationProviderInformation[] = [];
	get declaredProviders(): AuthenticationProviderInformation[] {
		return this._declaredProviders;
	}

	private _registerEnvContributedAuthenticationProviders(): void {
		if (!this._environmentService.options?.authenticationProviders?.length) {
			return;
		}
		for (const provider of this._environmentService.options.authenticationProviders) {
			this.registerDeclaredAuthenticationProvider(provider);
			this.registerAuthenticationProvider(provider.id, provider);
		}
	}

	private _registerAuthenticationExtensionPointHandler(): void {
		this._register(authenticationExtPoint.setHandler((_extensions, { added, removed }) => {
			this._logService.debug(`Found authentication providers. added: ${added.length}, removed: ${removed.length}`);
			added.forEach(point => {
				for (const provider of point.value) {
					if (isFalsyOrWhitespace(provider.id)) {
						point.collector.error(localize('authentication.missingId', 'An authentication contribution must specify an id.'));
						continue;
					}

					if (isFalsyOrWhitespace(provider.label)) {
						point.collector.error(localize('authentication.missingLabel', 'An authentication contribution must specify a label.'));
						continue;
					}

					if (!this.declaredProviders.some(p => p.id === provider.id)) {
						this.registerDeclaredAuthenticationProvider(provider);
						this._logService.debug(`Declared authentication provider: ${provider.id}`);
					} else {
						point.collector.error(localize('authentication.idConflict', "This authentication id '{0}' has already been registered", provider.id));
					}
				}
			});

			const removedExtPoints = removed.flatMap(r => r.value);
			removedExtPoints.forEach(point => {
				const provider = this.declaredProviders.find(provider => provider.id === point.id);
				if (provider) {
					this.unregisterDeclaredAuthenticationProvider(provider.id);
					this._logService.debug(`Undeclared authentication provider: ${provider.id}`);
				}
			});
		}));
	}

	registerDeclaredAuthenticationProvider(provider: AuthenticationProviderInformation): void {
		if (isFalsyOrWhitespace(provider.id)) {
			throw new Error(localize('authentication.missingId', 'An authentication contribution must specify an id.'));
		}
		if (isFalsyOrWhitespace(provider.label)) {
			throw new Error(localize('authentication.missingLabel', 'An authentication contribution must specify a label.'));
		}
		if (this.declaredProviders.some(p => p.id === provider.id)) {
			throw new Error(localize('authentication.idConflict', "This authentication id '{0}' has already been registered", provider.id));
		}
		this._declaredProviders.push(provider);
		this._onDidChangeDeclaredProviders.fire();
	}

	unregisterDeclaredAuthenticationProvider(id: string): void {
		const index = this.declaredProviders.findIndex(provider => provider.id === id);
		if (index > -1) {
			this.declaredProviders.splice(index, 1);
		}
		this._onDidChangeDeclaredProviders.fire();
	}

	isAuthenticationProviderRegistered(id: string): boolean {
		return this._authenticationProviders.has(id);
	}

	isDynamicAuthenticationProvider(id: string): boolean {
		return this._dynamicAuthenticationProviderIds.has(id);
	}

	registerAuthenticationProvider(id: string, authenticationProvider: IAuthenticationProvider): void {
		this._authenticationProviders.set(id, authenticationProvider);
		const disposableStore = new DisposableStore();
		disposableStore.add(authenticationProvider.onDidChangeSessions(e => this._onDidChangeSessions.fire({
			providerId: id,
			label: authenticationProvider.label,
			event: e
		})));
		if (isDisposable(authenticationProvider)) {
			disposableStore.add(authenticationProvider);
		}
		this._authenticationProviderDisposables.set(id, disposableStore);
		this._onDidRegisterAuthenticationProvider.fire({ id, label: authenticationProvider.label });
	}

	unregisterAuthenticationProvider(id: string): void {
		const provider = this._authenticationProviders.get(id);
		if (provider) {
			this._authenticationProviders.delete(id);
			// If this is a dynamic provider, remove it from the set of dynamic providers
			this._dynamicAuthenticationProviderIds.delete(id);
			this._onDidUnregisterAuthenticationProvider.fire({ id, label: provider.label });
		}
		this._authenticationProviderDisposables.deleteAndDispose(id);
	}

	getProviderIds(): string[] {
		const providerIds: string[] = [];
		this._authenticationProviders.forEach(provider => {
			providerIds.push(provider.id);
		});
		return providerIds;
	}

	getProvider(id: string): IAuthenticationProvider {
		if (this._authenticationProviders.has(id)) {
			return this._authenticationProviders.get(id)!;
		}
		throw new Error(`No authentication provider '${id}' is currently registered.`);
	}

	async getAccounts(id: string): Promise<ReadonlyArray<AuthenticationSessionAccount>> {
		// TODO: Cache this
		const sessions = await this.getSessions(id);
		const accounts = new Array<AuthenticationSessionAccount>();
		const seenAccounts = new Set<string>();
		for (const session of sessions) {
			if (!seenAccounts.has(session.account.label)) {
				seenAccounts.add(session.account.label);
				accounts.push(session.account);
			}
		}
		return accounts;
	}

	async getSessions(id: string, scopeListOrRequest?: ReadonlyArray<string> | IAuthenticationWwwAuthenticateRequest, options?: IAuthenticationGetSessionsOptions, activateImmediate: boolean = false): Promise<ReadonlyArray<AuthenticationSession>> {
		if (this._disposedSource.token.isCancellationRequested) {
			return [];
		}

		const authProvider = this._authenticationProviders.get(id) || await this.tryActivateProvider(id, activateImmediate);
		if (authProvider) {
			// Check if the authorization server is in the list of supported authorization servers
			const server = options?.authorizationServer;
			if (server) {
				// Skip the resource server check since the auth provider id contains a specific resource server
				// TODO@TylerLeonhardt: this can change when we have providers that support multiple resource servers
				if (!this.matchesProvider(authProvider, server)) {
					throw new Error(`The authentication provider '${id}' does not support the authorization server '${server.toString(true)}'.`);
				}
			}
			if (isAuthenticationWwwAuthenticateRequest(scopeListOrRequest)) {
				if (!authProvider.getSessionsFromChallenges) {
					throw new Error(`The authentication provider '${id}' does not support getting sessions from challenges.`);
				}
				return await authProvider.getSessionsFromChallenges(
					{ challenges: parseWWWAuthenticateHeader(scopeListOrRequest.wwwAuthenticate), fallbackScopes: scopeListOrRequest.fallbackScopes },
					{ ...options }
				);
			}
			return await authProvider.getSessions(scopeListOrRequest ? [...scopeListOrRequest] : undefined, { ...options });
		} else {
			throw new Error(`No authentication provider '${id}' is currently registered.`);
		}
	}

	async createSession(id: string, scopeListOrRequest: ReadonlyArray<string> | IAuthenticationWwwAuthenticateRequest, options?: IAuthenticationCreateSessionOptions): Promise<AuthenticationSession> {
		if (this._disposedSource.token.isCancellationRequested) {
			throw new Error('Authentication service is disposed.');
		}

		const authProvider = this._authenticationProviders.get(id) || await this.tryActivateProvider(id, !!options?.activateImmediate);
		if (authProvider) {
			if (isAuthenticationWwwAuthenticateRequest(scopeListOrRequest)) {
				if (!authProvider.createSessionFromChallenges) {
					throw new Error(`The authentication provider '${id}' does not support creating sessions from challenges.`);
				}
				return await authProvider.createSessionFromChallenges(
					{ challenges: parseWWWAuthenticateHeader(scopeListOrRequest.wwwAuthenticate), fallbackScopes: scopeListOrRequest.fallbackScopes },
					{ ...options }
				);
			}
			return await authProvider.createSession([...scopeListOrRequest], { ...options });
		} else {
			throw new Error(`No authentication provider '${id}' is currently registered.`);
		}
	}

	async removeSession(id: string, sessionId: string): Promise<void> {
		if (this._disposedSource.token.isCancellationRequested) {
			throw new Error('Authentication service is disposed.');
		}

		const authProvider = this._authenticationProviders.get(id);
		if (authProvider) {
			return authProvider.removeSession(sessionId);
		} else {
			throw new Error(`No authentication provider '${id}' is currently registered.`);
		}
	}

	async getOrActivateProviderIdForServer(authorizationServer: URI, resourceServer?: URI): Promise<string | undefined> {
		for (const provider of this._authenticationProviders.values()) {
			if (this.matchesProvider(provider, authorizationServer, resourceServer)) {
				return provider.id;
			}
		}

		const authServerStr = authorizationServer.toString(true);
		const providers = this._declaredProviders
			// Only consider providers that are not already registered since we already checked them
			.filter(p => !this._authenticationProviders.has(p.id))
			.filter(p => !!p.authorizationServerGlobs?.some(i => match(i, authServerStr, { ignoreCase: true })));

		// TODO:@TylerLeonhardt fan out?
		for (const provider of providers) {
			const activeProvider = await this.tryActivateProvider(provider.id, true);
			// Check the resolved authorization servers
			if (this.matchesProvider(activeProvider, authorizationServer, resourceServer)) {
				return activeProvider.id;
			}
		}
		return undefined;
	}

	async createDynamicAuthenticationProvider(authorizationServer: URI, serverMetadata: IAuthorizationServerMetadata, resource: IAuthorizationProtectedResourceMetadata | undefined): Promise<IAuthenticationProvider | undefined> {
		const delegate = this._delegates[0];
		if (!delegate) {
			this._logService.error('No authentication provider host delegate found');
			return undefined;
		}
		const providerId = await delegate.create(authorizationServer, serverMetadata, resource);
		const provider = this._authenticationProviders.get(providerId);
		if (provider) {
			this._logService.debug(`Created dynamic authentication provider: ${providerId}`);
			this._dynamicAuthenticationProviderIds.add(providerId);
			return provider;
		}
		this._logService.error(`Failed to create dynamic authentication provider: ${providerId}`);
		return undefined;
	}

	registerAuthenticationProviderHostDelegate(delegate: IAuthenticationProviderHostDelegate): IDisposable {
		this._delegates.push(delegate);
		this._delegates.sort((a, b) => b.priority - a.priority);

		return {
			dispose: () => {
				const index = this._delegates.indexOf(delegate);
				if (index !== -1) {
					this._delegates.splice(index, 1);
				}
			}
		};
	}

	private matchesProvider(provider: IAuthenticationProvider, authorizationServer: URI, resourceServer?: URI): boolean {
		// If a resourceServer is provided and the provider has a resourceServer defined, they must match
		if (resourceServer && provider.resourceServer) {
			const resourceServerStr = resourceServer.toString(true);
			const providerResourceServerStr = provider.resourceServer.toString(true);
			if (!equalsIgnoreCase(providerResourceServerStr, resourceServerStr)) {
				return false;
			}
		}

		if (provider.authorizationServers) {
			const authServerStr = authorizationServer.toString(true);
			for (const server of provider.authorizationServers) {
				const str = server.toString(true);
				if (equalsIgnoreCase(str, authServerStr) || match(str, authServerStr, { ignoreCase: true })) {
					return true;
				}
			}
		}
		return false;
	}

	private async tryActivateProvider(providerId: string, activateImmediate: boolean): Promise<IAuthenticationProvider> {
		await this._extensionService.activateByEvent(getAuthenticationProviderActivationEvent(providerId), activateImmediate ? ActivationKind.Immediate : ActivationKind.Normal);
		let provider = this._authenticationProviders.get(providerId);
		if (provider) {
			return provider;
		}
		if (this._disposedSource.token.isCancellationRequested) {
			throw new Error('Authentication service is disposed.');
		}

		const store = new DisposableStore();
		try {
			// TODO: Remove this timeout and figure out a better way to ensure auth providers
			// are registered _during_ extension activation.
			const result = await raceTimeout(
				raceCancellation(
					Event.toPromise(
						Event.filter(
							this.onDidRegisterAuthenticationProvider,
							e => e.id === providerId,
							store
						),
						store
					),
					this._disposedSource.token
				),
				5000
			);
			provider = this._authenticationProviders.get(providerId);
			if (provider) {
				return provider;
			}
			if (!result) {
				throw new Error(`Timed out waiting for authentication provider '${providerId}' to register.`);
			}
			throw new Error(`No authentication provider '${providerId}' is currently registered.`);
		} finally {
			store.dispose();
		}
	}
}

registerSingleton(IAuthenticationService, AuthenticationService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/authentication/browser/authenticationUsageService.ts]---
Location: vscode-main/src/vs/workbench/services/authentication/browser/authenticationUsageService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Queue } from '../../../../base/common/async.js';
import { Disposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IAuthenticationService } from '../common/authentication.js';

export interface IAccountUsage {
	extensionId: string;
	extensionName: string;
	lastUsed: number;
	scopes?: string[];
}

export const IAuthenticationUsageService = createDecorator<IAuthenticationUsageService>('IAuthenticationUsageService');
export interface IAuthenticationUsageService {
	readonly _serviceBrand: undefined;
	/**
	 * Initializes the cache of extensions that use authentication. Ideally used in a contribution that can be run eventually after the workspace is loaded.
	 */
	initializeExtensionUsageCache(): Promise<void>;
	/**
	 * Checks if an extension uses authentication
	 * @param extensionId The id of the extension to check
	 */
	extensionUsesAuth(extensionId: string): Promise<boolean>;
	/**
	 * Reads the usages for an account
	 * @param providerId The id of the authentication provider to get usages for
	 * @param accountName The name of the account to get usages for
	 */
	readAccountUsages(providerId: string, accountName: string,): IAccountUsage[];
	/**
	 *
	 * @param providerId The id of the authentication provider to get usages for
	 * @param accountName The name of the account to get usages for
	 */
	removeAccountUsage(providerId: string, accountName: string): void;
	/**
	 * Adds a usage for an account
	 * @param providerId The id of the authentication provider to get usages for
	 * @param accountName The name of the account to get usages for
	 * @param extensionId The id of the extension to add a usage for
	 * @param extensionName The name of the extension to add a usage for
	 */
	addAccountUsage(providerId: string, accountName: string, scopes: ReadonlyArray<string> | undefined, extensionId: string, extensionName: string): void;
}

export class AuthenticationUsageService extends Disposable implements IAuthenticationUsageService {
	_serviceBrand: undefined;

	private _queue = this._register(new Queue());
	private _extensionsUsingAuth = new Set<string>();

	private _disposed = false;

	constructor(
		@IStorageService private readonly _storageService: IStorageService,
		@IAuthenticationService private readonly _authenticationService: IAuthenticationService,
		@ILogService private readonly _logService: ILogService,
		@IProductService productService: IProductService,
	) {
		super();
		this._register(toDisposable(() => this._disposed = true));
		// If an extension is listed in `trustedExtensionAuthAccess` we should consider it as using auth
		const trustedExtensionAuthAccess = productService.trustedExtensionAuthAccess;
		if (Array.isArray(trustedExtensionAuthAccess)) {
			for (const extensionId of trustedExtensionAuthAccess) {
				this._extensionsUsingAuth.add(extensionId);
			}
		} else if (trustedExtensionAuthAccess) {
			for (const extensions of Object.values(trustedExtensionAuthAccess)) {
				for (const extensionId of extensions) {
					this._extensionsUsingAuth.add(extensionId);
				}
			}
		}

		this._register(this._authenticationService.onDidRegisterAuthenticationProvider(
			provider => this._queue.queue(
				() => this._addExtensionsToCache(provider.id)
			)
		));
	}

	async initializeExtensionUsageCache(): Promise<void> {
		await this._queue.queue(() => Promise.all(this._authenticationService.getProviderIds().map(providerId => this._addExtensionsToCache(providerId))));
	}

	async extensionUsesAuth(extensionId: string): Promise<boolean> {
		await this._queue.whenIdle();
		return this._extensionsUsingAuth.has(extensionId);
	}

	readAccountUsages(providerId: string, accountName: string): IAccountUsage[] {
		const accountKey = `${providerId}-${accountName}-usages`;
		const storedUsages = this._storageService.get(accountKey, StorageScope.APPLICATION);
		let usages: IAccountUsage[] = [];
		if (storedUsages) {
			try {
				usages = JSON.parse(storedUsages);
			} catch (e) {
				// ignore
			}
		}

		return usages;
	}

	removeAccountUsage(providerId: string, accountName: string): void {
		const accountKey = `${providerId}-${accountName}-usages`;
		this._storageService.remove(accountKey, StorageScope.APPLICATION);
	}

	addAccountUsage(providerId: string, accountName: string, scopes: string[] | undefined, extensionId: string, extensionName: string): void {
		const accountKey = `${providerId}-${accountName}-usages`;
		const usages = this.readAccountUsages(providerId, accountName);

		const existingUsageIndex = usages.findIndex(usage => usage.extensionId === extensionId);
		if (existingUsageIndex > -1) {
			usages.splice(existingUsageIndex, 1, {
				extensionId,
				extensionName,
				scopes,
				lastUsed: Date.now()
			});
		} else {
			usages.push({
				extensionId,
				extensionName,
				scopes,
				lastUsed: Date.now()
			});
		}

		this._storageService.store(accountKey, JSON.stringify(usages), StorageScope.APPLICATION, StorageTarget.MACHINE);
		this._extensionsUsingAuth.add(extensionId);
	}

	private async _addExtensionsToCache(providerId: string) {
		if (this._disposed) {
			return;
		}
		try {
			const accounts = await this._authenticationService.getAccounts(providerId);
			for (const account of accounts) {
				const usage = this.readAccountUsages(providerId, account.label);
				for (const u of usage) {
					this._extensionsUsingAuth.add(u.extensionId);
				}
			}
		} catch (e) {
			this._logService.error(e);
		}
	}
}

registerSingleton(IAuthenticationUsageService, AuthenticationUsageService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/authentication/browser/dynamicAuthenticationProviderStorageService.ts]---
Location: vscode-main/src/vs/workbench/services/authentication/browser/dynamicAuthenticationProviderStorageService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IDynamicAuthenticationProviderStorageService, DynamicAuthenticationProviderInfo, DynamicAuthenticationProviderTokensChangeEvent } from '../common/dynamicAuthenticationProviderStorage.js';
import { ISecretStorageService } from '../../../../platform/secrets/common/secrets.js';
import { IAuthorizationTokenResponse, isAuthorizationTokenResponse } from '../../../../base/common/oauth.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Queue } from '../../../../base/common/async.js';

export class DynamicAuthenticationProviderStorageService extends Disposable implements IDynamicAuthenticationProviderStorageService {
	declare readonly _serviceBrand: undefined;

	private static readonly PROVIDERS_STORAGE_KEY = 'dynamicAuthProviders';

	private readonly _onDidChangeTokens = this._register(new Emitter<DynamicAuthenticationProviderTokensChangeEvent>());
	readonly onDidChangeTokens: Event<DynamicAuthenticationProviderTokensChangeEvent> = this._onDidChangeTokens.event;

	constructor(
		@IStorageService private readonly storageService: IStorageService,
		@ISecretStorageService private readonly secretStorageService: ISecretStorageService,
		@ILogService private readonly logService: ILogService
	) {
		super();

		// Listen for secret storage changes and emit events for dynamic auth provider token changes
		const queue = new Queue<void>();
		this._register(this.secretStorageService.onDidChangeSecret(async (key: string) => {
			let payload: { isDynamicAuthProvider: boolean; authProviderId: string; clientId: string } | undefined;
			try {
				payload = JSON.parse(key);
			} catch (error) {
				// Ignore errors... must not be a dynamic auth provider
			}
			if (payload?.isDynamicAuthProvider) {
				void queue.queue(async () => {
					const tokens = await this.getSessionsForDynamicAuthProvider(payload.authProviderId, payload.clientId);
					this._onDidChangeTokens.fire({
						authProviderId: payload.authProviderId,
						clientId: payload.clientId,
						tokens
					});
				});
			}
		}));
	}

	async getClientRegistration(providerId: string): Promise<{ clientId?: string; clientSecret?: string } | undefined> {
		// First try new combined SecretStorage format
		const key = `dynamicAuthProvider:clientRegistration:${providerId}`;
		const credentialsValue = await this.secretStorageService.get(key);
		if (credentialsValue) {
			try {
				const credentials = JSON.parse(credentialsValue);
				if (credentials && (credentials.clientId || credentials.clientSecret)) {
					return credentials;
				}
			} catch {
				await this.secretStorageService.delete(key);
			}
		}

		// Just grab the client id from the provider
		const providers = this._getStoredProviders();
		const provider = providers.find(p => p.providerId === providerId);
		return provider?.clientId ? { clientId: provider.clientId } : undefined;
	}

	getClientId(providerId: string): string | undefined {
		// For backward compatibility, try old storage format first
		const providers = this._getStoredProviders();
		const provider = providers.find(p => p.providerId === providerId);
		return provider?.clientId;
	}

	async storeClientRegistration(providerId: string, authorizationServer: string, clientId: string, clientSecret?: string, label?: string): Promise<void> {
		// Store provider information for backward compatibility and UI display
		this._trackProvider(providerId, authorizationServer, clientId, label);

		// Store both client ID and secret together in SecretStorage
		const key = `dynamicAuthProvider:clientRegistration:${providerId}`;
		const credentials = { clientId, clientSecret };
		await this.secretStorageService.set(key, JSON.stringify(credentials));
	}

	private _trackProvider(providerId: string, authorizationServer: string, clientId: string, label?: string): void {
		const providers = this._getStoredProviders();

		// Check if provider already exists
		const existingProviderIndex = providers.findIndex(p => p.providerId === providerId);
		if (existingProviderIndex === -1) {
			// Add new provider with provided or default info
			const newProvider: DynamicAuthenticationProviderInfo = {
				providerId,
				label: label || providerId, // Use provided label or providerId as default
				authorizationServer,
				clientId
			};
			providers.push(newProvider);
			this._storeProviders(providers);
		} else {
			const existingProvider = providers[existingProviderIndex];
			// Create new provider object with updated info
			const updatedProvider: DynamicAuthenticationProviderInfo = {
				providerId,
				label: label || existingProvider.label,
				authorizationServer,
				clientId
			};
			providers[existingProviderIndex] = updatedProvider;
			this._storeProviders(providers);
		}
	}

	private _getStoredProviders(): DynamicAuthenticationProviderInfo[] {
		const stored = this.storageService.get(DynamicAuthenticationProviderStorageService.PROVIDERS_STORAGE_KEY, StorageScope.APPLICATION, '[]');
		try {
			const providerInfos = JSON.parse(stored);
			// MIGRATION: remove after an iteration or 2
			for (const providerInfo of providerInfos) {
				if (!providerInfo.authorizationServer) {
					providerInfo.authorizationServer = providerInfo.issuer;
				}
			}
			return providerInfos;
		} catch {
			return [];
		}
	}

	private _storeProviders(providers: DynamicAuthenticationProviderInfo[]): void {
		this.storageService.store(
			DynamicAuthenticationProviderStorageService.PROVIDERS_STORAGE_KEY,
			JSON.stringify(providers),
			StorageScope.APPLICATION,
			StorageTarget.MACHINE
		);
	}

	getInteractedProviders(): ReadonlyArray<DynamicAuthenticationProviderInfo> {
		return this._getStoredProviders();
	}

	async removeDynamicProvider(providerId: string): Promise<void> {
		// Get provider info before removal for secret cleanup
		const providers = this._getStoredProviders();
		const providerInfo = providers.find(p => p.providerId === providerId);

		// Remove from stored providers
		const filteredProviders = providers.filter(p => p.providerId !== providerId);
		this._storeProviders(filteredProviders);

		// Remove sessions from secret storage if we have the provider info
		if (providerInfo) {
			const secretKey = JSON.stringify({ isDynamicAuthProvider: true, authProviderId: providerId, clientId: providerInfo.clientId });
			await this.secretStorageService.delete(secretKey);
		}

		// Remove client credentials from new SecretStorage format
		const credentialsKey = `dynamicAuthProvider:clientRegistration:${providerId}`;
		await this.secretStorageService.delete(credentialsKey);
	}

	async getSessionsForDynamicAuthProvider(authProviderId: string, clientId: string): Promise<(IAuthorizationTokenResponse & { created_at: number })[] | undefined> {
		const key = JSON.stringify({ isDynamicAuthProvider: true, authProviderId, clientId });
		const value = await this.secretStorageService.get(key);
		if (value) {
			const parsed = JSON.parse(value);
			if (!Array.isArray(parsed) || !parsed.every((t) => typeof t.created_at === 'number' && isAuthorizationTokenResponse(t))) {
				this.logService.error(`Invalid session data for ${authProviderId} (${clientId}) in secret storage:`, parsed);
				await this.secretStorageService.delete(key);
				return undefined;
			}
			return parsed;
		}
		return undefined;
	}

	async setSessionsForDynamicAuthProvider(authProviderId: string, clientId: string, sessions: (IAuthorizationTokenResponse & { created_at: number })[]): Promise<void> {
		const key = JSON.stringify({ isDynamicAuthProvider: true, authProviderId, clientId });
		const value = JSON.stringify(sessions);
		await this.secretStorageService.set(key, value);
		this.logService.trace(`Set session data for ${authProviderId} (${clientId}) in secret storage:`, sessions);
	}
}

registerSingleton(IDynamicAuthenticationProviderStorageService, DynamicAuthenticationProviderStorageService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/authentication/common/authentication.ts]---
Location: vscode-main/src/vs/workbench/services/authentication/common/authentication.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { IAuthenticationChallenge, IAuthorizationProtectedResourceMetadata, IAuthorizationServerMetadata } from '../../../../base/common/oauth.js';
import { URI } from '../../../../base/common/uri.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

/**
 * Use this if you don't want the onDidChangeSessions event to fire in the extension host
 */
export const INTERNAL_AUTH_PROVIDER_PREFIX = '__';

export interface AuthenticationSessionAccount {
	label: string;
	id: string;
}

export interface AuthenticationSession {
	id: string;
	accessToken: string;
	account: AuthenticationSessionAccount;
	scopes: ReadonlyArray<string>;
	idToken?: string;
}

export interface AuthenticationSessionsChangeEvent {
	added: ReadonlyArray<AuthenticationSession> | undefined;
	removed: ReadonlyArray<AuthenticationSession> | undefined;
	changed: ReadonlyArray<AuthenticationSession> | undefined;
}

export interface AuthenticationProviderInformation {
	id: string;
	label: string;
	authorizationServerGlobs?: ReadonlyArray<string>;
}

/**
 * Options for creating an authentication session via the service.
 */
export interface IAuthenticationCreateSessionOptions {
	activateImmediate?: boolean;
	/**
	 * The account that is being asked about. If this is passed in, the provider should
	 * attempt to return the sessions that are only related to this account.
	 */
	account?: AuthenticationSessionAccount;
	/**
	 * The authorization server URI to use for this creation request. If passed in, first we validate that
	 * the provider can use this authorization server, then it is passed down to the auth provider.
	 */
	authorizationServer?: URI;
	/**
	 * Allows the authentication provider to take in additional parameters.
	 * It is up to the provider to define what these parameters are and handle them.
	 * This is useful for passing in additional information that is specific to the provider
	 * and not part of the standard authentication flow.
	 */
	[key: string]: any;
}

export interface IAuthenticationWwwAuthenticateRequest {
	/**
	 * The raw WWW-Authenticate header value that triggered this challenge.
	 * This will be parsed by the authentication provider to extract the necessary
	 * challenge information.
	 */
	readonly wwwAuthenticate: string;

	/**
	 * Optional scopes for the session. If not provided, the authentication provider
	 * may use default scopes or extract them from the challenge.
	 */
	readonly fallbackScopes?: readonly string[];
}

export function isAuthenticationWwwAuthenticateRequest(obj: unknown): obj is IAuthenticationWwwAuthenticateRequest {
	return typeof obj === 'object'
		&& obj !== null
		&& 'wwwAuthenticate' in obj
		&& (typeof obj.wwwAuthenticate === 'string');
}

/**
 * Represents constraints for authentication, including challenges and optional scopes.
 * This is used when creating or retrieving sessions that must satisfy specific authentication
 * requirements from WWW-Authenticate headers.
 */
export interface IAuthenticationConstraint {
	/**
	 * Array of authentication challenges parsed from WWW-Authenticate headers.
	 */
	readonly challenges: readonly IAuthenticationChallenge[];

	/**
	 * Optional scopes for the session. If not provided, the authentication provider
	 * may extract scopes from the challenges or use default scopes.
	 */
	readonly fallbackScopes?: readonly string[];
}

/**
 * Options for getting authentication sessions via the service.
 */
export interface IAuthenticationGetSessionsOptions {
	/**
	 * The account that is being asked about. If this is passed in, the provider should
	 * attempt to return the sessions that are only related to this account.
	 */
	account?: AuthenticationSessionAccount;
	/**
	 * The authorization server URI to use for this request. If passed in, first we validate that
	 * the provider can use this authorization server, then it is passed down to the auth provider.
	 */
	authorizationServer?: URI;
	/**
	 * Allows the authentication provider to take in additional parameters.
	 * It is up to the provider to define what these parameters are and handle them.
	 * This is useful for passing in additional information that is specific to the provider
	 * and not part of the standard authentication flow.
	 */
	[key: string]: any;
}

export interface AllowedExtension {
	id: string;
	name: string;
	/**
	 * If true or undefined, the extension is allowed to use the account
	 * If false, the extension is not allowed to use the account
	 * TODO: undefined shouldn't be a valid value, but it is for now
	 */
	allowed?: boolean;
	lastUsed?: number;
	// If true, this comes from the product.json
	trusted?: boolean;
}

export interface IAuthenticationProviderHostDelegate {
	/** Priority for this delegate, delegates are tested in descending priority order */
	readonly priority: number;
	create(authorizationServer: URI, serverMetadata: IAuthorizationServerMetadata, resource: IAuthorizationProtectedResourceMetadata | undefined): Promise<string>;
}

export const IAuthenticationService = createDecorator<IAuthenticationService>('IAuthenticationService');

export interface IAuthenticationService {
	readonly _serviceBrand: undefined;

	/**
	 * Fires when an authentication provider has been registered
	 */
	readonly onDidRegisterAuthenticationProvider: Event<AuthenticationProviderInformation>;
	/**
	 * Fires when an authentication provider has been unregistered
	 */
	readonly onDidUnregisterAuthenticationProvider: Event<AuthenticationProviderInformation>;

	/**
	 * Fires when the list of sessions for a provider has been added, removed or changed
	 */
	readonly onDidChangeSessions: Event<{ providerId: string; label: string; event: AuthenticationSessionsChangeEvent }>;

	/**
	 * Fires when the list of declaredProviders has changed
	 */
	readonly onDidChangeDeclaredProviders: Event<void>;

	/**
	 * All providers that have been statically declared by extensions. These may not actually be registered or active yet.
	 */
	readonly declaredProviders: AuthenticationProviderInformation[];

	/**
	 * Registers that an extension has declared an authentication provider in their package.json
	 * @param provider The provider information to register
	 */
	registerDeclaredAuthenticationProvider(provider: AuthenticationProviderInformation): void;

	/**
	 * Unregisters a declared authentication provider
	 * @param id The id of the provider to unregister
	 */
	unregisterDeclaredAuthenticationProvider(id: string): void;

	/**
	 * Checks if an authentication provider has been registered
	 * @param id The id of the provider to check
	 */
	isAuthenticationProviderRegistered(id: string): boolean;

	/**
	 * Checks if an authentication provider is dynamic
	 * @param id The id of the provider to check
	 */
	isDynamicAuthenticationProvider(id: string): boolean;

	/**
	 * Registers an authentication provider
	 * @param id The id of the provider
	 * @param provider The implementation of the provider
	 */
	registerAuthenticationProvider(id: string, provider: IAuthenticationProvider): void;

	/**
	 * Unregisters an authentication provider
	 * @param id The id of the provider to unregister
	 */
	unregisterAuthenticationProvider(id: string): void;

	/**
	 * Gets the provider ids of all registered authentication providers
	 */
	getProviderIds(): string[];

	/**
	 * Gets the provider with the given id.
	 * @param id The id of the provider to get
	 * @throws if the provider is not registered
	 */
	getProvider(id: string): IAuthenticationProvider;

	/**
	 * Gets all accounts that are currently logged in across all sessions
	 * @param id The id of the provider to ask for accounts
	 * @returns A promise that resolves to an array of accounts
	 */
	getAccounts(id: string): Promise<ReadonlyArray<AuthenticationSessionAccount>>;

	/**
	 * Gets all sessions that satisfy the given scopes from the provider with the given id
	 * @param id The id of the provider to ask for a session
	 * @param scopes The scopes for the session
	 * @param options Additional options for getting sessions
	 * @param activateImmediate If true, the provider should activate immediately if it is not already
	 */
	getSessions(id: string, scopeListOrRequest?: ReadonlyArray<string> | IAuthenticationWwwAuthenticateRequest, options?: IAuthenticationGetSessionsOptions, activateImmediate?: boolean): Promise<ReadonlyArray<AuthenticationSession>>;

	/**
	 * Creates an AuthenticationSession with the given provider and scopes
	 * @param providerId The id of the provider
	 * @param scopes The scopes to request
	 * @param options Additional options for creating the session
	 */
	createSession(providerId: string, scopeListOrRequest: ReadonlyArray<string> | IAuthenticationWwwAuthenticateRequest, options?: IAuthenticationCreateSessionOptions): Promise<AuthenticationSession>;

	/**
	 * Removes the session with the given id from the provider with the given id
	 * @param providerId The id of the provider
	 * @param sessionId The id of the session to remove
	 */
	removeSession(providerId: string, sessionId: string): Promise<void>;

	/**
	 * Gets a provider id for a specified authorization server
	 * @param authorizationServer The authorization server url that this provider is responsible for
	 * @param resourceServer The resource server URI that should match the provider's resourceServer (if defined)
	 */
	getOrActivateProviderIdForServer(authorizationServer: URI, resourceServer?: URI): Promise<string | undefined>;

	/**
	 * Allows the ability register a delegate that will be used to start authentication providers
	 * @param delegate The delegate to register
	 */
	registerAuthenticationProviderHostDelegate(delegate: IAuthenticationProviderHostDelegate): IDisposable;

	/**
	 * Creates a dynamic authentication provider for the given server metadata
	 * @param serverMetadata The metadata for the server that is being authenticated against
	 */
	createDynamicAuthenticationProvider(authorizationServer: URI, serverMetadata: IAuthorizationServerMetadata, resourceMetadata: IAuthorizationProtectedResourceMetadata | undefined): Promise<IAuthenticationProvider | undefined>;
}

export function isAuthenticationSession(thing: unknown): thing is AuthenticationSession {
	if (typeof thing !== 'object' || !thing) {
		return false;
	}
	const maybe = thing as AuthenticationSession;
	if (typeof maybe.id !== 'string') {
		return false;
	}
	if (typeof maybe.accessToken !== 'string') {
		return false;
	}
	if (typeof maybe.account !== 'object' || !maybe.account) {
		return false;
	}
	if (typeof maybe.account.label !== 'string') {
		return false;
	}
	if (typeof maybe.account.id !== 'string') {
		return false;
	}
	if (!Array.isArray(maybe.scopes)) {
		return false;
	}
	if (maybe.idToken && typeof maybe.idToken !== 'string') {
		return false;
	}
	return true;
}

// TODO: Move this into MainThreadAuthentication
export const IAuthenticationExtensionsService = createDecorator<IAuthenticationExtensionsService>('IAuthenticationExtensionsService');
export interface IAuthenticationExtensionsService {
	readonly _serviceBrand: undefined;

	/**
	 * Fires when an account preference for a specific provider has changed for the specified extensions. Does not fire when:
	 * * An account preference is removed
	 * * A session preference is changed (because it's deprecated)
	 * * A session preference is removed (because it's deprecated)
	 */
	readonly onDidChangeAccountPreference: Event<{ extensionIds: string[]; providerId: string }>;
	/**
	 * Returns the accountName (also known as account.label) to pair with `IAuthenticationAccessService` to get the account preference
	 * @param providerId The authentication provider id
	 * @param extensionId The extension id to get the preference for
	 * @returns The accountName of the preference, or undefined if there is no preference set
	 */
	getAccountPreference(extensionId: string, providerId: string): string | undefined;
	/**
	 * Sets the account preference for the given provider and extension
	 * @param providerId The authentication provider id
	 * @param extensionId The extension id to set the preference for
	 * @param account The account to set the preference to
	 */
	updateAccountPreference(extensionId: string, providerId: string, account: AuthenticationSessionAccount): void;
	/**
	 * Removes the account preference for the given provider and extension
	 * @param providerId The authentication provider id
	 * @param extensionId The extension id to remove the preference for
	 */
	removeAccountPreference(extensionId: string, providerId: string): void;
	/**
	 * @deprecated Sets the session preference for the given provider and extension
	 * @param providerId
	 * @param extensionId
	 * @param session
	 */
	updateSessionPreference(providerId: string, extensionId: string, session: AuthenticationSession): void;
	/**
	 * @deprecated Gets the session preference for the given provider and extension
	 * @param providerId
	 * @param extensionId
	 * @param scopes
	 */
	getSessionPreference(providerId: string, extensionId: string, scopes: string[]): string | undefined;
	/**
	 * @deprecated Removes the session preference for the given provider and extension
	 * @param providerId
	 * @param extensionId
	 * @param scopes
	 */
	removeSessionPreference(providerId: string, extensionId: string, scopes: string[]): void;
	selectSession(providerId: string, extensionId: string, extensionName: string, scopeListOrRequest: ReadonlyArray<string> | IAuthenticationWwwAuthenticateRequest, possibleSessions: readonly AuthenticationSession[]): Promise<AuthenticationSession>;
	requestSessionAccess(providerId: string, extensionId: string, extensionName: string, scopeListOrRequest: ReadonlyArray<string> | IAuthenticationWwwAuthenticateRequest, possibleSessions: readonly AuthenticationSession[]): void;
	requestNewSession(providerId: string, scopeListOrRequest: ReadonlyArray<string> | IAuthenticationWwwAuthenticateRequest, extensionId: string, extensionName: string): Promise<void>;
	updateNewSessionRequests(providerId: string, addedSessions: readonly AuthenticationSession[]): void;
}

/**
 * Options passed to the authentication provider when asking for sessions.
 */
export interface IAuthenticationProviderSessionOptions {
	/**
	 * The account that is being asked about. If this is passed in, the provider should
	 * attempt to return the sessions that are only related to this account.
	 */
	account?: AuthenticationSessionAccount;
	/**
	 * The authorization server that is being asked about. If this is passed in, the provider should
	 * attempt to return sessions that are only related to this authorization server.
	 */
	authorizationServer?: URI;
	/**
	 * Allows the authentication provider to take in additional parameters.
	 * It is up to the provider to define what these parameters are and handle them.
	 * This is useful for passing in additional information that is specific to the provider
	 * and not part of the standard authentication flow.
	 */
	[key: string]: any;
}

/**
 * Represents an authentication provider.
 */
export interface IAuthenticationProvider {
	/**
	 * The unique identifier of the authentication provider.
	 */
	readonly id: string;

	/**
	 * The display label of the authentication provider.
	 */
	readonly label: string;

	/**
	 * The resource server URI that this provider is responsible for, if any.
	 * TODO@TylerLeonhardt: Rather than this being added to the provider, it should be passed in to
	 * getSessions/createSession/etc... this way we can have providers that handle multiple resource servers.
	 */
	readonly resourceServer?: URI;

	/**
	 * The resolved authorization servers. These can still contain globs, but should be concrete URIs
	 */
	readonly authorizationServers?: ReadonlyArray<URI>;

	/**
	 * Indicates whether the authentication provider supports multiple accounts.
	 */
	readonly supportsMultipleAccounts: boolean;

	/**
	 * Optional function to provide a custom confirmation message for authentication prompts.
	 * If not implemented, the default confirmation messages will be used.
	 * @param extensionName - The name of the extension requesting authentication.
	 * @param recreatingSession - Whether this is recreating an existing session.
	 * @returns A custom confirmation message or undefined to use the default message.
	 */
	readonly confirmation?: (extensionName: string, recreatingSession: boolean) => string | undefined;

	/**
	 * An {@link Event} which fires when the array of sessions has changed, or data
	 * within a session has changed.
	 */
	readonly onDidChangeSessions: Event<AuthenticationSessionsChangeEvent>;

	/**
	 * Retrieves a list of authentication sessions.
	 * @param scopes - An optional list of scopes. If provided, the sessions returned should match these permissions, otherwise all sessions should be returned.
	 * @param options - Additional options for getting sessions.
	 * @returns A promise that resolves to an array of authentication sessions.
	 */
	getSessions(scopes: string[] | undefined, options: IAuthenticationProviderSessionOptions): Promise<readonly AuthenticationSession[]>;

	/**
	 * Prompts the user to log in.
	 * If login is successful, the `onDidChangeSessions` event should be fired.
	 * If login fails, a rejected promise should be returned.
	 * If the provider does not support multiple accounts, this method should not be called if there is already an existing session matching the provided scopes.
	 * @param scopes - A list of scopes that the new session should be created with.
	 * @param options - Additional options for creating the session.
	 * @returns A promise that resolves to an authentication session.
	 */
	createSession(scopes: string[], options: IAuthenticationProviderSessionOptions): Promise<AuthenticationSession>;

	/**
	 * Get existing sessions that match the given authentication constraints.
	 *
	 * @param constraint The authentication constraint containing challenges and optional scopes
	 * @param options Options for the session request
	 * @returns A thenable that resolves to an array of existing authentication sessions
	 */
	getSessionsFromChallenges?(constraint: IAuthenticationConstraint, options: IAuthenticationProviderSessionOptions): Promise<readonly AuthenticationSession[]>;

	/**
	 * Create a new session based on authentication constraints.
	 * This is called when no existing session matches the constraint requirements.
	 *
	 * @param constraint The authentication constraint containing challenges and optional scopes
	 * @param options Options for the session creation
	 * @returns A thenable that resolves to a new authentication session
	 */
	createSessionFromChallenges?(constraint: IAuthenticationConstraint, options: IAuthenticationProviderSessionOptions): Promise<AuthenticationSession>;

	/**
	 * Removes the session corresponding to the specified session ID.
	 * If the removal is successful, the `onDidChangeSessions` event should be fired.
	 * If a session cannot be removed, the provider should reject with an error message.
	 * @param sessionId - The ID of the session to remove.
	 */
	removeSession(sessionId: string): Promise<void>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/authentication/common/authenticationQuery.ts]---
Location: vscode-main/src/vs/workbench/services/authentication/common/authenticationQuery.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { AuthenticationSessionAccount } from './authentication.js';

/**
 * Statistics about authentication usage
 */
export interface IAuthenticationUsageStats {
	readonly totalSessions: number;
	readonly totalAccounts: number;
	readonly recentActivity: {
		readonly accountName: string;
		readonly lastUsed: number;
		readonly usageCount: number;
	}[];
}

/**
 * Information about entities using authentication within a provider
 */
export interface IActiveEntities {
	readonly extensions: string[];
	readonly mcpServers: string[];
}

/**
 * Base query interface with common properties
 */
export interface IBaseQuery {
	readonly providerId: string;
}

/**
 * Query interface for operations on a specific account within a provider
 */
export interface IAccountQuery extends IBaseQuery {
	readonly accountName: string;

	/**
	 * Get operations for a specific extension on this account
	 * @param extensionId The extension id
	 * @returns An account-extension query interface
	 */
	extension(extensionId: string): IAccountExtensionQuery;

	/**
	 * Get operations for a specific MCP server on this account
	 * @param mcpServerId The MCP server id
	 * @returns An account-MCP server query interface
	 */
	mcpServer(mcpServerId: string): IAccountMcpServerQuery;

	/**
	 * Get operations for all extensions on this account
	 * @returns An account-extensions query interface
	 */
	extensions(): IAccountExtensionsQuery;

	/**
	 * Get operations for all MCP servers on this account
	 * @returns An account-MCP servers query interface
	 */
	mcpServers(): IAccountMcpServersQuery;

	/**
	 * Get operations for all entities (extensions and MCP servers) on this account
	 * @returns An account-entities query interface for type-agnostic operations
	 */
	entities(): IAccountEntitiesQuery;

	/**
	 * Remove all authentication data for this account
	 */
	remove(): void;
}

/**
 * Query interface for operations on a specific extension within a specific account
 */
export interface IAccountExtensionQuery extends IBaseQuery {
	readonly accountName: string;
	readonly extensionId: string;

	/**
	 * Check if this extension is allowed to access this account
	 * @returns True if allowed, false if denied, undefined if not yet decided
	 */
	isAccessAllowed(): boolean | undefined;

	/**
	 * Set access permission for this extension on this account
	 * @param allowed True to allow, false to deny access
	 * @param extensionName Optional extension name for display purposes
	 */
	setAccessAllowed(allowed: boolean, extensionName?: string): void;

	/**
	 * Add usage record for this extension on this account
	 * @param scopes The scopes that were used
	 * @param extensionName The extension name for display purposes
	 */
	addUsage(scopes: readonly string[], extensionName: string): void;

	/**
	 * Get usage history for this extension on this account
	 * @returns Array of usage records
	 */
	getUsage(): {
		readonly extensionId: string;
		readonly extensionName: string;
		readonly scopes: readonly string[];
		readonly lastUsed: number;
	}[];

	/**
	 * Remove all usage data for this extension on this account
	 */
	removeUsage(): void;

	/**
	 * Set this account as the preferred account for this extension
	 */
	setAsPreferred(): void;

	/**
	 * Check if this account is the preferred account for this extension
	 */
	isPreferred(): boolean;

	/**
	 * Check if this extension is trusted (defined in product.json)
	 * @returns True if the extension is trusted, false otherwise
	 */
	isTrusted(): boolean;
}

/**
 * Query interface for operations on a specific MCP server within a specific account
 */
export interface IAccountMcpServerQuery extends IBaseQuery {
	readonly accountName: string;
	readonly mcpServerId: string;

	/**
	 * Check if this MCP server is allowed to access this account
	 * @returns True if allowed, false if denied, undefined if not yet decided
	 */
	isAccessAllowed(): boolean | undefined;

	/**
	 * Set access permission for this MCP server on this account
	 * @param allowed True to allow, false to deny access
	 * @param mcpServerName Optional MCP server name for display purposes
	 */
	setAccessAllowed(allowed: boolean, mcpServerName?: string): void;

	/**
	 * Add usage record for this MCP server on this account
	 * @param scopes The scopes that were used
	 * @param mcpServerName The MCP server name for display purposes
	 */
	addUsage(scopes: readonly string[], mcpServerName: string): void;

	/**
	 * Get usage history for this MCP server on this account
	 * @returns Array of usage records
	 */
	getUsage(): {
		readonly mcpServerId: string;
		readonly mcpServerName: string;
		readonly scopes: readonly string[];
		readonly lastUsed: number;
	}[];

	/**
	 * Remove all usage data for this MCP server on this account
	 */
	removeUsage(): void;

	/**
	 * Set this account as the preferred account for this MCP server
	 */
	setAsPreferred(): void;

	/**
	 * Check if this account is the preferred account for this MCP server
	 */
	isPreferred(): boolean;

	/**
	 * Check if this MCP server is trusted (defined in product.json)
	 * @returns True if the MCP server is trusted, false otherwise
	 */
	isTrusted(): boolean;
}

/**
 * Query interface for operations on all extensions within a specific account
 */
export interface IAccountExtensionsQuery extends IBaseQuery {
	readonly accountName: string;

	/**
	 * Get all extensions that have access to this account with their trusted state
	 * @returns Array of objects containing extension data including trusted state
	 */
	getAllowedExtensions(): { id: string; name: string; allowed?: boolean; lastUsed?: number; trusted?: boolean }[];

	/**
	 * Grant access to this account for all specified extensions
	 * @param extensionIds Array of extension IDs to grant access to
	 */
	allowAccess(extensionIds: string[]): void;

	/**
	 * Remove access to this account for all specified extensions
	 * @param extensionIds Array of extension IDs to remove access from
	 */
	removeAccess(extensionIds: string[]): void;

	/**
	 * Execute a callback for each extension that has used this account
	 * @param callback Function to execute for each extension
	 */
	forEach(callback: (extensionQuery: IAccountExtensionQuery) => void): void;
}

/**
 * Query interface for operations on all MCP servers within a specific account
 */
export interface IAccountMcpServersQuery extends IBaseQuery {
	readonly accountName: string;

	/**
	 * Get all MCP servers that have access to this account with their trusted state
	 * @returns Array of objects containing MCP server data including trusted state
	 */
	getAllowedMcpServers(): { id: string; name: string; allowed?: boolean; lastUsed?: number; trusted?: boolean }[];

	/**
	 * Grant access to this account for all specified MCP servers
	 * @param mcpServerIds Array of MCP server IDs to grant access to
	 */
	allowAccess(mcpServerIds: string[]): void;

	/**
	 * Remove access to this account for all specified MCP servers
	 * @param mcpServerIds Array of MCP server IDs to remove access from
	 */
	removeAccess(mcpServerIds: string[]): void;

	/**
	 * Execute a callback for each MCP server that has used this account
	 * @param callback Function to execute for each MCP server
	 */
	forEach(callback: (mcpServerQuery: IAccountMcpServerQuery) => void): void;
}

/**
 * Query interface for type-agnostic operations on all entities (extensions and MCP servers) within a specific account
 */
export interface IAccountEntitiesQuery extends IBaseQuery {
	readonly accountName: string;

	/**
	 * Check if this account has been used by any entity (extension or MCP server)
	 * @returns True if the account has been used, false otherwise
	 */
	hasAnyUsage(): boolean;

	/**
	 * Get the total count of entities that have used this account
	 * @returns Object with counts for extensions and MCP servers
	 */
	getEntityCount(): { extensions: number; mcpServers: number; total: number };

	/**
	 * Remove access to this account for all entities (extensions and MCP servers)
	 */
	removeAllAccess(): void;

	/**
	 * Execute a callback for each entity that has used this account
	 * @param callback Function to execute for each entity
	 */
	forEach(callback: (entityId: string, entityType: 'extension' | 'mcpServer') => void): void;
}

/**
 * Query interface for operations on a specific extension within a provider
 */
export interface IProviderExtensionQuery extends IBaseQuery {
	readonly extensionId: string;

	/**
	 * Get the preferred account for this extension within this provider
	 * @returns The account name, or undefined if no preference is set
	 */
	getPreferredAccount(): string | undefined;

	/**
	 * Set the preferred account for this extension within this provider
	 * @param account The account to set as preferred
	 */
	setPreferredAccount(account: AuthenticationSessionAccount): void;

	/**
	 * Remove the account preference for this extension within this provider
	 */
	removeAccountPreference(): void;
}

/**
 * Query interface for operations on a specific MCP server within a provider
 */
export interface IProviderMcpServerQuery extends IBaseQuery {
	readonly mcpServerId: string;

	/**
	 * Get the last used account for this MCP server within a provider
	 * @returns The account name, or undefined if no preference is set
	 */
	getLastUsedAccount(): Promise<string | undefined>;

	/**
	 * Get the preferred account for this MCP server within a provider
	 * @returns The account name, or undefined if no preference is set
	 */
	getPreferredAccount(): string | undefined;

	/**
	 * Set the preferred account for this MCP server within a provider
	 * @param account The account to set as preferred
	 */
	setPreferredAccount(account: AuthenticationSessionAccount): void;

	/**
	 * Remove the account preference for this MCP server within a provider
	 */
	removeAccountPreference(): void;

	/**
	 * Get all accounts that this MCP server has used within this provider
	 * @returns Array of account names
	 */
	getUsedAccounts(): Promise<string[]>;
}

/**
 * Query interface for provider-scoped operations
 */
export interface IProviderQuery extends IBaseQuery {
	/**
	 * Get operations for a specific account within this provider
	 * @param accountName The account name
	 * @returns An account query interface
	 */
	account(accountName: string): IAccountQuery;

	/**
	 * Get operations for a specific extension within this provider
	 * @param extensionId The extension id
	 * @returns A provider-extension query interface
	 */
	extension(extensionId: string): IProviderExtensionQuery;

	/**
	 * Get operations for a specific MCP server within this provider
	 * @param mcpServerId The MCP server id
	 * @returns A provider-MCP server query interface
	 */
	mcpServer(mcpServerId: string): IProviderMcpServerQuery;

	/**
	 * Get information about active entities (extensions and MCP servers) within this provider
	 * @returns Information about entities that have used authentication
	 */
	getActiveEntities(): Promise<IActiveEntities>;

	/**
	 * Get all account names for this provider
	 * @returns Array of account names
	 */
	getAccountNames(): Promise<string[]>;

	/**
	 * Get usage statistics for this provider
	 * @returns Usage statistics
	 */
	getUsageStats(): Promise<IAuthenticationUsageStats>;

	/**
	 * Execute a callback for each account in this provider
	 * @param callback Function to execute for each account
	 */
	forEachAccount(callback: (accountQuery: IAccountQuery) => void): Promise<void>;
}

/**
 * Query interface for extension-scoped operations (cross-provider)
 */
export interface IExtensionQuery {
	readonly extensionId: string;

	/**
	 * Get all providers where this extension has access
	 * @param includeInternal Whether to include internal providers (starting with INTERNAL_AUTH_PROVIDER_PREFIX)
	 * @returns Array of provider IDs
	 */
	getProvidersWithAccess(includeInternal?: boolean): Promise<string[]>;

	/**
	 * Get account preferences for this extension across all providers
	 * @param includeInternal Whether to include internal providers (starting with INTERNAL_AUTH_PROVIDER_PREFIX)
	 * @returns Map of provider ID to account name
	 */
	getAllAccountPreferences(includeInternal?: boolean): Map<string, string>;

	/**
	 * Get operations for this extension within a specific provider
	 * @param providerId The provider ID
	 * @returns A provider-extension query interface
	 */
	provider(providerId: string): IProviderExtensionQuery;
}

/**
 * Query interface for MCP server-scoped operations (cross-provider)
 */
export interface IMcpServerQuery {
	readonly mcpServerId: string;

	/**
	 * Get all providers where this MCP server has access
	 * @param includeInternal Whether to include internal providers (starting with INTERNAL_AUTH_PROVIDER_PREFIX)
	 * @returns Array of provider IDs
	 */
	getProvidersWithAccess(includeInternal?: boolean): Promise<string[]>;

	/**
	 * Get account preferences for this MCP server across all providers
	 * @param includeInternal Whether to include internal providers (starting with INTERNAL_AUTH_PROVIDER_PREFIX)
	 * @returns Map of provider ID to account name
	 */
	getAllAccountPreferences(includeInternal?: boolean): Map<string, string>;

	/**
	 * Get operations for this MCP server within a specific provider
	 * @param providerId The provider ID
	 * @returns A provider-MCP server query interface
	 */
	provider(providerId: string): IProviderMcpServerQuery;
}

/**
 * Main authentication query service interface
 */
export const IAuthenticationQueryService = createDecorator<IAuthenticationQueryService>('IAuthenticationQueryService');
export interface IAuthenticationQueryService {
	readonly _serviceBrand: undefined;

	/**
	 * Fires when authentication preferences change
	 */
	readonly onDidChangePreferences: Event<{
		readonly providerId: string;
		readonly entityType: 'extension' | 'mcpServer';
		readonly entityIds: string[];
	}>;

	/**
	 * Fires when authentication access permissions change
	 */
	readonly onDidChangeAccess: Event<{
		readonly providerId: string;
		readonly accountName: string;
	}>;

	/**
	 * Get operations for a specific authentication provider
	 * @param providerId The authentication provider id
	 * @returns A provider query interface
	 */
	provider(providerId: string): IProviderQuery;

	/**
	 * Get operations for a specific extension across all providers
	 * @param extensionId The extension id
	 * @returns An extension query interface
	 */
	extension(extensionId: string): IExtensionQuery;

	/**
	 * Get operations for a specific MCP server across all providers
	 * @param mcpServerId The MCP server id
	 * @returns An MCP server query interface
	 */
	mcpServer(mcpServerId: string): IMcpServerQuery;

	/**
	 * Get all available provider IDs
	 * @returns Array of provider IDs
	 */
	getProviderIds(): string[];

	/**
	 * Clear all authentication data (for testing/debugging purposes)
	 * @param confirmation Must be 'CLEAR_ALL_AUTH_DATA' to confirm
	 * @param includeInternal Whether to include internal providers (defaults to true for complete clearing)
	 */
	clearAllData(confirmation: 'CLEAR_ALL_AUTH_DATA', includeInternal?: boolean): Promise<void>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/authentication/common/dynamicAuthenticationProviderStorage.ts]---
Location: vscode-main/src/vs/workbench/services/authentication/common/dynamicAuthenticationProviderStorage.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IAuthorizationTokenResponse } from '../../../../base/common/oauth.js';
import { Event } from '../../../../base/common/event.js';

export const IDynamicAuthenticationProviderStorageService = createDecorator<IDynamicAuthenticationProviderStorageService>('dynamicAuthenticationProviderStorageService');

export interface DynamicAuthenticationProviderInfo {
	readonly providerId: string;
	readonly label: string;
	/**
	 * @deprecated in favor of authorizationServer
	 */
	readonly issuer?: string;
	readonly authorizationServer: string;
	readonly clientId: string;
}

export interface DynamicAuthenticationProviderTokensChangeEvent {
	readonly authProviderId: string;
	readonly clientId: string;
	readonly tokens: (IAuthorizationTokenResponse & { created_at: number })[] | undefined;
}

/**
 * Service for managing storage of dynamic authentication provider data.
 */
export interface IDynamicAuthenticationProviderStorageService {
	readonly _serviceBrand: undefined;

	/**
	 * Event fired when tokens for a dynamic authentication provider change.
	 */
	readonly onDidChangeTokens: Event<DynamicAuthenticationProviderTokensChangeEvent>;

	/**
	 * Get the client details (ID and secret) for a dynamic authentication provider.
	 * @param providerId The provider ID or authorization server URL.
	 * @returns The client details if they exist, undefined otherwise.
	 */
	getClientRegistration(providerId: string): Promise<{ clientId?: string; clientSecret?: string } | undefined>;

	/**
	 * Store both client ID and client secret for a dynamic authentication provider.
	 * @param providerId The provider ID or authorization server URL.
	 * @param authorizationServer The authorization server URL for the provider.
	 * @param clientId The client ID to store.
	 * @param clientSecret Optional client secret to store.
	 * @param label Optional label for the provider.
	 */
	storeClientRegistration(providerId: string, authorizationServer: string, clientId: string, clientSecret?: string, label?: string): Promise<void>;

	/**
	 * Get all dynamic authentication providers that have been interacted with.
	 * @returns Array of provider information.
	 */
	getInteractedProviders(): ReadonlyArray<DynamicAuthenticationProviderInfo>;

	/**
	 * Remove a dynamic authentication provider and its stored data.
	 * @param providerId The provider ID to remove.
	 */
	removeDynamicProvider(providerId: string): Promise<void>;

	/**
	 * Get sessions for a dynamic authentication provider from secret storage.
	 * @param authProviderId The authentication provider ID.
	 * @param clientId The client ID.
	 * @returns Array of authorization tokens with creation timestamps, or undefined if none exist.
	 */
	getSessionsForDynamicAuthProvider(authProviderId: string, clientId: string): Promise<(IAuthorizationTokenResponse & { created_at: number })[] | undefined>;

	/**
	 * Set sessions for a dynamic authentication provider in secret storage.
	 * @param authProviderId The authentication provider ID.
	 * @param clientId The client ID.
	 * @param sessions Array of authorization tokens with creation timestamps.
	 */
	setSessionsForDynamicAuthProvider(authProviderId: string, clientId: string, sessions: (IAuthorizationTokenResponse & { created_at: number })[]): Promise<void>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/authentication/test/browser/authenticationAccessService.test.ts]---
Location: vscode-main/src/vs/workbench/services/authentication/test/browser/authenticationAccessService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { TestStorageService, TestProductService } from '../../../../test/common/workbenchTestServices.js';
import { AuthenticationAccessService, IAuthenticationAccessService } from '../../browser/authenticationAccessService.js';
import { AllowedExtension } from '../../common/authentication.js';

suite('AuthenticationAccessService', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let storageService: TestStorageService;
	let productService: IProductService & { trustedExtensionAuthAccess?: string[] | Record<string, string[]> };
	let authenticationAccessService: IAuthenticationAccessService;

	setup(() => {
		instantiationService = disposables.add(new TestInstantiationService());

		// Set up storage service
		storageService = disposables.add(new TestStorageService());
		instantiationService.stub(IStorageService, storageService);

		// Set up product service with no trusted extensions by default
		productService = { ...TestProductService, trustedExtensionAuthAccess: undefined };
		instantiationService.stub(IProductService, productService);

		// Create the service instance
		authenticationAccessService = disposables.add(instantiationService.createInstance(AuthenticationAccessService));
	});

	teardown(() => {
		// Reset product service configuration to prevent test interference
		if (productService) {
			productService.trustedExtensionAuthAccess = undefined;
		}
	});

	suite('isAccessAllowed', () => {
		test('returns undefined for unknown extension with no product configuration', () => {
			const result = authenticationAccessService.isAccessAllowed('github', 'user@example.com', 'unknown-extension');
			assert.strictEqual(result, undefined);
		});

		test('returns true for trusted extension from product.json (array format)', () => {
			productService.trustedExtensionAuthAccess = ['trusted-extension-1', 'trusted-extension-2'];

			const result = authenticationAccessService.isAccessAllowed('github', 'user@example.com', 'trusted-extension-1');
			assert.strictEqual(result, true);
		});

		test('returns true for trusted extension from product.json (object format)', () => {
			productService.trustedExtensionAuthAccess = {
				'github': ['github-extension'],
				'microsoft': ['microsoft-extension']
			};

			const result1 = authenticationAccessService.isAccessAllowed('github', 'user@example.com', 'github-extension');
			assert.strictEqual(result1, true);

			const result2 = authenticationAccessService.isAccessAllowed('microsoft', 'user@microsoft.com', 'microsoft-extension');
			assert.strictEqual(result2, true);
		});

		test('returns undefined for extension not in trusted list', () => {
			productService.trustedExtensionAuthAccess = ['trusted-extension'];

			const result = authenticationAccessService.isAccessAllowed('github', 'user@example.com', 'untrusted-extension');
			assert.strictEqual(result, undefined);
		});

		test('returns stored allowed state when extension is in storage', () => {
			// Add extension to storage
			authenticationAccessService.updateAllowedExtensions('github', 'user@example.com', [{
				id: 'stored-extension',
				name: 'Stored Extension',
				allowed: false
			}]);

			const result = authenticationAccessService.isAccessAllowed('github', 'user@example.com', 'stored-extension');
			assert.strictEqual(result, false);
		});

		test('returns true for extension in storage with allowed=true', () => {
			authenticationAccessService.updateAllowedExtensions('github', 'user@example.com', [{
				id: 'allowed-extension',
				name: 'Allowed Extension',
				allowed: true
			}]);

			const result = authenticationAccessService.isAccessAllowed('github', 'user@example.com', 'allowed-extension');
			assert.strictEqual(result, true);
		});

		test('returns true for extension in storage with undefined allowed property (legacy behavior)', () => {
			// Simulate legacy data where allowed property didn't exist
			const legacyExtension: AllowedExtension = {
				id: 'legacy-extension',
				name: 'Legacy Extension'
				// allowed property is undefined
			};

			authenticationAccessService.updateAllowedExtensions('github', 'user@example.com', [legacyExtension]);

			const result = authenticationAccessService.isAccessAllowed('github', 'user@example.com', 'legacy-extension');
			assert.strictEqual(result, true);
		});

		test('product.json trusted extensions take precedence over storage', () => {
			productService.trustedExtensionAuthAccess = ['product-trusted-extension'];

			// Try to store the same extension as not allowed
			authenticationAccessService.updateAllowedExtensions('github', 'user@example.com', [{
				id: 'product-trusted-extension',
				name: 'Product Trusted Extension',
				allowed: false
			}]);

			// Product.json should take precedence
			const result = authenticationAccessService.isAccessAllowed('github', 'user@example.com', 'product-trusted-extension');
			assert.strictEqual(result, true);
		});
	});

	suite('readAllowedExtensions', () => {
		test('returns empty array when no data exists', () => {
			const result = authenticationAccessService.readAllowedExtensions('github', 'user@example.com');
			assert.strictEqual(result.length, 0);
		});

		test('returns stored extensions', () => {
			const extensions: AllowedExtension[] = [
				{ id: 'extension1', name: 'Extension 1', allowed: true },
				{ id: 'extension2', name: 'Extension 2', allowed: false }
			];

			authenticationAccessService.updateAllowedExtensions('github', 'user@example.com', extensions);

			const result = authenticationAccessService.readAllowedExtensions('github', 'user@example.com');
			assert.strictEqual(result.length, 2);
			assert.strictEqual(result[0].id, 'extension1');
			assert.strictEqual(result[0].allowed, true);
			assert.strictEqual(result[1].id, 'extension2');
			assert.strictEqual(result[1].allowed, false);
		});

		test('includes trusted extensions from product.json (array format)', () => {
			productService.trustedExtensionAuthAccess = ['trusted-extension-1', 'trusted-extension-2'];

			const result = authenticationAccessService.readAllowedExtensions('github', 'user@example.com');
			assert.strictEqual(result.length, 2);

			const trustedExtension1 = result.find(e => e.id === 'trusted-extension-1');
			assert.ok(trustedExtension1);
			assert.strictEqual(trustedExtension1.allowed, true);
			assert.strictEqual(trustedExtension1.trusted, true);
			assert.strictEqual(trustedExtension1.name, 'trusted-extension-1'); // Should default to ID

			const trustedExtension2 = result.find(e => e.id === 'trusted-extension-2');
			assert.ok(trustedExtension2);
			assert.strictEqual(trustedExtension2.allowed, true);
			assert.strictEqual(trustedExtension2.trusted, true);
		});

		test('includes trusted extensions from product.json (object format)', () => {
			productService.trustedExtensionAuthAccess = {
				'github': ['github-extension'],
				'microsoft': ['microsoft-extension']
			};

			const githubResult = authenticationAccessService.readAllowedExtensions('github', 'user@example.com');
			assert.strictEqual(githubResult.length, 1);
			assert.strictEqual(githubResult[0].id, 'github-extension');
			assert.strictEqual(githubResult[0].trusted, true);

			const microsoftResult = authenticationAccessService.readAllowedExtensions('microsoft', 'user@microsoft.com');
			assert.strictEqual(microsoftResult.length, 1);
			assert.strictEqual(microsoftResult[0].id, 'microsoft-extension');
			assert.strictEqual(microsoftResult[0].trusted, true);

			// Provider not in trusted list should return empty (no stored extensions)
			const unknownResult = authenticationAccessService.readAllowedExtensions('unknown', 'user@unknown.com');
			assert.strictEqual(unknownResult.length, 0);
		});

		test('merges stored extensions with trusted extensions from product.json', () => {
			productService.trustedExtensionAuthAccess = ['trusted-extension'];

			// Add some stored extensions
			authenticationAccessService.updateAllowedExtensions('github', 'user@example.com', [
				{ id: 'stored-extension', name: 'Stored Extension', allowed: false }
			]);

			const result = authenticationAccessService.readAllowedExtensions('github', 'user@example.com');
			assert.strictEqual(result.length, 2);

			const trustedExtension = result.find(e => e.id === 'trusted-extension');
			assert.ok(trustedExtension);
			assert.strictEqual(trustedExtension.trusted, true);
			assert.strictEqual(trustedExtension.allowed, true);

			const storedExtension = result.find(e => e.id === 'stored-extension');
			assert.ok(storedExtension);
			assert.strictEqual(storedExtension.trusted, undefined);
			assert.strictEqual(storedExtension.allowed, false);
		});

		test('updates existing stored extension to trusted when found in product.json', () => {
			// First add an extension to storage
			authenticationAccessService.updateAllowedExtensions('github', 'user@example.com', [
				{ id: 'extension1', name: 'Extension 1', allowed: false }
			]);

			// Then add it to trusted list
			productService.trustedExtensionAuthAccess = ['extension1'];

			const result = authenticationAccessService.readAllowedExtensions('github', 'user@example.com');
			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0].id, 'extension1');
			assert.strictEqual(result[0].trusted, true);
			assert.strictEqual(result[0].allowed, true); // Should be marked as allowed due to being trusted
		});

		test('handles malformed storage data gracefully', () => {
			// Directly store malformed data in storage
			storageService.store('github-user@example.com', 'invalid-json', StorageScope.APPLICATION, StorageTarget.USER);

			const result = authenticationAccessService.readAllowedExtensions('github', 'user@example.com');
			assert.strictEqual(result.length, 0); // Should return empty array instead of throwing
		});
	});

	suite('updateAllowedExtensions', () => {
		test('adds new extensions to storage', () => {
			const extensions: AllowedExtension[] = [
				{ id: 'extension1', name: 'Extension 1', allowed: true },
				{ id: 'extension2', name: 'Extension 2', allowed: false }
			];

			authenticationAccessService.updateAllowedExtensions('github', 'user@example.com', extensions);

			const result = authenticationAccessService.readAllowedExtensions('github', 'user@example.com');
			assert.strictEqual(result.length, 2);
			assert.strictEqual(result[0].id, 'extension1');
			assert.strictEqual(result[1].id, 'extension2');
		});

		test('updates existing extension allowed status', () => {
			// First add an extension
			authenticationAccessService.updateAllowedExtensions('github', 'user@example.com', [
				{ id: 'extension1', name: 'Extension 1', allowed: true }
			]);

			// Then update its allowed status
			authenticationAccessService.updateAllowedExtensions('github', 'user@example.com', [
				{ id: 'extension1', name: 'Extension 1', allowed: false }
			]);

			const result = authenticationAccessService.readAllowedExtensions('github', 'user@example.com');
			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0].allowed, false);
		});

		test('updates existing extension name when new name is provided', () => {
			// First add an extension with default name
			authenticationAccessService.updateAllowedExtensions('github', 'user@example.com', [
				{ id: 'extension1', name: 'extension1', allowed: true }
			]);

			// Then update with a proper name
			authenticationAccessService.updateAllowedExtensions('github', 'user@example.com', [
				{ id: 'extension1', name: 'My Extension', allowed: true }
			]);

			const result = authenticationAccessService.readAllowedExtensions('github', 'user@example.com');
			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0].name, 'My Extension');
		});

		test('does not update name when new name is same as ID', () => {
			// First add an extension with a proper name
			authenticationAccessService.updateAllowedExtensions('github', 'user@example.com', [
				{ id: 'extension1', name: 'My Extension', allowed: true }
			]);

			// Then try to update with ID as name (should keep existing name)
			authenticationAccessService.updateAllowedExtensions('github', 'user@example.com', [
				{ id: 'extension1', name: 'extension1', allowed: false }
			]);

			const result = authenticationAccessService.readAllowedExtensions('github', 'user@example.com');
			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0].name, 'My Extension'); // Should keep the original name
			assert.strictEqual(result[0].allowed, false); // But update the allowed status
		});

		test('does not store trusted extensions - they should only come from product.json', () => {
			productService.trustedExtensionAuthAccess = ['trusted-extension'];

			// Try to store a trusted extension along with regular extensions
			authenticationAccessService.updateAllowedExtensions('github', 'user@example.com', [
				{ id: 'regular-extension', name: 'Regular Extension', allowed: true },
				{ id: 'trusted-extension', name: 'Trusted Extension', allowed: false }
			]);

			// Check what's actually stored in storage (should only be the regular extension)
			const storedData = storageService.get('github-user@example.com', StorageScope.APPLICATION);
			assert.ok(storedData);
			const parsedData = JSON.parse(storedData);
			assert.strictEqual(parsedData.length, 1);
			assert.strictEqual(parsedData[0].id, 'regular-extension');

			// But when we read, we should get both (trusted from product.json + stored)
			const result = authenticationAccessService.readAllowedExtensions('github', 'user@example.com');
			assert.strictEqual(result.length, 2);

			const trustedExt = result.find(e => e.id === 'trusted-extension');
			assert.ok(trustedExt);
			assert.strictEqual(trustedExt.trusted, true);
			assert.strictEqual(trustedExt.allowed, true); // Should be true from product.json, not false from storage

			const regularExt = result.find(e => e.id === 'regular-extension');
			assert.ok(regularExt);
			assert.strictEqual(regularExt.trusted, undefined);
			assert.strictEqual(regularExt.allowed, true);
		});

		test('filters out trusted extensions before storing', () => {
			productService.trustedExtensionAuthAccess = ['trusted-ext-1', 'trusted-ext-2'];

			// Add both trusted and regular extensions
			const extensions: AllowedExtension[] = [
				{ id: 'regular-ext', name: 'Regular Extension', allowed: true },
				{ id: 'trusted-ext-1', name: 'Trusted Extension 1', allowed: false },
				{ id: 'another-regular-ext', name: 'Another Regular Extension', allowed: false },
				{ id: 'trusted-ext-2', name: 'Trusted Extension 2', allowed: true }
			];

			authenticationAccessService.updateAllowedExtensions('github', 'user@example.com', extensions);

			// Check storage - should only contain regular extensions
			const storedData = storageService.get('github-user@example.com', StorageScope.APPLICATION);
			assert.ok(storedData);
			const parsedData = JSON.parse(storedData);
			assert.strictEqual(parsedData.length, 2);
			assert.ok(parsedData.find((e: AllowedExtension) => e.id === 'regular-ext'));
			assert.ok(parsedData.find((e: AllowedExtension) => e.id === 'another-regular-ext'));
			assert.ok(!parsedData.find((e: AllowedExtension) => e.id === 'trusted-ext-1'));
			assert.ok(!parsedData.find((e: AllowedExtension) => e.id === 'trusted-ext-2'));
		});

		test('fires onDidChangeExtensionSessionAccess event', () => {
			let eventFired = false;
			let eventData: { providerId: string; accountName: string } | undefined;

			const subscription = authenticationAccessService.onDidChangeExtensionSessionAccess(e => {
				eventFired = true;
				eventData = e;
			});
			disposables.add(subscription);

			authenticationAccessService.updateAllowedExtensions('github', 'user@example.com', [
				{ id: 'extension1', name: 'Extension 1', allowed: true }
			]);

			assert.strictEqual(eventFired, true);
			assert.ok(eventData);
			assert.strictEqual(eventData.providerId, 'github');
			assert.strictEqual(eventData.accountName, 'user@example.com');
		});
	});

	suite('removeAllowedExtensions', () => {
		test('removes all extensions from storage', () => {
			// First add some extensions
			authenticationAccessService.updateAllowedExtensions('github', 'user@example.com', [
				{ id: 'extension1', name: 'Extension 1', allowed: true },
				{ id: 'extension2', name: 'Extension 2', allowed: false }
			]);

			// Verify they exist
			const result = authenticationAccessService.readAllowedExtensions('github', 'user@example.com');
			assert.ok(result.length > 0);

			// Remove them
			authenticationAccessService.removeAllowedExtensions('github', 'user@example.com');

			// Verify storage is empty (but trusted extensions from product.json might still be there)
			const storedData = storageService.get('github-user@example.com', StorageScope.APPLICATION);
			assert.strictEqual(storedData, undefined);
		});

		test('fires onDidChangeExtensionSessionAccess event', () => {
			let eventFired = false;
			let eventData: { providerId: string; accountName: string } | undefined;

			// First add an extension
			authenticationAccessService.updateAllowedExtensions('github', 'user@example.com', [
				{ id: 'extension1', name: 'Extension 1', allowed: true }
			]);

			// Then listen for the remove event
			const subscription = authenticationAccessService.onDidChangeExtensionSessionAccess(e => {
				eventFired = true;
				eventData = e;
			});
			disposables.add(subscription);

			authenticationAccessService.removeAllowedExtensions('github', 'user@example.com');

			assert.strictEqual(eventFired, true);
			assert.ok(eventData);
			assert.strictEqual(eventData.providerId, 'github');
			assert.strictEqual(eventData.accountName, 'user@example.com');
		});

		test('does not affect trusted extensions from product.json', () => {
			productService.trustedExtensionAuthAccess = ['trusted-extension'];

			// Add some regular extensions and verify both trusted and regular exist
			authenticationAccessService.updateAllowedExtensions('github', 'user@example.com', [
				{ id: 'regular-extension', name: 'Regular Extension', allowed: true }
			]);

			let result = authenticationAccessService.readAllowedExtensions('github', 'user@example.com');
			assert.strictEqual(result.length, 2); // 1 trusted + 1 regular

			// Remove stored extensions
			authenticationAccessService.removeAllowedExtensions('github', 'user@example.com');

			// Trusted extension should still be there
			result = authenticationAccessService.readAllowedExtensions('github', 'user@example.com');
			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0].id, 'trusted-extension');
			assert.strictEqual(result[0].trusted, true);
		});
	});

	suite('integration with product.json configurations', () => {
		test('handles switching between array and object format', () => {
			// Start with array format
			productService.trustedExtensionAuthAccess = ['ext1', 'ext2'];
			let result = authenticationAccessService.readAllowedExtensions('github', 'user@example.com');
			assert.strictEqual(result.length, 2);

			// Switch to object format
			productService.trustedExtensionAuthAccess = {
				'github': ['ext1', 'ext3'],
				'microsoft': ['ext4']
			};
			result = authenticationAccessService.readAllowedExtensions('github', 'user@example.com');
			assert.strictEqual(result.length, 2); // ext1 and ext3 for github
			assert.ok(result.find(e => e.id === 'ext1'));
			assert.ok(result.find(e => e.id === 'ext3'));
			assert.ok(!result.find(e => e.id === 'ext2')); // Should not be there anymore
		});

		test('handles empty trusted extension configurations', () => {
			// Test undefined
			productService.trustedExtensionAuthAccess = undefined;
			let result = authenticationAccessService.readAllowedExtensions('github', 'user@example.com');
			assert.strictEqual(result.length, 0);

			// Test empty array
			productService.trustedExtensionAuthAccess = [];
			result = authenticationAccessService.readAllowedExtensions('github', 'user@example.com');
			assert.strictEqual(result.length, 0);

			// Test empty object
			productService.trustedExtensionAuthAccess = {};
			result = authenticationAccessService.readAllowedExtensions('github', 'user@example.com');
			assert.strictEqual(result.length, 0);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/authentication/test/browser/authenticationMcpAccessService.test.ts]---
Location: vscode-main/src/vs/workbench/services/authentication/test/browser/authenticationMcpAccessService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { TestStorageService, TestProductService } from '../../../../test/common/workbenchTestServices.js';
import { AuthenticationMcpAccessService, AllowedMcpServer, IAuthenticationMcpAccessService } from '../../browser/authenticationMcpAccessService.js';

suite('AuthenticationMcpAccessService', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let storageService: TestStorageService;
	let productService: IProductService & { trustedMcpAuthAccess?: string[] | Record<string, string[]> };
	let authenticationMcpAccessService: IAuthenticationMcpAccessService;

	setup(() => {
		instantiationService = disposables.add(new TestInstantiationService());

		// Set up storage service
		storageService = disposables.add(new TestStorageService());
		instantiationService.stub(IStorageService, storageService);

		// Set up product service with no trusted servers by default
		productService = { ...TestProductService };
		instantiationService.stub(IProductService, productService);

		// Create the service instance
		authenticationMcpAccessService = disposables.add(instantiationService.createInstance(AuthenticationMcpAccessService));
	});

	suite('isAccessAllowed', () => {
		test('returns undefined for unknown MCP server with no product configuration', () => {
			const result = authenticationMcpAccessService.isAccessAllowed('github', 'user@example.com', 'unknown-server');
			assert.strictEqual(result, undefined);
		});

		test('returns true for trusted MCP server from product.json (array format)', () => {
			productService.trustedMcpAuthAccess = ['trusted-server-1', 'trusted-server-2'];

			const result = authenticationMcpAccessService.isAccessAllowed('github', 'user@example.com', 'trusted-server-1');
			assert.strictEqual(result, true);
		});

		test('returns true for trusted MCP server from product.json (object format)', () => {
			productService.trustedMcpAuthAccess = {
				'github': ['github-server'],
				'microsoft': ['microsoft-server']
			};

			const result1 = authenticationMcpAccessService.isAccessAllowed('github', 'user@example.com', 'github-server');
			assert.strictEqual(result1, true);

			const result2 = authenticationMcpAccessService.isAccessAllowed('microsoft', 'user@microsoft.com', 'microsoft-server');
			assert.strictEqual(result2, true);
		});

		test('returns undefined for MCP server not in trusted list', () => {
			productService.trustedMcpAuthAccess = ['trusted-server'];

			const result = authenticationMcpAccessService.isAccessAllowed('github', 'user@example.com', 'untrusted-server');
			assert.strictEqual(result, undefined);
		});

		test('returns stored allowed state when server is in storage', () => {
			// Add server to storage
			authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', [{
				id: 'stored-server',
				name: 'Stored Server',
				allowed: false
			}]);

			const result = authenticationMcpAccessService.isAccessAllowed('github', 'user@example.com', 'stored-server');
			assert.strictEqual(result, false);
		});

		test('returns true for server in storage with allowed=true', () => {
			authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', [{
				id: 'allowed-server',
				name: 'Allowed Server',
				allowed: true
			}]);

			const result = authenticationMcpAccessService.isAccessAllowed('github', 'user@example.com', 'allowed-server');
			assert.strictEqual(result, true);
		});

		test('returns true for server in storage with undefined allowed property (legacy behavior)', () => {
			// Simulate legacy data where allowed property didn't exist
			const legacyServer: AllowedMcpServer = {
				id: 'legacy-server',
				name: 'Legacy Server'
				// allowed property is undefined
			};

			authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', [legacyServer]);

			const result = authenticationMcpAccessService.isAccessAllowed('github', 'user@example.com', 'legacy-server');
			assert.strictEqual(result, true);
		});

		test('product.json trusted servers take precedence over storage', () => {
			productService.trustedMcpAuthAccess = ['product-trusted-server'];

			// Try to store the same server as not allowed
			authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', [{
				id: 'product-trusted-server',
				name: 'Product Trusted Server',
				allowed: false
			}]);

			// Product.json should take precedence
			const result = authenticationMcpAccessService.isAccessAllowed('github', 'user@example.com', 'product-trusted-server');
			assert.strictEqual(result, true);
		});
	});

	suite('readAllowedMcpServers', () => {
		test('returns empty array when no data exists', () => {
			const result = authenticationMcpAccessService.readAllowedMcpServers('github', 'user@example.com');
			assert.strictEqual(result.length, 0);
		});

		test('returns stored MCP servers', () => {
			const servers: AllowedMcpServer[] = [
				{ id: 'server1', name: 'Server 1', allowed: true },
				{ id: 'server2', name: 'Server 2', allowed: false }
			];

			authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', servers);

			const result = authenticationMcpAccessService.readAllowedMcpServers('github', 'user@example.com');
			assert.strictEqual(result.length, 2);
			assert.strictEqual(result[0].id, 'server1');
			assert.strictEqual(result[0].allowed, true);
			assert.strictEqual(result[1].id, 'server2');
			assert.strictEqual(result[1].allowed, false);
		});

		test('includes trusted servers from product.json (array format)', () => {
			productService.trustedMcpAuthAccess = ['trusted-server-1', 'trusted-server-2'];

			const result = authenticationMcpAccessService.readAllowedMcpServers('github', 'user@example.com');
			assert.strictEqual(result.length, 2);

			const trustedServer1 = result.find(s => s.id === 'trusted-server-1');
			assert.ok(trustedServer1);
			assert.strictEqual(trustedServer1.allowed, true);
			assert.strictEqual(trustedServer1.trusted, true);
			assert.strictEqual(trustedServer1.name, 'trusted-server-1'); // Should default to ID

			const trustedServer2 = result.find(s => s.id === 'trusted-server-2');
			assert.ok(trustedServer2);
			assert.strictEqual(trustedServer2.allowed, true);
			assert.strictEqual(trustedServer2.trusted, true);
		});

		test('includes trusted servers from product.json (object format)', () => {
			productService.trustedMcpAuthAccess = {
				'github': ['github-server'],
				'microsoft': ['microsoft-server']
			};

			const githubResult = authenticationMcpAccessService.readAllowedMcpServers('github', 'user@example.com');
			assert.strictEqual(githubResult.length, 1);
			assert.strictEqual(githubResult[0].id, 'github-server');
			assert.strictEqual(githubResult[0].trusted, true);

			const microsoftResult = authenticationMcpAccessService.readAllowedMcpServers('microsoft', 'user@microsoft.com');
			assert.strictEqual(microsoftResult.length, 1);
			assert.strictEqual(microsoftResult[0].id, 'microsoft-server');
			assert.strictEqual(microsoftResult[0].trusted, true);

			// Provider not in trusted list should return empty (no stored servers)
			const unknownResult = authenticationMcpAccessService.readAllowedMcpServers('unknown', 'user@unknown.com');
			assert.strictEqual(unknownResult.length, 0);
		});

		test('merges stored servers with trusted servers from product.json', () => {
			productService.trustedMcpAuthAccess = ['trusted-server'];

			// Add some stored servers
			authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', [
				{ id: 'stored-server', name: 'Stored Server', allowed: false }
			]);

			const result = authenticationMcpAccessService.readAllowedMcpServers('github', 'user@example.com');
			assert.strictEqual(result.length, 2);

			const trustedServer = result.find(s => s.id === 'trusted-server');
			assert.ok(trustedServer);
			assert.strictEqual(trustedServer.trusted, true);
			assert.strictEqual(trustedServer.allowed, true);

			const storedServer = result.find(s => s.id === 'stored-server');
			assert.ok(storedServer);
			assert.strictEqual(storedServer.trusted, undefined);
			assert.strictEqual(storedServer.allowed, false);
		});

		test('updates existing stored server to be trusted when it appears in product.json', () => {
			// First add a server as stored (not trusted)
			authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', [
				{ id: 'server-1', name: 'Server 1', allowed: false }
			]);

			// Then make it trusted via product.json
			productService.trustedMcpAuthAccess = ['server-1'];

			const result = authenticationMcpAccessService.readAllowedMcpServers('github', 'user@example.com');
			assert.strictEqual(result.length, 1);

			const server = result[0];
			assert.strictEqual(server.id, 'server-1');
			assert.strictEqual(server.allowed, true); // Should be overridden to true
			assert.strictEqual(server.trusted, true); // Should be marked as trusted
			assert.strictEqual(server.name, 'Server 1'); // Should keep existing name
		});

		test('handles malformed JSON in storage gracefully', () => {
			// Manually corrupt the storage
			storageService.store('mcpserver-github-user@example.com', 'invalid json', StorageScope.APPLICATION, StorageTarget.USER);

			// Should return empty array instead of throwing
			const result = authenticationMcpAccessService.readAllowedMcpServers('github', 'user@example.com');
			assert.strictEqual(result.length, 0);
		});

		test('handles non-array product.json configuration gracefully', () => {
			// Set up invalid configuration
			// eslint-disable-next-line local/code-no-any-casts
			productService.trustedMcpAuthAccess = 'invalid-string' as any;

			const result = authenticationMcpAccessService.readAllowedMcpServers('github', 'user@example.com');
			assert.strictEqual(result.length, 0);
		});
	});

	suite('updateAllowedMcpServers', () => {
		test('stores new MCP servers', () => {
			const servers: AllowedMcpServer[] = [
				{ id: 'server1', name: 'Server 1', allowed: true },
				{ id: 'server2', name: 'Server 2', allowed: false }
			];

			authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', servers);

			const result = authenticationMcpAccessService.readAllowedMcpServers('github', 'user@example.com');
			assert.strictEqual(result.length, 2);
			assert.strictEqual(result[0].id, 'server1');
			assert.strictEqual(result[1].id, 'server2');
		});

		test('updates existing MCP server allowed status', () => {
			// First add a server
			authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', [
				{ id: 'server1', name: 'Server 1', allowed: true }
			]);

			// Then update its allowed status
			authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', [
				{ id: 'server1', name: 'Server 1', allowed: false }
			]);

			const result = authenticationMcpAccessService.readAllowedMcpServers('github', 'user@example.com');
			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0].allowed, false);
		});

		test('updates existing MCP server name when new name is provided', () => {
			// First add a server with default name
			authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', [
				{ id: 'server1', name: 'server1', allowed: true }
			]);

			// Then update with a proper name
			authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', [
				{ id: 'server1', name: 'My Server', allowed: true }
			]);

			const result = authenticationMcpAccessService.readAllowedMcpServers('github', 'user@example.com');
			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0].name, 'My Server');
		});

		test('does not update name when new name is same as ID', () => {
			// First add a server with a proper name
			authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', [
				{ id: 'server1', name: 'My Server', allowed: true }
			]);

			// Then try to update with ID as name (should keep existing name)
			authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', [
				{ id: 'server1', name: 'server1', allowed: false }
			]);

			const result = authenticationMcpAccessService.readAllowedMcpServers('github', 'user@example.com');
			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0].name, 'My Server'); // Should keep original name
			assert.strictEqual(result[0].allowed, false); // But allowed status should update
		});

		test('adds new servers while preserving existing ones', () => {
			// First add one server
			authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', [
				{ id: 'server1', name: 'Server 1', allowed: true }
			]);

			// Then add another server
			authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', [
				{ id: 'server2', name: 'Server 2', allowed: false }
			]);

			const result = authenticationMcpAccessService.readAllowedMcpServers('github', 'user@example.com');
			assert.strictEqual(result.length, 2);

			const server1 = result.find(s => s.id === 'server1');
			const server2 = result.find(s => s.id === 'server2');
			assert.ok(server1);
			assert.ok(server2);
			assert.strictEqual(server1.allowed, true);
			assert.strictEqual(server2.allowed, false);
		});

		test('does not store trusted servers from product.json', () => {
			productService.trustedMcpAuthAccess = ['trusted-server'];

			// Try to update a trusted server
			authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', [
				{ id: 'trusted-server', name: 'Trusted Server', allowed: false, trusted: true },
				{ id: 'user-server', name: 'User Server', allowed: true }
			]);

			// Check what's actually stored in storage (not including product.json servers)
			const storageKey = 'mcpserver-github-user@example.com';
			const storedData = JSON.parse(storageService.get(storageKey, StorageScope.APPLICATION) || '[]');

			// Should only contain the user-managed server, not the trusted one
			assert.strictEqual(storedData.length, 1);
			assert.strictEqual(storedData[0].id, 'user-server');

			// But readAllowedMcpServers should return both (including trusted from product.json)
			const allServers = authenticationMcpAccessService.readAllowedMcpServers('github', 'user@example.com');
			assert.strictEqual(allServers.length, 2);
		});

		test('fires onDidChangeMcpSessionAccess event', () => {
			let eventFired = false;
			let eventData: { providerId: string; accountName: string } | undefined;

			const disposable = authenticationMcpAccessService.onDidChangeMcpSessionAccess(event => {
				eventFired = true;
				eventData = event;
			});

			try {
				authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', [
					{ id: 'server1', name: 'Server 1', allowed: true }
				]);

				assert.strictEqual(eventFired, true);
				assert.ok(eventData);
				assert.strictEqual(eventData.providerId, 'github');
				assert.strictEqual(eventData.accountName, 'user@example.com');
			} finally {
				disposable.dispose();
			}
		});
	});

	suite('removeAllowedMcpServers', () => {
		test('removes all stored MCP servers for account', () => {
			// First add some servers
			authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', [
				{ id: 'server1', name: 'Server 1', allowed: true },
				{ id: 'server2', name: 'Server 2', allowed: false }
			]);

			// Verify they exist
			let result = authenticationMcpAccessService.readAllowedMcpServers('github', 'user@example.com');
			assert.strictEqual(result.length, 2);

			// Remove them
			authenticationMcpAccessService.removeAllowedMcpServers('github', 'user@example.com');

			// Verify they're gone
			result = authenticationMcpAccessService.readAllowedMcpServers('github', 'user@example.com');
			assert.strictEqual(result.length, 0);
		});

		test('does not affect trusted servers from product.json', () => {
			productService.trustedMcpAuthAccess = ['trusted-server'];

			// Add some user-managed servers
			authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', [
				{ id: 'user-server', name: 'User Server', allowed: true }
			]);

			// Verify both trusted and user servers exist
			let result = authenticationMcpAccessService.readAllowedMcpServers('github', 'user@example.com');
			assert.strictEqual(result.length, 2);

			// Remove user servers
			authenticationMcpAccessService.removeAllowedMcpServers('github', 'user@example.com');

			// Should still have trusted server
			result = authenticationMcpAccessService.readAllowedMcpServers('github', 'user@example.com');
			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0].id, 'trusted-server');
			assert.strictEqual(result[0].trusted, true);
		});

		test('fires onDidChangeMcpSessionAccess event', () => {
			let eventFired = false;
			let eventData: { providerId: string; accountName: string } | undefined;

			const disposable = authenticationMcpAccessService.onDidChangeMcpSessionAccess(event => {
				eventFired = true;
				eventData = event;
			});

			try {
				authenticationMcpAccessService.removeAllowedMcpServers('github', 'user@example.com');

				assert.strictEqual(eventFired, true);
				assert.ok(eventData);
				assert.strictEqual(eventData.providerId, 'github');
				assert.strictEqual(eventData.accountName, 'user@example.com');
			} finally {
				disposable.dispose();
			}
		});

		test('handles removal of non-existent data gracefully', () => {
			// Should not throw when trying to remove data that doesn't exist
			assert.doesNotThrow(() => {
				authenticationMcpAccessService.removeAllowedMcpServers('nonexistent', 'user@example.com');
			});
		});
	});

	suite('onDidChangeMcpSessionAccess event', () => {
		test('event is fired for each update operation', () => {
			const events: Array<{ providerId: string; accountName: string }> = [];

			const disposable = authenticationMcpAccessService.onDidChangeMcpSessionAccess(event => {
				events.push(event);
			});

			try {
				// Should fire for update
				authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', [
					{ id: 'server1', name: 'Server 1', allowed: true }
				]);

				// Should fire for remove
				authenticationMcpAccessService.removeAllowedMcpServers('github', 'user@example.com');

				// Should fire for different account
				authenticationMcpAccessService.updateAllowedMcpServers('microsoft', 'admin@company.com', [
					{ id: 'server2', name: 'Server 2', allowed: false }
				]);

				assert.strictEqual(events.length, 3);
				assert.strictEqual(events[0].providerId, 'github');
				assert.strictEqual(events[0].accountName, 'user@example.com');
				assert.strictEqual(events[1].providerId, 'github');
				assert.strictEqual(events[1].accountName, 'user@example.com');
				assert.strictEqual(events[2].providerId, 'microsoft');
				assert.strictEqual(events[2].accountName, 'admin@company.com');
			} finally {
				disposable.dispose();
			}
		});

		test('multiple listeners receive events', () => {
			let listener1Fired = false;
			let listener2Fired = false;

			const disposable1 = authenticationMcpAccessService.onDidChangeMcpSessionAccess(() => {
				listener1Fired = true;
			});

			const disposable2 = authenticationMcpAccessService.onDidChangeMcpSessionAccess(() => {
				listener2Fired = true;
			});

			try {
				authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', [
					{ id: 'server1', name: 'Server 1', allowed: true }
				]);

				assert.strictEqual(listener1Fired, true);
				assert.strictEqual(listener2Fired, true);
			} finally {
				disposable1.dispose();
				disposable2.dispose();
			}
		});
	});

	suite('integration scenarios', () => {
		test('complete workflow: add, update, query, remove', () => {
			const providerId = 'github';
			const accountName = 'user@example.com';
			const serverId = 'test-server';

			// Initially unknown
			assert.strictEqual(
				authenticationMcpAccessService.isAccessAllowed(providerId, accountName, serverId),
				undefined
			);

			// Add server as allowed
			authenticationMcpAccessService.updateAllowedMcpServers(providerId, accountName, [
				{ id: serverId, name: 'Test Server', allowed: true }
			]);

			assert.strictEqual(
				authenticationMcpAccessService.isAccessAllowed(providerId, accountName, serverId),
				true
			);

			// Update to disallowed
			authenticationMcpAccessService.updateAllowedMcpServers(providerId, accountName, [
				{ id: serverId, name: 'Test Server', allowed: false }
			]);

			assert.strictEqual(
				authenticationMcpAccessService.isAccessAllowed(providerId, accountName, serverId),
				false
			);

			// Remove all
			authenticationMcpAccessService.removeAllowedMcpServers(providerId, accountName);

			assert.strictEqual(
				authenticationMcpAccessService.isAccessAllowed(providerId, accountName, serverId),
				undefined
			);
		});

		test('multiple providers and accounts are isolated', () => {
			// Add data for different combinations
			authenticationMcpAccessService.updateAllowedMcpServers('github', 'user1@example.com', [
				{ id: 'server1', name: 'Server 1', allowed: true }
			]);

			authenticationMcpAccessService.updateAllowedMcpServers('github', 'user2@example.com', [
				{ id: 'server1', name: 'Server 1', allowed: false }
			]);

			authenticationMcpAccessService.updateAllowedMcpServers('microsoft', 'user1@example.com', [
				{ id: 'server1', name: 'Server 1', allowed: true }
			]);

			// Verify isolation
			assert.strictEqual(
				authenticationMcpAccessService.isAccessAllowed('github', 'user1@example.com', 'server1'),
				true
			);
			assert.strictEqual(
				authenticationMcpAccessService.isAccessAllowed('github', 'user2@example.com', 'server1'),
				false
			);
			assert.strictEqual(
				authenticationMcpAccessService.isAccessAllowed('microsoft', 'user1@example.com', 'server1'),
				true
			);

			// Non-existent combinations should return undefined
			assert.strictEqual(
				authenticationMcpAccessService.isAccessAllowed('microsoft', 'user2@example.com', 'server1'),
				undefined
			);
		});

		test('product.json configuration takes precedence in all scenarios', () => {
			productService.trustedMcpAuthAccess = {
				'github': ['trusted-server'],
				'microsoft': ['microsoft-trusted']
			};

			// Trusted servers should always return true regardless of storage
			assert.strictEqual(
				authenticationMcpAccessService.isAccessAllowed('github', 'user@example.com', 'trusted-server'),
				true
			);

			// Try to override via storage
			authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', [
				{ id: 'trusted-server', name: 'Trusted Server', allowed: false }
			]);

			// Should still return true
			assert.strictEqual(
				authenticationMcpAccessService.isAccessAllowed('github', 'user@example.com', 'trusted-server'),
				true
			);

			// But non-trusted servers should still respect storage
			authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', [
				{ id: 'user-server', name: 'User Server', allowed: false }
			]);

			assert.strictEqual(
				authenticationMcpAccessService.isAccessAllowed('github', 'user@example.com', 'user-server'),
				false
			);
		});

		test('handles edge cases with empty or null values', () => {
			// Empty provider/account names
			assert.doesNotThrow(() => {
				authenticationMcpAccessService.isAccessAllowed('', '', 'server1');
			});

			// Empty server arrays
			assert.doesNotThrow(() => {
				authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', []);
			});

			// Empty server ID/name
			assert.doesNotThrow(() => {
				authenticationMcpAccessService.updateAllowedMcpServers('github', 'user@example.com', [
					{ id: '', name: '', allowed: true }
				]);
			});
		});
	});
});
```

--------------------------------------------------------------------------------

````

---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 497
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 497 of 552)

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

---[FILE: src/vs/workbench/services/authentication/test/browser/authenticationQueryService.test.ts]---
Location: vscode-main/src/vs/workbench/services/authentication/test/browser/authenticationQueryService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ILogService, NullLogService } from '../../../../../platform/log/common/log.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { IAuthenticationQueryService } from '../../common/authenticationQuery.js';
import { AuthenticationQueryService } from '../../browser/authenticationQueryService.js';
import { IAuthenticationService, IAuthenticationExtensionsService } from '../../common/authentication.js';
import { IAuthenticationUsageService } from '../../browser/authenticationUsageService.js';
import { IAuthenticationMcpUsageService } from '../../browser/authenticationMcpUsageService.js';
import { IAuthenticationAccessService } from '../../browser/authenticationAccessService.js';
import { IAuthenticationMcpAccessService } from '../../browser/authenticationMcpAccessService.js';
import { IAuthenticationMcpService } from '../../browser/authenticationMcpService.js';
import {
	TestUsageService,
	TestMcpUsageService,
	TestAccessService,
	TestMcpAccessService,
	TestExtensionsService,
	TestMcpService,
	TestAuthenticationService,
	createProvider,
} from './authenticationQueryServiceMocks.js';

/**
 * Real integration tests for AuthenticationQueryService
 */
suite('AuthenticationQueryService Integration Tests', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	let queryService: IAuthenticationQueryService;
	let authService: TestAuthenticationService;
	let usageService: TestUsageService;
	let mcpUsageService: TestMcpUsageService;
	let accessService: TestAccessService;
	let mcpAccessService: TestMcpAccessService;

	setup(() => {
		const instantiationService = disposables.add(new TestInstantiationService());

		// Set up storage service
		const storageService = disposables.add(new TestStorageService());
		instantiationService.stub(IStorageService, storageService);

		// Set up log service
		instantiationService.stub(ILogService, new NullLogService());

		// Create and register test services
		authService = disposables.add(new TestAuthenticationService());
		instantiationService.stub(IAuthenticationService, authService);

		usageService = disposables.add(new TestUsageService());
		mcpUsageService = disposables.add(new TestMcpUsageService());
		accessService = disposables.add(new TestAccessService());
		mcpAccessService = disposables.add(new TestMcpAccessService());

		instantiationService.stub(IAuthenticationUsageService, usageService);
		instantiationService.stub(IAuthenticationMcpUsageService, mcpUsageService);
		instantiationService.stub(IAuthenticationAccessService, accessService);
		instantiationService.stub(IAuthenticationMcpAccessService, mcpAccessService);
		instantiationService.stub(IAuthenticationExtensionsService, disposables.add(new TestExtensionsService()));
		instantiationService.stub(IAuthenticationMcpService, disposables.add(new TestMcpService()));

		// Create the query service
		queryService = disposables.add(instantiationService.createInstance(AuthenticationQueryService));
	});

	test('usage tracking stores and retrieves data correctly', () => {
		const extensionQuery = queryService.provider('github').account('user@example.com').extension('my-extension');

		// Initially no usage
		assert.strictEqual(extensionQuery.getUsage().length, 0);

		// Add usage and verify it's stored
		extensionQuery.addUsage(['read', 'write'], 'My Extension');
		const usage = extensionQuery.getUsage();
		assert.strictEqual(usage.length, 1);
		assert.strictEqual(usage[0].extensionId, 'my-extension');
		assert.strictEqual(usage[0].extensionName, 'My Extension');
		assert.deepStrictEqual(usage[0].scopes, ['read', 'write']);

		// Add more usage and verify accumulation
		extensionQuery.addUsage(['admin'], 'My Extension');
		assert.strictEqual(extensionQuery.getUsage().length, 2);
	});

	test('access control persists across queries', () => {
		const extensionQuery = queryService.provider('github').account('user@example.com').extension('my-extension');

		// Set access and verify
		extensionQuery.setAccessAllowed(true, 'My Extension');
		assert.strictEqual(extensionQuery.isAccessAllowed(), true);

		// Create new query object for same target - should persist
		const sameExtensionQuery = queryService.provider('github').account('user@example.com').extension('my-extension');
		assert.strictEqual(sameExtensionQuery.isAccessAllowed(), true);

		// Different extension should be unaffected
		const otherExtensionQuery = queryService.provider('github').account('user@example.com').extension('other-extension');
		assert.strictEqual(otherExtensionQuery.isAccessAllowed(), undefined);
	});

	test('account preferences work across services', () => {
		const extensionQuery = queryService.provider('github').extension('my-extension');
		const mcpQuery = queryService.provider('github').mcpServer('my-server');

		// Set preferences for both
		extensionQuery.setPreferredAccount({ id: 'user1', label: 'user@example.com' });
		mcpQuery.setPreferredAccount({ id: 'user2', label: 'admin@example.com' });

		// Verify different preferences are stored independently
		assert.strictEqual(extensionQuery.getPreferredAccount(), 'user@example.com');
		assert.strictEqual(mcpQuery.getPreferredAccount(), 'admin@example.com');

		// Test preference detection
		const userExtensionQuery = queryService.provider('github').account('user@example.com').extension('my-extension');
		const adminMcpQuery = queryService.provider('github').account('admin@example.com').mcpServer('my-server');

		assert.strictEqual(userExtensionQuery.isPreferred(), true);
		assert.strictEqual(adminMcpQuery.isPreferred(), true);

		// Test non-preferred accounts
		const wrongExtensionQuery = queryService.provider('github').account('wrong@example.com').extension('my-extension');
		assert.strictEqual(wrongExtensionQuery.isPreferred(), false);
	});

	test('account removal cleans up all related data', () => {
		const accountQuery = queryService.provider('github').account('user@example.com');

		// Set up data across multiple services
		accountQuery.extension('ext1').setAccessAllowed(true, 'Extension 1');
		accountQuery.extension('ext1').addUsage(['read'], 'Extension 1');
		accountQuery.mcpServer('mcp1').setAccessAllowed(true, 'MCP Server 1');
		accountQuery.mcpServer('mcp1').addUsage(['write'], 'MCP Server 1');

		// Verify data exists
		assert.strictEqual(accountQuery.extension('ext1').isAccessAllowed(), true);
		assert.strictEqual(accountQuery.extension('ext1').getUsage().length, 1);
		assert.strictEqual(accountQuery.mcpServer('mcp1').isAccessAllowed(), true);
		assert.strictEqual(accountQuery.mcpServer('mcp1').getUsage().length, 1);

		// Remove account
		accountQuery.remove();

		// Verify all data is cleaned up
		assert.strictEqual(accountQuery.extension('ext1').isAccessAllowed(), undefined);
		assert.strictEqual(accountQuery.extension('ext1').getUsage().length, 0);
		assert.strictEqual(accountQuery.mcpServer('mcp1').isAccessAllowed(), undefined);
		assert.strictEqual(accountQuery.mcpServer('mcp1').getUsage().length, 0);
	});

	test('provider registration and listing works', () => {
		// Initially no providers
		assert.strictEqual(queryService.getProviderIds().length, 0);

		// Register a provider
		const provider = createProvider({ id: 'github', label: 'GitHub' });
		authService.registerAuthenticationProvider('github', provider);

		// Verify provider is listed
		const providerIds = queryService.getProviderIds();
		assert.ok(providerIds.includes('github'));
		assert.strictEqual(authService.isAuthenticationProviderRegistered('github'), true);
	});

	test('MCP usage and access work independently from extensions', () => {
		const extensionQuery = queryService.provider('github').account('user@example.com').extension('my-extension');
		const mcpQuery = queryService.provider('github').account('user@example.com').mcpServer('my-server');

		// Set up data for both
		extensionQuery.setAccessAllowed(true, 'My Extension');
		extensionQuery.addUsage(['read'], 'My Extension');

		mcpQuery.setAccessAllowed(false, 'My Server');
		mcpQuery.addUsage(['write'], 'My Server');

		// Verify they're independent
		assert.strictEqual(extensionQuery.isAccessAllowed(), true);
		assert.strictEqual(mcpQuery.isAccessAllowed(), false);

		assert.strictEqual(extensionQuery.getUsage()[0].extensionId, 'my-extension');
		assert.strictEqual(mcpQuery.getUsage()[0].mcpServerId, 'my-server');

		// Verify no cross-contamination
		assert.strictEqual(extensionQuery.getUsage().length, 1);
		assert.strictEqual(mcpQuery.getUsage().length, 1);
	});

	test('getAllAccountPreferences returns synchronously', () => {
		// Register providers for the test
		const githubProvider = createProvider({ id: 'github', label: 'GitHub' });
		const azureProvider = createProvider({ id: 'azure', label: 'Azure' });
		authService.registerAuthenticationProvider('github', githubProvider);
		authService.registerAuthenticationProvider('azure', azureProvider);

		const extensionQuery = queryService.extension('my-extension');
		const mcpQuery = queryService.mcpServer('my-server');

		// Set preferences for different providers
		extensionQuery.provider('github').setPreferredAccount({ id: 'user1', label: 'github-user@example.com' });
		extensionQuery.provider('azure').setPreferredAccount({ id: 'user2', label: 'azure-user@example.com' });
		mcpQuery.provider('github').setPreferredAccount({ id: 'user3', label: 'github-mcp@example.com' });

		// Get all preferences synchronously (no await needed)
		const extensionPreferences = extensionQuery.getAllAccountPreferences();
		const mcpPreferences = mcpQuery.getAllAccountPreferences();

		// Verify extension preferences
		assert.strictEqual(extensionPreferences.get('github'), 'github-user@example.com');
		assert.strictEqual(extensionPreferences.get('azure'), 'azure-user@example.com');
		assert.strictEqual(extensionPreferences.size, 2);

		// Verify MCP preferences
		assert.strictEqual(mcpPreferences.get('github'), 'github-mcp@example.com');
		assert.strictEqual(mcpPreferences.size, 1);

		// Verify they don't interfere with each other
		assert.notStrictEqual(extensionPreferences.get('github'), mcpPreferences.get('github'));
	});

	test('forEach methods work synchronously', () => {
		const accountQuery = queryService.provider('github').account('user@example.com');

		// Add some usage data first
		accountQuery.extension('ext1').addUsage(['read'], 'Extension 1');
		accountQuery.extension('ext2').addUsage(['write'], 'Extension 2');
		accountQuery.mcpServer('mcp1').addUsage(['admin'], 'MCP Server 1');

		// Test extensions forEach - no await needed
		const extensionIds: string[] = [];
		accountQuery.extensions().forEach(extensionQuery => {
			extensionIds.push(extensionQuery.extensionId);
		});

		assert.strictEqual(extensionIds.length, 2);
		assert.ok(extensionIds.includes('ext1'));
		assert.ok(extensionIds.includes('ext2'));

		// Test MCP servers forEach - no await needed
		const mcpServerIds: string[] = [];
		accountQuery.mcpServers().forEach(mcpServerQuery => {
			mcpServerIds.push(mcpServerQuery.mcpServerId);
		});

		assert.strictEqual(mcpServerIds.length, 1);
		assert.ok(mcpServerIds.includes('mcp1'));
	});

	test('remove method works synchronously', () => {
		const accountQuery = queryService.provider('github').account('user@example.com');

		// Set up data
		accountQuery.extension('ext1').setAccessAllowed(true, 'Extension 1');
		accountQuery.mcpServer('mcp1').setAccessAllowed(true, 'MCP Server 1');

		// Remove synchronously - no await needed
		accountQuery.remove();

		// Verify data is gone
		assert.strictEqual(accountQuery.extension('ext1').isAccessAllowed(), undefined);
		assert.strictEqual(accountQuery.mcpServer('mcp1').isAccessAllowed(), undefined);
	});

	test('cross-provider extension queries work correctly', () => {
		// Register multiple providers
		const githubProvider = createProvider({ id: 'github', label: 'GitHub' });
		const azureProvider = createProvider({ id: 'azure', label: 'Azure' });
		authService.registerAuthenticationProvider('github', githubProvider);
		authService.registerAuthenticationProvider('azure', azureProvider);

		// Set up data using provider-first approach
		queryService.provider('github').account('user@example.com').extension('my-extension').setAccessAllowed(true, 'My Extension');
		queryService.provider('azure').account('admin@example.com').extension('my-extension').setAccessAllowed(false, 'My Extension');

		// Query using extension-first approach should return all providers
		const extensionQuery = queryService.extension('my-extension');
		const githubPrefs = extensionQuery.getAllAccountPreferences();

		// Should include both providers
		assert.ok(githubPrefs.size >= 0); // Extension query should work across providers

		// Test preferences using extension-first query pattern
		extensionQuery.provider('github').setPreferredAccount({ id: 'user1', label: 'user@example.com' });
		extensionQuery.provider('azure').setPreferredAccount({ id: 'user2', label: 'admin@example.com' });

		assert.strictEqual(extensionQuery.provider('github').getPreferredAccount(), 'user@example.com');
		assert.strictEqual(extensionQuery.provider('azure').getPreferredAccount(), 'admin@example.com');
	});

	test('event forwarding from authentication service works', () => {
		let eventFired = false;

		// Listen for access change events through the query service
		const disposable = queryService.onDidChangeAccess(() => {
			eventFired = true;
		});

		try {
			// Trigger an access change that should fire an event
			queryService.provider('github').account('user@example.com').extension('my-extension').setAccessAllowed(true, 'My Extension');

			// Verify the event was fired
			assert.strictEqual(eventFired, true);
		} finally {
			disposable.dispose();
		}
	});

	test('error handling for invalid inputs works correctly', () => {
		// Test with non-existent provider
		const invalidProviderQuery = queryService.provider('non-existent-provider');

		// Should not throw, but should handle gracefully
		assert.doesNotThrow(() => {
			invalidProviderQuery.account('user@example.com').extension('my-extension').isAccessAllowed();
		});

		// Test with empty/invalid account names
		const emptyAccountQuery = queryService.provider('github').account('').extension('my-extension');
		assert.doesNotThrow(() => {
			emptyAccountQuery.isAccessAllowed();
		});

		// Test with empty extension IDs
		const emptyExtensionQuery = queryService.provider('github').account('user@example.com').extension('');
		assert.doesNotThrow(() => {
			emptyExtensionQuery.isAccessAllowed();
		});
	});

	test('bulk operations work correctly', () => {
		const accountQuery = queryService.provider('github').account('user@example.com');

		// Set up multiple extensions with different access levels
		accountQuery.extension('ext1').setAccessAllowed(true, 'Extension 1');
		accountQuery.extension('ext2').setAccessAllowed(false, 'Extension 2');
		accountQuery.extension('ext3').setAccessAllowed(true, 'Extension 3');

		// Add usage for some extensions
		accountQuery.extension('ext1').addUsage(['read'], 'Extension 1');
		accountQuery.extension('ext3').addUsage(['write'], 'Extension 3');

		// Test bulk enumeration
		let extensionCount = 0;
		let allowedCount = 0;
		let usageCount = 0;

		accountQuery.extensions().forEach(extensionQuery => {
			extensionCount++;
			if (extensionQuery.isAccessAllowed() === true) {
				allowedCount++;
			}
			if (extensionQuery.getUsage().length > 0) {
				usageCount++;
			}
		});

		// Verify bulk operation results
		assert.strictEqual(extensionCount, 3);
		assert.strictEqual(allowedCount, 2); // ext1 and ext3
		assert.strictEqual(usageCount, 2); // ext1 and ext3

		// Test bulk operations for MCP servers
		accountQuery.mcpServer('mcp1').setAccessAllowed(true, 'MCP 1');
		accountQuery.mcpServer('mcp2').setAccessAllowed(false, 'MCP 2');

		let mcpCount = 0;
		accountQuery.mcpServers().forEach(mcpQuery => {
			mcpCount++;
		});

		assert.strictEqual(mcpCount, 2);
	});

	test('data consistency across different query paths', () => {
		// Set up data using one query path
		const extensionQuery1 = queryService.provider('github').account('user@example.com').extension('my-extension');
		extensionQuery1.setAccessAllowed(true, 'My Extension');
		extensionQuery1.addUsage(['read', 'write'], 'My Extension');

		// Access same data using different query path (cross-provider query)
		const extensionQuery2 = queryService.extension('my-extension').provider('github');

		// Data should be consistent through provider preference access
		assert.strictEqual(extensionQuery1.isAccessAllowed(), true);
		assert.strictEqual(extensionQuery1.getUsage().length, 1);

		// Set preferences and check consistency
		extensionQuery2.setPreferredAccount({ id: 'user', label: 'user@example.com' });
		assert.strictEqual(extensionQuery2.getPreferredAccount(), 'user@example.com');

		// Modify through one path
		extensionQuery1.setAccessAllowed(false, 'My Extension');

		// Should be reflected when accessing through provider->account path
		assert.strictEqual(extensionQuery1.isAccessAllowed(), false);
	});

	test('preference management handles complex scenarios', () => {
		// Register multiple providers
		const githubProvider = createProvider({ id: 'github', label: 'GitHub' });
		const azureProvider = createProvider({ id: 'azure', label: 'Azure' });
		authService.registerAuthenticationProvider('github', githubProvider);
		authService.registerAuthenticationProvider('azure', azureProvider);

		const extensionQuery = queryService.extension('my-extension');

		// Set different preferences for different providers
		extensionQuery.provider('github').setPreferredAccount({ id: 'user1', label: 'github-user@example.com' });
		extensionQuery.provider('azure').setPreferredAccount({ id: 'user2', label: 'azure-user@example.com' });

		// Test preference retrieval
		assert.strictEqual(extensionQuery.provider('github').getPreferredAccount(), 'github-user@example.com');
		assert.strictEqual(extensionQuery.provider('azure').getPreferredAccount(), 'azure-user@example.com');

		// Test account preference detection through provider->account queries
		assert.strictEqual(
			queryService.provider('github').account('github-user@example.com').extension('my-extension').isPreferred(),
			true
		);
		assert.strictEqual(
			queryService.provider('azure').account('azure-user@example.com').extension('my-extension').isPreferred(),
			true
		);
		assert.strictEqual(
			queryService.provider('github').account('wrong@example.com').extension('my-extension').isPreferred(),
			false
		);

		// Test getAllAccountPreferences with multiple providers
		const allPrefs = extensionQuery.getAllAccountPreferences();
		assert.strictEqual(allPrefs.get('github'), 'github-user@example.com');
		assert.strictEqual(allPrefs.get('azure'), 'azure-user@example.com');
		assert.strictEqual(allPrefs.size, 2);
	});

	test('MCP server vs extension data isolation is complete', () => {
		const accountQuery = queryService.provider('github').account('user@example.com');

		// Set up similar data for extension and MCP server with same IDs
		const sameId = 'same-identifier';
		accountQuery.extension(sameId).setAccessAllowed(true, 'Extension');
		accountQuery.extension(sameId).addUsage(['ext-scope'], 'Extension');

		accountQuery.mcpServer(sameId).setAccessAllowed(false, 'MCP Server');
		accountQuery.mcpServer(sameId).addUsage(['mcp-scope'], 'MCP Server');

		// Verify complete isolation
		assert.strictEqual(accountQuery.extension(sameId).isAccessAllowed(), true);
		assert.strictEqual(accountQuery.mcpServer(sameId).isAccessAllowed(), false);

		const extUsage = accountQuery.extension(sameId).getUsage();
		const mcpUsage = accountQuery.mcpServer(sameId).getUsage();

		assert.strictEqual(extUsage.length, 1);
		assert.strictEqual(mcpUsage.length, 1);
		assert.strictEqual(extUsage[0].extensionId, sameId);
		assert.strictEqual(mcpUsage[0].mcpServerId, sameId);
		assert.notDeepStrictEqual(extUsage[0].scopes, mcpUsage[0].scopes);

		// Test preference isolation
		queryService.extension(sameId).provider('github').setPreferredAccount({ id: 'ext-user', label: 'ext@example.com' });
		queryService.mcpServer(sameId).provider('github').setPreferredAccount({ id: 'mcp-user', label: 'mcp@example.com' });

		assert.strictEqual(queryService.extension(sameId).provider('github').getPreferredAccount(), 'ext@example.com');
		assert.strictEqual(queryService.mcpServer(sameId).provider('github').getPreferredAccount(), 'mcp@example.com');
	});

	test('provider listing and registration integration', () => {
		// Initially should have providers from setup (if any)
		const initialProviders = queryService.getProviderIds();
		const initialCount = initialProviders.length;

		// Register a new provider
		const newProvider = createProvider({ id: 'test-provider', label: 'Test Provider' });
		authService.registerAuthenticationProvider('test-provider', newProvider);

		// Should now appear in listing
		const updatedProviders = queryService.getProviderIds();
		assert.strictEqual(updatedProviders.length, initialCount + 1);
		assert.ok(updatedProviders.includes('test-provider'));

		// Should be able to query the new provider
		const providerQuery = queryService.provider('test-provider');
		assert.strictEqual(providerQuery.providerId, 'test-provider');

		// Should integrate with authentication service state
		assert.strictEqual(authService.isAuthenticationProviderRegistered('test-provider'), true);
	});

	/**
	 * Service Call Verification Tests
	 * These tests verify that the AuthenticationQueryService properly delegates to underlying services
	 * with the correct parameters. This is important for ensuring the facade works correctly.
	 */
	test('setAccessAllowed calls updateAllowedExtensions with correct parameters', () => {
		const extensionQuery = queryService.provider('github').account('user@example.com').extension('my-extension');

		// Clear any previous calls
		accessService.clearCallHistory();

		// Call setAccessAllowed
		extensionQuery.setAccessAllowed(true, 'My Extension');

		// Verify the underlying service was called correctly
		const calls = accessService.getCallsFor('updateAllowedExtensions');
		assert.strictEqual(calls.length, 1);

		const [providerId, accountName, extensions] = calls[0].args;
		assert.strictEqual(providerId, 'github');
		assert.strictEqual(accountName, 'user@example.com');
		assert.strictEqual(extensions.length, 1);
		assert.strictEqual(extensions[0].id, 'my-extension');
		assert.strictEqual(extensions[0].name, 'My Extension');
		assert.strictEqual(extensions[0].allowed, true);
	});

	test('addUsage calls addAccountUsage with correct parameters', () => {
		const extensionQuery = queryService.provider('azure').account('admin@company.com').extension('test-extension');

		// Clear any previous calls
		usageService.clearCallHistory();

		// Call addUsage
		extensionQuery.addUsage(['read', 'write'], 'Test Extension');

		// Verify the underlying service was called correctly
		const calls = usageService.getCallsFor('addAccountUsage');
		assert.strictEqual(calls.length, 1);

		const [providerId, accountName, scopes, extensionId, extensionName] = calls[0].args;
		assert.strictEqual(providerId, 'azure');
		assert.strictEqual(accountName, 'admin@company.com');
		assert.deepStrictEqual(scopes, ['read', 'write']);
		assert.strictEqual(extensionId, 'test-extension');
		assert.strictEqual(extensionName, 'Test Extension');
	});

	test('isAccessAllowed calls underlying service with correct parameters', () => {
		const extensionQuery = queryService.provider('github').account('user@example.com').extension('my-extension');

		// Clear any previous calls
		accessService.clearCallHistory();

		// Call isAccessAllowed
		extensionQuery.isAccessAllowed();

		// Verify the underlying service was called correctly
		const calls = accessService.getCallsFor('isAccessAllowed');
		assert.strictEqual(calls.length, 1);

		const [providerId, accountName, extensionId] = calls[0].args;
		assert.strictEqual(providerId, 'github');
		assert.strictEqual(accountName, 'user@example.com');
		assert.strictEqual(extensionId, 'my-extension');
	});

	test('getUsage calls readAccountUsages with correct parameters', () => {
		const extensionQuery = queryService.provider('github').account('user@example.com').extension('my-extension');

		// Clear any previous calls
		usageService.clearCallHistory();

		// Call getUsage
		extensionQuery.getUsage();

		// Verify the underlying service was called correctly
		const calls = usageService.getCallsFor('readAccountUsages');
		assert.strictEqual(calls.length, 1);

		const [providerId, accountName] = calls[0].args;
		assert.strictEqual(providerId, 'github');
		assert.strictEqual(accountName, 'user@example.com');
	});

	test('MCP setAccessAllowed calls updateAllowedMcpServers with correct parameters', () => {
		const mcpQuery = queryService.provider('github').account('user@example.com').mcpServer('my-server');

		// Clear any previous calls
		mcpAccessService.clearCallHistory();

		// Call setAccessAllowed
		mcpQuery.setAccessAllowed(false, 'My MCP Server');

		// Verify the underlying service was called correctly
		const calls = mcpAccessService.getCallsFor('updateAllowedMcpServers');
		assert.strictEqual(calls.length, 1);

		const [providerId, accountName, servers] = calls[0].args;
		assert.strictEqual(providerId, 'github');
		assert.strictEqual(accountName, 'user@example.com');
		assert.strictEqual(servers.length, 1);
		assert.strictEqual(servers[0].id, 'my-server');
		assert.strictEqual(servers[0].name, 'My MCP Server');
		assert.strictEqual(servers[0].allowed, false);
	});

	test('MCP addUsage calls addAccountUsage with correct parameters', () => {
		const mcpQuery = queryService.provider('azure').account('admin@company.com').mcpServer('test-server');

		// Clear any previous calls
		mcpUsageService.clearCallHistory();

		// Call addUsage
		mcpQuery.addUsage(['admin'], 'Test MCP Server');

		// Verify the underlying service was called correctly
		const calls = mcpUsageService.getCallsFor('addAccountUsage');
		assert.strictEqual(calls.length, 1);

		const [providerId, accountName, scopes, serverId, serverName] = calls[0].args;
		assert.strictEqual(providerId, 'azure');
		assert.strictEqual(accountName, 'admin@company.com');
		assert.deepStrictEqual(scopes, ['admin']);
		assert.strictEqual(serverId, 'test-server');
		assert.strictEqual(serverName, 'Test MCP Server');
	});

	test('account removal calls all appropriate cleanup methods', () => {
		const accountQuery = queryService.provider('github').account('user@example.com');

		// Set up some data first
		accountQuery.extension('ext1').setAccessAllowed(true, 'Extension 1');
		accountQuery.extension('ext1').addUsage(['read'], 'Extension 1');
		accountQuery.mcpServer('mcp1').setAccessAllowed(true, 'MCP Server 1');
		accountQuery.mcpServer('mcp1').addUsage(['write'], 'MCP Server 1');

		// Clear call history to focus on removal calls
		usageService.clearCallHistory();
		mcpUsageService.clearCallHistory();
		accessService.clearCallHistory();
		mcpAccessService.clearCallHistory();

		// Call remove
		accountQuery.remove();

		// Verify all cleanup methods were called
		const extensionUsageRemoval = usageService.getCallsFor('removeAccountUsage');
		const mcpUsageRemoval = mcpUsageService.getCallsFor('removeAccountUsage');
		const extensionAccessRemoval = accessService.getCallsFor('removeAllowedExtensions');
		const mcpAccessRemoval = mcpAccessService.getCallsFor('removeAllowedMcpServers');

		assert.strictEqual(extensionUsageRemoval.length, 1);
		assert.strictEqual(mcpUsageRemoval.length, 1);
		assert.strictEqual(extensionAccessRemoval.length, 1);
		assert.strictEqual(mcpAccessRemoval.length, 1);

		// Verify all calls use correct parameters
		[extensionUsageRemoval[0], mcpUsageRemoval[0], extensionAccessRemoval[0], mcpAccessRemoval[0]].forEach(call => {
			const [providerId, accountName] = call.args;
			assert.strictEqual(providerId, 'github');
			assert.strictEqual(accountName, 'user@example.com');
		});
	});

	test('bulk operations call readAccountUsages and readAllowedExtensions', () => {
		const accountQuery = queryService.provider('github').account('user@example.com');

		// Set up some data
		accountQuery.extension('ext1').setAccessAllowed(true, 'Extension 1');
		accountQuery.extension('ext2').addUsage(['read'], 'Extension 2');

		// Clear call history
		usageService.clearCallHistory();
		accessService.clearCallHistory();

		// Perform bulk operation
		accountQuery.extensions().forEach(() => {
			// Just iterate to trigger the underlying service calls
		});

		// Verify the underlying services were called for bulk enumeration
		const usageCalls = usageService.getCallsFor('readAccountUsages');
		const accessCalls = accessService.getCallsFor('readAllowedExtensions');

		assert.strictEqual(usageCalls.length, 1);
		assert.strictEqual(accessCalls.length, 1);

		// Verify parameters
		usageCalls.concat(accessCalls).forEach(call => {
			const [providerId, accountName] = call.args;
			assert.strictEqual(providerId, 'github');
			assert.strictEqual(accountName, 'user@example.com');
		});
	});

	test('multiple operations accumulate service calls correctly', () => {
		const extensionQuery = queryService.provider('github').account('user@example.com').extension('my-extension');

		// Clear call history
		accessService.clearCallHistory();
		usageService.clearCallHistory();

		// Perform multiple operations
		extensionQuery.setAccessAllowed(true, 'My Extension');
		extensionQuery.addUsage(['read'], 'My Extension');
		extensionQuery.isAccessAllowed();
		extensionQuery.getUsage();
		extensionQuery.setAccessAllowed(false, 'My Extension');

		// Verify call counts
		assert.strictEqual(accessService.getCallsFor('updateAllowedExtensions').length, 2);
		assert.strictEqual(accessService.getCallsFor('isAccessAllowed').length, 1);
		assert.strictEqual(usageService.getCallsFor('addAccountUsage').length, 1);
		assert.strictEqual(usageService.getCallsFor('readAccountUsages').length, 1);
	});

	test('getProvidersWithAccess filters internal providers by default', async () => {
		// Register multiple providers including internal ones
		const githubProvider = createProvider({ id: 'github', label: 'GitHub' });
		const azureProvider = createProvider({ id: 'azure', label: 'Azure' });
		const internalProvider1 = createProvider({ id: '__internal1', label: 'Internal Provider 1' });
		const internalProvider2 = createProvider({ id: '__internal2', label: 'Internal Provider 2' });

		authService.registerAuthenticationProvider('github', githubProvider);
		authService.registerAuthenticationProvider('azure', azureProvider);
		authService.registerAuthenticationProvider('__internal1', internalProvider1);
		authService.registerAuthenticationProvider('__internal2', internalProvider2);

		// Add accounts to all providers
		authService.addAccounts('github', [{ id: 'user1', label: 'user@github.com' }]);
		authService.addAccounts('azure', [{ id: 'user2', label: 'user@azure.com' }]);
		authService.addAccounts('__internal1', [{ id: 'user3', label: 'internal1@example.com' }]);
		authService.addAccounts('__internal2', [{ id: 'user4', label: 'internal2@example.com' }]);

		// Set up access for all providers
		queryService.provider('github').account('user@github.com').extension('my-extension').setAccessAllowed(true, 'My Extension');
		queryService.provider('azure').account('user@azure.com').extension('my-extension').setAccessAllowed(true, 'My Extension');
		queryService.provider('__internal1').account('internal1@example.com').extension('my-extension').setAccessAllowed(true, 'My Extension');
		queryService.provider('__internal2').account('internal2@example.com').extension('my-extension').setAccessAllowed(true, 'My Extension');

		// Test extension query - should exclude internal providers by default
		const extensionQuery = queryService.extension('my-extension');
		const providersWithAccess = await extensionQuery.getProvidersWithAccess();

		assert.strictEqual(providersWithAccess.length, 2);
		assert.ok(providersWithAccess.includes('github'));
		assert.ok(providersWithAccess.includes('azure'));
		assert.ok(!providersWithAccess.includes('__internal1'));
		assert.ok(!providersWithAccess.includes('__internal2'));
	});

	test('getProvidersWithAccess includes internal providers when requested', async () => {
		// Register multiple providers including internal ones
		const githubProvider = createProvider({ id: 'github', label: 'GitHub' });
		const internalProvider = createProvider({ id: '__internal1', label: 'Internal Provider' });

		authService.registerAuthenticationProvider('github', githubProvider);
		authService.registerAuthenticationProvider('__internal1', internalProvider);

		// Add accounts to all providers
		authService.addAccounts('github', [{ id: 'user1', label: 'user@github.com' }]);
		authService.addAccounts('__internal1', [{ id: 'user2', label: 'internal@example.com' }]);

		// Set up access for all providers
		queryService.provider('github').account('user@github.com').extension('my-extension').setAccessAllowed(true, 'My Extension');
		queryService.provider('__internal1').account('internal@example.com').extension('my-extension').setAccessAllowed(true, 'My Extension');

		// Test extension query - should include internal providers when requested
		const extensionQuery = queryService.extension('my-extension');
		const providersWithAccess = await extensionQuery.getProvidersWithAccess(true);

		assert.strictEqual(providersWithAccess.length, 2);
		assert.ok(providersWithAccess.includes('github'));
		assert.ok(providersWithAccess.includes('__internal1'));
	});

	test('MCP server getProvidersWithAccess filters internal providers by default', async () => {
		// Register multiple providers including internal ones
		const githubProvider = createProvider({ id: 'github', label: 'GitHub' });
		const azureProvider = createProvider({ id: 'azure', label: 'Azure' });
		const internalProvider1 = createProvider({ id: '__internal1', label: 'Internal Provider 1' });
		const internalProvider2 = createProvider({ id: '__internal2', label: 'Internal Provider 2' });

		authService.registerAuthenticationProvider('github', githubProvider);
		authService.registerAuthenticationProvider('azure', azureProvider);
		authService.registerAuthenticationProvider('__internal1', internalProvider1);
		authService.registerAuthenticationProvider('__internal2', internalProvider2);

		// Add accounts to all providers
		authService.addAccounts('github', [{ id: 'user1', label: 'user@github.com' }]);
		authService.addAccounts('azure', [{ id: 'user2', label: 'user@azure.com' }]);
		authService.addAccounts('__internal1', [{ id: 'user3', label: 'internal1@example.com' }]);
		authService.addAccounts('__internal2', [{ id: 'user4', label: 'internal2@example.com' }]);

		// Set up MCP access for all providers
		queryService.provider('github').account('user@github.com').mcpServer('my-server').setAccessAllowed(true, 'My Server');
		queryService.provider('azure').account('user@azure.com').mcpServer('my-server').setAccessAllowed(true, 'My Server');
		queryService.provider('__internal1').account('internal1@example.com').mcpServer('my-server').setAccessAllowed(true, 'My Server');
		queryService.provider('__internal2').account('internal2@example.com').mcpServer('my-server').setAccessAllowed(true, 'My Server');

		// Test MCP server query - should exclude internal providers by default
		const mcpServerQuery = queryService.mcpServer('my-server');
		const providersWithAccess = await mcpServerQuery.getProvidersWithAccess();

		assert.strictEqual(providersWithAccess.length, 2);
		assert.ok(providersWithAccess.includes('github'));
		assert.ok(providersWithAccess.includes('azure'));
		assert.ok(!providersWithAccess.includes('__internal1'));
		assert.ok(!providersWithAccess.includes('__internal2'));
	});

	test('MCP server getProvidersWithAccess includes internal providers when requested', async () => {
		// Register multiple providers including internal ones
		const githubProvider = createProvider({ id: 'github', label: 'GitHub' });
		const internalProvider = createProvider({ id: '__internal1', label: 'Internal Provider' });

		authService.registerAuthenticationProvider('github', githubProvider);
		authService.registerAuthenticationProvider('__internal1', internalProvider);

		// Add accounts to all providers
		authService.addAccounts('github', [{ id: 'user1', label: 'user@github.com' }]);
		authService.addAccounts('__internal1', [{ id: 'user2', label: 'internal@example.com' }]);

		// Set up MCP access for all providers
		queryService.provider('github').account('user@github.com').mcpServer('my-server').setAccessAllowed(true, 'My Server');
		queryService.provider('__internal1').account('internal@example.com').mcpServer('my-server').setAccessAllowed(true, 'My Server');

		// Test MCP server query - should include internal providers when requested
		const mcpServerQuery = queryService.mcpServer('my-server');
		const providersWithAccess = await mcpServerQuery.getProvidersWithAccess(true);

		assert.strictEqual(providersWithAccess.length, 2);
		assert.ok(providersWithAccess.includes('github'));
		assert.ok(providersWithAccess.includes('__internal1'));
	});

	test('internal provider filtering works with mixed access patterns', async () => {
		// Register mixed providers
		const normalProvider = createProvider({ id: 'normal', label: 'Normal Provider' });
		const internalProvider = createProvider({ id: '__internal', label: 'Internal Provider' });
		const noAccessProvider = createProvider({ id: 'no-access', label: 'No Access Provider' });

		authService.registerAuthenticationProvider('normal', normalProvider);
		authService.registerAuthenticationProvider('__internal', internalProvider);
		authService.registerAuthenticationProvider('no-access', noAccessProvider);

		// Add accounts to all providers
		authService.addAccounts('normal', [{ id: 'user1', label: 'user@normal.com' }]);
		authService.addAccounts('__internal', [{ id: 'user2', label: 'internal@example.com' }]);
		authService.addAccounts('no-access', [{ id: 'user3', label: 'user@noaccess.com' }]);

		// Set up access only for normal and internal providers
		queryService.provider('normal').account('user@normal.com').extension('my-extension').setAccessAllowed(true, 'My Extension');
		queryService.provider('__internal').account('internal@example.com').extension('my-extension').setAccessAllowed(true, 'My Extension');
		// Note: no-access provider deliberately has no access set

		const extensionQuery = queryService.extension('my-extension');

		// Without includeInternal: should only return normal provider
		const providersWithoutInternal = await extensionQuery.getProvidersWithAccess(false);
		assert.strictEqual(providersWithoutInternal.length, 1);
		assert.ok(providersWithoutInternal.includes('normal'));
		assert.ok(!providersWithoutInternal.includes('__internal'));
		assert.ok(!providersWithoutInternal.includes('no-access'));

		// With includeInternal: should return both normal and internal
		const providersWithInternal = await extensionQuery.getProvidersWithAccess(true);
		assert.strictEqual(providersWithInternal.length, 2);
		assert.ok(providersWithInternal.includes('normal'));
		assert.ok(providersWithInternal.includes('__internal'));
		assert.ok(!providersWithInternal.includes('no-access'));
	});

	test('internal provider filtering respects the __ prefix exactly', async () => {
		// Register providers with various naming patterns
		const regularProvider = createProvider({ id: 'regular', label: 'Regular Provider' });
		const underscoreProvider = createProvider({ id: '_single', label: 'Single Underscore Provider' });
		const doubleUnderscoreProvider = createProvider({ id: '__double', label: 'Double Underscore Provider' });
		const tripleUnderscoreProvider = createProvider({ id: '___triple', label: 'Triple Underscore Provider' });
		const underscoreInMiddleProvider = createProvider({ id: 'mid_underscore', label: 'Middle Underscore Provider' });

		authService.registerAuthenticationProvider('regular', regularProvider);
		authService.registerAuthenticationProvider('_single', underscoreProvider);
		authService.registerAuthenticationProvider('__double', doubleUnderscoreProvider);
		authService.registerAuthenticationProvider('___triple', tripleUnderscoreProvider);
		authService.registerAuthenticationProvider('mid_underscore', underscoreInMiddleProvider);

		// Add accounts to all providers
		authService.addAccounts('regular', [{ id: 'user1', label: 'user@regular.com' }]);
		authService.addAccounts('_single', [{ id: 'user2', label: 'user@single.com' }]);
		authService.addAccounts('__double', [{ id: 'user3', label: 'user@double.com' }]);
		authService.addAccounts('___triple', [{ id: 'user4', label: 'user@triple.com' }]);
		authService.addAccounts('mid_underscore', [{ id: 'user5', label: 'user@middle.com' }]);

		// Set up access for all providers
		queryService.provider('regular').account('user@regular.com').extension('my-extension').setAccessAllowed(true, 'My Extension');
		queryService.provider('_single').account('user@single.com').extension('my-extension').setAccessAllowed(true, 'My Extension');
		queryService.provider('__double').account('user@double.com').extension('my-extension').setAccessAllowed(true, 'My Extension');
		queryService.provider('___triple').account('user@triple.com').extension('my-extension').setAccessAllowed(true, 'My Extension');
		queryService.provider('mid_underscore').account('user@middle.com').extension('my-extension').setAccessAllowed(true, 'My Extension');

		const extensionQuery = queryService.extension('my-extension');

		// Without includeInternal: should exclude only providers starting with exactly "__"
		const providersWithoutInternal = await extensionQuery.getProvidersWithAccess(false);
		assert.strictEqual(providersWithoutInternal.length, 3);
		assert.ok(providersWithoutInternal.includes('regular'));
		assert.ok(providersWithoutInternal.includes('_single'));
		assert.ok(!providersWithoutInternal.includes('__double'));
		assert.ok(!providersWithoutInternal.includes('___triple')); // This starts with __, so should be filtered
		assert.ok(providersWithoutInternal.includes('mid_underscore'));

		// With includeInternal: should include all providers
		const providersWithInternal = await extensionQuery.getProvidersWithAccess(true);
		assert.strictEqual(providersWithInternal.length, 5);
		assert.ok(providersWithInternal.includes('regular'));
		assert.ok(providersWithInternal.includes('_single'));
		assert.ok(providersWithInternal.includes('__double'));
		assert.ok(providersWithInternal.includes('___triple'));
		assert.ok(providersWithInternal.includes('mid_underscore'));
	});

	test('getAllAccountPreferences filters internal providers by default for extensions', () => {
		// Register providers
		authService.registerAuthenticationProvider('github', createProvider({ id: 'github', label: 'GitHub' }));
		authService.registerAuthenticationProvider('azure', createProvider({ id: 'azure', label: 'Azure' }));
		authService.registerAuthenticationProvider('__internal', createProvider({ id: '__internal', label: 'Internal' }));

		// Set preferences
		const extensionQuery = queryService.extension('my-extension');
		extensionQuery.provider('github').setPreferredAccount({ id: 'user1', label: 'user@github.com' });
		extensionQuery.provider('azure').setPreferredAccount({ id: 'user2', label: 'user@azure.com' });
		extensionQuery.provider('__internal').setPreferredAccount({ id: 'user3', label: 'internal@example.com' });

		// Without includeInternal: should exclude internal providers
		const prefsWithoutInternal = extensionQuery.getAllAccountPreferences(false);
		assert.strictEqual(prefsWithoutInternal.size, 2);
		assert.strictEqual(prefsWithoutInternal.get('github'), 'user@github.com');
		assert.strictEqual(prefsWithoutInternal.get('azure'), 'user@azure.com');
		assert.strictEqual(prefsWithoutInternal.get('__internal'), undefined);

		// With includeInternal: should include all providers
		const prefsWithInternal = extensionQuery.getAllAccountPreferences(true);
		assert.strictEqual(prefsWithInternal.size, 3);
		assert.strictEqual(prefsWithInternal.get('github'), 'user@github.com');
		assert.strictEqual(prefsWithInternal.get('azure'), 'user@azure.com');
		assert.strictEqual(prefsWithInternal.get('__internal'), 'internal@example.com');

		// Default behavior: should exclude internal providers
		const prefsDefault = extensionQuery.getAllAccountPreferences();
		assert.strictEqual(prefsDefault.size, 2);
		assert.strictEqual(prefsDefault.get('__internal'), undefined);
	});

	test('getAllAccountPreferences filters internal providers by default for MCP servers', () => {
		// Register providers
		authService.registerAuthenticationProvider('github', createProvider({ id: 'github', label: 'GitHub' }));
		authService.registerAuthenticationProvider('azure', createProvider({ id: 'azure', label: 'Azure' }));
		authService.registerAuthenticationProvider('__internal', createProvider({ id: '__internal', label: 'Internal' }));

		// Set preferences
		const mcpQuery = queryService.mcpServer('my-server');
		mcpQuery.provider('github').setPreferredAccount({ id: 'user1', label: 'user@github.com' });
		mcpQuery.provider('azure').setPreferredAccount({ id: 'user2', label: 'user@azure.com' });
		mcpQuery.provider('__internal').setPreferredAccount({ id: 'user3', label: 'internal@example.com' });

		// Without includeInternal: should exclude internal providers
		const prefsWithoutInternal = mcpQuery.getAllAccountPreferences(false);
		assert.strictEqual(prefsWithoutInternal.size, 2);
		assert.strictEqual(prefsWithoutInternal.get('github'), 'user@github.com');
		assert.strictEqual(prefsWithoutInternal.get('azure'), 'user@azure.com');
		assert.strictEqual(prefsWithoutInternal.get('__internal'), undefined);

		// With includeInternal: should include all providers
		const prefsWithInternal = mcpQuery.getAllAccountPreferences(true);
		assert.strictEqual(prefsWithInternal.size, 3);
		assert.strictEqual(prefsWithInternal.get('github'), 'user@github.com');
		assert.strictEqual(prefsWithInternal.get('azure'), 'user@azure.com');
		assert.strictEqual(prefsWithInternal.get('__internal'), 'internal@example.com');

		// Default behavior: should exclude internal providers
		const prefsDefault = mcpQuery.getAllAccountPreferences();
		assert.strictEqual(prefsDefault.size, 2);
		assert.strictEqual(prefsDefault.get('__internal'), undefined);
	});

	test('clearAllData includes internal providers by default', async () => {
		// Register providers
		authService.registerAuthenticationProvider('github', createProvider({ id: 'github', label: 'GitHub' }));
		authService.registerAuthenticationProvider('__internal', createProvider({ id: '__internal', label: 'Internal' }));

		// Add accounts
		authService.addAccounts('github', [{ id: 'user1', label: 'user@github.com' }]);
		authService.addAccounts('__internal', [{ id: 'user2', label: 'internal@example.com' }]);

		// Set up some data
		queryService.provider('github').account('user@github.com').extension('my-extension').setAccessAllowed(true, 'My Extension');
		queryService.provider('__internal').account('internal@example.com').extension('my-extension').setAccessAllowed(true, 'My Extension');

		// Verify data exists
		assert.strictEqual(queryService.provider('github').account('user@github.com').extension('my-extension').isAccessAllowed(), true);
		assert.strictEqual(queryService.provider('__internal').account('internal@example.com').extension('my-extension').isAccessAllowed(), true);

		// Clear all data (should include internal providers by default)
		await queryService.clearAllData('CLEAR_ALL_AUTH_DATA');

		// Verify all data is cleared
		assert.strictEqual(queryService.provider('github').account('user@github.com').extension('my-extension').isAccessAllowed(), undefined);
		assert.strictEqual(queryService.provider('__internal').account('internal@example.com').extension('my-extension').isAccessAllowed(), undefined);
	});

	test('clearAllData can exclude internal providers when specified', async () => {
		// Register providers
		authService.registerAuthenticationProvider('github', createProvider({ id: 'github', label: 'GitHub' }));
		authService.registerAuthenticationProvider('__internal', createProvider({ id: '__internal', label: 'Internal' }));

		// Add accounts
		authService.addAccounts('github', [{ id: 'user1', label: 'user@github.com' }]);
		authService.addAccounts('__internal', [{ id: 'user2', label: 'internal@example.com' }]);

		// Set up some data
		queryService.provider('github').account('user@github.com').extension('my-extension').setAccessAllowed(true, 'My Extension');
		queryService.provider('__internal').account('internal@example.com').extension('my-extension').setAccessAllowed(true, 'My Extension');

		// Clear data excluding internal providers
		await queryService.clearAllData('CLEAR_ALL_AUTH_DATA', false);

		// Verify only non-internal data is cleared
		assert.strictEqual(queryService.provider('github').account('user@github.com').extension('my-extension').isAccessAllowed(), undefined);
		assert.strictEqual(queryService.provider('__internal').account('internal@example.com').extension('my-extension').isAccessAllowed(), true);
	});

	test('isTrusted method works with mock service', () => {
		// Register provider and add account
		authService.registerAuthenticationProvider('github', createProvider({ id: 'github', label: 'GitHub' }));
		authService.addAccounts('github', [{ id: 'user1', label: 'user@github.com' }]);

		// Add a server with trusted state manually to the mock
		mcpAccessService.updateAllowedMcpServers('github', 'user@github.com', [{
			id: 'trusted-server',
			name: 'Trusted Server',
			allowed: true,
			trusted: true
		}]);

		// Add a non-trusted server
		mcpAccessService.updateAllowedMcpServers('github', 'user@github.com', [{
			id: 'non-trusted-server',
			name: 'Non-Trusted Server',
			allowed: true
		}]);

		// Test trusted server
		const trustedQuery = queryService.provider('github').account('user@github.com').mcpServer('trusted-server');
		assert.strictEqual(trustedQuery.isTrusted(), true);

		// Test non-trusted server
		const nonTrustedQuery = queryService.provider('github').account('user@github.com').mcpServer('non-trusted-server');
		assert.strictEqual(nonTrustedQuery.isTrusted(), false);
	});

	test('getAllowedMcpServers method returns servers with trusted state', () => {
		// Register provider and add account
		authService.registerAuthenticationProvider('github', createProvider({ id: 'github', label: 'GitHub' }));
		authService.addAccounts('github', [{ id: 'user1', label: 'user@github.com' }]);

		// Add servers manually to the mock
		mcpAccessService.updateAllowedMcpServers('github', 'user@github.com', [
			{
				id: 'trusted-server',
				name: 'Trusted Server',
				allowed: true,
				trusted: true
			},
			{
				id: 'user-server',
				name: 'User Server',
				allowed: true
			}
		]);

		// Get all allowed servers
		const allowedServers = queryService.provider('github').account('user@github.com').mcpServers().getAllowedMcpServers();

		// Should have both servers
		assert.strictEqual(allowedServers.length, 2);

		// Find the trusted server
		const trustedServer = allowedServers.find(s => s.id === 'trusted-server');
		assert.ok(trustedServer);
		assert.strictEqual(trustedServer.trusted, true);
		assert.strictEqual(trustedServer.allowed, true);

		// Find the user-allowed server
		const userServer = allowedServers.find(s => s.id === 'user-server');
		assert.ok(userServer);
		assert.strictEqual(userServer.trusted, undefined);
		assert.strictEqual(userServer.allowed, true);
	});

	test('getAllowedExtensions returns extension data with trusted state', () => {
		// Set up some extension access data
		const accountQuery = queryService.provider('github').account('user@example.com');
		accountQuery.extension('ext1').setAccessAllowed(true, 'Extension One');
		accountQuery.extension('ext2').setAccessAllowed(true, 'Extension Two');
		accountQuery.extension('ext1').addUsage(['read'], 'Extension One');

		const allowedExtensions = accountQuery.extensions().getAllowedExtensions();

		// Should have both extensions
		assert.strictEqual(allowedExtensions.length, 2);

		// Find the first extension
		const ext1 = allowedExtensions.find(e => e.id === 'ext1');
		assert.ok(ext1);
		assert.strictEqual(ext1.name, 'Extension One');
		assert.strictEqual(ext1.allowed, true);
		assert.strictEqual(ext1.trusted, false); // Not in trusted list
		assert.ok(typeof ext1.lastUsed === 'number');

		// Find the second extension
		const ext2 = allowedExtensions.find(e => e.id === 'ext2');
		assert.ok(ext2);
		assert.strictEqual(ext2.name, 'Extension Two');
		assert.strictEqual(ext2.allowed, true);
		assert.strictEqual(ext2.trusted, false); // Not in trusted list
		assert.strictEqual(ext2.lastUsed, undefined); // No usage
	});

	suite('Account entities query', () => {
		test('hasAnyUsage returns false for clean account', () => {
			const entitiesQuery = queryService.provider('github').account('clean@example.com').entities();
			assert.strictEqual(entitiesQuery.hasAnyUsage(), false);
		});

		test('hasAnyUsage returns true when extension has usage', () => {
			const accountQuery = queryService.provider('github').account('user@example.com');
			accountQuery.extension('test-ext').addUsage(['read'], 'Test Extension');

			const entitiesQuery = accountQuery.entities();
			assert.strictEqual(entitiesQuery.hasAnyUsage(), true);
		});

		test('hasAnyUsage returns true when MCP server has usage', () => {
			const accountQuery = queryService.provider('github').account('user@example.com');
			accountQuery.mcpServer('test-server').addUsage(['write'], 'Test Server');

			const entitiesQuery = accountQuery.entities();
			assert.strictEqual(entitiesQuery.hasAnyUsage(), true);
		});

		test('hasAnyUsage returns true when extension has access', () => {
			const accountQuery = queryService.provider('github').account('user@example.com');
			accountQuery.extension('test-ext').setAccessAllowed(true, 'Test Extension');

			const entitiesQuery = accountQuery.entities();
			assert.strictEqual(entitiesQuery.hasAnyUsage(), true);
		});

		test('hasAnyUsage returns true when MCP server has access', () => {
			const accountQuery = queryService.provider('github').account('user@example.com');
			accountQuery.mcpServer('test-server').setAccessAllowed(true, 'Test Server');

			const entitiesQuery = accountQuery.entities();
			assert.strictEqual(entitiesQuery.hasAnyUsage(), true);
		});

		test('getEntityCount returns correct counts', () => {
			const accountQuery = queryService.provider('github').account('user@example.com');

			// Set up test data
			accountQuery.extension('ext1').setAccessAllowed(true, 'Extension One');
			accountQuery.extension('ext2').setAccessAllowed(true, 'Extension Two');
			accountQuery.mcpServer('server1').setAccessAllowed(true, 'Server One');

			const entitiesQuery = accountQuery.entities();
			const counts = entitiesQuery.getEntityCount();

			assert.strictEqual(counts.extensions, 2);
			assert.strictEqual(counts.mcpServers, 1);
			assert.strictEqual(counts.total, 3);
		});

		test('getEntityCount returns zero for clean account', () => {
			const entitiesQuery = queryService.provider('github').account('clean@example.com').entities();
			const counts = entitiesQuery.getEntityCount();

			assert.strictEqual(counts.extensions, 0);
			assert.strictEqual(counts.mcpServers, 0);
			assert.strictEqual(counts.total, 0);
		});

		test('removeAllAccess removes access for all entity types', () => {
			const accountQuery = queryService.provider('github').account('user@example.com');

			// Set up test data
			accountQuery.extension('ext1').setAccessAllowed(true, 'Extension One');
			accountQuery.extension('ext2').setAccessAllowed(true, 'Extension Two');
			accountQuery.mcpServer('server1').setAccessAllowed(true, 'Server One');
			accountQuery.mcpServer('server2').setAccessAllowed(true, 'Server Two');

			// Verify initial state
			assert.strictEqual(accountQuery.extension('ext1').isAccessAllowed(), true);
			assert.strictEqual(accountQuery.extension('ext2').isAccessAllowed(), true);
			assert.strictEqual(accountQuery.mcpServer('server1').isAccessAllowed(), true);
			assert.strictEqual(accountQuery.mcpServer('server2').isAccessAllowed(), true);

			// Remove all access
			const entitiesQuery = accountQuery.entities();
			entitiesQuery.removeAllAccess();

			// Verify all access is removed
			assert.strictEqual(accountQuery.extension('ext1').isAccessAllowed(), false);
			assert.strictEqual(accountQuery.extension('ext2').isAccessAllowed(), false);
			assert.strictEqual(accountQuery.mcpServer('server1').isAccessAllowed(), false);
			assert.strictEqual(accountQuery.mcpServer('server2').isAccessAllowed(), false);
		});

		test('forEach iterates over all entity types', () => {
			const accountQuery = queryService.provider('github').account('user@example.com');

			// Set up test data
			accountQuery.extension('ext1').setAccessAllowed(true, 'Extension One');
			accountQuery.extension('ext2').addUsage(['read'], 'Extension Two');
			accountQuery.mcpServer('server1').setAccessAllowed(true, 'Server One');
			accountQuery.mcpServer('server2').addUsage(['write'], 'Server Two');

			const entitiesQuery = accountQuery.entities();
			const visitedEntities: Array<{ id: string; type: 'extension' | 'mcpServer' }> = [];

			entitiesQuery.forEach((entityId, entityType) => {
				visitedEntities.push({ id: entityId, type: entityType });
			});

			// Should visit all entities that have usage or access
			assert.strictEqual(visitedEntities.length, 4);

			const extensions = visitedEntities.filter(e => e.type === 'extension');
			const mcpServers = visitedEntities.filter(e => e.type === 'mcpServer');

			assert.strictEqual(extensions.length, 2);
			assert.strictEqual(mcpServers.length, 2);

			// Check specific entities were visited
			assert.ok(visitedEntities.some(e => e.id === 'ext1' && e.type === 'extension'));
			assert.ok(visitedEntities.some(e => e.id === 'ext2' && e.type === 'extension'));
			assert.ok(visitedEntities.some(e => e.id === 'server1' && e.type === 'mcpServer'));
			assert.ok(visitedEntities.some(e => e.id === 'server2' && e.type === 'mcpServer'));
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/authentication/test/browser/authenticationQueryServiceMocks.ts]---
Location: vscode-main/src/vs/workbench/services/authentication/test/browser/authenticationQueryServiceMocks.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { AuthenticationSession, AuthenticationSessionAccount, IAuthenticationProvider, IAuthenticationService, IAuthenticationExtensionsService } from '../../common/authentication.js';
import { IAuthenticationUsageService } from '../../browser/authenticationUsageService.js';
import { IAuthenticationMcpUsageService } from '../../browser/authenticationMcpUsageService.js';
import { IAuthenticationAccessService } from '../../browser/authenticationAccessService.js';
import { IAuthenticationMcpAccessService } from '../../browser/authenticationMcpAccessService.js';
import { IAuthenticationMcpService } from '../../browser/authenticationMcpService.js';

/**
 * Helper function to create a mock authentication provider
 */
export function createProvider(overrides: Partial<IAuthenticationProvider> = {}): IAuthenticationProvider {
	return {
		id: 'test-provider',
		label: 'Test Provider',
		supportsMultipleAccounts: true,
		createSession: () => Promise.resolve(createSession()),
		removeSession: () => Promise.resolve(),
		getSessions: () => Promise.resolve([]),
		onDidChangeSessions: new Emitter<any>().event,
		...overrides
	};
}

/**
 * Helper function to create a mock authentication session
 */
export function createSession(): AuthenticationSession {
	return {
		id: 'test-session',
		accessToken: 'test-token',
		account: { id: 'test-account', label: 'Test Account' },
		scopes: ['read', 'write'],
		idToken: undefined
	};
}

/**
 * Interface for tracking method calls in mock services
 */
interface MethodCall {
	method: string;
	args: any[];
	timestamp: number;
}

/**
 * Base class for test services with common functionality and call tracking
 */
export abstract class BaseTestService extends Disposable {
	protected readonly data = new Map<string, any>();
	private readonly _methodCalls: MethodCall[] = [];

	protected getKey(...parts: string[]): string {
		return parts.join('::');
	}

	/**
	 * Track a method call for verification in tests
	 */
	protected trackCall(method: string, ...args: any[]): void {
		this._methodCalls.push({
			method,
			args: [...args],
			timestamp: Date.now()
		});
	}

	/**
	 * Get all method calls for verification
	 */
	getMethodCalls(): readonly MethodCall[] {
		return [...this._methodCalls];
	}

	/**
	 * Get calls for a specific method
	 */
	getCallsFor(method: string): readonly MethodCall[] {
		return this._methodCalls.filter(call => call.method === method);
	}

	/**
	 * Clear method call history
	 */
	clearCallHistory(): void {
		this._methodCalls.length = 0;
	}

	/**
	 * Get the last call for a specific method
	 */
	getLastCallFor(method: string): MethodCall | undefined {
		const calls = this.getCallsFor(method);
		return calls[calls.length - 1];
	}
}

/**
 * Test implementation that actually stores and retrieves data
 */
export class TestUsageService extends BaseTestService implements IAuthenticationUsageService {
	declare readonly _serviceBrand: undefined;

	readAccountUsages(providerId: string, accountName: string): any[] {
		this.trackCall('readAccountUsages', providerId, accountName);
		return this.data.get(this.getKey(providerId, accountName)) || [];
	}

	addAccountUsage(providerId: string, accountName: string, scopes: readonly string[], extensionId: string, extensionName: string): void {
		this.trackCall('addAccountUsage', providerId, accountName, scopes, extensionId, extensionName);
		const key = this.getKey(providerId, accountName);
		const usages = this.data.get(key) || [];
		usages.push({ extensionId, extensionName, scopes: [...scopes], lastUsed: Date.now() });
		this.data.set(key, usages);
	}

	removeAccountUsage(providerId: string, accountName: string): void {
		this.trackCall('removeAccountUsage', providerId, accountName);
		this.data.delete(this.getKey(providerId, accountName));
	}

	// Stub implementations for missing methods
	async initializeExtensionUsageCache(): Promise<void> { }
	async extensionUsesAuth(extensionId: string): Promise<boolean> { return false; }
}

export class TestMcpUsageService extends BaseTestService implements IAuthenticationMcpUsageService {
	declare readonly _serviceBrand: undefined;

	readAccountUsages(providerId: string, accountName: string): any[] {
		this.trackCall('readAccountUsages', providerId, accountName);
		return this.data.get(this.getKey(providerId, accountName)) || [];
	}

	addAccountUsage(providerId: string, accountName: string, scopes: readonly string[], mcpServerId: string, mcpServerName: string): void {
		this.trackCall('addAccountUsage', providerId, accountName, scopes, mcpServerId, mcpServerName);
		const key = this.getKey(providerId, accountName);
		const usages = this.data.get(key) || [];
		usages.push({ mcpServerId, mcpServerName, scopes: [...scopes], lastUsed: Date.now() });
		this.data.set(key, usages);
	}

	removeAccountUsage(providerId: string, accountName: string): void {
		this.trackCall('removeAccountUsage', providerId, accountName);
		this.data.delete(this.getKey(providerId, accountName));
	}

	// Stub implementations for missing methods
	async initializeUsageCache(): Promise<void> { }
	async hasUsedAuth(mcpServerId: string): Promise<boolean> { return false; }
}

export class TestAccessService extends BaseTestService implements IAuthenticationAccessService {
	declare readonly _serviceBrand: undefined;
	private readonly _onDidChangeExtensionSessionAccess = this._register(new Emitter<any>());
	onDidChangeExtensionSessionAccess = this._onDidChangeExtensionSessionAccess.event;

	isAccessAllowed(providerId: string, accountName: string, extensionId: string): boolean | undefined {
		this.trackCall('isAccessAllowed', providerId, accountName, extensionId);
		const extensions = this.data.get(this.getKey(providerId, accountName)) || [];
		const extension = extensions.find((e: any) => e.id === extensionId);
		return extension?.allowed;
	}

	readAllowedExtensions(providerId: string, accountName: string): any[] {
		this.trackCall('readAllowedExtensions', providerId, accountName);
		return this.data.get(this.getKey(providerId, accountName)) || [];
	}

	updateAllowedExtensions(providerId: string, accountName: string, extensions: any[]): void {
		this.trackCall('updateAllowedExtensions', providerId, accountName, extensions);
		const key = this.getKey(providerId, accountName);
		const existing = this.data.get(key) || [];

		// Merge with existing data, updating or adding extensions
		const merged = [...existing];
		for (const ext of extensions) {
			const existingIndex = merged.findIndex(e => e.id === ext.id);
			if (existingIndex >= 0) {
				merged[existingIndex] = ext;
			} else {
				merged.push(ext);
			}
		}

		this.data.set(key, merged);
		this._onDidChangeExtensionSessionAccess.fire({ providerId, accountName });
	}

	removeAllowedExtensions(providerId: string, accountName: string): void {
		this.trackCall('removeAllowedExtensions', providerId, accountName);
		this.data.delete(this.getKey(providerId, accountName));
	}
}

export class TestMcpAccessService extends BaseTestService implements IAuthenticationMcpAccessService {
	declare readonly _serviceBrand: undefined;
	private readonly _onDidChangeMcpSessionAccess = this._register(new Emitter<any>());
	onDidChangeMcpSessionAccess = this._onDidChangeMcpSessionAccess.event;

	isAccessAllowed(providerId: string, accountName: string, mcpServerId: string): boolean | undefined {
		this.trackCall('isAccessAllowed', providerId, accountName, mcpServerId);
		const servers = this.data.get(this.getKey(providerId, accountName)) || [];
		const server = servers.find((s: any) => s.id === mcpServerId);
		return server?.allowed;
	}

	readAllowedMcpServers(providerId: string, accountName: string): any[] {
		this.trackCall('readAllowedMcpServers', providerId, accountName);
		return this.data.get(this.getKey(providerId, accountName)) || [];
	}

	updateAllowedMcpServers(providerId: string, accountName: string, mcpServers: any[]): void {
		this.trackCall('updateAllowedMcpServers', providerId, accountName, mcpServers);
		const key = this.getKey(providerId, accountName);
		const existing = this.data.get(key) || [];

		// Merge with existing data, updating or adding MCP servers
		const merged = [...existing];
		for (const server of mcpServers) {
			const existingIndex = merged.findIndex(s => s.id === server.id);
			if (existingIndex >= 0) {
				merged[existingIndex] = server;
			} else {
				merged.push(server);
			}
		}

		this.data.set(key, merged);
		this._onDidChangeMcpSessionAccess.fire({ providerId, accountName });
	}

	removeAllowedMcpServers(providerId: string, accountName: string): void {
		this.trackCall('removeAllowedMcpServers', providerId, accountName);
		this.data.delete(this.getKey(providerId, accountName));
		this._onDidChangeMcpSessionAccess.fire({ providerId, accountName });
	}
}

export class TestPreferencesService extends BaseTestService {
	private readonly _onDidChangeAccountPreference = this._register(new Emitter<any>());
	onDidChangeAccountPreference = this._onDidChangeAccountPreference.event;

	getAccountPreference(clientId: string, providerId: string): string | undefined {
		return this.data.get(this.getKey(clientId, providerId));
	}

	updateAccountPreference(clientId: string, providerId: string, account: any): void {
		this.data.set(this.getKey(clientId, providerId), account.label);
	}

	removeAccountPreference(clientId: string, providerId: string): void {
		this.data.delete(this.getKey(clientId, providerId));
	}
}

export class TestExtensionsService extends TestPreferencesService implements IAuthenticationExtensionsService {
	declare readonly _serviceBrand: undefined;

	// Stub implementations for methods we don't test
	updateSessionPreference(): void { }
	getSessionPreference(): string | undefined { return undefined; }
	removeSessionPreference(): void { }
	selectSession(): Promise<any> { return Promise.resolve(createSession()); }
	requestSessionAccess(): void { }
	requestNewSession(): Promise<void> { return Promise.resolve(); }
	updateNewSessionRequests(): void { }
}

export class TestMcpService extends TestPreferencesService implements IAuthenticationMcpService {
	declare readonly _serviceBrand: undefined;

	// Stub implementations for methods we don't test
	updateSessionPreference(): void { }
	getSessionPreference(): string | undefined { return undefined; }
	removeSessionPreference(): void { }
	selectSession(): Promise<any> { return Promise.resolve(createSession()); }
	requestSessionAccess(): void { }
	requestNewSession(): Promise<void> { return Promise.resolve(); }
}

/**
 * Minimal authentication service mock that only implements what we need
 */
export class TestAuthenticationService extends BaseTestService implements IAuthenticationService {
	declare readonly _serviceBrand: undefined;

	private readonly _onDidChangeSessions = this._register(new Emitter<any>());
	private readonly _onDidRegisterAuthenticationProvider = this._register(new Emitter<any>());
	private readonly _onDidUnregisterAuthenticationProvider = this._register(new Emitter<any>());
	private readonly _onDidChangeDeclaredProviders = this._register(new Emitter<void>());

	onDidChangeSessions = this._onDidChangeSessions.event;
	onDidRegisterAuthenticationProvider = this._onDidRegisterAuthenticationProvider.event;
	onDidUnregisterAuthenticationProvider = this._onDidUnregisterAuthenticationProvider.event;
	onDidChangeDeclaredProviders = this._onDidChangeDeclaredProviders.event;

	private readonly accountsMap = new Map<string, AuthenticationSessionAccount[]>();

	registerAuthenticationProvider(id: string, provider: IAuthenticationProvider): void {
		this.data.set(id, provider);
		this._onDidRegisterAuthenticationProvider.fire({ id, label: provider.label });
	}

	getProviderIds(): string[] {
		return Array.from(this.data.keys());
	}

	isAuthenticationProviderRegistered(id: string): boolean {
		return this.data.has(id);
	}

	getProvider(id: string): IAuthenticationProvider {
		return this.data.get(id)!;
	}

	addAccounts(providerId: string, accounts: AuthenticationSessionAccount[]): void {
		this.accountsMap.set(providerId, accounts);
	}

	async getAccounts(providerId: string): Promise<readonly AuthenticationSessionAccount[]> {
		return this.accountsMap.get(providerId) || [];
	}

	// All other methods are stubs since we don't test them
	get declaredProviders(): any[] { return []; }
	isDynamicAuthenticationProvider(): boolean { return false; }
	async getSessions(): Promise<readonly AuthenticationSession[]> { return []; }
	async createSession(): Promise<AuthenticationSession> { return createSession(); }
	async removeSession(): Promise<void> { }
	manageTrustedExtensionsForAccount(): void { }
	async removeAccountSessions(): Promise<void> { }
	registerDeclaredAuthenticationProvider(): void { }
	unregisterDeclaredAuthenticationProvider(): void { }
	unregisterAuthenticationProvider(): void { }
	registerAuthenticationProviderHostDelegate(): IDisposable { return { dispose: () => { } }; }
	createDynamicAuthenticationProvider(): Promise<any> { return Promise.resolve(undefined); }
	async requestNewSession(): Promise<AuthenticationSession> { return createSession(); }
	async getSession(): Promise<AuthenticationSession | undefined> { return createSession(); }
	getOrActivateProviderIdForServer(): Promise<string | undefined> { return Promise.resolve(undefined); }
	supportsHeimdallConnection(): boolean { return false; }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/authentication/test/browser/authenticationService.test.ts]---
Location: vscode-main/src/vs/workbench/services/authentication/test/browser/authenticationService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { URI } from '../../../../../base/common/uri.js';
import { AuthenticationAccessService } from '../../browser/authenticationAccessService.js';
import { AuthenticationService } from '../../browser/authenticationService.js';
import { AuthenticationProviderInformation, AuthenticationSessionsChangeEvent, IAuthenticationProvider } from '../../common/authentication.js';
import { TestEnvironmentService } from '../../../../test/browser/workbenchTestServices.js';
import { TestExtensionService, TestProductService, TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';

function createSession() {
	return { id: 'session1', accessToken: 'token1', account: { id: 'account', label: 'Account' }, scopes: ['test'] };
}

function createProvider(overrides: Partial<IAuthenticationProvider> = {}): IAuthenticationProvider {
	return {
		supportsMultipleAccounts: false,
		onDidChangeSessions: new Emitter<AuthenticationSessionsChangeEvent>().event,
		id: 'test',
		label: 'Test',
		getSessions: async () => [],
		createSession: async () => createSession(),
		removeSession: async () => { },
		...overrides
	};
}

suite('AuthenticationService', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	let authenticationService: AuthenticationService;

	setup(() => {
		const storageService = disposables.add(new TestStorageService());
		const authenticationAccessService = disposables.add(new AuthenticationAccessService(storageService, TestProductService));
		authenticationService = disposables.add(new AuthenticationService(new TestExtensionService(), authenticationAccessService, TestEnvironmentService, new NullLogService()));
	});

	teardown(() => {
		// Dispose the authentication service after each test
		authenticationService.dispose();
	});

	suite('declaredAuthenticationProviders', () => {
		test('registerDeclaredAuthenticationProvider', async () => {
			const changed = Event.toPromise(authenticationService.onDidChangeDeclaredProviders);
			const provider: AuthenticationProviderInformation = {
				id: 'github',
				label: 'GitHub'
			};
			authenticationService.registerDeclaredAuthenticationProvider(provider);

			// Assert that the provider is added to the declaredProviders array and the event fires
			assert.equal(authenticationService.declaredProviders.length, 1);
			assert.deepEqual(authenticationService.declaredProviders[0], provider);
			await changed;
		});

		test('unregisterDeclaredAuthenticationProvider', async () => {
			const provider: AuthenticationProviderInformation = {
				id: 'github',
				label: 'GitHub'
			};
			authenticationService.registerDeclaredAuthenticationProvider(provider);
			const changed = Event.toPromise(authenticationService.onDidChangeDeclaredProviders);
			authenticationService.unregisterDeclaredAuthenticationProvider(provider.id);

			// Assert that the provider is removed from the declaredProviders array and the event fires
			assert.equal(authenticationService.declaredProviders.length, 0);
			await changed;
		});
	});

	suite('authenticationProviders', () => {
		test('isAuthenticationProviderRegistered', async () => {
			const registered = Event.toPromise(authenticationService.onDidRegisterAuthenticationProvider);
			const provider = createProvider();
			assert.equal(authenticationService.isAuthenticationProviderRegistered(provider.id), false);
			authenticationService.registerAuthenticationProvider(provider.id, provider);
			assert.equal(authenticationService.isAuthenticationProviderRegistered(provider.id), true);
			const result = await registered;
			assert.deepEqual(result, { id: provider.id, label: provider.label });
		});

		test('unregisterAuthenticationProvider', async () => {
			const unregistered = Event.toPromise(authenticationService.onDidUnregisterAuthenticationProvider);
			const provider = createProvider();
			authenticationService.registerAuthenticationProvider(provider.id, provider);
			assert.equal(authenticationService.isAuthenticationProviderRegistered(provider.id), true);
			authenticationService.unregisterAuthenticationProvider(provider.id);
			assert.equal(authenticationService.isAuthenticationProviderRegistered(provider.id), false);
			const result = await unregistered;
			assert.deepEqual(result, { id: provider.id, label: provider.label });
		});

		test('getProviderIds', () => {
			const provider1 = createProvider({
				id: 'provider1',
				label: 'Provider 1'
			});
			const provider2 = createProvider({
				id: 'provider2',
				label: 'Provider 2'
			});

			authenticationService.registerAuthenticationProvider(provider1.id, provider1);
			authenticationService.registerAuthenticationProvider(provider2.id, provider2);

			const providerIds = authenticationService.getProviderIds();

			// Assert that the providerIds array contains the registered provider ids
			assert.deepEqual(providerIds, [provider1.id, provider2.id]);
		});

		test('getProvider', () => {
			const provider = createProvider();

			authenticationService.registerAuthenticationProvider(provider.id, provider);

			const retrievedProvider = authenticationService.getProvider(provider.id);

			// Assert that the retrieved provider is the same as the registered provider
			assert.deepEqual(retrievedProvider, provider);
		});

		test('getOrActivateProviderIdForServer - should return undefined when no provider matches the authorization server', async () => {
			const authorizationServer = URI.parse('https://example.com');
			const result = await authenticationService.getOrActivateProviderIdForServer(authorizationServer);
			assert.strictEqual(result, undefined);
		});

		test('getOrActivateProviderIdForServer - should return provider id if authorizationServerGlobs matches and authorizationServers match', async () => {
			// Register a declared provider with an authorization server glob
			const provider: AuthenticationProviderInformation = {
				id: 'github',
				label: 'GitHub',
				authorizationServerGlobs: ['https://github.com/*']
			};
			authenticationService.registerDeclaredAuthenticationProvider(provider);

			// Register an authentication provider with matching authorization servers
			const authProvider = createProvider({
				id: 'github',
				label: 'GitHub',
				authorizationServers: [URI.parse('https://github.com/login')]
			});
			authenticationService.registerAuthenticationProvider('github', authProvider);

			// Test with a matching URI
			const authorizationServer = URI.parse('https://github.com/login');
			const result = await authenticationService.getOrActivateProviderIdForServer(authorizationServer);

			// Verify the result
			assert.strictEqual(result, 'github');
		});

		test('getOrActivateProviderIdForServer - should return undefined if authorizationServerGlobs match but authorizationServers do not match', async () => {
			// Register a declared provider with an authorization server glob
			const provider: AuthenticationProviderInformation = {
				id: 'github',
				label: 'GitHub',
				authorizationServerGlobs: ['https://github.com/*']
			};
			authenticationService.registerDeclaredAuthenticationProvider(provider);

			// Register an authentication provider with non-matching authorization servers
			const authProvider = createProvider({
				id: 'github',
				label: 'GitHub',
				authorizationServers: [URI.parse('https://github.com/different')]
			});
			authenticationService.registerAuthenticationProvider('github', authProvider);

			// Test with a non-matching URI
			const authorizationServer = URI.parse('https://github.com/login');
			const result = await authenticationService.getOrActivateProviderIdForServer(authorizationServer);

			// Verify the result
			assert.strictEqual(result, undefined);
		});

		test('getOrActivateProviderIdForAuthorizationServer - should check multiple providers and return the first match', async () => {
			// Register two declared providers with authorization server globs
			const provider1: AuthenticationProviderInformation = {
				id: 'github',
				label: 'GitHub',
				authorizationServerGlobs: ['https://github.com/*']
			};
			const provider2: AuthenticationProviderInformation = {
				id: 'microsoft',
				label: 'Microsoft',
				authorizationServerGlobs: ['https://login.microsoftonline.com/*']
			};
			authenticationService.registerDeclaredAuthenticationProvider(provider1);
			authenticationService.registerDeclaredAuthenticationProvider(provider2);

			// Register authentication providers
			const githubProvider = createProvider({
				id: 'github',
				label: 'GitHub',
				authorizationServers: [URI.parse('https://github.com/different')]
			});
			authenticationService.registerAuthenticationProvider('github', githubProvider);

			const microsoftProvider = createProvider({
				id: 'microsoft',
				label: 'Microsoft',
				authorizationServers: [URI.parse('https://login.microsoftonline.com/common')]
			});
			authenticationService.registerAuthenticationProvider('microsoft', microsoftProvider);

			// Test with a URI that should match the second provider
			const authorizationServer = URI.parse('https://login.microsoftonline.com/common');
			const result = await authenticationService.getOrActivateProviderIdForServer(authorizationServer);

			// Verify the result
			assert.strictEqual(result, 'microsoft');
		});

		test('getOrActivateProviderIdForServer - should match when resourceServer matches provider resourceServer', async () => {
			const authorizationServer = URI.parse('https://login.microsoftonline.com/common');
			const resourceServer = URI.parse('https://graph.microsoft.com');

			// Register an authentication provider with a resourceServer
			const authProvider = createProvider({
				id: 'microsoft',
				label: 'Microsoft',
				authorizationServers: [authorizationServer],
				resourceServer: resourceServer
			});
			authenticationService.registerAuthenticationProvider('microsoft', authProvider);

			// Test with matching authorization server and resource server
			const result = await authenticationService.getOrActivateProviderIdForServer(authorizationServer, resourceServer);

			// Verify the result
			assert.strictEqual(result, 'microsoft');
		});

		test('getOrActivateProviderIdForServer - should not match when resourceServer does not match provider resourceServer', async () => {
			const authorizationServer = URI.parse('https://login.microsoftonline.com/common');
			const resourceServer = URI.parse('https://graph.microsoft.com');
			const differentResourceServer = URI.parse('https://vault.azure.net');

			// Register an authentication provider with a resourceServer
			const authProvider = createProvider({
				id: 'microsoft',
				label: 'Microsoft',
				authorizationServers: [authorizationServer],
				resourceServer: resourceServer
			});
			authenticationService.registerAuthenticationProvider('microsoft', authProvider);

			// Test with matching authorization server but different resource server
			const result = await authenticationService.getOrActivateProviderIdForServer(authorizationServer, differentResourceServer);

			// Verify the result - should not match because resource servers don't match
			assert.strictEqual(result, undefined);
		});

		test('getOrActivateProviderIdForServer - should match when provider has no resourceServer and resourceServer is provided', async () => {
			const authorizationServer = URI.parse('https://login.microsoftonline.com/common');
			const resourceServer = URI.parse('https://graph.microsoft.com');

			// Register an authentication provider without a resourceServer
			const authProvider = createProvider({
				id: 'microsoft',
				label: 'Microsoft',
				authorizationServers: [authorizationServer]
			});
			authenticationService.registerAuthenticationProvider('microsoft', authProvider);

			// Test with matching authorization server and a resource server
			// Should match because provider has no resourceServer defined
			const result = await authenticationService.getOrActivateProviderIdForServer(authorizationServer, resourceServer);

			// Verify the result
			assert.strictEqual(result, 'microsoft');
		});

		test('getOrActivateProviderIdForServer - should match when provider has resourceServer but no resourceServer is provided', async () => {
			const authorizationServer = URI.parse('https://login.microsoftonline.com/common');
			const resourceServer = URI.parse('https://graph.microsoft.com');

			// Register an authentication provider with a resourceServer
			const authProvider = createProvider({
				id: 'microsoft',
				label: 'Microsoft',
				authorizationServers: [authorizationServer],
				resourceServer: resourceServer
			});
			authenticationService.registerAuthenticationProvider('microsoft', authProvider);

			// Test with matching authorization server but no resource server provided
			// Should match because no resourceServer is provided to check against
			const result = await authenticationService.getOrActivateProviderIdForServer(authorizationServer);

			// Verify the result
			assert.strictEqual(result, 'microsoft');
		});

		test('getOrActivateProviderIdForServer - should distinguish between providers with same authorization server but different resource servers', async () => {
			const authorizationServer = URI.parse('https://login.microsoftonline.com/common');
			const graphResourceServer = URI.parse('https://graph.microsoft.com');
			const vaultResourceServer = URI.parse('https://vault.azure.net');

			// Register first provider with Graph resource server
			const graphProvider = createProvider({
				id: 'microsoft-graph',
				label: 'Microsoft Graph',
				authorizationServers: [authorizationServer],
				resourceServer: graphResourceServer
			});
			authenticationService.registerAuthenticationProvider('microsoft-graph', graphProvider);

			// Register second provider with Vault resource server
			const vaultProvider = createProvider({
				id: 'microsoft-vault',
				label: 'Microsoft Vault',
				authorizationServers: [authorizationServer],
				resourceServer: vaultResourceServer
			});
			authenticationService.registerAuthenticationProvider('microsoft-vault', vaultProvider);

			// Test with Graph resource server - should match the first provider
			const graphResult = await authenticationService.getOrActivateProviderIdForServer(authorizationServer, graphResourceServer);
			assert.strictEqual(graphResult, 'microsoft-graph');

			// Test with Vault resource server - should match the second provider
			const vaultResult = await authenticationService.getOrActivateProviderIdForServer(authorizationServer, vaultResourceServer);
			assert.strictEqual(vaultResult, 'microsoft-vault');

			// Test with different resource server - should not match either
			const otherResourceServer = URI.parse('https://storage.azure.com');
			const noMatchResult = await authenticationService.getOrActivateProviderIdForServer(authorizationServer, otherResourceServer);
			assert.strictEqual(noMatchResult, undefined);
		});
	});

	suite('authenticationSessions', () => {
		test('getSessions - base case', async () => {
			let isCalled = false;
			const provider = createProvider({
				getSessions: async () => {
					isCalled = true;
					return [createSession()];
				},
			});
			authenticationService.registerAuthenticationProvider(provider.id, provider);
			const sessions = await authenticationService.getSessions(provider.id);

			assert.equal(sessions.length, 1);
			assert.ok(isCalled);
		});

		test('getSessions - authorization server is not registered', async () => {
			let isCalled = false;
			const provider = createProvider({
				getSessions: async () => {
					isCalled = true;
					return [createSession()];
				},
			});
			authenticationService.registerAuthenticationProvider(provider.id, provider);
			assert.rejects(() => authenticationService.getSessions(provider.id, [], { authorizationServer: URI.parse('https://example.com') }));
			assert.ok(!isCalled);
		});

		test('createSession', async () => {
			const emitter = new Emitter<AuthenticationSessionsChangeEvent>();
			const provider = createProvider({
				onDidChangeSessions: emitter.event,
				createSession: async () => {
					const session = createSession();
					emitter.fire({ added: [session], removed: [], changed: [] });
					return session;
				},
			});
			const changed = Event.toPromise(authenticationService.onDidChangeSessions);
			authenticationService.registerAuthenticationProvider(provider.id, provider);
			const session = await authenticationService.createSession(provider.id, ['repo']);

			// Assert that the created session matches the expected session and the event fires
			assert.ok(session);
			const result = await changed;
			assert.deepEqual(result, {
				providerId: provider.id,
				label: provider.label,
				event: { added: [session], removed: [], changed: [] }
			});
		});

		test('removeSession', async () => {
			const emitter = new Emitter<AuthenticationSessionsChangeEvent>();
			const session = createSession();
			const provider = createProvider({
				onDidChangeSessions: emitter.event,
				removeSession: async () => emitter.fire({ added: [], removed: [session], changed: [] })
			});
			const changed = Event.toPromise(authenticationService.onDidChangeSessions);
			authenticationService.registerAuthenticationProvider(provider.id, provider);
			await authenticationService.removeSession(provider.id, session.id);

			const result = await changed;
			assert.deepEqual(result, {
				providerId: provider.id,
				label: provider.label,
				event: { added: [], removed: [session], changed: [] }
			});
		});

		test('onDidChangeSessions', async () => {
			const emitter = new Emitter<AuthenticationSessionsChangeEvent>();
			const provider = createProvider({
				onDidChangeSessions: emitter.event,
				getSessions: async () => []
			});
			authenticationService.registerAuthenticationProvider(provider.id, provider);

			const changed = Event.toPromise(authenticationService.onDidChangeSessions);
			const session = createSession();
			emitter.fire({ added: [], removed: [], changed: [session] });

			const result = await changed;
			assert.deepEqual(result, {
				providerId: provider.id,
				label: provider.label,
				event: { added: [], removed: [], changed: [session] }
			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/auxiliaryWindow/browser/auxiliaryWindowService.ts]---
Location: vscode-main/src/vs/workbench/services/auxiliaryWindow/browser/auxiliaryWindowService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getZoomLevel } from '../../../../base/browser/browser.js';
import { $, Dimension, EventHelper, EventType, ModifierKeyEmitter, addDisposableListener, copyAttributes, createLinkElement, createMetaElement, getActiveWindow, getClientArea, getWindowId, isHTMLElement, position, registerWindow, sharedMutationObserver, trackAttributes } from '../../../../base/browser/dom.js';
import { cloneGlobalStylesheets, isGlobalStylesheet } from '../../../../base/browser/domStylesheets.js';
import { CodeWindow, ensureCodeWindow, mainWindow } from '../../../../base/browser/window.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { Barrier } from '../../../../base/common/async.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { mark } from '../../../../base/common/performance.js';
import { isFirefox, isWeb } from '../../../../base/common/platform.js';
import Severity from '../../../../base/common/severity.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { DEFAULT_AUX_WINDOW_SIZE, IRectangle, WindowMinimumSize } from '../../../../platform/window/common/window.js';
import { BaseWindow } from '../../../browser/window.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { IHostService } from '../../host/browser/host.js';
import { IWorkbenchLayoutService } from '../../layout/browser/layoutService.js';

export const IAuxiliaryWindowService = createDecorator<IAuxiliaryWindowService>('auxiliaryWindowService');

export interface IAuxiliaryWindowOpenEvent {
	readonly window: IAuxiliaryWindow;
	readonly disposables: DisposableStore;
}

export enum AuxiliaryWindowMode {
	Maximized,
	Normal,
	Fullscreen
}

export interface IAuxiliaryWindowOpenOptions {
	readonly bounds?: Partial<IRectangle>;
	readonly compact?: boolean;

	readonly mode?: AuxiliaryWindowMode;
	readonly zoomLevel?: number;
	readonly alwaysOnTop?: boolean;

	readonly nativeTitlebar?: boolean;
	readonly disableFullscreen?: boolean;
}

export interface IAuxiliaryWindowService {

	readonly _serviceBrand: undefined;

	readonly onDidOpenAuxiliaryWindow: Event<IAuxiliaryWindowOpenEvent>;

	open(options?: IAuxiliaryWindowOpenOptions): Promise<IAuxiliaryWindow>;

	getWindow(windowId: number): IAuxiliaryWindow | undefined;
}

export interface BeforeAuxiliaryWindowUnloadEvent {
	veto(reason: string | undefined): void;
}

export interface IAuxiliaryWindow extends IDisposable {

	readonly onWillLayout: Event<Dimension>;
	readonly onDidLayout: Event<Dimension>;

	readonly onBeforeUnload: Event<BeforeAuxiliaryWindowUnloadEvent>;
	readonly onUnload: Event<void>;

	readonly whenStylesHaveLoaded: Promise<void>;

	readonly window: CodeWindow;
	readonly container: HTMLElement;

	updateOptions(options: { compact: boolean } | undefined): void;

	layout(): void;

	createState(): IAuxiliaryWindowOpenOptions;
}

const DEFAULT_AUX_WINDOW_DIMENSIONS = new Dimension(DEFAULT_AUX_WINDOW_SIZE.width, DEFAULT_AUX_WINDOW_SIZE.height);

export class AuxiliaryWindow extends BaseWindow implements IAuxiliaryWindow {

	private readonly _onWillLayout = this._register(new Emitter<Dimension>());
	readonly onWillLayout = this._onWillLayout.event;

	private readonly _onDidLayout = this._register(new Emitter<Dimension>());
	readonly onDidLayout = this._onDidLayout.event;

	private readonly _onBeforeUnload = this._register(new Emitter<BeforeAuxiliaryWindowUnloadEvent>());
	readonly onBeforeUnload = this._onBeforeUnload.event;

	private readonly _onUnload = this._register(new Emitter<void>());
	readonly onUnload = this._onUnload.event;

	private readonly _onWillDispose = this._register(new Emitter<void>());
	readonly onWillDispose = this._onWillDispose.event;

	readonly whenStylesHaveLoaded: Promise<void>;

	private compact = false;

	constructor(
		readonly window: CodeWindow,
		readonly container: HTMLElement,
		stylesHaveLoaded: Barrier,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IHostService hostService: IHostService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService
	) {
		super(window, undefined, hostService, environmentService, contextMenuService, layoutService);

		this.whenStylesHaveLoaded = stylesHaveLoaded.wait().then(() => undefined);

		this.registerListeners();
	}

	updateOptions(options: { compact: boolean }): void {
		this.compact = options.compact;
	}

	private registerListeners(): void {
		this._register(addDisposableListener(this.window, EventType.BEFORE_UNLOAD, (e: BeforeUnloadEvent) => this.handleBeforeUnload(e)));
		this._register(addDisposableListener(this.window, EventType.UNLOAD, () => this.handleUnload()));

		this._register(addDisposableListener(this.window, 'unhandledrejection', e => {
			onUnexpectedError(e.reason);
			e.preventDefault();
		}));

		this._register(addDisposableListener(this.window, EventType.RESIZE, () => this.layout()));

		this._register(addDisposableListener(this.container, EventType.SCROLL, () => this.container.scrollTop = 0)); 						// Prevent container from scrolling (#55456)

		if (isWeb) {
			this._register(addDisposableListener(this.container, EventType.DROP, e => EventHelper.stop(e, true))); 							// Prevent default navigation on drop
			this._register(addDisposableListener(this.container, EventType.WHEEL, e => e.preventDefault(), { passive: false })); 			// Prevent the back/forward gestures in macOS
			this._register(addDisposableListener(this.container, EventType.CONTEXT_MENU, e => EventHelper.stop(e, true))); 					// Prevent native context menus in web
		} else {
			this._register(addDisposableListener(this.window.document.body, EventType.DRAG_OVER, (e: DragEvent) => EventHelper.stop(e)));	// Prevent drag feedback on <body>
			this._register(addDisposableListener(this.window.document.body, EventType.DROP, (e: DragEvent) => EventHelper.stop(e)));		// Prevent default navigation on drop
		}
	}

	private handleBeforeUnload(e: BeforeUnloadEvent): void {

		// Check for veto from a listening component
		let veto: string | undefined;
		this._onBeforeUnload.fire({
			veto(reason) {
				if (reason) {
					veto = reason;
				}
			}
		});
		if (veto) {
			this.handleVetoBeforeClose(e, veto);

			return;
		}

		// Check for confirm before close setting
		const confirmBeforeCloseSetting = this.configurationService.getValue<'always' | 'never' | 'keyboardOnly'>('window.confirmBeforeClose');
		const confirmBeforeClose = confirmBeforeCloseSetting === 'always' || (confirmBeforeCloseSetting === 'keyboardOnly' && ModifierKeyEmitter.getInstance().isModifierPressed);
		if (confirmBeforeClose) {
			this.confirmBeforeClose(e);
		}
	}

	protected handleVetoBeforeClose(e: BeforeUnloadEvent, reason: string): void {
		this.preventUnload(e);
	}

	protected preventUnload(e: BeforeUnloadEvent): void {
		e.preventDefault();
		e.returnValue = localize('lifecycleVeto', "Changes that you made may not be saved. Please check press 'Cancel' and try again.");
	}

	protected confirmBeforeClose(e: BeforeUnloadEvent): void {
		this.preventUnload(e);
	}

	private handleUnload(): void {

		// Event
		this._onUnload.fire();
	}

	layout(): void {

		// Split layout up into two events so that downstream components
		// have a chance to participate in the beginning or end of the
		// layout phase.
		// This helps to build the auxiliary window in another component
		// in the `onWillLayout` phase and then let other compoments
		// react when the overall layout has finished in `onDidLayout`.

		const dimension = getClientArea(this.window.document.body, DEFAULT_AUX_WINDOW_DIMENSIONS, this.container);
		this._onWillLayout.fire(dimension);
		this._onDidLayout.fire(dimension);
	}

	createState(): IAuxiliaryWindowOpenOptions {
		return {
			bounds: {
				x: this.window.screenX,
				y: this.window.screenY,
				width: this.window.outerWidth,
				height: this.window.outerHeight
			},
			zoomLevel: getZoomLevel(this.window),
			compact: this.compact
		};
	}

	override dispose(): void {
		if (this._store.isDisposed) {
			return;
		}

		this._onWillDispose.fire();

		super.dispose();
	}
}

export class BrowserAuxiliaryWindowService extends Disposable implements IAuxiliaryWindowService {

	declare readonly _serviceBrand: undefined;

	private static WINDOW_IDS = getWindowId(mainWindow) + 1; // start from the main window ID + 1

	private readonly _onDidOpenAuxiliaryWindow = this._register(new Emitter<IAuxiliaryWindowOpenEvent>());
	readonly onDidOpenAuxiliaryWindow = this._onDidOpenAuxiliaryWindow.event;

	private readonly windows = new Map<number, IAuxiliaryWindow>();

	constructor(
		@IWorkbenchLayoutService protected readonly layoutService: IWorkbenchLayoutService,
		@IDialogService protected readonly dialogService: IDialogService,
		@IConfigurationService protected readonly configurationService: IConfigurationService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IHostService protected readonly hostService: IHostService,
		@IWorkbenchEnvironmentService protected readonly environmentService: IWorkbenchEnvironmentService,
		@IContextMenuService protected readonly contextMenuService: IContextMenuService,
	) {
		super();
	}

	async open(options?: IAuxiliaryWindowOpenOptions): Promise<IAuxiliaryWindow> {
		mark('code/auxiliaryWindow/willOpen');

		const targetWindow = await this.openWindow(options);
		if (!targetWindow) {
			throw new Error(localize('unableToOpenWindowError', "Unable to open a new window."));
		}

		// Add a `vscodeWindowId` property to identify auxiliary windows
		const resolvedWindowId = await this.resolveWindowId(targetWindow);
		ensureCodeWindow(targetWindow, resolvedWindowId);

		const containerDisposables = new DisposableStore();
		const { container, stylesLoaded } = this.createContainer(targetWindow, containerDisposables, options);

		const auxiliaryWindow = this.createAuxiliaryWindow(targetWindow, container, stylesLoaded);
		auxiliaryWindow.updateOptions({ compact: options?.compact ?? false });

		const registryDisposables = new DisposableStore();
		this.windows.set(targetWindow.vscodeWindowId, auxiliaryWindow);
		registryDisposables.add(toDisposable(() => this.windows.delete(targetWindow.vscodeWindowId)));

		const eventDisposables = new DisposableStore();

		Event.once(auxiliaryWindow.onWillDispose)(() => {
			targetWindow.close();

			containerDisposables.dispose();
			registryDisposables.dispose();
			eventDisposables.dispose();
		});

		registryDisposables.add(registerWindow(targetWindow));
		this._onDidOpenAuxiliaryWindow.fire({ window: auxiliaryWindow, disposables: eventDisposables });

		mark('code/auxiliaryWindow/didOpen');

		type AuxiliaryWindowClassification = {
			owner: 'bpasero';
			comment: 'An event that fires when an auxiliary window is opened';
			bounds: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Has window bounds provided.' };
		};
		type AuxiliaryWindowOpenEvent = {
			bounds: boolean;
		};
		this.telemetryService.publicLog2<AuxiliaryWindowOpenEvent, AuxiliaryWindowClassification>('auxiliaryWindowOpen', { bounds: !!options?.bounds });

		return auxiliaryWindow;
	}

	protected createAuxiliaryWindow(targetWindow: CodeWindow, container: HTMLElement, stylesLoaded: Barrier): AuxiliaryWindow {
		return new AuxiliaryWindow(targetWindow, container, stylesLoaded, this.configurationService, this.hostService, this.environmentService, this.contextMenuService, this.layoutService);
	}

	private async openWindow(options?: IAuxiliaryWindowOpenOptions): Promise<Window | undefined> {
		const activeWindow = getActiveWindow();
		const activeWindowBounds = {
			x: activeWindow.screenX,
			y: activeWindow.screenY,
			width: activeWindow.outerWidth,
			height: activeWindow.outerHeight
		};

		const defaultSize = DEFAULT_AUX_WINDOW_SIZE;

		const width = Math.max(options?.bounds?.width ?? defaultSize.width, WindowMinimumSize.WIDTH);
		const height = Math.max(options?.bounds?.height ?? defaultSize.height, WindowMinimumSize.HEIGHT);

		let newWindowBounds: IRectangle = {
			x: options?.bounds?.x ?? Math.max(activeWindowBounds.x + activeWindowBounds.width / 2 - width / 2, 0),
			y: options?.bounds?.y ?? Math.max(activeWindowBounds.y + activeWindowBounds.height / 2 - height / 2, 0),
			width,
			height
		};

		if (!options?.bounds && newWindowBounds.x === activeWindowBounds.x && newWindowBounds.y === activeWindowBounds.y) {
			// Offset the new window a bit so that it does not overlap
			// with the active window, unless bounds are provided
			newWindowBounds = {
				...newWindowBounds,
				x: newWindowBounds.x + 30,
				y: newWindowBounds.y + 30
			};
		}

		const features = coalesce([
			'popup=yes',
			`left=${newWindowBounds.x}`,
			`top=${newWindowBounds.y}`,
			`width=${newWindowBounds.width}`,
			`height=${newWindowBounds.height}`,

			// non-standard properties
			options?.nativeTitlebar ? 'window-native-titlebar=yes' : undefined,
			options?.disableFullscreen ? 'window-disable-fullscreen=yes' : undefined,
			options?.alwaysOnTop ? 'window-always-on-top=yes' : undefined,
			options?.mode === AuxiliaryWindowMode.Maximized ? 'window-maximized=yes' : undefined,
			options?.mode === AuxiliaryWindowMode.Fullscreen ? 'window-fullscreen=yes' : undefined
		]);

		const auxiliaryWindow = mainWindow.open(isFirefox ? '' /* FF immediately fires an unload event if using about:blank */ : 'about:blank', undefined, features.join(','));
		if (!auxiliaryWindow && isWeb) {
			return (await this.dialogService.prompt({
				type: Severity.Warning,
				message: localize('unableToOpenWindow', "The browser blocked opening a new window. Press 'Retry' to try again."),
				custom: {
					markdownDetails: [{ markdown: new MarkdownString(localize('unableToOpenWindowDetail', "Please allow pop-ups for this website in your [browser settings]({0}).", 'https://aka.ms/allow-vscode-popup'), true) }]
				},
				buttons: [
					{
						label: localize({ key: 'retry', comment: ['&& denotes a mnemonic'] }, "&&Retry"),
						run: () => this.openWindow(options)
					}
				],
				cancelButton: true
			})).result;
		}

		return auxiliaryWindow?.window;
	}

	protected async resolveWindowId(auxiliaryWindow: Window): Promise<number> {
		return BrowserAuxiliaryWindowService.WINDOW_IDS++;
	}

	protected createContainer(auxiliaryWindow: CodeWindow, disposables: DisposableStore, options?: IAuxiliaryWindowOpenOptions): { stylesLoaded: Barrier; container: HTMLElement } {
		auxiliaryWindow.document.createElement = function () {
			// Disallow `createElement` because it would create
			// HTML Elements in the "wrong" context and break
			// code that does "instanceof HTMLElement" etc.
			throw new Error('Not allowed to create elements in child window JavaScript context. Always use the main window so that "xyz instanceof HTMLElement" continues to work.');
		};

		this.applyMeta(auxiliaryWindow);
		const { stylesLoaded } = this.applyCSS(auxiliaryWindow, disposables);
		const container = this.applyHTML(auxiliaryWindow, disposables);

		return { stylesLoaded, container };
	}

	private applyMeta(auxiliaryWindow: CodeWindow): void {
		for (const metaTag of ['meta[charset="utf-8"]', 'meta[http-equiv="Content-Security-Policy"]', 'meta[name="viewport"]', 'meta[name="theme-color"]']) {
			// eslint-disable-next-line no-restricted-syntax
			const metaElement = mainWindow.document.querySelector(metaTag);
			if (metaElement) {
				const clonedMetaElement = createMetaElement(auxiliaryWindow.document.head);
				copyAttributes(metaElement, clonedMetaElement);

				if (metaTag === 'meta[http-equiv="Content-Security-Policy"]') {
					const content = clonedMetaElement.getAttribute('content');
					if (content) {
						clonedMetaElement.setAttribute('content', content.replace(/(script-src[^\;]*)/, `script-src 'none'`));
					}
				}
			}
		}

		// eslint-disable-next-line no-restricted-syntax
		const originalIconLinkTag = mainWindow.document.querySelector('link[rel="icon"]');
		if (originalIconLinkTag) {
			const icon = createLinkElement(auxiliaryWindow.document.head);
			copyAttributes(originalIconLinkTag, icon);
		}
	}

	private applyCSS(auxiliaryWindow: CodeWindow, disposables: DisposableStore) {
		mark('code/auxiliaryWindow/willApplyCSS');

		const mapOriginalToClone = new Map<Node /* original */, Node /* clone */>();

		const stylesLoaded = new Barrier();
		stylesLoaded.wait().then(() => mark('code/auxiliaryWindow/didLoadCSSStyles'));

		const pendingLinksDisposables = disposables.add(new DisposableStore());

		let pendingLinksToSettle = 0;
		function onLinkSettled() {
			if (--pendingLinksToSettle === 0) {
				pendingLinksDisposables.dispose();
				stylesLoaded.open();
			}
		}

		function cloneNode(originalNode: Element): void {
			if (isGlobalStylesheet(originalNode)) {
				return; // global stylesheets are handled by `cloneGlobalStylesheets` below
			}

			const clonedNode = auxiliaryWindow.document.head.appendChild(originalNode.cloneNode(true));
			if (originalNode.tagName.toLowerCase() === 'link') {
				pendingLinksToSettle++;

				pendingLinksDisposables.add(addDisposableListener(clonedNode, 'load', onLinkSettled));
				pendingLinksDisposables.add(addDisposableListener(clonedNode, 'error', onLinkSettled));
			}

			mapOriginalToClone.set(originalNode, clonedNode);
		}

		// Clone all style elements and stylesheet links from the window to the child window
		// and keep track of <link> elements to settle to signal that styles have loaded
		// Increment pending links right from the beginning to ensure we only settle when
		// all style related nodes have been cloned.
		pendingLinksToSettle++;
		try {
			// eslint-disable-next-line no-restricted-syntax
			for (const originalNode of mainWindow.document.head.querySelectorAll('link[rel="stylesheet"], style')) {
				cloneNode(originalNode);
			}
		} finally {
			onLinkSettled();
		}

		// Global stylesheets in <head> are cloned in a special way because the mutation
		// observer is not firing for changes done via `style.sheet` API. Only text changes
		// can be observed.
		disposables.add(cloneGlobalStylesheets(auxiliaryWindow));

		// Listen to new stylesheets as they are being added or removed in the main window
		// and apply to child window (including changes to existing stylesheets elements)
		disposables.add(sharedMutationObserver.observe(mainWindow.document.head, disposables, { childList: true, subtree: true })(mutations => {
			for (const mutation of mutations) {
				if (
					mutation.type !== 'childList' ||						// only interested in added/removed nodes
					mutation.target.nodeName.toLowerCase() === 'title' || 	// skip over title changes that happen frequently
					mutation.target.nodeName.toLowerCase() === 'script' || 	// block <script> changes that are unsupported anyway
					mutation.target.nodeName.toLowerCase() === 'meta'		// do not observe <meta> elements for now
				) {
					continue;
				}

				for (const node of mutation.addedNodes) {

					// <style>/<link> element was added
					if (isHTMLElement(node) && (node.tagName.toLowerCase() === 'style' || node.tagName.toLowerCase() === 'link')) {
						cloneNode(node);
					}

					// text-node was changed, try to apply to our clones
					else if (node.nodeType === Node.TEXT_NODE && node.parentNode) {
						const clonedNode = mapOriginalToClone.get(node.parentNode);
						if (clonedNode) {
							clonedNode.textContent = node.textContent;
						}
					}
				}

				for (const node of mutation.removedNodes) {
					const clonedNode = mapOriginalToClone.get(node);
					if (clonedNode) {
						clonedNode.parentNode?.removeChild(clonedNode);
						mapOriginalToClone.delete(node);
					}
				}
			}
		}));

		mark('code/auxiliaryWindow/didApplyCSS');

		return { stylesLoaded };
	}

	private applyHTML(auxiliaryWindow: CodeWindow, disposables: DisposableStore): HTMLElement {
		mark('code/auxiliaryWindow/willApplyHTML');

		// Create workbench container and apply classes
		const container = $('div', { role: 'application' });
		position(container, 0, 0, 0, 0, 'relative');
		container.style.display = 'flex';
		container.style.height = '100%';
		container.style.flexDirection = 'column';
		auxiliaryWindow.document.body.append(container);

		// Track attributes
		disposables.add(trackAttributes(mainWindow.document.documentElement, auxiliaryWindow.document.documentElement));
		disposables.add(trackAttributes(mainWindow.document.body, auxiliaryWindow.document.body));
		disposables.add(trackAttributes(this.layoutService.mainContainer, container, ['class'])); // only class attribute

		mark('code/auxiliaryWindow/didApplyHTML');

		return container;
	}

	getWindow(windowId: number): IAuxiliaryWindow | undefined {
		return this.windows.get(windowId);
	}
}

registerSingleton(IAuxiliaryWindowService, BrowserAuxiliaryWindowService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/auxiliaryWindow/electron-browser/auxiliaryWindowService.ts]---
Location: vscode-main/src/vs/workbench/services/auxiliaryWindow/electron-browser/auxiliaryWindowService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IWorkbenchLayoutService } from '../../layout/browser/layoutService.js';
import { AuxiliaryWindow, AuxiliaryWindowMode, BrowserAuxiliaryWindowService, IAuxiliaryWindowOpenOptions, IAuxiliaryWindowService } from '../browser/auxiliaryWindowService.js';
import { ISandboxGlobals } from '../../../../base/parts/sandbox/electron-browser/globals.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { CodeWindow } from '../../../../base/browser/window.js';
import { mark } from '../../../../base/common/performance.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ShutdownReason } from '../../lifecycle/common/lifecycle.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { Barrier } from '../../../../base/common/async.js';
import { IHostService } from '../../host/browser/host.js';
import { applyZoom } from '../../../../platform/window/electron-browser/window.js';
import { getZoomLevel, isFullscreen, setFullscreen } from '../../../../base/browser/browser.js';
import { getActiveWindow } from '../../../../base/browser/dom.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { isMacintosh } from '../../../../base/common/platform.js';
import { assert } from '../../../../base/common/assert.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';

type NativeCodeWindow = CodeWindow & {
	readonly vscode: ISandboxGlobals;
};

export class NativeAuxiliaryWindow extends AuxiliaryWindow {

	private skipUnloadConfirmation = false;

	private maximized = false;
	private alwaysOnTop = false;

	constructor(
		window: CodeWindow,
		container: HTMLElement,
		stylesHaveLoaded: Barrier,
		@IConfigurationService configurationService: IConfigurationService,
		@INativeHostService private readonly nativeHostService: INativeHostService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IHostService hostService: IHostService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IDialogService private readonly dialogService: IDialogService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService
	) {
		super(window, container, stylesHaveLoaded, configurationService, hostService, environmentService, contextMenuService, layoutService);

		if (!isMacintosh) {
			// For now, limit this to platforms that have clear maximised
			// transitions (Windows, Linux) via window buttons.
			this.handleMaximizedState();
		}

		this.handleFullScreenState();
		this.handleAlwaysOnTopState();
	}

	private handleMaximizedState(): void {
		(async () => {
			this.maximized = await this.nativeHostService.isMaximized({ targetWindowId: this.window.vscodeWindowId });
		})();

		this._register(this.nativeHostService.onDidMaximizeWindow(windowId => {
			if (windowId === this.window.vscodeWindowId) {
				this.maximized = true;
			}
		}));

		this._register(this.nativeHostService.onDidUnmaximizeWindow(windowId => {
			if (windowId === this.window.vscodeWindowId) {
				this.maximized = false;
			}
		}));
	}

	private handleAlwaysOnTopState(): void {
		(async () => {
			this.alwaysOnTop = await this.nativeHostService.isWindowAlwaysOnTop({ targetWindowId: this.window.vscodeWindowId });
		})();

		this._register(this.nativeHostService.onDidChangeWindowAlwaysOnTop(({ windowId, alwaysOnTop }) => {
			if (windowId === this.window.vscodeWindowId) {
				this.alwaysOnTop = alwaysOnTop;
			}
		}));
	}

	private async handleFullScreenState(): Promise<void> {
		const fullscreen = await this.nativeHostService.isFullScreen({ targetWindowId: this.window.vscodeWindowId });
		if (fullscreen) {
			setFullscreen(true, this.window);
		}
	}

	protected override async handleVetoBeforeClose(e: BeforeUnloadEvent, veto: string): Promise<void> {
		this.preventUnload(e);

		await this.dialogService.error(veto, localize('backupErrorDetails', "Try saving or reverting the editors with unsaved changes first and then try again."));
	}

	protected override async confirmBeforeClose(e: BeforeUnloadEvent): Promise<void> {
		if (this.skipUnloadConfirmation) {
			return;
		}

		this.preventUnload(e);

		const confirmed = await this.instantiationService.invokeFunction(accessor => NativeAuxiliaryWindow.confirmOnShutdown(accessor, ShutdownReason.CLOSE));
		if (confirmed) {
			this.skipUnloadConfirmation = true;
			this.nativeHostService.closeWindow({ targetWindowId: this.window.vscodeWindowId });
		}
	}

	protected override preventUnload(e: BeforeUnloadEvent): void {
		e.preventDefault();
		e.returnValue = true;
	}

	override createState(): IAuxiliaryWindowOpenOptions {
		const state = super.createState();
		const fullscreen = isFullscreen(this.window);
		return {
			...state,
			bounds: state.bounds,
			mode: this.maximized ? AuxiliaryWindowMode.Maximized : fullscreen ? AuxiliaryWindowMode.Fullscreen : AuxiliaryWindowMode.Normal,
			alwaysOnTop: this.alwaysOnTop
		};
	}
}

export class NativeAuxiliaryWindowService extends BrowserAuxiliaryWindowService {

	constructor(
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@IConfigurationService configurationService: IConfigurationService,
		@INativeHostService private readonly nativeHostService: INativeHostService,
		@IDialogService dialogService: IDialogService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IHostService hostService: IHostService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IContextMenuService contextMenuService: IContextMenuService,
	) {
		super(layoutService, dialogService, configurationService, telemetryService, hostService, environmentService, contextMenuService);
	}

	protected override async resolveWindowId(auxiliaryWindow: NativeCodeWindow): Promise<number> {
		mark('code/auxiliaryWindow/willResolveWindowId');
		const windowId = await auxiliaryWindow.vscode.ipcRenderer.invoke('vscode:registerAuxiliaryWindow', this.nativeHostService.windowId);
		mark('code/auxiliaryWindow/didResolveWindowId');
		assert(typeof windowId === 'number');

		return windowId;
	}

	protected override createContainer(auxiliaryWindow: NativeCodeWindow, disposables: DisposableStore, options?: IAuxiliaryWindowOpenOptions) {

		// Zoom level (either explicitly provided or inherited from main window)
		let windowZoomLevel: number;
		if (typeof options?.zoomLevel === 'number') {
			windowZoomLevel = options.zoomLevel;
		} else {
			windowZoomLevel = getZoomLevel(getActiveWindow());
		}

		applyZoom(windowZoomLevel, auxiliaryWindow);

		return super.createContainer(auxiliaryWindow, disposables);
	}

	protected override createAuxiliaryWindow(targetWindow: CodeWindow, container: HTMLElement, stylesHaveLoaded: Barrier): AuxiliaryWindow {
		return new NativeAuxiliaryWindow(targetWindow, container, stylesHaveLoaded, this.configurationService, this.nativeHostService, this.instantiationService, this.hostService, this.environmentService, this.dialogService, this.contextMenuService, this.layoutService);
	}
}

registerSingleton(IAuxiliaryWindowService, NativeAuxiliaryWindowService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/banner/browser/bannerService.ts]---
Location: vscode-main/src/vs/workbench/services/banner/browser/bannerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { URI } from '../../../../base/common/uri.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ILinkDescriptor } from '../../../../platform/opener/browser/link.js';
import { ThemeIcon } from '../../../../base/common/themables.js';

export interface IBannerItem {
	readonly id: string;
	readonly icon: ThemeIcon | URI | undefined;
	readonly message: string | MarkdownString;
	readonly actions?: ILinkDescriptor[];
	readonly ariaLabel?: string;
	readonly onClose?: () => void;
	readonly closeLabel?: string;
}

export const IBannerService = createDecorator<IBannerService>('bannerService');

export interface IBannerService {
	readonly _serviceBrand: undefined;

	focus(): void;
	focusNextAction(): void;
	focusPreviousAction(): void;
	hide(id: string): void;
	show(item: IBannerItem): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/browserElements/browser/browserElementsService.ts]---
Location: vscode-main/src/vs/workbench/services/browserElements/browser/browserElementsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { BrowserType, IElementData } from '../../../../platform/browserElements/common/browserElements.js';
import { IRectangle } from '../../../../platform/window/common/window.js';

export const IBrowserElementsService = createDecorator<IBrowserElementsService>('browserElementsService');

export interface IBrowserElementsService {
	_serviceBrand: undefined;

	// no browser implementation yet
	getElementData(rect: IRectangle, token: CancellationToken, browserType: BrowserType | undefined): Promise<IElementData | undefined>;

	startDebugSession(token: CancellationToken, browserType: BrowserType): Promise<void>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/browserElements/browser/webBrowserElementsService.ts]---
Location: vscode-main/src/vs/workbench/services/browserElements/browser/webBrowserElementsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BrowserType, IElementData } from '../../../../platform/browserElements/common/browserElements.js';
import { IRectangle } from '../../../../platform/window/common/window.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { registerSingleton, InstantiationType } from '../../../../platform/instantiation/common/extensions.js';
import { IBrowserElementsService } from './browserElementsService.js';

class WebBrowserElementsService implements IBrowserElementsService {
	_serviceBrand: undefined;

	constructor() { }

	async getElementData(rect: IRectangle, token: CancellationToken): Promise<IElementData | undefined> {
		throw new Error('Not implemented');
	}

	startDebugSession(token: CancellationToken, browserType: BrowserType): Promise<void> {
		throw new Error('Not implemented');
	}
}

registerSingleton(IBrowserElementsService, WebBrowserElementsService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/browserElements/electron-browser/browserElementsService.ts]---
Location: vscode-main/src/vs/workbench/services/browserElements/electron-browser/browserElementsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BrowserType, IElementData, INativeBrowserElementsService } from '../../../../platform/browserElements/common/browserElements.js';
import { IRectangle } from '../../../../platform/window/common/window.js';
import { ipcRenderer } from '../../../../base/parts/sandbox/electron-browser/globals.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { registerSingleton, InstantiationType } from '../../../../platform/instantiation/common/extensions.js';
import { IBrowserElementsService } from '../browser/browserElementsService.js';
import { IMainProcessService } from '../../../../platform/ipc/common/mainProcessService.js';
import { INativeWorkbenchEnvironmentService } from '../../environment/electron-browser/environmentService.js';
import { NativeBrowserElementsService } from '../../../../platform/browserElements/common/nativeBrowserElementsService.js';

class WorkbenchNativeBrowserElementsService extends NativeBrowserElementsService {

	constructor(
		@INativeWorkbenchEnvironmentService environmentService: INativeWorkbenchEnvironmentService,
		@IMainProcessService mainProcessService: IMainProcessService
	) {
		super(environmentService.window.id, mainProcessService);
	}
}

let cancelSelectionIdPool = 0;
let cancelAndDetachIdPool = 0;

class WorkbenchBrowserElementsService implements IBrowserElementsService {
	_serviceBrand: undefined;

	constructor(
		@INativeBrowserElementsService private readonly simpleBrowser: INativeBrowserElementsService
	) { }

	async startDebugSession(token: CancellationToken, browserType: BrowserType): Promise<void> {
		const cancelAndDetachId = cancelAndDetachIdPool++;
		const onCancelChannel = `vscode:cancelCurrentSession${cancelAndDetachId}`;

		const disposable = token.onCancellationRequested(() => {
			ipcRenderer.send(onCancelChannel, cancelAndDetachId);
			disposable.dispose();
		});
		try {
			await this.simpleBrowser.startDebugSession(token, browserType, cancelAndDetachId);
		} catch (error) {
			disposable.dispose();
			throw new Error('No debug session target found', error);
		}
	}

	async getElementData(rect: IRectangle, token: CancellationToken, browserType: BrowserType | undefined): Promise<IElementData | undefined> {
		if (!browserType) {
			return undefined;
		}
		const cancelSelectionId = cancelSelectionIdPool++;
		const onCancelChannel = `vscode:cancelElementSelection${cancelSelectionId}`;
		const disposable = token.onCancellationRequested(() => {
			ipcRenderer.send(onCancelChannel, cancelSelectionId);
		});
		try {
			const elementData = await this.simpleBrowser.getElementData(rect, token, browserType, cancelSelectionId);
			return elementData;
		} catch (error) {
			disposable.dispose();
			throw new Error(`Native Host: Error getting element data: ${error}`);
		} finally {
			disposable.dispose();
		}
	}
}

registerSingleton(IBrowserElementsService, WorkbenchBrowserElementsService, InstantiationType.Delayed);
registerSingleton(INativeBrowserElementsService, WorkbenchNativeBrowserElementsService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/chat/common/chatEntitlementService.ts]---
Location: vscode-main/src/vs/workbench/services/chat/common/chatEntitlementService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import product from '../../../../platform/product/common/product.js';
import { Barrier } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Lazy } from '../../../../base/common/lazy.js';
import { Disposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { IRequestContext } from '../../../../base/parts/request/common/request.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { createDecorator, IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { asText, IRequestService } from '../../../../platform/request/common/request.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService, TelemetryLevel } from '../../../../platform/telemetry/common/telemetry.js';
import { AuthenticationSession, AuthenticationSessionAccount, IAuthenticationExtensionsService, IAuthenticationService } from '../../authentication/common/authentication.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { URI } from '../../../../base/common/uri.js';
import Severity from '../../../../base/common/severity.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { isWeb } from '../../../../base/common/platform.js';
import { ILifecycleService, LifecyclePhase } from '../../lifecycle/common/lifecycle.js';
import { Mutable } from '../../../../base/common/types.js';
import { distinct } from '../../../../base/common/arrays.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IObservable, observableFromEvent } from '../../../../base/common/observable.js';

export namespace ChatEntitlementContextKeys {

	export const Setup = {
		hidden: new RawContextKey<boolean>('chatSetupHidden', false, true), 		// True when chat setup is explicitly hidden.
		installed: new RawContextKey<boolean>('chatSetupInstalled', false, true),  	// True when the chat extension is installed and enabled.
		disabled: new RawContextKey<boolean>('chatSetupDisabled', false, true),  	// True when the chat extension is disabled due to any other reason than workspace trust.
		untrusted: new RawContextKey<boolean>('chatSetupUntrusted', false, true),  	// True when the chat extension is disabled due to workspace trust.
		later: new RawContextKey<boolean>('chatSetupLater', false, true),  			// True when the user wants to finish setup later.
		registered: new RawContextKey<boolean>('chatSetupRegistered', false, true)  // True when the user has registered as Free or Pro user.
	};

	export const Entitlement = {
		signedOut: new RawContextKey<boolean>('chatEntitlementSignedOut', false, true), 				// True when user is signed out.
		canSignUp: new RawContextKey<boolean>('chatPlanCanSignUp', false, true), 						// True when user can sign up to be a chat free user.

		planFree: new RawContextKey<boolean>('chatPlanFree', false, true),								// True when user is a chat free user.
		planPro: new RawContextKey<boolean>('chatPlanPro', false, true),								// True when user is a chat pro user.
		planProPlus: new RawContextKey<boolean>('chatPlanProPlus', false, true), 						// True when user is a chat pro plus user.
		planBusiness: new RawContextKey<boolean>('chatPlanBusiness', false, true), 						// True when user is a chat business user.
		planEnterprise: new RawContextKey<boolean>('chatPlanEnterprise', false, true), 					// True when user is a chat enterprise user.

		organisations: new RawContextKey<string[]>('chatEntitlementOrganisations', undefined, true), 	// The organizations the user belongs to.
		internal: new RawContextKey<boolean>('chatEntitlementInternal', false, true), 					// True when user belongs to internal organisation.
		sku: new RawContextKey<string>('chatEntitlementSku', undefined, true), 							// The SKU of the user.
	};

	export const chatQuotaExceeded = new RawContextKey<boolean>('chatQuotaExceeded', false, true);
	export const completionsQuotaExceeded = new RawContextKey<boolean>('completionsQuotaExceeded', false, true);

	export const chatAnonymous = new RawContextKey<boolean>('chatAnonymous', false, true);
}

export const IChatEntitlementService = createDecorator<IChatEntitlementService>('chatEntitlementService');

export enum ChatEntitlement {
	/** Signed out */
	Unknown = 1,
	/** Signed in but not yet resolved */
	Unresolved = 2,
	/** Signed in and entitled to Free */
	Available = 3,
	/** Signed in but not entitled to Free */
	Unavailable = 4,
	/** Signed-up to Free */
	Free = 5,
	/** Signed-up to Pro */
	Pro = 6,
	/** Signed-up to Pro Plus */
	ProPlus = 7,
	/** Signed-up to Business */
	Business = 8,
	/** Signed-up to Enterprise */
	Enterprise = 9,
}

export interface IChatSentiment {

	/**
	 * User has Chat installed.
	 */
	installed?: boolean;

	/**
	 * User signals no intent in using Chat.
	 *
	 * Note: in contrast to `disabled`, this should not only disable
	 * Chat but also hide all of its UI.
	 */
	hidden?: boolean;

	/**
	 * User signals intent to disable Chat.
	 *
	 * Note: in contrast to `hidden`, this should not hide
	 * Chat but but disable its functionality.
	 */
	disabled?: boolean;

	/**
	 * Chat is disabled due to missing workspace trust.
	 *
	 * Note: even though this disables Chat, we want to treat it
	 * different from the `disabled` state that is by explicit
	 * user choice.
	 */
	untrusted?: boolean;

	/**
	 * User signals intent to use Chat later.
	 */
	later?: boolean;

	/**
	 * User has registered as Free or Pro user.
	 */
	registered?: boolean;
}

export interface IChatEntitlementService {

	_serviceBrand: undefined;

	readonly onDidChangeEntitlement: Event<void>;

	readonly entitlement: ChatEntitlement;
	readonly entitlementObs: IObservable<ChatEntitlement>;

	readonly organisations: string[] | undefined;
	readonly isInternal: boolean;
	readonly sku: string | undefined;

	readonly onDidChangeQuotaExceeded: Event<void>;
	readonly onDidChangeQuotaRemaining: Event<void>;

	readonly quotas: IQuotas;

	readonly onDidChangeSentiment: Event<void>;

	readonly sentiment: IChatSentiment;
	readonly sentimentObs: IObservable<IChatSentiment>;

	// TODO@bpasero eventually this will become enabled by default
	// and in that case we only need to check on entitlements change
	// between `unknown` and any other entitlement.
	readonly onDidChangeAnonymous: Event<void>;
	readonly anonymous: boolean;
	readonly anonymousObs: IObservable<boolean>;

	update(token: CancellationToken): Promise<void>;
}

//#region Helper Functions

/**
 * Checks the chat entitlements to see if the user falls into the paid category
 * @param chatEntitlement The chat entitlement to check
 * @returns Whether or not they are a paid user
 */
export function isProUser(chatEntitlement: ChatEntitlement): boolean {
	return chatEntitlement === ChatEntitlement.Pro ||
		chatEntitlement === ChatEntitlement.ProPlus ||
		chatEntitlement === ChatEntitlement.Business ||
		chatEntitlement === ChatEntitlement.Enterprise;
}

//#region Service Implementation

const defaultChat = {
	extensionId: product.defaultChatAgent?.extensionId ?? '',
	chatExtensionId: product.defaultChatAgent?.chatExtensionId ?? '',
	upgradePlanUrl: product.defaultChatAgent?.upgradePlanUrl ?? '',
	provider: product.defaultChatAgent?.provider ?? { default: { id: '' }, enterprise: { id: '' } },
	providerUriSetting: product.defaultChatAgent?.providerUriSetting ?? '',
	providerScopes: product.defaultChatAgent?.providerScopes ?? [[]],
	entitlementUrl: product.defaultChatAgent?.entitlementUrl ?? '',
	entitlementSignupLimitedUrl: product.defaultChatAgent?.entitlementSignupLimitedUrl ?? '',
	completionsAdvancedSetting: product.defaultChatAgent?.completionsAdvancedSetting ?? '',
	chatQuotaExceededContext: product.defaultChatAgent?.chatQuotaExceededContext ?? '',
	completionsQuotaExceededContext: product.defaultChatAgent?.completionsQuotaExceededContext ?? ''
};

interface IChatQuotasAccessor {
	clearQuotas(): void;
	acceptQuotas(quotas: IQuotas): void;
}

const CHAT_ALLOW_ANONYMOUS_CONFIGURATION_KEY = 'chat.allowAnonymousAccess';

function isAnonymous(configurationService: IConfigurationService, entitlement: ChatEntitlement, sentiment: IChatSentiment): boolean {
	if (configurationService.getValue(CHAT_ALLOW_ANONYMOUS_CONFIGURATION_KEY) !== true) {
		return false; // only enabled behind an experimental setting
	}

	if (entitlement !== ChatEntitlement.Unknown) {
		return false; // only consider signed out users
	}

	if (sentiment.hidden || sentiment.disabled) {
		return false; // only consider enabled scenarios
	}

	return true;
}

type ChatEntitlementClassification = {
	owner: 'bpasero';
	comment: 'Provides insight into chat entitlements.';
	chatHidden: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether chat is hidden or not.' };
	chatEntitlement: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The current chat entitlement of the user.' };
	chatAnonymous: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the user is anonymously using chat.' };
	chatRegistered: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the user is registered for chat.' };
	chatDisabled: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether chat is disabled or not.' };
};
type ChatEntitlementEvent = {
	chatHidden: boolean;
	chatEntitlement: ChatEntitlement;
	chatAnonymous: boolean;
	chatRegistered: boolean;
	chatDisabled: boolean;
};

function logChatEntitlements(state: IChatEntitlementContextState, configurationService: IConfigurationService, telemetryService: ITelemetryService): void {
	telemetryService.publicLog2<ChatEntitlementEvent, ChatEntitlementClassification>('chatEntitlements', {
		chatHidden: Boolean(state.hidden),
		chatDisabled: Boolean(state.disabled),
		chatEntitlement: state.entitlement,
		chatRegistered: Boolean(state.registered),
		chatAnonymous: isAnonymous(configurationService, state.entitlement, state)
	});
}

export class ChatEntitlementService extends Disposable implements IChatEntitlementService {

	declare _serviceBrand: undefined;

	readonly context: Lazy<ChatEntitlementContext> | undefined;
	readonly requests: Lazy<ChatEntitlementRequests> | undefined;

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
		@IProductService productService: IProductService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
	) {
		super();

		this.chatQuotaExceededContextKey = ChatEntitlementContextKeys.chatQuotaExceeded.bindTo(this.contextKeyService);
		this.completionsQuotaExceededContextKey = ChatEntitlementContextKeys.completionsQuotaExceeded.bindTo(this.contextKeyService);

		this.anonymousContextKey = ChatEntitlementContextKeys.chatAnonymous.bindTo(this.contextKeyService);
		this.anonymousContextKey.set(this.anonymous);

		this.onDidChangeEntitlement = Event.map(
			Event.filter(
				this.contextKeyService.onDidChangeContext, e => e.affectsSome(new Set([
					ChatEntitlementContextKeys.Entitlement.planPro.key,
					ChatEntitlementContextKeys.Entitlement.planBusiness.key,
					ChatEntitlementContextKeys.Entitlement.planEnterprise.key,
					ChatEntitlementContextKeys.Entitlement.planProPlus.key,
					ChatEntitlementContextKeys.Entitlement.planFree.key,
					ChatEntitlementContextKeys.Entitlement.canSignUp.key,
					ChatEntitlementContextKeys.Entitlement.signedOut.key,
					ChatEntitlementContextKeys.Entitlement.organisations.key,
					ChatEntitlementContextKeys.Entitlement.internal.key,
					ChatEntitlementContextKeys.Entitlement.sku.key
				])), this._store
			), () => { }, this._store
		);
		this.entitlementObs = observableFromEvent(this.onDidChangeEntitlement, () => this.entitlement);

		this.onDidChangeSentiment = Event.map(
			Event.filter(
				this.contextKeyService.onDidChangeContext, e => e.affectsSome(new Set([
					ChatEntitlementContextKeys.Setup.hidden.key,
					ChatEntitlementContextKeys.Setup.disabled.key,
					ChatEntitlementContextKeys.Setup.untrusted.key,
					ChatEntitlementContextKeys.Setup.installed.key,
					ChatEntitlementContextKeys.Setup.later.key,
					ChatEntitlementContextKeys.Setup.registered.key
				])), this._store
			), () => { }, this._store
		);
		this.sentimentObs = observableFromEvent(this.onDidChangeSentiment, () => this.sentiment);

		if ((isWeb && !environmentService.remoteAuthority)) {
			ChatEntitlementContextKeys.Setup.hidden.bindTo(this.contextKeyService).set(true); // hide copilot UI on web if unsupported
			return;
		}

		if (!productService.defaultChatAgent) {
			return; // we need a default chat agent configured going forward from here
		}

		const context = this.context = new Lazy(() => this._register(instantiationService.createInstance(ChatEntitlementContext)));
		this.requests = new Lazy(() => this._register(instantiationService.createInstance(ChatEntitlementRequests, context.value, {
			clearQuotas: () => this.clearQuotas(),
			acceptQuotas: quotas => this.acceptQuotas(quotas)
		})));

		this.registerListeners();
	}

	//#region --- Entitlements

	readonly onDidChangeEntitlement: Event<void>;
	readonly entitlementObs: IObservable<ChatEntitlement>;

	get entitlement(): ChatEntitlement {
		if (this.contextKeyService.getContextKeyValue<boolean>(ChatEntitlementContextKeys.Entitlement.planPro.key) === true) {
			return ChatEntitlement.Pro;
		} else if (this.contextKeyService.getContextKeyValue<boolean>(ChatEntitlementContextKeys.Entitlement.planBusiness.key) === true) {
			return ChatEntitlement.Business;
		} else if (this.contextKeyService.getContextKeyValue<boolean>(ChatEntitlementContextKeys.Entitlement.planEnterprise.key) === true) {
			return ChatEntitlement.Enterprise;
		} else if (this.contextKeyService.getContextKeyValue<boolean>(ChatEntitlementContextKeys.Entitlement.planProPlus.key) === true) {
			return ChatEntitlement.ProPlus;
		} else if (this.contextKeyService.getContextKeyValue<boolean>(ChatEntitlementContextKeys.Entitlement.planFree.key) === true) {
			return ChatEntitlement.Free;
		} else if (this.contextKeyService.getContextKeyValue<boolean>(ChatEntitlementContextKeys.Entitlement.canSignUp.key) === true) {
			return ChatEntitlement.Available;
		} else if (this.contextKeyService.getContextKeyValue<boolean>(ChatEntitlementContextKeys.Entitlement.signedOut.key) === true) {
			return ChatEntitlement.Unknown;
		}

		return ChatEntitlement.Unresolved;
	}

	get isInternal(): boolean {
		return this.contextKeyService.getContextKeyValue<boolean>(ChatEntitlementContextKeys.Entitlement.internal.key) === true;
	}

	get organisations(): string[] | undefined {
		return this.contextKeyService.getContextKeyValue<string[]>(ChatEntitlementContextKeys.Entitlement.organisations.key);
	}

	get sku(): string | undefined {
		return this.contextKeyService.getContextKeyValue<string>(ChatEntitlementContextKeys.Entitlement.sku.key);
	}

	//#endregion

	//#region --- Quotas

	private readonly _onDidChangeQuotaExceeded = this._register(new Emitter<void>());
	readonly onDidChangeQuotaExceeded = this._onDidChangeQuotaExceeded.event;

	private readonly _onDidChangeQuotaRemaining = this._register(new Emitter<void>());
	readonly onDidChangeQuotaRemaining = this._onDidChangeQuotaRemaining.event;

	private _quotas: IQuotas = {};
	get quotas() { return this._quotas; }

	private readonly chatQuotaExceededContextKey: IContextKey<boolean>;
	private readonly completionsQuotaExceededContextKey: IContextKey<boolean>;

	private ExtensionQuotaContextKeys = {
		chatQuotaExceeded: defaultChat.chatQuotaExceededContext,
		completionsQuotaExceeded: defaultChat.completionsQuotaExceededContext,
	};

	private registerListeners(): void {
		const quotaExceededSet = new Set([this.ExtensionQuotaContextKeys.chatQuotaExceeded, this.ExtensionQuotaContextKeys.completionsQuotaExceeded]);

		const cts = this._register(new MutableDisposable<CancellationTokenSource>());
		this._register(this.contextKeyService.onDidChangeContext(e => {
			if (e.affectsSome(quotaExceededSet)) {
				if (cts.value) {
					cts.value.cancel();
				}
				cts.value = new CancellationTokenSource();
				this.update(cts.value.token);
			}
		}));

		let anonymousUsage = this.anonymous;

		const updateAnonymousUsage = () => {
			const newAnonymousUsage = this.anonymous;
			if (newAnonymousUsage !== anonymousUsage) {
				anonymousUsage = newAnonymousUsage;
				this.anonymousContextKey.set(newAnonymousUsage);

				if (this.context?.hasValue) {
					logChatEntitlements(this.context.value.state, this.configurationService, this.telemetryService);
				}

				this._onDidChangeAnonymous.fire();
			}
		};

		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(CHAT_ALLOW_ANONYMOUS_CONFIGURATION_KEY)) {
				updateAnonymousUsage();
			}
		}));

		this._register(this.onDidChangeEntitlement(() => updateAnonymousUsage()));
		this._register(this.onDidChangeSentiment(() => updateAnonymousUsage()));

		// TODO@bpasero workaround for https://github.com/microsoft/vscode-internalbacklog/issues/6275
		this.lifecycleService.when(LifecyclePhase.Eventually).then(() => {
			if (this.context?.hasValue) {
				logChatEntitlements(this.context.value.state, this.configurationService, this.telemetryService);
			}
		});
	}

	acceptQuotas(quotas: IQuotas): void {
		const oldQuota = this._quotas;
		this._quotas = quotas;
		this.updateContextKeys();

		const { changed: chatChanged } = this.compareQuotas(oldQuota.chat, quotas.chat);
		const { changed: completionsChanged } = this.compareQuotas(oldQuota.completions, quotas.completions);
		const { changed: premiumChatChanged } = this.compareQuotas(oldQuota.premiumChat, quotas.premiumChat);

		if (chatChanged.exceeded || completionsChanged.exceeded || premiumChatChanged.exceeded) {
			this._onDidChangeQuotaExceeded.fire();
		}

		if (chatChanged.remaining || completionsChanged.remaining || premiumChatChanged.remaining) {
			this._onDidChangeQuotaRemaining.fire();
		}
	}

	private compareQuotas(oldQuota: IQuotaSnapshot | undefined, newQuota: IQuotaSnapshot | undefined): { changed: { exceeded: boolean; remaining: boolean } } {
		return {
			changed: {
				exceeded: (oldQuota?.percentRemaining === 0) !== (newQuota?.percentRemaining === 0),
				remaining: oldQuota?.percentRemaining !== newQuota?.percentRemaining
			}
		};
	}

	clearQuotas(): void {
		this.acceptQuotas({});
	}

	private updateContextKeys(): void {
		this.chatQuotaExceededContextKey.set(this._quotas.chat?.percentRemaining === 0);
		this.completionsQuotaExceededContextKey.set(this._quotas.completions?.percentRemaining === 0);
	}

	//#endregion

	//#region --- Sentiment

	readonly onDidChangeSentiment: Event<void>;
	readonly sentimentObs: IObservable<IChatSentiment>;

	get sentiment(): IChatSentiment {
		return {
			installed: this.contextKeyService.getContextKeyValue<boolean>(ChatEntitlementContextKeys.Setup.installed.key) === true,
			hidden: this.contextKeyService.getContextKeyValue<boolean>(ChatEntitlementContextKeys.Setup.hidden.key) === true,
			disabled: this.contextKeyService.getContextKeyValue<boolean>(ChatEntitlementContextKeys.Setup.disabled.key) === true,
			untrusted: this.contextKeyService.getContextKeyValue<boolean>(ChatEntitlementContextKeys.Setup.untrusted.key) === true,
			later: this.contextKeyService.getContextKeyValue<boolean>(ChatEntitlementContextKeys.Setup.later.key) === true,
			registered: this.contextKeyService.getContextKeyValue<boolean>(ChatEntitlementContextKeys.Setup.registered.key) === true
		};
	}

	//#endregion

	//region --- Anonymous

	private readonly anonymousContextKey: IContextKey<boolean>;

	private readonly _onDidChangeAnonymous = this._register(new Emitter<void>());
	readonly onDidChangeAnonymous = this._onDidChangeAnonymous.event;

	readonly anonymousObs = observableFromEvent(this.onDidChangeAnonymous, () => this.anonymous);

	get anonymous(): boolean {
		return isAnonymous(this.configurationService, this.entitlement, this.sentiment);
	}

	//#endregion

	async update(token: CancellationToken): Promise<void> {
		await this.requests?.value.forceResolveEntitlement(undefined, token);
	}
}

//#endregion

//#region Chat Entitlement Request Service

type EntitlementClassification = {
	tid: { classification: 'EndUserPseudonymizedInformation'; purpose: 'BusinessInsight'; comment: 'The anonymized analytics id returned by the service'; endpoint: 'GoogleAnalyticsId' };
	entitlement: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Flag indicating the chat entitlement state' };
	sku: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The SKU of the chat entitlement' };
	quotaChat: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The number of chat requests available to the user' };
	quotaPremiumChat: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The number of premium chat requests available to the user' };
	quotaCompletions: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The number of inline suggestions available to the user' };
	quotaResetDate: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The date the quota will reset' };
	owner: 'bpasero';
	comment: 'Reporting chat entitlements';
};

type EntitlementEvent = {
	entitlement: ChatEntitlement;
	tid: string;
	sku: string | undefined;
	quotaChat: number | undefined;
	quotaPremiumChat: number | undefined;
	quotaCompletions: number | undefined;
	quotaResetDate: string | undefined;
};

interface IQuotaSnapshotResponse {
	readonly entitlement: number;
	readonly overage_count: number;
	readonly overage_permitted: boolean;
	readonly percent_remaining: number;
	readonly remaining: number;
	readonly unlimited: boolean;
}

interface ILegacyQuotaSnapshotResponse {
	readonly limited_user_quotas?: {
		readonly chat: number;
		readonly completions: number;
	};
	readonly monthly_quotas?: {
		readonly chat: number;
		readonly completions: number;
	};
}

interface IEntitlementsResponse extends ILegacyQuotaSnapshotResponse {
	readonly access_type_sku: string;
	readonly assigned_date: string;
	readonly can_signup_for_limited: boolean;
	readonly chat_enabled: boolean;
	readonly copilot_plan: string;
	readonly organization_login_list: string[];
	readonly analytics_tracking_id: string;
	readonly limited_user_reset_date?: string; 	// for Copilot Free
	readonly quota_reset_date?: string; 		// for all other Copilot SKUs
	readonly quota_reset_date_utc?: string; 	// for all other Copilot SKUs (includes time)
	readonly quota_snapshots?: {
		chat?: IQuotaSnapshotResponse;
		completions?: IQuotaSnapshotResponse;
		premium_interactions?: IQuotaSnapshotResponse;
	};
}

interface IEntitlements {
	readonly entitlement: ChatEntitlement;
	readonly organisations?: string[];
	readonly sku?: string;
	readonly quotas?: IQuotas;
}

export interface IQuotaSnapshot {
	readonly total: number;

	readonly remaining: number;
	readonly percentRemaining: number;

	readonly overageEnabled: boolean;
	readonly overageCount: number;

	readonly unlimited: boolean;
}

interface IQuotas {
	readonly resetDate?: string;
	readonly resetDateHasTime?: boolean;

	readonly chat?: IQuotaSnapshot;
	readonly completions?: IQuotaSnapshot;
	readonly premiumChat?: IQuotaSnapshot;
}

export class ChatEntitlementRequests extends Disposable {

	static providerId(configurationService: IConfigurationService): string {
		if (configurationService.getValue<string | undefined>(`${defaultChat.completionsAdvancedSetting}.authProvider`) === defaultChat.provider.enterprise.id) {
			return defaultChat.provider.enterprise.id;
		}

		return defaultChat.provider.default.id;
	}

	private state: IEntitlements;

	private pendingResolveCts = new CancellationTokenSource();
	private didResolveEntitlements = false;

	constructor(
		private readonly context: ChatEntitlementContext,
		private readonly chatQuotasAccessor: IChatQuotasAccessor,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IAuthenticationService private readonly authenticationService: IAuthenticationService,
		@ILogService private readonly logService: ILogService,
		@IRequestService private readonly requestService: IRequestService,
		@IDialogService private readonly dialogService: IDialogService,
		@IOpenerService private readonly openerService: IOpenerService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IAuthenticationExtensionsService private readonly authenticationExtensionsService: IAuthenticationExtensionsService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
	) {
		super();

		this.state = { entitlement: this.context.state.entitlement };

		this.registerListeners();

		this.resolve();
	}

	private registerListeners(): void {
		this._register(this.authenticationService.onDidChangeDeclaredProviders(() => this.resolve()));

		this._register(this.authenticationService.onDidChangeSessions(e => {
			if (e.providerId === ChatEntitlementRequests.providerId(this.configurationService)) {
				this.resolve();
			}
		}));

		this._register(this.authenticationService.onDidRegisterAuthenticationProvider(e => {
			if (e.id === ChatEntitlementRequests.providerId(this.configurationService)) {
				this.resolve();
			}
		}));

		this._register(this.authenticationService.onDidUnregisterAuthenticationProvider(e => {
			if (e.id === ChatEntitlementRequests.providerId(this.configurationService)) {
				this.resolve();
			}
		}));

		this._register(this.context.onDidChange(() => {
			if (!this.context.state.installed || this.context.state.disabled || this.context.state.entitlement === ChatEntitlement.Unknown) {
				// When the extension is not installed, disabled or the user is not entitled
				// make sure to clear quotas so that any indicators are also gone
				this.state = { entitlement: this.state.entitlement, quotas: undefined };
				this.chatQuotasAccessor.clearQuotas();
			}
		}));
	}

	private async resolve(): Promise<void> {
		this.pendingResolveCts.dispose(true);
		const cts = this.pendingResolveCts = new CancellationTokenSource();

		const session = await this.findMatchingProviderSession(cts.token);
		if (cts.token.isCancellationRequested) {
			return;
		}

		// Immediately signal whether we have a session or not
		let state: IEntitlements | undefined = undefined;
		if (session) {
			// Do not overwrite any state we have already
			if (this.state.entitlement === ChatEntitlement.Unknown) {
				state = { entitlement: ChatEntitlement.Unresolved };
			}
		} else {
			this.didResolveEntitlements = false; // reset so that we resolve entitlements fresh when signed in again
			state = { entitlement: ChatEntitlement.Unknown };
		}
		if (state) {
			this.update(state);
		}

		if (session && !this.didResolveEntitlements) {
			// Afterwards resolve entitlement with a network request
			// but only unless it was not already resolved before.
			await this.resolveEntitlement(session, cts.token);
		}
	}

	private async findMatchingProviderSession(token: CancellationToken): Promise<AuthenticationSession[] | undefined> {
		const sessions = await this.doGetSessions(ChatEntitlementRequests.providerId(this.configurationService));
		if (token.isCancellationRequested) {
			return undefined;
		}

		const matchingSessions = new Set<AuthenticationSession>();
		for (const session of sessions) {
			for (const scopes of defaultChat.providerScopes) {
				if (this.includesScopes(session.scopes, scopes)) {
					matchingSessions.add(session);
				}
			}
		}

		// We intentionally want to return an array of matching sessions and
		// not just the first, because it is possible that a matching session
		// has an expired token. As such, we want to try them all until we
		// succeeded with the request.
		return matchingSessions.size > 0 ? Array.from(matchingSessions) : undefined;
	}

	private async doGetSessions(providerId: string): Promise<readonly AuthenticationSession[]> {
		const preferredAccountName = this.authenticationExtensionsService.getAccountPreference(defaultChat.chatExtensionId, providerId) ?? this.authenticationExtensionsService.getAccountPreference(defaultChat.extensionId, providerId);
		let preferredAccount: AuthenticationSessionAccount | undefined;
		for (const account of await this.authenticationService.getAccounts(providerId)) {
			if (account.label === preferredAccountName) {
				preferredAccount = account;
				break;
			}
		}

		try {
			return await this.authenticationService.getSessions(providerId, undefined, { account: preferredAccount });
		} catch (error) {
			// ignore - errors can throw if a provider is not registered
		}

		return [];
	}

	private includesScopes(scopes: ReadonlyArray<string>, expectedScopes: string[]): boolean {
		return expectedScopes.every(scope => scopes.includes(scope));
	}

	private async resolveEntitlement(sessions: AuthenticationSession[], token: CancellationToken): Promise<IEntitlements | undefined> {
		const entitlements = await this.doResolveEntitlement(sessions, token);
		if (typeof entitlements?.entitlement === 'number' && !token.isCancellationRequested) {
			this.didResolveEntitlements = true;
			this.update(entitlements);
		}

		return entitlements;
	}

	private async doResolveEntitlement(sessions: AuthenticationSession[], token: CancellationToken): Promise<IEntitlements | undefined> {
		if (token.isCancellationRequested) {
			return undefined;
		}

		const response = await this.request(this.getEntitlementUrl(), 'GET', undefined, sessions, token);
		if (token.isCancellationRequested) {
			return undefined;
		}

		if (!response) {
			this.logService.trace('[chat entitlement]: no response');
			return { entitlement: ChatEntitlement.Unresolved };
		}

		if (response.res.statusCode && response.res.statusCode !== 200) {
			this.logService.trace(`[chat entitlement]: unexpected status code ${response.res.statusCode}`);
			return (
				response.res.statusCode === 401 || 	// oauth token being unavailable (expired/revoked)
				response.res.statusCode === 404		// missing scopes/permissions, service pretends the endpoint doesn't exist
			) ? { entitlement: ChatEntitlement.Unknown /* treat as signed out */ } : { entitlement: ChatEntitlement.Unresolved };
		}

		let responseText: string | null = null;
		try {
			responseText = await asText(response);
		} catch (error) {
			// ignore - handled below
		}
		if (token.isCancellationRequested) {
			return undefined;
		}

		if (!responseText) {
			this.logService.trace('[chat entitlement]: response has no content');
			return { entitlement: ChatEntitlement.Unresolved };
		}

		let entitlementsResponse: IEntitlementsResponse;
		try {
			entitlementsResponse = JSON.parse(responseText);
			this.logService.trace(`[chat entitlement]: parsed result is ${JSON.stringify(entitlementsResponse)}`);
		} catch (err) {
			this.logService.trace(`[chat entitlement]: error parsing response (${err})`);
			return { entitlement: ChatEntitlement.Unresolved };
		}

		let entitlement: ChatEntitlement;
		if (entitlementsResponse.access_type_sku === 'free_limited_copilot') {
			entitlement = ChatEntitlement.Free;
		} else if (entitlementsResponse.can_signup_for_limited) {
			entitlement = ChatEntitlement.Available;
		} else if (entitlementsResponse.copilot_plan === 'individual') {
			entitlement = ChatEntitlement.Pro;
		} else if (entitlementsResponse.copilot_plan === 'individual_pro') {
			entitlement = ChatEntitlement.ProPlus;
		} else if (entitlementsResponse.copilot_plan === 'business') {
			entitlement = ChatEntitlement.Business;
		} else if (entitlementsResponse.copilot_plan === 'enterprise') {
			entitlement = ChatEntitlement.Enterprise;
		} else if (entitlementsResponse.chat_enabled) {
			// This should never happen as we exhaustively list the plans above. But if a new plan is added in the future older clients won't break
			entitlement = ChatEntitlement.Pro;
		} else {
			entitlement = ChatEntitlement.Unavailable;
		}

		const entitlements: IEntitlements = {
			entitlement,
			organisations: entitlementsResponse.organization_login_list,
			quotas: this.toQuotas(entitlementsResponse),
			sku: entitlementsResponse.access_type_sku
		};

		this.logService.trace(`[chat entitlement]: resolved to ${entitlements.entitlement}, quotas: ${JSON.stringify(entitlements.quotas)}`);
		this.telemetryService.publicLog2<EntitlementEvent, EntitlementClassification>('chatInstallEntitlement', {
			entitlement: entitlements.entitlement,
			tid: entitlementsResponse.analytics_tracking_id,
			sku: entitlements.sku,
			quotaChat: entitlements.quotas?.chat?.remaining,
			quotaPremiumChat: entitlements.quotas?.premiumChat?.remaining,
			quotaCompletions: entitlements.quotas?.completions?.remaining,
			quotaResetDate: entitlements.quotas?.resetDate
		});

		return entitlements;
	}

	private getEntitlementUrl(): string {
		if (ChatEntitlementRequests.providerId(this.configurationService) === defaultChat.provider.enterprise.id) {
			try {
				const enterpriseUrl = new URL(this.configurationService.getValue(defaultChat.providerUriSetting));
				return `${enterpriseUrl.protocol}//api.${enterpriseUrl.hostname}${enterpriseUrl.port ? ':' + enterpriseUrl.port : ''}/copilot_internal/user`;
			} catch (error) {
				this.logService.error(error);
			}
		}

		return defaultChat.entitlementUrl;
	}

	private toQuotas(response: IEntitlementsResponse): IQuotas {
		const quotas: Mutable<IQuotas> = {
			resetDate: response.quota_reset_date_utc ?? response.quota_reset_date ?? response.limited_user_reset_date,
			resetDateHasTime: typeof response.quota_reset_date_utc === 'string',
		};

		// Legacy Free SKU Quota
		if (response.monthly_quotas?.chat && typeof response.limited_user_quotas?.chat === 'number') {
			quotas.chat = {
				total: response.monthly_quotas.chat,
				remaining: response.limited_user_quotas.chat,
				percentRemaining: Math.min(100, Math.max(0, (response.limited_user_quotas.chat / response.monthly_quotas.chat) * 100)),
				overageEnabled: false,
				overageCount: 0,
				unlimited: false
			};
		}

		if (response.monthly_quotas?.completions && typeof response.limited_user_quotas?.completions === 'number') {
			quotas.completions = {
				total: response.monthly_quotas.completions,
				remaining: response.limited_user_quotas.completions,
				percentRemaining: Math.min(100, Math.max(0, (response.limited_user_quotas.completions / response.monthly_quotas.completions) * 100)),
				overageEnabled: false,
				overageCount: 0,
				unlimited: false
			};
		}

		// New Quota Snapshot
		if (response.quota_snapshots) {
			for (const quotaType of ['chat', 'completions', 'premium_interactions'] as const) {
				const rawQuotaSnapshot = response.quota_snapshots[quotaType];
				if (!rawQuotaSnapshot) {
					continue;
				}
				const quotaSnapshot: IQuotaSnapshot = {
					total: rawQuotaSnapshot.entitlement,
					remaining: rawQuotaSnapshot.remaining,
					percentRemaining: Math.min(100, Math.max(0, rawQuotaSnapshot.percent_remaining)),
					overageEnabled: rawQuotaSnapshot.overage_permitted,
					overageCount: rawQuotaSnapshot.overage_count,
					unlimited: rawQuotaSnapshot.unlimited
				};

				switch (quotaType) {
					case 'chat':
						quotas.chat = quotaSnapshot;
						break;
					case 'completions':
						quotas.completions = quotaSnapshot;
						break;
					case 'premium_interactions':
						quotas.premiumChat = quotaSnapshot;
						break;
				}
			}
		}

		return quotas;
	}

	private async request(url: string, type: 'GET', body: undefined, sessions: AuthenticationSession[], token: CancellationToken): Promise<IRequestContext | undefined>;
	private async request(url: string, type: 'POST', body: object, sessions: AuthenticationSession[], token: CancellationToken): Promise<IRequestContext | undefined>;
	private async request(url: string, type: 'GET' | 'POST', body: object | undefined, sessions: AuthenticationSession[], token: CancellationToken): Promise<IRequestContext | undefined> {
		let lastRequest: IRequestContext | undefined;

		for (const session of sessions) {
			if (token.isCancellationRequested) {
				return lastRequest;
			}

			try {
				const response = await this.requestService.request({
					type,
					url,
					data: type === 'POST' ? JSON.stringify(body) : undefined,
					disableCache: true,
					headers: {
						'Authorization': `Bearer ${session.accessToken}`
					}
				}, token);

				const status = response.res.statusCode;
				if (status && status !== 200) {
					lastRequest = response;
					continue; // try next session
				}

				return response;
			} catch (error) {
				if (!token.isCancellationRequested) {
					this.logService.error(`[chat entitlement] request: error ${error}`);
				}
			}
		}

		return lastRequest;
	}

	private update(state: IEntitlements): void {
		this.state = state;

		this.context.update({ entitlement: this.state.entitlement, organisations: this.state.organisations, sku: this.state.sku });

		if (state.quotas) {
			this.chatQuotasAccessor.acceptQuotas(state.quotas);
		}
	}

	async forceResolveEntitlement(sessions: AuthenticationSession[] | undefined, token = CancellationToken.None): Promise<IEntitlements | undefined> {
		if (!sessions) {
			sessions = await this.findMatchingProviderSession(token);
		}

		if (!sessions || sessions.length === 0) {
			return undefined;
		}

		return this.resolveEntitlement(sessions, token);
	}

	async signUpFree(sessions: AuthenticationSession[]): Promise<true /* signed up */ | false /* already signed up */ | { errorCode: number } /* error */> {
		const body = {
			restricted_telemetry: this.telemetryService.telemetryLevel === TelemetryLevel.NONE ? 'disabled' : 'enabled',
			public_code_suggestions: 'enabled'
		};

		const response = await this.request(defaultChat.entitlementSignupLimitedUrl, 'POST', body, sessions, CancellationToken.None);
		if (!response) {
			const retry = await this.onUnknownSignUpError(localize('signUpNoResponseError', "No response received."), '[chat entitlement] sign-up: no response');
			return retry ? this.signUpFree(sessions) : { errorCode: 1 };
		}

		if (response.res.statusCode && response.res.statusCode !== 200) {
			if (response.res.statusCode === 422) {
				try {
					const responseText = await asText(response);
					if (responseText) {
						const responseError: { message: string } = JSON.parse(responseText);
						if (typeof responseError.message === 'string' && responseError.message) {
							this.onUnprocessableSignUpError(`[chat entitlement] sign-up: unprocessable entity (${responseError.message})`, responseError.message);
							return { errorCode: response.res.statusCode };
						}
					}
				} catch (error) {
					// ignore - handled below
				}
			}
			const retry = await this.onUnknownSignUpError(localize('signUpUnexpectedStatusError', "Unexpected status code {0}.", response.res.statusCode), `[chat entitlement] sign-up: unexpected status code ${response.res.statusCode}`);
			return retry ? this.signUpFree(sessions) : { errorCode: response.res.statusCode };
		}

		let responseText: string | null = null;
		try {
			responseText = await asText(response);
		} catch (error) {
			// ignore - handled below
		}

		if (!responseText) {
			const retry = await this.onUnknownSignUpError(localize('signUpNoResponseContentsError', "Response has no contents."), '[chat entitlement] sign-up: response has no content');
			return retry ? this.signUpFree(sessions) : { errorCode: 2 };
		}

		let parsedResult: { subscribed: boolean } | undefined = undefined;
		try {
			parsedResult = JSON.parse(responseText);
			this.logService.trace(`[chat entitlement] sign-up: response is ${responseText}`);
		} catch (err) {
			const retry = await this.onUnknownSignUpError(localize('signUpInvalidResponseError', "Invalid response contents."), `[chat entitlement] sign-up: error parsing response (${err})`);
			return retry ? this.signUpFree(sessions) : { errorCode: 3 };
		}

		// We have made it this far, so the user either did sign-up or was signed-up already.
		// That is, because the endpoint throws in all other case according to Patrick.
		this.update({ entitlement: ChatEntitlement.Free });

		return Boolean(parsedResult?.subscribed);
	}

	private async onUnknownSignUpError(detail: string, logMessage: string): Promise<boolean> {
		this.logService.error(logMessage);

		if (!this.lifecycleService.willShutdown) {
			const { confirmed } = await this.dialogService.confirm({
				type: Severity.Error,
				message: localize('unknownSignUpError', "An error occurred while signing up for the GitHub Copilot Free plan. Would you like to try again?"),
				detail,
				primaryButton: localize('retry', "Retry")
			});

			return confirmed;
		}

		return false;
	}

	private onUnprocessableSignUpError(logMessage: string, logDetails: string): void {
		this.logService.error(logMessage);

		if (!this.lifecycleService.willShutdown) {
			this.dialogService.prompt({
				type: Severity.Error,
				message: localize('unprocessableSignUpError', "An error occurred while signing up for the GitHub Copilot Free plan."),
				detail: logDetails,
				buttons: [
					{
						label: localize('ok', "OK"),
						run: () => { /* noop */ }
					},
					{
						label: localize('learnMore', "Learn More"),
						run: () => this.openerService.open(URI.parse(defaultChat.upgradePlanUrl))
					}
				]
			});
		}
	}

	async signIn(options?: { useSocialProvider?: string; additionalScopes?: readonly string[] }) {
		const providerId = ChatEntitlementRequests.providerId(this.configurationService);

		const scopes = options?.additionalScopes ? distinct([...defaultChat.providerScopes[0], ...options.additionalScopes]) : defaultChat.providerScopes[0];
		const session = await this.authenticationService.createSession(
			providerId,
			scopes,
			{
				extraAuthorizeParameters: { get_started_with: 'copilot-vscode' },
				provider: options?.useSocialProvider
			});

		this.authenticationExtensionsService.updateAccountPreference(defaultChat.extensionId, providerId, session.account);
		this.authenticationExtensionsService.updateAccountPreference(defaultChat.chatExtensionId, providerId, session.account);

		const entitlements = await this.forceResolveEntitlement([session]);

		return { session, entitlements };
	}

	override dispose(): void {
		this.pendingResolveCts.dispose(true);

		super.dispose();
	}
}

//#endregion

//#region Context

export interface IChatEntitlementContextState extends IChatSentiment {

	/**
	 * Users last known or resolved entitlement.
	 */
	entitlement: ChatEntitlement;

	/**
	 * User's last known or resolved raw SKU type.
	 */
	sku: string | undefined;

	/**
	 * User's last known or resolved organisations.
	 */
	organisations: string[] | undefined;

	/**
	 * User is or was a registered Chat user.
	 */
	registered?: boolean;
}

export class ChatEntitlementContext extends Disposable {

	private static readonly CHAT_ENTITLEMENT_CONTEXT_STORAGE_KEY = 'chat.setupContext';

	private static readonly CHAT_DISABLED_CONFIGURATION_KEY = 'chat.disableAIFeatures';

	private readonly canSignUpContextKey: IContextKey<boolean>;
	private readonly signedOutContextKey: IContextKey<boolean>;

	private readonly freeContextKey: IContextKey<boolean>;
	private readonly proContextKey: IContextKey<boolean>;
	private readonly proPlusContextKey: IContextKey<boolean>;
	private readonly businessContextKey: IContextKey<boolean>;
	private readonly enterpriseContextKey: IContextKey<boolean>;

	private readonly organisationsContextKey: IContextKey<string[] | undefined>;
	private readonly isInternalContextKey: IContextKey<boolean>;
	private readonly skuContextKey: IContextKey<string | undefined>;

	private readonly hiddenContext: IContextKey<boolean>;
	private readonly laterContext: IContextKey<boolean>;
	private readonly installedContext: IContextKey<boolean>;
	private readonly disabledContext: IContextKey<boolean>;
	private readonly untrustedContext: IContextKey<boolean>;
	private readonly registeredContext: IContextKey<boolean>;

	private _state: IChatEntitlementContextState;
	private suspendedState: IChatEntitlementContextState | undefined = undefined;
	get state(): IChatEntitlementContextState { return this.withConfiguration(this.suspendedState ?? this._state); }

	private readonly _onDidChange = this._register(new Emitter<void>());
	readonly onDidChange = this._onDidChange.event;

	private updateBarrier: Barrier | undefined = undefined;

	constructor(
		@IContextKeyService contextKeyService: IContextKeyService,
		@IStorageService private readonly storageService: IStorageService,
		@ILogService private readonly logService: ILogService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ITelemetryService private readonly telemetryService: ITelemetryService
	) {
		super();

		this.canSignUpContextKey = ChatEntitlementContextKeys.Entitlement.canSignUp.bindTo(contextKeyService);
		this.signedOutContextKey = ChatEntitlementContextKeys.Entitlement.signedOut.bindTo(contextKeyService);

		this.freeContextKey = ChatEntitlementContextKeys.Entitlement.planFree.bindTo(contextKeyService);
		this.proContextKey = ChatEntitlementContextKeys.Entitlement.planPro.bindTo(contextKeyService);
		this.proPlusContextKey = ChatEntitlementContextKeys.Entitlement.planProPlus.bindTo(contextKeyService);
		this.businessContextKey = ChatEntitlementContextKeys.Entitlement.planBusiness.bindTo(contextKeyService);
		this.enterpriseContextKey = ChatEntitlementContextKeys.Entitlement.planEnterprise.bindTo(contextKeyService);

		this.organisationsContextKey = ChatEntitlementContextKeys.Entitlement.organisations.bindTo(contextKeyService);
		this.isInternalContextKey = ChatEntitlementContextKeys.Entitlement.internal.bindTo(contextKeyService);
		this.skuContextKey = ChatEntitlementContextKeys.Entitlement.sku.bindTo(contextKeyService);

		this.hiddenContext = ChatEntitlementContextKeys.Setup.hidden.bindTo(contextKeyService);
		this.laterContext = ChatEntitlementContextKeys.Setup.later.bindTo(contextKeyService);
		this.installedContext = ChatEntitlementContextKeys.Setup.installed.bindTo(contextKeyService);
		this.disabledContext = ChatEntitlementContextKeys.Setup.disabled.bindTo(contextKeyService);
		this.untrustedContext = ChatEntitlementContextKeys.Setup.untrusted.bindTo(contextKeyService);
		this.registeredContext = ChatEntitlementContextKeys.Setup.registered.bindTo(contextKeyService);

		this._state = this.storageService.getObject<IChatEntitlementContextState>(ChatEntitlementContext.CHAT_ENTITLEMENT_CONTEXT_STORAGE_KEY, StorageScope.PROFILE) ?? { entitlement: ChatEntitlement.Unknown, organisations: undefined, sku: undefined };

		this.updateContextSync();

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(ChatEntitlementContext.CHAT_DISABLED_CONFIGURATION_KEY)) {
				this.updateContext();
			}
		}));
	}

	private withConfiguration(state: IChatEntitlementContextState): IChatEntitlementContextState {
		if (this.configurationService.getValue(ChatEntitlementContext.CHAT_DISABLED_CONFIGURATION_KEY) === true) {
			return {
				...state,
				hidden: true // Setting always wins: if AI is disabled, set `hidden: true`
			};
		}

		return state;
	}

	update(context: { installed: boolean; disabled: boolean; untrusted: boolean }): Promise<void>;
	update(context: { hidden: false }): Promise<void>; // legacy UI state from before we had a setting to hide, keep around to still support users who used this
	update(context: { later: boolean }): Promise<void>;
	update(context: { entitlement: ChatEntitlement; organisations: string[] | undefined; sku: string | undefined }): Promise<void>;
	async update(context: { installed?: boolean; disabled?: boolean; untrusted?: boolean; hidden?: false; later?: boolean; entitlement?: ChatEntitlement; organisations?: string[]; sku?: string }): Promise<void> {
		this.logService.trace(`[chat entitlement context] update(): ${JSON.stringify(context)}`);

		const oldState = JSON.stringify(this._state);

		if (typeof context.installed === 'boolean' && typeof context.disabled === 'boolean' && typeof context.untrusted === 'boolean') {
			this._state.installed = context.installed;
			this._state.disabled = context.disabled;
			this._state.untrusted = context.untrusted;

			if (context.installed && !context.disabled) {
				context.hidden = false; // treat this as a sign to make Chat visible again in case it is hidden
			}
		}

		if (typeof context.hidden === 'boolean') {
			this._state.hidden = context.hidden;
		}

		if (typeof context.later === 'boolean') {
			this._state.later = context.later;
		}

		if (typeof context.entitlement === 'number') {
			this._state.entitlement = context.entitlement;
			this._state.organisations = context.organisations;
			this._state.sku = context.sku;

			if (this._state.entitlement === ChatEntitlement.Free || isProUser(this._state.entitlement)) {
				this._state.registered = true;
			} else if (this._state.entitlement === ChatEntitlement.Available) {
				this._state.registered = false; // only reset when signed-in user can sign-up for free
			}
		}

		if (isAnonymous(this.configurationService, this._state.entitlement, this._state)) {
			this._state.sku = 'no_auth_limited_copilot'; // no-auth users have a fixed SKU
		}

		if (oldState === JSON.stringify(this._state)) {
			return; // state did not change
		}

		this.storageService.store(ChatEntitlementContext.CHAT_ENTITLEMENT_CONTEXT_STORAGE_KEY, {
			...this._state,
			later: undefined // do not persist this across restarts for now
		}, StorageScope.PROFILE, StorageTarget.MACHINE);

		return this.updateContext();
	}

	private async updateContext(): Promise<void> {
		await this.updateBarrier?.wait();

		this.updateContextSync();
	}

	private updateContextSync(): void {
		const state = this.withConfiguration(this._state);

		this.signedOutContextKey.set(state.entitlement === ChatEntitlement.Unknown);
		this.canSignUpContextKey.set(state.entitlement === ChatEntitlement.Available);

		this.freeContextKey.set(state.entitlement === ChatEntitlement.Free);
		this.proContextKey.set(state.entitlement === ChatEntitlement.Pro);
		this.proPlusContextKey.set(state.entitlement === ChatEntitlement.ProPlus);
		this.businessContextKey.set(state.entitlement === ChatEntitlement.Business);
		this.enterpriseContextKey.set(state.entitlement === ChatEntitlement.Enterprise);

		this.organisationsContextKey.set(state.organisations);
		this.isInternalContextKey.set(Boolean(state.organisations?.some(org => org === 'github' || org === 'microsoft' || org === 'ms-copilot' || org === 'MicrosoftCopilot')));
		this.skuContextKey.set(state.sku);

		this.hiddenContext.set(!!state.hidden);
		this.laterContext.set(!!state.later);
		this.installedContext.set(!!state.installed);
		this.disabledContext.set(!!state.disabled);
		this.untrustedContext.set(!!state.untrusted);
		this.registeredContext.set(!!state.registered);

		this.logService.trace(`[chat entitlement context] updateContext(): ${JSON.stringify(state)}`);
		logChatEntitlements(state, this.configurationService, this.telemetryService);

		this._onDidChange.fire();
	}

	suspend(): void {
		this.suspendedState = { ...this._state };
		this.updateBarrier = new Barrier();
	}

	resume(): void {
		this.suspendedState = undefined;
		this.updateBarrier?.open();
		this.updateBarrier = undefined;
	}
}

//#endregion

registerSingleton(IChatEntitlementService, ChatEntitlementService, InstantiationType.Eager /* To ensure context keys are set asap */);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/checksum/electron-browser/checksumService.ts]---
Location: vscode-main/src/vs/workbench/services/checksum/electron-browser/checksumService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IChecksumService } from '../../../../platform/checksum/common/checksumService.js';
import { registerSharedProcessRemoteService } from '../../../../platform/ipc/electron-browser/services.js';

registerSharedProcessRemoteService(IChecksumService, 'checksum');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/clipboard/browser/clipboardService.ts]---
Location: vscode-main/src/vs/workbench/services/clipboard/browser/clipboardService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { BrowserClipboardService as BaseBrowserClipboardService } from '../../../../platform/clipboard/browser/clipboardService.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { Event } from '../../../../base/common/event.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { ILayoutService } from '../../../../platform/layout/browser/layoutService.js';
import { getActiveWindow } from '../../../../base/browser/dom.js';

export class BrowserClipboardService extends BaseBrowserClipboardService {

	constructor(
		@INotificationService private readonly notificationService: INotificationService,
		@IOpenerService private readonly openerService: IOpenerService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@ILogService logService: ILogService,
		@ILayoutService layoutService: ILayoutService
	) {
		super(layoutService, logService);
	}

	override async writeText(text: string, type?: string): Promise<void> {
		this.logService.trace('BrowserClipboardService#writeText called with type:', type, ' with text.length:', text.length);
		if (!!this.environmentService.extensionTestsLocationURI && typeof type !== 'string') {
			type = 'vscode-tests'; // force in-memory clipboard for tests to avoid permission issues
		}
		this.logService.trace('BrowserClipboardService#super.writeText');
		return super.writeText(text, type);
	}

	override async readText(type?: string): Promise<string> {
		this.logService.trace('BrowserClipboardService#readText called with type:', type);
		if (!!this.environmentService.extensionTestsLocationURI && typeof type !== 'string') {
			type = 'vscode-tests'; // force in-memory clipboard for tests to avoid permission issues
		}

		if (type) {
			this.logService.trace('BrowserClipboardService#super.readText');
			return super.readText(type);
		}

		try {
			const readText = await getActiveWindow().navigator.clipboard.readText();
			this.logService.trace('BrowserClipboardService#readText with readText.length:', readText.length);
			return readText;
		} catch (error) {
			return new Promise<string>(resolve => {

				// Inform user about permissions problem (https://github.com/microsoft/vscode/issues/112089)
				const listener = new DisposableStore();
				const handle = this.notificationService.prompt(
					Severity.Error,
					localize('clipboardError', "Unable to read from the browser's clipboard. Please make sure you have granted access for this website to read from the clipboard."),
					[{
						label: localize('retry', "Retry"),
						run: async () => {
							listener.dispose();
							resolve(await this.readText(type));
						}
					}, {
						label: localize('learnMore', "Learn More"),
						run: () => this.openerService.open('https://go.microsoft.com/fwlink/?linkid=2151362')
					}],
					{
						sticky: true
					}
				);

				// Always resolve the promise once the notification closes
				listener.add(Event.once(handle.onDidClose)(() => resolve('')));
			});
		}
	}
}

registerSingleton(IClipboardService, BrowserClipboardService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/clipboard/electron-browser/clipboardService.ts]---
Location: vscode-main/src/vs/workbench/services/clipboard/electron-browser/clipboardService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { URI } from '../../../../base/common/uri.js';
import { isMacintosh } from '../../../../base/common/platform.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { ILogService } from '../../../../platform/log/common/log.js';

export class NativeClipboardService implements IClipboardService {

	private static readonly FILE_FORMAT = 'code/file-list'; // Clipboard format for files

	declare readonly _serviceBrand: undefined;

	constructor(
		@INativeHostService private readonly nativeHostService: INativeHostService,
		@ILogService private readonly logService: ILogService
	) { }

	async triggerPaste(targetWindowId: number): Promise<void> {
		this.logService.trace('NativeClipboardService#triggerPaste called');
		return this.nativeHostService.triggerPaste({ targetWindowId });
	}

	async readImage(): Promise<Uint8Array> {
		return this.nativeHostService.readImage();
	}

	async writeText(text: string, type?: 'selection' | 'clipboard'): Promise<void> {
		this.logService.trace('NativeClipboardService#writeText called with type:', type, ' with text.length:', text.length);
		return this.nativeHostService.writeClipboardText(text, type);
	}

	async readText(type?: 'selection' | 'clipboard'): Promise<string> {
		this.logService.trace('NativeClipboardService#readText called with type:', type);
		return this.nativeHostService.readClipboardText(type);
	}

	async readFindText(): Promise<string> {
		if (isMacintosh) {
			return this.nativeHostService.readClipboardFindText();
		}

		return '';
	}

	async writeFindText(text: string): Promise<void> {
		if (isMacintosh) {
			return this.nativeHostService.writeClipboardFindText(text);
		}
	}

	async writeResources(resources: URI[]): Promise<void> {
		if (resources.length) {
			return this.nativeHostService.writeClipboardBuffer(NativeClipboardService.FILE_FORMAT, this.resourcesToBuffer(resources));
		}
	}

	async readResources(): Promise<URI[]> {
		return this.bufferToResources(await this.nativeHostService.readClipboardBuffer(NativeClipboardService.FILE_FORMAT));
	}

	async hasResources(): Promise<boolean> {
		return this.nativeHostService.hasClipboard(NativeClipboardService.FILE_FORMAT);
	}

	private resourcesToBuffer(resources: URI[]): VSBuffer {
		return VSBuffer.fromString(resources.map(r => r.toString()).join('\n'));
	}

	private bufferToResources(buffer: VSBuffer): URI[] {
		if (!buffer) {
			return [];
		}

		const bufferValue = buffer.toString();
		if (!bufferValue) {
			return [];
		}

		try {
			return bufferValue.split('\n').map(f => URI.parse(f));
		} catch (error) {
			return []; // do not trust clipboard data
		}
	}
}

registerSingleton(IClipboardService, NativeClipboardService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

````

---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 471
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 471 of 552)

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

---[FILE: src/vs/workbench/contrib/terminalContrib/links/test/browser/terminalUriLinkDetector.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/test/browser/terminalUriLinkDetector.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IFileService } from '../../../../../../platform/files/common/files.js';
import { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { TerminalBuiltinLinkType } from '../../browser/links.js';
import { TerminalLinkResolver } from '../../browser/terminalLinkResolver.js';
import { TerminalUriLinkDetector } from '../../browser/terminalUriLinkDetector.js';
import { assertLinkHelper } from './linkTestUtils.js';
import { createFileStat } from '../../../../../test/common/workbenchTestServices.js';
import { URI } from '../../../../../../base/common/uri.js';
import type { Terminal } from '@xterm/xterm';
import { OperatingSystem } from '../../../../../../base/common/platform.js';
import { importAMDNodeModule } from '../../../../../../amdX.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { NullLogService } from '../../../../../../platform/log/common/log.js';
import { ITerminalLogService } from '../../../../../../platform/terminal/common/terminal.js';

suite('Workbench - TerminalUriLinkDetector', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let configurationService: TestConfigurationService;
	let detector: TerminalUriLinkDetector;
	let xterm: Terminal;
	let validResources: URI[] = [];
	let instantiationService: TestInstantiationService;

	setup(async () => {
		instantiationService = store.add(new TestInstantiationService());
		configurationService = new TestConfigurationService();
		instantiationService.stub(IConfigurationService, configurationService);
		instantiationService.stub(IFileService, {
			async stat(resource) {
				if (!validResources.map(e => e.path).includes(resource.path)) {
					throw new Error('Doesn\'t exist');
				}
				return createFileStat(resource);
			}
		});
		instantiationService.stub(ITerminalLogService, new NullLogService());
		validResources = [];

		const TerminalCtor = (await importAMDNodeModule<typeof import('@xterm/xterm')>('@xterm/xterm', 'lib/xterm.js')).Terminal;
		xterm = new TerminalCtor({ allowProposedApi: true, cols: 80, rows: 30 });
		detector = instantiationService.createInstance(TerminalUriLinkDetector, xterm, {
			initialCwd: '/parent/cwd',
			os: OperatingSystem.Linux,
			remoteAuthority: undefined,
			userHome: '/home',
			backend: undefined
		}, instantiationService.createInstance(TerminalLinkResolver));
	});

	teardown(() => {
		instantiationService.dispose();
	});

	async function assertLink(
		type: TerminalBuiltinLinkType,
		text: string,
		expected: ({ uri: URI; range: [number, number][] })[]
	) {
		await assertLinkHelper(text, expected, detector, type);
	}

	const linkComputerCases: [
		/* Link type      */ TerminalBuiltinLinkType,
		/* Line text      */ string,
		/* Link and range */ { uri: URI; range: [number, number][] }[],
		/* Stat resource  */ URI?
	][] = [
			[TerminalBuiltinLinkType.Url, 'x = "http://foo.bar";', [{ range: [[6, 1], [19, 1]], uri: URI.parse('http://foo.bar') }]],
			[TerminalBuiltinLinkType.Url, 'x = (http://foo.bar);', [{ range: [[6, 1], [19, 1]], uri: URI.parse('http://foo.bar') }]],
			[TerminalBuiltinLinkType.Url, 'x = \'http://foo.bar\';', [{ range: [[6, 1], [19, 1]], uri: URI.parse('http://foo.bar') }]],
			[TerminalBuiltinLinkType.Url, 'x =  http://foo.bar ;', [{ range: [[6, 1], [19, 1]], uri: URI.parse('http://foo.bar') }]],
			[TerminalBuiltinLinkType.Url, 'x = <http://foo.bar>;', [{ range: [[6, 1], [19, 1]], uri: URI.parse('http://foo.bar') }]],
			[TerminalBuiltinLinkType.Url, 'x = {http://foo.bar};', [{ range: [[6, 1], [19, 1]], uri: URI.parse('http://foo.bar') }]],
			[TerminalBuiltinLinkType.Url, '(see http://foo.bar)', [{ range: [[6, 1], [19, 1]], uri: URI.parse('http://foo.bar') }]],
			[TerminalBuiltinLinkType.Url, '[see http://foo.bar]', [{ range: [[6, 1], [19, 1]], uri: URI.parse('http://foo.bar') }]],
			[TerminalBuiltinLinkType.Url, '{see http://foo.bar}', [{ range: [[6, 1], [19, 1]], uri: URI.parse('http://foo.bar') }]],
			[TerminalBuiltinLinkType.Url, '<see http://foo.bar>', [{ range: [[6, 1], [19, 1]], uri: URI.parse('http://foo.bar') }]],
			[TerminalBuiltinLinkType.Url, '<url>http://foo.bar</url>', [{ range: [[6, 1], [19, 1]], uri: URI.parse('http://foo.bar') }]],
			[TerminalBuiltinLinkType.Url, '// Click here to learn more. https://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409', [{ range: [[30, 1], [7, 2]], uri: URI.parse('https://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409') }]],
			[TerminalBuiltinLinkType.Url, '// Click here to learn more. https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx', [{ range: [[30, 1], [28, 2]], uri: URI.parse('https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx') }]],
			[TerminalBuiltinLinkType.Url, '// https://github.com/projectkudu/kudu/blob/master/Kudu.Core/Scripts/selectNodeVersion.js', [{ range: [[4, 1], [9, 2]], uri: URI.parse('https://github.com/projectkudu/kudu/blob/master/Kudu.Core/Scripts/selectNodeVersion.js') }]],
			[TerminalBuiltinLinkType.Url, '<!-- !!! Do not remove !!!   WebContentRef(link:https://go.microsoft.com/fwlink/?LinkId=166007, area:Admin, updated:2015, nextUpdate:2016, tags:SqlServer)   !!! Do not remove !!! -->', [{ range: [[49, 1], [14, 2]], uri: URI.parse('https://go.microsoft.com/fwlink/?LinkId=166007') }]],
			[TerminalBuiltinLinkType.Url, 'For instructions, see https://go.microsoft.com/fwlink/?LinkId=166007.</value>', [{ range: [[23, 1], [68, 1]], uri: URI.parse('https://go.microsoft.com/fwlink/?LinkId=166007') }]],
			[TerminalBuiltinLinkType.Url, 'For instructions, see https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx.</value>', [{ range: [[23, 1], [21, 2]], uri: URI.parse('https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx') }]],
			[TerminalBuiltinLinkType.Url, 'x = "https://en.wikipedia.org/wiki/Zürich";', [{ range: [[6, 1], [41, 1]], uri: URI.parse('https://en.wikipedia.org/wiki/Zürich') }]],
			[TerminalBuiltinLinkType.Url, '請參閱 http://go.microsoft.com/fwlink/?LinkId=761051。', [{ range: [[8, 1], [53, 1]], uri: URI.parse('http://go.microsoft.com/fwlink/?LinkId=761051') }]],
			[TerminalBuiltinLinkType.Url, '（請參閱 http://go.microsoft.com/fwlink/?LinkId=761051）', [{ range: [[10, 1], [55, 1]], uri: URI.parse('http://go.microsoft.com/fwlink/?LinkId=761051') }]],
			[TerminalBuiltinLinkType.LocalFile, 'x = "file:///foo.bar";', [{ range: [[6, 1], [20, 1]], uri: URI.parse('file:///foo.bar') }], URI.parse('file:///foo.bar')],
			[TerminalBuiltinLinkType.LocalFile, 'x = "file://c:/foo.bar";', [{ range: [[6, 1], [22, 1]], uri: URI.parse('file://c:/foo.bar') }], URI.parse('file://c:/foo.bar')],
			[TerminalBuiltinLinkType.LocalFile, 'x = "file://shares/foo.bar";', [{ range: [[6, 1], [26, 1]], uri: URI.parse('file://shares/foo.bar') }], URI.parse('file://shares/foo.bar')],
			[TerminalBuiltinLinkType.LocalFile, 'x = "file://shäres/foo.bar";', [{ range: [[6, 1], [26, 1]], uri: URI.parse('file://shäres/foo.bar') }], URI.parse('file://shäres/foo.bar')],
			[TerminalBuiltinLinkType.Url, 'Some text, then http://www.bing.com.', [{ range: [[17, 1], [35, 1]], uri: URI.parse('http://www.bing.com') }]],
			[TerminalBuiltinLinkType.Url, 'let url = `http://***/_api/web/lists/GetByTitle(\'Teambuildingaanvragen\')/items`;', [{ range: [[12, 1], [78, 1]], uri: URI.parse('http://***/_api/web/lists/GetByTitle(\'Teambuildingaanvragen\')/items') }]],
			[TerminalBuiltinLinkType.Url, '7. At this point, ServiceMain has been called.  There is no functionality presently in ServiceMain, but you can consult the [MSDN documentation](https://msdn.microsoft.com/en-us/library/windows/desktop/ms687414(v=vs.85).aspx) to add functionality as desired!', [{ range: [[66, 2], [64, 3]], uri: URI.parse('https://msdn.microsoft.com/en-us/library/windows/desktop/ms687414(v=vs.85).aspx') }]],
			[TerminalBuiltinLinkType.Url, 'let x = "http://[::1]:5000/connect/token"', [{ range: [[10, 1], [40, 1]], uri: URI.parse('http://[::1]:5000/connect/token') }]],
			[TerminalBuiltinLinkType.Url, '2. Navigate to **https://portal.azure.com**', [{ range: [[18, 1], [41, 1]], uri: URI.parse('https://portal.azure.com') }]],
			[TerminalBuiltinLinkType.Url, 'POST|https://portal.azure.com|2019-12-05|', [{ range: [[6, 1], [29, 1]], uri: URI.parse('https://portal.azure.com') }]],
			[TerminalBuiltinLinkType.Url, 'aa  https://foo.bar/[this is foo site]  aa', [{ range: [[5, 1], [38, 1]], uri: URI.parse('https://foo.bar/[this is foo site]') }]]
		];
	for (const c of linkComputerCases) {
		test('link computer case: `' + c[1] + '`', async () => {
			validResources = c[3] ? [c[3]] : [];
			await assertLink(c[0], c[1], c[2]);
		});
	}

	test('should support multiple link results', async () => {
		await assertLink(TerminalBuiltinLinkType.Url, 'http://foo.bar http://bar.foo', [
			{ range: [[1, 1], [14, 1]], uri: URI.parse('http://foo.bar') },
			{ range: [[16, 1], [29, 1]], uri: URI.parse('http://bar.foo') }
		]);
	});
	test('should detect file:// links with :line suffix', async () => {
		validResources = [URI.file('c:/folder/file')];
		await assertLink(TerminalBuiltinLinkType.LocalFile, 'file:///c:/folder/file:23', [
			{ range: [[1, 1], [25, 1]], uri: URI.parse('file:///c:/folder/file') }
		]);
	});
	test('should detect file:// links with :line:col suffix', async () => {
		validResources = [URI.file('c:/folder/file')];
		await assertLink(TerminalBuiltinLinkType.LocalFile, 'file:///c:/folder/file:23:10', [
			{ range: [[1, 1], [28, 1]], uri: URI.parse('file:///c:/folder/file') }
		]);
	});
	test('should filter out https:// link that exceed 4096 characters', async () => {
		// 8 + 200 * 10 = 2008 characters
		await assertLink(TerminalBuiltinLinkType.Url, `https://${'foobarbaz/'.repeat(200)}`, [{
			range: [[1, 1], [8, 26]],
			uri: URI.parse(`https://${'foobarbaz/'.repeat(200)}`)
		}]);
		// 8 + 450 * 10 = 4508 characters
		await assertLink(TerminalBuiltinLinkType.Url, `https://${'foobarbaz/'.repeat(450)}`, []);
	});
	test('should filter out file:// links that exceed 4096 characters', async () => {
		// 8 + 200 * 10 = 2008 characters
		validResources = [URI.file(`/${'foobarbaz/'.repeat(200)}`)];
		await assertLink(TerminalBuiltinLinkType.LocalFile, `file:///${'foobarbaz/'.repeat(200)}`, [{
			uri: URI.parse(`file:///${'foobarbaz/'.repeat(200)}`),
			range: [[1, 1], [8, 26]]
		}]);
		// 8 + 450 * 10 = 4508 characters
		validResources = [URI.file(`/${'foobarbaz/'.repeat(450)}`)];
		await assertLink(TerminalBuiltinLinkType.LocalFile, `file:///${'foobarbaz/'.repeat(450)}`, []);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/links/test/browser/terminalWordLinkDetector.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/test/browser/terminalWordLinkDetector.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { importAMDNodeModule } from '../../../../../../amdX.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IProductService } from '../../../../../../platform/product/common/productService.js';
import { ITerminalSimpleLink, TerminalBuiltinLinkType } from '../../browser/links.js';
import { TerminalWordLinkDetector } from '../../browser/terminalWordLinkDetector.js';
import { assertLinkHelper } from './linkTestUtils.js';
import { TestProductService } from '../../../../../test/common/workbenchTestServices.js';
import type { Terminal } from '@xterm/xterm';

suite('Workbench - TerminalWordLinkDetector', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let configurationService: TestConfigurationService;
	let detector: TerminalWordLinkDetector;
	let xterm: Terminal;
	let instantiationService: TestInstantiationService;

	setup(async () => {
		instantiationService = store.add(new TestInstantiationService());
		configurationService = new TestConfigurationService();
		await configurationService.setUserConfiguration('terminal', { integrated: { wordSeparators: '' } });

		instantiationService.stub(IConfigurationService, configurationService);
		instantiationService.set(IProductService, TestProductService);

		const TerminalCtor = (await importAMDNodeModule<typeof import('@xterm/xterm')>('@xterm/xterm', 'lib/xterm.js')).Terminal;
		xterm = store.add(new TerminalCtor({ allowProposedApi: true, cols: 80, rows: 30 }));
		detector = store.add(instantiationService.createInstance(TerminalWordLinkDetector, xterm));
	});

	async function assertLink(
		text: string,
		expected: (Pick<ITerminalSimpleLink, 'text'> & { range: [number, number][] })[]
	) {
		await assertLinkHelper(text, expected, detector, TerminalBuiltinLinkType.Search);
	}

	suite('should link words as defined by wordSeparators', () => {
		test('" ()[]"', async () => {
			await configurationService.setUserConfiguration('terminal', { integrated: { wordSeparators: ' ()[]' } });
			// eslint-disable-next-line local/code-no-any-casts
			configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true } as any);
			await assertLink('foo', [{ range: [[1, 1], [3, 1]], text: 'foo' }]);
			await assertLink(' foo ', [{ range: [[2, 1], [4, 1]], text: 'foo' }]);
			await assertLink('(foo)', [{ range: [[2, 1], [4, 1]], text: 'foo' }]);
			await assertLink('[foo]', [{ range: [[2, 1], [4, 1]], text: 'foo' }]);
			await assertLink('{foo}', [{ range: [[1, 1], [5, 1]], text: '{foo}' }]);
		});
		test('" "', async () => {
			await configurationService.setUserConfiguration('terminal', { integrated: { wordSeparators: ' ' } });
			// eslint-disable-next-line local/code-no-any-casts
			configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true } as any);
			await assertLink('foo', [{ range: [[1, 1], [3, 1]], text: 'foo' }]);
			await assertLink(' foo ', [{ range: [[2, 1], [4, 1]], text: 'foo' }]);
			await assertLink('(foo)', [{ range: [[1, 1], [5, 1]], text: '(foo)' }]);
			await assertLink('[foo]', [{ range: [[1, 1], [5, 1]], text: '[foo]' }]);
			await assertLink('{foo}', [{ range: [[1, 1], [5, 1]], text: '{foo}' }]);
		});
		test('" []"', async () => {
			await configurationService.setUserConfiguration('terminal', { integrated: { wordSeparators: ' []' } });
			// eslint-disable-next-line local/code-no-any-casts
			configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true } as any);
			await assertLink('aabbccdd.txt ', [{ range: [[1, 1], [12, 1]], text: 'aabbccdd.txt' }]);
			await assertLink(' aabbccdd.txt ', [{ range: [[2, 1], [13, 1]], text: 'aabbccdd.txt' }]);
			await assertLink(' [aabbccdd.txt] ', [{ range: [[3, 1], [14, 1]], text: 'aabbccdd.txt' }]);
		});
	});

	suite('should ignore powerline symbols', () => {
		for (let i = 0xe0b0; i <= 0xe0bf; i++) {
			test(`\\u${i.toString(16)}`, async () => {
				await assertLink(`${String.fromCharCode(i)}foo${String.fromCharCode(i)}`, [{ range: [[2, 1], [4, 1]], text: 'foo' }]);
			});
		}
	});

	// These are failing - the link's start x is 1 px too far to the right bc it starts
	// with a wide character, which the terminalLinkHelper currently doesn't account for
	test.skip('should support wide characters', async () => {
		await configurationService.setUserConfiguration('terminal', { integrated: { wordSeparators: ' []' } });
		// eslint-disable-next-line local/code-no-any-casts
		configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true } as any);
		await assertLink('我是学生.txt ', [{ range: [[1, 1], [12, 1]], text: '我是学生.txt' }]);
		await assertLink(' 我是学生.txt ', [{ range: [[2, 1], [13, 1]], text: '我是学生.txt' }]);
		await assertLink(' [我是学生.txt] ', [{ range: [[3, 1], [14, 1]], text: '我是学生.txt' }]);
	});

	test('should support multiple link results', async () => {
		await configurationService.setUserConfiguration('terminal', { integrated: { wordSeparators: ' ' } });
		// eslint-disable-next-line local/code-no-any-casts
		configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true } as any);
		await assertLink('foo bar', [
			{ range: [[1, 1], [3, 1]], text: 'foo' },
			{ range: [[5, 1], [7, 1]], text: 'bar' }
		]);
	});

	test('should remove trailing colon in the link results', async () => {
		await configurationService.setUserConfiguration('terminal', { integrated: { wordSeparators: ' ' } });
		// eslint-disable-next-line local/code-no-any-casts
		configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true } as any);
		await assertLink('foo:5:6: bar:0:32:', [
			{ range: [[1, 1], [7, 1]], text: 'foo:5:6' },
			{ range: [[10, 1], [17, 1]], text: 'bar:0:32' }
		]);
	});

	test('should support wrapping', async () => {
		await configurationService.setUserConfiguration('terminal', { integrated: { wordSeparators: ' ' } });
		// eslint-disable-next-line local/code-no-any-casts
		configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true } as any);
		await assertLink('fsdjfsdkfjslkdfjskdfjsldkfjsdlkfjslkdjfskldjflskdfjskldjflskdfjsdklfjsdklfjsldkfjsdlkfjsdlkfjsdlkfjsldkfjslkdfjsdlkfjsldkfjsdlkfjskdfjsldkfjsdlkfjslkdfjsdlkfjsldkfjsldkfjsldkfjslkdfjsdlkfjslkdfjsdklfsd', [
			{ range: [[1, 1], [41, 3]], text: 'fsdjfsdkfjslkdfjskdfjsldkfjsdlkfjslkdjfskldjflskdfjskldjflskdfjsdklfjsdklfjsldkfjsdlkfjsdlkfjsdlkfjsldkfjslkdfjsdlkfjsldkfjsdlkfjskdfjsldkfjsdlkfjslkdfjsdlkfjsldkfjsldkfjsldkfjslkdfjsdlkfjslkdfjsdklfsd' },
		]);
	});
	test('should support wrapping with multiple links', async () => {
		await configurationService.setUserConfiguration('terminal', { integrated: { wordSeparators: ' ' } });
		// eslint-disable-next-line local/code-no-any-casts
		configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true } as any);
		await assertLink('fsdjfsdkfjslkdfjskdfjsldkfj sdlkfjslkdjfskldjflskdfjskldjflskdfj sdklfjsdklfjsldkfjsdlkfjsdlkfjsdlkfjsldkfjslkdfjsdlkfjsldkfjsdlkfjskdfjsldkfjsdlkfjslkdfjsdlkfjsldkfjsldkfjsldkfjslkdfjsdlkfjslkdfjsdklfsd', [
			{ range: [[1, 1], [27, 1]], text: 'fsdjfsdkfjslkdfjskdfjsldkfj' },
			{ range: [[29, 1], [64, 1]], text: 'sdlkfjslkdjfskldjflskdfjskldjflskdfj' },
			{ range: [[66, 1], [43, 3]], text: 'sdklfjsdklfjsldkfjsdlkfjsdlkfjsdlkfjsldkfjslkdfjsdlkfjsldkfjsdlkfjskdfjsldkfjsdlkfjslkdfjsdlkfjsldkfjsldkfjsldkfjslkdfjsdlkfjslkdfjsdklfsd' }
		]);
	});
	test('does not return any links for empty text', async () => {
		await configurationService.setUserConfiguration('terminal', { integrated: { wordSeparators: ' ' } });
		// eslint-disable-next-line local/code-no-any-casts
		configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true } as any);
		await assertLink('', []);
	});
	test('should support file scheme links', async () => {
		await configurationService.setUserConfiguration('terminal', { integrated: { wordSeparators: ' ' } });
		// eslint-disable-next-line local/code-no-any-casts
		configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true } as any);
		await assertLink('file:///C:/users/test/file.txt ', [{ range: [[1, 1], [30, 1]], text: 'file:///C:/users/test/file.txt' }]);
		await assertLink('file:///C:/users/test/file.txt:1:10 ', [{ range: [[1, 1], [35, 1]], text: 'file:///C:/users/test/file.txt:1:10' }]);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/quickAccess/browser/terminal.quickAccess.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/quickAccess/browser/terminal.quickAccess.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../../nls.js';
import { CommandsRegistry } from '../../../../../platform/commands/common/commands.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { IQuickAccessRegistry, Extensions as QuickAccessExtensions } from '../../../../../platform/quickinput/common/quickAccess.js';
import { IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { getQuickNavigateHandler } from '../../../../browser/quickaccess.js';
import { registerTerminalAction } from '../../../terminal/browser/terminalActions.js';
import { TerminalContextKeys } from '../../../terminal/common/terminalContextKey.js';
import { TerminalQuickAccessProvider } from '../../../terminalContrib/quickAccess/browser/terminalQuickAccess.js';

const enum TerminalQuickAccessCommandId {
	QuickOpenTerm = 'workbench.action.quickOpenTerm',
}

const quickAccessRegistry = (Registry.as<IQuickAccessRegistry>(QuickAccessExtensions.Quickaccess));
const inTerminalsPicker = 'inTerminalPicker';
quickAccessRegistry.registerQuickAccessProvider({
	ctor: TerminalQuickAccessProvider,
	prefix: TerminalQuickAccessProvider.PREFIX,
	contextKey: inTerminalsPicker,
	placeholder: nls.localize('tasksQuickAccessPlaceholder', "Type the name of a terminal to open."),
	helpEntries: [{ description: nls.localize('tasksQuickAccessHelp', "Show All Opened Terminals"), commandId: TerminalQuickAccessCommandId.QuickOpenTerm }]
});
const quickAccessNavigateNextInTerminalPickerId = 'workbench.action.quickOpenNavigateNextInTerminalPicker';
CommandsRegistry.registerCommand({ id: quickAccessNavigateNextInTerminalPickerId, handler: getQuickNavigateHandler(quickAccessNavigateNextInTerminalPickerId, true) });
const quickAccessNavigatePreviousInTerminalPickerId = 'workbench.action.quickOpenNavigatePreviousInTerminalPicker';
CommandsRegistry.registerCommand({ id: quickAccessNavigatePreviousInTerminalPickerId, handler: getQuickNavigateHandler(quickAccessNavigatePreviousInTerminalPickerId, false) });

registerTerminalAction({
	id: TerminalQuickAccessCommandId.QuickOpenTerm,
	title: nls.localize2('quickAccessTerminal', 'Switch Active Terminal'),
	precondition: ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated),
	run: (c, accessor) => accessor.get(IQuickInputService).quickAccess.show(TerminalQuickAccessProvider.PREFIX)
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/quickAccess/browser/terminalQuickAccess.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/quickAccess/browser/terminalQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../../nls.js';
import { IQuickPickSeparator } from '../../../../../platform/quickinput/common/quickInput.js';
import { IPickerQuickAccessItem, PickerQuickAccessProvider, TriggerAction } from '../../../../../platform/quickinput/browser/pickerQuickAccess.js';
import { matchesFuzzy } from '../../../../../base/common/filters.js';
import { ITerminalEditorService, ITerminalGroupService, ITerminalInstance, ITerminalService } from '../../../terminal/browser/terminal.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { TerminalCommandId } from '../../../terminal/common/terminal.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { killTerminalIcon, renameTerminalIcon } from '../../../terminal/browser/terminalIcons.js';
import { getColorClass, getIconId, getUriClasses } from '../../../terminal/browser/terminalIcon.js';
import { terminalStrings } from '../../../terminal/common/terminalStrings.js';
import { TerminalLocation } from '../../../../../platform/terminal/common/terminal.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
let terminalPicks: Array<IPickerQuickAccessItem | IQuickPickSeparator> = [];

export class TerminalQuickAccessProvider extends PickerQuickAccessProvider<IPickerQuickAccessItem> {

	static PREFIX = 'term ';

	constructor(
		@ICommandService private readonly _commandService: ICommandService,
		@IEditorService private readonly _editorService: IEditorService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ITerminalEditorService private readonly _terminalEditorService: ITerminalEditorService,
		@ITerminalGroupService private readonly _terminalGroupService: ITerminalGroupService,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@IThemeService private readonly _themeService: IThemeService,
	) {
		super(TerminalQuickAccessProvider.PREFIX, { canAcceptInBackground: true });
	}

	protected _getPicks(filter: string): Array<IPickerQuickAccessItem | IQuickPickSeparator> {
		terminalPicks = [];
		terminalPicks.push({ type: 'separator', label: 'panel' });
		const terminalGroups = this._terminalGroupService.groups;
		for (let groupIndex = 0; groupIndex < terminalGroups.length; groupIndex++) {
			const terminalGroup = terminalGroups[groupIndex];
			for (let terminalIndex = 0; terminalIndex < terminalGroup.terminalInstances.length; terminalIndex++) {
				const terminal = terminalGroup.terminalInstances[terminalIndex];
				const pick = this._createPick(terminal, terminalIndex, filter, { groupIndex, groupSize: terminalGroup.terminalInstances.length });
				if (pick) {
					terminalPicks.push(pick);
				}
			}
		}

		if (terminalPicks.length > 0) {
			terminalPicks.push({ type: 'separator', label: 'editor' });
		}

		const terminalEditors = this._terminalEditorService.instances;
		for (let editorIndex = 0; editorIndex < terminalEditors.length; editorIndex++) {
			const term = terminalEditors[editorIndex];
			term.target = TerminalLocation.Editor;
			const pick = this._createPick(term, editorIndex, filter);
			if (pick) {
				terminalPicks.push(pick);
			}
		}

		if (terminalPicks.length > 0) {
			terminalPicks.push({ type: 'separator' });
		}

		const createTerminalLabel = localize("workbench.action.terminal.newplus", "Create New Terminal");
		terminalPicks.push({
			label: `$(plus) ${createTerminalLabel}`,
			ariaLabel: createTerminalLabel,
			accept: () => this._commandService.executeCommand(TerminalCommandId.New)
		});
		const createWithProfileLabel = localize("workbench.action.terminal.newWithProfilePlus", "Create New Terminal With Profile...");
		terminalPicks.push({
			label: `$(plus) ${createWithProfileLabel}`,
			ariaLabel: createWithProfileLabel,
			accept: () => this._commandService.executeCommand(TerminalCommandId.NewWithProfile)
		});
		return terminalPicks;
	}

	private _createPick(terminal: ITerminalInstance, terminalIndex: number, filter: string, groupInfo?: { groupIndex: number; groupSize: number }): IPickerQuickAccessItem | undefined {
		const iconId = this._instantiationService.invokeFunction(getIconId, terminal);
		const index = groupInfo
			? (groupInfo.groupSize > 1
				? `${groupInfo.groupIndex + 1}.${terminalIndex + 1}`
				: `${groupInfo.groupIndex + 1}`)
			: `${terminalIndex + 1}`;
		const label = `$(${iconId}) ${index}: ${terminal.title}`;
		const iconClasses: string[] = [];
		const colorClass = getColorClass(terminal);
		if (colorClass) {
			iconClasses.push(colorClass);
		}
		const uriClasses = getUriClasses(terminal, this._themeService.getColorTheme().type);
		if (uriClasses) {
			iconClasses.push(...uriClasses);
		}
		const highlights = matchesFuzzy(filter, label, true);
		if (highlights) {
			return {
				label,
				description: terminal.description,
				highlights: { label: highlights },
				buttons: [
					{
						iconClass: ThemeIcon.asClassName(renameTerminalIcon),
						tooltip: localize('renameTerminal', "Rename Terminal")
					},
					{
						iconClass: ThemeIcon.asClassName(killTerminalIcon),
						tooltip: terminalStrings.kill.value
					}
				],
				iconClasses,
				trigger: buttonIndex => {
					switch (buttonIndex) {
						case 0:
							this._commandService.executeCommand(TerminalCommandId.Rename, terminal);
							return TriggerAction.NO_ACTION;
						case 1:
							this._terminalService.safeDisposeTerminal(terminal);
							return TriggerAction.REMOVE_ITEM;
					}

					return TriggerAction.NO_ACTION;
				},
				accept: (keyMod, event) => {
					if (terminal.target === TerminalLocation.Editor) {
						const existingEditors = this._editorService.findEditors(terminal.resource);
						this._terminalEditorService.openEditor(terminal, { viewColumn: existingEditors?.[0].groupId });
						this._terminalEditorService.setActiveInstance(terminal);
					} else {
						this._terminalGroupService.showPanel(!event.inBackground);
						this._terminalGroupService.setActiveInstance(terminal);
					}
				}
			};
		}
		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/quickFix/browser/quickFix.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/quickFix/browser/quickFix.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../../platform/instantiation/common/instantiation.js';
import { Event } from '../../../../../base/common/event.js';
import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { IAction } from '../../../../../base/common/actions.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { URI } from '../../../../../base/common/uri.js';
import { ITerminalCommandSelector, ITerminalOutputMatch, ITerminalOutputMatcher } from '../../../../../platform/terminal/common/terminal.js';
import { ITerminalCommand } from '../../../../../platform/terminal/common/capabilities/capabilities.js';

export const ITerminalQuickFixService = createDecorator<ITerminalQuickFixService>('terminalQuickFixService');
export interface ITerminalQuickFixService {
	readonly onDidRegisterProvider: Event<ITerminalQuickFixProviderSelector>;
	readonly onDidRegisterCommandSelector: Event<ITerminalCommandSelector>;
	readonly onDidUnregisterProvider: Event<string>;
	readonly _serviceBrand: undefined;
	readonly extensionQuickFixes: Promise<Array<ITerminalCommandSelector>>;
	providers: Map<string, ITerminalQuickFixProvider>;
	registerQuickFixProvider(id: string, provider: ITerminalQuickFixProvider): IDisposable;
	registerCommandSelector(selector: ITerminalCommandSelector): void;
}

export interface ITerminalQuickFixProviderSelector {
	selector: ITerminalCommandSelector;
	provider: ITerminalQuickFixProvider;
}

export type TerminalQuickFixActionInternal = IAction | ITerminalQuickFixTerminalCommandAction | ITerminalQuickFixOpenerAction;
export type TerminalQuickFixCallback = (matchResult: ITerminalCommandMatchResult) => TerminalQuickFixActionInternal[] | TerminalQuickFixActionInternal | undefined;
export type TerminalQuickFixCallbackExtension = (terminalCommand: ITerminalCommand, lines: string[] | undefined, option: ITerminalQuickFixOptions, token: CancellationToken) => Promise<ITerminalQuickFix[] | ITerminalQuickFix | undefined>;

export interface ITerminalQuickFixProvider {
	/**
	 * Provides terminal quick fixes
	 * @param commandMatchResult The command match result for which to provide quick fixes
	 * @param token A cancellation token indicating the result is no longer needed
	 * @return Terminal quick fix(es) if any
	 */
	provideTerminalQuickFixes(terminalCommand: ITerminalCommand, lines: string[] | undefined, option: ITerminalQuickFixOptions, token: CancellationToken): Promise<ITerminalQuickFix[] | ITerminalQuickFix | undefined>;
}

export enum TerminalQuickFixType {
	TerminalCommand = 0,
	Opener = 1,
	Port = 2,
	VscodeCommand = 3
}

export interface ITerminalQuickFixOptions {
	type: 'internal' | 'resolved' | 'unresolved';
	id: string;
	commandLineMatcher: string | RegExp;
	outputMatcher?: ITerminalOutputMatcher;
	commandExitResult: 'success' | 'error';
	kind?: 'fix' | 'explain';
}

export interface ITerminalQuickFix {
	type: TerminalQuickFixType;
	id: string;
	source: string;
}

export interface ITerminalQuickFixTerminalCommandAction extends ITerminalQuickFix {
	type: TerminalQuickFixType.TerminalCommand;
	terminalCommand: string;
	// TODO: Should this depend on whether alt is held?
	shouldExecute?: boolean;
}
export interface ITerminalQuickFixOpenerAction extends ITerminalQuickFix {
	type: TerminalQuickFixType.Opener;
	uri: URI;
}
export interface ITerminalQuickFixCommandAction extends ITerminalQuickFix {
	title: string;
}

export interface ITerminalCommandMatchResult {
	commandLine: string;
	commandLineMatch: RegExpMatchArray;
	outputMatch?: ITerminalOutputMatch;
}

export interface ITerminalQuickFixInternalOptions extends ITerminalQuickFixOptions {
	type: 'internal';
	getQuickFixes: TerminalQuickFixCallback;
}

export interface ITerminalQuickFixResolvedExtensionOptions extends ITerminalQuickFixOptions {
	type: 'resolved';
	getQuickFixes: TerminalQuickFixCallbackExtension;
}

export interface ITerminalQuickFixUnresolvedExtensionOptions extends ITerminalQuickFixOptions {
	type: 'unresolved';
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/quickFix/browser/quickFixAddon.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/quickFix/browser/quickFixAddon.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { ITerminalAddon } from '@xterm/headless';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore, MutableDisposable, type IDisposable } from '../../../../../base/common/lifecycle.js';
import { ITerminalCapabilityStore, ITerminalCommand, TerminalCapability } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import * as dom from '../../../../../base/browser/dom.js';
import { IAction } from '../../../../../base/common/actions.js';
import { asArray } from '../../../../../base/common/arrays.js';
import { localize } from '../../../../../nls.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { DecorationSelector, updateLayout } from '../../../terminal/browser/xterm/decorationStyles.js';
import type { IDecoration, Terminal } from '@xterm/xterm';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { IExtensionService } from '../../../../services/extensions/common/extensions.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { IActionWidgetService } from '../../../../../platform/actionWidget/browser/actionWidget.js';
import { ActionSet } from '../../../../../platform/actionWidget/common/actionWidget.js';
import { getLinesForCommand } from '../../../../../platform/terminal/common/capabilities/commandDetectionCapability.js';
import { IAnchor } from '../../../../../base/browser/ui/contextview/contextview.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { Schemas } from '../../../../../base/common/network.js';
import { URI } from '../../../../../base/common/uri.js';
import { ITerminalQuickFixInternalOptions, ITerminalQuickFixResolvedExtensionOptions, ITerminalQuickFix, ITerminalQuickFixTerminalCommandAction, ITerminalQuickFixOpenerAction, ITerminalQuickFixOptions, ITerminalQuickFixProviderSelector, ITerminalQuickFixService, ITerminalQuickFixUnresolvedExtensionOptions, TerminalQuickFixType, ITerminalQuickFixCommandAction } from './quickFix.js';
import { ITerminalCommandSelector, TerminalSettingId } from '../../../../../platform/terminal/common/terminal.js';
import { ActionListItemKind, IActionListItem } from '../../../../../platform/actionWidget/browser/actionList.js';
import { CodeActionKind } from '../../../../../editor/contrib/codeAction/common/types.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { hasKey, type SingleOrMany } from '../../../../../base/common/types.js';

const enum QuickFixDecorationSelector {
	QuickFix = 'quick-fix'
}

const quickFixClasses = [
	QuickFixDecorationSelector.QuickFix,
	DecorationSelector.Codicon,
	DecorationSelector.CommandDecoration,
	DecorationSelector.XtermDecoration
];

export interface ITerminalQuickFixAddon {
	readonly onDidRequestRerunCommand: Event<{ command: string; shouldExecute?: boolean }>;
	readonly onDidUpdateQuickFixes: Event<{ command: ITerminalCommand; actions: ITerminalAction[] | undefined }>;
	showMenu(): void;
	/**
	 * Registers a listener on onCommandFinished scoped to a particular command or regular
	 * expression and provides a callback to be executed for commands that match.
	 */
	registerCommandFinishedListener(options: ITerminalQuickFixOptions): void;
}

export class TerminalQuickFixAddon extends Disposable implements ITerminalAddon, ITerminalQuickFixAddon {

	private _terminal: Terminal | undefined;

	private _commandListeners: Map<string, (ITerminalQuickFixOptions | ITerminalQuickFixResolvedExtensionOptions | ITerminalQuickFixUnresolvedExtensionOptions)[]> = new Map();

	private _quickFixes: ITerminalAction[] | undefined;

	private readonly _decoration: MutableDisposable<IDecoration> = this._register(new MutableDisposable());
	private readonly _decorationDisposables: MutableDisposable<IDisposable> = this._register(new MutableDisposable());

	private _currentRenderContext: { quickFixes: ITerminalAction[]; anchor: IAnchor; parentElement: HTMLElement } | undefined;

	private _lastQuickFixId: string | undefined;

	private readonly _registeredSelectors: Set<string> = new Set();

	private _didRun: boolean = false;

	private readonly _onDidRequestRerunCommand = new Emitter<{ command: string; shouldExecute?: boolean }>();
	readonly onDidRequestRerunCommand = this._onDidRequestRerunCommand.event;
	private readonly _onDidUpdateQuickFixes = new Emitter<{ command: ITerminalCommand; actions: ITerminalAction[] | undefined }>();
	readonly onDidUpdateQuickFixes = this._onDidUpdateQuickFixes.event;

	constructor(
		private readonly _sessionId: string,
		private readonly _aliases: string[][] | undefined,
		private readonly _capabilities: ITerminalCapabilityStore,
		@IAccessibilitySignalService private readonly _accessibilitySignalService: IAccessibilitySignalService,
		@IActionWidgetService private readonly _actionWidgetService: IActionWidgetService,
		@ICommandService private readonly _commandService: ICommandService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IExtensionService private readonly _extensionService: IExtensionService,
		@ILabelService private readonly _labelService: ILabelService,
		@IOpenerService private readonly _openerService: IOpenerService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@ITerminalQuickFixService private readonly _quickFixService: ITerminalQuickFixService,
	) {
		super();
		const commandDetectionCapability = this._capabilities.get(TerminalCapability.CommandDetection);
		if (commandDetectionCapability) {
			this._registerCommandHandlers();
		} else {
			this._register(this._capabilities.onDidAddCommandDetectionCapability(() => {
				this._registerCommandHandlers();
			}));
		}
		this._register(this._quickFixService.onDidRegisterProvider(result => this.registerCommandFinishedListener(convertToQuickFixOptions(result))));
		this._quickFixService.extensionQuickFixes.then(quickFixSelectors => {
			for (const selector of quickFixSelectors) {
				this.registerCommandSelector(selector);
			}
		});
		this._register(this._quickFixService.onDidRegisterCommandSelector(selector => this.registerCommandSelector(selector)));
		this._register(this._quickFixService.onDidUnregisterProvider(id => this._commandListeners.delete(id)));
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TerminalSettingId.ShellIntegrationQuickFixEnabled)) {
				// Clear existing decorations when setting changes
				this._decoration.clear();
				this._decorationDisposables.clear();
			}
		}));
	}

	activate(terminal: Terminal): void {
		this._terminal = terminal;
	}

	showMenu(): void {
		if (!this._currentRenderContext) {
			return;
		}

		const actions = this._currentRenderContext.quickFixes.map(f => new TerminalQuickFixItem(f, f.type, f.source, f.label, f.kind));
		const actionSet = {
			allActions: actions,
			hasAutoFix: false,
			hasAIFix: false,
			allAIFixes: false,
			validActions: actions,
			dispose: () => { }
		} satisfies ActionSet<TerminalQuickFixItem>;
		const delegate = {
			onSelect: async (fix: TerminalQuickFixItem) => {
				fix.action?.run();
				this._actionWidgetService.hide();
			},
			onHide: () => {
				this._terminal?.focus();
			},
		};
		this._actionWidgetService.show('quickFixWidget', false, toActionWidgetItems(actionSet.validActions, true), delegate, this._currentRenderContext.anchor, this._currentRenderContext.parentElement);
	}

	registerCommandSelector(selector: ITerminalCommandSelector): void {
		if (this._registeredSelectors.has(selector.id)) {
			return;
		}
		const matcherKey = selector.commandLineMatcher.toString();
		const currentOptions = this._commandListeners.get(matcherKey) || [];
		currentOptions.push({
			id: selector.id,
			type: 'unresolved',
			commandLineMatcher: selector.commandLineMatcher,
			outputMatcher: selector.outputMatcher,
			commandExitResult: selector.commandExitResult,
			kind: selector.kind
		});
		this._registeredSelectors.add(selector.id);
		this._commandListeners.set(matcherKey, currentOptions);
	}

	registerCommandFinishedListener(options: ITerminalQuickFixOptions | ITerminalQuickFixResolvedExtensionOptions): void {
		const matcherKey = options.commandLineMatcher.toString();
		let currentOptions = this._commandListeners.get(matcherKey) || [];
		// removes the unresolved options
		currentOptions = currentOptions.filter(o => o.id !== options.id);
		currentOptions.push(options);
		this._commandListeners.set(matcherKey, currentOptions);
	}

	private _registerCommandHandlers(): void {
		const terminal = this._terminal;
		const commandDetection = this._capabilities.get(TerminalCapability.CommandDetection);
		if (!terminal || !commandDetection) {
			return;
		}
		this._register(commandDetection.onCommandFinished(async command => await this._resolveQuickFixes(command, this._aliases)));
	}

	/**
	 * Resolves quick fixes, if any, based on the
	 * @param command & its output
	 */
	private async _resolveQuickFixes(command: ITerminalCommand, aliases?: string[][]): Promise<void> {
		const terminal = this._terminal;
		if (!terminal || command.wasReplayed) {
			return;
		}
		if (command.command !== '' && this._lastQuickFixId) {
			this._disposeQuickFix(command, this._lastQuickFixId);
		}

		const resolver = async (selector: ITerminalQuickFixOptions, lines?: string[]) => {
			if (lines === undefined) {
				return undefined;
			}
			const id = selector.id;
			await this._extensionService.activateByEvent(`onTerminalQuickFixRequest:${id}`);
			return this._quickFixService.providers.get(id)?.provideTerminalQuickFixes(command, lines, {
				type: 'resolved',
				commandLineMatcher: selector.commandLineMatcher,
				outputMatcher: selector.outputMatcher,
				commandExitResult: selector.commandExitResult,
				kind: selector.kind,
				id: selector.id
			}, new CancellationTokenSource().token);
		};
		const result = await getQuickFixesForCommand(aliases, terminal, command, this._commandListeners, this._commandService, this._openerService, this._labelService, this._onDidRequestRerunCommand, resolver);
		if (!result) {
			return;
		}

		this._quickFixes = result;
		this._lastQuickFixId = this._quickFixes[0].id;
		this._registerQuickFixDecoration();
		this._onDidUpdateQuickFixes.fire({ command, actions: this._quickFixes });
		this._quickFixes = undefined;
	}

	private _disposeQuickFix(command: ITerminalCommand, id: string): void {
		type QuickFixResultTelemetryEvent = {
			quickFixId: string;
			ranQuickFix: boolean;
			terminalSessionId: string;
		};
		type QuickFixClassification = {
			owner: 'meganrogge';
			quickFixId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The quick fix ID' };
			ranQuickFix: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the quick fix was run' };
			terminalSessionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The terminal session ID' };
			comment: 'Terminal quick fixes';
		};
		this._telemetryService?.publicLog2<QuickFixResultTelemetryEvent, QuickFixClassification>('terminal/quick-fix', {
			quickFixId: id,
			ranQuickFix: this._didRun,
			terminalSessionId: this._sessionId
		});
		this._decoration.clear();
		this._decorationDisposables.clear();
		this._onDidUpdateQuickFixes.fire({ command, actions: this._quickFixes });
		this._quickFixes = undefined;
		this._lastQuickFixId = undefined;
		this._didRun = false;
	}

	/**
	 * Registers a decoration with the quick fixes
	 */
	private _registerQuickFixDecoration(): void {
		if (!this._terminal) {
			return;
		}

		// Check if quick fix decorations are enabled
		const quickFixEnabled = this._configurationService.getValue<boolean>(TerminalSettingId.ShellIntegrationQuickFixEnabled);
		if (!quickFixEnabled) {
			return;
		}

		this._decoration.clear();
		this._decorationDisposables.clear();
		const quickFixes = this._quickFixes;
		if (!quickFixes || quickFixes.length === 0) {
			return;
		}
		const marker = this._terminal.registerMarker();
		if (!marker) {
			return;
		}
		const decoration = this._decoration.value = this._terminal.registerDecoration({ marker, width: 2, layer: 'top' });
		if (!decoration) {
			return;
		}
		const store = this._decorationDisposables.value = new DisposableStore();
		store.add(decoration.onRender(e => {
			const rect = e.getBoundingClientRect();
			const anchor = {
				x: rect.x,
				y: rect.y,
				width: rect.width,
				height: rect.height
			};

			if (e.classList.contains(QuickFixDecorationSelector.QuickFix)) {
				if (this._currentRenderContext) {
					this._currentRenderContext.anchor = anchor;
				}

				return;
			}

			e.classList.add(...quickFixClasses);
			const isExplainOnly = quickFixes.every(e => e.kind === 'explain');
			if (isExplainOnly) {
				e.classList.add('explainOnly');
			}
			e.classList.add(...ThemeIcon.asClassNameArray(isExplainOnly ? Codicon.sparkle : Codicon.lightBulb));

			updateLayout(this._configurationService, e);
			this._accessibilitySignalService.playSignal(AccessibilitySignal.terminalQuickFix);

			const parentElement = e.closest('.xterm')?.parentElement;
			if (!parentElement) {
				return;
			}

			this._currentRenderContext = { quickFixes, anchor, parentElement };
			this._register(dom.addDisposableListener(e, dom.EventType.CLICK, () => this.showMenu()));
		}));
		store.add(decoration.onDispose(() => this._currentRenderContext = undefined));
	}
}

export interface ITerminalAction extends IAction {
	type: TerminalQuickFixType;
	kind?: 'fix' | 'explain';
	source: string;
	uri?: URI;
	command?: string;
	shouldExecute?: boolean;
}

export async function getQuickFixesForCommand(
	aliases: string[][] | undefined,
	terminal: Terminal,
	terminalCommand: ITerminalCommand,
	quickFixOptions: Map<string, ITerminalQuickFixOptions[]>,
	commandService: ICommandService,
	openerService: IOpenerService,
	labelService: ILabelService,
	onDidRequestRerunCommand?: Emitter<{ command: string; shouldExecute?: boolean }>,
	getResolvedFixes?: (selector: ITerminalQuickFixOptions, lines?: string[]) => Promise<SingleOrMany<ITerminalQuickFix> | undefined>
): Promise<ITerminalAction[] | undefined> {
	// Prevent duplicates by tracking added entries
	const commandQuickFixSet: Set<string> = new Set();
	const openQuickFixSet: Set<string> = new Set();

	const fixes: ITerminalAction[] = [];
	const newCommand = terminalCommand.command;
	for (const options of quickFixOptions.values()) {
		for (const option of options) {
			if ((option.commandExitResult === 'success' && terminalCommand.exitCode !== 0) || (option.commandExitResult === 'error' && terminalCommand.exitCode === 0)) {
				continue;
			}
			let quickFixes;
			if (option.type === 'resolved') {
				quickFixes = await (option as ITerminalQuickFixResolvedExtensionOptions).getQuickFixes(terminalCommand, getLinesForCommand(terminal.buffer.active, terminalCommand, terminal.cols, option.outputMatcher), option, new CancellationTokenSource().token);
			} else if (option.type === 'unresolved') {
				if (!getResolvedFixes) {
					throw new Error('No resolved fix provider');
				}
				quickFixes = await getResolvedFixes(option, option.outputMatcher ? getLinesForCommand(terminal.buffer.active, terminalCommand, terminal.cols, option.outputMatcher) : undefined);
			} else if (option.type === 'internal') {
				const commandLineMatch = newCommand.match(option.commandLineMatcher);
				if (!commandLineMatch) {
					continue;
				}
				const outputMatcher = option.outputMatcher;
				let outputMatch;
				if (outputMatcher) {
					outputMatch = terminalCommand.getOutputMatch(outputMatcher);
				}
				if (!outputMatch) {
					continue;
				}
				const matchResult = { commandLineMatch, outputMatch, commandLine: terminalCommand.command };
				quickFixes = (option as ITerminalQuickFixInternalOptions).getQuickFixes(matchResult);
			}

			if (quickFixes) {
				for (const quickFix of asArray(quickFixes)) {
					let action: ITerminalAction | undefined;
					if (hasKey(quickFix, { type: true })) {
						switch (quickFix.type) {
							case TerminalQuickFixType.TerminalCommand: {
								const fix = quickFix as ITerminalQuickFixTerminalCommandAction;
								if (commandQuickFixSet.has(fix.terminalCommand)) {
									continue;
								}
								commandQuickFixSet.add(fix.terminalCommand);
								const label = localize('quickFix.command', 'Run: {0}', fix.terminalCommand);
								action = {
									type: TerminalQuickFixType.TerminalCommand,
									kind: option.kind,
									class: undefined,
									source: quickFix.source,
									id: quickFix.id,
									label,
									enabled: true,
									run: () => {
										onDidRequestRerunCommand?.fire({
											command: fix.terminalCommand,
											shouldExecute: fix.shouldExecute ?? true
										});
									},
									tooltip: label,
									command: fix.terminalCommand,
									shouldExecute: fix.shouldExecute
								};
								break;
							}
							case TerminalQuickFixType.Opener: {
								const fix = quickFix as ITerminalQuickFixOpenerAction;
								if (!fix.uri) {
									return;
								}
								if (openQuickFixSet.has(fix.uri.toString())) {
									continue;
								}
								openQuickFixSet.add(fix.uri.toString());
								const isUrl = (fix.uri.scheme === Schemas.http || fix.uri.scheme === Schemas.https);
								const uriLabel = isUrl ? encodeURI(fix.uri.toString(true)) : labelService.getUriLabel(fix.uri);
								const label = localize('quickFix.opener', 'Open: {0}', uriLabel);
								action = {
									source: quickFix.source,
									id: quickFix.id,
									label,
									type: TerminalQuickFixType.Opener,
									kind: option.kind,
									class: undefined,
									enabled: true,
									run: () => openerService.open(fix.uri),
									tooltip: label,
									uri: fix.uri
								};
								break;
							}
							case TerminalQuickFixType.Port: {
								const fix = quickFix as ITerminalAction;
								action = {
									source: 'builtin',
									type: fix.type,
									kind: option.kind,
									id: fix.id,
									label: fix.label,
									class: fix.class,
									enabled: fix.enabled,
									run: () => {
										fix.run();
									},
									tooltip: fix.tooltip
								};
								break;
							}
							case TerminalQuickFixType.VscodeCommand: {
								const fix = quickFix as ITerminalQuickFixCommandAction;
								action = {
									source: quickFix.source,
									type: fix.type,
									kind: option.kind,
									id: fix.id,
									label: fix.title,
									class: undefined,
									enabled: true,
									run: () => commandService.executeCommand(fix.id),
									tooltip: fix.title
								};
								break;
							}
						}
						if (action) {
							fixes.push(action);
						}
					}
				}
			}
		}
	}
	return fixes.length > 0 ? fixes : undefined;
}

function convertToQuickFixOptions(selectorProvider: ITerminalQuickFixProviderSelector): ITerminalQuickFixResolvedExtensionOptions {
	return {
		id: selectorProvider.selector.id,
		type: 'resolved',
		commandLineMatcher: selectorProvider.selector.commandLineMatcher,
		outputMatcher: selectorProvider.selector.outputMatcher,
		commandExitResult: selectorProvider.selector.commandExitResult,
		kind: selectorProvider.selector.kind,
		getQuickFixes: selectorProvider.provider.provideTerminalQuickFixes
	};
}

class TerminalQuickFixItem {
	readonly disabled = false;
	constructor(
		readonly action: ITerminalAction,
		readonly type: TerminalQuickFixType,
		readonly source: string,
		readonly title: string | undefined,
		readonly kind: 'fix' | 'explain' = 'fix'
	) {
	}
}

function toActionWidgetItems(inputQuickFixes: readonly TerminalQuickFixItem[], showHeaders: boolean): IActionListItem<TerminalQuickFixItem>[] {
	const menuItems: IActionListItem<TerminalQuickFixItem>[] = [];
	menuItems.push({
		kind: ActionListItemKind.Header,
		group: {
			kind: CodeActionKind.QuickFix,
			title: localize('codeAction.widget.id.quickfix', 'Quick Fix')
		}
	});
	for (const quickFix of showHeaders ? inputQuickFixes : inputQuickFixes.filter(i => !!i.action)) {
		if (!quickFix.disabled && quickFix.action) {
			menuItems.push({
				kind: ActionListItemKind.Action,
				item: quickFix,
				group: {
					kind: CodeActionKind.QuickFix,
					icon: getQuickFixIcon(quickFix),
					title: quickFix.action.label
				},
				disabled: false,
				label: quickFix.title
			});
		}
	}
	return menuItems;
}

function getQuickFixIcon(quickFix: TerminalQuickFixItem): ThemeIcon {
	if (quickFix.kind === 'explain') {
		return Codicon.sparkle;
	}
	switch (quickFix.type) {
		case TerminalQuickFixType.Opener:
			if (quickFix.action.uri) {
				const isUrl = (quickFix.action.uri.scheme === Schemas.http || quickFix.action.uri.scheme === Schemas.https);
				return isUrl ? Codicon.linkExternal : Codicon.goToFile;
			}
		case TerminalQuickFixType.TerminalCommand:
			return Codicon.run;
		case TerminalQuickFixType.Port:
			return Codicon.debugDisconnect;
		case TerminalQuickFixType.VscodeCommand:
			return Codicon.lightbulb;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/quickFix/browser/terminal.quickFix.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/quickFix/browser/terminal.quickFix.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Terminal as RawXtermTerminal } from '@xterm/xterm';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { DisposableStore, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { localize2 } from '../../../../../nls.js';
import { InstantiationType, registerSingleton } from '../../../../../platform/instantiation/common/extensions.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ITerminalContribution, ITerminalInstance, IXtermTerminal } from '../../../terminal/browser/terminal.js';
import { registerActiveInstanceAction } from '../../../terminal/browser/terminalActions.js';
import { registerTerminalContribution, type ITerminalContributionContext } from '../../../terminal/browser/terminalExtensions.js';
import { TerminalContextKeys } from '../../../terminal/common/terminalContextKey.js';
import './media/terminalQuickFix.css';
import { ITerminalQuickFixService } from './quickFix.js';
import { TerminalQuickFixAddon } from './quickFixAddon.js';
import { freePort, gitCreatePr, gitFastForwardPull, gitPushSetUpstream, gitSimilar, gitTwoDashes, pwshGeneralError, pwshUnixCommandNotFoundError } from './terminalQuickFixBuiltinActions.js';
import { TerminalQuickFixService } from './terminalQuickFixService.js';

// #region Services

registerSingleton(ITerminalQuickFixService, TerminalQuickFixService, InstantiationType.Delayed);

// #endregion

// #region Contributions

class TerminalQuickFixContribution extends DisposableStore implements ITerminalContribution {
	static readonly ID = 'quickFix';

	static get(instance: ITerminalInstance): TerminalQuickFixContribution | null {
		return instance.getContribution<TerminalQuickFixContribution>(TerminalQuickFixContribution.ID);
	}

	private _addon?: TerminalQuickFixAddon;
	get addon(): TerminalQuickFixAddon | undefined { return this._addon; }

	private readonly _quickFixMenuItems = this.add(new MutableDisposable());

	constructor(
		private readonly _ctx: ITerminalContributionContext,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		super();
	}

	xtermReady(xterm: IXtermTerminal & { raw: RawXtermTerminal }): void {
		// Create addon
		this._addon = this._instantiationService.createInstance(TerminalQuickFixAddon, this._ctx.instance.sessionId, undefined, this._ctx.instance.capabilities);
		xterm.raw.loadAddon(this._addon);

		// Hook up listeners
		this.add(this._addon.onDidRequestRerunCommand((e) => this._ctx.instance.runCommand(e.command, e.shouldExecute || false)));
		this.add(this._addon.onDidUpdateQuickFixes(e => {
			// Only track the latest command's quick fixes
			this._quickFixMenuItems.value = e.actions ? xterm.decorationAddon.registerMenuItems(e.command, e.actions) : undefined;
		}));

		// Register quick fixes
		for (const actionOption of [
			gitTwoDashes(),
			gitFastForwardPull(),
			freePort((port: string, command: string) => this._ctx.instance.freePortKillProcess(port, command)),
			gitSimilar(),
			gitPushSetUpstream(),
			gitCreatePr(),
			pwshUnixCommandNotFoundError(),
			pwshGeneralError()
		]) {
			this._addon.registerCommandFinishedListener(actionOption);
		}
	}
}
registerTerminalContribution(TerminalQuickFixContribution.ID, TerminalQuickFixContribution);

// #endregion

// #region Actions

const enum TerminalQuickFixCommandId {
	ShowQuickFixes = 'workbench.action.terminal.showQuickFixes',
}

registerActiveInstanceAction({
	id: TerminalQuickFixCommandId.ShowQuickFixes,
	title: localize2('workbench.action.terminal.showQuickFixes', 'Show Terminal Quick Fixes'),
	precondition: TerminalContextKeys.focus,
	keybinding: {
		primary: KeyMod.CtrlCmd | KeyCode.Period,
		weight: KeybindingWeight.WorkbenchContrib
	},
	run: (activeInstance) => TerminalQuickFixContribution.get(activeInstance)?.addon?.showMenu()
});

// #endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/quickFix/browser/terminalQuickFixBuiltinActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/quickFix/browser/terminalQuickFixBuiltinActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../../base/common/uri.js';
import { localize } from '../../../../../nls.js';
import { ITerminalQuickFixInternalOptions, ITerminalCommandMatchResult, ITerminalQuickFixTerminalCommandAction, TerminalQuickFixActionInternal, TerminalQuickFixType } from './quickFix.js';

export const GitCommandLineRegex = /git/;
export const GitFastForwardPullOutputRegex = /and can be fast-forwarded/;
export const GitPushCommandLineRegex = /git\s+push/;
export const GitTwoDashesRegex = /error: did you mean `--(.+)` \(with two dashes\)\?/;
export const GitSimilarOutputRegex = /(?:(most similar commands? (is|are)))/;
export const FreePortOutputRegex = /(?:address already in use (?:0\.0\.0\.0|127\.0\.0\.1|localhost|::):|Unable to bind [^ ]*:|can't listen on port |listen EADDRINUSE [^ ]*:)(?<portNumber>\d{4,5})/;
export const GitPushOutputRegex = /git push --set-upstream origin (?<branchName>[^\s]+)/;
// The previous line starts with "Create a pull request for \'([^\s]+)\' on GitHub by visiting:\s*"
// it's safe to assume it's a github pull request if the URL includes `/pull/`
export const GitCreatePrOutputRegex = /remote:\s*(?<link>https:\/\/github\.com\/.+\/.+\/pull\/new\/.+)/;
export const PwshGeneralErrorOutputRegex = /Suggestion \[General\]:/;
export const PwshUnixCommandNotFoundErrorOutputRegex = /Suggestion \[cmd-not-found\]:/;

export const enum QuickFixSource {
	Builtin = 'builtin'
}

export function gitSimilar(): ITerminalQuickFixInternalOptions {
	return {
		id: 'Git Similar',
		type: 'internal',
		commandLineMatcher: GitCommandLineRegex,
		outputMatcher: {
			lineMatcher: GitSimilarOutputRegex,
			anchor: 'bottom',
			offset: 0,
			length: 10
		},
		commandExitResult: 'error',
		getQuickFixes: (matchResult: ITerminalCommandMatchResult) => {
			const regexMatch = matchResult.outputMatch?.regexMatch[0];
			if (!regexMatch || !matchResult.outputMatch) {
				return;
			}
			const actions: TerminalQuickFixActionInternal[] = [];
			const startIndex = matchResult.outputMatch.outputLines.findIndex(l => l.includes(regexMatch)) + 1;
			const results = matchResult.outputMatch.outputLines.map(r => r.trim());
			for (let i = startIndex; i < results.length; i++) {
				const fixedCommand = results[i];
				if (fixedCommand) {
					actions.push({
						id: 'Git Similar',
						type: TerminalQuickFixType.TerminalCommand,
						terminalCommand: matchResult.commandLine.replace(/git\s+[^\s]+/, () => `git ${fixedCommand}`),
						shouldExecute: true,
						source: QuickFixSource.Builtin
					});
				}
			}
			return actions;
		}
	};
}

export function gitFastForwardPull(): ITerminalQuickFixInternalOptions {
	return {
		id: 'Git Fast Forward Pull',
		type: 'internal',
		commandLineMatcher: GitCommandLineRegex,
		outputMatcher: {
			lineMatcher: GitFastForwardPullOutputRegex,
			anchor: 'bottom',
			offset: 0,
			length: 8
		},
		commandExitResult: 'success',
		getQuickFixes: (matchResult: ITerminalCommandMatchResult) => {
			return {
				type: TerminalQuickFixType.TerminalCommand,
				id: 'Git Fast Forward Pull',
				terminalCommand: `git pull`,
				shouldExecute: true,
				source: QuickFixSource.Builtin
			};
		}
	};
}

export function gitTwoDashes(): ITerminalQuickFixInternalOptions {
	return {
		id: 'Git Two Dashes',
		type: 'internal',
		commandLineMatcher: GitCommandLineRegex,
		outputMatcher: {
			lineMatcher: GitTwoDashesRegex,
			anchor: 'bottom',
			offset: 0,
			length: 2
		},
		commandExitResult: 'error',
		getQuickFixes: (matchResult: ITerminalCommandMatchResult) => {
			const problemArg = matchResult?.outputMatch?.regexMatch?.[1];
			if (!problemArg) {
				return;
			}
			return {
				type: TerminalQuickFixType.TerminalCommand,
				id: 'Git Two Dashes',
				terminalCommand: matchResult.commandLine.replace(` -${problemArg}`, () => ` --${problemArg}`),
				shouldExecute: true,
				source: QuickFixSource.Builtin
			};
		}
	};
}
export function freePort(runCallback: (port: string, commandLine: string) => Promise<void>): ITerminalQuickFixInternalOptions {
	return {
		id: 'Free Port',
		type: 'internal',
		commandLineMatcher: /.+/,
		outputMatcher: {
			lineMatcher: FreePortOutputRegex,
			anchor: 'bottom',
			offset: 0,
			length: 30
		},
		commandExitResult: 'error',
		getQuickFixes: (matchResult: ITerminalCommandMatchResult) => {
			const port = matchResult?.outputMatch?.regexMatch?.groups?.portNumber;
			if (!port) {
				return;
			}
			const label = localize("terminal.freePort", "Free port {0}", port);
			return {
				type: TerminalQuickFixType.Port,
				class: undefined,
				tooltip: label,
				id: 'Free Port',
				label,
				enabled: true,
				source: QuickFixSource.Builtin,
				run: () => runCallback(port, matchResult.commandLine)
			};
		}
	};
}

export function gitPushSetUpstream(): ITerminalQuickFixInternalOptions {
	return {
		id: 'Git Push Set Upstream',
		type: 'internal',
		commandLineMatcher: GitPushCommandLineRegex,
		/**
			Example output on Windows:
			8: PS C:\Users\merogge\repos\xterm.js> git push
			7: fatal: The current branch sdjfskdjfdslkjf has no upstream branch.
			6: To push the current branch and set the remote as upstream, use
			5:
			4:	git push --set-upstream origin sdjfskdjfdslkjf
			3:
			2: To have this happen automatically for branches without a tracking
			1: upstream, see 'push.autoSetupRemote' in 'git help config'.
			0:

			Example output on macOS:
			5: meganrogge@Megans-MacBook-Pro xterm.js % git push
			4: fatal: The current branch merogge/asjdkfsjdkfsdjf has no upstream branch.
			3: To push the current branch and set the remote as upstream, use
			2:
			1:	git push --set-upstream origin merogge/asjdkfsjdkfsdjf
			0:
		 */
		outputMatcher: {
			lineMatcher: GitPushOutputRegex,
			anchor: 'bottom',
			offset: 0,
			length: 8
		},
		commandExitResult: 'error',
		getQuickFixes: (matchResult: ITerminalCommandMatchResult) => {
			const matches = matchResult.outputMatch;
			const commandToRun = 'git push --set-upstream origin ${group:branchName}';
			if (!matches) {
				return;
			}
			const groups = matches.regexMatch.groups;
			if (!groups) {
				return;
			}
			const actions: TerminalQuickFixActionInternal[] = [];
			let fixedCommand = commandToRun;
			for (const [key, value] of Object.entries(groups)) {
				const varToResolve = '${group:' + `${key}` + '}';
				if (!commandToRun.includes(varToResolve)) {
					return [];
				}
				fixedCommand = fixedCommand.replaceAll(varToResolve, () => value);
			}
			if (fixedCommand) {
				actions.push({
					type: TerminalQuickFixType.TerminalCommand,
					id: 'Git Push Set Upstream',
					terminalCommand: fixedCommand,
					shouldExecute: true,
					source: QuickFixSource.Builtin
				});
				return actions;
			}
			return;
		}
	};
}

export function gitCreatePr(): ITerminalQuickFixInternalOptions {
	return {
		id: 'Git Create Pr',
		type: 'internal',
		commandLineMatcher: GitPushCommandLineRegex,
		// Example output:
		// ...
		// 10: remote:
		// 9:  remote: Create a pull request for 'my_branch' on GitHub by visiting:
		// 8:  remote:      https://github.com/microsoft/vscode/pull/new/my_branch
		// 7:  remote:
		// 6:  remote: GitHub found x vulnerabilities on microsoft/vscode's default branch (...). To find out more, visit:
		// 5:  remote:      https://github.com/microsoft/vscode/security/dependabot
		// 4:  remote:
		// 3:  To https://github.com/microsoft/vscode
		// 2:  * [new branch]              my_branch -> my_branch
		// 1:  Branch 'my_branch' set up to track remote branch 'my_branch' from 'origin'.
		// 0:
		outputMatcher: {
			lineMatcher: GitCreatePrOutputRegex,
			anchor: 'bottom',
			offset: 4,
			// ~6 should only be needed here for security alerts, but the git provider can customize
			// the text, so use 12 to be safe.
			length: 12
		},
		commandExitResult: 'success',
		getQuickFixes: (matchResult: ITerminalCommandMatchResult) => {
			const link = matchResult?.outputMatch?.regexMatch?.groups?.link?.trimEnd();
			if (!link) {
				return;
			}
			const label = localize("terminal.createPR", "Create PR {0}", link);
			return {
				id: 'Git Create Pr',
				label,
				enabled: true,
				type: TerminalQuickFixType.Opener,
				uri: URI.parse(link),
				source: QuickFixSource.Builtin
			};
		}
	};
}

export function pwshGeneralError(): ITerminalQuickFixInternalOptions {
	return {
		id: 'Pwsh General Error',
		type: 'internal',
		commandLineMatcher: /.+/,
		outputMatcher: {
			lineMatcher: PwshGeneralErrorOutputRegex,
			anchor: 'bottom',
			offset: 0,
			length: 10
		},
		commandExitResult: 'error',
		getQuickFixes: (matchResult: ITerminalCommandMatchResult) => {
			const lines = matchResult.outputMatch?.regexMatch.input?.split('\n');
			if (!lines) {
				return;
			}

			// Find the start
			let i = 0;
			let inFeedbackProvider = false;
			for (; i < lines.length; i++) {
				if (lines[i].match(PwshGeneralErrorOutputRegex)) {
					inFeedbackProvider = true;
					break;
				}
			}
			if (!inFeedbackProvider) {
				return;
			}

			const suggestions = lines[i + 1].match(/The most similar commands are: (?<values>.+)./)?.groups?.values?.split(', ');
			if (!suggestions) {
				return;
			}
			const result: ITerminalQuickFixTerminalCommandAction[] = [];
			for (const suggestion of suggestions) {
				result.push({
					id: 'Pwsh General Error',
					type: TerminalQuickFixType.TerminalCommand,
					terminalCommand: suggestion,
					source: QuickFixSource.Builtin
				});
			}
			return result;
		}
	};
}

export function pwshUnixCommandNotFoundError(): ITerminalQuickFixInternalOptions {
	return {
		id: 'Unix Command Not Found',
		type: 'internal',
		commandLineMatcher: /.+/,
		outputMatcher: {
			lineMatcher: PwshUnixCommandNotFoundErrorOutputRegex,
			anchor: 'bottom',
			offset: 0,
			length: 10
		},
		commandExitResult: 'error',
		getQuickFixes: (matchResult: ITerminalCommandMatchResult) => {
			const lines = matchResult.outputMatch?.regexMatch.input?.split('\n');
			if (!lines) {
				return;
			}

			// Find the start
			let i = 0;
			let inFeedbackProvider = false;
			for (; i < lines.length; i++) {
				if (lines[i].match(PwshUnixCommandNotFoundErrorOutputRegex)) {
					inFeedbackProvider = true;
					break;
				}
			}
			if (!inFeedbackProvider) {
				return;
			}

			// Always remove the first element as it's the "Suggestion [cmd-not-found]"" line
			const result: ITerminalQuickFixTerminalCommandAction[] = [];
			let inSuggestions = false;
			for (; i < lines.length; i++) {
				const line = lines[i].trim();
				if (line.length === 0) {
					break;
				}
				const installCommand = line.match(/You also have .+ installed, you can run '(?<command>.+)' instead./)?.groups?.command;
				if (installCommand) {
					result.push({
						id: 'Pwsh Unix Command Not Found Error',
						type: TerminalQuickFixType.TerminalCommand,
						terminalCommand: installCommand,
						source: QuickFixSource.Builtin
					});
					inSuggestions = false;
					continue;
				}
				if (line.match(/Command '.+' not found, but can be installed with:/)) {
					inSuggestions = true;
					continue;
				}
				if (inSuggestions) {
					result.push({
						id: 'Pwsh Unix Command Not Found Error',
						type: TerminalQuickFixType.TerminalCommand,
						terminalCommand: line.trim(),
						source: QuickFixSource.Builtin
					});
				}
			}
			return result;
		}
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/quickFix/browser/terminalQuickFixService.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/quickFix/browser/terminalQuickFixService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../../base/common/event.js';
import { IDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { localize } from '../../../../../nls.js';
import { ITerminalCommandSelector } from '../../../../../platform/terminal/common/terminal.js';
import { ITerminalQuickFixService, ITerminalQuickFixProvider, ITerminalQuickFixProviderSelector } from './quickFix.js';
import { isProposedApiEnabled } from '../../../../services/extensions/common/extensions.js';
import { ExtensionsRegistry } from '../../../../services/extensions/common/extensionsRegistry.js';

export class TerminalQuickFixService implements ITerminalQuickFixService {
	declare _serviceBrand: undefined;

	private _selectors: Map<string, ITerminalCommandSelector> = new Map();

	private _providers: Map<string, ITerminalQuickFixProvider> = new Map();
	get providers(): Map<string, ITerminalQuickFixProvider> { return this._providers; }

	private _pendingProviders: Map<string, ITerminalQuickFixProvider> = new Map();

	private readonly _onDidRegisterProvider = new Emitter<ITerminalQuickFixProviderSelector>();
	readonly onDidRegisterProvider = this._onDidRegisterProvider.event;
	private readonly _onDidRegisterCommandSelector = new Emitter<ITerminalCommandSelector>();
	readonly onDidRegisterCommandSelector = this._onDidRegisterCommandSelector.event;
	private readonly _onDidUnregisterProvider = new Emitter<string>();
	readonly onDidUnregisterProvider = this._onDidUnregisterProvider.event;

	readonly extensionQuickFixes: Promise<Array<ITerminalCommandSelector>>;

	constructor() {
		this.extensionQuickFixes = new Promise((r) => quickFixExtensionPoint.setHandler(fixes => {
			r(fixes.filter(c => isProposedApiEnabled(c.description, 'terminalQuickFixProvider')).map(c => {
				if (!c.value) {
					return [];
				}
				return c.value.map(fix => { return { ...fix, extensionIdentifier: c.description.identifier.value }; });
			}).flat());
		}));
		this.extensionQuickFixes.then(selectors => {
			for (const selector of selectors) {
				this.registerCommandSelector(selector);
			}
		});
	}

	registerCommandSelector(selector: ITerminalCommandSelector): void {
		this._selectors.set(selector.id, selector);
		this._onDidRegisterCommandSelector.fire(selector);

		// Check if there's a pending provider for this selector
		const pendingProvider = this._pendingProviders.get(selector.id);
		if (pendingProvider) {
			this._pendingProviders.delete(selector.id);
			this._providers.set(selector.id, pendingProvider);
			this._onDidRegisterProvider.fire({ selector, provider: pendingProvider });
		}
	}

	registerQuickFixProvider(id: string, provider: ITerminalQuickFixProvider): IDisposable {
		// This is more complicated than it looks like it should be because we need to return an
		// IDisposable synchronously but we must await ITerminalContributionService.quickFixes
		// asynchronously before actually registering the provider.
		let disposed = false;
		this.extensionQuickFixes.then(() => {
			if (disposed) {
				return;
			}
			const selector = this._selectors.get(id);
			if (selector) {
				// Selector is already available, register immediately
				this._providers.set(id, provider);
				this._onDidRegisterProvider.fire({ selector, provider });
			} else {
				// Selector not yet available, store provider as pending
				this._pendingProviders.set(id, provider);
			}
		});
		return toDisposable(() => {
			disposed = true;
			this._providers.delete(id);
			this._pendingProviders.delete(id);
			const selector = this._selectors.get(id);
			if (selector) {
				this._selectors.delete(id);
				this._onDidUnregisterProvider.fire(selector.id);
			}
		});
	}
}

const quickFixExtensionPoint = ExtensionsRegistry.registerExtensionPoint<ITerminalCommandSelector[]>({
	extensionPoint: 'terminalQuickFixes',
	defaultExtensionKind: ['workspace'],
	activationEventsGenerator: function* (terminalQuickFixes: readonly ITerminalCommandSelector[]) {
		for (const quickFixContrib of terminalQuickFixes ?? []) {
			yield `onTerminalQuickFixRequest:${quickFixContrib.id}`;
		}
	},
	jsonSchema: {
		description: localize('vscode.extension.contributes.terminalQuickFixes', 'Contributes terminal quick fixes.'),
		type: 'array',
		items: {
			type: 'object',
			additionalProperties: false,
			required: ['id', 'commandLineMatcher', 'outputMatcher', 'commandExitResult'],
			defaultSnippets: [{
				body: {
					id: '$1',
					commandLineMatcher: '$2',
					outputMatcher: '$3',
					exitStatus: '$4'
				}
			}],
			properties: {
				id: {
					description: localize('vscode.extension.contributes.terminalQuickFixes.id', "The ID of the quick fix provider"),
					type: 'string',
				},
				commandLineMatcher: {
					description: localize('vscode.extension.contributes.terminalQuickFixes.commandLineMatcher', "A regular expression or string to test the command line against"),
					type: 'string',
				},
				outputMatcher: {
					markdownDescription: localize('vscode.extension.contributes.terminalQuickFixes.outputMatcher', "A regular expression or string to match a single line of the output against, which provides groups to be referenced in terminalCommand and uri.\n\nFor example:\n\n `lineMatcher: /git push --set-upstream origin (?<branchName>[^\s]+)/;`\n\n`terminalCommand: 'git push --set-upstream origin ${group:branchName}';`\n"),
					type: 'object',
					required: ['lineMatcher', 'anchor', 'offset', 'length'],
					properties: {
						lineMatcher: {
							description: 'A regular expression or string to test the command line against',
							type: 'string'
						},
						anchor: {
							description: 'Where the search should begin in the buffer',
							enum: ['top', 'bottom']
						},
						offset: {
							description: 'The number of lines vertically from the anchor in the buffer to start matching against',
							type: 'number'
						},
						length: {
							description: 'The number of rows to match against, this should be as small as possible for performance reasons',
							type: 'number'
						}
					}
				},
				commandExitResult: {
					description: localize('vscode.extension.contributes.terminalQuickFixes.commandExitResult', "The command exit result to match on"),
					enum: ['success', 'error'],
					enumDescriptions: [
						'The command exited with an exit code of zero.',
						'The command exited with a non-zero exit code.'
					]
				},
				kind: {
					description: localize('vscode.extension.contributes.terminalQuickFixes.kind', "The kind of the resulting quick fix. This changes how the quick fix is presented. Defaults to {0}.", '`"fix"`'),
					enum: ['default', 'explain'],
					enumDescriptions: [
						'A high confidence quick fix.',
						'An explanation of the problem.'
					]
				}
			},
		}
	},
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/quickFix/browser/media/terminalQuickFix.css]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/quickFix/browser/media/terminalQuickFix.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.xterm-screen .xterm-decoration-container .xterm-decoration.quick-fix {
	z-index: 7;
}

.monaco-workbench .terminal .terminal-command-decoration.quick-fix {
	color: var(--vscode-editorLightBulb-foreground) !important;
	background-color: var(--vscode-terminal-background, var(--vscode-panel-background));
}

.monaco-workbench .editor-instance .terminal .terminal-command-decoration.quick-fix {
	background-color: var(--vscode-terminal-background, var(--vscode-editor-background));
}

.monaco-workbench .terminal .terminal-command-decoration.quick-fix.explainOnly {
	color: var(--vscode-editorLightBulbAutoFix-foreground) !important;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/quickFix/test/browser/quickFixAddon.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/quickFix/test/browser/quickFixAddon.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Terminal } from '@xterm/xterm';
import { strictEqual } from 'assert';
import { importAMDNodeModule } from '../../../../../../amdX.js';
import { IAction } from '../../../../../../base/common/actions.js';
import { Event } from '../../../../../../base/common/event.js';
import { isWindows } from '../../../../../../base/common/platform.js';
import { URI } from '../../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { TestCommandService } from '../../../../../../editor/test/browser/editorTestServices.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { ContextMenuService } from '../../../../../../platform/contextview/browser/contextMenuService.js';
import { IContextMenuService } from '../../../../../../platform/contextview/browser/contextView.js';
import { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ILabelService } from '../../../../../../platform/label/common/label.js';
import { ILogService, NullLogService } from '../../../../../../platform/log/common/log.js';
import { IOpenerService } from '../../../../../../platform/opener/common/opener.js';
import { IStorageService } from '../../../../../../platform/storage/common/storage.js';
import { ITerminalCommand, TerminalCapability } from '../../../../../../platform/terminal/common/capabilities/capabilities.js';
import { CommandDetectionCapability } from '../../../../../../platform/terminal/common/capabilities/commandDetectionCapability.js';
import { TerminalCapabilityStore } from '../../../../../../platform/terminal/common/capabilities/terminalCapabilityStore.js';
import { ITerminalOutputMatcher } from '../../../../../../platform/terminal/common/terminal.js';
import { ITerminalQuickFixService } from '../../browser/quickFix.js';
import { getQuickFixesForCommand, TerminalQuickFixAddon } from '../../browser/quickFixAddon.js';
import { freePort, FreePortOutputRegex, gitCreatePr, GitCreatePrOutputRegex, gitFastForwardPull, GitFastForwardPullOutputRegex, GitPushOutputRegex, gitPushSetUpstream, gitSimilar, GitSimilarOutputRegex, gitTwoDashes, GitTwoDashesRegex, pwshGeneralError, PwshGeneralErrorOutputRegex, pwshUnixCommandNotFoundError, PwshUnixCommandNotFoundErrorOutputRegex } from '../../browser/terminalQuickFixBuiltinActions.js';
import { TestStorageService } from '../../../../../test/common/workbenchTestServices.js';
import { generateUuid } from '../../../../../../base/common/uuid.js';

suite('QuickFixAddon', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let quickFixAddon: TerminalQuickFixAddon;
	let commandDetection: CommandDetectionCapability;
	let commandService: TestCommandService;
	let openerService: IOpenerService;
	let labelService: ILabelService;
	let terminal: Terminal;
	let instantiationService: TestInstantiationService;

	setup(async () => {
		instantiationService = store.add(new TestInstantiationService());
		const TerminalCtor = (await importAMDNodeModule<typeof import('@xterm/xterm')>('@xterm/xterm', 'lib/xterm.js')).Terminal;
		terminal = store.add(new TerminalCtor({
			allowProposedApi: true,
			cols: 80,
			rows: 30
		}));
		instantiationService.stub(IStorageService, store.add(new TestStorageService()));
		instantiationService.stub(ITerminalQuickFixService, {
			onDidRegisterProvider: Event.None,
			onDidUnregisterProvider: Event.None,
			onDidRegisterCommandSelector: Event.None,
			extensionQuickFixes: Promise.resolve([])
		} as Partial<ITerminalQuickFixService>);
		instantiationService.stub(IConfigurationService, new TestConfigurationService());
		labelService = instantiationService.stub(ILabelService, {} as Partial<ILabelService>);
		const capabilities = store.add(new TerminalCapabilityStore());
		instantiationService.stub(ILogService, new NullLogService());
		commandDetection = store.add(instantiationService.createInstance(CommandDetectionCapability, terminal));
		capabilities.add(TerminalCapability.CommandDetection, commandDetection);
		instantiationService.stub(IContextMenuService, store.add(instantiationService.createInstance(ContextMenuService)));
		openerService = instantiationService.stub(IOpenerService, {} as Partial<IOpenerService>);
		commandService = new TestCommandService(instantiationService);

		quickFixAddon = instantiationService.createInstance(TerminalQuickFixAddon, generateUuid(), [], capabilities);
		terminal.loadAddon(quickFixAddon);
	});

	suite('registerCommandFinishedListener & getMatchActions', () => {
		suite('gitSimilarCommand', () => {
			const expectedMap = new Map();
			const command = `git sttatus`;
			let output = `git: 'sttatus' is not a git command. See 'git --help'.

			The most similar command is
			status`;
			const exitCode = 1;
			const actions = [{
				id: 'Git Similar',
				enabled: true,
				label: 'Run: git status',
				tooltip: 'Run: git status',
				command: 'git status'
			}];
			const outputLines = output.split('\n');
			setup(() => {
				const command = gitSimilar();
				expectedMap.set(command.commandLineMatcher.toString(), [command]);
				quickFixAddon.registerCommandFinishedListener(command);
			});
			suite('returns undefined when', () => {
				test('output does not match', async () => {
					strictEqual(await (getQuickFixesForCommand([], terminal, createCommand(command, `invalid output`, GitSimilarOutputRegex, exitCode, [`invalid output`]), expectedMap, commandService, openerService, labelService)), undefined);
				});
				test('command does not match', async () => {
					strictEqual(await (getQuickFixesForCommand([], terminal, createCommand(`gt sttatus`, output, GitSimilarOutputRegex, exitCode, outputLines), expectedMap, commandService, openerService, labelService)), undefined);
				});
			});
			suite('returns actions when', () => {
				test('expected unix exit code', async () => {
					assertMatchOptions((await getQuickFixesForCommand([], terminal, createCommand(command, output, GitSimilarOutputRegex, exitCode, outputLines), expectedMap, commandService, openerService, labelService)), actions);
				});
				test('matching exit status', async () => {
					assertMatchOptions((await getQuickFixesForCommand([], terminal, createCommand(command, output, GitSimilarOutputRegex, 2, outputLines), expectedMap, commandService, openerService, labelService)), actions);
				});
			});
			suite('returns match', () => {
				test('returns match', async () => {
					assertMatchOptions((await getQuickFixesForCommand([], terminal, createCommand(command, output, GitSimilarOutputRegex, exitCode, outputLines), expectedMap, commandService, openerService, labelService)), actions);
				});

				test('returns multiple match', async () => {
					output = `git: 'pu' is not a git command. See 'git --help'.
				The most similar commands are
						pull
						push`;
					const actions = [{
						id: 'Git Similar',
						enabled: true,
						label: 'Run: git pull',
						tooltip: 'Run: git pull',
						command: 'git pull'
					}, {
						id: 'Git Similar',
						enabled: true,
						label: 'Run: git push',
						tooltip: 'Run: git push',
						command: 'git push'
					}];
					assertMatchOptions((await getQuickFixesForCommand([], terminal, createCommand('git pu', output, GitSimilarOutputRegex, exitCode, output.split('\n')), expectedMap, commandService, openerService, labelService)), actions);
				});
				test('passes any arguments through', async () => {
					output = `git: 'checkoutt' is not a git command. See 'git --help'.
				The most similar commands are
						checkout`;
					assertMatchOptions((await getQuickFixesForCommand([], terminal, createCommand('git checkoutt .', output, GitSimilarOutputRegex, exitCode, output.split('\n')), expectedMap, commandService, openerService, labelService)), [{
						id: 'Git Similar',
						enabled: true,
						label: 'Run: git checkout .',
						tooltip: 'Run: git checkout .',
						command: 'git checkout .'
					}]);
				});
			});
		});
		suite('gitTwoDashes', () => {
			const expectedMap = new Map();
			const command = `git add . -all`;
			const output = 'error: did you mean `--all` (with two dashes)?';
			const exitCode = 1;
			const actions = [{
				id: 'Git Two Dashes',
				enabled: true,
				label: 'Run: git add . --all',
				tooltip: 'Run: git add . --all',
				command: 'git add . --all'
			}];
			setup(() => {
				const command = gitTwoDashes();
				expectedMap.set(command.commandLineMatcher.toString(), [command]);
				quickFixAddon.registerCommandFinishedListener(command);
			});
			suite('returns undefined when', () => {
				test('output does not match', async () => {
					strictEqual((await getQuickFixesForCommand([], terminal, createCommand(command, `invalid output`, GitTwoDashesRegex, exitCode), expectedMap, commandService, openerService, labelService)), undefined);
				});
				test('command does not match', async () => {
					strictEqual((await getQuickFixesForCommand([], terminal, createCommand(`gt sttatus`, output, GitTwoDashesRegex, exitCode), expectedMap, commandService, openerService, labelService)), undefined);
				});
			});
			suite('returns actions when', () => {
				test('expected unix exit code', async () => {
					assertMatchOptions((await getQuickFixesForCommand([], terminal, createCommand(command, output, GitTwoDashesRegex, exitCode), expectedMap, commandService, openerService, labelService)), actions);
				});
				test('matching exit status', async () => {
					assertMatchOptions((await getQuickFixesForCommand([], terminal, createCommand(command, output, GitTwoDashesRegex, 2), expectedMap, commandService, openerService, labelService)), actions);
				});
			});
		});
		suite('gitFastForwardPull', () => {
			const expectedMap = new Map();
			const command = `git checkout vnext`;
			const output = 'Already on \'vnext\' \n Your branch is behind \'origin/vnext\' by 1 commit, and can be fast-forwarded.';
			const exitCode = 0;
			const actions = [{
				id: 'Git Fast Forward Pull',
				enabled: true,
				label: 'Run: git pull',
				tooltip: 'Run: git pull',
				command: 'git pull'
			}];
			setup(() => {
				const command = gitFastForwardPull();
				expectedMap.set(command.commandLineMatcher.toString(), [command]);
				quickFixAddon.registerCommandFinishedListener(command);
			});
			suite('returns undefined when', () => {
				test('output does not match', async () => {
					strictEqual((await getQuickFixesForCommand([], terminal, createCommand(command, `invalid output`, GitFastForwardPullOutputRegex, exitCode), expectedMap, commandService, openerService, labelService)), undefined);
				});
				test('command does not match', async () => {
					strictEqual((await getQuickFixesForCommand([], terminal, createCommand(`gt add`, output, GitFastForwardPullOutputRegex, exitCode), expectedMap, commandService, openerService, labelService)), undefined);
				});
				test('exit code does not match', async () => {
					strictEqual((await getQuickFixesForCommand([], terminal, createCommand(command, output, GitFastForwardPullOutputRegex, 2), expectedMap, commandService, openerService, labelService)), undefined);
				});
			});
			suite('returns actions when', () => {
				test('matching exit status, command, ouput', async () => {
					assertMatchOptions((await getQuickFixesForCommand([], terminal, createCommand(command, output, GitFastForwardPullOutputRegex, exitCode), expectedMap, commandService, openerService, labelService)), actions);
				});
			});
		});
		if (!isWindows) {
			suite('freePort', () => {
				const expectedMap = new Map();
				const portCommand = `yarn start dev`;
				const output = `yarn run v1.22.17
			warning ../../package.json: No license field
			Error: listen EADDRINUSE: address already in use 0.0.0.0:3000
				at Server.setupListenHandle [as _listen2] (node:net:1315:16)
				at listenInCluster (node:net:1363:12)
				at doListen (node:net:1501:7)
				at processTicksAndRejections (node:internal/process/task_queues:84:21)
			Emitted 'error' event on WebSocketServer instance at:
				at Server.emit (node:events:394:28)
				at emitErrorNT (node:net:1342:8)
				at processTicksAndRejections (node:internal/process/task_queues:83:21) {
			}
			error Command failed with exit code 1.
			info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.`;
				const actionOptions = [{
					id: 'Free Port',
					label: 'Free port 3000',
					run: true,
					tooltip: 'Free port 3000',
					enabled: true
				}];
				setup(() => {
					const command = freePort(() => Promise.resolve());
					expectedMap.set(command.commandLineMatcher.toString(), [command]);
					quickFixAddon.registerCommandFinishedListener(command);
				});
				suite('returns undefined when', () => {
					test('output does not match', async () => {
						strictEqual((await getQuickFixesForCommand([], terminal, createCommand(portCommand, `invalid output`, FreePortOutputRegex), expectedMap, commandService, openerService, labelService)), undefined);
					});
				});
				test('returns actions', async () => {
					assertMatchOptions((await getQuickFixesForCommand([], terminal, createCommand(portCommand, output, FreePortOutputRegex), expectedMap, commandService, openerService, labelService)), actionOptions);
				});
			});
		}

		suite('gitPushSetUpstream', () => {
			const expectedMap = new Map();
			const command = `git push`;
			const output = `fatal: The current branch test22 has no upstream branch.
			To push the current branch and set the remote as upstream, use

				git push --set-upstream origin test22`;
			const exitCode = 128;
			const actions = [{
				id: 'Git Push Set Upstream',
				enabled: true,
				label: 'Run: git push --set-upstream origin test22',
				tooltip: 'Run: git push --set-upstream origin test22',
				command: 'git push --set-upstream origin test22'
			}];
			setup(() => {
				const command = gitPushSetUpstream();
				expectedMap.set(command.commandLineMatcher.toString(), [command]);
				quickFixAddon.registerCommandFinishedListener(command);
			});
			suite('returns undefined when', () => {
				test('output does not match', async () => {
					strictEqual((await getQuickFixesForCommand([], terminal, createCommand(command, `invalid output`, GitPushOutputRegex, exitCode), expectedMap, commandService, openerService, labelService)), undefined);
				});
				test('command does not match', async () => {
					strictEqual((await getQuickFixesForCommand([], terminal, createCommand(`git status`, output, GitPushOutputRegex, exitCode), expectedMap, commandService, openerService, labelService)), undefined);
				});
			});
			suite('returns actions when', () => {
				test('expected unix exit code', async () => {
					assertMatchOptions((await getQuickFixesForCommand([], terminal, createCommand(command, output, GitPushOutputRegex, exitCode), expectedMap, commandService, openerService, labelService)), actions);
				});
				test('matching exit status', async () => {
					assertMatchOptions((await getQuickFixesForCommand([], terminal, createCommand(command, output, GitPushOutputRegex, 2), expectedMap, commandService, openerService, labelService)), actions);
				});
			});
		});
		suite('gitCreatePr', () => {
			const expectedMap = new Map();
			const command = `git push`;
			const output = `Total 0 (delta 0), reused 0 (delta 0), pack-reused 0
			remote:
			remote: Create a pull request for 'test22' on GitHub by visiting:
			remote:      https://github.com/meganrogge/xterm.js/pull/new/test22
			remote:
			To https://github.com/meganrogge/xterm.js
			 * [new branch]        test22 -> test22
			Branch 'test22' set up to track remote branch 'test22' from 'origin'. `;
			const exitCode = 0;
			const actions = [{
				id: 'Git Create Pr',
				enabled: true,
				label: 'Open: https://github.com/meganrogge/xterm.js/pull/new/test22',
				tooltip: 'Open: https://github.com/meganrogge/xterm.js/pull/new/test22',
				uri: URI.parse('https://github.com/meganrogge/xterm.js/pull/new/test22')
			}];
			setup(() => {
				const command = gitCreatePr();
				expectedMap.set(command.commandLineMatcher.toString(), [command]);
				quickFixAddon.registerCommandFinishedListener(command);
			});
			suite('returns undefined when', () => {
				test('output does not match', async () => {
					strictEqual((await getQuickFixesForCommand([], terminal, createCommand(command, `invalid output`, GitCreatePrOutputRegex, exitCode), expectedMap, commandService, openerService, labelService)), undefined);
				});
				test('command does not match', async () => {
					strictEqual((await getQuickFixesForCommand([], terminal, createCommand(`git status`, output, GitCreatePrOutputRegex, exitCode), expectedMap, commandService, openerService, labelService)), undefined);
				});
				test('failure exit status', async () => {
					strictEqual((await getQuickFixesForCommand([], terminal, createCommand(command, output, GitCreatePrOutputRegex, 2), expectedMap, commandService, openerService, labelService)), undefined);
				});
			});
			suite('returns actions when', () => {
				test('expected unix exit code', async () => {
					assertMatchOptions((await getQuickFixesForCommand([], terminal, createCommand(command, output, GitCreatePrOutputRegex, exitCode), expectedMap, commandService, openerService, labelService)), actions);
				});
			});
		});
	});
	suite('gitPush - multiple providers', () => {
		const expectedMap = new Map();
		const command = `git push`;
		const output = `fatal: The current branch test22 has no upstream branch.
		To push the current branch and set the remote as upstream, use

			git push --set-upstream origin test22`;
		const exitCode = 128;
		const actions = [{
			id: 'Git Push Set Upstream',
			enabled: true,
			label: 'Run: git push --set-upstream origin test22',
			tooltip: 'Run: git push --set-upstream origin test22',
			command: 'git push --set-upstream origin test22'
		}];
		setup(() => {
			const pushCommand = gitPushSetUpstream();
			const prCommand = gitCreatePr();
			quickFixAddon.registerCommandFinishedListener(prCommand);
			expectedMap.set(pushCommand.commandLineMatcher.toString(), [pushCommand, prCommand]);
		});
		suite('returns undefined when', () => {
			test('output does not match', async () => {
				strictEqual((await getQuickFixesForCommand([], terminal, createCommand(command, `invalid output`, GitPushOutputRegex, exitCode), expectedMap, commandService, openerService, labelService)), undefined);
			});
			test('command does not match', async () => {
				strictEqual((await getQuickFixesForCommand([], terminal, createCommand(`git status`, output, GitPushOutputRegex, exitCode), expectedMap, commandService, openerService, labelService)), undefined);
			});
		});
		suite('returns actions when', () => {
			test('expected unix exit code', async () => {
				assertMatchOptions((await getQuickFixesForCommand([], terminal, createCommand(command, output, GitPushOutputRegex, exitCode), expectedMap, commandService, openerService, labelService)), actions);
			});
			test('matching exit status', async () => {
				assertMatchOptions((await getQuickFixesForCommand([], terminal, createCommand(command, output, GitPushOutputRegex, 2), expectedMap, commandService, openerService, labelService)), actions);
			});
		});
	});
	suite('pwsh feedback providers', () => {
		suite('General', () => {
			const expectedMap = new Map();
			const command = `not important`;
			const output = [
				`...`,
				``,
				`Suggestion [General]:`,
				`  The most similar commands are: python3, python3m, pamon, python3.6, rtmon, echo, pushd, etsn, pwsh, pwconv.`,
				``,
				`Suggestion [cmd-not-found]:`,
				`  Command 'python' not found, but can be installed with:`,
				`  sudo apt install python3`,
				`  sudo apt install python`,
				`  sudo apt install python-minimal`,
				`  You also have python3 installed, you can run 'python3' instead.'`,
				``,
			].join('\n');
			const exitCode = 128;
			const actions = [
				'python3',
				'python3m',
				'pamon',
				'python3.6',
				'rtmon',
				'echo',
				'pushd',
				'etsn',
				'pwsh',
				'pwconv',
			].map(command => {
				return {
					id: 'Pwsh General Error',
					enabled: true,
					label: `Run: ${command}`,
					tooltip: `Run: ${command}`,
					command: command
				};
			});
			setup(() => {
				const pushCommand = pwshGeneralError();
				quickFixAddon.registerCommandFinishedListener(pushCommand);
				expectedMap.set(pushCommand.commandLineMatcher.toString(), [pushCommand]);
			});
			test('returns undefined when output does not match', async () => {
				strictEqual((await getQuickFixesForCommand([], terminal, createCommand(command, `invalid output`, PwshGeneralErrorOutputRegex, exitCode), expectedMap, commandService, openerService, labelService)), undefined);
			});
			test('returns actions when output matches', async () => {
				assertMatchOptions((await getQuickFixesForCommand([], terminal, createCommand(command, output, PwshGeneralErrorOutputRegex, exitCode), expectedMap, commandService, openerService, labelService)), actions);
			});
		});
		suite('Unix cmd-not-found', () => {
			const expectedMap = new Map();
			const command = `not important`;
			const output = [
				`...`,
				``,
				`Suggestion [General]`,
				`  The most similar commands are: python3, python3m, pamon, python3.6, rtmon, echo, pushd, etsn, pwsh, pwconv.`,
				``,
				`Suggestion [cmd-not-found]:`,
				`  Command 'python' not found, but can be installed with:`,
				`  sudo apt install python3`,
				`  sudo apt install python`,
				`  sudo apt install python-minimal`,
				`  You also have python3 installed, you can run 'python3' instead.'`,
				``,
			].join('\n');
			const exitCode = 128;
			const actions = [
				'sudo apt install python3',
				'sudo apt install python',
				'sudo apt install python-minimal',
				'python3',
			].map(command => {
				return {
					id: 'Pwsh Unix Command Not Found Error',
					enabled: true,
					label: `Run: ${command}`,
					tooltip: `Run: ${command}`,
					command: command
				};
			});
			setup(() => {
				const pushCommand = pwshUnixCommandNotFoundError();
				quickFixAddon.registerCommandFinishedListener(pushCommand);
				expectedMap.set(pushCommand.commandLineMatcher.toString(), [pushCommand]);
			});
			test('returns undefined when output does not match', async () => {
				strictEqual((await getQuickFixesForCommand([], terminal, createCommand(command, `invalid output`, PwshUnixCommandNotFoundErrorOutputRegex, exitCode), expectedMap, commandService, openerService, labelService)), undefined);
			});
			test('returns actions when output matches', async () => {
				assertMatchOptions((await getQuickFixesForCommand([], terminal, createCommand(command, output, PwshUnixCommandNotFoundErrorOutputRegex, exitCode), expectedMap, commandService, openerService, labelService)), actions);
			});
		});
	});
});

function createCommand(command: string, output: string, outputMatcher?: RegExp | string, exitCode?: number, outputLines?: string[]): ITerminalCommand {
	return {
		cwd: '',
		commandStartLineContent: '',
		markProperties: {},
		executedX: undefined,
		startX: undefined,
		command,
		isTrusted: true,
		exitCode,
		getOutput: () => { return output; },
		getOutputMatch: (_matcher: ITerminalOutputMatcher) => {
			if (outputMatcher) {
				const regexMatch = output.match(outputMatcher) ?? undefined;
				if (regexMatch) {
					return outputLines ? { regexMatch, outputLines } : { regexMatch, outputLines: [] };
				}
			}
			return undefined;
		},
		timestamp: Date.now(),
		hasOutput: () => !!output
	} as ITerminalCommand;
}

type TestAction = Pick<IAction, 'id' | 'label' | 'tooltip' | 'enabled'> & { command?: string; uri?: URI };
function assertMatchOptions(actual: TestAction[] | undefined, expected: TestAction[]): void {
	strictEqual(actual?.length, expected.length);
	for (let i = 0; i < expected.length; i++) {
		const expectedItem = expected[i];
		const actualItem: any = actual[i];
		strictEqual(actualItem.id, expectedItem.id, `ID`);
		strictEqual(actualItem.enabled, expectedItem.enabled, `enabled`);
		strictEqual(actualItem.label, expectedItem.label, `label`);
		strictEqual(actualItem.tooltip, expectedItem.tooltip, `tooltip`);
		if (expectedItem.command) {
			strictEqual(actualItem.command, expectedItem.command);
		}
		if (expectedItem.uri) {
			strictEqual(actualItem.uri!.toString(), expectedItem.uri.toString());
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/sendSequence/browser/terminal.sendSequence.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/sendSequence/browser/terminal.sendSequence.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { Schemas } from '../../../../../base/common/network.js';
import { isIOS, isMacintosh, isWindows } from '../../../../../base/common/platform.js';
import { isObject, isString } from '../../../../../base/common/types.js';
import { localize, localize2 } from '../../../../../nls.js';
import { CONTEXT_ACCESSIBILITY_MODE_ENABLED } from '../../../../../platform/accessibility/common/accessibility.js';
import { ContextKeyExpr, type ContextKeyExpression } from '../../../../../platform/contextkey/common/contextkey.js';
import type { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingsRegistry, KeybindingWeight, type IKeybindings } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';
import { GeneralShellType, WindowsShellType } from '../../../../../platform/terminal/common/terminal.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { IConfigurationResolverService } from '../../../../services/configurationResolver/common/configurationResolver.js';
import { IHistoryService } from '../../../../services/history/common/history.js';
import { ITerminalService } from '../../../terminal/browser/terminal.js';
import { registerTerminalAction } from '../../../terminal/browser/terminalActions.js';
import { TerminalContextKeys, TerminalContextKeyStrings } from '../../../terminal/common/terminalContextKey.js';

export const enum TerminalSendSequenceCommandId {
	SendSequence = 'workbench.action.terminal.sendSequence',
}

function toOptionalString(obj: unknown): string | undefined {
	return isString(obj) ? obj : undefined;
}

export const terminalSendSequenceCommand = async (accessor: ServicesAccessor, args: unknown) => {
	const quickInputService = accessor.get(IQuickInputService);
	const configurationResolverService = accessor.get(IConfigurationResolverService);
	const workspaceContextService = accessor.get(IWorkspaceContextService);
	const historyService = accessor.get(IHistoryService);
	const terminalService = accessor.get(ITerminalService);

	const instance = terminalService.activeInstance;
	if (instance) {
		function isTextArg(obj: unknown): obj is { text: string } {
			return isObject(obj) && 'text' in obj;
		}
		let text = isTextArg(args) ? toOptionalString(args.text) : undefined;

		// If no text provided, prompt user for input and process special characters
		if (!text) {
			text = await quickInputService.input({
				value: '',
				placeHolder: 'Enter sequence to send (supports \\n, \\r, \\xAB)',
				prompt: localize('workbench.action.terminal.sendSequence.prompt', "Enter sequence to send to the terminal"),
			});
			if (!text) {
				return;
			}
			// Process escape sequences
			let processedText = text
				.replace(/\\n/g, '\n')
				.replace(/\\r/g, '\r');

			// Process hex escape sequences (\xNN)
			while (true) {
				const match = processedText.match(/\\x([0-9a-fA-F]{2})/);
				if (match === null || match.index === undefined || match.length < 2) {
					break;
				}
				processedText = processedText.slice(0, match.index) + String.fromCharCode(parseInt(match[1], 16)) + processedText.slice(match.index + 4);
			}

			text = processedText;
		}

		const activeWorkspaceRootUri = historyService.getLastActiveWorkspaceRoot(instance.hasRemoteAuthority ? Schemas.vscodeRemote : Schemas.file);
		const lastActiveWorkspaceRoot = activeWorkspaceRootUri ? workspaceContextService.getWorkspaceFolder(activeWorkspaceRootUri) ?? undefined : undefined;
		const resolvedText = await configurationResolverService.resolveAsync(lastActiveWorkspaceRoot, text);
		instance.sendText(resolvedText, false);
	}
};

const sendSequenceString = localize2('sendSequence', "Send Sequence");
registerTerminalAction({
	id: TerminalSendSequenceCommandId.SendSequence,
	title: sendSequenceString,
	f1: true,
	metadata: {
		description: sendSequenceString.value,
		args: [{
			name: 'args',
			schema: {
				type: 'object',
				required: ['text'],
				properties: {
					text: {
						description: localize('sendSequence.text.desc', "The sequence of text to send to the terminal"),
						type: 'string'
					}
				},
			}
		}]
	},
	run: (c, accessor, args) => terminalSendSequenceCommand(accessor, args)
});

export function registerSendSequenceKeybinding(text: string, rule: { when?: ContextKeyExpression } & IKeybindings): void {
	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: TerminalSendSequenceCommandId.SendSequence,
		weight: KeybindingWeight.WorkbenchContrib,
		when: rule.when || TerminalContextKeys.focus,
		primary: rule.primary,
		mac: rule.mac,
		linux: rule.linux,
		win: rule.win,
		handler: terminalSendSequenceCommand,
		args: { text }
	});
}



const enum Constants {
	/** The text representation of `^<letter>` is `'A'.charCodeAt(0) + 1`. */
	CtrlLetterOffset = 64
}

// An extra Windows-only ctrl+v keybinding is used for pwsh that sends ctrl+v directly to the
// shell, this gets handled by PSReadLine which properly handles multi-line pastes. This is
// disabled in accessibility mode as PowerShell does not run PSReadLine when it detects a screen
// reader. This works even when clipboard.readText is not supported.
if (isWindows) {
	registerSendSequenceKeybinding(String.fromCharCode('V'.charCodeAt(0) - Constants.CtrlLetterOffset), { // ctrl+v
		when: ContextKeyExpr.and(TerminalContextKeys.focus, ContextKeyExpr.equals(TerminalContextKeyStrings.ShellType, GeneralShellType.PowerShell), CONTEXT_ACCESSIBILITY_MODE_ENABLED.negate()),
		primary: KeyMod.CtrlCmd | KeyCode.KeyV
	});
}

// Map certain keybindings in pwsh to unused keys which get handled by PSReadLine handlers in the
// shell integration script. This allows keystrokes that cannot be sent via VT sequences to work.
// See https://github.com/microsoft/terminal/issues/879#issuecomment-497775007
registerSendSequenceKeybinding('\x1b[24~a', { // F12,a -> ctrl+space (MenuComplete)
	when: ContextKeyExpr.and(TerminalContextKeys.focus, ContextKeyExpr.equals(TerminalContextKeyStrings.ShellType, GeneralShellType.PowerShell), TerminalContextKeys.terminalShellIntegrationEnabled, CONTEXT_ACCESSIBILITY_MODE_ENABLED.negate()),
	primary: KeyMod.CtrlCmd | KeyCode.Space,
	mac: { primary: KeyMod.WinCtrl | KeyCode.Space }
});
registerSendSequenceKeybinding('\x1b[24~b', { // F12,b -> alt+space (SetMark)
	when: ContextKeyExpr.and(TerminalContextKeys.focus, ContextKeyExpr.equals(TerminalContextKeyStrings.ShellType, GeneralShellType.PowerShell), TerminalContextKeys.terminalShellIntegrationEnabled, CONTEXT_ACCESSIBILITY_MODE_ENABLED.negate()),
	primary: KeyMod.Alt | KeyCode.Space
});
registerSendSequenceKeybinding('\x1b[24~c', { // F12,c -> shift+enter (AddLine)
	when: ContextKeyExpr.and(TerminalContextKeys.focus, ContextKeyExpr.equals(TerminalContextKeyStrings.ShellType, GeneralShellType.PowerShell), TerminalContextKeys.terminalShellIntegrationEnabled, CONTEXT_ACCESSIBILITY_MODE_ENABLED.negate()),
	primary: KeyMod.Shift | KeyCode.Enter
});
registerSendSequenceKeybinding('\x1b[24~d', { // F12,d -> shift+end (SelectLine) - HACK: \x1b[1;2F is supposed to work but it doesn't
	when: ContextKeyExpr.and(TerminalContextKeys.focus, ContextKeyExpr.equals(TerminalContextKeyStrings.ShellType, GeneralShellType.PowerShell), TerminalContextKeys.terminalShellIntegrationEnabled, CONTEXT_ACCESSIBILITY_MODE_ENABLED.negate()),
	mac: { primary: KeyMod.Shift | KeyMod.CtrlCmd | KeyCode.RightArrow }
});

// Always on pwsh keybindings
registerSendSequenceKeybinding('\x1b[1;2H', { // Shift+home
	when: ContextKeyExpr.and(TerminalContextKeys.focus, ContextKeyExpr.equals(TerminalContextKeyStrings.ShellType, GeneralShellType.PowerShell)),
	mac: { primary: KeyMod.Shift | KeyMod.CtrlCmd | KeyCode.LeftArrow }
});

// Map alt+arrow to ctrl+arrow to allow word navigation in most shells to just work with alt. This
// is non-standard behavior, but a lot of terminals act like this (see
// https://github.com/microsoft/vscode/issues/190629). Note that macOS uses different sequences here
// to get the desired behavior.
registerSendSequenceKeybinding('\x1b[1;5A', {
	when: ContextKeyExpr.and(TerminalContextKeys.focus),
	primary: KeyMod.Alt | KeyCode.UpArrow
});
registerSendSequenceKeybinding('\x1b[1;5B', {
	when: ContextKeyExpr.and(TerminalContextKeys.focus),
	primary: KeyMod.Alt | KeyCode.DownArrow
});
registerSendSequenceKeybinding('\x1b' + (isMacintosh ? 'f' : '[1;5C'), {
	when: ContextKeyExpr.and(TerminalContextKeys.focus),
	primary: KeyMod.Alt | KeyCode.RightArrow
});
registerSendSequenceKeybinding('\x1b' + (isMacintosh ? 'b' : '[1;5D'), {
	when: ContextKeyExpr.and(TerminalContextKeys.focus),
	primary: KeyMod.Alt | KeyCode.LeftArrow
});

// Map ctrl+alt+r -> ctrl+r when in accessibility mode due to default run recent command keybinding
registerSendSequenceKeybinding('\x12', {
	when: ContextKeyExpr.and(TerminalContextKeys.focus, CONTEXT_ACCESSIBILITY_MODE_ENABLED),
	primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyR,
	mac: { primary: KeyMod.WinCtrl | KeyMod.Alt | KeyCode.KeyR }
});

// Map ctrl+alt+g -> ctrl+g due to default go to recent directory keybinding
registerSendSequenceKeybinding('\x07', {
	when: TerminalContextKeys.focus,
	primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyG,
	mac: { primary: KeyMod.WinCtrl | KeyMod.Alt | KeyCode.KeyG }
});

// send ctrl+c to the iPad when the terminal is focused and ctrl+c is pressed to kill the process (work around for #114009)
if (isIOS) {
	registerSendSequenceKeybinding(String.fromCharCode('C'.charCodeAt(0) - Constants.CtrlLetterOffset), { // ctrl+c
		when: ContextKeyExpr.and(TerminalContextKeys.focus),
		primary: KeyMod.WinCtrl | KeyCode.KeyC
	});
}

// Delete word left: ctrl+w
registerSendSequenceKeybinding(String.fromCharCode('W'.charCodeAt(0) - Constants.CtrlLetterOffset), {
	primary: KeyMod.CtrlCmd | KeyCode.Backspace,
	mac: { primary: KeyMod.Alt | KeyCode.Backspace }
});
if (isWindows) {
	// Delete word left: ctrl+h
	// Windows cmd.exe requires ^H to delete full word left
	registerSendSequenceKeybinding(String.fromCharCode('H'.charCodeAt(0) - Constants.CtrlLetterOffset), {
		when: ContextKeyExpr.and(TerminalContextKeys.focus, ContextKeyExpr.equals(TerminalContextKeyStrings.ShellType, WindowsShellType.CommandPrompt)),
		primary: KeyMod.CtrlCmd | KeyCode.Backspace,
	});
}
// Delete word right: alt+d [27, 100]
registerSendSequenceKeybinding('\u001bd', {
	primary: KeyMod.CtrlCmd | KeyCode.Delete,
	mac: { primary: KeyMod.Alt | KeyCode.Delete }
});
// Delete to line start: ctrl+u
registerSendSequenceKeybinding('\u0015', {
	mac: { primary: KeyMod.CtrlCmd | KeyCode.Backspace }
});
// Move to line start: ctrl+A
registerSendSequenceKeybinding(String.fromCharCode('A'.charCodeAt(0) - 64), {
	mac: { primary: KeyMod.CtrlCmd | KeyCode.LeftArrow }
});
// Move to line end: ctrl+E
registerSendSequenceKeybinding(String.fromCharCode('E'.charCodeAt(0) - 64), {
	mac: { primary: KeyMod.CtrlCmd | KeyCode.RightArrow }
});
// NUL: ctrl+shift+2
registerSendSequenceKeybinding('\u0000', {
	primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Digit2,
	mac: { primary: KeyMod.WinCtrl | KeyMod.Shift | KeyCode.Digit2 }
});
// RS: ctrl+shift+6
registerSendSequenceKeybinding('\u001e', {
	primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Digit6,
	mac: { primary: KeyMod.WinCtrl | KeyMod.Shift | KeyCode.Digit6 }
});
// US (Undo): ctrl+/
registerSendSequenceKeybinding('\u001f', {
	primary: KeyMod.CtrlCmd | KeyCode.Slash,
	mac: { primary: KeyMod.WinCtrl | KeyCode.Slash }
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/sendSignal/browser/terminal.sendSignal.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/sendSignal/browser/terminal.sendSignal.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isWindows } from '../../../../../base/common/platform.js';
import { isObject, isString } from '../../../../../base/common/types.js';
import { localize, localize2 } from '../../../../../nls.js';
import { IQuickInputService, type QuickPickItem } from '../../../../../platform/quickinput/common/quickInput.js';
import { registerTerminalAction } from '../../../terminal/browser/terminalActions.js';

export const enum TerminalSendSignalCommandId {
	SendSignal = 'workbench.action.terminal.sendSignal',
}

function toOptionalString(obj: unknown): string | undefined {
	return isString(obj) ? obj : undefined;
}

const sendSignalString = localize2('sendSignal', "Send Signal");
registerTerminalAction({
	id: TerminalSendSignalCommandId.SendSignal,
	title: sendSignalString,
	f1: !isWindows,
	metadata: {
		description: sendSignalString.value,
		args: [{
			name: 'args',
			schema: {
				type: 'object',
				required: ['signal'],
				properties: {
					signal: {
						description: localize('sendSignal.signal.desc', "The signal to send to the terminal process (e.g., 'SIGTERM', 'SIGINT', 'SIGKILL')"),
						type: 'string'
					}
				},
			}
		}]
	},
	run: async (c, accessor, args) => {
		const quickInputService = accessor.get(IQuickInputService);
		const instance = c.service.activeInstance;
		if (!instance) {
			return;
		}

		function isSignalArg(obj: unknown): obj is { signal: string } {
			return isObject(obj) && 'signal' in obj;
		}
		let signal = isSignalArg(args) ? toOptionalString(args.signal) : undefined;

		if (!signal) {
			const signalOptions: QuickPickItem[] = [
				{ label: 'SIGINT', description: localize('SIGINT', 'Interrupt process (Ctrl+C)') },
				{ label: 'SIGTERM', description: localize('SIGTERM', 'Terminate process gracefully') },
				{ label: 'SIGKILL', description: localize('SIGKILL', 'Force kill process') },
				{ label: 'SIGSTOP', description: localize('SIGSTOP', 'Stop process') },
				{ label: 'SIGCONT', description: localize('SIGCONT', 'Continue process') },
				{ label: 'SIGHUP', description: localize('SIGHUP', 'Hangup') },
				{ label: 'SIGQUIT', description: localize('SIGQUIT', 'Quit process') },
				{ label: 'SIGUSR1', description: localize('SIGUSR1', 'User-defined signal 1') },
				{ label: 'SIGUSR2', description: localize('SIGUSR2', 'User-defined signal 2') },
				{ type: 'separator' },
				{ label: localize('manualSignal', 'Manually enter signal') }
			];

			const selected = await quickInputService.pick(signalOptions, {
				placeHolder: localize('selectSignal', 'Select signal to send to terminal process')
			});

			if (!selected) {
				return;
			}

			if (selected.label === localize('manualSignal', 'Manually enter signal')) {
				const inputSignal = await quickInputService.input({
					prompt: localize('enterSignal', 'Enter signal name (e.g., SIGTERM, SIGKILL)'),
				});

				if (!inputSignal) {
					return;
				}

				signal = inputSignal;
			} else {
				signal = selected.label;
			}
		}

		await instance.sendSignal(signal);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/stickyScroll/browser/terminal.stickyScroll.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/stickyScroll/browser/terminal.stickyScroll.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/stickyScroll.css';
import { localize, localize2 } from '../../../../../nls.js';
import { MenuId } from '../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { registerTerminalAction } from '../../../terminal/browser/terminalActions.js';
import { registerTerminalContribution } from '../../../terminal/browser/terminalExtensions.js';
import { TerminalStickyScrollContribution } from './terminalStickyScrollContribution.js';
import { TerminalStickyScrollSettingId } from '../common/terminalStickyScrollConfiguration.js';

// #region Terminal Contributions

registerTerminalContribution(TerminalStickyScrollContribution.ID, TerminalStickyScrollContribution);

// #endregion

// #region Actions

const enum TerminalStickyScrollCommandId {
	ToggleStickyScroll = 'workbench.action.terminal.toggleStickyScroll',
}

registerTerminalAction({
	id: TerminalStickyScrollCommandId.ToggleStickyScroll,
	title: localize2('workbench.action.terminal.toggleStickyScroll', 'Toggle Sticky Scroll'),
	toggled: {
		condition: ContextKeyExpr.equals(`config.${TerminalStickyScrollSettingId.Enabled}`, true),
		title: localize('stickyScroll', "Sticky Scroll"),
		mnemonicTitle: localize({ key: 'miStickyScroll', comment: ['&& denotes a mnemonic'] }, "&&Sticky Scroll"),
	},
	run: (c, accessor) => {
		const configurationService = accessor.get(IConfigurationService);
		const newValue = !configurationService.getValue(TerminalStickyScrollSettingId.Enabled);
		return configurationService.updateValue(TerminalStickyScrollSettingId.Enabled, newValue);
	},
	menu: [
		{ id: MenuId.TerminalStickyScrollContext }
	]
});

// #endregion

// #region Colors

import './terminalStickyScrollColorRegistry.js';

// #endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/stickyScroll/browser/terminalStickyScrollColorRegistry.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/stickyScroll/browser/terminalStickyScrollColorRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../../nls.js';
import { registerColor } from '../../../../../platform/theme/common/colorUtils.js';

export const terminalStickyScrollBackground = registerColor('terminalStickyScroll.background', null, localize('terminalStickyScroll.background', 'The background color of the sticky scroll overlay in the terminal.'));

export const terminalStickyScrollHoverBackground = registerColor('terminalStickyScrollHover.background', {
	dark: '#2A2D2E',
	light: '#F0F0F0',
	hcDark: '#E48B39',
	hcLight: '#0f4a85'
}, localize('terminalStickyScrollHover.background', 'The background color of the sticky scroll overlay in the terminal when hovered.'));

registerColor('terminalStickyScroll.border', {
	dark: null,
	light: null,
	hcDark: '#6fc3df',
	hcLight: '#0f4a85'
}, localize('terminalStickyScroll.border', 'The border of the sticky scroll overlay in the terminal.'));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/stickyScroll/browser/terminalStickyScrollContribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/stickyScroll/browser/terminalStickyScrollContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Terminal as RawXtermTerminal } from '@xterm/xterm';
import { Event } from '../../../../../base/common/event.js';
import { Disposable, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { TerminalCapability } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { ITerminalContribution, ITerminalInstance, IXtermTerminal } from '../../../terminal/browser/terminal.js';
import type { ITerminalContributionContext } from '../../../terminal/browser/terminalExtensions.js';
import { TerminalInstance, TerminalInstanceColorProvider } from '../../../terminal/browser/terminalInstance.js';
import { TerminalStickyScrollSettingId } from '../common/terminalStickyScrollConfiguration.js';
import './media/stickyScroll.css';
import { TerminalStickyScrollOverlay } from './terminalStickyScrollOverlay.js';

export class TerminalStickyScrollContribution extends Disposable implements ITerminalContribution {
	static readonly ID = 'terminal.stickyScroll';

	static get(instance: ITerminalInstance): TerminalStickyScrollContribution | null {
		return instance.getContribution<TerminalStickyScrollContribution>(TerminalStickyScrollContribution.ID);
	}

	private _xterm?: IXtermTerminal & { raw: RawXtermTerminal };

	private readonly _overlay = this._register(new MutableDisposable<TerminalStickyScrollOverlay>());

	private readonly _enableListeners = this._register(new MutableDisposable());
	private readonly _disableListeners = this._register(new MutableDisposable());
	private readonly _richCommandDetectionListeners = this._register(new MutableDisposable());

	constructor(
		private readonly _ctx: ITerminalContributionContext,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
	) {
		super();

		this._register(Event.runAndSubscribe(this._configurationService.onDidChangeConfiguration, e => {
			if (!e || e.affectsConfiguration(TerminalStickyScrollSettingId.Enabled)) {
				this._refreshState();
			}
		}));
	}

	xtermReady(xterm: IXtermTerminal & { raw: RawXtermTerminal }): void {
		this._xterm = xterm;
		this._refreshState();
	}

	xtermOpen(xterm: IXtermTerminal & { raw: RawXtermTerminal }): void {
		this._refreshState();
	}

	hideLock() {
		this._overlay.value?.lockHide();
	}

	hideUnlock() {
		this._overlay.value?.unlockHide();
	}

	private _refreshState(): void {
		if (this._overlay.value) {
			this._tryDisable();
		} else {
			this._tryEnable();
		}

		if (this._overlay.value) {
			this._enableListeners.clear();
			if (!this._disableListeners.value) {
				this._disableListeners.value = this._ctx.instance.capabilities.onDidRemoveCapability(e => {
					if (e.id === TerminalCapability.CommandDetection) {
						this._refreshState();
					}
				});
			}
		} else {
			this._disableListeners.clear();
			if (!this._enableListeners.value) {
				this._enableListeners.value = this._ctx.instance.capabilities.onDidAddCapability(e => {
					if (e.id === TerminalCapability.CommandDetection) {
						this._refreshState();
					}
				});
			}
		}
	}

	private _tryEnable(): void {
		const capability = this._ctx.instance.capabilities.get(TerminalCapability.CommandDetection);
		if (this._shouldBeEnabled()) {
			const xtermCtorEventually = TerminalInstance.getXtermConstructor(this._keybindingService, this._contextKeyService);
			this._overlay.value = this._instantiationService.createInstance(
				TerminalStickyScrollOverlay,
				this._ctx.instance,
				this._xterm!,
				this._instantiationService.createInstance(TerminalInstanceColorProvider, this._ctx.instance.targetRef),
				capability!,
				xtermCtorEventually
			);
			this._richCommandDetectionListeners.clear();
		} else if (capability && !capability.hasRichCommandDetection) {
			this._richCommandDetectionListeners.value = capability.onSetRichCommandDetection(() => {
				this._refreshState();
			});
		} else {
			// No or Rich shell integration does not need listener
			this._richCommandDetectionListeners.clear();
		}
	}

	private _tryDisable(): void {
		if (!this._shouldBeEnabled()) {
			this._overlay.clear();
			this._richCommandDetectionListeners.clear();
		}
	}

	private _shouldBeEnabled(): boolean {
		const capability = this._ctx.instance.capabilities.get(TerminalCapability.CommandDetection);
		const result = !!(this._configurationService.getValue(TerminalStickyScrollSettingId.Enabled) && capability && capability.hasRichCommandDetection && this._xterm?.raw?.element);
		return result;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/stickyScroll/browser/terminalStickyScrollOverlay.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/stickyScroll/browser/terminalStickyScrollOverlay.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { SerializeAddon as SerializeAddonType } from '@xterm/addon-serialize';
import type { WebglAddon as WebglAddonType } from '@xterm/addon-webgl';
import type { LigaturesAddon as LigaturesAddonType } from '@xterm/addon-ligatures';
import type { IBufferLine, IMarker, ITerminalOptions, ITheme, Terminal as RawXtermTerminal, Terminal as XTermTerminal } from '@xterm/xterm';
import { $, addDisposableListener, addStandardDisposableListener, getWindow } from '../../../../../base/browser/dom.js';
import { debounce, throttle } from '../../../../../base/common/decorators.js';
import { Event } from '../../../../../base/common/event.js';
import { Disposable, MutableDisposable, combinedDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { removeAnsiEscapeCodes } from '../../../../../base/common/strings.js';
import './media/stickyScroll.css';
import { localize } from '../../../../../nls.js';
import { IMenu, IMenuService, MenuId } from '../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { ICommandDetectionCapability, ITerminalCommand } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { ICurrentPartialCommand, isFullTerminalCommand } from '../../../../../platform/terminal/common/capabilities/commandDetection/terminalCommand.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { ITerminalConfigurationService, ITerminalInstance, IXtermColorProvider, IXtermTerminal } from '../../../terminal/browser/terminal.js';
import { openContextMenu } from '../../../terminal/browser/terminalContextMenu.js';
import { IXtermCore } from '../../../terminal/browser/xterm-private.js';
import { TERMINAL_CONFIG_SECTION, TerminalCommandId } from '../../../terminal/common/terminal.js';
import { terminalStrings } from '../../../terminal/common/terminalStrings.js';
import { TerminalStickyScrollSettingId } from '../common/terminalStickyScrollConfiguration.js';
import { terminalStickyScrollBackground, terminalStickyScrollHoverBackground } from './terminalStickyScrollColorRegistry.js';
import { XtermAddonImporter } from '../../../terminal/browser/xterm/xtermAddonImporter.js';

const enum OverlayState {
	/** Initial state/disabled by the alt buffer. */
	Off = 0,
	On = 1
}

const enum CssClasses {
	Visible = 'visible'
}

const enum Constants {
	StickyScrollPercentageCap = 0.4
}

export class TerminalStickyScrollOverlay extends Disposable {
	private _stickyScrollOverlay?: RawXtermTerminal;

	private readonly _xtermAddonLoader = new XtermAddonImporter();
	private _serializeAddon?: SerializeAddonType;
	private _webglAddon?: WebglAddonType;
	private _ligaturesAddon?: LigaturesAddonType;

	private _element?: HTMLElement;
	private _currentStickyCommand?: ITerminalCommand | ICurrentPartialCommand;
	private _currentContent?: string;
	private _contextMenu: IMenu;

	private readonly _refreshListeners = this._register(new MutableDisposable());

	private _state: OverlayState = OverlayState.Off;
	private _isRefreshQueued = false;
	private _rawMaxLineCount: number = 5;
	private _pendingShowOperation = false;

	constructor(
		private readonly _instance: ITerminalInstance,
		private readonly _xterm: IXtermTerminal & { raw: RawXtermTerminal },
		private readonly _xtermColorProvider: IXtermColorProvider,
		private readonly _commandDetection: ICommandDetectionCapability,
		xtermCtor: Promise<typeof XTermTerminal>,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IContextMenuService private readonly _contextMenuService: IContextMenuService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@IMenuService menuService: IMenuService,
		@ITerminalConfigurationService private readonly _terminalConfigurationService: ITerminalConfigurationService,
		@IThemeService private readonly _themeService: IThemeService,
	) {
		super();

		this._contextMenu = this._register(menuService.createMenu(MenuId.TerminalStickyScrollContext, contextKeyService));

		// Only show sticky scroll in the normal buffer
		this._register(Event.runAndSubscribe(this._xterm.raw.buffer.onBufferChange, buffer => {
			this._setState((buffer ?? this._xterm.raw.buffer.active).type === 'normal' ? OverlayState.On : OverlayState.Off);
		}));

		// React to configuration changes
		this._register(Event.runAndSubscribe(configurationService.onDidChangeConfiguration, e => {
			if (!e || e.affectsConfiguration(TerminalStickyScrollSettingId.MaxLineCount)) {
				this._rawMaxLineCount = configurationService.getValue(TerminalStickyScrollSettingId.MaxLineCount);
			}
		}));

		// React to terminal location changes
		this._register(this._instance.onDidChangeTarget(() => this._syncOptions()));

		// Eagerly create the overlay
		xtermCtor.then(ctor => {
			if (this._store.isDisposed) {
				return;
			}
			this._stickyScrollOverlay = this._register(new ctor({
				rows: 1,
				cols: this._xterm.raw.cols,
				allowProposedApi: true,
				...this._getOptions()
			}));
			this._refreshGpuAcceleration();

			this._register(configurationService.onDidChangeConfiguration(e => {
				if (e.affectsConfiguration(TERMINAL_CONFIG_SECTION)) {
					this._syncOptions();
				}
			}));
			this._register(this._themeService.onDidColorThemeChange(() => {
				this._syncOptions();
			}));
			this._register(this._xterm.raw.onResize(() => {
				this._syncOptions();
				this._refresh();
			}));
			this._register(this._instance.onDidChangeVisibility(isVisible => {
				if (isVisible) {
					this._refresh();
				}
			}));

			this._xtermAddonLoader.importAddon('serialize').then(SerializeAddon => {
				if (this._store.isDisposed) {
					return;
				}
				this._serializeAddon = this._register(new SerializeAddon());
				this._xterm.raw.loadAddon(this._serializeAddon);
				// Trigger a render as the serialize addon is required to render
				this._refresh();
			});
		});
	}

	lockHide() {
		this._element?.classList.add('lock-hide');
	}

	unlockHide() {
		this._element?.classList.remove('lock-hide');
	}

	private _setState(state: OverlayState) {
		if (this._state === state) {
			return;
		}
		switch (state) {
			case OverlayState.Off: {
				this._setVisible(false);
				this._uninstallRefreshListeners();
				break;
			}
			case OverlayState.On: {
				this._refresh();
				this._installRefreshListeners();
				break;
			}
		}
	}

	private _installRefreshListeners() {
		if (!this._refreshListeners.value) {
			this._refreshListeners.value = combinedDisposable(
				Event.any(
					this._xterm.raw.onScroll,
					this._xterm.raw.onLineFeed,
					// Rarely an update may be required after just a cursor move, like when
					// scrolling horizontally in a pager
					this._xterm.raw.onCursorMove,
				)(() => this._refresh()),
				// eslint-disable-next-line no-restricted-syntax
				addStandardDisposableListener(this._xterm.raw.element!.querySelector('.xterm-viewport')!, 'scroll', () => this._refresh()),
			);
		}
	}

	private _uninstallRefreshListeners() {
		this._refreshListeners.clear();
	}

	private _setVisible(isVisible: boolean) {
		if (isVisible) {
			this._pendingShowOperation = true;
			this._show();
		} else {
			this._hide();
		}
	}

	@debounce(100)
	private _show(): void {
		if (this._pendingShowOperation) {
			this._ensureElement();
			this._element?.classList.toggle(CssClasses.Visible, true);
		}
		this._pendingShowOperation = false;
	}

	private _hide(): void {
		this._pendingShowOperation = false;
		this._element?.classList.toggle(CssClasses.Visible, false);
	}

	private _refresh(): void {
		if (this._isRefreshQueued) {
			return;
		}
		this._isRefreshQueued = true;
		queueMicrotask(() => {
			this._refreshNow();
			this._isRefreshQueued = false;
		});
	}

	private _refreshNow(): void {
		const command = this._commandDetection.getCommandForLine(this._xterm.raw.buffer.active.viewportY);

		// The command from viewportY + 1 is used because this one will not be obscured by sticky
		// scroll.
		this._currentStickyCommand = undefined;

		// No command or clear command
		if (!command || this._isClearCommand(command)) {
			this._setVisible(false);
			return;
		}

		// Partial command
		if (!isFullTerminalCommand(command)) {
			const partialCommand = this._commandDetection.currentCommand;
			if (partialCommand?.commandStartMarker && partialCommand.commandExecutedMarker) {
				this._updateContent(partialCommand, partialCommand.commandStartMarker);
				return;
			}
			this._setVisible(false);
			return;
		}

		// If the marker doesn't exist or it was trimmed from scrollback
		const marker = command.marker;
		if (!marker || marker.line === -1) {
			// TODO: It would be nice if we kept the cached command around even if it was trimmed
			// from scrollback
			this._setVisible(false);
			return;
		}

		this._updateContent(command, marker);
	}

	private _updateContent(command: ITerminalCommand | ICurrentPartialCommand, startMarker: IMarker) {
		const xterm = this._xterm.raw;
		if (!xterm.element?.parentElement || !this._stickyScrollOverlay || !this._serializeAddon) {
			return;
		}

		// Hide sticky scroll if the prompt has been trimmed from the buffer
		if (command.promptStartMarker?.line === -1) {
			this._setVisible(false);
			return;
		}

		// Determine sticky scroll line count
		const buffer = xterm.buffer.active;
		const promptRowCount = command.getPromptRowCount();
		const commandRowCount = command.getCommandRowCount();
		const stickyScrollLineStart = startMarker.line - (promptRowCount - 1);

		// Calculate the row offset, this is the number of rows that will be clipped from the top
		// of the sticky overlay because we do not want to show any content above the bounds of the
		// original terminal. This is done because it seems like scrolling flickers more when a
		// partial line can be drawn on the top.
		const isPartialCommand = !isFullTerminalCommand(command);
		const rowOffset = !isPartialCommand && command.endMarker ? Math.max(buffer.viewportY - command.endMarker.line + 1, 0) : 0;
		const maxLineCount = Math.min(this._rawMaxLineCount, Math.floor(xterm.rows * Constants.StickyScrollPercentageCap));
		const stickyScrollLineCount = Math.min(promptRowCount + commandRowCount - 1, maxLineCount) - rowOffset;
		const isTruncated = stickyScrollLineCount < promptRowCount + commandRowCount - 1;

		// Hide sticky scroll if it's currently on a line that contains it
		if (buffer.viewportY <= stickyScrollLineStart) {
			this._setVisible(false);
			return;
		}

		// Hide sticky scroll for the partial command if it looks like there is a pager like `less`
		// or `git log` active. This is done by checking if the bottom left cell contains the :
		// character and the cursor is immediately to its right. This improves the behavior of a
		// common case where the top of the text being viewport would otherwise be obscured.
		if (isPartialCommand && buffer.viewportY === buffer.baseY && buffer.cursorY === xterm.rows - 1) {
			const line = buffer.getLine(buffer.baseY + xterm.rows - 1);
			if (
				(buffer.cursorX === 1 && lineStartsWith(line, ':')) ||
				(buffer.cursorX === 5 && lineStartsWith(line, '(END)'))
			) {
				this._setVisible(false);
				return;
			}
		}

		// Get the line content of the command from the terminal
		const content = this._serializeAddon.serialize({
			range: {
				start: stickyScrollLineStart + rowOffset,
				end: stickyScrollLineStart + rowOffset + Math.max(stickyScrollLineCount - 1, 0)
			}
		}) + (isTruncated ? '\x1b[0m …' : '');

		// If a partial command's sticky scroll would show nothing, just hide it. This is another
		// edge case when using a pager or interactive editor.
		if (isPartialCommand && removeAnsiEscapeCodes(content).length === 0) {
			this._setVisible(false);
			return;
		}

		// Write content if it differs
		if (
			content && this._currentContent !== content ||
			this._stickyScrollOverlay.cols !== xterm.cols ||
			this._stickyScrollOverlay.rows !== stickyScrollLineCount
		) {
			this._stickyScrollOverlay.resize(this._stickyScrollOverlay.cols, stickyScrollLineCount);
			// Clear attrs, reset cursor position, clear right
			this._stickyScrollOverlay.write('\x1b[0m\x1b[H\x1b[2J');
			this._stickyScrollOverlay.write(content);
			this._currentContent = content;
			// DEBUG: Log to show the command line we know
			// this._stickyScrollOverlay.write(` [${command?.command}]`);
		}

		if (content) {
			this._currentStickyCommand = command;
			this._setVisible(true);

			// Position the sticky scroll such that it never overlaps the prompt/output of the
			// following command. This must happen after setVisible to ensure the element is
			// initialized.
			if (this._element) {
				const termBox = xterm.element.getBoundingClientRect();
				// Only try reposition if the element is visible, if not a refresh will occur when
				// it becomes visible
				if (termBox.height > 0) {
					const rowHeight = termBox.height / xterm.rows;
					const overlayHeight = stickyScrollLineCount * rowHeight;

					// Adjust sticky scroll content if it would below the end of the command, obscuring the
					// following command.
					let endMarkerOffset = 0;
					if (!isPartialCommand && command.endMarker && command.endMarker.line !== -1) {
						const lastLine = Math.min(command.endMarker.line, buffer.baseY + buffer.cursorY);
						if (buffer.viewportY + stickyScrollLineCount > lastLine) {
							const diff = buffer.viewportY + stickyScrollLineCount - lastLine;
							endMarkerOffset = diff * rowHeight;
						}
					}

					this._element.style.bottom = `${termBox.height - overlayHeight + 1 + endMarkerOffset}px`;
				}
			}
		} else {
			this._setVisible(false);
		}
	}

	private _ensureElement() {
		if (
			// The element is already created
			this._element ||
			// If the overlay is yet to be created, the terminal cannot be opened so defer to next call
			!this._stickyScrollOverlay ||
			// The xterm.js instance isn't opened yet
			!this._xterm?.raw.element?.parentElement
		) {
			return;
		}

		const overlay = this._stickyScrollOverlay;

		const hoverOverlay = $('.hover-overlay');
		this._element = $('.terminal-sticky-scroll', undefined, hoverOverlay);
		this._xterm.raw.element.parentElement.append(this._element);
		this._register(toDisposable(() => this._element?.remove()));

		// Fill tooltip
		let hoverTitle = localize('stickyScrollHoverTitle', 'Navigate to Command');
		const scrollToPreviousCommandKeybinding = this._keybindingService.lookupKeybinding(TerminalCommandId.ScrollToPreviousCommand);
		if (scrollToPreviousCommandKeybinding) {
			const label = scrollToPreviousCommandKeybinding.getLabel();
			if (label) {
				hoverTitle += '\n' + localize('labelWithKeybinding', "{0} ({1})", terminalStrings.scrollToPreviousCommand.value, label);
			}
		}
		const scrollToNextCommandKeybinding = this._keybindingService.lookupKeybinding(TerminalCommandId.ScrollToNextCommand);
		if (scrollToNextCommandKeybinding) {
			const label = scrollToNextCommandKeybinding.getLabel();
			if (label) {
				hoverTitle += '\n' + localize('labelWithKeybinding', "{0} ({1})", terminalStrings.scrollToNextCommand.value, label);
			}
		}
		hoverOverlay.title = hoverTitle;

		interface XtermWithCore extends XTermTerminal {
			_core: IXtermCore;
		}
		const scrollBarWidth = (this._xterm.raw as XtermWithCore)._core.viewport?.scrollBarWidth;
		if (scrollBarWidth !== undefined) {
			this._element.style.right = `${scrollBarWidth}px`;
		}

		this._stickyScrollOverlay.open(this._element);

		// Prevent tab key from being handled by the xterm overlay to allow natural tab navigation
		this._stickyScrollOverlay.attachCustomKeyEventHandler((event: KeyboardEvent) => {
			if (event.key === 'Tab') {
				return false;
			}
			return true;
		});

		this._xtermAddonLoader.importAddon('ligatures').then(LigaturesAddon => {
			if (this._store.isDisposed || !this._stickyScrollOverlay) {
				return;
			}
			this._ligaturesAddon = new LigaturesAddon();
			this._stickyScrollOverlay.loadAddon(this._ligaturesAddon);
		});

		// Scroll to the command on click
		this._register(addStandardDisposableListener(hoverOverlay, 'click', () => {
			if (this._xterm && this._currentStickyCommand) {
				this._xterm.markTracker.revealCommand(this._currentStickyCommand);
				this._instance.focus();
			}
		}));

		// Forward mouse events to the terminal
		this._register(addStandardDisposableListener(hoverOverlay, 'wheel', e => this._xterm?.raw.element?.dispatchEvent(new WheelEvent(e.type, e))));

		// Context menu - stop propagation on mousedown because rightClickBehavior listens on
		// mousedown, not contextmenu
		this._register(addDisposableListener(hoverOverlay, 'mousedown', e => {
			e.stopImmediatePropagation();
			e.preventDefault();
		}));
		this._register(addDisposableListener(hoverOverlay, 'contextmenu', e => {
			e.stopImmediatePropagation();
			e.preventDefault();
			openContextMenu(getWindow(hoverOverlay), e, this._instance, this._contextMenu, this._contextMenuService);
		}));

		// Instead of juggling decorations for hover styles, swap out the theme to indicate the
		// hover state. This comes with the benefit over other methods of working well with special
		// decorative characters like powerline symbols.
		this._register(addStandardDisposableListener(hoverOverlay, 'mouseover', () => overlay.options.theme = this._getTheme(true)));
		this._register(addStandardDisposableListener(hoverOverlay, 'mouseleave', () => overlay.options.theme = this._getTheme(false)));
	}

	@throttle(0)
	private _syncOptions() {
		if (!this._stickyScrollOverlay) {
			return;
		}
		this._stickyScrollOverlay.resize(this._xterm.raw.cols, this._stickyScrollOverlay.rows);
		this._stickyScrollOverlay.options = this._getOptions();
		this._refreshGpuAcceleration();
	}

	private _getOptions(): ITerminalOptions {
		const o = this._xterm.raw.options;
		return {
			cursorInactiveStyle: 'none',
			scrollback: 0,
			logLevel: 'off',

			theme: this._getTheme(false),
			documentOverride: o.documentOverride,
			fontFamily: o.fontFamily,
			fontWeight: o.fontWeight,
			fontWeightBold: o.fontWeightBold,
			fontSize: o.fontSize,
			letterSpacing: o.letterSpacing,
			lineHeight: o.lineHeight,
			drawBoldTextInBrightColors: o.drawBoldTextInBrightColors,
			minimumContrastRatio: o.minimumContrastRatio,
			tabStopWidth: o.tabStopWidth,
			customGlyphs: o.customGlyphs,
		};
	}

	@throttle(0)
	private async _refreshGpuAcceleration() {
		if (this._shouldLoadWebgl() && !this._webglAddon) {
			const WebglAddon = await this._xtermAddonLoader.importAddon('webgl');
			if (this._store.isDisposed) {
				return;
			}
			this._webglAddon = this._register(new WebglAddon());
			this._stickyScrollOverlay?.loadAddon(this._webglAddon);
		} else if (!this._shouldLoadWebgl() && this._webglAddon) {
			this._webglAddon.dispose();
			this._webglAddon = undefined;
		}
	}

	private _shouldLoadWebgl(): boolean {
		return this._terminalConfigurationService.config.gpuAcceleration === 'auto' || this._terminalConfigurationService.config.gpuAcceleration === 'on';
	}

	private _getTheme(isHovering: boolean): ITheme {
		const theme = this._themeService.getColorTheme();
		return {
			...this._xterm.getXtermTheme(),
			background: isHovering
				? theme.getColor(terminalStickyScrollHoverBackground)?.toString() ?? this._xtermColorProvider.getBackgroundColor(theme)?.toString()
				: theme.getColor(terminalStickyScrollBackground)?.toString() ?? this._xtermColorProvider.getBackgroundColor(theme)?.toString(),
			selectionBackground: undefined,
			selectionInactiveBackground: undefined
		};
	}

	private _isClearCommand(command: ITerminalCommand | ICurrentPartialCommand): boolean {
		if (!command.command) {
			return false;
		}
		const trimmedCommand = command.command.trim().toLowerCase();
		const clearCommands = [
			'clear',
			'cls',
			'clear-host',
		];

		return clearCommands.includes(trimmedCommand);
	}
}

function lineStartsWith(line: IBufferLine | undefined, text: string): boolean {
	if (!line) {
		return false;
	}
	for (let i = 0; i < text.length; i++) {
		if (line.getCell(i)?.getChars() !== text[i]) {
			return false;
		}
	}
	return true;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/stickyScroll/browser/media/stickyScroll.css]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/stickyScroll/browser/media/stickyScroll.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.terminal-sticky-scroll {
	display: none;
	position: absolute;
	left: 0;
	right: 14px; /* Don't overlap terminal scroll bar */
	z-index: 32; /* Must be higher than decorations */
	background: var(--vscode-terminalStickyScroll-background, var(--vscode-terminal-background, var(--vscode-panel-background)));
	box-shadow: var(--vscode-scrollbar-shadow) 0 3px 2px -2px;
	border-bottom: 1px solid var(--vscode-terminalStickyScroll-border, transparent);
}
.part.sidebar .terminal-sticky-scroll,
.part.auxiliarybar .terminal-sticky-scroll {
	background: var(--vscode-terminalStickyScroll-background, var(--vscode-terminal-background, var(--vscode-sideBar-background)));
}
.editor-instance .terminal-sticky-scroll {
	background: var(--vscode-terminalStickyScroll-background, var(--vscode-terminal-background, var(--vscode-editor-background)));
}

.terminal-sticky-scroll.visible {
	display:block;
}

.terminal-sticky-scroll:hover {
	cursor: pointer !important;
}

.terminal-sticky-scroll .xterm {
	position: relative !important;
	pointer-events: none;
	padding-bottom: 0 !important;
}

.terminal-sticky-scroll .hover-overlay {
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	cursor: pointer !important;
}

.terminal-sticky-scroll .hover-overlay:hover {
	background-color: var(--vscode-terminalStickyScrollHover-background, transparent);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/stickyScroll/common/terminalStickyScrollConfiguration.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/stickyScroll/common/terminalStickyScrollConfiguration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IStringDictionary } from '../../../../../base/common/collections.js';
import { localize } from '../../../../../nls.js';
import type { IConfigurationPropertySchema } from '../../../../../platform/configuration/common/configurationRegistry.js';
import { TerminalSettingId } from '../../../../../platform/terminal/common/terminal.js';

export const enum TerminalStickyScrollSettingId {
	Enabled = 'terminal.integrated.stickyScroll.enabled',
	MaxLineCount = 'terminal.integrated.stickyScroll.maxLineCount',
}

export interface ITerminalStickyScrollConfiguration {
	enabled: boolean;
	maxLineCount: number;
}

export const terminalStickyScrollConfiguration: IStringDictionary<IConfigurationPropertySchema> = {
	[TerminalStickyScrollSettingId.Enabled]: {
		markdownDescription: localize('stickyScroll.enabled', "Shows the current command at the top of the terminal. This feature requires [shell integration]({0}) to be activated. See {1}.", 'https://code.visualstudio.com/docs/terminal/shell-integration', `\`#${TerminalSettingId.ShellIntegrationEnabled}#\``),
		type: 'boolean',
		default: true
	},
	[TerminalStickyScrollSettingId.MaxLineCount]: {
		markdownDescription: localize('stickyScroll.maxLineCount', "Defines the maximum number of sticky lines to show. Sticky scroll lines will never exceed 40% of the viewport regardless of this setting."),
		type: 'number',
		default: 5,
		minimum: 1,
		maximum: 10
	},
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/suggest/browser/lspCompletionProviderAddon.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/suggest/browser/lspCompletionProviderAddon.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { ITerminalAddon, Terminal } from '@xterm/xterm';
import { Disposable, IReference } from '../../../../../base/common/lifecycle.js';
import { ITerminalCompletionProvider, type TerminalCompletionList } from './terminalCompletionService.js';
import type { CancellationToken } from '../../../../../base/common/cancellation.js';
import { ITerminalCompletion, mapLspKindToTerminalKind, TerminalCompletionItemKind } from './terminalCompletionItem.js';
import { IResolvedTextEditorModel } from '../../../../../editor/common/services/resolverService.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { CompletionItemLabel, CompletionItemProvider, CompletionTriggerKind } from '../../../../../editor/common/languages.js';
import { LspTerminalModelContentProvider } from './lspTerminalModelContentProvider.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { GeneralShellType, TerminalShellType } from '../../../../../platform/terminal/common/terminal.js';

export class LspCompletionProviderAddon extends Disposable implements ITerminalAddon, ITerminalCompletionProvider {
	readonly id = 'lsp';
	readonly isBuiltin = true;
	readonly triggerCharacters?: string[];
	private _provider: CompletionItemProvider;
	private _textVirtualModel: IReference<IResolvedTextEditorModel>;
	private _lspTerminalModelContentProvider: LspTerminalModelContentProvider;
	readonly shellTypes: TerminalShellType[] = [GeneralShellType.Python];

	constructor(
		provider: CompletionItemProvider,
		textVirtualModel: IReference<IResolvedTextEditorModel>,
		lspTerminalModelContentProvider: LspTerminalModelContentProvider,
	) {
		super();
		this._provider = provider;
		this._textVirtualModel = textVirtualModel;
		this._lspTerminalModelContentProvider = lspTerminalModelContentProvider;
		this.triggerCharacters = provider.triggerCharacters ? [...provider.triggerCharacters, ' ', '('] : [' ', '('];
	}

	activate(terminal: Terminal): void {
		// console.log('activate');
	}

	async provideCompletions(value: string, cursorPosition: number, token: CancellationToken): Promise<ITerminalCompletion[] | TerminalCompletionList<ITerminalCompletion> | undefined> {

		// Apply edit for non-executed current commandline --> Pretend we are typing in the real-document.
		this._lspTerminalModelContentProvider.trackPromptInputToVirtualFile(value);

		const textBeforeCursor = value.substring(0, cursorPosition);
		const lines = textBeforeCursor.split('\n');
		const column = lines[lines.length - 1].length + 1;

		// Get line from virtualDocument, not from terminal
		const lineNum = this._textVirtualModel.object.textEditorModel.getLineCount();
		const positionVirtualDocument = new Position(lineNum, column);

		const completions: ITerminalCompletion[] = [];
		if (this._provider && this._provider._debugDisplayName !== 'wordbasedCompletions') {

			const result = await this._provider.provideCompletionItems(this._textVirtualModel.object.textEditorModel, positionVirtualDocument, { triggerKind: CompletionTriggerKind.TriggerCharacter }, token);
			for (const item of (result?.suggestions || [])) {
				// TODO: Support more terminalCompletionItemKind for [different LSP providers](https://github.com/microsoft/vscode/issues/249479)
				const convertedKind = item.kind ? mapLspKindToTerminalKind(item.kind) : TerminalCompletionItemKind.Method;
				const completionItemTemp = createCompletionItemPython(cursorPosition, textBeforeCursor, convertedKind, 'lspCompletionItem', undefined);
				const terminalCompletion: ITerminalCompletion = {
					label: item.label,
					provider: `lsp:${item.extensionId?.value}`,
					detail: item.detail,
					documentation: item.documentation,
					kind: convertedKind,
					replacementRange: completionItemTemp.replacementRange,
				};

				// Store unresolved item and provider for lazy resolution if needed
				if (this._provider.resolveCompletionItem && (!item.detail || !item.documentation)) {
					terminalCompletion._unresolvedItem = item;
					terminalCompletion._resolveProvider = this._provider;
				}

				completions.push(terminalCompletion);
			}
		}

		return completions;
	}
}

export function createCompletionItemPython(
	cursorPosition: number,
	prefix: string,
	kind: TerminalCompletionItemKind,
	label: string | CompletionItemLabel,
	detail: string | undefined
): TerminalCompletionItem {
	const lastWord = getLastWord(prefix);

	return {
		label,
		detail: detail ?? '',
		replacementRange: [cursorPosition - lastWord.length, cursorPosition],
		kind: kind ?? TerminalCompletionItemKind.Method
	};
}

function getLastWord(prefix: string): string {
	if (prefix.endsWith(' ')) {
		return '';
	}

	if (prefix.endsWith('.')) {
		return '';
	}

	const lastSpaceIndex = prefix.lastIndexOf(' ');
	const lastDotIndex = prefix.lastIndexOf('.');
	const lastParenIndex = prefix.lastIndexOf('(');

	// Get the maximum index (most recent delimiter)
	const lastDelimiterIndex = Math.max(lastSpaceIndex, lastDotIndex, lastParenIndex);

	// If no delimiter found, return the entire prefix
	if (lastDelimiterIndex === -1) {
		return prefix;
	}

	// Return the substring after the last delimiter
	return prefix.substring(lastDelimiterIndex + 1);
}

export interface TerminalCompletionItem {
	/**
	 * The label of the completion.
	 */
	label: string | CompletionItemLabel;

	/**
	 * Selection range (inclusive start, exclusive end) to replace when this completion is applied.
	 */
	replacementRange: readonly [number, number] | undefined;

	/**
	 * The completion's detail which appears on the right of the list.
	 */
	detail?: string;

	/**
	 * A human-readable string that represents a doc-comment.
	 */
	documentation?: string | MarkdownString;

	/**
	 * The completion's kind. Note that this will map to an icon.
	 */
	kind?: TerminalCompletionItemKind;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/suggest/browser/lspTerminalModelContentProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/suggest/browser/lspTerminalModelContentProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Disposable, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { ITextModelContentProvider, ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { URI } from '../../../../../base/common/uri.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { Schemas } from '../../../../../base/common/network.js';
import { ICommandDetectionCapability, ITerminalCapabilityStore, TerminalCapability } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { TerminalShellType } from '../../../../../platform/terminal/common/terminal.js';
import { VSCODE_LSP_TERMINAL_PROMPT_TRACKER } from './lspTerminalUtil.js';

export interface ILspTerminalModelContentProvider extends ITextModelContentProvider {
	setContent(content: string): void;
	dispose(): void;
}

export class LspTerminalModelContentProvider extends Disposable implements ILspTerminalModelContentProvider, ITextModelContentProvider {
	static readonly scheme = Schemas.vscodeTerminal;
	private _commandDetection: ICommandDetectionCapability | undefined;
	private _capabilitiesStore: ITerminalCapabilityStore;
	private readonly _virtualTerminalDocumentUri: URI;
	private _shellType: TerminalShellType | undefined;
	private readonly _onCommandFinishedListener = this._register(new MutableDisposable());

	constructor(
		capabilityStore: ITerminalCapabilityStore,
		terminalId: number,
		virtualTerminalDocument: URI,
		shellType: TerminalShellType | undefined,
		@ITextModelService textModelService: ITextModelService,
		@IModelService private readonly _modelService: IModelService,
		@ILanguageService private readonly _languageService: ILanguageService,

	) {
		super();
		this._register(textModelService.registerTextModelContentProvider(LspTerminalModelContentProvider.scheme, this));
		this._capabilitiesStore = capabilityStore;
		this._commandDetection = this._capabilitiesStore.get(TerminalCapability.CommandDetection);
		this._registerTerminalCommandFinishedListener();
		this._virtualTerminalDocumentUri = virtualTerminalDocument;
		this._shellType = shellType;
	}

	// Listens to onDidChangeShellType event from `terminal.suggest.contribution.ts`
	shellTypeChanged(shellType: TerminalShellType | undefined): void {
		this._shellType = shellType;
	}

	/**
	 * Sets or updates content for a terminal virtual document.
	 * This is when user has executed succesful command in terminal.
	 * Transfer the content to virtual document, and relocate delimiter to get terminal prompt ready for next prompt.
	 */
	setContent(content: string): void {
		const model = this._modelService.getModel(this._virtualTerminalDocumentUri);
		if (this._shellType) {
			if (model) {
				const existingContent = model.getValue();
				if (existingContent === '') {
					model.setValue(VSCODE_LSP_TERMINAL_PROMPT_TRACKER);
				} else {
					// If we are appending to existing content, remove delimiter, attach new content, and re-add delimiter
					const delimiterIndex = existingContent.lastIndexOf(VSCODE_LSP_TERMINAL_PROMPT_TRACKER);
					const sanitizedExistingContent = delimiterIndex !== -1 ?
						existingContent.substring(0, delimiterIndex) :
						existingContent;

					const newContent = sanitizedExistingContent + '\n' + content + '\n' + VSCODE_LSP_TERMINAL_PROMPT_TRACKER;
					model.setValue(newContent);
				}
			}
		}
	}

	/**
	 * Real-time conversion of terminal input to virtual document happens here.
	 * This is when user types in terminal, and we want to track the input.
	 * We want to track the input and update the virtual document.
	 * Note: This is for non-executed command.
	*/
	trackPromptInputToVirtualFile(content: string): void {
		this._commandDetection = this._capabilitiesStore.get(TerminalCapability.CommandDetection);
		const model = this._modelService.getModel(this._virtualTerminalDocumentUri);
		if (this._shellType) {
			if (model) {
				const existingContent = model.getValue();
				const delimiterIndex = existingContent.lastIndexOf(VSCODE_LSP_TERMINAL_PROMPT_TRACKER);

				// Keep content only up to delimiter
				const sanitizedExistingContent = delimiterIndex !== -1 ?
					existingContent.substring(0, delimiterIndex) :
					existingContent;

				// Combine base content with new content
				const newContent = sanitizedExistingContent + VSCODE_LSP_TERMINAL_PROMPT_TRACKER + content;

				model.setValue(newContent);
			}
		}
	}

	private _registerTerminalCommandFinishedListener(): void {
		const attachListener = () => {
			if (this._onCommandFinishedListener.value) {
				return;
			}

			// Inconsistent repro: Covering case where commandDetection is available but onCommandFinished becomes available later
			if (this._commandDetection && this._commandDetection.onCommandFinished) {
				this._onCommandFinishedListener.value = this._register(this._commandDetection.onCommandFinished((e) => {
					if (e.exitCode === 0 && this._shellType) {
						this.setContent(e.command);
					}

				}));
			}
		};
		attachListener();

		// Listen to onDidAddCapabilityType because command detection is not available until later
		this._register(this._capabilitiesStore.onDidAddCommandDetectionCapability(e => {
			this._commandDetection = e;
			attachListener();
		}));
	}

	async provideTextContent(resource: URI): Promise<ITextModel | null> {
		const existing = this._modelService.getModel(resource);

		if (existing && !existing.isDisposed()) {
			return existing;
		}

		const languageId = this._languageService.guessLanguageIdByFilepathOrFirstLine(resource);

		const languageSelection = languageId ?
			this._languageService.createById(languageId) :
			this._languageService.createById('plaintext');

		return this._modelService.createModel('', languageSelection, resource, false);
	}

}

/**
 * Creates a terminal language virtual URI.
 */
// TODO: Make this [OS generic](https://github.com/microsoft/vscode/issues/249477)
export function createTerminalLanguageVirtualUri(terminalId: number, languageExtension: string): URI {
	return URI.from({
		scheme: Schemas.vscodeTerminal,
		path: `/terminal${terminalId}.${languageExtension}`,
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/suggest/browser/lspTerminalUtil.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/suggest/browser/lspTerminalUtil.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const VSCODE_LSP_TERMINAL_PROMPT_TRACKER = 'vscode_lsp_terminal_prompt_tracker= {}\n';

export const terminalLspSupportedLanguages = new Set<{ shellType: string; languageId: string; extension: string }>([
	{
		shellType: 'python',
		languageId: 'python',
		extension: 'py'
	}
]);

export function getTerminalLspSupportedLanguageObj(shellType: string): { shellType: string; languageId: string; extension: string } | undefined {
	for (const supportedLanguage of terminalLspSupportedLanguages) {
		if (supportedLanguage.shellType === shellType) {
			return supportedLanguage;
		}
	}
	return undefined;
}
```

--------------------------------------------------------------------------------

````

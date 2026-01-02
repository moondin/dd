---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 473
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 473 of 552)

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

---[FILE: src/vs/workbench/contrib/terminalContrib/suggest/test/browser/terminalCompletionService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/suggest/test/browser/terminalCompletionService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../../../base/common/uri.js';
import { IFileService, IFileStatWithMetadata, IResolveMetadataFileOptions } from '../../../../../../platform/files/common/files.js';
import { TerminalCompletionService, TerminalCompletionResourceOptions, type ITerminalCompletionProvider } from '../../browser/terminalCompletionService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import assert, { fail } from 'assert';
import { isWindows, type IProcessEnvironment } from '../../../../../../base/common/platform.js';
import { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { createFileStat } from '../../../../../test/common/workbenchTestServices.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { TerminalCapabilityStore } from '../../../../../../platform/terminal/common/capabilities/terminalCapabilityStore.js';
import { ShellEnvDetectionCapability } from '../../../../../../platform/terminal/common/capabilities/shellEnvDetectionCapability.js';
import { TerminalCapability } from '../../../../../../platform/terminal/common/capabilities/capabilities.js';
import { ITerminalCompletion, TerminalCompletionItemKind } from '../../browser/terminalCompletionItem.js';
import { count } from '../../../../../../base/common/strings.js';
import { ITerminalLogService, WindowsShellType } from '../../../../../../platform/terminal/common/terminal.js';
import { gitBashToWindowsPath, windowsToGitBashPath } from '../../browser/terminalGitBashHelpers.js';
import { NullLogService } from '../../../../../../platform/log/common/log.js';
import { TerminalSuggestSettingId } from '../../common/terminalSuggestConfiguration.js';
import { TestPathService, workbenchInstantiationService } from '../../../../../test/browser/workbenchTestServices.js';

const pathSeparator = isWindows ? '\\' : '/';

interface IAssertionTerminalCompletion {
	label: string;
	detail?: string;
	kind?: TerminalCompletionItemKind;
}

interface IAssertionCommandLineConfig {
	replacementRange: [number, number];
}

/**
 * Assert the set of completions exist exactly, including their order.
 */
function assertCompletions(actual: ITerminalCompletion[] | undefined, expected: IAssertionTerminalCompletion[], expectedConfig: IAssertionCommandLineConfig, pathSep?: string) {
	const sep = pathSep ?? pathSeparator;
	assert.deepStrictEqual(
		actual?.map(e => ({
			label: e.label,
			detail: e.detail ?? '',
			kind: e.kind ?? TerminalCompletionItemKind.Folder,
			replacementRange: e.replacementRange,
		})), expected.map(e => ({
			label: e.label.replaceAll('/', sep),
			detail: e.detail ? e.detail.replaceAll('/', sep) : '',
			kind: e.kind ?? TerminalCompletionItemKind.Folder,
			replacementRange: expectedConfig.replacementRange,
		}))
	);
}

/**
 * Assert a set of completions exist within the actual set.
 */
function assertPartialCompletionsExist(actual: ITerminalCompletion[] | undefined, expectedPartial: IAssertionTerminalCompletion[], expectedConfig: IAssertionCommandLineConfig) {
	if (!actual) {
		fail();
	}
	const expectedMapped = expectedPartial.map(e => ({
		label: e.label.replaceAll('/', pathSeparator),
		detail: e.detail ? e.detail.replaceAll('/', pathSeparator) : '',
		kind: e.kind ?? TerminalCompletionItemKind.Folder,
		replacementRange: expectedConfig.replacementRange,
	}));
	for (const expectedItem of expectedMapped) {
		assert.deepStrictEqual(actual.map(e => ({
			label: e.label,
			detail: e.detail ?? '',
			kind: e.kind ?? TerminalCompletionItemKind.Folder,
			replacementRange: e.replacementRange,
		})).find(e => e.detail === expectedItem.detail), expectedItem);
	}
}

const testEnv: IProcessEnvironment = {
	HOME: '/home/user',
	USERPROFILE: '/home/user'
};

let homeDir = isWindows ? testEnv['USERPROFILE'] : testEnv['HOME'];
if (!homeDir!.endsWith('/')) {
	homeDir += '/';
}
const standardTildeItem = Object.freeze({ label: '~', detail: homeDir });

suite('TerminalCompletionService', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();
	let instantiationService: TestInstantiationService;
	let configurationService: TestConfigurationService;
	let capabilities: TerminalCapabilityStore;
	let validResources: URI[];
	let childResources: { resource: URI; isFile?: boolean; isDirectory?: boolean; isSymbolicLink?: boolean }[];
	let terminalCompletionService: TerminalCompletionService;
	const provider = 'testProvider';

	setup(() => {
		instantiationService = workbenchInstantiationService({
			pathService: () => new TestPathService(URI.file(homeDir ?? '/')),
		}, store);
		configurationService = new TestConfigurationService();
		instantiationService.stub(ITerminalLogService, new NullLogService());
		instantiationService.stub(IConfigurationService, configurationService);
		instantiationService.stub(IFileService, {
			async stat(resource) {
				if (!validResources.map(e => e.path).includes(resource.path)) {
					throw new Error('Doesn\'t exist');
				}
				return createFileStat(resource);
			},
			async resolve(resource: URI, options: IResolveMetadataFileOptions): Promise<IFileStatWithMetadata> {
				const children = childResources.filter(child => {
					const childFsPath = child.resource.path.replace(/\/$/, '');
					const parentFsPath = resource.path.replace(/\/$/, '');
					return (
						childFsPath.startsWith(parentFsPath) &&
						count(childFsPath, '/') === count(parentFsPath, '/') + 1
					);
				});
				return createFileStat(resource, undefined, undefined, undefined, undefined, children);
			},
			async realpath(resource: URI): Promise<URI | undefined> {
				if (resource.path.includes('symlink-file')) {
					return resource.with({ path: '/target/actual-file.txt' });
				} else if (resource.path.includes('symlink-folder')) {
					return resource.with({ path: '/target/actual-folder' });
				}
				return undefined;
			}
		});
		terminalCompletionService = store.add(instantiationService.createInstance(TerminalCompletionService));
		terminalCompletionService.processEnv = testEnv;
		validResources = [];
		childResources = [];
		capabilities = store.add(new TerminalCapabilityStore());
	});

	suite('resolveResources should return undefined', () => {
		test('if neither showFiles nor showFolders are true', async () => {
			const resourceOptions: TerminalCompletionResourceOptions = {
				cwd: URI.parse('file:///test'),
				pathSeparator
			};
			validResources = [URI.parse('file:///test')];
			const result = await terminalCompletionService.resolveResources(resourceOptions, 'cd ', 3, provider, capabilities);
			assert(!result);
		});
	});

	suite('resolveResources should return folder completions', () => {
		setup(() => {
			validResources = [URI.parse('file:///test')];
			childResources = [
				{ resource: URI.parse('file:///test/folder1/'), isDirectory: true, isFile: false },
				{ resource: URI.parse('file:///test/file1.txt'), isDirectory: false, isFile: true },
			];
		});

		test('| should return root-level completions', async () => {
			const resourceOptions: TerminalCompletionResourceOptions = {
				cwd: URI.parse('file:///test'),
				showDirectories: true,
				pathSeparator
			};
			const result = await terminalCompletionService.resolveResources(resourceOptions, '', 1, provider, capabilities);

			assertCompletions(result, [
				{ label: '.', detail: '/test/' },
				{ label: './folder1/', detail: '/test/folder1/' },
				{ label: '../', detail: '/' },
				standardTildeItem,
			], { replacementRange: [1, 1] });
		});

		test('./| should return folder completions', async () => {
			const resourceOptions: TerminalCompletionResourceOptions = {
				cwd: URI.parse('file:///test'),
				showDirectories: true,
				pathSeparator
			};
			const result = await terminalCompletionService.resolveResources(resourceOptions, './', 3, provider, capabilities);

			assertCompletions(result, [
				{ label: './', detail: '/test/' },
				{ label: './folder1/', detail: '/test/folder1/' },
				{ label: './../', detail: '/' },
			], { replacementRange: [1, 3] });
		});

		test('cd ./| should return folder completions', async () => {
			const resourceOptions: TerminalCompletionResourceOptions = {
				cwd: URI.parse('file:///test'),
				showDirectories: true,
				pathSeparator
			};
			const result = await terminalCompletionService.resolveResources(resourceOptions, 'cd ./', 5, provider, capabilities);

			assertCompletions(result, [
				{ label: './', detail: '/test/' },
				{ label: './folder1/', detail: '/test/folder1/' },
				{ label: './../', detail: '/' },
			], { replacementRange: [3, 5] });
		});
		test('cd ./f| should return folder completions', async () => {
			const resourceOptions: TerminalCompletionResourceOptions = {
				cwd: URI.parse('file:///test'),
				showDirectories: true,
				pathSeparator
			};
			const result = await terminalCompletionService.resolveResources(resourceOptions, 'cd ./f', 6, provider, capabilities);

			assertCompletions(result, [
				{ label: './', detail: '/test/' },
				{ label: './folder1/', detail: '/test/folder1/' },
				{ label: './../', detail: '/' },
			], { replacementRange: [3, 6] });
		});
	});

	suite('resolveResources should handle file and folder completion requests correctly', () => {
		setup(() => {
			validResources = [URI.parse('file:///test')];
			childResources = [
				{ resource: URI.parse('file:///test/.hiddenFile'), isFile: true },
				{ resource: URI.parse('file:///test/.hiddenFolder/'), isDirectory: true },
				{ resource: URI.parse('file:///test/folder1/'), isDirectory: true },
				{ resource: URI.parse('file:///test/file1.txt'), isFile: true },
			];
		});

		test('./| should handle hidden files and folders', async () => {
			const resourceOptions: TerminalCompletionResourceOptions = {
				cwd: URI.parse('file:///test'),
				showDirectories: true,
				showFiles: true,
				pathSeparator
			};
			const result = await terminalCompletionService.resolveResources(resourceOptions, './', 2, provider, capabilities);

			assertCompletions(result, [
				{ label: './', detail: '/test/' },
				{ label: './.hiddenFile', detail: '/test/.hiddenFile', kind: TerminalCompletionItemKind.File },
				{ label: './.hiddenFolder/', detail: '/test/.hiddenFolder/' },
				{ label: './folder1/', detail: '/test/folder1/' },
				{ label: './file1.txt', detail: '/test/file1.txt', kind: TerminalCompletionItemKind.File },
				{ label: './../', detail: '/' },
			], { replacementRange: [0, 2] });
		});

		test('./h| should handle hidden files and folders', async () => {
			const resourceOptions: TerminalCompletionResourceOptions = {
				cwd: URI.parse('file:///test'),
				showDirectories: true,
				showFiles: true,
				pathSeparator
			};
			const result = await terminalCompletionService.resolveResources(resourceOptions, './h', 3, provider, capabilities);

			assertCompletions(result, [
				{ label: './', detail: '/test/' },
				{ label: './.hiddenFile', detail: '/test/.hiddenFile', kind: TerminalCompletionItemKind.File },
				{ label: './.hiddenFolder/', detail: '/test/.hiddenFolder/' },
				{ label: './folder1/', detail: '/test/folder1/' },
				{ label: './file1.txt', detail: '/test/file1.txt', kind: TerminalCompletionItemKind.File },
				{ label: './../', detail: '/' },
			], { replacementRange: [0, 3] });
		});
	});

	suite('~ -> $HOME', () => {
		let resourceOptions: TerminalCompletionResourceOptions;
		let shellEnvDetection: ShellEnvDetectionCapability;

		setup(() => {
			shellEnvDetection = store.add(new ShellEnvDetectionCapability());
			shellEnvDetection.setEnvironment({
				HOME: '/home',
				USERPROFILE: '/home'
			}, true);
			capabilities.add(TerminalCapability.ShellEnvDetection, shellEnvDetection);

			resourceOptions = {
				cwd: URI.parse('file:///test/folder1'),// Updated to reflect home directory
				showFiles: true,
				showDirectories: true,
				pathSeparator
			};
			validResources = [
				URI.parse('file:///test'),
				URI.parse('file:///test/folder1'),
				URI.parse('file:///home'),
				URI.parse('file:///home/vscode'),
				URI.parse('file:///home/vscode/foo'),
				URI.parse('file:///home/vscode/bar.txt'),
			];
			childResources = [
				{ resource: URI.parse('file:///home/vscode'), isDirectory: true },
				{ resource: URI.parse('file:///home/vscode/foo'), isDirectory: true },
				{ resource: URI.parse('file:///home/vscode/bar.txt'), isFile: true },
			];
		});

		test('~| should return completion for ~', async () => {
			assertPartialCompletionsExist(await terminalCompletionService.resolveResources(resourceOptions, '~', 1, provider, capabilities), [
				{ label: '~', detail: '/home/' },
			], { replacementRange: [0, 1] });
		});

		test('~/| should return folder completions relative to $HOME', async () => {
			assertCompletions(await terminalCompletionService.resolveResources(resourceOptions, '~/', 2, provider, capabilities), [
				{ label: '~/', detail: '/home/' },
				{ label: '~/vscode/', detail: '/home/vscode/' },
			], { replacementRange: [0, 2] });
		});

		test('~/vscode/| should return folder completions relative to $HOME/vscode', async () => {
			assertCompletions(await terminalCompletionService.resolveResources(resourceOptions, '~/vscode/', 9, provider, capabilities), [
				{ label: '~/vscode/', detail: '/home/vscode/' },
				{ label: '~/vscode/foo/', detail: '/home/vscode/foo/' },
				{ label: '~/vscode/bar.txt', detail: '/home/vscode/bar.txt', kind: TerminalCompletionItemKind.File },
			], { replacementRange: [0, 9] });
		});
	});

	suite('resolveResources edge cases and advanced scenarios', () => {
		setup(() => {
			validResources = [];
			childResources = [];
		});

		if (isWindows) {
			test('C:/Foo/| absolute paths on Windows', async () => {
				const resourceOptions: TerminalCompletionResourceOptions = {
					cwd: URI.parse('file:///C:'),
					showDirectories: true,
					pathSeparator
				};
				validResources = [URI.parse('file:///C:/Foo')];
				childResources = [
					{ resource: URI.parse('file:///C:/Foo/Bar'), isDirectory: true, isFile: false },
					{ resource: URI.parse('file:///C:/Foo/Baz.txt'), isDirectory: false, isFile: true }
				];
				const result = await terminalCompletionService.resolveResources(resourceOptions, 'C:/Foo/', 7, provider, capabilities);

				assertCompletions(result, [
					{ label: 'C:/Foo/', detail: 'C:/Foo/' },
					{ label: 'C:/Foo/Bar/', detail: 'C:/Foo/Bar/' },
				], { replacementRange: [0, 7] });
			});
			test('c:/foo/| case insensitivity on Windows', async () => {
				const resourceOptions: TerminalCompletionResourceOptions = {
					cwd: URI.parse('file:///c:'),
					showDirectories: true,
					pathSeparator
				};
				validResources = [URI.parse('file:///c:/foo')];
				childResources = [
					{ resource: URI.parse('file:///c:/foo/Bar'), isDirectory: true, isFile: false }
				];
				const result = await terminalCompletionService.resolveResources(resourceOptions, 'c:/foo/', 7, provider, capabilities);

				assertCompletions(result, [
					// Note that the detail is normalizes drive letters to capital case intentionally
					{ label: 'c:/foo/', detail: 'C:/foo/' },
					{ label: 'c:/foo/Bar/', detail: 'C:/foo/Bar/' },
				], { replacementRange: [0, 7] });
			});
		} else {
			test('/foo/| absolute paths NOT on Windows', async () => {
				const resourceOptions: TerminalCompletionResourceOptions = {
					cwd: URI.parse('file:///'),
					showDirectories: true,
					pathSeparator
				};
				validResources = [URI.parse('file:///foo')];
				childResources = [
					{ resource: URI.parse('file:///foo/Bar'), isDirectory: true, isFile: false },
					{ resource: URI.parse('file:///foo/Baz.txt'), isDirectory: false, isFile: true }
				];
				const result = await terminalCompletionService.resolveResources(resourceOptions, '/foo/', 5, provider, capabilities);

				assertCompletions(result, [
					{ label: '/foo/', detail: '/foo/' },
					{ label: '/foo/Bar/', detail: '/foo/Bar/' },
				], { replacementRange: [0, 5] });
			});
		}

		if (isWindows) {
			test('.\\folder | Case insensitivity should resolve correctly on Windows', async () => {
				const resourceOptions: TerminalCompletionResourceOptions = {
					cwd: URI.parse('file:///C:/test'),
					showDirectories: true,
					pathSeparator: '\\'
				};

				validResources = [URI.parse('file:///C:/test')];
				childResources = [
					{ resource: URI.parse('file:///C:/test/FolderA/'), isDirectory: true },
					{ resource: URI.parse('file:///C:/test/anotherFolder/'), isDirectory: true }
				];

				const result = await terminalCompletionService.resolveResources(resourceOptions, '.\\folder', 8, provider, capabilities);

				assertCompletions(result, [
					{ label: '.\\', detail: 'C:\\test\\' },
					{ label: '.\\FolderA\\', detail: 'C:\\test\\FolderA\\' },
					{ label: '.\\anotherFolder\\', detail: 'C:\\test\\anotherFolder\\' },
					{ label: '.\\..\\', detail: 'C:\\' },
				], { replacementRange: [0, 8] });
			});
		} else {
			test('./folder | Case sensitivity should resolve correctly on Mac/Unix', async () => {
				const resourceOptions: TerminalCompletionResourceOptions = {
					cwd: URI.parse('file:///test'),
					showDirectories: true,
					pathSeparator: '/'
				};
				validResources = [URI.parse('file:///test')];
				childResources = [
					{ resource: URI.parse('file:///test/FolderA/'), isDirectory: true },
					{ resource: URI.parse('file:///test/foldera/'), isDirectory: true }
				];

				const result = await terminalCompletionService.resolveResources(resourceOptions, './folder', 8, provider, capabilities);

				assertCompletions(result, [
					{ label: './', detail: '/test/' },
					{ label: './FolderA/', detail: '/test/FolderA/' },
					{ label: './foldera/', detail: '/test/foldera/' },
					{ label: './../', detail: '/' }
				], { replacementRange: [0, 8] });
			});

		}
		test('| Empty input should resolve to current directory', async () => {
			const resourceOptions: TerminalCompletionResourceOptions = {
				cwd: URI.parse('file:///test'),
				showDirectories: true,
				pathSeparator
			};
			validResources = [URI.parse('file:///test')];
			childResources = [
				{ resource: URI.parse('file:///test/folder1/'), isDirectory: true },
				{ resource: URI.parse('file:///test/folder2/'), isDirectory: true }
			];
			const result = await terminalCompletionService.resolveResources(resourceOptions, '', 0, provider, capabilities);

			assertCompletions(result, [
				{ label: '.', detail: '/test/' },
				{ label: './folder1/', detail: '/test/folder1/' },
				{ label: './folder2/', detail: '/test/folder2/' },
				{ label: '../', detail: '/' },
				standardTildeItem,
			], { replacementRange: [0, 0] });
		});

		test('should ignore environment variable setting prefixes', async () => {
			const resourceOptions: TerminalCompletionResourceOptions = {
				cwd: URI.parse('file:///test'),
				showDirectories: true,
				pathSeparator
			};
			validResources = [URI.parse('file:///test')];
			childResources = [
				{ resource: URI.parse('file:///test/folder1/'), isDirectory: true },
				{ resource: URI.parse('file:///test/folder2/'), isDirectory: true }
			];
			const result = await terminalCompletionService.resolveResources(resourceOptions, 'FOO=./', 2, provider, capabilities);

			// Must not include FOO= prefix in completions
			assertCompletions(result, [
				{ label: '.', detail: '/test/' },
				{ label: './folder1/', detail: '/test/folder1/' },
				{ label: './folder2/', detail: '/test/folder2/' },
				{ label: '../', detail: '/' },
				standardTildeItem,
			], { replacementRange: [0, 2] });
		});

		test('./| should handle large directories with many results gracefully', async () => {
			const resourceOptions: TerminalCompletionResourceOptions = {
				cwd: URI.parse('file:///test'),
				showDirectories: true,
				pathSeparator
			};
			validResources = [URI.parse('file:///test')];
			childResources = Array.from({ length: 1000 }, (_, i) => ({
				resource: URI.parse(`file:///test/folder${i}/`),
				isDirectory: true
			}));
			const result = await terminalCompletionService.resolveResources(resourceOptions, './', 2, provider, capabilities);

			assert(result);
			// includes the 1000 folders + ./ and ./../
			assert.strictEqual(result?.length, 1002);
			assert.strictEqual(result[0].label, `.${pathSeparator}`);
			assert.strictEqual(result.at(-1)?.label, `.${pathSeparator}..${pathSeparator}`);
		});

		test('./folder| should include current folder with trailing / is missing', async () => {
			const resourceOptions: TerminalCompletionResourceOptions = {
				cwd: URI.parse('file:///test'),
				showDirectories: true,
				pathSeparator
			};
			validResources = [URI.parse('file:///test')];
			childResources = [
				{ resource: URI.parse('file:///test/folder1/'), isDirectory: true },
				{ resource: URI.parse('file:///test/folder2/'), isDirectory: true }
			];
			const result = await terminalCompletionService.resolveResources(resourceOptions, './folder1', 10, provider, capabilities);

			assertCompletions(result, [
				{ label: './', detail: '/test/' },
				{ label: './folder1/', detail: '/test/folder1/' },
				{ label: './folder2/', detail: '/test/folder2/' },
				{ label: './../', detail: '/' }
			], { replacementRange: [1, 10] });
		});
		test('test/| should normalize current and parent folders', async () => {
			const resourceOptions: TerminalCompletionResourceOptions = {
				cwd: URI.parse('file:///test'),
				showDirectories: true,
				pathSeparator
			};
			validResources = [
				URI.parse('file:///test'),
				URI.parse('file:///test/folder1'),
				URI.parse('file:///test/folder2')
			];
			childResources = [
				{ resource: URI.parse('file:///test/folder1/'), isDirectory: true },
				{ resource: URI.parse('file:///test/folder2/'), isDirectory: true }
			];
			const result = await terminalCompletionService.resolveResources(resourceOptions, 'test/', 5, provider, capabilities);

			assertCompletions(result, [
				{ label: './test/', detail: '/test/' },
				{ label: './test/folder1/', detail: '/test/folder1/' },
				{ label: './test/folder2/', detail: '/test/folder2/' },
				{ label: './test/../', detail: '/' }
			], { replacementRange: [0, 5] });
		});
	});

	suite('cdpath', () => {
		let shellEnvDetection: ShellEnvDetectionCapability;

		setup(() => {
			validResources = [URI.parse('file:///test')];
			childResources = [
				{ resource: URI.parse('file:///cdpath_value/folder1/'), isDirectory: true },
				{ resource: URI.parse('file:///cdpath_value/file1.txt'), isFile: true },
			];

			shellEnvDetection = store.add(new ShellEnvDetectionCapability());
			shellEnvDetection.setEnvironment({ CDPATH: '/cdpath_value' }, true);
			capabilities.add(TerminalCapability.ShellEnvDetection, shellEnvDetection);
		});

		test('cd | should show paths from $CDPATH (relative)', async () => {
			configurationService.setUserConfiguration('terminal.integrated.suggest.cdPath', 'relative');
			const resourceOptions: TerminalCompletionResourceOptions = {
				cwd: URI.parse('file:///test'),
				showDirectories: true,
				showFiles: true,
				pathSeparator
			};
			const result = await terminalCompletionService.resolveResources(resourceOptions, 'cd ', 3, provider, capabilities);

			assertPartialCompletionsExist(result, [
				{ label: 'folder1', detail: 'CDPATH /cdpath_value/folder1/' },
			], { replacementRange: [3, 3] });
		});

		test('cd | should show paths from $CDPATH (absolute)', async () => {
			configurationService.setUserConfiguration('terminal.integrated.suggest.cdPath', 'absolute');
			const resourceOptions: TerminalCompletionResourceOptions = {
				cwd: URI.parse('file:///test'),
				showDirectories: true,
				showFiles: true,
				pathSeparator
			};
			const result = await terminalCompletionService.resolveResources(resourceOptions, 'cd ', 3, provider, capabilities);

			assertPartialCompletionsExist(result, [
				{ label: '/cdpath_value/folder1/', detail: 'CDPATH' },
			], { replacementRange: [3, 3] });
		});

		test('cd | should support pulling from multiple paths in $CDPATH', async () => {
			configurationService.setUserConfiguration('terminal.integrated.suggest.cdPath', 'relative');
			const pathPrefix = isWindows ? 'c:\\' : '/';
			const delimeter = isWindows ? ';' : ':';
			const separator = isWindows ? '\\' : '/';
			shellEnvDetection.setEnvironment({ CDPATH: `${pathPrefix}cdpath1_value${delimeter}${pathPrefix}cdpath2_value${separator}inner_dir` }, true);

			const uriPathPrefix = isWindows ? 'file:///c:/' : 'file:///';
			validResources = [
				URI.parse(`${uriPathPrefix}test`),
				URI.parse(`${uriPathPrefix}cdpath1_value`),
				URI.parse(`${uriPathPrefix}cdpath2_value`),
				URI.parse(`${uriPathPrefix}cdpath2_value/inner_dir`)
			];
			childResources = [
				{ resource: URI.parse(`${uriPathPrefix}cdpath1_value/folder1/`), isDirectory: true },
				{ resource: URI.parse(`${uriPathPrefix}cdpath1_value/folder2/`), isDirectory: true },
				{ resource: URI.parse(`${uriPathPrefix}cdpath1_value/file1.txt`), isFile: true },
				{ resource: URI.parse(`${uriPathPrefix}cdpath2_value/inner_dir/folder1/`), isDirectory: true },
				{ resource: URI.parse(`${uriPathPrefix}cdpath2_value/inner_dir/folder2/`), isDirectory: true },
				{ resource: URI.parse(`${uriPathPrefix}cdpath2_value/inner_dir/file1.txt`), isFile: true },
			];

			const resourceOptions: TerminalCompletionResourceOptions = {
				cwd: URI.parse(`${uriPathPrefix}test`),
				showDirectories: true,
				showFiles: true,
				pathSeparator
			};
			const result = await terminalCompletionService.resolveResources(resourceOptions, 'cd ', 3, provider, capabilities);

			const finalPrefix = isWindows ? 'C:\\' : '/';
			assertPartialCompletionsExist(result, [
				{ label: 'folder1', detail: `CDPATH ${finalPrefix}cdpath1_value/folder1/` },
				{ label: 'folder2', detail: `CDPATH ${finalPrefix}cdpath1_value/folder2/` },
				{ label: 'folder1', detail: `CDPATH ${finalPrefix}cdpath2_value/inner_dir/folder1/` },
				{ label: 'folder2', detail: `CDPATH ${finalPrefix}cdpath2_value/inner_dir/folder2/` },
			], { replacementRange: [3, 3] });
		});
	});

	if (isWindows) {
		suite('gitbash', () => {
			test('should convert Git Bash absolute path to Windows absolute path', () => {
				assert.strictEqual(gitBashToWindowsPath('/'), 'C:\\');
				assert.strictEqual(gitBashToWindowsPath('/c/'), 'C:\\');
				assert.strictEqual(gitBashToWindowsPath('/c/Users/foo'), 'C:\\Users\\foo');
				assert.strictEqual(gitBashToWindowsPath('/d/bar'), 'D:\\bar');
			});

			test('should convert Windows absolute path to Git Bash absolute path', () => {
				assert.strictEqual(windowsToGitBashPath('C:\\'), '/c/');
				assert.strictEqual(windowsToGitBashPath('C:\\Users\\foo'), '/c/Users/foo');
				assert.strictEqual(windowsToGitBashPath('D:\\bar'), '/d/bar');
				assert.strictEqual(windowsToGitBashPath('E:\\some\\path'), '/e/some/path');
			});

			test('resolveResources with c:/ style absolute path for Git Bash', async () => {
				const resourceOptions: TerminalCompletionResourceOptions = {
					cwd: URI.file('C:\\Users\\foo'),
					showDirectories: true,
					showFiles: true,
					pathSeparator: '/'
				};
				validResources = [
					URI.file('C:\\Users\\foo'),
					URI.file('C:\\Users\\foo\\bar'),
					URI.file('C:\\Users\\foo\\baz.txt')
				];
				childResources = [
					{ resource: URI.file('C:\\Users\\foo\\bar'), isDirectory: true, isFile: false },
					{ resource: URI.file('C:\\Users\\foo\\baz.txt'), isFile: true }
				];
				const result = await terminalCompletionService.resolveResources(resourceOptions, 'C:/Users/foo/', 13, provider, capabilities, WindowsShellType.GitBash);
				assertCompletions(result, [
					{ label: 'C:/Users/foo/', detail: 'C:\\Users\\foo\\' },
					{ label: 'C:/Users/foo/bar/', detail: 'C:\\Users\\foo\\bar\\' },
					{ label: 'C:/Users/foo/baz.txt', detail: 'C:\\Users\\foo\\baz.txt', kind: TerminalCompletionItemKind.File },
				], { replacementRange: [0, 13] }, '/');
			});
			test('resolveResources with cwd as Windows path (relative)', async () => {
				const resourceOptions: TerminalCompletionResourceOptions = {
					cwd: URI.file('C:\\Users\\foo'),
					showDirectories: true,
					showFiles: true,
					pathSeparator: '/'
				};
				validResources = [
					URI.file('C:\\Users\\foo'),
					URI.file('C:\\Users\\foo\\bar'),
					URI.file('C:\\Users\\foo\\baz.txt')
				];
				childResources = [
					{ resource: URI.file('C:\\Users\\foo\\bar'), isDirectory: true },
					{ resource: URI.file('C:\\Users\\foo\\baz.txt'), isFile: true }
				];
				const result = await terminalCompletionService.resolveResources(resourceOptions, './', 2, provider, capabilities, WindowsShellType.GitBash);
				assertCompletions(result, [
					{ label: './', detail: 'C:\\Users\\foo\\' },
					{ label: './bar/', detail: 'C:\\Users\\foo\\bar\\' },
					{ label: './baz.txt', detail: 'C:\\Users\\foo\\baz.txt', kind: TerminalCompletionItemKind.File },
					{ label: './../', detail: 'C:\\Users\\' }
				], { replacementRange: [0, 2] }, '/');
			});

			test('resolveResources with cwd as Windows path (absolute)', async () => {
				const resourceOptions: TerminalCompletionResourceOptions = {
					cwd: URI.file('C:\\Users\\foo'),
					showDirectories: true,
					showFiles: true,
					pathSeparator: '/'
				};
				validResources = [
					URI.file('C:\\Users\\foo'),
					URI.file('C:\\Users\\foo\\bar'),
					URI.file('C:\\Users\\foo\\baz.txt')
				];
				childResources = [
					{ resource: URI.file('C:\\Users\\foo\\bar'), isDirectory: true },
					{ resource: URI.file('C:\\Users\\foo\\baz.txt'), isFile: true }
				];
				const result = await terminalCompletionService.resolveResources(resourceOptions, '/c/Users/foo/', 13, provider, capabilities, WindowsShellType.GitBash);
				assertCompletions(result, [
					{ label: '/c/Users/foo/', detail: 'C:\\Users\\foo\\' },
					{ label: '/c/Users/foo/bar/', detail: 'C:\\Users\\foo\\bar\\' },
					{ label: '/c/Users/foo/baz.txt', detail: 'C:\\Users\\foo\\baz.txt', kind: TerminalCompletionItemKind.File },
				], { replacementRange: [0, 13] }, '/');
			});
		});
	}
	if (!isWindows) {
		suite('symlink support', () => {
			test('should include symlink target information in completions', async () => {
				const resourceOptions: TerminalCompletionResourceOptions = {
					cwd: URI.parse('file:///test'),
					pathSeparator,
					showFiles: true,
					showDirectories: true
				};

				validResources = [URI.parse('file:///test')];

				// Create mock children including a symbolic link
				childResources = [
					{ resource: URI.parse('file:///test/regular-file.txt'), isFile: true },
					{ resource: URI.parse('file:///test/symlink-file'), isFile: true, isSymbolicLink: true },
					{ resource: URI.parse('file:///test/symlink-folder'), isDirectory: true, isSymbolicLink: true },
					{ resource: URI.parse('file:///test/regular-folder'), isDirectory: true },
				];

				const result = await terminalCompletionService.resolveResources(resourceOptions, 'ls ', 3, provider, capabilities);

				// Find the symlink completion
				const symlinkFileCompletion = result?.find(c => c.label === './symlink-file');
				const symlinkFolderCompletion = result?.find(c => c.label === './symlink-folder/');
				assert.strictEqual(symlinkFileCompletion?.detail, '/test/symlink-file -> /target/actual-file.txt', 'Symlink file detail should match target');
				assert.strictEqual(symlinkFolderCompletion?.detail, '/test/symlink-folder -> /target/actual-folder', 'Symlink folder detail should match target');
			});
		});
	}
	suite('completion label escaping', () => {
		test('| should escape special characters in file/folder names for POSIX shells', async () => {
			const resourceOptions: TerminalCompletionResourceOptions = {
				cwd: URI.parse('file:///test'),
				showDirectories: true,
				showFiles: true,
				pathSeparator
			};
			validResources = [URI.parse('file:///test')];
			childResources = [
				{ resource: URI.parse('file:///test/[folder1]/'), isDirectory: true },
				{ resource: URI.parse('file:///test/folder 2/'), isDirectory: true },
				{ resource: URI.parse('file:///test/!special$chars&/'), isDirectory: true },
				{ resource: URI.parse('file:///test/!special$chars2&'), isFile: true }
			];
			const result = await terminalCompletionService.resolveResources(resourceOptions, '', 0, provider, capabilities);

			assertCompletions(result, [
				{ label: '.', detail: '/test/' },
				{ label: './[folder1]/', detail: '/test/\[folder1]\/' },
				{ label: './folder\ 2/', detail: '/test/folder\ 2/' },
				{ label: './\!special\$chars\&/', detail: '/test/\!special\$chars\&/' },
				{ label: './\!special\$chars2\&', detail: '/test/\!special\$chars2\&', kind: TerminalCompletionItemKind.File },
				{ label: '../', detail: '/' },
				standardTildeItem,
			], { replacementRange: [0, 0] });
		});

	});

	suite('Provider Configuration', () => {
		// Test class that extends TerminalCompletionService to access protected methods
		class TestTerminalCompletionService extends TerminalCompletionService {
			public getEnabledProviders(providers: ITerminalCompletionProvider[]): ITerminalCompletionProvider[] {
				return super._getEnabledProviders(providers);
			}
		}

		let testTerminalCompletionService: TestTerminalCompletionService;

		setup(() => {
			testTerminalCompletionService = store.add(instantiationService.createInstance(TestTerminalCompletionService));
		});

		// Mock provider for testing
		function createMockProvider(id: string): ITerminalCompletionProvider {
			return {
				id,
				provideCompletions: async () => [{
					label: `completion-from-${id}`,
					kind: TerminalCompletionItemKind.Method,
					replacementRange: [0, 0],
					provider: id
				}]
			};
		}

		test('should enable providers by default when no configuration exists', () => {
			const defaultProvider = createMockProvider('terminal-suggest');
			const newProvider = createMockProvider('new-extension-provider');
			const providers = [defaultProvider, newProvider];

			// Set empty configuration (no provider keys)
			configurationService.setUserConfiguration(TerminalSuggestSettingId.Providers, {});

			const result = testTerminalCompletionService.getEnabledProviders(providers);

			// Both providers should be enabled since they're not explicitly disabled
			assert.strictEqual(result.length, 2, 'Should enable both providers by default');
			assert.ok(result.includes(defaultProvider), 'Should include default provider');
			assert.ok(result.includes(newProvider), 'Should include new provider');
		});

		test('should disable providers when explicitly set to false', () => {
			const provider1 = createMockProvider('provider1');
			const provider2 = createMockProvider('provider2');
			const providers = [provider1, provider2];

			// Disable provider1, leave provider2 unconfigured
			configurationService.setUserConfiguration(TerminalSuggestSettingId.Providers, {
				'provider1': false
			});

			const result = testTerminalCompletionService.getEnabledProviders(providers);

			// Only provider2 should be enabled
			assert.strictEqual(result.length, 1, 'Should enable only one provider');
			assert.ok(result.includes(provider2), 'Should include unconfigured provider');
			assert.ok(!result.includes(provider1), 'Should not include disabled provider');
		});

		test('should enable providers when explicitly set to true', () => {
			const provider1 = createMockProvider('provider1');
			const provider2 = createMockProvider('provider2');
			const providers = [provider1, provider2];

			// Explicitly enable provider1, leave provider2 unconfigured
			configurationService.setUserConfiguration(TerminalSuggestSettingId.Providers, {
				'provider1': true
			});

			const result = testTerminalCompletionService.getEnabledProviders(providers);

			// Both providers should be enabled
			assert.strictEqual(result.length, 2, 'Should enable both providers');
			assert.ok(result.includes(provider1), 'Should include explicitly enabled provider');
			assert.ok(result.includes(provider2), 'Should include unconfigured provider');
		});

		test('should handle mixed configuration correctly', () => {
			const provider1 = createMockProvider('provider1');
			const provider2 = createMockProvider('provider2');
			const provider3 = createMockProvider('provider3');
			const providers = [provider1, provider2, provider3];

			// Mixed configuration: enable provider1, disable provider2, leave provider3 unconfigured
			configurationService.setUserConfiguration(TerminalSuggestSettingId.Providers, {
				'provider1': true,
				'provider2': false
			});

			const result = testTerminalCompletionService.getEnabledProviders(providers);

			// provider1 and provider3 should be enabled, provider2 should be disabled
			assert.strictEqual(result.length, 2, 'Should enable two providers');
			assert.ok(result.includes(provider1), 'Should include explicitly enabled provider');
			assert.ok(result.includes(provider3), 'Should include unconfigured provider');
			assert.ok(!result.includes(provider2), 'Should not include disabled provider');
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/suggest/test/browser/terminalSuggestAddon.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/suggest/test/browser/terminalSuggestAddon.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { strictEqual } from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { PosixShellType, WindowsShellType, GeneralShellType } from '../../../../../../platform/terminal/common/terminal.js';
import { isInlineCompletionSupported } from '../../browser/terminalSuggestAddon.js';

suite('Terminal Suggest Addon - Inline Completion, Shell Type Support', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('should return true for supported shell types', () => {
		strictEqual(isInlineCompletionSupported(PosixShellType.Bash), true);
		strictEqual(isInlineCompletionSupported(PosixShellType.Zsh), true);
		strictEqual(isInlineCompletionSupported(PosixShellType.Fish), true);
		strictEqual(isInlineCompletionSupported(GeneralShellType.PowerShell), true);
		strictEqual(isInlineCompletionSupported(WindowsShellType.GitBash), true);
	});

	test('should return false for unsupported shell types', () => {
		strictEqual(isInlineCompletionSupported(GeneralShellType.NuShell), false);
		strictEqual(isInlineCompletionSupported(GeneralShellType.Julia), false);
		strictEqual(isInlineCompletionSupported(GeneralShellType.Node), false);
		strictEqual(isInlineCompletionSupported(GeneralShellType.Python), false);
		strictEqual(isInlineCompletionSupported(PosixShellType.Sh), false);
		strictEqual(isInlineCompletionSupported(PosixShellType.Csh), false);
		strictEqual(isInlineCompletionSupported(PosixShellType.Ksh), false);
		strictEqual(isInlineCompletionSupported(WindowsShellType.CommandPrompt), false);
		strictEqual(isInlineCompletionSupported(WindowsShellType.Wsl), false);
		strictEqual(isInlineCompletionSupported(GeneralShellType.Python), false);
		strictEqual(isInlineCompletionSupported(undefined), false);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/suggest/test/browser/terminalSuggestConfiguration.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/suggest/test/browser/terminalSuggestConfiguration.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { registerTerminalSuggestProvidersConfiguration } from '../../common/terminalSuggestConfiguration.js';

suite('Terminal Suggest Dynamic Configuration', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('should update configuration when providers change', () => {
		// Test initial state
		registerTerminalSuggestProvidersConfiguration();

		// Test with some providers
		const providers = new Map([
			['terminal-suggest', { id: 'terminal-suggest', description: 'Provides intelligent completions for terminal commands' }],
			['builtinPwsh', { id: 'builtinPwsh', description: 'PowerShell completion provider' }],
			['lsp', { id: 'lsp' }],
			['custom-provider', { id: 'custom-provider' }],
		]);
		registerTerminalSuggestProvidersConfiguration(providers);

		// Test with empty providers
		registerTerminalSuggestProvidersConfiguration();

		// The fact that this doesn't throw means the basic logic works
		assert.ok(true);
	});

	test('should include default providers even when none provided', () => {
		// This should not throw and should set up default configuration
		registerTerminalSuggestProvidersConfiguration(undefined);
		assert.ok(true);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/typeAhead/browser/terminal.typeAhead.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/typeAhead/browser/terminal.typeAhead.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Terminal as RawXtermTerminal } from '@xterm/xterm';
import { DisposableStore, toDisposable } from '../../../../../base/common/lifecycle.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ITerminalContribution, ITerminalInstance, IXtermTerminal } from '../../../terminal/browser/terminal.js';
import { registerTerminalContribution, type ITerminalContributionContext } from '../../../terminal/browser/terminalExtensions.js';
import { TERMINAL_CONFIG_SECTION } from '../../../terminal/common/terminal.js';
import { TerminalTypeAheadSettingId, type ITerminalTypeAheadConfiguration } from '../common/terminalTypeAheadConfiguration.js';
import { TypeAheadAddon } from './terminalTypeAheadAddon.js';

class TerminalTypeAheadContribution extends DisposableStore implements ITerminalContribution {
	static readonly ID = 'terminal.typeAhead';

	static get(instance: ITerminalInstance): TerminalTypeAheadContribution | null {
		return instance.getContribution<TerminalTypeAheadContribution>(TerminalTypeAheadContribution.ID);
	}

	private _addon: TypeAheadAddon | undefined;

	constructor(
		private readonly _ctx: ITerminalContributionContext,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService
	) {
		super();
		this.add(toDisposable(() => this._addon?.dispose()));
	}

	xtermReady(xterm: IXtermTerminal & { raw: RawXtermTerminal }): void {
		this._loadTypeAheadAddon(xterm.raw);
		this.add(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TerminalTypeAheadSettingId.LocalEchoEnabled)) {
				this._loadTypeAheadAddon(xterm.raw);
			}
		}));

		// Reset the addon when the terminal launches or relaunches
		this.add(this._ctx.processManager.onProcessReady(() => {
			this._addon?.reset();
		}));
	}

	private _loadTypeAheadAddon(xterm: RawXtermTerminal): void {
		const enabled = this._configurationService.getValue<ITerminalTypeAheadConfiguration>(TERMINAL_CONFIG_SECTION).localEchoEnabled;
		const isRemote = !!this._ctx.processManager.remoteAuthority;
		if (enabled === 'off' || enabled === 'auto' && !isRemote) {
			this._addon?.dispose();
			this._addon = undefined;
			return;
		}
		if (this._addon) {
			return;
		}
		if (enabled === 'on' || (enabled === 'auto' && isRemote)) {
			this._addon = this._instantiationService.createInstance(TypeAheadAddon, this._ctx.processManager);
			xterm.loadAddon(this._addon);
		}
	}
}

registerTerminalContribution(TerminalTypeAheadContribution.ID, TerminalTypeAheadContribution);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/typeAhead/browser/terminalTypeAheadAddon.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/typeAhead/browser/terminalTypeAheadAddon.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { disposableTimeout } from '../../../../../base/common/async.js';
import { Color, RGBA } from '../../../../../base/common/color.js';
import { debounce } from '../../../../../base/common/decorators.js';
import { Emitter } from '../../../../../base/common/event.js';
import { Disposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { escapeRegExpCharacters } from '../../../../../base/common/strings.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { XtermAttributes, IXtermCore } from '../../../terminal/browser/xterm-private.js';
import { IBeforeProcessDataEvent, ITerminalProcessManager, TERMINAL_CONFIG_SECTION } from '../../../terminal/common/terminal.js';
import type { IBuffer, IBufferCell, IDisposable, ITerminalAddon, Terminal } from '@xterm/xterm';
import { DEFAULT_LOCAL_ECHO_EXCLUDE, type ITerminalTypeAheadConfiguration } from '../common/terminalTypeAheadConfiguration.js';
import { isNumber, type SingleOrMany } from '../../../../../base/common/types.js';

const enum VT {
	Esc = '\x1b',
	Csi = `\x1b[`,
	ShowCursor = `\x1b[?25h`,
	HideCursor = `\x1b[?25l`,
	DeleteChar = `\x1b[X`,
	DeleteRestOfLine = `\x1b[K`,
}

const CSI_STYLE_RE = /^\x1b\[[0-9;]*m/;
const CSI_MOVE_RE = /^\x1b\[?([0-9]*)(;[35])?O?([DC])/;
const NOT_WORD_RE = /[^a-z0-9]/i;

const enum StatsConstants {
	StatsBufferSize = 24,
	StatsSendTelemetryEvery = 1000 * 60 * 5, // how often to collect stats
	StatsMinSamplesToTurnOn = 5,
	StatsMinAccuracyToTurnOn = 0.3,
	StatsToggleOffThreshold = 0.5, // if latency is less than `threshold * this`, turn off
}

/**
 * Codes that should be omitted from sending to the prediction engine and instead omitted directly:
 * - Hide cursor (DECTCEM): We wrap the local echo sequence in hide and show
 *   CSI ? 2 5 l
 * - Show cursor (DECTCEM): We wrap the local echo sequence in hide and show
 *   CSI ? 2 5 h
 * - Device Status Report (DSR): These sequence fire report events from xterm which could cause
 *   double reporting and potentially a stack overflow (#119472)
 *   CSI Ps n
 *   CSI ? Ps n
 */
const PREDICTION_OMIT_RE = /^(\x1b\[(\??25[hl]|\??[0-9;]+n))+/;

const core = (terminal: Terminal): IXtermCore => {
	interface XtermWithCore extends Terminal {
		_core: IXtermCore;
	}
	return (terminal as XtermWithCore)._core;
};
const flushOutput = (terminal: Terminal) => {
	// TODO: Flushing output is not possible anymore without async
};

const enum CursorMoveDirection {
	Back = 'D',
	Forwards = 'C',
}

interface ICoordinate {
	x: number;
	y: number;
	baseY: number;
}

class Cursor implements ICoordinate {
	private _x = 0;
	private _y = 1;
	private _baseY = 1;

	get x() {
		return this._x;
	}

	get y() {
		return this._y;
	}

	get baseY() {
		return this._baseY;
	}

	get coordinate(): ICoordinate {
		return { x: this._x, y: this._y, baseY: this._baseY };
	}

	constructor(
		readonly rows: number,
		readonly cols: number,
		private readonly _buffer: IBuffer
	) {
		this._x = _buffer.cursorX;
		this._y = _buffer.cursorY;
		this._baseY = _buffer.baseY;
	}

	getLine() {
		return this._buffer.getLine(this._y + this._baseY);
	}

	getCell(loadInto?: IBufferCell) {
		return this.getLine()?.getCell(this._x, loadInto);
	}

	moveTo(coordinate: ICoordinate) {
		this._x = coordinate.x;
		this._y = (coordinate.y + coordinate.baseY) - this._baseY;
		return this.moveInstruction();
	}

	clone() {
		const c = new Cursor(this.rows, this.cols, this._buffer);
		c.moveTo(this);
		return c;
	}

	move(x: number, y: number) {
		this._x = x;
		this._y = y;
		return this.moveInstruction();
	}

	shift(x: number = 0, y: number = 0) {
		this._x += x;
		this._y += y;
		return this.moveInstruction();
	}

	moveInstruction() {
		if (this._y >= this.rows) {
			this._baseY += this._y - (this.rows - 1);
			this._y = this.rows - 1;
		} else if (this._y < 0) {
			this._baseY -= this._y;
			this._y = 0;
		}

		return `${VT.Csi}${this._y + 1};${this._x + 1}H`;
	}
}

const moveToWordBoundary = (b: IBuffer, cursor: Cursor, direction: -1 | 1) => {
	let ateLeadingWhitespace = false;
	if (direction < 0) {
		cursor.shift(-1);
	}

	let cell: IBufferCell | undefined;
	while (cursor.x >= 0) {
		cell = cursor.getCell(cell);
		if (!cell?.getCode()) {
			return;
		}

		const chars = cell.getChars();
		if (NOT_WORD_RE.test(chars)) {
			if (ateLeadingWhitespace) {
				break;
			}
		} else {
			ateLeadingWhitespace = true;
		}

		cursor.shift(direction);
	}

	if (direction < 0) {
		cursor.shift(1); // we want to place the cursor after the whitespace starting the word
	}
};

const enum MatchResult {
	/** matched successfully */
	Success,
	/** failed to match */
	Failure,
	/** buffer data, it might match in the future one more data comes in */
	Buffer,
}

export interface IPrediction {
	/**
	 * Whether applying this prediction can modify the style attributes of the
	 * terminal. If so it means we need to reset the cursor style if it's
	 * rolled back.
	 */
	readonly affectsStyle?: boolean;

	/**
	 * If set to false, the prediction will not be cleared if no input is
	 * received from the server.
	 */
	readonly clearAfterTimeout?: boolean;

	/**
	 * Returns a sequence to apply the prediction.
	 * @param buffer to write to
	 * @param cursor position to write the data. Should advance the cursor.
	 * @returns a string to be written to the user terminal, or optionally a
	 * string for the user terminal and real pty.
	 */
	apply(buffer: IBuffer, cursor: Cursor): string;

	/**
	 * Returns a sequence to roll back a previous `apply()` call. If
	 * `rollForwards` is not given, then this is also called if a prediction
	 * is correct before show the user's data.
	 */
	rollback(cursor: Cursor): string;

	/**
	 * If available, this will be called when the prediction is correct.
	 */
	rollForwards(cursor: Cursor, withInput: string): string;

	/**
	 * Returns whether the given input is one expected by this prediction.
	 * @param input reader for the input the PTY is giving
	 * @param lookBehind the last successfully-made prediction, if any
	 */
	matches(input: StringReader, lookBehind?: IPrediction): MatchResult;
}

class StringReader {
	index = 0;

	get remaining() {
		return this._input.length - this.index;
	}

	get eof() {
		return this.index === this._input.length;
	}

	get rest() {
		return this._input.slice(this.index);
	}

	constructor(
		private readonly _input: string
	) { }

	/**
	 * Advances the reader and returns the character if it matches.
	 */
	eatChar(char: string) {
		if (this._input[this.index] !== char) {
			return;
		}

		this.index++;
		return char;
	}

	/**
	 * Advances the reader and returns the string if it matches.
	 */
	eatStr(substr: string) {
		if (this._input.slice(this.index, substr.length) !== substr) {
			return;
		}

		this.index += substr.length;
		return substr;
	}

	/**
	 * Matches and eats the substring character-by-character. If EOF is reached
	 * before the substring is consumed, it will buffer. Index is not moved
	 * if it's not a match.
	 */
	eatGradually(substr: string): MatchResult {
		const prevIndex = this.index;
		for (let i = 0; i < substr.length; i++) {
			if (i > 0 && this.eof) {
				return MatchResult.Buffer;
			}

			if (!this.eatChar(substr[i])) {
				this.index = prevIndex;
				return MatchResult.Failure;
			}
		}

		return MatchResult.Success;
	}

	/**
	 * Advances the reader and returns the regex if it matches.
	 */
	eatRe(re: RegExp) {
		const match = re.exec(this._input.slice(this.index));
		if (!match) {
			return;
		}

		this.index += match[0].length;
		return match;
	}

	/**
	 * Advances the reader and returns the character if the code matches.
	 */
	eatCharCode(min = 0, max = min + 1) {
		const code = this._input.charCodeAt(this.index);
		if (code < min || code >= max) {
			return undefined;
		}

		this.index++;
		return code;
	}
}

/**
 * Preidction which never tests true. Will always discard predictions made
 * after it.
 */
class HardBoundary implements IPrediction {
	readonly clearAfterTimeout = false;

	apply() {
		return '';
	}

	rollback() {
		return '';
	}

	rollForwards() {
		return '';
	}

	matches() {
		return MatchResult.Failure;
	}
}

/**
 * Wraps another prediction. Does not apply the prediction, but will pass
 * through its `matches` request.
 */
class TentativeBoundary implements IPrediction {
	private _appliedCursor?: Cursor;

	constructor(readonly inner: IPrediction) { }

	apply(buffer: IBuffer, cursor: Cursor) {
		this._appliedCursor = cursor.clone();
		this.inner.apply(buffer, this._appliedCursor);
		return '';
	}

	rollback(cursor: Cursor) {
		this.inner.rollback(cursor.clone());
		return '';
	}

	rollForwards(cursor: Cursor, withInput: string) {
		if (this._appliedCursor) {
			cursor.moveTo(this._appliedCursor);
		}

		return withInput;
	}

	matches(input: StringReader) {
		return this.inner.matches(input);
	}
}

const isTenativeCharacterPrediction = (p: unknown): p is (TentativeBoundary & { inner: CharacterPrediction }) =>
	p instanceof TentativeBoundary && p.inner instanceof CharacterPrediction;

/**
 * Prediction for a single alphanumeric character.
 */
class CharacterPrediction implements IPrediction {
	readonly affectsStyle = true;

	appliedAt?: {
		pos: ICoordinate;
		oldAttributes: string;
		oldChar: string;
	};

	constructor(private readonly _style: TypeAheadStyle, private readonly _char: string) { }

	apply(_: IBuffer, cursor: Cursor) {
		const cell = cursor.getCell();
		this.appliedAt = cell
			? { pos: cursor.coordinate, oldAttributes: attributesToSeq(cell), oldChar: cell.getChars() }
			: { pos: cursor.coordinate, oldAttributes: '', oldChar: '' };

		cursor.shift(1);

		return this._style.apply + this._char + this._style.undo;
	}

	rollback(cursor: Cursor) {
		if (!this.appliedAt) {
			return ''; // not applied
		}

		const { oldAttributes, oldChar, pos } = this.appliedAt;
		const r = cursor.moveTo(pos) + (oldChar ? `${oldAttributes}${oldChar}${cursor.moveTo(pos)}` : VT.DeleteChar);
		return r;
	}

	rollForwards(cursor: Cursor, input: string) {
		if (!this.appliedAt) {
			return ''; // not applied
		}

		return cursor.clone().moveTo(this.appliedAt.pos) + input;
	}

	matches(input: StringReader, lookBehind?: IPrediction) {
		const startIndex = input.index;

		// remove any styling CSI before checking the char
		while (input.eatRe(CSI_STYLE_RE)) { }

		if (input.eof) {
			return MatchResult.Buffer;
		}

		if (input.eatChar(this._char)) {
			return MatchResult.Success;
		}

		if (lookBehind instanceof CharacterPrediction) {
			// see #112842
			const sillyZshOutcome = input.eatGradually(`\b${lookBehind._char}${this._char}`);
			if (sillyZshOutcome !== MatchResult.Failure) {
				return sillyZshOutcome;
			}
		}

		input.index = startIndex;
		return MatchResult.Failure;
	}
}

class BackspacePrediction implements IPrediction {
	protected _appliedAt?: {
		pos: ICoordinate;
		oldAttributes: string;
		oldChar: string;
		isLastChar: boolean;
	};

	constructor(private readonly _terminal: Terminal) { }

	apply(_: IBuffer, cursor: Cursor) {
		// at eol if everything to the right is whitespace (zsh will emit a "clear line" code in this case)
		// todo: can be optimized if `getTrimmedLength` is exposed from xterm
		const isLastChar = !cursor.getLine()?.translateToString(undefined, cursor.x).trim();
		const pos = cursor.coordinate;
		const move = cursor.shift(-1);
		const cell = cursor.getCell();
		this._appliedAt = cell
			? { isLastChar, pos, oldAttributes: attributesToSeq(cell), oldChar: cell.getChars() }
			: { isLastChar, pos, oldAttributes: '', oldChar: '' };

		return move + VT.DeleteChar;
	}

	rollback(cursor: Cursor) {
		if (!this._appliedAt) {
			return ''; // not applied
		}

		const { oldAttributes, oldChar, pos } = this._appliedAt;
		if (!oldChar) {
			return cursor.moveTo(pos) + VT.DeleteChar;
		}

		return oldAttributes + oldChar + cursor.moveTo(pos) + attributesToSeq(core(this._terminal)._inputHandler._curAttrData);
	}

	rollForwards() {
		return '';
	}

	matches(input: StringReader) {
		if (this._appliedAt?.isLastChar) {
			const r1 = input.eatGradually(`\b${VT.Csi}K`);
			if (r1 !== MatchResult.Failure) {
				return r1;
			}

			const r2 = input.eatGradually(`\b \b`);
			if (r2 !== MatchResult.Failure) {
				return r2;
			}
		}

		return MatchResult.Failure;
	}
}

class NewlinePrediction implements IPrediction {
	protected _prevPosition?: ICoordinate;

	apply(_: IBuffer, cursor: Cursor) {
		this._prevPosition = cursor.coordinate;
		cursor.move(0, cursor.y + 1);
		return '\r\n';
	}

	rollback(cursor: Cursor) {
		return this._prevPosition ? cursor.moveTo(this._prevPosition) : '';
	}

	rollForwards() {
		return ''; // does not need to rewrite
	}

	matches(input: StringReader) {
		return input.eatGradually('\r\n');
	}
}

/**
 * Prediction when the cursor reaches the end of the line. Similar to newline
 * prediction, but shells handle it slightly differently.
 */
class LinewrapPrediction extends NewlinePrediction implements IPrediction {
	override apply(_: IBuffer, cursor: Cursor) {
		this._prevPosition = cursor.coordinate;
		cursor.move(0, cursor.y + 1);
		return ' \r';
	}

	override matches(input: StringReader) {
		// bash and zshell add a space which wraps in the terminal, then a CR
		const r = input.eatGradually(' \r');
		if (r !== MatchResult.Failure) {
			// zshell additionally adds a clear line after wrapping to be safe -- eat it
			const r2 = input.eatGradually(VT.DeleteRestOfLine);
			return r2 === MatchResult.Buffer ? MatchResult.Buffer : r;
		}

		return input.eatGradually('\r\n');
	}
}

class CursorMovePrediction implements IPrediction {
	private _applied?: {
		rollForward: string;
		prevPosition: number;
		prevAttrs: string;
		amount: number;
	};

	constructor(
		private readonly _direction: CursorMoveDirection,
		private readonly _moveByWords: boolean,
		private readonly _amount: number,
	) { }

	apply(buffer: IBuffer, cursor: Cursor) {
		const prevPosition = cursor.x;
		const currentCell = cursor.getCell();
		const prevAttrs = currentCell ? attributesToSeq(currentCell) : '';

		const { _amount: amount, _direction: direction, _moveByWords: moveByWords } = this;
		const delta = direction === CursorMoveDirection.Back ? -1 : 1;

		const target = cursor.clone();
		if (moveByWords) {
			for (let i = 0; i < amount; i++) {
				moveToWordBoundary(buffer, target, delta);
			}
		} else {
			target.shift(delta * amount);
		}

		this._applied = {
			amount: Math.abs(cursor.x - target.x),
			prevPosition,
			prevAttrs,
			rollForward: cursor.moveTo(target),
		};

		return this._applied.rollForward;
	}

	rollback(cursor: Cursor) {
		if (!this._applied) {
			return '';
		}

		return cursor.move(this._applied.prevPosition, cursor.y) + this._applied.prevAttrs;
	}

	rollForwards() {
		return ''; // does not need to rewrite
	}

	matches(input: StringReader) {
		if (!this._applied) {
			return MatchResult.Failure;
		}

		const direction = this._direction;
		const { amount, rollForward } = this._applied;


		// arg can be omitted to move one character. We don't eatGradually() here
		// or below moves that don't go as far as the cursor would be buffered
		// indefinitely
		if (input.eatStr(`${VT.Csi}${direction}`.repeat(amount))) {
			return MatchResult.Success;
		}

		// \b is the equivalent to moving one character back
		if (direction === CursorMoveDirection.Back) {
			if (input.eatStr(`\b`.repeat(amount))) {
				return MatchResult.Success;
			}
		}

		// check if the cursor position is set absolutely
		if (rollForward) {
			const r = input.eatGradually(rollForward);
			if (r !== MatchResult.Failure) {
				return r;
			}
		}

		// check for a relative move in the direction
		return input.eatGradually(`${VT.Csi}${amount}${direction}`);
	}
}

export class PredictionStats extends Disposable {
	private readonly _stats: [latency: number, correct: boolean][] = [];
	private _index = 0;
	private readonly _addedAtTime = new WeakMap<IPrediction, number>();
	private readonly _changeEmitter = new Emitter<void>();
	readonly onChange = this._changeEmitter.event;

	/**
	 * Gets the percent (0-1) of predictions that were accurate.
	 */
	get accuracy() {
		let correctCount = 0;
		for (const [, correct] of this._stats) {
			if (correct) {
				correctCount++;
			}
		}

		return correctCount / (this._stats.length || 1);
	}

	/**
	 * Gets the number of recorded stats.
	 */
	get sampleSize() {
		return this._stats.length;
	}

	/**
	 * Gets latency stats of successful predictions.
	 */
	get latency() {
		const latencies = this._stats.filter(([, correct]) => correct).map(([s]) => s).sort();

		return {
			count: latencies.length,
			min: latencies[0],
			median: latencies[Math.floor(latencies.length / 2)],
			max: latencies[latencies.length - 1],
		};
	}

	/**
	 * Gets the maximum observed latency.
	 */
	get maxLatency() {
		let max = -Infinity;
		for (const [latency, correct] of this._stats) {
			if (correct) {
				max = Math.max(latency, max);
			}
		}

		return max;
	}

	constructor(timeline: PredictionTimeline) {
		super();
		this._register(timeline.onPredictionAdded(p => this._addedAtTime.set(p, Date.now())));
		this._register(timeline.onPredictionSucceeded(this._pushStat.bind(this, true)));
		this._register(timeline.onPredictionFailed(this._pushStat.bind(this, false)));
	}

	private _pushStat(correct: boolean, prediction: IPrediction) {
		const started = this._addedAtTime.get(prediction)!;
		this._stats[this._index] = [Date.now() - started, correct];
		this._index = (this._index + 1) % StatsConstants.StatsBufferSize;
		this._changeEmitter.fire();
	}
}

export class PredictionTimeline {
	/**
	 * Expected queue of events. Only predictions for the lowest are
	 * written into the terminal.
	 */
	private _expected: ({ gen: number; p: IPrediction })[] = [];

	/**
	 * Current prediction generation.
	 */
	private _currentGen = 0;

	/**
	 * Current cursor position -- kept outside the buffer since it can be ahead
	 * if typing swiftly. The position of the cursor that the user is currently
	 * looking at on their screen (or will be looking at after all pending writes
	 * are flushed.)
	 */
	private _physicalCursor: Cursor | undefined;

	/**
	 * Cursor position taking into account all (possibly not-yet-applied)
	 * predictions. A new prediction inserted, if applied, will be applied at
	 * the position of the tentative cursor.
	 */
	private _tenativeCursor: Cursor | undefined;

	/**
	 * Previously sent data that was buffered and should be prepended to the
	 * next input.
	 */
	private _inputBuffer?: string;

	/**
	 * Whether predictions are echoed to the terminal. If false, predictions
	 * will still be computed internally for latency metrics, but input will
	 * never be adjusted.
	 */
	private _showPredictions = false;

	/**
	 * The last successfully-made prediction.
	 */
	private _lookBehind?: IPrediction;

	private readonly _addedEmitter = new Emitter<IPrediction>();
	readonly onPredictionAdded = this._addedEmitter.event;
	private readonly _failedEmitter = new Emitter<IPrediction>();
	readonly onPredictionFailed = this._failedEmitter.event;
	private readonly _succeededEmitter = new Emitter<IPrediction>();
	readonly onPredictionSucceeded = this._succeededEmitter.event;

	private get _currentGenerationPredictions() {
		return this._expected.filter(({ gen }) => gen === this._expected[0].gen).map(({ p }) => p);
	}

	get isShowingPredictions() {
		return this._showPredictions;
	}

	get length() {
		return this._expected.length;
	}

	constructor(readonly terminal: Terminal, private readonly _style: TypeAheadStyle) { }

	setShowPredictions(show: boolean) {
		if (show === this._showPredictions) {
			return;
		}

		// console.log('set predictions:', show);
		this._showPredictions = show;

		const buffer = this._getActiveBuffer();
		if (!buffer) {
			return;
		}

		const toApply = this._currentGenerationPredictions;
		if (show) {
			this.clearCursor();
			this._style.expectIncomingStyle(toApply.reduce((count, p) => p.affectsStyle ? count + 1 : count, 0));
			this.terminal.write(toApply.map(p => p.apply(buffer, this.physicalCursor(buffer))).join(''));
		} else {
			this.terminal.write(toApply.reverse().map(p => p.rollback(this.physicalCursor(buffer))).join(''));
		}
	}

	/**
	 * Undoes any predictions written and resets expectations.
	 */
	undoAllPredictions() {
		const buffer = this._getActiveBuffer();
		if (this._showPredictions && buffer) {
			this.terminal.write(this._currentGenerationPredictions.reverse()
				.map(p => p.rollback(this.physicalCursor(buffer))).join(''));
		}

		this._expected = [];
	}

	/**
	 * Should be called when input is incoming to the temrinal.
	 */
	beforeServerInput(input: string): string {
		const originalInput = input;
		if (this._inputBuffer) {
			input = this._inputBuffer + input;
			this._inputBuffer = undefined;
		}

		if (!this._expected.length) {
			this._clearPredictionState();
			return input;
		}

		const buffer = this._getActiveBuffer();
		if (!buffer) {
			this._clearPredictionState();
			return input;
		}

		let output = '';

		const reader = new StringReader(input);
		const startingGen = this._expected[0].gen;
		const emitPredictionOmitted = () => {
			const omit = reader.eatRe(PREDICTION_OMIT_RE);
			if (omit) {
				output += omit[0];
			}
		};

		ReadLoop: while (this._expected.length && reader.remaining > 0) {
			emitPredictionOmitted();

			const { p: prediction, gen } = this._expected[0];
			const cursor = this.physicalCursor(buffer);
			const beforeTestReaderIndex = reader.index;
			switch (prediction.matches(reader, this._lookBehind)) {
				case MatchResult.Success: {
					// if the input character matches what the next prediction expected, undo
					// the prediction and write the real character out.
					const eaten = input.slice(beforeTestReaderIndex, reader.index);
					if (gen === startingGen) {
						output += prediction.rollForwards?.(cursor, eaten);
					} else {
						prediction.apply(buffer, this.physicalCursor(buffer)); // move cursor for additional apply
						output += eaten;
					}

					this._succeededEmitter.fire(prediction);
					this._lookBehind = prediction;
					this._expected.shift();
					break;
				}
				case MatchResult.Buffer:
					// on a buffer, store the remaining data and completely read data
					// to be output as normal.
					this._inputBuffer = input.slice(beforeTestReaderIndex);
					reader.index = input.length;
					break ReadLoop;
				case MatchResult.Failure: {
					// on a failure, roll back all remaining items in this generation
					// and clear predictions, since they are no longer valid
					const rollback = this._expected.filter(p => p.gen === startingGen).reverse();
					output += rollback.map(({ p }) => p.rollback(this.physicalCursor(buffer))).join('');
					if (rollback.some(r => r.p.affectsStyle)) {
						// reading the current style should generally be safe, since predictions
						// always restore the style if they modify it.
						output += attributesToSeq(core(this.terminal)._inputHandler._curAttrData);
					}
					this._clearPredictionState();
					this._failedEmitter.fire(prediction);
					break ReadLoop;
				}
			}
		}

		emitPredictionOmitted();

		// Extra data (like the result of running a command) should cause us to
		// reset the cursor
		if (!reader.eof) {
			output += reader.rest;
			this._clearPredictionState();
		}

		// If we passed a generation boundary, apply the current generation's predictions
		if (this._expected.length && startingGen !== this._expected[0].gen) {
			for (const { p, gen } of this._expected) {
				if (gen !== this._expected[0].gen) {
					break;
				}
				if (p.affectsStyle) {
					this._style.expectIncomingStyle();
				}

				output += p.apply(buffer, this.physicalCursor(buffer));
			}
		}

		if (!this._showPredictions) {
			return originalInput;
		}

		if (output.length === 0 || output === input) {
			return output;
		}

		if (this._physicalCursor) {
			output += this._physicalCursor.moveInstruction();
		}

		// prevent cursor flickering while typing
		output = VT.HideCursor + output + VT.ShowCursor;

		return output;
	}

	/**
	 * Clears any expected predictions and stored state. Should be called when
	 * the pty gives us something we don't recognize.
	 */
	private _clearPredictionState() {
		this._expected = [];
		this.clearCursor();
		this._lookBehind = undefined;
	}

	/**
	 * Appends a typeahead prediction.
	 */
	addPrediction(buffer: IBuffer, prediction: IPrediction) {
		this._expected.push({ gen: this._currentGen, p: prediction });
		this._addedEmitter.fire(prediction);

		if (this._currentGen !== this._expected[0].gen) {
			prediction.apply(buffer, this.tentativeCursor(buffer));
			return false;
		}

		const text = prediction.apply(buffer, this.physicalCursor(buffer));
		this._tenativeCursor = undefined; // next read will get or clone the physical cursor

		if (this._showPredictions && text) {
			if (prediction.affectsStyle) {
				this._style.expectIncomingStyle();
			}
			// console.log('predict:', JSON.stringify(text));
			this.terminal.write(text);
		}

		return true;
	}

	/**
	 * Appends a prediction followed by a boundary. The predictions applied
	 * after this one will only be displayed after the give prediction matches
	 * pty output/
	 */
	addBoundary(): void;
	addBoundary(buffer: IBuffer, prediction: IPrediction): boolean;
	addBoundary(buffer?: IBuffer, prediction?: IPrediction) {
		let applied = false;
		if (buffer && prediction) {
			// We apply the prediction so that it's matched against, but wrapped
			// in a tentativeboundary so that it doesn't affect the physical cursor.
			// Then we apply it specifically to the tentative cursor.
			applied = this.addPrediction(buffer, new TentativeBoundary(prediction));
			prediction.apply(buffer, this.tentativeCursor(buffer));
		}
		this._currentGen++;
		return applied;
	}

	/**
	 * Peeks the last prediction written.
	 */
	peekEnd(): IPrediction | undefined {
		return this._expected[this._expected.length - 1]?.p;
	}

	/**
	 * Peeks the first pending prediction.
	 */
	peekStart(): IPrediction | undefined {
		return this._expected[0]?.p;
	}

	/**
	 * Current position of the cursor in the terminal.
	 */
	physicalCursor(buffer: IBuffer) {
		if (!this._physicalCursor) {
			if (this._showPredictions) {
				flushOutput(this.terminal);
			}
			this._physicalCursor = new Cursor(this.terminal.rows, this.terminal.cols, buffer);
		}

		return this._physicalCursor;
	}

	/**
	 * Cursor position if all predictions and boundaries that have been inserted
	 * so far turn out to be successfully predicted.
	 */
	tentativeCursor(buffer: IBuffer) {
		if (!this._tenativeCursor) {
			this._tenativeCursor = this.physicalCursor(buffer).clone();
		}

		return this._tenativeCursor;
	}

	clearCursor() {
		this._physicalCursor = undefined;
		this._tenativeCursor = undefined;
	}

	private _getActiveBuffer() {
		const buffer = this.terminal.buffer.active;
		return buffer.type === 'normal' ? buffer : undefined;
	}
}

/**
 * Gets the escape sequence args to restore state/appearance in the cell.
 */
const attributesToArgs = (cell: XtermAttributes) => {
	if (cell.isAttributeDefault()) { return [0]; }

	const args = [];
	if (cell.isBold()) { args.push(1); }
	if (cell.isDim()) { args.push(2); }
	if (cell.isItalic()) { args.push(3); }
	if (cell.isUnderline()) { args.push(4); }
	if (cell.isBlink()) { args.push(5); }
	if (cell.isInverse()) { args.push(7); }
	if (cell.isInvisible()) { args.push(8); }

	if (cell.isFgRGB()) { args.push(38, 2, cell.getFgColor() >>> 24, (cell.getFgColor() >>> 16) & 0xFF, cell.getFgColor() & 0xFF); }
	if (cell.isFgPalette()) { args.push(38, 5, cell.getFgColor()); }
	if (cell.isFgDefault()) { args.push(39); }

	if (cell.isBgRGB()) { args.push(48, 2, cell.getBgColor() >>> 24, (cell.getBgColor() >>> 16) & 0xFF, cell.getBgColor() & 0xFF); }
	if (cell.isBgPalette()) { args.push(48, 5, cell.getBgColor()); }
	if (cell.isBgDefault()) { args.push(49); }

	return args;
};

/**
 * Gets the escape sequence to restore state/appearance in the cell.
 */
const attributesToSeq = (cell: XtermAttributes) => `${VT.Csi}${attributesToArgs(cell).join(';')}m`;

const arrayHasPrefixAt = <T>(a: ReadonlyArray<T>, ai: number, b: ReadonlyArray<T>) => {
	if (a.length - ai > b.length) {
		return false;
	}

	for (let bi = 0; bi < b.length; bi++, ai++) {
		if (b[ai] !== a[ai]) {
			return false;
		}
	}

	return true;
};

/**
 * @see https://github.com/xtermjs/xterm.js/blob/065eb13a9d3145bea687239680ec9696d9112b8e/src/common/InputHandler.ts#L2127
 */
const getColorWidth = (params: SingleOrMany<number>[], pos: number) => {
	const accu = [0, 0, -1, 0, 0, 0];
	let cSpace = 0;
	let advance = 0;

	do {
		const v = params[pos + advance];
		accu[advance + cSpace] = isNumber(v) ? v : v[0];
		if (!isNumber(v)) {
			let i = 0;
			do {
				if (accu[1] === 5) {
					cSpace = 1;
				}
				accu[advance + i + 1 + cSpace] = v[i];
			} while (++i < v.length && i + advance + 1 + cSpace < accu.length);
			break;
		}
		// exit early if can decide color mode with semicolons
		if ((accu[1] === 5 && advance + cSpace >= 2)
			|| (accu[1] === 2 && advance + cSpace >= 5)) {
			break;
		}
		// offset colorSpace slot for semicolon mode
		if (accu[1]) {
			cSpace = 1;
		}
	} while (++advance + pos < params.length && advance + cSpace < accu.length);

	return advance;
};

class TypeAheadStyle implements IDisposable {
	private static _compileArgs(args: ReadonlyArray<number>) {
		return `${VT.Csi}${args.join(';')}m`;
	}

	/**
	 * Number of typeahead style arguments we expect to read. If this is 0 and
	 * we see a style coming in, we know that the PTY actually wanted to update.
	 */
	private _expectedIncomingStyles = 0;
	private _applyArgs!: ReadonlyArray<number>;
	private _originalUndoArgs!: ReadonlyArray<number>;
	private _undoArgs!: ReadonlyArray<number>;

	apply!: string;
	undo!: string;
	private _csiHandler?: IDisposable;

	constructor(value: ITerminalTypeAheadConfiguration['localEchoStyle'], private readonly _terminal: Terminal) {
		this.onUpdate(value);
	}

	/**
	 * Signals that a style was written to the terminal and we should watch
	 * for it coming in.
	 */
	expectIncomingStyle(n = 1) {
		this._expectedIncomingStyles += n * 2;
	}

	/**
	 * Starts tracking for CSI changes in the terminal.
	 */
	startTracking() {
		this._expectedIncomingStyles = 0;
		this._onDidWriteSGR(attributesToArgs(core(this._terminal)._inputHandler._curAttrData));
		this._csiHandler = this._terminal.parser.registerCsiHandler({ final: 'm' }, args => {
			this._onDidWriteSGR(args);
			return false;
		});
	}

	/**
	 * Stops tracking terminal CSI changes.
	 */
	@debounce(2000)
	debounceStopTracking() {
		this._stopTracking();
	}

	/**
	 * @inheritdoc
	 */
	dispose() {
		this._stopTracking();
	}

	private _stopTracking() {
		this._csiHandler?.dispose();
		this._csiHandler = undefined;
	}

	private _onDidWriteSGR(args: SingleOrMany<number>[]) {
		const originalUndo = this._undoArgs;
		for (let i = 0; i < args.length;) {
			const px = args[i];
			const p = isNumber(px) ? px : px[0];

			if (this._expectedIncomingStyles) {
				if (arrayHasPrefixAt(args, i, this._undoArgs)) {
					this._expectedIncomingStyles--;
					i += this._undoArgs.length;
					continue;
				}
				if (arrayHasPrefixAt(args, i, this._applyArgs)) {
					this._expectedIncomingStyles--;
					i += this._applyArgs.length;
					continue;
				}
			}

			const width = p === 38 || p === 48 || p === 58 ? getColorWidth(args, i) : 1;
			switch (this._applyArgs[0]) {
				case 1:
					if (p === 2) {
						this._undoArgs = [22, 2];
					} else if (p === 22 || p === 0) {
						this._undoArgs = [22];
					}
					break;
				case 2:
					if (p === 1) {
						this._undoArgs = [22, 1];
					} else if (p === 22 || p === 0) {
						this._undoArgs = [22];
					}
					break;
				case 38:
					if (p === 0 || p === 39 || p === 100) {
						this._undoArgs = [39];
					} else if ((p >= 30 && p <= 38) || (p >= 90 && p <= 97)) {
						this._undoArgs = args.slice(i, i + width) as number[];
					}
					break;
				default:
					if (p === this._applyArgs[0]) {
						this._undoArgs = this._applyArgs;
					} else if (p === 0) {
						this._undoArgs = this._originalUndoArgs;
					}
				// no-op
			}

			i += width;
		}

		if (originalUndo !== this._undoArgs) {
			this.undo = TypeAheadStyle._compileArgs(this._undoArgs);
		}
	}

	/**
	 * Updates the current typeahead style.
	 */
	onUpdate(style: ITerminalTypeAheadConfiguration['localEchoStyle']) {
		const { applyArgs, undoArgs } = this._getArgs(style);
		this._applyArgs = applyArgs;
		this._undoArgs = this._originalUndoArgs = undoArgs;
		this.apply = TypeAheadStyle._compileArgs(this._applyArgs);
		this.undo = TypeAheadStyle._compileArgs(this._undoArgs);
	}

	private _getArgs(style: ITerminalTypeAheadConfiguration['localEchoStyle']) {
		switch (style) {
			case 'bold':
				return { applyArgs: [1], undoArgs: [22] };
			case 'dim':
				return { applyArgs: [2], undoArgs: [22] };
			case 'italic':
				return { applyArgs: [3], undoArgs: [23] };
			case 'underlined':
				return { applyArgs: [4], undoArgs: [24] };
			case 'inverted':
				return { applyArgs: [7], undoArgs: [27] };
			default: {
				let color: Color;
				try {
					color = Color.fromHex(style);
				} catch {
					color = new Color(new RGBA(255, 0, 0, 1));
				}

				const { r, g, b } = color.rgba;
				return { applyArgs: [38, 2, r, g, b], undoArgs: [39] };
			}
		}
	}
}

const compileExcludeRegexp = (programs = DEFAULT_LOCAL_ECHO_EXCLUDE) =>
	new RegExp(`\\b(${programs.map(escapeRegExpCharacters).join('|')})\\b`, 'i');

export const enum CharPredictState {
	/** No characters typed on this line yet */
	Unknown,
	/** Has a pending character prediction */
	HasPendingChar,
	/** Character validated on this line */
	Validated,
}

export class TypeAheadAddon extends Disposable implements ITerminalAddon {
	private _typeaheadStyle?: TypeAheadStyle;
	private _typeaheadThreshold: number;
	private _excludeProgramRe: RegExp;
	protected _lastRow?: { y: number; startingX: number; endingX: number; charState: CharPredictState };
	protected _timeline?: PredictionTimeline;
	private _terminalTitle = '';
	stats?: PredictionStats;

	/**
	 * Debounce that clears predictions after a timeout if the PTY doesn't apply them.
	 */
	private _clearPredictionDebounce?: IDisposable;

	constructor(
		private _processManager: ITerminalProcessManager,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
	) {
		super();
		this._typeaheadThreshold = this._configurationService.getValue<ITerminalTypeAheadConfiguration>(TERMINAL_CONFIG_SECTION).localEchoLatencyThreshold;
		this._excludeProgramRe = compileExcludeRegexp(this._configurationService.getValue<ITerminalTypeAheadConfiguration>(TERMINAL_CONFIG_SECTION).localEchoExcludePrograms);
		this._register(toDisposable(() => this._clearPredictionDebounce?.dispose()));
	}

	activate(terminal: Terminal): void {
		const style = this._typeaheadStyle = this._register(new TypeAheadStyle(this._configurationService.getValue<ITerminalTypeAheadConfiguration>(TERMINAL_CONFIG_SECTION).localEchoStyle, terminal));
		const timeline = this._timeline = new PredictionTimeline(terminal, this._typeaheadStyle);
		const stats = this.stats = this._register(new PredictionStats(this._timeline));

		timeline.setShowPredictions(this._typeaheadThreshold === 0);
		this._register(terminal.onData(e => this._onUserData(e)));
		this._register(terminal.onTitleChange(title => {
			this._terminalTitle = title;
			this._reevaluatePredictorState(stats, timeline);
		}));
		this._register(terminal.onResize(() => {
			timeline.setShowPredictions(false);
			timeline.clearCursor();
			this._reevaluatePredictorState(stats, timeline);
		}));
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TERMINAL_CONFIG_SECTION)) {
				style.onUpdate(this._configurationService.getValue<ITerminalTypeAheadConfiguration>(TERMINAL_CONFIG_SECTION).localEchoStyle);
				this._typeaheadThreshold = this._configurationService.getValue<ITerminalTypeAheadConfiguration>(TERMINAL_CONFIG_SECTION).localEchoLatencyThreshold;
				this._excludeProgramRe = compileExcludeRegexp(this._configurationService.getValue<ITerminalTypeAheadConfiguration>(TERMINAL_CONFIG_SECTION).localEchoExcludePrograms);
				this._reevaluatePredictorState(stats, timeline);
			}
		}));
		this._register(this._timeline.onPredictionSucceeded(p => {
			if (this._lastRow?.charState === CharPredictState.HasPendingChar && isTenativeCharacterPrediction(p) && p.inner.appliedAt) {
				if (p.inner.appliedAt.pos.y + p.inner.appliedAt.pos.baseY === this._lastRow.y) {
					this._lastRow.charState = CharPredictState.Validated;
				}
			}
		}));
		this._register(this._processManager.onBeforeProcessData(e => this._onBeforeProcessData(e)));

		let nextStatsSend: Timeout | undefined;
		this._register(stats.onChange(() => {
			if (!nextStatsSend) {
				nextStatsSend = setTimeout(() => {
					this._sendLatencyStats(stats);
					nextStatsSend = undefined;
				}, StatsConstants.StatsSendTelemetryEvery);
			}

			if (timeline.length === 0) {
				style.debounceStopTracking();
			}

			this._reevaluatePredictorState(stats, timeline);
		}));
	}

	reset() {
		this._lastRow = undefined;
	}

	private _deferClearingPredictions() {
		if (!this.stats || !this._timeline) {
			return;
		}

		this._clearPredictionDebounce?.dispose();
		if (this._timeline.length === 0 || this._timeline.peekStart()?.clearAfterTimeout === false) {
			this._clearPredictionDebounce = undefined;
			return;
		}

		this._clearPredictionDebounce = disposableTimeout(
			() => {
				this._timeline?.undoAllPredictions();
				if (this._lastRow?.charState === CharPredictState.HasPendingChar) {
					this._lastRow.charState = CharPredictState.Unknown;
				}
			},
			Math.max(500, this.stats.maxLatency * 3 / 2),
			this._store
		);
	}

	/**
	 * Note on debounce:
	 *
	 * We want to toggle the state only when the user has a pause in their
	 * typing. Otherwise, we could turn this on when the PTY sent data but the
	 * terminal cursor is not updated, causes issues.
	 */
	@debounce(100)
	protected _reevaluatePredictorState(stats: PredictionStats, timeline: PredictionTimeline) {
		this._reevaluatePredictorStateNow(stats, timeline);
	}

	protected _reevaluatePredictorStateNow(stats: PredictionStats, timeline: PredictionTimeline) {
		if (this._excludeProgramRe.test(this._terminalTitle)) {
			timeline.setShowPredictions(false);
		} else if (this._typeaheadThreshold < 0) {
			timeline.setShowPredictions(false);
		} else if (this._typeaheadThreshold === 0) {
			timeline.setShowPredictions(true);
		} else if (stats.sampleSize > StatsConstants.StatsMinSamplesToTurnOn && stats.accuracy > StatsConstants.StatsMinAccuracyToTurnOn) {
			const latency = stats.latency.median;
			if (latency >= this._typeaheadThreshold) {
				timeline.setShowPredictions(true);
			} else if (latency < this._typeaheadThreshold / StatsConstants.StatsToggleOffThreshold) {
				timeline.setShowPredictions(false);
			}
		}
	}

	private _sendLatencyStats(stats: PredictionStats) {
		/* __GDPR__
			"terminalLatencyStats" : {
				"owner": "Tyriar",
				"min" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
				"max" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
				"median" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
				"count" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
				"predictionAccuracy" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true }
			}
		 */
		this._telemetryService.publicLog('terminalLatencyStats', {
			...stats.latency,
			predictionAccuracy: stats.accuracy,
		});
	}

	private _onUserData(data: string): void {
		if (this._timeline?.terminal.buffer.active.type !== 'normal') {
			return;
		}

		// console.log('user data:', JSON.stringify(data));

		const terminal = this._timeline.terminal;
		const buffer = terminal.buffer.active;

		// Detect programs like git log/less that use the normal buffer but don't
		// take input by deafult (fixes #109541)
		if (buffer.cursorX === 1 && buffer.cursorY === terminal.rows - 1) {
			if (buffer.getLine(buffer.cursorY + buffer.baseY)?.getCell(0)?.getChars() === ':') {
				return;
			}
		}

		// the following code guards the terminal prompt to avoid being able to
		// arrow or backspace-into the prompt. Record the lowest X value at which
		// the user gave input, and mark all additions before that as tentative.
		const actualY = buffer.baseY + buffer.cursorY;
		if (actualY !== this._lastRow?.y) {
			this._lastRow = { y: actualY, startingX: buffer.cursorX, endingX: buffer.cursorX, charState: CharPredictState.Unknown };
		} else {
			this._lastRow.startingX = Math.min(this._lastRow.startingX, buffer.cursorX);
			this._lastRow.endingX = Math.max(this._lastRow.endingX, this._timeline.physicalCursor(buffer).x);
		}

		const addLeftNavigating = (p: IPrediction) =>
			this._timeline!.tentativeCursor(buffer).x <= this._lastRow!.startingX
				? this._timeline!.addBoundary(buffer, p)
				: this._timeline!.addPrediction(buffer, p);

		const addRightNavigating = (p: IPrediction) =>
			this._timeline!.tentativeCursor(buffer).x >= this._lastRow!.endingX - 1
				? this._timeline!.addBoundary(buffer, p)
				: this._timeline!.addPrediction(buffer, p);

		/** @see https://github.com/xtermjs/xterm.js/blob/1913e9512c048e3cf56bb5f5df51bfff6899c184/src/common/input/Keyboard.ts */
		const reader = new StringReader(data);
		while (reader.remaining > 0) {
			if (reader.eatCharCode(127)) { // backspace
				const previous = this._timeline.peekEnd();
				if (previous && previous instanceof CharacterPrediction) {
					this._timeline.addBoundary();
				}

				// backspace must be able to read the previously-written character in
				// the event that it needs to undo it
				if (this._timeline.isShowingPredictions) {
					flushOutput(this._timeline.terminal);
				}

				if (this._timeline.tentativeCursor(buffer).x <= this._lastRow.startingX) {
					this._timeline.addBoundary(buffer, new BackspacePrediction(this._timeline.terminal));
				} else {
					// Backspace decrements our ability to go right.
					this._lastRow.endingX--;
					this._timeline.addPrediction(buffer, new BackspacePrediction(this._timeline.terminal));
				}

				continue;
			}

			if (reader.eatCharCode(32, 126)) { // alphanum
				const char = data[reader.index - 1];
				const prediction = new CharacterPrediction(this._typeaheadStyle!, char);
				if (this._lastRow.charState === CharPredictState.Unknown) {
					this._timeline.addBoundary(buffer, prediction);
					this._lastRow.charState = CharPredictState.HasPendingChar;
				} else {
					this._timeline.addPrediction(buffer, prediction);
				}

				if (this._timeline.tentativeCursor(buffer).x >= terminal.cols) {
					this._timeline.addBoundary(buffer, new LinewrapPrediction());
				}
				continue;
			}

			const cursorMv = reader.eatRe(CSI_MOVE_RE);
			if (cursorMv) {
				const direction = cursorMv[3] as CursorMoveDirection;
				const p = new CursorMovePrediction(direction, !!cursorMv[2], Number(cursorMv[1]) || 1);
				if (direction === CursorMoveDirection.Back) {
					addLeftNavigating(p);
				} else {
					addRightNavigating(p);
				}
				continue;
			}

			if (reader.eatStr(`${VT.Esc}f`)) {
				addRightNavigating(new CursorMovePrediction(CursorMoveDirection.Forwards, true, 1));
				continue;
			}

			if (reader.eatStr(`${VT.Esc}b`)) {
				addLeftNavigating(new CursorMovePrediction(CursorMoveDirection.Back, true, 1));
				continue;
			}

			if (reader.eatChar('\r') && buffer.cursorY < terminal.rows - 1) {
				this._timeline.addPrediction(buffer, new NewlinePrediction());
				continue;
			}

			// something else
			this._timeline.addBoundary(buffer, new HardBoundary());
			break;
		}

		if (this._timeline.length === 1) {
			this._deferClearingPredictions();
			this._typeaheadStyle!.startTracking();
		}
	}

	private _onBeforeProcessData(event: IBeforeProcessDataEvent): void {
		if (!this._timeline) {
			return;
		}

		// console.log('incoming data:', JSON.stringify(event.data));
		event.data = this._timeline.beforeServerInput(event.data);
		// console.log('emitted data:', JSON.stringify(event.data));

		this._deferClearingPredictions();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/typeAhead/common/terminalTypeAheadConfiguration.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/typeAhead/common/terminalTypeAheadConfiguration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IStringDictionary } from '../../../../../base/common/collections.js';
import { localize } from '../../../../../nls.js';
import type { IConfigurationPropertySchema } from '../../../../../platform/configuration/common/configurationRegistry.js';

export const DEFAULT_LOCAL_ECHO_EXCLUDE: ReadonlyArray<string> = ['vim', 'vi', 'nano', 'tmux'];

export const enum TerminalTypeAheadSettingId {
	LocalEchoLatencyThreshold = 'terminal.integrated.localEchoLatencyThreshold',
	LocalEchoEnabled = 'terminal.integrated.localEchoEnabled',
	LocalEchoExcludePrograms = 'terminal.integrated.localEchoExcludePrograms',
	LocalEchoStyle = 'terminal.integrated.localEchoStyle',
}

export interface ITerminalTypeAheadConfiguration {
	localEchoLatencyThreshold: number;
	localEchoExcludePrograms: ReadonlyArray<string>;
	localEchoEnabled: 'auto' | 'on' | 'off';
	localEchoStyle: 'bold' | 'dim' | 'italic' | 'underlined' | 'inverted' | string;
}

export const terminalTypeAheadConfiguration: IStringDictionary<IConfigurationPropertySchema> = {
	[TerminalTypeAheadSettingId.LocalEchoLatencyThreshold]: {
		description: localize('terminal.integrated.localEchoLatencyThreshold', "Length of network delay, in milliseconds, where local edits will be echoed on the terminal without waiting for server acknowledgement. If '0', local echo will always be on, and if '-1' it will be disabled."),
		type: 'integer',
		minimum: -1,
		default: 30,
		tags: ['preview'],
	},
	[TerminalTypeAheadSettingId.LocalEchoEnabled]: {
		markdownDescription: localize('terminal.integrated.localEchoEnabled', "When local echo should be enabled. This will override {0}", '`#terminal.integrated.localEchoLatencyThreshold#`'),
		type: 'string',
		enum: ['on', 'off', 'auto'],
		enumDescriptions: [
			localize('terminal.integrated.localEchoEnabled.on', "Always enabled"),
			localize('terminal.integrated.localEchoEnabled.off', "Always disabled"),
			localize('terminal.integrated.localEchoEnabled.auto', "Enabled only for remote workspaces")
		],
		default: 'off',
		tags: ['preview'],
	},
	[TerminalTypeAheadSettingId.LocalEchoExcludePrograms]: {
		description: localize('terminal.integrated.localEchoExcludePrograms', "Local echo will be disabled when any of these program names are found in the terminal title."),
		type: 'array',
		items: {
			type: 'string',
			uniqueItems: true
		},
		default: DEFAULT_LOCAL_ECHO_EXCLUDE,
		tags: ['preview'],
	},
	[TerminalTypeAheadSettingId.LocalEchoStyle]: {
		description: localize('terminal.integrated.localEchoStyle', "Terminal style of locally echoed text; either a font style or an RGB color."),
		default: 'dim',
		anyOf: [
			{
				enum: ['bold', 'dim', 'italic', 'underlined', 'inverted', '#ff0000'],
			},
			{
				type: 'string',
				format: 'color-hex',
			}
		],
		tags: ['preview'],
	},
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/typeAhead/test/browser/terminalTypeAhead.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/typeAhead/test/browser/terminalTypeAhead.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import type { IBuffer, Terminal } from '@xterm/xterm';
import { SinonStub, stub, useFakeTimers } from 'sinon';
import { Emitter } from '../../../../../../base/common/event.js';
import { CharPredictState, IPrediction, PredictionStats, TypeAheadAddon } from '../../browser/terminalTypeAheadAddon.js';
import { IBeforeProcessDataEvent, ITerminalProcessManager } from '../../../../terminal/common/terminal.js';
import { ITelemetryService } from '../../../../../../platform/telemetry/common/telemetry.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { DEFAULT_LOCAL_ECHO_EXCLUDE, type ITerminalTypeAheadConfiguration } from '../../common/terminalTypeAheadConfiguration.js';
import { isString } from '../../../../../../base/common/types.js';

const CSI = `\x1b[`;

const enum CursorMoveDirection {
	Back = 'D',
	Forwards = 'C',
}

suite('Workbench - Terminal Typeahead', () => {
	const ds = ensureNoDisposablesAreLeakedInTestSuite();

	suite('PredictionStats', () => {
		let stats: PredictionStats;
		let add: Emitter<IPrediction>;
		let succeed: Emitter<IPrediction>;
		let fail: Emitter<IPrediction>;

		setup(() => {
			add = ds.add(new Emitter<IPrediction>());
			succeed = ds.add(new Emitter<IPrediction>());
			fail = ds.add(new Emitter<IPrediction>());

			// eslint-disable-next-line local/code-no-any-casts
			stats = ds.add(new PredictionStats({
				onPredictionAdded: add.event,
				onPredictionSucceeded: succeed.event,
				onPredictionFailed: fail.event,
			} as any));
		});

		test('creates sane data', () => {
			const stubs = createPredictionStubs(5);
			const clock = useFakeTimers();
			try {
				for (const s of stubs) { add.fire(s); }

				for (let i = 0; i < stubs.length; i++) {
					clock.tick(100);
					(i % 2 ? fail : succeed).fire(stubs[i]);
				}

				assert.strictEqual(stats.accuracy, 3 / 5);
				assert.strictEqual(stats.sampleSize, 5);
				assert.deepStrictEqual(stats.latency, {
					count: 3,
					min: 100,
					max: 500,
					median: 300
				});
			} finally {
				clock.restore();
			}
		});

		test('circular buffer', () => {
			const bufferSize = 24;
			const stubs = createPredictionStubs(bufferSize * 2);

			for (const s of stubs.slice(0, bufferSize)) { add.fire(s); succeed.fire(s); }
			assert.strictEqual(stats.accuracy, 1);

			for (const s of stubs.slice(bufferSize, bufferSize * 3 / 2)) { add.fire(s); fail.fire(s); }
			assert.strictEqual(stats.accuracy, 0.5);

			for (const s of stubs.slice(bufferSize * 3 / 2)) { add.fire(s); fail.fire(s); }
			assert.strictEqual(stats.accuracy, 0);
		});
	});

	suite('timeline', () => {
		let onBeforeProcessData: Emitter<IBeforeProcessDataEvent>;
		let publicLog: SinonStub;
		let config: ITerminalTypeAheadConfiguration;
		let addon: TestTypeAheadAddon;

		const predictedHelloo = [
			`${CSI}?25l`, // hide cursor
			`${CSI}2;7H`, // move cursor
			'o', // new character
			`${CSI}2;8H`, // place cursor back at end of line
			`${CSI}?25h`, // show cursor
		].join('');

		const expectProcessed = (input: string, output: string) => {
			const evt = { data: input };
			onBeforeProcessData.fire(evt);
			assert.strictEqual(JSON.stringify(evt.data), JSON.stringify(output));
		};

		setup(() => {
			onBeforeProcessData = ds.add(new Emitter<IBeforeProcessDataEvent>());
			config = upcastPartial<ITerminalTypeAheadConfiguration>({
				localEchoStyle: 'italic',
				localEchoLatencyThreshold: 0,
				localEchoExcludePrograms: DEFAULT_LOCAL_ECHO_EXCLUDE,
			});
			publicLog = stub();
			addon = new TestTypeAheadAddon(
				upcastPartial<ITerminalProcessManager>({ onBeforeProcessData: onBeforeProcessData.event }),
				new TestConfigurationService({ terminal: { integrated: { ...config } } }),
				upcastPartial<ITelemetryService>({ publicLog })
			);
			addon.unlockMakingPredictions();
		});

		teardown(() => {
			addon.dispose();
		});

		test('predicts a single character', () => {
			const t = ds.add(createMockTerminal({ lines: ['hello|'] }));
			addon.activate(t.terminal);
			t.onData('o');
			t.expectWritten(`${CSI}3mo${CSI}23m`);
		});

		test('validates character prediction', () => {
			const t = ds.add(createMockTerminal({ lines: ['hello|'] }));
			addon.activate(t.terminal);
			t.onData('o');
			expectProcessed('o', predictedHelloo);
			assert.strictEqual(addon.stats?.accuracy, 1);
		});

		test('validates zsh prediction (#112842)', () => {
			const t = ds.add(createMockTerminal({ lines: ['hello|'] }));
			addon.activate(t.terminal);
			t.onData('o');
			expectProcessed('o', predictedHelloo);

			t.onData('x');
			expectProcessed('\box', [
				`${CSI}?25l`, // hide cursor
				`${CSI}2;8H`, // move cursor
				'\box', // new data
				`${CSI}2;9H`, // place cursor back at end of line
				`${CSI}?25h`, // show cursor
			].join(''));
			assert.strictEqual(addon.stats?.accuracy, 1);
		});

		test('does not validate zsh prediction on differing lookbehindn (#112842)', () => {
			const t = ds.add(createMockTerminal({ lines: ['hello|'] }));
			addon.activate(t.terminal);
			t.onData('o');
			expectProcessed('o', predictedHelloo);

			t.onData('x');
			expectProcessed('\bqx', [
				`${CSI}?25l`, // hide cursor
				`${CSI}2;8H`, // move cursor cursor
				`${CSI}X`, // delete character
				`${CSI}0m`, // reset style
				'\bqx', // new data
				`${CSI}?25h`, // show cursor
			].join(''));
			assert.strictEqual(addon.stats?.accuracy, 0.5);
		});

		test('rolls back character prediction', () => {
			const t = ds.add(createMockTerminal({ lines: ['hello|'] }));
			addon.activate(t.terminal);
			t.onData('o');

			expectProcessed('q', [
				`${CSI}?25l`, // hide cursor
				`${CSI}2;7H`, // move cursor cursor
				`${CSI}X`, // delete character
				`${CSI}0m`, // reset style
				'q', // new character
				`${CSI}?25h`, // show cursor
			].join(''));
			assert.strictEqual(addon.stats?.accuracy, 0);
		});

		test('handles left arrow when we hit the boundary', () => {
			const t = ds.add(createMockTerminal({ lines: ['|'] }));
			addon.activate(t.terminal);
			addon.unlockNavigating();

			const cursorXBefore = addon.physicalCursor(t.terminal.buffer.active)?.x!;
			t.onData(`${CSI}${CursorMoveDirection.Back}`);
			t.expectWritten('');

			// Trigger rollback because we don't expect this data
			onBeforeProcessData.fire({ data: 'xy' });

			assert.strictEqual(
				addon.physicalCursor(t.terminal.buffer.active)?.x,
				// The cursor should not have changed because we've hit the
				// boundary (start of prompt)
				cursorXBefore);
		});

		test('handles right arrow when we hit the boundary', () => {
			const t = ds.add(createMockTerminal({ lines: ['|'] }));
			addon.activate(t.terminal);
			addon.unlockNavigating();

			const cursorXBefore = addon.physicalCursor(t.terminal.buffer.active)?.x!;
			t.onData(`${CSI}${CursorMoveDirection.Forwards}`);
			t.expectWritten('');

			// Trigger rollback because we don't expect this data
			onBeforeProcessData.fire({ data: 'xy' });

			assert.strictEqual(
				addon.physicalCursor(t.terminal.buffer.active)?.x,
				// The cursor should not have changed because we've hit the
				// boundary (end of prompt)
				cursorXBefore);
		});

		test('internal cursor state is reset when all predictions are undone', () => {
			const t = ds.add(createMockTerminal({ lines: ['|'] }));
			addon.activate(t.terminal);
			addon.unlockNavigating();

			const cursorXBefore = addon.physicalCursor(t.terminal.buffer.active)?.x!;
			t.onData(`${CSI}${CursorMoveDirection.Back}`);
			t.expectWritten('');
			addon.undoAllPredictions();

			assert.strictEqual(
				addon.physicalCursor(t.terminal.buffer.active)?.x,
				// The cursor should not have changed because we've hit the
				// boundary (start of prompt)
				cursorXBefore);
		});

		test('restores cursor graphics mode', () => {
			const t = ds.add(createMockTerminal({
				lines: ['hello|'],
				cursorAttrs: { isAttributeDefault: false, isBold: true, isFgPalette: true, getFgColor: 1 },
			}));
			addon.activate(t.terminal);
			t.onData('o');

			expectProcessed('q', [
				`${CSI}?25l`, // hide cursor
				`${CSI}2;7H`, // move cursor cursor
				`${CSI}X`, // delete character
				`${CSI}1;38;5;1m`, // reset style
				'q', // new character
				`${CSI}?25h`, // show cursor
			].join(''));
			assert.strictEqual(addon.stats?.accuracy, 0);
		});

		test('validates against and applies graphics mode on predicted', () => {
			const t = ds.add(createMockTerminal({ lines: ['hello|'] }));
			addon.activate(t.terminal);
			t.onData('o');
			expectProcessed(`${CSI}4mo`, [
				`${CSI}?25l`, // hide cursor
				`${CSI}2;7H`, // move cursor
				`${CSI}4m`, // new PTY's style
				'o', // new character
				`${CSI}2;8H`, // place cursor back at end of line
				`${CSI}?25h`, // show cursor
			].join(''));
			assert.strictEqual(addon.stats?.accuracy, 1);
		});

		test('ignores cursor hides or shows', () => {
			const t = ds.add(createMockTerminal({ lines: ['hello|'] }));
			addon.activate(t.terminal);
			t.onData('o');
			expectProcessed(`${CSI}?25lo${CSI}?25h`, [
				`${CSI}?25l`, // hide cursor from PTY
				`${CSI}?25l`, // hide cursor
				`${CSI}2;7H`, // move cursor
				'o', // new character
				`${CSI}?25h`, // show cursor from PTY
				`${CSI}2;8H`, // place cursor back at end of line
				`${CSI}?25h`, // show cursor
			].join(''));
			assert.strictEqual(addon.stats?.accuracy, 1);
		});

		test('matches backspace at EOL (bash style)', () => {
			const t = ds.add(createMockTerminal({ lines: ['hello|'] }));
			addon.activate(t.terminal);
			t.onData('\x7F');
			expectProcessed(`\b${CSI}K`, `\b${CSI}K`);
			assert.strictEqual(addon.stats?.accuracy, 1);
		});

		test('matches backspace at EOL (zsh style)', () => {
			const t = ds.add(createMockTerminal({ lines: ['hello|'] }));
			addon.activate(t.terminal);
			t.onData('\x7F');
			expectProcessed('\b \b', '\b \b');
			assert.strictEqual(addon.stats?.accuracy, 1);
		});

		test('gradually matches backspace', () => {
			const t = ds.add(createMockTerminal({ lines: ['hello|'] }));
			addon.activate(t.terminal);
			t.onData('\x7F');
			expectProcessed('\b', '');
			expectProcessed(' \b', '\b \b');
			assert.strictEqual(addon.stats?.accuracy, 1);
		});

		test('restores old character after invalid backspace', () => {
			const t = ds.add(createMockTerminal({ lines: ['hel|lo'] }));
			addon.activate(t.terminal);
			addon.unlockNavigating();
			t.onData('\x7F');
			t.expectWritten(`${CSI}2;4H${CSI}X`);
			expectProcessed('x', `${CSI}?25l${CSI}0ml${CSI}2;5H${CSI}0mx${CSI}?25h`);
			assert.strictEqual(addon.stats?.accuracy, 0);
		});

		test('waits for validation before deleting to left of cursor', () => {
			const t = ds.add(createMockTerminal({ lines: ['hello|'] }));
			addon.activate(t.terminal);

			// initially should not backspace (until the server confirms it)
			t.onData('\x7F');
			t.expectWritten('');
			expectProcessed('\b \b', '\b \b');
			t.cursor.x--;

			// enter input on the column...
			t.onData('o');
			onBeforeProcessData.fire({ data: 'o' });
			t.cursor.x++;
			t.clearWritten();

			// now that the column is 'unlocked', we should be able to predict backspace on it
			t.onData('\x7F');
			t.expectWritten(`${CSI}2;6H${CSI}X`);
		});

		test('waits for first valid prediction on a line', () => {
			const t = ds.add(createMockTerminal({ lines: ['hello|'] }));
			addon.lockMakingPredictions();
			addon.activate(t.terminal);

			t.onData('o');
			t.expectWritten('');
			expectProcessed('o', 'o');

			t.onData('o');
			t.expectWritten(`${CSI}3mo${CSI}23m`);
		});

		test('disables on title change', () => {
			const t = ds.add(createMockTerminal({ lines: ['hello|'] }));
			addon.activate(t.terminal);

			addon.reevaluateNow();
			assert.strictEqual(addon.isShowing, true, 'expected to show initially');

			t.onTitleChange.fire('foo - VIM.exe');
			addon.reevaluateNow();
			assert.strictEqual(addon.isShowing, false, 'expected to hide when vim is open');

			t.onTitleChange.fire('foo - git.exe');
			addon.reevaluateNow();
			assert.strictEqual(addon.isShowing, true, 'expected to show again after vim closed');
		});

		test('adds line wrap prediction even if behind a boundary', () => {
			const t = ds.add(createMockTerminal({ lines: ['hello|'] }));
			addon.lockMakingPredictions();
			addon.activate(t.terminal);

			t.onData('hi'.repeat(50));
			t.expectWritten('');
			expectProcessed('hi', [
				`${CSI}?25l`, // hide cursor
				'hi', // this greeting characters
				...new Array(36).fill(`${CSI}3mh${CSI}23m${CSI}3mi${CSI}23m`), // rest of the greetings that fit on this line
				`${CSI}2;81H`, // move to end of line
				`${CSI}?25h`
			].join(''));
		});
	});
});

class TestTypeAheadAddon extends TypeAheadAddon {
	unlockMakingPredictions() {
		this._lastRow = { y: 1, startingX: 100, endingX: 100, charState: CharPredictState.Validated };
	}

	lockMakingPredictions() {
		this._lastRow = undefined;
	}

	unlockNavigating() {
		this._lastRow = { y: 1, startingX: 1, endingX: 1, charState: CharPredictState.Validated };
	}

	reevaluateNow() {
		this._reevaluatePredictorStateNow(this.stats!, this._timeline!);
	}

	get isShowing() {
		return !!this._timeline?.isShowingPredictions;
	}

	undoAllPredictions() {
		this._timeline?.undoAllPredictions();
	}

	physicalCursor(buffer: IBuffer) {
		return this._timeline?.physicalCursor(buffer);
	}

	tentativeCursor(buffer: IBuffer) {
		return this._timeline?.tentativeCursor(buffer);
	}
}

function upcastPartial<T>(v: Partial<T>): T {
	return v as T;
}

function createPredictionStubs(n: number) {
	return new Array(n).fill(0).map(stubPrediction);
}

function stubPrediction(): IPrediction {
	return {
		apply: () => '',
		rollback: () => '',
		matches: () => 0,
		rollForwards: () => '',
	};
}

function createMockTerminal({ lines, cursorAttrs }: {
	lines: string[];
	cursorAttrs?: any;
}) {
	const ds = new DisposableStore();
	const written: string[] = [];
	const cursor = { y: 1, x: 1 };
	const onTitleChange = ds.add(new Emitter<string>());
	const onData = ds.add(new Emitter<string>());
	const csiEmitter = ds.add(new Emitter<number[]>());

	for (let y = 0; y < lines.length; y++) {
		const line = lines[y];
		if (line.includes('|')) {
			cursor.y = y + 1;
			cursor.x = line.indexOf('|') + 1;
			lines[y] = line.replace('|', ''); // CodeQL [SM02383] replacing the first occurrence is intended
			break;
		}
	}

	return {
		written,
		cursor,
		expectWritten: (s: string) => {
			assert.strictEqual(JSON.stringify(written.join('')), JSON.stringify(s));
			written.splice(0, written.length);
		},
		clearWritten: () => written.splice(0, written.length),
		onData: (s: string) => onData.fire(s),
		csiEmitter,
		onTitleChange,
		dispose: () => ds.dispose(),
		terminal: {
			cols: 80,
			rows: 5,
			onResize: new Emitter<void>().event,
			onData: onData.event,
			onTitleChange: onTitleChange.event,
			parser: {
				registerCsiHandler(_: unknown, callback: () => void) {
					ds.add(csiEmitter.event(callback));
				},
			},
			write(line: string) {
				written.push(line);
			},
			_core: {
				_inputHandler: {
					_curAttrData: mockCell('', cursorAttrs)
				},
				writeSync() {

				}
			},
			buffer: {
				active: {
					type: 'normal',
					baseY: 0,
					get cursorY() { return cursor.y; },
					get cursorX() { return cursor.x; },
					getLine(y: number) {
						const s = lines[y - 1] || '';
						return {
							length: s.length,
							getCell: (x: number) => mockCell(s[x - 1] || ''),
							translateToString: (trim: boolean, start = 0, end = s.length) => {
								const out = s.slice(start, end);
								return trim ? out.trimRight() : out;
							},
						};
					},
				}
			}
		} as unknown as Terminal
	};
}

function mockCell(char: string, attrs: { [key: string]: unknown } = {}) {
	return new Proxy({}, {
		get(_, prop) {
			if (isString(prop) && attrs.hasOwnProperty(prop)) {
				return () => attrs[prop];
			}

			switch (prop) {
				case 'getWidth':
					return () => 1;
				case 'getChars':
					return () => char;
				case 'getCode':
					return () => char.charCodeAt(0) || 0;
				case 'isAttributeDefault':
					return () => true;
				default:
					return String(prop).startsWith('is') ? (() => false) : (() => 0);
			}
		},
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/voice/browser/terminal.voice.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/voice/browser/terminal.voice.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerTerminalVoiceActions } from './terminalVoiceActions.js';

registerTerminalVoiceActions();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/voice/browser/terminalVoice.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/voice/browser/terminalVoice.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RunOnceScheduler } from '../../../../../base/common/async.js';
import { CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Disposable, DisposableStore, toDisposable } from '../../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { isNumber } from '../../../../../base/common/types.js';
import { localize } from '../../../../../nls.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { SpeechTimeoutDefault } from '../../../accessibility/browser/accessibilityConfiguration.js';
import { ISpeechService, AccessibilityVoiceSettingId, ISpeechToTextEvent, SpeechToTextStatus } from '../../../speech/common/speechService.js';
import type { IMarker, IDecoration } from '@xterm/xterm';
import { alert } from '../../../../../base/browser/ui/aria/aria.js';
import { ITerminalService } from '../../../terminal/browser/terminal.js';
import { TerminalContextKeys } from '../../../terminal/common/terminalContextKey.js';


const symbolMap: { [key: string]: string } = {
	'Ampersand': '&',
	'ampersand': '&',
	'Dollar': '$',
	'dollar': '$',
	'Percent': '%',
	'percent': '%',
	'Asterisk': '*',
	'asterisk': '*',
	'Plus': '+',
	'plus': '+',
	'Equals': '=',
	'equals': '=',
	'Exclamation': '!',
	'exclamation': '!',
	'Slash': '/',
	'slash': '/',
	'Backslash': '\\',
	'backslash': '\\',
	'Dot': '.',
	'dot': '.',
	'Period': '.',
	'period': '.',
	'Quote': '\'',
	'quote': '\'',
	'double quote': '"',
	'Double quote': '"',
};

export class TerminalVoiceSession extends Disposable {
	private _input: string = '';
	private _ghostText: IDecoration | undefined;
	private _decoration: IDecoration | undefined;
	private _marker: IMarker | undefined;
	private _ghostTextMarker: IMarker | undefined;
	private static _instance: TerminalVoiceSession | undefined = undefined;
	private _acceptTranscriptionScheduler: RunOnceScheduler | undefined;
	private readonly _terminalDictationInProgress: IContextKey<boolean>;
	static getInstance(instantiationService: IInstantiationService): TerminalVoiceSession {
		if (!TerminalVoiceSession._instance) {
			TerminalVoiceSession._instance = instantiationService.createInstance(TerminalVoiceSession);
		}

		return TerminalVoiceSession._instance;
	}
	private _cancellationTokenSource: CancellationTokenSource | undefined;
	private readonly _disposables: DisposableStore;
	constructor(
		@ISpeechService private readonly _speechService: ISpeechService,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
	) {
		super();
		this._register(this._terminalService.onDidChangeActiveInstance(() => this.stop()));
		this._register(this._terminalService.onDidDisposeInstance(() => this.stop()));
		this._disposables = this._register(new DisposableStore());
		this._terminalDictationInProgress = TerminalContextKeys.terminalDictationInProgress.bindTo(contextKeyService);
	}

	async start(): Promise<void> {
		this.stop();
		let voiceTimeout = this._configurationService.getValue<number>(AccessibilityVoiceSettingId.SpeechTimeout);
		if (!isNumber(voiceTimeout) || voiceTimeout < 0) {
			voiceTimeout = SpeechTimeoutDefault;
		}
		this._acceptTranscriptionScheduler = this._disposables.add(new RunOnceScheduler(() => {
			this._sendText();
			this.stop();
		}, voiceTimeout));
		this._cancellationTokenSource = new CancellationTokenSource();
		this._register(toDisposable(() => this._cancellationTokenSource?.dispose(true)));
		const session = await this._speechService.createSpeechToTextSession(this._cancellationTokenSource?.token, 'terminal');

		this._disposables.add(session.onDidChange((e) => {
			if (this._cancellationTokenSource?.token.isCancellationRequested) {
				return;
			}
			switch (e.status) {
				case SpeechToTextStatus.Started:
					this._terminalDictationInProgress.set(true);
					if (!this._decoration) {
						this._createDecoration();
					}
					break;
				case SpeechToTextStatus.Recognizing: {
					this._updateInput(e);
					this._renderGhostText(e);
					this._updateDecoration();
					if (voiceTimeout > 0) {
						this._acceptTranscriptionScheduler!.cancel();
					}
					break;
				}
				case SpeechToTextStatus.Recognized:
					this._updateInput(e);
					// Send text immediately like editor dictation
					this._sendText();
					// Clear ghost text and input for next recognition
					this._ghostText?.dispose();
					this._ghostText = undefined;
					this._ghostTextMarker?.dispose();
					this._ghostTextMarker = undefined;
					// Update decoration position for next recognition
					this._updateDecoration();
					this._input = '';
					break;
				case SpeechToTextStatus.Stopped:
					this.stop();
					break;
			}
		}));
	}
	stop(send?: boolean): void {
		this._setInactive();
		if (send) {
			this._acceptTranscriptionScheduler!.cancel();
			this._sendText();
		}
		this._ghostText = undefined;
		this._decoration?.dispose();
		this._decoration = undefined;
		this._marker?.dispose();
		this._marker = undefined;
		this._ghostTextMarker = undefined;
		this._cancellationTokenSource?.cancel();
		this._disposables.clear();
		this._input = '';
		this._terminalDictationInProgress.reset();
	}

	private _sendText(): void {
		this._terminalService.activeInstance?.sendText(this._input, false);
		alert(localize('terminalVoiceTextInserted', '{0} inserted', this._input));
	}

	private _updateInput(e: ISpeechToTextEvent): void {
		if (e.text) {
			let input = e.text.replaceAll(/[.,?;!]/g, '');
			for (const symbol of Object.entries(symbolMap)) {
				input = input.replace(new RegExp('\\b' + symbol[0] + '\\b'), symbol[1]);
			}
			this._input = ' ' + input;
		}
	}

	private _createDecoration(): void {
		const activeInstance = this._terminalService.activeInstance;
		const xterm = activeInstance?.xterm?.raw;
		if (!xterm) {
			return;
		}
		const onFirstLine = xterm.buffer.active.cursorY === 0;

		// Calculate x position based on current cursor position and input length
		const inputLength = this._input.length;
		const xPosition = xterm.buffer.active.cursorX + inputLength;

		this._marker = activeInstance.registerMarker(onFirstLine ? 0 : -1);
		if (!this._marker) {
			return;
		}
		this._decoration = xterm.registerDecoration({
			marker: this._marker,
			layer: 'top',
			x: xPosition,
		});
		if (!this._decoration) {
			this._marker.dispose();
			this._marker = undefined;
			return;
		}
		this._decoration.onRender((e: HTMLElement) => {
			e.classList.add(...ThemeIcon.asClassNameArray(Codicon.micFilled), 'terminal-voice', 'recording');
			e.style.transform = onFirstLine ? 'translate(10px, -2px)' : 'translate(-6px, -5px)';
		});
	}

	private _updateDecoration(): void {
		// Dispose the old decoration and recreate it at the new position
		this._decoration?.dispose();
		this._marker?.dispose();
		this._decoration = undefined;
		this._marker = undefined;
		this._createDecoration();
	}

	private _setInactive(): void {
		this._decoration?.element?.classList.remove('recording');
	}

	private _renderGhostText(e: ISpeechToTextEvent): void {
		this._ghostText?.dispose();
		const text = e.text;
		if (!text) {
			return;
		}
		const activeInstance = this._terminalService.activeInstance;
		const xterm = activeInstance?.xterm?.raw;
		if (!xterm) {
			return;
		}
		this._ghostTextMarker = activeInstance.registerMarker();
		if (!this._ghostTextMarker) {
			return;
		}
		this._disposables.add(this._ghostTextMarker);
		const onFirstLine = xterm.buffer.active.cursorY === 0;
		this._ghostText = xterm.registerDecoration({
			marker: this._ghostTextMarker,
			layer: 'top',
			x: onFirstLine ? xterm.buffer.active.cursorX + 4 : xterm.buffer.active.cursorX + 1,
		});
		if (this._ghostText) {
			this._disposables.add(this._ghostText);
		}
		this._ghostText?.onRender((e: HTMLElement) => {
			e.classList.add('terminal-voice-progress-text');
			e.textContent = text;
			e.style.width = (xterm.cols - xterm.buffer.active.cursorX) / xterm.cols * 100 + '%';
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/voice/browser/terminalVoiceActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/voice/browser/terminalVoiceActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../../nls.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { IExtensionManagementService } from '../../../../../platform/extensionManagement/common/extensionManagement.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeyCode } from '../../../../../base/common/keyCodes.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { EnablementState, IWorkbenchExtensionEnablementService } from '../../../../services/extensionManagement/common/extensionManagement.js';
import { HasSpeechProvider, SpeechToTextInProgress } from '../../../speech/common/speechService.js';
import { registerActiveInstanceAction, sharedWhenClause } from '../../../terminal/browser/terminalActions.js';
import { TerminalCommandId } from '../../../terminal/common/terminal.js';
import { TerminalContextKeys } from '../../../terminal/common/terminalContextKey.js';
import { TerminalVoiceSession } from './terminalVoice.js';

export function registerTerminalVoiceActions() {
	registerActiveInstanceAction({
		id: TerminalCommandId.StartVoice,
		title: localize2('workbench.action.terminal.startDictation', "Start Dictation in Terminal"),
		precondition: ContextKeyExpr.and(
			SpeechToTextInProgress.toNegated(),
			sharedWhenClause.terminalAvailable
		),
		f1: true,
		icon: Codicon.mic,
		run: async (activeInstance, c, accessor) => {
			const contextKeyService = accessor.get(IContextKeyService);
			const commandService = accessor.get(ICommandService);
			const dialogService = accessor.get(IDialogService);
			const workbenchExtensionEnablementService = accessor.get(IWorkbenchExtensionEnablementService);
			const extensionManagementService = accessor.get(IExtensionManagementService);
			if (HasSpeechProvider.getValue(contextKeyService)) {
				const instantiationService = accessor.get(IInstantiationService);
				TerminalVoiceSession.getInstance(instantiationService).start();
				return;
			}
			const extensions = await extensionManagementService.getInstalled();
			const extension = extensions.find(extension => extension.identifier.id === 'ms-vscode.vscode-speech');
			const extensionIsDisabled = extension && !workbenchExtensionEnablementService.isEnabled(extension);
			let run: () => Promise<unknown>;
			let message: string;
			let primaryButton: string;
			if (extensionIsDisabled) {
				message = localize('terminal.voice.enableSpeechExtension', "Would you like to enable the speech extension?");
				primaryButton = localize('enableExtension', "Enable Extension");
				run = () => workbenchExtensionEnablementService.setEnablement([extension], EnablementState.EnabledWorkspace);
			} else {
				message = localize('terminal.voice.installSpeechExtension', "Would you like to install 'VS Code Speech' extension from 'Microsoft'?");
				run = () => commandService.executeCommand('workbench.extensions.installExtension', 'ms-vscode.vscode-speech');
				primaryButton = localize('installExtension', "Install Extension");
			}
			const detail = localize('terminal.voice.detail', "Microphone support requires this extension.");
			const confirmed = await dialogService.confirm({ message, primaryButton, type: 'info', detail });
			if (confirmed.confirmed) {
				await run();
			}
		},
	});

	registerActiveInstanceAction({
		id: TerminalCommandId.StopVoice,
		title: localize2('workbench.action.terminal.stopDictation', "Stop Dictation in Terminal"),
		precondition: TerminalContextKeys.terminalDictationInProgress,
		f1: true,
		keybinding: {
			primary: KeyCode.Escape,
			weight: KeybindingWeight.WorkbenchContrib + 100
		},
		run: (activeInstance, c, accessor) => {
			const instantiationService = accessor.get(IInstantiationService);
			TerminalVoiceSession.getInstance(instantiationService).stop(true);
		}
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/wslRecommendation/browser/terminal.wslRecommendation.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/wslRecommendation/browser/terminal.wslRecommendation.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, type IDisposable } from '../../../../../base/common/lifecycle.js';
import { basename } from '../../../../../base/common/path.js';
import { isWindows } from '../../../../../base/common/platform.js';
import { localize } from '../../../../../nls.js';
import { IExtensionManagementService } from '../../../../../platform/extensionManagement/common/extensionManagement.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { INotificationService, NeverShowAgainScope, NotificationPriority, Severity } from '../../../../../platform/notification/common/notification.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { registerWorkbenchContribution2, WorkbenchPhase, type IWorkbenchContribution } from '../../../../common/contributions.js';
import { InstallRecommendedExtensionAction } from '../../../extensions/browser/extensionsActions.js';
import { ITerminalService } from '../../../terminal/browser/terminal.js';

export class TerminalWslRecommendationContribution extends Disposable implements IWorkbenchContribution {
	static ID = 'terminalWslRecommendation';

	constructor(
		@IExtensionManagementService extensionManagementService: IExtensionManagementService,
		@IInstantiationService instantiationService: IInstantiationService,
		@INotificationService notificationService: INotificationService,
		@IProductService productService: IProductService,
		@ITerminalService terminalService: ITerminalService,
	) {
		super();

		if (!isWindows) {
			return;
		}

		const exeBasedExtensionTips = productService.exeBasedExtensionTips;
		if (!exeBasedExtensionTips || !exeBasedExtensionTips.wsl) {
			return;
		}

		let listener: IDisposable | undefined = terminalService.onDidCreateInstance(async instance => {
			async function isExtensionInstalled(id: string): Promise<boolean> {
				const extensions = await extensionManagementService.getInstalled();
				return extensions.some(e => e.identifier.id === id);
			}

			if (!instance.shellLaunchConfig.executable || basename(instance.shellLaunchConfig.executable).toLowerCase() !== 'wsl.exe') {
				return;
			}

			listener?.dispose();
			listener = undefined;

			const extId = Object.keys(exeBasedExtensionTips.wsl.recommendations).find(extId => exeBasedExtensionTips.wsl.recommendations[extId].important);
			if (!extId || await isExtensionInstalled(extId)) {
				return;
			}

			notificationService.prompt(
				Severity.Info,
				localize('useWslExtension.title', "The '{0}' extension is recommended for opening a terminal in WSL.", exeBasedExtensionTips.wsl.friendlyName),
				[
					{
						label: localize('install', 'Install'),
						run: () => {
							instantiationService.createInstance(InstallRecommendedExtensionAction, extId).run();
						}
					}
				],
				{
					priority: NotificationPriority.OPTIONAL,
					neverShowAgain: { id: 'terminalConfigHelper/launchRecommendationsIgnore', scope: NeverShowAgainScope.APPLICATION },
					onCancel: () => { }
				}
			);
		});
	}
}

registerWorkbenchContribution2(TerminalWslRecommendationContribution.ID, TerminalWslRecommendationContribution, WorkbenchPhase.Eventually);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/zoom/browser/terminal.zoom.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/zoom/browser/terminal.zoom.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Terminal as RawXtermTerminal } from '@xterm/xterm';
import { Event } from '../../../../../base/common/event.js';
import { IMouseWheelEvent } from '../../../../../base/browser/mouseEvent.js';
import { MouseWheelClassifier } from '../../../../../base/browser/ui/scrollbar/scrollableElement.js';
import { Disposable, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { isMacintosh } from '../../../../../base/common/platform.js';
import { TerminalSettingId } from '../../../../../platform/terminal/common/terminal.js';
import { IDetachedTerminalInstance, ITerminalContribution, ITerminalInstance, IXtermTerminal } from '../../../terminal/browser/terminal.js';
import { registerTerminalContribution, type IDetachedCompatibleTerminalContributionContext, type ITerminalContributionContext } from '../../../terminal/browser/terminalExtensions.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { registerTerminalAction } from '../../../terminal/browser/terminalActions.js';
import { localize2 } from '../../../../../nls.js';
import { isNumber } from '../../../../../base/common/types.js';
import { defaultTerminalFontSize } from '../../../terminal/common/terminalConfiguration.js';
import { TerminalZoomCommandId, TerminalZoomSettingId } from '../common/terminal.zoom.js';
import * as dom from '../../../../../base/browser/dom.js';

class TerminalMouseWheelZoomContribution extends Disposable implements ITerminalContribution {
	static readonly ID = 'terminal.mouseWheelZoom';

	/**
	 * Currently focused find widget. This is used to track action context since
	 * 'active terminals' are only tracked for non-detached terminal instanecs.
	 */
	static activeFindWidget?: TerminalMouseWheelZoomContribution;

	static get(instance: ITerminalInstance | IDetachedTerminalInstance): TerminalMouseWheelZoomContribution | null {
		return instance.getContribution<TerminalMouseWheelZoomContribution>(TerminalMouseWheelZoomContribution.ID);
	}

	private readonly _listener = this._register(new MutableDisposable());

	constructor(
		_ctx: ITerminalContributionContext | IDetachedCompatibleTerminalContributionContext,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
	) {
		super();
	}

	xtermOpen(xterm: IXtermTerminal & { raw: RawXtermTerminal }): void {
		this._register(Event.runAndSubscribe(this._configurationService.onDidChangeConfiguration, e => {
			if (!e || e.affectsConfiguration(TerminalZoomSettingId.MouseWheelZoom)) {
				if (!!this._configurationService.getValue(TerminalZoomSettingId.MouseWheelZoom)) {
					this._setupMouseWheelZoomListener(xterm.raw);
				} else {
					this._listener.clear();
				}
			}
		}));
	}

	private _getConfigFontSize(): number {
		return this._configurationService.getValue(TerminalSettingId.FontSize);
	}

	private _clampFontSize(fontSize: number): number {
		return clampTerminalFontSize(fontSize);
	}

	private _setupMouseWheelZoomListener(raw: RawXtermTerminal) {
		// This is essentially a copy of what we do in the editor, just we modify font size directly
		// as there is no separate zoom level concept in the terminal
		const classifier = MouseWheelClassifier.INSTANCE;

		let prevMouseWheelTime = 0;
		let gestureStartFontSize = this._getConfigFontSize();
		let gestureHasZoomModifiers = false;
		let gestureAccumulatedDelta = 0;

		const wheelListener = (browserEvent: WheelEvent) => {
			if (classifier.isPhysicalMouseWheel()) {
				if (this._hasMouseWheelZoomModifiers(browserEvent)) {
					const delta = browserEvent.deltaY > 0 ? -1 : 1;
					const newFontSize = this._clampFontSize(this._getConfigFontSize() + delta);
					this._configurationService.updateValue(TerminalSettingId.FontSize, newFontSize);
					// EditorZoom.setZoomLevel(zoomLevel + delta);
					browserEvent.preventDefault();
					browserEvent.stopPropagation();
				}
			} else {
				// we consider mousewheel events that occur within 50ms of each other to be part of the same gesture
				// we don't want to consider mouse wheel events where ctrl/cmd is pressed during the inertia phase
				// we also want to accumulate deltaY values from the same gesture and use that to set the zoom level
				if (Date.now() - prevMouseWheelTime > 50) {
					// reset if more than 50ms have passed
					gestureStartFontSize = this._getConfigFontSize();
					gestureHasZoomModifiers = this._hasMouseWheelZoomModifiers(browserEvent);
					gestureAccumulatedDelta = 0;
				}

				prevMouseWheelTime = Date.now();
				gestureAccumulatedDelta += browserEvent.deltaY;

				if (gestureHasZoomModifiers) {
					const deltaAbs = Math.ceil(Math.abs(gestureAccumulatedDelta / 5));
					const deltaDirection = gestureAccumulatedDelta > 0 ? -1 : 1;
					const delta = deltaAbs * deltaDirection;
					const newFontSize = this._clampFontSize(gestureStartFontSize + delta);
					this._configurationService.updateValue(TerminalSettingId.FontSize, newFontSize);
					gestureAccumulatedDelta += browserEvent.deltaY;
					browserEvent.preventDefault();
					browserEvent.stopPropagation();
				}
			}
		};

		// Use the capture phase to ensure we catch the event before the terminal's scrollable element consumes it
		this._listener.value = dom.addDisposableListener(raw.element!, dom.EventType.MOUSE_WHEEL, wheelListener, { capture: true, passive: false });
	}

	private _hasMouseWheelZoomModifiers(browserEvent: WheelEvent | IMouseWheelEvent): boolean {
		return (
			isMacintosh
				// on macOS we support cmd + two fingers scroll (`metaKey` set)
				// and also the two fingers pinch gesture (`ctrKey` set)
				? ((browserEvent.metaKey || browserEvent.ctrlKey) && !browserEvent.shiftKey && !browserEvent.altKey)
				: (browserEvent.ctrlKey && !browserEvent.metaKey && !browserEvent.shiftKey && !browserEvent.altKey)
		);
	}
}

registerTerminalContribution(TerminalMouseWheelZoomContribution.ID, TerminalMouseWheelZoomContribution, true);

registerTerminalAction({
	id: TerminalZoomCommandId.FontZoomIn,
	title: localize2('fontZoomIn', 'Increase Font Size'),
	run: async (c, accessor) => {
		const configurationService = accessor.get(IConfigurationService);
		const value = configurationService.getValue(TerminalSettingId.FontSize);
		if (isNumber(value)) {
			const newFontSize = clampTerminalFontSize(value + 1);
			await configurationService.updateValue(TerminalSettingId.FontSize, newFontSize);
		}
	}
});

registerTerminalAction({
	id: TerminalZoomCommandId.FontZoomOut,
	title: localize2('fontZoomOut', 'Decrease Font Size'),
	run: async (c, accessor) => {
		const configurationService = accessor.get(IConfigurationService);
		const value = configurationService.getValue(TerminalSettingId.FontSize);
		if (isNumber(value)) {
			const newFontSize = clampTerminalFontSize(value - 1);
			await configurationService.updateValue(TerminalSettingId.FontSize, newFontSize);
		}
	}
});

registerTerminalAction({
	id: TerminalZoomCommandId.FontZoomReset,
	title: localize2('fontZoomReset', 'Reset Font Size'),
	run: async (c, accessor) => {
		const configurationService = accessor.get(IConfigurationService);
		await configurationService.updateValue(TerminalSettingId.FontSize, defaultTerminalFontSize);
	}
});

export function clampTerminalFontSize(fontSize: number): number {
	return Math.max(6, Math.min(100, fontSize));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/zoom/common/terminal.zoom.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/zoom/common/terminal.zoom.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IStringDictionary } from '../../../../../base/common/collections.js';
import { isMacintosh } from '../../../../../base/common/platform.js';
import { localize } from '../../../../../nls.js';
import type { IConfigurationPropertySchema } from '../../../../../platform/configuration/common/configurationRegistry.js';

export const enum TerminalZoomCommandId {
	FontZoomIn = 'workbench.action.terminal.fontZoomIn',
	FontZoomOut = 'workbench.action.terminal.fontZoomOut',
	FontZoomReset = 'workbench.action.terminal.fontZoomReset',
}

export const enum TerminalZoomSettingId {
	MouseWheelZoom = 'terminal.integrated.mouseWheelZoom',
}

export const terminalZoomConfiguration: IStringDictionary<IConfigurationPropertySchema> = {
	[TerminalZoomSettingId.MouseWheelZoom]: {
		markdownDescription: isMacintosh
			? localize('terminal.integrated.mouseWheelZoom.mac', "Zoom the font of the terminal when using mouse wheel and holding `Cmd`.")
			: localize('terminal.integrated.mouseWheelZoom', "Zoom the font of the terminal when using mouse wheel and holding `Ctrl`."),
		type: 'boolean',
		default: false
	},
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/zoom/test/browser/terminal.zoom.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/zoom/test/browser/terminal.zoom.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { strictEqual } from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { clampTerminalFontSize } from '../../browser/terminal.zoom.contribution.js';

suite('Terminal Mouse Wheel Zoom', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('clamps font size to minimum value when below bounds', () => {
		const result = clampTerminalFontSize(3 + (-2)); // 3 - 2 = 1, clamped to 6
		strictEqual(result, 6, 'Font size should be clamped to minimum value of 6');
	});

	test('clamps font size to maximum value when above bounds', () => {
		const result = clampTerminalFontSize(99 + 5); // 99 + 5 = 104, clamped to 100
		strictEqual(result, 100, 'Font size should be clamped to maximum value of 100');
	});

	test('preserves font size when within bounds', () => {
		const result = clampTerminalFontSize(12 + 3); // 12 + 3 = 15, within bounds
		strictEqual(result, 15, 'Font size should remain unchanged when within bounds');
	});

	test('clamps font size when going below minimum', () => {
		const result = clampTerminalFontSize(6 + (-1)); // 6 - 1 = 5, clamped to 6
		strictEqual(result, 6, 'Font size should be clamped when going below minimum');
	});

	test('clamps font size when going above maximum', () => {
		const result = clampTerminalFontSize(100 + 1); // 100 + 1 = 101, clamped to 100
		strictEqual(result, 100, 'Font size should be clamped when going above maximum');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/codeCoverageDecorations.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/codeCoverageDecorations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { ActionViewItem } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { ActionBar, ActionsOrientation } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { renderIcon } from '../../../../base/browser/ui/iconLabel/iconLabels.js';
import { Action } from '../../../../base/common/actions.js';
import { mapFindFirst } from '../../../../base/common/arraysFind.js';
import { assert, assertNever } from '../../../../base/common/assert.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { IMarkdownString, MarkdownString } from '../../../../base/common/htmlContent.js';
import { KeyChord, KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { Lazy } from '../../../../base/common/lazy.js';
import { Disposable, DisposableStore, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { autorun, derived, observableFromEvent, observableValue } from '../../../../base/common/observable.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { isUriComponents, URI } from '../../../../base/common/uri.js';
import { ICodeEditor, IOverlayWidget, IOverlayWidgetPosition, isCodeEditor, MouseTargetType, OverlayWidgetPositionPreference } from '../../../../editor/browser/editorBrowser.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { EditorOption } from '../../../../editor/common/config/editorOptions.js';
import { Position } from '../../../../editor/common/core/position.js';
import { Range } from '../../../../editor/common/core/range.js';
import { IEditorContribution } from '../../../../editor/common/editorCommon.js';
import { IModelDecorationOptions, InjectedTextCursorStops, InjectedTextOptions, ITextModel } from '../../../../editor/common/model.js';
import { localize, localize2 } from '../../../../nls.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { bindContextKey, observableConfigValue } from '../../../../platform/observable/common/platformObservableUtils.js';
import { IQuickInputButton, IQuickInputService, QuickPickInput } from '../../../../platform/quickinput/common/quickInput.js';
import { ActiveEditorContext } from '../../../common/contextkeys.js';
import { TEXT_FILE_EDITOR_ID } from '../../files/common/files.js';
import { getTestingConfiguration, TestingConfigKeys } from '../common/configuration.js';
import { TestCommandId, Testing } from '../common/constants.js';
import { FileCoverage } from '../common/testCoverage.js';
import { ITestCoverageService } from '../common/testCoverageService.js';
import { TestId } from '../common/testId.js';
import { ITestService } from '../common/testService.js';
import { CoverageDetails, DetailType, IDeclarationCoverage, IStatementCoverage } from '../common/testTypes.js';
import { TestingContextKeys } from '../common/testingContextKeys.js';
import * as coverUtils from './codeCoverageDisplayUtils.js';
import { testingCoverageMissingBranch, testingCoverageReport, testingFilterIcon, testingRerunIcon } from './icons.js';
import { ManagedTestCoverageBars } from './testCoverageBars.js';

const CLASS_HIT = 'coverage-deco-hit';
const CLASS_MISS = 'coverage-deco-miss';
const TOGGLE_INLINE_COMMAND_TEXT = localize('testing.toggleInlineCoverage', 'Toggle Inline');
const TOGGLE_INLINE_COMMAND_ID = 'testing.toggleInlineCoverage';
const BRANCH_MISS_INDICATOR_CHARS = 4;
const GO_TO_NEXT_MISSED_LINE_TITLE = localize2('testing.goToNextMissedLine', "Go to Next Uncovered Line");
const GO_TO_PREVIOUS_MISSED_LINE_TITLE = localize2('testing.goToPreviousMissedLine', "Go to Previous Uncovered Line");

export class CodeCoverageDecorations extends Disposable implements IEditorContribution {
	public static readonly ID = Testing.CoverageDecorationsContributionId;

	private loadingCancellation?: CancellationTokenSource;
	private readonly displayedStore = this._register(new DisposableStore());
	private readonly hoveredStore = this._register(new DisposableStore());
	private readonly summaryWidget: Lazy<CoverageToolbarWidget>;
	private decorationIds = new Map<string, {
		detail: DetailRange;
		options: IModelDecorationOptions;
		applyHoverOptions(target: IModelDecorationOptions): void;
	}>();
	private hoveredSubject?: unknown;
	private details?: CoverageDetailsModel;
	private readonly hasInlineCoverageDetails = observableValue('hasInlineCoverageDetails', false);

	constructor(
		private readonly editor: ICodeEditor,
		@IInstantiationService instantiationService: IInstantiationService,
		@ITestCoverageService private readonly coverage: ITestCoverageService,
		@IConfigurationService configurationService: IConfigurationService,
		@ILogService private readonly log: ILogService,
		@IContextKeyService contextKeyService: IContextKeyService,
	) {
		super();

		this.summaryWidget = new Lazy(() => this._register(instantiationService.createInstance(CoverageToolbarWidget, this.editor)));

		const modelObs = observableFromEvent(this, editor.onDidChangeModel, () => editor.getModel());
		const configObs = observableFromEvent(this, editor.onDidChangeConfiguration, i => i);

		const fileCoverage = derived(reader => {
			const report = coverage.selected.read(reader);
			if (!report) {
				return;
			}

			const model = modelObs.read(reader);
			if (!model) {
				return;
			}

			const file = report.getUri(model.uri);
			if (!file) {
				return;
			}

			report.didAddCoverage.read(reader); // re-read if changes when there's no report
			return { file, testId: coverage.filterToTest.read(reader) };
		});

		this._register(bindContextKey(
			TestingContextKeys.hasPerTestCoverage,
			contextKeyService,
			reader => !!fileCoverage.read(reader)?.file.perTestData?.size,
		));

		this._register(bindContextKey(
			TestingContextKeys.hasCoverageInFile,
			contextKeyService,
			reader => !!fileCoverage.read(reader)?.file,
		));

		this._register(bindContextKey(
			TestingContextKeys.hasInlineCoverageDetails,
			contextKeyService,
			reader => this.hasInlineCoverageDetails.read(reader),
		));

		this._register(autorun(reader => {
			const c = fileCoverage.read(reader);
			if (c) {
				this.apply(editor.getModel()!, c.file, c.testId, coverage.showInline.read(reader));
			} else {
				this.clear();
			}
		}));

		const toolbarEnabled = observableConfigValue(TestingConfigKeys.CoverageToolbarEnabled, true, configurationService);
		this._register(autorun(reader => {
			const c = fileCoverage.read(reader);
			if (c && toolbarEnabled.read(reader)) {
				this.summaryWidget.value.setCoverage(c.file, c.testId);
			} else {
				this.summaryWidget.rawValue?.clearCoverage();
			}
		}));

		this._register(autorun(reader => {
			const c = fileCoverage.read(reader);
			if (c) {
				const evt = configObs.read(reader);
				if (evt?.hasChanged(EditorOption.lineHeight) !== false) {
					this.updateEditorStyles();
				}
			}
		}));

		this._register(editor.onMouseMove(e => {
			const model = editor.getModel();
			if (e.target.type === MouseTargetType.GUTTER_LINE_NUMBERS && model) {
				this.hoverLineNumber(editor.getModel()!);
			} else if (coverage.showInline.get() && e.target.type === MouseTargetType.CONTENT_TEXT && model) {
				this.hoverInlineDecoration(model, e.target.position);
			} else {
				this.hoveredStore.clear();
			}
		}));

		this._register(editor.onWillChangeModel(() => {
			const model = editor.getModel();
			if (!this.details || !model) {
				return;
			}

			// Decorations adjust to local changes made in-editor, keep them synced in case the file is reopened:
			for (const decoration of model.getAllDecorations()) {
				const own = this.decorationIds.get(decoration.id);
				if (own) {
					own.detail.range = decoration.range;
				}
			}
		}));
	}

	private updateEditorStyles() {
		const lineHeight = this.editor.getOption(EditorOption.lineHeight);
		const { style } = this.editor.getContainerDomNode();
		style.setProperty('--vscode-testing-coverage-lineHeight', `${lineHeight}px`);
	}

	private hoverInlineDecoration(model: ITextModel, position: Position) {
		const allDecorations = model.getDecorationsInRange(Range.fromPositions(position));
		const decoration = mapFindFirst(allDecorations, ({ id }) => this.decorationIds.has(id) ? { id, deco: this.decorationIds.get(id)! } : undefined);
		if (decoration === this.hoveredSubject) {
			return;
		}

		this.hoveredStore.clear();
		this.hoveredSubject = decoration;

		if (!decoration) {
			return;
		}

		model.changeDecorations(e => {
			e.changeDecorationOptions(decoration.id, {
				...decoration.deco.options,
				className: `${decoration.deco.options.className} coverage-deco-hovered`,
			});
		});

		this.hoveredStore.add(toDisposable(() => {
			this.hoveredSubject = undefined;
			model.changeDecorations(e => {
				e.changeDecorationOptions(decoration!.id, decoration!.deco.options);
			});
		}));
	}

	private hoverLineNumber(model: ITextModel) {
		if (this.hoveredSubject === 'lineNo' || !this.details || this.coverage.showInline.get()) {
			return;
		}

		this.hoveredStore.clear();
		this.hoveredSubject = 'lineNo';

		model.changeDecorations(e => {
			for (const [id, decoration] of this.decorationIds) {
				const { applyHoverOptions, options } = decoration;
				const dup = { ...options };
				applyHoverOptions(dup);
				e.changeDecorationOptions(id, dup);
			}
		});

		this.hoveredStore.add(this.editor.onMouseLeave(() => {
			this.hoveredStore.clear();
		}));

		this.hoveredStore.add(toDisposable(() => {
			this.hoveredSubject = undefined;

			model.changeDecorations(e => {
				for (const [id, decoration] of this.decorationIds) {
					e.changeDecorationOptions(id, decoration.options);
				}
			});
		}));
	}

	/**
	 * Navigate to the next missed (uncovered) line from the current cursor position.
	 * @returns true if navigation occurred, false if no missed line was found
	 */
	public goToNextMissedLine(): boolean {
		return this.navigateToMissedLine(true);
	}

	/**
	 * Navigate to the previous missed (uncovered) line from the current cursor position.
	 * @returns true if navigation occurred, false if no missed line was found
	 */
	public goToPreviousMissedLine(): boolean {
		return this.navigateToMissedLine(false);
	}

	private navigateToMissedLine(next: boolean): boolean {
		const model = this.editor.getModel();
		const position = this.editor.getPosition();
		if (!model || !position || !this.details) {
			return false;
		}

		const currentLine = position.lineNumber;
		let closestBefore: { lineNumber: number; range: Range } | undefined;
		let closestAfter: { lineNumber: number; range: Range } | undefined;
		let firstMissed: { lineNumber: number; range: Range } | undefined;
		let lastMissed: { lineNumber: number; range: Range } | undefined;

		// Find the closest missed line before and after the current position
		for (const [, { detail, options }] of this.decorationIds) {
			// Check if this is a missed line (CLASS_MISS in lineNumberClassName)
			if (options.lineNumberClassName?.includes(CLASS_MISS)) {
				const range = detail.range;
				if (range.isEmpty()) {
					continue;
				}

				const lineNumber = range.startLineNumber;
				const missedLine = { lineNumber, range };

				// Track first and last missed lines for wrap-around
				if (!firstMissed || lineNumber < firstMissed.lineNumber) {
					firstMissed = missedLine;
				}
				if (!lastMissed || lineNumber > lastMissed.lineNumber) {
					lastMissed = missedLine;
				}

				// Track closest before and after current line
				if (lineNumber < currentLine) {
					if (!closestBefore || lineNumber > closestBefore.lineNumber) {
						closestBefore = missedLine;
					}
				} else if (lineNumber > currentLine) {
					if (!closestAfter || lineNumber < closestAfter.lineNumber) {
						closestAfter = missedLine;
					}
				}
			}
		}

		// Determine target line based on direction
		const targetLine = next
			? (closestAfter || firstMissed)  // Next: closest after, or wrap to first
			: (closestBefore || lastMissed);  // Previous: closest before, or wrap to last

		if (targetLine) {
			this.editor.setPosition(new Position(targetLine.lineNumber, 1));
			this.editor.revealLineInCenter(targetLine.lineNumber);
			return true;
		}

		return false;
	}

	private async apply(model: ITextModel, coverage: FileCoverage, testId: TestId | undefined, showInlineByDefault: boolean) {
		const details = this.details = await this.loadDetails(coverage, testId, model);
		if (!details) {
			this.hasInlineCoverageDetails.set(false, undefined);
			return this.clear();
		}

		// Update context key to indicate inline coverage details are available
		this.hasInlineCoverageDetails.set(details.ranges.length > 0, undefined);

		this.displayedStore.clear();

		model.changeDecorations(e => {
			for (const detailRange of details.ranges) {
				const { metadata: { detail, description }, range, primary } = detailRange;
				if (detail.type === DetailType.Branch) {
					const hits = detail.detail.branches![detail.branch].count;
					const cls = hits ? CLASS_HIT : CLASS_MISS;
					// don't bother showing the miss indicator if the condition wasn't executed at all:
					const showMissIndicator = !hits && range.isEmpty() && detail.detail.branches!.some(b => b.count);
					const options: IModelDecorationOptions = {
						showIfCollapsed: showMissIndicator, // only avoid collapsing if we want to show the miss indicator
						description: 'coverage-gutter',
						lineNumberClassName: `coverage-deco-gutter ${cls}`,
					};

					const applyHoverOptions = (target: IModelDecorationOptions) => {
						target.hoverMessage = description;
						if (showMissIndicator) {
							target.after = {
								content: '\xa0'.repeat(BRANCH_MISS_INDICATOR_CHARS), // nbsp
								inlineClassName: `coverage-deco-branch-miss-indicator ${ThemeIcon.asClassName(testingCoverageMissingBranch)}`,
								inlineClassNameAffectsLetterSpacing: true,
								cursorStops: InjectedTextCursorStops.None,
							};
						} else {
							target.className = `coverage-deco-inline ${cls}`;
							if (primary && typeof hits === 'number') {
								target.before = countBadge(hits);
							}
						}
					};

					if (showInlineByDefault) {
						applyHoverOptions(options);
					}

					this.decorationIds.set(e.addDecoration(range, options), { options, applyHoverOptions, detail: detailRange });
				} else if (detail.type === DetailType.Statement) {
					const cls = detail.count ? CLASS_HIT : CLASS_MISS;
					const options: IModelDecorationOptions = {
						showIfCollapsed: false,
						description: 'coverage-inline',
						lineNumberClassName: `coverage-deco-gutter ${cls}`,
					};

					const applyHoverOptions = (target: IModelDecorationOptions) => {
						target.className = `coverage-deco-inline ${cls}`;
						target.hoverMessage = description;
						if (primary && typeof detail.count === 'number') {
							target.before = countBadge(detail.count);
						}
					};

					if (showInlineByDefault) {
						applyHoverOptions(options);
					}

					this.decorationIds.set(e.addDecoration(range, options), { options, applyHoverOptions, detail: detailRange });
				}
			}
		});

		this.displayedStore.add(toDisposable(() => {
			model.changeDecorations(e => {
				for (const decoration of this.decorationIds.keys()) {
					e.removeDecoration(decoration);
				}
				this.decorationIds.clear();
			});
		}));
	}

	private clear() {
		this.loadingCancellation?.cancel();
		this.loadingCancellation = undefined;
		this.displayedStore.clear();
		this.hoveredStore.clear();
		this.hasInlineCoverageDetails.set(false, undefined);
	}

	private async loadDetails(coverage: FileCoverage, testId: TestId | undefined, textModel: ITextModel) {
		const cts = this.loadingCancellation = new CancellationTokenSource();
		this.displayedStore.add(this.loadingCancellation);

		try {
			const details = testId
				? await coverage.detailsForTest(testId, this.loadingCancellation.token)
				: await coverage.details(this.loadingCancellation.token);
			if (cts.token.isCancellationRequested) {
				return;
			}
			return new CoverageDetailsModel(details, textModel);
		} catch (e) {
			this.log.error('Error loading coverage details', e);
		}

		return undefined;
	}
}

const countBadge = (count: number): InjectedTextOptions | undefined => {
	if (count === 0) {
		return undefined;
	}

	return {
		content: `${count > 99 ? '99+' : count}x`,
		cursorStops: InjectedTextCursorStops.None,
		inlineClassName: `coverage-deco-inline-count`,
		inlineClassNameAffectsLetterSpacing: true,
	};
};

type CoverageDetailsWithBranch = CoverageDetails | { type: DetailType.Branch; branch: number; detail: IStatementCoverage };
type DetailRange = { range: Range; primary: boolean; metadata: { detail: CoverageDetailsWithBranch; description: IMarkdownString | undefined } };

export class CoverageDetailsModel {
	public readonly ranges: DetailRange[] = [];

	constructor(public readonly details: CoverageDetails[], textModel: ITextModel) {

		//#region decoration generation
		// Coverage from a provider can have a range that contains smaller ranges,
		// such as a function declaration that has nested statements. In this we
		// make sequential, non-overlapping ranges for each detail for display in
		// the editor without ugly overlaps.
		const detailRanges: DetailRange[] = details.map(detail => ({
			range: tidyLocation(detail.location),
			primary: true,
			metadata: { detail, description: this.describe(detail, textModel) }
		}));

		for (const { range, metadata: { detail } } of detailRanges) {
			if (detail.type === DetailType.Statement && detail.branches) {
				for (let i = 0; i < detail.branches.length; i++) {
					const branch: CoverageDetailsWithBranch = { type: DetailType.Branch, branch: i, detail };
					detailRanges.push({
						range: tidyLocation(detail.branches[i].location || Range.fromPositions(range.getEndPosition())),
						primary: true,
						metadata: {
							detail: branch,
							description: this.describe(branch, textModel),
						},
					});
				}
			}
		}

		// type ordering is done so that function declarations come first on a tie so that
		// single-statement functions (`() => foo()` for example) get inline decorations.
		detailRanges.sort((a, b) => Range.compareRangesUsingStarts(a.range, b.range) || a.metadata.detail.type - b.metadata.detail.type);

		const stack: DetailRange[] = [];
		const result: DetailRange[] = this.ranges = [];
		const pop = () => {
			const next = stack.pop()!;
			const prev = stack[stack.length - 1];
			if (prev) {
				prev.range = prev.range.setStartPosition(next.range.endLineNumber, next.range.endColumn);
			}

			result.push(next);
		};

		for (const item of detailRanges) {
			// 1. Ensure that any ranges in the stack that ended before this are flushed
			const start = item.range.getStartPosition();
			while (stack[stack.length - 1]?.range.containsPosition(start) === false) {
				pop();
			}

			// Empty ranges (usually representing missing branches) can be added
			// without worry about overlay.
			if (item.range.isEmpty()) {
				result.push(item);
				continue;
			}

			// 2. Take the last (overlapping) item in the stack, push range before
			// the `item.range` into the result and modify its stack to push the start
			// until after the `item.range` ends.
			const prev = stack[stack.length - 1];
			if (prev) {
				const primary = prev.primary;
				const si = prev.range.setEndPosition(start.lineNumber, start.column);
				prev.range = prev.range.setStartPosition(item.range.endLineNumber, item.range.endColumn);
				prev.primary = false;
				// discard the previous range if it became empty, e.g. a nested statement
				if (prev.range.isEmpty()) { stack.pop(); }
				result.push({ range: si, primary, metadata: prev.metadata });
			}

			stack.push(item);
		}
		while (stack.length) {
			pop();
		}
		//#endregion
	}

	/** Gets the markdown description for the given detail */
	public describe(detail: CoverageDetailsWithBranch, model: ITextModel): IMarkdownString | undefined {
		if (detail.type === DetailType.Declaration) {
			return namedDetailLabel(detail.name, detail);
		} else if (detail.type === DetailType.Statement) {
			const text = wrapName(model.getValueInRange(tidyLocation(detail.location)).trim() || `<empty statement>`);
			if (detail.branches?.length) {
				const covered = detail.branches.filter(b => !!b.count).length;
				return new MarkdownString().appendMarkdown(localize('coverage.branches', '{0} of {1} of branches in {2} were covered.', covered, detail.branches.length, text));
			} else {
				return namedDetailLabel(text, detail);
			}
		} else if (detail.type === DetailType.Branch) {
			const text = wrapName(model.getValueInRange(tidyLocation(detail.detail.location)).trim() || `<empty statement>`);
			const { count, label } = detail.detail.branches![detail.branch];
			const label2 = label ? wrapInBackticks(label) : `#${detail.branch + 1}`;
			if (!count) {
				return new MarkdownString().appendMarkdown(localize('coverage.branchNotCovered', 'Branch {0} in {1} was not covered.', label2, text));
			} else if (count === true) {
				return new MarkdownString().appendMarkdown(localize('coverage.branchCoveredYes', 'Branch {0} in {1} was executed.', label2, text));
			} else {
				return new MarkdownString().appendMarkdown(localize('coverage.branchCovered', 'Branch {0} in {1} was executed {2} time(s).', label2, text, count));
			}
		}

		assertNever(detail);
	}
}

function namedDetailLabel(name: string, detail: IStatementCoverage | IDeclarationCoverage) {
	return new MarkdownString().appendMarkdown(
		!detail.count // 0 or false
			? localize('coverage.declExecutedNo', '`{0}` was not executed.', name)
			: typeof detail.count === 'number'
				? localize('coverage.declExecutedCount', '`{0}` was executed {1} time(s).', name, detail.count)
				: localize('coverage.declExecutedYes', '`{0}` was executed.', name)
	);
}

// 'tidies' the range by normalizing it into a range and removing leading
// and trailing whitespace.
function tidyLocation(location: Range | Position): Range {
	if (location instanceof Position) {
		return Range.fromPositions(location, new Position(location.lineNumber, 0x7FFFFFFF));
	}

	return location;
}

function wrapInBackticks(str: string) {
	return '`' + str.replace(/[\n\r`]/g, '') + '`';
}

function wrapName(functionNameOrCode: string) {
	if (functionNameOrCode.length > 50) {
		functionNameOrCode = functionNameOrCode.slice(0, 40) + '...';
	}
	return wrapInBackticks(functionNameOrCode);
}

class CoverageToolbarWidget extends Disposable implements IOverlayWidget {
	private current: { coverage: FileCoverage; testId: TestId | undefined } | undefined;
	private registered = false;
	private isRunning = false;
	private readonly showStore = this._register(new DisposableStore());
	private readonly actionBar: ActionBar;
	private readonly _domNode = dom.h('div.coverage-summary-widget', [
		dom.h('div', [
			dom.h('span.bars@bars'),
			dom.h('span.toolbar@toolbar'),
		]),
	]);

	private readonly bars: ManagedTestCoverageBars;

	constructor(
		private readonly editor: ICodeEditor,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@ITestService private readonly testService: ITestService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@ICommandService private readonly commandService: ICommandService,
		@ITestCoverageService private readonly coverage: ITestCoverageService,
		@IInstantiationService instaService: IInstantiationService,
	) {
		super();

		this.bars = this._register(instaService.createInstance(ManagedTestCoverageBars, {
			compact: false,
			overall: false,
			container: this._domNode.bars,
		}));

		this.actionBar = this._register(instaService.createInstance(ActionBar, this._domNode.toolbar, {
			orientation: ActionsOrientation.HORIZONTAL,
			actionViewItemProvider: (action, options) => {
				if (action instanceof ActionWithIcon) {
					if (action.iconOnly) {
						action.class = ThemeIcon.asClassName(action.icon);
						return new ActionViewItem(undefined, action, { ...options, label: false, icon: true });
					}

					const vm = new CodiconActionViewItem(undefined, action, options);
					vm.themeIcon = action.icon;
					return vm;
				}

				return undefined;
			}
		}));


		this._register(autorun(reader => {
			coverage.showInline.read(reader);
			this.setActions();
		}));

		this._register(dom.addStandardDisposableListener(this._domNode.root, dom.EventType.CONTEXT_MENU, e => {
			this.contextMenuService.showContextMenu({
				menuId: MenuId.StickyScrollContext,
				getAnchor: () => e,
			});
		}));
	}

	/** @inheritdoc */
	public getId(): string {
		return 'coverage-summary-widget';
	}

	/** @inheritdoc */
	public getDomNode(): HTMLElement {
		return this._domNode.root;
	}

	/** @inheritdoc */
	public getPosition(): IOverlayWidgetPosition | null {
		return {
			preference: OverlayWidgetPositionPreference.TOP_CENTER,
			stackOrdinal: 9,
		};
	}

	public clearCoverage() {
		this.current = undefined;
		this.bars.setCoverageInfo(undefined);
		this.hide();
	}

	public setCoverage(coverage: FileCoverage, testId: TestId | undefined) {
		this.current = { coverage, testId };
		this.bars.setCoverageInfo(coverage);

		if (!coverage) {
			this.hide();
		} else {
			this.setActions();
			this.show();
		}
	}

	private setActions() {
		this.actionBar.clear();
		const current = this.current;
		if (!current) {
			return;
		}

		const toggleAction = new ActionWithIcon(
			'toggleInline',
			this.coverage.showInline.get()
				? localize('testing.hideInlineCoverage', 'Hide Inline')
				: localize('testing.showInlineCoverage', 'Show Inline'),
			testingCoverageReport,
			undefined,
			() => this.coverage.showInline.set(!this.coverage.showInline.get(), undefined),
		);

		const kb = this.keybindingService.lookupKeybinding(TOGGLE_INLINE_COMMAND_ID);
		if (kb) {
			toggleAction.tooltip = `${TOGGLE_INLINE_COMMAND_TEXT} (${kb.getLabel()})`;
		}

		const hasUncoveredStmt = current.coverage.statement.covered < current.coverage.statement.total;
		// Navigation buttons for missed coverage lines
		this.actionBar.push(new ActionWithIcon(
			'goToPreviousMissed',
			GO_TO_PREVIOUS_MISSED_LINE_TITLE.value,
			Codicon.arrowUp,
			hasUncoveredStmt,
			() => this.commandService.executeCommand(TestCommandId.CoverageGoToPreviousMissedLine),
			true,
		));

		this.actionBar.push(new ActionWithIcon(
			'goToNextMissed',
			GO_TO_NEXT_MISSED_LINE_TITLE.value,
			Codicon.arrowDown,
			hasUncoveredStmt,
			() => this.commandService.executeCommand(TestCommandId.CoverageGoToNextMissedLine),
			true,
		));

		this.actionBar.push(toggleAction);

		if (current.testId) {
			const testItem = current.coverage.fromResult.getTestById(current.testId.toString());
			assert(!!testItem, 'got coverage for an unreported test');
			this.actionBar.push(new ActionWithIcon('perTestFilter',
				coverUtils.labels.showingFilterFor(testItem.label),
				testingFilterIcon,
				undefined,
				() => this.commandService.executeCommand(TestCommandId.CoverageFilterToTestInEditor, this.current, this.editor),
			));
		} else if (current.coverage.perTestData?.size) {
			this.actionBar.push(new ActionWithIcon('perTestFilter',
				localize('testing.coverageForTestAvailable', "{0} test(s) ran code in this file", current.coverage.perTestData.size),
				testingFilterIcon,
				undefined,
				() => this.commandService.executeCommand(TestCommandId.CoverageFilterToTestInEditor, this.current, this.editor),
			));
		}

		this.actionBar.push(new ActionWithIcon(
			'rerun',
			localize('testing.rerun', 'Rerun'),
			testingRerunIcon,
			!this.isRunning,
			() => this.rerunTest()
		));
	}

	private show() {
		if (this.registered) {
			return;
		}

		this.registered = true;
		let viewZoneId: string;
		const ds = this.showStore;

		this.editor.addOverlayWidget(this);
		this.editor.changeViewZones(accessor => {
			viewZoneId = accessor.addZone({ // make space for the widget
				afterLineNumber: 0,
				afterColumn: 0,
				domNode: document.createElement('div'),
				heightInPx: 30,
				ordinal: -1, // show before code lenses
			});
		});

		ds.add(toDisposable(() => {
			this.registered = false;
			this.editor.removeOverlayWidget(this);
			this.editor.changeViewZones(accessor => {
				accessor.removeZone(viewZoneId);
			});
		}));

		ds.add(this.configurationService.onDidChangeConfiguration(e => {
			if (this.current && (e.affectsConfiguration(TestingConfigKeys.CoverageBarThresholds) || e.affectsConfiguration(TestingConfigKeys.CoveragePercent))) {
				this.setCoverage(this.current.coverage, this.current.testId);
			}
		}));
	}

	private rerunTest() {
		const current = this.current;
		if (current) {
			this.isRunning = true;
			this.setActions();
			this.testService.runResolvedTests(current.coverage.fromResult.request).finally(() => {
				this.isRunning = false;
				this.setActions();
			});
		}
	}

	private hide() {
		this.showStore.clear();
	}
}

registerAction2(class ToggleInlineCoverage extends Action2 {
	constructor() {
		super({
			id: TOGGLE_INLINE_COMMAND_ID,
			// note: ideally this would be "show inline", but the command palette does
			// not use the 'toggled' titles, so we need to make this generic.
			title: localize2('coverage.toggleInline', "Toggle Inline Coverage"),
			category: Categories.Test,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.Semicolon, KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyI),
			},
			toggled: {
				condition: TestingContextKeys.inlineCoverageEnabled,
				title: localize('coverage.hideInline', "Hide Inline Coverage"),
			},
			icon: testingCoverageReport,
			menu: [
				{ id: MenuId.CommandPalette, when: TestingContextKeys.isTestCoverageOpen },
				{ id: MenuId.EditorTitle, when: ContextKeyExpr.and(TestingContextKeys.hasInlineCoverageDetails, TestingContextKeys.coverageToolbarEnabled.notEqualsTo(true)), group: 'navigation' },
			]
		});
	}

	public run(accessor: ServicesAccessor): void {
		const coverage = accessor.get(ITestCoverageService);
		coverage.showInline.set(!coverage.showInline.get(), undefined);
	}
});

registerAction2(class ToggleCoverageToolbar extends Action2 {
	constructor() {
		super({
			id: TestCommandId.CoverageToggleToolbar,
			title: localize2('testing.toggleToolbarTitle', "Show Test Coverage Toolbar"),
			metadata: {
				description: localize2('testing.toggleToolbarDesc', 'Toggle the sticky coverage bar in the editor.')
			},
			category: Categories.Test,
			toggled: {
				condition: TestingContextKeys.coverageToolbarEnabled,
			},
			menu: [
				{ id: MenuId.CommandPalette, when: TestingContextKeys.isTestCoverageOpen },
				{ id: MenuId.StickyScrollContext, when: TestingContextKeys.isTestCoverageOpen },
				{ id: MenuId.EditorTitle, when: TestingContextKeys.hasCoverageInFile, group: 'coverage', order: 1 },
			]
		});
	}

	run(accessor: ServicesAccessor): void {
		const config = accessor.get(IConfigurationService);
		const value = getTestingConfiguration(config, TestingConfigKeys.CoverageToolbarEnabled);
		config.updateValue(TestingConfigKeys.CoverageToolbarEnabled, !value);
	}
});

registerAction2(class FilterCoverageToTestInEditor extends Action2 {
	constructor() {
		super({
			id: TestCommandId.CoverageFilterToTestInEditor,
			title: localize2('testing.filterActionLabel', "Filter Coverage to Test"),
			category: Categories.Test,
			icon: Codicon.filter,
			toggled: {
				icon: Codicon.filterFilled,
				condition: TestingContextKeys.isCoverageFilteredToTest,
			},
			menu: [
				{
					id: MenuId.EditorTitle,
					when: ContextKeyExpr.and(
						TestingContextKeys.hasCoverageInFile,
						TestingContextKeys.coverageToolbarEnabled.notEqualsTo(true),
						TestingContextKeys.hasPerTestCoverage,
						ActiveEditorContext.isEqualTo(TEXT_FILE_EDITOR_ID),
					),
					group: 'navigation',
				},
			]
		});
	}

	run(accessor: ServicesAccessor, coverageOrUri?: FileCoverage | URI, editor?: ICodeEditor): void {
		const testCoverageService = accessor.get(ITestCoverageService);
		const quickInputService = accessor.get(IQuickInputService);
		const commandService = accessor.get(ICommandService);
		const activeEditor = isCodeEditor(editor) ? editor : accessor.get(ICodeEditorService).getActiveCodeEditor();
		let coverage: FileCoverage | undefined;
		if (coverageOrUri instanceof FileCoverage) {
			coverage = coverageOrUri;
		} else if (isUriComponents(coverageOrUri)) {
			coverage = testCoverageService.selected.get()?.getUri(URI.from(coverageOrUri));
		} else {
			const uri = activeEditor?.getModel()?.uri;
			coverage = uri && testCoverageService.selected.get()?.getUri(uri);
		}

		if (!coverage || !coverage.perTestData?.size) {
			return;
		}

		const tests = [...coverage.perTestData].map(TestId.fromString);
		const commonPrefix = TestId.getLengthOfCommonPrefix(tests.length, i => tests[i]);
		const result = coverage.fromResult;
		const previousSelection = testCoverageService.filterToTest.get();

		type TItem = { label: string; testId: TestId | undefined; buttons?: IQuickInputButton[] };

		const buttons: IQuickInputButton[] = [{
			iconClass: 'codicon-go-to-file',
			tooltip: 'Go to Test',
		}];
		const items: QuickPickInput<TItem>[] = [
			{ label: coverUtils.labels.allTests, testId: undefined },
			{ type: 'separator' },
			...tests.map(id => ({ label: coverUtils.getLabelForItem(result, id, commonPrefix), testId: id, buttons })),
		];

		// These handle the behavior that reveals the start of coverage when the
		// user picks from the quickpick. Scroll position is restored if the user
		// exits without picking an item, or picks "all tests".
		const scrollTop = activeEditor?.getScrollTop() || 0;
		const revealScrollCts = new MutableDisposable<CancellationTokenSource>();

		quickInputService.pick(items, {
			activeItem: items.find((item): item is TItem => 'testId' in item && item.testId?.toString() === previousSelection?.toString()),
			placeHolder: coverUtils.labels.pickShowCoverage,
			onDidTriggerItemButton: (context) => {
				commandService.executeCommand('vscode.revealTest', context.item.testId?.toString());
			},
			onDidFocus: (entry) => {
				if (!entry.testId) {
					revealScrollCts.clear();
					activeEditor?.setScrollTop(scrollTop);
					testCoverageService.filterToTest.set(undefined, undefined);
				} else {
					const cts = revealScrollCts.value = new CancellationTokenSource();
					coverage.detailsForTest(entry.testId, cts.token).then(
						details => {
							const first = details.find(d => d.type === DetailType.Statement);
							if (!cts.token.isCancellationRequested && first) {
								activeEditor?.revealLineNearTop(first.location instanceof Position ? first.location.lineNumber : first.location.startLineNumber);
							}
						},
						() => { /* ignored */ }
					);
					testCoverageService.filterToTest.set(entry.testId, undefined);
				}
			},
		}).then(selected => {
			if (!selected) {
				activeEditor?.setScrollTop(scrollTop);
			}

			revealScrollCts.dispose();
			testCoverageService.filterToTest.set(selected ? selected.testId : previousSelection, undefined);
		});
	}
});

registerAction2(class ToggleCoverageInExplorer extends Action2 {
	constructor() {
		super({
			id: TestCommandId.CoverageToggleInExplorer,
			title: localize2('testing.toggleCoverageInExplorerTitle', "Toggle Coverage in Explorer"),
			metadata: {
				description: localize2('testing.toggleCoverageInExplorerDesc', 'Toggle the display of test coverage in the File Explorer view.')
			},
			category: Categories.Test,
			toggled: {
				condition: ContextKeyExpr.equals('config.testing.showCoverageInExplorer', true),
				title: localize('testing.hideCoverageInExplorer', "Hide Coverage in Explorer"),
			},
			menu: [
				{ id: MenuId.CommandPalette, when: TestingContextKeys.isTestCoverageOpen },
			]
		});
	}

	run(accessor: ServicesAccessor): void {
		const config = accessor.get(IConfigurationService);
		const value = getTestingConfiguration(config, TestingConfigKeys.ShowCoverageInExplorer);
		config.updateValue(TestingConfigKeys.ShowCoverageInExplorer, !value);
	}
});

registerAction2(class GoToNextMissedCoverageLine extends Action2 {
	constructor() {
		super({
			id: TestCommandId.CoverageGoToNextMissedLine,
			title: GO_TO_NEXT_MISSED_LINE_TITLE,
			metadata: {
				description: localize2('testing.goToNextMissedLineDesc', 'Navigate to the next line that is not covered by tests.')
			},
			category: Categories.Test,
			icon: Codicon.arrowDown,
			f1: true,
			precondition: TestingContextKeys.hasCoverageInFile,
			keybinding: {
				when: ActiveEditorContext,
				weight: KeybindingWeight.EditorContrib,
				primary: KeyMod.Alt | KeyCode.F9,
			},
			menu: [
				{ id: MenuId.CommandPalette, when: TestingContextKeys.isTestCoverageOpen },
				{ id: MenuId.EditorTitle, when: TestingContextKeys.hasCoverageInFile, group: 'coverage', order: 2 },
			]
		});
	}

	run(accessor: ServicesAccessor): void {
		const codeEditorService = accessor.get(ICodeEditorService);
		const activeEditor = codeEditorService.getActiveCodeEditor();
		if (!activeEditor) {
			return;
		}

		const contribution = activeEditor.getContribution<CodeCoverageDecorations>(CodeCoverageDecorations.ID);
		contribution?.goToNextMissedLine();
	}
});

registerAction2(class GoToPreviousMissedCoverageLine extends Action2 {
	constructor() {
		super({
			id: TestCommandId.CoverageGoToPreviousMissedLine,
			title: GO_TO_PREVIOUS_MISSED_LINE_TITLE,
			metadata: {
				description: localize2('testing.goToPreviousMissedLineDesc', 'Navigate to the previous line that is not covered by tests.')
			},
			category: Categories.Test,
			icon: Codicon.arrowUp,
			f1: true,
			precondition: TestingContextKeys.hasCoverageInFile,
			keybinding: {
				when: ActiveEditorContext,
				weight: KeybindingWeight.EditorContrib,
				primary: KeyMod.Alt | KeyMod.Shift | KeyCode.F9,
			},
			menu: [
				{ id: MenuId.CommandPalette, when: TestingContextKeys.isTestCoverageOpen },
				{ id: MenuId.EditorTitle, when: TestingContextKeys.hasCoverageInFile, group: 'coverage', order: 3 },
			]
		});
	}

	run(accessor: ServicesAccessor): void {
		const codeEditorService = accessor.get(ICodeEditorService);
		const activeEditor = codeEditorService.getActiveCodeEditor();
		if (!activeEditor) {
			return;
		}

		const contribution = activeEditor.getContribution<CodeCoverageDecorations>(CodeCoverageDecorations.ID);
		contribution?.goToPreviousMissedLine();
	}
});

class ActionWithIcon extends Action {
	constructor(id: string, title: string, public readonly icon: ThemeIcon, enabled: boolean | undefined, run: () => void, public iconOnly = false) {
		super(id, title, undefined, enabled, run);
	}
}

class CodiconActionViewItem extends ActionViewItem {

	public themeIcon?: ThemeIcon;

	protected override updateLabel(): void {
		if (this.options.label && this.label && this.themeIcon) {
			dom.reset(this.label, renderIcon(this.themeIcon), this.action.label);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/codeCoverageDisplayUtils.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/codeCoverageDisplayUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { assertNever } from '../../../../base/common/assert.js';
import { clamp } from '../../../../base/common/numbers.js';
import { localize } from '../../../../nls.js';
import { chartsGreen, chartsRed, chartsYellow } from '../../../../platform/theme/common/colorRegistry.js';
import { asCssVariableName } from '../../../../platform/theme/common/colorUtils.js';
import { CoverageBarSource } from './testCoverageBars.js';
import { ITestingCoverageBarThresholds, TestingDisplayedCoveragePercent } from '../common/configuration.js';
import { getTotalCoveragePercent } from '../common/testCoverage.js';
import { TestId } from '../common/testId.js';
import { LiveTestResult } from '../common/testResult.js';
import { ICoverageCount } from '../common/testTypes.js';

export const percent = (cc: ICoverageCount) => clamp(cc.total === 0 ? 1 : cc.covered / cc.total, 0, 1);

const colorThresholds = [
	{ color: `var(${asCssVariableName(chartsRed)})`, key: 'red' },
	{ color: `var(${asCssVariableName(chartsYellow)})`, key: 'yellow' },
	{ color: `var(${asCssVariableName(chartsGreen)})`, key: 'green' },
] as const;

export const getCoverageColor = (pct: number, thresholds: ITestingCoverageBarThresholds) => {
	let best = colorThresholds[0].color; //  red
	let distance = pct;
	for (const { key, color } of colorThresholds) {
		const t = thresholds[key] / 100;
		if (t && pct >= t && pct - t < distance) {
			best = color;
			distance = pct - t;
		}
	}
	return best;
};


const epsilon = 10e-8;

export const displayPercent = (value: number, precision = 2) => {
	const display = (value * 100).toFixed(precision);

	// avoid showing 100% coverage if it just rounds up:
	if (value < 1 - epsilon && display === '100') {
		return `${100 - (10 ** -precision)}%`;
	}

	return `${display}%`;
};

export const calculateDisplayedStat = (coverage: CoverageBarSource, method: TestingDisplayedCoveragePercent) => {
	switch (method) {
		case TestingDisplayedCoveragePercent.Statement:
			return percent(coverage.statement);
		case TestingDisplayedCoveragePercent.Minimum: {
			let value = percent(coverage.statement);
			if (coverage.branch) { value = Math.min(value, percent(coverage.branch)); }
			if (coverage.declaration) { value = Math.min(value, percent(coverage.declaration)); }
			return value;
		}
		case TestingDisplayedCoveragePercent.TotalCoverage:
			return getTotalCoveragePercent(coverage.statement, coverage.branch, coverage.declaration);
		default:
			assertNever(method);
	}
};

export function getLabelForItem(result: LiveTestResult, testId: TestId, commonPrefixLen: number) {
	const parts: string[] = [];
	for (const id of testId.idsFromRoot()) {
		const item = result.getTestById(id.toString());
		if (!item) {
			break;
		}

		parts.push(item.label);
	}

	return parts.slice(commonPrefixLen).join(' \u203a ');
}

export namespace labels {
	export const showingFilterFor = (label: string) => localize('testing.coverageForTest', "Showing \"{0}\"", label);
	export const clickToChangeFiltering = localize('changePerTestFilter', 'Click to view coverage for a single test');
	export const percentCoverage = (percent: number, precision?: number) => localize('testing.percentCoverage', '{0} Coverage', displayPercent(percent, precision));
	export const allTests = localize('testing.allTests', 'All tests');
	export const pickShowCoverage = localize('testing.pickTest', 'Pick a test to show coverage for');
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/icons.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/icons.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { localize } from '../../../../nls.js';
import { registerIcon, spinningLoading } from '../../../../platform/theme/common/iconRegistry.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { testingColorRunAction, testStatesToIconColors, testStatesToRetiredIconColors } from './theme.js';
import { TestResultState } from '../common/testTypes.js';

export const testingViewIcon = registerIcon('test-view-icon', Codicon.beaker, localize('testViewIcon', 'View icon of the test view.'));
export const testingResultsIcon = registerIcon('test-results-icon', Codicon.checklist, localize('testingResultsIcon', 'Icons for test results.'));
export const testingRunIcon = registerIcon('testing-run-icon', Codicon.run, localize('testingRunIcon', 'Icon of the "run test" action.'));
export const testingRerunIcon = registerIcon('testing-rerun-icon', Codicon.debugRerun, localize('testingRerunIcon', 'Icon of the "rerun tests" action.'));
export const testingRunAllIcon = registerIcon('testing-run-all-icon', Codicon.runAll, localize('testingRunAllIcon', 'Icon of the "run all tests" action.'));
// todo: https://github.com/microsoft/vscode-codicons/issues/72
export const testingDebugAllIcon = registerIcon('testing-debug-all-icon', Codicon.debugAltSmall, localize('testingDebugAllIcon', 'Icon of the "debug all tests" action.'));
export const testingDebugIcon = registerIcon('testing-debug-icon', Codicon.debugAltSmall, localize('testingDebugIcon', 'Icon of the "debug test" action.'));
export const testingCoverageIcon = registerIcon('testing-coverage-icon', Codicon.runCoverage, localize('testingCoverageIcon', 'Icon of the "run test with coverage" action.'));
export const testingCoverageAllIcon = registerIcon('testing-coverage-all-icon', Codicon.runAllCoverage, localize('testingRunAllWithCoverageIcon', 'Icon of the "run all tests with coverage" action.'));
export const testingCancelIcon = registerIcon('testing-cancel-icon', Codicon.debugStop, localize('testingCancelIcon', 'Icon to cancel ongoing test runs.'));
export const testingFilterIcon = registerIcon('testing-filter', Codicon.filter, localize('filterIcon', 'Icon for the \'Filter\' action in the testing view.'));
export const testingHiddenIcon = registerIcon('testing-hidden', Codicon.eyeClosed, localize('hiddenIcon', 'Icon shown beside hidden tests, when they\'ve been shown.'));

export const testingShowAsList = registerIcon('testing-show-as-list-icon', Codicon.listTree, localize('testingShowAsList', 'Icon shown when the test explorer is disabled as a tree.'));
export const testingShowAsTree = registerIcon('testing-show-as-list-icon', Codicon.listFlat, localize('testingShowAsTree', 'Icon shown when the test explorer is disabled as a list.'));

export const testingUpdateProfiles = registerIcon('testing-update-profiles', Codicon.gear, localize('testingUpdateProfiles', 'Icon shown to update test profiles.'));
export const testingRefreshTests = registerIcon('testing-refresh-tests', Codicon.refresh, localize('testingRefreshTests', 'Icon on the button to refresh tests.'));
export const testingTurnContinuousRunOn = registerIcon('testing-turn-continuous-run-on', Codicon.eye, localize('testingTurnContinuousRunOn', 'Icon to turn continuous test runs on.'));
export const testingTurnContinuousRunOff = registerIcon('testing-turn-continuous-run-off', Codicon.eyeClosed, localize('testingTurnContinuousRunOff', 'Icon to turn continuous test runs off.'));
export const testingContinuousIsOn = registerIcon('testing-continuous-is-on', Codicon.eye, localize('testingTurnContinuousRunIsOn', 'Icon when continuous run is on for a test ite,.'));
export const testingCancelRefreshTests = registerIcon('testing-cancel-refresh-tests', Codicon.stop, localize('testingCancelRefreshTests', 'Icon on the button to cancel refreshing tests.'));

export const testingCoverageReport = registerIcon('testing-coverage', Codicon.coverage, localize('testingCoverage', 'Icon representing test coverage'));
export const testingWasCovered = registerIcon('testing-was-covered', Codicon.check, localize('testingWasCovered', 'Icon representing that an element was covered'));
export const testingCoverageMissingBranch = registerIcon('testing-missing-branch', Codicon.question, localize('testingMissingBranch', 'Icon representing a uncovered block without a range'));

export const testingStatesToIcons = new Map<TestResultState, ThemeIcon>([
	[TestResultState.Errored, registerIcon('testing-error-icon', Codicon.issues, localize('testingErrorIcon', 'Icon shown for tests that have an error.'))],
	[TestResultState.Failed, registerIcon('testing-failed-icon', Codicon.error, localize('testingFailedIcon', 'Icon shown for tests that failed.'))],
	[TestResultState.Passed, registerIcon('testing-passed-icon', Codicon.pass, localize('testingPassedIcon', 'Icon shown for tests that passed.'))],
	[TestResultState.Queued, registerIcon('testing-queued-icon', Codicon.history, localize('testingQueuedIcon', 'Icon shown for tests that are queued.'))],
	[TestResultState.Running, spinningLoading],
	[TestResultState.Skipped, registerIcon('testing-skipped-icon', Codicon.debugStepOver, localize('testingSkippedIcon', 'Icon shown for tests that are skipped.'))],
	[TestResultState.Unset, registerIcon('testing-unset-icon', Codicon.circleOutline, localize('testingUnsetIcon', 'Icon shown for tests that are in an unset state.'))],
]);

registerThemingParticipant((theme, collector) => {
	for (const [state, icon] of testingStatesToIcons.entries()) {
		const color = testStatesToIconColors[state];
		const retiredColor = testStatesToRetiredIconColors[state];
		if (!color) {
			continue;
		}
		collector.addRule(`.monaco-workbench ${ThemeIcon.asCSSSelector(icon)} {
			color: ${theme.getColor(color)} !important;
		}`);
		if (!retiredColor) {
			continue;
		}
		collector.addRule(`
			.test-explorer .computed-state.retired${ThemeIcon.asCSSSelector(icon)},
			.testing-run-glyph.retired${ThemeIcon.asCSSSelector(icon)}{
				color: ${theme.getColor(retiredColor)} !important;
			}
		`);
	}

	collector.addRule(`
		.monaco-editor .glyph-margin-widgets ${ThemeIcon.asCSSSelector(testingRunIcon)},
		.monaco-editor .glyph-margin-widgets ${ThemeIcon.asCSSSelector(testingRunAllIcon)},
		.monaco-editor .glyph-margin-widgets ${ThemeIcon.asCSSSelector(testingDebugIcon)},
		.monaco-editor .glyph-margin-widgets ${ThemeIcon.asCSSSelector(testingDebugAllIcon)} {
			color: ${theme.getColor(testingColorRunAction)};
		}
	`);
});
```

--------------------------------------------------------------------------------

````
